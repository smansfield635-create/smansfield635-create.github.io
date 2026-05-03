/*
══════════════════════════════════════════════════════════════════════
FULL_FILE_TNT
FILE=/assets/showroom.globe.instrument.js
TNT_ID=SHOWROOM_GLOBE_INSTRUMENT_ACTUAL_BODIES_RESTORE_TNT_v1
MODE=FULL_FILE_REPLACEMENT
PRECINCT=DEMO_ACTUAL_UNIVERSE_CANONICAL_GLOBE_INSTRUMENT
JURISDICTION=ACTUAL_EARTH_SUN_MOON_RENDERING_AND_CONTROL_API
NON_JURISDICTION=ROUTE_LAYOUT, ROUTE_COPY, GAUGES_SCORING, GLOBAL_NAV, PLANET_1, DEMO_UNIVERSE_DATA_MERGE
EARTH_RULE=RESTORE_ACTUAL_EARTH_BODY
SUN_RULE=RESTORE_ACTUAL_PHYSICAL_SUN_STANDARD
MOON_RULE=RESTORE_ACTUAL_PHYSICAL_MOON_STANDARD
GRAPHICBOX=FORBIDDEN
IMAGE_GENERATION=FORBIDDEN
INLINE_ROUTE_REDRAW=FORBIDDEN
DATA_RULE=DEMO_UNIVERSE_AND_DEMO_ACTUAL_UNIVERSE_DATA_FLY_SEPARATELY
══════════════════════════════════════════════════════════════════════
*/

(() => {
  "use strict";

  const ROOT_SELECTORS = [
    "[data-showroom-globe-root]",
    "[data-showroom-globe-mount]",
    "[data-globe-root]",
    "[data-globe-mount]",
    "[data-planet-mount]",
    "#showroomGlobeMount",
    "#globeMount",
    "#earthGlobeMount"
  ];

  const instances = new WeakMap();

  const BODY_META = {
    earth: {
      label: "Earth",
      description: "Actual Earth body restored: ocean depth, land geometry, clouds, atmosphere, and spherical light."
    },
    sun: {
      label: "Sun",
      description: "Actual Sun standard restored: plasma sphere, corona, granulation, turbulence, and limb intensity."
    },
    moon: {
      label: "Moon",
      description: "Actual Moon standard restored: maria, crater fields, ray systems, regolith texture, and limb shading."
    }
  };

  const SPEEDS = {
    slow: 0.35,
    normal: 1,
    fast: 2.1
  };

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function noise(x, y, seed = 1) {
    const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
    return n - Math.floor(n);
  }

  function clearNode(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function findMount(explicitMount) {
    if (explicitMount instanceof Element) return explicitMount;

    for (const selector of ROOT_SELECTORS) {
      const node = document.querySelector(selector);
      if (node) return node;
    }

    return null;
  }

  function createEl(tag, className) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  }

  function installStyleOnce() {
    if (document.getElementById("dgb-showroom-globe-instrument-style")) return;

    const style = document.createElement("style");
    style.id = "dgb-showroom-globe-instrument-style";
    style.textContent = `
      .dgb-actual-body-shell {
        position: relative;
        width: 100%;
        aspect-ratio: 1;
        display: grid;
        place-items: center;
        overflow: visible;
        isolation: isolate;
      }

      .dgb-actual-body-canvas {
        width: 100%;
        height: 100%;
        display: block;
        border-radius: 50%;
        touch-action: none;
        filter: drop-shadow(0 32px 56px rgba(0,0,0,0.62));
      }

      .dgb-actual-body-shell::before {
        content: "";
        position: absolute;
        inset: -16%;
        z-index: -2;
        border-radius: 999px;
        background:
          radial-gradient(circle at 50% 50%, rgba(120,199,255,0.18), transparent 44%),
          radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08), transparent 62%);
        opacity: 0.9;
        pointer-events: none;
      }

      .dgb-actual-body-shell[data-active-body="sun"]::before {
        inset: -26%;
        background:
          radial-gradient(circle at 50% 50%, rgba(255,220,108,0.34), transparent 38%),
          radial-gradient(circle at 50% 50%, rgba(255,92,24,0.22), transparent 58%),
          radial-gradient(circle at 50% 50%, rgba(255,145,40,0.12), transparent 74%);
      }

      .dgb-actual-body-shell[data-active-body="moon"]::before {
        background:
          radial-gradient(circle at 50% 50%, rgba(238,238,225,0.18), transparent 42%),
          radial-gradient(circle at 50% 50%, rgba(166,207,255,0.08), transparent 66%);
      }
    `;
    document.head.appendChild(style);
  }

  function project(lon, lat, centerLon, cx, cy, r) {
    const lonRad = ((lon - centerLon) * Math.PI) / 180;
    const latRad = (lat * Math.PI) / 180;

    const x = Math.cos(latRad) * Math.sin(lonRad);
    const y = Math.sin(latRad);
    const z = Math.cos(latRad) * Math.cos(lonRad);

    return {
      x: cx + x * r,
      y: cy - y * r,
      z,
      visible: z > -0.05
    };
  }

  function drawProjectedPolygon(ctx, points, centerLon, cx, cy, r, fill, stroke) {
    const projected = points.map(([lon, lat]) => project(lon, lat, centerLon, cx, cy, r));
    const visible = projected.filter((p) => p.visible);

    if (visible.length < 3) return;

    ctx.beginPath();
    let started = false;

    for (const p of projected) {
      if (!p.visible) continue;
      if (!started) {
        ctx.moveTo(p.x, p.y);
        started = true;
      } else {
        ctx.lineTo(p.x, p.y);
      }
    }

    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();

    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = Math.max(1, r * 0.006);
      ctx.globalAlpha = 0.55;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  function drawLatBand(ctx, centerLon, cx, cy, r, lat, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(1, r * 0.004);
    ctx.beginPath();

    let started = false;
    for (let lon = -180; lon <= 180; lon += 4) {
      const p = project(lon, lat, centerLon, cx, cy, r);
      if (!p.visible) {
        started = false;
        continue;
      }
      if (!started) {
        ctx.moveTo(p.x, p.y);
        started = true;
      } else {
        ctx.lineTo(p.x, p.y);
      }
    }

    ctx.stroke();
    ctx.restore();
  }

  function drawCloudBand(ctx, centerLon, cx, cy, r, lat, offset, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = "rgba(255,255,255,0.74)";
    ctx.lineWidth = Math.max(1, r * 0.018);
    ctx.lineCap = "round";
    ctx.beginPath();

    let started = false;
    for (let lon = -180; lon <= 180; lon += 3) {
      const waveLat = lat + Math.sin((lon + offset) * 0.05) * 4 + Math.sin((lon + offset) * 0.13) * 1.6;
      const p = project(lon, waveLat, centerLon, cx, cy, r);
      if (!p.visible) {
        started = false;
        continue;
      }
      if (!started) {
        ctx.moveTo(p.x, p.y);
        started = true;
      } else {
        ctx.lineTo(p.x, p.y);
      }
    }

    ctx.stroke();
    ctx.restore();
  }

  function drawAtmosphere(ctx, cx, cy, r) {
    const atm = ctx.createRadialGradient(cx, cy, r * 0.74, cx, cy, r * 1.08);
    atm.addColorStop(0, "rgba(255,255,255,0)");
    atm.addColorStop(0.72, "rgba(121,199,255,0.08)");
    atm.addColorStop(0.88, "rgba(117,202,255,0.42)");
    atm.addColorStop(1, "rgba(49,119,255,0)");
    ctx.fillStyle = atm;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.08, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(142,215,255,0.68)";
    ctx.lineWidth = Math.max(1, r * 0.012);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawEarth(ctx, cx, cy, r, rotation) {
    const centerLon = -82 + rotation * 22;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    const ocean = ctx.createRadialGradient(cx - r * 0.34, cy - r * 0.33, r * 0.05, cx + r * 0.08, cy + r * 0.12, r * 1.08);
    ocean.addColorStop(0, "#8fe7ff");
    ocean.addColorStop(0.22, "#2da5df");
    ocean.addColorStop(0.52, "#0e4d94");
    ocean.addColorStop(0.78, "#09285e");
    ocean.addColorStop(1, "#010817");
    ctx.fillStyle = ocean;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    const continents = [
      {
        name: "North America",
        fill: "#5f8c4d",
        points: [[-168,72],[-132,70],[-104,62],[-70,57],[-55,45],[-68,22],[-88,15],[-102,18],[-118,31],[-128,48],[-160,55]]
      },
      {
        name: "Central America",
        fill: "#71a34c",
        points: [[-104,22],[-84,20],[-78,12],[-84,8],[-96,14]]
      },
      {
        name: "South America",
        fill: "#4d7f44",
        points: [[-82,12],[-61,8],[-44,-5],[-38,-24],[-51,-55],[-68,-48],[-78,-18]]
      },
      {
        name: "Greenland",
        fill: "#e7eadc",
        points: [[-73,84],[-21,81],[-18,62],[-48,58],[-70,67]]
      },
      {
        name: "Africa",
        fill: "#876f3d",
        points: [[-18,36],[11,37],[34,28],[50,10],[43,-34],[19,-35],[-5,-20],[-17,5]]
      },
      {
        name: "Europe Asia",
        fill: "#7f8b4c",
        points: [[-10,72],[38,70],[84,61],[132,55],[170,48],[154,20],[106,4],[66,18],[36,34],[8,45],[-10,55]]
      },
      {
        name: "Australia",
        fill: "#9b7b3f",
        points: [[112,-11],[154,-12],[151,-39],[116,-42],[109,-24]]
      },
      {
        name: "Antarctica",
        fill: "#f1f2e9",
        points: [[-180,-67],[-120,-72],[-60,-68],[0,-74],[70,-68],[140,-72],[180,-67],[180,-90],[-180,-90]]
      }
    ];

    for (const land of continents) {
      drawProjectedPolygon(ctx, land.points, centerLon, cx, cy, r, land.fill, "rgba(246,238,193,0.42)");
    }

    for (let lat = -60; lat <= 60; lat += 15) {
      drawLatBand(ctx, centerLon, cx, cy, r, lat, "rgba(255,255,255,0.08)", 0.8);
    }

    drawCloudBand(ctx, centerLon, cx, cy, r, 28, rotation * 40, 0.34);
    drawCloudBand(ctx, centerLon, cx, cy, r, 5, rotation * -52, 0.28);
    drawCloudBand(ctx, centerLon, cx, cy, r, -32, rotation * 46, 0.26);

    for (let i = 0; i < 95; i += 1) {
      const lon = -180 + noise(i, 3, 11) * 360;
      const lat = -62 + noise(i, 7, 19) * 124;
      const p = project(lon, lat, centerLon, cx, cy, r);
      if (!p.visible) continue;

      const size = r * (0.01 + noise(i, 9, 4) * 0.035);
      ctx.globalAlpha = 0.08 + noise(i, 6, 2) * 0.14;
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, size * 2.7, size * 0.8, noise(i, 1, 9) * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;

    const nightShade = ctx.createRadialGradient(cx - r * 0.38, cy - r * 0.35, r * 0.08, cx + r * 0.3, cy + r * 0.18, r * 1.12);
    nightShade.addColorStop(0, "rgba(255,255,255,0.18)");
    nightShade.addColorStop(0.46, "rgba(255,255,255,0.02)");
    nightShade.addColorStop(0.76, "rgba(0,17,55,0.2)");
    nightShade.addColorStop(1, "rgba(0,0,0,0.7)");
    ctx.fillStyle = nightShade;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.restore();

    drawAtmosphere(ctx, cx, cy, r);
  }

  function drawSun(ctx, cx, cy, r, rotation) {
    ctx.save();

    for (let layer = 0; layer < 4; layer += 1) {
      const radius = r * (1.12 + layer * 0.16);
      const alpha = 0.18 / (layer + 1);
      const corona = ctx.createRadialGradient(cx, cy, r * 0.82, cx, cy, radius);
      corona.addColorStop(0, `rgba(255,213,84,${alpha})`);
      corona.addColorStop(0.58, `rgba(255,91,26,${alpha * 0.62})`);
      corona.addColorStop(1, "rgba(255,91,26,0)");
      ctx.fillStyle = corona;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < 120; i += 1) {
      const a = (i / 120) * Math.PI * 2 + rotation * 0.16;
      const len = r * (0.08 + noise(i, 2, 30) * 0.34);
      ctx.strokeStyle = `rgba(255,${142 + Math.floor(noise(i, 6, 2) * 88)},42,${0.08 + noise(i, 4, 5) * 0.14})`;
      ctx.lineWidth = Math.max(1, r * (0.004 + noise(i, 7, 7) * 0.012));
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r * 0.94, cy + Math.sin(a) * r * 0.94);
      ctx.lineTo(cx + Math.cos(a) * (r + len), cy + Math.sin(a) * (r + len));
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    const base = ctx.createRadialGradient(cx - r * 0.32, cy - r * 0.34, r * 0.02, cx + r * 0.08, cy + r * 0.1, r);
    base.addColorStop(0, "#fff9b8");
    base.addColorStop(0.16, "#ffd85d");
    base.addColorStop(0.4, "#ff9b24");
    base.addColorStop(0.7, "#df3d13");
    base.addColorStop(1, "#4d0701");
    ctx.fillStyle = base;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    for (let i = 0; i < 720; i += 1) {
      const a = noise(i, 11, 5) * Math.PI * 2;
      const dist = Math.sqrt(noise(i, 17, 9)) * r * 0.98;
      const x = cx + Math.cos(a) * dist;
      const y = cy + Math.sin(a) * dist;
      const w = r * (0.006 + noise(i, 23, 2) * 0.024);
      const h = r * (0.003 + noise(i, 29, 6) * 0.01);
      const n = noise(i, 31, 4);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(a + rotation * 0.5);
      ctx.globalAlpha = 0.1 + n * 0.38;
      ctx.fillStyle = n > 0.6 ? "#fff0a7" : n > 0.28 ? "#ffb13a" : "#c9290d";
      ctx.beginPath();
      ctx.ellipse(0, 0, w * (1.2 + n), h * (1 + n), 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    for (let i = 0; i < 26; i += 1) {
      const y = cy - r * 0.9 + (i / 25) * r * 1.8;
      const wave = Math.sin(rotation * 1.4 + i * 0.7) * r * 0.028;
      ctx.globalAlpha = 0.055;
      ctx.strokeStyle = "#fff0a6";
      ctx.lineWidth = Math.max(1, r * 0.006);
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.95, y + wave);
      ctx.bezierCurveTo(cx - r * 0.36, y - r * 0.06, cx + r * 0.24, y + r * 0.08, cx + r * 0.95, y - wave);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    ctx.restore();

    const limb = ctx.createRadialGradient(cx, cy, r * 0.62, cx, cy, r * 1.03);
    limb.addColorStop(0, "rgba(255,255,255,0)");
    limb.addColorStop(0.72, "rgba(255,197,68,0.08)");
    limb.addColorStop(0.89, "rgba(255,245,143,0.42)");
    limb.addColorStop(1, "rgba(124,22,0,0.48)");
    ctx.fillStyle = limb;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255,230,120,0.7)";
    ctx.lineWidth = Math.max(1, r * 0.014);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawCrater(ctx, x, y, radius, alpha, seed) {
    ctx.save();
    ctx.globalAlpha = alpha;

    const g = ctx.createRadialGradient(x - radius * 0.18, y - radius * 0.18, radius * 0.08, x, y, radius);
    g.addColorStop(0, "rgba(255,255,244,0.28)");
    g.addColorStop(0.42, "rgba(68,70,76,0.42)");
    g.addColorStop(0.76, "rgba(30,33,40,0.22)");
    g.addColorStop(1, "rgba(255,255,239,0.2)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x, y, radius * (1 + noise(seed, 2, 1) * 0.2), radius * (0.72 + noise(seed, 4, 2) * 0.24), noise(seed, 5, 3) * Math.PI, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,235,0.42)";
    ctx.lineWidth = Math.max(1, radius * 0.09);
    ctx.beginPath();
    ctx.ellipse(x - radius * 0.07, y - radius * 0.09, radius, radius * 0.74, 0.18, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = alpha * 0.5;
    ctx.strokeStyle = "rgba(0,0,0,0.48)";
    ctx.beginPath();
    ctx.ellipse(x + radius * 0.1, y + radius * 0.12, radius * 0.86, radius * 0.62, 0.18, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  function drawMoon(ctx, cx, cy, r, rotation) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    const base = ctx.createRadialGradient(cx - r * 0.34, cy - r * 0.34, r * 0.05, cx + r * 0.14, cy + r * 0.17, r * 1.08);
    base.addColorStop(0, "#f7f3df");
    base.addColorStop(0.24, "#dbd8ca");
    base.addColorStop(0.54, "#a9a89f");
    base.addColorStop(0.82, "#737783");
    base.addColorStop(1, "#232837");
    ctx.fillStyle = base;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation * 0.025);

    const maria = [
      [-0.28, -0.27, 0.28, 0.18, -0.42, 0.38],
      [0.18, -0.24, 0.24, 0.15, 0.24, 0.31],
      [0.08, 0.04, 0.34, 0.2, -0.06, 0.32],
      [-0.36, 0.18, 0.2, 0.13, 0.42, 0.26],
      [0.35, 0.27, 0.18, 0.11, -0.3, 0.23],
      [-0.07, 0.39, 0.25, 0.11, 0.16, 0.2],
      [-0.04, -0.12, 0.17, 0.09, 0.62, 0.18]
    ];

    for (const [x, y, w, h, rot, alpha] of maria) {
      ctx.save();
      ctx.translate(x * r, y * r);
      ctx.rotate(rot);
      ctx.globalAlpha = alpha;
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, w * r);
      g.addColorStop(0, "#484c54");
      g.addColorStop(0.72, "#666a72");
      g.addColorStop(1, "rgba(120,123,126,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(0, 0, w * r, h * r, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    const craters = [
      [-0.43, -0.43, 0.067, 0.66],
      [-0.18, -0.53, 0.042, 0.46],
      [0.16, -0.46, 0.054, 0.54],
      [0.43, -0.33, 0.078, 0.62],
      [-0.57, -0.08, 0.052, 0.44],
      [-0.18, -0.08, 0.092, 0.52],
      [0.26, -0.04, 0.047, 0.44],
      [0.5, 0.08, 0.046, 0.46],
      [-0.43, 0.34, 0.072, 0.52],
      [-0.06, 0.29, 0.057, 0.42],
      [0.29, 0.35, 0.078, 0.58],
      [0.05, 0.56, 0.036, 0.36],
      [-0.02, -0.32, 0.03, 0.32],
      [0.53, 0.34, 0.035, 0.34]
    ];

    craters.forEach(([x, y, size, alpha], index) => drawCrater(ctx, x * r, y * r, size * r, alpha, index));

    for (let i = 0; i < 420; i += 1) {
      const a = noise(i, 4, 31) * Math.PI * 2;
      const dist = Math.sqrt(noise(i, 8, 22)) * r * 0.96;
      const x = Math.cos(a) * dist;
      const y = Math.sin(a) * dist;
      const size = r * (0.003 + noise(i, 1, 12) * 0.01);
      const alpha = 0.06 + noise(i, 2, 18) * 0.14;
      drawCrater(ctx, x, y, size, alpha, i + 50);
    }

    drawRaySystem(-0.43 * r, -0.43 * r, r * 0.44, 22, 0.16, rotation);
    drawRaySystem(0.29 * r, 0.35 * r, r * 0.34, 18, 0.14, -rotation * 0.4);

    ctx.restore();

    for (let i = 0; i < 1800; i += 1) {
      const a = noise(i, 17, 97) * Math.PI * 2;
      const dist = Math.sqrt(noise(i, 29, 82)) * r;
      const x = cx + Math.cos(a) * dist;
      const y = cy + Math.sin(a) * dist;
      const n = noise(i, 41, 12);
      ctx.globalAlpha = 0.025 + n * 0.045;
      ctx.fillStyle = n > 0.52 ? "#fffef0" : "#62666e";
      ctx.fillRect(x, y, Math.max(1, r * 0.003), Math.max(1, r * 0.003));
    }

    ctx.globalAlpha = 1;

    const earthshine = ctx.createRadialGradient(cx - r * 0.48, cy - r * 0.14, 0, cx - r * 0.48, cy - r * 0.14, r * 1.02);
    earthshine.addColorStop(0, "rgba(166,207,255,0.16)");
    earthshine.addColorStop(0.32, "rgba(166,207,255,0.07)");
    earthshine.addColorStop(1, "rgba(166,207,255,0)");
    ctx.fillStyle = earthshine;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    const shade = ctx.createRadialGradient(cx - r * 0.32, cy - r * 0.34, r * 0.08, cx + r * 0.26, cy + r * 0.24, r * 1.1);
    shade.addColorStop(0, "rgba(255,255,244,0.28)");
    shade.addColorStop(0.42, "rgba(235,235,220,0.08)");
    shade.addColorStop(0.74, "rgba(70,76,88,0.12)");
    shade.addColorStop(1, "rgba(0,0,0,0.58)");
    ctx.fillStyle = shade;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.restore();

    ctx.strokeStyle = "rgba(245,243,226,0.36)";
    ctx.lineWidth = Math.max(1, r * 0.012);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    function drawRaySystem(x, y, length, count, alpha, phase) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = "rgba(255,255,237,0.48)";
      for (let i = 0; i < count; i += 1) {
        const a = (Math.PI * 2 * i) / count + phase * 0.05;
        const rayLength = length * (0.44 + noise(i, 9, 17) * 0.58);
        ctx.lineWidth = Math.max(1, r * (0.002 + noise(i, 11, 3) * 0.004));
        ctx.beginPath();
        ctx.moveTo(x + cx, y + cy);
        ctx.lineTo(x + cx + Math.cos(a) * rayLength, y + cy + Math.sin(a) * rayLength);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  function createInstance(root, options = {}) {
    installStyleOnce();

    clearNode(root);

    root.dataset.instrumentMounted = "true";
    root.dataset.actualBodiesRestored = "true";
    root.dataset.graphicbox = "false";
    root.dataset.imageGeneration = "false";

    const shell = createEl("div", "dgb-actual-body-shell");
    const canvas = createEl("canvas", "dgb-actual-body-canvas");
    canvas.width = 1400;
    canvas.height = 1400;

    shell.appendChild(canvas);
    root.appendChild(shell);

    const ctx = canvas.getContext("2d", { alpha: true });

    const instance = {
      root,
      shell,
      canvas,
      ctx,
      state: {
        body: normalizeBody(options.body || root.dataset.activeBody || "earth"),
        running: true,
        direction: 1,
        speedName: "normal",
        speed: SPEEDS.normal,
        zoom: 1,
        rotation: 0,
        last: performance.now(),
        destroyed: false
      },
      setBody(body) {
        this.state.body = normalizeBody(body);
        this.root.dataset.activeBody = this.state.body;
        this.shell.dataset.activeBody = this.state.body;
        this.render();
        this.emitStatus();
      },
      setSpeed(payload) {
        const speedName = typeof payload === "string" ? payload : payload && payload.speedName;
        if (!SPEEDS[speedName]) return;
        this.state.speedName = speedName;
        this.state.speed = SPEEDS[speedName];
        this.emitStatus();
      },
      setZoom(payload) {
        const zoom = typeof payload === "number" ? payload : payload && (payload.zoom || payload.scale);
        if (!Number.isFinite(Number(zoom))) return;
        this.state.zoom = clamp(Number(zoom), 0.7, 2.4);
        this.emitStatus();
      },
      start() {
        this.state.running = true;
        this.emitStatus();
      },
      pause() {
        this.state.running = false;
        this.emitStatus();
      },
      resume() {
        this.state.running = true;
        this.emitStatus();
      },
      reset() {
        this.state.rotation = 0;
        this.render();
        this.emitStatus();
      },
      reverse() {
        this.state.direction *= -1;
        this.emitStatus();
      },
      render() {
        const dpr = clamp(window.devicePixelRatio || 1, 1, 2);
        const rect = this.canvas.getBoundingClientRect();
        const size = Math.max(900, Math.floor(Math.min(rect.width || 900, rect.height || 900) * dpr));

        if (this.canvas.width !== size || this.canvas.height !== size) {
          this.canvas.width = size;
          this.canvas.height = size;
        }

        const w = this.canvas.width;
        const h = this.canvas.height;
        const cx = w / 2;
        const cy = h / 2;
        const r = Math.min(w, h) * 0.43;

        this.ctx.clearRect(0, 0, w, h);

        if (this.state.body === "earth") drawEarth(this.ctx, cx, cy, r, this.state.rotation);
        if (this.state.body === "sun") drawSun(this.ctx, cx, cy, r, this.state.rotation);
        if (this.state.body === "moon") drawMoon(this.ctx, cx, cy, r, this.state.rotation);
      },
      tick(now) {
        if (this.state.destroyed) return;

        const dt = Math.min(50, now - this.state.last);
        this.state.last = now;

        if (this.state.running) {
          const bodyFactor = this.state.body === "sun" ? 0.0014 : this.state.body === "moon" ? 0.00055 : 0.00085;
          this.state.rotation += dt * bodyFactor * this.state.speed * this.state.direction;
          this.render();
        }

        requestAnimationFrame((next) => this.tick(next));
      },
      emitStatus() {
        window.dispatchEvent(new CustomEvent("showroom:globe:mounted", {
          detail: {
            mounted: true,
            body: this.state.body,
            speedName: this.state.speedName,
            direction: this.state.direction > 0 ? "forward" : "reverse",
            zoom: this.state.zoom,
            actualBodiesRestored: true,
            graphicbox: false,
            imageGeneration: false
          }
        }));
      }
    };

    instances.set(root, instance);

    instance.setBody(instance.state.body);
    instance.emitStatus();
    requestAnimationFrame((now) => instance.tick(now));

    return instance;
  }

  function normalizeBody(body) {
    const value = String(body || "earth").toLowerCase();
    if (value.includes("sun")) return "sun";
    if (value.includes("moon")) return "moon";
    return "earth";
  }

  function mount(options = {}) {
    const root = findMount(options.mount || options.root || options.target);
    if (!root) return null;

    let instance = instances.get(root);
    if (!instance) {
      instance = createInstance(root, options);
    }

    if (options.body) instance.setBody(options.body);
    if (options.speedName) instance.setSpeed(options.speedName);
    if (options.zoom) instance.setZoom(options.zoom);

    return instance;
  }

  function activeInstance(payload = {}) {
    const root = findMount(payload.mount || payload.root || payload.target);
    if (!root) return null;
    return instances.get(root) || mount({ mount: root });
  }

  const api = {
    version: "SHOWROOM_GLOBE_INSTRUMENT_ACTUAL_BODIES_RESTORE_TNT_v1",
    mount,
    setBody(payload = {}) {
      const instance = activeInstance(payload);
      if (instance) instance.setBody(payload.body || payload);
    },
    setSpeed(payload = {}) {
      const instance = activeInstance(payload);
      if (instance) instance.setSpeed(payload.speedName || payload);
    },
    setZoom(payload = {}) {
      const instance = activeInstance(payload);
      if (instance) instance.setZoom(payload.zoom || payload);
    },
    start(payload = {}) {
      const instance = activeInstance(payload);
      if (instance) instance.start();
    },
    pause(payload = {}) {
      const instance = activeInstance(payload);
      if (instance) instance.pause();
    },
    resume(payload = {}) {
      const instance = activeInstance(payload);
      if (instance) instance.resume();
    },
    reset(payload = {}) {
      const instance = activeInstance(payload);
      if (instance) instance.reset();
    },
    reverse(payload = {}) {
      const instance = activeInstance(payload);
      if (instance) instance.reverse();
    },
    status(payload = {}) {
      const instance = activeInstance(payload);
      if (!instance) return { mounted: false };
      return {
        mounted: true,
        body: instance.state.body,
        speedName: instance.state.speedName,
        direction: instance.state.direction > 0 ? "forward" : "reverse",
        actualBodiesRestored: true
      };
    }
  };

  function wireEvents() {
    window.addEventListener("showroom:globe:mount", (event) => {
      mount(event.detail || {});
    });

    window.addEventListener("showroom:globe:setBody", (event) => {
      api.setBody(event.detail || {});
    });

    window.addEventListener("showroom:globe:setSpeed", (event) => {
      api.setSpeed(event.detail || {});
    });

    window.addEventListener("showroom:globe:setZoom", (event) => {
      api.setZoom(event.detail || {});
    });

    window.addEventListener("showroom:globe:start", (event) => {
      api.start(event.detail || {});
    });

    window.addEventListener("showroom:globe:pause", (event) => {
      api.pause(event.detail || {});
    });

    window.addEventListener("showroom:globe:resume", (event) => {
      api.resume(event.detail || {});
    });

    window.addEventListener("showroom:globe:reset", (event) => {
      api.reset(event.detail || {});
    });

    window.addEventListener("showroom:globe:reverse", (event) => {
      api.reverse(event.detail || {});
    });

    window.addEventListener("showroom:globe:standard-request", (event) => {
      const detail = event.detail || {};
      const instance = activeInstance(detail);
      if (instance) instance.emitStatus();
    });
  }

  function autoMount() {
    const root = findMount();
    if (root) mount({ mount: root, body: root.dataset.activeBody || "earth" });
  }

  window.ShowroomGlobeInstrument = api;
  window.DiamondGateBridgeShowroomGlobe = api;
  window.showroomGlobeInstrument = api;
  window.ShowroomGlobe = api;

  window.DiamondGateBridge = window.DiamondGateBridge || {};
  window.DiamondGateBridge.ShowroomGlobeInstrument = api;
  window.DiamondGateBridge.ShowroomGlobe = api;
  window.DiamondGateBridge.showroomGlobeInstrument = api;

  wireEvents();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoMount, { once: true });
  } else {
    autoMount();
  }

  window.addEventListener("load", autoMount, { once: true });
})();

/* /assets/showroom.globe.render.js
   SHOWROOM_GLOBE_ORTHOGRAPHIC_VECTOR_SPHERE_RENDER_TNT_v1

   ROLE:
   Render authority only.

   PURPOSE:
   Stop flat texture-strip / slab behavior.
   Draw Earth, Sun, and Moon as projected spherical bodies.
   No texture dependency.
   No route ownership.
   No instrument ownership.

   OWNS:
   Earth/Sun/Moon body drawing.
   Orthographic sphere projection.
   Visible-hemisphere surface expression.

   DOES_NOT_OWN:
   Route copy.
   Labels.
   Buttons.
   Controls.
   Mount selection.
   Instrument API.
   Gauges.
*/

(function bindShowroomGlobeOrthographicVectorSphereRender(global) {
  "use strict";

  const VERSION = "SHOWROOM_GLOBE_ORTHOGRAPHIC_VECTOR_SPHERE_RENDER_TNT_v1";
  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;
  const BODY_SET = new Set(["earth", "sun", "moon"]);

  const earthLand = [
    {
      name: "north-america",
      fill: "rgba(70, 146, 82, 0.96)",
      stroke: "rgba(235, 232, 178, 0.16)",
      points: [[-168, 70], [-138, 72], [-105, 58], [-84, 50], [-70, 30], [-91, 15], [-112, 20], [-126, 32], [-151, 52]]
    },
    {
      name: "south-america",
      fill: "rgba(61, 132, 78, 0.96)",
      stroke: "rgba(235, 232, 178, 0.15)",
      points: [[-81, 12], [-62, 8], [-44, -11], [-48, -34], [-66, -55], [-76, -35], [-82, -8]]
    },
    {
      name: "greenland",
      fill: "rgba(226, 240, 232, 0.92)",
      stroke: "rgba(255, 255, 255, 0.16)",
      points: [[-54, 82], [-22, 74], [-36, 61], [-62, 68]]
    },
    {
      name: "eurasia",
      fill: "rgba(178, 139, 73, 0.96)",
      stroke: "rgba(235, 232, 178, 0.16)",
      points: [[-10, 68], [32, 71], [82, 61], [136, 55], [151, 38], [117, 18], [76, 20], [45, 6], [18, 30], [-10, 36]]
    },
    {
      name: "africa",
      fill: "rgba(157, 119, 64, 0.96)",
      stroke: "rgba(235, 232, 178, 0.16)",
      points: [[-18, 35], [16, 37], [35, 14], [31, -34], [11, -36], [-12, -6]]
    },
    {
      name: "australia",
      fill: "rgba(180, 132, 66, 0.96)",
      stroke: "rgba(235, 232, 178, 0.14)",
      points: [[112, -11], [153, -24], [145, -43], [114, -36]]
    },
    {
      name: "antarctica",
      fill: "rgba(238, 247, 255, 0.94)",
      stroke: "rgba(255, 255, 255, 0.14)",
      points: [[-180, -70], [-120, -76], [-60, -72], [0, -78], [60, -72], [120, -76], [180, -70], [180, -90], [-180, -90]]
    }
  ];

  const moonMaria = [
    { lon: -48, lat: 18, rx: 0.18, ry: 0.08, angle: -0.2 },
    { lon: 5, lat: 22, rx: 0.15, ry: 0.07, angle: 0.12 },
    { lon: 24, lat: -8, rx: 0.2, ry: 0.09, angle: 0.04 },
    { lon: -38, lat: -24, rx: 0.16, ry: 0.075, angle: 0.2 },
    { lon: 64, lat: -22, rx: 0.13, ry: 0.06, angle: -0.12 }
  ];

  const moonCraters = [];
  const solarCells = [];
  const earthCloudSeeds = [];

  for (let i = 0; i < 120; i += 1) {
    moonCraters.push({
      lon: -175 + rand(i + 10) * 350,
      lat: -66 + rand(i + 20) * 132,
      size: 0.01 + Math.pow(rand(i + 30), 2.2) * 0.055,
      alpha: 0.11 + rand(i + 40) * 0.16
    });
  }

  for (let i = 0; i < 190; i += 1) {
    solarCells.push({
      lon: -180 + rand(i + 300) * 360,
      lat: -70 + rand(i + 400) * 140,
      size: 0.014 + rand(i + 500) * 0.035,
      stretch: 1.6 + rand(i + 600) * 2.8,
      angle: rand(i + 700) * TAU,
      alpha: 0.08 + rand(i + 800) * 0.2
    });
  }

  for (let i = 0; i < 130; i += 1) {
    earthCloudSeeds.push({
      lon: -180 + rand(i + 900) * 360,
      lat: -58 + rand(i + 1000) * 116,
      length: 0.05 + rand(i + 1100) * 0.14,
      width: 0.008 + rand(i + 1200) * 0.02,
      angle: rand(i + 1300) * TAU,
      alpha: 0.12 + rand(i + 1400) * 0.22
    });
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function normalizeBody(body) {
    body = String(body || "earth").toLowerCase();
    return BODY_SET.has(body) ? body : "earth";
  }

  function rand(seed) {
    const x = Math.sin(seed * 12.9898) * 43758.5453123;
    return x - Math.floor(x);
  }

  function bodyTilt(body) {
    if (body === "sun") return -7.25 * DEG;
    if (body === "moon") return -6.68 * DEG;
    return -23.5 * DEG;
  }

  function project(lonDeg, latDeg, centerLon, tilt, cx, cy, radius) {
    const lon = (lonDeg - centerLon) * DEG;
    const lat = latDeg * DEG;

    const cosLat = Math.cos(lat);
    const x0 = cosLat * Math.sin(lon);
    const y0 = Math.sin(lat);
    const z0 = cosLat * Math.cos(lon);

    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);

    const x = x0;
    const y = y0 * cosT - z0 * sinT;
    const z = y0 * sinT + z0 * cosT;

    return {
      x: cx + x * radius,
      y: cy - y * radius,
      z,
      visible: z > 0.01,
      scale: clamp(z, 0, 1)
    };
  }

  function drawProjectedPolygon(ctx, polygon, centerLon, tilt, cx, cy, radius) {
    const points = densifyPolygon(polygon.points, 7)
      .map(([lon, lat]) => project(lon, lat, centerLon, tilt, cx, cy, radius));

    const visible = points.filter((point) => point.visible);

    if (visible.length < 3) return;

    ctx.save();
    clipSphere(ctx, cx, cy, radius);

    ctx.beginPath();
    visible.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });

    ctx.closePath();
    ctx.fillStyle = polygon.fill;
    ctx.fill();

    ctx.strokeStyle = polygon.stroke;
    ctx.lineWidth = Math.max(1, radius * 0.004);
    ctx.stroke();

    ctx.restore();
  }

  function densifyPolygon(points, stepDeg) {
    const out = [];

    for (let i = 0; i < points.length; i += 1) {
      const current = points[i];
      const next = points[(i + 1) % points.length];

      const lon1 = current[0];
      const lat1 = current[1];
      const lon2 = next[0];
      const lat2 = next[1];

      out.push(current);

      const distance = Math.max(Math.abs(lon2 - lon1), Math.abs(lat2 - lat1));
      const steps = Math.max(1, Math.floor(distance / stepDeg));

      for (let s = 1; s < steps; s += 1) {
        const t = s / steps;
        out.push([
          lon1 + (lon2 - lon1) * t,
          lat1 + (lat2 - lat1) * t
        ]);
      }
    }

    return out;
  }

  function clipSphere(ctx, cx, cy, radius) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.closePath();
    ctx.clip();
  }

  function drawEarth(ctx, cx, cy, radius, centerLon) {
    const tilt = bodyTilt("earth");

    const ocean = ctx.createRadialGradient(cx - radius * 0.35, cy - radius * 0.36, radius * 0.04, cx, cy, radius);
    ocean.addColorStop(0, "#76e7ff");
    ocean.addColorStop(0.2, "#148dcc");
    ocean.addColorStop(0.58, "#064d9f");
    ocean.addColorStop(1, "#011735");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.fillStyle = ocean;
    ctx.fill();
    ctx.restore();

    earthLand.forEach((polygon) => drawProjectedPolygon(ctx, polygon, centerLon, tilt, cx, cy, radius));

    drawEarthTextureDots(ctx, centerLon, tilt, cx, cy, radius);
    drawCloudBands(ctx, centerLon, tilt, cx, cy, radius);
    drawCloudSeeds(ctx, centerLon, tilt, cx, cy, radius);
    drawOptics(ctx, cx, cy, radius, "earth");
  }

  function drawEarthTextureDots(ctx, centerLon, tilt, cx, cy, radius) {
    ctx.save();
    clipSphere(ctx, cx, cy, radius);

    for (let i = 0; i < 220; i += 1) {
      const lon = -180 + rand(i + 2000) * 360;
      const lat = -58 + rand(i + 2100) * 116;
      const p = project(lon, lat, centerLon, tilt, cx, cy, radius);

      if (!p.visible) continue;

      const size = radius * (0.006 + rand(i + 2200) * 0.016) * p.scale;

      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, TAU);
      ctx.fillStyle = `rgba(95, 190, 116, ${0.05 + rand(i + 2300) * 0.08})`;
      ctx.fill();
    }

    ctx.restore();
  }

  function drawCloudBands(ctx, centerLon, tilt, cx, cy, radius) {
    const bands = [
      { lat: 27, alpha: 0.18, width: 0.018, phase: 0 },
      { lat: 5, alpha: 0.2, width: 0.015, phase: 1.8 },
      { lat: -32, alpha: 0.17, width: 0.017, phase: 3.1 }
    ];

    ctx.save();
    clipSphere(ctx, cx, cy, radius);

    bands.forEach((band) => {
      ctx.beginPath();

      let active = false;

      for (let lon = -180; lon <= 180; lon += 6) {
        const lat = band.lat + Math.sin((lon * 0.045) + band.phase) * 5 + Math.sin((lon * 0.11) + band.phase) * 2;
        const p = project(lon, lat, centerLon, tilt, cx, cy, radius);

        if (!p.visible) {
          active = false;
          continue;
        }

        if (!active) {
          ctx.moveTo(p.x, p.y);
          active = true;
        } else {
          ctx.lineTo(p.x, p.y);
        }
      }

      ctx.strokeStyle = `rgba(255, 255, 255, ${band.alpha})`;
      ctx.lineWidth = Math.max(1.5, radius * band.width);
      ctx.lineCap = "round";
      ctx.stroke();
    });

    ctx.restore();
  }

  function drawCloudSeeds(ctx, centerLon, tilt, cx, cy, radius) {
    ctx.save();
    clipSphere(ctx, cx, cy, radius);

    earthCloudSeeds.forEach((cloud) => {
      const p = project(cloud.lon, cloud.lat, centerLon, tilt, cx, cy, radius);

      if (!p.visible) return;

      const w = radius * cloud.length * p.scale;
      const h = radius * cloud.width * p.scale;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(cloud.angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, w, h, 0, 0, TAU);
      ctx.fillStyle = `rgba(255, 255, 255, ${cloud.alpha * p.scale})`;
      ctx.fill();
      ctx.restore();
    });

    ctx.restore();
  }

  function drawSun(ctx, cx, cy, radius, centerLon) {
    const tilt = bodyTilt("sun");

    const base = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.36, radius * 0.04, cx, cy, radius);
    base.addColorStop(0, "#fff3a2");
    base.addColorStop(0.18, "#ffc145");
    base.addColorStop(0.48, "#ff8420");
    base.addColorStop(0.76, "#cf4314");
    base.addColorStop(1, "#651706");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.fillStyle = base;
    ctx.shadowColor = "rgba(255, 139, 35, 0.45)";
    ctx.shadowBlur = radius * 0.12;
    ctx.fill();
    ctx.restore();

    ctx.save();
    clipSphere(ctx, cx, cy, radius);

    solarCells.forEach((cell) => {
      const p = project(cell.lon, cell.lat, centerLon, tilt, cx, cy, radius);

      if (!p.visible) return;

      const size = radius * cell.size * p.scale;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(cell.angle + centerLon * DEG);
      ctx.scale(cell.stretch, 0.72);
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, TAU);
      ctx.fillStyle = `rgba(255, 226, 102, ${cell.alpha * p.scale})`;
      ctx.fill();
      ctx.restore();
    });

    for (let i = 0; i < 9; i += 1) {
      ctx.beginPath();

      let active = false;
      const lat = -55 + i * 14;

      for (let lon = -180; lon <= 180; lon += 5) {
        const waveLat = lat + Math.sin((lon * 0.05) + i) * 4;
        const p = project(lon, waveLat, centerLon, tilt, cx, cy, radius);

        if (!p.visible) {
          active = false;
          continue;
        }

        if (!active) {
          ctx.moveTo(p.x, p.y);
          active = true;
        } else {
          ctx.lineTo(p.x, p.y);
        }
      }

      ctx.strokeStyle = "rgba(255, 238, 126, 0.12)";
      ctx.lineWidth = Math.max(1.2, radius * 0.012);
      ctx.stroke();
    }

    ctx.restore();

    drawOptics(ctx, cx, cy, radius, "sun");
  }

  function drawMoon(ctx, cx, cy, radius, centerLon) {
    const tilt = bodyTilt("moon");

    const base = ctx.createRadialGradient(cx - radius * 0.34, cy - radius * 0.36, radius * 0.04, cx, cy, radius);
    base.addColorStop(0, "#f5f4df");
    base.addColorStop(0.34, "#cfd0c7");
    base.addColorStop(0.7, "#939a9b");
    base.addColorStop(1, "#4f5862");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.fillStyle = base;
    ctx.fill();
    ctx.restore();

    ctx.save();
    clipSphere(ctx, cx, cy, radius);

    moonMaria.forEach((basin) => {
      const p = project(basin.lon, basin.lat, centerLon, tilt, cx, cy, radius);

      if (!p.visible) return;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(basin.angle);
      ctx.scale(1, Math.max(0.25, p.scale));
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * basin.rx * p.scale, radius * basin.ry * p.scale, 0, 0, TAU);
      ctx.fillStyle = `rgba(59, 64, 66, ${0.22 * p.scale})`;
      ctx.fill();
      ctx.restore();
    });

    moonCraters.forEach((crater) => {
      const p = project(crater.lon, crater.lat, centerLon, tilt, cx, cy, radius);

      if (!p.visible) return;

      const size = radius * crater.size * p.scale;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.scale(1, Math.max(0.28, p.scale));
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, TAU);
      ctx.fillStyle = `rgba(45, 49, 52, ${crater.alpha * p.scale})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(255, 255, 245, ${0.18 * p.scale})`;
      ctx.lineWidth = Math.max(1, size * 0.13);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(-size * 0.22, -size * 0.22, size * 0.42, 0, TAU);
      ctx.fillStyle = `rgba(255, 255, 245, ${0.1 * p.scale})`;
      ctx.fill();
      ctx.restore();
    });

    ctx.restore();

    drawOptics(ctx, cx, cy, radius, "moon");
  }

  function drawOptics(ctx, cx, cy, radius, body) {
    ctx.save();
    clipSphere(ctx, cx, cy, radius);

    const highlight = ctx.createRadialGradient(cx - radius * 0.34, cy - radius * 0.36, radius * 0.04, cx, cy, radius);

    if (body === "sun") {
      highlight.addColorStop(0, "rgba(255,255,225,0.35)");
      highlight.addColorStop(0.24, "rgba(255,238,120,0.13)");
      highlight.addColorStop(1, "rgba(255,255,255,0)");
    } else {
      highlight.addColorStop(0, "rgba(255,255,255,0.24)");
      highlight.addColorStop(0.28, "rgba(255,255,255,0.06)");
      highlight.addColorStop(1, "rgba(255,255,255,0)");
    }

    ctx.fillStyle = highlight;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    const terminator = ctx.createLinearGradient(cx - radius * 0.52, cy - radius, cx + radius, cy + radius);
    terminator.addColorStop(0, "rgba(255,255,255,0)");
    terminator.addColorStop(0.55, "rgba(0,0,0,0)");
    terminator.addColorStop(1, body === "sun" ? "rgba(80,12,0,0.14)" : "rgba(0,0,0,0.44)");

    ctx.fillStyle = terminator;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.restore();

    if (body === "earth") {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.014, 0, TAU);
      ctx.strokeStyle = "rgba(126,219,255,0.46)";
      ctx.lineWidth = Math.max(2, radius * 0.028);
      ctx.shadowColor = "rgba(126,219,255,0.42)";
      ctx.shadowBlur = radius * 0.07;
      ctx.stroke();
      ctx.restore();
    }

    if (body === "sun") {
      const corona = ctx.createRadialGradient(cx, cy, radius * 0.86, cx, cy, radius * 1.2);
      corona.addColorStop(0, "rgba(255,197,63,0.17)");
      corona.addColorStop(0.58, "rgba(255,114,26,0.12)");
      corona.addColorStop(1, "rgba(255,114,26,0)");

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.2, 0, TAU);
      ctx.fillStyle = corona;
      ctx.fill();
      ctx.restore();
    }

    let stroke = "rgba(236,235,219,0.54)";
    let glow = "rgba(255,255,244,0.18)";

    if (body === "earth") {
      stroke = "rgba(134,225,255,0.64)";
      glow = "rgba(126,219,255,0.36)";
    }

    if (body === "sun") {
      stroke = "rgba(255,224,116,0.78)";
      glow = "rgba(255,166,34,0.54)";
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = Math.max(2, radius * 0.01);
    ctx.shadowColor = glow;
    ctx.shadowBlur = radius * 0.07;
    ctx.stroke();
    ctx.restore();
  }

  function createRenderer(canvas) {
    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });

    function resize() {
      const parent = canvas.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : canvas.getBoundingClientRect();
      const cssSize = clamp(rect.width || canvas.clientWidth || 420, 260, 1080);
      const dpr = clamp(global.devicePixelRatio || 1, 1, 2.5);
      const pixelSize = Math.round(cssSize * dpr);

      if (canvas.width !== pixelSize || canvas.height !== pixelSize) {
        canvas.width = pixelSize;
        canvas.height = pixelSize;
      }
    }

    function render(options) {
      resize();

      const body = normalizeBody(options && options.body);
      const longitude = Number(options && options.longitude) || 0;
      const zoom = clamp(Number(options && options.zoom) || 100, 70, 240);
      const size = Math.min(canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = size * 0.395 * (zoom / 100);
      const centerLon = longitude * 360;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (body === "sun") {
        drawSun(ctx, cx, cy, radius, centerLon);
      } else if (body === "moon") {
        drawMoon(ctx, cx, cy, radius, centerLon);
      } else {
        drawEarth(ctx, cx, cy, radius, centerLon);
      }

      return {
        ok: true,
        version: VERSION,
        body,
        projection: "orthographic-vector-sphere",
        textureRequired: false,
        rendererOwns: "body-drawing-only"
      };
    }

    resize();

    return {
      VERSION,
      version: VERSION,
      render,
      resize,
      getStatus() {
        return {
          ok: true,
          version: VERSION,
          role: "render-authority",
          projection: "orthographic-vector-sphere",
          ownsBodyDrawing: true,
          ownsRoute: false,
          ownsControls: false,
          ownsLabels: false,
          textureRequired: false
        };
      }
    };
  }

  function renderToCanvas(canvas, options) {
    return createRenderer(canvas).render(options || {});
  }

  const api = {
    VERSION,
    version: VERSION,
    createRenderer,
    renderToCanvas,
    getStatus() {
      return {
        ok: true,
        version: VERSION,
        role: "render-file",
        projection: "orthographic-vector-sphere",
        ownsBodyDrawing: true,
        ownsRoute: false,
        ownsControls: false,
        ownsLabels: false,
        textureRequired: false
      };
    }
  };

  global.DGBShowroomGlobeRender = api;
  global.DiamondGateBridge = global.DiamondGateBridge || {};
  global.DiamondGateBridge.DGBShowroomGlobeRender = api;
})(typeof window !== "undefined" ? window : globalThis);

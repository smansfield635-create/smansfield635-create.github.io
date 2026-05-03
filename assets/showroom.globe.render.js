/* /assets/showroom.globe.render.js
   SHOWROOM_GLOBE_SEAMLESS_4K_VECTOR_SPHERE_RENDER_TNT_v1

   ROLE:
   Render authority only.

   PURPOSE:
   Remove visible seam / screwed-together-panel look.
   Preserve globe physics, geometry, axis behavior, and shadows.
   Improve perceived 4K-quality surface definition without external texture dependency.

   OWNS:
   Earth/Sun/Moon body drawing.
   Orthographic visible-hemisphere geometry.
   Seamless surface expression.

   DOES_NOT_OWN:
   Route copy.
   Labels.
   Buttons.
   Controls.
   Mount selection.
   Instrument API.
   Gauges.
*/

(function bindShowroomGlobeSeamless4KVectorSphereRender(global) {
  "use strict";

  const VERSION = "SHOWROOM_GLOBE_SEAMLESS_4K_VECTOR_SPHERE_RENDER_TNT_v1";
  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;
  const BODY_SET = new Set(["earth", "sun", "moon"]);

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
      visible: z > 0.018,
      scale: clamp(0.25 + z * 0.75, 0.25, 1)
    };
  }

  function clipSphere(ctx, cx, cy, radius) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.closePath();
    ctx.clip();
  }

  function drawProjectedEllipse(ctx, item, centerLon, tilt, cx, cy, radius, fill, stroke) {
    const p = project(item.lon, item.lat, centerLon, tilt, cx, cy, radius);
    if (!p.visible) return;

    const zScale = p.scale;
    const rx = radius * item.rx * zScale;
    const ry = radius * item.ry * Math.max(0.35, zScale);
    const angle = (item.angle || 0) + (centerLon * 0.003);

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, TAU);
    ctx.fillStyle = fill;
    ctx.fill();

    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = Math.max(1, radius * 0.004 * zScale);
      ctx.stroke();
    }

    ctx.restore();
  }

  const earthLandBlobs = [
    { lon: -118, lat: 54, rx: 0.17, ry: 0.08, angle: -0.15, fill: "rgba(64, 143, 80, 0.94)" },
    { lon: -96, lat: 41, rx: 0.16, ry: 0.08, angle: 0.18, fill: "rgba(76, 151, 82, 0.94)" },
    { lon: -86, lat: 22, rx: 0.09, ry: 0.055, angle: -0.35, fill: "rgba(68, 135, 70, 0.9)" },
    { lon: -62, lat: -13, rx: 0.11, ry: 0.18, angle: 0.22, fill: "rgba(58, 132, 75, 0.94)" },
    { lon: -68, lat: -38, rx: 0.07, ry: 0.12, angle: 0.04, fill: "rgba(62, 128, 72, 0.9)" },
    { lon: -42, lat: 72, rx: 0.09, ry: 0.045, angle: -0.18, fill: "rgba(225, 238, 230, 0.9)" },
    { lon: 18, lat: 8, rx: 0.12, ry: 0.18, angle: -0.07, fill: "rgba(153, 119, 66, 0.94)" },
    { lon: 31, lat: -17, rx: 0.09, ry: 0.13, angle: 0.08, fill: "rgba(144, 111, 63, 0.9)" },
    { lon: 48, lat: 51, rx: 0.25, ry: 0.09, angle: 0.06, fill: "rgba(178, 139, 73, 0.94)" },
    { lon: 86, lat: 34, rx: 0.22, ry: 0.08, angle: -0.08, fill: "rgba(172, 135, 75, 0.92)" },
    { lon: 125, lat: 53, rx: 0.16, ry: 0.07, angle: 0.18, fill: "rgba(85, 145, 78, 0.92)" },
    { lon: 134, lat: -26, rx: 0.1, ry: 0.055, angle: -0.18, fill: "rgba(176, 132, 68, 0.94)" },
    { lon: 0, lat: -79, rx: 0.55, ry: 0.045, angle: 0, fill: "rgba(236, 248, 255, 0.92)" }
  ];

  const moonMaria = [
    { lon: -48, lat: 18, rx: 0.17, ry: 0.075, angle: -0.2 },
    { lon: 3, lat: 22, rx: 0.14, ry: 0.07, angle: 0.12 },
    { lon: 24, lat: -8, rx: 0.18, ry: 0.085, angle: 0.04 },
    { lon: -38, lat: -24, rx: 0.15, ry: 0.07, angle: 0.2 },
    { lon: 64, lat: -22, rx: 0.12, ry: 0.055, angle: -0.12 }
  ];

  const moonCraters = [];
  const solarCells = [];
  const earthClouds = [];
  const earthMicro = [];

  for (let i = 0; i < 220; i += 1) {
    moonCraters.push({
      lon: -178 + rand(i + 10) * 356,
      lat: -68 + rand(i + 20) * 136,
      size: 0.006 + Math.pow(rand(i + 30), 2.4) * 0.036,
      alpha: 0.08 + rand(i + 40) * 0.18
    });
  }

  for (let i = 0; i < 420; i += 1) {
    solarCells.push({
      lon: -180 + rand(i + 300) * 360,
      lat: -72 + rand(i + 400) * 144,
      rx: 0.007 + rand(i + 500) * 0.026,
      ry: 0.004 + rand(i + 600) * 0.012,
      angle: rand(i + 700) * TAU,
      alpha: 0.055 + rand(i + 800) * 0.19
    });
  }

  for (let i = 0; i < 260; i += 1) {
    earthClouds.push({
      lon: -180 + rand(i + 900) * 360,
      lat: -62 + rand(i + 1000) * 124,
      rx: 0.018 + rand(i + 1100) * 0.075,
      ry: 0.004 + rand(i + 1200) * 0.014,
      angle: rand(i + 1300) * TAU,
      alpha: 0.07 + rand(i + 1400) * 0.18
    });
  }

  for (let i = 0; i < 520; i += 1) {
    earthMicro.push({
      lon: -180 + rand(i + 1500) * 360,
      lat: -65 + rand(i + 1600) * 130,
      rx: 0.003 + rand(i + 1700) * 0.012,
      ry: 0.002 + rand(i + 1800) * 0.007,
      angle: rand(i + 1900) * TAU,
      alpha: 0.025 + rand(i + 2000) * 0.06
    });
  }

  function drawBaseSphere(ctx, cx, cy, radius, body) {
    let base;

    if (body === "sun") {
      base = ctx.createRadialGradient(cx - radius * 0.32, cy - radius * 0.36, radius * 0.04, cx, cy, radius);
      base.addColorStop(0, "#fff3a4");
      base.addColorStop(0.16, "#ffc44a");
      base.addColorStop(0.46, "#ff8321");
      base.addColorStop(0.78, "#c83d12");
      base.addColorStop(1, "#5f1506");
    } else if (body === "moon") {
      base = ctx.createRadialGradient(cx - radius * 0.32, cy - radius * 0.36, radius * 0.04, cx, cy, radius);
      base.addColorStop(0, "#f4f2df");
      base.addColorStop(0.34, "#d1d1c8");
      base.addColorStop(0.7, "#969d9d");
      base.addColorStop(1, "#4d5660");
    } else {
      base = ctx.createRadialGradient(cx - radius * 0.32, cy - radius * 0.36, radius * 0.04, cx, cy, radius);
      base.addColorStop(0, "#78e8ff");
      base.addColorStop(0.2, "#168fcd");
      base.addColorStop(0.58, "#064b9c");
      base.addColorStop(1, "#011735");
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.fillStyle = base;
    ctx.fill();
    ctx.restore();
  }

  function drawEarth(ctx, cx, cy, radius, centerLon) {
    const tilt = bodyTilt("earth");

    drawBaseSphere(ctx, cx, cy, radius, "earth");

    ctx.save();
    clipSphere(ctx, cx, cy, radius);

    earthLandBlobs.forEach((blob) => {
      drawProjectedEllipse(
        ctx,
        blob,
        centerLon,
        tilt,
        cx,
        cy,
        radius,
        blob.fill,
        "rgba(255, 244, 196, 0.08)"
      );
    });

    earthMicro.forEach((spot) => {
      drawProjectedEllipse(
        ctx,
        spot,
        centerLon,
        tilt,
        cx,
        cy,
        radius,
        `rgba(83, 174, 103, ${spot.alpha})`,
        null
      );
    });

    earthClouds.forEach((cloud) => {
      drawProjectedEllipse(
        ctx,
        cloud,
        centerLon,
        tilt,
        cx,
        cy,
        radius,
        `rgba(255, 255, 255, ${cloud.alpha})`,
        null
      );
    });

    drawFlowLines(ctx, centerLon, tilt, cx, cy, radius, "earth");

    ctx.restore();

    drawOptics(ctx, cx, cy, radius, "earth");
  }

  function drawSun(ctx, cx, cy, radius, centerLon) {
    const tilt = bodyTilt("sun");

    drawBaseSphere(ctx, cx, cy, radius, "sun");

    ctx.save();
    clipSphere(ctx, cx, cy, radius);

    solarCells.forEach((cell) => {
      drawProjectedEllipse(
        ctx,
        cell,
        centerLon,
        tilt,
        cx,
        cy,
        radius,
        `rgba(255, 230, 105, ${cell.alpha})`,
        null
      );
    });

    drawFlowLines(ctx, centerLon, tilt, cx, cy, radius, "sun");

    ctx.restore();

    drawOptics(ctx, cx, cy, radius, "sun");
  }

  function drawMoon(ctx, cx, cy, radius, centerLon) {
    const tilt = bodyTilt("moon");

    drawBaseSphere(ctx, cx, cy, radius, "moon");

    ctx.save();
    clipSphere(ctx, cx, cy, radius);

    moonMaria.forEach((basin) => {
      drawProjectedEllipse(
        ctx,
        basin,
        centerLon,
        tilt,
        cx,
        cy,
        radius,
        "rgba(55, 60, 62, 0.22)",
        null
      );
    });

    moonCraters.forEach((crater) => {
      const p = project(crater.lon, crater.lat, centerLon, tilt, cx, cy, radius);
      if (!p.visible) return;

      const size = radius * crater.size * p.scale;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.scale(1, Math.max(0.36, p.scale));
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, TAU);
      ctx.fillStyle = `rgba(45, 49, 52, ${crater.alpha * p.scale})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(255, 255, 245, ${0.15 * p.scale})`;
      ctx.lineWidth = Math.max(1, size * 0.12);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(-size * 0.22, -size * 0.22, size * 0.42, 0, TAU);
      ctx.fillStyle = `rgba(255, 255, 245, ${0.08 * p.scale})`;
      ctx.fill();
      ctx.restore();
    });

    ctx.restore();

    drawOptics(ctx, cx, cy, radius, "moon");
  }

  function drawFlowLines(ctx, centerLon, tilt, cx, cy, radius, body) {
    const count = body === "sun" ? 11 : 7;

    for (let i = 0; i < count; i += 1) {
      const lat = body === "sun" ? -58 + i * 11.5 : -48 + i * 16;
      ctx.beginPath();

      let active = false;

      for (let lon = -180; lon <= 180; lon += 4) {
        const wave =
          Math.sin((lon * 0.04) + i * 1.7) * (body === "sun" ? 5 : 4) +
          Math.sin((lon * 0.09) + i * 0.8) * (body === "sun" ? 2 : 1.5);

        const p = project(lon, lat + wave, centerLon, tilt, cx, cy, radius);

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

      ctx.strokeStyle = body === "sun"
        ? "rgba(255, 232, 118, 0.105)"
        : "rgba(255, 255, 255, 0.115)";
      ctx.lineWidth = Math.max(1, radius * (body === "sun" ? 0.009 : 0.006));
      ctx.lineCap = "round";
      ctx.stroke();
    }
  }

  function drawOptics(ctx, cx, cy, radius, body) {
    ctx.save();
    clipSphere(ctx, cx, cy, radius);

    const highlight = ctx.createRadialGradient(
      cx - radius * 0.35,
      cy - radius * 0.36,
      radius * 0.035,
      cx,
      cy,
      radius
    );

    if (body === "sun") {
      highlight.addColorStop(0, "rgba(255,255,226,0.32)");
      highlight.addColorStop(0.25, "rgba(255,238,120,0.12)");
      highlight.addColorStop(1, "rgba(255,255,255,0)");
    } else {
      highlight.addColorStop(0, "rgba(255,255,255,0.22)");
      highlight.addColorStop(0.3, "rgba(255,255,255,0.06)");
      highlight.addColorStop(1, "rgba(255,255,255,0)");
    }

    ctx.fillStyle = highlight;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    const limb = ctx.createRadialGradient(cx, cy, radius * 0.58, cx, cy, radius);
    limb.addColorStop(0, "rgba(0,0,0,0)");
    limb.addColorStop(0.72, body === "sun" ? "rgba(70,10,0,0.04)" : "rgba(0,0,0,0.10)");
    limb.addColorStop(1, body === "sun" ? "rgba(70,10,0,0.18)" : "rgba(0,0,0,0.42)");

    ctx.fillStyle = limb;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.restore();

    if (body === "earth") {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.012, 0, TAU);
      ctx.strokeStyle = "rgba(126,219,255,0.48)";
      ctx.lineWidth = Math.max(2, radius * 0.026);
      ctx.shadowColor = "rgba(126,219,255,0.42)";
      ctx.shadowBlur = radius * 0.07;
      ctx.stroke();
      ctx.restore();
    }

    if (body === "sun") {
      const corona = ctx.createRadialGradient(cx, cy, radius * 0.86, cx, cy, radius * 1.22);
      corona.addColorStop(0, "rgba(255,197,63,0.18)");
      corona.addColorStop(0.56, "rgba(255,114,26,0.12)");
      corona.addColorStop(1, "rgba(255,114,26,0)");

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.22, 0, TAU);
      ctx.fillStyle = corona;
      ctx.fill();
      ctx.restore();
    }

    let stroke = "rgba(236,235,219,0.54)";
    let glow = "rgba(255,255,244,0.16)";

    if (body === "earth") {
      stroke = "rgba(134,225,255,0.66)";
      glow = "rgba(126,219,255,0.34)";
    }

    if (body === "sun") {
      stroke = "rgba(255,224,116,0.78)";
      glow = "rgba(255,166,34,0.52)";
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
      const dpr = clamp(global.devicePixelRatio || 1, 1, 3);
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
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

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
        projection: "seamless-orthographic-vector-sphere",
        textureRequired: false,
        seamRemoved: true,
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
          projection: "seamless-orthographic-vector-sphere",
          ownsBodyDrawing: true,
          ownsRoute: false,
          ownsControls: false,
          ownsLabels: false,
          textureRequired: false,
          seamRemoved: true
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
        projection: "seamless-orthographic-vector-sphere",
        ownsBodyDrawing: true,
        ownsRoute: false,
        ownsControls: false,
        ownsLabels: false,
        textureRequired: false,
        seamRemoved: true
      };
    }
  };

  global.DGBShowroomGlobeRender = api;
  global.DiamondGateBridge = global.DiamondGateBridge || {};
  global.DiamondGateBridge.DGBShowroomGlobeRender = api;
})(typeof window !== "undefined" ? window : globalThis);

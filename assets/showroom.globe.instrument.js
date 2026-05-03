/* /assets/showroom.globe.instrument.js
   SHOWROOM_GLOBE_RENDER_EXPRESSED_SATELLITE_DEFINITION_TNT_v1

   PURPOSE:
   Stop waiting on missing texture files.
   Render Earth, Sun, and Moon with procedural satellite-style definition.
   Bodies rotate as axis globes, not flat spinning disks.

   BOUNDARY:
   Instrument draws body only.
   Route owns labels, descriptions, controls, mount, and zoom wrapper.
   CSS contains presentation.
   Runtime supports state.
   Gauges audits only.
*/

(function showroomGlobeRenderExpressedSatelliteDefinition(global) {
  "use strict";

  const VERSION = "SHOWROOM_GLOBE_RENDER_EXPRESSED_SATELLITE_DEFINITION_TNT_v1";
  const ROUTE = "/showroom/globe/";
  const BODY_SET = new Set(["earth", "sun", "moon"]);
  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;

  const state = {
    body: "earth",
    running: true,
    direction: "forward",
    speedName: "normal",
    speedValue: 0.0032,
    zoom: 100,
    longitude: 0,
    mount: null,
    canvas: null,
    ctx: null,
    raf: 0,
    resizeObserver: null,
    maps: {},
    lastReceipt: null,
    lastError: null
  };

  const speedValues = {
    slow: 0.0016,
    normal: 0.0032,
    fast: 0.0068
  };

  const earthLand = [
    [[-168, 70], [-138, 72], [-105, 58], [-84, 50], [-70, 30], [-91, 15], [-112, 20], [-126, 32], [-151, 52]],
    [[-81, 12], [-62, 8], [-44, -11], [-48, -34], [-66, -55], [-76, -35], [-82, -8]],
    [[-54, 82], [-22, 74], [-36, 61], [-62, 68]],
    [[-10, 68], [32, 71], [82, 61], [136, 55], [151, 38], [117, 18], [76, 20], [45, 6], [18, 30], [-10, 36]],
    [[-18, 35], [16, 37], [35, 14], [31, -34], [11, -36], [-12, -6]],
    [[112, -11], [153, -24], [145, -43], [114, -36]],
    [[-180, -70], [-120, -76], [-60, -72], [0, -78], [60, -72], [120, -76], [180, -70], [180, -90], [-180, -90]]
  ];

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function isElement(value) {
    return Boolean(value && value.nodeType === 1);
  }

  function normalizeBody(value) {
    if (value && typeof value === "object") {
      value = value.activeBody || value.body || value.name || value.value;
    }

    const body = String(value || "").toLowerCase();
    return BODY_SET.has(body) ? body : "earth";
  }

  function normalizeSpeed(value) {
    if (value && typeof value === "object") {
      value = value.speedName || value.speed || value.value;
    }

    const speed = String(value || "normal").toLowerCase();
    return Object.prototype.hasOwnProperty.call(speedValues, speed) ? speed : "normal";
  }

  function normalizeZoom(value) {
    if (value && typeof value === "object") value = value.zoom;
    return clamp(Number(value) || 100, 70, 240);
  }

  function resolveMount(target) {
    if (isElement(target)) return target;

    if (target && typeof target === "object") {
      return resolveMount(target.mount || target.root || target.target || target.element || target.el || null);
    }

    if (typeof target === "string" && global.document) {
      const found = global.document.querySelector(target);
      if (found) return found;
    }

    if (!global.document) return null;

    return (
      global.document.getElementById("showroomGlobeMount") ||
      global.document.getElementById("showroom-globe-mount") ||
      global.document.getElementById("actualBodyMount") ||
      global.document.querySelector("[data-showroom-globe-mount]") ||
      global.document.querySelector("[data-actual-bodies-mount='true']") ||
      global.document.querySelector("[data-globe-mount]") ||
      global.document.querySelector(".actual-globe-mount") ||
      global.document.querySelector(".showroom-globe-mount")
    );
  }

  function applyOptions(options) {
    if (!options || typeof options !== "object") return;

    if (options.activeBody || options.body || options.name || options.value) {
      state.body = normalizeBody(options);
    }

    if (typeof options.running === "boolean") state.running = options.running;
    if (options.direction) state.direction = options.direction === "reverse" ? "reverse" : "forward";

    if (options.speedName || options.speed) {
      state.speedName = normalizeSpeed(options);
      state.speedValue = speedValues[state.speedName];
    }

    if (options.zoom !== undefined) state.zoom = normalizeZoom(options);
  }

  function ensureCanvas(target) {
    const mount = resolveMount(target);

    if (!mount || !global.document) {
      state.lastError = "NO_MOUNT";
      return false;
    }

    if (state.mount === mount && state.canvas && state.ctx) return true;

    stopLoop();

    if (state.resizeObserver) {
      state.resizeObserver.disconnect();
      state.resizeObserver = null;
    }

    mount.replaceChildren();

    const canvas = global.document.createElement("canvas");
    canvas.className = "dgb-showroom-render-expressed-axis-canvas";
    canvas.setAttribute("data-showroom-render-expressed-axis-canvas", "true");
    canvas.setAttribute("aria-label", "Demo Actual Universe render-expressed satellite body");

    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.maxWidth = "100%";
    canvas.style.height = "auto";
    canvas.style.aspectRatio = "1 / 1";
    canvas.style.borderRadius = "50%";
    canvas.style.background = "transparent";

    mount.appendChild(canvas);

    mount.dataset.instrumentMounted = "true";
    mount.dataset.bodyRenderAuthority = "/assets/showroom.globe.instrument.js";
    mount.dataset.routeAuthority = "labels-controls-mount-zoom-wrapper";
    mount.dataset.instrumentBoundary = "render-expressed-satellite-definition";
    mount.dataset.projection = "spherical-axis";
    mount.dataset.textureRequired = "false";
    mount.dataset.inlineGlobeRedraw = "false";
    mount.dataset.cartoonCanvasReplacement = "false";
    mount.dataset.activeBody = state.body;
    mount.dataset.visualPassClaimed = "false";

    state.mount = mount;
    state.canvas = canvas;
    state.ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });

    if (global.ResizeObserver) {
      state.resizeObserver = new ResizeObserver(function onResize() {
        resizeCanvas();
        drawOnce();
      });
      state.resizeObserver.observe(mount);
    }

    resizeCanvas();
    ensureMaps();
    return true;
  }

  function resizeCanvas() {
    if (!state.mount || !state.canvas) return;

    const rect = state.mount.getBoundingClientRect();
    const cssSize = clamp(rect.width || state.mount.clientWidth || 420, 260, 1080);
    const dpr = clamp(global.devicePixelRatio || 1, 1, 2.5);
    const pixelSize = Math.round(cssSize * dpr);

    if (state.canvas.width !== pixelSize || state.canvas.height !== pixelSize) {
      state.canvas.width = pixelSize;
      state.canvas.height = pixelSize;
    }
  }

  function makeCanvas(width, height) {
    const c = global.document.createElement("canvas");
    c.width = width;
    c.height = height;
    return c;
  }

  function rand(seed) {
    const x = Math.sin(seed * 12.9898) * 43758.5453123;
    return x - Math.floor(x);
  }

  function noise2(x, y, seed) {
    const n =
      Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) *
      43758.5453123;
    return n - Math.floor(n);
  }

  function smoothNoise(x, y, seed) {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const xf = x - x0;
    const yf = y - y0;

    const a = noise2(x0, y0, seed);
    const b = noise2(x0 + 1, y0, seed);
    const c = noise2(x0, y0 + 1, seed);
    const d = noise2(x0 + 1, y0 + 1, seed);

    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);

    return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v;
  }

  function octaveNoise(x, y, seed) {
    let total = 0;
    let amp = 1;
    let freq = 1;
    let norm = 0;

    for (let i = 0; i < 5; i += 1) {
      total += smoothNoise(x * freq, y * freq, seed + i * 11) * amp;
      norm += amp;
      amp *= 0.5;
      freq *= 2;
    }

    return total / norm;
  }

  function lonToX(lon, width) {
    return ((lon + 180) / 360) * width;
  }

  function latToY(lat, height) {
    return ((90 - lat) / 180) * height;
  }

  function drawLonLatPolygon(ctx, points, width, height, fill, stroke) {
    ctx.beginPath();

    points.forEach(([lon, lat], index) => {
      const x = lonToX(lon, width);
      const y = latToY(lat, height);
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();

    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = Math.max(1, width * 0.0012);
      ctx.stroke();
    }
  }

  function buildEarthMap() {
    const width = 2048;
    const height = 1024;
    const c = makeCanvas(width, height);
    const ctx = c.getContext("2d");

    const ocean = ctx.createLinearGradient(0, 0, width, height);
    ocean.addColorStop(0, "#0b3978");
    ocean.addColorStop(0.35, "#0b6dad");
    ocean.addColorStop(0.62, "#073d83");
    ocean.addColorStop(1, "#021839");
    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 900; i += 1) {
      const x = rand(i + 10) * width;
      const y = rand(i + 20) * height;
      const r = 2 + rand(i + 30) * 16;
      const a = 0.03 + rand(i + 40) * 0.07;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fillStyle = `rgba(120, 210, 255, ${a})`;
      ctx.fill();
    }

    earthLand.forEach((poly, index) => {
      const fill =
        index === 2 || index === 6
          ? "rgba(235, 246, 246, 0.95)"
          : index === 3 || index === 4 || index === 5
            ? "rgba(176, 137, 70, 0.96)"
            : "rgba(58, 130, 73, 0.96)";

      drawLonLatPolygon(ctx, poly, width, height, fill, "rgba(255,255,220,0.18)");
    });

    ctx.globalCompositeOperation = "source-atop";
    for (let i = 0; i < 1300; i += 1) {
      const x = rand(i + 300) * width;
      const y = rand(i + 400) * height;
      const n = octaveNoise(x / 90, y / 90, 12);
      if (n < 0.49) continue;

      ctx.beginPath();
      ctx.ellipse(x, y, 12 + n * 35, 5 + n * 15, rand(i + 500) * TAU, 0, TAU);
      ctx.fillStyle = `rgba(38, 92, 42, ${0.08 + n * 0.12})`;
      ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";

    for (let i = 0; i < 520; i += 1) {
      const x = rand(i + 700) * width;
      const y = rand(i + 800) * height;
      const n = octaveNoise(x / 120, y / 60, 55);
      if (n < 0.54) continue;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rand(i + 900) - 0.5) * 0.8);
      ctx.beginPath();
      ctx.ellipse(0, 0, 40 + n * 120, 8 + n * 18, 0, 0, TAU);
      ctx.fillStyle = `rgba(255,255,255,${0.10 + n * 0.18})`;
      ctx.fill();
      ctx.restore();
    }

    for (let band = 0; band < 5; band += 1) {
      const y = height * (0.24 + band * 0.13);
      ctx.beginPath();
      for (let x = 0; x <= width; x += 18) {
        const wave = Math.sin(x * 0.012 + band) * 20 + Math.sin(x * 0.027 + band * 2) * 8;
        if (x === 0) ctx.moveTo(x, y + wave);
        else ctx.lineTo(x, y + wave);
      }
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.lineWidth = 8 + band * 1.5;
      ctx.lineCap = "round";
      ctx.stroke();
    }

    return c;
  }

  function buildSunMap() {
    const width = 1536;
    const height = 768;
    const c = makeCanvas(width, height);
    const ctx = c.getContext("2d");

    const base = ctx.createLinearGradient(0, 0, width, height);
    base.addColorStop(0, "#8f2408");
    base.addColorStop(0.25, "#e45b18");
    base.addColorStop(0.55, "#ff9e28");
    base.addColorStop(0.82, "#d44612");
    base.addColorStop(1, "#5f1406");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 1800; i += 1) {
      const x = rand(i + 1200) * width;
      const y = rand(i + 1300) * height;
      const n = octaveNoise(x / 70, y / 70, 91);
      const r = 4 + n * 24;
      const alpha = 0.08 + n * 0.2;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rand(i + 1400) * TAU);
      ctx.scale(2.4 + rand(i + 1500) * 2.2, 0.75);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, TAU);
      ctx.fillStyle = n > 0.6
        ? `rgba(255, 235, 112, ${alpha})`
        : `rgba(255, 123, 26, ${alpha * 0.7})`;
      ctx.fill();
      ctx.restore();
    }

    for (let i = 0; i < 18; i += 1) {
      const x = rand(i + 1700) * width;
      const y = rand(i + 1800) * height;
      const r = 45 + rand(i + 1900) * 140;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, "rgba(255, 248, 180, 0.34)");
      g.addColorStop(0.5, "rgba(255, 169, 45, 0.12)");
      g.addColorStop(1, "rgba(255, 80, 18, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();
    }

    for (let i = 0; i < 10; i += 1) {
      ctx.beginPath();
      const y = height * (0.1 + i * 0.09);
      for (let x = 0; x <= width; x += 20) {
        const wave = Math.sin(x * 0.011 + i) * 25 + Math.sin(x * 0.028 + i * 2) * 10;
        if (x === 0) ctx.moveTo(x, y + wave);
        else ctx.lineTo(x, y + wave);
      }
      ctx.strokeStyle = "rgba(255, 226, 92, 0.13)";
      ctx.lineWidth = 6;
      ctx.stroke();
    }

    return c;
  }

  function buildMoonMap() {
    const width = 2048;
    const height = 1024;
    const c = makeCanvas(width, height);
    const ctx = c.getContext("2d");

    const base = ctx.createLinearGradient(0, 0, width, height);
    base.addColorStop(0, "#9b9f9a");
    base.addColorStop(0.45, "#d3d2c8");
    base.addColorStop(1, "#646b70");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, width, height);

    for (let y = 0; y < height; y += 4) {
      for (let x = 0; x < width; x += 4) {
        const n = octaveNoise(x / 80, y / 80, 203);
        const v = Math.floor(70 + n * 90);
        ctx.fillStyle = `rgba(${v}, ${v}, ${v}, 0.16)`;
        ctx.fillRect(x, y, 4, 4);
      }
    }

    const basins = [
      [0.24, 0.28, 0.16, 0.09],
      [0.52, 0.32, 0.13, 0.08],
      [0.42, 0.52, 0.18, 0.1],
      [0.68, 0.58, 0.12, 0.07],
      [0.22, 0.68, 0.11, 0.07]
    ];

    basins.forEach(([bx, by, rx, ry]) => {
      ctx.save();
      ctx.translate(bx * width, by * height);
      ctx.scale(rx * width, ry * height);
      ctx.beginPath();
      ctx.arc(0, 0, 1, 0, TAU);
      ctx.fillStyle = "rgba(58, 63, 65, 0.28)";
      ctx.fill();
      ctx.restore();
    });

    for (let i = 0; i < 380; i += 1) {
      const x = rand(i + 2200) * width;
      const y = rand(i + 2300) * height;
      const r = 2 + Math.pow(rand(i + 2400), 2.2) * 34;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fillStyle = "rgba(38, 40, 42, 0.13)";
      ctx.fill();

      ctx.strokeStyle = "rgba(255,255,245,0.22)";
      ctx.lineWidth = Math.max(1, r * 0.12);
      ctx.stroke();

      if (r > 14) {
        for (let ray = 0; ray < 8; ray += 1) {
          const a = (ray / 8) * TAU + rand(i + ray) * 0.28;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + Math.cos(a) * r * (2.5 + rand(i + ray + 80) * 3), y + Math.sin(a) * r * (2.5 + rand(i + ray + 90) * 3));
          ctx.strokeStyle = "rgba(255,255,245,0.08)";
          ctx.lineWidth = Math.max(1, r * 0.05);
          ctx.stroke();
        }
      }
    }

    return c;
  }

  function ensureMaps() {
    if (!state.maps.earth) state.maps.earth = buildEarthMap();
    if (!state.maps.sun) state.maps.sun = buildSunMap();
    if (!state.maps.moon) state.maps.moon = buildMoonMap();
  }

  function clear(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  function clipSphere(ctx, cx, cy, r) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.closePath();
    ctx.clip();
  }

  function bodyTilt(body) {
    if (body === "sun") return -7.25;
    if (body === "moon") return -6.68;
    return -23.5;
  }

  function drawProjectedMap(ctx, map, cx, cy, r, longitude, body) {
    const naturalW = map.width;
    const naturalH = map.height;
    const sliceCount = Math.max(420, Math.floor(r * 2.1));
    const tilt = bodyTilt(body) * DEG;

    ctx.save();
    clipSphere(ctx, cx, cy, r);

    ctx.translate(cx, cy);
    ctx.rotate(tilt);
    ctx.translate(-cx, -cy);

    for (let i = 0; i < sliceCount; i += 1) {
      const nx1 = -1 + (2 * i) / sliceCount;
      const nx2 = -1 + (2 * (i + 1)) / sliceCount;
      const nx = (nx1 + nx2) / 2;

      const visibleScale = Math.sqrt(Math.max(0, 1 - nx * nx));
      if (visibleScale <= 0.001) continue;

      const meridian = Math.asin(clamp(nx, -1, 1));
      let u = 0.5 + meridian / Math.PI + longitude;
      u = ((u % 1) + 1) % 1;

      const sx = Math.floor(u * naturalW);
      const sw = Math.max(1, Math.ceil(naturalW / sliceCount) + 1);

      const destX = cx + nx1 * r;
      const destW = Math.ceil((nx2 - nx1) * r) + 2;
      const destH = 2 * r * visibleScale;
      const destY = cy - destH / 2;

      ctx.drawImage(
        map,
        sx,
        0,
        Math.min(sw, naturalW - sx),
        naturalH,
        destX,
        destY,
        destW,
        destH
      );
    }

    ctx.restore();

    drawBodyOptics(ctx, cx, cy, r, body);
  }

  function drawBodyOptics(ctx, cx, cy, r, body) {
    ctx.save();
    clipSphere(ctx, cx, cy, r);

    const highlight = ctx.createRadialGradient(cx - r * 0.34, cy - r * 0.36, r * 0.04, cx, cy, r);

    if (body === "sun") {
      highlight.addColorStop(0, "rgba(255,255,225,0.38)");
      highlight.addColorStop(0.24, "rgba(255,238,120,0.14)");
      highlight.addColorStop(1, "rgba(255,255,255,0)");
    } else {
      highlight.addColorStop(0, "rgba(255,255,255,0.24)");
      highlight.addColorStop(0.28, "rgba(255,255,255,0.06)");
      highlight.addColorStop(1, "rgba(255,255,255,0)");
    }

    ctx.fillStyle = highlight;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    const terminator = ctx.createLinearGradient(cx - r * 0.55, cy - r, cx + r, cy + r);
    terminator.addColorStop(0, "rgba(255,255,255,0)");
    terminator.addColorStop(0.54, "rgba(0,0,0,0)");
    terminator.addColorStop(1, body === "sun" ? "rgba(80,12,0,0.18)" : "rgba(0,0,0,0.44)");

    ctx.fillStyle = terminator;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.restore();

    if (body === "earth") drawAtmosphere(ctx, cx, cy, r);
    if (body === "sun") drawSolarGlow(ctx, cx, cy, r);

    drawRim(ctx, cx, cy, r, body);
  }

  function drawAtmosphere(ctx, cx, cy, r) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.014, 0, TAU);
    ctx.strokeStyle = "rgba(126,219,255,0.46)";
    ctx.lineWidth = Math.max(2, r * 0.028);
    ctx.shadowColor = "rgba(126,219,255,0.42)";
    ctx.shadowBlur = r * 0.07;
    ctx.stroke();
    ctx.restore();
  }

  function drawSolarGlow(ctx, cx, cy, r) {
    const corona = ctx.createRadialGradient(cx, cy, r * 0.88, cx, cy, r * 1.2);
    corona.addColorStop(0, "rgba(255,197,63,0.17)");
    corona.addColorStop(0.58, "rgba(255,114,26,0.12)");
    corona.addColorStop(1, "rgba(255,114,26,0)");

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.2, 0, TAU);
    ctx.fillStyle = corona;
    ctx.fill();
    ctx.restore();
  }

  function drawRim(ctx, cx, cy, r, body) {
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
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = Math.max(2, r * 0.01);
    ctx.shadowColor = glow;
    ctx.shadowBlur = r * 0.07;
    ctx.stroke();
    ctx.restore();
  }

  function drawOnce() {
    if (!state.canvas || !state.ctx) return;

    resizeCanvas();
    ensureMaps();

    const ctx = state.ctx;
    const size = Math.min(ctx.canvas.width, ctx.canvas.height);
    const cx = ctx.canvas.width / 2;
    const cy = ctx.canvas.height / 2;
    const r = size * 0.395 * (state.zoom / 100);
    const map = state.maps[state.body];

    clear(ctx);
    drawProjectedMap(ctx, map, cx, cy, r, state.longitude, state.body);
    writeReceipt("RENDER_EXPRESSED_DEFINITION_DRAWN");
  }

  function step() {
    state.raf = 0;

    if (state.running) {
      const direction = state.direction === "reverse" ? -1 : 1;
      state.longitude = (state.longitude + direction * state.speedValue) % 1;
    }

    drawOnce();

    if (state.running) {
      state.raf = global.requestAnimationFrame(step);
    }
  }

  function stopLoop() {
    if (state.raf) {
      global.cancelAnimationFrame(state.raf);
      state.raf = 0;
    }
  }

  function startLoop() {
    stopLoop();

    if (state.running) {
      state.raf = global.requestAnimationFrame(step);
    } else {
      drawOnce();
    }
  }

  function writeReceipt(status) {
    state.lastReceipt = {
      ok: true,
      status: status || "READY",
      version: VERSION,
      route: ROUTE,
      instrumentBoundary: "render-expressed-satellite-definition",
      sourceClass: "PROCEDURAL_SATELLITE_STYLE_EXPRESSION",
      textureRequired: false,
      activeBody: state.body,
      running: state.running,
      direction: state.direction,
      speedName: state.speedName,
      speedValue: state.speedValue,
      zoom: state.zoom,
      longitude: state.longitude,
      axialTilt: bodyTilt(state.body),
      ownsBodyRender: true,
      ownsRouteLabel: false,
      ownsRouteDescription: false,
      ownsControls: false,
      ownsRouteCopy: false,
      ownsGauges: false,
      ownsRuntime: false,
      visualPassClaimed: false,
      timestamp: new Date().toISOString()
    };

    if (state.mount) {
      state.mount.dataset.instrumentReceipt = status || "READY";
      state.mount.dataset.activeBody = state.body;
      state.mount.dataset.instrumentBoundary = "render-expressed-satellite-definition";
      state.mount.dataset.projection = "spherical-axis";
      state.mount.dataset.textureRequired = "false";
      state.mount.dataset.visualPassClaimed = "false";
    }

    return state.lastReceipt;
  }

  function renderGlobe(target, options) {
    try {
      applyOptions(options);

      if (!ensureCanvas(target || options)) {
        return {
          ok: false,
          status: "HOLD_NO_MOUNT",
          version: VERSION,
          instrumentBoundary: "render-expressed-satellite-definition"
        };
      }

      startLoop();
      return writeReceipt("MOUNTED");
    } catch (error) {
      state.lastError = error && error.message ? error.message : String(error);

      return {
        ok: false,
        status: "HOLD_EXCEPTION",
        version: VERSION,
        error: state.lastError,
        instrumentBoundary: "render-expressed-satellite-definition"
      };
    }
  }

  function mount(target, options) {
    return renderGlobe(target, options);
  }

  function render(target, options) {
    return renderGlobe(target, options);
  }

  function renderActualBody(target, options) {
    return renderGlobe(target, options);
  }

  function setActiveBody(value) {
    state.body = normalizeBody(value);
    if (state.mount) startLoop();
    return writeReceipt("BODY_SELECTED");
  }

  function setMotion(options) {
    applyOptions(options);
    if (state.mount) startLoop();
    return writeReceipt("MOTION_UPDATED");
  }

  function update(options) {
    return setMotion(options);
  }

  function setState(options) {
    return setMotion(options);
  }

  function start() {
    state.running = true;
    startLoop();
    return writeReceipt("STARTED");
  }

  function resume() {
    return start();
  }

  function pause() {
    state.running = false;
    stopLoop();
    drawOnce();
    return writeReceipt("PAUSED");
  }

  function reset() {
    state.running = true;
    state.direction = "forward";
    state.speedName = "normal";
    state.speedValue = speedValues.normal;
    state.zoom = 100;
    state.longitude = 0;
    startLoop();
    return writeReceipt("RESET");
  }

  function reverse() {
    state.direction = state.direction === "forward" ? "reverse" : "forward";
    startLoop();
    return writeReceipt("REVERSED");
  }

  function setSpeed(value) {
    state.speedName = normalizeSpeed(value);
    state.speedValue = speedValues[state.speedName];
    startLoop();
    return writeReceipt("SPEED_UPDATED");
  }

  function setZoom(value) {
    if (value && typeof value === "object") {
      if (value.zoom === "in") state.zoom = clamp(state.zoom + 10, 70, 240);
      else if (value.zoom === "out") state.zoom = clamp(state.zoom - 10, 70, 240);
      else if (value.zoom === "reset") state.zoom = 100;
      else state.zoom = normalizeZoom(value);
    } else if (value === "in") {
      state.zoom = clamp(state.zoom + 10, 70, 240);
    } else if (value === "out") {
      state.zoom = clamp(state.zoom - 10, 70, 240);
    } else if (value === "reset") {
      state.zoom = 100;
    } else {
      state.zoom = normalizeZoom(value);
    }

    drawOnce();
    return writeReceipt("ZOOM_UPDATED");
  }

  function writeReceipts() {
    return writeReceipt("RECEIPT_WRITTEN");
  }

  function getStatus() {
    return {
      ok: true,
      version: VERSION,
      route: ROUTE,
      instrumentBoundary: "render-expressed-satellite-definition",
      sourceClass: "PROCEDURAL_SATELLITE_STYLE_EXPRESSION",
      textureRequired: false,
      activeBody: state.body,
      running: state.running,
      direction: state.direction,
      speedName: state.speedName,
      speedValue: state.speedValue,
      zoom: state.zoom,
      longitude: state.longitude,
      axialTilt: bodyTilt(state.body),
      mountPresent: Boolean(state.mount),
      canvasPresent: Boolean(state.canvas),
      lastReceipt: state.lastReceipt,
      lastError: state.lastError,
      ownsBodyRender: true,
      ownsRouteLabel: false,
      ownsRouteDescription: false,
      ownsControls: false,
      ownsRouteCopy: false,
      ownsGauges: false,
      visualPassClaimed: false
    };
  }

  function status() {
    return getStatus();
  }

  function boot() {
    const mountNode = resolveMount(null);

    if (mountNode) {
      renderGlobe(mountNode, {
        activeBody: state.body,
        running: state.running,
        direction: state.direction,
        speedName: state.speedName,
        zoom: state.zoom
      });
    }

    try {
      global.dispatchEvent(new CustomEvent("showroom:globe:instrument-ready", {
        detail: getStatus()
      }));

      global.dispatchEvent(new CustomEvent("dgb:showroom:render-expressed-satellite-definition-renewed", {
        detail: getStatus()
      }));
    } catch (_) {}
  }

  const api = {
    VERSION,
    version: VERSION,
    renderGlobe,
    renderActualBody,
    render,
    mount,
    setActiveBody,
    setMotion,
    update,
    setState,
    start,
    resume,
    pause,
    reset,
    reverse,
    setSpeed,
    setZoom,
    writeReceipts,
    getStatus,
    status,
    visualPassClaimed: false,
    ownerVisualReceiptRequired: true
  };

  global.DGBShowroomGlobeInstrument = api;
  global.DGBActualBodiesInstrument = api;
  global.ShowroomGlobeInstrument = api;
  global.showroomGlobeInstrument = api;

  if (global.DiamondGateBridge && typeof global.DiamondGateBridge === "object") {
    global.DiamondGateBridge.DGBShowroomGlobeInstrument = api;
    global.DiamondGateBridge.DGBActualBodiesInstrument = api;
    global.DiamondGateBridge.ShowroomGlobeInstrument = api;
    global.DiamondGateBridge.showroomGlobeInstrument = api;
  } else {
    global.DiamondGateBridge = {
      DGBShowroomGlobeInstrument: api,
      DGBActualBodiesInstrument: api,
      ShowroomGlobeInstrument: api,
      showroomGlobeInstrument: api
    };
  }

  if (global.document) {
    if (global.document.readyState === "loading") {
      global.document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
      boot();
    }

    global.addEventListener("resize", function handleResize() {
      resizeCanvas();
      drawOnce();
    }, { passive: true });
  }
})(typeof window !== "undefined" ? window : globalThis);

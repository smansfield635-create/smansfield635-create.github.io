Ll/* /assets/showroom.globe.instrument.js
   SHOWROOM_GLOBE_EARTH_SUN_MOON_VISUAL_FIDELITY_RENEWAL_TNT_v1

   Renewal law:
   Instrument draws body only.
   Route owns labels, descriptions, buttons, mount, and zoom wrapper.
   CSS contains presentation.
   Runtime supports state.
   Gauges audits only.
*/

(function renewEarthSunMoonVisualFidelity(global) {
  "use strict";

  const VERSION = "SHOWROOM_GLOBE_EARTH_SUN_MOON_VISUAL_FIDELITY_RENEWAL_TNT_v1";
  const ROUTE = "/showroom/globe/";
  const BODY_SET = new Set(["earth", "sun", "moon"]);
  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;

  const state = {
    body: "earth",
    running: true,
    direction: "forward",
    speedName: "normal",
    speedValue: 1,
    zoom: 100,
    frame: 0,
    mount: null,
    canvas: null,
    ctx: null,
    raf: 0,
    resizeObserver: null,
    lastReceipt: null,
    lastError: null
  };

  const speedValues = {
    slow: 0.45,
    normal: 1,
    fast: 1.75
  };

  const earthLand = [
    {
      name: "north-america",
      fill: "rgba(82, 151, 82, 0.96)",
      points: [[-168, 70], [-138, 72], [-105, 58], [-84, 50], [-70, 30], [-91, 15], [-112, 20], [-126, 32], [-151, 52]]
    },
    {
      name: "south-america",
      fill: "rgba(83, 142, 79, 0.96)",
      points: [[-81, 12], [-62, 8], [-44, -11], [-48, -34], [-66, -55], [-76, -35], [-82, -8]]
    },
    {
      name: "greenland",
      fill: "rgba(218, 234, 221, 0.92)",
      points: [[-54, 82], [-22, 74], [-36, 61], [-62, 68]]
    },
    {
      name: "eurasia",
      fill: "rgba(174, 141, 75, 0.96)",
      points: [[-10, 68], [32, 71], [82, 61], [136, 55], [151, 38], [117, 18], [76, 20], [45, 6], [18, 30], [-10, 36]]
    },
    {
      name: "africa",
      fill: "rgba(154, 119, 66, 0.96)",
      points: [[-18, 35], [16, 37], [35, 14], [31, -34], [11, -36], [-12, -6]]
    },
    {
      name: "australia",
      fill: "rgba(183, 139, 70, 0.96)",
      points: [[112, -11], [153, -24], [145, -43], [114, -36]]
    },
    {
      name: "antarctica",
      fill: "rgba(238, 247, 255, 0.94)",
      points: [[-180, -70], [-120, -76], [-60, -72], [0, -78], [60, -72], [120, -76], [180, -70], [180, -90], [-180, -90]]
    }
  ];

  const maria = [
    { x: -0.22, y: -0.24, rx: 0.23, ry: 0.16, a: 0.12 },
    { x: 0.23, y: -0.16, rx: 0.19, ry: 0.14, a: -0.08 },
    { x: 0.02, y: 0.12, rx: 0.27, ry: 0.18, a: 0.05 },
    { x: -0.2, y: 0.41, rx: 0.19, ry: 0.12, a: 0.18 },
    { x: 0.35, y: 0.39, rx: 0.14, ry: 0.1, a: -0.2 }
  ];

  const moonCraters = [
    [-0.38, -0.36, 0.075], [0.17, -0.42, 0.045], [0.47, -0.24, 0.075],
    [-0.55, -0.06, 0.052], [0.0, 0.03, 0.1], [0.44, 0.22, 0.055],
    [-0.31, 0.34, 0.072], [0.23, 0.55, 0.09], [-0.08, -0.52, 0.06],
    [0.61, 0.02, 0.04], [-0.52, 0.24, 0.045], [0.12, 0.34, 0.038]
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
      const queried = global.document.querySelector(target);
      if (queried) return queried;
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
    canvas.className = "dgb-showroom-globe-render-only-canvas";
    canvas.setAttribute("data-showroom-globe-render-only-canvas", "true");
    canvas.setAttribute("aria-label", "Demo Actual Universe selected body render");
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
    mount.dataset.routeAuthority = "layout-command-panel-zoom-wrapper";
    mount.dataset.instrumentBoundary = "render-only";
    mount.dataset.visualFidelity = "earth-sun-moon-v1";
    mount.dataset.inlineGlobeRedraw = "false";
    mount.dataset.cartoonCanvasReplacement = "false";
    mount.dataset.activeBody = state.body;
    mount.dataset.visualPassClaimed = "false";

    state.mount = mount;
    state.canvas = canvas;
    state.ctx = canvas.getContext("2d", { alpha: true });

    if (global.ResizeObserver) {
      state.resizeObserver = new ResizeObserver(function handleResize() {
        resizeCanvas();
        drawOnce();
      });
      state.resizeObserver.observe(mount);
    }

    resizeCanvas();
    return true;
  }

  function resizeCanvas() {
    if (!state.mount || !state.canvas) return;

    const rect = state.mount.getBoundingClientRect();
    const cssSize = clamp(rect.width || state.mount.clientWidth || 420, 220, 960);
    const dpr = clamp(global.devicePixelRatio || 1, 1, 2);
    const pixelSize = Math.round(cssSize * dpr);

    if (state.canvas.width !== pixelSize || state.canvas.height !== pixelSize) {
      state.canvas.width = pixelSize;
      state.canvas.height = pixelSize;
    }
  }

  function rand(seed) {
    const x = Math.sin(seed * 12.9898) * 43758.5453123;
    return x - Math.floor(x);
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

  function drawRim(ctx, cx, cy, r, stroke, glow) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = Math.max(2, r * 0.012);

    if (glow) {
      ctx.shadowColor = glow;
      ctx.shadowBlur = r * 0.08;
    }

    ctx.stroke();
    ctx.restore();
  }

  function drawLighting(ctx, cx, cy, r, mode) {
    ctx.save();
    clipSphere(ctx, cx, cy, r);

    const highlight = ctx.createRadialGradient(cx - r * 0.36, cy - r * 0.38, r * 0.04, cx, cy, r);
    highlight.addColorStop(0, mode === "sun" ? "rgba(255,255,210,0.5)" : "rgba(255,255,255,0.32)");
    highlight.addColorStop(0.28, "rgba(255,255,255,0.08)");
    highlight.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = highlight;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    const shade = ctx.createLinearGradient(cx - r * 0.55, cy - r, cx + r, cy + r);
    shade.addColorStop(0, "rgba(255,255,255,0)");
    shade.addColorStop(0.54, "rgba(0,0,0,0)");
    shade.addColorStop(1, mode === "sun" ? "rgba(80,10,0,0.32)" : "rgba(0,0,0,0.44)");
    ctx.fillStyle = shade;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.restore();
  }

  function project(lon, lat, centerLon, cx, cy, r) {
    const lambda = (lon - centerLon) * DEG;
    const phi = lat * DEG;
    const cosPhi = Math.cos(phi);
    const x = cx + r * cosPhi * Math.sin(lambda);
    const y = cy - r * Math.sin(phi);
    const z = cosPhi * Math.cos(lambda);
    return { x, y, z, visible: z > -0.03 };
  }

  function drawProjectedPolygon(ctx, cx, cy, r, centerLon, polygon, fill) {
    const points = polygon.map(([lon, lat]) => project(lon, lat, centerLon, cx, cy, r));
    const visible = points.filter((point) => point.visible);

    if (visible.length < 3) return;

    ctx.save();
    clipSphere(ctx, cx, cy, r);
    ctx.beginPath();

    let started = false;
    for (const point of points) {
      if (!point.visible) continue;

      if (!started) {
        ctx.moveTo(point.x, point.y);
        started = true;
      } else {
        ctx.lineTo(point.x, point.y);
      }
    }

    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.shadowColor = "rgba(0,0,0,0.22)";
    ctx.shadowBlur = r * 0.018;
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,220,0.12)";
    ctx.lineWidth = Math.max(1, r * 0.005);
    ctx.stroke();
    ctx.restore();
  }

  function drawProjectedCloudBand(ctx, cx, cy, r, centerLon, lat, startLon, endLon, alpha) {
    const points = [];
    for (let lon = startLon; lon <= endLon; lon += 7) {
      points.push(project(lon, lat + Math.sin(lon * 0.08) * 5, centerLon, cx, cy, r));
    }

    ctx.save();
    clipSphere(ctx, cx, cy, r);
    ctx.beginPath();

    let started = false;
    for (const point of points) {
      if (!point.visible) {
        started = false;
        continue;
      }

      if (!started) {
        ctx.moveTo(point.x, point.y);
        started = true;
      } else {
        ctx.lineTo(point.x, point.y);
      }
    }

    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
    ctx.lineWidth = Math.max(1.5, r * 0.014);
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.restore();
  }

  function drawEarth(ctx, cx, cy, r, tick) {
    const ocean = ctx.createRadialGradient(cx - r * 0.32, cy - r * 0.35, r * 0.05, cx, cy, r);
    ocean.addColorStop(0, "rgba(127,232,255,1)");
    ocean.addColorStop(0.22, "rgba(28,156,215,1)");
    ocean.addColorStop(0.58, "rgba(4,76,151,1)");
    ocean.addColorStop(1, "rgba(1,21,58,1)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = ocean;
    ctx.fill();

    const centerLon = (tick * 0.16 * (state.direction === "reverse" ? -1 : 1)) % 360;

    for (const land of earthLand) {
      drawProjectedPolygon(ctx, cx, cy, r, centerLon, land.points, land.fill);
    }

    drawProjectedCloudBand(ctx, cx, cy, r, centerLon, 24, -180, 180, 0.32);
    drawProjectedCloudBand(ctx, cx, cy, r, centerLon, -8, -180, 180, 0.24);
    drawProjectedCloudBand(ctx, cx, cy, r, centerLon, -36, -180, 180, 0.28);

    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.018, 0, TAU);
    ctx.strokeStyle = "rgba(126, 219, 255, 0.34)";
    ctx.lineWidth = Math.max(2, r * 0.035);
    ctx.shadowColor = "rgba(126, 219, 255, 0.42)";
    ctx.shadowBlur = r * 0.08;
    ctx.stroke();
    ctx.restore();

    drawLighting(ctx, cx, cy, r, "earth");
    drawRim(ctx, cx, cy, r, "rgba(134,225,255,0.58)", "rgba(126,219,255,0.36)");
  }

  function drawSun(ctx, cx, cy, r, tick) {
    const corona = ctx.createRadialGradient(cx, cy, r * 0.65, cx, cy, r * 1.18);
    corona.addColorStop(0, "rgba(255, 188, 48, 0.05)");
    corona.addColorStop(0.7, "rgba(255, 130, 28, 0.24)");
    corona.addColorStop(1, "rgba(255, 95, 20, 0)");
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.18, 0, TAU);
    ctx.fillStyle = corona;
    ctx.fill();
    ctx.restore();

    const body = ctx.createRadialGradient(cx - r * 0.33, cy - r * 0.36, r * 0.04, cx, cy, r);
    body.addColorStop(0, "rgba(255,255,215,1)");
    body.addColorStop(0.12, "rgba(255,220,76,1)");
    body.addColorStop(0.34, "rgba(255,142,31,1)");
    body.addColorStop(0.68, "rgba(211,59,18,1)");
    body.addColorStop(1, "rgba(85,18,7,1)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = body;
    ctx.shadowColor = "rgba(255,145,35,0.5)";
    ctx.shadowBlur = r * 0.15;
    ctx.fill();
    clipSphere(ctx, cx, cy, r);

    const spin = tick * 0.006 * (state.direction === "reverse" ? -1 : 1);

    for (let i = 0; i < 135; i += 1) {
      const angle = i * 2.399963 + spin;
      const dist = r * (0.1 + rand(i + 4) * 0.82);
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist * 0.94;
      const size = r * (0.01 + rand(i + 91) * 0.028);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle + tick * 0.002);
      ctx.scale(2.6 + rand(i + 12) * 1.5, 0.8);
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, TAU);
      ctx.fillStyle = i % 4 === 0 ? "rgba(255,238,139,0.42)" : "rgba(255,185,76,0.30)";
      ctx.fill();
      ctx.restore();
    }

    for (let i = 0; i < 7; i += 1) {
      const angle = spin + i * 0.9;
      ctx.beginPath();
      ctx.arc(cx, cy, r * (0.2 + i * 0.075), angle, angle + 1.05);
      ctx.strokeStyle = "rgba(255, 231, 120, 0.16)";
      ctx.lineWidth = Math.max(1.4, r * 0.012);
      ctx.stroke();
    }

    ctx.restore();

    drawLighting(ctx, cx, cy, r, "sun");
    drawRim(ctx, cx, cy, r, "rgba(255,224,116,0.76)", "rgba(255,166,34,0.58)");
  }

  function drawMoonMaria(ctx, x, y, rx, ry, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(rx, ry);
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, TAU);
    ctx.fillStyle = "rgba(73, 80, 82, 0.24)";
    ctx.fill();
    ctx.restore();
  }

  function drawCrater(ctx, x, y, r) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fillStyle = "rgba(56, 60, 63, 0.14)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,244,0.34)";
    ctx.lineWidth = Math.max(1, r * 0.16);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x - r * 0.22, y - r * 0.22, r * 0.43, 0, TAU);
    ctx.fillStyle = "rgba(255,255,255,0.17)";
    ctx.fill();
    ctx.restore();
  }

  function drawMoon(ctx, cx, cy, r) {
    const surface = ctx.createRadialGradient(cx - r * 0.34, cy - r * 0.38, r * 0.05, cx, cy, r);
    surface.addColorStop(0, "rgba(255,255,235,1)");
    surface.addColorStop(0.3, "rgba(211,211,199,1)");
    surface.addColorStop(0.72, "rgba(145,153,153,1)");
    surface.addColorStop(1, "rgba(75,84,94,1)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = surface;
    ctx.fill();
    clipSphere(ctx, cx, cy, r);

    for (const basin of maria) {
      drawMoonMaria(ctx, cx + basin.x * r, cy + basin.y * r, basin.rx * r, basin.ry * r, basin.a);
    }

    for (const crater of moonCraters) {
      drawCrater(ctx, cx + crater[0] * r, cy + crater[1] * r, crater[2] * r);
    }

    for (let i = 0; i < 55; i += 1) {
      const angle = rand(i + 31) * TAU;
      const dist = Math.sqrt(rand(i + 52)) * r * 0.82;
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;
      const size = r * (0.003 + rand(i + 77) * 0.006);

      ctx.beginPath();
      ctx.arc(x, y, size, 0, TAU);
      ctx.fillStyle = "rgba(255,255,245,0.13)";
      ctx.fill();
    }

    ctx.restore();

    drawLighting(ctx, cx, cy, r, "moon");
    drawRim(ctx, cx, cy, r, "rgba(236,235,219,0.56)", "rgba(255,255,244,0.22)");
  }

  function drawOnce() {
    if (!state.canvas || !state.ctx) return;

    resizeCanvas();

    const ctx = state.ctx;
    const size = Math.min(ctx.canvas.width, ctx.canvas.height);
    const cx = ctx.canvas.width / 2;
    const cy = ctx.canvas.height / 2;
    const zoom = clamp(state.zoom, 70, 240) / 100;
    const r = size * 0.39 * zoom;

    clear(ctx);

    if (state.running) {
      state.frame += state.speedValue;
    }

    if (state.body === "sun") {
      drawSun(ctx, cx, cy, r, state.frame);
    } else if (state.body === "moon") {
      drawMoon(ctx, cx, cy, r);
    } else {
      drawEarth(ctx, cx, cy, r, state.frame);
    }

    writeReceipt("DRAWN");
  }

  function stopLoop() {
    if (state.raf) {
      global.cancelAnimationFrame(state.raf);
      state.raf = 0;
    }
  }

  function loop() {
    state.raf = 0;
    drawOnce();

    if (state.running) {
      state.raf = global.requestAnimationFrame(loop);
    }
  }

  function startLoop() {
    stopLoop();

    if (state.running) {
      state.raf = global.requestAnimationFrame(loop);
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
      instrumentBoundary: "render-only",
      visualFidelity: "earth-sun-moon-v1",
      activeBody: state.body,
      running: state.running,
      direction: state.direction,
      speedName: state.speedName,
      speedValue: state.speedValue,
      zoom: state.zoom,
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
      state.mount.dataset.instrumentBoundary = "render-only";
      state.mount.dataset.visualFidelity = "earth-sun-moon-v1";
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
          instrumentBoundary: "render-only"
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
        instrumentBoundary: "render-only"
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
    state.frame = 0;
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

    startLoop();
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
      instrumentBoundary: "render-only",
      visualFidelity: "earth-sun-moon-v1",
      activeBody: state.body,
      running: state.running,
      direction: state.direction,
      speedName: state.speedName,
      speedValue: state.speedValue,
      zoom: state.zoom,
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

      global.dispatchEvent(new CustomEvent("dgb:showroom:actual-bodies-visual-fidelity-renewed", {
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

    global.addEventListener("resize", function handleWindowResize() {
      resizeCanvas();
      drawOnce();
    }, { passive: true });
  }
})(typeof window !== "undefined" ? window : globalThis);

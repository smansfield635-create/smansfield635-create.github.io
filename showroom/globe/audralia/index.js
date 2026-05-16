// /showroom/globe/audralia/index.js
// AUDRALIA_POST_NARRATIVE_LIVING_WORLD_LOADER_TNT_v4
// Renewal only.
// Authority: route loader + visible consumer canvas.
// The canvas may display Audralia. It must not claim to author land, climate, surface truth, or Gauges logic.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_POST_NARRATIVE_LIVING_WORLD_LOADER_TNT_v4";

  const META = Object.freeze({
    route: "/showroom/globe/audralia/",
    page: "audralia-living-canvas",
    world: "Audralia",
    contract: CONTRACT,
    canvasContract: "AUDRALIA_VISIBLE_LIVING_CANVAS_CONSUMER_TNT_v4",
    publicPath: "possibility",
    generatedImage: false,
    graphicBox: false,
    streaming: false,
    visualPassClaimed: false,
    owns: Object.freeze([
      "route_loader",
      "canvas_mount",
      "visible_consumer_canvas",
      "public_status",
      "motion_loop",
      "pointer_inspection"
    ]),
    doesNotOwn: Object.freeze([
      "land_footprint_authority",
      "climate_authority",
      "surface_truth",
      "gauges_logic",
      "heavy_runtime"
    ])
  });

  const state = {
    mounted: false,
    running: true,
    pointerActive: false,
    pointerX: 0.5,
    pointerY: 0.5,
    drift: 0,
    lastTime: 0,
    width: 0,
    height: 0,
    dpr: 1
  };

  function $(selector, root = document) {
    try {
      return root.querySelector(selector);
    } catch {
      return null;
    }
  }

  function setText(node, text) {
    if (node) node.textContent = text;
  }

  function getStage() {
    return $("#audralia-stage") || $("[data-audralia-stage='true']");
  }

  function getMount() {
    return $("#audraliaCanvasMount") || $("[data-audralia-canvas-mount='true']");
  }

  function getNotice() {
    return $("#audraliaRouteLoaderNotice") || $("[data-audralia-route-loader-notice='true']");
  }

  function getStatus() {
    return $("#audraliaRouteStatus") || $("[data-audralia-route-status='true']");
  }

  function validRoute() {
    const html = document.documentElement;
    return !!html && html.getAttribute("data-route") === META.route;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function resizeCanvas(canvas, ctx) {
    const rect = canvas.getBoundingClientRect();
    const dpr = clamp(window.devicePixelRatio || 1, 1, 2);

    const width = Math.max(320, Math.floor(rect.width));
    const height = Math.max(320, Math.floor(rect.height));

    if (state.width === width && state.height === height && state.dpr === dpr) return;

    state.width = width;
    state.height = height;
    state.dpr = dpr;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeCanvas(mount) {
    let canvas = mount.querySelector("canvas");

    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.setAttribute("aria-label", "Audralia living-world possibility canvas");
      canvas.setAttribute("data-audralia-visible-canvas", "true");
      canvas.setAttribute("data-contract", META.canvasContract);
      mount.appendChild(canvas);
    }

    return canvas;
  }

  function drawSky(ctx, w, h, t) {
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#071a2c");
    sky.addColorStop(0.45, "#0a2434");
    sky.addColorStop(0.72, "#102817");
    sky.addColorStop(1, "#061008");

    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    const glowX = w * (0.52 + Math.sin(t * 0.18) * 0.04);
    const glowY = h * 0.28;
    const glow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, Math.max(w, h) * 0.58);
    glow.addColorStop(0, "rgba(158,240,191,0.18)");
    glow.addColorStop(0.28, "rgba(141,216,255,0.10)");
    glow.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
  }

  function drawWater(ctx, w, h, t) {
    const horizon = h * (0.58 + (state.pointerY - 0.5) * 0.05);
    const water = ctx.createLinearGradient(0, horizon, 0, h);
    water.addColorStop(0, "rgba(78,151,162,0.50)");
    water.addColorStop(0.42, "rgba(22,96,104,0.44)");
    water.addColorStop(1, "rgba(6,32,36,0.80)");

    ctx.fillStyle = water;
    ctx.beginPath();
    ctx.moveTo(0, horizon + Math.sin(t) * 2);
    for (let x = 0; x <= w; x += 24) {
      const y =
        horizon +
        Math.sin(x * 0.018 + t * 0.9) * 4 +
        Math.sin(x * 0.041 + t * 0.55) * 2;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    ctx.save();
    ctx.globalAlpha = 0.34;
    ctx.strokeStyle = "rgba(216,255,233,0.26)";
    ctx.lineWidth = 1;

    for (let i = 0; i < 16; i += 1) {
      const y = horizon + 18 + i * 17;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 18) {
        const wave =
          Math.sin(x * 0.026 + t * 1.2 + i * 0.7) * (2.2 + i * 0.06) +
          Math.sin(x * 0.061 + t * 0.7) * 1.1;
        if (x === 0) ctx.moveTo(x, y + wave);
        else ctx.lineTo(x, y + wave);
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawLand(ctx, w, h, t) {
    const base = h * 0.68;
    const drift = (state.pointerX - 0.5) * w * 0.08;

    const land = ctx.createLinearGradient(0, base, 0, h);
    land.addColorStop(0, "rgba(56,115,71,0.78)");
    land.addColorStop(0.45, "rgba(31,83,49,0.90)");
    land.addColorStop(1, "rgba(17,41,28,1)");

    ctx.fillStyle = land;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, base + 45);
    for (let x = 0; x <= w; x += 22) {
      const nx = x + drift;
      const y =
        base +
        Math.sin(nx * 0.010 + t * 0.18) * 20 +
        Math.sin(nx * 0.026 - t * 0.22) * 9 +
        Math.sin(nx * 0.047 + 2.1) * 5;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    ctx.save();
    ctx.globalAlpha = 0.42;
    ctx.strokeStyle = "rgba(220,255,214,0.13)";
    ctx.lineWidth = 1;

    for (let i = 0; i < 20; i += 1) {
      const y = base + 30 + i * 18;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 30) {
        const ridge =
          y +
          Math.sin((x + drift) * 0.018 + i * 0.8 + t * 0.12) * 7 +
          Math.sin((x + drift) * 0.053 + i) * 2;
        if (x === 0) ctx.moveTo(x, ridge);
        else ctx.lineTo(x, ridge);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawAtmosphere(ctx, w, h, t) {
    ctx.save();

    const breathe = 0.10 + Math.sin(t * 0.45) * 0.035;
    const mist = ctx.createLinearGradient(0, h * 0.18, 0, h * 0.86);
    mist.addColorStop(0, `rgba(141,216,255,${0.05 + breathe})`);
    mist.addColorStop(0.50, "rgba(158,240,191,0.07)");
    mist.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = mist;
    ctx.fillRect(0, 0, w, h);

    ctx.globalAlpha = 0.22;
    ctx.fillStyle = "rgba(255,244,216,0.58)";
    for (let i = 0; i < 36; i += 1) {
      const x = (i * 197 + Math.sin(t * 0.1 + i) * 18) % w;
      const y = (i * 83) % Math.max(1, h * 0.45);
      const r = 0.7 + (i % 3) * 0.3;
      ctx.beginPath();
      ctx.arc(x, y + 12, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawReadout(ctx, w, h) {
    ctx.save();

    const label = "AUDRALIA · POSSIBILITY PATH";
    const sub = "Living canvas · consumer-only";
    const pad = 14;
    const boxW = Math.min(w - 24, 330);
    const boxH = 70;

    ctx.fillStyle = "rgba(3,8,20,0.48)";
    ctx.strokeStyle = "rgba(158,240,191,0.22)";
    ctx.lineWidth = 1;
    roundRect(ctx, 14, 14, boxW, boxH, 18);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "rgba(206,255,228,0.94)";
    ctx.font = "900 12px ui-sans-serif, system-ui, sans-serif";
    ctx.letterSpacing = "0.08em";
    ctx.fillText(label, 14 + pad, 39);

    ctx.fillStyle = "rgba(230,238,255,0.72)";
    ctx.font = "800 12px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(sub, 14 + pad, 61);

    ctx.restore();
  }

  function roundRect(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function render(ctx, canvas, time) {
    if (!state.running) return;

    const t = time * 0.001;
    resizeCanvas(canvas, ctx);

    const w = state.width;
    const h = state.height;

    drawSky(ctx, w, h, t);
    drawWater(ctx, w, h, t);
    drawLand(ctx, w, h, t);
    drawAtmosphere(ctx, w, h, t);
    drawReadout(ctx, w, h);

    window.requestAnimationFrame((next) => render(ctx, canvas, next));
  }

  function bindPointer(canvas) {
    function updateFromEvent(event) {
      const rect = canvas.getBoundingClientRect();
      const point = event.touches && event.touches[0] ? event.touches[0] : event;
      state.pointerX = clamp((point.clientX - rect.left) / Math.max(1, rect.width), 0, 1);
      state.pointerY = clamp((point.clientY - rect.top) / Math.max(1, rect.height), 0, 1);
    }

    canvas.addEventListener("pointerdown", (event) => {
      state.pointerActive = true;
      updateFromEvent(event);
      try { canvas.setPointerCapture(event.pointerId); } catch {}
    });

    canvas.addEventListener("pointermove", (event) => {
      if (!state.pointerActive) return;
      updateFromEvent(event);
    });

    canvas.addEventListener("pointerup", (event) => {
      state.pointerActive = false;
      try { canvas.releasePointerCapture(event.pointerId); } catch {}
    });

    canvas.addEventListener("pointercancel", () => {
      state.pointerActive = false;
    });
  }

  function exposeStatus() {
    window.DGBAudraliaRoute = Object.freeze({
      meta: META,
      getStatus() {
        return Object.freeze({
          booted: true,
          mounted: state.mounted,
          route: META.route,
          contract: META.contract,
          canvasContract: META.canvasContract,
          publicPath: META.publicPath,
          generatedImage: false,
          graphicBox: false,
          streaming: false,
          visualPassClaimed: false,
          consumerOnlyCanvas: true
        });
      }
    });
  }

  function boot() {
    if (!validRoute()) return;

    const stage = getStage();
    const mount = getMount();
    const notice = getNotice();
    const status = getStatus();

    if (!stage || !mount) {
      setText(notice, "Audralia mount missing");
      setText(status, "Canvas mount unavailable");
      return;
    }

    const canvas = makeCanvas(mount);
    const ctx = canvas.getContext("2d", { alpha: true });

    if (!ctx) {
      setText(notice, "Canvas unavailable");
      setText(status, "This browser could not start the Audralia canvas");
      return;
    }

    state.mounted = true;
    stage.setAttribute("data-loader-state", "mounted");
    stage.setAttribute("data-loader-contract", CONTRACT);

    setText(notice, "Living canvas active");
    setText(status, "Possibility path mounted");

    bindPointer(canvas);
    exposeStatus();

    window.requestAnimationFrame((time) => render(ctx, canvas, time));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();

// /showroom/globe/h-earth/index.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_HEX_SUBSTRATE_LIVE_CONDUCTOR_TNT_v1
// Owns: H-Earth child-route conductor with guaranteed base render and live hex substrate enhancement.
// Does not mutate /showroom/globe/.

const CONTRACT = "H_EARTH_HEX_SUBSTRATE_LIVE_CONDUCTOR_TNT_v1";

const MODULE_PATHS = Object.freeze({
  scene: "/assets/world/environment/scene.js?v=H_EARTH_HEX_SUBSTRATE_LIVE_v1",
  profile: "/assets/h-earth/h-earth.environment.profile.js?v=H_EARTH_HEX_SUBSTRATE_LIVE_v1"
});

const state = {
  canvas: null,
  ctx: null,
  raf: 0,
  startedAt: performance.now(),
  lastFrame: 0,
  targetFrameMs: 50,
  mode: "booting",
  scene: null,
  bootError: null,
  moduleDebt: [],
  receipt: null
};

function setStatus(text) {
  const node = document.querySelector("[data-render-status]");
  if (node) node.textContent = text;
}

function markDocument(extra = {}) {
  const markers = {
    page: "h-earth-hex-substrate-ground-engine",
    route: "/showroom/globe/h-earth/",
    contract: CONTRACT,
    parentBaseline: "/showroom/globe/",
    parentMutation: "false",
    groundLevel: "true",
    reusableEnvironmentEngine: "true",
    hexSubstrate: "live",
    staticImageSource: "false",
    shimmerProtocol: "active",
    mode: state.mode,
    ...extra
  };

  Object.entries(markers).forEach(([key, value]) => {
    document.documentElement.dataset[key] = String(value);
    if (document.body) document.body.dataset[key] = String(value);
  });
}

function resizeCanvas() {
  const box = state.canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 1.4);
  const width = Math.max(900, Math.floor((box.width || 980) * dpr));
  const height = Math.max(1180, Math.floor((box.height || 1200) * dpr));

  if (state.canvas.width !== width || state.canvas.height !== height) {
    state.canvas.width = width;
    state.canvas.height = height;
  }

  return { width, height };
}

function drawBaseFrame(time = performance.now()) {
  if (!state.ctx || !state.canvas || state.mode === "enhanced") return;

  if (time - state.lastFrame < state.targetFrameMs) {
    state.raf = requestAnimationFrame(drawBaseFrame);
    return;
  }

  state.lastFrame = time;

  const { width: w, height: h } = resizeCanvas();
  const t = (time - state.startedAt) / 1000;
  const ctx = state.ctx;

  ctx.clearRect(0, 0, w, h);

  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "rgb(78,108,132)");
  sky.addColorStop(0.22, "rgb(163,178,174)");
  sky.addColorStop(0.42, "rgb(224,203,162)");
  sky.addColorStop(0.62, "rgb(90,102,73)");
  sky.addColorStop(1, "rgb(28,48,39)");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  const sun = ctx.createRadialGradient(w * 0.80, h * 0.13, 0, w * 0.80, h * 0.13, w * 0.62);
  sun.addColorStop(0, "rgba(255,245,207,.62)");
  sun.addColorStop(0.26, "rgba(255,224,156,.34)");
  sun.addColorStop(1, "rgba(255,205,125,0)");
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, w, h);

  const oceanTop = h * 0.35;
  const oceanBottom = h * 0.588;
  const ocean = ctx.createLinearGradient(0, oceanTop, 0, oceanBottom);
  ocean.addColorStop(0, "rgb(94,150,155)");
  ocean.addColorStop(0.52, "rgb(42,106,136)");
  ocean.addColorStop(1, "rgb(13,61,93)");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, oceanTop, w, oceanBottom - oceanTop);

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < 140; i += 1) {
    const x = w * (0.44 + ((Math.sin(i * 17.11) * 43758.54) % 1 + 1) % 1 * 0.50);
    const y = h * (0.39 + ((Math.sin(i * 19.77) * 43758.54) % 1 + 1) % 1 * 0.15);
    const pulse = Math.max(0, Math.sin(t * 1.28 + i * 0.61));
    ctx.globalAlpha = 0.03 + pulse * 0.12;
    ctx.fillStyle = "rgba(255,238,187,.68)";
    ctx.beginPath();
    ctx.ellipse(x, y, w * 0.003, h * 0.00075, -0.14, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  const groundTop = h * 0.558;
  const ground = ctx.createLinearGradient(0, groundTop, 0, h);
  ground.addColorStop(0, "rgb(148,137,77)");
  ground.addColorStop(0.38, "rgb(62,89,56)");
  ground.addColorStop(1, "rgb(17,31,26)");
  ctx.fillStyle = ground;
  ctx.beginPath();
  ctx.moveTo(0, groundTop);
  for (let i = 0; i <= 100; i += 1) {
    const x = (i / 100) * w;
    const y = groundTop + Math.sin(i * 0.43) * h * 0.010 + Math.sin(i * 1.27) * h * 0.006;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(180,148,88,.84)";
  ctx.strokeStyle = "rgba(238,207,143,.42)";
  ctx.lineWidth = Math.max(1, w * 0.0012);
  const mx = w * 0.50;
  const my = h * 0.615;
  const mw = w * 0.37;
  const mh = h * 0.15;
  ctx.fillRect(mx - mw * 0.5, my - mh, mw, mh);
  ctx.strokeRect(mx - mw * 0.5, my - mh, mw, mh);
  ctx.fillStyle = "rgb(45,39,36)";
  ctx.beginPath();
  ctx.moveTo(mx - mw * 0.56, my - mh);
  ctx.lineTo(mx, my - mh * 1.55);
  ctx.lineTo(mx + mw * 0.56, my - mh);
  ctx.closePath();
  ctx.fill();

  state.receipt = Object.freeze({
    contract: CONTRACT,
    route: "/showroom/globe/h-earth/",
    mode: state.mode,
    parentMutation: false,
    rendered: true,
    hexSubstrate: "pending-enhancement",
    moduleDebt: [...state.moduleDebt]
  });

  state.raf = requestAnimationFrame(drawBaseFrame);
}

function startBaseRenderer() {
  state.mode = "base";
  setStatus("Base ground renderer active. Loading live hex substrate.");
  markDocument({ rendered: "true", mode: state.mode, hexSubstrate: "pending" });
  cancelAnimationFrame(state.raf);
  state.raf = requestAnimationFrame(drawBaseFrame);
}

async function attachHexScene() {
  try {
    const [sceneModule, profileModule] = await Promise.all([
      import(MODULE_PATHS.scene),
      import(MODULE_PATHS.profile)
    ]);

    if (typeof sceneModule.createGroundEnvironmentScene !== "function") {
      throw new Error("scene.js missing createGroundEnvironmentScene export.");
    }

    if (typeof profileModule.getHEarthWesternGoldenShelfProfile !== "function") {
      throw new Error("h-earth.environment.profile.js missing getHEarthWesternGoldenShelfProfile export.");
    }

    const profile = profileModule.getHEarthWesternGoldenShelfProfile();

    const scene = sceneModule.createGroundEnvironmentScene(state.canvas, profile, {
      targetFrameMs: 50,
      maxDpr: 1.75,
      minWidth: 960,
      minHeight: 1180
    });

    cancelAnimationFrame(state.raf);
    state.scene = scene.start();
    state.mode = "enhanced";

    setStatus("Reusable ground environment engine active. Hex substrate live. Shimmer Protocol active.");
    markDocument({
      rendered: "true",
      mode: state.mode,
      sceneEngine: "active",
      hexSubstrate: "live",
      moduleDebt: state.moduleDebt.length ? state.moduleDebt.join(",") : "none"
    });
  } catch (error) {
    const message = error?.message || "Hex substrate module chain failed.";
    state.moduleDebt.push(message);
    state.mode = "base";
    setStatus(`Base renderer active. Hex substrate debt: ${message}`);
    markDocument({
      rendered: "true",
      mode: state.mode,
      sceneEngine: "deferred",
      hexSubstrate: "deferred",
      moduleDebt: state.moduleDebt.join(" | ")
    });
  }
}

function init() {
  markDocument({ boot: "started" });

  state.canvas = document.querySelector("[data-h-earth-ground-canvas]");

  if (!state.canvas) {
    state.bootError = "Ground canvas missing.";
    setStatus(state.bootError);
    markDocument({ rendered: "false", error: state.bootError });
    return;
  }

  state.ctx = state.canvas.getContext("2d", { alpha: false });

  if (!state.ctx) {
    state.bootError = "Ground canvas 2D context unavailable.";
    setStatus(state.bootError);
    markDocument({ rendered: "false", error: state.bootError });
    return;
  }

  startBaseRenderer();
  void attachHexScene();

  window.DGBHEarthGround = Object.freeze({
    status() {
      return Object.freeze({
        contract: CONTRACT,
        route: "/showroom/globe/h-earth/",
        parentBaseline: "/showroom/globe/",
        parentMutation: false,
        reusableEnvironmentEngine: true,
        staticImageSource: false,
        shimmerProtocol: true,
        hexSubstrate: state.mode === "enhanced" ? "live" : "pending-or-deferred",
        mode: state.mode,
        bootError: state.bootError,
        moduleDebt: [...state.moduleDebt],
        scene: state.scene?.status?.() || null,
        receipt: state.receipt
      });
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}

export default init;

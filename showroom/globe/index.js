// /showroom/globe/h-earth/index.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_GROUND_LEVEL_EARTH_WATER_AIR_RUNTIME_TNT_v1
// Owns:
// - single ground-level canvas runtime for H-Earth
// - earth / water / air condition rendering
// - lightweight drag interaction
// - runtime cleanup on hidden / page exit
// Does not own:
// - parent globe selector
// - cross-planet rendering
// - gauges logic
// - external asset loading
// - generated imagery

const CONTRACT = "H_EARTH_GROUND_LEVEL_EARTH_WATER_AIR_RUNTIME_TNT_v1";
const ROUTE = "/showroom/globe/h-earth/";
const TAU = Math.PI * 2;

const state = {
  canvas: null,
  ctx: null,
  raf: 0,
  running: false,
  startedAt: performance.now(),
  width: 0,
  height: 0,
  dpr: 1,
  shiftX: 0,
  shiftY: 0,
  velocityX: 0,
  velocityY: 0,
  dragging: false,
  lastX: 0,
  lastY: 0,
  motion: true,
  detail: "standard",
  visible: true,
  lastTap: 0
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function markDocument(extra = {}) {
  const markers = {
    route: ROUTE,
    contract: CONTRACT,
    page: "h-earth-ground-level",
    sceneModel: "earth-water-air-condition-stack",
    renderedBy: "lightweight-condition-runtime",
    motion: state.motion ? "on" : "off",
    detail: state.detail,
    ...extra
  };

  Object.entries(markers).forEach(([key, value]) => {
    document.documentElement.dataset[key] = String(value);
    if (document.body) {
      document.body.dataset[key] = String(value);
    }
  });
}

function resolveCanvas() {
  return document.querySelector("[data-scene-canvas]");
}

function setText(selector, value) {
  const node = document.querySelector(selector);
  if (node) node.textContent = value;
}

function updateSceneNote() {
  const detailText = state.detail === "high" ? "refined shimmer and cloud detail" : "clean baseline condition detail";
  const motionText = state.motion ? "motion active" : "motion paused";
  setText("[data-scene-note]", `Earth owns the foreground. Water owns the horizon band. Air owns the light, haze, and sky. Current runtime: ${detailText}, ${motionText}.`);
}

function updateControls() {
  const motion = document.querySelector("[data-control='motion']");
  const detail = document.querySelector("[data-control='detail']");

  if (motion) {
    motion.textContent = `Motion: ${state.motion ? "on" : "off"}`;
    motion.classList.toggle("active", state.motion);
  }

  if (detail) {
    detail.textContent = `Detail: ${state.detail}`;
    detail.classList.toggle("active", state.detail === "high");
  }

  updateSceneNote();
  markDocument();
}

function resizeCanvas() {
  if (!state.canvas) return;

  const rect = state.canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 1.8);

  const width = Math.max(640, Math.floor(rect.width * dpr));
  const height = Math.max(390, Math.floor(rect.height * dpr));

  if (state.canvas.width !== width || state.canvas.height !== height) {
    state.canvas.width = width;
    state.canvas.height = height;
  }

  state.width = width;
  state.height = height;
  state.dpr = dpr;
}

function drawSky(ctx, width, height, time, horizonY) {
  const sky = ctx.createLinearGradient(0, 0, 0, horizonY);
  sky.addColorStop(0, "rgba(8,28,62,1)");
  sky.addColorStop(0.35, "rgba(28,72,122,1)");
  sky.addColorStop(0.72, "rgba(96,148,186,1)");
  sky.addColorStop(1, "rgba(164,196,212,1)");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, horizonY);

  const glow = ctx.createRadialGradient(
    width * (0.68 + state.shiftX * 0.000015),
    horizonY * 0.42,
    0,
    width * (0.68 + state.shiftX * 0.000015),
    horizonY * 0.42,
    width * 0.32
  );
  glow.addColorStop(0, "rgba(248,226,164,0.40)");
  glow.addColorStop(0.38, "rgba(244,207,131,0.16)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, horizonY);

  const haze = ctx.createLinearGradient(0, horizonY * 0.6, 0, horizonY + height * 0.06);
  haze.addColorStop(0, "rgba(255,255,255,0)");
  haze.addColorStop(1, "rgba(236,224,204,0.18)");
  ctx.fillStyle = haze;
  ctx.fillRect(0, horizonY * 0.6, width, height * 0.18);

  const cloudCount = state.detail === "high" ? 8 : 5;
  for (let i = 0; i < cloudCount; i += 1) {
    const drift = state.motion ? time * (0.002 + i * 0.0003) : 0;
    const x = ((width * (0.12 + i * 0.16)) + drift * width + state.shiftX * 0.35) % (width + 220) - 110;
    const y = horizonY * (0.18 + i * 0.08) + Math.sin(time * 0.0005 + i) * 6;
    const rx = width * (0.08 + (i % 3) * 0.018);
    const ry = rx * 0.30;

    const cloud = ctx.createRadialGradient(x, y, 0, x, y, rx);
    cloud.addColorStop(0, "rgba(255,255,255,0.18)");
    cloud.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = cloud;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, TAU);
    ctx.fill();
  }
}

function drawWater(ctx, width, height, time, horizonY, shoreY) {
  const waterTop = horizonY;
  const waterBottom = Math.min(height, shoreY + height * 0.12);

  const water = ctx.createLinearGradient(0, waterTop, 0, waterBottom);
  water.addColorStop(0, "rgba(84,140,168,0.98)");
  water.addColorStop(0.25, "rgba(42,98,136,0.98)");
  water.addColorStop(0.70, "rgba(17,56,88,0.99)");
  water.addColorStop(1, "rgba(8,28,46,1)");
  ctx.fillStyle = water;
  ctx.fillRect(0, waterTop, width, waterBottom - waterTop);

  const shimmerBands = state.detail === "high" ? 26 : 16;
  for (let i = 0; i < shimmerBands; i += 1) {
    const y = waterTop + (i / shimmerBands) * (waterBottom - waterTop);
    const alpha = 0.05 + (1 - i / shimmerBands) * 0.08;
    const wobble = Math.sin(time * 0.0026 + i * 0.72) * 22 + state.shiftX * 0.16;
    const span = width * (0.18 + (1 - i / shimmerBands) * 0.34);

    const grad = ctx.createLinearGradient(width * 0.5 - span + wobble, 0, width * 0.5 + span + wobble, 0);
    grad.addColorStop(0, `rgba(255,255,255,0)`);
    grad.addColorStop(0.5, `rgba(255,236,186,${alpha.toFixed(3)})`);
    grad.addColorStop(1, `rgba(255,255,255,0)`);

    ctx.strokeStyle = grad;
    ctx.lineWidth = Math.max(1, state.dpr * (state.detail === "high" ? 1.2 : 0.9));
    ctx.beginPath();
    ctx.moveTo(width * 0.5 - span + wobble, y);
    ctx.lineTo(width * 0.5 + span + wobble, y);
    ctx.stroke();
  }

  const waveRows = state.detail === "high" ? 7 : 4;
  for (let i = 0; i < waveRows; i += 1) {
    const y = waterTop + height * (0.04 + i * 0.045);
    const amp = 4 + i * 1.8;
    const freq = 0.010 + i * 0.0018;
    ctx.strokeStyle = `rgba(190,224,238,${0.12 - i * 0.014})`;
    ctx.lineWidth = Math.max(1, state.dpr * 0.8);
    ctx.beginPath();

    for (let x = 0; x <= width; x += 10) {
      const wave = Math.sin(x * freq + time * 0.0024 + i) * amp + Math.sin(x * freq * 0.42 + time * 0.0012) * amp * 0.45;
      const px = x;
      const py = y + wave;
      if (x === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }

    ctx.stroke();
  }
}

function drawEarth(ctx, width, height, time, shoreY) {
  const groundGrad = ctx.createLinearGradient(0, shoreY, 0, height);
  groundGrad.addColorStop(0, "rgba(140,118,80,1)");
  groundGrad.addColorStop(0.24, "rgba(112,88,58,1)");
  groundGrad.addColorStop(0.68, "rgba(74,56,38,1)");
  groundGrad.addColorStop(1, "rgba(34,24,18,1)");
  ctx.fillStyle = groundGrad;

  const curve = height * 0.05;
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, shoreY + curve);
  ctx.bezierCurveTo(
    width * 0.18,
    shoreY - 14 + state.shiftY * 0.22,
    width * 0.38,
    shoreY + 26 - state.shiftY * 0.12,
    width * 0.56,
    shoreY + 10
  );
  ctx.bezierCurveTo(
    width * 0.68,
    shoreY + 2,
    width * 0.84,
    shoreY + 22,
    width,
    shoreY + 8
  );
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  const shore = ctx.createLinearGradient(0, shoreY - 12, 0, shoreY + 18);
  shore.addColorStop(0, "rgba(240,220,178,0.30)");
  shore.addColorStop(0.45, "rgba(210,182,124,0.22)");
  shore.addColorStop(1, "rgba(86,64,42,0)");
  ctx.fillStyle = shore;
  ctx.fillRect(0, shoreY - 12, width, 26);

  const ridges = state.detail === "high" ? 6 : 3;
  for (let i = 0; i < ridges; i += 1) {
    const y = shoreY + 26 + i * 22;
    ctx.strokeStyle = `rgba(22,14,10,${0.18 - i * 0.02})`;
    ctx.lineWidth = Math.max(1, state.dpr * 1.1);
    ctx.beginPath();

    for (let x = 0; x <= width; x += 14) {
      const noise = Math.sin(x * 0.012 + i * 0.8 + time * 0.0007) * (4 + i * 1.2);
      const tilt = Math.sin(x * 0.004 + i) * 3;
      const py = y + noise + tilt;
      if (x === 0) ctx.moveTo(x, py);
      else ctx.lineTo(x, py);
    }

    ctx.stroke();
  }
}

function drawFrame(now = performance.now()) {
  if (!state.running || !state.ctx || !state.canvas || !state.visible) return;

  const ctx = state.ctx;
  const width = state.width;
  const height = state.height;
  const time = now - state.startedAt;

  if (state.motion && !state.dragging) {
    state.shiftX += state.velocityX;
    state.shiftY += state.velocityY;
    state.velocityX *= 0.96;
    state.velocityY *= 0.94;

    if (Math.abs(state.velocityX) < 0.002) state.velocityX = 0;
    if (Math.abs(state.velocityY) < 0.002) state.velocityY = 0;
  }

  state.shiftX = clamp(state.shiftX, -120, 120);
  state.shiftY = clamp(state.shiftY, -60, 60);

  ctx.clearRect(0, 0, width, height);

  const horizonBase = height * 0.46;
  const horizonY = clamp(horizonBase + state.shiftY * 0.32, height * 0.34, height * 0.56);
  const shoreY = clamp(height * 0.70 + state.shiftY * 0.24, height * 0.60, height * 0.82);

  drawSky(ctx, width, height, time, horizonY);
  drawWater(ctx, width, height, time, horizonY, shoreY);
  drawEarth(ctx, width, height, time, shoreY);

  window.DGBHEarthGroundLevelReceipt = Object.freeze({
    contract: CONTRACT,
    route: ROUTE,
    scene: "earth-water-air",
    motion: state.motion,
    detail: state.detail,
    rendered: true,
    width,
    height,
    shiftX: Number(state.shiftX.toFixed(2)),
    shiftY: Number(state.shiftY.toFixed(2))
  });

  state.raf = window.requestAnimationFrame(drawFrame);
}

function stop() {
  state.running = false;
  if (state.raf) {
    window.cancelAnimationFrame(state.raf);
    state.raf = 0;
  }
}

function start() {
  if (!state.ctx || !state.canvas || !state.visible) return;
  if (state.running) return;
  state.running = true;
  state.raf = window.requestAnimationFrame(drawFrame);
}

function resetView() {
  state.shiftX = 0;
  state.shiftY = 0;
  state.velocityX = 0;
  state.velocityY = 0;
}

function bindControls() {
  document.querySelector("[data-control='motion']")?.addEventListener("click", () => {
    state.motion = !state.motion;
    updateControls();

    if (state.motion && state.visible) {
      start();
    }
  });

  document.querySelector("[data-control='detail']")?.addEventListener("click", () => {
    state.detail = state.detail === "standard" ? "high" : "standard";
    updateControls();
  });

  document.querySelector("[data-control='reset']")?.addEventListener("click", () => {
    resetView();
    updateControls();
  });
}

function bindCanvas() {
  const canvas = state.canvas;
  if (!canvas) return;

  canvas.addEventListener("pointerdown", (event) => {
    state.dragging = true;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.velocityX = 0;
    state.velocityY = 0;
    canvas.setPointerCapture?.(event.pointerId);

    const now = performance.now();
    if (now - state.lastTap < 320) {
      resetView();
    }
    state.lastTap = now;
  }, { passive: true });

  canvas.addEventListener("pointermove", (event) => {
    if (!state.dragging) return;

    const dx = event.clientX - state.lastX;
    const dy = event.clientY - state.lastY;

    state.shiftX = clamp(state.shiftX + dx * state.dpr, -120, 120);
    state.shiftY = clamp(state.shiftY + dy * state.dpr * 0.55, -60, 60);
    state.velocityX = dx * 0.16;
    state.velocityY = dy * 0.08;

    state.lastX = event.clientX;
    state.lastY = event.clientY;
  }, { passive: true });

  const release = (event) => {
    if (!state.dragging) return;
    state.dragging = false;
    canvas.releasePointerCapture?.(event.pointerId);
  };

  canvas.addEventListener("pointerup", release, { passive: true });
  canvas.addEventListener("pointercancel", release, { passive: true });
  canvas.addEventListener("pointerleave", () => {
    state.dragging = false;
  }, { passive: true });
}

function bindLifecycle() {
  window.addEventListener("resize", () => {
    resizeCanvas();
  }, { passive: true });

  document.addEventListener("visibilitychange", () => {
    state.visible = document.visibilityState === "visible";
    if (state.visible) {
      start();
    } else {
      stop();
    }
  });

  window.addEventListener("pagehide", () => {
    stop();
  }, { once: true });

  window.addEventListener("beforeunload", () => {
    stop();
  }, { once: true });
}

function exposeStatus() {
  window.DGBHEarthGroundLevel = Object.freeze({
    status() {
      return Object.freeze({
        contract: CONTRACT,
        route: ROUTE,
        canvasFound: Boolean(state.canvas),
        contextFound: Boolean(state.ctx),
        motion: state.motion,
        detail: state.detail,
        rendered: Boolean(window.DGBHEarthGroundLevelReceipt),
        receipt: window.DGBHEarthGroundLevelReceipt || null
      });
    }
  });
}

function init() {
  state.canvas = resolveCanvas();

  if (!state.canvas) {
    markDocument({ rendered: "false", error: "canvas-not-found" });
    exposeStatus();
    return;
  }

  state.ctx = state.canvas.getContext("2d", { alpha: false });

  resizeCanvas();
  bindControls();
  bindCanvas();
  bindLifecycle();
  updateControls();
  markDocument({ rendered: "true" });
  exposeStatus();
  start();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}

export default init;

// /showroom/globe/index.js
// TNT FULL-FILE REPLACEMENT
// SHOWROOM_GLOBE_RUNTIME_INPUT_AND_RAF_CONTAINMENT_RENEWAL_TNT_v1
// Parent /showroom/globe/ only.
// Preserves satellite graphics, bodies, routes, drag inspection, and glide.
// Renews runtime containment so navigation remains usable after load.

const CONTRACT = "SHOWROOM_GLOBE_RUNTIME_INPUT_AND_RAF_CONTAINMENT_RENEWAL_TNT_v1";
const PREVIOUS_CONTRACT = "SHOWROOM_GLOBE_PARENT_SATELLITE_HARD_RESTORE_TNT_v6";
const MATERIAL_SRC = "/assets/showroom.globe.cinematic.material.js?v=SHOWROOM_GLOBE_SATELLITE_CINEMATIC_MATERIAL_RECONNECT_TNT_v5";
const TAU = Math.PI * 2;

const BODIES = Object.freeze({
  zionts: {
    key: "zionts",
    label: "ZIONTS",
    subtitle: "Ancient Living World · material-led hydrated runtime",
    copy: "Ancient living reference body. Satellite planetary selector view only.",
    route: "/showroom/globe/earth/",
    seed: 1401,
    seaLevel: 0.118,
    stoneLow: [74, 91, 67],
    stoneMid: [145, 137, 92],
    stoneHigh: [217, 199, 137],
    stoneDeep: [40, 54, 49],
    sediment: [180, 156, 96],
    exposed: [224, 207, 151],
    ridge: [238, 221, 160],
    scar: [44, 38, 34],
    shadow: [14, 22, 29],
    atmosphere: [108, 176, 205]
  },
  "h-earth": {
    key: "h-earth",
    label: "H-Earth",
    subtitle: "Hybrid Ancient Living World · physical dry material",
    copy: "Hybrid ancient living world. Satellite selector view only from this parent page.",
    route: "/showroom/globe/h-earth/",
    seed: 2402,
    seaLevel: 0.095,
    stoneLow: [82, 88, 63],
    stoneMid: [159, 147, 86],
    stoneHigh: [229, 207, 132],
    stoneDeep: [47, 59, 50],
    sediment: [192, 168, 99],
    exposed: [231, 211, 145],
    ridge: [242, 226, 167],
    scar: [42, 34, 29],
    shadow: [18, 24, 24],
    atmosphere: [116, 194, 171]
  },
  audralia: {
    key: "audralia",
    label: "Audralia",
    subtitle: "Ancient Constructed Living World · physical material",
    copy: "Ancient constructed living world. Audralia is its own constructed body and is not Australia.",
    route: "/showroom/globe/audralia/",
    seed: 3403,
    seaLevel: 0.084,
    stoneLow: [72, 60, 86],
    stoneMid: [148, 94, 126],
    stoneHigh: [221, 164, 182],
    stoneDeep: [43, 35, 60],
    sediment: [179, 118, 148],
    exposed: [225, 174, 190],
    ridge: [238, 196, 209],
    scar: [37, 25, 39],
    shadow: [18, 15, 29],
    atmosphere: [136, 106, 205]
  }
});

const state = {
  body: "zionts",
  canvas: null,
  ctx: null,
  renderer: null,

  raf: 0,
  stopped: false,
  hidden: document.visibilityState === "hidden",
  bootedAt: performance.now(),
  lastFrameAt: 0,
  lastReceiptAt: 0,

  yaw: 0.18,
  pitch: -0.06,
  velocity: 0.004,
  dragging: false,
  pointerId: null,
  lastX: 0,
  lastY: 0,
  lastTap: 0,

  auto: true,
  detail: "stable",
  glide: "soft",
  quality: "settled",
  settleUntil: 0,

  width: 0,
  height: 0,
  dpr: 1,
  cssWidth: 0,
  cssHeight: 0,
  backgroundCanvas: null,
  resizeObserver: null,
  resizeTimer: 0,

  materialError: null
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function seededNoise(index, salt = 0) {
  return ((Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453123) % 1 + 1) % 1;
}

function markDocument(extra = {}) {
  const markers = {
    page: "showroom-globe-satellite-selector",
    route: "/showroom/globe/",
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    jurisdiction: "parent-satellite-selector",
    runtimeContainment: "active",
    selectedBody: state.body,
    renderedBy: "contained-cinematic-satellite-material-runtime",
    rafMode: state.auto ? "contained-auto-throttled" : "on-demand",
    inputScope: "canvas-only",
    ...extra
  };

  Object.entries(markers).forEach(([key, value]) => {
    document.documentElement.dataset[key] = String(value);
    if (document.body) document.body.dataset[key] = String(value);
  });
}

function publishReceipt(extra = {}) {
  const receipt = Object.freeze({
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    route: "/showroom/globe/",
    selectedBody: state.body,
    quality: state.quality,
    detail: state.detail,
    auto: state.auto,
    glide: state.glide,
    dragging: state.dragging,
    inputScope: "canvas-only",
    rafContainment: "active",
    permanentFullSpeedRaf: false,
    backgroundCached: Boolean(state.backgroundCanvas),
    resizeMeasuredEveryFrame: false,
    materialRenderer: state.renderer?.version || "fallback",
    materialError: state.materialError,
    rendered: Boolean(state.ctx && state.canvas),
    canvasWidth: state.width,
    canvasHeight: state.height,
    ...extra
  });

  window.DGBShowroomGlobeReceipt = receipt;
  return receipt;
}

function safeText(selector, value) {
  const node = document.querySelector(selector);
  if (node) node.textContent = value;
}

function updateCopy() {
  const body = BODIES[state.body];

  safeText("[data-body-title]", body.label);
  safeText("[data-body-subtitle]", body.subtitle);
  safeText("[data-body-card-title]", body.label);
  safeText("[data-body-card-copy]", body.copy);

  const open = document.querySelector("[data-open-body]");
  if (open) {
    open.href = body.route;
    open.textContent = `Open ${body.label}`;
  }

  document.querySelectorAll("[data-body]").forEach((button) => {
    button.setAttribute("aria-selected", button.dataset.body === state.body ? "true" : "false");
  });

  markDocument();
  publishReceipt({ copyUpdated: true });
}

function resolveCanvas() {
  return (
    document.querySelector("[data-globe-canvas]") ||
    document.querySelector(".globe-stage canvas") ||
    document.querySelector("canvas")
  );
}

function drawStaticBackground(targetCanvas, width, height) {
  const ctx = targetCanvas.getContext("2d", { alpha: false });
  if (!ctx) return;

  const bg = ctx.createRadialGradient(width * 0.5, height * 0.38, 0, width * 0.5, height * 0.38, width * 0.72);
  bg.addColorStop(0, "rgba(34,72,105,0.36)");
  bg.addColorStop(0.44, "rgba(7,22,42,0.86)");
  bg.addColorStop(1, "rgba(1,5,14,1)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 115; i += 1) {
    const x = seededNoise(i, 10) * width;
    const y = seededNoise(i, 11) * height;
    const r = Math.max(0.5, width * (0.00042 + seededNoise(i, 12) * 0.0012));
    const opacity = 0.075 + seededNoise(i, 13) * 0.15;

    ctx.fillStyle = `rgba(238,244,255,${opacity.toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
  }

  const haze = ctx.createRadialGradient(width * 0.5, height * 0.44, width * 0.05, width * 0.5, height * 0.44, width * 0.58);
  haze.addColorStop(0, "rgba(120,170,210,0.08)");
  haze.addColorStop(0.58, "rgba(60,110,170,0.05)");
  haze.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = haze;
  ctx.fillRect(0, 0, width, height);
}

function rebuildBackgroundCache(width, height) {
  const background = document.createElement("canvas");
  background.width = width;
  background.height = height;
  drawStaticBackground(background, width, height);
  state.backgroundCanvas = background;
}

function measureCanvas() {
  if (!state.canvas) return false;

  const rect = state.canvas.getBoundingClientRect();
  const parent = state.canvas.parentElement?.getBoundingClientRect?.();

  const cssWidth = rect.width || parent?.width || 640;
  const cssHeight = rect.height || parent?.height || Math.max(520, cssWidth * 0.92);
  const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

  const width = Math.max(640, Math.floor(cssWidth * dpr));
  const height = Math.max(560, Math.floor(cssHeight * dpr));

  const changed =
    state.canvas.width !== width ||
    state.canvas.height !== height ||
    state.width !== width ||
    state.height !== height;

  if (changed) {
    state.canvas.width = width;
    state.canvas.height = height;
    state.width = width;
    state.height = height;
    state.cssWidth = cssWidth;
    state.cssHeight = cssHeight;
    state.dpr = dpr;
    rebuildBackgroundCache(width, height);
  }

  return changed;
}

function scheduleResize() {
  window.clearTimeout(state.resizeTimer);
  state.resizeTimer = window.setTimeout(() => {
    if (state.stopped) return;
    measureCanvas();
    state.settleUntil = performance.now() + 360;
    requestDraw("resize");
  }, 110);
}

function installResizeContainment() {
  if (!state.canvas) return;

  if ("ResizeObserver" in window) {
    state.resizeObserver = new ResizeObserver(scheduleResize);
    state.resizeObserver.observe(state.canvas);
    if (state.canvas.parentElement) state.resizeObserver.observe(state.canvas.parentElement);
  }

  window.addEventListener("resize", scheduleResize, { passive: true });
  window.addEventListener("orientationchange", scheduleResize, { passive: true });
}

function drawFallback(ctx, width, height, time) {
  const body = BODIES[state.body];
  const cx = width * 0.5;
  const cy = height * 0.47;
  const radius = Math.min(width, height) * 0.305;
  const yaw = state.yaw;

  const outer = ctx.createRadialGradient(cx, cy, radius * 0.70, cx, cy, radius * 1.34);
  outer.addColorStop(0, "rgba(0,0,0,0)");
  outer.addColorStop(0.82, `rgba(${body.atmosphere[0]},${body.atmosphere[1]},${body.atmosphere[2]},0.30)`);
  outer.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = outer;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.34, 0, TAU);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.clip();

  const ocean = ctx.createRadialGradient(cx - radius * 0.28, cy - radius * 0.30, radius * 0.10, cx, cy, radius * 1.08);
  ocean.addColorStop(0, "rgba(70,140,154,1)");
  ocean.addColorStop(0.45, "rgba(24,86,118,1)");
  ocean.addColorStop(1, "rgba(14,32,42,1)");
  ctx.fillStyle = ocean;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  for (let i = 0; i < 30; i += 1) {
    const local = body.seed + i * 19;
    const a = yaw + i * 0.63 + seededNoise(local, 2) * 0.92;
    const orbit = 0.15 + seededNoise(local, 3) * 0.78;

    const x = cx + Math.sin(a) * radius * orbit;
    const y = cy + Math.cos(a * 0.74 + state.pitch) * radius * (0.12 + seededNoise(local, 4) * 0.66);

    const rx = radius * (0.05 + seededNoise(local, 5) * 0.175);
    const ry = radius * (0.024 + seededNoise(local, 6) * 0.09);
    const rot = a * 0.42 + seededNoise(local, 7);

    const land = ctx.createRadialGradient(x - rx * 0.18, y - ry * 0.28, 0, x, y, Math.max(rx, ry));
    land.addColorStop(0, `rgba(${body.stoneHigh[0]},${body.stoneHigh[1]},${body.stoneHigh[2]},0.62)`);
    land.addColorStop(0.52, `rgba(${body.stoneMid[0]},${body.stoneMid[1]},${body.stoneMid[2]},0.80)`);
    land.addColorStop(1, `rgba(${body.shadow[0]},${body.shadow[1]},${body.shadow[2]},0.42)`);

    ctx.fillStyle = land;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, rot, 0, TAU);
    ctx.fill();
  }

  const shadow = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
  shadow.addColorStop(0, "rgba(0,0,0,0.18)");
  shadow.addColorStop(0.38, "rgba(0,0,0,0)");
  shadow.addColorStop(1, "rgba(0,0,0,0.40)");
  ctx.fillStyle = shadow;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  ctx.restore();

  const rim = ctx.createRadialGradient(cx, cy, radius * 0.86, cx, cy, radius * 1.05);
  rim.addColorStop(0, "rgba(0,0,0,0)");
  rim.addColorStop(0.78, `rgba(${body.atmosphere[0]},${body.atmosphere[1]},${body.atmosphere[2]},0.18)`);
  rim.addColorStop(1, "rgba(255,255,255,0.04)");
  ctx.fillStyle = rim;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.05, 0, TAU);
  ctx.fill();
}

function computeFrameInterval(now) {
  if (state.dragging) return 16;
  if (now < state.settleUntil) return 33;
  if (Math.abs(state.velocity) > 0.00012) return 50;
  if (state.auto) return 66;
  return 120;
}

function shouldContinue(now) {
  return (
    !state.stopped &&
    !state.hidden &&
    (state.dragging || state.auto || Math.abs(state.velocity) > 0.00012 || now < state.settleUntil)
  );
}

function updateDynamics(time) {
  const previous = state.lastFrameAt || time - 16;
  const dtSeconds = clamp((time - previous) / 1000, 0.001, 0.08);
  const frameScale = dtSeconds * 60;

  if (state.auto && !state.dragging && Math.abs(state.velocity) < 0.0016) {
    state.velocity = state.velocity < 0 ? -0.0016 : 0.0016;
  }

  if (!state.dragging) {
    state.yaw += state.velocity * frameScale;
    const decay = state.glide === "soft" ? 0.985 : 0.94;
    state.velocity *= Math.pow(decay, frameScale);
  }

  if (state.dragging) {
    state.quality = "motion";
  } else if (time < state.settleUntil) {
    state.quality = "settling";
  } else {
    state.quality = "settled";
  }
}

function drawFrame(time = performance.now()) {
  state.raf = 0;

  if (state.stopped || state.hidden || !state.ctx || !state.canvas) return;

  const interval = computeFrameInterval(time);
  if (state.lastFrameAt && time - state.lastFrameAt < interval) {
    if (shouldContinue(time)) state.raf = requestAnimationFrame(drawFrame);
    return;
  }

  updateDynamics(time);
  state.lastFrameAt = time;

  const ctx = state.ctx;
  const width = state.width || state.canvas.width;
  const height = state.height || state.canvas.height;
  const dpr = state.dpr || 1;
  const body = BODIES[state.body];

  if (!width || !height || !body) return;

  ctx.clearRect(0, 0, width, height);

  if (state.backgroundCanvas) {
    ctx.drawImage(state.backgroundCanvas, 0, 0);
  } else {
    drawStaticBackground(state.canvas, width, height);
  }

  const scale = Math.min(width, height) * 0.305;

  if (state.renderer) {
    state.renderer.drawPlanet(ctx, {
      cx: width * 0.5,
      cy: height * 0.47,
      scale,
      yaw: state.yaw,
      pitch: state.pitch,
      quality: state.quality,
      detail: state.detail,
      dpr
    }, body);
  } else {
    drawFallback(ctx, width, height, time);
  }

  if (time - state.lastReceiptAt > 900) {
    state.lastReceiptAt = time;
    publishReceipt();
  }

  if (shouldContinue(time)) {
    state.raf = requestAnimationFrame(drawFrame);
  }
}

function requestDraw(reason = "manual") {
  if (state.stopped || state.hidden || !state.ctx) return;

  publishReceipt({ requestedDraw: reason });

  if (!state.raf) {
    state.raf = requestAnimationFrame(drawFrame);
  }
}

function selectBody(key) {
  if (!BODIES[key]) return;

  state.body = key;
  state.yaw = 0.18;
  state.pitch = -0.06;
  state.velocity = 0.004;
  state.settleUntil = performance.now() + 640;

  updateCopy();
  requestDraw("select-body");
}

function cancelRuntime(reason = "cancelled") {
  state.dragging = false;
  state.pointerId = null;

  if (state.raf) {
    cancelAnimationFrame(state.raf);
    state.raf = 0;
  }

  publishReceipt({ runtimeCancelled: reason });
}

function shutdownRuntime(reason = "shutdown") {
  state.stopped = true;
  cancelRuntime(reason);

  if (state.resizeObserver) {
    state.resizeObserver.disconnect();
    state.resizeObserver = null;
  }

  window.clearTimeout(state.resizeTimer);
  window.removeEventListener("resize", scheduleResize);
  window.removeEventListener("orientationchange", scheduleResize);

  publishReceipt({ shutdown: reason });
}

function bindControls() {
  document.querySelectorAll("[data-body]").forEach((button) => {
    button.addEventListener("click", () => selectBody(button.dataset.body), { passive: true });
  });

  const auto = document.querySelector("[data-control='auto']");
  if (auto) {
    auto.addEventListener("click", () => {
      state.auto = !state.auto;
      auto.classList.toggle("active", state.auto);
      state.settleUntil = performance.now() + 300;
      requestDraw("toggle-auto");
    });
  }

  const detail = document.querySelector("[data-control='detail']");
  if (detail) {
    detail.addEventListener("click", () => {
      state.detail = state.detail === "stable" ? "high" : "stable";
      detail.textContent = `Detail: ${state.detail}`;
      state.settleUntil = performance.now() + 720;
      requestDraw("toggle-detail");
    });
  }

  const glide = document.querySelector("[data-control='glide']");
  if (glide) {
    glide.addEventListener("click", () => {
      state.glide = state.glide === "soft" ? "firm" : "soft";
      glide.textContent = `Glide: ${state.glide}`;
      state.settleUntil = performance.now() + 260;
      requestDraw("toggle-glide");
    });
  }

  const reset = document.querySelector("[data-control='reset']");
  if (reset) {
    reset.addEventListener("click", () => {
      state.yaw = 0.18;
      state.pitch = -0.06;
      state.velocity = 0.004;
      state.auto = true;
      state.settleUntil = performance.now() + 720;
      auto?.classList.add("active");
      requestDraw("reset");
    });
  }

  const canvas = state.canvas;
  if (!canvas) return;

  canvas.style.touchAction = "pan-y";
  canvas.style.userSelect = "none";

  canvas.addEventListener("pointerdown", (event) => {
    if (event.button !== undefined && event.button !== 0) return;

    state.dragging = true;
    state.auto = false;
    state.pointerId = event.pointerId;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.velocity = 0;
    state.quality = "motion";
    canvas.setPointerCapture?.(event.pointerId);

    const now = performance.now();
    if (now - state.lastTap < 320) {
      state.yaw = 0.18;
      state.pitch = -0.06;
      state.velocity = 0.004;
      state.settleUntil = performance.now() + 720;
    }
    state.lastTap = now;

    requestDraw("pointerdown");
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!state.dragging || event.pointerId !== state.pointerId) return;

    const dx = event.clientX - state.lastX;
    const dy = event.clientY - state.lastY;

    state.yaw += dx * 0.006;
    state.pitch = clamp(state.pitch + dy * 0.0025, -0.34, 0.34);
    state.velocity = clamp(dx * 0.00018, -0.045, 0.045);

    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.quality = "motion";

    requestDraw("pointermove");
  });

  canvas.addEventListener("pointerup", (event) => {
    if (event.pointerId !== state.pointerId) return;

    state.dragging = false;
    state.pointerId = null;
    state.settleUntil = performance.now() + 640;
    canvas.releasePointerCapture?.(event.pointerId);

    requestDraw("pointerup");
  });

  canvas.addEventListener("pointercancel", (event) => {
    if (event.pointerId !== state.pointerId) return;

    state.dragging = false;
    state.pointerId = null;
    state.settleUntil = performance.now() + 360;

    requestDraw("pointercancel");
  });

  canvas.addEventListener("lostpointercapture", () => {
    state.dragging = false;
    state.pointerId = null;
    state.settleUntil = performance.now() + 360;
    requestDraw("lostpointercapture");
  });
}

function bindNavigationRelease() {
  document.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", () => {
      cancelRuntime("route-click");
    }, { capture: true });
  });

  window.addEventListener("pagehide", () => shutdownRuntime("pagehide"), { once: true });
  window.addEventListener("beforeunload", () => shutdownRuntime("beforeunload"), { once: true });

  document.addEventListener("visibilitychange", () => {
    state.hidden = document.visibilityState === "hidden";

    if (state.hidden) {
      cancelRuntime("visibility-hidden");
      return;
    }

    if (!state.stopped) {
      state.lastFrameAt = 0;
      measureCanvas();
      requestDraw("visibility-visible");
    }
  });
}

async function bootRenderer() {
  try {
    const mod = await import(MATERIAL_SRC);

    if (!mod?.createCinematicPlanetMaterialRenderer) {
      throw new Error("createCinematicPlanetMaterialRenderer export missing.");
    }

    state.renderer = mod.createCinematicPlanetMaterialRenderer({
      mobile: window.matchMedia?.("(max-width: 760px)")?.matches === true,
      dpr: Math.min(window.devicePixelRatio || 1, 1.75),
      containedRuntime: true
    });

    markDocument({
      materialRenderer: state.renderer.version,
      hydrationRenderer: state.renderer.hydrationVersion
    });

    publishReceipt({ materialRendererBooted: true });
  } catch (error) {
    state.materialError = error?.message || "material renderer import failed";
    state.renderer = null;

    markDocument({
      materialRenderer: "fallback",
      materialError: state.materialError
    });

    publishReceipt({ materialRendererBooted: false });
  }
}

async function init() {
  state.canvas = resolveCanvas();

  if (!state.canvas) {
    markDocument({ rendered: "false", error: "No satellite globe canvas found" });

    window.DGBShowroomGlobe = Object.freeze({
      status() {
        return Object.freeze({
          contract: CONTRACT,
          previousContract: PREVIOUS_CONTRACT,
          route: "/showroom/globe/",
          rendered: false,
          error: "No satellite globe canvas found"
        });
      }
    });

    return;
  }

  state.ctx = state.canvas.getContext("2d", {
    alpha: false,
    desynchronized: true
  });

  markDocument();
  updateCopy();
  measureCanvas();
  installResizeContainment();
  bindControls();
  bindNavigationRelease();

  window.DGBShowroomGlobe = Object.freeze({
    status() {
      return Object.freeze({
        contract: CONTRACT,
        previousContract: PREVIOUS_CONTRACT,
        route: "/showroom/globe/",
        selectedBody: state.body,
        canvasFound: Boolean(state.canvas),
        contextFound: Boolean(state.ctx),
        materialRenderer: state.renderer?.version || "fallback",
        materialError: state.materialError,
        inputScope: "canvas-only",
        rafContainment: "active",
        permanentFullSpeedRaf: false,
        receipt: window.DGBShowroomGlobeReceipt || null
      });
    },
    stop() {
      shutdownRuntime("manual-stop");
    },
    resume() {
      if (!state.stopped) return false;
      state.stopped = false;
      state.hidden = document.visibilityState === "hidden";
      requestDraw("manual-resume");
      return true;
    }
  });

  requestDraw("initial-fallback");

  await bootRenderer();

  requestDraw("material-ready");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}

export default init;

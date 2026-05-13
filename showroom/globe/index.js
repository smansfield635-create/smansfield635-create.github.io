// /showroom/globe/index.js
// TNT FULL-FILE REPLACEMENT
// SHOWROOM_GLOBE_PARENT_SELECTOR_CANVAS_RESTORE_TNT_v3
// Scope: /showroom/globe/ parent selector only.
// Restores the single cinematic globe selector runtime.
// No imports. No WebGL. No child-route mutation. No H-Earth ground engine.

const CONTRACT = "SHOWROOM_GLOBE_PARENT_SELECTOR_CANVAS_RESTORE_TNT_v3";
const TAU = Math.PI * 2;

const BODIES = Object.freeze({
  zionts: {
    key: "zionts",
    label: "ZIONTS",
    subtitle: "Ancient Living World · material-led hydrated runtime",
    copy: "Ancient living reference body. Satellite planetary selector view only.",
    route: "/showroom/globe/earth/",
    seed: 1401,
    water: [24, 86, 118],
    shallow: [64, 142, 154],
    land: [171, 158, 95],
    high: [225, 203, 133],
    dark: [18, 34, 42],
    atmosphere: [110, 178, 205]
  },
  "h-earth": {
    key: "h-earth",
    label: "H-Earth",
    subtitle: "Hybrid Ancient Living World · physical dry material",
    copy: "Hybrid ancient living world. Ground-level Western Golden Shelf work remains on the H-Earth child route only.",
    route: "/showroom/globe/h-earth/",
    seed: 2402,
    water: [37, 112, 118],
    shallow: [75, 151, 134],
    land: [187, 166, 93],
    high: [229, 207, 132],
    dark: [34, 30, 28],
    atmosphere: [116, 195, 171]
  },
  audralia: {
    key: "audralia",
    label: "Audralia",
    subtitle: "Ancient Constructed Living World · physical material",
    copy: "Ancient constructed living world. Audralia is its own constructed body and is not Australia.",
    route: "/showroom/globe/audralia/",
    seed: 3403,
    water: [42, 62, 109],
    shallow: [86, 86, 136],
    land: [174, 105, 132],
    high: [224, 164, 179],
    dark: [30, 23, 34],
    atmosphere: [136, 106, 205]
  }
});

const state = {
  body: "zionts",
  canvas: null,
  ctx: null,
  raf: 0,
  startedAt: performance.now(),
  yaw: 0.18,
  pitch: -0.06,
  velocity: 0.004,
  dragging: false,
  lastX: 0,
  lastY: 0,
  auto: true,
  detail: "stable",
  glide: "soft",
  lastTap: 0
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

function seed(index, salt = 0) {
  return ((Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453123) % 1 + 1) % 1;
}

function mix(a, b, t) {
  return [
    lerp(a[0], b[0], t),
    lerp(a[1], b[1], t),
    lerp(a[2], b[2], t)
  ];
}

function rgba(c, a = 1) {
  return `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${a})`;
}

function markDocument() {
  const markers = {
    page: "showroom-globe-original-selector-restored",
    route: "/showroom/globe/",
    contract: CONTRACT,
    jurisdiction: "satellite-selector-only",
    groundLevelEngine: "false",
    selectedBody: state.body,
    renderedBy: "parent-selector-canvas-runtime"
  };

  Object.entries(markers).forEach(([key, value]) => {
    document.documentElement.dataset[key] = String(value);
    if (document.body) document.body.dataset[key] = String(value);
  });
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
}

function resolveCanvas() {
  return (
    document.querySelector("[data-globe-canvas]") ||
    document.querySelector("canvas[aria-label*='globe' i]") ||
    document.querySelector(".globe-stage canvas") ||
    document.querySelector("canvas")
  );
}

function resizeCanvas() {
  const canvas = state.canvas;
  const rect = canvas.getBoundingClientRect();
  const parent = canvas.parentElement?.getBoundingClientRect?.();

  const cssWidth = rect.width || parent?.width || 640;
  const cssHeight = rect.height || parent?.height || Math.max(520, cssWidth * 0.92);
  const dpr = Math.min(window.devicePixelRatio || 1, 1.85);

  const width = Math.max(640, Math.floor(cssWidth * dpr));
  const height = Math.max(560, Math.floor(cssHeight * dpr));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  return { width, height, dpr };
}

function drawBackground(ctx, width, height, time) {
  const bg = ctx.createRadialGradient(width * 0.5, height * 0.38, 0, width * 0.5, height * 0.38, width * 0.72);
  bg.addColorStop(0, "rgba(34,72,105,0.36)");
  bg.addColorStop(0.44, "rgba(7,22,42,0.86)");
  bg.addColorStop(1, "rgba(1,5,14,1)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 115; i += 1) {
    const x = seed(i, 10) * width;
    const y = seed(i, 11) * height;
    const r = Math.max(0.5, width * (0.00042 + seed(i, 12) * 0.0012));
    const pulse = 0.28 + 0.72 * Math.max(0, Math.sin(time * 0.65 + i * 0.37));

    ctx.fillStyle = `rgba(238,244,255,${0.045 + pulse * 0.18})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
  }
}

function drawPlanet(ctx, width, height, time) {
  const body = BODIES[state.body];

  const cx = width * 0.5;
  const cy = height * 0.47;
  const radius = Math.min(width, height) * 0.305;
  const yaw = state.yaw + time * 0.016;
  const pitch = state.pitch;

  const outer = ctx.createRadialGradient(cx, cy, radius * 0.70, cx, cy, radius * 1.34);
  outer.addColorStop(0, "rgba(0,0,0,0)");
  outer.addColorStop(0.62, rgba(body.atmosphere, 0.11));
  outer.addColorStop(0.82, rgba(body.atmosphere, 0.30));
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
  ocean.addColorStop(0, rgba(mix(body.shallow, [255, 255, 255], 0.10), 1));
  ocean.addColorStop(0.45, rgba(body.water, 1));
  ocean.addColorStop(1, rgba(mix(body.dark, body.water, 0.30), 1));
  ctx.fillStyle = ocean;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  const landCount = state.detail === "high" ? 34 : 24;

  for (let i = 0; i < landCount; i += 1) {
    const local = body.seed + i * 19;
    const a = yaw + i * 0.63 + seed(local, 2) * 0.92;
    const orbit = 0.15 + seed(local, 3) * 0.78;

    const x = cx + Math.sin(a) * radius * orbit;
    const y = cy + Math.cos(a * 0.74 + pitch) * radius * (0.12 + seed(local, 4) * 0.66);

    const nx = (x - cx) / radius;
    const ny = (y - cy) / radius;
    const edge = Math.hypot(nx, ny);
    if (edge > 1.04) continue;

    const rx = radius * (0.050 + seed(local, 5) * 0.175);
    const ry = radius * (0.024 + seed(local, 6) * 0.090);
    const rot = a * 0.42 + seed(local, 7);

    const alpha = clamp(0.82 - Math.max(0, edge - 0.54) * 1.35, 0.10, 0.82);

    const land = ctx.createRadialGradient(x - rx * 0.18, y - ry * 0.28, 0, x, y, Math.max(rx, ry));
    land.addColorStop(0, rgba(body.high, alpha * 0.68));
    land.addColorStop(0.52, rgba(body.land, alpha));
    land.addColorStop(1, rgba(mix(body.land, body.dark, 0.42), alpha * 0.58));

    ctx.fillStyle = land;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, rot, 0, TAU);
    ctx.fill();

    ctx.strokeStyle = rgba(mix(body.dark, body.land, 0.24), alpha * 0.22);
    ctx.lineWidth = Math.max(0.8, radius * 0.0036);
    ctx.beginPath();
    ctx.ellipse(x, y, rx * 0.72, ry * 0.52, rot + 0.35, 0, TAU);
    ctx.stroke();
  }

  for (let i = 0; i < 15; i += 1) {
    const local = body.seed + 900 + i * 31;
    const a = yaw * 0.9 + i * 0.78;
    const x = cx + Math.sin(a) * radius * (0.20 + seed(local, 1) * 0.72);
    const y = cy + Math.cos(a * 0.88) * radius * (0.10 + seed(local, 2) * 0.58);
    const rx = radius * (0.08 + seed(local, 3) * 0.20);
    const ry = radius * (0.012 + seed(local, 4) * 0.034);

    ctx.fillStyle = "rgba(238,244,255,0.075)";
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, a * 0.21, 0, TAU);
    ctx.fill();
  }

  const highlight = ctx.createRadialGradient(cx - radius * 0.30, cy - radius * 0.34, 0, cx - radius * 0.18, cy - radius * 0.22, radius * 1.18);
  highlight.addColorStop(0, "rgba(255,255,255,0.18)");
  highlight.addColorStop(0.32, "rgba(255,255,255,0.06)");
  highlight.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = highlight;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  const shadow = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
  shadow.addColorStop(0, "rgba(0,0,0,0.18)");
  shadow.addColorStop(0.38, "rgba(0,0,0,0)");
  shadow.addColorStop(1, "rgba(0,0,0,0.40)");
  ctx.fillStyle = shadow;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  ctx.restore();

  ctx.strokeStyle = rgba(body.atmosphere, 0.44);
  ctx.lineWidth = Math.max(1, width * 0.0015);
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.stroke();

  const innerGlow = ctx.createRadialGradient(cx, cy, radius * 0.78, cx, cy, radius * 1.03);
  innerGlow.addColorStop(0, "rgba(0,0,0,0)");
  innerGlow.addColorStop(0.78, "rgba(255,255,255,0)");
  innerGlow.addColorStop(1, rgba(body.atmosphere, 0.18));
  ctx.fillStyle = innerGlow;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.02, 0, TAU);
  ctx.fill();
}

function drawFrame(time = performance.now()) {
  if (!state.ctx || !state.canvas) return;

  const { width, height } = resizeCanvas();
  const t = (time - state.startedAt) / 1000;

  if (state.auto && !state.dragging) {
    state.yaw += state.velocity;
  }

  state.velocity *= state.glide === "soft" ? 0.985 : 0.94;

  if (state.auto && Math.abs(state.velocity) < 0.002) {
    state.velocity += 0.00005;
  }

  state.ctx.clearRect(0, 0, width, height);
  drawBackground(state.ctx, width, height, t);
  drawPlanet(state.ctx, width, height, t);

  window.DGBShowroomGlobeReceipt = Object.freeze({
    contract: CONTRACT,
    route: "/showroom/globe/",
    selectedBody: state.body,
    restoredOriginalDesign: true,
    groundLevelEngine: false,
    rendered: true,
    canvasWidth: width,
    canvasHeight: height
  });

  state.raf = requestAnimationFrame(drawFrame);
}

function selectBody(key) {
  if (!BODIES[key]) return;

  state.body = key;
  state.yaw = 0.18;
  state.pitch = -0.06;
  state.velocity = 0.004;

  updateCopy();
}

function bindControls() {
  document.querySelectorAll("[data-body]").forEach((button) => {
    button.addEventListener("click", () => selectBody(button.dataset.body));
  });

  const auto = document.querySelector("[data-control='auto']");
  if (auto) {
    auto.addEventListener("click", () => {
      state.auto = !state.auto;
      auto.classList.toggle("active", state.auto);
    });
  }

  const detail = document.querySelector("[data-control='detail']");
  if (detail) {
    detail.addEventListener("click", () => {
      state.detail = state.detail === "stable" ? "high" : "stable";
      detail.textContent = `Detail: ${state.detail}`;
    });
  }

  const glide = document.querySelector("[data-control='glide']");
  if (glide) {
    glide.addEventListener("click", () => {
      state.glide = state.glide === "soft" ? "firm" : "soft";
      glide.textContent = `Glide: ${state.glide}`;
    });
  }

  const reset = document.querySelector("[data-control='reset']");
  if (reset) {
    reset.addEventListener("click", () => {
      state.yaw = 0.18;
      state.pitch = -0.06;
      state.velocity = 0.004;
      state.auto = true;
      auto?.classList.add("active");
    });
  }

  const canvas = state.canvas;
  if (!canvas) return;

  canvas.addEventListener("pointerdown", (event) => {
    state.dragging = true;
    state.auto = false;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    canvas.setPointerCapture?.(event.pointerId);

    const now = performance.now();
    if (now - state.lastTap < 320) {
      state.yaw = 0.18;
      state.pitch = -0.06;
      state.velocity = 0.004;
    }
    state.lastTap = now;
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!state.dragging) return;

    const dx = event.clientX - state.lastX;
    const dy = event.clientY - state.lastY;

    state.yaw += dx * 0.006;
    state.pitch = clamp(state.pitch + dy * 0.0025, -0.34, 0.34);
    state.velocity = dx * 0.00018;

    state.lastX = event.clientX;
    state.lastY = event.clientY;
  });

  canvas.addEventListener("pointerup", (event) => {
    state.dragging = false;
    canvas.releasePointerCapture?.(event.pointerId);
  });

  canvas.addEventListener("pointercancel", () => {
    state.dragging = false;
  });
}

function init() {
  state.canvas = resolveCanvas();

  if (!state.canvas) {
    markDocument();
    window.DGBShowroomGlobe = Object.freeze({
      status() {
        return Object.freeze({
          contract: CONTRACT,
          route: "/showroom/globe/",
          rendered: false,
          error: "No globe canvas found",
          groundLevelEngine: false
        });
      }
    });
    return;
  }

  state.ctx = state.canvas.getContext("2d", { alpha: false });

  markDocument();
  updateCopy();
  bindControls();

  window.DGBShowroomGlobe = Object.freeze({
    status() {
      return Object.freeze({
        contract: CONTRACT,
        route: "/showroom/globe/",
        selectedBody: state.body,
        groundLevelEngine: false,
        restoredOriginalDesign: true,
        canvasFound: Boolean(state.canvas),
        contextFound: Boolean(state.ctx),
        receipt: window.DGBShowroomGlobeReceipt || null
      });
    }
  });

  if (state.ctx) {
    cancelAnimationFrame(state.raf);
    state.raf = requestAnimationFrame(drawFrame);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}

export default init;

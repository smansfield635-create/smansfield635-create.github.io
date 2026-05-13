// /showroom/globe/index.js
// TNT FULL-FILE REPLACEMENT
// SHOWROOM_GLOBE_ORIGINAL_SELECTOR_RESTORE_TNT_v2
// Restores original Showroom Globe selector.
// Parent route only. No H-Earth ground engine. No child route mutation.

const CONTRACT = "SHOWROOM_GLOBE_ORIGINAL_SELECTOR_RESTORE_TNT_v2";
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
    shallow: [57, 132, 143],
    land: [171, 159, 96],
    high: [221, 201, 135],
    dark: [20, 36, 42],
    atmosphere: [107, 170, 200]
  },
  "h-earth": {
    key: "h-earth",
    label: "H-Earth",
    subtitle: "Hybrid Ancient Living World · physical dry material",
    copy: "Hybrid ancient living world. Ground-level Western Golden Shelf work remains on the child route only.",
    route: "/showroom/globe/h-earth/",
    seed: 2402,
    water: [38, 112, 118],
    shallow: [71, 139, 127],
    land: [184, 164, 91],
    high: [229, 207, 132],
    dark: [36, 32, 28],
    atmosphere: [114, 188, 168]
  },
  audralia: {
    key: "audralia",
    label: "Audralia",
    subtitle: "Ancient Constructed Living World · physical material",
    copy: "Ancient constructed living world. Audralia is its own constructed body and is not Australia.",
    route: "/showroom/globe/audralia/",
    seed: 3403,
    water: [42, 62, 109],
    shallow: [83, 84, 132],
    land: [171, 105, 132],
    high: [221, 161, 176],
    dark: [30, 23, 34],
    atmosphere: [132, 103, 199]
  }
});

const state = {
  body: "zionts",
  canvas: null,
  ctx: null,
  raf: 0,
  startedAt: performance.now(),
  yaw: 0.15,
  pitch: -0.08,
  velocity: 0.0035,
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

function rgb(c, a = 1) {
  return `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${a})`;
}

function mix(a, b, t) {
  return [
    lerp(a[0], b[0], t),
    lerp(a[1], b[1], t),
    lerp(a[2], b[2], t)
  ];
}

function markDocument() {
  const markers = {
    page: "showroom-globe-original-selector-restored",
    route: "/showroom/globe/",
    contract: CONTRACT,
    jurisdiction: "satellite-selector-only",
    groundLevelEngine: "false",
    selectedBody: state.body,
    restoredOriginalDesign: "true"
  };

  Object.entries(markers).forEach(([key, value]) => {
    document.documentElement.dataset[key] = String(value);
    document.body.dataset[key] = String(value);
  });
}

function updateCopy() {
  const body = BODIES[state.body];

  document.querySelector("[data-body-title]").textContent = body.label;
  document.querySelector("[data-body-subtitle]").textContent = body.subtitle;
  document.querySelector("[data-body-card-title]").textContent = body.label;
  document.querySelector("[data-body-card-copy]").textContent = body.copy;

  const open = document.querySelector("[data-open-body]");
  open.href = body.route;
  open.textContent = `Open ${body.label}`;

  document.querySelectorAll("[data-body]").forEach((button) => {
    button.setAttribute("aria-selected", button.dataset.body === state.body ? "true" : "false");
  });

  markDocument();
}

function resizeCanvas() {
  const rect = state.canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 1.85);
  const width = Math.max(720, Math.floor((rect.width || 900) * dpr));
  const height = Math.max(640, Math.floor((rect.height || 720) * dpr));

  if (state.canvas.width !== width || state.canvas.height !== height) {
    state.canvas.width = width;
    state.canvas.height = height;
  }

  return { width, height, dpr };
}

function drawStars(ctx, width, height, time) {
  ctx.save();

  for (let i = 0; i < 95; i += 1) {
    const x = seed(i, 10) * width;
    const y = seed(i, 11) * height;
    const r = Math.max(0.55, width * (0.00045 + seed(i, 12) * 0.0012));
    const pulse = 0.32 + 0.68 * Math.max(0, Math.sin(time * 0.7 + i * 0.37));
    ctx.fillStyle = `rgba(238,244,255,${0.06 + pulse * 0.20})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
  }

  ctx.restore();
}

function drawBackground(ctx, width, height, time) {
  const bg = ctx.createRadialGradient(width * 0.50, height * 0.42, 0, width * 0.50, height * 0.42, width * 0.72);
  bg.addColorStop(0, "rgba(35,72,104,0.32)");
  bg.addColorStop(0.42, "rgba(8,22,42,0.82)");
  bg.addColorStop(1, "rgba(1,5,14,1)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  drawStars(ctx, width, height, time);
}

function drawPlanet(ctx, width, height, time) {
  const body = BODIES[state.body];
  const cx = width * 0.50;
  const cy = height * 0.47;
  const radius = Math.min(width, height) * 0.305;
  const yaw = state.yaw + time * 0.018;
  const pitch = state.pitch;

  const outer = ctx.createRadialGradient(cx, cy, radius * 0.72, cx, cy, radius * 1.32);
  outer.addColorStop(0, "rgba(0,0,0,0)");
  outer.addColorStop(0.60, rgb(body.atmosphere, 0.10));
  outer.addColorStop(0.82, rgb(body.atmosphere, 0.28));
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
  ocean.addColorStop(0, rgb(mix(body.shallow, [255,255,255], 0.08), 1));
  ocean.addColorStop(0.46, rgb(body.water, 1));
  ocean.addColorStop(1, rgb(mix(body.dark, body.water, 0.32), 1));
  ctx.fillStyle = ocean;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  const landCount = state.detail === "high" ? 30 : 22;

  for (let i = 0; i < landCount; i += 1) {
    const local = body.seed + i * 17;
    const a = yaw + i * 0.63 + seed(local, 2) * 0.9;
    const orbit = 0.16 + seed(local, 3) * 0.78;
    const x = cx + Math.sin(a) * radius * orbit;
    const y = cy + Math.cos(a * 0.74 + pitch) * radius * (0.13 + seed(local, 4) * 0.66);
    const rx = radius * (0.050 + seed(local, 5) * 0.165);
    const ry = radius * (0.024 + seed(local, 6) * 0.084);
    const rot = a * 0.42 + seed(local, 7);

    const edge = Math.hypot((x - cx) / radius, (y - cy) / radius);
    const alpha = clamp(0.78 - Math.max(0, edge - 0.56) * 1.2, 0.10, 0.78);

    const landGrad = ctx.createRadialGradient(x - rx * 0.18, y - ry * 0.28, 0, x, y, Math.max(rx, ry));
    landGrad.addColorStop(0, rgb(body.high, alpha * 0.62));
    landGrad.addColorStop(0.52, rgb(body.land, alpha));
    landGrad.addColorStop(1, rgb(mix(body.land, body.dark, 0.38), alpha * 0.55));

    ctx.fillStyle = landGrad;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, rot, 0, TAU);
    ctx.fill();

    if (state.detail === "high" || i % 2 === 0) {
      ctx.strokeStyle = rgb(mix(body.dark, body.land, 0.24), alpha * 0.26);
      ctx.lineWidth = Math.max(0.8, radius * 0.004);
      ctx.beginPath();
      ctx.ellipse(x, y, rx * 0.72, ry * 0.52, rot + 0.35, 0, TAU);
      ctx.stroke();
    }
  }

  for (let i = 0; i < 14; i += 1) {
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

  const highlight = ctx.createRadialGradient(cx - radius * 0.28, cy - radius * 0.34, 0, cx - radius * 0.18, cy - radius * 0.22, radius * 1.18);
  highlight.addColorStop(0, "rgba(255,255,255,0.18)");
  highlight.addColorStop(0.32, "rgba(255,255,255,0.06)");
  highlight.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = highlight;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  const shadow = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
  shadow.addColorStop(0, "rgba(0,0,0,0.18)");
  shadow.addColorStop(0.38, "rgba(0,0,0,0)");
  shadow.addColorStop(1, "rgba(0,0,0,0.38)");
  ctx.fillStyle = shadow;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  ctx.restore();

  ctx.strokeStyle = rgb(body.atmosphere, 0.44);
  ctx.lineWidth = Math.max(1, width * 0.0015);
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.stroke();

  const innerGlow = ctx.createRadialGradient(cx, cy, radius * 0.78, cx, cy, radius * 1.03);
  innerGlow.addColorStop(0, "rgba(0,0,0,0)");
  innerGlow.addColorStop(0.78, "rgba(255,255,255,0)");
  innerGlow.addColorStop(1, rgb(body.atmosphere, 0.18));
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
    rendered: true
  });

  state.raf = requestAnimationFrame(drawFrame);
}

function selectBody(key) {
  if (!BODIES[key]) return;
  state.body = key;
  state.yaw = 0.15;
  state.pitch = -0.08;
  state.velocity = 0.0035;
  updateCopy();
}

function bindControls() {
  document.querySelectorAll("[data-body]").forEach((button) => {
    button.addEventListener("click", () => selectBody(button.dataset.body));
  });

  document.querySelector("[data-control='auto']").addEventListener("click", (event) => {
    state.auto = !state.auto;
    event.currentTarget.classList.toggle("active", state.auto);
  });

  document.querySelector("[data-control='detail']").addEventListener("click", (event) => {
    state.detail = state.detail === "stable" ? "high" : "stable";
    event.currentTarget.textContent = `Detail: ${state.detail}`;
  });

  document.querySelector("[data-control='glide']").addEventListener("click", (event) => {
    state.glide = state.glide === "soft" ? "firm" : "soft";
    event.currentTarget.textContent = `Glide: ${state.glide}`;
  });

  document.querySelector("[data-control='reset']").addEventListener("click", () => {
    state.yaw = 0.15;
    state.pitch = -0.08;
    state.velocity = 0.0035;
    state.auto = true;
    document.querySelector("[data-control='auto']").classList.add("active");
  });

  const canvas = state.canvas;

  canvas.addEventListener("pointerdown", (event) => {
    state.dragging = true;
    state.auto = false;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    canvas.setPointerCapture?.(event.pointerId);

    const now = performance.now();
    if (now - state.lastTap < 320) {
      state.yaw = 0.15;
      state.pitch = -0.08;
      state.velocity = 0.0035;
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
  state.canvas = document.querySelector("[data-globe-canvas]");
  state.ctx = state.canvas?.getContext?.("2d", { alpha:false });

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
        receipt: window.DGBShowroomGlobeReceipt || null
      });
    }
  });

  if (state.ctx) {
    state.raf = requestAnimationFrame(drawFrame);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once:true });
} else {
  init();
}

export default init;

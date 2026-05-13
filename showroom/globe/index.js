// /showroom/globe/index.js
// TNT FULL-FILE REPLACEMENT
// GLOBE_PARENT_SELECTOR_REPAIR_TNT_v1
// Owns: parent Globe selector only.
// Does not own H-Earth ground engine.
// Does not own Hearth.
// Does not mutate child routes.

const CONTRACT = "GLOBE_PARENT_SELECTOR_REPAIR_TNT_v1";
const TAU = Math.PI * 2;

const BODIES = Object.freeze({
  zionts: {
    key: "zionts",
    label: "ZIONTS",
    route: "/showroom/globe/earth/",
    copy: "Ancient living reference body. Satellite planetary selector view only.",
    ocean: [29, 90, 122],
    land: [157, 147, 88],
    atmosphere: [126, 178, 204],
    seed: 101
  },
  "h-earth": {
    key: "h-earth",
    label: "H-Earth",
    route: "/showroom/globe/h-earth/",
    copy: "Hybrid ancient living world. Ground-level Western Golden Shelf work lives only on this child route.",
    ocean: [38, 118, 122],
    land: [184, 161, 88],
    atmosphere: [118, 191, 171],
    seed: 202
  },
  audralia: {
    key: "audralia",
    label: "Audralia",
    route: "/showroom/globe/audralia/",
    copy: "Constructed ancient living world. Audralia is not Australia.",
    ocean: [54, 75, 121],
    land: [169, 106, 131],
    atmosphere: [155, 128, 210],
    seed: 303
  }
});

const state = {
  body: "zionts",
  canvas: null,
  ctx: null,
  raf: 0,
  startedAt: performance.now()
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function seed(index, salt = 0) {
  return ((Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453123) % 1 + 1) % 1;
}

function rgb(values, alpha = 1) {
  return `rgba(${values[0]},${values[1]},${values[2]},${alpha})`;
}

function markDocument() {
  const markers = {
    page: "globe-parent-selector",
    route: "/showroom/globe/",
    contract: CONTRACT,
    jurisdiction: "parent-selector-only",
    groundEngineAuthorized: "false",
    selectedBody: state.body,
    childGroundRoutes: "h-earth-only",
    hearthOverwriteAuthorized: "false"
  };

  Object.entries(markers).forEach(([key, value]) => {
    document.documentElement.dataset[key] = String(value);
    document.body.dataset[key] = String(value);
  });
}

function updateCopy() {
  const body = BODIES[state.body];

  document.querySelector("[data-selected-title]").textContent = body.label;
  document.querySelector("[data-selected-heading]").textContent = body.label;
  document.querySelector("[data-selected-copy]").textContent = body.copy;

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

function resizeCanvas() {
  const box = state.canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  const width = Math.max(640, Math.floor((box.width || 900) * dpr));
  const height = Math.max(520, Math.floor((box.height || 680) * dpr));

  if (state.canvas.width !== width || state.canvas.height !== height) {
    state.canvas.width = width;
    state.canvas.height = height;
  }

  return { width, height, dpr };
}

function drawStars(ctx, width, height, time) {
  ctx.save();

  for (let i = 0; i < 80; i += 1) {
    const x = seed(i, 1) * width;
    const y = seed(i, 2) * height;
    const r = Math.max(0.6, width * (0.0007 + seed(i, 3) * 0.0014));
    const pulse = 0.35 + 0.65 * Math.max(0, Math.sin(time * 0.8 + i));
    ctx.fillStyle = `rgba(238,244,255,${0.08 + pulse * 0.22})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
  }

  ctx.restore();
}

function drawGlobe(ctx, width, height, time) {
  const body = BODIES[state.body];
  const cx = width * 0.50;
  const cy = height * 0.48;
  const radius = Math.min(width, height) * 0.315;
  const spin = time * 0.08 + body.seed * 0.01;

  const atmosphere = ctx.createRadialGradient(cx, cy, radius * 0.75, cx, cy, radius * 1.28);
  atmosphere.addColorStop(0, "rgba(0,0,0,0)");
  atmosphere.addColorStop(0.68, rgb(body.atmosphere, 0.18));
  atmosphere.addColorStop(0.90, rgb(body.atmosphere, 0.34));
  atmosphere.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = atmosphere;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.28, 0, TAU);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.clip();

  const ocean = ctx.createRadialGradient(cx - radius * 0.28, cy - radius * 0.26, radius * 0.12, cx, cy, radius * 1.08);
  ocean.addColorStop(0, rgb(body.ocean.map((v) => Math.min(255, v + 54)), 1));
  ocean.addColorStop(0.48, rgb(body.ocean, 1));
  ocean.addColorStop(1, rgb(body.ocean.map((v) => Math.max(0, v - 36)), 1));
  ctx.fillStyle = ocean;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  for (let i = 0; i < 18; i += 1) {
    const a = spin + i * 0.72;
    const x = cx + Math.sin(a) * radius * (0.18 + seed(i, body.seed) * 0.70);
    const y = cy + Math.cos(a * 0.73) * radius * (0.12 + seed(i, body.seed + 1) * 0.62);
    const rx = radius * (0.08 + seed(i, body.seed + 2) * 0.22);
    const ry = radius * (0.035 + seed(i, body.seed + 3) * 0.10);
    const rot = a * 0.4;

    ctx.fillStyle = rgb(body.land, 0.70);
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, rot, 0, TAU);
    ctx.fill();

    ctx.fillStyle = "rgba(255,244,203,0.10)";
    ctx.beginPath();
    ctx.ellipse(x - rx * 0.16, y - ry * 0.20, rx * 0.55, ry * 0.35, rot, 0, TAU);
    ctx.fill();
  }

  for (let i = 0; i < 12; i += 1) {
    const a = spin * 0.8 + i * 0.9;
    const x = cx + Math.sin(a) * radius * 0.72;
    const y = cy + Math.cos(a * 0.9) * radius * 0.52;
    const rx = radius * (0.12 + seed(i, body.seed + 8) * 0.20);
    const ry = radius * (0.018 + seed(i, body.seed + 9) * 0.035);

    ctx.fillStyle = "rgba(238,244,255,0.11)";
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, a * 0.23, 0, TAU);
    ctx.fill();
  }

  const shade = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
  shade.addColorStop(0, "rgba(0,0,0,0.28)");
  shade.addColorStop(0.45, "rgba(0,0,0,0)");
  shade.addColorStop(1, "rgba(0,0,0,0.38)");
  ctx.fillStyle = shade;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  ctx.restore();

  ctx.strokeStyle = rgb(body.atmosphere, 0.58);
  ctx.lineWidth = Math.max(1, width * 0.002);
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.stroke();
}

function drawFrame(time = performance.now()) {
  if (!state.ctx || !state.canvas) return;

  const ctx = state.ctx;
  const { width, height } = resizeCanvas();
  const t = (time - state.startedAt) / 1000;

  ctx.clearRect(0, 0, width, height);

  const bg = ctx.createRadialGradient(width * 0.5, height * 0.35, 0, width * 0.5, height * 0.35, width * 0.75);
  bg.addColorStop(0, "rgba(40,78,116,0.38)");
  bg.addColorStop(0.40, "rgba(8,22,42,0.88)");
  bg.addColorStop(1, "rgba(1,5,14,1)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  drawStars(ctx, width, height, t);
  drawGlobe(ctx, width, height, t);

  state.raf = requestAnimationFrame(drawFrame);
}

function init() {
  state.canvas = document.querySelector("[data-globe-selector-canvas]");
  state.ctx = state.canvas?.getContext?.("2d", { alpha: false });

  document.querySelectorAll("[data-body]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!BODIES[button.dataset.body]) return;
      state.body = button.dataset.body;
      updateCopy();
    });
  });

  updateCopy();

  window.DGBGlobeSelector = Object.freeze({
    status() {
      return Object.freeze({
        contract: CONTRACT,
        route: "/showroom/globe/",
        jurisdiction: "parent-selector-only",
        selectedBody: state.body,
        groundEngineAuthorized: false,
        hEarthGroundRoute: "/showroom/globe/h-earth/",
        ziontsRoute: "/showroom/globe/earth/",
        audraliaRoute: "/showroom/globe/audralia/",
        hearthOverwriteAuthorized: false
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

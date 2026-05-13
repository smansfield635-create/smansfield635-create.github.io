// /showroom/globe/index.js
// TNT FULL-FILE REPLACEMENT
// SHOWROOM_GLOBE_SATELLITE_MATERIAL_RECONNECT_TNT_v5
// Parent /showroom/globe/ only.
// Reconnects restored cinematic satellite material renderer.
// No ground view. No Manor. No Western Golden Shelf. No child-route mutation.

const CONTRACT = "SHOWROOM_GLOBE_SATELLITE_MATERIAL_RECONNECT_TNT_v5";
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
  quality: "settled",
  settleUntil: 0,
  lastTap: 0,
  materialError: null
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function seed(index, salt = 0) {
  return ((Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453123) % 1 + 1) % 1;
}

function markDocument(extra = {}) {
  const markers = {
    page: "showroom-globe-satellite-selector",
    route: "/showroom/globe/",
    contract: CONTRACT,
    jurisdiction: "satellite-selector-only",
    groundView: "false",
    groundEngine: "false",
    manorPlacement: "false",
    westernGoldenShelf: "false",
    selectedBody: state.body,
    renderedBy: "cinematic-satellite-material-runtime",
    ...extra
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
    document.querySelector(".globe-stage canvas") ||
    document.querySelector("canvas")
  );
}

function resizeCanvas() {
  const rect = state.canvas.getBoundingClientRect();
  const parent = state.canvas.parentElement?.getBoundingClientRect?.();

  const cssWidth = rect.width || parent?.width || 640;
  const cssHeight = rect.height || parent?.height || Math.max(520, cssWidth * 0.92);
  const dpr = Math.min(window.devicePixelRatio || 1, 1.85);

  const width = Math.max(640, Math.floor(cssWidth * dpr));
  const height = Math.max(560, Math.floor(cssHeight * dpr));

  if (state.canvas.width !== width || state.canvas.height !== height) {
    state.canvas.width = width;
    state.canvas.height = height;
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

function drawEmergencyMaterialFallback(ctx, width, height, time) {
  const body = BODIES[state.body];
  const cx = width * 0.5;
  const cy = height * 0.47;
  const radius = Math.min(width, height) * 0.305;
  const yaw = state.yaw + time * 0.016;

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
    const a = yaw + i * 0.63 + seed(local, 2) * 0.92;
    const orbit = 0.15 + seed(local, 3) * 0.78;

    const x = cx + Math.sin(a) * radius * orbit;
    const y = cy + Math.cos(a * 0.74 + state.pitch) * radius * (0.12 + seed(local, 4) * 0.66);

    const rx = radius * (0.05 + seed(local, 5) * 0.175);
    const ry = radius * (0.024 + seed(local, 6) * 0.09);
    const rot = a * 0.42 + seed(local, 7);

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
}

function drawFrame(time = performance.now()) {
  if (!state.ctx || !state.canvas) return;

  const { width, height, dpr } = resizeCanvas();
  const t = (time - state.startedAt) / 1000;
  const body = BODIES[state.body];

  if (state.auto && !state.dragging) {
    state.yaw += state.velocity;
  }

  state.velocity *= state.glide === "soft" ? 0.985 : 0.94;

  if (state.auto && Math.abs(state.velocity) < 0.002) {
    state.velocity += 0.00005;
  }

  if (state.dragging) {
    state.quality = "motion";
  } else if (performance.now() < state.settleUntil) {
    state.quality = "settling";
  } else {
    state.quality = "settled";
  }

  const ctx = state.ctx;
  ctx.clearRect(0, 0, width, height);
  drawBackground(ctx, width, height, t);

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
    drawEmergencyMaterialFallback(ctx, width, height, t);
  }

  window.DGBShowroomGlobeReceipt = Object.freeze({
    contract: CONTRACT,
    route: "/showroom/globe/",
    selectedBody: state.body,
    quality: state.quality,
    detail: state.detail,
    materialRenderer: state.renderer?.version || "fallback",
    materialError: state.materialError,
    groundView: false,
    groundEngine: false,
    manorPlacement: false,
    westernGoldenShelf: false,
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
  state.settleUntil = performance.now() + 640;

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
      state.settleUntil = performance.now() + 720;
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
      state.settleUntil = performance.now() + 720;
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
      state.settleUntil = performance.now() + 720;
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
    state.settleUntil = performance.now() + 640;
    canvas.releasePointerCapture?.(event.pointerId);
  });

  canvas.addEventListener("pointercancel", () => {
    state.dragging = false;
    state.settleUntil = performance.now() + 640;
  });
}

async function bootRenderer() {
  try {
    const mod = await import("/assets/showroom.globe.cinematic.material.js?v=SHOWROOM_GLOBE_SATELLITE_CINEMATIC_MATERIAL_RECONNECT_TNT_v5");

    if (!mod?.createCinematicPlanetMaterialRenderer) {
      throw new Error("createCinematicPlanetMaterialRenderer export missing.");
    }

    state.renderer = mod.createCinematicPlanetMaterialRenderer({
      mobile: window.matchMedia?.("(max-width: 760px)")?.matches === true,
      dpr: Math.min(window.devicePixelRatio || 1, 1.85)
    });

    markDocument({
      materialRenderer: state.renderer.version,
      hydrationRenderer: state.renderer.hydrationVersion
    });
  } catch (error) {
    state.materialError = error?.message || "material renderer import failed";
    state.renderer = null;
    markDocument({
      materialRenderer: "fallback",
      materialError: state.materialError
    });
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
          route: "/showroom/globe/",
          rendered: false,
          error: "No satellite globe canvas found",
          groundView: false,
          groundEngine: false
        });
      }
    });

    return;
  }

  state.ctx = state.canvas.getContext("2d", { alpha: false });

  markDocument();
  updateCopy();
  bindControls();

  await bootRenderer();

  window.DGBShowroomGlobe = Object.freeze({
    status() {
      return Object.freeze({
        contract: CONTRACT,
        route: "/showroom/globe/",
        selectedBody: state.body,
        groundView: false,
        groundEngine: false,
        manorPlacement: false,
        westernGoldenShelf: false,
        canvasFound: Boolean(state.canvas),
        contextFound: Boolean(state.ctx),
        materialRenderer: state.renderer?.version || "fallback",
        materialError: state.materialError,
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

// /showroom/globe/index.js
// TNT FULL-FILE REPLACEMENT
// SHOWROOM_GLOBE_FIBONACCI_RUNTIME_CONTROLLER_TNT_v1
// Role: public Globe Showcase controller.
// Runtime follows Fibonacci pacing.
// Material renderer uses adaptive Fibonacci quality.

import {
  PLANET_MATERIAL_VERSION,
  createCinematicPlanetMaterialRenderer
} from "/assets/showroom.globe.cinematic.material.js?v=fibonacci-runtime-v1";

import {
  GLOBE_RUNTIME_VERSION,
  createGlobeRuntime
} from "/assets/showroom.globe.runtime.js?v=fibonacci-runtime-v1";

import {
  GLOBE_CONTROLS_VERSION,
  createGlobeControls
} from "/assets/showroom.globe.controls.js?v=runtime-glide-control-v1";

const MODEL_NAME = "showroom-globe-fibonacci-runtime-controller-v1";

const REDUCED_MOTION = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
const MOBILE = window.matchMedia?.("(max-width: 760px)")?.matches === true;
const DPR = Math.min(window.devicePixelRatio || 1, MOBILE ? 1.35 : 1.75);

const LAT_BANDS = 16;
const LON_SECTORS = 16;
const CELL_COUNT = LAT_BANDS * LON_SECTORS;
const CHILD_HEX_ROWS = 16;
const CHILD_HEX_COLS = 16;
const CHILD_HEX_COUNT = CHILD_HEX_ROWS * CHILD_HEX_COLS;
const TOTAL_CHILD_FIELDS = CELL_COUNT * CHILD_HEX_COUNT;

const WORLDS = Object.freeze({
  earth: {
    key: "earth",
    title: "Earth",
    subtitle: "Reference Body",
    route: "/showroom/globe/earth/",
    seed: 310,
    stoneDeep: [24, 25, 27],
    stoneLow: [68, 61, 52],
    stoneMid: [125, 109, 82],
    stoneHigh: [190, 164, 114],
    sediment: [168, 143, 100],
    exposed: [226, 188, 122],
    ridge: [238, 218, 174],
    shadow: [13, 15, 18],
    scar: [210, 214, 196],
    atmosphere: [145, 195, 255],
    glow: "rgba(145,195,255,0.24)"
  },
  hEarth: {
    key: "hEarth",
    title: "H-Earth",
    subtitle: "Hybrid Earth",
    route: "/showroom/globe/h-earth/",
    seed: 710,
    stoneDeep: [18, 25, 25],
    stoneLow: [56, 68, 56],
    stoneMid: [112, 118, 86],
    stoneHigh: [186, 160, 103],
    sediment: [150, 138, 94],
    exposed: [220, 178, 106],
    ridge: [236, 219, 162],
    shadow: [10, 15, 17],
    scar: [164, 234, 190],
    atmosphere: [150, 215, 232],
    glow: "rgba(145,215,232,0.24)"
  },
  audralia: {
    key: "audralia",
    title: "Audralia",
    subtitle: "Constructed World",
    route: "/showroom/globe/audralia/",
    seed: 910,
    stoneDeep: [28, 23, 42],
    stoneLow: [72, 58, 72],
    stoneMid: [135, 105, 88],
    stoneHigh: [194, 148, 94],
    sediment: [164, 119, 88],
    exposed: [230, 164, 108],
    ridge: [238, 206, 156],
    shadow: [15, 12, 26],
    scar: [198, 172, 255],
    atmosphere: [194, 178, 255],
    glow: "rgba(194,178,255,0.24)"
  }
});

const renderer = createCinematicPlanetMaterialRenderer({
  mobile: MOBILE,
  dpr: DPR
});

const runtime = createGlobeRuntime({
  mobile: MOBILE,
  reducedMotion: REDUCED_MOTION,
  autoSpin: true,
  detail: "stable",
  glide: "soft",
  yaw: -0.74,
  pitch: -0.20
});

const state = {
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,
  raf: 0,
  active: true,
  visible: true,
  time: 0,
  stars: [],
  worldKey: "hEarth",
  controls: null
};

function $(id) {
  return document.getElementById(id);
}

function positiveHash(seed, a = 0, b = 0) {
  const value = Math.sin(seed * 12.9898 + a * 78.233 + b * 37.719) * 43758.5453123;
  return value - Math.floor(value);
}

function sizeCanvas() {
  const rect = state.canvas.getBoundingClientRect();
  const cssWidth = Math.max(320, Math.round(rect.width));
  const cssHeight = Math.max(480, Math.round(rect.height));

  state.canvas.width = Math.round(cssWidth * DPR);
  state.canvas.height = Math.round(cssHeight * DPR);
  state.canvas.style.width = `${cssWidth}px`;
  state.canvas.style.height = `${cssHeight}px`;

  state.width = state.canvas.width;
  state.height = state.canvas.height;
  state.ctx = state.canvas.getContext("2d", {
    alpha: false,
    desynchronized: true
  });

  createStars(MOBILE ? 54 : 120);
}

function createStars(count) {
  state.stars = Array.from({ length: count }, (_, index) => ({
    x: positiveHash(100, index, 1),
    y: positiveHash(100, index, 2),
    r: 0.45 + positiveHash(100, index, 3) * 1.85,
    a: 0.10 + positiveHash(100, index, 4) * 0.34,
    p: positiveHash(100, index, 5) * Math.PI * 2
  }));
}

function drawStars(ctx, width, height) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  for (const star of state.stars) {
    const pulse = REDUCED_MOTION ? 0.55 : 0.55 + Math.sin(state.time * 0.001 + star.p) * 0.45;
    const alpha = star.a * pulse;
    const x = star.x * width;
    const y = star.y * height;
    const radius = star.r * DPR;

    ctx.fillStyle = `rgba(235,242,255,${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    if (star.r > 1.35) {
      ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.44})`;
      ctx.lineWidth = Math.max(0.6, DPR * 0.55);
      ctx.beginPath();
      ctx.moveTo(x - 3.2 * DPR, y);
      ctx.lineTo(x + 3.2 * DPR, y);
      ctx.moveTo(x, y - 3.2 * DPR);
      ctx.lineTo(x, y + 3.2 * DPR);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawBackground(ctx, width, height) {
  const world = WORLDS[state.worldKey];

  const bg = ctx.createRadialGradient(
    width * 0.5,
    height * 0.42,
    0,
    width * 0.5,
    height * 0.52,
    Math.max(width, height) * 0.82
  );

  bg.addColorStop(0, "#122443");
  bg.addColorStop(0.30, "#081732");
  bg.addColorStop(0.68, "#041021");
  bg.addColorStop(1, "#01040c");

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const halo = ctx.createRadialGradient(
    width * 0.5,
    height * 0.49,
    0,
    width * 0.5,
    height * 0.49,
    width * 0.42
  );

  halo.addColorStop(0, world.glow);
  halo.addColorStop(0.38, "rgba(142,190,255,0.075)");
  halo.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.ellipse(width * 0.5, height * 0.50, width * 0.36, height * 0.33, 0, 0, Math.PI * 2);
  ctx.fill();

  const vignette = ctx.createRadialGradient(
    width * 0.5,
    height * 0.5,
    width * 0.20,
    width * 0.5,
    height * 0.5,
    width * 0.78
  );

  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.50)");

  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  drawStars(ctx, width, height);
}

function drawGlobeShadow(ctx, view) {
  const world = WORLDS[state.worldKey];

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const y = view.cy + view.scale * 1.05;
  const glow = ctx.createRadialGradient(view.cx, y, 0, view.cx, y, view.scale * 0.72);

  glow.addColorStop(0, world.glow);
  glow.addColorStop(0.38, "rgba(80,120,180,0.12)");
  glow.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(view.cx, y, view.scale * 0.64, view.scale * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawOrbitLines(ctx, view) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  ctx.strokeStyle = "rgba(244,191,96,0.050)";
  ctx.lineWidth = Math.max(0.60, DPR * 0.65);
  ctx.beginPath();
  ctx.ellipse(view.cx, view.cy, view.scale * 1.52, view.scale * 0.35, -0.12, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(142,190,255,0.038)";
  ctx.beginPath();
  ctx.ellipse(view.cx, view.cy, view.scale * 1.34, view.scale * 0.53, 0.28, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawWorldTitle(ctx, width, height) {
  const world = WORLDS[state.worldKey];

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "rgba(244,191,96,0.92)";
  ctx.font = `950 ${Math.max(18 * DPR, width * 0.038)}px Inter, system-ui, sans-serif`;
  ctx.fillText(world.title, width * 0.5, height * 0.155);

  ctx.fillStyle = "rgba(186,197,212,0.74)";
  ctx.font = `850 ${Math.max(11 * DPR, width * 0.014)}px Inter, system-ui, sans-serif`;
  ctx.fillText(`${world.subtitle} · Fibonacci runtime`, width * 0.5, height * 0.195);

  ctx.restore();
}

function drawCue(ctx, width, height) {
  const runtimeState = runtime.getState();

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(186,197,212,0.60)";
  ctx.font = `800 ${Math.max(11 * DPR, width * 0.013)}px Inter, system-ui, sans-serif`;
  ctx.fillText(
    `Drag to inspect · ${runtimeState.quality} · ${runtimeState.glide} glide · ${runtimeState.detail} detail`,
    width * 0.5,
    height * 0.90
  );
  ctx.restore();
}

function drawPlanet(ctx, width, height, runtimeView) {
  const scale = Math.min(width * 0.42, height * 0.44);

  const view = {
    cx: width * 0.50,
    cy: height * 0.515,
    scale,
    yaw: runtimeView.yaw,
    pitch: runtimeView.pitch,
    quality: runtimeView.quality,
    detail: runtimeView.detail
  };

  drawGlobeShadow(ctx, view);
  renderer.drawPlanet(ctx, view, WORLDS[state.worldKey]);
  drawOrbitLines(ctx, view);
  drawWorldTitle(ctx, width, height);
  drawCue(ctx, width, height);

  document.documentElement.dataset.globeShowcaseModel = MODEL_NAME;
  document.documentElement.dataset.planetMaterialRenderer = PLANET_MATERIAL_VERSION;
  document.documentElement.dataset.globeRuntime = GLOBE_RUNTIME_VERSION;
  document.documentElement.dataset.globeControls = GLOBE_CONTROLS_VERSION;
  document.documentElement.dataset.selectedWorld = state.worldKey;
  document.documentElement.dataset.publicPortraitBaseline = "fibonacci-runtime-cinematic-material";
  document.documentElement.dataset.runtimeQuality = runtimeView.quality;
  document.documentElement.dataset.runtimeDetail = runtimeView.detail;
  document.documentElement.dataset.runtimeGlide = runtimeView.glide;
  document.documentElement.dataset.fibonacciPacing = "true";
  document.documentElement.dataset.privateEnginesAsleep = "true";
  document.documentElement.dataset.mapExpression = "false";
  document.documentElement.dataset.waterExpression = "false";
  document.documentElement.dataset.landmassExpression = "false";
  document.documentElement.dataset.childTerrainImport = "false";
  document.documentElement.dataset.mountainSystem = "false";
  document.documentElement.dataset.planetShader = "true";
  document.documentElement.dataset.materialRelief = "true";
  document.documentElement.dataset.pseudoNormalLighting = "true";
  document.documentElement.dataset.continuousSurface = "true";
  document.documentElement.dataset.privilegedLongitude = "false";
  document.documentElement.dataset.falsePrimeMeridian = "false";
  document.documentElement.dataset.hemispherePartition = "false";
  document.documentElement.dataset.polygonPatchSurface = "false";
  document.documentElement.dataset.parentCellCount = String(CELL_COUNT);
  document.documentElement.dataset.childFieldsPerParent = String(CHILD_HEX_COUNT);
  document.documentElement.dataset.totalChildFields = String(TOTAL_CHILD_FIELDS);
}

function render(runtimeView = runtime.getState()) {
  if (!state.ctx) return;
  drawBackground(state.ctx, state.width, state.height);
  drawPlanet(state.ctx, state.width, state.height, runtimeView);
}

function frame(now) {
  if (!state.active || !state.visible) {
    state.raf = 0;
    return;
  }

  state.time = now;
  const runtimeView = runtime.update(now);

  if (runtime.shouldRender(now)) {
    render(runtimeView);
  }

  state.raf = window.requestAnimationFrame(frame);
}

function startLoop() {
  if (state.raf) return;
  state.raf = window.requestAnimationFrame(frame);
}

function stopLoop() {
  if (!state.raf) return;
  window.cancelAnimationFrame(state.raf);
  state.raf = 0;
}

function setWorld(worldKey) {
  if (!WORLDS[worldKey]) return;
  state.worldKey = worldKey;
  runtime.reset();
  updateControls();
  render();
  runtime.forceRender();
}

function updateControls() {
  const world = WORLDS[state.worldKey];

  document.querySelectorAll("[data-world]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.world === state.worldKey));
  });

  const link = $("activeWorldLink");
  if (link) {
    link.href = world.route;
    link.textContent = `Open ${world.title}`;
  }
}

function installWorldControls() {
  document.querySelectorAll("[data-world]").forEach((button) => {
    button.addEventListener("click", () => setWorld(button.dataset.world));
  });
}

function installVisibility() {
  document.addEventListener("visibilitychange", () => {
    state.active = document.visibilityState !== "hidden";
    if (state.active) startLoop();
    else stopLoop();
  }, { passive: true });

  if ("IntersectionObserver" in window && state.canvas) {
    const observer = new IntersectionObserver((entries) => {
      state.visible = entries[0]?.isIntersecting !== false;
      if (state.visible) startLoop();
      else stopLoop();
    }, { threshold: 0.05 });

    observer.observe(state.canvas);
  }
}

function installResize() {
  let timer = 0;

  window.addEventListener("resize", () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      sizeCanvas();
      render({ ...runtime.getState(), quality: "motion" });
      runtime.forceRender();
    }, 120);
  }, { passive: true });
}

function installRuntimeControls() {
  const wrap = state.canvas.closest(".globe-wrap");

  state.controls = createGlobeControls({
    mount: wrap,
    runtime,
    onChange() {
      runtime.forceRender();
      render({ ...runtime.getState(), quality: "motion" });
    },
    onReset() {
      runtime.forceRender();
      render({ ...runtime.getState(), quality: "motion" });
    }
  });
}

function boot() {
  state.canvas = $("globeShowcaseCanvas");
  if (!state.canvas) return;

  sizeCanvas();
  runtime.bindCanvas(state.canvas);
  installWorldControls();
  installRuntimeControls();
  installVisibility();
  installResize();
  updateControls();

  render({ ...runtime.getState(), quality: "motion" });
  startLoop();

  window.DGBGlobeShowcase = {
    model: MODEL_NAME,
    planetMaterialRenderer: PLANET_MATERIAL_VERSION,
    globeRuntime: GLOBE_RUNTIME_VERSION,
    globeControls: GLOBE_CONTROLS_VERSION,
    publicPortraitBaseline: "fibonacci-runtime-cinematic-material",
    fibonacciPacing: true,
    privateEnginesAsleep: true,
    generatedImage: false,
    graphicBox: false,
    mapExpression: false,
    waterExpression: false,
    landmassExpression: false,
    childTerrainImport: false,
    mountainSystem: false,
    planetShader: true,
    continuousSurface: true,
    materialRelief: true,
    pseudoNormalLighting: true,
    privilegedLongitude: false,
    falsePrimeMeridian: false,
    hemispherePartition: false,
    polygonPatchSurface: false,
    worlds: Object.keys(WORLDS),
    parentCellCount: CELL_COUNT,
    childFieldsPerParent: CHILD_HEX_COUNT,
    totalChildFields: TOTAL_CHILD_FIELDS,
    setWorld,
    reset: runtime.reset,
    runtime,
    controls: state.controls,
    status() {
      return {
        model: MODEL_NAME,
        planetMaterialRenderer: PLANET_MATERIAL_VERSION,
        globeRuntime: GLOBE_RUNTIME_VERSION,
        globeControls: GLOBE_CONTROLS_VERSION,
        selectedWorld: state.worldKey,
        runtime: runtime.getState(),
        publicPortraitBaseline: "fibonacci-runtime-cinematic-material",
        fibonacciPacing: true,
        privateEnginesAsleep: true,
        generatedImage: false,
        graphicBox: false,
        mapExpression: false,
        waterExpression: false,
        landmassExpression: false,
        childTerrainImport: false,
        mountainSystem: false,
        planetShader: true,
        continuousSurface: true,
        materialRelief: true,
        pseudoNormalLighting: true,
        privilegedLongitude: false,
        falsePrimeMeridian: false,
        hemispherePartition: false,
        polygonPatchSurface: false,
        parentCellCount: CELL_COUNT,
        childFieldsPerParent: CHILD_HEX_COUNT,
        totalChildFields: TOTAL_CHILD_FIELDS
      };
    }
  };
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

export default {
  model: MODEL_NAME,
  planetMaterialRenderer: PLANET_MATERIAL_VERSION,
  globeRuntime: GLOBE_RUNTIME_VERSION,
  globeControls: GLOBE_CONTROLS_VERSION,
  publicPortraitBaseline: "fibonacci-runtime-cinematic-material",
  fibonacciPacing: true,
  privateEnginesAsleep: true,
  generatedImage: false,
  graphicBox: false,
  mapExpression: false,
  waterExpression: false,
  landmassExpression: false,
  childTerrainImport: false,
  mountainSystem: false,
  planetShader: true,
  continuousSurface: true,
  materialRelief: true,
  pseudoNormalLighting: true,
  privilegedLongitude: false,
  falsePrimeMeridian: false,
  hemispherePartition: false,
  polygonPatchSurface: false,
  parentCellCount: CELL_COUNT,
  childFieldsPerParent: CHILD_HEX_COUNT,
  totalChildFields: TOTAL_CHILD_FIELDS
};

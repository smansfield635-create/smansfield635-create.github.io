// /showroom/globe/index.js
// TNT FULL-FILE REPLACEMENT
// SHOWROOM_GLOBE_CINEMATIC_MATERIAL_ASSET_CONTROLLER_TNT_v1
// Role: public Globe Showcase controller.
// Renderer authority moved to /assets/showroom.globe.cinematic.material.js.
// Contract: actual continuous dry planet render; no schoolroom-globe meridian.

import {
  PLANET_MATERIAL_VERSION,
  createCinematicPlanetMaterialRenderer
} from "/assets/showroom.globe.cinematic.material.js?v=cinematic-material-asset-v1";

const MODEL_NAME = "showroom-globe-cinematic-material-asset-controller-v1";

const REDUCED_MOTION = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
const MOBILE = window.matchMedia?.("(max-width: 760px)")?.matches === true;
const DPR = Math.min(window.devicePixelRatio || 1, MOBILE ? 1.35 : 1.75);
const FRAME_MS = MOBILE ? 132 : 96;

const DEFAULT_YAW = -0.74;
const DEFAULT_PITCH = -0.20;
const MIN_PITCH = -1.04;
const MAX_PITCH = 0.74;

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

const state = {
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,
  raf: 0,
  lastFrame: 0,
  visible: true,
  active: true,
  time: 0,
  stars: [],
  worldKey: "hEarth",

  yaw: DEFAULT_YAW,
  pitch: DEFAULT_PITCH,
  targetYaw: DEFAULT_YAW,
  targetPitch: DEFAULT_PITCH,
  velocityYaw: 0,
  velocityPitch: 0,
  interacted: false,

  dragging: false,
  pointerId: null,
  startX: 0,
  startY: 0,
  lastX: 0,
  lastY: 0,
  lastPointerTime: 0,
  tapStartTime: 0,
  lastTapAt: 0
};

function $(id) {
  return document.getElementById(id);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function hash(seed, a = 0, b = 0) {
  return (Math.sin(seed * 12.9898 + a * 78.233 + b * 37.719) * 43758.5453123) % 1;
}

function positiveHash(seed, a = 0, b = 0) {
  const value = hash(seed, a, b);
  return value < 0 ? value + 1 : value;
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
  ctx.fillText(`${world.subtitle} · cinematic material renderer`, width * 0.5, height * 0.195);

  ctx.restore();
}

function drawCue(ctx, width, height) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(186,197,212,0.60)";
  ctx.font = `800 ${Math.max(11 * DPR, width * 0.013)}px Inter, system-ui, sans-serif`;
  ctx.fillText("Drag to inspect · Asset-rendered dry planet · Open private world room", width * 0.5, height * 0.90);
  ctx.restore();
}

function drawPlanet(ctx, width, height) {
  const scale = Math.min(width * 0.42, height * 0.44);

  const view = {
    cx: width * 0.50,
    cy: height * 0.515,
    scale,
    yaw: state.yaw,
    pitch: state.pitch
  };

  drawGlobeShadow(ctx, view);
  renderer.drawPlanet(ctx, view, WORLDS[state.worldKey]);
  drawOrbitLines(ctx, view);
  drawWorldTitle(ctx, width, height);
  drawCue(ctx, width, height);

  document.documentElement.dataset.globeShowcaseModel = MODEL_NAME;
  document.documentElement.dataset.planetMaterialRenderer = PLANET_MATERIAL_VERSION;
  document.documentElement.dataset.selectedWorld = state.worldKey;
  document.documentElement.dataset.publicPortraitBaseline = "cinematic-material-asset-renderer";
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

function render() {
  if (!state.ctx) return;
  drawBackground(state.ctx, state.width, state.height);
  drawPlanet(state.ctx, state.width, state.height);
}

function updateInspectionMotion() {
  if (!state.dragging) {
    if (!state.interacted && !REDUCED_MOTION) {
      state.targetYaw += 0.00068;
    }

    state.targetYaw += state.velocityYaw;
    state.targetPitch = clamp(state.targetPitch + state.velocityPitch, MIN_PITCH, MAX_PITCH);

    state.velocityYaw *= 0.925;
    state.velocityPitch *= 0.905;

    if (Math.abs(state.velocityYaw) < 0.00008) state.velocityYaw = 0;
    if (Math.abs(state.velocityPitch) < 0.00008) state.velocityPitch = 0;
  }

  state.yaw += (state.targetYaw - state.yaw) * 0.22;
  state.pitch += (state.targetPitch - state.pitch) * 0.22;
  state.pitch = clamp(state.pitch, MIN_PITCH, MAX_PITCH);
}

function frame(now) {
  if (!state.active || !state.visible) {
    state.raf = 0;
    return;
  }

  if (!state.lastFrame || now - state.lastFrame >= FRAME_MS) {
    state.lastFrame = now;
    state.time = now;
    updateInspectionMotion();
    render();
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

function resetInspection() {
  state.targetYaw = DEFAULT_YAW;
  state.targetPitch = DEFAULT_PITCH;
  state.velocityYaw = 0;
  state.velocityPitch = 0;
  state.interacted = false;
}

function setWorld(worldKey) {
  if (!WORLDS[worldKey]) return;
  state.worldKey = worldKey;
  resetInspection();
  updateControls();
  render();
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

function installPointerInspection() {
  const canvas = state.canvas;
  if (!canvas) return;

  canvas.style.touchAction = "none";

  canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  canvas.addEventListener("pointerdown", (event) => {
    state.dragging = true;
    state.pointerId = event.pointerId;
    state.startX = event.clientX;
    state.startY = event.clientY;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.lastPointerTime = performance.now();
    state.tapStartTime = performance.now();
    state.velocityYaw = 0;
    state.velocityPitch = 0;
    state.interacted = true;

    canvas.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }, { passive: false });

  canvas.addEventListener("pointermove", (event) => {
    if (!state.dragging || event.pointerId !== state.pointerId) return;

    const now = performance.now();
    const dt = Math.max(12, now - state.lastPointerTime);
    const dx = event.clientX - state.lastX;
    const dy = event.clientY - state.lastY;

    const yawDelta = dx * 0.0085;
    const pitchDelta = dy * 0.0065;

    state.targetYaw += yawDelta;
    state.targetPitch = clamp(state.targetPitch + pitchDelta, MIN_PITCH, MAX_PITCH);

    state.velocityYaw = clamp((yawDelta / dt) * 18, -0.045, 0.045);
    state.velocityPitch = clamp((pitchDelta / dt) * 14, -0.030, 0.030);

    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.lastPointerTime = now;

    event.preventDefault();
  }, { passive: false });

  canvas.addEventListener("pointerup", (event) => {
    if (event.pointerId !== state.pointerId) return;

    const now = performance.now();
    const travel = Math.hypot(event.clientX - state.startX, event.clientY - state.startY);
    const tapDuration = now - state.tapStartTime;
    const isTap = travel < 10 && tapDuration < 260;
    const isDoubleTap = isTap && now - state.lastTapAt < 340;

    if (isDoubleTap) {
      resetInspection();
      state.lastTapAt = 0;
    } else if (isTap) {
      state.lastTapAt = now;
    }

    state.dragging = false;
    state.pointerId = null;
    canvas.releasePointerCapture?.(event.pointerId);
    event.preventDefault();
  }, { passive: false });

  canvas.addEventListener("pointercancel", (event) => {
    state.dragging = false;
    state.pointerId = null;
    canvas.releasePointerCapture?.(event.pointerId);
    event.preventDefault();
  }, { passive: false });

  canvas.addEventListener("keydown", (event) => {
    const step = event.shiftKey ? 0.16 : 0.075;

    if (event.key === "ArrowLeft") {
      state.interacted = true;
      state.targetYaw -= step;
      event.preventDefault();
    } else if (event.key === "ArrowRight") {
      state.interacted = true;
      state.targetYaw += step;
      event.preventDefault();
    } else if (event.key === "ArrowUp") {
      state.interacted = true;
      state.targetPitch = clamp(state.targetPitch + step, MIN_PITCH, MAX_PITCH);
      event.preventDefault();
    } else if (event.key === "ArrowDown") {
      state.interacted = true;
      state.targetPitch = clamp(state.targetPitch - step, MIN_PITCH, MAX_PITCH);
      event.preventDefault();
    } else if (event.key === "Home" || event.key === "0") {
      resetInspection();
      event.preventDefault();
    }
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
      render();
    }, 120);
  }, { passive: true });
}

function boot() {
  state.canvas = $("globeShowcaseCanvas");
  if (!state.canvas) return;

  sizeCanvas();
  installWorldControls();
  installPointerInspection();
  installVisibility();
  installResize();
  updateControls();
  render();
  startLoop();

  window.DGBGlobeShowcase = {
    model: MODEL_NAME,
    planetMaterialRenderer: PLANET_MATERIAL_VERSION,
    publicPortraitBaseline: "cinematic-material-asset-renderer",
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
    reset: resetInspection,
    status() {
      return {
        model: MODEL_NAME,
        planetMaterialRenderer: PLANET_MATERIAL_VERSION,
        selectedWorld: state.worldKey,
        publicPortraitBaseline: "cinematic-material-asset-renderer",
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
        totalChildFields: TOTAL_CHILD_FIELDS,
        yaw: state.yaw,
        pitch: state.pitch
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
  publicPortraitBaseline: "cinematic-material-asset-renderer",
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

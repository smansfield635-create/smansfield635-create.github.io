import {
  PLANET_MATERIAL_VERSION,
  PLANET_HYDRATION_VERSION,
  PLANET_VEGETATION_VERSION,
  createCinematicPlanetMaterialRenderer
} from "/assets/showroom.globe.cinematic.material.js?v=cinematic-material-v14";

import {
  VEGETATION_HABITABILITY_VERSION,
  createVegetationHabitabilityLayer
} from "/assets/showroom.globe.vegetation.js?v=vegetation-habitability-v13";

const FIBONACCI_SEQUENCE = Object.freeze([1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233]);
const RUNTIME_FIELD_SIZE = 256;
const TAU = Math.PI * 2;
const MAX_DPR = 1.25;
const CONTRACT = "SHOWROOM_GLOBE_RUNTIME_GOVERNOR_MOBILE_PERFORMANCE_TNT_v15";

const GLOBE_SELECTOR_STATE = Object.freeze({
  contract: CONTRACT,
  previousContract: "SHOWROOM_GLOBE_ZIONTS_OCEAN_MOTION_SPARKLE_TNT_v14",
  route: "/showroom/globe/",
  role: "globe-system-gateway-selector",
  gatewayAuthority: true,
  visualScaleAuthority: true,

  ziontsPrimaryBody: true,
  earthLabelActive: false,
  ancientLivingWorld: true,
  fortyBillionYearBaseline: true,
  beachesActive: true,
  vegetationActive: true,
  habitabilityActive: true,
  oceanMotionActive: true,
  oceanSparkleActive: true,
  lightReflectionActive: true,

  cinematicMaterialConnected: true,
  hydrationFileConnected: true,
  vegetationLayerConnected: true,
  runtimeGovernorActive: true,
  mobilePerformanceGovernor: true,
  switchRenderStaging: true,
  dragRenderThrottle: true,
  oceanCadenceGovernor: true,

  materialFirstExpression: true,
  hydrationSecondary: true,
  physicalGraphicMaterial: true,
  materialAsset: true,
  hydrationFile: true,

  fibonacciRuntime: true,
  lattice256Runtime: true,
  runtimeFieldSize: RUNTIME_FIELD_SIZE,
  fibonacciSequence: FIBONACCI_SEQUENCE,
  runtimeMotionLaw: "fibonacci-within-256-lattice",

  materialSource: PLANET_MATERIAL_VERSION,
  hydrationVersion: PLANET_HYDRATION_VERSION,
  vegetationVersion: PLANET_VEGETATION_VERSION || VEGETATION_HABITABILITY_VERSION,

  proceduralReplacementActive: false,
  opaqueGlobeBody: true,
  cartoonFallbackPrimary: false,
  splitSeasonGlobe: false,
  satelliteAbstraction: false,
  dayNightSplitFace: false,
  groundLevelBuildActive: false,
  diamondInstrument: false,
  publicReceiptsVisible: false,
  generatedImage: false,
  graphicBox: false,
  heavyRuntimeLoaded: false,

  childRoutes: Object.freeze({
    zionts: "/showroom/globe/earth/",
    "h-earth": "/showroom/globe/h-earth/",
    audralia: "/showroom/globe/audralia/"
  })
});

const BODY_CONFIG = Object.freeze({
  earth: Object.freeze({
    key: "earth",
    publicKey: "zionts",
    title: "ZIONTS",
    subtitle: "Ancient Living World · ocean motion · light reflection",
    openText: "Open ZIONTS",
    href: "/showroom/globe/earth/",
    seed: 1207,
    anchor: "ZIONTS_ANCIENT_LIVING_WORLD",

    stoneLow: Object.freeze([34, 74, 78]),
    stoneMid: Object.freeze([92, 116, 104]),
    stoneHigh: Object.freeze([218, 192, 128]),
    stoneDeep: Object.freeze([8, 20, 26]),
    sediment: Object.freeze([176, 142, 82]),
    exposed: Object.freeze([232, 206, 142]),
    shadow: Object.freeze([4, 10, 16]),
    ridge: Object.freeze([244, 222, 154]),
    scar: Object.freeze([14, 34, 36]),

    atmosphere: Object.freeze([92, 150, 184]),
    water: Object.freeze([26, 102, 126]),
    shelf: Object.freeze([70, 142, 146]),

    beach: Object.freeze([222, 196, 132]),
    beachWhite: Object.freeze([236, 228, 202]),
    beachBlack: Object.freeze([76, 66, 58]),
    vegetation: Object.freeze([52, 128, 78]),
    oldGrowth: Object.freeze([32, 86, 58]),
    wetland: Object.freeze([42, 112, 96]),
    reef: Object.freeze([92, 174, 158]),

    waterBias: 0.34,
    shellStrength: 0.22,
    wetness: 0.42,
    oceanDepth: 0.36,
    goldReflection: 0.36,
    materialPriority: 0.78,
    hydrationPriority: 0.22,

    oceanMotion: Object.freeze({
      active: true,
      sparkle: true,
      reflectionStrength: 0.46,
      waveStrength: 0.34,
      glintStrength: 0.40,
      motionSpeed: 0.72
    }),

    lifeProfile: Object.freeze({
      beachStrength: 0.52,
      vegetationStrength: 0.42,
      wetlandStrength: 0.34,
      oldGrowthStrength: 0.30,
      reefStrength: 0.22,
      alienLifeBias: 0,
      desertLifeBias: 0.08,
      blackSandBias: 0.08
    }),

    hydration: Object.freeze({
      world: "zionts",
      waterBias: 0.34,
      shellStrength: 0.22,
      wetness: 0.42,
      oceanDepth: 0.36,
      goldReflection: 0.36,
      materialPriority: 0.78,
      hydrationPriority: 0.22
    })
  }),

  "h-earth": Object.freeze({
    key: "h-earth",
    publicKey: "h-earth",
    title: "H-Earth",
    subtitle: "Hybrid Ancient Living World · reflective water systems",
    openText: "Open H-Earth",
    href: "/showroom/globe/h-earth/",
    seed: 2331,
    anchor: "H_EARTH_HYBRID_ANCIENT_LIVING_WORLD",

    stoneLow: Object.freeze([78, 72, 50]),
    stoneMid: Object.freeze([146, 126, 78]),
    stoneHigh: Object.freeze([226, 200, 124]),
    stoneDeep: Object.freeze([12, 16, 12]),
    sediment: Object.freeze([188, 148, 82]),
    exposed: Object.freeze([242, 218, 150]),
    shadow: Object.freeze([5, 10, 8]),
    ridge: Object.freeze([248, 226, 158]),
    scar: Object.freeze([12, 28, 22]),

    atmosphere: Object.freeze([112, 176, 150]),
    water: Object.freeze([44, 112, 102]),
    shelf: Object.freeze([82, 148, 126]),

    beach: Object.freeze([218, 196, 130]),
    beachWhite: Object.freeze([232, 222, 188]),
    beachBlack: Object.freeze([70, 64, 50]),
    vegetation: Object.freeze([74, 132, 70]),
    oldGrowth: Object.freeze([48, 92, 52]),
    wetland: Object.freeze([54, 118, 86]),
    reef: Object.freeze([94, 158, 126]),

    waterBias: 0.10,
    shellStrength: 0.14,
    wetness: 0.18,
    oceanDepth: 0.10,
    goldReflection: 0.42,
    materialPriority: 0.88,
    hydrationPriority: 0.12,

    oceanMotion: Object.freeze({
      active: true,
      sparkle: true,
      reflectionStrength: 0.36,
      waveStrength: 0.24,
      glintStrength: 0.30,
      motionSpeed: 0.58
    }),

    lifeProfile: Object.freeze({
      beachStrength: 0.46,
      vegetationStrength: 0.54,
      wetlandStrength: 0.32,
      oldGrowthStrength: 0.38,
      reefStrength: 0.16,
      alienLifeBias: 0.04,
      desertLifeBias: 0.34,
      blackSandBias: 0.10
    }),

    hydration: Object.freeze({
      world: "h-earth",
      waterBias: 0.10,
      shellStrength: 0.14,
      wetness: 0.18,
      oceanDepth: 0.10,
      goldReflection: 0.42,
      materialPriority: 0.88,
      hydrationPriority: 0.12
    })
  }),

  audralia: Object.freeze({
    key: "audralia",
    publicKey: "audralia",
    title: "Audralia",
    subtitle: "Ancient Constructed Living World · opal ocean reflection",
    openText: "Open Audralia",
    href: "/showroom/globe/audralia/",
    seed: 3779,
    anchor: "AUDRALIA_ANCIENT_CONSTRUCTED_LIVING_WORLD",

    stoneLow: Object.freeze([74, 48, 80]),
    stoneMid: Object.freeze([132, 78, 96]),
    stoneHigh: Object.freeze([210, 142, 118]),
    stoneDeep: Object.freeze([14, 10, 32]),
    sediment: Object.freeze([166, 94, 84]),
    exposed: Object.freeze([234, 168, 140]),
    shadow: Object.freeze([8, 6, 22]),
    ridge: Object.freeze([238, 178, 152]),
    scar: Object.freeze([34, 16, 48]),

    atmosphere: Object.freeze([150, 122, 200]),
    water: Object.freeze([78, 86, 132]),
    shelf: Object.freeze([104, 102, 148]),

    beach: Object.freeze([210, 172, 126]),
    beachWhite: Object.freeze([228, 218, 202]),
    beachBlack: Object.freeze([54, 42, 66]),
    vegetation: Object.freeze([42, 138, 118]),
    oldGrowth: Object.freeze([30, 92, 84]),
    wetland: Object.freeze([56, 122, 122]),
    reef: Object.freeze([104, 164, 170]),
    alienVegetation: Object.freeze([48, 164, 142]),
    desertVegetation: Object.freeze([120, 116, 82]),

    waterBias: 0.16,
    shellStrength: 0.18,
    wetness: 0.24,
    oceanDepth: 0.16,
    goldReflection: 0.20,
    materialPriority: 0.84,
    hydrationPriority: 0.16,

    oceanMotion: Object.freeze({
      active: true,
      sparkle: true,
      reflectionStrength: 0.42,
      waveStrength: 0.28,
      glintStrength: 0.38,
      motionSpeed: 0.64
    }),

    lifeProfile: Object.freeze({
      beachStrength: 0.50,
      vegetationStrength: 0.46,
      wetlandStrength: 0.28,
      oldGrowthStrength: 0.34,
      reefStrength: 0.24,
      alienLifeBias: 0.46,
      desertLifeBias: 0.18,
      blackSandBias: 0.30
    }),

    hydration: Object.freeze({
      world: "audralia",
      waterBias: 0.16,
      shellStrength: 0.18,
      wetness: 0.24,
      oceanDepth: 0.16,
      goldReflection: 0.20,
      materialPriority: 0.84,
      hydrationPriority: 0.16
    })
  })
});

const state = {
  body: "earth",
  mode: "auto",
  yaw: 0.16,
  pitch: -0.06,
  velocityYaw: 0,
  velocityPitch: 0,
  dragging: false,
  pointerX: 0,
  pointerY: 0,
  lastTap: 0,

  lastTime: 0,
  lastRenderTime: 0,
  lastOceanFrame: 0,
  oceanTime: 0,
  raf: 0,

  forceMotionUntil: 0,
  forceSettlingUntil: 0,
  refineAt: 0,
  detailAt: 0,
  immediateRender: true,

  dpr: 1,
  width: 0,
  height: 0,
  needsRender: true,
  runtimeAddress: 0,
  fibonacciBand: 8,
  renderer: null,
  vegetationLayer: null,
  renderQuality: "motion"
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function nowMs() {
  return performance.now();
}

function rgb(values, alpha = 1) {
  return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${alpha})`;
}

function seededUnit(index, salt) {
  return ((Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453) % 1 + 1) % 1;
}

function requestRender(immediate = false) {
  state.needsRender = true;
  if (immediate) state.immediateRender = true;
}

function resizeCanvas(canvas) {
  const box = canvas.getBoundingClientRect();
  const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
  const width = Math.max(320, Math.floor(box.width * dpr));
  const height = Math.max(520, Math.floor(box.height * dpr));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    state.width = width;
    state.height = height;
    state.dpr = dpr;
    state.renderer = createCinematicPlanetMaterialRenderer({
      mobile: width / dpr <= 560,
      dpr
    });
    state.vegetationLayer = createVegetationHabitabilityLayer({
      mobile: width / dpr <= 560,
      dpr
    });

    const now = nowMs();
    state.forceMotionUntil = now + 220;
    state.forceSettlingUntil = now + 760;
    state.refineAt = now + 260;
    state.detailAt = now + 820;
    requestRender(true);
  }
}

function getLayoutMetrics(width, height) {
  const cssWidth = width / state.dpr;
  const isMobile = cssWidth <= 560;
  const topBand = isMobile ? 188 * state.dpr : 176 * state.dpr;
  const bottomBand = isMobile ? 214 * state.dpr : 198 * state.dpr;
  const available = Math.max(220 * state.dpr, height - topBand - bottomBand);

  const radius = Math.min(
    width * (isMobile ? 0.345 : 0.380),
    available * (isMobile ? 0.510 : 0.535)
  );

  return Object.freeze({
    isMobile,
    topBand,
    bottomBand,
    globeCenterX: width * 0.5,
    globeCenterY: topBand + available * 0.48,
    radius
  });
}

function fibonacciBandForMode() {
  if (state.mode === "stable") return 3;
  if (state.mode === "soft") return 21;
  return 13;
}

function oceanFrameCadence() {
  if (state.dragging) return 1 / 5;
  if (state.mode === "stable") return 1 / 13;
  return 1 / 21;
}

function minimumRenderIntervalMs() {
  const quality = getRenderQuality();

  if (state.dragging) return 1000 / 18;
  if (quality === "motion") return 1000 / 21;
  if (quality === "settling") return 1000 / 13;
  if (state.mode === "stable") return 1000 / 8;
  return 1000 / 13;
}

function resolveRuntimeAddress() {
  const bodyIndex = Object.keys(BODY_CONFIG).indexOf(state.body);
  const yawBucket = Math.round((((state.yaw % TAU) + TAU) % TAU) / TAU * 64) % 64;
  const pitchBucket = Math.round(((state.pitch + 0.6) / 1.2) * 15);
  const modeBucket = state.mode === "stable" ? 0 : state.mode === "soft" ? 1 : 2;
  state.runtimeAddress = (bodyIndex * 64 + yawBucket + pitchBucket * 4 + modeBucket) % RUNTIME_FIELD_SIZE;
  return state.runtimeAddress;
}

function getRenderQuality() {
  const now = nowMs();
  const motion = Math.abs(state.velocityYaw) + Math.abs(state.velocityPitch);

  if (state.dragging || now < state.forceMotionUntil || motion > 0.018) return "motion";
  if (now < state.forceSettlingUntil || motion > 0.0025) return "settling";
  return "settled";
}

function getRenderDetail() {
  if (state.dragging) return "stable";
  if (nowMs() < state.detailAt) return "stable";
  if (state.mode === "stable") return "high";
  return "stable";
}

function drawStageBackground(ctx, width, height, world) {
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, "rgba(3, 10, 22, 1)");
  bg.addColorStop(0.52, "rgba(7, 18, 36, 1)");
  bg.addColorStop(1, "rgba(1, 5, 13, 1)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const metrics = getLayoutMetrics(width, height);
  const halo = ctx.createRadialGradient(
    metrics.globeCenterX,
    metrics.globeCenterY,
    metrics.radius * 0.24,
    metrics.globeCenterX,
    metrics.globeCenterY,
    metrics.radius * 1.88
  );

  halo.addColorStop(0, rgb(world.atmosphere, 0.080));
  halo.addColorStop(0.42, rgb(world.atmosphere, 0.034));
  halo.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, width, height);

  drawStars(ctx, width, height);
}

function drawStars(ctx, width, height) {
  ctx.save();

  for (let i = 0; i < 44; i += 1) {
    const x = seededUnit(i, 1) * width;
    const y = seededUnit(i, 2) * height;
    const alpha = 0.045 + seededUnit(i, 3) * 0.13;
    const size = i % 13 === 0 ? 5.2 : i % 5 === 0 ? 2.5 : 1;

    ctx.strokeStyle = `rgba(235,244,255,${alpha})`;
    ctx.lineWidth = Math.max(1, width * 0.00075);
    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x + size, y);
    ctx.moveTo(x, y - size);
    ctx.lineTo(x, y + size);
    ctx.stroke();
  }

  ctx.restore();
}

function drawGroundGlow(ctx, width, height, world) {
  const metrics = getLayoutMetrics(width, height);
  const radius = metrics.radius;
  const cx = metrics.globeCenterX;
  const cy = metrics.globeCenterY;

  const glow = ctx.createRadialGradient(cx, cy + radius * 1.08, radius * 0.02, cx, cy + radius * 1.08, radius * 0.38);
  glow.addColorStop(0, rgb(world.atmosphere, 0.060));
  glow.addColorStop(0.46, "rgba(82,109,146,0.045)");
  glow.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(cx, cy + radius * 1.08, radius * 0.38, radius * 0.065, 0, 0, TAU);
  ctx.fill();
}

function render(canvas, ctx, timestamp = nowMs()) {
  const world = BODY_CONFIG[state.body] || BODY_CONFIG.earth;
  const width = canvas.width;
  const height = canvas.height;
  const metrics = getLayoutMetrics(width, height);

  if (!state.renderer) {
    state.renderer = createCinematicPlanetMaterialRenderer({
      mobile: metrics.isMobile,
      dpr: state.dpr
    });
  }

  if (!state.vegetationLayer) {
    state.vegetationLayer = createVegetationHabitabilityLayer({
      mobile: metrics.isMobile,
      dpr: state.dpr
    });
  }

  state.renderQuality = getRenderQuality();

  ctx.clearRect(0, 0, width, height);
  drawStageBackground(ctx, width, height, world);
  drawGroundGlow(ctx, width, height, world);

  state.renderer.drawPlanet(ctx, {
    cx: metrics.globeCenterX,
    cy: metrics.globeCenterY,
    scale: metrics.radius,
    yaw: state.yaw,
    pitch: state.pitch,
    quality: state.renderQuality,
    detail: getRenderDetail(),
    time: state.oceanTime,
    oceanMotion: true,
    oceanSparkle: !state.dragging,
    lightReflection: true
  }, world);

  state.needsRender = false;
  state.immediateRender = false;
  state.lastRenderTime = timestamp;
}

function updateMotion(dt, timestamp) {
  let changed = false;
  const fibonacciBand = fibonacciBandForMode();
  state.fibonacciBand = fibonacciBand;

  const world = BODY_CONFIG[state.body] || BODY_CONFIG.earth;
  const oceanSpeed = world.oceanMotion?.motionSpeed || 0.6;

  state.oceanTime += dt * oceanSpeed;

  if (!state.dragging) {
    const priorYaw = state.yaw;
    const priorPitch = state.pitch;

    state.yaw += state.velocityYaw;
    state.pitch = clamp(state.pitch + state.velocityPitch, -0.60, 0.60);

    const decayBase = state.mode === "soft" ? 0.986 : state.mode === "stable" ? 0.972 : 0.978;
    const fibonacciDecay = Math.pow(decayBase, (dt * 60) / Math.max(1, fibonacciBand / 8));

    state.velocityYaw *= fibonacciDecay;
    state.velocityPitch *= fibonacciDecay;

    if (Math.abs(state.velocityYaw) < 0.00008) state.velocityYaw = 0;
    if (Math.abs(state.velocityPitch) < 0.00008) state.velocityPitch = 0;

    if (state.mode === "auto" && state.velocityYaw === 0 && state.velocityPitch === 0) {
      state.yaw += dt * (1 / 55);
    }

    changed = changed || Math.abs(priorYaw - state.yaw) > 0.00001 || Math.abs(priorPitch - state.pitch) > 0.00001;
  }

  state.lastOceanFrame += dt;

  if (world.oceanMotion?.active && state.lastOceanFrame >= oceanFrameCadence()) {
    state.lastOceanFrame = 0;
    requestRender(false);
  }

  if (state.refineAt && timestamp >= state.refineAt) {
    state.refineAt = 0;
    requestRender(false);
  }

  if (state.detailAt && timestamp >= state.detailAt) {
    state.detailAt = 0;
    requestRender(false);
  }

  resolveRuntimeAddress();

  if (changed) requestRender(false);

  if (state.renderQuality !== getRenderQuality()) {
    requestRender(false);
  }
}

function step(time, canvas, ctx) {
  const dt = state.lastTime ? clamp((time - state.lastTime) / 1000, 0, 0.05) : 0;
  state.lastTime = time;

  resizeCanvas(canvas);
  updateMotion(dt, time);

  const elapsed = time - state.lastRenderTime;
  const canRender = state.immediateRender || elapsed >= minimumRenderIntervalMs();

  if (state.needsRender && canRender) {
    render(canvas, ctx, time);
  }

  state.raf = requestAnimationFrame((next) => step(next, canvas, ctx));
}

function bindPointer(stage) {
  stage.addEventListener("pointerdown", (event) => {
    const now = nowMs();

    if (now - state.lastTap < 320) resetView(true);

    state.lastTap = now;
    state.dragging = true;
    state.pointerX = event.clientX;
    state.pointerY = event.clientY;
    state.velocityYaw = 0;
    state.velocityPitch = 0;
    state.forceMotionUntil = now + 220;
    state.forceSettlingUntil = now + 520;
    requestRender(true);

    stage.setPointerCapture?.(event.pointerId);
  });

  stage.addEventListener("pointermove", (event) => {
    if (!state.dragging) return;

    const dx = event.clientX - state.pointerX;
    const dy = event.clientY - state.pointerY;

    state.pointerX = event.clientX;
    state.pointerY = event.clientY;

    const sensitivity = state.mode === "stable" ? 0.0048 : 0.0062;

    state.yaw += dx * sensitivity;
    state.pitch = clamp(state.pitch - dy * 0.0040, -0.60, 0.60);

    state.velocityYaw = dx * 0.0018;
    state.velocityPitch = -dy * 0.0011;
    state.forceMotionUntil = nowMs() + 160;

    requestRender(false);
  }, { passive: true });

  const release = (event) => {
    if (!state.dragging) return;

    const now = nowMs();
    state.dragging = false;
    state.forceSettlingUntil = now + 420;
    state.refineAt = now + 180;
    state.detailAt = now + 560;
    requestRender(true);

    stage.releasePointerCapture?.(event.pointerId);
  };

  stage.addEventListener("pointerup", release);
  stage.addEventListener("pointercancel", release);
  stage.addEventListener("pointerleave", release);
}

function resetView(immediate = true) {
  const now = nowMs();

  state.yaw = 0.16;
  state.pitch = -0.06;
  state.velocityYaw = 0;
  state.velocityPitch = 0;
  state.forceMotionUntil = now + 180;
  state.forceSettlingUntil = now + 540;
  state.refineAt = now + 220;
  state.detailAt = now + 620;
  requestRender(immediate);
}

function forcePublicLabels() {
  document.querySelectorAll("[data-body='earth']").forEach((button) => {
    button.textContent = "ZIONTS";
  });

  document.querySelectorAll("a[href='/showroom/globe/earth/']").forEach((link) => {
    const text = (link.textContent || "").trim();

    if (text === "Earth" || text === "Open Earth") {
      link.textContent = text === "Open Earth" ? "Open ZIONTS" : "ZIONTS";
    }
  });
}

function stageSwitchRender() {
  const now = nowMs();

  state.forceMotionUntil = now + 300;
  state.forceSettlingUntil = now + 900;
  state.refineAt = now + 260;
  state.detailAt = now + 860;
  state.lastOceanFrame = 0;
  requestRender(true);
}

function setBody(bodyKey) {
  if (!BODY_CONFIG[bodyKey]) return;

  state.body = bodyKey;
  resetView(false);
  stageSwitchRender();

  const world = BODY_CONFIG[bodyKey];

  document.querySelectorAll("[data-body]").forEach((button) => {
    button.setAttribute("aria-selected", button.dataset.body === bodyKey ? "true" : "false");
  });

  const stage = document.querySelector("[data-globe-selector-stage]");
  if (stage) stage.dataset.selectedBody = bodyKey;

  const title = document.querySelector("[data-body-title]");
  if (title) title.textContent = world.title;

  const subtitle = document.querySelector("[data-body-subtitle]");
  if (subtitle) subtitle.textContent = world.subtitle;

  const open = document.querySelector("[data-open-body]");
  if (open) {
    open.href = world.href;
    open.textContent = world.openText;
  }

  forcePublicLabels();
}

function setMode(mode) {
  state.mode = mode;

  const now = nowMs();
  state.forceMotionUntil = now + 160;
  state.forceSettlingUntil = now + 520;
  state.refineAt = now + 220;
  state.detailAt = now + 680;

  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.setAttribute("aria-selected", button.dataset.mode === mode ? "true" : "false");
  });

  requestRender(true);
}

function markRoute() {
  const markers = {
    globeGatewayStatus: "runtime-governor-mobile-performance",
    globeGatewayAuthority: "true",
    visualScaleAuthority: "true",

    ziontsPrimaryBody: "true",
    earthLabelActive: "false",
    ancientLivingWorld: "true",
    fortyBillionYearBaseline: "true",
    beachesActive: "true",
    vegetationActive: "true",
    habitabilityActive: "true",
    oceanMotionActive: "true",
    oceanSparkleActive: "true",
    lightReflectionActive: "true",

    runtimeGovernorActive: "true",
    mobilePerformanceGovernor: "true",
    switchRenderStaging: "true",
    dragRenderThrottle: "true",
    oceanCadenceGovernor: "true",

    cinematicMaterialConnected: "true",
    hydrationFileConnected: "true",
    vegetationLayerConnected: "true",
    expressionAligned: "true",
    materialFirstExpression: "true",
    hydrationSecondary: "true",
    physicalGraphicMaterial: "true",
    materialAsset: "true",
    hydrationFile: "true",

    fibonacciRuntime: "true",
    lattice256Runtime: "true",
    runtimeFieldSize: "256",
    runtimeMotionLaw: "fibonacci-within-256-lattice",

    materialSource: PLANET_MATERIAL_VERSION,
    hydrationVersion: PLANET_HYDRATION_VERSION,
    vegetationVersion: PLANET_VEGETATION_VERSION || VEGETATION_HABITABILITY_VERSION,

    proceduralReplacementActive: "false",
    opaqueGlobeBody: "true",
    cartoonFallbackPrimary: "false",
    splitSeasonGlobe: "false",
    satelliteAbstraction: "false",
    dayNightSplitFace: "false",
    groundLevelBuildActive: "false",
    diamondInstrument: "false"
  };

  Object.entries(markers).forEach(([key, value]) => {
    document.documentElement.dataset[key] = value;
    document.body.dataset[key] = value;
  });
}

function protectGatewayIdentity() {
  const title = document.querySelector("title");
  if (title && !/Globe Showcase/i.test(title.textContent || "")) {
    title.textContent = "Globe Showcase · Diamond Gate Bridge";
  }

  const h1 = document.querySelector("h1");
  if (h1 && /Earth is the real-world reference body/i.test(h1.textContent || "")) {
    h1.textContent = "ZIONTS, H-Earth, and Audralia are ancient living worlds.";
  }

  forcePublicLabels();
}

function bindControls() {
  document.querySelectorAll("[data-body]").forEach((button) => {
    button.addEventListener("click", () => setBody(button.dataset.body));
  });

  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });

  const reset = document.querySelector("[data-reset-view]");
  if (reset) reset.addEventListener("click", () => resetView(true));
}

function initGlobeSelector() {
  markRoute();
  protectGatewayIdentity();

  const stage = document.querySelector("[data-globe-selector-stage]");
  const canvas = document.querySelector("[data-globe-selector-canvas]");

  if (!stage || !canvas) return null;

  const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
  if (!ctx) return null;

  bindControls();
  bindPointer(stage);
  setBody("earth");
  setMode("auto");
  resizeCanvas(canvas);
  render(canvas, ctx, nowMs());

  if (!state.raf) {
    state.raf = requestAnimationFrame((time) => step(time, canvas, ctx));
  }

  window.DGBGlobeSelector = Object.freeze({
    ...GLOBE_SELECTOR_STATE,
    status() {
      resolveRuntimeAddress();

      return Object.freeze({
        ...GLOBE_SELECTOR_STATE,
        ready: true,
        selectedBody: state.body,
        selectedPublicBody: BODY_CONFIG[state.body]?.title || "UNKNOWN",
        mode: state.mode,
        yaw: state.yaw,
        pitch: state.pitch,
        oceanTime: state.oceanTime,
        renderQuality: state.renderQuality,
        runtimeAddress: state.runtimeAddress,
        fibonacciBand: state.fibonacciBand,
        dpr: state.dpr,
        lastRenderTime: state.lastRenderTime,
        runtimeGovernorActive: true,
        mobilePerformanceGovernor: true,
        switchRenderStaging: true,
        dragRenderThrottle: true,
        oceanCadenceGovernor: true,

        materialSource: PLANET_MATERIAL_VERSION,
        hydrationVersion: PLANET_HYDRATION_VERSION,
        vegetationVersion: PLANET_VEGETATION_VERSION || VEGETATION_HABITABILITY_VERSION,

        currentAnchor: BODY_CONFIG[state.body]?.anchor || "UNKNOWN",
        currentMaterialPriority: BODY_CONFIG[state.body]?.materialPriority,
        currentHydrationPriority: BODY_CONFIG[state.body]?.hydrationPriority,

        ziontsPrimaryBody: true,
        earthLabelActive: false,
        ancientLivingWorld: true,
        fortyBillionYearBaseline: true,
        beachesActive: true,
        vegetationActive: true,
        habitabilityActive: true,
        oceanMotionActive: true,
        oceanSparkleActive: true,
        lightReflectionActive: true,

        cinematicMaterialConnected: true,
        hydrationFileConnected: true,
        vegetationLayerConnected: true,
        materialFirstExpression: true,
        hydrationSecondary: true,
        physicalGraphicMaterial: true,
        materialAsset: true,
        hydrationFile: true,
        proceduralReplacementActive: false,

        fibonacciRuntime: true,
        lattice256Runtime: true,
        runtimeFieldSize: RUNTIME_FIELD_SIZE,
        fibonacciSequence: FIBONACCI_SEQUENCE,
        runtimeMotionLaw: "fibonacci-within-256-lattice",

        opaqueGlobeBody: true,
        cartoonFallbackPrimary: false,
        splitSeasonGlobe: false,
        satelliteAbstraction: false,
        dayNightSplitFace: false,
        groundLevelBuildActive: false,
        diamondMountedHere: false,
        earthStandingInGateway: false
      });
    }
  });

  return window.DGBGlobeSelector;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGlobeSelector, { once: true });
} else {
  initGlobeSelector();
}

export { GLOBE_SELECTOR_STATE, initGlobeSelector };
export default GLOBE_SELECTOR_STATE;

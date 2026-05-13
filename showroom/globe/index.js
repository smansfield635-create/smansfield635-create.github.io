const GLOBE_SELECTOR_STATE = Object.freeze({
  contract: "SHOWROOM_GLOBE_SCREENSHOT_BASELINE_REBUILD_TNT_v8",
  previousContract: "SHOWROOM_GLOBE_CINEMATIC_MATERIAL_RESTORATION_TNT_v7",
  route: "/showroom/globe/",
  role: "globe-system-gateway-selector",
  gatewayAuthority: true,
  visualScaleAuthority: true,
  diamondInstrument: false,
  runtimeStabilized: true,
  mobileStageLayoutGovernor: true,
  protectedVerticalBands: true,
  cinematicMaterialRestored: true,
  screenshotBaselineRebuild: true,
  proceduralBlobPrimary: false,
  opaqueGlobeBody: true,
  stripSamplingRenderer: false,
  blockTileLandRender: false,
  materialSource: "screenshot-baseline-rebuild:v8",
  childRoutes: Object.freeze({
    earth: "/showroom/globe/earth/",
    "h-earth": "/showroom/globe/h-earth/",
    audralia: "/showroom/globe/audralia/"
  }),
  publicReceiptsVisible: false,
  generatedImage: false,
  graphicBox: false,
  heavyRuntimeLoaded: false
});

const BODY_CONFIG = Object.freeze({
  earth: Object.freeze({
    key: "earth",
    title: "Earth",
    subtitle: "Reference Body · cinematic orbital baseline",
    openText: "Open Earth",
    href: "/showroom/globe/earth/",
    palette: Object.freeze({
      space: [3, 8, 18],
      core: [13, 52, 86],
      core2: [24, 92, 134],
      deep: [4, 18, 44],
      land: [112, 128, 88],
      land2: [164, 150, 101],
      high: [218, 214, 174],
      scar: [19, 44, 46],
      glow: [112, 184, 244],
      shell: [190, 225, 255],
      water: [30, 134, 168]
    }),
    features: Object.freeze({
      basins: 34,
      ridges: 28,
      craters: 30,
      scars: 16,
      glints: 7
    })
  }),

  "h-earth": Object.freeze({
    key: "h-earth",
    title: "H-Earth",
    subtitle: "Hybrid Earth · cinematic inspection gateway",
    openText: "Open H-Earth",
    href: "/showroom/globe/h-earth/",
    palette: Object.freeze({
      space: [3, 8, 18],
      core: [13, 70, 68],
      core2: [70, 136, 112],
      deep: [4, 30, 34],
      land: [154, 137, 74],
      land2: [202, 170, 84],
      high: [236, 214, 138],
      scar: [18, 50, 42],
      glow: [153, 238, 190],
      shell: [206, 255, 226],
      water: [58, 170, 150]
    }),
    features: Object.freeze({
      basins: 42,
      ridges: 34,
      craters: 38,
      scars: 24,
      glints: 9
    })
  }),

  audralia: Object.freeze({
    key: "audralia",
    title: "Audralia",
    subtitle: "Constructed World · cinematic selector material",
    openText: "Open Audralia",
    href: "/showroom/globe/audralia/",
    palette: Object.freeze({
      space: [3, 8, 18],
      core: [56, 40, 82],
      core2: [126, 84, 112],
      deep: [16, 11, 36],
      land: [137, 91, 82],
      land2: [184, 126, 104],
      high: [226, 168, 142],
      scar: [42, 24, 56],
      glow: [198, 160, 250],
      shell: [232, 220, 255],
      water: [92, 102, 156]
    }),
    features: Object.freeze({
      basins: 46,
      ridges: 38,
      craters: 42,
      scars: 30,
      glints: 8
    })
  })
});

const TAU = Math.PI * 2;
const PHI = (1 + Math.sqrt(5)) / 2;
const MAX_DPR = 1.5;
const FRAME_BUCKETS = 96;
const PITCH_BUCKETS = 17;

const state = {
  body: "earth",
  mode: "auto",
  yaw: 0.24,
  pitch: -0.08,
  velocityYaw: 0,
  velocityPitch: 0,
  dragging: false,
  pointerX: 0,
  pointerY: 0,
  lastTap: 0,
  lastTime: 0,
  raf: 0,
  dpr: 1,
  width: 0,
  height: 0,
  needsRender: true,
  materialCache: Object.create(null),
  frameCache: Object.create(null)
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function rgb(values, alpha = 1) {
  return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${alpha})`;
}

function mixColor(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t)
  ];
}

function seededUnit(index, salt) {
  return ((Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453) % 1 + 1) % 1;
}

function seededSigned(index, salt) {
  return seededUnit(index, salt) * 2 - 1;
}

function makeCanvas(width, height, alpha = true) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.dataset.alpha = alpha ? "true" : "false";
  return canvas;
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
    state.needsRender = true;
  }
}

function getLayoutMetrics(width, height) {
  const cssWidth = width / state.dpr;
  const isMobile = cssWidth <= 560;

  const topBand = isMobile ? 188 * state.dpr : 176 * state.dpr;
  const bottomBand = isMobile ? 214 * state.dpr : 198 * state.dpr;
  const available = Math.max(220 * state.dpr, height - topBand - bottomBand);

  const radius = Math.min(
    width * (isMobile ? 0.318 : 0.355),
    available * (isMobile ? 0.465 : 0.505)
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

function buildMaterial(bodyKey) {
  if (state.materialCache[bodyKey]) return state.materialCache[bodyKey];

  const config = BODY_CONFIG[bodyKey] || BODY_CONFIG.earth;
  const features = [];

  let id = 0;

  for (let i = 0; i < config.features.basins; i += 1) {
    features.push(Object.freeze({
      type: "basin",
      id: id++,
      lat: seededSigned(i, bodyKey.length + 10) * 1.12,
      lon: seededSigned(i, bodyKey.length + 11) * Math.PI,
      size: 0.070 + seededUnit(i, bodyKey.length + 12) * 0.155,
      stretch: 0.62 + seededUnit(i, bodyKey.length + 13) * 0.86,
      angle: seededUnit(i, bodyKey.length + 14) * TAU,
      tone: seededUnit(i, bodyKey.length + 15)
    }));
  }

  for (let i = 0; i < config.features.craters; i += 1) {
    features.push(Object.freeze({
      type: "crater",
      id: id++,
      lat: seededSigned(i, bodyKey.length + 30) * 1.06,
      lon: seededSigned(i, bodyKey.length + 31) * Math.PI,
      size: 0.026 + seededUnit(i, bodyKey.length + 32) * 0.072,
      stretch: 0.76 + seededUnit(i, bodyKey.length + 33) * 0.50,
      angle: seededUnit(i, bodyKey.length + 34) * TAU,
      tone: seededUnit(i, bodyKey.length + 35)
    }));
  }

  for (let i = 0; i < config.features.ridges; i += 1) {
    const points = [];
    const lat = seededSigned(i, bodyKey.length + 50) * 1.04;
    const lon = seededSigned(i, bodyKey.length + 51) * Math.PI;
    const length = 0.18 + seededUnit(i, bodyKey.length + 52) * 0.42;
    const bend = seededSigned(i, bodyKey.length + 53) * 0.16;

    for (let j = 0; j < 9; j += 1) {
      const t = j / 8;
      points.push(Object.freeze({
        lat: clamp(lat + (t - 0.5) * length + Math.sin(t * Math.PI) * bend, -1.38, 1.38),
        lon: lon + (t - 0.5) * length * (0.70 + seededUnit(i, bodyKey.length + 54) * 0.60)
      }));
    }

    features.push(Object.freeze({
      type: "ridge",
      id: id++,
      points: Object.freeze(points),
      width: 0.005 + seededUnit(i, bodyKey.length + 55) * 0.010,
      tone: seededUnit(i, bodyKey.length + 56)
    }));
  }

  for (let i = 0; i < config.features.scars; i += 1) {
    const points = [];
    const lat = seededSigned(i, bodyKey.length + 70) * 1.00;
    const lon = seededSigned(i, bodyKey.length + 71) * Math.PI;
    const length = 0.34 + seededUnit(i, bodyKey.length + 72) * 0.60;
    const bend = seededSigned(i, bodyKey.length + 73) * 0.22;

    for (let j = 0; j < 12; j += 1) {
      const t = j / 11;
      points.push(Object.freeze({
        lat: clamp(lat + (t - 0.5) * length * 0.55 + Math.sin(t * Math.PI) * bend, -1.34, 1.34),
        lon: lon + (t - 0.5) * length
      }));
    }

    features.push(Object.freeze({
      type: "scar",
      id: id++,
      points: Object.freeze(points),
      width: 0.006 + seededUnit(i, bodyKey.length + 74) * 0.014,
      tone: seededUnit(i, bodyKey.length + 75)
    }));
  }

  for (let i = 0; i < config.features.glints; i += 1) {
    features.push(Object.freeze({
      type: "glint",
      id: id++,
      lat: seededSigned(i, bodyKey.length + 90) * 0.94,
      lon: seededSigned(i, bodyKey.length + 91) * Math.PI,
      size: 0.018 + seededUnit(i, bodyKey.length + 92) * 0.034,
      tone: seededUnit(i, bodyKey.length + 93)
    }));
  }

  const material = Object.freeze({
    key: bodyKey,
    source: `screenshot-baseline-rebuild:v8:${bodyKey}`,
    features: Object.freeze(features)
  });

  state.materialCache[bodyKey] = material;
  return material;
}

function spherePoint(lat, lon, yaw, pitch) {
  const adjustedLon = lon + yaw;
  const cosLat = Math.cos(lat);

  const x = Math.cos(adjustedLon) * cosLat;
  const y = Math.sin(lat);
  const z = Math.sin(adjustedLon) * cosLat;

  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);

  const y2 = y * cp - z * sp;
  const z2 = y * sp + z * cp;

  return { x, y: y2, z: z2 };
}

function project(lat, lon, yaw, pitch, cx, cy, radius) {
  const p = spherePoint(lat, lon, yaw, pitch);
  const visible = p.z > -0.16;
  const depth = clamp((p.z + 1) * 0.5, 0, 1);
  const perspective = 0.90 + depth * 0.16;

  return Object.freeze({
    x: cx + p.x * radius * perspective,
    y: cy - p.y * radius * perspective,
    z: p.z,
    depth,
    visible,
    perspective
  });
}

function getFrameKey(bodyKey, radius, yaw, pitch) {
  const radiusBucket = Math.round(radius / 12) * 12;
  const yawBucket = ((Math.round((((yaw % TAU) + TAU) % TAU) / TAU * FRAME_BUCKETS) % FRAME_BUCKETS) + FRAME_BUCKETS) % FRAME_BUCKETS;
  const pitchBucket = Math.round(((clamp(pitch, -0.60, 0.60) + 0.60) / 1.20) * (PITCH_BUCKETS - 1));
  return `${bodyKey}:${radiusBucket}:${yawBucket}:${pitchBucket}`;
}

function getBucketPose(yaw, pitch) {
  const yawBucket = ((Math.round((((yaw % TAU) + TAU) % TAU) / TAU * FRAME_BUCKETS) % FRAME_BUCKETS) + FRAME_BUCKETS) % FRAME_BUCKETS;
  const pitchBucket = Math.round(((clamp(pitch, -0.60, 0.60) + 0.60) / 1.20) * (PITCH_BUCKETS - 1));

  return Object.freeze({
    yaw: (yawBucket / FRAME_BUCKETS) * TAU,
    pitch: (pitchBucket / (PITCH_BUCKETS - 1)) * 1.20 - 0.60
  });
}

function getCinematicFrame(bodyKey, radius, yaw, pitch) {
  const key = getFrameKey(bodyKey, radius, yaw, pitch);

  if (state.frameCache[key]) return state.frameCache[key];

  const frame = buildCinematicFrame(bodyKey, radius, yaw, pitch);
  state.frameCache[key] = frame;
  trimFrameCache(bodyKey);
  return frame;
}

function trimFrameCache(bodyKey) {
  const keys = Object.keys(state.frameCache);
  if (keys.length <= 42) return;

  let removed = 0;

  for (const key of keys) {
    if (!key.startsWith(`${bodyKey}:`) && removed < 8) {
      delete state.frameCache[key];
      removed += 1;
    }
  }

  if (Object.keys(state.frameCache).length > 52) {
    const remaining = Object.keys(state.frameCache);
    for (let i = 0; i < remaining.length - 52; i += 1) {
      delete state.frameCache[remaining[i]];
    }
  }
}

function buildCinematicFrame(bodyKey, radius, yaw, pitch) {
  const config = BODY_CONFIG[bodyKey] || BODY_CONFIG.earth;
  const material = buildMaterial(bodyKey);
  const pose = getBucketPose(yaw, pitch);
  const pad = Math.ceil(radius * 0.28);
  const size = Math.ceil(radius * 2 + pad * 2);
  const canvas = makeCanvas(size, size, true);
  const ctx = canvas.getContext("2d", { alpha: true });

  const cx = size * 0.5;
  const cy = size * 0.5;

  drawOuterAura(ctx, config, cx, cy, radius);
  drawOpaqueSphereBase(ctx, config, cx, cy, radius);
  drawCinematicSurface(ctx, config, material, cx, cy, radius, pose.yaw, pose.pitch);
  drawHydrationShell(ctx, config, cx, cy, radius);
  drawAtmosphere(ctx, config, cx, cy, radius);

  return Object.freeze({
    key: `${bodyKey}:${Math.round(radius)}:${pose.yaw.toFixed(3)}:${pose.pitch.toFixed(3)}`,
    source: `screenshot-baseline-rebuild:v8:${bodyKey}`,
    canvas,
    size,
    radius,
    ready: true
  });
}

function drawOuterAura(ctx, config, cx, cy, radius) {
  const g = ctx.createRadialGradient(cx, cy, radius * 0.76, cx, cy, radius * 1.42);
  g.addColorStop(0.00, "rgba(255,255,255,0)");
  g.addColorStop(0.48, rgb(config.palette.glow, 0.08));
  g.addColorStop(0.78, rgb(config.palette.glow, 0.18));
  g.addColorStop(1.00, "rgba(255,255,255,0)");

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.44, 0, TAU);
  ctx.fill();
  ctx.restore();
}

function drawOpaqueSphereBase(ctx, config, cx, cy, radius) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.clip();

  const base = ctx.createRadialGradient(
    cx - radius * 0.36,
    cy - radius * 0.42,
    radius * 0.05,
    cx + radius * 0.14,
    cy + radius * 0.12,
    radius * 1.16
  );

  base.addColorStop(0.00, rgb(mixColor(config.palette.core2, [255,255,255], 0.12), 1));
  base.addColorStop(0.28, rgb(config.palette.core2, 1));
  base.addColorStop(0.58, rgb(config.palette.core, 1));
  base.addColorStop(0.82, rgb(mixColor(config.palette.core, config.palette.deep, 0.55), 1));
  base.addColorStop(1.00, rgb(config.palette.deep, 1));

  ctx.fillStyle = base;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  const meridian = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
  meridian.addColorStop(0.00, "rgba(255,255,255,0.03)");
  meridian.addColorStop(0.35, "rgba(255,255,255,0.00)");
  meridian.addColorStop(0.70, "rgba(0,0,0,0.08)");
  meridian.addColorStop(1.00, "rgba(0,0,0,0.30)");
  ctx.fillStyle = meridian;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  ctx.restore();
}

function drawCinematicSurface(ctx, config, material, cx, cy, radius, yaw, pitch) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.clip();

  drawBasins(ctx, config, material, cx, cy, radius, yaw, pitch);
  drawRidges(ctx, config, material, cx, cy, radius, yaw, pitch);
  drawScars(ctx, config, material, cx, cy, radius, yaw, pitch);
  drawCraters(ctx, config, material, cx, cy, radius, yaw, pitch);
  drawSurfaceMist(ctx, config, material, cx, cy, radius, yaw, pitch);
  drawGlintsOnSurface(ctx, config, material, cx, cy, radius, yaw, pitch);
  drawFinalSphereLighting(ctx, config, cx, cy, radius);

  ctx.restore();
}

function drawBasins(ctx, config, material, cx, cy, radius, yaw, pitch) {
  const basins = material.features.filter((feature) => feature.type === "basin");

  for (const basin of basins) {
    const p = project(basin.lat, basin.lon, yaw, pitch, cx, cy, radius);
    if (!p.visible) continue;

    const visibleAlpha = clamp((p.z + 0.16) / 1.16, 0, 1);
    const size = basin.size * radius * (0.76 + p.depth * 0.42);
    const stretch = basin.stretch;

    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.translate(p.x, p.y);
    ctx.rotate(basin.angle + yaw * 0.12);
    ctx.scale(stretch, 1);

    const basinColor = mixColor(config.palette.land, config.palette.land2, basin.tone * 0.55);
    const g = ctx.createRadialGradient(0, 0, size * 0.08, 0, 0, size);
    g.addColorStop(0.00, rgb(mixColor(basinColor, config.palette.high, 0.24), 0.74 * visibleAlpha));
    g.addColorStop(0.38, rgb(basinColor, 0.66 * visibleAlpha));
    g.addColorStop(0.82, rgb(mixColor(basinColor, config.palette.deep, 0.34), 0.58 * visibleAlpha));
    g.addColorStop(1.00, rgb(config.palette.deep, 0.12 * visibleAlpha));

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 0.58, 0, 0, TAU);
    ctx.fill();

    ctx.strokeStyle = rgb(config.palette.high, 0.10 * visibleAlpha);
    ctx.lineWidth = Math.max(0.7, radius * 0.003);
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.92, size * 0.52, 0, 0, TAU);
    ctx.stroke();

    ctx.restore();
  }
}

function drawCraters(ctx, config, material, cx, cy, radius, yaw, pitch) {
  const craters = material.features.filter((feature) => feature.type === "crater");

  for (const crater of craters) {
    const p = project(crater.lat, crater.lon, yaw, pitch, cx, cy, radius);
    if (!p.visible) continue;

    const visibleAlpha = clamp((p.z + 0.16) / 1.16, 0, 1);
    const size = crater.size * radius * (0.78 + p.depth * 0.38);

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(crater.angle);
    ctx.scale(crater.stretch, 1);

    const g = ctx.createRadialGradient(0, 0, size * 0.06, 0, 0, size);
    g.addColorStop(0.00, rgb(config.palette.deep, 0.34 * visibleAlpha));
    g.addColorStop(0.48, rgb(config.palette.scar, 0.22 * visibleAlpha));
    g.addColorStop(0.62, rgb(config.palette.high, 0.16 * visibleAlpha));
    g.addColorStop(1.00, "rgba(255,255,255,0)");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 0.70, 0, 0, TAU);
    ctx.fill();

    ctx.strokeStyle = rgb(config.palette.high, 0.12 * visibleAlpha);
    ctx.lineWidth = Math.max(0.55, radius * 0.0024);
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.72, size * 0.48, 0, 0, TAU);
    ctx.stroke();

    ctx.restore();
  }
}

function drawRidges(ctx, config, material, cx, cy, radius, yaw, pitch) {
  const ridges = material.features.filter((feature) => feature.type === "ridge");

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  for (const ridge of ridges) {
    const points = ridge.points
      .map((point) => project(point.lat, point.lon, yaw, pitch, cx, cy, radius))
      .filter((point) => point.visible);

    if (points.length < 3) continue;

    const avgDepth = points.reduce((sum, point) => sum + point.depth, 0) / points.length;
    const alpha = 0.055 + avgDepth * 0.10;

    ctx.strokeStyle = rgb(config.palette.high, alpha);
    ctx.lineWidth = Math.max(0.6, radius * ridge.width);
    ctx.beginPath();

    points.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });

    ctx.stroke();
  }

  ctx.restore();
}

function drawScars(ctx, config, material, cx, cy, radius, yaw, pitch) {
  const scars = material.features.filter((feature) => feature.type === "scar");

  ctx.save();

  for (const scar of scars) {
    const points = scar.points
      .map((point) => project(point.lat, point.lon, yaw, pitch, cx, cy, radius))
      .filter((point) => point.visible);

    if (points.length < 3) continue;

    const avgDepth = points.reduce((sum, point) => sum + point.depth, 0) / points.length;
    const alpha = 0.18 + avgDepth * 0.24;

    ctx.strokeStyle = rgb(config.palette.scar, alpha);
    ctx.lineWidth = Math.max(1.2, radius * scar.width);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();

    ctx.globalCompositeOperation = "screen";
    ctx.strokeStyle = rgb(config.palette.glow, alpha * 0.16);
    ctx.lineWidth = Math.max(0.45, radius * scar.width * 0.28);
    ctx.stroke();
    ctx.globalCompositeOperation = "source-over";
  }

  ctx.restore();
}

function drawSurfaceMist(ctx, config, material, cx, cy, radius, yaw, pitch) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  for (let i = 0; i < 18; i += 1) {
    const lat = seededSigned(i, config.key.length + 190) * 0.88;
    const lon = seededSigned(i, config.key.length + 191) * Math.PI;
    const p = project(lat, lon, yaw, pitch, cx, cy, radius);

    if (!p.visible) continue;

    const width = radius * (0.09 + seededUnit(i, config.key.length + 192) * 0.18);
    const height = radius * (0.010 + seededUnit(i, config.key.length + 193) * 0.025);
    const alpha = 0.020 + seededUnit(i, config.key.length + 194) * 0.040;

    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, width);
    g.addColorStop(0, rgb(config.palette.shell, alpha * p.depth));
    g.addColorStop(0.62, rgb(config.palette.shell, alpha * 0.32 * p.depth));
    g.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, width, height, seededUnit(i, config.key.length + 195) * TAU, 0, TAU);
    ctx.fill();
  }

  ctx.restore();
}

function drawGlintsOnSurface(ctx, config, material, cx, cy, radius, yaw, pitch) {
  const glints = material.features.filter((feature) => feature.type === "glint");

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  for (const glint of glints) {
    const p = project(glint.lat, glint.lon, yaw, pitch, cx, cy, radius);
    if (!p.visible || p.depth < 0.38) continue;

    const size = glint.size * radius;
    const alpha = 0.05 + p.depth * 0.11;

    ctx.strokeStyle = rgb(config.palette.shell, alpha);
    ctx.lineWidth = Math.max(0.5, radius * 0.0015);
    ctx.beginPath();
    ctx.moveTo(p.x - size, p.y);
    ctx.lineTo(p.x + size, p.y);
    ctx.moveTo(p.x, p.y - size);
    ctx.lineTo(p.x, p.y + size);
    ctx.stroke();
  }

  ctx.restore();
}

function drawHydrationShell(ctx, config, cx, cy, radius) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.clip();

  const glass = ctx.createRadialGradient(
    cx - radius * 0.36,
    cy - radius * 0.42,
    radius * 0.05,
    cx,
    cy,
    radius * 1.10
  );

  glass.addColorStop(0.00, "rgba(255,255,255,0.18)");
  glass.addColorStop(0.24, "rgba(255,255,255,0.036)");
  glass.addColorStop(0.55, "rgba(255,255,255,0.000)");
  glass.addColorStop(0.82, "rgba(0,0,0,0.10)");
  glass.addColorStop(1.00, "rgba(0,0,0,0.36)");

  ctx.fillStyle = glass;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  ctx.restore();
}

function drawFinalSphereLighting(ctx, config, cx, cy, radius) {
  const vignette = ctx.createRadialGradient(
    cx - radius * 0.34,
    cy - radius * 0.42,
    radius * 0.05,
    cx + radius * 0.12,
    cy + radius * 0.10,
    radius * 1.18
  );

  vignette.addColorStop(0.00, "rgba(255,255,255,0.12)");
  vignette.addColorStop(0.34, "rgba(255,255,255,0.018)");
  vignette.addColorStop(0.72, "rgba(0,0,0,0.14)");
  vignette.addColorStop(1.00, "rgba(0,0,0,0.50)");

  ctx.fillStyle = vignette;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  const terminator = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
  terminator.addColorStop(0.00, "rgba(0,0,0,0.00)");
  terminator.addColorStop(0.50, "rgba(0,0,0,0.00)");
  terminator.addColorStop(1.00, "rgba(0,0,0,0.24)");

  ctx.fillStyle = terminator;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
}

function drawAtmosphere(ctx, config, cx, cy, radius) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const limb = ctx.createRadialGradient(cx, cy, radius * 0.82, cx, cy, radius * 1.18);
  limb.addColorStop(0.00, "rgba(255,255,255,0)");
  limb.addColorStop(0.52, rgb(config.palette.glow, 0.05));
  limb.addColorStop(0.74, rgb(config.palette.glow, 0.18));
  limb.addColorStop(0.88, rgb(config.palette.shell, 0.22));
  limb.addColorStop(1.00, "rgba(255,255,255,0)");

  ctx.fillStyle = limb;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.16, 0, TAU);
  ctx.fill();

  ctx.strokeStyle = rgb(config.palette.shell, 0.26);
  ctx.lineWidth = Math.max(1, radius * 0.006);
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.006, 0, TAU);
  ctx.stroke();

  ctx.restore();
}

function drawStageBackground(ctx, width, height, config) {
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, "rgba(3, 10, 22, 1)");
  bg.addColorStop(0.52, "rgba(7, 18, 36, 1)");
  bg.addColorStop(1, "rgba(1, 5, 13, 1)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const metrics = getLayoutMetrics(width, height);
  const cx = metrics.globeCenterX;
  const cy = metrics.globeCenterY;
  const radius = metrics.radius;

  const halo = ctx.createRadialGradient(cx, cy, radius * 0.20, cx, cy, radius * 2.05);
  halo.addColorStop(0.00, rgb(config.palette.glow, 0.12));
  halo.addColorStop(0.40, rgb(config.palette.glow, 0.052));
  halo.addColorStop(1.00, "rgba(0,0,0,0)");

  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, width, height);

  drawStars(ctx, width, height, config);
}

function drawStars(ctx, width, height, config) {
  ctx.save();

  for (let i = 0; i < 48; i += 1) {
    const x = seededUnit(i, 1) * width;
    const y = seededUnit(i, 2) * height;
    const alpha = 0.05 + seededUnit(i, 3) * 0.14;
    const size = i % 13 === 0 ? 5.5 : i % 5 === 0 ? 2.7 : 1.0;

    ctx.strokeStyle = `rgba(235,244,255,${alpha})`;
    ctx.lineWidth = Math.max(1, width * 0.0008);
    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x + size, y);
    ctx.moveTo(x, y - size);
    ctx.lineTo(x, y + size);
    ctx.stroke();
  }

  ctx.restore();
}

function drawGroundShadow(ctx, ctxWidth, ctxHeight, config) {
  const metrics = getLayoutMetrics(ctxWidth, ctxHeight);
  const radius = metrics.radius;
  const cx = metrics.globeCenterX;
  const cy = metrics.globeCenterY;

  const shadow = ctx.createRadialGradient(
    cx,
    cy + radius * 1.08,
    radius * 0.04,
    cx,
    cy + radius * 1.08,
    radius * 0.50
  );

  shadow.addColorStop(0, rgb(config.palette.glow, 0.11));
  shadow.addColorStop(0.46, "rgba(82,109,146,0.09)");
  shadow.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.ellipse(cx, cy + radius * 1.08, radius * 0.44, radius * 0.08, 0, 0, TAU);
  ctx.fill();
}

function render(canvas, ctx) {
  const config = BODY_CONFIG[state.body] || BODY_CONFIG.earth;
  const width = canvas.width;
  const height = canvas.height;
  const metrics = getLayoutMetrics(width, height);
  const frame = getCinematicFrame(state.body, metrics.radius, state.yaw, state.pitch);

  ctx.clearRect(0, 0, width, height);
  drawStageBackground(ctx, width, height, config);
  drawGroundShadow(ctx, width, height, config);

  const x = metrics.globeCenterX - frame.size * 0.5;
  const y = metrics.globeCenterY - frame.size * 0.5;

  ctx.drawImage(frame.canvas, x, y);

  state.needsRender = false;
}

function updateMotion(dt) {
  let changed = false;

  if (!state.dragging) {
    const priorYaw = state.yaw;
    const priorPitch = state.pitch;

    state.yaw += state.velocityYaw;
    state.pitch = clamp(state.pitch + state.velocityPitch, -0.60, 0.60);

    const damping = state.mode === "soft" ? 0.958 : 0.940;
    const applied = Math.pow(damping, dt * 60);

    state.velocityYaw *= applied;
    state.velocityPitch *= applied;

    if (Math.abs(state.velocityYaw) < 0.00008) state.velocityYaw = 0;
    if (Math.abs(state.velocityPitch) < 0.00008) state.velocityPitch = 0;

    if (state.mode === "auto" && state.velocityYaw === 0 && state.velocityPitch === 0) {
      state.yaw += dt * 0.030;
    }

    changed = changed || Math.abs(priorYaw - state.yaw) > 0.00001 || Math.abs(priorPitch - state.pitch) > 0.00001;
  }

  if (changed) state.needsRender = true;
}

function step(time, canvas, ctx) {
  const dt = state.lastTime ? clamp((time - state.lastTime) / 1000, 0, 0.05) : 0;
  state.lastTime = time;

  resizeCanvas(canvas);
  updateMotion(dt);

  if (state.needsRender) render(canvas, ctx);

  state.raf = requestAnimationFrame((next) => step(next, canvas, ctx));
}

function bindPointer(stage) {
  stage.addEventListener("pointerdown", (event) => {
    const now = performance.now();

    if (now - state.lastTap < 320) resetView();

    state.lastTap = now;
    state.dragging = true;
    state.pointerX = event.clientX;
    state.pointerY = event.clientY;
    state.velocityYaw = 0;
    state.velocityPitch = 0;
    state.needsRender = true;

    stage.setPointerCapture?.(event.pointerId);
  });

  stage.addEventListener("pointermove", (event) => {
    if (!state.dragging) return;

    const dx = event.clientX - state.pointerX;
    const dy = event.clientY - state.pointerY;

    state.pointerX = event.clientX;
    state.pointerY = event.clientY;

    state.yaw += dx * 0.0062;
    state.pitch = clamp(state.pitch - dy * 0.0042, -0.60, 0.60);

    state.velocityYaw = dx * 0.0018;
    state.velocityPitch = -dy * 0.0012;
    state.needsRender = true;
  }, { passive: true });

  const release = (event) => {
    if (!state.dragging) return;
    state.dragging = false;
    state.needsRender = true;
    stage.releasePointerCapture?.(event.pointerId);
  };

  stage.addEventListener("pointerup", release);
  stage.addEventListener("pointercancel", release);
  stage.addEventListener("pointerleave", release);
}

function resetView() {
  state.yaw = 0.24;
  state.pitch = -0.08;
  state.velocityYaw = 0;
  state.velocityPitch = 0;
  state.needsRender = true;
}

function setBody(bodyKey) {
  if (!BODY_CONFIG[bodyKey]) return;

  state.body = bodyKey;
  buildMaterial(bodyKey);
  resetView();

  const config = BODY_CONFIG[bodyKey];

  document.querySelectorAll("[data-body]").forEach((button) => {
    button.setAttribute("aria-selected", button.dataset.body === bodyKey ? "true" : "false");
  });

  const stage = document.querySelector("[data-globe-selector-stage]");
  if (stage) stage.dataset.selectedBody = bodyKey;

  const title = document.querySelector("[data-body-title]");
  if (title) title.textContent = config.title;

  const subtitle = document.querySelector("[data-body-subtitle]");
  if (subtitle) subtitle.textContent = config.subtitle;

  const open = document.querySelector("[data-open-body]");
  if (open) {
    open.href = config.href;
    open.textContent = config.openText;
  }
}

function setMode(mode) {
  state.mode = mode;
  state.needsRender = true;

  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.setAttribute("aria-selected", button.dataset.mode === mode ? "true" : "false");
  });
}

function markRoute() {
  const root = document.documentElement.dataset;
  const body = document.body.dataset;

  const markers = {
    globeGatewayStatus: "screenshot-baseline-rebuilt",
    globeGatewayAuthority: "true",
    visualScaleAuthority: "true",
    runtimeStabilized: "true",
    mobileStageLayoutGovernor: "true",
    protectedVerticalBands: "true",
    cinematicMaterialRestored: "true",
    screenshotBaselineRebuild: "true",
    proceduralBlobPrimary: "false",
    opaqueGlobeBody: "true",
    stripSamplingRenderer: "false",
    blockTileLandRender: "false",
    diamondInstrument: "false",
    earthRecord: "false",
    materialSource: "screenshot-baseline-rebuild:v8"
  };

  Object.entries(markers).forEach(([key, value]) => {
    root[key] = value;
    body[key] = value;
  });
}

function protectGatewayIdentity() {
  const title = document.querySelector("title");
  if (title && !/Globe Showcase/i.test(title.textContent || "")) {
    title.textContent = "Globe Showcase · Diamond Gate Bridge";
  }

  const h1 = document.querySelector("h1");
  if (h1 && /Earth is the real-world reference body/i.test(h1.textContent || "")) {
    h1.textContent = "Choose the world body you meant to open.";
  }
}

function bindControls() {
  document.querySelectorAll("[data-body]").forEach((button) => {
    button.addEventListener("click", () => setBody(button.dataset.body));
  });

  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });

  const reset = document.querySelector("[data-reset-view]");
  if (reset) reset.addEventListener("click", resetView);
}

function warmMaterials() {
  Object.keys(BODY_CONFIG).forEach((key) => buildMaterial(key));
}

function warmInitialFrames(canvas) {
  const metrics = getLayoutMetrics(canvas.width || 390, canvas.height || 700);
  Object.keys(BODY_CONFIG).forEach((key) => {
    getCinematicFrame(key, metrics.radius || 150, 0.24, -0.08);
  });
}

function initGlobeSelector() {
  markRoute();
  protectGatewayIdentity();
  warmMaterials();

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
  warmInitialFrames(canvas);
  render(canvas, ctx);

  if (!state.raf) {
    state.raf = requestAnimationFrame((time) => step(time, canvas, ctx));
  }

  window.DGBGlobeSelector = Object.freeze({
    ...GLOBE_SELECTOR_STATE,
    status() {
      return Object.freeze({
        ...GLOBE_SELECTOR_STATE,
        ready: true,
        selectedBody: state.body,
        mode: state.mode,
        gatewayAuthority: true,
        earthStandingInGateway: false,
        diamondMountedHere: false,
        runtimeStabilized: true,
        mobileStageLayoutGovernor: true,
        protectedVerticalBands: true,
        cinematicMaterialRestored: true,
        screenshotBaselineRebuild: true,
        proceduralBlobPrimary: false,
        opaqueGlobeBody: true,
        stripSamplingRenderer: false,
        blockTileLandRender: false,
        materialSource: `screenshot-baseline-rebuild:v8:${state.body}`,
        cacheKeys: Object.freeze(Object.keys(state.materialCache)),
        frameCacheSize: Object.keys(state.frameCache).length
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

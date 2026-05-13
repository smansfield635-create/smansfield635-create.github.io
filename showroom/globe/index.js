const FIBONACCI_SEQUENCE = Object.freeze([1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233]);
const RUNTIME_FIELD_SIZE = 256;
const TAU = Math.PI * 2;
const PHI = (1 + Math.sqrt(5)) / 2;
const MAX_DPR = 1.5;

const GLOBE_SELECTOR_STATE = Object.freeze({
  contract: "SHOWROOM_GLOBE_SATELLITE_PLANETARY_VIEW_RENEWAL_TNT_v9",
  previousContract: "SHOWROOM_GLOBE_SCREENSHOT_BASELINE_REBUILD_TNT_v8",
  route: "/showroom/globe/",
  role: "globe-system-gateway-selector",
  gatewayAuthority: true,
  visualScaleAuthority: true,
  satellitePlanetaryView: true,
  contractRenewal: true,
  fibonacciRuntime: true,
  lattice256Runtime: true,
  runtimeFieldSize: RUNTIME_FIELD_SIZE,
  fibonacciSequence: FIBONACCI_SEQUENCE,
  runtimeMotionLaw: "fibonacci-within-256-lattice",
  materialSource: "satellite-planetary-view:v9",
  opaqueGlobeBody: true,
  cartoonFallbackPrimary: false,
  verticalSplitDominant: false,
  twoSeasonRead: false,
  groundLevelBuildActive: false,
  diamondInstrument: false,
  publicReceiptsVisible: false,
  generatedImage: false,
  graphicBox: false,
  heavyRuntimeLoaded: false,
  childRoutes: Object.freeze({
    earth: "/showroom/globe/earth/",
    "h-earth": "/showroom/globe/h-earth/",
    audralia: "/showroom/globe/audralia/"
  })
});

const BODY_CONFIG = Object.freeze({
  earth: Object.freeze({
    key: "earth",
    title: "Earth",
    subtitle: "Reference Body · satellite planetary view",
    openText: "Open Earth",
    href: "/showroom/globe/earth/",
    palette: Object.freeze({
      ocean: [20, 96, 146],
      ocean2: [14, 68, 118],
      deep: [5, 20, 52],
      shelf: [72, 156, 178],
      land: [110, 128, 84],
      land2: [166, 154, 104],
      high: [218, 210, 166],
      ice: [226, 238, 240],
      cloud: [238, 246, 255],
      glow: [126, 194, 246]
    }),
    satellites: Object.freeze([
      { lat: 0.18, lon: -1.94, rx: 0.42, ry: 0.72, seed: 11, tone: "land" },
      { lat: -0.52, lon: -1.35, rx: 0.26, ry: 0.46, seed: 12, tone: "land" },
      { lat: 0.30, lon: 0.18, rx: 0.54, ry: 0.52, seed: 13, tone: "land" },
      { lat: -0.28, lon: 0.78, rx: 0.32, ry: 0.34, seed: 14, tone: "land" },
      { lat: 0.73, lon: -0.45, rx: 0.64, ry: 0.14, seed: 15, tone: "ice" }
    ])
  }),

  "h-earth": Object.freeze({
    key: "h-earth",
    title: "H-Earth",
    subtitle: "Hybrid Earth · satellite planetary view",
    openText: "Open H-Earth",
    href: "/showroom/globe/h-earth/",
    palette: Object.freeze({
      ocean: [38, 122, 116],
      ocean2: [22, 86, 96],
      deep: [4, 32, 42],
      shelf: [80, 170, 150],
      land: [145, 132, 78],
      land2: [196, 168, 86],
      high: [236, 214, 142],
      ice: [218, 238, 226],
      cloud: [226, 248, 238],
      glow: [152, 236, 190]
    }),
    satellites: Object.freeze([
      { lat: 0.08, lon: -1.62, rx: 0.56, ry: 0.74, seed: 31, tone: "land" },
      { lat: -0.36, lon: -0.60, rx: 0.38, ry: 0.50, seed: 32, tone: "land" },
      { lat: 0.28, lon: 0.76, rx: 0.50, ry: 0.54, seed: 33, tone: "land" },
      { lat: -0.56, lon: 1.48, rx: 0.30, ry: 0.28, seed: 34, tone: "land" },
      { lat: 0.69, lon: 2.10, rx: 0.44, ry: 0.18, seed: 35, tone: "land" }
    ])
  }),

  audralia: Object.freeze({
    key: "audralia",
    title: "Audralia",
    subtitle: "Constructed World · satellite planetary view",
    openText: "Open Audralia",
    href: "/showroom/globe/audralia/",
    palette: Object.freeze({
      ocean: [72, 76, 126],
      ocean2: [46, 48, 94],
      deep: [13, 12, 42],
      shelf: [108, 110, 154],
      land: [134, 91, 82],
      land2: [182, 122, 100],
      high: [226, 166, 138],
      ice: [220, 214, 238],
      cloud: [232, 226, 255],
      glow: [198, 160, 250]
    }),
    satellites: Object.freeze([
      { lat: -0.02, lon: -1.18, rx: 0.64, ry: 0.68, seed: 51, tone: "land" },
      { lat: 0.40, lon: 0.56, rx: 0.40, ry: 0.36, seed: 52, tone: "land" },
      { lat: -0.46, lon: 1.34, rx: 0.34, ry: 0.28, seed: 53, tone: "land" },
      { lat: 0.76, lon: -2.26, rx: 0.40, ry: 0.16, seed: 54, tone: "land" }
    ])
  })
});

const state = {
  body: "earth",
  mode: "auto",
  yaw: 0.18,
  pitch: -0.06,
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
  materials: Object.create(null),
  frames: Object.create(null),
  runtimeAddress: 0,
  fibonacciBand: 8
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

function makeCanvas(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
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

function resolveRuntimeAddress() {
  const bodyIndex = Object.keys(BODY_CONFIG).indexOf(state.body);
  const yawBucket = Math.round((((state.yaw % TAU) + TAU) % TAU) / TAU * 64) % 64;
  const pitchBucket = Math.round(((state.pitch + 0.6) / 1.2) * 15);
  const modeBucket = state.mode === "stable" ? 0 : state.mode === "soft" ? 1 : 2;
  state.runtimeAddress = (bodyIndex * 64 + yawBucket + pitchBucket * 4 + modeBucket) % RUNTIME_FIELD_SIZE;
  return state.runtimeAddress;
}

function fibonacciBandForMode() {
  if (state.mode === "stable") return 1;
  if (state.mode === "soft") return 21;
  return 13;
}

function buildMaterial(bodyKey) {
  if (state.materials[bodyKey]) return state.materials[bodyKey];

  const config = BODY_CONFIG[bodyKey] || BODY_CONFIG.earth;
  const material = {
    key: bodyKey,
    source: `satellite-planetary-view:v9:${bodyKey}`,
    surface: [],
    clouds: [],
    ridges: []
  };

  for (const form of config.satellites) {
    material.surface.push(Object.freeze(form));
  }

  for (let i = 0; i < 26; i += 1) {
    material.clouds.push(Object.freeze({
      lat: seededSigned(i, bodyKey.length + 100) * 0.88,
      lon: seededSigned(i, bodyKey.length + 101) * Math.PI,
      rx: 0.08 + seededUnit(i, bodyKey.length + 102) * 0.16,
      ry: 0.012 + seededUnit(i, bodyKey.length + 103) * 0.030,
      angle: seededUnit(i, bodyKey.length + 104) * TAU,
      alpha: 0.035 + seededUnit(i, bodyKey.length + 105) * 0.055
    }));
  }

  for (let i = 0; i < 30; i += 1) {
    const points = [];
    const baseLat = seededSigned(i, bodyKey.length + 200) * 0.94;
    const baseLon = seededSigned(i, bodyKey.length + 201) * Math.PI;
    const length = 0.16 + seededUnit(i, bodyKey.length + 202) * 0.34;
    const bend = seededSigned(i, bodyKey.length + 203) * 0.10;

    for (let j = 0; j < 8; j += 1) {
      const t = j / 7;
      points.push(Object.freeze({
        lat: clamp(baseLat + (t - 0.5) * length * 0.58 + Math.sin(t * Math.PI) * bend, -1.35, 1.35),
        lon: baseLon + (t - 0.5) * length
      }));
    }

    material.ridges.push(Object.freeze({
      points: Object.freeze(points),
      alpha: 0.08 + seededUnit(i, bodyKey.length + 204) * 0.10,
      width: 0.003 + seededUnit(i, bodyKey.length + 205) * 0.006
    }));
  }

  state.materials[bodyKey] = Object.freeze({
    key: material.key,
    source: material.source,
    surface: Object.freeze(material.surface),
    clouds: Object.freeze(material.clouds),
    ridges: Object.freeze(material.ridges)
  });

  return state.materials[bodyKey];
}

function project(lat, lon, yaw, pitch, cx, cy, radius) {
  const adjustedLon = lon + yaw;
  const cosLat = Math.cos(lat);
  const x0 = Math.cos(adjustedLon) * cosLat;
  const y0 = Math.sin(lat);
  const z0 = Math.sin(adjustedLon) * cosLat;

  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const y1 = y0 * cp - z0 * sp;
  const z1 = y0 * sp + z0 * cp;

  const visible = z1 > -0.12;
  const depth = clamp((z1 + 1) * 0.5, 0, 1);
  const perspective = 0.94 + depth * 0.10;

  return Object.freeze({
    x: cx + x0 * radius * perspective,
    y: cy - y1 * radius * perspective,
    z: z1,
    depth,
    visible
  });
}

function frameBucket(value, count) {
  return ((Math.round((((value % TAU) + TAU) % TAU) / TAU * count) % count) + count) % count;
}

function getFrameKey(bodyKey, radius, yaw, pitch) {
  const fibonacciBand = fibonacciBandForMode();
  const yawBuckets = state.mode === "stable" ? 34 : state.mode === "soft" ? 89 : 55;
  const pitchBuckets = 13;
  const radiusBucket = Math.round(radius / 10) * 10;
  const yawBucket = frameBucket(yaw, yawBuckets);
  const pitchBucket = Math.round(((clamp(pitch, -0.60, 0.60) + 0.60) / 1.20) * (pitchBuckets - 1));
  return `${bodyKey}:${radiusBucket}:${yawBuckets}:${yawBucket}:${pitchBucket}:${fibonacciBand}`;
}

function bucketPose(yaw, pitch) {
  const yawBuckets = state.mode === "stable" ? 34 : state.mode === "soft" ? 89 : 55;
  const pitchBuckets = 13;
  const yawBucket = frameBucket(yaw, yawBuckets);
  const pitchBucket = Math.round(((clamp(pitch, -0.60, 0.60) + 0.60) / 1.20) * (pitchBuckets - 1));

  return Object.freeze({
    yaw: (yawBucket / yawBuckets) * TAU,
    pitch: (pitchBucket / (pitchBuckets - 1)) * 1.20 - 0.60
  });
}

function getFrame(bodyKey, radius, yaw, pitch) {
  const key = getFrameKey(bodyKey, radius, yaw, pitch);
  if (state.frames[key]) return state.frames[key];

  const frame = buildFrame(bodyKey, radius, yaw, pitch);
  state.frames[key] = frame;
  trimFrames();
  return frame;
}

function trimFrames() {
  const keys = Object.keys(state.frames);
  if (keys.length <= 55) return;

  for (let i = 0; i < keys.length - 55; i += 1) {
    delete state.frames[keys[i]];
  }
}

function buildFrame(bodyKey, radius, yaw, pitch) {
  const config = BODY_CONFIG[bodyKey] || BODY_CONFIG.earth;
  const material = buildMaterial(bodyKey);
  const pose = bucketPose(yaw, pitch);
  const pad = Math.ceil(radius * 0.28);
  const size = Math.ceil(radius * 2 + pad * 2);
  const canvas = makeCanvas(size, size);
  const ctx = canvas.getContext("2d", { alpha: true });
  const cx = size * 0.5;
  const cy = size * 0.5;

  drawOuterRim(ctx, config, cx, cy, radius);
  drawOpaquePlanet(ctx, config, cx, cy, radius);
  drawSatelliteSurface(ctx, config, material, cx, cy, radius, pose.yaw, pose.pitch);
  drawUnifiedSatelliteClouds(ctx, config, material, cx, cy, radius, pose.yaw, pose.pitch);
  drawSatelliteLighting(ctx, config, cx, cy, radius);
  drawAtmosphericRim(ctx, config, cx, cy, radius);

  return Object.freeze({
    source: `satellite-planetary-view:v9:${bodyKey}`,
    canvas,
    size,
    radius,
    ready: true
  });
}

function drawOuterRim(ctx, config, cx, cy, radius) {
  const glow = ctx.createRadialGradient(cx, cy, radius * 0.85, cx, cy, radius * 1.34);
  glow.addColorStop(0.00, "rgba(255,255,255,0)");
  glow.addColorStop(0.66, rgb(config.palette.glow, 0.13));
  glow.addColorStop(1.00, "rgba(255,255,255,0)");

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.34, 0, TAU);
  ctx.fill();
  ctx.restore();
}

function drawOpaquePlanet(ctx, config, cx, cy, radius) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.clip();

  const base = ctx.createRadialGradient(cx, cy, radius * 0.05, cx, cy, radius * 1.04);
  base.addColorStop(0.00, rgb(config.palette.ocean, 1));
  base.addColorStop(0.45, rgb(mixColor(config.palette.ocean, config.palette.ocean2, 0.36), 1));
  base.addColorStop(0.76, rgb(config.palette.ocean2, 1));
  base.addColorStop(1.00, rgb(config.palette.deep, 1));

  ctx.fillStyle = base;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  for (let i = 0; i < 22; i += 1) {
    const angle = seededUnit(i, config.key.length + 310) * TAU;
    const distance = seededUnit(i, config.key.length + 311) * radius * 0.88;
    const x = cx + Math.cos(angle) * distance;
    const y = cy + Math.sin(angle) * distance;
    const r = radius * (0.04 + seededUnit(i, config.key.length + 312) * 0.12);
    const patch = ctx.createRadialGradient(x, y, 0, x, y, r);
    patch.addColorStop(0, rgb(config.palette.shelf, 0.18));
    patch.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = patch;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
  }

  ctx.restore();
}

function drawSatelliteSurface(ctx, config, material, cx, cy, radius, yaw, pitch) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.clip();

  for (const form of material.surface) {
    const p = project(form.lat, form.lon, yaw, pitch, cx, cy, radius);
    if (!p.visible) continue;

    const visible = clamp((p.z + 0.12) / 1.12, 0, 1);
    const rx = form.rx * radius * (0.70 + p.depth * 0.22);
    const ry = form.ry * radius * (0.60 + p.depth * 0.18);
    const colorA = form.tone === "ice" ? config.palette.ice : config.palette.land;
    const colorB = form.tone === "ice" ? config.palette.cloud : config.palette.land2;
    const colorC = form.tone === "ice" ? config.palette.ice : config.palette.high;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((form.seed * 0.37 + yaw * 0.05) % TAU);

    const land = ctx.createRadialGradient(-rx * 0.18, -ry * 0.26, Math.max(3, rx * 0.06), 0, 0, Math.max(rx, ry));
    land.addColorStop(0.00, rgb(mixColor(colorB, colorC, 0.28), 0.86 * visible));
    land.addColorStop(0.45, rgb(colorA, 0.82 * visible));
    land.addColorStop(0.82, rgb(mixColor(colorA, config.palette.deep, 0.28), 0.76 * visible));
    land.addColorStop(1.00, "rgba(255,255,255,0)");

    ctx.fillStyle = land;
    drawOrganicEllipse(ctx, rx, ry, form.seed);
    ctx.fill();

    ctx.strokeStyle = rgb(config.palette.shelf, 0.20 * visible);
    ctx.lineWidth = Math.max(0.7, radius * 0.0028);
    drawOrganicEllipse(ctx, rx * 0.98, ry * 0.98, form.seed);
    ctx.stroke();

    ctx.restore();
  }

  drawSatelliteRidges(ctx, config, material, cx, cy, radius, yaw, pitch);

  ctx.restore();
}

function drawOrganicEllipse(ctx, rx, ry, seed) {
  ctx.beginPath();
  for (let i = 0; i <= 80; i += 1) {
    const t = (i / 80) * TAU;
    const wobble = 1
      + 0.10 * Math.sin(t * 3 + seed * 0.29)
      + 0.06 * Math.cos(t * 5 - seed * 0.17)
      + 0.035 * Math.sin(t * 8 + seed * 0.11);
    const x = Math.cos(t) * rx * wobble;
    const y = Math.sin(t) * ry * wobble;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function drawSatelliteRidges(ctx, config, material, cx, cy, radius, yaw, pitch) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  for (const ridge of material.ridges) {
    const points = ridge.points.map((point) => project(point.lat, point.lon, yaw, pitch, cx, cy, radius)).filter((point) => point.visible);
    if (points.length < 3) continue;

    const depth = points.reduce((sum, point) => sum + point.depth, 0) / points.length;
    ctx.strokeStyle = rgb(config.palette.high, ridge.alpha * depth);
    ctx.lineWidth = Math.max(0.55, radius * ridge.width);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();

    points.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });

    ctx.stroke();
  }

  ctx.restore();
}

function drawUnifiedSatelliteClouds(ctx, config, material, cx, cy, radius, yaw, pitch) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.clip();
  ctx.globalCompositeOperation = "screen";

  for (const cloud of material.clouds) {
    const p = project(cloud.lat, cloud.lon, yaw, pitch, cx, cy, radius);
    if (!p.visible) continue;

    const visible = clamp((p.z + 0.12) / 1.12, 0, 1);
    const rx = cloud.rx * radius;
    const ry = cloud.ry * radius;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(cloud.angle);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0.00, rgb(config.palette.cloud, cloud.alpha * visible));
    g.addColorStop(0.55, rgb(config.palette.cloud, cloud.alpha * 0.26 * visible));
    g.addColorStop(1.00, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

function drawSatelliteLighting(ctx, config, cx, cy, radius) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.clip();

  const light = ctx.createRadialGradient(cx - radius * 0.22, cy - radius * 0.24, radius * 0.05, cx, cy, radius * 1.08);
  light.addColorStop(0.00, "rgba(255,255,255,0.13)");
  light.addColorStop(0.36, "rgba(255,255,255,0.024)");
  light.addColorStop(0.76, "rgba(0,0,0,0.10)");
  light.addColorStop(1.00, "rgba(0,0,0,0.34)");
  ctx.fillStyle = light;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  ctx.restore();
}

function drawAtmosphericRim(ctx, config, cx, cy, radius) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const rim = ctx.createRadialGradient(cx, cy, radius * 0.86, cx, cy, radius * 1.10);
  rim.addColorStop(0.00, "rgba(255,255,255,0)");
  rim.addColorStop(0.58, rgb(config.palette.glow, 0.09));
  rim.addColorStop(0.82, rgb(config.palette.cloud, 0.18));
  rim.addColorStop(1.00, "rgba(255,255,255,0)");

  ctx.fillStyle = rim;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.10, 0, TAU);
  ctx.fill();

  ctx.strokeStyle = rgb(config.palette.cloud, 0.20);
  ctx.lineWidth = Math.max(1, radius * 0.0048);
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.003, 0, TAU);
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
  const halo = ctx.createRadialGradient(
    metrics.globeCenterX,
    metrics.globeCenterY,
    metrics.radius * 0.24,
    metrics.globeCenterX,
    metrics.globeCenterY,
    metrics.radius * 2.04
  );
  halo.addColorStop(0, rgb(config.palette.glow, 0.10));
  halo.addColorStop(0.42, rgb(config.palette.glow, 0.045));
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

function render(canvas, ctx) {
  const config = BODY_CONFIG[state.body] || BODY_CONFIG.earth;
  const width = canvas.width;
  const height = canvas.height;
  const metrics = getLayoutMetrics(width, height);
  const frame = getFrame(state.body, metrics.radius, state.yaw, state.pitch);

  ctx.clearRect(0, 0, width, height);
  drawStageBackground(ctx, width, height, config);

  const x = metrics.globeCenterX - frame.size * 0.5;
  const y = metrics.globeCenterY - frame.size * 0.5;

  ctx.drawImage(frame.canvas, x, y);

  state.needsRender = false;
}

function updateMotion(dt) {
  let changed = false;
  const fibonacciBand = fibonacciBandForMode();
  state.fibonacciBand = fibonacciBand;

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
      state.yaw += dt * (1 / 34);
    }

    changed = changed || Math.abs(priorYaw - state.yaw) > 0.00001 || Math.abs(priorPitch - state.pitch) > 0.00001;
  }

  resolveRuntimeAddress();

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

    const sensitivity = state.mode === "stable" ? 0.0048 : 0.0062;

    state.yaw += dx * sensitivity;
    state.pitch = clamp(state.pitch - dy * 0.0040, -0.60, 0.60);

    state.velocityYaw = dx * 0.0018;
    state.velocityPitch = -dy * 0.0011;
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
  state.yaw = 0.18;
  state.pitch = -0.06;
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
  const markers = {
    globeGatewayStatus: "satellite-planetary-view-renewed",
    globeGatewayAuthority: "true",
    visualScaleAuthority: "true",
    satellitePlanetaryView: "true",
    contractRenewal: "true",
    fibonacciRuntime: "true",
    lattice256Runtime: "true",
    runtimeFieldSize: "256",
    runtimeMotionLaw: "fibonacci-within-256-lattice",
    materialSource: "satellite-planetary-view:v9",
    opaqueGlobeBody: "true",
    cartoonFallbackPrimary: "false",
    verticalSplitDominant: "false",
    twoSeasonRead: "false",
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
    getFrame(key, metrics.radius || 150, 0.18, -0.06);
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
      resolveRuntimeAddress();

      return Object.freeze({
        ...GLOBE_SELECTOR_STATE,
        ready: true,
        selectedBody: state.body,
        mode: state.mode,
        yaw: state.yaw,
        pitch: state.pitch,
        runtimeAddress: state.runtimeAddress,
        fibonacciBand: state.fibonacciBand,
        frameCacheSize: Object.keys(state.frames).length,
        materialCacheKeys: Object.freeze(Object.keys(state.materials)),
        materialSource: "satellite-planetary-view:v9",
        currentMaterialSource: `satellite-planetary-view:v9:${state.body}`,
        satellitePlanetaryView: true,
        contractRenewal: true,
        fibonacciRuntime: true,
        lattice256Runtime: true,
        runtimeFieldSize: RUNTIME_FIELD_SIZE,
        fibonacciSequence: FIBONACCI_SEQUENCE,
        runtimeMotionLaw: "fibonacci-within-256-lattice",
        opaqueGlobeBody: true,
        cartoonFallbackPrimary: false,
        verticalSplitDominant: false,
        twoSeasonRead: false,
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

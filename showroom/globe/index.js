const GLOBE_SELECTOR_STATE = Object.freeze({
  contract: "SHOWROOM_GLOBE_VISUAL_MATERIAL_UPGRADE_TNT_v6",
  previousContract: "SHOWROOM_GLOBE_MOBILE_STAGE_LAYOUT_GOVERNOR_TNT_v5",
  route: "/showroom/globe/",
  role: "globe-system-gateway-selector",
  gatewayAuthority: true,
  visualScaleAuthority: true,
  diamondInstrument: false,
  runtimeStabilized: true,
  surfaceCacheEnabled: true,
  mobileStageLayoutGovernor: true,
  protectedVerticalBands: true,
  visualMaterialUpgrade: true,
  blockTileLandRender: false,
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
    subtitle: "Reference Body · public selector runtime",
    openText: "Open Earth",
    href: "/showroom/globe/earth/",
    water: [27, 92, 138],
    shelf: [61, 144, 170],
    deep: [5, 22, 52],
    polar: [224, 237, 238],
    land: [150, 148, 104],
    land2: [82, 124, 88],
    terrain: [190, 178, 126],
    highland: [210, 199, 154],
    coast: [184, 205, 154],
    cloud: [232, 244, 255],
    glow: [125, 190, 245],
    label: "Reference Body",
    material: Object.freeze({
      oceanContrast: 0.52,
      coastStrength: 0.46,
      landOpacity: 0.78,
      cloudOpacity: 0.20,
      atmosphere: 0.30
    }),
    continents: Object.freeze([
      { lat: 0.18, lon: -1.96, rx: 0.46, ry: 0.86, seed: 11, twist: -0.32, edge: 0.20 },
      { lat: -0.54, lon: -1.36, rx: 0.30, ry: 0.50, seed: 12, twist: 0.18, edge: 0.24 },
      { lat: 0.33, lon: 0.22, rx: 0.54, ry: 0.62, seed: 13, twist: 0.28, edge: 0.22 },
      { lat: -0.28, lon: 0.74, rx: 0.37, ry: 0.39, seed: 14, twist: -0.14, edge: 0.22 },
      { lat: -0.72, lon: 2.08, rx: 0.22, ry: 0.18, seed: 15, twist: 0.44, edge: 0.24 },
      { lat: 0.75, lon: -0.44, rx: 0.66, ry: 0.18, seed: 16, twist: 0.08, edge: 0.18 }
    ]),
    islands: Object.freeze([
      { lat: -0.10, lon: 1.36, rx: 0.10, ry: 0.08, seed: 81, twist: 0.2, edge: 0.24 },
      { lat: -0.34, lon: 1.62, rx: 0.08, ry: 0.06, seed: 82, twist: -0.4, edge: 0.26 },
      { lat: 0.18, lon: 2.26, rx: 0.09, ry: 0.05, seed: 83, twist: 0.1, edge: 0.22 },
      { lat: -0.86, lon: -0.14, rx: 0.18, ry: 0.05, seed: 84, twist: 0.0, edge: 0.16 }
    ])
  }),

  "h-earth": Object.freeze({
    key: "h-earth",
    title: "H-Earth",
    subtitle: "Hybrid Earth · private inspection gateway",
    openText: "Open H-Earth",
    href: "/showroom/globe/h-earth/",
    water: [34, 104, 120],
    shelf: [70, 160, 150],
    deep: [6, 30, 54],
    polar: [221, 238, 226],
    land: [185, 158, 88],
    land2: [72, 126, 106],
    terrain: [220, 196, 126],
    highland: [234, 217, 162],
    coast: [206, 224, 158],
    cloud: [226, 248, 238],
    glow: [154, 236, 190],
    label: "Hybrid Earth",
    material: Object.freeze({
      oceanContrast: 0.58,
      coastStrength: 0.50,
      landOpacity: 0.80,
      cloudOpacity: 0.18,
      atmosphere: 0.32
    }),
    continents: Object.freeze([
      { lat: 0.10, lon: -1.65, rx: 0.58, ry: 0.84, seed: 31, twist: -0.24, edge: 0.24 },
      { lat: -0.38, lon: -0.62, rx: 0.40, ry: 0.56, seed: 32, twist: 0.36, edge: 0.20 },
      { lat: 0.30, lon: 0.76, rx: 0.52, ry: 0.60, seed: 33, twist: -0.16, edge: 0.22 },
      { lat: -0.58, lon: 1.54, rx: 0.32, ry: 0.30, seed: 34, twist: 0.18, edge: 0.22 },
      { lat: 0.70, lon: 2.14, rx: 0.48, ry: 0.20, seed: 35, twist: -0.06, edge: 0.18 }
    ]),
    islands: Object.freeze([
      { lat: 0.04, lon: 1.68, rx: 0.12, ry: 0.08, seed: 91, twist: 0.4, edge: 0.24 },
      { lat: -0.20, lon: 1.90, rx: 0.09, ry: 0.06, seed: 92, twist: -0.2, edge: 0.26 },
      { lat: 0.52, lon: -2.20, rx: 0.14, ry: 0.07, seed: 93, twist: 0.1, edge: 0.20 },
      { lat: -0.78, lon: 0.42, rx: 0.16, ry: 0.05, seed: 94, twist: 0.0, edge: 0.18 }
    ])
  }),

  audralia: Object.freeze({
    key: "audralia",
    title: "Audralia",
    subtitle: "Constructed World · public selector runtime",
    openText: "Open Audralia",
    href: "/showroom/globe/audralia/",
    water: [54, 60, 96],
    shelf: [95, 101, 138],
    deep: [11, 14, 42],
    polar: [220, 214, 238],
    land: [154, 112, 94],
    land2: [82, 66, 102],
    terrain: [190, 140, 120],
    highland: [218, 170, 148],
    coast: [210, 180, 162],
    cloud: [232, 226, 255],
    glow: [194, 160, 248],
    label: "Constructed World",
    material: Object.freeze({
      oceanContrast: 0.62,
      coastStrength: 0.54,
      landOpacity: 0.82,
      cloudOpacity: 0.16,
      atmosphere: 0.34
    }),
    continents: Object.freeze([
      { lat: -0.02, lon: -1.18, rx: 0.68, ry: 0.76, seed: 51, twist: 0.22, edge: 0.24 },
      { lat: 0.42, lon: 0.56, rx: 0.42, ry: 0.39, seed: 52, twist: -0.34, edge: 0.28 },
      { lat: -0.48, lon: 1.36, rx: 0.36, ry: 0.30, seed: 53, twist: 0.28, edge: 0.22 },
      { lat: 0.78, lon: -2.28, rx: 0.42, ry: 0.18, seed: 54, twist: 0.10, edge: 0.18 }
    ]),
    islands: Object.freeze([
      { lat: 0.02, lon: 1.84, rx: 0.12, ry: 0.08, seed: 101, twist: 0.2, edge: 0.24 },
      { lat: -0.22, lon: 2.12, rx: 0.09, ry: 0.06, seed: 102, twist: -0.3, edge: 0.26 },
      { lat: 0.48, lon: -2.86, rx: 0.13, ry: 0.06, seed: 103, twist: 0.1, edge: 0.22 },
      { lat: -0.82, lon: -0.28, rx: 0.18, ry: 0.05, seed: 104, twist: 0.0, edge: 0.18 }
    ])
  })
});

const TAU = Math.PI * 2;
const PHI = (1 + Math.sqrt(5)) / 2;
const MAX_DPR = 1.5;

const state = {
  body: "earth",
  mode: "auto",
  yaw: 0.24,
  pitch: -0.10,
  velocityYaw: 0,
  velocityPitch: 0,
  dragging: false,
  pointerX: 0,
  pointerY: 0,
  lastTap: 0,
  lastTime: 0,
  phase: 0,
  raf: 0,
  dpr: 1,
  width: 0,
  height: 0,
  needsRender: true,
  surfaceCache: Object.create(null),
  activeCache: null
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
    width * (isMobile ? 0.305 : 0.345),
    available * (isMobile ? 0.445 : 0.49)
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

function makeBlobSamples(blob, sampleCount) {
  const points = [];
  const edge = blob.edge || 0.20;
  const twist = blob.twist || 0;

  for (let i = 0; i < sampleCount; i += 1) {
    const t = (i / sampleCount) * TAU;
    const wobbleA = 1 + edge * Math.sin(t * 3 + blob.seed * 0.41);
    const wobbleB = 1 + edge * 0.56 * Math.cos(t * 5 - blob.seed * 0.27);
    const wobbleC = 1 + edge * 0.34 * Math.sin(t * 7 + blob.seed * 0.13);
    const notch = 1 - edge * 0.42 * Math.max(0, Math.sin(t * 2.0 + blob.seed));
    const r = wobbleA * wobbleB * wobbleC * notch;

    const localX = Math.cos(t) * blob.rx * r;
    const localY = Math.sin(t) * blob.ry * r;

    const lat = clamp(
      blob.lat + localX * Math.sin(twist) + localY * Math.cos(twist),
      -1.42,
      1.42
    );

    const lon = blob.lon + localX * Math.cos(twist) - localY * Math.sin(twist);

    points.push(Object.freeze({ lat, lon }));
  }

  return Object.freeze(points);
}

function makeVeinSamples(config) {
  const veins = [];

  for (let i = 0; i < 20; i += 1) {
    const lat = -0.95 + seededUnit(i, config.key.length) * 1.9;
    const lon = -Math.PI + seededUnit(i, config.key.length + 4) * TAU;
    const length = 0.14 + seededUnit(i, 9) * 0.26;
    const bend = -0.08 + seededUnit(i, 10) * 0.16;
    const points = [];

    for (let j = 0; j < 9; j += 1) {
      const t = j / 8;
      points.push(Object.freeze({
        lat: clamp(lat + (t - 0.5) * length + Math.sin(t * Math.PI) * bend, -1.42, 1.42),
        lon: lon + (t - 0.5) * length * 0.75
      }));
    }

    veins.push(Object.freeze(points));
  }

  return Object.freeze(veins);
}

function makeOceanSamples(config) {
  const samples = [];

  for (let i = 0; i < 30; i += 1) {
    samples.push(Object.freeze({
      lat: -1.05 + seededUnit(i, 21) * 2.10,
      lon: -Math.PI + seededUnit(i, 22) * TAU,
      sizeSeed: 0.020 + seededUnit(i, 23) * 0.052,
      alphaSeed: 0.035 + seededUnit(i, 24) * 0.050
    }));
  }

  return Object.freeze(samples);
}

function makeCloudSamples(config) {
  const samples = [];

  for (let i = 0; i < 12; i += 1) {
    samples.push(Object.freeze({
      lat: -0.72 + seededUnit(i, config.key.length + 31) * 1.44,
      lon: -Math.PI + seededUnit(i, config.key.length + 32) * TAU,
      widthSeed: 0.08 + seededUnit(i, 33) * 0.16,
      heightSeed: 0.012 + seededUnit(i, 34) * 0.026,
      alphaSeed: 0.035 + seededUnit(i, 35) * 0.070,
      phaseSeed: i * PHI
    }));
  }

  return Object.freeze(samples);
}

function makePolarSamples(config) {
  return Object.freeze([
    Object.freeze({ lat: 1.24, lon: 0, rx: 0.70, ry: 0.12, seed: 301, twist: 0.0, edge: 0.10 }),
    Object.freeze({ lat: -1.24, lon: 0, rx: 0.58, ry: 0.10, seed: 302, twist: 0.0, edge: 0.10 })
  ]);
}

function buildSurfaceCacheForBody(config) {
  const continents = config.continents.map((blob) => Object.freeze({
    source: blob,
    shelf: makeBlobSamples(blob, 104),
    land: makeBlobSamples(blob, 122),
    terrain: makeBlobSamples(blob, 72),
    coast: makeBlobSamples(blob, 84)
  }));

  const islands = config.islands.map((blob) => Object.freeze({
    source: blob,
    shelf: makeBlobSamples(blob, 76),
    land: makeBlobSamples(blob, 76),
    terrain: makeBlobSamples(blob, 48),
    coast: makeBlobSamples(blob, 52)
  }));

  const polar = makePolarSamples(config).map((blob) => Object.freeze({
    source: blob,
    shelf: makeBlobSamples(blob, 72),
    land: makeBlobSamples(blob, 72),
    terrain: makeBlobSamples(blob, 48),
    coast: makeBlobSamples(blob, 48)
  }));

  return Object.freeze({
    key: config.key,
    continents: Object.freeze(continents),
    islands: Object.freeze(islands),
    polar,
    veins: makeVeinSamples(config),
    ocean: makeOceanSamples(config),
    clouds: makeCloudSamples(config)
  });
}

function getSurfaceCache(bodyKey) {
  if (!state.surfaceCache[bodyKey]) {
    state.surfaceCache[bodyKey] = buildSurfaceCacheForBody(BODY_CONFIG[bodyKey]);
  }

  return state.surfaceCache[bodyKey];
}

function activateSurfaceCache(bodyKey) {
  state.activeCache = getSurfaceCache(bodyKey);
  state.needsRender = true;
}

function globePoint(lat, lon, radius) {
  const cosLat = Math.cos(lat);
  return {
    x: Math.cos(lon) * cosLat * radius,
    y: Math.sin(lat) * radius,
    z: Math.sin(lon) * cosLat * radius,
    lat,
    lon
  };
}

function rotatePoint(point) {
  const cy = Math.cos(state.yaw);
  const sy = Math.sin(state.yaw);
  const cp = Math.cos(state.pitch);
  const sp = Math.sin(state.pitch);

  const x1 = point.x * cy + point.z * sy;
  const z1 = -point.x * sy + point.z * cy;

  const y2 = point.y * cp - z1 * sp;
  const z2 = point.y * sp + z1 * cp;

  return { x: x1, y: y2, z: z2, lat: point.lat, lon: point.lon };
}

function projectPoint(point, cx, cy) {
  const rotated = rotatePoint(point);
  const camera = 3.5;
  const perspective = camera / (camera - rotated.z * 0.0028);

  return {
    x: cx + rotated.x * perspective,
    y: cy + rotated.y * perspective,
    z: rotated.z,
    p: perspective,
    lat: point.lat,
    lon: point.lon
  };
}

function projectSample(sample, radius, cx, cy, lonOffset = 0) {
  return projectPoint(globePoint(sample.lat, sample.lon + lonOffset, radius), cx, cy);
}

function visibleRatio(points, radius) {
  let visible = 0;

  for (const point of points) {
    if (point.z > -radius * 0.13) visible += 1;
  }

  return visible / Math.max(1, points.length);
}

function drawSmoothPath(ctx, points) {
  if (!points.length) return;

  ctx.beginPath();

  const first = points[0];
  ctx.moveTo(first.x, first.y);

  for (let i = 0; i < points.length; i += 1) {
    const current = points[i];
    const next = points[(i + 1) % points.length];
    const midX = (current.x + next.x) * 0.5;
    const midY = (current.y + next.y) * 0.5;
    ctx.quadraticCurveTo(current.x, current.y, midX, midY);
  }

  ctx.closePath();
}

function drawBackground(ctx, width, height, config) {
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, "rgba(3, 10, 22, 0.97)");
  bg.addColorStop(0.52, "rgba(7, 18, 36, 0.98)");
  bg.addColorStop(1, "rgba(2, 7, 16, 1)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const halo = ctx.createRadialGradient(
    width * 0.5,
    height * 0.43,
    width * 0.04,
    width * 0.5,
    height * 0.45,
    width * 0.56
  );

  halo.addColorStop(0, rgb(config.glow, 0.12));
  halo.addColorStop(0.42, rgb(config.glow, 0.060));
  halo.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, width, height);
}

function drawStars(ctx, width, height) {
  ctx.save();

  for (let i = 0; i < 52; i += 1) {
    const x = seededUnit(i, 1) * width;
    const y = seededUnit(i, 2) * height;
    const alpha = 0.06 + seededUnit(i, 3) * 0.16;
    const size = i % 13 === 0 ? 6 : i % 5 === 0 ? 3 : 1.1;

    ctx.strokeStyle = `rgba(235,244,255,${alpha})`;
    ctx.lineWidth = Math.max(1, width * 0.0009);
    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x + size, y);
    ctx.moveTo(x, y - size);
    ctx.lineTo(x, y + size);
    ctx.stroke();
  }

  ctx.restore();
}

function drawLandShape(ctx, shape, radius, cx, cy, config, layer, overrideColor = null) {
  const samples = shape[layer];
  const projected = samples.map((sample) => projectSample(sample, radius, cx, cy));
  const ratio = visibleRatio(projected, radius);

  if (ratio < 0.20) return;

  const front = clamp(ratio, 0, 1);
  const light = clamp(0.48 + front * 0.36 + Math.sin(shape.source.seed + state.phase * 0.08) * 0.018, 0.36, 0.92);
  const landColor = overrideColor || mixColor(config.land2, config.land, light);
  const terrainColor = overrideColor || mixColor(config.land, config.highland, 0.52);
  const material = config.material || {};

  ctx.save();

  if (layer === "shelf") {
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = (0.52 + (material.coastStrength || 0.45) * 0.22) * front;
    ctx.shadowColor = rgb(config.shelf, 0.18);
    ctx.shadowBlur = radius * 0.012;
    ctx.fillStyle = rgb(config.shelf, 0.10);
    ctx.strokeStyle = rgb(mixColor(config.shelf, [255, 255, 255], 0.16), 0.24);
    ctx.lineWidth = Math.max(0.85, radius * 0.0052);
    drawSmoothPath(ctx, projected);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    return;
  }

  if (layer === "terrain") {
    ctx.globalCompositeOperation = "soft-light";
    ctx.globalAlpha = 0.26 * front;
    ctx.fillStyle = rgb(terrainColor, 0.34);
    drawSmoothPath(ctx, projected);
    ctx.fill();

    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.12 * front;
    ctx.strokeStyle = rgb(config.highland, 0.18);
    ctx.lineWidth = Math.max(0.62, radius * 0.0024);
    drawSmoothPath(ctx, projected);
    ctx.stroke();

    ctx.restore();
    return;
  }

  const gradient = ctx.createRadialGradient(
    cx - radius * 0.30,
    cy - radius * 0.36,
    radius * 0.04,
    cx,
    cy,
    radius * 1.08
  );

  const landOpacity = material.landOpacity || 0.78;

  gradient.addColorStop(0, rgb(mixColor(landColor, [246, 238, 188], 0.16), landOpacity * front));
  gradient.addColorStop(0.42, rgb(landColor, (landOpacity - 0.06) * front));
  gradient.addColorStop(0.76, rgb(mixColor(landColor, config.deep, 0.22), (landOpacity - 0.09) * front));
  gradient.addColorStop(1, rgb(mixColor(landColor, config.deep, 0.38), (landOpacity - 0.13) * front));

  ctx.shadowColor = "rgba(0,0,0,0.10)";
  ctx.shadowBlur = radius * 0.004;
  ctx.fillStyle = gradient;
  ctx.strokeStyle = rgb(config.coast, (material.coastStrength || 0.45) * 0.70 * front);
  ctx.lineWidth = Math.max(0.75, radius * 0.0036);

  drawSmoothPath(ctx, projected);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function drawCoastBreaks(ctx, shape, radius, cx, cy, config) {
  const points = shape.coast.map((sample) => projectSample(sample, radius, cx, cy));
  const ratio = visibleRatio(points, radius);

  if (ratio < 0.22) return;

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.strokeStyle = rgb(config.coast, 0.12 * ratio);
  ctx.lineWidth = Math.max(0.55, radius * 0.0019);

  for (let i = 0; i < points.length; i += 10) {
    const a = points[i];
    const b = points[(i + 3) % points.length];

    if (a.z < -radius * 0.08 || b.z < -radius * 0.08) continue;

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.quadraticCurveTo(
      (a.x + b.x) * 0.5 + Math.sin(i + shape.source.seed) * radius * 0.010,
      (a.y + b.y) * 0.5 + Math.cos(i + shape.source.seed) * radius * 0.010,
      b.x,
      b.y
    );
    ctx.stroke();
  }

  ctx.restore();
}

function drawOceanTexture(ctx, radius, cx, cy, config, cache) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  for (const sample of cache.ocean) {
    const p = projectSample(sample, radius, cx, cy);

    if (p.z < -radius * 0.05) continue;

    const size = radius * sample.sizeSeed;
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size);
    g.addColorStop(0, rgb(config.shelf, sample.alphaSeed));
    g.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.x, p.y, size, 0, TAU);
    ctx.fill();
  }

  ctx.restore();
}

function drawOceanCurrentLines(ctx, radius, cx, cy, config) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.strokeStyle = rgb(config.shelf, 0.055);
  ctx.lineWidth = Math.max(0.45, radius * 0.0013);

  for (let i = 0; i < 9; i += 1) {
    const lat = -0.72 + i * 0.18;
    const start = -1.65 + seededUnit(i, 44) * 0.42;
    const points = [];

    for (let j = 0; j < 18; j += 1) {
      const t = j / 17;
      const sample = {
        lat: lat + Math.sin(t * TAU + i) * 0.035,
        lon: start + t * 1.50
      };

      const projected = projectSample(sample, radius, cx, cy);
      if (projected.z > -radius * 0.03) points.push(projected);
    }

    if (points.length < 5) continue;

    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
  }

  ctx.restore();
}

function drawSurfaceVeins(ctx, radius, cx, cy, config, cache) {
  ctx.save();
  ctx.globalCompositeOperation = "soft-light";

  for (const vein of cache.veins) {
    const points = [];

    for (const sample of vein) {
      const projected = projectSample(sample, radius, cx, cy);
      if (projected.z > -radius * 0.08) points.push(projected);
    }

    if (points.length < 4) continue;

    ctx.strokeStyle = rgb(config.highland, 0.10);
    ctx.lineWidth = Math.max(0.52, radius * 0.0018);
    ctx.beginPath();

    points.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });

    ctx.stroke();
  }

  ctx.restore();
}

function drawCloudLayer(ctx, radius, cx, cy, config, cache) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = config.material.cloudOpacity || 0.18;

  const cloudShift = state.mode === "stable" ? 0 : state.phase * 0.018;

  for (const cloud of cache.clouds) {
    const p = projectSample(cloud, radius, cx, cy, cloudShift);

    if (p.z < -radius * 0.02) continue;

    const cloudWidth = radius * cloud.widthSeed;
    const cloudHeight = radius * cloud.heightSeed;
    const alpha = cloud.alphaSeed;

    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, cloudWidth);
    gradient.addColorStop(0, rgb(config.cloud, alpha));
    gradient.addColorStop(0.46, rgb(config.cloud, alpha * 0.28));
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(
      p.x,
      p.y,
      cloudWidth,
      cloudHeight,
      Math.sin(cloud.phaseSeed + state.phase * 0.06) * 0.44,
      0,
      TAU
    );
    ctx.fill();
  }

  ctx.restore();
}

function drawAtmosphere(ctx, width, height, config, radius, cx, cy) {
  const material = config.material || {};

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const limb = ctx.createRadialGradient(cx, cy, radius * 0.78, cx, cy, radius * 1.16);
  limb.addColorStop(0, "rgba(255,255,255,0)");
  limb.addColorStop(0.62, rgb(config.glow, (material.atmosphere || 0.30) * 0.32));
  limb.addColorStop(0.82, rgb(config.glow, (material.atmosphere || 0.30) * 0.60));
  limb.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = limb;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.13, 0, TAU);
  ctx.fill();

  ctx.restore();

  ctx.save();
  ctx.strokeStyle = rgb(config.glow, 0.26);
  ctx.lineWidth = Math.max(1.0, width * 0.00115);
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.stroke();
  ctx.restore();
}

function drawGlobeGrid(ctx, cx, cy, radius) {
  ctx.save();
  ctx.strokeStyle = "rgba(235,244,255,0.014)";
  ctx.lineWidth = Math.max(0.35, radius * 0.0014);

  for (let lat = -60; lat <= 60; lat += 30) {
    const r = Math.cos((lat * Math.PI) / 180) * radius;
    const y = Math.sin((lat * Math.PI) / 180) * radius;

    ctx.beginPath();
    ctx.ellipse(cx, cy + y, r, r * 0.14, 0, 0, TAU);
    ctx.stroke();
  }

  for (let i = 0; i < 6; i += 1) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, radius * 0.18, radius, (i / 6) * Math.PI, 0, TAU);
    ctx.stroke();
  }

  ctx.restore();
}

function drawGlobeSurface(ctx, width, height, config, cache) {
  const metrics = getLayoutMetrics(width, height);
  const radius = metrics.radius;
  const cx = metrics.globeCenterX;
  const cy = metrics.globeCenterY;
  const material = config.material || {};

  ctx.save();

  const aura = ctx.createRadialGradient(cx, cy, radius * 0.18, cx, cy, radius * 1.50);
  aura.addColorStop(0, rgb(config.glow, 0.080));
  aura.addColorStop(0.52, rgb(config.glow, 0.040));
  aura.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, width, height);

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.clip();

  const ocean = ctx.createRadialGradient(
    cx - radius * 0.34,
    cy - radius * 0.40,
    radius * 0.05,
    cx + radius * 0.06,
    cy + radius * 0.04,
    radius * 1.18
  );

  ocean.addColorStop(0, rgb(mixColor(config.water, [255, 255, 255], 0.18), 1));
  ocean.addColorStop(0.30, rgb(config.water, 1));
  ocean.addColorStop(0.62, rgb(mixColor(config.water, config.deep, material.oceanContrast || 0.52), 1));
  ocean.addColorStop(1, rgb(config.deep, 1));

  ctx.fillStyle = ocean;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  drawOceanTexture(ctx, radius, cx, cy, config, cache);
  drawOceanCurrentLines(ctx, radius, cx, cy, config);

  for (const shape of cache.continents) drawLandShape(ctx, shape, radius, cx, cy, config, "shelf");
  for (const shape of cache.islands) drawLandShape(ctx, shape, radius, cx, cy, config, "shelf");

  for (const shape of cache.continents) drawLandShape(ctx, shape, radius, cx, cy, config, "land");
  for (const shape of cache.islands) drawLandShape(ctx, shape, radius, cx, cy, config, "land");

  for (const shape of cache.polar) {
    drawLandShape(ctx, shape, radius, cx, cy, config, "land", config.polar);
  }

  for (const shape of cache.continents) {
    drawLandShape(ctx, shape, radius, cx, cy, config, "terrain");
    drawCoastBreaks(ctx, shape, radius, cx, cy, config);
  }

  for (const shape of cache.islands) drawCoastBreaks(ctx, shape, radius, cx, cy, config);

  drawSurfaceVeins(ctx, radius, cx, cy, config, cache);
  drawCloudLayer(ctx, radius, cx, cy, config, cache);
  drawGlobeGrid(ctx, cx, cy, radius);

  const shade = ctx.createRadialGradient(
    cx - radius * 0.38,
    cy - radius * 0.43,
    radius * 0.08,
    cx + radius * 0.16,
    cy + radius * 0.10,
    radius * 1.24
  );

  shade.addColorStop(0, "rgba(255,255,255,0.16)");
  shade.addColorStop(0.36, "rgba(255,255,255,0.024)");
  shade.addColorStop(0.74, "rgba(0,0,0,0.18)");
  shade.addColorStop(1, "rgba(0,0,0,0.58)");

  ctx.fillStyle = shade;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  ctx.restore();

  drawAtmosphere(ctx, width, height, config, radius, cx, cy);

  const shadow = ctx.createRadialGradient(cx, cy + radius * 1.08, radius * 0.04, cx, cy + radius * 1.08, radius * 0.48);
  shadow.addColorStop(0, rgb(config.glow, 0.11));
  shadow.addColorStop(0.46, "rgba(82,109,146,0.10)");
  shadow.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.ellipse(cx, cy + radius * 1.08, radius * 0.44, radius * 0.08, 0, 0, TAU);
  ctx.fill();
}

function drawGlints(ctx, width, height, config) {
  const metrics = getLayoutMetrics(width, height);
  const radius = metrics.radius;
  const cx = metrics.globeCenterX;
  const cy = metrics.globeCenterY;

  const points = [
    [cx - radius * 0.56, cy - radius * 0.23, 7],
    [cx + radius * 0.46, cy - radius * 0.15, 5],
    [cx - radius * 0.04, cy - radius * 0.80, 4]
  ];

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  points.forEach(([x, y, size], index) => {
    const pulse = 0.50 + 0.50 * Math.sin(state.phase * 1.20 + index * PHI);
    ctx.strokeStyle = `rgba(255,255,255,${0.18 * pulse})`;
    ctx.lineWidth = Math.max(0.8, width * 0.0008);
    ctx.beginPath();
    ctx.moveTo(x - size * state.dpr, y);
    ctx.lineTo(x + size * state.dpr, y);
    ctx.moveTo(x, y - size * state.dpr);
    ctx.lineTo(x, y + size * state.dpr);
    ctx.stroke();
  });

  ctx.restore();
}

function render(canvas, ctx) {
  const config = BODY_CONFIG[state.body] || BODY_CONFIG.earth;
  const cache = state.activeCache || getSurfaceCache(state.body);
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);
  drawBackground(ctx, width, height, config);
  drawStars(ctx, width, height);
  drawGlobeSurface(ctx, width, height, config, cache);
  drawGlints(ctx, width, height, config);

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
      state.yaw += dt * 0.042;
    }

    changed = changed || Math.abs(priorYaw - state.yaw) > 0.00001 || Math.abs(priorPitch - state.pitch) > 0.00001;
  }

  if (state.mode !== "stable") {
    state.phase += dt;
    changed = true;
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
  state.pitch = -0.10;
  state.velocityYaw = 0;
  state.velocityPitch = 0;
  state.needsRender = true;
}

function setBody(bodyKey) {
  if (!BODY_CONFIG[bodyKey]) return;

  state.body = bodyKey;
  activateSurfaceCache(bodyKey);
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
  document.documentElement.dataset.globeGatewayStatus = "visual-material-upgraded";
  document.documentElement.dataset.globeGatewayAuthority = "true";
  document.documentElement.dataset.visualScaleAuthority = "true";
  document.documentElement.dataset.runtimeStabilized = "true";
  document.documentElement.dataset.surfaceCacheEnabled = "true";
  document.documentElement.dataset.mobileStageLayoutGovernor = "true";
  document.documentElement.dataset.protectedVerticalBands = "true";
  document.documentElement.dataset.visualMaterialUpgrade = "true";
  document.documentElement.dataset.blockTileLandRender = "false";
  document.documentElement.dataset.diamondInstrument = "false";
  document.documentElement.dataset.earthRecord = "false";

  document.body.dataset.globeGatewayStatus = "visual-material-upgraded";
  document.body.dataset.globeGatewayAuthority = "true";
  document.body.dataset.visualScaleAuthority = "true";
  document.body.dataset.runtimeStabilized = "true";
  document.body.dataset.surfaceCacheEnabled = "true";
  document.body.dataset.mobileStageLayoutGovernor = "true";
  document.body.dataset.protectedVerticalBands = "true";
  document.body.dataset.visualMaterialUpgrade = "true";
  document.body.dataset.blockTileLandRender = "false";
  document.body.dataset.diamondInstrument = "false";
  document.body.dataset.earthRecord = "false";
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

function warmSurfaceCaches() {
  Object.keys(BODY_CONFIG).forEach((key) => {
    getSurfaceCache(key);
  });
}

function initGlobeSelector() {
  markRoute();
  protectGatewayIdentity();
  warmSurfaceCaches();

  const stage = document.querySelector("[data-globe-selector-stage]");
  const canvas = document.querySelector("[data-globe-selector-canvas]");

  if (!stage || !canvas) return null;

  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if (!ctx) return null;

  bindControls();
  bindPointer(stage);
  setBody("earth");
  setMode("auto");
  resizeCanvas(canvas);
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
        surfaceCacheEnabled: true,
        mobileStageLayoutGovernor: true,
        protectedVerticalBands: true,
        visualMaterialUpgrade: true,
        cacheKeys: Object.freeze(Object.keys(state.surfaceCache))
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

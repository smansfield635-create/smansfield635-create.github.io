// /showroom/globe/index.js
// TNT FULL-FILE REPLACEMENT
// SHOWROOM_GLOBE_CINEMATIC_DRY_PLANET_MATERIAL_TNT_v1
// Role: public Globe Showcase selector only.
// Standard: actual cinematic dry planet material.
// Method: continuous sphere shader, 3D noise height field, pseudo-normal relief lighting, erosion/canyon/basin/cliff material.
// Forbidden here: water fill, blue oceans, coastline map, school-globe grid, blocks, child imports, private engines, mountain system.

const MODEL_NAME = "showroom-globe-cinematic-dry-planet-material-v1";

const REDUCED_MOTION = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
const MOBILE = window.matchMedia?.("(max-width: 760px)")?.matches === true;
const DPR = Math.min(window.devicePixelRatio || 1, MOBILE ? 1.35 : 1.8);
const FRAME_MS = MOBILE ? 110 : 82;

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

const RASTER_LIMIT = MOBILE ? 390 : 610;

const SUBLEVEL_MODEL = Object.freeze({
  parentCells: CELL_COUNT,
  childFieldsPerParent: CHILD_HEX_COUNT,
  totalChildFields: TOTAL_CHILD_FIELDS,
  publicMode: "cinematic dry planet material",
  privateEnginesAsleep: true,
  mapExpression: false,
  waterExpression: false,
  landmassExpression: false,
  childTerrainImport: false,
  mountainSystem: false,
  planetShader: true,
  continuousSurface: true,
  materialRelief: true,
  pseudoNormalLighting: true,
  polygonPatchSurface: false,
  privateModelPaths: Object.freeze({
    earth: "/showroom/globe/earth/",
    hEarth: "/showroom/globe/h-earth/",
    audralia: "/showroom/globe/audralia/"
  })
});

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

  surfaceCanvas: null,
  surfaceCtx: null,
  surfaceSize: 0,
  surfaceImage: null,

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

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function fract(value) {
  return value - Math.floor(value);
}

function hash1(a, b = 0, c = 0, d = 0) {
  return fract(Math.sin(a * 127.1 + b * 311.7 + c * 74.7 + d * 19.19) * 43758.5453123);
}

function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function valueNoise3D(x, y, z, seed = 0) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);

  const xf = x - xi;
  const yf = y - yi;
  const zf = z - zi;

  const u = fade(xf);
  const v = fade(yf);
  const w = fade(zf);

  const n000 = hash1(xi, yi, zi, seed);
  const n100 = hash1(xi + 1, yi, zi, seed);
  const n010 = hash1(xi, yi + 1, zi, seed);
  const n110 = hash1(xi + 1, yi + 1, zi, seed);
  const n001 = hash1(xi, yi, zi + 1, seed);
  const n101 = hash1(xi + 1, yi, zi + 1, seed);
  const n011 = hash1(xi, yi + 1, zi + 1, seed);
  const n111 = hash1(xi + 1, yi + 1, zi + 1, seed);

  const x00 = lerp(n000, n100, u);
  const x10 = lerp(n010, n110, u);
  const x01 = lerp(n001, n101, u);
  const x11 = lerp(n011, n111, u);

  const y0 = lerp(x00, x10, v);
  const y1 = lerp(x01, x11, v);

  return lerp(y0, y1, w) * 2 - 1;
}

function fbm3D(x, y, z, seed = 0, octaves = 5) {
  let value = 0;
  let amplitude = 0.52;
  let frequency = 1;
  let total = 0;

  for (let octave = 0; octave < octaves; octave += 1) {
    value += valueNoise3D(x * frequency, y * frequency, z * frequency, seed + octave * 37) * amplitude;
    total += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return value / total;
}

function ridge3D(x, y, z, seed = 0, octaves = 4) {
  return 1 - Math.abs(fbm3D(x, y, z, seed, octaves));
}

function normalize(v) {
  const length = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / length, y: v.y / length, z: v.z / length };
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function rotateY(p, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);

  return {
    x: p.x * c + p.z * s,
    y: p.y,
    z: -p.x * s + p.z * c
  };
}

function rotateX(p, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);

  return {
    x: p.x,
    y: p.y * c - p.z * s,
    z: p.y * s + p.z * c
  };
}

function inverseSpherePointFromView(viewPoint, yaw, pitch) {
  return rotateY(rotateX(viewPoint, -pitch), -yaw);
}

function makePoint(lat, lon) {
  const cosLat = Math.cos(lat);
  return {
    x: cosLat * Math.cos(lon),
    y: Math.sin(lat),
    z: cosLat * Math.sin(lon)
  };
}

function wrapLonDelta(lon, center) {
  return Math.atan2(Math.sin(lon - center), Math.cos(lon - center));
}

function ribbonField(lat, lon, centerLat, centerLon, length, width, angle, phase = 0) {
  const x = wrapLonDelta(lon, centerLon);
  const y = lat - centerLat;

  const c = Math.cos(angle);
  const s = Math.sin(angle);

  const xr = x * c - y * s;
  const yr = x * s + y * c;

  const curved =
    yr +
    Math.sin(xr * 2.7 + phase) * 0.070 +
    Math.sin(xr * 5.9 - phase) * 0.024 +
    Math.sin(xr * 11.0 + phase * 0.7) * 0.009;

  const along = Math.abs(xr) / length;
  const across = Math.abs(curved) / width;

  return clamp(1 - Math.max(along * 0.74, across), 0, 1);
}

function basinField(lat, lon, centerLat, centerLon, latWidth, lonWidth) {
  const dLat = (lat - centerLat) / latWidth;
  const dLon = wrapLonDelta(lon, centerLon) / lonWidth;
  return Math.exp(-(dLat * dLat + dLon * dLon));
}

function mixColor(a, b, t) {
  const k = clamp(t, 0, 1);
  return [
    Math.round(lerp(a[0], b[0], k)),
    Math.round(lerp(a[1], b[1], k)),
    Math.round(lerp(a[2], b[2], k))
  ];
}

function colorString(color) {
  return `rgb(${color[0]},${color[1]},${color[2]})`;
}

function colorWithAlpha(color, alpha) {
  return `rgba(${color[0]},${color[1]},${color[2]},${alpha})`;
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
  state.ctx = state.canvas.getContext("2d", { alpha: false, desynchronized: true });

  createStars(MOBILE ? 56 : 126);
}

function createStars(count) {
  state.stars = Array.from({ length: count }, (_, index) => ({
    x: hash1(index, 1),
    y: hash1(index, 2),
    r: 0.45 + hash1(index, 3) * 1.85,
    a: 0.10 + hash1(index, 4) * 0.34,
    p: hash1(index, 5) * Math.PI * 2
  }));
}

function latLonFromPoint(p) {
  return {
    lat: Math.asin(clamp(p.y, -1, 1)),
    lon: Math.atan2(p.z, p.x)
  };
}

function sampleBasinNetwork(lat, lon, p, world) {
  const seed = world.seed + 100;

  const broadA = basinField(lat, lon, 0.18, -2.05, 0.56, 0.54);
  const broadB = basinField(lat, lon, -0.34, 1.72, 0.48, 0.58);
  const broadC = basinField(lat, lon, 0.68, 0.62, 0.32, 0.70);
  const broadD = basinField(lat, lon, -0.70, -1.02, 0.34, 0.66);
  const broadE = basinField(lat, lon, -0.08, 0.12, 0.42, 0.46);

  const roughFloor =
    fbm3D(p.x * 2.1 + 1.2, p.y * 2.0 - 2.7, p.z * 2.2 + 0.8, seed + 1, 4) * 0.10 +
    ridge3D(p.x * 3.6 - 2.4, p.y * 3.2 + 1.1, p.z * 3.4 + 5.0, seed + 2, 3) * 0.06;

  return clamp(Math.max(broadA, broadB, broadC, broadD, broadE) * 0.88 + roughFloor, 0, 1);
}

function sampleCanyonNetwork(lat, lon, p, world) {
  const seed = world.seed + 200;

  const canyonA = ribbonField(lat, lon, 0.05, -0.16, 1.74, 0.030, 0.10, 0.9);
  const canyonB = ribbonField(lat, lon, 0.42, -1.88, 0.96, 0.032, 0.44, 2.0);
  const canyonC = ribbonField(lat, lon, -0.38, 1.30, 1.06, 0.032, -0.38, -0.8);
  const canyonD = ribbonField(lat, lon, -0.03, 2.42, 1.30, 0.030, -0.14, 1.2);
  const canyonE = ribbonField(lat, lon, 0.10, -2.54, 1.34, 0.031, 0.16, -1.4);

  const serration =
    ridge3D(p.x * 6.2 - 1.4, p.y * 5.7 + 2.8, p.z * 5.9 + 3.7, seed + 1, 4) * 0.24;

  return clamp(Math.max(canyonA, canyonB, canyonC, canyonD, canyonE, 0) * 0.90 + serration * 0.10, 0, 1);
}

function sampleDryRiverbeds(lat, lon, p, world) {
  const seed = world.seed + 300;

  const riverA = ribbonField(lat, lon, 0.34, -1.32, 1.08, 0.020, -0.48, 0.2);
  const riverB = ribbonField(lat, lon, -0.18, 0.78, 1.18, 0.022, 0.36, 1.7);
  const riverC = ribbonField(lat, lon, 0.54, 0.22, 0.94, 0.019, -0.12, -1.1);
  const riverD = ribbonField(lat, lon, -0.52, -0.58, 1.02, 0.020, 0.26, 2.3);
  const riverE = ribbonField(lat, lon, 0.08, 1.72, 0.82, 0.018, -0.58, -0.4);

  const braided =
    ridge3D(p.x * 7.5 + 0.7, p.y * 6.7 - 2.1, p.z * 7.1 + 1.9, seed + 1, 3) * 0.16;

  return clamp(Math.max(riverA, riverB, riverC, riverD, riverE, 0) + braided * 0.16, 0, 1);
}

function sampleCliffs(lat, lon, p, world) {
  const seed = world.seed + 400;

  const escarpA = ribbonField(lat, lon, 0.18, -1.10, 1.18, 0.042, -0.56, 0.6);
  const escarpB = ribbonField(lat, lon, -0.30, 0.98, 1.26, 0.044, 0.48, 1.8);
  const escarpC = ribbonField(lat, lon, 0.62, 0.08, 0.92, 0.038, -0.10, -1.0);
  const escarpD = ribbonField(lat, lon, -0.64, -0.76, 0.96, 0.040, 0.32, 2.4);

  const brokenFace =
    ridge3D(p.x * 3.8 + 4.0, p.y * 3.4 - 2.0, p.z * 3.6 + 1.7, seed + 1, 4);

  return clamp(Math.max(escarpA, escarpB, escarpC, escarpD, 0) * (0.50 + brokenFace * 0.50), 0, 1);
}

function sampleCaverns(lat, lon, p, world) {
  const seed = world.seed + 500;

  const sinkA = basinField(lat, lon, 0.16, -1.46, 0.070, 0.105);
  const sinkB = basinField(lat, lon, -0.18, 0.70, 0.085, 0.125);
  const sinkC = basinField(lat, lon, 0.48, 0.34, 0.072, 0.125);
  const sinkD = basinField(lat, lon, -0.44, -0.32, 0.082, 0.145);
  const sinkE = basinField(lat, lon, 0.02, 1.58, 0.072, 0.120);

  const porous = fbm3D(p.x * 6.4 + 8.0, p.y * 5.9 - 3.0, p.z * 6.1 + 1.2, seed + 1, 4);
  const gate = porous > 0.02 ? 1 : 0.40;

  return clamp(Math.max(sinkA, sinkB, sinkC, sinkD, sinkE) * gate, 0, 1);
}

function sampleCrustalRidges(lat, lon, p, world) {
  const seed = world.seed + 600;

  const arcA = ribbonField(lat, lon, 0.16, -1.22, 1.72, 0.078, -0.38, 0.4);
  const arcB = ribbonField(lat, lon, -0.18, 0.86, 1.50, 0.074, 0.34, 2.1);
  const arcC = ribbonField(lat, lon, 0.52, 0.18, 1.20, 0.070, -0.12, -1.2);
  const arcD = ribbonField(lat, lon, -0.58, -0.52, 1.28, 0.074, 0.24, 1.7);

  const foldedStone =
    ridge3D(p.x * 1.55 + 4.2, p.y * 1.50 - 7.2, p.z * 1.58 + 2.4, seed + 1, 4) * 0.24 +
    ridge3D(p.x * 3.10 - 8.1, p.y * 2.90 + 3.8, p.z * 2.80 - 1.7, seed + 2, 4) * 0.12;

  return clamp(Math.max(arcA, arcB, arcC, arcD, 0) * 0.34 + foldedStone, 0, 1);
}

function sampleCrustalScars(lat, lon, p, world) {
  const seed = world.seed + 700;

  const scarA = ribbonField(lat, lon, 0.24, -0.74, 1.18, 0.014, 0.72, 0.3);
  const scarB = ribbonField(lat, lon, -0.26, 1.34, 1.08, 0.014, -0.64, -1.7);
  const scarC = ribbonField(lat, lon, 0.70, -0.12, 0.82, 0.013, 0.12, 2.8);
  const scarD = ribbonField(lat, lon, -0.66, 0.48, 0.84, 0.013, -0.18, 1.4);

  const fractureGate =
    fbm3D(p.x * 7.6 - 2.0, p.y * 6.8 + 4.0, p.z * 7.1 + 0.4, seed + 1, 4);

  return clamp(Math.max(scarA, scarB, scarC, scarD, 0) * (fractureGate > -0.30 ? 1 : 0.30), 0, 1);
}

function samplePlanetMaterialFromPoint(p, world) {
  const { lat, lon } = latLonFromPoint(p);
  const seed = world.seed;

  const macroWarp = {
    x: p.x + fbm3D(p.x * 1.1, p.y * 1.1, p.z * 1.1, seed + 11, 3) * 0.11,
    y: p.y + fbm3D(p.x * 1.1 + 4.0, p.y * 1.1 - 2.0, p.z * 1.1, seed + 12, 3) * 0.11,
    z: p.z + fbm3D(p.x * 1.1 - 1.0, p.y * 1.1 + 5.0, p.z * 1.1 + 3.0, seed + 13, 3) * 0.11
  };

  const macro = fbm3D(macroWarp.x * 1.20, macroWarp.y * 1.20, macroWarp.z * 1.20, seed + 20, 5);
  const plate = ridge3D(p.x * 1.85, p.y * 1.85, p.z * 1.85, seed + 21, 5);
  const folded = ridge3D(p.x * 4.40, p.y * 4.20, p.z * 4.30, seed + 22, 4);
  const fine = fbm3D(p.x * 13.0, p.y * 12.5, p.z * 12.8, seed + 23, 4);

  const basins = sampleBasinNetwork(lat, lon, p, world);
  const canyons = sampleCanyonNetwork(lat, lon, p, world);
  const channels = sampleDryRiverbeds(lat, lon, p, world);
  const cliffs = sampleCliffs(lat, lon, p, world);
  const caverns = sampleCaverns(lat, lon, p, world);
  const ridges = sampleCrustalRidges(lat, lon, p, world);
  const scars = sampleCrustalScars(lat, lon, p, world);

  const polarCompression = smoothstep(0.68, 1.0, Math.abs(p.y)) * 0.10;
  const equatorialSag = (1 - smoothstep(0.10, 0.88, Math.abs(p.y))) * 0.050;

  const height =
    macro * 0.30 +
    plate * 0.22 +
    folded * 0.12 +
    ridges * 0.28 +
    cliffs * 0.11 +
    scars * 0.035 +
    polarCompression -
    basins * 0.34 -
    canyons * 0.32 -
    channels * 0.18 -
    caverns * 0.25 -
    equatorialSag +
    fine * 0.030;

  return {
    lat,
    lon,
    height,
    relief: clamp((height + 0.64) / 1.26, 0, 1),
    macro,
    plate,
    folded,
    fine: clamp((fine + 1) * 0.5, 0, 1),
    basins,
    canyons,
    channels,
    cliffs,
    caverns,
    ridges,
    scars
  };
}

function samplePlanetHeightFromPoint(p, world) {
  return samplePlanetMaterialFromPoint(normalize(p), world).height;
}

function tangentVectorsFromPoint(p) {
  const up = Math.abs(p.y) > 0.92 ? { x: 1, y: 0, z: 0 } : { x: 0, y: 1, z: 0 };

  const east = normalize({
    x: up.y * p.z - up.z * p.y,
    y: up.z * p.x - up.x * p.z,
    z: up.x * p.y - up.y * p.x
  });

  const north = normalize({
    x: p.y * east.z - p.z * east.y,
    y: p.z * east.x - p.x * east.z,
    z: p.x * east.y - p.y * east.x
  });

  return { east, north };
}

function offsetPointOnSphere(p, tangent, amount) {
  return normalize({
    x: p.x + tangent.x * amount,
    y: p.y + tangent.y * amount,
    z: p.z + tangent.z * amount
  });
}

function samplePlanetNormalFromPoint(p, world) {
  const eps = 0.010;
  const tangents = tangentVectorsFromPoint(p);

  const hE = samplePlanetHeightFromPoint(offsetPointOnSphere(p, tangents.east, eps), world);
  const hW = samplePlanetHeightFromPoint(offsetPointOnSphere(p, tangents.east, -eps), world);
  const hN = samplePlanetHeightFromPoint(offsetPointOnSphere(p, tangents.north, eps), world);
  const hS = samplePlanetHeightFromPoint(offsetPointOnSphere(p, tangents.north, -eps), world);

  const dE = (hE - hW) / (eps * 2);
  const dN = (hN - hS) / (eps * 2);
  const strength = 0.42;

  return normalize({
    x: p.x - tangents.east.x * dE * strength - tangents.north.x * dN * strength,
    y: p.y - tangents.east.y * dE * strength - tangents.north.y * dN * strength,
    z: p.z - tangents.east.z * dE * strength - tangents.north.z * dN * strength
  });
}

function materialBaseColor(material, world) {
  let base = mixColor(world.stoneLow, world.stoneMid, 0.30 + material.relief * 0.48);

  if (material.basins > 0.18) {
    base = mixColor(base, world.stoneDeep, material.basins * 0.50);
    base = mixColor(base, world.sediment, clamp((material.basins - 0.36) * 0.26, 0, 0.16));
  }

  if (material.caverns > 0.25) {
    base = mixColor(base, world.shadow, material.caverns * 0.58);
  }

  if (material.channels > 0.32) {
    base = mixColor(base, world.shadow, material.channels * 0.28);
    base = mixColor(base, world.exposed, clamp((material.channels - 0.40) * 0.20, 0, 0.12));
  }

  if (material.canyons > 0.30) {
    base = mixColor(base, world.shadow, material.canyons * 0.42);
    base = mixColor(base, world.exposed, clamp((material.canyons - 0.35) * 0.34, 0, 0.20));
  }

  if (material.cliffs > 0.24) {
    base = mixColor(base, world.exposed, clamp(material.cliffs * 0.50, 0, 0.42));
  }

  if (material.ridges > 0.50 || material.relief > 0.72) {
    base = mixColor(base, world.stoneHigh, clamp(Math.max(material.ridges - 0.46, material.relief - 0.68) * 0.88, 0, 0.56));
  }

  if (material.ridges > 0.72) {
    base = mixColor(base, world.ridge, clamp((material.ridges - 0.68) * 0.78, 0, 0.34));
  }

  if (material.scars > 0.62) {
    base = mixColor(base, world.scar, clamp((material.scars - 0.60) * 0.42, 0, 0.16));
  }

  const grain = (material.fine - 0.5) * 14.0 + (material.folded - 0.5) * 6.0;

  return [
    clamp(base[0] + grain, 0, 255),
    clamp(base[1] + grain * 0.80, 0, 255),
    clamp(base[2] + grain * 0.54, 0, 255)
  ];
}

function shadePlanetPixel({ viewNormal, worldPoint, material, bumpViewNormal, world, lightView }) {
  const sphereDiffuse = clamp(dot(viewNormal, lightView), 0, 1);
  const terrainDiffuse = clamp(dot(bumpViewNormal, lightView), 0, 1);
  const z = clamp(viewNormal.z, 0, 1);

  const rim = Math.pow(clamp(1 - z, 0, 1), 1.75);
  const terminator = smoothstep(-0.06, 0.72, sphereDiffuse);

  const occlusion =
    material.basins * 0.18 +
    material.canyons * 0.22 +
    material.channels * 0.12 +
    material.caverns * 0.26;

  const reliefFlash =
    material.cliffs * 0.12 +
    material.ridges * 0.08 +
    material.scars * 0.025;

  const lowSunWarmth = smoothstep(0.18, 0.72, terrainDiffuse) * 0.08;
  const base = materialBaseColor(material, world);

  const ambient = 0.12;
  const direct = terrainDiffuse * 0.94;
  const terminatorShade = lerp(0.18, 1.0, terminator);
  const materialShade = clamp(ambient + direct + reliefFlash + lowSunWarmth - occlusion, 0.07, 1.25);
  const shade = materialShade * terminatorShade;

  const sunWash = clamp((terrainDiffuse - 0.72) * 0.38, 0, 0.20);
  const rimLift = rim * 0.10;

  const color = [
    clamp(base[0] * shade + world.ridge[0] * sunWash + world.atmosphere[0] * rimLift, 0, 255),
    clamp(base[1] * shade + world.ridge[1] * sunWash + world.atmosphere[1] * rimLift, 0, 255),
    clamp(base[2] * shade + world.ridge[2] * sunWash + world.atmosphere[2] * rimLift, 0, 255)
  ];

  const nightside = 1 - terminator;
  color[0] = clamp(color[0] - nightside * 12, 0, 255);
  color[1] = clamp(color[1] - nightside * 16, 0, 255);
  color[2] = clamp(color[2] - nightside * 18, 0, 255);

  const leftSunBias = smoothstep(-0.95, 0.15, -viewNormal.x) * smoothstep(-0.50, 0.80, viewNormal.y);
  color[0] = clamp(color[0] + leftSunBias * 10, 0, 255);
  color[1] = clamp(color[1] + leftSunBias * 8, 0, 255);
  color[2] = clamp(color[2] + leftSunBias * 3, 0, 255);

  void worldPoint;
  return color;
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

function ensureSurfaceBuffer(view) {
  const desired = Math.max(260, Math.min(RASTER_LIMIT, Math.round(view.scale * 2.05)));

  if (!state.surfaceCanvas) {
    state.surfaceCanvas = document.createElement("canvas");
    state.surfaceCtx = state.surfaceCanvas.getContext("2d", {
      alpha: true,
      willReadFrequently: false
    });
  }

  if (state.surfaceSize !== desired) {
    state.surfaceSize = desired;
    state.surfaceCanvas.width = desired;
    state.surfaceCanvas.height = desired;
    state.surfaceImage = state.surfaceCtx.createImageData(desired, desired);
  }
}

function drawCinematicPlanetSurface(ctx, view) {
  const world = WORLDS[state.worldKey];
  ensureSurfaceBuffer(view);

  const size = state.surfaceSize;
  const image = state.surfaceImage;
  const data = image.data;

  const lightView = normalize({ x: -0.58, y: 0.50, z: 0.76 });

  let ptr = 0;

  for (let py = 0; py < size; py += 1) {
    const ny = 1 - (py / (size - 1)) * 2;

    for (let px = 0; px < size; px += 1) {
      const nx = (px / (size - 1)) * 2 - 1;
      const r2 = nx * nx + ny * ny;

      if (r2 > 1) {
        data[ptr] = 0;
        data[ptr + 1] = 0;
        data[ptr + 2] = 0;
        data[ptr + 3] = 0;
        ptr += 4;
        continue;
      }

      const z = Math.sqrt(Math.max(0, 1 - r2));
      const viewNormal = normalize({ x: nx, y: ny, z });
      const worldPoint = inverseSpherePointFromView(viewNormal, view.yaw, view.pitch);

      const material = samplePlanetMaterialFromPoint(worldPoint, world);
      const bumpWorldNormal = samplePlanetNormalFromPoint(worldPoint, world);
      const bumpViewNormal = normalize(rotateX(rotateY(bumpWorldNormal, view.yaw), view.pitch));

      const color = shadePlanetPixel({
        viewNormal,
        worldPoint,
        material,
        bumpViewNormal,
        world,
        lightView
      });

      const edgeAlpha = 1 - smoothstep(0.972, 1.0, Math.sqrt(r2));
      const alpha = Math.round(255 * clamp(edgeAlpha, 0, 1));

      data[ptr] = Math.round(color[0]);
      data[ptr + 1] = Math.round(color[1]);
      data[ptr + 2] = Math.round(color[2]);
      data[ptr + 3] = alpha;
      ptr += 4;
    }
  }

  state.surfaceCtx.putImageData(image, 0, 0);

  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    state.surfaceCanvas,
    view.cx - view.scale,
    view.cy - view.scale,
    view.scale * 2,
    view.scale * 2
  );
  ctx.restore();
}

function drawAtmosphere(ctx, view) {
  const world = WORLDS[state.worldKey];
  const a = world.atmosphere;

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const outer = ctx.createRadialGradient(
    view.cx,
    view.cy,
    view.scale * 0.76,
    view.cx,
    view.cy,
    view.scale * 1.20
  );

  outer.addColorStop(0, "rgba(0,0,0,0)");
  outer.addColorStop(0.66, `rgba(${a[0]},${a[1]},${a[2]},0.075)`);
  outer.addColorStop(0.92, `rgba(${a[0]},${a[1]},${a[2]},0.25)`);
  outer.addColorStop(1, `rgba(${a[0]},${a[1]},${a[2]},0.05)`);

  ctx.fillStyle = outer;
  ctx.beginPath();
  ctx.arc(view.cx, view.cy, view.scale * 1.16, 0, Math.PI * 2);
  ctx.fill();

  const limb = ctx.createRadialGradient(
    view.cx - view.scale * 0.16,
    view.cy - view.scale * 0.18,
    view.scale * 0.44,
    view.cx,
    view.cy,
    view.scale * 1.04
  );

  limb.addColorStop(0, "rgba(255,255,255,0)");
  limb.addColorStop(0.72, "rgba(255,255,255,0)");
  limb.addColorStop(1, `rgba(${a[0]},${a[1]},${a[2]},0.30)`);

  ctx.fillStyle = limb;
  ctx.beginPath();
  ctx.arc(view.cx, view.cy, view.scale * 1.012, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = `rgba(${a[0]},${a[1]},${a[2]},0.34)`;
  ctx.lineWidth = Math.max(1, DPR * 1.15);
  ctx.beginPath();
  ctx.arc(view.cx, view.cy, view.scale * 1.008, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawOrbitLines(ctx, view) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  ctx.strokeStyle = "rgba(244,191,96,0.060)";
  ctx.lineWidth = Math.max(0.60, DPR * 0.65);
  ctx.beginPath();
  ctx.ellipse(view.cx, view.cy, view.scale * 1.52, view.scale * 0.35, -0.12, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(142,190,255,0.044)";
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
  ctx.fillText(`${world.subtitle} · cinematic dry planet material`, width * 0.5, height * 0.195);

  ctx.restore();
}

function drawCue(ctx, width, height) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(186,197,212,0.60)";
  ctx.font = `800 ${Math.max(11 * DPR, width * 0.013)}px Inter, system-ui, sans-serif`;
  ctx.fillText("Drag to inspect · Cinematic dry planet material · Open private world room", width * 0.5, height * 0.90);
  ctx.restore();
}

function drawPlanet(ctx, width, height) {
  const scale = Math.min(width * 0.395, height * 0.415);

  const view = {
    cx: width * 0.50,
    cy: height * 0.505,
    scale,
    yaw: state.yaw,
    pitch: state.pitch
  };

  drawGlobeShadow(ctx, view);
  drawCinematicPlanetSurface(ctx, view);
  drawAtmosphere(ctx, view);
  drawOrbitLines(ctx, view);
  drawWorldTitle(ctx, width, height);
  drawCue(ctx, width, height);

  document.documentElement.dataset.globeShowcaseModel = MODEL_NAME;
  document.documentElement.dataset.selectedWorld = state.worldKey;
  document.documentElement.dataset.publicPortraitBaseline = "cinematic-dry-planet-material";
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
  document.documentElement.dataset.polygonPatchSurface = "false";
  document.documentElement.dataset.parentCellCount = String(CELL_COUNT);
  document.documentElement.dataset.childFieldsPerParent = String(CHILD_HEX_COUNT);
  document.documentElement.dataset.totalChildFields = String(TOTAL_CHILD_FIELDS);
}

function render() {
  const ctx = state.ctx;
  if (!ctx) return;

  drawBackground(ctx, state.width, state.height);
  drawPlanet(ctx, state.width, state.height);
}

function updateInspectionMotion() {
  if (!state.dragging) {
    if (!state.interacted && !REDUCED_MOTION) {
      state.targetYaw += 0.00078;
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
    button.addEventListener("click", () => {
      setWorld(button.dataset.world);
    });
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
      state.surfaceSize = 0;
      state.surfaceImage = null;
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
    publicPortraitBaseline: "cinematic-dry-planet-material",
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
    polygonPatchSurface: false,
    worlds: Object.keys(WORLDS),
    parentCellCount: CELL_COUNT,
    childFieldsPerParent: CHILD_HEX_COUNT,
    totalChildFields: TOTAL_CHILD_FIELDS,
    sublevelModel: SUBLEVEL_MODEL,
    setWorld,
    reset: resetInspection,
    status() {
      return {
        model: MODEL_NAME,
        selectedWorld: state.worldKey,
        publicPortraitBaseline: "cinematic-dry-planet-material",
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
  publicPortraitBaseline: "cinematic-dry-planet-material",
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
  polygonPatchSurface: false,
  parentCellCount: CELL_COUNT,
  childFieldsPerParent: CHILD_HEX_COUNT,
  totalChildFields: TOTAL_CHILD_FIELDS,
  sublevelModel: SUBLEVEL_MODEL
};

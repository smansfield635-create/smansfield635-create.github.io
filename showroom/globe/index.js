// /showroom/globe/index.js
// TNT FULL-FILE REPLACEMENT
// SHOWROOM_GLOBE_SUBLEVEL_CARVING_TNT_v1
// Role: public Globe Showcase selector only.
// Visual law: clean inspectable sub-level terrain globe with dry geological carvings.
// Added: depth, elevation pressure, dry ocean floors, dry riverbeds, cliffs, caverns, trenches, canyon cuts, shelf depressions, crustal scars.
// Still forbidden here: water, lakes, blue oceans, beaches, coastlines, landmass maps, mountain system, child imports, private engines.

const MODEL_NAME = "showroom-globe-sublevel-carving-v1";

const REDUCED_MOTION = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
const MOBILE = window.matchMedia?.("(max-width: 760px)")?.matches === true;
const DPR = Math.min(window.devicePixelRatio || 1, MOBILE ? 1.25 : 1.65);
const FRAME_MS = MOBILE ? 64 : 48;

const DEFAULT_YAW = -0.66;
const DEFAULT_PITCH = -0.18;
const MIN_PITCH = -1.04;
const MAX_PITCH = 0.74;

const LAT_BANDS = 16;
const LON_SECTORS = 16;
const CELL_COUNT = LAT_BANDS * LON_SECTORS;

const CHILD_HEX_ROWS = 16;
const CHILD_HEX_COLS = 16;
const CHILD_HEX_COUNT = CHILD_HEX_ROWS * CHILD_HEX_COLS;
const TOTAL_CHILD_FIELDS = CELL_COUNT * CHILD_HEX_COUNT;

const PORTRAIT_LAT_STEPS = MOBILE ? 70 : 90;
const PORTRAIT_LON_STEPS = MOBILE ? 140 : 180;

const SUBLEVEL_MODEL = Object.freeze({
  parentCells: CELL_COUNT,
  childFieldsPerParent: CHILD_HEX_COUNT,
  totalChildFields: TOTAL_CHILD_FIELDS,
  publicMode: "clean sub-level terrain globe with dry geological carvings",
  privateEnginesAsleep: true,
  mapExpression: false,
  waterExpression: false,
  landmassExpression: false,
  childTerrainImport: false,
  mountainSystem: false,
  carvingExpression: true,
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
    base: [62, 88, 112],
    low: [24, 38, 58],
    mid: [88, 106, 120],
    high: [154, 146, 126],
    ridge: [214, 208, 184],
    exposed: [205, 176, 128],
    fault: [176, 224, 238],
    cavern: [13, 18, 27],
    glow: "rgba(142,190,255,0.22)"
  },
  hEarth: {
    key: "hEarth",
    title: "H-Earth",
    subtitle: "Hybrid Earth",
    route: "/showroom/globe/h-earth/",
    seed: 710,
    base: [66, 96, 104],
    low: [22, 44, 58],
    mid: [82, 120, 112],
    high: [154, 150, 118],
    ridge: [224, 214, 176],
    exposed: [208, 178, 120],
    fault: [158, 242, 196],
    cavern: [12, 20, 24],
    glow: "rgba(143,240,195,0.22)"
  },
  audralia: {
    key: "audralia",
    title: "Audralia",
    subtitle: "Constructed World",
    route: "/showroom/globe/audralia/",
    seed: 910,
    base: [84, 78, 112],
    low: [32, 30, 66],
    mid: [110, 98, 126],
    high: [172, 148, 108],
    ridge: [228, 206, 160],
    exposed: [218, 170, 120],
    fault: [198, 172, 255],
    cavern: [18, 16, 34],
    glow: "rgba(190,170,255,0.22)"
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

function hash(a, b = 0, c = 0) {
  return fract(Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453123);
}

function valueNoise2D(x, y, seed = 0) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const sx = xf * xf * (3 - 2 * xf);
  const sy = yf * yf * (3 - 2 * yf);

  const n00 = hash(xi, yi, seed);
  const n10 = hash(xi + 1, yi, seed);
  const n01 = hash(xi, yi + 1, seed);
  const n11 = hash(xi + 1, yi + 1, seed);

  return lerp(lerp(n00, n10, sx), lerp(n01, n11, sx), sy) * 2 - 1;
}

function fbm2D(x, y, seed = 0, octaves = 4) {
  let value = 0;
  let amplitude = 0.52;
  let frequency = 1;
  let total = 0;

  for (let octave = 0; octave < octaves; octave += 1) {
    value += valueNoise2D(x * frequency, y * frequency, seed + octave * 23) * amplitude;
    total += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return value / total;
}

function ridge2D(x, y, seed = 0) {
  return 1 - Math.abs(fbm2D(x, y, seed, 4));
}

function warp2D(x, y, seed = 0, amountX = 0.25, amountY = 0.18) {
  return {
    x: x + fbm2D(x * 0.7 + 13.1, y * 0.7 - 9.4, seed + 1, 3) * amountX,
    y: y + fbm2D(x * 0.7 - 6.2, y * 0.7 + 11.7, seed + 2, 3) * amountY
  };
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

function makePoint(lat, lon) {
  const cosLat = Math.cos(lat);
  return {
    x: cosLat * Math.cos(lon),
    y: Math.sin(lat),
    z: cosLat * Math.sin(lon)
  };
}

function project(p, view) {
  return {
    x: view.cx + p.x * view.scale,
    y: view.cy - p.y * view.scale,
    z: p.z
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
    Math.sin(xr * 2.8 + phase) * 0.075 +
    Math.sin(xr * 5.6 - phase) * 0.028;

  const along = Math.abs(xr) / length;
  const across = Math.abs(curved) / width;

  return 1 - Math.max(along * 0.72, across);
}

function basinField(lat, lon, centerLat, centerLon, latWidth, lonWidth) {
  const dLat = (lat - centerLat) / latWidth;
  const dLon = wrapLonDelta(lon, centerLon) / lonWidth;
  return Math.exp(-(dLat * dLat + dLon * dLon));
}

function mixColor(a, b, t) {
  return [
    Math.round(lerp(a[0], b[0], t)),
    Math.round(lerp(a[1], b[1], t)),
    Math.round(lerp(a[2], b[2], t))
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

  createStars(MOBILE ? 56 : 118);
}

function createStars(count) {
  state.stars = Array.from({ length: count }, (_, index) => ({
    x: hash(index, 1),
    y: hash(index, 2),
    r: 0.45 + hash(index, 3) * 1.85,
    a: 0.10 + hash(index, 4) * 0.34,
    p: hash(index, 5) * Math.PI * 2
  }));
}

function sampleDryOceanBasins(lat, lon, world) {
  const seed = world.seed + 200;

  const basinA = basinField(lat, lon, 0.16, -2.06, 0.54, 0.48);
  const basinB = basinField(lat, lon, -0.36, 1.74, 0.46, 0.52);
  const basinC = basinField(lat, lon, 0.72, 0.62, 0.30, 0.66);
  const basinD = basinField(lat, lon, -0.74, -1.05, 0.30, 0.62);
  const basinE = basinField(lat, lon, -0.10, 0.14, 0.36, 0.40);

  const warpedFloor =
    fbm2D(lon * 0.88 + 1.6, lat * 0.92 - 3.4, seed + 1, 4) * 0.12 +
    fbm2D(lon * 1.80 - 4.4, lat * 1.52 + 2.3, seed + 2, 3) * 0.05;

  return clamp(Math.max(basinA, basinB, basinC, basinD, basinE) * 0.86 + warpedFloor, 0, 1);
}

function sampleDryRiverbeds(lat, lon, world) {
  const seed = world.seed + 300;

  const riverA = ribbonField(lat, lon, 0.34, -1.32, 0.96, 0.030, -0.48, 0.2);
  const riverB = ribbonField(lat, lon, -0.18, 0.78, 1.05, 0.032, 0.36, 1.7);
  const riverC = ribbonField(lat, lon, 0.54, 0.22, 0.82, 0.028, -0.12, -1.1);
  const riverD = ribbonField(lat, lon, -0.52, -0.58, 0.92, 0.030, 0.26, 2.3);
  const riverE = ribbonField(lat, lon, 0.08, 1.72, 0.72, 0.027, -0.58, -0.4);

  const breakup = fbm2D(lon * 4.8 + 2.0, lat * 4.3 - 6.0, seed + 1, 3);
  const active = breakup > -0.34 ? 1 : 0.32;

  return clamp(Math.max(riverA, riverB, riverC, riverD, riverE, 0) * active, 0, 1);
}

function sampleCanyonCuts(lat, lon, world) {
  const seed = world.seed + 400;

  const canyonA = ribbonField(lat, lon, 0.04, -0.12, 1.64, 0.046, 0.10, 0.9);
  const canyonB = ribbonField(lat, lon, 0.40, -1.88, 0.86, 0.042, 0.44, 2.0);
  const canyonC = ribbonField(lat, lon, -0.38, 1.30, 0.96, 0.044, -0.38, -0.8);

  const serration = ridge2D(lon * 5.2 - 3.0, lat * 4.9 + 7.2, seed + 1);
  return clamp(Math.max(canyonA, canyonB, canyonC, 0) * (0.72 + serration * 0.28), 0, 1);
}

function sampleTrenches(lat, lon, world) {
  const trenchA = ribbonField(lat, lon, -0.02, 2.42, 1.34, 0.040, -0.14, 1.2);
  const trenchB = ribbonField(lat, lon, 0.08, -2.54, 1.38, 0.042, 0.16, -1.4);
  const trenchC = ribbonField(lat, lon, -0.68, 0.34, 0.98, 0.040, 0.02, 2.6);

  return clamp(Math.max(trenchA, trenchB, trenchC, 0), 0, 1);
}

function sampleCliffPressure(lat, lon, world) {
  const seed = world.seed + 500;

  const escarpA = ribbonField(lat, lon, 0.18, -1.08, 1.10, 0.055, -0.56, 0.6);
  const escarpB = ribbonField(lat, lon, -0.30, 0.98, 1.18, 0.055, 0.48, 1.8);
  const escarpC = ribbonField(lat, lon, 0.62, 0.08, 0.86, 0.050, -0.10, -1.0);
  const escarpD = ribbonField(lat, lon, -0.64, -0.76, 0.90, 0.052, 0.32, 2.4);

  const brokenFace = ridge2D(lon * 3.2 + 4.0, lat * 3.0 - 2.0, seed + 1);
  return clamp(Math.max(escarpA, escarpB, escarpC, escarpD, 0) * (0.56 + brokenFace * 0.44), 0, 1);
}

function sampleCavernPressure(lat, lon, world) {
  const seed = world.seed + 600;

  const sinkA = basinField(lat, lon, 0.16, -1.46, 0.08, 0.12);
  const sinkB = basinField(lat, lon, -0.18, 0.70, 0.10, 0.14);
  const sinkC = basinField(lat, lon, 0.48, 0.34, 0.08, 0.14);
  const sinkD = basinField(lat, lon, -0.44, -0.32, 0.09, 0.16);
  const sinkE = basinField(lat, lon, 0.02, 1.58, 0.08, 0.13);

  const porous = fbm2D(lon * 6.4 + 8.0, lat * 5.9 - 3.0, seed + 1, 3);
  const gate = porous > 0.02 ? 1 : 0.42;

  return clamp(Math.max(sinkA, sinkB, sinkC, sinkD, sinkE) * gate, 0, 1);
}

function sampleCrustalScars(lat, lon, world) {
  const seed = world.seed + 700;

  const scarA = ribbonField(lat, lon, 0.24, -0.74, 1.18, 0.026, 0.72, 0.3);
  const scarB = ribbonField(lat, lon, -0.26, 1.34, 1.08, 0.026, -0.64, -1.7);
  const scarC = ribbonField(lat, lon, 0.70, -0.12, 0.82, 0.024, 0.12, 2.8);
  const scarD = ribbonField(lat, lon, -0.66, 0.48, 0.84, 0.024, -0.18, 1.4);

  const fractured = fbm2D(lon * 7.0 - 2.0, lat * 6.0 + 4.0, seed + 1, 3);
  return clamp(Math.max(scarA, scarB, scarC, scarD, 0) * (fractured > -0.25 ? 1 : 0.34), 0, 1);
}

function sampleShelfDepressions(lat, lon, world) {
  const shelfA = ribbonField(lat, lon, 0.28, -2.22, 1.44, 0.090, 0.16, 1.0);
  const shelfB = ribbonField(lat, lon, -0.36, 1.96, 1.34, 0.092, -0.18, -1.0);
  const shelfC = ribbonField(lat, lon, 0.58, 0.42, 1.00, 0.078, -0.36, 2.0);
  const shelfD = ribbonField(lat, lon, -0.62, -0.82, 1.04, 0.082, 0.30, -2.1);

  return clamp(Math.max(shelfA, shelfB, shelfC, shelfD, 0), 0, 1);
}

function sampleSublevel(lat, lon, world) {
  const seed = world.seed;

  const global = warp2D(lon * 0.62, lat * 0.68, seed + 1, 0.40, 0.28);
  const local = warp2D(lon * 1.34, lat * 1.18, seed + 2, 0.16, 0.12);

  const shellPressure =
    fbm2D(global.x * 0.56 + 3.1, global.y * 0.64 - 4.4, seed + 10, 4) * 0.34 +
    fbm2D(global.x * 1.15 - 7.6, global.y * 1.06 + 2.8, seed + 11, 4) * 0.17 +
    fbm2D(local.x * 2.10 + 1.7, local.y * 1.86 - 5.9, seed + 12, 3) * 0.075;

  const longRidgeA = ribbonField(global.y, global.x, 0.16, -1.22, 1.72, 0.105, -0.38, 0.4);
  const longRidgeB = ribbonField(global.y, global.x, -0.18, 0.86, 1.50, 0.095, 0.34, 2.1);
  const longRidgeC = ribbonField(global.y, global.x, 0.52, 0.18, 1.20, 0.090, -0.12, -1.2);
  const longRidgeD = ribbonField(global.y, global.x, -0.58, -0.52, 1.28, 0.095, 0.24, 1.7);

  const ridgeSystem =
    Math.max(longRidgeA, longRidgeB, longRidgeC, longRidgeD, 0) * 0.28 +
    ridge2D(local.x * 1.55 + 4.2, local.y * 1.50 - 7.2, seed + 20) * 0.16 +
    ridge2D(local.x * 2.90 - 8.1, local.y * 2.70 + 3.8, seed + 21) * 0.075;

  const dryOceanFloor = sampleDryOceanBasins(global.y, global.x, world);
  const dryRiverbed = sampleDryRiverbeds(global.y, global.x, world);
  const canyon = sampleCanyonCuts(global.y, global.x, world);
  const trench = sampleTrenches(global.y, global.x, world);
  const cliff = sampleCliffPressure(global.y, global.x, world);
  const cavern = sampleCavernPressure(global.y, global.x, world);
  const scar = sampleCrustalScars(global.y, global.x, world);
  const shelf = sampleShelfDepressions(global.y, global.x, world);

  const polarCompression = smoothstep(1.02, 1.50, Math.abs(lat)) * 0.15;
  const equatorialPlateSpread = (1 - smoothstep(0.18, 1.10, Math.abs(lat))) * 0.065;

  const carvingCut =
    dryOceanFloor * 0.24 +
    dryRiverbed * 0.13 +
    canyon * 0.18 +
    trench * 0.20 +
    cavern * 0.18 +
    shelf * 0.12;

  const uplift =
    ridgeSystem * 0.30 +
    cliff * 0.08 +
    scar * 0.035 +
    polarCompression;

  const elevation =
    shellPressure +
    uplift -
    carvingCut -
    equatorialPlateSpread;

  const relief = clamp((elevation + 0.58) / 1.12, 0, 1);
  const ridge = clamp(ridgeSystem * 1.48 + cliff * 0.44 + scar * 0.12, 0, 1);
  const basin = clamp(dryOceanFloor * 0.92 + shelf * 0.36 + smoothstep(-0.38, -0.06, -elevation) * 0.26, 0, 1);
  const fault = clamp(trench * 0.70 + scar * 0.48 + canyon * 0.24, 0, 1);

  const fine =
    fbm2D(local.x * 4.20 + 9.0, local.y * 3.80 - 6.0, seed + 31, 3) * 0.42 +
    ridge2D(local.x * 5.40 - 2.0, local.y * 5.00 + 8.0, seed + 32) * 0.34 +
    scar * 0.24;

  return {
    relief,
    ridge,
    basin,
    fault,
    trench,
    canyon,
    cliff,
    cavern,
    dryRiverbed,
    dryOceanFloor,
    shelf,
    scar,
    fine: clamp((fine + 1) * 0.5, 0, 1),
    polarCompression
  };
}

function colorForSublevel(sample, world, light, rim) {
  let base = mixColor(world.low, world.base, 0.50 + sample.relief * 0.30);

  if (sample.dryOceanFloor > 0.24) {
    base = mixColor(base, world.low, clamp(sample.dryOceanFloor * 0.54, 0, 0.62));
  }

  if (sample.shelf > 0.26) {
    base = mixColor(base, world.mid, clamp(sample.shelf * 0.16, 0, 0.18));
    base = mixColor(base, world.low, clamp(sample.shelf * 0.20, 0, 0.26));
  }

  if (sample.basin > 0.24) {
    base = mixColor(base, world.low, clamp(sample.basin * 0.44, 0, 0.54));
  }

  if (sample.cavern > 0.36) {
    base = mixColor(base, world.cavern, clamp((sample.cavern - 0.28) * 0.60, 0, 0.44));
  }

  if (sample.dryRiverbed > 0.34) {
    base = mixColor(base, world.cavern, clamp(sample.dryRiverbed * 0.22, 0, 0.24));
    base = mixColor(base, world.exposed, clamp((sample.dryRiverbed - 0.42) * 0.16, 0, 0.12));
  }

  if (sample.canyon > 0.34 || sample.trench > 0.34) {
    base = mixColor(base, world.cavern, clamp(Math.max(sample.canyon, sample.trench) * 0.28, 0, 0.34));
  }

  if (sample.cliff > 0.34) {
    base = mixColor(base, world.exposed, clamp((sample.cliff - 0.26) * 0.48, 0, 0.28));
  }

  if (sample.relief > 0.56) {
    base = mixColor(base, world.mid, clamp((sample.relief - 0.56) * 0.88, 0, 0.48));
  }

  if (sample.relief > 0.74 || sample.ridge > 0.54) {
    base = mixColor(base, world.high, clamp(Math.max(sample.relief - 0.72, sample.ridge - 0.48) * 0.68, 0, 0.42));
  }

  if (sample.ridge > 0.68) {
    base = mixColor(base, world.ridge, clamp((sample.ridge - 0.68) * 0.62, 0, 0.26));
  }

  if (sample.fault > 0.62) {
    base = mixColor(base, world.fault, clamp((sample.fault - 0.62) * 0.50, 0, 0.16));
  }

  const depthShadow =
    sample.dryOceanFloor * 0.12 +
    sample.trench * 0.12 +
    sample.canyon * 0.08 +
    sample.cavern * 0.16;

  const highlight =
    sample.cliff * 0.06 +
    sample.ridge * 0.04 +
    sample.scar * 0.03;

  const texture = (sample.fine - 0.5) * 9.0;
  const shade = clamp(light + rim * 0.14 + highlight - depthShadow, 0.12, 1.20);

  const r = Math.round(clamp((base[0] + texture) * shade, 0, 255));
  const g = Math.round(clamp((base[1] + texture * 0.76) * shade, 0, 255));
  const b = Math.round(clamp((base[2] + texture * 0.58) * shade, 0, 255));

  return `rgb(${r},${g},${b})`;
}

function makeSurfacePatch(lat0, lat1, lon0, lon1, view) {
  const p00 = rotateX(rotateY(makePoint(lat0, lon0), view.yaw), view.pitch);
  const p01 = rotateX(rotateY(makePoint(lat0, lon1), view.yaw), view.pitch);
  const p11 = rotateX(rotateY(makePoint(lat1, lon1), view.yaw), view.pitch);
  const p10 = rotateX(rotateY(makePoint(lat1, lon0), view.yaw), view.pitch);

  const avg = normalize({
    x: (p00.x + p01.x + p11.x + p10.x) * 0.25,
    y: (p00.y + p01.y + p11.y + p10.y) * 0.25,
    z: (p00.z + p01.z + p11.z + p10.z) * 0.25
  });

  if (avg.z < -0.04) return null;

  return {
    points: [
      project(p00, view),
      project(p01, view),
      project(p11, view),
      project(p10, view)
    ],
    normal: avg,
    depth: avg.z,
    lat: (lat0 + lat1) * 0.5,
    lon: (lon0 + lon1) * 0.5
  };
}

function pathPatch(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  ctx.lineTo(points[1].x, points[1].y);
  ctx.lineTo(points[2].x, points[2].y);
  ctx.lineTo(points[3].x, points[3].y);
  ctx.closePath();
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

  bg.addColorStop(0, "#13264a");
  bg.addColorStop(0.30, "#091832");
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
    width * 0.39
  );

  halo.addColorStop(0, world.glow);
  halo.addColorStop(0.38, "rgba(142,190,255,0.075)");
  halo.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.ellipse(width * 0.5, height * 0.50, width * 0.34, height * 0.31, 0, 0, Math.PI * 2);
  ctx.fill();

  const vignette = ctx.createRadialGradient(
    width * 0.5,
    height * 0.5,
    width * 0.20,
    width * 0.5,
    height * 0.5,
    width * 0.74
  );

  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.48)");

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
  const glow = ctx.createRadialGradient(view.cx, y, 0, view.cx, y, view.scale * 0.66);

  glow.addColorStop(0, world.glow);
  glow.addColorStop(0.38, "rgba(80,120,180,0.10)");
  glow.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(view.cx, y, view.scale * 0.58, view.scale * 0.13, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawSphereBase(ctx, view) {
  const world = WORLDS[state.worldKey];

  ctx.save();

  const base = ctx.createRadialGradient(
    view.cx - view.scale * 0.22,
    view.cy - view.scale * 0.24,
    view.scale * 0.04,
    view.cx,
    view.cy,
    view.scale * 1.08
  );

  const lightBase = mixColor(world.base, world.ridge, 0.12);
  const darkBase = mixColor(world.low, [0, 0, 0], 0.18);

  base.addColorStop(0, colorString(lightBase));
  base.addColorStop(0.54, colorString(world.base));
  base.addColorStop(1, colorString(darkBase));

  ctx.fillStyle = base;
  ctx.beginPath();
  ctx.arc(view.cx, view.cy, view.scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawSurface(ctx, view) {
  const world = WORLDS[state.worldKey];
  const light = normalize({ x: -0.28, y: 0.54, z: 0.92 });
  const patches = [];

  for (let latIndex = 0; latIndex < PORTRAIT_LAT_STEPS; latIndex += 1) {
    const lat0 = -Math.PI / 2 + (latIndex / PORTRAIT_LAT_STEPS) * Math.PI;
    const lat1 = -Math.PI / 2 + ((latIndex + 1) / PORTRAIT_LAT_STEPS) * Math.PI;

    for (let lonIndex = 0; lonIndex < PORTRAIT_LON_STEPS; lonIndex += 1) {
      const lon0 = -Math.PI + (lonIndex / PORTRAIT_LON_STEPS) * Math.PI * 2;
      const lon1 = -Math.PI + ((lonIndex + 1) / PORTRAIT_LON_STEPS) * Math.PI * 2;
      const patch = makeSurfacePatch(lat0, lat1, lon0, lon1, view);
      if (patch) patches.push(patch);
    }
  }

  patches.sort((a, b) => a.depth - b.depth);

  ctx.save();
  ctx.beginPath();
  ctx.arc(view.cx, view.cy, view.scale * 1.002, 0, Math.PI * 2);
  ctx.clip();

  for (const patch of patches) {
    const sample = sampleSublevel(patch.lat, patch.lon, world);
    const diffuse = clamp(dot(patch.normal, light), 0, 1);
    const rim = Math.pow(clamp(1 - Math.abs(patch.normal.z), 0, 1), 2.0);
    const lightValue = 0.36 + diffuse * 0.62 + rim * 0.06;

    pathPatch(ctx, patch.points);
    ctx.fillStyle = colorForSublevel(sample, world, lightValue, rim);
    ctx.fill();
  }

  ctx.restore();
}

function makeProjectedPolyline(view, latFn, lonStart, lonEnd, steps = 82) {
  const points = [];

  for (let j = 0; j <= steps; j += 1) {
    const u = j / steps;
    const lon = lonStart + (lonEnd - lonStart) * u;
    const lat = latFn(lon, u);
    const p = makePoint(lat, lon);
    const r = rotateX(rotateY(p, view.yaw), view.pitch);
    if (r.z > 0.04) points.push(project(r, view));
  }

  return points;
}

function strokePolyline(ctx, points) {
  if (points.length < 3) return;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }

  ctx.stroke();
}

function drawCarvingLines(ctx, view) {
  const world = WORLDS[state.worldKey];

  ctx.save();
  ctx.beginPath();
  ctx.arc(view.cx, view.cy, view.scale * 1.002, 0, Math.PI * 2);
  ctx.clip();

  ctx.globalCompositeOperation = "screen";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const contourCount = MOBILE ? 6 : 9;

  for (let i = 0; i < contourCount; i += 1) {
    const latBase = lerp(-0.82, 0.82, i / Math.max(1, contourCount - 1)) + Math.sin(i * 1.3) * 0.04;

    const points = makeProjectedPolyline(
      view,
      (lon) => latBase + Math.sin(lon * 1.8 + i * 0.7) * 0.018,
      -2.80,
      2.80,
      72
    );

    ctx.strokeStyle = colorWithAlpha(world.fault, 0.040);
    ctx.lineWidth = Math.max(0.30, DPR * 0.30);
    strokePolyline(ctx, points);
  }

  const riverLines = [
    { lat: 0.34, lonA: -2.18, lonB: -0.56, angle: -0.48, phase: 0.2 },
    { lat: -0.18, lonA: 0.10, lonB: 1.70, angle: 0.36, phase: 1.7 },
    { lat: 0.54, lonA: -0.66, lonB: 0.90, angle: -0.12, phase: -1.1 },
    { lat: -0.52, lonA: -1.28, lonB: 0.08, angle: 0.26, phase: 2.3 }
  ];

  ctx.strokeStyle = "rgba(10,14,20,0.30)";
  ctx.lineWidth = Math.max(0.55, DPR * 0.55);

  riverLines.forEach((line, index) => {
    const points = makeProjectedPolyline(
      view,
      (lon, u) => line.lat + Math.sin((u * 4.5) + line.phase) * 0.028 + Math.sin(lon * 2.2 + index) * 0.012,
      line.lonA,
      line.lonB,
      64
    );
    strokePolyline(ctx, points);
  });

  ctx.globalCompositeOperation = "source-over";
  ctx.strokeStyle = "rgba(235,205,154,0.075)";
  ctx.lineWidth = Math.max(0.38, DPR * 0.36);

  const cliffLines = [
    { lat: 0.18, lonA: -1.82, lonB: -0.62, phase: 0.6 },
    { lat: -0.30, lonA: 0.32, lonB: 1.68, phase: 1.8 },
    { lat: 0.62, lonA: -0.50, lonB: 0.70, phase: -1.0 }
  ];

  cliffLines.forEach((line, index) => {
    const points = makeProjectedPolyline(
      view,
      (lon, u) => line.lat + Math.sin(u * 5.2 + line.phase) * 0.020 + Math.sin(lon * 1.5 + index) * 0.010,
      line.lonA,
      line.lonB,
      60
    );
    strokePolyline(ctx, points);
  });

  ctx.globalCompositeOperation = "screen";
  ctx.strokeStyle = colorWithAlpha(world.fault, 0.055);
  ctx.lineWidth = Math.max(0.42, DPR * 0.40);

  const faultLines = [
    { lat: 0.02, lonA: -0.88, lonB: 1.10, phase: 0.9 },
    { lat: 0.40, lonA: -2.30, lonB: -1.18, phase: 2.0 },
    { lat: -0.38, lonA: 0.64, lonB: 1.92, phase: -0.8 }
  ];

  faultLines.forEach((line, index) => {
    const points = makeProjectedPolyline(
      view,
      (lon, u) => line.lat + Math.sin(u * 6.0 + line.phase) * 0.018 + Math.sin(lon * 2.9 + index) * 0.012,
      line.lonA,
      line.lonB,
      66
    );
    strokePolyline(ctx, points);
  });

  ctx.restore();
}

function drawAtmosphere(ctx, view) {
  const world = WORLDS[state.worldKey];

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const outer = ctx.createRadialGradient(view.cx, view.cy, view.scale * 0.76, view.cx, view.cy, view.scale * 1.13);
  outer.addColorStop(0, "rgba(0,0,0,0)");
  outer.addColorStop(0.72, "rgba(142,190,255,0.10)");
  outer.addColorStop(1, world.glow);

  ctx.fillStyle = outer;
  ctx.beginPath();
  ctx.arc(view.cx, view.cy, view.scale * 1.10, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(210,240,255,0.23)";
  ctx.lineWidth = Math.max(1, DPR * 1.1);
  ctx.beginPath();
  ctx.arc(view.cx, view.cy, view.scale * 1.006, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawOrbitLines(ctx, view) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  ctx.strokeStyle = "rgba(244,191,96,0.10)";
  ctx.lineWidth = Math.max(0.7, DPR * 0.75);
  ctx.beginPath();
  ctx.ellipse(view.cx, view.cy, view.scale * 1.52, view.scale * 0.35, -0.12, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(142,190,255,0.07)";
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
  ctx.fillText(world.title, width * 0.5, height * 0.165);

  ctx.fillStyle = "rgba(186,197,212,0.72)";
  ctx.font = `850 ${Math.max(11 * DPR, width * 0.014)}px Inter, system-ui, sans-serif`;
  ctx.fillText(`${world.subtitle} · dry sub-level carvings`, width * 0.5, height * 0.205);

  ctx.restore();
}

function drawCue(ctx, width, height) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(186,197,212,0.60)";
  ctx.font = `800 ${Math.max(11 * DPR, width * 0.013)}px Inter, system-ui, sans-serif`;
  ctx.fillText("Drag to inspect · Dry carvings only · Open room for private map", width * 0.5, height * 0.90);
  ctx.restore();
}

function drawPlanet(ctx, width, height) {
  const scale = Math.min(width * 0.34, height * 0.37);

  const view = {
    cx: width * 0.50,
    cy: height * 0.49,
    scale,
    yaw: state.yaw,
    pitch: state.pitch
  };

  drawGlobeShadow(ctx, view);
  drawSphereBase(ctx, view);
  drawSurface(ctx, view);
  drawCarvingLines(ctx, view);
  drawAtmosphere(ctx, view);
  drawOrbitLines(ctx, view);
  drawWorldTitle(ctx, width, height);
  drawCue(ctx, width, height);

  document.documentElement.dataset.globeShowcaseModel = MODEL_NAME;
  document.documentElement.dataset.selectedWorld = state.worldKey;
  document.documentElement.dataset.publicPortraitBaseline = "sublevel-carving";
  document.documentElement.dataset.privateEnginesAsleep = "true";
  document.documentElement.dataset.mapExpression = "false";
  document.documentElement.dataset.waterExpression = "false";
  document.documentElement.dataset.landmassExpression = "false";
  document.documentElement.dataset.childTerrainImport = "false";
  document.documentElement.dataset.mountainSystem = "false";
  document.documentElement.dataset.carvingExpression = "true";
  document.documentElement.dataset.dryRiverbeds = "true";
  document.documentElement.dataset.dryOceanFloors = "true";
  document.documentElement.dataset.cliffs = "true";
  document.documentElement.dataset.caverns = "true";
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
      state.targetYaw += 0.00095;
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
    publicPortraitBaseline: "sublevel-carving",
    privateEnginesAsleep: true,
    generatedImage: false,
    graphicBox: false,
    mapExpression: false,
    waterExpression: false,
    landmassExpression: false,
    childTerrainImport: false,
    mountainSystem: false,
    carvingExpression: true,
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
        publicPortraitBaseline: "sublevel-carving",
        privateEnginesAsleep: true,
        generatedImage: false,
        graphicBox: false,
        mapExpression: false,
        waterExpression: false,
        landmassExpression: false,
        childTerrainImport: false,
        mountainSystem: false,
        carvingExpression: true,
        dryRiverbeds: true,
        dryOceanFloors: true,
        cliffs: true,
        caverns: true,
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
  publicPortraitBaseline: "sublevel-carving",
  privateEnginesAsleep: true,
  generatedImage: false,
  graphicBox: false,
  mapExpression: false,
  waterExpression: false,
  landmassExpression: false,
  childTerrainImport: false,
  mountainSystem: false,
  carvingExpression: true,
  parentCellCount: CELL_COUNT,
  childFieldsPerParent: CHILD_HEX_COUNT,
  totalChildFields: TOTAL_CHILD_FIELDS,
  sublevelModel: SUBLEVEL_MODEL
};

// /showroom/globe/index.js
// TNT FULL-FILE REPLACEMENT
// SHOWROOM_GLOBE_ACTUAL_PLANET_SHADER_TNT_v1
// Role: public Globe Showcase selector only.
// Visual law: actual cinematic dry planet render.
// Method: screen-space sphere sampling, continuous height field, pseudo-normal lighting, atmospheric rim.
// Forbidden here: water fill, landmass map, coastlines, beaches, child imports, private engines, mountain system.

const MODEL_NAME = "showroom-globe-actual-planet-shader-v1";

const REDUCED_MOTION = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
const MOBILE = window.matchMedia?.("(max-width: 760px)")?.matches === true;
const DPR = Math.min(window.devicePixelRatio || 1, MOBILE ? 1.25 : 1.7);
const FRAME_MS = MOBILE ? 92 : 72;

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

const RASTER_LIMIT = MOBILE ? 330 : 520;

const SUBLEVEL_MODEL = Object.freeze({
  parentCells: CELL_COUNT,
  childFieldsPerParent: CHILD_HEX_COUNT,
  totalChildFields: TOTAL_CHILD_FIELDS,
  publicMode: "actual dry planet shader",
  privateEnginesAsleep: true,
  mapExpression: false,
  waterExpression: false,
  landmassExpression: false,
  childTerrainImport: false,
  mountainSystem: false,
  planetShader: true,
  continuousSurface: true,
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
    crustDark: [32, 33, 35],
    crustLow: [73, 64, 55],
    crustMid: [129, 110, 82],
    crustHigh: [188, 161, 110],
    ridge: [232, 213, 168],
    exposed: [216, 179, 116],
    basin: [45, 42, 38],
    fault: [205, 214, 196],
    atmosphere: [142, 190, 255],
    glow: "rgba(142,190,255,0.22)"
  },
  hEarth: {
    key: "hEarth",
    title: "H-Earth",
    subtitle: "Hybrid Earth",
    route: "/showroom/globe/h-earth/",
    seed: 710,
    crustDark: [24, 34, 31],
    crustLow: [56, 72, 60],
    crustMid: [112, 125, 91],
    crustHigh: [181, 162, 105],
    ridge: [231, 217, 162],
    exposed: [214, 175, 104],
    basin: [23, 31, 30],
    fault: [158, 242, 196],
    atmosphere: [143, 240, 195],
    glow: "rgba(143,240,195,0.22)"
  },
  audralia: {
    key: "audralia",
    title: "Audralia",
    subtitle: "Constructed World",
    route: "/showroom/globe/audralia/",
    seed: 910,
    crustDark: [36, 30, 50],
    crustLow: [72, 60, 78],
    crustMid: [134, 106, 92],
    crustHigh: [190, 146, 94],
    ridge: [235, 203, 150],
    exposed: [223, 164, 108],
    basin: [25, 22, 36],
    fault: [198, 172, 255],
    atmosphere: [190, 170, 255],
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

function fbm2D(x, y, seed = 0, octaves = 5) {
  let value = 0;
  let amplitude = 0.52;
  let frequency = 1;
  let total = 0;

  for (let octave = 0; octave < octaves; octave += 1) {
    value += valueNoise2D(x * frequency, y * frequency, seed + octave * 29) * amplitude;
    total += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return value / total;
}

function ridge2D(x, y, seed = 0, octaves = 4) {
  return 1 - Math.abs(fbm2D(x, y, seed, octaves));
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
    Math.sin(xr * 2.8 + phase) * 0.075 +
    Math.sin(xr * 5.6 - phase) * 0.028 +
    Math.sin(xr * 9.0 + phase * 0.7) * 0.011;

  const along = Math.abs(xr) / length;
  const across = Math.abs(curved) / width;

  return clamp(1 - Math.max(along * 0.72, across), 0, 1);
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

  createStars(MOBILE ? 56 : 122);
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

function sampleDryBasins(lat, lon, world) {
  const seed = world.seed + 200;

  const broadA = basinField(lat, lon, 0.18, -2.00, 0.58, 0.52);
  const broadB = basinField(lat, lon, -0.36, 1.72, 0.50, 0.56);
  const broadC = basinField(lat, lon, 0.72, 0.58, 0.34, 0.70);
  const broadD = basinField(lat, lon, -0.74, -1.02, 0.34, 0.66);
  const broadE = basinField(lat, lon, -0.10, 0.14, 0.40, 0.46);

  const fracturedFloor =
    fbm2D(lon * 0.88 + 1.6, lat * 0.92 - 3.4, seed + 1, 5) * 0.12 +
    fbm2D(lon * 1.80 - 4.4, lat * 1.52 + 2.3, seed + 2, 4) * 0.05;

  return clamp(Math.max(broadA, broadB, broadC, broadD, broadE) * 0.90 + fracturedFloor, 0, 1);
}

function sampleDryChannels(lat, lon, world) {
  const seed = world.seed + 300;

  const riverA = ribbonField(lat, lon, 0.34, -1.32, 1.08, 0.025, -0.48, 0.2);
  const riverB = ribbonField(lat, lon, -0.18, 0.78, 1.18, 0.027, 0.36, 1.7);
  const riverC = ribbonField(lat, lon, 0.54, 0.22, 0.94, 0.023, -0.12, -1.1);
  const riverD = ribbonField(lat, lon, -0.52, -0.58, 1.02, 0.026, 0.26, 2.3);
  const riverE = ribbonField(lat, lon, 0.08, 1.72, 0.82, 0.023, -0.58, -0.4);

  const breakup = fbm2D(lon * 5.8 + 2.0, lat * 5.1 - 6.0, seed + 1, 4);
  const braided =
    ridge2D(lon * 7.0 - 1.0, lat * 6.0 + 3.0, seed + 2, 3) * 0.20;

  const active = breakup > -0.40 ? 1 : 0.38;

  return clamp(Math.max(riverA, riverB, riverC, riverD, riverE, 0) * active + braided * 0.22, 0, 1);
}

function sampleCanyons(lat, lon, world) {
  const seed = world.seed + 400;

  const canyonA = ribbonField(lat, lon, 0.04, -0.12, 1.74, 0.036, 0.10, 0.9);
  const canyonB = ribbonField(lat, lon, 0.40, -1.88, 0.94, 0.035, 0.44, 2.0);
  const canyonC = ribbonField(lat, lon, -0.38, 1.30, 1.04, 0.037, -0.38, -0.8);
  const canyonD = ribbonField(lat, lon, -0.02, 2.42, 1.30, 0.035, -0.14, 1.2);
  const canyonE = ribbonField(lat, lon, 0.08, -2.54, 1.34, 0.036, 0.16, -1.4);

  const serration = ridge2D(lon * 5.8 - 3.0, lat * 5.3 + 7.2, seed + 1, 4);
  return clamp(Math.max(canyonA, canyonB, canyonC, canyonD, canyonE, 0) * (0.70 + serration * 0.30), 0, 1);
}

function sampleCliffPressure(lat, lon, world) {
  const seed = world.seed + 500;

  const escarpA = ribbonField(lat, lon, 0.18, -1.08, 1.18, 0.048, -0.56, 0.6);
  const escarpB = ribbonField(lat, lon, -0.30, 0.98, 1.26, 0.050, 0.48, 1.8);
  const escarpC = ribbonField(lat, lon, 0.62, 0.08, 0.92, 0.045, -0.10, -1.0);
  const escarpD = ribbonField(lat, lon, -0.64, -0.76, 0.96, 0.047, 0.32, 2.4);

  const brokenFace = ridge2D(lon * 3.6 + 4.0, lat * 3.3 - 2.0, seed + 1, 4);
  return clamp(Math.max(escarpA, escarpB, escarpC, escarpD, 0) * (0.52 + brokenFace * 0.48), 0, 1);
}

function sampleCaverns(lat, lon, world) {
  const seed = world.seed + 600;

  const sinkA = basinField(lat, lon, 0.16, -1.46, 0.075, 0.105);
  const sinkB = basinField(lat, lon, -0.18, 0.70, 0.090, 0.125);
  const sinkC = basinField(lat, lon, 0.48, 0.34, 0.075, 0.125);
  const sinkD = basinField(lat, lon, -0.44, -0.32, 0.085, 0.145);
  const sinkE = basinField(lat, lon, 0.02, 1.58, 0.075, 0.120);

  const porous = fbm2D(lon * 6.4 + 8.0, lat * 5.9 - 3.0, seed + 1, 4);
  const gate = porous > 0.02 ? 1 : 0.42;

  return clamp(Math.max(sinkA, sinkB, sinkC, sinkD, sinkE) * gate, 0, 1);
}

function sampleCrustalScars(lat, lon, world) {
  const seed = world.seed + 700;

  const scarA = ribbonField(lat, lon, 0.24, -0.74, 1.18, 0.018, 0.72, 0.3);
  const scarB = ribbonField(lat, lon, -0.26, 1.34, 1.08, 0.018, -0.64, -1.7);
  const scarC = ribbonField(lat, lon, 0.70, -0.12, 0.82, 0.017, 0.12, 2.8);
  const scarD = ribbonField(lat, lon, -0.66, 0.48, 0.84, 0.017, -0.18, 1.4);

  const fractured = fbm2D(lon * 7.2 - 2.0, lat * 6.4 + 4.0, seed + 1, 4);
  return clamp(Math.max(scarA, scarB, scarC, scarD, 0) * (fractured > -0.28 ? 1 : 0.34), 0, 1);
}

function sampleCrustalRidges(lat, lon, world) {
  const seed = world.seed + 800;

  const arcA = ribbonField(lat, lon, 0.16, -1.22, 1.72, 0.090, -0.38, 0.4);
  const arcB = ribbonField(lat, lon, -0.18, 0.86, 1.50, 0.084, 0.34, 2.1);
  const arcC = ribbonField(lat, lon, 0.52, 0.18, 1.20, 0.080, -0.12, -1.2);
  const arcD = ribbonField(lat, lon, -0.58, -0.52, 1.28, 0.084, 0.24, 1.7);

  const stoneFold =
    ridge2D(lon * 1.55 + 4.2, lat * 1.50 - 7.2, seed + 1, 4) * 0.18 +
    ridge2D(lon * 2.90 - 8.1, lat * 2.70 + 3.8, seed + 2, 4) * 0.09;

  return clamp(Math.max(arcA, arcB, arcC, arcD, 0) * 0.34 + stoneFold, 0, 1);
}

function samplePlanetHeight(lat, lon, world) {
  const seed = world.seed;

  const global = warp2D(lon * 0.62, lat * 0.68, seed + 1, 0.40, 0.28);
  const local = warp2D(lon * 1.34, lat * 1.18, seed + 2, 0.16, 0.12);

  const basePressure =
    fbm2D(global.x * 0.52 + 3.1, global.y * 0.60 - 4.4, seed + 10, 5) * 0.34 +
    fbm2D(global.x * 1.10 - 7.6, global.y * 1.02 + 2.8, seed + 11, 5) * 0.18 +
    fbm2D(local.x * 2.00 + 1.7, local.y * 1.82 - 5.9, seed + 12, 4) * 0.08;

  const basins = sampleDryBasins(global.y, global.x, world);
  const channels = sampleDryChannels(global.y, global.x, world);
  const canyons = sampleCanyons(global.y, global.x, world);
  const cliffs = sampleCliffPressure(global.y, global.x, world);
  const caverns = sampleCaverns(global.y, global.x, world);
  const scars = sampleCrustalScars(global.y, global.x, world);
  const ridges = sampleCrustalRidges(global.y, global.x, world);

  const polarCompression = smoothstep(1.02, 1.50, Math.abs(lat)) * 0.13;
  const equatorialSpread = (1 - smoothstep(0.18, 1.10, Math.abs(lat))) * 0.055;

  const height =
    basePressure +
    ridges * 0.32 +
    cliffs * 0.10 +
    scars * 0.035 +
    polarCompression -
    basins * 0.30 -
    channels * 0.18 -
    canyons * 0.28 -
    caverns * 0.22 -
    equatorialSpread;

  return height;
}

function samplePlanetMaterial(lat, lon, world) {
  const seed = world.seed;
  const height = samplePlanetHeight(lat, lon, world);

  const global = warp2D(lon * 0.62, lat * 0.68, seed + 1, 0.40, 0.28);

  const basins = sampleDryBasins(global.y, global.x, world);
  const channels = sampleDryChannels(global.y, global.x, world);
  const canyons = sampleCanyons(global.y, global.x, world);
  const cliffs = sampleCliffPressure(global.y, global.x, world);
  const caverns = sampleCaverns(global.y, global.x, world);
  const scars = sampleCrustalScars(global.y, global.x, world);
  const ridges = sampleCrustalRidges(global.y, global.x, world);

  const micro =
    fbm2D(lon * 4.20 + 9.0, lat * 3.80 - 6.0, seed + 31, 4) * 0.42 +
    ridge2D(lon * 5.40 - 2.0, lat * 5.00 + 8.0, seed + 32, 4) * 0.34 +
    scars * 0.24;

  return {
    height,
    relief: clamp((height + 0.62) / 1.20, 0, 1),
    basins,
    channels,
    canyons,
    cliffs,
    caverns,
    scars,
    ridges,
    micro: clamp((micro + 1) * 0.5, 0, 1)
  };
}

function tangentVectors(lat, lon) {
  const sinLat = Math.sin(lat);
  const cosLat = Math.cos(lat);
  const sinLon = Math.sin(lon);
  const cosLon = Math.cos(lon);

  return {
    north: normalize({
      x: -sinLat * cosLon,
      y: cosLat,
      z: -sinLat * sinLon
    }),
    east: normalize({
      x: -sinLon,
      y: 0,
      z: cosLon
    })
  };
}

function samplePlanetNormal(lat, lon, world, basePoint) {
  const epsLat = 0.010;
  const epsLon = 0.010;

  const hN = samplePlanetHeight(lat + epsLat, lon, world);
  const hS = samplePlanetHeight(lat - epsLat, lon, world);
  const hE = samplePlanetHeight(lat, lon + epsLon, world);
  const hW = samplePlanetHeight(lat, lon - epsLon, world);

  const dLat = (hN - hS) / (epsLat * 2);
  const dLon = (hE - hW) / (epsLon * 2);

  const tangents = tangentVectors(lat, lon);
  const strength = 0.34;

  return normalize({
    x: basePoint.x - tangents.north.x * dLat * strength - tangents.east.x * dLon * strength,
    y: basePoint.y - tangents.north.y * dLat * strength - tangents.east.y * dLon * strength,
    z: basePoint.z - tangents.north.z * dLat * strength - tangents.east.z * dLon * strength
  });
}

function materialColor(material, world) {
  let base = mixColor(world.crustLow, world.crustMid, 0.35 + material.relief * 0.42);

  if (material.basins > 0.22) {
    base = mixColor(base, world.basin, clamp(material.basins * 0.58, 0, 0.66));
  }

  if (material.caverns > 0.28) {
    base = mixColor(base, world.crustDark, clamp(material.caverns * 0.70, 0, 0.58));
  }

  if (material.channels > 0.34) {
    base = mixColor(base, world.crustDark, clamp(material.channels * 0.30, 0, 0.32));
    base = mixColor(base, world.exposed, clamp((material.channels - 0.40) * 0.20, 0, 0.14));
  }

  if (material.canyons > 0.34) {
    base = mixColor(base, world.crustDark, clamp(material.canyons * 0.36, 0, 0.42));
    base = mixColor(base, world.exposed, clamp((material.canyons - 0.36) * 0.22, 0, 0.15));
  }

  if (material.cliffs > 0.30) {
    base = mixColor(base, world.exposed, clamp(material.cliffs * 0.46, 0, 0.36));
  }

  if (material.ridges > 0.52 || material.relief > 0.70) {
    base = mixColor(base, world.crustHigh, clamp(Math.max(material.ridges - 0.45, material.relief - 0.68) * 0.80, 0, 0.50));
  }

  if (material.ridges > 0.70) {
    base = mixColor(base, world.ridge, clamp((material.ridges - 0.66) * 0.70, 0, 0.30));
  }

  if (material.scars > 0.60) {
    base = mixColor(base, world.fault, clamp((material.scars - 0.58) * 0.42, 0, 0.14));
  }

  const texture = (material.micro - 0.5) * 11.0;

  return [
    clamp(base[0] + texture, 0, 255),
    clamp(base[1] + texture * 0.78, 0, 255),
    clamp(base[2] + texture * 0.54, 0, 255)
  ];
}

function shadePlanetPixel({ viewNormal, bumpViewNormal, material, world, lightView }) {
  const diffuse = clamp(dot(bumpViewNormal, lightView), 0, 1);
  const sphereLight = clamp(dot(viewNormal, lightView), 0, 1);
  const z = clamp(viewNormal.z, 0, 1);
  const rim = Math.pow(clamp(1 - z, 0, 1), 1.85);

  const terminator = smoothstep(-0.08, 0.72, sphereLight);
  const ambient = 0.14;
  const direct = diffuse * 0.88;
  const bodyShadow = lerp(0.22, 1.0, terminator);

  const basinShadow =
    material.basins * 0.16 +
    material.canyons * 0.14 +
    material.channels * 0.10 +
    material.caverns * 0.20;

  const reliefHighlight =
    material.cliffs * 0.08 +
    material.ridges * 0.06 +
    material.scars * 0.03;

  const base = materialColor(material, world);
  const shade = clamp((ambient + direct + reliefHighlight - basinShadow) * bodyShadow, 0.08, 1.18);

  const atmosphericLift = rim * 0.10;
  const color = [
    clamp(base[0] * shade + world.atmosphere[0] * atmosphericLift, 0, 255),
    clamp(base[1] * shade + world.atmosphere[1] * atmosphericLift, 0, 255),
    clamp(base[2] * shade + world.atmosphere[2] * atmosphericLift, 0, 255)
  ];

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

function ensureSurfaceBuffer(view) {
  const desired = Math.max(240, Math.min(RASTER_LIMIT, Math.round(view.scale * 1.82)));

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

function drawPlanetShaderSurface(ctx, view) {
  const world = WORLDS[state.worldKey];
  ensureSurfaceBuffer(view);

  const size = state.surfaceSize;
  const image = state.surfaceImage;
  const data = image.data;

  const lightView = normalize({ x: -0.54, y: 0.55, z: 0.78 });

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

      const lat = Math.asin(clamp(worldPoint.y, -1, 1));
      const lon = Math.atan2(worldPoint.z, worldPoint.x);

      const material = samplePlanetMaterial(lat, lon, world);
      const bumpWorldNormal = samplePlanetNormal(lat, lon, world, worldPoint);
      const bumpViewNormal = normalize(rotateX(rotateY(bumpWorldNormal, view.yaw), view.pitch));

      const color = shadePlanetPixel({
        viewNormal,
        bumpViewNormal,
        material,
        world,
        lightView
      });

      const edgeAlpha = 1 - smoothstep(0.965, 1.0, Math.sqrt(r2));
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
    view.scale * 1.18
  );

  outer.addColorStop(0, "rgba(0,0,0,0)");
  outer.addColorStop(0.67, `rgba(${a[0]},${a[1]},${a[2]},0.075)`);
  outer.addColorStop(0.92, `rgba(${a[0]},${a[1]},${a[2]},0.23)`);
  outer.addColorStop(1, `rgba(${a[0]},${a[1]},${a[2]},0.04)`);

  ctx.fillStyle = outer;
  ctx.beginPath();
  ctx.arc(view.cx, view.cy, view.scale * 1.14, 0, Math.PI * 2);
  ctx.fill();

  const limb = ctx.createRadialGradient(
    view.cx - view.scale * 0.12,
    view.cy - view.scale * 0.16,
    view.scale * 0.48,
    view.cx,
    view.cy,
    view.scale * 1.04
  );

  limb.addColorStop(0, "rgba(255,255,255,0)");
  limb.addColorStop(0.74, "rgba(255,255,255,0)");
  limb.addColorStop(1, `rgba(${a[0]},${a[1]},${a[2]},0.26)`);

  ctx.fillStyle = limb;
  ctx.beginPath();
  ctx.arc(view.cx, view.cy, view.scale * 1.01, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = `rgba(${a[0]},${a[1]},${a[2]},0.30)`;
  ctx.lineWidth = Math.max(1, DPR * 1.1);
  ctx.beginPath();
  ctx.arc(view.cx, view.cy, view.scale * 1.006, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawOrbitLines(ctx, view) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  ctx.strokeStyle = "rgba(244,191,96,0.075)";
  ctx.lineWidth = Math.max(0.65, DPR * 0.70);
  ctx.beginPath();
  ctx.ellipse(view.cx, view.cy, view.scale * 1.52, view.scale * 0.35, -0.12, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(142,190,255,0.050)";
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
  ctx.fillText(`${world.subtitle} · actual dry planet shader`, width * 0.5, height * 0.205);

  ctx.restore();
}

function drawCue(ctx, width, height) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(186,197,212,0.60)";
  ctx.font = `800 ${Math.max(11 * DPR, width * 0.013)}px Inter, system-ui, sans-serif`;
  ctx.fillText("Drag to inspect · Actual planet shader · Open room for private map", width * 0.5, height * 0.90);
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
  drawPlanetShaderSurface(ctx, view);
  drawAtmosphere(ctx, view);
  drawOrbitLines(ctx, view);
  drawWorldTitle(ctx, width, height);
  drawCue(ctx, width, height);

  document.documentElement.dataset.globeShowcaseModel = MODEL_NAME;
  document.documentElement.dataset.selectedWorld = state.worldKey;
  document.documentElement.dataset.publicPortraitBaseline = "actual-planet-shader";
  document.documentElement.dataset.privateEnginesAsleep = "true";
  document.documentElement.dataset.mapExpression = "false";
  document.documentElement.dataset.waterExpression = "false";
  document.documentElement.dataset.landmassExpression = "false";
  document.documentElement.dataset.childTerrainImport = "false";
  document.documentElement.dataset.mountainSystem = "false";
  document.documentElement.dataset.planetShader = "true";
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
      state.targetYaw += 0.00085;
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
    publicPortraitBaseline: "actual-planet-shader",
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
        publicPortraitBaseline: "actual-planet-shader",
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
  publicPortraitBaseline: "actual-planet-shader",
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
  polygonPatchSurface: false,
  parentCellCount: CELL_COUNT,
  childFieldsPerParent: CHILD_HEX_COUNT,
  totalChildFields: TOTAL_CHILD_FIELDS,
  sublevelModel: SUBLEVEL_MODEL
};

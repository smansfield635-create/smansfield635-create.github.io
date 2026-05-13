// /showroom/globe/index.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_PARENT_MACRO_SILHOUETTE_TNT_v1
// Role: lightweight public Globe Showcase selector.
// Change: H-Earth parent macro silhouette now uses organic tectonic pressure fields,
// subtractive ocean cuts, warped coastlines, peninsulas, bays, shelves, and island chains.
// Constraint: no child-256 visible fabric, no private engines, no GraphicBox, no image generation.

const MODEL_NAME = "globe-showcase-h-earth-parent-macro-silhouette-v1";

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

const PORTRAIT_LAT_STEPS = MOBILE ? 66 : 82;
const PORTRAIT_LON_STEPS = MOBILE ? 132 : 164;

const H_EARTH_PUBLIC_MODEL = Object.freeze({
  parentCells: CELL_COUNT,
  childFieldsPerParent: CHILD_HEX_COUNT,
  totalChildFields: TOTAL_CHILD_FIELDS,
  publicMode: "stable organic parent macro silhouette",
  privateModelPath: "/showroom/globe/h-earth/",
  assetAuthority: Object.freeze([
    "/assets/h-earth/h-earth.kernel.js",
    "/assets/h-earth/h-earth.lattice256.js",
    "/assets/h-earth/h-earth.landmap.js",
    "/assets/h-earth/h-earth.terrain.js",
    "/assets/h-earth/h-earth.surface.js",
    "/assets/h-earth/h-earth.canvas.js",
    "/assets/h-earth/h-earth.controls.js"
  ])
});

const WORLDS = Object.freeze({
  earth: {
    key: "earth",
    title: "Earth",
    subtitle: "Reference Body",
    route: "/showroom/globe/earth/",
    ocean: [30, 102, 164],
    deep: [10, 42, 92],
    land: [70, 145, 88],
    lowland: [66, 136, 82],
    highland: [132, 126, 96],
    coast: [201, 186, 126],
    freshwater: [86, 168, 204],
    ice: [192, 230, 244],
    glow: "rgba(142,190,255,0.22)"
  },
  hEarth: {
    key: "hEarth",
    title: "H-Earth",
    subtitle: "Hybrid Earth",
    route: "/showroom/globe/h-earth/",
    ocean: [33, 112, 166],
    deep: [7, 36, 96],
    land: [78, 154, 96],
    lowland: [68, 142, 88],
    highland: [136, 136, 102],
    coast: [211, 194, 132],
    freshwater: [96, 182, 212],
    ice: [188, 224, 240],
    glow: "rgba(143,240,195,0.22)"
  },
  audralia: {
    key: "audralia",
    title: "Audralia",
    subtitle: "Constructed World",
    route: "/showroom/globe/audralia/",
    ocean: [38, 110, 150],
    deep: [10, 40, 94],
    land: [140, 128, 82],
    lowland: [132, 120, 76],
    highland: [168, 148, 100],
    coast: [221, 196, 132],
    freshwater: [102, 174, 206],
    ice: [190, 226, 236],
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

function orientedPlateField(lat, lon, centerLat, centerLon, latRadius, lonRadius, angle, skew = 0) {
  const x = wrapLonDelta(lon, centerLon);
  const y = lat - centerLat;

  const c = Math.cos(angle);
  const s = Math.sin(angle);

  const xr = x * c - y * s;
  const yr = x * s + y * c;

  const bend = Math.sin((yr + skew) * 2.2) * 0.09 + Math.sin((xr - skew) * 1.7) * 0.04;
  const nx = (xr + bend) / lonRadius;
  const ny = yr / latRadius;

  const d = Math.sqrt(nx * nx + ny * ny);
  return 1 - d;
}

function ribbonField(lat, lon, centerLat, centerLon, length, width, angle, phase = 0) {
  const x = wrapLonDelta(lon, centerLon);
  const y = lat - centerLat;

  const c = Math.cos(angle);
  const s = Math.sin(angle);

  const xr = x * c - y * s;
  const yr = x * s + y * c;

  const curved = yr + Math.sin(xr * 2.6 + phase) * 0.075 + Math.sin(xr * 5.1 - phase) * 0.028;
  const along = Math.abs(xr) / length;
  const across = Math.abs(curved) / width;

  return 1 - Math.max(along * 0.72, across);
}

function gaussianDistance(lat, lon, centerLat, centerLon, latWidth, lonWidth) {
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

function finishTerrain(worldKey, lat, lon, elevation, ridge, moisture, freshwater = false) {
  const polar = Math.abs(lat) / (Math.PI / 2);
  const iceThreshold = worldKey === "audralia" ? 0.93 : 0.885;
  const iceFade = smoothstep(iceThreshold - 0.06, iceThreshold + 0.03, polar);
  const isIce = iceFade > 0.40;

  const seaLevel = 0;
  const water = (elevation < seaLevel || freshwater) && !isIce;
  const coast = !isIce && Math.abs(elevation - seaLevel) < 0.055;
  const shelf = water && elevation > -0.11 && !freshwater;
  const sea = water && elevation <= -0.11 && elevation > -0.30 && !freshwater;
  const mountain = !water && !isIce && elevation > 0.17 && ridge > 0.58;
  const highland = !water && !isIce && (elevation > 0.11 || mountain);
  const dry = !water && !isIce && moisture < 0.34 && elevation > 0.04;

  return {
    elevation,
    polar,
    ice: isIce,
    iceFade,
    land: !water || isIce,
    water,
    freshwater,
    coast,
    shelf,
    sea,
    mountain,
    highland,
    dry,
    ridge,
    moisture,
    detail: clamp((fbm2D(lon * 3.1 + 2, lat * 2.7 - 1, 199) + 1) * 0.5, 0, 1)
  };
}

function sampleEarth(lat, lon) {
  const w = warp2D(lon * 0.82, lat * 0.86, 301, 0.20, 0.15);
  const macro = fbm2D(w.x * 0.80, w.y * 0.92, 302, 4) * 0.34;
  const detail = fbm2D(w.x * 1.70, w.y * 1.45, 303, 3) * 0.10;

  const americas =
    gaussianDistance(lat, lon, 0.28, -1.90, 0.78, 0.76) +
    gaussianDistance(lat, lon, -0.36, -1.40, 0.55, 0.52) * 0.84;

  const euroAfrica =
    gaussianDistance(lat, lon, 0.32, 0.35, 0.74, 0.72) +
    gaussianDistance(lat, lon, -0.12, 0.58, 0.62, 0.66) * 0.82;

  const asia =
    gaussianDistance(lat, lon, 0.36, 1.48, 0.62, 0.72) +
    gaussianDistance(lat, lon, 0.10, 2.10, 0.40, 0.48) * 0.52;

  const australia = gaussianDistance(lat, lon, -0.38, 2.30, 0.26, 0.28) * 0.52;
  const antarctica = gaussianDistance(lat, lon, -1.20, 0.0, 0.22, 3.2) * 0.76;

  const oceanCuts =
    gaussianDistance(lat, lon, 0.05, -0.80, 0.46, 0.36) * 0.18 +
    gaussianDistance(lat, lon, 0.18, 2.70, 0.26, 0.24) * 0.12;

  const elevation = Math.max(americas, euroAfrica, asia, australia, antarctica) * 0.72 + macro + detail - 0.38 - oceanCuts;
  const ridge = ridge2D(w.x * 1.8 - 2, w.y * 1.8 + 1, 304);
  const moisture = clamp((fbm2D(w.x * 1.1 + 5, w.y * 1.1 - 3, 305, 3) + 1) * 0.5, 0, 1);

  return finishTerrain("earth", lat, lon, elevation, ridge, moisture);
}

function sampleHEarth(lat, lon) {
  const globalWarp = warp2D(lon * 0.55, lat * 0.62, 701, 0.42, 0.28);
  const fineWarp = warp2D(lon * 1.22, lat * 1.08, 702, 0.16, 0.12);

  const x = globalWarp.x;
  const y = globalWarp.y;

  const westPlate =
    orientedPlateField(y, x, 0.12, -1.78, 0.74, 1.04, -0.22, 0.30) * 0.70 +
    orientedPlateField(y, x, -0.32, -1.34, 0.46, 0.72, 0.40, -0.18) * 0.34 +
    ribbonField(y, x, 0.48, -1.36, 0.86, 0.18, 0.18, 1.1) * 0.20;

  const eastPlate =
    orientedPlateField(y, x, 0.04, 1.48, 0.80, 0.98, 0.30, -0.12) * 0.72 +
    orientedPlateField(y, x, 0.38, 0.96, 0.44, 0.62, -0.50, 0.24) * 0.30 +
    orientedPlateField(y, x, -0.30, 2.08, 0.40, 0.52, 0.48, 0.08) * 0.22;

  const northShield =
    orientedPlateField(y, x, 0.72, -0.12, 0.36, 1.05, 0.05, 0.12) * 0.54 +
    ribbonField(y, x, 0.60, 0.58, 0.62, 0.16, -0.42, 2.2) * 0.26;

  const southShelf =
    orientedPlateField(y, x, -0.66, 0.20, 0.42, 1.12, -0.12, -0.16) * 0.50 +
    ribbonField(y, x, -0.50, -0.46, 0.84, 0.15, 0.34, -1.3) * 0.22;

  const centerIslands =
    ribbonField(y, x, 0.02, -0.54, 0.46, 0.12, 0.03, 0.2) * 0.36 +
    ribbonField(y, x, 0.02, 0.10, 0.38, 0.10, -0.10, 1.4) * 0.30 +
    ribbonField(y, x, -0.06, 0.70, 0.34, 0.11, 0.16, 2.4) * 0.24;

  const northCrown = ribbonField(y, x, 1.28, -0.15, 2.40, 0.16, 0.00, 0.0) * 0.18;
  const southCrown = ribbonField(y, x, -1.28, 0.22, 2.20, 0.15, 0.00, 1.0) * 0.16;

  const continentPressure = Math.max(
    westPlate,
    eastPlate,
    northShield,
    southShelf,
    centerIslands,
    northCrown,
    southCrown
  );

  const continentalSpine =
    ridge2D(fineWarp.x * 1.20 - 3.0, fineWarp.y * 1.12 + 4.0, 703) * 0.13 +
    ridge2D(fineWarp.x * 2.00 + 1.4, fineWarp.y * 1.86 - 2.8, 704) * 0.07;

  const broadOrganicPressure =
    fbm2D(x * 0.58 + 9.0, y * 0.70 - 4.0, 705, 4) * 0.24 +
    fbm2D(x * 1.14 - 2.0, y * 1.08 + 7.0, 706, 3) * 0.11;

  const coastlineErosion =
    fbm2D(fineWarp.x * 2.15 + 12.0, fineWarp.y * 2.04 - 8.0, 707, 4) * 0.070 +
    fbm2D(fineWarp.x * 4.20 - 5.0, fineWarp.y * 3.80 + 2.0, 708, 3) * 0.028;

  const westOceanChannel =
    ribbonField(y, x, 0.02, -2.74, 1.42, 0.28, 0.12, 1.2) * 0.36 +
    ribbonField(y, x, -0.46, -2.30, 0.62, 0.18, -0.30, -0.8) * 0.20;

  const eastOceanChannel =
    ribbonField(y, x, 0.00, 2.72, 1.46, 0.29, -0.10, -1.1) * 0.36 +
    ribbonField(y, x, 0.38, 2.26, 0.54, 0.17, 0.34, 0.7) * 0.18;

  const centralRift =
    ribbonField(y, x, 0.02, 0.20, 1.02, 0.14, 0.10, 0.9) * 0.22 +
    ribbonField(y, x, -0.20, 0.88, 0.54, 0.12, -0.22, 2.4) * 0.15;

  const northernSeaCut =
    ribbonField(y, x, 0.54, -0.36, 0.74, 0.14, -0.18, 0.6) * 0.16 +
    ribbonField(y, x, 0.42, 1.10, 0.46, 0.12, 0.42, -2.0) * 0.12;

  const southernSeaCut =
    ribbonField(y, x, -0.54, 0.84, 0.82, 0.16, 0.24, 1.7) * 0.18 +
    ribbonField(y, x, -0.74, -0.68, 0.72, 0.15, -0.20, -1.5) * 0.14;

  const polarOceanPressure =
    smoothstep(1.08, 1.48, Math.abs(lat)) * 0.12;

  const oceanCut =
    westOceanChannel +
    eastOceanChannel +
    centralRift +
    northernSeaCut +
    southernSeaCut +
    polarOceanPressure;

  let elevation =
    continentPressure +
    broadOrganicPressure +
    continentalSpine * 0.62 +
    coastlineErosion -
    oceanCut -
    0.335;

  const peninsulaWest =
    ribbonField(y, x, -0.08, -2.02, 0.48, 0.10, 0.62, 2.1) * 0.16 +
    ribbonField(y, x, 0.30, -1.00, 0.40, 0.09, -0.58, 0.8) * 0.12;

  const peninsulaEast =
    ribbonField(y, x, 0.18, 2.05, 0.44, 0.10, -0.60, 1.9) * 0.14 +
    ribbonField(y, x, -0.18, 1.20, 0.36, 0.09, 0.70, -0.7) * 0.10;

  const bayBiteWest =
    gaussianDistance(fineWarp.y, fineWarp.x, 0.10, -1.92, 0.18, 0.18) * 0.10 +
    gaussianDistance(fineWarp.y, fineWarp.x, -0.38, -1.02, 0.16, 0.22) * 0.12;

  const bayBiteEast =
    gaussianDistance(fineWarp.y, fineWarp.x, 0.30, 1.48, 0.17, 0.22) * 0.12 +
    gaussianDistance(fineWarp.y, fineWarp.x, -0.46, 1.66, 0.18, 0.22) * 0.10;

  elevation += peninsulaWest + peninsulaEast - bayBiteWest - bayBiteEast;

  const islandChain =
    ribbonField(y, x, 0.04, -0.18, 0.84, 0.055, 0.02, 0.6) * 0.12 +
    ribbonField(y, x, -0.18, 1.24, 0.58, 0.055, 0.28, 2.2) * 0.10;

  const brokenIslandNoise = fbm2D(fineWarp.x * 5.7, fineWarp.y * 5.2, 709, 3);
  if (brokenIslandNoise > 0.24) {
    elevation += islandChain;
  }

  const moisture = clamp((fbm2D(fineWarp.x * 1.08 - 3, fineWarp.y * 1.02 + 2, 710, 3) + 1) * 0.5, 0, 1);

  const ridge =
    ridge2D(fineWarp.x * 1.55 + 8, fineWarp.y * 1.66 - 4, 711) * 0.60 +
    ridge2D(fineWarp.x * 2.70 - 6, fineWarp.y * 2.60 + 9, 712) * 0.24;

  const lakeField =
    gaussianDistance(fineWarp.y, fineWarp.x, 0.16, -1.44, 0.09, 0.12) +
    gaussianDistance(fineWarp.y, fineWarp.x, 0.10, 1.74, 0.10, 0.13) +
    gaussianDistance(fineWarp.y, fineWarp.x, -0.20, 0.78, 0.11, 0.14) +
    gaussianDistance(fineWarp.y, fineWarp.x, -0.30, -0.28, 0.10, 0.15);

  const freshwater = elevation > 0.045 && lakeField > 0.70 && moisture > 0.42;

  return finishTerrain("hEarth", lat, lon, elevation, ridge, moisture, freshwater);
}

function sampleAudralia(lat, lon) {
  const w = warp2D(lon * 0.78, lat * 0.82, 501, 0.26, 0.16);
  const macro =
    fbm2D(w.x * 0.88 + 2, w.y * 0.94 - 3, 502, 4) * 0.24 +
    fbm2D(w.x * 1.82 - 4, w.y * 1.58 + 2, 503, 3) * 0.08;

  const archipelago =
    gaussianDistance(lat, lon, 0.12, -0.82, 0.54, 0.84) +
    gaussianDistance(lat, lon, -0.18, 0.16, 0.44, 0.68) * 0.84 +
    gaussianDistance(lat, lon, 0.38, 1.12, 0.30, 0.44) * 0.58;

  const southernLand = gaussianDistance(lat, lon, -0.78, -0.22, 0.28, 0.84) * 0.66;

  const islandTrail =
    gaussianDistance(lat, lon, 0.02, 1.72, 0.16, 0.28) +
    gaussianDistance(lat, lon, -0.16, 2.18, 0.16, 0.24) * 0.74 +
    gaussianDistance(lat, lon, 0.24, 2.56, 0.14, 0.22) * 0.54;

  const elevation = Math.max(archipelago, southernLand, islandTrail) * 0.72 + macro - 0.38;
  const ridge = ridge2D(w.x * 1.6, w.y * 1.7, 504);
  const moisture = clamp((fbm2D(w.x * 1.1 + 1, w.y * 1.15 - 2, 505, 3) + 1) * 0.5, 0, 1);

  return finishTerrain("audralia", lat, lon, elevation, ridge, moisture);
}

function sampleTerrain(lat, lon, worldKey) {
  if (worldKey === "earth") return sampleEarth(lat, lon);
  if (worldKey === "audralia") return sampleAudralia(lat, lon);
  return sampleHEarth(lat, lon);
}

function colorForTerrain(terrain, world, light, rim) {
  let base;

  if (terrain.ice) {
    base = mixColor(world.ice, [255, 255, 255], terrain.iceFade * 0.26);
  } else if (terrain.freshwater) {
    base = mixColor(world.freshwater, world.ocean, 0.18);
  } else if (terrain.water) {
    if (terrain.shelf) {
      base = mixColor(world.ocean, world.coast, 0.18);
    } else if (terrain.sea) {
      base = mixColor(world.deep, world.ocean, 0.48);
    } else {
      base = world.deep;
    }
  } else if (terrain.coast) {
    base = mixColor(world.coast, world.lowland, terrain.elevation > 0 ? 0.28 : 0.08);
  } else if (terrain.mountain) {
    base = mixColor(world.highland, [194, 182, 150], 0.28);
  } else if (terrain.highland) {
    base = mixColor(world.land, world.highland, 0.38);
  } else if (terrain.dry) {
    base = mixColor(world.land, world.coast, 0.16);
  } else {
    base = world.land;
  }

  const texture = (terrain.detail - 0.5) * (terrain.water ? 5 : 8);
  const shade = clamp(light + rim * 0.10, 0.16, 1.16);

  const r = Math.round(clamp((base[0] + texture) * shade, 0, 255));
  const g = Math.round(clamp((base[1] + texture * 0.62) * shade, 0, 255));
  const b = Math.round(clamp((base[2] + (terrain.water ? 8 : -texture * 0.14)) * shade, 0, 255));

  return `rgb(${r},${g},${b})`;
}

function colorWithAlpha(rgb, alpha) {
  if (alpha >= 0.995) return rgb;
  const parts = rgb.match(/\d+/g);
  if (!parts || parts.length < 3) return rgb;
  return `rgba(${parts[0]},${parts[1]},${parts[2]},${alpha})`;
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

  const ocean = ctx.createRadialGradient(
    view.cx - view.scale * 0.22,
    view.cy - view.scale * 0.24,
    view.scale * 0.04,
    view.cx,
    view.cy,
    view.scale * 1.08
  );

  ocean.addColorStop(0, `rgb(${world.ocean[0] + 28},${world.ocean[1] + 28},${world.ocean[2] + 32})`);
  ocean.addColorStop(0.52, `rgb(${world.ocean[0]},${world.ocean[1]},${world.ocean[2]})`);
  ocean.addColorStop(1, `rgb(${world.deep[0]},${world.deep[1]},${world.deep[2]})`);

  ctx.fillStyle = ocean;
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
    const terrain = sampleTerrain(patch.lat, patch.lon, state.worldKey);

    if (terrain.water && !terrain.shelf && !terrain.sea && !terrain.freshwater && !terrain.ice) {
      continue;
    }

    const diffuse = clamp(dot(patch.normal, light), 0, 1);
    const rim = Math.pow(clamp(1 - Math.abs(patch.normal.z), 0, 1), 2.0);
    const lightValue = 0.34 + diffuse * 0.62 + rim * 0.06;

    let alpha = 0.92;
    if (terrain.water) alpha = terrain.freshwater ? 0.88 : terrain.shelf ? 0.50 : 0.28;
    if (terrain.coast) alpha = Math.max(alpha, 0.64);
    if (terrain.ice) alpha = 0.78;

    pathPatch(ctx, patch.points);
    ctx.fillStyle = colorWithAlpha(colorForTerrain(terrain, world, lightValue, rim), alpha);
    ctx.fill();
  }

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
  ctx.fillText(`${world.subtitle} · parent macro silhouette`, width * 0.5, height * 0.205);

  ctx.restore();
}

function drawCue(ctx, width, height) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(186,197,212,0.60)";
  ctx.font = `800 ${Math.max(11 * DPR, width * 0.013)}px Inter, system-ui, sans-serif`;
  ctx.fillText("Drag to inspect · Select a world · Open room for deeper model", width * 0.5, height * 0.90);
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
  drawAtmosphere(ctx, view);
  drawOrbitLines(ctx, view);
  drawWorldTitle(ctx, width, height);
  drawCue(ctx, width, height);

  document.documentElement.dataset.globeShowcaseModel = MODEL_NAME;
  document.documentElement.dataset.selectedWorld = state.worldKey;
  document.documentElement.dataset.publicPortraitBaseline = "stable";
  document.documentElement.dataset.hEarthSilhouette = "parent-macro-organic";
  document.documentElement.dataset.privateEnginesAsleep = "true";
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
    publicPortraitBaseline: true,
    privateEnginesAsleep: true,
    generatedImage: false,
    graphicBox: false,
    worlds: Object.keys(WORLDS),
    parentCellCount: CELL_COUNT,
    childFieldsPerParent: CHILD_HEX_COUNT,
    totalChildFields: TOTAL_CHILD_FIELDS,
    hEarthPublicModel: H_EARTH_PUBLIC_MODEL,
    setWorld,
    reset: resetInspection,
    status() {
      return {
        model: MODEL_NAME,
        selectedWorld: state.worldKey,
        publicPortraitBaseline: true,
        hEarthSilhouette: "parent-macro-organic",
        privateEnginesAsleep: true,
        parentCellCount: CELL_COUNT,
        childFieldsPerParent: CHILD_HEX_COUNT,
        totalChildFields: TOTAL_CHILD_FIELDS,
        hEarthPrivateModelPath: H_EARTH_PUBLIC_MODEL.privateModelPath,
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
  publicPortraitBaseline: true,
  privateEnginesAsleep: true,
  parentCellCount: CELL_COUNT,
  childFieldsPerParent: CHILD_HEX_COUNT,
  totalChildFields: TOTAL_CHILD_FIELDS,
  hEarthPublicModel: H_EARTH_PUBLIC_MODEL
};

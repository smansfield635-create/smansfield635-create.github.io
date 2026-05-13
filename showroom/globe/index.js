// /showroom/globe/index.js
// Globe Showcase public 256-cell portrait index.
// H-Earth macro surface expression coherence TNT.
// Keeps parent 256 governance and child 256 hex substrate.
// Corrects the exposed sample-fabric problem by rendering macro planetary surface first,
// then using child hexes as blended refinement instead of visible dotted geometry.

const MODEL_NAME = "globe-showcase-h-earth-macro-surface-expression-coherence-v1";

const REDUCED_MOTION = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
const MOBILE = window.matchMedia?.("(max-width: 760px)")?.matches === true;
const DPR = Math.min(window.devicePixelRatio || 1, MOBILE ? 1.25 : 1.65);
const FRAME_MS = MOBILE ? 58 : 42;

const DEFAULT_YAW = -0.64;
const DEFAULT_PITCH = -0.24;
const MIN_PITCH = -1.05;
const MAX_PITCH = 0.72;

const LAT_BANDS = 16;
const LON_SECTORS = 16;
const CELL_COUNT = LAT_BANDS * LON_SECTORS;

const CHILD_HEX_ROWS = 16;
const CHILD_HEX_COLS = 16;
const CHILD_HEX_COUNT = CHILD_HEX_ROWS * CHILD_HEX_COLS;
const TOTAL_CHILD_FIELDS = CELL_COUNT * CHILD_HEX_COUNT;

const H_EARTH_CENTER_CROSS = Object.freeze({
  nodes: Object.freeze([120, 121, 136, 137]),
  rowRange: Object.freeze([8, 9]),
  colRange: Object.freeze([8, 9]),
  role: "central tectonic ignition cross"
});

const H_EARTH_PLANETARY_HISTORY = Object.freeze({
  origin: "stabilized hybrid magnetic core",
  cause: "center-cross ignition, polar closure, crustal drift, ocean-basin opening, shelf exposure, erosion capture",
  surfaceLaw: "planetary story governs parent nodes; child hexes express the governed story",
  renderLaw: "macro surface first; child hex substrate blended underneath expression"
});

const H_EARTH_NODAL_ROWS = Object.freeze([
  { row: 1, name: "North Polar Cap Closure", pressure: "polar closure", crustAge: 0.96, polarPressure: 1.00, uplift: 0.20, waterCapture: 0.04 },
  { row: 2, name: "North Polar Landmass", pressure: "ancient crown compression", crustAge: 0.93, polarPressure: 0.92, uplift: 0.34, waterCapture: 0.05 },
  { row: 3, name: "Northern Crown Fracture Belt", pressure: "ice-to-highland transition", crustAge: 0.86, polarPressure: 0.66, uplift: 0.46, waterCapture: 0.12 },
  { row: 4, name: "Northern Highland Uplift", pressure: "old mountain compression", crustAge: 0.82, polarPressure: 0.36, uplift: 0.70, waterCapture: 0.16 },
  { row: 5, name: "Northern Shelf and Sea Gate", pressure: "highland stepdown", crustAge: 0.76, polarPressure: 0.22, uplift: 0.52, waterCapture: 0.25 },
  { row: 6, name: "Upper Continental Drift Belt", pressure: "continental separation", crustAge: 0.68, polarPressure: 0.12, uplift: 0.44, waterCapture: 0.30 },
  { row: 7, name: "Continental Shoulder Belt", pressure: "basin formation", crustAge: 0.62, polarPressure: 0.06, uplift: 0.38, waterCapture: 0.42 },
  { row: 8, name: "Northern Equatorial Pressure Belt", pressure: "upper center-cross rift", crustAge: 0.54, polarPressure: 0.02, uplift: 0.32, waterCapture: 0.48 },
  { row: 9, name: "Southern Equatorial Pressure Belt", pressure: "lower center-cross rift", crustAge: 0.52, polarPressure: 0.02, uplift: 0.30, waterCapture: 0.50 },
  { row: 10, name: "Lower Continental Drift Belt", pressure: "valley and basin widening", crustAge: 0.58, polarPressure: 0.06, uplift: 0.34, waterCapture: 0.56 },
  { row: 11, name: "Inland Basin Belt", pressure: "lake capture", crustAge: 0.64, polarPressure: 0.10, uplift: 0.28, waterCapture: 0.72 },
  { row: 12, name: "Southern Shelf Continent", pressure: "shelf exposure", crustAge: 0.70, polarPressure: 0.16, uplift: 0.22, waterCapture: 0.62 },
  { row: 13, name: "Southern Sea and Shelf Belt", pressure: "shelf water expansion", crustAge: 0.76, polarPressure: 0.28, uplift: 0.16, waterCapture: 0.54 },
  { row: 14, name: "Southern Circumpolar Compression Belt", pressure: "circumpolar compression", crustAge: 0.84, polarPressure: 0.48, uplift: 0.30, waterCapture: 0.34 },
  { row: 15, name: "South Polar Landmass", pressure: "lower crust cooling", crustAge: 0.92, polarPressure: 0.82, uplift: 0.38, waterCapture: 0.16 },
  { row: 16, name: "South Polar Cap Closure", pressure: "final cooling band", crustAge: 0.98, polarPressure: 1.00, uplift: 0.18, waterCapture: 0.06 }
]);

const H_EARTH_NODAL_COLUMNS = Object.freeze([
  { column: 1, name: "West Deep Ocean Wall", pressure: "deep western basin", oceanBasin: 1.00, shelf: 0.04, uplift: 0.02, rift: 0.68 },
  { column: 2, name: "West Deep Ocean Margin", pressure: "western pull-apart", oceanBasin: 0.92, shelf: 0.10, uplift: 0.05, rift: 0.64 },
  { column: 3, name: "West Shelf Coast", pressure: "deep-to-shelf transition", oceanBasin: 0.52, shelf: 0.74, uplift: 0.18, rift: 0.42 },
  { column: 4, name: "West Coastal Shelf", pressure: "coastal exposure", oceanBasin: 0.34, shelf: 0.86, uplift: 0.30, rift: 0.26 },
  { column: 5, name: "Western Primary Continent Edge", pressure: "western uplift edge", oceanBasin: 0.16, shelf: 0.42, uplift: 0.58, rift: 0.16 },
  { column: 6, name: "Western Primary Continent Core", pressure: "western continental body", oceanBasin: 0.06, shelf: 0.20, uplift: 0.72, rift: 0.10 },
  { column: 7, name: "Western Continental Shoulder", pressure: "central approach", oceanBasin: 0.10, shelf: 0.28, uplift: 0.54, rift: 0.28 },
  { column: 8, name: "Western Central Rift Edge", pressure: "center-cross west edge", oceanBasin: 0.22, shelf: 0.48, uplift: 0.30, rift: 0.82 },
  { column: 9, name: "Eastern Central Rift Edge", pressure: "center-cross east edge", oceanBasin: 0.24, shelf: 0.52, uplift: 0.32, rift: 0.86 },
  { column: 10, name: "Eastern Continental Shoulder", pressure: "uplift after rift", oceanBasin: 0.10, shelf: 0.30, uplift: 0.58, rift: 0.28 },
  { column: 11, name: "Eastern Primary Continent Core", pressure: "eastern continental body", oceanBasin: 0.06, shelf: 0.20, uplift: 0.76, rift: 0.12 },
  { column: 12, name: "Eastern Primary Continent Edge", pressure: "eastern ridge edge", oceanBasin: 0.12, shelf: 0.36, uplift: 0.64, rift: 0.16 },
  { column: 13, name: "East Coastal Shelf", pressure: "coastal erosion", oceanBasin: 0.32, shelf: 0.86, uplift: 0.30, rift: 0.24 },
  { column: 14, name: "East Shelf Sea", pressure: "shelf-to-sea transition", oceanBasin: 0.48, shelf: 0.78, uplift: 0.16, rift: 0.34 },
  { column: 15, name: "East Deep Ocean Margin", pressure: "eastern pull-apart", oceanBasin: 0.90, shelf: 0.12, uplift: 0.06, rift: 0.62 },
  { column: 16, name: "East Deep Ocean Wall", pressure: "deep eastern basin", oceanBasin: 1.00, shelf: 0.04, uplift: 0.02, rift: 0.68 }
]);

const H_EARTH_QUADRANTS = Object.freeze({
  northwest: { name: "Northwest", story: "ancient western uplift and polar-to-continental transition", collisionBias: 0.62, erosionBias: 0.36, waterBias: 0.28 },
  northeast: { name: "Northeast", story: "eastern uplift, northern shelf seas, and ridge inheritance", collisionBias: 0.74, erosionBias: 0.32, waterBias: 0.30 },
  southwest: { name: "Southwest", story: "western ocean opening and southern shelf broadening", collisionBias: 0.34, erosionBias: 0.58, waterBias: 0.66 },
  southeast: { name: "Southeast", story: "eastern basin, southern shelf, and circumpolar closure", collisionBias: 0.42, erosionBias: 0.62, waterBias: 0.70 }
});

const H_EARTH_TECTONIC_PLATES = Object.freeze({
  northCrown: { name: "North Crown Plate", type: "polar crown", crustAge: 0.96, uplift: 0.34, rift: 0.08, collision: 0.72, basin: 0.10, shelf: 0.18, erosion: 0.22, waterCapture: 0.10 },
  southCrown: { name: "South Crown Plate", type: "polar crown", crustAge: 0.95, uplift: 0.30, rift: 0.10, collision: 0.64, basin: 0.24, shelf: 0.28, erosion: 0.34, waterCapture: 0.20 },
  westernContinent: { name: "Western Continental Plate", type: "continental", crustAge: 0.72, uplift: 0.68, rift: 0.22, collision: 0.54, basin: 0.22, shelf: 0.34, erosion: 0.36, waterCapture: 0.40 },
  easternContinent: { name: "Eastern Continental Plate", type: "continental", crustAge: 0.74, uplift: 0.74, rift: 0.20, collision: 0.68, basin: 0.18, shelf: 0.36, erosion: 0.34, waterCapture: 0.34 },
  northernHighland: { name: "Northern Highland Plate", type: "highland", crustAge: 0.84, uplift: 0.84, rift: 0.16, collision: 0.78, basin: 0.16, shelf: 0.20, erosion: 0.28, waterCapture: 0.24 },
  southernShelf: { name: "Southern Shelf Plate", type: "shelf continent", crustAge: 0.66, uplift: 0.30, rift: 0.30, collision: 0.28, basin: 0.50, shelf: 0.84, erosion: 0.62, waterCapture: 0.70 },
  equatorialChain: { name: "Equatorial Chain Plate", type: "rift island chain", crustAge: 0.50, uplift: 0.46, rift: 0.92, collision: 0.38, basin: 0.36, shelf: 0.78, erosion: 0.50, waterCapture: 0.54 },
  westOcean: { name: "West Deep Ocean Plate", type: "oceanic", crustAge: 0.38, uplift: 0.04, rift: 0.72, collision: 0.08, basin: 0.96, shelf: 0.12, erosion: 0.30, waterCapture: 0.86 },
  eastOcean: { name: "East Deep Ocean Plate", type: "oceanic", crustAge: 0.38, uplift: 0.04, rift: 0.74, collision: 0.08, basin: 0.98, shelf: 0.12, erosion: 0.30, waterCapture: 0.88 }
});

const H_EARTH_GEOGRAPHY = Object.freeze({
  field: Object.freeze({
    latBands: LAT_BANDS,
    lonSectors: LON_SECTORS,
    totalParentCells: CELL_COUNT,
    childRows: CHILD_HEX_ROWS,
    childCols: CHILD_HEX_COLS,
    childFieldsPerParent: CHILD_HEX_COUNT,
    totalChildFields: TOTAL_CHILD_FIELDS
  }),
  landBodies: Object.freeze([
    "North Polar Landmass",
    "South Polar Landmass",
    "Western Primary Continent",
    "Eastern Primary Continent",
    "Northern Highland Continent",
    "Southern Shelf Continent",
    "Equatorial Island Chain"
  ]),
  oceans: Object.freeze(["West Deep Ocean", "East Deep Ocean", "Southern Circumpolar Ocean"]),
  seas: Object.freeze([
    "Northwest Sea",
    "North Gate Sea",
    "Northeast Sea",
    "West Shelf Sea",
    "East Shelf Sea",
    "Equatorial Passage Sea",
    "Southwest Sea",
    "Southeast Sea"
  ]),
  lakes: 16,
  coastlineSegments: 64,
  beaches: 32,
  shelves: 32,
  mountainRidges: 16,
  valleyBasins: 16,
  polarCaps: Object.freeze(["North Polar Cap", "South Polar Cap"])
});

const H_EARTH_LAKE_SEATS = Object.freeze([
  [11, 3], [10, 4], [9, 2], [8, 5],
  [11, 11], [10, 12], [8, 10], [7, 13],
  [12, 7], [13, 8], [6, 7], [5, 8],
  [9, 6], [9, 9], [7, 4], [6, 11]
]);

const H_EARTH_RIDGE_SEATS = Object.freeze([
  [11, 2], [10, 3], [9, 4], [8, 5],
  [12, 10], [11, 11], [10, 12], [9, 13],
  [13, 6], [12, 7], [11, 8], [10, 9],
  [4, 4], [5, 5], [4, 11], [5, 10]
]);

const H_EARTH_VALLEY_SEATS = Object.freeze([
  [8, 2], [7, 3], [6, 4], [9, 5],
  [8, 11], [7, 12], [6, 13], [9, 10],
  [11, 6], [10, 7], [9, 8], [8, 9],
  [5, 6], [5, 9], [6, 6], [6, 9]
]);

const WORLDS = Object.freeze({
  earth: {
    key: "earth",
    title: "Earth",
    subtitle: "Reference Body",
    route: "/showroom/globe/earth/",
    primary: [34, 126, 172],
    secondary: [60, 148, 85],
    glow: "rgba(142,190,255,0.22)"
  },
  hEarth: {
    key: "hEarth",
    title: "H-Earth",
    subtitle: "Hybrid Earth",
    route: "/showroom/globe/h-earth/",
    primary: [62, 142, 92],
    secondary: [42, 132, 142],
    glow: "rgba(143,240,195,0.24)"
  },
  audralia: {
    key: "audralia",
    title: "Audralia",
    subtitle: "Constructed World",
    route: "/showroom/globe/audralia/",
    primary: [170, 135, 82],
    secondary: [54, 112, 142],
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

function fract(value) {
  return value - Math.floor(value);
}

function hash(a, b = 0, c = 0) {
  return fract(Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453123);
}

function normalize(v) {
  const length = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / length, y: v.y / length, z: v.z / length };
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function subtract(a, b) {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function cross(a, b) {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x
  };
}

function rotateY(p, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
}

function rotateX(p, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
}

function project(p, view) {
  return { x: view.cx + p.x * view.scale, y: view.cy - p.y * view.scale, z: p.z };
}

function mixPoint(a, b, t) {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: a.z + (b.z - a.z) * t };
}

function bilinearScreen(points, u, v) {
  const top = mixPoint(points[0], points[1], u);
  const bottom = mixPoint(points[3], points[2], u);
  return mixPoint(top, bottom, v);
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

  createStars(MOBILE ? 58 : 120);
}

function createStars(count) {
  state.stars = Array.from({ length: count }, (_, index) => ({
    x: hash(index, 1),
    y: hash(index, 2),
    r: 0.45 + hash(index, 3) * 1.9,
    a: 0.10 + hash(index, 4) * 0.36,
    p: hash(index, 5) * Math.PI * 2
  }));
}

function makePoint(lat, lon) {
  const cosLat = Math.cos(lat);
  return { x: cosLat * Math.cos(lon), y: Math.sin(lat), z: cosLat * Math.sin(lon) };
}

function terrainNoise(lat, lon, band, sector, worldKey) {
  const worldShift = worldKey === "earth" ? 0.35 : worldKey === "audralia" ? 1.55 : 0.85;
  const n1 = Math.sin(lon * 2.1 + worldShift + Math.sin(lat * 3.0) * 1.4);
  const n2 = Math.cos(lon * 3.7 - lat * 2.2 - worldShift * 0.7);
  const n3 = Math.sin(lon * 6.0 + band * 0.47 + sector * 0.21 + worldShift);
  const n4 = Math.cos((lon + lat) * 4.1 + sector * 0.37 - worldShift);
  return n1 * 0.38 + n2 * 0.28 + n3 * 0.20 + n4 * 0.14;
}

function seatIndex(seats, band, sector) {
  for (let index = 0; index < seats.length; index += 1) {
    const seat = seats[index];
    if (seat[0] === band && seat[1] === sector) return index;
  }
  return -1;
}

function gaussianDistance(lat, lon, centerLat, centerLon, latWidth, lonWidth) {
  const dLat = (lat - centerLat) / latWidth;
  const dLon = Math.atan2(Math.sin(lon - centerLon), Math.cos(lon - centerLon)) / lonWidth;
  return Math.exp(-(dLat * dLat + dLon * dLon));
}

function getNodeAddress(row, column) {
  return ((row - 1) * 16) + column;
}

function getHEarthQuadrant(row, column) {
  if (row <= 8 && column <= 8) return H_EARTH_QUADRANTS.northwest;
  if (row <= 8 && column >= 9) return H_EARTH_QUADRANTS.northeast;
  if (row >= 9 && column <= 8) return H_EARTH_QUADRANTS.southwest;
  return H_EARTH_QUADRANTS.southeast;
}

function getHEarthPlate(row, column) {
  if (row <= 2) return H_EARTH_TECTONIC_PLATES.northCrown;
  if (row >= 15) return H_EARTH_TECTONIC_PLATES.southCrown;
  if (column <= 2) return H_EARTH_TECTONIC_PLATES.westOcean;
  if (column >= 15) return H_EARTH_TECTONIC_PLATES.eastOcean;
  if (row >= 8 && row <= 9 && column >= 6 && column <= 11) return H_EARTH_TECTONIC_PLATES.equatorialChain;
  if (row >= 11 && row <= 14 && column >= 4 && column <= 13) return H_EARTH_TECTONIC_PLATES.southernShelf;
  if (row >= 3 && row <= 6 && column >= 5 && column <= 12) return H_EARTH_TECTONIC_PLATES.northernHighland;
  if (column <= 8) return H_EARTH_TECTONIC_PLATES.westernContinent;
  return H_EARTH_TECTONIC_PLATES.easternContinent;
}

function getCenterCrossInfluence(row, column) {
  const d = Math.min(
    Math.hypot(row - 8, column - 8),
    Math.hypot(row - 8, column - 9),
    Math.hypot(row - 9, column - 8),
    Math.hypot(row - 9, column - 9)
  );
  return clamp(1 - d / 7.25, 0, 1);
}

function getPolarClosureInfluence(row) {
  const north = clamp(1 - (row - 1) / 6.5, 0, 1);
  const south = clamp(1 - (16 - row) / 6.5, 0, 1);
  return Math.max(north, south);
}

function getHEarthNodalNarrative(row, column) {
  const node = getNodeAddress(row, column);
  const rowStory = H_EARTH_NODAL_ROWS[row - 1];
  const columnStory = H_EARTH_NODAL_COLUMNS[column - 1];
  const quadrant = getHEarthQuadrant(row, column);
  const centerInfluence = getCenterCrossInfluence(row, column);
  const polarInfluence = getPolarClosureInfluence(row);
  const plate = getHEarthPlate(row, column);

  const upliftPressure = clamp(rowStory.uplift * 0.34 + columnStory.uplift * 0.26 + plate.uplift * 0.30 + quadrant.collisionBias * 0.10, 0, 1);
  const riftPressure = clamp(columnStory.rift * 0.30 + plate.rift * 0.34 + centerInfluence * 0.28 + (row === 8 || row === 9 ? 0.08 : 0), 0, 1);
  const collisionPressure = clamp(plate.collision * 0.36 + quadrant.collisionBias * 0.22 + rowStory.uplift * 0.22 + polarInfluence * 0.20, 0, 1);
  const shelfPressure = clamp(columnStory.shelf * 0.36 + plate.shelf * 0.34 + quadrant.waterBias * 0.14 + (row >= 12 ? 0.16 : 0), 0, 1);
  const oceanBasinPressure = clamp(columnStory.oceanBasin * 0.42 + plate.basin * 0.40 + (row >= 13 ? 0.18 : 0), 0, 1);
  const erosionPressure = clamp(plate.erosion * 0.34 + quadrant.erosionBias * 0.26 + rowStory.waterCapture * 0.22 + shelfPressure * 0.18, 0, 1);
  const waterCapturePressure = clamp(plate.waterCapture * 0.34 + rowStory.waterCapture * 0.34 + quadrant.waterBias * 0.18 + shelfPressure * 0.14, 0, 1);

  let expectedFeatureClass = "land";
  if (polarInfluence > 0.86) expectedFeatureClass = "polar";
  else if (oceanBasinPressure > 0.74 && upliftPressure < 0.34) expectedFeatureClass = "deep-ocean";
  else if (shelfPressure > 0.66 && oceanBasinPressure > 0.36) expectedFeatureClass = "shelf-sea";
  else if (centerInfluence > 0.58 && riftPressure > 0.62) expectedFeatureClass = "central-rift-chain";
  else if (waterCapturePressure > 0.66 && upliftPressure > 0.24) expectedFeatureClass = "basin-lake";
  else if (collisionPressure > 0.68 && upliftPressure > 0.44) expectedFeatureClass = "ridge-highland";
  else if (erosionPressure > 0.62 && shelfPressure > 0.48) expectedFeatureClass = "coastal-lowland";

  return {
    node,
    row,
    column,
    rowStory,
    columnStory,
    quadrant,
    centerInfluence,
    polarInfluence,
    plate,
    crustAge: clamp(rowStory.crustAge * 0.30 + plate.crustAge * 0.44 + (1 - centerInfluence) * 0.12 + polarInfluence * 0.14, 0, 1),
    upliftPressure,
    riftPressure,
    collisionPressure,
    shelfPressure,
    oceanBasinPressure,
    erosionPressure,
    waterCapturePressure,
    expectedFeatureClass
  };
}

function getHEarthTectonicContext(lat, lon, band, sector) {
  const row = band + 1;
  const column = sector + 1;
  const narrative = getHEarthNodalNarrative(row, column);
  const localNoise = terrainNoise(lat, lon, band, sector, "hEarth") * 0.045;

  return {
    ...narrative,
    localNoise,
    lat,
    lon,
    tectonicLift: clamp(narrative.upliftPressure + narrative.collisionPressure * 0.22 - narrative.oceanBasinPressure * 0.34 + localNoise, -0.4, 1.2),
    tectonicWater: clamp(narrative.oceanBasinPressure + narrative.waterCapturePressure * 0.22 + narrative.shelfPressure * 0.16 - narrative.upliftPressure * 0.20 - localNoise, -0.3, 1.2),
    tectonicBoundary: clamp(narrative.riftPressure * 0.36 + narrative.shelfPressure * 0.24 + narrative.erosionPressure * 0.20 + narrative.centerInfluence * 0.20, 0, 1)
  };
}

function applyNodalStoryToParentCell(parentCell, narrative) {
  parentCell.nodalNarrative = narrative;
  parentCell.tectonicPlate = narrative.plate.name;
  parentCell.nodeAddress = narrative.node;
  parentCell.centerInfluence = narrative.centerInfluence;
  parentCell.crustAge = narrative.crustAge;
  parentCell.upliftPressure = narrative.upliftPressure;
  parentCell.riftPressure = narrative.riftPressure;
  parentCell.collisionPressure = narrative.collisionPressure;
  parentCell.shelfPressure = narrative.shelfPressure;
  parentCell.oceanBasinPressure = narrative.oceanBasinPressure;
  parentCell.erosionPressure = narrative.erosionPressure;
  parentCell.waterCapturePressure = narrative.waterCapturePressure;
  parentCell.expectedFeatureClass = narrative.expectedFeatureClass;
  return parentCell;
}

function applyNodalStoryToChildHex(childHex, parentNarrative) {
  childHex.nodalNarrative = parentNarrative;
  childHex.tectonicPlate = parentNarrative.plate.name;
  childHex.nodeAddress = parentNarrative.node;
  childHex.crustAge = parentNarrative.crustAge;
  childHex.upliftPressure = parentNarrative.upliftPressure;
  childHex.riftPressure = parentNarrative.riftPressure;
  childHex.collisionPressure = parentNarrative.collisionPressure;
  childHex.shelfPressure = parentNarrative.shelfPressure;
  childHex.oceanBasinPressure = parentNarrative.oceanBasinPressure;
  childHex.erosionPressure = parentNarrative.erosionPressure;
  childHex.waterCapturePressure = parentNarrative.waterCapturePressure;
  return childHex;
}

function getOceanName(sector, band) {
  if (band <= 3) return H_EARTH_GEOGRAPHY.oceans[2];
  return sector < 8 ? H_EARTH_GEOGRAPHY.oceans[0] : H_EARTH_GEOGRAPHY.oceans[1];
}

function getSeaName(sector, band) {
  if (band >= 12 && sector < 5) return H_EARTH_GEOGRAPHY.seas[0];
  if (band >= 12 && sector < 11) return H_EARTH_GEOGRAPHY.seas[1];
  if (band >= 12) return H_EARTH_GEOGRAPHY.seas[2];
  if (sector < 4) return H_EARTH_GEOGRAPHY.seas[3];
  if (sector > 11) return H_EARTH_GEOGRAPHY.seas[4];
  if (band >= 6 && band <= 10) return H_EARTH_GEOGRAPHY.seas[5];
  if (sector < 8) return H_EARTH_GEOGRAPHY.seas[6];
  return H_EARTH_GEOGRAPHY.seas[7];
}

function computeHEarthMasks(latMid, lonMid, context) {
  return [
    {
      name: "North Polar Landmass",
      score: gaussianDistance(latMid, lonMid, 1.33, 0.0, 0.28, 3.2) + context.polarInfluence * 0.40
    },
    {
      name: "South Polar Landmass",
      score: gaussianDistance(latMid, lonMid, -1.33, 0.0, 0.28, 3.2) + context.polarInfluence * 0.40
    },
    {
      name: "Western Primary Continent",
      score:
        gaussianDistance(latMid, lonMid, 0.16, -2.02, 0.72, 0.92) +
        gaussianDistance(latMid, lonMid, -0.24, -1.52, 0.52, 0.62) * 0.62 +
        (context.plate.name === "Western Continental Plate" ? 0.24 : 0) +
        context.upliftPressure * 0.12 -
        context.oceanBasinPressure * 0.16
    },
    {
      name: "Eastern Primary Continent",
      score:
        gaussianDistance(latMid, lonMid, 0.18, 1.55, 0.76, 0.88) +
        gaussianDistance(latMid, lonMid, -0.10, 2.25, 0.46, 0.62) * 0.55 +
        (context.plate.name === "Eastern Continental Plate" ? 0.26 : 0) +
        context.upliftPressure * 0.13 -
        context.oceanBasinPressure * 0.14
    },
    {
      name: "Northern Highland Continent",
      score:
        gaussianDistance(latMid, lonMid, 0.76, -0.25, 0.46, 0.96) +
        gaussianDistance(latMid, lonMid, 0.58, 0.55, 0.34, 0.58) * 0.52 +
        (context.plate.name === "Northern Highland Plate" ? 0.30 : 0) +
        context.collisionPressure * 0.18
    },
    {
      name: "Southern Shelf Continent",
      score:
        gaussianDistance(latMid, lonMid, -0.72, 0.18, 0.44, 1.05) +
        gaussianDistance(latMid, lonMid, -0.52, -0.55, 0.32, 0.52) * 0.44 +
        (context.plate.name === "Southern Shelf Plate" ? 0.26 : 0) +
        context.shelfPressure * 0.18 -
        context.oceanBasinPressure * 0.08
    },
    {
      name: "Equatorial Island Chain",
      score:
        gaussianDistance(latMid, lonMid, 0.00, -0.60, 0.23, 0.48) +
        gaussianDistance(latMid, lonMid, 0.08, 0.12, 0.22, 0.42) +
        gaussianDistance(latMid, lonMid, -0.08, 0.82, 0.24, 0.45) +
        (context.plate.name === "Equatorial Chain Plate" ? 0.26 : 0) +
        context.centerInfluence * 0.20 +
        context.riftPressure * 0.10
    }
  ];
}

function classifyHEarthCell(latMid, lonMid, band, sector) {
  const context = getHEarthTectonicContext(latMid, lonMid, band, sector);
  const polar = Math.abs(latMid) / (Math.PI / 2);
  const detail = hash(band, sector, 31);
  const south = latMid < 0;

  const masks = computeHEarthMasks(latMid, lonMid, context);
  const winner = masks.reduce((best, item) => item.score > best.score ? item : best, masks[0]);

  const isNorthPole = band >= 14;
  const isSouthPole = band <= 1;
  const isPolarLand = isNorthPole || isSouthPole || winner.name === "North Polar Landmass" || winner.name === "South Polar Landmass";
  const isIslandChain = winner.name === "Equatorial Island Chain";

  const baseThreshold = isIslandChain ? 0.52 : 0.42;
  const threshold = clamp(
    baseThreshold +
    context.oceanBasinPressure * 0.18 -
    context.upliftPressure * 0.12 -
    context.collisionPressure * 0.06 +
    context.shelfPressure * 0.04,
    0.28,
    0.72
  );

  const macroNoise = terrainNoise(latMid, lonMid, band, sector, "hEarth") * 0.035;
  const tectonicCause =
    context.upliftPressure * 0.22 +
    context.collisionPressure * 0.12 -
    context.oceanBasinPressure * 0.26 -
    context.riftPressure * 0.08 +
    context.shelfPressure * 0.06 +
    context.polarInfluence * 0.18;

  const signed = isPolarLand ? 0.68 : winner.score + macroNoise + tectonicCause - threshold;

  const lakeIndex = seatIndex(H_EARTH_LAKE_SEATS, band, sector);
  const ridgeIndex = seatIndex(H_EARTH_RIDGE_SEATS, band, sector);
  const valleyIndex = seatIndex(H_EARTH_VALLEY_SEATS, band, sector);

  const isPolarCap = band === 0 || band === 15;
  const lakeEligible = lakeIndex >= 0 && context.waterCapturePressure > 0.38;
  const isLand = isPolarLand || signed > 0 || lakeEligible;
  const boundaryWidth = 0.12 + context.erosionPressure * 0.04 + context.shelfPressure * 0.03;
  const isCoast = isLand && !isPolarCap && Math.abs(signed) < boundaryWidth;
  const isShelf = !isLand && signed > -(0.16 + context.shelfPressure * 0.08);
  const sea = !isLand && (isShelf || signed > -0.30 || context.shelfPressure > 0.62);
  const beachSegment = isCoast && context.shelfPressure > 0.42 && context.collisionPressure < 0.76 && ((band * 16 + sector) % 2 === 0);

  const elevation = clamp(
    signed * 1.15 +
    context.upliftPressure * 0.32 +
    context.collisionPressure * 0.20 -
    context.oceanBasinPressure * 0.28 -
    context.erosionPressure * 0.08 +
    (ridgeIndex >= 0 ? 0.28 + context.collisionPressure * 0.20 : 0) -
    (valleyIndex >= 0 ? 0.18 + context.waterCapturePressure * 0.10 : 0) +
    (isPolarCap ? 0.10 : 0),
    -0.90,
    1.05
  );

  const terrain = {
    geographyModel: "h-earth-parent-256-macro-expression",
    parentBand: band,
    parentSector: sector,
    parentAddress: band * 16 + sector,
    threshold,
    signed,
    elevation,
    polar,
    detail,
    landBody: isLand ? (isNorthPole ? "North Polar Landmass" : isSouthPole ? "South Polar Landmass" : winner.name) : null,
    ocean: !isLand && !sea ? getOceanName(sector, band) : null,
    sea: !isLand && sea ? getSeaName(sector, band) : null,
    lakeIndex,
    lake: lakeEligible ? `Major Lake ${String(lakeIndex + 1).padStart(2, "0")}` : null,
    coastlineSegment: isCoast ? ((band * 16 + sector) % H_EARTH_GEOGRAPHY.coastlineSegments) + 1 : null,
    beach: beachSegment ? `Beach ${String(((band * 16 + sector) % H_EARTH_GEOGRAPHY.beaches) + 1).padStart(2, "0")}` : null,
    shelf: isShelf ? `Shelf Zone ${String(((band * 16 + sector) % H_EARTH_GEOGRAPHY.shelves) + 1).padStart(2, "0")}` : null,
    ridgeIndex,
    ridge: ridgeIndex >= 0 && context.collisionPressure > 0.34 ? `Ridge ${String(ridgeIndex + 1).padStart(2, "0")}` : null,
    valleyIndex,
    valley: valleyIndex >= 0 && context.waterCapturePressure > 0.32 ? `Valley Basin ${String(valleyIndex + 1).padStart(2, "0")}` : null,
    polarCap: isPolarCap ? (south ? H_EARTH_GEOGRAPHY.polarCaps[1] : H_EARTH_GEOGRAPHY.polarCaps[0]) : null,
    ice: isPolarCap || (polar > 0.86 && isLand),
    coast: isCoast,
    water: !isLand,
    shelfZone: isShelf,
    seaZone: sea,
    mountain: ridgeIndex >= 0 || (isLand && elevation > 0.48 && context.collisionPressure > 0.38),
    highland: isLand && elevation > 0.26,
    valleyZone: valleyIndex >= 0,
    lakeZone: lakeEligible,
    dry: isLand && !isCoast && !isPolarCap && elevation > 0.18 && detail > 0.55 && context.erosionPressure > 0.30,
    ridgeField: Math.sin(lonMid * 4.4 + band * 0.51) + Math.cos(latMid * 6.2 - sector * 0.31)
  };

  return applyNodalStoryToParentCell(terrain, context);
}

function classifyHEarthChildHex(parentCell, row, col, localU, localV) {
  const childAddress = row * CHILD_HEX_COLS + col;
  const band = parentCell.band;
  const sector = parentCell.sector;
  const parent = parentCell.terrain;
  const narrative = parent.nodalNarrative;

  const lat0 = parentCell.corners[0].lat;
  const lat1 = parentCell.corners[3].lat;
  const lon0 = parentCell.corners[0].lon;
  const lon1 = parentCell.corners[1].lon;

  const childLat = lat0 + (lat1 - lat0) * localV;
  const childLon = lon0 + (lon1 - lon0) * localU;

  const centerCurve =
    Math.sin(localU * Math.PI * 2.0 + narrative.centerInfluence * 1.6 + band * 0.21) * 0.018 +
    Math.cos(localV * Math.PI * 2.0 - narrative.riftPressure * 1.4 + sector * 0.17) * 0.016;

  const tectonicWave =
    terrainNoise(childLat, childLon, band * 16 + row, sector * 16 + col, "hEarth") * 0.030 +
    centerCurve +
    (hash(band * 16 + row, sector * 16 + col, 71) - 0.5) * 0.010;

  const upliftShape =
    narrative.upliftPressure * 0.030 +
    narrative.collisionPressure * 0.024 -
    narrative.oceanBasinPressure * 0.030 -
    narrative.erosionPressure * 0.012 +
    narrative.waterCapturePressure * 0.008;

  const signed = parent.signed + tectonicWave + upliftShape;
  const isPolarCap = parent.polarCap !== null;

  const lakeCore =
    parent.lakeZone &&
    Math.pow((localU - 0.5) / (0.31 + narrative.waterCapturePressure * 0.08), 2) +
      Math.pow((localV - 0.5) / (0.22 + narrative.erosionPressure * 0.08), 2) <
      1.0 + (hash(band, sector, childAddress) - 0.5) * 0.12;

  const ridgeCurve = Math.sin(localU * Math.PI * 1.55 + parent.ridgeIndex + narrative.collisionPressure * 1.2) * 0.12;
  const ridgeBand =
    parent.ridgeIndex >= 0 &&
    narrative.collisionPressure > 0.34 &&
    Math.abs((localV - 0.5) - ridgeCurve) < 0.070 + narrative.upliftPressure * 0.026;

  const valleyCurve = Math.sin(localV * Math.PI * 1.45 + parent.valleyIndex + narrative.waterCapturePressure * 1.4) * 0.10;
  const valleyBand =
    parent.valleyIndex >= 0 &&
    narrative.waterCapturePressure > 0.30 &&
    Math.abs((localU - 0.5) + valleyCurve) < 0.072 + narrative.erosionPressure * 0.022;

  const childIsLand = isPolarCap || signed > 0 || lakeCore;
  const childLake = lakeCore;
  const childWater = !childIsLand || childLake;
  const coastWidth = 0.026 + narrative.erosionPressure * 0.012 + narrative.shelfPressure * 0.012;
  const childCoast = !isPolarCap && !childLake && Math.abs(signed) < coastWidth;
  const childBeach = childCoast && signed > -0.014 && signed < 0.030 && narrative.shelfPressure > 0.40 && narrative.collisionPressure < 0.82;
  const childShelf = !childIsLand && signed > -(0.115 + narrative.shelfPressure * 0.064);
  const childSea = !childIsLand && (childShelf || parent.seaZone || signed > -0.245 || narrative.shelfPressure > 0.66);
  const childOcean = !childIsLand && !childSea && !childLake;

  const elevation = clamp(
    signed * 1.12 +
    narrative.upliftPressure * 0.20 +
    narrative.collisionPressure * 0.15 -
    narrative.oceanBasinPressure * 0.20 -
    narrative.erosionPressure * 0.08 +
    (ridgeBand ? 0.30 : 0) -
    (valleyBand ? 0.18 : 0) +
    (isPolarCap ? 0.10 : 0),
    -0.95,
    1.08
  );

  const child = {
    geographyModel: "h-earth-child-256-hex-hidden-substrate",
    parentAddress: parent.parentAddress,
    childAddress,
    row,
    col,
    childLat,
    childLon,
    signed,
    elevation,
    detail: hash(band * 31 + row, sector * 29 + col, 97),
    landBody: childIsLand && !childLake ? parent.landBody : null,
    ocean: childOcean ? parent.ocean || getOceanName(sector, band) : null,
    sea: childSea ? parent.sea || getSeaName(sector, band) : null,
    lake: childLake ? parent.lake : null,
    coastlineSegment: childCoast ? parent.coastlineSegment || ((parent.parentAddress % H_EARTH_GEOGRAPHY.coastlineSegments) + 1) : null,
    beach: childBeach ? parent.beach || `Beach ${String((parent.parentAddress % H_EARTH_GEOGRAPHY.beaches) + 1).padStart(2, "0")}` : null,
    shelf: childShelf ? parent.shelf || `Shelf Zone ${String((parent.parentAddress % H_EARTH_GEOGRAPHY.shelves) + 1).padStart(2, "0")}` : null,
    ridge: ridgeBand ? parent.ridge : null,
    valley: valleyBand ? parent.valley : null,
    polarCap: isPolarCap ? parent.polarCap : null,
    ice: isPolarCap || parent.ice,
    coast: childCoast,
    water: childWater,
    shelfZone: childShelf,
    seaZone: childSea,
    lakeZone: childLake,
    beachZone: childBeach,
    mountain: ridgeBand || (!childWater && elevation > 0.54 && narrative.collisionPressure > 0.36),
    highland: !childWater && elevation > 0.24,
    valleyZone: valleyBand,
    dry: !childWater && !childCoast && !isPolarCap && elevation > 0.18 && parent.detail > 0.55 && narrative.erosionPressure > 0.28,
    ridgePressure: ridgeBand ? 1 : narrative.collisionPressure * 0.35,
    valleyPressure: valleyBand ? 1 : narrative.waterCapturePressure * 0.30,
    coastPressure: childCoast ? 1 : clamp(1 - Math.abs(signed) / 0.18, 0, 1),
    shelfPressure: childShelf ? clamp((signed + 0.145) / 0.145, 0, 1) : narrative.shelfPressure * 0.16
  };

  return applyNodalStoryToChildHex(child, narrative);
}

function makeTerrainPayload({ elevation, polar, latMid, lonMid, band, sector, worldKey }) {
  const detail = hash(band, sector, worldKey.length);
  const ridgeField = Math.sin(lonMid * 5.2 + band * 0.48) + Math.cos(latMid * 7.4 - sector * 0.29);
  const ridge = elevation > 0.30 && ridgeField > 0.42;
  const valley = elevation > 0.08 && elevation < 0.32 && ridgeField < -0.55;
  const ice = polar > (worldKey === "audralia" ? 0.88 : 0.80);
  const coast = Math.abs(elevation) < 0.13;
  const water = elevation < (worldKey === "audralia" ? 0.03 : -0.05) && !ice;
  const shelf = water && elevation > -0.22;
  const mountain = elevation > 0.48 && !ice;
  const highland = elevation > 0.24 && !ice;
  const dry = elevation > (worldKey === "audralia" ? 0.10 : 0.35) && !ice && !water;

  return {
    geographyModel: `${worldKey}-generic-portrait`,
    elevation,
    ice,
    coast,
    water,
    shelfZone: shelf,
    seaZone: shelf,
    mountain,
    highland,
    dry,
    ridge,
    valley,
    lakeZone: false,
    polar,
    detail,
    ridgeField
  };
}

function sampleCell(latMid, lonMid, band, sector, worldKey) {
  if (worldKey === "hEarth") return classifyHEarthCell(latMid, lonMid, band, sector);

  const polar = Math.abs(latMid) / (Math.PI / 2);
  const noise = terrainNoise(latMid, lonMid, band, sector, worldKey);

  if (worldKey === "audralia") {
    const islandCore =
      Math.sin(lonMid * 1.18 - 0.6) * 0.30 +
      Math.cos(lonMid * 2.25 + latMid * 1.05) * 0.24 +
      Math.sin(latMid * 1.7 - 0.3) * 0.12;
    const elevation = noise * 0.76 + islandCore - 0.19 + polar * 0.04;

    return makeTerrainPayload({ elevation, polar, latMid, lonMid, band, sector, worldKey });
  }

  const continentBias =
    Math.sin(lonMid * 1.55 + 0.4) * 0.24 +
    Math.cos(lonMid * 2.8 - latMid * 1.25) * 0.21 +
    Math.sin(latMid * 2.45) * 0.10;

  const elevation = noise + continentBias - 0.10 + polar * 0.08;
  return makeTerrainPayload({ elevation, polar, latMid, lonMid, band, sector, worldKey });
}

function buildMesh(view) {
  const rings = [];

  for (let latIndex = 0; latIndex <= LAT_BANDS; latIndex += 1) {
    const v = latIndex / LAT_BANDS;
    const lat = -Math.PI / 2 + v * Math.PI;
    rings[latIndex] = [];

    for (let lonIndex = 0; lonIndex <= LON_SECTORS; lonIndex += 1) {
      const u = lonIndex / LON_SECTORS;
      const lon = -Math.PI + u * Math.PI * 2;

      const base = makePoint(lat, lon);
      let rotated = rotateY(base, view.yaw);
      rotated = rotateX(rotated, view.pitch);

      rings[latIndex][lonIndex] = {
        local: base,
        world: rotated,
        screen: project(rotated, view),
        lat,
        lon
      };
    }
  }

  return rings;
}

function createCells(mesh, worldKey) {
  const cells = [];
  const lightAngle = state.time * 0.00042;

  const light = normalize({
    x: Math.cos(lightAngle) * 0.72,
    y: 0.54,
    z: Math.sin(lightAngle) * 0.72 + 0.28
  });

  const rimLight = normalize({ x: -0.52, y: 0.28, z: 0.86 });
  const viewDir = normalize({ x: 0, y: 0, z: 1 });

  for (let band = 0; band < LAT_BANDS; band += 1) {
    for (let sector = 0; sector < LON_SECTORS; sector += 1) {
      const p00 = mesh[band][sector];
      const p01 = mesh[band][sector + 1];
      const p11 = mesh[band + 1][sector + 1];
      const p10 = mesh[band + 1][sector];

      const avgWorld = normalize({
        x: (p00.world.x + p01.world.x + p11.world.x + p10.world.x) / 4,
        y: (p00.world.y + p01.world.y + p11.world.y + p10.world.y) / 4,
        z: (p00.world.z + p01.world.z + p11.world.z + p10.world.z) / 4
      });

      if (avgWorld.z < -0.06) continue;

      const latMid = (p00.lat + p10.lat) / 2;
      const lonMid = (p00.lon + p01.lon) / 2;
      const terrain = sampleCell(latMid, lonMid, band, sector, worldKey);

      const e1 = subtract(p01.world, p00.world);
      const e2 = subtract(p10.world, p00.world);
      const faceNormal = normalize(cross(e1, e2));
      const normal = dot(faceNormal, avgWorld) < 0
        ? { x: -faceNormal.x, y: -faceNormal.y, z: -faceNormal.z }
        : faceNormal;

      const diffuse = clamp(dot(avgWorld, light), 0, 1);
      const rim = Math.pow(clamp(1 - Math.abs(dot(avgWorld, viewDir)), 0, 1), 2.2);
      const secondary = clamp(dot(avgWorld, rimLight), 0, 1);

      cells.push({
        points: [p00.screen, p01.screen, p11.screen, p10.screen],
        corners: [p00, p01, p11, p10],
        depth: avgWorld.z,
        band,
        sector,
        terrain,
        diffuse,
        rim,
        secondary,
        normal,
        worldKey
      });
    }
  }

  return cells.sort((a, b) => a.depth - b.depth);
}

function terrainColorComponents(terrain, worldKey, light, rim = 0) {
  const world = WORLDS[worldKey];
  let r;
  let g;
  let b;

  if (worldKey === "hEarth") {
    const uplift = terrain.upliftPressure || 0;
    const basin = terrain.oceanBasinPressure || 0;
    const shelf = terrain.shelfPressure || 0;
    const collision = terrain.collisionPressure || 0;
    const erosion = terrain.erosionPressure || 0;

    if (terrain.ice || terrain.polarCap) {
      r = 186 + collision * 14;
      g = 224 + collision * 8;
      b = 240;
    } else if (terrain.lakeZone) {
      r = 30;
      g = 128 + erosion * 12;
      b = 154 + shelf * 16;
    } else if (terrain.water) {
      if (terrain.shelfZone) {
        r = 72 + shelf * 14;
        g = 164 + shelf * 16;
        b = 174 + shelf * 10;
      } else if (terrain.seaZone) {
        r = 24 + shelf * 8;
        g = 94 + shelf * 12;
        b = 144 + shelf * 16;
      } else {
        r = 8 + basin * 5;
        g = 36 + basin * 8;
        b = 102 + basin * 24;
      }
    } else if (terrain.beachZone || terrain.beach) {
      r = 214;
      g = 194 + shelf * 10;
      b = 130 - collision * 8;
    } else if (terrain.coast) {
      r = 184 + shelf * 8;
      g = 166 + erosion * 8;
      b = 112;
    } else if (terrain.mountain) {
      r = 136 + collision * 18;
      g = 130 + uplift * 10;
      b = 120;
    } else if (terrain.highland) {
      r = 72 + uplift * 16;
      g = 138 + uplift * 16;
      b = 84;
    } else if (terrain.valleyZone) {
      r = 42;
      g = 128 + erosion * 16;
      b = 82 + (terrain.waterCapturePressure || 0) * 10;
    } else if (terrain.dry) {
      r = 150 + erosion * 10;
      g = 130;
      b = 88 - basin * 8;
    } else {
      r = 52 + uplift * 10;
      g = 132 + uplift * 10;
      b = 86;
    }
  } else if (terrain.ice) {
    r = 170; g = 213; b = 238;
  } else if (terrain.water) {
    if (terrain.shelfZone) {
      r = world.secondary[0] + 18;
      g = world.secondary[1] + 38;
      b = world.secondary[2] + 30;
    } else {
      r = Math.max(4, world.secondary[0] * 0.18);
      g = Math.max(22, world.secondary[1] * 0.32);
      b = Math.max(72, world.secondary[2] * 0.76);
    }
  } else if (terrain.coast) {
    r = 186; g = 168; b = 101;
  } else if (terrain.mountain) {
    r = 150; g = 136; b = 118;
  } else if (terrain.highland) {
    r = world.primary[0] + 24;
    g = world.primary[1] + 14;
    b = world.primary[2] - 2;
  } else if (terrain.valley) {
    r = Math.max(24, world.primary[0] - 12);
    g = world.primary[1] + 20;
    b = Math.max(44, world.primary[2] - 18);
  } else if (terrain.dry) {
    r = 156; g = 128; b = 82;
  } else {
    r = world.primary[0];
    g = world.primary[1];
    b = world.primary[2];
  }

  const elevationWarmth = clamp(terrain.elevation, -0.5, 0.65);
  const detailShift = (terrain.detail - 0.5) * (worldKey === "hEarth" ? 5 : 12);
  const waterBoost = terrain.water ? 14 : 0;
  const finalLight = clamp(light + rim * 0.08, 0.16, 1.12);

  r = Math.round(clamp((r + elevationWarmth * 14 + detailShift) * finalLight, 0, 255));
  g = Math.round(clamp((g + elevationWarmth * 7 + detailShift * 0.25) * finalLight, 0, 255));
  b = Math.round(clamp((b + waterBoost - elevationWarmth * 4 - detailShift * 0.12) * finalLight, 0, 255));

  return [r, g, b];
}

function colorForTerrain(terrain, worldKey, light, rim = 0, alpha = 1) {
  const [r, g, b] = terrainColorComponents(terrain, worldKey, light, rim);
  return alpha >= 1 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${alpha})`;
}

function colorForCell(cell) {
  const light = 0.33 + cell.diffuse * 0.54 + cell.secondary * 0.10 + cell.rim * 0.20;
  return colorForTerrain(cell.terrain, cell.worldKey, light, cell.rim);
}

function drawBackground(ctx, width, height) {
  const world = WORLDS[state.worldKey];

  const bg = ctx.createRadialGradient(width * 0.5, height * 0.42, 0, width * 0.5, height * 0.52, Math.max(width, height) * 0.82);
  bg.addColorStop(0, "#13264a");
  bg.addColorStop(0.30, "#091832");
  bg.addColorStop(0.68, "#041021");
  bg.addColorStop(1, "#01040c");

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const halo = ctx.createRadialGradient(width * 0.5, height * 0.49, 0, width * 0.5, height * 0.49, width * 0.39);
  halo.addColorStop(0, world.glow);
  halo.addColorStop(0.38, "rgba(142,190,255,0.075)");
  halo.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.ellipse(width * 0.5, height * 0.50, width * 0.34, height * 0.31, 0, 0, Math.PI * 2);
  ctx.fill();

  const vignette = ctx.createRadialGradient(width * 0.5, height * 0.5, width * 0.20, width * 0.5, height * 0.5, width * 0.74);
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

function pathCell(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  ctx.lineTo(points[1].x, points[1].y);
  ctx.lineTo(points[2].x, points[2].y);
  ctx.lineTo(points[3].x, points[3].y);
  ctx.closePath();
}

function pathHexSample(ctx, parentPoints, centerU, centerV, du, dv) {
  const grow = 1.24;
  const hex = [
    bilinearScreen(parentPoints, centerU - du * 0.42 * grow, centerV),
    bilinearScreen(parentPoints, centerU - du * 0.20 * grow, centerV - dv * 0.43 * grow),
    bilinearScreen(parentPoints, centerU + du * 0.20 * grow, centerV - dv * 0.43 * grow),
    bilinearScreen(parentPoints, centerU + du * 0.42 * grow, centerV),
    bilinearScreen(parentPoints, centerU + du * 0.20 * grow, centerV + dv * 0.43 * grow),
    bilinearScreen(parentPoints, centerU - du * 0.20 * grow, centerV + dv * 0.43 * grow)
  ];

  ctx.beginPath();
  ctx.moveTo(hex[0].x, hex[0].y);

  for (let i = 1; i < hex.length; i += 1) {
    ctx.lineTo(hex[i].x, hex[i].y);
  }

  ctx.closePath();
}

function drawGenericCellDetail(ctx, cell) {
  const terrain = cell.terrain;
  const pts = cell.points;
  const depthAlpha = clamp(0.25 + cell.depth * 0.65, 0.12, 0.86);

  ctx.save();
  pathCell(ctx, pts);
  ctx.clip();

  const midLeft = { x: (pts[0].x + pts[3].x) / 2, y: (pts[0].y + pts[3].y) / 2 };
  const midRight = { x: (pts[1].x + pts[2].x) / 2, y: (pts[1].y + pts[2].y) / 2 };
  const topMid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
  const bottomMid = { x: (pts[2].x + pts[3].x) / 2, y: (pts[2].y + pts[3].y) / 2 };

  if (terrain.coast || terrain.shelfZone) {
    ctx.strokeStyle = `rgba(226,238,210,${0.15 * depthAlpha})`;
    ctx.lineWidth = Math.max(0.8, DPR * 0.75);
    ctx.beginPath();
    ctx.moveTo(midLeft.x, midLeft.y);
    ctx.bezierCurveTo(topMid.x, topMid.y, bottomMid.x, bottomMid.y, midRight.x, midRight.y);
    ctx.stroke();
  }

  if (terrain.ridge || terrain.mountain) {
    ctx.strokeStyle = `rgba(236,230,207,${0.20 * depthAlpha})`;
    ctx.lineWidth = Math.max(0.65, DPR * 0.62);
    ctx.beginPath();
    ctx.moveTo(pts[3].x * 0.55 + pts[0].x * 0.45, pts[3].y * 0.55 + pts[0].y * 0.45);
    ctx.lineTo(pts[1].x * 0.64 + pts[2].x * 0.36, pts[1].y * 0.64 + pts[2].y * 0.36);
    ctx.stroke();
  }

  if (terrain.valley || terrain.valleyZone) {
    ctx.strokeStyle = `rgba(20,70,55,${0.22 * depthAlpha})`;
    ctx.lineWidth = Math.max(0.7, DPR * 0.66);
    ctx.beginPath();
    ctx.moveTo(topMid.x, topMid.y);
    ctx.bezierCurveTo(pts[0].x, pts[0].y, pts[2].x, pts[2].y, bottomMid.x, bottomMid.y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawHEarthFeatureLines(ctx, parentCell) {
  const points = parentCell.points;
  const terrain = parentCell.terrain;
  const narrative = terrain.nodalNarrative;
  const depthAlpha = clamp(0.16 + parentCell.depth * 0.62, 0.06, 0.62);

  ctx.save();
  pathCell(ctx, points);
  ctx.clip();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (let i = 0; i < 2; i += 1) {
    const u0 = 0.08 + i * 0.24 + narrative.centerInfluence * 0.04;
    const u1 = 0.92 - i * 0.11;
    const v = 0.38 + Math.sin((terrain.parentAddress + i) * 0.7) * 0.12;

    if (terrain.coastlineSegment || terrain.shelfZone || terrain.beach || terrain.lakeZone) {
      const a = bilinearScreen(points, u0, v);
      const b = bilinearScreen(points, 0.42, v + 0.10 * Math.sin(i + terrain.parentAddress));
      const c = bilinearScreen(points, u1, v + 0.04 * Math.cos(i + terrain.parentAddress));

      ctx.strokeStyle = terrain.beach
        ? `rgba(255,232,163,${0.12 * depthAlpha})`
        : `rgba(205,232,210,${0.10 * depthAlpha})`;

      ctx.lineWidth = Math.max(0.42, DPR * 0.42);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(b.x, b.y, c.x, c.y);
      ctx.stroke();
    }

    if (terrain.ridge || terrain.mountain) {
      const a = bilinearScreen(points, 0.14, 0.72 - i * 0.24);
      const b = bilinearScreen(points, 0.52, 0.30 + narrative.collisionPressure * 0.16);
      const c = bilinearScreen(points, 0.88, 0.62 - i * 0.12);

      ctx.strokeStyle = `rgba(236,230,207,${0.10 * depthAlpha})`;
      ctx.lineWidth = Math.max(0.36, DPR * 0.36);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(b.x, b.y, c.x, c.y);
      ctx.stroke();
    }

    if (terrain.valley || terrain.valleyZone) {
      const a = bilinearScreen(points, 0.30 + i * 0.18, 0.12);
      const b = bilinearScreen(points, 0.46 + i * 0.10, 0.50);
      const c = bilinearScreen(points, 0.62 + i * 0.06, 0.88);

      ctx.strokeStyle = `rgba(20,70,55,${0.11 * depthAlpha})`;
      ctx.lineWidth = Math.max(0.38, DPR * 0.38);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(b.x, b.y, c.x, c.y);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawHEarthChildHexSurface(ctx, parentCell) {
  const points = parentCell.points;
  const du = 1 / CHILD_HEX_COLS;
  const dv = 1 / CHILD_HEX_ROWS;
  const baseLight = 0.34 + parentCell.diffuse * 0.54 + parentCell.secondary * 0.10 + parentCell.rim * 0.18;
  const parentAlpha = clamp(0.88 + parentCell.rim * 0.08, 0.82, 0.98);

  ctx.save();
  pathCell(ctx, points);
  ctx.fillStyle = colorForTerrain(parentCell.terrain, "hEarth", baseLight, parentCell.rim, parentAlpha);
  ctx.fill();
  ctx.restore();

  ctx.save();
  pathCell(ctx, points);
  ctx.clip();
  ctx.globalCompositeOperation = "source-over";

  for (let row = 0; row < CHILD_HEX_ROWS; row += 1) {
    for (let col = 0; col < CHILD_HEX_COLS; col += 1) {
      const offset = row % 2 === 0 ? 0 : 0.5;
      const centerU = clamp((col + 0.5 + offset * 0.28) / CHILD_HEX_COLS, 0.025, 0.975);
      const centerV = clamp((row + 0.5) / CHILD_HEX_ROWS, 0.025, 0.975);
      const child = classifyHEarthChildHex(parentCell, row, col, centerU, centerV);

      const localLight =
        baseLight +
        child.elevation * 0.038 +
        child.ridgePressure * 0.034 -
        (child.water ? 0.016 : 0) +
        (hash(parentCell.band * 100 + row, parentCell.sector * 100 + col, 17) - 0.5) * 0.012;

      const alpha =
        child.coastlineSegment || child.beachZone || child.lakeZone || child.shelfZone
          ? 0.34
          : child.ridge || child.valley
            ? 0.24
            : 0.18;

      pathHexSample(ctx, points, centerU, centerV, du, dv);
      ctx.fillStyle = colorForTerrain(child, "hEarth", clamp(localLight, 0.18, 1.10), parentCell.rim, alpha);
      ctx.fill();
    }
  }

  ctx.restore();

  drawHEarthFeatureLines(ctx, parentCell);

  ctx.save();
  pathCell(ctx, points);
  ctx.strokeStyle = `rgba(230,244,255,${0.006 + parentCell.rim * 0.018})`;
  ctx.lineWidth = Math.max(0.12, DPR * 0.11);
  ctx.stroke();
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

  drawPlanetShadow(ctx, view);

  const mesh = buildMesh(view);
  const cells = createCells(mesh, state.worldKey);

  ctx.save();

  for (const cell of cells) {
    if (cell.worldKey === "hEarth") {
      drawHEarthChildHexSurface(ctx, cell);
      continue;
    }

    pathCell(ctx, cell.points);
    ctx.fillStyle = colorForCell(cell);
    ctx.fill();

    ctx.strokeStyle = `rgba(230,244,255,${0.040 + cell.rim * 0.12})`;
    ctx.lineWidth = Math.max(0.35, DPR * 0.38);
    ctx.stroke();

    drawGenericCellDetail(ctx, cell);
  }

  ctx.restore();

  drawLatLongDefinition(ctx, view);
  drawAtmosphere(ctx, view);
  drawOrbitLines(ctx, view);
  drawWorldTitle(ctx, width, height);
  drawCue(ctx, width, height);

  document.documentElement.dataset.globeShowcaseModel = MODEL_NAME;
  document.documentElement.dataset.selectedWorld = state.worldKey;
  document.documentElement.dataset.parentCellCount = String(CELL_COUNT);
  document.documentElement.dataset.childFieldsPerParent = String(CHILD_HEX_COUNT);
  document.documentElement.dataset.totalChildFields = String(TOTAL_CHILD_FIELDS);
  document.documentElement.dataset.privateEnginesAsleep = "true";
  document.documentElement.dataset.hEarthExpressionCoherence = state.worldKey === "hEarth" ? "macro-surface-active" : "inactive";
}

function drawLatLongDefinition(ctx, view) {
  if (state.worldKey !== "hEarth") return;

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.strokeStyle = "rgba(210,238,255,0.024)";
  ctx.lineWidth = Math.max(0.35, DPR * 0.34);

  for (let i = 1; i < 4; i += 1) {
    const w = view.scale * (0.36 + i * 0.18);
    const h = view.scale * (0.94 - i * 0.08);
    ctx.beginPath();
    ctx.ellipse(view.cx, view.cy, w, h, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  for (let i = -2; i <= 2; i += 1) {
    ctx.beginPath();
    ctx.ellipse(
      view.cx,
      view.cy + i * view.scale * 0.18,
      view.scale * Math.sqrt(Math.max(0.18, 1 - Math.abs(i) * 0.16)),
      view.scale * 0.18,
      0,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  }

  ctx.restore();
}

function drawPlanetShadow(ctx, view) {
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

function drawAtmosphere(ctx, view) {
  const world = WORLDS[state.worldKey];

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const outer = ctx.createRadialGradient(view.cx, view.cy, view.scale * 0.76, view.cx, view.cy, view.scale * 1.12);
  outer.addColorStop(0, "rgba(0,0,0,0)");
  outer.addColorStop(0.72, "rgba(142,190,255,0.10)");
  outer.addColorStop(1, world.glow);

  ctx.fillStyle = outer;
  ctx.beginPath();
  ctx.arc(view.cx, view.cy, view.scale * 1.10, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(210,240,255,0.24)";
  ctx.lineWidth = Math.max(1, DPR * 1.1);
  ctx.beginPath();
  ctx.arc(view.cx, view.cy, view.scale * 1.005, 0, Math.PI * 2);
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

  ctx.strokeStyle = "rgba(142,190,255,0.08)";
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
  ctx.fillText(`${world.subtitle} · macro surface / hidden child hex substrate`, width * 0.5, height * 0.205);

  ctx.restore();
}

function drawCue(ctx, width, height) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(186,197,212,0.60)";
  ctx.font = `800 ${Math.max(11 * DPR, width * 0.013)}px Inter, system-ui, sans-serif`;
  ctx.fillText("Drag to inspect · Select a world · Open room for private engine", width * 0.5, height * 0.90);
  ctx.restore();
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
      state.targetYaw += 0.0010;
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
    cellCount: CELL_COUNT,
    latBands: LAT_BANDS,
    lonSectors: LON_SECTORS,
    childHexRows: CHILD_HEX_ROWS,
    childHexCols: CHILD_HEX_COLS,
    childHexCount: CHILD_HEX_COUNT,
    totalChildFields: TOTAL_CHILD_FIELDS,
    privateEnginesAsleep: true,
    fixedStructure: true,
    inspectable: true,
    generatedImage: false,
    graphicBox: false,
    hEarthPlanetaryHistory: H_EARTH_PLANETARY_HISTORY,
    hEarthCenterCross: H_EARTH_CENTER_CROSS,
    hEarthGeography: H_EARTH_GEOGRAPHY,
    hEarthPlates: H_EARTH_TECTONIC_PLATES,
    setWorld,
    reset: resetInspection,
    status() {
      return {
        model: MODEL_NAME,
        selectedWorld: state.worldKey,
        parentCellCount: CELL_COUNT,
        childFieldsPerParent: CHILD_HEX_COUNT,
        totalChildFields: TOTAL_CHILD_FIELDS,
        latBands: LAT_BANDS,
        lonSectors: LON_SECTORS,
        privateEnginesAsleep: true,
        fixedStructure: true,
        inspectable: true,
        hEarthExpressionCoherence: state.worldKey === "hEarth" ? "macro-surface-active" : "inactive",
        hEarthPlanetaryHistory: H_EARTH_PLANETARY_HISTORY,
        hEarthCenterCross: H_EARTH_CENTER_CROSS,
        hEarthCounts: H_EARTH_GEOGRAPHY,
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
  cellCount: CELL_COUNT,
  childHexCount: CHILD_HEX_COUNT,
  totalChildFields: TOTAL_CHILD_FIELDS,
  privateEnginesAsleep: true,
  inspectable: true,
  hEarthPlanetaryHistory: H_EARTH_PLANETARY_HISTORY,
  hEarthCenterCross: H_EARTH_CENTER_CROSS,
  hEarthGeography: H_EARTH_GEOGRAPHY,
  hEarthPlates: H_EARTH_TECTONIC_PLATES
};

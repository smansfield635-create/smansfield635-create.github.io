/* /assets/audralia/audralia/tectonics/topology/render.js */
/* AUDRALIA_TOPOLOGY_FOOTPRINT_AUTHORITY */
/* TNT: AUDRALIA_TOPOLOGY_4K_FOOTPRINT_AUTHORITY_TNT_v1 */

const RECEIPT = "AUDRALIA_TOPOLOGY_FOOTPRINT_AUTHORITY_RECEIPT";
const CONTRACT = "AUDRALIA_TOPOLOGY_4K_FOOTPRINT_AUTHORITY_TNT_v1";
const VERSION = "2026-05-06.topology-4k-footprint-authority-v1";

const TOPOLOGY_AUTHORITY = Object.freeze({
  name: "Audralia Topology Footprint Authority",
  planet: "Audralia",
  receipt: RECEIPT,
  contract: CONTRACT,
  version: VERSION,
  lineage: "tectonics -> topology -> terrain",
  role: "land-void-footprint-and-sea-level-boundary-authority",
  precinct: "landmass footprint, ocean void, sea-level boundary, coastal shelves, beaches, sand class, cliff edge, subterranean plate memory, and terrain-admissible mask",
  jurisdiction: [
    "land-versus-void",
    "sea-level-boundary",
    "coastline",
    "coastal-shelf",
    "beach-zone",
    "black-diamond-sand-zone",
    "white-opal-sand-zone",
    "subterranean-plate-memory",
    "terrain-admissibility-mask",
    "land-ratio-diagnostic"
  ],
  nonJurisdiction: [
    "terrain-elevation",
    "terrain-relief",
    "above-sea-slope",
    "hydration-flow",
    "ocean-animation",
    "deep-ocean-current",
    "canvas-final-render",
    "route-shell",
    "html",
    "runtime-boot",
    "GraphicBox",
    "image-generation"
  ],
  exposedLandRatioIntent: "earth-compatible-above-water-ratio",
  targetLandRatioBand: [0.27, 0.31],
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false
});

const LANDMASSES = Object.freeze([
  {
    id: "western-mainland-arc",
    className: "mainland-ancient-weathered-arc",
    region: 2,
    role: "primary-mainland",
    points: [
      [-54, -158], [-48, -149], [-39, -140], [-29, -134], [-18, -132],
      [-8, -126], [1, -117], [11, -108], [20, -94], [25, -82],
      [23, -71], [15, -62], [3, -57], [-10, -60], [-23, -71],
      [-34, -90], [-44, -116], [-52, -139]
    ],
    shelf: [
      [-61, -165], [-51, -154], [-39, -145], [-20, -144], [4, -128],
      [28, -99], [31, -74], [10, -49], [-18, -52], [-44, -86],
      [-60, -125]
    ],
    beachBias: 0.38,
    blackSandBias: 0.42,
    whiteSandBias: 0.26,
    subterraneanPlate: "western-granite-slate-pressure-plate"
  },
  {
    id: "eastern-attached-mainland",
    className: "attached-opal-granite-mainland",
    region: 3,
    role: "attached-mainland",
    points: [
      [-26, -68], [-14, -55], [-2, -44], [9, -31], [20, -17],
      [30, -2], [37, 16], [35, 34], [25, 50], [11, 58],
      [-5, 54], [-18, 42], [-26, 23], [-31, -3], [-32, -31],
      [-30, -51]
    ],
    shelf: [
      [-31, -74], [-5, -54], [23, -22], [46, 12], [42, 51],
      [9, 73], [-22, 50], [-39, 4], [-39, -44]
    ],
    beachBias: 0.46,
    blackSandBias: 0.18,
    whiteSandBias: 0.51,
    subterraneanPlate: "eastern-opal-granite-transition-plate"
  },
  {
    id: "northern-rock-crown",
    className: "north-polar-rock-and-ice-crown",
    region: 1,
    role: "north-polar-landmass",
    points: [
      [41, -154], [50, -132], [58, -105], [64, -76], [66, -48],
      [61, -20], [53, 7], [44, 26], [37, 11], [34, -20],
      [35, -56], [37, -94]
    ],
    shelf: [
      [36, -162], [64, -128], [74, -70], [72, -8], [54, 37],
      [31, 11], [26, -45], [30, -106]
    ],
    beachBias: 0.12,
    blackSandBias: 0.08,
    whiteSandBias: 0.28,
    subterraneanPlate: "north-slate-diamond-understone-cap"
  },
  {
    id: "southern-weathered-mass",
    className: "south-polar-weathered-diamond-opal-mass",
    region: 5,
    role: "south-polar-landmass",
    points: [
      [-69, -50], [-62, -17], [-55, 20], [-47, 49], [-36, 76],
      [-25, 107], [-28, 130], [-41, 153], [-55, 166], [-68, 157],
      [-76, 122], [-80, 78], [-78, 28]
    ],
    shelf: [
      [-82, -64], [-70, 8], [-58, 66], [-33, 99], [-17, 133],
      [-44, 177], [-72, 179], [-86, 126], [-88, 30]
    ],
    beachBias: 0.31,
    blackSandBias: 0.24,
    whiteSandBias: 0.49,
    subterraneanPlate: "south-diamond-opal-weathered-plate"
  },
  {
    id: "equatorial-ancient-chain",
    className: "equatorial-ancient-eroded-chain",
    region: 4,
    role: "equatorial-landmass-chain",
    points: [
      [-13, 60], [-3, 75], [9, 94], [18, 116], [19, 137],
      [9, 156], [-4, 166], [-16, 154], [-22, 130], [-23, 101],
      [-20, 77]
    ],
    shelf: [
      [-25, 55], [2, 74], [25, 104], [25, 146], [5, 178],
      [-24, 162], [-35, 118]
    ],
    beachBias: 0.29,
    blackSandBias: 0.34,
    whiteSandBias: 0.33,
    subterraneanPlate: "equatorial-diamond-granite-memory-chain"
  },
  {
    id: "western-pressure-islands",
    className: "western-pressure-island-belt",
    region: 7,
    role: "island-belt",
    points: [
      [4, -171], [15, -164], [23, -150], [21, -138],
      [11, -131], [-2, -136], [-8, -151], [-5, -165]
    ],
    shelf: [
      [-2, -178], [17, -169], [29, -151], [24, -132],
      [8, -124], [-10, -134], [-15, -154]
    ],
    beachBias: 0.52,
    blackSandBias: 0.47,
    whiteSandBias: 0.21,
    subterraneanPlate: "western-pressure-island-fracture-belt"
  },
  {
    id: "south-east-shelf-islands",
    className: "southeast-opal-shelf-islands",
    region: 6,
    role: "shelf-islands",
    points: [
      [-42, 92], [-34, 106], [-29, 122], [-34, 138],
      [-49, 134], [-56, 116], [-53, 100]
    ],
    shelf: [
      [-56, 88], [-43, 103], [-35, 123], [-38, 145],
      [-53, 143], [-64, 120], [-60, 98]
    ],
    beachBias: 0.58,
    blackSandBias: 0.16,
    whiteSandBias: 0.55,
    subterraneanPlate: "southeast-opal-shelf-memory"
  },
  {
    id: "far-east-reef-knife",
    className: "far-east-thin-reef-knife",
    region: 8,
    role: "thin-reef-and-coast-knife",
    points: [
      [-48, 146], [-36, 154], [-20, 164], [-7, 176],
      [0, -174], [-17, -169], [-35, -160], [-51, -151]
    ],
    shelf: [
      [-54, 135], [-40, 149], [-22, 161], [-3, 174],
      [8, -174], [-13, -158], [-37, -145], [-58, -135]
    ],
    beachBias: 0.62,
    blackSandBias: 0.22,
    whiteSandBias: 0.61,
    subterraneanPlate: "far-east-opal-reef-knife-boundary"
  }
]);

const SUBTERRANEAN_MEMORY_LINES = Object.freeze([
  {
    id: "western-compression-root",
    className: "subterranean-compression",
    line: [[-58, -150], [-42, -128], [-27, -104], [-13, -80], [2, -57]]
  },
  {
    id: "east-mainland-suture",
    className: "subterranean-suture",
    line: [[-30, -59], [-14, -39], [4, -18], [21, 4], [35, 29]]
  },
  {
    id: "north-crown-root",
    className: "subterranean-polar-root",
    line: [[42, -146], [54, -107], [63, -65], [61, -22], [48, 18]]
  },
  {
    id: "south-weathered-root",
    className: "subterranean-weathered-root",
    line: [[-76, 55], [-64, 82], [-52, 111], [-43, 142], [-57, 166]]
  },
  {
    id: "equatorial-chain-root",
    className: "subterranean-equatorial-root",
    line: [[-21, 78], [-10, 101], [2, 124], [11, 149], [0, 168]]
  }
]);

const TOPOLOGY_PALETTE = Object.freeze({
  land: "rgba(102, 126, 94, 0.94)",
  shelf: "rgba(114, 205, 216, 0.30)",
  beachWhite: "rgba(246, 231, 188, 0.74)",
  beachBlack: "rgba(42, 39, 36, 0.58)",
  coast: "rgba(246, 224, 170, 0.48)",
  voidOcean: "rgba(4, 38, 92, 0.96)",
  subterraneanLine: "rgba(238, 205, 125, 0.36)",
  terrainMask: "rgba(255, 255, 255, 0.22)"
});

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeLongitude(lon) {
  let value = Number(lon) || 0;

  while (value > 180) value -= 360;
  while (value < -180) value += 360;

  return value;
}

function normalizeLatitude(lat) {
  return clamp(Number(lat) || 0, -90, 90);
}

function hash01(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453123;
  return x - Math.floor(x);
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function unwrapPolygon(points, lon) {
  const target = normalizeLongitude(lon);

  return points.map(function (point) {
    let pointLon = normalizeLongitude(point[1]);

    if (Math.abs(pointLon - target) > 180) {
      pointLon += pointLon < target ? 360 : -360;
    }

    return [point[0], pointLon];
  });
}

function pointInPolygon(lat, lon, polygon) {
  const unwrapped = unwrapPolygon(polygon, lon);
  const x = normalizeLongitude(lon);
  const y = lat;
  let inside = false;

  for (let i = 0, j = unwrapped.length - 1; i < unwrapped.length; j = i, i += 1) {
    const yi = unwrapped[i][0];
    const xi = unwrapped[i][1];
    const yj = unwrapped[j][0];
    const xj = unwrapped[j][1];

    const intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / ((yj - yi) || 0.000001) + xi);

    if (intersect) inside = !inside;
  }

  return inside;
}

function distanceLatLon(latA, lonA, latB, lonB) {
  const dLat = latA - latB;
  const dLon = normalizeLongitude(lonA - lonB);

  return Math.sqrt(dLat * dLat + dLon * dLon);
}

function distanceToSegment(lat, lon, start, end) {
  const x = normalizeLongitude(lon);
  const y = lat;
  const x1 = normalizeLongitude(start[1]);
  const y1 = start[0];
  let x2 = normalizeLongitude(end[1]);
  const y2 = end[0];

  if (Math.abs(x2 - x1) > 180) {
    x2 += x2 < x1 ? 360 : -360;
  }

  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSq = dx * dx + dy * dy;

  if (lengthSq === 0) return distanceLatLon(lat, lon, y1, x1);

  const t = clamp(((x - x1) * dx + (y - y1) * dy) / lengthSq, 0, 1);
  const px = x1 + t * dx;
  const py = y1 + t * dy;

  return distanceLatLon(lat, lon, py, px);
}

function distanceToPolygon(lat, lon, polygon) {
  let distance = Infinity;

  for (let index = 0; index < polygon.length; index += 1) {
    const start = polygon[index];
    const end = polygon[(index + 1) % polygon.length];
    distance = Math.min(distance, distanceToSegment(lat, lon, start, end));
  }

  return distance;
}

function lineInfluence(lat, lon, line, width) {
  let influence = 0;

  for (let index = 0; index < line.length - 1; index += 1) {
    const distance = distanceToSegment(lat, lon, line[index], line[index + 1]);
    influence = Math.max(influence, smoothstep(width, 0, distance));
  }

  return clamp(influence, 0, 1);
}

function mineralNoise(lat, lon, seed) {
  const a = Math.sin((lat + seed * 11.17) * 0.077) * Math.cos((lon - seed * 5.31) * 0.059);
  const b = Math.sin((lat * 0.41 + lon * 0.19 + seed) * 0.141);
  const c = Math.cos((lon - lat * 0.27 + seed * 2.13) * 0.033);

  return clamp((a + b * 0.55 + c * 0.38 + 1.93) / 3.86, 0, 1);
}

function classifySand(lat, lon, landmass, coastDistance) {
  const mineral = mineralNoise(lat, lon, landmass.region * 17);
  const blackWeight = landmass.blackSandBias * 0.62 + mineral * 0.38;
  const whiteWeight = landmass.whiteSandBias * 0.58 + (1 - mineral) * 0.42;
  const beachStrength = smoothstep(6.5, 0.2, coastDistance) * landmass.beachBias;

  if (beachStrength < 0.14) return "none";
  if (blackWeight > whiteWeight + 0.10) return "black-diamond-sand";
  return "white-opal-sand";
}

function sampleTopology(latInput, lonInput, options = {}) {
  const lat = normalizeLatitude(latInput);
  const lon = normalizeLongitude(lonInput);
  let landmass = null;
  let shelfMass = null;
  let coastDistance = Infinity;
  let shelfDistance = Infinity;
  let insideLand = false;
  let insideShelf = false;

  for (let index = 0; index < LANDMASSES.length; index += 1) {
    const current = LANDMASSES[index];

    if (pointInPolygon(lat, lon, current.points)) {
      insideLand = true;
      landmass = current;
    }

    if (pointInPolygon(lat, lon, current.shelf)) {
      insideShelf = true;
      shelfMass = current;
    }

    const localCoastDistance = distanceToPolygon(lat, lon, current.points);
    const localShelfDistance = distanceToPolygon(lat, lon, current.shelf);

    if (localCoastDistance < coastDistance) {
      coastDistance = localCoastDistance;
      if (!landmass) landmass = current;
    }

    if (localShelfDistance < shelfDistance) {
      shelfDistance = localShelfDistance;
      if (!shelfMass) shelfMass = current;
    }
  }

  let subterraneanInfluence = 0;
  let subterraneanLine = null;

  for (let index = 0; index < SUBTERRANEAN_MEMORY_LINES.length; index += 1) {
    const current = SUBTERRANEAN_MEMORY_LINES[index];
    const influence = lineInfluence(lat, lon, current.line, 11);

    if (influence > subterraneanInfluence) {
      subterraneanInfluence = influence;
      subterraneanLine = current;
    }
  }

  const activeMass = landmass || shelfMass;
  const beachClass = activeMass ? classifySand(lat, lon, activeMass, coastDistance) : "none";
  const coastBand = smoothstep(8, 0, coastDistance);
  const shelfBand = insideShelf && !insideLand ? smoothstep(12, 0, shelfDistance) : 0;
  const terrainAdmissible = insideLand || coastBand > 0.42;
  const seaLevelBoundary = coastBand > 0.22 && coastBand < 0.92;
  const oceanVoid = !insideLand;
  const topologyClass = insideLand
    ? "land"
    : insideShelf
      ? "coastal-shelf"
      : subterraneanInfluence > 0.38
        ? "subterranean-memory-under-void"
        : "ocean-void";

  return {
    lat,
    lon,
    topologyAuthority: RECEIPT,
    contract: CONTRACT,
    version: VERSION,
    topologyClass,
    land: insideLand,
    oceanVoid,
    shelf: insideShelf,
    terrainAdmissible,
    seaLevelBoundary,
    coastBand: Number(coastBand.toFixed(4)),
    shelfBand: Number(shelfBand.toFixed(4)),
    coastDistance: Number(coastDistance.toFixed(4)),
    shelfDistance: Number(shelfDistance.toFixed(4)),
    beachClass,
    landmassId: activeMass ? activeMass.id : "none",
    landmassClass: activeMass ? activeMass.className : "none",
    region: activeMass ? activeMass.region : 0,
    role: activeMass ? activeMass.role : "void",
    subterraneanInfluence: Number(subterraneanInfluence.toFixed(4)),
    subterraneanLineId: subterraneanLine ? subterraneanLine.id : "none",
    subterraneanClass: subterraneanLine ? subterraneanLine.className : "none",
    colorHint: insideLand
      ? TOPOLOGY_PALETTE.land
      : insideShelf
        ? TOPOLOGY_PALETTE.shelf
        : TOPOLOGY_PALETTE.voidOcean,
    beachColorHint: beachClass === "black-diamond-sand"
      ? TOPOLOGY_PALETTE.beachBlack
      : beachClass === "white-opal-sand"
        ? TOPOLOGY_PALETTE.beachWhite
        : "rgba(0, 0, 0, 0)"
  };
}

function buildTopologyGrid(options = {}) {
  const latStep = options.latStep || 6;
  const lonStep = options.lonStep || 6;
  const grid = [];

  for (let lat = -84; lat <= 84; lat += latStep) {
    for (let lon = -180; lon < 180; lon += lonStep) {
      grid.push(sampleTopology(lat, lon));
    }
  }

  return grid;
}

function summarizeTopology(options = {}) {
  const grid = buildTopologyGrid(options);
  const total = grid.length || 1;
  let land = 0;
  let shelf = 0;
  let seaLevel = 0;
  let terrainMask = 0;
  let whiteSand = 0;
  let blackSand = 0;
  let subterranean = 0;

  for (let index = 0; index < grid.length; index += 1) {
    const sample = grid[index];

    if (sample.land) land += 1;
    if (sample.shelf) shelf += 1;
    if (sample.seaLevelBoundary) seaLevel += 1;
    if (sample.terrainAdmissible) terrainMask += 1;
    if (sample.beachClass === "white-opal-sand") whiteSand += 1;
    if (sample.beachClass === "black-diamond-sand") blackSand += 1;
    if (sample.subterraneanInfluence > 0.38) subterranean += 1;
  }

  return {
    receipt: RECEIPT,
    contract: CONTRACT,
    version: VERSION,
    totalSamples: total,
    landRatio: Number((land / total).toFixed(4)),
    shelfRatio: Number((shelf / total).toFixed(4)),
    oceanVoidRatio: Number(((total - land) / total).toFixed(4)),
    seaLevelBoundaryRatio: Number((seaLevel / total).toFixed(4)),
    terrainMaskRatio: Number((terrainMask / total).toFixed(4)),
    whiteOpalSandRatio: Number((whiteSand / total).toFixed(4)),
    blackDiamondSandRatio: Number((blackSand / total).toFixed(4)),
    subterraneanMemoryRatio: Number((subterranean / total).toFixed(4)),
    targetLandRatioBand: TOPOLOGY_AUTHORITY.targetLandRatioBand,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };
}

function getTopologyAuthority() {
  return TOPOLOGY_AUTHORITY;
}

function getTopologyLandmasses() {
  return LANDMASSES;
}

function getSubterraneanMemoryLines() {
  return SUBTERRANEAN_MEMORY_LINES;
}

function getTopologyPalette() {
  return TOPOLOGY_PALETTE;
}

const TOPOLOGY_SUMMARY = Object.freeze(summarizeTopology({ latStep: 6, lonStep: 6 }));

function getTopologySummary() {
  return TOPOLOGY_SUMMARY;
}

function publishTopologyAuthority() {
  if (typeof window === "undefined") {
    return TOPOLOGY_AUTHORITY;
  }

  const status = {
    loaded: true,
    receipt: RECEIPT,
    contract: CONTRACT,
    version: VERSION,
    authority: TOPOLOGY_AUTHORITY,
    summary: TOPOLOGY_SUMMARY,
    landmasses: LANDMASSES.length,
    subterraneanMemoryLines: SUBTERRANEAN_MEMORY_LINES.length,
    exposesSampleTopology: true,
    exposesTopologyGrid: true,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };

  window.__AUDRALIA_TOPOLOGY_AUTHORITY__ = status;
  window.__AUDRALIA_TOPOLOGY_STATUS__ = status;

  try {
    window.dispatchEvent(new CustomEvent("audralia:topology-authority-ready", {
      detail: status
    }));
  } catch (_) {
    /* no-op */
  }

  return status;
}

const api = {
  RECEIPT,
  CONTRACT,
  VERSION,
  TOPOLOGY_AUTHORITY,
  LANDMASSES,
  SUBTERRANEAN_MEMORY_LINES,
  TOPOLOGY_PALETTE,
  TOPOLOGY_SUMMARY,
  sampleTopology,
  buildTopologyGrid,
  summarizeTopology,
  getTopologyAuthority,
  getTopologyLandmasses,
  getSubterraneanMemoryLines,
  getTopologyPalette,
  getTopologySummary,
  publishTopologyAuthority
};

if (typeof window !== "undefined") {
  window.AudraliaTopologyAuthority = api;
}

publishTopologyAuthority();

export {
  RECEIPT,
  CONTRACT,
  VERSION,
  TOPOLOGY_AUTHORITY,
  LANDMASSES,
  SUBTERRANEAN_MEMORY_LINES,
  TOPOLOGY_PALETTE,
  TOPOLOGY_SUMMARY,
  sampleTopology,
  buildTopologyGrid,
  summarizeTopology,
  getTopologyAuthority,
  getTopologyLandmasses,
  getSubterraneanMemoryLines,
  getTopologyPalette,
  getTopologySummary,
  publishTopologyAuthority
};

export default api;

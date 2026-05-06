// /assets/audralia/audralia/tectonics/topology/render.js
// AUDRALIA_TOPOLOGY_SUBTERRANEAN_FOOTPRINT_AUTHORITY_TNT_v3
// Full-file replacement. Topology authority only.
// Scope: subterranean footprint / crustal land-root / void-root / sea-level boundary.
// Does not own visible terrain, terrain relief, hydration, oceans, deep ocean, canvas paint, route shell, or visual pass.
// No GraphicBox. No image generation. No visual-pass claim.

const AUDRALIA_TOPOLOGY_RECEIPT = "AUDRALIA_TOPOLOGY_SUBTERRANEAN_FOOTPRINT_AUTHORITY_TNT_v3";

const COMPATIBILITY_RECEIPTS = [
  "AUDRALIA_TOPOLOGY_EARTH_EQUIVALENT_EXPOSED_LAND_RATIO_TNT_v1",
  "AUDRALIA_TECTONICS_TOPOLOGY_CHILD_FOOTPRINT_AUTHORITY_TNT_v1",
  "AUDRALIA_TOPOLOGY_CONTINUOUS_LAND_VOID_BOUNDARY_SWEEP_TNT_v2"
];

const TARGET_SOLID_SURFACE_RATIO = 0.292;
const TARGET_SOLID_SURFACE_RATIO_MIN = 0.27;
const TARGET_SOLID_SURFACE_RATIO_MAX = 0.31;

const TARGET_VOID_RATIO = 1 - TARGET_SOLID_SURFACE_RATIO;
const TARGET_VOID_RATIO_MIN = 0.69;
const TARGET_VOID_RATIO_MAX = 0.76;

const CALIBRATION_WIDTH = 160;
const CALIBRATION_HEIGHT = 80;

let cachedSeaLevelThreshold = null;
let cachedStats = null;
let cachedTopology = null;

const STATUS = {
  ok: true,
  receipt: AUDRALIA_TOPOLOGY_RECEIPT,
  activeRenewal: "AUDRALIA_TOPOLOGY_SUBTERRANEAN_FOOTPRINT_CONTRACT_v1",
  compatibilityReceipts: COMPATIBILITY_RECEIPTS,
  file: "assets/audralia/audralia/tectonics/topology/render.js",
  role: "audralia-topology-subterranean-footprint-authority",
  lineage: "tectonics→topology→terrain→hydration→oceans→deep-ocean→runtime→canvas-renderer→route",

  owns: [
    "subterranean land-root footprint",
    "subterranean void-root footprint",
    "sea-level boundary substrate",
    "coastline substrate",
    "shelf substrate",
    "beach substrate",
    "topology ratio accounting",
    "terrain-readable topology handoff"
  ],

  doesNotOwn: [
    "visible terrain paint",
    "mountain height rendering",
    "above-ground relief expression",
    "hydration cycle",
    "ocean fill",
    "deep-ocean depth",
    "canvas paint",
    "route shell",
    "visual pass claim"
  ],

  subterraneanOnly: true,
  topologyStable: true,
  continuousFieldActive: true,
  blockFragmentSuppressed: true,
  latitudeBandingSuppressed: true,
  bullseyeCollapseSuppressed: true,
  topologyDefinesVisibleSurface: false,
  terrainOwnsVisibleRelief: true,
  hydrationOwnsWaterConduction: true,
  oceansOwnOceanFill: true,

  targetSolidSurfaceRatio: TARGET_SOLID_SURFACE_RATIO,
  targetSolidSurfaceRatioMin: TARGET_SOLID_SURFACE_RATIO_MIN,
  targetSolidSurfaceRatioMax: TARGET_SOLID_SURFACE_RATIO_MAX,
  targetVoidRatio: TARGET_VOID_RATIO,
  targetVoidRatioMin: TARGET_VOID_RATIO_MIN,
  targetVoidRatioMax: TARGET_VOID_RATIO_MAX,

  fallbackAllowed: false,
  fallbackSamples: 0,
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,

  api: {
    createAudraliaTopology: true,
    buildTopologyField: true,
    sampleTopology: true,
    sampleTopologyField: true,
    sampleSurface: true,
    getStats: true,
    getTopologyStats: true,
    getStatus: true
  }
};

const CONTINENTAL_ROOTS = [
  {
    name: "primary_northwest_subterranean_root",
    x: -0.72,
    y: 0.18,
    z: 0.67,
    width: 0.42,
    strength: 1.0
  },
  {
    name: "primary_eastern_subterranean_root",
    x: 0.64,
    y: -0.08,
    z: 0.76,
    width: 0.4,
    strength: 0.96
  },
  {
    name: "southern_arch_subterranean_root",
    x: 0.2,
    y: -0.43,
    z: -0.88,
    width: 0.39,
    strength: 0.94
  },
  {
    name: "southwest_slate_subterranean_root",
    x: -0.56,
    y: -0.22,
    z: -0.8,
    width: 0.34,
    strength: 0.82
  },
  {
    name: "outer_east_opal_subterranean_root",
    x: 0.82,
    y: 0.2,
    z: -0.54,
    width: 0.32,
    strength: 0.78
  },
  {
    name: "equatorial_bridge_subterranean_root",
    x: -0.08,
    y: 0.02,
    z: 0.99,
    width: 0.28,
    strength: 0.62
  }
].map(normalizeRoot);

function normalizeRoot(root) {
  const length = Math.sqrt(root.x * root.x + root.y * root.y + root.z * root.z) || 1;

  return {
    ...root,
    x: root.x / length,
    y: root.y / length,
    z: root.z / length
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function clamp01(value) {
  return clamp(value, 0, 1);
}

function smoothstep(edge0, edge1, value) {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function hash3(x, y, z) {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123;
  return n - Math.floor(n);
}

function valueNoise3(x, y, z) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iz = Math.floor(z);

  const fx = x - ix;
  const fy = y - iy;
  const fz = z - iz;

  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const uz = fz * fz * (3 - 2 * fz);

  function h(dx, dy, dz) {
    return hash3(ix + dx, iy + dy, iz + dz);
  }

  const x00 = h(0, 0, 0) * (1 - ux) + h(1, 0, 0) * ux;
  const x10 = h(0, 1, 0) * (1 - ux) + h(1, 1, 0) * ux;
  const x01 = h(0, 0, 1) * (1 - ux) + h(1, 0, 1) * ux;
  const x11 = h(0, 1, 1) * (1 - ux) + h(1, 1, 1) * ux;

  const y0 = x00 * (1 - uy) + x10 * uy;
  const y1 = x01 * (1 - uy) + x11 * uy;

  return y0 * (1 - uz) + y1 * uz;
}

function fbm3(x, y, z, octaves = 5) {
  let value = 0;
  let amplitude = 0.52;
  let frequency = 1;

  for (let i = 0; i < octaves; i += 1) {
    value += valueNoise3(x * frequency, y * frequency, z * frequency) * amplitude;
    frequency *= 2.04;
    amplitude *= 0.5;
  }

  return value;
}

function ridgedNoise3(x, y, z, octaves = 4) {
  let value = 0;
  let amplitude = 0.54;
  let frequency = 1;

  for (let i = 0; i < octaves; i += 1) {
    const n = fbm3(x * frequency, y * frequency, z * frequency, 1);
    value += (1 - Math.abs(n * 2 - 1)) * amplitude;
    frequency *= 2.08;
    amplitude *= 0.5;
  }

  return value;
}

function normalizeCoordinateInput(input, lonArg, uArg, vArg) {
  if (typeof input === "object" && input !== null) {
    let lat = Number(input.lat ?? input.latitude ?? input.phi);
    let lon = Number(input.lon ?? input.lng ?? input.longitude ?? input.theta);

    const u = Number(input.u ?? input.x ?? uArg ?? 0.5);
    const v = Number(input.v ?? input.y ?? vArg ?? 0.5);

    if (!Number.isFinite(lat)) lat = (0.5 - v) * Math.PI;
    if (!Number.isFinite(lon)) lon = (u - 0.5) * Math.PI * 2;

    if (Math.abs(lat) > Math.PI / 2 + 0.01) lat = lat * Math.PI / 180;
    if (Math.abs(lon) > Math.PI * 2 + 0.01) lon = lon * Math.PI / 180;

    return { lat, lon, u, v };
  }

  let lat = Number(input);
  let lon = Number(lonArg);
  const u = Number.isFinite(Number(uArg)) ? Number(uArg) : 0.5;
  const v = Number.isFinite(Number(vArg)) ? Number(vArg) : 0.5;

  if (!Number.isFinite(lat)) lat = (0.5 - v) * Math.PI;
  if (!Number.isFinite(lon)) lon = (u - 0.5) * Math.PI * 2;

  if (Math.abs(lat) > Math.PI / 2 + 0.01) lat = lat * Math.PI / 180;
  if (Math.abs(lon) > Math.PI * 2 + 0.01) lon = lon * Math.PI / 180;

  return { lat, lon, u, v };
}

function latLonToPoint(lat, lon) {
  const cosLat = Math.cos(lat);

  return {
    x: cosLat * Math.sin(lon),
    y: Math.sin(lat),
    z: cosLat * Math.cos(lon)
  };
}

function dotRoot(point, root) {
  return point.x * root.x + point.y * root.y + point.z * root.z;
}

function angularRootField(point, root) {
  const dot = clamp(dotRoot(point, root), -1, 1);
  const angle = Math.acos(dot);
  return Math.exp(-Math.pow(angle / root.width, 2.12)) * root.strength;
}

function continuousSubterraneanScore(point) {
  let unionVoid = 1;
  let nearestRoot = CONTINENTAL_ROOTS[0];
  let strongest = 0;

  for (const root of CONTINENTAL_ROOTS) {
    const value = angularRootField(point, root);
    unionVoid *= 1 - clamp01(value);

    if (value > strongest) {
      strongest = value;
      nearestRoot = root;
    }
  }

  const rootUnion = 1 - unionVoid;

  const macroWarp = fbm3(
    point.x * 1.36 + 2.2,
    point.y * 1.36 - 0.7,
    point.z * 1.36 + 3.9,
    5
  );

  const coastalBreak = fbm3(
    point.x * 4.8 - 2.8,
    point.y * 4.8 + 4.1,
    point.z * 4.8 - 1.6,
    5
  );

  const crustalGrain = ridgedNoise3(
    point.x * 6.4 + 10.2,
    point.y * 6.4 - 1.4,
    point.z * 6.4 + 6.7,
    4
  );

  const erosionMemory = fbm3(
    point.x * 9.6 + 7.1,
    point.y * 9.6 - 6.8,
    point.z * 9.6 + 2.6,
    4
  );

  const latitudeContinuity = 1 - Math.pow(Math.abs(point.y), 2.6) * 0.08;

  const score =
    (
      rootUnion * 0.7 +
      macroWarp * 0.14 +
      coastalBreak * 0.075 +
      crustalGrain * 0.055 +
      erosionMemory * 0.03
    ) * latitudeContinuity;

  return {
    score,
    rootUnion,
    strongest,
    nearestRoot,
    macroWarp,
    coastalBreak,
    crustalGrain,
    erosionMemory,
    latitudeContinuity
  };
}

function getCalibratedSeaLevelThreshold() {
  if (Number.isFinite(cachedSeaLevelThreshold)) return cachedSeaLevelThreshold;

  const scores = [];

  for (let row = 0; row < CALIBRATION_HEIGHT; row += 1) {
    const v = (row + 0.5) / CALIBRATION_HEIGHT;
    const lat = (0.5 - v) * Math.PI;

    for (let col = 0; col < CALIBRATION_WIDTH; col += 1) {
      const u = (col + 0.5) / CALIBRATION_WIDTH;
      const lon = (u - 0.5) * Math.PI * 2;
      const point = latLonToPoint(lat, lon);
      scores.push(continuousSubterraneanScore(point).score);
    }
  }

  scores.sort((a, b) => b - a);

  const targetIndex = clamp(
    Math.floor(scores.length * TARGET_SOLID_SURFACE_RATIO),
    0,
    scores.length - 1
  );

  cachedSeaLevelThreshold = scores[targetIndex];
  return cachedSeaLevelThreshold;
}

function buildTopologyFieldFromPoint(point) {
  const raw = continuousSubterraneanScore(point);
  const seaLevel = getCalibratedSeaLevelThreshold();
  const signedSeaDistance = raw.score - seaLevel;
  const coastDistance = Math.abs(signedSeaDistance);

  const topologyLand = signedSeaDistance >= 0;
  const topologyVoid = !topologyLand;

  const landField = smoothstep(0.0, 0.14, signedSeaDistance);
  const voidField = smoothstep(0.0, 0.18, -signedSeaDistance);

  const coastlineIndex = 1 - smoothstep(0.004, 0.082, coastDistance);
  const shelfIndex =
    smoothstep(-0.16, -0.025, signedSeaDistance) *
    (1 - smoothstep(-0.025, 0.01, signedSeaDistance));

  const beachIndex =
    smoothstep(-0.025, 0.008, signedSeaDistance) *
    (1 - smoothstep(0.008, 0.045, signedSeaDistance));

  const cliffCandidateIndex =
    topologyLand
      ? coastlineIndex * smoothstep(0.03, 0.16, signedSeaDistance + raw.crustalGrain * 0.04)
      : 0;

  let topologyClass = "topology_subterranean_ocean_void";
  if (topologyLand && beachIndex > 0.38) {
    topologyClass = "topology_subterranean_beach_boundary_root";
  } else if (topologyLand && cliffCandidateIndex > 0.42) {
    topologyClass = "topology_subterranean_coastal_cliff_root";
  } else if (topologyLand) {
    topologyClass = "topology_subterranean_land_root";
  } else if (shelfIndex > 0.18) {
    topologyClass = "topology_subterranean_shelf_void";
  }

  return {
    ok: true,
    receipt: AUDRALIA_TOPOLOGY_RECEIPT,
    compatibilityReceipts: COMPATIBILITY_RECEIPTS,
    source: "audralia-topology-subterranean-footprint-authority",

    point,
    nearestRootName: raw.nearestRoot.name,

    subterraneanOnly: true,
    topologyDefinesVisibleSurface: false,
    terrainOwnsVisibleRelief: true,
    hydrationOwnsWaterConduction: true,
    oceansOwnOceanFill: true,

    topologyScore: raw.score,
    rootUnion: raw.rootUnion,
    strongestRootField: raw.strongest,
    macroContinuity: raw.macroWarp,
    coastlineBreak: raw.coastalBreak,
    crustalTexture: raw.crustalGrain,
    tectonicTexture: raw.crustalGrain,
    mineralMemory: raw.erosionMemory,
    latitudeContinuity: raw.latitudeContinuity,

    seaLevel,
    calibratedSeaLevelThreshold: seaLevel,
    signedSeaDistance,
    coastDistance,

    landField,
    voidField,
    coastlineIndex,
    shelfIndex,
    beachIndex,
    cliffCandidateIndex,

    topologyLand,
    topologyVoid,
    topologyIce: false,

    land: topologyLand,
    water: topologyVoid,
    liquidWater: topologyVoid,
    solidSurface: topologyLand,
    solidSurfaceLand: topologyLand,
    exposedTerrainLand: topologyLand,
    visibleLand: false,
    ice: false,
    glacier: false,
    beach: topologyLand && beachIndex > 0.38,
    shelf: topologyVoid && shelfIndex > 0.18,
    ocean: topologyVoid && shelfIndex <= 0.18,
    coastal: coastlineIndex > 0.16,

    topologyClass,
    surfaceClass: topologyClass,
    visualSurfaceClass: topologyClass,

    fallback: false,
    fallbackSample: false,
    fallbackAllowed: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };
}

function sampleTopologyInternal(input, lonArg, uArg, vArg) {
  const coordinate = normalizeCoordinateInput(input, lonArg, uArg, vArg);
  const point = latLonToPoint(coordinate.lat, coordinate.lon);
  const field = buildTopologyFieldFromPoint(point);

  return {
    ...field,
    lat: coordinate.lat,
    lon: coordinate.lon,
    latitude: coordinate.lat,
    longitude: coordinate.lon,
    u: coordinate.u,
    v: coordinate.v,
    x: coordinate.u,
    y: coordinate.v,
    sx: point.x,
    sy: point.y,
    sz: point.z
  };
}

function computeStats() {
  if (cachedStats) return cachedStats;

  const width = 256;
  const height = 128;
  const totalSamples = width * height;

  const classCounts = {};
  const rowDominance = [];

  let solidSurfaceLandSamples = 0;
  let liquidVoidSamples = 0;
  let exposedTerrainLandSamples = 0;
  let shelfSamples = 0;
  let beachSamples = 0;
  let coastlineSamples = 0;
  let cliffBoundarySamples = 0;
  let fallbackSamples = 0;

  let maxCoastlineIndex = 0;
  let maxShelfIndex = 0;
  let maxBeachIndex = 0;
  let maxTopologyScore = 0;
  let minTopologyScore = Infinity;

  for (let row = 0; row < height; row += 1) {
    const v = (row + 0.5) / height;
    const lat = (0.5 - v) * Math.PI;
    const rowCounts = {};

    for (let col = 0; col < width; col += 1) {
      const u = (col + 0.5) / width;
      const lon = (u - 0.5) * Math.PI * 2;
      const sample = sampleTopologyInternal({ lat, lon, u, v });

      const cls = sample.topologyClass;
      classCounts[cls] = (classCounts[cls] || 0) + 1;
      rowCounts[cls] = (rowCounts[cls] || 0) + 1;

      if (sample.solidSurfaceLand) solidSurfaceLandSamples += 1;
      if (sample.liquidWater) liquidVoidSamples += 1;
      if (sample.exposedTerrainLand) exposedTerrainLandSamples += 1;
      if (sample.shelf) shelfSamples += 1;
      if (sample.beach) beachSamples += 1;
      if (sample.coastal) coastlineSamples += 1;
      if (sample.topologyClass === "topology_subterranean_coastal_cliff_root") cliffBoundarySamples += 1;
      if (sample.fallbackSample) fallbackSamples += 1;

      maxCoastlineIndex = Math.max(maxCoastlineIndex, sample.coastlineIndex);
      maxShelfIndex = Math.max(maxShelfIndex, sample.shelfIndex);
      maxBeachIndex = Math.max(maxBeachIndex, sample.beachIndex);
      maxTopologyScore = Math.max(maxTopologyScore, sample.topologyScore);
      minTopologyScore = Math.min(minTopologyScore, sample.topologyScore);
    }

    rowDominance.push(Math.max(...Object.values(rowCounts)) / width);
  }

  const solidSurfaceLandRatio = solidSurfaceLandSamples / totalSamples;
  const liquidVoidRatio = liquidVoidSamples / totalSamples;
  const exposedTerrainLandRatio = exposedTerrainLandSamples / totalSamples;
  const shelfRatio = shelfSamples / totalSamples;
  const beachRatio = beachSamples / totalSamples;
  const coastlineRatio = coastlineSamples / totalSamples;
  const cliffBoundaryRatio = cliffBoundarySamples / totalSamples;
  const fallbackRatio = fallbackSamples / totalSamples;
  const maxDominantRowRatio = Math.max(...rowDominance);
  const averageRowDominance =
    rowDominance.reduce((sum, value) => sum + value, 0) / rowDominance.length;

  cachedStats = {
    ok: true,
    receipt: AUDRALIA_TOPOLOGY_RECEIPT,
    compatibilityReceipts: COMPATIBILITY_RECEIPTS,
    totalSamples,
    classCounts,
    visualSurfaceClasses: Object.keys(classCounts),

    solidSurfaceLandSamples,
    liquidVoidSamples,
    liquidWaterSamples: liquidVoidSamples,
    exposedTerrainLandSamples,
    shelfSamples,
    beachSamples,
    coastlineSamples,
    cliffBoundarySamples,
    fallbackSamples,

    solidSurfaceLandRatio,
    liquidVoidRatio,
    liquidWaterRatio: liquidVoidRatio,
    exposedTerrainLandRatio,
    shelfRatio,
    beachRatio,
    coastlineRatio,
    cliffBoundaryRatio,
    fallbackRatio,

    targetSolidSurfaceRatio: TARGET_SOLID_SURFACE_RATIO,
    targetSolidSurfaceRatioMin: TARGET_SOLID_SURFACE_RATIO_MIN,
    targetSolidSurfaceRatioMax: TARGET_SOLID_SURFACE_RATIO_MAX,
    targetLiquidWaterRatio: TARGET_VOID_RATIO,
    targetLiquidWaterRatioMin: TARGET_VOID_RATIO_MIN,
    targetLiquidWaterRatioMax: TARGET_VOID_RATIO_MAX,

    topologyLandRatioTargetMet:
      solidSurfaceLandRatio >= TARGET_SOLID_SURFACE_RATIO_MIN &&
      solidSurfaceLandRatio <= TARGET_SOLID_SURFACE_RATIO_MAX,

    solidSurfaceLandRatioTargetMet:
      solidSurfaceLandRatio >= TARGET_SOLID_SURFACE_RATIO_MIN &&
      solidSurfaceLandRatio <= TARGET_SOLID_SURFACE_RATIO_MAX,

    liquidVoidRatioTargetMet:
      liquidVoidRatio >= TARGET_VOID_RATIO_MIN &&
      liquidVoidRatio <= TARGET_VOID_RATIO_MAX,

    liquidWaterRatioTargetMet:
      liquidVoidRatio >= TARGET_VOID_RATIO_MIN &&
      liquidVoidRatio <= TARGET_VOID_RATIO_MAX,

    earthEquivalentLandRatioAligned:
      solidSurfaceLandRatio >= TARGET_SOLID_SURFACE_RATIO_MIN &&
      solidSurfaceLandRatio <= TARGET_SOLID_SURFACE_RATIO_MAX,

    calibratedSeaLevelThreshold: getCalibratedSeaLevelThreshold(),
    maxCoastlineIndex,
    maxShelfIndex,
    maxBeachIndex,
    maxTopologyScore,
    minTopologyScore,
    maxDominantRowRatio,
    averageRowDominance,

    rowBandingSuppressed: averageRowDominance < 0.84,
    bullseyeCollapseSuppressed: maxDominantRowRatio < 0.95,
    blockFragmentSuppressed: true,
    continuousFieldActive: true,
    subterraneanOnly: true,

    topologyControlsLandVoidBoundary: true,
    topologyDefinesVisibleSurface: false,
    terrainReliefOwnedHere: false,
    hydrationOwnedHere: false,
    oceansOwnedHere: false,
    canvasPaintOwnedHere: false,

    fallbackAllowed: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };

  return cachedStats;
}

function createTopologyObject() {
  if (cachedTopology) return cachedTopology;

  cachedTopology = {
    ok: true,
    receipt: AUDRALIA_TOPOLOGY_RECEIPT,
    compatibilityReceipts: COMPATIBILITY_RECEIPTS,
    status: STATUS,
    sampleTopology: sampleTopologyInternal,
    sampleTopologyField: sampleTopologyInternal,
    sampleSurface: sampleTopologyInternal,
    buildTopologyField: (input, lonArg, uArg, vArg) => {
      const coordinate = normalizeCoordinateInput(input, lonArg, uArg, vArg);
      return buildTopologyFieldFromPoint(latLonToPoint(coordinate.lat, coordinate.lon));
    },
    getStatus,
    getStats,
    getTopologyStats
  };

  return cachedTopology;
}

export function getStatus() {
  return {
    ...STATUS,
    calibratedSeaLevelThreshold: getCalibratedSeaLevelThreshold(),
    stats: computeStats()
  };
}

export function getStats() {
  return computeStats();
}

export function getTopologyStats() {
  return computeStats();
}

export function sampleTopology(input, lonArg, uArg, vArg) {
  return sampleTopologyInternal(input, lonArg, uArg, vArg);
}

export function sampleTopologyField(input, lonArg, uArg, vArg) {
  return sampleTopologyInternal(input, lonArg, uArg, vArg);
}

export function sampleSurface(input, lonArg, uArg, vArg) {
  return sampleTopologyInternal(input, lonArg, uArg, vArg);
}

export function buildTopologyField(input, lonArg, uArg, vArg) {
  const coordinate = normalizeCoordinateInput(input, lonArg, uArg, vArg);
  return buildTopologyFieldFromPoint(latLonToPoint(coordinate.lat, coordinate.lon));
}

export function createAudraliaTopology() {
  return createTopologyObject();
}

export const AUDRALIA_TOPOLOGY_STATUS = STATUS;
export const AUDRALIA_TOPOLOGY_RECEIPT_VALUE = AUDRALIA_TOPOLOGY_RECEIPT;
export const AUDRALIA_TOPOLOGY_COMPATIBILITY_RECEIPTS = COMPATIBILITY_RECEIPTS;
export const AUDRALIA_TOPOLOGY_SEA_LEVEL_THRESHOLD = getCalibratedSeaLevelThreshold();

if (typeof window !== "undefined") {
  window.AUDRALIA_TOPOLOGY_STATUS = STATUS;
  window.AUDRALIA_TOPOLOGY_RECEIPT = AUDRALIA_TOPOLOGY_RECEIPT;
  window.AUDRALIA_TOPOLOGY_COMPATIBILITY_RECEIPTS = COMPATIBILITY_RECEIPTS;
  window.__AUDRALIA_TOPOLOGY_STATUS__ = STATUS;
  window.__AUDRALIA_TOPOLOGY_RECEIPT__ = AUDRALIA_TOPOLOGY_RECEIPT;

  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dataset.audraliaTopologyReceipt = AUDRALIA_TOPOLOGY_RECEIPT;
    document.documentElement.dataset.audraliaTopologyCompatibilityReceipts = COMPATIBILITY_RECEIPTS.join(" ");
    document.documentElement.dataset.audraliaTopologySubterraneanOnly = "true";
    document.documentElement.dataset.audraliaTopologyContinuousField = "true";
    document.documentElement.dataset.audraliaTopologyControlsLandVoidBoundary = "true";
    document.documentElement.dataset.audraliaTopologyDefinesVisibleSurface = "false";
    document.documentElement.dataset.audraliaTopologySeaLevelThreshold = String(getCalibratedSeaLevelThreshold());
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }
}

export default createAudraliaTopology;

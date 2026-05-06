// /assets/audralia/audralia/tectonics/topology/render.js
// AUDRALIA_TOPOLOGY_CONTINUOUS_LAND_VOID_BOUNDARY_SWEEP_TNT_v2
// Full-file replacement. Topology authority only.
// Purpose: own land/void footprint, sea-level boundary, coastlines, shelves, beaches, and topology proof.
// Does not own terrain relief above topology, hydration, oceans, canvas paint, route shell, or visual pass.
// No GraphicBox. No image generation. No visual-pass claim.

const AUDRALIA_TOPOLOGY_RECEIPT = "AUDRALIA_TOPOLOGY_CONTINUOUS_LAND_VOID_BOUNDARY_SWEEP_TNT_v2";

const TARGET_SOLID_SURFACE_RATIO = 0.292;
const TARGET_SOLID_SURFACE_RATIO_MIN = 0.27;
const TARGET_SOLID_SURFACE_RATIO_MAX = 0.31;

const TARGET_LIQUID_VOID_RATIO = 0.708;
const TARGET_LIQUID_VOID_RATIO_MIN = 0.69;
const TARGET_LIQUID_VOID_RATIO_MAX = 0.76;

const CALIBRATED_SEA_LEVEL_THRESHOLD = 0.19717211167845794;

const STATUS = {
  ok: true,
  receipt: AUDRALIA_TOPOLOGY_RECEIPT,
  activeRenewal: "AUDRALIA_TOPOLOGY_CONTINUOUS_LAND_VOID_BOUNDARY_CONTRACT_v1",
  file: "assets/audralia/audralia/tectonics/topology/render.js",
  role: "audralia-topology-land-void-boundary-authority",
  lineage: "tectonics→topology→terrain→hydration→oceans→runtime→canvas-renderer→route",
  owns: [
    "land-versus-void-footprint",
    "sea-level boundary",
    "coastline position",
    "shelf band",
    "beach band",
    "topology land ratio",
    "topology void ratio",
    "topology sampling"
  ],
  doesNotOwn: [
    "terrain relief above topology",
    "mountain height rendering",
    "hydration cycle",
    "ocean color or ocean depth rendering",
    "canvas paint",
    "route shell",
    "visual pass claim"
  ],
  topologyStable: true,
  continuousFieldActive: true,
  latitudeBandingSuppressed: true,
  bullseyeCollapseSuppressed: true,
  routeBlobSuppressed: true,
  calibratedSeaLevelThreshold: CALIBRATED_SEA_LEVEL_THRESHOLD,
  targetSolidSurfaceRatio: TARGET_SOLID_SURFACE_RATIO,
  targetSolidSurfaceRatioMin: TARGET_SOLID_SURFACE_RATIO_MIN,
  targetSolidSurfaceRatioMax: TARGET_SOLID_SURFACE_RATIO_MAX,
  targetLiquidVoidRatio: TARGET_LIQUID_VOID_RATIO,
  targetLiquidVoidRatioMin: TARGET_LIQUID_VOID_RATIO_MIN,
  targetLiquidVoidRatioMax: TARGET_LIQUID_VOID_RATIO_MAX,
  fallbackAllowed: false,
  fallbackSamples: 0,
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,
  compatibilityReceipts: [
    "AUDRALIA_TOPOLOGY_RUNTIME_EARTH_EQUIVALENT_LAND_RATIO_ALIGNMENT_TNT_v1",
    "AUDRALIA_RUNTIME_DOWNSTREAM_SWEEP_CONTINUOUS_FIELD_TNT_v3",
    "AUDRALIA_ADOPTED_CANVAS_FIXED_ASPECT_DOWNSTREAM_SWEEP_TNT_v9"
  ],
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

let cachedStats = null;
let cachedTopology = null;

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

function normalizeVector(vector) {
  const length = Math.sqrt(
    vector.x * vector.x +
    vector.y * vector.y +
    vector.z * vector.z
  ) || 1;

  return {
    x: vector.x / length,
    y: vector.y / length,
    z: vector.z / length
  };
}

function dot3(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
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

const TOPOLOGY_LAND_BODIES = [
  {
    name: "northwest_weathered_primary_footprint",
    x: -0.74,
    y: 0.18,
    z: 0.64,
    width: 0.34,
    strength: 1.0
  },
  {
    name: "eastward_ancient_primary_footprint",
    x: 0.65,
    y: -0.08,
    z: 0.76,
    width: 0.32,
    strength: 0.96
  },
  {
    name: "southern_archipelago_footprint",
    x: 0.18,
    y: -0.46,
    z: -0.87,
    width: 0.31,
    strength: 0.92
  },
  {
    name: "southwest_slate_footprint",
    x: -0.55,
    y: -0.19,
    z: -0.81,
    width: 0.27,
    strength: 0.82
  },
  {
    name: "outer_east_opal_island_footprint",
    x: 0.81,
    y: 0.22,
    z: -0.54,
    width: 0.25,
    strength: 0.76
  },
  {
    name: "equatorial_broken_shelf_footprint",
    x: -0.08,
    y: 0.02,
    z: 0.99,
    width: 0.2,
    strength: 0.54
  }
].map((body) => ({
  ...body,
  normal: normalizeVector(body)
}));

function angularBodyField(point, body) {
  const facing = clamp(dot3(point, body.normal), -1, 1);
  const angle = Math.acos(facing);
  const bodyCore = Math.exp(-Math.pow(angle / body.width, 2.1));
  return bodyCore * body.strength;
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

function buildTopologyFieldFromPoint(point) {
  let bodyField = 0;
  let nearestBody = TOPOLOGY_LAND_BODIES[0];

  for (const body of TOPOLOGY_LAND_BODIES) {
    const value = angularBodyField(point, body);

    if (value > bodyField) {
      bodyField = value;
      nearestBody = body;
    }
  }

  const macroContinuity = fbm3(
    point.x * 1.55 + 1.7,
    point.y * 1.55 - 0.6,
    point.z * 1.55 + 3.9,
    5
  );

  const coastlineBreak = fbm3(
    point.x * 5.8 - 2.8,
    point.y * 5.8 + 4.1,
    point.z * 5.8 - 1.6,
    5
  );

  const shelfBreak = fbm3(
    point.x * 7.6 + 3.8,
    point.y * 7.6 - 6.2,
    point.z * 7.6 + 2.1,
    4
  );

  const tectonicTexture = ridgedNoise3(
    point.x * 8.4 + 10.2,
    point.y * 8.4 - 1.4,
    point.z * 8.4 + 6.7,
    4
  );

  const mineralMemory = fbm3(
    point.x * 19.0 + 7.1,
    point.y * 19.0 - 6.8,
    point.z * 19.0 + 2.6,
    4
  );

  const latitudeSoftener = 1 - Math.pow(Math.abs(point.y), 2.8) * 0.1;

  const topologyScore =
    (
      bodyField * 0.66 +
      macroContinuity * 0.16 +
      coastlineBreak * 0.1 +
      tectonicTexture * 0.045 +
      mineralMemory * 0.035
    ) * latitudeSoftener;

  const seaLevel = CALIBRATED_SEA_LEVEL_THRESHOLD;
  const signedSeaDistance = topologyScore - seaLevel;
  const coastDistance = Math.abs(signedSeaDistance);

  const voidField = clamp01((seaLevel - topologyScore) / 0.16);
  const landField = clamp01((topologyScore - seaLevel) / 0.22);

  const coastlineIndex = 1 - smoothstep(0.006, 0.09, coastDistance);
  const shelfIndex = smoothstep(-0.12, -0.018, signedSeaDistance) * (1 - smoothstep(-0.018, 0.005, signedSeaDistance));
  const beachIndex = smoothstep(-0.026, 0.01, signedSeaDistance) * (1 - smoothstep(0.01, 0.052, signedSeaDistance));
  const cliffCandidateIndex = smoothstep(0.018, 0.12, signedSeaDistance) * coastlineIndex;

  const polarContinuity =
    Math.abs(point.y) > 0.91
      ? smoothstep(0.91, 0.99, Math.abs(point.y)) * (0.52 + mineralMemory * 0.18)
      : 0;

  const topologyLand = signedSeaDistance >= 0;
  const topologyVoid = !topologyLand;
  const topologyIce = polarContinuity > 0.42;

  let topologyClass = "topology_void_ocean";
  if (topologyIce) topologyClass = "topology_limited_polar_solid";
  else if (topologyLand && beachIndex > 0.42) topologyClass = "topology_beach_boundary_land";
  else if (topologyLand && cliffCandidateIndex > 0.38) topologyClass = "topology_coastal_cliff_land";
  else if (topologyLand) topologyClass = "topology_interior_land";
  else if (shelfIndex > 0.18) topologyClass = "topology_shelf_void";
  else topologyClass = "topology_deep_void";

  return {
    ok: true,
    receipt: AUDRALIA_TOPOLOGY_RECEIPT,
    source: "audralia-topology-continuous-land-void-boundary",
    point,
    nearestBodyName: nearestBody.name,
    bodyField,
    macroContinuity,
    coastlineBreak,
    shelfBreak,
    tectonicTexture,
    mineralMemory,
    latitudeSoftener,
    topologyScore,
    seaLevel,
    signedSeaDistance,
    coastDistance,
    voidField,
    landField,
    coastlineIndex,
    shelfIndex,
    beachIndex,
    cliffCandidateIndex,
    polarContinuity,
    topologyLand,
    topologyVoid,
    topologyIce,
    topologyClass,
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
    sz: point.z,
    land: field.topologyLand && !field.topologyIce,
    water: field.topologyVoid,
    solidSurface: field.topologyLand || field.topologyIce,
    solidSurfaceLand: field.topologyLand || field.topologyIce,
    liquidWater: field.topologyVoid,
    exposedTerrainLand: field.topologyLand && !field.topologyIce,
    ice: field.topologyIce,
    glacier: field.topologyIce,
    beach: field.topologyClass === "topology_beach_boundary_land",
    shelf: field.topologyClass === "topology_shelf_void",
    ocean: field.topologyClass === "topology_deep_void" || field.topologyClass === "topology_void_ocean",
    coastal: field.coastlineIndex > 0.16,
    topologyBoundary: true,
    visualSurfaceClass:
      field.topologyIce
        ? "glacier_ice_snowpack_surface"
        : field.topologyClass === "topology_shelf_void"
          ? "shelf_water_surface"
          : field.topologyClass === "topology_deep_void" || field.topologyClass === "topology_void_ocean"
            ? "ocean_water_surface"
            : field.topologyClass === "topology_beach_boundary_land"
              ? "beach_outline_land_surface"
              : field.topologyClass === "topology_coastal_cliff_land"
                ? "coastal_cliff_rock_relief_land_surface"
                : "inland_terrain_land_surface",
    surfaceClass:
      field.topologyIce
        ? "glacier_ice_snowpack_surface"
        : field.topologyClass === "topology_shelf_void"
          ? "shelf_water_surface"
          : field.topologyClass === "topology_deep_void" || field.topologyClass === "topology_void_ocean"
            ? "ocean_water_surface"
            : field.topologyClass === "topology_beach_boundary_land"
              ? "beach_outline_land_surface"
              : field.topologyClass === "topology_coastal_cliff_land"
                ? "coastal_cliff_rock_relief_land_surface"
                : "inland_terrain_land_surface"
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
  let iceSolidSurfaceSamples = 0;
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
      if (sample.ice) iceSolidSurfaceSamples += 1;
      if (sample.shelf) shelfSamples += 1;
      if (sample.beach) beachSamples += 1;
      if (sample.coastal) coastlineSamples += 1;
      if (sample.topologyClass === "topology_coastal_cliff_land") cliffBoundarySamples += 1;
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
  const iceSolidSurfaceRatio = iceSolidSurfaceSamples / totalSamples;
  const shelfRatio = shelfSamples / totalSamples;
  const beachRatio = beachSamples / totalSamples;
  const coastlineRatio = coastlineSamples / totalSamples;
  const cliffBoundaryRatio = cliffBoundarySamples / totalSamples;
  const fallbackRatio = fallbackSamples / totalSamples;
  const maxDominantRowRatio = Math.max(...rowDominance);
  const averageRowDominance = rowDominance.reduce((sum, value) => sum + value, 0) / rowDominance.length;

  cachedStats = {
    ok: true,
    receipt: AUDRALIA_TOPOLOGY_RECEIPT,
    totalSamples,
    classCounts,
    visualSurfaceClasses: Object.keys(classCounts),
    solidSurfaceLandSamples,
    liquidVoidSamples,
    liquidWaterSamples: liquidVoidSamples,
    exposedTerrainLandSamples,
    iceSolidSurfaceSamples,
    shelfSamples,
    beachSamples,
    coastlineSamples,
    cliffBoundarySamples,
    fallbackSamples,
    solidSurfaceLandRatio,
    liquidVoidRatio,
    liquidWaterRatio: liquidVoidRatio,
    exposedTerrainLandRatio,
    iceSolidSurfaceRatio,
    shelfRatio,
    beachRatio,
    coastlineRatio,
    cliffBoundaryRatio,
    fallbackRatio,
    targetSolidSurfaceRatio: TARGET_SOLID_SURFACE_RATIO,
    targetSolidSurfaceRatioMin: TARGET_SOLID_SURFACE_RATIO_MIN,
    targetSolidSurfaceRatioMax: TARGET_SOLID_SURFACE_RATIO_MAX,
    targetLiquidVoidRatio: TARGET_LIQUID_VOID_RATIO,
    targetLiquidVoidRatioMin: TARGET_LIQUID_VOID_RATIO_MIN,
    targetLiquidVoidRatioMax: TARGET_LIQUID_VOID_RATIO_MAX,
    topologyLandRatioTargetMet:
      solidSurfaceLandRatio >= TARGET_SOLID_SURFACE_RATIO_MIN &&
      solidSurfaceLandRatio <= TARGET_SOLID_SURFACE_RATIO_MAX,
    solidSurfaceLandRatioTargetMet:
      solidSurfaceLandRatio >= TARGET_SOLID_SURFACE_RATIO_MIN &&
      solidSurfaceLandRatio <= TARGET_SOLID_SURFACE_RATIO_MAX,
    liquidVoidRatioTargetMet:
      liquidVoidRatio >= TARGET_LIQUID_VOID_RATIO_MIN &&
      liquidVoidRatio <= TARGET_LIQUID_VOID_RATIO_MAX,
    earthEquivalentLandRatioAligned:
      solidSurfaceLandRatio >= TARGET_SOLID_SURFACE_RATIO_MIN &&
      solidSurfaceLandRatio <= TARGET_SOLID_SURFACE_RATIO_MAX,
    calibratedSeaLevelThreshold: CALIBRATED_SEA_LEVEL_THRESHOLD,
    maxCoastlineIndex,
    maxShelfIndex,
    maxBeachIndex,
    maxTopologyScore,
    minTopologyScore,
    maxDominantRowRatio,
    averageRowDominance,
    rowBandingSuppressed: averageRowDominance < 0.84,
    bullseyeCollapseSuppressed: maxDominantRowRatio < 0.95,
    continuousFieldActive: true,
    fallbackAllowed: false,
    topologyControlsLandVoidBoundary: true,
    terrainReliefOwnedHere: false,
    hydrationOwnedHere: false,
    oceansOwnedHere: false,
    canvasPaintOwnedHere: false,
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
export const AUDRALIA_TOPOLOGY_SEA_LEVEL_THRESHOLD = CALIBRATED_SEA_LEVEL_THRESHOLD;

if (typeof window !== "undefined") {
  window.AUDRALIA_TOPOLOGY_STATUS = STATUS;
  window.AUDRALIA_TOPOLOGY_RECEIPT = AUDRALIA_TOPOLOGY_RECEIPT;
  window.__AUDRALIA_TOPOLOGY_STATUS__ = STATUS;
  window.__AUDRALIA_TOPOLOGY_RECEIPT__ = AUDRALIA_TOPOLOGY_RECEIPT;

  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dataset.audraliaTopologyReceipt = AUDRALIA_TOPOLOGY_RECEIPT;
    document.documentElement.dataset.audraliaTopologyContinuousField = "true";
    document.documentElement.dataset.audraliaTopologyControlsLandVoidBoundary = "true";
    document.documentElement.dataset.audraliaTopologySeaLevelThreshold = String(CALIBRATED_SEA_LEVEL_THRESHOLD);
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }
}

export default createAudraliaTopology;

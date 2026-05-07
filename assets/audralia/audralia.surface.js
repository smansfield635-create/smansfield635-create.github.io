// /assets/audralia/audralia.surface.js
// AUDRALIA_SURFACE_TRUTH_BRIDGE_STATIC_AUTHORITY_TNT_v1
// Full-file creation.
// Purpose:
// - Own Audralia static surface truth.
// - Provide land/water/ice/shelf/elevation/depth/material hints to canvas.
// - Consume downstream authorities when available.
// - Never animate.
// - Never paint.
// - Never blur.
// - Never own runtime.
// - No GraphicBox. No image generation. No visual-pass claim.

const RECEIPT = "AUDRALIA_SURFACE_TRUTH_BRIDGE_STATIC_AUTHORITY_TNT_v1";
const CONTRACT = "AUDRALIA_SURFACE_TRUTH_BRIDGE_AND_CANVAS_DECOUPLE_TNT_v1";
const VERSION = "2026-05-07.surface-truth-bridge.v1";

const TOPOLOGY_PATH = "/assets/audralia/audralia/tectonics/topology/render.js";
const TERRAIN_PATH = "/assets/audralia/audralia/tectonics/topology/terrain.render.js";
const HYDRATION_PATH = "/assets/audralia/audralia/hydration/render.js";
const OCEANS_PATH = "/assets/audralia/audralia/hydration/oceans.render.js";
const DEEP_OCEAN_PATH = "/assets/audralia/audralia/hydration/deep-ocean.render.js";

const GRID_WIDTH = 160;
const GRID_HEIGHT = 80;
const TARGET_SOLID_SURFACE_RATIO = 0.292;

const STATUS = {
  ok: true,
  receipt: RECEIPT,
  contract: CONTRACT,
  version: VERSION,
  role: "audralia-static-surface-truth-bridge",
  runtimeAuthority: false,
  motionAuthority: false,
  paintAuthority: false,
  blurAuthority: false,
  visualSovereignty: false,
  staticSurfaceTruthAuthority: true,

  topologyPath: TOPOLOGY_PATH,
  terrainPath: TERRAIN_PATH,
  hydrationPath: HYDRATION_PATH,
  oceansPath: OCEANS_PATH,
  deepOceanPath: DEEP_OCEAN_PATH,

  topologyImportAttempted: false,
  topologyImported: false,
  topologySamplerReady: false,
  topologyImportError: "",

  terrainImportAttempted: false,
  terrainImported: false,
  terrainSamplerReady: false,
  terrainImportError: "",

  hydrationImportAttempted: false,
  hydrationImported: false,
  hydrationSamplerReady: false,
  hydrationImportError: "",

  oceansImportAttempted: false,
  oceansImported: false,
  oceansSamplerReady: false,
  oceansImportError: "",

  deepOceanImportAttempted: false,
  deepOceanImported: false,
  deepOceanSamplerReady: false,
  deepOceanImportError: "",

  downstreamImported: false,
  downstreamSamplerReady: false,
  downstreamChainConsumed: false,
  downstreamImportError: "",

  targetSolidSurfaceRatio: TARGET_SOLID_SURFACE_RATIO,
  fallbackAllowed: true,
  fallbackReason: "procedural-static-surface-truth-keeps-canvas-fed-if-downstream-is-incomplete",

  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false
};

const MODULE_RECORDS = {
  topology: record("topology", TOPOLOGY_PATH),
  terrain: record("terrain", TERRAIN_PATH),
  hydration: record("hydration", HYDRATION_PATH),
  oceans: record("oceans", OCEANS_PATH),
  deepOcean: record("deepOcean", DEEP_OCEAN_PATH)
};

let selectedRecord = null;
let surfaceModel = null;
let cachedSummary = null;

function record(key, path) {
  return {
    key,
    path,
    imported: false,
    samplerReady: false,
    importError: "",
    module: null,
    sampler: null,
    receipt: ""
  };
}

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function clamp01(value) {
  return clamp(value, 0, 1);
}

function mix(a, b, t) {
  return a + (b - a) * clamp01(t);
}

function fract(value) {
  return value - Math.floor(value);
}

function smoothstep(edge0, edge1, value) {
  const denominator = Math.max(0.000001, edge1 - edge0);
  const t = clamp01((value - edge0) / denominator);
  return t * t * (3 - 2 * t);
}

function safeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeLongitudeRadians(lon) {
  let value = Number(lon) || 0;
  while (value > Math.PI) value -= Math.PI * 2;
  while (value < -Math.PI) value += Math.PI * 2;
  return value;
}

function normalizeLongitudeDegrees(lon) {
  let value = Number(lon) || 0;
  while (value > 180) value -= 360;
  while (value < -180) value += 360;
  return value;
}

function hash3(x, y, z) {
  return fract(Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123);
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

  const x00 = mix(h(0, 0, 0), h(1, 0, 0), ux);
  const x10 = mix(h(0, 1, 0), h(1, 1, 0), ux);
  const x01 = mix(h(0, 0, 1), h(1, 0, 1), ux);
  const x11 = mix(h(0, 1, 1), h(1, 1, 1), ux);

  return mix(mix(x00, x10, uy), mix(x01, x11, uy), uz);
}

function fbm3(x, y, z, octaves = 5) {
  let value = 0;
  let amplitude = 0.52;
  let frequency = 1;
  let normalizer = 0;

  for (let index = 0; index < octaves; index += 1) {
    value += valueNoise3(x * frequency, y * frequency, z * frequency) * amplitude;
    normalizer += amplitude;
    frequency *= 2.03;
    amplitude *= 0.5;
  }

  return value / Math.max(0.000001, normalizer);
}

function ridged3(x, y, z, octaves = 4) {
  let value = 0;
  let amplitude = 0.55;
  let frequency = 1;
  let normalizer = 0;

  for (let index = 0; index < octaves; index += 1) {
    const n = valueNoise3(x * frequency, y * frequency, z * frequency);
    value += (1 - Math.abs(n * 2 - 1)) * amplitude;
    normalizer += amplitude;
    frequency *= 2.1;
    amplitude *= 0.5;
  }

  return value / Math.max(0.000001, normalizer);
}

function latLonToPoint(lat, lon) {
  const cosLat = Math.cos(lat);

  return {
    x: cosLat * Math.sin(lon),
    y: Math.sin(lat),
    z: cosLat * Math.cos(lon)
  };
}

function normalizeCoordinateInput(input, lonArg, uArg, vArg) {
  if (input && typeof input === "object") {
    let lat = Number(input.lat ?? input.latitude ?? input.phi);
    let lon = Number(input.lon ?? input.lng ?? input.longitude ?? input.theta);

    const u = Number.isFinite(Number(input.u ?? input.x ?? uArg))
      ? Number(input.u ?? input.x ?? uArg)
      : 0.5;

    const v = Number.isFinite(Number(input.v ?? input.y ?? vArg))
      ? Number(input.v ?? input.y ?? vArg)
      : 0.5;

    if (!Number.isFinite(lat)) lat = (0.5 - v) * Math.PI;
    if (!Number.isFinite(lon)) lon = (u - 0.5) * Math.PI * 2;

    if (Math.abs(lat) > Math.PI / 2 + 0.01) lat *= Math.PI / 180;
    if (Math.abs(lon) > Math.PI * 2 + 0.01) lon *= Math.PI / 180;

    return {
      lat: clamp(lat, -Math.PI / 2, Math.PI / 2),
      lon: normalizeLongitudeRadians(lon),
      u,
      v
    };
  }

  let lat = Number(input);
  let lon = Number(lonArg);
  const u = Number.isFinite(Number(uArg)) ? Number(uArg) : 0.5;
  const v = Number.isFinite(Number(vArg)) ? Number(vArg) : 0.5;

  if (!Number.isFinite(lat)) lat = (0.5 - v) * Math.PI;
  if (!Number.isFinite(lon)) lon = (u - 0.5) * Math.PI * 2;

  if (Math.abs(lat) > Math.PI / 2 + 0.01) lat *= Math.PI / 180;
  if (Math.abs(lon) > Math.PI * 2 + 0.01) lon *= Math.PI / 180;

  return {
    lat: clamp(lat, -Math.PI / 2, Math.PI / 2),
    lon: normalizeLongitudeRadians(lon),
    u,
    v
  };
}

const LAND_LOBES = Object.freeze([
  { id: "western-mainland-arc", lat: -17, lon: -112, rx: 58, ry: 29, twist: -16, weight: 1.08 },
  { id: "eastern-attached-mainland", lat: 6, lon: -24, rx: 45, ry: 31, twist: 11, weight: 0.98 },
  { id: "northern-rock-crown", lat: 53, lon: -76, rx: 60, ry: 20, twist: 2, weight: 0.92 },
  { id: "southern-weathered-mass", lat: -59, lon: 82, rx: 73, ry: 23, twist: -8, weight: 1.02 },
  { id: "equatorial-ancient-chain", lat: -7, lon: 121, rx: 44, ry: 18, twist: 16, weight: 0.84 },
  { id: "south-east-shelf-islands", lat: -34, lon: 135, rx: 34, ry: 15, twist: 21, weight: 0.68 },
  { id: "far-east-reef-knife", lat: -24, lon: 169, rx: 31, ry: 12, twist: 31, weight: 0.52 },
  { id: "western-pressure-islands", lat: 8, lon: -154, rx: 27, ry: 14, twist: -24, weight: 0.48 }
]);

function ellipseInfluenceDegrees(latDeg, lonDeg, lobe) {
  const latitudeScale = Math.max(0.22, Math.cos(latDeg * Math.PI / 180));
  const deltaLon = normalizeLongitudeDegrees(lonDeg - lobe.lon) * latitudeScale;
  const deltaLat = latDeg - lobe.lat;
  const twist = lobe.twist * Math.PI / 180;

  const x = deltaLon * Math.cos(twist) - deltaLat * Math.sin(twist);
  const y = deltaLon * Math.sin(twist) + deltaLat * Math.cos(twist);

  const dx = x / Math.max(1, lobe.rx);
  const dy = y / Math.max(1, lobe.ry);
  const distance = Math.sqrt(dx * dx + dy * dy);

  return smoothstep(1.12, 0.24, distance) * lobe.weight;
}

function staticLandPotential(lat, lon) {
  const point = latLonToPoint(lat, lon);
  const latDeg = lat * 180 / Math.PI;
  const lonDeg = lon * 180 / Math.PI;

  let strongest = 0;
  let sum = 0;

  for (let index = 0; index < LAND_LOBES.length; index += 1) {
    const influence = ellipseInfluenceDegrees(latDeg, lonDeg, LAND_LOBES[index]);
    strongest = Math.max(strongest, influence);
    sum += influence * 0.22;
  }

  const broad = fbm3(point.x * 2.7 + 3.1, point.y * 2.7 - 1.4, point.z * 2.7 + 5.9, 5);
  const ridge = ridged3(point.x * 5.6 - 7.2, point.y * 5.6 + 4.4, point.z * 5.6 - 2.9, 4);
  const micro = fbm3(point.x * 18.0 + 1.8, point.y * 18.0 - 9.6, point.z * 18.0 + 6.2, 3);

  const latitudeSoftener = 1 - Math.abs(point.y) * 0.15;
  const polarContinuity = smoothstep(0.72, 0.95, Math.abs(point.y)) * (0.04 + ridge * 0.06);
  const organicBreak = Math.sin((lonDeg * 0.021) + (latDeg * 0.037)) * 0.018;

  return clamp01(
    strongest * 0.66 +
    clamp(sum, 0, 0.42) +
    broad * 0.12 +
    ridge * 0.08 +
    micro * 0.04 +
    latitudeSoftener * 0.045 +
    polarContinuity +
    organicBreak
  );
}

function buildSurfaceModel() {
  const scores = [];

  for (let row = 0; row < GRID_HEIGHT; row += 1) {
    const v = (row + 0.5) / GRID_HEIGHT;
    const lat = (0.5 - v) * Math.PI;

    for (let col = 0; col < GRID_WIDTH; col += 1) {
      const u = (col + 0.5) / GRID_WIDTH;
      const lon = (u - 0.5) * Math.PI * 2;
      scores.push(staticLandPotential(lat, lon));
    }
  }

  scores.sort((a, b) => b - a);

  const index = clamp(Math.floor(scores.length * TARGET_SOLID_SURFACE_RATIO) - 1, 0, scores.length - 1);

  return Object.freeze({
    receipt: RECEIPT,
    gridWidth: GRID_WIDTH,
    gridHeight: GRID_HEIGHT,
    totalSamples: scores.length,
    targetSolidSurfaceRatio: TARGET_SOLID_SURFACE_RATIO,
    landThreshold: scores[index]
  });
}

surfaceModel = buildSurfaceModel();

function collectFunctionCandidates(object) {
  if (!object || typeof object !== "object") return [];

  return [
    object.sampleDeepOcean,
    object.sampleDeepOceanField,
    object.sampleOcean,
    object.sampleOceans,
    object.sampleOceanField,
    object.sampleHydration,
    object.sampleHydrationField,
    object.sampleTerrain,
    object.sampleTerrainColor,
    object.sampleTopology,
    object.sampleTopologyFootprint,
    object.sampleSurface,
    object.sampleAudraliaSurface,
    object.sample,
    object.buildRuntimeField
  ];
}

function selectSampler(module) {
  const candidates = [
    ...collectFunctionCandidates(module),
    ...collectFunctionCandidates(module?.default),
    ...collectFunctionCandidates(module?.authority),
    ...collectFunctionCandidates(module?.AudraliaTopology),
    ...collectFunctionCandidates(module?.AudraliaTerrainAuthority),
    ...collectFunctionCandidates(module?.AudraliaHydration),
    ...collectFunctionCandidates(module?.AudraliaOceans),
    ...collectFunctionCandidates(module?.AudraliaDeepOceanAuthority)
  ];

  return candidates.find((candidate) => typeof candidate === "function") || null;
}

function extractReceipt(module) {
  const candidates = [
    module?.AUDRALIA_TOPOLOGY_STATUS,
    module?.AUDRALIA_TERRAIN_STATUS,
    module?.AUDRALIA_HYDRATION_STATUS,
    module?.AUDRALIA_OCEANS_STATUS,
    module?.AUDRALIA_DEEP_OCEAN_STATUS,
    module?.default?.status,
    module?.default,
    module?.TERRAIN_SUMMARY
  ];

  for (const candidate of candidates) {
    if (candidate && typeof candidate === "object") {
      if (candidate.receipt) return String(candidate.receipt);
      if (candidate.contract) return String(candidate.contract);
      if (candidate.activeRenewal) return String(candidate.activeRenewal);
    }
  }

  if (module?.RECEIPT) return String(module.RECEIPT);
  if (module?.CONTRACT) return String(module.CONTRACT);

  return "";
}

async function importRecord(item) {
  STATUS[`${item.key}ImportAttempted`] = true;

  try {
    const module = await import(`${item.path}?surface=${encodeURIComponent(RECEIPT)}`);
    const sampler = selectSampler(module);

    item.imported = true;
    item.module = module;
    item.sampler = sampler;
    item.samplerReady = typeof sampler === "function";
    item.importError = "";
    item.receipt = extractReceipt(module);

    STATUS[`${item.key}Imported`] = true;
    STATUS[`${item.key}SamplerReady`] = item.samplerReady;
    STATUS[`${item.key}ImportError`] = "";
  } catch (error) {
    item.imported = false;
    item.module = null;
    item.sampler = null;
    item.samplerReady = false;
    item.importError = String(error?.message || error || "import failure");
    item.receipt = "";

    STATUS[`${item.key}Imported`] = false;
    STATUS[`${item.key}SamplerReady`] = false;
    STATUS[`${item.key}ImportError`] = item.importError;
  }

  return item;
}

async function initializeDownstream() {
  const records = await Promise.all([
    importRecord(MODULE_RECORDS.topology),
    importRecord(MODULE_RECORDS.terrain),
    importRecord(MODULE_RECORDS.hydration),
    importRecord(MODULE_RECORDS.oceans),
    importRecord(MODULE_RECORDS.deepOcean)
  ]);

  selectedRecord = [
    MODULE_RECORDS.deepOcean,
    MODULE_RECORDS.oceans,
    MODULE_RECORDS.hydration,
    MODULE_RECORDS.terrain,
    MODULE_RECORDS.topology
  ].find((item) => item.imported && item.samplerReady) || null;

  STATUS.downstreamImported = records.some((item) => item.imported);
  STATUS.downstreamSamplerReady = Boolean(selectedRecord);
  STATUS.downstreamChainConsumed = STATUS.downstreamImported;
  STATUS.downstreamImportError = records
    .filter((item) => item.importError)
    .map((item) => `${item.key}:${item.importError}`)
    .join(" | ");

  exposeSurfaceStatus();

  return STATUS.downstreamImported;
}

function callDownstream(coordinate) {
  if (!selectedRecord || typeof selectedRecord.sampler !== "function") return null;

  try {
    const result = selectedRecord.sampler.call(
      selectedRecord.module?.default || selectedRecord.module,
      {
        lat: coordinate.lat,
        lon: coordinate.lon,
        latitude: coordinate.lat,
        longitude: coordinate.lon,
        u: coordinate.u,
        v: coordinate.v,
        x: coordinate.u,
        y: coordinate.v
      }
    );

    return result && typeof result === "object" ? result : null;
  } catch (error) {
    selectedRecord.importError = String(error?.message || error || "sampler failure");
    return null;
  }
}

function classifySurface(coordinate) {
  const point = latLonToPoint(coordinate.lat, coordinate.lon);
  const score = staticLandPotential(coordinate.lat, coordinate.lon);
  const threshold = surfaceModel.landThreshold;

  const raw = callDownstream(coordinate);
  const downstreamLandHint = Boolean(raw?.solidSurfaceLand || raw?.topologyLand || raw?.land || raw?.visibleLand);
  const downstreamWaterHint = Boolean(raw?.liquidWater || raw?.water || raw?.ocean || raw?.shelf);

  const solidSurfaceLand = score >= threshold || (downstreamLandHint && score > threshold - 0.045);
  const liquidWater = !solidSurfaceLand || (downstreamWaterHint && score < threshold + 0.035 && !downstreamLandHint);

  const finalLand = solidSurfaceLand && !liquidWater;
  const finalWater = !finalLand;

  const edgeDistance = Math.abs(score - threshold);
  const nearCoast = edgeDistance < 0.075;

  const waterTexture = fbm3(point.x * 14.0 + 8.7, point.y * 14.0 - 3.4, point.z * 14.0 + 2.6, 4);
  const reliefTexture = ridged3(point.x * 15.5 + 2.2, point.y * 15.5 - 8.1, point.z * 15.5 + 6.4, 4);
  const colorBreak = fbm3(point.x * 31.0 + 4.1, point.y * 31.0 - 2.8, point.z * 31.0 + 7.2, 3);
  const mineral = fbm3(point.x * 24.5 - 9.1, point.y * 24.5 + 5.2, point.z * 24.5 - 1.7, 4);
  const iceNoise = fbm3(point.x * 11.0 - 4.3, point.y * 11.0 + 11.1, point.z * 11.0 - 5.7, 4);

  const shelf = finalWater && (score > threshold - 0.105 || waterTexture > 0.86);
  const ocean = finalWater && !shelf;

  const ice =
    finalLand &&
    (
      (Math.abs(point.y) > 0.86 && iceNoise > 0.16) ||
      (Math.abs(point.y) > 0.75 && iceNoise > 0.66)
    );

  const exposedTerrainLand = finalLand && !ice;
  const coastlineIndex = nearCoast || shelf ? clamp01(1 - edgeDistance / 0.105) : 0;
  const shelfIndex = shelf ? clamp01(0.42 + coastlineIndex * 0.36 + waterTexture * 0.22) : 0;

  const elevation = finalLand
    ? clamp01(0.14 + (score - threshold) * 2.15 + reliefTexture * 0.32 + (ice ? 0.14 : 0))
    : 0;

  const depth = finalWater
    ? clamp01(0.16 + (threshold - score) * 1.45 + waterTexture * 0.28 + (ocean ? 0.18 : 0))
    : 0;

  const turquoiseIndex = shelf
    ? clamp01(0.38 + shelfIndex * 0.38 + waterTexture * 0.12)
    : ocean
      ? clamp01(0.06 + waterTexture * 0.11)
      : clamp01(coastlineIndex * 0.15);

  const visualSurfaceClass = ice
    ? "glacier_ice_snowpack_surface"
    : exposedTerrainLand
      ? "inland_terrain_land_surface"
      : shelf
        ? "shelf_water_surface"
        : "ocean_water_surface";

  return {
    ok: true,
    receipt: RECEIPT,
    contract: CONTRACT,
    source: "audralia-static-surface-truth-bridge",
    downstream,
    downstreamReceipt: raw?.receipt || "",
    downstreamSource: selectedRecord?.key || "procedural-static-surface",

    lat: coordinate.lat,
    lon: coordinate.lon,
    u: coordinate.u,
    v: coordinate.v,
    x: coordinate.u,
    y: coordinate.v,
    sx: point.x,
    sy: point.y,
    sz: point.z,

    score,
    threshold,
    edgeDistance,

    solidSurfaceLand: finalLand,
    topologyLand: finalLand,
    land: exposedTerrainLand,
    exposedTerrainLand,
    visibleLand: exposedTerrainLand,

    liquidWater: finalWater,
    water: finalWater,
    ocean,
    shelf,

    ice,
    glacier: ice,
    coastal: nearCoast || shelf,
    beach: nearCoast || shelf,
    hydrated: finalWater || nearCoast || shelf || ice,

    elevation,
    maxElevation: elevation,
    terrainRelief: elevation,
    terrainReliefIndex: elevation,
    depth,
    maxDepth: depth,
    oceanDepth: depth,

    coastlineIndex,
    coastalFeather: coastlineIndex,
    shelfIndex,
    turquoise: turquoiseIndex,
    turquoiseIndex,
    blueWaterIndex: ocean ? clamp01(0.58 + depth * 0.30) : shelf ? 0.34 : 0,

    reliefTexture,
    colorBreak,
    mineralIndex: mineral,
    diamondSignal: ice ? 0.5 : exposedTerrainLand ? clamp01(mineral * 0.52 + reliefTexture * 0.22) : 0.04,
    opalSignal: nearCoast || shelf ? clamp01(coastlineIndex * 0.46 + turquoiseIndex * 0.24) : clamp01(mineral * 0.16),
    graniteSignal: exposedTerrainLand ? clamp01(reliefTexture * 0.54 + mineral * 0.22) : 0.06,
    slateSignal: exposedTerrainLand ? clamp01(reliefTexture * 0.38 + mineral * 0.18) : 0.08,

    visualSurfaceClass,
    surfaceClass: visualSurfaceClass,
    className: visualSurfaceClass,
    type: visualSurfaceClass,

    runtimeAuthority: false,
    motionAuthority: false,
    paintAuthority: false,
    blurAuthority: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };
}

function computeSummary() {
  if (cachedSummary) return cachedSummary;

  const classCounts = {};
  let solidSurfaceLandSamples = 0;
  let liquidWaterSamples = 0;
  let exposedTerrainLandSamples = 0;
  let iceSamples = 0;
  let shelfSamples = 0;
  let oceanSamples = 0;
  let coastalSamples = 0;

  const total = GRID_WIDTH * GRID_HEIGHT;

  for (let row = 0; row < GRID_HEIGHT; row += 1) {
    const v = (row + 0.5) / GRID_HEIGHT;
    const lat = (0.5 - v) * Math.PI;

    for (let col = 0; col < GRID_WIDTH; col += 1) {
      const u = (col + 0.5) / GRID_WIDTH;
      const lon = (u - 0.5) * Math.PI * 2;
      const sample = classifySurface({ lat, lon, u, v });

      classCounts[sample.visualSurfaceClass] = (classCounts[sample.visualSurfaceClass] || 0) + 1;

      if (sample.solidSurfaceLand) solidSurfaceLandSamples += 1;
      if (sample.liquidWater) liquidWaterSamples += 1;
      if (sample.exposedTerrainLand) exposedTerrainLandSamples += 1;
      if (sample.ice) iceSamples += 1;
      if (sample.shelf) shelfSamples += 1;
      if (sample.ocean) oceanSamples += 1;
      if (sample.coastal) coastalSamples += 1;
    }
  }

  cachedSummary = {
    ok: true,
    receipt: RECEIPT,
    contract: CONTRACT,
    version: VERSION,
    totalSamples: total,
    classCounts,
    visualSurfaceClasses: Object.keys(classCounts),

    solidSurfaceLandSamples,
    liquidWaterSamples,
    exposedTerrainLandSamples,
    iceSamples,
    shelfSamples,
    oceanSamples,
    coastalSamples,

    solidSurfaceLandRatio: solidSurfaceLandSamples / total,
    liquidWaterRatio: liquidWaterSamples / total,
    exposedTerrainLandRatio: exposedTerrainLandSamples / total,
    iceRatio: iceSamples / total,
    shelfRatio: shelfSamples / total,
    oceanRatio: oceanSamples / total,
    coastalRatio: coastalSamples / total,

    targetSolidSurfaceRatio: TARGET_SOLID_SURFACE_RATIO,
    model: surfaceModel,

    downstreamImported: STATUS.downstreamImported,
    downstreamSamplerReady: STATUS.downstreamSamplerReady,
    downstreamChainConsumed: STATUS.downstreamChainConsumed,
    downstreamImportError: STATUS.downstreamImportError,

    staticSurfaceTruthAuthority: true,
    runtimeAuthority: false,
    motionAuthority: false,
    paintAuthority: false,
    blurAuthority: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };

  return cachedSummary;
}

function exposeSurfaceStatus() {
  STATUS.summary = cachedSummary || null;

  if (typeof window !== "undefined") {
    window.AUDRALIA_SURFACE_STATUS = STATUS;
    window.AUDRALIA_SURFACE_RECEIPT = RECEIPT;
    window.AUDRALIA_SURFACE_SUMMARY = cachedSummary;
    window.__AUDRALIA_SURFACE_STATUS__ = STATUS;
    window.__AUDRALIA_SURFACE_RECEIPT__ = RECEIPT;
    window.__AUDRALIA_SURFACE_SUMMARY__ = cachedSummary;
  }

  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dataset.audraliaSurfaceReceipt = RECEIPT;
    document.documentElement.dataset.audraliaSurfaceTruthBridge = "true";
    document.documentElement.dataset.audraliaSurfaceRuntimeAuthority = "false";
    document.documentElement.dataset.audraliaSurfacePaintAuthority = "false";
    document.documentElement.dataset.audraliaSurfaceBlurAuthority = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }

  try {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("audralia:surface-status", { detail: STATUS }));
    }
  } catch (_) {}

  return STATUS;
}

export function sampleSurface(input, lonArg, uArg, vArg) {
  return classifySurface(normalizeCoordinateInput(input, lonArg, uArg, vArg));
}

export function sampleAudraliaSurface(input, lonArg, uArg, vArg) {
  return sampleSurface(input, lonArg, uArg, vArg);
}

export function sampleAudraliaSurfaceTruth(input, lonArg, uArg, vArg) {
  return sampleSurface(input, lonArg, uArg, vArg);
}

export function getStatus() {
  return {
    ...STATUS,
    summary: getSummary()
  };
}

export function getSummary() {
  cachedSummary = computeSummary();
  exposeSurfaceStatus();
  return cachedSummary;
}

export function getSurfaceSummary() {
  return getSummary();
}

export function getSurfaceDataset() {
  return {
    receipt: RECEIPT,
    contract: CONTRACT,
    version: VERSION,
    model: surfaceModel,
    landLobes: LAND_LOBES,
    summary: getSummary(),
    status: getStatus()
  };
}

export const AUDRALIA_SURFACE_STATUS = STATUS;
export const AUDRALIA_SURFACE_RECEIPT_VALUE = RECEIPT;
export const AUDRALIA_SURFACE_CONTRACT_VALUE = CONTRACT;
export const AUDRALIA_SURFACE_DATASET = {
  receipt: RECEIPT,
  contract: CONTRACT,
  version: VERSION,
  model: surfaceModel,
  landLobes: LAND_LOBES
};

await initializeDownstream();

cachedSummary = computeSummary();
exposeSurfaceStatus();

export default {
  receipt: RECEIPT,
  contract: CONTRACT,
  version: VERSION,
  sampleSurface,
  sampleAudraliaSurface,
  sampleAudraliaSurfaceTruth,
  getStatus,
  getSummary,
  getSurfaceSummary,
  getSurfaceDataset
};

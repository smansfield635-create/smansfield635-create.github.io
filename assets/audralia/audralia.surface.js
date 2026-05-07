// /assets/audralia/audralia.surface.js
// AUDRALIA_SURFACE_PARENT_STANDARD_NONBLOCKING_BOOT_TNT_v3
// Full-file replacement.
// Purpose:
// - Preserve parent-standard surface truth.
// - Remove top-level await / blocking import stall.
// - Let canvas render immediately from procedural parent surface.
// - Initialize downstream authorities asynchronously after first paint.
// - Never animate, never paint, never blur, never import runtime.
// - No GraphicBox. No image generation. No visual-pass claim.

const RECEIPT = "AUDRALIA_SURFACE_PARENT_STANDARD_NONBLOCKING_BOOT_TNT_v3";
const PREVIOUS_RECEIPT = "AUDRALIA_SURFACE_PARENT_STANDARD_4K_HEX_MICRO_TRUTH_TNT_v2";
const CONTRACT = "AUDRALIA_SURFACE_PARENT_STANDARD_GAP_CLOSE_NONBLOCKING_TNT_v3";
const VERSION = "2026-05-07.surface-parent-standard-nonblocking-boot.v3";

const TOPOLOGY_PATH = "/assets/audralia/audralia/tectonics/topology/render.js";
const TERRAIN_PATH = "/assets/audralia/audralia/tectonics/topology/terrain.render.js";
const HYDRATION_PATH = "/assets/audralia/audralia/hydration/render.js";
const OCEANS_PATH = "/assets/audralia/audralia/hydration/oceans.render.js";
const DEEP_OCEAN_PATH = "/assets/audralia/audralia/hydration/deep-ocean.render.js";

const GRID_WIDTH = 144;
const GRID_HEIGHT = 72;
const TARGET_SOLID_SURFACE_RATIO = 0.292;
const TARGET_SOLID_SURFACE_RATIO_MIN = 0.27;
const TARGET_SOLID_SURFACE_RATIO_MAX = 0.31;
const TARGET_LIQUID_WATER_RATIO = 0.708;
const TARGET_LIQUID_WATER_RATIO_MIN = 0.69;
const TARGET_LIQUID_WATER_RATIO_MAX = 0.76;
const HEX_RESOLUTION = 192;

const STATUS = {
  ok: true,
  receipt: RECEIPT,
  previousReceipt: PREVIOUS_RECEIPT,
  contract: CONTRACT,
  version: VERSION,
  role: "audralia-parent-standard-static-surface-truth-nonblocking-authority",

  parentStandard: true,
  nonblockingBoot: true,
  importsBlockFirstPaint: false,
  downstreamInitializedAsync: false,

  runtimeAuthority: false,
  motionAuthority: false,
  paintAuthority: false,
  blurAuthority: false,
  compositorAuthority: false,
  visualSovereignty: false,
  staticSurfaceTruthAuthority: true,
  hexMicroSurfaceTruthAuthority: true,

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
  targetSolidSurfaceRatioMin: TARGET_SOLID_SURFACE_RATIO_MIN,
  targetSolidSurfaceRatioMax: TARGET_SOLID_SURFACE_RATIO_MAX,
  targetLiquidWaterRatio: TARGET_LIQUID_WATER_RATIO,
  targetLiquidWaterRatioMin: TARGET_LIQUID_WATER_RATIO_MIN,
  targetLiquidWaterRatioMax: TARGET_LIQUID_WATER_RATIO_MAX,

  fallbackAllowed: true,
  fallbackReason: "nonblocking-parent-procedural-surface-feeds-canvas-before-downstream-finishes",

  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false
};

function createRecord(key, path) {
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

const MODULE_RECORDS = {
  topology: createRecord("topology", TOPOLOGY_PATH),
  terrain: createRecord("terrain", TERRAIN_PATH),
  hydration: createRecord("hydration", HYDRATION_PATH),
  oceans: createRecord("oceans", OCEANS_PATH),
  deepOcean: createRecord("deepOcean", DEEP_OCEAN_PATH)
};

let selectedRecord = null;
let downstreamInitStarted = false;
let cachedSummary = null;

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
  { id: "western-mainland-arc", lat: -17, lon: -112, rx: 58, ry: 29, twist: -16, weight: 1.08, material: "green-granite-opal" },
  { id: "eastern-attached-mainland", lat: 6, lon: -24, rx: 45, ry: 31, twist: 11, weight: 0.98, material: "gold-granite-slate" },
  { id: "northern-rock-crown", lat: 53, lon: -76, rx: 60, ry: 20, twist: 2, weight: 0.92, material: "ice-opal-crown" },
  { id: "southern-weathered-mass", lat: -59, lon: 82, rx: 73, ry: 23, twist: -8, weight: 1.02, material: "weathered-green-stone" },
  { id: "equatorial-ancient-chain", lat: -7, lon: 121, rx: 44, ry: 18, twist: 16, weight: 0.84, material: "ancient-brown-granite" },
  { id: "south-east-shelf-islands", lat: -34, lon: 135, rx: 34, ry: 15, twist: 21, weight: 0.68, material: "coastal-opal-islands" },
  { id: "far-east-reef-knife", lat: -24, lon: 169, rx: 31, ry: 12, twist: 31, weight: 0.52, material: "reef-knife-opal" },
  { id: "western-pressure-islands", lat: 8, lon: -154, rx: 27, ry: 14, twist: -24, weight: 0.48, material: "pressure-island-slate" }
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

function lobeContext(latDeg, lonDeg) {
  let strongest = 0;
  let strongestLobe = LAND_LOBES[0];
  let sum = 0;

  for (const lobe of LAND_LOBES) {
    const influence = ellipseInfluenceDegrees(latDeg, lonDeg, lobe);
    sum += influence;

    if (influence > strongest) {
      strongest = influence;
      strongestLobe = lobe;
    }
  }

  return {
    strongest,
    sum,
    lobe: strongestLobe,
    lobeId: strongestLobe.id,
    materialFamily: strongestLobe.material
  };
}

function staticLandPotential(lat, lon) {
  const point = latLonToPoint(lat, lon);
  const latDeg = lat * 180 / Math.PI;
  const lonDeg = lon * 180 / Math.PI;
  const context = lobeContext(latDeg, lonDeg);

  const broad = fbm3(point.x * 2.7 + 3.1, point.y * 2.7 - 1.4, point.z * 2.7 + 5.9, 5);
  const ridge = ridged3(point.x * 5.6 - 7.2, point.y * 5.6 + 4.4, point.z * 5.6 - 2.9, 4);
  const micro = fbm3(point.x * 18.0 + 1.8, point.y * 18.0 - 9.6, point.z * 18.0 + 6.2, 3);

  const latitudeSoftener = 1 - Math.abs(point.y) * 0.15;
  const polarContinuity = smoothstep(0.72, 0.95, Math.abs(point.y)) * (0.04 + ridge * 0.06);
  const organicBreak = Math.sin((lonDeg * 0.021) + (latDeg * 0.037)) * 0.018;

  return clamp01(
    context.strongest * 0.66 +
    clamp(context.sum * 0.22, 0, 0.42) +
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
    previousReceipt: PREVIOUS_RECEIPT,
    contract: CONTRACT,
    gridWidth: GRID_WIDTH,
    gridHeight: GRID_HEIGHT,
    totalSamples: scores.length,
    targetSolidSurfaceRatio: TARGET_SOLID_SURFACE_RATIO,
    targetLiquidWaterRatio: TARGET_LIQUID_WATER_RATIO,
    landThreshold: scores[index],
    hexResolution: HEX_RESOLUTION
  });
}

const surfaceModel = buildSurfaceModel();

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
    object.sampleAudraliaSurfaceTruth,
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
    const module = await import(`${item.path}?surface=${encodeURIComponent(RECEIPT)}&parent=${encodeURIComponent(CONTRACT)}`);
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

async function initializeDownstreamAsync() {
  if (downstreamInitStarted) return STATUS;
  downstreamInitStarted = true;

  const records = await Promise.allSettled([
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

  STATUS.downstreamInitializedAsync = true;
  STATUS.downstreamImported = Object.values(MODULE_RECORDS).some((item) => item.imported);
  STATUS.downstreamSamplerReady = Boolean(selectedRecord);
  STATUS.downstreamChainConsumed = STATUS.downstreamImported;
  STATUS.downstreamImportError = Object.values(MODULE_RECORDS)
    .filter((item) => item.importError)
    .map((item) => `${item.key}:${item.importError}`)
    .join(" | ");

  cachedSummary = null;
  exposeSurfaceStatus();

  return {
    status: STATUS,
    records
  };
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

function hexRound(q, r) {
  const s = -q - r;
  let rq = Math.round(q);
  let rr = Math.round(r);
  let rs = Math.round(s);

  const qDiff = Math.abs(rq - q);
  const rDiff = Math.abs(rr - r);
  const sDiff = Math.abs(rs - s);

  if (qDiff > rDiff && qDiff > sDiff) {
    rq = -rr - rs;
  } else if (rDiff > sDiff) {
    rr = -rq - rs;
  }

  return { q: rq, r: rr, s: -rq - rr };
}

function computeHexCell(coordinate, point) {
  const scale = HEX_RESOLUTION;
  const x = (coordinate.lon / Math.PI) * scale * Math.max(0.28, Math.cos(coordinate.lat));
  const y = (coordinate.lat / (Math.PI / 2)) * scale * 0.82;
  const q = (Math.sqrt(3) / 3 * x - 1 / 3 * y);
  const r = (2 / 3 * y);
  const rounded = hexRound(q, r);
  const ring = Math.max(Math.abs(rounded.q), Math.abs(rounded.r), Math.abs(rounded.s));
  const id = `audralia-h${HEX_RESOLUTION}-q${rounded.q}-r${rounded.r}`;
  const seed = hash3(rounded.q, rounded.r, ring + point.z * 19.37);

  return Object.freeze({
    id,
    q: rounded.q,
    r: rounded.r,
    s: rounded.s,
    ring,
    resolution: HEX_RESOLUTION,
    seed
  });
}

function materialProfile(materialFamily, normalized) {
  const relief = clamp01(normalized.reliefTexture);
  const mineral = clamp01(normalized.mineralIndex);
  const coastline = clamp01(normalized.coastlineIndex);
  const turquoise = clamp01(normalized.turquoiseIndex);

  let diamond = 0.04;
  let opal = 0.06;
  let granite = 0.08;
  let slate = 0.08;
  let whiteOpalSand = 0;
  let blackDiamondSand = 0;

  if (normalized.ice) {
    diamond = clamp01(0.32 + mineral * 0.20);
    opal = clamp01(0.22 + turquoise * 0.18);
    whiteOpalSand = clamp01(0.26 + coastline * 0.20);
  } else if (normalized.exposedTerrainLand) {
    diamond = clamp01(mineral * 0.46 + relief * 0.16);
    opal = clamp01(coastline * 0.34 + mineral * 0.16);
    granite = clamp01(0.22 + relief * 0.48 + mineral * 0.16);
    slate = clamp01(0.16 + relief * 0.32 + (1 - mineral) * 0.10);
    whiteOpalSand = clamp01(coastline * 0.38 + turquoise * 0.12);
    blackDiamondSand = clamp01(coastline * relief * 0.28 + slate * 0.12);
  } else if (normalized.shelf) {
    opal = clamp01(0.34 + turquoise * 0.32);
    whiteOpalSand = clamp01(0.20 + coastline * 0.38);
    diamond = clamp01(0.08 + turquoise * 0.10);
  } else if (normalized.ocean) {
    opal = clamp01(0.10 + turquoise * 0.10);
    slate = clamp01(0.08 + normalized.depth * 0.18);
  }

  if (String(materialFamily).includes("opal")) opal = clamp01(opal + 0.12);
  if (String(materialFamily).includes("granite")) granite = clamp01(granite + 0.12);
  if (String(materialFamily).includes("slate")) slate = clamp01(slate + 0.10);
  if (String(materialFamily).includes("ice")) whiteOpalSand = clamp01(whiteOpalSand + 0.10);

  return Object.freeze({
    materialFamily,
    diamondSignal: diamond,
    opalSignal: opal,
    graniteSignal: granite,
    slateSignal: slate,
    whiteOpalSandSignal: whiteOpalSand,
    blackDiamondSandSignal: blackDiamondSand,
    parentMaterialHint: normalized.ice
      ? "ice-opal-diamond"
      : normalized.exposedTerrainLand
        ? materialFamily
        : normalized.shelf
          ? "opal-shelf-water"
          : "deep-blue-slate-water"
  });
}

function classifySurface(coordinate) {
  const point = latLonToPoint(coordinate.lat, coordinate.lon);
  const latDeg = coordinate.lat * 180 / Math.PI;
  const lonDeg = coordinate.lon * 180 / Math.PI;
  const lobe = lobeContext(latDeg, lonDeg);
  const score = staticLandPotential(coordinate.lat, coordinate.lon);
  const threshold = surfaceModel.landThreshold;
  const raw = callDownstream(coordinate);

  const downstreamLandHint = Boolean(raw?.solidSurfaceLand || raw?.topologyLand || raw?.land || raw?.visibleLand);
  const downstreamWaterHint = Boolean(raw?.liquidWater || raw?.water || raw?.ocean || raw?.shelf);
  const downstreamIceHint = Boolean(raw?.ice || raw?.glacier || raw?.snowpack);

  const solidSurfaceCandidate = score >= threshold || (downstreamLandHint && score > threshold - 0.045);
  const waterOverride = downstreamWaterHint && score < threshold + 0.035 && !downstreamLandHint;
  const finalLand = solidSurfaceCandidate && !waterOverride;
  const finalWater = !finalLand;

  const edgeDistance = Math.abs(score - threshold);
  const nearCoast = edgeDistance < 0.075;

  const waterTexture = fbm3(point.x * 14.0 + 8.7, point.y * 14.0 - 3.4, point.z * 14.0 + 2.6, 4);
  const reliefTexture = ridged3(point.x * 15.5 + 2.2, point.y * 15.5 - 8.1, point.z * 15.5 + 6.4, 4);
  const colorBreak = fbm3(point.x * 31.0 + 4.1, point.y * 31.0 - 2.8, point.z * 31.0 + 7.2, 3);
  const mineralIndex = fbm3(point.x * 24.5 - 9.1, point.y * 24.5 + 5.2, point.z * 24.5 - 1.7, 4);
  const microTerrain = ridged3(point.x * 48.0 + 11.2, point.y * 48.0 - 4.9, point.z * 48.0 + 2.1, 3);
  const glazeTexture = fbm3(point.x * 64.0 - 2.5, point.y * 64.0 + 8.4, point.z * 64.0 - 9.9, 3);
  const iceNoise = fbm3(point.x * 11.0 - 4.3, point.y * 11.0 + 11.1, point.z * 11.0 - 5.7, 4);

  const shelf = finalWater && (score > threshold - 0.105 || waterTexture > 0.86);
  const ocean = finalWater && !shelf;

  const ice =
    finalLand &&
    (
      downstreamIceHint ||
      (Math.abs(point.y) > 0.86 && iceNoise > 0.16) ||
      (Math.abs(point.y) > 0.75 && iceNoise > 0.66)
    );

  const exposedTerrainLand = finalLand && !ice;
  const coastlineIndex = nearCoast || shelf ? clamp01(1 - edgeDistance / 0.105) : 0;
  const shelfIndex = shelf ? clamp01(0.42 + coastlineIndex * 0.36 + waterTexture * 0.22) : 0;

  const elevation = finalLand
    ? clamp01(0.14 + (score - threshold) * 2.15 + reliefTexture * 0.32 + microTerrain * 0.10 + (ice ? 0.14 : 0))
    : 0;

  const depth = finalWater
    ? clamp01(0.16 + (threshold - score) * 1.45 + waterTexture * 0.28 + (ocean ? 0.18 : 0))
    : 0;

  const turquoiseIndex = shelf
    ? clamp01(0.38 + shelfIndex * 0.38 + waterTexture * 0.12)
    : ocean
      ? clamp01(0.06 + waterTexture * 0.11)
      : clamp01(coastlineIndex * 0.15);

  const ridgeIndex = exposedTerrainLand ? clamp01(reliefTexture * 0.56 + mineralIndex * 0.22 + elevation * 0.18) : 0;
  const mountainIndex = exposedTerrainLand ? clamp01(elevation * 0.60 + reliefTexture * 0.34 + microTerrain * 0.10) : 0;
  const basinIndex = exposedTerrainLand ? clamp01((1 - elevation) * 0.28 + waterTexture * 0.22 + (1 - reliefTexture) * 0.14) : 0;
  const coastalCliffIndex = exposedTerrainLand && coastlineIndex > 0
    ? clamp01(elevation * 0.40 + reliefTexture * 0.34 + coastlineIndex * 0.22)
    : 0;

  const riverCandidate = exposedTerrainLand
    ? clamp01(basinIndex * 0.28 + ridgeIndex * 0.16 + coastlineIndex * 0.16 + waterTexture * 0.22)
    : 0;

  const lakeBasinCandidate = exposedTerrainLand
    ? clamp01(basinIndex * 0.46 + (1 - elevation) * 0.18 + waterTexture * 0.16)
    : 0;

  const springCandidate = exposedTerrainLand
    ? clamp01(mineralIndex * 0.22 + waterTexture * 0.24 + reliefTexture * 0.18)
    : 0;

  const hexCell = computeHexCell(coordinate, point);

  const normalized = {
    ice,
    exposedTerrainLand,
    shelf,
    ocean,
    depth,
    elevation,
    coastlineIndex,
    shelfIndex,
    turquoiseIndex,
    reliefTexture,
    mineralIndex
  };

  const material = materialProfile(lobe.materialFamily, normalized);
  const microGlazeIndex = clamp01(glazeTexture * 0.46 + microTerrain * 0.22 + material.opalSignal * 0.18 + coastlineIndex * 0.14);
  const parentEdgeDefinition = clamp01(coastlineIndex * 0.45 + ridgeIndex * 0.20 + coastalCliffIndex * 0.20 + microTerrain * 0.15);
  const parentHexDetailIndex = clamp01(hexCell.seed * 0.24 + microTerrain * 0.34 + reliefTexture * 0.18 + glazeTexture * 0.24);

  const visualSurfaceClass = ice
    ? "glacier_ice_snowpack_surface"
    : exposedTerrainLand
      ? "inland_terrain_land_surface"
      : shelf
        ? "shelf_water_surface"
        : "ocean_water_surface";

  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    previousReceipt: PREVIOUS_RECEIPT,
    contract: CONTRACT,
    source: "audralia-parent-standard-static-surface-truth-nonblocking",
    downstream: raw,
    downstreamReceipt: raw?.receipt || "",
    downstreamSource: selectedRecord?.key || "procedural-parent-standard-surface",

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
    lobeId: lobe.lobeId,
    lobeInfluence: lobe.strongest,
    materialFamily: lobe.materialFamily,

    hexCell,
    hexCellId: hexCell.id,
    hexQ: hexCell.q,
    hexR: hexCell.r,
    hexS: hexCell.s,
    hexRing: hexCell.ring,
    hexResolution: hexCell.resolution,
    parentHexDetailIndex,

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
    mineralIndex,
    microTerrainIndex: microTerrain,
    microGlazeIndex,
    parentEdgeDefinition,

    ridgeIndex,
    mountainIndex,
    basinIndex,
    coastalCliffIndex,
    canyonIndex: 0,

    river: riverCandidate > 0.72,
    stream: riverCandidate > 0.62,
    lake: lakeBasinCandidate > 0.66,
    floodplain: (nearCoast || shelf) && riverCandidate > 0.56,
    delta: (nearCoast || shelf) && riverCandidate > 0.64,
    spring: springCandidate > 0.68,
    subterranean: exposedTerrainLand && springCandidate > 0.62,

    riverCandidate,
    streamCandidate: riverCandidate,
    lakeBasinCandidate,
    floodplainCandidate: nearCoast || shelf ? clamp01(riverCandidate * 0.58 + coastlineIndex * 0.28) : 0,
    deltaCandidate: nearCoast || shelf ? clamp01(riverCandidate * 0.46 + coastlineIndex * 0.38) : 0,
    springCandidate,
    subterraneanCandidate: exposedTerrainLand ? clamp01(springCandidate * 0.62 + mineralIndex * 0.20) : 0,

    diamondSignal: material.diamondSignal,
    opalSignal: material.opalSignal,
    graniteSignal: material.graniteSignal,
    slateSignal: material.slateSignal,
    whiteOpalSandSignal: material.whiteOpalSandSignal,
    blackDiamondSandSignal: material.blackDiamondSandSignal,
    parentMaterialHint: material.parentMaterialHint,

    visualSurfaceClass,
    surfaceClass: visualSurfaceClass,
    className: visualSurfaceClass,
    type: visualSurfaceClass,

    staticSurfaceTruthAuthority: true,
    parentStandard: true,
    runtimeAuthority: false,
    motionAuthority: false,
    paintAuthority: false,
    blurAuthority: false,
    compositorAuthority: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
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
  let parentHexDetailAccum = 0;
  let parentEdgeDefinitionAccum = 0;
  let maxParentHexDetailIndex = 0;
  let maxParentEdgeDefinition = 0;
  let maxElevation = 0;
  let maxDepth = 0;
  let maxTurquoise = 0;
  let maxMicroGlaze = 0;

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

      parentHexDetailAccum += sample.parentHexDetailIndex;
      parentEdgeDefinitionAccum += sample.parentEdgeDefinition;
      maxParentHexDetailIndex = Math.max(maxParentHexDetailIndex, sample.parentHexDetailIndex);
      maxParentEdgeDefinition = Math.max(maxParentEdgeDefinition, sample.parentEdgeDefinition);
      maxElevation = Math.max(maxElevation, sample.elevation);
      maxDepth = Math.max(maxDepth, sample.depth);
      maxTurquoise = Math.max(maxTurquoise, sample.turquoiseIndex);
      maxMicroGlaze = Math.max(maxMicroGlaze, sample.microGlazeIndex);
    }
  }

  const solidSurfaceLandRatio = solidSurfaceLandSamples / total;
  const liquidWaterRatio = liquidWaterSamples / total;
  const exposedTerrainLandRatio = exposedTerrainLandSamples / total;

  cachedSummary = Object.freeze({
    ok: true,
    receipt: RECEIPT,
    previousReceipt: PREVIOUS_RECEIPT,
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

    solidSurfaceLandRatio,
    liquidWaterRatio,
    exposedTerrainLandRatio,
    iceRatio: iceSamples / total,
    shelfRatio: shelfSamples / total,
    oceanRatio: oceanSamples / total,
    coastalRatio: coastalSamples / total,

    targetSolidSurfaceRatio: TARGET_SOLID_SURFACE_RATIO,
    targetSolidSurfaceRatioMin: TARGET_SOLID_SURFACE_RATIO_MIN,
    targetSolidSurfaceRatioMax: TARGET_SOLID_SURFACE_RATIO_MAX,
    targetLiquidWaterRatio: TARGET_LIQUID_WATER_RATIO,
    targetLiquidWaterRatioMin: TARGET_LIQUID_WATER_RATIO_MIN,
    targetLiquidWaterRatioMax: TARGET_LIQUID_WATER_RATIO_MAX,

    solidSurfaceLandRatioTargetMet:
      solidSurfaceLandRatio >= TARGET_SOLID_SURFACE_RATIO_MIN &&
      solidSurfaceLandRatio <= TARGET_SOLID_SURFACE_RATIO_MAX,

    liquidWaterRatioTargetMet:
      liquidWaterRatio >= TARGET_LIQUID_WATER_RATIO_MIN &&
      liquidWaterRatio <= TARGET_LIQUID_WATER_RATIO_MAX,

    maxElevation,
    maxDepth,
    maxTurquoise,
    maxMicroGlaze,
    maxParentHexDetailIndex,
    maxParentEdgeDefinition,
    averageParentHexDetailIndex: parentHexDetailAccum / total,
    averageParentEdgeDefinition: parentEdgeDefinitionAccum / total,

    hexResolution: HEX_RESOLUTION,
    model: surfaceModel,

    downstreamInitializedAsync: STATUS.downstreamInitializedAsync,
    downstreamImported: STATUS.downstreamImported,
    downstreamSamplerReady: STATUS.downstreamSamplerReady,
    downstreamChainConsumed: STATUS.downstreamChainConsumed,
    downstreamImportError: STATUS.downstreamImportError,

    staticSurfaceTruthAuthority: true,
    parentStandard: true,
    hexMicroSurfaceTruthAuthority: true,
    runtimeAuthority: false,
    motionAuthority: false,
    paintAuthority: false,
    blurAuthority: false,
    compositorAuthority: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });

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
    document.documentElement.dataset.audraliaSurfacePreviousReceipt = PREVIOUS_RECEIPT;
    document.documentElement.dataset.audraliaSurfaceContract = CONTRACT;
    document.documentElement.dataset.audraliaSurfaceTruthBridge = "true";
    document.documentElement.dataset.audraliaSurfaceParentStandard = "true";
    document.documentElement.dataset.audraliaSurfaceNonblockingBoot = "true";
    document.documentElement.dataset.audraliaSurfaceHexMicroTruth = "true";
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

export function sampleParentSurface(input, lonArg, uArg, vArg) {
  return sampleSurface(input, lonArg, uArg, vArg);
}

export function initializeSurfaceDownstream() {
  return initializeDownstreamAsync();
}

export function getStatus() {
  return {
    ...STATUS,
    summary: cachedSummary
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

export function getParentStandard() {
  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    previousReceipt: PREVIOUS_RECEIPT,
    contract: CONTRACT,
    version: VERSION,
    standard: "parent-surface-truth-4k-hex-micro-standard-nonblocking",
    importsBlockFirstPaint: false,
    owns: Object.freeze([
      "static_surface_truth",
      "land_water_ice_shelf_classification",
      "elevation_depth_scalar_fields",
      "coastline_gradient_fields",
      "material_hint_fields",
      "hex_cell_metadata",
      "micro_relief_indices",
      "parent_grade_surface_summary"
    ]),
    doesNotOwn: Object.freeze([
      "runtime_motion",
      "animation_clock",
      "canvas_paint",
      "pixel_blending",
      "blur",
      "route_mount",
      "gauges_scoring",
      "visual_pass_claim"
    ]),
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
}

export function getSurfaceDataset() {
  return Object.freeze({
    receipt: RECEIPT,
    previousReceipt: PREVIOUS_RECEIPT,
    contract: CONTRACT,
    version: VERSION,
    model: surfaceModel,
    landLobes: LAND_LOBES,
    summary: cachedSummary,
    status: getStatus(),
    parentStandard: getParentStandard()
  });
}

export const AUDRALIA_SURFACE_STATUS = STATUS;
export const AUDRALIA_SURFACE_RECEIPT_VALUE = RECEIPT;
export const AUDRALIA_SURFACE_PREVIOUS_RECEIPT_VALUE = PREVIOUS_RECEIPT;
export const AUDRALIA_SURFACE_CONTRACT_VALUE = CONTRACT;
export const AUDRALIA_SURFACE_PARENT_STANDARD = true;
export const AUDRALIA_SURFACE_NONBLOCKING_BOOT = true;
export const AUDRALIA_SURFACE_DATASET = Object.freeze({
  receipt: RECEIPT,
  previousReceipt: PREVIOUS_RECEIPT,
  contract: CONTRACT,
  version: VERSION,
  model: surfaceModel,
  landLobes: LAND_LOBES,
  hexResolution: HEX_RESOLUTION,
  parentStandard: true,
  nonblockingBoot: true
});

exposeSurfaceStatus();

if (typeof queueMicrotask === "function") {
  queueMicrotask(() => {
    initializeDownstreamAsync().catch((error) => {
      STATUS.downstreamImportError = String(error?.message || error || "async downstream initialization failure");
      exposeSurfaceStatus();
    });
  });
} else {
  setTimeout(() => {
    initializeDownstreamAsync().catch((error) => {
      STATUS.downstreamImportError = String(error?.message || error || "async downstream initialization failure");
      exposeSurfaceStatus();
    });
  }, 0);
}

export default Object.freeze({
  receipt: RECEIPT,
  previousReceipt: PREVIOUS_RECEIPT,
  contract: CONTRACT,
  version: VERSION,
  parentStandard: true,
  nonblockingBoot: true,
  sampleSurface,
  sampleAudraliaSurface,
  sampleAudraliaSurfaceTruth,
  sampleParentSurface,
  initializeSurfaceDownstream,
  getStatus,
  getSummary,
  getSurfaceSummary,
  getSurfaceDataset,
  getParentStandard
});

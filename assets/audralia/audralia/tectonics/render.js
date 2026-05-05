// /assets/audralia/audralia/tectonics/render.js
// AUDRALIA_TECTONICS_DERIVATIVE_ORIGIN_PARENT_TNT_v1
//
// Role:
// - Audralia tectonics parent authority.
// - Derivative origin for the constructed-world surface chain.
// - Tectonics begot topology.
// - Topology begot terrain.
// - Provides plate pressure, mineral memory, crustal stress, ancient mountain memory, trench pressure, uplift permission, and terrain pressure handoff.
//
// Hard locks:
// - No DOM mutation.
// - No route rendering.
// - No runtime rendering.
// - No topology ownership.
// - No terrain ownership.
// - No hydration ownership.
// - No foliage.
// - No trees.
// - No vegetation.
// - No animals.
// - No marine life.
// - No construct civilization.
// - No graphic box.
// - No image generation.
// - No visual pass claim.

const RECEIPT = "AUDRALIA_TECTONICS_DERIVATIVE_ORIGIN_PARENT_TNT_v1";

const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1_TECTONICS_DERIVATIVE_ORIGIN";
const FILE = "/assets/audralia/audralia/tectonics/render.js";

const TECTONICS_LAW = Object.freeze({
  genealogy: "tectonics→topology→terrain",
  derivativeOrigin: true,
  begotTopology: true,
  topologyChildExpected: "/assets/audralia/audralia/tectonics/topology/render.js",
  terrainGrandchildExpected: "/assets/audralia/audralia/tectonics/topology/terrain.render.js",

  ownsTectonics: true,
  ownsPlatePressure: true,
  ownsMineralMemory: true,
  ownsAncientMountainMemory: true,
  ownsCrustalStress: true,
  ownsTerrainPressureHandoff: true,

  ownsTopology: false,
  ownsTerrain: false,
  ownsLandFootprint: false,
  ownsHydration: false,
  ownsRouteRendering: false,
  ownsRuntimeRendering: false,
  ownsFinalRender: false,

  visualPassClaimed: false
});

const DEFAULTS = Object.freeze({
  fieldWidth: 224,
  fieldHeight: 112,
  minFieldWidth: 64,
  minFieldHeight: 32,
  maxFieldWidth: 512,
  maxFieldHeight: 256,
  tectonicStressDemand: 0.88,
  ancientMountainMemory: 0.96,
  mineralExposureDemand: 0.90,
  erosionAge: 1
});

const PLATES = Object.freeze([
  { id: 1, key: "mainland_craton_plate", centerLon: -0.42, centerLat: 0.12, pressure: 0.92, mineralBias: "granite" },
  { id: 2, key: "western_opal_fold_plate", centerLon: -0.74, centerLat: -0.22, pressure: 0.78, mineralBias: "opal" },
  { id: 3, key: "eastern_diamond_shear_plate", centerLon: 0.48, centerLat: -0.02, pressure: 0.96, mineralBias: "diamond" },
  { id: 4, key: "northern_slate_crown_plate", centerLon: 0.08, centerLat: 0.62, pressure: 0.70, mineralBias: "slate" },
  { id: 5, key: "southern_ancient_basin_plate", centerLon: 0.28, centerLat: -0.68, pressure: 0.84, mineralBias: "granite" },
  { id: 6, key: "oceanic_trench_ring_plate", centerLon: -0.04, centerLat: -0.08, pressure: 0.66, mineralBias: "slate" }
]);

function clamp(value, min, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function normalizeDimension(value, fallback, min, max) {
  return clamp(Math.floor(Number(value) || fallback), min, max);
}

function normalizeUV(uInput, vInput) {
  const u = ((Number(uInput) || 0) % 1 + 1) % 1;
  const v = clamp(Number(vInput) || 0, 0, 1);

  return Object.freeze({
    u,
    v,
    lon: u * 2 - 1,
    lat: 1 - v * 2
  });
}

function fract(value) {
  return value - Math.floor(value);
}

function mix(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

function hash2(x, y, seed) {
  return fract(Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123);
}

function valueNoise(x, y, seed) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = fract(x);
  const fy = fract(y);

  const a = hash2(ix, iy, seed);
  const b = hash2(ix + 1, iy, seed);
  const c = hash2(ix, iy + 1, seed);
  const d = hash2(ix + 1, iy + 1, seed);

  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  return mix(mix(a, b, ux), mix(c, d, ux), uy);
}

function fbm(x, y, seed, octaves = 4) {
  let total = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let normalizer = 0;

  for (let i = 0; i < octaves; i += 1) {
    total += valueNoise(x * frequency, y * frequency, seed + i * 23.19) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return total / Math.max(0.00001, normalizer);
}

function wrappedLonDistance(a, b) {
  const direct = Math.abs(a - b);
  return Math.min(direct, 2 - direct);
}

function plateDistance(point, plate) {
  const dx = wrappedLonDistance(point.lon, plate.centerLon);
  const dy = Math.abs(point.lat - plate.centerLat);
  return Math.sqrt(dx * dx * 0.82 + dy * dy * 1.18);
}

function nearestPlate(point) {
  let winner = PLATES[0];
  let winnerDistance = Infinity;
  let secondDistance = Infinity;

  for (const plate of PLATES) {
    const distance = plateDistance(point, plate);

    if (distance < winnerDistance) {
      secondDistance = winnerDistance;
      winnerDistance = distance;
      winner = plate;
    } else if (distance < secondDistance) {
      secondDistance = distance;
    }
  }

  return Object.freeze({
    plate: winner,
    distance: winnerDistance,
    boundaryPressure: clamp(1 - Math.abs(secondDistance - winnerDistance) * 5.2, 0, 1)
  });
}

function ridgeBand(point) {
  const diagonalA = Math.abs(point.lat - (0.36 * Math.sin((point.lon + 0.22) * Math.PI * 1.45)));
  const diagonalB = Math.abs(point.lat + 0.42 - (0.24 * Math.sin((point.lon - 0.34) * Math.PI * 1.9)));
  const meridian = Math.abs(point.lon - 0.18 - 0.08 * Math.sin(point.lat * Math.PI * 2.2));

  return clamp(
    (1 - diagonalA * 4.8) * 0.44 +
      (1 - diagonalB * 5.8) * 0.34 +
      (1 - meridian * 6.2) * 0.22,
    0,
    1
  );
}

function mineralField(point, plate, boundaryPressure, crustNoise) {
  const diamond = clamp(
    (plate.mineralBias === "diamond" ? 0.54 : 0.16) +
      boundaryPressure * 0.24 +
      crustNoise * 0.24 +
      Math.max(0, point.lon) * 0.08,
    0,
    1
  );

  const opal = clamp(
    (plate.mineralBias === "opal" ? 0.58 : 0.12) +
      (1 - Math.abs(point.lat)) * 0.18 +
      (1 - crustNoise) * 0.22,
    0,
    1
  );

  const granite = clamp(
    (plate.mineralBias === "granite" ? 0.58 : 0.18) +
      Math.abs(point.lat) * 0.14 +
      crustNoise * 0.18,
    0,
    1
  );

  const slate = clamp(
    (plate.mineralBias === "slate" ? 0.56 : 0.14) +
      boundaryPressure * 0.28 +
      (1 - crustNoise) * 0.14,
    0,
    1
  );

  return Object.freeze({ diamond, opal, granite, slate });
}

export function sampleTectonics(uInput, vInput, context = {}) {
  const point = normalizeUV(uInput, vInput);
  const options = Object.freeze({ ...DEFAULTS, ...(context || {}) });

  const plateResult = nearestPlate(point);
  const plate = plateResult.plate;

  const crustNoise = fbm(point.lon * 4.4 + 2.1, point.lat * 4.4 - 1.7, 2001, 5);
  const deepNoise = fbm(point.lon * 9.6 - 4.1, point.lat * 9.6 + 1.2, 2049, 4);
  const ridge = ridgeBand(point);

  const boundaryPressure = clamp(plateResult.boundaryPressure * 0.70 + ridge * 0.30, 0, 1);
  const crustalStressIndex = clamp(
    plate.pressure * 0.44 +
      boundaryPressure * 0.28 +
      crustNoise * 0.18 +
      clamp(options.tectonicStressDemand, 0, 1) * 0.10,
    0,
    1
  );

  const primordialMountainMemoryIndex = clamp(
    ridge * 0.46 +
      crustalStressIndex * 0.28 +
      clamp(options.ancientMountainMemory, 0, 1) * 0.18 +
      deepNoise * 0.08,
    0,
    1
  );

  const weatheredRemnantIndex = clamp(
    primordialMountainMemoryIndex * 0.46 +
      (1 - clamp(options.erosionAge, 0, 1)) * 0.08 +
      clamp(options.erosionAge, 0, 1) * 0.42 +
      crustNoise * 0.04,
    0,
    1
  );

  const mineral = mineralField(point, plate, boundaryPressure, crustNoise);

  const trenchReinforcementPermission = clamp(
    boundaryPressure * 0.38 +
      (1 - ridge) * 0.16 +
      Math.max(0, Math.abs(point.lat) - 0.48) * 0.28 +
      deepNoise * 0.18,
    0,
    1
  );

  const mountainChainPermission = clamp(
    primordialMountainMemoryIndex * 0.46 +
      boundaryPressure * 0.24 +
      ridge * 0.24 +
      mineral.granite * 0.06,
    0,
    1
  );

  const canyonPermission = clamp(
    boundaryPressure * 0.30 +
      weatheredRemnantIndex * 0.26 +
      (1 - mineral.opal) * 0.14 +
      deepNoise * 0.30,
    0,
    1
  );

  const cliffPermission = clamp(
    boundaryPressure * 0.34 +
      mineral.diamond * 0.24 +
      mineral.granite * 0.18 +
      crustalStressIndex * 0.24,
    0,
    1
  );

  const upliftPermission = clamp(
    mountainChainPermission * 0.50 +
      crustalStressIndex * 0.24 +
      boundaryPressure * 0.16 +
      crustNoise * 0.10,
    0,
    1
  );

  const terrainPressureHandoff = clamp(
    upliftPermission * 0.34 +
      mountainChainPermission * 0.24 +
      canyonPermission * 0.18 +
      cliffPermission * 0.14 +
      weatheredRemnantIndex * 0.10,
    0,
    1
  );

  return Object.freeze({
    receipt: RECEIPT,
    activeContract: RECEIPT,
    latestContract: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,

    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,

    genealogy: TECTONICS_LAW.genealogy,
    derivativeOrigin: true,
    begotTopology: true,
    ownsTectonics: true,
    ownsTopology: false,
    ownsTerrain: false,
    ownsLandFootprint: false,
    ownsHydration: false,

    tectonicType: boundaryPressure > 0.68 ? "plate_boundary_pressure" : "plate_interior_memory",
    plateId: plate.id,
    plateKey: plate.key,
    boundaryId: boundaryPressure > 0.68 ? `${plate.key}_boundary` : "plate_interior",
    plateDistance: plateResult.distance,
    boundaryPressure,

    crustalStressIndex,
    ancientCrustStabilityIndex: clamp(1 - boundaryPressure * 0.42 + mineral.granite * 0.18, 0, 1),
    primordialMountainMemoryIndex,
    weatheredRemnantIndex,
    mountainChainPermission,
    canyonPermission,
    cliffPermission,
    upliftPermission,
    trenchReinforcementPermission,
    terrainPressureHandoff,

    diamondPressureIndex: mineral.diamond,
    opalSeamIndex: mineral.opal,
    graniteCratonIndex: mineral.granite,
    slateFoldBeltIndex: mineral.slate,
    exposedMineralHardnessIndex: clamp(
      mineral.diamond * 0.34 +
        mineral.granite * 0.30 +
        mineral.slate * 0.22 +
        mineral.opal * 0.14,
      0,
      1
    ),

    newbornMountainScaleIndex: clamp(0.96 * ridge + primordialMountainMemoryIndex * 0.04, 0, 1),
    ancientWeatheredScaleIndex: weatheredRemnantIndex,
    mineralExposureDemand: clamp(options.mineralExposureDemand, 0, 1),

    fallbackUsed: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
}

export function buildTectonicsField(width = DEFAULTS.fieldWidth, height = DEFAULTS.fieldHeight, context = {}) {
  const w = normalizeDimension(width, DEFAULTS.fieldWidth, DEFAULTS.minFieldWidth, DEFAULTS.maxFieldWidth);
  const h = normalizeDimension(height, DEFAULTS.fieldHeight, DEFAULTS.minFieldHeight, DEFAULTS.maxFieldHeight);

  const samples = new Array(w * h);

  let boundarySamples = 0;
  let highStressSamples = 0;
  let mountainPermissionSamples = 0;
  let trenchPermissionSamples = 0;
  let maxStress = 0;
  let maxMountain = 0;
  let maxTerrainHandoff = 0;

  for (let y = 0; y < h; y += 1) {
    const v = h === 1 ? 0.5 : y / (h - 1);

    for (let x = 0; x < w; x += 1) {
      const u = w === 1 ? 0.5 : x / (w - 1);
      const sample = sampleTectonics(u, v, context);

      samples[y * w + x] = sample;

      if (sample.boundaryPressure > 0.58) boundarySamples += 1;
      if (sample.crustalStressIndex > 0.62) highStressSamples += 1;
      if (sample.mountainChainPermission > 0.58) mountainPermissionSamples += 1;
      if (sample.trenchReinforcementPermission > 0.58) trenchPermissionSamples += 1;

      maxStress = Math.max(maxStress, sample.crustalStressIndex);
      maxMountain = Math.max(maxMountain, sample.mountainChainPermission);
      maxTerrainHandoff = Math.max(maxTerrainHandoff, sample.terrainPressureHandoff);
    }
  }

  return Object.freeze({
    receipt: RECEIPT,
    activeContract: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    width: w,
    height: h,
    samples,
    stats: Object.freeze({
      totalSamples: samples.length,
      boundarySamples,
      highStressSamples,
      mountainPermissionSamples,
      trenchPermissionSamples,
      boundaryRatio: samples.length ? boundarySamples / samples.length : 0,
      highStressRatio: samples.length ? highStressSamples / samples.length : 0,
      mountainPermissionRatio: samples.length ? mountainPermissionSamples / samples.length : 0,
      trenchPermissionRatio: samples.length ? trenchPermissionSamples / samples.length : 0,
      maxStress,
      maxMountain,
      maxTerrainHandoff,
      derivativeOrigin: true,
      begotTopology: true,
      visualPassClaimed: false
    })
  });
}

export function getTectonicsSampleFromField(field, uInput, vInput) {
  if (!field || !field.samples || !field.width || !field.height) {
    return sampleTectonics(uInput, vInput);
  }

  const point = normalizeUV(uInput, vInput);
  const x = clamp(Math.round(point.u * (field.width - 1)), 0, field.width - 1);
  const y = clamp(Math.round(point.v * (field.height - 1)), 0, field.height - 1);

  return field.samples[y * field.width + x] || sampleTectonics(point.u, point.v);
}

export function getTectonicsStatus() {
  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    activeContract: RECEIPT,
    status: "active",
    id: "audralia-tectonics-derivative-origin-parent",
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    tectonicsLaw: TECTONICS_LAW,
    exports: Object.freeze([
      "sampleTectonics",
      "buildTectonicsField",
      "getTectonicsSampleFromField",
      "getTectonicsStatus"
    ]),
    derivativeOrigin: true,
    begotTopology: true,
    topologyChildExpected: TECTONICS_LAW.topologyChildExpected,
    terrainGrandchildExpected: TECTONICS_LAW.terrainGrandchildExpected,
    ownsTectonics: true,
    ownsTopology: false,
    ownsTerrain: false,
    ownsHydration: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
}

const api = Object.freeze({
  sampleTectonics,
  buildTectonicsField,
  getTectonicsSampleFromField,
  getTectonicsStatus
});

if (typeof window !== "undefined") {
  window.DGBAudraliaTectonics = api;
  window.AudraliaTectonics = api;
  window.audraliaTectonics = api;
}

export default api;

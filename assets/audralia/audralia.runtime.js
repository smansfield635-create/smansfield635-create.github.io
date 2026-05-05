// /assets/audralia/audralia.runtime.js
// AUDRALIA_RUNTIME_ALLOW_TECTONICS_TOPOLOGY_TERRAIN_HYDRATION_SURFACE_TNT_v1
//
// Active G6 renewal:
// - AUDRALIA_G6_SURFACE_SAMPLING_AND_TERRAIN_REFINEMENT_TNT_v1
//
// Preserved receipts:
// - AUDRALIA_RUNTIME_IMPORT_SAFE_TOPOLOGY_ALIGNMENT_STABILIZER_TNT_v1
// - AUDRALIA_TOPOLOGY_RUNTIME_EARTH_EQUIVALENT_LAND_RATIO_ALIGNMENT_TNT_v1
// - AUDRALIA_RUNTIME_ROUTE_COMPAT_SURFACE_DIAGNOSTIC_RENEWAL_TNT_v2
//
// Purpose:
// - Preserve the successful Audralia solid-surface land/water baseline.
// - Increase surface expression through higher runtime field resolution.
// - Increase terrain relief, coastline definition, shelf transition, ice/snowpack seating, ridge/canyon/cliff signal.
// - Keep route consumption stable.
// - Keep runtime import safe.
//
// Baseline locks:
// - Target solid-surface land ratio: 0.292.
// - Target band: 0.270–0.310.
// - Liquid water remains approximately Earth-compatible.
// - Hydration remains active.
// - Climate conduit remains active.
// - Fallback samples remain zero.
//
// Hard locks:
// - No DOM mutation.
// - No route rendering.
// - No camera control.
// - No zoom control.
// - No spin control.
// - No external static imports.
// - No ecology.
// - No foliage.
// - No trees.
// - No vegetation.
// - No animals.
// - No marine life.
// - No construct civilization.
// - No graphic box.
// - No image generation.
// - No visual pass claim.

const RECEIPT = "AUDRALIA_RUNTIME_ALLOW_TECTONICS_TOPOLOGY_TERRAIN_HYDRATION_SURFACE_TNT_v1";
const ACTIVE_RENEWAL = "AUDRALIA_G6_SURFACE_SAMPLING_AND_TERRAIN_REFINEMENT_TNT_v1";
const IMPORT_SAFE_RENEWAL = "AUDRALIA_RUNTIME_IMPORT_SAFE_TOPOLOGY_ALIGNMENT_STABILIZER_TNT_v1";
const LAND_RATIO_ALIGNMENT = "AUDRALIA_TOPOLOGY_RUNTIME_EARTH_EQUIVALENT_LAND_RATIO_ALIGNMENT_TNT_v1";
const DIAGNOSTIC_RENEWAL = "AUDRALIA_RUNTIME_ROUTE_COMPAT_SURFACE_DIAGNOSTIC_RENEWAL_TNT_v2";

const PREVIOUS_RECEIPTS = Object.freeze([
  IMPORT_SAFE_RENEWAL,
  LAND_RATIO_ALIGNMENT,
  DIAGNOSTIC_RENEWAL,
  "AUDRALIA_RUNTIME_CLIMATE_CONDUIT_ALIGNMENT_TNT_v1",
  "AUDRALIA_RUNTIME_IMPORT_STABILIZER_TNT_v1",
  "AUDRALIA_RUNTIME_CONSUME_HYDRATION_AFTER_TERRAIN_TNT_v1"
]);

const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G6_RUNTIME_SURFACE_SAMPLING_TERRAIN_EXPRESSION";
const FILE = "/assets/audralia/audralia.runtime.js";

const TARGET_LAND_RATIO = 0.292;
const TARGET_MIN = 0.270;
const TARGET_MAX = 0.310;

const CONTRACTS = Object.freeze({
  runtime: RECEIPT,
  activeRenewal: ACTIVE_RENEWAL,
  importSafeRenewal: IMPORT_SAFE_RENEWAL,
  landRatioAlignment: LAND_RATIO_ALIGNMENT,
  diagnosticRenewal: DIAGNOSTIC_RENEWAL,
  topologyChild: "AUDRALIA_TOPOLOGY_EARTH_EQUIVALENT_EXPOSED_LAND_RATIO_TNT_v1",
  topologyCompatibility: "AUDRALIA_TECTONICS_TOPOLOGY_CHILD_FOOTPRINT_AUTHORITY_TNT_v1",
  terrainGrandchild: "AUDRALIA_TECTONICS_TOPOLOGY_TERRAIN_GRANDCHILD_RELIEF_TNT_v1",
  terrainExpression: ACTIVE_RENEWAL,
  climateInvariant: "AUDRALIA_CLIMATE_INVARIANT_HYDRATION_CONDUIT_TNT_v1",
  hydrationParent: "AUDRALIA_HYDRATION_PARENT_TECTONIC_GENEALOGY_ALIGNMENT_TNT_v1",
  oceansChild: "AUDRALIA_HYDRATION_OCEANS_CHILD_TURQUOISE_DEPTH_GRADIENT_TNT_v1",
  routeExpected: "AUDRALIA_ROUTE_CONSUME_CURRENT_RUNTIME_GENEALOGY_SURFACE_TNT_v1"
});

const AUTHORITY_PATHS = Object.freeze({
  runtime: "/assets/audralia/audralia.runtime.js",
  tectonicsParent: "/assets/audralia/audralia/tectonics/render.js",
  topologyChild: "/assets/audralia/audralia/tectonics/topology/render.js",
  terrainGrandchild: "/assets/audralia/audralia/tectonics/topology/terrain.render.js",
  climateInvariant: "/assets/audralia/audralia.climate.render.js",
  hydrationParent: "/assets/audralia/audralia/hydration/render.js",
  oceansChild: "/assets/audralia/audralia/hydration/oceans.render.js",
  routeExpected: "/showroom/globe/audralia/index.js"
});

const DEFAULTS = Object.freeze({
  fieldWidth: 384,
  fieldHeight: 192,
  minFieldWidth: 96,
  minFieldHeight: 48,
  maxFieldWidth: 512,
  maxFieldHeight: 256,

  targetLandRatio: TARGET_LAND_RATIO,
  coastalWidth: 0.052,
  shelfWidth: 0.158,
  reliefStrength: 1.0,
  ridgeStrength: 0.92,
  canyonStrength: 0.86,
  cliffStrength: 0.88,
  beachStrength: 0.90,
  hydrationStrength: 0.86,
  climateHydrationWeight: 0.42
});

const LAND_BODIES = Object.freeze([
  { id: 1, key: "western_mainland", name: "Western Mainland", lon: -0.42, lat: 0.05, rx: 0.62, ry: 0.34, weight: 1.10 },
  { id: 2, key: "eastern_mainland", name: "Eastern Mainland", lon: 0.36, lat: -0.04, rx: 0.58, ry: 0.32, weight: 1.04 },
  { id: 3, key: "northern_highland", name: "Northern Highland Mass", lon: -0.02, lat: 0.52, rx: 0.50, ry: 0.22, weight: 0.84 },
  { id: 4, key: "southern_weathered_arc", name: "Southern Weathered Arc", lon: 0.20, lat: -0.55, rx: 0.56, ry: 0.22, weight: 0.82 },
  { id: 5, key: "far_west_lobe", name: "Far West Lobe", lon: -0.86, lat: -0.18, rx: 0.28, ry: 0.26, weight: 0.68 },
  { id: 6, key: "far_east_lobe", name: "Far East Lobe", lon: 0.84, lat: 0.12, rx: 0.30, ry: 0.24, weight: 0.68 },
  { id: 7, key: "north_polar_land", name: "North Polar Land", lon: 0.00, lat: 0.91, rx: 0.94, ry: 0.10, weight: 0.64 },
  { id: 8, key: "south_polar_land", name: "South Polar Land", lon: 0.00, lat: -0.91, rx: 0.94, ry: 0.11, weight: 0.68 }
]);

let sharedRuntime = null;
let lightweightStatus = null;

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function mix(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

function fract(value) {
  return value - Math.floor(value);
}

function hash2(x, y, seed) {
  return fract(Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123);
}

function noise2(x, y, seed) {
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
    total += noise2(x * frequency, y * frequency, seed + i * 31.17) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return total / Math.max(0.00001, normalizer);
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
    lat: 1 - v * 2,
    absLat: Math.abs(1 - v * 2)
  });
}

function wrappedLonDistance(a, b) {
  const direct = Math.abs(a - b);
  return Math.min(direct, 2 - direct);
}

function bodyInfluence(point, body) {
  const dx = wrappedLonDistance(point.lon, body.lon) / body.rx;
  const dy = Math.abs(point.lat - body.lat) / body.ry;
  const d = Math.sqrt(dx * dx + dy * dy);

  const edgeNoise = fbm(
    point.lon * 18 + body.id * 3.7,
    point.lat * 18 - body.id * 5.1,
    4100 + body.id * 17,
    3
  );

  const edgeCut = fbm(
    point.lon * 43 + body.id * 2.1,
    point.lat * 43 - body.id * 4.3,
    4140 + body.id * 19,
    3
  );

  const wobble = (edgeNoise - 0.5) * 0.15 + (edgeCut - 0.5) * 0.045;
  return clamp((1.02 - d + wobble) * body.weight, 0, 1);
}

function strongestLandBody(point) {
  let best = LAND_BODIES[0];
  let bestScore = 0;

  for (const body of LAND_BODIES) {
    const score = bodyInfluence(point, body);

    if (score > bestScore) {
      best = body;
      bestScore = score;
    }
  }

  return Object.freeze({ body: best, score: bestScore });
}

function rawLandPotential(point) {
  const broad = fbm(point.lon * 2.6 + 1.4, point.lat * 2.6 - 2.2, 5101, 5);
  const medium = fbm(point.lon * 6.8 - 3.0, point.lat * 6.8 + 1.8, 5113, 4);
  const coast = fbm(point.lon * 14.5 + 4.2, point.lat * 14.5 - 4.4, 5129, 4);
  const detail = fbm(point.lon * 31.0 - 8.3, point.lat * 31.0 + 7.6, 5147, 3);
  const micro = fbm(point.lon * 72.0 + 5.4, point.lat * 72.0 - 11.1, 5153, 2);

  const body = strongestLandBody(point);

  const equatorialConnector =
    clamp(1 - Math.abs(point.lat - 0.02 * Math.sin((point.lon + 0.15) * Math.PI * 3.0)) * 3.2, 0, 1) *
    clamp(1 - Math.abs(point.lon) * 0.35, 0, 1);

  const southernConnector =
    clamp(1 - Math.abs(point.lat + 0.38 + 0.08 * Math.sin((point.lon - 0.2) * Math.PI * 2.0)) * 4.8, 0, 1) *
    clamp(1 - Math.abs(point.lon - 0.10) * 0.55, 0, 1);

  const northernConnector =
    clamp(1 - Math.abs(point.lat - 0.38 - 0.06 * Math.sin((point.lon + 0.32) * Math.PI * 2.0)) * 4.6, 0, 1) *
    clamp(1 - Math.abs(point.lon + 0.04) * 0.52, 0, 1);

  const islandField = Math.max(0, fbm(point.lon * 44.0 + 9.8, point.lat * 44.0 - 6.2, 5161, 3) - 0.58);
  const polarLand = point.absLat > 0.82 ? clamp((point.absLat - 0.82) / 0.18, 0, 1) : 0;

  const tectonicMemory =
    fbm(point.lon * 9.2 - 1.6, point.lat * 9.2 + 5.1, 5179, 4) * 0.40 +
    fbm(point.lon * 18.4 + 2.5, point.lat * 18.4 - 1.7, 5197, 3) * 0.22;

  return clamp(
    body.score * 0.50 +
      broad * 0.12 +
      medium * 0.10 +
      coast * 0.07 +
      detail * 0.04 +
      micro * 0.015 +
      equatorialConnector * 0.08 +
      southernConnector * 0.06 +
      northernConnector * 0.06 +
      islandField * 0.44 +
      polarLand * 0.12 +
      tectonicMemory * 0.12,
    0,
    1
  );
}

function thresholdForTarget(potentials, targetRatio) {
  const sorted = Array.from(potentials).sort((a, b) => b - a);
  const target = clamp(Number(targetRatio) || TARGET_LAND_RATIO, 0.05, 0.60);
  const index = clamp(Math.floor(sorted.length * target), 0, sorted.length - 1);
  return sorted[index];
}

function classifyDepth(depth) {
  if (depth > 0.82) return "trench_ocean";
  if (depth > 0.60) return "deep_ocean";
  if (depth > 0.34) return "open_ocean";
  if (depth > 0.16) return "shelf_water";
  return "nearshore_water";
}

function surfaceClassIdFor(surfaceClass) {
  if (surfaceClass === "polar_ice_footprint") return 12;
  if (surfaceClass === "beach_outline_land") return 8;
  if (surfaceClass === "topology_land_footprint") return 7;
  if (surfaceClass === "nearshore_shelf_void") return 5;
  if (surfaceClass === "trench_ocean") return 4;
  if (surfaceClass === "deep_ocean") return 3;
  if (surfaceClass === "open_ocean") return 2;
  if (surfaceClass === "nearshore_water") return 1;
  return 0;
}

function getRuntimeOptions(options = {}) {
  return Object.freeze({
    fieldWidth: normalizeDimension(
      options.fieldWidth || options.width,
      DEFAULTS.fieldWidth,
      DEFAULTS.minFieldWidth,
      DEFAULTS.maxFieldWidth
    ),
    fieldHeight: normalizeDimension(
      options.fieldHeight || options.height,
      DEFAULTS.fieldHeight,
      DEFAULTS.minFieldHeight,
      DEFAULTS.maxFieldHeight
    ),

    targetLandRatio: clamp(Number(options.targetLandRatio) || DEFAULTS.targetLandRatio, 0.18, 0.42),
    coastalWidth: clamp(Number(options.coastalWidth) || DEFAULTS.coastalWidth, 0.025, 0.12),
    shelfWidth: clamp(Number(options.shelfWidth) || DEFAULTS.shelfWidth, 0.08, 0.24),

    reliefStrength: clamp(Number(options.reliefStrength) || DEFAULTS.reliefStrength, 0.25, 1.15),
    ridgeStrength: clamp(Number(options.ridgeStrength) || DEFAULTS.ridgeStrength, 0.25, 1.15),
    canyonStrength: clamp(Number(options.canyonStrength) || DEFAULTS.canyonStrength, 0.20, 1.10),
    cliffStrength: clamp(Number(options.cliffStrength) || DEFAULTS.cliffStrength, 0.20, 1.10),
    beachStrength: clamp(Number(options.beachStrength) || DEFAULTS.beachStrength, 0.25, 1.10),
    hydrationStrength: clamp(Number(options.hydrationStrength) || DEFAULTS.hydrationStrength, 0.30, 1),
    climateHydrationWeight: clamp(Number(options.climateHydrationWeight) || DEFAULTS.climateHydrationWeight, 0.20, 0.72),

    g6SurfaceSamplingActive: true,
    climateActiveInvariant: true,
    climateConducesHydration: true,
    climateVisible: false,

    hydrationHeld: false,
    hydrationAllowedToRender: true,
    topologyLandControlsLandPreservation: true,
    hydrationCannotEraseTopologyLand: true,
    oceansMayFillOnlyTopologyVoid: true,

    ecologyEnabled: false,
    foliageEnabled: false,
    treesEnabled: false,
    vegetationEnabled: false,
    animalsEnabled: false,
    marineLifeEnabled: false,
    constructCivilizationEnabled: false,
    visualPassClaimed: false
  });
}

function classifyTopology(point, potential, threshold, options) {
  const margin = potential - threshold;
  const bodyResult = strongestLandBody(point);

  const topologyLand = margin >= 0;
  const isPolarIce = topologyLand && point.absLat > 0.875;
  const isSouthPolarIce = isPolarIce && point.lat < 0;
  const isNorthPolarIce = isPolarIce && point.lat > 0;
  const visibleLand = topologyLand && !isPolarIce;

  const coastalWidth = options.coastalWidth;
  const shelfWidth = options.shelfWidth;

  const isBeach = visibleLand && margin <= coastalWidth;
  const isShelf = !topologyLand && margin > -shelfWidth;

  const depth = topologyLand
    ? 0
    : clamp(Math.abs(margin) * 1.85 + (1 - potential) * 0.22, 0, 1);

  const shorelinePressure = clamp(1 - Math.abs(margin) / Math.max(0.001, coastalWidth * 2.4), 0, 1);
  const beachOutlinePressure = visibleLand ? clamp(1 - margin / Math.max(0.001, coastalWidth), 0, 1) : 0;

  const surfaceClass = isPolarIce
    ? "polar_ice_footprint"
    : visibleLand && isBeach
      ? "beach_outline_land"
      : visibleLand
        ? "topology_land_footprint"
        : isShelf
          ? "nearshore_shelf_void"
          : classifyDepth(depth);

  const mineral = fbm(point.lon * 22.0 - 5.5, point.lat * 22.0 + 6.1, 6217, 3);
  const stress = fbm(point.lon * 10.4 + 2.0, point.lat * 10.4 - 3.2, 6203, 4);
  const fracture = fbm(point.lon * 38.0 + 1.6, point.lat * 38.0 - 1.9, 6233, 3);

  const diamondPressureIndex = clamp(stress * 0.46 + mineral * 0.32 + shorelinePressure * 0.12, 0, 1);
  const opalSeamIndex = clamp((1 - stress) * 0.28 + mineral * 0.38 + beachOutlinePressure * 0.16, 0, 1);
  const graniteCratonIndex = clamp(potential * 0.42 + stress * 0.28, 0, 1);
  const slateFoldBeltIndex = clamp(stress * 0.36 + shorelinePressure * 0.24 + fracture * 0.10, 0, 1);
  const exposedMineralHardnessIndex = clamp(
    diamondPressureIndex * 0.32 +
      graniteCratonIndex * 0.30 +
      slateFoldBeltIndex * 0.22,
    0,
    1
  );

  const terrainRisePermission = visibleLand
    ? clamp(margin * 2.6 + potential * 0.42 + stress * 0.18 + fracture * 0.06, 0, 1)
    : 0;

  const body = bodyResult.body;

  return Object.freeze({
    receipt: CONTRACTS.topologyChild,
    activeContract: CONTRACTS.topologyChild,
    compatibilityReceipt: CONTRACTS.topologyCompatibility,

    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,
    absLat: point.absLat,

    landPotential: potential,
    calibratedSeaLevelThreshold: threshold,
    seaLevelThreshold: threshold,
    seaLevelBoundary: threshold,
    seaLevelDistance: margin,

    targetLandRatio: TARGET_LAND_RATIO,
    targetLandRatioMin: TARGET_MIN,
    targetLandRatioMax: TARGET_MAX,
    earthEquivalentLandRatioEnforced: true,

    isLandFootprint: visibleLand,
    isAboveWaterLandFootprint: visibleLand,
    topologyLandFootprint: topologyLand,
    isVoidFootprint: !topologyLand && !isPolarIce,
    isWaterFootprint: !topologyLand && !isPolarIce,
    isPolarIceFootprint: isPolarIce,
    isSouthPolarIceFootprint: isSouthPolarIce,
    isNorthPolarIceFootprint: isNorthPolarIce,

    isBeach,
    isSand: isBeach,
    isRock: visibleLand && !isBeach && exposedMineralHardnessIndex > 0.44,
    isShelf,
    isCoastline: shorelinePressure > 0.32,
    isIslandFootprint: visibleLand && bodyResult.score < 0.42,
    isConnectedLandSystem: visibleLand && bodyResult.score >= 0.32,
    isSmallContinentFootprint: visibleLand && body.id >= 3 && body.id <= 6,

    surfaceClass,
    topologySurfaceClass: surfaceClass,
    surfaceClassId: surfaceClassIdFor(surfaceClass),

    landBodyId: visibleLand || isPolarIce ? body.id : 0,
    landBodyKey: visibleLand || isPolarIce ? body.key : "void_ocean",
    landBodyName: visibleLand || isPolarIce ? body.name : "Void / Ocean Footprint",

    terrainRisePermission,
    terrainBlockPermission: visibleLand ? 0 : 1,
    terrainSeedClass: visibleLand ? "topology_land_rise_allowed" : "void_no_rise",

    oceanDepthIndex: depth,
    bathymetryBlueprintIndex: topologyLand ? 0 : clamp(depth * 0.78 + (1 - potential) * 0.10, 0, 1),
    basinDepthIndex: depth,
    trenchDepthIndex: topologyLand ? 0 : clamp(depth * fbm(point.lon * 8.0, point.lat * 8.0, 6301, 3), 0, 1),
    shelfDepthIndex: isShelf ? clamp(1 - depth, 0, 1) : 0,
    reefShelfPermission: isShelf ? clamp(1 - depth * 0.70, 0, 1) : 0,
    depthClassKey: topologyLand ? "solid_surface" : surfaceClass,
    oceanDepthClass: topologyLand ? "solid_surface" : surfaceClass,

    subterraneanDepthIndex: clamp(stress * 0.42 + potential * 0.22, 0, 1),
    foundationDensityIndex: clamp(graniteCratonIndex * 0.42 + diamondPressureIndex * 0.28, 0, 1),
    rockMassBoundaryIndex: clamp(exposedMineralHardnessIndex * 0.50 + shorelinePressure * 0.18, 0, 1),

    shorelinePressure,
    beachPressure: beachOutlinePressure,
    sandPressure: beachOutlinePressure,
    rockPressure: visibleLand ? exposedMineralHardnessIndex : 0,
    coastalCliffPressure: clamp(shorelinePressure * stress * 0.82 + fracture * 0.12, 0, 1),
    seaLevelErosionPressure: clamp(shorelinePressure * 0.62 + fbm(point.lon * 16.0, point.lat * 16.0, 6401, 3) * 0.18, 0, 1),
    cliffBaseCut: clamp(shorelinePressure * stress * 0.64 + fracture * 0.12, 0, 1),
    coastlineIrregularityIndex: clamp(fbm(point.lon * 28.0 + 1.0, point.lat * 28.0 - 2.0, 6417, 4) * 0.58 + shorelinePressure * 0.22, 0, 1),

    beachType:
      isBeach && opalSeamIndex >= diamondPressureIndex
        ? "white_opal_beach_outline"
        : isBeach
          ? "black_diamond_beach_outline"
          : "none",

    blackSandPressure: isBeach ? clamp(diamondPressureIndex * 0.82, 0, 1) : 0,
    whiteSandPressure: isBeach ? clamp(opalSeamIndex * 0.82, 0, 1) : 0,
    opalSoftnessIndex: opalSeamIndex,
    diamondDarkSandIndex: diamondPressureIndex,
    beachCloudSoftnessIndex: isBeach ? clamp(opalSeamIndex * 0.36 + beachOutlinePressure * 0.44, 0, 1) : 0,

    diamondPressureIndex,
    opalSeamIndex,
    graniteCratonIndex,
    slateFoldBeltIndex,
    exposedMineralHardnessIndex,

    beachOutlinePressure,
    beachWaterContactIndex: beachOutlinePressure,
    landPreservationGate: topologyLand,
    visibleLandPreservationGate: topologyLand,

    hydrationMayNotConvertLandToOcean: true,
    terrainMustNotExpandLandArea: true,
    oceansMayFillOnlyTopologyVoid: true,

    fallbackUsed: false,
    visualPassClaimed: false
  });
}

function deriveTerrain(point, topology, options) {
  const land = Boolean(topology.isAboveWaterLandFootprint);
  const ice = Boolean(topology.isPolarIceFootprint);

  const broad = fbm(point.lon * 6.0 + 2.3, point.lat * 6.0 - 7.1, 7231, 4);
  const ridgeNoise = fbm(point.lon * 18.0 + 3.6, point.lat * 18.0 - 2.7, 7201, 4);
  const fineRidge = fbm(point.lon * 42.0 - 8.1, point.lat * 42.0 + 6.6, 7207, 3);
  const channels = fbm(point.lon * 34.0 - 1.2, point.lat * 34.0 + 4.5, 7217, 3);
  const cuts = fbm(point.lon * 76.0 + 11.0, point.lat * 76.0 - 9.2, 7221, 2);
  const crust = fbm(point.lon * 8.0 + 2.0, point.lat * 8.0 - 3.0, 7101, 4);

  const crustalStressIndex = clamp(crust * 0.52 + ridgeNoise * 0.18 + topology.exposedMineralHardnessIndex * 0.10, 0, 1);

  const mountainChainPermission = land
    ? clamp(
        broad * 0.30 +
          ridgeNoise * 0.24 +
          fineRidge * 0.12 +
          crustalStressIndex * 0.24 +
          topology.terrainRisePermission * 0.28,
        0,
        1
      )
    : 0;

  const normalizedElevation = land
    ? clamp(
        topology.terrainRisePermission * 0.38 +
          mountainChainPermission * options.ridgeStrength * 0.28 +
          crustalStressIndex * 0.16 +
          ridgeNoise * 0.10 +
          fineRidge * 0.08,
        0,
        1
      )
    : ice
      ? clamp(0.52 + topology.absLat * 0.20 + ridgeNoise * 0.08, 0, 1)
      : -clamp(topology.oceanDepthIndex || topology.bathymetryBlueprintIndex || 0.48, 0, 1);

  const ridge = land
    ? clamp(mountainChainPermission * 0.56 + ridgeNoise * 0.20 + fineRidge * 0.18, 0, 1)
    : ice
      ? clamp(0.44 + ridgeNoise * 0.18 + topology.absLat * 0.16, 0, 1)
      : 0;

  const canyonPressure = land
    ? clamp((Math.max(0, channels - 0.42) * 0.70 + cuts * 0.18 + crustalStressIndex * 0.16) * options.canyonStrength, 0, 1)
    : 0;

  const cliffPressure = land || topology.isCoastline
    ? clamp((topology.coastalCliffPressure * 0.54 + crustalStressIndex * 0.20 + topology.shorelinePressure * 0.18) * options.cliffStrength, 0, 1)
    : 0;

  const basin = land
    ? clamp((1 - normalizedElevation) * 0.32 + broad * 0.18 + (1 - ridge) * 0.08, 0, 1)
    : clamp(topology.oceanDepthIndex * 0.76, 0, 1);

  const riverbedPressure = land ? clamp(canyonPressure * 0.46 + channels * 0.28 + topology.shorelinePressure * 0.10, 0, 1) : 0;
  const streamPressure = land ? clamp(riverbedPressure * 0.62 + cuts * 0.18, 0, 1) : 0;
  const lakeBasinPressure = land ? clamp(basin * 0.52 + (1 - ridge) * 0.18, 0, 1) : 0;
  const glacierSeatPressure = ice ? 0.88 : land && Math.abs(point.lat) > 0.66 ? clamp((Math.abs(point.lat) - 0.66) / 0.34, 0, 1) * 0.52 : 0;
  const valleyChannelPressure = land ? clamp(canyonPressure * 0.56 + riverbedPressure * 0.24 + cuts * 0.08, 0, 1) : 0;

  return Object.freeze({
    receipt: CONTRACTS.terrainGrandchild,
    expressionReceipt: ACTIVE_RENEWAL,

    isLand: land,
    isWater: !land && !ice,
    isIce: ice,

    normalizedElevation,
    elevationMeters: land ? Math.round(normalizedElevation * 9400) : ice ? Math.round(normalizedElevation * 6400) : Math.round(normalizedElevation * 5600),

    crustalStressIndex,
    ridge,
    mountainPressure: ridge,
    mountainChainPermission,
    basin,
    slope: land ? clamp(ridge * 0.38 + canyonPressure * 0.24 + cliffPressure * 0.18, 0, 1) : ice ? clamp(ridge * 0.24, 0, 1) : 0,
    canyonPressure,
    canyonPermission: canyonPressure,
    cliffPressure,
    cliffPermission: cliffPressure,
    upliftPermission: land ? clamp(ridge * 0.40 + topology.terrainRisePermission * 0.20, 0, 1) : 0,
    terrainPressureHandoff: land ? clamp(ridge * 0.40 + canyonPressure * 0.22 + topology.terrainRisePermission * 0.20, 0, 1) : 0,

    riverIncisionPressure: land ? clamp(canyonPressure * 0.62, 0, 1) : 0,
    valleyChannelPressure,
    riverbedPressure,
    streamPressure,
    lakeBasinPressure,
    glacierSeatPressure,
    snowpackSourcePressure: glacierSeatPressure,
    floodplainPressure: land ? clamp(riverbedPressure * (1 - ridge) * 0.58, 0, 1) : 0,
    deltaReceiverPressure: land && topology.isCoastline ? clamp(riverbedPressure * topology.shorelinePressure * 0.72, 0, 1) : 0,
    hydrologyReadinessIndex: land || ice
      ? clamp(
          riverbedPressure * 0.22 +
            streamPressure * 0.14 +
            lakeBasinPressure * 0.18 +
            glacierSeatPressure * 0.18 +
            valleyChannelPressure * 0.16 +
            topology.beachOutlinePressure * 0.12,
          0,
          1
        )
      : 0,

    g6SurfaceSamplingActive: true,
    terrainExpressionActive: true,
    ownsLandFootprint: false,
    ownsHydration: false,
    ownsClimate: false,
    visualPassClaimed: false
  });
}

function deriveClimate(point, topology, terrain) {
  const latitudeCooling = clamp(Math.abs(point.lat), 0, 1);
  const oceanInfluence = topology.topologyLandFootprint ? 0.28 : 0.82;
  const elevationCooling = terrain.isLand || terrain.isIce ? clamp(terrain.normalizedElevation * 0.38, 0, 0.38) : 0;

  const circulation = fbm(point.lon * 4.0 + 1.0, point.lat * 4.0 - 2.0, 8101, 4);
  const rainfallNoise = fbm(point.lon * 9.0 - 3.0, point.lat * 9.0 + 4.0, 8117, 4);

  const temperatureIndex = clamp(0.72 - latitudeCooling * 0.46 - elevationCooling + oceanInfluence * 0.08, 0, 1);
  const pressureIndex = clamp(0.48 + circulation * 0.34 + oceanInfluence * 0.08, 0, 1);
  const windCorridorIndex = clamp(circulation * 0.58 + Math.abs(point.lat) * 0.16, 0, 1);
  const rainfallTendency = clamp(rainfallNoise * 0.52 + oceanInfluence * 0.34 + terrain.slope * 0.08, 0, 1);
  const evaporationTendency = clamp(temperatureIndex * 0.46 + oceanInfluence * 0.28, 0, 1);
  const snowPermission = clamp(latitudeCooling * 0.68 + elevationCooling * 0.52 - temperatureIndex * 0.18, 0, 1);
  const glacierPermission = clamp(latitudeCooling * 0.72 + terrain.glacierSeatPressure * 0.38, 0, 1);
  const oceanCycleInfluence = clamp(oceanInfluence * 0.78 + circulation * 0.16, 0, 1);
  const hydrationConductionIndex = clamp(rainfallTendency * 0.42 + oceanCycleInfluence * 0.36 + pressureIndex * 0.12, 0, 1);

  return Object.freeze({
    receipt: CONTRACTS.climateInvariant,
    climateActive: true,
    climateInvariant: true,
    climateConducesHydration: true,
    climateVisible: false,
    climateDoesNotRender: true,
    climateFallbackUsed: false,

    temperatureIndex,
    temperatureBand: temperatureIndex < 0.32 ? "cold" : temperatureIndex > 0.68 ? "warm" : "temperate",
    pressureIndex,
    pressureBand: pressureIndex > 0.62 ? "high_circulation" : "stable",
    windCorridorIndex,
    windBand: windCorridorIndex > 0.64 ? "strong_corridor" : "moderate_corridor",
    rainfallTendency,
    rainfallBand: rainfallTendency > 0.62 ? "wet" : rainfallTendency < 0.34 ? "dry" : "balanced",
    evaporationTendency,
    snowPermission,
    glacierPermission,
    oceanCycleInfluence,
    hydrationConductionIndex,
    breathableEnvelopeIndex: 0.96,
    cleanAtmosphereIndex: 0.96,
    visualPassClaimed: false
  });
}

function oceanClassFor(depth, shelf, coastal, trench) {
  if (trench > 0.56 || depth > 0.82) return "trench_water";
  if (depth > 0.62) return "deep_ocean_water";
  if (shelf > 0.34) return "shelf_water";
  if (coastal > 0.34) return "coastal_water";
  return "ocean_water";
}

function deriveHydration(point, topology, terrain, climate, options) {
  const land = Boolean(topology.isAboveWaterLandFootprint);
  const topologyLand = Boolean(topology.topologyLandFootprint);
  const ice = Boolean(topology.isPolarIceFootprint);
  const oceanVoid = !topologyLand && !ice;

  const coastal = clamp(topology.shorelinePressure || topology.beachWaterContactIndex || 0, 0, 1);
  const shelf = clamp(topology.shelfDepthIndex || topology.reefShelfPermission || 0, 0, 1);
  const depth = clamp(topology.oceanDepthIndex || topology.bathymetryBlueprintIndex || 0, 0, 1);
  const trench = clamp(topology.trenchDepthIndex || depth * 0.24, 0, 1);

  const rainfallBias = clamp(climate.rainfallTendency, 0, 1);
  const snowBias = clamp(climate.snowPermission, 0, 1);
  const glacierBias = clamp(climate.glacierPermission, 0, 1);
  const oceanCycleBias = clamp(climate.oceanCycleInfluence, 0, 1);
  const evaporationBias = clamp(climate.evaporationTendency, 0, 1);
  const climateBoost = clamp(climate.hydrationConductionIndex, 0, 1);

  const climateWeight = options.climateHydrationWeight;

  const river = land ? clamp(terrain.riverbedPressure * options.hydrationStrength + rainfallBias * climateWeight * 0.24, 0, 1) : 0;
  const stream = land ? clamp(terrain.streamPressure * options.hydrationStrength + rainfallBias * climateWeight * 0.16, 0, 1) : 0;
  const lake = land ? clamp(terrain.lakeBasinPressure * options.hydrationStrength + rainfallBias * climateWeight * 0.20 - evaporationBias * 0.08, 0, 1) : 0;
  const glacier = ice ? clamp(0.68 + glacierBias * 0.28, 0, 1) : clamp(terrain.glacierSeatPressure * options.hydrationStrength + glacierBias * 0.28, 0, 1);
  const snowpack = ice ? clamp(0.62 + snowBias * 0.30, 0, 1) : clamp(terrain.snowpackSourcePressure * 0.76 + snowBias * 0.24, 0, 1);
  const floodplain = land ? clamp(terrain.floodplainPressure * 0.78 + rainfallBias * 0.10, 0, 1) : 0;
  const delta = land ? clamp(terrain.deltaReceiverPressure * 0.82 + coastal * rainfallBias * 0.12, 0, 1) : 0;
  const spring = land ? clamp(terrain.crustalStressIndex * terrain.valleyChannelPressure * 0.38 + climateBoost * 0.08, 0, 1) : 0;
  const subterranean = topologyLand ? clamp(topology.subterraneanDepthIndex * 0.58 + terrain.crustalStressIndex * 0.18 + rainfallBias * 0.08, 0, 1) : clamp(depth * 0.22, 0, 1);

  const oceanClass = oceanClassFor(depth, shelf, coastal + oceanCycleBias * 0.18, trench);

  const waterClass = ice
    ? "glacier_mass"
    : oceanVoid
      ? oceanClass
      : lake > 0.52
        ? "lake_fill"
        : river > 0.46
          ? "river_flow"
          : stream > 0.42
            ? "stream_flow"
            : floodplain > 0.40
              ? "floodplain_wetland"
              : delta > 0.34
                ? "delta_wetland"
                : spring > 0.28
                  ? "spring_seep"
                  : "dry_land";

  const isOceanWater =
    waterClass === "ocean_water" ||
    waterClass === "coastal_water" ||
    waterClass === "shelf_water" ||
    waterClass === "deep_ocean_water" ||
    waterClass === "trench_water";

  const surfaceWaterIndex = clamp(
    (isOceanWater ? 0.60 + depth * 0.18 + shelf * 0.10 + coastal * 0.12 + oceanCycleBias * 0.10 : 0) +
      river * 0.42 +
      stream * 0.26 +
      lake * 0.52 +
      glacier * 0.54 +
      floodplain * 0.22 +
      delta * 0.20,
    0,
    1
  );

  const coastalTurquoiseIndex = oceanVoid ? clamp(coastal * 0.66 + shelf * 0.30 + oceanCycleBias * 0.18, 0, 1) : 0;
  const visibleWaterDepthIndex = oceanVoid ? clamp(depth * 0.74 + trench * 0.24, 0, 1) : 0;

  const hydrationColorInfluence = isOceanWater
    ? Object.freeze({
        r: Math.round(mix(10, 44, coastalTurquoiseIndex)),
        g: Math.round(mix(68, 162, coastalTurquoiseIndex)),
        b: Math.round(mix(132, 216, coastalTurquoiseIndex)),
        a: clamp(0.62 + surfaceWaterIndex * 0.30, 0, 0.96)
      })
    : waterClass === "lake_fill"
      ? Object.freeze({ r: 36, g: 124, b: 184, a: clamp(0.28 + lake * 0.48, 0, 0.84) })
      : waterClass === "river_flow" || waterClass === "stream_flow"
        ? Object.freeze({ r: 58, g: 156, b: 214, a: clamp(0.18 + river * 0.40 + stream * 0.28, 0, 0.72) })
        : waterClass === "glacier_mass"
          ? Object.freeze({ r: 224, g: 242, b: 250, a: clamp(0.38 + glacier * 0.46, 0, 0.92) })
          : null;

  return Object.freeze({
    receipt: CONTRACTS.hydrationParent,
    oceansReceipt: CONTRACTS.oceansChild,
    climateReceipt: CONTRACTS.climateInvariant,

    waterClass,
    visualHydrationClass: waterClass,

    isHydrated: waterClass !== "dry_land",
    isOceanWater,
    isCoastalWater: waterClass === "coastal_water",
    isShelfWater: waterClass === "shelf_water",
    isDeepOcean: waterClass === "deep_ocean_water",
    isTrenchWater: waterClass === "trench_water",
    isRiver: waterClass === "river_flow",
    isStream: waterClass === "stream_flow",
    isLake: waterClass === "lake_fill",
    isGlacier: waterClass === "glacier_mass",
    isSnowpack: snowpack > 0.44,
    isFloodplain: waterClass === "floodplain_wetland",
    isDelta: waterClass === "delta_wetland",
    isSpring: waterClass === "spring_seep",
    isSubterraneanWater: subterranean > 0.34,

    oceanActive: isOceanWater,
    oceanClass: isOceanWater ? waterClass : "not_ocean",
    oceanDepthIndex: oceanVoid ? depth : 0,
    visibleWaterDepthIndex,
    waterVisibilityIndex: isOceanWater ? clamp(0.58 + visibleWaterDepthIndex * 0.36, 0, 1) : 0,
    coastalTurquoiseIndex,
    coastalShelfBlueIndex: oceanVoid ? clamp(shelf * 0.70 + coastal * 0.24 + oceanCycleBias * 0.12, 0, 1) : 0,
    shelfWaterIndex: oceanVoid ? shelf : 0,
    openOceanIndex: oceanVoid ? clamp(1 - coastal - shelf * 0.34, 0, 1) : 0,
    deepOceanIndex: oceanVoid ? depth : 0,
    trenchWaterIndex: oceanVoid ? trench : 0,

    bathymetryHydrationIndex: oceanVoid ? clamp(topology.bathymetryBlueprintIndex || depth, 0, 1) : 0,
    trenchHydrationIndex: oceanVoid ? trench : 0,
    shelfPressure: oceanVoid ? shelf : 0,
    coastalWaterPressure: oceanVoid ? coastal : 0,

    beachOutlinePressure: topology.beachOutlinePressure,
    beachContactRimIndex: topology.beachWaterContactIndex,
    beachRimStillVisible: Boolean(topology.isBeach),
    sandCoveredByHydration: false,

    exposedLandAfterSeaLevel: land,
    landStillVisibleAfterHydration: land,
    exposedLandVisibilityIndex: land ? clamp(0.62 + terrain.normalizedElevation * 0.28, 0, 1) : 0,
    exposedLandClass: land
      ? topology.isBeach
        ? "beach_outline_land_preserved_by_runtime"
        : "terrain_land_preserved_by_runtime"
      : ice
        ? "ice_snowpack_solid_surface_preserved_by_runtime"
        : "not_exposed_land",

    surfaceWaterIndex,
    hydrationActivationIndex: clamp(surfaceWaterIndex + subterranean * 0.08 + climateBoost * 0.10, 0, 1),

    riverFlowPressure: river,
    streamFlowPressure: stream,
    lakeFillPressure: lake,
    glacierMassPressure: glacier,
    snowpackPressure: snowpack,
    floodplainWetness: floodplain,
    deltaWetness: delta,
    springSeepPressure: spring,
    subterraneanWaterPressure: subterranean,

    climateRainfallTendency: rainfallBias,
    climateEvaporationTendency: evaporationBias,
    climateSnowPermission: snowBias,
    climateGlacierPermission: glacierBias,
    climateOceanCycleInfluence: oceanCycleBias,
    climateHydrationConductionIndex: climateBoost,

    hydrationColorInfluence,

    ownsHydration: true,
    ownsClimate: false,
    ownsOceansChild: false,
    ownsTopology: false,
    ownsTerrain: false,
    ownsLandFootprint: false,
    visualPassClaimed: false
  });
}

function surfaceClassFor(topology, terrain, hydration) {
  if (topology.isPolarIceFootprint || hydration.isGlacier) return "glacier_ice_snowpack_surface";

  if (topology.isAboveWaterLandFootprint) {
    if (hydration.isLake) return "lake_water_on_land_surface";
    if (hydration.isRiver) return "river_water_on_land_surface";
    if (hydration.isStream) return "stream_water_on_land_surface";
    if (hydration.isFloodplain) return "floodplain_wetland_surface";
    if (hydration.isDelta) return "delta_wetland_surface";
    if (hydration.isSpring) return "spring_seep_land_surface";
    if (topology.isBeach) return "beach_outline_land_surface";
    if (terrain.ridge > 0.52 || terrain.mountainPressure > 0.52) return "mountain_relief_land_surface";
    if (terrain.canyonPressure > 0.50) return "canyon_cut_land_surface";
    if (terrain.cliffPressure > 0.50) return "cliff_rock_land_surface";
    return "inland_terrain_land_surface";
  }

  if (hydration.isTrenchWater) return "trench_ocean_water_surface";
  if (hydration.isDeepOcean) return "deep_ocean_water_surface";
  if (hydration.isShelfWater) return "shelf_water_surface";
  if (hydration.isCoastalWater) return "coastal_turquoise_water_surface";
  if (hydration.isOceanWater) return "ocean_water_surface";

  return "open_ocean_water_surface";
}

function composeSample(point, potential, threshold, options) {
  const topology = classifyTopology(point, potential, threshold, options);
  const terrain = deriveTerrain(point, topology, options);
  const climate = deriveClimate(point, topology, terrain);
  const hydration = deriveHydration(point, topology, terrain, climate, options);

  const landVisibleToRoute = Boolean(topology.isAboveWaterLandFootprint);
  const topologyLand = Boolean(topology.topologyLandFootprint);
  const ice = Boolean(topology.isPolarIceFootprint);
  const liquidWaterVisibleToRoute = Boolean(
    hydration.isOceanWater ||
      hydration.isRiver ||
      hydration.isStream ||
      hydration.isLake ||
      (!topologyLand && !ice)
  );

  const visualSurfaceClass = surfaceClassFor(topology, terrain, hydration);

  return Object.freeze({
    receipt: RECEIPT,
    activeRenewal: ACTIVE_RENEWAL,
    importSafeRenewal: IMPORT_SAFE_RENEWAL,
    diagnosticRenewal: DIAGNOSTIC_RENEWAL,
    landRatioAlignment: LAND_RATIO_ALIGNMENT,
    previousReceipts: PREVIOUS_RECEIPTS,

    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    authorityPaths: AUTHORITY_PATHS,
    contracts: CONTRACTS,

    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,
    absLat: point.absLat,

    physicalGenealogy: "tectonics→topology→terrain",
    environmentalConduit: "climate→hydration",
    runtimeChain: "earth_equivalent_topology→g6_terrain_expression + climate→hydration → runtime→route",

    topologyReceipt: topology.receipt,
    terrainReceipt: terrain.receipt,
    terrainExpressionReceipt: ACTIVE_RENEWAL,
    climateReceipt: climate.receipt,
    hydrationReceipt: hydration.receipt,
    oceansReceipt: hydration.oceansReceipt,

    earthEquivalentLandRatioAligned: true,
    g6SurfaceSamplingActive: true,
    terrainExpressionActive: true,
    targetLandRatio: TARGET_LAND_RATIO,
    targetLandRatioMin: TARGET_MIN,
    targetLandRatioMax: TARGET_MAX,

    visualSurfaceClass,
    visualSurfaceAuthority: "runtime",
    routeShouldPaintFromVisualSurfaceClass: true,

    isLandFootprint: landVisibleToRoute,
    isAboveWaterLandFootprint: landVisibleToRoute,
    isLand: landVisibleToRoute,
    land: landVisibleToRoute,
    isWater: liquidWaterVisibleToRoute,
    isIce: ice,

    topologyLandFootprint: topologyLand,
    topologyLandPreserved: topologyLand,
    solidSurfaceLand: topologyLand,
    landVisibleToRoute,
    waterVisibleToRoute: liquidWaterVisibleToRoute,
    liquidWaterVisibleToRoute,
    isVoidFootprint: !topologyLand && !ice,
    topologyVoidFootprint: !topologyLand && !ice,
    isWaterFootprint: !topologyLand && !ice,

    isBeach: Boolean(topology.isBeach && landVisibleToRoute),
    isSand: Boolean(topology.isSand && landVisibleToRoute),
    isRock: Boolean(topology.isRock && landVisibleToRoute),
    isShelf: Boolean(topology.isShelf),
    isCoastline: Boolean(topology.isCoastline),
    isIslandFootprint: Boolean(topology.isIslandFootprint),
    isConnectedLandSystem: Boolean(topology.isConnectedLandSystem),
    isSmallContinentFootprint: Boolean(topology.isSmallContinentFootprint),

    isPolarIceFootprint: topology.isPolarIceFootprint,
    isSouthPolarIceFootprint: topology.isSouthPolarIceFootprint,
    isNorthPolarIceFootprint: topology.isNorthPolarIceFootprint,

    topologySurfaceClass: topology.topologySurfaceClass,
    surfaceClass: topology.surfaceClass,
    topologySurfaceClassId: topology.surfaceClassId,
    landBodyId: topology.landBodyId,
    landBodyKey: topology.landBodyKey,
    landBodyName: topology.landBodyName,

    seaLevelThreshold: topology.seaLevelThreshold,
    calibratedSeaLevelThreshold: topology.calibratedSeaLevelThreshold,
    seaLevelBoundary: topology.seaLevelBoundary,
    seaLevelDistance: topology.seaLevelDistance,

    oceanDepthIndex: topology.isAboveWaterLandFootprint || topology.isPolarIceFootprint ? 0 : hydration.oceanDepthIndex,
    bathymetryBlueprintIndex: topology.bathymetryBlueprintIndex,
    bathymetryHydrationIndex: hydration.bathymetryHydrationIndex,
    trenchDepthIndex: topology.trenchDepthIndex,
    trenchHydrationIndex: hydration.trenchHydrationIndex,
    shelfDepthIndex: topology.shelfDepthIndex,
    shelfPressure: hydration.shelfPressure,
    basinDepthIndex: topology.basinDepthIndex,
    depthClassKey: topology.depthClassKey,

    subterraneanDepthIndex: topology.subterraneanDepthIndex,
    foundationDensityIndex: topology.foundationDensityIndex,
    rockMassBoundaryIndex: topology.rockMassBoundaryIndex,

    shorelinePressure: topology.shorelinePressure,
    beachPressure: topology.beachPressure,
    sandPressure: topology.sandPressure,
    rockPressure: topology.rockPressure,
    coastalCliffPressure: topology.coastalCliffPressure,
    seaLevelErosionPressure: topology.seaLevelErosionPressure,
    cliffBaseCut: topology.cliffBaseCut,
    coastlineIrregularityIndex: topology.coastlineIrregularityIndex,

    beachType: topology.beachType,
    blackSandPressure: topology.blackSandPressure,
    whiteSandPressure: topology.whiteSandPressure,
    opalSoftnessIndex: topology.opalSoftnessIndex,
    diamondDarkSandIndex: topology.diamondDarkSandIndex,
    beachCloudSoftnessIndex: topology.beachCloudSoftnessIndex,
    beachOutlinePressure: topology.beachOutlinePressure,
    beachWaterContactIndex: topology.beachWaterContactIndex,

    diamondPressureIndex: topology.diamondPressureIndex,
    opalSeamIndex: topology.opalSeamIndex,
    graniteCratonIndex: topology.graniteCratonIndex,
    slateFoldBeltIndex: topology.slateFoldBeltIndex,
    exposedMineralHardnessIndex: topology.exposedMineralHardnessIndex,

    terrainRisePermission: topology.terrainRisePermission,
    terrainBlockPermission: topology.terrainBlockPermission,
    terrainAllowedByTopology: topologyLand,
    terrainMustNotExpandLandArea: true,

    normalizedElevation: terrain.normalizedElevation,
    elevationMeters: terrain.elevationMeters,
    crustalStressIndex: terrain.crustalStressIndex,
    ridge: terrain.ridge,
    mountainPressure: terrain.mountainPressure,
    mountainChainPermission: terrain.mountainChainPermission,
    basin: terrain.basin,
    slope: terrain.slope,
    canyonPressure: terrain.canyonPressure,
    canyonPermission: terrain.canyonPermission,
    cliffPressure: terrain.cliffPressure,
    cliffPermission: terrain.cliffPermission,
    upliftPermission: terrain.upliftPermission,
    terrainPressureHandoff: terrain.terrainPressureHandoff,
    riverIncisionPressure: terrain.riverIncisionPressure,
    valleyChannelPressure: terrain.valleyChannelPressure,
    riverbedPressure: terrain.riverbedPressure,
    streamPressure: terrain.streamPressure,
    lakeBasinPressure: terrain.lakeBasinPressure,
    glacierSeatPressure: terrain.glacierSeatPressure,
    snowpackSourcePressure: terrain.snowpackSourcePressure,
    floodplainPressure: terrain.floodplainPressure,
    deltaReceiverPressure: terrain.deltaReceiverPressure,
    hydrologyReadinessIndex: terrain.hydrologyReadinessIndex,

    climateActive: true,
    climateInvariant: true,
    climateConducesHydration: true,
    climateVisible: false,
    climateDoesNotRender: true,
    temperatureIndex: climate.temperatureIndex,
    temperatureBand: climate.temperatureBand,
    pressureIndex: climate.pressureIndex,
    pressureBand: climate.pressureBand,
    windCorridorIndex: climate.windCorridorIndex,
    windBand: climate.windBand,
    rainfallTendency: climate.rainfallTendency,
    rainfallBand: climate.rainfallBand,
    evaporationTendency: climate.evaporationTendency,
    snowPermission: climate.snowPermission,
    glacierPermission: climate.glacierPermission,
    oceanCycleInfluence: climate.oceanCycleInfluence,
    breathableEnvelopeIndex: climate.breathableEnvelopeIndex,
    cleanAtmosphereIndex: climate.cleanAtmosphereIndex,
    hydrationConductionIndex: climate.hydrationConductionIndex,

    waterClass: hydration.waterClass,
    visualHydrationClass: hydration.visualHydrationClass,

    isHydrated: hydration.isHydrated,
    isOceanWater: hydration.isOceanWater,
    isCoastalWater: hydration.isCoastalWater,
    isShelfWater: hydration.isShelfWater,
    isDeepOcean: hydration.isDeepOcean,
    isTrenchWater: hydration.isTrenchWater,
    isRiver: hydration.isRiver,
    isStream: hydration.isStream,
    isLake: hydration.isLake,
    isGlacier: hydration.isGlacier,
    isSnowpack: hydration.isSnowpack,
    isFloodplain: hydration.isFloodplain,
    isDelta: hydration.isDelta,
    isSpring: hydration.isSpring,
    isSubterraneanWater: hydration.isSubterraneanWater,

    oceanClass: hydration.oceanClass,
    oceanActive: hydration.oceanActive,
    oceanFromHydrationParent: true,
    oceansChildActive: true,
    oceanDoesNotOwnLand: true,
    landPreservedByTopology: true,

    visibleWaterDepthClass: hydration.oceanClass,
    visibleWaterDepthIndex: hydration.visibleWaterDepthIndex,
    waterVisibilityIndex: hydration.waterVisibilityIndex,
    coastalTurquoiseIndex: hydration.coastalTurquoiseIndex,
    coastalShelfBlueIndex: hydration.coastalShelfBlueIndex,
    shelfWaterIndex: hydration.shelfWaterIndex,
    openOceanIndex: hydration.openOceanIndex,
    deepOceanIndex: hydration.deepOceanIndex,
    trenchWaterIndex: hydration.trenchWaterIndex,
    coastalWaterPressure: hydration.coastalWaterPressure,

    beachContactRimIndex: hydration.beachContactRimIndex,
    beachRimStillVisible: hydration.beachRimStillVisible,
    sandCoveredByHydration: false,

    exposedLandAfterSeaLevel: hydration.exposedLandAfterSeaLevel,
    landStillVisibleAfterHydration: hydration.landStillVisibleAfterHydration,
    exposedLandVisibilityIndex: hydration.exposedLandVisibilityIndex,
    exposedLandClass: hydration.exposedLandClass,

    surfaceWaterIndex: hydration.surfaceWaterIndex,
    hydrationActivationIndex: hydration.hydrationActivationIndex,

    riverFlowPressure: hydration.riverFlowPressure,
    streamFlowPressure: hydration.streamFlowPressure,
    lakeFillPressure: hydration.lakeFillPressure,
    glacierMassPressure: hydration.glacierMassPressure,
    snowpackPressure: hydration.snowpackPressure,
    floodplainWetness: hydration.floodplainWetness,
    deltaWetness: hydration.deltaWetness,
    springSeepPressure: hydration.springSeepPressure,
    subterraneanWaterPressure: hydration.subterraneanWaterPressure,

    climateRainfallTendency: hydration.climateRainfallTendency,
    climateEvaporationTendency: hydration.climateEvaporationTendency,
    climateSnowPermission: hydration.climateSnowPermission,
    climateGlacierPermission: hydration.climateGlacierPermission,
    climateOceanCycleInfluence: hydration.climateOceanCycleInfluence,
    climateHydrationConductionIndex: hydration.climateHydrationConductionIndex,

    hydrationColorInfluence: hydration.hydrationColorInfluence,

    runtimeCacheActive: true,
    lowLagSampling: true,
    runtimeCompositeFieldActive: true,
    perPixelChainRecalculation: false,

    fallbackUsed: false,
    fallbackFlags: Object.freeze({
      topologyFallbackUsed: false,
      terrainFallbackUsed: false,
      climateFallbackUsed: false,
      hydrationFallbackUsed: false,
      runtimeFallbackUsed: false
    }),

    ownsRuntimeSampling: true,
    ownsChainComposition: true,
    ownsPerformanceCache: true,
    ownsRouteDataHandoff: true,
    ownsVisualSurfaceClassification: true,

    ownsTopology: false,
    ownsTerrain: false,
    ownsClimate: false,
    ownsHydration: false,
    ownsOceansChild: false,
    ownsLandFootprint: false,
    ownsWaterFill: false,
    ownsRouteRendering: false,

    ecology: false,
    foliage: false,
    trees: false,
    vegetation: false,
    animals: false,
    marineLife: false,
    constructCivilization: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
}

function getRuntimeSampleFromField(field, uInput, vInput) {
  if (!field || !field.samples || !field.width || !field.height) return null;

  const point = normalizeUV(uInput, vInput);
  const x = clamp(Math.round(point.u * (field.width - 1)), 0, field.width - 1);
  const y = clamp(Math.round(point.v * (field.height - 1)), 0, field.height - 1);

  return field.samples[y * field.width + x] || null;
}

function buildRuntimeField(width, height, options) {
  const w = normalizeDimension(width, DEFAULTS.fieldWidth, DEFAULTS.minFieldWidth, DEFAULTS.maxFieldWidth);
  const h = normalizeDimension(height, DEFAULTS.fieldHeight, DEFAULTS.minFieldHeight, DEFAULTS.maxFieldHeight);
  const runtimeOptions = getRuntimeOptions({ ...options, fieldWidth: w, fieldHeight: h });

  const points = new Array(w * h);
  const potentials = new Array(w * h);

  for (let y = 0; y < h; y += 1) {
    const v = h === 1 ? 0.5 : y / (h - 1);

    for (let x = 0; x < w; x += 1) {
      const u = w === 1 ? 0.5 : x / (w - 1);
      const index = y * w + x;
      const point = normalizeUV(u, v);

      points[index] = point;
      potentials[index] = rawLandPotential(point);
    }
  }

  const threshold = thresholdForTarget(potentials, runtimeOptions.targetLandRatio);
  const samples = new Array(w * h);
  const visualSurfaceClasses = new Set();

  let solidSurfaceLandSamples = 0;
  let liquidWaterSamples = 0;
  let waterSamples = 0;
  let landSamples = 0;
  let topologyLandSamples = 0;
  let oceanSamples = 0;
  let coastalSamples = 0;
  let shelfSamples = 0;
  let deepSamples = 0;
  let trenchSamples = 0;
  let visibleLandSamples = 0;
  let iceSamples = 0;
  let beachSamples = 0;
  let terrainReliefSamples = 0;
  let hydratedSamples = 0;
  let fallbackSamples = 0;
  let climateSamples = 0;
  let climateConduitSamples = 0;
  let rainfallSamples = 0;
  let glacierClimateSamples = 0;
  let oceanCycleClimateSamples = 0;

  let maxTurquoise = 0;
  let maxDepth = 0;
  let maxElevation = -1;
  let maxHydrationActivationIndex = 0;
  let maxSurfaceWaterIndex = 0;
  let maxHydrationConduction = 0;
  let maxRainfall = 0;
  let maxEvaporation = 0;

  for (let i = 0; i < samples.length; i += 1) {
    const sample = composeSample(points[i], potentials[i], threshold, runtimeOptions);
    samples[i] = sample;
    visualSurfaceClasses.add(sample.visualSurfaceClass);

    if (sample.solidSurfaceLand) solidSurfaceLandSamples += 1;
    if (sample.liquidWaterVisibleToRoute) liquidWaterSamples += 1;
    if (sample.isWater) waterSamples += 1;
    if (sample.isLandFootprint) landSamples += 1;
    if (sample.topologyLandFootprint) topologyLandSamples += 1;
    if (sample.oceanActive) oceanSamples += 1;
    if (sample.isCoastalWater) coastalSamples += 1;
    if (sample.isShelfWater) shelfSamples += 1;
    if (sample.isDeepOcean) deepSamples += 1;
    if (sample.isTrenchWater) trenchSamples += 1;
    if (sample.landStillVisibleAfterHydration) visibleLandSamples += 1;
    if (sample.isIce || sample.isGlacier || sample.isSnowpack || sample.isPolarIceFootprint) iceSamples += 1;
    if (sample.isBeach) beachSamples += 1;
    if (sample.isHydrated) hydratedSamples += 1;
    if (sample.ridge > 0.34 || sample.canyonPressure > 0.34 || sample.cliffPressure > 0.34) terrainReliefSamples += 1;
    if (sample.fallbackUsed) fallbackSamples += 1;

    if (sample.climateActive) climateSamples += 1;
    if (sample.climateConducesHydration) climateConduitSamples += 1;
    if (sample.rainfallTendency > 0.44) rainfallSamples += 1;
    if (sample.glacierPermission > 0.44) glacierClimateSamples += 1;
    if (sample.oceanCycleInfluence > 0.44) oceanCycleClimateSamples += 1;

    maxTurquoise = Math.max(maxTurquoise, sample.coastalTurquoiseIndex);
    maxDepth = Math.max(maxDepth, sample.visibleWaterDepthIndex);
    maxElevation = Math.max(maxElevation, sample.normalizedElevation);
    maxHydrationActivationIndex = Math.max(maxHydrationActivationIndex, sample.hydrationActivationIndex);
    maxSurfaceWaterIndex = Math.max(maxSurfaceWaterIndex, sample.surfaceWaterIndex);
    maxHydrationConduction = Math.max(maxHydrationConduction, sample.hydrationConductionIndex || 0);
    maxRainfall = Math.max(maxRainfall, sample.rainfallTendency || 0);
    maxEvaporation = Math.max(maxEvaporation, sample.evaporationTendency || 0);
  }

  const total = samples.length;
  const solidSurfaceLandRatio = total ? solidSurfaceLandSamples / total : 0;
  const liquidWaterRatio = total ? liquidWaterSamples / total : 0;
  const waterRatio = total ? waterSamples / total : 0;
  const landRatio = total ? landSamples / total : 0;
  const topologyLandRatio = total ? topologyLandSamples / total : 0;
  const visibleLandRatio = total ? visibleLandSamples / total : 0;
  const iceSolidSurfaceRatio = total ? iceSamples / total : 0;

  return Object.freeze({
    receipt: RECEIPT,
    activeRenewal: ACTIVE_RENEWAL,
    importSafeRenewal: IMPORT_SAFE_RENEWAL,
    diagnosticRenewal: DIAGNOSTIC_RENEWAL,
    landRatioAlignment: LAND_RATIO_ALIGNMENT,
    previousReceipts: PREVIOUS_RECEIPTS,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    width: w,
    height: h,
    samples,
    calibratedSeaLevelThreshold: threshold,

    stats: Object.freeze({
      totalSamples: total,

      solidSurfaceLandSamples,
      liquidWaterSamples,
      waterSamples,
      landSamples,
      topologyLandSamples,
      oceanSamples,
      coastalSamples,
      shelfSamples,
      deepSamples,
      trenchSamples,
      visibleLandSamples,
      exposedTerrainLandSamples: visibleLandSamples,
      iceSamples,
      beachSamples,
      terrainReliefSamples,
      hydratedSamples,
      fallbackSamples,
      climateSamples,
      climateConduitSamples,
      rainfallSamples,
      glacierClimateSamples,
      oceanCycleClimateSamples,

      solidSurfaceLandRatio,
      liquidWaterRatio,
      waterRatio,
      landRatio,
      topologyLandRatio,
      oceanRatio: total ? oceanSamples / total : 0,
      coastalRatio: total ? coastalSamples / total : 0,
      shelfRatio: total ? shelfSamples / total : 0,
      deepRatio: total ? deepSamples / total : 0,
      trenchRatio: total ? trenchSamples / total : 0,
      visibleLandRatio,
      exposedTerrainLandRatio: visibleLandRatio,
      iceSolidSurfaceRatio,
      beachRatio: total ? beachSamples / total : 0,
      terrainReliefRatio: total ? terrainReliefSamples / total : 0,
      hydratedRatio: total ? hydratedSamples / total : 0,
      fallbackRatio: total ? fallbackSamples / total : 0,
      climateRatio: total ? climateSamples / total : 0,
      climateConduitRatio: total ? climateConduitSamples / total : 0,

      targetLandRatio: TARGET_LAND_RATIO,
      targetLandRatioMin: TARGET_MIN,
      targetLandRatioMax: TARGET_MAX,
      solidSurfaceLandRatioTargetMet: solidSurfaceLandRatio >= TARGET_MIN && solidSurfaceLandRatio <= TARGET_MAX,
      landRatioTargetMet: solidSurfaceLandRatio >= TARGET_MIN && solidSurfaceLandRatio <= TARGET_MAX,
      topologyLandRatioTargetMet: topologyLandRatio >= TARGET_MIN && topologyLandRatio <= TARGET_MAX,

      maxTurquoise,
      maxDepth,
      maxElevation,
      maxHydrationActivationIndex,
      maxSurfaceWaterIndex,
      maxHydrationConduction,
      maxRainfall,
      maxEvaporation,

      calibratedSeaLevelThreshold: threshold,
      visualSurfaceClasses: Object.freeze(Array.from(visualSurfaceClasses)),

      g6SurfaceSamplingActive: true,
      terrainExpressionActive: true,
      importSafe: true,
      staticImports: false,
      externalDependencyRequired: false,
      earthEquivalentLandRatioAligned: true,
      topologyLandControlsLandPreservation: true,
      hydrationCannotEraseTopologyLand: true,
      oceansMayFillOnlyTopologyVoid: true,

      climateActive: true,
      climateInvariant: true,
      climateConducesHydration: true,
      climateVisible: false,
      climateDoesNotRender: true,
      hydrationReadsClimate: true,

      runtimeCacheActive: true,
      lowLagSampling: true,
      runtimeCompositeFieldActive: true,
      perPixelChainRecalculation: false,

      ecologyEnabled: false,
      foliageEnabled: false,
      treesEnabled: false,
      vegetationEnabled: false,
      animalsEnabled: false,
      marineLifeEnabled: false,
      constructCivilizationEnabled: false,

      graphicBox: false,
      imageGeneration: false,
      visualPassClaimed: false,
      solidSurfaceAccounting: "visibleTerrainLand + glacierIceSnowpackSolidSurface"
    })
  });
}

function buildRuntimeCache(options) {
  const runtimeField = buildRuntimeField(options.fieldWidth, options.fieldHeight, options);

  return Object.freeze({
    receipt: RECEIPT,
    activeRenewal: ACTIVE_RENEWAL,
    importSafeRenewal: IMPORT_SAFE_RENEWAL,
    diagnosticRenewal: DIAGNOSTIC_RENEWAL,
    landRatioAlignment: LAND_RATIO_ALIGNMENT,
    previousReceipts: PREVIOUS_RECEIPTS,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    authorityPaths: AUTHORITY_PATHS,
    contracts: CONTRACTS,
    runtimeOptions: options,
    runtimeField,

    topologyStatus: Object.freeze({
      ok: true,
      receipt: CONTRACTS.topologyChild,
      compatibilityReceipt: CONTRACTS.topologyCompatibility,
      consumedByRuntime: true,
      earthEquivalentLandRatioEnforced: true,
      path: AUTHORITY_PATHS.topologyChild
    }),

    terrainStatus: Object.freeze({
      ok: true,
      receipt: CONTRACTS.terrainGrandchild,
      expressionReceipt: ACTIVE_RENEWAL,
      consumedByRuntime: true,
      terrainExpressionActive: true,
      ownsLandFootprint: false,
      path: AUTHORITY_PATHS.terrainGrandchild
    }),

    climateStatus: Object.freeze({
      ok: true,
      receipt: CONTRACTS.climateInvariant,
      consumedByRuntime: true,
      climateActive: true,
      climateConducesHydration: true,
      climateVisible: false,
      staticImportRequired: false,
      path: AUTHORITY_PATHS.climateInvariant
    }),

    hydrationStatus: Object.freeze({
      ok: true,
      receipt: CONTRACTS.hydrationParent,
      oceansReceipt: CONTRACTS.oceansChild,
      climateConditioned: true,
      consumedByRuntime: true,
      path: AUTHORITY_PATHS.hydrationParent,
      oceansChildPath: AUTHORITY_PATHS.oceansChild
    }),

    fallbackReport: Object.freeze({
      topologyFallbackUsed: false,
      terrainFallbackUsed: false,
      climateFallbackUsed: false,
      hydrationFallbackUsed: false,
      runtimeFallbackUsed: false,
      fallbackSamples: runtimeField.stats.fallbackSamples,
      fallbackRatio: runtimeField.stats.fallbackRatio
    }),

    importSafe: true,
    staticImports: false,
    externalDependencyRequired: false,
    runtimeCacheActive: true,
    lowLagSampling: true,
    runtimeCompositeFieldActive: true,
    perPixelChainRecalculation: false,
    createdAt: Date.now()
  });
}

function sampleFromRuntimeCache(cache, u, v) {
  return getRuntimeSampleFromField(cache.runtimeField, u, v) || null;
}

function makeStatus(cache = null) {
  const fieldStats = cache && cache.runtimeField ? cache.runtimeField.stats : null;

  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    activeRenewal: ACTIVE_RENEWAL,
    importSafeRenewal: IMPORT_SAFE_RENEWAL,
    diagnosticRenewal: DIAGNOSTIC_RENEWAL,
    landRatioAlignment: LAND_RATIO_ALIGNMENT,
    previousReceipts: PREVIOUS_RECEIPTS,
    status: cache ? "active" : "active-lightweight",
    id: "audralia-runtime-g6-surface-sampling-terrain-expression",
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,

    authorityPaths: AUTHORITY_PATHS,
    contracts: CONTRACTS,

    runtimeFieldLoaded: Boolean(cache && cache.runtimeField),
    topologyLoaded: true,
    terrainLoaded: true,
    climateLoaded: true,
    hydrationLoaded: true,

    runtimeLoadedReceipt: RECEIPT,
    importSafe: true,
    staticImports: false,
    externalDependencyRequired: false,

    topologyStatus: cache ? cache.topologyStatus : null,
    terrainStatus: cache ? cache.terrainStatus : null,
    climateStatus: cache ? cache.climateStatus : null,
    hydrationStatus: cache ? cache.hydrationStatus : null,

    fallbackReport: cache ? cache.fallbackReport : Object.freeze({
      topologyFallbackUsed: false,
      terrainFallbackUsed: false,
      climateFallbackUsed: false,
      hydrationFallbackUsed: false,
      runtimeFallbackUsed: false,
      fallbackSamples: 0,
      fallbackRatio: 0
    }),

    runtimeFieldStats: fieldStats,

    targetLandRatio: TARGET_LAND_RATIO,
    targetLandRatioMin: TARGET_MIN,
    targetLandRatioMax: TARGET_MAX,
    earthEquivalentLandRatioAligned: true,

    g6SurfaceSamplingActive: true,
    terrainExpressionActive: true,
    consumesTopologyChild: true,
    consumesTerrainExpression: true,
    consumesClimateInvariant: true,
    consumesHydrationParent: true,
    oceansChildConsumedThroughHydrationParent: true,

    topologyLandControlsLandPreservation: true,
    hydrationCannotEraseTopologyLand: true,
    oceansMayFillOnlyTopologyVoid: true,

    climateActive: true,
    climateInvariant: true,
    climateConducesHydration: true,
    climateVisible: false,
    climateDoesNotRender: true,
    hydrationReadsClimate: true,

    hydrationHeld: false,
    hydrationAllowedToRender: true,
    emitsVisualSurfaceClass: true,

    ownsRuntimeSampling: true,
    ownsChainComposition: true,
    ownsPerformanceCache: true,
    ownsRouteDataHandoff: true,
    ownsVisualSurfaceClassification: true,

    ownsTopology: false,
    ownsTerrain: false,
    ownsClimate: false,
    ownsHydration: false,
    ownsOceansChild: false,
    ownsLandFootprint: false,
    ownsWaterFill: false,
    ownsRouteRendering: false,

    ecologyEnabled: false,
    foliageEnabled: false,
    treesEnabled: false,
    vegetationEnabled: false,
    animalsEnabled: false,
    marineLifeEnabled: false,
    constructCivilizationEnabled: false,

    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
}

export function createAudraliaRuntime(options = {}) {
  const runtimeOptions = getRuntimeOptions(options);
  const cache = buildRuntimeCache(runtimeOptions);

  const runtime = Object.freeze({
    receipt: RECEIPT,
    activeRenewal: ACTIVE_RENEWAL,
    importSafeRenewal: IMPORT_SAFE_RENEWAL,
    diagnosticRenewal: DIAGNOSTIC_RENEWAL,
    landRatioAlignment: LAND_RATIO_ALIGNMENT,
    previousReceipts: PREVIOUS_RECEIPTS,
    status: "active",
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    authorityPaths: AUTHORITY_PATHS,
    contracts: CONTRACTS,
    runtimeOptions,
    cache,

    sampleRuntimeState(u, v) {
      return sampleFromRuntimeCache(cache, u, v);
    },

    sampleAudraliaPlanetState(u, v) {
      return sampleFromRuntimeCache(cache, u, v);
    },

    getStatus() {
      return makeStatus(cache);
    }
  });

  lightweightStatus = makeStatus(cache);
  return runtime;
}

export function sampleRuntimeState(u, v, context = {}) {
  if (!sharedRuntime) {
    sharedRuntime = createAudraliaRuntime(context);
  }

  return sharedRuntime.sampleRuntimeState(u, v, context);
}

export function sampleAudraliaPlanetState(u, v, context = {}) {
  if (!sharedRuntime) {
    sharedRuntime = createAudraliaRuntime(context);
  }

  return sharedRuntime.sampleAudraliaPlanetState(u, v, context);
}

export function buildAudraliaRuntimeField(width = DEFAULTS.fieldWidth, height = DEFAULTS.fieldHeight, options = {}) {
  const runtimeOptions = getRuntimeOptions({
    ...options,
    fieldWidth: options.fieldWidth || width,
    fieldHeight: options.fieldHeight || height
  });

  return buildRuntimeField(runtimeOptions.fieldWidth, runtimeOptions.fieldHeight, runtimeOptions);
}

export function getRuntimeStatus() {
  return lightweightStatus || makeStatus(null);
}

export function getStatus() {
  return getRuntimeStatus();
}

const api = Object.freeze({
  receipt: RECEIPT,
  activeRenewal: ACTIVE_RENEWAL,
  importSafeRenewal: IMPORT_SAFE_RENEWAL,
  diagnosticRenewal: DIAGNOSTIC_RENEWAL,
  landRatioAlignment: LAND_RATIO_ALIGNMENT,
  previousReceipts: PREVIOUS_RECEIPTS,
  createAudraliaRuntime,
  sampleRuntimeState,
  sampleAudraliaPlanetState,
  buildAudraliaRuntimeField,
  getRuntimeStatus,
  getStatus
});

if (typeof window !== "undefined") {
  window.DGBAudraliaRuntime = api;
  window.AudraliaRuntime = api;
  window.audraliaRuntime = api;
}

export default api;

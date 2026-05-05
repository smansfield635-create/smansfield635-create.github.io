// /assets/audralia/audralia.topology.render.js
// AUDRALIA_G1_TOPOLOGY_LANDMASS_100_PERCENT_EXPANSION_SMALL_CONTINENTS_TNT_v1
//
// Runtime compatibility preserved:
// AUDRALIA_G1_TOPOLOGY_PLANET_BLUEPRINT_AND_SUBTERRANEAN_DEPTH_TNT_v1
//
// Role:
// - Audralia topology blueprint layer.
// - Owns land/void footprint, landmass expansion, island-chain connection,
//   sea-level boundary, shoreline exposure, beaches, sand, rock, coastal cliffs,
//   erosion zones, shelves, bathymetry, ocean basins, trenches, sub-sea depth,
//   subterranean depth, and terrain-rise permissions.
//
// Current pass:
// - Every existing land piece expands by +100% area.
// - Major land bodies use radius scale ≈ sqrt(2).
// - Island arcs expand and nearby islands may merge into small continents.
// - Land expansion is applied first; land-ratio conflict is audited second.
//
// Does not own:
// - terrain elevation
// - mountain height
// - ridges/canyons/valleys as final relief
// - active water
// - hydration
// - climate
// - ecology
// - foliage
// - trees
// - vegetation
// - route shell
// - final render
// - visual pass claim

const ACTIVE_CONTRACT = "AUDRALIA_G1_TOPOLOGY_LANDMASS_100_PERCENT_EXPANSION_SMALL_CONTINENTS_TNT_v1";
const RUNTIME_COMPATIBLE_RECEIPT = "AUDRALIA_G1_TOPOLOGY_PLANET_BLUEPRINT_AND_SUBTERRANEAN_DEPTH_TNT_v1";
const RECEIPT = ACTIVE_CONTRACT;

const PREVIOUS_RECEIPTS = Object.freeze([
  "AUDRALIA_G1_TOPOLOGY_SEA_LEVEL_EARTH_LAND_RATIO_BATHYMETRY_COAST_TNT_v1",
  "AUDRALIA_G1_TOPOLOGY_CONNECTED_LANDFOOTPRINT_AND_IRREGULAR_COAST_TNT_v1",
  "AUDRALIA_G1_TOPOLOGY_PLANET_BLUEPRINT_AND_SUBTERRANEAN_DEPTH_TNT_v1",
  "AUDRALIA_G2_TOPOLOGY_CHILD_FROM_CONFIRMED_TERRAIN_TNT_v1",
  "AUDRALIA_G2_TOPOLOGY_GEOLOGY_TERRAIN_ALIGNMENT_TNT_v1"
]);

const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1_TOPOLOGY_LANDMASS_EXPANSION_SMALL_CONTINENTS";
const FILE = "/assets/audralia/audralia.topology.render.js";
const PARENT_AUTHORITY = "/assets/audralia/audralia.planet.render.js";
const TECTONICS_HANDOFF_TARGET = "/assets/audralia/audralia.tectonics.render.js";
const TERRAIN_HANDOFF_TARGET = "/assets/audralia/audralia.terrain.render.js";

const LAND_EXPANSION_LAW = Object.freeze({
  active: true,
  instruction: "increase_every_existing_land_piece_by_100_percent_area",
  areaMultiplier: 2,
  radiusScaleForAreaDoubling: Math.SQRT2,
  majorLandRadiusScale: Math.SQRT2,
  peninsulaRadiusScale: 1.30,
  islandArcRadiusScale: Math.SQRT2,
  islandArcSpreadScale: 1.18,
  connectionWidthScale: 1.72,
  connectionPressureScale: 1.36,
  shelfExposureScale: 1.28,
  coastlineMustRemainIrregular: true,
  randomNewContinentsAllowed: false,
  existingLandOnly: true,
  islandChainMergePermission: true,
  smallContinentFormationPermission: true,
  terrainMayNotCreateLand: true,
  routeMayNotCreateLand: true,
  hydrationHeld: true,
  foliageClosed: true,
  visualPassClaimed: false
});

const EARTH_LAND_RATIO_LAW = Object.freeze({
  approximateEarthExposedLandRatio: 0.292,
  tolerance: 0.012,
  rule: "earth_equivalent_ratio_remains_audit_target_after_land_expansion_override",
  currentPassMode: "expand_land_first_audit_ratio_second",
  topologyOwnsSeaLevelCorrection: true,
  terrainMayNotExpandLandArea: true,
  tectonicsMayNotExpandLandArea: true,
  routeMayNotExpandLandArea: true,
  runtimeMayNotExpandLandArea: true
});

const SEA_LEVEL_LAW = Object.freeze({
  controller: "topology",
  defaultSeaLevelThreshold: 0.615,
  thresholdMeaning: "higher_threshold_submerges_more_land_lower_threshold_exposes_more_shelf",
  adjustmentMode: "land_expansion_first_ratio_audit_second",
  exposeShelfIfUnderTarget: true,
  submergeMarginIfOverTarget: true,
  hydrationHeld: true
});

const TOPOLOGY_LAW = Object.freeze({
  parentRole: "globe-body-baseline-only",
  topologyRole: "landmass-expansion-sea-level-bathymetry-coast-authority",
  tectonicsRoleLater: "plate-pressure-mineral-memory-authority",
  terrainRoleLater: "above-sea-elevation-and-relief-authority",
  hydrationRoleLater: "water-fill-and-water-behavior-authority",

  ownsTopologyBlueprint: true,
  ownsLandVoidFootprint: true,
  ownsAboveWaterLandFootprint: true,
  ownsLandmassExpansion: true,
  ownsIslandChainConnection: true,
  ownsSmallContinentFormation: true,
  ownsEarthEquivalentLandRatioAudit: true,
  ownsSeaLevelBoundary: true,
  ownsSeaLevelCorrection: true,
  ownsBeachSandRockBoundary: true,
  ownsBlackWhiteMineralBeachLaw: true,
  ownsCoastlineIrregularity: true,
  ownsSeaLevelErosion: true,
  ownsCliffBase: true,
  ownsLandBodyConnections: true,
  ownsIslandSeparation: true,
  ownsBathymetry: true,
  ownsOceanDepths: true,
  ownsSubSeaDepthBlueprint: true,
  ownsSubterraneanBlueprint: true,
  ownsTerrainRisePermissions: true,

  ownsAboveSeaElevation: false,
  ownsTerrainRelief: false,
  ownsMountains: false,
  ownsRidges: false,
  ownsCanyons: false,
  ownsValleys: false,
  ownsHydration: false,
  ownsClimate: false,
  ownsEcology: false,
  ownsFoliage: false,
  ownsTrees: false,
  ownsVegetation: false,
  ownsFauna: false,
  ownsRuntime: false,
  ownsFinalRender: false,
  visualPassClaimed: false,

  noFoliageLaw: "active",
  noTreesLaw: "active",
  noVegetationLaw: "active",
  noActiveWaterLaw: "active",

  terrainMayConsume: true,
  tectonicsMayConsume: true,
  hydrationMayConsumeLater: true,
  foliageMayConsume: false,
  ecologyMayConsume: false
});

const SURFACE_CLASSES = Object.freeze([
  Object.freeze({ id: 0, key: "void_deep_ocean", name: "Void Deep Ocean", role: "ocean/void footprint" }),
  Object.freeze({ id: 1, key: "void_abyssal_basin", name: "Void Abyssal Basin", role: "deep basin floor for later water depth" }),
  Object.freeze({ id: 2, key: "void_trench_axis", name: "Void Trench Axis", role: "narrow sub-sea trench axis" }),
  Object.freeze({ id: 3, key: "void_mid_ocean", name: "Void Mid Ocean", role: "standard underwater void field" }),
  Object.freeze({ id: 4, key: "void_continental_shelf", name: "Void Continental Shelf", role: "shallow shelf near landmass" }),
  Object.freeze({ id: 5, key: "coastal_wet_edge", name: "Coastal Wet Edge", role: "sea-level transition edge" }),
  Object.freeze({ id: 6, key: "beach_sand_band", name: "Beach Sand Band", role: "beach and sand placement" }),
  Object.freeze({ id: 7, key: "coastal_rock_band", name: "Coastal Rock Band", role: "rock, cliff, and hard coastline placement" }),
  Object.freeze({ id: 8, key: "low_land_footprint", name: "Low Land Footprint", role: "land exists; terrain later determines height" }),
  Object.freeze({ id: 9, key: "main_landmass_footprint", name: "Main Landmass Footprint", role: "primary stable land body" }),
  Object.freeze({ id: 10, key: "small_continent_footprint", name: "Small Continent Footprint", role: "merged island-chain land system" }),
  Object.freeze({ id: 11, key: "polar_land_footprint", name: "Polar Land Footprint", role: "north polar land footprint" }),
  Object.freeze({ id: 12, key: "polar_ice_footprint", name: "Polar Ice Footprint", role: "south pole ice-only footprint" }),
  Object.freeze({ id: 13, key: "subterranean_rock_mass", name: "Subterranean Rock Mass", role: "underground rock body and foundation" }),
  Object.freeze({ id: 14, key: "subterranean_cavity_permission", name: "Subterranean Cavity Permission", role: "possible underground void/cavity field" }),
  Object.freeze({ id: 15, key: "terrain_rise_seed", name: "Terrain Rise Seed", role: "topology permits terrain to rise later" })
]);

const DEPTH_CLASSES = Object.freeze([
  Object.freeze({ id: 0, key: "shoreline_wet_edge", name: "Shoreline Wet Edge" }),
  Object.freeze({ id: 1, key: "beach_intertidal_band", name: "Beach Intertidal Band" }),
  Object.freeze({ id: 2, key: "shallow_shelf", name: "Shallow Shelf" }),
  Object.freeze({ id: 3, key: "outer_shelf", name: "Outer Shelf" }),
  Object.freeze({ id: 4, key: "continental_slope", name: "Continental Slope" }),
  Object.freeze({ id: 5, key: "mid_ocean_floor", name: "Mid Ocean Floor" }),
  Object.freeze({ id: 6, key: "deep_ocean_basin", name: "Deep Ocean Basin" }),
  Object.freeze({ id: 7, key: "abyssal_plain", name: "Abyssal Plain" }),
  Object.freeze({ id: 8, key: "trench_axis", name: "Trench Axis" })
]);

const BEACH_TYPES = Object.freeze([
  "white_opal_cloud_sand_beach",
  "black_diamond_sand_beach",
  "mixed_opal_diamond_sand_beach",
  "granite_powder_pale_beach",
  "slate_dark_shingle_beach",
  "rock_cove_beach",
  "cliff_shadow_beach",
  "none"
]);

const LAND_BODIES = Object.freeze([
  Object.freeze({
    id: 1,
    key: "dominant_mainland_footprint",
    name: "Dominant Mainland Footprint",
    role: "largest connected primary landmass footprint expanded by 100 percent area",
    centerLon: -0.08,
    centerLat: 0.00,
    radiusLon: 0.40,
    radiusLat: 0.235,
    angle: -13,
    expansionEligible: true,
    coastlineRoughness: 0.34,
    rockBias: 0.46,
    sandBias: 0.34,
    diamondBias: 0.42,
    opalBias: 0.30,
    graniteBias: 0.50,
    slateBias: 0.42,
    terrainRiseBias: 0.82
  }),
  Object.freeze({
    id: 2,
    key: "western_weathered_body_footprint",
    name: "Western Weathered Body Footprint",
    role: "western landmass expanded and connected by eroded neck and shelf",
    centerLon: -0.62,
    centerLat: -0.02,
    radiusLon: 0.235,
    radiusLat: 0.18,
    angle: 22,
    expansionEligible: true,
    coastlineRoughness: 0.42,
    rockBias: 0.64,
    sandBias: 0.20,
    diamondBias: 0.48,
    opalBias: 0.18,
    graniteBias: 0.68,
    slateBias: 0.50,
    terrainRiseBias: 0.72
  }),
  Object.freeze({
    id: 3,
    key: "eastern_shelf_body_footprint",
    name: "Eastern Shelf Body Footprint",
    role: "eastern shelf-facing landmass expanded and connected by shallow exposed bridge",
    centerLon: 0.56,
    centerLat: 0.03,
    radiusLon: 0.245,
    radiusLat: 0.19,
    angle: -25,
    expansionEligible: true,
    coastlineRoughness: 0.34,
    rockBias: 0.36,
    sandBias: 0.48,
    diamondBias: 0.44,
    opalBias: 0.46,
    graniteBias: 0.40,
    slateBias: 0.52,
    terrainRiseBias: 0.68
  }),
  Object.freeze({
    id: 4,
    key: "southern_archipelago_footprint",
    name: "Southern Archipelago Footprint",
    role: "southern broken land system expanded into small-continent arc",
    centerLon: 0.12,
    centerLat: -0.45,
    radiusLon: 0.335,
    radiusLat: 0.14,
    angle: 9,
    expansionEligible: true,
    coastlineRoughness: 0.46,
    rockBias: 0.56,
    sandBias: 0.26,
    diamondBias: 0.36,
    opalBias: 0.48,
    graniteBias: 0.32,
    slateBias: 0.58,
    terrainRiseBias: 0.58
  }),
  Object.freeze({
    id: 5,
    key: "north_polar_land_footprint",
    name: "North Polar Land Footprint",
    role: "northern polar land footprint expanded with irregular mineral edge",
    centerLon: 0.02,
    centerLat: 0.82,
    radiusLon: 0.42,
    radiusLat: 0.12,
    angle: 0,
    expansionEligible: true,
    coastlineRoughness: 0.30,
    rockBias: 0.72,
    sandBias: 0.08,
    diamondBias: 0.66,
    opalBias: 0.10,
    graniteBias: 0.72,
    slateBias: 0.38,
    terrainRiseBias: 0.76
  }),
  Object.freeze({
    id: 6,
    key: "south_polar_ice_footprint",
    name: "South Polar Ice Footprint",
    role: "ice-only southern polar footprint; not expanded as above-water land",
    centerLon: 0.0,
    centerLat: -0.88,
    radiusLon: 1.0,
    radiusLat: 0.16,
    angle: 0,
    expansionEligible: false,
    coastlineRoughness: 0.08,
    rockBias: 0.00,
    sandBias: 0.00,
    diamondBias: 0.12,
    opalBias: 0.04,
    graniteBias: 0.28,
    slateBias: 0.16,
    terrainRiseBias: 0.00
  })
]);

const LAND_CONNECTIONS = Object.freeze([
  Object.freeze({ id: "western_isthmus_neck", from: 1, to: 2, role: "dominant mainland to western weathered body", width: 0.078, pressure: 0.68, sandBias: 0.30, rockBias: 0.52 }),
  Object.freeze({ id: "eastern_shelf_bridge", from: 1, to: 3, role: "dominant mainland to eastern shelf body", width: 0.070, pressure: 0.62, sandBias: 0.48, rockBias: 0.34 }),
  Object.freeze({ id: "southern_low_neck", from: 1, to: 4, role: "partial low land neck toward southern archipelago", width: 0.052, pressure: 0.50, sandBias: 0.36, rockBias: 0.42 }),
  Object.freeze({ id: "southern_shelf_chain", from: 3, to: 4, role: "shelf and exposed rock chain", width: 0.040, pressure: 0.42, sandBias: 0.32, rockBias: 0.56 }),
  Object.freeze({ id: "northern_mineral_shelf", from: 1, to: 5, role: "subpolar shelf connection", width: 0.044, pressure: 0.38, sandBias: 0.08, rockBias: 0.70 }),
  Object.freeze({ id: "western_frontier_hook", from: 2, to: 5, role: "distant western hook", width: 0.034, pressure: 0.30, sandBias: 0.10, rockBias: 0.72 }),
  Object.freeze({ id: "central_low_saddle", from: 2, to: 3, role: "central low saddle", width: 0.048, pressure: 0.44, sandBias: 0.34, rockBias: 0.44 })
]);

const PENINSULA_SEEDS = Object.freeze([
  Object.freeze({ id: "northwest_hook", bodyId: 1, lon: -0.36, lat: 0.18, radiusLon: 0.15, radiusLat: 0.050, angle: -24, pressure: 0.30 }),
  Object.freeze({ id: "eastern_spur", bodyId: 1, lon: 0.20, lat: -0.08, radiusLon: 0.16, radiusLat: 0.048, angle: 12, pressure: 0.28 }),
  Object.freeze({ id: "western_cove_split", bodyId: 2, lon: -0.78, lat: 0.08, radiusLon: 0.10, radiusLat: 0.050, angle: 42, pressure: 0.28 }),
  Object.freeze({ id: "southern_tail", bodyId: 4, lon: -0.06, lat: -0.54, radiusLon: 0.18, radiusLat: 0.040, angle: -8, pressure: 0.28 }),
  Object.freeze({ id: "eastern_shelf_arm", bodyId: 3, lon: 0.42, lat: -0.12, radiusLon: 0.13, radiusLat: 0.048, angle: -36, pressure: 0.26 }),
  Object.freeze({ id: "polar_rock_lip", bodyId: 5, lon: -0.20, lat: 0.74, radiusLon: 0.17, radiusLat: 0.036, angle: 0, pressure: 0.22 })
]);

const BAY_CUTS = Object.freeze([
  Object.freeze({ id: "dominant_north_bay", lon: -0.08, lat: 0.20, radiusLon: 0.14, radiusLat: 0.070, cut: 0.24 }),
  Object.freeze({ id: "dominant_south_bay", lon: -0.02, lat: -0.19, radiusLon: 0.17, radiusLat: 0.075, cut: 0.22 }),
  Object.freeze({ id: "western_inner_cove", lon: -0.52, lat: -0.08, radiusLon: 0.10, radiusLat: 0.060, cut: 0.20 }),
  Object.freeze({ id: "eastern_shelf_bay", lon: 0.50, lat: 0.16, radiusLon: 0.10, radiusLat: 0.060, cut: 0.18 }),
  Object.freeze({ id: "southern_archipelago_bite", lon: 0.18, lat: -0.38, radiusLon: 0.16, radiusLat: 0.050, cut: 0.20 }),
  Object.freeze({ id: "polar_north_bay", lon: 0.24, lat: 0.77, radiusLon: 0.16, radiusLat: 0.050, cut: 0.14 })
]);

const ISLAND_FOOTPRINT_ARCS = Object.freeze([
  Object.freeze({ id: "origin_shelf_rocks", landBodyId: 1, centerLon: -0.40, centerLat: -0.07, count: 4, spreadLon: 0.15, spreadLat: 0.045, radius: 0.025, sandBias: 0.46, rockBias: 0.44, intentionalSeparation: true }),
  Object.freeze({ id: "southern_hard_islets", landBodyId: 4, centerLon: 0.22, centerLat: -0.49, count: 5, spreadLon: 0.20, spreadLat: 0.055, radius: 0.022, sandBias: 0.20, rockBias: 0.64, intentionalSeparation: true }),
  Object.freeze({ id: "mineral_crown_outcrops", landBodyId: 5, centerLon: 0.08, centerLat: 0.56, count: 3, spreadLon: 0.12, spreadLat: 0.040, radius: 0.023, sandBias: 0.08, rockBias: 0.76, intentionalSeparation: true })
]);

const OCEAN_TRENCHES = Object.freeze([
  Object.freeze({ id: "western_deep_trench", centerLon: -0.84, centerLat: -0.30, radiusLon: 0.18, radiusLat: 0.42, depth: 0.92 }),
  Object.freeze({ id: "eastern_outer_basin", centerLon: 0.80, centerLat: 0.26, radiusLon: 0.20, radiusLat: 0.36, depth: 0.78 }),
  Object.freeze({ id: "southern_cold_basin", centerLon: 0.04, centerLat: -0.72, radiusLon: 0.72, radiusLat: 0.18, depth: 0.70 }),
  Object.freeze({ id: "north_polar_subsea_bowl", centerLon: -0.12, centerLat: 0.72, radiusLon: 0.56, radiusLat: 0.17, depth: 0.54 }),
  Object.freeze({ id: "mid_ocean_spread_cut", centerLon: 0.36, centerLat: -0.08, radiusLon: 0.26, radiusLat: 0.54, depth: 0.66 })
]);

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function mix(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function fract(value) {
  return value - Math.floor(value);
}

function hash2(x, y, seed = 0) {
  return fract(Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123);
}

function valueNoise(x, y, seed = 0) {
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

function fbm(x, y, seed = 0, octaves = 4) {
  let total = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let normalizer = 0;

  for (let i = 0; i < octaves; i += 1) {
    total += valueNoise(x * frequency, y * frequency, seed + i * 29.17) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return total / Math.max(0.00001, normalizer);
}

function wrapLonDistance(a, b) {
  let d = a - b;
  while (d > 1) d -= 2;
  while (d < -1) d += 2;
  return d;
}

function rotatePoint(dx, dy, degrees) {
  const radians = (degrees * Math.PI) / 180;
  const c = Math.cos(radians);
  const s = Math.sin(radians);

  return Object.freeze({
    x: dx * c - dy * s,
    y: dx * s + dy * c
  });
}

function gaussian(dx, dy, sx, sy, power = 1) {
  return Math.exp(-((dx * dx) / Math.max(0.000001, sx * sx) + (dy * dy) / Math.max(0.000001, sy * sy)) * power);
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

function getInputContext(context = {}) {
  return Object.freeze({
    blueprintResolution: clamp(Number.isFinite(Number(context.blueprintResolution)) ? Number(context.blueprintResolution) : 0.88, 0, 1),
    coastlineComplexity: clamp(Number.isFinite(Number(context.coastlineComplexity)) ? Number(context.coastlineComplexity) : 0.92, 0, 1),
    connectionStrength: clamp(Number.isFinite(Number(context.connectionStrength)) ? Number(context.connectionStrength) : 0.90, 0, 1),
    subterraneanPressure: clamp(Number.isFinite(Number(context.subterraneanPressure)) ? Number(context.subterraneanPressure) : 0.72, 0, 1),
    seaLevelThreshold: clamp(Number.isFinite(Number(context.seaLevelThreshold)) ? Number(context.seaLevelThreshold) : SEA_LEVEL_LAW.defaultSeaLevelThreshold, 0.42, 0.76),
    seaLevelOffset: clamp(Number.isFinite(Number(context.seaLevelOffset)) ? Number(context.seaLevelOffset) : 0, -0.16, 0.16),
    landRatioTarget: clamp(Number.isFinite(Number(context.landRatioTarget)) ? Number(context.landRatioTarget) : EARTH_LAND_RATIO_LAW.approximateEarthExposedLandRatio, 0.20, 0.60),
    landExpansionMultiplier: clamp(Number.isFinite(Number(context.landExpansionMultiplier)) ? Number(context.landExpansionMultiplier) : LAND_EXPANSION_LAW.areaMultiplier, 1, 4),
    enforceEarthEquivalentLandRatio: Boolean(context.enforceEarthEquivalentLandRatio)
  });
}

function bodyById(id) {
  return LAND_BODIES.find((body) => body.id === id) || null;
}

function seaLevelThreshold(context) {
  return clamp(context.seaLevelThreshold + context.seaLevelOffset, 0.42, 0.76);
}

function bodyRadiusScale(body, context) {
  if (!body || !body.expansionEligible) return 1;
  const areaMultiplier = clamp(context.landExpansionMultiplier, 1, 4);
  return Math.sqrt(areaMultiplier);
}

function landBodyInfluence(lon, lat, body, context) {
  const scale = bodyRadiusScale(body, context);
  const dx = wrapLonDistance(lon, body.centerLon);
  const dy = lat - body.centerLat;
  const rotated = rotatePoint(dx, dy, body.angle);

  const radiusLon = body.radiusLon * scale;
  const radiusLat = body.radiusLat * scale;

  const primary = gaussian(rotated.x, rotated.y, radiusLon, radiusLat, 1.04);
  const shoulderA = gaussian(rotated.x - radiusLon * 0.38, rotated.y + radiusLat * 0.20, radiusLon * 0.48, radiusLat * 0.40, 1.12) * 0.40;
  const shoulderB = gaussian(rotated.x + radiusLon * 0.42, rotated.y - radiusLat * 0.24, radiusLon * 0.44, radiusLat * 0.36, 1.14) * 0.34;

  const shape = Math.max(primary, shoulderA, shoulderB);
  const edge = smoothstep(0.20, 0.78, shape);

  const roughness = (fbm(lon * 9.4 + body.id * 2.1, lat * 9.4 - body.id * 1.7, 100 + body.id, 5) - 0.5) * body.coastlineRoughness * context.coastlineComplexity;
  const fracture = (fbm(lon * 21.0 - body.id * 0.7, lat * 21.0 + body.id * 1.1, 170 + body.id, 3) - 0.5) * 0.10;

  let bayCut = 0;
  for (const bay of BAY_CUTS) {
    const bdx = wrapLonDistance(lon, bay.lon);
    const bdy = lat - bay.lat;
    bayCut = Math.max(bayCut, gaussian(bdx, bdy, bay.radiusLon, bay.radiusLat, 1.12) * bay.cut);
  }

  let peninsulaAdd = 0;
  for (const seed of PENINSULA_SEEDS) {
    if (seed.bodyId !== body.id) continue;
    const pdx = wrapLonDistance(lon, seed.lon);
    const pdy = lat - seed.lat;
    const pRot = rotatePoint(pdx, pdy, seed.angle);
    peninsulaAdd = Math.max(
      peninsulaAdd,
      gaussian(
        pRot.x,
        pRot.y,
        seed.radiusLon * LAND_EXPANSION_LAW.peninsulaRadiusScale,
        seed.radiusLat * LAND_EXPANSION_LAW.peninsulaRadiusScale,
        1.10
      ) * seed.pressure
    );
  }

  return clamp(shape + roughness * edge + fracture * edge + peninsulaAdd - bayCut * edge, 0, 1.65);
}

function distanceToSegment(lon, lat, ax, ay, bx, by) {
  const wrappedB = ax + wrapLonDistance(bx, ax);
  const wrappedP = ax + wrapLonDistance(lon, ax);

  const vx = wrappedB - ax;
  const vy = by - ay;
  const wx = wrappedP - ax;
  const wy = lat - ay;

  const len2 = vx * vx + vy * vy;
  const t = len2 <= 0.00001 ? 0 : clamp((wx * vx + wy * vy) / len2, 0, 1);
  const cx = ax + vx * t;
  const cy = ay + vy * t;

  return Object.freeze({
    distance: Math.hypot(wrappedP - cx, lat - cy),
    t
  });
}

function connectionInfluence(lon, lat, connection, context) {
  const from = bodyById(connection.from);
  const to = bodyById(connection.to);

  if (!from || !to) {
    return Object.freeze({ pressure: 0, t: 0, distance: Infinity, connection });
  }

  const line = distanceToSegment(lon, lat, from.centerLon, from.centerLat, to.centerLon, to.centerLat);
  const wave = 0.70 + fbm(lon * 8.0 + connection.from, lat * 8.0 - connection.to, 321 + connection.from * 7 + connection.to, 4) * 0.30;

  const width = connection.width * LAND_EXPANSION_LAW.connectionWidthScale;
  const pressure = connection.pressure * LAND_EXPANSION_LAW.connectionPressureScale;

  const neck = smoothstep(width, 0.004, line.distance) * pressure * context.connectionStrength * wave;

  return Object.freeze({
    pressure: clamp(neck, 0, 1),
    t: line.t,
    distance: line.distance,
    connection
  });
}

function islandPoint(arc, index) {
  const step = index - (arc.count - 1) / 2;
  const curve = Math.sin(index * 1.38) * arc.spreadLat * LAND_EXPANSION_LAW.islandArcSpreadScale * 0.24;

  return Object.freeze({
    lon: arc.centerLon + step * ((arc.spreadLon * LAND_EXPANSION_LAW.islandArcSpreadScale) / Math.max(1, arc.count - 1)) + Math.sin(index * 1.91) * 0.018,
    lat: arc.centerLat + curve + Math.cos(index * 1.17) * arc.spreadLat * LAND_EXPANSION_LAW.islandArcSpreadScale * 0.16,
    radius: arc.radius * LAND_EXPANSION_LAW.islandArcRadiusScale
  });
}

function islandInfluence(lon, lat, arc) {
  let strength = 0;

  for (let i = 0; i < arc.count; i += 1) {
    const point = islandPoint(arc, i);
    const dx = wrapLonDistance(lon, point.lon);
    const dy = lat - point.lat;
    const local = gaussian(dx, dy, point.radius, point.radius * 0.72, 1.10);
    strength = Math.max(strength, local);
  }

  return clamp(strength, 0, 1);
}

function computeFootprint(lon, lat, context) {
  let bestBody = null;
  let bestBodyPressure = 0;

  for (const body of LAND_BODIES) {
    const pressure = landBodyInfluence(lon, lat, body, context);
    if (pressure > bestBodyPressure) {
      bestBody = body;
      bestBodyPressure = pressure;
    }
  }

  let bestConnection = null;
  let bestConnectionPressure = 0;
  let bestConnectionDistance = Infinity;

  for (const connection of LAND_CONNECTIONS) {
    const influence = connectionInfluence(lon, lat, connection, context);
    if (influence.pressure > bestConnectionPressure) {
      bestConnection = influence.connection;
      bestConnectionPressure = influence.pressure;
      bestConnectionDistance = influence.distance;
    }
  }

  let bestIslandArc = null;
  let bestIslandPressure = 0;

  for (const arc of ISLAND_FOOTPRINT_ARCS) {
    const pressure = islandInfluence(lon, lat, arc);
    if (pressure > bestIslandPressure) {
      bestIslandArc = arc;
      bestIslandPressure = pressure;
    }
  }

  const southPolarBody = bodyById(6);
  const southPolarPressure = southPolarBody ? landBodyInfluence(lon, lat, southPolarBody, context) : 0;
  const southPolarBand = smoothstep(0.70, 0.94, -lat);
  const southPolarIcePressure = clamp(Math.max(southPolarPressure, southPolarBand), 0, 1);

  if (southPolarIcePressure > 0.52 && southPolarIcePressure >= bestBodyPressure) {
    bestBody = southPolarBody;
    bestBodyPressure = southPolarIcePressure;
  }

  const threshold = seaLevelThreshold(context);
  const connectedFootprintPressure = clamp(bestConnectionPressure, 0, 1);
  const mainPressure = clamp(Math.max(bestBodyPressure, connectedFootprintPressure), 0, 1.65);
  const islandMergePressure = clamp(bestIslandPressure * 1.10 + connectedFootprintPressure * 0.28, 0, 1.55);
  const landPressure = clamp(Math.max(mainPressure, islandMergePressure), 0, 1.65);

  const isSouthPolarIceFootprint = Boolean(bestBody && bestBody.id === 6 && southPolarIcePressure > 0.52);
  const isIslandFootprint = Boolean(bestIslandArc && islandMergePressure >= Math.max(threshold - 0.02, mainPressure * 0.86));
  const isConnectedLandSystem = Boolean(bestConnection && connectedFootprintPressure >= 0.20 && connectedFootprintPressure >= bestIslandPressure * 0.52);
  const isSmallContinentFootprint = Boolean(isIslandFootprint && (connectedFootprintPressure > 0.24 || bestIslandPressure > threshold + 0.05));

  const isLandFootprint = landPressure >= threshold || isSouthPolarIceFootprint;
  const isVoidFootprint = !isLandFootprint;

  const connectionFromBody = bestConnection ? bodyById(bestConnection.from) : null;
  const islandBody = bestIslandArc ? bodyById(bestIslandArc.landBodyId) : null;

  const landBody = isSouthPolarIceFootprint
    ? southPolarBody
    : isIslandFootprint
      ? islandBody || bestBody
      : isConnectedLandSystem && connectionFromBody
        ? connectionFromBody
        : bestBody;

  const seaLevelBoundary = landPressure - threshold;
  const seaLevelDistance = Math.abs(seaLevelBoundary);
  const shelfExposurePressure = clamp((landPressure - (threshold - 0.14)) / 0.14, 0, 1);
  const exposedShelfPermission = !isLandFootprint ? clamp(shelfExposurePressure * LAND_EXPANSION_LAW.shelfExposureScale * (1 - seaLevelDistance), 0, 1) : 0;
  const submergedShelfPermission = isVoidFootprint ? clamp((1 - seaLevelDistance / 0.22) * LAND_EXPANSION_LAW.shelfExposureScale, 0, 1) : 0;

  return Object.freeze({
    bestBody,
    landBody,
    bestConnection,
    bestIslandArc,

    landPressure,
    bestBodyPressure,
    connectedFootprintPressure,
    bestConnectionPressure,
    bestConnectionDistance,
    bestIslandPressure,

    seaLevelThreshold: threshold,
    seaLevelBoundary,
    seaLevelDistance,
    seaLevelOffset: context.seaLevelOffset,
    exposedShelfPermission,
    submergedShelfPermission,
    coastalExposureIndex: clamp(1 - seaLevelDistance / 0.20, 0, 1),

    isLandFootprint,
    isVoidFootprint,
    isIslandFootprint,
    isConnectedLandSystem,
    isSmallContinentFootprint,
    isSouthPolarIceFootprint,
    isNorthPolarLandFootprint: Boolean(landBody && landBody.id === 5 && isLandFootprint),
    isPolarFootprint: Boolean((landBody && landBody.id === 5) || isSouthPolarIceFootprint)
  });
}

function computeCoastalBlueprint(lon, lat, footprint, context) {
  const boundaryBand = clamp(1 - footprint.seaLevelDistance / 0.14, 0, 1);
  const fine = fbm(lon * 17.0 - 2.4, lat * 17.0 + 3.8, 501, 4);
  const coarse = fbm(lon * 5.2 + 1.1, lat * 5.2 - 0.7, 503, 4);

  const body = footprint.landBody || LAND_BODIES[0];
  const connection = footprint.bestConnection;
  const island = footprint.bestIslandArc;

  const connectionRockBias = connection ? connection.rockBias : 0;
  const connectionSandBias = connection ? connection.sandBias : 0;
  const islandRockBias = island ? island.rockBias : 0;
  const islandSandBias = island ? island.sandBias : 0;

  const isCoastline = boundaryBand > 0.12;
  const mineralEdgeNoise = fbm(lon * 13.0 + 4.2, lat * 13.0 - 6.1, 601, 4);

  const rockBase = clamp(
    body.rockBias * 0.74 +
      connectionRockBias * 0.18 +
      islandRockBias * 0.18 +
      (coarse - 0.5) * 0.26 +
      context.coastlineComplexity * 0.10,
    0,
    1
  );

  const sandBase = clamp(
    body.sandBias * 0.74 +
      connectionSandBias * 0.18 +
      islandSandBias * 0.18 +
      (0.5 - coarse) * 0.20,
    0,
    1
  );

  const coastlineIrregularityIndex = clamp(
    Math.abs(fine - 0.5) * 1.14 +
      body.coastlineRoughness * 0.58 +
      (footprint.isConnectedLandSystem ? 0.14 : 0) +
      (footprint.isIslandFootprint ? 0.10 : 0) +
      (footprint.isSmallContinentFootprint ? 0.12 : 0),
    0,
    1
  );

  const shorelinePressure = boundaryBand;
  const beachPressure = clamp(boundaryBand * (0.50 + sandBase * 0.44) * (1 - footprint.isSouthPolarIceFootprint), 0, 1);
  const sandPressure = clamp(beachPressure * (0.52 + sandBase * 0.42) * (1 - rockBase * 0.25), 0, 1);
  const rockPressure = clamp(boundaryBand * (0.42 + rockBase * 0.54) + fine * 0.07, 0, 1);
  const coastalCliffPressure = clamp(rockPressure * (1 - sandPressure * 0.40) * (0.42 + body.coastlineRoughness), 0, 1);

  const wetEdgePermission = clamp(boundaryBand * (footprint.isVoidFootprint ? 0.86 : 0.36), 0, 1);
  const dryEdgePermission = clamp(boundaryBand * (footprint.isLandFootprint ? 0.86 : 0.32), 0, 1);
  const reefShelfPermission = clamp(boundaryBand * (1 - rockPressure * 0.48) * (footprint.isVoidFootprint ? 0.82 : 0.34), 0, 1);

  const bayPermission = clamp(boundaryBand * coastlineIrregularityIndex * (footprint.isLandFootprint ? 0.42 : 0.62), 0, 1);
  const inletPermission = clamp(boundaryBand * coastlineIrregularityIndex * (footprint.isVoidFootprint ? 0.64 : 0.36), 0, 1);
  const peninsulaPermission = clamp((footprint.isLandFootprint ? 1 : 0) * (footprint.isConnectedLandSystem ? 0.46 : 0.22) + coastlineIrregularityIndex * 0.22, 0, 1);
  const isthmusPermission = clamp(footprint.isConnectedLandSystem ? 0.42 + footprint.connectedFootprintPressure * 0.48 : 0, 0, 1);

  const diamondDarkSandIndex = clamp(
    body.diamondBias * 0.32 +
      rockPressure * 0.18 +
      coastalCliffPressure * 0.12 +
      mineralEdgeNoise * 0.18 +
      (footprint.isConnectedLandSystem ? 0.07 : 0),
    0,
    1
  );

  const opalSoftnessIndex = clamp(
    body.opalBias * 0.36 +
      sandPressure * 0.22 +
      reefShelfPermission * 0.12 +
      (1 - rockPressure) * 0.10 +
      (1 - mineralEdgeNoise) * 0.14,
    0,
    1
  );

  const granitePowderIndex = clamp(body.graniteBias * 0.30 + rockPressure * 0.18 + sandPressure * 0.10 + mineralEdgeNoise * 0.10, 0, 1);
  const slateShingleIndex = clamp(body.slateBias * 0.32 + coastalCliffPressure * 0.22 + rockPressure * 0.12 + fine * 0.10, 0, 1);

  const blackSandPressure = clamp(diamondDarkSandIndex * 0.72 + slateShingleIndex * 0.18 + rockPressure * 0.10, 0, 1);
  const whiteSandPressure = clamp(opalSoftnessIndex * 0.76 + granitePowderIndex * 0.16 + sandPressure * 0.08, 0, 1);

  const beachCloudSoftnessIndex = clamp(
    whiteSandPressure * 0.48 +
      opalSoftnessIndex * 0.30 +
      beachPressure * 0.16 -
      coastalCliffPressure * 0.10,
    0,
    1
  );

  const coastalComfortIndex = clamp(beachCloudSoftnessIndex * 0.42 + sandPressure * 0.20 + reefShelfPermission * 0.18 + (1 - coastalCliffPressure) * 0.20, 0, 1);

  let beachType = "none";
  if (beachPressure > 0.28) {
    if (whiteSandPressure > 0.62 && blackSandPressure < 0.42) beachType = "white_opal_cloud_sand_beach";
    else if (blackSandPressure > 0.62 && whiteSandPressure < 0.42) beachType = "black_diamond_sand_beach";
    else if (blackSandPressure > 0.46 && whiteSandPressure > 0.46) beachType = "mixed_opal_diamond_sand_beach";
    else if (granitePowderIndex > 0.50) beachType = "granite_powder_pale_beach";
    else if (slateShingleIndex > 0.50) beachType = "slate_dark_shingle_beach";
    else if (rockPressure > 0.56) beachType = "rock_cove_beach";
    else if (coastalCliffPressure > 0.54) beachType = "cliff_shadow_beach";
    else beachType = "white_opal_cloud_sand_beach";
  }

  const seaLevelErosionPressure = clamp(
    shorelinePressure * 0.32 +
      coastalCliffPressure * 0.24 +
      coastlineIrregularityIndex * 0.18 +
      footprint.coastalExposureIndex * 0.16 +
      rockPressure * 0.10,
    0,
    1
  );

  const waveCutPlatformPermission = clamp(seaLevelErosionPressure * (0.40 + rockPressure * 0.34), 0, 1);
  const coastalNotchPermission = clamp(seaLevelErosionPressure * (0.38 + coastalCliffPressure * 0.40), 0, 1);
  const cliffBaseCut = clamp(coastalCliffPressure * 0.52 + seaLevelErosionPressure * 0.34, 0, 1);
  const erodedShelfEdge = clamp(reefShelfPermission * 0.34 + waveCutPlatformPermission * 0.36 + shorelinePressure * 0.18, 0, 1);
  const collapsedCoastPermission = clamp(cliffBaseCut * 0.36 + coastlineIrregularityIndex * 0.24 + rockPressure * 0.18, 0, 1);
  const rockyHeadlandPermission = clamp(rockPressure * 0.42 + peninsulaPermission * 0.20 + coastalCliffPressure * 0.22, 0, 1);
  const covePermission = clamp(bayPermission * 0.34 + coastalNotchPermission * 0.28 + beachPressure * 0.18, 0, 1);

  return Object.freeze({
    isCoastline,
    isBeach: beachPressure > 0.42,
    isSand: sandPressure > 0.38,
    isRock: rockPressure > 0.44,
    isShelf: footprint.isVoidFootprint && boundaryBand > 0.18,

    shorelinePressure,
    beachPressure,
    sandPressure,
    rockPressure,
    coastalCliffPressure,
    wetEdgePermission,
    dryEdgePermission,
    reefShelfPermission,

    coastlineIrregularityIndex,
    bayPermission,
    inletPermission,
    peninsulaPermission,
    isthmusPermission,

    beachType,
    blackSandPressure,
    whiteSandPressure,
    opalSoftnessIndex,
    diamondDarkSandIndex,
    granitePowderIndex,
    slateShingleIndex,
    beachCloudSoftnessIndex,
    coastalComfortIndex,

    seaLevelErosionPressure,
    waveCutPlatformPermission,
    coastalNotchPermission,
    cliffBaseCut,
    erodedShelfEdge,
    collapsedCoastPermission,
    rockyHeadlandPermission,
    covePermission
  });
}

function depthClassFromIndex(depthIndex, shorelinePressure, shelfDepthIndex, trenchDepthIndex) {
  if (shorelinePressure > 0.70) return DEPTH_CLASSES[0];
  if (shorelinePressure > 0.45) return DEPTH_CLASSES[1];
  if (shelfDepthIndex > 0.45) return DEPTH_CLASSES[2];
  if (shelfDepthIndex > 0.20) return DEPTH_CLASSES[3];
  if (trenchDepthIndex > 0.66) return DEPTH_CLASSES[8];
  if (depthIndex > 0.86) return DEPTH_CLASSES[7];
  if (depthIndex > 0.70) return DEPTH_CLASSES[6];
  if (depthIndex > 0.50) return DEPTH_CLASSES[5];
  return DEPTH_CLASSES[4];
}

function computeSubSeaBlueprint(lon, lat, footprint, coastal) {
  let trenchDepthIndex = 0;
  let trenchAxisId = "none";

  for (const trench of OCEAN_TRENCHES) {
    const dx = wrapLonDistance(lon, trench.centerLon);
    const dy = lat - trench.centerLat;
    const local = gaussian(dx, dy, trench.radiusLon, trench.radiusLat, 1.08) * trench.depth;
    if (local > trenchDepthIndex) {
      trenchDepthIndex = local;
      trenchAxisId = trench.id;
    }
  }

  const shelfDepthIndex = clamp(
    coastal.reefShelfPermission * 0.32 +
      coastal.shorelinePressure * 0.18 +
      footprint.submergedShelfPermission * 0.28,
    0,
    1
  );

  const openVoid = footprint.isVoidFootprint ? clamp(1 - coastal.shorelinePressure * 0.82, 0, 1) : 0;
  const basinNoise = fbm(lon * 3.2 + 9.1, lat * 3.2 - 4.2, 710, 4);
  const slopeNoise = fbm(lon * 7.7 - 1.4, lat * 7.7 + 2.2, 711, 4);

  const continentalSlopeIndex = clamp((1 - shelfDepthIndex) * coastal.erodedShelfEdge * 0.44 + coastal.cliffBaseCut * 0.18 + slopeNoise * 0.16, 0, 1);
  const basinDepthIndex = clamp(openVoid * (0.38 + basinNoise * 0.38) + trenchDepthIndex * 0.34 + continentalSlopeIndex * 0.12, 0, 1);

  const oceanDepthIndex = footprint.isVoidFootprint
    ? clamp(shelfDepthIndex * 0.20 + continentalSlopeIndex * 0.18 + basinDepthIndex * 0.46 + trenchDepthIndex * 0.44, 0, 1)
    : 0;

  const seaFloorShapeIndex = clamp(
    oceanDepthIndex * 0.42 +
      basinDepthIndex * 0.22 +
      trenchDepthIndex * 0.22 +
      continentalSlopeIndex * 0.12 +
      fbm(lon * 11.0, lat * 11.0, 717, 3) * 0.08,
    0,
    1
  );

  const subSeaBoundaryPressure = clamp(coastal.shorelinePressure * 0.30 + oceanDepthIndex * 0.24 + trenchDepthIndex * 0.30 + continentalSlopeIndex * 0.16, 0, 1);
  const abyssalPermission = clamp(smoothstep(0.72, 0.96, oceanDepthIndex) + trenchDepthIndex * 0.42, 0, 1);

  const depthClass = footprint.isVoidFootprint
    ? depthClassFromIndex(oceanDepthIndex, coastal.shorelinePressure, shelfDepthIndex, trenchDepthIndex)
    : DEPTH_CLASSES[0];

  let oceanDepthClass = "land";
  if (footprint.isVoidFootprint) oceanDepthClass = depthClass.key;

  return Object.freeze({
    isSubSea: footprint.isVoidFootprint,
    depthClassId: footprint.isVoidFootprint ? depthClass.id : -1,
    depthClassKey: oceanDepthClass,
    depthClassName: footprint.isVoidFootprint ? depthClass.name : "Land",
    oceanDepthClass,
    oceanDepthIndex,
    shelfDepthIndex,
    shallowShelfIndex: shelfDepthIndex,
    outerShelfIndex: clamp(shelfDepthIndex * 0.52 + continentalSlopeIndex * 0.22, 0, 1),
    continentalSlopeIndex,
    basinDepthIndex,
    trenchDepthIndex,
    seaFloorShapeIndex,
    bathymetryBlueprintIndex: clamp(oceanDepthIndex * 0.44 + seaFloorShapeIndex * 0.30 + trenchDepthIndex * 0.18 + continentalSlopeIndex * 0.08, 0, 1),
    subSeaBoundaryPressure,
    abyssalPermission,
    trenchAxisId
  });
}

function computeSubterraneanBlueprint(lon, lat, footprint, coastal, subsea, context) {
  const foundationNoise = fbm(lon * 4.7 - 2.1, lat * 4.7 + 1.6, 901, 5);
  const cavityNoise = fbm(lon * 13.0 + 5.5, lat * 13.0 - 7.2, 909, 4);
  const boundaryNoise = fbm(lon * 8.0 - 1.2, lat * 8.0 + 4.6, 913, 4);

  const underLandDepthIndex = footprint.isLandFootprint ? clamp(0.30 + footprint.landPressure * 0.24 + foundationNoise * 0.24, 0, 1) : 0;
  const underCoastDepthIndex = clamp(coastal.shorelinePressure * (0.26 + boundaryNoise * 0.24) + coastal.cliffBaseCut * 0.14, 0, 1);
  const underShelfDepthIndex = clamp(coastal.reefShelfPermission * 0.30 + subsea.shelfDepthIndex * 0.38 + subsea.continentalSlopeIndex * 0.16, 0, 1);
  const underBasinDepthIndex = clamp(subsea.basinDepthIndex * 0.36 + subsea.trenchDepthIndex * 0.34 + subsea.abyssalPermission * 0.10, 0, 1);
  const underTrenchDepthIndex = clamp(subsea.trenchDepthIndex * 0.72 + subsea.abyssalPermission * 0.20, 0, 1);

  const foundationDensityIndex = clamp(
    underLandDepthIndex * 0.38 +
      underCoastDepthIndex * 0.17 +
      underShelfDepthIndex * 0.15 +
      underBasinDepthIndex * 0.18 +
      underTrenchDepthIndex * 0.08 +
      context.subterraneanPressure * 0.12,
    0,
    1
  );

  const rockMassBoundaryIndex = clamp(
    foundationDensityIndex * 0.46 +
      coastal.rockPressure * 0.18 +
      coastal.coastalCliffPressure * 0.10 +
      boundaryNoise * 0.18 +
      (footprint.isSouthPolarIceFootprint ? 0.10 : 0),
    0,
    1
  );

  const cavityPermission = clamp(
    (cavityNoise - 0.56) * 1.6 +
      underLandDepthIndex * 0.14 +
      underBasinDepthIndex * 0.22 +
      underTrenchDepthIndex * 0.08 -
      coastal.shorelinePressure * 0.12,
    0,
    1
  );

  const subterraneanDepthIndex = clamp(
    underLandDepthIndex * 0.26 +
      underCoastDepthIndex * 0.15 +
      underShelfDepthIndex * 0.16 +
      underBasinDepthIndex * 0.22 +
      underTrenchDepthIndex * 0.10 +
      rockMassBoundaryIndex * 0.13,
    0,
    1
  );

  const undergroundBoundaryPressure = clamp(rockMassBoundaryIndex * 0.50 + cavityPermission * 0.20 + foundationDensityIndex * 0.24 + coastal.cliffBaseCut * 0.06, 0, 1);

  let subsurfacePressureZone = "none";
  if (undergroundBoundaryPressure > 0.72) subsurfacePressureZone = "hard_boundary";
  else if (cavityPermission > 0.54) subsurfacePressureZone = "cavity_permission";
  else if (underTrenchDepthIndex > 0.52) subsurfacePressureZone = "under_trench_depth";
  else if (foundationDensityIndex > 0.54) subsurfacePressureZone = "foundation_rock_mass";
  else if (underCoastDepthIndex > 0.28) subsurfacePressureZone = "coastal_transition";
  else if (underBasinDepthIndex > 0.34) subsurfacePressureZone = "basin_pressure_zone";
  else if (subterraneanDepthIndex > 0.18) subsurfacePressureZone = "shallow_foundation";

  return Object.freeze({
    isSubterranean: true,
    subterraneanDepthIndex,
    underLandDepthIndex,
    underCoastDepthIndex,
    underShelfDepthIndex,
    underBasinDepthIndex,
    underTrenchDepthIndex,
    foundationDensityIndex,
    rockMassBoundaryIndex,
    cavityPermission,
    subsurfacePressureZone,
    undergroundBoundaryPressure
  });
}

function computeTerrainPermission(footprint, coastal, subsea, subterranean) {
  const terrainRisePermission = footprint.isLandFootprint && !footprint.isSouthPolarIceFootprint
    ? clamp(
        0.42 +
          footprint.landPressure * 0.30 +
          coastal.dryEdgePermission * 0.14 +
          footprint.connectedFootprintPressure * 0.12 +
          coastal.cliffBaseCut * 0.08 +
          (footprint.isSmallContinentFootprint ? 0.08 : 0),
        0,
        1
      )
    : 0;

  const terrainHoldPermission = footprint.isLandFootprint
    ? clamp(0.34 + coastal.dryEdgePermission * 0.20 + subterranean.foundationDensityIndex * 0.26 + coastal.seaLevelErosionPressure * 0.10, 0, 1)
    : 0;

  const terrainBlockPermission = footprint.isVoidFootprint
    ? clamp(0.54 + subsea.oceanDepthIndex * 0.28 + subsea.trenchDepthIndex * 0.18 + subsea.abyssalPermission * 0.10, 0, 1)
    : footprint.isSouthPolarIceFootprint
      ? 0.64
      : 0;

  const coastalRisePermission = clamp(coastal.dryEdgePermission * (footprint.isLandFootprint ? 0.78 : 0.16), 0, 1);
  const islandRisePermission = footprint.isIslandFootprint ? clamp(0.42 + terrainRisePermission * 0.42, 0, 1) : 0;
  const smallContinentRisePermission = footprint.isSmallContinentFootprint ? clamp(0.54 + terrainRisePermission * 0.36, 0, 1) : 0;
  const polarRisePermission = footprint.isNorthPolarLandFootprint ? clamp(0.38 + terrainRisePermission * 0.34, 0, 1) : 0;

  const basinDepressionPermission = clamp(
    subsea.basinDepthIndex * 0.38 +
      subsea.trenchDepthIndex * 0.28 +
      subterranean.underBasinDepthIndex * 0.22 +
      subterranean.underTrenchDepthIndex * 0.10,
    0,
    1
  );

  const cliffRisePermission = clamp(
    coastal.coastalCliffPressure * 0.42 +
      coastal.cliffBaseCut * 0.28 +
      coastal.rockPressure * 0.18 +
      subterranean.rockMassBoundaryIndex * 0.12,
    0,
    1
  );

  const rockExposurePermission = clamp(coastal.rockPressure * 0.32 + subterranean.rockMassBoundaryIndex * 0.30 + terrainRisePermission * 0.14 + coastal.seaLevelErosionPressure * 0.14, 0, 1);

  let terrainSeedClass = "none";
  if (footprint.isSouthPolarIceFootprint) terrainSeedClass = "polar_ice_footprint";
  else if (footprint.isNorthPolarLandFootprint) terrainSeedClass = "polar_land_rise_seed";
  else if (footprint.isSmallContinentFootprint) terrainSeedClass = "small_continent_rise_seed";
  else if (footprint.isConnectedLandSystem) terrainSeedClass = "connected_landmass_rise_seed";
  else if (footprint.isIslandFootprint) terrainSeedClass = "intentional_island_rise_seed";
  else if (cliffRisePermission > 0.52) terrainSeedClass = "rock_cliff_rise_seed";
  else if (coastal.beachPressure > 0.45) terrainSeedClass = "beach_low_rise_seed";
  else if (terrainRisePermission > 0.42) terrainSeedClass = "landmass_rise_seed";
  else if (basinDepressionPermission > 0.42) terrainSeedClass = "basin_depression_seed";
  else if (footprint.isVoidFootprint) terrainSeedClass = "void_no_rise";

  return Object.freeze({
    terrainRisePermission,
    terrainHoldPermission,
    terrainBlockPermission,
    coastalRisePermission,
    islandRisePermission,
    smallContinentRisePermission,
    polarRisePermission,
    basinDepressionPermission,
    cliffRisePermission,
    rockExposurePermission,
    terrainSeedClass
  });
}

function determineSurfaceClass(footprint, coastal, subsea, subterranean, permission) {
  if (footprint.isSouthPolarIceFootprint) return SURFACE_CLASSES[12];

  if (footprint.isVoidFootprint) {
    if (subsea.trenchDepthIndex > 0.64) return SURFACE_CLASSES[2];
    if (subsea.abyssalPermission > 0.62) return SURFACE_CLASSES[1];
    if (coastal.isShelf) return SURFACE_CLASSES[4];
    if (subsea.oceanDepthIndex > 0.54) return SURFACE_CLASSES[0];
    return SURFACE_CLASSES[3];
  }

  if (coastal.isCoastline && coastal.wetEdgePermission > 0.58) return SURFACE_CLASSES[5];
  if (coastal.isBeach && coastal.sandPressure >= coastal.rockPressure) return SURFACE_CLASSES[6];
  if (coastal.isRock || coastal.coastalCliffPressure > 0.50) return SURFACE_CLASSES[7];
  if (footprint.isNorthPolarLandFootprint) return SURFACE_CLASSES[11];
  if (footprint.isSmallContinentFootprint) return SURFACE_CLASSES[10];
  if (footprint.isIslandFootprint) return SURFACE_CLASSES[10];
  if (permission.terrainRisePermission > 0.72) return SURFACE_CLASSES[15];
  if (footprint.landPressure > footprint.seaLevelThreshold + 0.22) return SURFACE_CLASSES[9];
  if (subterranean.cavityPermission > 0.62) return SURFACE_CLASSES[14];
  if (subterranean.rockMassBoundaryIndex > 0.62) return SURFACE_CLASSES[13];
  return SURFACE_CLASSES[8];
}

function landAreaCorrectionFromRatio(ratio, target) {
  const delta = ratio - target;

  if (Math.abs(delta) <= EARTH_LAND_RATIO_LAW.tolerance) {
    return Object.freeze({
      status: "locked",
      direction: "none",
      delta,
      correctionIndex: 0
    });
  }

  if (delta < 0) {
    return Object.freeze({
      status: "under_target",
      direction: "lower_sea_level_expose_shallow_shelves",
      delta,
      correctionIndex: clamp(Math.abs(delta) / 0.12, 0, 1)
    });
  }

  return Object.freeze({
    status: "over_target_after_expansion",
    direction: "audit_only_do_not_recalibrate_this_pass",
    delta,
    correctionIndex: clamp(Math.abs(delta) / 0.12, 0, 1)
  });
}

function countLandRatio(width = 96, height = 48, context = {}) {
  const w = Math.max(8, Math.floor(width));
  const h = Math.max(8, Math.floor(height));
  let land = 0;
  const total = w * h;

  for (let y = 0; y < h; y += 1) {
    const v = h === 1 ? 0.5 : y / (h - 1);
    for (let x = 0; x < w; x += 1) {
      const u = w === 1 ? 0.5 : x / (w - 1);
      const point = normalizeUV(u, v);
      const localContext = getInputContext(context);
      const footprint = computeFootprint(point.lon, point.lat, localContext);
      if (footprint.isLandFootprint && !footprint.isSouthPolarIceFootprint) land += 1;
    }
  }

  return land / total;
}

function calibrateSeaLevelThreshold(width = 96, height = 48, options = {}) {
  const target = getInputContext(options).landRatioTarget;
  let low = 0.42;
  let high = 0.76;
  let bestThreshold = SEA_LEVEL_LAW.defaultSeaLevelThreshold;
  let bestDelta = Infinity;
  let bestRatio = 0;

  for (let i = 0; i < 12; i += 1) {
    const mid = (low + high) / 2;
    const ratio = countLandRatio(width, height, { ...options, seaLevelThreshold: mid, seaLevelOffset: 0 });
    const delta = ratio - target;

    if (Math.abs(delta) < Math.abs(bestDelta)) {
      bestThreshold = mid;
      bestDelta = delta;
      bestRatio = ratio;
    }

    if (delta > 0) low = mid;
    else high = mid;
  }

  const correction = landAreaCorrectionFromRatio(bestRatio, target);

  return Object.freeze({
    targetLandRatio: target,
    calibratedSeaLevelThreshold: bestThreshold,
    sampledLandRatio: bestRatio,
    landRatioDelta: bestDelta,
    seaLevelCorrectionStatus: correction.status,
    seaLevelCorrectionDirection: correction.direction,
    landAreaCorrectionIndex: correction.correctionIndex
  });
}

export function createTopologyProfile(overrides = {}) {
  return Object.freeze({
    receipt: RECEIPT,
    runtimeCompatibleReceipt: RUNTIME_COMPATIBLE_RECEIPT,
    previousReceipts: PREVIOUS_RECEIPTS,
    status: "active",
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    parentAuthority: PARENT_AUTHORITY,
    tectonicsHandoffTarget: TECTONICS_HANDOFF_TARGET,
    terrainHandoffTarget: TERRAIN_HANDOFF_TARGET,
    role: "landmass-100-percent-expansion-small-continent-blueprint-child",

    topologyBlueprint: true,
    topologyComesBeforeTectonics: true,
    topologyComesBeforeTerrain: true,
    terrainConsumesTopology: true,
    tectonicsConsumesTopology: true,

    landExpansionLaw: LAND_EXPANSION_LAW,
    earthLandRatioLaw: EARTH_LAND_RATIO_LAW,
    seaLevelLaw: SEA_LEVEL_LAW,
    topologyLaw: TOPOLOGY_LAW,
    surfaceClasses: SURFACE_CLASSES,
    depthClasses: DEPTH_CLASSES,
    beachTypes: BEACH_TYPES,
    landBodies: LAND_BODIES,
    landConnections: LAND_CONNECTIONS,
    peninsulaSeeds: PENINSULA_SEEDS,
    bayCuts: BAY_CUTS,
    islandFootprintArcs: ISLAND_FOOTPRINT_ARCS,
    oceanTrenches: OCEAN_TRENCHES,

    ownsTopologyBlueprint: true,
    ownsLandVoidFootprint: true,
    ownsAboveWaterLandFootprint: true,
    ownsLandmassExpansion: true,
    ownsIslandChainConnection: true,
    ownsSmallContinentFormation: true,
    ownsEarthEquivalentLandRatioAudit: true,
    ownsSeaLevelBoundary: true,
    ownsSeaLevelCorrection: true,
    ownsBeachSandRockBoundary: true,
    ownsBlackWhiteMineralBeachLaw: true,
    ownsCoastlineIrregularity: true,
    ownsSeaLevelErosion: true,
    ownsCliffBase: true,
    ownsBathymetry: true,
    ownsOceanDepths: true,
    ownsSubSeaDepthBlueprint: true,
    ownsSubterraneanBlueprint: true,
    ownsTerrainRisePermissions: true,

    ownsAboveSeaElevation: false,
    ownsTerrainRelief: false,
    ownsMountains: false,
    ownsRidges: false,
    ownsCanyons: false,
    ownsValleys: false,
    ownsHydration: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFoliage: false,
    ownsTrees: false,
    ownsVegetation: false,
    ownsFauna: false,
    ownsRuntime: false,
    ownsFinalRender: false,
    visualPassClaimed: false,

    terrainMayConsume: true,
    tectonicsMayConsume: true,
    hydrationMayConsumeLater: true,
    foliageMayConsume: false,
    ecologyMayConsume: false,

    ...overrides
  });
}

export function sampleTopology(uInput, vInput, context = {}) {
  const point = normalizeUV(uInput, vInput);
  const topologyContext = getInputContext(context);

  const footprint = computeFootprint(point.lon, point.lat, topologyContext);
  const coastal = computeCoastalBlueprint(point.lon, point.lat, footprint, topologyContext);
  const subsea = computeSubSeaBlueprint(point.lon, point.lat, footprint, coastal);
  const subterranean = computeSubterraneanBlueprint(point.lon, point.lat, footprint, coastal, subsea, topologyContext);
  const permission = computeTerrainPermission(footprint, coastal, subsea, subterranean);
  const surfaceClass = determineSurfaceClass(footprint, coastal, subsea, subterranean, permission);

  const landBody = footprint.landBody;
  const islandArc = footprint.bestIslandArc;
  const connection = footprint.bestConnection;

  return Object.freeze({
    receipt: RECEIPT,
    runtimeCompatibleReceipt: RUNTIME_COMPATIBLE_RECEIPT,
    previousReceipts: PREVIOUS_RECEIPTS,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    parentAuthority: PARENT_AUTHORITY,
    tectonicsHandoffTarget: TECTONICS_HANDOFF_TARGET,
    terrainHandoffTarget: TERRAIN_HANDOFF_TARGET,

    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,
    hemisphere: point.lat >= 0 ? "north" : "south",
    latBand: point.lat > 0.66 ? "north_polar" : point.lat > 0.22 ? "north_temperate" : point.lat > -0.22 ? "equatorial" : point.lat > -0.66 ? "south_temperate" : "south_polar",
    lonBand: point.lon < -0.5 ? "far_west" : point.lon < 0 ? "west" : point.lon < 0.5 ? "east" : "far_east",

    topologyBlueprint: true,
    topologyComesBeforeTectonics: true,
    topologyComesBeforeTerrain: true,
    terrainConsumesTopology: true,
    tectonicsConsumesTopology: true,

    landExpansionActive: true,
    landExpansionAreaMultiplier: LAND_EXPANSION_LAW.areaMultiplier,
    landExpansionRadiusScale: LAND_EXPANSION_LAW.radiusScaleForAreaDoubling,
    islandChainMergePermission: LAND_EXPANSION_LAW.islandChainMergePermission,
    smallContinentFormationPermission: LAND_EXPANSION_LAW.smallContinentFormationPermission,

    targetLandRatio: topologyContext.landRatioTarget,
    approximateEarthExposedLandRatio: EARTH_LAND_RATIO_LAW.approximateEarthExposedLandRatio,
    seaLevelThreshold: footprint.seaLevelThreshold,
    seaLevelOffset: footprint.seaLevelOffset,
    seaLevelBoundary: footprint.seaLevelBoundary,
    seaLevelDistance: footprint.seaLevelDistance,
    exposedShelfPermission: footprint.exposedShelfPermission,
    submergedShelfPermission: footprint.submergedShelfPermission,
    coastalExposureIndex: footprint.coastalExposureIndex,

    isLandFootprint: footprint.isLandFootprint,
    isVoidFootprint: footprint.isVoidFootprint,
    isAboveWaterLandFootprint: footprint.isLandFootprint && !footprint.isSouthPolarIceFootprint,
    isCoastline: coastal.isCoastline,
    isBeach: coastal.isBeach,
    isSand: coastal.isSand,
    isRock: coastal.isRock,
    isShelf: coastal.isShelf,
    isIslandFootprint: footprint.isIslandFootprint,
    isConnectedLandSystem: footprint.isConnectedLandSystem,
    isSmallContinentFootprint: footprint.isSmallContinentFootprint,
    isPolarFootprint: footprint.isPolarFootprint,
    isNorthPolarLandFootprint: footprint.isNorthPolarLandFootprint,
    isSouthPolarIceFootprint: footprint.isSouthPolarIceFootprint,

    landBodyId: landBody ? landBody.id : 0,
    landBodyKey: landBody ? landBody.key : "void_ocean",
    landBodyName: landBody ? landBody.name : "Void / Ocean Footprint",
    landBodyRole: landBody ? landBody.role : "ocean and void blueprint",
    islandArcId: islandArc ? islandArc.id : "none",

    landConnectionId: connection ? connection.id : "none",
    landConnectionRole: connection ? connection.role : "none",
    connectedFootprintPressure: footprint.connectedFootprintPressure,
    isthmusPermission: coastal.isthmusPermission,
    peninsulaPermission: coastal.peninsulaPermission,
    bayPermission: coastal.bayPermission,
    inletPermission: coastal.inletPermission,
    coastlineIrregularityIndex: coastal.coastlineIrregularityIndex,

    surfaceClass: surfaceClass.key,
    surfaceClassId: surfaceClass.id,
    surfaceClassName: surfaceClass.name,
    surfaceClassRole: surfaceClass.role,

    landPressure: footprint.landPressure,
    shorelinePressure: coastal.shorelinePressure,
    beachPressure: coastal.beachPressure,
    sandPressure: coastal.sandPressure,
    rockPressure: coastal.rockPressure,
    coastalCliffPressure: coastal.coastalCliffPressure,
    wetEdgePermission: coastal.wetEdgePermission,
    dryEdgePermission: coastal.dryEdgePermission,
    reefShelfPermission: coastal.reefShelfPermission,

    beachType: coastal.beachType,
    blackSandPressure: coastal.blackSandPressure,
    whiteSandPressure: coastal.whiteSandPressure,
    opalSoftnessIndex: coastal.opalSoftnessIndex,
    diamondDarkSandIndex: coastal.diamondDarkSandIndex,
    granitePowderIndex: coastal.granitePowderIndex,
    slateShingleIndex: coastal.slateShingleIndex,
    beachCloudSoftnessIndex: coastal.beachCloudSoftnessIndex,
    coastalComfortIndex: coastal.coastalComfortIndex,

    seaLevelErosionPressure: coastal.seaLevelErosionPressure,
    waveCutPlatformPermission: coastal.waveCutPlatformPermission,
    coastalNotchPermission: coastal.coastalNotchPermission,
    cliffBaseCut: coastal.cliffBaseCut,
    erodedShelfEdge: coastal.erodedShelfEdge,
    collapsedCoastPermission: coastal.collapsedCoastPermission,
    rockyHeadlandPermission: coastal.rockyHeadlandPermission,
    covePermission: coastal.covePermission,

    isSubSea: subsea.isSubSea,
    depthClassId: subsea.depthClassId,
    depthClassKey: subsea.depthClassKey,
    depthClassName: subsea.depthClassName,
    oceanDepthClass: subsea.oceanDepthClass,
    oceanDepthIndex: subsea.oceanDepthIndex,
    shelfDepthIndex: subsea.shelfDepthIndex,
    shallowShelfIndex: subsea.shallowShelfIndex,
    outerShelfIndex: subsea.outerShelfIndex,
    continentalSlopeIndex: subsea.continentalSlopeIndex,
    basinDepthIndex: subsea.basinDepthIndex,
    trenchDepthIndex: subsea.trenchDepthIndex,
    seaFloorShapeIndex: subsea.seaFloorShapeIndex,
    bathymetryBlueprintIndex: subsea.bathymetryBlueprintIndex,
    subSeaBoundaryPressure: subsea.subSeaBoundaryPressure,
    abyssalPermission: subsea.abyssalPermission,
    trenchAxisId: subsea.trenchAxisId,

    isSubterranean: subterranean.isSubterranean,
    subterraneanDepthIndex: subterranean.subterraneanDepthIndex,
    underLandDepthIndex: subterranean.underLandDepthIndex,
    underCoastDepthIndex: subterranean.underCoastDepthIndex,
    underShelfDepthIndex: subterranean.underShelfDepthIndex,
    underBasinDepthIndex: subterranean.underBasinDepthIndex,
    underTrenchDepthIndex: subterranean.underTrenchDepthIndex,
    foundationDensityIndex: subterranean.foundationDensityIndex,
    rockMassBoundaryIndex: subterranean.rockMassBoundaryIndex,
    cavityPermission: subterranean.cavityPermission,
    subsurfacePressureZone: subterranean.subsurfacePressureZone,
    undergroundBoundaryPressure: subterranean.undergroundBoundaryPressure,

    terrainRisePermission: permission.terrainRisePermission,
    terrainHoldPermission: permission.terrainHoldPermission,
    terrainBlockPermission: permission.terrainBlockPermission,
    coastalRisePermission: permission.coastalRisePermission,
    islandRisePermission: permission.islandRisePermission,
    smallContinentRisePermission: permission.smallContinentRisePermission,
    polarRisePermission: permission.polarRisePermission,
    basinDepressionPermission: permission.basinDepressionPermission,
    cliffRisePermission: permission.cliffRisePermission,
    rockExposurePermission: permission.rockExposurePermission,
    terrainSeedClass: permission.terrainSeedClass,

    terrainMayConsume: true,
    tectonicsMayConsume: true,
    hydrationMayConsumeLater: true,
    foliageMayConsume: false,
    ecologyMayConsume: false,

    activeHydrationOwnedHere: false,
    aboveSeaElevationOwnedHere: false,
    terrainReliefOwnedHere: false,
    foliageOwnedHere: false,
    climateOwnedHere: false,
    ecologyOwnedHere: false,

    foliage: false,
    trees: false,
    vegetation: false,

    ownsTopologyBlueprint: true,
    ownsFinalRender: false,
    visualPassClaimed: false
  });
}

export function buildTopologyField(width = 128, height = 128, options = {}) {
  const w = Math.max(8, Math.floor(Number(width) || 128));
  const h = Math.max(8, Math.floor(Number(height) || 128));
  const inputContext = getInputContext(options);

  const auditRatioBeforeCalibration = countLandRatio(Math.min(96, w), Math.min(48, h), options);

  const calibration = inputContext.enforceEarthEquivalentLandRatio
    ? calibrateSeaLevelThreshold(Math.min(96, w), Math.min(48, h), options)
    : Object.freeze({
        targetLandRatio: inputContext.landRatioTarget,
        calibratedSeaLevelThreshold: inputContext.seaLevelThreshold,
        sampledLandRatio: auditRatioBeforeCalibration,
        landRatioDelta: auditRatioBeforeCalibration - inputContext.landRatioTarget,
        seaLevelCorrectionStatus: "audit_only_expansion_first",
        seaLevelCorrectionDirection: "do_not_recalibrate_this_pass",
        landAreaCorrectionIndex: landAreaCorrectionFromRatio(auditRatioBeforeCalibration, inputContext.landRatioTarget).correctionIndex
      });

  const fieldOptions = {
    ...options,
    seaLevelThreshold: calibration.calibratedSeaLevelThreshold,
    seaLevelOffset: 0
  };

  const samples = new Array(w * h);

  const classCounts = new Map();
  const landBodyCounts = new Map();
  const connectionCounts = new Map();
  const trenchCounts = new Map();
  const depthClassCounts = new Map();
  const beachTypeCounts = new Map();

  let landSamples = 0;
  let voidSamples = 0;
  let aboveWaterLandSamples = 0;
  let coastlineSamples = 0;
  let beachSamples = 0;
  let sandSamples = 0;
  let rockSamples = 0;
  let shelfSamples = 0;
  let connectedLandSamples = 0;
  let smallContinentSamples = 0;
  let islandSamples = 0;
  let subSeaSamples = 0;
  let subterraneanSamples = 0;
  let terrainRiseSamples = 0;
  let cavitySamples = 0;
  let foliageSamples = 0;

  let oceanDepthSum = 0;
  let trenchDepthSum = 0;
  let subterraneanDepthSum = 0;
  let terrainRiseSum = 0;
  let beachSum = 0;
  let rockSum = 0;
  let coastlineIrregularitySum = 0;
  let connectionPressureSum = 0;
  let bathymetrySum = 0;
  let seaLevelErosionSum = 0;
  let cliffBaseCutSum = 0;
  let blackSandSum = 0;
  let whiteSandSum = 0;
  let cloudSoftnessSum = 0;

  for (let y = 0; y < h; y += 1) {
    const v = h === 1 ? 0.5 : y / (h - 1);

    for (let x = 0; x < w; x += 1) {
      const u = w === 1 ? 0.5 : x / (w - 1);
      const index = y * w + x;
      const sample = sampleTopology(u, v, fieldOptions);

      samples[index] = sample;

      classCounts.set(sample.surfaceClass, (classCounts.get(sample.surfaceClass) || 0) + 1);
      landBodyCounts.set(sample.landBodyKey, (landBodyCounts.get(sample.landBodyKey) || 0) + 1);
      depthClassCounts.set(sample.depthClassKey, (depthClassCounts.get(sample.depthClassKey) || 0) + 1);
      beachTypeCounts.set(sample.beachType, (beachTypeCounts.get(sample.beachType) || 0) + 1);

      if (sample.landConnectionId !== "none") connectionCounts.set(sample.landConnectionId, (connectionCounts.get(sample.landConnectionId) || 0) + 1);
      if (sample.trenchAxisId !== "none") trenchCounts.set(sample.trenchAxisId, (trenchCounts.get(sample.trenchAxisId) || 0) + 1);

      if (sample.isLandFootprint) landSamples += 1;
      if (sample.isVoidFootprint) voidSamples += 1;
      if (sample.isAboveWaterLandFootprint) aboveWaterLandSamples += 1;
      if (sample.isCoastline) coastlineSamples += 1;
      if (sample.isBeach) beachSamples += 1;
      if (sample.isSand) sandSamples += 1;
      if (sample.isRock) rockSamples += 1;
      if (sample.isShelf) shelfSamples += 1;
      if (sample.isConnectedLandSystem) connectedLandSamples += 1;
      if (sample.isSmallContinentFootprint) smallContinentSamples += 1;
      if (sample.isIslandFootprint) islandSamples += 1;
      if (sample.isSubSea) subSeaSamples += 1;
      if (sample.isSubterranean) subterraneanSamples += 1;
      if (sample.terrainRisePermission > 0.42) terrainRiseSamples += 1;
      if (sample.cavityPermission > 0.42) cavitySamples += 1;
      if (sample.foliage || sample.trees || sample.vegetation) foliageSamples += 1;

      oceanDepthSum += sample.oceanDepthIndex;
      trenchDepthSum += sample.trenchDepthIndex;
      subterraneanDepthSum += sample.subterraneanDepthIndex;
      terrainRiseSum += sample.terrainRisePermission;
      beachSum += sample.beachPressure;
      rockSum += sample.rockPressure;
      coastlineIrregularitySum += sample.coastlineIrregularityIndex;
      connectionPressureSum += sample.connectedFootprintPressure;
      bathymetrySum += sample.bathymetryBlueprintIndex;
      seaLevelErosionSum += sample.seaLevelErosionPressure;
      cliffBaseCutSum += sample.cliffBaseCut;
      blackSandSum += sample.blackSandPressure;
      whiteSandSum += sample.whiteSandPressure;
      cloudSoftnessSum += sample.beachCloudSoftnessIndex;
    }
  }

  const activeSurfaceClasses = Array.from(classCounts.keys()).sort();
  const activeLandBodies = Array.from(landBodyCounts.keys()).sort();
  const activeConnections = Array.from(connectionCounts.keys()).sort();
  const activeTrenchAxes = Array.from(trenchCounts.keys()).sort();
  const activeDepthClasses = Array.from(depthClassCounts.keys()).sort();
  const activeBeachTypes = Array.from(beachTypeCounts.keys()).sort();

  const aboveWaterLandRatio = aboveWaterLandSamples / samples.length;
  const landAreaCorrection = landAreaCorrectionFromRatio(aboveWaterLandRatio, calibration.targetLandRatio);

  return Object.freeze({
    receipt: RECEIPT,
    runtimeCompatibleReceipt: RUNTIME_COMPATIBLE_RECEIPT,
    previousReceipts: PREVIOUS_RECEIPTS,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    parentAuthority: PARENT_AUTHORITY,
    tectonicsHandoffTarget: TECTONICS_HANDOFF_TARGET,
    terrainHandoffTarget: TERRAIN_HANDOFF_TARGET,
    width: w,
    height: h,
    samples,
    profile: createTopologyProfile(options.profile || {}),
    calibration,
    stats: Object.freeze({
      totalSamples: samples.length,

      landSamples,
      voidSamples,
      aboveWaterLandSamples,
      coastlineSamples,
      beachSamples,
      sandSamples,
      rockSamples,
      shelfSamples,
      connectedLandSamples,
      smallContinentSamples,
      islandSamples,
      subSeaSamples,
      subterraneanSamples,
      terrainRiseSamples,
      cavitySamples,
      foliageSamples,

      landRatio: landSamples / samples.length,
      voidRatio: voidSamples / samples.length,
      aboveWaterLandRatio,
      targetLandRatio: calibration.targetLandRatio,
      approximateEarthExposedLandRatio: EARTH_LAND_RATIO_LAW.approximateEarthExposedLandRatio,
      landRatioDelta: aboveWaterLandRatio - calibration.targetLandRatio,
      landAreaCorrectionStatus: landAreaCorrection.status,
      landAreaCorrectionDirection: landAreaCorrection.direction,
      landAreaCorrectionIndex: landAreaCorrection.correctionIndex,
      calibratedSeaLevelThreshold: calibration.calibratedSeaLevelThreshold,
      landExpansionAreaMultiplier: LAND_EXPANSION_LAW.areaMultiplier,
      landExpansionRadiusScale: LAND_EXPANSION_LAW.radiusScaleForAreaDoubling,
      landExpansionMode: EARTH_LAND_RATIO_LAW.currentPassMode,

      coastlineRatio: coastlineSamples / samples.length,
      beachRatio: beachSamples / samples.length,
      shelfRatio: shelfSamples / samples.length,
      connectedLandRatio: connectedLandSamples / samples.length,
      smallContinentRatio: smallContinentSamples / samples.length,
      islandRatio: islandSamples / samples.length,
      subSeaRatio: subSeaSamples / samples.length,
      subterraneanRatio: subterraneanSamples / samples.length,
      terrainRiseRatio: terrainRiseSamples / samples.length,

      activeSurfaceClassCount: activeSurfaceClasses.length,
      expectedSurfaceClassCount: SURFACE_CLASSES.length,
      activeSurfaceClasses,

      activeLandBodyCount: activeLandBodies.length,
      expectedLandBodyCount: LAND_BODIES.length,
      activeLandBodies,

      activeConnectionCount: activeConnections.length,
      expectedConnectionCount: LAND_CONNECTIONS.length,
      activeConnections,

      activeDepthClassCount: activeDepthClasses.length,
      expectedDepthClassCount: DEPTH_CLASSES.length,
      activeDepthClasses,

      activeBeachTypeCount: activeBeachTypes.length,
      expectedBeachTypes: BEACH_TYPES,
      activeBeachTypes,

      activeTrenchAxisCount: activeTrenchAxes.length,
      expectedTrenchAxisCount: OCEAN_TRENCHES.length,
      activeTrenchAxes,

      averageOceanDepthIndex: oceanDepthSum / samples.length,
      averageTrenchDepthIndex: trenchDepthSum / samples.length,
      averageSubterraneanDepthIndex: subterraneanDepthSum / samples.length,
      averageTerrainRisePermission: terrainRiseSum / samples.length,
      averageBeachPressure: beachSum / samples.length,
      averageRockPressure: rockSum / samples.length,
      averageCoastlineIrregularityIndex: coastlineIrregularitySum / samples.length,
      averageConnectedFootprintPressure: connectionPressureSum / samples.length,
      averageBathymetryBlueprintIndex: bathymetrySum / samples.length,
      averageSeaLevelErosionPressure: seaLevelErosionSum / samples.length,
      averageCliffBaseCut: cliffBaseCutSum / samples.length,
      averageBlackSandPressure: blackSandSum / samples.length,
      averageWhiteSandPressure: whiteSandSum / samples.length,
      averageBeachCloudSoftnessIndex: cloudSoftnessSum / samples.length,

      topologyBlueprintActive: true,
      landExpansionActive: true,
      smallContinentFormationActive: true,
      earthEquivalentLandRatioAuditActive: true,
      seaLevelCorrectionAvailableButNotAppliedByDefault: true,
      bathymetryActive: true,
      blackWhiteBeachLawActive: true,
      cliffErosionActive: true,
      connectedLandFootprintActive: true,
      irregularCoastlineActive: true,
      landVoidBlueprintActive: true,
      seaLevelBoundaryActive: true,
      beachSandRockBoundaryActive: true,
      subSeaDepthBlueprintActive: true,
      subterraneanBlueprintActive: true,
      tectonicsHandoffReady: true,
      terrainHandoffReady: true,
      hydrationHandoffLater: true,

      aboveSeaElevationOwnedHere: false,
      terrainReliefOwnedHere: false,
      activeHydrationOwnedHere: false,
      foliageOwnedHere: false,
      climateOwnedHere: false,
      ecologyOwnedHere: false,
      visualPassClaimed: false
    }),
    topologyBlueprint: true,
    topologyComesBeforeTectonics: true,
    topologyComesBeforeTerrain: true,
    tectonicsMayConsume: true,
    terrainMayConsume: true,
    hydrationMayConsumeLater: true,
    visualPassClaimed: false
  });
}

export function getTopologySampleFromField(field, uInput, vInput) {
  if (!field || !Array.isArray(field.samples) || !field.width || !field.height) {
    return sampleTopology(uInput, vInput);
  }

  const u = ((Number(uInput) || 0) % 1 + 1) % 1;
  const v = clamp(Number(vInput) || 0, 0, 1);

  const x = clamp(Math.round(u * (field.width - 1)), 0, field.width - 1);
  const y = clamp(Math.round(v * (field.height - 1)), 0, field.height - 1);

  return field.samples[y * field.width + x];
}

export function estimateEarthEquivalentSeaLevel(width = 96, height = 48, options = {}) {
  return calibrateSeaLevelThreshold(width, height, options);
}

export function getTopologyStatus() {
  return Object.freeze({
    ok: true,

    receipt: RUNTIME_COMPATIBLE_RECEIPT,
    activeContract: ACTIVE_CONTRACT,
    latestContract: ACTIVE_CONTRACT,
    previousReceipts: PREVIOUS_RECEIPTS,

    status: "active",
    id: "audralia-g1-topology-landmass-100-percent-expansion-small-continents",
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    parentAuthority: PARENT_AUTHORITY,
    tectonicsHandoffTarget: TECTONICS_HANDOFF_TARGET,
    terrainHandoffTarget: TERRAIN_HANDOFF_TARGET,

    role: "landmass-100-percent-expansion-small-continent-blueprint-child",
    topologyBlueprint: true,
    topologyComesBeforeTectonics: true,
    topologyComesBeforeTerrain: true,
    terrainConsumesTopology: true,
    tectonicsConsumesTopology: true,

    landExpansionLaw: LAND_EXPANSION_LAW,
    earthLandRatioLaw: EARTH_LAND_RATIO_LAW,
    seaLevelLaw: SEA_LEVEL_LAW,
    topologyLaw: TOPOLOGY_LAW,

    approximateEarthExposedLandRatio: EARTH_LAND_RATIO_LAW.approximateEarthExposedLandRatio,
    defaultSeaLevelThreshold: SEA_LEVEL_LAW.defaultSeaLevelThreshold,
    landRatioTarget: EARTH_LAND_RATIO_LAW.approximateEarthExposedLandRatio,
    landExpansionAreaMultiplier: LAND_EXPANSION_LAW.areaMultiplier,
    landExpansionRadiusScale: LAND_EXPANSION_LAW.radiusScaleForAreaDoubling,
    landExpansionCurrentPassMode: EARTH_LAND_RATIO_LAW.currentPassMode,

    landBodyCount: LAND_BODIES.length,
    surfaceClassCount: SURFACE_CLASSES.length,
    depthClassCount: DEPTH_CLASSES.length,
    beachTypeCount: BEACH_TYPES.length,
    landConnectionCount: LAND_CONNECTIONS.length,
    peninsulaSeedCount: PENINSULA_SEEDS.length,
    bayCutCount: BAY_CUTS.length,
    islandFootprintArcCount: ISLAND_FOOTPRINT_ARCS.length,
    oceanTrenchCount: OCEAN_TRENCHES.length,

    landExpansion: "active",
    smallContinentFormation: "active",
    islandChainMergePermission: "active",
    connectedLandFootprint: "active",
    irregularCoastline: "active",
    seaLevelCorrection: "available_audit_second",
    bathymetry: "active",
    oceanDepths: "active",
    cliffErosion: "active",
    blackWhiteMineralBeaches: "active",

    aboveWaterLandFootprintOwnedHere: true,
    beachesOwnedHere: true,
    sandOwnedHere: true,
    rockOwnedHere: true,
    coastlineOwnedHere: true,
    seaLevelOwnedHere: true,
    bathymetryOwnedHere: true,
    oceanDepthOwnedHere: true,
    cliffBaseOwnedHere: true,
    seaLevelErosionOwnedHere: true,
    landBodyConnectionsOwnedHere: true,
    intentionalIslandSeparationOwnedHere: true,

    ownsTopologyBlueprint: true,
    ownsLandVoidFootprint: true,
    ownsAboveWaterLandFootprint: true,
    ownsLandmassExpansion: true,
    ownsIslandChainConnection: true,
    ownsSmallContinentFormation: true,
    ownsEarthEquivalentLandRatioAudit: true,
    ownsSeaLevelBoundary: true,
    ownsSeaLevelCorrection: true,
    ownsBeachSandRockBoundary: true,
    ownsBlackWhiteMineralBeachLaw: true,
    ownsCoastlineIrregularity: true,
    ownsSeaLevelErosion: true,
    ownsCliffBase: true,
    ownsLandBodyConnections: true,
    ownsIslandSeparation: true,
    ownsBathymetry: true,
    ownsOceanDepths: true,
    ownsSubSeaDepthBlueprint: true,
    ownsSubterraneanBlueprint: true,
    ownsTerrainRisePermissions: true,

    ownsAboveSeaElevation: false,
    ownsTerrainRelief: false,
    ownsMountains: false,
    ownsRidges: false,
    ownsCanyons: false,
    ownsValleys: false,
    ownsHydration: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFoliage: false,
    ownsTrees: false,
    ownsVegetation: false,
    ownsFauna: false,
    ownsRuntime: false,
    ownsFinalRender: false,

    noFoliageLaw: "active",
    ownsFoliageLawfully: false,
    ownsTreesLawfully: false,
    ownsVegetationLawfully: false,

    terrainMayConsume: true,
    tectonicsMayConsume: true,
    hydrationMayConsumeLater: true,
    foliageMayConsume: false,
    ecologyMayConsume: false,

    exports: Object.freeze([
      "createTopologyProfile",
      "sampleTopology",
      "buildTopologyField",
      "getTopologySampleFromField",
      "estimateEarthEquivalentSeaLevel",
      "getTopologyStatus"
    ]),

    surfaceClasses: SURFACE_CLASSES,
    depthClasses: DEPTH_CLASSES,
    beachTypes: BEACH_TYPES,
    landBodies: LAND_BODIES,
    landConnections: LAND_CONNECTIONS,
    peninsulaSeeds: PENINSULA_SEEDS,
    bayCuts: BAY_CUTS,
    islandFootprintArcs: ISLAND_FOOTPRINT_ARCS,
    oceanTrenches: OCEAN_TRENCHES,

    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false,
    generationPassClaimed: false
  });
}

export default Object.freeze({
  createTopologyProfile,
  sampleTopology,
  buildTopologyField,
  getTopologySampleFromField,
  estimateEarthEquivalentSeaLevel,
  getTopologyStatus
});

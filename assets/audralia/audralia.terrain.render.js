// /assets/audralia/audralia.terrain.render.js
// AUDRALIA_G1_TERRAIN_CONSUME_TOPOLOGY_TECTONICS_RELIEF_LOCK_TNT_v1
//
// Role:
// - Final terrain authority before hydration.
// - Consumes topology first.
// - Consumes tectonics second.
// - Adds above-sea elevation, relief, mountains, canyons, valleys, cliffs,
//   basins, plateaus, riverbeds, stream cuts, lake basins, glacier seats,
//   floodplain readiness, and delta readiness.
//
// Hard locks:
// - Topology owns land/void footprint.
// - Topology owns sea level, beaches as boundary, ocean depth, shelves, and bathymetry.
// - Tectonics owns plates, mineral stress, ancient mountain memory, and pressure handoff.
// - Terrain may add elevation and relief only where topology permits land.
// - Terrain must not expand land.
// - Terrain must not create islands.
// - Terrain must not fill water.
// - Terrain must not own hydration.
// - Terrain must not own foliage, trees, vegetation, climate, ecology, fauna, route, runtime, or final visual pass.

import {
  sampleTopology,
  getTopologyStatus
} from "./audralia.topology.render.js?v=AUDRALIA_G1_TOPOLOGY_LANDMASS_100_PERCENT_EXPANSION_SMALL_CONTINENTS_TNT_v1";

import {
  sampleTectonics,
  getTectonicsStatus
} from "./audralia.tectonics.render.js?v=AUDRALIA_G1_TECTONIC_PLATE_LAYER_EARTH_LAND_AREA_ANCIENT_MOUNTAIN_MEMORY_TNT_v1";

const RECEIPT = "AUDRALIA_G1_TERRAIN_CONSUME_TOPOLOGY_TECTONICS_RELIEF_LOCK_TNT_v1";

const PREVIOUS_RECEIPTS = Object.freeze([
  "AUDRALIA_G1_TERRAIN_HYDROLOGY_MAP_CHILD_TNT_v1",
  "AUDRALIA_G1_FULL_PLANET_TERRAIN_PURIFICATION_MAP_TNT_v1",
  "AUDRALIA_G1_TERRAIN_PRESSURE_ISLAND_ELEVATION_CHILD_TNT_v2"
]);

const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1_TERRAIN_FINAL_RELIEF_BEFORE_HYDRATION";
const FILE = "/assets/audralia/audralia.terrain.render.js";

const TOPOLOGY_AUTHORITY = "/assets/audralia/audralia.topology.render.js";
const TECTONICS_AUTHORITY = "/assets/audralia/audralia.tectonics.render.js";
const HYDRATION_AUTHORITY_LATER = "/assets/audralia/audralia.hydration.render.js";

const TERRAIN_LAW = Object.freeze({
  role: "above-sea-elevation-and-relief-authority",
  finalTerrainBeforeHydration: true,

  consumesTopology: true,
  consumesTectonics: true,
  terrainRespectsTopologyLandArea: true,
  terrainMustNotExpandLandArea: true,
  terrainMayUseForElevationReliefOnly: true,
  terrainNeverCreatesLand: true,
  terrainNeverCreatesIslands: true,
  terrainNeverChangesSeaLevel: true,

  topologyOwnsLandFootprint: true,
  topologyOwnsSeaLevel: true,
  topologyOwnsBathymetry: true,
  topologyOwnsBeachesAsBoundary: true,
  tectonicsOwnsPlatePressure: true,
  tectonicsOwnsMineralMemory: true,

  ownsAboveSeaElevation: true,
  ownsTerrainRelief: true,
  ownsMountains: true,
  ownsRidges: true,
  ownsCanyons: true,
  ownsValleys: true,
  ownsCliffs: true,
  ownsPlateaus: true,
  ownsBasins: true,
  ownsRiverbeds: true,
  ownsStreamCuts: true,
  ownsLakeBasins: true,
  ownsGlacierSeats: true,
  ownsFloodplainReadiness: true,
  ownsDeltaReadiness: true,
  ownsHydrologyReadinessLayout: true,

  ownsLandFootprint: false,
  ownsSeaLevel: false,
  ownsBathymetry: false,
  ownsActiveHydration: false,
  ownsWaterFill: false,
  ownsClimate: false,
  ownsEcology: false,
  ownsFoliage: false,
  ownsTrees: false,
  ownsVegetation: false,
  ownsFauna: false,
  ownsRuntime: false,
  ownsRouteShell: false,
  ownsFinalRender: false,
  visualPassClaimed: false
});

const TERRAIN_REGIONS = Object.freeze([
  Object.freeze({ id: 1, key: "character", name: "Character", baseElevation: 0.18, reliefBias: 0.30, hydrologyBias: 0.44 }),
  Object.freeze({ id: 2, key: "structure", name: "Structure", baseElevation: 0.27, reliefBias: 0.38, hydrologyBias: 0.38 }),
  Object.freeze({ id: 3, key: "balance", name: "Balance", baseElevation: 0.34, reliefBias: 0.34, hydrologyBias: 0.58 }),
  Object.freeze({ id: 4, key: "stability", name: "Stability", baseElevation: 0.43, reliefBias: 0.44, hydrologyBias: 0.42 }),
  Object.freeze({ id: 5, key: "peace", name: "Peace", baseElevation: 0.50, reliefBias: 0.32, hydrologyBias: 0.62 }),
  Object.freeze({ id: 6, key: "joy", name: "Joy", baseElevation: 0.58, reliefBias: 0.46, hydrologyBias: 0.56 }),
  Object.freeze({ id: 7, key: "dignity", name: "Dignity", baseElevation: 0.68, reliefBias: 0.70, hydrologyBias: 0.34 }),
  Object.freeze({ id: 8, key: "free_will", name: "Free Will", baseElevation: 0.76, reliefBias: 0.82, hydrologyBias: 0.30 }),
  Object.freeze({ id: 9, key: "love", name: "Love", baseElevation: 0.86, reliefBias: 0.92, hydrologyBias: 0.48 })
]);

const RELIEF_ZONES = Object.freeze([
  "ocean_no_terrain",
  "south_polar_ice_seat",
  "coastal_lowland",
  "beach_backrise",
  "cliff_wall",
  "low_plain",
  "plateau_table",
  "basin_floor",
  "valley_cut",
  "canyon_cut",
  "ridge_backbone",
  "mountain_chain",
  "weathered_highland",
  "glacier_source",
  "summit_memory"
]);

const WATERSHED_CORRIDORS = Object.freeze([
  Object.freeze({ id: "w01_origin_lowland_run", fromRegion: 1, toRegion: 3, gradient: 0.34, lakeBias: 0.42, riverBias: 0.52 }),
  Object.freeze({ id: "w02_structure_plateau_cut", fromRegion: 2, toRegion: 4, gradient: 0.40, lakeBias: 0.26, riverBias: 0.46 }),
  Object.freeze({ id: "w03_balance_basin_receiver", fromRegion: 3, toRegion: 5, gradient: 0.24, lakeBias: 0.70, riverBias: 0.40 }),
  Object.freeze({ id: "w04_stability_upland_channel", fromRegion: 4, toRegion: 3, gradient: 0.46, lakeBias: 0.22, riverBias: 0.58 }),
  Object.freeze({ id: "w05_peace_protected_lake_basin", fromRegion: 5, toRegion: 1, gradient: 0.22, lakeBias: 0.82, riverBias: 0.38 }),
  Object.freeze({ id: "w06_joy_island_streams", fromRegion: 6, toRegion: 3, gradient: 0.50, lakeBias: 0.24, riverBias: 0.64 }),
  Object.freeze({ id: "w07_dignity_mineral_canyon", fromRegion: 7, toRegion: 4, gradient: 0.68, lakeBias: 0.14, riverBias: 0.70 }),
  Object.freeze({ id: "w08_free_will_frontier_gorge", fromRegion: 8, toRegion: 2, gradient: 0.78, lakeBias: 0.10, riverBias: 0.76 }),
  Object.freeze({ id: "w09_love_summit_source", fromRegion: 9, toRegion: 5, gradient: 0.86, lakeBias: 0.30, riverBias: 0.84 })
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
    total += valueNoise(x * frequency, y * frequency, seed + i * 31.17) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return total / Math.max(0.00001, normalizer);
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
    coherenceIndex: clamp(Number.isFinite(Number(context.coherenceIndex)) ? Number(context.coherenceIndex) : 0.94, 0, 1),
    collaborativeExpression: clamp(Number.isFinite(Number(context.collaborativeExpression)) ? Number(context.collaborativeExpression) : 0.90, 0, 1),
    reliefDemand: clamp(Number.isFinite(Number(context.reliefDemand)) ? Number(context.reliefDemand) : 0.92, 0, 1),
    canyonDemand: clamp(Number.isFinite(Number(context.canyonDemand)) ? Number(context.canyonDemand) : 0.84, 0, 1),
    hydrologyReadinessDemand: clamp(Number.isFinite(Number(context.hydrologyReadinessDemand)) ? Number(context.hydrologyReadinessDemand) : 0.82, 0, 1),
    glacierDemand: clamp(Number.isFinite(Number(context.glacierDemand)) ? Number(context.glacierDemand) : 0.72, 0, 1),
    terrainMayUseForElevationReliefOnly: true,
    terrainMustNotExpandLandArea: true,
    hydrationEnabled: false,
    foliageEnabled: false,
    visualPassClaimed: false
  });
}

function safeTopology(u, v, context) {
  try {
    return sampleTopology(u, v, context.topologyContext || {});
  } catch (error) {
    const point = normalizeUV(u, v);
    return Object.freeze({
      receipt: "TERRAIN_SAFE_TOPOLOGY_FALLBACK",
      u: point.u,
      v: point.v,
      lon: point.lon,
      lat: point.lat,
      isLandFootprint: false,
      isAboveWaterLandFootprint: false,
      isVoidFootprint: true,
      isSouthPolarIceFootprint: point.lat < -0.78,
      surfaceClass: point.lat < -0.78 ? "polar_ice_footprint" : "void_mid_ocean",
      landBodyId: 0,
      landBodyKey: "void_ocean",
      terrainRisePermission: 0,
      terrainBlockPermission: 1,
      oceanDepthIndex: 0.56,
      bathymetryBlueprintIndex: 0.48,
      shorelinePressure: 0,
      beachPressure: 0,
      rockPressure: 0,
      coastalCliffPressure: 0,
      cliffBaseCut: 0,
      seaLevelErosionPressure: 0,
      visualPassClaimed: false
    });
  }
}

function safeTectonics(u, v, topology, context) {
  try {
    return sampleTectonics(u, v, topology, context.tectonicsContext || {});
  } catch (error) {
    return Object.freeze({
      receipt: "TERRAIN_SAFE_TECTONICS_FALLBACK",
      u,
      v,
      topologyLandFootprint: Boolean(topology && topology.isLandFootprint),
      plateId: 0,
      plateKey: "fallback_plate",
      crustalStressIndex: 0,
      primordialMountainMemoryIndex: 0,
      weatheredRemnantIndex: 0,
      mountainChainPermission: 0,
      canyonPermission: 0,
      cliffPermission: 0,
      upliftPermission: 0,
      terrainPressureHandoff: 0,
      diamondPressureIndex: 0,
      opalSeamIndex: 0,
      graniteCratonIndex: 0,
      slateFoldBeltIndex: 0,
      exposedMineralHardnessIndex: 0,
      ownsLandFootprint: false,
      ownsAboveSeaElevation: false,
      ownsFoliage: false,
      visualPassClaimed: false
    });
  }
}

function isTopologyLand(topology) {
  return Boolean(
    topology &&
      (
        topology.isLandFootprint ||
        topology.isAboveWaterLandFootprint ||
        topology.topologyLandFootprint
      )
  );
}

function isTopologyIce(topology) {
  return Boolean(
    topology &&
      (
        topology.isSouthPolarIceFootprint ||
        topology.isIce ||
        topology.southIce ||
        topology.surfaceClass === "polar_ice_footprint" ||
        topology.topologySurfaceClass === "polar_ice_footprint"
      )
  );
}

function regionFromTopology(topology, tectonics, elevationSeed) {
  const topologyRegionId = Number(topology.regionId || topology.terrainRegionId || topology.landBodyId || 0);
  const tectonicLift = clamp(Number(tectonics.terrainPressureHandoff) || Number(tectonics.mountainChainPermission) || 0, 0, 1);
  const elevationBased = Math.max(1, Math.min(9, Math.round(clamp(elevationSeed + tectonicLift * 0.20, 0, 1) * 8 + 1)));

  const id = topologyRegionId >= 1 && topologyRegionId <= 9 ? topologyRegionId : elevationBased;
  return TERRAIN_REGIONS[id - 1] || TERRAIN_REGIONS[0];
}

function watershedForRegion(region, lon, lat) {
  let best = WATERSHED_CORRIDORS[0];
  let bestScore = -Infinity;

  for (const corridor of WATERSHED_CORRIDORS) {
    const involved = corridor.fromRegion === region.id || corridor.toRegion === region.id ? 1 : 0;
    const texture = fbm(lon * 2.4 + corridor.fromRegion, lat * 2.4 - corridor.toRegion, 1600 + corridor.fromRegion * 11 + corridor.toRegion, 3);
    const score = involved * 2 + corridor.gradient * 0.8 + corridor.riverBias * 0.5 + texture * 0.4;

    if (score > bestScore) {
      bestScore = score;
      best = corridor;
    }
  }

  return best;
}

function reliefSignals(point, topology, tectonics, context) {
  const land = isTopologyLand(topology);
  const ice = isTopologyIce(topology);

  const coast = clamp(Number(topology.shorelinePressure) || Number(topology.coastalExposureIndex) || 0, 0, 1);
  const cliffTopology = clamp(Number(topology.cliffBaseCut) || Number(topology.coastalCliffPressure) || 0, 0, 1);
  const seaErosion = clamp(Number(topology.seaLevelErosionPressure) || 0, 0, 1);
  const terrainRise = clamp(Number(topology.terrainRisePermission) || Number(topology.topologyTerrainRisePermission) || 0, 0, 1);
  const terrainBlock = clamp(Number(topology.terrainBlockPermission) || 0, 0, 1);
  const bathymetry = clamp(Number(topology.oceanDepthIndex) || Number(topology.bathymetryBlueprintIndex) || 0, 0, 1);

  const crustStress = clamp(Number(tectonics.crustalStressIndex) || 0, 0, 1);
  const uplift = clamp(Number(tectonics.upliftPermission) || 0, 0, 1);
  const mountainMemory = clamp(Number(tectonics.primordialMountainMemoryIndex) || 0, 0, 1);
  const weathered = clamp(Number(tectonics.weatheredRemnantIndex) || 0, 0, 1);
  const mountainTectonics = clamp(Number(tectonics.mountainChainPermission) || 0, 0, 1);
  const canyonTectonics = clamp(Number(tectonics.canyonPermission) || 0, 0, 1);
  const cliffTectonics = clamp(Number(tectonics.cliffPermission) || 0, 0, 1);
  const terrainHandoff = clamp(Number(tectonics.terrainPressureHandoff) || 0, 0, 1);

  const diamond = clamp(Number(tectonics.diamondPressureIndex) || 0, 0, 1);
  const opal = clamp(Number(tectonics.opalSeamIndex) || 0, 0, 1);
  const granite = clamp(Number(tectonics.graniteCratonIndex) || 0, 0, 1);
  const slate = clamp(Number(tectonics.slateFoldBeltIndex) || 0, 0, 1);
  const mineralHardness = clamp(Number(tectonics.exposedMineralHardnessIndex) || diamond * 0.32 + granite * 0.30 + slate * 0.24 + opal * 0.14, 0, 1);

  const broadNoise = fbm(point.lon * 4.0 + 3.1, point.lat * 4.0 - 2.2, 2100, 5);
  const ridgeNoise = fbm(point.lon * 9.5 - 4.4, point.lat * 9.5 + 1.8, 2200, 5);
  const fineNoise = fbm(point.lon * 25.0 + 0.8, point.lat * 25.0 - 1.6, 2300, 4);
  const cutNoise = fbm(point.lon * 15.0 - 5.3, point.lat * 15.0 + 4.7, 2400, 4);

  if (!land && !ice) {
    return Object.freeze({
      land,
      ice,
      normalizedElevation: -bathymetry,
      baseElevation: -bathymetry,
      ridge: 0,
      mountainPressure: 0,
      mountainHardness: 0,
      canyonPressure: 0,
      riverIncisionPressure: 0,
      streamBranchPressure: 0,
      valleyChannelPressure: 0,
      cliffPressure: 0,
      plateauPressure: 0,
      basin: 0,
      basinCutPressure: 0,
      slope: 0,
      coastPressure: coast,
      shelfPermission: clamp(Number(topology.reefShelfPermission) || Number(topology.shelfDepthIndex) || 0, 0, 1),
      dryInteriorPressure: 0,
      glacierSeatPressure: 0,
      snowpackSourcePressure: 0,
      floodplainPressure: 0,
      deltaReceiverPressure: coast,
      lakeBasinPressure: 0,
      riverbedPressure: 0,
      streamPressure: 0,
      hydrologyReadinessIndex: 0,
      terrainNoise: broadNoise,
      fineTerrainNoise: fineNoise,
      reliefZone: "ocean_no_terrain"
    });
  }

  if (ice) {
    const polarTexture = clamp(0.62 + broadNoise * 0.24 + fineNoise * 0.14, 0, 1);
    return Object.freeze({
      land: false,
      ice: true,
      normalizedElevation: 0,
      baseElevation: 0,
      ridge: 0,
      mountainPressure: 0,
      mountainHardness: mineralHardness,
      canyonPressure: 0,
      riverIncisionPressure: 0,
      streamBranchPressure: 0,
      valleyChannelPressure: 0,
      cliffPressure: 0,
      plateauPressure: 0,
      basin: 0,
      basinCutPressure: 0,
      slope: 0,
      coastPressure: coast,
      shelfPermission: 0,
      dryInteriorPressure: 0,
      glacierSeatPressure: polarTexture,
      snowpackSourcePressure: polarTexture,
      floodplainPressure: 0,
      deltaReceiverPressure: 0,
      lakeBasinPressure: 0,
      riverbedPressure: 0,
      streamPressure: 0,
      hydrologyReadinessIndex: clamp(polarTexture * 0.32, 0, 1),
      terrainNoise: broadNoise,
      fineTerrainNoise: fineNoise,
      reliefZone: "south_polar_ice_seat"
    });
  }

  const baseSeed = clamp(
    terrainRise * 0.30 +
      terrainHandoff * 0.24 +
      uplift * 0.16 +
      mountainMemory * 0.12 +
      broadNoise * 0.10 +
      (1 - coast) * 0.08,
    0,
    1
  );

  const region = regionFromTopology(topology, tectonics, baseSeed);
  const regionLift = region.baseElevation * 0.28 + region.reliefBias * 0.14;

  const mountainPressure = clamp(
    mountainTectonics * 0.32 +
      mountainMemory * 0.22 +
      uplift * 0.16 +
      crustStress * 0.10 +
      ridgeNoise * 0.12 +
      context.reliefDemand * 0.08,
    0,
    1
  );

  const ridge = clamp(
    mountainPressure * 0.44 +
      terrainHandoff * 0.18 +
      mineralHardness * 0.14 +
      ridgeNoise * 0.18 +
      weathered * 0.06,
    0,
    1
  );

  const canyonPressure = clamp(
    canyonTectonics * 0.36 +
      crustStress * 0.14 +
      ridge * 0.14 +
      Math.max(0, cutNoise - 0.44) * 0.42 +
      context.canyonDemand * 0.08 -
      coast * 0.08,
    0,
    1
  );

  const valleyChannelPressure = clamp(
    canyonPressure * 0.42 +
      (1 - mountainPressure) * 0.18 +
      cutNoise * 0.20 +
      region.hydrologyBias * 0.12 +
      coast * 0.08,
    0,
    1
  );

  const plateauPressure = clamp(
    (1 - canyonPressure) * 0.20 +
      granite * 0.22 +
      slate * 0.10 +
      region.reliefBias * 0.18 +
      smoothstep(0.36, 0.68, baseSeed) * 0.22,
    0,
    1
  );

  const basin = clamp(
    (1 - ridge) * 0.22 +
      valleyChannelPressure * 0.18 +
      region.hydrologyBias * 0.18 +
      Math.max(0, 0.52 - broadNoise) * 0.34 +
      coast * 0.08,
    0,
    1
  );

  const basinCutPressure = clamp(basin * 0.44 + valleyChannelPressure * 0.20 + seaErosion * 0.12, 0, 1);

  const cliffPressure = clamp(
    cliffTopology * 0.36 +
      cliffTectonics * 0.34 +
      seaErosion * 0.14 +
      mineralHardness * 0.10 +
      coast * 0.06,
    0,
    1
  );

  const dryInteriorPressure = clamp(
    (1 - coast) * 0.34 +
      mineralHardness * 0.18 +
      Math.abs(point.lat) * 0.10 +
      (1 - region.hydrologyBias) * 0.16 +
      fineNoise * 0.10,
    0,
    1
  );

  const glacierSeatPressure = clamp(
    smoothstep(0.62, 0.92, point.lat) * 0.30 +
      smoothstep(0.66, 0.94, baseSeed + mountainPressure * 0.34) * 0.38 +
      mountainPressure * 0.18 +
      context.glacierDemand * 0.08,
    0,
    1
  );

  const snowpackSourcePressure = clamp(glacierSeatPressure * 0.72 + mountainPressure * 0.20 + smoothstep(0.65, 0.95, point.lat) * 0.16, 0, 1);

  const normalizedElevation = clamp(
    baseSeed * 0.34 +
      regionLift +
      ridge * 0.18 +
      mountainPressure * 0.16 +
      plateauPressure * 0.08 -
      canyonPressure * 0.08 -
      basin * 0.05 -
      coast * 0.04,
    0.03,
    0.98
  );

  const slope = clamp(
    ridge * 0.30 +
      cliffPressure * 0.24 +
      canyonPressure * 0.18 +
      Math.abs(fineNoise - broadNoise) * 0.26 +
      mountainPressure * 0.14,
    0,
    1
  );

  const watershed = watershedForRegion(region, point.lon, point.lat);

  const riverIncisionPressure = clamp(
    canyonPressure * 0.34 +
      valleyChannelPressure * 0.24 +
      watershed.riverBias * 0.16 +
      mountainPressure * 0.10 +
      context.hydrologyReadinessDemand * 0.10,
    0,
    1
  );

  const streamBranchPressure = clamp(
    riverIncisionPressure * 0.34 +
      ridge * 0.18 +
      fineNoise * 0.18 +
      watershed.gradient * 0.14 +
      region.hydrologyBias * 0.10,
    0,
    1
  );

  const riverbedPressure = clamp(
    riverIncisionPressure * 0.42 +
      valleyChannelPressure * 0.24 +
      streamBranchPressure * 0.16 +
      basin * 0.08,
    0,
    1
  );

  const streamPressure = clamp(
    streamBranchPressure * 0.48 +
      riverbedPressure * 0.22 +
      ridge * 0.12 +
      fineNoise * 0.10,
    0,
    1
  );

  const lakeBasinPressure = clamp(
    basin * 0.34 +
      basinCutPressure * 0.24 +
      watershed.lakeBias * 0.20 +
      (1 - slope) * 0.12 +
      Math.max(0, 0.48 - canyonPressure) * 0.10,
    0,
    1
  );

  const floodplainPressure = clamp(
    coast * 0.20 +
      basin * 0.22 +
      riverbedPressure * 0.22 +
      lakeBasinPressure * 0.12 +
      (1 - slope) * 0.12 +
      valleyChannelPressure * 0.12,
    0,
    1
  );

  const deltaReceiverPressure = clamp(
    coast * 0.42 +
      riverbedPressure * 0.20 +
      floodplainPressure * 0.16 +
      seaErosion * 0.10 +
      (topology.isCoastline ? 0.12 : 0),
    0,
    1
  );

  const hydrologyReadinessIndex = clamp(
    riverbedPressure * 0.18 +
      streamPressure * 0.14 +
      lakeBasinPressure * 0.13 +
      glacierSeatPressure * 0.12 +
      floodplainPressure * 0.12 +
      deltaReceiverPressure * 0.10 +
      valleyChannelPressure * 0.10 +
      canyonPressure * 0.08 +
      context.hydrologyReadinessDemand * 0.03,
    0,
    1
  );

  let reliefZone = "low_plain";
  if (glacierSeatPressure > 0.64) reliefZone = "glacier_source";
  else if (mountainPressure > 0.76 && normalizedElevation > 0.74) reliefZone = "summit_memory";
  else if (mountainPressure > 0.62) reliefZone = "mountain_chain";
  else if (ridge > 0.62) reliefZone = "ridge_backbone";
  else if (canyonPressure > 0.58) reliefZone = "canyon_cut";
  else if (valleyChannelPressure > 0.54) reliefZone = "valley_cut";
  else if (cliffPressure > 0.54) reliefZone = "cliff_wall";
  else if (plateauPressure > 0.56) reliefZone = "plateau_table";
  else if (basin > 0.58) reliefZone = "basin_floor";
  else if (topology.isBeach || topology.isSand) reliefZone = "beach_backrise";
  else if (coast > 0.42) reliefZone = "coastal_lowland";
  else if (weathered > 0.52) reliefZone = "weathered_highland";

  return Object.freeze({
    land,
    ice,
    region,
    watershed,
    normalizedElevation,
    baseElevation: baseSeed,
    ridge,
    mountainPressure,
    mountainHardness: clamp(mineralHardness * 0.42 + mountainPressure * 0.28 + weathered * 0.18 + diamond * 0.12, 0, 1),
    canyonPressure,
    riverIncisionPressure,
    streamBranchPressure,
    valleyChannelPressure,
    cliffPressure,
    plateauPressure,
    basin,
    basinCutPressure,
    slope,
    coastPressure: coast,
    shelfPermission: clamp(Number(topology.reefShelfPermission) || Number(topology.shelfDepthIndex) || 0, 0, 1),
    dryInteriorPressure,
    glacierSeatPressure,
    snowpackSourcePressure,
    floodplainPressure,
    deltaReceiverPressure,
    lakeBasinPressure,
    riverbedPressure,
    streamPressure,
    hydrologyReadinessIndex,
    terrainNoise: broadNoise,
    fineTerrainNoise: fineNoise,
    reliefZone
  });
}

function terrainColorInfluence(sample) {
  if (sample.isIce) {
    return Object.freeze({
      base: "terrain_ice_seat",
      r: 232,
      g: 242,
      b: 248,
      ice: 1,
      relief: sample.glacierSeatPressure
    });
  }

  if (!sample.isLand) {
    const shelf = clamp(sample.shelfPermission || 0, 0, 1);
    const depth = clamp(Math.abs(sample.normalizedElevation || 0), 0, 1);
    return Object.freeze({
      base: "topology_void_no_terrain",
      oceanDepth: depth,
      shelf,
      r: Math.round(mix(6, 42, shelf)),
      g: Math.round(mix(28, 126, shelf)),
      b: Math.round(mix(78, 176, shelf))
    });
  }

  const elevation = clamp(sample.normalizedElevation, 0, 1);
  const mountain = clamp(sample.mountainPressure, 0, 1);
  const canyon = clamp(sample.canyonPressure, 0, 1);
  const cliff = clamp(sample.cliffPressure, 0, 1);
  const basin = clamp(sample.basin, 0, 1);
  const dry = clamp(sample.dryInteriorPressure, 0, 1);
  const glacier = clamp(sample.glacierSeatPressure, 0, 1);

  let r = mix(88, 178, elevation);
  let g = mix(104, 152, elevation * 0.60);
  let b = mix(78, 124, elevation * 0.56);

  r = mix(r, 190, mountain * 0.22 + cliff * 0.18);
  g = mix(g, 178, mountain * 0.18 + cliff * 0.14);
  b = mix(b, 164, mountain * 0.18 + cliff * 0.12);

  r = mix(r, 92, canyon * 0.34);
  g = mix(g, 76, canyon * 0.30);
  b = mix(b, 64, canyon * 0.26);

  r = mix(r, 108, basin * 0.18);
  g = mix(g, 116, basin * 0.16);
  b = mix(b, 96, basin * 0.14);

  r = mix(r, 174, dry * 0.18);
  g = mix(g, 126, dry * 0.16);
  b = mix(b, 86, dry * 0.14);

  r = mix(r, 228, glacier * 0.38);
  g = mix(g, 238, glacier * 0.40);
  b = mix(b, 244, glacier * 0.42);

  return Object.freeze({
    base: "terrain_relief",
    elevation,
    mountain,
    canyon,
    cliff,
    basin,
    dry,
    glacier,
    r: Math.round(clamp(r, 42, 240)),
    g: Math.round(clamp(g, 38, 240)),
    b: Math.round(clamp(b, 34, 248))
  });
}

export function createTerrainProfile(overrides = {}) {
  return Object.freeze({
    receipt: RECEIPT,
    previousReceipts: PREVIOUS_RECEIPTS,
    status: "active",
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    role: "final-terrain-relief-before-hydration",
    topologyAuthority: TOPOLOGY_AUTHORITY,
    tectonicsAuthority: TECTONICS_AUTHORITY,
    hydrationAuthorityLater: HYDRATION_AUTHORITY_LATER,

    terrainLaw: TERRAIN_LAW,
    terrainRegions: TERRAIN_REGIONS,
    reliefZones: RELIEF_ZONES,
    watershedCorridors: WATERSHED_CORRIDORS,

    consumesTopology: true,
    consumesTectonics: true,
    topologyLandFootprint: "authoritative",
    terrainMustNotExpandLandArea: true,
    terrainMayUseForElevationReliefOnly: true,
    terrainNeverCreatesLand: true,

    ownsAboveSeaElevation: true,
    ownsTerrainRelief: true,
    ownsMountains: true,
    ownsRidges: true,
    ownsCanyons: true,
    ownsValleys: true,
    ownsCliffs: true,
    ownsPlateaus: true,
    ownsBasins: true,
    ownsRiverbeds: true,
    ownsStreamCuts: true,
    ownsLakeBasins: true,
    ownsGlacierSeats: true,
    ownsFloodplainReadiness: true,
    ownsDeltaReadiness: true,
    ownsHydrologyReadinessLayout: true,

    ownsLandFootprint: false,
    ownsSeaLevel: false,
    ownsBathymetry: false,
    ownsActiveHydration: false,
    ownsWaterFill: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFoliage: false,
    ownsTrees: false,
    ownsVegetation: false,
    ownsFauna: false,
    ownsRuntime: false,
    ownsRouteShell: false,
    ownsFinalRender: false,
    visualPassClaimed: false,

    hydrologyMap: "active",
    hydrationHeld: true,
    foliageClosed: true,

    ...overrides
  });
}

export function sampleTerrain(uInput, vInput, context = {}) {
  const point = normalizeUV(uInput, vInput);
  const terrainContext = getInputContext(context);
  const topology = safeTopology(point.u, point.v, context);
  const tectonics = safeTectonics(point.u, point.v, topology, context);
  const relief = reliefSignals(point, topology, tectonics, terrainContext);

  const isLand = relief.land && !relief.ice;
  const isIce = relief.ice;
  const isWater = !isLand && !isIce;

  const region = relief.region || TERRAIN_REGIONS[0];
  const watershed = relief.watershed || WATERSHED_CORRIDORS[0];

  const sample = Object.freeze({
    receipt: RECEIPT,
    previousReceipts: PREVIOUS_RECEIPTS,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    topologyAuthority: TOPOLOGY_AUTHORITY,
    tectonicsAuthority: TECTONICS_AUTHORITY,
    hydrationAuthorityLater: HYDRATION_AUTHORITY_LATER,

    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,

    topologyReceipt: topology.receipt || topology.activeContract || "unknown",
    tectonicsReceipt: tectonics.receipt || "unknown",

    consumesTopology: true,
    consumesTectonics: true,
    topologyLandFootprint: isLand,
    topologyIceFootprint: isIce,
    topologyVoidFootprint: isWater,
    terrainAllowedByTopology: isLand,
    terrainMustNotExpandLandArea: true,
    terrainMayUseForElevationReliefOnly: true,
    terrainNeverCreatesLand: true,

    isLand,
    isWater,
    isIce,
    southIce: isIce,

    landBodyId: isLand ? topology.landBodyId || 0 : 0,
    landBodyKey: isLand ? topology.landBodyKey || "topology_land" : isIce ? "south_polar_ice" : "ocean",
    landBodyName: isLand ? topology.landBodyName || "Topology Land Footprint" : isIce ? "South Polar Ice" : "Ocean",
    landBodyRole: isLand ? "topology-authorized terrain footprint" : isIce ? "ice-only terrain seat" : "topology void; no above-sea terrain",

    regionId: isLand ? region.id : 0,
    regionKey: isLand ? region.key : isIce ? "south_polar_ice" : "ocean",
    regionName: isLand ? region.name : isIce ? "South Polar Ice" : "Ocean",
    regionRelativeElevation: isLand ? region.baseElevation : 0,
    elevationTier: isLand ? region.key + "_terrain_tier" : isIce ? "ice_only" : "water",

    watershedId: isLand ? watershed.id : "ocean",
    watershedFromRegion: isLand ? watershed.fromRegion : 0,
    watershedToRegion: isLand ? watershed.toRegion : 0,
    watershedGradient: isLand ? watershed.gradient : 0,
    watershedStrength: isLand ? clamp(relief.hydrologyReadinessIndex * 0.56 + watershed.riverBias * 0.26 + watershed.lakeBias * 0.18, 0, 1) : 0,

    normalizedElevation: relief.normalizedElevation,
    elevationMeters: isLand ? Math.round(relief.normalizedElevation * 9200) : isWater ? Math.round(relief.normalizedElevation * 5600) : 0,

    ridge: relief.ridge,
    mountainPressure: relief.mountainPressure,
    mountainHardness: relief.mountainHardness,
    canyonPressure: relief.canyonPressure,
    riverIncisionPressure: relief.riverIncisionPressure,
    streamBranchPressure: relief.streamBranchPressure,
    valleyChannelPressure: relief.valleyChannelPressure,
    cliffPressure: relief.cliffPressure,
    plateauPressure: relief.plateauPressure,
    basin: relief.basin,
    basinCutPressure: relief.basinCutPressure,
    slope: relief.slope,
    coastPressure: relief.coastPressure,
    shelfPermission: relief.shelfPermission,
    dryInteriorPressure: relief.dryInteriorPressure,
    glacierSeatPressure: relief.glacierSeatPressure,
    snowpackSourcePressure: relief.snowpackSourcePressure,

    riverbedPressure: relief.riverbedPressure,
    streamPressure: relief.streamPressure,
    lakeBasinPressure: relief.lakeBasinPressure,
    floodplainPressure: relief.floodplainPressure,
    deltaReceiverPressure: relief.deltaReceiverPressure,
    hydrologyReadinessIndex: relief.hydrologyReadinessIndex,

    reliefZone: relief.reliefZone,
    terrainNoise: relief.terrainNoise,
    fineTerrainNoise: relief.fineTerrainNoise,

    terrainColorInfluence: null,

    hydrologyMap: "active",
    hydrationHeld: true,
    activeHydrationOwnedHere: false,
    ownsHydration: false,
    ownsWaterFill: false,

    ownsAboveSeaElevation: true,
    ownsTerrainRelief: true,
    ownsMountains: true,
    ownsRidges: true,
    ownsCanyons: true,
    ownsValleys: true,
    ownsCliffs: true,
    ownsPlateaus: true,
    ownsBasins: true,
    ownsRiverbeds: true,
    ownsStreamCuts: true,
    ownsLakeBasins: true,
    ownsGlacierSeats: true,
    ownsFloodplainReadiness: true,
    ownsDeltaReadiness: true,

    ownsLandFootprint: false,
    ownsSeaLevel: false,
    ownsBathymetry: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFoliage: false,
    ownsTrees: false,
    ownsVegetation: false,
    ownsFauna: false,
    ownsRuntime: false,
    ownsRouteShell: false,
    ownsFinalRender: false,

    foliage: false,
    trees: false,
    vegetation: false,
    visualPassClaimed: false
  });

  return Object.freeze({
    ...sample,
    terrainColorInfluence: terrainColorInfluence(sample)
  });
}

export function buildTerrainField(width = 128, height = 128, options = {}) {
  const w = Math.max(8, Math.floor(Number(width) || 128));
  const h = Math.max(8, Math.floor(Number(height) || 128));
  const samples = new Array(w * h);

  const regionCounts = new Map();
  const reliefZoneCounts = new Map();
  const watershedCounts = new Map();
  const landBodyCounts = new Map();

  let landSamples = 0;
  let waterSamples = 0;
  let iceSamples = 0;
  let terrainAllowedSamples = 0;
  let terrainBlockedSamples = 0;
  let foliageSamples = 0;

  let elevationSum = 0;
  let maxElevation = -Infinity;
  let minElevation = Infinity;
  let ridgeMax = 0;
  let mountainMax = 0;
  let canyonMax = 0;
  let valleyMax = 0;
  let cliffMax = 0;
  let riverbedMax = 0;
  let streamMax = 0;
  let lakeMax = 0;
  let glacierMax = 0;
  let floodplainMax = 0;
  let deltaMax = 0;
  let hydrologyMax = 0;

  for (let y = 0; y < h; y += 1) {
    const v = h === 1 ? 0.5 : y / (h - 1);

    for (let x = 0; x < w; x += 1) {
      const u = w === 1 ? 0.5 : x / (w - 1);
      const sample = sampleTerrain(u, v, options);
      const index = y * w + x;

      samples[index] = sample;

      reliefZoneCounts.set(sample.reliefZone, (reliefZoneCounts.get(sample.reliefZone) || 0) + 1);

      if (sample.isIce) {
        iceSamples += 1;
      } else if (sample.isLand) {
        landSamples += 1;
        terrainAllowedSamples += 1;
        elevationSum += sample.normalizedElevation;
        maxElevation = Math.max(maxElevation, sample.normalizedElevation);
        minElevation = Math.min(minElevation, sample.normalizedElevation);

        regionCounts.set(sample.regionId, (regionCounts.get(sample.regionId) || 0) + 1);
        watershedCounts.set(sample.watershedId, (watershedCounts.get(sample.watershedId) || 0) + 1);
        landBodyCounts.set(sample.landBodyKey, (landBodyCounts.get(sample.landBodyKey) || 0) + 1);
      } else {
        waterSamples += 1;
        terrainBlockedSamples += 1;
      }

      if (sample.foliage || sample.trees || sample.vegetation) foliageSamples += 1;

      ridgeMax = Math.max(ridgeMax, sample.ridge);
      mountainMax = Math.max(mountainMax, sample.mountainPressure);
      canyonMax = Math.max(canyonMax, sample.canyonPressure);
      valleyMax = Math.max(valleyMax, sample.valleyChannelPressure);
      cliffMax = Math.max(cliffMax, sample.cliffPressure);
      riverbedMax = Math.max(riverbedMax, sample.riverbedPressure);
      streamMax = Math.max(streamMax, sample.streamPressure);
      lakeMax = Math.max(lakeMax, sample.lakeBasinPressure);
      glacierMax = Math.max(glacierMax, sample.glacierSeatPressure);
      floodplainMax = Math.max(floodplainMax, sample.floodplainPressure);
      deltaMax = Math.max(deltaMax, sample.deltaReceiverPressure);
      hydrologyMax = Math.max(hydrologyMax, sample.hydrologyReadinessIndex);
    }
  }

  const activeRegions = Array.from(regionCounts.keys()).sort((a, b) => a - b);
  const activeReliefZones = Array.from(reliefZoneCounts.keys()).sort();
  const activeWatersheds = Array.from(watershedCounts.keys()).sort();
  const activeLandBodies = Array.from(landBodyCounts.keys()).sort();

  return Object.freeze({
    receipt: RECEIPT,
    previousReceipts: PREVIOUS_RECEIPTS,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    topologyAuthority: TOPOLOGY_AUTHORITY,
    tectonicsAuthority: TECTONICS_AUTHORITY,
    hydrationAuthorityLater: HYDRATION_AUTHORITY_LATER,
    width: w,
    height: h,
    samples,
    profile: createTerrainProfile(options.profile || {}),
    topologyStatus: getTopologyStatus(),
    tectonicsStatus: getTectonicsStatus(),
    stats: Object.freeze({
      totalSamples: samples.length,
      landSamples,
      waterSamples,
      iceSamples,
      terrainAllowedSamples,
      terrainBlockedSamples,
      foliageSamples,

      landRatio: landSamples / samples.length,
      waterRatio: waterSamples / samples.length,
      iceRatio: iceSamples / samples.length,
      terrainAllowedRatio: terrainAllowedSamples / samples.length,
      terrainBlockedRatio: terrainBlockedSamples / samples.length,

      activeRegionCount: activeRegions.length,
      expectedRegionCount: TERRAIN_REGIONS.length,
      activeRegions,

      activeReliefZoneCount: activeReliefZones.length,
      expectedReliefZoneCount: RELIEF_ZONES.length,
      activeReliefZones,

      activeWatershedCount: activeWatersheds.length,
      expectedWatershedCount: WATERSHED_CORRIDORS.length,
      activeWatersheds,

      activeLandBodyCount: activeLandBodies.length,
      activeLandBodies,

      averageLandElevation: elevationSum / Math.max(1, landSamples),
      minLandElevation: Number.isFinite(minElevation) ? minElevation : 0,
      maxLandElevation: Number.isFinite(maxElevation) ? maxElevation : 0,

      maxRidge: ridgeMax,
      maxMountain: mountainMax,
      maxCanyon: canyonMax,
      maxValley: valleyMax,
      maxCliff: cliffMax,
      maxRiverbed: riverbedMax,
      maxStream: streamMax,
      maxLake: lakeMax,
      maxGlacier: glacierMax,
      maxFloodplain: floodplainMax,
      maxDelta: deltaMax,
      maxHydrologyReadiness: hydrologyMax,

      consumesTopology: true,
      consumesTectonics: true,
      topologyLandFootprintAuthoritative: true,
      terrainMustNotExpandLandArea: true,
      terrainMayUseForElevationReliefOnly: true,
      terrainNeverCreatesLand: true,
      hydrologyMap: "active",
      hydrationHeld: true,
      foliageClosed: true,
      visualPassClaimed: false
    }),
    terrainChild: true,
    finalTerrainBeforeHydration: true,
    downstreamForTopology: true,
    downstreamForTectonics: true,
    hydrationMayConsumeLater: true,
    visualPassClaimed: false
  });
}

export function getTerrainSampleFromField(field, uInput, vInput) {
  if (!field || !Array.isArray(field.samples) || !field.width || !field.height) {
    return sampleTerrain(uInput, vInput);
  }

  const u = ((Number(uInput) || 0) % 1 + 1) % 1;
  const v = clamp(Number(vInput) || 0, 0, 1);

  const x = clamp(Math.round(u * (field.width - 1)), 0, field.width - 1);
  const y = clamp(Math.round(v * (field.height - 1)), 0, field.height - 1);

  return field.samples[y * field.width + x];
}

export function getTerrainStatus() {
  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    previousReceipts: PREVIOUS_RECEIPTS,
    status: "active",
    id: "audralia-g1-terrain-consume-topology-tectonics-relief-lock",
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,

    role: "final-terrain-relief-before-hydration",
    topologyAuthority: TOPOLOGY_AUTHORITY,
    tectonicsAuthority: TECTONICS_AUTHORITY,
    hydrationAuthorityLater: HYDRATION_AUTHORITY_LATER,

    consumesTopology: true,
    consumesTectonics: true,
    topologyDependencyConfirmed: true,
    tectonicsDependencyConfirmed: true,

    topologyLandFootprint: "authoritative",
    terrainRespectsTopologyLandArea: true,
    terrainMustNotExpandLandArea: true,
    terrainMayUseForElevationReliefOnly: true,
    terrainNeverCreatesLand: true,
    terrainNeverCreatesIslands: true,
    terrainNeverChangesSeaLevel: true,

    hydrologyMap: "active",
    hydrationReadinessLayout: "active",
    hydrationHeld: true,
    activeHydrationOwnedHere: false,

    ownsAboveSeaElevation: true,
    ownsTerrainRelief: true,
    ownsMountains: true,
    ownsRidges: true,
    ownsCanyons: true,
    ownsValleys: true,
    ownsCliffs: true,
    ownsPlateaus: true,
    ownsBasins: true,
    ownsRiverbeds: true,
    ownsStreamCuts: true,
    ownsLakeBasins: true,
    ownsGlacierSeats: true,
    ownsFloodplainReadiness: true,
    ownsDeltaReadiness: true,
    ownsHydrologyReadinessLayout: true,

    ownsLandFootprint: false,
    ownsSeaLevel: false,
    ownsBathymetry: false,
    ownsActiveHydration: false,
    ownsWaterFill: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFoliage: false,
    ownsTrees: false,
    ownsVegetation: false,
    ownsFauna: false,
    ownsRuntime: false,
    ownsRouteShell: false,
    ownsFinalRender: false,

    noFoliageLaw: "active",
    noTreesLaw: "active",
    noVegetationLaw: "active",

    terrainRegions: TERRAIN_REGIONS,
    reliefZones: RELIEF_ZONES,
    watershedCorridors: WATERSHED_CORRIDORS,

    exports: Object.freeze([
      "createTerrainProfile",
      "sampleTerrain",
      "buildTerrainField",
      "getTerrainSampleFromField",
      "getTerrainStatus"
    ]),

    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false,
    generationPassClaimed: false
  });
}

export default Object.freeze({
  createTerrainProfile,
  sampleTerrain,
  buildTerrainField,
  getTerrainSampleFromField,
  getTerrainStatus
});

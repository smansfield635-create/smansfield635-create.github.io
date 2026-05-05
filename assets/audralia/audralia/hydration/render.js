// /assets/audralia/audralia/hydration/render.js
// AUDRALIA_HYDRATION_PARENT_TECTONIC_GENEALOGY_ALIGNMENT_TNT_v1
//
// Role:
// - Hydration parent authority.
// - Lives downstream of the current Audralia surface genealogy.
// - Consumes tectonics → topology → terrain.
// - Consumes oceans child through ./oceans.render.js.
// - Exposes composed hydration fields upward to runtime.
//
// Governing genealogy:
// - Tectonics begot topology.
// - Topology begot terrain.
// - Terrain prepares water-receiving structure.
// - Hydration activates water behavior.
// - Oceans is a child of hydration.
//
// Hard locks:
// - No DOM mutation.
// - No route rendering.
// - No runtime rendering.
// - No land generation.
// - No topology rewrite.
// - No tectonic overwrite.
// - No terrain elevation ownership.
// - No ocean child ownership.
// - No climate.
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

import {
  sampleTectonics,
  buildTectonicsField,
  getTectonicsSampleFromField,
  getTectonicsStatus
} from "../tectonics/render.js?v=AUDRALIA_TECTONICS_DERIVATIVE_ORIGIN_PARENT_TNT_v1";

import {
  sampleTopology,
  buildTopologyField,
  getTopologySampleFromField,
  getTopologyStatus
} from "../tectonics/topology/render.js?v=AUDRALIA_TECTONICS_TOPOLOGY_CHILD_FOOTPRINT_AUTHORITY_TNT_v1";

import {
  sampleTerrain,
  buildTerrainField,
  getTerrainSampleFromField,
  getTerrainStatus
} from "../tectonics/topology/terrain.render.js?v=AUDRALIA_TECTONICS_TOPOLOGY_TERRAIN_GRANDCHILD_RELIEF_TNT_v1";

import {
  sampleOceans,
  buildOceansField,
  getOceansSampleFromField,
  getOceansStatus
} from "./oceans.render.js?v=AUDRALIA_HYDRATION_OCEANS_CHILD_TURQUOISE_DEPTH_GRADIENT_TNT_v1";

const RECEIPT = "AUDRALIA_HYDRATION_PARENT_TECTONIC_GENEALOGY_ALIGNMENT_TNT_v1";

const PREVIOUS_RECEIPTS = Object.freeze([
  "AUDRALIA_HYDRATION_PARENT_TREE_PATH_ALIGNMENT_TNT_v1",
  "AUDRALIA_HYDRATION_PARENT_CONSUME_OCEANS_CHILD_TNT_v1",
  "AUDRALIA_HYDRATION_VISIBLE_DEPTH_BEACH_RIM_EXPOSED_LAND_TNT_v1"
]);

const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1_HYDRATION_PARENT_TECTONIC_GENEALOGY";
const FILE = "/assets/audralia/audralia/hydration/render.js";

const AUTHORITY_PATHS = Object.freeze({
  tectonicsParent: "/assets/audralia/audralia/tectonics/render.js",
  topologyChild: "/assets/audralia/audralia/tectonics/topology/render.js",
  terrainGrandchild: "/assets/audralia/audralia/tectonics/topology/terrain.render.js",
  hydrationParent: "/assets/audralia/audralia/hydration/render.js",
  oceansChild: "/assets/audralia/audralia/hydration/oceans.render.js"
});

const CONTRACTS = Object.freeze({
  hydration: RECEIPT,
  previousHydration: "AUDRALIA_HYDRATION_PARENT_TREE_PATH_ALIGNMENT_TNT_v1",
  tectonicsParent: "AUDRALIA_TECTONICS_DERIVATIVE_ORIGIN_PARENT_TNT_v1",
  topologyChild: "AUDRALIA_TECTONICS_TOPOLOGY_CHILD_FOOTPRINT_AUTHORITY_TNT_v1",
  terrainGrandchild: "AUDRALIA_TECTONICS_TOPOLOGY_TERRAIN_GRANDCHILD_RELIEF_TNT_v1",
  oceansChild: "AUDRALIA_HYDRATION_OCEANS_CHILD_TURQUOISE_DEPTH_GRADIENT_TNT_v1",
  runtimeExpected: "AUDRALIA_RUNTIME_CONSUME_TECTONIC_GENEALOGY_HYDRATION_PARENT_TNT_v1"
});

const HYDRATION_LAW = Object.freeze({
  genealogy: "tectonics→topology→terrain→hydration(parent→oceans_child)",
  consumesTectonicsParent: true,
  consumesTopologyChild: true,
  consumesTerrainGrandchild: true,
  consumesOceansChild: true,

  ownsHydrationParent: true,
  ownsWaterSystemParent: true,
  ownsWaterPlacement: true,
  ownsWaterFlowPermission: true,
  ownsWaterDepthVisibility: true,
  ownsOceansChildHandoff: true,

  ownsTectonics: false,
  ownsTopology: false,
  ownsTerrain: false,
  ownsOceansChildExpression: false,
  ownsLandFootprint: false,
  ownsLandExpansion: false,
  ownsRouteRendering: false,
  ownsRuntimeRendering: false,
  ownsFinalRender: false,

  oceansMayFillOnlyTopologyVoid: true,
  oceanDoesNotOwnLand: true,
  landPreservedByTopology: true,
  seaLevelHydrationActive: true,
  turquoiseCoastalOutlineActive: true,
  visualPassClaimed: false
});

const DEFAULTS = Object.freeze({
  fieldWidth: 224,
  fieldHeight: 112,
  minFieldWidth: 64,
  minFieldHeight: 32,
  maxFieldWidth: 512,
  maxFieldHeight: 256
});

function clamp(value, min, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function normalizeUV(uInput, vInput) {
  const u = ((Number(uInput) || 0) % 1 + 1) % 1;
  const v = clamp(Number(vInput) || 0, 0, 1);
  return Object.freeze({ u, v, lon: u * 2 - 1, lat: 1 - v * 2 });
}

function normalizeDimension(value, fallback, min, max) {
  return clamp(Math.floor(Number(value) || fallback), min, max);
}

function safeCall(fallback, fn) {
  try {
    const value = fn();
    return value == null ? fallback : value;
  } catch {
    return fallback;
  }
}

function buildSafeField(label, fallback, fn) {
  try {
    const field = fn();
    return Object.freeze({
      field: field || fallback,
      fallbackUsed: !field,
      label
    });
  } catch (error) {
    return Object.freeze({
      field: fallback,
      fallbackUsed: true,
      label,
      error: error && error.message ? error.message : String(error)
    });
  }
}

function fallbackTectonics(u, v) {
  const point = normalizeUV(u, v);
  return Object.freeze({
    receipt: "HYDRATION_GENEALOGY_FALLBACK_TECTONICS",
    fallbackUsed: true,
    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,
    tectonicType: "fallback_stable_crust",
    crustalStressIndex: 0,
    trenchReinforcementPermission: 0,
    terrainPressureHandoff: 0,
    ownsLandFootprint: false,
    visualPassClaimed: false
  });
}

function fallbackTopology(u, v) {
  const point = normalizeUV(u, v);
  const ice = point.lat < -0.82 || point.lat > 0.90;

  return Object.freeze({
    receipt: "HYDRATION_GENEALOGY_FALLBACK_TOPOLOGY",
    fallbackUsed: true,
    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,
    isLandFootprint: false,
    isAboveWaterLandFootprint: false,
    isVoidFootprint: !ice,
    isWaterFootprint: !ice,
    isPolarIceFootprint: ice,
    isSouthPolarIceFootprint: point.lat < -0.82,
    isNorthPolarIceFootprint: point.lat > 0.90,
    isBeach: false,
    isSand: false,
    surfaceClass: ice ? "polar_ice_footprint" : "fallback_open_ocean_blueprint",
    topologySurfaceClass: ice ? "polar_ice_footprint" : "fallback_open_ocean_blueprint",
    oceanDepthIndex: ice ? 0 : 0.62,
    bathymetryBlueprintIndex: ice ? 0 : 0.58,
    shelfDepthIndex: ice ? 0 : 0.18,
    trenchDepthIndex: 0,
    shorelinePressure: 0,
    beachOutlinePressure: 0,
    beachWaterContactIndex: 0,
    visualPassClaimed: false
  });
}

function fallbackTerrain(u, v, topology) {
  const land = Boolean(topology && (topology.isLandFootprint || topology.isAboveWaterLandFootprint));
  const ice = Boolean(topology && (topology.isPolarIceFootprint || topology.isSouthPolarIceFootprint || topology.isNorthPolarIceFootprint));

  return Object.freeze({
    receipt: "HYDRATION_GENEALOGY_FALLBACK_TERRAIN",
    fallbackUsed: true,
    u,
    v,
    isLand: land,
    isIce: ice,
    normalizedElevation: land ? 0.24 : -0.48,
    riverbedPressure: 0,
    streamPressure: 0,
    lakeBasinPressure: 0,
    glacierSeatPressure: ice ? 0.8 : 0,
    snowpackSourcePressure: ice ? 0.7 : 0,
    floodplainPressure: 0,
    deltaReceiverPressure: 0,
    hydrologyReadinessIndex: 0,
    ownsHydration: false,
    visualPassClaimed: false
  });
}

function fallbackOceans(u, v, topology) {
  const land = Boolean(topology && (topology.isLandFootprint || topology.isAboveWaterLandFootprint));
  const ice = Boolean(topology && (topology.isPolarIceFootprint || topology.isSouthPolarIceFootprint || topology.isNorthPolarIceFootprint));
  const ocean = !land && !ice;

  return Object.freeze({
    receipt: "HYDRATION_GENEALOGY_FALLBACK_OCEANS",
    fallbackUsed: true,
    u,
    v,
    oceanClass: ice ? "polar_ice" : ocean ? "open_ocean" : "not_ocean",
    oceanClassId: ice ? 15 : ocean ? 70 : 0,
    oceanActive: ocean,
    oceanAllowed: ocean,
    coastalTurquoiseIndex: 0,
    shelfWaterIndex: ocean ? 0.18 : 0,
    openOceanIndex: ocean ? 0.76 : 0,
    deepOceanIndex: ocean ? 0.46 : 0,
    trenchWaterIndex: 0,
    shorelineContactIndex: 0,
    beachRimIndex: 0,
    beachRimPreserved: false,
    visibleOceanIndex: ocean ? 0.70 : 0,
    oceanDepthIndex: ocean ? 0.62 : 0,
    bathymetryOceanIndex: ocean ? 0.58 : 0,
    landPreservedByTopology: land,
    oceanDoesNotOwnLand: true,
    visualPassClaimed: false
  });
}

function getTectonics(context, u, v) {
  if (context && context.tectonicsField) return getTectonicsSampleFromField(context.tectonicsField, u, v);
  return safeCall(fallbackTectonics(u, v), () => sampleTectonics(u, v, context && context.tectonicsContext ? context.tectonicsContext : {}));
}

function getTopology(context, u, v, tectonics) {
  if (context && context.topologyField) return getTopologySampleFromField(context.topologyField, u, v);
  return safeCall(fallbackTopology(u, v), () => sampleTopology(u, v, { ...(context && context.topologyContext ? context.topologyContext : {}), tectonics }));
}

function getTerrain(context, u, v, topology, tectonics) {
  if (context && context.terrainField) return getTerrainSampleFromField(context.terrainField, u, v);
  return safeCall(fallbackTerrain(u, v, topology), () => sampleTerrain(u, v, { ...(context && context.terrainContext ? context.terrainContext : {}), topology, tectonics }));
}

function getOceans(context, u, v, topology, terrain, tectonics) {
  if (context && context.oceansField) return getOceansSampleFromField(context.oceansField, u, v);
  return safeCall(fallbackOceans(u, v, topology), () => sampleOceans(u, v, { ...(context || {}), topology, terrain, tectonics }));
}

function topologyLand(topology) {
  return Boolean(topology && (topology.isLandFootprint || topology.isAboveWaterLandFootprint || topology.topologyLandFootprint));
}

function topologyIce(topology) {
  return Boolean(
    topology &&
      (
        topology.isPolarIceFootprint ||
        topology.isSouthPolarIceFootprint ||
        topology.isNorthPolarIceFootprint ||
        topology.surfaceClass === "polar_ice_footprint" ||
        topology.topologySurfaceClass === "polar_ice_footprint"
      )
  );
}

function topologyBeach(topology) {
  return Boolean(
    topology &&
      (
        topology.isBeach ||
        topology.isSand ||
        String(topology.beachType || "").includes("beach") ||
        String(topology.surfaceClass || "").includes("beach_outline") ||
        Number(topology.beachOutlinePressure) > 0.22
      )
  );
}

function oceanClassToWaterClass(oceans, land, ice) {
  if (ice) return "glacier_mass";

  if (land) {
    return "dry_land";
  }

  if (!oceans) return "dry_land";

  switch (oceans.oceanClass) {
    case "trench_ocean":
      return "trench_water";
    case "deep_ocean":
      return "deep_ocean_water";
    case "open_ocean":
      return "ocean_water";
    case "shelf_water":
      return "shelf_water";
    case "coastal_turquoise":
      return "coastal_water";
    case "polar_ice":
      return "glacier_mass";
    default:
      return "dry_land";
  }
}

function composeHydrationSample(uInput, vInput, context = {}) {
  const point = normalizeUV(uInput, vInput);

  const tectonics = getTectonics(context, point.u, point.v);
  const topology = getTopology(context, point.u, point.v, tectonics);
  const terrain = getTerrain(context, point.u, point.v, topology, tectonics);
  const oceans = getOceans(context, point.u, point.v, topology, terrain, tectonics);

  const land = topologyLand(topology);
  const ice = topologyIce(topology);
  const beach = topologyBeach(topology);

  const river = land ? clamp(Number(terrain.riverbedPressure) || 0, 0, 1) : 0;
  const stream = land ? clamp(Number(terrain.streamPressure) || 0, 0, 1) : 0;
  const lake = land ? clamp(Number(terrain.lakeBasinPressure) || 0, 0, 1) : 0;
  const glacier = ice ? 0.88 : land ? clamp(Number(terrain.glacierSeatPressure) || 0, 0, 1) : 0;
  const snowpack = ice ? 0.74 : land ? clamp(Number(terrain.snowpackSourcePressure) || 0, 0, 1) : 0;
  const floodplain = land ? clamp(Number(terrain.floodplainPressure) || 0, 0, 1) : 0;
  const delta = land ? clamp((Number(terrain.deltaReceiverPressure) || 0) * 0.62 + Number(oceans.shorelineContactIndex || 0) * 0.22, 0, 1) : 0;
  const spring = land ? clamp((Number(terrain.hydrologyReadinessIndex) || 0) * 0.24 + (Number(topology.subterraneanDepthIndex) || 0) * 0.22, 0, 1) : 0;
  const subterranean = clamp((Number(topology.subterraneanDepthIndex) || 0) * 0.42 + (land ? Number(terrain.hydrologyReadinessIndex) || 0 : Number(oceans.oceanDepthIndex) || 0) * 0.16, 0, 1);

  let waterClass = oceanClassToWaterClass(oceans, land, ice);

  if (land || ice) {
    if (glacier > 0.62) waterClass = "glacier_mass";
    else if (snowpack > 0.62) waterClass = "snowpack_source";
    else if (lake > 0.58) waterClass = "lake_fill";
    else if (river > 0.54) waterClass = "river_flow";
    else if (stream > 0.50) waterClass = "stream_flow";
    else if (delta > 0.56) waterClass = "delta_wetland";
    else if (floodplain > 0.56) waterClass = "floodplain_wetland";
    else if (spring > 0.54) waterClass = "spring_seep";
    else if (subterranean > 0.62 && !land) waterClass = "subterranean_water";
  }

  const hydrated = waterClass !== "dry_land";
  const landStillVisible = land && !hydrated;
  const exposedLandAfterSeaLevel = land && !ice;

  const fallbackFlags = Object.freeze({
    tectonicsFallbackUsed: Boolean(tectonics && tectonics.fallbackUsed),
    topologyFallbackUsed: Boolean(topology && topology.fallbackUsed),
    terrainFallbackUsed: Boolean(terrain && terrain.fallbackUsed),
    oceansFallbackUsed: Boolean(oceans && oceans.fallbackUsed),
    hydrationFallbackUsed: false
  });

  return Object.freeze({
    receipt: RECEIPT,
    previousReceipts: PREVIOUS_RECEIPTS,
    activeContract: RECEIPT,
    latestContract: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    authorityPaths: AUTHORITY_PATHS,
    contracts: CONTRACTS,
    hydrationLaw: HYDRATION_LAW,
    fallbackFlags,

    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,

    tectonicsReceipt: tectonics.receipt || "unknown",
    topologyReceipt: topology.receipt || "unknown",
    terrainReceipt: terrain.receipt || "unknown",
    oceansReceipt: oceans.receipt || "unknown",

    consumesTectonicsParent: true,
    consumesTopologyChild: true,
    consumesTerrainGrandchild: true,
    consumesOceansChild: true,

    hydrationParentActive: true,
    hydrationParentTectonicGenealogyAligned: true,
    oceansChildActive: true,
    seaLevelHydrationActive: true,
    waterDepthActive: true,
    depthVisibilityActive: true,
    beachRimActive: true,
    exposedLandReportActive: true,

    waterClass,
    waterClassId:
      waterClass === "trench_water" ? 90 :
      waterClass === "deep_ocean_water" ? 80 :
      waterClass === "ocean_water" ? 70 :
      waterClass === "shelf_water" ? 60 :
      waterClass === "coastal_water" ? 50 :
      waterClass === "lake_fill" ? 40 :
      waterClass === "river_flow" ? 35 :
      waterClass === "stream_flow" ? 30 :
      waterClass === "delta_wetland" ? 25 :
      waterClass === "floodplain_wetland" ? 24 :
      waterClass === "spring_seep" ? 22 :
      waterClass === "subterranean_water" ? 20 :
      waterClass === "glacier_mass" ? 15 :
      waterClass === "snowpack_source" ? 14 :
      0,

    visualHydrationClass: hydrated ? waterClass : land ? "exposed_land" : "dry_void",

    isHydrated: hydrated,
    isOceanWater: waterClass === "ocean_water",
    isCoastalWater: waterClass === "coastal_water",
    isShelfWater: waterClass === "shelf_water",
    isDeepOcean: waterClass === "deep_ocean_water",
    isTrenchWater: waterClass === "trench_water",
    isRiver: waterClass === "river_flow",
    isStream: waterClass === "stream_flow",
    isLake: waterClass === "lake_fill",
    isGlacier: waterClass === "glacier_mass",
    isSnowpack: waterClass === "snowpack_source",
    isFloodplain: waterClass === "floodplain_wetland",
    isDelta: waterClass === "delta_wetland",
    isSpring: waterClass === "spring_seep",
    isSubterraneanWater: waterClass === "subterranean_water",

    topologyLandFootprint: land,
    topologyVoidFootprint: !land && !ice,
    isLandFootprint: land,
    isAboveWaterLandFootprint: land && !ice,
    isVoidFootprint: !land && !ice,
    isWaterFootprint: !land && !ice,
    isIceFootprint: ice,
    isBeachFootprint: beach,

    exposedLandAfterSeaLevel,
    landStillVisibleAfterHydration: landStillVisible,
    exposedLandVisibilityIndex: landStillVisible ? 0.74 : 0,
    exposedLandClass: landStillVisible ? (beach ? "beach_outline_remaining" : "inland_land_remaining") : "covered_or_not_land",

    visibleWaterDepthClass: oceans.oceanDepthClass || oceans.oceanClass || "none",
    visibleWaterDepthIndex: clamp(Number(oceans.oceanDepthIndex) || 0, 0, 1),
    waterVisibilityIndex: clamp(Number(oceans.visibleOceanIndex) || 0, 0, 1),
    coastalShelfBlueIndex: clamp(Math.max(Number(oceans.coastalTurquoiseIndex) || 0, Number(oceans.shelfWaterIndex) || 0), 0, 1),
    deepOceanBlueIndex: clamp(Number(oceans.deepOceanIndex) || 0, 0, 1),
    trenchDarknessIndex: clamp(Number(oceans.trenchWaterIndex) || 0, 0, 1),

    oceanClass: oceans.oceanClass,
    oceanClassId: oceans.oceanClassId,
    oceanActive: !land && !ice && Boolean(oceans.oceanActive),
    oceanFromChild: true,
    oceansMayFillOnlyTopologyVoid: true,
    oceanDoesNotOwnLand: true,
    landPreservedByTopology: true,

    coastalTurquoiseIndex: !land ? clamp(Number(oceans.coastalTurquoiseIndex) || 0, 0, 1) : 0,
    shelfWaterIndex: !land ? clamp(Number(oceans.shelfWaterIndex) || 0, 0, 1) : 0,
    openOceanIndex: !land ? clamp(Number(oceans.openOceanIndex) || 0, 0, 1) : 0,
    deepOceanIndex: !land ? clamp(Number(oceans.deepOceanIndex) || 0, 0, 1) : 0,
    trenchWaterIndex: !land ? clamp(Number(oceans.trenchWaterIndex) || 0, 0, 1) : 0,
    shorelineContactIndex: clamp(Number(oceans.shorelineContactIndex) || 0, 0, 1),

    oceanDepthIndex: !land ? clamp(Number(oceans.oceanDepthIndex) || Number(topology.oceanDepthIndex) || 0, 0, 1) : 0,
    bathymetryHydrationIndex: !land ? clamp(Number(oceans.bathymetryOceanIndex) || Number(topology.bathymetryBlueprintIndex) || 0, 0, 1) : 0,
    trenchHydrationIndex: !land ? clamp(Number(oceans.trenchWaterIndex) || Number(topology.trenchDepthIndex) || 0, 0, 1) : 0,
    shelfPressure: !land ? clamp(Number(oceans.shelfWaterIndex) || Number(topology.shelfDepthIndex) || 0, 0, 1) : 0,
    coastalWaterPressure: !land ? clamp(Number(oceans.coastalTurquoiseIndex) || Number(topology.coastalExposureIndex) || 0, 0, 1) : 0,

    beachOutlinePressure: clamp(Number(topology.beachOutlinePressure) || 0, 0, 1),
    beachContactRimIndex: clamp(Number(oceans.beachRimIndex) || 0, 0, 1),
    beachWaterContactIndex: clamp(Number(topology.beachWaterContactIndex) || Number(oceans.shorelineContactIndex) || 0, 0, 1),
    beachRimStillVisible: Boolean(oceans.beachRimPreserved),
    sandCoveredByHydration: false,

    riverFlowPressure: river,
    streamFlowPressure: stream,
    lakeFillPressure: lake,
    glacierMassPressure: glacier,
    snowpackPressure: snowpack,
    floodplainWetness: floodplain,
    deltaWetness: delta,
    springSeepPressure: spring,
    subterraneanWaterPressure: subterranean,

    surfaceWaterIndex: hydrated ? clamp(Math.max(Number(oceans.visibleOceanIndex) || 0, river, stream, lake, glacier, snowpack, delta, floodplain), 0, 1) : 0,
    hydrationActivationIndex: hydrated ? clamp(Math.max(Number(oceans.visibleOceanIndex) || 0, river, stream, lake, glacier, snowpack, delta, floodplain), 0, 1) : 0,

    hydrationColorInfluence: Object.freeze({
      waterDominance: hydrated ? 1 : 0,
      turquoise: !land ? Number(oceans.coastalTurquoiseIndex) || 0 : 0,
      coastalBlue: !land ? Number(oceans.coastalTurquoiseIndex) || 0 : 0,
      shelfBlue: !land ? Number(oceans.shelfWaterIndex) || 0 : 0,
      openBlue: !land ? Number(oceans.openOceanIndex) || 0 : 0,
      deepBlue: !land ? Number(oceans.deepOceanIndex) || 0 : 0,
      trenchDark: !land ? Number(oceans.trenchWaterIndex) || 0 : 0,
      beachRim: Number(oceans.beachRimIndex) || 0,
      exposedLand: landStillVisible ? 1 : 0,
      glacierWhite: glacier,
      riverBlue: river,
      lakeBlue: lake
    }),

    ownsHydrationParent: true,
    ownsWaterSystemParent: true,
    ownsWaterPlacement: true,
    ownsWaterFlowPermission: true,
    ownsWaterDepthVisibility: true,
    ownsOceansChildHandoff: true,

    ownsTectonics: false,
    ownsTopology: false,
    ownsTerrain: false,
    ownsOceansChildExpression: false,
    ownsLandFootprint: false,
    ownsLandExpansion: false,
    ownsRouteRendering: false,
    ownsRuntimeRendering: false,
    ownsFinalRender: false,

    climateEnabled: false,
    ecologyEnabled: false,
    foliageEnabled: false,
    animalsEnabled: false,
    marineLifeEnabled: false,
    constructCivilizationEnabled: false,
    foliage: false,
    trees: false,
    vegetation: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
}

export function sampleHydration(u, v, context = {}) {
  return composeHydrationSample(u, v, context);
}

export function buildHydrationField(width = DEFAULTS.fieldWidth, height = DEFAULTS.fieldHeight, context = {}) {
  const w = normalizeDimension(width, DEFAULTS.fieldWidth, DEFAULTS.minFieldWidth, DEFAULTS.maxFieldWidth);
  const h = normalizeDimension(height, DEFAULTS.fieldHeight, DEFAULTS.minFieldHeight, DEFAULTS.maxFieldHeight);

  const tectonicsBuild = buildSafeField("tectonics", null, () => buildTectonicsField(w, h, context.tectonicsContext || {}));
  const topologyBuild = buildSafeField("topology", null, () => buildTopologyField(w, h, { ...(context.topologyContext || {}), tectonicsField: tectonicsBuild.field }));
  const terrainBuild = buildSafeField("terrain", null, () => buildTerrainField(w, h, { ...(context.terrainContext || {}), topologyField: topologyBuild.field, tectonicsField: tectonicsBuild.field }));
  const oceansBuild = buildSafeField("oceans", null, () => buildOceansField(w, h, { ...(context.oceansContext || context), topologyField: topologyBuild.field, terrainField: terrainBuild.field, tectonicsField: tectonicsBuild.field }));

  const samplingContext = Object.freeze({
    ...context,
    tectonicsField: tectonicsBuild.field,
    topologyField: topologyBuild.field,
    terrainField: terrainBuild.field,
    oceansField: oceansBuild.field
  });

  const samples = new Array(w * h);

  let hydratedSamples = 0;
  let oceanSamples = 0;
  let coastalSamples = 0;
  let shelfSamples = 0;
  let deepOceanSamples = 0;
  let trenchSamples = 0;
  let visibleLandSamples = 0;
  let beachRimSamples = 0;
  let fallbackSamples = 0;
  let maxTurquoise = 0;
  let maxDepth = 0;
  let maxTrench = 0;

  const waterClasses = new Set();

  for (let y = 0; y < h; y += 1) {
    const v = h === 1 ? 0.5 : y / (h - 1);

    for (let x = 0; x < w; x += 1) {
      const u = w === 1 ? 0.5 : x / (w - 1);
      const sample = composeHydrationSample(u, v, samplingContext);

      samples[y * w + x] = sample;
      waterClasses.add(sample.waterClass);

      if (sample.isHydrated) hydratedSamples += 1;
      if (sample.oceanActive) oceanSamples += 1;
      if (sample.isCoastalWater) coastalSamples += 1;
      if (sample.isShelfWater) shelfSamples += 1;
      if (sample.isDeepOcean) deepOceanSamples += 1;
      if (sample.isTrenchWater) trenchSamples += 1;
      if (sample.landStillVisibleAfterHydration) visibleLandSamples += 1;
      if (sample.beachRimStillVisible) beachRimSamples += 1;
      if (
        sample.fallbackFlags &&
        (
          sample.fallbackFlags.tectonicsFallbackUsed ||
          sample.fallbackFlags.topologyFallbackUsed ||
          sample.fallbackFlags.terrainFallbackUsed ||
          sample.fallbackFlags.oceansFallbackUsed
        )
      ) {
        fallbackSamples += 1;
      }

      maxTurquoise = Math.max(maxTurquoise, sample.coastalTurquoiseIndex);
      maxDepth = Math.max(maxDepth, sample.visibleWaterDepthIndex);
      maxTrench = Math.max(maxTrench, sample.trenchDarknessIndex);
    }
  }

  return Object.freeze({
    receipt: RECEIPT,
    previousReceipts: PREVIOUS_RECEIPTS,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    authorityPaths: AUTHORITY_PATHS,
    width: w,
    height: h,
    samples,
    tectonicsField: tectonicsBuild.field,
    topologyField: topologyBuild.field,
    terrainField: terrainBuild.field,
    oceansField: oceansBuild.field,
    fallbackReport: Object.freeze({
      tectonicsFallbackUsed: tectonicsBuild.fallbackUsed,
      topologyFallbackUsed: topologyBuild.fallbackUsed,
      terrainFallbackUsed: terrainBuild.fallbackUsed,
      oceansFallbackUsed: oceansBuild.fallbackUsed
    }),
    stats: Object.freeze({
      totalSamples: samples.length,
      hydratedSamples,
      oceanSamples,
      coastalSamples,
      shelfSamples,
      deepOceanSamples,
      trenchSamples,
      visibleLandSamples,
      beachRimSamples,
      fallbackSamples,
      hydrationRatio: samples.length ? hydratedSamples / samples.length : 0,
      oceanRatio: samples.length ? oceanSamples / samples.length : 0,
      coastalRatio: samples.length ? coastalSamples / samples.length : 0,
      shelfRatio: samples.length ? shelfSamples / samples.length : 0,
      deepOceanRatio: samples.length ? deepOceanSamples / samples.length : 0,
      trenchRatio: samples.length ? trenchSamples / samples.length : 0,
      visibleLandRatio: samples.length ? visibleLandSamples / samples.length : 0,
      beachRimRatio: samples.length ? beachRimSamples / samples.length : 0,
      fallbackRatio: samples.length ? fallbackSamples / samples.length : 0,
      maxTurquoise,
      maxDepth,
      maxTrench,
      waterClasses: Object.freeze(Array.from(waterClasses)),
      hydrationParentActive: true,
      hydrationParentTectonicGenealogyAligned: true,
      oceansChildActive: true,
      oceanDoesNotOwnLand: true,
      landPreservedByTopology: true,
      visualPassClaimed: false
    })
  });
}

export function getHydrationSampleFromField(field, uInput, vInput) {
  if (!field || !field.samples || !field.width || !field.height) {
    return sampleHydration(uInput, vInput);
  }

  const point = normalizeUV(uInput, vInput);
  const x = clamp(Math.round(point.u * (field.width - 1)), 0, field.width - 1);
  const y = clamp(Math.round(point.v * (field.height - 1)), 0, field.height - 1);

  return field.samples[y * field.width + x] || sampleHydration(point.u, point.v);
}

export function getHydrationStatus() {
  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    previousReceipts: PREVIOUS_RECEIPTS,
    status: "active",
    id: "audralia-hydration-parent-tectonic-genealogy-aligned",
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    authorityPaths: AUTHORITY_PATHS,
    contracts: CONTRACTS,
    hydrationLaw: HYDRATION_LAW,
    tectonicsStatus: safeCall(null, () => getTectonicsStatus()),
    topologyStatus: safeCall(null, () => getTopologyStatus()),
    terrainStatus: safeCall(null, () => getTerrainStatus()),
    oceansStatus: safeCall(null, () => getOceansStatus()),
    exports: Object.freeze([
      "sampleHydration",
      "buildHydrationField",
      "getHydrationSampleFromField",
      "getHydrationStatus"
    ]),
    consumesTectonicsParent: true,
    consumesTopologyChild: true,
    consumesTerrainGrandchild: true,
    consumesOceansChild: true,
    hydrationParentActive: true,
    hydrationParentTectonicGenealogyAligned: true,
    oceansChildActive: true,
    oceanDoesNotOwnLand: true,
    landPreservedByTopology: true,
    turquoiseCoastalOutlineActive: true,
    ownsRouteRendering: false,
    ownsRuntimeRendering: false,
    ownsFinalRender: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
}

const api = Object.freeze({
  sampleHydration,
  buildHydrationField,
  getHydrationSampleFromField,
  getHydrationStatus
});

if (typeof window !== "undefined") {
  window.DGBAudraliaHydration = api;
  window.AudraliaHydration = api;
  window.audraliaHydration = api;
}

export default api;

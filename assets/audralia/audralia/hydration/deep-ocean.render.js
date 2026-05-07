// /assets/audralia/audralia/hydration/deep-ocean.render.js
// AUDRALIA_HYDRATION_DEEP_OCEAN_CONTINUOUS_DEPTH_ALIGNMENT_SWEEP_TNT_v3
// Full-file replacement. Deep-ocean child authority only.
// Purpose: consume oceans parent and define continuous deep-ocean depth, abyssal gradients,
// soft trench pressure, deep-water blend, organic depth presence, route-safe depth handoff,
// and 4K-compatible underwater depth signal.
// Does not own land/void footprint, terrain relief, hydration cycle, ocean fill parent,
// canvas paint, route shell, or visual pass.
// No GraphicBox. No image generation. No visual-pass claim.

import {
  sampleOcean,
  sampleOceanState,
  sampleSurface as sampleOceanSurface,
  getOceansStats,
  getOceansStatus
} from "./oceans.render.js";

const AUDRALIA_DEEP_OCEAN_RECEIPT = "AUDRALIA_HYDRATION_DEEP_OCEAN_CONTINUOUS_DEPTH_ALIGNMENT_SWEEP_TNT_v3";
const AUDRALIA_DEEP_OCEAN_COMPATIBILITY_RECEIPT = "AUDRALIA_HYDRATION_DEEP_OCEAN_CONTINUOUS_DEPTH_ALIGNMENT_SWEEP_TNT_v2";
const AUDRALIA_DEEP_OCEAN_ALIGNMENT_RECEIPT = "AUDRALIA_DEEP_OCEAN_OCEANS_PARENT_SOFT_DEPTH_ALIGNMENT_TNT_v1";

const STATUS = {
  ok: true,
  receipt: AUDRALIA_DEEP_OCEAN_RECEIPT,
  compatibilityReceipt: AUDRALIA_DEEP_OCEAN_COMPATIBILITY_RECEIPT,
  alignmentReceipt: AUDRALIA_DEEP_OCEAN_ALIGNMENT_RECEIPT,
  activeRenewal: "AUDRALIA_HYDRATION_DEEP_OCEAN_CONTINUOUS_DEPTH_ALIGNMENT_CONTRACT_v2",
  file: "assets/audralia/audralia/hydration/deep-ocean.render.js",
  role: "audralia-deep-ocean-child-continuous-depth-authority",
  lineage: "tectonics->topology->terrain->climate-conduit->hydration->oceans->deep-ocean->runtime->canvas-renderer->route",
  owns: [
    "deep-ocean depth field",
    "abyssal gradient",
    "soft trench pressure",
    "organic deep-water presence",
    "deep-ocean feather",
    "abyssal blue handoff",
    "turquoise suppression handoff",
    "depth handoff to runtime",
    "route-safe soft depth fields"
  ],
  doesNotOwn: [
    "land-versus-void footprint",
    "sea-level boundary",
    "terrain relief",
    "hydration cycle",
    "ocean fill parent",
    "hard route trench class",
    "canvas paint",
    "route shell",
    "visual pass claim",
    "GraphicBox",
    "image generation"
  ],
  oceansConsumed: true,
  deepOceanStable: true,
  continuousFieldActive: true,
  latitudeBandingSuppressed: true,
  bullseyeCollapseSuppressed: true,
  deepOceanMayOnlyDeepenWater: true,
  deepOceanCannotCreateWater: true,
  deepOceanCannotCreateLand: true,
  deepOceanCannotEraseTopologyLand: true,
  hardDeepOceanRouteClassSuppressed: true,
  routeMayReceiveSoftDepthFieldsOnly: true,
  fallbackAllowed: false,
  fallbackSamples: 0,
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,
  compatibilityReceipts: [
    "AUDRALIA_HYDRATION_DEEP_OCEAN_CONTINUOUS_DEPTH_ALIGNMENT_SWEEP_TNT_v2",
    "AUDRALIA_HYDRATION_DEEP_OCEAN_CONTINUOUS_DEPTH_ALIGNMENT_SWEEP_TNT_v3",
    "AUDRALIA_HYDRATION_OCEANS_CONTINUOUS_FILL_ALIGNMENT_SWEEP_TNT_v3",
    "AUDRALIA_HYDRATION_CONTINUOUS_TERRAIN_CONDUCTION_SWEEP_TNT_v3",
    "AUDRALIA_CLIMATE_4K_ENVIRONMENTAL_CONDUIT_TNT_v2",
    "AUDRALIA_TERRAIN_4K_RELIEF_DETAIL_TNT_v3",
    "AUDRALIA_TOPOLOGY_4K_FOOTPRINT_AUTHORITY_TNT_v1",
    "AUDRALIA_RUNTIME_4K_DOWNSTREAM_SURFACE_CONNECTOR_TNT_v7",
    "AUDRALIA_ADOPTED_CANVAS_FIXED_ASPECT_DOWNSTREAM_SWEEP_TNT_v9"
  ],
  api: {
    createAudraliaDeepOcean: true,
    buildDeepOceanField: true,
    buildDeepOceanGrid: true,
    sampleDeepOcean: true,
    sampleDeepOceanState: true,
    sampleDeepOceanField: true,
    sampleAudraliaDeepOcean: true,
    sampleSurface: true,
    sample: true,
    sampleOcean: true,
    sampleOceans: true,
    sampleHydration: true,
    getStats: true,
    getDeepOceanStats: true,
    getStatus: true,
    getDeepOceanStatus: true
  }
};

let cachedStats = null;
let cachedDeepOcean = null;

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function clamp01(value) {
  return clamp(value, 0, 1);
}

function smoothstep(edge0, edge1, value) {
  const denominator = edge1 - edge0;

  if (Math.abs(denominator) < 0.000001) {
    return value >= edge1 ? 1 : 0;
  }

  const t = clamp01((value - edge0) / denominator);
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
  let normalizer = 0;

  for (let i = 0; i < octaves; i += 1) {
    value += valueNoise3(x * frequency, y * frequency, z * frequency) * amplitude;
    normalizer += amplitude;
    frequency *= 2.04;
    amplitude *= 0.5;
  }

  return value / Math.max(0.000001, normalizer);
}

function ridgedNoise3(x, y, z, octaves = 4) {
  let value = 0;
  let amplitude = 0.54;
  let frequency = 1;
  let normalizer = 0;

  for (let i = 0; i < octaves; i += 1) {
    const n = valueNoise3(x * frequency, y * frequency, z * frequency);
    value += (1 - Math.abs(n * 2 - 1)) * amplitude;
    normalizer += amplitude;
    frequency *= 2.08;
    amplitude *= 0.5;
  }

  return value / Math.max(0.000001, normalizer);
}

function radToDeg(value) {
  return value * 180 / Math.PI;
}

function degToRad(value) {
  return value * Math.PI / 180;
}

function normalizeLongitudeDegrees(value) {
  let lon = Number(value);
  if (!Number.isFinite(lon)) lon = 0;

  while (lon > 180) lon -= 360;
  while (lon < -180) lon += 360;

  return lon;
}

function normalizeCoordinateInput(input, lonArg, uArg, vArg) {
  if (typeof input === "object" && input !== null) {
    let lat = Number(input.lat ?? input.latitude ?? input.phi);
    let lon = Number(input.lon ?? input.lng ?? input.longitude ?? input.theta);

    const latDegInput = Number(input.latDeg ?? input.latitudeDegrees ?? input.latDegrees);
    const lonDegInput = Number(input.lonDeg ?? input.longitudeDegrees ?? input.lngDeg ?? input.lonDegrees);

    const u = Number.isFinite(Number(input.u ?? input.x ?? uArg)) ? Number(input.u ?? input.x ?? uArg) : 0.5;
    const v = Number.isFinite(Number(input.v ?? input.y ?? vArg)) ? Number(input.v ?? input.y ?? vArg) : 0.5;

    if (Number.isFinite(latDegInput)) lat = degToRad(latDegInput);
    if (Number.isFinite(lonDegInput)) lon = degToRad(lonDegInput);

    if (!Number.isFinite(lat)) lat = (0.5 - v) * Math.PI;
    if (!Number.isFinite(lon)) lon = (u - 0.5) * Math.PI * 2;

    if (Math.abs(lat) > Math.PI / 2 + 0.01) lat = degToRad(lat);
    if (Math.abs(lon) > Math.PI * 2 + 0.01) lon = degToRad(lon);

    return {
      lat,
      lon,
      latDeg: radToDeg(lat),
      lonDeg: normalizeLongitudeDegrees(radToDeg(lon)),
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

  if (Math.abs(lat) > Math.PI / 2 + 0.01) lat = degToRad(lat);
  if (Math.abs(lon) > Math.PI * 2 + 0.01) lon = degToRad(lon);

  return {
    lat,
    lon,
    latDeg: radToDeg(lat),
    lonDeg: normalizeLongitudeDegrees(radToDeg(lon)),
    u,
    v
  };
}

function latLonToPoint(lat, lon) {
  const cosLat = Math.cos(lat);

  return {
    x: cosLat * Math.sin(lon),
    y: Math.sin(lat),
    z: cosLat * Math.cos(lon)
  };
}

function safeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function oceanFallback(coordinate) {
  const point = latLonToPoint(coordinate.lat, coordinate.lon);
  const polarIce = Math.abs(point.y) > 0.925;
  const field = hash3(
    Math.round(point.x * 8),
    Math.round(point.y * 8),
    Math.round(point.z * 8)
  );
  const land = field > 0.835 && Math.abs(point.y) < 0.86;
  const shelf = !land && !polarIce && field > 0.765 && field <= 0.835;
  const water = !land && !polarIce;
  const depth = water ? clamp01(0.34 + (1 - field) * 0.46) : 0;

  return {
    ok: false,
    receipt: "AUDRALIA_DEEP_OCEAN_INTERNAL_OCEAN_FALLBACK",
    oceanClass: water ? (shelf ? "ocean_shelf_water" : "ocean_open_water") : polarIce ? "ocean_ice_passthrough" : "ocean_land_passthrough",
    visualSurfaceClass: polarIce
      ? "glacier_ice_snowpack_surface"
      : land
        ? "inland_terrain_land_surface"
        : shelf
          ? "shelf_water_surface"
          : "ocean_water_surface",
    water,
    liquidWater: water,
    ocean: water && !shelf,
    shelf,
    coastal: shelf,
    land,
    exposedTerrainLand: land,
    visibleLand: land,
    solidSurfaceLand: land || polarIce,
    topologyLand: land || polarIce,
    ice: polarIce,
    glacier: polarIce,
    depth,
    rawDepth: depth,
    oceanDepth: depth,
    oceanMask: water ? 1 : 0,
    openOceanMask: water && !shelf ? 1 : 0,
    shelfMask: shelf ? 0.64 : 0,
    coastWaterMask: shelf ? 0.58 : 0,
    turquoise: shelf ? 0.72 : water ? 0.24 : 0,
    turquoiseIndex: shelf ? 0.72 : water ? 0.24 : 0,
    blueWaterIndex: water ? 0.7 : 0,
    surfaceCurrentIndex: water ? 0.4 : 0,
    waveEnergyIndex: water ? 0.4 : 0,
    deepOceanCandidate: water && !shelf,
    fallback: true,
    fallbackSample: true
  };
}

function sampleOceanSafe(coordinate) {
  const payload = {
    lat: coordinate.lat,
    lon: coordinate.lon,
    latitude: coordinate.lat,
    longitude: coordinate.lon,
    latDeg: coordinate.latDeg,
    lonDeg: coordinate.lonDeg,
    u: coordinate.u,
    v: coordinate.v,
    x: coordinate.u,
    y: coordinate.v
  };

  const attempts = [
    () => sampleOcean(payload),
    () => sampleOceanState(payload),
    () => sampleOceanSurface(payload),
    () => sampleOcean(coordinate.lat, coordinate.lon, coordinate.u, coordinate.v),
    () => sampleOcean(coordinate.latDeg, coordinate.lonDeg, coordinate.u, coordinate.v)
  ];

  for (const attempt of attempts) {
    try {
      const sample = attempt();

      if (sample && typeof sample === "object") {
        return sample.sample && typeof sample.sample === "object" ? sample.sample : sample;
      }
    } catch (_) {
      /* try next */
    }
  }

  return oceanFallback(coordinate);
}

function buildDeepOceanFieldInternal(input, lonArg, uArg, vArg) {
  const coordinate = normalizeCoordinateInput(input, lonArg, uArg, vArg);
  const point = latLonToPoint(coordinate.lat, coordinate.lon);
  const ocean = sampleOceanSafe(coordinate);

  const hydration = ocean.hydration || {};
  const terrain = ocean.terrain || hydration.terrain || {};
  const topology = ocean.topology || hydration.topology || terrain.topology || {};
  const climate = ocean.climate || hydration.climate || {};

  const isIce = Boolean(ocean.ice || ocean.glacier);
  const isLand = Boolean(ocean.land || ocean.exposedTerrainLand || ocean.visibleLand) && !ocean.liquidWater && !ocean.water && !isIce;
  const isWater = Boolean(ocean.water || ocean.liquidWater || ocean.ocean || ocean.shelf) && !isLand && !isIce;
  const isOpenOcean = Boolean(ocean.ocean || ocean.oceanClass === "ocean_open_water") && isWater;
  const isShelf = Boolean(ocean.shelf || ocean.oceanClass === "ocean_shelf_water" || ocean.oceanClass === "ocean_coastal_water") && isWater;

  const oceanMask = clamp01(safeNumber(ocean.oceanMask, isWater ? 1 : 0));
  const openOceanMask = clamp01(safeNumber(ocean.openOceanMask, isOpenOcean ? 1 : 0));
  const shelfMask = clamp01(safeNumber(ocean.shelfMask, isShelf ? 0.66 : 0));
  const coastWaterMask = clamp01(safeNumber(ocean.coastWaterMask, ocean.coastal ? 0.46 : 0));
  const parentDepth = clamp01(safeNumber(ocean.depth ?? ocean.oceanDepth ?? ocean.rawDepth, isWater ? 0.42 : 0));
  const surfaceCurrentIndex = clamp01(safeNumber(ocean.surfaceCurrentIndex, 0));
  const waveEnergyIndex = clamp01(safeNumber(ocean.waveEnergyIndex, 0));
  const blueWaterIndex = clamp01(safeNumber(ocean.blueWaterIndex, isWater ? 0.62 : 0));
  const turquoiseIndex = clamp01(safeNumber(ocean.turquoiseIndex ?? ocean.turquoise, isShelf ? 0.66 : isWater ? 0.22 : 0));
  const oceanContinuity = clamp01(safeNumber(ocean.oceanContinuity, 0.5));
  const climateWind = clamp01(safeNumber(ocean.windCorridorIndex ?? hydration.windCorridorIndex ?? climate.windCorridorIndex, 0.42));
  const evaporation = clamp01(safeNumber(ocean.evaporation ?? hydration.evaporation ?? climate.evaporationTendency, isWater ? 0.66 : 0.18));
  const rainfall = clamp01(safeNumber(ocean.rainfall ?? hydration.rainfall ?? climate.rainfallTendency, 0.34));
  const oceanCycleInfluence = clamp01(safeNumber(ocean.oceanCycleInfluence ?? hydration.oceanCycleInfluence ?? climate.oceanCycleInfluence, isWater ? 0.72 : 0.12));

  const abyssalContinuity = fbm3(
    point.x * 1.12 + 13.5,
    point.y * 1.12 - 4.8,
    point.z * 1.12 + 6.4,
    6
  );

  const basinDepthField = fbm3(
    point.x * 2.4 - 5.2,
    point.y * 2.4 + 9.1,
    point.z * 2.4 - 3.8,
    5
  );

  const abyssalPlainField = fbm3(
    point.x * 4.6 + 1.9,
    point.y * 4.6 - 11.3,
    point.z * 4.6 + 7.2,
    4
  );

  const softTrenchPressure = ridgedNoise3(
    point.x * 7.8 + 8.4,
    point.y * 7.8 - 2.7,
    point.z * 7.8 + 14.6,
    5
  );

  const currentShearField = fbm3(
    point.x * 10.5 - 6.6,
    point.y * 10.5 + 3.2,
    point.z * 10.5 - 8.9,
    4
  );

  const abyssalMicroTexture = fbm3(
    point.x * 24.0 + 2.7,
    point.y * 24.0 - 12.4,
    point.z * 24.0 + 18.2,
    3
  );

  const polarDarkening = clamp01(Math.abs(point.y) * 0.22);
  const openWaterDepthAuthority = isWater && !isLand && !isIce;

  const deepOceanActivation = openWaterDepthAuthority
    ? clamp01(
        openOceanMask * 0.44 +
          parentDepth * 0.26 +
          abyssalContinuity * 0.12 +
          basinDepthField * 0.08 +
          oceanContinuity * 0.06 +
          (1 - shelfMask) * 0.04
      )
    : 0;

  const organicDeepOceanPresence = openWaterDepthAuthority
    ? clamp01(
        deepOceanActivation * 0.44 +
          abyssalPlainField * 0.20 +
          softTrenchPressure * 0.14 +
          blueWaterIndex * 0.12 +
          oceanCycleInfluence * 0.06 +
          abyssalMicroTexture * 0.04
      )
    : 0;

  const deepOceanFeather = openWaterDepthAuthority
    ? clamp01(
        openOceanMask * 0.40 +
          (1 - coastWaterMask) * 0.20 +
          (1 - shelfMask) * 0.20 +
          abyssalContinuity * 0.12 +
          parentDepth * 0.08
      )
    : 0;

  const softTrenchIndex = openWaterDepthAuthority
    ? clamp01(
        softTrenchPressure * 0.42 +
          basinDepthField * 0.22 +
          deepOceanFeather * 0.18 +
          currentShearField * 0.08 +
          waveEnergyIndex * 0.06 +
          climateWind * 0.04
      )
    : 0;

  const abyssalPressureIndex = openWaterDepthAuthority
    ? clamp01(
        parentDepth * 0.28 +
          openOceanMask * 0.22 +
          softTrenchIndex * 0.20 +
          organicDeepOceanPresence * 0.16 +
          abyssalMicroTexture * 0.08 +
          polarDarkening * 0.06
      )
    : 0;

  const deepOceanBlend = openWaterDepthAuthority
    ? clamp01(
        parentDepth * 0.32 +
          deepOceanActivation * 0.25 +
          organicDeepOceanPresence * 0.19 +
          softTrenchIndex * 0.13 +
          abyssalPressureIndex * 0.11
      )
    : 0;

  const finalDepth = openWaterDepthAuthority
    ? clamp01(
        parentDepth * 0.38 +
          deepOceanBlend * 0.31 +
          softTrenchIndex * 0.11 +
          abyssalPressureIndex * 0.08 +
          polarDarkening * 0.05 +
          currentShearField * 0.04 +
          evaporation * 0.03
      )
    : parentDepth;

  const routeSafeDepth = openWaterDepthAuthority
    ? clamp01(finalDepth * 0.70 + deepOceanFeather * 0.15 + organicDeepOceanPresence * 0.10 + abyssalPressureIndex * 0.05)
    : 0;

  const abyssalBlueIndex = openWaterDepthAuthority
    ? clamp01(blueWaterIndex * 0.34 + finalDepth * 0.38 + organicDeepOceanPresence * 0.16 + abyssalPressureIndex * 0.12)
    : 0;

  const turquoiseSuppression = openWaterDepthAuthority
    ? clamp01(deepOceanBlend * 0.52 + openOceanMask * 0.26 + (1 - shelfMask) * 0.14 + abyssalPressureIndex * 0.08)
    : 0;

  const visibleTurquoiseIndex = openWaterDepthAuthority
    ? clamp01(turquoiseIndex * (1 - turquoiseSuppression * 0.72))
    : turquoiseIndex;

  const deepOrganicPresence = organicDeepOceanPresence;

  let deepOceanClass = "deep_ocean_non_water_passthrough";

  if (isIce) deepOceanClass = "deep_ocean_ice_passthrough";
  else if (isLand) deepOceanClass = "deep_ocean_land_passthrough";
  else if (!openWaterDepthAuthority) deepOceanClass = "deep_ocean_non_water_passthrough";
  else if (shelfMask > 0.42 || coastWaterMask > 0.42) deepOceanClass = "deep_ocean_shelf_soft_depth";
  else if (deepOceanBlend > 0.58 || abyssalPressureIndex > 0.62) deepOceanClass = "deep_ocean_abyssal_soft_depth";
  else deepOceanClass = "deep_ocean_open_soft_depth";

  const visualSurfaceClass =
    deepOceanClass === "deep_ocean_shelf_soft_depth"
      ? "shelf_water_surface"
      : deepOceanClass === "deep_ocean_abyssal_soft_depth" || deepOceanClass === "deep_ocean_open_soft_depth"
        ? "ocean_water_surface"
        : ocean.visualSurfaceClass || ocean.surfaceClass || "inland_terrain_land_surface";

  return {
    ...ocean,
    ok: true,
    receipt: AUDRALIA_DEEP_OCEAN_RECEIPT,
    compatibilityReceipt: AUDRALIA_DEEP_OCEAN_COMPATIBILITY_RECEIPT,
    alignmentReceipt: AUDRALIA_DEEP_OCEAN_ALIGNMENT_RECEIPT,
    source: "audralia-deep-ocean-continuous-depth-alignment",
    ocean,
    hydration,
    terrain,
    topology,
    climate,
    oceansReceipt: ocean.receipt || "",
    oceansConsumed: true,

    lat: coordinate.lat,
    lon: coordinate.lon,
    latitude: coordinate.lat,
    longitude: coordinate.lon,
    latDeg: coordinate.latDeg,
    lonDeg: coordinate.lonDeg,
    u: coordinate.u,
    v: coordinate.v,
    x: coordinate.u,
    y: coordinate.v,
    sx: point.x,
    sy: point.y,
    sz: point.z,

    deepOceanClass,
    visualSurfaceClass,
    surfaceClass: visualSurfaceClass,

    abyssalContinuity,
    basinDepthField,
    abyssalPlainField,
    softTrenchPressure,
    currentShearField,
    abyssalMicroTexture,
    polarDarkening,
    deepOceanActivation,
    organicDeepOceanPresence,
    deepOrganicPresence,
    deepOrganic: deepOrganicPresence > 0.42,
    deepOceanFeather,
    softTrenchIndex,
    abyssalPressureIndex,
    deepOceanBlend,
    finalDepth,
    routeSafeDepth,
    abyssalBlueIndex,
    turquoiseSuppression,
    visibleTurquoiseIndex,

    depth: openWaterDepthAuthority ? finalDepth : parentDepth,
    maxDepth: openWaterDepthAuthority ? finalDepth : parentDepth,
    rawDepth: parentDepth,
    oceanDepth: openWaterDepthAuthority ? finalDepth : parentDepth,
    maxRawDepth: parentDepth,
    maxDeepOceanBlend: deepOceanBlend,
    maxDeepOceanFeather: deepOceanFeather,
    maxOrganicDeepOceanPresence: organicDeepOceanPresence,

    turquoise: visibleTurquoiseIndex,
    turquoiseIndex: visibleTurquoiseIndex,
    blueWaterIndex: abyssalBlueIndex,

    deepOceanCandidate: openWaterDepthAuthority && deepOceanBlend > 0.42,
    deepOceanIsDepthFieldNotRouteBlob: true,
    hardDeepOceanRouteClassSuppressed: true,
    hardDeepOceanRouteClassSamples: 0,
    trench: false,
    trenchSamples: 0,
    trenchRatio: 0,
    routeMayReceiveSoftDepthFieldsOnly: true,

    water: Boolean(ocean.water || ocean.liquidWater || openWaterDepthAuthority),
    liquidWater: Boolean(ocean.liquidWater || openWaterDepthAuthority),
    ocean: Boolean(ocean.ocean && !isShelf),
    shelf: Boolean(ocean.shelf),
    coastal: Boolean(ocean.coastal),
    land: Boolean(ocean.land) && !openWaterDepthAuthority,
    exposedTerrainLand: Boolean(ocean.exposedTerrainLand) && !openWaterDepthAuthority,
    visibleLand: Boolean(ocean.visibleLand || ocean.exposedTerrainLand) && !openWaterDepthAuthority,
    solidSurfaceLand: Boolean(ocean.solidSurfaceLand || isIce) && !openWaterDepthAuthority,
    topologyLand: Boolean(ocean.topologyLand || isIce) && !openWaterDepthAuthority,
    ice: isIce,
    glacier: isIce,

    rainfall,
    evaporation,
    oceanCycleInfluence,
    surfaceCurrentIndex,
    waveEnergyIndex,

    deepOceanMayOnlyDeepenWater: true,
    deepOceanCannotCreateWater: true,
    deepOceanCannotCreateLand: true,
    deepOceanCannotEraseTopologyLand: true,

    fallback: false,
    fallbackSample: false,
    fallbackAllowed: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };
}

function computeStats() {
  if (cachedStats) return cachedStats;

  const width = 192;
  const height = 96;
  const totalSamples = width * height;

  const classCounts = {};
  const rowDominance = [];

  let deepOrganicSamples = 0;
  let openSoftDepthSamples = 0;
  let abyssalSoftDepthSamples = 0;
  let shelfSoftDepthSamples = 0;
  let liquidWaterSamples = 0;
  let oceanSamples = 0;
  let shelfSamples = 0;
  let landSamples = 0;
  let solidSurfaceLandSamples = 0;
  let fallbackSamples = 0;
  let hardDeepOceanRouteClassSamples = 0;
  let trenchSamples = 0;

  let maxDepth = 0;
  let maxRawDepth = 0;
  let maxDeepOceanBlend = 0;
  let maxDeepOceanFeather = 0;
  let maxOrganicDeepOceanPresence = 0;
  let maxSoftTrenchIndex = 0;
  let maxAbyssalPressureIndex = 0;
  let maxRouteSafeDepth = 0;
  let maxAbyssalBlueIndex = 0;
  let maxVisibleTurquoiseIndex = 0;

  for (let row = 0; row < height; row += 1) {
    const v = (row + 0.5) / height;
    const lat = (0.5 - v) * Math.PI;
    const rowCounts = {};

    for (let col = 0; col < width; col += 1) {
      const u = (col + 0.5) / width;
      const lon = (u - 0.5) * Math.PI * 2;
      const sample = buildDeepOceanFieldInternal({ lat, lon, u, v });

      const cls = sample.deepOceanClass;
      classCounts[cls] = (classCounts[cls] || 0) + 1;
      rowCounts[cls] = (rowCounts[cls] || 0) + 1;

      if (sample.deepOceanCandidate || sample.deepOrganic) deepOrganicSamples += 1;
      if (sample.deepOceanClass === "deep_ocean_open_soft_depth") openSoftDepthSamples += 1;
      if (sample.deepOceanClass === "deep_ocean_abyssal_soft_depth") abyssalSoftDepthSamples += 1;
      if (sample.deepOceanClass === "deep_ocean_shelf_soft_depth") shelfSoftDepthSamples += 1;
      if (sample.liquidWater) liquidWaterSamples += 1;
      if (sample.ocean) oceanSamples += 1;
      if (sample.shelf) shelfSamples += 1;
      if (sample.exposedTerrainLand) landSamples += 1;
      if (sample.solidSurfaceLand) solidSurfaceLandSamples += 1;
      if (sample.fallbackSample) fallbackSamples += 1;
      if (!sample.hardDeepOceanRouteClassSuppressed) hardDeepOceanRouteClassSamples += 1;
      if (sample.trench) trenchSamples += 1;

      maxDepth = Math.max(maxDepth, sample.depth);
      maxRawDepth = Math.max(maxRawDepth, sample.rawDepth);
      maxDeepOceanBlend = Math.max(maxDeepOceanBlend, sample.deepOceanBlend);
      maxDeepOceanFeather = Math.max(maxDeepOceanFeather, sample.deepOceanFeather);
      maxOrganicDeepOceanPresence = Math.max(maxOrganicDeepOceanPresence, sample.organicDeepOceanPresence);
      maxSoftTrenchIndex = Math.max(maxSoftTrenchIndex, sample.softTrenchIndex);
      maxAbyssalPressureIndex = Math.max(maxAbyssalPressureIndex, sample.abyssalPressureIndex);
      maxRouteSafeDepth = Math.max(maxRouteSafeDepth, sample.routeSafeDepth);
      maxAbyssalBlueIndex = Math.max(maxAbyssalBlueIndex, sample.abyssalBlueIndex);
      maxVisibleTurquoiseIndex = Math.max(maxVisibleTurquoiseIndex, sample.visibleTurquoiseIndex);
    }

    rowDominance.push(Math.max(...Object.values(rowCounts)) / width);
  }

  const deepOrganicRatio = deepOrganicSamples / totalSamples;
  const openSoftDepthRatio = openSoftDepthSamples / totalSamples;
  const abyssalSoftDepthRatio = abyssalSoftDepthSamples / totalSamples;
  const shelfSoftDepthRatio = shelfSoftDepthSamples / totalSamples;
  const liquidWaterRatio = liquidWaterSamples / totalSamples;
  const oceanRatio = oceanSamples / totalSamples;
  const shelfRatio = shelfSamples / totalSamples;
  const landRatio = landSamples / totalSamples;
  const solidSurfaceLandRatio = solidSurfaceLandSamples / totalSamples;
  const fallbackRatio = fallbackSamples / totalSamples;
  const hardDeepOceanRouteClassRatio = hardDeepOceanRouteClassSamples / totalSamples;
  const trenchRatio = trenchSamples / totalSamples;
  const maxDominantRowRatio = Math.max(...rowDominance);
  const averageRowDominance = rowDominance.reduce((sum, value) => sum + value, 0) / rowDominance.length;

  cachedStats = {
    ok: true,
    receipt: AUDRALIA_DEEP_OCEAN_RECEIPT,
    compatibilityReceipt: AUDRALIA_DEEP_OCEAN_COMPATIBILITY_RECEIPT,
    alignmentReceipt: AUDRALIA_DEEP_OCEAN_ALIGNMENT_RECEIPT,
    oceansStats: safeGetOceansStats(),
    oceansStatus: safeGetOceansStatus(),
    totalSamples,
    classCounts,
    visualSurfaceClasses: Object.keys(classCounts),

    deepOrganicSamples,
    openSoftDepthSamples,
    abyssalSoftDepthSamples,
    shelfSoftDepthSamples,
    liquidWaterSamples,
    waterSamples: liquidWaterSamples,
    oceanSamples,
    shelfSamples,
    landSamples,
    solidSurfaceLandSamples,
    fallbackSamples,
    hardDeepOceanRouteClassSamples,
    trenchSamples,

    deepOrganicRatio,
    openSoftDepthRatio,
    abyssalSoftDepthRatio,
    shelfSoftDepthRatio,
    liquidWaterRatio,
    waterRatio: liquidWaterRatio,
    oceanRatio,
    shelfRatio,
    landRatio,
    solidSurfaceLandRatio,
    fallbackRatio,
    hardDeepOceanRouteClassRatio,
    trenchRatio,

    maxDepth,
    maxRawDepth,
    maxDeepOceanBlend,
    maxDeepOceanFeather,
    maxOrganicDeepOceanPresence,
    maxSoftTrenchIndex,
    maxAbyssalPressureIndex,
    maxRouteSafeDepth,
    maxAbyssalBlueIndex,
    maxVisibleTurquoiseIndex,

    maxDominantRowRatio,
    averageRowDominance,
    rowBandingSuppressed: averageRowDominance < 0.84,
    bullseyeCollapseSuppressed: maxDominantRowRatio < 0.95,

    deepOceanMayOnlyDeepenWater: true,
    deepOceanCannotCreateWater: true,
    deepOceanCannotCreateLand: true,
    deepOceanCannotEraseTopologyLand: true,
    deepOceanIsDepthFieldNotRouteBlob: true,
    hardDeepOceanRouteClassSuppressed: true,
    routeMayReceiveSoftDepthFieldsOnly: true,
    deepOceanStable: true,
    continuousFieldActive: true,
    fallbackAllowed: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };

  STATUS.fallbackSamples = fallbackSamples;
  STATUS.fallbackAllowed = fallbackSamples > 0;
  STATUS.fallbackReason = fallbackSamples > 0 ? "deep-ocean-fallback-samples-observed" : "oceans-parent-soft-depth-ready";

  return cachedStats;
}

function safeGetOceansStats() {
  try {
    return getOceansStats();
  } catch (_) {
    return null;
  }
}

function safeGetOceansStatus() {
  try {
    return getOceansStatus();
  } catch (_) {
    return null;
  }
}

function buildDeepOceanGrid(options = {}) {
  const width = clamp(Math.floor(Number(options.width) || 96), 24, 384);
  const height = clamp(Math.floor(Number(options.height) || 48), 12, 192);
  const samples = new Array(width * height);

  for (let row = 0; row < height; row += 1) {
    const v = height === 1 ? 0.5 : row / (height - 1);
    const lat = (0.5 - v) * Math.PI;

    for (let col = 0; col < width; col += 1) {
      const u = width === 1 ? 0.5 : col / (width - 1);
      const lon = (u - 0.5) * Math.PI * 2;
      samples[row * width + col] = buildDeepOceanFieldInternal({ lat, lon, u, v });
    }
  }

  return {
    ok: true,
    receipt: AUDRALIA_DEEP_OCEAN_RECEIPT,
    compatibilityReceipt: AUDRALIA_DEEP_OCEAN_COMPATIBILITY_RECEIPT,
    alignmentReceipt: AUDRALIA_DEEP_OCEAN_ALIGNMENT_RECEIPT,
    width,
    height,
    samples,
    stats: computeStats(),
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };
}

function createDeepOceanObject() {
  if (cachedDeepOcean) return cachedDeepOcean;

  cachedDeepOcean = {
    ok: true,
    receipt: AUDRALIA_DEEP_OCEAN_RECEIPT,
    compatibilityReceipt: AUDRALIA_DEEP_OCEAN_COMPATIBILITY_RECEIPT,
    alignmentReceipt: AUDRALIA_DEEP_OCEAN_ALIGNMENT_RECEIPT,
    status: STATUS,
    sampleDeepOcean: buildDeepOceanFieldInternal,
    sampleDeepOceanState: buildDeepOceanFieldInternal,
    sampleDeepOceanField: buildDeepOceanFieldInternal,
    sampleAudraliaDeepOcean: buildDeepOceanFieldInternal,
    sampleOcean: buildDeepOceanFieldInternal,
    sampleOceans: buildDeepOceanFieldInternal,
    sampleHydration: buildDeepOceanFieldInternal,
    sampleSurface: buildDeepOceanFieldInternal,
    sample: buildDeepOceanFieldInternal,
    buildDeepOceanField: buildDeepOceanFieldInternal,
    buildDeepOceanGrid,
    getStatus,
    getDeepOceanStatus,
    getStats,
    getDeepOceanStats
  };

  return cachedDeepOcean;
}

export function getStatus() {
  return {
    ...STATUS,
    stats: computeStats()
  };
}

export function getDeepOceanStatus() {
  return getStatus();
}

export function getStats() {
  return computeStats();
}

export function getDeepOceanStats() {
  return computeStats();
}

export function sampleDeepOcean(input, lonArg, uArg, vArg) {
  return buildDeepOceanFieldInternal(input, lonArg, uArg, vArg);
}

export function sampleDeepOceanState(input, lonArg, uArg, vArg) {
  return buildDeepOceanFieldInternal(input, lonArg, uArg, vArg);
}

export function sampleDeepOceanField(input, lonArg, uArg, vArg) {
  return buildDeepOceanFieldInternal(input, lonArg, uArg, vArg);
}

export function sampleAudraliaDeepOcean(input, lonArg, uArg, vArg) {
  return buildDeepOceanFieldInternal(input, lonArg, uArg, vArg);
}

export function sampleSurface(input, lonArg, uArg, vArg) {
  return buildDeepOceanFieldInternal(input, lonArg, uArg, vArg);
}

export function sample(input, lonArg, uArg, vArg) {
  return buildDeepOceanFieldInternal(input, lonArg, uArg, vArg);
}

export function buildDeepOceanField(input, lonArg, uArg, vArg) {
  return buildDeepOceanFieldInternal(input, lonArg, uArg, vArg);
}

export function createAudraliaDeepOcean() {
  return createDeepOceanObject();
}

export const AUDRALIA_DEEP_OCEAN_STATUS = STATUS;
export const AUDRALIA_DEEP_OCEAN_RECEIPT_VALUE = AUDRALIA_DEEP_OCEAN_RECEIPT;
export const AUDRALIA_DEEP_OCEAN_COMPATIBILITY_RECEIPT_VALUE = AUDRALIA_DEEP_OCEAN_COMPATIBILITY_RECEIPT;
export const AUDRALIA_DEEP_OCEAN_ALIGNMENT_RECEIPT_VALUE = AUDRALIA_DEEP_OCEAN_ALIGNMENT_RECEIPT;

const api = createDeepOceanObject();

if (typeof window !== "undefined") {
  window.AUDRALIA_DEEP_OCEAN_STATUS = STATUS;
  window.AUDRALIA_DEEP_OCEAN_RECEIPT = AUDRALIA_DEEP_OCEAN_RECEIPT;
  window.__AUDRALIA_DEEP_OCEAN_STATUS__ = STATUS;
  window.__AUDRALIA_DEEP_OCEAN_RECEIPT__ = AUDRALIA_DEEP_OCEAN_RECEIPT;
  window.AudraliaDeepOcean = api;
  window.DGBAudraliaDeepOcean = api;

  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dataset.audraliaDeepOceanReceipt = AUDRALIA_DEEP_OCEAN_RECEIPT;
    document.documentElement.dataset.audraliaDeepOceanCompatibilityReceipt = AUDRALIA_DEEP_OCEAN_COMPATIBILITY_RECEIPT;
    document.documentElement.dataset.audraliaDeepOceanAlignmentReceipt = AUDRALIA_DEEP_OCEAN_ALIGNMENT_RECEIPT;
    document.documentElement.dataset.audraliaDeepOceanContinuousField = "true";
    document.documentElement.dataset.audraliaDeepOceanConsumesOceans = "true";
    document.documentElement.dataset.audraliaDeepOceanIsDepthFieldNotRouteBlob = "true";
    document.documentElement.dataset.audraliaHardDeepOceanRouteClassSuppressed = "true";
    document.documentElement.dataset.audraliaRouteMayReceiveSoftDepthFieldsOnly = "true";
    document.documentElement.dataset.audraliaDeepOceanCreatesWater = "false";
    document.documentElement.dataset.audraliaDeepOceanCreatesLand = "false";
    document.documentElement.dataset.audraliaDeepOceanErasesTopologyLand = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }
}

export default createAudraliaDeepOcean;

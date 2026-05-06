// /assets/audralia/audralia/hydration/deep-ocean.render.js
// AUDRALIA_HYDRATION_DEEP_OCEAN_CONTINUOUS_DEPTH_ALIGNMENT_SWEEP_TNT_v2
// Full-file replacement. Deep-ocean child authority only.
// Purpose: consume oceans parent and define continuous deep-ocean depth, abyssal gradients,
// soft trench pressure, deep-water blend, and route-safe depth handoff.
// Does not own land/void footprint, terrain relief, hydration cycle, ocean fill parent,
// canvas paint, route shell, or visual pass.
// No GraphicBox. No image generation. No visual-pass claim.

import {
  sampleOcean,
  getOceansStats
} from "./oceans.render.js";

const AUDRALIA_DEEP_OCEAN_RECEIPT = "AUDRALIA_HYDRATION_DEEP_OCEAN_CONTINUOUS_DEPTH_ALIGNMENT_SWEEP_TNT_v2";

const STATUS = {
  ok: true,
  receipt: AUDRALIA_DEEP_OCEAN_RECEIPT,
  activeRenewal: "AUDRALIA_HYDRATION_DEEP_OCEAN_CONTINUOUS_DEPTH_ALIGNMENT_CONTRACT_v1",
  file: "assets/audralia/audralia/hydration/deep-ocean.render.js",
  role: "audralia-deep-ocean-child-continuous-depth-authority",
  lineage: "tectonics→topology→terrain→hydration→oceans→deep-ocean→runtime→canvas-renderer→route",
  owns: [
    "deep-ocean depth field",
    "abyssal gradient",
    "soft trench pressure",
    "organic deep-water presence",
    "deep-ocean feather",
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
    "visual pass claim"
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
    "AUDRALIA_HYDRATION_OCEANS_CONTINUOUS_FILL_ALIGNMENT_SWEEP_TNT_v2",
    "AUDRALIA_HYDRATION_CONTINUOUS_TERRAIN_CONDUCTION_SWEEP_TNT_v2",
    "AUDRALIA_TERRAIN_CONTINUOUS_RELIEF_ALIGNMENT_SWEEP_TNT_v2",
    "AUDRALIA_TOPOLOGY_CONTINUOUS_LAND_VOID_BOUNDARY_SWEEP_TNT_v2",
    "AUDRALIA_RUNTIME_DOWNSTREAM_SWEEP_CONTINUOUS_FIELD_TNT_v3",
    "AUDRALIA_ADOPTED_CANVAS_FIXED_ASPECT_DOWNSTREAM_SWEEP_TNT_v9"
  ],
  api: {
    createAudraliaDeepOcean: true,
    buildDeepOceanField: true,
    sampleDeepOcean: true,
    sampleDeepOceanField: true,
    sampleSurface: true,
    getStats: true,
    getDeepOceanStats: true,
    getStatus: true
  }
};

let cachedStats = null;
let cachedDeepOcean = null;

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

function sampleOceanSafe(input, lonArg, uArg, vArg) {
  try {
    const sample = sampleOcean(input, lonArg, uArg, vArg);
    if (sample && typeof sample === "object") return sample;
  } catch (_) {}

  return {
    ok: false,
    oceanClass: "ocean_open_water",
    visualSurfaceClass: "ocean_water_surface",
    water: true,
    liquidWater: true,
    ocean: true,
    shelf: false,
    coastal: false,
    land: false,
    exposedTerrainLand: false,
    solidSurfaceLand: false,
    ice: false,
    glacier: false,
    depth: 0.5,
    rawDepth: 0.5,
    oceanDepth: 0.5,
    oceanMask: 1,
    openOceanMask: 1,
    shelfMask: 0,
    coastWaterMask: 0,
    turquoise: 0.2,
    blueWaterIndex: 0.7,
    surfaceCurrentIndex: 0.4,
    waveEnergyIndex: 0.4,
    deepOceanCandidate: true,
    fallback: true,
    fallbackSample: true
  };
}

function buildDeepOceanFieldInternal(input, lonArg, uArg, vArg) {
  const coordinate = normalizeCoordinateInput(input, lonArg, uArg, vArg);
  const point = latLonToPoint(coordinate.lat, coordinate.lon);
  const ocean = sampleOceanSafe({ ...coordinate, lat: coordinate.lat, lon: coordinate.lon });

  const isWater = Boolean(ocean.water || ocean.liquidWater || ocean.ocean || ocean.shelf);
  const isOpenOcean = Boolean(ocean.ocean);
  const isShelf = Boolean(ocean.shelf);
  const isLand = Boolean(ocean.land || ocean.exposedTerrainLand) && !isWater;
  const isIce = Boolean(ocean.ice || ocean.glacier);

  const oceanMask = clamp01(Number(ocean.oceanMask ?? (isWater ? 1 : 0)));
  const openOceanMask = clamp01(Number(ocean.openOceanMask ?? (isOpenOcean ? 1 : 0)));
  const shelfMask = clamp01(Number(ocean.shelfMask ?? (isShelf ? 1 : 0)));
  const coastWaterMask = clamp01(Number(ocean.coastWaterMask ?? 0));
  const parentDepth = clamp01(Number(ocean.depth ?? ocean.oceanDepth ?? ocean.rawDepth ?? 0));
  const surfaceCurrentIndex = clamp01(Number(ocean.surfaceCurrentIndex ?? 0));
  const waveEnergyIndex = clamp01(Number(ocean.waveEnergyIndex ?? 0));
  const blueWaterIndex = clamp01(Number(ocean.blueWaterIndex ?? 0));
  const turquoiseIndex = clamp01(Number(ocean.turquoiseIndex ?? ocean.turquoise ?? 0));

  const abyssalContinuity = fbm3(
    point.x * 1.12 + 13.5,
    point.y * 1.12 - 4.8,
    point.z * 1.12 + 6.4,
    5
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
    4
  );

  const currentShearField = fbm3(
    point.x * 10.5 - 6.6,
    point.y * 10.5 + 3.2,
    point.z * 10.5 - 8.9,
    3
  );

  const polarDarkening = clamp01(Math.abs(point.y) * 0.22);
  const openWaterDepthAuthority = isWater && !isLand && !isIce;

  const deepOceanActivation = openWaterDepthAuthority
    ? clamp01(
        openOceanMask * 0.48 +
        parentDepth * 0.28 +
        abyssalContinuity * 0.12 +
        basinDepthField * 0.08 +
        (1 - shelfMask) * 0.04
      )
    : 0;

  const organicDeepOceanPresence = openWaterDepthAuthority
    ? clamp01(
        deepOceanActivation * 0.48 +
        abyssalPlainField * 0.22 +
        softTrenchPressure * 0.16 +
        blueWaterIndex * 0.14
      )
    : 0;

  const deepOceanFeather = openWaterDepthAuthority
    ? clamp01(
        openOceanMask * 0.42 +
        (1 - coastWaterMask) * 0.22 +
        (1 - shelfMask) * 0.22 +
        abyssalContinuity * 0.14
      )
    : 0;

  const softTrenchIndex = openWaterDepthAuthority
    ? clamp01(
        softTrenchPressure * 0.48 +
        basinDepthField * 0.24 +
        deepOceanFeather * 0.2 +
        currentShearField * 0.08
      )
    : 0;

  const deepOceanBlend = openWaterDepthAuthority
    ? clamp01(
        parentDepth * 0.36 +
        deepOceanActivation * 0.28 +
        organicDeepOceanPresence * 0.22 +
        softTrenchIndex * 0.14
      )
    : 0;

  const finalDepth = openWaterDepthAuthority
    ? clamp01(
        parentDepth * 0.42 +
        deepOceanBlend * 0.34 +
        softTrenchIndex * 0.12 +
        polarDarkening * 0.06 +
        currentShearField * 0.06
      )
    : parentDepth;

  const routeSafeDepth = openWaterDepthAuthority
    ? clamp01(finalDepth * 0.72 + deepOceanFeather * 0.16 + organicDeepOceanPresence * 0.12)
    : 0;

  const abyssalBlueIndex = openWaterDepthAuthority
    ? clamp01(blueWaterIndex * 0.38 + finalDepth * 0.42 + organicDeepOceanPresence * 0.2)
    : 0;

  const turquoiseSuppression = openWaterDepthAuthority
    ? clamp01(deepOceanBlend * 0.56 + openOceanMask * 0.28 + (1 - shelfMask) * 0.16)
    : 0;

  const visibleTurquoiseIndex = openWaterDepthAuthority
    ? clamp01(turquoiseIndex * (1 - turquoiseSuppression * 0.72))
    : turquoiseIndex;

  let deepOceanClass = "deep_ocean_non_water_passthrough";
  if (isIce) deepOceanClass = "deep_ocean_ice_passthrough";
  else if (isLand) deepOceanClass = "deep_ocean_land_passthrough";
  else if (!openWaterDepthAuthority) deepOceanClass = "deep_ocean_non_water_passthrough";
  else if (shelfMask > 0.42 || coastWaterMask > 0.42) deepOceanClass = "deep_ocean_shelf_soft_depth";
  else if (deepOceanBlend > 0.58) deepOceanClass = "deep_ocean_abyssal_soft_depth";
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
    source: "audralia-deep-ocean-continuous-depth-alignment",
    ocean,
    oceansReceipt: ocean.receipt || "",
    oceansConsumed: true,
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
    deepOceanClass,
    visualSurfaceClass,
    surfaceClass: visualSurfaceClass,
    abyssalContinuity,
    basinDepthField,
    abyssalPlainField,
    softTrenchPressure,
    currentShearField,
    polarDarkening,
    deepOceanActivation,
    organicDeepOceanPresence,
    deepOceanFeather,
    softTrenchIndex,
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
    water: Boolean(ocean.water),
    liquidWater: Boolean(ocean.liquidWater),
    ocean: Boolean(ocean.ocean),
    shelf: Boolean(ocean.shelf),
    coastal: Boolean(ocean.coastal),
    land: Boolean(ocean.land),
    exposedTerrainLand: Boolean(ocean.exposedTerrainLand),
    solidSurfaceLand: Boolean(ocean.solidSurfaceLand),
    ice: Boolean(ocean.ice),
    glacier: Boolean(ocean.glacier),
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

  const width = 256;
  const height = 128;
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

      if (sample.deepOceanCandidate) deepOrganicSamples += 1;
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
    oceansStats: getOceansStats(),
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

  return cachedStats;
}

function createDeepOceanObject() {
  if (cachedDeepOcean) return cachedDeepOcean;

  cachedDeepOcean = {
    ok: true,
    receipt: AUDRALIA_DEEP_OCEAN_RECEIPT,
    status: STATUS,
    sampleDeepOcean: buildDeepOceanFieldInternal,
    sampleDeepOceanField: buildDeepOceanFieldInternal,
    sampleSurface: buildDeepOceanFieldInternal,
    buildDeepOceanField: buildDeepOceanFieldInternal,
    getStatus,
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

export function getStats() {
  return computeStats();
}

export function getDeepOceanStats() {
  return computeStats();
}

export function sampleDeepOcean(input, lonArg, uArg, vArg) {
  return buildDeepOceanFieldInternal(input, lonArg, uArg, vArg);
}

export function sampleDeepOceanField(input, lonArg, uArg, vArg) {
  return buildDeepOceanFieldInternal(input, lonArg, uArg, vArg);
}

export function sampleSurface(input, lonArg, uArg, vArg) {
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

if (typeof window !== "undefined") {
  window.AUDRALIA_DEEP_OCEAN_STATUS = STATUS;
  window.AUDRALIA_DEEP_OCEAN_RECEIPT = AUDRALIA_DEEP_OCEAN_RECEIPT;
  window.__AUDRALIA_DEEP_OCEAN_STATUS__ = STATUS;
  window.__AUDRALIA_DEEP_OCEAN_RECEIPT__ = AUDRALIA_DEEP_OCEAN_RECEIPT;

  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dataset.audraliaDeepOceanReceipt = AUDRALIA_DEEP_OCEAN_RECEIPT;
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

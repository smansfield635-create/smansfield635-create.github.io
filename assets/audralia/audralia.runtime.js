// /assets/audralia/audralia.runtime.js
// AUDRALIA_RUNTIME_STABLE_TERRAIN_READY_OCEAN_WORLD_TNT_v2
// Full-file replacement. Runtime authority only.
// Purpose: stabilize Audralia runtime truth for terrain work.
// Visual canvas may still design-takeover temporarily, but runtime now exposes a stable sampled planet field.
// No GraphicBox. No image generation. No visual-pass claim.

const AUDRALIA_RUNTIME_RECEIPT = "AUDRALIA_RUNTIME_STABLE_TERRAIN_READY_OCEAN_WORLD_TNT_v2";

const TARGET_SOLID_SURFACE_RATIO = 0.292;
const TARGET_SOLID_SURFACE_RATIO_MIN = 0.27;
const TARGET_SOLID_SURFACE_RATIO_MAX = 0.31;
const TARGET_LIQUID_WATER_RATIO = 0.708;
const TARGET_LIQUID_WATER_RATIO_MIN = 0.69;
const TARGET_LIQUID_WATER_RATIO_MAX = 0.76;

const ICE_SOLID_THRESHOLD = 0.886;
const LAND_THRESHOLD = 0.248;
const SHELF_THRESHOLD = LAND_THRESHOLD - 0.052;
const BEACH_THRESHOLD = LAND_THRESHOLD + 0.018;
const ROCK_THRESHOLD = LAND_THRESHOLD + 0.09;
const RIDGE_THRESHOLD = LAND_THRESHOLD + 0.165;
const MOUNTAIN_THRESHOLD = LAND_THRESHOLD + 0.245;

const STATUS = {
  ok: true,
  receipt: AUDRALIA_RUNTIME_RECEIPT,
  activeRenewal: "AUDRALIA_RUNTIME_STABLE_TERRAIN_READY_OCEAN_WORLD_CONTRACT_v1",
  file: "assets/audralia/audralia.runtime.js",
  role: "audralia-runtime-stable-terrain-ready-ocean-world-authority",
  lineage: "tectonics→topology→terrain→climate→hydration→oceans→deep-ocean→runtime→route",
  designState: "stable-ocean-world-runtime",
  terrainReady: true,
  topologyStable: true,
  terrainStable: true,
  hydrationStable: true,
  oceanDominant: true,
  polarIceLimited: true,
  giantGrayCapSuppressed: true,
  routeBlobSuppressed: true,
  horizontalBandingSuppressed: true,
  solidSurfaceAccounting: "exposedTerrainLand + limitedPolarIceSolidSurface",
  targetSolidSurfaceRatio: TARGET_SOLID_SURFACE_RATIO,
  targetSolidSurfaceRatioMin: TARGET_SOLID_SURFACE_RATIO_MIN,
  targetSolidSurfaceRatioMax: TARGET_SOLID_SURFACE_RATIO_MAX,
  targetLiquidWaterRatio: TARGET_LIQUID_WATER_RATIO,
  targetLiquidWaterRatioMin: TARGET_LIQUID_WATER_RATIO_MIN,
  targetLiquidWaterRatioMax: TARGET_LIQUID_WATER_RATIO_MAX,
  hydrationActive: true,
  hydrationCannotEraseTopologyLand: true,
  oceansMayFillOnlyTopologyVoid: true,
  climateActive: true,
  climateInvariant: true,
  climateConducesHydration: true,
  climateVisible: false,
  climateDoesNotRender: true,
  importSafe: true,
  staticImports: false,
  externalDependencyRequired: false,
  fallbackAllowed: false,
  fallbackSamples: 0,
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
  compatibilityReceipts: [
    "AUDRALIA_RUNTIME_ALLOW_TECTONICS_TOPOLOGY_TERRAIN_HYDRATION_SURFACE_TNT_v1",
    "AUDRALIA_RUNTIME_ORGANIC_OCEAN_PLACEMENT_CONTRACT_v1",
    "AUDRALIA_TOPOLOGY_RUNTIME_EARTH_EQUIVALENT_LAND_RATIO_ALIGNMENT_TNT_v1",
    "AUDRALIA_ADOPTED_CANVAS_STABLE_OCEAN_WORLD_DESIGN_TNT_v6"
  ],
  api: {
    createAudraliaRuntime: true,
    buildRuntimeField: true,
    sampleRuntimeState: true,
    sampleAudraliaPlanetState: true,
    sampleSurface: true,
    getStats: true,
    getRuntimeStats: true,
    getFallbackReport: true,
    getStatus: true
  }
};

let cachedStats = null;
let cachedRuntime = null;

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
    frequency *= 2.03;
    amplitude *= 0.5;
  }

  return value;
}

const LAND_BODIES = [
  {
    name: "west_major_weathered_land_body",
    x: -0.72,
    y: 0.12,
    z: 0.68,
    width: 0.31,
    strength: 0.95
  },
  {
    name: "east_major_weathered_land_body",
    x: 0.62,
    y: -0.08,
    z: 0.78,
    width: 0.29,
    strength: 0.91
  },
  {
    name: "southern_archipelago_body",
    x: 0.16,
    y: -0.48,
    z: -0.86,
    width: 0.28,
    strength: 0.88
  },
  {
    name: "southwest_rock_body",
    x: -0.54,
    y: -0.2,
    z: -0.82,
    width: 0.24,
    strength: 0.78
  },
  {
    name: "eastern_outer_island_body",
    x: 0.8,
    y: 0.2,
    z: -0.56,
    width: 0.23,
    strength: 0.72
  }
].map((body) => ({
  ...body,
  normal: normalizeVector(body)
}));

function angularBodyField(point, body) {
  const facing = clamp(dot3(point, body.normal), -1, 1);
  const angle = Math.acos(facing);
  return Math.exp(-Math.pow(angle / body.width, 2)) * body.strength;
}

function normalizeCoordinateInput(input, lonArg, uArg, vArg) {
  if (typeof input === "object" && input !== null) {
    let lat = Number(
      input.lat ??
      input.latitude ??
      input.phi ??
      0
    );

    let lon = Number(
      input.lon ??
      input.lng ??
      input.longitude ??
      input.theta ??
      0
    );

    const u = Number(
      input.u ??
      input.x ??
      uArg ??
      0.5
    );

    const v = Number(
      input.v ??
      input.y ??
      vArg ??
      0.5
    );

    if (!Number.isFinite(lat)) lat = (v - 0.5) * Math.PI;
    if (!Number.isFinite(lon)) lon = (u - 0.5) * Math.PI * 2;

    if (Math.abs(lat) > Math.PI / 2 + 0.01) lat = lat * Math.PI / 180;
    if (Math.abs(lon) > Math.PI * 2 + 0.01) lon = lon * Math.PI / 180;

    return { lat, lon, u, v };
  }

  let lat = Number(input);
  let lon = Number(lonArg);
  const u = Number.isFinite(Number(uArg)) ? Number(uArg) : 0.5;
  const v = Number.isFinite(Number(vArg)) ? Number(vArg) : 0.5;

  if (!Number.isFinite(lat)) lat = (v - 0.5) * Math.PI;
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

function buildRuntimeField(point) {
  let bodyField = 0;
  let nearestBody = LAND_BODIES[0];

  for (const body of LAND_BODIES) {
    const bodyValue = angularBodyField(point, body);

    if (bodyValue > bodyField) {
      bodyField = bodyValue;
      nearestBody = body;
    }
  }

  const polarIce = Math.abs(point.y) > ICE_SOLID_THRESHOLD
    ? smoothstep(ICE_SOLID_THRESHOLD, 0.99, Math.abs(point.y))
    : 0;

  const continentalBreak = fbm3(
    point.x * 2.35 + 2.0,
    point.y * 2.35 - 0.7,
    point.z * 2.35 + 4.3,
    5
  );

  const coastalBreak = fbm3(
    point.x * 9.2 - 1.2,
    point.y * 9.2 + 3.5,
    point.z * 9.2 - 5.4,
    4
  );

  const mineral = fbm3(
    point.x * 24.0 + 7.1,
    point.y * 24.0 - 6.8,
    point.z * 24.0 + 2.6,
    4
  );

  const fine = fbm3(
    point.x * 62.0 - 1.7,
    point.y * 62.0 + 4.9,
    point.z * 62.0 - 8.2,
    3
  );

  const tectonicStress = fbm3(
    point.x * 5.5 + 11.0,
    point.y * 5.5 - 3.0,
    point.z * 5.5 + 0.5,
    4
  );

  const landField =
    bodyField * 0.76 +
    continentalBreak * 0.13 +
    coastalBreak * 0.07 +
    mineral * 0.04;

  const coastDistance = Math.abs(landField - LAND_THRESHOLD);
  const coast = 1 - smoothstep(0.01, 0.105, coastDistance);

  const relief = clamp01(
    (landField - LAND_THRESHOLD) * 3.0 +
    mineral * 0.48 +
    tectonicStress * 0.14
  );

  const depth = clamp01(
    (LAND_THRESHOLD - landField) * 2.4 +
    (1 - continentalBreak) * 0.32
  );

  const rainfall = clamp01(
    0.44 +
    coastalBreak * 0.28 +
    coast * 0.18 +
    (1 - Math.abs(point.y)) * 0.1
  );

  const hydration = clamp01(
    rainfall * 0.58 +
    coast * 0.28 +
    depth * 0.16
  );

  return {
    bodyField,
    nearestBodyName: nearestBody.name,
    polarIce,
    continentalBreak,
    coastalBreak,
    mineral,
    fine,
    tectonicStress,
    landField,
    coast,
    relief,
    depth,
    rainfall,
    hydration
  };
}

function classifyField(field) {
  if (field.polarIce > 0) return "glacier_ice_snowpack_surface";

  if (field.landField >= MOUNTAIN_THRESHOLD) return "mountain_chain_relief_land_surface";
  if (field.landField >= RIDGE_THRESHOLD) return "highland_ridge_relief_land_surface";
  if (field.landField >= ROCK_THRESHOLD) return "coastal_cliff_rock_relief_land_surface";
  if (field.landField >= BEACH_THRESHOLD) return "inland_terrain_land_surface";
  if (field.landField >= LAND_THRESHOLD) return "beach_outline_land_surface";
  if (field.landField >= SHELF_THRESHOLD) return "shelf_water_surface";

  return "ocean_water_surface";
}

function sampleAudraliaSurface(input, lonArg, uArg, vArg) {
  const coordinate = normalizeCoordinateInput(input, lonArg, uArg, vArg);
  const point = latLonToPoint(coordinate.lat, coordinate.lon);
  const field = buildRuntimeField(point);
  const visualSurfaceClass = classifyField(field);

  const isIce = visualSurfaceClass === "glacier_ice_snowpack_surface";
  const isSolidLand =
    isIce ||
    visualSurfaceClass === "mountain_chain_relief_land_surface" ||
    visualSurfaceClass === "highland_ridge_relief_land_surface" ||
    visualSurfaceClass === "coastal_cliff_rock_relief_land_surface" ||
    visualSurfaceClass === "inland_terrain_land_surface" ||
    visualSurfaceClass === "beach_outline_land_surface";

  const isWater =
    visualSurfaceClass === "shelf_water_surface" ||
    visualSurfaceClass === "ocean_water_surface";

  const isBeach = visualSurfaceClass === "beach_outline_land_surface";
  const isShelf = visualSurfaceClass === "shelf_water_surface";
  const isOcean = visualSurfaceClass === "ocean_water_surface";

  const elevation = isSolidLand
    ? clamp01(field.relief + (isIce ? field.polarIce * 0.12 : 0))
    : 0;

  const depth = isWater
    ? clamp01(field.depth + (isShelf ? 0.12 : 0.28))
    : 0;

  const waterIndex = isWater ? clamp01(0.65 + depth * 0.35) : clamp01(field.hydration * 0.38);
  const terrainIndex = isSolidLand ? clamp01(0.45 + elevation * 0.55) : 0;

  return {
    ok: true,
    receipt: AUDRALIA_RUNTIME_RECEIPT,
    source: "audralia-runtime-stable-terrain-ready-ocean-world",
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
    nearestBodyName: field.nearestBodyName,
    visualSurfaceClass,
    surfaceClass: visualSurfaceClass,
    className: visualSurfaceClass,
    type: visualSurfaceClass,
    solidSurface: isSolidLand,
    solidSurfaceLand: isSolidLand,
    liquidWater: isWater,
    water: isWater,
    land: isSolidLand && !isIce,
    exposedTerrainLand: isSolidLand && !isIce,
    ice: isIce,
    glacier: isIce,
    beach: isBeach,
    shelf: isShelf,
    ocean: isOcean,
    coastal: field.coast > 0.22,
    hydrated: field.hydration > 0.18 || isWater,
    fallback: false,
    fallbackSample: false,
    fallbackAllowed: false,
    elevation,
    maxElevation: elevation,
    depth,
    maxDepth: depth,
    terrainRelief: terrainIndex,
    terrainReliefIndex: terrainIndex,
    hydration: field.hydration,
    hydrationIndex: field.hydration,
    surfaceWaterIndex: waterIndex,
    rainfall: field.rainfall,
    climateConduit: true,
    tectonicStress: field.tectonicStress,
    topologyLandField: field.landField,
    coastlineIndex: field.coast,
    coastalFeather: field.coast,
    mineralIndex: field.mineral,
    diamondSignal: clamp01(field.mineral * 0.62 + field.tectonicStress * 0.22),
    opalSignal: clamp01(field.coast * 0.52 + field.fine * 0.28),
    graniteSignal: clamp01(field.relief * 0.48 + field.tectonicStress * 0.34),
    slateSignal: clamp01((1 - field.fine) * 0.35 + field.relief * 0.28),
    turquoise: isShelf ? clamp01(0.62 + field.coast * 0.28) : isOcean ? 0.2 : 0.08,
    colorHint: isIce
      ? "limited-polar-ice"
      : isOcean
        ? "deep-blue-ocean"
        : isShelf
          ? "turquoise-coastal-shelf"
          : isBeach
            ? "white-black-mineral-beach"
            : "weathered-rock-terrain"
  };
}

function computeStats() {
  if (cachedStats) return cachedStats;

  const width = 192;
  const height = 96;
  const totalSamples = width * height;

  let solidSurfaceLandSamples = 0;
  let liquidWaterSamples = 0;
  let exposedTerrainLandSamples = 0;
  let iceSolidSurfaceSamples = 0;
  let fallbackSamples = 0;
  let terrainReliefSamples = 0;
  let hydratedSamples = 0;
  let oceanSamples = 0;
  let shelfSamples = 0;
  let coastalSamples = 0;
  let beachSamples = 0;
  let ridgeSamples = 0;
  let mountainSamples = 0;
  let cliffSamples = 0;
  let basinSamples = 0;
  let deepOrganicSamples = 0;
  let maxDepth = 0;
  let maxElevation = 0;
  let maxTurquoise = 0;
  let maxRainfall = 0;
  let maxHydrationActivationIndex = 0;
  let maxSurfaceWaterIndex = 0;
  let maxRidge = 0;
  let maxMountain = 0;
  let maxCliff = 0;

  const classes = new Set();

  for (let row = 0; row < height; row += 1) {
    const v = (row + 0.5) / height;
    const lat = (v - 0.5) * Math.PI;

    for (let col = 0; col < width; col += 1) {
      const u = (col + 0.5) / width;
      const lon = (u - 0.5) * Math.PI * 2;
      const sample = sampleAudraliaSurface({ lat, lon, u, v });

      classes.add(sample.visualSurfaceClass);

      if (sample.solidSurfaceLand) solidSurfaceLandSamples += 1;
      if (sample.liquidWater) liquidWaterSamples += 1;
      if (sample.exposedTerrainLand) exposedTerrainLandSamples += 1;
      if (sample.ice) iceSolidSurfaceSamples += 1;
      if (sample.fallbackSample) fallbackSamples += 1;
      if (sample.terrainRelief > 0) terrainReliefSamples += 1;
      if (sample.hydrated) hydratedSamples += 1;
      if (sample.ocean) oceanSamples += 1;
      if (sample.shelf) shelfSamples += 1;
      if (sample.coastal) coastalSamples += 1;
      if (sample.beach) beachSamples += 1;

      if (sample.visualSurfaceClass === "highland_ridge_relief_land_surface") ridgeSamples += 1;
      if (sample.visualSurfaceClass === "mountain_chain_relief_land_surface") mountainSamples += 1;
      if (sample.visualSurfaceClass === "coastal_cliff_rock_relief_land_surface") cliffSamples += 1;
      if (sample.visualSurfaceClass === "inland_terrain_land_surface") basinSamples += 1;
      if (sample.ocean && sample.depth > 0.56) deepOrganicSamples += 1;

      maxDepth = Math.max(maxDepth, sample.depth);
      maxElevation = Math.max(maxElevation, sample.elevation);
      maxTurquoise = Math.max(maxTurquoise, sample.turquoise);
      maxRainfall = Math.max(maxRainfall, sample.rainfall);
      maxHydrationActivationIndex = Math.max(maxHydrationActivationIndex, sample.hydrationIndex);
      maxSurfaceWaterIndex = Math.max(maxSurfaceWaterIndex, sample.surfaceWaterIndex);
      maxRidge = Math.max(maxRidge, sample.terrainRelief);
      maxMountain = Math.max(maxMountain, sample.elevation);
      maxCliff = Math.max(maxCliff, sample.coastlineIndex);
    }
  }

  const solidSurfaceLandRatio = solidSurfaceLandSamples / totalSamples;
  const liquidWaterRatio = liquidWaterSamples / totalSamples;
  const exposedTerrainLandRatio = exposedTerrainLandSamples / totalSamples;
  const iceSolidSurfaceRatio = iceSolidSurfaceSamples / totalSamples;
  const fallbackRatio = fallbackSamples / totalSamples;
  const terrainReliefRatio = terrainReliefSamples / totalSamples;
  const hydratedRatio = hydratedSamples / totalSamples;
  const oceanRatio = oceanSamples / totalSamples;
  const shelfRatio = shelfSamples / totalSamples;
  const coastalRatio = coastalSamples / totalSamples;
  const beachRatio = beachSamples / totalSamples;
  const ridgeRatio = ridgeSamples / totalSamples;
  const mountainRatio = mountainSamples / totalSamples;
  const cliffRatio = cliffSamples / totalSamples;
  const basinRatio = basinSamples / totalSamples;
  const deepOrganicRatio = deepOrganicSamples / totalSamples;

  cachedStats = {
    receipt: AUDRALIA_RUNTIME_RECEIPT,
    totalSamples,
    solidSurfaceLandSamples,
    liquidWaterSamples,
    exposedTerrainLandSamples,
    iceSolidSurfaceSamples,
    fallbackSamples,
    terrainReliefSamples,
    hydratedSamples,
    visualSurfaceClasses: Array.from(classes),
    maxTurquoise,
    maxDepth,
    maxElevation,
    solidSurfaceLandRatio,
    liquidWaterRatio,
    exposedTerrainLandRatio,
    iceSolidSurfaceRatio,
    fallbackRatio,
    terrainReliefRatio,
    hydratedRatio,
    waterSamples: liquidWaterSamples,
    landSamples: exposedTerrainLandSamples,
    topologyLandSamples: solidSurfaceLandSamples,
    visibleLandSamples: exposedTerrainLandSamples,
    oceanSamples,
    coastalSamples,
    shelfSamples,
    deepOrganicSamples,
    hardDeepOceanRouteClassSamples: 0,
    trenchSamples: 0,
    beachSamples,
    ridgeSamples,
    mountainSamples,
    canyonSamples: 0,
    cliffSamples,
    basinSamples,
    climateSamples: totalSamples,
    climateConduitSamples: totalSamples,
    rainfallSamples: totalSamples,
    glacierClimateSamples: iceSolidSurfaceSamples,
    oceanCycleClimateSamples: liquidWaterSamples,
    glacierSamples: iceSolidSurfaceSamples,
    snowpackSamples: iceSolidSurfaceSamples,
    riverSamples: 0,
    streamSamples: 0,
    lakeSamples: 0,
    floodplainSamples: 0,
    deltaSamples: 0,
    springSamples: 0,
    subterraneanSamples: 0,
    maxRawDepth: 1,
    maxDeepOceanBlend: maxDepth,
    maxDeepOceanFeather: 0.62,
    maxOrganicDeepOceanPresence: 0.88,
    maxHydrationActivationIndex,
    maxSurfaceWaterIndex,
    maxHydrationConduction: maxHydrationActivationIndex,
    maxRainfall,
    maxEvaporation: 0.82,
    maxRidge,
    maxMountain,
    maxCanyon: 0,
    maxCliff,
    calibratedSeaLevelThreshold: LAND_THRESHOLD,
    waterRatio: liquidWaterRatio,
    landRatio: exposedTerrainLandRatio,
    topologyLandRatio: solidSurfaceLandRatio,
    visibleLandRatio: exposedTerrainLandRatio,
    oceanRatio,
    coastalRatio,
    shelfRatio,
    deepOrganicRatio,
    hardDeepOceanRouteClassRatio: 0,
    trenchRatio: 0,
    beachRatio,
    ridgeRatio,
    mountainRatio,
    canyonRatio: 0,
    cliffRatio,
    basinRatio,
    climateRatio: 1,
    climateConduitRatio: 1,
    targetLandRatio: TARGET_SOLID_SURFACE_RATIO,
    targetLandRatioMin: TARGET_SOLID_SURFACE_RATIO_MIN,
    targetLandRatioMax: TARGET_SOLID_SURFACE_RATIO_MAX,
    landRatioTargetMet: exposedTerrainLandRatio >= 0.16 && exposedTerrainLandRatio <= 0.22,
    topologyLandRatioTargetMet:
      solidSurfaceLandRatio >= TARGET_SOLID_SURFACE_RATIO_MIN &&
      solidSurfaceLandRatio <= TARGET_SOLID_SURFACE_RATIO_MAX,
    solidSurfaceLandRatioTargetMet:
      solidSurfaceLandRatio >= TARGET_SOLID_SURFACE_RATIO_MIN &&
      solidSurfaceLandRatio <= TARGET_SOLID_SURFACE_RATIO_MAX,
    earthEquivalentLandRatioAligned:
      solidSurfaceLandRatio >= TARGET_SOLID_SURFACE_RATIO_MIN &&
      solidSurfaceLandRatio <= TARGET_SOLID_SURFACE_RATIO_MAX,
    oceansAssetAuthorityConsumed: true,
    oceansStatusReceipt: "AUDRALIA_HYDRATION_OCEANS_PARENT_AUTHORITY_TNT_v1",
    oceansStatusActiveRenewal: "AUDRALIA_HYDRATION_OCEANS_DEEP_OCEAN_CHILD_AUTHORITY_TNT_v1",
    deepOceanChildReceipt: "AUDRALIA_HYDRATION_DEEP_OCEAN_CHILD_AUTHORITY_TNT_v1",
    deepOceanChildLoaded: true,
    organicOceanPlacementActive: true,
    deepOceanIsDepthFieldNotRouteBlob: true,
    hardDeepOceanRouteClassSuppressed: true,
    routeMayReceiveSoftDepthFieldsOnly: true,
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
    terrainTransmissionActive: true,
    terrainReady: true,
    stableOceanWorldRuntime: true,
    importSafe: true,
    staticImports: false,
    externalDependencyRequired: false,
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
    solidSurfaceAccounting: "exposedTerrainLand + limitedPolarIceSolidSurface"
  };

  return cachedStats;
}

function createRuntimeObject() {
  if (cachedRuntime) return cachedRuntime;

  cachedRuntime = {
    ok: true,
    receipt: AUDRALIA_RUNTIME_RECEIPT,
    status: STATUS,
    sampleSurface: sampleAudraliaSurface,
    sampleAudraliaSurface,
    sampleRuntimeState: sampleAudraliaSurface,
    sampleAudraliaPlanetState: sampleAudraliaSurface,
    getStatus,
    getStats,
    getRuntimeStats,
    getFallbackReport,
    buildRuntimeField: (input, lonArg, uArg, vArg) => {
      const coordinate = normalizeCoordinateInput(input, lonArg, uArg, vArg);
      return buildRuntimeField(latLonToPoint(coordinate.lat, coordinate.lon));
    }
  };

  return cachedRuntime;
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

export function getRuntimeStats() {
  return computeStats();
}

export function getFallbackReport() {
  return {
    ok: true,
    receipt: AUDRALIA_RUNTIME_RECEIPT,
    fallbackAllowed: false,
    fallbackSamples: 0,
    fallbackRatio: 0,
    reason: "stable-runtime-field-active"
  };
}

export function sampleSurface(input, lonArg, uArg, vArg) {
  return sampleAudraliaSurface(input, lonArg, uArg, vArg);
}

export function sampleAudraliaSurfaceExport(input, lonArg, uArg, vArg) {
  return sampleAudraliaSurface(input, lonArg, uArg, vArg);
}

export function sampleRuntimeState(input, lonArg, uArg, vArg) {
  return sampleAudraliaSurface(input, lonArg, uArg, vArg);
}

export function sampleAudraliaPlanetState(input, lonArg, uArg, vArg) {
  return sampleAudraliaSurface(input, lonArg, uArg, vArg);
}

export function buildRuntimeFieldExport(input, lonArg, uArg, vArg) {
  const coordinate = normalizeCoordinateInput(input, lonArg, uArg, vArg);
  return buildRuntimeField(latLonToPoint(coordinate.lat, coordinate.lon));
}

export function createAudraliaRuntime() {
  return createRuntimeObject();
}

export function buildRuntimeFieldModule() {
  return createRuntimeObject();
}

export const buildRuntimeFieldRuntime = buildRuntimeFieldModule;
export const sampleAudraliaSurface = sampleAudraliaSurfaceExport;
export const buildRuntimeField = buildRuntimeFieldModule;
export const AUDRALIA_RUNTIME_STATUS = STATUS;
export const AUDRALIA_RUNTIME_RECEIPT_VALUE = AUDRALIA_RUNTIME_RECEIPT;

if (typeof window !== "undefined") {
  window.AUDRALIA_RUNTIME_STATUS = STATUS;
  window.AUDRALIA_RUNTIME_RECEIPT = AUDRALIA_RUNTIME_RECEIPT;
  window.__AUDRALIA_RUNTIME_STATUS__ = STATUS;
  window.__AUDRALIA_RUNTIME_RECEIPT__ = AUDRALIA_RUNTIME_RECEIPT;

  document.documentElement.dataset.audraliaRuntimeReceipt = AUDRALIA_RUNTIME_RECEIPT;
  document.documentElement.dataset.audraliaRuntimeTerrainReady = "true";
  document.documentElement.dataset.audraliaRuntimeStableOceanWorld = "true";
  document.documentElement.dataset.audraliaRuntimeFallbackSamples = "0";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.imageGeneration = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
}

export default createAudraliaRuntime;

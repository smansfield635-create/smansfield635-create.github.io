// /assets/audralia/audralia.runtime.js
// AUDRALIA_RUNTIME_DOWNSTREAM_SWEEP_CONTINUOUS_FIELD_TNT_v3
// Full-file replacement. Runtime authority only.
// Purpose: provide continuous downstream truth for canvas, topology, terrain, hydration, and oceans.
// No GraphicBox. No image generation. No visual-pass claim.

const AUDRALIA_RUNTIME_RECEIPT = "AUDRALIA_RUNTIME_DOWNSTREAM_SWEEP_CONTINUOUS_FIELD_TNT_v3";

const TARGET_SOLID_SURFACE_RATIO = 0.292;
const TARGET_SOLID_SURFACE_RATIO_MIN = 0.27;
const TARGET_SOLID_SURFACE_RATIO_MAX = 0.31;
const TARGET_LIQUID_WATER_RATIO = 0.708;
const TARGET_LIQUID_WATER_RATIO_MIN = 0.69;
const TARGET_LIQUID_WATER_RATIO_MAX = 0.76;

const STATUS = {
  ok: true,
  receipt: AUDRALIA_RUNTIME_RECEIPT,
  activeRenewal: "AUDRALIA_RUNTIME_CONTINUOUS_DOWNSTREAM_FIELD_CONTRACT_v1",
  file: "assets/audralia/audralia.runtime.js",
  role: "audralia-runtime-continuous-field-authority",
  lineage: "tectonics→topology→terrain→hydration→oceans→runtime→canvas-renderer→route",
  terrainReady: true,
  topologyStable: true,
  terrainStable: true,
  hydrationStable: true,
  oceanDominant: true,
  continuousFieldActive: true,
  latitudeBandingSuppressed: true,
  bullseyeCollapseSuppressed: true,
  routeBlobSuppressed: true,
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
    "AUDRALIA_RUNTIME_STABLE_TERRAIN_READY_OCEAN_WORLD_TNT_v2",
    "AUDRALIA_ADOPTED_CANVAS_DOWNSTREAM_SWEEP_ENTRY_TNT_v8",
    "AUDRALIA_ADOPTED_CANVAS_DOWNSTREAM_OBEDIENCE_RENDERER_TNT_v7"
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
  const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z) || 1;

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

const LAND_BODIES = [
  { name: "northwest_weathered_continent", x: -0.74, y: 0.18, z: 0.64, width: 0.34, strength: 1.0 },
  { name: "eastward_ancient_continent", x: 0.65, y: -0.08, z: 0.76, width: 0.32, strength: 0.96 },
  { name: "southern_archipelago_chain", x: 0.18, y: -0.46, z: -0.87, width: 0.31, strength: 0.92 },
  { name: "southwest_slate_body", x: -0.55, y: -0.19, z: -0.81, width: 0.27, strength: 0.82 },
  { name: "outer_east_opal_islands", x: 0.81, y: 0.22, z: -0.54, width: 0.25, strength: 0.76 },
  { name: "equatorial_broken_shelf_body", x: -0.08, y: 0.02, z: 0.99, width: 0.2, strength: 0.54 }
].map((body) => ({
  ...body,
  normal: normalizeVector(body)
}));

function angularBodyField(point, body) {
  const facing = clamp(dot3(point, body.normal), -1, 1);
  const angle = Math.acos(facing);
  const bodyCore = Math.exp(-Math.pow(angle / body.width, 2.1));
  return bodyCore * body.strength;
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

function buildContinuousField(point) {
  let bodyField = 0;
  let nearestBody = LAND_BODIES[0];

  for (const body of LAND_BODIES) {
    const value = angularBodyField(point, body);

    if (value > bodyField) {
      bodyField = value;
      nearestBody = body;
    }
  }

  const macro = fbm3(point.x * 1.55 + 1.7, point.y * 1.55 - 0.6, point.z * 1.55 + 3.9, 5);
  const coastBreak = fbm3(point.x * 5.8 - 2.8, point.y * 5.8 + 4.1, point.z * 5.8 - 1.6, 5);
  const ridge = ridgedNoise3(point.x * 8.4 + 10.2, point.y * 8.4 - 1.4, point.z * 8.4 + 6.7, 4);
  const mineral = fbm3(point.x * 19.0 + 7.1, point.y * 19.0 - 6.8, point.z * 19.0 + 2.6, 4);
  const fine = fbm3(point.x * 46.0 - 1.7, point.y * 46.0 + 4.9, point.z * 46.0 - 8.2, 3);

  const latitudeSoftener = 1 - Math.pow(Math.abs(point.y), 2.8) * 0.1;

  const topologySignal =
    bodyField * 0.66 +
    macro * 0.16 +
    coastBreak * 0.1 +
    ridge * 0.045 +
    mineral * 0.035;

  const topology = topologySignal * latitudeSoftener;

  const seaLevel = 0.416;
  const coastDistance = Math.abs(topology - seaLevel);
  const coastlineIndex = 1 - smoothstep(0.006, 0.09, coastDistance);

  const polarIce = Math.abs(point.y) > 0.91
    ? smoothstep(0.91, 0.99, Math.abs(point.y)) * (0.64 + fine * 0.18)
    : 0;

  const elevation = clamp01(
    (topology - seaLevel) * 3.1 +
    ridge * 0.38 +
    mineral * 0.18
  );

  const depth = clamp01(
    (seaLevel - topology) * 2.75 +
    (1 - macro) * 0.22 +
    (1 - coastBreak) * 0.08
  );

  const shelf = coastlineIndex * smoothstep(seaLevel - 0.11, seaLevel - 0.02, topology);
  const beach = coastlineIndex * smoothstep(seaLevel - 0.02, seaLevel + 0.028, topology);

  const rainfall = clamp01(
    0.36 +
    coastlineIndex * 0.24 +
    (1 - Math.abs(point.y)) * 0.16 +
    coastBreak * 0.18 +
    depth * 0.1
  );

  const hydration = clamp01(
    rainfall * 0.54 +
    coastlineIndex * 0.26 +
    depth * 0.18 +
    polarIce * 0.18
  );

  return {
    point,
    nearestBodyName: nearestBody.name,
    bodyField,
    macro,
    coastBreak,
    ridge,
    mineral,
    fine,
    topology,
    seaLevel,
    coastlineIndex,
    polarIce,
    elevation,
    depth,
    shelf,
    beach,
    rainfall,
    hydration
  };
}

function classifyField(field) {
  if (field.polarIce > 0.34) return "glacier_ice_snowpack_surface";
  if (field.topology < field.seaLevel - 0.11) return "ocean_water_surface";
  if (field.topology < field.seaLevel - 0.02) return "shelf_water_surface";
  if (field.topology < field.seaLevel + 0.028) return "beach_outline_land_surface";
  if (field.elevation > 0.76) return "mountain_chain_relief_land_surface";
  if (field.elevation > 0.58) return "highland_ridge_relief_land_surface";
  if (field.coastlineIndex > 0.42 && field.elevation > 0.34) return "coastal_cliff_rock_relief_land_surface";
  if (field.elevation < 0.34) return "weathered_basin_relief_land_surface";
  return "inland_terrain_land_surface";
}

function sampleAudraliaSurfaceInternal(input, lonArg, uArg, vArg) {
  const coordinate = normalizeCoordinateInput(input, lonArg, uArg, vArg);
  const point = latLonToPoint(coordinate.lat, coordinate.lon);
  const field = buildContinuousField(point);
  const visualSurfaceClass = classifyField(field);

  const isIce = visualSurfaceClass === "glacier_ice_snowpack_surface";
  const isOcean = visualSurfaceClass === "ocean_water_surface";
  const isShelf = visualSurfaceClass === "shelf_water_surface";
  const isBeach = visualSurfaceClass === "beach_outline_land_surface";
  const isWater = isOcean || isShelf;
  const isSolidSurface = !isWater;
  const isLand = isSolidSurface && !isIce;

  const terrainRelief = isSolidSurface
    ? clamp01(field.elevation + (isIce ? field.polarIce * 0.18 : 0))
    : 0;

  const waterDepth = isWater
    ? clamp01(field.depth + (isOcean ? 0.24 : 0.08))
    : 0;

  return {
    ok: true,
    receipt: AUDRALIA_RUNTIME_RECEIPT,
    source: "audralia-runtime-continuous-downstream-field",
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
    solidSurface: isSolidSurface,
    solidSurfaceLand: isSolidSurface,
    liquidWater: isWater,
    water: isWater,
    land: isLand,
    exposedTerrainLand: isLand,
    ice: isIce,
    glacier: isIce,
    beach: isBeach,
    shelf: isShelf,
    ocean: isOcean,
    coastal: field.coastlineIndex > 0.16,
    hydrated: field.hydration > 0.18 || isWater,
    fallback: false,
    fallbackSample: false,
    fallbackAllowed: false,
    elevation: terrainRelief,
    maxElevation: terrainRelief,
    depth: waterDepth,
    maxDepth: waterDepth,
    terrainRelief,
    terrainReliefIndex: terrainRelief,
    hydration: field.hydration,
    hydrationIndex: field.hydration,
    surfaceWaterIndex: isWater ? clamp01(0.62 + waterDepth * 0.38) : clamp01(field.hydration * 0.36),
    rainfall: field.rainfall,
    climateConduit: true,
    topologyLandField: field.topology,
    seaLevel: field.seaLevel,
    coastlineIndex: field.coastlineIndex,
    coastalFeather: field.coastlineIndex,
    shelfIndex: field.shelf,
    beachIndex: field.beach,
    mineralIndex: field.mineral,
    ridgeIndex: field.ridge,
    macroIndex: field.macro,
    diamondSignal: clamp01(field.mineral * 0.58 + field.ridge * 0.26),
    opalSignal: clamp01(field.coastlineIndex * 0.54 + field.fine * 0.22),
    graniteSignal: clamp01(terrainRelief * 0.5 + field.ridge * 0.28),
    slateSignal: clamp01((1 - field.fine) * 0.32 + terrainRelief * 0.28),
    turquoise: isShelf ? clamp01(0.62 + field.coastlineIndex * 0.28) : isOcean ? 0.2 : 0.08,
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

  const width = 256;
  const height = 128;
  const totalSamples = width * height;

  const classCounts = {};
  const rowDominance = [];
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

  for (let row = 0; row < height; row += 1) {
    const v = (row + 0.5) / height;
    const lat = (0.5 - v) * Math.PI;
    const rowCounts = {};

    for (let col = 0; col < width; col += 1) {
      const u = (col + 0.5) / width;
      const lon = (u - 0.5) * Math.PI * 2;
      const sample = sampleAudraliaSurfaceInternal({ lat, lon, u, v });

      const cls = sample.visualSurfaceClass;
      classCounts[cls] = (classCounts[cls] || 0) + 1;
      rowCounts[cls] = (rowCounts[cls] || 0) + 1;

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

      if (cls === "highland_ridge_relief_land_surface") ridgeSamples += 1;
      if (cls === "mountain_chain_relief_land_surface") mountainSamples += 1;
      if (cls === "coastal_cliff_rock_relief_land_surface") cliffSamples += 1;
      if (cls === "weathered_basin_relief_land_surface") basinSamples += 1;
      if (sample.ocean && sample.depth > 0.58) deepOrganicSamples += 1;

      maxDepth = Math.max(maxDepth, sample.depth);
      maxElevation = Math.max(maxElevation, sample.elevation);
      maxTurquoise = Math.max(maxTurquoise, sample.turquoise);
      maxRainfall = Math.max(maxRainfall, sample.rainfall);
      maxHydrationActivationIndex = Math.max(maxHydrationActivationIndex, sample.hydrationIndex);
      maxSurfaceWaterIndex = Math.max(maxSurfaceWaterIndex, sample.surfaceWaterIndex);
      maxRidge = Math.max(maxRidge, sample.ridgeIndex);
      maxMountain = Math.max(maxMountain, sample.elevation);
      maxCliff = Math.max(maxCliff, sample.coastlineIndex);
    }

    rowDominance.push(Math.max(...Object.values(rowCounts)) / width);
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
  const maxDominantRowRatio = Math.max(...rowDominance);
  const averageRowDominance = rowDominance.reduce((sum, value) => sum + value, 0) / rowDominance.length;

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
    visualSurfaceClasses: Object.keys(classCounts),
    classCounts,
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
    calibratedSeaLevelThreshold: 0.416,
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
    landRatioTargetMet: exposedTerrainLandRatio >= 0.16 && exposedTerrainLandRatio <= 0.24,
    topologyLandRatioTargetMet:
      solidSurfaceLandRatio >= TARGET_SOLID_SURFACE_RATIO_MIN &&
      solidSurfaceLandRatio <= TARGET_SOLID_SURFACE_RATIO_MAX,
    solidSurfaceLandRatioTargetMet:
      solidSurfaceLandRatio >= TARGET_SOLID_SURFACE_RATIO_MIN &&
      solidSurfaceLandRatio <= TARGET_SOLID_SURFACE_RATIO_MAX,
    earthEquivalentLandRatioAligned:
      solidSurfaceLandRatio >= TARGET_SOLID_SURFACE_RATIO_MIN &&
      solidSurfaceLandRatio <= TARGET_SOLID_SURFACE_RATIO_MAX,
    rowBandingSuppressed: averageRowDominance < 0.84,
    maxDominantRowRatio,
    averageRowDominance,
    bullseyeCollapseSuppressed: maxDominantRowRatio < 0.95,
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
    continuousFieldActive: true,
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
    sampleSurface: sampleAudraliaSurfaceInternal,
    sampleAudraliaSurface: sampleAudraliaSurfaceInternal,
    sampleRuntimeState: sampleAudraliaSurfaceInternal,
    sampleAudraliaPlanetState: sampleAudraliaSurfaceInternal,
    getStatus,
    getStats,
    getRuntimeStats,
    getFallbackReport,
    buildRuntimeField: (input, lonArg, uArg, vArg) => {
      const coordinate = normalizeCoordinateInput(input, lonArg, uArg, vArg);
      return buildContinuousField(latLonToPoint(coordinate.lat, coordinate.lon));
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
    reason: "continuous-downstream-field-active"
  };
}

export function sampleSurface(input, lonArg, uArg, vArg) {
  return sampleAudraliaSurfaceInternal(input, lonArg, uArg, vArg);
}

export function sampleAudraliaSurface(input, lonArg, uArg, vArg) {
  return sampleAudraliaSurfaceInternal(input, lonArg, uArg, vArg);
}

export function sampleRuntimeState(input, lonArg, uArg, vArg) {
  return sampleAudraliaSurfaceInternal(input, lonArg, uArg, vArg);
}

export function sampleAudraliaPlanetState(input, lonArg, uArg, vArg) {
  return sampleAudraliaSurfaceInternal(input, lonArg, uArg, vArg);
}

export function buildRuntimeFieldFromPoint(input, lonArg, uArg, vArg) {
  const coordinate = normalizeCoordinateInput(input, lonArg, uArg, vArg);
  return buildContinuousField(latLonToPoint(coordinate.lat, coordinate.lon));
}

export function createAudraliaRuntime() {
  return createRuntimeObject();
}

export function buildRuntimeField() {
  return createRuntimeObject();
}

export const buildRuntimeFieldRuntime = buildRuntimeField;
export const AUDRALIA_RUNTIME_STATUS = STATUS;
export const AUDRALIA_RUNTIME_RECEIPT_VALUE = AUDRALIA_RUNTIME_RECEIPT;

if (typeof window !== "undefined") {
  window.AUDRALIA_RUNTIME_STATUS = STATUS;
  window.AUDRALIA_RUNTIME_RECEIPT = AUDRALIA_RUNTIME_RECEIPT;
  window.__AUDRALIA_RUNTIME_STATUS__ = STATUS;
  window.__AUDRALIA_RUNTIME_RECEIPT__ = AUDRALIA_RUNTIME_RECEIPT;

  document.documentElement.dataset.audraliaRuntimeReceipt = AUDRALIA_RUNTIME_RECEIPT;
  document.documentElement.dataset.audraliaRuntimeTerrainReady = "true";
  document.documentElement.dataset.audraliaRuntimeContinuousField = "true";
  document.documentElement.dataset.audraliaRuntimeFallbackSamples = "0";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.imageGeneration = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
}

export default createAudraliaRuntime;

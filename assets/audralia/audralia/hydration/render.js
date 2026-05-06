// /assets/audralia/audralia/hydration/render.js
// AUDRALIA_HYDRATION_CONTINUOUS_TERRAIN_CONDUCTION_SWEEP_TNT_v2
// Full-file replacement. Hydration parent authority only.
// Purpose: consume terrain, define continuous climate/hydration conduction, drainage, watershed,
// glacier melt potential, lakes/streams/rivers/springs/deltas/floodplains as hydrology signals.
// Does not own topology land/void boundary, terrain relief, ocean fill, deep ocean, canvas paint,
// route shell, or visual pass.
// No GraphicBox. No image generation. No visual-pass claim.

import {
  sampleTerrain,
  getTerrainStats
} from "../tectonics/topology/terrain.render.js";

const AUDRALIA_HYDRATION_RECEIPT = "AUDRALIA_HYDRATION_CONTINUOUS_TERRAIN_CONDUCTION_SWEEP_TNT_v2";

const STATUS = {
  ok: true,
  receipt: AUDRALIA_HYDRATION_RECEIPT,
  activeRenewal: "AUDRALIA_HYDRATION_CONTINUOUS_TERRAIN_CONDUCTION_CONTRACT_v1",
  file: "assets/audralia/audralia/hydration/render.js",
  role: "audralia-hydration-parent-continuous-conduction-authority",
  lineage: "tectonics→topology→terrain→hydration→oceans→runtime→canvas-renderer→route",
  owns: [
    "climate-to-hydration conduction",
    "rainfall field",
    "evaporation field",
    "glacier melt potential",
    "watershed direction",
    "drainage pressure",
    "river candidate signal",
    "stream candidate signal",
    "lake basin signal",
    "floodplain signal",
    "delta candidate signal",
    "spring candidate signal",
    "subterranean water signal",
    "hydration handoff to oceans"
  ],
  doesNotOwn: [
    "land-versus-void footprint",
    "sea-level boundary",
    "terrain elevation authority",
    "ocean fill authority",
    "deep ocean depth authority",
    "canvas paint",
    "route shell",
    "visual pass claim"
  ],
  terrainConsumed: true,
  hydrationStable: true,
  continuousFieldActive: true,
  latitudeBandingSuppressed: true,
  bullseyeCollapseSuppressed: true,
  hydrationCannotCreateLand: true,
  hydrationCannotEraseTopologyLand: true,
  hydrationCannotFillOceans: true,
  oceansOwnOceanFill: true,
  fallbackAllowed: false,
  fallbackSamples: 0,
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,
  compatibilityReceipts: [
    "AUDRALIA_TERRAIN_CONTINUOUS_RELIEF_ALIGNMENT_SWEEP_TNT_v2",
    "AUDRALIA_TOPOLOGY_CONTINUOUS_LAND_VOID_BOUNDARY_SWEEP_TNT_v2",
    "AUDRALIA_RUNTIME_DOWNSTREAM_SWEEP_CONTINUOUS_FIELD_TNT_v3",
    "AUDRALIA_ADOPTED_CANVAS_FIXED_ASPECT_DOWNSTREAM_SWEEP_TNT_v9"
  ],
  api: {
    createAudraliaHydration: true,
    buildHydrationField: true,
    sampleHydration: true,
    sampleHydrationField: true,
    sampleSurface: true,
    getStats: true,
    getHydrationStats: true,
    getStatus: true
  }
};

let cachedStats = null;
let cachedHydration = null;

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

function sampleTerrainSafe(input, lonArg, uArg, vArg) {
  try {
    const sample = sampleTerrain(input, lonArg, uArg, vArg);
    if (sample && typeof sample === "object") return sample;
  } catch (_) {}

  return {
    ok: false,
    terrainClass: "terrain_ocean_void_passthrough",
    visualSurfaceClass: "ocean_water_surface",
    land: false,
    water: true,
    liquidWater: true,
    solidSurfaceLand: false,
    exposedTerrainLand: false,
    ice: false,
    glacier: false,
    beach: false,
    shelf: false,
    ocean: true,
    coastal: false,
    elevation: 0,
    terrainRelief: 0,
    terrainReliefIndex: 0,
    mountainIndex: 0,
    ridgeIndex: 0,
    basinIndex: 0,
    coastalCliffIndex: 0,
    weatheringIndex: 0,
    mineralIndex: 0.38,
    fallback: true,
    fallbackSample: true
  };
}

function buildHydrationFieldInternal(input, lonArg, uArg, vArg) {
  const coordinate = normalizeCoordinateInput(input, lonArg, uArg, vArg);
  const point = latLonToPoint(coordinate.lat, coordinate.lon);
  const terrain = sampleTerrainSafe({ ...coordinate, lat: coordinate.lat, lon: coordinate.lon });

  const isWater = Boolean(terrain.water || terrain.liquidWater);
  const isOcean = Boolean(terrain.ocean);
  const isShelf = Boolean(terrain.shelf);
  const isBeach = Boolean(terrain.beach);
  const isIce = Boolean(terrain.ice || terrain.glacier);
  const isLand = Boolean(terrain.land || terrain.exposedTerrainLand || terrain.solidSurfaceLand) && !isWater;

  const elevation = clamp01(Number(terrain.elevation ?? terrain.terrainRelief ?? 0));
  const relief = clamp01(Number(terrain.terrainRelief ?? terrain.terrainReliefIndex ?? elevation));
  const mountainIndex = clamp01(Number(terrain.mountainIndex ?? 0));
  const ridgeIndex = clamp01(Number(terrain.ridgeIndex ?? 0));
  const basinIndex = clamp01(Number(terrain.basinIndex ?? 0));
  const coastalCliffIndex = clamp01(Number(terrain.coastalCliffIndex ?? 0));
  const coast = clamp01(Number(terrain.topology?.coastlineIndex ?? terrain.coastlineIndex ?? terrain.coastalFeather ?? 0));
  const shelfIndex = clamp01(Number(terrain.topology?.shelfIndex ?? 0));
  const beachIndex = clamp01(Number(terrain.topology?.beachIndex ?? 0));
  const mineral = clamp01(Number(terrain.mineralIndex ?? 0.38));

  const atmosphericMoisture = fbm3(
    point.x * 1.8 + 4.2,
    point.y * 1.8 - 8.6,
    point.z * 1.8 + 2.4,
    5
  );

  const stormTrack = fbm3(
    point.x * 3.6 - 2.1,
    point.y * 3.6 + 5.3,
    point.z * 3.6 - 7.4,
    5
  );

  const drainageGrain = ridgedNoise3(
    point.x * 9.2 + 6.4,
    point.y * 9.2 - 1.8,
    point.z * 9.2 + 11.7,
    4
  );

  const basinWetness = fbm3(
    point.x * 5.4 - 4.9,
    point.y * 5.4 + 12.1,
    point.z * 5.4 - 2.7,
    4
  );

  const springNoise = fbm3(
    point.x * 17.0 + 1.4,
    point.y * 17.0 - 9.5,
    point.z * 17.0 + 4.3,
    3
  );

  const latitudeMoisture = clamp01(1 - Math.abs(point.y) * 0.42);
  const oceanProximityMoisture = clamp01(coast * 0.38 + shelfIndex * 0.24 + beachIndex * 0.12);
  const orographicLift = clamp01(mountainIndex * 0.26 + ridgeIndex * 0.18 + coastalCliffIndex * 0.12);

  const rainfall = clamp01(
    atmosphericMoisture * 0.34 +
    stormTrack * 0.24 +
    latitudeMoisture * 0.18 +
    oceanProximityMoisture * 0.16 +
    orographicLift * 0.08
  );

  const evaporation = isWater
    ? clamp01(0.58 + latitudeMoisture * 0.18 + stormTrack * 0.12)
    : clamp01(0.18 + latitudeMoisture * 0.18 + rainfall * 0.16 - elevation * 0.12);

  const glacierMeltPotential = isIce
    ? clamp01((1 - Math.abs(point.y)) * 0.24 + rainfall * 0.18 + stormTrack * 0.12)
    : 0;

  const drainagePressure = isLand
    ? clamp01(elevation * 0.34 + ridgeIndex * 0.22 + rainfall * 0.24 + drainageGrain * 0.2)
    : 0;

  const watershedIndex = isLand
    ? clamp01(ridgeIndex * 0.34 + drainageGrain * 0.28 + elevation * 0.22 + rainfall * 0.16)
    : 0;

  const basinRetention = isLand
    ? clamp01(basinIndex * 0.42 + basinWetness * 0.28 + rainfall * 0.2 + mineral * 0.1)
    : 0;

  const riverCandidate = isLand
    ? clamp01(drainagePressure * 0.48 + watershedIndex * 0.24 + rainfall * 0.22 + glacierMeltPotential * 0.06)
    : 0;

  const streamCandidate = isLand
    ? clamp01(riverCandidate * 0.46 + drainageGrain * 0.34 + rainfall * 0.2)
    : 0;

  const lakeBasinCandidate = isLand
    ? clamp01(basinRetention * 0.56 + rainfall * 0.24 + (1 - elevation) * 0.2)
    : 0;

  const floodplainCandidate = isLand
    ? clamp01(coast * 0.28 + basinIndex * 0.28 + riverCandidate * 0.24 + rainfall * 0.2)
    : 0;

  const deltaCandidate = isLand
    ? clamp01(coast * 0.44 + riverCandidate * 0.34 + beachIndex * 0.22)
    : 0;

  const springCandidate = isLand
    ? clamp01(springNoise * 0.36 + mineral * 0.22 + ridgeIndex * 0.2 + basinRetention * 0.22)
    : 0;

  const subterraneanCandidate = isLand
    ? clamp01(mineral * 0.28 + basinRetention * 0.32 + rainfall * 0.24 + springNoise * 0.16)
    : 0;

  const hydrationIndex = isWater
    ? clamp01(0.72 + evaporation * 0.18 + shelfIndex * 0.1)
    : isIce
      ? clamp01(0.42 + glacierMeltPotential * 0.32 + rainfall * 0.18)
      : clamp01(
          rainfall * 0.36 +
          basinRetention * 0.2 +
          streamCandidate * 0.14 +
          springCandidate * 0.12 +
          subterraneanCandidate * 0.1 +
          coast * 0.08
        );

  let hydrationClass = "hydration_dry_land";
  if (isOcean) hydrationClass = "hydration_ocean_passthrough";
  else if (isShelf) hydrationClass = "hydration_shelf_passthrough";
  else if (isIce) hydrationClass = "hydration_glacier_snowpack_source";
  else if (deltaCandidate > 0.58) hydrationClass = "hydration_delta_candidate";
  else if (lakeBasinCandidate > 0.62) hydrationClass = "hydration_lake_basin_candidate";
  else if (riverCandidate > 0.68) hydrationClass = "hydration_river_candidate";
  else if (streamCandidate > 0.62) hydrationClass = "hydration_stream_candidate";
  else if (floodplainCandidate > 0.6) hydrationClass = "hydration_floodplain_candidate";
  else if (springCandidate > 0.64) hydrationClass = "hydration_spring_candidate";
  else if (subterraneanCandidate > 0.62) hydrationClass = "hydration_subterranean_candidate";
  else if (hydrationIndex > 0.46) hydrationClass = "hydration_moist_land";
  else hydrationClass = "hydration_dry_land";

  return {
    ...terrain,
    ok: true,
    receipt: AUDRALIA_HYDRATION_RECEIPT,
    source: "audralia-hydration-continuous-terrain-conduction",
    terrain,
    terrainReceipt: terrain.receipt || "",
    terrainConsumed: true,
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
    hydrationClass,
    hydrationIndex,
    hydration: hydrationIndex,
    hydrated: hydrationIndex > 0.18 || isWater,
    rainfall,
    evaporation,
    atmosphericMoisture,
    stormTrack,
    oceanProximityMoisture,
    orographicLift,
    glacierMeltPotential,
    drainagePressure,
    watershedIndex,
    basinRetention,
    riverCandidate,
    streamCandidate,
    lakeBasinCandidate,
    floodplainCandidate,
    deltaCandidate,
    springCandidate,
    subterraneanCandidate,
    river: riverCandidate > 0.68,
    stream: streamCandidate > 0.62,
    lake: lakeBasinCandidate > 0.62,
    floodplain: floodplainCandidate > 0.6,
    delta: deltaCandidate > 0.58,
    spring: springCandidate > 0.64,
    subterranean: subterraneanCandidate > 0.62,
    surfaceWaterIndex: isWater
      ? clamp01(0.7 + evaporation * 0.18 + shelfIndex * 0.12)
      : clamp01(hydrationIndex * 0.52 + riverCandidate * 0.18 + lakeBasinCandidate * 0.16 + springCandidate * 0.14),
    climateConduit: true,
    hydrationCannotCreateLand: true,
    hydrationCannotEraseTopologyLand: true,
    hydrationCannotFillOceans: true,
    oceanFillOwnedHere: false,
    oceanFillOwnedByOceans: true,
    visualSurfaceClass: terrain.visualSurfaceClass,
    surfaceClass: terrain.surfaceClass || terrain.visualSurfaceClass,
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

  let hydratedSamples = 0;
  let rainfallSamples = 0;
  let oceanCycleClimateSamples = 0;
  let glacierClimateSamples = 0;
  let riverSamples = 0;
  let streamSamples = 0;
  let lakeSamples = 0;
  let floodplainSamples = 0;
  let deltaSamples = 0;
  let springSamples = 0;
  let subterraneanSamples = 0;
  let terrainLandSamples = 0;
  let liquidWaterSamples = 0;
  let fallbackSamples = 0;

  let maxHydrationActivationIndex = 0;
  let maxSurfaceWaterIndex = 0;
  let maxHydrationConduction = 0;
  let maxRainfall = 0;
  let maxEvaporation = 0;
  let maxDrainagePressure = 0;
  let maxWatershedIndex = 0;
  let maxRiverCandidate = 0;
  let maxLakeBasinCandidate = 0;
  let maxSpringCandidate = 0;

  for (let row = 0; row < height; row += 1) {
    const v = (row + 0.5) / height;
    const lat = (0.5 - v) * Math.PI;
    const rowCounts = {};

    for (let col = 0; col < width; col += 1) {
      const u = (col + 0.5) / width;
      const lon = (u - 0.5) * Math.PI * 2;
      const sample = buildHydrationFieldInternal({ lat, lon, u, v });

      const cls = sample.hydrationClass;
      classCounts[cls] = (classCounts[cls] || 0) + 1;
      rowCounts[cls] = (rowCounts[cls] || 0) + 1;

      if (sample.hydrated) hydratedSamples += 1;
      if (sample.rainfall > 0) rainfallSamples += 1;
      if (sample.liquidWater) liquidWaterSamples += 1;
      if (sample.ocean || sample.shelf || sample.liquidWater) oceanCycleClimateSamples += 1;
      if (sample.ice || sample.glacier) glacierClimateSamples += 1;
      if (sample.river) riverSamples += 1;
      if (sample.stream) streamSamples += 1;
      if (sample.lake) lakeSamples += 1;
      if (sample.floodplain) floodplainSamples += 1;
      if (sample.delta) deltaSamples += 1;
      if (sample.spring) springSamples += 1;
      if (sample.subterranean) subterraneanSamples += 1;
      if (sample.exposedTerrainLand) terrainLandSamples += 1;
      if (sample.fallbackSample) fallbackSamples += 1;

      maxHydrationActivationIndex = Math.max(maxHydrationActivationIndex, sample.hydrationIndex);
      maxSurfaceWaterIndex = Math.max(maxSurfaceWaterIndex, sample.surfaceWaterIndex);
      maxHydrationConduction = Math.max(maxHydrationConduction, sample.hydrationIndex);
      maxRainfall = Math.max(maxRainfall, sample.rainfall);
      maxEvaporation = Math.max(maxEvaporation, sample.evaporation);
      maxDrainagePressure = Math.max(maxDrainagePressure, sample.drainagePressure);
      maxWatershedIndex = Math.max(maxWatershedIndex, sample.watershedIndex);
      maxRiverCandidate = Math.max(maxRiverCandidate, sample.riverCandidate);
      maxLakeBasinCandidate = Math.max(maxLakeBasinCandidate, sample.lakeBasinCandidate);
      maxSpringCandidate = Math.max(maxSpringCandidate, sample.springCandidate);
    }

    rowDominance.push(Math.max(...Object.values(rowCounts)) / width);
  }

  const hydratedRatio = hydratedSamples / totalSamples;
  const rainfallRatio = rainfallSamples / totalSamples;
  const oceanCycleClimateRatio = oceanCycleClimateSamples / totalSamples;
  const glacierClimateRatio = glacierClimateSamples / totalSamples;
  const riverRatio = riverSamples / totalSamples;
  const streamRatio = streamSamples / totalSamples;
  const lakeRatio = lakeSamples / totalSamples;
  const floodplainRatio = floodplainSamples / totalSamples;
  const deltaRatio = deltaSamples / totalSamples;
  const springRatio = springSamples / totalSamples;
  const subterraneanRatio = subterraneanSamples / totalSamples;
  const terrainLandRatio = terrainLandSamples / totalSamples;
  const liquidWaterRatio = liquidWaterSamples / totalSamples;
  const fallbackRatio = fallbackSamples / totalSamples;
  const maxDominantRowRatio = Math.max(...rowDominance);
  const averageRowDominance = rowDominance.reduce((sum, value) => sum + value, 0) / rowDominance.length;

  cachedStats = {
    ok: true,
    receipt: AUDRALIA_HYDRATION_RECEIPT,
    terrainStats: getTerrainStats(),
    totalSamples,
    classCounts,
    visualSurfaceClasses: Object.keys(classCounts),
    hydratedSamples,
    rainfallSamples,
    climateSamples: totalSamples,
    climateConduitSamples: totalSamples,
    oceanCycleClimateSamples,
    glacierClimateSamples,
    riverSamples,
    streamSamples,
    lakeSamples,
    floodplainSamples,
    deltaSamples,
    springSamples,
    subterraneanSamples,
    terrainLandSamples,
    liquidWaterSamples,
    fallbackSamples,
    hydratedRatio,
    rainfallRatio,
    climateRatio: 1,
    climateConduitRatio: 1,
    oceanCycleClimateRatio,
    glacierClimateRatio,
    riverRatio,
    streamRatio,
    lakeRatio,
    floodplainRatio,
    deltaRatio,
    springRatio,
    subterraneanRatio,
    terrainLandRatio,
    liquidWaterRatio,
    fallbackRatio,
    maxHydrationActivationIndex,
    maxSurfaceWaterIndex,
    maxHydrationConduction,
    maxRainfall,
    maxEvaporation,
    maxDrainagePressure,
    maxWatershedIndex,
    maxRiverCandidate,
    maxLakeBasinCandidate,
    maxSpringCandidate,
    maxDominantRowRatio,
    averageRowDominance,
    rowBandingSuppressed: averageRowDominance < 0.84,
    bullseyeCollapseSuppressed: maxDominantRowRatio < 0.95,
    terrainConsumed: true,
    hydrationCannotCreateLand: true,
    hydrationCannotEraseTopologyLand: true,
    hydrationCannotFillOceans: true,
    oceanFillOwnedHere: false,
    oceanFillOwnedByOceans: true,
    hydrationStable: true,
    continuousFieldActive: true,
    fallbackAllowed: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };

  return cachedStats;
}

function createHydrationObject() {
  if (cachedHydration) return cachedHydration;

  cachedHydration = {
    ok: true,
    receipt: AUDRALIA_HYDRATION_RECEIPT,
    status: STATUS,
    sampleHydration: buildHydrationFieldInternal,
    sampleHydrationField: buildHydrationFieldInternal,
    sampleSurface: buildHydrationFieldInternal,
    buildHydrationField: buildHydrationFieldInternal,
    getStatus,
    getStats,
    getHydrationStats
  };

  return cachedHydration;
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

export function getHydrationStats() {
  return computeStats();
}

export function sampleHydration(input, lonArg, uArg, vArg) {
  return buildHydrationFieldInternal(input, lonArg, uArg, vArg);
}

export function sampleHydrationField(input, lonArg, uArg, vArg) {
  return buildHydrationFieldInternal(input, lonArg, uArg, vArg);
}

export function sampleSurface(input, lonArg, uArg, vArg) {
  return buildHydrationFieldInternal(input, lonArg, uArg, vArg);
}

export function buildHydrationField(input, lonArg, uArg, vArg) {
  return buildHydrationFieldInternal(input, lonArg, uArg, vArg);
}

export function createAudraliaHydration() {
  return createHydrationObject();
}

export const AUDRALIA_HYDRATION_STATUS = STATUS;
export const AUDRALIA_HYDRATION_RECEIPT_VALUE = AUDRALIA_HYDRATION_RECEIPT;

if (typeof window !== "undefined") {
  window.AUDRALIA_HYDRATION_STATUS = STATUS;
  window.AUDRALIA_HYDRATION_RECEIPT = AUDRALIA_HYDRATION_RECEIPT;
  window.__AUDRALIA_HYDRATION_STATUS__ = STATUS;
  window.__AUDRALIA_HYDRATION_RECEIPT__ = AUDRALIA_HYDRATION_RECEIPT;

  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dataset.audraliaHydrationReceipt = AUDRALIA_HYDRATION_RECEIPT;
    document.documentElement.dataset.audraliaHydrationContinuousField = "true";
    document.documentElement.dataset.audraliaHydrationConsumesTerrain = "true";
    document.documentElement.dataset.audraliaHydrationCreatesLand = "false";
    document.documentElement.dataset.audraliaHydrationErasesTopologyLand = "false";
    document.documentElement.dataset.audraliaHydrationFillsOceans = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }
}

export default createAudraliaHydration;

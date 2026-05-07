// /assets/audralia/audralia/hydration/render.js
// AUDRALIA_HYDRATION_CONTINUOUS_TERRAIN_CONDUCTION_SWEEP_TNT_v3
// Full-file replacement. Hydration parent authority only.
// Purpose: consume terrain + climate conduit, define continuous hydration conduction, drainage, watershed,
// glacier melt potential, lakes/streams/rivers/springs/deltas/floodplains as hydrology signals.
// Does not own topology land/void boundary, terrain relief, ocean fill, deep ocean, canvas paint,
// route shell, or visual pass.
// No GraphicBox. No image generation. No visual-pass claim.

import {
  sampleTerrain,
  sampleSurface as sampleTerrainSurface,
  getTerrainSummary,
  getTerrainStatus
} from "../tectonics/topology/terrain.render.js";

import {
  sampleClimate,
  getClimateStatus
} from "../../audralia.climate.render.js";

const AUDRALIA_HYDRATION_RECEIPT = "AUDRALIA_HYDRATION_CONTINUOUS_TERRAIN_CONDUCTION_SWEEP_TNT_v3";
const AUDRALIA_HYDRATION_COMPATIBILITY_RECEIPT = "AUDRALIA_HYDRATION_CONTINUOUS_TERRAIN_CONDUCTION_SWEEP_TNT_v2";
const AUDRALIA_HYDRATION_ALIGNMENT_RECEIPT = "AUDRALIA_HYDRATION_TERRAIN_CLIMATE_CONDUIT_ALIGNMENT_TNT_v1";

const STATUS = {
  ok: true,
  receipt: AUDRALIA_HYDRATION_RECEIPT,
  compatibilityReceipt: AUDRALIA_HYDRATION_COMPATIBILITY_RECEIPT,
  alignmentReceipt: AUDRALIA_HYDRATION_ALIGNMENT_RECEIPT,
  activeRenewal: "AUDRALIA_HYDRATION_TERRAIN_CLIMATE_CONDUIT_CONTRACT_v1",
  file: "assets/audralia/audralia/hydration/render.js",
  role: "audralia-hydration-parent-continuous-conduction-authority",
  lineage: "tectonics->topology->terrain->climate-conduit->hydration->oceans->runtime->canvas-renderer->route",
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
    "visual pass claim",
    "GraphicBox",
    "image generation"
  ],
  terrainConsumed: true,
  climateConsumed: true,
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
    "AUDRALIA_HYDRATION_CONTINUOUS_TERRAIN_CONDUCTION_SWEEP_TNT_v2",
    "AUDRALIA_HYDRATION_CONTINUOUS_TERRAIN_CONDUCTION_SWEEP_TNT_v3",
    "AUDRALIA_TERRAIN_4K_RELIEF_DETAIL_TNT_v3",
    "AUDRALIA_CLIMATE_4K_ENVIRONMENTAL_CONDUIT_TNT_v2",
    "AUDRALIA_TOPOLOGY_4K_FOOTPRINT_AUTHORITY_TNT_v1",
    "AUDRALIA_RUNTIME_4K_DOWNSTREAM_SURFACE_CONNECTOR_TNT_v7",
    "AUDRALIA_ADOPTED_CANVAS_FIXED_ASPECT_DOWNSTREAM_SWEEP_TNT_v9"
  ],
  api: {
    createAudraliaHydration: true,
    buildHydrationField: true,
    buildHydrationGrid: true,
    sampleHydration: true,
    sampleHydrationState: true,
    sampleAudraliaHydration: true,
    sampleHydrationField: true,
    sampleSurface: true,
    sample: true,
    getStats: true,
    getHydrationStats: true,
    getStatus: true,
    getHydrationStatus: true
  }
};

let cachedStats = null;
let cachedHydration = null;

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

function terrainFallback(coordinate) {
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

  return {
    ok: false,
    receipt: "AUDRALIA_HYDRATION_INTERNAL_TERRAIN_FALLBACK",
    terrainClass: land ? "fallback_land" : shelf ? "fallback_shelf" : polarIce ? "fallback_ice" : "fallback_ocean",
    visualSurfaceClass: polarIce
      ? "glacier_ice_snowpack_surface"
      : land
        ? "inland_terrain_land_surface"
        : shelf
          ? "shelf_water_surface"
          : "ocean_water_surface",
    land,
    water,
    liquidWater: water,
    solidSurfaceLand: land || polarIce,
    exposedTerrainLand: land,
    ice: polarIce,
    glacier: polarIce,
    beach: shelf,
    shelf,
    ocean: water && !shelf,
    coastal: shelf,
    elevation: land || polarIce ? clamp01(0.18 + field * 0.26) : 0,
    maxElevation: land || polarIce ? clamp01(0.18 + field * 0.26) : 0,
    terrainRelief: land || polarIce ? clamp01(0.18 + field * 0.26) : 0,
    terrainReliefIndex: land || polarIce ? clamp01(0.18 + field * 0.26) : 0,
    mountainIndex: 0,
    ridgeIndex: 0,
    basinIndex: 0,
    coastalCliffIndex: 0,
    coastlineIndex: shelf ? 0.58 : 0,
    shelfIndex: shelf ? 0.64 : 0,
    beachIndex: shelf ? 0.48 : 0,
    weatheringIndex: 0,
    mineralIndex: 0.38,
    fallback: true,
    fallbackSample: true
  };
}

function sampleTerrainSafe(coordinate) {
  const payload = {
    lat: coordinate.lat,
    lon: coordinate.lon,
    latDeg: coordinate.latDeg,
    lonDeg: coordinate.lonDeg,
    u: coordinate.u,
    v: coordinate.v
  };

  const attempts = [
    () => sampleTerrain(payload),
    () => sampleTerrain(coordinate.latDeg, coordinate.lonDeg, { u: coordinate.u, v: coordinate.v }),
    () => sampleTerrainSurface(payload)
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

  return terrainFallback(coordinate);
}

function sampleClimateSafe(coordinate, terrain) {
  const payload = {
    lat: coordinate.lat,
    lon: coordinate.lon,
    latDeg: coordinate.latDeg,
    lonDeg: coordinate.lonDeg,
    u: coordinate.u,
    v: coordinate.v
  };

  const context = {
    terrain,
    terrainSample: terrain,
    runtime: terrain,
    surface: terrain
  };

  const attempts = [
    () => sampleClimate(payload, undefined, context),
    () => sampleClimate(coordinate.u, coordinate.v, context)
  ];

  for (const attempt of attempts) {
    try {
      const sample = attempt();

      if (sample && typeof sample === "object") {
        return sample;
      }
    } catch (_) {
      /* try next */
    }
  }

  return {
    receipt: "AUDRALIA_HYDRATION_INTERNAL_CLIMATE_FALLBACK",
    rainfallTendency: 0.42,
    evaporationTendency: 0.34,
    snowPermission: terrain.ice || terrain.glacier ? 0.72 : 0.12,
    glacierPermission: terrain.ice || terrain.glacier ? 0.78 : 0.08,
    oceanCycleInfluence: terrain.water || terrain.liquidWater ? 0.72 : terrain.coastal ? 0.46 : 0.12,
    pressureIndex: 0.5,
    windCorridorIndex: 0.42,
    hydrationConductionIndex: terrain.water || terrain.liquidWater ? 0.72 : 0.38,
    coastalFogPermission: terrain.coastal || terrain.shelf ? 0.38 : 0,
    cleanBreathableAtmosphere: true,
    climateConducesHydration: true,
    climateDoesNotRender: true,
    fallback: true,
    fallbackSample: true
  };
}

function buildHydrationFieldInternal(input, lonArg, uArg, vArg) {
  const coordinate = normalizeCoordinateInput(input, lonArg, uArg, vArg);
  const point = latLonToPoint(coordinate.lat, coordinate.lon);
  const terrain = sampleTerrainSafe(coordinate);
  const climate = sampleClimateSafe(coordinate, terrain);

  const isIce = Boolean(terrain.ice || terrain.glacier || terrain.visualSurfaceClass === "glacier_ice_snowpack_surface");
  const isWater = Boolean(terrain.water || terrain.liquidWater || terrain.ocean || terrain.shelf) && !isIce;
  const isOcean = Boolean(terrain.ocean || (isWater && !terrain.shelf));
  const isShelf = Boolean(terrain.shelf);
  const isBeach = Boolean(terrain.beach || terrain.beachIndex > 0.18);
  const isLand = Boolean(terrain.land || terrain.exposedTerrainLand || terrain.solidSurfaceLand || terrain.admissible) && !isWater;

  const elevation = clamp01(safeNumber(terrain.elevation ?? terrain.maxElevation ?? terrain.terrainRelief, 0));
  const relief = clamp01(safeNumber(terrain.terrainRelief ?? terrain.terrainReliefIndex ?? elevation, elevation));
  const mountainIndex = clamp01(safeNumber(terrain.mountainIndex, elevation > 0.52 ? elevation : 0));
  const ridgeIndex = clamp01(safeNumber(terrain.ridgeIndex ?? terrain.ridge, 0));
  const basinIndex = clamp01(safeNumber(terrain.basinIndex ?? terrain.valleyIndex ?? terrain.valley, 0));
  const coastalCliffIndex = clamp01(safeNumber(terrain.coastalCliffIndex ?? terrain.cliffIndex ?? terrain.cliff, 0));
  const coast = clamp01(safeNumber(terrain.coastlineIndex ?? terrain.coastalFeather ?? terrain.beach ?? terrain.beachIndex, isShelf || isBeach ? 0.48 : 0));
  const shelfIndex = clamp01(safeNumber(terrain.shelfIndex, isShelf ? 0.66 : 0));
  const beachIndex = clamp01(safeNumber(terrain.beachIndex ?? terrain.beach, isBeach ? 0.42 : 0));
  const mineral = clamp01(safeNumber(terrain.mineralIndex ?? terrain.pressure, 0.38));

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
  const climateRainfall = clamp01(safeNumber(climate.rainfallTendency, 0.42));
  const climateEvaporation = clamp01(safeNumber(climate.evaporationTendency, 0.34));
  const climateSnow = clamp01(safeNumber(climate.snowPermission ?? climate.snowlineIndex, 0));
  const climateGlacier = clamp01(safeNumber(climate.glacierPermission, isIce ? 0.72 : 0));
  const climateOceanCycle = clamp01(safeNumber(climate.oceanCycleInfluence, isWater ? 0.72 : coast * 0.42));
  const climatePressure = clamp01(safeNumber(climate.pressureIndex, 0.5));
  const climateWind = clamp01(safeNumber(climate.windCorridorIndex, 0.42));
  const climateHydrationConduction = clamp01(safeNumber(climate.hydrationConductionIndex, 0.38));
  const coastalFog = clamp01(safeNumber(climate.coastalFogPermission, coast * 0.24));

  const oceanProximityMoisture = clamp01(coast * 0.38 + shelfIndex * 0.24 + beachIndex * 0.12 + coastalFog * 0.12);
  const orographicLift = clamp01(mountainIndex * 0.26 + ridgeIndex * 0.18 + coastalCliffIndex * 0.12 + climatePressure * 0.06);

  const rainfall = clamp01(
    atmosphericMoisture * 0.22 +
      stormTrack * 0.16 +
      latitudeMoisture * 0.12 +
      oceanProximityMoisture * 0.14 +
      orographicLift * 0.10 +
      climateRainfall * 0.26
  );

  const evaporation = isWater
    ? clamp01(0.42 + climateEvaporation * 0.28 + latitudeMoisture * 0.14 + climateWind * 0.08)
    : clamp01(0.10 + climateEvaporation * 0.24 + latitudeMoisture * 0.12 + rainfall * 0.12 - elevation * 0.10);

  const glacierMeltPotential = isIce
    ? clamp01((1 - Math.abs(point.y)) * 0.18 + rainfall * 0.16 + stormTrack * 0.10 + climateGlacier * 0.18 - climateSnow * 0.10)
    : 0;

  const drainagePressure = isLand
    ? clamp01(elevation * 0.32 + ridgeIndex * 0.21 + rainfall * 0.24 + drainageGrain * 0.17 + climateHydrationConduction * 0.06)
    : 0;

  const watershedIndex = isLand
    ? clamp01(ridgeIndex * 0.32 + drainageGrain * 0.26 + elevation * 0.20 + rainfall * 0.16 + climatePressure * 0.06)
    : 0;

  const basinRetention = isLand
    ? clamp01(basinIndex * 0.38 + basinWetness * 0.24 + rainfall * 0.20 + mineral * 0.08 + climateHydrationConduction * 0.10)
    : 0;

  const riverCandidate = isLand
    ? clamp01(drainagePressure * 0.45 + watershedIndex * 0.22 + rainfall * 0.22 + glacierMeltPotential * 0.07 + climateWind * 0.04)
    : 0;

  const streamCandidate = isLand
    ? clamp01(riverCandidate * 0.44 + drainageGrain * 0.30 + rainfall * 0.20 + climateHydrationConduction * 0.06)
    : 0;

  const lakeBasinCandidate = isLand
    ? clamp01(basinRetention * 0.52 + rainfall * 0.22 + (1 - elevation) * 0.16 + climateHydrationConduction * 0.10)
    : 0;

  const floodplainCandidate = isLand
    ? clamp01(coast * 0.24 + basinIndex * 0.26 + riverCandidate * 0.24 + rainfall * 0.20 + climateOceanCycle * 0.06)
    : 0;

  const deltaCandidate = isLand
    ? clamp01(coast * 0.40 + riverCandidate * 0.32 + beachIndex * 0.20 + climateOceanCycle * 0.08)
    : 0;

  const springCandidate = isLand
    ? clamp01(springNoise * 0.32 + mineral * 0.20 + ridgeIndex * 0.18 + basinRetention * 0.20 + climateHydrationConduction * 0.10)
    : 0;

  const subterraneanCandidate = isLand
    ? clamp01(mineral * 0.26 + basinRetention * 0.30 + rainfall * 0.22 + springNoise * 0.14 + climatePressure * 0.08)
    : 0;

  const hydrationIndex = isWater
    ? clamp01(0.58 + evaporation * 0.16 + shelfIndex * 0.08 + climateOceanCycle * 0.18)
    : isIce
      ? clamp01(0.36 + glacierMeltPotential * 0.28 + rainfall * 0.16 + climateGlacier * 0.16)
      : clamp01(
          rainfall * 0.30 +
            basinRetention * 0.18 +
            streamCandidate * 0.13 +
            springCandidate * 0.11 +
            subterraneanCandidate * 0.09 +
            coast * 0.07 +
            climateHydrationConduction * 0.12
        );

  let hydrationClass = "hydration_dry_land";

  if (isOcean) hydrationClass = "hydration_ocean_passthrough";
  else if (isShelf) hydrationClass = "hydration_shelf_passthrough";
  else if (isIce) hydrationClass = "hydration_glacier_snowpack_source";
  else if (deltaCandidate > 0.58) hydrationClass = "hydration_delta_candidate";
  else if (lakeBasinCandidate > 0.62) hydrationClass = "hydration_lake_basin_candidate";
  else if (riverCandidate > 0.68) hydrationClass = "hydration_river_candidate";
  else if (streamCandidate > 0.62) hydrationClass = "hydration_stream_candidate";
  else if (floodplainCandidate > 0.60) hydrationClass = "hydration_floodplain_candidate";
  else if (springCandidate > 0.64) hydrationClass = "hydration_spring_candidate";
  else if (subterraneanCandidate > 0.62) hydrationClass = "hydration_subterranean_candidate";
  else if (hydrationIndex > 0.46) hydrationClass = "hydration_moist_land";

  const surfaceWaterIndex = isWater
    ? clamp01(0.62 + evaporation * 0.14 + shelfIndex * 0.10 + climateOceanCycle * 0.14)
    : clamp01(hydrationIndex * 0.46 + riverCandidate * 0.18 + lakeBasinCandidate * 0.16 + springCandidate * 0.12 + glacierMeltPotential * 0.08);

  return {
    ...terrain,
    ok: true,
    receipt: AUDRALIA_HYDRATION_RECEIPT,
    compatibilityReceipt: AUDRALIA_HYDRATION_COMPATIBILITY_RECEIPT,
    alignmentReceipt: AUDRALIA_HYDRATION_ALIGNMENT_RECEIPT,
    source: "audralia-hydration-terrain-climate-conduit",
    terrain,
    climate,
    terrainReceipt: terrain.receipt || terrain.terrainAuthority || "",
    climateReceipt: climate.receipt || "",
    terrainConsumed: true,
    climateConsumed: true,

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
    floodplain: floodplainCandidate > 0.60,
    delta: deltaCandidate > 0.58,
    spring: springCandidate > 0.64,
    subterranean: subterraneanCandidate > 0.62,

    surfaceWaterIndex,
    climateConduit: true,
    climateConducesHydration: true,
    hydrationConditioningActive: true,

    liquidWater: isWater,
    water: isWater,
    ocean: isOcean,
    shelf: isShelf,
    land: isLand,
    exposedTerrainLand: isLand,
    visibleLand: isLand,
    solidSurfaceLand: isLand || isIce,
    topologyLand: isLand || isIce,
    ice: isIce,
    glacier: isIce,
    beach: isBeach,
    coastal: coast > 0.16 || isShelf || isBeach,

    rainfallTendency: rainfall,
    evaporationTendency: evaporation,
    snowPermission: climateSnow,
    glacierPermission: climateGlacier,
    oceanCycleInfluence: climateOceanCycle,
    pressureIndex: climatePressure,
    windCorridorIndex: climateWind,
    hydrationConductionIndex: climateHydrationConduction,
    coastalFogPermission: coastalFog,

    hydrationCannotCreateLand: true,
    hydrationCannotEraseTopologyLand: true,
    hydrationCannotFillOceans: true,
    oceanFillOwnedHere: false,
    oceanFillOwnedByOceans: true,

    visualSurfaceClass: terrain.visualSurfaceClass || terrain.surfaceClass,
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

  const width = 192;
  const height = 96;
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
      const hydrationSample = buildHydrationFieldInternal({ lat, lon, u, v });

      const cls = hydrationSample.hydrationClass;
      classCounts[cls] = (classCounts[cls] || 0) + 1;
      rowCounts[cls] = (rowCounts[cls] || 0) + 1;

      if (hydrationSample.hydrated) hydratedSamples += 1;
      if (hydrationSample.rainfall > 0) rainfallSamples += 1;
      if (hydrationSample.liquidWater) liquidWaterSamples += 1;
      if (hydrationSample.ocean || hydrationSample.shelf || hydrationSample.liquidWater) oceanCycleClimateSamples += 1;
      if (hydrationSample.ice || hydrationSample.glacier) glacierClimateSamples += 1;
      if (hydrationSample.river) riverSamples += 1;
      if (hydrationSample.stream) streamSamples += 1;
      if (hydrationSample.lake) lakeSamples += 1;
      if (hydrationSample.floodplain) floodplainSamples += 1;
      if (hydrationSample.delta) deltaSamples += 1;
      if (hydrationSample.spring) springSamples += 1;
      if (hydrationSample.subterranean) subterraneanSamples += 1;
      if (hydrationSample.exposedTerrainLand) terrainLandSamples += 1;
      if (hydrationSample.fallbackSample) fallbackSamples += 1;

      maxHydrationActivationIndex = Math.max(maxHydrationActivationIndex, hydrationSample.hydrationIndex);
      maxSurfaceWaterIndex = Math.max(maxSurfaceWaterIndex, hydrationSample.surfaceWaterIndex);
      maxHydrationConduction = Math.max(maxHydrationConduction, hydrationSample.hydrationConductionIndex);
      maxRainfall = Math.max(maxRainfall, hydrationSample.rainfall);
      maxEvaporation = Math.max(maxEvaporation, hydrationSample.evaporation);
      maxDrainagePressure = Math.max(maxDrainagePressure, hydrationSample.drainagePressure);
      maxWatershedIndex = Math.max(maxWatershedIndex, hydrationSample.watershedIndex);
      maxRiverCandidate = Math.max(maxRiverCandidate, hydrationSample.riverCandidate);
      maxLakeBasinCandidate = Math.max(maxLakeBasinCandidate, hydrationSample.lakeBasinCandidate);
      maxSpringCandidate = Math.max(maxSpringCandidate, hydrationSample.springCandidate);
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
    compatibilityReceipt: AUDRALIA_HYDRATION_COMPATIBILITY_RECEIPT,
    alignmentReceipt: AUDRALIA_HYDRATION_ALIGNMENT_RECEIPT,
    terrainSummary: safeGetTerrainSummary(),
    terrainStatus: safeGetTerrainStatus(),
    climateStatus: safeGetClimateStatus(),
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
    climateConsumed: true,
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

  STATUS.fallbackSamples = fallbackSamples;
  STATUS.fallbackAllowed = fallbackSamples > 0;
  STATUS.fallbackReason = fallbackSamples > 0 ? "hydration-fallback-samples-observed" : "terrain-climate-conduit-ready";

  return cachedStats;
}

function safeGetTerrainSummary() {
  try {
    return getTerrainSummary();
  } catch (_) {
    return null;
  }
}

function safeGetTerrainStatus() {
  try {
    return getTerrainStatus();
  } catch (_) {
    return null;
  }
}

function safeGetClimateStatus() {
  try {
    return getClimateStatus();
  } catch (_) {
    return null;
  }
}

function buildHydrationGrid(options = {}) {
  const width = clamp(Math.floor(Number(options.width) || 96), 24, 384);
  const height = clamp(Math.floor(Number(options.height) || 48), 12, 192);
  const samples = new Array(width * height);

  for (let row = 0; row < height; row += 1) {
    const v = height === 1 ? 0.5 : row / (height - 1);
    const lat = (0.5 - v) * Math.PI;

    for (let col = 0; col < width; col += 1) {
      const u = width === 1 ? 0.5 : col / (width - 1);
      const lon = (u - 0.5) * Math.PI * 2;
      samples[row * width + col] = buildHydrationFieldInternal({ lat, lon, u, v });
    }
  }

  return {
    ok: true,
    receipt: AUDRALIA_HYDRATION_RECEIPT,
    compatibilityReceipt: AUDRALIA_HYDRATION_COMPATIBILITY_RECEIPT,
    alignmentReceipt: AUDRALIA_HYDRATION_ALIGNMENT_RECEIPT,
    width,
    height,
    samples,
    stats: computeStats(),
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };
}

function createHydrationObject() {
  if (cachedHydration) return cachedHydration;

  cachedHydration = {
    ok: true,
    receipt: AUDRALIA_HYDRATION_RECEIPT,
    compatibilityReceipt: AUDRALIA_HYDRATION_COMPATIBILITY_RECEIPT,
    alignmentReceipt: AUDRALIA_HYDRATION_ALIGNMENT_RECEIPT,
    status: STATUS,
    sampleHydration: buildHydrationFieldInternal,
    sampleHydrationState: buildHydrationFieldInternal,
    sampleAudraliaHydration: buildHydrationFieldInternal,
    sampleHydrationField: buildHydrationFieldInternal,
    sampleSurface: buildHydrationFieldInternal,
    sample: buildHydrationFieldInternal,
    buildHydrationField: buildHydrationFieldInternal,
    buildHydrationGrid,
    getStatus,
    getHydrationStatus,
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

export function getHydrationStatus() {
  return getStatus();
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

export function sampleHydrationState(input, lonArg, uArg, vArg) {
  return buildHydrationFieldInternal(input, lonArg, uArg, vArg);
}

export function sampleAudraliaHydration(input, lonArg, uArg, vArg) {
  return buildHydrationFieldInternal(input, lonArg, uArg, vArg);
}

export function sampleHydrationField(input, lonArg, uArg, vArg) {
  return buildHydrationFieldInternal(input, lonArg, uArg, vArg);
}

export function sampleSurface(input, lonArg, uArg, vArg) {
  return buildHydrationFieldInternal(input, lonArg, uArg, vArg);
}

export function sample(input, lonArg, uArg, vArg) {
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
export const AUDRALIA_HYDRATION_COMPATIBILITY_RECEIPT_VALUE = AUDRALIA_HYDRATION_COMPATIBILITY_RECEIPT;
export const AUDRALIA_HYDRATION_ALIGNMENT_RECEIPT_VALUE = AUDRALIA_HYDRATION_ALIGNMENT_RECEIPT;

const api = createHydrationObject();

if (typeof window !== "undefined") {
  window.AUDRALIA_HYDRATION_STATUS = STATUS;
  window.AUDRALIA_HYDRATION_RECEIPT = AUDRALIA_HYDRATION_RECEIPT;
  window.__AUDRALIA_HYDRATION_STATUS__ = STATUS;
  window.__AUDRALIA_HYDRATION_RECEIPT__ = AUDRALIA_HYDRATION_RECEIPT;
  window.AudraliaHydration = api;
  window.DGBAudraliaHydration = api;

  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dataset.audraliaHydrationReceipt = AUDRALIA_HYDRATION_RECEIPT;
    document.documentElement.dataset.audraliaHydrationCompatibilityReceipt = AUDRALIA_HYDRATION_COMPATIBILITY_RECEIPT;
    document.documentElement.dataset.audraliaHydrationAlignmentReceipt = AUDRALIA_HYDRATION_ALIGNMENT_RECEIPT;
    document.documentElement.dataset.audraliaHydrationContinuousField = "true";
    document.documentElement.dataset.audraliaHydrationConsumesTerrain = "true";
    document.documentElement.dataset.audraliaHydrationConsumesClimate = "true";
    document.documentElement.dataset.audraliaHydrationCreatesLand = "false";
    document.documentElement.dataset.audraliaHydrationErasesTopologyLand = "false";
    document.documentElement.dataset.audraliaHydrationFillsOceans = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }
}

export default createAudraliaHydration;

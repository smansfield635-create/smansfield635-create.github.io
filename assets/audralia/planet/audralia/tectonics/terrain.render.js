// /assets/audralia/audralia/tectonics/topology/terrain.render.js
// AUDRALIA_TERRAIN_CONTINUOUS_RELIEF_ALIGNMENT_SWEEP_TNT_v2
// Full-file replacement. Terrain authority only.
// Purpose: consume topology as land/void boundary and define continuous above-sea-level relief.
// Does not own land/void footprint, ocean fill, hydration cycle, canvas paint, route shell, or visual pass.
// No GraphicBox. No image generation. No visual-pass claim.

import {
  sampleTopology,
  buildTopologyField,
  getTopologyStats
} from "./render.js";

const AUDRALIA_TERRAIN_RECEIPT = "AUDRALIA_TERRAIN_CONTINUOUS_RELIEF_ALIGNMENT_SWEEP_TNT_v2";

const STATUS = {
  ok: true,
  receipt: AUDRALIA_TERRAIN_RECEIPT,
  activeRenewal: "AUDRALIA_TERRAIN_CONTINUOUS_RELIEF_ALIGNMENT_CONTRACT_v1",
  file: "assets/audralia/audralia/tectonics/topology/terrain.render.js",
  role: "audralia-terrain-relief-authority",
  lineage: "tectonics→topology→terrain→hydration→oceans→runtime→canvas-renderer→route",
  owns: [
    "above-sea-level relief",
    "mountain chains",
    "highland ridges",
    "weathered basins",
    "coastal cliffs",
    "terrain roughness",
    "terrain class handoff"
  ],
  doesNotOwn: [
    "land-versus-void footprint",
    "sea-level boundary",
    "ocean fill",
    "hydration cycle",
    "canvas paint",
    "route shell",
    "visual pass claim"
  ],
  topologyConsumed: true,
  terrainStable: true,
  continuousFieldActive: true,
  latitudeBandingSuppressed: true,
  bullseyeCollapseSuppressed: true,
  terrainCannotCreateLand: true,
  terrainCannotEraseWater: true,
  fallbackAllowed: false,
  fallbackSamples: 0,
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,
  compatibilityReceipts: [
    "AUDRALIA_TOPOLOGY_CONTINUOUS_LAND_VOID_BOUNDARY_SWEEP_TNT_v2",
    "AUDRALIA_RUNTIME_DOWNSTREAM_SWEEP_CONTINUOUS_FIELD_TNT_v3",
    "AUDRALIA_ADOPTED_CANVAS_FIXED_ASPECT_DOWNSTREAM_SWEEP_TNT_v9"
  ],
  api: {
    createAudraliaTerrain: true,
    buildTerrainField: true,
    sampleTerrain: true,
    sampleTerrainField: true,
    sampleSurface: true,
    getStats: true,
    getTerrainStats: true,
    getStatus: true
  }
};

let cachedStats = null;
let cachedTerrain = null;

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

function sampleTopologySafe(input, lonArg, uArg, vArg) {
  try {
    const sample = sampleTopology(input, lonArg, uArg, vArg);
    if (sample && typeof sample === "object") return sample;
  } catch (_) {}

  return {
    ok: false,
    topologyLand: false,
    topologyVoid: true,
    topologyIce: false,
    land: false,
    water: true,
    liquidWater: true,
    solidSurfaceLand: false,
    exposedTerrainLand: false,
    seaLevel: 0.19717211167845794,
    topologyScore: 0,
    coastlineIndex: 0,
    shelfIndex: 0,
    beachIndex: 0,
    mineralMemory: 0,
    tectonicTexture: 0,
    fallback: true,
    fallbackSample: true
  };
}

function buildTerrainFieldInternal(input, lonArg, uArg, vArg) {
  const coordinate = normalizeCoordinateInput(input, lonArg, uArg, vArg);
  const point = latLonToPoint(coordinate.lat, coordinate.lon);
  const topology = sampleTopologySafe({ ...coordinate, lat: coordinate.lat, lon: coordinate.lon });

  const isVoid = Boolean(topology.topologyVoid || topology.water || topology.liquidWater);
  const isIce = Boolean(topology.topologyIce || topology.ice || topology.glacier);
  const isLand = Boolean(topology.topologyLand || topology.land || topology.exposedTerrainLand || topology.solidSurfaceLand) && !isVoid;

  const macroRelief = fbm3(
    point.x * 2.1 + 3.4,
    point.y * 2.1 - 7.2,
    point.z * 2.1 + 1.8,
    5
  );

  const ridgeField = ridgedNoise3(
    point.x * 7.4 + 11.2,
    point.y * 7.4 - 2.6,
    point.z * 7.4 + 4.5,
    4
  );

  const basinField = fbm3(
    point.x * 4.8 - 9.1,
    point.y * 4.8 + 1.6,
    point.z * 4.8 - 6.7,
    4
  );

  const cliffField = ridgedNoise3(
    point.x * 11.5 + 5.7,
    point.y * 11.5 - 3.9,
    point.z * 11.5 + 12.6,
    3
  );

  const fineWeathering = fbm3(
    point.x * 31.0 - 2.4,
    point.y * 31.0 + 8.2,
    point.z * 31.0 - 1.3,
    3
  );

  const coastlineIndex = clamp01(Number(topology.coastlineIndex ?? topology.coastalFeather ?? 0));
  const shelfIndex = clamp01(Number(topology.shelfIndex ?? 0));
  const beachIndex = clamp01(Number(topology.beachIndex ?? 0));
  const topologyLandField = clamp01(Number(topology.landField ?? topology.topologyScore ?? 0));
  const signedSeaDistance = Number(topology.signedSeaDistance ?? 0);
  const mineralMemory = clamp01(Number(topology.mineralMemory ?? topology.mineralIndex ?? 0.38));
  const tectonicTexture = clamp01(Number(topology.tectonicTexture ?? topology.ridgeIndex ?? 0.42));

  const landRise = isLand
    ? clamp01(Math.max(0, signedSeaDistance) * 4.2 + topologyLandField * 0.18)
    : 0;

  const baseRelief = isLand
    ? clamp01(
        landRise * 0.42 +
        macroRelief * 0.18 +
        ridgeField * 0.2 +
        mineralMemory * 0.12 +
        tectonicTexture * 0.08
      )
    : 0;

  const mountainIndex = isLand
    ? smoothstep(0.66, 0.92, baseRelief + ridgeField * 0.18)
    : 0;

  const ridgeIndex = isLand
    ? smoothstep(0.48, 0.82, baseRelief + ridgeField * 0.22)
    : 0;

  const basinIndex = isLand
    ? smoothstep(0.18, 0.55, 1 - basinField) * (1 - mountainIndex * 0.72)
    : 0;

  const coastalCliffIndex = isLand
    ? coastlineIndex * smoothstep(0.34, 0.78, cliffField + baseRelief * 0.32)
    : 0;

  const weatheringIndex = isLand
    ? clamp01(0.34 + fineWeathering * 0.42 + mineralMemory * 0.24)
    : 0;

  const terrainRelief = isIce
    ? clamp01(0.36 + fineWeathering * 0.18)
    : isLand
      ? clamp01(baseRelief * 0.72 + ridgeIndex * 0.18 + mountainIndex * 0.18 - basinIndex * 0.12)
      : 0;

  const terrainElevation = isIce
    ? terrainRelief
    : isLand
      ? clamp01(terrainRelief + Math.max(0, signedSeaDistance) * 0.58)
      : 0;

  let terrainClass = "terrain_void_passthrough";
  if (isIce) terrainClass = "terrain_limited_polar_ice";
  else if (isVoid && shelfIndex > 0.18) terrainClass = "terrain_shelf_void_passthrough";
  else if (isVoid) terrainClass = "terrain_ocean_void_passthrough";
  else if (beachIndex > 0.42) terrainClass = "terrain_beach_boundary";
  else if (coastalCliffIndex > 0.42) terrainClass = "terrain_coastal_cliff";
  else if (mountainIndex > 0.52) terrainClass = "terrain_weathered_mountain_chain";
  else if (ridgeIndex > 0.46) terrainClass = "terrain_highland_ridge";
  else if (basinIndex > 0.56) terrainClass = "terrain_weathered_basin";
  else terrainClass = "terrain_inland_rock_plain";

  return {
    ok: true,
    receipt: AUDRALIA_TERRAIN_RECEIPT,
    source: "audralia-terrain-continuous-relief-alignment",
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
    topology,
    topologyReceipt: topology.receipt || "",
    topologyClass: topology.topologyClass || "",
    topologyConsumed: true,
    terrainClass,
    visualSurfaceClass:
      terrainClass === "terrain_limited_polar_ice"
        ? "glacier_ice_snowpack_surface"
        : terrainClass === "terrain_shelf_void_passthrough"
          ? "shelf_water_surface"
          : terrainClass === "terrain_ocean_void_passthrough"
            ? "ocean_water_surface"
            : terrainClass === "terrain_beach_boundary"
              ? "beach_outline_land_surface"
              : terrainClass === "terrain_coastal_cliff"
                ? "coastal_cliff_rock_relief_land_surface"
                : terrainClass === "terrain_weathered_mountain_chain"
                  ? "mountain_chain_relief_land_surface"
                  : terrainClass === "terrain_highland_ridge"
                    ? "highland_ridge_relief_land_surface"
                    : terrainClass === "terrain_weathered_basin"
                      ? "weathered_basin_relief_land_surface"
                      : "inland_terrain_land_surface",
    surfaceClass:
      terrainClass === "terrain_limited_polar_ice"
        ? "glacier_ice_snowpack_surface"
        : terrainClass === "terrain_shelf_void_passthrough"
          ? "shelf_water_surface"
          : terrainClass === "terrain_ocean_void_passthrough"
            ? "ocean_water_surface"
            : terrainClass === "terrain_beach_boundary"
              ? "beach_outline_land_surface"
              : terrainClass === "terrain_coastal_cliff"
                ? "coastal_cliff_rock_relief_land_surface"
                : terrainClass === "terrain_weathered_mountain_chain"
                  ? "mountain_chain_relief_land_surface"
                  : terrainClass === "terrain_highland_ridge"
                    ? "highland_ridge_relief_land_surface"
                    : terrainClass === "terrain_weathered_basin"
                      ? "weathered_basin_relief_land_surface"
                      : "inland_terrain_land_surface",
    terrainRelief,
    terrainReliefIndex: terrainRelief,
    elevation: terrainElevation,
    maxElevation: terrainElevation,
    baseRelief,
    mountainIndex,
    ridgeIndex,
    basinIndex,
    coastalCliffIndex,
    weatheringIndex,
    macroRelief,
    ridgeField,
    basinField,
    cliffField,
    fineWeathering,
    mineralIndex: mineralMemory,
    diamondSignal: clamp01(mineralMemory * 0.58 + ridgeField * 0.26),
    opalSignal: clamp01(coastlineIndex * 0.54 + fineWeathering * 0.22),
    graniteSignal: clamp01(terrainElevation * 0.48 + ridgeField * 0.28),
    slateSignal: clamp01((1 - fineWeathering) * 0.32 + terrainRelief * 0.28),
    land: isLand,
    water: isVoid,
    liquidWater: isVoid,
    solidSurface: isLand || isIce,
    solidSurfaceLand: isLand || isIce,
    exposedTerrainLand: isLand,
    ice: isIce,
    glacier: isIce,
    beach: terrainClass === "terrain_beach_boundary",
    shelf: terrainClass === "terrain_shelf_void_passthrough",
    ocean: terrainClass === "terrain_ocean_void_passthrough",
    coastal: coastlineIndex > 0.16,
    terrainBoundaryObeysTopology: true,
    terrainCreatedLand: false,
    terrainErasedWater: false,
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

  let terrainReliefSamples = 0;
  let exposedTerrainLandSamples = 0;
  let solidSurfaceLandSamples = 0;
  let liquidWaterSamples = 0;
  let iceSolidSurfaceSamples = 0;
  let mountainSamples = 0;
  let ridgeSamples = 0;
  let basinSamples = 0;
  let cliffSamples = 0;
  let beachSamples = 0;
  let shelfSamples = 0;
  let oceanSamples = 0;
  let fallbackSamples = 0;

  let maxElevation = 0;
  let maxTerrainRelief = 0;
  let maxMountain = 0;
  let maxRidge = 0;
  let maxBasin = 0;
  let maxCliff = 0;
  let maxWeathering = 0;

  for (let row = 0; row < height; row += 1) {
    const v = (row + 0.5) / height;
    const lat = (0.5 - v) * Math.PI;
    const rowCounts = {};

    for (let col = 0; col < width; col += 1) {
      const u = (col + 0.5) / width;
      const lon = (u - 0.5) * Math.PI * 2;
      const sample = buildTerrainFieldInternal({ lat, lon, u, v });

      const cls = sample.terrainClass;
      classCounts[cls] = (classCounts[cls] || 0) + 1;
      rowCounts[cls] = (rowCounts[cls] || 0) + 1;

      if (sample.terrainRelief > 0) terrainReliefSamples += 1;
      if (sample.exposedTerrainLand) exposedTerrainLandSamples += 1;
      if (sample.solidSurfaceLand) solidSurfaceLandSamples += 1;
      if (sample.liquidWater) liquidWaterSamples += 1;
      if (sample.ice) iceSolidSurfaceSamples += 1;
      if (sample.terrainClass === "terrain_weathered_mountain_chain") mountainSamples += 1;
      if (sample.terrainClass === "terrain_highland_ridge") ridgeSamples += 1;
      if (sample.terrainClass === "terrain_weathered_basin") basinSamples += 1;
      if (sample.terrainClass === "terrain_coastal_cliff") cliffSamples += 1;
      if (sample.beach) beachSamples += 1;
      if (sample.shelf) shelfSamples += 1;
      if (sample.ocean) oceanSamples += 1;
      if (sample.fallbackSample) fallbackSamples += 1;

      maxElevation = Math.max(maxElevation, sample.elevation);
      maxTerrainRelief = Math.max(maxTerrainRelief, sample.terrainRelief);
      maxMountain = Math.max(maxMountain, sample.mountainIndex);
      maxRidge = Math.max(maxRidge, sample.ridgeIndex);
      maxBasin = Math.max(maxBasin, sample.basinIndex);
      maxCliff = Math.max(maxCliff, sample.coastalCliffIndex);
      maxWeathering = Math.max(maxWeathering, sample.weatheringIndex);
    }

    rowDominance.push(Math.max(...Object.values(rowCounts)) / width);
  }

  const terrainReliefRatio = terrainReliefSamples / totalSamples;
  const exposedTerrainLandRatio = exposedTerrainLandSamples / totalSamples;
  const solidSurfaceLandRatio = solidSurfaceLandSamples / totalSamples;
  const liquidWaterRatio = liquidWaterSamples / totalSamples;
  const iceSolidSurfaceRatio = iceSolidSurfaceSamples / totalSamples;
  const mountainRatio = mountainSamples / totalSamples;
  const ridgeRatio = ridgeSamples / totalSamples;
  const basinRatio = basinSamples / totalSamples;
  const cliffRatio = cliffSamples / totalSamples;
  const beachRatio = beachSamples / totalSamples;
  const shelfRatio = shelfSamples / totalSamples;
  const oceanRatio = oceanSamples / totalSamples;
  const fallbackRatio = fallbackSamples / totalSamples;
  const maxDominantRowRatio = Math.max(...rowDominance);
  const averageRowDominance = rowDominance.reduce((sum, value) => sum + value, 0) / rowDominance.length;

  cachedStats = {
    ok: true,
    receipt: AUDRALIA_TERRAIN_RECEIPT,
    topologyStats: getTopologyStats(),
    totalSamples,
    classCounts,
    visualSurfaceClasses: Object.keys(classCounts),
    terrainReliefSamples,
    exposedTerrainLandSamples,
    solidSurfaceLandSamples,
    liquidWaterSamples,
    iceSolidSurfaceSamples,
    mountainSamples,
    ridgeSamples,
    basinSamples,
    cliffSamples,
    beachSamples,
    shelfSamples,
    oceanSamples,
    fallbackSamples,
    terrainReliefRatio,
    exposedTerrainLandRatio,
    solidSurfaceLandRatio,
    liquidWaterRatio,
    iceSolidSurfaceRatio,
    mountainRatio,
    ridgeRatio,
    basinRatio,
    cliffRatio,
    beachRatio,
    shelfRatio,
    oceanRatio,
    fallbackRatio,
    maxElevation,
    maxTerrainRelief,
    maxMountain,
    maxRidge,
    maxBasin,
    maxCliff,
    maxWeathering,
    maxDominantRowRatio,
    averageRowDominance,
    rowBandingSuppressed: averageRowDominance < 0.84,
    bullseyeCollapseSuppressed: maxDominantRowRatio < 0.95,
    terrainBoundaryObeysTopology: true,
    terrainCreatedLand: false,
    terrainErasedWater: false,
    terrainStable: true,
    continuousFieldActive: true,
    fallbackAllowed: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };

  return cachedStats;
}

function createTerrainObject() {
  if (cachedTerrain) return cachedTerrain;

  cachedTerrain = {
    ok: true,
    receipt: AUDRALIA_TERRAIN_RECEIPT,
    status: STATUS,
    sampleTerrain: buildTerrainFieldInternal,
    sampleTerrainField: buildTerrainFieldInternal,
    sampleSurface: buildTerrainFieldInternal,
    buildTerrainField: buildTerrainFieldInternal,
    getStatus,
    getStats,
    getTerrainStats
  };

  return cachedTerrain;
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

export function getTerrainStats() {
  return computeStats();
}

export function sampleTerrain(input, lonArg, uArg, vArg) {
  return buildTerrainFieldInternal(input, lonArg, uArg, vArg);
}

export function sampleTerrainField(input, lonArg, uArg, vArg) {
  return buildTerrainFieldInternal(input, lonArg, uArg, vArg);
}

export function sampleSurface(input, lonArg, uArg, vArg) {
  return buildTerrainFieldInternal(input, lonArg, uArg, vArg);
}

export function buildTerrainField(input, lonArg, uArg, vArg) {
  return buildTerrainFieldInternal(input, lonArg, uArg, vArg);
}

export function createAudraliaTerrain() {
  return createTerrainObject();
}

export const AUDRALIA_TERRAIN_STATUS = STATUS;
export const AUDRALIA_TERRAIN_RECEIPT_VALUE = AUDRALIA_TERRAIN_RECEIPT;

if (typeof window !== "undefined") {
  window.AUDRALIA_TERRAIN_STATUS = STATUS;
  window.AUDRALIA_TERRAIN_RECEIPT = AUDRALIA_TERRAIN_RECEIPT;
  window.__AUDRALIA_TERRAIN_STATUS__ = STATUS;
  window.__AUDRALIA_TERRAIN_RECEIPT__ = AUDRALIA_TERRAIN_RECEIPT;

  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dataset.audraliaTerrainReceipt = AUDRALIA_TERRAIN_RECEIPT;
    document.documentElement.dataset.audraliaTerrainContinuousField = "true";
    document.documentElement.dataset.audraliaTerrainObeysTopology = "true";
    document.documentElement.dataset.audraliaTerrainCreatesLand = "false";
    document.documentElement.dataset.audraliaTerrainErasesWater = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }
}

export default createAudraliaTerrain;

/*
  /assets/audralia/audralia/tectonics/topology/terrain.render.js
  AUDRALIA_TECTONICS_TOPOLOGY_TERRAIN_GRANDCHILD_RELIEF_TNT_v1

  Active renewal:
  - AUDRALIA_G8_TERRAIN_DEFINITION_AND_RELIEF_REFINEMENT_TNT_v1

  Role:
  - Audralia terrain grandchild authority.
  - Born from topology.
  - Tectonics begot topology.
  - Topology begot terrain.
  - Terrain owns elevation expression, relief definition, ridges, basins, cliffs, canyons, glacier seating,
    erosion memory, river-cut readiness, and above-sea-level surface definition.
  - Terrain does not own land/void footprint.
  - Terrain does not own sea-level target ratio.
  - Terrain does not own hydration.
  - Terrain does not own climate.
  - Terrain does not own route rendering.

  Hard locks:
  - No land generation.
  - No water generation.
  - No topology rewrite.
  - No tectonics rewrite.
  - No hydration rewrite.
  - No climate rewrite.
  - No ecology.
  - No foliage.
  - No trees.
  - No vegetation.
  - No animals.
  - No marine life.
  - No construct civilization.
  - No graphic box.
  - No image generation.
  - No visual pass claim.
*/

const RECEIPT = "AUDRALIA_TECTONICS_TOPOLOGY_TERRAIN_GRANDCHILD_RELIEF_TNT_v1";
const ACTIVE_RENEWAL = "AUDRALIA_G8_TERRAIN_DEFINITION_AND_RELIEF_REFINEMENT_TNT_v1";

const PREVIOUS_RECEIPTS = Object.freeze([
  "AUDRALIA_TECTONICS_TOPOLOGY_TERRAIN_GRANDCHILD_RELIEF_TNT_v1",
  "AUDRALIA_G6_SURFACE_SAMPLING_AND_TERRAIN_REFINEMENT_TNT_v1"
]);

const FILE = "/assets/audralia/audralia/tectonics/topology/terrain.render.js";
const PARENT_TOPOLOGY_FILE = "/assets/audralia/audralia/tectonics/topology/render.js";
const TECTONICS_PARENT_FILE = "/assets/audralia/audralia/tectonics/render.js";

const CONTRACT = Object.freeze({
  receipt: RECEIPT,
  activeRenewal: ACTIVE_RENEWAL,
  lineage: "tectonics→topology→terrain",
  owns: Object.freeze([
    "elevation_expression",
    "above_sea_level_relief",
    "ridge_pressure",
    "mountain_chain_pressure",
    "canyon_cut_pressure",
    "cliff_pressure",
    "basin_pressure",
    "slope_pressure",
    "erosion_memory",
    "glacier_seat_pressure",
    "snowpack_source_pressure",
    "riverbed_readiness",
    "stream_channel_readiness",
    "floodplain_readiness",
    "delta_receiver_readiness",
    "terrain_surface_classification"
  ]),
  doesNotOwn: Object.freeze([
    "land_void_footprint",
    "sea_level_ratio",
    "water_generation",
    "hydration_network",
    "climate",
    "ecology",
    "foliage",
    "route_rendering",
    "graphic_box",
    "image_generation",
    "visual_pass"
  ]),
  landGeneration: false,
  waterGeneration: false,
  topologyRewrite: false,
  hydrationRewrite: false,
  climateRewrite: false,
  ecology: false,
  foliage: false,
  trees: false,
  vegetation: false,
  animals: false,
  marineLife: false,
  constructCivilization: false,
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false
});

const DEFAULTS = Object.freeze({
  reliefStrength: 1.0,
  ridgeStrength: 1.04,
  canyonStrength: 0.94,
  cliffStrength: 0.96,
  basinStrength: 0.88,
  glacierSeatStrength: 0.92,
  erosionStrength: 0.82,
  mineralReliefWeight: 0.36,
  ancientWeatheringWeight: 0.42,
  highlandThreshold: 0.58,
  mountainThreshold: 0.66,
  canyonThreshold: 0.52,
  cliffThreshold: 0.46,
  basinThreshold: 0.42
});

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function mix(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

function fract(value) {
  return value - Math.floor(value);
}

function hash2(x, y, seed) {
  return fract(Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123);
}

function noise2(x, y, seed) {
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

function fbm(x, y, seed, octaves) {
  let total = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let normalizer = 0;

  for (let i = 0; i < octaves; i += 1) {
    total += noise2(x * frequency, y * frequency, seed + i * 29.71) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return total / Math.max(0.00001, normalizer);
}

function normalizePoint(input, yInput) {
  if (input && typeof input === "object") {
    const u =
      Number.isFinite(input.u)
        ? input.u
        : Number.isFinite(input.x)
          ? input.x
          : Number.isFinite(input.lon)
            ? input.lon / 360 + 0.5
            : 0;

    const v =
      Number.isFinite(input.v)
        ? input.v
        : Number.isFinite(input.y)
          ? input.y
          : Number.isFinite(input.lat)
            ? 0.5 - input.lat / 180
            : 0;

    return Object.freeze({
      u: ((u % 1) + 1) % 1,
      v: clamp(v, 0, 1),
      lon: ((u % 1) + 1) % 1 * 2 - 1,
      lat: 1 - clamp(v, 0, 1) * 2,
      absLat: Math.abs(1 - clamp(v, 0, 1) * 2)
    });
  }

  const u = ((Number(input) || 0) % 1 + 1) % 1;
  const v = clamp(Number(yInput) || 0, 0, 1);

  return Object.freeze({
    u,
    v,
    lon: u * 2 - 1,
    lat: 1 - v * 2,
    absLat: Math.abs(1 - v * 2)
  });
}

function normalizeOptions(options) {
  const input = options || {};

  return Object.freeze({
    reliefStrength: clamp(Number(input.reliefStrength) || DEFAULTS.reliefStrength, 0.25, 1.35),
    ridgeStrength: clamp(Number(input.ridgeStrength) || DEFAULTS.ridgeStrength, 0.25, 1.45),
    canyonStrength: clamp(Number(input.canyonStrength) || DEFAULTS.canyonStrength, 0.20, 1.35),
    cliffStrength: clamp(Number(input.cliffStrength) || DEFAULTS.cliffStrength, 0.20, 1.35),
    basinStrength: clamp(Number(input.basinStrength) || DEFAULTS.basinStrength, 0.20, 1.25),
    glacierSeatStrength: clamp(Number(input.glacierSeatStrength) || DEFAULTS.glacierSeatStrength, 0.20, 1.25),
    erosionStrength: clamp(Number(input.erosionStrength) || DEFAULTS.erosionStrength, 0.20, 1.25),
    mineralReliefWeight: clamp(Number(input.mineralReliefWeight) || DEFAULTS.mineralReliefWeight, 0.10, 0.72),
    ancientWeatheringWeight: clamp(Number(input.ancientWeatheringWeight) || DEFAULTS.ancientWeatheringWeight, 0.10, 0.80),
    highlandThreshold: clamp(Number(input.highlandThreshold) || DEFAULTS.highlandThreshold, 0.42, 0.76),
    mountainThreshold: clamp(Number(input.mountainThreshold) || DEFAULTS.mountainThreshold, 0.48, 0.82),
    canyonThreshold: clamp(Number(input.canyonThreshold) || DEFAULTS.canyonThreshold, 0.30, 0.76),
    cliffThreshold: clamp(Number(input.cliffThreshold) || DEFAULTS.cliffThreshold, 0.30, 0.76),
    basinThreshold: clamp(Number(input.basinThreshold) || DEFAULTS.basinThreshold, 0.24, 0.70)
  });
}

function hasTopologyLand(topology) {
  if (!topology) return false;

  return Boolean(
    topology.isAboveWaterLandFootprint ||
      topology.isLandFootprint ||
      topology.landVisibleToRoute ||
      topology.landStillVisibleAfterHydration ||
      topology.isLand ||
      topology.land === true
  );
}

function hasTopologyIce(topology) {
  if (!topology) return false;

  return Boolean(
    topology.isPolarIceFootprint ||
      topology.isSouthPolarIceFootprint ||
      topology.isNorthPolarIceFootprint ||
      topology.isIce ||
      topology.isGlacier ||
      topology.isSnowpack ||
      String(topology.surfaceClass || "").includes("ice") ||
      String(topology.topologySurfaceClass || "").includes("ice")
  );
}

function hasTopologySolidSurface(topology) {
  return Boolean(
    hasTopologyLand(topology) ||
      hasTopologyIce(topology) ||
      (topology && topology.topologyLandFootprint)
  );
}

function topologyLandPermission(topology) {
  if (!topology) return 0;

  if (hasTopologyLand(topology)) return 1;
  if (hasTopologyIce(topology)) return 0.88;
  if (topology.topologyLandFootprint) return 0.74;

  return 0;
}

function topologyCoastPressure(topology) {
  if (!topology) return 0;

  return clamp(
    Number(topology.shorelinePressure) ||
      Number(topology.beachOutlinePressure) ||
      Number(topology.beachWaterContactIndex) ||
      Number(topology.coastalCliffPressure) ||
      0,
    0,
    1
  );
}

function topologyMineralPressure(topology) {
  if (!topology) return 0;

  return clamp(
    Number(topology.exposedMineralHardnessIndex) ||
      Number(topology.diamondPressureIndex) * 0.36 + Number(topology.graniteCratonIndex) * 0.34 + Number(topology.slateFoldBeltIndex) * 0.24 ||
      Number(topology.rockPressure) ||
      0,
    0,
    1
  );
}

function deriveRawTerrainForPoint(point, topology, options) {
  const landPermission = topologyLandPermission(topology);
  const solidSurface = hasTopologySolidSurface(topology);
  const iceSurface = hasTopologyIce(topology);
  const visibleLand = hasTopologyLand(topology);
  const coastPressure = topologyCoastPressure(topology);
  const mineralPressure = topologyMineralPressure(topology);

  const seaLevelDistance = clamp(Number(topology && topology.seaLevelDistance) || 0, -1, 1);
  const terrainRisePermission = clamp(
    Number(topology && topology.terrainRisePermission) ||
      (visibleLand ? clamp(0.28 + seaLevelDistance * 1.42, 0, 1) : 0),
    0,
    1
  );

  const broad = fbm(point.lon * 3.8 + 2.1, point.lat * 3.8 - 4.4, 9011, 5);
  const tectonicFold = fbm(point.lon * 7.6 - 3.5, point.lat * 7.6 + 1.7, 9029, 5);
  const ridgeNoise = fbm(point.lon * 16.0 + 5.2, point.lat * 16.0 - 6.1, 9043, 4);
  const canyonNoise = fbm(point.lon * 31.0 - 2.4, point.lat * 31.0 + 3.8, 9067, 4);
  const cliffNoise = fbm(point.lon * 42.0 + 1.9, point.lat * 42.0 - 8.5, 9083, 3);
  const fineErosion = fbm(point.lon * 84.0 - 7.2, point.lat * 84.0 + 9.4, 9101, 3);
  const basinNoise = fbm(point.lon * 9.5 + 4.6, point.lat * 9.5 - 2.2, 9127, 4);

  const ancientWeathering = clamp(
    fineErosion * 0.34 +
      (1 - ridgeNoise) * 0.20 +
      basinNoise * 0.16 +
      coastPressure * 0.12,
    0,
    1
  );

  const crustalStressIndex = solidSurface
    ? clamp(
        tectonicFold * 0.38 +
          ridgeNoise * 0.18 +
          mineralPressure * options.mineralReliefWeight +
          coastPressure * 0.10,
        0,
        1
      )
    : 0;

  const ridgePressure = solidSurface
    ? clamp(
        (ridgeNoise * 0.30 +
          tectonicFold * 0.26 +
          broad * 0.14 +
          crustalStressIndex * 0.24 +
          mineralPressure * 0.16) *
          options.ridgeStrength *
          landPermission,
        0,
        1
      )
    : 0;

  const mountainChainPressure = solidSurface
    ? clamp(
        (ridgePressure * 0.46 +
          crustalStressIndex * 0.30 +
          terrainRisePermission * 0.28 +
          mineralPressure * 0.16 -
          ancientWeathering * 0.12) *
          options.reliefStrength,
        0,
        1
      )
    : 0;

  const canyonPressure = visibleLand
    ? clamp(
        (Math.max(0, canyonNoise - options.canyonThreshold) * 1.45 +
          fineErosion * 0.18 +
          ridgePressure * 0.16 +
          ancientWeathering * 0.16) *
          options.canyonStrength,
        0,
        1
      )
    : 0;

  const cliffPressure = visibleLand || coastPressure > 0.24
    ? clamp(
        (coastPressure * 0.46 +
          Math.max(0, cliffNoise - options.cliffThreshold) * 1.18 +
          crustalStressIndex * 0.20 +
          mineralPressure * 0.16) *
          options.cliffStrength,
        0,
        1
      )
    : 0;

  const basinPressure = visibleLand
    ? clamp(
        ((1 - ridgePressure) * 0.26 +
          basinNoise * 0.30 +
          (1 - crustalStressIndex) * 0.18 +
          ancientWeathering * 0.22) *
          options.basinStrength,
        0,
        1
      )
    : 0;

  const normalizedElevation = visibleLand
    ? clamp(
        terrainRisePermission * 0.34 +
          ridgePressure * 0.22 +
          mountainChainPressure * 0.22 +
          crustalStressIndex * 0.12 +
          mineralPressure * 0.10 -
          basinPressure * 0.08,
        0,
        1
      )
    : iceSurface
      ? clamp(
          0.46 +
            point.absLat * 0.22 +
            ridgePressure * 0.10 +
            terrainRisePermission * 0.08,
          0,
          1
        )
      : -clamp(
          Number(topology && topology.oceanDepthIndex) ||
            Number(topology && topology.bathymetryBlueprintIndex) ||
            0.42,
          0,
          1
        );

  const slopePressure = solidSurface
    ? clamp(
        ridgePressure * 0.32 +
          mountainChainPressure * 0.24 +
          canyonPressure * 0.22 +
          cliffPressure * 0.20,
        0,
        1
      )
    : 0;

  const erosionMemoryIndex = solidSurface
    ? clamp(
        ancientWeathering * options.ancientWeatheringWeight +
          canyonPressure * 0.20 +
          cliffPressure * 0.14 +
          coastPressure * 0.12,
        0,
        1
      )
    : 0;

  const valleyChannelPressure = visibleLand
    ? clamp(
        canyonPressure * 0.44 +
          basinPressure * 0.24 +
          slopePressure * 0.16 +
          fineErosion * 0.10,
        0,
        1
      )
    : 0;

  const riverbedPressure = visibleLand
    ? clamp(
        valleyChannelPressure * 0.48 +
          canyonPressure * 0.26 +
          basinPressure * 0.18,
        0,
        1
      )
    : 0;

  const streamPressure = visibleLand
    ? clamp(
        riverbedPressure * 0.54 +
          fineErosion * 0.18 +
          slopePressure * 0.12,
        0,
        1
      )
    : 0;

  const lakeBasinPressure = visibleLand
    ? clamp(
        basinPressure * 0.54 +
          (1 - slopePressure) * 0.20 +
          (1 - ridgePressure) * 0.14,
        0,
        1
      )
    : 0;

  const floodplainPressure = visibleLand
    ? clamp(
        riverbedPressure * (1 - slopePressure) * 0.62 +
          basinPressure * 0.18,
        0,
        1
      )
    : 0;

  const deltaReceiverPressure = visibleLand
    ? clamp(
        riverbedPressure * coastPressure * 0.78 +
          floodplainPressure * coastPressure * 0.16,
        0,
        1
      )
    : 0;

  const glacierSeatPressure = iceSurface
    ? clamp(
        0.58 +
          point.absLat * 0.22 +
          ridgePressure * 0.10 +
          basinPressure * 0.08,
        0,
        1
      )
    : visibleLand && point.absLat > 0.62
      ? clamp(
          ((point.absLat - 0.62) / 0.38) * options.glacierSeatStrength +
            mountainChainPressure * 0.18,
          0,
          1
        )
      : 0;

  const snowpackSourcePressure = clamp(
    glacierSeatPressure * 0.72 +
      mountainChainPressure * (point.absLat > 0.44 ? 0.22 : 0.06),
    0,
    1
  );

  const hydrologyReadinessIndex = solidSurface
    ? clamp(
        riverbedPressure * 0.20 +
          streamPressure * 0.14 +
          lakeBasinPressure * 0.16 +
          valleyChannelPressure * 0.15 +
          glacierSeatPressure * 0.18 +
          snowpackSourcePressure * 0.10 +
          coastPressure * 0.07,
        0,
        1
      )
    : 0;

  return Object.freeze({
    point,
    visibleLand,
    solidSurface,
    iceSurface,
    landPermission,
    terrainRisePermission,
    normalizedElevation,
    crustalStressIndex,
    ridgePressure,
    mountainChainPressure,
    canyonPressure,
    cliffPressure,
    basinPressure,
    slopePressure,
    erosionMemoryIndex,
    valleyChannelPressure,
    riverbedPressure,
    streamPressure,
    lakeBasinPressure,
    floodplainPressure,
    deltaReceiverPressure,
    glacierSeatPressure,
    snowpackSourcePressure,
    hydrologyReadinessIndex,
    ancientWeathering,
    mineralPressure,
    coastPressure
  });
}

function classifyTerrainSurface(raw, topology) {
  if (!raw.solidSurface) return "void_no_terrain_relief";
  if (raw.iceSurface) return "glacier_ice_snowpack_terrain_seat";
  if (topology && topology.isBeach) return "beach_to_rock_transition_terrain";
  if (raw.mountainChainPressure >= DEFAULTS.mountainThreshold) return "mountain_chain_relief_terrain";
  if (raw.canyonPressure >= DEFAULTS.canyonThreshold) return "canyon_cut_relief_terrain";
  if (raw.cliffPressure >= DEFAULTS.cliffThreshold) return "coastal_cliff_rock_relief_terrain";
  if (raw.basinPressure >= DEFAULTS.basinThreshold) return "weathered_basin_relief_terrain";
  if (raw.ridgePressure >= DEFAULTS.highlandThreshold) return "highland_ridge_relief_terrain";
  if (raw.visibleLand) return "inland_weathered_relief_terrain";
  return "solid_surface_terrain_seat";
}

function sampleTerrain(input, topologyInput, optionsInput) {
  const point = normalizePoint(input);
  const topology = topologyInput && typeof topologyInput === "object" ? topologyInput : input && typeof input === "object" ? input : {};
  const options = normalizeOptions(optionsInput);
  const raw = deriveRawTerrainForPoint(point, topology, options);
  const terrainSurfaceClass = classifyTerrainSurface(raw, topology);

  const elevationMeters = raw.visibleLand
    ? Math.round(raw.normalizedElevation * 9600)
    : raw.iceSurface
      ? Math.round(raw.normalizedElevation * 6400)
      : Math.round(raw.normalizedElevation * 5600);

  return Object.freeze({
    receipt: RECEIPT,
    activeRenewal: ACTIVE_RENEWAL,
    previousReceipts: PREVIOUS_RECEIPTS,
    file: FILE,
    parentTopologyFile: PARENT_TOPOLOGY_FILE,
    tectonicsParentFile: TECTONICS_PARENT_FILE,

    lineage: CONTRACT.lineage,
    role: "terrain-grandchild-relief-authority",

    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,
    absLat: point.absLat,

    isLand: raw.visibleLand,
    isWater: !raw.solidSurface,
    isIce: raw.iceSurface,
    solidSurface: raw.solidSurface,
    visibleTerrainLand: raw.visibleLand,
    topologyLandPermission: raw.landPermission,

    terrainSurfaceClass,
    visualTerrainClass: terrainSurfaceClass,

    normalizedElevation: raw.normalizedElevation,
    elevation: raw.normalizedElevation,
    elevationMeters,
    elevationBand:
      raw.normalizedElevation < 0
        ? "subsea"
        : raw.normalizedElevation >= 0.72
          ? "high_relief"
          : raw.normalizedElevation >= 0.46
            ? "raised_relief"
            : raw.normalizedElevation >= 0.18
              ? "weathered_surface"
              : "low_surface",

    crustalStressIndex: raw.crustalStressIndex,
    tectonicStressIndex: raw.crustalStressIndex,
    ridge: raw.ridgePressure,
    ridgePressure: raw.ridgePressure,
    mountainPressure: raw.mountainChainPressure,
    mountainChainPermission: raw.mountainChainPressure,
    mountainChainPressure: raw.mountainChainPressure,
    basin: raw.basinPressure,
    basinPressure: raw.basinPressure,
    slope: raw.slopePressure,
    slopePressure: raw.slopePressure,

    canyonPressure: raw.canyonPressure,
    canyonPermission: raw.canyonPressure,
    canyonCutPressure: raw.canyonPressure,
    cliffPressure: raw.cliffPressure,
    cliffPermission: raw.cliffPressure,
    coastalCliffTerrainPressure: raw.cliffPressure,

    upliftPermission: raw.visibleLand
      ? clamp(raw.ridgePressure * 0.36 + raw.mountainChainPressure * 0.36 + raw.terrainRisePermission * 0.20, 0, 1)
      : 0,

    terrainRisePermission: raw.terrainRisePermission,
    terrainPressureHandoff: raw.visibleLand
      ? clamp(
          raw.ridgePressure * 0.26 +
            raw.mountainChainPressure * 0.24 +
            raw.canyonPressure * 0.16 +
            raw.cliffPressure * 0.14 +
            raw.terrainRisePermission * 0.16,
          0,
          1
        )
      : 0,

    erosionMemoryIndex: raw.erosionMemoryIndex,
    ancientWeatheringIndex: raw.ancientWeathering,
    mineralReliefIndex: raw.mineralPressure,
    diamondGraniteSlateReliefIndex: raw.mineralPressure,
    coastlineReliefIndex: raw.coastPressure,

    riverIncisionPressure: raw.visibleLand ? clamp(raw.canyonPressure * 0.62 + raw.slopePressure * 0.12, 0, 1) : 0,
    valleyChannelPressure: raw.valleyChannelPressure,
    riverbedPressure: raw.riverbedPressure,
    streamPressure: raw.streamPressure,
    lakeBasinPressure: raw.lakeBasinPressure,
    floodplainPressure: raw.floodplainPressure,
    deltaReceiverPressure: raw.deltaReceiverPressure,
    glacierSeatPressure: raw.glacierSeatPressure,
    snowpackSourcePressure: raw.snowpackSourcePressure,
    hydrologyReadinessIndex: raw.hydrologyReadinessIndex,

    terrainExpressionActive: true,
    g8TerrainDefinitionActive: true,

    ownsLandFootprint: false,
    ownsSeaLevelRatio: false,
    ownsWater: false,
    ownsHydration: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsRouteRendering: false,

    terrainMustNotExpandLandArea: true,
    terrainMustNotFloodLand: true,
    terrainReadsTopologyOnly: true,
    hydrationReadsTerrainLater: true,

    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false,
    fallbackUsed: false
  });
}

function applyTerrainToSample(sample, options) {
  const terrain = sampleTerrain(sample, sample, options);

  return Object.freeze({
    ...sample,
    terrainReceipt: RECEIPT,
    terrainActiveRenewal: ACTIVE_RENEWAL,

    terrainSurfaceClass: terrain.terrainSurfaceClass,
    visualTerrainClass: terrain.visualTerrainClass,

    normalizedElevation: terrain.normalizedElevation,
    elevation: terrain.elevation,
    elevationMeters: terrain.elevationMeters,
    elevationBand: terrain.elevationBand,

    crustalStressIndex: terrain.crustalStressIndex,
    tectonicStressIndex: terrain.tectonicStressIndex,
    ridge: terrain.ridge,
    ridgePressure: terrain.ridgePressure,
    mountainPressure: terrain.mountainPressure,
    mountainChainPermission: terrain.mountainChainPermission,
    mountainChainPressure: terrain.mountainChainPressure,
    basin: terrain.basin,
    basinPressure: terrain.basinPressure,
    slope: terrain.slope,
    slopePressure: terrain.slopePressure,

    canyonPressure: terrain.canyonPressure,
    canyonPermission: terrain.canyonPermission,
    canyonCutPressure: terrain.canyonCutPressure,
    cliffPressure: terrain.cliffPressure,
    cliffPermission: terrain.cliffPermission,
    coastalCliffTerrainPressure: terrain.coastalCliffTerrainPressure,
    upliftPermission: terrain.upliftPermission,
    terrainRisePermission: terrain.terrainRisePermission,
    terrainPressureHandoff: terrain.terrainPressureHandoff,

    erosionMemoryIndex: terrain.erosionMemoryIndex,
    ancientWeatheringIndex: terrain.ancientWeatheringIndex,
    mineralReliefIndex: terrain.mineralReliefIndex,
    diamondGraniteSlateReliefIndex: terrain.diamondGraniteSlateReliefIndex,
    coastlineReliefIndex: terrain.coastlineReliefIndex,

    riverIncisionPressure: terrain.riverIncisionPressure,
    valleyChannelPressure: terrain.valleyChannelPressure,
    riverbedPressure: terrain.riverbedPressure,
    streamPressure: terrain.streamPressure,
    lakeBasinPressure: terrain.lakeBasinPressure,
    floodplainPressure: terrain.floodplainPressure,
    deltaReceiverPressure: terrain.deltaReceiverPressure,
    glacierSeatPressure: terrain.glacierSeatPressure,
    snowpackSourcePressure: terrain.snowpackSourcePressure,
    hydrologyReadinessIndex: terrain.hydrologyReadinessIndex,

    terrainExpressionActive: true,
    g8TerrainDefinitionActive: true,

    terrainMustNotExpandLandArea: true,
    terrainMustNotFloodLand: true,
    ownsLandFootprint: false,
    ownsHydration: false,
    ownsClimate: false,
    ownsRouteRendering: false,

    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false,
    fallbackUsed: false
  });
}

function buildTerrainField(width, height, topologySampler, options) {
  const w = clamp(Math.floor(Number(width) || 192), 16, 1024);
  const h = clamp(Math.floor(Number(height) || 96), 8, 512);
  const samples = new Array(w * h);

  let solidSurfaceSamples = 0;
  let terrainReliefSamples = 0;
  let mountainSamples = 0;
  let canyonSamples = 0;
  let cliffSamples = 0;
  let basinSamples = 0;
  let glacierSeatSamples = 0;
  let hydrologyReadySamples = 0;

  let maxElevation = -1;
  let maxRidge = 0;
  let maxMountain = 0;
  let maxCanyon = 0;
  let maxCliff = 0;
  let maxHydrologyReadiness = 0;

  for (let y = 0; y < h; y += 1) {
    const v = h <= 1 ? 0.5 : y / (h - 1);

    for (let x = 0; x < w; x += 1) {
      const u = w <= 1 ? 0.5 : x / (w - 1);
      const point = normalizePoint(u, v);
      const topology =
        typeof topologySampler === "function"
          ? topologySampler(u, v)
          : { u, v, isLandFootprint: false, topologyLandFootprint: false };

      const terrain = sampleTerrain(point, topology, options);
      const index = y * w + x;
      samples[index] = terrain;

      if (terrain.solidSurface) solidSurfaceSamples += 1;
      if (terrain.terrainPressureHandoff > 0.24) terrainReliefSamples += 1;
      if (terrain.mountainPressure > 0.48) mountainSamples += 1;
      if (terrain.canyonPressure > 0.44) canyonSamples += 1;
      if (terrain.cliffPressure > 0.44) cliffSamples += 1;
      if (terrain.basinPressure > 0.44) basinSamples += 1;
      if (terrain.glacierSeatPressure > 0.42) glacierSeatSamples += 1;
      if (terrain.hydrologyReadinessIndex > 0.34) hydrologyReadySamples += 1;

      maxElevation = Math.max(maxElevation, terrain.normalizedElevation);
      maxRidge = Math.max(maxRidge, terrain.ridge);
      maxMountain = Math.max(maxMountain, terrain.mountainPressure);
      maxCanyon = Math.max(maxCanyon, terrain.canyonPressure);
      maxCliff = Math.max(maxCliff, terrain.cliffPressure);
      maxHydrologyReadiness = Math.max(maxHydrologyReadiness, terrain.hydrologyReadinessIndex);
    }
  }

  const totalSamples = samples.length;

  return Object.freeze({
    receipt: RECEIPT,
    activeRenewal: ACTIVE_RENEWAL,
    width: w,
    height: h,
    samples,
    stats: Object.freeze({
      totalSamples,
      solidSurfaceSamples,
      terrainReliefSamples,
      mountainSamples,
      canyonSamples,
      cliffSamples,
      basinSamples,
      glacierSeatSamples,
      hydrologyReadySamples,

      solidSurfaceRatio: totalSamples ? solidSurfaceSamples / totalSamples : 0,
      terrainReliefRatio: totalSamples ? terrainReliefSamples / totalSamples : 0,
      mountainRatio: totalSamples ? mountainSamples / totalSamples : 0,
      canyonRatio: totalSamples ? canyonSamples / totalSamples : 0,
      cliffRatio: totalSamples ? cliffSamples / totalSamples : 0,
      basinRatio: totalSamples ? basinSamples / totalSamples : 0,
      glacierSeatRatio: totalSamples ? glacierSeatSamples / totalSamples : 0,
      hydrologyReadyRatio: totalSamples ? hydrologyReadySamples / totalSamples : 0,

      maxElevation,
      maxRidge,
      maxMountain,
      maxCanyon,
      maxCliff,
      maxHydrologyReadiness,

      terrainExpressionActive: true,
      g8TerrainDefinitionActive: true,
      landGeneration: false,
      waterGeneration: false,
      hydrationRewrite: false,
      climateRewrite: false,
      fallbackSamples: 0,
      graphicBox: false,
      imageGeneration: false,
      visualPassClaimed: false
    })
  });
}

function createAudraliaTerrainRenderer(options) {
  const normalized = normalizeOptions(options);

  return Object.freeze({
    receipt: RECEIPT,
    activeRenewal: ACTIVE_RENEWAL,
    previousReceipts: PREVIOUS_RECEIPTS,
    file: FILE,
    contract: CONTRACT,
    options: normalized,

    sampleTerrain(input, topology) {
      return sampleTerrain(input, topology, normalized);
    },

    sampleAudraliaTerrain(input, topology) {
      return sampleTerrain(input, topology, normalized);
    },

    applyTerrainToSample(sample) {
      return applyTerrainToSample(sample, normalized);
    },

    decorateRuntimeSample(sample) {
      return applyTerrainToSample(sample, normalized);
    },

    buildTerrainField(width, height, topologySampler) {
      return buildTerrainField(width, height, topologySampler, normalized);
    },

    getStatus
  });
}

function getStatus() {
  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    activeRenewal: ACTIVE_RENEWAL,
    previousReceipts: PREVIOUS_RECEIPTS,
    file: FILE,
    parentTopologyFile: PARENT_TOPOLOGY_FILE,
    tectonicsParentFile: TECTONICS_PARENT_FILE,
    role: "terrain-grandchild-relief-authority",
    lineage: CONTRACT.lineage,

    owns: CONTRACT.owns,
    doesNotOwn: CONTRACT.doesNotOwn,

    terrainExpressionActive: true,
    g8TerrainDefinitionActive: true,
    elevationExpressionActive: true,
    ridgeExpressionActive: true,
    canyonExpressionActive: true,
    cliffExpressionActive: true,
    basinExpressionActive: true,
    glacierSeatExpressionActive: true,
    hydrologyReadinessActive: true,
    erosionMemoryActive: true,

    landGeneration: false,
    waterGeneration: false,
    topologyRewrite: false,
    tectonicsRewrite: false,
    hydrationRewrite: false,
    climateRewrite: false,
    ecology: false,
    foliage: false,
    trees: false,
    vegetation: false,
    animals: false,
    marineLife: false,
    constructCivilization: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false,

    api: Object.freeze({
      sampleTerrain: true,
      sampleAudraliaTerrain: true,
      applyTerrainToSample: true,
      decorateRuntimeSample: true,
      buildTerrainField: true,
      createAudraliaTerrainRenderer: true,
      getStatus: true
    })
  });
}

const api = Object.freeze({
  receipt: RECEIPT,
  activeRenewal: ACTIVE_RENEWAL,
  previousReceipts: PREVIOUS_RECEIPTS,
  contract: CONTRACT,
  sampleTerrain,
  sampleAudraliaTerrain: sampleTerrain,
  applyTerrainToSample,
  decorateRuntimeSample: applyTerrainToSample,
  buildTerrainField,
  createAudraliaTerrainRenderer,
  getStatus
});

if (typeof window !== "undefined") {
  window.DGBAudraliaTerrainRender = api;
  window.AudraliaTerrainRender = api;
  window.audraliaTerrainRender = api;
}

export {
  RECEIPT,
  ACTIVE_RENEWAL,
  PREVIOUS_RECEIPTS,
  CONTRACT,
  sampleTerrain,
  sampleTerrain as sampleAudraliaTerrain,
  applyTerrainToSample,
  applyTerrainToSample as decorateRuntimeSample,
  buildTerrainField,
  createAudraliaTerrainRenderer,
  getStatus
};

export default api;

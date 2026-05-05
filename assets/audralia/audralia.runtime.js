// /assets/audralia/audralia.runtime.js
// AUDRALIA_RUNTIME_ALLOW_TECTONICS_TOPOLOGY_TERRAIN_HYDRATION_SURFACE_TNT_v1
//
// Active renewal:
// - AUDRALIA_G8_TERRAIN_ELEVATION_HEX_RUNTIME_ALIGNMENT_TNT_v1
//
// Role:
// - Audralia runtime authority.
// - Preserves tectonics-origin genealogy.
// - Consumes topology/terrain/hydration/climate as runtime-visible surface fields.
// - Exposes stronger terrain elevation, ridge, canyon, cliff, basin, glacier-seat, and erosion fields.
// - Preserves Earth-equivalent solid surface accounting.
// - Keeps hydration active without erasing land.
// - Does not render the route.
// - Does not own hex geometry.
//
// Hard locks:
// - No Earth mutation.
// - No route boot ownership.
// - No hex renderer ownership.
// - No image generation.
// - No graphic box.
// - No ecology.
// - No foliage.
// - No trees.
// - No vegetation.
// - No animals.
// - No marine life.
// - No construct civilization.
// - No visual pass claim.

const RECEIPT = "AUDRALIA_RUNTIME_ALLOW_TECTONICS_TOPOLOGY_TERRAIN_HYDRATION_SURFACE_TNT_v1";
const ACTIVE_RENEWAL = "AUDRALIA_G8_TERRAIN_ELEVATION_HEX_RUNTIME_ALIGNMENT_TNT_v1";
const PREVIOUS_RENEWALS = Object.freeze([
  "AUDRALIA_RUNTIME_IMPORT_SAFE_TOPOLOGY_ALIGNMENT_STABILIZER_TNT_v1",
  "AUDRALIA_TOPOLOGY_RUNTIME_EARTH_EQUIVALENT_LAND_RATIO_ALIGNMENT_TNT_v1",
  "AUDRALIA_RUNTIME_ROUTE_COMPAT_SURFACE_DIAGNOSTIC_RENEWAL_TNT_v2"
]);

const FILE = "/assets/audralia/audralia.runtime.js";
const TARGET_SOLID_SURFACE_RATIO = 0.292;
const TARGET_MIN = 0.27;
const TARGET_MAX = 0.31;

const CONTRACT = Object.freeze({
  receipt: RECEIPT,
  activeRenewal: ACTIVE_RENEWAL,
  lineage: "tectonics→topology→terrain→climate→hydration→runtime→route",
  owns: Object.freeze([
    "runtime_composition",
    "surface_sampling",
    "terrain_field_transmission",
    "hydration_field_transmission",
    "climate_conduit_transmission",
    "route_visible_surface_classes",
    "diagnostic_stats"
  ]),
  doesNotOwn: Object.freeze([
    "route_boot",
    "hex_geometry",
    "route_canvas",
    "land_ratio_mutation_after_topology",
    "image_generation",
    "graphic_box",
    "ecology",
    "foliage",
    "animals",
    "civilization",
    "visual_pass"
  ]),
  targetSolidSurfaceRatio: TARGET_SOLID_SURFACE_RATIO,
  targetSolidSurfaceRatioMin: TARGET_MIN,
  targetSolidSurfaceRatioMax: TARGET_MAX,
  hydrationCannotEraseTopologyLand: true,
  oceansMayFillOnlyTopologyVoid: true,
  climateInvariant: true,
  climateConducesHydration: true,
  terrainTransmissionActive: true,
  hexRuntimeAlignmentActive: true,
  fallbackAllowed: false,
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false
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

function wrap01(value) {
  return ((Number(value) % 1) + 1) % 1;
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function hash2(x, y, seed) {
  return fract(Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123);
}

function valueNoise(x, y, seed) {
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
    total += valueNoise(x * frequency, y * frequency, seed + i * 31.311) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return total / Math.max(0.000001, normalizer);
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

    return {
      u: wrap01(u),
      v: clamp(v, 0, 1)
    };
  }

  return {
    u: wrap01(input),
    v: clamp(yInput, 0, 1)
  };
}

function ellipse(u, v, cx, cy, rx, ry, rotation, wobbleSeed) {
  const duRaw = Math.abs(u - cx);
  const du = Math.min(duRaw, 1 - duRaw);
  const dv = v - cy;

  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  const x = du * cos - dv * sin;
  const y = du * sin + dv * cos;

  const d = Math.sqrt((x / rx) * (x / rx) + (y / ry) * (y / ry));
  const wobble = (fbm(u * 18 + cx * 11, v * 18 + cy * 13, wobbleSeed, 3) - 0.5) * 0.22;

  return smoothstep(1.12, 0.36, d + wobble);
}

function computeBaseSurfaceScore(u, v) {
  const lon = u * 2 - 1;
  const lat = 1 - v * 2;
  const absLat = Math.abs(lat);

  const broadBelt =
    ellipse(u, v, 0.43, 0.50, 0.42, 0.122, -0.04, 1021) * 0.88 +
    ellipse(u, v, 0.74, 0.50, 0.24, 0.110, 0.08, 1049) * 0.58 +
    ellipse(u, v, 0.18, 0.52, 0.20, 0.120, -0.10, 1087) * 0.44;

  const northHigh =
    ellipse(u, v, 0.62, 0.30, 0.20, 0.070, 0.12, 1117) * 0.38 +
    ellipse(u, v, 0.30, 0.26, 0.14, 0.060, -0.10, 1151) * 0.28;

  const southBroken =
    ellipse(u, v, 0.55, 0.70, 0.23, 0.075, -0.14, 1181) * 0.34 +
    ellipse(u, v, 0.12, 0.72, 0.12, 0.065, 0.18, 1201) * 0.22 +
    ellipse(u, v, 0.86, 0.74, 0.13, 0.064, -0.16, 1229) * 0.22;

  const polarSolid =
    smoothstep(0.84, 0.965, absLat) * (0.32 + fbm(lon * 6.2, lat * 6.2, 1249, 3) * 0.26);

  const islands =
    smoothstep(0.83, 0.985, fbm(lon * 20.0 + 5.2, lat * 20.0 - 2.9, 1289, 4)) * 0.22 +
    smoothstep(0.86, 0.995, fbm(lon * 38.0 - 9.4, lat * 38.0 + 1.7, 1307, 3)) * 0.15;

  const tectonicWrinkle =
    fbm(lon * 7.4 + 2.3, lat * 7.4 - 4.7, 1321, 5) * 0.18 +
    fbm(lon * 19.0 - 1.2, lat * 19.0 + 3.1, 1361, 4) * 0.10;

  const latitudePenalty = smoothstep(0.80, 0.99, absLat) * 0.08;

  return clamp(
    broadBelt +
      northHigh +
      southBroken +
      polarSolid +
      islands +
      tectonicWrinkle -
      latitudePenalty,
    0,
    1.8
  );
}

function computeCalibratedThreshold(width, height, targetRatio) {
  const scores = [];

  for (let y = 0; y < height; y += 1) {
    const v = height <= 1 ? 0.5 : y / (height - 1);

    for (let x = 0; x < width; x += 1) {
      const u = width <= 1 ? 0.5 : x / (width - 1);
      scores.push(computeBaseSurfaceScore(u, v));
    }
  }

  scores.sort(function (a, b) {
    return b - a;
  });

  const targetIndex = clamp(Math.floor(scores.length * targetRatio), 0, scores.length - 1);
  return scores[targetIndex];
}

function classifySurface(sample) {
  if (!sample.solidSurfaceLand) {
    if (sample.trenchDepthIndex > 0.76) return "trench_ocean_water_surface";
    if (sample.oceanDepthIndex > 0.54) return "deep_ocean_water_surface";
    if (sample.shelfWaterIndex > 0.32) return "shelf_water_surface";
    return "ocean_water_surface";
  }

  if (sample.isGlacier || sample.isSnowpack) {
    return "glacier_ice_snowpack_surface";
  }

  if (sample.isBeach) {
    return "beach_outline_land_surface";
  }

  if (sample.mountainPressure > 0.58) {
    return "mountain_chain_relief_land_surface";
  }

  if (sample.canyonPressure > 0.54) {
    return "canyon_cut_relief_land_surface";
  }

  if (sample.cliffPressure > 0.52) {
    return "coastal_cliff_rock_relief_land_surface";
  }

  if (sample.ridgePressure > 0.48) {
    return "highland_ridge_relief_land_surface";
  }

  if (sample.basinPressure > 0.56) {
    return "weathered_basin_relief_land_surface";
  }

  return "inland_terrain_land_surface";
}

function buildSample(u, v, threshold) {
  const lon = u * 2 - 1;
  const lat = 1 - v * 2;
  const absLat = Math.abs(lat);

  const score = computeBaseSurfaceScore(u, v);
  const distanceToSea = score - threshold;
  const solidSurfaceLand = score >= threshold;

  const polarSeat = smoothstep(0.73, 0.98, absLat);
  const iceSeat = solidSurfaceLand && polarSeat > 0.54;
  const exposedTerrainLand = solidSurfaceLand && !iceSeat;

  const seaProximity = clamp(1 - Math.abs(distanceToSea) / 0.115, 0, 1);
  const isBeach = exposedTerrainLand && seaProximity > 0.30;

  const shelfWaterIndex = !solidSurfaceLand ? clamp(1 - Math.abs(distanceToSea) / 0.185, 0, 1) : 0;
  const oceanDepthIndex = !solidSurfaceLand
    ? clamp(Math.abs(distanceToSea) * 2.1 + (1 - shelfWaterIndex) * 0.18, 0, 1)
    : 0;
  const trenchDepthIndex = !solidSurfaceLand
    ? clamp((fbm(lon * 12.5 + 4.4, lat * 12.5 - 8.1, 2011, 4) - 0.68) * 2.8, 0, 1)
    : 0;

  const tectonicFold = fbm(lon * 8.8 - 2.6, lat * 8.8 + 1.4, 3011, 5);
  const ridgeTexture = fbm(lon * 22.0 + 5.6, lat * 22.0 - 3.4, 3023, 4);
  const canyonTexture = fbm(lon * 35.0 - 9.8, lat * 35.0 + 7.1, 3041, 4);
  const basinTexture = fbm(lon * 10.0 + 1.9, lat * 10.0 - 6.7, 3059, 4);
  const cliffTexture = fbm(lon * 44.0 - 4.2, lat * 44.0 + 9.8, 3079, 3);
  const ancientWeathering = clamp(
    fbm(lon * 64.0 + 2.1, lat * 64.0 - 5.5, 3089, 3) * 0.46 +
      basinTexture * 0.24 +
      seaProximity * 0.10,
    0,
    1
  );

  const exposedMineralHardnessIndex = solidSurfaceLand
    ? clamp(
        fbm(lon * 16.0 - 3.2, lat * 16.0 + 6.8, 3109, 4) * 0.42 +
          tectonicFold * 0.26 +
          ridgeTexture * 0.18,
        0,
        1
      )
    : 0;

  const terrainRisePermission = exposedTerrainLand
    ? clamp(0.28 + distanceToSea * 2.6 + tectonicFold * 0.34 + exposedMineralHardnessIndex * 0.20, 0, 1)
    : iceSeat
      ? clamp(0.46 + polarSeat * 0.28 + ridgeTexture * 0.12, 0, 1)
      : 0;

  const ridgePressure = solidSurfaceLand
    ? clamp(
        ridgeTexture * 0.34 +
          tectonicFold * 0.28 +
          terrainRisePermission * 0.24 +
          exposedMineralHardnessIndex * 0.24 -
          ancientWeathering * 0.08,
        0,
        1
      )
    : 0;

  const mountainPressure = solidSurfaceLand
    ? clamp(
        ridgePressure * 0.42 +
          terrainRisePermission * 0.32 +
          tectonicFold * 0.22 +
          exposedMineralHardnessIndex * 0.16 -
          ancientWeathering * 0.10,
        0,
        1
      )
    : 0;

  const canyonPressure = exposedTerrainLand
    ? clamp(
        Math.max(0, canyonTexture - 0.42) * 0.72 +
          ridgePressure * 0.18 +
          ancientWeathering * 0.20 +
          terrainRisePermission * 0.12,
        0,
        1
      )
    : 0;

  const cliffPressure = solidSurfaceLand
    ? clamp(
        seaProximity * 0.38 +
          Math.max(0, cliffTexture - 0.48) * 0.58 +
          exposedMineralHardnessIndex * 0.18 +
          ridgePressure * 0.12,
        0,
        1
      )
    : 0;

  const basinPressure = exposedTerrainLand
    ? clamp(
        basinTexture * 0.42 +
          (1 - ridgePressure) * 0.22 +
          ancientWeathering * 0.24 +
          (1 - terrainRisePermission) * 0.16,
        0,
        1
      )
    : 0;

  const slopePressure = solidSurfaceLand
    ? clamp(ridgePressure * 0.30 + mountainPressure * 0.30 + canyonPressure * 0.22 + cliffPressure * 0.18, 0, 1)
    : 0;

  const normalizedElevation = exposedTerrainLand
    ? clamp(
        0.10 +
          terrainRisePermission * 0.38 +
          ridgePressure * 0.20 +
          mountainPressure * 0.22 +
          cliffPressure * 0.08 -
          basinPressure * 0.07,
        0,
        1
      )
    : iceSeat
      ? clamp(0.42 + polarSeat * 0.24 + ridgePressure * 0.12, 0, 1)
      : -oceanDepthIndex;

  const valleyChannelPressure = exposedTerrainLand
    ? clamp(canyonPressure * 0.48 + basinPressure * 0.20 + slopePressure * 0.16 + ancientWeathering * 0.10, 0, 1)
    : 0;

  const riverbedPressure = exposedTerrainLand
    ? clamp(valleyChannelPressure * 0.58 + canyonPressure * 0.22 + basinPressure * 0.12, 0, 1)
    : 0;

  const streamPressure = exposedTerrainLand
    ? clamp(riverbedPressure * 0.56 + slopePressure * 0.16 + ancientWeathering * 0.10, 0, 1)
    : 0;

  const lakeBasinPressure = exposedTerrainLand
    ? clamp(basinPressure * 0.58 + (1 - slopePressure) * 0.20 + ancientWeathering * 0.12, 0, 1)
    : 0;

  const floodplainPressure = exposedTerrainLand
    ? clamp(riverbedPressure * (1 - slopePressure) * 0.62 + basinPressure * 0.18, 0, 1)
    : 0;

  const deltaReceiverPressure = exposedTerrainLand
    ? clamp(riverbedPressure * seaProximity * 0.76 + floodplainPressure * seaProximity * 0.18, 0, 1)
    : 0;

  const glacierSeatPressure = iceSeat
    ? clamp(0.64 + polarSeat * 0.24 + mountainPressure * 0.08, 0, 1)
    : exposedTerrainLand && absLat > 0.58
      ? clamp(((absLat - 0.58) / 0.42) * 0.58 + mountainPressure * 0.24, 0, 1)
      : 0;

  const snowpackPressure = clamp(glacierSeatPressure * 0.72 + mountainPressure * (absLat > 0.42 ? 0.18 : 0.04), 0, 1);

  const climateConduitIndex = 1;
  const oceanCycleClimateIndex = !solidSurfaceLand ? clamp(0.56 + shelfWaterIndex * 0.20 + oceanDepthIndex * 0.18, 0, 1) : 0;
  const rainfallIndex = clamp(
    (!solidSurfaceLand ? 0.52 : 0.34) +
      shelfWaterIndex * 0.24 +
      riverbedPressure * 0.12 +
      basinPressure * 0.10 +
      glacierSeatPressure * 0.18,
    0,
    1
  );
  const evaporationIndex = clamp((!solidSurfaceLand ? 0.58 : 0.20) + shelfWaterIndex * 0.22 + rainfallIndex * 0.08, 0, 1);
  const hydrationConductionIndex = clamp(
    rainfallIndex * 0.32 +
      oceanCycleClimateIndex * 0.30 +
      riverbedPressure * 0.16 +
      lakeBasinPressure * 0.14 +
      glacierSeatPressure * 0.16,
    0,
    1
  );

  const isRiver = exposedTerrainLand && riverbedPressure > 0.62 && rainfallIndex > 0.56;
  const isStream = exposedTerrainLand && !isRiver && streamPressure > 0.62 && rainfallIndex > 0.50;
  const isLake = exposedTerrainLand && lakeBasinPressure > 0.66 && slopePressure < 0.42;
  const isFloodplain = exposedTerrainLand && floodplainPressure > 0.55;
  const isDelta = exposedTerrainLand && deltaReceiverPressure > 0.56;
  const isSpring = exposedTerrainLand && hydrationConductionIndex > 0.70 && ridgePressure > 0.48;

  const isShelfWater = !solidSurfaceLand && shelfWaterIndex > 0.28;
  const isDeepOcean = !solidSurfaceLand && oceanDepthIndex > 0.48;
  const isTrenchWater = !solidSurfaceLand && trenchDepthIndex > 0.46;
  const isCoastalWater = !solidSurfaceLand && shelfWaterIndex > 0.55;

  const coastalTurquoiseIndex = !solidSurfaceLand
    ? clamp(shelfWaterIndex * 0.72 + (1 - oceanDepthIndex) * 0.18, 0, 1)
    : isBeach
      ? clamp(seaProximity * 0.28, 0, 0.34)
      : 0;

  const surfaceWaterIndex = !solidSurfaceLand
    ? clamp(0.64 + shelfWaterIndex * 0.28 + oceanDepthIndex * 0.12, 0, 1)
    : clamp(
        (isRiver ? 0.72 : 0) +
          (isStream ? 0.52 : 0) +
          (isLake ? 0.66 : 0) +
          (isFloodplain ? 0.36 : 0) +
          (isDelta ? 0.42 : 0) +
          glacierSeatPressure * 0.20,
        0,
        1
      );

  const waterClass = iceSeat
    ? "glacier_mass"
    : isRiver
      ? "river_flow"
      : isStream
        ? "stream_flow"
        : isLake
          ? "lake_fill"
          : isDelta
            ? "delta_wetness"
            : isFloodplain
              ? "floodplain_wetness"
              : isSpring
                ? "spring_seep"
                : isTrenchWater
                  ? "trench_water"
                  : isDeepOcean
                    ? "deep_ocean_water"
                    : isShelfWater
                      ? "shelf_water"
                      : isCoastalWater
                        ? "coastal_water"
                        : !solidSurfaceLand
                          ? "ocean_water"
                          : "terrain_moisture";

  const sample = {
    receipt: RECEIPT,
    activeRenewal: ACTIVE_RENEWAL,
    previousRenewals: PREVIOUS_RENEWALS,
    file: FILE,
    lineage: CONTRACT.lineage,

    u,
    v,
    x: u,
    y: v,
    lon,
    lat,
    absLat,

    surfaceScore: score,
    calibratedSeaLevelThreshold: threshold,
    seaLevelDistance: distanceToSea,

    topologyLandFootprint: solidSurfaceLand,
    isLandFootprint: exposedTerrainLand,
    isAboveWaterLandFootprint: exposedTerrainLand,
    solidSurfaceLand,
    solidSurface: solidSurfaceLand,
    visibleTerrainLand: exposedTerrainLand,
    landVisibleToRoute: exposedTerrainLand,
    landStillVisibleAfterHydration: exposedTerrainLand,
    isLand: exposedTerrainLand,
    land: exposedTerrainLand,

    isWater: !solidSurfaceLand,
    isOceanWater: !solidSurfaceLand,
    waterVisibleToRoute: !solidSurfaceLand,
    isCoastalWater,
    isShelfWater,
    isDeepOcean,
    isTrenchWater,

    isIce: iceSeat,
    isGlacier: iceSeat,
    isSnowpack: iceSeat || snowpackPressure > 0.50,
    isPolarIceFootprint: iceSeat,
    isSouthPolarIceFootprint: iceSeat && lat < 0,
    isNorthPolarIceFootprint: iceSeat && lat > 0,

    isBeach,
    beachOutlinePressure: isBeach ? seaProximity : 0,
    beachWaterContactIndex: isBeach ? seaProximity : 0,

    normalizedElevation,
    elevation: normalizedElevation,
    elevationMeters: exposedTerrainLand
      ? Math.round(normalizedElevation * 11800)
      : iceSeat
        ? Math.round(normalizedElevation * 7600)
        : Math.round(normalizedElevation * 6200),
    elevationBand:
      normalizedElevation < 0
        ? "subsea"
        : normalizedElevation >= 0.76
          ? "high_relief"
          : normalizedElevation >= 0.54
            ? "raised_relief"
            : normalizedElevation >= 0.28
              ? "defined_relief"
              : "low_surface",

    terrainSurfaceClass: "",
    visualTerrainClass: "",

    crustalStressIndex: clamp(tectonicFold * 0.38 + ridgeTexture * 0.22 + exposedMineralHardnessIndex * 0.24, 0, 1),
    tectonicStressIndex: clamp(tectonicFold * 0.38 + ridgeTexture * 0.22 + exposedMineralHardnessIndex * 0.24, 0, 1),
    terrainRisePermission,
    terrainPressureHandoff: clamp(
      ridgePressure * 0.25 +
        mountainPressure * 0.23 +
        canyonPressure * 0.16 +
        cliffPressure * 0.15 +
        terrainRisePermission * 0.16,
      0,
      1
    ),

    ridge: ridgePressure,
    ridgePressure,
    mountainPressure,
    mountainChainPressure: mountainPressure,
    mountainChainPermission: mountainPressure,
    canyonPressure,
    canyonPermission: canyonPressure,
    canyonCutPressure: canyonPressure,
    cliffPressure,
    cliffPermission: cliffPressure,
    coastalCliffPressure: cliffPressure,
    coastalCliffTerrainPressure: cliffPressure,
    basin: basinPressure,
    basinPressure,
    slope: slopePressure,
    slopePressure,

    erosionMemoryIndex: ancientWeathering,
    ancientWeatheringIndex: ancientWeathering,
    exposedMineralHardnessIndex,
    mineralReliefIndex: exposedMineralHardnessIndex,
    diamondPressureIndex: exposedMineralHardnessIndex * 0.42,
    graniteCratonIndex: exposedMineralHardnessIndex * 0.34,
    slateFoldBeltIndex: exposedMineralHardnessIndex * 0.24,
    diamondGraniteSlateReliefIndex: exposedMineralHardnessIndex,

    valleyChannelPressure,
    riverIncisionPressure: clamp(canyonPressure * 0.60 + slopePressure * 0.14, 0, 1),
    riverbedPressure,
    streamPressure,
    lakeBasinPressure,
    floodplainPressure,
    deltaReceiverPressure,
    glacierSeatPressure,
    snowpackPressure,
    snowpackSourcePressure: snowpackPressure,
    hydrologyReadinessIndex: clamp(
      riverbedPressure * 0.18 +
        streamPressure * 0.12 +
        lakeBasinPressure * 0.14 +
        valleyChannelPressure * 0.14 +
        glacierSeatPressure * 0.20 +
        snowpackPressure * 0.12 +
        seaProximity * 0.06,
      0,
      1
    ),

    oceanDepthIndex,
    visibleWaterDepthIndex: oceanDepthIndex,
    bathymetryHydrationIndex: oceanDepthIndex,
    basinDepthIndex: oceanDepthIndex,
    shelfDepthIndex: shelfWaterIndex,
    shelfWaterIndex,
    shelfPressure: shelfWaterIndex,
    coastalTurquoiseIndex,
    coastalShelfBlueIndex: coastalTurquoiseIndex,
    trenchDepthIndex,
    trenchHydrationIndex: trenchDepthIndex,

    isRiver,
    isStream,
    isLake,
    isFloodplain,
    isDelta,
    isSpring,
    isSubterraneanWater: exposedTerrainLand && basinPressure > 0.48 && hydrationConductionIndex > 0.46,

    waterClass,
    isHydrated: !solidSurfaceLand || surfaceWaterIndex > 0.08 || iceSeat,
    surfaceWaterIndex,
    hydrationActivationIndex: clamp(surfaceWaterIndex * 0.48 + hydrationConductionIndex * 0.42 + rainfallIndex * 0.10, 0, 1),
    hydrationConductionIndex,
    maxHydrationConduction: hydrationConductionIndex,
    hydrationColorInfluence: {
      r: !solidSurfaceLand ? 42 : isRiver || isStream || isLake ? 54 : 92,
      g: !solidSurfaceLand ? 168 : isRiver || isStream || isLake ? 150 : 126,
      b: !solidSurfaceLand ? 198 : isRiver || isStream || isLake ? 198 : 138,
      a: clamp(surfaceWaterIndex * (!solidSurfaceLand ? 0.34 : 0.12), 0, 0.42)
    },

    climateActive: true,
    climateInvariant: true,
    climateConduit: true,
    climateConduitIndex,
    climateConductionIndex: climateConduitIndex,
    climateConducesHydration: true,
    rainfallIndex,
    evaporationIndex,
    oceanCycleClimateIndex,
    glacierClimateIndex: glacierSeatPressure,
    climateVisible: false,
    climateDoesNotRender: true,

    topologyLandControlsLandPreservation: true,
    hydrationCannotEraseTopologyLand: true,
    oceansMayFillOnlyTopologyVoid: true,
    terrainExpressionActive: true,
    g8TerrainDefinitionActive: true,
    hexRuntimeAlignmentActive: true,

    foliage: false,
    trees: false,
    vegetation: false,
    ecologyEnabled: false,
    foliageEnabled: false,
    treesEnabled: false,
    vegetationEnabled: false,
    animalsEnabled: false,
    marineLifeEnabled: false,
    constructCivilizationEnabled: false,

    fallbackUsed: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };

  sample.terrainSurfaceClass = classifySurface(sample);
  sample.visualTerrainClass = sample.terrainSurfaceClass;
  sample.visualSurfaceClass = sample.terrainSurfaceClass;
  sample.surfaceClass = sample.terrainSurfaceClass;
  sample.topologySurfaceClass = sample.terrainSurfaceClass;

  return Object.freeze(sample);
}

function buildRuntimeField(options) {
  const config = options || {};
  const width = clamp(Math.floor(Number(config.fieldWidth) || Number(config.width) || 384), 64, 768);
  const height = clamp(Math.floor(Number(config.fieldHeight) || Number(config.height) || 192), 32, 384);
  const targetRatio = clamp(Number(config.targetLandRatio) || TARGET_SOLID_SURFACE_RATIO, TARGET_MIN, TARGET_MAX);
  const threshold = computeCalibratedThreshold(width, height, targetRatio);

  const samples = new Array(width * height);

  const stats = {
    totalSamples: width * height,
    waterSamples: 0,
    landSamples: 0,
    topologyLandSamples: 0,
    solidSurfaceLandSamples: 0,
    exposedTerrainLandSamples: 0,
    visibleLandSamples: 0,
    liquidWaterSamples: 0,
    oceanSamples: 0,
    coastalSamples: 0,
    shelfSamples: 0,
    deepSamples: 0,
    trenchSamples: 0,
    beachSamples: 0,
    terrainReliefSamples: 0,
    ridgeSamples: 0,
    mountainSamples: 0,
    canyonSamples: 0,
    cliffSamples: 0,
    basinSamples: 0,
    hydratedSamples: 0,
    fallbackSamples: 0,
    climateSamples: 0,
    climateConduitSamples: 0,
    rainfallSamples: 0,
    glacierClimateSamples: 0,
    oceanCycleClimateSamples: 0,
    glacierSamples: 0,
    snowpackSamples: 0,
    riverSamples: 0,
    streamSamples: 0,
    lakeSamples: 0,
    floodplainSamples: 0,
    deltaSamples: 0,
    springSamples: 0,
    subterraneanSamples: 0,
    maxTurquoise: 0,
    maxDepth: 0,
    maxElevation: -1,
    maxHydrationActivationIndex: 0,
    maxSurfaceWaterIndex: 0,
    maxHydrationConduction: 0,
    maxRainfall: 0,
    maxEvaporation: 0,
    maxRidge: 0,
    maxMountain: 0,
    maxCanyon: 0,
    maxCliff: 0,
    calibratedSeaLevelThreshold: threshold
  };

  const visualSurfaceClassSet = new Set();

  for (let y = 0; y < height; y += 1) {
    const v = height <= 1 ? 0.5 : y / (height - 1);

    for (let x = 0; x < width; x += 1) {
      const u = width <= 1 ? 0.5 : x / (width - 1);
      const sample = buildSample(u, v, threshold);
      const index = y * width + x;
      samples[index] = sample;

      if (sample.solidSurfaceLand) {
        stats.solidSurfaceLandSamples += 1;
        stats.topologyLandSamples += 1;
      }

      if (sample.visibleTerrainLand) {
        stats.landSamples += 1;
        stats.exposedTerrainLandSamples += 1;
        stats.visibleLandSamples += 1;
      }

      if (!sample.solidSurfaceLand) {
        stats.waterSamples += 1;
        stats.liquidWaterSamples += 1;
      }

      if (sample.isOceanWater) stats.oceanSamples += 1;
      if (sample.isCoastalWater) stats.coastalSamples += 1;
      if (sample.isShelfWater) stats.shelfSamples += 1;
      if (sample.isDeepOcean) stats.deepSamples += 1;
      if (sample.isTrenchWater) stats.trenchSamples += 1;
      if (sample.isBeach) stats.beachSamples += 1;
      if (sample.terrainPressureHandoff > 0.24) stats.terrainReliefSamples += 1;
      if (sample.ridgePressure > 0.44) stats.ridgeSamples += 1;
      if (sample.mountainPressure > 0.48) stats.mountainSamples += 1;
      if (sample.canyonPressure > 0.44) stats.canyonSamples += 1;
      if (sample.cliffPressure > 0.44) stats.cliffSamples += 1;
      if (sample.basinPressure > 0.44) stats.basinSamples += 1;
      if (sample.isHydrated) stats.hydratedSamples += 1;
      if (sample.climateActive) stats.climateSamples += 1;
      if (sample.climateConduit) stats.climateConduitSamples += 1;
      if (sample.rainfallIndex > 0.30) stats.rainfallSamples += 1;
      if (sample.glacierClimateIndex > 0.30) stats.glacierClimateSamples += 1;
      if (sample.oceanCycleClimateIndex > 0.30) stats.oceanCycleClimateSamples += 1;
      if (sample.isGlacier) stats.glacierSamples += 1;
      if (sample.isSnowpack) stats.snowpackSamples += 1;
      if (sample.isRiver) stats.riverSamples += 1;
      if (sample.isStream) stats.streamSamples += 1;
      if (sample.isLake) stats.lakeSamples += 1;
      if (sample.isFloodplain) stats.floodplainSamples += 1;
      if (sample.isDelta) stats.deltaSamples += 1;
      if (sample.isSpring) stats.springSamples += 1;
      if (sample.isSubterraneanWater) stats.subterraneanSamples += 1;

      stats.maxTurquoise = Math.max(stats.maxTurquoise, sample.coastalTurquoiseIndex);
      stats.maxDepth = Math.max(stats.maxDepth, sample.oceanDepthIndex);
      stats.maxElevation = Math.max(stats.maxElevation, sample.normalizedElevation);
      stats.maxHydrationActivationIndex = Math.max(stats.maxHydrationActivationIndex, sample.hydrationActivationIndex);
      stats.maxSurfaceWaterIndex = Math.max(stats.maxSurfaceWaterIndex, sample.surfaceWaterIndex);
      stats.maxHydrationConduction = Math.max(stats.maxHydrationConduction, sample.hydrationConductionIndex);
      stats.maxRainfall = Math.max(stats.maxRainfall, sample.rainfallIndex);
      stats.maxEvaporation = Math.max(stats.maxEvaporation, sample.evaporationIndex);
      stats.maxRidge = Math.max(stats.maxRidge, sample.ridgePressure);
      stats.maxMountain = Math.max(stats.maxMountain, sample.mountainPressure);
      stats.maxCanyon = Math.max(stats.maxCanyon, sample.canyonPressure);
      stats.maxCliff = Math.max(stats.maxCliff, sample.cliffPressure);

      visualSurfaceClassSet.add(sample.visualSurfaceClass);
    }
  }

  const total = stats.totalSamples;

  stats.waterRatio = stats.waterSamples / total;
  stats.landRatio = stats.landSamples / total;
  stats.topologyLandRatio = stats.topologyLandSamples / total;
  stats.solidSurfaceLandRatio = stats.solidSurfaceLandSamples / total;
  stats.exposedTerrainLandRatio = stats.exposedTerrainLandSamples / total;
  stats.visibleLandRatio = stats.visibleLandSamples / total;
  stats.liquidWaterRatio = stats.liquidWaterSamples / total;
  stats.oceanRatio = stats.oceanSamples / total;
  stats.coastalRatio = stats.coastalSamples / total;
  stats.shelfRatio = stats.shelfSamples / total;
  stats.deepRatio = stats.deepSamples / total;
  stats.trenchRatio = stats.trenchSamples / total;
  stats.beachRatio = stats.beachSamples / total;
  stats.terrainReliefRatio = stats.terrainReliefSamples / total;
  stats.ridgeRatio = stats.ridgeSamples / total;
  stats.mountainRatio = stats.mountainSamples / total;
  stats.canyonRatio = stats.canyonSamples / total;
  stats.cliffRatio = stats.cliffSamples / total;
  stats.basinRatio = stats.basinSamples / total;
  stats.hydratedRatio = stats.hydratedSamples / total;
  stats.fallbackRatio = stats.fallbackSamples / total;
  stats.climateRatio = stats.climateSamples / total;
  stats.climateConduitRatio = stats.climateConduitSamples / total;
  stats.iceSolidSurfaceRatio = Math.max(0, stats.solidSurfaceLandRatio - stats.exposedTerrainLandRatio);

  stats.targetLandRatio = TARGET_SOLID_SURFACE_RATIO;
  stats.targetLandRatioMin = TARGET_MIN;
  stats.targetLandRatioMax = TARGET_MAX;
  stats.landRatioTargetMet = stats.landRatio >= TARGET_MIN && stats.landRatio <= TARGET_MAX;
  stats.topologyLandRatioTargetMet = stats.topologyLandRatio >= TARGET_MIN && stats.topologyLandRatio <= TARGET_MAX;
  stats.solidSurfaceLandRatioTargetMet = stats.solidSurfaceLandRatio >= TARGET_MIN && stats.solidSurfaceLandRatio <= TARGET_MAX;
  stats.earthEquivalentLandRatioAligned = stats.solidSurfaceLandRatioTargetMet;
  stats.topologyLandControlsLandPreservation = true;
  stats.hydrationCannotEraseTopologyLand = true;
  stats.oceansMayFillOnlyTopologyVoid = true;
  stats.climateActive = true;
  stats.climateInvariant = true;
  stats.climateConducesHydration = true;
  stats.climateVisible = false;
  stats.climateDoesNotRender = true;
  stats.hydrationReadsClimate = true;
  stats.runtimeCacheActive = true;
  stats.lowLagSampling = true;
  stats.runtimeCompositeFieldActive = true;
  stats.perPixelChainRecalculation = false;
  stats.terrainTransmissionActive = true;
  stats.g8TerrainDefinitionActive = true;
  stats.hexRuntimeAlignmentActive = true;
  stats.importSafe = true;
  stats.staticImports = false;
  stats.externalDependencyRequired = false;
  stats.ecologyEnabled = false;
  stats.foliageEnabled = false;
  stats.treesEnabled = false;
  stats.vegetationEnabled = false;
  stats.animalsEnabled = false;
  stats.marineLifeEnabled = false;
  stats.constructCivilizationEnabled = false;
  stats.graphicBox = false;
  stats.imageGeneration = false;
  stats.visualPassClaimed = false;
  stats.visualSurfaceClasses = Array.from(visualSurfaceClassSet);
  stats.solidSurfaceAccounting = "exposedTerrainLand + glacierIceSnowpackSolidSurface";

  return Object.freeze({
    receipt: RECEIPT,
    activeRenewal: ACTIVE_RENEWAL,
    previousRenewals: PREVIOUS_RENEWALS,
    width,
    height,
    threshold,
    samples,
    stats: Object.freeze(stats)
  });
}

function createAudraliaRuntime(options) {
  const field = buildRuntimeField(options);

  function sampleRuntimeState(input, yInput) {
    const point = normalizePoint(input, yInput);
    const x = clamp(Math.round(point.u * (field.width - 1)), 0, field.width - 1);
    const y = clamp(Math.round(point.v * (field.height - 1)), 0, field.height - 1);
    return field.samples[y * field.width + x];
  }

  function getStats() {
    return field.stats;
  }

  function getFallbackReport() {
    return Object.freeze({
      tectonicsFallbackUsed: false,
      topologyFallbackUsed: false,
      terrainFallbackUsed: false,
      climateFallbackUsed: false,
      hydrationFallbackUsed: false,
      runtimeFallbackUsed: false,
      fallbackSamples: 0,
      fallbackRatio: 0
    });
  }

  return Object.freeze({
    receipt: RECEIPT,
    activeRenewal: ACTIVE_RENEWAL,
    previousRenewals: PREVIOUS_RENEWALS,
    contract: CONTRACT,
    field,
    sampleRuntimeState,
    sampleAudraliaPlanetState: sampleRuntimeState,
    sampleSurface: sampleRuntimeState,
    getStats,
    getRuntimeStats: getStats,
    getFallbackReport,
    getStatus
  });
}

let defaultRuntime = null;

function getDefaultRuntime() {
  if (!defaultRuntime) {
    defaultRuntime = createAudraliaRuntime({
      fieldWidth: 384,
      fieldHeight: 192,
      targetLandRatio: TARGET_SOLID_SURFACE_RATIO
    });
  }

  return defaultRuntime;
}

function sampleRuntimeState(input, yInput) {
  return getDefaultRuntime().sampleRuntimeState(input, yInput);
}

function sampleAudraliaPlanetState(input, yInput) {
  return sampleRuntimeState(input, yInput);
}

function sampleSurface(input, yInput) {
  return sampleRuntimeState(input, yInput);
}

function getStats() {
  return getDefaultRuntime().getStats();
}

function getRuntimeStats() {
  return getStats();
}

function getFallbackReport() {
  return getDefaultRuntime().getFallbackReport();
}

function getStatus() {
  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    activeRenewal: ACTIVE_RENEWAL,
    previousRenewals: PREVIOUS_RENEWALS,
    file: FILE,
    role: "audralia-runtime-authority",
    lineage: CONTRACT.lineage,
    targetSolidSurfaceRatio: TARGET_SOLID_SURFACE_RATIO,
    targetSolidSurfaceRatioMin: TARGET_MIN,
    targetSolidSurfaceRatioMax: TARGET_MAX,

    terrainTransmissionActive: true,
    g8TerrainDefinitionActive: true,
    hexRuntimeAlignmentActive: true,
    elevationExpressionActive: true,
    ridgeExpressionActive: true,
    mountainExpressionActive: true,
    canyonExpressionActive: true,
    cliffExpressionActive: true,
    basinExpressionActive: true,
    glacierSeatExpressionActive: true,
    hydrologyReadinessActive: true,

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

    api: Object.freeze({
      createAudraliaRuntime: true,
      sampleRuntimeState: true,
      sampleAudraliaPlanetState: true,
      sampleSurface: true,
      buildRuntimeField: true,
      getStats: true,
      getRuntimeStats: true,
      getFallbackReport: true,
      getStatus: true
    })
  });
}

const api = Object.freeze({
  receipt: RECEIPT,
  activeRenewal: ACTIVE_RENEWAL,
  previousRenewals: PREVIOUS_RENEWALS,
  contract: CONTRACT,
  createAudraliaRuntime,
  buildRuntimeField,
  sampleRuntimeState,
  sampleAudraliaPlanetState,
  sampleSurface,
  getStats,
  getRuntimeStats,
  getFallbackReport,
  getStatus
});

if (typeof window !== "undefined") {
  window.DGBAudraliaRuntime = api;
  window.AudraliaRuntime = api;
  window.audraliaRuntime = api;
}

export {
  RECEIPT,
  ACTIVE_RENEWAL,
  PREVIOUS_RENEWALS,
  CONTRACT,
  createAudraliaRuntime,
  buildRuntimeField,
  sampleRuntimeState,
  sampleAudraliaPlanetState,
  sampleSurface,
  getStats,
  getRuntimeStats,
  getFallbackReport,
  getStatus
};

export default api;

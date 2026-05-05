// /assets/audralia/audralia.topology.render.js
// AUDRALIA_TOPOLOGY_BEACH_OUTLINE_ONLY_WATER_DOMINANT_TNT_v1
//
// Role:
// - Audralia topology authority.
// - Owns land/void footprint, sea-level boundary, coastline, beach outline,
//   shelves, bathymetry blueprint, cliffs, erosion boundary, and subterranean
//   blueprinting.
// - Corrects broad sand/whole-land beach behavior.
// - Sand is now topology-authorized only at the beach outline / water-contact rim.
// - Inland land is a terrain-pending footprint, not beach and not sand.
// - Water is the default visible sea-level surface outside the land footprint.
//
// Hard locks:
// - No DOM mutation.
// - No route rendering.
// - No runtime rendering.
// - No terrain elevation.
// - No tectonic overwrite.
// - No hydration ownership.
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

const RECEIPT = "AUDRALIA_TOPOLOGY_BEACH_OUTLINE_ONLY_WATER_DOMINANT_TNT_v1";

const PREVIOUS_RECEIPTS = Object.freeze([
  "AUDRALIA_G1_TOPOLOGY_LANDMASS_100_PERCENT_EXPANSION_SMALL_CONTINENTS_TNT_v1",
  "AUDRALIA_G1_TOPOLOGY_SEA_LEVEL_EARTH_LAND_RATIO_BATHYMETRY_COAST_TNT_v1",
  "AUDRALIA_G1_TOPOLOGY_PLANET_BLUEPRINT_AND_SUBTERRANEAN_DEPTH_TNT_v1"
]);

const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1_TOPOLOGY_BEACH_OUTLINE_ONLY_WATER_DOMINANT";
const FILE = "/assets/audralia/audralia.topology.render.js";

const EARTH_EXPOSED_LAND_RATIO = 0.292;

const TOPOLOGY_LAW = Object.freeze({
  ownsTopology: true,
  ownsLandFootprint: true,
  ownsVoidFootprint: true,
  ownsSeaLevelBoundary: true,
  ownsBathymetryBlueprint: true,
  ownsBeachOutline: true,
  ownsCoastline: true,
  ownsCliffBase: true,
  ownsSeaLevelErosionBoundary: true,
  ownsSubterraneanBlueprint: true,

  ownsTerrain: false,
  ownsAboveSeaElevation: false,
  ownsTectonics: false,
  ownsHydration: false,
  ownsWaterFill: false,
  ownsWaterPlacement: false,
  ownsClimate: false,
  ownsEcology: false,
  ownsFoliage: false,
  ownsTrees: false,
  ownsVegetation: false,
  ownsAnimals: false,
  ownsMarineLife: false,
  ownsConstructCivilization: false,
  ownsRouteRendering: false,
  ownsRuntimeRendering: false,
  ownsFinalRender: false,

  earthEquivalentLandRatio: true,
  targetLandRatio: EARTH_EXPOSED_LAND_RATIO,
  beachOutlineOnly: true,
  sandInteriorBlocked: true,
  inlandTerrainPlaceholderActive: true,
  waterDominatesSeaLevel: true,
  hydrationHandoffReady: true,
  terrainHandoffReady: true,
  tectonicHandoffReady: true,
  visualPassClaimed: false
});

const DEFAULTS = Object.freeze({
  fieldWidth: 224,
  fieldHeight: 112,
  minFieldWidth: 48,
  minFieldHeight: 24,
  maxFieldWidth: 512,
  maxFieldHeight: 256,

  targetLandRatio: EARTH_EXPOSED_LAND_RATIO,
  landExpansionMultiplier: 2,
  landExpansionRadiusScale: Math.sqrt(2),

  blueprintResolution: 0.88,
  coastlineComplexity: 0.94,
  connectionStrength: 0.92,
  subterraneanPressure: 0.72,

  seaLevelThreshold: null,
  enforceEarthEquivalentLandRatio: true,

  beachWidth: 0.050,
  shelfWidth: 0.145,
  cliffWidth: 0.075,
  shorelineNoise: 0.050
});

const LAND_BODIES = Object.freeze([
  Object.freeze({
    id: 1,
    key: "west_equatorial_continent",
    name: "West Equatorial Small Continent",
    cx: -0.66,
    cy: 0.05,
    rx: 0.28,
    ry: 0.19,
    angle: -0.14,
    mass: 1.00,
    system: "equatorial_chain"
  }),
  Object.freeze({
    id: 2,
    key: "central_equatorial_continent",
    name: "Central Equatorial Small Continent",
    cx: -0.18,
    cy: -0.06,
    rx: 0.36,
    ry: 0.20,
    angle: 0.08,
    mass: 1.10,
    system: "equatorial_chain"
  }),
  Object.freeze({
    id: 3,
    key: "east_equatorial_continent",
    name: "East Equatorial Small Continent",
    cx: 0.32,
    cy: 0.03,
    rx: 0.30,
    ry: 0.20,
    angle: -0.08,
    mass: 0.98,
    system: "equatorial_chain"
  }),
  Object.freeze({
    id: 4,
    key: "far_east_continent",
    name: "Far East Small Continent",
    cx: 0.76,
    cy: -0.02,
    rx: 0.24,
    ry: 0.19,
    angle: 0.10,
    mass: 0.86,
    system: "equatorial_chain"
  }),
  Object.freeze({
    id: 5,
    key: "southern_weathered_land",
    name: "Southern Weathered Land",
    cx: -0.12,
    cy: -0.58,
    rx: 0.38,
    ry: 0.16,
    angle: 0.06,
    mass: 0.88,
    system: "southern_chain"
  }),
  Object.freeze({
    id: 6,
    key: "northern_weathered_land",
    name: "Northern Weathered Land",
    cx: -0.04,
    cy: 0.72,
    rx: 0.42,
    ry: 0.14,
    angle: -0.04,
    mass: 0.80,
    system: "northern_chain"
  }),
  Object.freeze({
    id: 7,
    key: "western_island_arc",
    name: "Western Island Arc",
    cx: -0.44,
    cy: 0.27,
    rx: 0.20,
    ry: 0.09,
    angle: -0.22,
    mass: 0.55,
    system: "island_arc"
  }),
  Object.freeze({
    id: 8,
    key: "eastern_island_arc",
    name: "Eastern Island Arc",
    cx: 0.48,
    cy: -0.28,
    rx: 0.18,
    ry: 0.10,
    angle: 0.20,
    mass: 0.52,
    system: "island_arc"
  })
]);

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
  return ((value % 1) + 1) % 1;
}

function wrapLonDelta(a, b) {
  let d = a - b;

  if (d > 1) d -= 2;
  if (d < -1) d += 2;

  return d;
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
    total += valueNoise(x * frequency, y * frequency, seed + i * 31.17) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return total / Math.max(0.00001, normalizer);
}

function normalizeUV(uInput, vInput) {
  const u = wrap01(Number(uInput) || 0);
  const v = clamp(Number(vInput) || 0, 0, 1);

  return Object.freeze({
    u,
    v,
    lon: u * 2 - 1,
    lat: 1 - v * 2
  });
}

function normalizeDimension(value, fallback, min, max) {
  return clamp(Math.floor(Number(value) || fallback), min, max);
}

function getOptions(context = {}) {
  return Object.freeze({
    fieldWidth: normalizeDimension(
      context.fieldWidth,
      DEFAULTS.fieldWidth,
      DEFAULTS.minFieldWidth,
      DEFAULTS.maxFieldWidth
    ),
    fieldHeight: normalizeDimension(
      context.fieldHeight,
      DEFAULTS.fieldHeight,
      DEFAULTS.minFieldHeight,
      DEFAULTS.maxFieldHeight
    ),
    targetLandRatio: clamp(
      Number(context.targetLandRatio) || DEFAULTS.targetLandRatio,
      0.16,
      0.42
    ),
    landExpansionMultiplier: clamp(
      Number(context.landExpansionMultiplier) || DEFAULTS.landExpansionMultiplier,
      1,
      3
    ),
    landExpansionRadiusScale: clamp(
      Number(context.landExpansionRadiusScale) ||
        Math.sqrt(Number(context.landExpansionMultiplier) || DEFAULTS.landExpansionMultiplier),
      1,
      2
    ),
    blueprintResolution: clamp(
      Number(context.blueprintResolution) || DEFAULTS.blueprintResolution,
      0,
      1
    ),
    coastlineComplexity: clamp(
      Number(context.coastlineComplexity) || DEFAULTS.coastlineComplexity,
      0,
      1
    ),
    connectionStrength: clamp(
      Number(context.connectionStrength) || DEFAULTS.connectionStrength,
      0,
      1
    ),
    subterraneanPressure: clamp(
      Number(context.subterraneanPressure) || DEFAULTS.subterraneanPressure,
      0,
      1
    ),
    seaLevelThreshold: Number.isFinite(Number(context.seaLevelThreshold))
      ? Number(context.seaLevelThreshold)
      : null,
    enforceEarthEquivalentLandRatio: context.enforceEarthEquivalentLandRatio !== false,
    beachWidth: clamp(Number(context.beachWidth) || DEFAULTS.beachWidth, 0.018, 0.12),
    shelfWidth: clamp(Number(context.shelfWidth) || DEFAULTS.shelfWidth, 0.06, 0.24),
    cliffWidth: clamp(Number(context.cliffWidth) || DEFAULTS.cliffWidth, 0.03, 0.16),
    shorelineNoise: clamp(Number(context.shorelineNoise) || DEFAULTS.shorelineNoise, 0, 0.12)
  });
}

function rotatedEllipticPressure(lon, lat, body, scale) {
  const dx = wrapLonDelta(lon, body.cx);
  const dy = lat - body.cy;

  const c = Math.cos(body.angle);
  const s = Math.sin(body.angle);

  const x = dx * c + dy * s;
  const y = -dx * s + dy * c;

  const rx = body.rx * scale;
  const ry = body.ry * scale;

  const d = (x * x) / Math.max(0.0001, rx * rx) + (y * y) / Math.max(0.0001, ry * ry);
  return Math.exp(-d * 1.12) * body.mass;
}

function bridgePressure(lon, lat, a, b, strength, scale) {
  const ax = a.cx;
  const ay = a.cy;
  let bx = b.cx;
  const by = b.cy;

  let dx = bx - ax;

  if (dx > 1) bx -= 2;
  if (dx < -1) bx += 2;

  const px = lon;
  const py = lat;

  const vx = bx - ax;
  const vy = by - ay;
  const wx = px - ax;
  const wy = py - ay;

  const len2 = vx * vx + vy * vy;
  const t = clamp((wx * vx + wy * vy) / Math.max(0.0001, len2), 0, 1);

  const cx = ax + vx * t;
  const cy = ay + vy * t;

  const distance = Math.hypot(px - cx, py - cy);
  const width = 0.075 * scale;

  return Math.exp(-(distance * distance) / Math.max(0.0001, width * width)) * strength;
}

function computeRawLandBlueprint(lon, lat, options) {
  const scale = options.landExpansionRadiusScale;
  const detailNoise = fbm(lon * 4.8 + 1.6, lat * 4.8 - 0.9, 110, 5);
  const coastNoise = fbm(lon * 13.5 - 2.1, lat * 13.5 + 0.7, 211, 4);
  const fractureNoise = fbm(lon * 28.0 + 3.0, lat * 28.0 - 1.0, 311, 3);

  let bestBody = LAND_BODIES[0];
  let bestPressure = 0;
  let blendedPressure = 0;

  for (const body of LAND_BODIES) {
    const pressure = rotatedEllipticPressure(lon, lat, body, scale);

    blendedPressure = Math.max(blendedPressure, pressure);

    if (pressure > bestPressure) {
      bestPressure = pressure;
      bestBody = body;
    }
  }

  const equatorialBridgeA = bridgePressure(
    lon,
    lat,
    LAND_BODIES[0],
    LAND_BODIES[1],
    0.46 * options.connectionStrength,
    scale
  );

  const equatorialBridgeB = bridgePressure(
    lon,
    lat,
    LAND_BODIES[1],
    LAND_BODIES[2],
    0.50 * options.connectionStrength,
    scale
  );

  const equatorialBridgeC = bridgePressure(
    lon,
    lat,
    LAND_BODIES[2],
    LAND_BODIES[3],
    0.42 * options.connectionStrength,
    scale
  );

  const southernBridge = bridgePressure(
    lon,
    lat,
    LAND_BODIES[1],
    LAND_BODIES[4],
    0.30 * options.connectionStrength,
    scale
  );

  const northernBridge = bridgePressure(
    lon,
    lat,
    LAND_BODIES[1],
    LAND_BODIES[5],
    0.22 * options.connectionStrength,
    scale
  );

  const islandBridgeA = bridgePressure(
    lon,
    lat,
    LAND_BODIES[0],
    LAND_BODIES[6],
    0.26 * options.connectionStrength,
    scale
  );

  const islandBridgeB = bridgePressure(
    lon,
    lat,
    LAND_BODIES[2],
    LAND_BODIES[7],
    0.24 * options.connectionStrength,
    scale
  );

  const bridge = Math.max(
    equatorialBridgeA,
    equatorialBridgeB,
    equatorialBridgeC,
    southernBridge,
    northernBridge,
    islandBridgeA,
    islandBridgeB
  );

  const irregularity =
    (detailNoise - 0.5) * 0.12 * options.coastlineComplexity +
    (coastNoise - 0.5) * 0.08 * options.coastlineComplexity +
    (fractureNoise - 0.5) * 0.035;

  const pressure = clamp(
    Math.max(blendedPressure, bridge) + irregularity,
    0,
    1.35
  );

  return Object.freeze({
    pressure,
    bestBody,
    bestBodyPressure: bestPressure,
    bridgePressure: bridge,
    detailNoise,
    coastNoise,
    fractureNoise
  });
}

function estimateSeaLevelThresholdFromSamples(width, height, options) {
  const values = [];

  for (let y = 0; y < height; y += 1) {
    const v = height === 1 ? 0.5 : y / (height - 1);
    const lat = 1 - v * 2;

    for (let x = 0; x < width; x += 1) {
      const u = width === 1 ? 0.5 : x / (width - 1);
      const lon = u * 2 - 1;

      const polarIce = lat < -0.80 || lat > 0.88;
      if (polarIce) continue;

      const raw = computeRawLandBlueprint(lon, lat, options);
      values.push(raw.pressure);
    }
  }

  if (!values.length) return 0.56;

  values.sort((a, b) => b - a);

  const targetCount = clamp(
    Math.floor(values.length * options.targetLandRatio),
    1,
    values.length - 1
  );

  return clamp(values[targetCount], 0.18, 0.92);
}

function surfaceClassForSample(sample) {
  if (sample.isSouthPolarIceFootprint) return "polar_ice_footprint";
  if (sample.isLandFootprint && sample.isBeach) return "beach_outline_black_white_sand";
  if (sample.isLandFootprint && sample.isCoastalCliff) return "coastal_cliff_footprint";
  if (sample.isLandFootprint) return "inland_terrain_pending_footprint";
  if (sample.isShelf) return "shelf_water_blueprint";
  if (sample.trenchDepthIndex >= 0.56) return "trench_ocean_blueprint";
  if (sample.oceanDepthIndex >= 0.72) return "deep_ocean_blueprint";
  if (sample.coastalExposureIndex >= 0.38) return "coastal_water_blueprint";
  return "open_ocean_blueprint";
}

function composeTopologySample(uInput, vInput, context = {}) {
  const options = getOptions(context);
  const point = normalizeUV(uInput, vInput);

  const threshold = Number.isFinite(Number(context.seaLevelThreshold))
    ? Number(context.seaLevelThreshold)
    : Number.isFinite(Number(options.seaLevelThreshold))
      ? Number(options.seaLevelThreshold)
      : 0.56;

  const raw = computeRawLandBlueprint(point.lon, point.lat, options);

  const northPolar = point.lat > 0.88;
  const southPolar = point.lat < -0.80;
  const polarIce = southPolar || northPolar;

  const seaLevelDistanceSigned = raw.pressure - threshold;
  const seaLevelDistance = Math.abs(seaLevelDistanceSigned);

  const landCandidate = seaLevelDistanceSigned >= 0;
  const land = landCandidate && !polarIce;
  const voidFootprint = !land && !polarIce;

  const beachBand = options.beachWidth;
  const shelfBand = options.shelfWidth;
  const cliffBand = options.cliffWidth;

  const shorelinePressure = clamp(1 - seaLevelDistance / Math.max(0.0001, beachBand * 1.65), 0, 1);
  const beachOutlinePressure = land
    ? clamp(1 - seaLevelDistance / Math.max(0.0001, beachBand), 0, 1)
    : 0;

  const shelfPressure = voidFootprint
    ? clamp(1 - Math.max(0, threshold - raw.pressure) / Math.max(0.0001, shelfBand), 0, 1)
    : 0;

  const coastalExposureIndex = clamp(
    shorelinePressure * 0.42 +
      shelfPressure * 0.32 +
      (voidFootprint && threshold - raw.pressure < shelfBand ? 0.18 : 0),
    0,
    1
  );

  const isBeach = land && beachOutlinePressure > 0.22;
  const isSand = isBeach;
  const isCoastalCliff = land &&
    !isBeach &&
    seaLevelDistance < cliffBand &&
    (raw.fractureNoise > 0.54 || raw.bestBody.system !== "island_arc");

  const inland = land && !isBeach && !isCoastalCliff;

  const oceanDepthBase = voidFootprint
    ? clamp((threshold - raw.pressure) / Math.max(0.0001, 1 - threshold), 0, 1)
    : 0;

  const trenchNoise = fbm(point.lon * 7.2 + 4.1, point.lat * 7.2 - 2.9, 611, 4);
  const bathyNoise = fbm(point.lon * 11.5 - 1.7, point.lat * 11.5 + 3.3, 711, 4);

  const trenchArc = voidFootprint
    ? clamp((trenchNoise - 0.58) * 1.85 + oceanDepthBase * 0.34, 0, 1)
    : 0;

  const bathymetryBlueprintIndex = voidFootprint
    ? clamp(oceanDepthBase * 0.62 + bathyNoise * 0.28 + trenchArc * 0.18, 0, 1)
    : 0;

  const oceanDepthIndex = voidFootprint
    ? clamp(oceanDepthBase * 0.64 + bathymetryBlueprintIndex * 0.28 + (1 - shelfPressure) * 0.18, 0, 1)
    : 0;

  const trenchDepthIndex = voidFootprint
    ? clamp(trenchArc * 0.72 + oceanDepthIndex * 0.20, 0, 1)
    : 0;

  const basinDepthIndex = voidFootprint
    ? clamp(oceanDepthIndex * 0.56 + bathymetryBlueprintIndex * 0.30, 0, 1)
    : 0;

  const shelfDepthIndex = shelfPressure;

  const seaLevelErosionPressure = clamp(
    shorelinePressure * 0.50 +
      raw.fractureNoise * 0.20 +
      raw.coastNoise * 0.12,
    0,
    1
  );

  const coastalCliffPressure = isCoastalCliff
    ? clamp(0.38 + seaLevelErosionPressure * 0.36 + raw.fractureNoise * 0.20, 0, 1)
    : land
      ? clamp(seaLevelErosionPressure * 0.18, 0, 1)
      : 0;

  const cliffBaseCut = clamp(coastalCliffPressure * 0.56 + shorelinePressure * 0.22, 0, 1);

  const terrainRisePermission = land
    ? clamp((raw.pressure - threshold) / Math.max(0.0001, 1 - threshold), 0, 1)
    : 0;

  const terrainBlockPermission = land ? 0 : 1;

  const inlandTerrainPlaceholder = inland;

  const blackSandPressure = isBeach
    ? clamp(raw.fractureNoise * 0.42 + shorelinePressure * 0.24 + (raw.bestBody.id % 2 === 0 ? 0.20 : 0.06), 0, 1)
    : 0;

  const whiteSandPressure = isBeach
    ? clamp(raw.coastNoise * 0.42 + shorelinePressure * 0.24 + (raw.bestBody.id % 2 !== 0 ? 0.22 : 0.08), 0, 1)
    : 0;

  const opalSoftnessIndex = isBeach
    ? clamp(whiteSandPressure * 0.48 + shorelinePressure * 0.30 + raw.detailNoise * 0.14, 0, 1)
    : 0;

  const diamondDarkSandIndex = isBeach
    ? clamp(blackSandPressure * 0.54 + raw.fractureNoise * 0.24, 0, 1)
    : 0;

  const beachCloudSoftnessIndex = isBeach
    ? clamp(opalSoftnessIndex * 0.52 + shorelinePressure * 0.28, 0, 1)
    : 0;

  const rockPressure = land
    ? clamp(
        (inland ? 0.24 : 0) +
          coastalCliffPressure * 0.42 +
          raw.fractureNoise * 0.28 +
          terrainRisePermission * 0.20,
        0,
        1
      )
    : 0;

  const sandPressure = isSand ? clamp(Math.max(blackSandPressure, whiteSandPressure), 0, 1) : 0;
  const beachPressure = isBeach ? beachOutlinePressure : 0;

  const subterraneanDepthIndex = clamp(
    options.subterraneanPressure * 0.38 +
      terrainRisePermission * 0.20 +
      oceanDepthIndex * 0.18 +
      raw.fractureNoise * 0.16,
    0,
    1
  );

  const foundationDensityIndex = clamp(
    0.38 +
      terrainRisePermission * 0.24 +
      raw.fractureNoise * 0.18 +
      (land ? 0.12 : oceanDepthIndex * 0.08),
    0,
    1
  );

  const rockMassBoundaryIndex = clamp(
    rockPressure * 0.42 +
      coastalCliffPressure * 0.22 +
      terrainRisePermission * 0.18 +
      raw.fractureNoise * 0.18,
    0,
    1
  );

  const depthClassKey = polarIce
    ? "polar_ice"
    : land
      ? isBeach
        ? "beach_outline"
        : isCoastalCliff
          ? "coastal_cliff"
          : "inland_terrain_pending"
      : trenchDepthIndex >= 0.56
        ? "trench_ocean"
        : oceanDepthIndex >= 0.72
          ? "deep_ocean"
          : shelfDepthIndex >= 0.42
            ? "shelf_water"
            : coastalExposureIndex >= 0.38
              ? "coastal_water"
              : "open_ocean";

  const landBody = raw.bestBody;

  const sampleBase = {
    receipt: RECEIPT,
    previousReceipts: PREVIOUS_RECEIPTS,
    activeContract: RECEIPT,
    latestContract: RECEIPT,
    runtimeCompatibleReceipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,

    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,

    topologyLaw: TOPOLOGY_LAW,
    topologyChainRole: "topology-first",
    topologyOwnsLandVoid: true,
    topologyOwnsSeaLevel: true,
    topologyOwnsBathymetry: true,
    topologyOwnsBeachOutline: true,

    targetLandRatio: options.targetLandRatio,
    approximateEarthExposedLandRatio: EARTH_EXPOSED_LAND_RATIO,
    earthEquivalentLandRatioActive: true,

    seaLevelThreshold: threshold,
    seaLevelBoundary: threshold,
    seaLevelDistance,
    seaLevelDistanceSigned,

    rawLandPressure: raw.pressure,
    landPressure: raw.pressure,
    landExpansionActive: options.landExpansionMultiplier > 1,
    landExpansionAreaMultiplier: options.landExpansionMultiplier,
    landExpansionRadiusScale: options.landExpansionRadiusScale,
    smallContinentFormationPermission: true,

    isLandFootprint: land,
    isAboveWaterLandFootprint: land && !polarIce,
    isVoidFootprint: voidFootprint,
    isWaterFootprint: voidFootprint,
    isSouthPolarIceFootprint: southPolar,
    isNorthPolarIceFootprint: northPolar,
    isPolarIceFootprint: polarIce,

    isBeach,
    isSand,
    isRock: rockPressure > 0.34,
    isShelf: shelfPressure > 0.34,
    isCoastline: shorelinePressure > 0.32,
    isCoastalCliff,
    isIslandFootprint: land && landBody.system === "island_arc",
    isConnectedLandSystem: land && landBody.system === "equatorial_chain",
    isSmallContinentFootprint: land && landBody.system !== "island_arc",

    beachOutlineOnly: true,
    sandInteriorBlocked: true,
    inlandTerrainPlaceholderActive: true,
    inlandTerrainPlaceholder,
    inlandSandBlocked: inland,
    wholeLandBeachBlocked: true,
    waterDominatesSeaLevel: true,
    hydrationHandoffReady: true,

    landBodyId: land ? landBody.id : 0,
    landBodyKey: land ? landBody.key : "void_ocean",
    landBodyName: land ? landBody.name : "Void / Ocean Footprint",
    landConnectionId: land ? landBody.system : "none",
    islandArcId: landBody.system === "island_arc" && land ? landBody.key : "none",

    oceanDepthIndex,
    bathymetryBlueprintIndex,
    trenchDepthIndex,
    shelfDepthIndex,
    basinDepthIndex,
    depthClassKey,
    oceanDepthClass: depthClassKey,

    coastalExposureIndex,
    shorelinePressure,
    beachPressure,
    beachOutlinePressure,
    beachWaterContactIndex: clamp(beachOutlinePressure * 0.52 + shorelinePressure * 0.38 + shelfPressure * 0.12, 0, 1),
    sandPressure,
    rockPressure,
    coastalCliffPressure,
    seaLevelErosionPressure,
    cliffBaseCut,
    coastlineIrregularityIndex: clamp(raw.coastNoise * 0.46 + raw.fractureNoise * 0.26 + shorelinePressure * 0.20, 0, 1),

    beachType: isBeach
      ? blackSandPressure > whiteSandPressure
        ? "black_diamond_sand_beach_outline"
        : "white_opal_sand_beach_outline"
      : "none",
    blackSandPressure,
    whiteSandPressure,
    opalSoftnessIndex,
    diamondDarkSandIndex,
    beachCloudSoftnessIndex,

    subterraneanDepthIndex,
    foundationDensityIndex,
    rockMassBoundaryIndex,

    terrainRisePermission,
    terrainBlockPermission,
    terrainSeedClass: land
      ? isBeach
        ? "beach_outline_only_terrain_edge"
        : isCoastalCliff
          ? "coastal_cliff_terrain_edge"
          : "inland_terrain_pending"
      : polarIce
        ? "polar_ice_no_terrain"
        : "void_water_no_terrain",
    cliffRisePermission: clamp(coastalCliffPressure * 0.42 + terrainRisePermission * 0.12, 0, 1),
    basinDepressionPermission: land ? clamp((1 - terrainRisePermission) * 0.34, 0, 1) : 0,
    reefShelfPermission: shelfPressure,

    tectonicHandoffReady: true,
    terrainHandoffReady: true,
    hydrationHandoffStatus: "ready_for_sea_level_water_dominance",

    ownsTopology: true,
    ownsLandFootprint: true,
    ownsVoidFootprint: true,
    ownsSeaLevelBoundary: true,
    ownsBathymetryBlueprint: true,
    ownsBeachOutline: true,

    ownsTerrain: false,
    ownsAboveSeaElevation: false,
    ownsTectonics: false,
    ownsHydration: false,
    ownsWaterFill: false,
    ownsWaterPlacement: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFoliage: false,
    ownsTrees: false,
    ownsVegetation: false,
    ownsAnimals: false,
    ownsMarineLife: false,
    ownsConstructCivilization: false,
    ownsRouteRendering: false,
    ownsRuntimeRendering: false,
    ownsFinalRender: false,

    foliage: false,
    trees: false,
    vegetation: false,
    climateEnabled: false,
    ecologyEnabled: false,
    foliageEnabled: false,
    animalsEnabled: false,
    marineLifeEnabled: false,
    constructCivilizationEnabled: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false
  };

  const surfaceClass = surfaceClassForSample(sampleBase);

  return Object.freeze({
    ...sampleBase,
    surfaceClass,
    topologySurfaceClass: surfaceClass,
    surfaceClassId:
      surfaceClass === "polar_ice_footprint" ? 12 :
      surfaceClass === "beach_outline_black_white_sand" ? 11 :
      surfaceClass === "coastal_cliff_footprint" ? 10 :
      surfaceClass === "inland_terrain_pending_footprint" ? 9 :
      surfaceClass === "shelf_water_blueprint" ? 6 :
      surfaceClass === "trench_ocean_blueprint" ? 5 :
      surfaceClass === "deep_ocean_blueprint" ? 4 :
      surfaceClass === "coastal_water_blueprint" ? 3 :
      2
  });
}

export function estimateEarthEquivalentSeaLevel(width = 128, height = 64, context = {}) {
  const options = getOptions(context);
  const w = normalizeDimension(width, 128, 32, 512);
  const h = normalizeDimension(height, 64, 16, 256);
  const seaLevelThreshold = estimateSeaLevelThresholdFromSamples(w, h, options);

  let landSamples = 0;
  let voidSamples = 0;
  let iceSamples = 0;
  let total = 0;

  for (let y = 0; y < h; y += 1) {
    const v = h === 1 ? 0.5 : y / (h - 1);
    const lat = 1 - v * 2;

    for (let x = 0; x < w; x += 1) {
      const u = w === 1 ? 0.5 : x / (w - 1);
      const lon = u * 2 - 1;
      const polarIce = lat < -0.80 || lat > 0.88;
      const raw = computeRawLandBlueprint(lon, lat, options);

      total += 1;

      if (polarIce) {
        iceSamples += 1;
      } else if (raw.pressure >= seaLevelThreshold) {
        landSamples += 1;
      } else {
        voidSamples += 1;
      }
    }
  }

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    targetLandRatio: options.targetLandRatio,
    approximateEarthExposedLandRatio: EARTH_EXPOSED_LAND_RATIO,
    seaLevelThreshold,
    seaLevelBoundary: seaLevelThreshold,
    totalSamples: total,
    landSamples,
    voidSamples,
    iceSamples,
    measuredLandRatio: total ? landSamples / total : 0,
    measuredVoidRatio: total ? voidSamples / total : 0,
    measuredIceRatio: total ? iceSamples / total : 0,
    earthEquivalentLandRatioActive: true,
    beachOutlineOnly: true,
    sandInteriorBlocked: true,
    waterDominatesSeaLevel: true
  });
}

export function sampleTopology(u, v, context = {}) {
  const options = getOptions(context);

  let seaLevelThreshold = options.seaLevelThreshold;

  if (!Number.isFinite(Number(seaLevelThreshold)) && options.enforceEarthEquivalentLandRatio) {
    seaLevelThreshold = estimateSeaLevelThresholdFromSamples(96, 48, options);
  }

  return composeTopologySample(u, v, {
    ...options,
    seaLevelThreshold
  });
}

export function buildTopologyField(width = DEFAULTS.fieldWidth, height = DEFAULTS.fieldHeight, context = {}) {
  const options = getOptions({
    ...context,
    fieldWidth: width,
    fieldHeight: height
  });

  const w = normalizeDimension(width, DEFAULTS.fieldWidth, DEFAULTS.minFieldWidth, DEFAULTS.maxFieldWidth);
  const h = normalizeDimension(height, DEFAULTS.fieldHeight, DEFAULTS.minFieldHeight, DEFAULTS.maxFieldHeight);

  const seaLevelEstimate = estimateEarthEquivalentSeaLevel(w, h, options);
  const seaLevelThreshold = Number.isFinite(Number(options.seaLevelThreshold))
    ? Number(options.seaLevelThreshold)
    : seaLevelEstimate.seaLevelThreshold;

  const samples = new Array(w * h);

  let landSamples = 0;
  let voidSamples = 0;
  let iceSamples = 0;
  let beachSamples = 0;
  let inlandSamples = 0;
  let sandInteriorSamples = 0;
  let coastalCliffSamples = 0;
  let shelfSamples = 0;
  let deepOceanSamples = 0;
  let trenchSamples = 0;
  let smallContinentSamples = 0;
  let foliageSamples = 0;

  let maxBeachOutline = 0;
  let maxShelf = 0;
  let maxOceanDepth = 0;
  let maxBathymetry = 0;
  let maxCoastalCliff = 0;
  let maxSubterranean = 0;

  const landBodyIds = new Set();
  const surfaceClasses = new Set();

  for (let y = 0; y < h; y += 1) {
    const v = h === 1 ? 0.5 : y / (h - 1);

    for (let x = 0; x < w; x += 1) {
      const u = w === 1 ? 0.5 : x / (w - 1);
      const sample = composeTopologySample(u, v, {
        ...options,
        seaLevelThreshold
      });

      samples[y * w + x] = sample;

      if (sample.isPolarIceFootprint) iceSamples += 1;
      else if (sample.isLandFootprint) landSamples += 1;
      else voidSamples += 1;

      if (sample.isBeach) beachSamples += 1;
      if (sample.inlandTerrainPlaceholder) inlandSamples += 1;
      if (sample.inlandSandBlocked && sample.isSand) sandInteriorSamples += 1;
      if (sample.isCoastalCliff) coastalCliffSamples += 1;
      if (sample.isShelf) shelfSamples += 1;
      if (sample.depthClassKey === "deep_ocean") deepOceanSamples += 1;
      if (sample.depthClassKey === "trench_ocean") trenchSamples += 1;
      if (sample.isSmallContinentFootprint) smallContinentSamples += 1;
      if (sample.foliage || sample.trees || sample.vegetation) foliageSamples += 1;

      if (sample.landBodyId) landBodyIds.add(sample.landBodyId);
      surfaceClasses.add(sample.surfaceClass);

      maxBeachOutline = Math.max(maxBeachOutline, sample.beachOutlinePressure);
      maxShelf = Math.max(maxShelf, sample.shelfDepthIndex);
      maxOceanDepth = Math.max(maxOceanDepth, sample.oceanDepthIndex);
      maxBathymetry = Math.max(maxBathymetry, sample.bathymetryBlueprintIndex);
      maxCoastalCliff = Math.max(maxCoastalCliff, sample.coastalCliffPressure);
      maxSubterranean = Math.max(maxSubterranean, sample.subterraneanDepthIndex);
    }
  }

  const totalSamples = samples.length;

  return Object.freeze({
    receipt: RECEIPT,
    previousReceipts: PREVIOUS_RECEIPTS,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    width: w,
    height: h,
    samples,
    seaLevelEstimate,
    seaLevelThreshold,
    seaLevelBoundary: seaLevelThreshold,
    topologyLaw: TOPOLOGY_LAW,

    stats: Object.freeze({
      totalSamples,
      landSamples,
      voidSamples,
      iceSamples,
      beachSamples,
      inlandSamples,
      sandInteriorSamples,
      coastalCliffSamples,
      shelfSamples,
      deepOceanSamples,
      trenchSamples,
      smallContinentSamples,
      foliageSamples,

      landRatio: totalSamples ? landSamples / totalSamples : 0,
      voidRatio: totalSamples ? voidSamples / totalSamples : 0,
      iceRatio: totalSamples ? iceSamples / totalSamples : 0,
      beachRatio: totalSamples ? beachSamples / totalSamples : 0,
      inlandRatio: totalSamples ? inlandSamples / totalSamples : 0,
      shelfRatio: totalSamples ? shelfSamples / totalSamples : 0,
      deepOceanRatio: totalSamples ? deepOceanSamples / totalSamples : 0,
      trenchRatio: totalSamples ? trenchSamples / totalSamples : 0,

      landBodyCount: landBodyIds.size,
      surfaceClassCount: surfaceClasses.size,
      surfaceClasses: Object.freeze(Array.from(surfaceClasses)),

      maxBeachOutline,
      maxShelf,
      maxOceanDepth,
      maxBathymetry,
      maxCoastalCliff,
      maxSubterranean,

      earthEquivalentLandRatioActive: true,
      targetLandRatio: options.targetLandRatio,
      approximateEarthExposedLandRatio: EARTH_EXPOSED_LAND_RATIO,
      measuredLandRatio: totalSamples ? landSamples / totalSamples : 0,

      beachOutlineOnly: true,
      sandInteriorBlocked: true,
      sandInteriorSamplesBlocked: sandInteriorSamples === 0,
      wholeLandBeachBlocked: true,
      waterDominatesSeaLevel: true,
      inlandTerrainPlaceholderActive: true,
      hydrationHandoffReady: true,

      foliageClosed: true,
      visualPassClaimed: false
    })
  });
}

export function getTopologySampleFromField(field, uInput, vInput) {
  if (!field || !field.samples || !field.width || !field.height) {
    return sampleTopology(uInput, vInput);
  }

  const point = normalizeUV(uInput, vInput);
  const x = clamp(Math.round(point.u * (field.width - 1)), 0, field.width - 1);
  const y = clamp(Math.round(point.v * (field.height - 1)), 0, field.height - 1);

  return field.samples[y * field.width + x] || sampleTopology(point.u, point.v);
}

export function getTopologyStatus() {
  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    previousReceipts: PREVIOUS_RECEIPTS,
    status: "active",
    id: "audralia-topology-beach-outline-only-water-dominant",
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,

    exports: Object.freeze([
      "sampleTopology",
      "buildTopologyField",
      "getTopologySampleFromField",
      "estimateEarthEquivalentSeaLevel",
      "getTopologyStatus"
    ]),

    topologyLaw: TOPOLOGY_LAW,

    targetLandRatio: EARTH_EXPOSED_LAND_RATIO,
    approximateEarthExposedLandRatio: EARTH_EXPOSED_LAND_RATIO,
    earthEquivalentLandRatioActive: true,

    beachOutlineOnly: true,
    sandInteriorBlocked: true,
    wholeLandBeachBlocked: true,
    inlandTerrainPlaceholderActive: true,
    waterDominatesSeaLevel: true,

    seaLevelBoundaryActive: true,
    bathymetryBlueprintActive: true,
    beachOutlineActive: true,
    coastalShelfActive: true,
    coastalCliffActive: true,
    seaLevelErosionActive: true,
    subterraneanBlueprintActive: true,

    tectonicHandoffReady: true,
    terrainHandoffReady: true,
    hydrationHandoffReady: true,

    ownsTopology: true,
    ownsLandFootprint: true,
    ownsVoidFootprint: true,
    ownsSeaLevelBoundary: true,
    ownsBathymetryBlueprint: true,
    ownsBeachOutline: true,

    ownsTerrain: false,
    ownsAboveSeaElevation: false,
    ownsTectonics: false,
    ownsHydration: false,
    ownsWaterFill: false,
    ownsWaterPlacement: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFoliage: false,
    ownsTrees: false,
    ownsVegetation: false,
    ownsAnimals: false,
    ownsMarineLife: false,
    ownsConstructCivilization: false,
    ownsRouteRendering: false,
    ownsRuntimeRendering: false,
    ownsFinalRender: false,

    climateClosed: true,
    ecologyClosed: true,
    foliageClosed: true,
    treesClosed: true,
    vegetationClosed: true,
    animalsClosed: true,
    marineLifeClosed: true,
    constructCivilizationClosed: true,

    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false
  });
}

const api = Object.freeze({
  sampleTopology,
  buildTopologyField,
  getTopologySampleFromField,
  estimateEarthEquivalentSeaLevel,
  getTopologyStatus
});

if (typeof window !== "undefined") {
  window.DGBAudraliaTopology = api;
  window.AudraliaTopology = api;
  window.audraliaTopology = api;
}

export default api;

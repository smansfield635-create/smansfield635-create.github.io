/* /assets/audralia.foliage.render.js
   AUDRALIA_G2_FOLIAGE_ENGINE_TNT_v1

   ROLE=
   DOWNSTREAM_LIVING_WORLD_FOLIAGE_ENGINE

   OWNS=
   AUDRALIA_FORESTS
   AUDRALIA_GRASSLANDS
   AUDRALIA_DRY_SCRUB
   AUDRALIA_FERTILE_BASINS
   AUDRALIA_COASTAL_VEGETATION
   AUDRALIA_MOUNTAIN_VEGETATION_LIMITS
   AUDRALIA_POLAR_SUBPOLAR_VEGETATION_LIMITS
   AUDRALIA_BIOME_COLOR_INFLUENCE
   AUDRALIA_ECOLOGICAL_MATURITY
   AUDRALIA_FOUR_TIMES_EARTH_AGE_PLANT_LIFE_EXPRESSION

   DOES_NOT_OWN=
   LAND_SHAPE
   OCEAN_SHAPE
   WATER_DEPTH
   ANIMAL_MIGRATION
   FINAL_TEXTURE_COMPOSITION
   PLATFORM_PROJECTION
   INSTRUMENT_STATE
   ROUTE_COPY
   SUN_PIXELS
   MOON_PIXELS
   GAUGES_LOGIC
   PRODUCT_LOGIC
   SHOWROOM_LAYOUT
   IMAGE_GENERATION
   GRAPHIC_BOX_BEHAVIOR

   OUTPUT=
   sampleFoliage(lon, lat, context)
   sampleUV(u, v, context)
   buildFoliageField(width, height, options)
   createProfile()
   getStatus()

   CHAIN_POSITION=
   LAND → WATER → FOLIAGE → ANIMALS → PLANET_COMPOSITOR
*/

(function bindAudraliaFoliageRenderEngine(global) {
  "use strict";

  const VERSION = "AUDRALIA_G2_FOLIAGE_ENGINE_TNT_v1";
  const ENGINE_ID = "audralia-foliage";
  const PLANET_ID = "audrelia";
  const CANONICAL_PLANET_ID = "audralia";
  const LABEL = "Audralia Foliage Engine";
  const TYPE = "foliage-engine";

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function normalizeLon(lon) {
    let out = Number(lon) || 0;
    while (out > 180) out -= 360;
    while (out < -180) out += 360;
    return out;
  }

  function hashNoise(x, y, seed) {
    const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
    return n - Math.floor(n);
  }

  function fbm(x, y, seed) {
    let value = 0;
    let amp = 0.5;
    let freq = 1;

    for (let i = 0; i < 5; i += 1) {
      value += amp * hashNoise(x * freq, y * freq, seed + i * 19.31);
      amp *= 0.5;
      freq *= 2.03;
    }

    return value;
  }

  function findLandEngine() {
    const bridge = global.DiamondGateBridge || {};

    return (
      global.DGBAudraliaLandRenderEngine ||
      global.DGBAudreliaLandRenderEngine ||
      bridge.DGBAudraliaLandRenderEngine ||
      bridge.DGBAudreliaLandRenderEngine ||
      null
    );
  }

  function findWaterEngine() {
    const bridge = global.DiamondGateBridge || {};

    return (
      global.DGBAudraliaWaterRenderEngine ||
      global.DGBAudreliaWaterRenderEngine ||
      bridge.DGBAudraliaWaterRenderEngine ||
      bridge.DGBAudreliaWaterRenderEngine ||
      null
    );
  }

  function fallbackLandSample(lon, lat) {
    return {
      ok: false,
      fallback: true,
      lon,
      lat,
      landMask: 0,
      hardLandMask: 0,
      elevation: 0,
      ridge: 0,
      basin: 0,
      mineral: 0,
      dryInterior: 0,
      ancientGeology: 0,
      coastlinePressure: 0,
      summitRegion: "ocean_system",
      summitName: "Water",
      seamSafe: true
    };
  }

  function fallbackWaterSample(lon, lat) {
    return {
      ok: false,
      fallback: true,
      lon,
      lat,
      isWater: 1,
      oceanDepth: 0.8,
      shelf: 0,
      reef: 0,
      current: 0.2,
      currentWarmth: 0.4,
      coastalMoisture: 0,
      inlandWater: 0,
      wetDryBoundary: 0,
      shorelineFoam: 0,
      turquoiseShelf: 0,
      seamSafe: true
    };
  }

  function getLandSample(lon, lat, context) {
    if (context && context.land) return context.land;

    const landEngine = findLandEngine();

    if (landEngine && typeof landEngine.sampleLand === "function") {
      return landEngine.sampleLand(lon, lat, context);
    }

    if (landEngine && typeof landEngine.sample === "function") {
      return landEngine.sample(lon, lat, context);
    }

    return fallbackLandSample(lon, lat);
  }

  function getWaterSample(lon, lat, context) {
    if (context && context.water) return context.water;

    const waterEngine = findWaterEngine();

    if (waterEngine && typeof waterEngine.sampleWater === "function") {
      return waterEngine.sampleWater(lon, lat, context);
    }

    if (waterEngine && typeof waterEngine.sample === "function") {
      return waterEngine.sample(lon, lat, context);
    }

    return fallbackWaterSample(lon, lat);
  }

  function summitBias(regionKey) {
    const key = String(regionKey || "");

    if (key.indexOf("peace") >= 0) return { forest: 0.78, grassland: 0.48, scrub: 0.10, fertile: 0.76 };
    if (key.indexOf("joy") >= 0) return { forest: 0.72, grassland: 0.56, scrub: 0.08, fertile: 0.62 };
    if (key.indexOf("stability") >= 0) return { forest: 0.58, grassland: 0.72, scrub: 0.18, fertile: 0.70 };
    if (key.indexOf("love") >= 0) return { forest: 0.68, grassland: 0.64, scrub: 0.22, fertile: 0.78 };
    if (key.indexOf("balance") >= 0) return { forest: 0.50, grassland: 0.62, scrub: 0.28, fertile: 0.56 };
    if (key.indexOf("structure") >= 0) return { forest: 0.34, grassland: 0.62, scrub: 0.46, fertile: 0.42 };
    if (key.indexOf("character") >= 0) return { forest: 0.36, grassland: 0.44, scrub: 0.34, fertile: 0.30 };
    if (key.indexOf("dignity") >= 0) return { forest: 0.24, grassland: 0.38, scrub: 0.48, fertile: 0.24 };
    if (key.indexOf("free_will") >= 0) return { forest: 0.40, grassland: 0.60, scrub: 0.50, fertile: 0.34 };

    return { forest: 0.45, grassland: 0.52, scrub: 0.30, fertile: 0.38 };
  }

  function sampleFoliage(lonInput, latInput, context) {
    const lon = normalizeLon(lonInput);
    const lat = clamp(Number(latInput) || 0, -90, 90);
    const ctx = context || {};
    const land = getLandSample(lon, lat, ctx);
    const water = getWaterSample(lon, lat, Object.assign({}, ctx, { land }));

    const landMask = clamp(land.landMask || 0, 0, 1);
    const elevation = clamp(land.elevation || 0, 0, 1);
    const ridge = clamp(land.ridge || 0, 0, 1);
    const basin = clamp(land.basin || 0, 0, 1);
    const dryInterior = clamp(land.dryInterior || 0, 0, 1);
    const ancientGeology = clamp(land.ancientGeology || 0, 0, 1);
    const coastlinePressure = clamp(land.coastlinePressure || 0, 0, 1);
    const coastalMoisture = clamp(water.coastalMoisture || 0, 0, 1);
    const inlandWater = clamp(water.inlandWater || 0, 0, 1);
    const wetDryBoundary = clamp(water.wetDryBoundary || 0, 0, 1);
    const currentWarmth = clamp(water.currentWarmth || 0, 0, 1);

    const absLat = Math.abs(lat);
    const tropical = 1 - clamp(absLat / 34, 0, 1);
    const temperate = Math.exp(-Math.pow((absLat - 38) / 20, 2));
    const subpolar = smoothstep(48, 74, absLat);
    const polarLimit = smoothstep(56, 82, absLat) + smoothstep(0.64, 0.95, elevation) * 0.34;

    const humidityNoise = fbm(lon * 0.028, lat * 0.036, 1601.2);
    const biomeNoise = fbm(lon * 0.074, lat * 0.081, 1703.5);
    const oldGrowthNoise = fbm(lon * 0.018, lat * 0.022, 1819.9);

    const bias = summitBias(land.summitRegion);

    const waterSupport = clamp(
      coastalMoisture * 0.48 +
      inlandWater * 0.42 +
      wetDryBoundary * 0.18 +
      currentWarmth * 0.12,
      0,
      1
    );

    const baseGreen = clamp(
      landMask * (
        humidityNoise * 0.28 +
        waterSupport * 0.46 +
        tropical * 0.18 +
        temperate * 0.16 -
        dryInterior * 0.40 -
        polarLimit * 0.50 -
        ridge * 0.10
      ),
      0,
      1
    );

    const forest = clamp(
      landMask * (
        bias.forest * 0.34 +
        baseGreen * 0.62 +
        basin * 0.16 +
        coastalMoisture * 0.20 -
        dryInterior * 0.34 -
        elevation * 0.12 -
        polarLimit * 0.50
      ),
      0,
      1
    );

    const grassland = clamp(
      landMask * (
        bias.grassland * 0.36 +
        temperate * 0.28 +
        baseGreen * 0.22 +
        wetDryBoundary * 0.20 -
        forest * 0.16 -
        polarLimit * 0.32
      ),
      0,
      1
    );

    const scrub = clamp(
      landMask * (
        bias.scrub * 0.36 +
        dryInterior * 0.48 +
        ancientGeology * 0.12 +
        biomeNoise * 0.18 -
        forest * 0.22 -
        polarLimit * 0.22
      ),
      0,
      1
    );

    const fertileBasin = clamp(
      landMask * (
        bias.fertile * 0.34 +
        basin * 0.34 +
        inlandWater * 0.28 +
        coastalMoisture * 0.18 +
        oldGrowthNoise * 0.16 -
        dryInterior * 0.20 -
        polarLimit * 0.28
      ),
      0,
      1
    );

    const coastalVegetation = clamp(
      landMask * (
        coastlinePressure * 0.48 +
        coastalMoisture * 0.44 +
        tropical * 0.10 -
        dryInterior * 0.14 -
        polarLimit * 0.22
      ),
      0,
      1
    );

    const mountainVegetationLimit = clamp(
      landMask * (
        ridge * 0.46 +
        elevation * 0.34 +
        polarLimit * 0.32
      ),
      0,
      1
    );

    const matureEcology = clamp(
      landMask * (
        ancientGeology * 0.28 +
        forest * 0.30 +
        fertileBasin * 0.22 +
        oldGrowthNoise * 0.22 +
        waterSupport * 0.14
      ),
      0,
      1
    );

    const foliageDensity = clamp(
      forest * 0.42 +
      grassland * 0.26 +
      scrub * 0.12 +
      fertileBasin * 0.28 +
      coastalVegetation * 0.18 -
      mountainVegetationLimit * 0.18,
      0,
      1
    );

    const climateGreen = clamp(
      baseGreen * 0.42 +
      forest * 0.36 +
      grassland * 0.14 +
      fertileBasin * 0.22 +
      coastalVegetation * 0.16,
      0,
      1
    );

    const biomeColorInfluence = {
      deepForest: forest,
      grassland,
      scrub,
      fertileGreen: fertileBasin,
      coastalGreen: coastalVegetation,
      oldGrowth: matureEcology,
      alpineLimit: mountainVegetationLimit,
      polarLimit: clamp(polarLimit, 0, 1)
    };

    return {
      ok: true,
      engine: ENGINE_ID,
      planet: CANONICAL_PLANET_ID,
      lon,
      lat,
      foliageDensity,
      forest,
      grassland,
      scrub,
      fertileBasin,
      coastalVegetation,
      mountainVegetationLimit,
      polarLimit: clamp(polarLimit, 0, 1),
      climateGreen,
      matureEcology,
      biomeColorInfluence,
      linkedLandRegion: land.summitRegion || "unknown",
      linkedSummitName: land.summitName || "Foliage",
      landDependencyUsed: !land.fallback,
      waterDependencyUsed: !water.fallback,
      seamSafe: true,
      noWrongEdgePolygonChords: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    };
  }

  function sampleUV(u, v, context) {
    const lon = ((Number(u) || 0) % 1) * 360 - 180;
    const lat = 90 - clamp(Number(v) || 0, 0, 1) * 180;
    return sampleFoliage(lon, lat, context);
  }

  function buildFoliageField(width, height, options) {
    const w = Math.max(1, Math.floor(Number(width) || 1));
    const h = Math.max(1, Math.floor(Number(height) || 1));
    const channels = 8;
    const data = new Float32Array(w * h * channels);
    let i = 0;

    for (let y = 0; y < h; y += 1) {
      const v = y / Math.max(1, h - 1);

      for (let x = 0; x < w; x += 1) {
        const u = x / w;
        const sample = sampleUV(u, v, options || {});

        data[i] = sample.foliageDensity;
        data[i + 1] = sample.forest;
        data[i + 2] = sample.grassland;
        data[i + 3] = sample.scrub;
        data[i + 4] = sample.fertileBasin;
        data[i + 5] = sample.coastalVegetation;
        data[i + 6] = sample.mountainVegetationLimit;
        data[i + 7] = sample.climateGreen;

        i += channels;
      }
    }

    return {
      ok: true,
      engine: ENGINE_ID,
      planet: CANONICAL_PLANET_ID,
      width: w,
      height: h,
      channels,
      channelMap: [
        "foliageDensity",
        "forest",
        "grassland",
        "scrub",
        "fertileBasin",
        "coastalVegetation",
        "mountainVegetationLimit",
        "climateGreen"
      ],
      data,
      seamSafe: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    };
  }

  function createProfile() {
    return {
      id: ENGINE_ID,
      planetId: PLANET_ID,
      canonicalPlanetId: CANONICAL_PLANET_ID,
      label: LABEL,
      type: TYPE,
      version: VERSION,
      chainPosition: 3,
      chain: "LAND_TO_WATER_TO_FOLIAGE_TO_ANIMALS_TO_PLANET_COMPOSITOR",
      ownsLand: false,
      ownsWater: false,
      ownsFoliageOnly: true,
      ownsAnimals: false,
      ownsFinalTexture: false,
      dependsOn: [
        "/assets/audralia.land.render.js",
        "/assets/audralia.water.render.js"
      ],
      forests: true,
      grasslands: true,
      dryScrub: true,
      fertileBasins: true,
      coastalVegetation: true,
      mountainVegetationLimits: true,
      polarSubpolarVegetationLimits: true,
      biomeColorInfluence: true,
      ecologicalMaturity: true,
      fourTimesEarthAgePlantLifeExpression: true,
      seamSafeFoliage: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      outputs: [
        "foliageDensity",
        "forest",
        "grassland",
        "scrub",
        "fertileBasin",
        "coastalVegetation",
        "mountainVegetationLimit",
        "climateGreen",
        "matureEcology"
      ],
      forbiddenOwnership: [
        "landShape",
        "oceanShape",
        "waterDepth",
        "animalMigration",
        "finalTexture",
        "routeShell",
        "instrument",
        "gauges",
        "products",
        "sun",
        "moon"
      ]
    };
  }

  function getStatus() {
    return {
      ok: true,
      id: ENGINE_ID,
      planetId: PLANET_ID,
      canonicalPlanetId: CANONICAL_PLANET_ID,
      label: LABEL,
      type: TYPE,
      version: VERSION,
      file: "/assets/audralia.foliage.render.js",
      chainPosition: 3,
      ownsFoliageOnly: true,
      foliageEngineReady: true,
      landDependency: "/assets/audralia.land.render.js",
      waterDependency: "/assets/audralia.water.render.js",
      forests: true,
      grasslands: true,
      dryScrub: true,
      fertileBasins: true,
      coastalVegetation: true,
      mountainVegetationLimits: true,
      polarSubpolarVegetationLimits: true,
      biomeColorInfluence: true,
      ecologicalMaturity: true,
      fourTimesEarthAgePlantLifeExpression: true,
      seamSafeFoliage: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    };
  }

  const api = {
    id: ENGINE_ID,
    planetId: PLANET_ID,
    canonicalPlanetId: CANONICAL_PLANET_ID,
    label: LABEL,
    type: TYPE,
    version: VERSION,
    VERSION,
    aliases: [
      "audralia-foliage",
      "audrelia-foliage",
      "audralia-biome",
      "audralia-vegetation",
      "audralia-living-world-foliage"
    ],
    createProfile,
    sampleFoliage,
    sample: sampleFoliage,
    sampleUV,
    buildFoliageField,
    getStatus
  };

  global.DGBAudraliaFoliageRenderEngine = api;
  global.DGBAudreliaFoliageRenderEngine = api;

  global.DiamondGateBridge = global.DiamondGateBridge || {};
  global.DiamondGateBridge.DGBAudraliaFoliageRenderEngine = api;
  global.DiamondGateBridge.DGBAudreliaFoliageRenderEngine = api;

  try {
    global.dispatchEvent(
      new CustomEvent("dgb:audralia:foliage-engine-ready", {
        detail: getStatus()
      })
    );

    global.dispatchEvent(
      new CustomEvent("dgb:audrelia:foliage-engine-ready", {
        detail: getStatus()
      })
    );
  } catch (_) {}
})(typeof window !== "undefined" ? window : globalThis);

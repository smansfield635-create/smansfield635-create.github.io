/* /assets/audralia.animals.render.js
   AUDRALIA_G2_ANIMALS_ENGINE_TNT_v1

   ROLE=
   DOWNSTREAM_LIVING_WORLD_ANIMALS_ENGINE

   OWNS=
   AUDRALIA_ANIMAL_HABITAT_ZONES
   AUDRALIA_MIGRATION_PATHS
   AUDRALIA_HERD_DENSITY_HINTS
   AUDRALIA_BIRD_ROUTE_TRACES
   AUDRALIA_MARINE_LIFE_SHIMMER
   AUDRALIA_REEF_LIFE_SIGNAL
   AUDRALIA_COASTAL_ACTIVITY
   AUDRALIA_ECOSYSTEM_DENSITY
   AUDRALIA_LIFE_SIGNATURE_TEXTURE

   DOES_NOT_OWN=
   TERRAIN_SHAPE
   OCEAN_SHAPE
   VEGETATION_AUTHORITY
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

   IMPORTANT=
   At globe scale, animals are ecological signals:
   migration arcs, herd density, bird-route traces, marine-life shimmer,
   reef-life signal, coastal activity, and ecosystem pulse.
   No oversized cartoon animals.

   OUTPUT=
   sampleAnimals(lon, lat, context)
   sampleUV(u, v, context)
   buildAnimalsField(width, height, options)
   createProfile()
   getStatus()

   CHAIN_POSITION=
   LAND → WATER → FOLIAGE → ANIMALS → PLANET_COMPOSITOR
*/

(function bindAudraliaAnimalsRenderEngine(global) {
  "use strict";

  const VERSION = "AUDRALIA_G2_ANIMALS_ENGINE_TNT_v1";
  const ENGINE_ID = "audralia-animals";
  const PLANET_ID = "audrelia";
  const CANONICAL_PLANET_ID = "audralia";
  const LABEL = "Audralia Animals Engine";
  const TYPE = "animals-engine";

  const MIGRATION_CORRIDORS = [
    {
      key: "love_heartland_migration",
      summit: "Love",
      startLon: 50,
      endLon: 160,
      lat: -18,
      amplitude: 10,
      frequency: 0.045,
      phase: 22,
      density: 0.82,
      mode: "mixed_land"
    },
    {
      key: "joy_archipelago_bird_route",
      summit: "Joy",
      startLon: -176,
      endLon: -112,
      lat: 28,
      amplitude: 8,
      frequency: 0.075,
      phase: 80,
      density: 0.76,
      mode: "bird"
    },
    {
      key: "stability_coastal_life_route",
      summit: "Stability",
      startLon: 128,
      endLon: 178,
      lat: -12,
      amplitude: 7,
      frequency: 0.066,
      phase: 140,
      density: 0.66,
      mode: "coastal"
    },
    {
      key: "peace_basin_low_conflict_ecology",
      summit: "Peace",
      startLon: -78,
      endLon: -24,
      lat: -48,
      amplitude: 5,
      frequency: 0.052,
      phase: 206,
      density: 0.54,
      mode: "sheltered"
    },
    {
      key: "free_will_frontier_migration",
      summit: "Free Will",
      startLon: -18,
      endLon: 62,
      lat: 42,
      amplitude: 9,
      frequency: 0.058,
      phase: 280,
      density: 0.62,
      mode: "frontier"
    },
    {
      key: "southern_ocean_marine_signal",
      summit: "Balance",
      startLon: -160,
      endLon: 170,
      lat: -54,
      amplitude: 6,
      frequency: 0.040,
      phase: 330,
      density: 0.58,
      mode: "marine"
    }
  ];

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

  function wrapDeltaLon(lon, centerLon) {
    let d = lon - centerLon;
    while (d > 180) d -= 360;
    while (d < -180) d += 360;
    return d;
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
      value += amp * hashNoise(x * freq, y * freq, seed + i * 23.17);
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

  function findFoliageEngine() {
    const bridge = global.DiamondGateBridge || {};
    return (
      global.DGBAudraliaFoliageRenderEngine ||
      global.DGBAudreliaFoliageRenderEngine ||
      bridge.DGBAudraliaFoliageRenderEngine ||
      bridge.DGBAudreliaFoliageRenderEngine ||
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

  function fallbackFoliageSample(lon, lat) {
    return {
      ok: false,
      fallback: true,
      lon,
      lat,
      foliageDensity: 0,
      forest: 0,
      grassland: 0,
      scrub: 0,
      fertileBasin: 0,
      coastalVegetation: 0,
      mountainVegetationLimit: 0,
      polarLimit: 0,
      climateGreen: 0,
      matureEcology: 0,
      seamSafe: true
    };
  }

  function getLandSample(lon, lat, context) {
    if (context && context.land) return context.land;

    const engine = findLandEngine();

    if (engine && typeof engine.sampleLand === "function") {
      return engine.sampleLand(lon, lat, context);
    }

    if (engine && typeof engine.sample === "function") {
      return engine.sample(lon, lat, context);
    }

    return fallbackLandSample(lon, lat);
  }

  function getWaterSample(lon, lat, context) {
    if (context && context.water) return context.water;

    const engine = findWaterEngine();

    if (engine && typeof engine.sampleWater === "function") {
      return engine.sampleWater(lon, lat, context);
    }

    if (engine && typeof engine.sample === "function") {
      return engine.sample(lon, lat, context);
    }

    return fallbackWaterSample(lon, lat);
  }

  function getFoliageSample(lon, lat, context) {
    if (context && context.foliage) return context.foliage;

    const engine = findFoliageEngine();

    if (engine && typeof engine.sampleFoliage === "function") {
      return engine.sampleFoliage(lon, lat, context);
    }

    if (engine && typeof engine.sample === "function") {
      return engine.sample(lon, lat, context);
    }

    return fallbackFoliageSample(lon, lat);
  }

  function corridorDistance(lon, lat, corridor) {
    const start = Math.min(corridor.startLon, corridor.endLon);
    const end = Math.max(corridor.startLon, corridor.endLon);

    if (lon < start - 4 || lon > end + 4) {
      return 999;
    }

    const normalized = (lon - corridor.startLon) / Math.max(1, corridor.endLon - corridor.startLon);
    const t = clamp(normalized, 0, 1);

    const routeLat =
      corridor.lat +
      Math.sin((lon + corridor.phase) * corridor.frequency) * corridor.amplitude +
      Math.sin((lon - corridor.phase * 0.35) * corridor.frequency * 2.0) * corridor.amplitude * 0.35;

    return Math.abs(lat - routeLat) + Math.abs(t - 0.5) * 0.8;
  }

  function migrationField(lon, lat, mode) {
    let value = 0;

    MIGRATION_CORRIDORS.forEach(function scoreCorridor(corridor) {
      if (mode && corridor.mode !== mode) return;

      const distance = corridorDistance(lon, lat, corridor);
      const signal = Math.exp(-Math.pow(distance / 5.4, 2)) * corridor.density;

      value = Math.max(value, signal);
    });

    return clamp(value, 0, 1);
  }

  function summitLifeBias(regionKey) {
    const key = String(regionKey || "");

    if (key.indexOf("love") >= 0) return { herd: 0.72, bird: 0.54, coastal: 0.42, marine: 0.30, ecology: 0.88 };
    if (key.indexOf("joy") >= 0) return { herd: 0.34, bird: 0.86, coastal: 0.62, marine: 0.58, ecology: 0.82 };
    if (key.indexOf("stability") >= 0) return { herd: 0.58, bird: 0.50, coastal: 0.74, marine: 0.52, ecology: 0.76 };
    if (key.indexOf("peace") >= 0) return { herd: 0.42, bird: 0.46, coastal: 0.48, marine: 0.34, ecology: 0.66 };
    if (key.indexOf("balance") >= 0) return { herd: 0.44, bird: 0.42, coastal: 0.54, marine: 0.48, ecology: 0.62 };
    if (key.indexOf("structure") >= 0) return { herd: 0.54, bird: 0.34, coastal: 0.28, marine: 0.18, ecology: 0.56 };
    if (key.indexOf("character") >= 0) return { herd: 0.30, bird: 0.52, coastal: 0.18, marine: 0.08, ecology: 0.44 };
    if (key.indexOf("dignity") >= 0) return { herd: 0.22, bird: 0.38, coastal: 0.16, marine: 0.10, ecology: 0.36 };
    if (key.indexOf("free_will") >= 0) return { herd: 0.62, bird: 0.50, coastal: 0.28, marine: 0.20, ecology: 0.64 };

    return { herd: 0.40, bird: 0.40, coastal: 0.35, marine: 0.35, ecology: 0.50 };
  }

  function sampleAnimals(lonInput, latInput, context) {
    const lon = normalizeLon(lonInput);
    const lat = clamp(Number(latInput) || 0, -90, 90);
    const ctx = context || {};

    const land = getLandSample(lon, lat, ctx);
    const water = getWaterSample(lon, lat, Object.assign({}, ctx, { land }));
    const foliage = getFoliageSample(lon, lat, Object.assign({}, ctx, { land, water }));

    const landMask = clamp(land.landMask || 0, 0, 1);
    const waterMask = clamp(water.isWater || 0, 0, 1);
    const elevation = clamp(land.elevation || 0, 0, 1);
    const ridge = clamp(land.ridge || 0, 0, 1);
    const dryInterior = clamp(land.dryInterior || 0, 0, 1);
    const coastlinePressure = clamp(land.coastlinePressure || 0, 0, 1);

    const reef = clamp(water.reef || 0, 0, 1);
    const shelf = clamp(water.shelf || 0, 0, 1);
    const coastalMoisture = clamp(water.coastalMoisture || 0, 0, 1);
    const inlandWater = clamp(water.inlandWater || 0, 0, 1);
    const current = clamp(water.current || 0, 0, 1);

    const foliageDensity = clamp(foliage.foliageDensity || 0, 0, 1);
    const forest = clamp(foliage.forest || 0, 0, 1);
    const grassland = clamp(foliage.grassland || 0, 0, 1);
    const scrub = clamp(foliage.scrub || 0, 0, 1);
    const fertileBasin = clamp(foliage.fertileBasin || 0, 0, 1);
    const coastalVegetation = clamp(foliage.coastalVegetation || 0, 0, 1);
    const polarLimit = clamp(foliage.polarLimit || 0, 0, 1);
    const matureEcology = clamp(foliage.matureEcology || 0, 0, 1);

    const bias = summitLifeBias(land.summitRegion);

    const localNoise = fbm(lon * 0.090, lat * 0.095, 2201.5);
    const densityNoise = fbm(lon * 0.035, lat * 0.043, 2307.8);
    const pulseNoise = fbm(lon * 0.145, lat * 0.137, 2419.2);

    const landHabitat = clamp(
      landMask * (
        foliageDensity * 0.36 +
        grassland * 0.22 +
        forest * 0.18 +
        fertileBasin * 0.18 +
        inlandWater * 0.16 +
        coastalMoisture * 0.12 -
        dryInterior * 0.18 -
        ridge * 0.10 -
        polarLimit * 0.42 +
        densityNoise * 0.16
      ),
      0,
      1
    );

    const herdSignal = clamp(
      landMask * (
        bias.herd * 0.32 +
        grassland * 0.36 +
        scrub * 0.16 +
        inlandWater * 0.12 +
        migrationField(lon, lat, "mixed_land") * 0.32 +
        migrationField(lon, lat, "frontier") * 0.28 -
        forest * 0.08 -
        elevation * 0.12 -
        polarLimit * 0.30
      ),
      0,
      1
    );

    const birdPath = clamp(
      (
        bias.bird * 0.20 +
        migrationField(lon, lat, "bird") * 0.58 +
        coastlinePressure * 0.16 +
        forest * 0.14 +
        coastalVegetation * 0.18 +
        fertileBasin * 0.10 +
        localNoise * 0.12 -
        polarLimit * 0.16
      ) * Math.max(landMask, waterMask * shelf),
      0,
      1
    );

    const coastalLife = clamp(
      (
        bias.coastal * 0.28 +
        coastlinePressure * 0.42 +
        coastalVegetation * 0.22 +
        shelf * 0.20 +
        coastalMoisture * 0.20 +
        migrationField(lon, lat, "coastal") * 0.34
      ) * Math.max(landMask, shelf),
      0,
      1
    );

    const reefLife = clamp(
      waterMask * (
        bias.marine * 0.16 +
        reef * 0.72 +
        shelf * 0.18 +
        current * 0.16 +
        migrationField(lon, lat, "marine") * 0.22
      ),
      0,
      1
    );

    const marineLife = clamp(
      waterMask * (
        current * 0.24 +
        shelf * 0.18 +
        reef * 0.38 +
        migrationField(lon, lat, "marine") * 0.42 +
        densityNoise * 0.10
      ),
      0,
      1
    );

    const shelteredEcology = clamp(
      landMask * (
        migrationField(lon, lat, "sheltered") * 0.38 +
        fertileBasin * 0.30 +
        forest * 0.20 +
        inlandWater * 0.18 -
        dryInterior * 0.18
      ),
      0,
      1
    );

    const animalDensity = clamp(
      landHabitat * 0.34 +
      herdSignal * 0.26 +
      birdPath * 0.18 +
      coastalLife * 0.22 +
      reefLife * 0.20 +
      marineLife * 0.18 +
      shelteredEcology * 0.18 +
      bias.ecology * 0.08 -
      polarLimit * 0.16,
      0,
      1
    );

    const migrationTrace = clamp(
      migrationField(lon, lat, null) * 0.82 +
      birdPath * 0.18 +
      herdSignal * 0.16 +
      marineLife * 0.12,
      0,
      1
    );

    const ecosystemDensity = clamp(
      matureEcology * 0.28 +
      foliageDensity * 0.24 +
      animalDensity * 0.34 +
      reefLife * 0.20 +
      coastalLife * 0.12,
      0,
      1
    );

    const ecologyPulse = clamp(
      animalDensity * 0.42 +
      migrationTrace * 0.22 +
      ecosystemDensity * 0.26 +
      pulseNoise * 0.12,
      0,
      1
    );

    const lifeColorInfluence = {
      herdWarmth: herdSignal,
      birdTrace: birdPath,
      marineShimmer: marineLife,
      reefLife,
      coastalActivity: coastalLife,
      ecologyPulse,
      ecosystemDensity
    };

    return {
      ok: true,
      engine: ENGINE_ID,
      planet: CANONICAL_PLANET_ID,
      lon,
      lat,
      animalDensity,
      migrationTrace,
      herdSignal,
      birdPath,
      marineLife,
      reefLife,
      coastalLife,
      shelteredEcology,
      ecosystemDensity,
      ecologyPulse,
      lifeColorInfluence,
      linkedLandRegion: land.summitRegion || "unknown",
      linkedSummitName: land.summitName || "Animals",
      landDependencyUsed: !land.fallback,
      waterDependencyUsed: !water.fallback,
      foliageDependencyUsed: !foliage.fallback,
      globeScaleSignalsOnly: true,
      noOversizedAnimalIcons: true,
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
    return sampleAnimals(lon, lat, context);
  }

  function buildAnimalsField(width, height, options) {
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

        data[i] = sample.animalDensity;
        data[i + 1] = sample.migrationTrace;
        data[i + 2] = sample.herdSignal;
        data[i + 3] = sample.birdPath;
        data[i + 4] = sample.marineLife;
        data[i + 5] = sample.reefLife;
        data[i + 6] = sample.coastalLife;
        data[i + 7] = sample.ecologyPulse;

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
        "animalDensity",
        "migrationTrace",
        "herdSignal",
        "birdPath",
        "marineLife",
        "reefLife",
        "coastalLife",
        "ecologyPulse"
      ],
      data,
      globeScaleSignalsOnly: true,
      noOversizedAnimalIcons: true,
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
      chainPosition: 4,
      chain: "LAND_TO_WATER_TO_FOLIAGE_TO_ANIMALS_TO_PLANET_COMPOSITOR",
      ownsLand: false,
      ownsWater: false,
      ownsFoliage: false,
      ownsAnimalsOnly: true,
      ownsFinalTexture: false,
      dependsOn: [
        "/assets/audralia.land.render.js",
        "/assets/audralia.water.render.js",
        "/assets/audralia.foliage.render.js"
      ],
      animalHabitatZones: true,
      migrationPaths: true,
      herdDensityHints: true,
      birdRouteTraces: true,
      marineLifeShimmer: true,
      reefLifeSignal: true,
      coastalActivity: true,
      ecosystemDensity: true,
      lifeSignatureTexture: true,
      globeScaleSignalsOnly: true,
      noOversizedAnimalIcons: true,
      seamSafeAnimals: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      outputs: [
        "animalDensity",
        "migrationTrace",
        "herdSignal",
        "birdPath",
        "marineLife",
        "reefLife",
        "coastalLife",
        "ecosystemDensity",
        "ecologyPulse"
      ],
      forbiddenOwnership: [
        "terrainShape",
        "oceanShape",
        "vegetationAuthority",
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
      file: "/assets/audralia.animals.render.js",
      chainPosition: 4,
      ownsAnimalsOnly: true,
      animalsEngineReady: true,
      landDependency: "/assets/audralia.land.render.js",
      waterDependency: "/assets/audralia.water.render.js",
      foliageDependency: "/assets/audralia.foliage.render.js",
      animalHabitatZones: true,
      migrationPaths: true,
      herdDensityHints: true,
      birdRouteTraces: true,
      marineLifeShimmer: true,
      reefLifeSignal: true,
      coastalActivity: true,
      ecosystemDensity: true,
      lifeSignatureTexture: true,
      globeScaleSignalsOnly: true,
      noOversizedAnimalIcons: true,
      seamSafeAnimals: true,
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
      "audralia-animals",
      "audrelia-animals",
      "audralia-ecology",
      "audralia-life",
      "audralia-living-world-animals"
    ],
    createProfile,
    sampleAnimals,
    sample: sampleAnimals,
    sampleUV,
    buildAnimalsField,
    getStatus
  };

  global.DGBAudraliaAnimalsRenderEngine = api;
  global.DGBAudreliaAnimalsRenderEngine = api;

  global.DiamondGateBridge = global.DiamondGateBridge || {};
  global.DiamondGateBridge.DGBAudraliaAnimalsRenderEngine = api;
  global.DiamondGateBridge.DGBAudreliaAnimalsRenderEngine = api;

  try {
    global.dispatchEvent(
      new CustomEvent("dgb:audralia:animals-engine-ready", {
        detail: getStatus()
      })
    );

    global.dispatchEvent(
      new CustomEvent("dgb:audrelia:animals-engine-ready", {
        detail: getStatus()
      })
    );
  } catch (_) {}
})(typeof window !== "undefined" ? window : globalThis);

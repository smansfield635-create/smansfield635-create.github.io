/* /assets/audralia.living-world.runtime.js
   AUDRALIA_G2_LIVING_WORLD_RUNTIME_CONTROL_ENGINE_TNT_v1

   ROLE=
   LIVING_WORLD_RUNTIME_ORCHESTRATOR / CONTROL_ENGINE

   OWNS=
   ENGINE_DISCOVERY
   ENGINE_READINESS_RECEIPTS
   DEPENDENCY_ORDER
   SHARED_SAMPLE_CONTEXT
   COORDINATED_SAMPLE_CHAIN
   FALLBACK_POLICY
   ENGINE_HEALTH_STATUS
   LIVING_WORLD_RUNTIME_RECEIPT
   SINGLE_HANDOFF_SURFACE_FOR_COMPOSITOR

   CONSUMES=
   /assets/audralia.land.render.js
   /assets/audralia.water.render.js
   /assets/audralia.foliage.render.js
   /assets/audralia.animals.render.js

   DOES_NOT_OWN=
   LAND_TERRAIN_LOGIC
   WATER_HYDROLOGY_LOGIC
   FOLIAGE_BIOME_LOGIC
   ANIMAL_ECOLOGY_LOGIC
   FINAL_TEXTURE_PIXELS
   ROUTE_SHELL_COPY
   VISUAL_PAGE_LAYOUT
   INSTRUMENT_PROJECTION
   GAUGES_SCORING
   PRODUCTS_LOGIC
   SUN_RENDERING
   MOON_RENDERING
   IMAGE_GENERATION
   GRAPHIC_BOX_BEHAVIOR

   PUBLIC_API=
   createProfile()
   getStatus()
   getEngines()
   getReadiness()
   sampleLivingWorld(lon, lat, context)
   sampleUV(u, v, context)
   buildRuntimeField(width, height, options)

   CANONICAL_SEQUENCE=
   Land carves.
   Water fills.
   Foliage responds.
   Animals inhabit.
   Runtime coordinates.
   Compositor reveals.
*/

(function bindAudraliaLivingWorldRuntime(global) {
  "use strict";

  const VERSION = "AUDRALIA_G2_LIVING_WORLD_RUNTIME_CONTROL_ENGINE_TNT_v1";
  const RUNTIME_ID = "audralia-living-world-runtime";
  const PLANET_ID = "audrelia";
  const CANONICAL_PLANET_ID = "audralia";
  const LABEL = "Audralia Living World Runtime";
  const TYPE = "living-world-runtime";

  const ENGINE_PATHS = {
    land: "/assets/audralia.land.render.js",
    water: "/assets/audralia.water.render.js",
    foliage: "/assets/audralia.foliage.render.js",
    animals: "/assets/audralia.animals.render.js"
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function normalizeLon(lon) {
    let out = Number(lon) || 0;
    while (out > 180) out -= 360;
    while (out < -180) out += 360;
    return out;
  }

  function normalizeLat(lat) {
    return clamp(Number(lat) || 0, -90, 90);
  }

  function findBridge() {
    global.DiamondGateBridge = global.DiamondGateBridge || {};
    return global.DiamondGateBridge;
  }

  function firstAvailable(list) {
    for (let i = 0; i < list.length; i += 1) {
      if (list[i]) return list[i];
    }

    return null;
  }

  function findLandEngine() {
    const bridge = findBridge();

    return firstAvailable([
      global.DGBAudraliaLandRenderEngine,
      global.DGBAudreliaLandRenderEngine,
      bridge.DGBAudraliaLandRenderEngine,
      bridge.DGBAudreliaLandRenderEngine
    ]);
  }

  function findWaterEngine() {
    const bridge = findBridge();

    return firstAvailable([
      global.DGBAudraliaWaterRenderEngine,
      global.DGBAudreliaWaterRenderEngine,
      bridge.DGBAudraliaWaterRenderEngine,
      bridge.DGBAudreliaWaterRenderEngine
    ]);
  }

  function findFoliageEngine() {
    const bridge = findBridge();

    return firstAvailable([
      global.DGBAudraliaFoliageRenderEngine,
      global.DGBAudreliaFoliageRenderEngine,
      bridge.DGBAudraliaFoliageRenderEngine,
      bridge.DGBAudreliaFoliageRenderEngine
    ]);
  }

  function findAnimalsEngine() {
    const bridge = findBridge();

    return firstAvailable([
      global.DGBAudraliaAnimalsRenderEngine,
      global.DGBAudreliaAnimalsRenderEngine,
      bridge.DGBAudraliaAnimalsRenderEngine,
      bridge.DGBAudreliaAnimalsRenderEngine
    ]);
  }

  function getEngines() {
    const land = findLandEngine();
    const water = findWaterEngine();
    const foliage = findFoliageEngine();
    const animals = findAnimalsEngine();

    return {
      land,
      water,
      foliage,
      animals
    };
  }

  function getEngineStatus(engine) {
    if (!engine) {
      return {
        ok: false,
        loaded: false,
        missing: true
      };
    }

    if (typeof engine.getStatus === "function") {
      try {
        return Object.assign(
          {
            ok: true,
            loaded: true,
            missing: false
          },
          engine.getStatus()
        );
      } catch (error) {
        return {
          ok: false,
          loaded: true,
          missing: false,
          errored: true,
          error: String(error && error.message ? error.message : error)
        };
      }
    }

    return {
      ok: true,
      loaded: true,
      missing: false,
      statusUnavailable: true,
      id: engine.id || "unknown-engine",
      version: engine.version || engine.VERSION || "unknown-version"
    };
  }

  function getReadiness() {
    const engines = getEngines();

    const landStatus = getEngineStatus(engines.land);
    const waterStatus = getEngineStatus(engines.water);
    const foliageStatus = getEngineStatus(engines.foliage);
    const animalsStatus = getEngineStatus(engines.animals);

    const landLoaded = !!engines.land;
    const waterLoaded = !!engines.water;
    const foliageLoaded = !!engines.foliage;
    const animalsLoaded = !!engines.animals;

    const allEnginesLoaded = landLoaded && waterLoaded && foliageLoaded && animalsLoaded;
    const anyMissing = !allEnginesLoaded;

    return {
      ok: true,
      runtime: RUNTIME_ID,
      planetId: PLANET_ID,
      canonicalPlanetId: CANONICAL_PLANET_ID,
      version: VERSION,
      landLoaded,
      waterLoaded,
      foliageLoaded,
      animalsLoaded,
      allEnginesLoaded,
      chainReady: allEnginesLoaded,
      fallbackActive: anyMissing,
      sampleChainReady: true,
      compositorReady: true,
      visualPassClaimed: false,
      paths: Object.assign({}, ENGINE_PATHS),
      statuses: {
        land: landStatus,
        water: waterStatus,
        foliage: foliageStatus,
        animals: animalsStatus
      }
    };
  }

  function safeCall(fn, fallback) {
    try {
      return fn();
    } catch (error) {
      return Object.assign({}, fallback, {
        ok: false,
        error: String(error && error.message ? error.message : error)
      });
    }
  }

  function fallbackLandSample(lon, lat) {
    return {
      ok: true,
      fallback: true,
      engine: "runtime-fallback-land",
      planet: CANONICAL_PLANET_ID,
      lon,
      lat,
      landMask: 0,
      hardLandMask: 0,
      terrain: -1,
      continentField: 0,
      coastlinePressure: 0,
      elevation: 0,
      ridge: 0,
      basin: 0,
      mineral: 0,
      dryInterior: 0,
      ancientGeology: 0,
      polarLimit: 0,
      watershedPressure: 0,
      drainageVectorHint: {
        x: 0,
        y: 0,
        magnitude: 0,
        angleDeg: 0
      },
      channelCarve: 0,
      valleyEntrenchment: 0,
      basinCatchment: 0,
      lakeSeat: 0,
      glacialSeat: 0,
      snowlinePressure: 0,
      cirquePressure: 0,
      meltwaterPath: 0,
      coastalOutlet: 0,
      dryWash: 0,
      hydrologyReady: false,
      summitRegion: "runtime_fallback_ocean",
      summitName: "Fallback",
      summitIndex: 0,
      seamSafe: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    };
  }

  function fallbackWaterSample(lon, lat, land) {
    const landMask = clamp(land && land.landMask ? land.landMask : 0, 0, 1);

    return {
      ok: true,
      fallback: true,
      engine: "runtime-fallback-water",
      planet: CANONICAL_PLANET_ID,
      lon,
      lat,
      isWater: 1 - landMask,
      oceanDepth: 1 - landMask,
      shelf: 0,
      reef: 0,
      current: 0,
      currentWarmth: 0,
      coastalMoisture: 0,
      inlandWater: 0,
      wetDryBoundary: 0,
      shorelineFoam: 0,
      turquoiseShelf: 0,
      linkedLandRegion: land && land.summitRegion ? land.summitRegion : "runtime_fallback_ocean",
      linkedSummitName: land && land.summitName ? land.summitName : "Fallback",
      landDependencyUsed: false,
      seamSafe: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    };
  }

  function fallbackFoliageSample(lon, lat, land, water) {
    return {
      ok: true,
      fallback: true,
      engine: "runtime-fallback-foliage",
      planet: CANONICAL_PLANET_ID,
      lon,
      lat,
      foliageDensity: 0,
      forest: 0,
      grassland: 0,
      scrub: 0,
      fertileBasin: 0,
      coastalVegetation: 0,
      mountainVegetationLimit: 0,
      polarLimit: land && land.polarLimit ? land.polarLimit : 0,
      climateGreen: 0,
      matureEcology: 0,
      biomeColorInfluence: {
        deepForest: 0,
        grassland: 0,
        scrub: 0,
        fertileGreen: 0,
        coastalGreen: 0,
        oldGrowth: 0,
        alpineLimit: 0,
        polarLimit: land && land.polarLimit ? land.polarLimit : 0
      },
      linkedLandRegion: land && land.summitRegion ? land.summitRegion : "runtime_fallback_ocean",
      linkedSummitName: land && land.summitName ? land.summitName : "Fallback",
      landDependencyUsed: false,
      waterDependencyUsed: false,
      seamSafe: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    };
  }

  function fallbackAnimalsSample(lon, lat, land, water, foliage) {
    return {
      ok: true,
      fallback: true,
      engine: "runtime-fallback-animals",
      planet: CANONICAL_PLANET_ID,
      lon,
      lat,
      animalDensity: 0,
      migrationTrace: 0,
      herdSignal: 0,
      birdPath: 0,
      marineLife: 0,
      reefLife: 0,
      coastalLife: 0,
      shelteredEcology: 0,
      ecosystemDensity: 0,
      ecologyPulse: 0,
      lifeColorInfluence: {
        herdWarmth: 0,
        birdTrace: 0,
        marineShimmer: 0,
        reefLife: 0,
        coastalActivity: 0,
        ecologyPulse: 0,
        ecosystemDensity: 0
      },
      linkedLandRegion: land && land.summitRegion ? land.summitRegion : "runtime_fallback_ocean",
      linkedSummitName: land && land.summitName ? land.summitName : "Fallback",
      landDependencyUsed: false,
      waterDependencyUsed: false,
      foliageDependencyUsed: false,
      globeScaleSignalsOnly: true,
      noOversizedAnimalIcons: true,
      seamSafe: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    };
  }

  function callLandEngine(engine, lon, lat, context) {
    if (!engine) return fallbackLandSample(lon, lat);

    if (typeof engine.sampleLand === "function") {
      return safeCall(function call() {
        return engine.sampleLand(lon, lat, context);
      }, fallbackLandSample(lon, lat));
    }

    if (typeof engine.sample === "function") {
      return safeCall(function call() {
        return engine.sample(lon, lat, context);
      }, fallbackLandSample(lon, lat));
    }

    return fallbackLandSample(lon, lat);
  }

  function callWaterEngine(engine, lon, lat, context) {
    if (!engine) return fallbackWaterSample(lon, lat, context.land);

    if (typeof engine.sampleWater === "function") {
      return safeCall(function call() {
        return engine.sampleWater(lon, lat, context);
      }, fallbackWaterSample(lon, lat, context.land));
    }

    if (typeof engine.sample === "function") {
      return safeCall(function call() {
        return engine.sample(lon, lat, context);
      }, fallbackWaterSample(lon, lat, context.land));
    }

    return fallbackWaterSample(lon, lat, context.land);
  }

  function callFoliageEngine(engine, lon, lat, context) {
    if (!engine) return fallbackFoliageSample(lon, lat, context.land, context.water);

    if (typeof engine.sampleFoliage === "function") {
      return safeCall(function call() {
        return engine.sampleFoliage(lon, lat, context);
      }, fallbackFoliageSample(lon, lat, context.land, context.water));
    }

    if (typeof engine.sample === "function") {
      return safeCall(function call() {
        return engine.sample(lon, lat, context);
      }, fallbackFoliageSample(lon, lat, context.land, context.water));
    }

    return fallbackFoliageSample(lon, lat, context.land, context.water);
  }

  function callAnimalsEngine(engine, lon, lat, context) {
    if (!engine) return fallbackAnimalsSample(lon, lat, context.land, context.water, context.foliage);

    if (typeof engine.sampleAnimals === "function") {
      return safeCall(function call() {
        return engine.sampleAnimals(lon, lat, context);
      }, fallbackAnimalsSample(lon, lat, context.land, context.water, context.foliage));
    }

    if (typeof engine.sample === "function") {
      return safeCall(function call() {
        return engine.sample(lon, lat, context);
      }, fallbackAnimalsSample(lon, lat, context.land, context.water, context.foliage));
    }

    return fallbackAnimalsSample(lon, lat, context.land, context.water, context.foliage);
  }

  function sampleLivingWorld(lonInput, latInput, context) {
    const lon = normalizeLon(lonInput);
    const lat = normalizeLat(latInput);
    const incomingContext = context || {};
    const engines = getEngines();
    const readiness = getReadiness();

    const landContext = Object.assign({}, incomingContext, {
      runtime: RUNTIME_ID,
      readiness
    });

    const land = incomingContext.land || callLandEngine(engines.land, lon, lat, landContext);

    const waterContext = Object.assign({}, incomingContext, {
      runtime: RUNTIME_ID,
      readiness,
      land
    });

    const water = incomingContext.water || callWaterEngine(engines.water, lon, lat, waterContext);

    const foliageContext = Object.assign({}, incomingContext, {
      runtime: RUNTIME_ID,
      readiness,
      land,
      water
    });

    const foliage =
      incomingContext.foliage ||
      callFoliageEngine(engines.foliage, lon, lat, foliageContext);

    const animalsContext = Object.assign({}, incomingContext, {
      runtime: RUNTIME_ID,
      readiness,
      land,
      water,
      foliage
    });

    const animals =
      incomingContext.animals ||
      callAnimalsEngine(engines.animals, lon, lat, animalsContext);

    const fallbackActive =
      readiness.fallbackActive ||
      !!land.fallback ||
      !!water.fallback ||
      !!foliage.fallback ||
      !!animals.fallback;

    return {
      ok: true,
      runtime: RUNTIME_ID,
      planetId: PLANET_ID,
      canonicalPlanetId: CANONICAL_PLANET_ID,
      version: VERSION,
      lon,
      lat,
      land,
      water,
      foliage,
      animals,
      readiness: Object.assign({}, readiness, {
        fallbackActive
      }),
      runtimeStatus: {
        chainOrder: [
          "land",
          "water",
          "foliage",
          "animals"
        ],
        landSampled: !!land,
        waterSampled: !!water,
        foliageSampled: !!foliage,
        animalsSampled: !!animals,
        sampleChainReady: true,
        fallbackActive,
        visualPassClaimed: false
      },
      seamSafe: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    };
  }

  function sampleUV(u, v, context) {
    const safeU = ((Number(u) || 0) % 1 + 1) % 1;
    const safeV = clamp(Number(v) || 0, 0, 1);
    const lon = safeU * 360 - 180;
    const lat = 90 - safeV * 180;

    return sampleLivingWorld(lon, lat, context);
  }

  function buildRuntimeField(width, height, options) {
    const w = Math.max(1, Math.floor(Number(width) || 1));
    const h = Math.max(1, Math.floor(Number(height) || 1));
    const channels = 16;
    const data = new Float32Array(w * h * channels);
    let i = 0;

    for (let y = 0; y < h; y += 1) {
      const v = y / Math.max(1, h - 1);

      for (let x = 0; x < w; x += 1) {
        const u = x / w;
        const sample = sampleUV(u, v, options || {});
        const land = sample.land || {};
        const water = sample.water || {};
        const foliage = sample.foliage || {};
        const animals = sample.animals || {};

        data[i] = clamp(land.landMask || 0, 0, 1);
        data[i + 1] = clamp(land.elevation || 0, 0, 1);
        data[i + 2] = clamp(land.ridge || 0, 0, 1);
        data[i + 3] = clamp(land.basin || 0, 0, 1);
        data[i + 4] = clamp(land.glacialSeat || 0, 0, 1);
        data[i + 5] = clamp(land.channelCarve || 0, 0, 1);
        data[i + 6] = clamp(water.isWater || 0, 0, 1);
        data[i + 7] = clamp(water.oceanDepth || 0, 0, 1);
        data[i + 8] = clamp(water.shelf || 0, 0, 1);
        data[i + 9] = clamp(water.reef || 0, 0, 1);
        data[i + 10] = clamp(foliage.foliageDensity || 0, 0, 1);
        data[i + 11] = clamp(foliage.forest || 0, 0, 1);
        data[i + 12] = clamp(foliage.grassland || 0, 0, 1);
        data[i + 13] = clamp(animals.animalDensity || 0, 0, 1);
        data[i + 14] = clamp(animals.ecologyPulse || 0, 0, 1);
        data[i + 15] = sample.readiness && sample.readiness.fallbackActive ? 1 : 0;

        i += channels;
      }
    }

    return {
      ok: true,
      runtime: RUNTIME_ID,
      planetId: PLANET_ID,
      canonicalPlanetId: CANONICAL_PLANET_ID,
      width: w,
      height: h,
      channels,
      channelMap: [
        "landMask",
        "elevation",
        "ridge",
        "basin",
        "glacialSeat",
        "channelCarve",
        "isWater",
        "oceanDepth",
        "shelf",
        "reef",
        "foliageDensity",
        "forest",
        "grassland",
        "animalDensity",
        "ecologyPulse",
        "fallbackActive"
      ],
      data,
      readiness: getReadiness(),
      seamSafe: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    };
  }

  function createProfile() {
    const readiness = getReadiness();

    return {
      id: RUNTIME_ID,
      planetId: PLANET_ID,
      canonicalPlanetId: CANONICAL_PLANET_ID,
      label: LABEL,
      type: TYPE,
      version: VERSION,
      chainPosition: 5,
      chain: "LAND_TO_WATER_TO_FOLIAGE_TO_ANIMALS_TO_RUNTIME_TO_PLANET_COMPOSITOR",
      role: "living_world_runtime_orchestrator",
      ownsRuntimeOnly: true,
      ownsLandLogic: false,
      ownsWaterLogic: false,
      ownsFoliageLogic: false,
      ownsAnimalLogic: false,
      ownsFinalTexturePixels: false,
      ownsRouteShell: false,
      ownsInstrumentProjection: false,
      engineDiscovery: true,
      engineReadinessReceipts: true,
      dependencyOrder: true,
      sharedSampleContext: true,
      coordinatedSampleChain: true,
      fallbackPolicy: true,
      singleHandoffSurfaceForCompositor: true,
      landPath: ENGINE_PATHS.land,
      waterPath: ENGINE_PATHS.water,
      foliagePath: ENGINE_PATHS.foliage,
      animalsPath: ENGINE_PATHS.animals,
      landLoaded: readiness.landLoaded,
      waterLoaded: readiness.waterLoaded,
      foliageLoaded: readiness.foliageLoaded,
      animalsLoaded: readiness.animalsLoaded,
      allEnginesLoaded: readiness.allEnginesLoaded,
      chainReady: readiness.chainReady,
      fallbackActive: readiness.fallbackActive,
      sampleChainReady: readiness.sampleChainReady,
      compositorReady: readiness.compositorReady,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      canonicalSequence: [
        "Land carves",
        "Water fills",
        "Foliage responds",
        "Animals inhabit",
        "Runtime coordinates",
        "Compositor reveals"
      ],
      outputs: [
        "getEngines",
        "getReadiness",
        "sampleLivingWorld",
        "sampleUV",
        "buildRuntimeField",
        "getStatus"
      ],
      forbiddenOwnership: [
        "landTerrainLogic",
        "waterHydrologyLogic",
        "foliageBiomeLogic",
        "animalEcologyLogic",
        "finalTexturePixels",
        "routeShellCopy",
        "visualPageLayout",
        "instrumentProjection",
        "gaugesScoring",
        "productsLogic",
        "sunRendering",
        "moonRendering"
      ]
    };
  }

  function getStatus() {
    const readiness = getReadiness();

    return {
      ok: true,
      id: RUNTIME_ID,
      planetId: PLANET_ID,
      canonicalPlanetId: CANONICAL_PLANET_ID,
      label: LABEL,
      type: TYPE,
      version: VERSION,
      file: "/assets/audralia.living-world.runtime.js",
      chainPosition: 5,
      ownsRuntimeOnly: true,
      runtimeReady: true,
      engineDiscovery: true,
      engineReadinessReceipts: true,
      dependencyOrder: true,
      sharedSampleContext: true,
      coordinatedSampleChain: true,
      fallbackPolicy: true,
      singleHandoffSurfaceForCompositor: true,
      landPath: ENGINE_PATHS.land,
      waterPath: ENGINE_PATHS.water,
      foliagePath: ENGINE_PATHS.foliage,
      animalsPath: ENGINE_PATHS.animals,
      landLoaded: readiness.landLoaded,
      waterLoaded: readiness.waterLoaded,
      foliageLoaded: readiness.foliageLoaded,
      animalsLoaded: readiness.animalsLoaded,
      allEnginesLoaded: readiness.allEnginesLoaded,
      chainReady: readiness.chainReady,
      fallbackActive: readiness.fallbackActive,
      sampleChainReady: readiness.sampleChainReady,
      compositorReady: readiness.compositorReady,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    };
  }

  const api = {
    id: RUNTIME_ID,
    planetId: PLANET_ID,
    canonicalPlanetId: CANONICAL_PLANET_ID,
    label: LABEL,
    type: TYPE,
    version: VERSION,
    VERSION,
    aliases: [
      "audralia-living-world-runtime",
      "audrelia-living-world-runtime",
      "audralia-runtime",
      "audrelia-runtime",
      "living-world-runtime",
      "audralia-control-engine"
    ],
    createProfile,
    getStatus,
    getEngines,
    getReadiness,
    sampleLivingWorld,
    sample: sampleLivingWorld,
    sampleUV,
    buildRuntimeField
  };

  global.DGBAudraliaLivingWorldRuntime = api;
  global.DGBAudreliaLivingWorldRuntime = api;

  global.DiamondGateBridge = global.DiamondGateBridge || {};
  global.DiamondGateBridge.DGBAudraliaLivingWorldRuntime = api;
  global.DiamondGateBridge.DGBAudreliaLivingWorldRuntime = api;

  try {
    global.dispatchEvent(
      new CustomEvent("dgb:audralia:living-world-runtime-ready", {
        detail: getStatus()
      })
    );

    global.dispatchEvent(
      new CustomEvent("dgb:audrelia:living-world-runtime-ready", {
        detail: getStatus()
      })
    );
  } catch (_) {}
})(typeof window !== "undefined" ? window : globalThis);

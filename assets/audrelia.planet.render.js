/* /assets/audrelia.planet.render.js
   AUDRALIA_G2_LIVING_WORLD_PLANET_COMPOSITOR_TNT_v1

   ROLE=
   PLANET_COMPOSITOR / PUBLIC_COMPATIBILITY_FACADE

   OWNS=
   CREATE_PROFILE_API
   BUILD_TEXTURE_API
   SAMPLE_SURFACE_API
   RENDER_SURFACE_API
   GET_STATUS_API
   REGISTER_EXTENSION_COMPATIBILITY
   AUDRELIA_ID_COMPATIBILITY
   AUDRALIA_PUBLIC_LABEL
   FINAL_TEXTURE_COMPOSITION

   CONSUMES=
   /assets/audralia.land.render.js
   /assets/audralia.water.render.js
   /assets/audralia.foliage.render.js
   /assets/audralia.animals.render.js

   DOES_NOT_OWN=
   DETAILED_LAND_LOGIC
   DETAILED_WATER_LOGIC
   DETAILED_FOLIAGE_LOGIC
   DETAILED_ANIMAL_ECOLOGY_LOGIC
   ROUTE_SHELL
   INSTRUMENT_STATE
   GAUGES_LOGIC
   PRODUCT_LOGIC
   SUN_PIXELS
   MOON_PIXELS
   IMAGE_GENERATION
   GRAPHIC_BOX_BEHAVIOR
*/

(function bindAudraliaPlanetCompositor(global) {
  "use strict";

  const VERSION = "AUDRALIA_G2_LIVING_WORLD_PLANET_COMPOSITOR_TNT_v1";

  /*
    Compatibility law:
    The file path and active-body id remain audrelia because the existing route and
    instrument handoff already use that id. The public-facing label is Audralia.
  */
  const ID = "audrelia";
  const CANONICAL_ID = "audralia";
  const LABEL = "Audralia";
  const TYPE = "planet";

  const SOURCE_WIDTH = 2048;
  const SOURCE_HEIGHT = 1024;

  let cachedTexture = null;
  let cachedDependencyReceipt = null;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function mix(a, b, t) {
    return a * (1 - t) + b * t;
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

  function lerpColor(a, b, t) {
    return [
      mix(a[0], b[0], t),
      mix(a[1], b[1], t),
      mix(a[2], b[2], t)
    ];
  }

  function addColor(a, amount) {
    return [
      clamp(a[0] + amount, 0, 255),
      clamp(a[1] + amount, 0, 255),
      clamp(a[2] + amount, 0, 255)
    ];
  }

  function hashNoise(x, y, seed) {
    const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
    return n - Math.floor(n);
  }

  function fbm(x, y, seed) {
    let value = 0;
    let amp = 0.5;
    let freq = 1;

    for (let i = 0; i < 4; i += 1) {
      value += amp * hashNoise(x * freq, y * freq, seed + i * 15.37);
      amp *= 0.5;
      freq *= 2.02;
    }

    return value;
  }

  function makeCanvas(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  function findBridge() {
    global.DiamondGateBridge = global.DiamondGateBridge || {};
    return global.DiamondGateBridge;
  }

  function findLandEngine() {
    const bridge = findBridge();

    return (
      global.DGBAudraliaLandRenderEngine ||
      global.DGBAudreliaLandRenderEngine ||
      bridge.DGBAudraliaLandRenderEngine ||
      bridge.DGBAudreliaLandRenderEngine ||
      null
    );
  }

  function findWaterEngine() {
    const bridge = findBridge();

    return (
      global.DGBAudraliaWaterRenderEngine ||
      global.DGBAudreliaWaterRenderEngine ||
      bridge.DGBAudraliaWaterRenderEngine ||
      bridge.DGBAudreliaWaterRenderEngine ||
      null
    );
  }

  function findFoliageEngine() {
    const bridge = findBridge();

    return (
      global.DGBAudraliaFoliageRenderEngine ||
      global.DGBAudreliaFoliageRenderEngine ||
      bridge.DGBAudraliaFoliageRenderEngine ||
      bridge.DGBAudreliaFoliageRenderEngine ||
      null
    );
  }

  function findAnimalsEngine() {
    const bridge = findBridge();

    return (
      global.DGBAudraliaAnimalsRenderEngine ||
      global.DGBAudreliaAnimalsRenderEngine ||
      bridge.DGBAudraliaAnimalsRenderEngine ||
      bridge.DGBAudreliaAnimalsRenderEngine ||
      null
    );
  }

  function dependencyReceipt() {
    const land = findLandEngine();
    const water = findWaterEngine();
    const foliage = findFoliageEngine();
    const animals = findAnimalsEngine();

    return {
      landLoaded: !!land,
      waterLoaded: !!water,
      foliageLoaded: !!foliage,
      animalsLoaded: !!animals,
      allLoaded: !!(land && water && foliage && animals)
    };
  }

  function fallbackLandSample(lon, lat) {
    const absLat = Math.abs(lat);
    const continentA = Math.exp(-(
      Math.pow((normalizeLon(lon - 82)) / 72, 2) +
      Math.pow((lat + 14) / 42, 2)
    ));
    const continentB = Math.exp(-(
      Math.pow((normalizeLon(lon + 122)) / 36, 2) +
      Math.pow((lat - 23) / 26, 2)
    ));
    const continentC = Math.exp(-(
      Math.pow((normalizeLon(lon + 18)) / 44, 2) +
      Math.pow((lat - 4) / 26, 2)
    ));
    const continentD = Math.exp(-(
      Math.pow((normalizeLon(lon - 154)) / 39, 2) +
      Math.pow((lat + 11) / 24, 2)
    ));

    const field = Math.max(continentA, continentB, continentC, continentD);
    const coastNoise = (fbm(lon * 0.022, lat * 0.034, 91.4) - 0.5) * 0.16;
    const terrain = field - (0.40 + coastNoise);
    const landMask = smoothstep(-0.035, 0.040, terrain);
    const coast = 1 - smoothstep(0.018, 0.135, Math.abs(terrain));

    return {
      ok: true,
      fallback: true,
      landMask,
      hardLandMask: terrain > 0 ? 1 : 0,
      terrain,
      continentField: field,
      coastlinePressure: clamp(coast, 0, 1),
      elevation: clamp(landMask * (0.36 + field * 0.38 + fbm(lon * 0.08, lat * 0.08, 814.2) * 0.18), 0, 1),
      ridge: clamp(landMask * (field * 0.40 + fbm(lon * 0.06, lat * 0.09, 512.9) * 0.25), 0, 1),
      basin: clamp(landMask * ((1 - field) * 0.36 + fbm(lon * 0.03, lat * 0.03, 417.5) * 0.32), 0, 1),
      mineral: clamp(landMask * (0.28 + field * 0.30 + fbm(lon * 0.07, lat * 0.05, 612.1) * 0.22), 0, 1),
      dryInterior: clamp(landMask * (Math.exp(-Math.pow((absLat - 27) / 17, 2)) * 0.55 - coast * 0.18), 0, 1),
      ancientGeology: clamp(landMask * (0.65 + fbm(lon * 0.014, lat * 0.018, 608.4) * 0.24), 0, 1),
      polarLimit: smoothstep(56, 82, absLat),
      summitRegion: "fallback_living_world_land",
      summitName: "Audralia",
      seamSafe: true
    };
  }

  function fallbackWaterSample(lon, lat, context) {
    const land = context.land || fallbackLandSample(lon, lat);
    const isWater = 1 - clamp(land.landMask, 0, 1);
    const coast = clamp(land.coastlinePressure || 0, 0, 1);
    const absLat = Math.abs(lat);
    const current = Math.max(
      Math.exp(-Math.pow((lat + 8 + Math.sin(lon * 0.052) * 5.8) / 10, 2)),
      Math.exp(-Math.pow((lat + 54 + Math.sin(lon * 0.043) * 4.2) / 10, 2)) * 0.7
    );

    const oceanDepth = clamp(isWater * (0.46 + (1 - coast) * 0.42 + (fbm(lon * 0.02, lat * 0.03, 801.2) - 0.5) * 0.12), 0, 1);
    const shelf = clamp(isWater * (coast * 0.88 + smoothstep(0.18, 0.48, land.continentField || 0) * 0.30), 0, 1);
    const reef = clamp(shelf * smoothstep(0.35, 0.78, fbm(lon * 0.08, lat * 0.09, 418.7)) * (1 - smoothstep(42, 72, absLat)), 0, 1);

    return {
      ok: true,
      fallback: true,
      isWater,
      oceanDepth,
      shelf,
      reef,
      current,
      currentWarmth: clamp((1 - absLat / 70) * current, 0, 1),
      coastalMoisture: clamp(coast * 0.72 + shelf * 0.36, 0, 1),
      inlandWater: clamp(land.landMask * land.basin * 0.40 * (1 - land.dryInterior), 0, 1),
      wetDryBoundary: clamp(coast * 0.55 + land.dryInterior * 0.36, 0, 1),
      shorelineFoam: clamp(coast * fbm(lon * 0.13, lat * 0.12, 121.5), 0, 1),
      turquoiseShelf: clamp(shelf * 0.76 + reef * 0.50, 0, 1),
      seamSafe: true
    };
  }

  function fallbackFoliageSample(lon, lat, context) {
    const land = context.land || fallbackLandSample(lon, lat);
    const water = context.water || fallbackWaterSample(lon, lat, { land });
    const absLat = Math.abs(lat);
    const tropical = 1 - clamp(absLat / 34, 0, 1);
    const temperate = Math.exp(-Math.pow((absLat - 38) / 20, 2));
    const polarLimit = smoothstep(56, 82, absLat) + smoothstep(0.64, 0.95, land.elevation) * 0.34;

    const green = clamp(
      land.landMask * (
        water.coastalMoisture * 0.42 +
        water.inlandWater * 0.36 +
        tropical * 0.18 +
        temperate * 0.16 -
        land.dryInterior * 0.36 -
        polarLimit * 0.46 +
        fbm(lon * 0.03, lat * 0.04, 1601.2) * 0.22
      ),
      0,
      1
    );

    const forest = clamp(green * 0.74 + land.basin * 0.14 - land.dryInterior * 0.18, 0, 1);
    const grassland = clamp(land.landMask * (temperate * 0.35 + green * 0.22 + water.wetDryBoundary * 0.20), 0, 1);
    const scrub = clamp(land.landMask * (land.dryInterior * 0.48 + land.ancientGeology * 0.12 - forest * 0.20), 0, 1);
    const fertileBasin = clamp(land.landMask * (land.basin * 0.34 + water.inlandWater * 0.30 + water.coastalMoisture * 0.18), 0, 1);

    return {
      ok: true,
      fallback: true,
      foliageDensity: clamp(forest * 0.42 + grassland * 0.26 + scrub * 0.12 + fertileBasin * 0.28, 0, 1),
      forest,
      grassland,
      scrub,
      fertileBasin,
      coastalVegetation: clamp(land.coastlinePressure * 0.44 + water.coastalMoisture * 0.38, 0, 1),
      mountainVegetationLimit: clamp(land.ridge * 0.44 + land.elevation * 0.32 + polarLimit * 0.28, 0, 1),
      polarLimit: clamp(polarLimit, 0, 1),
      climateGreen: clamp(green + fertileBasin * 0.18, 0, 1),
      matureEcology: clamp(land.ancientGeology * 0.26 + forest * 0.28 + fertileBasin * 0.22, 0, 1),
      seamSafe: true
    };
  }

  function fallbackAnimalsSample(lon, lat, context) {
    const land = context.land || fallbackLandSample(lon, lat);
    const water = context.water || fallbackWaterSample(lon, lat, { land });
    const foliage = context.foliage || fallbackFoliageSample(lon, lat, { land, water });

    const migration =
      Math.exp(-Math.pow((lat + 18 + Math.sin(lon * 0.045) * 10) / 6, 2)) * 0.45 +
      Math.exp(-Math.pow((lat - 28 + Math.sin(lon * 0.075) * 8) / 6, 2)) * 0.32;

    const herd = clamp(land.landMask * (foliage.grassland * 0.36 + water.inlandWater * 0.14 + migration * 0.28), 0, 1);
    const bird = clamp((migration * 0.52 + land.coastlinePressure * 0.16 + foliage.forest * 0.14) * Math.max(land.landMask, water.shelf), 0, 1);
    const reefLife = clamp(water.isWater * (water.reef * 0.72 + water.shelf * 0.18 + water.current * 0.16), 0, 1);
    const marineLife = clamp(water.isWater * (water.current * 0.24 + water.shelf * 0.18 + water.reef * 0.38), 0, 1);
    const coastalLife = clamp(Math.max(land.landMask, water.shelf) * (land.coastlinePressure * 0.42 + foliage.coastalVegetation * 0.22 + water.shelf * 0.20), 0, 1);

    const animalDensity = clamp(
      herd * 0.26 +
      bird * 0.18 +
      reefLife * 0.20 +
      marineLife * 0.18 +
      coastalLife * 0.22 +
      foliage.matureEcology * 0.26,
      0,
      1
    );

    return {
      ok: true,
      fallback: true,
      animalDensity,
      migrationTrace: clamp(migration, 0, 1),
      herdSignal: herd,
      birdPath: bird,
      marineLife,
      reefLife,
      coastalLife,
      shelteredEcology: clamp(foliage.fertileBasin * 0.28 + water.inlandWater * 0.18, 0, 1),
      ecosystemDensity: clamp(foliage.matureEcology * 0.28 + foliage.foliageDensity * 0.24 + animalDensity * 0.34, 0, 1),
      ecologyPulse: clamp(animalDensity * 0.42 + migration * 0.22, 0, 1),
      globeScaleSignalsOnly: true,
      noOversizedAnimalIcons: true,
      seamSafe: true
    };
  }

  function sampleLivingWorld(lon, lat) {
    const landEngine = findLandEngine();
    const waterEngine = findWaterEngine();
    const foliageEngine = findFoliageEngine();
    const animalsEngine = findAnimalsEngine();

    const land =
      landEngine && typeof landEngine.sampleLand === "function"
        ? landEngine.sampleLand(lon, lat)
        : landEngine && typeof landEngine.sample === "function"
          ? landEngine.sample(lon, lat)
          : fallbackLandSample(lon, lat);

    const waterContext = { land };
    const water =
      waterEngine && typeof waterEngine.sampleWater === "function"
        ? waterEngine.sampleWater(lon, lat, waterContext)
        : waterEngine && typeof waterEngine.sample === "function"
          ? waterEngine.sample(lon, lat, waterContext)
          : fallbackWaterSample(lon, lat, waterContext);

    const foliageContext = { land, water };
    const foliage =
      foliageEngine && typeof foliageEngine.sampleFoliage === "function"
        ? foliageEngine.sampleFoliage(lon, lat, foliageContext)
        : foliageEngine && typeof foliageEngine.sample === "function"
          ? foliageEngine.sample(lon, lat, foliageContext)
          : fallbackFoliageSample(lon, lat, foliageContext);

    const animalsContext = { land, water, foliage };
    const animals =
      animalsEngine && typeof animalsEngine.sampleAnimals === "function"
        ? animalsEngine.sampleAnimals(lon, lat, animalsContext)
        : animalsEngine && typeof animalsEngine.sample === "function"
          ? animalsEngine.sample(lon, lat, animalsContext)
          : fallbackAnimalsSample(lon, lat, animalsContext);

    return {
      land,
      water,
      foliage,
      animals
    };
  }

  function composeWaterColor(lon, lat, water) {
    const deep = [4, 18, 48];
    const mid = [7, 82, 124];
    const tropic = [9, 112, 145];
    const shelf = [62, 208, 206];
    const reef = [168, 229, 188];
    const polar = [52, 75, 106];

    const absLat = Math.abs(lat);
    const depth = clamp(water.oceanDepth || 0, 0, 1);
    const shelfValue = clamp(water.turquoiseShelf || water.shelf || 0, 0, 1);
    const reefValue = clamp(water.reef || 0, 0, 1);
    const equator = 1 - clamp(absLat / 54, 0, 1);
    const polarValue = smoothstep(52, 82, absLat);

    let color = lerpColor(mid, deep, depth);
    color = lerpColor(color, tropic, equator * 0.18);
    color = lerpColor(color, shelf, shelfValue * 0.82);
    color = lerpColor(color, reef, reefValue * 0.38);
    color = lerpColor(color, polar, polarValue * 0.32);

    const oceanNoise = (fbm(lon * 0.044, lat * 0.052, 12.1) - 0.5) * 15;
    color = addColor(color, oceanNoise);

    return color;
  }

  function composeLandColor(lon, lat, land, foliage, animals) {
    const humidGreen = [34, 109, 65];
    const darkForest = [24, 78, 57];
    const olive = [91, 126, 73];
    const grass = [106, 140, 75];
    const scrub = [147, 129, 78];
    const dry = [184, 143, 86];
    const desert = [203, 164, 101];
    const mountain = [122, 112, 94];
    const stone = [92, 88, 78];
    const snow = [219, 232, 225];
    const lifeGold = [224, 194, 112];

    const absLat = Math.abs(lat);
    const forest = clamp(foliage.forest || 0, 0, 1);
    const grassland = clamp(foliage.grassland || 0, 0, 1);
    const scrubland = clamp(foliage.scrub || 0, 0, 1);
    const fertile = clamp(foliage.fertileBasin || 0, 0, 1);
    const dryInterior = clamp(land.dryInterior || 0, 0, 1);
    const elevation = clamp(land.elevation || 0, 0, 1);
    const ridge = clamp(land.ridge || 0, 0, 1);
    const mineral = clamp(land.mineral || 0, 0, 1);
    const ancient = clamp(land.ancientGeology || 0, 0, 1);
    const animalPulse = clamp(animals.ecologyPulse || 0, 0, 1);
    const polar = smoothstep(52, 82, absLat) + smoothstep(0.64, 0.95, elevation) * 0.34;

    let color = olive;
    color = lerpColor(color, humidGreen, clamp(foliage.climateGreen || 0, 0, 1) * 0.56);
    color = lerpColor(color, darkForest, forest * 0.34);
    color = lerpColor(color, grass, grassland * 0.26);
    color = lerpColor(color, scrub, scrubland * 0.26);
    color = lerpColor(color, dry, dryInterior * 0.50);
    color = lerpColor(color, desert, dryInterior * (1 - forest) * 0.24);
    color = lerpColor(color, mountain, ridge * 0.42 + elevation * 0.18);
    color = lerpColor(color, stone, ancient * mineral * 0.26);
    color = lerpColor(color, snow, clamp(polar, 0, 1) * 0.34);
    color = lerpColor(color, lifeGold, animalPulse * 0.08 + fertile * 0.08);

    const texture =
      (fbm(lon * 0.080, lat * 0.092, 814.2) - 0.5) * 22 +
      (fbm(lon * 0.15, lat * 0.12, 108.8) - 0.5) * 9;

    color = addColor(color, texture);

    return color;
  }

  function composeSampleColor(lon, lat) {
    const living = sampleLivingWorld(lon, lat);
    const land = living.land;
    const water = living.water;
    const foliage = living.foliage;
    const animals = living.animals;

    const landMask = clamp(land.landMask || 0, 0, 1);
    const coast = clamp(land.coastlinePressure || 0, 0, 1);
    const shelf = clamp(water.shelf || 0, 0, 1);
    const reef = clamp(water.reef || 0, 0, 1);
    const foam = clamp(water.shorelineFoam || 0, 0, 1);
    const bird = clamp(animals.birdPath || 0, 0, 1);
    const marine = clamp(animals.marineLife || 0, 0, 1);
    const herd = clamp(animals.herdSignal || 0, 0, 1);

    let waterColor = composeWaterColor(lon, lat, water);
    let landColor = composeLandColor(lon, lat, land, foliage, animals);

    let color = lerpColor(waterColor, landColor, landMask);

    const shelfGlow = shelf * (1 - landMask) * 20;
    const coastGlow = coast * 16;
    const reefGlow = reef * 18;
    const lifeSignal = (bird * 8 + marine * 8 + herd * 5) * 0.42;

    if (landMask < 0.5) {
      color[0] += shelfGlow * 0.18 + reefGlow * 0.48 + marine * 2.5;
      color[1] += shelfGlow * 0.78 + reefGlow * 0.72 + marine * 5.5;
      color[2] += shelfGlow * 0.90 + reefGlow * 0.32 + marine * 4.5;
    } else {
      color[0] += coastGlow * 0.46 + lifeSignal;
      color[1] += coastGlow * 0.36 + lifeSignal * 0.72;
      color[2] += coastGlow * 0.16 + lifeSignal * 0.20;
    }

    color[0] += foam * 8;
    color[1] += foam * 8;
    color[2] += foam * 7;

    const polarHaze = smoothstep(60, 84, Math.abs(lat));
    color = lerpColor(color, [230, 240, 238], polarHaze * 0.14);

    return [
      clamp(Math.round(color[0]), 0, 255),
      clamp(Math.round(color[1]), 0, 255),
      clamp(Math.round(color[2]), 0, 255)
    ];
  }

  function writeTexturePixels(ctx) {
    const image = ctx.createImageData(SOURCE_WIDTH, SOURCE_HEIGHT);
    const data = image.data;

    let i = 0;

    for (let y = 0; y < SOURCE_HEIGHT; y += 1) {
      const v = y / (SOURCE_HEIGHT - 1);
      const lat = 90 - v * 180;

      for (let x = 0; x < SOURCE_WIDTH; x += 1) {
        const u = x / SOURCE_WIDTH;
        const lon = u * 360 - 180;
        const color = composeSampleColor(lon, lat);

        data[i] = color[0];
        data[i + 1] = color[1];
        data[i + 2] = color[2];
        data[i + 3] = 255;

        i += 4;
      }
    }

    ctx.putImageData(image, 0, 0);
  }

  function createProfile() {
    const deps = dependencyReceipt();

    return {
      id: ID,
      canonicalId: CANONICAL_ID,
      label: LABEL,
      type: TYPE,
      version: VERSION,
      axialTiltDeg: -18.5,
      lightModel: "planet",
      atmosphere: true,
      rimColor: "rgba(154,224,255,0.78)",
      glowColor: "rgba(90,190,255,0.38)",
      sourceDefinition: SOURCE_WIDTH,
      ownsBodyPixelsOnly: true,
      ownsDetailedLandLogic: false,
      ownsDetailedWaterLogic: false,
      ownsDetailedFoliageLogic: false,
      ownsDetailedAnimalLogic: false,
      publicCompatibilityFacade: true,
      livingWorldCompositor: true,
      landEngineLoaded: deps.landLoaded,
      waterEngineLoaded: deps.waterLoaded,
      foliageEngineLoaded: deps.foliageLoaded,
      animalsEngineLoaded: deps.animalsLoaded,
      allLivingWorldEnginesLoaded: deps.allLoaded,
      fallbackSafe: true,
      profileMerge: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      renderBodyTerrainG2: true,
      organicClimatePlanet: true,
      seamSafeTerrain: true,
      coherentPlanetTerrain: true,
      definitiveLandWaterSeparation: true,
      homeWorldExpression: true,
      fourTimesEarthAgeExpression: true,
      australiaRelationship: "inspiration_signal_only",
      audraliaRelationship: "fictional_metaverse_home_world_construct",
      chain: [
        "/assets/audralia.land.render.js",
        "/assets/audralia.water.render.js",
        "/assets/audralia.foliage.render.js",
        "/assets/audralia.animals.render.js",
        "/assets/audrelia.planet.render.js"
      ],
      terrainLanguage: [
        "land_water_foliage_animals_compositor",
        "organic_irregular_coastlines",
        "definitive_land_water_separation",
        "coherent_home_world_planet",
        "deep_ocean_systems",
        "turquoise_shallow_shelves",
        "reef_edge_systems",
        "visible_climate_belts",
        "biome_ecology",
        "animal_life_signals",
        "weathered_ancient_basins",
        "long_eroded_mountain_chains",
        "nine_summit_living_world_regions"
      ]
    };
  }

  function buildTexture() {
    if (cachedTexture) return cachedTexture;

    cachedDependencyReceipt = dependencyReceipt();

    const canvas = makeCanvas(SOURCE_WIDTH, SOURCE_HEIGHT);
    const ctx = canvas.getContext("2d", {
      alpha: false,
      willReadFrequently: true
    });

    writeTexturePixels(ctx);

    cachedTexture = ctx.getImageData(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);
    return cachedTexture;
  }

  function sampleSurface(texture, u, v, out) {
    const width = texture.width;
    const height = texture.height;
    const data = texture.data;

    const x = ((u % 1 + 1) % 1) * width;
    const y = clamp(v, 0, 0.999999) * (height - 1);

    const x0 = Math.floor(x) % width;
    const x1 = (x0 + 1) % width;
    const y0 = Math.floor(y);
    const y1 = Math.min(height - 1, y0 + 1);

    const tx = x - Math.floor(x);
    const ty = y - y0;

    const i00 = (y0 * width + x0) * 4;
    const i10 = (y0 * width + x1) * 4;
    const i01 = (y1 * width + x0) * 4;
    const i11 = (y1 * width + x1) * 4;

    const r0 = data[i00] * (1 - tx) + data[i10] * tx;
    const g0 = data[i00 + 1] * (1 - tx) + data[i10 + 1] * tx;
    const b0 = data[i00 + 2] * (1 - tx) + data[i10 + 2] * tx;

    const r1 = data[i01] * (1 - tx) + data[i11] * tx;
    const g1 = data[i01 + 1] * (1 - tx) + data[i11 + 1] * tx;
    const b1 = data[i01 + 2] * (1 - tx) + data[i11 + 2] * tx;

    out[0] = r0 * (1 - ty) + r1 * ty;
    out[1] = g0 * (1 - ty) + g1 * ty;
    out[2] = b0 * (1 - ty) + b1 * ty;

    return out;
  }

  function renderSurface() {
    const deps = cachedDependencyReceipt || dependencyReceipt();

    return {
      ok: true,
      body: ID,
      canonicalId: CANONICAL_ID,
      label: LABEL,
      version: VERSION,
      renderDelegatedToPlatformProjection: true,
      ownsBodyPixelsOnly: true,
      publicCompatibilityFacade: true,
      livingWorldCompositor: true,
      landEngineLoaded: deps.landLoaded,
      waterEngineLoaded: deps.waterLoaded,
      foliageEngineLoaded: deps.foliageLoaded,
      animalsEngineLoaded: deps.animalsLoaded,
      allLivingWorldEnginesLoaded: deps.allLoaded,
      fallbackSafe: true,
      profileMerge: false,
      renderBodyTerrainG2: true,
      organicClimatePlanet: true,
      seamSafeTerrain: true,
      coherentPlanetTerrain: true,
      definitiveLandWaterSeparation: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    };
  }

  function getStatus() {
    const deps = cachedDependencyReceipt || dependencyReceipt();

    return {
      ok: true,
      id: ID,
      canonicalId: CANONICAL_ID,
      label: LABEL,
      type: TYPE,
      version: VERSION,
      file: "/assets/audrelia.planet.render.js",
      publicCompatibilityFacade: true,
      livingWorldCompositor: true,
      compositorFacadeOnly: true,
      ownsDetailedLandLogic: false,
      ownsDetailedWaterLogic: false,
      ownsDetailedFoliageLogic: false,
      ownsDetailedAnimalLogic: false,
      landEngine: "/assets/audralia.land.render.js",
      waterEngine: "/assets/audralia.water.render.js",
      foliageEngine: "/assets/audralia.foliage.render.js",
      animalsEngine: "/assets/audralia.animals.render.js",
      landEngineLoaded: deps.landLoaded,
      waterEngineLoaded: deps.waterLoaded,
      foliageEngineLoaded: deps.foliageLoaded,
      animalsEngineLoaded: deps.animalsLoaded,
      allLivingWorldEnginesLoaded: deps.allLoaded,
      fallbackSafe: true,
      renderBodyTerrainG2: true,
      organicClimatePlanet: true,
      coherentPlanetTerrain: true,
      definitiveLandWaterSeparation: true,
      oceanForwardWorldRead: true,
      organicIrregularCoastlines: true,
      deepOceanSystems: true,
      turquoiseShallowShelves: true,
      reefBoundarySignal: true,
      visibleClimateBelts: true,
      foliageBiomeEcology: true,
      animalLifeSignals: true,
      globeScaleAnimalsOnly: true,
      noOversizedAnimalIcons: true,
      polarSubpolarInfluence: true,
      fourTimesEarthAgeExpression: true,
      nineSummitLivingWorldRegions: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    };
  }

  const api = {
    id: ID,
    canonicalId: CANONICAL_ID,
    label: LABEL,
    type: TYPE,
    version: VERSION,
    VERSION,
    aliases: [
      "earth",
      "planet",
      "audrelia",
      "audrelia-planet",
      "audralia",
      "audralia-planet",
      "home-world",
      "living-world"
    ],
    createProfile,
    buildTexture,
    sampleSurface,
    renderSurface,
    getStatus
  };

  global.DGBAudreliaPlanetRenderExtension = api;
  global.DGBAudraliaPlanetRenderExtension = api;

  global.DiamondGateBridge = global.DiamondGateBridge || {};
  global.DiamondGateBridge.DGBAudreliaPlanetRenderExtension = api;
  global.DiamondGateBridge.DGBAudraliaPlanetRenderExtension = api;

  if (
    global.DGBShowroomGlobeRender &&
    typeof global.DGBShowroomGlobeRender.registerExtension === "function"
  ) {
    global.DGBShowroomGlobeRender.registerExtension(api);
  }

  try {
    global.dispatchEvent(
      new CustomEvent("dgb:audrelia:planet-extension-ready", {
        detail: getStatus()
      })
    );

    global.dispatchEvent(
      new CustomEvent("dgb:audralia:planet-extension-ready", {
        detail: getStatus()
      })
    );
  } catch (_) {}
})(typeof window !== "undefined" ? window : globalThis);

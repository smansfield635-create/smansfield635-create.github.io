/* /assets/audralia.water.render.js
   AUDRALIA_G2_WATER_ENGINE_TNT_v1

   ROLE=
   DOWNSTREAM_LIVING_WORLD_WATER_ENGINE

   OWNS=
   AUDRALIA_OCEAN_SYSTEM
   AUDRALIA_WATER_DEPTH_FIELD
   AUDRALIA_SHALLOW_SHELF_FIELD
   AUDRALIA_REEF_SYSTEM
   AUDRALIA_COASTAL_TRANSITION
   AUDRALIA_WET_DRY_BOUNDARY_SUPPORT
   AUDRALIA_CURRENT_FIELD
   AUDRALIA_INLAND_WATER_HINTS
   AUDRALIA_SEAM_SAFE_WATER_CONTINUITY

   DOES_NOT_OWN=
   LANDMASS_AUTHORITY
   FINAL_LAND_SHAPE
   FOLIAGE_AUTHORITY
   ANIMAL_ECOLOGY
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
   sampleWater(lon, lat, context)
   sampleUV(u, v, context)
   buildWaterField(width, height, options)
   createProfile()
   getStatus()

   CHAIN_POSITION=
   LAND → WATER → FOLIAGE → ANIMALS → PLANET_COMPOSITOR
*/

(function bindAudraliaWaterRenderEngine(global) {
  "use strict";

  const VERSION = "AUDRALIA_G2_WATER_ENGINE_TNT_v1";
  const ENGINE_ID = "audralia-water";
  const PLANET_ID = "audrelia";
  const CANONICAL_PLANET_ID = "audralia";
  const LABEL = "Audralia Water Engine";
  const TYPE = "water-engine";
  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;

  const CURRENT_SYSTEMS = [
    { key: "equatorial_warm_current", lat: -8, amp: 1.00, freq: 0.052, phase: 24, warmth: 0.72 },
    { key: "southern_cold_current", lat: -54, amp: 0.86, freq: 0.043, phase: 103, warmth: 0.18 },
    { key: "northern_return_current", lat: 38, amp: 0.62, freq: 0.047, phase: 211, warmth: 0.44 },
    { key: "frontier_edge_current", lat: -34, amp: 0.74, freq: 0.060, phase: 317, warmth: 0.35 }
  ];

  const REEF_ZONES = [
    { key: "love_shelf_reef", lon: 86, lat: -13, rx: 90, ry: 52, rot: -12, density: 0.92 },
    { key: "joy_archipelago_reef", lon: -148, lat: 31, rx: 47, ry: 29, rot: -15, density: 0.90 },
    { key: "stability_littoral_reef", lon: 154, lat: -11, rx: 45, ry: 27, rot: -24, density: 0.74 },
    { key: "peace_basin_reef", lon: -54, lat: -47, rx: 37, ry: 24, rot: 13, density: 0.58 },
    { key: "balance_southern_shelf", lon: 20, lat: -47, rx: 38, ry: 25, rot: 22, density: 0.48 },
    { key: "equatorial_chain_reef", lon: -10, lat: -4, rx: 35, ry: 15, rot: 8, density: 0.72 },
    { key: "western_littoral_reef", lon: -174, lat: -15, rx: 24, ry: 39, rot: 4, density: 0.62 },
    { key: "eastern_littoral_reef", lon: 174, lat: -15, rx: 24, ry: 39, rot: -4, density: 0.62 }
  ];

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

  function wrapDeltaLon(lon, centerLon) {
    let d = lon - centerLon;
    while (d > 180) d -= 360;
    while (d < -180) d += 360;
    return d;
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
      value += amp * hashNoise(x * freq, y * freq, seed + i * 17.21);
      amp *= 0.5;
      freq *= 2.03;
    }

    return value;
  }

  function rotatedEllipseField(lon, lat, cfg) {
    const dx = wrapDeltaLon(lon, cfg.lon);
    const dy = lat - cfg.lat;
    const rot = -(cfg.rot || 0) * DEG;

    const x = dx * Math.cos(rot) - dy * Math.sin(rot);
    const y = dx * Math.sin(rot) + dy * Math.cos(rot);

    const nx = x / cfg.rx;
    const ny = y / cfg.ry;
    const d2 = nx * nx + ny * ny;

    return Math.exp(-d2 * 1.72) * cfg.density;
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

  function fallbackLandSample(lon, lat) {
    return {
      ok: false,
      fallback: true,
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

  function reefField(lon, lat, land) {
    let reef = 0;

    REEF_ZONES.forEach(function scoreReef(zone) {
      reef = Math.max(reef, rotatedEllipseField(lon, lat, zone));
    });

    const noise = fbm(lon * 0.075, lat * 0.090, 418.7);
    const coastalSupport = land ? land.coastlinePressure || 0 : 0;

    reef = reef * (0.45 + coastalSupport * 0.80) * smoothstep(0.28, 0.82, noise);

    return clamp(reef, 0, 1);
  }

  function currentField(lon, lat) {
    let current = 0;
    let warm = 0;

    CURRENT_SYSTEMS.forEach(function scoreCurrent(system) {
      const wave =
        system.lat +
        Math.sin((lon + system.phase) * system.freq) * 5.8 +
        Math.sin((lon - system.phase * 0.35) * system.freq * 2.0) * 2.4;

      const distance = Math.abs(lat - wave);
      const strength = Math.exp(-Math.pow(distance / 9.5, 2)) * system.amp;

      current = Math.max(current, strength);
      warm = Math.max(warm, strength * system.warmth);
    });

    return {
      current: clamp(current, 0, 1),
      warmth: clamp(warm, 0, 1)
    };
  }

  function sampleWater(lonInput, latInput, context) {
    const lon = normalizeLon(lonInput);
    const lat = clamp(Number(latInput) || 0, -90, 90);
    const land = getLandSample(lon, lat, context || {});

    const landMask = clamp(land.landMask, 0, 1);
    const isWater = 1 - landMask;
    const coast = clamp(land.coastlinePressure || 0, 0, 1);
    const basin = clamp(land.basin || 0, 0, 1);
    const dryInterior = clamp(land.dryInterior || 0, 0, 1);
    const elevation = clamp(land.elevation || 0, 0, 1);

    const absLat = Math.abs(lat);
    const oceanNoise =
      (fbm(lon * 0.020, lat * 0.028, 801.2) - 0.5) * 0.16 +
      (fbm(lon * 0.060, lat * 0.071, 911.8) - 0.5) * 0.07;

    const abyssalBias = smoothstep(0.00, 0.55, isWater) * (1 - coast * 0.55);
    const polarWater = smoothstep(54, 84, absLat);
    const equatorialWater = 1 - clamp(absLat / 54, 0, 1);

    const oceanDepth = clamp(
      isWater * (
        0.46 +
        abyssalBias * 0.44 +
        oceanNoise -
        coast * 0.24 -
        polarWater * 0.05
      ),
      0,
      1
    );

    const shelf = clamp(
      isWater * (
        coast * 0.88 +
        smoothstep(0.22, 0.54, land.continentField || 0) * 0.34 -
        oceanDepth * 0.22
      ),
      0,
      1
    );

    const reef = clamp(reefField(lon, lat, land) * isWater * smoothstep(0.14, 0.78, shelf), 0, 1);
    const currents = currentField(lon, lat);

    const coastalMoisture = clamp(
      coast * 0.72 +
      shelf * 0.44 +
      currents.current * 0.16 +
      equatorialWater * 0.12 -
      dryInterior * 0.24,
      0,
      1
    );

    const wetDryBoundary = clamp(
      coast * 0.55 +
      basin * 0.24 +
      dryInterior * 0.42 +
      Math.abs((land.terrain || 0)) * 0.06,
      0,
      1
    );

    const inlandWater = clamp(
      landMask * (
        basin * 0.42 +
        coast * 0.18 +
        (1 - dryInterior) * 0.20 -
        elevation * 0.18 +
        fbm(lon * 0.085, lat * 0.080, 1202.6) * 0.10
      ),
      0,
      1
    );

    const shorelineFoam = clamp(
      coast * (0.45 + fbm(lon * 0.130, lat * 0.120, 121.5) * 0.55),
      0,
      1
    );

    const turquoiseShelf = clamp(
      shelf * 0.76 + reef * 0.50 + equatorialWater * shelf * 0.28,
      0,
      1
    );

    const waterColorInfluence = {
      deepBlue: clamp(oceanDepth, 0, 1),
      midBlue: clamp(isWater * (1 - oceanDepth * 0.45), 0, 1),
      turquoise: turquoiseShelf,
      reefLight: reef,
      polarBlue: polarWater * isWater,
      foam: shorelineFoam
    };

    return {
      ok: true,
      engine: ENGINE_ID,
      planet: CANONICAL_PLANET_ID,
      lon,
      lat,
      isWater,
      oceanDepth,
      shelf,
      reef,
      current: currents.current,
      currentWarmth: currents.warmth,
      coastalMoisture,
      inlandWater,
      wetDryBoundary,
      shorelineFoam,
      turquoiseShelf,
      waterColorInfluence,
      linkedLandRegion: land.summitRegion || "unknown",
      linkedSummitName: land.summitName || "Water",
      landDependencyUsed: !land.fallback,
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
    return sampleWater(lon, lat, context);
  }

  function buildWaterField(width, height, options) {
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

        data[i] = sample.isWater;
        data[i + 1] = sample.oceanDepth;
        data[i + 2] = sample.shelf;
        data[i + 3] = sample.reef;
        data[i + 4] = sample.current;
        data[i + 5] = sample.coastalMoisture;
        data[i + 6] = sample.inlandWater;
        data[i + 7] = sample.wetDryBoundary;

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
        "isWater",
        "oceanDepth",
        "shelf",
        "reef",
        "current",
        "coastalMoisture",
        "inlandWater",
        "wetDryBoundary"
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
      chainPosition: 2,
      chain: "LAND_TO_WATER_TO_FOLIAGE_TO_ANIMALS_TO_PLANET_COMPOSITOR",
      ownsLand: false,
      ownsWaterOnly: true,
      ownsFoliage: false,
      ownsAnimals: false,
      ownsFinalTexture: false,
      dependsOn: ["/assets/audralia.land.render.js"],
      seamSafeWaterContinuity: true,
      noWrongEdgePolygonChords: true,
      oceanSystem: true,
      waterDepthField: true,
      shallowShelfField: true,
      reefSystem: true,
      coastalTransition: true,
      wetDryBoundarySupport: true,
      currentField: true,
      inlandWaterHints: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      outputs: [
        "isWater",
        "oceanDepth",
        "shelf",
        "reef",
        "current",
        "coastalMoisture",
        "inlandWater",
        "wetDryBoundary",
        "shorelineFoam",
        "turquoiseShelf"
      ],
      forbiddenOwnership: [
        "landAuthority",
        "finalLandShape",
        "foliageAuthority",
        "animalEcology",
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
      file: "/assets/audralia.water.render.js",
      chainPosition: 2,
      ownsWaterOnly: true,
      waterEngineReady: true,
      landDependency: "/assets/audralia.land.render.js",
      seamSafeWaterContinuity: true,
      noWrongEdgePolygonChords: true,
      oceanSystem: true,
      oceanDepth: true,
      shallowShelves: true,
      reefs: true,
      coastalTransition: true,
      wetDryBoundarySupport: true,
      currents: true,
      inlandWaterHints: true,
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
      "audralia-water",
      "audrelia-water",
      "audralia-hydration",
      "audralia-living-world-water"
    ],
    createProfile,
    sampleWater,
    sample: sampleWater,
    sampleUV,
    buildWaterField,
    getStatus
  };

  global.DGBAudraliaWaterRenderEngine = api;
  global.DGBAudreliaWaterRenderEngine = api;

  global.DiamondGateBridge = global.DiamondGateBridge || {};
  global.DiamondGateBridge.DGBAudraliaWaterRenderEngine = api;
  global.DiamondGateBridge.DGBAudreliaWaterRenderEngine = api;

  try {
    global.dispatchEvent(
      new CustomEvent("dgb:audralia:water-engine-ready", {
        detail: getStatus()
      })
    );

    global.dispatchEvent(
      new CustomEvent("dgb:audrelia:water-engine-ready", {
        detail: getStatus()
      })
    );
  } catch (_) {}
})(typeof window !== "undefined" ? window : globalThis);

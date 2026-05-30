// /assets/hearth/hearth.materials.js
// HEARTH_MATERIALS_ISLAND_ELEVATION_BEACH_RELIEF_CONSUMER_TNT_v1
// Full-file replacement.
// Materials authority only.
// Purpose:
// - Preserve HEARTH_MATERIALS_NEWS_FIBONACCI_COORDINATE_ELEVATION_CONSUMER_TNT_v2 public API.
// - Reconcile stale elevation requirement to HEARTH_ELEVATION_ISLAND_COASTAL_FEATURE_CONSUMPTION_TNT_v1.
// - Consume composition + active elevation + tectonics + hydrology.
// - Consume island/coastal elevation fields: peninsulas, bays, keys, main islands, island rims, shelves, relief, and coastal cuts.
// - Strengthen beaches, sand shelves, wet stone, cliff-water contact, submerged blocks, submerged scars, island rims, ridges, and inland relief.
// - Preserve atlas continuity and canvas receiver posture.
// Does not own:
// - elevation generation
// - composition classification
// - tectonic pressure generation
// - hydrology classification
// - island geometry
// - canvas drawing authority
// - runtime motion
// - controls
// - route orchestration
// - zoom
// - teleports
// - clickable coastal objects
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_MATERIALS_ISLAND_ELEVATION_BEACH_RELIEF_CONSUMER_TNT_v1";
  const RECEIPT = "HEARTH_MATERIALS_ISLAND_ELEVATION_BEACH_RELIEF_CONSUMER_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_MATERIALS_NEWS_FIBONACCI_COORDINATE_ELEVATION_CONSUMER_TNT_v2";
  const BASELINE_CONTRACT = "HEARTH_MATERIALS_NEWS_FIBONACCI_COORDINATE_ELEVATION_CONSUMER_TNT_v2";
  const OLD_REQUIRED_ELEVATION_CONTRACT = "HEARTH_ELEVATION_NEWS_FIBONACCI_COORDINATE_BODY_RESOLVER_TNT_v3";
  const REQUIRED_ELEVATION_CONTRACT = "HEARTH_ELEVATION_ISLAND_COASTAL_FEATURE_CONSUMPTION_TNT_v1";
  const VERSION = "2026-05-30.hearth-materials-island-elevation-beach-relief-consumer-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const DEG = Math.PI / 180;
  const RAD = 180 / Math.PI;
  const SEA_LEVEL = 0;

  const TERRAIN_CLASSES = Object.freeze([
    "deep_ocean",
    "ocean_basin",
    "continental_shelf",
    "archipelago_shelf",
    "continent_divide",
    "shallow_water",
    "coast_edge",
    "continent_mass",
    "continent_interior",
    "continent_edge",
    "raised_land",
    "plateau_interior",
    "basin_floor",
    "mountain_arc",
    "alpine_ridge",
    "canyon_corridor",
    "cliff_escarpment",
    "waterfall_escarpment",
    "island_arc",
    "attached_peninsula_coast",
    "bay_cut",
    "coastal_inlet_cut",
    "key_island_chain",
    "detached_island_body",
    "polar_icefield",
    "tundra_subpolar",
    "temperate_highland",
    "temperate_coastal_storm",
    "rainforest_wet_basin",
    "monsoon_floodplain",
    "arid_dry_plateau",
    "maritime_archipelago",
    "summit_region"
  ]);

  const MATERIAL_CLASS_MAP = Object.freeze({
    deep_ocean: "water.deep.ocean.body",
    ocean_basin: "water.ocean.basin.readable",
    continental_shelf: "water.shelf.waterline.submerged-block-transition",
    archipelago_shelf: "water.shelf.archipelago.submerged-port-channel",
    continent_divide: "water.divide.carved-strait-submerged-scar",
    shallow_water: "water.shallow.shelf.beach-wetstone-transition",
    coast_edge: "coast.waterline.wetstone.beach-hardedge",
    continent_mass: "land.continent.embodied.mass",
    continent_interior: "land.coordinate.body-seat.interior",
    continent_edge: "land.coordinate.body-seat.edge-waterline",
    raised_land: "land.raised.general",
    plateau_interior: "land.plateau.dense.interior",
    basin_floor: "land.basin.lowland.waterfill-candidate",
    mountain_arc: "land.mountain.arc.relief",
    alpine_ridge: "land.alpine.ridge.coldstone",
    canyon_corridor: "land.canyon.corridor.submerged-scar-feed",
    cliff_escarpment: "land.cliff.water-edge-hard-contact",
    waterfall_escarpment: "land.waterfall.wetstone-drainage-edge",
    island_arc: "land.island.arc.submerged-channel-shelf",

    attached_peninsula_coast: "land.peninsula.attached.coast.wetstone-shelf-edge",
    bay_cut: "water.bay.negative.coastal-carve.shelf-shadow",
    coastal_inlet_cut: "water.inlet.coastal-cut.wetstone-channel",
    key_island_chain: "land.key-island.low-chain.sand-wetstone-rim",
    detached_island_body: "land.detached-island.body.ridge-rim-shelf",

    polar_icefield: "climate.polar.icefield",
    tundra_subpolar: "climate.tundra.subpolar",
    temperate_highland: "climate.temperate.highland",
    temperate_coastal_storm: "coast.storm-weathered-wetstone",
    rainforest_wet_basin: "climate.rainforest.wet.basin",
    monsoon_floodplain: "climate.monsoon.floodplain",
    arid_dry_plateau: "climate.arid.dry.plateau",
    maritime_archipelago: "coast.maritime.submerged-port-channel",
    summit_region: "terrain.summit.region.overlay",

    continental_core: "compat.land.continental.core",
    raised_shield: "compat.land.raised.shield",
    coastal_shelf: "compat.water.coastal.shelf",
    exposed_bridge: "compat.land.exposed.bridge",
    submerged_bridge: "compat.water.submerged.bridge",
    ridge_corridor: "compat.land.ridge.corridor",
    shallow_saddle: "compat.water.shallow.saddle",
    cliff_candidate: "compat.land.cliff",
    valley_candidate: "compat.land.valley",
    mountain_candidate: "compat.land.mountain",
    island_seed: "compat.land.island",
    deep_water: "compat.water.deep"
  });

  const PALETTE = Object.freeze({
    deepWater: [4, 10, 21],
    ocean: [7, 20, 35],
    waterFill: [8, 25, 38],
    shallowShelf: [28, 58, 56],
    mutedShelf: [31, 52, 49],
    beachShelf: [124, 108, 72],
    sandStone: [139, 120, 77],
    wetStone: [42, 52, 48],
    hardCoast: [34, 39, 37],
    cliffEdge: [32, 35, 34],
    submergedBlock: [23, 33, 35],
    submergedScar: [28, 38, 36],
    mineralTrace: [76, 69, 50],
    landBase: [96, 100, 62],
    raisedLand: [111, 108, 69],
    basinLand: [58, 83, 53],
    mountain: [116, 113, 98],
    ridge: [128, 118, 86],
    darkGreen: [45, 62, 50],
    oldStone: [70, 70, 55],
    portBasin: [15, 25, 30],
    coordinateInterior: [119, 109, 71],
    coordinateEdge: [63, 65, 52],
    coordinateSummit: [142, 136, 108],
    peninsula: [98, 91, 61],
    bayCut: [14, 28, 34],
    inletCut: [18, 33, 39],
    keyIsland: [126, 116, 76],
    mainIsland: [104, 98, 66],
    islandRim: [151, 130, 80],
    northCold: [130, 138, 129],
    eastArc: [111, 105, 78],
    westShield: [93, 87, 63],
    southHarsh: [99, 83, 60],
    centerWet: [56, 79, 55]
  });

  const WATER_CLASSES = new Set([
    "deep_ocean",
    "ocean_basin",
    "continental_shelf",
    "archipelago_shelf",
    "continent_divide",
    "shallow_water",
    "bay_cut",
    "coastal_inlet_cut",
    "deep_water",
    "coastal_shelf",
    "submerged_bridge",
    "shallow_saddle"
  ]);

  const LAND_CLASSES = new Set([
    "coast_edge",
    "continent_mass",
    "continent_interior",
    "continent_edge",
    "raised_land",
    "plateau_interior",
    "basin_floor",
    "mountain_arc",
    "alpine_ridge",
    "canyon_corridor",
    "cliff_escarpment",
    "waterfall_escarpment",
    "island_arc",
    "attached_peninsula_coast",
    "key_island_chain",
    "detached_island_body",
    "polar_icefield",
    "tundra_subpolar",
    "temperate_highland",
    "temperate_coastal_storm",
    "rainforest_wet_basin",
    "monsoon_floodplain",
    "arid_dry_plateau",
    "maritime_archipelago",
    "summit_region",
    "continental_core",
    "raised_shield",
    "exposed_bridge",
    "ridge_corridor",
    "cliff_candidate",
    "valley_candidate",
    "mountain_candidate",
    "island_seed"
  ]);

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function mixNumber(a, b, t) {
    const k = clamp01(t);
    return a + (b - a) * k;
  }

  function mixColor(a, b, t) {
    const k = clamp01(t);
    return [
      Math.round(mixNumber(a[0], b[0], k)),
      Math.round(mixNumber(a[1], b[1], k)),
      Math.round(mixNumber(a[2], b[2], k))
    ];
  }

  function scaleColor(base, scalar) {
    const s = Number.isFinite(Number(scalar)) ? Number(scalar) : 1;
    return [
      clamp(Math.round(base[0] * s), 0, 255),
      clamp(Math.round(base[1] * s), 0, 255),
      clamp(Math.round(base[2] * s), 0, 255)
    ];
  }

  function addColor(base, delta, weight = 1) {
    const k = clamp01(weight);
    return [
      clamp(Math.round(base[0] + delta[0] * k), 0, 255),
      clamp(Math.round(base[1] + delta[1] * k), 0, 255),
      clamp(Math.round(base[2] + delta[2] * k), 0, 255)
    ];
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function normalize3(p) {
    const x = Number.isFinite(Number(p && p.x)) ? Number(p.x) : 0;
    const y = Number.isFinite(Number(p && p.y)) ? Number(p.y) : 0;
    const z = Number.isFinite(Number(p && p.z)) ? Number(p.z) : 1;
    const m = Math.hypot(x, y, z) || 1;

    return {
      x: x / m,
      y: y / m,
      z: z / m
    };
  }

  function lonLatToVector(lonDeg, latDeg) {
    const lon = Number(lonDeg || 0) * DEG;
    const lat = Number(latDeg || 0) * DEG;
    const c = Math.cos(lat);

    return normalize3({
      x: Math.sin(lon) * c,
      y: Math.sin(lat),
      z: Math.cos(lon) * c
    });
  }

  function vectorToLonLat(p) {
    const n = normalize3(p);
    return {
      lon: Math.atan2(n.x, n.z) * RAD,
      lat: Math.asin(clamp(n.y, -1, 1)) * RAD
    };
  }

  function lonToU(lon) {
    return ((Number(lon) + 180) / 360 % 1 + 1) % 1;
  }

  function latToV(lat) {
    return clamp((90 - Number(lat)) / 180, 0, 1);
  }

  function parseInput(...args) {
    if (args.length === 1 && args[0] && typeof args[0] === "object") {
      const p = args[0];

      if (
        Number.isFinite(Number(p.x)) &&
        Number.isFinite(Number(p.y)) &&
        Number.isFinite(Number(p.z))
      ) {
        const vector = normalize3(p);
        const ll = vectorToLonLat(vector);

        return {
          ...vector,
          lon: ll.lon,
          lat: ll.lat,
          u: lonToU(ll.lon),
          v: latToV(ll.lat)
        };
      }

      if (Number.isFinite(Number(p.lon)) && Number.isFinite(Number(p.lat))) {
        const lon = Number(p.lon);
        const lat = Number(p.lat);
        const vector = lonLatToVector(lon, lat);

        return {
          ...vector,
          lon,
          lat,
          u: lonToU(lon),
          v: latToV(lat)
        };
      }

      if (Number.isFinite(Number(p.longitude)) && Number.isFinite(Number(p.latitude))) {
        const lon = Number(p.longitude);
        const lat = Number(p.latitude);
        const vector = lonLatToVector(lon, lat);

        return {
          ...vector,
          lon,
          lat,
          u: lonToU(lon),
          v: latToV(lat)
        };
      }

      if (Number.isFinite(Number(p.u)) && Number.isFinite(Number(p.v))) {
        const u = ((Number(p.u) % 1) + 1) % 1;
        const v = clamp(Number(p.v), 0, 1);
        const lon = u * 360 - 180;
        const lat = 90 - v * 180;
        const vector = lonLatToVector(lon, lat);

        return {
          ...vector,
          lon,
          lat,
          u,
          v
        };
      }
    }

    if (args.length >= 3) {
      const vector = normalize3({ x: args[0], y: args[1], z: args[2] });
      const ll = vectorToLonLat(vector);

      return {
        ...vector,
        lon: ll.lon,
        lat: ll.lat,
        u: lonToU(ll.lon),
        v: latToV(ll.lat)
      };
    }

    if (args.length >= 2) {
      const lon = Number(args[0]);
      const lat = Number(args[1]);
      const vector = lonLatToVector(lon, lat);

      return {
        ...vector,
        lon,
        lat,
        u: lonToU(lon),
        v: latToV(lat)
      };
    }

    const vector = lonLatToVector(0, 0);
    return {
      ...vector,
      lon: 0,
      lat: 0,
      u: 0.5,
      v: 0.5
    };
  }

  function hashNoise(x, y, z, salt = 0) {
    const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + salt * 71.37) * 43758.5453123;
    return n - Math.floor(n);
  }

  function textureNoise(p, salt = 0) {
    const n1 = hashNoise(p.x, p.y, p.z, salt);
    const n2 = hashNoise(p.y + n1, p.z - n1, p.x + n1, salt + 13);
    const n3 = hashNoise(p.z - n2, p.x + n2, p.y - n2, salt + 31);
    return clamp01(n1 * 0.44 + n2 * 0.34 + n3 * 0.22);
  }

  function numberField(source, key, fallback = 0) {
    const n = Number(source && source[key]);
    return Number.isFinite(n) ? n : fallback;
  }

  function boolField(source, key, fallback = false) {
    return typeof (source && source[key]) === "boolean" ? source[key] : fallback;
  }

  function stringField(source, key, fallback = "") {
    return typeof (source && source[key]) === "string" && source[key] ? source[key] : fallback;
  }

  function getAuthority(names) {
    for (const name of names) {
      if (root[name] && typeof root[name] === "object") return root[name];
      if (root.HEARTH && root.HEARTH[name] && typeof root.HEARTH[name] === "object") return root.HEARTH[name];
      if (root.DEXTER_LAB && root.DEXTER_LAB[name] && typeof root.DEXTER_LAB[name] === "object") return root.DEXTER_LAB[name];
    }
    return null;
  }

  function getCompositionAuthority() {
    return getAuthority(["HEARTH_COMPOSITION", "HearthComposition", "composition", "compositionAuthority"]);
  }

  function getElevationAuthority() {
    return getAuthority(["HEARTH_ELEVATION", "HearthElevation", "elevation", "elevationAuthority"]);
  }

  function getTectonicsAuthority() {
    return getAuthority(["HEARTH_TECTONICS", "HearthTectonics", "tectonics", "tectonicsAuthority"]);
  }

  function getHydrologyAuthority() {
    return getAuthority(["HEARTH_HYDROLOGY", "HearthHydrology", "hydrology", "hydrologyAuthority"]);
  }

  function callAuthority(authority, methods, args, point) {
    if (!authority || typeof authority !== "object") return null;

    for (const method of methods) {
      if (typeof authority[method] !== "function") continue;

      try {
        const result = authority[method].apply(authority, args);
        if (result && typeof result === "object") return result;
      } catch (_error) {}

      try {
        const result = authority[method].call(authority, point);
        if (result && typeof result === "object") return result;
      } catch (_error2) {}

      try {
        const result = authority[method].call(authority, point.u, point.v, point.lon, point.lat);
        if (result && typeof result === "object") return result;
      } catch (_error3) {}

      try {
        const result = authority[method].call(authority, point.x, point.y, point.z);
        if (result && typeof result === "object") return result;
      } catch (_error4) {}
    }

    return null;
  }

  function normalizeElevation(raw, p) {
    const source = raw && typeof raw === "object" ? raw : {};
    const elevation = numberField(source, "elevation", numberField(source, "height", 0));
    const terrainClassHint = stringField(
      source,
      "terrainClassHint",
      elevation > SEA_LEVEL ? "continent_mass" : elevation > -0.2 ? "shallow_water" : "ocean_basin"
    );

    const sourceContract = stringField(source, "contract", "HEARTH_MATERIALS_FALLBACK_ELEVATION");
    const activeMatch = sourceContract === REQUIRED_ELEVATION_CONTRACT;

    return {
      contract: sourceContract,
      receipt: stringField(source, "receipt", "FALLBACK_ELEVATION_USED"),
      elevation,
      seaLevel: numberField(source, "seaLevel", SEA_LEVEL),

      isLand: boolField(source, "isLand", elevation > SEA_LEVEL),
      isWater: boolField(source, "isWater", elevation <= SEA_LEVEL),
      isShallowWater: boolField(source, "isShallowWater", elevation <= SEA_LEVEL && elevation > -0.2),
      isDeepWater: boolField(source, "isDeepWater", elevation <= -0.2),

      terrainClassHint,

      landPotential: clamp01(numberField(source, "landPotential", elevation > SEA_LEVEL ? 0.6 : 0)),
      waterDepthPotential: clamp01(numberField(source, "waterDepthPotential", elevation <= SEA_LEVEL ? Math.abs(elevation) : 0)),
      oceanBasinPotential: clamp01(numberField(source, "oceanBasinPotential", elevation <= -0.2 ? 0.6 : 0)),
      continentShelfPotential: clamp01(numberField(source, "continentShelfPotential", 0)),
      shelfPotential: clamp01(numberField(source, "shelfPotential", 0)),
      coastPotential: clamp01(numberField(source, "coastPotential", Math.abs(elevation) < 0.15 ? 0.35 : 0)),

      continentId: stringField(source, "continentId", elevation > SEA_LEVEL ? "unresolved_continent" : "open_ocean"),
      continentName: stringField(source, "continentName", elevation > SEA_LEVEL ? "Unresolved Continent" : "Open Ocean"),
      continentIndex: Number.isFinite(Number(source.continentIndex)) ? Number(source.continentIndex) : -1,
      continentPotential: clamp01(numberField(source, "continentPotential", elevation > SEA_LEVEL ? 0.6 : 0)),
      continentSeparation: clamp01(numberField(source, "continentSeparation", 0)),

      newsProtocolActive: boolField(source, "newsProtocolActive", false),
      fibonacciAlignmentActive: boolField(source, "fibonacciAlignmentActive", false),
      newsProtocolSynchronized: boolField(source, "newsProtocolSynchronized", false),
      fibonacciAlignmentSynchronized: boolField(source, "fibonacciAlignmentSynchronized", false),
      activeFibonacciGate: stringField(source, "activeFibonacciGate", "F13"),
      futureFibonacciGate: stringField(source, "futureFibonacciGate", "F21"),

      coordinateBodyResolverActive: boolField(source, "coordinateBodyResolverActive", false),
      coordinateMapRole: stringField(source, "coordinateMapRole", ""),
      coordinateMapIsTectonicOrigin: boolField(source, "coordinateMapIsTectonicOrigin", false),

      bodySeatId: stringField(source, "bodySeatId", "none"),
      bodySeatName: stringField(source, "bodySeatName", "None"),
      bodySeatIndex: Number.isFinite(Number(source.bodySeatIndex)) ? Number(source.bodySeatIndex) : -1,
      bodySeatPressureId: stringField(source, "bodySeatPressureId", ""),
      bodySeatNews: stringField(source, "bodySeatNews", "CENTER"),
      bodySeatFibonacci: stringField(source, "bodySeatFibonacci", "F0"),
      bodySeatDistanceDeg: numberField(source, "bodySeatDistanceDeg", 180),
      bodySeatPressure: clamp01(numberField(source, "bodySeatPressure", 0)),
      bodyInteriorPressure: clamp01(numberField(source, "bodyInteriorPressure", 0)),
      bodyEdgePressure: clamp01(numberField(source, "bodyEdgePressure", 0)),
      bodyBreadthPressure: clamp01(numberField(source, "bodyBreadthPressure", 0)),
      bodyRoughnessPressure: clamp01(numberField(source, "bodyRoughnessPressure", 0)),
      bodyCoordinateClass: stringField(source, "bodyCoordinateClass", "none"),

      oceanSeatId: stringField(source, "oceanSeatId", "none"),
      oceanSeatName: stringField(source, "oceanSeatName", "None"),
      oceanSeatNews: stringField(source, "oceanSeatNews", "CENTER"),
      oceanSeatFibonacci: stringField(source, "oceanSeatFibonacci", "F0"),
      oceanSeatPressure: clamp01(numberField(source, "oceanSeatPressure", 0)),
      oceanDepthPressure: clamp01(numberField(source, "oceanDepthPressure", 0)),

      channelSeatId: stringField(source, "channelSeatId", "none"),
      channelSeatNews: stringField(source, "channelSeatNews", "CENTER"),
      channelSeatFibonacci: stringField(source, "channelSeatFibonacci", "F0"),
      channelSeatPressure: clamp01(numberField(source, "channelSeatPressure", 0)),
      channelCutPressure: clamp01(numberField(source, "channelCutPressure", 0)),

      summitRegionHint: stringField(source, "summitRegionHint", "none"),
      summitRegionLabel: stringField(source, "summitRegionLabel", "None"),
      summitTerrainHint: stringField(source, "summitTerrainHint", "none"),
      summitBookSummit: stringField(source, "summitBookSummit", "none"),
      summitPotential: clamp01(numberField(source, "summitPotential", 0)),
      summitNews: stringField(source, "summitNews", "CENTER"),
      summitFibonacci: stringField(source, "summitFibonacci", "F0"),

      mountainArcPotential: clamp01(numberField(source, "mountainArcPotential", 0)),
      plateauPotential: clamp01(numberField(source, "plateauPotential", 0)),
      canyonPotential: clamp01(numberField(source, "canyonPotential", 0)),
      escarpmentPotential: clamp01(numberField(source, "escarpmentPotential", 0)),
      waterfallCandidate: clamp01(numberField(source, "waterfallCandidate", 0)),
      archipelagoPotential: clamp01(numberField(source, "archipelagoPotential", 0)),
      basinPotential: clamp01(numberField(source, "basinPotential", 0)),
      ridgePotential: clamp01(numberField(source, "ridgePotential", 0)),
      saddlePotential: clamp01(numberField(source, "saddlePotential", 0)),
      islandPotential: clamp01(numberField(source, "islandPotential", 0)),
      scarPotential: clamp01(numberField(source, "scarPotential", 0)),

      islandFeatureCategory: stringField(source, "islandFeatureCategory", "latent"),
      islandFeatureFamily: stringField(source, "islandFeatureFamily", "latent"),
      islandParentCoastRelation: stringField(source, "islandParentCoastRelation", ""),
      islandCoastalRelationOnly: boolField(source, "islandCoastalRelationOnly", false),
      islandDetachedBody: boolField(source, "islandDetachedBody", false),
      islandVisibleIsland: boolField(source, "islandVisibleIsland", false),
      islandFeatureId: stringField(source, "islandFeatureId", ""),
      islandRegion: stringField(source, "islandRegion", ""),
      islandRegionName: stringField(source, "islandRegionName", ""),

      peninsulaStrength: clamp01(numberField(source, "peninsulaStrength", 0)),
      bayCarveStrength: clamp01(numberField(source, "bayCarveStrength", 0)),
      keyStrength: clamp01(numberField(source, "keyStrength", 0)),
      mainIslandStrength: clamp01(numberField(source, "mainIslandStrength", 0)),
      islandStrength: clamp01(numberField(source, "islandStrength", 0)),

      peninsulaElevationInfluence: clamp01(numberField(source, "peninsulaElevationInfluence", 0)),
      bayCarveElevationInfluence: clamp01(numberField(source, "bayCarveElevationInfluence", 0)),
      keyIslandElevationInfluence: clamp01(numberField(source, "keyIslandElevationInfluence", 0)),
      mainIslandElevationInfluence: clamp01(numberField(source, "mainIslandElevationInfluence", 0)),
      detachedIslandElevationInfluence: clamp01(numberField(source, "detachedIslandElevationInfluence", 0)),
      attachedCoastPressure: clamp01(numberField(source, "attachedCoastPressure", 0)),
      coastalCutPressure: clamp01(numberField(source, "coastalCutPressure", 0)),
      islandCoastPressure: clamp01(numberField(source, "islandCoastPressure", 0)),
      islandShelfPressure: clamp01(numberField(source, "islandShelfPressure", 0)),
      islandReliefPressure: clamp01(numberField(source, "islandReliefPressure", 0)),
      inactiveIslandFeatureNoOp: boolField(source, "inactiveIslandFeatureNoOp", true),
      sevenContinentBodySeatsPreserved: boolField(source, "sevenContinentBodySeatsPreserved", true),
      islandsDoNotReplaceBodySeats: boolField(source, "islandsDoNotReplaceBodySeats", true),

      elevationConsumedDirectlyByMaterials: activeMatch,
      activeElevationContractRequired: REQUIRED_ELEVATION_CONTRACT,
      oldElevationContractReconciled: true,
      staleElevationContractReconciled: true,
      elevationAuthorityPresent: Boolean(raw && typeof raw === "object"),
      elevationContractMatchesActive: activeMatch
    };
  }

  function readElevation(...args) {
    const p = parseInput(...args);

    if (args.length === 1 && args[0] && typeof args[0] === "object" && Number.isFinite(Number(args[0].elevation))) {
      return normalizeElevation(args[0], p);
    }

    const elevation = getElevationAuthority();
    const raw = callAuthority(
      elevation,
      ["sample", "read", "getElevation", "sampleElevation", "readElevation"],
      args,
      p
    );

    return normalizeElevation(raw, p);
  }

  function fallbackComposition(p, elevation) {
    const n = textureNoise(p, 5);
    const isLand = elevation.isLand;
    const terrainClass = elevation.terrainClassHint || (isLand ? "continent_mass" : "ocean_basin");

    return {
      contract: "HEARTH_MATERIALS_FALLBACK_COMPOSITION_FROM_ACTIVE_ELEVATION",
      receipt: "FALLBACK_COMPOSITION_FROM_ACTIVE_ELEVATION_USED",
      worldTerrainClass: terrainClass,
      expandedTerrainClass: terrainClass,
      semanticTerrainClass: terrainClass,
      terrainClass,
      compatibilityTerrainClass: isLand ? "raised_shield" : "deep_water",
      continentId: elevation.continentId,
      continentName: elevation.continentName,
      continentIndex: elevation.continentIndex,
      continentClass: isLand ? `${elevation.continentId}_mass` : "open_ocean",
      climateClass: isLand ? "temperate_highland" : "open_ocean",
      summitClass: elevation.summitRegionHint,
      summitRegionHint: elevation.summitRegionHint,
      summitTerrainHint: elevation.summitTerrainHint,
      summitPotential: elevation.summitPotential,
      elevation: elevation.elevation,
      isLand,
      isWater: !isLand,
      isShallowWater: elevation.isShallowWater,
      isDeepWater: elevation.isDeepWater,
      landPotential: elevation.landPotential,
      waterDepthPotential: elevation.waterDepthPotential,
      oceanBasinPotential: elevation.oceanBasinPotential,
      continentShelfPotential: elevation.continentShelfPotential,
      shelfPotential: elevation.shelfPotential,
      coastPotential: elevation.coastPotential,
      continentPotential: elevation.continentPotential,
      continentSeparation: elevation.continentSeparation,
      mountainArcPotential: elevation.mountainArcPotential,
      plateauPotential: elevation.plateauPotential,
      canyonPotential: elevation.canyonPotential,
      escarpmentPotential: elevation.escarpmentPotential,
      waterfallCandidate: elevation.waterfallCandidate,
      archipelagoPotential: elevation.archipelagoPotential,
      basinPotential: elevation.basinPotential,
      ridgePotential: elevation.ridgePotential,
      saddlePotential: elevation.saddlePotential,
      islandPotential: elevation.islandPotential,
      scarPotential: elevation.scarPotential,
      massAnchor: clamp01(elevation.bodySeatPressure * 0.62 + elevation.bodyBreadthPressure * 0.28),
      shorelineContact: clamp01(elevation.coastPotential * 0.52 + elevation.bodyEdgePressure * 0.24 + elevation.shelfPotential * 0.18 + elevation.islandCoastPressure * 0.16),
      shelfDrop: clamp01(elevation.shelfPotential * 0.40 + elevation.oceanDepthPressure * 0.22 + elevation.islandShelfPressure * 0.18),
      underlandShadow: clamp01(elevation.bodyInteriorPressure * 0.16 + elevation.oceanDepthPressure * 0.18),
      reliefStrength: clamp01(elevation.ridgePotential * 0.24 + elevation.bodyRoughnessPressure * 0.24 + elevation.islandReliefPressure * 0.22 + n * 0.08),
      slopePressure: clamp01(elevation.bodyEdgePressure * 0.24 + elevation.ridgePotential * 0.18 + elevation.islandReliefPressure * 0.14),
      materialDensity: clamp01(elevation.bodySeatPressure * 0.36 + elevation.landPotential * 0.24 + elevation.detachedIslandElevationInfluence * 0.34),
      surfaceAttachment: clamp01(0.42 + elevation.bodySeatPressure * 0.22 + elevation.landPotential * 0.18 + elevation.attachedCoastPressure * 0.14),
      rimCompression: clamp01(elevation.bodyEdgePressure * 0.30 + elevation.oceanSeatPressure * 0.12 + elevation.islandCoastPressure * 0.20),
      curvatureLock: 0.72
    };
  }

  function normalizeComposition(raw, p, elevation) {
    const source = raw && typeof raw === "object" ? raw : fallbackComposition(p, elevation);

    const terrainClass =
      stringField(source, "worldTerrainClass") ||
      stringField(source, "expandedTerrainClass") ||
      stringField(source, "semanticTerrainClass") ||
      stringField(source, "terrainClass") ||
      stringField(source, "compatibilityTerrainClass") ||
      elevation.terrainClassHint ||
      "ocean_basin";

    const sourceElevation = Number.isFinite(Number(source.elevation)) ? Number(source.elevation) : elevation.elevation;
    const continentId = stringField(source, "continentId", elevation.continentId);

    return {
      ...source,
      terrainClass,
      worldTerrainClass: terrainClass,
      continentId,
      continentName: stringField(source, "continentName", elevation.continentName),
      continentIndex: Number.isFinite(Number(source.continentIndex)) ? Number(source.continentIndex) : elevation.continentIndex,
      continentClass: stringField(source, "continentClass", continentId === "open_ocean" ? "open_ocean" : `${continentId}_mass`),
      climateClass: stringField(source, "climateClass", stringField(source, "climateHint", "open_ocean")),
      summitClass: stringField(source, "summitClass", elevation.summitRegionHint),
      summitRegionHint: stringField(source, "summitRegionHint", elevation.summitRegionHint),
      summitTerrainHint: stringField(source, "summitTerrainHint", elevation.summitTerrainHint),
      summitPotential: clamp01(numberField(source, "summitPotential", elevation.summitPotential)),
      elevation: sourceElevation,
      isLand: boolField(source, "isLand", elevation.isLand),
      isWater: boolField(source, "isWater", elevation.isWater),
      isShallowWater: boolField(source, "isShallowWater", elevation.isShallowWater),
      isDeepWater: boolField(source, "isDeepWater", elevation.isDeepWater),
      landPotential: clamp01(numberField(source, "landPotential", elevation.landPotential)),
      waterDepthPotential: clamp01(numberField(source, "waterDepthPotential", elevation.waterDepthPotential)),
      oceanBasinPotential: clamp01(numberField(source, "oceanBasinPotential", elevation.oceanBasinPotential)),
      continentShelfPotential: clamp01(numberField(source, "continentShelfPotential", elevation.continentShelfPotential)),
      shelfPotential: clamp01(numberField(source, "shelfPotential", elevation.shelfPotential)),
      coastPotential: clamp01(numberField(source, "coastPotential", elevation.coastPotential)),
      continentPotential: clamp01(numberField(source, "continentPotential", elevation.continentPotential)),
      continentSeparation: clamp01(numberField(source, "continentSeparation", elevation.continentSeparation)),
      mountainArcPotential: clamp01(numberField(source, "mountainArcPotential", elevation.mountainArcPotential)),
      plateauPotential: clamp01(numberField(source, "plateauPotential", elevation.plateauPotential)),
      canyonPotential: clamp01(numberField(source, "canyonPotential", elevation.canyonPotential)),
      escarpmentPotential: clamp01(numberField(source, "escarpmentPotential", elevation.escarpmentPotential)),
      waterfallCandidate: clamp01(numberField(source, "waterfallCandidate", elevation.waterfallCandidate)),
      archipelagoPotential: clamp01(numberField(source, "archipelagoPotential", elevation.archipelagoPotential)),
      basinPotential: clamp01(numberField(source, "basinPotential", elevation.basinPotential)),
      ridgePotential: clamp01(numberField(source, "ridgePotential", elevation.ridgePotential)),
      saddlePotential: clamp01(numberField(source, "saddlePotential", elevation.saddlePotential)),
      islandPotential: clamp01(numberField(source, "islandPotential", elevation.islandPotential)),
      scarPotential: clamp01(numberField(source, "scarPotential", elevation.scarPotential)),
      massAnchor: clamp01(numberField(source, "massAnchor", elevation.bodySeatPressure * 0.52 + elevation.detachedIslandElevationInfluence * 0.28)),
      shorelineContact: clamp01(numberField(source, "shorelineContact", elevation.coastPotential * 0.58 + elevation.bodyEdgePressure * 0.18 + elevation.islandCoastPressure * 0.18)),
      shelfDrop: clamp01(numberField(source, "shelfDrop", elevation.shelfPotential * 0.42 + elevation.oceanDepthPressure * 0.24 + elevation.islandShelfPressure * 0.14)),
      underlandShadow: clamp01(numberField(source, "underlandShadow", elevation.bodyInteriorPressure * 0.18 + elevation.oceanDepthPressure * 0.18)),
      reliefStrength: clamp01(numberField(source, "reliefStrength", elevation.ridgePotential * 0.30 + elevation.bodyRoughnessPressure * 0.20 + elevation.islandReliefPressure * 0.22)),
      slopePressure: clamp01(numberField(source, "slopePressure", elevation.bodyEdgePressure * 0.30 + elevation.islandReliefPressure * 0.14)),
      materialDensity: clamp01(numberField(source, "materialDensity", elevation.bodySeatPressure * 0.36 + elevation.landPotential * 0.20 + elevation.detachedIslandElevationInfluence * 0.20)),
      surfaceAttachment: clamp01(numberField(source, "surfaceAttachment", 0.42 + elevation.bodySeatPressure * 0.18 + elevation.attachedCoastPressure * 0.12)),
      rimCompression: clamp01(numberField(source, "rimCompression", elevation.bodyEdgePressure * 0.34 + elevation.islandCoastPressure * 0.20)),
      curvatureLock: clamp01(numberField(source, "curvatureLock", 0.72))
    };
  }

  function readComposition(elevation, ...args) {
    const p = parseInput(...args);

    if (args.length === 1 && args[0] && typeof args[0] === "object") {
      const candidate = args[0];

      if (
        typeof candidate.worldTerrainClass === "string" ||
        typeof candidate.terrainClass === "string" ||
        typeof candidate.expandedTerrainClass === "string"
      ) {
        return normalizeComposition(candidate, p, elevation);
      }
    }

    const composition = getCompositionAuthority();
    const raw = callAuthority(
      composition,
      ["sample", "read", "sampleComposition", "compose"],
      args,
      p
    );

    return normalizeComposition(raw, p, elevation);
  }

  function fallbackTectonics(composition, elevation) {
    return {
      contract: "HEARTH_MATERIALS_FALLBACK_TECTONICS_FROM_ACTIVE_ELEVATION",
      receipt: "FALLBACK_TECTONICS_FROM_ACTIVE_ELEVATION_USED",
      tectonicClass: composition.isWater ? "open_ocean_basin" : "stable_continental_craton",
      plateClass: composition.isWater ? "oceanic_basin_plate" : "continental_plate",
      platePressure: clamp01(elevation.bodySeatPressure * 0.22 + elevation.oceanSeatPressure * 0.18),
      continentalBodyPressure: clamp01(elevation.bodySeatPressure * 0.62 + composition.continentPotential * 0.20 + elevation.detachedIslandElevationInfluence * 0.22),
      continentEdgeCompression: clamp01(elevation.bodyEdgePressure * 0.42 + composition.coastPotential * 0.20 + elevation.attachedCoastPressure * 0.16),
      continentDivideStress: clamp01(elevation.channelCutPressure * 0.30 + composition.continentSeparation * 0.28 + elevation.coastalCutPressure * 0.20),
      canyonCutPressure: clamp01(elevation.canyonPotential * 0.40 + elevation.channelCutPressure * 0.20 + elevation.coastalCutPressure * 0.12),
      faultCutPressure: clamp01(elevation.channelCutPressure * 0.34 + elevation.scarPotential * 0.20 + elevation.coastalCutPressure * 0.16),
      faultLinePressure: clamp01(elevation.channelCutPressure * 0.28 + elevation.scarPotential * 0.18),
      fractureDensity: clamp01(elevation.channelCutPressure * 0.22 + elevation.archipelagoPotential * 0.22 + elevation.keyIslandElevationInfluence * 0.20),
      scarPressure: clamp01(elevation.scarPotential * 0.34 + elevation.channelCutPressure * 0.16 + elevation.coastalCutPressure * 0.12),
      cliffPressure: clamp01(elevation.escarpmentPotential * 0.46 + elevation.bodyEdgePressure * 0.18 + elevation.islandReliefPressure * 0.16),
      escarpmentPressure: clamp01(elevation.escarpmentPotential * 0.54 + elevation.bodyEdgePressure * 0.16 + elevation.islandReliefPressure * 0.18),
      shelfDropPressure: clamp01(elevation.shelfPotential * 0.34 + elevation.oceanDepthPressure * 0.20 + elevation.islandShelfPressure * 0.16),
      coastalCompression: clamp01(elevation.coastPotential * 0.42 + elevation.bodyEdgePressure * 0.16 + elevation.islandCoastPressure * 0.16),
      basinCompression: clamp01(elevation.basinPotential * 0.34 + elevation.oceanSeatPressure * 0.18 + elevation.coastalCutPressure * 0.14),
      basinSubsidence: clamp01(elevation.basinPotential * 0.42 + elevation.oceanDepthPressure * 0.20 + elevation.bayCarveElevationInfluence * 0.20),
      lowlandStress: clamp01(elevation.basinPotential * 0.34),
      archipelagoFracture: clamp01(elevation.archipelagoPotential * 0.42 + elevation.channelCutPressure * 0.18 + elevation.keyIslandElevationInfluence * 0.22),
      islandArcPressure: clamp01(elevation.islandPotential * 0.42 + elevation.archipelagoPotential * 0.18 + elevation.detachedIslandElevationInfluence * 0.42),
      brokenShelfStress: clamp01(elevation.archipelagoPotential * 0.32 + elevation.shelfPotential * 0.18 + elevation.islandShelfPressure * 0.20),
      summitTectonicPressure: clamp01(elevation.summitPotential * 0.40),
      summitTectonicClass: elevation.summitTerrainHint,
      hydrologyFeedPressure: clamp01(Math.max(elevation.coastPotential, elevation.shelfPotential, elevation.basinPotential, elevation.islandShelfPressure) * 0.48),
      waterfallDropPressure: clamp01(elevation.waterfallCandidate * 0.52),
      drainageCutPotential: clamp01(Math.max(elevation.canyonPotential, elevation.channelCutPressure, elevation.basinPotential, elevation.coastalCutPressure) * 0.42),
      materialBodyFeed: clamp01(elevation.bodySeatPressure * 0.44 + elevation.mainIslandElevationInfluence * 0.28),
      materialReliefFeed: clamp01(elevation.ridgePotential * 0.28 + elevation.bodyRoughnessPressure * 0.18 + elevation.islandReliefPressure * 0.24),
      materialShadowFeed: clamp01(elevation.oceanDepthPressure * 0.26 + elevation.bodyInteriorPressure * 0.12 + elevation.coastalCutPressure * 0.12),
      materialDensityFeed: clamp01(elevation.bodyBreadthPressure * 0.32 + elevation.bodySeatPressure * 0.16 + elevation.detachedIslandElevationInfluence * 0.20)
    };
  }

  function normalizeTectonics(raw, composition, elevation) {
    const source = raw && typeof raw === "object" ? raw : fallbackTectonics(composition, elevation);

    return {
      ...source,
      tectonicClass: stringField(source, "tectonicClass", composition.isWater ? "open_ocean_basin" : "stable_continental_craton"),
      plateClass: stringField(source, "plateClass", composition.isWater ? "oceanic_basin_plate" : "continental_plate"),
      platePressure: clamp01(numberField(source, "platePressure", 0)),
      continentalBodyPressure: clamp01(numberField(source, "continentalBodyPressure", elevation.bodySeatPressure * 0.40)),
      continentEdgeCompression: clamp01(numberField(source, "continentEdgeCompression", elevation.bodyEdgePressure * 0.40)),
      continentDivideStress: clamp01(numberField(source, "continentDivideStress", elevation.channelCutPressure * 0.30 + elevation.coastalCutPressure * 0.12)),
      canyonCutPressure: clamp01(numberField(source, "canyonCutPressure", elevation.canyonPotential * 0.42)),
      faultCutPressure: clamp01(numberField(source, "faultCutPressure", elevation.channelCutPressure * 0.32 + elevation.coastalCutPressure * 0.12)),
      faultLinePressure: clamp01(numberField(source, "faultLinePressure", elevation.channelCutPressure * 0.26)),
      fractureDensity: clamp01(numberField(source, "fractureDensity", elevation.channelCutPressure * 0.24 + elevation.keyIslandElevationInfluence * 0.16)),
      scarPressure: clamp01(numberField(source, "scarPressure", elevation.scarPotential * 0.36 + elevation.coastalCutPressure * 0.10)),
      cliffPressure: clamp01(numberField(source, "cliffPressure", elevation.escarpmentPotential * 0.46 + elevation.islandReliefPressure * 0.14)),
      escarpmentPressure: clamp01(numberField(source, "escarpmentPressure", elevation.escarpmentPotential * 0.54 + elevation.islandReliefPressure * 0.14)),
      shelfDropPressure: clamp01(numberField(source, "shelfDropPressure", elevation.shelfPotential * 0.34 + elevation.islandShelfPressure * 0.14)),
      coastalCompression: clamp01(numberField(source, "coastalCompression", elevation.coastPotential * 0.42 + elevation.islandCoastPressure * 0.12)),
      basinCompression: clamp01(numberField(source, "basinCompression", elevation.basinPotential * 0.34 + elevation.coastalCutPressure * 0.12)),
      basinSubsidence: clamp01(numberField(source, "basinSubsidence", elevation.basinPotential * 0.42 + elevation.bayCarveElevationInfluence * 0.12)),
      lowlandStress: clamp01(numberField(source, "lowlandStress", elevation.basinPotential * 0.34)),
      archipelagoFracture: clamp01(numberField(source, "archipelagoFracture", elevation.archipelagoPotential * 0.42 + elevation.keyIslandElevationInfluence * 0.18)),
      islandArcPressure: clamp01(numberField(source, "islandArcPressure", elevation.islandPotential * 0.42 + elevation.detachedIslandElevationInfluence * 0.20)),
      brokenShelfStress: clamp01(numberField(source, "brokenShelfStress", elevation.archipelagoPotential * 0.32 + elevation.islandShelfPressure * 0.14)),
      summitTectonicPressure: clamp01(numberField(source, "summitTectonicPressure", elevation.summitPotential * 0.40)),
      summitTectonicClass: stringField(source, "summitTectonicClass", elevation.summitTerrainHint),
      hydrologyFeedPressure: clamp01(numberField(source, "hydrologyFeedPressure", 0)),
      waterfallDropPressure: clamp01(numberField(source, "waterfallDropPressure", elevation.waterfallCandidate * 0.52)),
      drainageCutPotential: clamp01(numberField(source, "drainageCutPotential", Math.max(elevation.canyonPotential, elevation.channelCutPressure, elevation.coastalCutPressure) * 0.42)),
      materialBodyFeed: clamp01(numberField(source, "materialBodyFeed", elevation.bodySeatPressure * 0.44 + elevation.mainIslandElevationInfluence * 0.18)),
      materialReliefFeed: clamp01(numberField(source, "materialReliefFeed", elevation.ridgePotential * 0.28 + elevation.bodyRoughnessPressure * 0.18 + elevation.islandReliefPressure * 0.16)),
      materialShadowFeed: clamp01(numberField(source, "materialShadowFeed", elevation.oceanDepthPressure * 0.26 + elevation.coastalCutPressure * 0.10)),
      materialDensityFeed: clamp01(numberField(source, "materialDensityFeed", elevation.bodyBreadthPressure * 0.32 + elevation.detachedIslandElevationInfluence * 0.14))
    };
  }

  function readTectonics(composition, elevation, p) {
    const tectonics = getTectonicsAuthority();

    const raw = callAuthority(
      tectonics,
      ["sample", "read", "sampleTectonics", "getTectonics"],
      [composition],
      p
    );

    return normalizeTectonics(raw, composition, elevation);
  }

  function fallbackHydrology(composition, elevation, tectonics) {
    const waterFillStrength = clamp01(
      (elevation.elevation < SEA_LEVEL ? 0.42 : 0) +
      elevation.waterDepthPotential * 0.26 +
      elevation.oceanBasinPotential * 0.16 +
      elevation.oceanDepthPressure * 0.16 +
      elevation.shelfPotential * 0.12 +
      elevation.coastPotential * 0.08 +
      elevation.coastalCutPressure * 0.20
    );

    const waterDepth = clamp01(
      Math.max(0, -elevation.elevation) * 1.40 +
      elevation.waterDepthPotential * 0.26 +
      elevation.oceanDepthPressure * 0.24 +
      elevation.bayCarveElevationInfluence * 0.18
    );

    const beachBase = clamp01(elevation.coastPotential * 0.28 + elevation.shelfPotential * 0.20 + elevation.attachedCoastPressure * 0.18 - tectonics.cliffPressure * 0.16);
    const wetBase = clamp01(elevation.coastPotential * 0.18 + tectonics.cliffPressure * 0.16 + tectonics.shelfDropPressure * 0.12 + elevation.bodyEdgePressure * 0.12 + elevation.islandCoastPressure * 0.10);

    return {
      contract: "HEARTH_MATERIALS_FALLBACK_HYDROLOGY_FROM_ACTIVE_ELEVATION",
      receipt: "FALLBACK_HYDROLOGY_FROM_ACTIVE_ELEVATION_USED",
      hydrologyClass: elevation.isWater ? "coordinate_ocean_basin" : "coordinate_coastal_transition_zone",
      waterBoundaryClass: elevation.isWater ? "coordinate_water_body" : elevation.coastalCutPressure > 0.16 ? "coordinate_bay_cut" : "none",
      coastBoundaryClass: elevation.coastPotential > 0.24 ? "coordinate_waterline_boundary" : "none",
      shorelineType: "coordinate_waterline_transition",
      shelfType: elevation.shelfPotential > 0.20 || elevation.islandShelfPressure > 0.16 ? "coordinate_shelf_gradient" : "none",
      basinType: elevation.isWater ? "coordinate_ocean_basin" : "none",
      drainageType: elevation.channelSeatId !== "none" || elevation.coastalCutPressure > 0.14 ? "coordinate_channel_cut" : "none",
      waterPresence: waterFillStrength,
      surfaceWaterPotential: waterFillStrength,
      subsurfaceWaterPotential: elevation.basinPotential * 0.28,
      oceanContinuity: clamp01(elevation.oceanSeatPressure * 0.44 + elevation.oceanBasinPotential * 0.28),
      oceanDepth: waterDepth,
      shelfGradient: clamp01(Math.max(elevation.continentShelfPotential, elevation.shelfPotential, elevation.islandShelfPressure) * 0.70 + elevation.bodyEdgePressure * 0.16),
      shorelineSoftness: clamp01(Math.max(elevation.coastPotential, elevation.shelfPotential, elevation.attachedCoastPressure) * 0.46),
      shorelineRoughness: clamp01(Math.max(tectonics.cliffPressure, tectonics.fractureDensity, elevation.bodyRoughnessPressure, elevation.islandReliefPressure) * 0.48),
      coastalBlendWidth: clamp01(Math.max(elevation.coastPotential, elevation.shelfPotential, elevation.bodyEdgePressure, elevation.islandCoastPressure) * 0.46),
      riverPotential: clamp01(tectonics.drainageCutPotential * 0.36 + elevation.channelCutPressure * 0.20),
      drainagePotential: clamp01(tectonics.drainageCutPotential * 0.46 + elevation.channelCutPressure * 0.24 + elevation.coastalCutPressure * 0.12),
      deltaPotential: clamp01(tectonics.basinSubsidence * 0.30 + elevation.channelCutPressure * 0.12),
      estuaryPotential: clamp01(tectonics.drainageCutPotential * 0.24 + elevation.channelCutPressure * 0.18 + elevation.coastalCutPressure * 0.12),
      wetlandPotential: clamp01(tectonics.basinSubsidence * 0.32 + elevation.basinPotential * 0.16),
      marshPotential: clamp01(tectonics.basinSubsidence * 0.26 + elevation.basinPotential * 0.12),
      floodplainPotential: clamp01(tectonics.basinSubsidence * 0.28 + elevation.basinPotential * 0.14),
      waterfallFlowPotential: clamp01(tectonics.waterfallDropPressure * 0.46 + elevation.waterfallCandidate * 0.20),
      canyonOutflowPotential: clamp01(tectonics.canyonCutPressure * 0.42 + elevation.channelCutPressure * 0.20),
      fjordCutPotential: 0,
      stormSurgePotential: clamp01(tectonics.coastalCompression * 0.28 + elevation.bodyEdgePressure * 0.08),
      reefShelfPotential: clamp01(elevation.archipelagoPotential * 0.28 + elevation.shelfPotential * 0.10 + elevation.keyIslandElevationInfluence * 0.14),
      archipelagoChannelPotential: clamp01(tectonics.archipelagoFracture * 0.46 + elevation.channelCutPressure * 0.20 + elevation.keyIslandElevationInfluence * 0.18),
      islandWaterGap: clamp01(tectonics.islandArcPressure * 0.38 + elevation.archipelagoPotential * 0.14 + elevation.islandShelfPressure * 0.18),
      straitPotential: clamp01(tectonics.continentDivideStress * 0.42 + elevation.channelCutPressure * 0.26),
      bayPotential: clamp01(elevation.coastPotential * 0.22 + elevation.bodyEdgePressure * 0.08 + elevation.bayCarveStrength * 0.30 + elevation.coastalCutPressure * 0.24),
      inletPotential: clamp01(tectonics.drainageCutPotential * 0.20 + elevation.channelCutPressure * 0.16 + elevation.coastalCutPressure * 0.20),
      peninsulaEdgePotential: clamp01(elevation.coastPotential * 0.18 + elevation.bodyEdgePressure * 0.10 + elevation.attachedCoastPressure * 0.34),
      coastNaturalizationFeed: clamp01(Math.max(elevation.coastPotential, elevation.shelfPotential, elevation.islandCoastPressure) * 0.42),
      materialWaterFeed: waterFillStrength,
      materialShelfFeed: clamp01(Math.max(elevation.continentShelfPotential, elevation.shelfPotential, elevation.islandShelfPressure) * 0.52),
      materialShoreFeed: clamp01(elevation.coastPotential * 0.52 + elevation.bodyEdgePressure * 0.12 + elevation.islandCoastPressure * 0.20),
      materialWetlandFeed: clamp01(tectonics.basinSubsidence * 0.30 + elevation.basinPotential * 0.12),
      materialRiverFeed: clamp01(tectonics.drainageCutPotential * 0.34 + elevation.channelCutPressure * 0.16),
      seaLevel: elevation.seaLevel,
      relativeSeaElevation: elevation.elevation,
      belowSeaLevel: elevation.elevation < elevation.seaLevel,
      nearSeaLevel: Math.abs(elevation.elevation - elevation.seaLevel) < 0.18,
      aboveSeaLevel: elevation.elevation > elevation.seaLevel,
      belowSeaLevelStrength: clamp01((elevation.seaLevel - elevation.elevation + 0.05) / 0.35),
      nearSeaLevelStrength: clamp01(1 - Math.abs(elevation.elevation - elevation.seaLevel) / 0.22),
      aboveSeaLevelStrength: clamp01((elevation.elevation - elevation.seaLevel + 0.04) / 0.34),
      waterFill: waterFillStrength > 0.40,
      waterFillStrength,
      waterDepth,
      waterDepthClass: waterDepth > 0.68 ? "deep" : waterDepth > 0.36 ? "mid" : waterFillStrength > 0.34 ? "shallow" : "dry",
      waterlineBoundary: elevation.coastPotential > 0.22 || elevation.bodyEdgePressure > 0.24 || elevation.islandCoastPressure > 0.16,
      waterlineBoundaryStrength: clamp01(elevation.coastPotential * 0.36 + elevation.shelfPotential * 0.22 + elevation.bodyEdgePressure * 0.20 + elevation.islandCoastPressure * 0.20),
      shallowShelf: elevation.shelfPotential > 0.28 || elevation.islandShelfPressure > 0.18,
      shallowShelfStrength: clamp01(elevation.shelfPotential * 0.42 + elevation.continentShelfPotential * 0.24 + elevation.bodyEdgePressure * 0.10 + elevation.islandShelfPressure * 0.22),
      beachCandidate: beachBase > 0.28,
      beachStrength: beachBase,
      sandShelf: elevation.shelfPotential > 0.32 || elevation.islandShelfPressure > 0.18,
      sandShelfStrength: clamp01(elevation.shelfPotential * 0.32 + elevation.coastPotential * 0.16 + elevation.islandShelfPressure * 0.26),
      hardCoastCandidate: tectonics.cliffPressure > 0.38 || elevation.bodyEdgePressure > 0.44 || elevation.islandReliefPressure > 0.34,
      hardCoastStrength: clamp01(tectonics.cliffPressure * 0.32 + tectonics.shelfDropPressure * 0.16 + elevation.bodyEdgePressure * 0.16 + elevation.islandReliefPressure * 0.16),
      cliffWaterEdge: tectonics.cliffPressure > 0.44 || elevation.escarpmentPotential > 0.48 || elevation.islandReliefPressure > 0.46,
      cliffWaterEdgeStrength: clamp01(tectonics.cliffPressure * 0.34 + tectonics.escarpmentPressure * 0.18 + elevation.bodyEdgePressure * 0.16 + elevation.islandReliefPressure * 0.18),
      submergedBlock: waterFillStrength > 0.36 && (elevation.scarPotential > 0.14 || elevation.bodyEdgePressure > 0.28 || elevation.islandShelfPressure > 0.18),
      submergedBlockStrength: clamp01(waterFillStrength * 0.28 + elevation.scarPotential * 0.16 + elevation.bodyEdgePressure * 0.10 + tectonics.fractureDensity * 0.10 + elevation.islandShelfPressure * 0.12),
      submergedScar: waterFillStrength > 0.34 && (elevation.scarPotential > 0.12 || tectonics.faultCutPressure > 0.16 || elevation.channelCutPressure > 0.16 || elevation.coastalCutPressure > 0.12),
      submergedScarStrength: clamp01(waterFillStrength * 0.20 + elevation.scarPotential * 0.16 + tectonics.faultCutPressure * 0.10 + elevation.channelCutPressure * 0.10 + elevation.coastalCutPressure * 0.14),
      wetStoneEdge: wetBase > 0.24,
      wetStoneStrength: wetBase,
      oldCoastalTechSubmerged: waterFillStrength > 0.34 && (elevation.scarPotential > 0.12 || elevation.channelCutPressure > 0.16 || elevation.coastalCutPressure > 0.12),
      oldCoastalTechSubmergedStrength: clamp01(waterFillStrength * 0.18 + elevation.scarPotential * 0.18 + elevation.channelCutPressure * 0.14 + elevation.coastalCutPressure * 0.12 + tectonics.faultCutPressure * 0.08),
      materialBeachFeed: 0,
      materialSandShelfFeed: 0,
      materialWetStoneFeed: 0,
      materialSubmergedBlockFeed: 0,
      materialSubmergedScarFeed: 0,
      materialCliffWaterEdgeFeed: 0,
      materialWaterlineFeed: 0
    };
  }

  function normalizeHydrology(raw, composition, elevation, tectonics) {
    const fallback = fallbackHydrology(composition, elevation, tectonics);
    const source = raw && typeof raw === "object" ? raw : fallback;
    const merged = { ...fallback, ...source };

    [
      "waterPresence",
      "surfaceWaterPotential",
      "subsurfaceWaterPotential",
      "oceanContinuity",
      "oceanDepth",
      "shelfGradient",
      "shorelineSoftness",
      "shorelineRoughness",
      "coastalBlendWidth",
      "riverPotential",
      "drainagePotential",
      "deltaPotential",
      "estuaryPotential",
      "wetlandPotential",
      "marshPotential",
      "floodplainPotential",
      "waterfallFlowPotential",
      "canyonOutflowPotential",
      "fjordCutPotential",
      "stormSurgePotential",
      "reefShelfPotential",
      "archipelagoChannelPotential",
      "islandWaterGap",
      "straitPotential",
      "bayPotential",
      "inletPotential",
      "peninsulaEdgePotential",
      "coastNaturalizationFeed",
      "materialWaterFeed",
      "materialShelfFeed",
      "materialShoreFeed",
      "materialWetlandFeed",
      "materialRiverFeed",
      "belowSeaLevelStrength",
      "nearSeaLevelStrength",
      "aboveSeaLevelStrength",
      "waterFillStrength",
      "waterDepth",
      "waterlineBoundaryStrength",
      "shallowShelfStrength",
      "beachStrength",
      "sandShelfStrength",
      "hardCoastStrength",
      "cliffWaterEdgeStrength",
      "submergedBlockStrength",
      "submergedScarStrength",
      "wetStoneStrength",
      "oldCoastalTechSubmergedStrength",
      "materialBeachFeed",
      "materialSandShelfFeed",
      "materialWetStoneFeed",
      "materialSubmergedBlockFeed",
      "materialSubmergedScarFeed",
      "materialCliffWaterEdgeFeed",
      "materialWaterlineFeed"
    ].forEach((key) => {
      merged[key] = clamp01(numberField(merged, key, 0));
    });

    merged.seaLevel = Number.isFinite(Number(merged.seaLevel)) ? Number(merged.seaLevel) : elevation.seaLevel;
    merged.relativeSeaElevation = Number.isFinite(Number(merged.relativeSeaElevation))
      ? Number(merged.relativeSeaElevation)
      : elevation.elevation;

    [
      "hydrologyClass",
      "waterBoundaryClass",
      "coastBoundaryClass",
      "shorelineType",
      "shelfType",
      "basinType",
      "drainageType",
      "waterDepthClass"
    ].forEach((key) => {
      merged[key] = stringField(merged, key, fallback[key]);
    });

    [
      "belowSeaLevel",
      "nearSeaLevel",
      "aboveSeaLevel",
      "waterFill",
      "waterlineBoundary",
      "shallowShelf",
      "beachCandidate",
      "sandShelf",
      "hardCoastCandidate",
      "cliffWaterEdge",
      "submergedBlock",
      "submergedScar",
      "wetStoneEdge",
      "oldCoastalTechSubmerged"
    ].forEach((key) => {
      merged[key] = boolField(merged, key, fallback[key]);
    });

    return merged;
  }

  function readHydrology(composition, elevation, tectonics, p, originalArgs) {
    const hydrology = getHydrologyAuthority();

    const raw = callAuthority(
      hydrology,
      ["sample", "read", "sampleHydrology", "getHydrology"],
      originalArgs,
      p
    );

    return normalizeHydrology(raw, composition, elevation, tectonics);
  }

  function terrainClassFor(composition, elevation) {
    const category = elevation.islandFeatureCategory;

    if (category === "bay" && elevation.coastalCutPressure > 0.12) return "bay_cut";
    if (category === "peninsula" && elevation.attachedCoastPressure > 0.12) return "attached_peninsula_coast";
    if (category === "key" && elevation.keyIslandElevationInfluence > 0.015 && elevation.isLand) return "key_island_chain";
    if (category === "mainIsland" && elevation.mainIslandElevationInfluence > 0.02 && elevation.isLand) return "detached_island_body";
    if (elevation.terrainClassHint === "coastal_inlet_cut") return "coastal_inlet_cut";
    if (elevation.terrainClassHint === "bay_cut") return "bay_cut";
    if (elevation.terrainClassHint === "attached_peninsula_coast") return "attached_peninsula_coast";
    if (elevation.terrainClassHint === "key_island_chain") return "key_island_chain";
    if (elevation.terrainClassHint === "detached_island_body") return "detached_island_body";

    return (
      composition.worldTerrainClass ||
      composition.expandedTerrainClass ||
      composition.semanticTerrainClass ||
      composition.terrainClass ||
      composition.compatibilityTerrainClass ||
      elevation.terrainClassHint ||
      "ocean_basin"
    );
  }

  function compatibilityClassFor(composition) {
    return composition.compatibilityTerrainClass || composition.terrainClass || "deep_water";
  }

  function newsPalette(news) {
    switch (news) {
      case "NORTH":
        return PALETTE.northCold;
      case "EAST":
        return PALETTE.eastArc;
      case "WEST":
        return PALETTE.westShield;
      case "SOUTH":
        return PALETTE.southHarsh;
      case "CENTER":
        return PALETTE.centerWet;
      default:
        return PALETTE.coordinateInterior;
    }
  }

  function baseLandColor(composition, elevation, terrainClass) {
    if (terrainClass === "attached_peninsula_coast") return mixColor(PALETTE.peninsula, PALETTE.wetStone, 0.18);
    if (terrainClass === "key_island_chain") return mixColor(PALETTE.keyIsland, PALETTE.islandRim, 0.16);
    if (terrainClass === "detached_island_body") return mixColor(PALETTE.mainIsland, PALETTE.ridge, 0.18);

    if (terrainClass === "basin_floor" || composition.climateClass === "rainforest_wet_basin" || composition.climateClass === "monsoon_floodplain") {
      return PALETTE.basinLand.slice();
    }

    if (terrainClass === "mountain_arc" || terrainClass === "alpine_ridge") {
      return PALETTE.mountain.slice();
    }

    if (terrainClass === "cliff_escarpment" || terrainClass === "canyon_corridor") {
      return PALETTE.oldStone.slice();
    }

    if (terrainClass === "continent_interior") {
      return mixColor(PALETTE.coordinateInterior, newsPalette(elevation.bodySeatNews), 0.22);
    }

    if (terrainClass === "continent_edge") {
      return mixColor(PALETTE.coordinateEdge, newsPalette(elevation.bodySeatNews), 0.18);
    }

    if (terrainClass === "raised_land" || terrainClass === "plateau_interior") {
      return PALETTE.raisedLand.slice();
    }

    return mixColor(PALETTE.landBase, newsPalette(elevation.bodySeatNews), clamp01(elevation.bodySeatPressure * 0.10));
  }

  function baseWaterColor(composition, elevation, hydrology, terrainClass) {
    if (terrainClass === "bay_cut") return mixColor(PALETTE.bayCut, PALETTE.submergedScar, 0.18);
    if (terrainClass === "coastal_inlet_cut") return mixColor(PALETTE.inletCut, PALETTE.wetStone, 0.14);

    if (hydrology.waterDepthClass === "deep" || terrainClass === "deep_ocean" || elevation.oceanDepthPressure > 0.36) {
      return PALETTE.deepWater.slice();
    }

    if (hydrology.waterDepthClass === "mid" || terrainClass === "ocean_basin") {
      return mixColor(PALETTE.ocean, newsPalette(elevation.oceanSeatNews), clamp01(elevation.oceanSeatPressure * 0.08));
    }

    if (hydrology.shallowShelf || hydrology.shallowShelfStrength > 0.30) {
      return PALETTE.shallowShelf.slice();
    }

    return PALETTE.waterFill.slice();
  }

  function computeMaterialFeeds(composition, elevation, tectonics, hydrology) {
    const coast = clamp01(Math.max(composition.coastPotential, composition.shorelineContact, hydrology.materialShoreFeed, hydrology.materialWaterlineFeed, elevation.coastPotential, elevation.islandCoastPressure));
    const shelf = clamp01(Math.max(composition.shelfPotential, composition.continentShelfPotential, hydrology.shelfGradient, hydrology.materialShelfFeed, elevation.shelfPotential, elevation.islandShelfPressure));
    const scar = clamp01(Math.max(composition.scarPotential, tectonics.faultCutPressure, tectonics.fractureDensity, elevation.scarPotential, elevation.coastalCutPressure));
    const channel = clamp01(Math.max(hydrology.straitPotential, hydrology.archipelagoChannelPotential, hydrology.canyonOutflowPotential, hydrology.drainagePotential, elevation.channelCutPressure, elevation.coastalCutPressure));
    const harbor = clamp01(Math.max(hydrology.bayPotential, hydrology.inletPotential, hydrology.estuaryPotential, elevation.bodyEdgePressure * 0.18, elevation.coastalCutPressure));
    const rough = clamp01(Math.max(hydrology.shorelineRoughness, tectonics.cliffPressure, tectonics.escarpmentPressure, elevation.bodyRoughnessPressure, elevation.islandReliefPressure));
    const soft = clamp01(Math.max(hydrology.shorelineSoftness, hydrology.coastalBlendWidth, elevation.attachedCoastPressure));

    const coordinateLandBodyMaterialFeed = clamp01(elevation.bodySeatPressure * 0.42 + elevation.bodyBreadthPressure * 0.22 + elevation.bodyInteriorPressure * 0.14);
    const coordinateBodyInteriorMaterialFeed = clamp01(elevation.bodyInteriorPressure * 0.48 + elevation.bodyBreadthPressure * 0.18);
    const coordinateBodyEdgeMaterialFeed = clamp01(elevation.bodyEdgePressure * 0.48 + elevation.coastPotential * 0.16 + shelf * 0.10);
    const coordinateOceanBasinMaterialFeed = clamp01(elevation.oceanSeatPressure * 0.38 + elevation.oceanDepthPressure * 0.34 + elevation.oceanBasinPotential * 0.14);
    const coordinateChannelCutMaterialFeed = clamp01(elevation.channelCutPressure * 0.46 + channel * 0.18 + elevation.coastalCutPressure * 0.26);
    const coordinateSummitMaterialFeed = clamp01(elevation.summitPotential * 0.44 + elevation.ridgePotential * 0.18 + tectonics.summitTectonicPressure * 0.14);
    const coordinateNewsBoundaryFeed = clamp01(
      elevation.newsProtocolActive || elevation.newsProtocolSynchronized
        ? elevation.bodyEdgePressure * 0.20 + elevation.channelCutPressure * 0.16 + elevation.oceanSeatPressure * 0.10 + elevation.islandCoastPressure * 0.12
        : 0
    );

    const peninsulaCoastMaterialFeed = clamp01(
      elevation.peninsulaStrength * 0.30 +
      elevation.peninsulaElevationInfluence * 1.20 +
      elevation.attachedCoastPressure * 0.44 +
      elevation.islandCoastPressure * 0.18 +
      coast * 0.12
    );

    const bayCutMaterialFeed = clamp01(
      elevation.bayCarveStrength * 0.34 +
      elevation.bayCarveElevationInfluence * 1.24 +
      elevation.coastalCutPressure * 0.52 +
      hydrology.bayPotential * 0.18 +
      hydrology.waterlineBoundaryStrength * 0.08
    );

    const coastalInletMaterialFeed = clamp01(
      elevation.coastalCutPressure * 0.38 +
      hydrology.inletPotential * 0.26 +
      hydrology.estuaryPotential * 0.16 +
      coordinateChannelCutMaterialFeed * 0.16
    );

    const keyIslandMaterialFeed = clamp01(
      elevation.keyStrength * 0.30 +
      elevation.keyIslandElevationInfluence * 1.30 +
      elevation.detachedIslandElevationInfluence * 0.28 +
      elevation.islandShelfPressure * 0.22 +
      elevation.islandCoastPressure * 0.18
    );

    const mainIslandMaterialFeed = clamp01(
      elevation.mainIslandStrength * 0.34 +
      elevation.mainIslandElevationInfluence * 1.22 +
      elevation.detachedIslandElevationInfluence * 0.34 +
      elevation.islandReliefPressure * 0.28 +
      elevation.islandCoastPressure * 0.14
    );

    const detachedIslandRimFeed = clamp01(
      (keyIslandMaterialFeed + mainIslandMaterialFeed) * 0.22 +
      elevation.islandCoastPressure * 0.36 +
      elevation.islandShelfPressure * 0.26 +
      hydrology.waterlineBoundaryStrength * 0.10 +
      hydrology.wetStoneStrength * 0.08
    );

    const islandShelfMaterialFeed = clamp01(
      elevation.islandShelfPressure * 0.44 +
      hydrology.shallowShelfStrength * 0.14 +
      hydrology.sandShelfStrength * 0.12 +
      keyIslandMaterialFeed * 0.10 +
      mainIslandMaterialFeed * 0.08
    );

    const islandReliefMaterialFeed = clamp01(
      elevation.islandReliefPressure * 0.54 +
      elevation.ridgePotential * 0.12 +
      tectonics.materialReliefFeed * 0.10 +
      mainIslandMaterialFeed * 0.12
    );

    const beachRimMaterialFeed = clamp01(
      hydrology.beachStrength * 0.34 +
      hydrology.sandShelfStrength * 0.18 +
      detachedIslandRimFeed * 0.12 +
      peninsulaCoastMaterialFeed * 0.10 +
      islandShelfMaterialFeed * 0.10
    );

    const cliffContactMaterialFeed = clamp01(
      hydrology.cliffWaterEdgeStrength * 0.36 +
      hydrology.hardCoastStrength * 0.22 +
      tectonics.cliffPressure * 0.14 +
      elevation.islandReliefPressure * 0.12 +
      elevation.bodyEdgePressure * 0.08
    );

    const ridgeBandMaterialFeed = clamp01(
      elevation.ridgePotential * 0.24 +
      elevation.bodyRoughnessPressure * 0.18 +
      elevation.islandReliefPressure * 0.24 +
      coordinateSummitMaterialFeed * 0.12 +
      tectonics.materialReliefFeed * 0.10
    );

    const inlandReliefMaterialFeed = clamp01(
      elevation.bodyInteriorPressure * 0.20 +
      elevation.bodyBreadthPressure * 0.18 +
      ridgeBandMaterialFeed * 0.16 +
      coordinateBodyInteriorMaterialFeed * 0.14 +
      elevationReliefMaterialSeed(elevation, tectonics) * 0.12
    );

    const elevationReliefMaterialFeed = clamp01(
      elevation.ridgePotential * 0.22 +
      elevation.bodyRoughnessPressure * 0.20 +
      Math.abs(elevation.elevation) * 0.12 +
      islandReliefMaterialFeed * 0.28 +
      ridgeBandMaterialFeed * 0.12
    );

    const waterFillMaterialFeed = clamp01(hydrology.waterFillStrength * 0.58 + hydrology.materialWaterFeed * 0.18 + hydrology.waterDepth * 0.10 + coordinateOceanBasinMaterialFeed * 0.14 + bayCutMaterialFeed * 0.12);
    const waterlineMaterialFeed = clamp01(hydrology.waterlineBoundaryStrength * 0.54 + coast * 0.16 + hydrology.nearSeaLevelStrength * 0.14 + coordinateBodyEdgeMaterialFeed * 0.16 + detachedIslandRimFeed * 0.10);
    const shallowShelfMaterialFeed = clamp01(hydrology.shallowShelfStrength * 0.42 + hydrology.materialShelfFeed * 0.18 + shelf * 0.12 + coordinateBodyEdgeMaterialFeed * 0.10 + islandShelfMaterialFeed * 0.20);
    const beachMaterialFeed = clamp01(hydrology.beachStrength * 0.44 + hydrology.materialBeachFeed * 0.24 + soft * 0.10 + beachRimMaterialFeed * 0.22 - hydrology.hardCoastStrength * 0.16);
    const sandShelfMaterialFeed = clamp01(hydrology.sandShelfStrength * 0.46 + hydrology.materialSandShelfFeed * 0.20 + hydrology.shallowShelfStrength * 0.14 + islandShelfMaterialFeed * 0.14);
    const wetStoneMaterialFeed = clamp01(hydrology.wetStoneStrength * 0.42 + hydrology.materialWetStoneFeed * 0.24 + rough * 0.10 + waterlineMaterialFeed * 0.08 + coordinateBodyEdgeMaterialFeed * 0.08 + detachedIslandRimFeed * 0.10);
    const hardCoastMaterialFeed = clamp01(hydrology.hardCoastStrength * 0.42 + rough * 0.18 + tectonics.shelfDropPressure * 0.10 + hydrology.materialCliffWaterEdgeFeed * 0.10 + coordinateBodyEdgeMaterialFeed * 0.12 + cliffContactMaterialFeed * 0.16);
    const cliffWaterEdgeMaterialFeed = clamp01(hydrology.cliffWaterEdgeStrength * 0.46 + hydrology.materialCliffWaterEdgeFeed * 0.22 + tectonics.cliffPressure * 0.12 + elevation.escarpmentPotential * 0.10 + cliffContactMaterialFeed * 0.20);
    const submergedBlockMaterialFeed = clamp01(hydrology.submergedBlockStrength * 0.46 + hydrology.materialSubmergedBlockFeed * 0.24 + waterFillMaterialFeed * 0.08 + shelf * 0.06 + coordinateBodyEdgeMaterialFeed * 0.06 + islandShelfMaterialFeed * 0.08);
    const submergedScarMaterialFeed = clamp01(hydrology.submergedScarStrength * 0.44 + hydrology.materialSubmergedScarFeed * 0.22 + hydrology.oldCoastalTechSubmergedStrength * 0.10 + channel * 0.06 + coordinateChannelCutMaterialFeed * 0.12 + bayCutMaterialFeed * 0.12);

    const oldCoastalTechUnderwaterMaterialFeed = clamp01(
      hydrology.oldCoastalTechSubmergedStrength * 0.38 +
      submergedScarMaterialFeed * 0.18 +
      submergedBlockMaterialFeed * 0.12 +
      scar * 0.10 +
      coordinateChannelCutMaterialFeed * 0.10
    );

    const submergedPortBasinMaterialFeed = clamp01(
      waterFillMaterialFeed * 0.16 +
      waterlineMaterialFeed * 0.11 +
      hydrology.shallowShelfStrength * 0.09 +
      submergedBlockMaterialFeed * 0.14 +
      submergedScarMaterialFeed * 0.12 +
      wetStoneMaterialFeed * 0.10 +
      harbor * 0.10 +
      channel * 0.05 +
      coordinateBodyEdgeMaterialFeed * 0.08 +
      coordinateChannelCutMaterialFeed * 0.05
    );

    const agedCoastalTechFeed = clamp01(coast * 0.14 + shelf * 0.10 + scar * 0.12 + channel * 0.10 + submergedScarMaterialFeed * 0.14 + oldCoastalTechUnderwaterMaterialFeed * 0.16 + wetStoneMaterialFeed * 0.10 + coordinateNewsBoundaryFeed * 0.08);
    const carvedCoastFeed = clamp01(coast * 0.18 + rough * 0.13 + channel * 0.10 + hydrology.cliffWaterEdgeStrength * 0.10 + hydrology.wetStoneStrength * 0.08 + tectonics.shelfDropPressure * 0.08 + scar * 0.08 + coordinateBodyEdgeMaterialFeed * 0.12 + bayCutMaterialFeed * 0.18);
    const weatheredInfrastructureFeed = clamp01(agedCoastalTechFeed * 0.20 + wetStoneMaterialFeed * 0.18 + submergedBlockMaterialFeed * 0.12 + submergedScarMaterialFeed * 0.12 + hydrology.coastNaturalizationFeed * 0.12 + rough * 0.08 + coordinateNewsBoundaryFeed * 0.08);
    const ancientChannelFeed = clamp01(channel * 0.24 + hydrology.straitPotential * 0.14 + hydrology.archipelagoChannelPotential * 0.12 + hydrology.canyonOutflowPotential * 0.10 + submergedScarMaterialFeed * 0.14 + tectonics.continentDivideStress * 0.06 + coordinateChannelCutMaterialFeed * 0.14);
    const erodedHarborFeed = clamp01(harbor * 0.28 + hydrology.bayPotential * 0.12 + hydrology.inletPotential * 0.12 + hydrology.estuaryPotential * 0.08 + submergedPortBasinMaterialFeed * 0.16 + wetStoneMaterialFeed * 0.06);
    const mineralizedCutFeed = clamp01(carvedCoastFeed * 0.22 + wetStoneMaterialFeed * 0.16 + hardCoastMaterialFeed * 0.14 + cliffWaterEdgeMaterialFeed * 0.12 + tectonics.cliffPressure * 0.08 + tectonics.shelfDropPressure * 0.06 + elevationReliefMaterialFeed * 0.08);
    const reclaimedStructureFeed = clamp01(hydrology.coastNaturalizationFeed * 0.16 + wetStoneMaterialFeed * 0.16 + beachMaterialFeed * 0.08 + sandShelfMaterialFeed * 0.08 + submergedBlockMaterialFeed * 0.14 + weatheredInfrastructureFeed * 0.16);
    const oldDrainageGateFeed = clamp01(hydrology.drainagePotential * 0.18 + hydrology.riverPotential * 0.10 + hydrology.estuaryPotential * 0.10 + hydrology.waterfallFlowPotential * 0.10 + hydrology.canyonOutflowPotential * 0.10 + submergedScarMaterialFeed * 0.10 + ancientChannelFeed * 0.08 + coordinateChannelCutMaterialFeed * 0.10);
    const submergedWorksFeed = clamp01(submergedBlockMaterialFeed * 0.22 + submergedScarMaterialFeed * 0.20 + oldCoastalTechUnderwaterMaterialFeed * 0.18 + waterFillMaterialFeed * 0.10 + hydrology.shallowShelfStrength * 0.08 + channel * 0.06 + coordinateChannelCutMaterialFeed * 0.08);
    const artificialNaturalBlend = clamp01(agedCoastalTechFeed * 0.16 + hydrology.coastNaturalizationFeed * 0.14 + wetStoneMaterialFeed * 0.12 + submergedWorksFeed * 0.12 + beachMaterialFeed * 0.06 + sandShelfMaterialFeed * 0.06 + reclaimedStructureFeed * 0.14);
    const submergedShadowBand = clamp01(waterFillMaterialFeed * 0.18 + hydrology.waterDepth * 0.16 + submergedWorksFeed * 0.16 + submergedBlockMaterialFeed * 0.12 + submergedScarMaterialFeed * 0.10 + cliffWaterEdgeMaterialFeed * 0.06 + coordinateOceanBasinMaterialFeed * 0.10);
    const weatheredCutBand = clamp01(carvedCoastFeed * 0.20 + mineralizedCutFeed * 0.16 + wetStoneMaterialFeed * 0.12 + ancientChannelFeed * 0.12 + oldDrainageGateFeed * 0.08 + submergedScarMaterialFeed * 0.08 + coordinateChannelCutMaterialFeed * 0.08);
    const reclaimedSurfaceBand = clamp01(reclaimedStructureFeed * 0.22 + beachMaterialFeed * 0.08 + sandShelfMaterialFeed * 0.08 + wetStoneMaterialFeed * 0.14 + artificialNaturalBlend * 0.16 + hydrology.coastNaturalizationFeed * 0.10);
    const greenGlowSuppression = clamp01(submergedScarMaterialFeed * 0.20 + submergedBlockMaterialFeed * 0.16 + oldCoastalTechUnderwaterMaterialFeed * 0.16 + waterFillMaterialFeed * 0.12 + wetStoneMaterialFeed * 0.10 + weatheredInfrastructureFeed * 0.08 + ridgeBandMaterialFeed * 0.06);
    const beadSuppression = clamp01(greenGlowSuppression * 0.28 + artificialNaturalBlend * 0.18 + submergedShadowBand * 0.16 + submergedScarMaterialFeed * 0.14 + reclaimedSurfaceBand * 0.08);
    const coastalScarContinuity = clamp01(waterlineMaterialFeed * 0.14 + submergedScarMaterialFeed * 0.16 + carvedCoastFeed * 0.14 + ancientChannelFeed * 0.10 + wetStoneMaterialFeed * 0.10 + coast * 0.08 + shelf * 0.06 + coordinateBodyEdgeMaterialFeed * 0.08);
    const scarBandWidth = clamp01(hydrology.shallowShelfStrength * 0.12 + hydrology.coastalBlendWidth * 0.10 + submergedBlockMaterialFeed * 0.14 + submergedScarMaterialFeed * 0.12 + wetStoneMaterialFeed * 0.10 + waterlineMaterialFeed * 0.08 + coordinateBodyEdgeMaterialFeed * 0.08);
    const submergedShadowWake = clamp01(submergedShadowBand * 0.22 + hydrology.waterDepth * 0.16 + waterFillMaterialFeed * 0.14 + submergedWorksFeed * 0.14 + hydrology.materialWaterFeed * 0.08 + hydrology.materialShelfFeed * 0.06 + coordinateOceanBasinMaterialFeed * 0.10);
    const mineralizedEdgeBody = clamp01(mineralizedCutFeed * 0.22 + wetStoneMaterialFeed * 0.16 + hardCoastMaterialFeed * 0.14 + cliffWaterEdgeMaterialFeed * 0.12 + coastalScarContinuity * 0.08 + coordinateBodyEdgeMaterialFeed * 0.08);
    const reclaimedEdgeBlend = clamp01(reclaimedStructureFeed * 0.20 + artificialNaturalBlend * 0.16 + hydrology.coastNaturalizationFeed * 0.12 + beachMaterialFeed * 0.08 + sandShelfMaterialFeed * 0.08 + wetStoneMaterialFeed * 0.08 + coordinateNewsBoundaryFeed * 0.06);
    const harborScarBasin = clamp01(erodedHarborFeed * 0.24 + submergedPortBasinMaterialFeed * 0.24 + hydrology.bayPotential * 0.10 + hydrology.inletPotential * 0.10 + submergedBlockMaterialFeed * 0.08 + submergedScarMaterialFeed * 0.06 + coordinateBodyEdgeMaterialFeed * 0.06);
    const channelScarContinuity = clamp01(ancientChannelFeed * 0.22 + hydrology.straitPotential * 0.12 + hydrology.archipelagoChannelPotential * 0.10 + hydrology.drainagePotential * 0.08 + submergedScarMaterialFeed * 0.14 + submergedShadowWake * 0.08 + coordinateChannelCutMaterialFeed * 0.12);
    const archipelagoScarBreakup = clamp01(hydrology.archipelagoChannelPotential * 0.20 + hydrology.islandWaterGap * 0.12 + tectonics.archipelagoFracture * 0.12 + submergedBlockMaterialFeed * 0.10 + submergedScarMaterialFeed * 0.10 + hydrology.materialShelfFeed * 0.08 + elevation.archipelagoPotential * 0.10 + keyIslandMaterialFeed * 0.12);
    const scarClusterStrength = clamp01(coastalScarContinuity * 0.16 + channelScarContinuity * 0.14 + harborScarBasin * 0.12 + archipelagoScarBreakup * 0.10 + submergedScarMaterialFeed * 0.14 + submergedBlockMaterialFeed * 0.10);
    const isolatedBeadSuppression = clamp01(beadSuppression * 0.30 + greenGlowSuppression * 0.22 + submergedShadowWake * 0.14 + (1 - scarClusterStrength) * 0.10);
    const boundaryMorphologyFeed = clamp01(waterlineMaterialFeed * 0.12 + coastalScarContinuity * 0.10 + scarBandWidth * 0.08 + submergedShadowWake * 0.10 + mineralizedEdgeBody * 0.08 + reclaimedEdgeBlend * 0.08 + harborScarBasin * 0.08 + channelScarContinuity * 0.06 + submergedPortBasinMaterialFeed * 0.08 + coordinateBodyEdgeMaterialFeed * 0.10 + detachedIslandRimFeed * 0.10);

    return {
      seaLevelMaterialFeed: clamp01(hydrology.nearSeaLevelStrength * 0.38 + waterlineMaterialFeed * 0.36 + coordinateBodyEdgeMaterialFeed * 0.10),
      waterFillMaterialFeed,
      waterlineMaterialFeed,
      shallowShelfMaterialFeed,
      beachMaterialFeed,
      sandShelfMaterialFeed,
      wetStoneMaterialFeed,
      hardCoastMaterialFeed,
      cliffWaterEdgeMaterialFeed,
      submergedBlockMaterialFeed,
      submergedScarMaterialFeed,
      submergedPortBasinMaterialFeed,
      oldCoastalTechUnderwaterMaterialFeed,

      coordinateLandBodyMaterialFeed,
      coordinateBodyInteriorMaterialFeed,
      coordinateBodyEdgeMaterialFeed,
      coordinateOceanBasinMaterialFeed,
      coordinateChannelCutMaterialFeed,
      coordinateSummitMaterialFeed,
      coordinateNewsBoundaryFeed,
      elevationReliefMaterialFeed,

      peninsulaCoastMaterialFeed,
      bayCutMaterialFeed,
      coastalInletMaterialFeed,
      keyIslandMaterialFeed,
      mainIslandMaterialFeed,
      detachedIslandRimFeed,
      islandShelfMaterialFeed,
      islandReliefMaterialFeed,
      beachRimMaterialFeed,
      cliffContactMaterialFeed,
      ridgeBandMaterialFeed,
      inlandReliefMaterialFeed,

      agedCoastalTechFeed,
      carvedCoastFeed,
      weatheredInfrastructureFeed,
      ancientChannelFeed,
      erodedHarborFeed,
      mineralizedCutFeed,
      reclaimedStructureFeed,
      oldDrainageGateFeed,
      submergedWorksFeed,
      artificialNaturalBlend,
      submergedShadowBand,
      weatheredCutBand,
      reclaimedSurfaceBand,
      beadSuppression,
      greenGlowSuppression,
      coastalScarContinuity,
      scarBandWidth,
      submergedShadowWake,
      mineralizedEdgeBody,
      reclaimedEdgeBlend,
      isolatedBeadSuppression,
      scarClusterStrength,
      harborScarBasin,
      channelScarContinuity,
      archipelagoScarBreakup,
      boundaryMorphologyFeed
    };
  }

  function elevationReliefMaterialSeed(elevation, tectonics) {
    return clamp01(elevation.ridgePotential * 0.22 + elevation.bodyRoughnessPressure * 0.20 + tectonics.materialReliefFeed * 0.18);
  }

  function applyMaterialExpression(rgb, terrainClass, composition, elevation, tectonics, hydrology, feeds, noise) {
    let color = rgb.slice();

    if (feeds.coordinateLandBodyMaterialFeed > 0.10 && !hydrology.waterFill) {
      color = mixColor(color, PALETTE.coordinateInterior, clamp01(feeds.coordinateLandBodyMaterialFeed * 0.16));
      color = mixColor(color, newsPalette(elevation.bodySeatNews), clamp01(elevation.bodySeatPressure * 0.07));
    }

    if (feeds.coordinateBodyInteriorMaterialFeed > 0.12 && !hydrology.waterFill) {
      color = mixColor(color, PALETTE.coordinateInterior, clamp01(feeds.coordinateBodyInteriorMaterialFeed * 0.14));
    }

    if (feeds.coordinateBodyEdgeMaterialFeed > 0.12) {
      color = mixColor(color, PALETTE.coordinateEdge, clamp01(feeds.coordinateBodyEdgeMaterialFeed * 0.16));
    }

    if (feeds.coordinateSummitMaterialFeed > 0.12 && !hydrology.waterFill) {
      color = mixColor(color, PALETTE.coordinateSummit, clamp01(feeds.coordinateSummitMaterialFeed * 0.20));
    }

    if (feeds.peninsulaCoastMaterialFeed > 0.10) {
      color = mixColor(color, PALETTE.peninsula, clamp01(feeds.peninsulaCoastMaterialFeed * 0.22));
      color = mixColor(color, PALETTE.wetStone, clamp01(feeds.peninsulaCoastMaterialFeed * 0.08));
    }

    if (feeds.bayCutMaterialFeed > 0.08) {
      color = mixColor(color, PALETTE.bayCut, clamp01(feeds.bayCutMaterialFeed * 0.34));
      color = mixColor(color, PALETTE.submergedScar, clamp01(feeds.bayCutMaterialFeed * 0.16));
    }

    if (feeds.coastalInletMaterialFeed > 0.08) {
      color = mixColor(color, PALETTE.inletCut, clamp01(feeds.coastalInletMaterialFeed * 0.24));
      color = mixColor(color, PALETTE.wetStone, clamp01(feeds.coastalInletMaterialFeed * 0.10));
    }

    if (feeds.keyIslandMaterialFeed > 0.10) {
      color = mixColor(color, PALETTE.keyIsland, clamp01(feeds.keyIslandMaterialFeed * 0.28));
      color = mixColor(color, PALETTE.islandRim, clamp01(feeds.detachedIslandRimFeed * 0.12));
    }

    if (feeds.mainIslandMaterialFeed > 0.10) {
      color = mixColor(color, PALETTE.mainIsland, clamp01(feeds.mainIslandMaterialFeed * 0.24));
      color = mixColor(color, PALETTE.ridge, clamp01(feeds.islandReliefMaterialFeed * 0.18));
    }

    if (feeds.detachedIslandRimFeed > 0.10) {
      color = mixColor(color, PALETTE.islandRim, clamp01(feeds.detachedIslandRimFeed * 0.18));
      color = mixColor(color, PALETTE.wetStone, clamp01(feeds.detachedIslandRimFeed * 0.07));
    }

    if (feeds.ridgeBandMaterialFeed > 0.12 && !hydrology.waterFill) {
      color = mixColor(color, PALETTE.ridge, clamp01(feeds.ridgeBandMaterialFeed * 0.18));
      color = mixColor(color, PALETTE.mountain, clamp01(feeds.ridgeBandMaterialFeed * 0.08));
    }

    if (feeds.inlandReliefMaterialFeed > 0.12 && !hydrology.waterFill) {
      color = mixColor(color, PALETTE.oldStone, clamp01(feeds.inlandReliefMaterialFeed * 0.07));
      color = addColor(color, [5, 3, -2], clamp01(feeds.inlandReliefMaterialFeed * 0.06));
    }

    if (feeds.waterFillMaterialFeed > 0.10) {
      color = mixColor(color, PALETTE.waterFill, clamp01(feeds.waterFillMaterialFeed * 0.54));
      color = mixColor(color, PALETTE.deepWater, clamp01(hydrology.waterDepth * 0.28 + feeds.submergedShadowWake * 0.18 + feeds.coordinateOceanBasinMaterialFeed * 0.12));
    }

    if (feeds.coordinateOceanBasinMaterialFeed > 0.14) {
      color = mixColor(color, PALETTE.ocean, clamp01(feeds.coordinateOceanBasinMaterialFeed * 0.20));
      color = mixColor(color, PALETTE.deepWater, clamp01(elevation.oceanDepthPressure * 0.16));
    }

    if (feeds.submergedBlockMaterialFeed > 0.10) {
      color = mixColor(color, PALETTE.submergedBlock, clamp01(feeds.submergedBlockMaterialFeed * 0.38));
      color = mixColor(color, PALETTE.portBasin, clamp01(feeds.submergedPortBasinMaterialFeed * 0.22));
    }

    if (feeds.submergedScarMaterialFeed > 0.10) {
      color = mixColor(color, PALETTE.submergedScar, clamp01(feeds.submergedScarMaterialFeed * 0.34));
      color = mixColor(color, PALETTE.mineralTrace, clamp01(feeds.oldCoastalTechUnderwaterMaterialFeed * 0.07));
    }

    if (feeds.coordinateChannelCutMaterialFeed > 0.12) {
      color = mixColor(color, PALETTE.submergedScar, clamp01(feeds.coordinateChannelCutMaterialFeed * 0.18));
    }

    if (feeds.shallowShelfMaterialFeed > 0.01) {
      color = mixColor(color, PALETTE.shallowShelf, clamp01(feeds.shallowShelfMaterialFeed * 0.20 + feeds.sandShelfMaterialFeed * 0.08 + feeds.islandShelfMaterialFeed * 0.08));
    }

    if (feeds.sandShelfMaterialFeed > 0.12 && feeds.hardCoastMaterialFeed < 0.38) {
      color = mixColor(color, PALETTE.sandStone, clamp01(feeds.sandShelfMaterialFeed * 0.20));
    }

    if (feeds.beachMaterialFeed > 0.12 && feeds.hardCoastMaterialFeed < 0.36 && feeds.cliffWaterEdgeMaterialFeed < 0.34) {
      color = mixColor(color, PALETTE.beachShelf, clamp01(feeds.beachMaterialFeed * 0.20 + feeds.beachRimMaterialFeed * 0.10));
    }

    if (feeds.wetStoneMaterialFeed > 0.10) {
      color = mixColor(color, PALETTE.wetStone, clamp01(feeds.wetStoneMaterialFeed * 0.30));
    }

    if (feeds.hardCoastMaterialFeed > 0.12) {
      color = mixColor(color, PALETTE.hardCoast, clamp01(feeds.hardCoastMaterialFeed * 0.28));
    }

    if (feeds.cliffWaterEdgeMaterialFeed > 0.12) {
      color = mixColor(color, PALETTE.cliffEdge, clamp01(feeds.cliffWaterEdgeMaterialFeed * 0.30));
    }

    if (feeds.waterlineMaterialFeed > 0.16) {
      color = mixColor(color, PALETTE.mutedShelf, clamp01(feeds.waterlineMaterialFeed * 0.10));
      color = mixColor(color, PALETTE.wetStone, clamp01(feeds.wetStoneMaterialFeed * 0.10));
    }

    if (feeds.oldCoastalTechUnderwaterMaterialFeed > 0.12) {
      color = mixColor(color, PALETTE.submergedScar, clamp01(feeds.oldCoastalTechUnderwaterMaterialFeed * 0.18));
      color = addColor(color, [3, 1, -3], clamp01(feeds.mineralizedEdgeBody * 0.05));
    }

    const greenReduce = clamp01(
      feeds.greenGlowSuppression * 0.10 +
      feeds.submergedScarMaterialFeed * 0.06 +
      feeds.oldCoastalTechUnderwaterMaterialFeed * 0.06 +
      feeds.coordinateChannelCutMaterialFeed * 0.04 +
      feeds.ridgeBandMaterialFeed * 0.03 +
      (terrainClass === "bay_cut" ? 0.06 : 0)
    );

    color[1] = clamp(Math.round(color[1] * (1 - greenReduce)), 0, 255);

    const noiseLift = 1 + (noise - 0.5) * 0.040;
    return scaleColor(color, noiseLift);
  }

  function outputFieldsFor(composition, elevation, tectonics, hydrology, feeds, isLandBase, isWaterOccupied) {
    const mass = clamp01(Math.max(composition.massAnchor, tectonics.materialBodyFeed, elevation.bodySeatPressure, elevation.detachedIslandElevationInfluence));
    const density = clamp01(Math.max(composition.materialDensity, tectonics.materialDensityFeed, feeds.coordinateBodyInteriorMaterialFeed, feeds.mainIslandMaterialFeed));
    const relief = clamp01(Math.max(composition.reliefStrength, tectonics.materialReliefFeed, feeds.elevationReliefMaterialFeed, feeds.islandReliefMaterialFeed));
    const ridge = clamp01(Math.max(composition.ridgePotential, composition.mountainArcPotential, elevation.ridgePotential, feeds.ridgeBandMaterialFeed));
    const basin = clamp01(Math.max(composition.basinPotential, tectonics.basinSubsidence, hydrology.wetlandPotential, elevation.basinPotential, feeds.bayCutMaterialFeed));
    const shadow = clamp01(Math.max(composition.underlandShadow, tectonics.materialShadowFeed, elevation.oceanDepthPressure * 0.24, feeds.submergedShadowWake));

    const terrainRelief = clamp01(
      relief * 0.30 +
      ridge * 0.12 +
      tectonics.canyonCutPressure * 0.08 +
      tectonics.cliffPressure * 0.08 +
      feeds.mineralizedEdgeBody * 0.06 +
      feeds.wetStoneMaterialFeed * 0.05 +
      feeds.boundaryMorphologyFeed * 0.05 +
      feeds.coordinateSummitMaterialFeed * 0.10 +
      feeds.coordinateBodyInteriorMaterialFeed * 0.06 +
      feeds.islandReliefMaterialFeed * 0.14 +
      feeds.ridgeBandMaterialFeed * 0.10
    );

    const ridgeRelief = clamp01(ridge * 0.30 + relief * 0.12 + composition.summitPotential * 0.08 + elevation.summitPotential * 0.10 + feeds.ridgeBandMaterialFeed * 0.12);
    const basinShade = clamp01(
      basin * 0.20 +
      hydrology.waterDepth * 0.22 +
      feeds.waterFillMaterialFeed * 0.10 +
      feeds.submergedPortBasinMaterialFeed * 0.10 +
      feeds.submergedShadowWake * 0.08 +
      feeds.coordinateOceanBasinMaterialFeed * 0.10 +
      feeds.bayCutMaterialFeed * 0.12
    );

    const shorelineGrounding = clamp01(
      feeds.waterlineMaterialFeed * 0.22 +
      feeds.wetStoneMaterialFeed * 0.14 +
      feeds.beachMaterialFeed * 0.08 +
      feeds.sandShelfMaterialFeed * 0.08 +
      feeds.hardCoastMaterialFeed * 0.10 +
      hydrology.coastNaturalizationFeed * 0.10 +
      feeds.coordinateBodyEdgeMaterialFeed * 0.12 +
      feeds.detachedIslandRimFeed * 0.12 +
      feeds.peninsulaCoastMaterialFeed * 0.08
    );

    const shelfTransition = clamp01(
      hydrology.shelfGradient * 0.20 +
      hydrology.shallowShelfStrength * 0.18 +
      feeds.shallowShelfMaterialFeed * 0.12 +
      feeds.sandShelfMaterialFeed * 0.10 +
      feeds.submergedBlockMaterialFeed * 0.08 +
      feeds.submergedScarMaterialFeed * 0.08 +
      feeds.waterFillMaterialFeed * 0.06 +
      feeds.coordinateBodyEdgeMaterialFeed * 0.08 +
      feeds.islandShelfMaterialFeed * 0.14
    );

    const contactShadow = clamp01(
      shadow * 0.16 +
      shorelineGrounding * 0.14 +
      feeds.wetStoneMaterialFeed * 0.12 +
      feeds.cliffWaterEdgeMaterialFeed * 0.12 +
      feeds.submergedShadowWake * 0.12 +
      feeds.submergedPortBasinMaterialFeed * 0.06 +
      feeds.coordinateBodyEdgeMaterialFeed * 0.08 +
      feeds.bayCutMaterialFeed * 0.10
    );

    const landDensity = isLandBase
      ? clamp01(0.42 + mass * 0.14 + density * 0.10 + terrainRelief * 0.08 + feeds.mainIslandMaterialFeed * 0.10 + feeds.keyIslandMaterialFeed * 0.06 - feeds.waterFillMaterialFeed * 0.14)
      : 0;

    const waterDepthShade = isWaterOccupied
      ? clamp01(hydrology.waterDepth * 0.46 + basinShade * 0.14 + feeds.submergedShadowWake * 0.14 + feeds.submergedPortBasinMaterialFeed * 0.08 + feeds.coordinateOceanBasinMaterialFeed * 0.10 + feeds.bayCutMaterialFeed * 0.10)
      : 0;

    return {
      alpha: 1,
      isLand: isLandBase && feeds.waterFillMaterialFeed < 0.64 && feeds.bayCutMaterialFeed < 0.48,
      isWater: isWaterOccupied,
      landDensity,
      shorelineGrounding,
      contactShadow,
      underlandOcclusion: clamp01(shadow * 0.24 + contactShadow * 0.20 + feeds.submergedShadowWake * 0.10),
      shelfTransition,
      terrainRelief,
      ridgeRelief,
      basinShade,
      rimDarkening: clamp01(composition.rimCompression * 0.20 + elevation.bodyEdgePressure * 0.12 + waterDepthShade * 0.10 + terrainRelief * 0.05 + feeds.detachedIslandRimFeed * 0.10),
      rimCompression: clamp01(composition.rimCompression * 0.38 + mass * 0.10 + relief * 0.05 + elevation.bodyEdgePressure * 0.10 + elevation.islandCoastPressure * 0.12),
      atmosphereSeparation: isWaterOccupied
        ? clamp01(0.14 + hydrology.waterDepth * 0.10 + elevation.oceanDepthPressure * 0.06)
        : clamp01(0.36 + mass * 0.12 + terrainRelief * 0.06),
      surfaceAttachment: clamp01(composition.surfaceAttachment * 0.48 + mass * 0.14 + shorelineGrounding * 0.08 + elevation.bodySeatPressure * 0.08 + elevation.attachedCoastPressure * 0.08),
      curvatureLock: clamp01(composition.curvatureLock),
      waterDepthShade,
      bridgePotential: clamp01(numberField(composition, "bridgePotential", 0) * 0.18 + feeds.channelScarContinuity * 0.08 + elevation.channelCutPressure * 0.06 + elevation.coastalCutPressure * 0.05)
    };
  }

  function sample(...args) {
    const p = parseInput(...args);
    const elevation = readElevation(...args);
    const composition = readComposition(elevation, ...args);
    const tectonics = readTectonics(composition, elevation, p);
    const hydrology = readHydrology(composition, elevation, tectonics, p, args);

    const terrainClass = terrainClassFor(composition, elevation);
    const compatibilityTerrainClass = compatibilityClassFor(composition);
    const materialClass = MATERIAL_CLASS_MAP[terrainClass] || MATERIAL_CLASS_MAP[compatibilityTerrainClass] || MATERIAL_CLASS_MAP.ocean_basin;

    const isLandBase = LAND_CLASSES.has(terrainClass) || composition.isLand || elevation.isLand;
    const isWaterBase = WATER_CLASSES.has(terrainClass) || composition.isWater || elevation.isWater;
    const isWaterOccupied = isWaterBase || hydrology.waterFillStrength > 0.34 || hydrology.waterFill === true || terrainClass === "bay_cut" || terrainClass === "coastal_inlet_cut";

    const noiseA = textureNoise(p, terrainClass.length + (numberField(composition, "continentIndex", 0) + 31));
    const noiseB = textureNoise({ x: p.y, y: p.z, z: p.x }, 73);
    const materialNoise = clamp01(noiseA * 0.56 + noiseB * 0.44);

    const feeds = computeMaterialFeeds(composition, elevation, tectonics, hydrology);

    let rgb = isWaterOccupied
      ? baseWaterColor(composition, elevation, hydrology, terrainClass)
      : baseLandColor(composition, elevation, terrainClass);

    if (!isWaterOccupied && isLandBase) {
      if (terrainClass === "coast_edge") rgb = mixColor(rgb, PALETTE.oldStone, 0.22);
      if (terrainClass === "cliff_escarpment") rgb = mixColor(rgb, PALETTE.hardCoast, 0.24);
      if (terrainClass === "waterfall_escarpment") rgb = mixColor(rgb, PALETTE.wetStone, 0.20);
      if (terrainClass === "maritime_archipelago" || terrainClass === "island_arc") rgb = mixColor(rgb, PALETTE.darkGreen, 0.18);
      if (terrainClass === "summit_region") rgb = mixColor(rgb, PALETTE.coordinateSummit, clamp01(elevation.summitPotential * 0.22));
    }

    rgb = applyMaterialExpression(rgb, terrainClass, composition, elevation, tectonics, hydrology, feeds, materialNoise);

    if (hydrology.aboveSeaLevelStrength > 0.56 && feeds.waterFillMaterialFeed < 0.28 && terrainClass !== "bay_cut" && terrainClass !== "coastal_inlet_cut") {
      rgb = mixColor(rgb, baseLandColor(composition, elevation, terrainClass), clamp01(hydrology.aboveSeaLevelStrength * 0.22));
    }

    const fields = outputFieldsFor(composition, elevation, tectonics, hydrology, feeds, isLandBase, isWaterOccupied);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      oldRequiredElevationContract: OLD_REQUIRED_ELEVATION_CONTRACT,
      requiredElevationContract: REQUIRED_ELEVATION_CONTRACT,
      activeElevationContractRequired: REQUIRED_ELEVATION_CONTRACT,
      version: VERSION,
      authority: "materials",
      sourceAuthority: "hearth.composition.js + hearth.elevation.js + hearth.tectonics.js + hearth.hydrology.js",

      rgb,
      color: rgb,
      baseColor: rgb,
      finalColorHint: rgb,
      alpha: fields.alpha,

      isLand: fields.isLand,
      isWater: fields.isWater,
      isWaterOccupied,

      terrainClass,
      worldTerrainClass: terrainClass,
      expandedTerrainClass: composition.expandedTerrainClass || terrainClass,
      semanticTerrainClass: composition.semanticTerrainClass || terrainClass,
      compatibilityTerrainClass,

      materialClass,
      surfaceFamily: fields.isWater ? "water" : "land",
      visualPriority: fields.isWater ? 0.66 : 0.80,

      continentId: composition.continentId,
      continentName: composition.continentName || "Open Ocean",
      continentIndex: Number.isFinite(Number(composition.continentIndex)) ? Number(composition.continentIndex) : -1,
      continentClass: composition.continentClass || "open_ocean",

      climateHint: composition.climateHint || composition.climateClass || "open_ocean",
      climateClass: composition.climateClass || "open_ocean",

      summitRegionHint: elevation.summitRegionHint || composition.summitRegionHint || "none",
      summitRegionLabel: elevation.summitRegionLabel || composition.summitRegionLabel || "None",
      summitTerrainHint: elevation.summitTerrainHint || composition.summitTerrainHint || "none",
      summitBookSummit: elevation.summitBookSummit || "none",
      summitClass: composition.summitClass || "none",

      newsProtocolActive: elevation.newsProtocolActive,
      fibonacciAlignmentActive: elevation.fibonacciAlignmentActive,
      newsProtocolSynchronized: elevation.newsProtocolSynchronized,
      fibonacciAlignmentSynchronized: elevation.fibonacciAlignmentSynchronized,
      activeFibonacciGate: "F13",
      futureFibonacciGate: "F21",
      coordinateBodyResolverActive: elevation.coordinateBodyResolverActive,
      coordinateMapRole: elevation.coordinateMapRole,
      coordinateMapIsTectonicOrigin: elevation.coordinateMapIsTectonicOrigin,

      materialConsumesIslandElevation: true,
      elevationConsumesIslands: true,
      islandFeatureConsumptionActive: true,
      staleElevationContractReconciled: true,
      oldElevationContractReconciled: true,
      elevationContractMatchesActive: elevation.elevationContractMatchesActive,
      elevationConsumedDirectlyByMaterials: elevation.elevationConsumedDirectlyByMaterials,
      elevationAuthorityPresent: elevation.elevationAuthorityPresent,

      islandFeatureCategory: elevation.islandFeatureCategory,
      islandFeatureFamily: elevation.islandFeatureFamily,
      islandParentCoastRelation: elevation.islandParentCoastRelation,
      islandCoastalRelationOnly: elevation.islandCoastalRelationOnly,
      islandDetachedBody: elevation.islandDetachedBody,
      islandVisibleIsland: elevation.islandVisibleIsland,
      islandFeatureId: elevation.islandFeatureId,
      islandRegion: elevation.islandRegion,
      islandRegionName: elevation.islandRegionName,
      peninsulaStrength: elevation.peninsulaStrength,
      bayCarveStrength: elevation.bayCarveStrength,
      keyStrength: elevation.keyStrength,
      mainIslandStrength: elevation.mainIslandStrength,
      islandStrength: elevation.islandStrength,
      peninsulaElevationInfluence: elevation.peninsulaElevationInfluence,
      bayCarveElevationInfluence: elevation.bayCarveElevationInfluence,
      keyIslandElevationInfluence: elevation.keyIslandElevationInfluence,
      mainIslandElevationInfluence: elevation.mainIslandElevationInfluence,
      detachedIslandElevationInfluence: elevation.detachedIslandElevationInfluence,
      attachedCoastPressure: elevation.attachedCoastPressure,
      coastalCutPressure: elevation.coastalCutPressure,
      islandCoastPressure: elevation.islandCoastPressure,
      islandShelfPressure: elevation.islandShelfPressure,
      islandReliefPressure: elevation.islandReliefPressure,
      inactiveIslandFeatureNoOp: elevation.inactiveIslandFeatureNoOp,
      sevenContinentBodySeatsPreserved: elevation.sevenContinentBodySeatsPreserved,
      islandsDoNotReplaceBodySeats: elevation.islandsDoNotReplaceBodySeats,

      bodySeatId: elevation.bodySeatId,
      bodySeatName: elevation.bodySeatName,
      bodySeatIndex: elevation.bodySeatIndex,
      bodySeatPressureId: elevation.bodySeatPressureId,
      bodySeatNews: elevation.bodySeatNews,
      bodySeatFibonacci: elevation.bodySeatFibonacci,
      bodySeatDistanceDeg: elevation.bodySeatDistanceDeg,
      bodySeatPressure: elevation.bodySeatPressure,
      bodyInteriorPressure: elevation.bodyInteriorPressure,
      bodyEdgePressure: elevation.bodyEdgePressure,
      bodyBreadthPressure: elevation.bodyBreadthPressure,
      bodyRoughnessPressure: elevation.bodyRoughnessPressure,
      bodyCoordinateClass: elevation.bodyCoordinateClass,

      oceanSeatId: elevation.oceanSeatId,
      oceanSeatName: elevation.oceanSeatName,
      oceanSeatNews: elevation.oceanSeatNews,
      oceanSeatFibonacci: elevation.oceanSeatFibonacci,
      oceanSeatPressure: elevation.oceanSeatPressure,
      oceanDepthPressure: elevation.oceanDepthPressure,

      channelSeatId: elevation.channelSeatId,
      channelSeatNews: elevation.channelSeatNews,
      channelSeatFibonacci: elevation.channelSeatFibonacci,
      channelSeatPressure: elevation.channelSeatPressure,
      channelCutPressure: elevation.channelCutPressure,

      tectonicClass: tectonics.tectonicClass,
      plateClass: tectonics.plateClass,

      hydrologyClass: hydrology.hydrologyClass,
      waterBoundaryClass: hydrology.waterBoundaryClass,
      coastBoundaryClass: hydrology.coastBoundaryClass,
      shorelineType: hydrology.shorelineType,
      shelfType: hydrology.shelfType,
      basinType: hydrology.basinType,
      drainageType: hydrology.drainageType,

      elevation: elevation.elevation,
      seaLevel: elevation.seaLevel,
      landPotential: composition.landPotential,
      coastPotential: composition.coastPotential,
      waterDepthPotential: composition.waterDepthPotential,
      oceanBasinPotential: composition.oceanBasinPotential,
      continentShelfPotential: composition.continentShelfPotential,
      shelfPotential: composition.shelfPotential,

      relativeSeaElevation: hydrology.relativeSeaElevation,
      belowSeaLevel: hydrology.belowSeaLevel,
      nearSeaLevel: hydrology.nearSeaLevel,
      aboveSeaLevel: hydrology.aboveSeaLevel,
      belowSeaLevelStrength: hydrology.belowSeaLevelStrength,
      nearSeaLevelStrength: hydrology.nearSeaLevelStrength,
      aboveSeaLevelStrength: hydrology.aboveSeaLevelStrength,
      waterFill: hydrology.waterFill,
      waterFillStrength: hydrology.waterFillStrength,
      waterDepth: hydrology.waterDepth,
      waterDepthClass: hydrology.waterDepthClass,
      waterlineBoundary: hydrology.waterlineBoundary,
      waterlineBoundaryStrength: hydrology.waterlineBoundaryStrength,
      shallowShelf: hydrology.shallowShelf,
      shallowShelfStrength: hydrology.shallowShelfStrength,
      beachCandidate: hydrology.beachCandidate,
      beachStrength: hydrology.beachStrength,
      sandShelf: hydrology.sandShelf,
      sandShelfStrength: hydrology.sandShelfStrength,
      hardCoastCandidate: hydrology.hardCoastCandidate,
      hardCoastStrength: hydrology.hardCoastStrength,
      cliffWaterEdge: hydrology.cliffWaterEdge,
      cliffWaterEdgeStrength: hydrology.cliffWaterEdgeStrength,
      submergedBlock: hydrology.submergedBlock,
      submergedBlockStrength: hydrology.submergedBlockStrength,
      submergedScar: hydrology.submergedScar,
      submergedScarStrength: hydrology.submergedScarStrength,
      wetStoneEdge: hydrology.wetStoneEdge,
      wetStoneStrength: hydrology.wetStoneStrength,
      oldCoastalTechSubmerged: hydrology.oldCoastalTechSubmerged,
      oldCoastalTechSubmergedStrength: hydrology.oldCoastalTechSubmergedStrength,

      landDensity: fields.landDensity,
      shorelineGrounding: fields.shorelineGrounding,
      contactShadow: fields.contactShadow,
      underlandOcclusion: fields.underlandOcclusion,
      shelfTransition: fields.shelfTransition,
      terrainRelief: fields.terrainRelief,
      ridgeRelief: fields.ridgeRelief,
      basinShade: fields.basinShade,
      rimDarkening: fields.rimDarkening,
      rimCompression: fields.rimCompression,
      atmosphereSeparation: fields.atmosphereSeparation,
      surfaceAttachment: fields.surfaceAttachment,
      curvatureLock: fields.curvatureLock,
      waterDepthShade: fields.waterDepthShade,
      bridgePotential: fields.bridgePotential,

      continentPotential: composition.continentPotential,
      continentSeparation: composition.continentSeparation,
      mountainArcPotential: composition.mountainArcPotential,
      plateauPotential: composition.plateauPotential,
      canyonPotential: composition.canyonPotential,
      escarpmentPotential: composition.escarpmentPotential,
      waterfallCandidate: composition.waterfallCandidate,
      archipelagoPotential: composition.archipelagoPotential,
      basinPotential: composition.basinPotential,
      summitPotential: elevation.summitPotential,

      ...feeds,

      beachShelfWetStoneStrengthened: true,
      peninsulaMaterialFeedActive: true,
      bayCutMaterialFeedActive: true,
      keyIslandMaterialFeedActive: true,
      mainIslandMaterialFeedActive: true,
      detachedIslandRimFeedActive: true,
      ridgeBandMaterialFeedActive: true,
      inlandReliefMaterialFeedActive: true,
      canvasReceiverPosturePreserved: true,

      materialNoise,

      compositionContract: composition.contract || "UNKNOWN_COMPOSITION_CONTRACT",
      elevationContract: elevation.contract || "UNKNOWN_ELEVATION_CONTRACT",
      tectonicsContract: tectonics.contract || "UNKNOWN_TECTONICS_CONTRACT",
      hydrologyContract: hydrology.contract || "UNKNOWN_HYDROLOGY_CONTRACT",

      ownsElevationGeneration: false,
      ownsCompositionClassification: false,
      ownsTectonicPressureGeneration: false,
      ownsHydrologyClassification: false,
      ownsIslandGeometry: false,
      ownsCanvasDrawingAuthority: false,
      ownsRuntimeMotion: false,
      ownsControls: false,
      ownsRouteOrchestration: false,
      ownsZoom: false,
      ownsFinalVisualPassClaim: false,

      f21ClaimedByMaterials: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  const read = (...args) => sample(...args);
  const getMaterial = (...args) => sample(...args);
  const materialAt = (...args) => sample(...args);
  const getMaterialAt = (...args) => sample(...args);
  const getSurfaceMaterial = (...args) => sample(...args);
  const resolve = (...args) => sample(...args);
  const resolveMaterial = (...args) => sample(...args);

  function blendPixel(data, index, target, amount) {
    const k = clamp01(amount);
    data[index] = Math.round(mixNumber(data[index], target[0], k));
    data[index + 1] = Math.round(mixNumber(data[index + 1], target[1], k));
    data[index + 2] = Math.round(mixNumber(data[index + 2], target[2], k));
  }

  function createTextureCanvas(options = {}) {
    const requestedWidth = Number.isFinite(Number(options.width)) ? Math.round(Number(options.width)) : 768;
    const requestedHeight = Number.isFinite(Number(options.height)) ? Math.round(Number(options.height)) : 384;

    const width = clamp(requestedWidth, 32, options.allowLargeTexture === true ? 1536 : 1024);
    const height = clamp(requestedHeight, 16, options.allowLargeTexture === true ? 768 : 512);
    const size = width * height;

    if (!root.document || typeof root.document.createElement !== "function") {
      throw new Error("Hearth materials texture canvas requires document.createElement.");
    }

    const canvas = root.document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.dataset.hearthMaterialsTexture = "true";
    canvas.dataset.hearthMaterialsContract = CONTRACT;
    canvas.dataset.hearthMaterialsReceipt = RECEIPT;
    canvas.dataset.hearthMaterialsIslandElevationConsumer = "true";
    canvas.dataset.hearthMaterialsActiveElevationContractRequired = REQUIRED_ELEVATION_CONTRACT;
    canvas.dataset.hearthMaterialsStaleElevationContractReconciled = "true";
    canvas.dataset.hearthMaterialsSeaLevelWaterline = "true";
    canvas.dataset.hearthMaterialsBeachShelf = "true";
    canvas.dataset.hearthMaterialsWetStone = "true";
    canvas.dataset.hearthMaterialsSubmergedBlock = "true";
    canvas.dataset.hearthMaterialsSubmergedScar = "true";
    canvas.dataset.hearthMaterialsSubmergedPortBasin = "true";
    canvas.dataset.hearthMaterialsPeninsulaFeed = "true";
    canvas.dataset.hearthMaterialsBayCutFeed = "true";
    canvas.dataset.hearthMaterialsKeyIslandFeed = "true";
    canvas.dataset.hearthMaterialsMainIslandFeed = "true";
    canvas.dataset.hearthMaterialsDetachedIslandRimFeed = "true";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.webgl = "false";
    canvas.dataset.visualPassClaimed = "false";

    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });
    const image = ctx.createImageData(width, height);
    const data = image.data;

    const waterFill = new Float32Array(size);
    const waterline = new Float32Array(size);
    const beach = new Float32Array(size);
    const sandShelf = new Float32Array(size);
    const wetStone = new Float32Array(size);
    const hardCoast = new Float32Array(size);
    const submergedBlock = new Float32Array(size);
    const submergedScar = new Float32Array(size);
    const portBasin = new Float32Array(size);
    const scarStrength = new Float32Array(size);
    const coordinateEdge = new Float32Array(size);
    const coordinateChannel = new Float32Array(size);
    const coordinateSummit = new Float32Array(size);
    const peninsulaFeed = new Float32Array(size);
    const bayCutFeed = new Float32Array(size);
    const keyFeed = new Float32Array(size);
    const mainIslandFeed = new Float32Array(size);
    const islandRimFeed = new Float32Array(size);
    const ridgeFeed = new Float32Array(size);
    const inlandReliefFeed = new Float32Array(size);

    for (let y = 0; y < height; y += 1) {
      const v = height <= 1 ? 0 : y / (height - 1);

      for (let x = 0; x < width; x += 1) {
        const u = width <= 1 ? 0 : x / (width - 1);
        const material = sample({ u, v });
        const p = y * width + x;
        const index = p * 4;

        data[index] = material.rgb[0];
        data[index + 1] = material.rgb[1];
        data[index + 2] = material.rgb[2];
        data[index + 3] = Math.round(clamp01(material.alpha) * 255);

        waterFill[p] = clamp01(material.waterFillMaterialFeed);
        waterline[p] = clamp01(material.waterlineMaterialFeed);
        beach[p] = clamp01(material.beachMaterialFeed);
        sandShelf[p] = clamp01(material.sandShelfMaterialFeed);
        wetStone[p] = clamp01(material.wetStoneMaterialFeed);
        hardCoast[p] = clamp01(material.hardCoastMaterialFeed + material.cliffWaterEdgeMaterialFeed * 0.50);
        submergedBlock[p] = clamp01(material.submergedBlockMaterialFeed);
        submergedScar[p] = clamp01(material.submergedScarMaterialFeed + material.oldCoastalTechUnderwaterMaterialFeed * 0.35);
        portBasin[p] = clamp01(material.submergedPortBasinMaterialFeed);
        scarStrength[p] = clamp01(material.boundaryMorphologyFeed + material.submergedScarMaterialFeed * 0.25);
        coordinateEdge[p] = clamp01(material.coordinateBodyEdgeMaterialFeed);
        coordinateChannel[p] = clamp01(material.coordinateChannelCutMaterialFeed);
        coordinateSummit[p] = clamp01(material.coordinateSummitMaterialFeed);
        peninsulaFeed[p] = clamp01(material.peninsulaCoastMaterialFeed);
        bayCutFeed[p] = clamp01(material.bayCutMaterialFeed + material.coastalInletMaterialFeed * 0.40);
        keyFeed[p] = clamp01(material.keyIslandMaterialFeed);
        mainIslandFeed[p] = clamp01(material.mainIslandMaterialFeed);
        islandRimFeed[p] = clamp01(material.detachedIslandRimFeed);
        ridgeFeed[p] = clamp01(material.ridgeBandMaterialFeed);
        inlandReliefFeed[p] = clamp01(material.inlandReliefMaterialFeed);
      }
    }

    const original = new Uint8ClampedArray(data);

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const p = y * width + x;
        const index = p * 4;

        let nWater = 0;
        let nLine = 0;
        let nBeach = 0;
        let nWet = 0;
        let nHard = 0;
        let nBlock = 0;
        let nScar = 0;
        let nPort = 0;
        let nEdge = 0;
        let nChannel = 0;
        let nSummit = 0;
        let nPeninsula = 0;
        let nBay = 0;
        let nKey = 0;
        let nMain = 0;
        let nRim = 0;
        let nRidge = 0;
        let nRelief = 0;
        let weight = 0;

        for (let oy = -1; oy <= 1; oy += 1) {
          const yy = y + oy;
          if (yy < 0 || yy >= height) continue;

          for (let ox = -1; ox <= 1; ox += 1) {
            const xx = x + ox;
            if (xx < 0 || xx >= width) continue;

            const q = yy * width + xx;
            const w = ox === 0 && oy === 0 ? 1.0 : ox === 0 || oy === 0 ? 0.70 : 0.50;

            weight += w;
            nWater += waterFill[q] * w;
            nLine += waterline[q] * w;
            nBeach += beach[q] * w;
            nWet += wetStone[q] * w;
            nHard += hardCoast[q] * w;
            nBlock += submergedBlock[q] * w;
            nScar += submergedScar[q] * w;
            nPort += portBasin[q] * w;
            nEdge += coordinateEdge[q] * w;
            nChannel += coordinateChannel[q] * w;
            nSummit += coordinateSummit[q] * w;
            nPeninsula += peninsulaFeed[q] * w;
            nBay += bayCutFeed[q] * w;
            nKey += keyFeed[q] * w;
            nMain += mainIslandFeed[q] * w;
            nRim += islandRimFeed[q] * w;
            nRidge += ridgeFeed[q] * w;
            nRelief += inlandReliefFeed[q] * w;
          }
        }

        const denom = Math.max(0.000001, weight);
        nWater = clamp01(nWater / denom);
        nLine = clamp01(nLine / denom);
        nBeach = clamp01(nBeach / denom);
        nWet = clamp01(nWet / denom);
        nHard = clamp01(nHard / denom);
        nBlock = clamp01(nBlock / denom);
        nScar = clamp01(nScar / denom);
        nPort = clamp01(nPort / denom);
        nEdge = clamp01(nEdge / denom);
        nChannel = clamp01(nChannel / denom);
        nSummit = clamp01(nSummit / denom);
        nPeninsula = clamp01(nPeninsula / denom);
        nBay = clamp01(nBay / denom);
        nKey = clamp01(nKey / denom);
        nMain = clamp01(nMain / denom);
        nRim = clamp01(nRim / denom);
        nRidge = clamp01(nRidge / denom);
        nRelief = clamp01(nRelief / denom);

        data[index] = original[index];
        data[index + 1] = original[index + 1];
        data[index + 2] = original[index + 2];
        data[index + 3] = original[index + 3];

        if (nWater > 0.18) {
          blendPixel(data, index, PALETTE.waterFill, nWater * 0.10);
          blendPixel(data, index, PALETTE.deepWater, Math.max(0, nWater - 0.42) * 0.14);
        }

        if (nBay > 0.14) {
          blendPixel(data, index, PALETTE.bayCut, nBay * 0.16);
          blendPixel(data, index, PALETTE.submergedScar, nBay * 0.08);
        }

        if (nPeninsula > 0.14) blendPixel(data, index, PALETTE.peninsula, nPeninsula * 0.10);
        if (nKey > 0.12) blendPixel(data, index, PALETTE.keyIsland, nKey * 0.12);
        if (nMain > 0.12) blendPixel(data, index, PALETTE.mainIsland, nMain * 0.14);
        if (nRim > 0.14) blendPixel(data, index, PALETTE.islandRim, nRim * 0.10);
        if (nRidge > 0.14) blendPixel(data, index, PALETTE.ridge, nRidge * 0.10);
        if (nRelief > 0.14) blendPixel(data, index, PALETTE.oldStone, nRelief * 0.06);

        if (nEdge > 0.18) blendPixel(data, index, PALETTE.coordinateEdge, nEdge * 0.08);
        if (nChannel > 0.18) blendPixel(data, index, PALETTE.submergedScar, nChannel * 0.10);
        if (nSummit > 0.18 && nWater < 0.34) blendPixel(data, index, PALETTE.coordinateSummit, nSummit * 0.10);

        if (nBlock > 0.16) blendPixel(data, index, PALETTE.submergedBlock, nBlock * 0.16);

        if (nScar > 0.16) {
          blendPixel(data, index, PALETTE.submergedScar, nScar * 0.14);
          data[index + 1] = clamp(Math.round(data[index + 1] * (1 - nScar * 0.04)), 0, 255);
        }

        if (nPort > 0.20) blendPixel(data, index, PALETTE.portBasin, nPort * 0.16);
        if (nLine > 0.18) blendPixel(data, index, PALETTE.mutedShelf, nLine * 0.08);
        if (nWet > 0.16) blendPixel(data, index, PALETTE.wetStone, nWet * 0.13);
        if (nHard > 0.16) blendPixel(data, index, PALETTE.hardCoast, nHard * 0.13);
        if (nBeach > 0.18 && nHard < 0.32) blendPixel(data, index, PALETTE.beachShelf, nBeach * 0.10);
        if (sandShelf[p] > 0.18 && nHard < 0.34) blendPixel(data, index, PALETTE.sandStone, sandShelf[p] * 0.08);

        if (scarStrength[p] > 0.20 && nWater > 0.20) {
          data[index + 1] = clamp(Math.round(data[index + 1] * (1 - scarStrength[p] * 0.05)), 0, 255);
          blendPixel(data, index, PALETTE.submergedScar, scarStrength[p] * 0.06);
        }
      }
    }

    ctx.putImageData(image, 0, 0);
    return canvas;
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      oldRequiredElevationContract: OLD_REQUIRED_ELEVATION_CONTRACT,
      requiredElevationContract: REQUIRED_ELEVATION_CONTRACT,
      activeElevationContractRequired: REQUIRED_ELEVATION_CONTRACT,
      version: VERSION,
      authority: "materials",
      status: "active",
      sourceAuthority: "hearth.composition.js + hearth.elevation.js + hearth.tectonics.js + hearth.hydrology.js",
      purpose: "active-island-elevation-beach-relief-material-expression",
      destinationFile: "/assets/hearth/hearth.materials.js",

      materialConsumesIslandElevation: true,
      activeElevationContractRequired: REQUIRED_ELEVATION_CONTRACT,
      staleElevationContractReconciled: true,
      oldElevationContractReconciled: true,

      supportsExpandedHearthTerrain: true,
      supportsSevenContinentNineClimateTerrain: true,
      supportsSevenClimateTerrainClasses: true,
      supportsSevenContinentRealPlanetMaterials: true,
      supportsAgedTechCoastalBoundaryMaterials: true,
      supportsHydrologyBoundaryConsumer: true,
      supportsAgedTechCoastalBoundaryRefinement: true,
      supportsAgedTechCoastalScarMorphology: true,
      supportsCoastalScarAtlasContinuity: true,
      supportsSeaLevelWaterlineMaterials: true,
      supportsBeachShelfMaterials: true,
      supportsWetStoneBoundaryMaterials: true,
      supportsSubmergedBlockMaterials: true,
      supportsSubmergedScarMaterials: true,
      supportsSubmergedPortBasinMaterials: true,
      supportsNewsFibonacciCoordinateElevationConsumer: true,
      supportsCoordinateBodySeatMaterials: true,
      supportsCoordinateOceanBasinMaterials: true,
      supportsCoordinateChannelCutMaterials: true,
      supportsCoordinateSummitMaterials: true,
      supportsIslandElevationMaterialConsumer: true,
      supportsPeninsulaMaterialFeed: true,
      supportsBayCutMaterialFeed: true,
      supportsKeyIslandMaterialFeed: true,
      supportsMainIslandMaterialFeed: true,
      supportsDetachedIslandRimFeed: true,
      supportsRidgeBandMaterialFeed: true,
      supportsInlandReliefMaterialFeed: true,

      consumesComposition: true,
      consumesElevation: true,
      consumesActiveElevationContract: true,
      consumesTectonics: true,
      consumesHydrology: true,
      consumesIslandElevationFields: true,
      prefersWorldTerrainClass: true,
      directElevationConsumer: true,
      canvasReceiverPosturePreserved: true,

      beachShelfWetStoneStrengthened: true,
      peninsulaMaterialFeedActive: true,
      bayCutMaterialFeedActive: true,
      keyIslandMaterialFeedActive: true,
      mainIslandMaterialFeedActive: true,
      detachedIslandRimFeedActive: true,
      ridgeBandMaterialFeedActive: true,
      inlandReliefMaterialFeedActive: true,

      atlasContinuity: {
        stage: "createTextureCanvas-local-neighbor-pass",
        neighborhood: "3x3",
        floodFill: false,
        recursion: false,
        graphTraversal: false,
        runtimeFrameCost: false,
        typedArrays: true
      },

      terrainClasses: TERRAIN_CLASSES.slice(),
      materialClassMap: { ...MATERIAL_CLASS_MAP },

      requiredIslandElevationFields: [
        "islandFeatureCategory",
        "islandFeatureFamily",
        "islandParentCoastRelation",
        "islandCoastalRelationOnly",
        "islandDetachedBody",
        "islandVisibleIsland",
        "islandFeatureId",
        "islandRegion",
        "islandRegionName",
        "peninsulaStrength",
        "bayCarveStrength",
        "keyStrength",
        "mainIslandStrength",
        "islandStrength",
        "peninsulaElevationInfluence",
        "bayCarveElevationInfluence",
        "keyIslandElevationInfluence",
        "mainIslandElevationInfluence",
        "detachedIslandElevationInfluence",
        "attachedCoastPressure",
        "coastalCutPressure",
        "islandCoastPressure",
        "islandShelfPressure",
        "islandReliefPressure",
        "inactiveIslandFeatureNoOp",
        "sevenContinentBodySeatsPreserved",
        "islandsDoNotReplaceBodySeats"
      ],

      outputFields: [
        "rgb",
        "alpha",
        "isLand",
        "isWater",
        "materialClass",
        "terrainClass",
        "landDensity",
        "shorelineGrounding",
        "contactShadow",
        "underlandOcclusion",
        "shelfTransition",
        "terrainRelief",
        "ridgeRelief",
        "basinShade",
        "rimDarkening",
        "rimCompression",
        "atmosphereSeparation",
        "surfaceAttachment",
        "curvatureLock",
        "waterDepthShade",
        "bridgePotential",
        "bodySeatId",
        "bodySeatNews",
        "bodySeatFibonacci",
        "bodySeatPressure",
        "bodyInteriorPressure",
        "bodyEdgePressure",
        "oceanSeatId",
        "oceanDepthPressure",
        "channelSeatId",
        "channelCutPressure",
        "summitBookSummit",
        "islandFeatureCategory",
        "peninsulaCoastMaterialFeed",
        "bayCutMaterialFeed",
        "coastalInletMaterialFeed",
        "keyIslandMaterialFeed",
        "mainIslandMaterialFeed",
        "detachedIslandRimFeed",
        "islandShelfMaterialFeed",
        "islandReliefMaterialFeed",
        "beachRimMaterialFeed",
        "cliffContactMaterialFeed",
        "ridgeBandMaterialFeed",
        "inlandReliefMaterialFeed",
        "coordinateLandBodyMaterialFeed",
        "coordinateBodyInteriorMaterialFeed",
        "coordinateBodyEdgeMaterialFeed",
        "coordinateOceanBasinMaterialFeed",
        "coordinateChannelCutMaterialFeed",
        "coordinateSummitMaterialFeed",
        "coordinateNewsBoundaryFeed",
        "elevationReliefMaterialFeed",
        "seaLevelMaterialFeed",
        "waterFillMaterialFeed",
        "waterlineMaterialFeed",
        "shallowShelfMaterialFeed",
        "beachMaterialFeed",
        "sandShelfMaterialFeed",
        "wetStoneMaterialFeed",
        "hardCoastMaterialFeed",
        "cliffWaterEdgeMaterialFeed",
        "submergedBlockMaterialFeed",
        "submergedScarMaterialFeed",
        "submergedPortBasinMaterialFeed",
        "oldCoastalTechUnderwaterMaterialFeed"
      ],

      designRules: [
        "elevation resolves height and island/coastal feature influence",
        "materials consume active elevation directly but do not generate elevation",
        "hydrology classifies sea-level truth",
        "materials express waterline truth",
        "water defines true coast",
        "land-water overlap is valid only when classified",
        "coordinate body edge must influence coast material",
        "coordinate ocean basin must influence water depth material",
        "coordinate channel cut must influence submerged scar material",
        "coordinate summit must influence summit material only",
        "peninsulas remain attached-coast material",
        "bays remain negative water/coast cuts",
        "keys remain low detached island-chain material",
        "main islands remain larger detached island-body material",
        "islands do not replace seven-continent body seats",
        "beaches appear only on shallow soft transitions",
        "cliff-water edges remain hard and dark",
        "submerged blocks read as lower-level structure",
        "submerged scars read as aged underwater evidence",
        "port basin remains implied, not deployed",
        "canvas remains receiver only",
        "route held",
        "no final visual pass claim"
      ],

      forbiddenOwnership: [
        "elevation-generation",
        "composition-classification",
        "tectonic-pressure-generation",
        "hydrology-classification",
        "island-geometry",
        "canvas-drawing-authority",
        "runtime-motion",
        "controls",
        "route-orchestration",
        "zoom",
        "teleports",
        "clickable-coastal-objects",
        "final-visual-pass-claim"
      ],

      ownsElevationGeneration: false,
      ownsCompositionClassification: false,
      ownsTectonicPressureGeneration: false,
      ownsHydrologyClassification: false,
      ownsIslandGeometry: false,
      ownsCanvasDrawingAuthority: false,
      ownsRuntimeMotion: false,
      ownsControls: false,
      ownsRouteOrchestration: false,
      ownsZoom: false,
      ownsFinalVisualPassClaim: false,

      f21ClaimedByMaterials: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    oldRequiredElevationContract: OLD_REQUIRED_ELEVATION_CONTRACT,
    requiredElevationContract: REQUIRED_ELEVATION_CONTRACT,
    activeElevationContractRequired: REQUIRED_ELEVATION_CONTRACT,
    version: VERSION,

    sample,
    read,
    getMaterial,
    materialAt,
    getMaterialAt,
    getSurfaceMaterial,
    resolve,
    resolveMaterial,
    createTextureCanvas,
    getReceipt,

    terrainClasses: TERRAIN_CLASSES.slice(),
    materialClassMap: { ...MATERIAL_CLASS_MAP },

    materialConsumesIslandElevation: true,
    activeElevationContractRequired: REQUIRED_ELEVATION_CONTRACT,
    staleElevationContractReconciled: true,
    oldElevationContractReconciled: true,

    supportsExpandedHearthTerrain: true,
    supportsSevenContinentNineClimateTerrain: true,
    supportsSevenClimateTerrainClasses: true,
    supportsSevenContinentRealPlanetMaterials: true,
    supportsAgedTechCoastalBoundaryMaterials: true,
    supportsHydrologyBoundaryConsumer: true,
    supportsAgedTechCoastalBoundaryRefinement: true,
    supportsAgedTechCoastalScarMorphology: true,
    supportsCoastalScarAtlasContinuity: true,
    supportsSeaLevelWaterlineMaterials: true,
    supportsBeachShelfMaterials: true,
    supportsWetStoneBoundaryMaterials: true,
    supportsSubmergedBlockMaterials: true,
    supportsSubmergedScarMaterials: true,
    supportsSubmergedPortBasinMaterials: true,
    supportsNewsFibonacciCoordinateElevationConsumer: true,
    supportsCoordinateBodySeatMaterials: true,
    supportsCoordinateOceanBasinMaterials: true,
    supportsCoordinateChannelCutMaterials: true,
    supportsCoordinateSummitMaterials: true,
    supportsIslandElevationMaterialConsumer: true,
    supportsPeninsulaMaterialFeed: true,
    supportsBayCutMaterialFeed: true,
    supportsKeyIslandMaterialFeed: true,
    supportsMainIslandMaterialFeed: true,
    supportsDetachedIslandRimFeed: true,
    supportsRidgeBandMaterialFeed: true,
    supportsInlandReliefMaterialFeed: true,

    consumesComposition: true,
    consumesElevation: true,
    consumesActiveElevationContract: true,
    consumesTectonics: true,
    consumesHydrology: true,
    consumesIslandElevationFields: true,
    prefersWorldTerrainClass: true,
    directElevationConsumer: true,
    canvasReceiverPosturePreserved: true,

    ownsElevationGeneration: false,
    ownsCompositionClassification: false,
    ownsTectonicPressureGeneration: false,
    ownsHydrologyClassification: false,
    ownsIslandGeometry: false,
    ownsCanvasDrawingAuthority: false,
    ownsRuntimeMotion: false,
    ownsControls: false,
    ownsRouteOrchestration: false,
    ownsZoom: false,
    ownsFinalVisualPassClaim: false,

    f21ClaimedByMaterials: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.materials = api;

  root.HEARTH_MATERIALS = api;
  root.HearthMaterials = api;
  root.HEARTH_MATERIALS_RECEIPT = getReceipt();
  root.HEARTH_MATERIALS_CONTRACT = CONTRACT;
  root.HEARTH_MATERIALS_ACTIVE_ELEVATION_CONTRACT_REQUIRED = REQUIRED_ELEVATION_CONTRACT;
  root.HEARTH_MATERIALS_SUPPORTS_ISLAND_ELEVATION_CONSUMER = true;
  root.HEARTH_MATERIALS_STALE_ELEVATION_CONTRACT_RECONCILED = true;
  root.HEARTH_MATERIALS_SUPPORTS_SEVEN_CLIMATE_TERRAIN_CLASSES = true;
  root.HEARTH_MATERIALS_SUPPORTS_SEVEN_CONTINENT_NINE_CLIMATE_TERRAIN = true;
  root.HEARTH_MATERIALS_SUPPORTS_SEVEN_CONTINENT_REAL_PLANET = true;
  root.HEARTH_MATERIALS_SUPPORTS_AGED_TECH_COASTAL_BOUNDARY = true;
  root.HEARTH_MATERIALS_SUPPORTS_HYDROLOGY_BOUNDARY_CONSUMER = true;
  root.HEARTH_MATERIALS_SUPPORTS_AGED_TECH_COASTAL_BOUNDARY_REFINEMENT = true;
  root.HEARTH_MATERIALS_SUPPORTS_AGED_TECH_COASTAL_SCAR_MORPHOLOGY = true;
  root.HEARTH_MATERIALS_SUPPORTS_COASTAL_SCAR_ATLAS_CONTINUITY = true;
  root.HEARTH_MATERIALS_SUPPORTS_SEA_LEVEL_WATERLINE = true;
  root.HEARTH_MATERIALS_SUPPORTS_BEACH_SHELF = true;
  root.HEARTH_MATERIALS_SUPPORTS_WET_STONE_BOUNDARY = true;
  root.HEARTH_MATERIALS_SUPPORTS_SUBMERGED_BLOCK = true;
  root.HEARTH_MATERIALS_SUPPORTS_SUBMERGED_SCAR = true;
  root.HEARTH_MATERIALS_SUPPORTS_SUBMERGED_PORT_BASIN = true;
  root.HEARTH_MATERIALS_SUPPORTS_NEWS_FIBONACCI_COORDINATE_ELEVATION_CONSUMER = true;
  root.HEARTH_MATERIALS_SUPPORTS_COORDINATE_BODY_SEAT_MATERIALS = true;
  root.HEARTH_MATERIALS_SUPPORTS_COORDINATE_OCEAN_BASIN_MATERIALS = true;
  root.HEARTH_MATERIALS_SUPPORTS_COORDINATE_CHANNEL_CUT_MATERIALS = true;
  root.HEARTH_MATERIALS_SUPPORTS_COORDINATE_SUMMIT_MATERIALS = true;
  root.HEARTH_MATERIALS_SUPPORTS_PENINSULA_MATERIAL_FEED = true;
  root.HEARTH_MATERIALS_SUPPORTS_BAY_CUT_MATERIAL_FEED = true;
  root.HEARTH_MATERIALS_SUPPORTS_KEY_ISLAND_MATERIAL_FEED = true;
  root.HEARTH_MATERIALS_SUPPORTS_MAIN_ISLAND_MATERIAL_FEED = true;
  root.HEARTH_MATERIALS_SUPPORTS_DETACHED_ISLAND_RIM_FEED = true;
  root.HEARTH_MATERIALS_SUPPORTS_RIDGE_BAND_MATERIAL_FEED = true;
  root.HEARTH_MATERIALS_SUPPORTS_INLAND_RELIEF_MATERIAL_FEED = true;

  if (root.document && root.document.documentElement) {
    const dataset = root.document.documentElement.dataset;
    dataset.hearthMaterialsAuthorityLoaded = "true";
    dataset.hearthMaterialsContract = CONTRACT;
    dataset.hearthMaterialsReceipt = RECEIPT;
    dataset.hearthMaterialsPreviousContract = PREVIOUS_CONTRACT;
    dataset.hearthMaterialsBaselineContract = BASELINE_CONTRACT;
    dataset.hearthMaterialsOldRequiredElevationContract = OLD_REQUIRED_ELEVATION_CONTRACT;
    dataset.hearthMaterialsRequiredElevationContract = REQUIRED_ELEVATION_CONTRACT;
    dataset.hearthMaterialsActiveElevationContractRequired = REQUIRED_ELEVATION_CONTRACT;
    dataset.hearthMaterialsStaleElevationContractReconciled = "true";
    dataset.hearthMaterialsOldElevationContractReconciled = "true";

    dataset.hearthMaterialsSupportsExpandedTerrain = "true";
    dataset.hearthMaterialsSupportsSevenContinentNineClimate = "true";
    dataset.hearthMaterialsSupportsSevenClimateTerrainClasses = "true";
    dataset.hearthMaterialsSupportsSevenContinentRealPlanet = "true";
    dataset.hearthMaterialsSupportsAgedTechCoastalBoundary = "true";
    dataset.hearthMaterialsSupportsHydrologyBoundaryConsumer = "true";
    dataset.hearthMaterialsSupportsAgedTechCoastalBoundaryRefinement = "true";
    dataset.hearthMaterialsSupportsAgedTechCoastalScarMorphology = "true";
    dataset.hearthMaterialsSupportsCoastalScarAtlasContinuity = "true";
    dataset.hearthMaterialsSupportsSeaLevelWaterline = "true";
    dataset.hearthMaterialsSupportsBeachShelf = "true";
    dataset.hearthMaterialsSupportsWetStoneBoundary = "true";
    dataset.hearthMaterialsSupportsSubmergedBlock = "true";
    dataset.hearthMaterialsSupportsSubmergedScar = "true";
    dataset.hearthMaterialsSupportsSubmergedPortBasin = "true";
    dataset.hearthMaterialsSupportsNewsFibonacciCoordinateElevationConsumer = "true";
    dataset.hearthMaterialsSupportsCoordinateBodySeatMaterials = "true";
    dataset.hearthMaterialsSupportsCoordinateOceanBasinMaterials = "true";
    dataset.hearthMaterialsSupportsCoordinateChannelCutMaterials = "true";
    dataset.hearthMaterialsSupportsCoordinateSummitMaterials = "true";

    dataset.hearthMaterialsConsumesComposition = "true";
    dataset.hearthMaterialsConsumesElevation = "true";
    dataset.hearthMaterialsConsumesActiveElevationContract = "true";
    dataset.hearthMaterialsConsumesTectonics = "true";
    dataset.hearthMaterialsConsumesHydrology = "true";
    dataset.hearthMaterialsConsumesIslandElevationFields = "true";
    dataset.hearthMaterialsDirectElevationConsumer = "true";
    dataset.hearthMaterialsCanvasReceiverPosturePreserved = "true";

    dataset.hearthMaterialsPeninsulaMaterialFeedActive = "true";
    dataset.hearthMaterialsBayCutMaterialFeedActive = "true";
    dataset.hearthMaterialsKeyIslandMaterialFeedActive = "true";
    dataset.hearthMaterialsMainIslandMaterialFeedActive = "true";
    dataset.hearthMaterialsDetachedIslandRimFeedActive = "true";
    dataset.hearthMaterialsRidgeBandMaterialFeedActive = "true";
    dataset.hearthMaterialsInlandReliefMaterialFeedActive = "true";
    dataset.hearthMaterialsBeachShelfWetStoneStrengthened = "true";

    dataset.hearthMaterialsF21Claimed = "false";
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

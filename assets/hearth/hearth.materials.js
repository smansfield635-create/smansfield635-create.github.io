// /assets/hearth/hearth.materials.js
// HEARTH_AGED_TECH_COASTAL_BOUNDARY_MATERIALS_TNT_v1
// Full-file replacement.
// Materials authority only.
// Purpose:
// - Consume composition + tectonics + hydrology.
// - Preserve canvas v7 compatibility.
// - Reinterpret visible coastal traces as ancient carved, weathered, artificial-natural shoreline systems.
// - Reduce neon/dotted boundary behavior without erasing coastal evidence.
// Does not own:
// - elevation generation
// - composition classification
// - tectonic pressure generation
// - hydrology behavior generation
// - canvas drawing
// - runtime motion
// - controls
// - route orchestration
// - teleports
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_AGED_TECH_COASTAL_BOUNDARY_MATERIALS_TNT_v1";
  const RECEIPT = "HEARTH_AGED_TECH_COASTAL_BOUNDARY_MATERIALS_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_SEVEN_CONTINENT_REAL_PLANET_MATERIALS_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_NINE_SUMMITS_256_GLOBAL_MAP_MATERIALS_TNT_v7";
  const VERSION = "2026-05-28.hearth-aged-tech-coastal-boundary-materials-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const DEG = Math.PI / 180;

  const EXPANDED_TERRAIN_CLASSES = [
    "deep_ocean",
    "ocean_basin",
    "continental_shelf",
    "archipelago_shelf",
    "continent_divide",
    "shallow_water",
    "coast_edge",
    "continent_mass",
    "plateau_interior",
    "basin_floor",
    "mountain_arc",
    "alpine_ridge",
    "canyon_corridor",
    "cliff_escarpment",
    "waterfall_escarpment",
    "island_arc",
    "polar_icefield",
    "tundra_subpolar",
    "temperate_highland",
    "temperate_coastal_storm",
    "rainforest_wet_basin",
    "monsoon_floodplain",
    "arid_dry_plateau",
    "maritime_archipelago",
    "summit_region",
    "raised_land"
  ];

  const MATERIAL_CLASS_MAP = Object.freeze({
    deep_ocean: "water.deep.ocean.body",
    ocean_basin: "water.ocean.basin.readable",
    continental_shelf: "water.shelf.aged.gradient",
    archipelago_shelf: "water.shelf.archipelago.weathered",
    continent_divide: "water.divide.ancient.strait",
    shallow_water: "water.shallow.coastal.transition",
    coast_edge: "coast.aged.carved.boundary",
    continent_mass: "land.continent.embodied.mass",
    raised_land: "land.raised.general",
    plateau_interior: "land.plateau.dense.interior",
    basin_floor: "land.basin.lowland.floor",
    mountain_arc: "land.mountain.arc.relief",
    alpine_ridge: "land.alpine.ridge.coldstone",
    canyon_corridor: "land.canyon.corridor.cut",
    cliff_escarpment: "land.cliff.escarpment.shadow",
    waterfall_escarpment: "land.waterfall.carved.outlet",
    island_arc: "land.island.arc.weathered",
    polar_icefield: "climate.polar.icefield",
    tundra_subpolar: "climate.tundra.subpolar",
    temperate_highland: "climate.temperate.highland",
    temperate_coastal_storm: "coast.storm.weathered.works",
    rainforest_wet_basin: "climate.rainforest.wet.basin",
    monsoon_floodplain: "climate.monsoon.floodplain",
    arid_dry_plateau: "climate.arid.dry.plateau",
    maritime_archipelago: "coast.maritime.old.channels",
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

  const TERRAIN_PALETTE = Object.freeze({
    deep_ocean: [5, 15, 28],
    ocean_basin: [7, 22, 38],
    continental_shelf: [31, 62, 61],
    archipelago_shelf: [33, 70, 63],
    continent_divide: [8, 27, 36],
    shallow_water: [31, 69, 68],

    coast_edge: [83, 86, 61],
    continent_mass: [111, 105, 67],
    raised_land: [104, 103, 65],
    plateau_interior: [127, 105, 65],
    basin_floor: [68, 91, 55],
    mountain_arc: [101, 97, 84],
    alpine_ridge: [132, 139, 124],
    canyon_corridor: [83, 55, 42],
    cliff_escarpment: [67, 63, 57],
    waterfall_escarpment: [95, 111, 98],
    island_arc: [72, 110, 74],

    polar_icefield: [148, 165, 165],
    tundra_subpolar: [101, 116, 95],
    temperate_highland: [78, 112, 65],
    temperate_coastal_storm: [52, 78, 73],
    rainforest_wet_basin: [36, 90, 48],
    monsoon_floodplain: [65, 101, 57],
    arid_dry_plateau: [133, 105, 63],
    maritime_archipelago: [52, 102, 80],
    summit_region: [127, 120, 88],

    continental_core: [109, 103, 65],
    raised_shield: [101, 101, 64],
    coastal_shelf: [28, 63, 66],
    exposed_bridge: [109, 100, 64],
    submerged_bridge: [21, 55, 63],
    ridge_corridor: [94, 89, 70],
    shallow_saddle: [28, 63, 68],
    cliff_candidate: [67, 63, 57],
    valley_candidate: [62, 83, 54],
    mountain_candidate: [101, 97, 82],
    island_seed: [75, 106, 71],
    deep_water: [5, 15, 28]
  });

  const CONTINENT_BASE = Object.freeze({
    western_shield: [118, 112, 73],
    eastern_basin: [92, 108, 66],
    northern_cold: [111, 123, 113],
    southern_harsh: [135, 107, 66],
    equatorial_wet: [55, 108, 56],
    mountain_arc: [111, 109, 94],
    broken_archipelago: [73, 113, 80],
    open_ocean: [7, 22, 38]
  });

  const CLIMATE_BIAS = Object.freeze({
    polar_icefield: [28, 38, 39],
    tundra_subpolar: [10, 16, 10],
    temperate_highland: [-8, 18, -8],
    temperate_coastal_storm: [-17, 4, 9],
    rainforest_wet_basin: [-28, 32, -16],
    monsoon_floodplain: [-14, 22, -8],
    arid_dry_plateau: [24, 10, -16],
    alpine_mountain_arc: [16, 16, 16],
    maritime_archipelago: [-12, 20, 9],
    open_ocean: [-3, 0, 6]
  });

  const WATER_CLASSES = new Set([
    "deep_ocean",
    "ocean_basin",
    "continental_shelf",
    "archipelago_shelf",
    "continent_divide",
    "shallow_water",
    "deep_water",
    "coastal_shelf",
    "submerged_bridge",
    "shallow_saddle"
  ]);

  const LAND_CLASSES = new Set([
    "coast_edge",
    "continent_mass",
    "raised_land",
    "plateau_interior",
    "basin_floor",
    "mountain_arc",
    "alpine_ridge",
    "canyon_corridor",
    "cliff_escarpment",
    "waterfall_escarpment",
    "island_arc",
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

  const clamp = (value, min, max) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  };

  const clamp01 = (value) => clamp(value, 0, 1);

  const mixNumber = (a, b, t) => {
    const k = clamp01(t);
    return a + (b - a) * k;
  };

  const mixColor = (a, b, t) => {
    const k = clamp01(t);
    return [
      Math.round(mixNumber(a[0], b[0], k)),
      Math.round(mixNumber(a[1], b[1], k)),
      Math.round(mixNumber(a[2], b[2], k))
    ];
  };

  const addColor = (base, delta, weight = 1) => {
    const k = clamp01(weight);
    return [
      clamp(Math.round(base[0] + delta[0] * k), 0, 255),
      clamp(Math.round(base[1] + delta[1] * k), 0, 255),
      clamp(Math.round(base[2] + delta[2] * k), 0, 255)
    ];
  };

  const scaleColor = (base, scalar) => {
    const s = Number.isFinite(Number(scalar)) ? Number(scalar) : 1;
    return [
      clamp(Math.round(base[0] * s), 0, 255),
      clamp(Math.round(base[1] * s), 0, 255),
      clamp(Math.round(base[2] * s), 0, 255)
    ];
  };

  const smoothstep = (edge0, edge1, x) => {
    const t = clamp((x - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  };

  const normalize3 = (p) => {
    const x = Number.isFinite(Number(p && p.x)) ? Number(p.x) : 0;
    const y = Number.isFinite(Number(p && p.y)) ? Number(p.y) : 0;
    const z = Number.isFinite(Number(p && p.z)) ? Number(p.z) : 1;
    const m = Math.hypot(x, y, z) || 1;

    return {
      x: x / m,
      y: y / m,
      z: z / m
    };
  };

  const lonLatToVector = (lonDeg, latDeg) => {
    const lon = Number(lonDeg || 0) * DEG;
    const lat = Number(latDeg || 0) * DEG;
    const c = Math.cos(lat);

    return normalize3({
      x: Math.sin(lon) * c,
      y: Math.sin(lat),
      z: Math.cos(lon) * c
    });
  };

  const parseInput = (...args) => {
    if (args.length === 1 && args[0] && typeof args[0] === "object") {
      const p = args[0];

      if (
        Number.isFinite(Number(p.x)) &&
        Number.isFinite(Number(p.y)) &&
        Number.isFinite(Number(p.z))
      ) {
        return normalize3(p);
      }

      if (Number.isFinite(Number(p.lon)) && Number.isFinite(Number(p.lat))) {
        return lonLatToVector(Number(p.lon), Number(p.lat));
      }

      if (Number.isFinite(Number(p.longitude)) && Number.isFinite(Number(p.latitude))) {
        return lonLatToVector(Number(p.longitude), Number(p.latitude));
      }

      if (Number.isFinite(Number(p.u)) && Number.isFinite(Number(p.v))) {
        return lonLatToVector(Number(p.u) * 360 - 180, 90 - Number(p.v) * 180);
      }
    }

    if (args.length >= 3) {
      return normalize3({ x: args[0], y: args[1], z: args[2] });
    }

    if (args.length >= 2) {
      return lonLatToVector(Number(args[0]), Number(args[1]));
    }

    return lonLatToVector(0, 0);
  };

  const hashNoise = (x, y, z, salt = 0) => {
    const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + salt * 53.19) * 43758.5453123;
    return n - Math.floor(n);
  };

  const textureNoise = (p, salt = 0) => {
    const n1 = hashNoise(p.x, p.y, p.z, salt);
    const n2 = hashNoise(p.y + n1, p.z - n1, p.x + n1, salt + 11);
    const n3 = hashNoise(p.z - n2, p.x + n2, p.y - n2, salt + 29);
    return clamp01(n1 * 0.48 + n2 * 0.34 + n3 * 0.18);
  };

  const numberField = (source, key, fallback = 0) => {
    const n = Number(source && source[key]);
    return Number.isFinite(n) ? n : fallback;
  };

  const boolField = (source, key, fallback = false) => {
    return typeof (source && source[key]) === "boolean" ? source[key] : fallback;
  };

  const stringField = (source, key, fallback = "") => {
    return typeof (source && source[key]) === "string" && source[key] ? source[key] : fallback;
  };

  const getCompositionAuthority = () => {
    if (root.HEARTH && root.HEARTH.composition) return root.HEARTH.composition;
    if (root.HEARTH_COMPOSITION) return root.HEARTH_COMPOSITION;
    if (root.HearthComposition) return root.HearthComposition;
    return null;
  };

  const getTectonicsAuthority = () => {
    if (root.HEARTH && root.HEARTH.tectonics) return root.HEARTH.tectonics;
    if (root.HEARTH_TECTONICS) return root.HEARTH_TECTONICS;
    if (root.HearthTectonics) return root.HearthTectonics;
    return null;
  };

  const getHydrologyAuthority = () => {
    if (root.HEARTH && root.HEARTH.hydrology) return root.HEARTH.hydrology;
    if (root.HEARTH_HYDROLOGY) return root.HEARTH_HYDROLOGY;
    if (root.HearthHydrology) return root.HearthHydrology;
    return null;
  };

  const fallbackComposition = (p) => {
    const n = textureNoise(p, 5);
    const landSignal = smoothstep(0.05, 0.85, p.z) * (0.55 + n * 0.45);
    const isLand = landSignal > 0.48;

    return {
      contract: "HEARTH_MATERIALS_FALLBACK_COMPOSITION",
      receipt: "FALLBACK_COMPOSITION_USED",
      worldTerrainClass: isLand ? "continent_mass" : "ocean_basin",
      expandedTerrainClass: isLand ? "continent_mass" : "ocean_basin",
      semanticTerrainClass: isLand ? "continent_mass" : "ocean_basin",
      terrainClass: isLand ? "continent_mass" : "ocean_basin",
      compatibilityTerrainClass: isLand ? "raised_shield" : "deep_water",
      continentId: isLand ? "western_shield" : "open_ocean",
      continentName: isLand ? "Western Shield Continent" : "Open Ocean",
      continentIndex: isLand ? 0 : -1,
      continentClass: isLand ? "western_shield_mass" : "open_ocean",
      climateHint: isLand ? "temperate_highland" : "open_ocean",
      climateClass: isLand ? "temperate_highland" : "open_ocean",
      summitRegionHint: "none",
      summitClass: "none",
      isLand,
      isWater: !isLand,
      isShallowWater: !isLand && n > 0.58,
      isDeepWater: !isLand && n <= 0.58,
      elevation: isLand ? 0.22 : -0.46,
      landPotential: isLand ? 0.74 : 0,
      waterDepthPotential: isLand ? 0 : 0.54,
      oceanBasinPotential: isLand ? 0 : 0.62,
      continentShelfPotential: isLand ? 0.12 : 0.18,
      shelfPotential: isLand ? 0.08 : 0.18,
      coastPotential: isLand ? 0.18 : 0.05,
      mountainArcPotential: 0.12,
      plateauPotential: isLand ? 0.28 : 0,
      canyonPotential: 0,
      escarpmentPotential: 0.08,
      waterfallCandidate: 0,
      archipelagoPotential: 0,
      basinPotential: isLand ? 0.12 : 0,
      ridgePotential: 0.12,
      saddlePotential: 0,
      islandPotential: 0,
      scarPotential: 0,
      massAnchor: isLand ? 0.72 : 0,
      shorelineContact: isLand ? 0.12 : 0,
      shelfDrop: 0.08,
      underlandShadow: 0.08,
      reliefStrength: isLand ? 0.25 : 0,
      slopePressure: 0.08,
      materialDensity: isLand ? 0.72 : 0,
      surfaceAttachment: isLand ? 0.78 : 0.45
    };
  };

  const normalizeComposition = (raw, p) => {
    const source = raw && typeof raw === "object" ? raw : fallbackComposition(p);
    const terrainClass =
      stringField(source, "worldTerrainClass") ||
      stringField(source, "expandedTerrainClass") ||
      stringField(source, "semanticTerrainClass") ||
      stringField(source, "terrainClass") ||
      stringField(source, "compatibilityTerrainClass", "ocean_basin");

    const elevation = numberField(source, "elevation", 0);
    const continentId = stringField(source, "continentId", "open_ocean");

    return {
      ...source,
      terrainClass,
      worldTerrainClass: terrainClass,
      continentId,
      continentName: stringField(source, "continentName", continentId === "open_ocean" ? "Open Ocean" : continentId.replace(/_/g, " ")),
      continentIndex: Number.isFinite(Number(source.continentIndex)) ? Number(source.continentIndex) : -1,
      continentClass: stringField(source, "continentClass", continentId === "open_ocean" ? "open_ocean" : `${continentId}_mass`),
      climateClass: stringField(source, "climateClass", stringField(source, "climateHint", "open_ocean")),
      summitClass: stringField(source, "summitClass", "none"),
      summitRegionHint: stringField(source, "summitRegionHint", "none"),
      summitTerrainHint: stringField(source, "summitTerrainHint", "none"),
      summitPotential: clamp01(numberField(source, "summitPotential", 0)),

      elevation,
      isLand: boolField(source, "isLand", elevation > 0),
      isWater: boolField(source, "isWater", elevation <= 0),
      isShallowWater: boolField(source, "isShallowWater", elevation <= 0 && elevation > -0.18),
      isDeepWater: boolField(source, "isDeepWater", elevation <= -0.18),

      landPotential: clamp01(numberField(source, "landPotential", 0)),
      waterDepthPotential: clamp01(numberField(source, "waterDepthPotential", 0)),
      oceanBasinPotential: clamp01(numberField(source, "oceanBasinPotential", 0)),
      continentShelfPotential: clamp01(numberField(source, "continentShelfPotential", 0)),
      shelfPotential: clamp01(numberField(source, "shelfPotential", 0)),
      coastPotential: clamp01(numberField(source, "coastPotential", 0)),
      continentPotential: clamp01(numberField(source, "continentPotential", 0)),
      continentSeparation: clamp01(numberField(source, "continentSeparation", 0)),

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

      massAnchor: clamp01(numberField(source, "massAnchor", 0)),
      shorelineContact: clamp01(numberField(source, "shorelineContact", 0)),
      shelfDrop: clamp01(numberField(source, "shelfDrop", 0)),
      underlandShadow: clamp01(numberField(source, "underlandShadow", 0)),
      reliefStrength: clamp01(numberField(source, "reliefStrength", 0)),
      slopePressure: clamp01(numberField(source, "slopePressure", 0)),
      materialDensity: clamp01(numberField(source, "materialDensity", 0)),
      surfaceAttachment: clamp01(numberField(source, "surfaceAttachment", 0))
    };
  };

  const readComposition = (...args) => {
    const p = parseInput(...args);
    const composition = getCompositionAuthority();

    if (args.length === 1 && args[0] && typeof args[0] === "object") {
      const candidate = args[0];

      if (
        typeof candidate.worldTerrainClass === "string" ||
        typeof candidate.terrainClass === "string" ||
        typeof candidate.expandedTerrainClass === "string"
      ) {
        return normalizeComposition(candidate, p);
      }
    }

    if (composition) {
      const fn =
        typeof composition.sample === "function"
          ? composition.sample
          : typeof composition.read === "function"
            ? composition.read
            : typeof composition.sampleComposition === "function"
              ? composition.sampleComposition
              : typeof composition.compose === "function"
                ? composition.compose
                : null;

      if (fn) {
        try {
          return normalizeComposition(fn.apply(composition, args), p);
        } catch (_error) {
          try {
            return normalizeComposition(fn.call(composition, p), p);
          } catch (_error2) {
            return fallbackComposition(p);
          }
        }
      }
    }

    return fallbackComposition(p);
  };

  const fallbackTectonics = (composition) => ({
    contract: "HEARTH_MATERIALS_FALLBACK_TECTONICS",
    receipt: "FALLBACK_TECTONICS_USED",
    tectonicClass: composition.isWater ? "open_ocean_basin" : "stable_continental_craton",
    plateClass: composition.isWater ? "oceanic_basin_plate" : "continental_plate",
    platePressure: composition.isLand ? 0.42 : 0.18,
    continentalBodyPressure: composition.isLand ? 0.58 : 0,
    continentalRootStrength: composition.isLand ? 0.54 : 0,
    continentalMassCoherence: composition.isLand ? 0.58 : 0,
    continentInteriorLift: composition.isLand ? 0.30 : 0,
    continentEdgeCompression: composition.coastPotential * 0.48,
    continentDivideStress: composition.continentSeparation * 0.48,
    mountainArcPressure: composition.mountainArcPotential * 0.60,
    ridgeUplift: composition.ridgePotential * 0.55,
    canyonCutPressure: composition.canyonPotential * 0.56,
    faultCutPressure: composition.scarPotential * 0.50,
    cliffPressure: composition.escarpmentPotential * 0.56,
    escarpmentPressure: composition.escarpmentPotential * 0.60,
    shelfDropPressure: Math.max(composition.shelfDrop, composition.shelfPotential) * 0.52,
    coastalCompression: composition.coastPotential * 0.46,
    basinSubsidence: composition.basinPotential * 0.52,
    archipelagoFracture: composition.archipelagoPotential * 0.60,
    islandArcPressure: composition.islandPotential * 0.54,
    waterfallDropPressure: composition.waterfallCandidate * 0.58,
    drainageCutPotential: Math.max(composition.canyonPotential, composition.basinPotential) * 0.46,
    materialBodyFeed: composition.massAnchor * 0.48,
    materialReliefFeed: composition.reliefStrength * 0.48,
    materialShadowFeed: composition.underlandShadow * 0.48,
    materialDensityFeed: composition.materialDensity * 0.48
  });

  const normalizeTectonics = (raw, composition) => {
    const source = raw && typeof raw === "object" ? raw : fallbackTectonics(composition);

    return {
      ...source,
      tectonicClass: stringField(source, "tectonicClass", composition.isWater ? "open_ocean_basin" : "stable_continental_craton"),
      plateClass: stringField(source, "plateClass", composition.isWater ? "oceanic_basin_plate" : "continental_plate"),
      platePressure: clamp01(numberField(source, "platePressure", 0)),
      continentalBodyPressure: clamp01(numberField(source, "continentalBodyPressure", 0)),
      continentalRootStrength: clamp01(numberField(source, "continentalRootStrength", 0)),
      continentalMassCoherence: clamp01(numberField(source, "continentalMassCoherence", 0)),
      continentInteriorLift: clamp01(numberField(source, "continentInteriorLift", 0)),
      continentEdgeCompression: clamp01(numberField(source, "continentEdgeCompression", 0)),
      continentDivideStress: clamp01(numberField(source, "continentDivideStress", 0)),
      mountainArcPressure: clamp01(numberField(source, "mountainArcPressure", 0)),
      ridgeUplift: clamp01(numberField(source, "ridgeUplift", 0)),
      ridgeContinuity: clamp01(numberField(source, "ridgeContinuity", 0)),
      alpinePressure: clamp01(numberField(source, "alpinePressure", 0)),
      canyonCutPressure: clamp01(numberField(source, "canyonCutPressure", 0)),
      faultCutPressure: clamp01(numberField(source, "faultCutPressure", 0)),
      faultLinePressure: clamp01(numberField(source, "faultLinePressure", 0)),
      fractureDensity: clamp01(numberField(source, "fractureDensity", 0)),
      scarPressure: clamp01(numberField(source, "scarPressure", 0)),
      cliffPressure: clamp01(numberField(source, "cliffPressure", 0)),
      escarpmentPressure: clamp01(numberField(source, "escarpmentPressure", 0)),
      shelfDropPressure: clamp01(numberField(source, "shelfDropPressure", 0)),
      coastalCompression: clamp01(numberField(source, "coastalCompression", 0)),
      basinCompression: clamp01(numberField(source, "basinCompression", 0)),
      basinSubsidence: clamp01(numberField(source, "basinSubsidence", 0)),
      lowlandStress: clamp01(numberField(source, "lowlandStress", 0)),
      archipelagoFracture: clamp01(numberField(source, "archipelagoFracture", 0)),
      islandArcPressure: clamp01(numberField(source, "islandArcPressure", 0)),
      brokenShelfStress: clamp01(numberField(source, "brokenShelfStress", 0)),
      waterfallDropPressure: clamp01(numberField(source, "waterfallDropPressure", 0)),
      drainageCutPotential: clamp01(numberField(source, "drainageCutPotential", 0)),
      materialBodyFeed: clamp01(numberField(source, "materialBodyFeed", 0)),
      materialReliefFeed: clamp01(numberField(source, "materialReliefFeed", 0)),
      materialShadowFeed: clamp01(numberField(source, "materialShadowFeed", 0)),
      materialDensityFeed: clamp01(numberField(source, "materialDensityFeed", 0))
    };
  };

  const readTectonics = (composition, p) => {
    const tectonics = getTectonicsAuthority();

    if (tectonics) {
      const fn =
        typeof tectonics.sample === "function"
          ? tectonics.sample
          : typeof tectonics.read === "function"
            ? tectonics.read
            : typeof tectonics.sampleTectonics === "function"
              ? tectonics.sampleTectonics
              : typeof tectonics.getTectonics === "function"
                ? tectonics.getTectonics
                : null;

      if (fn) {
        try {
          return normalizeTectonics(fn.call(tectonics, composition), composition);
        } catch (_error) {
          try {
            return normalizeTectonics(fn.call(tectonics, p), composition);
          } catch (_error2) {
            return fallbackTectonics(composition);
          }
        }
      }
    }

    return fallbackTectonics(composition);
  };

  const fallbackHydrology = (composition, tectonics) => ({
    contract: "HEARTH_MATERIALS_FALLBACK_HYDROLOGY",
    receipt: "FALLBACK_HYDROLOGY_USED",
    hydrologyClass: composition.isWater ? "open_ocean_basin" : "coastal_transition_zone",
    waterBoundaryClass: composition.isWater ? "open_ocean_basin" : "none",
    coastBoundaryClass: composition.coastPotential > 0.2 ? "coastal_transition_zone" : "none",
    shorelineType: "coastal_transition",
    shelfType: composition.shelfPotential > 0.2 ? "continental_shelf_gradient" : "none",
    basinType: composition.isWater ? "open_ocean_basin" : "none",
    drainageType: "none",
    waterPresence: composition.isWater ? 0.72 : composition.basinPotential * 0.20,
    surfaceWaterPotential: composition.isWater ? 0.58 : composition.coastPotential * 0.18,
    subsurfaceWaterPotential: composition.basinPotential * 0.32,
    oceanContinuity: composition.oceanBasinPotential * 0.52,
    oceanDepth: composition.waterDepthPotential * 0.62,
    shelfGradient: Math.max(composition.continentShelfPotential, composition.shelfPotential) * 0.58,
    shorelineSoftness: Math.max(composition.coastPotential, composition.shorelineContact) * 0.50,
    shorelineRoughness: Math.max(tectonics.cliffPressure, tectonics.archipelagoFracture) * 0.48,
    coastalBlendWidth: Math.max(composition.coastPotential, composition.shelfPotential) * 0.42,
    riverPotential: tectonics.drainageCutPotential * 0.44,
    drainagePotential: tectonics.drainageCutPotential * 0.52,
    deltaPotential: tectonics.basinSubsidence * 0.38,
    estuaryPotential: tectonics.drainageCutPotential * 0.32,
    wetlandPotential: tectonics.basinSubsidence * 0.42,
    marshPotential: tectonics.basinSubsidence * 0.34,
    floodplainPotential: tectonics.basinSubsidence * 0.38,
    waterfallFlowPotential: tectonics.waterfallDropPressure * 0.58,
    canyonOutflowPotential: tectonics.canyonCutPressure * 0.52,
    archipelagoChannelPotential: tectonics.archipelagoFracture * 0.58,
    islandWaterGap: tectonics.islandArcPressure * 0.46,
    straitPotential: tectonics.continentDivideStress * 0.52,
    bayPotential: composition.coastPotential * 0.28,
    inletPotential: tectonics.drainageCutPotential * 0.28,
    coastNaturalizationFeed: Math.max(composition.coastPotential, composition.shelfPotential) * 0.48,
    materialWaterFeed: composition.waterDepthPotential * 0.48,
    materialShelfFeed: Math.max(composition.continentShelfPotential, composition.shelfPotential) * 0.52,
    materialShoreFeed: composition.coastPotential * 0.52,
    materialWetlandFeed: tectonics.basinSubsidence * 0.34,
    materialRiverFeed: tectonics.drainageCutPotential * 0.42
  });

  const normalizeHydrology = (raw, composition, tectonics) => {
    const source = raw && typeof raw === "object" ? raw : fallbackHydrology(composition, tectonics);

    return {
      ...source,
      hydrologyClass: stringField(source, "hydrologyClass", composition.isWater ? "open_ocean_basin" : "coastal_transition_zone"),
      waterBoundaryClass: stringField(source, "waterBoundaryClass", "none"),
      coastBoundaryClass: stringField(source, "coastBoundaryClass", "none"),
      shorelineType: stringField(source, "shorelineType", "coastal_transition"),
      shelfType: stringField(source, "shelfType", "none"),
      basinType: stringField(source, "basinType", "none"),
      drainageType: stringField(source, "drainageType", "none"),
      waterPresence: clamp01(numberField(source, "waterPresence", 0)),
      surfaceWaterPotential: clamp01(numberField(source, "surfaceWaterPotential", 0)),
      subsurfaceWaterPotential: clamp01(numberField(source, "subsurfaceWaterPotential", 0)),
      oceanContinuity: clamp01(numberField(source, "oceanContinuity", 0)),
      oceanDepth: clamp01(numberField(source, "oceanDepth", 0)),
      shelfGradient: clamp01(numberField(source, "shelfGradient", 0)),
      shorelineSoftness: clamp01(numberField(source, "shorelineSoftness", 0)),
      shorelineRoughness: clamp01(numberField(source, "shorelineRoughness", 0)),
      coastalBlendWidth: clamp01(numberField(source, "coastalBlendWidth", 0)),
      riverPotential: clamp01(numberField(source, "riverPotential", 0)),
      drainagePotential: clamp01(numberField(source, "drainagePotential", 0)),
      deltaPotential: clamp01(numberField(source, "deltaPotential", 0)),
      estuaryPotential: clamp01(numberField(source, "estuaryPotential", 0)),
      wetlandPotential: clamp01(numberField(source, "wetlandPotential", 0)),
      marshPotential: clamp01(numberField(source, "marshPotential", 0)),
      floodplainPotential: clamp01(numberField(source, "floodplainPotential", 0)),
      waterfallFlowPotential: clamp01(numberField(source, "waterfallFlowPotential", 0)),
      canyonOutflowPotential: clamp01(numberField(source, "canyonOutflowPotential", 0)),
      fjordCutPotential: clamp01(numberField(source, "fjordCutPotential", 0)),
      stormSurgePotential: clamp01(numberField(source, "stormSurgePotential", 0)),
      reefShelfPotential: clamp01(numberField(source, "reefShelfPotential", 0)),
      archipelagoChannelPotential: clamp01(numberField(source, "archipelagoChannelPotential", 0)),
      islandWaterGap: clamp01(numberField(source, "islandWaterGap", 0)),
      straitPotential: clamp01(numberField(source, "straitPotential", 0)),
      bayPotential: clamp01(numberField(source, "bayPotential", 0)),
      inletPotential: clamp01(numberField(source, "inletPotential", 0)),
      peninsulaEdgePotential: clamp01(numberField(source, "peninsulaEdgePotential", 0)),
      coastNaturalizationFeed: clamp01(numberField(source, "coastNaturalizationFeed", 0)),
      materialWaterFeed: clamp01(numberField(source, "materialWaterFeed", 0)),
      materialShelfFeed: clamp01(numberField(source, "materialShelfFeed", 0)),
      materialShoreFeed: clamp01(numberField(source, "materialShoreFeed", 0)),
      materialWetlandFeed: clamp01(numberField(source, "materialWetlandFeed", 0)),
      materialRiverFeed: clamp01(numberField(source, "materialRiverFeed", 0))
    };
  };

  const readHydrology = (composition, tectonics, p) => {
    const hydrology = getHydrologyAuthority();

    if (hydrology) {
      const fn =
        typeof hydrology.sample === "function"
          ? hydrology.sample
          : typeof hydrology.read === "function"
            ? hydrology.read
            : typeof hydrology.sampleHydrology === "function"
              ? hydrology.sampleHydrology
              : typeof hydrology.getHydrology === "function"
                ? hydrology.getHydrology
                : null;

      if (fn) {
        try {
          return normalizeHydrology(fn.call(hydrology, composition), composition, tectonics);
        } catch (_error) {
          try {
            return normalizeHydrology(fn.call(hydrology, p), composition, tectonics);
          } catch (_error2) {
            return fallbackHydrology(composition, tectonics);
          }
        }
      }
    }

    return fallbackHydrology(composition, tectonics);
  };

  const terrainClassFor = (composition) => {
    return (
      composition.worldTerrainClass ||
      composition.expandedTerrainClass ||
      composition.semanticTerrainClass ||
      composition.terrainClass ||
      composition.compatibilityTerrainClass ||
      "ocean_basin"
    );
  };

  const compatibilityClassFor = (composition) => {
    return composition.compatibilityTerrainClass || composition.terrainClass || "deep_water";
  };

  const isWaterTerrain = (terrainClass, composition) => {
    if (WATER_CLASSES.has(terrainClass)) return true;
    if (LAND_CLASSES.has(terrainClass)) return false;
    return boolField(composition, "isWater", false);
  };

  const isLandTerrain = (terrainClass, composition) => {
    if (LAND_CLASSES.has(terrainClass)) return true;
    if (WATER_CLASSES.has(terrainClass)) return false;
    return boolField(composition, "isLand", false);
  };

  const paletteFor = (terrainClass) => {
    return (TERRAIN_PALETTE[terrainClass] || TERRAIN_PALETTE.ocean_basin).slice();
  };

  const continentIdFor = (composition) => composition.continentId || "open_ocean";
  const climateClassFor = (composition) => composition.climateClass || composition.climateHint || "open_ocean";

  const resolveBaseColor = (terrainClass, composition, isLand, isWater) => {
    let color = paletteFor(terrainClass);
    const continentId = continentIdFor(composition);
    const climateClass = climateClassFor(composition);

    if (isLand) {
      const continentBase = CONTINENT_BASE[continentId] || TERRAIN_PALETTE.continent_mass;
      const climateBase = TERRAIN_PALETTE[climateClass] || TERRAIN_PALETTE.temperate_highland;

      color = mixColor(color, continentBase, clamp01(numberField(composition, "continentPotential", 0.45) * 0.42));
      color = mixColor(color, climateBase, clamp01(numberField(composition, "climatePotential", 0.30) * 0.30));
    }

    if (isWater) {
      const depth = clamp01(numberField(composition, "waterDepthPotential", 0));
      const shelf = clamp01(Math.max(numberField(composition, "continentShelfPotential", 0), numberField(composition, "shelfPotential", 0)));

      if (terrainClass === "deep_ocean") {
        color = mixColor(color, [4, 13, 27], clamp01(depth * 0.48));
      } else if (terrainClass === "ocean_basin") {
        color = mixColor(color, [7, 24, 41], 0.62);
      } else if (terrainClass === "continental_shelf" || terrainClass === "coastal_shelf") {
        color = mixColor(color, [35, 68, 64], clamp01(0.34 + shelf * 0.20));
      } else if (terrainClass === "archipelago_shelf") {
        color = mixColor(color, [34, 75, 65], clamp01(0.32 + shelf * 0.20));
      } else if (terrainClass === "continent_divide") {
        color = mixColor(color, [8, 27, 38], 0.72);
      } else if (terrainClass === "shallow_water") {
        color = mixColor(color, [35, 75, 72], 0.44);
      }
    }

    return color;
  };

  const computeAgedTechFeeds = (composition, tectonics, hydrology, isLand, isWater) => {
    const coast = clamp01(Math.max(composition.coastPotential, composition.shorelineContact, hydrology.materialShoreFeed));
    const shelf = clamp01(Math.max(composition.continentShelfPotential, composition.shelfPotential, hydrology.shelfGradient, hydrology.materialShelfFeed));
    const divide = clamp01(Math.max(composition.continentSeparation, tectonics.continentDivideStress, hydrology.straitPotential));
    const arch = clamp01(Math.max(composition.archipelagoPotential, tectonics.archipelagoFracture, hydrology.archipelagoChannelPotential, hydrology.islandWaterGap));
    const drainage = clamp01(Math.max(tectonics.drainageCutPotential, hydrology.drainagePotential, hydrology.riverPotential, hydrology.estuaryPotential));
    const waterfall = clamp01(Math.max(composition.waterfallCandidate, tectonics.waterfallDropPressure, hydrology.waterfallFlowPotential));
    const canyon = clamp01(Math.max(composition.canyonPotential, tectonics.canyonCutPressure, hydrology.canyonOutflowPotential));
    const cliff = clamp01(Math.max(composition.escarpmentPotential, tectonics.cliffPressure, tectonics.escarpmentPressure));
    const wetland = clamp01(Math.max(hydrology.wetlandPotential, hydrology.marshPotential, hydrology.floodplainPotential, hydrology.materialWetlandFeed));
    const naturalization = clamp01(Math.max(hydrology.coastNaturalizationFeed, hydrology.coastalBlendWidth, hydrology.shorelineSoftness));
    const roughness = clamp01(Math.max(hydrology.shorelineRoughness, tectonics.fractureDensity, tectonics.scarPressure));

    const boundaryBase = clamp01(
      coast * 0.28 +
      shelf * 0.18 +
      divide * 0.14 +
      arch * 0.14 +
      drainage * 0.10 +
      cliff * 0.08 +
      naturalization * 0.08
    );

    const agedCoastalTechFeed = clamp01(
      boundaryBase * 0.68 +
      roughness * 0.12 +
      tectonics.materialShadowFeed * 0.08 +
      hydrology.materialShoreFeed * 0.12
    );

    const carvedCoastFeed = clamp01(
      coast * 0.26 +
      cliff * 0.18 +
      canyon * 0.16 +
      divide * 0.14 +
      hydrology.inletPotential * 0.10 +
      hydrology.bayPotential * 0.08 +
      roughness * 0.08
    );

    const weatheredInfrastructureFeed = clamp01(
      agedCoastalTechFeed * 0.30 +
      naturalization * 0.22 +
      roughness * 0.14 +
      wetland * 0.10 +
      tectonics.materialShadowFeed * 0.12 +
      tectonics.materialDensityFeed * 0.12
    );

    const ancientChannelFeed = clamp01(
      divide * 0.18 +
      arch * 0.18 +
      drainage * 0.20 +
      canyon * 0.14 +
      hydrology.straitPotential * 0.14 +
      hydrology.inletPotential * 0.10 +
      hydrology.archipelagoChannelPotential * 0.12
    );

    const erodedHarborFeed = clamp01(
      hydrology.bayPotential * 0.24 +
      hydrology.inletPotential * 0.20 +
      hydrology.estuaryPotential * 0.14 +
      coast * 0.14 +
      shelf * 0.12 +
      naturalization * 0.10 +
      wetland * 0.06
    );

    const mineralizedCutFeed = clamp01(
      cliff * 0.18 +
      canyon * 0.16 +
      shelf * 0.14 +
      coast * 0.14 +
      tectonics.shelfDropPressure * 0.12 +
      tectonics.continentEdgeCompression * 0.10 +
      roughness * 0.10
    );

    const reclaimedStructureFeed = clamp01(
      weatheredInfrastructureFeed * 0.28 +
      wetland * 0.18 +
      naturalization * 0.20 +
      hydrology.materialWetlandFeed * 0.14 +
      hydrology.materialRiverFeed * 0.10 +
      isLand * composition.landPotential * 0.08
    );

    const oldDrainageGateFeed = clamp01(
      drainage * 0.24 +
      hydrology.riverPotential * 0.18 +
      hydrology.estuaryPotential * 0.16 +
      hydrology.deltaPotential * 0.14 +
      waterfall * 0.12 +
      canyon * 0.08 +
      coast * 0.08
    );

    const submergedWorksFeed = clamp01(
      isWater * (
        shelf * 0.28 +
        arch * 0.18 +
        divide * 0.14 +
        hydrology.materialWaterFeed * 0.14 +
        hydrology.oceanDepth * 0.10 +
        weatheredInfrastructureFeed * 0.16
      )
    );

    const artificialNaturalBlend = clamp01(
      agedCoastalTechFeed * 0.34 +
      naturalization * 0.24 +
      reclaimedStructureFeed * 0.16 +
      mineralizedCutFeed * 0.12 +
      submergedWorksFeed * 0.08 +
      oldDrainageGateFeed * 0.06
    );

    return {
      agedCoastalTechFeed,
      carvedCoastFeed,
      weatheredInfrastructureFeed,
      ancientChannelFeed,
      erodedHarborFeed,
      mineralizedCutFeed,
      reclaimedStructureFeed,
      oldDrainageGateFeed,
      submergedWorksFeed,
      artificialNaturalBlend
    };
  };

  const applyOceanMaterial = (rgb, composition, tectonics, hydrology, feeds, noise) => {
    const terrainClass = terrainClassFor(composition);
    const depth = clamp01(Math.max(composition.waterDepthPotential, composition.oceanBasinPotential, hydrology.oceanDepth));
    const shelf = clamp01(Math.max(composition.continentShelfPotential, composition.shelfPotential, hydrology.shelfGradient));
    const tech = feeds.submergedWorksFeed;
    let c = rgb.slice();

    c = scaleColor(c, 1.04 + noise * 0.04);

    if (terrainClass === "deep_ocean") {
      c = mixColor(c, [4, 12, 25], clamp01(depth * 0.48));
    }

    if (terrainClass === "ocean_basin") {
      c = mixColor(c, [7, 24, 40], 0.52);
      c = addColor(c, [2, 5, 7], noise * 0.24);
    }

    if (terrainClass === "continent_divide") {
      c = mixColor(c, [8, 26, 34], clamp01(0.54 + feeds.ancientChannelFeed * 0.18));
      c = addColor(c, [6, 5, 1], feeds.mineralizedCutFeed * 0.10);
    }

    if (terrainClass === "continental_shelf" || terrainClass === "coastal_shelf") {
      c = mixColor(c, [34, 65, 62], clamp01(0.30 + shelf * 0.22));
      c = mixColor(c, [49, 62, 48], clamp01(feeds.weatheredInfrastructureFeed * 0.12));
      c = addColor(c, [8, 5, -3], feeds.mineralizedCutFeed * 0.12);
    }

    if (terrainClass === "archipelago_shelf" || hydrology.waterBoundaryClass === "archipelago_channel") {
      c = mixColor(c, [35, 72, 64], clamp01(0.28 + shelf * 0.18 + hydrology.archipelagoChannelPotential * 0.16));
      c = mixColor(c, [59, 71, 52], clamp01(feeds.submergedWorksFeed * 0.10));
    }

    if (terrainClass === "shallow_water") {
      c = mixColor(c, [34, 70, 68], clamp01(0.26 + shelf * 0.18));
      c = addColor(c, [4, 3, -2], feeds.weatheredInfrastructureFeed * 0.08);
    }

    c = mixColor(c, [3, 10, 21], clamp01(depth * 0.14));
    c = mixColor(c, [34, 52, 48], clamp01(tech * 0.08));
    c = addColor(c, [7, 5, -4], clamp01(feeds.ancientChannelFeed * 0.08));

    return c;
  };

  const applyLandMaterial = (rgb, composition, tectonics, hydrology, feeds, noise) => {
    const terrainClass = terrainClassFor(composition);
    const continentId = continentIdFor(composition);
    const climateClass = climateClassFor(composition);
    const climateBias = CLIMATE_BIAS[climateClass] || CLIMATE_BIAS.open_ocean;

    const mass = clamp01(Math.max(composition.massAnchor, tectonics.materialBodyFeed));
    const density = clamp01(Math.max(composition.materialDensity, tectonics.materialDensityFeed));
    const relief = clamp01(Math.max(composition.reliefStrength, tectonics.materialReliefFeed));
    const shore = clamp01(Math.max(composition.coastPotential, hydrology.materialShoreFeed));
    const wetland = clamp01(hydrology.materialWetlandFeed);
    const river = clamp01(hydrology.materialRiverFeed);

    let c = rgb.slice();

    c = mixColor(c, CONTINENT_BASE[continentId] || TERRAIN_PALETTE.continent_mass, clamp01(composition.continentPotential * 0.36));
    c = addColor(c, climateBias, clamp01(0.14 + numberField(composition, "climatePotential", 0.20) * 0.20));
    c = addColor(c, [
      Math.round((noise - 0.50) * 16),
      Math.round((noise - 0.50) * 15),
      Math.round((noise - 0.50) * 11)
    ], 0.72);

    if (terrainClass === "continent_mass" || terrainClass === "raised_land") {
      c = addColor(c, [9, 8, 2], clamp01(mass * 0.28 + density * 0.18));
    }

    if (terrainClass === "coast_edge" || shore > 0.34) {
      c = mixColor(c, [78, 82, 58], clamp01(0.20 + shore * 0.24));
      c = mixColor(c, [62, 69, 55], clamp01(feeds.reclaimedStructureFeed * 0.14));
      c = addColor(c, [12, 8, -4], clamp01(feeds.mineralizedCutFeed * 0.14));
    }

    if (terrainClass === "plateau_interior" || climateClass === "arid_dry_plateau") {
      c = mixColor(c, [132, 106, 66], clamp01(0.22 + composition.plateauPotential * 0.28));
    }

    if (terrainClass === "basin_floor" || climateClass === "rainforest_wet_basin" || climateClass === "monsoon_floodplain") {
      c = mixColor(c, [56, 91, 52], clamp01(0.20 + composition.basinPotential * 0.30 + wetland * 0.16));
      c = mixColor(c, [48, 75, 49], clamp01(wetland * 0.14));
    }

    if (terrainClass === "mountain_arc" || terrainClass === "alpine_ridge" || climateClass === "alpine_mountain_arc") {
      c = mixColor(c, [112, 111, 99], clamp01(0.20 + tectonics.ridgeUplift * 0.28 + relief * 0.16));
      c = mixColor(c, [60, 60, 56], clamp01(tectonics.materialShadowFeed * 0.08));
    }

    if (terrainClass === "canyon_corridor") {
      c = mixColor(c, [78, 53, 41], clamp01(0.32 + tectonics.canyonCutPressure * 0.24));
      c = mixColor(c, [47, 36, 31], clamp01(tectonics.materialShadowFeed * 0.12));
    }

    if (terrainClass === "cliff_escarpment") {
      c = mixColor(c, [64, 61, 55], clamp01(0.32 + tectonics.cliffPressure * 0.26));
      c = mixColor(c, [47, 46, 42], clamp01(feeds.carvedCoastFeed * 0.12));
    }

    if (terrainClass === "waterfall_escarpment" || hydrology.coastBoundaryClass === "waterfall_drainage_edge") {
      c = mixColor(c, [92, 108, 96], clamp01(0.28 + hydrology.waterfallFlowPotential * 0.24));
      c = addColor(c, [7, 9, 6], clamp01(feeds.oldDrainageGateFeed * 0.16));
    }

    if (terrainClass === "island_arc" || climateClass === "maritime_archipelago") {
      c = mixColor(c, [70, 111, 78], clamp01(0.18 + composition.archipelagoPotential * 0.24 + hydrology.archipelagoChannelPotential * 0.16));
      c = addColor(c, [7, 6, -4], clamp01(feeds.weatheredInfrastructureFeed * 0.10));
    }

    if (terrainClass === "polar_icefield") {
      c = mixColor(c, [148, 165, 165], 0.58);
    }

    if (terrainClass === "tundra_subpolar") {
      c = mixColor(c, [100, 116, 96], 0.44);
    }

    if (terrainClass === "temperate_coastal_storm" || hydrology.coastBoundaryClass === "storm_coast_boundary") {
      c = mixColor(c, [52, 76, 72], 0.42);
      c = mixColor(c, [48, 54, 47], clamp01(feeds.weatheredInfrastructureFeed * 0.15));
    }

    if (river > 0.18) {
      c = mixColor(c, [48, 83, 66], clamp01(river * 0.12));
    }

    if (feeds.agedCoastalTechFeed > 0.18) {
      c = mixColor(c, [73, 75, 58], clamp01(feeds.agedCoastalTechFeed * 0.12));
      c = addColor(c, [12, 8, -5], clamp01(feeds.mineralizedCutFeed * 0.10));
      c = mixColor(c, [56, 63, 55], clamp01(feeds.weatheredInfrastructureFeed * 0.08));
    }

    if (composition.summitClass && composition.summitClass !== "none" && composition.summitPotential > 0.52) {
      c = mixColor(c, [126, 119, 88], clamp01((composition.summitPotential - 0.48) * 0.22));
    }

    const bodyLift = clamp(
      1.04 +
        mass * 0.10 +
        density * 0.07 +
        relief * 0.03 -
        shore * 0.02,
      0.94,
      1.20
    );

    return scaleColor(c, bodyLift);
  };

  const outputFieldsFor = (composition, tectonics, hydrology, feeds, terrainClass, isLand, isWater) => {
    const mass = clamp01(Math.max(composition.massAnchor, tectonics.materialBodyFeed));
    const density = clamp01(Math.max(composition.materialDensity, tectonics.materialDensityFeed));
    const relief = clamp01(Math.max(composition.reliefStrength, tectonics.materialReliefFeed));
    const ridge = clamp01(Math.max(composition.ridgePotential, composition.mountainArcPotential, tectonics.ridgeUplift));
    const basin = clamp01(Math.max(composition.basinPotential, tectonics.basinSubsidence, hydrology.wetlandPotential));
    const coast = clamp01(Math.max(composition.coastPotential, composition.shorelineContact, hydrology.materialShoreFeed));
    const shelf = clamp01(Math.max(composition.continentShelfPotential, composition.shelfPotential, hydrology.shelfGradient, hydrology.materialShelfFeed));
    const depth = clamp01(Math.max(composition.waterDepthPotential, composition.oceanBasinPotential, hydrology.oceanDepth));
    const shadow = clamp01(Math.max(composition.underlandShadow, tectonics.materialShadowFeed));
    const tech = feeds.agedCoastalTechFeed;

    const terrainRelief = clamp01(
      relief * 0.42 +
      ridge * 0.18 +
      tectonics.canyonCutPressure * 0.14 +
      tectonics.cliffPressure * 0.12 +
      tectonics.waterfallDropPressure * 0.08 +
      tech * 0.06
    );

    const ridgeRelief = clamp01(
      ridge * 0.42 +
      relief * 0.16 +
      tectonics.ridgeUplift * 0.18 +
      composition.summitPotential * 0.08
    );

    const basinShade = clamp01(
      basin * 0.34 +
      depth * 0.18 +
      hydrology.materialWetlandFeed * 0.16 +
      (terrainClass === "basin_floor" ? 0.22 : 0)
    );

    const shorelineGrounding = clamp01(
      coast * 0.30 +
      shelf * 0.18 +
      hydrology.coastNaturalizationFeed * 0.22 +
      feeds.carvedCoastFeed * 0.12 +
      feeds.reclaimedStructureFeed * 0.10
    );

    const shelfTransition = clamp01(
      shelf * 0.34 +
      hydrology.coastalBlendWidth * 0.18 +
      hydrology.shorelineSoftness * 0.12 +
      feeds.submergedWorksFeed * 0.10 +
      feeds.ancientChannelFeed * 0.08
    );

    const contactShadow = clamp01(
      shadow * 0.28 +
      tectonics.cliffPressure * 0.14 +
      tectonics.canyonCutPressure * 0.12 +
      shorelineGrounding * 0.12 +
      feeds.weatheredInfrastructureFeed * 0.12 +
      feeds.mineralizedCutFeed * 0.10
    );

    const landDensity = isLand
      ? clamp01(0.52 + mass * 0.18 + density * 0.14 + terrainRelief * 0.08 + tech * 0.04)
      : 0;

    const waterDepthShade = isWater
      ? clamp01(depth * 0.56 + basinShade * 0.18 + hydrology.materialWaterFeed * 0.10)
      : 0;

    return {
      alpha: 1,
      isLand,
      isWater,

      landDensity,
      shorelineGrounding,
      contactShadow,
      underlandOcclusion: clamp01(shadow * 0.36 + shorelineGrounding * 0.24 + shelf * 0.10 + feeds.reclaimedStructureFeed * 0.08),
      shelfTransition,
      terrainRelief,
      ridgeRelief,
      basinShade,
      rimDarkening: clamp01(composition.rimCompression * 0.28 + terrainRelief * 0.10 + depth * 0.08),
      rimCompression: clamp01(composition.rimCompression * 0.50 + mass * 0.12 + relief * 0.08),
      atmosphereSeparation: isLand
        ? clamp01(0.44 + mass * 0.18 + terrainRelief * 0.08)
        : clamp01(0.12 + depth * 0.10),
      surfaceAttachment: clamp01(composition.surfaceAttachment * 0.62 + mass * 0.16 + shorelineGrounding * 0.08),
      curvatureLock: clamp01(numberField(composition, "curvatureLock", 0.72)),
      waterDepthShade,
      bridgePotential: clamp01(numberField(composition, "bridgePotential", 0) * 0.32 + composition.scarPotential * 0.16 + feeds.ancientChannelFeed * 0.10)
    };
  };

  const sample = (...args) => {
    const p = parseInput(...args);
    const composition = readComposition(...args);
    const tectonics = readTectonics(composition, p);
    const hydrology = readHydrology(composition, tectonics, p);

    const worldTerrainClass = terrainClassFor(composition);
    const terrainClass = worldTerrainClass;
    const compatibilityTerrainClass = compatibilityClassFor(composition);
    const materialClass = MATERIAL_CLASS_MAP[terrainClass] || MATERIAL_CLASS_MAP[compatibilityTerrainClass] || MATERIAL_CLASS_MAP.ocean_basin;

    const isWater = isWaterTerrain(terrainClass, composition);
    const isLand = !isWater && isLandTerrain(terrainClass, composition);

    const noiseA = textureNoise(p, terrainClass.length + (numberField(composition, "continentIndex", 0) + 17));
    const noiseB = textureNoise({ x: p.y, y: p.z, z: p.x }, 61);
    const materialNoise = clamp01(noiseA * 0.60 + noiseB * 0.40);

    const feeds = computeAgedTechFeeds(composition, tectonics, hydrology, isLand ? 1 : 0, isWater ? 1 : 0);

    let rgb = resolveBaseColor(terrainClass, composition, isLand, isWater);

    if (isWater) {
      rgb = applyOceanMaterial(rgb, composition, tectonics, hydrology, feeds, materialNoise);
    } else {
      rgb = applyLandMaterial(rgb, composition, tectonics, hydrology, feeds, materialNoise);
    }

    const fields = outputFieldsFor(composition, tectonics, hydrology, feeds, terrainClass, isLand, isWater);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      authority: "materials",
      sourceAuthority: "hearth.composition.js + hearth.tectonics.js + hearth.hydrology.js",

      rgb,
      color: rgb,
      baseColor: rgb,
      finalColorHint: rgb,
      alpha: fields.alpha,

      isLand,
      isWater,

      terrainClass,
      worldTerrainClass,
      expandedTerrainClass: composition.expandedTerrainClass || worldTerrainClass,
      semanticTerrainClass: composition.semanticTerrainClass || worldTerrainClass,
      compatibilityTerrainClass,

      materialClass,
      surfaceFamily: isWater ? "water" : "land",
      visualPriority: isWater ? 0.58 : 0.78,

      continentId: composition.continentId,
      continentName: composition.continentName || "Open Ocean",
      continentIndex: Number.isFinite(Number(composition.continentIndex)) ? Number(composition.continentIndex) : -1,
      continentClass: composition.continentClass || "open_ocean",

      climateHint: composition.climateHint || "open_ocean",
      climateClass: composition.climateClass || "open_ocean",

      summitRegionHint: composition.summitRegionHint || "none",
      summitRegionLabel: composition.summitRegionLabel || "None",
      summitTerrainHint: composition.summitTerrainHint || "none",
      summitClass: composition.summitClass || "none",

      tectonicClass: tectonics.tectonicClass,
      plateClass: tectonics.plateClass,

      hydrologyClass: hydrology.hydrologyClass,
      waterBoundaryClass: hydrology.waterBoundaryClass,
      coastBoundaryClass: hydrology.coastBoundaryClass,
      shorelineType: hydrology.shorelineType,
      shelfType: hydrology.shelfType,
      basinType: hydrology.basinType,
      drainageType: hydrology.drainageType,

      elevation: numberField(composition, "elevation", 0),
      landPotential: clamp01(numberField(composition, "landPotential", 0)),
      coastPotential: clamp01(numberField(composition, "coastPotential", 0)),
      waterDepthPotential: clamp01(numberField(composition, "waterDepthPotential", 0)),
      oceanBasinPotential: clamp01(numberField(composition, "oceanBasinPotential", 0)),
      continentShelfPotential: clamp01(numberField(composition, "continentShelfPotential", 0)),
      shelfPotential: clamp01(numberField(composition, "shelfPotential", 0)),

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

      continentPotential: clamp01(numberField(composition, "continentPotential", 0)),
      continentSeparation: clamp01(numberField(composition, "continentSeparation", 0)),
      mountainArcPotential: clamp01(numberField(composition, "mountainArcPotential", 0)),
      plateauPotential: clamp01(numberField(composition, "plateauPotential", 0)),
      canyonPotential: clamp01(numberField(composition, "canyonPotential", 0)),
      escarpmentPotential: clamp01(numberField(composition, "escarpmentPotential", 0)),
      waterfallCandidate: clamp01(numberField(composition, "waterfallCandidate", 0)),
      archipelagoPotential: clamp01(numberField(composition, "archipelagoPotential", 0)),
      basinPotential: clamp01(numberField(composition, "basinPotential", 0)),
      summitPotential: clamp01(numberField(composition, "summitPotential", 0)),

      agedCoastalTechFeed: feeds.agedCoastalTechFeed,
      carvedCoastFeed: feeds.carvedCoastFeed,
      weatheredInfrastructureFeed: feeds.weatheredInfrastructureFeed,
      ancientChannelFeed: feeds.ancientChannelFeed,
      erodedHarborFeed: feeds.erodedHarborFeed,
      mineralizedCutFeed: feeds.mineralizedCutFeed,
      reclaimedStructureFeed: feeds.reclaimedStructureFeed,
      oldDrainageGateFeed: feeds.oldDrainageGateFeed,
      submergedWorksFeed: feeds.submergedWorksFeed,
      artificialNaturalBlend: feeds.artificialNaturalBlend,

      materialNoise,

      compositionContract: composition.contract || "UNKNOWN_COMPOSITION_CONTRACT",
      tectonicsContract: tectonics.contract || "UNKNOWN_TECTONICS_CONTRACT",
      hydrologyContract: hydrology.contract || "UNKNOWN_HYDROLOGY_CONTRACT",

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  };

  const read = (...args) => sample(...args);
  const getMaterial = (...args) => sample(...args);
  const materialAt = (...args) => sample(...args);
  const getMaterialAt = (...args) => sample(...args);
  const getSurfaceMaterial = (...args) => sample(...args);
  const resolve = (...args) => sample(...args);
  const resolveMaterial = (...args) => sample(...args);

  const createTextureCanvas = (options = {}) => {
    const requestedWidth = Number.isFinite(Number(options.width)) ? Math.round(Number(options.width)) : 768;
    const requestedHeight = Number.isFinite(Number(options.height)) ? Math.round(Number(options.height)) : 384;

    const width = clamp(requestedWidth, 32, options.allowLargeTexture === true ? 1536 : 1024);
    const height = clamp(requestedHeight, 16, options.allowLargeTexture === true ? 768 : 512);

    if (!root.document || typeof root.document.createElement !== "function") {
      throw new Error("Hearth materials texture canvas requires document.createElement.");
    }

    const canvas = root.document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.dataset.hearthMaterialsTexture = "true";
    canvas.dataset.hearthMaterialsContract = CONTRACT;
    canvas.dataset.hearthMaterialsReceipt = RECEIPT;
    canvas.dataset.hearthMaterialsAgedCoastalTech = "true";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.webgl = "false";
    canvas.dataset.visualPassClaimed = "false";

    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });
    const image = ctx.createImageData(width, height);
    const data = image.data;

    for (let y = 0; y < height; y += 1) {
      const v = height <= 1 ? 0 : y / (height - 1);

      for (let x = 0; x < width; x += 1) {
        const u = width <= 1 ? 0 : x / (width - 1);
        const material = sample({ u, v });
        const index = (y * width + x) * 4;

        data[index] = material.rgb[0];
        data[index + 1] = material.rgb[1];
        data[index + 2] = material.rgb[2];
        data[index + 3] = Math.round(clamp01(material.alpha) * 255);
      }
    }

    ctx.putImageData(image, 0, 0);

    return canvas;
  };

  const getReceipt = () => ({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    authority: "materials",
    status: "active",
    sourceAuthority: "hearth.composition.js + hearth.tectonics.js + hearth.hydrology.js",
    purpose: "aged-tech-coastal-boundary-material-expression",
    supportsExpandedHearthTerrain: true,
    supportsSevenContinentNineClimateTerrain: true,
    supportsSevenClimateTerrainClasses: true,
    supportsSevenContinentRealPlanetMaterials: true,
    supportsAgedTechCoastalBoundaryMaterials: true,
    supportsHydrologyBoundaryConsumer: true,
    consumesComposition: true,
    consumesTectonics: true,
    consumesHydrology: true,
    prefersWorldTerrainClass: true,
    terrainClasses: EXPANDED_TERRAIN_CLASSES.slice(),
    materialClassMap: { ...MATERIAL_CLASS_MAP },
    outputFields: [
      "rgb",
      "alpha",
      "isLand",
      "isWater",
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
      "agedCoastalTechFeed",
      "carvedCoastFeed",
      "weatheredInfrastructureFeed",
      "ancientChannelFeed",
      "erodedHarborFeed",
      "mineralizedCutFeed",
      "reclaimedStructureFeed",
      "oldDrainageGateFeed",
      "submergedWorksFeed",
      "artificialNaturalBlend"
    ],
    designRules: [
      "coastal lines remain as evidence",
      "coastal traces become aged carved boundaries",
      "ancient technology is weathered not glowing",
      "coasts remain natural enough to belong to the planet",
      "no teleport or route ownership",
      "canvas held",
      "route held",
      "no final visual pass claim"
    ],
    forbiddenOwnership: [
      "elevation-generation",
      "composition-classification",
      "tectonic-pressure-generation",
      "hydrology-behavior-generation",
      "canvas-drawing",
      "runtime-motion",
      "controls",
      "route-orchestration",
      "teleports",
      "clickable-coastal-objects",
      "final-visual-pass-claim"
    ],
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  });

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
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

    terrainClasses: EXPANDED_TERRAIN_CLASSES.slice(),
    materialClassMap: { ...MATERIAL_CLASS_MAP },

    supportsExpandedHearthTerrain: true,
    supportsSevenContinentNineClimateTerrain: true,
    supportsSevenClimateTerrainClasses: true,
    supportsSevenContinentRealPlanetMaterials: true,
    supportsAgedTechCoastalBoundaryMaterials: true,
    supportsHydrologyBoundaryConsumer: true,
    consumesComposition: true,
    consumesTectonics: true,
    consumesHydrology: true,
    prefersWorldTerrainClass: true,

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
  root.HEARTH_MATERIALS_SUPPORTS_SEVEN_CLIMATE_TERRAIN_CLASSES = true;
  root.HEARTH_MATERIALS_SUPPORTS_SEVEN_CONTINENT_NINE_CLIMATE_TERRAIN = true;
  root.HEARTH_MATERIALS_SUPPORTS_SEVEN_CONTINENT_REAL_PLANET = true;
  root.HEARTH_MATERIALS_SUPPORTS_AGED_TECH_COASTAL_BOUNDARY = true;
  root.HEARTH_MATERIALS_SUPPORTS_HYDROLOGY_BOUNDARY_CONSUMER = true;

  if (root.document && root.document.documentElement) {
    root.document.documentElement.dataset.hearthMaterialsAuthorityLoaded = "true";
    root.document.documentElement.dataset.hearthMaterialsContract = CONTRACT;
    root.document.documentElement.dataset.hearthMaterialsReceipt = RECEIPT;
    root.document.documentElement.dataset.hearthMaterialsPreviousContract = PREVIOUS_CONTRACT;
    root.document.documentElement.dataset.hearthMaterialsSupportsExpandedTerrain = "true";
    root.document.documentElement.dataset.hearthMaterialsSupportsSevenContinentNineClimate = "true";
    root.document.documentElement.dataset.hearthMaterialsSupportsSevenClimateTerrainClasses = "true";
    root.document.documentElement.dataset.hearthMaterialsSupportsSevenContinentRealPlanet = "true";
    root.document.documentElement.dataset.hearthMaterialsSupportsAgedTechCoastalBoundary = "true";
    root.document.documentElement.dataset.hearthMaterialsSupportsHydrologyBoundaryConsumer = "true";
    root.document.documentElement.dataset.hearthMaterialsConsumesComposition = "true";
    root.document.documentElement.dataset.hearthMaterialsConsumesTectonics = "true";
    root.document.documentElement.dataset.hearthMaterialsConsumesHydrology = "true";
    root.document.documentElement.dataset.generatedImage = "false";
    root.document.documentElement.dataset.graphicBox = "false";
    root.document.documentElement.dataset.webgl = "false";
    root.document.documentElement.dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

// /assets/hearth/hearth.materials.js
// HEARTH_SEVEN_CONTINENT_REAL_PLANET_MATERIALS_TNT_v1
// Full-file replacement.
// Materials authority only.
// Purpose:
// - Consume HEARTH_SEVEN_CONTINENT_REAL_PLANET_COMPOSITION_TNT_v1.
// - Render real-planet classes as natural visible planetary material.
// - Lift land interiors into readable bodies.
// - Mutate cyan/dotted shelf behavior into muted shelf gradients.
// - Preserve canvas v7 compatibility and performance.
// Does not own:
// - elevation generation
// - composition classification
// - canvas drawing
// - runtime motion
// - controls
// - route orchestration
// - teleports
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_SEVEN_CONTINENT_REAL_PLANET_MATERIALS_TNT_v1";
  const RECEIPT = "HEARTH_SEVEN_CONTINENT_REAL_PLANET_MATERIALS_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_SEVEN_CONTINENT_NINE_CLIMATE_MATERIALS_VISUAL_EXPRESSION_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_NINE_SUMMITS_256_GLOBAL_MAP_MATERIALS_TNT_v7";
  const VERSION = "2026-05-28.hearth-seven-continent-real-planet-materials-v1";

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
    continental_shelf: "water.shelf.muted.gradient",
    archipelago_shelf: "water.shelf.archipelago.softened",
    continent_divide: "water.divide.channel.not-neon",
    shallow_water: "water.shallow.coastal.transition",
    coast_edge: "land.coast.grounded.transition",
    continent_mass: "land.continent.embodied.mass",
    plateau_interior: "land.plateau.dense.interior",
    basin_floor: "land.basin.lowland.floor",
    mountain_arc: "land.mountain.arc.relief",
    alpine_ridge: "land.alpine.ridge.coldstone",
    canyon_corridor: "land.canyon.corridor.cut",
    cliff_escarpment: "land.cliff.escarpment.shadow",
    waterfall_escarpment: "land.waterfall.escarpment.wet",
    island_arc: "land.island.arc.body",
    polar_icefield: "climate.polar.icefield",
    tundra_subpolar: "climate.tundra.subpolar",
    temperate_highland: "climate.temperate.highland",
    temperate_coastal_storm: "climate.temperate.coastal.storm",
    rainforest_wet_basin: "climate.rainforest.wet.basin",
    monsoon_floodplain: "climate.monsoon.floodplain",
    arid_dry_plateau: "climate.arid.dry.plateau",
    maritime_archipelago: "climate.maritime.archipelago",
    summit_region: "terrain.summit.region.overlay",
    raised_land: "land.raised.general",

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
    deep_ocean: [5, 17, 31],
    ocean_basin: [7, 22, 39],
    continental_shelf: [27, 65, 70],
    archipelago_shelf: [31, 76, 72],
    continent_divide: [8, 28, 39],
    shallow_water: [30, 72, 76],

    coast_edge: [88, 91, 62],
    continent_mass: [112, 107, 67],
    raised_land: [103, 104, 65],
    plateau_interior: [128, 108, 67],
    basin_floor: [72, 96, 56],
    mountain_arc: [102, 98, 84],
    alpine_ridge: [136, 143, 126],
    canyon_corridor: [87, 57, 43],
    cliff_escarpment: [70, 66, 58],
    waterfall_escarpment: [105, 119, 105],
    island_arc: [74, 117, 77],

    polar_icefield: [153, 169, 169],
    tundra_subpolar: [103, 118, 96],
    temperate_highland: [81, 117, 66],
    temperate_coastal_storm: [56, 84, 78],
    rainforest_wet_basin: [38, 96, 50],
    monsoon_floodplain: [68, 106, 58],
    arid_dry_plateau: [138, 109, 65],
    maritime_archipelago: [56, 111, 86],
    summit_region: [133, 125, 90],

    continental_core: [111, 105, 65],
    raised_shield: [103, 103, 64],
    coastal_shelf: [26, 67, 74],
    exposed_bridge: [111, 101, 64],
    submerged_bridge: [22, 58, 69],
    ridge_corridor: [96, 90, 70],
    shallow_saddle: [27, 66, 75],
    cliff_candidate: [70, 66, 58],
    valley_candidate: [64, 86, 54],
    mountain_candidate: [102, 98, 82],
    island_seed: [78, 111, 72],
    deep_water: [5, 16, 31]
  });

  const CONTINENT_BASE = Object.freeze({
    western_shield: [121, 114, 72],
    eastern_basin: [96, 113, 66],
    northern_cold: [112, 125, 114],
    southern_harsh: [139, 110, 67],
    equatorial_wet: [57, 115, 58],
    mountain_arc: [114, 111, 94],
    broken_archipelago: [76, 121, 82],
    open_ocean: [7, 22, 39]
  });

  const CONTINENT_BIAS = Object.freeze({
    western_shield: [12, 7, -4],
    eastern_basin: [-5, 11, -7],
    northern_cold: [7, 15, 14],
    southern_harsh: [22, 8, -14],
    equatorial_wet: [-22, 26, -14],
    mountain_arc: [12, 11, 10],
    broken_archipelago: [-14, 24, 7],
    open_ocean: [-5, 0, 7]
  });

  const CLIMATE_BIAS = Object.freeze({
    polar_icefield: [32, 42, 42],
    tundra_subpolar: [12, 19, 11],
    temperate_highland: [-8, 20, -8],
    temperate_coastal_storm: [-18, 5, 10],
    rainforest_wet_basin: [-30, 36, -18],
    monsoon_floodplain: [-15, 24, -8],
    arid_dry_plateau: [28, 11, -18],
    alpine_mountain_arc: [18, 18, 17],
    maritime_archipelago: [-12, 22, 10],
    open_ocean: [-4, 0, 7]
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
    "raised_land",
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
  const mixNumber = (a, b, t) => a + (b - a) * clamp01(t);

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
    const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + salt * 37.31) * 43758.5453123;
    return n - Math.floor(n);
  };

  const textureNoise = (p, salt = 0) => {
    const n1 = hashNoise(p.x, p.y, p.z, salt);
    const n2 = hashNoise(p.y + n1, p.z - n1, p.x + n1, salt + 11);
    const n3 = hashNoise(p.z - n2, p.x + n2, p.y - n2, salt + 29);
    return clamp01(n1 * 0.48 + n2 * 0.34 + n3 * 0.18);
  };

  const getCompositionAuthority = () => {
    if (root.HEARTH && root.HEARTH.composition) return root.HEARTH.composition;
    if (root.HEARTH_COMPOSITION) return root.HEARTH_COMPOSITION;
    if (root.HearthComposition) return root.HearthComposition;
    return null;
  };

  const fallbackComposition = (p) => {
    const wet = textureNoise(p, 5);
    const landSignal = smoothstep(0.05, 0.85, p.z) * (0.55 + wet * 0.45);
    const isLand = landSignal > 0.48;

    return {
      contract: "HEARTH_MATERIALS_REAL_PLANET_FALLBACK_COMPOSITION",
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
      isShallowWater: !isLand && wet > 0.58,
      isDeepWater: !isLand && wet <= 0.58,
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
      reliefStrength: isLand ? 0.25 : 0,
      slopePressure: 0.08,
      shelfDrop: 0.08,
      underlandShadow: 0.08,
      materialDensity: isLand ? 0.72 : 0,
      rimCompression: isLand ? 0.44 : 0.18,
      curvatureLock: 0.76,
      contactOcclusion: 0.08,
      surfaceAttachment: isLand ? 0.78 : 0.45
    };
  };

  const readComposition = (...args) => {
    const p = parseInput(...args);
    const composition = getCompositionAuthority();

    if (args.length === 1 && args[0] && typeof args[0] === "object") {
      const maybeComposition = args[0];

      if (
        typeof maybeComposition.worldTerrainClass === "string" ||
        typeof maybeComposition.terrainClass === "string" ||
        typeof maybeComposition.expandedTerrainClass === "string"
      ) {
        return maybeComposition;
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
          return fn.apply(composition, args);
        } catch (_error) {
          try {
            return fn.call(composition, p);
          } catch (_error2) {
            return fallbackComposition(p);
          }
        }
      }
    }

    return fallbackComposition(p);
  };

  const numberField = (source, key, fallback = 0) => {
    const n = Number(source && source[key]);
    return Number.isFinite(n) ? n : fallback;
  };

  const boolField = (source, key, fallback = false) => {
    return typeof (source && source[key]) === "boolean" ? source[key] : fallback;
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

  const climateClassFor = (composition) => {
    return composition.climateClass || composition.climateHint || "open_ocean";
  };

  const continentIdFor = (composition) => {
    return composition.continentId || "open_ocean";
  };

  const resolveBaseColor = (terrainClass, composition, isLand, isWater) => {
    const continentId = continentIdFor(composition);
    const climateClass = climateClassFor(composition);

    let color = paletteFor(terrainClass);

    if (isLand) {
      const continentBase = CONTINENT_BASE[continentId] || TERRAIN_PALETTE.continent_mass;
      const climateBase = TERRAIN_PALETTE[climateClass] || TERRAIN_PALETTE.temperate_highland;
      const continentWeight = clamp01(numberField(composition, "continentPotential", 0.45) * 0.44);
      const climateWeight = clamp01(numberField(composition, "climatePotential", 0.32) * 0.36);

      color = mixColor(color, continentBase, continentWeight);
      color = mixColor(color, climateBase, climateWeight);
    }

    if (isWater) {
      const depth = clamp01(numberField(composition, "waterDepthPotential", 0));
      const shelf = clamp01(Math.max(
        numberField(composition, "continentShelfPotential", 0),
        numberField(composition, "shelfPotential", 0)
      ));

      if (terrainClass === "deep_ocean") {
        color = mixColor(color, [4, 14, 29], clamp01(depth * 0.44));
      } else if (terrainClass === "ocean_basin") {
        color = mixColor(color, [7, 24, 42], 0.72);
      } else if (terrainClass === "continental_shelf") {
        color = mixColor(color, [36, 75, 74], clamp01(0.42 + shelf * 0.24));
      } else if (terrainClass === "archipelago_shelf") {
        color = mixColor(color, [37, 84, 75], clamp01(0.42 + shelf * 0.22));
      } else if (terrainClass === "continent_divide") {
        color = mixColor(color, [9, 30, 42], 0.76);
      } else if (terrainClass === "shallow_water") {
        color = mixColor(color, [35, 78, 80], 0.48);
      }
    }

    return color;
  };

  const applyOceanMaterial = (rgb, composition, p, noise) => {
    const terrainClass = terrainClassFor(composition);

    const depth = clamp01(Math.max(
      numberField(composition, "waterDepthPotential", 0),
      numberField(composition, "oceanBasinPotential", 0) * 0.82
    ));

    const shelf = clamp01(Math.max(
      numberField(composition, "continentShelfPotential", 0),
      numberField(composition, "shelfPotential", 0),
      numberField(composition, "shelfDrop", 0) * 0.72
    ));

    const coast = clamp01(Math.max(
      numberField(composition, "coastPotential", 0),
      numberField(composition, "shorelineContact", 0)
    ));

    const divide = clamp01(numberField(composition, "continentSeparation", 0));
    const archipelago = clamp01(Math.max(
      numberField(composition, "archipelagoPotential", 0),
      numberField(composition, "islandPotential", 0)
    ));

    let c = rgb.slice();

    const basinLift = terrainClass === "ocean_basin" ? 0.13 : 0.06;
    const blackCrushRelief = 1.0 + basinLift + noise * 0.05;

    c = scaleColor(c, blackCrushRelief);

    if (terrainClass === "deep_ocean") {
      c = mixColor(c, [4, 13, 28], clamp01(depth * 0.50));
      c = addColor(c, [2, 4, 7], noise * 0.28);
    }

    if (terrainClass === "ocean_basin") {
      c = mixColor(c, [8, 25, 43], 0.52);
      c = addColor(c, [3, 6, 8], noise * 0.32);
    }

    if (terrainClass === "continent_divide") {
      c = mixColor(c, [8, 27, 39], clamp01(0.56 + divide * 0.26));
      c = addColor(c, [1, 4, 5], noise * 0.18);
    }

    if (terrainClass === "continental_shelf" || terrainClass === "coastal_shelf") {
      c = mixColor(c, [36, 76, 75], clamp01(0.30 + shelf * 0.30));
      c = mixColor(c, [47, 84, 75], clamp01(coast * 0.16));
      c = addColor(c, [3, 5, 2], noise * 0.18);
    }

    if (terrainClass === "archipelago_shelf") {
      c = mixColor(c, [38, 87, 77], clamp01(0.30 + shelf * 0.22 + archipelago * 0.18));
      c = addColor(c, [3, 7, 3], noise * 0.18);
    }

    if (terrainClass === "shallow_water") {
      c = mixColor(c, [38, 80, 79], clamp01(0.28 + shelf * 0.20 + coast * 0.16));
    }

    c = mixColor(c, [3, 10, 22], clamp01(depth * 0.18));
    c = mixColor(c, [28, 62, 66], clamp01(shelf * 0.08 + coast * 0.05));

    return c;
  };

  const applyLandMaterial = (rgb, composition, p, noise) => {
    const terrainClass = terrainClassFor(composition);
    const continentId = continentIdFor(composition);
    const climateClass = climateClassFor(composition);
    const summitClass = composition.summitClass || "none";

    const continentBias = CONTINENT_BIAS[continentId] || CONTINENT_BIAS.open_ocean;
    const climateBias = CLIMATE_BIAS[climateClass] || CLIMATE_BIAS.open_ocean;

    const massAnchor = clamp01(numberField(composition, "massAnchor", 0.45));
    const materialDensity = clamp01(numberField(composition, "materialDensity", 0.45));
    const relief = clamp01(numberField(composition, "reliefStrength", 0));
    const ridge = clamp01(Math.max(numberField(composition, "ridgePotential", 0), numberField(composition, "mountainArcPotential", 0)));
    const plateau = clamp01(numberField(composition, "plateauPotential", 0));
    const basin = clamp01(numberField(composition, "basinPotential", 0));
    const canyon = clamp01(numberField(composition, "canyonPotential", 0));
    const escarpment = clamp01(numberField(composition, "escarpmentPotential", 0));
    const waterfall = clamp01(numberField(composition, "waterfallCandidate", 0));
    const archipelago = clamp01(numberField(composition, "archipelagoPotential", 0));
    const coast = clamp01(Math.max(numberField(composition, "coastPotential", 0), numberField(composition, "shorelineContact", 0)));
    const summit = clamp01(numberField(composition, "summitPotential", 0));

    let c = rgb.slice();

    c = addColor(c, continentBias, clamp01(0.26 + numberField(composition, "continentPotential", 0.35) * 0.26));
    c = addColor(c, climateBias, clamp01(0.18 + numberField(composition, "climatePotential", 0.20) * 0.24));

    c = addColor(c, [
      Math.round((noise - 0.50) * 18),
      Math.round((noise - 0.50) * 17),
      Math.round((noise - 0.50) * 13)
    ], 0.82);

    if (terrainClass === "continent_mass" || terrainClass === "raised_land") {
      c = mixColor(c, CONTINENT_BASE[continentId] || TERRAIN_PALETTE.continent_mass, 0.34);
      c = addColor(c, [10, 9, 3], clamp01(massAnchor * 0.34 + materialDensity * 0.22));
    }

    if (terrainClass === "coast_edge") {
      c = mixColor(c, [90, 93, 64], 0.52);
      c = mixColor(c, [58, 71, 57], clamp01(coast * 0.20));
    }

    if (terrainClass === "plateau_interior" || climateClass === "arid_dry_plateau") {
      c = mixColor(c, [138, 111, 67], clamp01(0.22 + plateau * 0.30));
      c = addColor(c, [8, 4, -5], clamp01(plateau * 0.20));
    }

    if (terrainClass === "basin_floor" || climateClass === "rainforest_wet_basin" || climateClass === "monsoon_floodplain") {
      c = mixColor(c, [58, 96, 52], clamp01(0.20 + basin * 0.34));
      c = mixColor(c, [43, 71, 45], clamp01(basin * 0.16));
    }

    if (terrainClass === "mountain_arc" || terrainClass === "alpine_ridge" || climateClass === "alpine_mountain_arc") {
      c = mixColor(c, [115, 113, 100], clamp01(0.22 + ridge * 0.36));
      c = addColor(c, [12, 11, 10], clamp01(relief * 0.20));
      c = mixColor(c, [64, 64, 60], clamp01(ridge * 0.08));
    }

    if (terrainClass === "canyon_corridor") {
      c = mixColor(c, [83, 54, 41], clamp01(0.34 + canyon * 0.32));
      c = mixColor(c, [47, 36, 31], clamp01(canyon * 0.14));
    }

    if (terrainClass === "cliff_escarpment") {
      c = mixColor(c, [66, 62, 55], clamp01(0.34 + escarpment * 0.30));
      c = mixColor(c, [43, 41, 38], clamp01(escarpment * 0.16));
    }

    if (terrainClass === "waterfall_escarpment") {
      c = mixColor(c, [103, 119, 104], clamp01(0.30 + waterfall * 0.28));
      c = addColor(c, [8, 12, 10], clamp01(waterfall * 0.18));
      c = mixColor(c, [78, 98, 94], clamp01(waterfall * 0.10));
    }

    if (terrainClass === "island_arc" || climateClass === "maritime_archipelago") {
      c = mixColor(c, [72, 122, 82], clamp01(0.20 + archipelago * 0.30));
      c = addColor(c, [-4, 8, 2], clamp01(archipelago * 0.18));
    }

    if (terrainClass === "polar_icefield") {
      c = mixColor(c, [155, 171, 171], 0.62);
    }

    if (terrainClass === "tundra_subpolar") {
      c = mixColor(c, [105, 121, 98], 0.48);
    }

    if (terrainClass === "temperate_coastal_storm") {
      c = mixColor(c, [55, 83, 77], 0.44);
      c = mixColor(c, [40, 58, 60], clamp01(coast * 0.10));
    }

    if (summitClass !== "none" && summit > 0.52) {
      c = mixColor(c, [132, 125, 91], clamp01((summit - 0.48) * 0.26));
      c = addColor(c, [8, 7, 5], clamp01(summit * relief * 0.14));
    }

    const bodyLift = clamp(
      1.05 +
        massAnchor * 0.11 +
        materialDensity * 0.08 +
        relief * 0.03 -
        coast * 0.03,
      0.94,
      1.23
    );

    c = scaleColor(c, bodyLift);

    return c;
  };

  const outputFieldsFor = (composition, terrainClass, isLand, isWater) => {
    const elevation = numberField(composition, "elevation", 0);

    const massAnchor = clamp01(numberField(composition, "massAnchor", 0));
    const materialDensity = clamp01(numberField(composition, "materialDensity", 0));
    const relief = clamp01(numberField(composition, "reliefStrength", 0));
    const slope = clamp01(numberField(composition, "slopePressure", 0));
    const coast = clamp01(Math.max(numberField(composition, "coastPotential", 0), numberField(composition, "shorelineContact", 0)));
    const shelf = clamp01(Math.max(numberField(composition, "continentShelfPotential", 0), numberField(composition, "shelfPotential", 0), numberField(composition, "shelfDrop", 0)));
    const depth = clamp01(Math.max(numberField(composition, "waterDepthPotential", 0), numberField(composition, "oceanBasinPotential", 0)));
    const ridge = clamp01(Math.max(numberField(composition, "ridgePotential", 0), numberField(composition, "mountainArcPotential", 0)));
    const canyon = clamp01(numberField(composition, "canyonPotential", 0));
    const cliff = clamp01(numberField(composition, "escarpmentPotential", 0));
    const waterfall = clamp01(numberField(composition, "waterfallCandidate", 0));
    const arch = clamp01(Math.max(numberField(composition, "archipelagoPotential", 0), numberField(composition, "islandPotential", 0)));
    const summit = clamp01(numberField(composition, "summitPotential", 0));
    const basin = clamp01(numberField(composition, "basinPotential", 0));
    const contactOcclusion = clamp01(numberField(composition, "contactOcclusion", 0));
    const underlandShadow = clamp01(numberField(composition, "underlandShadow", 0));
    const rimCompression = clamp01(numberField(composition, "rimCompression", 0));
    const curvatureLock = clamp01(numberField(composition, "curvatureLock", 0.72));
    const surfaceAttachment = clamp01(numberField(composition, "surfaceAttachment", 0.5));
    const divide = clamp01(numberField(composition, "continentSeparation", 0));

    const terrainRelief = clamp01(
      relief * 0.46 +
        ridge * 0.18 +
        canyon * 0.18 +
        cliff * 0.18 +
        waterfall * 0.16 +
        summit * 0.10
    );

    const ridgeRelief = clamp01(
      ridge * 0.48 +
        relief * 0.18 +
        summit * 0.12 +
        cliff * 0.14 +
        waterfall * 0.10
    );

    const basinShade = clamp01(
      basin * 0.32 +
        depth * 0.22 +
        canyon * 0.12 +
        (terrainClass === "basin_floor" ? 0.28 : 0)
    );

    const shorelineGrounding = clamp01(
      coast * 0.42 +
        shelf * 0.22 +
        arch * 0.12 +
        divide * 0.10
    );

    const shelfTransition = clamp01(
      shelf * 0.42 +
        coast * 0.18 +
        arch * 0.14 +
        divide * 0.12
    );

    const contactShadow = clamp01(
      contactOcclusion * 0.46 +
        slope * 0.18 +
        coast * 0.13 +
        cliff * 0.16 +
        waterfall * 0.08
    );

    const visibleLandDensity = isLand
      ? clamp01(0.54 + massAnchor * 0.20 + materialDensity * 0.16 + relief * 0.08 + summit * 0.05)
      : 0;

    const waterDepthShade = isWater
      ? clamp01(depth * 0.58 + basinShade * 0.18 + (elevation < -0.22 ? 0.16 : 0))
      : 0;

    return {
      alpha: 1,
      isLand,
      isWater,

      landDensity: visibleLandDensity,
      shorelineGrounding,
      contactShadow,
      underlandOcclusion: clamp01(underlandShadow * 0.50 + shorelineGrounding * 0.24 + shelf * 0.10),
      shelfTransition,
      terrainRelief,
      ridgeRelief,
      basinShade,
      rimDarkening: clamp01(rimCompression * 0.34 + terrainRelief * 0.10 + depth * 0.08),
      rimCompression: clamp01(rimCompression * 0.58 + massAnchor * 0.14 + relief * 0.08),
      atmosphereSeparation: isLand
        ? clamp01(0.46 + massAnchor * 0.20 + terrainRelief * 0.10)
        : clamp01(0.12 + depth * 0.12),
      surfaceAttachment: clamp01(surfaceAttachment * 0.68 + massAnchor * 0.18 + shorelineGrounding * 0.08),
      curvatureLock,
      waterDepthShade,
      bridgePotential: clamp01(numberField(composition, "bridgePotential", 0) * 0.40 + numberField(composition, "scarPotential", 0) * 0.22)
    };
  };

  const sample = (...args) => {
    const p = parseInput(...args);
    const composition = readComposition(...args);

    const worldTerrainClass = terrainClassFor(composition);
    const terrainClass = worldTerrainClass;
    const compatibilityTerrainClass = compatibilityClassFor(composition);
    const materialClass = MATERIAL_CLASS_MAP[terrainClass] || MATERIAL_CLASS_MAP[compatibilityTerrainClass] || MATERIAL_CLASS_MAP.ocean_basin;

    const isWater = isWaterTerrain(terrainClass, composition);
    const isLand = !isWater && isLandTerrain(terrainClass, composition);

    const continentId = continentIdFor(composition);
    const climateClass = climateClassFor(composition);
    const summitClass = composition.summitClass || "none";

    const noiseA = textureNoise(p, terrainClass.length + (numberField(composition, "continentIndex", 0) + 9));
    const noiseB = textureNoise({ x: p.y, y: p.z, z: p.x }, 41);
    const materialNoise = clamp01(noiseA * 0.62 + noiseB * 0.38);

    let rgb = resolveBaseColor(terrainClass, composition, isLand, isWater);

    if (isWater) {
      rgb = applyOceanMaterial(rgb, composition, p, materialNoise);
    } else {
      rgb = applyLandMaterial(rgb, composition, p, materialNoise);
    }

    const fields = outputFieldsFor(composition, terrainClass, isLand, isWater);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      authority: "materials",
      sourceAuthority: "hearth.composition.js",

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

      continentId,
      continentName: composition.continentName || "Open Ocean",
      continentIndex: Number.isFinite(Number(composition.continentIndex)) ? Number(composition.continentIndex) : -1,
      continentClass: composition.continentClass || "open_ocean",

      climateHint: composition.climateHint || "open_ocean",
      climateClass,

      summitRegionHint: composition.summitRegionHint || "none",
      summitRegionLabel: composition.summitRegionLabel || "None",
      summitTerrainHint: composition.summitTerrainHint || "none",
      summitClass,

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

      materialNoise,
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
    canvas.dataset.hearthMaterialsRealPlanet = "true";
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
    sourceAuthority: "hearth.composition.js",
    purpose: "seven-continent-real-planet-material-expression",
    supportsExpandedHearthTerrain: true,
    supportsSevenContinentNineClimateTerrain: true,
    supportsSevenClimateTerrainClasses: true,
    supportsSevenContinentRealPlanetMaterials: true,
    consumesCompositionV1: true,
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
      "bridgePotential"
    ],
    designRules: [
      "dark oceans but readable",
      "shelves as muted gradients not cyan dots",
      "coasts as grounded transitions",
      "land interiors as visible continent bodies",
      "climate as natural terrain variation",
      "terrain relief through material density and shadow",
      "summit regions terrain-native, not markers",
      "canvas held",
      "route held",
      "no final visual pass claim"
    ],
    forbiddenOwnership: [
      "elevation-generation",
      "composition-classification",
      "canvas-drawing",
      "runtime-motion",
      "controls",
      "route-orchestration",
      "teleports",
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
    consumesCompositionV1: true,
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

  if (root.document && root.document.documentElement) {
    root.document.documentElement.dataset.hearthMaterialsAuthorityLoaded = "true";
    root.document.documentElement.dataset.hearthMaterialsContract = CONTRACT;
    root.document.documentElement.dataset.hearthMaterialsReceipt = RECEIPT;
    root.document.documentElement.dataset.hearthMaterialsPreviousContract = PREVIOUS_CONTRACT;
    root.document.documentElement.dataset.hearthMaterialsSupportsExpandedTerrain = "true";
    root.document.documentElement.dataset.hearthMaterialsSupportsSevenContinentNineClimate = "true";
    root.document.documentElement.dataset.hearthMaterialsSupportsSevenClimateTerrainClasses = "true";
    root.document.documentElement.dataset.hearthMaterialsSupportsSevenContinentRealPlanet = "true";
    root.document.documentElement.dataset.hearthMaterialsVisualExpression = "true";
    root.document.documentElement.dataset.hearthMaterialsConsumesCompositionV1 = "true";
    root.document.documentElement.dataset.hearthMaterialsPrefersWorldTerrainClass = "true";
    root.document.documentElement.dataset.generatedImage = "false";
    root.document.documentElement.dataset.graphicBox = "false";
    root.document.documentElement.dataset.webgl = "false";
    root.document.documentElement.dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

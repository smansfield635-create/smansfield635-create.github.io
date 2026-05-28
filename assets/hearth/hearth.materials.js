// /assets/hearth/hearth.materials.js
// HEARTH_SEVEN_CONTINENT_NINE_CLIMATE_MATERIALS_VISUAL_EXPRESSION_TNT_v1
// Full-file replacement.
// Materials authority only.
// Purpose:
// - Consume Hearth composition v2.
// - Declare expanded seven-continent / nine-climate terrain support.
// - Convert terrain, continent, climate, summit, shelf, basin, canyon, cliff, waterfall, and archipelago classes into material output.
// - Preserve canvas v7 compatibility.
// - Preserve createTextureCanvas/sample/read/getMaterial compatibility.
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

  const CONTRACT = "HEARTH_SEVEN_CONTINENT_NINE_CLIMATE_MATERIALS_VISUAL_EXPRESSION_TNT_v1";
  const RECEIPT = "HEARTH_SEVEN_CONTINENT_NINE_CLIMATE_MATERIALS_VISUAL_EXPRESSION_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_NINE_SUMMITS_256_GLOBAL_MAP_MATERIALS_TNT_v7";
  const VERSION = "2026-05-28.hearth-seven-continent-nine-climate-materials-visual-expression-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const DEG = Math.PI / 180;

  const EXPANDED_TERRAIN_CLASSES = [
    "deep_ocean",
    "ocean_basin",
    "continental_shelf",
    "archipelago_shelf",
    "coast_edge",
    "continent_mass",
    "continent_divide",
    "plateau_interior",
    "basin_floor",
    "mountain_arc",
    "alpine_ridge",
    "canyon_corridor",
    "cliff_escarpment",
    "waterfall_escarpment",
    "summit_region",
    "polar_icefield",
    "tundra_subpolar",
    "temperate_highland",
    "temperate_coastal_storm",
    "rainforest_wet_basin",
    "monsoon_floodplain",
    "arid_dry_plateau",
    "maritime_archipelago",
    "island_arc",
    "shallow_water",
    "raised_land"
  ];

  const COMPATIBILITY_TERRAIN_CLASSES = [
    "continental_core",
    "raised_shield",
    "coastal_shelf",
    "exposed_bridge",
    "submerged_bridge",
    "ridge_corridor",
    "shallow_saddle",
    "cliff_candidate",
    "valley_candidate",
    "mountain_candidate",
    "island_seed",
    "deep_water"
  ];

  const MATERIAL_CLASS_MAP = Object.freeze({
    deep_ocean: "water.deep.ocean",
    ocean_basin: "water.deep.basin",
    continental_shelf: "water.shelf.continental",
    archipelago_shelf: "water.shelf.archipelago",
    coast_edge: "land.coast.grounded",
    continent_mass: "land.continent.mass",
    continent_divide: "water.divide.continental",
    plateau_interior: "land.plateau.interior",
    basin_floor: "land.basin.floor",
    mountain_arc: "land.mountain.arc",
    alpine_ridge: "land.alpine.ridge",
    canyon_corridor: "land.canyon.corridor",
    cliff_escarpment: "land.cliff.escarpment",
    waterfall_escarpment: "land.waterfall.escarpment",
    summit_region: "land.summit.region",
    polar_icefield: "climate.polar.icefield",
    tundra_subpolar: "climate.tundra.subpolar",
    temperate_highland: "climate.temperate.highland",
    temperate_coastal_storm: "climate.temperate.coastal.storm",
    rainforest_wet_basin: "climate.rainforest.wet.basin",
    monsoon_floodplain: "climate.monsoon.floodplain",
    arid_dry_plateau: "climate.arid.dry.plateau",
    maritime_archipelago: "climate.maritime.archipelago",
    island_arc: "land.island.arc",
    shallow_water: "water.shallow",
    raised_land: "land.raised",

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

  const BASE_PALETTE = Object.freeze({
    deep_ocean: [4, 15, 31],
    ocean_basin: [3, 10, 23],
    continental_shelf: [18, 60, 78],
    archipelago_shelf: [22, 75, 82],
    shallow_water: [25, 73, 89],
    coast_edge: [88, 92, 62],
    continent_divide: [8, 26, 39],
    continent_mass: [96, 101, 62],
    raised_land: [105, 106, 66],
    plateau_interior: [123, 111, 70],
    basin_floor: [70, 87, 54],
    mountain_arc: [92, 89, 76],
    alpine_ridge: [132, 139, 124],
    canyon_corridor: [92, 66, 48],
    cliff_escarpment: [72, 67, 58],
    waterfall_escarpment: [94, 105, 91],
    summit_region: [132, 126, 92],
    polar_icefield: [147, 164, 165],
    tundra_subpolar: [107, 118, 95],
    temperate_highland: [84, 112, 67],
    temperate_coastal_storm: [54, 84, 78],
    rainforest_wet_basin: [37, 91, 49],
    monsoon_floodplain: [66, 102, 56],
    arid_dry_plateau: [135, 106, 64],
    maritime_archipelago: [52, 104, 83],
    island_arc: [74, 112, 75],

    continental_core: [104, 103, 63],
    raised_shield: [105, 107, 66],
    coastal_shelf: [20, 69, 84],
    exposed_bridge: [112, 102, 63],
    submerged_bridge: [20, 58, 73],
    ridge_corridor: [94, 88, 67],
    shallow_saddle: [22, 64, 80],
    cliff_candidate: [70, 65, 57],
    valley_candidate: [64, 82, 53],
    mountain_candidate: [100, 96, 78],
    island_seed: [79, 107, 68],
    deep_water: [4, 13, 28]
  });

  const CONTINENT_BIAS = Object.freeze({
    western_shield: [14, 10, -4],
    eastern_basin: [4, 8, -2],
    northern_cold: [8, 14, 16],
    southern_harsh: [18, 2, -10],
    equatorial_wet: [-16, 20, -8],
    mountain_arc: [10, 8, 8],
    broken_archipelago: [-10, 14, 8],
    open_ocean: [-8, 0, 8]
  });

  const CLIMATE_BIAS = Object.freeze({
    polar_icefield: [32, 42, 42],
    tundra_subpolar: [12, 20, 12],
    temperate_highland: [-8, 18, -7],
    temperate_coastal_storm: [-20, 4, 10],
    rainforest_wet_basin: [-30, 34, -18],
    monsoon_floodplain: [-16, 24, -10],
    arid_dry_plateau: [30, 12, -18],
    alpine_mountain_arc: [18, 20, 18],
    maritime_archipelago: [-12, 22, 12],
    open_ocean: [-6, 0, 8]
  });

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

    return { x: x / m, y: y / m, z: z / m };
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

  const getCompositionAuthority = () => {
    if (root.HEARTH && root.HEARTH.composition) return root.HEARTH.composition;
    if (root.HEARTH_COMPOSITION) return root.HEARTH_COMPOSITION;
    if (root.HearthComposition) return root.HearthComposition;
    return null;
  };

  const hashNoise = (x, y, z, salt = 0) => {
    const n =
      Math.sin(
        x * 127.1 +
        y * 311.7 +
        z * 74.7 +
        salt * 19.19
      ) * 43758.5453123;

    return n - Math.floor(n);
  };

  const textureNoise = (p, salt = 0) => {
    const n1 = hashNoise(p.x, p.y, p.z, salt);
    const n2 = hashNoise(p.y + n1, p.z - n1, p.x + n1, salt + 7);
    const n3 = hashNoise(p.z - n2, p.x + n2, p.y - n2, salt + 17);
    return clamp01(n1 * 0.52 + n2 * 0.30 + n3 * 0.18);
  };

  const fallbackComposition = (p) => {
    const water = p.z < 0.15 ? 1 : 0;
    const landSignal =
      smoothstep(0.10, 0.95, p.z) *
      (0.45 + textureNoise(p, 3) * 0.55);

    const isLand = landSignal > 0.46;

    return {
      contract: "HEARTH_MATERIALS_FALLBACK_COMPOSITION",
      receipt: "FALLBACK_COMPOSITION_USED",
      x: p.x,
      y: p.y,
      z: p.z,
      terrainClass: isLand ? "continent_mass" : water ? "ocean_basin" : "deep_ocean",
      worldTerrainClass: isLand ? "continent_mass" : "ocean_basin",
      expandedTerrainClass: isLand ? "continent_mass" : "ocean_basin",
      compatibilityTerrainClass: isLand ? "raised_shield" : "deep_water",
      continentId: isLand ? "western_shield" : "open_ocean",
      continentClass: isLand ? "western_shield_mass" : "open_ocean",
      climateHint: isLand ? "temperate_highland" : "open_ocean",
      climateClass: isLand ? "temperate_highland" : "open_ocean",
      summitRegionHint: "none",
      summitClass: "none",
      elevation: isLand ? 0.18 : -0.42,
      isLand,
      isWater: !isLand,
      landPotential: isLand ? 0.7 : 0,
      waterDepthPotential: isLand ? 0 : 0.55,
      coastPotential: 0,
      shelfPotential: 0,
      continentShelfPotential: 0,
      oceanBasinPotential: isLand ? 0 : 0.62,
      archipelagoPotential: 0,
      mountainArcPotential: 0,
      plateauPotential: isLand ? 0.32 : 0,
      canyonPotential: 0,
      escarpmentPotential: 0,
      waterfallCandidate: 0,
      massAnchor: isLand ? 0.72 : 0,
      shorelineContact: 0,
      reliefStrength: isLand ? 0.28 : 0,
      slopePressure: 0,
      shelfDrop: 0,
      underlandShadow: 0,
      materialDensity: isLand ? 0.7 : 0,
      rimCompression: isLand ? 0.45 : 0.18,
      curvatureLock: 0.72,
      contactOcclusion: 0,
      surfaceAttachment: isLand ? 0.76 : 0.45,
      bridgePotential: 0
    };
  };

  const readComposition = (...args) => {
    const p = parseInput(...args);
    const composition = getCompositionAuthority();

    if (composition) {
      const fn =
        typeof composition.sample === "function"
          ? composition.sample
          : typeof composition.read === "function"
            ? composition.read
            : typeof composition.sampleComposition === "function"
              ? composition.sampleComposition
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

  const terrainClassFor = (composition) => {
    return (
      composition.worldTerrainClass ||
      composition.expandedTerrainClass ||
      composition.semanticTerrainClass ||
      composition.terrainClass ||
      composition.compatibilityTerrainClass ||
      "deep_ocean"
    );
  };

  const baseColorFor = (terrainClass) => {
    return (BASE_PALETTE[terrainClass] || BASE_PALETTE.deep_ocean).slice();
  };

  const isWaterClass = (terrainClass) => {
    return (
      terrainClass === "deep_ocean" ||
      terrainClass === "ocean_basin" ||
      terrainClass === "continental_shelf" ||
      terrainClass === "archipelago_shelf" ||
      terrainClass === "shallow_water" ||
      terrainClass === "continent_divide" ||
      terrainClass === "deep_water" ||
      terrainClass === "coastal_shelf" ||
      terrainClass === "submerged_bridge" ||
      terrainClass === "shallow_saddle"
    );
  };

  const isLandClass = (terrainClass, composition) => {
    if (isWaterClass(terrainClass)) return false;
    if (typeof composition.isLand === "boolean") return composition.isLand;
    return Number(composition.elevation || 0) > 0;
  };

  const climateBiasFor = (composition) => {
    const climateClass = composition.climateClass || composition.climateHint || "open_ocean";
    return CLIMATE_BIAS[climateClass] || CLIMATE_BIAS.open_ocean;
  };

  const continentBiasFor = (composition) => {
    const continentId = composition.continentId || "open_ocean";
    return CONTINENT_BIAS[continentId] || CONTINENT_BIAS.open_ocean;
  };

  const classWeight = (composition, key) => clamp01(composition[key]);

  const applyWaterMaterial = (rgb, composition, p, noise) => {
    const terrainClass = terrainClassFor(composition);
    const depth = clamp01(composition.waterDepthPotential || composition.oceanBasinPotential || 0);
    const shelf =
      clamp01(
        Math.max(
          composition.shelfPotential || 0,
          composition.continentShelfPotential || 0,
          composition.shelfTransition || 0
        )
      );

    const coast = clamp01(composition.coastPotential || composition.shorelineContact || 0);
    const arch = clamp01(composition.archipelagoPotential || composition.islandPotential || 0);
    const divide = clamp01(composition.continentSeparation || 0);

    let c = rgb.slice();

    if (terrainClass === "ocean_basin" || terrainClass === "deep_ocean" || terrainClass === "deep_water") {
      c = mixColor(c, [2, 8, 20], clamp01(depth * 0.62 + (1 - noise) * 0.10));
    }

    if (terrainClass === "continental_shelf" || terrainClass === "coastal_shelf") {
      c = mixColor(c, [25, 83, 93], clamp01(shelf * 0.55 + coast * 0.20));
    }

    if (terrainClass === "archipelago_shelf") {
      c = mixColor(c, [28, 92, 91], clamp01(arch * 0.55 + shelf * 0.25));
    }

    if (terrainClass === "continent_divide") {
      c = mixColor(c, [5, 21, 34], clamp01(divide * 0.74));
    }

    c = addColor(c, [5, 7, 8], noise * 0.20);
    c = mixColor(c, [2, 7, 16], clamp01(depth * 0.34));
    c = mixColor(c, [14, 58, 70], clamp01(coast * 0.12 + shelf * 0.12));

    return c;
  };

  const applyLandMaterial = (rgb, composition, p, noise) => {
    let c = rgb.slice();

    const climateBias = climateBiasFor(composition);
    const continentBias = continentBiasFor(composition);

    const climateWeight = clamp01(
      composition.climatePotential ||
      Math.max(
        composition.polarInfluence || 0,
        composition.tundraInfluence || 0,
        composition.rainforestInfluence || 0,
        composition.monsoonInfluence || 0,
        composition.desertInfluence || 0,
        composition.alpineInfluence || 0,
        composition.maritimeInfluence || 0,
        0.42
      )
    );

    const continentWeight = clamp01(composition.continentPotential || composition.landPotential || 0.45);
    const relief = clamp01(composition.reliefStrength || 0);
    const slope = clamp01(composition.slopePressure || 0);
    const mountain = clamp01(composition.mountainArcPotential || composition.ridgePotential || 0);
    const plateau = clamp01(composition.plateauPotential || 0);
    const canyon = clamp01(composition.canyonPotential || 0);
    const escarpment = clamp01(composition.escarpmentPotential || 0);
    const waterfall = clamp01(composition.waterfallCandidate || 0);
    const archipelago = clamp01(composition.archipelagoPotential || 0);
    const summit = clamp01(composition.summitPotential || 0);
    const coast = clamp01(composition.coastPotential || composition.shorelineContact || 0);

    c = addColor(c, continentBias, clamp01(continentWeight * 0.45));
    c = addColor(c, climateBias, clamp01(climateWeight * 0.50));

    c = addColor(c, [
      Math.round((noise - 0.5) * 20),
      Math.round((noise - 0.5) * 18),
      Math.round((noise - 0.5) * 14)
    ], 0.86);

    if (mountain > 0.25) {
      c = mixColor(c, [107, 105, 94], clamp01(mountain * 0.35));
      c = addColor(c, [10, 9, 8], clamp01(mountain * noise * 0.25));
    }

    if (plateau > 0.25) {
      c = mixColor(c, [132, 111, 70], clamp01(plateau * 0.28));
    }

    if (canyon > 0.20) {
      c = mixColor(c, [76, 49, 37], clamp01(canyon * 0.38));
    }

    if (escarpment > 0.20) {
      c = mixColor(c, [54, 52, 48], clamp01(escarpment * 0.34));
    }

    if (waterfall > 0.22) {
      c = mixColor(c, [114, 128, 119], clamp01(waterfall * 0.28));
      c = addColor(c, [8, 15, 18], clamp01(waterfall * 0.18));
    }

    if (archipelago > 0.22) {
      c = mixColor(c, [54, 110, 83], clamp01(archipelago * 0.22));
    }

    if (summit > 0.52 && composition.summitClass && composition.summitClass !== "none") {
      c = mixColor(c, [134, 126, 91], clamp01((summit - 0.48) * 0.34));
      c = addColor(c, [12, 10, 6], clamp01(summit * relief * 0.18));
    }

    if (coast > 0.38) {
      c = mixColor(c, [84, 91, 65], clamp01(coast * 0.20));
    }

    c = scaleColor(c, clamp(0.90 + relief * 0.07 + mountain * 0.05 - slope * 0.04, 0.78, 1.12));

    return c;
  };

  const outputFieldsFor = (composition, terrainClass, isLand, isWater) => {
    const relief = clamp01(composition.reliefStrength || 0);
    const slope = clamp01(composition.slopePressure || 0);
    const coast = clamp01(composition.coastPotential || composition.shorelineContact || 0);
    const shelf = clamp01(Math.max(composition.shelfPotential || 0, composition.continentShelfPotential || 0));
    const depth = clamp01(composition.waterDepthPotential || composition.oceanBasinPotential || 0);
    const mountain = clamp01(composition.mountainArcPotential || composition.ridgePotential || 0);
    const canyon = clamp01(composition.canyonPotential || 0);
    const cliff = clamp01(composition.escarpmentPotential || 0);
    const waterfall = clamp01(composition.waterfallCandidate || 0);
    const arch = clamp01(composition.archipelagoPotential || composition.islandPotential || 0);
    const summit = clamp01(composition.summitPotential || 0);
    const mass = clamp01(composition.massAnchor || composition.materialDensity || 0);

    const ridgeRelief = clamp01(
      mountain * 0.48 +
      relief * 0.26 +
      summit * 0.18 +
      cliff * 0.20
    );

    const terrainRelief = clamp01(
      relief * 0.44 +
      mountain * 0.26 +
      canyon * 0.18 +
      cliff * 0.16 +
      waterfall * 0.14 +
      summit * 0.12
    );

    const basinShade = clamp01(
      composition.basinPotential * 0.34 +
      depth * 0.30 +
      canyon * 0.16 +
      (terrainClass === "basin_floor" ? 0.34 : 0)
    );

    return {
      alpha: 1,
      isLand,
      isWater,

      landDensity: isLand
        ? clamp01(0.46 + mass * 0.34 + relief * 0.12 + summit * 0.08)
        : 0,

      shorelineGrounding: clamp01(coast * 0.48 + shelf * 0.22 + arch * 0.16),
      contactShadow: clamp01(composition.contactOcclusion * 0.52 + slope * 0.18 + coast * 0.18 + cliff * 0.20),
      underlandOcclusion: clamp01(composition.underlandShadow * 0.58 + coast * 0.18 + shelf * 0.16),
      shelfTransition: clamp01(shelf * 0.58 + coast * 0.22 + arch * 0.18),
      terrainRelief,
      ridgeRelief,
      basinShade,
      rimDarkening: clamp01(composition.rimCompression * 0.38 + terrainRelief * 0.14 + depth * 0.12),
      rimCompression: clamp01(composition.rimCompression * 0.66 + mass * 0.16 + relief * 0.10),
      atmosphereSeparation: isLand
        ? clamp01(0.42 + mass * 0.28 + relief * 0.12)
        : clamp01(0.08 + depth * 0.18),
      surfaceAttachment: clamp01(composition.surfaceAttachment * 0.70 + mass * 0.20 + coast * 0.08),
      curvatureLock: clamp01(composition.curvatureLock || 0.72),
      waterDepthShade: isWater ? clamp01(depth * 0.72 + basinShade * 0.22) : 0,
      bridgePotential: clamp01(composition.bridgePotential || composition.scarPotential || 0)
    };
  };

  const sample = (...args) => {
    const p = parseInput(...args);
    const composition = readComposition(...args);
    const terrainClass = terrainClassFor(composition);
    const materialClass = MATERIAL_CLASS_MAP[terrainClass] || MATERIAL_CLASS_MAP.deep_ocean;

    const water = isWaterClass(terrainClass) || composition.isWater === true;
    const land = !water && isLandClass(terrainClass, composition);

    const n = textureNoise(p, terrainClass.length + (composition.continentIndex || 0));
    const n2 = textureNoise({ x: p.y, y: p.z, z: p.x }, 31);
    const organic = clamp01(n * 0.68 + n2 * 0.32);

    let rgb = baseColorFor(terrainClass);

    if (water) {
      rgb = applyWaterMaterial(rgb, composition, p, organic);
    } else {
      rgb = applyLandMaterial(rgb, composition, p, organic);
    }

    const fields = outputFieldsFor(composition, terrainClass, land, water);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "materials",
      sourceAuthority: "hearth.composition.js",

      rgb,
      color: rgb,
      baseColor: rgb,
      finalColorHint: rgb,
      alpha: fields.alpha,

      isLand: land,
      isWater: water,

      terrainClass,
      worldTerrainClass: composition.worldTerrainClass || terrainClass,
      expandedTerrainClass: composition.expandedTerrainClass || terrainClass,
      semanticTerrainClass: composition.semanticTerrainClass || terrainClass,
      compatibilityTerrainClass: composition.compatibilityTerrainClass || terrainClass,

      materialClass,
      surfaceFamily: water ? "water" : "land",
      visualPriority: land ? 0.72 : 0.54,

      continentId: composition.continentId || "open_ocean",
      continentName: composition.continentName || "Open Ocean",
      continentIndex: Number.isFinite(Number(composition.continentIndex)) ? Number(composition.continentIndex) : -1,
      continentClass: composition.continentClass || "open_ocean",

      climateHint: composition.climateHint || "open_ocean",
      climateClass: composition.climateClass || "open_ocean",

      summitRegionHint: composition.summitRegionHint || "none",
      summitClass: composition.summitClass || "none",

      elevation: composition.elevation || 0,
      landPotential: clamp01(composition.landPotential || 0),
      coastPotential: clamp01(composition.coastPotential || 0),
      waterDepthPotential: clamp01(composition.waterDepthPotential || 0),

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

      continentPotential: clamp01(composition.continentPotential || 0),
      continentSeparation: clamp01(composition.continentSeparation || 0),
      oceanBasinPotential: clamp01(composition.oceanBasinPotential || 0),
      continentShelfPotential: clamp01(composition.continentShelfPotential || 0),
      mountainArcPotential: clamp01(composition.mountainArcPotential || 0),
      plateauPotential: clamp01(composition.plateauPotential || 0),
      canyonPotential: clamp01(composition.canyonPotential || 0),
      escarpmentPotential: clamp01(composition.escarpmentPotential || 0),
      waterfallCandidate: clamp01(composition.waterfallCandidate || 0),
      archipelagoPotential: clamp01(composition.archipelagoPotential || 0),
      summitPotential: clamp01(composition.summitPotential || 0),

      materialNoise: organic,
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

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.dataset.hearthMaterialsTexture = "true";
    canvas.dataset.hearthMaterialsContract = CONTRACT;
    canvas.dataset.hearthMaterialsReceipt = RECEIPT;
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
    version: VERSION,
    authority: "materials",
    status: "active",
    sourceAuthority: "hearth.composition.js",
    supportsExpandedHearthTerrain: true,
    supportsSevenContinentNineClimateTerrain: true,
    supportsSevenClimateTerrainClasses: true,
    terrainClasses: EXPANDED_TERRAIN_CLASSES.slice(),
    compatibilityTerrainClasses: COMPATIBILITY_TERRAIN_CLASSES.slice(),
    materialClassMap: { ...MATERIAL_CLASS_MAP },
    requiredInputs: [
      "terrainClass",
      "worldTerrainClass",
      "continentId",
      "continentClass",
      "climateHint",
      "climateClass",
      "summitRegionHint",
      "summitClass",
      "massAnchor",
      "shorelineContact",
      "reliefStrength",
      "slopePressure",
      "shelfDrop",
      "underlandShadow",
      "materialDensity",
      "rimCompression",
      "curvatureLock",
      "contactOcclusion",
      "surfaceAttachment",
      "waterDepthPotential",
      "oceanBasinPotential",
      "continentShelfPotential",
      "mountainArcPotential",
      "plateauPotential",
      "canyonPotential",
      "escarpmentPotential",
      "waterfallCandidate",
      "archipelagoPotential"
    ],
    outputs: [
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
    compatibilityTerrainClasses: COMPATIBILITY_TERRAIN_CLASSES.slice(),
    materialClassMap: { ...MATERIAL_CLASS_MAP },

    supportsExpandedHearthTerrain: true,
    supportsSevenContinentNineClimateTerrain: true,
    supportsSevenClimateTerrainClasses: true,

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

  document.documentElement.dataset.hearthMaterialsAuthorityLoaded = "true";
  document.documentElement.dataset.hearthMaterialsContract = CONTRACT;
  document.documentElement.dataset.hearthMaterialsReceipt = RECEIPT;
  document.documentElement.dataset.hearthMaterialsPreviousContract = PREVIOUS_CONTRACT;
  document.documentElement.dataset.hearthMaterialsSupportsExpandedTerrain = "true";
  document.documentElement.dataset.hearthMaterialsSupportsSevenContinentNineClimate = "true";
  document.documentElement.dataset.hearthMaterialsSupportsSevenClimateTerrainClasses = "true";
  document.documentElement.dataset.hearthMaterialsVisualExpression = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.webgl = "false";
  document.documentElement.dataset.visualPassClaimed = "false";

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

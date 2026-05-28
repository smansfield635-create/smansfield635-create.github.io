// /assets/hearth/hearth.materials.js
// HEARTH_AGED_TECH_COASTAL_BOUNDARY_MATERIALS_REFINEMENT_TNT_v2
// Full-file replacement.
// Materials authority only.
// Purpose:
// - Consume composition + tectonics + hydrology.
// - Preserve canvas v7 compatibility.
// - Refine aged-tech coastal boundaries so green dotted tracework becomes weathered carved coastal material.
// - Preserve coastal evidence while reducing bead/glow/circuit behavior.
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

  const CONTRACT = "HEARTH_AGED_TECH_COASTAL_BOUNDARY_MATERIALS_REFINEMENT_TNT_v2";
  const RECEIPT = "HEARTH_AGED_TECH_COASTAL_BOUNDARY_MATERIALS_REFINEMENT_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "HEARTH_AGED_TECH_COASTAL_BOUNDARY_MATERIALS_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_SEVEN_CONTINENT_REAL_PLANET_MATERIALS_TNT_v1";
  const VERSION = "2026-05-28.hearth-aged-tech-coastal-boundary-materials-refinement-v2";

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
    "summit_region"
  ];

  const MATERIAL_CLASS_MAP = Object.freeze({
    deep_ocean: "water.deep.ocean.body",
    ocean_basin: "water.ocean.basin.readable",
    continental_shelf: "water.shelf.submerged.weathered",
    archipelago_shelf: "water.shelf.archipelago.submerged-works",
    continent_divide: "water.divide.ancient-carved-strait",
    shallow_water: "water.shallow.weathered-coastal-transition",
    coast_edge: "coast.refined-aged-carved-boundary",
    continent_mass: "land.continent.embodied.mass",
    raised_land: "land.raised.general",
    plateau_interior: "land.plateau.dense.interior",
    basin_floor: "land.basin.lowland.floor",
    mountain_arc: "land.mountain.arc.relief",
    alpine_ridge: "land.alpine.ridge.coldstone",
    canyon_corridor: "land.canyon.corridor.cut",
    cliff_escarpment: "land.cliff.escarpment.shadow",
    waterfall_escarpment: "land.waterfall.weathered-drainage-outlet",
    island_arc: "land.island.arc.weathered-shelf",
    polar_icefield: "climate.polar.icefield",
    tundra_subpolar: "climate.tundra.subpolar",
    temperate_highland: "climate.temperate.highland",
    temperate_coastal_storm: "coast.storm-weathered-works",
    rainforest_wet_basin: "climate.rainforest.wet.basin",
    monsoon_floodplain: "climate.monsoon.floodplain",
    arid_dry_plateau: "climate.arid.dry.plateau",
    maritime_archipelago: "coast.maritime.old-submerged-channels",
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
    deep_ocean: [4, 13, 25],
    ocean_basin: [7, 21, 36],
    continental_shelf: [27, 54, 53],
    archipelago_shelf: [29, 61, 54],
    continent_divide: [7, 24, 33],
    shallow_water: [29, 62, 61],

    coast_edge: [73, 77, 57],
    continent_mass: [108, 102, 66],
    raised_land: [101, 100, 64],
    plateau_interior: [123, 101, 63],
    basin_floor: [66, 87, 54],
    mountain_arc: [98, 95, 83],
    alpine_ridge: [127, 135, 122],
    canyon_corridor: [78, 53, 41],
    cliff_escarpment: [63, 60, 55],
    waterfall_escarpment: [87, 103, 94],
    island_arc: [69, 104, 72],

    polar_icefield: [143, 160, 160],
    tundra_subpolar: [98, 113, 94],
    temperate_highland: [75, 107, 64],
    temperate_coastal_storm: [49, 73, 69],
    rainforest_wet_basin: [35, 86, 47],
    monsoon_floodplain: [62, 96, 56],
    arid_dry_plateau: [128, 101, 62],
    maritime_archipelago: [50, 96, 77],
    summit_region: [122, 116, 87],

    continental_core: [106, 101, 64],
    raised_shield: [98, 99, 63],
    coastal_shelf: [27, 58, 61],
    exposed_bridge: [105, 97, 63],
    submerged_bridge: [19, 49, 57],
    ridge_corridor: [91, 86, 69],
    shallow_saddle: [27, 58, 63],
    cliff_candidate: [63, 60, 55],
    valley_candidate: [60, 79, 53],
    mountain_candidate: [98, 95, 81],
    island_seed: [72, 101, 70],
    deep_water: [4, 13, 25]
  });

  const CONTINENT_BASE = Object.freeze({
    western_shield: [114, 109, 72],
    eastern_basin: [89, 104, 65],
    northern_cold: [108, 120, 112],
    southern_harsh: [131, 104, 65],
    equatorial_wet: [53, 103, 55],
    mountain_arc: [108, 106, 92],
    broken_archipelago: [70, 107, 77],
    open_ocean: [7, 21, 36]
  });

  const CLIMATE_BIAS = Object.freeze({
    polar_icefield: [25, 34, 35],
    tundra_subpolar: [9, 14, 9],
    temperate_highland: [-7, 16, -7],
    temperate_coastal_storm: [-15, 3, 8],
    rainforest_wet_basin: [-25, 29, -15],
    monsoon_floodplain: [-13, 20, -7],
    arid_dry_plateau: [22, 9, -15],
    alpine_mountain_arc: [14, 14, 14],
    maritime_archipelago: [-11, 18, 8],
    open_ocean: [-3, 0, 5]
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
    const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + salt * 59.19) * 43758.5453123;
    return n - Math.floor(n);
  };

  const textureNoise = (p, salt = 0) => {
    const n1 = hashNoise(p.x, p.y, p.z, salt);
    const n2 = hashNoise(p.y + n1, p.z - n1, p.x + n1, salt + 11);
    const n3 = hashNoise(p.z - n2, p.x + n2, p.y - n2, salt + 29);
    return clamp01(n1 * 0.46 + n2 * 0.34 + n3 * 0.20);
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
      contract: "HEARTH_MATERIALS_REFINEMENT_FALLBACK_COMPOSITION",
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
      surfaceAttachment: isLand ? 0.78 : 0.45,
      rimCompression: isLand ? 0.42 : 0.18,
      curvatureLock: 0.72
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
      surfaceAttachment: clamp01(numberField(source, "surfaceAttachment", 0)),
      rimCompression: clamp01(numberField(source, "rimCompression", 0)),
      curvatureLock: clamp01(numberField(source, "curvatureLock", 0.72))
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
    contract: "HEARTH_MATERIALS_REFINEMENT_FALLBACK_TECTONICS",
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
    contract: "HEARTH_MATERIALS_REFINEMENT_FALLBACK_HYDROLOGY",
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

      color = mixColor(color, continentBase, clamp01(composition.continentPotential * 0.36));
      color = mixColor(color, climateBase, clamp01(numberField(composition, "climatePotential", 0.26) * 0.26));
    }

    if (isWater) {
      const depth = clamp01(composition.waterDepthPotential);
      const shelf = clamp01(Math.max(composition.continentShelfPotential, composition.shelfPotential));

      if (terrainClass === "deep_ocean") {
        color = mixColor(color, [4, 12, 24], clamp01(depth * 0.48));
      } else if (terrainClass === "ocean_basin") {
        color = mixColor(color, [7, 22, 38], 0.58);
      } else if (terrainClass === "continental_shelf" || terrainClass === "coastal_shelf") {
        color = mixColor(color, [31, 58, 56], clamp01(0.30 + shelf * 0.18));
      } else if (terrainClass === "archipelago_shelf") {
        color = mixColor(color, [31, 63, 56], clamp01(0.30 + shelf * 0.18));
      } else if (terrainClass === "continent_divide") {
        color = mixColor(color, [7, 24, 34], 0.70);
      } else if (terrainClass === "shallow_water") {
        color = mixColor(color, [31, 65, 64], 0.40);
      }
    }

    return color;
  };

  const computeRefinedAgedTechFeeds = (composition, tectonics, hydrology, isLand, isWater) => {
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
    const depth = clamp01(Math.max(composition.waterDepthPotential, hydrology.oceanDepth, hydrology.materialWaterFeed));

    const boundaryBase = clamp01(
      coast * 0.24 +
      shelf * 0.16 +
      divide * 0.13 +
      arch * 0.13 +
      drainage * 0.10 +
      cliff * 0.09 +
      naturalization * 0.09 +
      roughness * 0.06
    );

    const agedCoastalTechFeed = clamp01(
      boundaryBase * 0.62 +
      roughness * 0.10 +
      tectonics.materialShadowFeed * 0.10 +
      hydrology.materialShoreFeed * 0.10 +
      naturalization * 0.08
    );

    const carvedCoastFeed = clamp01(
      coast * 0.22 +
      cliff * 0.18 +
      canyon * 0.15 +
      divide * 0.13 +
      hydrology.inletPotential * 0.10 +
      hydrology.bayPotential * 0.07 +
      roughness * 0.10
    );

    const weatheredInfrastructureFeed = clamp01(
      agedCoastalTechFeed * 0.24 +
      naturalization * 0.24 +
      roughness * 0.16 +
      wetland * 0.11 +
      tectonics.materialShadowFeed * 0.13 +
      tectonics.materialDensityFeed * 0.12
    );

    const ancientChannelFeed = clamp01(
      divide * 0.18 +
      arch * 0.16 +
      drainage * 0.18 +
      canyon * 0.14 +
      hydrology.straitPotential * 0.13 +
      hydrology.inletPotential * 0.10 +
      hydrology.archipelagoChannelPotential * 0.11
    );

    const erodedHarborFeed = clamp01(
      hydrology.bayPotential * 0.22 +
      hydrology.inletPotential * 0.18 +
      hydrology.estuaryPotential * 0.14 +
      coast * 0.13 +
      shelf * 0.11 +
      naturalization * 0.12 +
      wetland * 0.10
    );

    const mineralizedCutFeed = clamp01(
      cliff * 0.16 +
      canyon * 0.14 +
      shelf * 0.14 +
      coast * 0.13 +
      tectonics.shelfDropPressure * 0.12 +
      tectonics.continentEdgeCompression * 0.10 +
      roughness * 0.11 +
      agedCoastalTechFeed * 0.10
    );

    const reclaimedStructureFeed = clamp01(
      weatheredInfrastructureFeed * 0.26 +
      wetland * 0.18 +
      naturalization * 0.22 +
      hydrology.materialWetlandFeed * 0.14 +
      hydrology.materialRiverFeed * 0.10 +
      isLand * composition.landPotential * 0.10
    );

    const oldDrainageGateFeed = clamp01(
      drainage * 0.22 +
      hydrology.riverPotential * 0.17 +
      hydrology.estuaryPotential * 0.15 +
      hydrology.deltaPotential * 0.13 +
      waterfall * 0.11 +
      canyon * 0.10 +
      coast * 0.12
    );

    const submergedWorksFeed = clamp01(
      isWater * (
        shelf * 0.26 +
        arch * 0.16 +
        divide * 0.13 +
        hydrology.materialWaterFeed * 0.14 +
        depth * 0.13 +
        weatheredInfrastructureFeed * 0.18
      )
    );

    const artificialNaturalBlend = clamp01(
      agedCoastalTechFeed * 0.28 +
      naturalization * 0.25 +
      reclaimedStructureFeed * 0.18 +
      mineralizedCutFeed * 0.11 +
      submergedWorksFeed * 0.10 +
      oldDrainageGateFeed * 0.08
    );

    const submergedShadowBand = clamp01(
      submergedWorksFeed * 0.30 +
      shelf * 0.20 +
      depth * 0.16 +
      divide * 0.10 +
      arch * 0.08 +
      weatheredInfrastructureFeed * 0.10 +
      artificialNaturalBlend * 0.06
    );

    const weatheredCutBand = clamp01(
      carvedCoastFeed * 0.24 +
      mineralizedCutFeed * 0.22 +
      ancientChannelFeed * 0.16 +
      erodedHarborFeed * 0.12 +
      oldDrainageGateFeed * 0.10 +
      roughness * 0.08 +
      agedCoastalTechFeed * 0.08
    );

    const reclaimedSurfaceBand = clamp01(
      reclaimedStructureFeed * 0.26 +
      artificialNaturalBlend * 0.22 +
      naturalization * 0.18 +
      weatheredInfrastructureFeed * 0.16 +
      wetland * 0.10 +
      hydrology.shorelineSoftness * 0.08
    );

    const beadSuppression = clamp01(
      artificialNaturalBlend * 0.28 +
      weatheredInfrastructureFeed * 0.24 +
      reclaimedSurfaceBand * 0.18 +
      submergedShadowBand * 0.14 +
      naturalization * 0.10 +
      roughness * 0.06
    );

    const greenGlowSuppression = clamp01(
      weatheredInfrastructureFeed * 0.28 +
      artificialNaturalBlend * 0.22 +
      submergedShadowBand * 0.16 +
      mineralizedCutFeed * 0.12 +
      reclaimedSurfaceBand * 0.12 +
      depth * 0.10
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
      artificialNaturalBlend,
      submergedShadowBand,
      weatheredCutBand,
      reclaimedSurfaceBand,
      beadSuppression,
      greenGlowSuppression
    };
  };

  const applyOceanMaterial = (rgb, composition, tectonics, hydrology, feeds, noise) => {
    const terrainClass = terrainClassFor(composition);
    const depth = clamp01(Math.max(composition.waterDepthPotential, composition.oceanBasinPotential, hydrology.oceanDepth));
    const shelf = clamp01(Math.max(composition.continentShelfPotential, composition.shelfPotential, hydrology.shelfGradient));
    let c = rgb.slice();

    c = scaleColor(c, 1.025 + noise * 0.025);

    if (terrainClass === "deep_ocean") {
      c = mixColor(c, [4, 11, 23], clamp01(depth * 0.52));
    }

    if (terrainClass === "ocean_basin") {
      c = mixColor(c, [7, 22, 38], 0.50);
      c = addColor(c, [1, 3, 5], noise * 0.18);
    }

    if (terrainClass === "continent_divide") {
      c = mixColor(c, [7, 23, 31], clamp01(0.56 + feeds.ancientChannelFeed * 0.16));
      c = mixColor(c, [20, 31, 28], clamp01(feeds.submergedShadowBand * 0.10));
      c = addColor(c, [4, 3, -2], feeds.mineralizedCutFeed * 0.07);
    }

    if (terrainClass === "continental_shelf" || terrainClass === "coastal_shelf") {
      c = mixColor(c, [30, 56, 54], clamp01(0.32 + shelf * 0.18));
      c = mixColor(c, [33, 45, 39], clamp01(feeds.submergedShadowBand * 0.16));
      c = mixColor(c, [45, 50, 39], clamp01(feeds.weatheredCutBand * 0.08));
      c = addColor(c, [5, 3, -3], feeds.mineralizedCutFeed * 0.08);
    }

    if (terrainClass === "archipelago_shelf" || hydrology.waterBoundaryClass === "archipelago_channel") {
      c = mixColor(c, [30, 62, 54], clamp01(0.28 + shelf * 0.16 + hydrology.archipelagoChannelPotential * 0.12));
      c = mixColor(c, [37, 48, 39], clamp01(feeds.submergedWorksFeed * 0.14));
      c = mixColor(c, [24, 39, 38], clamp01(feeds.beadSuppression * 0.08));
    }

    if (terrainClass === "shallow_water") {
      c = mixColor(c, [30, 61, 59], clamp01(0.26 + shelf * 0.14));
      c = mixColor(c, [35, 47, 41], clamp01(feeds.weatheredInfrastructureFeed * 0.10));
    }

    c = mixColor(c, [3, 9, 20], clamp01(depth * 0.13 + feeds.submergedShadowBand * 0.10));
    c = mixColor(c, [21, 34, 33], clamp01(feeds.greenGlowSuppression * 0.08));
    c = addColor(c, [4, 3, -3], clamp01(feeds.weatheredCutBand * 0.05));

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

    c = mixColor(c, CONTINENT_BASE[continentId] || TERRAIN_PALETTE.continent_mass, clamp01(composition.continentPotential * 0.34));
    c = addColor(c, climateBias, clamp01(0.12 + numberField(composition, "climatePotential", 0.18) * 0.18));
    c = addColor(c, [
      Math.round((noise - 0.50) * 12),
      Math.round((noise - 0.50) * 12),
      Math.round((noise - 0.50) * 9)
    ], 0.64);

    if (terrainClass === "continent_mass" || terrainClass === "raised_land") {
      c = addColor(c, [7, 7, 2], clamp01(mass * 0.25 + density * 0.16));
    }

    if (terrainClass === "coast_edge" || shore > 0.34) {
      c = mixColor(c, [66, 70, 54], clamp01(0.20 + shore * 0.20));
      c = mixColor(c, [45, 52, 47], clamp01(feeds.submergedShadowBand * 0.16));
      c = mixColor(c, [73, 70, 52], clamp01(feeds.weatheredCutBand * 0.10));
      c = mixColor(c, [53, 61, 51], clamp01(feeds.reclaimedSurfaceBand * 0.12));
      c = addColor(c, [8, 5, -4], clamp01(feeds.mineralizedCutFeed * 0.08));
    }

    if (terrainClass === "plateau_interior" || climateClass === "arid_dry_plateau") {
      c = mixColor(c, [126, 101, 63], clamp01(0.20 + composition.plateauPotential * 0.24));
    }

    if (terrainClass === "basin_floor" || climateClass === "rainforest_wet_basin" || climateClass === "monsoon_floodplain") {
      c = mixColor(c, [55, 86, 52], clamp01(0.18 + composition.basinPotential * 0.26 + wetland * 0.14));
      c = mixColor(c, [47, 68, 48], clamp01(wetland * 0.12 + feeds.reclaimedSurfaceBand * 0.08));
    }

    if (terrainClass === "mountain_arc" || terrainClass === "alpine_ridge" || climateClass === "alpine_mountain_arc") {
      c = mixColor(c, [109, 108, 98], clamp01(0.18 + tectonics.ridgeUplift * 0.24 + relief * 0.14));
      c = mixColor(c, [58, 58, 55], clamp01(tectonics.materialShadowFeed * 0.08));
    }

    if (terrainClass === "canyon_corridor") {
      c = mixColor(c, [75, 51, 40], clamp01(0.30 + tectonics.canyonCutPressure * 0.22));
      c = mixColor(c, [44, 35, 30], clamp01(tectonics.materialShadowFeed * 0.10 + feeds.carvedCoastFeed * 0.08));
    }

    if (terrainClass === "cliff_escarpment") {
      c = mixColor(c, [61, 58, 54], clamp01(0.30 + tectonics.cliffPressure * 0.22));
      c = mixColor(c, [42, 44, 40], clamp01(feeds.carvedCoastFeed * 0.13 + feeds.submergedShadowBand * 0.09));
    }

    if (terrainClass === "waterfall_escarpment" || hydrology.coastBoundaryClass === "waterfall_drainage_edge") {
      c = mixColor(c, [84, 98, 91], clamp01(0.24 + hydrology.waterfallFlowPotential * 0.20));
      c = mixColor(c, [52, 62, 56], clamp01(feeds.oldDrainageGateFeed * 0.14));
      c = addColor(c, [5, 6, 3], clamp01(feeds.mineralizedCutFeed * 0.06));
    }

    if (terrainClass === "island_arc" || climateClass === "maritime_archipelago") {
      c = mixColor(c, [68, 104, 75], clamp01(0.16 + composition.archipelagoPotential * 0.20 + hydrology.archipelagoChannelPotential * 0.14));
      c = mixColor(c, [48, 60, 50], clamp01(feeds.submergedWorksFeed * 0.12));
      c = addColor(c, [5, 4, -4], clamp01(feeds.weatheredCutBand * 0.07));
    }

    if (terrainClass === "polar_icefield") {
      c = mixColor(c, [143, 160, 160], 0.56);
    }

    if (terrainClass === "tundra_subpolar") {
      c = mixColor(c, [97, 112, 94], 0.42);
    }

    if (terrainClass === "temperate_coastal_storm" || hydrology.coastBoundaryClass === "storm_coast_boundary") {
      c = mixColor(c, [48, 70, 67], 0.38);
      c = mixColor(c, [42, 48, 43], clamp01(feeds.weatheredInfrastructureFeed * 0.14));
    }

    if (river > 0.18) {
      c = mixColor(c, [45, 75, 62], clamp01(river * 0.10));
      c = mixColor(c, [39, 52, 47], clamp01(feeds.oldDrainageGateFeed * 0.08));
    }

    if (feeds.agedCoastalTechFeed > 0.18) {
      c = mixColor(c, [58, 64, 52], clamp01(feeds.weatheredInfrastructureFeed * 0.12));
      c = mixColor(c, [70, 67, 51], clamp01(feeds.weatheredCutBand * 0.10));
      c = mixColor(c, [42, 50, 45], clamp01(feeds.submergedShadowBand * 0.12));
      c = addColor(c, [7, 5, -4], clamp01(feeds.mineralizedCutFeed * 0.07));
    }

    if (feeds.beadSuppression > 0.20) {
      c = mixColor(c, [49, 56, 49], clamp01(feeds.beadSuppression * 0.08));
    }

    if (composition.summitClass && composition.summitClass !== "none" && composition.summitPotential > 0.52) {
      c = mixColor(c, [121, 115, 86], clamp01((composition.summitPotential - 0.48) * 0.20));
    }

    const bodyLift = clamp(
      1.035 +
        mass * 0.09 +
        density * 0.06 +
        relief * 0.03 -
        shore * 0.018 -
        feeds.greenGlowSuppression * 0.015,
      0.93,
      1.18
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

    const terrainRelief = clamp01(
      relief * 0.40 +
      ridge * 0.18 +
      tectonics.canyonCutPressure * 0.14 +
      tectonics.cliffPressure * 0.12 +
      tectonics.waterfallDropPressure * 0.08 +
      feeds.weatheredCutBand * 0.08
    );

    const ridgeRelief = clamp01(
      ridge * 0.40 +
      relief * 0.16 +
      tectonics.ridgeUplift * 0.18 +
      composition.summitPotential * 0.08
    );

    const basinShade = clamp01(
      basin * 0.32 +
      depth * 0.18 +
      hydrology.materialWetlandFeed * 0.14 +
      feeds.submergedShadowBand * 0.10 +
      (terrainClass === "basin_floor" ? 0.20 : 0)
    );

    const shorelineGrounding = clamp01(
      coast * 0.26 +
      shelf * 0.16 +
      hydrology.coastNaturalizationFeed * 0.20 +
      feeds.carvedCoastFeed * 0.12 +
      feeds.reclaimedStructureFeed * 0.12 +
      feeds.submergedShadowBand * 0.08
    );

    const shelfTransition = clamp01(
      shelf * 0.30 +
      hydrology.coastalBlendWidth * 0.16 +
      hydrology.shorelineSoftness * 0.12 +
      feeds.submergedWorksFeed * 0.12 +
      feeds.ancientChannelFeed * 0.08 +
      feeds.submergedShadowBand * 0.10
    );

    const contactShadow = clamp01(
      shadow * 0.26 +
      tectonics.cliffPressure * 0.13 +
      tectonics.canyonCutPressure * 0.11 +
      shorelineGrounding * 0.12 +
      feeds.weatheredInfrastructureFeed * 0.12 +
      feeds.mineralizedCutFeed * 0.08 +
      feeds.submergedShadowBand * 0.10
    );

    const landDensity = isLand
      ? clamp01(0.51 + mass * 0.17 + density * 0.13 + terrainRelief * 0.08 + feeds.weatheredCutBand * 0.03)
      : 0;

    const waterDepthShade = isWater
      ? clamp01(depth * 0.54 + basinShade * 0.18 + hydrology.materialWaterFeed * 0.10 + feeds.submergedShadowBand * 0.10)
      : 0;

    return {
      alpha: 1,
      isLand,
      isWater,

      landDensity,
      shorelineGrounding,
      contactShadow,
      underlandOcclusion: clamp01(shadow * 0.34 + shorelineGrounding * 0.22 + shelf * 0.10 + feeds.reclaimedStructureFeed * 0.08 + feeds.submergedShadowBand * 0.08),
      shelfTransition,
      terrainRelief,
      ridgeRelief,
      basinShade,
      rimDarkening: clamp01(composition.rimCompression * 0.26 + terrainRelief * 0.10 + depth * 0.08),
      rimCompression: clamp01(composition.rimCompression * 0.48 + mass * 0.12 + relief * 0.08),
      atmosphereSeparation: isLand
        ? clamp01(0.43 + mass * 0.17 + terrainRelief * 0.08)
        : clamp01(0.12 + depth * 0.10),
      surfaceAttachment: clamp01(composition.surfaceAttachment * 0.60 + mass * 0.16 + shorelineGrounding * 0.08),
      curvatureLock: clamp01(composition.curvatureLock),
      waterDepthShade,
      bridgePotential: clamp01(numberField(composition, "bridgePotential", 0) * 0.28 + composition.scarPotential * 0.14 + feeds.ancientChannelFeed * 0.09)
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

    const noiseA = textureNoise(p, terrainClass.length + (numberField(composition, "continentIndex", 0) + 23));
    const noiseB = textureNoise({ x: p.y, y: p.z, z: p.x }, 67);
    const materialNoise = clamp01(noiseA * 0.58 + noiseB * 0.42);

    const feeds = computeRefinedAgedTechFeeds(composition, tectonics, hydrology, isLand ? 1 : 0, isWater ? 1 : 0);

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

      elevation: composition.elevation,
      landPotential: composition.landPotential,
      coastPotential: composition.coastPotential,
      waterDepthPotential: composition.waterDepthPotential,
      oceanBasinPotential: composition.oceanBasinPotential,
      continentShelfPotential: composition.continentShelfPotential,
      shelfPotential: composition.shelfPotential,

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
      summitPotential: composition.summitPotential,

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

      submergedShadowBand: feeds.submergedShadowBand,
      weatheredCutBand: feeds.weatheredCutBand,
      reclaimedSurfaceBand: feeds.reclaimedSurfaceBand,
      beadSuppression: feeds.beadSuppression,
      greenGlowSuppression: feeds.greenGlowSuppression,

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
    canvas.dataset.hearthMaterialsAgedCoastalTechRefinement = "true";
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
    purpose: "aged-tech-coastal-boundary-material-refinement",
    supportsExpandedHearthTerrain: true,
    supportsSevenContinentNineClimateTerrain: true,
    supportsSevenClimateTerrainClasses: true,
    supportsSevenContinentRealPlanetMaterials: true,
    supportsAgedTechCoastalBoundaryMaterials: true,
    supportsHydrologyBoundaryConsumer: true,
    supportsAgedTechCoastalBoundaryRefinement: true,
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
      "artificialNaturalBlend",
      "submergedShadowBand",
      "weatheredCutBand",
      "reclaimedSurfaceBand",
      "beadSuppression",
      "greenGlowSuppression"
    ],
    designRules: [
      "coastal evidence remains visible",
      "green bead behavior is reduced",
      "coastal traces become mineralized and weathered",
      "old channels become carved and submerged",
      "technology reads through age and material, not glow",
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
    supportsAgedTechCoastalBoundaryRefinement: true,
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
  root.HEARTH_MATERIALS_SUPPORTS_AGED_TECH_COASTAL_BOUNDARY_REFINEMENT = true;

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
    root.document.documentElement.dataset.hearthMaterialsSupportsAgedTechCoastalBoundaryRefinement = "true";
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

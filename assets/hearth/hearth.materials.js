// /assets/hearth/hearth.materials.js
// HEARTH_SUBMERGED_PORT_BASIN_WATERLINE_MATERIALS_TNT_v1
// Full-file replacement.
// Materials authority only.
// Purpose:
// - Consume composition + tectonics + hydrology.
// - Preserve public materials API and atlas continuity.
// - Consume sea-level / waterline hydrology fields.
// - Render water fill, shallow shelves, beach/sand shelves, wet stone, cliff-water edge, submerged blocks, submerged scars, and implied port-basin material.
// Does not own:
// - elevation generation
// - composition classification
// - tectonic pressure generation
// - hydrology classification
// - canvas drawing authority
// - runtime motion
// - controls
// - route orchestration
// - teleports
// - clickable coastal objects
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_SUBMERGED_PORT_BASIN_WATERLINE_MATERIALS_TNT_v1";
  const RECEIPT = "HEARTH_SUBMERGED_PORT_BASIN_WATERLINE_MATERIALS_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_COASTAL_SCAR_ATLAS_CONTINUITY_TNT_v4";
  const BASELINE_CONTRACT = "HEARTH_SEA_LEVEL_WATERLINE_BEACH_BOUNDARY_HYDROLOGY_TNT_v1";
  const VERSION = "2026-05-28.hearth-submerged-port-basin-waterline-materials-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const DEG = Math.PI / 180;

  const TERRAIN_CLASSES = [
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
    continental_shelf: "water.shelf.waterline.submerged-block-transition",
    archipelago_shelf: "water.shelf.archipelago.submerged-port-channel",
    continent_divide: "water.divide.carved-strait-submerged-scar",
    shallow_water: "water.shallow.shelf.beach-wetstone-transition",
    coast_edge: "coast.waterline.wetstone.beach-hardedge",
    continent_mass: "land.continent.embodied.mass",
    raised_land: "land.raised.general",
    plateau_interior: "land.plateau.dense.interior",
    basin_floor: "land.basin.lowland.waterfill-candidate",
    mountain_arc: "land.mountain.arc.relief",
    alpine_ridge: "land.alpine.ridge.coldstone",
    canyon_corridor: "land.canyon.corridor.submerged-scar-feed",
    cliff_escarpment: "land.cliff.water-edge-hard-contact",
    waterfall_escarpment: "land.waterfall.wetstone-drainage-edge",
    island_arc: "land.island.arc.submerged-channel-shelf",
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
    waterFill: [8, 25, 36],
    shallowShelf: [27, 55, 54],
    mutedShelf: [30, 51, 48],
    beachShelf: [104, 92, 64],
    sandStone: [116, 101, 68],
    wetStone: [43, 53, 49],
    hardCoast: [36, 42, 40],
    cliffEdge: [34, 37, 36],
    submergedBlock: [24, 34, 35],
    submergedScar: [30, 39, 36],
    mineralTrace: [66, 62, 48],
    landBase: [104, 99, 64],
    raisedLand: [99, 99, 64],
    basinLand: [59, 82, 52],
    mountain: [102, 101, 91],
    darkGreen: [47, 62, 50],
    oldStone: [68, 68, 54],
    portBasin: [16, 26, 30]
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

    if (args.length >= 3) return normalize3({ x: args[0], y: args[1], z: args[2] });
    if (args.length >= 2) return lonLatToVector(Number(args[0]), Number(args[1]));
    return lonLatToVector(0, 0);
  };

  const hashNoise = (x, y, z, salt = 0) => {
    const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + salt * 71.37) * 43758.5453123;
    return n - Math.floor(n);
  };

  const textureNoise = (p, salt = 0) => {
    const n1 = hashNoise(p.x, p.y, p.z, salt);
    const n2 = hashNoise(p.y + n1, p.z - n1, p.x + n1, salt + 13);
    const n3 = hashNoise(p.z - n2, p.x + n2, p.y - n2, salt + 31);
    return clamp01(n1 * 0.44 + n2 * 0.34 + n3 * 0.22);
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
    const landSignal = smoothstep(0.06, 0.80, p.z) * (0.56 + n * 0.44);
    const isLand = landSignal > 0.46;

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
      climateClass: isLand ? "temperate_highland" : "open_ocean",
      summitClass: "none",
      summitRegionHint: "none",
      summitTerrainHint: "none",
      summitPotential: 0,
      elevation: isLand ? 0.20 : -0.44,
      isLand,
      isWater: !isLand,
      isShallowWater: !isLand && n > 0.64,
      isDeepWater: !isLand && n <= 0.64,
      landPotential: isLand ? 0.72 : 0,
      waterDepthPotential: isLand ? 0 : 0.58,
      oceanBasinPotential: isLand ? 0 : 0.62,
      continentShelfPotential: isLand ? 0.10 : 0.20,
      shelfPotential: isLand ? 0.08 : 0.20,
      coastPotential: isLand ? 0.16 : 0.04,
      continentPotential: isLand ? 0.72 : 0,
      continentSeparation: 0.06,
      mountainArcPotential: 0.10,
      plateauPotential: isLand ? 0.24 : 0,
      canyonPotential: 0.04,
      escarpmentPotential: 0.06,
      waterfallCandidate: 0,
      archipelagoPotential: 0,
      basinPotential: 0.12,
      ridgePotential: 0.10,
      saddlePotential: 0.06,
      islandPotential: 0,
      scarPotential: 0.04,
      massAnchor: isLand ? 0.68 : 0,
      shorelineContact: isLand ? 0.12 : 0.02,
      shelfDrop: 0.08,
      underlandShadow: 0.08,
      reliefStrength: isLand ? 0.22 : 0,
      slopePressure: 0.08,
      materialDensity: isLand ? 0.68 : 0,
      surfaceAttachment: isLand ? 0.72 : 0.42,
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
    contract: "HEARTH_MATERIALS_FALLBACK_TECTONICS",
    receipt: "FALLBACK_TECTONICS_USED",
    tectonicClass: composition.isWater ? "open_ocean_basin" : "stable_continental_craton",
    plateClass: composition.isWater ? "oceanic_basin_plate" : "continental_plate",
    platePressure: composition.isLand ? 0.42 : 0.18,
    continentalBodyPressure: composition.isLand ? 0.58 : 0,
    continentEdgeCompression: composition.coastPotential * 0.44,
    continentDivideStress: composition.continentSeparation * 0.44,
    canyonCutPressure: composition.canyonPotential * 0.52,
    faultCutPressure: composition.scarPotential * 0.48,
    faultLinePressure: composition.scarPotential * 0.38,
    fractureDensity: composition.scarPotential * 0.18 + composition.archipelagoPotential * 0.22,
    scarPressure: composition.scarPotential * 0.38,
    cliffPressure: composition.escarpmentPotential * 0.52,
    escarpmentPressure: composition.escarpmentPotential * 0.58,
    shelfDropPressure: Math.max(composition.shelfDrop, composition.shelfPotential) * 0.48,
    coastalCompression: composition.coastPotential * 0.42,
    basinCompression: composition.basinPotential * 0.38,
    basinSubsidence: composition.basinPotential * 0.52,
    lowlandStress: composition.basinPotential * 0.40,
    archipelagoFracture: composition.archipelagoPotential * 0.58,
    islandArcPressure: composition.islandPotential * 0.52,
    brokenShelfStress: composition.archipelagoPotential * 0.40,
    summitTectonicPressure: composition.summitPotential * 0.40,
    summitTectonicClass: "none",
    hydrologyFeedPressure: Math.max(composition.coastPotential, composition.shelfPotential, composition.basinPotential) * 0.48,
    waterfallDropPressure: composition.waterfallCandidate * 0.56,
    drainageCutPotential: Math.max(composition.canyonPotential, composition.basinPotential) * 0.42,
    materialBodyFeed: composition.massAnchor * 0.44,
    materialReliefFeed: composition.reliefStrength * 0.44,
    materialShadowFeed: composition.underlandShadow * 0.44,
    materialDensityFeed: composition.materialDensity * 0.44
  });

  const normalizeTectonics = (raw, composition) => {
    const source = raw && typeof raw === "object" ? raw : fallbackTectonics(composition);

    return {
      ...source,
      tectonicClass: stringField(source, "tectonicClass", composition.isWater ? "open_ocean_basin" : "stable_continental_craton"),
      plateClass: stringField(source, "plateClass", composition.isWater ? "oceanic_basin_plate" : "continental_plate"),
      platePressure: clamp01(numberField(source, "platePressure", 0)),
      continentalBodyPressure: clamp01(numberField(source, "continentalBodyPressure", 0)),
      continentEdgeCompression: clamp01(numberField(source, "continentEdgeCompression", 0)),
      continentDivideStress: clamp01(numberField(source, "continentDivideStress", 0)),
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
      summitTectonicPressure: clamp01(numberField(source, "summitTectonicPressure", 0)),
      summitTectonicClass: stringField(source, "summitTectonicClass", "none"),
      hydrologyFeedPressure: clamp01(numberField(source, "hydrologyFeedPressure", 0)),
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

  const fallbackHydrology = (composition, tectonics) => {
    const elevation = numberField(composition, "elevation", composition.isWater ? -0.28 : 0.18);
    const waterFillStrength = clamp01(
      (elevation < 0 ? 0.48 : 0) +
      composition.waterDepthPotential * 0.30 +
      composition.oceanBasinPotential * 0.18 +
      composition.shelfPotential * 0.12 +
      composition.coastPotential * 0.08
    );
    const waterDepth = clamp01(Math.max(0, -elevation) * 1.60 + composition.waterDepthPotential * 0.34);

    return {
      contract: "HEARTH_MATERIALS_FALLBACK_HYDROLOGY",
      receipt: "FALLBACK_HYDROLOGY_USED",
      hydrologyClass: composition.isWater ? "open_ocean_basin" : "coastal_transition_zone",
      waterBoundaryClass: composition.isWater ? "open_ocean_basin" : "none",
      coastBoundaryClass: composition.coastPotential > 0.24 ? "coastal_transition_zone" : "none",
      shorelineType: "coastal_transition",
      shelfType: composition.shelfPotential > 0.2 ? "continental_shelf_gradient" : "none",
      basinType: composition.isWater ? "open_ocean_basin" : "none",
      drainageType: "none",
      waterPresence: waterFillStrength,
      surfaceWaterPotential: waterFillStrength,
      subsurfaceWaterPotential: composition.basinPotential * 0.30,
      oceanContinuity: composition.oceanBasinPotential * 0.58,
      oceanDepth: waterDepth,
      shelfGradient: Math.max(composition.continentShelfPotential, composition.shelfPotential) * 0.70,
      shorelineSoftness: Math.max(composition.coastPotential, composition.shorelineContact) * 0.55,
      shorelineRoughness: Math.max(tectonics.cliffPressure, tectonics.fractureDensity) * 0.48,
      coastalBlendWidth: Math.max(composition.coastPotential, composition.shelfPotential) * 0.46,
      riverPotential: tectonics.drainageCutPotential * 0.36,
      drainagePotential: tectonics.drainageCutPotential * 0.46,
      deltaPotential: tectonics.basinSubsidence * 0.30,
      estuaryPotential: tectonics.drainageCutPotential * 0.28,
      wetlandPotential: tectonics.basinSubsidence * 0.36,
      marshPotential: tectonics.basinSubsidence * 0.28,
      floodplainPotential: tectonics.basinSubsidence * 0.30,
      waterfallFlowPotential: tectonics.waterfallDropPressure * 0.46,
      canyonOutflowPotential: tectonics.canyonCutPressure * 0.46,
      fjordCutPotential: 0,
      stormSurgePotential: tectonics.coastalCompression * 0.30,
      reefShelfPotential: composition.archipelagoPotential * 0.28,
      archipelagoChannelPotential: tectonics.archipelagoFracture * 0.50,
      islandWaterGap: tectonics.islandArcPressure * 0.42,
      straitPotential: tectonics.continentDivideStress * 0.48,
      bayPotential: composition.coastPotential * 0.24,
      inletPotential: tectonics.drainageCutPotential * 0.24,
      peninsulaEdgePotential: composition.coastPotential * 0.20,
      coastNaturalizationFeed: Math.max(composition.coastPotential, composition.shelfPotential) * 0.46,
      materialWaterFeed: waterFillStrength,
      materialShelfFeed: Math.max(composition.continentShelfPotential, composition.shelfPotential) * 0.52,
      materialShoreFeed: composition.coastPotential * 0.52,
      materialWetlandFeed: tectonics.basinSubsidence * 0.34,
      materialRiverFeed: tectonics.drainageCutPotential * 0.38,
      seaLevel: 0,
      relativeSeaElevation: elevation,
      belowSeaLevel: elevation < 0,
      nearSeaLevel: Math.abs(elevation) < 0.18,
      aboveSeaLevel: elevation > 0,
      belowSeaLevelStrength: clamp01((-elevation + 0.05) / 0.35),
      nearSeaLevelStrength: clamp01(1 - Math.abs(elevation) / 0.22),
      aboveSeaLevelStrength: clamp01((elevation + 0.04) / 0.34),
      waterFill: waterFillStrength > 0.40,
      waterFillStrength,
      waterDepth,
      waterDepthClass: waterDepth > 0.68 ? "deep" : waterDepth > 0.36 ? "mid" : waterFillStrength > 0.34 ? "shallow" : "dry",
      waterlineBoundary: composition.coastPotential > 0.22,
      waterlineBoundaryStrength: clamp01(composition.coastPotential * 0.42 + composition.shelfPotential * 0.22 + composition.shorelineContact * 0.18),
      shallowShelf: composition.shelfPotential > 0.28,
      shallowShelfStrength: clamp01(composition.shelfPotential * 0.42 + composition.continentShelfPotential * 0.28),
      beachCandidate: composition.coastPotential > 0.30 && tectonics.cliffPressure < 0.40,
      beachStrength: clamp01(composition.coastPotential * 0.24 + composition.shelfPotential * 0.24 + (1 - tectonics.cliffPressure) * 0.12),
      sandShelf: composition.shelfPotential > 0.32,
      sandShelfStrength: clamp01(composition.shelfPotential * 0.32 + composition.coastPotential * 0.16),
      hardCoastCandidate: tectonics.cliffPressure > 0.38,
      hardCoastStrength: clamp01(tectonics.cliffPressure * 0.36 + tectonics.shelfDropPressure * 0.18),
      cliffWaterEdge: tectonics.cliffPressure > 0.44,
      cliffWaterEdgeStrength: clamp01(tectonics.cliffPressure * 0.38 + tectonics.escarpmentPressure * 0.20),
      submergedBlock: waterFillStrength > 0.36 && composition.scarPotential > 0.16,
      submergedBlockStrength: clamp01(waterFillStrength * 0.30 + composition.scarPotential * 0.18 + tectonics.fractureDensity * 0.12),
      submergedScar: waterFillStrength > 0.34 && (composition.scarPotential > 0.14 || tectonics.faultCutPressure > 0.16),
      submergedScarStrength: clamp01(waterFillStrength * 0.22 + composition.scarPotential * 0.18 + tectonics.faultCutPressure * 0.12),
      wetStoneEdge: composition.coastPotential > 0.24 && tectonics.cliffPressure > 0.20,
      wetStoneStrength: clamp01(composition.coastPotential * 0.18 + tectonics.cliffPressure * 0.20 + tectonics.shelfDropPressure * 0.14),
      oldCoastalTechSubmerged: waterFillStrength > 0.34 && composition.scarPotential > 0.12,
      oldCoastalTechSubmergedStrength: clamp01(waterFillStrength * 0.20 + composition.scarPotential * 0.22 + tectonics.faultCutPressure * 0.10),
      materialBeachFeed: 0,
      materialSandShelfFeed: 0,
      materialWetStoneFeed: 0,
      materialSubmergedBlockFeed: 0,
      materialSubmergedScarFeed: 0,
      materialCliffWaterEdgeFeed: 0,
      materialWaterlineFeed: 0
    };
  };

  const normalizeHydrology = (raw, composition, tectonics) => {
    const fallback = fallbackHydrology(composition, tectonics);
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

    merged.seaLevel = Number.isFinite(Number(merged.seaLevel)) ? Number(merged.seaLevel) : 0;
    merged.relativeSeaElevation = Number.isFinite(Number(merged.relativeSeaElevation))
      ? Number(merged.relativeSeaElevation)
      : numberField(composition, "elevation", 0);

    merged.hydrologyClass = stringField(merged, "hydrologyClass", fallback.hydrologyClass);
    merged.waterBoundaryClass = stringField(merged, "waterBoundaryClass", fallback.waterBoundaryClass);
    merged.coastBoundaryClass = stringField(merged, "coastBoundaryClass", fallback.coastBoundaryClass);
    merged.shorelineType = stringField(merged, "shorelineType", fallback.shorelineType);
    merged.shelfType = stringField(merged, "shelfType", fallback.shelfType);
    merged.basinType = stringField(merged, "basinType", fallback.basinType);
    merged.drainageType = stringField(merged, "drainageType", fallback.drainageType);
    merged.waterDepthClass = stringField(merged, "waterDepthClass", fallback.waterDepthClass);

    merged.belowSeaLevel = boolField(merged, "belowSeaLevel", merged.belowSeaLevelStrength > 0.38);
    merged.nearSeaLevel = boolField(merged, "nearSeaLevel", merged.nearSeaLevelStrength > 0.34);
    merged.aboveSeaLevel = boolField(merged, "aboveSeaLevel", merged.aboveSeaLevelStrength > 0.38);
    merged.waterFill = boolField(merged, "waterFill", merged.waterFillStrength > 0.40);
    merged.waterlineBoundary = boolField(merged, "waterlineBoundary", merged.waterlineBoundaryStrength > 0.34);
    merged.shallowShelf = boolField(merged, "shallowShelf", merged.shallowShelfStrength > 0.34);
    merged.beachCandidate = boolField(merged, "beachCandidate", merged.beachStrength > 0.34);
    merged.sandShelf = boolField(merged, "sandShelf", merged.sandShelfStrength > 0.34);
    merged.hardCoastCandidate = boolField(merged, "hardCoastCandidate", merged.hardCoastStrength > 0.38);
    merged.cliffWaterEdge = boolField(merged, "cliffWaterEdge", merged.cliffWaterEdgeStrength > 0.40);
    merged.submergedBlock = boolField(merged, "submergedBlock", merged.submergedBlockStrength > 0.36);
    merged.submergedScar = boolField(merged, "submergedScar", merged.submergedScarStrength > 0.34);
    merged.wetStoneEdge = boolField(merged, "wetStoneEdge", merged.wetStoneStrength > 0.36);
    merged.oldCoastalTechSubmerged = boolField(merged, "oldCoastalTechSubmerged", merged.oldCoastalTechSubmergedStrength > 0.36);

    return merged;
  };

  const readHydrology = (composition, tectonics, p, originalArgs) => {
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
          return normalizeHydrology(fn.apply(hydrology, originalArgs), composition, tectonics);
        } catch (_error) {
          try {
            return normalizeHydrology(fn.call(hydrology, p), composition, tectonics);
          } catch (_error2) {
            try {
              return normalizeHydrology(fn.call(hydrology, composition), composition, tectonics);
            } catch (_error3) {
              return fallbackHydrology(composition, tectonics);
            }
          }
        }
      }
    }

    return fallbackHydrology(composition, tectonics);
  };

  const terrainClassFor = (composition) => (
    composition.worldTerrainClass ||
    composition.expandedTerrainClass ||
    composition.semanticTerrainClass ||
    composition.terrainClass ||
    composition.compatibilityTerrainClass ||
    "ocean_basin"
  );

  const compatibilityClassFor = (composition) => {
    return composition.compatibilityTerrainClass || composition.terrainClass || "deep_water";
  };

  const baseLandColor = (composition) => {
    const terrainClass = terrainClassFor(composition);

    if (terrainClass === "basin_floor" || composition.climateClass === "rainforest_wet_basin" || composition.climateClass === "monsoon_floodplain") {
      return PALETTE.basinLand.slice();
    }

    if (terrainClass === "mountain_arc" || terrainClass === "alpine_ridge") {
      return PALETTE.mountain.slice();
    }

    if (terrainClass === "cliff_escarpment" || terrainClass === "canyon_corridor") {
      return PALETTE.oldStone.slice();
    }

    if (terrainClass === "raised_land" || terrainClass === "plateau_interior") {
      return PALETTE.raisedLand.slice();
    }

    return PALETTE.landBase.slice();
  };

  const baseWaterColor = (composition, hydrology) => {
    if (hydrology.waterDepthClass === "deep" || terrainClassFor(composition) === "deep_ocean") {
      return PALETTE.deepWater.slice();
    }

    if (hydrology.waterDepthClass === "mid" || terrainClassFor(composition) === "ocean_basin") {
      return PALETTE.ocean.slice();
    }

    if (hydrology.shallowShelf || hydrology.shallowShelfStrength > 0.30) {
      return PALETTE.shallowShelf.slice();
    }

    return PALETTE.waterFill.slice();
  };

  const computeMaterialFeeds = (composition, tectonics, hydrology, isLandBase, isWaterBase) => {
    const coast = clamp01(Math.max(composition.coastPotential, composition.shorelineContact, hydrology.materialShoreFeed, hydrology.materialWaterlineFeed));
    const shelf = clamp01(Math.max(composition.shelfPotential, composition.continentShelfPotential, hydrology.shelfGradient, hydrology.materialShelfFeed));
    const scar = clamp01(Math.max(composition.scarPotential, tectonics.faultCutPressure, tectonics.fractureDensity));
    const channel = clamp01(Math.max(hydrology.straitPotential, hydrology.archipelagoChannelPotential, hydrology.canyonOutflowPotential, hydrology.drainagePotential));
    const harbor = clamp01(Math.max(hydrology.bayPotential, hydrology.inletPotential, hydrology.estuaryPotential));
    const rough = clamp01(Math.max(hydrology.shorelineRoughness, tectonics.cliffPressure, tectonics.escarpmentPressure));
    const soft = clamp01(Math.max(hydrology.shorelineSoftness, hydrology.coastalBlendWidth));
    const waterFillMaterialFeed = clamp01(hydrology.waterFillStrength * 0.66 + hydrology.materialWaterFeed * 0.22 + hydrology.waterDepth * 0.12);
    const waterlineMaterialFeed = clamp01(hydrology.waterlineBoundaryStrength * 0.64 + coast * 0.18 + hydrology.nearSeaLevelStrength * 0.18);
    const beachMaterialFeed = clamp01(hydrology.beachStrength * 0.50 + hydrology.materialBeachFeed * 0.28 + soft * 0.12 - hydrology.hardCoastStrength * 0.18);
    const sandShelfMaterialFeed = clamp01(hydrology.sandShelfStrength * 0.52 + hydrology.materialSandShelfFeed * 0.24 + hydrology.shallowShelfStrength * 0.16);
    const wetStoneMaterialFeed = clamp01(hydrology.wetStoneStrength * 0.48 + hydrology.materialWetStoneFeed * 0.28 + rough * 0.10 + waterlineMaterialFeed * 0.08);
    const hardCoastMaterialFeed = clamp01(hydrology.hardCoastStrength * 0.48 + rough * 0.20 + tectonics.shelfDropPressure * 0.12 + hydrology.materialCliffWaterEdgeFeed * 0.12);
    const cliffWaterEdgeMaterialFeed = clamp01(hydrology.cliffWaterEdgeStrength * 0.52 + hydrology.materialCliffWaterEdgeFeed * 0.26 + tectonics.cliffPressure * 0.14);
    const submergedBlockMaterialFeed = clamp01(hydrology.submergedBlockStrength * 0.52 + hydrology.materialSubmergedBlockFeed * 0.28 + waterFillMaterialFeed * 0.08 + shelf * 0.06);
    const submergedScarMaterialFeed = clamp01(hydrology.submergedScarStrength * 0.50 + hydrology.materialSubmergedScarFeed * 0.26 + hydrology.oldCoastalTechSubmergedStrength * 0.12 + channel * 0.06);
    const oldCoastalTechUnderwaterMaterialFeed = clamp01(
      hydrology.oldCoastalTechSubmergedStrength * 0.44 +
      submergedScarMaterialFeed * 0.20 +
      submergedBlockMaterialFeed * 0.14 +
      scar * 0.12
    );
    const submergedPortBasinMaterialFeed = clamp01(
      waterFillMaterialFeed * 0.18 +
      waterlineMaterialFeed * 0.13 +
      hydrology.shallowShelfStrength * 0.10 +
      submergedBlockMaterialFeed * 0.16 +
      submergedScarMaterialFeed * 0.14 +
      wetStoneMaterialFeed * 0.12 +
      harbor * 0.12 +
      channel * 0.05
    );

    const agedCoastalTechFeed = clamp01(
      coast * 0.16 +
      shelf * 0.12 +
      scar * 0.14 +
      channel * 0.12 +
      submergedScarMaterialFeed * 0.16 +
      oldCoastalTechUnderwaterMaterialFeed * 0.18 +
      wetStoneMaterialFeed * 0.12
    );

    const carvedCoastFeed = clamp01(
      coast * 0.20 +
      rough * 0.15 +
      channel * 0.12 +
      hydrology.cliffWaterEdgeStrength * 0.12 +
      hydrology.wetStoneStrength * 0.10 +
      tectonics.shelfDropPressure * 0.10 +
      scar * 0.10
    );

    const weatheredInfrastructureFeed = clamp01(
      agedCoastalTechFeed * 0.22 +
      wetStoneMaterialFeed * 0.20 +
      submergedBlockMaterialFeed * 0.14 +
      submergedScarMaterialFeed * 0.14 +
      hydrology.coastNaturalizationFeed * 0.14 +
      rough * 0.10
    );

    const ancientChannelFeed = clamp01(
      channel * 0.28 +
      hydrology.straitPotential * 0.16 +
      hydrology.archipelagoChannelPotential * 0.14 +
      hydrology.canyonOutflowPotential * 0.12 +
      submergedScarMaterialFeed * 0.16 +
      tectonics.continentDivideStress * 0.08
    );

    const erodedHarborFeed = clamp01(
      harbor * 0.30 +
      hydrology.bayPotential * 0.14 +
      hydrology.inletPotential * 0.14 +
      hydrology.estuaryPotential * 0.10 +
      submergedPortBasinMaterialFeed * 0.18 +
      wetStoneMaterialFeed * 0.08
    );

    const mineralizedCutFeed = clamp01(
      carvedCoastFeed * 0.24 +
      wetStoneMaterialFeed * 0.18 +
      hardCoastMaterialFeed * 0.16 +
      cliffWaterEdgeMaterialFeed * 0.14 +
      tectonics.cliffPressure * 0.10 +
      tectonics.shelfDropPressure * 0.08
    );

    const reclaimedStructureFeed = clamp01(
      hydrology.coastNaturalizationFeed * 0.18 +
      wetStoneMaterialFeed * 0.18 +
      beachMaterialFeed * 0.10 +
      sandShelfMaterialFeed * 0.10 +
      submergedBlockMaterialFeed * 0.16 +
      weatheredInfrastructureFeed * 0.18
    );

    const oldDrainageGateFeed = clamp01(
      hydrology.drainagePotential * 0.20 +
      hydrology.riverPotential * 0.12 +
      hydrology.estuaryPotential * 0.12 +
      hydrology.waterfallFlowPotential * 0.12 +
      hydrology.canyonOutflowPotential * 0.12 +
      submergedScarMaterialFeed * 0.12 +
      ancientChannelFeed * 0.10
    );

    const submergedWorksFeed = clamp01(
      submergedBlockMaterialFeed * 0.24 +
      submergedScarMaterialFeed * 0.22 +
      oldCoastalTechUnderwaterMaterialFeed * 0.20 +
      waterFillMaterialFeed * 0.12 +
      hydrology.shallowShelfStrength * 0.10 +
      channel * 0.08
    );

    const artificialNaturalBlend = clamp01(
      agedCoastalTechFeed * 0.18 +
      hydrology.coastNaturalizationFeed * 0.16 +
      wetStoneMaterialFeed * 0.14 +
      submergedWorksFeed * 0.14 +
      beachMaterialFeed * 0.08 +
      sandShelfMaterialFeed * 0.08 +
      reclaimedStructureFeed * 0.16
    );

    const submergedShadowBand = clamp01(
      waterFillMaterialFeed * 0.20 +
      hydrology.waterDepth * 0.18 +
      submergedWorksFeed * 0.18 +
      submergedBlockMaterialFeed * 0.14 +
      submergedScarMaterialFeed * 0.12 +
      cliffWaterEdgeMaterialFeed * 0.08
    );

    const weatheredCutBand = clamp01(
      carvedCoastFeed * 0.22 +
      mineralizedCutFeed * 0.18 +
      wetStoneMaterialFeed * 0.14 +
      ancientChannelFeed * 0.14 +
      oldDrainageGateFeed * 0.10 +
      submergedScarMaterialFeed * 0.10
    );

    const reclaimedSurfaceBand = clamp01(
      reclaimedStructureFeed * 0.24 +
      beachMaterialFeed * 0.10 +
      sandShelfMaterialFeed * 0.10 +
      wetStoneMaterialFeed * 0.16 +
      artificialNaturalBlend * 0.18 +
      hydrology.coastNaturalizationFeed * 0.12
    );

    const greenGlowSuppression = clamp01(
      submergedScarMaterialFeed * 0.22 +
      submergedBlockMaterialFeed * 0.18 +
      oldCoastalTechUnderwaterMaterialFeed * 0.18 +
      waterFillMaterialFeed * 0.14 +
      wetStoneMaterialFeed * 0.12 +
      weatheredInfrastructureFeed * 0.10
    );

    const beadSuppression = clamp01(
      greenGlowSuppression * 0.30 +
      artificialNaturalBlend * 0.20 +
      submergedShadowBand * 0.18 +
      submergedScarMaterialFeed * 0.16 +
      reclaimedSurfaceBand * 0.10
    );

    const coastalScarContinuity = clamp01(
      waterlineMaterialFeed * 0.16 +
      submergedScarMaterialFeed * 0.18 +
      carvedCoastFeed * 0.16 +
      ancientChannelFeed * 0.12 +
      wetStoneMaterialFeed * 0.12 +
      coast * 0.10 +
      shelf * 0.08
    );

    const scarBandWidth = clamp01(
      hydrology.shallowShelfStrength * 0.14 +
      hydrology.coastalBlendWidth * 0.12 +
      submergedBlockMaterialFeed * 0.16 +
      submergedScarMaterialFeed * 0.14 +
      wetStoneMaterialFeed * 0.12 +
      waterlineMaterialFeed * 0.10
    );

    const submergedShadowWake = clamp01(
      submergedShadowBand * 0.24 +
      hydrology.waterDepth * 0.18 +
      waterFillMaterialFeed * 0.16 +
      submergedWorksFeed * 0.16 +
      hydrology.materialWaterFeed * 0.10 +
      hydrology.materialShelfFeed * 0.08
    );

    const mineralizedEdgeBody = clamp01(
      mineralizedCutFeed * 0.24 +
      wetStoneMaterialFeed * 0.18 +
      hardCoastMaterialFeed * 0.16 +
      cliffWaterEdgeMaterialFeed * 0.14 +
      coastalScarContinuity * 0.10
    );

    const reclaimedEdgeBlend = clamp01(
      reclaimedStructureFeed * 0.22 +
      artificialNaturalBlend * 0.18 +
      hydrology.coastNaturalizationFeed * 0.14 +
      beachMaterialFeed * 0.10 +
      sandShelfMaterialFeed * 0.10 +
      wetStoneMaterialFeed * 0.10
    );

    const harborScarBasin = clamp01(
      erodedHarborFeed * 0.26 +
      submergedPortBasinMaterialFeed * 0.26 +
      hydrology.bayPotential * 0.12 +
      hydrology.inletPotential * 0.12 +
      submergedBlockMaterialFeed * 0.10 +
      submergedScarMaterialFeed * 0.08
    );

    const channelScarContinuity = clamp01(
      ancientChannelFeed * 0.24 +
      hydrology.straitPotential * 0.14 +
      hydrology.archipelagoChannelPotential * 0.12 +
      hydrology.drainagePotential * 0.10 +
      submergedScarMaterialFeed * 0.16 +
      submergedShadowWake * 0.10
    );

    const archipelagoScarBreakup = clamp01(
      hydrology.archipelagoChannelPotential * 0.22 +
      hydrology.islandWaterGap * 0.14 +
      tectonics.archipelagoFracture * 0.14 +
      submergedBlockMaterialFeed * 0.12 +
      submergedScarMaterialFeed * 0.12 +
      hydrology.materialShelfFeed * 0.10
    );

    const scarClusterStrength = clamp01(
      coastalScarContinuity * 0.18 +
      channelScarContinuity * 0.16 +
      harborScarBasin * 0.14 +
      archipelagoScarBreakup * 0.12 +
      submergedScarMaterialFeed * 0.16 +
      submergedBlockMaterialFeed * 0.12
    );

    const isolatedBeadSuppression = clamp01(
      beadSuppression * 0.32 +
      greenGlowSuppression * 0.24 +
      submergedShadowWake * 0.16 +
      (1 - scarClusterStrength) * 0.12
    );

    const boundaryMorphologyFeed = clamp01(
      waterlineMaterialFeed * 0.14 +
      coastalScarContinuity * 0.12 +
      scarBandWidth * 0.10 +
      submergedShadowWake * 0.12 +
      mineralizedEdgeBody * 0.10 +
      reclaimedEdgeBlend * 0.10 +
      harborScarBasin * 0.10 +
      channelScarContinuity * 0.08 +
      submergedPortBasinMaterialFeed * 0.10
    );

    return {
      seaLevelMaterialFeed: clamp01(hydrology.nearSeaLevelStrength * 0.45 + waterlineMaterialFeed * 0.40),
      waterFillMaterialFeed,
      waterlineMaterialFeed,
      beachMaterialFeed,
      sandShelfMaterialFeed,
      wetStoneMaterialFeed,
      hardCoastMaterialFeed,
      cliffWaterEdgeMaterialFeed,
      submergedBlockMaterialFeed,
      submergedScarMaterialFeed,
      submergedPortBasinMaterialFeed,
      oldCoastalTechUnderwaterMaterialFeed,

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
  };

  const applyWaterlineExpression = (rgb, composition, tectonics, hydrology, feeds, noise) => {
    let color = rgb.slice();

    if (feeds.waterFillMaterialFeed > 0.10) {
      color = mixColor(color, PALETTE.waterFill, clamp01(feeds.waterFillMaterialFeed * 0.56));
      color = mixColor(color, PALETTE.deepWater, clamp01(hydrology.waterDepth * 0.28 + feeds.submergedShadowWake * 0.18));
    }

    if (feeds.submergedBlockMaterialFeed > 0.10) {
      color = mixColor(color, PALETTE.submergedBlock, clamp01(feeds.submergedBlockMaterialFeed * 0.38));
      color = mixColor(color, PALETTE.portBasin, clamp01(feeds.submergedPortBasinMaterialFeed * 0.22));
    }

    if (feeds.submergedScarMaterialFeed > 0.10) {
      color = mixColor(color, PALETTE.submergedScar, clamp01(feeds.submergedScarMaterialFeed * 0.34));
      color = mixColor(color, PALETTE.mineralTrace, clamp01(feeds.oldCoastalTechUnderwaterMaterialFeed * 0.07));
    }

    if (feeds.shallowShelfMaterialFeed > 0.01) {
      color = mixColor(color, PALETTE.shallowShelf, clamp01(hydrology.shallowShelfStrength * 0.20 + feeds.sandShelfMaterialFeed * 0.08));
    }

    if (feeds.sandShelfMaterialFeed > 0.12 && feeds.hardCoastMaterialFeed < 0.38) {
      color = mixColor(color, PALETTE.sandStone, clamp01(feeds.sandShelfMaterialFeed * 0.20));
    }

    if (feeds.beachMaterialFeed > 0.12 && feeds.hardCoastMaterialFeed < 0.36 && feeds.cliffWaterEdgeMaterialFeed < 0.34) {
      color = mixColor(color, PALETTE.beachShelf, clamp01(feeds.beachMaterialFeed * 0.20));
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
      feeds.oldCoastalTechUnderwaterMaterialFeed * 0.06
    );
    color[1] = clamp(Math.round(color[1] * (1 - greenReduce)), 0, 255);

    const noiseLift = 1 + (noise - 0.5) * 0.035;
    return scaleColor(color, noiseLift);
  };

  const outputFieldsFor = (composition, tectonics, hydrology, feeds, isLandBase, isWaterOccupied) => {
    const mass = clamp01(Math.max(composition.massAnchor, tectonics.materialBodyFeed));
    const density = clamp01(Math.max(composition.materialDensity, tectonics.materialDensityFeed));
    const relief = clamp01(Math.max(composition.reliefStrength, tectonics.materialReliefFeed));
    const ridge = clamp01(Math.max(composition.ridgePotential, composition.mountainArcPotential, tectonics.ridgeUplift || 0));
    const basin = clamp01(Math.max(composition.basinPotential, tectonics.basinSubsidence, hydrology.wetlandPotential));
    const shadow = clamp01(Math.max(composition.underlandShadow, tectonics.materialShadowFeed));

    const terrainRelief = clamp01(
      relief * 0.34 +
      ridge * 0.14 +
      tectonics.canyonCutPressure * 0.10 +
      tectonics.cliffPressure * 0.10 +
      feeds.mineralizedEdgeBody * 0.08 +
      feeds.wetStoneMaterialFeed * 0.06 +
      feeds.boundaryMorphologyFeed * 0.06
    );

    const ridgeRelief = clamp01(ridge * 0.34 + relief * 0.14 + composition.summitPotential * 0.08);

    const basinShade = clamp01(
      basin * 0.22 +
      hydrology.waterDepth * 0.24 +
      feeds.waterFillMaterialFeed * 0.12 +
      feeds.submergedPortBasinMaterialFeed * 0.12 +
      feeds.submergedShadowWake * 0.10
    );

    const shorelineGrounding = clamp01(
      feeds.waterlineMaterialFeed * 0.24 +
      feeds.wetStoneMaterialFeed * 0.16 +
      feeds.beachMaterialFeed * 0.10 +
      feeds.sandShelfMaterialFeed * 0.10 +
      feeds.hardCoastMaterialFeed * 0.12 +
      hydrology.coastNaturalizationFeed * 0.12
    );

    const shelfTransition = clamp01(
      hydrology.shelfGradient * 0.22 +
      hydrology.shallowShelfStrength * 0.20 +
      feeds.sandShelfMaterialFeed * 0.14 +
      feeds.submergedBlockMaterialFeed * 0.10 +
      feeds.submergedScarMaterialFeed * 0.10 +
      feeds.waterFillMaterialFeed * 0.08
    );

    const contactShadow = clamp01(
      shadow * 0.18 +
      shorelineGrounding * 0.16 +
      feeds.wetStoneMaterialFeed * 0.14 +
      feeds.cliffWaterEdgeMaterialFeed * 0.14 +
      feeds.submergedShadowWake * 0.14 +
      feeds.submergedPortBasinMaterialFeed * 0.08
    );

    const landDensity = isLandBase
      ? clamp01(0.46 + mass * 0.14 + density * 0.10 + terrainRelief * 0.08 - feeds.waterFillMaterialFeed * 0.14)
      : 0;

    const waterDepthShade = isWaterOccupied
      ? clamp01(hydrology.waterDepth * 0.48 + basinShade * 0.16 + feeds.submergedShadowWake * 0.16 + feeds.submergedPortBasinMaterialFeed * 0.10)
      : 0;

    return {
      alpha: 1,
      isLand: isLandBase && feeds.waterFillMaterialFeed < 0.58,
      isWater: isWaterOccupied,
      landDensity,
      shorelineGrounding,
      contactShadow,
      underlandOcclusion: clamp01(shadow * 0.26 + contactShadow * 0.22 + feeds.submergedShadowWake * 0.12),
      shelfTransition,
      terrainRelief,
      ridgeRelief,
      basinShade,
      rimDarkening: clamp01(composition.rimCompression * 0.22 + waterDepthShade * 0.10 + terrainRelief * 0.06),
      rimCompression: clamp01(composition.rimCompression * 0.42 + mass * 0.10 + relief * 0.06),
      atmosphereSeparation: isWaterOccupied
        ? clamp01(0.14 + hydrology.waterDepth * 0.10)
        : clamp01(0.38 + mass * 0.14 + terrainRelief * 0.06),
      surfaceAttachment: clamp01(composition.surfaceAttachment * 0.54 + mass * 0.14 + shorelineGrounding * 0.08),
      curvatureLock: clamp01(composition.curvatureLock),
      waterDepthShade,
      bridgePotential: clamp01(numberField(composition, "bridgePotential", 0) * 0.20 + feeds.channelScarContinuity * 0.08)
    };
  };

  const sample = (...args) => {
    const p = parseInput(...args);
    const composition = readComposition(...args);
    const tectonics = readTectonics(composition, p);
    const hydrology = readHydrology(composition, tectonics, p, args);

    const terrainClass = terrainClassFor(composition);
    const compatibilityTerrainClass = compatibilityClassFor(composition);
    const materialClass = MATERIAL_CLASS_MAP[terrainClass] || MATERIAL_CLASS_MAP[compatibilityTerrainClass] || MATERIAL_CLASS_MAP.ocean_basin;

    const isLandBase = LAND_CLASSES.has(terrainClass) || composition.isLand;
    const isWaterBase = WATER_CLASSES.has(terrainClass) || composition.isWater;
    const isWaterOccupied = isWaterBase || hydrology.waterFillStrength > 0.34 || hydrology.waterFill === true;

    const noiseA = textureNoise(p, terrainClass.length + (numberField(composition, "continentIndex", 0) + 31));
    const noiseB = textureNoise({ x: p.y, y: p.z, z: p.x }, 73);
    const materialNoise = clamp01(noiseA * 0.56 + noiseB * 0.44);

    const feeds = computeMaterialFeeds(composition, tectonics, hydrology, isLandBase, isWaterBase);

    let rgb = isWaterOccupied ? baseWaterColor(composition, hydrology) : baseLandColor(composition);

    if (!isWaterOccupied && isLandBase) {
      const terrainClassName = terrainClassFor(composition);
      if (terrainClassName === "coast_edge") rgb = mixColor(rgb, PALETTE.oldStone, 0.22);
      if (terrainClassName === "cliff_escarpment") rgb = mixColor(rgb, PALETTE.hardCoast, 0.24);
      if (terrainClassName === "waterfall_escarpment") rgb = mixColor(rgb, PALETTE.wetStone, 0.20);
      if (terrainClassName === "maritime_archipelago" || terrainClassName === "island_arc") rgb = mixColor(rgb, PALETTE.darkGreen, 0.18);
    }

    rgb = applyWaterlineExpression(rgb, composition, tectonics, hydrology, feeds, materialNoise);

    if (hydrology.aboveSeaLevelStrength > 0.56 && feeds.waterFillMaterialFeed < 0.28) {
      rgb = mixColor(rgb, baseLandColor(composition), clamp01(hydrology.aboveSeaLevelStrength * 0.22));
    }

    const fields = outputFieldsFor(composition, tectonics, hydrology, feeds, isLandBase, isWaterOccupied);

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
      visualPriority: fields.isWater ? 0.64 : 0.78,

      continentId: composition.continentId,
      continentName: composition.continentName || "Open Ocean",
      continentIndex: Number.isFinite(Number(composition.continentIndex)) ? Number(composition.continentIndex) : -1,
      continentClass: composition.continentClass || "open_ocean",

      climateHint: composition.climateHint || composition.climateClass || "open_ocean",
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

      seaLevel: hydrology.seaLevel,
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
      coastalScarContinuity: feeds.coastalScarContinuity,
      scarBandWidth: feeds.scarBandWidth,
      submergedShadowWake: feeds.submergedShadowWake,
      mineralizedEdgeBody: feeds.mineralizedEdgeBody,
      reclaimedEdgeBlend: feeds.reclaimedEdgeBlend,
      isolatedBeadSuppression: feeds.isolatedBeadSuppression,
      scarClusterStrength: feeds.scarClusterStrength,
      harborScarBasin: feeds.harborScarBasin,
      channelScarContinuity: feeds.channelScarContinuity,
      archipelagoScarBreakup: feeds.archipelagoScarBreakup,
      boundaryMorphologyFeed: feeds.boundaryMorphologyFeed,

      seaLevelMaterialFeed: feeds.seaLevelMaterialFeed,
      waterFillMaterialFeed: feeds.waterFillMaterialFeed,
      waterlineMaterialFeed: feeds.waterlineMaterialFeed,
      beachMaterialFeed: feeds.beachMaterialFeed,
      sandShelfMaterialFeed: feeds.sandShelfMaterialFeed,
      wetStoneMaterialFeed: feeds.wetStoneMaterialFeed,
      hardCoastMaterialFeed: feeds.hardCoastMaterialFeed,
      cliffWaterEdgeMaterialFeed: feeds.cliffWaterEdgeMaterialFeed,
      submergedBlockMaterialFeed: feeds.submergedBlockMaterialFeed,
      submergedScarMaterialFeed: feeds.submergedScarMaterialFeed,
      submergedPortBasinMaterialFeed: feeds.submergedPortBasinMaterialFeed,
      oldCoastalTechUnderwaterMaterialFeed: feeds.oldCoastalTechUnderwaterMaterialFeed,

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

  const blendPixel = (data, index, target, amount) => {
    const k = clamp01(amount);
    data[index] = Math.round(mixNumber(data[index], target[0], k));
    data[index + 1] = Math.round(mixNumber(data[index + 1], target[1], k));
    data[index + 2] = Math.round(mixNumber(data[index + 2], target[2], k));
  };

  const createTextureCanvas = (options = {}) => {
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
    canvas.dataset.hearthMaterialsSeaLevelWaterline = "true";
    canvas.dataset.hearthMaterialsBeachShelf = "true";
    canvas.dataset.hearthMaterialsWetStone = "true";
    canvas.dataset.hearthMaterialsSubmergedBlock = "true";
    canvas.dataset.hearthMaterialsSubmergedScar = "true";
    canvas.dataset.hearthMaterialsSubmergedPortBasin = "true";
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

        data[index] = original[index];
        data[index + 1] = original[index + 1];
        data[index + 2] = original[index + 2];
        data[index + 3] = original[index + 3];

        if (nWater > 0.18) {
          blendPixel(data, index, PALETTE.waterFill, nWater * 0.10);
          blendPixel(data, index, PALETTE.deepWater, Math.max(0, nWater - 0.42) * 0.14);
        }

        if (nBlock > 0.16) {
          blendPixel(data, index, PALETTE.submergedBlock, nBlock * 0.16);
        }

        if (nScar > 0.16) {
          blendPixel(data, index, PALETTE.submergedScar, nScar * 0.14);
          data[index + 1] = clamp(Math.round(data[index + 1] * (1 - nScar * 0.04)), 0, 255);
        }

        if (nPort > 0.20) {
          blendPixel(data, index, PALETTE.portBasin, nPort * 0.16);
        }

        if (nLine > 0.18) {
          blendPixel(data, index, PALETTE.mutedShelf, nLine * 0.08);
        }

        if (nWet > 0.16) {
          blendPixel(data, index, PALETTE.wetStone, nWet * 0.13);
        }

        if (nHard > 0.16) {
          blendPixel(data, index, PALETTE.hardCoast, nHard * 0.13);
        }

        if (nBeach > 0.18 && nHard < 0.32) {
          blendPixel(data, index, PALETTE.beachShelf, nBeach * 0.10);
        }

        if (sandShelf[p] > 0.18 && nHard < 0.34) {
          blendPixel(data, index, PALETTE.sandStone, sandShelf[p] * 0.08);
        }

        if (scarStrength[p] > 0.20 && nWater > 0.20) {
          data[index + 1] = clamp(Math.round(data[index + 1] * (1 - scarStrength[p] * 0.05)), 0, 255);
          blendPixel(data, index, PALETTE.submergedScar, scarStrength[p] * 0.06);
        }
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
    purpose: "submerged-port-basin-waterline-material-expression",
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
    consumesComposition: true,
    consumesTectonics: true,
    consumesHydrology: true,
    prefersWorldTerrainClass: true,
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
      "greenGlowSuppression",
      "coastalScarContinuity",
      "scarBandWidth",
      "submergedShadowWake",
      "mineralizedEdgeBody",
      "reclaimedEdgeBlend",
      "isolatedBeadSuppression",
      "scarClusterStrength",
      "harborScarBasin",
      "channelScarContinuity",
      "archipelagoScarBreakup",
      "boundaryMorphologyFeed",
      "seaLevelMaterialFeed",
      "waterFillMaterialFeed",
      "waterlineMaterialFeed",
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
      "hydrology classifies sea-level truth",
      "materials express waterline truth",
      "water defines true coast",
      "land-water overlap is valid when classified",
      "beaches appear only on shallow soft transitions",
      "cliff-water edges remain hard and dark",
      "submerged blocks read as lower-level structure",
      "submerged scars read as aged underwater evidence",
      "port basin remains implied, not deployed",
      "canvas held",
      "route held",
      "no final visual pass claim"
    ],
    forbiddenOwnership: [
      "elevation-generation",
      "composition-classification",
      "tectonic-pressure-generation",
      "hydrology-classification",
      "canvas-drawing-authority",
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

    terrainClasses: TERRAIN_CLASSES.slice(),
    materialClassMap: { ...MATERIAL_CLASS_MAP },

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
  root.HEARTH_MATERIALS_SUPPORTS_AGED_TECH_COASTAL_SCAR_MORPHOLOGY = true;
  root.HEARTH_MATERIALS_SUPPORTS_COASTAL_SCAR_ATLAS_CONTINUITY = true;
  root.HEARTH_MATERIALS_SUPPORTS_SEA_LEVEL_WATERLINE = true;
  root.HEARTH_MATERIALS_SUPPORTS_BEACH_SHELF = true;
  root.HEARTH_MATERIALS_SUPPORTS_WET_STONE_BOUNDARY = true;
  root.HEARTH_MATERIALS_SUPPORTS_SUBMERGED_BLOCK = true;
  root.HEARTH_MATERIALS_SUPPORTS_SUBMERGED_SCAR = true;
  root.HEARTH_MATERIALS_SUPPORTS_SUBMERGED_PORT_BASIN = true;

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
    root.document.documentElement.dataset.hearthMaterialsSupportsAgedTechCoastalScarMorphology = "true";
    root.document.documentElement.dataset.hearthMaterialsSupportsCoastalScarAtlasContinuity = "true";
    root.document.documentElement.dataset.hearthMaterialsSupportsSeaLevelWaterline = "true";
    root.document.documentElement.dataset.hearthMaterialsSupportsBeachShelf = "true";
    root.document.documentElement.dataset.hearthMaterialsSupportsWetStoneBoundary = "true";
    root.document.documentElement.dataset.hearthMaterialsSupportsSubmergedBlock = "true";
    root.document.documentElement.dataset.hearthMaterialsSupportsSubmergedScar = "true";
    root.document.documentElement.dataset.hearthMaterialsSupportsSubmergedPortBasin = "true";
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

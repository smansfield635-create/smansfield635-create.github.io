// /assets/hearth/hearth.hydrology.js
// HEARTH_SEA_LEVEL_WATERLINE_BEACH_BOUNDARY_HYDROLOGY_TNT_v1
// Full-file replacement.
// Hydrology authority only.
// Purpose:
// - Consume Hearth composition + tectonics.
// - Preserve existing hydrology API and downstream material feeds.
// - Add explicit sea-level, waterline, beach, submerged-block, submerged-scar, wet-stone, sand-shelf, and cliff-water-edge classification.
// - Treat visible coastal blocks/scars as low or near-sea-level terrain evidence.
// - Prepare materials to render water fill, beaches, shallow shelves, wet stone, hard coasts, cliff-water contacts, submerged blocks, and submerged scars.
// Does not own:
// - elevation generation
// - composition classification
// - tectonic pressure generation
// - material palette
// - canvas drawing
// - runtime motion
// - controls
// - route orchestration
// - teleports
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_SEA_LEVEL_WATERLINE_BEACH_BOUNDARY_HYDROLOGY_TNT_v1";
  const RECEIPT = "HEARTH_SEA_LEVEL_WATERLINE_BEACH_BOUNDARY_HYDROLOGY_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_COASTAL_BOUNDARY_NATURAL_HYDROLOGY_TNT_v1";
  const VERSION = "2026-05-28.hearth-sea-level-waterline-beach-boundary-hydrology-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const DEG = Math.PI / 180;
  const SEA_LEVEL = 0;

  const HYDROLOGY_CLASSES = [
    "deep_ocean_body",
    "open_ocean_basin",
    "continental_shelf_gradient",
    "shallow_shelf_water",
    "coastal_transition_zone",
    "cliff_coast_boundary",
    "beach_shelf_boundary",
    "marsh_delta_boundary",
    "river_mouth_boundary",
    "estuary_cut_boundary",
    "fjord_glacial_cut",
    "canyon_outflow_boundary",
    "waterfall_drainage_edge",
    "archipelago_channel",
    "island_shelf_boundary",
    "reef_shelf_boundary",
    "storm_coast_boundary",
    "dry_rocky_coast",
    "deep_ocean_drop",
    "continent_divide_strait",
    "wetland_lowland",
    "floodplain_basin",
    "sea_level_waterline",
    "submerged_block_field",
    "submerged_coastal_scar",
    "wet_stone_boundary",
    "sand_shelf_transition",
    "hard_cliff_water_edge",
    "none"
  ];

  const WATER_BOUNDARY_CLASSES = [
    "deep_ocean_body",
    "open_ocean_basin",
    "continental_shelf_gradient",
    "shallow_shelf_water",
    "archipelago_channel",
    "island_shelf_boundary",
    "reef_shelf_boundary",
    "deep_ocean_drop",
    "continent_divide_strait",
    "sea_level_waterline",
    "submerged_block_field",
    "submerged_coastal_scar",
    "none"
  ];

  const COAST_BOUNDARY_CLASSES = [
    "coastal_transition_zone",
    "cliff_coast_boundary",
    "beach_shelf_boundary",
    "marsh_delta_boundary",
    "river_mouth_boundary",
    "estuary_cut_boundary",
    "fjord_glacial_cut",
    "canyon_outflow_boundary",
    "waterfall_drainage_edge",
    "storm_coast_boundary",
    "dry_rocky_coast",
    "wetland_lowland",
    "floodplain_basin",
    "wet_stone_boundary",
    "sand_shelf_transition",
    "hard_cliff_water_edge",
    "sea_level_waterline",
    "none"
  ];

  const CONTINENT_HYDROLOGY_BIAS = Object.freeze({
    western_shield: {
      storm: 0.24,
      cliff: 0.18,
      beach: 0.12,
      river: 0.10,
      delta: 0.08,
      fjord: 0.02,
      dry: 0.08,
      reef: 0.02
    },
    eastern_basin: {
      storm: 0.08,
      cliff: 0.06,
      beach: 0.16,
      river: 0.30,
      delta: 0.30,
      estuary: 0.26,
      wetland: 0.28,
      floodplain: 0.30
    },
    northern_cold: {
      storm: 0.12,
      cliff: 0.20,
      beach: 0.04,
      river: 0.08,
      delta: 0.06,
      fjord: 0.38,
      dry: 0.02,
      reef: 0.00
    },
    southern_harsh: {
      storm: 0.06,
      cliff: 0.28,
      beach: 0.08,
      river: 0.05,
      delta: 0.03,
      dry: 0.34,
      canyon: 0.24,
      deepDrop: 0.18
    },
    equatorial_wet: {
      storm: 0.10,
      cliff: 0.10,
      beach: 0.16,
      river: 0.34,
      delta: 0.34,
      estuary: 0.28,
      wetland: 0.38,
      floodplain: 0.34,
      waterfall: 0.20
    },
    mountain_arc: {
      storm: 0.12,
      cliff: 0.34,
      beach: 0.04,
      river: 0.16,
      canyon: 0.34,
      waterfall: 0.30,
      deepDrop: 0.22
    },
    broken_archipelago: {
      beach: 0.20,
      reef: 0.30,
      archipelago: 0.40,
      island: 0.40,
      channel: 0.38,
      strait: 0.18,
      cliff: 0.10
    },
    open_ocean: {
      ocean: 0.42,
      deepDrop: 0.20,
      strait: 0.10
    }
  });

  const clamp = (value, min, max) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  };

  const clamp01 = (value) => clamp(value, 0, 1);

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

  const waterNoise = (p, salt = 0) => {
    const n1 = hashNoise(p.x, p.y, p.z, salt);
    const n2 = hashNoise(p.y + n1, p.z - n1, p.x + n1, salt + 17);
    const n3 = hashNoise(p.z - n2, p.x + n2, p.y - n2, salt + 37);
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

  const getElevationAuthority = () => {
    if (root.HEARTH && root.HEARTH.elevation) return root.HEARTH.elevation;
    if (root.HEARTH_ELEVATION) return root.HEARTH_ELEVATION;
    if (root.HearthElevation) return root.HearthElevation;
    return null;
  };

  const fallbackComposition = (p) => {
    const n = waterNoise(p, 5);
    const landSignal = smoothstep(0.06, 0.80, p.z) * (0.56 + n * 0.44);
    const isLand = landSignal > 0.46;

    return {
      contract: "HEARTH_SEA_LEVEL_HYDROLOGY_FALLBACK_COMPOSITION",
      receipt: "FALLBACK_COMPOSITION_USED",
      worldTerrainClass: isLand ? "continent_mass" : "ocean_basin",
      expandedTerrainClass: isLand ? "continent_mass" : "ocean_basin",
      semanticTerrainClass: isLand ? "continent_mass" : "ocean_basin",
      terrainClass: isLand ? "continent_mass" : "ocean_basin",
      compatibilityTerrainClass: isLand ? "raised_shield" : "deep_water",
      continentId: isLand ? "western_shield" : "open_ocean",
      continentName: isLand ? "Western Shield Continent" : "Open Ocean",
      continentClass: isLand ? "western_shield_mass" : "open_ocean",
      continentIndex: isLand ? 0 : -1,
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
      nearestContinentDistance: isLand ? 0.24 : 0.78,
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
      surfaceAttachment: isLand ? 0.72 : 0.42
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
      nearestContinentDistance: clamp01(numberField(source, "nearestContinentDistance", 1)),

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

    const elevation = getElevationAuthority();

    if (elevation) {
      const fn =
        typeof elevation.sample === "function"
          ? elevation.sample
          : typeof elevation.read === "function"
            ? elevation.read
            : typeof elevation.getElevation === "function"
              ? elevation.getElevation
              : null;

      if (fn) {
        try {
          const raw = fn.apply(elevation, args);
          return normalizeComposition(
            {
              ...raw,
              worldTerrainClass:
                raw && raw.terrainClassHint
                  ? raw.terrainClassHint
                  : raw && raw.isLand
                    ? "continent_mass"
                    : "ocean_basin",
              terrainClass:
                raw && raw.terrainClassHint
                  ? raw.terrainClassHint
                  : raw && raw.isLand
                    ? "continent_mass"
                    : "ocean_basin"
            },
            p
          );
        } catch (_error) {}
      }
    }

    return fallbackComposition(p);
  };

  const fallbackTectonics = (composition) => ({
    contract: "HEARTH_SEA_LEVEL_HYDROLOGY_FALLBACK_TECTONICS",
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

  const biasFor = (continentId) => CONTINENT_HYDROLOGY_BIAS[continentId] || CONTINENT_HYDROLOGY_BIAS.open_ocean;

  const computeBaseHydrologyFields = (composition, tectonics, p) => {
    const bias = biasFor(composition.continentId);
    const n = waterNoise(p, (composition.continentIndex || 0) + 23);

    const isWater = composition.isWater ? 1 : 0;
    const isLand = composition.isLand ? 1 : 0;
    const isRainforest = composition.climateClass === "rainforest_wet_basin" ? 1 : 0;
    const isMonsoon = composition.climateClass === "monsoon_floodplain" ? 1 : 0;
    const isTemperateStorm = composition.climateClass === "temperate_coastal_storm" ? 1 : 0;
    const isPolar = composition.climateClass === "polar_icefield" ? 1 : 0;
    const isTundra = composition.climateClass === "tundra_subpolar" ? 1 : 0;
    const isArid = composition.climateClass === "arid_dry_plateau" ? 1 : 0;
    const isBrokenArchipelago = composition.continentId === "broken_archipelago" ? 1 : 0;
    const isNorthernCold = composition.continentId === "northern_cold" ? 1 : 0;
    const deepOceanStable = tectonics.tectonicClass === "deep_ocean_stable" ? 1 : 0;

    const isCoastal = clamp01(
      composition.coastPotential * 0.36 +
      composition.shorelineContact * 0.28 +
      composition.shelfPotential * 0.16 +
      composition.continentShelfPotential * 0.16 +
      tectonics.coastalCompression * 0.18 +
      tectonics.shelfDropPressure * 0.12
    );

    const oceanDepth = clamp01(
      composition.waterDepthPotential * 0.46 +
      composition.oceanBasinPotential * 0.36 +
      (composition.isDeepWater ? 0.18 : 0) +
      deepOceanStable * 0.10
    );

    const oceanContinuity = clamp01(
      composition.oceanBasinPotential * 0.34 +
      composition.waterDepthPotential * 0.22 +
      isWater * 0.20 +
      (composition.continentId === "open_ocean" ? 0.22 : 0) +
      n * 0.04
    );

    const shelfGradient = clamp01(
      composition.continentShelfPotential * 0.34 +
      composition.shelfPotential * 0.24 +
      composition.shelfDrop * 0.14 +
      tectonics.shelfDropPressure * 0.18 +
      isCoastal * 0.10
    );

    const shorelineSoftness = clamp01(
      0.18 +
      shelfGradient * 0.26 +
      isCoastal * 0.24 +
      (1 - tectonics.cliffPressure) * 0.12 +
      (bias.beach || 0) +
      (bias.delta || 0) * 0.12 +
      (bias.wetland || 0) * 0.12
    );

    const shorelineRoughness = clamp01(
      tectonics.cliffPressure * 0.22 +
      tectonics.escarpmentPressure * 0.20 +
      tectonics.archipelagoFracture * 0.18 +
      tectonics.fractureDensity * 0.14 +
      composition.scarPotential * 0.10 +
      composition.canyonPotential * 0.10 +
      n * 0.06
    );

    const coastalBlendWidth = clamp01(
      shelfGradient * 0.28 +
      shorelineSoftness * 0.24 +
      isCoastal * 0.18 +
      composition.continentShelfPotential * 0.14 +
      (1 - shorelineRoughness) * 0.08
    );

    const surfaceWaterPotential = clamp01(
      isWater * 0.36 +
      shelfGradient * 0.20 +
      isCoastal * 0.16 +
      composition.basinPotential * 0.08 +
      tectonics.hydrologyFeedPressure * 0.16
    );

    const subsurfaceWaterPotential = clamp01(
      composition.basinPotential * 0.24 +
      tectonics.basinSubsidence * 0.20 +
      tectonics.lowlandStress * 0.16 +
      isRainforest * 0.20 +
      isMonsoon * 0.18
    );

    const riverPotential = clamp01(
      tectonics.drainageCutPotential * 0.26 +
      composition.basinPotential * 0.16 +
      composition.canyonPotential * 0.14 +
      tectonics.canyonCutPressure * 0.14 +
      (bias.river || 0) +
      isRainforest * 0.14 +
      isMonsoon * 0.12
    );

    const drainagePotential = clamp01(
      riverPotential * 0.28 +
      tectonics.drainageCutPotential * 0.26 +
      tectonics.faultCutPressure * 0.12 +
      tectonics.basinSubsidence * 0.12 +
      composition.slopePressure * 0.10 +
      composition.reliefStrength * 0.08
    );

    const deltaPotential = clamp01(
      riverPotential * 0.24 +
      tectonics.basinSubsidence * 0.18 +
      tectonics.lowlandStress * 0.18 +
      isCoastal * 0.16 +
      (bias.delta || 0)
    );

    const estuaryPotential = clamp01(
      drainagePotential * 0.22 +
      tectonics.faultCutPressure * 0.14 +
      tectonics.continentEdgeCompression * 0.12 +
      isCoastal * 0.16 +
      (bias.estuary || 0)
    );

    const wetlandPotential = clamp01(
      tectonics.lowlandStress * 0.22 +
      tectonics.basinSubsidence * 0.20 +
      composition.basinPotential * 0.18 +
      deltaPotential * 0.16 +
      (bias.wetland || 0)
    );

    const marshPotential = clamp01(
      wetlandPotential * 0.36 +
      deltaPotential * 0.24 +
      isCoastal * 0.10 +
      isRainforest * 0.12
    );

    const floodplainPotential = clamp01(
      tectonics.lowlandStress * 0.24 +
      riverPotential * 0.18 +
      composition.basinPotential * 0.18 +
      (bias.floodplain || 0)
    );

    const waterfallFlowPotential = clamp01(
      tectonics.waterfallDropPressure * 0.34 +
      composition.waterfallCandidate * 0.26 +
      tectonics.escarpmentPressure * 0.10 +
      (bias.waterfall || 0)
    );

    const canyonOutflowPotential = clamp01(
      tectonics.canyonCutPressure * 0.32 +
      composition.canyonPotential * 0.22 +
      tectonics.drainageCutPotential * 0.16 +
      (bias.canyon || 0)
    );

    const fjordCutPotential = clamp01(
      isNorthernCold * 0.24 +
      isPolar * 0.22 +
      isTundra * 0.16 +
      tectonics.cliffPressure * 0.12 +
      isCoastal * 0.12 +
      (bias.fjord || 0)
    );

    const stormSurgePotential = clamp01(
      tectonics.coastalCompression * 0.22 +
      isTemperateStorm * 0.28 +
      isCoastal * 0.14 +
      (bias.storm || 0)
    );

    const reefShelfPotential = clamp01(
      shelfGradient * 0.20 +
      composition.archipelagoPotential * 0.22 +
      composition.islandPotential * 0.18 +
      isBrokenArchipelago * 0.18 +
      (bias.reef || 0)
    );

    const archipelagoChannelPotential = clamp01(
      tectonics.archipelagoFracture * 0.28 +
      tectonics.islandArcPressure * 0.22 +
      composition.archipelagoPotential * 0.22 +
      isBrokenArchipelago * 0.16 +
      (bias.channel || 0)
    );

    const islandWaterGap = clamp01(
      archipelagoChannelPotential * 0.30 +
      tectonics.brokenShelfStress * 0.22 +
      composition.islandPotential * 0.18 +
      composition.shelfPotential * 0.10
    );

    const straitPotential = clamp01(
      composition.continentSeparation * 0.30 +
      tectonics.continentDivideStress * 0.24 +
      composition.waterDepthPotential * 0.14 +
      oceanDepth * 0.08 +
      (bias.strait || 0)
    );

    const bayPotential = clamp01(
      shorelineSoftness * 0.20 +
      isCoastal * 0.16 +
      tectonics.basinSubsidence * 0.12 +
      composition.coastPotential * 0.14 +
      (1 - shorelineRoughness) * 0.10
    );

    const inletPotential = clamp01(
      estuaryPotential * 0.20 +
      canyonOutflowPotential * 0.14 +
      straitPotential * 0.12 +
      shorelineRoughness * 0.10 +
      isCoastal * 0.10
    );

    const peninsulaEdgePotential = clamp01(
      composition.coastPotential * 0.16 +
      tectonics.continentEdgeCompression * 0.16 +
      shorelineRoughness * 0.14 +
      shelfGradient * 0.10 +
      composition.landPotential * 0.08
    );

    const deepOceanDrop = clamp01(
      oceanDepth * 0.22 +
      tectonics.shelfDropPressure * 0.22 +
      composition.waterDepthPotential * 0.18 +
      straitPotential * 0.12 +
      (bias.deepDrop || 0)
    );

    const coastNaturalizationFeed = clamp01(
      coastalBlendWidth * 0.24 +
      shorelineSoftness * 0.20 +
      shorelineRoughness * 0.14 +
      bayPotential * 0.08 +
      inletPotential * 0.08 +
      estuaryPotential * 0.08 +
      archipelagoChannelPotential * 0.08 +
      waterfallFlowPotential * 0.06
    );

    return {
      isCoastal,
      isArid,
      oceanDepth,
      oceanContinuity,
      shelfGradient,
      shorelineSoftness,
      shorelineRoughness,
      coastalBlendWidth,
      surfaceWaterPotential,
      subsurfaceWaterPotential,
      riverPotential,
      drainagePotential,
      deltaPotential,
      estuaryPotential,
      wetlandPotential,
      marshPotential,
      floodplainPotential,
      waterfallFlowPotential,
      canyonOutflowPotential,
      fjordCutPotential,
      stormSurgePotential,
      reefShelfPotential,
      archipelagoChannelPotential,
      islandWaterGap,
      straitPotential,
      bayPotential,
      inletPotential,
      peninsulaEdgePotential,
      deepOceanDrop,
      coastNaturalizationFeed
    };
  };

  const computeSeaLevelFields = (composition, tectonics, h) => {
    const seaLevel = SEA_LEVEL;
    const elevation = numberField(composition, "elevation", composition.isWater ? -0.28 : 0.18);
    const relativeSeaElevation = elevation - seaLevel;

    const belowSeaLevelStrength = clamp01(
      (-relativeSeaElevation + 0.045) / 0.36 +
      (composition.isWater ? 0.34 : 0) +
      composition.waterDepthPotential * 0.22 +
      composition.oceanBasinPotential * 0.16 +
      h.shelfGradient * 0.08
    );

    const nearSeaLevelStrength = clamp01(
      (1 - clamp(Math.abs(relativeSeaElevation) / 0.22, 0, 1)) * 0.48 +
      composition.coastPotential * 0.18 +
      composition.shorelineContact * 0.14 +
      composition.shelfPotential * 0.12 +
      h.isCoastal * 0.16
    );

    const aboveSeaLevelStrength = clamp01(
      (relativeSeaElevation + 0.04) / 0.34 +
      (composition.isLand ? 0.16 : 0) +
      composition.landPotential * 0.18
    );

    const waterFillStrength = clamp01(
      belowSeaLevelStrength * 0.48 +
      (composition.isWater ? 0.30 : 0) +
      h.surfaceWaterPotential * 0.14 +
      h.shelfGradient * 0.08 +
      h.straitPotential * 0.05
    );

    const waterDepth = clamp01(
      Math.max(0, seaLevel - elevation) * 1.75 +
      composition.waterDepthPotential * 0.32 +
      composition.oceanBasinPotential * 0.18 +
      h.oceanDepth * 0.20 +
      h.deepOceanDrop * 0.10
    );

    const shallowShelfStrength = clamp01(
      waterFillStrength * 0.18 +
      h.shelfGradient * 0.30 +
      composition.shelfPotential * 0.20 +
      composition.continentShelfPotential * 0.16 +
      nearSeaLevelStrength * 0.12 -
      h.oceanDepth * 0.08
    );

    const waterlineBoundaryStrength = clamp01(
      nearSeaLevelStrength * 0.30 +
      h.isCoastal * 0.24 +
      h.coastalBlendWidth * 0.16 +
      h.shelfGradient * 0.12 +
      composition.shorelineContact * 0.10 +
      tectonics.coastalCompression * 0.08
    );

    const hardCoastStrength = clamp01(
      waterlineBoundaryStrength * 0.26 +
      h.shorelineRoughness * 0.22 +
      tectonics.cliffPressure * 0.18 +
      tectonics.escarpmentPressure * 0.16 +
      tectonics.shelfDropPressure * 0.12 +
      h.deepOceanDrop * 0.06
    );

    const cliffWaterEdgeStrength = clamp01(
      waterlineBoundaryStrength * 0.22 +
      tectonics.cliffPressure * 0.22 +
      tectonics.escarpmentPressure * 0.20 +
      tectonics.shelfDropPressure * 0.18 +
      h.deepOceanDrop * 0.10 +
      h.shorelineRoughness * 0.08
    );

    const beachStrength = clamp01(
      waterlineBoundaryStrength * 0.24 +
      shallowShelfStrength * 0.25 +
      h.shorelineSoftness * 0.22 +
      h.coastalBlendWidth * 0.14 +
      h.bayPotential * 0.08 +
      h.deltaPotential * 0.04 -
      hardCoastStrength * 0.16
    );

    const sandShelfStrength = clamp01(
      beachStrength * 0.34 +
      shallowShelfStrength * 0.28 +
      h.shorelineSoftness * 0.14 +
      h.reefShelfPotential * 0.08 +
      h.coastalBlendWidth * 0.08
    );

    const submergedBlockStrength = clamp01(
      waterFillStrength * 0.20 +
      shallowShelfStrength * 0.16 +
      composition.scarPotential * 0.14 +
      composition.shelfPotential * 0.12 +
      tectonics.faultCutPressure * 0.10 +
      tectonics.fractureDensity * 0.10 +
      h.archipelagoChannelPotential * 0.08 +
      h.straitPotential * 0.06 +
      h.canyonOutflowPotential * 0.04
    );

    const submergedScarStrength = clamp01(
      waterFillStrength * 0.16 +
      composition.scarPotential * 0.16 +
      composition.canyonPotential * 0.12 +
      composition.continentSeparation * 0.10 +
      tectonics.canyonCutPressure * 0.12 +
      tectonics.faultCutPressure * 0.10 +
      h.straitPotential * 0.10 +
      h.archipelagoChannelPotential * 0.08 +
      h.drainagePotential * 0.06
    );

    const wetStoneStrength = clamp01(
      waterlineBoundaryStrength * 0.22 +
      hardCoastStrength * 0.18 +
      cliffWaterEdgeStrength * 0.16 +
      h.shorelineRoughness * 0.12 +
      h.inletPotential * 0.08 +
      h.estuaryPotential * 0.06 +
      h.waterfallFlowPotential * 0.08 +
      submergedScarStrength * 0.10
    );

    const oldCoastalTechSubmergedStrength = clamp01(
      submergedScarStrength * 0.24 +
      submergedBlockStrength * 0.22 +
      composition.scarPotential * 0.14 +
      tectonics.faultCutPressure * 0.10 +
      tectonics.fractureDensity * 0.10 +
      h.straitPotential * 0.08 +
      h.archipelagoChannelPotential * 0.08 +
      h.canyonOutflowPotential * 0.04
    );

    const waterDepthClass =
      waterDepth > 0.68
        ? "deep"
        : waterDepth > 0.36
          ? "mid"
          : waterFillStrength > 0.34
            ? "shallow"
            : "dry";

    return {
      seaLevel,
      relativeSeaElevation,

      belowSeaLevel: belowSeaLevelStrength > 0.38,
      nearSeaLevel: nearSeaLevelStrength > 0.34,
      aboveSeaLevel: aboveSeaLevelStrength > 0.38,

      belowSeaLevelStrength,
      nearSeaLevelStrength,
      aboveSeaLevelStrength,

      waterFill: waterFillStrength > 0.40,
      waterFillStrength,
      waterDepth,
      waterDepthClass,

      waterlineBoundary: waterlineBoundaryStrength > 0.34,
      waterlineBoundaryStrength,

      shallowShelf: shallowShelfStrength > 0.34,
      shallowShelfStrength,

      beachCandidate: beachStrength > 0.34,
      beachStrength,

      sandShelf: sandShelfStrength > 0.34,
      sandShelfStrength,

      hardCoastCandidate: hardCoastStrength > 0.38,
      hardCoastStrength,

      cliffWaterEdge: cliffWaterEdgeStrength > 0.40,
      cliffWaterEdgeStrength,

      submergedBlock: submergedBlockStrength > 0.36,
      submergedBlockStrength,

      submergedScar: submergedScarStrength > 0.34,
      submergedScarStrength,

      wetStoneEdge: wetStoneStrength > 0.36,
      wetStoneStrength,

      oldCoastalTechSubmerged: oldCoastalTechSubmergedStrength > 0.36,
      oldCoastalTechSubmergedStrength
    };
  };

  const computeMaterialFeeds = (composition, tectonics, h, sea) => {
    const materialWaterFeed = clamp01(
      h.oceanContinuity * 0.20 +
      h.oceanDepth * 0.20 +
      h.surfaceWaterPotential * 0.14 +
      h.shelfGradient * 0.10 +
      h.straitPotential * 0.06 +
      sea.waterFillStrength * 0.20 +
      sea.waterDepth * 0.10
    );

    const materialShelfFeed = clamp01(
      h.shelfGradient * 0.28 +
      h.coastalBlendWidth * 0.15 +
      h.reefShelfPotential * 0.10 +
      h.islandWaterGap * 0.08 +
      h.deepOceanDrop * 0.06 +
      sea.shallowShelfStrength * 0.22 +
      sea.sandShelfStrength * 0.11
    );

    const materialShoreFeed = clamp01(
      h.isCoastal * 0.20 +
      h.coastNaturalizationFeed * 0.20 +
      h.shorelineSoftness * 0.12 +
      h.shorelineRoughness * 0.08 +
      h.bayPotential * 0.06 +
      h.inletPotential * 0.06 +
      sea.waterlineBoundaryStrength * 0.18 +
      sea.wetStoneStrength * 0.10
    );

    const materialWetlandFeed = clamp01(
      h.wetlandPotential * 0.30 +
      h.marshPotential * 0.22 +
      h.floodplainPotential * 0.20 +
      h.deltaPotential * 0.14 +
      sea.nearSeaLevelStrength * 0.08
    );

    const materialRiverFeed = clamp01(
      h.riverPotential * 0.30 +
      h.drainagePotential * 0.20 +
      h.estuaryPotential * 0.13 +
      h.canyonOutflowPotential * 0.11 +
      h.waterfallFlowPotential * 0.09 +
      sea.submergedScarStrength * 0.07
    );

    const materialBeachFeed = clamp01(
      sea.beachStrength * 0.50 +
      sea.sandShelfStrength * 0.24 +
      h.shorelineSoftness * 0.12 +
      h.bayPotential * 0.06
    );

    const materialSandShelfFeed = clamp01(
      sea.sandShelfStrength * 0.52 +
      sea.shallowShelfStrength * 0.22 +
      h.reefShelfPotential * 0.08 +
      h.coastalBlendWidth * 0.08
    );

    const materialWetStoneFeed = clamp01(
      sea.wetStoneStrength * 0.46 +
      sea.hardCoastStrength * 0.18 +
      sea.cliffWaterEdgeStrength * 0.16 +
      h.shorelineRoughness * 0.10
    );

    const materialSubmergedBlockFeed = clamp01(
      sea.submergedBlockStrength * 0.52 +
      sea.waterFillStrength * 0.16 +
      sea.shallowShelfStrength * 0.10 +
      h.archipelagoChannelPotential * 0.08
    );

    const materialSubmergedScarFeed = clamp01(
      sea.submergedScarStrength * 0.50 +
      sea.oldCoastalTechSubmergedStrength * 0.18 +
      h.straitPotential * 0.08 +
      h.canyonOutflowPotential * 0.08
    );

    const materialCliffWaterEdgeFeed = clamp01(
      sea.cliffWaterEdgeStrength * 0.52 +
      sea.hardCoastStrength * 0.20 +
      tectonics.cliffPressure * 0.12 +
      tectonics.shelfDropPressure * 0.08
    );

    const materialWaterlineFeed = clamp01(
      sea.waterlineBoundaryStrength * 0.52 +
      sea.nearSeaLevelStrength * 0.18 +
      h.isCoastal * 0.12 +
      h.coastalBlendWidth * 0.08
    );

    return {
      materialWaterFeed,
      materialShelfFeed,
      materialShoreFeed,
      materialWetlandFeed,
      materialRiverFeed,
      materialBeachFeed,
      materialSandShelfFeed,
      materialWetStoneFeed,
      materialSubmergedBlockFeed,
      materialSubmergedScarFeed,
      materialCliffWaterEdgeFeed,
      materialWaterlineFeed
    };
  };

  const computeHydrologyFields = (composition, tectonics, p) => {
    const h = computeBaseHydrologyFields(composition, tectonics, p);
    const sea = computeSeaLevelFields(composition, tectonics, h);
    const feeds = computeMaterialFeeds(composition, tectonics, h, sea);

    return {
      ...h,
      ...sea,
      ...feeds
    };
  };

  const classifyWaterBoundary = (composition, tectonics, h) => {
    if (h.submergedScarStrength > 0.62 && h.waterFillStrength > 0.42) return "submerged_coastal_scar";
    if (h.submergedBlockStrength > 0.62 && h.waterFillStrength > 0.42) return "submerged_block_field";
    if (h.waterlineBoundaryStrength > 0.62 && h.waterFillStrength > 0.36) return "sea_level_waterline";
    if (h.straitPotential > 0.56) return "continent_divide_strait";
    if (h.deepOceanDrop > 0.58 && composition.isWater) return "deep_ocean_drop";
    if (h.archipelagoChannelPotential > 0.54) return "archipelago_channel";
    if (h.islandWaterGap > 0.52) return "island_shelf_boundary";
    if (h.reefShelfPotential > 0.52) return "reef_shelf_boundary";
    if (h.shelfGradient > 0.54 || h.shallowShelfStrength > 0.56) return "continental_shelf_gradient";
    if (composition.isShallowWater || h.shelfGradient > 0.36 || h.shallowShelfStrength > 0.40) return "shallow_shelf_water";
    if (composition.isDeepWater && h.oceanDepth > 0.64) return "deep_ocean_body";
    if (composition.isWater || h.waterFillStrength > 0.48) return "open_ocean_basin";
    return "none";
  };

  const classifyCoastBoundary = (composition, tectonics, h) => {
    if (h.cliffWaterEdgeStrength > 0.62) return "hard_cliff_water_edge";
    if (h.wetStoneStrength > 0.60) return "wet_stone_boundary";
    if (h.sandShelfStrength > 0.60) return "sand_shelf_transition";
    if (h.waterlineBoundaryStrength > 0.62 && h.beachStrength < 0.32) return "sea_level_waterline";
    if (h.waterfallFlowPotential > 0.54) return "waterfall_drainage_edge";
    if (h.canyonOutflowPotential > 0.54) return "canyon_outflow_boundary";
    if (h.fjordCutPotential > 0.52) return "fjord_glacial_cut";
    if (h.stormSurgePotential > 0.54) return "storm_coast_boundary";
    if (tectonics.cliffPressure > 0.50 || tectonics.escarpmentPressure > 0.52 || h.hardCoastStrength > 0.56) return "cliff_coast_boundary";
    if (h.marshPotential > 0.52 || h.deltaPotential > 0.54) return "marsh_delta_boundary";
    if (h.estuaryPotential > 0.52) return "estuary_cut_boundary";
    if (h.riverPotential > 0.52) return "river_mouth_boundary";
    if (h.wetlandPotential > 0.50) return "wetland_lowland";
    if (h.floodplainPotential > 0.50) return "floodplain_basin";
    if (composition.climateClass === "arid_dry_plateau" && h.isCoastal > 0.28) return "dry_rocky_coast";
    if (h.beachStrength > 0.42 || (h.isCoastal > 0.32 && h.shorelineSoftness > h.shorelineRoughness)) return "beach_shelf_boundary";
    if (h.isCoastal > 0.22 || h.waterlineBoundaryStrength > 0.34) return "coastal_transition_zone";
    return "none";
  };

  const classifyHydrology = (composition, tectonics, h) => {
    if (h.submergedScarStrength > 0.66) return "submerged_coastal_scar";
    if (h.submergedBlockStrength > 0.66) return "submerged_block_field";
    if (h.cliffWaterEdgeStrength > 0.64) return "hard_cliff_water_edge";
    if (h.wetStoneStrength > 0.62) return "wet_stone_boundary";
    if (h.sandShelfStrength > 0.62) return "sand_shelf_transition";
    if (h.waterlineBoundaryStrength > 0.64) return "sea_level_waterline";

    const waterBoundary = classifyWaterBoundary(composition, tectonics, h);
    const coastBoundary = classifyCoastBoundary(composition, tectonics, h);

    if (coastBoundary !== "none") return coastBoundary;
    if (waterBoundary !== "none") return waterBoundary;
    if (h.oceanContinuity > 0.52) return "open_ocean_basin";
    if (h.surfaceWaterPotential > 0.42) return "coastal_transition_zone";
    return "none";
  };

  const shorelineTypeFor = (composition, tectonics, h, coastBoundaryClass) => {
    if (coastBoundaryClass === "hard_cliff_water_edge") return "hard_cliff_water_edge";
    if (coastBoundaryClass === "wet_stone_boundary") return "wet_stone_boundary";
    if (coastBoundaryClass === "sand_shelf_transition") return "sand_shelf_transition";
    if (coastBoundaryClass === "sea_level_waterline") return "sea_level_waterline";
    if (coastBoundaryClass === "fjord_glacial_cut") return "fjord_glacial_cut";
    if (coastBoundaryClass === "storm_coast_boundary") return "storm_coast_boundary";
    if (coastBoundaryClass === "dry_rocky_coast") return "dry_rocky_coast";
    if (coastBoundaryClass === "cliff_coast_boundary") return "cliff_coast";
    if (coastBoundaryClass === "marsh_delta_boundary") return "marsh_delta";
    if (coastBoundaryClass === "estuary_cut_boundary") return "estuary_cut";
    if (coastBoundaryClass === "river_mouth_boundary") return "river_mouth";
    if (coastBoundaryClass === "waterfall_drainage_edge") return "waterfall_drainage_edge";
    if (coastBoundaryClass === "canyon_outflow_boundary") return "canyon_outflow";
    if (h.beachCandidate) return "beach_waterline";
    if (h.shorelineSoftness > h.shorelineRoughness) return "soft_shelf_shoreline";
    if (h.shorelineRoughness > 0.48) return "rough_rocky_shoreline";
    return "coastal_transition";
  };

  const shelfTypeFor = (composition, h, waterBoundaryClass) => {
    if (h.sandShelf) return "sand_shelf_transition";
    if (h.shallowShelf) return "shallow_shelf";
    if (waterBoundaryClass === "submerged_coastal_scar") return "submerged_scar_shelf";
    if (waterBoundaryClass === "submerged_block_field") return "submerged_block_shelf";
    if (waterBoundaryClass === "archipelago_channel") return "broken_archipelago_shelf";
    if (waterBoundaryClass === "island_shelf_boundary") return "island_shelf";
    if (waterBoundaryClass === "reef_shelf_boundary") return "reef_shelf";
    if (waterBoundaryClass === "continent_divide_strait") return "strait_shelf";
    if (waterBoundaryClass === "deep_ocean_drop") return "drop_shelf";
    if (h.shelfGradient > 0.50) return "continental_shelf_gradient";
    if (composition.isShallowWater) return "shallow_shelf";
    return "none";
  };

  const basinTypeFor = (composition, h) => {
    if (h.waterDepthClass === "deep") return "deep_ocean_basin";
    if (h.oceanContinuity > 0.46) return "open_ocean_basin";
    if (h.bayPotential > 0.44) return "coastal_bay_basin";
    if (h.wetlandPotential > 0.44) return "wetland_lowland_basin";
    if (h.floodplainPotential > 0.44) return "floodplain_basin";
    return "none";
  };

  const drainageTypeFor = (composition, h, coastBoundaryClass) => {
    if (coastBoundaryClass === "waterfall_drainage_edge") return "waterfall_drainage_edge";
    if (coastBoundaryClass === "canyon_outflow_boundary") return "canyon_outflow_boundary";
    if (coastBoundaryClass === "estuary_cut_boundary") return "estuary_cut_boundary";
    if (coastBoundaryClass === "river_mouth_boundary") return "river_mouth_boundary";
    if (h.submergedScar) return "submerged_scar_drainage";
    if (h.deltaPotential > 0.50) return "delta_drainage";
    if (h.wetlandPotential > 0.48) return "wetland_drainage";
    if (h.drainagePotential > 0.44) return "general_drainage";
    return "none";
  };

  const sample = (...args) => {
    const p = parseInput(...args);
    const composition = readComposition(...args);
    const tectonics = readTectonics(composition, p);
    const h = computeHydrologyFields(composition, tectonics, p);

    const waterBoundaryClass = classifyWaterBoundary(composition, tectonics, h);
    const coastBoundaryClass = classifyCoastBoundary(composition, tectonics, h);
    const hydrologyClass = classifyHydrology(composition, tectonics, h);
    const shorelineType = shorelineTypeFor(composition, tectonics, h, coastBoundaryClass);
    const shelfType = shelfTypeFor(composition, h, waterBoundaryClass);
    const basinType = basinTypeFor(composition, h);
    const drainageType = drainageTypeFor(composition, h, coastBoundaryClass);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "hydrology",
      sourceAuthority: "hearth.composition.js + hearth.tectonics.js",

      x: p.x,
      y: p.y,
      z: p.z,

      hydrologyClass,
      waterBoundaryClass,
      coastBoundaryClass,
      shorelineType,
      shelfType,
      basinType,
      drainageType,

      waterPresence: clamp01(
        (composition.isWater ? 0.34 : 0) +
        h.waterFillStrength * 0.28 +
        h.surfaceWaterPotential * 0.20 +
        h.subsurfaceWaterPotential * 0.10 +
        h.riverPotential * 0.04 +
        h.wetlandPotential * 0.04
      ),

      surfaceWaterPotential: h.surfaceWaterPotential,
      subsurfaceWaterPotential: h.subsurfaceWaterPotential,
      oceanContinuity: h.oceanContinuity,
      oceanDepth: h.oceanDepth,
      shelfGradient: h.shelfGradient,
      shorelineSoftness: h.shorelineSoftness,
      shorelineRoughness: h.shorelineRoughness,
      coastalBlendWidth: h.coastalBlendWidth,

      riverPotential: h.riverPotential,
      drainagePotential: h.drainagePotential,
      deltaPotential: h.deltaPotential,
      estuaryPotential: h.estuaryPotential,
      wetlandPotential: h.wetlandPotential,
      marshPotential: h.marshPotential,
      floodplainPotential: h.floodplainPotential,

      waterfallFlowPotential: h.waterfallFlowPotential,
      canyonOutflowPotential: h.canyonOutflowPotential,
      fjordCutPotential: h.fjordCutPotential,
      stormSurgePotential: h.stormSurgePotential,
      reefShelfPotential: h.reefShelfPotential,

      archipelagoChannelPotential: h.archipelagoChannelPotential,
      islandWaterGap: h.islandWaterGap,
      straitPotential: h.straitPotential,
      bayPotential: h.bayPotential,
      inletPotential: h.inletPotential,
      peninsulaEdgePotential: h.peninsulaEdgePotential,

      seaLevel: h.seaLevel,
      relativeSeaElevation: h.relativeSeaElevation,

      belowSeaLevel: h.belowSeaLevel,
      nearSeaLevel: h.nearSeaLevel,
      aboveSeaLevel: h.aboveSeaLevel,

      belowSeaLevelStrength: h.belowSeaLevelStrength,
      nearSeaLevelStrength: h.nearSeaLevelStrength,
      aboveSeaLevelStrength: h.aboveSeaLevelStrength,

      waterFill: h.waterFill,
      waterFillStrength: h.waterFillStrength,
      waterDepth: h.waterDepth,
      waterDepthClass: h.waterDepthClass,

      waterlineBoundary: h.waterlineBoundary,
      waterlineBoundaryStrength: h.waterlineBoundaryStrength,

      shallowShelf: h.shallowShelf,
      shallowShelfStrength: h.shallowShelfStrength,

      beachCandidate: h.beachCandidate,
      beachStrength: h.beachStrength,

      sandShelf: h.sandShelf,
      sandShelfStrength: h.sandShelfStrength,

      hardCoastCandidate: h.hardCoastCandidate,
      hardCoastStrength: h.hardCoastStrength,

      cliffWaterEdge: h.cliffWaterEdge,
      cliffWaterEdgeStrength: h.cliffWaterEdgeStrength,

      submergedBlock: h.submergedBlock,
      submergedBlockStrength: h.submergedBlockStrength,

      submergedScar: h.submergedScar,
      submergedScarStrength: h.submergedScarStrength,

      wetStoneEdge: h.wetStoneEdge,
      wetStoneStrength: h.wetStoneStrength,

      oldCoastalTechSubmerged: h.oldCoastalTechSubmerged,
      oldCoastalTechSubmergedStrength: h.oldCoastalTechSubmergedStrength,

      coastNaturalizationFeed: h.coastNaturalizationFeed,
      materialWaterFeed: h.materialWaterFeed,
      materialShelfFeed: h.materialShelfFeed,
      materialShoreFeed: h.materialShoreFeed,
      materialWetlandFeed: h.materialWetlandFeed,
      materialRiverFeed: h.materialRiverFeed,

      materialBeachFeed: h.materialBeachFeed,
      materialSandShelfFeed: h.materialSandShelfFeed,
      materialWetStoneFeed: h.materialWetStoneFeed,
      materialSubmergedBlockFeed: h.materialSubmergedBlockFeed,
      materialSubmergedScarFeed: h.materialSubmergedScarFeed,
      materialCliffWaterEdgeFeed: h.materialCliffWaterEdgeFeed,
      materialWaterlineFeed: h.materialWaterlineFeed,

      compositionContract: composition.contract || "UNKNOWN_COMPOSITION_CONTRACT",
      compositionReceipt: composition.receipt || "UNKNOWN_COMPOSITION_RECEIPT",
      tectonicsContract: tectonics.contract || "UNKNOWN_TECTONICS_CONTRACT",
      tectonicsReceipt: tectonics.receipt || "UNKNOWN_TECTONICS_RECEIPT",

      terrainClass: composition.worldTerrainClass || composition.terrainClass || "unknown",
      continentId: composition.continentId,
      continentName: composition.continentName,
      continentClass: composition.continentClass,
      climateClass: composition.climateClass,
      summitClass: composition.summitClass,
      tectonicClass: tectonics.tectonicClass,

      isLand: composition.isLand,
      isWater: composition.isWater,
      isShallowWater: composition.isShallowWater,
      isDeepWater: composition.isDeepWater,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  };

  const read = (...args) => sample(...args);
  const sampleHydrology = (...args) => sample(...args);
  const readHydrology = (...args) => sample(...args);
  const getHydrology = (...args) => sample(...args);
  const getHydrologyClass = (...args) => sample(...args).hydrologyClass;
  const getWaterBoundaryClass = (...args) => sample(...args).waterBoundaryClass;
  const getCoastBoundaryClass = (...args) => sample(...args).coastBoundaryClass;

  const getReceipt = () => ({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    authority: "hydrology",
    status: "active",
    sourceAuthority: "hearth.composition.js + hearth.tectonics.js",
    purpose: "sea-level-waterline-beach-boundary-and-submerged-structure-classification",
    requiredUpstream: [
      "hearth.composition.js",
      "hearth.tectonics.js"
    ],
    preparedDownstream: [
      "hearth.materials.js",
      "hearth.canvas.js"
    ],
    hydrologyClasses: HYDROLOGY_CLASSES.slice(),
    waterBoundaryClasses: WATER_BOUNDARY_CLASSES.slice(),
    coastBoundaryClasses: COAST_BOUNDARY_CLASSES.slice(),
    seaLevel: SEA_LEVEL,
    exposedFields: [
      "hydrologyClass",
      "waterBoundaryClass",
      "coastBoundaryClass",
      "shorelineType",
      "shelfType",
      "basinType",
      "drainageType",
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
      "seaLevel",
      "relativeSeaElevation",
      "belowSeaLevel",
      "nearSeaLevel",
      "aboveSeaLevel",
      "belowSeaLevelStrength",
      "nearSeaLevelStrength",
      "aboveSeaLevelStrength",
      "waterFill",
      "waterFillStrength",
      "waterDepth",
      "waterDepthClass",
      "waterlineBoundary",
      "waterlineBoundaryStrength",
      "shallowShelf",
      "shallowShelfStrength",
      "beachCandidate",
      "beachStrength",
      "sandShelf",
      "sandShelfStrength",
      "hardCoastCandidate",
      "hardCoastStrength",
      "cliffWaterEdge",
      "cliffWaterEdgeStrength",
      "submergedBlock",
      "submergedBlockStrength",
      "submergedScar",
      "submergedScarStrength",
      "wetStoneEdge",
      "wetStoneStrength",
      "oldCoastalTechSubmerged",
      "oldCoastalTechSubmergedStrength",
      "coastNaturalizationFeed",
      "materialWaterFeed",
      "materialShelfFeed",
      "materialShoreFeed",
      "materialWetlandFeed",
      "materialRiverFeed",
      "materialBeachFeed",
      "materialSandShelfFeed",
      "materialWetStoneFeed",
      "materialSubmergedBlockFeed",
      "materialSubmergedScarFeed",
      "materialCliffWaterEdgeFeed",
      "materialWaterlineFeed"
    ],
    designRules: [
      "hydrology classifies sea-level truth",
      "water defines the true coast",
      "coastal blocks may be below sea level",
      "visible scars may be submerged evidence",
      "beaches derive from waterline plus shallow shelf plus shoreline softness",
      "cliff water edges derive from waterline plus tectonic hardness",
      "materials render later",
      "canvas held",
      "route held",
      "no final visual pass claim"
    ],
    supportsCoastalBoundaryNaturalization: true,
    supportsMaterialWaterFeed: true,
    supportsMaterialShelfFeed: true,
    supportsMaterialShoreFeed: true,
    supportsHydrologyBoundaryClasses: true,
    supportsSeaLevelWaterlineBoundary: true,
    supportsBeachBoundaryClassification: true,
    supportsSubmergedBlockClassification: true,
    supportsSubmergedScarClassification: true,
    forbiddenOwnership: [
      "elevation-generation",
      "composition-classification",
      "tectonic-pressure-generation",
      "material-palette",
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
    sampleHydrology,
    readHydrology,
    getHydrology,
    getHydrologyClass,
    getWaterBoundaryClass,
    getCoastBoundaryClass,
    getReceipt,

    hydrologyClasses: HYDROLOGY_CLASSES.slice(),
    waterBoundaryClasses: WATER_BOUNDARY_CLASSES.slice(),
    coastBoundaryClasses: COAST_BOUNDARY_CLASSES.slice(),

    supportsCoastalBoundaryNaturalization: true,
    supportsMaterialWaterFeed: true,
    supportsMaterialShelfFeed: true,
    supportsMaterialShoreFeed: true,
    supportsHydrologyBoundaryClasses: true,
    supportsSeaLevelWaterlineBoundary: true,
    supportsBeachBoundaryClassification: true,
    supportsSubmergedBlockClassification: true,
    supportsSubmergedScarClassification: true,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.hydrology = api;

  root.HEARTH_HYDROLOGY = api;
  root.HearthHydrology = api;
  root.HEARTH_HYDROLOGY_RECEIPT = getReceipt();
  root.HEARTH_HYDROLOGY_CONTRACT = CONTRACT;
  root.HEARTH_HYDROLOGY_SUPPORTS_COASTAL_BOUNDARY_NATURALIZATION = true;
  root.HEARTH_HYDROLOGY_SUPPORTS_SEA_LEVEL_WATERLINE_BOUNDARY = true;
  root.HEARTH_HYDROLOGY_SUPPORTS_BEACH_BOUNDARY_CLASSIFICATION = true;
  root.HEARTH_HYDROLOGY_SUPPORTS_SUBMERGED_BLOCK_CLASSIFICATION = true;
  root.HEARTH_HYDROLOGY_SUPPORTS_SUBMERGED_SCAR_CLASSIFICATION = true;

  if (root.document && root.document.documentElement) {
    root.document.documentElement.dataset.hearthHydrologyAuthorityLoaded = "true";
    root.document.documentElement.dataset.hearthHydrologyContract = CONTRACT;
    root.document.documentElement.dataset.hearthHydrologyReceipt = RECEIPT;
    root.document.documentElement.dataset.hearthHydrologyPreviousContract = PREVIOUS_CONTRACT;
    root.document.documentElement.dataset.hearthHydrologyCoastalBoundaryNaturalization = "true";
    root.document.documentElement.dataset.hearthHydrologySeaLevelWaterlineBoundary = "true";
    root.document.documentElement.dataset.hearthHydrologyBeachBoundaryClassification = "true";
    root.document.documentElement.dataset.hearthHydrologySubmergedBlockClassification = "true";
    root.document.documentElement.dataset.hearthHydrologySubmergedScarClassification = "true";
    root.document.documentElement.dataset.hearthHydrologyMaterialWaterFeed = "true";
    root.document.documentElement.dataset.hearthHydrologyMaterialShelfFeed = "true";
    root.document.documentElement.dataset.hearthHydrologyMaterialShoreFeed = "true";
    root.document.documentElement.dataset.hearthHydrologyMaterialBeachFeed = "true";
    root.document.documentElement.dataset.hearthHydrologyMaterialSandShelfFeed = "true";
    root.document.documentElement.dataset.hearthHydrologyMaterialWetStoneFeed = "true";
    root.document.documentElement.dataset.hearthHydrologyMaterialSubmergedBlockFeed = "true";
    root.document.documentElement.dataset.hearthHydrologyMaterialSubmergedScarFeed = "true";
    root.document.documentElement.dataset.hearthHydrologyMaterialCliffWaterEdgeFeed = "true";
    root.document.documentElement.dataset.hearthHydrologyMaterialWaterlineFeed = "true";
    root.document.documentElement.dataset.generatedImage = "false";
    root.document.documentElement.dataset.graphicBox = "false";
    root.document.documentElement.dataset.webgl = "false";
    root.document.documentElement.dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

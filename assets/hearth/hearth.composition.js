// /assets/hearth/hearth.composition.js
// HEARTH_SEVEN_CONTINENT_REAL_PLANET_COMPOSITION_TNT_v1
// Full-file replacement.
// Composition authority only.
// Purpose:
// - Consume HEARTH_SEVEN_CONTINENT_REAL_PLANET_ELEVATION_TNT_v1.
// - Convert renewed real-planet elevation fields into material-ready terrain classes.
// - Preserve seven continent identity, open ocean identity, nine climate classes, nonlinear summit overlays, shelves, basins, canyons, cliffs, waterfalls, archipelagos, and mass anchoring.
// - Preserve current materials/canvas compatibility.
// Does not own:
// - elevation generation
// - material palette
// - canvas drawing
// - runtime motion
// - controls
// - route orchestration
// - teleports
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_SEVEN_CONTINENT_REAL_PLANET_COMPOSITION_TNT_v1";
  const RECEIPT = "HEARTH_SEVEN_CONTINENT_REAL_PLANET_COMPOSITION_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_SEVEN_CONTINENT_NINE_CLIMATE_COMPOSITION_TNT_v2";
  const BASELINE_CONTRACT = "HEARTH_SURFACE_MASS_ANCHORING_COMPOSITION_TNT_v1";
  const VERSION = "2026-05-28.hearth-seven-continent-real-planet-composition-v1";
  const SEA_LEVEL = 0.0;
  const DEG = Math.PI / 180;

  const root = typeof window !== "undefined" ? window : globalThis;

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

  const COMPATIBILITY_TERRAIN_CLASSES = [
    "continental_core",
    "raised_shield",
    "coastal_shelf",
    "exposed_bridge",
    "submerged_bridge",
    "ridge_corridor",
    "shallow_saddle",
    "basin_floor",
    "coast_edge",
    "cliff_candidate",
    "valley_candidate",
    "mountain_candidate",
    "island_seed",
    "shallow_water",
    "deep_water"
  ];

  const CONTINENT_CLASSES = Object.freeze({
    western_shield: "western_shield_mass",
    eastern_basin: "eastern_basin_mass",
    northern_cold: "northern_cold_mass",
    southern_harsh: "southern_harsh_mass",
    equatorial_wet: "equatorial_wet_mass",
    mountain_arc: "mountain_arc_mass",
    broken_archipelago: "broken_archipelago_mass",
    open_ocean: "open_ocean"
  });

  const CONTINENT_ROLE_HINTS = Object.freeze({
    western_shield: "old shield continent with plateau interior, stable highland mass, storm coast, and hardened shelf edge",
    eastern_basin: "basin-rim continent with floodplain pressure, lowland interior, dry plateau edges, and river-basin descent",
    northern_cold: "polar and subpolar continent with icefield, tundra, fjords, glacial passes, and cold shelf margins",
    southern_harsh: "survival-pressure continent with dry highland, wind-cut escarpment, harsh plateau, and cold desert pressure",
    equatorial_wet: "wet equatorial continent with rainforest basin, monsoon floodplain, waterfalls, and saturated lowland pressure",
    mountain_arc: "tectonic challenge continent with alpine ridges, canyon corridors, cliffs, high passes, and mountain arcs",
    broken_archipelago: "fragmented continent with drowned shelves, maritime island arcs, broken coastlines, and archipelago thresholds",
    open_ocean: "open ocean basin between continent systems"
  });

  const CLIMATE_CLASS_MAP = Object.freeze({
    polar_icefield: "polar_icefield",
    tundra_subpolar: "tundra_subpolar",
    temperate_highland: "temperate_highland",
    temperate_coastal_storm: "temperate_coastal_storm",
    tropical_rainforest_wet_basin: "rainforest_wet_basin",
    monsoon_floodplain: "monsoon_floodplain",
    arid_desert_dry_plateau: "arid_dry_plateau",
    alpine_mountain_arc: "alpine_mountain_arc",
    maritime_archipelago_subtropical_shelf: "maritime_archipelago",
    rainforest_wet_basin: "rainforest_wet_basin",
    arid_dry_plateau: "arid_dry_plateau",
    maritime_archipelago: "maritime_archipelago",
    open_ocean: "open_ocean"
  });

  const SUMMIT_CLASS_MAP = Object.freeze({
    summit_high_plateau: "summit_high_plateau",
    summit_waterfall_escarpment: "summit_waterfall_escarpment",
    summit_canyon_crossing: "summit_canyon_crossing",
    summit_storm_coast_cliff: "summit_storm_coast_cliff",
    summit_glacial_pass: "summit_glacial_pass",
    summit_rainforest_basin: "summit_rainforest_basin",
    summit_mountain_arc: "summit_mountain_arc",
    summit_dry_plateau: "summit_dry_plateau",
    summit_archipelago_threshold: "summit_archipelago_threshold",
    none: "none"
  });

  const clamp = (value, min, max) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  };

  const clamp01 = (value) => clamp(value, 0, 1);
  const mix = (a, b, t) => a + (b - a) * clamp01(t);

  const smoothstep = (edge0, edge1, x) => {
    const d = edge1 - edge0 || 1;
    const t = clamp01((x - edge0) / d);
    return t * t * (3 - 2 * t);
  };

  const softBand = (value, center, width) => {
    const t = 1 - clamp(Math.abs(value - center) / Math.max(0.000001, width), 0, 1);
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
        return lonLatToVector(mix(-180, 180, Number(p.u)), mix(-90, 90, Number(p.v)));
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

  const getElevationAuthority = () => {
    if (root.HEARTH && root.HEARTH.elevation) return root.HEARTH.elevation;
    if (root.HEARTH_ELEVATION) return root.HEARTH_ELEVATION;
    if (root.HearthElevation) return root.HearthElevation;
    return null;
  };

  const normalizeClimateInfluences = (raw) => {
    const source = raw && typeof raw.climateInfluences === "object"
      ? raw.climateInfluences
      : {};

    return {
      polar_icefield: clamp01(source.polar_icefield ?? raw?.polarInfluence),
      tundra_subpolar: clamp01(source.tundra_subpolar ?? raw?.tundraInfluence),
      temperate_highland: clamp01(source.temperate_highland),
      temperate_coastal_storm: clamp01(source.temperate_coastal_storm ?? raw?.stormCoastInfluence),
      tropical_rainforest_wet_basin: clamp01(source.tropical_rainforest_wet_basin ?? raw?.rainforestInfluence),
      monsoon_floodplain: clamp01(source.monsoon_floodplain ?? raw?.monsoonInfluence),
      arid_desert_dry_plateau: clamp01(source.arid_desert_dry_plateau ?? raw?.desertInfluence),
      alpine_mountain_arc: clamp01(source.alpine_mountain_arc ?? raw?.alpineInfluence),
      maritime_archipelago_subtropical_shelf: clamp01(source.maritime_archipelago_subtropical_shelf ?? raw?.maritimeInfluence)
    };
  };

  const dominantClimateHint = (raw) => {
    if (raw && typeof raw.climateHint === "string" && raw.climateHint) {
      return raw.climateHint;
    }

    const values = normalizeClimateInfluences(raw);
    let best = "open_ocean";
    let bestValue = 0;

    Object.keys(values).forEach((key) => {
      if (values[key] > bestValue) {
        best = key;
        bestValue = values[key];
      }
    });

    return best;
  };

  const normalizeElevationSample = (raw, p) => {
    const source = raw && typeof raw === "object" ? raw : {};
    const e = Number.isFinite(Number(source.elevation)) ? Number(source.elevation) : -0.48;
    const climateInfluences = normalizeClimateInfluences(source);
    const climateHint = dominantClimateHint(source);

    const continentId =
      typeof source.continentId === "string" && source.continentId
        ? source.continentId
        : typeof source.dominantCoreId === "string" && source.dominantCoreId
          ? source.dominantCoreId
          : "open_ocean";

    return {
      contract: source.contract || "UNKNOWN_OR_FALLBACK_ELEVATION",
      receipt: source.receipt || "FALLBACK_ELEVATION_SAMPLE",

      x: Number.isFinite(Number(source.x)) ? Number(source.x) : p.x,
      y: Number.isFinite(Number(source.y)) ? Number(source.y) : p.y,
      z: Number.isFinite(Number(source.z)) ? Number(source.z) : p.z,
      lon: Number.isFinite(Number(source.lon)) ? Number(source.lon) : 0,
      lat: Number.isFinite(Number(source.lat)) ? Number(source.lat) : 0,

      elevation: clamp(e, -1, 1),
      seaLevel: Number.isFinite(Number(source.seaLevel)) ? Number(source.seaLevel) : SEA_LEVEL,

      isLand: typeof source.isLand === "boolean" ? source.isLand : e > SEA_LEVEL,
      isWater: typeof source.isWater === "boolean" ? source.isWater : e <= SEA_LEVEL,
      isShallowWater: typeof source.isShallowWater === "boolean" ? source.isShallowWater : e <= SEA_LEVEL && e > -0.18,
      isDeepWater: typeof source.isDeepWater === "boolean" ? source.isDeepWater : e <= -0.18,

      landPotential: clamp01(source.landPotential),
      waterDepthPotential: clamp01(source.waterDepthPotential),
      oceanBasinPotential: clamp01(source.oceanBasinPotential),
      continentShelfPotential: clamp01(source.continentShelfPotential),
      shelfPotential: clamp01(source.shelfPotential),
      coastPotential: clamp01(source.coastPotential),

      continentId,
      continentName:
        typeof source.continentName === "string" && source.continentName
          ? source.continentName
          : continentId === "open_ocean"
            ? "Open Ocean"
            : continentId.replace(/_/g, " "),

      continentIndex: Number.isFinite(Number(source.continentIndex)) ? Number(source.continentIndex) : -1,
      continentPotential: clamp01(source.continentPotential),
      continentSeparation: clamp01(source.continentSeparation),
      nearestContinentDistance: Number.isFinite(Number(source.nearestContinentDistance))
        ? clamp01(source.nearestContinentDistance)
        : 1,

      climateHint,
      climatePotential: clamp01(source.climatePotential),
      climateInfluences,

      polarInfluence: clamp01(source.polarInfluence ?? climateInfluences.polar_icefield),
      tundraInfluence: clamp01(source.tundraInfluence ?? climateInfluences.tundra_subpolar),
      temperateInfluence: clamp01(source.temperateInfluence ?? Math.max(climateInfluences.temperate_highland, climateInfluences.temperate_coastal_storm)),
      stormCoastInfluence: clamp01(source.stormCoastInfluence ?? climateInfluences.temperate_coastal_storm),
      rainforestInfluence: clamp01(source.rainforestInfluence ?? climateInfluences.tropical_rainforest_wet_basin),
      monsoonInfluence: clamp01(source.monsoonInfluence ?? climateInfluences.monsoon_floodplain),
      desertInfluence: clamp01(source.desertInfluence ?? climateInfluences.arid_desert_dry_plateau),
      alpineInfluence: clamp01(source.alpineInfluence ?? climateInfluences.alpine_mountain_arc),
      maritimeInfluence: clamp01(source.maritimeInfluence ?? climateInfluences.maritime_archipelago_subtropical_shelf),

      summitRegionHint:
        typeof source.summitRegionHint === "string" && source.summitRegionHint
          ? source.summitRegionHint
          : "none",

      summitRegionLabel:
        typeof source.summitRegionLabel === "string" && source.summitRegionLabel
          ? source.summitRegionLabel
          : "None",

      summitTerrainHint:
        typeof source.summitTerrainHint === "string" && source.summitTerrainHint
          ? source.summitTerrainHint
          : "none",

      summitPotential: clamp01(source.summitPotential),

      mountainArcPotential: clamp01(source.mountainArcPotential),
      plateauPotential: clamp01(source.plateauPotential),
      canyonPotential: clamp01(source.canyonPotential),
      escarpmentPotential: clamp01(source.escarpmentPotential),
      waterfallCandidate: clamp01(source.waterfallCandidate),
      archipelagoPotential: clamp01(source.archipelagoPotential),
      basinPotential: clamp01(source.basinPotential),
      ridgePotential: clamp01(source.ridgePotential),
      saddlePotential: clamp01(source.saddlePotential),
      islandPotential: clamp01(source.islandPotential),
      scarPotential: clamp01(source.scarPotential),

      corePotential: clamp01(source.corePotential ?? source.continentPotential),
      shieldPotential: clamp01(source.shieldPotential),
      bridgePotential: clamp01(source.bridgePotential),

      terrainClassHint:
        typeof source.terrainClassHint === "string" && source.terrainClassHint
          ? source.terrainClassHint
          : e > SEA_LEVEL
            ? "continent_mass"
            : "ocean_basin",

      dominantCoreId: source.dominantCoreId || continentId
    };
  };

  const fallbackElevationSample = (p) => {
    const western = smoothstep(
      Math.cos(46 * DEG),
      Math.cos(18 * DEG),
      p.x * -0.78 + p.y * 0.12 + p.z * 0.52
    );

    const eastern = smoothstep(
      Math.cos(42 * DEG),
      Math.cos(18 * DEG),
      p.x * 0.44 + p.y * 0.06 + p.z * 0.80
    );

    const best = Math.max(western, eastern);
    const elevation = clamp(-0.58 + best * 0.98, -1, 1);
    const isLand = elevation > SEA_LEVEL;

    return normalizeElevationSample(
      {
        contract: "HEARTH_COMPOSITION_REAL_PLANET_FALLBACK_ELEVATION",
        receipt: "FALLBACK_ELEVATION_AUTHORITY_NOT_FOUND",
        x: p.x,
        y: p.y,
        z: p.z,
        elevation,
        isLand,
        isWater: !isLand,
        isShallowWater: !isLand && elevation > -0.18,
        isDeepWater: !isLand && elevation <= -0.18,
        landPotential: smoothstep(-0.10, 0.18, elevation),
        waterDepthPotential: isLand ? 0 : clamp01(-elevation / 0.72),
        oceanBasinPotential: isLand ? 0 : clamp01(-elevation / 0.58),
        continentShelfPotential: smoothstep(-0.22, 0.08, elevation) * (1 - smoothstep(0.08, 0.28, elevation)),
        shelfPotential: smoothstep(-0.22, 0.08, elevation) * (1 - smoothstep(0.08, 0.28, elevation)),
        coastPotential: softBand(elevation, 0, 0.16),
        continentId: isLand ? (western >= eastern ? "western_shield" : "eastern_basin") : "open_ocean",
        continentName: isLand ? (western >= eastern ? "Western Shield Continent" : "Eastern Basin Continent") : "Open Ocean",
        continentIndex: isLand ? (western >= eastern ? 0 : 1) : -1,
        continentPotential: best,
        continentSeparation: Math.min(western, eastern),
        nearestContinentDistance: 1 - best,
        climateHint: isLand ? "temperate_highland" : "open_ocean",
        climatePotential: isLand ? 0.52 : 0,
        summitRegionHint: "none",
        summitPotential: 0,
        mountainArcPotential: 0.12,
        plateauPotential: isLand ? 0.34 : 0,
        canyonPotential: 0,
        escarpmentPotential: softBand(elevation, 0.08, 0.18) * 0.24,
        waterfallCandidate: 0,
        archipelagoPotential: 0,
        basinPotential: 0.18,
        ridgePotential: 0.18,
        saddlePotential: 0.12,
        islandPotential: 0,
        scarPotential: 0,
        terrainClassHint: isLand ? "continent_mass" : "ocean_basin"
      },
      p
    );
  };

  const readElevation = (...args) => {
    const p = parseInput(...args);
    const authority = getElevationAuthority();

    if (args.length === 1 && args[0] && typeof args[0] === "object" && Number.isFinite(Number(args[0].elevation))) {
      return normalizeElevationSample(args[0], p);
    }

    if (authority) {
      const fn =
        typeof authority.sample === "function"
          ? authority.sample
          : typeof authority.read === "function"
            ? authority.read
            : typeof authority.getElevation === "function"
              ? authority.getElevation
              : typeof authority.sampleElevation === "function"
                ? authority.sampleElevation
                : null;

      if (fn) {
        try {
          return normalizeElevationSample(fn.apply(authority, args), p);
        } catch (_error) {
          try {
            return normalizeElevationSample(fn.call(authority, p), p);
          } catch (_error2) {
            return fallbackElevationSample(p);
          }
        }
      }
    }

    return fallbackElevationSample(p);
  };

  const materialSupportsExpandedTerrain = () => {
    const materials = root.HEARTH_MATERIALS || root.HearthMaterials || (root.HEARTH && root.HEARTH.materials) || null;

    if (root.HEARTH_MATERIALS_SUPPORTS_SEVEN_CLIMATE_TERRAIN_CLASSES === true) return true;
    if (root.HEARTH_MATERIALS_SUPPORTS_SEVEN_CONTINENT_NINE_CLIMATE_TERRAIN === true) return true;
    if (materials && materials.supportsExpandedHearthTerrain === true) return true;
    if (materials && materials.supportsSevenContinentNineClimateTerrain === true) return true;
    if (materials && materials.supportsSevenClimateTerrainClasses === true) return true;

    if (materials && Array.isArray(materials.terrainClasses)) {
      return EXPANDED_TERRAIN_CLASSES.some((name) => materials.terrainClasses.includes(name));
    }

    if (materials && materials.materialClassMap && typeof materials.materialClassMap === "object") {
      return EXPANDED_TERRAIN_CLASSES.some((name) => Object.prototype.hasOwnProperty.call(materials.materialClassMap, name));
    }

    return false;
  };

  const climateClassFor = (hint) => {
    return CLIMATE_CLASS_MAP[hint] || "open_ocean";
  };

  const continentClassFor = (id) => {
    return CONTINENT_CLASSES[id] || "open_ocean";
  };

  const summitClassFor = (hint, potential) => {
    if (potential <= 0.52) return "none";
    return SUMMIT_CLASS_MAP[hint] || "summit_region";
  };

  const computeBaseFields = (elev, p, inputMeta) => {
    const e = elev.elevation;

    const positiveLand = smoothstep(-0.08, 0.16, e);
    const exposedLand = e > SEA_LEVEL ? 1 : 0;
    const shallowBand = elev.isShallowWater ? 1 : 0;
    const deepBand = elev.isDeepWater ? 1 : 0;

    const oceanStrength = clamp01(elev.oceanBasinPotential);
    const shelfStrength = clamp01(Math.max(elev.shelfPotential, elev.continentShelfPotential));
    const coastStrength = clamp01(elev.coastPotential);
    const continentStrength = clamp01(elev.continentPotential);
    const divideStrength = clamp01(elev.continentSeparation);
    const mountainStrength = clamp01(Math.max(elev.mountainArcPotential, elev.ridgePotential));
    const plateauStrength = clamp01(elev.plateauPotential);
    const basinStrength = clamp01(elev.basinPotential);
    const canyonStrength = clamp01(elev.canyonPotential);
    const escarpmentStrength = clamp01(elev.escarpmentPotential);
    const waterfallStrength = clamp01(elev.waterfallCandidate);
    const archipelagoStrength = clamp01(Math.max(elev.archipelagoPotential, elev.islandPotential));
    const summitStrength = clamp01(elev.summitPotential);

    const shorelineContact = clamp01(
      coastStrength * 0.58 +
      shelfStrength * smoothstep(-0.22, 0.08, e) * 0.32 +
      archipelagoStrength * 0.18 +
      divideStrength * shallowBand * 0.20
    );

    const shelfDrop = clamp01(
      shelfStrength * 0.42 +
      coastStrength * smoothstep(-0.08, 0.18, e) * 0.30 +
      oceanStrength * shelfStrength * 0.22 +
      divideStrength * shallowBand * 0.12
    );

    const slopePressure = clamp01(
      mountainStrength * 0.30 +
      escarpmentStrength * 0.34 +
      canyonStrength * 0.24 +
      waterfallStrength * 0.26 +
      shelfDrop * 0.18 +
      divideStrength * 0.10
    );

    const reliefStrength = clamp01(
      smoothstep(-0.02, 0.52, e) * 0.22 +
      mountainStrength * 0.28 +
      plateauStrength * 0.18 +
      canyonStrength * 0.12 +
      escarpmentStrength * 0.16 +
      slopePressure * 0.18 +
      summitStrength * 0.10
    );

    const materialDensity = clamp01(
      exposedLand * 0.36 +
      positiveLand * 0.24 +
      continentStrength * 0.14 +
      plateauStrength * 0.14 +
      mountainStrength * 0.10 +
      summitStrength * 0.07 -
      oceanStrength * 0.20 -
      deepBand * 0.10
    );

    const massAnchor = clamp01(
      positiveLand * 0.32 +
      materialDensity * 0.34 +
      reliefStrength * 0.16 +
      shorelineContact * 0.12 +
      continentStrength * 0.10 +
      plateauStrength * 0.08
    );

    const suppliedFacing =
      inputMeta && Number.isFinite(Number(inputMeta.viewDot))
        ? Number(inputMeta.viewDot)
        : inputMeta && Number.isFinite(Number(inputMeta.cameraDot))
          ? Number(inputMeta.cameraDot)
          : inputMeta && Number.isFinite(Number(inputMeta.normalDot))
            ? Number(inputMeta.normalDot)
            : inputMeta && Number.isFinite(Number(inputMeta.normalFacing))
              ? Number(inputMeta.normalFacing)
              : null;

    const limbPressure =
      suppliedFacing === null
        ? clamp01(1 - Math.abs(p.z))
        : clamp01(1 - Math.abs(suppliedFacing));

    const rimCompression = clamp01(
      limbPressure * (0.38 + massAnchor * 0.38 + shorelineContact * 0.15 + reliefStrength * 0.08)
    );

    const curvatureLock = clamp01(
      0.68 +
      massAnchor * 0.18 +
      materialDensity * 0.08 +
      shorelineContact * 0.04 +
      continentStrength * 0.04
    );

    const contactOcclusion = clamp01(
      shorelineContact * 0.34 +
      shelfDrop * 0.24 +
      massAnchor * rimCompression * 0.18 +
      reliefStrength * slopePressure * 0.20 +
      escarpmentStrength * 0.14 +
      waterfallStrength * 0.10
    );

    const underlandShadow = clamp01(
      contactOcclusion * 0.66 +
      shelfDrop * 0.16 +
      shorelineContact * 0.14 +
      divideStrength * shallowBand * 0.10 +
      oceanStrength * shelfStrength * 0.08
    );

    const surfaceAttachment = clamp01(
      curvatureLock * 0.30 +
      massAnchor * 0.34 +
      materialDensity * 0.20 +
      contactOcclusion * 0.12 +
      plateauStrength * exposedLand * 0.05
    );

    return {
      positiveLand,
      exposedLand,
      shallowBand,
      deepBand,
      shorelineContact,
      shelfDrop,
      slopePressure,
      reliefStrength,
      materialDensity,
      massAnchor,
      rimCompression,
      curvatureLock,
      contactOcclusion,
      underlandShadow,
      surfaceAttachment
    };
  };

  const candidateFlags = (elev, base) => {
    const e = elev.elevation;
    const land = e > SEA_LEVEL ? 1 : 0;

    const mountainCandidate = clamp01(
      smoothstep(0.24, 0.66, e) * 0.28 +
      elev.mountainArcPotential * 0.46 +
      elev.ridgePotential * 0.20 +
      elev.summitPotential * 0.14
    );

    const cliffCandidate = clamp01(
      base.slopePressure * 0.30 +
      base.shelfDrop * 0.18 +
      elev.escarpmentPotential * 0.46 +
      elev.waterfallCandidate * 0.26 +
      elev.coastPotential * 0.08
    );

    const valleyCandidate = clamp01(
      elev.basinPotential * 0.36 +
      elev.canyonPotential * 0.46 +
      elev.saddlePotential * 0.18 +
      elev.scarPotential * 0.14
    );

    const coastCandidate = clamp01(
      elev.coastPotential * 0.64 +
      base.shorelineContact * 0.34 +
      elev.continentShelfPotential * 0.14
    );

    return {
      ocean_basin: elev.oceanBasinPotential > 0.52 || e <= -0.30,
      deep_ocean: e <= -0.22 && elev.oceanBasinPotential > 0.32,
      continent_divide: elev.continentSeparation > 0.48 && (e <= 0.08 || elev.waterDepthPotential > 0.12),
      continental_shelf: elev.continentShelfPotential > 0.38 && e <= 0.08,
      archipelago_shelf: elev.archipelagoPotential > 0.38 && e <= 0.08,
      shallow_water: e <= SEA_LEVEL && e > -0.18,
      coast_edge: coastCandidate > 0.54 && e > -0.05 && e < 0.16,
      mountain_candidate: mountainCandidate > 0.52 && land,
      cliff_candidate: cliffCandidate > 0.50 && land,
      valley_candidate: valleyCandidate > 0.46,
      canyon_corridor: elev.canyonPotential > 0.48 && land,
      waterfall_escarpment: elev.waterfallCandidate > 0.48 && land,
      island_seed: Math.max(elev.archipelagoPotential, elev.islandPotential) > 0.42 && e > -0.08 && e < 0.30,
      solid_land: land === 1 && base.massAnchor > 0.38,
      summit_region: elev.summitPotential > 0.52 && land
    };
  };

  const worldTerrainClassFor = (elev, base, flags, climateClass, summitClass) => {
    const e = elev.elevation;

    if (e <= -0.34 || elev.oceanBasinPotential > 0.64) return "ocean_basin";
    if (e <= -0.22 && elev.continentShelfPotential < 0.26 && elev.archipelagoPotential < 0.26) return "deep_ocean";

    if (flags.continent_divide) return "continent_divide";

    if (flags.archipelago_shelf) return "archipelago_shelf";
    if (flags.continental_shelf) return "continental_shelf";
    if (flags.shallow_water) return "shallow_water";

    if (flags.coast_edge) return "coast_edge";

    if (elev.polarInfluence > 0.48 && e > SEA_LEVEL) return "polar_icefield";
    if (elev.tundraInfluence > 0.44 && e > SEA_LEVEL) return "tundra_subpolar";

    if (flags.waterfall_escarpment) return "waterfall_escarpment";
    if (flags.cliff_candidate && elev.escarpmentPotential > 0.42) return "cliff_escarpment";
    if (flags.canyon_corridor) return "canyon_corridor";

    if (elev.mountainArcPotential > 0.56 && e > 0.12) return "mountain_arc";
    if (elev.alpineInfluence > 0.50 && e > 0.10) return "alpine_ridge";

    if (elev.plateauPotential > 0.52 && e > 0.10) return "plateau_interior";
    if (elev.basinPotential > 0.44 && e > SEA_LEVEL && e < 0.24) return "basin_floor";

    if (elev.archipelagoPotential > 0.42 && e > -0.04 && e < 0.28) return "island_arc";

    if (
      climateClass === "rainforest_wet_basin" ||
      climateClass === "monsoon_floodplain" ||
      climateClass === "arid_dry_plateau" ||
      climateClass === "temperate_highland" ||
      climateClass === "temperate_coastal_storm" ||
      climateClass === "maritime_archipelago" ||
      climateClass === "alpine_mountain_arc"
    ) {
      return climateClass;
    }

    if (summitClass !== "none" && elev.summitPotential > 0.68 && e > SEA_LEVEL) return "summit_region";

    if (elev.continentPotential > 0.32 && e > SEA_LEVEL) return "continent_mass";
    if (e > SEA_LEVEL) return "raised_land";

    return elev.oceanBasinPotential > 0.34 ? "ocean_basin" : "deep_ocean";
  };

  const compatibilityClassFor = (expanded, elev, flags) => {
    switch (expanded) {
      case "deep_ocean":
      case "ocean_basin":
        return "deep_water";

      case "continental_shelf":
      case "shallow_water":
      case "continent_divide":
        return elev.scarPotential > 0.28 || elev.continentSeparation > 0.32 ? "shallow_saddle" : "shallow_water";

      case "archipelago_shelf":
        return "coastal_shelf";

      case "coast_edge":
        return "coast_edge";

      case "island_arc":
      case "maritime_archipelago":
        return "island_seed";

      case "waterfall_escarpment":
      case "cliff_escarpment":
      case "temperate_coastal_storm":
        return "cliff_candidate";

      case "canyon_corridor":
        return "valley_candidate";

      case "mountain_arc":
      case "alpine_ridge":
      case "alpine_mountain_arc":
      case "polar_icefield":
      case "summit_region":
        return "mountain_candidate";

      case "plateau_interior":
      case "arid_dry_plateau":
      case "temperate_highland":
        return elev.continentPotential > 0.60 ? "continental_core" : "raised_shield";

      case "basin_floor":
      case "rainforest_wet_basin":
      case "monsoon_floodplain":
        return "basin_floor";

      case "tundra_subpolar":
      case "continent_mass":
      case "raised_land":
      default:
        if (flags.cliff_candidate) return "cliff_candidate";
        if (flags.mountain_candidate) return "mountain_candidate";
        if (flags.valley_candidate) return "valley_candidate";
        if (elev.continentPotential > 0.62 && elev.elevation > 0.18) return "continental_core";
        if (elev.shieldPotential > 0.44 && elev.elevation > 0.08) return "raised_shield";
        if (elev.shelfPotential > 0.42 && elev.elevation < 0.18) return "coastal_shelf";
        return elev.elevation > SEA_LEVEL ? "raised_shield" : "deep_water";
    }
  };

  const sample = (...args) => {
    const p = parseInput(...args);
    const inputMeta =
      args.length === 1 && args[0] && typeof args[0] === "object"
        ? args[0]
        : null;

    const elev = readElevation(...args);
    const base = computeBaseFields(elev, p, inputMeta);
    const climateClass = climateClassFor(elev.climateHint);
    const continentClass = continentClassFor(elev.continentId);
    const summitClass = summitClassFor(elev.summitRegionHint, elev.summitPotential);
    const flags = candidateFlags(elev, base);
    const worldTerrainClass = worldTerrainClassFor(elev, base, flags, climateClass, summitClass);
    const compatibilityTerrainClass = compatibilityClassFor(worldTerrainClass, elev, flags);
    const expandedSupported = materialSupportsExpandedTerrain();
    const terrainClass = expandedSupported ? worldTerrainClass : compatibilityTerrainClass;

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      authority: "composition",
      sourceAuthority: "hearth.elevation.js",

      x: p.x,
      y: p.y,
      z: p.z,

      elevation: elev.elevation,
      seaLevel: elev.seaLevel,

      terrainClass,
      worldTerrainClass,
      expandedTerrainClass: worldTerrainClass,
      semanticTerrainClass: worldTerrainClass,
      compatibilityTerrainClass,
      bridgeEraCompatibilityClass: compatibilityTerrainClass,
      terrainClassHint: elev.terrainClassHint,
      expandedTerrainSupportedByMaterials: expandedSupported,

      continentId: elev.continentId,
      continentName: elev.continentName,
      continentIndex: elev.continentIndex,
      continentClass,
      continentRoleHint: CONTINENT_ROLE_HINTS[elev.continentId] || CONTINENT_ROLE_HINTS.open_ocean,
      continentPotential: elev.continentPotential,
      continentSeparation: elev.continentSeparation,
      nearestContinentDistance: elev.nearestContinentDistance,

      climateHint: elev.climateHint,
      climateClass,
      climatePotential: elev.climatePotential,
      climateInfluences: { ...elev.climateInfluences },

      polarInfluence: elev.polarInfluence,
      tundraInfluence: elev.tundraInfluence,
      temperateInfluence: elev.temperateInfluence,
      stormCoastInfluence: elev.stormCoastInfluence,
      rainforestInfluence: elev.rainforestInfluence,
      monsoonInfluence: elev.monsoonInfluence,
      desertInfluence: elev.desertInfluence,
      alpineInfluence: elev.alpineInfluence,
      maritimeInfluence: elev.maritimeInfluence,

      summitRegionHint: elev.summitRegionHint,
      summitRegionLabel: elev.summitRegionLabel,
      summitTerrainHint: elev.summitTerrainHint,
      summitClass,
      summitPotential: elev.summitPotential,

      isLand: elev.isLand,
      isWater: elev.isWater,
      isShallowWater: elev.isShallowWater,
      isDeepWater: elev.isDeepWater,

      landPotential: elev.landPotential,
      waterDepthPotential: elev.waterDepthPotential,
      oceanBasinPotential: elev.oceanBasinPotential,
      continentShelfPotential: elev.continentShelfPotential,
      shelfPotential: elev.shelfPotential,
      coastPotential: elev.coastPotential,

      mountainArcPotential: elev.mountainArcPotential,
      plateauPotential: elev.plateauPotential,
      canyonPotential: elev.canyonPotential,
      escarpmentPotential: elev.escarpmentPotential,
      waterfallCandidate: elev.waterfallCandidate,
      archipelagoPotential: elev.archipelagoPotential,
      basinPotential: elev.basinPotential,
      ridgePotential: elev.ridgePotential,
      saddlePotential: elev.saddlePotential,
      islandPotential: elev.islandPotential,
      scarPotential: elev.scarPotential,

      corePotential: elev.corePotential,
      shieldPotential: elev.shieldPotential,
      bridgePotential: elev.bridgePotential,

      massAnchor: base.massAnchor,
      shorelineContact: base.shorelineContact,
      reliefStrength: base.reliefStrength,
      slopePressure: base.slopePressure,
      shelfDrop: base.shelfDrop,
      underlandShadow: base.underlandShadow,
      materialDensity: base.materialDensity,
      rimCompression: base.rimCompression,
      curvatureLock: base.curvatureLock,
      contactOcclusion: base.contactOcclusion,
      surfaceAttachment: base.surfaceAttachment,

      mountainCandidate: flags.mountain_candidate ? 1 : 0,
      cliffCandidate: flags.cliff_candidate ? 1 : 0,
      valleyCandidate: flags.valley_candidate ? 1 : 0,
      canyonCandidate: flags.canyon_corridor ? 1 : 0,
      waterfallEscarpmentCandidate: flags.waterfall_escarpment ? 1 : 0,
      coastCandidate: flags.coast_edge ? 1 : 0,
      islandSeed: flags.island_seed ? 1 : 0,

      candidates: flags,

      dominantCoreId: elev.dominantCoreId,
      elevationReceipt: elev.receipt,
      elevationContract: elev.contract,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  };

  const compose = (...args) => sample(...args);
  const read = (...args) => sample(...args);
  const classify = (...args) => sample(...args).terrainClass;
  const getTerrainClass = classify;
  const getWorldTerrainClass = (...args) => sample(...args).worldTerrainClass;
  const getClimateClass = (...args) => sample(...args).climateClass;
  const getContinentClass = (...args) => sample(...args).continentClass;
  const getSummitClass = (...args) => sample(...args).summitClass;
  const sampleComposition = sample;
  const readComposition = read;

  const getReceipt = () => ({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    authority: "composition",
    status: "active",
    sourceAuthority: "hearth.elevation.js",
    purpose: "seven-continent-real-planet-composition-and-material-ready-classification",
    requiredUpstream: [
      "hearth.elevation.js"
    ],
    preparedDownstream: [
      "hearth.materials.js",
      "hearth.canvas.js"
    ],
    terrainClasses: EXPANDED_TERRAIN_CLASSES.slice(),
    compatibilityTerrainClasses: COMPATIBILITY_TERRAIN_CLASSES.slice(),
    continentClasses: { ...CONTINENT_CLASSES },
    climateClasses: { ...CLIMATE_CLASS_MAP },
    summitClasses: { ...SUMMIT_CLASS_MAP },
    exposedFields: [
      "terrainClass",
      "worldTerrainClass",
      "expandedTerrainClass",
      "semanticTerrainClass",
      "compatibilityTerrainClass",
      "continentId",
      "continentName",
      "continentIndex",
      "continentClass",
      "continentRoleHint",
      "continentPotential",
      "continentSeparation",
      "nearestContinentDistance",
      "climateHint",
      "climateClass",
      "climatePotential",
      "climateInfluences",
      "summitRegionHint",
      "summitRegionLabel",
      "summitTerrainHint",
      "summitClass",
      "summitPotential",
      "isLand",
      "isWater",
      "isShallowWater",
      "isDeepWater",
      "elevation",
      "seaLevel",
      "landPotential",
      "waterDepthPotential",
      "oceanBasinPotential",
      "continentShelfPotential",
      "shelfPotential",
      "coastPotential",
      "mountainArcPotential",
      "plateauPotential",
      "canyonPotential",
      "escarpmentPotential",
      "waterfallCandidate",
      "archipelagoPotential",
      "basinPotential",
      "ridgePotential",
      "saddlePotential",
      "islandPotential",
      "scarPotential",
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
      "surfaceAttachment"
    ],
    designRules: [
      "consume renewed real-planet elevation",
      "carry seven continent ids forward",
      "carry open ocean forward",
      "emit ocean basin, shelf, coast, mountain, plateau, canyon, cliff, waterfall, archipelago, climate, and summit classes",
      "summit classes are nonlinear overlays",
      "compatibility classes remain aliases only",
      "canvas held",
      "route held",
      "no final visual pass claim"
    ],
    forbiddenOwnership: [
      "elevation-generation",
      "material-palette",
      "canvas-drawing",
      "runtime-motion",
      "controls",
      "route-ui",
      "teleports",
      "final-visual-pass-claim"
    ],
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  });

  const api = {
    CONTRACT,
    RECEIPT,
    PREVIOUS_CONTRACT,
    BASELINE_CONTRACT,
    VERSION,
    SEA_LEVEL,

    sample,
    compose,
    read,
    classify,
    getTerrainClass,
    getWorldTerrainClass,
    getClimateClass,
    getContinentClass,
    getSummitClass,
    sampleComposition,
    readComposition,
    getReceipt,

    terrainClasses: EXPANDED_TERRAIN_CLASSES.slice(),
    compatibilityTerrainClasses: COMPATIBILITY_TERRAIN_CLASSES.slice(),
    continentClasses: { ...CONTINENT_CLASSES },
    climateClasses: { ...CLIMATE_CLASS_MAP },
    summitClasses: { ...SUMMIT_CLASS_MAP },

    supportsSevenContinentRealPlanetComposition: true,
    supportsExpandedHearthTerrain: true,
    supportsNonlinearSummitRegions: true,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.composition = api;

  root.HEARTH_COMPOSITION = api;
  root.HearthComposition = api;
  root.HEARTH_COMPOSITION_RECEIPT = getReceipt();
  root.HEARTH_COMPOSITION_CONTRACT = CONTRACT;
  root.HEARTH_COMPOSITION_SUPPORTS_SEVEN_CONTINENT_REAL_PLANET = true;

  if (root.document && root.document.documentElement) {
    root.document.documentElement.dataset.hearthCompositionAuthorityLoaded = "true";
    root.document.documentElement.dataset.hearthCompositionContract = CONTRACT;
    root.document.documentElement.dataset.hearthCompositionReceipt = RECEIPT;
    root.document.documentElement.dataset.hearthCompositionPreviousContract = PREVIOUS_CONTRACT;
    root.document.documentElement.dataset.hearthCompositionSevenContinents = "true";
    root.document.documentElement.dataset.hearthCompositionOpenOcean = "true";
    root.document.documentElement.dataset.hearthCompositionNineClimates = "true";
    root.document.documentElement.dataset.hearthCompositionNonlinearSummits = "true";
    root.document.documentElement.dataset.hearthCompositionRealPlanetField = "true";
    root.document.documentElement.dataset.hearthCompositionExpandedTerrainClasses = "true";
    root.document.documentElement.dataset.generatedImage = "false";
    root.document.documentElement.dataset.graphicBox = "false";
    root.document.documentElement.dataset.webgl = "false";
    root.document.documentElement.dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

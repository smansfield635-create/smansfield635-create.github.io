// /assets/hearth/hearth.composition.js
// HEARTH_SEVEN_CONTINENT_NINE_CLIMATE_COMPOSITION_TNT_v2
// Full-file replacement.
// Composition authority only.
// Purpose:
// - Preserve Hearth surface-mass anchoring compatibility.
// - Consume Hearth seven-continent / nine-climate elevation authority.
// - Preserve and republish continent, climate, summit, canyon, waterfall, archipelago, shelf, and ocean-basin fields.
// - Expand semantic terrain classification without breaking current material compatibility.
// - Prepare hearth.materials.js to visibly render seven continents, nine climates, and nonlinear summit regions.
// Does not own:
// - colors
// - final material palette
// - canvas drawing
// - runtime motion
// - controls
// - route UI
// - teleports
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_SEVEN_CONTINENT_NINE_CLIMATE_COMPOSITION_TNT_v2";
  const RECEIPT = "HEARTH_SEVEN_CONTINENT_NINE_CLIMATE_COMPOSITION_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "HEARTH_SURFACE_MASS_ANCHORING_COMPOSITION_TNT_v1";
  const VERSION = "2026-05-28.hearth-seven-continent-nine-climate-composition-v2";
  const SEA_LEVEL = 0.0;
  const DEG = Math.PI / 180;

  const root = typeof window !== "undefined" ? window : globalThis;

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
    "basin_floor",
    "coast_edge",
    "cliff_candidate",
    "valley_candidate",
    "mountain_candidate",
    "island_seed",
    "shallow_water",
    "deep_water"
  ];

  const CONTINENT_CLASSES = {
    western_shield: "western_shield_mass",
    eastern_basin: "eastern_basin_mass",
    northern_cold: "northern_cold_mass",
    southern_harsh: "southern_harsh_mass",
    equatorial_wet: "equatorial_wet_mass",
    mountain_arc: "mountain_arc_mass",
    broken_archipelago: "broken_archipelago_mass",
    open_ocean: "open_ocean"
  };

  const CONTINENT_ROLE_HINTS = {
    western_shield: "old shield mass with plateau interior and storm-cliff coast",
    eastern_basin: "basin-rim continent with floodplain and dry plateau pressure",
    northern_cold: "polar and subpolar continent with icefields, tundra, fjords, and glacial valleys",
    southern_harsh: "survival-pressure highland with cold desert and wind-cut ridges",
    equatorial_wet: "rainforest basin with wetland, monsoon, river, and waterfall pressure",
    mountain_arc: "tectonic challenge continent with alpine ridges, canyons, cliffs, and high passes",
    broken_archipelago: "fragmented continental shelf with maritime islands and drowned valleys",
    open_ocean: "open ocean basin between continental systems"
  };

  const CLIMATE_CLASSES = {
    polar_icefield: "polar_icefield",
    tundra_subpolar: "tundra_subpolar",
    temperate_highland: "temperate_highland",
    temperate_coastal_storm: "temperate_coastal_storm",
    tropical_rainforest_wet_basin: "rainforest_wet_basin",
    monsoon_floodplain: "monsoon_floodplain",
    arid_desert_dry_plateau: "arid_dry_plateau",
    alpine_mountain_arc: "alpine_mountain_arc",
    maritime_archipelago_subtropical_shelf: "maritime_archipelago",
    open_ocean: "open_ocean"
  };

  const SUMMIT_CLASSES = {
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
  };

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

  const hasElevationShape = (value) => {
    return !!(
      value &&
      typeof value === "object" &&
      (
        Number.isFinite(Number(value.elevation)) ||
        Number.isFinite(Number(value.landPotential)) ||
        Number.isFinite(Number(value.continentPotential)) ||
        Number.isFinite(Number(value.oceanBasinPotential)) ||
        typeof value.terrainClassHint === "string" ||
        typeof value.continentId === "string" ||
        typeof value.climateHint === "string"
      )
    );
  };

  const normalizeClimateInfluences = (raw) => {
    const source = raw && typeof raw.climateInfluences === "object"
      ? raw.climateInfluences
      : raw || {};

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
    const e = Number.isFinite(Number(source.elevation)) ? Number(source.elevation) : -0.42;
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

      landPotential: clamp01(source.landPotential),
      shelfPotential: clamp01(source.shelfPotential),
      bridgePotential: clamp01(source.bridgePotential),
      ridgePotential: clamp01(source.ridgePotential),
      saddlePotential: clamp01(source.saddlePotential),
      basinPotential: clamp01(source.basinPotential),
      islandPotential: clamp01(source.islandPotential),
      coastPotential: clamp01(source.coastPotential),
      waterDepthPotential: clamp01(source.waterDepthPotential),

      corePotential: clamp01(source.corePotential),
      shieldPotential: clamp01(source.shieldPotential),

      continentId,
      continentName:
        typeof source.continentName === "string" && source.continentName
          ? source.continentName
          : continentId === "open_ocean"
            ? "Open Ocean"
            : continentId.replace(/_/g, " "),

      continentIndex: Number.isFinite(Number(source.continentIndex)) ? Number(source.continentIndex) : -1,
      continentPotential: clamp01(source.continentPotential ?? source.corePotential),
      continentSeparation: clamp01(source.continentSeparation),
      nearestContinentDistance: Number.isFinite(Number(source.nearestContinentDistance))
        ? Number(source.nearestContinentDistance)
        : 1,

      oceanBasinPotential: clamp01(source.oceanBasinPotential),
      continentShelfPotential: clamp01(source.continentShelfPotential ?? source.shelfPotential),
      mountainArcPotential: clamp01(source.mountainArcPotential ?? source.ridgePotential),
      plateauPotential: clamp01(source.plateauPotential ?? source.shieldPotential),
      canyonPotential: clamp01(source.canyonPotential),
      escarpmentPotential: clamp01(source.escarpmentPotential),
      waterfallCandidate: clamp01(source.waterfallCandidate),
      archipelagoPotential: clamp01(source.archipelagoPotential ?? source.islandPotential),
      scarPotential: clamp01(source.scarPotential ?? source.bridgePotential),

      polarInfluence: clamp01(source.polarInfluence ?? climateInfluences.polar_icefield),
      tundraInfluence: clamp01(source.tundraInfluence ?? climateInfluences.tundra_subpolar),
      temperateInfluence: clamp01(source.temperateInfluence ?? Math.max(climateInfluences.temperate_highland, climateInfluences.temperate_coastal_storm)),
      stormCoastInfluence: clamp01(source.stormCoastInfluence ?? climateInfluences.temperate_coastal_storm),
      rainforestInfluence: clamp01(source.rainforestInfluence ?? climateInfluences.tropical_rainforest_wet_basin),
      monsoonInfluence: clamp01(source.monsoonInfluence ?? climateInfluences.monsoon_floodplain),
      desertInfluence: clamp01(source.desertInfluence ?? climateInfluences.arid_desert_dry_plateau),
      alpineInfluence: clamp01(source.alpineInfluence ?? climateInfluences.alpine_mountain_arc),
      maritimeInfluence: clamp01(source.maritimeInfluence ?? climateInfluences.maritime_archipelago_subtropical_shelf),

      climateHint,
      climatePotential: clamp01(source.climatePotential),
      climateInfluences,

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

      terrainClassHint:
        typeof source.terrainClassHint === "string" && source.terrainClassHint
          ? source.terrainClassHint
          : e > SEA_LEVEL
            ? "raised_land"
            : "deep_ocean",

      isLand:
        typeof source.isLand === "boolean"
          ? source.isLand
          : e > SEA_LEVEL,

      isShallowWater:
        typeof source.isShallowWater === "boolean"
          ? source.isShallowWater
          : e <= SEA_LEVEL && e > -0.16,

      isDeepWater:
        typeof source.isDeepWater === "boolean"
          ? source.isDeepWater
          : e <= -0.16,

      dominantCoreId: source.dominantCoreId || continentId
    };
  };

  const fallbackElevationSample = (p) => {
    const western =
      smoothstep(0.82, 0.20, Math.hypot(p.x + 0.42, p.y + 0.18, p.z - 0.78));

    const eastern =
      smoothstep(0.76, 0.20, Math.hypot(p.x - 0.42, p.y - 0.12, p.z - 0.80));

    const scar = smoothstep(0.36, 0.02, Math.abs(p.x * 0.62 + p.y * 0.28));

    const elevation = clamp(
      -0.42 +
      western * 0.64 +
      eastern * 0.60 +
      scar * Math.max(western, eastern) * 0.12,
      -1,
      1
    );

    return normalizeElevationSample(
      {
        contract: "HEARTH_COMPOSITION_FALLBACK_ELEVATION_ONLY",
        receipt: "FALLBACK_USED_ELEVATION_AUTHORITY_NOT_FOUND",
        x: p.x,
        y: p.y,
        z: p.z,
        elevation,
        landPotential: smoothstep(-0.06, 0.24, elevation),
        shelfPotential: smoothstep(-0.2, 0.12, elevation) * (1 - smoothstep(0.18, 0.5, elevation)),
        bridgePotential: scar * 0.28,
        ridgePotential: scar * 0.28,
        saddlePotential: scar * 0.18,
        basinPotential: 0.18,
        islandPotential: scar * 0.18,
        coastPotential: clamp01(1 - Math.abs(elevation) / 0.14),
        waterDepthPotential: elevation < 0 ? clamp01(-elevation / 0.72) : 0,
        corePotential: Math.max(western, eastern),
        shieldPotential: Math.max(western, eastern) * 0.72,
        continentId: western >= eastern ? "western_shield" : "eastern_basin",
        continentName: western >= eastern ? "Western Shield Continent" : "Eastern Basin Continent",
        continentIndex: western >= eastern ? 0 : 1,
        continentPotential: Math.max(western, eastern),
        continentSeparation: scar * 0.22,
        oceanBasinPotential: elevation < -0.22 ? clamp01(-elevation) : 0,
        continentShelfPotential: smoothstep(-0.2, 0.12, elevation),
        mountainArcPotential: scar * 0.22,
        plateauPotential: Math.max(western, eastern) * 0.34,
        canyonPotential: 0,
        escarpmentPotential: scar * 0.18,
        waterfallCandidate: 0,
        archipelagoPotential: scar * 0.12,
        scarPotential: scar,
        climateHint: western >= eastern ? "temperate_highland" : "monsoon_floodplain",
        climatePotential: 0.48,
        summitRegionHint: "none",
        summitPotential: 0,
        terrainClassHint: elevation > 0 ? "continent_mass" : "deep_ocean"
      },
      p
    );
  };

  const readElevation = (...args) => {
    const p = parseInput(...args);

    if (args.length === 1 && hasElevationShape(args[0])) {
      return normalizeElevationSample(args[0], p);
    }

    const authority = getElevationAuthority();

    if (authority) {
      const fn =
        typeof authority.sample === "function"
          ? authority.sample
          : typeof authority.read === "function"
            ? authority.read
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
    const materials = root.HEARTH_MATERIALS || root.HearthMaterials || root.HEARTH_MATERIAL_AUTHORITY || null;

    if (root.HEARTH_MATERIALS_SUPPORTS_SEVEN_CLIMATE_TERRAIN_CLASSES === true) return true;
    if (materials && materials.supportsExpandedHearthTerrain === true) return true;
    if (materials && materials.supportsSevenContinentNineClimateTerrain === true) return true;

    if (materials && Array.isArray(materials.terrainClasses)) {
      return EXPANDED_TERRAIN_CLASSES.some((name) => materials.terrainClasses.includes(name));
    }

    if (materials && materials.materialClassMap && typeof materials.materialClassMap === "object") {
      return EXPANDED_TERRAIN_CLASSES.some((name) => Object.prototype.hasOwnProperty.call(materials.materialClassMap, name));
    }

    return false;
  };

  const climateClassFor = (climateHint) => {
    return CLIMATE_CLASSES[climateHint] || "open_ocean";
  };

  const continentClassFor = (continentId) => {
    return CONTINENT_CLASSES[continentId] || "open_ocean";
  };

  const summitClassFor = (summitRegionHint, summitPotential) => {
    if (summitPotential <= 0.52) return "none";
    return SUMMIT_CLASSES[summitRegionHint] || "summit_region";
  };

  const computeBaseFields = (elev, p, inputMeta) => {
    const e = elev.elevation;
    const positiveLand = smoothstep(-0.04, 0.18, e);
    const exposedLand = e > SEA_LEVEL ? 1 : 0;
    const shallowBand = e <= SEA_LEVEL && e > -0.18 ? 1 : 0;

    const continentStrength = clamp01(elev.continentPotential);
    const shelfStrength = clamp01(Math.max(elev.shelfPotential, elev.continentShelfPotential));
    const oceanStrength = clamp01(elev.oceanBasinPotential);
    const mountainStrength = clamp01(Math.max(elev.ridgePotential, elev.mountainArcPotential));
    const plateauStrength = clamp01(elev.plateauPotential);
    const canyonStrength = clamp01(elev.canyonPotential);
    const escarpmentStrength = clamp01(elev.escarpmentPotential);
    const waterfallStrength = clamp01(elev.waterfallCandidate);
    const archipelagoStrength = clamp01(Math.max(elev.archipelagoPotential, elev.islandPotential));
    const divideStrength = clamp01(elev.continentSeparation);
    const summitStrength = clamp01(elev.summitPotential);

    const shorelineContact = clamp01(
      elev.coastPotential * 0.56 +
      shelfStrength * smoothstep(-0.18, 0.08, e) * 0.32 +
      archipelagoStrength * 0.22 +
      divideStrength * shallowBand * 0.18
    );

    const shelfDrop = clamp01(
      shelfStrength * elev.coastPotential * 0.46 +
      elev.coastPotential * smoothstep(-0.06, 0.18, e) * 0.28 +
      elev.waterDepthPotential * shelfStrength * 0.20 +
      oceanStrength * 0.14
    );

    const slopePressure = clamp01(
      mountainStrength * 0.36 +
      escarpmentStrength * 0.30 +
      canyonStrength * 0.22 +
      shelfDrop * 0.24 +
      waterfallStrength * 0.24 +
      divideStrength * 0.10
    );

    const reliefStrength = clamp01(
      smoothstep(0.0, 0.52, e) * 0.24 +
      mountainStrength * 0.28 +
      plateauStrength * 0.18 +
      slopePressure * 0.26 +
      summitStrength * 0.14
    );

    const materialDensity = clamp01(
      exposedLand * 0.38 +
      positiveLand * 0.22 +
      continentStrength * 0.16 +
      plateauStrength * 0.14 +
      mountainStrength * 0.10 +
      summitStrength * 0.08 -
      oceanStrength * 0.20
    );

    const massAnchor = clamp01(
      positiveLand * 0.34 +
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
      limbPressure * (0.40 + massAnchor * 0.40 + shorelineContact * 0.14 + reliefStrength * 0.08)
    );

    const curvatureLock = clamp01(
      0.68 +
      massAnchor * 0.18 +
      materialDensity * 0.08 +
      shorelineContact * 0.04 +
      continentStrength * 0.04
    );

    const contactOcclusion = clamp01(
      shorelineContact * 0.38 +
      shelfDrop * 0.24 +
      massAnchor * rimCompression * 0.18 +
      reliefStrength * slopePressure * 0.20 +
      cliffCandidateStrength(elev) * 0.16
    );

    const underlandShadow = clamp01(
      contactOcclusion * 0.68 +
      shelfDrop * 0.14 +
      shorelineContact * 0.14 +
      divideStrength * shallowBand * 0.10
    );

    const surfaceAttachment = clamp01(
      curvatureLock * 0.30 +
      massAnchor * 0.34 +
      materialDensity * 0.20 +
      contactOcclusion * 0.12 +
      plateauStrength * exposedLand * 0.06
    );

    return {
      positiveLand,
      exposedLand,
      shallowBand,
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

  const cliffCandidateStrength = (elev) => {
    return clamp01(
      elev.escarpmentPotential * 0.44 +
      elev.waterfallCandidate * 0.32 +
      elev.coastPotential * smoothstep(0.02, 0.24, elev.elevation) * 0.18 +
      elev.mountainArcPotential * 0.16
    );
  };

  const candidateFlags = (elev, base) => {
    const e = elev.elevation;
    const land = e > SEA_LEVEL ? 1 : 0;

    const mountainCandidate = clamp01(
      smoothstep(0.28, 0.70, e) * 0.34 +
      elev.mountainArcPotential * 0.42 +
      elev.ridgePotential * 0.22 +
      elev.summitPotential * 0.16
    );

    const cliffCandidate = clamp01(
      base.slopePressure * 0.36 +
      base.shelfDrop * 0.22 +
      elev.escarpmentPotential * 0.42 +
      elev.waterfallCandidate * 0.30
    );

    const valleyCandidate = clamp01(
      elev.basinPotential * 0.42 +
      elev.canyonPotential * 0.42 +
      elev.saddlePotential * 0.20 +
      smoothstep(0.08, -0.08, e) * elev.scarPotential * 0.14
    );

    const coastCandidate = clamp01(
      elev.coastPotential * 0.66 +
      base.shorelineContact * 0.36 +
      elev.continentShelfPotential * 0.16
    );

    return {
      mountain_candidate: mountainCandidate > 0.56 && land,
      cliff_candidate: cliffCandidate > 0.54 && land,
      valley_candidate: valleyCandidate > 0.48,
      canyon_corridor: elev.canyonPotential > 0.50 && land,
      waterfall_escarpment: elev.waterfallCandidate > 0.50 && land,
      coast_edge: coastCandidate > 0.54,
      island_seed:
        Math.max(elev.archipelagoPotential, elev.islandPotential) > 0.48 &&
        e > -0.08 &&
        e < 0.30,
      bridge_member:
        elev.bridgePotential > 0.46 &&
        e > -0.16,
      solid_land:
        land === 1 && base.massAnchor > 0.42,
      shallow_water:
        e <= SEA_LEVEL && e > -0.18,
      deep_water:
        e <= -0.18,
      continent_divide:
        elev.continentSeparation > 0.48 &&
        (e <= SEA_LEVEL || elev.waterDepthPotential > 0.18),
      ocean_basin:
        elev.oceanBasinPotential > 0.46 || e <= -0.28,
      archipelago_shelf:
        elev.archipelagoPotential > 0.36 && e > -0.18 && e < 0.18,
      summit_region:
        elev.summitPotential > 0.52 && land
    };
  };

  const terrainClassExpanded = (elev, base, flags, climateClass, summitClass) => {
    const e = elev.elevation;

    if (e <= -0.30 || elev.oceanBasinPotential > 0.58) return "ocean_basin";
    if (e <= -0.18 && elev.continentShelfPotential < 0.30 && elev.archipelagoPotential < 0.26) return "deep_ocean";

    if (flags.continent_divide) return "continent_divide";

    if (e <= SEA_LEVEL && elev.archipelagoPotential > 0.34) return "archipelago_shelf";
    if (e <= SEA_LEVEL && elev.continentShelfPotential > 0.34) return "continental_shelf";
    if (e <= SEA_LEVEL && e > -0.18) return "shallow_water";

    if (elev.coastPotential > 0.60 && e > -0.05 && e < 0.15) return "coast_edge";

    if (elev.polarInfluence > 0.48 && e > SEA_LEVEL) return "polar_icefield";
    if (elev.tundraInfluence > 0.44 && e > SEA_LEVEL) return "tundra_subpolar";

    if (elev.waterfallCandidate > 0.52 && e > SEA_LEVEL) return "waterfall_escarpment";
    if (elev.escarpmentPotential > 0.56 && e > SEA_LEVEL) return "cliff_escarpment";
    if (elev.canyonPotential > 0.50 && e > SEA_LEVEL) return "canyon_corridor";

    if (summitClass !== "none" && elev.summitPotential > 0.58 && e > SEA_LEVEL) return "summit_region";

    if (elev.mountainArcPotential > 0.58 && e > 0.20) return "mountain_arc";
    if (elev.alpineInfluence > 0.50 && e > 0.16) return "alpine_ridge";
    if (elev.plateauPotential > 0.54 && e > 0.14) return "plateau_interior";
    if (elev.basinPotential > 0.46 && e < 0.20 && e > SEA_LEVEL) return "basin_floor";

    if (elev.archipelagoPotential > 0.46 && e > -0.03 && e < 0.28) return "island_arc";

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

    if (elev.continentPotential > 0.38 && e > SEA_LEVEL) return "continent_mass";
    if (e > SEA_LEVEL) return "raised_land";

    return "deep_ocean";
  };

  const compatibilityClassFor = (expanded, elev, base, flags) => {
    switch (expanded) {
      case "deep_ocean":
      case "ocean_basin":
        return "deep_water";

      case "continental_shelf":
      case "shallow_water":
      case "continent_divide":
        return elev.bridgePotential > 0.38 ? "shallow_saddle" : "shallow_water";

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
        return elev.continentPotential > 0.62 ? "continental_core" : "raised_shield";

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
        if (elev.continentPotential > 0.64 && elev.elevation > 0.20) return "continental_core";
        if (elev.shieldPotential > 0.48 && elev.elevation > 0.08) return "raised_shield";
        if (elev.shelfPotential > 0.48 && elev.elevation < 0.18) return "coastal_shelf";
        return elev.elevation > SEA_LEVEL ? "raised_shield" : "deep_water";
    }
  };

  const sample = (...args) => {
    const p = parseInput(...args);
    const inputMeta =
      args.length === 1 && args[0] && typeof args[0] === "object"
        ? args[0]
        : null;

    const elevationSample = readElevation(...args);
    const base = computeBaseFields(elevationSample, p, inputMeta);
    const climateClass = climateClassFor(elevationSample.climateHint);
    const continentClass = continentClassFor(elevationSample.continentId);
    const summitClass = summitClassFor(elevationSample.summitRegionHint, elevationSample.summitPotential);
    const flags = candidateFlags(elevationSample, base);
    const worldTerrainClass = terrainClassExpanded(elevationSample, base, flags, climateClass, summitClass);
    const compatibilityTerrainClass = compatibilityClassFor(worldTerrainClass, elevationSample, base, flags);
    const expandedSupported = materialSupportsExpandedTerrain();

    const terrainClass = expandedSupported ? worldTerrainClass : compatibilityTerrainClass;

    const composition = {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "composition",
      sourceAuthority: "hearth.elevation.js",

      x: p.x,
      y: p.y,
      z: p.z,

      elevation: elevationSample.elevation,
      seaLevel: elevationSample.seaLevel,

      terrainClass,
      terrainClassHint: elevationSample.terrainClassHint,
      worldTerrainClass,
      expandedTerrainClass: worldTerrainClass,
      semanticTerrainClass: worldTerrainClass,
      compatibilityTerrainClass,
      bridgeEraCompatibilityClass: compatibilityTerrainClass,
      expandedTerrainSupportedByMaterials: expandedSupported,

      continentId: elevationSample.continentId,
      continentName: elevationSample.continentName,
      continentIndex: elevationSample.continentIndex,
      continentClass,
      continentRoleHint: CONTINENT_ROLE_HINTS[elevationSample.continentId] || CONTINENT_ROLE_HINTS.open_ocean,
      continentPotential: elevationSample.continentPotential,
      continentSeparation: elevationSample.continentSeparation,
      nearestContinentDistance: elevationSample.nearestContinentDistance,
      oceanBasinPotential: elevationSample.oceanBasinPotential,
      continentShelfPotential: elevationSample.continentShelfPotential,

      climateHint: elevationSample.climateHint,
      climateClass,
      climatePotential: elevationSample.climatePotential,
      climateInfluences: { ...elevationSample.climateInfluences },

      polarInfluence: elevationSample.polarInfluence,
      tundraInfluence: elevationSample.tundraInfluence,
      temperateInfluence: elevationSample.temperateInfluence,
      stormCoastInfluence: elevationSample.stormCoastInfluence,
      rainforestInfluence: elevationSample.rainforestInfluence,
      monsoonInfluence: elevationSample.monsoonInfluence,
      desertInfluence: elevationSample.desertInfluence,
      alpineInfluence: elevationSample.alpineInfluence,
      maritimeInfluence: elevationSample.maritimeInfluence,

      summitRegionHint: elevationSample.summitRegionHint,
      summitRegionLabel: elevationSample.summitRegionLabel,
      summitTerrainHint: elevationSample.summitTerrainHint,
      summitPotential: elevationSample.summitPotential,
      summitClass,

      mountainArcPotential: elevationSample.mountainArcPotential,
      plateauPotential: elevationSample.plateauPotential,
      canyonPotential: elevationSample.canyonPotential,
      escarpmentPotential: elevationSample.escarpmentPotential,
      waterfallCandidate: elevationSample.waterfallCandidate,
      archipelagoPotential: elevationSample.archipelagoPotential,
      scarPotential: elevationSample.scarPotential,

      isLand: elevationSample.elevation > SEA_LEVEL,
      isWater: elevationSample.elevation <= SEA_LEVEL,
      isShallowWater: elevationSample.isShallowWater,
      isDeepWater: elevationSample.isDeepWater,

      landPotential: elevationSample.landPotential,
      shelfPotential: elevationSample.shelfPotential,
      bridgePotential: elevationSample.bridgePotential,
      ridgePotential: elevationSample.ridgePotential,
      saddlePotential: elevationSample.saddlePotential,
      basinPotential: elevationSample.basinPotential,
      islandPotential: elevationSample.islandPotential,
      coastPotential: elevationSample.coastPotential,
      waterDepthPotential: elevationSample.waterDepthPotential,
      corePotential: elevationSample.corePotential,
      shieldPotential: elevationSample.shieldPotential,

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

      dominantCoreId: elevationSample.dominantCoreId,

      elevationReceipt: elevationSample.receipt,
      elevationContract: elevationSample.contract,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      finalVisualPassClaim: false
    };

    return composition;
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
    version: VERSION,
    authority: "composition",
    status: "active",
    sourceAuthority: "hearth.elevation.js",
    purpose: "seven-continent-nine-climate-composition-and-surface-mass-anchoring",
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
    climateClasses: { ...CLIMATE_CLASSES },
    summitClasses: { ...SUMMIT_CLASSES },
    exposedFields: [
      "terrainClass",
      "worldTerrainClass",
      "compatibilityTerrainClass",
      "continentId",
      "continentName",
      "continentIndex",
      "continentClass",
      "continentRoleHint",
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
      "oceanBasinPotential",
      "continentShelfPotential",
      "mountainArcPotential",
      "plateauPotential",
      "canyonPotential",
      "escarpmentPotential",
      "waterfallCandidate",
      "archipelagoPotential"
    ],
    designRules: [
      "seven continents carried forward",
      "nine climates carried forward",
      "summit regions are nonlinear overlays",
      "bridge-era classes demoted to compatibility aliases",
      "materials held until class language is live",
      "canvas held after v6 runtime recovery"
    ],
    forbiddenOwnership: [
      "colors",
      "material-palette",
      "canvas-drawing",
      "runtime-motion",
      "controls",
      "route-ui",
      "teleports",
      "final-visual-claim"
    ],
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    finalVisualPassClaim: false
  });

  const api = {
    CONTRACT,
    RECEIPT,
    PREVIOUS_CONTRACT,
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
    climateClasses: { ...CLIMATE_CLASSES },
    summitClasses: { ...SUMMIT_CLASSES },

    supportsSevenContinentNineClimateComposition: true,
    supportsExpandedHearthTerrain: true,
    finalVisualPassClaim: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.composition = api;

  root.HEARTH_COMPOSITION = api;
  root.HearthComposition = api;
  root.HEARTH_COMPOSITION_RECEIPT = getReceipt();
  root.HEARTH_COMPOSITION_CONTRACT = CONTRACT;
  root.HEARTH_COMPOSITION_SUPPORTS_SEVEN_CONTINENT_NINE_CLIMATE = true;

  document.documentElement.dataset.hearthCompositionAuthorityLoaded = "true";
  document.documentElement.dataset.hearthCompositionContract = CONTRACT;
  document.documentElement.dataset.hearthCompositionReceipt = RECEIPT;
  document.documentElement.dataset.hearthCompositionPreviousContract = PREVIOUS_CONTRACT;
  document.documentElement.dataset.hearthCompositionSevenContinents = "true";
  document.documentElement.dataset.hearthCompositionNineClimates = "true";
  document.documentElement.dataset.hearthCompositionSummitsNonlinear = "true";
  document.documentElement.dataset.hearthCompositionExpandedTerrainClasses = "true";
  document.documentElement.dataset.hearthCompositionBridgeDemoted = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.webgl = "false";
  document.documentElement.dataset.visualPassClaimed = "false";

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

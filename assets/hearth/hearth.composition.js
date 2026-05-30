// /assets/hearth/hearth.composition.js
// HEARTH_NEWS_FIBONACCI_WATERLINE_BODY_SEAT_COMPOSITION_TNT_v3
// Full-file replacement.
// Composition coordination authority only.
// Purpose:
// - Consume HEARTH_TECTONICS_SEATED_ELEVATION_RESOLVER_TNT_v2.
// - Align composition coordinates to the same u/v law used by tectonics and elevation.
// - Map terrain definitively by coordinate using NEWS protocol and Fibonacci synchronization.
// - Preserve the correction that bodySeatPressure is not exposedLandPressure.
// - Convert resolved elevation packets into material-ready terrain classes.
// - Preserve downstream hydrology/materials/canvas compatibility fields.
// - Relay tectonics-seated proof fields downstream.
// Does not own:
// - tectonic cause
// - elevation generation
// - hydrology decisions
// - material palette
// - canvas drawing
// - runtime motion
// - controls
// - route orchestration
// - teleports
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_NEWS_FIBONACCI_WATERLINE_BODY_SEAT_COMPOSITION_TNT_v3";
  const RECEIPT = "HEARTH_NEWS_FIBONACCI_WATERLINE_BODY_SEAT_COMPOSITION_RECEIPT_v3";
  const PREVIOUS_CONTRACT = "HEARTH_TECTONICS_SEATED_COMPOSITION_COORDINATION_TNT_v2";
  const BASELINE_CONTRACT = "HEARTH_TECTONICS_SEATED_COMPOSITION_COORDINATION_TNT_v2";
  const REQUIRED_ELEVATION_CONTRACT = "HEARTH_TECTONICS_SEATED_ELEVATION_RESOLVER_TNT_v2";
  const VERSION = "2026-05-30.hearth-news-fibonacci-waterline-body-seat-composition-v3";

  const SEA_LEVEL = 0.0;
  const DEG = Math.PI / 180;
  const EPSILON = 0.000001;

  const root = typeof window !== "undefined" ? window : globalThis;

  const NEWS_SEQUENCE = Object.freeze([
    "NORTH_BOUNDARY",
    "EAST_FORMATION",
    "WEST_FRACTURE",
    "SOUTH_OUTPUT"
  ]);

  const FIBONACCI_SYNCHRONIZATION = Object.freeze({
    F5_BODY_SEAT_PRESSURE: {
      rank: 5,
      gate: "body-seat-pressure-resolved",
      owns: "body seat pressure detection only"
    },
    F8_WATERLINE_RECONCILIATION: {
      rank: 8,
      gate: "waterline-body-seat-reconciliation",
      owns: "body seat and waterline separation"
    },
    F13_TERRAIN_CLASSIFICATION: {
      rank: 13,
      gate: "coordinate terrain classification",
      owns: "material-ready terrain class selection"
    },
    F21_DOWNSTREAM_COMPATIBILITY_READY: {
      rank: 21,
      gate: "downstream compatibility output",
      owns: "hydrology/materials/canvas receiver fields"
    }
  });

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
    open_ocean: "open_ocean",
    unresolved_crustal_province: "unresolved_crustal_province"
  });

  const CONTINENT_ROLE_HINTS = Object.freeze({
    western_shield: "old shield continent with plateau interior, stable highland mass, storm coast, and hardened shelf edge",
    eastern_basin: "basin-rim continent with floodplain pressure, lowland interior, dry plateau edges, and river-basin descent",
    northern_cold: "polar and subpolar continent with icefield, tundra, fjords, glacial passes, and cold shelf margins",
    southern_harsh: "survival-pressure continent with dry highland, wind-cut escarpment, harsh plateau, and cold desert pressure",
    equatorial_wet: "wet equatorial continent with rainforest basin, monsoon floodplain, waterfalls, and saturated lowland pressure",
    mountain_arc: "tectonic challenge continent with alpine ridges, canyon corridors, cliffs, high passes, and mountain arcs",
    broken_archipelago: "fragmented continent with drowned shelves, maritime island arcs, broken coastlines, and archipelago thresholds",
    unresolved_crustal_province: "resolved tectonic province without legacy continent alias",
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

  let materialSupportMemo = null;

  const clamp = (value, min, max) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  };

  const clamp01 = (value) => clamp(value, 0, 1);

  const smoothstep = (edge0, edge1, x) => {
    const d = edge1 - edge0 || 1;
    const t = clamp01((x - edge0) / d);
    return t * t * (3 - 2 * t);
  };

  const softBand = (value, center, width) => {
    const t = 1 - clamp(Math.abs(value - center) / Math.max(EPSILON, width), 0, 1);
    return t * t * (3 - 2 * t);
  };

  const wrap01 = (value) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    return ((n % 1) + 1) % 1;
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

  const vectorToLonLat = (p) => {
    const n = normalize3(p);
    return {
      lon: Math.atan2(n.x, n.z) / DEG,
      lat: Math.asin(clamp(n.y, -1, 1)) / DEG
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

  const lonToU = (lon) => wrap01((Number(lon) + 180) / 360);
  const latToV = (lat) => clamp((90 - Number(lat)) / 180, 0, 1);
  const uToLon = (u) => wrap01(u) * 360 - 180;
  const vToLat = (v) => 90 - clamp(Number(v), 0, 1) * 180;

  const withCoordinateFields = (vector, lon, lat, u, v) => ({
    ...vector,
    lon,
    lat,
    u,
    v
  });

  const parseInput = (...args) => {
    if (args.length === 1 && args[0] && typeof args[0] === "object") {
      const p = args[0];

      if (Number.isFinite(Number(p.u)) && Number.isFinite(Number(p.v))) {
        const u = wrap01(p.u);
        const v = clamp(Number(p.v), 0, 1);
        const lon = uToLon(u);
        const lat = vToLat(v);
        return withCoordinateFields(lonLatToVector(lon, lat), lon, lat, u, v);
      }

      if (Number.isFinite(Number(p.lon)) && Number.isFinite(Number(p.lat))) {
        const lon = Number(p.lon);
        const lat = Number(p.lat);
        return withCoordinateFields(lonLatToVector(lon, lat), lon, lat, lonToU(lon), latToV(lat));
      }

      if (Number.isFinite(Number(p.longitude)) && Number.isFinite(Number(p.latitude))) {
        const lon = Number(p.longitude);
        const lat = Number(p.latitude);
        return withCoordinateFields(lonLatToVector(lon, lat), lon, lat, lonToU(lon), latToV(lat));
      }

      if (
        Number.isFinite(Number(p.x)) &&
        Number.isFinite(Number(p.y)) &&
        Number.isFinite(Number(p.z))
      ) {
        const vector = normalize3(p);
        const ll = vectorToLonLat(vector);
        return withCoordinateFields(vector, ll.lon, ll.lat, lonToU(ll.lon), latToV(ll.lat));
      }
    }

    if (args.length >= 3) {
      const vector = normalize3({ x: args[0], y: args[1], z: args[2] });
      const ll = vectorToLonLat(vector);
      return withCoordinateFields(vector, ll.lon, ll.lat, lonToU(ll.lon), latToV(ll.lat));
    }

    if (args.length >= 2) {
      const lon = Number(args[0]);
      const lat = Number(args[1]);
      return withCoordinateFields(lonLatToVector(lon, lat), lon, lat, lonToU(lon), latToV(lat));
    }

    return withCoordinateFields(lonLatToVector(0, 0), 0, 0, 0.5, 0.5);
  };

  const coordinatesValid = (p) => Boolean(
    p &&
    Number.isFinite(p.x) &&
    Number.isFinite(p.y) &&
    Number.isFinite(p.z) &&
    Number.isFinite(p.lon) &&
    Number.isFinite(p.lat) &&
    Number.isFinite(p.u) &&
    Number.isFinite(p.v) &&
    p.u >= 0 &&
    p.u <= 1 &&
    p.v >= 0 &&
    p.v <= 1
  );

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
      requiredTectonicsContract: source.requiredTectonicsContract || "",

      x: Number.isFinite(Number(source.x)) ? Number(source.x) : p.x,
      y: Number.isFinite(Number(source.y)) ? Number(source.y) : p.y,
      z: Number.isFinite(Number(source.z)) ? Number(source.z) : p.z,
      lon: Number.isFinite(Number(source.lon)) ? Number(source.lon) : p.lon,
      lat: Number.isFinite(Number(source.lat)) ? Number(source.lat) : p.lat,
      u: Number.isFinite(Number(source.u)) ? wrap01(source.u) : p.u,
      v: Number.isFinite(Number(source.v)) ? clamp(Number(source.v), 0, 1) : p.v,

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

      summitRegionHint: typeof source.summitRegionHint === "string" && source.summitRegionHint ? source.summitRegionHint : "none",
      summitRegionLabel: typeof source.summitRegionLabel === "string" && source.summitRegionLabel ? source.summitRegionLabel : "None",
      summitTerrainHint: typeof source.summitTerrainHint === "string" && source.summitTerrainHint ? source.summitTerrainHint : "none",
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

      dominantCoreId: source.dominantCoreId || continentId,

      tectonicsAvailable: source.tectonicsAvailable === true,
      tectonicsConsumed: source.tectonicsConsumed === true,
      tectonicsContract: typeof source.tectonicsContract === "string" ? source.tectonicsContract : "",
      tectonicsReceipt: typeof source.tectonicsReceipt === "string" ? source.tectonicsReceipt : "",
      tectonicsStructuralClass: typeof source.tectonicsStructuralClass === "string" ? source.tectonicsStructuralClass : "",
      tectonicsDominantStructuralCause: typeof source.tectonicsDominantStructuralCause === "string" ? source.tectonicsDominantStructuralCause : "",
      elevationResolvedFromTectonics: source.elevationResolvedFromTectonics === true,

      tectonicElevationInfluence: clamp01(source.tectonicElevationInfluence),
      tectonicDepth: clamp01(source.tectonicDepth),
      tectonicSubsurfacePressure: clamp01(source.tectonicSubsurfacePressure),
      tectonicPlateStress: clamp01(source.tectonicPlateStress),
      tectonicCrustalCompression: clamp01(source.tectonicCrustalCompression),
      tectonicRidgePressure: clamp01(source.tectonicRidgePressure),
      tectonicBasinPressure: clamp01(source.tectonicBasinPressure),
      tectonicScarPressure: clamp01(source.tectonicScarPressure),
      tectonicAncientChannelCut: clamp01(source.tectonicAncientChannelCut),
      tectonicShelfCutPressure: clamp01(source.tectonicShelfCutPressure),
      tectonicBuriedStructure: clamp01(source.tectonicBuriedStructure),

      crustalProvincePressure: clamp01(source.crustalProvincePressure),
      crustalProvinceId: source.crustalProvinceId || "",
      crustalProvinceLabel: source.crustalProvinceLabel || "",
      continentalMassPressure: clamp01(source.continentalMassPressure),
      oceanBasinPressure: clamp01(source.oceanBasinPressure),
      oceanBasinId: source.oceanBasinId || "",
      oceanBasinLabel: source.oceanBasinLabel || "",
      coastBoundaryMemory: clamp01(source.coastBoundaryMemory),
      ridgeCollisionPressure: clamp01(source.ridgeCollisionPressure),
      ridgeCollisionId: source.ridgeCollisionId || "",
      ridgeCollisionLabel: source.ridgeCollisionLabel || "",
      plateauUpliftPressure: clamp01(source.plateauUpliftPressure),
      basinSinkPressure: clamp01(source.basinSinkPressure),
      fractureCutPressure: clamp01(source.fractureCutPressure),
      tectonicSummitPressure: clamp01(source.tectonicSummitPressure),
      tectonicSummitPressureId: source.tectonicSummitPressureId || "none",
      tectonicSummitPressureLabel: source.tectonicSummitPressureLabel || "None"
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
        contract: "HEARTH_COMPOSITION_COORDINATION_FALLBACK_ELEVATION",
        receipt: "FALLBACK_ELEVATION_AUTHORITY_NOT_FOUND",
        x: p.x,
        y: p.y,
        z: p.z,
        lon: p.lon,
        lat: p.lat,
        u: p.u,
        v: p.v,
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

    if (
      args.length === 1 &&
      args[0] &&
      typeof args[0] === "object" &&
      Number.isFinite(Number(args[0].elevation))
    ) {
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
            return normalizeElevationSample(fn.call(authority, { u: p.u, v: p.v, lon: p.lon, lat: p.lat, x: p.x, y: p.y, z: p.z }), p);
          } catch (_error2) {
            return fallbackElevationSample(p);
          }
        }
      }
    }

    return fallbackElevationSample(p);
  };

  const materialSupportsExpandedTerrain = () => {
    if (materialSupportMemo !== null) return materialSupportMemo;

    const materials =
      root.HEARTH_MATERIALS ||
      root.HearthMaterials ||
      (root.HEARTH && root.HEARTH.materials) ||
      null;

    if (root.HEARTH_MATERIALS_SUPPORTS_SEVEN_CLIMATE_TERRAIN_CLASSES === true) {
      materialSupportMemo = true;
      return materialSupportMemo;
    }

    if (root.HEARTH_MATERIALS_SUPPORTS_SEVEN_CONTINENT_NINE_CLIMATE_TERRAIN === true) {
      materialSupportMemo = true;
      return materialSupportMemo;
    }

    if (materials && materials.supportsExpandedHearthTerrain === true) {
      materialSupportMemo = true;
      return materialSupportMemo;
    }

    if (materials && materials.supportsSevenContinentNineClimateTerrain === true) {
      materialSupportMemo = true;
      return materialSupportMemo;
    }

    if (materials && materials.supportsSevenClimateTerrainClasses === true) {
      materialSupportMemo = true;
      return materialSupportMemo;
    }

    if (materials && Array.isArray(materials.terrainClasses)) {
      materialSupportMemo = EXPANDED_TERRAIN_CLASSES.some((name) => materials.terrainClasses.includes(name));
      return materialSupportMemo;
    }

    if (materials && materials.materialClassMap && typeof materials.materialClassMap === "object") {
      materialSupportMemo = EXPANDED_TERRAIN_CLASSES.some((name) =>
        Object.prototype.hasOwnProperty.call(materials.materialClassMap, name)
      );
      return materialSupportMemo;
    }

    materialSupportMemo = true;
    return materialSupportMemo;
  };

  const resetMaterialSupportMemo = () => {
    materialSupportMemo = null;
  };

  const climateClassFor = (hint) => CLIMATE_CLASS_MAP[hint] || "open_ocean";
  const continentClassFor = (id) => CONTINENT_CLASSES[id] || "open_ocean";

  const summitClassFor = (hint, potential) => {
    if (potential <= 0.52) return "none";
    return SUMMIT_CLASS_MAP[hint] || "summit_region";
  };

  const computeBaseFields = (elev, p, inputMeta) => {
    const e = elev.elevation;

    const shallowBand = elev.isShallowWater ? 1 : 0;
    const deepBand = elev.isDeepWater ? 1 : 0;

    const oceanStrength = clamp01(elev.oceanBasinPotential);
    const shelfStrength = clamp01(Math.max(elev.shelfPotential, elev.continentShelfPotential));
    const coastStrength = clamp01(elev.coastPotential);
    const continentStrength = clamp01(elev.continentPotential);
    const divideStrength = clamp01(elev.continentSeparation);
    const mountainStrength = clamp01(Math.max(elev.mountainArcPotential, elev.ridgePotential));
    const plateauStrength = clamp01(elev.plateauPotential);
    const canyonStrength = clamp01(elev.canyonPotential);
    const escarpmentStrength = clamp01(elev.escarpmentPotential);
    const waterfallStrength = clamp01(elev.waterfallCandidate);
    const archipelagoStrength = clamp01(Math.max(elev.archipelagoPotential, elev.islandPotential));
    const summitStrength = clamp01(elev.summitPotential);

    const exposedLandPressure = e > SEA_LEVEL
      ? clamp01(smoothstep(-0.02, 0.26, e) * 0.72 + elev.landPotential * 0.28)
      : 0;

    const belowSeaLevelPressure = e <= SEA_LEVEL
      ? clamp01(smoothstep(-0.72, -0.02, -e) * 0.56 + elev.waterDepthPotential * 0.44)
      : 0;

    const waterlinePressure = clamp01(
      softBand(e, SEA_LEVEL, 0.18) * 0.42 +
      shelfStrength * 0.22 +
      coastStrength * 0.18 +
      archipelagoStrength * shallowBand * 0.10 +
      divideStrength * shallowBand * 0.08
    );

    const tectonicBodyFeed = clamp01(
      elev.continentalMassPressure * 0.28 +
      elev.crustalProvincePressure * 0.16 +
      elev.tectonicCrustalCompression * 0.10 +
      elev.tectonicBuriedStructure * 0.08 +
      elev.tectonicSubsurfacePressure * 0.06
    );

    const bodySeatPressure = clamp01(
      continentStrength * 0.30 +
      tectonicBodyFeed +
      elev.shieldPotential * 0.08 +
      shelfStrength * 0.08 +
      coastStrength * 0.06 +
      archipelagoStrength * 0.05 +
      smoothstep(-0.28, 0.18, e) * 0.07
    );

    const bodySeatWaterConflictPressure = clamp01(
      bodySeatPressure * 0.44 +
      belowSeaLevelPressure * 0.28 +
      waterlinePressure * 0.20 +
      shelfStrength * 0.08
    );

    const submergedBodySeatPressure = e <= SEA_LEVEL
      ? clamp01(bodySeatPressure * 0.62 + bodySeatWaterConflictPressure * 0.38)
      : 0;

    const exposedBodySeatPressure = e > SEA_LEVEL
      ? clamp01(bodySeatPressure * 0.64 + exposedLandPressure * 0.36)
      : 0;

    const bodySeatPressureDiffersFromExposedLandPressure = Math.abs(bodySeatPressure - exposedLandPressure) > EPSILON;

    const shorelineContact = clamp01(
      coastStrength * 0.48 +
      shelfStrength * smoothstep(-0.22, 0.08, e) * 0.24 +
      waterlinePressure * 0.20 +
      archipelagoStrength * 0.08 +
      divideStrength * shallowBand * 0.10
    );

    const shelfDrop = clamp01(
      shelfStrength * 0.34 +
      coastStrength * smoothstep(-0.08, 0.18, e) * 0.22 +
      oceanStrength * shelfStrength * 0.20 +
      waterlinePressure * 0.16 +
      divideStrength * shallowBand * 0.08
    );

    const slopePressure = clamp01(
      mountainStrength * 0.28 +
      escarpmentStrength * 0.32 +
      canyonStrength * 0.22 +
      waterfallStrength * 0.22 +
      shelfDrop * 0.16 +
      divideStrength * 0.08
    );

    const reliefStrength = clamp01(
      smoothstep(-0.02, 0.52, e) * 0.18 +
      mountainStrength * 0.28 +
      plateauStrength * 0.16 +
      canyonStrength * 0.12 +
      escarpmentStrength * 0.16 +
      slopePressure * 0.16 +
      summitStrength * 0.10
    );

    const materialDensity = clamp01(
      exposedLandPressure * 0.34 +
      bodySeatPressure * 0.18 +
      continentStrength * 0.12 +
      plateauStrength * 0.12 +
      mountainStrength * 0.10 +
      summitStrength * 0.07 -
      oceanStrength * 0.16 -
      deepBand * 0.08 -
      submergedBodySeatPressure * 0.04
    );

    const massAnchor = clamp01(
      bodySeatPressure * 0.34 +
      exposedLandPressure * 0.18 +
      materialDensity * 0.22 +
      reliefStrength * 0.12 +
      shorelineContact * 0.08 +
      plateauStrength * 0.06
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
      limbPressure * (0.34 + bodySeatPressure * 0.24 + massAnchor * 0.22 + shorelineContact * 0.12 + reliefStrength * 0.08)
    );

    const curvatureLock = clamp01(
      0.66 +
      bodySeatPressure * 0.14 +
      massAnchor * 0.12 +
      materialDensity * 0.06 +
      shorelineContact * 0.04 +
      continentStrength * 0.03
    );

    const contactOcclusion = clamp01(
      shorelineContact * 0.30 +
      shelfDrop * 0.22 +
      massAnchor * rimCompression * 0.14 +
      reliefStrength * slopePressure * 0.18 +
      submergedBodySeatPressure * 0.10 +
      escarpmentStrength * 0.10 +
      waterfallStrength * 0.08
    );

    const underlandShadow = clamp01(
      contactOcclusion * 0.52 +
      submergedBodySeatPressure * 0.20 +
      shelfDrop * 0.12 +
      shorelineContact * 0.10 +
      divideStrength * shallowBand * 0.08 +
      oceanStrength * shelfStrength * 0.06
    );

    const surfaceAttachment = clamp01(
      curvatureLock * 0.28 +
      massAnchor * 0.30 +
      bodySeatPressure * 0.14 +
      materialDensity * 0.16 +
      contactOcclusion * 0.08 +
      plateauStrength * exposedLandPressure * 0.04
    );

    return {
      exposedLandPressure,
      belowSeaLevelPressure,
      waterlinePressure,
      bodySeatPressure,
      bodySeatPressureDiffersFromExposedLandPressure,
      bodySeatWaterConflictPressure,
      submergedBodySeatPressure,
      exposedBodySeatPressure,
      waterlineReconciled: true,
      bodySeatCollapsePrevented: submergedBodySeatPressure > 0.20 && exposedLandPressure <= 0.05,

      positiveLand: exposedLandPressure,
      exposedLand: exposedLandPressure > 0.08 ? 1 : 0,
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
    const visibleLand = base.exposedLandPressure > 0.12;
    const bodySeat = base.bodySeatPressure > 0.18;
    const submergedSeat = base.submergedBodySeatPressure > 0.22;

    const mountainCandidate = clamp01(
      smoothstep(0.24, 0.66, e) * 0.24 +
      elev.mountainArcPotential * 0.46 +
      elev.ridgePotential * 0.18 +
      elev.summitPotential * 0.12
    );

    const cliffCandidate = clamp01(
      base.slopePressure * 0.28 +
      base.shelfDrop * 0.16 +
      elev.escarpmentPotential * 0.42 +
      elev.waterfallCandidate * 0.24 +
      elev.coastPotential * 0.08
    );

    const valleyCandidate = clamp01(
      elev.basinPotential * 0.34 +
      elev.canyonPotential * 0.42 +
      elev.saddlePotential * 0.16 +
      elev.scarPotential * 0.12
    );

    const coastCandidate = clamp01(
      elev.coastPotential * 0.48 +
      base.shorelineContact * 0.34 +
      base.waterlinePressure * 0.18 +
      elev.continentShelfPotential * 0.10
    );

    return {
      ocean_basin: elev.oceanBasinPotential > 0.52 || e <= -0.30,
      deep_ocean: e <= -0.22 && elev.oceanBasinPotential > 0.32 && !submergedSeat,
      body_seat_present: bodySeat,
      submerged_body_seat: submergedSeat,
      exposed_body_seat: base.exposedBodySeatPressure > 0.20,
      body_seat_not_exposed_land: base.bodySeatPressureDiffersFromExposedLandPressure,
      waterline_body_conflict: base.bodySeatWaterConflictPressure > 0.30 && e <= 0.06,
      continent_divide: elev.continentSeparation > 0.46 && bodySeat && (e <= 0.08 || elev.waterDepthPotential > 0.12),
      continental_shelf: elev.continentShelfPotential > 0.34 && bodySeat && e <= 0.08,
      archipelago_shelf: elev.archipelagoPotential > 0.34 && e <= 0.08,
      shallow_water: e <= SEA_LEVEL && e > -0.18,
      coast_edge: coastCandidate > 0.50 && e > -0.05 && e < 0.16,
      mountain_candidate: mountainCandidate > 0.52 && visibleLand,
      cliff_candidate: cliffCandidate > 0.50 && visibleLand,
      valley_candidate: valleyCandidate > 0.46,
      canyon_corridor: elev.canyonPotential > 0.48 && visibleLand,
      waterfall_escarpment: elev.waterfallCandidate > 0.48 && visibleLand,
      island_seed: Math.max(elev.archipelagoPotential, elev.islandPotential) > 0.40 && e > -0.08 && e < 0.30,
      solid_land: visibleLand && base.massAnchor > 0.38,
      summit_region: elev.summitPotential > 0.52 && visibleLand
    };
  };

  const worldTerrainClassFor = (elev, base, flags, climateClass, summitClass) => {
    const e = elev.elevation;
    const visibleLand = base.exposedLandPressure > 0.12;

    if (flags.continent_divide) return "continent_divide";
    if (flags.archipelago_shelf) return "archipelago_shelf";
    if (flags.continental_shelf || flags.submerged_body_seat) return "continental_shelf";

    if (e <= -0.34 || elev.oceanBasinPotential > 0.64) return "ocean_basin";
    if (e <= -0.22 && elev.continentShelfPotential < 0.26 && elev.archipelagoPotential < 0.26) return "deep_ocean";
    if (flags.shallow_water) return "shallow_water";
    if (flags.coast_edge) return "coast_edge";

    if (!visibleLand) return elev.oceanBasinPotential > 0.34 ? "ocean_basin" : "shallow_water";

    if (elev.polarInfluence > 0.48) return "polar_icefield";
    if (elev.tundraInfluence > 0.44) return "tundra_subpolar";

    if (flags.waterfall_escarpment) return "waterfall_escarpment";
    if (flags.cliff_candidate && elev.escarpmentPotential > 0.42) return "cliff_escarpment";
    if (flags.canyon_corridor) return "canyon_corridor";

    if (elev.mountainArcPotential > 0.56 && e > 0.12) return "mountain_arc";
    if (elev.alpineInfluence > 0.50 && e > 0.10) return "alpine_ridge";
    if (elev.plateauPotential > 0.52 && e > 0.10) return "plateau_interior";
    if (elev.basinPotential > 0.44 && e < 0.24) return "basin_floor";
    if (elev.archipelagoPotential > 0.42 && e < 0.28) return "island_arc";

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

    if (summitClass !== "none" && elev.summitPotential > 0.68) return "summit_region";
    if (elev.continentPotential > 0.32 || base.bodySeatPressure > 0.28) return "continent_mass";

    return "raised_land";
  };

  const compatibilityClassFor = (expanded, elev, base, flags) => {
    switch (expanded) {
      case "deep_ocean":
      case "ocean_basin":
        return flags.submerged_body_seat ? "submerged_bridge" : "deep_water";

      case "continental_shelf":
      case "shallow_water":
      case "continent_divide":
        if (flags.submerged_body_seat) return "submerged_bridge";
        return elev.scarPotential > 0.28 || elev.continentSeparation > 0.32 ? "shallow_saddle" : "shallow_water";

      case "archipelago_shelf":
        return flags.submerged_body_seat ? "submerged_bridge" : "coastal_shelf";

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
        return elev.continentPotential > 0.60 || base.bodySeatPressure > 0.55 ? "continental_core" : "raised_shield";

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

  const computeNewsFibonacciSync = (p, elev, base, flags, worldTerrainClass, compatibilityTerrainClass, terrainClass, expandedSupported) => {
    const northBoundaryPassed = Boolean(
      coordinatesValid(p) &&
      elev &&
      Number.isFinite(elev.elevation) &&
      typeof elev.contract === "string"
    );

    const eastFormationPassed = Boolean(
      northBoundaryPassed &&
      Number.isFinite(base.bodySeatPressure) &&
      Number.isFinite(base.exposedLandPressure) &&
      base.bodySeatPressureDiffersFromExposedLandPressure === true
    );

    const westFracturePassed = Boolean(
      eastFormationPassed &&
      base.waterlineReconciled === true &&
      flags.body_seat_not_exposed_land === true
    );

    const southOutputPassed = Boolean(
      westFracturePassed &&
      typeof worldTerrainClass === "string" &&
      typeof compatibilityTerrainClass === "string" &&
      typeof terrainClass === "string"
    );

    const f5 = Boolean(eastFormationPassed && Number.isFinite(base.bodySeatPressure));
    const f8 = Boolean(f5 && westFracturePassed);
    const f13 = Boolean(f8 && southOutputPassed);
    const f21 = Boolean(
      f13 &&
      typeof terrainClass === "string" &&
      terrainClass.length > 0 &&
      typeof compatibilityTerrainClass === "string" &&
      compatibilityTerrainClass.length > 0 &&
      expandedSupported === true
    );

    return {
      newsProtocolActive: true,
      newsSequence: NEWS_SEQUENCE.slice(),
      newsCoordinateRead: {
        NORTH_BOUNDARY: {
          passed: northBoundaryPassed,
          coordinateLaw: "lon = u * 360 - 180; lat = 90 - v * 180",
          coordinateValid: coordinatesValid(p),
          elevationPacketPresent: Boolean(elev),
          sourceContract: elev.contract || ""
        },
        EAST_FORMATION: {
          passed: eastFormationPassed,
          bodySeatPressure: base.bodySeatPressure,
          exposedLandPressure: base.exposedLandPressure,
          bodySeatPressureNotExposedLandPressure: true,
          bodySeatPressureSeparatedFromExposedLandPressure: base.bodySeatPressureDiffersFromExposedLandPressure
        },
        WEST_FRACTURE: {
          passed: westFracturePassed,
          waterlinePressure: base.waterlinePressure,
          submergedBodySeatPressure: base.submergedBodySeatPressure,
          bodySeatWaterConflictPressure: base.bodySeatWaterConflictPressure,
          bodySeatCollapsePrevented: base.bodySeatCollapsePrevented,
          waterlineReconciled: base.waterlineReconciled
        },
        SOUTH_OUTPUT: {
          passed: southOutputPassed,
          terrainClass,
          worldTerrainClass,
          compatibilityTerrainClass,
          downstreamCompatibilityReady: f21
        }
      },
      fibonacciSynchronizationActive: true,
      fibonacciGates: {
        F5_BODY_SEAT_PRESSURE: {
          ...FIBONACCI_SYNCHRONIZATION.F5_BODY_SEAT_PRESSURE,
          passed: f5
        },
        F8_WATERLINE_RECONCILIATION: {
          ...FIBONACCI_SYNCHRONIZATION.F8_WATERLINE_RECONCILIATION,
          passed: f8
        },
        F13_TERRAIN_CLASSIFICATION: {
          ...FIBONACCI_SYNCHRONIZATION.F13_TERRAIN_CLASSIFICATION,
          passed: f13
        },
        F21_DOWNSTREAM_COMPATIBILITY_READY: {
          ...FIBONACCI_SYNCHRONIZATION.F21_DOWNSTREAM_COMPATIBILITY_READY,
          passed: f21
        }
      },
      highestFibonacciGate: f21
        ? "F21_DOWNSTREAM_COMPATIBILITY_READY"
        : f13
          ? "F13_TERRAIN_CLASSIFICATION"
          : f8
            ? "F8_WATERLINE_RECONCILIATION"
            : f5
              ? "F5_BODY_SEAT_PRESSURE"
              : "NONE",
      newsProtocolPassed: northBoundaryPassed && eastFormationPassed && westFracturePassed && southOutputPassed,
      fibonacciSynchronizationPassed: f5 && f8 && f13 && f21
    };
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
    const compatibilityTerrainClass = compatibilityClassFor(worldTerrainClass, elev, base, flags);
    const expandedSupported = materialSupportsExpandedTerrain();
    const terrainClass = expandedSupported ? worldTerrainClass : compatibilityTerrainClass;
    const newsFib = computeNewsFibonacciSync(p, elev, base, flags, worldTerrainClass, compatibilityTerrainClass, terrainClass, expandedSupported);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      requiredElevationContract: REQUIRED_ELEVATION_CONTRACT,
      version: VERSION,
      authority: "composition-coordination",
      sourceAuthority: "hearth.elevation.js",
      sourceContract: elev.contract,
      sourceReceipt: elev.receipt,
      compositionAlignedToTectonicsSeatedElevation: elev.contract === REQUIRED_ELEVATION_CONTRACT,

      x: p.x,
      y: p.y,
      z: p.z,
      lon: p.lon,
      lat: p.lat,
      u: p.u,
      v: p.v,
      coordinateLaw: "lon = u * 360 - 180; lat = 90 - v * 180",
      coordinatesDefinitive: true,

      elevation: elev.elevation,
      seaLevel: elev.seaLevel,

      bodySeatPressure: base.bodySeatPressure,
      exposedLandPressure: base.exposedLandPressure,
      bodySeatPressureNotExposedLandPressure: true,
      bodySeatPressureSeparatedFromExposedLandPressure: base.bodySeatPressureDiffersFromExposedLandPressure,
      belowSeaLevelPressure: base.belowSeaLevelPressure,
      waterlinePressure: base.waterlinePressure,
      bodySeatWaterConflictPressure: base.bodySeatWaterConflictPressure,
      submergedBodySeatPressure: base.submergedBodySeatPressure,
      exposedBodySeatPressure: base.exposedBodySeatPressure,
      waterlineReconciled: base.waterlineReconciled,
      bodySeatCollapsePrevented: base.bodySeatCollapsePrevented,

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

      isLand: base.exposedLandPressure > 0.12,
      isWater: elev.elevation <= SEA_LEVEL,
      isShallowWater: elev.isShallowWater,
      isDeepWater: elev.isDeepWater,
      isSubmergedBodySeat: base.submergedBodySeatPressure > 0.22,
      isExposedBodySeat: base.exposedBodySeatPressure > 0.20,

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
      submergedBridgeCandidate: flags.submerged_body_seat ? 1 : 0,
      bodySeatCandidate: flags.body_seat_present ? 1 : 0,

      candidates: flags,

      newsProtocolActive: newsFib.newsProtocolActive,
      newsSequence: newsFib.newsSequence,
      newsCoordinateRead: newsFib.newsCoordinateRead,
      newsProtocolPassed: newsFib.newsProtocolPassed,

      fibonacciSynchronizationActive: newsFib.fibonacciSynchronizationActive,
      fibonacciGates: newsFib.fibonacciGates,
      highestFibonacciGate: newsFib.highestFibonacciGate,
      fibonacciSynchronizationPassed: newsFib.fibonacciSynchronizationPassed,

      dominantCoreId: elev.dominantCoreId,
      elevationReceipt: elev.receipt,
      elevationContract: elev.contract,

      elevationResolvedFromTectonics: elev.elevationResolvedFromTectonics,
      tectonicsAvailable: elev.tectonicsAvailable,
      tectonicsConsumed: elev.tectonicsConsumed,
      tectonicsContract: elev.tectonicsContract,
      tectonicsReceipt: elev.tectonicsReceipt,
      tectonicsStructuralClass: elev.tectonicsStructuralClass,
      tectonicsDominantStructuralCause: elev.tectonicsDominantStructuralCause,

      tectonicElevationInfluence: elev.tectonicElevationInfluence,
      tectonicDepth: elev.tectonicDepth,
      tectonicSubsurfacePressure: elev.tectonicSubsurfacePressure,
      tectonicPlateStress: elev.tectonicPlateStress,
      tectonicCrustalCompression: elev.tectonicCrustalCompression,
      tectonicRidgePressure: elev.tectonicRidgePressure,
      tectonicBasinPressure: elev.tectonicBasinPressure,
      tectonicScarPressure: elev.tectonicScarPressure,
      tectonicAncientChannelCut: elev.tectonicAncientChannelCut,
      tectonicShelfCutPressure: elev.tectonicShelfCutPressure,
      tectonicBuriedStructure: elev.tectonicBuriedStructure,

      crustalProvincePressure: elev.crustalProvincePressure,
      crustalProvinceId: elev.crustalProvinceId,
      crustalProvinceLabel: elev.crustalProvinceLabel,
      continentalMassPressure: elev.continentalMassPressure,
      oceanBasinPressure: elev.oceanBasinPressure,
      oceanBasinId: elev.oceanBasinId,
      oceanBasinLabel: elev.oceanBasinLabel,
      coastBoundaryMemory: elev.coastBoundaryMemory,
      ridgeCollisionPressure: elev.ridgeCollisionPressure,
      ridgeCollisionId: elev.ridgeCollisionId,
      ridgeCollisionLabel: elev.ridgeCollisionLabel,
      plateauUpliftPressure: elev.plateauUpliftPressure,
      basinSinkPressure: elev.basinSinkPressure,
      fractureCutPressure: elev.fractureCutPressure,
      tectonicSummitPressure: elev.tectonicSummitPressure,
      tectonicSummitPressureId: elev.tectonicSummitPressureId,
      tectonicSummitPressureLabel: elev.tectonicSummitPressureLabel,

      ownsTectonicCause: false,
      ownsElevationGeneration: false,
      ownsHydrology: false,
      ownsMaterialPalette: false,
      ownsCanvas: false,
      canvasReceiverOnly: true,
      ownsRuntime: false,
      ownsControls: false,
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
    requiredElevationContract: REQUIRED_ELEVATION_CONTRACT,
    version: VERSION,
    authority: "composition-coordination",
    status: "active",
    destinationFile: "/assets/hearth/hearth.composition.js",
    sourceAuthority: "hearth.elevation.js",
    sourceContract: REQUIRED_ELEVATION_CONTRACT,

    compositionAlignedToTectonicsSeatedElevation: true,
    coordinatesAlignedToElevation: true,
    coordinatesDefinitive: true,
    uVLaw: "lon = u * 360 - 180; lat = 90 - v * 180",

    newsProtocolActive: true,
    newsSequence: NEWS_SEQUENCE.slice(),
    fibonacciSynchronizationActive: true,
    fibonacciSynchronization: { ...FIBONACCI_SYNCHRONIZATION },

    bodySeatPressureNotExposedLandPressure: true,
    bodySeatPressureSeparatedFromExposedLandPressure: true,
    waterlineBodySeatReconciliationActive: true,
    bodySeatCollapsePrevented: true,

    materialSupportCheckMemoized: true,
    materialSupportDefault: "expanded-terrain-supported-until-negative-proof",

    purpose: "news-fibonacci-waterline-body-seat-composition-coordinate-and-classification-coordination",

    requiredUpstream: [
      "hearth.tectonics.js",
      "hearth.elevation.js"
    ],

    preparedDownstream: [
      "hearth.hydrology.js",
      "hearth.materials.js",
      "hearth.canvas.js"
    ],

    terrainClasses: EXPANDED_TERRAIN_CLASSES.slice(),
    compatibilityTerrainClasses: COMPATIBILITY_TERRAIN_CLASSES.slice(),
    continentClasses: { ...CONTINENT_CLASSES },
    climateClasses: { ...CLIMATE_CLASS_MAP },
    summitClasses: { ...SUMMIT_CLASS_MAP },

    exposedFields: [
      "u",
      "v",
      "lon",
      "lat",
      "coordinateLaw",
      "terrainClass",
      "worldTerrainClass",
      "expandedTerrainClass",
      "semanticTerrainClass",
      "compatibilityTerrainClass",
      "bodySeatPressure",
      "exposedLandPressure",
      "bodySeatPressureNotExposedLandPressure",
      "bodySeatPressureSeparatedFromExposedLandPressure",
      "waterlinePressure",
      "submergedBodySeatPressure",
      "exposedBodySeatPressure",
      "bodySeatWaterConflictPressure",
      "bodySeatCollapsePrevented",
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
      "isSubmergedBodySeat",
      "isExposedBodySeat",
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
      "surfaceAttachment",
      "newsProtocolActive",
      "newsSequence",
      "newsCoordinateRead",
      "newsProtocolPassed",
      "fibonacciSynchronizationActive",
      "fibonacciGates",
      "highestFibonacciGate",
      "fibonacciSynchronizationPassed",
      "elevationResolvedFromTectonics",
      "tectonicsConsumed",
      "tectonicsContract",
      "tectonicsStructuralClass",
      "tectonicsDominantStructuralCause"
    ],

    designRules: [
      "consume tectonics-seated elevation",
      "do not generate tectonic cause",
      "do not generate elevation",
      "classify resolved elevation only",
      "map every sample through shared u/v coordinate law",
      "run NEWS sequence before final terrain output",
      "synchronize body seat, waterline, terrain class, and downstream fields through Fibonacci gates",
      "bodySeatPressure is not exposedLandPressure",
      "submerged body seat may exist below the waterline without becoming visible land",
      "carry tectonics-seated proof downstream",
      "compatibility classes remain aliases only",
      "canvas is receiver only",
      "route held",
      "no final visual pass claim"
    ],

    forbiddenOwnership: [
      "tectonic-cause",
      "elevation-generation",
      "hydrology-decisions",
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
    REQUIRED_ELEVATION_CONTRACT,
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
    resetMaterialSupportMemo,

    terrainClasses: EXPANDED_TERRAIN_CLASSES.slice(),
    compatibilityTerrainClasses: COMPATIBILITY_TERRAIN_CLASSES.slice(),
    continentClasses: { ...CONTINENT_CLASSES },
    climateClasses: { ...CLIMATE_CLASS_MAP },
    summitClasses: { ...SUMMIT_CLASS_MAP },

    NEWS_SEQUENCE: NEWS_SEQUENCE.slice(),
    FIBONACCI_SYNCHRONIZATION: { ...FIBONACCI_SYNCHRONIZATION },

    supportsTectonicsSeatedCompositionCoordination: true,
    supportsSharedUVCoordinateLaw: true,
    supportsNewsProtocol: true,
    supportsFibonacciSynchronization: true,
    supportsBodySeatWaterlineSeparation: true,
    supportsBodySeatPressureNotExposedLandPressure: true,
    supportsMaterialSupportMemoization: true,
    supportsSevenContinentRealPlanetComposition: true,
    supportsExpandedHearthTerrain: true,
    supportsNonlinearSummitRegions: true,

    ownsTectonicCause: false,
    ownsElevationGeneration: false,
    ownsHydrology: false,
    ownsMaterialPalette: false,
    ownsCanvas: false,
    canvasReceiverOnly: true,
    ownsRuntime: false,
    ownsControls: false,

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
  root.HEARTH_COMPOSITION_REQUIRED_ELEVATION_CONTRACT = REQUIRED_ELEVATION_CONTRACT;
  root.HEARTH_COMPOSITION_SUPPORTS_TECTONICS_SEATED_COORDINATION = true;
  root.HEARTH_COMPOSITION_SUPPORTS_SHARED_UV_COORDINATE_LAW = true;
  root.HEARTH_COMPOSITION_SUPPORTS_NEWS_PROTOCOL = true;
  root.HEARTH_COMPOSITION_SUPPORTS_FIBONACCI_SYNCHRONIZATION = true;
  root.HEARTH_COMPOSITION_SUPPORTS_BODY_SEAT_WATERLINE_SEPARATION = true;
  root.HEARTH_COMPOSITION_SUPPORTS_BODY_SEAT_NOT_EXPOSED_LAND = true;
  root.HEARTH_COMPOSITION_SUPPORTS_SEVEN_CONTINENT_REAL_PLANET = true;

  if (root.document && root.document.documentElement) {
    const dataset = root.document.documentElement.dataset;

    dataset.hearthCompositionAuthorityLoaded = "true";
    dataset.hearthCompositionContract = CONTRACT;
    dataset.hearthCompositionReceipt = RECEIPT;
    dataset.hearthCompositionPreviousContract = PREVIOUS_CONTRACT;
    dataset.hearthCompositionRequiredElevationContract = REQUIRED_ELEVATION_CONTRACT;
    dataset.hearthCompositionSourceContract = REQUIRED_ELEVATION_CONTRACT;
    dataset.hearthCompositionAlignedToTectonicsSeatedElevation = "true";
    dataset.hearthCompositionCoordinatesAlignedToElevation = "true";
    dataset.hearthCompositionSharedUvLaw = "true";
    dataset.hearthCompositionNewsProtocol = "true";
    dataset.hearthCompositionNewsSequence = NEWS_SEQUENCE.join(">");
    dataset.hearthCompositionFibonacciSynchronization = "true";
    dataset.hearthCompositionF5BodySeatPressure = "true";
    dataset.hearthCompositionF8WaterlineReconciliation = "true";
    dataset.hearthCompositionF13TerrainClassification = "true";
    dataset.hearthCompositionF21DownstreamCompatibility = "true";
    dataset.hearthCompositionBodySeatPressureNotExposedLandPressure = "true";
    dataset.hearthCompositionWaterlineBodySeatReconciliation = "true";
    dataset.hearthCompositionMaterialSupportMemoized = "true";
    dataset.hearthCompositionSevenContinents = "true";
    dataset.hearthCompositionOpenOcean = "true";
    dataset.hearthCompositionNineClimates = "compatibility-labels-only";
    dataset.hearthCompositionNonlinearSummits = "true";
    dataset.hearthCompositionRealPlanetField = "true";
    dataset.hearthCompositionExpandedTerrainClasses = "true";
    dataset.hearthCompositionCanvasReceiverOnly = "true";
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

// /assets/hearth/hearth.elevation.js
// HEARTH_TECTONICS_SEATED_ELEVATION_RESOLVER_TNT_v2
// Full-file replacement.
// Elevation resolver authority only.
// Purpose:
// - Consume HEARTH_STRUCTURAL_CAUSE_TECTONICS_AUTHORITY_TNT_v2.
// - Convert tectonic structural cause into physical height/depth.
// - Preserve downstream compatibility fields for composition, hydrology, materials, and canvas.
// Does not own:
// - tectonic cause
// - final climate
// - biome
// - material palette
// - canvas drawing
// - runtime motion
// - controls
// - route orchestration
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_TECTONICS_SEATED_ELEVATION_RESOLVER_TNT_v2";
  const RECEIPT = "HEARTH_TECTONICS_SEATED_ELEVATION_RESOLVER_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "HEARTH_SEVEN_CONTINENT_REAL_PLANET_ELEVATION_TNT_v1";
  const REQUIRED_TECTONICS_CONTRACT = "HEARTH_STRUCTURAL_CAUSE_TECTONICS_AUTHORITY_TNT_v2";
  const VERSION = "2026-05-28.hearth-tectonics-seated-elevation-resolver-v2";

  const root = typeof window !== "undefined" ? window : globalThis;
  const DEG = Math.PI / 180;
  const SEA_LEVEL = 0.0;
  const EPSILON = 0.000001;

  const ANCHOR = Object.freeze({
    id: "HEARTH_COORDINATE_ANCHOR_0_0",
    u: 0.5,
    v: 0.5,
    lon: 0,
    lat: 0
  });

  const PROVINCE_COMPATIBILITY = Object.freeze({
    western_shield_pressure: {
      id: "western_shield",
      name: "Western Shield Continent",
      index: 0
    },
    eastern_basin_pressure: {
      id: "eastern_basin",
      name: "Eastern Basin Continent",
      index: 1
    },
    northern_cold_pressure: {
      id: "northern_cold",
      name: "Northern Cold Continent",
      index: 2
    },
    southern_harsh_pressure: {
      id: "southern_harsh",
      name: "Southern Harsh Continent",
      index: 3
    },
    equatorial_wet_pressure: {
      id: "equatorial_wet",
      name: "Equatorial Wet Continent",
      index: 4
    },
    mountain_arc_pressure: {
      id: "mountain_arc",
      name: "Mountain Arc Continent",
      index: 5
    },
    broken_archipelago_pressure: {
      id: "broken_archipelago",
      name: "Broken Archipelago Continent",
      index: 6
    }
  });

  const SUMMIT_COMPATIBILITY = Object.freeze({
    summit_high_plateau_pressure: {
      region: "summit_high_plateau",
      label: "High Plateau Summit Region",
      terrain: "plateau"
    },
    summit_waterfall_escarpment_pressure: {
      region: "summit_waterfall_escarpment",
      label: "Waterfall Escarpment Summit Region",
      terrain: "waterfall_escarpment"
    },
    summit_canyon_crossing_pressure: {
      region: "summit_canyon_crossing",
      label: "Canyon Crossing Summit Region",
      terrain: "canyon"
    },
    summit_storm_coast_cliff_pressure: {
      region: "summit_storm_coast_cliff",
      label: "Storm Coast Cliff Summit Region",
      terrain: "storm_coast_cliff"
    },
    summit_glacial_pass_pressure: {
      region: "summit_glacial_pass",
      label: "Glacial Pass Summit Region",
      terrain: "glacial_pass"
    },
    summit_rainforest_basin_pressure: {
      region: "summit_rainforest_basin",
      label: "Rainforest Basin Summit Region",
      terrain: "rainforest_basin"
    },
    summit_mountain_arc_pressure: {
      region: "summit_mountain_arc",
      label: "Mountain Arc Summit Region",
      terrain: "mountain_arc"
    },
    summit_dry_plateau_pressure: {
      region: "summit_dry_plateau",
      label: "Dry Plateau Summit Region",
      terrain: "dry_plateau"
    },
    summit_archipelago_threshold_pressure: {
      region: "summit_archipelago_threshold",
      label: "Archipelago Threshold Summit Region",
      terrain: "archipelago_threshold"
    }
  });

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp01(t);
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / Math.max(EPSILON, edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function softBand(value, center, width) {
    const t = 1 - clamp(Math.abs(value - center) / Math.max(EPSILON, width), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function wrap01(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    return ((n % 1) + 1) % 1;
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
      lon: Math.atan2(n.x, n.z) / DEG,
      lat: Math.asin(clamp(n.y, -1, 1)) / DEG
    };
  }

  function lonToU(lon) {
    return wrap01((Number(lon) + 180) / 360);
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
        const u = wrap01(p.u);
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
      u: ANCHOR.u,
      v: ANCHOR.v
    };
  }

  function hashNoise(x, y, z, salt = 0) {
    const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + salt * 41.31) * 43758.5453123;
    return n - Math.floor(n);
  }

  function valueNoise(p, salt = 0) {
    const n1 = hashNoise(p.x, p.y, p.z, salt);
    const n2 = hashNoise(p.y + n1, p.z - n1, p.x + n1, salt + 9);
    const n3 = hashNoise(p.z - n2, p.x + n2, p.y - n2, salt + 23);
    return clamp01(n1 * 0.52 + n2 * 0.31 + n3 * 0.17);
  }

  function getTectonicsApi() {
    return (
      root.HEARTH_TECTONICS ||
      root.HearthTectonics ||
      (root.HEARTH && root.HEARTH.tectonics) ||
      null
    );
  }

  function fallbackTectonics(p) {
    const oldBody = valueNoise(p, 701);
    const folded = valueNoise({ x: p.y, y: p.z, z: p.x }, 709);
    const cut = valueNoise({ x: p.z, y: p.x, z: p.y }, 719);
    const latAbs = Math.abs(p.lat) / 90;
    const equatorialMass = clamp01(1 - latAbs * 0.58);

    const continentalMassPressure = clamp01(oldBody * 0.46 + equatorialMass * 0.28 + folded * 0.16);
    const oceanBasinPressure = clamp01((1 - continentalMassPressure) * 0.58 + cut * 0.22);
    const ridgeCollisionPressure = clamp01(folded * 0.34 + continentalMassPressure * 0.18);
    const plateauUpliftPressure = clamp01(continentalMassPressure * 0.42 + oldBody * 0.18);
    const basinSinkPressure = clamp01(oceanBasinPressure * 0.52 + cut * 0.12);
    const fractureCutPressure = clamp01(cut * 0.46 + folded * 0.18);
    const shelfCutPressure = clamp01(softBand(continentalMassPressure - oceanBasinPressure, 0, 0.26));
    const coastBoundaryMemory = clamp01(shelfCutPressure * 0.5 + cut * 0.12);
    const archipelagoFracturePressure = clamp01(fractureCutPressure * shelfCutPressure);
    const summitPressure = 0;

    return {
      contract: "HEARTH_ELEVATION_INTERNAL_FALLBACK_TECTONICS",
      receipt: "HEARTH_ELEVATION_INTERNAL_FALLBACK_TECTONICS_RECEIPT",
      u: p.u,
      v: p.v,
      lat: p.lat * DEG,
      lon: p.lon * DEG,
      latDeg: p.lat,
      lonDeg: p.lon,

      depth: clamp01(0.34 + oldBody * 0.22 + continentalMassPressure * 0.12),
      subsurfacePressure: clamp01(continentalMassPressure * 0.32 + ridgeCollisionPressure * 0.18),
      plateStress: clamp01(folded * 0.38 + fractureCutPressure * 0.18),
      crustalCompression: clamp01(continentalMassPressure * 0.46 + ridgeCollisionPressure * 0.18),
      ridgePressure: ridgeCollisionPressure,
      basinPressure: basinSinkPressure,
      scarPressure: fractureCutPressure,
      ancientChannelCut: cut * 0.42,
      shelfCutPressure,
      buriedStructure: clamp01(continentalMassPressure * 0.32 + fractureCutPressure * 0.18 + shelfCutPressure * 0.12),
      elevationInfluence: clamp01(0.5 + continentalMassPressure * 0.28 + ridgeCollisionPressure * 0.18 - oceanBasinPressure * 0.24 - basinSinkPressure * 0.14),

      crustalProvincePressure: continentalMassPressure,
      crustalProvinceId: "fallback_crustal_pressure",
      crustalProvinceLabel: "Fallback Crustal Pressure",
      continentalMassPressure,
      oceanBasinPressure,
      oceanBasinId: "fallback_ocean_basin_pressure",
      oceanBasinLabel: "Fallback Ocean Basin Pressure",
      coastBoundaryMemory,
      ridgeCollisionPressure,
      ridgeCollisionId: "fallback_ridge_collision_pressure",
      ridgeCollisionLabel: "Fallback Ridge Collision Pressure",
      plateauUpliftPressure,
      basinSinkPressure,
      fractureCutPressure,
      escarpmentPressure: clamp01(ridgeCollisionPressure * 0.24 + fractureCutPressure * 0.28 + coastBoundaryMemory * 0.18),
      archipelagoFracturePressure,
      summitPressure,
      summitPressureId: "none",
      summitPressureLabel: "None",

      tectonicClass: "fallback-pre-terrain-body",
      structuralClass: "fallback-stable-pre-terrain-cause",
      dominantStructuralCause: "fallback-buried-cause",
      structuralCauseAuthorityLoaded: false
    };
  }

  function sampleTectonicsFor(p) {
    const api = getTectonicsApi();

    if (
      api &&
      typeof api.sampleTectonics === "function"
    ) {
      try {
        const tectonics = api.sampleTectonics(p.u, p.v);

        if (
          tectonics &&
          Number.isFinite(Number(tectonics.elevationInfluence))
        ) {
          return {
            tectonics,
            consumed: tectonics.contract === REQUIRED_TECTONICS_CONTRACT,
            available: true
          };
        }
      } catch (error) {
        return {
          tectonics: fallbackTectonics(p),
          consumed: false,
          available: false,
          error: error && error.message ? error.message : String(error)
        };
      }
    }

    if (api && typeof api.sample === "function") {
      try {
        const tectonics = api.sample(p.u, p.v);

        if (
          tectonics &&
          Number.isFinite(Number(tectonics.elevationInfluence))
        ) {
          return {
            tectonics,
            consumed: tectonics.contract === REQUIRED_TECTONICS_CONTRACT,
            available: true
          };
        }
      } catch (error) {
        return {
          tectonics: fallbackTectonics(p),
          consumed: false,
          available: false,
          error: error && error.message ? error.message : String(error)
        };
      }
    }

    return {
      tectonics: fallbackTectonics(p),
      consumed: false,
      available: false
    };
  }

  function provinceCompatibility(tectonics, isDeepWater) {
    if (isDeepWater && Number(tectonics.oceanBasinPressure || 0) > 0.56) {
      return {
        id: "open_ocean",
        name: "Open Ocean",
        index: -1
      };
    }

    return (
      PROVINCE_COMPATIBILITY[tectonics.crustalProvinceId] ||
      {
        id: "unresolved_crustal_province",
        name: "Unresolved Crustal Province",
        index: -1
      }
    );
  }

  function summitCompatibility(tectonics) {
    const item = SUMMIT_COMPATIBILITY[tectonics.summitPressureId];

    if (!item || Number(tectonics.summitPressure || 0) < 0.16) {
      return {
        summitRegionHint: "none",
        summitRegionLabel: "None",
        summitTerrainHint: "none",
        summitPotential: 0
      };
    }

    return {
      summitRegionHint: item.region,
      summitRegionLabel: item.label,
      summitTerrainHint: item.terrain,
      summitPotential: clamp01(tectonics.summitPressure || 0)
    };
  }

  function climateCompatibility(p, elevation, fields) {
    const absLat = Math.abs(p.lat);
    const latitudeCold = clamp01(absLat / 90);
    const equatorHeat = clamp01(1 - latitudeCold);

    const water = elevation <= SEA_LEVEL ? 1 : 0;
    const high = clamp01((elevation - 0.18) / 0.62);
    const coast = fields.coastPotential;
    const ridge = fields.ridgePotential;
    const basin = fields.basinPotential;
    const shelf = fields.shelfPotential;
    const archipelago = fields.archipelagoPotential;

    const influences = {
      polar_icefield: clamp01(smoothstep(58, 78, absLat) * (0.54 + high * 0.22)),
      tundra_subpolar: clamp01(softBand(absLat, 56, 18) * (0.36 + high * 0.18)),
      temperate_highland: clamp01(softBand(absLat, 34, 26) * (0.34 + high * 0.38 + ridge * 0.16)),
      temperate_coastal_storm: clamp01(softBand(absLat, 38, 28) * coast * (0.44 + shelf * 0.24)),
      tropical_rainforest_wet_basin: clamp01(equatorHeat * (0.24 + basin * 0.38 + coast * 0.18)),
      monsoon_floodplain: clamp01(softBand(absLat, 18, 18) * (basin * 0.32 + coast * 0.24)),
      arid_desert_dry_plateau: clamp01(softBand(absLat, 24, 20) * (fields.plateauPotential * 0.38 + (1 - coast) * 0.18)),
      alpine_mountain_arc: clamp01((ridge * 0.64 + high * 0.32) * (0.38 + fields.landPotential * 0.5)),
      maritime_archipelago_subtropical_shelf: clamp01((archipelago * 0.54 + shelf * 0.32 + coast * 0.18) * (0.32 + softBand(absLat, 24, 26) * 0.44))
    };

    if (water && fields.waterDepthPotential > 0.54 && shelf < 0.42) {
      return {
        climateHint: "open_ocean",
        climatePotential: fields.waterDepthPotential,
        climateInfluences: influences
      };
    }

    let climateHint = "temperate_highland";
    let climatePotential = -1;

    Object.keys(influences).forEach((key) => {
      if (influences[key] > climatePotential) {
        climateHint = key;
        climatePotential = influences[key];
      }
    });

    return {
      climateHint,
      climatePotential: clamp01(climatePotential),
      climateInfluences: influences
    };
  }

  function terrainClassHintFor(sample) {
    if (sample.elevation <= -0.42 || sample.oceanBasinPotential > 0.68) return "ocean_basin";
    if (sample.elevation <= -0.20) return "deep_ocean";
    if (sample.archipelagoPotential > 0.42 && sample.elevation <= SEA_LEVEL) return "archipelago_shelf";
    if (sample.shelfPotential > 0.44 && sample.elevation <= SEA_LEVEL) return "continental_shelf";
    if (sample.elevation <= SEA_LEVEL) return "shallow_water";
    if (sample.waterfallCandidate > 0.56) return "waterfall_escarpment";
    if (sample.escarpmentPotential > 0.56) return "cliff_escarpment";
    if (sample.canyonPotential > 0.52) return "canyon_corridor";
    if (sample.summitPotential > 0.58) return "summit_region";
    if (sample.mountainArcPotential > 0.56) return "mountain_arc";
    if (sample.plateauPotential > 0.54) return "plateau_interior";
    if (sample.basinPotential > 0.50) return "basin_floor";
    if (sample.coastPotential > 0.56) return "coast_edge";
    if (sample.archipelagoPotential > 0.42) return "island_arc";
    return "continent_mass";
  }

  function isAnchorCoordinate(p) {
    return (
      Math.abs(p.u - ANCHOR.u) < 0.000001 &&
      Math.abs(p.v - ANCHOR.v) < 0.000001
    );
  }

  function sample(...args) {
    const p = parseInput(...args);
    const tectonicResult = sampleTectonicsFor(p);
    const tectonics = tectonicResult.tectonics;

    const structuralNoise = valueNoise(p, 811);
    const surfaceNoise = valueNoise({ x: p.y, y: p.z, z: p.x }, 823);
    const cutNoise = valueNoise({ x: p.z, y: p.x, z: p.y }, 839);

    const continentalMassPressure = clamp01(tectonics.continentalMassPressure || 0);
    const oceanBasinPressure = clamp01(tectonics.oceanBasinPressure || 0);
    const ridgeCollisionPressure = clamp01(tectonics.ridgeCollisionPressure || tectonics.ridgePressure || 0);
    const plateauUpliftPressure = clamp01(tectonics.plateauUpliftPressure || 0);
    const basinSinkPressure = clamp01(tectonics.basinSinkPressure || tectonics.basinPressure || 0);
    const fractureCutPressure = clamp01(tectonics.fractureCutPressure || tectonics.scarPressure || 0);
    const escarpmentPressure = clamp01(tectonics.escarpmentPressure || 0);
    const archipelagoFracturePressure = clamp01(tectonics.archipelagoFracturePressure || 0);
    const summitPressure = clamp01(tectonics.summitPressure || 0);
    const coastBoundaryMemory = clamp01(tectonics.coastBoundaryMemory || 0);
    const shelfCutPressure = clamp01(tectonics.shelfCutPressure || 0);
    const ancientChannelCut = clamp01(tectonics.ancientChannelCut || 0);
    const buriedStructure = clamp01(tectonics.buriedStructure || 0);
    const elevationInfluence = clamp01(tectonics.elevationInfluence || 0.5);

    let elevation =
      -0.32 +
      elevationInfluence * 0.44 +
      continentalMassPressure * 0.42 +
      ridgeCollisionPressure * 0.27 +
      plateauUpliftPressure * 0.22 +
      buriedStructure * 0.10 +
      summitPressure * 0.09 -
      oceanBasinPressure * 0.58 -
      basinSinkPressure * 0.34 -
      ancientChannelCut * 0.10 -
      shelfCutPressure * 0.09 -
      fractureCutPressure * 0.05 +
      (structuralNoise - 0.5) * 0.055 +
      (surfaceNoise - 0.5) * 0.035;

    elevation = clamp(elevation, -1, 1);

    const isLand = elevation > SEA_LEVEL;
    const isWater = !isLand;
    const isShallowWater = elevation <= SEA_LEVEL && elevation > -0.20;
    const isDeepWater = elevation <= -0.20;

    const landPotential = clamp01(smoothstep(-0.08, 0.20, elevation) * 0.72 + continentalMassPressure * 0.22 + plateauUpliftPressure * 0.06);
    const waterDepthPotential = isWater ? clamp01(Math.max(-elevation / 0.72, oceanBasinPressure * 0.74 + basinSinkPressure * 0.26)) : 0;
    const oceanBasinPotential = oceanBasinPressure;
    const shelfPotential = clamp01(shelfCutPressure * 0.44 + coastBoundaryMemory * 0.32 + softBand(elevation, -0.035, 0.18) * 0.24);
    const continentShelfPotential = shelfPotential;
    const coastPotential = clamp01(coastBoundaryMemory * 0.36 + shelfCutPressure * 0.28 + softBand(elevation, SEA_LEVEL, 0.135) * 0.36);

    const mountainArcPotential = ridgeCollisionPressure;
    const plateauPotential = plateauUpliftPressure;
    const canyonPotential = clamp01(fractureCutPressure * 0.46 + ancientChannelCut * 0.34 + cutNoise * 0.12);
    const escarpmentPotential = clamp01(escarpmentPressure * 0.62 + coastPotential * 0.14 + ridgeCollisionPressure * 0.12 + fractureCutPressure * 0.12);
    const waterfallCandidate = clamp01(escarpmentPotential * (coastPotential * 0.28 + basinSinkPressure * 0.18 + ridgeCollisionPressure * 0.16 + ancientChannelCut * 0.14));
    const archipelagoPotential = archipelagoFracturePressure;
    const basinPotential = basinSinkPressure;
    const ridgePotential = ridgeCollisionPressure;
    const saddlePotential = clamp01((1 - Math.abs(continentalMassPressure - oceanBasinPressure)) * 0.28 + fractureCutPressure * 0.18 + shelfPotential * 0.16);
    const islandPotential = clamp01(archipelagoPotential * 0.64 + shelfPotential * 0.2 + coastPotential * 0.16);
    const scarPotential = clamp01(fractureCutPressure * 0.38 + ancientChannelCut * 0.32 + buriedStructure * 0.14);

    const province = provinceCompatibility(tectonics, isDeepWater);
    const summit = summitCompatibility(tectonics);

    const physicalFields = {
      landPotential,
      waterDepthPotential,
      coastPotential,
      ridgePotential,
      basinPotential,
      shelfPotential,
      plateauPotential,
      archipelagoPotential
    };

    const climate = climateCompatibility(p, elevation, physicalFields);

    const continentPotential = continentalMassPressure;
    const nearestContinentDistance = clamp01(1 - continentPotential);
    const continentSeparation = clamp01(shelfPotential * 0.42 + fractureCutPressure * 0.18 + coastBoundaryMemory * 0.18);

    const output = {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      requiredTectonicsContract: REQUIRED_TECTONICS_CONTRACT,
      version: VERSION,
      authority: "elevation-resolver",

      x: p.x,
      y: p.y,
      z: p.z,
      lon: p.lon,
      lat: p.lat,
      u: p.u,
      v: p.v,
      anchorId: isAnchorCoordinate(p) ? ANCHOR.id : "",

      elevation,
      seaLevel: SEA_LEVEL,

      isLand,
      isWater,
      isShallowWater,
      isDeepWater,

      landPotential,
      waterDepthPotential,
      oceanBasinPotential,
      continentShelfPotential,
      shelfPotential,
      coastPotential,

      continentId: province.id,
      continentName: province.name,
      continentIndex: province.index,
      continentPotential,
      continentSeparation,
      nearestContinentDistance,

      climateHint: climate.climateHint,
      climatePotential: climate.climatePotential,
      climateInfluences: climate.climateInfluences,
      climateCompatibilityHintOnly: true,
      ownsClimate: false,

      polarInfluence: climate.climateInfluences.polar_icefield,
      tundraInfluence: climate.climateInfluences.tundra_subpolar,
      temperateInfluence: Math.max(climate.climateInfluences.temperate_highland, climate.climateInfluences.temperate_coastal_storm),
      stormCoastInfluence: climate.climateInfluences.temperate_coastal_storm,
      rainforestInfluence: climate.climateInfluences.tropical_rainforest_wet_basin,
      monsoonInfluence: climate.climateInfluences.monsoon_floodplain,
      desertInfluence: climate.climateInfluences.arid_desert_dry_plateau,
      alpineInfluence: climate.climateInfluences.alpine_mountain_arc,
      maritimeInfluence: climate.climateInfluences.maritime_archipelago_subtropical_shelf,

      summitRegionHint: summit.summitRegionHint,
      summitRegionLabel: summit.summitRegionLabel,
      summitTerrainHint: summit.summitTerrainHint,
      summitPotential: summit.summitPotential,

      mountainArcPotential,
      plateauPotential,
      canyonPotential,
      escarpmentPotential,
      waterfallCandidate,
      archipelagoPotential,
      basinPotential,
      ridgePotential,
      saddlePotential,
      islandPotential,
      scarPotential,

      corePotential: continentPotential,
      shieldPotential: clamp01(continentalMassPressure * 0.52 + plateauUpliftPressure * 0.28 + buriedStructure * 0.16),
      bridgePotential: clamp01(continentSeparation * 0.22 + scarPotential * 0.22 + coastBoundaryMemory * 0.12),

      dominantCoreId: province.id,

      tectonicsAvailable: tectonicResult.available,
      tectonicsConsumed: tectonicResult.consumed,
      tectonicsContract: tectonics.contract || "",
      tectonicsReceipt: tectonics.receipt || "",
      tectonicsStructuralClass: tectonics.structuralClass || "",
      tectonicsDominantStructuralCause: tectonics.dominantStructuralCause || "",
      elevationResolvedFromTectonics: tectonicResult.consumed === true,

      tectonicElevationInfluence: elevationInfluence,
      tectonicDepth: clamp01(tectonics.depth || 0),
      tectonicSubsurfacePressure: clamp01(tectonics.subsurfacePressure || 0),
      tectonicPlateStress: clamp01(tectonics.plateStress || 0),
      tectonicCrustalCompression: clamp01(tectonics.crustalCompression || 0),
      tectonicRidgePressure: clamp01(tectonics.ridgePressure || ridgeCollisionPressure),
      tectonicBasinPressure: clamp01(tectonics.basinPressure || basinSinkPressure),
      tectonicScarPressure: clamp01(tectonics.scarPressure || fractureCutPressure),
      tectonicAncientChannelCut: ancientChannelCut,
      tectonicShelfCutPressure: shelfCutPressure,
      tectonicBuriedStructure: buriedStructure,

      crustalProvincePressure: clamp01(tectonics.crustalProvincePressure || continentalMassPressure),
      crustalProvinceId: tectonics.crustalProvinceId || "",
      crustalProvinceLabel: tectonics.crustalProvinceLabel || "",
      continentalMassPressure,
      oceanBasinPressure,
      oceanBasinId: tectonics.oceanBasinId || "",
      oceanBasinLabel: tectonics.oceanBasinLabel || "",
      coastBoundaryMemory,
      ridgeCollisionPressure,
      ridgeCollisionId: tectonics.ridgeCollisionId || "",
      ridgeCollisionLabel: tectonics.ridgeCollisionLabel || "",
      plateauUpliftPressure,
      basinSinkPressure,
      fractureCutPressure,
      escarpmentPressure,
      archipelagoFracturePressure,
      tectonicSummitPressure: summitPressure,
      tectonicSummitPressureId: tectonics.summitPressureId || "none",
      tectonicSummitPressureLabel: tectonics.summitPressureLabel || "None",

      ownsTectonicCause: false,
      ownsComposition: false,
      ownsHydrology: false,
      ownsMaterialRendering: false,
      ownsCanvas: false,
      ownsRuntime: false,
      ownsControls: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };

    output.terrainClassHint = terrainClassHintFor(output);

    if (tectonicResult.error) {
      output.tectonicsError = tectonicResult.error;
    }

    return output;
  }

  const read = (...args) => sample(...args);
  const getElevation = (...args) => sample(...args);
  const sampleElevation = (...args) => sample(...args);
  const readElevation = (...args) => sample(...args);
  const sampleAnchor = () => sample({ u: ANCHOR.u, v: ANCHOR.v });

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      requiredTectonicsContract: REQUIRED_TECTONICS_CONTRACT,
      version: VERSION,
      authority: "elevation-resolver",
      status: "active",
      destinationFile: "/assets/hearth/hearth.elevation.js",
      anchor: ANCHOR,
      purpose: "consume-structural-cause-tectonics-and-resolve-height-depth",
      tectonicsSeated: true,
      tectonicsConsumedAtSampleTime: true,
      elevationResolvedFromTectonics: true,
      causeLayerOwnedByTectonics: true,
      elevationOwnsStructuralCause: false,
      climateCompatibilityHintOnly: true,
      ownsClimate: false,
      exposedFields: [
        "elevation",
        "seaLevel",
        "isLand",
        "isWater",
        "isShallowWater",
        "isDeepWater",
        "landPotential",
        "waterDepthPotential",
        "oceanBasinPotential",
        "continentShelfPotential",
        "shelfPotential",
        "coastPotential",
        "continentId",
        "continentName",
        "continentIndex",
        "continentPotential",
        "continentSeparation",
        "nearestContinentDistance",
        "climateHint",
        "climatePotential",
        "climateInfluences",
        "summitRegionHint",
        "summitRegionLabel",
        "summitTerrainHint",
        "summitPotential",
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
        "terrainClassHint",
        "dominantCoreId",
        "tectonicsConsumed",
        "tectonicsContract",
        "elevationResolvedFromTectonics"
      ],
      designRules: [
        "tectonics owns structural cause",
        "elevation resolves height and depth only",
        "land and water booleans are elevation consequences",
        "climate remains downstream and is not owned here",
        "materials remain downstream and are not owned here",
        "canvas remains downstream and is not owned here",
        "no final visual pass claim"
      ],
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
    requiredTectonicsContract: REQUIRED_TECTONICS_CONTRACT,
    version: VERSION,
    seaLevel: SEA_LEVEL,
    anchor: ANCHOR,

    sample,
    read,
    getElevation,
    sampleElevation,
    readElevation,
    sampleAnchor,
    getReceipt,

    supportsTectonicsSeatedElevationResolver: true,
    supportsStructuralCauseConsumption: true,
    supportsHeightDepthResolution: true,
    supportsSevenProvinceCompatibility: true,
    supportsDownstreamCompatibilityFields: true,

    supportsSevenContinentRealPlanetElevation: true,
    supportsNineClimateFamilies: false,
    supportsNonlinearSummitRegions: true,

    ownsTectonicCause: false,
    ownsClimate: false,
    ownsMaterialRendering: false,
    ownsCanvas: false,
    ownsRuntime: false,
    ownsControls: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.elevation = api;

  root.HEARTH_ELEVATION = api;
  root.HearthElevation = api;
  root.HEARTH_ELEVATION_RECEIPT = getReceipt();
  root.HEARTH_ELEVATION_CONTRACT = CONTRACT;
  root.HEARTH_ELEVATION_SUPPORTS_TECTONICS_SEATED_RESOLVER = true;
  root.HEARTH_ELEVATION_SUPPORTS_SEVEN_CONTINENT_REAL_PLANET = true;

  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dataset.hearthElevationAuthorityLoaded = "true";
    document.documentElement.dataset.hearthElevationContract = CONTRACT;
    document.documentElement.dataset.hearthElevationReceipt = RECEIPT;
    document.documentElement.dataset.hearthElevationPreviousContract = PREVIOUS_CONTRACT;
    document.documentElement.dataset.hearthElevationRequiredTectonicsContract = REQUIRED_TECTONICS_CONTRACT;
    document.documentElement.dataset.hearthElevationTectonicsSeated = "true";
    document.documentElement.dataset.hearthElevationResolvedFromTectonics = "true";
    document.documentElement.dataset.hearthElevationOwnsStructuralCause = "false";
    document.documentElement.dataset.hearthElevationOwnsClimate = "false";
    document.documentElement.dataset.hearthElevationClimateCompatibilityHintOnly = "true";
    document.documentElement.dataset.hearthElevationAnchor = ANCHOR.id;
    document.documentElement.dataset.hearthElevationAnchorU = String(ANCHOR.u);
    document.documentElement.dataset.hearthElevationAnchorV = String(ANCHOR.v);
    document.documentElement.dataset.hearthElevationAnchorLon = String(ANCHOR.lon);
    document.documentElement.dataset.hearthElevationAnchorLat = String(ANCHOR.lat);
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.webgl = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

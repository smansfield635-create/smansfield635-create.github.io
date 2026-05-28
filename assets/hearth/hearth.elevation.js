// /assets/hearth/hearth.elevation.js
// HEARTH_SEVEN_CONTINENT_NINE_CLIMATE_ELEVATION_TNT_v1
// Full-file replacement.
// Elevation authority only.
// Purpose:
// - Replace two-core linear landbridge logic with seven-continent planetary terrain.
// - Preserve downstream API compatibility.
// - Expose nine climate hints across the seven continents.
// - Embed Nine Summit regions as nonlinear terrain attractors.
// - Preserve clear continental divides and ocean basins.
// Does not own:
// - final materials
// - canvas rendering
// - route orchestration
// - teleports
// - gameplay movement
// - UI
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_SEVEN_CONTINENT_NINE_CLIMATE_ELEVATION_TNT_v1";
  const RECEIPT = "HEARTH_SEVEN_CONTINENT_NINE_CLIMATE_ELEVATION_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_CONTINENTAL_GROWTH_LANDBRIDGE_ELEVATION_TNT_v1";
  const VERSION = "2026-05-28.hearth-seven-continent-nine-climate-elevation-v1";

  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;
  const SEA_LEVEL = 0.0;

  const root = typeof window !== "undefined" ? window : globalThis;

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function mix(a, b, t) {
    return a + (b - a) * clamp01(t);
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp01((x - edge0) / Math.max(0.000001, edge1 - edge0));
    return t * t * (3 - 2 * t);
  }

  function smootherstep(edge0, edge1, x) {
    const t = clamp01((x - edge0) / Math.max(0.000001, edge1 - edge0));
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  function fract(value) {
    return value - Math.floor(value);
  }

  function hash(value) {
    return fract(Math.sin(value) * 43758.5453123);
  }

  function hash3(x, y, z) {
    return hash(x * 127.1 + y * 311.7 + z * 74.7);
  }

  function valueNoise3(x, y, z) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const zi = Math.floor(z);

    const xf = x - xi;
    const yf = y - yi;
    const zf = z - zi;

    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);
    const w = zf * zf * (3 - 2 * zf);

    const h000 = hash3(xi, yi, zi);
    const h100 = hash3(xi + 1, yi, zi);
    const h010 = hash3(xi, yi + 1, zi);
    const h110 = hash3(xi + 1, yi + 1, zi);
    const h001 = hash3(xi, yi, zi + 1);
    const h101 = hash3(xi + 1, yi, zi + 1);
    const h011 = hash3(xi, yi + 1, zi + 1);
    const h111 = hash3(xi + 1, yi + 1, zi + 1);

    const x00 = mix(h000, h100, u);
    const x10 = mix(h010, h110, u);
    const x01 = mix(h001, h101, u);
    const x11 = mix(h011, h111, u);

    const y0 = mix(x00, x10, v);
    const y1 = mix(x01, x11, v);

    return mix(y0, y1, w);
  }

  function fbm3(x, y, z, octaves = 5) {
    let value = 0;
    let amplitude = 0.5;
    let frequency = 1;
    let norm = 0;

    for (let i = 0; i < octaves; i += 1) {
      value += valueNoise3(x * frequency, y * frequency, z * frequency) * amplitude;
      norm += amplitude;
      frequency *= 2.03;
      amplitude *= 0.52;
    }

    return norm ? value / norm : 0;
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

  function dot3(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  function angularDistance(a, b) {
    return Math.acos(clamp(dot3(a, b), -1, 1));
  }

  function lonLatToVector(lonDeg, latDeg) {
    const lon = lonDeg * DEG;
    const lat = latDeg * DEG;
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

  function parseInput(...args) {
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
  }

  const CLIMATES = [
    "polar_icefield",
    "tundra_subpolar",
    "temperate_highland",
    "temperate_coastal_storm",
    "tropical_rainforest_wet_basin",
    "monsoon_floodplain",
    "arid_desert_dry_plateau",
    "alpine_mountain_arc",
    "maritime_archipelago_subtropical_shelf"
  ];

  const CONTINENTS = [
    {
      index: 0,
      id: "western_shield",
      name: "Western Shield Continent",
      center: lonLatToVector(-74, 12),
      radius: 0.56,
      shelfRadius: 0.82,
      height: 0.82,
      plateau: 0.70,
      mountain: 0.42,
      basin: 0.22,
      archipelago: 0.08,
      seed: 11.37,
      climates: ["temperate_highland", "temperate_coastal_storm"],
      role: "old shield mass with plateau interior and cliff coast"
    },
    {
      index: 1,
      id: "eastern_basin",
      name: "Eastern Basin Continent",
      center: lonLatToVector(48, 4),
      radius: 0.54,
      shelfRadius: 0.80,
      height: 0.76,
      plateau: 0.42,
      mountain: 0.44,
      basin: 0.68,
      archipelago: 0.08,
      seed: 29.91,
      climates: ["monsoon_floodplain", "arid_desert_dry_plateau"],
      role: "basin-rim mass with floodplain and dry plateau pressure"
    },
    {
      index: 2,
      id: "northern_cold",
      name: "Northern Cold Continent",
      center: lonLatToVector(-12, 66),
      radius: 0.42,
      shelfRadius: 0.62,
      height: 0.66,
      plateau: 0.48,
      mountain: 0.38,
      basin: 0.28,
      archipelago: 0.18,
      seed: 43.82,
      climates: ["polar_icefield", "tundra_subpolar"],
      role: "polar and subpolar landmass with glacial valleys and fjords"
    },
    {
      index: 3,
      id: "southern_harsh",
      name: "Southern Harsh Continent",
      center: lonLatToVector(12, -58),
      radius: 0.42,
      shelfRadius: 0.64,
      height: 0.68,
      plateau: 0.58,
      mountain: 0.46,
      basin: 0.30,
      archipelago: 0.12,
      seed: 55.42,
      climates: ["arid_desert_dry_plateau", "alpine_mountain_arc"],
      role: "survival-pressure highland, cold desert, and wind-cut ridges"
    },
    {
      index: 4,
      id: "equatorial_wet",
      name: "Equatorial Wet Continent",
      center: lonLatToVector(132, -3),
      radius: 0.44,
      shelfRadius: 0.68,
      height: 0.70,
      plateau: 0.34,
      mountain: 0.35,
      basin: 0.62,
      archipelago: 0.18,
      seed: 71.26,
      climates: ["tropical_rainforest_wet_basin", "monsoon_floodplain"],
      role: "rainforest basin, wetlands, rivers, floodplains, waterfall escarpments"
    },
    {
      index: 5,
      id: "mountain_arc",
      name: "Mountain Arc Continent",
      center: lonLatToVector(-145, -20),
      radius: 0.40,
      shelfRadius: 0.62,
      height: 0.78,
      plateau: 0.45,
      mountain: 0.84,
      basin: 0.20,
      archipelago: 0.16,
      seed: 88.63,
      climates: ["alpine_mountain_arc", "arid_desert_dry_plateau"],
      role: "alpine ridges, cliffs, high passes, canyon cuts, tectonic challenge terrain"
    },
    {
      index: 6,
      id: "broken_archipelago",
      name: "Broken Archipelago Continent",
      center: lonLatToVector(116, 36),
      radius: 0.36,
      shelfRadius: 0.78,
      height: 0.54,
      plateau: 0.20,
      mountain: 0.24,
      basin: 0.26,
      archipelago: 0.86,
      seed: 103.77,
      climates: ["maritime_archipelago_subtropical_shelf", "temperate_coastal_storm"],
      role: "fragmented continental shelf, large island clusters, drowned valleys, maritime climate"
    }
  ];

  const SUMMIT_REGIONS = [
    {
      id: "summit_high_plateau",
      label: "High Plateau Summit",
      center: lonLatToVector(-82, 20),
      radius: 0.18,
      continentId: "western_shield",
      climate: "temperate_highland",
      terrain: "high_plateau"
    },
    {
      id: "summit_waterfall_escarpment",
      label: "Waterfall Escarpment Summit",
      center: lonLatToVector(125, -8),
      radius: 0.16,
      continentId: "equatorial_wet",
      climate: "tropical_rainforest_wet_basin",
      terrain: "waterfall_escarpment"
    },
    {
      id: "summit_canyon_crossing",
      label: "Canyon Crossing Summit",
      center: lonLatToVector(-154, -13),
      radius: 0.16,
      continentId: "mountain_arc",
      climate: "alpine_mountain_arc",
      terrain: "canyon_crossing"
    },
    {
      id: "summit_storm_coast_cliff",
      label: "Storm Coast Cliff Summit",
      center: lonLatToVector(-92, 2),
      radius: 0.15,
      continentId: "western_shield",
      climate: "temperate_coastal_storm",
      terrain: "storm_coast_cliff"
    },
    {
      id: "summit_glacial_pass",
      label: "Glacial Pass Summit",
      center: lonLatToVector(-24, 67),
      radius: 0.15,
      continentId: "northern_cold",
      climate: "polar_icefield",
      terrain: "glacial_pass"
    },
    {
      id: "summit_rainforest_basin",
      label: "Rainforest Basin Summit",
      center: lonLatToVector(142, 5),
      radius: 0.17,
      continentId: "equatorial_wet",
      climate: "monsoon_floodplain",
      terrain: "rainforest_basin"
    },
    {
      id: "summit_mountain_arc",
      label: "Mountain Arc Summit",
      center: lonLatToVector(-137, -29),
      radius: 0.17,
      continentId: "mountain_arc",
      climate: "alpine_mountain_arc",
      terrain: "mountain_arc"
    },
    {
      id: "summit_dry_plateau",
      label: "Dry Plateau Summit",
      center: lonLatToVector(42, -6),
      radius: 0.17,
      continentId: "eastern_basin",
      climate: "arid_desert_dry_plateau",
      terrain: "dry_plateau"
    },
    {
      id: "summit_archipelago_threshold",
      label: "Archipelago Threshold Summit",
      center: lonLatToVector(109, 39),
      radius: 0.16,
      continentId: "broken_archipelago",
      climate: "maritime_archipelago_subtropical_shelf",
      terrain: "archipelago_threshold"
    }
  ];

  const SCAR_NODES = [
    lonLatToVector(-24, 9),
    lonLatToVector(-5, 4),
    lonLatToVector(14, -2),
    lonLatToVector(30, -4)
  ];

  function continentField(p) {
    const readings = CONTINENTS.map((continent) => {
      const distance = angularDistance(p, continent.center);

      const broadNoise = fbm3(
        p.x * 2.7 + continent.seed,
        p.y * 2.7 - continent.seed * 0.31,
        p.z * 2.7 + continent.seed * 0.17,
        5
      );

      const edgeNoise = fbm3(
        p.x * 8.8 - continent.seed * 0.11,
        p.y * 8.8 + continent.seed * 0.29,
        p.z * 8.8 - continent.seed * 0.41,
        4
      );

      const fractureNoise = fbm3(
        p.x * 18.5 + continent.seed * 0.67,
        p.y * 18.5 - continent.seed * 0.19,
        p.z * 18.5 + continent.seed * 0.23,
        3
      );

      const radialWarp = (broadNoise - 0.5) * 0.105 + (edgeNoise - 0.5) * 0.045;
      const radius = continent.radius + radialWarp;
      const shelfRadius = continent.shelfRadius + radialWarp * 1.38;

      let core = smootherstep(radius, 0.045, distance);
      const shelf = smootherstep(shelfRadius, radius * 0.86, distance);

      const brokenEdge = smoothstep(radius * 1.08, radius * 0.78, distance) * (fractureNoise - 0.5) * 0.16;
      core = clamp01(core + brokenEdge);

      const centerWeight = smootherstep(radius * 0.62, 0.02, distance);
      const plateauPotential = clamp01(core * continent.plateau * (0.68 + broadNoise * 0.38));
      const basinPotential = clamp01(core * continent.basin * smoothstep(0.25, 0.84, edgeNoise));
      const mountainPotential = clamp01(core * continent.mountain * smoothstep(0.43, 0.88, fractureNoise));
      const archipelagoPotential = clamp01(shelf * continent.archipelago * smoothstep(0.44, 0.90, fractureNoise));

      return {
        continent,
        distance,
        core,
        shelf,
        centerWeight,
        plateauPotential,
        basinPotential,
        mountainPotential,
        archipelagoPotential
      };
    });

    readings.sort((a, b) => b.core - a.core || a.distance - b.distance);

    const primary = readings[0];
    const secondary = readings[1] || primary;

    const continentPotential = clamp01(primary.core);
    const continentShelfPotential = clamp01(Math.max(...readings.map((r) => r.shelf)));
    const nearestContinentDistance = primary.distance;
    const secondContinentDistance = secondary.distance;
    const continentSeparation = clamp01(
      smoothstep(0.08, 0.42, secondContinentDistance - nearestContinentDistance) *
      smoothstep(0.18, 0.82, nearestContinentDistance)
    );

    return {
      readings,
      primary,
      secondary,
      continentId: continentPotential > 0.08 ? primary.continent.id : "open_ocean",
      continentName: continentPotential > 0.08 ? primary.continent.name : "Open Ocean",
      continentIndex: continentPotential > 0.08 ? primary.continent.index : -1,
      continentPotential,
      continentShelfPotential,
      continentSeparation,
      nearestContinentDistance,
      secondContinentDistance,
      plateauPotential: clamp01(Math.max(...readings.map((r) => r.plateauPotential))),
      basinPotential: clamp01(Math.max(...readings.map((r) => r.basinPotential))),
      mountainArcPotential: clamp01(Math.max(...readings.map((r) => r.mountainPotential))),
      archipelagoPotential: clamp01(Math.max(...readings.map((r) => r.archipelagoPotential)))
    };
  }

  function scarField(p) {
    let closest = Infinity;
    let chain = 0;

    for (const node of SCAR_NODES) {
      const d = angularDistance(p, node);
      closest = Math.min(closest, d);
      chain = Math.max(chain, smootherstep(0.18, 0.018, d));
    }

    const fracture = fbm3(p.x * 13.7 + 21, p.y * 13.7 - 9, p.z * 13.7 + 4, 4);
    const broken = chain * smoothstep(0.50, 0.88, fracture);

    return {
      bridgePotential: clamp01(broken * 0.38),
      ridgePotential: clamp01(broken * 0.46),
      saddlePotential: clamp01(chain * (1 - broken) * 0.44),
      islandPotential: clamp01(chain * smoothstep(0.62, 0.94, fracture) * 0.55),
      scarPotential: clamp01(chain),
      scarDistance: closest
    };
  }

  function climateField(p, continent) {
    const ll = vectorToLonLat(p);
    const absLat = Math.abs(ll.lat);
    const latitude01 = absLat / 90;

    const polarInfluence = smoothstep(58, 78, absLat);
    const tundraInfluence = smoothstep(46, 63, absLat) * (1 - smoothstep(72, 86, absLat));
    const tropicalBand = 1 - smoothstep(8, 26, absLat);
    const temperateBand = smoothstep(18, 38, absLat) * (1 - smoothstep(54, 70, absLat));

    const continentRole = continent.primary && continent.primary.continent ? continent.primary.continent : null;
    const id = continentRole ? continentRole.id : "open_ocean";

    const wetNoise = fbm3(p.x * 4.0 + 12, p.y * 4.0 - 25, p.z * 4.0 + 8, 4);
    const dryNoise = fbm3(p.x * 3.2 - 51, p.y * 3.2 + 14, p.z * 3.2 - 39, 4);
    const stormNoise = fbm3(p.x * 6.5 + 7, p.y * 6.5 + 17, p.z * 6.5 - 11, 4);

    const shelf = continent.continentShelfPotential;
    const elevationFactor = clamp01(continent.continentPotential + continent.mountainArcPotential * 0.35);
    const mountain = continent.mountainArcPotential;
    const basin = continent.basinPotential;
    const archipelago = continent.archipelagoPotential;

    const values = {
      polar_icefield: clamp01(polarInfluence * (id === "northern_cold" ? 1.0 : 0.42)),
      tundra_subpolar: clamp01(tundraInfluence * (id === "northern_cold" ? 0.92 : 0.42)),
      temperate_highland: clamp01(temperateBand * (continent.plateauPotential * 0.68 + elevationFactor * 0.25)),
      temperate_coastal_storm: clamp01(temperateBand * shelf * (0.48 + stormNoise * 0.52)),
      tropical_rainforest_wet_basin: clamp01(tropicalBand * basin * (id === "equatorial_wet" ? 1.0 : 0.40) * (0.62 + wetNoise * 0.48)),
      monsoon_floodplain: clamp01((tropicalBand * 0.55 + temperateBand * 0.30) * basin * shelf * (0.48 + wetNoise * 0.62)),
      arid_desert_dry_plateau: clamp01((1 - wetNoise * 0.72) * dryNoise * continent.plateauPotential * (id === "eastern_basin" || id === "southern_harsh" || id === "mountain_arc" ? 0.88 : 0.38)),
      alpine_mountain_arc: clamp01(mountain * (0.62 + latitude01 * 0.18 + dryNoise * 0.22)),
      maritime_archipelago_subtropical_shelf: clamp01(archipelago * shelf * (id === "broken_archipelago" ? 1.0 : 0.46) * (0.62 + stormNoise * 0.36))
    };

    for (const climate of CLIMATES) {
      if (!Number.isFinite(values[climate])) values[climate] = 0;
      values[climate] = clamp01(values[climate]);
    }

    let climateHint = "open_ocean";
    let climatePotential = 0;

    for (const climate of CLIMATES) {
      if (values[climate] > climatePotential) {
        climatePotential = values[climate];
        climateHint = climate;
      }
    }

    return {
      ...values,
      climateHint,
      climatePotential
    };
  }

  function summitField(p, continent, climate) {
    let best = null;
    let bestPotential = 0;

    for (const summit of SUMMIT_REGIONS) {
      const d = angularDistance(p, summit.center);
      const core = smootherstep(summit.radius, 0.012, d);
      const continentMatch = summit.continentId === continent.continentId ? 1 : 0.28;
      const climateMatch = summit.climate === climate.climateHint ? 1 : 0.46;
      const potential = clamp01(core * (0.66 + continentMatch * 0.22 + climateMatch * 0.12));

      if (potential > bestPotential) {
        bestPotential = potential;
        best = summit;
      }
    }

    return {
      summitPotential: bestPotential,
      summitRegionHint: best && bestPotential > 0.08 ? best.id : "none",
      summitRegionLabel: best && bestPotential > 0.08 ? best.label : "None",
      summitTerrainHint: best && bestPotential > 0.08 ? best.terrain : "none"
    };
  }

  function terrainHint(state) {
    if (state.elevation <= -0.24 && state.continentShelfPotential < 0.28) return "deep_ocean";
    if (state.elevation <= 0 && state.archipelagoPotential > 0.38) return "archipelago_shelf";
    if (state.elevation <= 0 && state.shelfPotential > 0.38) return "continental_shelf";
    if (state.coastPotential > 0.58 && state.elevation > -0.04 && state.elevation < 0.16) return "coast_edge";
    if (state.summitPotential > 0.58 && state.elevation > 0.12) return "summit_region";
    if (state.waterfallCandidate > 0.54) return "waterfall_escarpment";
    if (state.escarpmentPotential > 0.58) return "cliff_escarpment";
    if (state.canyonPotential > 0.54) return "canyon_corridor";
    if (state.mountainArcPotential > 0.56 && state.elevation > 0.24) return "mountain_arc";
    if (state.plateauPotential > 0.52 && state.elevation > 0.18) return "plateau_interior";
    if (state.basinPotential > 0.50 && state.elevation < 0.22) return "basin_floor";
    if (state.continentPotential > 0.50 && state.elevation > 0.05) return "continent_mass";
    if (state.islandPotential > 0.44 && state.elevation > -0.05) return "island_arc";
    return state.elevation > 0 ? "raised_land" : "shallow_ocean";
  }

  function sample(...args) {
    const p = parseInput(...args);
    const ll = vectorToLonLat(p);

    const continent = continentField(p);
    const scar = scarField(p);
    const climate = climateField(p, continent);
    const summit = summitField(p, continent, climate);

    const broad = fbm3(p.x * 2.1 + 101, p.y * 2.1 - 31, p.z * 2.1 + 9, 5) - 0.5;
    const mid = fbm3(p.x * 7.3 - 14, p.y * 7.3 + 61, p.z * 7.3 - 18, 5) - 0.5;
    const fine = fbm3(p.x * 19.1 + 5, p.y * 19.1 + 13, p.z * 19.1 - 3, 4) - 0.5;

    const oceanBasinPotential = clamp01(
      (1 - continent.continentPotential) *
      (1 - continent.continentShelfPotential * 0.72) *
      smoothstep(0.18, 0.64, continent.nearestContinentDistance)
    );

    const continentLift =
      continent.continentPotential * 0.78 +
      continent.continentShelfPotential * 0.16 +
      continent.plateauPotential * 0.20 +
      continent.mountainArcPotential * 0.22 -
      continent.basinPotential * 0.13 +
      continent.archipelagoPotential * 0.10;

    const scarLift =
      scar.ridgePotential * 0.12 +
      scar.islandPotential * 0.08 -
      scar.saddlePotential * 0.16;

    const summitLift =
      summit.summitPotential *
      (
        summit.summitTerrainHint === "high_plateau" ? 0.12 :
        summit.summitTerrainHint === "mountain_arc" ? 0.15 :
        summit.summitTerrainHint === "glacial_pass" ? 0.10 :
        summit.summitTerrainHint === "waterfall_escarpment" ? 0.09 :
        0.07
      );

    const oceanCut = oceanBasinPotential * 0.48 + continent.continentSeparation * 0.10;

    let elevation =
      -0.46 +
      continentLift +
      scarLift +
      summitLift +
      broad * 0.12 +
      mid * 0.065 +
      fine * 0.024 -
      oceanCut;

    elevation = clamp(elevation, -1, 1);

    const landPotential = clamp01(smoothstep(-0.08, 0.25, elevation));
    const waterDepthPotential = elevation < SEA_LEVEL ? clamp01(-elevation / 0.78) : 0;

    const coastPotential = clamp01(
      (1 - Math.abs(elevation - SEA_LEVEL) / 0.145) *
      (continent.continentShelfPotential + continent.archipelagoPotential * 0.52 + scar.islandPotential * 0.28)
    );

    const canyonNoise = fbm3(p.x * 11.3 + 39, p.y * 11.3 - 12, p.z * 11.3 + 77, 4);
    const canyonPotential = clamp01(
      (continent.mountainArcPotential * 0.32 + continent.plateauPotential * 0.22 + continent.basinPotential * 0.28) *
      smoothstep(0.48, 0.86, canyonNoise) *
      smoothstep(-0.02, 0.42, elevation)
    );

    const escarpmentPotential = clamp01(
      (continent.mountainArcPotential * 0.42 + continent.plateauPotential * 0.28 + coastPotential * 0.24) *
      smoothstep(0.42, 0.86, Math.abs(mid) + 0.28)
    );

    const waterfallCandidate = clamp01(
      escarpmentPotential *
      (climate.tropical_rainforest_wet_basin * 0.36 + climate.monsoon_floodplain * 0.32 + climate.temperate_coastal_storm * 0.18 + continent.basinPotential * 0.18)
    );

    const state = {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "elevation",

      x: p.x,
      y: p.y,
      z: p.z,
      lon: ll.lon,
      lat: ll.lat,

      elevation,
      seaLevel: SEA_LEVEL,

      landPotential,
      shelfPotential: continent.continentShelfPotential,
      bridgePotential: scar.bridgePotential,
      ridgePotential: clamp01(continent.mountainArcPotential * 0.72 + scar.ridgePotential * 0.28),
      saddlePotential: scar.saddlePotential,
      basinPotential: continent.basinPotential,
      islandPotential: clamp01(continent.archipelagoPotential * 0.82 + scar.islandPotential * 0.42),
      coastPotential,
      waterDepthPotential,

      corePotential: continent.continentPotential,
      shieldPotential: clamp01(continent.continentPotential * 0.72 + continent.plateauPotential * 0.24),

      continentId: continent.continentId,
      continentName: continent.continentName,
      continentIndex: continent.continentIndex,
      continentPotential: continent.continentPotential,
      continentSeparation: continent.continentSeparation,
      nearestContinentDistance: continent.nearestContinentDistance,
      oceanBasinPotential,
      continentShelfPotential: continent.continentShelfPotential,

      mountainArcPotential: continent.mountainArcPotential,
      plateauPotential: continent.plateauPotential,
      canyonPotential,
      escarpmentPotential,
      waterfallCandidate,
      archipelagoPotential: continent.archipelagoPotential,
      scarPotential: scar.scarPotential,

      polarInfluence: climate.polar_icefield,
      tundraInfluence: climate.tundra_subpolar,
      temperateInfluence: clamp01(Math.max(climate.temperate_highland, climate.temperate_coastal_storm)),
      stormCoastInfluence: climate.temperate_coastal_storm,
      rainforestInfluence: climate.tropical_rainforest_wet_basin,
      monsoonInfluence: climate.monsoon_floodplain,
      desertInfluence: climate.arid_desert_dry_plateau,
      alpineInfluence: climate.alpine_mountain_arc,
      maritimeInfluence: climate.maritime_archipelago_subtropical_shelf,

      climateHint: climate.climateHint,
      climatePotential: climate.climatePotential,
      climateInfluences: {
        polar_icefield: climate.polar_icefield,
        tundra_subpolar: climate.tundra_subpolar,
        temperate_highland: climate.temperate_highland,
        temperate_coastal_storm: climate.temperate_coastal_storm,
        tropical_rainforest_wet_basin: climate.tropical_rainforest_wet_basin,
        monsoon_floodplain: climate.monsoon_floodplain,
        arid_desert_dry_plateau: climate.arid_desert_dry_plateau,
        alpine_mountain_arc: climate.alpine_mountain_arc,
        maritime_archipelago_subtropical_shelf: climate.maritime_archipelago_subtropical_shelf
      },

      summitRegionHint: summit.summitRegionHint,
      summitRegionLabel: summit.summitRegionLabel,
      summitTerrainHint: summit.summitTerrainHint,
      summitPotential: summit.summitPotential,

      isLand: elevation > SEA_LEVEL,
      isShallowWater: elevation <= SEA_LEVEL && elevation > -0.16,
      isDeepWater: elevation <= -0.16,

      terrainClassHint: "deep_ocean",

      finalVisualPassClaim: false
    };

    state.terrainClassHint = terrainHint(state);

    return state;
  }

  function read(...args) {
    return sample(...args);
  }

  function sampleElevation(...args) {
    return sample(...args).elevation;
  }

  function getElevation(...args) {
    return sample(...args).elevation;
  }

  function readElevation(...args) {
    return sample(...args).elevation;
  }

  function classify(...args) {
    return sample(...args).terrainClassHint;
  }

  function isLand(...args) {
    return sample(...args).isLand;
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "elevation",
      status: "active",
      purpose: "seven-continent-nine-climate-planetary-elevation",
      seaLevel: SEA_LEVEL,
      continents: CONTINENTS.map((continent) => ({
        index: continent.index,
        id: continent.id,
        name: continent.name,
        climates: continent.climates.slice(),
        role: continent.role
      })),
      climateInventory: CLIMATES.slice(),
      summitRegions: SUMMIT_REGIONS.map((summit) => ({
        id: summit.id,
        label: summit.label,
        continentId: summit.continentId,
        climate: summit.climate,
        terrain: summit.terrain
      })),
      parentChainCompatible: true,
      requiredGlobals: [
        "window.HEARTH.elevation",
        "window.HEARTH_ELEVATION",
        "window.HearthElevation"
      ],
      downstream: [
        "hearth.tectonics.js",
        "hearth.hydrology.js",
        "hearth.composition.js",
        "hearth.materials.js",
        "hearth.canvas.js"
      ],
      preservesFields: [
        "elevation",
        "landPotential",
        "shelfPotential",
        "bridgePotential",
        "ridgePotential",
        "saddlePotential",
        "basinPotential",
        "islandPotential",
        "coastPotential",
        "waterDepthPotential",
        "corePotential",
        "shieldPotential",
        "terrainClassHint"
      ],
      exposesFields: [
        "continentId",
        "continentName",
        "continentIndex",
        "continentPotential",
        "continentSeparation",
        "oceanBasinPotential",
        "continentShelfPotential",
        "mountainArcPotential",
        "plateauPotential",
        "canyonPotential",
        "escarpmentPotential",
        "waterfallCandidate",
        "archipelagoPotential",
        "climateHint",
        "climatePotential",
        "summitRegionHint",
        "summitPotential"
      ],
      designRules: [
        "seven continents define the planetary body",
        "nine climates define planetary diversity",
        "nine summits are nonlinear terrain-region attractors",
        "teleports handle later movement",
        "terrain must not become a straight path"
      ],
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      finalVisualPassClaim: false
    };
  }

  const api = {
    CONTRACT,
    RECEIPT,
    PREVIOUS_CONTRACT,
    VERSION,
    SEA_LEVEL,

    sample,
    read,
    sampleElevation,
    getElevation,
    readElevation,
    classify,
    isLand,
    getReceipt,

    continents: CONTINENTS.map((continent) => ({
      index: continent.index,
      id: continent.id,
      name: continent.name,
      climates: continent.climates.slice(),
      role: continent.role
    })),

    climateInventory: CLIMATES.slice(),

    summitRegions: SUMMIT_REGIONS.map((summit) => ({
      id: summit.id,
      label: summit.label,
      continentId: summit.continentId,
      climate: summit.climate,
      terrain: summit.terrain
    })),

    finalVisualPassClaim: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.elevation = api;

  root.HEARTH_ELEVATION = api;
  root.HearthElevation = api;
  root.HEARTH_ELEVATION_RECEIPT = getReceipt();
  root.HEARTH_ELEVATION_CONTRACT = CONTRACT;

  document.documentElement.dataset.hearthElevationAuthorityLoaded = "true";
  document.documentElement.dataset.hearthElevationContract = CONTRACT;
  document.documentElement.dataset.hearthElevationReceipt = RECEIPT;
  document.documentElement.dataset.hearthElevationPreviousContract = PREVIOUS_CONTRACT;
  document.documentElement.dataset.hearthSevenContinents = "true";
  document.documentElement.dataset.hearthNineClimates = "true";
  document.documentElement.dataset.hearthSummitsNonlinear = "true";
  document.documentElement.dataset.hearthTerrainNotRoutePath = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.webgl = "false";
  document.documentElement.dataset.visualPassClaimed = "false";

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

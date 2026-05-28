// /assets/hearth/hearth.elevation.js
// HEARTH_SEVEN_CONTINENT_REAL_PLANET_ELEVATION_TNT_v1
// Full-file replacement.
// Elevation authority only.
// Purpose:
// - Renew Hearth as a real planetary physical field.
// - Define seven continents, open ocean, ocean basins, shelves, coastlines, mountain arcs, plateaus, canyons, cliffs, waterfalls, archipelagos, nine climate families, and nonlinear summit-region terrain.
// - Feed composition/materials/canvas with deterministic physical structure.
// Does not own:
// - composition classification
// - materials palette
// - canvas drawing
// - runtime motion
// - controls
// - route orchestration
// - teleports
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_SEVEN_CONTINENT_REAL_PLANET_ELEVATION_TNT_v1";
  const RECEIPT = "HEARTH_SEVEN_CONTINENT_REAL_PLANET_ELEVATION_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_SEVEN_CONTINENT_NINE_CLIMATE_ELEVATION_AUTHORITY";
  const VERSION = "2026-05-28.hearth-seven-continent-real-planet-elevation-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const DEG = Math.PI / 180;
  const SEA_LEVEL = 0.0;

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

  const vectorToLonLat = (p) => {
    const n = normalize3(p);
    return {
      lon: Math.atan2(n.x, n.z) / DEG,
      lat: Math.asin(clamp(n.y, -1, 1)) / DEG
    };
  };

  const parseInput = (...args) => {
    if (args.length === 1 && args[0] && typeof args[0] === "object") {
      const p = args[0];

      if (
        Number.isFinite(Number(p.x)) &&
        Number.isFinite(Number(p.y)) &&
        Number.isFinite(Number(p.z))
      ) {
        const v = normalize3(p);
        const ll = vectorToLonLat(v);
        return { ...v, lon: ll.lon, lat: ll.lat };
      }

      if (Number.isFinite(Number(p.lon)) && Number.isFinite(Number(p.lat))) {
        const v = lonLatToVector(Number(p.lon), Number(p.lat));
        return { ...v, lon: Number(p.lon), lat: Number(p.lat) };
      }

      if (Number.isFinite(Number(p.longitude)) && Number.isFinite(Number(p.latitude))) {
        const v = lonLatToVector(Number(p.longitude), Number(p.latitude));
        return { ...v, lon: Number(p.longitude), lat: Number(p.latitude) };
      }

      if (Number.isFinite(Number(p.u)) && Number.isFinite(Number(p.v))) {
        const lon = Number(p.u) * 360 - 180;
        const lat = 90 - Number(p.v) * 180;
        const v = lonLatToVector(lon, lat);
        return { ...v, lon, lat };
      }
    }

    if (args.length >= 3) {
      const v = normalize3({ x: args[0], y: args[1], z: args[2] });
      const ll = vectorToLonLat(v);
      return { ...v, lon: ll.lon, lat: ll.lat };
    }

    if (args.length >= 2) {
      const lon = Number(args[0]);
      const lat = Number(args[1]);
      const v = lonLatToVector(lon, lat);
      return { ...v, lon, lat };
    }

    const v = lonLatToVector(0, 0);
    return { ...v, lon: 0, lat: 0 };
  };

  const hashNoise = (x, y, z, salt = 0) => {
    const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + salt * 41.31) * 43758.5453123;
    return n - Math.floor(n);
  };

  const valueNoise = (p, salt = 0) => {
    const n1 = hashNoise(p.x, p.y, p.z, salt);
    const n2 = hashNoise(p.y + n1, p.z - n1, p.x + n1, salt + 9);
    const n3 = hashNoise(p.z - n2, p.x + n2, p.y - n2, salt + 23);
    return clamp01(n1 * 0.52 + n2 * 0.31 + n3 * 0.17);
  };

  const lobe = (lon, lat, innerDeg, outerDeg, weight = 1) => ({
    center: lonLatToVector(lon, lat),
    innerDot: Math.cos(innerDeg * DEG),
    outerDot: Math.cos(outerDeg * DEG),
    weight
  });

  const CONTINENTS = Object.freeze([
    {
      id: "western_shield",
      name: "Western Shield Continent",
      index: 0,
      lobes: [
        lobe(-118, 18, 19, 46, 1.00),
        lobe(-145, 2, 14, 34, 0.66),
        lobe(-92, -8, 13, 31, 0.58)
      ]
    },
    {
      id: "eastern_basin",
      name: "Eastern Basin Continent",
      index: 1,
      lobes: [
        lobe(28, 6, 18, 43, 1.00),
        lobe(58, 17, 12, 31, 0.56),
        lobe(18, -24, 13, 32, 0.62)
      ]
    },
    {
      id: "northern_cold",
      name: "Northern Cold Continent",
      index: 2,
      lobes: [
        lobe(-38, 61, 17, 43, 1.00),
        lobe(16, 56, 12, 31, 0.58),
        lobe(-82, 62, 12, 30, 0.58)
      ]
    },
    {
      id: "southern_harsh",
      name: "Southern Harsh Continent",
      index: 3,
      lobes: [
        lobe(84, -45, 17, 41, 1.00),
        lobe(122, -49, 12, 29, 0.58),
        lobe(48, -34, 11, 28, 0.54)
      ]
    },
    {
      id: "equatorial_wet",
      name: "Equatorial Wet Continent",
      index: 4,
      lobes: [
        lobe(-34, -10, 15, 37, 1.00),
        lobe(-8, 4, 11, 28, 0.58),
        lobe(-58, 4, 10, 27, 0.52)
      ]
    },
    {
      id: "mountain_arc",
      name: "Mountain Arc Continent",
      index: 5,
      lobes: [
        lobe(138, 21, 16, 39, 1.00),
        lobe(162, 36, 11, 28, 0.56),
        lobe(113, 4, 11, 29, 0.58)
      ]
    },
    {
      id: "broken_archipelago",
      name: "Broken Archipelago Continent",
      index: 6,
      lobes: [
        lobe(-164, -31, 10, 27, 0.90),
        lobe(-136, -45, 9, 24, 0.74),
        lobe(171, -24, 9, 24, 0.70),
        lobe(-178, -6, 7, 19, 0.42)
      ]
    }
  ]);

  const SUMMIT_REGIONS = Object.freeze([
    {
      id: "summit_high_plateau",
      label: "High Plateau Summit Region",
      terrain: "plateau",
      center: lonLatToVector(-111, 21),
      innerDot: Math.cos(8 * DEG),
      outerDot: Math.cos(23 * DEG)
    },
    {
      id: "summit_waterfall_escarpment",
      label: "Waterfall Escarpment Summit Region",
      terrain: "waterfall_escarpment",
      center: lonLatToVector(-20, -6),
      innerDot: Math.cos(8 * DEG),
      outerDot: Math.cos(22 * DEG)
    },
    {
      id: "summit_canyon_crossing",
      label: "Canyon Crossing Summit Region",
      terrain: "canyon",
      center: lonLatToVector(42, 13),
      innerDot: Math.cos(8 * DEG),
      outerDot: Math.cos(22 * DEG)
    },
    {
      id: "summit_storm_coast_cliff",
      label: "Storm Coast Cliff Summit Region",
      terrain: "storm_coast_cliff",
      center: lonLatToVector(-72, 39),
      innerDot: Math.cos(8 * DEG),
      outerDot: Math.cos(23 * DEG)
    },
    {
      id: "summit_glacial_pass",
      label: "Glacial Pass Summit Region",
      terrain: "glacial_pass",
      center: lonLatToVector(-27, 66),
      innerDot: Math.cos(8 * DEG),
      outerDot: Math.cos(21 * DEG)
    },
    {
      id: "summit_rainforest_basin",
      label: "Rainforest Basin Summit Region",
      terrain: "rainforest_basin",
      center: lonLatToVector(-45, -8),
      innerDot: Math.cos(8 * DEG),
      outerDot: Math.cos(23 * DEG)
    },
    {
      id: "summit_mountain_arc",
      label: "Mountain Arc Summit Region",
      terrain: "mountain_arc",
      center: lonLatToVector(142, 24),
      innerDot: Math.cos(8 * DEG),
      outerDot: Math.cos(23 * DEG)
    },
    {
      id: "summit_dry_plateau",
      label: "Dry Plateau Summit Region",
      terrain: "dry_plateau",
      center: lonLatToVector(82, -37),
      innerDot: Math.cos(8 * DEG),
      outerDot: Math.cos(23 * DEG)
    },
    {
      id: "summit_archipelago_threshold",
      label: "Archipelago Threshold Summit Region",
      terrain: "archipelago_threshold",
      center: lonLatToVector(-157, -30),
      innerDot: Math.cos(8 * DEG),
      outerDot: Math.cos(24 * DEG)
    }
  ]);

  const dot3 = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;

  const lobePotential = (p, item) => {
    const d = dot3(p, item.center);
    return smoothstep(item.outerDot, item.innerDot, d) * item.weight;
  };

  const sampleContinentField = (p) => {
    let best = null;
    let second = null;

    for (const continent of CONTINENTS) {
      let potential = 0;

      for (const item of continent.lobes) {
        potential = Math.max(potential, lobePotential(p, item));
      }

      const shape = valueNoise(p, continent.index + 13);
      const edgeNoise = (shape - 0.5) * 0.18;
      potential = clamp01(potential * (0.92 + shape * 0.16) + edgeNoise * softBand(potential, 0.52, 0.22));

      const record = { ...continent, potential };

      if (!best || record.potential > best.potential) {
        second = best;
        best = record;
      } else if (!second || record.potential > second.potential) {
        second = record;
      }
    }

    second = second || {
      id: "open_ocean",
      name: "Open Ocean",
      index: -1,
      potential: 0
    };

    const competition = clamp01(Math.min(best.potential, second.potential) * 1.25);
    const closeness = clamp01(1 - Math.abs(best.potential - second.potential) / 0.30);
    const continentSeparation = clamp01(competition * closeness);

    return {
      best,
      second,
      continentSeparation,
      nearestContinentDistance: clamp01(1 - best.potential)
    };
  };

  const sampleSummitField = (p, landPotential) => {
    let best = {
      summitRegionHint: "none",
      summitRegionLabel: "None",
      summitTerrainHint: "none",
      summitPotential: 0
    };

    for (const item of SUMMIT_REGIONS) {
      const potential = lobePotential(p, item) * clamp01(0.45 + landPotential * 0.72);

      if (potential > best.summitPotential) {
        best = {
          summitRegionHint: item.id,
          summitRegionLabel: item.label,
          summitTerrainHint: item.terrain,
          summitPotential: clamp01(potential)
        };
      }
    }

    if (best.summitPotential < 0.18) {
      best.summitRegionHint = "none";
      best.summitRegionLabel = "None";
      best.summitTerrainHint = "none";
    }

    return best;
  };

  const climateInfluencesFor = (p, field, landPotential, coastPotential, mountainArcPotential, plateauPotential, archipelagoPotential) => {
    const absLat = Math.abs(p.lat);

    const polar = smoothstep(58, 76, absLat);
    const tundra = softBand(absLat, 55, 16) * (1 - polar * 0.45);
    const temperate = softBand(absLat, 36, 24) * clamp01(0.35 + landPotential);
    const equatorial = smoothstep(32, 4, absLat);
    const subtropical = softBand(absLat, 24, 18);

    const western = field.best.id === "western_shield" ? field.best.potential : 0;
    const eastern = field.best.id === "eastern_basin" ? field.best.potential : 0;
    const northern = field.best.id === "northern_cold" ? field.best.potential : 0;
    const southern = field.best.id === "southern_harsh" ? field.best.potential : 0;
    const wet = field.best.id === "equatorial_wet" ? field.best.potential : 0;
    const mountain = field.best.id === "mountain_arc" ? field.best.potential : 0;
    const broken = field.best.id === "broken_archipelago" ? field.best.potential : 0;

    return {
      polar_icefield: clamp01(polar * (0.50 + northern * 0.75)),
      tundra_subpolar: clamp01(tundra * (0.35 + northern * 0.62 + southern * 0.18)),
      temperate_highland: clamp01(temperate * (0.28 + western * 0.48 + plateauPotential * 0.38)),
      temperate_coastal_storm: clamp01(temperate * coastPotential * (0.32 + western * 0.22 + northern * 0.18)),
      tropical_rainforest_wet_basin: clamp01(equatorial * (wet * 0.82 + field.best.potential * 0.16)),
      monsoon_floodplain: clamp01(subtropical * (eastern * 0.58 + wet * 0.25)),
      arid_desert_dry_plateau: clamp01(subtropical * (southern * 0.72 + plateauPotential * 0.32)),
      alpine_mountain_arc: clamp01((mountain * 0.78 + mountainArcPotential * 0.52) * (0.45 + landPotential * 0.50)),
      maritime_archipelago_subtropical_shelf: clamp01((broken * 0.72 + archipelagoPotential * 0.58 + coastPotential * 0.25) * (0.35 + subtropical * 0.55))
    };
  };

  const dominantClimate = (climateInfluences, isDeepWater, isShelf) => {
    if (isDeepWater && !isShelf) return "open_ocean";

    let best = "temperate_highland";
    let value = -1;

    Object.keys(climateInfluences).forEach((key) => {
      if (climateInfluences[key] > value) {
        best = key;
        value = climateInfluences[key];
      }
    });

    return best;
  };

  const terrainClassHintFor = (sample) => {
    if (sample.elevation <= -0.30 || sample.oceanBasinPotential > 0.62) return "ocean_basin";
    if (sample.elevation <= -0.18) return "deep_ocean";
    if (sample.archipelagoPotential > 0.42 && sample.elevation <= SEA_LEVEL) return "archipelago_shelf";
    if (sample.continentShelfPotential > 0.38 && sample.elevation <= SEA_LEVEL) return "continental_shelf";
    if (sample.elevation <= SEA_LEVEL) return "shallow_water";
    if (sample.waterfallCandidate > 0.52) return "waterfall_escarpment";
    if (sample.escarpmentPotential > 0.54) return "cliff_escarpment";
    if (sample.canyonPotential > 0.50) return "canyon_corridor";
    if (sample.summitPotential > 0.58) return "summit_region";
    if (sample.mountainArcPotential > 0.56) return "mountain_arc";
    if (sample.plateauPotential > 0.54) return "plateau_interior";
    if (sample.basinPotential > 0.48) return "basin_floor";
    if (sample.coastPotential > 0.58) return "coast_edge";
    if (sample.archipelagoPotential > 0.40) return "island_arc";
    return "continent_mass";
  };

  const sample = (...args) => {
    const p = parseInput(...args);
    const field = sampleContinentField(p);
    const shapeNoise = valueNoise(p, 101);
    const fractureNoise = valueNoise({ x: p.y, y: p.z, z: p.x }, 211);
    const basinNoise = valueNoise({ x: p.z, y: p.x, z: p.y }, 307);

    const bestPotential = field.best.potential;
    const secondPotential = field.second.potential;
    const rawShelfBand = softBand(bestPotential, 0.49, 0.16);
    const landThreshold = clamp(0.565 + field.continentSeparation * 0.035 - (field.best.id === "broken_archipelago" ? 0.045 : 0), 0.49, 0.62);

    const continentPotential = clamp01(bestPotential);
    const landPotential = clamp01(smoothstep(landThreshold - 0.10, landThreshold + 0.10, bestPotential));
    const continentShelfPotential = clamp01(rawShelfBand * (0.72 + (1 - landPotential) * 0.34));
    const shelfPotential = continentShelfPotential;

    const openOceanStrength = clamp01(smoothstep(0.42, 0.18, bestPotential));
    const oceanBasinPotential = clamp01(openOceanStrength * (0.62 + basinNoise * 0.38));
    const coastPotential = clamp01(softBand(bestPotential, landThreshold, 0.13) * (0.76 + shapeNoise * 0.24));
    const waterDepthBase = clamp01(openOceanStrength * 0.78 + smoothstep(0.44, 0.18, bestPotential) * 0.22);

    const brokenContinent = field.best.id === "broken_archipelago" ? 1 : 0;
    const archipelagoPotential = clamp01(
      brokenContinent * bestPotential * (0.54 + fractureNoise * 0.58) +
      coastPotential * brokenContinent * 0.22 +
      secondPotential * 0.08
    );

    const mountainContinent = field.best.id === "mountain_arc" ? field.best.potential : 0;
    const westernContinent = field.best.id === "western_shield" ? field.best.potential : 0;
    const easternContinent = field.best.id === "eastern_basin" ? field.best.potential : 0;
    const northernContinent = field.best.id === "northern_cold" ? field.best.potential : 0;
    const southernContinent = field.best.id === "southern_harsh" ? field.best.potential : 0;
    const wetContinent = field.best.id === "equatorial_wet" ? field.best.potential : 0;

    const mountainArcPotential = clamp01(
      mountainContinent * 0.78 +
      softBand(p.lon, 140, 24) * softBand(p.lat, 22, 22) * landPotential * 0.44 +
      fractureNoise * landPotential * 0.16
    );

    const plateauPotential = clamp01(
      westernContinent * 0.44 +
      southernContinent * 0.42 +
      softBand(bestPotential, 0.78, 0.24) * landPotential * 0.24
    );

    const basinPotential = clamp01(
      easternContinent * 0.42 +
      wetContinent * 0.38 +
      smoothstep(0.45, 0.76, bestPotential) * (1 - mountainArcPotential) * basinNoise * 0.24
    );

    const canyonPotential = clamp01(
      mountainArcPotential * (0.28 + fractureNoise * 0.44) +
      southernContinent * fractureNoise * 0.30 +
      easternContinent * softBand(p.lat, 12, 18) * 0.24
    );

    const escarpmentPotential = clamp01(
      coastPotential * 0.30 +
      mountainArcPotential * 0.26 +
      canyonPotential * 0.28 +
      field.continentSeparation * 0.18 +
      plateauPotential * fractureNoise * 0.18
    );

    const waterfallCandidate = clamp01(
      escarpmentPotential *
      (wetContinent * 0.36 + easternContinent * 0.22 + coastPotential * 0.18 + mountainArcPotential * 0.18) +
      softBand(p.lon, -20, 18) * softBand(p.lat, -6, 16) * landPotential * 0.42
    );

    const ridgePotential = clamp01(mountainArcPotential * 0.64 + escarpmentPotential * 0.22 + fractureNoise * landPotential * 0.16);
    const saddlePotential = clamp01(field.continentSeparation * 0.38 + canyonPotential * 0.20 + rawShelfBand * 0.16);
    const islandPotential = clamp01(archipelagoPotential * 0.62 + coastPotential * brokenContinent * 0.28);
    const scarPotential = clamp01(field.continentSeparation * 0.34 + fractureNoise * landPotential * 0.18 + canyonPotential * 0.20);

    let elevation =
      -0.58 +
      bestPotential * 1.02 +
      landPotential * 0.10 +
      mountainArcPotential * 0.24 +
      plateauPotential * 0.14 -
      basinPotential * 0.11 -
      oceanBasinPotential * 0.08 -
      field.continentSeparation * 0.06 +
      (shapeNoise - 0.5) * 0.075 +
      (fractureNoise - 0.5) * 0.055;

    if (archipelagoPotential > 0.36) {
      const islandLift = smoothstep(0.48, 0.82, fractureNoise) * archipelagoPotential * 0.18;
      elevation += islandLift - archipelagoPotential * 0.035;
    }

    elevation = clamp(elevation, -1, 1);

    const isLand = elevation > SEA_LEVEL;
    const isShallowWater = elevation <= SEA_LEVEL && elevation > -0.18;
    const isDeepWater = elevation <= -0.18;
    const isWater = !isLand;

    const waterDepthPotential = isWater
      ? clamp01(Math.max(waterDepthBase, -elevation / 0.72))
      : 0;

    const climateInfluences = climateInfluencesFor(
      p,
      field,
      landPotential,
      coastPotential,
      mountainArcPotential,
      plateauPotential,
      archipelagoPotential
    );

    const climateHint = dominantClimate(climateInfluences, isDeepWater, continentShelfPotential > 0.30 || archipelagoPotential > 0.28);
    const climatePotential = climateHint === "open_ocean"
      ? oceanBasinPotential
      : clamp01(climateInfluences[climateHint] || 0);

    const summit = sampleSummitField(p, landPotential);

    const continentId = isDeepWater && oceanBasinPotential > 0.56
      ? "open_ocean"
      : field.best.id;

    const continentName = continentId === "open_ocean"
      ? "Open Ocean"
      : field.best.name;

    const continentIndex = continentId === "open_ocean"
      ? -1
      : field.best.index;

    const output = {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "elevation",

      x: p.x,
      y: p.y,
      z: p.z,
      lon: p.lon,
      lat: p.lat,

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

      continentId,
      continentName,
      continentIndex,
      continentPotential,
      continentSeparation: field.continentSeparation,
      nearestContinentDistance: field.nearestContinentDistance,

      climateHint,
      climatePotential,
      climateInfluences,

      polarInfluence: climateInfluences.polar_icefield,
      tundraInfluence: climateInfluences.tundra_subpolar,
      temperateInfluence: Math.max(climateInfluences.temperate_highland, climateInfluences.temperate_coastal_storm),
      stormCoastInfluence: climateInfluences.temperate_coastal_storm,
      rainforestInfluence: climateInfluences.tropical_rainforest_wet_basin,
      monsoonInfluence: climateInfluences.monsoon_floodplain,
      desertInfluence: climateInfluences.arid_desert_dry_plateau,
      alpineInfluence: climateInfluences.alpine_mountain_arc,
      maritimeInfluence: climateInfluences.maritime_archipelago_subtropical_shelf,

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
      shieldPotential: clamp01(westernContinent * 0.55 + plateauPotential * 0.28 + landPotential * 0.12),
      bridgePotential: clamp01(field.continentSeparation * 0.16 + scarPotential * 0.16),

      dominantCoreId: continentId
    };

    output.terrainClassHint = terrainClassHintFor(output);

    output.generatedImage = false;
    output.graphicBox = false;
    output.webGL = false;
    output.visualPassClaimed = false;

    return output;
  };

  const read = (...args) => sample(...args);
  const getElevation = (...args) => sample(...args);
  const sampleElevation = (...args) => sample(...args);
  const readElevation = (...args) => sample(...args);

  const getReceipt = () => ({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    authority: "elevation",
    status: "active",
    purpose: "seven-continent-real-planet-physical-field",
    continents: [
      "western_shield",
      "eastern_basin",
      "northern_cold",
      "southern_harsh",
      "equatorial_wet",
      "mountain_arc",
      "broken_archipelago",
      "open_ocean"
    ],
    climates: [
      "polar_icefield",
      "tundra_subpolar",
      "temperate_highland",
      "temperate_coastal_storm",
      "tropical_rainforest_wet_basin",
      "monsoon_floodplain",
      "arid_desert_dry_plateau",
      "alpine_mountain_arc",
      "maritime_archipelago_subtropical_shelf",
      "open_ocean"
    ],
    summitRegions: SUMMIT_REGIONS.map((item) => item.id),
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
      "dominantCoreId"
    ],
    designRules: [
      "seven continents plus open ocean",
      "ocean basins and shelves structurally present",
      "nine climate families distributed across planet",
      "summit regions are nonlinear terrain regions",
      "no canvas ownership",
      "no material ownership",
      "no final visual pass claim"
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
    seaLevel: SEA_LEVEL,

    sample,
    read,
    getElevation,
    sampleElevation,
    readElevation,
    getReceipt,

    supportsSevenContinentRealPlanetElevation: true,
    supportsNineClimateFamilies: true,
    supportsNonlinearSummitRegions: true,

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
  root.HEARTH_ELEVATION_SUPPORTS_SEVEN_CONTINENT_REAL_PLANET = true;

  document.documentElement.dataset.hearthElevationAuthorityLoaded = "true";
  document.documentElement.dataset.hearthElevationContract = CONTRACT;
  document.documentElement.dataset.hearthElevationReceipt = RECEIPT;
  document.documentElement.dataset.hearthElevationPreviousContract = PREVIOUS_CONTRACT;
  document.documentElement.dataset.hearthElevationSevenContinents = "true";
  document.documentElement.dataset.hearthElevationNineClimates = "true";
  document.documentElement.dataset.hearthElevationNonlinearSummits = "true";
  document.documentElement.dataset.hearthElevationRealPlanetField = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.webgl = "false";
  document.documentElement.dataset.visualPassClaimed = "false";

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

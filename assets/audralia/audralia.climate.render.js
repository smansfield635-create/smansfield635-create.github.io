// /assets/audralia/audralia.climate.render.js
// AUDRALIA_CLIMATE_AND_ENVIRONMENT_DETAIL_TNT_v1
// Full-file replacement.
// Climate/environment authority layer.
// Defines climate zones from landmap, 256 lattice signals, Nine Summits provinces, elevation, latitude, coastline, basin/ridge, and stewardship influence.
// Does not own footprint.
// Does not own canvas.
// Does not use generated image.
// Does not use GraphicBox.
// Does not claim visual pass.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_CLIMATE_AND_ENVIRONMENT_DETAIL_TNT_v1";
  const RECEIPT = "AUDRALIA_CLIMATE_AND_ENVIRONMENT_DETAIL_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_CLIMATE_RENDER_HELD_OR_LEGACY";
  const VERSION = "2026-05-15.audralia-climate-and-environment-detail-v1";

  const CLIMATE_ZONES = Object.freeze([
    "equatorial_rainforest",
    "equatorial_wetland",
    "tropical_coast",
    "savanna",
    "dry_basin",
    "temperate_forest",
    "temperate_grassland",
    "highland_forest",
    "alpine_stone",
    "snow_mountain",
    "polar_ice",
    "restoration_green_belt",
    "stewardship_coast",
    "protected_valley",
    "mineral_desert",
    "opal_beach",
    "black_diamond_beach",
    "white_sand_beach",
    "deep_ocean",
    "coastal_shelf"
  ]);

  const SUMMIT_CLIMATE = Object.freeze({
    Gratitude: {
      moisture: 0.22,
      warmth: 0.08,
      fertility: 0.36,
      dryness: -0.14,
      forest: 0.20,
      wetland: 0.18,
      mountain: -0.04,
      beachWhite: 0.10,
      beachBlack: 0.02,
      restoration: 0.12,
      role: "fertile_lowlands"
    },
    Balance: {
      moisture: 0.10,
      warmth: 0.00,
      fertility: 0.18,
      dryness: -0.02,
      forest: 0.14,
      wetland: 0.05,
      mountain: 0.04,
      beachWhite: 0.08,
      beachBlack: 0.06,
      restoration: 0.16,
      role: "moderate_mixed_climate"
    },
    Stability: {
      moisture: -0.08,
      warmth: -0.02,
      fertility: 0.04,
      dryness: 0.18,
      forest: -0.04,
      wetland: -0.08,
      mountain: 0.18,
      beachWhite: 0.03,
      beachBlack: 0.16,
      restoration: 0.08,
      role: "old_craton_and_plateau"
    },
    Peace: {
      moisture: 0.28,
      warmth: 0.02,
      fertility: 0.22,
      dryness: -0.20,
      forest: 0.16,
      wetland: 0.34,
      mountain: -0.08,
      beachWhite: 0.12,
      beachBlack: 0.03,
      restoration: 0.18,
      role: "wetlands_and_protected_bays"
    },
    Joy: {
      moisture: 0.14,
      warmth: 0.18,
      fertility: 0.20,
      dryness: -0.06,
      forest: 0.12,
      wetland: 0.10,
      mountain: -0.02,
      beachWhite: 0.34,
      beachBlack: 0.05,
      restoration: 0.12,
      role: "bright_coasts_and_islands"
    },
    Dignity: {
      moisture: -0.04,
      warmth: -0.10,
      fertility: -0.02,
      dryness: 0.12,
      forest: -0.08,
      wetland: -0.10,
      mountain: 0.40,
      beachWhite: 0.02,
      beachBlack: 0.34,
      restoration: 0.05,
      role: "mountain_mineral_pressure"
    },
    "Free Will": {
      moisture: 0.02,
      warmth: 0.05,
      fertility: 0.04,
      dryness: 0.05,
      forest: 0.02,
      wetland: 0.03,
      mountain: 0.08,
      beachWhite: 0.14,
      beachBlack: 0.12,
      restoration: 0.06,
      role: "broken_edges_and_straits"
    },
    Love: {
      moisture: 0.18,
      warmth: 0.12,
      fertility: 0.32,
      dryness: -0.12,
      forest: 0.24,
      wetland: 0.14,
      mountain: 0.00,
      beachWhite: 0.16,
      beachBlack: 0.04,
      restoration: 0.22,
      role: "sheltered_valleys"
    },
    Stewardship: {
      moisture: 0.16,
      warmth: 0.04,
      fertility: 0.28,
      dryness: -0.10,
      forest: 0.26,
      wetland: 0.12,
      mountain: 0.04,
      beachWhite: 0.12,
      beachBlack: 0.08,
      restoration: 0.40,
      role: "restoration_green_infrastructure"
    }
  });

  const PALETTES = Object.freeze({
    equatorial_rainforest: {
      base: [38, 106, 58],
      mid: [61, 139, 72],
      high: [99, 166, 88],
      shadow: [23, 72, 49],
      material: "deep_lush_green"
    },
    equatorial_wetland: {
      base: [45, 105, 74],
      mid: [67, 139, 98],
      high: [103, 162, 120],
      shadow: [22, 63, 59],
      material: "wetland_green_blue"
    },
    tropical_coast: {
      base: [62, 134, 72],
      mid: [91, 161, 89],
      high: [128, 185, 111],
      shadow: [31, 84, 65],
      material: "warm_coastal_green"
    },
    savanna: {
      base: [128, 143, 72],
      mid: [162, 164, 83],
      high: [190, 177, 98],
      shadow: [80, 100, 58],
      material: "yellow_green_savanna"
    },
    dry_basin: {
      base: [143, 118, 72],
      mid: [171, 139, 82],
      high: [201, 166, 101],
      shadow: [82, 72, 55],
      material: "ochre_dry_basin"
    },
    temperate_forest: {
      base: [60, 120, 70],
      mid: [84, 145, 84],
      high: [124, 171, 103],
      shadow: [30, 78, 55],
      material: "temperate_green"
    },
    temperate_grassland: {
      base: [100, 132, 72],
      mid: [134, 156, 82],
      high: [174, 182, 105],
      shadow: [61, 84, 55],
      material: "soft_grassland"
    },
    highland_forest: {
      base: [66, 104, 72],
      mid: [92, 126, 87],
      high: [130, 153, 109],
      shadow: [42, 64, 58],
      material: "cool_highland_green"
    },
    alpine_stone: {
      base: [104, 108, 96],
      mid: [133, 133, 114],
      high: [165, 160, 132],
      shadow: [64, 70, 70],
      material: "stone_highland"
    },
    snow_mountain: {
      base: [174, 190, 184],
      mid: [205, 216, 208],
      high: [235, 240, 230],
      shadow: [108, 126, 132],
      material: "snow_and_old_stone"
    },
    polar_ice: {
      base: [168, 205, 212],
      mid: [201, 229, 228],
      high: [235, 244, 240],
      shadow: [89, 128, 150],
      material: "polar_ice"
    },
    restoration_green_belt: {
      base: [46, 128, 76],
      mid: [78, 166, 98],
      high: [135, 204, 128],
      shadow: [26, 74, 59],
      material: "restoration_green"
    },
    stewardship_coast: {
      base: [62, 141, 103],
      mid: [93, 176, 125],
      high: [151, 211, 154],
      shadow: [30, 82, 76],
      material: "protected_coastal_green"
    },
    protected_valley: {
      base: [72, 139, 76],
      mid: [108, 167, 93],
      high: [155, 197, 117],
      shadow: [40, 87, 58],
      material: "sheltered_valley_green"
    },
    mineral_desert: {
      base: [150, 110, 72],
      mid: [185, 141, 88],
      high: [220, 177, 112],
      shadow: [86, 65, 55],
      material: "mineral_ochre"
    },
    opal_beach: {
      base: [196, 184, 138],
      mid: [218, 207, 158],
      high: [238, 230, 185],
      shadow: [128, 130, 105],
      material: "opal_soft_beach"
    },
    black_diamond_beach: {
      base: [62, 64, 70],
      mid: [98, 98, 96],
      high: [158, 154, 134],
      shadow: [20, 26, 34],
      material: "black_diamond_sand"
    },
    white_sand_beach: {
      base: [202, 196, 156],
      mid: [226, 220, 178],
      high: [246, 240, 204],
      shadow: [140, 144, 121],
      material: "white_sand"
    },
    deep_ocean: {
      base: [3, 18, 44],
      mid: [5, 48, 88],
      high: [8, 68, 115],
      shadow: [1, 8, 25],
      material: "deep_ocean"
    },
    coastal_shelf: {
      base: [17, 92, 121],
      mid: [32, 130, 150],
      high: [65, 164, 164],
      shadow: [5, 48, 83],
      material: "coastal_shelf"
    }
  });

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function mixColor(a, b, t) {
    const k = clamp(t, 0, 1);
    return [
      Math.round(lerp(a[0], b[0], k)),
      Math.round(lerp(a[1], b[1], k)),
      Math.round(lerp(a[2], b[2], k))
    ];
  }

  function shade(color, amount) {
    return [
      clamp(Math.round(color[0] + amount), 0, 255),
      clamp(Math.round(color[1] + amount), 0, 255),
      clamp(Math.round(color[2] + amount), 0, 255)
    ];
  }

  function wrap01(value) {
    return ((value % 1) + 1) % 1;
  }

  function hash(x, y, seed) {
    let h = Math.imul(x ^ 0x9e3779b9, 0x85ebca6b);
    h ^= Math.imul(y ^ seed ^ 0xc2b2ae35, 0x27d4eb2f);
    h ^= h >>> 15;
    h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967295;
  }

  function noise(u, v, scale, seed) {
    const s = Math.max(1, Math.floor(scale));
    const x = wrap01(u) * s;
    const y = clamp(v, 0, 1) * s;

    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const x1 = x0 + 1;
    const y1 = y0 + 1;

    const xf = x - x0;
    const yf = y - y0;
    const sx = xf * xf * (3 - 2 * xf);
    const sy = yf * yf * (3 - 2 * yf);

    const a = hash(((x0 % s) + s) % s, y0, seed);
    const b = hash(((x1 % s) + s) % s, y0, seed);
    const c = hash(((x0 % s) + s) % s, y1, seed);
    const d = hash(((x1 % s) + s) % s, y1, seed);

    return (a + (b - a) * sx) * (1 - sy) + (c + (d - c) * sx) * sy;
  }

  function fbm(u, v, seed, octaves = 5) {
    let total = 0;
    let norm = 0;
    let amp = 0.58;
    let scale = 3.5;

    for (let i = 0; i < octaves; i += 1) {
      total += noise(u, v, scale, seed + i * 131) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= 2;
    }

    return total / Math.max(0.000001, norm);
  }

  function numeric(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function summitProfile(name) {
    return SUMMIT_CLIMATE[String(name || "Balance")] || SUMMIT_CLIMATE.Balance;
  }

  function latitudeHeat(latitude) {
    const absLat = Math.abs(numeric(latitude, 0));
    return clamp(1 - absLat / 90, 0, 1);
  }

  function polarPressure(latitude) {
    return smoothstep(55, 84, Math.abs(numeric(latitude, 0)));
  }

  function coastInfluence(map) {
    const beachEdge = numeric(map.beachEdge, 0);
    const coastline = numeric(map.coastline, 0);
    const shelf = numeric(map.shelf, 0);
    return clamp(Math.max(beachEdge, coastline * 0.9, shelf * 0.7), 0, 1);
  }

  function elevationPressure(map) {
    const terrainClass = String(map.terrainClass || "");
    const elevationScore = numeric(map.elevationScore, 0);

    if (terrainClass === "mountain") return Math.max(0.80, elevationScore);
    if (terrainClass === "highland") return Math.max(0.66, elevationScore);
    if (terrainClass === "plateau") return Math.max(0.52, elevationScore);
    if (terrainClass === "polar-ice") return 0.92;
    if (terrainClass === "beach" || terrainClass === "shelf" || terrainClass === "ocean") return 0;

    return clamp(elevationScore, 0, 1);
  }

  function climateSeed(map) {
    const cell256 = numeric(map.cell256, 1);
    const cell64 = numeric(map.cell64, 1);
    const cell16 = numeric(map.cell16, 1);
    return Math.floor(cell256 * 131 + cell64 * 17 + cell16 * 7);
  }

  function beachClimate(map, moisture, heat, dryness, province) {
    const u = numeric(map.u, 0);
    const v = numeric(map.v, 0);
    const seed = climateSeed(map);
    const opal = fbm(u * 2.1 + 0.17, v * 1.8 - 0.11, 771000 + seed, 4) + province.beachWhite;
    const black = fbm(u * 2.6 - 0.21, v * 2.2 + 0.08, 772000 + seed, 4) + province.beachBlack + elevationPressure(map) * 0.12;
    const white = heat * 0.22 + moisture * 0.10 + province.beachWhite;

    if (black > 0.80 && black > opal + 0.08) return "black_diamond_beach";
    if (opal > 0.78) return "opal_beach";
    if (white > 0.46 && dryness < 0.66) return "white_sand_beach";

    return "opal_beach";
  }

  function classifyClimate(map) {
    const terrainClass = String(map.terrainClass || "ocean");
    const topology = String(map.topology || "");
    const u = numeric(map.u, 0);
    const v = numeric(map.v, 0);
    const latitude = numeric(map.latitude, 0);
    const seed = climateSeed(map);
    const province = summitProfile(map.summitProvince || map.primarySummit);

    if (map.isOcean || terrainClass === "ocean") return "deep_ocean";
    if (map.isShelf || terrainClass === "shelf") return "coastal_shelf";
    if (map.isPolarIce || terrainClass === "polar-ice") return "polar_ice";

    const heatBase = latitudeHeat(latitude);
    const polar = polarPressure(latitude);
    const coast = coastInfluence(map);
    const elevation = elevationPressure(map);
    const ridge = clamp(numeric(map.nodalRidge, 0.4), 0, 1);
    const basin = clamp(numeric(map.nodalBasin, 0.4), 0, 1);
    const greenBelt = clamp(numeric(map.nodalGreenBelt, 0.4), 0, 1);
    const tech = clamp(numeric(map.nodalTechnology, 0.4), 0, 1);

    const moistureNoise = fbm(u * 1.35 + 0.13, v * 1.05 - 0.07, 781000 + seed, 5);
    const rainShadow = ridge * elevation * 0.28;
    const seaMoisture = coast * 0.30;
    const basinMoisture = basin * 0.18;

    const moisture = clamp(
      moistureNoise * 0.52 +
      heatBase * 0.14 +
      seaMoisture +
      basinMoisture +
      province.moisture -
      rainShadow -
      polar * 0.18,
      0,
      1
    );

    const drynessNoise = fbm(u * 1.8 - 0.31, v * 1.6 + 0.22, 782000 + seed, 4);
    const dryness = clamp(
      drynessNoise * 0.36 +
      (1 - moisture) * 0.42 +
      elevation * 0.12 +
      province.dryness -
      coast * 0.08,
      0,
      1
    );

    const heat = clamp(
      heatBase +
      province.warmth -
      elevation * 0.32 -
      polar * 0.44 +
      coast * 0.04,
      0,
      1
    );

    const restoration = clamp(
      province.restoration +
      greenBelt * 0.28 +
      tech * 0.18 +
      moisture * 0.08,
      0,
      1
    );

    if (map.isBeach || terrainClass === "beach") {
      return beachClimate(map, moisture, heat, dryness, province);
    }

    if (terrainClass === "mountain" || elevation >= 0.80) {
      if (heat < 0.42 || polar > 0.34) return "snow_mountain";
      return "alpine_stone";
    }

    if (terrainClass === "highland") {
      if (heat < 0.46 || elevation > 0.72) return "alpine_stone";
      if (moisture > 0.52) return "highland_forest";
      return "temperate_grassland";
    }

    if (topology.includes("wetland") || terrainClass === "wetland" || moisture > 0.78 && basin > 0.42) {
      if (Math.abs(latitude) < 18) return "equatorial_wetland";
      return "equatorial_wetland";
    }

    if (restoration > 0.62 && moisture > 0.42 && dryness < 0.62) return "restoration_green_belt";
    if (coast > 0.58 && moisture > 0.48 && restoration > 0.38) return "stewardship_coast";
    if (topology.includes("valley") || province.role === "sheltered_valleys") return "protected_valley";

    if (Math.abs(latitude) < 18) {
      if (moisture > 0.62) return "equatorial_rainforest";
      if (dryness > 0.62) return "savanna";
      return "tropical_coast";
    }

    if (Math.abs(latitude) < 33) {
      if (dryness > 0.72) return "mineral_desert";
      if (dryness > 0.56) return "savanna";
      if (moisture > 0.58) return "temperate_forest";
      return "temperate_grassland";
    }

    if (Math.abs(latitude) < 55) {
      if (dryness > 0.68) return "dry_basin";
      if (moisture > 0.50) return "temperate_forest";
      return "temperate_grassland";
    }

    if (polar > 0.55) return "polar_ice";
    if (moisture > 0.48) return "highland_forest";
    return "alpine_stone";
  }

  function deriveEnvironment(map, climateZone) {
    if (climateZone === "deep_ocean") return "ocean_basin";
    if (climateZone === "coastal_shelf") return "shelf_water";
    if (climateZone === "equatorial_rainforest") return "rainforest";
    if (climateZone === "equatorial_wetland") return "wetland";
    if (climateZone === "tropical_coast") return "coastal_green_belt";
    if (climateZone === "savanna") return "savanna";
    if (climateZone === "dry_basin") return "dry_basin";
    if (climateZone === "temperate_forest") return "temperate_forest";
    if (climateZone === "temperate_grassland") return "grassland";
    if (climateZone === "highland_forest") return "highland_forest";
    if (climateZone === "alpine_stone") return "alpine";
    if (climateZone === "snow_mountain") return "snow_mountain";
    if (climateZone === "polar_ice") return "polar";
    if (climateZone === "restoration_green_belt") return "restoration_belt";
    if (climateZone === "stewardship_coast") return "stewardship_coast";
    if (climateZone === "protected_valley") return "protected_valley";
    if (climateZone === "mineral_desert") return "mineral_desert";
    if (climateZone === "opal_beach") return "opal_beach";
    if (climateZone === "black_diamond_beach") return "black_diamond_beach";
    if (climateZone === "white_sand_beach") return "white_sand_beach";

    return String(map.terrainClass || "unknown_environment");
  }

  function climateMetrics(map, climateZone) {
    const province = summitProfile(map.summitProvince || map.primarySummit);
    const u = numeric(map.u, 0);
    const v = numeric(map.v, 0);
    const seed = climateSeed(map);
    const latitude = numeric(map.latitude, 0);
    const heatBase = latitudeHeat(latitude);
    const elevation = elevationPressure(map);
    const coast = coastInfluence(map);
    const ridge = clamp(numeric(map.nodalRidge, 0.4), 0, 1);
    const basin = clamp(numeric(map.nodalBasin, 0.4), 0, 1);
    const greenBelt = clamp(numeric(map.nodalGreenBelt, 0.4), 0, 1);
    const tech = clamp(numeric(map.nodalTechnology, 0.4), 0, 1);

    const moistureNoise = fbm(u * 1.35 + 0.13, v * 1.05 - 0.07, 781000 + seed, 5);
    const drynessNoise = fbm(u * 1.8 - 0.31, v * 1.6 + 0.22, 782000 + seed, 4);
    const mineralNoise = fbm(u * 2.4 - 0.28, v * 2.0 + 0.18, 783000 + seed, 4);

    const moisture = clamp(
      moistureNoise * 0.52 +
      heatBase * 0.14 +
      coast * 0.30 +
      basin * 0.18 +
      province.moisture -
      ridge * elevation * 0.28 -
      polarPressure(latitude) * 0.18,
      0,
      1
    );

    const dryness = clamp(
      drynessNoise * 0.36 +
      (1 - moisture) * 0.42 +
      elevation * 0.12 +
      province.dryness -
      coast * 0.08,
      0,
      1
    );

    const heat = clamp(
      heatBase +
      province.warmth -
      elevation * 0.32 -
      polarPressure(latitude) * 0.44 +
      coast * 0.04,
      0,
      1
    );

    const fertility = clamp(
      province.fertility +
      moisture * 0.28 +
      greenBelt * 0.20 +
      coast * 0.08 -
      dryness * 0.16,
      0,
      1
    );

    const restoration = clamp(
      province.restoration +
      greenBelt * 0.28 +
      tech * 0.18 +
      moisture * 0.08,
      0,
      1
    );

    const mineral = clamp(
      mineralNoise * 0.42 +
      province.mountain * 0.22 +
      ridge * 0.18 +
      elevation * 0.22,
      0,
      1
    );

    return Object.freeze({
      heat,
      moisture,
      dryness,
      fertility,
      restoration,
      mineral,
      elevation,
      coast,
      ridge,
      basin,
      greenBelt,
      technology: tech,
      climateZone
    });
  }

  function colorForClimate(map, climateZone, metrics) {
    const palette = PALETTES[climateZone] || PALETTES.temperate_forest;
    const u = numeric(map.u, 0);
    const v = numeric(map.v, 0);
    const seed = climateSeed(map);
    const detail = fbm(u * 5.6 + 0.09, v * 4.8 - 0.15, 791000 + seed, 4);
    const grain = (detail - 0.5) * 12;

    let color = mixColor(palette.base, palette.mid, smoothstep(0.22, 0.78, detail));

    if (metrics.moisture > 0.62) color = mixColor(color, palette.high, (metrics.moisture - 0.62) * 0.35);
    if (metrics.dryness > 0.58) color = mixColor(color, palette.shadow, (metrics.dryness - 0.58) * 0.28);
    if (metrics.elevation > 0.58) color = mixColor(color, palette.shadow, (metrics.elevation - 0.58) * 0.18);
    if (metrics.restoration > 0.62 && !climateZone.includes("beach") && climateZone !== "deep_ocean" && climateZone !== "coastal_shelf") {
      color = mixColor(color, PALETTES.restoration_green_belt.mid, (metrics.restoration - 0.62) * 0.20);
    }

    return shade(color, grain);
  }

  function sampleClimate(mapInput) {
    const map = mapInput || {};
    const climateZone = classifyClimate(map);
    const metrics = climateMetrics(map, climateZone);
    const environmentClass = deriveEnvironment(map, climateZone);
    const palette = PALETTES[climateZone] || PALETTES.temperate_forest;
    const color = colorForClimate(map, climateZone, metrics);
    const province = summitProfile(map.summitProvince || map.primarySummit);

    return Object.freeze({
      allowed: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      climateZone,
      environmentClass,
      material: palette.material,
      color,
      baseColor: palette.base,
      midColor: palette.mid,
      highColor: palette.high,
      shadowColor: palette.shadow,
      metrics,
      summitProvince: String(map.summitProvince || map.primarySummit || "Balance"),
      summitClimateRole: province.role,
      nineSummitsClimateBinding: true,
      lattice256ClimateInfluence: true,
      earthLegacyClimate: true,
      thirtyBillionYearFutureClimate: true,
      highTechnologyHiddenInsideNature: true,
      stewardshipInfluence: metrics.restoration,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false
    });
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-climate-environment-authority",
      ownsClimate: true,
      ownsFootprint: false,
      canvasOwnsClimate: false,
      climateZones: CLIMATE_ZONES,
      primaryTarget: "/assets/audralia/audralia.climate.render.js",
      secondaryTarget: "/assets/audralia/audralia.groundcover.js",
      tertiaryTarget: "/assets/audralia/audralia.land.surface.js",
      dependsOn: [
        "/assets/audralia/audralia.landmap.js",
        "/assets/audralia/audralia.lattice256.js"
      ],
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.AUDRALIA_CLIMATE_RENDER = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    climateZones: CLIMATE_ZONES,
    sampleClimate,
    sample: sampleClimate,
    classifyClimate,
    deriveEnvironment,
    climateMetrics,
    colorForClimate,
    getStatus
  });

  window.AUDRALIA_CLIMATE = window.AUDRALIA_CLIMATE_RENDER;
  window.AUDRALIA_CLIMATE_RECEIPT = getStatus();

  document.documentElement.dataset.audraliaClimateLoaded = "true";
  document.documentElement.dataset.audraliaClimateContract = CONTRACT;
  document.documentElement.dataset.audraliaClimateReceipt = RECEIPT;
  document.documentElement.dataset.audraliaClimateOwnsClimate = "true";
  document.documentElement.dataset.audraliaClimateOwnsFootprint = "false";
  document.documentElement.dataset.audraliaCanvasOwnsClimate = "false";
  document.documentElement.dataset.audraliaClimateZones = CLIMATE_ZONES.join(",");
  document.documentElement.dataset.audraliaClimateEnvironmentDetail = "true";
  document.documentElement.dataset.audraliaNineSummitsClimateBinding = "true";
  document.documentElement.dataset.audraliaLattice256ClimateInfluence = "true";
  document.documentElement.dataset.audraliaEarthLegacyClimate = "true";
  document.documentElement.dataset.audraliaThirtyBillionYearFutureClimate = "true";
  document.documentElement.dataset.audraliaHighTechnologyHiddenInsideNature = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();

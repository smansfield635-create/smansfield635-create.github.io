// /assets/audralia/audralia.climate.render.js
// AUDRALIA_CLIMATE_AND_ENVIRONMENT_DETAIL_TNT_v2
// Full-file replacement.
// Minimal hard-stable climate authority.
// Exposes window.AUDRALIA_CLIMATE_RENDER.sampleClimate.
// Does not own footprint.
// Does not own canvas.
// Does not touch runtime.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_CLIMATE_AND_ENVIRONMENT_DETAIL_TNT_v2";
  const RECEIPT = "AUDRALIA_CLIMATE_AND_ENVIRONMENT_DETAIL_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "AUDRALIA_CLIMATE_AND_ENVIRONMENT_DETAIL_TNT_v1";
  const VERSION = "2026-05-15.audralia-climate-render-v2";

  const ZONES = Object.freeze({
    DEEP_OCEAN: "deep_ocean",
    SHELF: "coastal_shelf",
    BEACH_WHITE: "white_sand_beach",
    BEACH_OPAL: "opal_beach",
    BEACH_BLACK: "black_diamond_beach",
    RAINFOREST: "rainforest",
    WETLAND: "wetland",
    COASTAL_GREEN: "coastal_green_belt",
    SAVANNA: "savanna",
    DRY_BASIN: "dry_basin",
    TEMPERATE_FOREST: "temperate_forest",
    TEMPERATE_GRASSLAND: "temperate_grassland",
    HIGHLAND_FOREST: "highland_forest",
    ALPINE: "alpine_stone",
    SNOW: "snow_mountain",
    POLAR: "polar_ice",
    RESTORATION: "restoration_green_belt",
    PROTECTED_VALLEY: "protected_valley",
    MINERAL_DESERT: "mineral_desert"
  });

  const PALETTE = Object.freeze({
    deep_ocean: [3, 18, 44],
    coastal_shelf: [28, 124, 148],
    white_sand_beach: [218, 207, 164],
    opal_beach: [196, 190, 154],
    black_diamond_beach: [68, 70, 74],
    rainforest: [35, 105, 56],
    wetland: [48, 112, 82],
    coastal_green_belt: [72, 146, 83],
    savanna: [150, 156, 78],
    dry_basin: [154, 118, 72],
    temperate_forest: [68, 128, 72],
    temperate_grassland: [116, 146, 76],
    highland_forest: [74, 112, 78],
    alpine_stone: [118, 116, 102],
    snow_mountain: [210, 224, 218],
    polar_ice: [190, 224, 230],
    restoration_green_belt: [62, 148, 86],
    protected_valley: [92, 154, 82],
    mineral_desert: [178, 132, 82]
  });

  const SUMMIT_BIAS = Object.freeze({
    Gratitude: { wet: 0.22, green: 0.28, dry: -0.08, high: -0.04 },
    Balance: { wet: 0.08, green: 0.14, dry: 0.00, high: 0.02 },
    Stability: { wet: -0.08, green: 0.02, dry: 0.18, high: 0.14 },
    Peace: { wet: 0.30, green: 0.18, dry: -0.16, high: -0.06 },
    Joy: { wet: 0.12, green: 0.18, dry: -0.04, high: -0.04 },
    Dignity: { wet: -0.06, green: -0.02, dry: 0.12, high: 0.36 },
    "Free Will": { wet: 0.04, green: 0.04, dry: 0.06, high: 0.08 },
    Love: { wet: 0.18, green: 0.30, dry: -0.10, high: 0.00 },
    Stewardship: { wet: 0.16, green: 0.36, dry: -0.08, high: 0.04 }
  });

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function num(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
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
    const s = Math.max(2, Math.floor(scale));
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

  function fbm(u, v, seed) {
    let total = 0;
    let norm = 0;
    let amp = 0.58;
    let scale = 3.5;

    for (let i = 0; i < 5; i += 1) {
      total += noise(u, v, scale, seed + i * 131) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= 2;
    }

    return total / Math.max(0.000001, norm);
  }

  function shade(color, amount) {
    return [
      clamp(Math.round(color[0] + amount), 0, 255),
      clamp(Math.round(color[1] + amount), 0, 255),
      clamp(Math.round(color[2] + amount), 0, 255)
    ];
  }

  function mix(a, b, t) {
    const k = clamp(t, 0, 1);
    return [
      Math.round(a[0] + (b[0] - a[0]) * k),
      Math.round(a[1] + (b[1] - a[1]) * k),
      Math.round(a[2] + (b[2] - a[2]) * k)
    ];
  }

  function summitBias(map) {
    return SUMMIT_BIAS[String(map.summitProvince || map.primarySummit || "Balance")] || SUMMIT_BIAS.Balance;
  }

  function latitudeHeat(latitude) {
    return clamp(1 - Math.abs(num(latitude, 0)) / 90, 0, 1);
  }

  function elevationPressure(map) {
    const terrain = String(map.terrainClass || "");
    const elevationScore = num(map.elevationScore, 0);

    if (terrain === "mountain") return Math.max(0.82, elevationScore);
    if (terrain === "highland") return Math.max(0.64, elevationScore);
    if (terrain === "plateau") return Math.max(0.52, elevationScore);
    if (terrain === "polar-ice") return 0.95;

    return clamp(elevationScore, 0, 1);
  }

  function coastPressure(map) {
    return clamp(
      Math.max(
        num(map.beachEdge, 0),
        num(map.coastline, 0),
        num(map.shelf, 0) * 0.72
      ),
      0,
      1
    );
  }

  function classifyClimate(mapInput) {
    const map = mapInput || {};
    const terrain = String(map.terrainClass || "ocean");
    const topology = String(map.topology || "");
    const u = num(map.u, 0);
    const v = num(map.v, 0);
    const latitude = num(map.latitude, 0);
    const bias = summitBias(map);

    if (map.isOcean || terrain === "ocean") return ZONES.DEEP_OCEAN;
    if (map.isShelf || terrain === "shelf") return ZONES.SHELF;
    if (map.isPolarIce || terrain === "polar-ice") return ZONES.POLAR;

    const heat = latitudeHeat(latitude);
    const polar = clamp((Math.abs(latitude) - 54) / 34, 0, 1);
    const elevation = elevationPressure(map);
    const coast = coastPressure(map);
    const ridge = clamp(num(map.nodalRidge, 0.4), 0, 1);
    const basin = clamp(num(map.nodalBasin, 0.4), 0, 1);
    const green = clamp(num(map.nodalGreenBelt, 0.4), 0, 1);
    const tech = clamp(num(map.nodalTechnology, 0.4), 0, 1);

    const wetNoise = fbm(u * 1.2 + 0.14, v * 1.1 - 0.09, 810001);
    const dryNoise = fbm(u * 1.7 - 0.21, v * 1.5 + 0.17, 810777);
    const beachNoise = fbm(u * 2.2 + 0.34, v * 2.0 - 0.19, 811333);

    const wet = clamp(
      wetNoise * 0.48 +
      coast * 0.28 +
      basin * 0.18 +
      bias.wet -
      ridge * elevation * 0.20 -
      polar * 0.18,
      0,
      1
    );

    const dry = clamp(
      dryNoise * 0.42 +
      (1 - wet) * 0.34 +
      bias.dry +
      elevation * 0.08 -
      coast * 0.08,
      0,
      1
    );

    const restoration = clamp(bias.green + green * 0.34 + tech * 0.18 + wet * 0.06, 0, 1);

    if (map.isBeach || terrain === "beach") {
      if (bias.high > 0.20 && beachNoise > 0.50) return ZONES.BEACH_BLACK;
      if (beachNoise > 0.62) return ZONES.BEACH_OPAL;
      return ZONES.BEACH_WHITE;
    }

    if (terrain === "mountain" || elevation + bias.high > 0.82) {
      if (heat < 0.44 || polar > 0.28) return ZONES.SNOW;
      return ZONES.ALPINE;
    }

    if (terrain === "highland" || elevation + bias.high > 0.64) {
      if (wet > 0.50 && heat > 0.36) return ZONES.HIGHLAND_FOREST;
      return ZONES.ALPINE;
    }

    if (topology.includes("wetland") || terrain === "wetland" || wet > 0.78) {
      return ZONES.WETLAND;
    }

    if (restoration > 0.64 && wet > 0.42 && dry < 0.66) return ZONES.RESTORATION;
    if (topology.includes("valley")) return ZONES.PROTECTED_VALLEY;

    if (Math.abs(latitude) < 18) {
      if (wet > 0.62) return ZONES.RAINFOREST;
      if (dry > 0.62) return ZONES.SAVANNA;
      return ZONES.COASTAL_GREEN;
    }

    if (Math.abs(latitude) < 34) {
      if (dry > 0.72) return ZONES.MINERAL_DESERT;
      if (dry > 0.56) return ZONES.SAVANNA;
      if (wet > 0.54) return ZONES.TEMPERATE_FOREST;
      return ZONES.TEMPERATE_GRASSLAND;
    }

    if (Math.abs(latitude) < 56) {
      if (dry > 0.66) return ZONES.DRY_BASIN;
      if (wet > 0.48) return ZONES.TEMPERATE_FOREST;
      return ZONES.TEMPERATE_GRASSLAND;
    }

    if (polar > 0.52) return ZONES.POLAR;
    if (wet > 0.45) return ZONES.HIGHLAND_FOREST;
    return ZONES.ALPINE;
  }

  function environmentFor(zone) {
    if (zone === ZONES.DEEP_OCEAN) return "ocean";
    if (zone === ZONES.SHELF) return "shelf";
    if (zone === ZONES.BEACH_WHITE || zone === ZONES.BEACH_OPAL || zone === ZONES.BEACH_BLACK) return "beach";
    if (zone === ZONES.RAINFOREST) return "rainforest";
    if (zone === ZONES.WETLAND) return "wetland";
    if (zone === ZONES.SAVANNA) return "savanna";
    if (zone === ZONES.DRY_BASIN) return "dry_basin";
    if (zone === ZONES.MINERAL_DESERT) return "mineral_desert";
    if (zone === ZONES.ALPINE) return "alpine";
    if (zone === ZONES.SNOW) return "snow_mountain";
    if (zone === ZONES.POLAR) return "polar";
    if (zone === ZONES.RESTORATION) return "restoration_belt";
    if (zone === ZONES.PROTECTED_VALLEY) return "protected_valley";
    return "green_land";
  }

  function sampleClimate(mapInput) {
    const map = mapInput || {};
    const zone = classifyClimate(map);
    const base = PALETTE[zone] || PALETTE.temperate_forest;

    const u = num(map.u, 0);
    const v = num(map.v, 0);
    const detail = fbm(u * 5.4 + 0.12, v * 4.7 - 0.16, 812111);
    const grain = (detail - 0.5) * 14;
    const summit = String(map.summitProvince || map.primarySummit || "Balance");

    let color = shade(base, grain);

    if (zone !== ZONES.DEEP_OCEAN && zone !== ZONES.SHELF) {
      const restoration = clamp(num(map.nodalGreenBelt, 0.3) * 0.20 + summitBias(map).green * 0.18, 0, 0.18);
      color = mix(color, PALETTE.restoration_green_belt, restoration);
    }

    return Object.freeze({
      allowed: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      climateZone: zone,
      environmentClass: environmentFor(zone),
      material: zone,
      color,
      baseColor: base,
      summitProvince: summit,
      nineSummitsClimateBinding: true,
      lattice256ClimateInfluence: true,
      climateAuthority: true,
      ownsFootprint: false,
      ownsCanvas: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-climate-render",
      exposesSampleClimate: true,
      sampleClimateType: typeof sampleClimate,
      climateZones: Object.values(ZONES),
      ownsFootprint: false,
      ownsCanvas: false,
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
    zones: ZONES,
    sampleClimate,
    sample: sampleClimate,
    classifyClimate,
    environmentFor,
    getStatus
  });

  window.AUDRALIA_CLIMATE = window.AUDRALIA_CLIMATE_RENDER;
  window.AUDRALIA_CLIMATE_RECEIPT = getStatus();

  document.documentElement.dataset.audraliaClimateLoaded = "true";
  document.documentElement.dataset.audraliaClimateContract = CONTRACT;
  document.documentElement.dataset.audraliaClimateReceipt = RECEIPT;
  document.documentElement.dataset.audraliaClimatePreviousContract = PREVIOUS_CONTRACT;
  document.documentElement.dataset.audraliaClimateExposesSampleClimate = "true";
  document.documentElement.dataset.audraliaClimateOwnsFootprint = "false";
  document.documentElement.dataset.audraliaClimateOwnsCanvas = "false";
  document.documentElement.dataset.audraliaNineSummitsClimateBinding = "true";
  document.documentElement.dataset.audraliaLattice256ClimateInfluence = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();

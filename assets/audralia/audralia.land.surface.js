// /assets/audralia/audralia.land.surface.js
// AUDRALIA_HYDROLOGY_AWARE_VISIBLE_RELIEF_SURFACE_TNT_v4
// Full-file replacement.
// Land Surface authority only.
// Purpose:
// - Consumes audralia.elevation.js aggressively.
// - Consumes audralia.hydrology.js v2 visibly without owning hydrology.
// - Turns elevation, ridge, mountain, cliff, valley, basin, plateau, coastalRise, snowline, slope, relief,
//   shadowPressure, rivers, wetlands, inland water, deltas, estuaries, bays, inlets, lagoons,
//   archipelago shelf guidance, and land-cut pressure into visible terrain depth.
// - Preserves existing biome/climate color scheme while adding water-shaped surface realism.
// - Does not own footprint.
// - Does not create land.
// - Does not erase beaches.
// - Does not own hydrology.
// - Does not own climate.
// - Does not own elevation.
// - Does not render canvas.
// - Does not touch runtime.
// - Does not touch Gauges.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_HYDROLOGY_AWARE_VISIBLE_RELIEF_SURFACE_TNT_v4";
  const RECEIPT = "AUDRALIA_HYDROLOGY_AWARE_VISIBLE_RELIEF_SURFACE_RECEIPT_v4";
  const PREVIOUS_CONTRACT = "AUDRALIA_ELEVATION_CONSUMPTION_VISIBLE_RELIEF_SURFACE_TNT_v3";
  const EXPECTED_HYDROLOGY_CONTRACT = "AUDRALIA_HYDROLOGY_CORRIDOR_AND_INLAND_WATER_RENEWAL_TNT_v2";
  const VERSION = "2026-05-19.audralia-hydrology-aware-visible-relief-surface-v4";

  const PHI = 1.618033988749895;
  const INV_PHI = 1 / PHI;

  const COLORS = Object.freeze({
    fallbackLand: [92, 132, 76],
    rainforestDeep: [28, 78, 46],
    rainforestCanopy: [54, 128, 65],
    wetland: [58, 112, 84],
    marsh: [96, 142, 90],
    riverGreen: [44, 124, 112],
    riverBlue: [32, 112, 146],
    inlandBlue: [26, 92, 136],
    inlandDeep: [18, 56, 104],
    lagoon: [88, 174, 164],
    estuary: [64, 148, 134],
    deltaGreen: [72, 142, 98],
    shelfBlue: [72, 164, 164],
    bayBlue: [38, 108, 142],
    savanna: [145, 154, 78],
    dryGrass: [174, 151, 78],
    desert: [190, 139, 76],
    dryBasin: [136, 104, 76],
    scrub: [108, 130, 76],
    temperateForest: [64, 112, 68],
    highland: [95, 123, 82],
    mountain: [111, 110, 94],
    ridge: [142, 136, 108],
    cliffDark: [52, 57, 54],
    valleyDark: [55, 75, 60],
    basinDark: [98, 85, 65],
    plateauLight: [158, 151, 112],
    alpine: [156, 168, 144],
    snow: [222, 232, 224],
    coastalGreen: [86, 138, 82],
    coastalGold: [176, 158, 100],
    beachRise: [184, 170, 112],
    summitGold: [184, 151, 78],
    summitViolet: [106, 100, 150],
    summitBlue: [76, 126, 155],
    shadow: [28, 41, 40],
    stone: [104, 106, 94],
    light: [221, 216, 174]
  });

  const SUMMIT_TONES = Object.freeze({
    gratitude: [88, 139, 82],
    generosity: [112, 151, 83],
    dependability: [95, 125, 96],
    accountability: [128, 125, 91],
    forgiveness: [89, 142, 115],
    humility: [103, 116, 101],
    "self-control": [102, 125, 142],
    patience: [140, 132, 91],
    purity: [170, 184, 160],
    stability: [93, 122, 91],
    balance: [116, 136, 96],
    dignity: [138, 128, 92],
    peace: [91, 137, 124],
    joy: [138, 154, 88],
    love: [84, 138, 96],
    stewardship: [78, 146, 108],
    "free-will": [98, 132, 140]
  });

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function normalize01(value, fallback = 0.5) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    if (number >= 0 && number <= 1) return number;
    if (number >= -1 && number <= 1) return (number + 1) * 0.5;
    if (number >= 0 && number <= 100) return number / 100;
    return clamp(number, 0, 1);
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function smoothstep(edge0, edge1, value) {
    const t = clamp((value - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function sharpen(value, strength = 1.35) {
    const x = clamp(value, 0, 1);
    return clamp((x - 0.5) * strength + 0.5, 0, 1);
  }

  function mix(a, b, t) {
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

  function text(value) {
    return String(value || "").trim().toLowerCase();
  }

  function includesAny(value, terms) {
    const source = text(value);
    return terms.some((term) => source.includes(term));
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

  function fbm(u, v, seed, octaves = 5) {
    let total = 0;
    let norm = 0;
    let amp = 0.58;
    let scale = 3.5;

    for (let i = 0; i < octaves; i += 1) {
      total += noise(u, v, scale, seed + i * 131) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= PHI;
    }

    return total / Math.max(0.000001, norm);
  }

  function ridgeNoise(u, v, seed, octaves = 4) {
    let total = 0;
    let norm = 0;
    let amp = 0.58;
    let scale = 4.0;

    for (let i = 0; i < octaves; i += 1) {
      const n = noise(u, v, scale, seed + i * 197);
      const ridge = 1 - Math.abs(n * 2 - 1);
      total += ridge * amp;
      norm += amp;
      amp *= 0.5;
      scale *= PHI;
    }

    return total / Math.max(0.000001, norm);
  }

  function isOceanLike(map) {
    return Boolean(
      map?.isOcean ||
      map?.terrainClass === "ocean" ||
      map?.terrainClass === "shelf" ||
      map?.isShelf ||
      includesAny(map?.topology, ["ocean", "shelf", "sea"])
    );
  }

  function isBeachLike(map) {
    return Boolean(
      map?.isBeach ||
      map?.terrainClass === "beach" ||
      includesAny(map?.topology, ["beach", "shore", "coastline"])
    );
  }

  function isLandAllowed(map) {
    if (!map || typeof map !== "object") return false;
    if (isOceanLike(map)) return false;
    if (isBeachLike(map)) return false;
    return Boolean(map.isLand || map.terrainClass || map.topology || map.elevation);
  }

  function readClimate(map) {
    try {
      if (window.AUDRALIA_CLIMATE_RENDER?.sampleClimate) {
        const climate = window.AUDRALIA_CLIMATE_RENDER.sampleClimate(map);
        if (climate && typeof climate === "object") return climate;
      }

      if (window.AUDRALIA_CLIMATE_RENDER?.sample) {
        const climate = window.AUDRALIA_CLIMATE_RENDER.sample(map);
        if (climate && typeof climate === "object") return climate;
      }
    } catch {
      document.documentElement.dataset.audraliaLandSurfaceClimateReadFailed = "true";
    }

    return null;
  }

  function readElevation(map) {
    try {
      if (window.AUDRALIA_ELEVATION?.sampleElevation) {
        const elevation = window.AUDRALIA_ELEVATION.sampleElevation(map);
        if (elevation && typeof elevation === "object") return elevation;
      }

      if (window.AUDRALIA_ELEVATION?.sample) {
        const elevation = window.AUDRALIA_ELEVATION.sample(map);
        if (elevation && typeof elevation === "object") return elevation;
      }
    } catch {
      document.documentElement.dataset.audraliaLandSurfaceElevationReadFailed = "true";
    }

    return fallbackElevation(map);
  }

  function readTopology(map) {
    try {
      const u = wrap01(Number(map?.u || 0));
      const v = clamp(Number(map?.v || 0), 0, 1);

      if (window.AUDRALIA_TOPOLOGY?.sampleTopology) {
        const topology = window.AUDRALIA_TOPOLOGY.sampleTopology(u, v, map);
        if (topology && typeof topology === "object") return topology;
      }

      if (window.AUDRALIA_TOPOLOGY?.sample) {
        const topology = window.AUDRALIA_TOPOLOGY.sample(u, v, map);
        if (topology && typeof topology === "object") return topology;
      }
    } catch {
      document.documentElement.dataset.audraliaLandSurfaceTopologyReadFailed = "true";
    }

    return null;
  }

  function readHydrology(map) {
    try {
      if (window.AUDRALIA_HYDROLOGY?.sampleHydrology) {
        const hydro = window.AUDRALIA_HYDROLOGY.sampleHydrology(map);
        if (hydro && typeof hydro === "object") return hydro;
      }

      if (window.AUDRALIA_HYDROLOGY?.sample) {
        const hydro = window.AUDRALIA_HYDROLOGY.sample(map);
        if (hydro && typeof hydro === "object") return hydro;
      }
    } catch {
      document.documentElement.dataset.audraliaLandSurfaceHydrologyReadFailed = "true";
    }

    return null;
  }

  function readGroundcover(map) {
    try {
      if (window.AUDRALIA_GROUNDCOVER?.sampleGroundcover) {
        const cover = window.AUDRALIA_GROUNDCOVER.sampleGroundcover(map);
        if (cover && typeof cover === "object") return cover;
      }

      if (window.AUDRALIA_GROUNDCOVER?.sample) {
        const cover = window.AUDRALIA_GROUNDCOVER.sample(map);
        if (cover && typeof cover === "object") return cover;
      }
    } catch {
      document.documentElement.dataset.audraliaLandSurfaceGroundcoverReadFailed = "true";
    }

    return null;
  }

  function fallbackElevation(map) {
    const u = Number(map?.u || 0);
    const v = Number(map?.v || 0);
    const terrain = [map?.terrainClass, map?.topology, map?.elevation].map(text).join(" ");
    const base = fbm(u * PHI + 0.17, v * INV_PHI - 0.11, 900100, 5);
    const ridge = ridgeNoise(u * 2.2 - 0.18, v * 1.8 + 0.21, 900900, 4);
    const basin = 1 - ridgeNoise(u * 1.5 + 0.33, v * 1.3 - 0.19, 901700, 4);

    let elevation01 = base * 0.36 + ridge * 0.30 - basin * 0.10 + 0.18;

    if (includesAny(terrain, ["mountain", "ridge", "highland", "plateau"])) elevation01 += 0.18;
    if (includesAny(terrain, ["basin", "valley", "plain"])) elevation01 -= 0.12;
    if (includesAny(terrain, ["coast", "shore", "landrise"])) elevation01 += 0.08;

    elevation01 = clamp(elevation01, 0, 1);

    return Object.freeze({
      allowed: true,
      contract: "fallback-elevation-from-land-surface",
      elevation01,
      height: elevation01,
      altitude: elevation01,
      relief: clamp(ridge * 0.52 + elevation01 * 0.26, 0, 1),
      slope: clamp(ridge * 0.46, 0, 1),
      basin: clamp(basin, 0, 1),
      ridge: clamp(ridge, 0, 1),
      mountain: clamp(smoothstep(0.56, 0.84, elevation01) * 0.5 + ridge * 0.4, 0, 1),
      cliff: clamp(ridgeNoise(u * 8.4, v * 6.8, 902500, 3) * ridge, 0, 1),
      plateau: clamp(smoothstep(0.42, 0.68, elevation01) * (1 - ridge * 0.36), 0, 1),
      valley: clamp(basin * ridgeNoise(u * 5.2, v * 4.6, 903300, 3), 0, 1),
      coastalRise: includesAny(terrain, ["coast", "shore", "landrise"]) ? 0.6 : 0.18,
      snowline: 0,
      shadowPressure: clamp(ridge * 0.28 + elevation01 * 0.20, 0, 1),
      class: elevation01 > 0.68 ? "mountain" : elevation01 > 0.50 ? "highland" : basin > 0.68 ? "basin" : "plain",
      zone: elevation01 > 0.58 ? "raised-terrain" : "lowland",
      form: "fallback-computable-relief"
    });
  }

  function getClimateSignals(map, climate) {
    const latitude = Number(map.latitude || 0);
    const absLat = Math.abs(latitude);
    const u = Number(map.u || 0);
    const v = Number(map.v || 0);

    const equatorWarmth = 1 - smoothstep(4, 78, absLat);
    const polarCold = smoothstep(50, 82, absLat);
    const wetNoise = fbm(u * PHI - 0.25, v * INV_PHI + 0.19, 540900, 5);
    const dryNoise = fbm(u * 2.618 + 0.33, v * PHI - 0.21, 541700, 4);

    const climateText = [
      climate?.biome,
      climate?.climate,
      climate?.class,
      climate?.zone,
      climate?.material,
      map.band,
      map.terrainClass,
      map.topology,
      map.elevation
    ].map(text).join(" ");

    let moisture = climate
      ? normalize01(climate.moisture ?? climate.humidity ?? climate.wetness ?? climate.rainfall ?? climate.precipitation, 0.48)
      : 0.42 + wetNoise * 0.36 + equatorWarmth * 0.16;

    let heat = climate
      ? normalize01(climate.heat ?? climate.temperature ?? climate.warmth, 0.55)
      : 0.28 + equatorWarmth * 0.55 - polarCold * 0.22 + wetNoise * 0.10;

    let aridity = climate
      ? normalize01(climate.aridity ?? climate.dryness, 1 - moisture)
      : clamp(0.20 + dryNoise * 0.48 + smoothstep(18, 42, absLat) * 0.16 - moisture * 0.30, 0, 1);

    if (includesAny(climateText, ["rainforest", "jungle", "humid", "monsoon"])) {
      moisture = Math.max(moisture, 0.82);
      heat = Math.max(heat, 0.66);
      aridity = Math.min(aridity, 0.18);
    }

    if (includesAny(climateText, ["wetland", "marsh", "swamp", "delta", "fen"])) {
      moisture = Math.max(moisture, 0.76);
      aridity = Math.min(aridity, 0.24);
    }

    if (includesAny(climateText, ["desert", "arid", "dry", "basin"])) {
      moisture = Math.min(moisture, 0.28);
      aridity = Math.max(aridity, 0.76);
    }

    if (includesAny(climateText, ["savanna", "grass", "steppe", "prairie"])) {
      moisture = clamp(moisture, 0.32, 0.60);
      aridity = clamp(aridity, 0.38, 0.72);
    }

    if (includesAny(climateText, ["alpine", "snow", "ice", "polar", "tundra"])) {
      heat = Math.min(heat, 0.28);
      moisture = Math.max(moisture, 0.46);
    }

    return Object.freeze({
      moisture: sharpen(clamp(moisture, 0, 1), 1.18),
      heat: clamp(heat, 0, 1),
      aridity: sharpen(clamp(aridity, 0, 1), 1.22),
      polarCold,
      equatorWarmth,
      climateText
    });
  }

  function getElevationSignals(map, elevation) {
    const terrainText = [
      map.terrainClass,
      map.topology,
      map.elevation,
      elevation?.class,
      elevation?.zone,
      elevation?.form
    ].map(text).join(" ");

    let elevation01 = normalize01(elevation?.elevation01 ?? elevation?.height ?? elevation?.altitude, 0.45);
    let relief = normalize01(elevation?.relief, 0.42);
    let slope = normalize01(elevation?.slope, 0.36);
    let basin = normalize01(elevation?.basin, 0.22);
    let ridge = normalize01(elevation?.ridge, 0.34);
    let mountain = normalize01(elevation?.mountain, 0.18);
    let cliff = normalize01(elevation?.cliff, 0.12);
    let plateau = normalize01(elevation?.plateau, 0.20);
    let valley = normalize01(elevation?.valley, 0.18);
    let coastalRise = normalize01(elevation?.coastalRise, 0.18);
    let snowline = normalize01(elevation?.snowline, 0.06);
    let shadowPressure = normalize01(elevation?.shadowPressure, 0.22);

    if (includesAny(terrainText, ["mountain", "ridge", "peak", "range", "alpine"])) {
      elevation01 = Math.max(elevation01, 0.66);
      relief = Math.max(relief, 0.66);
      ridge = Math.max(ridge, 0.62);
      mountain = Math.max(mountain, 0.66);
      slope = Math.max(slope, 0.58);
    }

    if (includesAny(terrainText, ["cliff", "scarp", "escarpment"])) {
      cliff = Math.max(cliff, 0.72);
      slope = Math.max(slope, 0.68);
      shadowPressure = Math.max(shadowPressure, 0.64);
    }

    if (includesAny(terrainText, ["plateau", "tableland"])) {
      plateau = Math.max(plateau, 0.68);
      elevation01 = Math.max(elevation01, 0.50);
      relief = Math.max(relief, 0.42);
    }

    if (includesAny(terrainText, ["basin", "lowland, depression", "depression"])) {
      basin = Math.max(basin, 0.70);
      elevation01 = Math.min(elevation01, 0.42);
      shadowPressure = Math.max(shadowPressure, 0.36);
    }

    if (includesAny(terrainText, ["valley", "channel", "drainage"])) {
      valley = Math.max(valley, 0.66);
      basin = Math.max(basin, 0.50);
      shadowPressure = Math.max(shadowPressure, 0.44);
    }

    if (includesAny(terrainText, ["coast", "shore", "landrise", "archipelago", "island"])) {
      coastalRise = Math.max(coastalRise, 0.54);
      slope = Math.max(slope, 0.34);
    }

    return Object.freeze({
      elevation01: sharpen(clamp(elevation01, 0, 1), 1.08),
      relief: sharpen(clamp(relief, 0, 1), 1.22),
      slope: sharpen(clamp(slope, 0, 1), 1.22),
      basin: sharpen(clamp(basin, 0, 1), 1.18),
      ridge: sharpen(clamp(ridge, 0, 1), 1.20),
      mountain: sharpen(clamp(mountain, 0, 1), 1.24),
      cliff: sharpen(clamp(cliff, 0, 1), 1.28),
      plateau: sharpen(clamp(plateau, 0, 1), 1.16),
      valley: sharpen(clamp(valley, 0, 1), 1.20),
      coastalRise: sharpen(clamp(coastalRise, 0, 1), 1.18),
      snowline: sharpen(clamp(snowline, 0, 1), 1.14),
      shadowPressure: sharpen(clamp(shadowPressure, 0, 1), 1.24),
      terrainText,
      className: text(elevation?.class || ""),
      zone: text(elevation?.zone || ""),
      form: text(elevation?.form || "")
    });
  }

  function getHydrologySignals(hydrology) {
    if (!hydrology || typeof hydrology !== "object") {
      return Object.freeze({
        available: false,
        className: "none",
        waterColorHint: "none",
        shouldPaintWater: false,
        shouldShapeLand: false,
        shouldInterruptSolidLandmass: false,
        river: 0,
        lake: 0,
        inlandSea: 0,
        wetland: 0,
        marshBasin: 0,
        delta: 0,
        estuary: 0,
        bay: 0,
        inlet: 0,
        lagoon: 0,
        peninsula: 0,
        drainage: 0,
        watershed: 0,
        dryChannel: 0,
        landCutPressure: 0,
        surfaceWaterPressure: 0,
        oceanCorridor: 0,
        coastalCut: 0,
        coastalShelfWater: 0,
        archipelagoShelfWater: false
      });
    }

    const guidance = hydrology.visualGuidance || {};

    return Object.freeze({
      available: true,
      contract: text(hydrology.contract),
      className: text(hydrology.class),
      zone: text(hydrology.zone),
      form: text(hydrology.form),
      waterColorHint: text(hydrology.waterColorHint),
      shouldPaintWater: Boolean(guidance.shouldPaintWater || hydrology.isInlandWater || hydrology.isSurfaceWater),
      shouldShapeLand: Boolean(guidance.shouldShapeLand || hydrology.isLandformShaping),
      shouldInterruptSolidLandmass: Boolean(guidance.shouldInterruptSolidLandmass),
      shouldSupportWetlandColor: Boolean(guidance.shouldSupportWetlandColor),
      shouldSupportRiverCorridor: Boolean(guidance.shouldSupportRiverCorridor),
      shouldSupportDryChannel: Boolean(guidance.shouldSupportDryChannel),
      shouldSupportArchipelagoWater: Boolean(guidance.shouldSupportArchipelagoWater),
      shouldSupportOceanCorridor: Boolean(guidance.shouldSupportOceanCorridor),
      shouldSupportBayInletBreaks: Boolean(guidance.shouldSupportBayInletBreaks),
      shouldSupportInlandWater: Boolean(guidance.shouldSupportInlandWater),
      river: normalize01(hydrology.river, 0),
      lake: normalize01(hydrology.lake, 0),
      inlandSea: normalize01(hydrology.inlandSea, 0),
      wetland: normalize01(hydrology.wetland, 0),
      marshBasin: normalize01(hydrology.marshBasin, 0),
      delta: normalize01(hydrology.delta, 0),
      estuary: normalize01(hydrology.estuary, 0),
      bay: normalize01(hydrology.bay, 0),
      inlet: normalize01(hydrology.inlet, 0),
      lagoon: normalize01(hydrology.lagoon, 0),
      peninsula: normalize01(hydrology.peninsula, 0),
      drainage: normalize01(hydrology.drainage, 0),
      watershed: normalize01(hydrology.watershed, 0),
      dryChannel: normalize01(hydrology.dryChannel, 0),
      landCutPressure: normalize01(hydrology.landCutPressure, 0),
      surfaceWaterPressure: normalize01(hydrology.surfaceWaterPressure, 0),
      oceanCorridor: normalize01(hydrology.oceanCorridor, 0),
      coastalCut: normalize01(hydrology.coastalCut, 0),
      coastalShelfWater: normalize01(hydrology.coastalShelfWater, 0),
      archipelagoShelfWater: Boolean(guidance.shouldSupportArchipelagoWater)
    });
  }

  function getGroundcoverSignals(map, groundcover) {
    const coverText = [
      groundcover?.cover,
      groundcover?.type,
      groundcover?.class,
      groundcover?.vegetation,
      groundcover?.canopy,
      map.groundcover,
      map.vegetation
    ].map(text).join(" ");

    let vegetation = normalize01(groundcover?.vegetation ?? groundcover?.density ?? groundcover?.coverDensity ?? map.vegetationDensity, 0.52);
    let canopy = normalize01(groundcover?.canopy ?? groundcover?.forestCanopy ?? map.canopy, 0.38);
    let scrub = normalize01(groundcover?.scrub ?? groundcover?.brush ?? groundcover?.bushes, 0.34);

    if (includesAny(coverText, ["rainforest", "forest", "canopy", "trees"])) {
      vegetation = Math.max(vegetation, 0.80);
      canopy = Math.max(canopy, 0.76);
    }

    if (includesAny(coverText, ["grass", "savanna", "steppe", "prairie"])) {
      vegetation = clamp(Math.max(vegetation, 0.50), 0, 0.72);
      canopy = Math.min(canopy, 0.32);
    }

    if (includesAny(coverText, ["scrub", "bush", "brush", "shrub"])) {
      scrub = Math.max(scrub, 0.66);
      vegetation = Math.max(vegetation, 0.42);
    }

    if (includesAny(coverText, ["desert", "bare", "rock"])) {
      vegetation = Math.min(vegetation, 0.24);
      canopy = Math.min(canopy, 0.15);
    }

    return Object.freeze({
      vegetation: clamp(vegetation, 0, 1),
      canopy: clamp(canopy, 0, 1),
      scrub: clamp(scrub, 0, 1),
      coverText
    });
  }

  function summitTone(map) {
    const key = text(map.internalSummit || map.primarySummit || map.summitProvince || "gratitude");
    const normalized = key.replace(/\s+/g, "-");

    if (SUMMIT_TONES[key]) return SUMMIT_TONES[key];
    if (SUMMIT_TONES[normalized]) return SUMMIT_TONES[normalized];

    if (key.includes("gratitude")) return SUMMIT_TONES.gratitude;
    if (key.includes("generosity")) return SUMMIT_TONES.generosity;
    if (key.includes("depend")) return SUMMIT_TONES.dependability;
    if (key.includes("account")) return SUMMIT_TONES.accountability;
    if (key.includes("forgive")) return SUMMIT_TONES.forgiveness;
    if (key.includes("humility")) return SUMMIT_TONES.humility;
    if (key.includes("control")) return SUMMIT_TONES["self-control"];
    if (key.includes("patience")) return SUMMIT_TONES.patience;
    if (key.includes("purity")) return SUMMIT_TONES.purity;
    if (key.includes("stability")) return SUMMIT_TONES.stability;
    if (key.includes("balance")) return SUMMIT_TONES.balance;
    if (key.includes("dignity")) return SUMMIT_TONES.dignity;
    if (key.includes("peace")) return SUMMIT_TONES.peace;
    if (key.includes("joy")) return SUMMIT_TONES.joy;
    if (key.includes("love")) return SUMMIT_TONES.love;
    if (key.includes("steward")) return SUMMIT_TONES.stewardship;
    if (key.includes("free")) return SUMMIT_TONES["free-will"];

    return SUMMIT_TONES.gratitude;
  }

  function classifyBiome(map, climateSignals, elevationSignals, hydrologySignals, groundSignals) {
    const climateText = climateSignals.climateText;
    const terrainText = elevationSignals.terrainText;
    const hydroClass = hydrologySignals.className;

    if (hydrologySignals.shouldPaintWater && (hydrologySignals.inlandSea > 0.64 || hydroClass.includes("inland-sea"))) return "inland-water";
    if (hydrologySignals.shouldPaintWater && (hydrologySignals.lake > 0.64 || hydroClass === "lake")) return "lake-water";
    if (hydrologySignals.shouldPaintWater && (hydrologySignals.river > 0.64 || hydroClass === "river")) return "river-corridor";
    if (hydrologySignals.delta > 0.58 || hydroClass === "delta") return "delta-wetland";
    if (hydrologySignals.estuary > 0.58 || hydroClass === "estuary") return "estuary-wetland";
    if (hydrologySignals.wetland > 0.60 || hydrologySignals.marshBasin > 0.60 || hydroClass.includes("wetland") || hydroClass.includes("marsh")) return "wetland";

    if (elevationSignals.snowline > 0.70 && elevationSignals.elevation01 > 0.58) return "snow-alpine";
    if (elevationSignals.mountain > 0.70 || elevationSignals.ridge > 0.74) return "alpine-highland";
    if (elevationSignals.cliff > 0.76) return "cliff-ridge";
    if (elevationSignals.plateau > 0.72) return "plateau";
    if (elevationSignals.basin > 0.72 || elevationSignals.valley > 0.72) return "basin-valley";

    if (includesAny(climateText + " " + terrainText, ["snow", "ice", "polar"])) return "snow-alpine";
    if (includesAny(climateText + " " + terrainText, ["alpine", "peak", "ridge", "mountain"])) return "alpine-highland";
    if (includesAny(climateText, ["rainforest", "jungle", "monsoon"])) return "rainforest";
    if (includesAny(climateText, ["wetland", "marsh", "swamp", "delta"])) return "wetland";
    if (includesAny(climateText, ["desert", "arid"])) return "dry-basin";
    if (includesAny(climateText, ["savanna", "grass", "steppe"])) return "savanna";
    if (includesAny(climateText, ["temperate", "forest"])) return "temperate-forest";

    if (climateSignals.moisture > 0.76 && climateSignals.heat > 0.56 && groundSignals.canopy > 0.56) return "rainforest";
    if (climateSignals.moisture > 0.70 && elevationSignals.basin > 0.42) return "wetland";
    if (climateSignals.aridity > 0.70 && climateSignals.moisture < 0.34) return "dry-basin";
    if (climateSignals.aridity > 0.48 && groundSignals.canopy < 0.38) return "savanna";
    if (climateSignals.moisture > 0.48 && groundSignals.vegetation > 0.54) return "temperate-forest";
    if (includesAny(map.topology, ["coast", "landrise", "shore", "archipelago", "island"])) return "coastal-rise";

    return "mixed-highland";
  }

  function baseBiomeColor(biome, climateSignals, elevationSignals, hydrologySignals) {
    switch (biome) {
      case "inland-water":
        return mix(COLORS.inlandDeep, COLORS.inlandBlue, hydrologySignals.inlandSea * 0.54 + hydrologySignals.lake * 0.22);

      case "lake-water":
        return mix(COLORS.inlandBlue, COLORS.lagoon, hydrologySignals.lake * 0.46);

      case "river-corridor":
        return mix(COLORS.riverBlue, COLORS.riverGreen, hydrologySignals.river * 0.42 + hydrologySignals.drainage * 0.20);

      case "delta-wetland":
        return mix(COLORS.deltaGreen, COLORS.estuary, hydrologySignals.delta * 0.42 + hydrologySignals.estuary * 0.22);

      case "estuary-wetland":
        return mix(COLORS.estuary, COLORS.lagoon, hydrologySignals.estuary * 0.46 + hydrologySignals.lagoon * 0.20);

      case "rainforest":
        return mix(COLORS.rainforestDeep, COLORS.rainforestCanopy, climateSignals.moisture * 0.78);

      case "wetland":
        return mix(COLORS.wetland, COLORS.marsh, climateSignals.moisture * 0.72 + hydrologySignals.wetland * 0.22);

      case "savanna":
        return mix(COLORS.savanna, COLORS.dryGrass, climateSignals.aridity * 0.75);

      case "dry-basin":
        return mix(COLORS.dryBasin, COLORS.desert, climateSignals.aridity * 0.88);

      case "temperate-forest":
        return mix(COLORS.temperateForest, COLORS.coastalGreen, climateSignals.moisture * 0.52);

      case "alpine-highland":
        return mix(COLORS.highland, COLORS.mountain, elevationSignals.mountain * 0.52 + elevationSignals.relief * 0.28);

      case "cliff-ridge":
        return mix(COLORS.mountain, COLORS.ridge, elevationSignals.cliff * 0.48 + elevationSignals.ridge * 0.22);

      case "plateau":
        return mix(COLORS.highland, COLORS.plateauLight, elevationSignals.plateau * 0.42);

      case "basin-valley":
        return mix(COLORS.dryBasin, COLORS.valleyDark, elevationSignals.valley * 0.28 + elevationSignals.basin * 0.24);

      case "snow-alpine":
        return mix(COLORS.alpine, COLORS.snow, elevationSignals.snowline * 0.64 + climateSignals.polarCold * 0.28);

      case "coastal-rise":
        return mix(COLORS.coastalGreen, COLORS.beachRise, elevationSignals.coastalRise * 0.48);

      case "mixed-highland":
      default:
        return mix(COLORS.fallbackLand, COLORS.highland, elevationSignals.relief * 0.48);
    }
  }

  function applyVisibleElevationRelief(color, map, biome, climateSignals, elevationSignals, hydrologySignals, groundSignals) {
    const u = Number(map.u || 0);
    const v = Number(map.v || 0);
    const cell = Number(map.cell256 || 1);
    const cellPhase = ((cell % 16) / 16) * PHI;

    const continentalGrain = fbm(u * 3.2 + cellPhase, v * 2.9 - 0.18, 880100, 5);
    const erosion = fbm(u * 8.4 - 0.31, v * 6.9 + cellPhase, 880900, 4);
    const ridgeLine = ridgeNoise(u * 18.0 + 0.44, v * 14.5 - 0.16, 881700, 3);
    const cliffLine = ridgeNoise(u * 34.0 - cellPhase, v * 27.0 + cellPhase * INV_PHI, 882100, 2);
    const valleyLine = ridgeNoise(u * 10.2 + 0.29, v * 8.2 - 0.36, 882700, 3);
    const waterLine = ridgeNoise(u * 24.0 - hydrologySignals.river * 0.8, v * 18.0 + hydrologySignals.drainage * 0.6, 883000, 3);
    const shoreLine = ridgeNoise(u * 16.0 + hydrologySignals.bay * 0.5, v * 12.0 - hydrologySignals.inlet * 0.5, 883080, 3);
    const summitField = fbm(u * PHI + 0.07, v * INV_PHI + 0.29, 883300, 4);

    let out = color;

    const waterDominant =
      biome === "inland-water" ||
      biome === "lake-water" ||
      biome === "river-corridor";

    const mountainHighlight =
      elevationSignals.mountain * 20 +
      elevationSignals.ridge * ridgeLine * 20 +
      elevationSignals.snowline * 14;

    const cliffShadow =
      elevationSignals.cliff * smoothstep(0.46, 0.92, cliffLine) * 34 +
      elevationSignals.shadowPressure * 18;

    const basinShadow =
      elevationSignals.basin * 22 +
      elevationSignals.valley * smoothstep(0.52, 0.94, valleyLine) * 24;

    const plateauLift =
      elevationSignals.plateau * 10 +
      smoothstep(0.44, 0.74, elevationSignals.elevation01) * 6;

    const coastalDepth =
      elevationSignals.coastalRise * 12;

    const hydroShadow =
      hydrologySignals.landCutPressure * 18 +
      hydrologySignals.coastalCut * 12 +
      hydrologySignals.oceanCorridor * 10;

    const hydroLight =
      hydrologySignals.surfaceWaterPressure * 10 +
      hydrologySignals.lagoon * 8 +
      hydrologySignals.coastalShelfWater * 6;

    const grainAmount =
      (continentalGrain - 0.5) * 15 +
      (erosion - 0.5) * 14 +
      elevationSignals.relief * 7;

    out = shade(out, grainAmount + mountainHighlight * 0.34 + plateauLift + coastalDepth * 0.42 + hydroLight * 0.28);
    out = shade(out, -cliffShadow * 0.58 - basinShadow * 0.44 - hydroShadow * 0.22);

    if (waterDominant) {
      const sparkle = smoothstep(0.66, 0.96, waterLine) * 18;
      out = mix(out, COLORS.lagoon, clamp(hydrologySignals.surfaceWaterPressure * 0.24 + hydrologySignals.lagoon * 0.18, 0, 0.34));
      out = shade(out, sparkle - elevationSignals.shadowPressure * 6);
      return out;
    }

    if (hydrologySignals.shouldSupportRiverCorridor || hydrologySignals.river > 0.50 || hydrologySignals.drainage > 0.54) {
      const riverCut = clamp(
        smoothstep(0.58, 0.94, waterLine) *
        (hydrologySignals.river * 0.34 + hydrologySignals.drainage * 0.20),
        0,
        0.38
      );

      out = mix(out, COLORS.riverGreen, riverCut);
      out = shade(out, -riverCut * 14);
    }

    if (hydrologySignals.shouldSupportWetlandColor || hydrologySignals.wetland > 0.48 || hydrologySignals.marshBasin > 0.48) {
      const wetBlend = clamp(hydrologySignals.wetland * 0.22 + hydrologySignals.marshBasin * 0.18 + hydrologySignals.delta * 0.12, 0, 0.38);
      out = mix(out, COLORS.wetland, wetBlend);
      out = mix(out, COLORS.marsh, wetBlend * 0.42);
    }

    if (hydrologySignals.shouldSupportBayInletBreaks || hydrologySignals.landCutPressure > 0.46) {
      const cut = clamp(hydrologySignals.landCutPressure * smoothstep(0.50, 0.92, shoreLine), 0, 0.36);
      out = mix(out, COLORS.bayBlue, cut);
      out = shade(out, -cut * 18);
    }

    if (elevationSignals.mountain > 0.46 || elevationSignals.ridge > 0.58) {
      out = mix(out, COLORS.stone, clamp(elevationSignals.mountain * 0.26 + elevationSignals.ridge * ridgeLine * 0.24, 0, 0.42));
      out = mix(out, COLORS.ridge, clamp(elevationSignals.ridge * smoothstep(0.58, 0.96, ridgeLine) * 0.34, 0, 0.34));
      out = shade(out, smoothstep(0.70, 0.96, ridgeLine) * elevationSignals.slope * 16);
    }

    if (elevationSignals.cliff > 0.42) {
      out = mix(out, COLORS.cliffDark, clamp(elevationSignals.cliff * smoothstep(0.50, 0.94, cliffLine) * 0.44, 0, 0.50));
      out = shade(out, -elevationSignals.cliff * 11);
    }

    if (elevationSignals.valley > 0.42) {
      out = mix(out, COLORS.valleyDark, clamp(elevationSignals.valley * smoothstep(0.48, 0.90, valleyLine) * 0.38, 0, 0.42));
    }

    if (elevationSignals.basin > 0.46) {
      out = mix(out, COLORS.basinDark, clamp(elevationSignals.basin * 0.30, 0, 0.38));
      if (biome === "dry-basin" || climateSignals.aridity > 0.58) {
        out = mix(out, COLORS.desert, clamp(elevationSignals.basin * climateSignals.aridity * 0.34, 0, 0.38));
      }
    }

    if (elevationSignals.plateau > 0.48) {
      out = mix(out, COLORS.plateauLight, clamp(elevationSignals.plateau * 0.18, 0, 0.24));
      out = shade(out, -elevationSignals.slope * elevationSignals.plateau * 9);
    }

    if (elevationSignals.coastalRise > 0.40) {
      out = mix(out, COLORS.coastalGold, clamp(elevationSignals.coastalRise * 0.18, 0, 0.26));
      out = shade(out, elevationSignals.coastalRise * 5 - elevationSignals.cliff * 7);
    }

    if (elevationSignals.snowline > 0.58 && elevationSignals.mountain > 0.36) {
      out = mix(out, COLORS.snow, clamp((elevationSignals.snowline - 0.42) * elevationSignals.mountain * 0.62, 0, 0.42));
    }

    if (biome === "rainforest") {
      out = mix(out, COLORS.rainforestDeep, groundSignals.canopy * 0.20);
      out = shade(out, -elevationSignals.shadowPressure * 8);
    }

    if (biome === "wetland" || biome === "delta-wetland" || biome === "estuary-wetland") {
      out = mix(out, COLORS.marsh, climateSignals.moisture * 0.18 + hydrologySignals.surfaceWaterPressure * 0.12);
      out = mix(out, COLORS.shadow, elevationSignals.basin * 0.10);
    }

    if (biome === "savanna") {
      out = mix(out, COLORS.scrub, groundSignals.scrub * 0.16);
      out = mix(out, COLORS.dryGrass, climateSignals.aridity * 0.18);
    }

    const summit = summitTone(map);
    const summitBlend = 0.05 + smoothstep(0.62, 0.96, summitField) * 0.075;
    out = mix(out, summit, summitBlend);

    return out;
  }

  function applyCoastalHydrologyGradient(color, map, elevationSignals, hydrologySignals) {
    const beachEdge = normalize01(map.beachEdge, 0);
    const shelf = normalize01(map.shelf, 0.2);
    const coastalText = [map.topology, map.terrainClass, map.elevation, map.geologyHint].map(text).join(" ");
    const coastalHint = includesAny(coastalText, ["coast", "shore", "landrise", "beach", "bay", "inlet", "lagoon", "archipelago", "island"]) ? 0.38 : 0;

    const coastal = clamp(
      beachEdge * 0.50 +
      shelf * 0.18 +
      coastalHint +
      elevationSignals.coastalRise * 0.22 +
      hydrologySignals.bay * 0.18 +
      hydrologySignals.inlet * 0.18 +
      hydrologySignals.lagoon * 0.16 +
      hydrologySignals.coastalShelfWater * 0.12 +
      hydrologySignals.archipelagoShelfWater * 0.12,
      0,
      0.78
    );

    if (coastal <= 0.02) return color;

    let out = mix(color, COLORS.coastalGreen, coastal * 0.36);
    out = mix(out, COLORS.beachRise, coastal * 0.22);
    out = mix(out, COLORS.lagoon, clamp((hydrologySignals.lagoon + hydrologySignals.coastalShelfWater) * 0.10, 0, 0.18));
    out = shade(out, elevationSignals.coastalRise * 6 - elevationSignals.cliff * 5 - hydrologySignals.landCutPressure * 6);
    return out;
  }

  function sampleSurface(map) {
    if (!isLandAllowed(map)) {
      return Object.freeze({
        allowed: false,
        reason: "land_surface_does_not_own_ocean_shelf_or_beach",
        contract: CONTRACT,
        receipt: RECEIPT,
        previousContract: PREVIOUS_CONTRACT,
        canvasMayPaint: false,
        generatedImage: false,
        graphicBox: false,
        visualPassClaimed: false
      });
    }

    const climate = readClimate(map);
    const elevation = readElevation(map);
    const topology = readTopology(map);
    const hydrology = readHydrology(map);
    const groundcover = readGroundcover(map);

    const climateSignals = getClimateSignals(map, climate);
    const elevationSignals = getElevationSignals(map, elevation);
    const hydrologySignals = getHydrologySignals(hydrology);
    const groundSignals = getGroundcoverSignals(map, groundcover);
    const biome = classifyBiome(map, climateSignals, elevationSignals, hydrologySignals, groundSignals);

    let color = baseBiomeColor(biome, climateSignals, elevationSignals, hydrologySignals);
    color = applyVisibleElevationRelief(color, map, biome, climateSignals, elevationSignals, hydrologySignals, groundSignals);
    color = applyCoastalHydrologyGradient(color, map, elevationSignals, hydrologySignals);

    return Object.freeze({
      allowed: true,
      color,
      biome,
      material: "hydrology_aware_visible_relief_surface",
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      expectedHydrologyContract: EXPECTED_HYDROLOGY_CONTRACT,
      version: VERSION,
      source: "land_surface_synthesis_only",
      mathBinding: "high_order_computable_planetary_math",

      owns: "visible_land_material_synthesis",
      ownsFootprint: false,
      ownsHydrology: false,
      ownsClimate: false,
      ownsElevation: false,
      ownsCanvas: false,

      readsClimate: Boolean(climate),
      readsElevation: Boolean(elevation),
      readsTopology: Boolean(topology),
      readsHydrology: Boolean(hydrology),
      readsHydrologyContract: hydrology?.contract || "",
      readsExpectedHydrology: hydrology?.contract === EXPECTED_HYDROLOGY_CONTRACT,
      readsGroundcover: Boolean(groundcover),

      hydrologySignals,
      climateSignals,
      elevationSignals,
      groundSignals,

      waterShapedSurface: Boolean(hydrologySignals.available),
      visibleInlandWater: Boolean(hydrologySignals.shouldPaintWater),
      visibleRiverCorridors: Boolean(hydrologySignals.shouldSupportRiverCorridor || hydrologySignals.river > 0.50),
      visibleWetlandColor: Boolean(hydrologySignals.shouldSupportWetlandColor || hydrologySignals.wetland > 0.48),
      visibleBayInletCutPressure: Boolean(hydrologySignals.shouldSupportBayInletBreaks || hydrologySignals.landCutPressure > 0.46),
      visibleArchipelagoShelfWater: Boolean(hydrologySignals.archipelagoShelfWater),

      canvasMayPaint: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function sample(map) {
    return sampleSurface(map);
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      expectedHydrologyContract: EXPECTED_HYDROLOGY_CONTRACT,
      version: VERSION,
      authority: "audralia-land-surface-visible-material-synthesis",
      role: "hydrology_aware_visible_relief_surface",
      mathBinding: "high_order_computable_planetary_math",
      ownsFootprint: false,
      ownsHydrology: false,
      ownsClimate: false,
      ownsElevation: false,
      ownsCanvas: false,
      ownsRuntime: false,
      ownsGauges: false,
      consumesElevation: true,
      consumesHydrology: true,
      readsOptionalAuthorities: {
        climate: Boolean(window.AUDRALIA_CLIMATE_RENDER?.sampleClimate || window.AUDRALIA_CLIMATE_RENDER?.sample),
        elevation: Boolean(window.AUDRALIA_ELEVATION?.sampleElevation || window.AUDRALIA_ELEVATION?.sample),
        topology: Boolean(window.AUDRALIA_TOPOLOGY?.sampleTopology || window.AUDRALIA_TOPOLOGY?.sample),
        hydrology: Boolean(window.AUDRALIA_HYDROLOGY?.sampleHydrology || window.AUDRALIA_HYDROLOGY?.sample),
        hydrologyContract: String(window.AUDRALIA_HYDROLOGY?.contract || ""),
        hydrologyExpected: String(window.AUDRALIA_HYDROLOGY?.contract || "") === EXPECTED_HYDROLOGY_CONTRACT,
        groundcover: Boolean(window.AUDRALIA_GROUNDCOVER?.sampleGroundcover || window.AUDRALIA_GROUNDCOVER?.sample),
        lattice256: Boolean(window.AUDRALIA_LATTICE256?.coordinatesFromUV),
        summits: Boolean(window.AUDRALIA_SUMMITS)
      },
      authorizedVisualExpansions: [
        "ridge_shadows",
        "mountain_highlights",
        "cliff_dark_edges",
        "valley_depressions",
        "basin_lowlands",
        "plateau_shoulders",
        "coastal_rise_depth",
        "snowline_highlights",
        "shadow_pressure",
        "river_corridors",
        "wetland_material",
        "inland_lake_material",
        "inland_sea_material",
        "delta_estuary_material",
        "bay_inlet_cut_pressure",
        "lagoon_shelf_water",
        "archipelago_shelf_guidance",
        "phi_scaled_surface_fields",
        "256_cell_nodal_phase"
      ],
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.AUDRALIA_LAND_SURFACE = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    expectedHydrologyContract: EXPECTED_HYDROLOGY_CONTRACT,
    version: VERSION,
    sampleSurface,
    sample,
    getStatus
  });

  window.AUDRALIA_LAND_SURFACE_RECEIPT = getStatus();

  document.documentElement.dataset.audraliaLandSurfaceLoaded = "true";
  document.documentElement.dataset.audraliaLandSurfaceContract = CONTRACT;
  document.documentElement.dataset.audraliaLandSurfaceReceipt = RECEIPT;
  document.documentElement.dataset.audraliaLandSurfacePreviousContract = PREVIOUS_CONTRACT;
  document.documentElement.dataset.audraliaLandSurfaceExpectedHydrologyContract = EXPECTED_HYDROLOGY_CONTRACT;
  document.documentElement.dataset.audraliaLandSurfaceRole = "hydrology_aware_visible_relief_surface";
  document.documentElement.dataset.audraliaLandSurfaceMathBinding = "high_order_computable_planetary_math";
  document.documentElement.dataset.audraliaLandSurfaceConsumesElevation = "true";
  document.documentElement.dataset.audraliaLandSurfaceConsumesHydrology = "true";
  document.documentElement.dataset.audraliaLandSurfaceOwnsFootprint = "false";
  document.documentElement.dataset.audraliaLandSurfaceOwnsHydrology = "false";
  document.documentElement.dataset.audraliaLandSurfaceOwnsClimate = "false";
  document.documentElement.dataset.audraliaLandSurfaceOwnsElevation = "false";
  document.documentElement.dataset.audraliaLandSurfaceOwnsCanvas = "false";
  document.documentElement.dataset.audraliaLandSurfaceRidgeShadows = "true";
  document.documentElement.dataset.audraliaLandSurfaceMountainHighlights = "true";
  document.documentElement.dataset.audraliaLandSurfaceCliffEdges = "true";
  document.documentElement.dataset.audraliaLandSurfaceValleyDepressions = "true";
  document.documentElement.dataset.audraliaLandSurfaceBasinLowlands = "true";
  document.documentElement.dataset.audraliaLandSurfacePlateauShoulders = "true";
  document.documentElement.dataset.audraliaLandSurfaceCoastalRiseDepth = "true";
  document.documentElement.dataset.audraliaLandSurfaceSnowlineHighlights = "true";
  document.documentElement.dataset.audraliaLandSurfaceRiverCorridors = "true";
  document.documentElement.dataset.audraliaLandSurfaceWetlandMaterial = "true";
  document.documentElement.dataset.audraliaLandSurfaceInlandWater = "true";
  document.documentElement.dataset.audraliaLandSurfaceDeltaEstuaryMaterial = "true";
  document.documentElement.dataset.audraliaLandSurfaceBayInletCutPressure = "true";
  document.documentElement.dataset.audraliaLandSurfaceArchipelagoShelfGuidance = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();

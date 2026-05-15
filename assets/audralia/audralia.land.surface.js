// /assets/audralia/audralia.land.surface.js
// AUDRALIA_BIOME_RELIEF_SURFACE_DETAIL_TNT_v1
// Full-file replacement.
// Land Surface authority only.
// Purpose:
// - Synthesizes visible land material detail from existing upstream authorities.
// - Adds biome, relief, climate, summit, and ancient-weathered surface variation.
// - Does not own footprint.
// - Does not create land.
// - Does not erase beaches.
// - Does not render canvas.
// - Does not touch runtime.
// - Does not touch Gauges.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_BIOME_RELIEF_SURFACE_DETAIL_TNT_v1";
  const RECEIPT = "AUDRALIA_BIOME_RELIEF_SURFACE_DETAIL_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_G1_LAYER_TWO_LUSH_LAND_SURFACE_TNT_v1";
  const VERSION = "2026-05-15.audralia-biome-relief-surface-detail-v1";

  const COLORS = Object.freeze({
    rainforestDeep: [42, 101, 55],
    rainforestCanopy: [62, 132, 69],
    wetland: [74, 126, 84],
    marsh: [95, 139, 86],
    savanna: [142, 151, 82],
    dryGrass: [165, 149, 84],
    desert: [178, 139, 83],
    dryBasin: [142, 116, 82],
    scrub: [111, 132, 77],
    temperateForest: [72, 121, 70],
    highland: [98, 125, 82],
    mountain: [114, 113, 94],
    ridge: [132, 127, 102],
    alpine: [155, 166, 142],
    snow: [218, 230, 222],
    coastalGreen: [93, 141, 83],
    coastalGold: [171, 154, 102],
    beachRise: [177, 165, 113],
    summitGold: [183, 151, 81],
    summitViolet: [108, 102, 150],
    summitBlue: [78, 128, 155],
    shadow: [34, 48, 44],
    stone: [103, 105, 93],
    light: [219, 213, 172]
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
    stability: [93, 122, 91]
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

  function multiply(color, factor) {
    return [
      clamp(Math.round(color[0] * factor), 0, 255),
      clamp(Math.round(color[1] * factor), 0, 255),
      clamp(Math.round(color[2] * factor), 0, 255)
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
      scale *= 2;
    }

    return total / Math.max(0.000001, norm);
  }

  function text(value) {
    return String(value || "").trim().toLowerCase();
  }

  function includesAny(value, terms) {
    const source = text(value);
    return terms.some((term) => source.includes(term));
  }

  function isOceanLike(map) {
    return Boolean(
      map?.isOcean ||
      map?.terrainClass === "ocean" ||
      map?.terrainClass === "shelf" ||
      map?.isShelf
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
    } catch {
      document.documentElement.dataset.audraliaLandSurfaceClimateReadFailed = "true";
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

    return null;
  }

  function readTopology(map) {
    try {
      if (window.AUDRALIA_TOPOLOGY?.sampleTopology) {
        const topology = window.AUDRALIA_TOPOLOGY.sampleTopology(map);
        if (topology && typeof topology === "object") return topology;
      }

      if (window.AUDRALIA_TOPOLOGY?.sample) {
        const topology = window.AUDRALIA_TOPOLOGY.sample(map);
        if (topology && typeof topology === "object") return topology;
      }
    } catch {
      document.documentElement.dataset.audraliaLandSurfaceTopologyReadFailed = "true";
    }

    return null;
  }

  function getClimateSignals(map, climate) {
    const latitude = Number(map.latitude || 0);
    const absLat = Math.abs(latitude);
    const u = Number(map.u || 0);
    const v = Number(map.v || 0);

    const equatorWarmth = 1 - smoothstep(4, 78, absLat);
    const polarCold = smoothstep(50, 82, absLat);
    const continentalNoise = fbm(u * 0.72 + 0.12, v * 0.74 - 0.18, 540100, 5);
    const wetNoise = fbm(u * 1.14 - 0.25, v * 1.02 + 0.19, 540900, 5);
    const dryNoise = fbm(u * 1.52 + 0.33, v * 1.36 - 0.21, 541700, 4);

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
      ? normalize01(
          climate.moisture ??
          climate.humidity ??
          climate.wetness ??
          climate.rainfall ??
          climate.precipitation,
          0.48
        )
      : 0.42 + wetNoise * 0.36 + equatorWarmth * 0.16;

    let heat = climate
      ? normalize01(
          climate.heat ??
          climate.temperature ??
          climate.warmth,
          0.55
        )
      : 0.28 + equatorWarmth * 0.55 - polarCold * 0.22 + continentalNoise * 0.14;

    let aridity = climate
      ? normalize01(
          climate.aridity ??
          climate.dryness,
          1 - moisture
        )
      : clamp(0.20 + dryNoise * 0.48 + smoothstep(18, 42, absLat) * 0.16 - moisture * 0.30, 0, 1);

    if (includesAny(climateText, ["rainforest", "jungle", "humid", "monsoon"])) {
      moisture = Math.max(moisture, 0.78);
      heat = Math.max(heat, 0.66);
      aridity = Math.min(aridity, 0.22);
    }

    if (includesAny(climateText, ["wetland", "marsh", "swamp", "delta", "fen"])) {
      moisture = Math.max(moisture, 0.72);
      aridity = Math.min(aridity, 0.28);
    }

    if (includesAny(climateText, ["desert", "arid", "dry", "basin"])) {
      moisture = Math.min(moisture, 0.32);
      aridity = Math.max(aridity, 0.72);
    }

    if (includesAny(climateText, ["savanna", "grass", "steppe", "prairie"])) {
      moisture = clamp(moisture, 0.34, 0.62);
      aridity = clamp(aridity, 0.34, 0.68);
    }

    if (includesAny(climateText, ["alpine", "snow", "ice", "polar", "tundra"])) {
      heat = Math.min(heat, 0.32);
      moisture = Math.max(moisture, 0.44);
    }

    return Object.freeze({
      moisture: clamp(moisture, 0, 1),
      heat: clamp(heat, 0, 1),
      aridity: clamp(aridity, 0, 1),
      polarCold,
      equatorWarmth,
      climateText
    });
  }

  function getReliefSignals(map, elevation, topology) {
    const topoText = [
      map.terrainClass,
      map.topology,
      map.elevation,
      elevation?.class,
      elevation?.zone,
      elevation?.relief,
      topology?.class,
      topology?.zone,
      topology?.form
    ].map(text).join(" ");

    let relief = normalize01(
      elevation?.relief ??
      elevation?.height ??
      elevation?.altitude ??
      elevation?.elevation ??
      map.relief ??
      map.altitude,
      0.42
    );

    let slope = normalize01(
      elevation?.slope ??
      topology?.slope ??
      map.slope,
      0.36
    );

    let basin = normalize01(
      elevation?.basin ??
      topology?.basin ??
      map.basin,
      0.22
    );

    if (includesAny(topoText, ["mountain", "range", "ridge", "peak", "alpine"])) {
      relief = Math.max(relief, 0.76);
      slope = Math.max(slope, 0.66);
    }

    if (includesAny(topoText, ["highland", "shoulder", "upland", "plateau"])) {
      relief = Math.max(relief, 0.58);
      slope = Math.max(slope, 0.44);
    }

    if (includesAny(topoText, ["basin", "valley", "lowland", "plain"])) {
      relief = Math.min(relief, 0.42);
      basin = Math.max(basin, 0.62);
    }

    if (includesAny(topoText, ["coastal", "coast", "shore", "landrise"])) {
      relief = clamp(relief, 0.34, 0.68);
      slope = Math.max(slope, 0.34);
    }

    return Object.freeze({
      relief: clamp(relief, 0, 1),
      slope: clamp(slope, 0, 1),
      basin: clamp(basin, 0, 1),
      topologyText: topoText
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

    let vegetation = normalize01(
      groundcover?.vegetation ??
      groundcover?.density ??
      groundcover?.coverDensity ??
      map.vegetationDensity,
      0.52
    );

    let canopy = normalize01(
      groundcover?.canopy ??
      groundcover?.forestCanopy ??
      map.canopy,
      0.38
    );

    let scrub = normalize01(
      groundcover?.scrub ??
      groundcover?.brush ??
      groundcover?.bushes,
      0.34
    );

    if (includesAny(coverText, ["rainforest", "forest", "canopy", "trees"])) {
      vegetation = Math.max(vegetation, 0.76);
      canopy = Math.max(canopy, 0.72);
    }

    if (includesAny(coverText, ["grass", "savanna", "steppe", "prairie"])) {
      vegetation = clamp(Math.max(vegetation, 0.48), 0, 0.74);
      canopy = Math.min(canopy, 0.36);
    }

    if (includesAny(coverText, ["scrub", "bush", "brush", "shrub"])) {
      scrub = Math.max(scrub, 0.62);
      vegetation = Math.max(vegetation, 0.42);
    }

    if (includesAny(coverText, ["desert", "bare", "rock"])) {
      vegetation = Math.min(vegetation, 0.28);
      canopy = Math.min(canopy, 0.18);
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
    if (SUMMIT_TONES[key]) return SUMMIT_TONES[key];

    const normalized = key.replace(/\s+/g, "-");
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

    return SUMMIT_TONES.gratitude;
  }

  function classifyBiome(map, climateSignals, reliefSignals, groundSignals) {
    const climateText = climateSignals.climateText;
    const topologyText = reliefSignals.topologyText;

    if (includesAny(climateText + " " + topologyText, ["snow", "ice", "polar"])) return "snow-alpine";
    if (includesAny(climateText + " " + topologyText, ["alpine", "peak", "ridge", "mountain"])) return "alpine-highland";
    if (includesAny(climateText, ["rainforest", "jungle", "monsoon"])) return "rainforest";
    if (includesAny(climateText, ["wetland", "marsh", "swamp", "delta"])) return "wetland";
    if (includesAny(climateText, ["desert", "arid"])) return "dry-basin";
    if (includesAny(climateText, ["savanna", "grass", "steppe"])) return "savanna";
    if (includesAny(climateText, ["temperate", "forest"])) return "temperate-forest";

    if (reliefSignals.relief > 0.78 && climateSignals.polarCold > 0.38) return "snow-alpine";
    if (reliefSignals.relief > 0.72) return "alpine-highland";
    if (climateSignals.moisture > 0.76 && climateSignals.heat > 0.56 && groundSignals.canopy > 0.58) return "rainforest";
    if (climateSignals.moisture > 0.70 && reliefSignals.basin > 0.42) return "wetland";
    if (climateSignals.aridity > 0.68 && climateSignals.moisture < 0.36) return "dry-basin";
    if (climateSignals.aridity > 0.48 && groundSignals.canopy < 0.38) return "savanna";
    if (climateSignals.moisture > 0.48 && groundSignals.vegetation > 0.54) return "temperate-forest";

    if (includesAny(map.topology, ["coast", "landrise", "shore"])) return "coastal-rise";

    return "mixed-highland";
  }

  function baseBiomeColor(biome, climateSignals, reliefSignals) {
    switch (biome) {
      case "rainforest":
        return mix(COLORS.rainforestDeep, COLORS.rainforestCanopy, climateSignals.moisture * 0.72);

      case "wetland":
        return mix(COLORS.wetland, COLORS.marsh, climateSignals.moisture * 0.66);

      case "savanna":
        return mix(COLORS.savanna, COLORS.dryGrass, climateSignals.aridity * 0.68);

      case "dry-basin":
        return mix(COLORS.dryBasin, COLORS.desert, climateSignals.aridity * 0.82);

      case "temperate-forest":
        return mix(COLORS.temperateForest, COLORS.coastalGreen, climateSignals.moisture * 0.46);

      case "alpine-highland":
        return mix(COLORS.highland, COLORS.mountain, reliefSignals.relief * 0.72);

      case "snow-alpine":
        return mix(COLORS.alpine, COLORS.snow, climateSignals.polarCold * 0.72 + reliefSignals.relief * 0.28);

      case "coastal-rise":
        return mix(COLORS.coastalGreen, COLORS.beachRise, 0.38);

      case "mixed-highland":
      default:
        return mix(COLORS.fallbackLand, COLORS.highland, reliefSignals.relief * 0.48);
    }
  }

  function applyAncientReliefTexture(color, map, biome, climateSignals, reliefSignals, groundSignals) {
    const u = Number(map.u || 0);
    const v = Number(map.v || 0);

    const continentalGrain = fbm(u * 3.2 + 0.12, v * 2.9 - 0.18, 880100, 5);
    const erosion = fbm(u * 7.7 - 0.31, v * 6.4 + 0.22, 880900, 4);
    const vein = fbm(u * 15.5 + 0.44, v * 13.0 - 0.16, 881700, 3);
    const summitField = fbm(u * 1.35 + 0.07, v * 1.2 + 0.29, 882500, 4);

    let out = color;

    const reliefShadow = (reliefSignals.relief - 0.5) * 22 + (reliefSignals.slope - 0.5) * 10;
    const basinShadow = reliefSignals.basin * -16;
    const erosionAmount = (erosion - 0.5) * (biome === "dry-basin" ? 22 : 13);
    const grainAmount = (continentalGrain - 0.5) * 15;

    out = shade(out, reliefShadow + basinShadow + erosionAmount + grainAmount);

    if (reliefSignals.relief > 0.58) {
      out = mix(out, COLORS.stone, smoothstep(0.56, 0.92, reliefSignals.relief) * 0.26);
      out = mix(out, COLORS.ridge, smoothstep(0.62, 0.96, vein) * reliefSignals.slope * 0.18);
    }

    if (biome === "rainforest") {
      out = mix(out, COLORS.rainforestDeep, groundSignals.canopy * 0.22);
      out = shade(out, smoothstep(0.56, 0.95, summitField) * 6);
    }

    if (biome === "wetland") {
      out = mix(out, COLORS.marsh, climateSignals.moisture * 0.18);
      out = mix(out, COLORS.shadow, smoothstep(0.68, 0.94, continentalGrain) * 0.10);
    }

    if (biome === "dry-basin") {
      out = mix(out, COLORS.desert, climateSignals.aridity * 0.24);
      out = mix(out, COLORS.stone, smoothstep(0.62, 0.95, erosion) * 0.18);
    }

    if (biome === "savanna") {
      out = mix(out, COLORS.scrub, groundSignals.scrub * 0.14);
      out = mix(out, COLORS.dryGrass, climateSignals.aridity * 0.18);
    }

    if (biome === "snow-alpine") {
      out = mix(out, COLORS.snow, smoothstep(0.58, 0.94, reliefSignals.relief + climateSignals.polarCold * 0.5) * 0.34);
    }

    const summit = summitTone(map);
    const summitBlend = 0.055 + smoothstep(0.62, 0.96, summitField) * 0.075;
    out = mix(out, summit, summitBlend);

    return out;
  }

  function applyCoastalGradient(color, map) {
    const beachEdge = normalize01(map.beachEdge, 0);
    const shelf = normalize01(map.shelf, 0.2);
    const coastalText = [map.topology, map.terrainClass, map.elevation].map(text).join(" ");
    const coastalHint = includesAny(coastalText, ["coast", "shore", "landrise", "beach"]) ? 0.35 : 0;

    const coastal = clamp(beachEdge * 0.46 + shelf * 0.16 + coastalHint, 0, 0.55);
    if (coastal <= 0.02) return color;

    let out = mix(color, COLORS.coastalGreen, coastal * 0.45);
    out = mix(out, COLORS.beachRise, coastal * 0.28);
    return out;
  }

  function sampleSurface(map) {
    if (!isLandAllowed(map)) {
      return Object.freeze({
        allowed: false,
        reason: "land_surface_does_not_own_ocean_shelf_or_beach",
        contract: CONTRACT,
        receipt: RECEIPT,
        canvasMayPaint: false,
        generatedImage: false,
        graphicBox: false,
        visualPassClaimed: false
      });
    }

    const climate = readClimate(map);
    const elevation = readElevation(map);
    const topology = readTopology(map);
    const groundcover = readGroundcover(map);

    const climateSignals = getClimateSignals(map, climate);
    const reliefSignals = getReliefSignals(map, elevation, topology);
    const groundSignals = getGroundcoverSignals(map, groundcover);
    const biome = classifyBiome(map, climateSignals, reliefSignals, groundSignals);

    let color = baseBiomeColor(biome, climateSignals, reliefSignals);
    color = applyAncientReliefTexture(color, map, biome, climateSignals, reliefSignals, groundSignals);
    color = applyCoastalGradient(color, map);

    return Object.freeze({
      allowed: true,
      color,
      biome,
      material: "biome_relief_surface_detail",
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      source: "land_surface_synthesis_only",
      owns: "visible_land_material_synthesis",
      ownsFootprint: false,
      ownsClimate: false,
      ownsCanvas: false,
      readsClimate: Boolean(climate),
      readsElevation: Boolean(elevation),
      readsTopology: Boolean(topology),
      readsGroundcover: Boolean(groundcover),
      climateSignals,
      reliefSignals,
      groundSignals,
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
      version: VERSION,
      authority: "audralia-land-surface-visible-material-synthesis",
      role: "biome_relief_surface_detail",
      ownsFootprint: false,
      ownsClimate: false,
      ownsCanvas: false,
      ownsRuntime: false,
      ownsGauges: false,
      authorizedVisualExpansions: [
        "rainforest_belts",
        "wetlands_and_marsh_regions",
        "savanna_transition_zones",
        "dry_interior_basins",
        "desert_shelves",
        "temperate_forests",
        "highland_shoulders",
        "mountain_shadow_regions",
        "alpine_and_snow_pressure",
        "coastal_vegetation_gradients",
        "beach_to_land_rise_transitions",
        "subtle_erosion_grain",
        "summit_region_tonal_signatures",
        "ancient_continental_aging_texture"
      ],
      readsOptionalAuthorities: {
        climate: Boolean(window.AUDRALIA_CLIMATE_RENDER?.sampleClimate),
        elevation: Boolean(window.AUDRALIA_ELEVATION?.sampleElevation || window.AUDRALIA_ELEVATION?.sample),
        topology: Boolean(window.AUDRALIA_TOPOLOGY?.sampleTopology || window.AUDRALIA_TOPOLOGY?.sample),
        groundcover: Boolean(window.AUDRALIA_GROUNDCOVER?.sampleGroundcover || window.AUDRALIA_GROUNDCOVER?.sample),
        lattice256: Boolean(window.AUDRALIA_LATTICE256?.coordinatesFromUV),
        summits: Boolean(window.AUDRALIA_SUMMITS)
      },
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.AUDRALIA_LAND_SURFACE = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
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
  document.documentElement.dataset.audraliaLandSurfaceRole = "biome_relief_surface_detail";
  document.documentElement.dataset.audraliaLandSurfaceOwnsFootprint = "false";
  document.documentElement.dataset.audraliaLandSurfaceOwnsClimate = "false";
  document.documentElement.dataset.audraliaLandSurfaceOwnsCanvas = "false";
  document.documentElement.dataset.audraliaLandSurfaceBiomeRelief = "true";
  document.documentElement.dataset.audraliaLandSurfaceAncientTexture = "true";
  document.documentElement.dataset.audraliaLandSurfaceSummitTone = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();

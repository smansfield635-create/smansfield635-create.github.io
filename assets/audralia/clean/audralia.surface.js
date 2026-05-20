// /assets/audralia/clean/audralia.surface.js
// AUDRALIA_CLEAN_CANVAS_SURFACE_TNT_v1
// Full-file replacement.
// File 11 of 16.
// Planet Audralia visible surface material synthesis authority.
// Purpose:
// - Establishes Audralia-specific visible surface material synthesis.
// - Converts landmask, hydrology, elevation, climate, biome, and palette signals into visible RGB material guidance.
// - Defines ocean, shelf, beach, coast, land, forest, wetland, grassland, savanna, dryland, mountain, cliff, snow, ice, river, lake, delta, marsh, and restoration material outputs.
// - Consumes Audralia landmask, hydrology, elevation, climate, biome, and universal palette when available.
// - Does not create continents.
// - Does not create water behavior.
// - Does not create elevation.
// - Does not create climate fields.
// - Does not create biome categories.
// - Does not render canvas.
// - Does not own atmosphere/weather behavior.
// - Does not own runtime, controls, route bridge, or HTML shell.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_CLEAN_CANVAS_SURFACE_TNT_v1";
  const RECEIPT = "AUDRALIA_CLEAN_CANVAS_SURFACE_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_CLEAN_CANVAS_BIOME_TNT_v1";
  const VERSION = "2026-05-20.audralia-clean-canvas-surface-v1";

  const FILE_NUMBER = 11;
  const PRIMARY_NODE = 11;
  const SUBNODE_RANGE = Object.freeze([161, 176]);

  const UNIVERSAL_ANCHOR = "/showroom/globe/";
  const AUDRALIA_ROUTE = "/showroom/globe/audralia/";
  const H_EARTH_ROUTE = "/showroom/globe/h-earth/";

  const SURFACE_TARGETS = Object.freeze({
    oceanMaterial: true,
    shelfMaterial: true,
    beachMaterial: true,
    coastlineMaterial: true,
    landMaterial: true,
    terrainMaterial: true,
    hydrologyMaterial: true,
    biomeMaterial: true,
    snowIceMaterial: true,
    restorationMaterial: true,
    visibleRgbGuidance: true,
    consumesLandmask: true,
    consumesHydrology: true,
    consumesElevation: true,
    consumesClimate: true,
    consumesBiome: true,
    consumesPalette: true,
    ownsCanvas: false,
    ownsAtmosphere: false
  });

  const FALLBACK_COLORS = Object.freeze({
    oceanAbyss: Object.freeze([2, 16, 50]),
    oceanDeep: Object.freeze([4, 28, 76]),
    oceanOpen: Object.freeze([8, 78, 132]),
    shelfOuter: Object.freeze([28, 124, 152]),
    shelfInner: Object.freeze([58, 166, 172]),
    shelfBright: Object.freeze([118, 210, 186]),
    wetBeach: Object.freeze([166, 150, 98]),
    beach: Object.freeze([222, 198, 126]),
    paleSand: Object.freeze([234, 214, 154]),
    lowland: Object.freeze([108, 154, 80]),
    fertile: Object.freeze([82, 148, 82]),
    forest: Object.freeze([44, 118, 72]),
    deepForest: Object.freeze([28, 82, 50]),
    grassland: Object.freeze([142, 158, 86]),
    savanna: Object.freeze([170, 150, 78]),
    scrub: Object.freeze([116, 130, 78]),
    dryland: Object.freeze([156, 116, 76]),
    desert: Object.freeze([196, 144, 82]),
    wetland: Object.freeze([60, 124, 104]),
    marsh: Object.freeze([92, 142, 98]),
    river: Object.freeze([38, 134, 152]),
    lake: Object.freeze([36, 122, 144]),
    delta: Object.freeze([72, 156, 132]),
    highland: Object.freeze([134, 126, 88]),
    mountain: Object.freeze([138, 132, 116]),
    ridge: Object.freeze([158, 150, 122]),
    cliff: Object.freeze([54, 62, 60]),
    stone: Object.freeze([102, 108, 102]),
    shadow: Object.freeze([26, 36, 38]),
    snow: Object.freeze([226, 236, 230]),
    ice: Object.freeze([194, 222, 226]),
    restoration: Object.freeze([78, 148, 88]),
    transition: Object.freeze([118, 142, 92])
  });

  function M() {
    return window.DGB_PLANET_FAMILY_MATH || window.AUDRALIA_CLEAN_CANVAS_MATH || null;
  }

  function P() {
    return window.DGB_PLANET_FAMILY_PALETTE || window.AUDRALIA_CLEAN_CANVAS_PALETTE || null;
  }

  function LM() {
    return window.AUDRALIA_LANDMASK || window.AUDRALIA_CLEAN_CANVAS_LANDMASK || null;
  }

  function H() {
    return window.AUDRALIA_HYDROLOGY || window.AUDRALIA_CLEAN_CANVAS_HYDROLOGY || null;
  }

  function E() {
    return window.AUDRALIA_ELEVATION || window.AUDRALIA_CLEAN_CANVAS_ELEVATION || null;
  }

  function C() {
    return window.AUDRALIA_CLIMATE || window.AUDRALIA_CLEAN_CANVAS_CLIMATE || null;
  }

  function B() {
    return window.AUDRALIA_BIOME || window.AUDRALIA_CLEAN_CANVAS_BIOME || null;
  }

  function finite(value, fallback = 0) {
    const helper = M();
    if (helper?.finite) return helper.finite(value, fallback);
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    const helper = M();
    if (helper?.clamp) return helper.clamp(value, min, max);
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function clamp01(value) {
    const helper = M();
    if (helper?.clamp01) return helper.clamp01(value);
    return clamp(value, 0, 1);
  }

  function lerp(a, b, t) {
    const helper = M();
    if (helper?.lerp) return helper.lerp(a, b, t);
    return finite(a, 0) + (finite(b, 0) - finite(a, 0)) * clamp01(t);
  }

  function smoothstep(edge0, edge1, value) {
    const helper = M();
    if (helper?.smoothstep) return helper.smoothstep(edge0, edge1, value);
    const t = clamp((finite(value, 0) - finite(edge0, 0)) / Math.max(0.000001, finite(edge1, 1) - finite(edge0, 0)), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function wrap01(value) {
    const helper = M();
    if (helper?.wrap01) return helper.wrap01(value);
    const number = finite(value, 0);
    return ((number % 1) + 1) % 1;
  }

  function fbm2(u, v, options = {}) {
    const helper = M();
    if (helper?.fbm2) return helper.fbm2(u, v, options);

    let total = 0;
    let norm = 0;
    let amp = 0.58;
    let scale = finite(options.scale, 3.5);
    const seed = Math.floor(finite(options.seed, 0));
    const octaves = clamp(Math.floor(finite(options.octaves, 5)), 1, 8);

    for (let i = 0; i < octaves; i += 1) {
      total += fallbackNoise(u, v, scale, seed + i * 131) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= 1.618033988749895;
    }

    return total / Math.max(0.000001, norm);
  }

  function ridgeNoise2(u, v, options = {}) {
    const helper = M();
    if (helper?.ridgeNoise2) return helper.ridgeNoise2(u, v, options);

    let total = 0;
    let norm = 0;
    let amp = 0.58;
    let scale = finite(options.scale, 4.0);
    const seed = Math.floor(finite(options.seed, 0));
    const octaves = clamp(Math.floor(finite(options.octaves, 4)), 1, 8);

    for (let i = 0; i < octaves; i += 1) {
      const n = fallbackNoise(u, v, scale, seed + i * 197);
      total += (1 - Math.abs(n * 2 - 1)) * amp;
      norm += amp;
      amp *= 0.50;
      scale *= 1.618033988749895;
    }

    return total / Math.max(0.000001, norm);
  }

  function fallbackHash(x, y, seed) {
    let h = Math.imul(Math.floor(x) ^ 0x9e3779b9, 0x85ebca6b);
    h ^= Math.imul(Math.floor(y) ^ Math.floor(seed) ^ 0xc2b2ae35, 0x27d4eb2f);
    h ^= h >>> 15;
    h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967295;
  }

  function fallbackNoise(uInput, vInput, scaleInput, seedInput) {
    const scale = Math.max(2, Math.floor(finite(scaleInput, 8)));
    const u = wrap01(uInput) * scale;
    const v = clamp01(vInput) * scale;
    const x0 = Math.floor(u);
    const y0 = Math.floor(v);
    const x1 = x0 + 1;
    const y1 = y0 + 1;
    const xf = u - x0;
    const yf = v - y0;
    const sx = xf * xf * (3 - 2 * xf);
    const sy = yf * yf * (3 - 2 * yf);
    const seed = Math.floor(finite(seedInput, 0));

    const a = fallbackHash(((x0 % scale) + scale) % scale, y0, seed);
    const b = fallbackHash(((x1 % scale) + scale) % scale, y0, seed);
    const c = fallbackHash(((x0 % scale) + scale) % scale, y1, seed);
    const d = fallbackHash(((x1 % scale) + scale) % scale, y1, seed);

    return (a + (b - a) * sx) * (1 - sy) + (c + (d - c) * sx) * sy;
  }

  function rgb(color) {
    const source = Array.isArray(color) ? color : [0, 0, 0];
    return Object.freeze([
      clamp(Math.round(finite(source[0], 0)), 0, 255),
      clamp(Math.round(finite(source[1], 0)), 0, 255),
      clamp(Math.round(finite(source[2], 0)), 0, 255)
    ]);
  }

  function colorFromPalette(path, fallback) {
    const palette = P();
    if (palette?.getColor) return rgb(palette.getColor(path, fallback));
    return rgb(fallback);
  }

  function roleColor(role, fallback) {
    const palette = P();
    if (palette?.getRoleColor) return rgb(palette.getRoleColor(role, fallback));
    return rgb(fallback);
  }

  function mix(a, b, t) {
    const aa = rgb(a);
    const bb = rgb(b);
    const k = clamp01(t);

    return Object.freeze([
      Math.round(lerp(aa[0], bb[0], k)),
      Math.round(lerp(aa[1], bb[1], k)),
      Math.round(lerp(aa[2], bb[2], k))
    ]);
  }

  function shade(color, amount) {
    const source = rgb(color);
    const delta = finite(amount, 0);

    return Object.freeze([
      clamp(Math.round(source[0] + delta), 0, 255),
      clamp(Math.round(source[1] + delta), 0, 255),
      clamp(Math.round(source[2] + delta), 0, 255)
    ]);
  }

  function contrast(color, factor = 1.10, pivot = 116) {
    const source = rgb(color);
    const f = finite(factor, 1.10);
    const p = finite(pivot, 116);

    return Object.freeze([
      clamp(Math.round((source[0] - p) * f + p), 0, 255),
      clamp(Math.round((source[1] - p) * f + p), 0, 255),
      clamp(Math.round((source[2] - p) * f + p), 0, 255)
    ]);
  }

  function sampleLandmaskFromInput(input, vMaybe) {
    if (input && typeof input === "object" && Number.isFinite(Number(input.u)) && Number.isFinite(Number(input.v))) {
      if (input.landmaskOwnsFootprint || input.footprintClass || input.landScore !== undefined) return input;

      const landmask = LM();
      if (landmask?.sampleLandmask) return landmask.sampleLandmask(input.u, input.v);
      if (landmask?.sample) return landmask.sample(input.u, input.v);

      return fallbackLandmask(input.u, input.v);
    }

    const u = wrap01(input);
    const v = clamp01(vMaybe);
    const landmask = LM();

    if (landmask?.sampleLandmask) return landmask.sampleLandmask(u, v);
    if (landmask?.sample) return landmask.sample(u, v);

    return fallbackLandmask(u, v);
  }

  function fallbackLandmask(uInput, vInput) {
    const u = wrap01(uInput);
    const v = clamp01(vInput);
    const lon = u * 360 - 180;
    const lat = 90 - v * 180;
    const noise = fbm2(u * 1.3 + 0.12, v * 1.1 - 0.09, { seed: 7001, scale: 3.2, octaves: 5 });
    const ridge = ridgeNoise2(u * 2.6 - 0.22, v * 2.2 + 0.18, { seed: 7002, scale: 4.0, octaves: 4 });
    const landScore = noise * 0.52 + ridge * 0.20 + (1 - Math.abs(lat) / 90) * 0.14 - 0.43;
    const shelfWidth = 0.14;
    const beachWidth = 0.04;
    const isOcean = landScore <= -shelfWidth;
    const isShelf = landScore > -shelfWidth && landScore <= 0;
    const isBeach = landScore > 0 && landScore <= beachWidth;
    const isLand = landScore > beachWidth;

    return Object.freeze({
      u,
      v,
      longitudeDegrees: lon,
      latitudeDegrees: lat,
      row16: Math.floor(v * 16),
      col16: Math.floor(u * 16),
      cell256: Math.floor(v * 16) * 16 + Math.floor(u * 16) + 1,
      primarySummit: "Gratitude",
      secondarySummit: "Balance",
      internalSummit: "Stability",
      footprintClass: isOcean ? "ocean" : isShelf ? "shelf" : isBeach ? "beach" : "land",
      landScore,
      coastProximity: clamp01(1 - Math.abs(landScore) / (shelfWidth + beachWidth)),
      shelf: isShelf ? smoothstep(-shelfWidth, 0, landScore) : isBeach || isLand ? 1 : 0,
      beachEdge: clamp01(1 - Math.abs(landScore) / (shelfWidth + beachWidth)),
      isOcean,
      isShelf,
      isBeach,
      isLand,
      isWater: isOcean || isShelf,
      isCoastal: isShelf || isBeach || Math.abs(landScore) < 0.16,
      isPolarIce: Math.abs(lat) > 74 && isLand,
      landmaskOwnsFootprint: true
    });
  }

  function sampleHydrologyForMask(mask) {
    const hydrology = H();

    try {
      if (hydrology?.sampleHydrology) return hydrology.sampleHydrology(mask);
      if (hydrology?.sample) return hydrology.sample(mask);
    } catch {
      if (document?.documentElement?.dataset) {
        document.documentElement.dataset.audraliaSurfaceHydrologyReadFailed = "true";
      }
    }

    return Object.freeze({
      class: "hydrology-background",
      zone: "dry-land",
      form: "hydrology-fallback",
      rainfallSupply: 0.42,
      meltwaterSupply: mask.isPolarIce ? 0.36 : 0,
      dryness: 0.38,
      watershed: 0.22,
      drainage: 0.20,
      river: 0,
      dryChannel: 0,
      lake: 0,
      inlandSea: 0,
      wetland: 0,
      marsh: 0,
      bay: mask.isCoastal ? 0.25 : 0,
      inlet: mask.isCoastal ? 0.20 : 0,
      estuary: 0,
      delta: 0,
      lagoon: 0,
      coastalShelfWater: mask.isShelf ? 0.40 : 0,
      isInlandWater: false,
      isSurfaceWater: Boolean(mask.isOcean || mask.isShelf)
    });
  }

  function sampleElevationForMask(mask) {
    const elevation = E();

    try {
      if (elevation?.sampleElevation) return elevation.sampleElevation(mask);
      if (elevation?.sample) return elevation.sample(mask);
    } catch {
      if (document?.documentElement?.dataset) {
        document.documentElement.dataset.audraliaSurfaceElevationReadFailed = "true";
      }
    }

    return Object.freeze({
      class: mask.isOcean ? "sea-floor" : mask.isShelf ? "shelf-depth" : mask.isBeach ? "beach-rise" : "plain",
      zone: mask.isOcean ? "ocean-depth" : mask.isCoastal ? "coastal" : "rolling-lowland",
      form: "elevation-fallback",
      elevation01: mask.isLand ? 0.38 : 0,
      height: mask.isLand ? 0.38 : 0,
      aboveSea: mask.isLand || mask.isBeach ? 0.38 : 0,
      belowSeaDepth: mask.isOcean ? 0.52 : mask.isShelf ? 0.14 : 0,
      relief: 0.24,
      slope: 0.18,
      basin: 0.20,
      ridge: 0.18,
      mountain: 0.08,
      cliff: mask.isCoastal ? 0.12 : 0,
      plateau: 0.14,
      valley: 0.12,
      coastalRise: mask.isCoastal ? 0.22 : 0,
      snowline: mask.isPolarIce ? 0.66 : 0,
      shadowPressure: 0.16
    });
  }

  function sampleClimateForMask(mask) {
    const climate = C();

    try {
      if (climate?.sampleClimate) return climate.sampleClimate(mask);
      if (climate?.sample) return climate.sample(mask);
    } catch {
      if (document?.documentElement?.dataset) {
        document.documentElement.dataset.audraliaSurfaceClimateReadFailed = "true";
      }
    }

    const absLat = Math.abs(finite(mask.latitudeDegrees, 0));
    const tropical = 1 - smoothstep(18, 32, absLat);
    const polar = smoothstep(72, 88, absLat);
    const heat = clamp01(tropical * 0.76 + (1 - polar) * 0.26);
    const cold = clamp01(polar * 0.84 + (1 - heat) * 0.12);
    const moisture = clamp01(0.42 + mask.coastProximity * 0.18 - polar * 0.12);
    const aridity = clamp01(0.42 - moisture * 0.18 + smoothstep(18, 42, absLat) * 0.14);

    return Object.freeze({
      class: polar > 0.62 ? "polar-cold" : tropical > 0.62 ? "rainforest-humid" : "mixed-temperate",
      zone: polar > 0.62 ? "polar" : tropical > 0.62 ? "humid" : "temperate",
      form: "climate-fallback",
      heat,
      temperature: heat,
      warmth: heat,
      cold,
      moisture,
      humidity: moisture,
      rainfall: moisture * 0.78,
      precipitation: moisture * 0.78,
      aridity,
      dryness: aridity,
      windPressure: 0.32,
      seasonalPressure: 0.38,
      droughtPressure: aridity * 0.72,
      frostPressure: cold * 0.72,
      tropical,
      subtropical: smoothstep(18, 34, absLat) * (1 - smoothstep(34, 48, absLat)),
      temperate: smoothstep(32, 48, absLat) * (1 - smoothstep(56, 70, absLat)),
      subpolar: smoothstep(56, 72, absLat) * (1 - smoothstep(74, 86, absLat)),
      polar
    });
  }

  function sampleBiomeForMask(mask) {
    const biome = B();

    try {
      if (biome?.sampleBiome) return biome.sampleBiome(mask);
      if (biome?.sample) return biome.sample(mask);
    } catch {
      if (document?.documentElement?.dataset) {
        document.documentElement.dataset.audraliaSurfaceBiomeReadFailed = "true";
      }
    }

    if (mask.isOcean) {
      return Object.freeze({
        class: "ocean-biome",
        zone: "marine",
        form: "open-ocean-life-field",
        lifeDensity: 0.22,
        forestPressure: 0,
        rainforestPressure: 0,
        wetlandPressure: 0,
        grassPressure: 0,
        savannaPressure: 0,
        drylandPressure: 0,
        scrubPressure: 0,
        desertPressure: 0,
        alpinePressure: 0,
        polarPressure: 0,
        coastalLife: 0.20,
        marineLife: 0.44,
        restorationPressure: 0.18,
        transitionPressure: 0.24
      });
    }

    if (mask.isShelf) {
      return Object.freeze({
        class: "shelf-biome",
        zone: "marine",
        form: "shelf-life-field",
        lifeDensity: 0.30,
        forestPressure: 0,
        rainforestPressure: 0,
        wetlandPressure: 0,
        grassPressure: 0,
        savannaPressure: 0,
        drylandPressure: 0,
        scrubPressure: 0,
        desertPressure: 0,
        alpinePressure: 0,
        polarPressure: 0,
        coastalLife: 0.32,
        marineLife: 0.58,
        restorationPressure: 0.22,
        transitionPressure: 0.28
      });
    }

    return Object.freeze({
      class: mask.isPolarIce ? "polar" : mask.isCoastal ? "coastal" : "grassland",
      zone: mask.isPolarIce ? "polar" : mask.isCoastal ? "coastal" : "grassland",
      form: "biome-fallback",
      lifeDensity: mask.isPolarIce ? 0.10 : 0.46,
      forestPressure: 0.26,
      rainforestPressure: 0.12,
      wetlandPressure: mask.isCoastal ? 0.24 : 0.12,
      grassPressure: 0.42,
      savannaPressure: 0.28,
      drylandPressure: 0.20,
      scrubPressure: 0.18,
      desertPressure: 0.10,
      alpinePressure: mask.isPolarIce ? 0.38 : 0.10,
      polarPressure: mask.isPolarIce ? 0.68 : 0.06,
      coastalLife: mask.isCoastal ? 0.44 : 0.12,
      marineLife: 0,
      restorationPressure: 0.34,
      transitionPressure: 0.28
    });
  }

  function waterBase(mask, hydro, elevation) {
    if (mask.isShelf) {
      let color = mix(
        colorFromPalette("shelf.outer", FALLBACK_COLORS.shelfOuter),
        colorFromPalette("shelf.inner", FALLBACK_COLORS.shelfInner),
        clamp01(mask.shelf * 0.54 + hydro.coastalShelfWater * 0.28)
      );

      color = mix(color, colorFromPalette("shelf.bright", FALLBACK_COLORS.shelfBright), clamp01(hydro.lagoon * 0.30 + hydro.bay * 0.12));
      return color;
    }

    const depth = clamp01(elevation.belowSeaDepth);
    let color = mix(
      colorFromPalette("ocean.abyss", FALLBACK_COLORS.oceanAbyss),
      colorFromPalette("ocean.deep", FALLBACK_COLORS.oceanDeep),
      1 - depth * 0.42
    );

    color = mix(color, colorFromPalette("ocean.open", FALLBACK_COLORS.oceanOpen), clamp01(mask.coastProximity * 0.18 + hydro.coastalShelfWater * 0.12));
    return color;
  }

  function landBase(mask, hydro, elevation, climate, biome) {
    switch (biome.class) {
      case "rainforest":
        return mix(
          colorFromPalette("land.deepForest", FALLBACK_COLORS.deepForest),
          colorFromPalette("biome.rainforest", FALLBACK_COLORS.forest),
          clamp01(climate.moisture * 0.50 + biome.rainforestPressure * 0.34)
        );

      case "temperate-forest":
      case "restoration-forest":
        return mix(
          colorFromPalette("land.forest", FALLBACK_COLORS.forest),
          colorFromPalette("biome.restorationGreen", FALLBACK_COLORS.restoration),
          clamp01(biome.restorationPressure * 0.38 + climate.rainfall * 0.14)
        );

      case "wetland":
      case "marsh":
      case "delta-life":
        return mix(
          colorFromPalette("hydrology.wetland", FALLBACK_COLORS.wetland),
          colorFromPalette("hydrology.marsh", FALLBACK_COLORS.marsh),
          clamp01(hydro.marsh * 0.38 + hydro.delta * 0.20)
        );

      case "grassland":
        return mix(
          colorFromPalette("land.lowland", FALLBACK_COLORS.lowland),
          colorFromPalette("land.grassland", FALLBACK_COLORS.grassland),
          clamp01(biome.grassPressure * 0.46 + climate.moisture * 0.16)
        );

      case "savanna":
        return mix(
          colorFromPalette("land.grassland", FALLBACK_COLORS.grassland),
          colorFromPalette("land.savanna", FALLBACK_COLORS.savanna),
          clamp01(climate.aridity * 0.42 + biome.savannaPressure * 0.28)
        );

      case "scrub":
        return mix(
          colorFromPalette("land.scrub", FALLBACK_COLORS.scrub),
          colorFromPalette("land.dryland", FALLBACK_COLORS.dryland),
          clamp01(climate.aridity * 0.36 + biome.scrubPressure * 0.24)
        );

      case "desert":
        return mix(
          colorFromPalette("land.dryland", FALLBACK_COLORS.dryland),
          colorFromPalette("land.desert", FALLBACK_COLORS.desert),
          clamp01(climate.droughtPressure * 0.46 + biome.desertPressure * 0.28)
        );

      case "alpine":
        return mix(
          colorFromPalette("terrain.highland", FALLBACK_COLORS.highland),
          colorFromPalette("terrain.mountain", FALLBACK_COLORS.mountain),
          clamp01(elevation.mountain * 0.42 + climate.cold * 0.22)
        );

      case "polar":
        return mix(
          colorFromPalette("terrain.ice", FALLBACK_COLORS.ice),
          colorFromPalette("terrain.snow", FALLBACK_COLORS.snow),
          clamp01(climate.frostPressure * 0.48 + elevation.snowline * 0.26)
        );

      case "coastal":
        return mix(
          colorFromPalette("coast.tidalGreen", FALLBACK_COLORS.wetland),
          colorFromPalette("coast.beach", FALLBACK_COLORS.beach),
          clamp01(mask.beachEdge * 0.28 + elevation.coastalRise * 0.20)
        );

      default:
        return mix(
          colorFromPalette("land.lowland", FALLBACK_COLORS.lowland),
          colorFromPalette("land.fertile", FALLBACK_COLORS.fertile),
          clamp01(biome.lifeDensity * 0.36 + climate.moisture * 0.16)
        );
    }
  }

  function applyHydrologyMaterial(color, mask, hydro) {
    let out = rgb(color);

    if (hydro.lake > 0.64 || hydro.inlandSea > 0.64) {
      out = mix(out, colorFromPalette("hydrology.lake", FALLBACK_COLORS.lake), clamp01(Math.max(hydro.lake, hydro.inlandSea) * 0.78));
    }

    if (hydro.river > 0.62) {
      out = mix(out, colorFromPalette("hydrology.river", FALLBACK_COLORS.river), clamp01(hydro.river * 0.42));
    }

    if (hydro.delta > 0.58) {
      out = mix(out, colorFromPalette("hydrology.delta", FALLBACK_COLORS.delta), clamp01(hydro.delta * 0.38));
    }

    if (hydro.wetland > 0.54 || hydro.marsh > 0.54) {
      out = mix(out, colorFromPalette("hydrology.wetland", FALLBACK_COLORS.wetland), clamp01(Math.max(hydro.wetland, hydro.marsh) * 0.30));
    }

    if (hydro.dryChannel > 0.64) {
      out = mix(out, colorFromPalette("hydrology.dryChannel", FALLBACK_COLORS.dryland), clamp01(hydro.dryChannel * 0.28));
    }

    if (mask.isBeach && (hydro.estuary > 0.52 || hydro.delta > 0.52)) {
      out = mix(out, colorFromPalette("hydrology.estuary", FALLBACK_COLORS.shelfInner), clamp01(Math.max(hydro.estuary, hydro.delta) * 0.24));
    }

    return out;
  }

  function applyElevationMaterial(color, mask, elevation) {
    let out = rgb(color);

    if (mask.isOcean || mask.isShelf) {
      const depthShade = -clamp01(elevation.belowSeaDepth) * 22 + clamp01(elevation.shelfDepth) * 10;
      return shade(out, depthShade);
    }

    const grain =
      (fbm2(mask.u * 24.0 + 0.11, mask.v * 18.0 - 0.19, { seed: 14001, scale: 18.0, octaves: 3 }) - 0.5) * 18 +
      (ridgeNoise2(mask.u * 12.0 - 0.27, mask.v * 9.0 + 0.31, { seed: 14002, scale: 10.0, octaves: 3 }) - 0.5) * 10;

    out = shade(out, grain);
    out = shade(out, clamp01(elevation.relief) * 6 - clamp01(elevation.shadowPressure) * 14);

    if (elevation.mountain > 0.44 || elevation.ridge > 0.48) {
      out = mix(out, colorFromPalette("terrain.stone", FALLBACK_COLORS.stone), clamp01(elevation.mountain * 0.24 + elevation.ridge * 0.18));
      out = mix(out, colorFromPalette("terrain.ridge", FALLBACK_COLORS.ridge), clamp01(elevation.ridge * 0.22));
      out = shade(out, clamp01(elevation.slope) * 8);
    }

    if (elevation.cliff > 0.42) {
      out = mix(out, colorFromPalette("terrain.cliff", FALLBACK_COLORS.cliff), clamp01(elevation.cliff * 0.36));
      out = shade(out, -clamp01(elevation.cliff) * 12);
    }

    if (elevation.basin > 0.48 || elevation.valley > 0.48) {
      out = mix(out, colorFromPalette("terrain.valley", FALLBACK_COLORS.shadow), clamp01(Math.max(elevation.basin, elevation.valley) * 0.22));
    }

    if (elevation.plateau > 0.46) {
      out = mix(out, colorFromPalette("terrain.plateau", FALLBACK_COLORS.highland), clamp01(elevation.plateau * 0.18));
    }

    if (elevation.snowline > 0.54) {
      out = mix(out, colorFromPalette("terrain.snow", FALLBACK_COLORS.snow), clamp01((elevation.snowline - 0.40) * 0.58));
    }

    return out;
  }

  function applyClimateBiomeMaterial(color, mask, climate, biome) {
    let out = rgb(color);

    if (!mask.isOcean && !mask.isShelf) {
      out = mix(out, colorFromPalette("land.desert", FALLBACK_COLORS.desert), clamp01(climate.aridity * biome.desertPressure * 0.26));
      out = mix(out, colorFromPalette("biome.restorationGreen", FALLBACK_COLORS.restoration), clamp01(biome.restorationPressure * 0.16));
      out = mix(out, colorFromPalette("terrain.ice", FALLBACK_COLORS.ice), clamp01(climate.frostPressure * biome.polarPressure * 0.28));
    }

    if (mask.isCoastal) {
      out = mix(out, colorFromPalette("coast.tidalGreen", FALLBACK_COLORS.wetland), clamp01(biome.coastalLife * 0.16 + climate.humidity * 0.08));
    }

    if (biome.transitionPressure > 0.50) {
      out = mix(out, FALLBACK_COLORS.transition, clamp01((biome.transitionPressure - 0.40) * 0.22));
    }

    return out;
  }

  function classifySurface(mask, hydro, elevation, climate, biome) {
    if (mask.isOcean) {
      if (elevation.belowSeaDepth > 0.62) return ["deep-ocean-material", "water-surface", "abyssal-ocean-visible-material"];
      return ["ocean-material", "water-surface", "open-ocean-visible-material"];
    }

    if (mask.isShelf) {
      if (hydro.lagoon > 0.58) return ["lagoon-shelf-material", "water-surface", "lagoon-shelf-visible-material"];
      return ["shelf-material", "water-surface", "continental-shelf-visible-material"];
    }

    if (mask.isBeach) {
      if (hydro.estuary > 0.54 || hydro.delta > 0.54) return ["estuary-beach-material", "coastal-surface", "river-mouth-coastal-material"];
      return ["beach-material", "coastal-surface", "beach-visible-material"];
    }

    if (hydro.lake > 0.66 || hydro.inlandSea > 0.66) return ["inland-water-material", "inland-water-surface", "lake-or-inland-sea-visible-material"];
    if (biome.class === "polar" || mask.isPolarIce) return ["polar-ice-material", "land-surface", "ice-and-snow-visible-material"];
    if (biome.class === "alpine" || elevation.mountain > 0.62) return ["mountain-material", "land-surface", "mountain-visible-material"];
    if (biome.class === "rainforest") return ["rainforest-material", "land-surface", "dense-humid-visible-material"];
    if (biome.class === "wetland" || biome.class === "marsh" || biome.class === "delta-life") return ["wetland-material", "land-surface", "saturated-lowland-visible-material"];
    if (biome.class === "desert" || biome.class === "scrub") return ["dryland-material", "land-surface", "dry-visible-material"];
    if (biome.class === "savanna") return ["savanna-material", "land-surface", "warm-seasonal-visible-material"];
    if (biome.class === "restoration-forest") return ["restoration-material", "land-surface", "future-capable-restoration-material"];
    if (biome.class === "temperate-forest") return ["forest-material", "land-surface", "forest-visible-material"];
    if (biome.class === "grassland") return ["grassland-material", "land-surface", "open-green-visible-material"];

    return ["mixed-land-material", "land-surface", "mixed-visible-material"];
  }

  function sampleSurface(input, vMaybe) {
    const mask = sampleLandmaskFromInput(input, vMaybe);
    const hydro = sampleHydrologyForMask(mask);
    const elevation = sampleElevationForMask(mask);
    const climate = sampleClimateForMask(mask);
    const biome = sampleBiomeForMask(mask);

    let color;

    if (mask.isOcean || mask.isShelf) {
      color = waterBase(mask, hydro, elevation);
    } else if (mask.isBeach) {
      color = mix(
        colorFromPalette("coast.wetBeach", FALLBACK_COLORS.wetBeach),
        colorFromPalette("coast.beach", FALLBACK_COLORS.beach),
        clamp01(mask.beachEdge * 0.38 + climate.aridity * 0.18)
      );
    } else {
      color = landBase(mask, hydro, elevation, climate, biome);
    }

    color = applyHydrologyMaterial(color, mask, hydro);
    color = applyElevationMaterial(color, mask, elevation);
    color = applyClimateBiomeMaterial(color, mask, climate, biome);

    const surfaceNoise = (fbm2(mask.u * 36.0 + 0.41, mask.v * 24.0 - 0.33, { seed: 14003, scale: 24.0, octaves: 3 }) - 0.5) * 8;
    const finalColor = contrast(shade(color, surfaceNoise), 1.035, 112);

    const classification = classifySurface(mask, hydro, elevation, climate, biome);

    return Object.freeze({
      allowed: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-visible-surface-material-synthesis",
      fileNumber: FILE_NUMBER,
      primaryNode: PRIMARY_NODE,
      subnodes: SUBNODE_RANGE,

      u: mask.u,
      v: mask.v,
      longitudeDegrees: mask.longitudeDegrees,
      latitudeDegrees: mask.latitudeDegrees,
      row16: mask.row16,
      col16: mask.col16,
      cell256: mask.cell256,
      cell64: mask.cell64,
      cell16: mask.cell16,
      quadrant: mask.quadrant,
      primarySummit: mask.primarySummit,
      secondarySummit: mask.secondarySummit,
      internalSummit: mask.internalSummit,

      footprintClass: mask.footprintClass,
      hydrologyClass: hydro.class,
      elevationClass: elevation.class,
      climateClass: climate.class,
      biomeClass: biome.class,

      class: classification[0],
      zone: classification[1],
      form: classification[2],
      surfaceClass: classification[0],
      surfaceZone: classification[1],
      surfaceForm: classification[2],

      color: finalColor,
      rgb: finalColor,
      materialColor: finalColor,
      materialRole: classification[0],

      isOcean: mask.isOcean,
      isShelf: mask.isShelf,
      isBeach: mask.isBeach,
      isLand: mask.isLand,
      isCoastal: mask.isCoastal,
      isSurfaceWater: Boolean(mask.isOcean || mask.isShelf || hydro.isInlandWater),
      isInlandWater: Boolean(hydro.isInlandWater),

      materialSignals: Object.freeze({
        coastProximity: mask.coastProximity,
        shelf: mask.shelf,
        beachEdge: mask.beachEdge,
        belowSeaDepth: elevation.belowSeaDepth,
        elevation01: elevation.elevation01,
        relief: elevation.relief,
        slope: elevation.slope,
        mountain: elevation.mountain,
        ridge: elevation.ridge,
        cliff: elevation.cliff,
        basin: elevation.basin,
        valley: elevation.valley,
        plateau: elevation.plateau,
        snowline: elevation.snowline,
        moisture: climate.moisture,
        humidity: climate.humidity,
        aridity: climate.aridity,
        rainfall: climate.rainfall,
        cold: climate.cold,
        heat: climate.heat,
        lifeDensity: biome.lifeDensity,
        restorationPressure: biome.restorationPressure,
        hydrologyWetness: Math.max(hydro.wetland || 0, hydro.marsh || 0, hydro.delta || 0, hydro.lake || 0, hydro.river || 0)
      }),

      visualGuidance: Object.freeze({
        shouldPaint: true,
        shouldPaintAsWater: Boolean(mask.isOcean || mask.isShelf || hydro.isInlandWater),
        shouldPaintAsLand: Boolean(mask.isLand || mask.isBeach),
        shouldShowCoast: mask.isCoastal || mask.isBeach || mask.isShelf,
        shouldShowRelief: elevation.relief > 0.34 || elevation.slope > 0.34,
        shouldShowHydrology: hydro.river > 0.52 || hydro.lake > 0.52 || hydro.wetland > 0.52 || hydro.delta > 0.52,
        shouldShowVegetation: biome.lifeDensity > 0.36,
        shouldShowDryness: climate.aridity > 0.56 || climate.droughtPressure > 0.56,
        shouldShowSnowIce: elevation.snowline > 0.54 || climate.frostPressure > 0.54 || mask.isPolarIce,
        shouldStayBelowAtmosphere: true
      }),

      sourceReads: Object.freeze({
        landmask: Boolean(mask.landmaskOwnsFootprint || mask.ownsFootprint || mask.footprintClass),
        hydrology: Boolean(hydro.contract === "AUDRALIA_CLEAN_CANVAS_HYDROLOGY_TNT_v1"),
        elevation: Boolean(elevation.contract === "AUDRALIA_CLEAN_CANVAS_ELEVATION_TNT_v1"),
        climate: Boolean(climate.contract === "AUDRALIA_CLEAN_CANVAS_CLIMATE_TNT_v1"),
        biome: Boolean(biome.contract === "AUDRALIA_CLEAN_CANVAS_BIOME_TNT_v1"),
        palette: Boolean(P()?.getColor),
        math: Boolean(M()?.fbm2)
      }),

      ownsFootprint: false,
      ownsLandSea: false,
      ownsHydrology: false,
      ownsWaterBehavior: false,
      ownsElevation: false,
      ownsVerticalDepth: false,
      ownsClimate: false,
      ownsConditionFields: false,
      ownsBiome: false,
      ownsLivingCategories: false,
      ownsSurface: true,
      ownsVisibleMaterialSynthesis: true,
      ownsAtmosphere: false,
      ownsWeatherRendering: false,
      ownsRuntime: false,
      ownsControls: false,
      ownsCanvas: false,
      ownsRoute: false,
      ownsHtml: false,
      canvasMayPaint: true,
      hEarthMayInherit: true,

      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function sample(input, vMaybe) {
    return sampleSurface(input, vMaybe);
  }

  function classify(input, vMaybe) {
    return sampleSurface(input, vMaybe).class;
  }

  function estimateSurface(width = 56, height = 28) {
    const w = clamp(Math.floor(finite(width, 56)), 16, 256);
    const h = clamp(Math.floor(finite(height, 28)), 8, 128);

    const counts = {
      water: 0,
      land: 0,
      coast: 0,
      relief: 0,
      hydrology: 0,
      vegetation: 0,
      dry: 0,
      snowIce: 0,
      total: 0
    };

    for (let y = 0; y < h; y += 1) {
      const v = (y + 0.5) / h;

      for (let x = 0; x < w; x += 1) {
        const u = (x + 0.5) / w;
        const surface = sampleSurface(u, v);

        counts.total += 1;

        if (surface.visualGuidance.shouldPaintAsWater) counts.water += 1;
        if (surface.visualGuidance.shouldPaintAsLand) counts.land += 1;
        if (surface.visualGuidance.shouldShowCoast) counts.coast += 1;
        if (surface.visualGuidance.shouldShowRelief) counts.relief += 1;
        if (surface.visualGuidance.shouldShowHydrology) counts.hydrology += 1;
        if (surface.visualGuidance.shouldShowVegetation) counts.vegetation += 1;
        if (surface.visualGuidance.shouldShowDryness) counts.dry += 1;
        if (surface.visualGuidance.shouldShowSnowIce) counts.snowIce += 1;
      }
    }

    const denominator = Math.max(1, counts.total);

    return Object.freeze({
      samples: counts.total,
      waterMaterialRatio: Number((counts.water / denominator).toFixed(4)),
      landMaterialRatio: Number((counts.land / denominator).toFixed(4)),
      coastalMaterialRatio: Number((counts.coast / denominator).toFixed(4)),
      reliefMaterialRatio: Number((counts.relief / denominator).toFixed(4)),
      hydrologyMaterialRatio: Number((counts.hydrology / denominator).toFixed(4)),
      vegetationMaterialRatio: Number((counts.vegetation / denominator).toFixed(4)),
      dryMaterialRatio: Number((counts.dry / denominator).toFixed(4)),
      snowIceMaterialRatio: Number((counts.snowIce / denominator).toFixed(4))
    });
  }

  function validateManifestRegistration() {
    try {
      const manifest = window.DGB_PLANET_FAMILY_MANIFEST || window.AUDRALIA_CLEAN_CANVAS_MANIFEST;
      if (!manifest || typeof manifest.validatePrimaryFile !== "function") {
        return Object.freeze({
          manifestAvailable: false,
          valid: true,
          reason: "manifest_not_loaded_yet_surface_can_still_register"
        });
      }

      return manifest.validatePrimaryFile({
        path: "/assets/audralia/clean/audralia.surface.js",
        contract: CONTRACT
      });
    } catch (error) {
      return Object.freeze({
        manifestAvailable: true,
        valid: false,
        reason: error instanceof Error ? error.message : String(error)
      });
    }
  }

  function validatePriorAuthorities() {
    const math = M();
    const palette = P();
    const landmask = LM();
    const hydrology = H();
    const elevation = E();
    const climate = C();
    const biome = B();

    return Object.freeze({
      math: Object.freeze({
        available: Boolean(math),
        expectedContract: "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_MATH_TNT_v1",
        actualContract: math?.contract || null,
        valid: !math || math.contract === "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_MATH_TNT_v1"
      }),
      palette: Object.freeze({
        available: Boolean(palette),
        expectedContract: "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_PALETTE_TNT_v1",
        actualContract: palette?.contract || null,
        valid: !palette || palette.contract === "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_PALETTE_TNT_v1"
      }),
      landmask: Object.freeze({
        available: Boolean(landmask),
        expectedContract: "AUDRALIA_CLEAN_CANVAS_LANDMASK_TNT_v1",
        actualContract: landmask?.contract || null,
        valid: !landmask || landmask.contract === "AUDRALIA_CLEAN_CANVAS_LANDMASK_TNT_v1"
      }),
      hydrology: Object.freeze({
        available: Boolean(hydrology),
        expectedContract: "AUDRALIA_CLEAN_CANVAS_HYDROLOGY_TNT_v1",
        actualContract: hydrology?.contract || null,
        valid: !hydrology || hydrology.contract === "AUDRALIA_CLEAN_CANVAS_HYDROLOGY_TNT_v1"
      }),
      elevation: Object.freeze({
        available: Boolean(elevation),
        expectedContract: "AUDRALIA_CLEAN_CANVAS_ELEVATION_TNT_v1",
        actualContract: elevation?.contract || null,
        valid: !elevation || elevation.contract === "AUDRALIA_CLEAN_CANVAS_ELEVATION_TNT_v1"
      }),
      climate: Object.freeze({
        available: Boolean(climate),
        expectedContract: "AUDRALIA_CLEAN_CANVAS_CLIMATE_TNT_v1",
        actualContract: climate?.contract || null,
        valid: !climate || climate.contract === "AUDRALIA_CLEAN_CANVAS_CLIMATE_TNT_v1"
      }),
      biome: Object.freeze({
        available: Boolean(biome),
        expectedContract: "AUDRALIA_CLEAN_CANVAS_BIOME_TNT_v1",
        actualContract: biome?.contract || null,
        valid: !biome || biome.contract === "AUDRALIA_CLEAN_CANVAS_BIOME_TNT_v1"
      })
    });
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-visible-surface-material-synthesis",
      fileNumber: FILE_NUMBER,
      primaryNode: PRIMARY_NODE,
      subnodes: SUBNODE_RANGE,
      parentAnchor: "/showroom/globe/audralia/index.html",
      universalParent: UNIVERSAL_ANCHOR,
      downstreamGroundView: H_EARTH_ROUTE,
      targets: SURFACE_TARGETS,
      surfaceEstimate: estimateSurface(40, 20),
      owns: Object.freeze([
        "visible surface material synthesis",
        "RGB material guidance",
        "ocean material",
        "shelf material",
        "beach material",
        "coast material",
        "land material",
        "terrain material",
        "hydrology material",
        "biome material",
        "snow and ice material",
        "restoration material",
        "surface-level visual guidance"
      ]),
      doesNotOwn: Object.freeze([
        "universal manifest law",
        "math primitives",
        "lattice authority",
        "palette constants",
        "Audralia identity",
        "land/ocean footprint",
        "continent creation",
        "water behavior",
        "hydrology authority",
        "elevation depth",
        "climate fields",
        "biome categories",
        "atmosphere rendering",
        "weather rendering",
        "runtime motion",
        "controls",
        "canvas composition",
        "route bridge",
        "HTML expression"
      ]),
      manifestRegistration: validateManifestRegistration(),
      priorAuthorities: validatePriorAuthorities(),
      hEarthReceivesSurfaceThroughAudralia: true,
      footprintCreationForbidden: true,
      waterBehaviorCreationForbidden: true,
      elevationCreationForbidden: true,
      climateCreationForbidden: true,
      biomeCreationForbidden: true,
      atmosphereCreationForbidden: true,
      canvasRenderingForbidden: true,
      fibonacciChronology: true,
      primaryStructure16: true,
      nodalConstruct256: true,
      oneFileOneJob: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  const API = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,

    FILE_NUMBER,
    PRIMARY_NODE,
    SUBNODE_RANGE,
    UNIVERSAL_ANCHOR,
    AUDRALIA_ROUTE,
    H_EARTH_ROUTE,
    SURFACE_TARGETS,

    sampleSurface,
    sample,
    classify,
    estimateSurface,
    validateManifestRegistration,
    validatePriorAuthorities,
    getStatus
  });

  window.AUDRALIA_SURFACE = API;
  window.AUDRALIA_SURFACE_RECEIPT = getStatus();

  window.AUDRALIA_CLEAN_CANVAS_SURFACE = API;
  window.AUDRALIA_CLEAN_CANVAS_SURFACE_RECEIPT = getStatus();

  if (document?.documentElement?.dataset) {
    document.documentElement.dataset.audraliaSurfaceLoaded = "true";
    document.documentElement.dataset.audraliaSurfaceContract = CONTRACT;
    document.documentElement.dataset.audraliaSurfaceReceipt = RECEIPT;
    document.documentElement.dataset.audraliaSurfaceVersion = VERSION;
    document.documentElement.dataset.audraliaCleanCanvasSurfaceLoaded = "true";
    document.documentElement.dataset.audraliaCleanCanvasSurfaceContract = CONTRACT;
    document.documentElement.dataset.audraliaCleanCanvasSurfaceReceipt = RECEIPT;
    document.documentElement.dataset.audraliaCleanCanvasSurfaceNode = String(PRIMARY_NODE);
    document.documentElement.dataset.audraliaCleanCanvasSurfaceSubnodes = "161-176";
    document.documentElement.dataset.audraliaSurfaceOwnsVisibleMaterialSynthesis = "true";
    document.documentElement.dataset.audraliaSurfaceOwnsFootprint = "false";
    document.documentElement.dataset.audraliaSurfaceOwnsHydrology = "false";
    document.documentElement.dataset.audraliaSurfaceOwnsElevation = "false";
    document.documentElement.dataset.audraliaSurfaceOwnsClimate = "false";
    document.documentElement.dataset.audraliaSurfaceOwnsBiome = "false";
    document.documentElement.dataset.audraliaSurfaceOwnsAtmosphere = "false";
    document.documentElement.dataset.audraliaSurfaceOwnsCanvas = "false";
    document.documentElement.dataset.audraliaSurfaceOceanMaterial = "true";
    document.documentElement.dataset.audraliaSurfaceLandMaterial = "true";
    document.documentElement.dataset.audraliaSurfaceTerrainMaterial = "true";
    document.documentElement.dataset.audraliaSurfaceHydrologyMaterial = "true";
    document.documentElement.dataset.audraliaSurfaceBiomeMaterial = "true";
    document.documentElement.dataset.hEarthReceivesAudraliaSurface = "true";
    document.documentElement.dataset.audraliaCleanCanvasFibonacciChronology = "true";
    document.documentElement.dataset.audraliaCleanCanvasPrimaryStructure16 = "true";
    document.documentElement.dataset.audraliaCleanCanvasNodalConstruct256 = "true";
    document.documentElement.dataset.audraliaCleanCanvasOneFileOneJob = "true";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }
})();

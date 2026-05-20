// /assets/audralia/clean/audralia.biome.js
// AUDRALIA_CLEAN_CANVAS_BIOME_TNT_v1
// Full-file replacement.
// File 10 of 16.
// Planet Audralia biome / living-category authority.
// Purpose:
// - Establishes Audralia-specific biome and living-world category authority.
// - Defines rainforest, forest, grassland, savanna, wetland, marsh, delta-life, desert, scrub, alpine, polar, coastal, reef-adjacent, restoration, and transition zones.
// - Consumes Audralia landmask, hydrology, elevation, and climate when available.
// - Does not create continents.
// - Does not create water behavior.
// - Does not create elevation.
// - Does not create climate fields.
// - Does not synthesize surface material.
// - Does not render atmosphere/weather.
// - Does not own runtime, controls, canvas, route bridge, or HTML shell.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_CLEAN_CANVAS_BIOME_TNT_v1";
  const RECEIPT = "AUDRALIA_CLEAN_CANVAS_BIOME_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_CLEAN_CANVAS_CLIMATE_TNT_v1";
  const VERSION = "2026-05-20.audralia-clean-canvas-biome-v1";

  const FILE_NUMBER = 10;
  const PRIMARY_NODE = 10;
  const SUBNODE_RANGE = Object.freeze([145, 160]);

  const UNIVERSAL_ANCHOR = "/showroom/globe/";
  const AUDRALIA_ROUTE = "/showroom/globe/audralia/";
  const H_EARTH_ROUTE = "/showroom/globe/h-earth/";

  const BIOME_TARGETS = Object.freeze({
    rainforest: true,
    forest: true,
    grassland: true,
    savanna: true,
    wetland: true,
    marsh: true,
    deltaLife: true,
    desert: true,
    scrub: true,
    alpine: true,
    polar: true,
    coastal: true,
    reefAdjacent: true,
    restoration: true,
    transitionZones: true,
    consumesLandmask: true,
    consumesHydrology: true,
    consumesElevation: true,
    consumesClimate: true,
    ownsSurfaceMaterial: false,
    ownsAtmosphereRendering: false
  });

  const BIOME_PROVINCES = Object.freeze([
    {
      id: "central-green-life-belt",
      label: "Central Green Life Belt",
      longitude: -36,
      latitude: 8,
      radiusLongitude: 50,
      radiusLatitude: 34,
      tilt: 10,
      forest: 0.78,
      grass: 0.42,
      wetland: 0.48,
      dryland: 0.08,
      restoration: 0.72
    },
    {
      id: "east-sunrise-life-field",
      label: "East Sunrise Life Field",
      longitude: 80,
      latitude: 6,
      radiusLongitude: 44,
      radiusLatitude: 32,
      tilt: -12,
      forest: 0.62,
      grass: 0.50,
      wetland: 0.38,
      dryland: 0.16,
      restoration: 0.64
    },
    {
      id: "west-crown-temperate-life",
      label: "West Crown Temperate Life",
      longitude: -136,
      latitude: 24,
      radiusLongitude: 42,
      radiusLatitude: 28,
      tilt: -14,
      forest: 0.56,
      grass: 0.42,
      wetland: 0.24,
      dryland: 0.24,
      restoration: 0.58
    },
    {
      id: "central-south-seasonal-life",
      label: "Central South Seasonal Life",
      longitude: -18,
      latitude: -34,
      radiusLongitude: 38,
      radiusLatitude: 24,
      tilt: 14,
      forest: 0.24,
      grass: 0.60,
      wetland: 0.20,
      dryland: 0.56,
      restoration: 0.44
    },
    {
      id: "far-east-coastal-life",
      label: "Far East Coastal Life",
      longitude: 154,
      latitude: -12,
      radiusLongitude: 34,
      radiusLatitude: 28,
      tilt: 8,
      forest: 0.48,
      grass: 0.44,
      wetland: 0.42,
      dryland: 0.18,
      restoration: 0.62
    },
    {
      id: "southern-cold-life",
      label: "Southern Cold Life",
      longitude: 24,
      latitude: -60,
      radiusLongitude: 68,
      radiusLatitude: 18,
      tilt: 2,
      forest: 0.12,
      grass: 0.24,
      wetland: 0.12,
      dryland: 0.20,
      restoration: 0.30
    },
    {
      id: "north-polar-life-hold",
      label: "North Polar Life Hold",
      longitude: 34,
      latitude: 70,
      radiusLongitude: 52,
      radiusLatitude: 16,
      tilt: -6,
      forest: 0.06,
      grass: 0.12,
      wetland: 0.08,
      dryland: 0.14,
      restoration: 0.22
    }
  ]);

  const BIOME_ROLES = Object.freeze({
    "rainforest": "dense-humid-living-zone",
    "temperate-forest": "balanced-forest-living-zone",
    "restoration-forest": "future-capable-restoration-zone",
    "wetland": "saturated-lowland-living-zone",
    "marsh": "marsh-basin-living-zone",
    "delta-life": "river-mouth-life-zone",
    "grassland": "open-green-living-zone",
    "savanna": "warm-seasonal-grass-tree-zone",
    "scrub": "dry-scrub-transition-zone",
    "desert": "arid-minimal-life-zone",
    "alpine": "highland-cold-life-zone",
    "polar": "polar-life-hold-zone",
    "coastal": "coastal-living-transition-zone",
    "reef-adjacent": "shelf-life-adjacent-zone",
    "ocean-biome": "marine-biome-field",
    "shelf-biome": "shelf-biome-field",
    "transition": "mixed-transition-living-zone"
  });

  function M() {
    return window.DGB_PLANET_FAMILY_MATH || window.AUDRALIA_CLEAN_CANVAS_MATH || null;
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

  function wrapDegrees(value) {
    const helper = M();
    if (helper?.wrapDegrees) return helper.wrapDegrees(value);
    let out = finite(value, 0);
    while (out < -180) out += 360;
    while (out > 180) out -= 360;
    return out;
  }

  function longitudeDeltaDegrees(lon, centerLon) {
    const helper = M();
    if (helper?.longitudeDeltaDegrees) return helper.longitudeDeltaDegrees(lon, centerLon);
    return wrapDegrees(finite(lon, 0) - finite(centerLon, 0));
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

  function rotatedEllipseScore(longitudeDegrees, latitudeDegrees, item, weightKey = "forest") {
    const helper = M();
    if (helper?.rotatedLonLatEllipseScore) {
      return helper.rotatedLonLatEllipseScore(longitudeDegrees, latitudeDegrees, {
        longitudeDegrees: item.longitude,
        latitudeDegrees: item.latitude,
        radiusLongitudeDegrees: item.radiusLongitude,
        radiusLatitudeDegrees: item.radiusLatitude,
        tiltDegrees: item.tilt,
        weight: item[weightKey] ?? 1
      });
    }

    const dx = longitudeDeltaDegrees(longitudeDegrees, item.longitude);
    const dy = finite(latitudeDegrees, 0) - finite(item.latitude, 0);
    const angle = finite(item.tilt, 0) * Math.PI / 180;
    const c = Math.cos(-angle);
    const s = Math.sin(-angle);
    const x = dx * c - dy * s;
    const y = dx * s + dy * c;
    const rx = Math.max(0.000001, finite(item.radiusLongitude, 1));
    const ry = Math.max(0.000001, finite(item.radiusLatitude, 1));
    const q = (x * x) / (rx * rx) + (y * y) / (ry * ry);

    return finite(item[weightKey] ?? 1, 1) * (1 - q);
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
        document.documentElement.dataset.audraliaBiomeHydrologyReadFailed = "true";
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
        document.documentElement.dataset.audraliaBiomeElevationReadFailed = "true";
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
        document.documentElement.dataset.audraliaBiomeClimateReadFailed = "true";
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

  function biomeProvinceInfluence(mask) {
    let totalWeight = 0;
    let forest = 0;
    let grass = 0;
    let wetland = 0;
    let dryland = 0;
    let restoration = 0;

    let best = Object.freeze({
      id: "",
      label: "",
      score: 0
    });

    for (const province of BIOME_PROVINCES) {
      const raw = rotatedEllipseScore(mask.longitudeDegrees, mask.latitudeDegrees, province, "forest");
      const score = smoothstep(-0.62, 0.88, raw);

      if (score > best.score) {
        best = Object.freeze({
          id: province.id,
          label: province.label,
          score
        });
      }

      const w = Math.max(0, score);
      totalWeight += w;
      forest += province.forest * w;
      grass += province.grass * w;
      wetland += province.wetland * w;
      dryland += province.dryland * w;
      restoration += province.restoration * w;
    }

    const denom = Math.max(0.000001, totalWeight);

    return Object.freeze({
      best,
      forest: clamp01(forest / denom),
      grass: clamp01(grass / denom),
      wetland: clamp01(wetland / denom),
      dryland: clamp01(dryland / denom),
      restoration: clamp01(restoration / denom),
      weight: clamp01(totalWeight / BIOME_PROVINCES.length)
    });
  }

  function summitLifePressure(mask) {
    const source = [
      mask.primarySummit,
      mask.secondarySummit,
      mask.internalSummit
    ].join(" ").toLowerCase();

    let forest = 0;
    let grass = 0;
    let wetland = 0;
    let restoration = 0;
    let resilience = 0;

    if (source.includes("gratitude")) {
      forest += 0.04;
      restoration += 0.08;
    }

    if (source.includes("peace")) {
      wetland += 0.08;
      restoration += 0.06;
      resilience += 0.04;
    }

    if (source.includes("joy")) {
      grass += 0.06;
      forest += 0.04;
    }

    if (source.includes("love")) {
      forest += 0.06;
      wetland += 0.04;
      restoration += 0.08;
    }

    if (source.includes("stewardship")) {
      restoration += 0.12;
      forest += 0.05;
      resilience += 0.08;
    }

    if (source.includes("balance")) {
      grass += 0.04;
      resilience += 0.06;
    }

    if (source.includes("stability")) {
      resilience += 0.10;
      grass += 0.02;
    }

    if (source.includes("dignity")) {
      resilience += 0.08;
    }

    if (source.includes("free")) {
      grass += 0.05;
      restoration += 0.04;
    }

    return Object.freeze({
      forest,
      grass,
      wetland,
      restoration,
      resilience
    });
  }

  function computeBiome(mask, hydro, elevation, climate) {
    const u = wrap01(mask.u);
    const v = clamp01(mask.v);
    const province = biomeProvinceInfluence(mask);
    const summit = summitLifePressure(mask);

    const lifeMemory = fbm2(u * 0.88 + 0.19, v * 0.76 - 0.12, { seed: 13001, scale: 2.6, octaves: 5 });
    const canopyField = fbm2(u * 3.6 - 0.22, v * 2.9 + 0.17, { seed: 13002, scale: 4.8, octaves: 4 });
    const grassField = fbm2(u * 4.2 + 0.31, v * 3.6 - 0.28, { seed: 13003, scale: 5.2, octaves: 4 });
    const scrubField = ridgeNoise2(u * 5.8 - 0.18, v * 4.8 + 0.26, { seed: 13004, scale: 6.2, octaves: 4 });
    const transitionField = fbm2(u * 8.8 + 0.42, v * 7.2 - 0.36, { seed: 13005, scale: 8.0, octaves: 3 });

    const heat = clamp01(climate.heat ?? climate.temperature ?? climate.warmth);
    const cold = clamp01(climate.cold);
    const moisture = clamp01(climate.moisture ?? climate.humidity);
    const rainfall = clamp01(climate.rainfall ?? climate.precipitation);
    const aridity = clamp01(climate.aridity ?? climate.dryness);
    const frost = clamp01(climate.frostPressure);
    const drought = clamp01(climate.droughtPressure);
    const seasonal = clamp01(climate.seasonalPressure);

    const elevation01 = clamp01(elevation.elevation01 ?? elevation.height ?? elevation.aboveSea);
    const mountain = clamp01(elevation.mountain);
    const basin = clamp01(elevation.basin);
    const valley = clamp01(elevation.valley);
    const plateau = clamp01(elevation.plateau);
    const coastalRise = clamp01(elevation.coastalRise);
    const snowline = clamp01(elevation.snowline);

    const hydroWet = clamp01(
      hydro.wetland * 0.24 +
      hydro.marsh * 0.22 +
      hydro.delta * 0.18 +
      hydro.estuary * 0.14 +
      hydro.river * 0.10 +
      hydro.lake * 0.10 +
      hydro.inlandSea * 0.08
    );

    const coastalLife = clamp01(
      mask.coastProximity * 0.24 +
      hydro.coastalShelfWater * 0.16 +
      hydro.lagoon * 0.14 +
      hydro.bay * 0.10 +
      hydro.inlet * 0.10 +
      coastalRise * 0.08
    );

    const marineLife = clamp01(
      (mask.isOcean ? 0.28 : 0) +
      (mask.isShelf ? 0.44 : 0) +
      hydro.coastalShelfWater * 0.22 +
      coastalLife * 0.14 -
      clamp01(elevation.belowSeaDepth) * 0.08
    );

    const forestPressure = clamp01(
      province.forest * 0.24 +
      moisture * 0.26 +
      rainfall * 0.18 +
      canopyField * 0.14 +
      lifeMemory * 0.08 +
      summit.forest -
      aridity * 0.20 -
      frost * 0.12 -
      mountain * 0.08
    );

    const rainforestPressure = clamp01(
      forestPressure * 0.34 +
      heat * 0.24 +
      moisture * 0.24 +
      rainfall * 0.20 +
      province.forest * 0.10 -
      aridity * 0.18 -
      cold * 0.16
    );

    const wetlandPressure = clamp01(
      province.wetland * 0.22 +
      hydroWet * 0.34 +
      moisture * 0.20 +
      basin * 0.10 +
      valley * 0.08 +
      summit.wetland -
      aridity * 0.14
    );

    const grassPressure = clamp01(
      province.grass * 0.24 +
      grassField * 0.18 +
      seasonal * 0.14 +
      heat * 0.10 +
      summit.grass +
      plateau * 0.08 -
      forestPressure * 0.12 -
      aridity * 0.04
    );

    const savannaPressure = clamp01(
      grassPressure * 0.32 +
      heat * 0.18 +
      seasonal * 0.16 +
      aridity * 0.14 +
      moisture * 0.08 -
      rainforestPressure * 0.16 -
      cold * 0.12
    );

    const drylandPressure = clamp01(
      province.dryland * 0.24 +
      aridity * 0.32 +
      drought * 0.20 +
      scrubField * 0.14 -
      moisture * 0.16 -
      rainfall * 0.10
    );

    const scrubPressure = clamp01(
      drylandPressure * 0.30 +
      scrubField * 0.22 +
      grassPressure * 0.10 +
      seasonal * 0.10 -
      rainforestPressure * 0.12
    );

    const desertPressure = clamp01(
      drylandPressure * 0.34 +
      aridity * 0.26 +
      drought * 0.22 -
      moisture * 0.18 -
      hydroWet * 0.16
    );

    const alpinePressure = clamp01(
      mountain * 0.28 +
      elevation01 * 0.18 +
      cold * 0.24 +
      snowline * 0.18 +
      frost * 0.14 -
      heat * 0.12
    );

    const polarPressure = clamp01(
      frost * 0.32 +
      cold * 0.30 +
      snowline * 0.20 +
      (mask.isPolarIce ? 0.30 : 0) -
      heat * 0.18
    );

    const restorationPressure = clamp01(
      province.restoration * 0.24 +
      summit.restoration +
      summit.resilience +
      lifeMemory * 0.14 +
      moisture * 0.10 +
      clamp01(1 - Math.max(desertPressure, polarPressure)) * 0.12
    );

    const transitionPressure = clamp01(
      transitionField * 0.20 +
      Math.abs(forestPressure - grassPressure) * 0.12 +
      Math.abs(grassPressure - drylandPressure) * 0.12 +
      seasonal * 0.12 +
      coastalLife * 0.08
    );

    const lifeDensity = clamp01(
      forestPressure * 0.22 +
      rainforestPressure * 0.20 +
      wetlandPressure * 0.16 +
      grassPressure * 0.12 +
      restorationPressure * 0.12 +
      marineLife * 0.12 -
      desertPressure * 0.10 -
      polarPressure * 0.10
    );

    return Object.freeze({
      province,
      summit,
      lifeMemory,
      canopyField,
      grassField,
      scrubField,
      transitionField,
      forestPressure,
      rainforestPressure,
      wetlandPressure,
      grassPressure,
      savannaPressure,
      drylandPressure,
      scrubPressure,
      desertPressure,
      alpinePressure,
      polarPressure,
      coastalLife,
      marineLife,
      restorationPressure,
      transitionPressure,
      lifeDensity
    });
  }

  function classifyBiome(mask, hydro, elevation, climate, fields) {
    if (mask.isOcean) {
      if (fields.marineLife > 0.58 && hydro.coastalShelfWater > 0.44) return ["reef-adjacent", "marine", "shelf-adjacent-life"];
      return ["ocean-biome", "marine", "open-ocean-life-field"];
    }

    if (mask.isShelf) {
      if (fields.marineLife > 0.58) return ["reef-adjacent", "marine", "living-shelf-edge"];
      return ["shelf-biome", "marine", "shelf-life-field"];
    }

    if (mask.isBeach) {
      if (fields.wetlandPressure > 0.54 || hydro.delta > 0.54) return ["delta-life", "coastal", "river-mouth-coastal-life"];
      return ["coastal", "coastal", "beach-and-coastal-transition"];
    }

    if (fields.polarPressure > 0.66 || mask.isPolarIce) return ["polar", "polar", "polar-life-hold"];
    if (fields.alpinePressure > 0.64) return ["alpine", "alpine", "highland-cold-life"];
    if (fields.rainforestPressure > 0.68) return ["rainforest", "humid-forest", "dense-humid-canopy"];
    if (fields.wetlandPressure > 0.66 && hydro.marsh > 0.58) return ["marsh", "wetland", "marsh-basin-life"];
    if (fields.wetlandPressure > 0.62 && hydro.delta > 0.54) return ["delta-life", "wetland", "river-mouth-life"];
    if (fields.wetlandPressure > 0.60) return ["wetland", "wetland", "saturated-lowland-life"];
    if (fields.desertPressure > 0.68) return ["desert", "arid", "minimal-arid-life"];
    if (fields.scrubPressure > 0.62 || fields.drylandPressure > 0.62) return ["scrub", "dry-transition", "dry-scrub-life"];
    if (fields.savannaPressure > 0.62) return ["savanna", "seasonal-grass", "warm-seasonal-grass-tree-life"];
    if (fields.forestPressure > 0.60 && fields.restorationPressure > 0.58) return ["restoration-forest", "forest", "future-capable-restoration-forest"];
    if (fields.forestPressure > 0.58) return ["temperate-forest", "forest", "balanced-forest-life"];
    if (fields.grassPressure > 0.54) return ["grassland", "grassland", "open-green-life"];
    if (fields.restorationPressure > 0.58) return ["restoration-forest", "restoration", "future-capable-restoration-zone"];
    if (fields.transitionPressure > 0.50) return ["transition", "mixed", "mixed-transition-life"];

    return ["grassland", "grassland", "low-density-open-life"];
  }

  function sampleBiome(input, vMaybe) {
    const mask = sampleLandmaskFromInput(input, vMaybe);
    const hydro = sampleHydrologyForMask(mask);
    const elevation = sampleElevationForMask(mask);
    const climate = sampleClimateForMask(mask);
    const fields = computeBiome(mask, hydro, elevation, climate);
    const classification = classifyBiome(mask, hydro, elevation, climate, fields);
    const biomeClass = classification[0];
    const zone = classification[1];
    const form = classification[2];

    return Object.freeze({
      allowed: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-living-world-categories",
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

      class: biomeClass,
      zone,
      form,
      biomeClass,
      biomeZone: zone,
      biomeForm: form,
      biomeRole: BIOME_ROLES[biomeClass] || "living-category-field",

      lifeDensity: fields.lifeDensity,
      forestPressure: fields.forestPressure,
      rainforestPressure: fields.rainforestPressure,
      wetlandPressure: fields.wetlandPressure,
      grassPressure: fields.grassPressure,
      savannaPressure: fields.savannaPressure,
      drylandPressure: fields.drylandPressure,
      scrubPressure: fields.scrubPressure,
      desertPressure: fields.desertPressure,
      alpinePressure: fields.alpinePressure,
      polarPressure: fields.polarPressure,
      coastalLife: fields.coastalLife,
      marineLife: fields.marineLife,
      restorationPressure: fields.restorationPressure,
      transitionPressure: fields.transitionPressure,

      biomeProvinceId: fields.province.best.id,
      biomeProvinceLabel: fields.province.best.label,
      provinceInfluence: fields.province.weight,

      canopyPotential: clamp01(fields.canopyField * 0.38 + fields.forestPressure * 0.34 + fields.rainforestPressure * 0.20),
      rootDensity: clamp01(fields.lifeDensity * 0.42 + fields.restorationPressure * 0.18 + fields.wetlandPressure * 0.12),
      groundcoverPotential: clamp01(fields.grassPressure * 0.28 + fields.savannaPressure * 0.20 + fields.scrubPressure * 0.16 + fields.lifeDensity * 0.18),
      biologicalResilience: clamp01(fields.restorationPressure * 0.34 + fields.lifeDensity * 0.22 + fields.summit.resilience + clamp01(1 - climate.droughtPressure) * 0.10),

      visualGuidance: Object.freeze({
        shouldSupportCanopy: fields.forestPressure > 0.50 || fields.rainforestPressure > 0.56,
        shouldSupportDenseGreen: fields.rainforestPressure > 0.58 || fields.restorationPressure > 0.62,
        shouldSupportWetlandVegetation: fields.wetlandPressure > 0.54,
        shouldSupportGrassTexture: fields.grassPressure > 0.48 || fields.savannaPressure > 0.50,
        shouldSupportDryScrub: fields.scrubPressure > 0.52 || fields.desertPressure > 0.58,
        shouldSupportAlpineMaterial: fields.alpinePressure > 0.54,
        shouldSupportPolarMaterial: fields.polarPressure > 0.54,
        shouldSupportCoastalLife: fields.coastalLife > 0.44,
        shouldSupportMarineShelfLife: fields.marineLife > 0.50,
        shouldSupportRestorationGlow: fields.restorationPressure > 0.60,
        shouldSupportTransitionBlend: fields.transitionPressure > 0.48
      }),

      sourceReads: Object.freeze({
        landmask: Boolean(mask.landmaskOwnsFootprint || mask.ownsFootprint || mask.footprintClass),
        hydrology: Boolean(hydro.contract === "AUDRALIA_CLEAN_CANVAS_HYDROLOGY_TNT_v1"),
        elevation: Boolean(elevation.contract === "AUDRALIA_CLEAN_CANVAS_ELEVATION_TNT_v1"),
        climate: Boolean(climate.contract === "AUDRALIA_CLEAN_CANVAS_CLIMATE_TNT_v1"),
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
      ownsBiome: true,
      ownsLivingCategories: true,
      ownsSurface: false,
      ownsSurfaceMaterial: false,
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
    return sampleBiome(input, vMaybe);
  }

  function classify(input, vMaybe) {
    return sampleBiome(input, vMaybe).class;
  }

  function estimateBiome(width = 72, height = 36) {
    const w = clamp(Math.floor(finite(width, 72)), 16, 256);
    const h = clamp(Math.floor(finite(height, 36)), 8, 128);

    const counts = {
      rainforest: 0,
      forest: 0,
      wetland: 0,
      grassland: 0,
      dryland: 0,
      alpinePolar: 0,
      coastalMarine: 0,
      restoration: 0,
      transition: 0,
      total: 0
    };

    for (let y = 0; y < h; y += 1) {
      const v = (y + 0.5) / h;

      for (let x = 0; x < w; x += 1) {
        const u = (x + 0.5) / w;
        const biome = sampleBiome(u, v);

        counts.total += 1;

        if (biome.class === "rainforest") counts.rainforest += 1;
        if (biome.class === "temperate-forest" || biome.class === "restoration-forest") counts.forest += 1;
        if (biome.class === "wetland" || biome.class === "marsh" || biome.class === "delta-life") counts.wetland += 1;
        if (biome.class === "grassland" || biome.class === "savanna") counts.grassland += 1;
        if (biome.class === "scrub" || biome.class === "desert") counts.dryland += 1;
        if (biome.class === "alpine" || biome.class === "polar") counts.alpinePolar += 1;
        if (biome.zone === "coastal" || biome.zone === "marine") counts.coastalMarine += 1;
        if (biome.restorationPressure > 0.60) counts.restoration += 1;
        if (biome.transitionPressure > 0.50) counts.transition += 1;
      }
    }

    const denominator = Math.max(1, counts.total);

    return Object.freeze({
      samples: counts.total,
      rainforestRatio: Number((counts.rainforest / denominator).toFixed(4)),
      forestRatio: Number((counts.forest / denominator).toFixed(4)),
      wetlandRatio: Number((counts.wetland / denominator).toFixed(4)),
      grasslandRatio: Number((counts.grassland / denominator).toFixed(4)),
      drylandRatio: Number((counts.dryland / denominator).toFixed(4)),
      alpinePolarRatio: Number((counts.alpinePolar / denominator).toFixed(4)),
      coastalMarineRatio: Number((counts.coastalMarine / denominator).toFixed(4)),
      restorationSignalRatio: Number((counts.restoration / denominator).toFixed(4)),
      transitionSignalRatio: Number((counts.transition / denominator).toFixed(4))
    });
  }

  function getBiomeProvinces() {
    return Object.freeze(BIOME_PROVINCES.map((province) => Object.freeze({ ...province })));
  }

  function getBiomeRoles() {
    const out = {};
    Object.keys(BIOME_ROLES).forEach((key) => {
      out[key] = BIOME_ROLES[key];
    });
    return Object.freeze(out);
  }

  function validateManifestRegistration() {
    try {
      const manifest = window.DGB_PLANET_FAMILY_MANIFEST || window.AUDRALIA_CLEAN_CANVAS_MANIFEST;
      if (!manifest || typeof manifest.validatePrimaryFile !== "function") {
        return Object.freeze({
          manifestAvailable: false,
          valid: true,
          reason: "manifest_not_loaded_yet_biome_can_still_register"
        });
      }

      return manifest.validatePrimaryFile({
        path: "/assets/audralia/clean/audralia.biome.js",
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
    const landmask = LM();
    const hydrology = H();
    const elevation = E();
    const climate = C();

    return Object.freeze({
      math: Object.freeze({
        available: Boolean(math),
        expectedContract: "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_MATH_TNT_v1",
        actualContract: math?.contract || null,
        valid: !math || math.contract === "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_MATH_TNT_v1"
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
      })
    });
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-living-world-categories",
      fileNumber: FILE_NUMBER,
      primaryNode: PRIMARY_NODE,
      subnodes: SUBNODE_RANGE,
      parentAnchor: "/showroom/globe/audralia/index.html",
      universalParent: UNIVERSAL_ANCHOR,
      downstreamGroundView: H_EARTH_ROUTE,
      targets: BIOME_TARGETS,
      biomeProvinces: BIOME_PROVINCES.length,
      biomeRoles: Object.keys(BIOME_ROLES).length,
      biomeEstimate: estimateBiome(56, 28),
      owns: Object.freeze([
        "biome categories",
        "living-world categories",
        "rainforest",
        "forest",
        "grassland",
        "savanna",
        "wetland",
        "marsh",
        "delta-life",
        "desert",
        "scrub",
        "alpine",
        "polar",
        "coastal",
        "reef-adjacent",
        "restoration",
        "transition zones",
        "life-density signals"
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
        "surface material synthesis",
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
      hEarthReceivesBiomeThroughAudralia: true,
      footprintCreationForbidden: true,
      waterBehaviorCreationForbidden: true,
      elevationCreationForbidden: true,
      climateCreationForbidden: true,
      surfaceMaterialSynthesisForbidden: true,
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
    BIOME_TARGETS,
    BIOME_ROLES,

    sampleBiome,
    sample,
    classify,
    estimateBiome,
    getBiomeProvinces,
    getBiomeRoles,
    validateManifestRegistration,
    validatePriorAuthorities,
    getStatus
  });

  window.AUDRALIA_BIOME = API;
  window.AUDRALIA_BIOME_RECEIPT = getStatus();

  window.AUDRALIA_CLEAN_CANVAS_BIOME = API;
  window.AUDRALIA_CLEAN_CANVAS_BIOME_RECEIPT = getStatus();

  if (document?.documentElement?.dataset) {
    document.documentElement.dataset.audraliaBiomeLoaded = "true";
    document.documentElement.dataset.audraliaBiomeContract = CONTRACT;
    document.documentElement.dataset.audraliaBiomeReceipt = RECEIPT;
    document.documentElement.dataset.audraliaBiomeVersion = VERSION;
    document.documentElement.dataset.audraliaCleanCanvasBiomeLoaded = "true";
    document.documentElement.dataset.audraliaCleanCanvasBiomeContract = CONTRACT;
    document.documentElement.dataset.audraliaCleanCanvasBiomeReceipt = RECEIPT;
    document.documentElement.dataset.audraliaCleanCanvasBiomeNode = String(PRIMARY_NODE);
    document.documentElement.dataset.audraliaCleanCanvasBiomeSubnodes = "145-160";
    document.documentElement.dataset.audraliaBiomeOwnsLivingCategories = "true";
    document.documentElement.dataset.audraliaBiomeOwnsFootprint = "false";
    document.documentElement.dataset.audraliaBiomeOwnsHydrology = "false";
    document.documentElement.dataset.audraliaBiomeOwnsElevation = "false";
    document.documentElement.dataset.audraliaBiomeOwnsClimate = "false";
    document.documentElement.dataset.audraliaBiomeOwnsSurface = "false";
    document.documentElement.dataset.audraliaBiomeOwnsAtmosphere = "false";
    document.documentElement.dataset.audraliaBiomeRainforest = "true";
    document.documentElement.dataset.audraliaBiomeForest = "true";
    document.documentElement.dataset.audraliaBiomeWetland = "true";
    document.documentElement.dataset.audraliaBiomeGrassland = "true";
    document.documentElement.dataset.audraliaBiomeSavanna = "true";
    document.documentElement.dataset.audraliaBiomeDryland = "true";
    document.documentElement.dataset.audraliaBiomeAlpinePolar = "true";
    document.documentElement.dataset.audraliaBiomeCoastalMarine = "true";
    document.documentElement.dataset.hEarthReceivesAudraliaBiome = "true";
    document.documentElement.dataset.audraliaCleanCanvasFibonacciChronology = "true";
    document.documentElement.dataset.audraliaCleanCanvasPrimaryStructure16 = "true";
    document.documentElement.dataset.audraliaCleanCanvasNodalConstruct256 = "true";
    document.documentElement.dataset.audraliaCleanCanvasOneFileOneJob = "true";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }
})();

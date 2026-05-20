// /assets/audralia/clean/audralia.atmosphere.js
// AUDRALIA_CLEAN_CANVAS_ATMOSPHERE_TNT_v1
// Full-file replacement.
// File 12 of 16.
// Planet Audralia atmosphere / weather inheritance authority.
// Purpose:
// - Establishes Audralia-specific atmosphere and weather-condition authority.
// - Defines haze, cloud veil, storm pressure, rain veil, snow veil, dust veil, humidity haze, rim light, terminator softness, sky tint, and downstream weather inheritance.
// - Consumes Audralia surface, biome, climate, elevation, hydrology, landmask, and universal palette/math when available.
// - Provides planet-level condition truth for H-Earth / Hybrid Earth downstream ground-view expression.
// - Does not create land/ocean footprint.
// - Does not create water behavior.
// - Does not create elevation.
// - Does not create climate fields.
// - Does not create biome categories.
// - Does not synthesize surface material.
// - Does not render canvas.
// - Does not own runtime, controls, route bridge, or HTML shell.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_CLEAN_CANVAS_ATMOSPHERE_TNT_v1";
  const RECEIPT = "AUDRALIA_CLEAN_CANVAS_ATMOSPHERE_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_CLEAN_CANVAS_SURFACE_TNT_v1";
  const VERSION = "2026-05-20.audralia-clean-canvas-atmosphere-v1";

  const FILE_NUMBER = 12;
  const PRIMARY_NODE = 12;
  const SUBNODE_RANGE = Object.freeze([177, 192]);

  const UNIVERSAL_ANCHOR = "/showroom/globe/";
  const AUDRALIA_ROUTE = "/showroom/globe/audralia/";
  const H_EARTH_ROUTE = "/showroom/globe/h-earth/";

  const ATMOSPHERE_TARGETS = Object.freeze({
    haze: true,
    cloudVeil: true,
    stormPressure: true,
    rainVeil: true,
    snowVeil: true,
    dustVeil: true,
    humidityHaze: true,
    rimLight: true,
    terminatorSoftness: true,
    skyTint: true,
    downstreamWeatherInheritance: true,
    consumesLandmask: true,
    consumesHydrology: true,
    consumesElevation: true,
    consumesClimate: true,
    consumesBiome: true,
    consumesSurface: true,
    ownsCanvas: false,
    ownsRuntime: false
  });

  const ATMOSPHERE_LIMITS = Object.freeze({
    maxGlobalVeilOpacity: 0.34,
    maxCloudOpacity: 0.42,
    maxStormOpacity: 0.38,
    maxHazeOpacity: 0.28,
    maxRimOpacity: 0.46,
    surfaceTruthMustRemainVisible: true,
    atmosphereAfterSurfaceOnly: true,
    hEarthInheritanceDefault: true
  });

  const WEATHER_PROVINCES = Object.freeze([
    {
      id: "central-rain-veil",
      label: "Central Rain Veil",
      longitude: -36,
      latitude: 8,
      radiusLongitude: 52,
      radiusLatitude: 34,
      tilt: 10,
      cloud: 0.72,
      storm: 0.44,
      rain: 0.70,
      haze: 0.44,
      dust: 0.06
    },
    {
      id: "east-sunrise-monsoon-veil",
      label: "East Sunrise Monsoon Veil",
      longitude: 78,
      latitude: 6,
      radiusLongitude: 46,
      radiusLatitude: 34,
      tilt: -12,
      cloud: 0.68,
      storm: 0.54,
      rain: 0.72,
      haze: 0.40,
      dust: 0.08
    },
    {
      id: "west-crown-temperate-sky",
      label: "West Crown Temperate Sky",
      longitude: -136,
      latitude: 24,
      radiusLongitude: 42,
      radiusLatitude: 28,
      tilt: -14,
      cloud: 0.44,
      storm: 0.30,
      rain: 0.42,
      haze: 0.34,
      dust: 0.16
    },
    {
      id: "central-south-dry-veil",
      label: "Central South Dry Veil",
      longitude: -18,
      latitude: -34,
      radiusLongitude: 38,
      radiusLatitude: 24,
      tilt: 14,
      cloud: 0.24,
      storm: 0.22,
      rain: 0.24,
      haze: 0.28,
      dust: 0.54
    },
    {
      id: "far-east-coastal-stormline",
      label: "Far East Coastal Stormline",
      longitude: 154,
      latitude: -12,
      radiusLongitude: 36,
      radiusLatitude: 28,
      tilt: 8,
      cloud: 0.58,
      storm: 0.62,
      rain: 0.54,
      haze: 0.38,
      dust: 0.10
    },
    {
      id: "southern-cold-cloudbelt",
      label: "Southern Cold Cloudbelt",
      longitude: 24,
      latitude: -60,
      radiusLongitude: 70,
      radiusLatitude: 18,
      tilt: 2,
      cloud: 0.56,
      storm: 0.34,
      rain: 0.28,
      haze: 0.32,
      dust: 0.06
    },
    {
      id: "north-polar-ice-haze",
      label: "North Polar Ice Haze",
      longitude: 34,
      latitude: 70,
      radiusLongitude: 54,
      radiusLatitude: 16,
      tilt: -6,
      cloud: 0.42,
      storm: 0.18,
      rain: 0.10,
      haze: 0.58,
      dust: 0.04
    }
  ]);

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

  function S() {
    return window.AUDRALIA_SURFACE || window.AUDRALIA_CLEAN_CANVAS_SURFACE || null;
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

  function rotatedEllipseScore(longitudeDegrees, latitudeDegrees, item, weightKey = "cloud") {
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

  function rgba(color, alpha = 1) {
    const c = rgb(color);
    return `rgba(${c[0]},${c[1]},${c[2]},${clamp01(alpha)})`;
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
        document.documentElement.dataset.audraliaAtmosphereHydrologyReadFailed = "true";
      }
    }

    return Object.freeze({
      class: "hydrology-background",
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
        document.documentElement.dataset.audraliaAtmosphereElevationReadFailed = "true";
      }
    }

    return Object.freeze({
      class: mask.isOcean ? "sea-floor" : mask.isShelf ? "shelf-depth" : mask.isBeach ? "beach-rise" : "plain",
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
        document.documentElement.dataset.audraliaAtmosphereClimateReadFailed = "true";
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
        document.documentElement.dataset.audraliaAtmosphereBiomeReadFailed = "true";
      }
    }

    return Object.freeze({
      class: mask.isOcean ? "ocean-biome" : mask.isShelf ? "shelf-biome" : mask.isPolarIce ? "polar" : mask.isCoastal ? "coastal" : "grassland",
      zone: mask.isOcean || mask.isShelf ? "marine" : mask.isPolarIce ? "polar" : mask.isCoastal ? "coastal" : "grassland",
      lifeDensity: mask.isOcean ? 0.22 : mask.isShelf ? 0.30 : mask.isPolarIce ? 0.10 : 0.46,
      marineLife: mask.isShelf ? 0.58 : mask.isOcean ? 0.44 : 0,
      coastalLife: mask.isCoastal ? 0.44 : 0.12,
      forestPressure: 0.26,
      rainforestPressure: 0.12,
      wetlandPressure: mask.isCoastal ? 0.24 : 0.12,
      grassPressure: 0.42,
      desertPressure: 0.10,
      alpinePressure: mask.isPolarIce ? 0.38 : 0.10,
      polarPressure: mask.isPolarIce ? 0.68 : 0.06,
      restorationPressure: 0.34,
      transitionPressure: 0.28
    });
  }

  function sampleSurfaceForMask(mask) {
    const surface = S();

    try {
      if (surface?.sampleSurface) return surface.sampleSurface(mask);
      if (surface?.sample) return surface.sample(mask);
    } catch {
      if (document?.documentElement?.dataset) {
        document.documentElement.dataset.audraliaAtmosphereSurfaceReadFailed = "true";
      }
    }

    const base = mask.isOcean
      ? colorFromPalette("ocean.deep", [4, 28, 76])
      : mask.isShelf
        ? colorFromPalette("shelf.inner", [58, 166, 172])
        : mask.isBeach
          ? colorFromPalette("coast.beach", [222, 198, 126])
          : colorFromPalette("land.lowland", [108, 154, 80]);

    return Object.freeze({
      class: mask.isOcean ? "ocean-material" : mask.isShelf ? "shelf-material" : mask.isBeach ? "beach-material" : "mixed-land-material",
      color: base,
      rgb: base,
      materialColor: base,
      visualGuidance: Object.freeze({
        shouldPaint: true,
        shouldStayBelowAtmosphere: true
      })
    });
  }

  function weatherProvinceInfluence(mask) {
    let totalWeight = 0;
    let cloud = 0;
    let storm = 0;
    let rain = 0;
    let haze = 0;
    let dust = 0;

    let best = Object.freeze({
      id: "",
      label: "",
      score: 0
    });

    for (const province of WEATHER_PROVINCES) {
      const raw = rotatedEllipseScore(mask.longitudeDegrees, mask.latitudeDegrees, province, "cloud");
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
      cloud += province.cloud * w;
      storm += province.storm * w;
      rain += province.rain * w;
      haze += province.haze * w;
      dust += province.dust * w;
    }

    const denom = Math.max(0.000001, totalWeight);

    return Object.freeze({
      best,
      cloud: clamp01(cloud / denom),
      storm: clamp01(storm / denom),
      rain: clamp01(rain / denom),
      haze: clamp01(haze / denom),
      dust: clamp01(dust / denom),
      weight: clamp01(totalWeight / WEATHER_PROVINCES.length)
    });
  }

  function summitAtmospherePressure(mask) {
    const source = [
      mask.primarySummit,
      mask.secondarySummit,
      mask.internalSummit
    ].join(" ").toLowerCase();

    let clarity = 0;
    let cloud = 0;
    let rain = 0;
    let calm = 0;
    let motion = 0;

    if (source.includes("peace")) {
      clarity += 0.08;
      calm += 0.10;
    }

    if (source.includes("joy")) {
      cloud += 0.04;
      motion += 0.06;
    }

    if (source.includes("gratitude")) {
      rain += 0.04;
      clarity += 0.04;
    }

    if (source.includes("love")) {
      cloud += 0.05;
      rain += 0.04;
    }

    if (source.includes("stewardship")) {
      rain += 0.06;
      clarity += 0.04;
    }

    if (source.includes("balance")) {
      calm += 0.06;
      clarity += 0.04;
    }

    if (source.includes("stability")) {
      calm += 0.10;
    }

    if (source.includes("free")) {
      motion += 0.08;
    }

    if (source.includes("dignity")) {
      clarity += 0.06;
    }

    return Object.freeze({
      clarity,
      cloud,
      rain,
      calm,
      motion
    });
  }

  function computeAtmosphere(mask, hydro, elevation, climate, biome, surface) {
    const u = wrap01(mask.u);
    const v = clamp01(mask.v);
    const province = weatherProvinceInfluence(mask);
    const summit = summitAtmospherePressure(mask);

    const cloudMemory = fbm2(u * 0.84 + 0.19, v * 0.70 - 0.16, { seed: 15001, scale: 2.4, octaves: 5 });
    const veilField = fbm2(u * 2.2 - 0.28, v * 1.7 + 0.24, { seed: 15002, scale: 3.6, octaves: 5 });
    const stormLine = ridgeNoise2(u * 3.8 + 0.17, v * 3.1 - 0.22, { seed: 15003, scale: 5.2, octaves: 4 });
    const windVeil = ridgeNoise2(u * 5.2 - 0.31, v * 4.4 + 0.18, { seed: 15004, scale: 6.4, octaves: 4 });
    const highCloud = fbm2(u * 8.0 + 0.42, v * 6.8 - 0.38, { seed: 15005, scale: 8.0, octaves: 3 });

    const heat = clamp01(climate.heat ?? climate.temperature ?? climate.warmth);
    const cold = clamp01(climate.cold);
    const moisture = clamp01(climate.moisture ?? climate.humidity);
    const rainfall = clamp01(climate.rainfall ?? climate.precipitation);
    const humidity = clamp01(climate.humidity ?? climate.moisture);
    const aridity = clamp01(climate.aridity ?? climate.dryness);
    const windPressure = clamp01(climate.windPressure);
    const frostPressure = clamp01(climate.frostPressure);
    const droughtPressure = clamp01(climate.droughtPressure);

    const waterLift = clamp01(
      (mask.isOcean ? 0.20 : 0) +
      (mask.isShelf ? 0.24 : 0) +
      hydro.coastalShelfWater * 0.16 +
      hydro.lake * 0.08 +
      hydro.inlandSea * 0.08 +
      hydro.wetland * 0.10 +
      hydro.marsh * 0.10 +
      hydro.river * 0.06
    );

    const terrainLift = clamp01(
      elevation.mountain * 0.14 +
      elevation.ridge * 0.08 +
      elevation.coastalRise * 0.08 +
      elevation.slope * 0.06
    );

    const biomeMoisture = clamp01(
      biome.lifeDensity * 0.10 +
      biome.forestPressure * 0.10 +
      biome.rainforestPressure * 0.12 +
      biome.wetlandPressure * 0.12 +
      biome.coastalLife * 0.08 +
      biome.marineLife * 0.08
    );

    const cloudCover = clamp01(
      province.cloud * 0.22 +
      cloudMemory * 0.18 +
      highCloud * 0.16 +
      humidity * 0.18 +
      rainfall * 0.12 +
      waterLift * 0.10 +
      biomeMoisture +
      summit.cloud -
      aridity * 0.12 -
      summit.clarity * 0.10
    );

    const stormPressure = clamp01(
      province.storm * 0.24 +
      stormLine * 0.22 +
      windPressure * 0.16 +
      rainfall * 0.14 +
      heat * cold * 0.20 +
      waterLift * 0.08 +
      summit.motion * 0.08 -
      summit.calm * 0.16
    );

    const rainVeil = clamp01(
      province.rain * 0.22 +
      rainfall * 0.26 +
      cloudCover * 0.18 +
      hydro.rainfallSupply * 0.10 +
      moisture * 0.12 +
      summit.rain -
      cold * 0.06 -
      aridity * 0.12
    );

    const snowVeil = clamp01(
      frostPressure * 0.28 +
      cold * 0.22 +
      elevation.snowline * 0.22 +
      (mask.isPolarIce ? 0.24 : 0) +
      cloudCover * 0.08 -
      heat * 0.12
    );

    const dustVeil = clamp01(
      province.dust * 0.24 +
      aridity * 0.26 +
      droughtPressure * 0.18 +
      windVeil * 0.12 +
      biome.desertPressure * 0.10 +
      biome.scrubPressure * 0.06 -
      moisture * 0.16 -
      rainVeil * 0.18
    );

    const humidityHaze = clamp01(
      province.haze * 0.18 +
      hazeSource(mask, hydro, climate, biome) * 0.30 +
      humidity * 0.20 +
      waterLift * 0.12 +
      veilField * 0.10 +
      summit.clarity * -0.10
    );

    const skyTintStrength = clamp01(
      humidityHaze * 0.22 +
      cloudCover * 0.16 +
      dustVeil * 0.14 +
      snowVeil * 0.10 +
      clamp01(1 - surfaceTruthContrast(surface)) * 0.08
    );

    const cloudOpacity = clamp(cloudCover * 0.30 + stormPressure * 0.08, 0, ATMOSPHERE_LIMITS.maxCloudOpacity);
    const stormOpacity = clamp(stormPressure * 0.30, 0, ATMOSPHERE_LIMITS.maxStormOpacity);
    const hazeOpacity = clamp(humidityHaze * 0.22 + dustVeil * 0.10 + snowVeil * 0.08, 0, ATMOSPHERE_LIMITS.maxHazeOpacity);
    const rainOpacity = clamp(rainVeil * 0.24, 0, 0.30);
    const snowOpacity = clamp(snowVeil * 0.26, 0, 0.32);
    const dustOpacity = clamp(dustVeil * 0.22, 0, 0.28);

    const globalVeilOpacity = clamp(
      cloudOpacity * 0.42 +
      hazeOpacity * 0.32 +
      stormOpacity * 0.22 +
      rainOpacity * 0.16 +
      snowOpacity * 0.14 +
      dustOpacity * 0.12,
      0,
      ATMOSPHERE_LIMITS.maxGlobalVeilOpacity
    );

    const rimLight = clamp01(
      0.26 +
      humidityHaze * 0.20 +
      cloudCover * 0.10 +
      snowVeil * 0.10 +
      clamp01(1 - aridity) * 0.08
    );

    const terminatorSoftness = clamp01(
      0.22 +
      cloudCover * 0.18 +
      hazeOpacity * 0.22 +
      stormPressure * 0.08 +
      dustVeil * 0.08
    );

    const surfaceVisibility = clamp01(
      1 -
      globalVeilOpacity * 0.76 -
      stormOpacity * 0.20 -
      dustOpacity * 0.10
    );

    const skyTint = mix(
      colorFromPalette("atmosphere.air", [92, 174, 210]),
      colorFromPalette("atmosphere.haze", [180, 226, 220]),
      skyTintStrength
    );

    const cloudColor = mix(
      colorFromPalette("atmosphere.cloud", [234, 242, 235]),
      colorFromPalette("atmosphere.cloudShadow", [134, 160, 164]),
      clamp01(stormPressure * 0.38 + dustVeil * 0.14)
    );

    const rimColor = mix(
      colorFromPalette("atmosphere.rim", [152, 230, 214]),
      colorFromPalette("lighting.rimLight", [168, 242, 222]),
      clamp01(rimLight * 0.44)
    );

    const weatherColor =
      stormPressure > 0.58 ? colorFromPalette("atmosphere.stormBlue", [74, 112, 144]) :
      snowVeil > 0.58 ? colorFromPalette("terrain.snow", [226, 236, 230]) :
      dustVeil > 0.58 ? colorFromPalette("land.desert", [196, 144, 82]) :
      rainVeil > 0.58 ? colorFromPalette("atmosphere.rainGrey", [116, 138, 146]) :
      skyTint;

    return Object.freeze({
      province,
      summit,
      cloudMemory,
      veilField,
      stormLine,
      windVeil,
      highCloud,
      cloudCover,
      stormPressure,
      rainVeil,
      snowVeil,
      dustVeil,
      humidityHaze,
      skyTintStrength,
      cloudOpacity,
      stormOpacity,
      hazeOpacity,
      rainOpacity,
      snowOpacity,
      dustOpacity,
      globalVeilOpacity,
      rimLight,
      terminatorSoftness,
      surfaceVisibility,
      waterLift,
      terrainLift,
      biomeMoisture,
      skyTint,
      cloudColor,
      rimColor,
      weatherColor
    });
  }

  function hazeSource(mask, hydro, climate, biome) {
    return clamp01(
      climate.humidity * 0.26 +
      hydro.coastalShelfWater * 0.14 +
      hydro.wetland * 0.12 +
      hydro.marsh * 0.10 +
      biome.forestPressure * 0.10 +
      biome.rainforestPressure * 0.12 +
      mask.coastProximity * 0.10
    );
  }

  function surfaceTruthContrast(surface) {
    const color = rgb(surface.rgb || surface.color || surface.materialColor || [120, 140, 120]);
    const min = Math.min(color[0], color[1], color[2]);
    const max = Math.max(color[0], color[1], color[2]);
    return clamp01((max - min) / 255);
  }

  function classifyAtmosphere(mask, hydro, elevation, climate, biome, surface, fields) {
    if (fields.stormPressure > 0.64) return ["storm-field", "active-weather", "storm-pressure-veil"];
    if (fields.snowVeil > 0.62) return ["snow-veil", "cold-weather", "snow-and-ice-atmosphere"];
    if (fields.rainVeil > 0.62) return ["rain-veil", "wet-weather", "rain-cloud-atmosphere"];
    if (fields.dustVeil > 0.62) return ["dust-veil", "dry-weather", "dry-wind-atmosphere"];
    if (fields.cloudCover > 0.62) return ["cloud-veil", "cloud-weather", "cloud-layer-atmosphere"];
    if (fields.humidityHaze > 0.58) return ["humidity-haze", "haze-weather", "humid-haze-atmosphere"];
    if (mask.isOcean || mask.isShelf) return ["marine-air", "marine-weather", "ocean-air-field"];
    if (biome.class === "rainforest" || biome.class === "wetland" || biome.class === "marsh") return ["living-humid-air", "humid-weather", "green-humidity-field"];
    if (climate.aridity > 0.58) return ["dry-clear-air", "dry-weather", "dry-clear-atmosphere"];
    if (climate.cold > 0.58) return ["cold-clear-air", "cold-weather", "cold-clear-atmosphere"];
    return ["clear-balanced-air", "balanced-weather", "restrained-atmosphere-field"];
  }

  function sampleAtmosphere(input, vMaybe) {
    const mask = sampleLandmaskFromInput(input, vMaybe);
    const hydro = sampleHydrologyForMask(mask);
    const elevation = sampleElevationForMask(mask);
    const climate = sampleClimateForMask(mask);
    const biome = sampleBiomeForMask(mask);
    const surface = sampleSurfaceForMask(mask);
    const fields = computeAtmosphere(mask, hydro, elevation, climate, biome, surface);
    const classification = classifyAtmosphere(mask, hydro, elevation, climate, biome, surface, fields);

    return Object.freeze({
      allowed: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-atmosphere-weather-inheritance-source",
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
      surfaceClass: surface.class,

      class: classification[0],
      zone: classification[1],
      form: classification[2],
      atmosphereClass: classification[0],
      weatherZone: classification[1],
      atmosphereForm: classification[2],

      cloudCover: fields.cloudCover,
      stormPressure: fields.stormPressure,
      rainVeil: fields.rainVeil,
      snowVeil: fields.snowVeil,
      dustVeil: fields.dustVeil,
      humidityHaze: fields.humidityHaze,
      haze: fields.humidityHaze,
      cloudOpacity: fields.cloudOpacity,
      stormOpacity: fields.stormOpacity,
      hazeOpacity: fields.hazeOpacity,
      rainOpacity: fields.rainOpacity,
      snowOpacity: fields.snowOpacity,
      dustOpacity: fields.dustOpacity,
      globalVeilOpacity: fields.globalVeilOpacity,
      rimLight: fields.rimLight,
      terminatorSoftness: fields.terminatorSoftness,
      surfaceVisibility: fields.surfaceVisibility,

      skyTint: fields.skyTint,
      cloudColor: fields.cloudColor,
      rimColor: fields.rimColor,
      weatherColor: fields.weatherColor,
      skyTintCss: rgba(fields.skyTint, fields.hazeOpacity),
      cloudCss: rgba(fields.cloudColor, fields.cloudOpacity),
      rimCss: rgba(fields.rimColor, fields.rimLight * ATMOSPHERE_LIMITS.maxRimOpacity),
      weatherCss: rgba(fields.weatherColor, fields.globalVeilOpacity),

      weatherProvinceId: fields.province.best.id,
      weatherProvinceLabel: fields.province.best.label,
      provinceInfluence: fields.province.weight,

      visualGuidance: Object.freeze({
        shouldApplyAtmosphere: true,
        shouldKeepSurfaceVisible: true,
        shouldDrawAfterSurface: true,
        shouldApplyCloudVeil: fields.cloudOpacity > 0.08,
        shouldApplyStormVeil: fields.stormOpacity > 0.08,
        shouldApplyRainVeil: fields.rainOpacity > 0.06,
        shouldApplySnowVeil: fields.snowOpacity > 0.06,
        shouldApplyDustVeil: fields.dustOpacity > 0.06,
        shouldApplyHumidityHaze: fields.hazeOpacity > 0.06,
        shouldApplyRimLight: fields.rimLight > 0.20,
        shouldSoftenTerminator: fields.terminatorSoftness > 0.30,
        maxGlobalVeilOpacity: ATMOSPHERE_LIMITS.maxGlobalVeilOpacity,
        surfaceVisibility: fields.surfaceVisibility
      }),

      hEarthInheritance: Object.freeze({
        inheritsByDefault: true,
        sourcePlanet: "Audralia",
        downstreamView: "H-Earth / Hybrid Earth",
        downstreamRoute: H_EARTH_ROUTE,
        conditionClass: classification[0],
        weatherZone: classification[1],
        weatherColor: fields.weatherColor,
        cloudCover: fields.cloudCover,
        stormPressure: fields.stormPressure,
        rainVeil: fields.rainVeil,
        snowVeil: fields.snowVeil,
        dustVeil: fields.dustVeil,
        humidityHaze: fields.humidityHaze,
        surfaceVisibility: fields.surfaceVisibility,
        localModifierAllowed: true,
        localModifierBoundary: "H-Earth may modify ground-view expression but must not replace Audralia planet-level weather authority."
      }),

      sourceReads: Object.freeze({
        landmask: Boolean(mask.landmaskOwnsFootprint || mask.ownsFootprint || mask.footprintClass),
        hydrology: Boolean(hydro.contract === "AUDRALIA_CLEAN_CANVAS_HYDROLOGY_TNT_v1"),
        elevation: Boolean(elevation.contract === "AUDRALIA_CLEAN_CANVAS_ELEVATION_TNT_v1"),
        climate: Boolean(climate.contract === "AUDRALIA_CLEAN_CANVAS_CLIMATE_TNT_v1"),
        biome: Boolean(biome.contract === "AUDRALIA_CLEAN_CANVAS_BIOME_TNT_v1"),
        surface: Boolean(surface.contract === "AUDRALIA_CLEAN_CANVAS_SURFACE_TNT_v1"),
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
      ownsSurface: false,
      ownsVisibleMaterialSynthesis: false,
      ownsAtmosphere: true,
      ownsWeatherInheritance: true,
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
    return sampleAtmosphere(input, vMaybe);
  }

  function sampleWeather(input, vMaybe) {
    return sampleAtmosphere(input, vMaybe);
  }

  function classify(input, vMaybe) {
    return sampleAtmosphere(input, vMaybe).class;
  }

  function getHEarthInheritancePacket(input, vMaybe) {
    const atmosphere = sampleAtmosphere(input, vMaybe);

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      sourcePlanet: "Audralia",
      sourceRoute: AUDRALIA_ROUTE,
      downstreamView: "H-Earth / Hybrid Earth",
      downstreamRoute: H_EARTH_ROUTE,
      inheritsByDefault: true,
      localModifierAllowed: true,
      localModifierBoundary: atmosphere.hEarthInheritance.localModifierBoundary,
      u: atmosphere.u,
      v: atmosphere.v,
      longitudeDegrees: atmosphere.longitudeDegrees,
      latitudeDegrees: atmosphere.latitudeDegrees,
      conditionClass: atmosphere.class,
      weatherZone: atmosphere.zone,
      form: atmosphere.form,
      weatherColor: atmosphere.weatherColor,
      cloudCover: atmosphere.cloudCover,
      stormPressure: atmosphere.stormPressure,
      rainVeil: atmosphere.rainVeil,
      snowVeil: atmosphere.snowVeil,
      dustVeil: atmosphere.dustVeil,
      humidityHaze: atmosphere.humidityHaze,
      globalVeilOpacity: atmosphere.globalVeilOpacity,
      surfaceVisibility: atmosphere.surfaceVisibility,
      visualGuidance: atmosphere.visualGuidance
    });
  }

  function estimateAtmosphere(width = 40, height = 20) {
    const w = clamp(Math.floor(finite(width, 40)), 16, 192);
    const h = clamp(Math.floor(finite(height, 20)), 8, 96);

    const counts = {
      cloud: 0,
      storm: 0,
      rain: 0,
      snow: 0,
      dust: 0,
      haze: 0,
      clear: 0,
      lowSurfaceVisibility: 0,
      total: 0
    };

    for (let y = 0; y < h; y += 1) {
      const v = (y + 0.5) / h;

      for (let x = 0; x < w; x += 1) {
        const u = (x + 0.5) / w;
        const atmosphere = sampleAtmosphere(u, v);

        counts.total += 1;

        if (atmosphere.cloudCover > 0.54) counts.cloud += 1;
        if (atmosphere.stormPressure > 0.58) counts.storm += 1;
        if (atmosphere.rainVeil > 0.58) counts.rain += 1;
        if (atmosphere.snowVeil > 0.58) counts.snow += 1;
        if (atmosphere.dustVeil > 0.58) counts.dust += 1;
        if (atmosphere.humidityHaze > 0.54) counts.haze += 1;
        if (atmosphere.globalVeilOpacity < 0.12) counts.clear += 1;
        if (atmosphere.surfaceVisibility < 0.72) counts.lowSurfaceVisibility += 1;
      }
    }

    const denominator = Math.max(1, counts.total);

    return Object.freeze({
      samples: counts.total,
      cloudSignalRatio: Number((counts.cloud / denominator).toFixed(4)),
      stormSignalRatio: Number((counts.storm / denominator).toFixed(4)),
      rainSignalRatio: Number((counts.rain / denominator).toFixed(4)),
      snowSignalRatio: Number((counts.snow / denominator).toFixed(4)),
      dustSignalRatio: Number((counts.dust / denominator).toFixed(4)),
      hazeSignalRatio: Number((counts.haze / denominator).toFixed(4)),
      clearAirRatio: Number((counts.clear / denominator).toFixed(4)),
      lowSurfaceVisibilityRatio: Number((counts.lowSurfaceVisibility / denominator).toFixed(4))
    });
  }

  function getWeatherProvinces() {
    return Object.freeze(WEATHER_PROVINCES.map((province) => Object.freeze({ ...province })));
  }

  function getAtmosphereLimits() {
    return Object.freeze({ ...ATMOSPHERE_LIMITS });
  }

  function validateManifestRegistration() {
    try {
      const manifest = window.DGB_PLANET_FAMILY_MANIFEST || window.AUDRALIA_CLEAN_CANVAS_MANIFEST;
      if (!manifest || typeof manifest.validatePrimaryFile !== "function") {
        return Object.freeze({
          manifestAvailable: false,
          valid: true,
          reason: "manifest_not_loaded_yet_atmosphere_can_still_register"
        });
      }

      return manifest.validatePrimaryFile({
        path: "/assets/audralia/clean/audralia.atmosphere.js",
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
    const surface = S();

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
      }),
      surface: Object.freeze({
        available: Boolean(surface),
        expectedContract: "AUDRALIA_CLEAN_CANVAS_SURFACE_TNT_v1",
        actualContract: surface?.contract || null,
        valid: !surface || surface.contract === "AUDRALIA_CLEAN_CANVAS_SURFACE_TNT_v1"
      })
    });
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-atmosphere-weather-inheritance-source",
      fileNumber: FILE_NUMBER,
      primaryNode: PRIMARY_NODE,
      subnodes: SUBNODE_RANGE,
      parentAnchor: "/showroom/globe/audralia/index.html",
      universalParent: UNIVERSAL_ANCHOR,
      downstreamGroundView: H_EARTH_ROUTE,
      targets: ATMOSPHERE_TARGETS,
      limits: ATMOSPHERE_LIMITS,
      weatherProvinces: WEATHER_PROVINCES.length,
      atmosphereEstimate: estimateAtmosphere(32, 16),
      owns: Object.freeze([
        "atmosphere condition source",
        "weather inheritance source",
        "haze",
        "cloud veil",
        "storm pressure",
        "rain veil",
        "snow veil",
        "dust veil",
        "humidity haze",
        "rim light",
        "terminator softness",
        "sky tint",
        "H-Earth downstream weather inheritance packet"
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
        "climate field creation",
        "biome categories",
        "surface material synthesis",
        "runtime motion",
        "controls",
        "canvas rendering",
        "route bridge",
        "HTML expression"
      ]),
      manifestRegistration: validateManifestRegistration(),
      priorAuthorities: validatePriorAuthorities(),
      hEarthReceivesAtmosphereWeatherThroughAudralia: true,
      hEarthSeparateWeatherAuthority: false,
      surfaceTruthMustRemainVisible: true,
      atmosphereAfterSurfaceOnly: true,
      footprintCreationForbidden: true,
      waterBehaviorCreationForbidden: true,
      elevationCreationForbidden: true,
      climateCreationForbidden: true,
      biomeCreationForbidden: true,
      surfaceMaterialSynthesisForbidden: true,
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
    ATMOSPHERE_TARGETS,
    ATMOSPHERE_LIMITS,

    sampleAtmosphere,
    sampleWeather,
    sample,
    classify,
    getHEarthInheritancePacket,
    estimateAtmosphere,
    getWeatherProvinces,
    getAtmosphereLimits,
    validateManifestRegistration,
    validatePriorAuthorities,
    getStatus
  });

  window.AUDRALIA_ATMOSPHERE = API;
  window.AUDRALIA_ATMOSPHERE_RECEIPT = getStatus();

  window.AUDRALIA_CLEAN_CANVAS_ATMOSPHERE = API;
  window.AUDRALIA_CLEAN_CANVAS_ATMOSPHERE_RECEIPT = getStatus();

  window.AUDRALIA_WEATHER = API;
  window.AUDRALIA_WEATHER_RECEIPT = getStatus();

  if (document?.documentElement?.dataset) {
    document.documentElement.dataset.audraliaAtmosphereLoaded = "true";
    document.documentElement.dataset.audraliaAtmosphereContract = CONTRACT;
    document.documentElement.dataset.audraliaAtmosphereReceipt = RECEIPT;
    document.documentElement.dataset.audraliaAtmosphereVersion = VERSION;
    document.documentElement.dataset.audraliaCleanCanvasAtmosphereLoaded = "true";
    document.documentElement.dataset.audraliaCleanCanvasAtmosphereContract = CONTRACT;
    document.documentElement.dataset.audraliaCleanCanvasAtmosphereReceipt = RECEIPT;
    document.documentElement.dataset.audraliaCleanCanvasAtmosphereNode = String(PRIMARY_NODE);
    document.documentElement.dataset.audraliaCleanCanvasAtmosphereSubnodes = "177-192";
    document.documentElement.dataset.audraliaAtmosphereOwnsAtmosphere = "true";
    document.documentElement.dataset.audraliaAtmosphereOwnsWeatherInheritance = "true";
    document.documentElement.dataset.audraliaAtmosphereOwnsFootprint = "false";
    document.documentElement.dataset.audraliaAtmosphereOwnsHydrology = "false";
    document.documentElement.dataset.audraliaAtmosphereOwnsElevation = "false";
    document.documentElement.dataset.audraliaAtmosphereOwnsClimateCreation = "false";
    document.documentElement.dataset.audraliaAtmosphereOwnsBiome = "false";
    document.documentElement.dataset.audraliaAtmosphereOwnsSurface = "false";
    document.documentElement.dataset.audraliaAtmosphereOwnsCanvas = "false";
    document.documentElement.dataset.audraliaAtmosphereCloudVeil = "true";
    document.documentElement.dataset.audraliaAtmosphereStormPressure = "true";
    document.documentElement.dataset.audraliaAtmosphereRainVeil = "true";
    document.documentElement.dataset.audraliaAtmosphereSnowVeil = "true";
    document.documentElement.dataset.audraliaAtmosphereDustVeil = "true";
    document.documentElement.dataset.audraliaAtmosphereHaze = "true";
    document.documentElement.dataset.audraliaAtmosphereRimLight = "true";
    document.documentElement.dataset.audraliaAtmosphereSurfaceTruthVisible = "true";
    document.documentElement.dataset.hEarthReceivesAudraliaAtmosphereWeather = "true";
    document.documentElement.dataset.hEarthSeparateWeatherAuthority = "false";
    document.documentElement.dataset.audraliaCleanCanvasFibonacciChronology = "true";
    document.documentElement.dataset.audraliaCleanCanvasPrimaryStructure16 = "true";
    document.documentElement.dataset.audraliaCleanCanvasNodalConstruct256 = "true";
    document.documentElement.dataset.audraliaCleanCanvasOneFileOneJob = "true";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }
})();

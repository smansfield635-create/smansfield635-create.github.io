// /assets/audralia/clean/audralia.climate.js
// AUDRALIA_CLEAN_CANVAS_CLIMATE_TNT_v1
// Full-file replacement.
// File 9 of 16.
// Planet Audralia climate / condition-field authority.
// Purpose:
// - Establishes Audralia-specific climate condition fields.
// - Defines heat, moisture, aridity, cold, rainfall, wind pressure, seasonal pressure, humidity, drought pressure, frost pressure, and climate bands.
// - Consumes Audralia landmask, hydrology, and elevation when available.
// - Does not create continents.
// - Does not create water behavior.
// - Does not create elevation.
// - Does not own biome categories, surface material synthesis, atmosphere/weather rendering, runtime, controls, canvas, route bridge, or HTML shell.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_CLEAN_CANVAS_CLIMATE_TNT_v1";
  const RECEIPT = "AUDRALIA_CLEAN_CANVAS_CLIMATE_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_CLEAN_CANVAS_ELEVATION_TNT_v1";
  const VERSION = "2026-05-20.audralia-clean-canvas-climate-v1";

  const FILE_NUMBER = 9;
  const PRIMARY_NODE = 9;
  const SUBNODE_RANGE = Object.freeze([129, 144]);

  const UNIVERSAL_ANCHOR = "/showroom/globe/";
  const AUDRALIA_ROUTE = "/showroom/globe/audralia/";
  const H_EARTH_ROUTE = "/showroom/globe/h-earth/";

  const CLIMATE_TARGETS = Object.freeze({
    heat: true,
    moisture: true,
    aridity: true,
    cold: true,
    rainfall: true,
    humidity: true,
    windPressure: true,
    seasonalPressure: true,
    droughtPressure: true,
    frostPressure: true,
    climateBands: true,
    consumesLandmask: true,
    consumesHydrology: true,
    consumesElevation: true,
    ownsWeatherRendering: false,
    ownsAtmosphereRendering: false
  });

  const CLIMATE_PROVINCES = Object.freeze([
    {
      id: "equatorial-green-belt",
      label: "Equatorial Green Belt",
      longitude: -24,
      latitude: 2,
      radiusLongitude: 96,
      radiusLatitude: 22,
      tilt: 4,
      heat: 0.84,
      moisture: 0.72,
      rainfall: 0.70,
      aridity: 0.18,
      wind: 0.34
    },
    {
      id: "west-crown-temperate",
      label: "West Crown Temperate",
      longitude: -136,
      latitude: 24,
      radiusLongitude: 42,
      radiusLatitude: 28,
      tilt: -14,
      heat: 0.52,
      moisture: 0.50,
      rainfall: 0.46,
      aridity: 0.34,
      wind: 0.44
    },
    {
      id: "central-rain-memory",
      label: "Central Rain Memory",
      longitude: -36,
      latitude: 10,
      radiusLongitude: 46,
      radiusLatitude: 32,
      tilt: 10,
      heat: 0.68,
      moisture: 0.76,
      rainfall: 0.78,
      aridity: 0.12,
      wind: 0.30
    },
    {
      id: "central-south-seasonal-basin",
      label: "Central South Seasonal Basin",
      longitude: -18,
      latitude: -34,
      radiusLongitude: 36,
      radiusLatitude: 24,
      tilt: 14,
      heat: 0.58,
      moisture: 0.38,
      rainfall: 0.34,
      aridity: 0.56,
      wind: 0.38
    },
    {
      id: "east-sunrise-monsoon",
      label: "East Sunrise Monsoon",
      longitude: 78,
      latitude: 6,
      radiusLongitude: 44,
      radiusLatitude: 34,
      tilt: -12,
      heat: 0.72,
      moisture: 0.70,
      rainfall: 0.74,
      aridity: 0.16,
      wind: 0.46
    },
    {
      id: "far-east-coastal-cycle",
      label: "Far East Coastal Cycle",
      longitude: 154,
      latitude: -12,
      radiusLongitude: 34,
      radiusLatitude: 28,
      tilt: 8,
      heat: 0.66,
      moisture: 0.62,
      rainfall: 0.58,
      aridity: 0.24,
      wind: 0.54
    },
    {
      id: "southern-cold-current",
      label: "Southern Cold Current",
      longitude: 24,
      latitude: -60,
      radiusLongitude: 68,
      radiusLatitude: 18,
      tilt: 2,
      heat: 0.22,
      moisture: 0.44,
      rainfall: 0.36,
      aridity: 0.30,
      wind: 0.62
    },
    {
      id: "north-polar-stillness",
      label: "North Polar Stillness",
      longitude: 34,
      latitude: 70,
      radiusLongitude: 52,
      radiusLatitude: 16,
      tilt: -6,
      heat: 0.16,
      moisture: 0.34,
      rainfall: 0.24,
      aridity: 0.22,
      wind: 0.40
    }
  ]);

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

  function rotatedEllipseScore(longitudeDegrees, latitudeDegrees, item, weightKey = "heat") {
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
        document.documentElement.dataset.audraliaClimateHydrologyReadFailed = "true";
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
        document.documentElement.dataset.audraliaClimateElevationReadFailed = "true";
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

  function climateProvinceInfluence(mask) {
    let totalWeight = 0;
    let heat = 0;
    let moisture = 0;
    let rainfall = 0;
    let aridity = 0;
    let wind = 0;

    let best = Object.freeze({
      id: "",
      label: "",
      score: 0
    });

    for (const province of CLIMATE_PROVINCES) {
      const raw = rotatedEllipseScore(mask.longitudeDegrees, mask.latitudeDegrees, province, "heat");
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
      heat += province.heat * w;
      moisture += province.moisture * w;
      rainfall += province.rainfall * w;
      aridity += province.aridity * w;
      wind += province.wind * w;
    }

    const denom = Math.max(0.000001, totalWeight);

    return Object.freeze({
      best,
      heat: clamp01(heat / denom),
      moisture: clamp01(moisture / denom),
      rainfall: clamp01(rainfall / denom),
      aridity: clamp01(aridity / denom),
      wind: clamp01(wind / denom),
      weight: clamp01(totalWeight / CLIMATE_PROVINCES.length)
    });
  }

  function summitClimatePressure(mask) {
    const source = [
      mask.primarySummit,
      mask.secondarySummit,
      mask.internalSummit
    ].join(" ").toLowerCase();

    let moisture = 0;
    let heat = 0;
    let aridity = 0;
    let rainfall = 0;
    let stability = 0;

    if (source.includes("gratitude")) {
      moisture += 0.06;
      rainfall += 0.04;
    }

    if (source.includes("peace")) {
      moisture += 0.10;
      rainfall += 0.08;
      stability += 0.05;
    }

    if (source.includes("joy")) {
      heat += 0.06;
      rainfall += 0.04;
    }

    if (source.includes("dignity")) {
      aridity += 0.05;
      stability += 0.06;
    }

    if (source.includes("free")) {
      heat += 0.04;
      aridity += 0.04;
    }

    if (source.includes("love")) {
      moisture += 0.06;
      heat += 0.03;
    }

    if (source.includes("stewardship")) {
      moisture += 0.08;
      rainfall += 0.06;
      stability += 0.06;
    }

    if (source.includes("balance")) {
      stability += 0.08;
    }

    if (source.includes("stability")) {
      stability += 0.10;
      aridity -= 0.02;
    }

    return Object.freeze({
      moisture,
      heat,
      aridity,
      rainfall,
      stability
    });
  }

  function latitudeClimate(latitudeDegrees) {
    const absLat = Math.abs(finite(latitudeDegrees, 0));

    const tropical = 1 - smoothstep(18, 32, absLat);
    const subtropical = smoothstep(18, 34, absLat) * (1 - smoothstep(34, 48, absLat));
    const temperate = smoothstep(32, 48, absLat) * (1 - smoothstep(56, 70, absLat));
    const subpolar = smoothstep(56, 72, absLat) * (1 - smoothstep(74, 86, absLat));
    const polar = smoothstep(72, 88, absLat);

    const heat = clamp01(tropical * 0.84 + subtropical * 0.64 + temperate * 0.42 + subpolar * 0.22 + polar * 0.08);
    const cold = clamp01(subpolar * 0.46 + polar * 0.88 + (1 - heat) * 0.18);

    return Object.freeze({
      absLat,
      tropical,
      subtropical,
      temperate,
      subpolar,
      polar,
      heat,
      cold
    });
  }

  function computeClimate(mask, hydro, elevation) {
    const u = wrap01(mask.u);
    const v = clamp01(mask.v);
    const lat = latitudeClimate(mask.latitudeDegrees);
    const province = climateProvinceInfluence(mask);
    const summit = summitClimatePressure(mask);

    const oceanicMemory = fbm2(u * 0.72 + 0.16, v * 0.58 - 0.11, { seed: 12001, scale: 2.4, octaves: 5 });
    const rainfallMemory = fbm2(u * 1.52 - 0.22, v * 1.22 + 0.19, { seed: 12002, scale: 3.6, octaves: 5 });
    const dryMemory = fbm2(u * 2.10 + 0.31, v * 1.72 - 0.29, { seed: 12003, scale: 4.4, octaves: 4 });
    const windField = ridgeNoise2(u * 2.80 - 0.18, v * 2.18 + 0.24, { seed: 12004, scale: 4.8, octaves: 4 });
    const seasonalField = fbm2(u * 1.06 + 0.42, v * 1.46 - 0.33, { seed: 12005, scale: 2.8, octaves: 4 });

    const coast = clamp01(mask.coastProximity);
    const shelf = clamp01(mask.shelf);
    const altitude = clamp01(elevation.elevation01 ?? elevation.height ?? elevation.aboveSea ?? 0);
    const mountain = clamp01(elevation.mountain);
    const basin = clamp01(elevation.basin);
    const valley = clamp01(elevation.valley);
    const belowSeaDepth = clamp01(elevation.belowSeaDepth);
    const hydroWet =
      clamp01(
        hydro.rainfallSupply * 0.22 +
        hydro.wetland * 0.18 +
        hydro.marsh * 0.14 +
        hydro.lake * 0.12 +
        hydro.inlandSea * 0.12 +
        hydro.river * 0.10 +
        hydro.coastalShelfWater * 0.08
      );

    const oceanCooling = clamp01(
      (mask.isOcean ? 0.26 : 0) +
      (mask.isShelf ? 0.18 : 0) +
      coast * 0.12 +
      shelf * 0.08 +
      belowSeaDepth * 0.06
    );

    const altitudeCooling = clamp01(altitude * 0.20 + mountain * 0.18 + elevation.snowline * 0.12);
    const basinHeat = clamp01(basin * 0.12 + valley * 0.06);
    const polarIceCooling = mask.isPolarIce ? 0.24 : 0;

    const heat = clamp01(
      lat.heat * 0.42 +
      province.heat * 0.24 +
      oceanicMemory * 0.08 +
      summit.heat +
      basinHeat -
      oceanCooling * 0.28 -
      altitudeCooling -
      polarIceCooling
    );

    const cold = clamp01(
      lat.cold * 0.40 +
      altitudeCooling * 0.42 +
      polarIceCooling +
      (mask.isPolarIce ? 0.30 : 0) +
      (1 - heat) * 0.12
    );

    const moisture = clamp01(
      province.moisture * 0.26 +
      rainfallMemory * 0.18 +
      hydroWet * 0.30 +
      coast * 0.12 +
      shelf * 0.06 +
      summit.moisture -
      dryMemory * 0.10 -
      altitude * 0.04
    );

    const rainfall = clamp01(
      province.rainfall * 0.30 +
      hydro.rainfallSupply * 0.22 +
      moisture * 0.18 +
      rainfallMemory * 0.12 +
      summit.rainfall +
      lat.tropical * 0.06 -
      cold * 0.08
    );

    const aridity = clamp01(
      province.aridity * 0.24 +
      dryMemory * 0.24 +
      hydro.dryness * 0.20 +
      lat.subtropical * 0.10 +
      summit.aridity -
      moisture * 0.22 -
      coast * 0.08
    );

    const humidity = clamp01(
      moisture * 0.48 +
      rainfall * 0.26 +
      coast * 0.12 +
      hydroWet * 0.14 -
      aridity * 0.12
    );

    const windPressure = clamp01(
      province.wind * 0.24 +
      windField * 0.28 +
      coast * 0.12 +
      altitude * 0.08 +
      cold * 0.08 +
      Math.abs(heat - cold) * 0.14
    );

    const seasonalPressure = clamp01(
      seasonalField * 0.28 +
      lat.temperate * 0.22 +
      lat.subtropical * 0.14 +
      Math.abs(heat - cold) * 0.20 +
      summit.stability * -0.12 +
      0.12
    );

    const droughtPressure = clamp01(
      aridity * 0.42 +
      hydro.dryChannel * 0.16 +
      dryMemory * 0.16 -
      rainfall * 0.20 -
      humidity * 0.14
    );

    const frostPressure = clamp01(
      cold * 0.42 +
      elevation.snowline * 0.22 +
      lat.polar * 0.24 +
      altitude * 0.10 -
      heat * 0.14
    );

    return Object.freeze({
      province,
      summit,
      lat,
      oceanicMemory,
      rainfallMemory,
      dryMemory,
      windField,
      seasonalField,
      heat,
      cold,
      moisture,
      rainfall,
      aridity,
      humidity,
      windPressure,
      seasonalPressure,
      droughtPressure,
      frostPressure,
      oceanCooling,
      altitudeCooling,
      hydroWet
    });
  }

  function classifyClimate(mask, hydro, elevation, fields) {
    if (mask.isOcean) {
      if (fields.cold > 0.66) return ["polar-ocean", "marine", "cold-ocean-current"];
      if (fields.heat > 0.62 && fields.humidity > 0.52) return ["warm-ocean", "marine", "warm-humid-ocean"];
      return ["open-ocean-climate", "marine", "ocean-condition-field"];
    }

    if (mask.isShelf) {
      if (fields.humidity > 0.62) return ["humid-shelf", "coastal", "wet-coastal-shelf"];
      return ["shelf-climate", "coastal", "shelf-condition-field"];
    }

    if (mask.isBeach) {
      if (fields.humidity > 0.60) return ["humid-coast", "coastal", "wet-beach-air"];
      if (fields.aridity > 0.58) return ["dry-coast", "coastal", "dry-beach-air"];
      return ["temperate-coast", "coastal", "balanced-beach-air"];
    }

    if (fields.frostPressure > 0.68 || mask.isPolarIce) return ["polar-cold", "polar", "ice-and-frost-field"];
    if (fields.cold > 0.62 && elevation.mountain > 0.46) return ["alpine-cold", "alpine", "mountain-cold-field"];
    if (fields.rainfall > 0.66 && fields.heat > 0.56) return ["rainforest-humid", "humid", "warm-rainfall-field"];
    if (fields.moisture > 0.64 && hydro.wetland > 0.54) return ["wetland-humid", "humid", "wet-basin-field"];
    if (fields.droughtPressure > 0.64 || fields.aridity > 0.68) return ["dry-basin", "arid", "dryland-condition-field"];
    if (fields.seasonalPressure > 0.62 && fields.rainfall > 0.44) return ["seasonal-temperate", "temperate", "seasonal-rain-field"];
    if (fields.heat > 0.62 && fields.moisture < 0.46) return ["warm-savanna", "subtropical", "warm-seasonal-field"];
    if (fields.moisture > 0.48 && fields.cold < 0.54) return ["green-temperate", "temperate", "balanced-green-field"];

    return ["mixed-temperate", "temperate", "mixed-condition-field"];
  }

  function sampleClimate(input, vMaybe) {
    const mask = sampleLandmaskFromInput(input, vMaybe);
    const hydro = sampleHydrologyForMask(mask);
    const elevation = sampleElevationForMask(mask);
    const fields = computeClimate(mask, hydro, elevation);
    const classification = classifyClimate(mask, hydro, elevation, fields);

    return Object.freeze({
      allowed: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-condition-fields",
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
      elevationClass: elevation.class,
      hydrologyClass: hydro.class,

      class: classification[0],
      zone: classification[1],
      form: classification[2],
      climateClass: classification[0],
      climateZone: classification[1],
      climateForm: classification[2],

      heat: fields.heat,
      temperature: fields.heat,
      warmth: fields.heat,
      cold: fields.cold,
      moisture: fields.moisture,
      humidity: fields.humidity,
      rainfall: fields.rainfall,
      precipitation: fields.rainfall,
      aridity: fields.aridity,
      dryness: fields.aridity,
      windPressure: fields.windPressure,
      seasonalPressure: fields.seasonalPressure,
      droughtPressure: fields.droughtPressure,
      frostPressure: fields.frostPressure,

      tropical: fields.lat.tropical,
      subtropical: fields.lat.subtropical,
      temperate: fields.lat.temperate,
      subpolar: fields.lat.subpolar,
      polar: fields.lat.polar,

      climateProvinceId: fields.province.best.id,
      climateProvinceLabel: fields.province.best.label,
      provinceInfluence: fields.province.weight,
      oceanCooling: fields.oceanCooling,
      altitudeCooling: fields.altitudeCooling,
      hydrologyMoisture: fields.hydroWet,

      visualGuidance: Object.freeze({
        shouldSupportGreen: fields.moisture > 0.48 && fields.rainfall > 0.38,
        shouldSupportRainforest: fields.rainfall > 0.66 && fields.heat > 0.56,
        shouldSupportWetland: fields.moisture > 0.62 && hydro.wetland > 0.50,
        shouldSupportDryland: fields.aridity > 0.60 || fields.droughtPressure > 0.60,
        shouldSupportSnowOrIce: fields.frostPressure > 0.58 || mask.isPolarIce,
        shouldSupportCoastalHumidity: mask.isCoastal && fields.humidity > 0.46,
        shouldSupportSeasonalTexture: fields.seasonalPressure > 0.54,
        shouldSupportWindStreaks: fields.windPressure > 0.58
      }),

      sourceReads: Object.freeze({
        landmask: Boolean(mask.landmaskOwnsFootprint || mask.ownsFootprint || mask.footprintClass),
        hydrology: Boolean(hydro.contract === "AUDRALIA_CLEAN_CANVAS_HYDROLOGY_TNT_v1"),
        elevation: Boolean(elevation.contract === "AUDRALIA_CLEAN_CANVAS_ELEVATION_TNT_v1"),
        math: Boolean(M()?.fbm2)
      }),

      ownsFootprint: false,
      ownsLandSea: false,
      ownsHydrology: false,
      ownsWaterBehavior: false,
      ownsElevation: false,
      ownsVerticalDepth: false,
      ownsClimate: true,
      ownsConditionFields: true,
      ownsBiome: false,
      ownsSurface: false,
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
    return sampleClimate(input, vMaybe);
  }

  function classify(input, vMaybe) {
    return sampleClimate(input, vMaybe).class;
  }

  function estimateClimate(width = 96, height = 48) {
    const w = clamp(Math.floor(finite(width, 96)), 16, 384);
    const h = clamp(Math.floor(finite(height, 48)), 8, 192);

    let humid = 0;
    let dry = 0;
    let cold = 0;
    let hot = 0;
    let seasonal = 0;
    let frost = 0;
    let total = 0;

    for (let y = 0; y < h; y += 1) {
      const v = (y + 0.5) / h;

      for (let x = 0; x < w; x += 1) {
        const u = (x + 0.5) / w;
        const climate = sampleClimate(u, v);

        total += 1;
        if (climate.humidity > 0.58 || climate.rainfall > 0.58) humid += 1;
        if (climate.aridity > 0.60 || climate.droughtPressure > 0.60) dry += 1;
        if (climate.cold > 0.58) cold += 1;
        if (climate.heat > 0.62) hot += 1;
        if (climate.seasonalPressure > 0.56) seasonal += 1;
        if (climate.frostPressure > 0.58) frost += 1;
      }
    }

    const denominator = Math.max(1, total);

    return Object.freeze({
      samples: total,
      humidSignalRatio: Number((humid / denominator).toFixed(4)),
      drySignalRatio: Number((dry / denominator).toFixed(4)),
      coldSignalRatio: Number((cold / denominator).toFixed(4)),
      hotSignalRatio: Number((hot / denominator).toFixed(4)),
      seasonalSignalRatio: Number((seasonal / denominator).toFixed(4)),
      frostSignalRatio: Number((frost / denominator).toFixed(4))
    });
  }

  function getClimateProvinces() {
    return Object.freeze(CLIMATE_PROVINCES.map((province) => Object.freeze({ ...province })));
  }

  function validateManifestRegistration() {
    try {
      const manifest = window.DGB_PLANET_FAMILY_MANIFEST || window.AUDRALIA_CLEAN_CANVAS_MANIFEST;
      if (!manifest || typeof manifest.validatePrimaryFile !== "function") {
        return Object.freeze({
          manifestAvailable: false,
          valid: true,
          reason: "manifest_not_loaded_yet_climate_can_still_register"
        });
      }

      return manifest.validatePrimaryFile({
        path: "/assets/audralia/clean/audralia.climate.js",
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
      })
    });
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-condition-fields",
      fileNumber: FILE_NUMBER,
      primaryNode: PRIMARY_NODE,
      subnodes: SUBNODE_RANGE,
      parentAnchor: "/showroom/globe/audralia/index.html",
      universalParent: UNIVERSAL_ANCHOR,
      downstreamGroundView: H_EARTH_ROUTE,
      targets: CLIMATE_TARGETS,
      climateProvinces: CLIMATE_PROVINCES.length,
      climateEstimate: estimateClimate(72, 36),
      owns: Object.freeze([
        "heat",
        "temperature",
        "moisture",
        "humidity",
        "rainfall",
        "precipitation",
        "aridity",
        "dryness",
        "cold",
        "wind pressure",
        "seasonal pressure",
        "drought pressure",
        "frost pressure",
        "climate bands",
        "condition fields"
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
        "biome categories",
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
      hEarthReceivesClimateThroughAudralia: true,
      footprintCreationForbidden: true,
      waterBehaviorCreationForbidden: true,
      elevationCreationForbidden: true,
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
    CLIMATE_TARGETS,

    sampleClimate,
    sample,
    classify,
    estimateClimate,
    getClimateProvinces,
    validateManifestRegistration,
    validatePriorAuthorities,
    getStatus
  });

  window.AUDRALIA_CLIMATE = API;
  window.AUDRALIA_CLIMATE_RECEIPT = getStatus();

  window.AUDRALIA_CLEAN_CANVAS_CLIMATE = API;
  window.AUDRALIA_CLEAN_CANVAS_CLIMATE_RECEIPT = getStatus();

  if (document?.documentElement?.dataset) {
    document.documentElement.dataset.audraliaClimateLoaded = "true";
    document.documentElement.dataset.audraliaClimateContract = CONTRACT;
    document.documentElement.dataset.audraliaClimateReceipt = RECEIPT;
    document.documentElement.dataset.audraliaClimateVersion = VERSION;
    document.documentElement.dataset.audraliaCleanCanvasClimateLoaded = "true";
    document.documentElement.dataset.audraliaCleanCanvasClimateContract = CONTRACT;
    document.documentElement.dataset.audraliaCleanCanvasClimateReceipt = RECEIPT;
    document.documentElement.dataset.audraliaCleanCanvasClimateNode = String(PRIMARY_NODE);
    document.documentElement.dataset.audraliaCleanCanvasClimateSubnodes = "129-144";
    document.documentElement.dataset.audraliaClimateOwnsConditionFields = "true";
    document.documentElement.dataset.audraliaClimateOwnsFootprint = "false";
    document.documentElement.dataset.audraliaClimateOwnsHydrology = "false";
    document.documentElement.dataset.audraliaClimateOwnsElevation = "false";
    document.documentElement.dataset.audraliaClimateOwnsBiome = "false";
    document.documentElement.dataset.audraliaClimateOwnsSurface = "false";
    document.documentElement.dataset.audraliaClimateOwnsAtmosphere = "false";
    document.documentElement.dataset.audraliaClimateHeat = "true";
    document.documentElement.dataset.audraliaClimateMoisture = "true";
    document.documentElement.dataset.audraliaClimateRainfall = "true";
    document.documentElement.dataset.audraliaClimateAridity = "true";
    document.documentElement.dataset.audraliaClimateCold = "true";
    document.documentElement.dataset.hEarthReceivesAudraliaClimate = "true";
    document.documentElement.dataset.audraliaCleanCanvasFibonacciChronology = "true";
    document.documentElement.dataset.audraliaCleanCanvasPrimaryStructure16 = "true";
    document.documentElement.dataset.audraliaCleanCanvasNodalConstruct256 = "true";
    document.documentElement.dataset.audraliaCleanCanvasOneFileOneJob = "true";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }
})();

// /assets/audralia/clean/audralia.elevation.js
// AUDRALIA_CLEAN_CANVAS_ELEVATION_TNT_v1
// Full-file replacement.
// File 8 of 16.
// Planet Audralia vertical-depth authority.
// Purpose:
// - Establishes Audralia-specific elevation and depth authority.
// - Defines mountains, ridges, cliffs, escarpments, basins, valleys, plateaus, coastal rise, shelf depth, seafloor depth, snowline pressure, and shadow pressure.
// - Consumes Audralia landmask as the land/ocean footprint source.
// - Consumes Audralia hydrology as water-shaping context when available.
// - Does not create continents.
// - Does not create water behavior.
// - Does not own land/ocean footprint, hydrology behavior, climate fields, biome categories, surface material synthesis, atmosphere/weather, runtime, controls, canvas, route bridge, or HTML shell.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_CLEAN_CANVAS_ELEVATION_TNT_v1";
  const RECEIPT = "AUDRALIA_CLEAN_CANVAS_ELEVATION_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_CLEAN_CANVAS_HYDROLOGY_TNT_v1";
  const VERSION = "2026-05-20.audralia-clean-canvas-elevation-v1";

  const FILE_NUMBER = 8;
  const PRIMARY_NODE = 8;
  const SUBNODE_RANGE = Object.freeze([113, 128]);

  const UNIVERSAL_ANCHOR = "/showroom/globe/";
  const AUDRALIA_ROUTE = "/showroom/globe/audralia/";
  const H_EARTH_ROUTE = "/showroom/globe/h-earth/";

  const ELEVATION_TARGETS = Object.freeze({
    mountains: true,
    ridges: true,
    cliffs: true,
    escarpments: true,
    basins: true,
    valleys: true,
    plateaus: true,
    coastalRise: true,
    shelfDepth: true,
    seafloorDepth: true,
    snowlinePressure: true,
    shadowPressure: true,
    landmaskFootprintRequired: true,
    footprintCreationForbidden: true,
    waterBehaviorCreationForbidden: true
  });

  const TECTONIC_PROVINCES = Object.freeze([
    {
      id: "west-crown-range",
      label: "West Crown Range",
      longitude: -138,
      latitude: 18,
      radiusLongitude: 36,
      radiusLatitude: 22,
      tilt: -18,
      uplift: 0.74,
      ridge: 0.70,
      cliff: 0.46,
      basin: 0.10,
      plateau: 0.32
    },
    {
      id: "central-spine-range",
      label: "Central Spine Range",
      longitude: -36,
      latitude: 4,
      radiusLongitude: 45,
      radiusLatitude: 20,
      tilt: 12,
      uplift: 0.82,
      ridge: 0.78,
      cliff: 0.38,
      basin: 0.08,
      plateau: 0.28
    },
    {
      id: "central-south-basin",
      label: "Central South Basin",
      longitude: -18,
      latitude: -34,
      radiusLongitude: 36,
      radiusLatitude: 22,
      tilt: 14,
      uplift: 0.22,
      ridge: 0.22,
      cliff: 0.16,
      basin: 0.72,
      plateau: 0.18
    },
    {
      id: "east-sunrise-highlands",
      label: "East Sunrise Highlands",
      longitude: 78,
      latitude: 4,
      radiusLongitude: 40,
      radiusLatitude: 26,
      tilt: -12,
      uplift: 0.66,
      ridge: 0.58,
      cliff: 0.34,
      basin: 0.16,
      plateau: 0.42
    },
    {
      id: "far-east-arc-cliffs",
      label: "Far East Arc Cliffs",
      longitude: 154,
      latitude: -12,
      radiusLongitude: 28,
      radiusLatitude: 25,
      tilt: 8,
      uplift: 0.52,
      ridge: 0.48,
      cliff: 0.68,
      basin: 0.12,
      plateau: 0.22
    },
    {
      id: "southern-long-plateau",
      label: "Southern Long Plateau",
      longitude: 22,
      latitude: -60,
      radiusLongitude: 62,
      radiusLatitude: 14,
      tilt: 2,
      uplift: 0.44,
      ridge: 0.34,
      cliff: 0.26,
      basin: 0.20,
      plateau: 0.62
    },
    {
      id: "north-polar-fragment-rise",
      label: "North Polar Fragment Rise",
      longitude: 34,
      latitude: 70,
      radiusLongitude: 44,
      radiusLatitude: 13,
      tilt: -6,
      uplift: 0.34,
      ridge: 0.30,
      cliff: 0.18,
      basin: 0.18,
      plateau: 0.38
    }
  ]);

  const SEAFLOOR_BASINS = Object.freeze([
    {
      id: "west-central-abyss",
      label: "West Central Abyss",
      longitude: -86,
      latitude: 2,
      radiusLongitude: 22,
      radiusLatitude: 54,
      tilt: -8,
      depth: 0.78,
      trench: 0.58
    },
    {
      id: "central-great-strait-floor",
      label: "Central Great Strait Floor",
      longitude: 18,
      latitude: 8,
      radiusLongitude: 20,
      radiusLatitude: 62,
      tilt: 12,
      depth: 0.66,
      trench: 0.44
    },
    {
      id: "east-blue-channel-floor",
      label: "East Blue Channel Floor",
      longitude: 128,
      latitude: 6,
      radiusLongitude: 22,
      radiusLatitude: 54,
      tilt: -18,
      depth: 0.70,
      trench: 0.48
    },
    {
      id: "southern-cold-abyss",
      label: "Southern Cold Abyss",
      longitude: -60,
      latitude: -58,
      radiusLongitude: 50,
      radiusLatitude: 18,
      tilt: 4,
      depth: 0.74,
      trench: 0.38
    },
    {
      id: "far-east-lagoon-basin",
      label: "Far East Lagoon Basin",
      longitude: 176,
      latitude: -26,
      radiusLongitude: 24,
      radiusLatitude: 30,
      tilt: 22,
      depth: 0.46,
      trench: 0.22
    }
  ]);

  const SUMMIT_UPLIFT = Object.freeze({
    gratitude: 0.24,
    balance: 0.20,
    stability: 0.34,
    peace: 0.14,
    joy: 0.18,
    dignity: 0.42,
    "free-will": 0.28,
    love: 0.18,
    stewardship: 0.26
  });

  function M() {
    return window.DGB_PLANET_FAMILY_MATH || window.AUDRALIA_CLEAN_CANVAS_MATH || null;
  }

  function L() {
    return window.DGB_PLANET_FAMILY_LATTICE || window.AUDRALIA_CLEAN_CANVAS_LATTICE || null;
  }

  function LM() {
    return window.AUDRALIA_LANDMASK || window.AUDRALIA_CLEAN_CANVAS_LANDMASK || null;
  }

  function H() {
    return window.AUDRALIA_HYDROLOGY || window.AUDRALIA_CLEAN_CANVAS_HYDROLOGY || null;
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

  function rotatedEllipseScore(longitudeDegrees, latitudeDegrees, item, weightKey = "uplift") {
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

  function coordinatesFromUV(u, v) {
    const lattice = L();
    if (lattice?.coordinatesFromUV) return lattice.coordinatesFromUV(u, v);

    const row16 = clamp(Math.floor(clamp01(v) * 16), 0, 15);
    const col16 = clamp(Math.floor(wrap01(u) * 16), 0, 15);

    return Object.freeze({
      u: wrap01(u),
      v: clamp01(v),
      row16,
      col16,
      cell256: row16 * 16 + col16 + 1,
      cell64: Math.floor(row16 / 2) * 8 + Math.floor(col16 / 2) + 1,
      cell16: Math.floor(row16 / 4) * 4 + Math.floor(col16 / 4) + 1,
      quadrant: row16 < 8 ? col16 < 8 ? "NW" : "NE" : col16 < 8 ? "SW" : "SE",
      primarySummit: "Gratitude",
      secondarySummit: "Balance",
      internalSummit: "Stability"
    });
  }

  function sampleLandmaskFromInput(input, vMaybe) {
    if (input && typeof input === "object" && Number.isFinite(Number(input.u)) && Number.isFinite(Number(input.v))) {
      if (input.landmaskOwnsFootprint || input.footprintClass || input.landScore !== undefined) {
        return input;
      }

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
    const lattice = coordinatesFromUV(u, v);
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
      row16: lattice.row16,
      col16: lattice.col16,
      cell256: lattice.cell256,
      cell64: lattice.cell64,
      cell16: lattice.cell16,
      quadrant: lattice.quadrant,
      primarySummit: lattice.primarySummit,
      secondarySummit: lattice.secondarySummit,
      internalSummit: lattice.internalSummit,
      terrainClass: isOcean ? "ocean" : isShelf ? "shelf" : isBeach ? "beach" : "land",
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
        document.documentElement.dataset.audraliaElevationHydrologyReadFailed = "true";
      }
    }

    return Object.freeze({
      class: "hydrology-background",
      watershed: 0.24,
      drainage: 0.22,
      river: 0,
      dryChannel: 0,
      lake: 0,
      inlandSea: 0,
      wetland: 0,
      marsh: 0,
      bay: mask.isCoastal ? 0.28 : 0,
      inlet: mask.isCoastal ? 0.24 : 0,
      estuary: 0,
      delta: 0,
      lagoon: 0,
      coastalShelfWater: mask.isShelf ? 0.44 : 0,
      isInlandWater: false,
      isSurfaceWater: Boolean(mask.isOcean || mask.isShelf),
      visualGuidance: Object.freeze({
        shouldShapeLand: Boolean(mask.isCoastal),
        shouldSupportRiverCorridor: false,
        shouldSupportDryChannel: false
      })
    });
  }

  function normalizeSummitKey(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function summitUplift(mask) {
    const keys = [
      normalizeSummitKey(mask.primarySummit),
      normalizeSummitKey(mask.secondarySummit),
      normalizeSummitKey(mask.internalSummit)
    ];

    let value = 0.18;

    keys.forEach((key, index) => {
      const weight = index === 0 ? 0.52 : index === 1 ? 0.28 : 0.20;
      value += (SUMMIT_UPLIFT[key] ?? 0.18) * weight;
    });

    return clamp01(value);
  }

  function tectonicInfluence(mask) {
    let best = Object.freeze({
      id: "",
      label: "",
      score: 0,
      uplift: 0,
      ridge: 0,
      cliff: 0,
      basin: 0,
      plateau: 0
    });

    let uplift = 0;
    let ridge = 0;
    let cliff = 0;
    let basin = 0;
    let plateau = 0;

    for (const province of TECTONIC_PROVINCES) {
      const raw = rotatedEllipseScore(mask.longitudeDegrees, mask.latitudeDegrees, province, "uplift");
      const score = smoothstep(-0.52, 0.86, raw);

      if (score > best.score) {
        best = Object.freeze({
          id: province.id,
          label: province.label,
          score,
          uplift: province.uplift,
          ridge: province.ridge,
          cliff: province.cliff,
          basin: province.basin,
          plateau: province.plateau
        });
      }

      uplift += score * province.uplift * 0.26;
      ridge += score * province.ridge * 0.24;
      cliff += score * province.cliff * 0.22;
      basin += score * province.basin * 0.24;
      plateau += score * province.plateau * 0.22;
    }

    return Object.freeze({
      best,
      uplift: clamp01(uplift),
      ridge: clamp01(ridge),
      cliff: clamp01(cliff),
      basin: clamp01(basin),
      plateau: clamp01(plateau)
    });
  }

  function seafloorInfluence(mask) {
    let best = Object.freeze({
      id: "",
      label: "",
      score: 0,
      depth: 0,
      trench: 0
    });

    let depth = 0;
    let trench = 0;

    for (const basin of SEAFLOOR_BASINS) {
      const raw = rotatedEllipseScore(mask.longitudeDegrees, mask.latitudeDegrees, basin, "depth");
      const score = smoothstep(-0.50, 0.82, raw);

      if (score > best.score) {
        best = Object.freeze({
          id: basin.id,
          label: basin.label,
          score,
          depth: basin.depth,
          trench: basin.trench
        });
      }

      depth += score * basin.depth * 0.28;
      trench += score * basin.trench * 0.24;
    }

    return Object.freeze({
      best,
      depth: clamp01(depth),
      trench: clamp01(trench)
    });
  }

  function computeLandElevation(mask, hydro) {
    const u = wrap01(mask.u);
    const v = clamp01(mask.v);
    const latitude = finite(mask.latitudeDegrees, 0);
    const absLat = Math.abs(latitude);
    const coast = clamp01(mask.coastProximity);
    const landScore = finite(mask.landScore, 0);
    const tectonic = tectonicInfluence(mask);
    const summit = summitUplift(mask);

    const broadUplift = fbm2(u * 0.78 + 0.11, v * 0.66 - 0.07, { seed: 10001, scale: 2.6, octaves: 5 });
    const ancientPlate = fbm2(u * 1.34 - 0.19, v * 1.08 + 0.17, { seed: 10002, scale: 3.2, octaves: 5 });
    const mountainBelt = ridgeNoise2(u * 1.82 + 0.23, v * 1.48 - 0.16, { seed: 10003, scale: 3.8, octaves: 5 });
    const fineRidge = ridgeNoise2(u * 5.1 - 0.31, v * 4.0 + 0.22, { seed: 10004, scale: 6.2, octaves: 4 });
    const fracture = ridgeNoise2(u * 12.6 + 0.14, v * 9.8 - 0.27, { seed: 10005, scale: 11.0, octaves: 3 });
    const basinField = 1 - ridgeNoise2(u * 1.54 - 0.18, v * 1.26 + 0.11, { seed: 10006, scale: 3.0, octaves: 4 });
    const erosion = fbm2(u * 18.0 + 0.21, v * 15.5 - 0.12, { seed: 10007, scale: 16.0, octaves: 3 });

    const hydrologyDepression = clamp01(
      hydro.lake * 0.30 +
      hydro.inlandSea * 0.34 +
      hydro.wetland * 0.16 +
      hydro.marsh * 0.18 +
      hydro.river * 0.10
    );

    const drainageCut = clamp01(
      hydro.drainage * 0.22 +
      hydro.river * 0.30 +
      hydro.dryChannel * 0.18 +
      hydro.delta * 0.18 +
      hydro.estuary * 0.16
    );

    const coastalFalloff = clamp01(
      coast * 0.42 +
      (mask.isBeach ? 0.28 : 0) +
      (mask.isCoastal ? 0.10 : 0)
    );

    const polarLift = smoothstep(58, 82, absLat) * 0.08;
    const snowPressure = smoothstep(48, 78, absLat);

    let elevation01 =
      broadUplift * 0.18 +
      ancientPlate * 0.16 +
      mountainBelt * 0.20 +
      fineRidge * 0.08 +
      tectonic.uplift * 0.28 +
      summit * 0.18 +
      smoothstep(0.04, 0.58, landScore) * 0.22 +
      polarLift;

    elevation01 -= basinField * (0.08 + tectonic.basin * 0.18);
    elevation01 -= hydrologyDepression * 0.22;
    elevation01 -= drainageCut * 0.08;
    elevation01 -= coastalFalloff * 0.20;

    if (mask.isBeach) {
      elevation01 = Math.min(elevation01, 0.18 + coast * 0.10);
    }

    if (mask.isPolarIce) {
      elevation01 = Math.max(elevation01, 0.30 + polarLift);
    }

    elevation01 = clamp01(elevation01);

    const ridge = clamp01(
      mountainBelt * 0.34 +
      fineRidge * 0.30 +
      tectonic.ridge * 0.32 +
      fracture * 0.12 -
      hydrologyDepression * 0.10
    );

    const mountain = clamp01(
      smoothstep(0.52, 0.84, elevation01) * 0.42 +
      ridge * 0.36 +
      tectonic.uplift * 0.20 +
      tectonic.ridge * 0.12 -
      coastalFalloff * 0.10
    );

    const cliff = clamp01(
      fracture * 0.28 +
      tectonic.cliff * 0.38 +
      smoothstep(0.54, 0.88, ridge) * 0.20 +
      coast * 0.12
    );

    const basin = clamp01(
      basinField * 0.36 +
      tectonic.basin * 0.42 +
      hydrologyDepression * 0.30 +
      (1 - elevation01) * 0.14
    );

    const valley = clamp01(
      drainageCut * 0.44 +
      hydro.watershed * 0.14 +
      basin * 0.18 +
      ridgeNoise2(u * 8.2 + 0.09, v * 6.8 - 0.18, { seed: 10008, scale: 7.2, octaves: 3 }) * 0.18
    );

    const plateau = clamp01(
      ancientPlate * 0.24 +
      tectonic.plateau * 0.42 +
      smoothstep(0.38, 0.70, elevation01) * 0.20 -
      ridge * 0.08 -
      valley * 0.08
    );

    const coastalRise = clamp01(
      coast * smoothstep(0.16, 0.54, elevation01) * 0.56 +
      cliff * coast * 0.22 +
      (mask.isBeach ? 0.22 : 0)
    );

    const relief = clamp01(
      Math.abs(mountainBelt - basinField) * 0.26 +
      ridge * 0.24 +
      mountain * 0.28 +
      cliff * 0.20 +
      valley * 0.12
    );

    const slope = clamp01(
      fineRidge * 0.22 +
      fracture * 0.22 +
      ridge * 0.20 +
      cliff * 0.24 +
      mountain * 0.16 -
      plateau * 0.08
    );

    const snowline = clamp01(
      snowPressure * 0.40 +
      mountain * 0.34 +
      smoothstep(0.66, 0.90, elevation01) * 0.20 +
      (mask.isPolarIce ? 0.34 : 0)
    );

    const shadowPressure = clamp01(
      slope * 0.28 +
      cliff * 0.30 +
      mountain * 0.22 +
      valley * 0.14 +
      basin * 0.08
    );

    return Object.freeze({
      elevation01,
      aboveSea: elevation01,
      belowSeaDepth: 0,
      broadUplift,
      ancientPlate,
      mountainBelt,
      fineRidge,
      fracture,
      basinField,
      erosion,
      ridge,
      mountain,
      cliff,
      basin,
      valley,
      plateau,
      coastalRise,
      relief,
      slope,
      snowline,
      shadowPressure,
      hydrologyDepression,
      drainageCut,
      coastalFalloff,
      tectonicProvinceId: tectonic.best.id,
      tectonicProvinceLabel: tectonic.best.label,
      tectonicUplift: tectonic.uplift,
      summitUplift: summit
    });
  }

  function computeWaterDepth(mask, hydro) {
    const u = wrap01(mask.u);
    const v = clamp01(mask.v);
    const coast = clamp01(mask.coastProximity);
    const shelf = clamp01(mask.shelf);
    const seafloor = seafloorInfluence(mask);

    const broadDepth = fbm2(u * 0.86 + 0.16, v * 0.72 - 0.21, { seed: 11001, scale: 2.5, octaves: 5 });
    const abyssNoise = fbm2(u * 1.7 - 0.24, v * 1.4 + 0.18, { seed: 11002, scale: 3.2, octaves: 5 });
    const trenchLine = ridgeNoise2(u * 3.2 + 0.18, v * 2.6 - 0.29, { seed: 11003, scale: 4.8, octaves: 4 });
    const shelfLift = clamp01(shelf * 0.42 + coast * 0.36 + hydro.coastalShelfWater * 0.22);

    let belowSeaDepth =
      broadDepth * 0.28 +
      abyssNoise * 0.22 +
      seafloor.depth * 0.32 +
      trenchLine * seafloor.trench * 0.24 -
      shelfLift * 0.40;

    if (mask.isShelf) {
      belowSeaDepth = Math.min(belowSeaDepth, 0.22 + (1 - shelf) * 0.22);
    }

    if (mask.isBeach) {
      belowSeaDepth = 0;
    }

    belowSeaDepth = clamp01(belowSeaDepth);

    const shelfDepth = mask.isShelf ? clamp01(0.08 + (1 - shelf) * 0.36 + hydro.coastalShelfWater * 0.12) : 0;
    const seaFloorRelief = clamp01(trenchLine * 0.24 + seafloor.trench * 0.30 + abyssNoise * 0.18);
    const trench = clamp01(trenchLine * seafloor.trench + seafloor.depth * 0.20);

    return Object.freeze({
      elevation01: 0,
      aboveSea: 0,
      belowSeaDepth,
      shelfDepth,
      seaFloorRelief,
      trench,
      broadDepth,
      abyssNoise,
      trenchLine,
      shelfLift,
      seafloorBasinId: seafloor.best.id,
      seafloorBasinLabel: seafloor.best.label,
      ridge: 0,
      mountain: 0,
      cliff: mask.isCoastal ? coast * 0.16 : 0,
      basin: belowSeaDepth,
      valley: trench * 0.24,
      plateau: 0,
      coastalRise: mask.isShelf ? shelf * 0.14 : 0,
      relief: seaFloorRelief,
      slope: clamp01(seaFloorRelief * 0.42 + trench * 0.26),
      snowline: 0,
      shadowPressure: clamp01(belowSeaDepth * 0.30 + trench * 0.22)
    });
  }

  function classifyElevation(mask, fields) {
    if (mask.isOcean) {
      if (fields.trench > 0.58) return ["abyssal-trench", "ocean-depth", "deep-seafloor-trench"];
      if (fields.belowSeaDepth > 0.64) return ["deep-sea", "ocean-depth", "deep-ocean-basin"];
      return ["sea-floor", "ocean-depth", "open-ocean-floor"];
    }

    if (mask.isShelf) {
      return ["shelf-depth", "coastal-depth", "continental-shelf-floor"];
    }

    if (mask.isBeach) {
      return ["beach-rise", "coastal-rise", "beach-to-land-rise"];
    }

    if (fields.snowline > 0.74 && fields.mountain > 0.54) {
      return ["snow-alpine", "alpine", "snowline-mountain"];
    }

    if (fields.mountain > 0.70 && fields.ridge > 0.56) {
      return ["mountain", "mountain-belt", "ancient-mountain-range"];
    }

    if (fields.cliff > 0.70 && fields.coastalRise > 0.36) {
      return ["coastal-cliff", "coastal-escarpment", "coastal-cliff-rise"];
    }

    if (fields.cliff > 0.70) {
      return ["cliff", "interior-escarpment", "fracture-cliff"];
    }

    if (fields.plateau > 0.66 && fields.elevation01 > 0.40) {
      return ["plateau", "raised-tableland", "ancient-plateau"];
    }

    if (fields.valley > 0.66 && fields.basin > 0.44) {
      return ["valley", "drainage-basin", "valley-channel"];
    }

    if (fields.basin > 0.70) {
      return ["basin", "low-interior", "ancient-basin"];
    }

    if (fields.coastalRise > 0.52) {
      return ["coastal-rise", "coastal-landrise", "raised-terrain-behind-beach"];
    }

    if (fields.elevation01 > 0.56 || fields.relief > 0.56) {
      return ["highland", "highland", "highland-shoulder"];
    }

    return ["plain", "rolling-lowland", "weathered-plain"];
  }

  function sampleElevation(input, vMaybe) {
    const mask = sampleLandmaskFromInput(input, vMaybe);
    const hydro = sampleHydrologyForMask(mask);
    const fields = mask.isOcean || mask.isShelf
      ? computeWaterDepth(mask, hydro)
      : computeLandElevation(mask, hydro);

    const classification = classifyElevation(mask, fields);
    const className = classification[0];
    const zone = classification[1];
    const form = classification[2];

    return Object.freeze({
      allowed: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-vertical-depth",
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
      landformClass: mask.landformClass,
      isOcean: mask.isOcean,
      isShelf: mask.isShelf,
      isBeach: mask.isBeach,
      isLand: mask.isLand,
      isCoastal: mask.isCoastal,
      isPolarIce: mask.isPolarIce,

      class: className,
      zone,
      form,
      elevationClass: className,
      elevationZone: zone,
      elevationForm: form,

      elevation01: fields.elevation01,
      height: fields.elevation01,
      altitude: fields.elevation01,
      aboveSea: fields.aboveSea,
      belowSeaDepth: fields.belowSeaDepth,
      shelfDepth: fields.shelfDepth || 0,
      seaFloorRelief: fields.seaFloorRelief || 0,
      trench: fields.trench || 0,

      relief: fields.relief,
      slope: fields.slope,
      basin: fields.basin,
      ridge: fields.ridge,
      mountain: fields.mountain,
      cliff: fields.cliff,
      plateau: fields.plateau,
      valley: fields.valley,
      coastalRise: fields.coastalRise,
      snowline: fields.snowline,
      shadowPressure: fields.shadowPressure,

      broadUplift: fields.broadUplift || 0,
      ancientPlate: fields.ancientPlate || 0,
      mountainBelt: fields.mountainBelt || 0,
      fineRidge: fields.fineRidge || 0,
      fracture: fields.fracture || 0,
      basinField: fields.basinField || 0,
      erosion: fields.erosion || 0,
      hydrologyDepression: fields.hydrologyDepression || 0,
      drainageCut: fields.drainageCut || 0,
      coastalFalloff: fields.coastalFalloff || 0,

      tectonicProvinceId: fields.tectonicProvinceId || "",
      tectonicProvinceLabel: fields.tectonicProvinceLabel || "",
      seafloorBasinId: fields.seafloorBasinId || "",
      seafloorBasinLabel: fields.seafloorBasinLabel || "",

      sourceReads: Object.freeze({
        landmask: Boolean(mask.landmaskOwnsFootprint || mask.ownsFootprint || mask.footprintClass),
        hydrology: Boolean(hydro.contract === "AUDRALIA_CLEAN_CANVAS_HYDROLOGY_TNT_v1"),
        lattice: Boolean(L()?.coordinatesFromUV),
        math: Boolean(M()?.fbm2)
      }),

      visualGuidance: Object.freeze({
        shouldRaiseTerrain: fields.elevation01 > 0.38,
        shouldShowMountainTexture: fields.mountain > 0.48 || fields.ridge > 0.52,
        shouldShowCliffShadow: fields.cliff > 0.46,
        shouldShowValleyShadow: fields.valley > 0.46,
        shouldShowBasinLowland: fields.basin > 0.50,
        shouldShowPlateauShoulder: fields.plateau > 0.46,
        shouldShowCoastalRise: fields.coastalRise > 0.38,
        shouldShowSnowOrIce: fields.snowline > 0.54 || mask.isPolarIce,
        shouldShowSeaDepth: fields.belowSeaDepth > 0.30,
        shouldShowShelfDepth: (fields.shelfDepth || 0) > 0.12
      }),

      ownsFootprint: false,
      ownsLandSea: false,
      ownsHydrology: false,
      ownsWaterBehavior: false,
      ownsElevation: true,
      ownsVerticalDepth: true,
      ownsClimate: false,
      ownsBiome: false,
      ownsSurface: false,
      ownsAtmosphere: false,
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
    return sampleElevation(input, vMaybe);
  }

  function classify(input, vMaybe) {
    return sampleElevation(input, vMaybe).class;
  }

  function estimateElevation(width = 128, height = 64) {
    const w = clamp(Math.floor(finite(width, 128)), 16, 384);
    const h = clamp(Math.floor(finite(height, 64)), 8, 192);

    let mountains = 0;
    let ridges = 0;
    let cliffs = 0;
    let basins = 0;
    let valleys = 0;
    let plateaus = 0;
    let shelves = 0;
    let deepSea = 0;
    let snow = 0;
    let total = 0;

    for (let y = 0; y < h; y += 1) {
      const v = (y + 0.5) / h;

      for (let x = 0; x < w; x += 1) {
        const u = (x + 0.5) / w;
        const elevation = sampleElevation(u, v);

        total += 1;
        if (elevation.mountain > 0.52) mountains += 1;
        if (elevation.ridge > 0.52) ridges += 1;
        if (elevation.cliff > 0.48) cliffs += 1;
        if (elevation.basin > 0.54) basins += 1;
        if (elevation.valley > 0.52) valleys += 1;
        if (elevation.plateau > 0.50) plateaus += 1;
        if (elevation.shelfDepth > 0.12) shelves += 1;
        if (elevation.belowSeaDepth > 0.52) deepSea += 1;
        if (elevation.snowline > 0.54) snow += 1;
      }
    }

    const denominator = Math.max(1, total);

    return Object.freeze({
      samples: total,
      mountainSignalRatio: Number((mountains / denominator).toFixed(4)),
      ridgeSignalRatio: Number((ridges / denominator).toFixed(4)),
      cliffSignalRatio: Number((cliffs / denominator).toFixed(4)),
      basinSignalRatio: Number((basins / denominator).toFixed(4)),
      valleySignalRatio: Number((valleys / denominator).toFixed(4)),
      plateauSignalRatio: Number((plateaus / denominator).toFixed(4)),
      shelfDepthRatio: Number((shelves / denominator).toFixed(4)),
      deepSeaRatio: Number((deepSea / denominator).toFixed(4)),
      snowlineRatio: Number((snow / denominator).toFixed(4))
    });
  }

  function getTectonicProvinces() {
    return Object.freeze(TECTONIC_PROVINCES.map((province) => Object.freeze({ ...province })));
  }

  function getSeafloorBasins() {
    return Object.freeze(SEAFLOOR_BASINS.map((basin) => Object.freeze({ ...basin })));
  }

  function validateManifestRegistration() {
    try {
      const manifest = window.DGB_PLANET_FAMILY_MANIFEST || window.AUDRALIA_CLEAN_CANVAS_MANIFEST;
      if (!manifest || typeof manifest.validatePrimaryFile !== "function") {
        return Object.freeze({
          manifestAvailable: false,
          valid: true,
          reason: "manifest_not_loaded_yet_elevation_can_still_register"
        });
      }

      return manifest.validatePrimaryFile({
        path: "/assets/audralia/clean/audralia.elevation.js",
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
    const lattice = L();
    const landmask = LM();
    const hydrology = H();

    return Object.freeze({
      math: Object.freeze({
        available: Boolean(math),
        expectedContract: "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_MATH_TNT_v1",
        actualContract: math?.contract || null,
        valid: !math || math.contract === "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_MATH_TNT_v1"
      }),
      lattice: Object.freeze({
        available: Boolean(lattice),
        expectedContract: "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_LATTICE_TNT_v1",
        actualContract: lattice?.contract || null,
        valid: !lattice || lattice.contract === "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_LATTICE_TNT_v1"
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
      })
    });
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-vertical-depth",
      fileNumber: FILE_NUMBER,
      primaryNode: PRIMARY_NODE,
      subnodes: SUBNODE_RANGE,
      parentAnchor: AUDRALIA_ROUTE,
      universalParent: UNIVERSAL_ANCHOR,
      downstreamGroundView: H_EARTH_ROUTE,
      targets: ELEVATION_TARGETS,
      tectonicProvinces: TECTONIC_PROVINCES.length,
      seafloorBasins: SEAFLOOR_BASINS.length,
      elevationEstimate: estimateElevation(96, 48),
      owns: Object.freeze([
        "vertical depth",
        "mountains",
        "ridges",
        "cliffs",
        "escarpments",
        "basins",
        "valleys",
        "plateaus",
        "coastal rise",
        "shelf depth",
        "seafloor depth",
        "snowline pressure",
        "shadow pressure"
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
        "climate fields",
        "biome categories",
        "surface material synthesis",
        "atmosphere behavior",
        "weather behavior",
        "runtime motion",
        "controls",
        "canvas composition",
        "route bridge",
        "HTML expression"
      ]),
      manifestRegistration: validateManifestRegistration(),
      priorAuthorities: validatePriorAuthorities(),
      hEarthReceivesElevationThroughAudralia: true,
      footprintCreationForbidden: true,
      waterBehaviorCreationForbidden: true,
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
    ELEVATION_TARGETS,

    sampleElevation,
    sample,
    classify,
    estimateElevation,
    getTectonicProvinces,
    getSeafloorBasins,
    validateManifestRegistration,
    validatePriorAuthorities,
    getStatus
  });

  window.AUDRALIA_ELEVATION = API;
  window.AUDRALIA_ELEVATION_RECEIPT = getStatus();

  window.AUDRALIA_CLEAN_CANVAS_ELEVATION = API;
  window.AUDRALIA_CLEAN_CANVAS_ELEVATION_RECEIPT = getStatus();

  if (document?.documentElement?.dataset) {
    document.documentElement.dataset.audraliaElevationLoaded = "true";
    document.documentElement.dataset.audraliaElevationContract = CONTRACT;
    document.documentElement.dataset.audraliaElevationReceipt = RECEIPT;
    document.documentElement.dataset.audraliaElevationVersion = VERSION;
    document.documentElement.dataset.audraliaCleanCanvasElevationLoaded = "true";
    document.documentElement.dataset.audraliaCleanCanvasElevationContract = CONTRACT;
    document.documentElement.dataset.audraliaCleanCanvasElevationReceipt = RECEIPT;
    document.documentElement.dataset.audraliaCleanCanvasElevationNode = String(PRIMARY_NODE);
    document.documentElement.dataset.audraliaCleanCanvasElevationSubnodes = "113-128";
    document.documentElement.dataset.audraliaElevationOwnsVerticalDepth = "true";
    document.documentElement.dataset.audraliaElevationOwnsFootprint = "false";
    document.documentElement.dataset.audraliaElevationOwnsHydrology = "false";
    document.documentElement.dataset.audraliaElevationOwnsClimate = "false";
    document.documentElement.dataset.audraliaElevationOwnsSurface = "false";
    document.documentElement.dataset.audraliaElevationMountains = "true";
    document.documentElement.dataset.audraliaElevationRidges = "true";
    document.documentElement.dataset.audraliaElevationCliffs = "true";
    document.documentElement.dataset.audraliaElevationBasins = "true";
    document.documentElement.dataset.audraliaElevationValleys = "true";
    document.documentElement.dataset.audraliaElevationPlateaus = "true";
    document.documentElement.dataset.audraliaElevationShelfDepth = "true";
    document.documentElement.dataset.audraliaElevationSeafloorDepth = "true";
    document.documentElement.dataset.hEarthReceivesAudraliaElevation = "true";
    document.documentElement.dataset.audraliaCleanCanvasFibonacciChronology = "true";
    document.documentElement.dataset.audraliaCleanCanvasPrimaryStructure16 = "true";
    document.documentElement.dataset.audraliaCleanCanvasNodalConstruct256 = "true";
    document.documentElement.dataset.audraliaCleanCanvasOneFileOneJob = "true";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }
})();

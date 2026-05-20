// /assets/audralia/clean/audralia.landmask.js
// AUDRALIA_CLEAN_CANVAS_LANDMASK_TNT_v1
// Full-file replacement.
// File 6 of 16.
// Planet Audralia land/ocean footprint authority.
// Purpose:
// - Establishes Audralia-specific land/ocean footprint authority.
// - Defines continents, separated landmasses, islands, shelves, beaches, bays, inlets, straits, and seaways.
// - Prevents one-big-landmass collapse by cutting physical ocean corridors into the planet body.
// - Consumes universal planet-family math and lattice when available.
// - Consumes Audralia identity when available.
// - Does not render.
// - Does not mount.
// - Does not draw.
// - Does not own hydrology behavior, elevation depth, climate fields, biome categories, surface material synthesis, atmosphere/weather, runtime, controls, canvas, route bridge, or HTML shell.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_CLEAN_CANVAS_LANDMASK_TNT_v1";
  const RECEIPT = "AUDRALIA_CLEAN_CANVAS_LANDMASK_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_CLEAN_CANVAS_IDENTITY_TNT_v1";
  const VERSION = "2026-05-20.audralia-clean-canvas-landmask-v1";

  const FILE_NUMBER = 6;
  const PRIMARY_NODE = 6;
  const SUBNODE_RANGE = Object.freeze([81, 96]);

  const UNIVERSAL_ANCHOR = "/showroom/globe/";
  const AUDRALIA_ROUTE = "/showroom/globe/audralia/";

  const TARGET_RATIOS = Object.freeze({
    landRatioApprox: "0.33_to_0.43",
    oceanRatioApprox: "0.57_to_0.67",
    shelfAndBeachVisible: true,
    separatedLandmassesRequired: true,
    oceanCorridorsRequired: true,
    islandChainsRequired: true,
    oneBigGlobPrevented: true
  });

  const LAND_BODIES = Object.freeze([
    {
      id: "west-crown-continent",
      label: "West Crown Continent",
      family: "continent",
      longitude: -138,
      latitude: 14,
      radiusLongitude: 34,
      radiusLatitude: 28,
      tilt: -16,
      weight: 1.10,
      coastRoughness: 0.42
    },
    {
      id: "west-south-shoulder",
      label: "West South Shoulder",
      family: "subcontinent",
      longitude: -116,
      latitude: -28,
      radiusLongitude: 28,
      radiusLatitude: 22,
      tilt: 24,
      weight: 0.78,
      coastRoughness: 0.36
    },
    {
      id: "northwest-island-continent",
      label: "Northwest Island Continent",
      family: "large-island",
      longitude: -158,
      latitude: 48,
      radiusLongitude: 24,
      radiusLatitude: 15,
      tilt: -8,
      weight: 0.54,
      coastRoughness: 0.50
    },
    {
      id: "central-green-continent",
      label: "Central Green Continent",
      family: "continent",
      longitude: -38,
      latitude: 4,
      radiusLongitude: 44,
      radiusLatitude: 32,
      tilt: 10,
      weight: 1.18,
      coastRoughness: 0.48
    },
    {
      id: "central-north-lobe",
      label: "Central North Lobe",
      family: "continental-lobe",
      longitude: -58,
      latitude: 38,
      radiusLongitude: 25,
      radiusLatitude: 18,
      tilt: -24,
      weight: 0.62,
      coastRoughness: 0.34
    },
    {
      id: "central-south-lobe",
      label: "Central South Lobe",
      family: "continental-lobe",
      longitude: -20,
      latitude: -36,
      radiusLongitude: 31,
      radiusLatitude: 21,
      tilt: 18,
      weight: 0.70,
      coastRoughness: 0.42
    },
    {
      id: "east-sunrise-subcontinent",
      label: "East Sunrise Subcontinent",
      family: "subcontinent",
      longitude: 72,
      latitude: 2,
      radiusLongitude: 38,
      radiusLatitude: 30,
      tilt: -12,
      weight: 0.96,
      coastRoughness: 0.44
    },
    {
      id: "east-north-plate",
      label: "East North Plate",
      family: "large-island",
      longitude: 110,
      latitude: 36,
      radiusLongitude: 27,
      radiusLatitude: 20,
      tilt: 20,
      weight: 0.62,
      coastRoughness: 0.38
    },
    {
      id: "east-south-plate",
      label: "East South Plate",
      family: "large-island",
      longitude: 96,
      latitude: -40,
      radiusLongitude: 28,
      radiusLatitude: 18,
      tilt: -28,
      weight: 0.58,
      coastRoughness: 0.44
    },
    {
      id: "far-east-arc-land",
      label: "Far East Arc Land",
      family: "island-continent",
      longitude: 154,
      latitude: -10,
      radiusLongitude: 28,
      radiusLatitude: 25,
      tilt: 8,
      weight: 0.64,
      coastRoughness: 0.54
    },
    {
      id: "southern-long-land",
      label: "Southern Long Land",
      family: "southern-landmass",
      longitude: 24,
      latitude: -62,
      radiusLongitude: 62,
      radiusLatitude: 14,
      tilt: 2,
      weight: 0.44,
      coastRoughness: 0.50
    },
    {
      id: "north-polar-fragment",
      label: "North Polar Fragment",
      family: "polar-fragment",
      longitude: 34,
      latitude: 70,
      radiusLongitude: 42,
      radiusLatitude: 12,
      tilt: -6,
      weight: 0.32,
      coastRoughness: 0.36
    }
  ]);

  const OCEAN_CORRIDORS = Object.freeze([
    {
      id: "west-central-seaway",
      label: "West Central Seaway",
      longitude: -86,
      latitude: 4,
      radiusLongitude: 16,
      radiusLatitude: 58,
      tilt: -8,
      weight: 0.94
    },
    {
      id: "central-great-strait",
      label: "Central Great Strait",
      longitude: 18,
      latitude: 8,
      radiusLongitude: 18,
      radiusLatitude: 64,
      tilt: 12,
      weight: 0.98
    },
    {
      id: "east-blue-channel",
      label: "East Blue Channel",
      longitude: 128,
      latitude: 6,
      radiusLongitude: 18,
      radiusLatitude: 56,
      tilt: -18,
      weight: 0.84
    },
    {
      id: "north-inner-sea",
      label: "North Inner Sea",
      longitude: -8,
      latitude: 49,
      radiusLongitude: 40,
      radiusLatitude: 16,
      tilt: -14,
      weight: 0.58
    },
    {
      id: "south-inner-basin",
      label: "South Inner Basin",
      longitude: -70,
      latitude: -54,
      radiusLongitude: 46,
      radiusLatitude: 19,
      tilt: 4,
      weight: 0.58
    },
    {
      id: "far-east-lagoon-break",
      label: "Far East Lagoon Break",
      longitude: 176,
      latitude: -26,
      radiusLongitude: 20,
      radiusLatitude: 28,
      tilt: 22,
      weight: 0.44
    }
  ]);

  const ISLAND_CHAINS = Object.freeze([
    {
      id: "western-outer-pearls",
      label: "Western Outer Pearls",
      longitude: -172,
      latitude: -42,
      count: 6,
      spacingLongitude: 8,
      spacingLatitude: 5,
      radiusLongitude: 7,
      radiusLatitude: 4,
      tilt: 18,
      weight: 0.38
    },
    {
      id: "north-equatorial-steps",
      label: "North Equatorial Steps",
      longitude: -10,
      latitude: 28,
      count: 7,
      spacingLongitude: 10,
      spacingLatitude: -3,
      radiusLongitude: 7,
      radiusLatitude: 4,
      tilt: -20,
      weight: 0.34
    },
    {
      id: "eastern-sunrise-arc",
      label: "Eastern Sunrise Arc",
      longitude: 132,
      latitude: 44,
      count: 6,
      spacingLongitude: 7,
      spacingLatitude: 4,
      radiusLongitude: 7,
      radiusLatitude: 4,
      tilt: 24,
      weight: 0.36
    },
    {
      id: "southern-shelf-islands",
      label: "Southern Shelf Islands",
      longitude: 34,
      latitude: -48,
      count: 8,
      spacingLongitude: 8,
      spacingLatitude: -2,
      radiusLongitude: 6,
      radiusLatitude: 3.5,
      tilt: -8,
      weight: 0.32
    }
  ]);

  const COASTAL_BITE_FIELDS = Object.freeze([
    {
      id: "free-will-bay-field",
      longitude: -50,
      latitude: -8,
      radiusLongitude: 18,
      radiusLatitude: 30,
      tilt: 16,
      weight: 0.22
    },
    {
      id: "joy-inlet-field",
      longitude: 88,
      latitude: -18,
      radiusLongitude: 16,
      radiusLatitude: 28,
      tilt: -24,
      weight: 0.20
    },
    {
      id: "peace-north-bay",
      longitude: -18,
      latitude: 42,
      radiusLongitude: 22,
      radiusLatitude: 18,
      tilt: 8,
      weight: 0.18
    },
    {
      id: "stewardship-south-bay",
      longitude: 42,
      latitude: -42,
      radiusLongitude: 24,
      radiusLatitude: 16,
      tilt: -6,
      weight: 0.20
    }
  ]);

  const LANDFORM_ROLES = Object.freeze({
    continent: "large-separated-land-body",
    subcontinent: "secondary-separated-land-body",
    "continental-lobe": "continent-attached-lobe",
    "large-island": "large-island-body",
    "island-continent": "island-continent-body",
    "southern-landmass": "southern-land-body",
    "polar-fragment": "polar-land-fragment",
    islandChain: "archipelago-chain",
    ocean: "open-ocean",
    shelf: "continental-shelf",
    beach: "coastal-beach"
  });

  function M() {
    return window.DGB_PLANET_FAMILY_MATH || window.AUDRALIA_CLEAN_CANVAS_MATH || null;
  }

  function L() {
    return window.DGB_PLANET_FAMILY_LATTICE || window.AUDRALIA_CLEAN_CANVAS_LATTICE || null;
  }

  function I() {
    return window.AUDRALIA_IDENTITY || window.AUDRALIA_CLEAN_CANVAS_IDENTITY || null;
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

  function uvToLonLat(u, v) {
    const helper = M();
    if (helper?.uvToLonLat) return helper.uvToLonLat(u, v);
    const uu = wrap01(u);
    const vv = clamp01(v);
    return Object.freeze({
      u: uu,
      v: vv,
      longitudeDegrees: uu * 360 - 180,
      latitudeDegrees: 90 - vv * 180,
      longitudeRadians: uu * Math.PI * 2 - Math.PI,
      latitudeRadians: Math.PI / 2 - vv * Math.PI
    });
  }

  function lonLatToUV(longitudeDegrees, latitudeDegrees) {
    const helper = M();
    if (helper?.lonLatToUV) return helper.lonLatToUV(longitudeDegrees, latitudeDegrees);
    const lon = wrapDegrees(longitudeDegrees);
    const lat = clamp(latitudeDegrees, -90, 90);
    return Object.freeze({
      u: wrap01((lon + 180) / 360),
      v: clamp01((90 - lat) / 180),
      longitudeDegrees: lon,
      latitudeDegrees: lat,
      longitudeRadians: lon * Math.PI / 180,
      latitudeRadians: lat * Math.PI / 180
    });
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

  function rotatedEllipseScore(longitudeDegrees, latitudeDegrees, item) {
    const helper = M();
    if (helper?.rotatedLonLatEllipseScore) {
      return helper.rotatedLonLatEllipseScore(longitudeDegrees, latitudeDegrees, {
        longitudeDegrees: item.longitude,
        latitudeDegrees: item.latitude,
        radiusLongitudeDegrees: item.radiusLongitude,
        radiusLatitudeDegrees: item.radiusLatitude,
        tiltDegrees: item.tilt,
        weight: item.weight
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

    return finite(item.weight, 1) * (1 - q);
  }

  function latticeCoordinates(u, v) {
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
      cell4: row16 < 8 ? col16 < 8 ? 4 : 1 : col16 < 8 ? 3 : 2,
      quadrant: row16 < 8 ? col16 < 8 ? "NW" : "NE" : col16 < 8 ? "SW" : "SE",
      primarySummit: "Gratitude",
      secondarySummit: "Balance",
      internalSummit: "Stability",
      latitudeBand: "universal-lattice-fallback",
      longitudeBand: "universal-lattice-fallback"
    });
  }

  function summitPressure(lattice) {
    const primary = String(lattice.primarySummit || "").toLowerCase();
    const internal = String(lattice.internalSummit || "").toLowerCase();

    let land = 0;
    let coast = 0;
    let island = 0;

    if (primary.includes("stability") || internal.includes("stability")) land += 0.030;
    if (primary.includes("dignity") || internal.includes("dignity")) land += 0.020;
    if (primary.includes("gratitude") || internal.includes("gratitude")) land += 0.016;
    if (primary.includes("peace") || internal.includes("peace")) coast += 0.028;
    if (primary.includes("joy") || internal.includes("joy")) {
      coast += 0.035;
      island += 0.030;
    }
    if (primary.includes("free") || internal.includes("free")) {
      coast += 0.040;
      island += 0.020;
      land -= 0.012;
    }
    if (primary.includes("love") || internal.includes("love")) {
      land += 0.010;
      coast += 0.020;
    }
    if (primary.includes("stewardship") || internal.includes("stewardship")) {
      land += 0.014;
      coast += 0.018;
    }

    return Object.freeze({
      land,
      coast,
      island
    });
  }

  function islandChainScore(longitudeDegrees, latitudeDegrees, chain) {
    let best = -Infinity;
    let bestIndex = 0;

    for (let i = 0; i < chain.count; i += 1) {
      const offset = i - (chain.count - 1) * 0.5;
      const item = {
        longitude: wrapDegrees(chain.longitude + offset * chain.spacingLongitude),
        latitude: clamp(chain.latitude + offset * chain.spacingLatitude, -82, 82),
        radiusLongitude: chain.radiusLongitude * (0.82 + (i % 3) * 0.12),
        radiusLatitude: chain.radiusLatitude * (0.90 + (i % 2) * 0.14),
        tilt: chain.tilt,
        weight: chain.weight
      };

      const score = rotatedEllipseScore(longitudeDegrees, latitudeDegrees, item);

      if (score > best) {
        best = score;
        bestIndex = i + 1;
      }
    }

    return Object.freeze({
      score: best,
      chainId: chain.id,
      chainLabel: chain.label,
      islandIndex: bestIndex
    });
  }

  function rawLandField(uInput, vInput) {
    const u = wrap01(uInput);
    const v = clamp01(vInput);
    const lonLat = uvToLonLat(u, v);
    const longitude = lonLat.longitudeDegrees;
    const latitude = lonLat.latitudeDegrees;
    const absLat = Math.abs(latitude);
    const lattice = latticeCoordinates(u, v);
    const summit = summitPressure(lattice);

    const warpLongitude =
      longitude +
      (fbm2(u * 1.1 + 0.07, v * 1.3 - 0.11, { seed: 8101, scale: 3.2, octaves: 5 }) - 0.5) * 14 +
      Math.sin(latitude * Math.PI / 45) * 2.5;

    const warpLatitude =
      clamp(
        latitude +
        (fbm2(u * 2.0 - 0.19, v * 2.2 + 0.13, { seed: 8102, scale: 4.2, octaves: 5 }) - 0.5) * 9,
        -86,
        86
      );

    let bestLandScore = -Infinity;
    let bestBody = LAND_BODIES[0];
    let linkedLandPressure = 0;

    for (const body of LAND_BODIES) {
      const baseScore = rotatedEllipseScore(warpLongitude, warpLatitude, body);
      const coastNoise =
        (fbm2(u * 3.4 + body.longitude * 0.003, v * 3.8 + body.latitude * 0.004, { seed: 8201, scale: 5.0, octaves: 5 }) - 0.5) *
        body.coastRoughness *
        0.34;

      const fineBreak =
        (ridgeNoise2(u * 6.4 - body.latitude * 0.002, v * 5.7 + body.longitude * 0.002, { seed: 8202, scale: 6.0, octaves: 4 }) - 0.5) *
        body.coastRoughness *
        0.16;

      const score = baseScore + coastNoise + fineBreak;

      if (score > bestLandScore) {
        bestLandScore = score;
        bestBody = body;
      }

      linkedLandPressure += Math.pow(Math.max(0, score), 1.45) * 0.10;
    }

    let islandBest = Object.freeze({
      score: -Infinity,
      chainId: "",
      chainLabel: "",
      islandIndex: 0
    });

    for (const chain of ISLAND_CHAINS) {
      const candidate = islandChainScore(warpLongitude, warpLatitude, chain);
      const noisyScore =
        candidate.score +
        (fbm2(u * 8.8 + candidate.islandIndex * 0.13, v * 8.2 - candidate.islandIndex * 0.08, { seed: 8301, scale: 8.0, octaves: 3 }) - 0.5) * 0.16 +
        summit.island;

      if (noisyScore > islandBest.score) {
        islandBest = Object.freeze({
          score: noisyScore,
          chainId: candidate.chainId,
          chainLabel: candidate.chainLabel,
          islandIndex: candidate.islandIndex
        });
      }
    }

    let corridorCut = 0;
    let corridorId = "";

    for (const corridor of OCEAN_CORRIDORS) {
      const score = rotatedEllipseScore(warpLongitude, warpLatitude, corridor);

      if (score > 0) {
        const cut = smoothstep(0.02, 0.78, score) * corridor.weight;
        if (cut > corridorCut) {
          corridorCut = cut;
          corridorId = corridor.id;
        }
      }
    }

    let biteCut = 0;
    let biteId = "";

    for (const bite of COASTAL_BITE_FIELDS) {
      const score = rotatedEllipseScore(warpLongitude, warpLatitude, bite);

      if (score > 0) {
        const cut = smoothstep(0.04, 0.86, score) * bite.weight;
        if (cut > biteCut) {
          biteCut = cut;
          biteId = bite.id;
        }
      }
    }

    const nodalEdge =
      Math.sin((u * 16 + lattice.col16 * 0.21) * Math.PI * 2) * 0.015 +
      Math.sin((v * 16 + lattice.row16 * 0.18) * Math.PI * 2) * 0.014;

    const tectonicBreak =
      (ridgeNoise2(u * 2.8 + 0.17, v * 2.3 - 0.26, { seed: 8401, scale: 3.8, octaves: 5 }) - 0.5) * 0.070 +
      (fbm2(u * 9.2 - 0.31, v * 7.8 + 0.24, { seed: 8402, scale: 8.0, octaves: 3 }) - 0.5) * 0.035;

    const polarRestraint = smoothstep(76, 90, absLat) * 0.14;
    const oceanPreference = 0.060;

    const continentRaw =
      bestLandScore +
      linkedLandPressure +
      tectonicBreak +
      nodalEdge +
      summit.land -
      corridorCut -
      biteCut -
      polarRestraint -
      oceanPreference;

    const islandRaw =
      islandBest.score +
      tectonicBreak * 0.60 +
      summit.island -
      polarRestraint * 0.50 -
      0.030;

    const raw = Math.max(continentRaw, islandRaw);
    const selectedFamily = islandRaw > continentRaw ? "islandChain" : bestBody.family;
    const selectedId = islandRaw > continentRaw ? islandBest.chainId : bestBody.id;
    const selectedLabel = islandRaw > continentRaw ? islandBest.chainLabel : bestBody.label;

    return Object.freeze({
      u,
      v,
      longitudeDegrees: longitude,
      latitudeDegrees: latitude,
      warpedLongitudeDegrees: wrapDegrees(warpLongitude),
      warpedLatitudeDegrees: warpLatitude,
      lattice,
      raw,
      continentRaw,
      islandRaw,
      selectedId,
      selectedLabel,
      selectedFamily,
      corridorCut,
      corridorId,
      biteCut,
      biteId,
      summitLandPressure: summit.land,
      summitCoastPressure: summit.coast,
      summitIslandPressure: summit.island,
      tectonicBreak,
      nodalEdge,
      polarRestraint
    });
  }

  function classifyFromRaw(field) {
    const raw = field.raw;
    const absLat = Math.abs(field.latitudeDegrees);
    const shelfWidth = clamp(
      0.120 +
      field.summitCoastPressure +
      smoothstep(0.10, 0.72, field.corridorCut) * 0.035 +
      smoothstep(0.08, 0.62, field.biteCut) * 0.030,
      0.105,
      0.220
    );

    const beachWidth = clamp(
      0.030 +
      field.summitCoastPressure * 0.55 +
      smoothstep(0.12, 0.72, field.biteCut) * 0.018,
      0.028,
      0.075
    );

    const coastProximity = clamp(1 - Math.abs(raw) / Math.max(0.000001, shelfWidth + beachWidth), 0, 1);
    const isShelf = raw <= 0 && raw > -shelfWidth;
    const isBeach = raw > 0 && raw <= beachWidth;
    const isOcean = raw <= -shelfWidth;
    const isLandCore = raw > beachWidth;
    const isPolarIce = absLat >= 74 && (isLandCore || isBeach) && field.selectedFamily !== "islandChain";

    let className = "ocean";
    let form = "open-ocean";
    let role = LANDFORM_ROLES.ocean;

    if (isOcean) {
      className = "ocean";
      form = field.corridorCut > 0.45 ? "deep-seaway" : "open-ocean";
      role = LANDFORM_ROLES.ocean;
    } else if (isShelf) {
      className = "shelf";
      form = field.corridorCut > 0.35 ? "strait-shelf" : "continental-shelf";
      role = LANDFORM_ROLES.shelf;
    } else if (isBeach && !isPolarIce) {
      className = "beach";
      form = field.biteCut > 0.20 ? "bay-and-inlet-coast" : "coastal-beach";
      role = LANDFORM_ROLES.beach;
    } else if (isPolarIce) {
      className = "polar-land";
      form = "polar-ice-land-fragment";
      role = "polar-land";
    } else {
      className = "land";
      form = LANDFORM_ROLES[field.selectedFamily] || "separated-land-body";
      role = form;
    }

    return Object.freeze({
      className,
      form,
      role,
      shelfWidth,
      beachWidth,
      coastProximity,
      isOcean,
      isShelf,
      isBeach: isBeach && !isPolarIce,
      isLand: isLandCore || isPolarIce,
      isPolarIce,
      isWater: isOcean || isShelf,
      isCoastal: isShelf || isBeach || coastProximity > 0.34
    });
  }

  function sampleLandmask(uInput, vInput) {
    const field = rawLandField(uInput, vInput);
    const classification = classifyFromRaw(field);
    const lattice = field.lattice;

    return Object.freeze({
      allowed: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-land-ocean-footprint",
      fileNumber: FILE_NUMBER,
      primaryNode: PRIMARY_NODE,
      subnodes: SUBNODE_RANGE,

      u: field.u,
      v: field.v,
      longitudeDegrees: field.longitudeDegrees,
      latitudeDegrees: field.latitudeDegrees,
      warpedLongitudeDegrees: field.warpedLongitudeDegrees,
      warpedLatitudeDegrees: field.warpedLatitudeDegrees,

      row16: lattice.row16,
      col16: lattice.col16,
      cell256: lattice.cell256,
      cell64: lattice.cell64,
      cell16: lattice.cell16,
      cell4: lattice.cell4,
      quadrant: lattice.quadrant,
      latitudeBand: lattice.latitudeBand,
      longitudeBand: lattice.longitudeBand,
      primarySummit: lattice.primarySummit,
      secondarySummit: lattice.secondarySummit,
      internalSummit: lattice.internalSummit,

      terrainClass: classification.className,
      landformClass: classification.form,
      landformRole: classification.role,
      footprintClass:
        classification.isLand ? "land" :
        classification.isBeach ? "beach" :
        classification.isShelf ? "shelf" :
        "ocean",

      landScore: field.raw,
      continentScore: field.continentRaw,
      islandScore: field.islandRaw,
      coastProximity: classification.coastProximity,
      shelf: classification.isShelf ? smoothstep(-classification.shelfWidth, 0, field.raw) : classification.isBeach || classification.isLand ? 1 : 0,
      shelfWidth: classification.shelfWidth,
      beachWidth: classification.beachWidth,
      beachEdge: classification.coastProximity,

      selectedLandBodyId: field.selectedId,
      selectedLandBodyLabel: field.selectedLabel,
      selectedLandBodyFamily: field.selectedFamily,
      corridorCut: field.corridorCut,
      corridorId: field.corridorId,
      coastalBiteCut: field.biteCut,
      coastalBiteId: field.biteId,

      isOcean: classification.isOcean,
      isShelf: classification.isShelf,
      isBeach: classification.isBeach,
      isLand: classification.isLand,
      isWater: classification.isWater,
      isCoastal: classification.isCoastal,
      isPolarIce: classification.isPolarIce,
      isMajorLandmass: classification.isLand && (field.selectedFamily === "continent" || field.selectedFamily === "subcontinent"),
      isIslandChain: field.selectedFamily === "islandChain",

      supportsHydrology: classification.isLand || classification.isCoastal || classification.isShelf,
      supportsElevation: classification.isLand || classification.isBeach,
      supportsClimate: true,
      supportsBiome: classification.isLand || classification.isBeach || classification.isCoastal,
      supportsSurface: true,
      supportsAtmosphere: true,

      landmaskOwnsFootprint: true,
      ownsFootprint: true,
      ownsHydrology: false,
      ownsElevation: false,
      ownsClimate: false,
      ownsBiome: false,
      ownsSurface: false,
      ownsAtmosphere: false,
      ownsRuntime: false,
      ownsControls: false,
      ownsCanvas: false,
      ownsRoute: false,
      ownsHtml: false,

      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function sample(u, v) {
    return sampleLandmask(u, v);
  }

  function classify(u, v) {
    const mask = sampleLandmask(u, v);
    return mask.footprintClass;
  }

  function estimateRatios(width = 192, height = 96) {
    const w = clamp(Math.floor(finite(width, 192)), 16, 512);
    const h = clamp(Math.floor(finite(height, 96)), 8, 256);

    let land = 0;
    let beach = 0;
    let shelf = 0;
    let ocean = 0;
    let polar = 0;
    let coastal = 0;
    let island = 0;
    let total = 0;

    for (let y = 0; y < h; y += 1) {
      const v = (y + 0.5) / h;

      for (let x = 0; x < w; x += 1) {
        const u = (x + 0.5) / w;
        const mask = sampleLandmask(u, v);

        total += 1;
        if (mask.isPolarIce) polar += 1;
        if (mask.isIslandChain) island += 1;
        if (mask.isCoastal) coastal += 1;

        if (mask.isBeach) beach += 1;
        else if (mask.isShelf) shelf += 1;
        else if (mask.isOcean) ocean += 1;
        else if (mask.isLand) land += 1;
      }
    }

    const denominator = Math.max(1, total);

    return Object.freeze({
      samples: total,
      landRatio: Number(((land + beach + polar) / denominator).toFixed(4)),
      coreLandRatio: Number((land / denominator).toFixed(4)),
      beachRatio: Number((beach / denominator).toFixed(4)),
      shelfRatio: Number((shelf / denominator).toFixed(4)),
      oceanRatio: Number(((ocean + shelf) / denominator).toFixed(4)),
      deepOceanRatio: Number((ocean / denominator).toFixed(4)),
      coastalRatio: Number((coastal / denominator).toFixed(4)),
      polarRatio: Number((polar / denominator).toFixed(4)),
      islandRatio: Number((island / denominator).toFixed(4)),
      targetLandRatio: TARGET_RATIOS.landRatioApprox,
      targetOceanRatio: TARGET_RATIOS.oceanRatioApprox
    });
  }

  function getLandBodies() {
    return Object.freeze(LAND_BODIES.map((body) => Object.freeze({ ...body })));
  }

  function getOceanCorridors() {
    return Object.freeze(OCEAN_CORRIDORS.map((corridor) => Object.freeze({ ...corridor })));
  }

  function getIslandChains() {
    return Object.freeze(ISLAND_CHAINS.map((chain) => Object.freeze({ ...chain })));
  }

  function getCoastalBiteFields() {
    return Object.freeze(COASTAL_BITE_FIELDS.map((field) => Object.freeze({ ...field })));
  }

  function validateManifestRegistration() {
    try {
      const manifest = window.DGB_PLANET_FAMILY_MANIFEST || window.AUDRALIA_CLEAN_CANVAS_MANIFEST;
      if (!manifest || typeof manifest.validatePrimaryFile !== "function") {
        return Object.freeze({
          manifestAvailable: false,
          valid: true,
          reason: "manifest_not_loaded_yet_landmask_can_still_register"
        });
      }

      return manifest.validatePrimaryFile({
        path: "/assets/audralia/clean/audralia.landmask.js",
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
    const identity = I();

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
      identity: Object.freeze({
        available: Boolean(identity),
        expectedContract: "AUDRALIA_CLEAN_CANVAS_IDENTITY_TNT_v1",
        actualContract: identity?.contract || null,
        valid: !identity || identity.contract === "AUDRALIA_CLEAN_CANVAS_IDENTITY_TNT_v1"
      })
    });
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-land-ocean-footprint",
      fileNumber: FILE_NUMBER,
      primaryNode: PRIMARY_NODE,
      subnodes: SUBNODE_RANGE,
      parentAnchor: AUDRALIA_ROUTE,
      universalParent: UNIVERSAL_ANCHOR,
      targetRatios: TARGET_RATIOS,
      landBodies: LAND_BODIES.length,
      oceanCorridors: OCEAN_CORRIDORS.length,
      islandChains: ISLAND_CHAINS.length,
      coastalBiteFields: COASTAL_BITE_FIELDS.length,
      ratioEstimate: estimateRatios(128, 64),
      owns: Object.freeze([
        "land/ocean footprint",
        "continents",
        "separated landmasses",
        "large islands",
        "island chains",
        "ocean corridors",
        "shelves",
        "beaches",
        "bays",
        "inlets",
        "straits",
        "seaways",
        "coastal proximity"
      ]),
      doesNotOwn: Object.freeze([
        "universal manifest law",
        "math primitives",
        "lattice authority",
        "palette constants",
        "Audralia identity",
        "hydrology behavior",
        "elevation depth",
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
      hEarthReceivesFootprintThroughAudralia: true,
      oneBigGlobPrevented: true,
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
    TARGET_RATIOS,
    LANDFORM_ROLES,

    sampleLandmask,
    sample,
    classify,
    rawLandField,
    estimateRatios,
    getLandBodies,
    getOceanCorridors,
    getIslandChains,
    getCoastalBiteFields,
    validateManifestRegistration,
    validatePriorAuthorities,
    getStatus
  });

  window.AUDRALIA_LANDMASK = API;
  window.AUDRALIA_LANDMASK_RECEIPT = getStatus();

  window.AUDRALIA_CLEAN_CANVAS_LANDMASK = API;
  window.AUDRALIA_CLEAN_CANVAS_LANDMASK_RECEIPT = getStatus();

  if (document?.documentElement?.dataset) {
    document.documentElement.dataset.audraliaLandmaskLoaded = "true";
    document.documentElement.dataset.audraliaLandmaskContract = CONTRACT;
    document.documentElement.dataset.audraliaLandmaskReceipt = RECEIPT;
    document.documentElement.dataset.audraliaLandmaskVersion = VERSION;
    document.documentElement.dataset.audraliaCleanCanvasLandmaskLoaded = "true";
    document.documentElement.dataset.audraliaCleanCanvasLandmaskContract = CONTRACT;
    document.documentElement.dataset.audraliaCleanCanvasLandmaskReceipt = RECEIPT;
    document.documentElement.dataset.audraliaCleanCanvasLandmaskNode = String(PRIMARY_NODE);
    document.documentElement.dataset.audraliaCleanCanvasLandmaskSubnodes = "81-96";
    document.documentElement.dataset.audraliaLandmaskOwnsFootprint = "true";
    document.documentElement.dataset.audraliaLandmaskOwnsHydrology = "false";
    document.documentElement.dataset.audraliaLandmaskOwnsElevation = "false";
    document.documentElement.dataset.audraliaLandmaskOwnsClimate = "false";
    document.documentElement.dataset.audraliaLandmaskOwnsSurface = "false";
    document.documentElement.dataset.audraliaLandmaskOneBigGlobPrevented = "true";
    document.documentElement.dataset.audraliaLandmaskOceanCorridors = String(OCEAN_CORRIDORS.length);
    document.documentElement.dataset.audraliaLandmaskIslandChains = String(ISLAND_CHAINS.length);
    document.documentElement.dataset.hEarthReceivesAudraliaFootprint = "true";
    document.documentElement.dataset.audraliaCleanCanvasFibonacciChronology = "true";
    document.documentElement.dataset.audraliaCleanCanvasPrimaryStructure16 = "true";
    document.documentElement.dataset.audraliaCleanCanvasNodalConstruct256 = "true";
    document.documentElement.dataset.audraliaCleanCanvasOneFileOneJob = "true";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }
})();

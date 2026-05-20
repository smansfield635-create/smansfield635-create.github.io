// /assets/audralia/clean/audralia.hydrology.js
// AUDRALIA_CLEAN_CANVAS_HYDROLOGY_TNT_v1
// Full-file replacement.
// File 7 of 16.
// Planet Audralia hydrology authority.
// Purpose:
// - Establishes Audralia-specific water behavior authority.
// - Defines rivers, lakes, inland seas, wetlands, marshes, deltas, estuaries, lagoons, watersheds, drainage corridors, bay-water, inlet-water, and dry channels.
// - Consumes Audralia landmask as the land/ocean footprint source.
// - Does not create continents.
// - Does not create core land/ocean footprint.
// - Does not own elevation depth, climate fields, biome categories, surface material synthesis, atmosphere/weather, runtime, controls, canvas, route bridge, or HTML shell.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_CLEAN_CANVAS_HYDROLOGY_TNT_v1";
  const RECEIPT = "AUDRALIA_CLEAN_CANVAS_HYDROLOGY_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_CLEAN_CANVAS_LANDMASK_TNT_v1";
  const VERSION = "2026-05-20.audralia-clean-canvas-hydrology-v1";

  const FILE_NUMBER = 7;
  const PRIMARY_NODE = 7;
  const SUBNODE_RANGE = Object.freeze([97, 112]);

  const UNIVERSAL_ANCHOR = "/showroom/globe/";
  const AUDRALIA_ROUTE = "/showroom/globe/audralia/";
  const H_EARTH_ROUTE = "/showroom/globe/h-earth/";

  const HYDROLOGY_TARGETS = Object.freeze({
    rivers: true,
    lakes: true,
    inlandSeas: true,
    wetlands: true,
    marshes: true,
    deltas: true,
    estuaries: true,
    lagoons: true,
    watersheds: true,
    drainageCorridors: true,
    bayWater: true,
    inletWater: true,
    dryChannels: true,
    coastalShelfWater: true,
    landmaskFootprintRequired: true,
    coreFootprintCreationForbidden: true
  });

  const WATERSHED_BASINS = Object.freeze([
    {
      id: "west-crown-watershed",
      label: "West Crown Watershed",
      longitude: -134,
      latitude: 16,
      radiusLongitude: 40,
      radiusLatitude: 30,
      tilt: -12,
      rainfallBias: 0.54,
      riverBias: 0.46,
      lakeBias: 0.18,
      wetlandBias: 0.24
    },
    {
      id: "central-green-watershed",
      label: "Central Green Watershed",
      longitude: -38,
      latitude: 8,
      radiusLongitude: 48,
      radiusLatitude: 34,
      tilt: 10,
      rainfallBias: 0.68,
      riverBias: 0.58,
      lakeBias: 0.26,
      wetlandBias: 0.36
    },
    {
      id: "central-south-basin",
      label: "Central South Basin",
      longitude: -18,
      latitude: -34,
      radiusLongitude: 34,
      radiusLatitude: 22,
      tilt: 16,
      rainfallBias: 0.42,
      riverBias: 0.42,
      lakeBias: 0.38,
      wetlandBias: 0.30
    },
    {
      id: "east-sunrise-drainage",
      label: "East Sunrise Drainage",
      longitude: 78,
      latitude: 0,
      radiusLongitude: 42,
      radiusLatitude: 31,
      tilt: -14,
      rainfallBias: 0.58,
      riverBias: 0.54,
      lakeBias: 0.20,
      wetlandBias: 0.28
    },
    {
      id: "far-east-arc-basin",
      label: "Far East Arc Basin",
      longitude: 154,
      latitude: -12,
      radiusLongitude: 30,
      radiusLatitude: 25,
      tilt: 8,
      rainfallBias: 0.62,
      riverBias: 0.38,
      lakeBias: 0.18,
      wetlandBias: 0.32
    },
    {
      id: "southern-cold-basin",
      label: "Southern Cold Basin",
      longitude: 20,
      latitude: -60,
      radiusLongitude: 60,
      radiusLatitude: 15,
      tilt: 2,
      rainfallBias: 0.36,
      riverBias: 0.34,
      lakeBias: 0.26,
      wetlandBias: 0.16
    }
  ]);

  const INLAND_WATER_BODIES = Object.freeze([
    {
      id: "central-mirror-lake",
      label: "Central Mirror Lake",
      longitude: -34,
      latitude: 10,
      radiusLongitude: 7.5,
      radiusLatitude: 4.6,
      tilt: -10,
      weight: 0.88,
      className: "lake"
    },
    {
      id: "gratitude-inland-sea",
      label: "Gratitude Inland Sea",
      longitude: -18,
      latitude: -22,
      radiusLongitude: 12,
      radiusLatitude: 7,
      tilt: 16,
      weight: 0.82,
      className: "inland-sea"
    },
    {
      id: "east-sunrise-lake",
      label: "East Sunrise Lake",
      longitude: 84,
      latitude: 12,
      radiusLongitude: 8,
      radiusLatitude: 5,
      tilt: 12,
      weight: 0.74,
      className: "lake"
    },
    {
      id: "west-crown-high-lake",
      label: "West Crown High Lake",
      longitude: -128,
      latitude: 28,
      radiusLongitude: 6.5,
      radiusLatitude: 4.2,
      tilt: -24,
      weight: 0.70,
      className: "lake"
    },
    {
      id: "southern-shelf-lagoon",
      label: "Southern Shelf Lagoon",
      longitude: 28,
      latitude: -49,
      radiusLongitude: 10,
      radiusLatitude: 4.5,
      tilt: -6,
      weight: 0.68,
      className: "lagoon"
    }
  ]);

  function M() {
    return window.DGB_PLANET_FAMILY_MATH || window.AUDRALIA_CLEAN_CANVAS_MATH || null;
  }

  function L() {
    return window.DGB_PLANET_FAMILY_LATTICE || window.AUDRALIA_CLEAN_CANVAS_LATTICE || null;
  }

  function LM() {
    return window.AUDRALIA_LANDMASK || window.AUDRALIA_CLEAN_CANVAS_LANDMASK || null;
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
    const noise = fbm2(u * 1.3 + 0.12, v * 1.1 - 0.09, { seed: 7001, scale: 3.2, octaves: 5 });
    const ridge = ridgeNoise2(u * 2.6 - 0.22, v * 2.2 + 0.18, { seed: 7002, scale: 4.0, octaves: 4 });
    const landScore = noise * 0.52 + ridge * 0.20 + (1 - Math.abs(lat) / 90) * 0.14 - 0.43;
    const shelfWidth = 0.14;
    const beachWidth = 0.04;
    const isOcean = landScore <= -shelfWidth;
    const isShelf = landScore > -shelfWidth && landScore <= 0;
    const isBeach = landScore > 0 && landScore <= beachWidth;
    const isLand = landScore > beachWidth;
    const lattice = coordinatesFromUV(u, v);

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
      supportsHydrology: isLand || isShelf || isBeach,
      supportsSurface: true,
      landmaskOwnsFootprint: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function basinInfluence(mask) {
    let best = Object.freeze({
      id: "",
      label: "",
      score: 0,
      rainfallBias: 0,
      riverBias: 0,
      lakeBias: 0,
      wetlandBias: 0
    });

    for (const basin of WATERSHED_BASINS) {
      const score = smoothstep(-0.55, 0.92, rotatedEllipseScore(mask.longitudeDegrees, mask.latitudeDegrees, basin));

      if (score > best.score) {
        best = Object.freeze({
          id: basin.id,
          label: basin.label,
          score,
          rainfallBias: basin.rainfallBias,
          riverBias: basin.riverBias,
          lakeBias: basin.lakeBias,
          wetlandBias: basin.wetlandBias
        });
      }
    }

    return best;
  }

  function inlandWaterInfluence(mask) {
    let best = Object.freeze({
      id: "",
      label: "",
      score: 0,
      className: "none"
    });

    for (const body of INLAND_WATER_BODIES) {
      const score = smoothstep(0.02, 0.88, rotatedEllipseScore(mask.longitudeDegrees, mask.latitudeDegrees, body)) * body.weight;

      if (score > best.score) {
        best = Object.freeze({
          id: body.id,
          label: body.label,
          score,
          className: body.className
        });
      }
    }

    return best;
  }

  function summitMoisture(mask) {
    const source = [
      mask.primarySummit,
      mask.secondarySummit,
      mask.internalSummit
    ].join(" ").toLowerCase();

    let moisture = 0;
    let drainage = 0;
    let basin = 0;

    if (source.includes("gratitude")) {
      moisture += 0.10;
      basin += 0.08;
    }

    if (source.includes("peace")) {
      moisture += 0.16;
      basin += 0.12;
    }

    if (source.includes("joy")) {
      moisture += 0.08;
      drainage += 0.08;
    }

    if (source.includes("stewardship")) {
      moisture += 0.14;
      drainage += 0.10;
    }

    if (source.includes("free")) {
      drainage += 0.14;
    }

    if (source.includes("dignity")) {
      drainage += 0.08;
      moisture -= 0.04;
    }

    if (source.includes("stability")) {
      basin += 0.07;
    }

    return Object.freeze({
      moisture,
      drainage,
      basin
    });
  }

  function baseHydrologySignals(mask) {
    const u = wrap01(mask.u);
    const v = clamp01(mask.v);
    const latitude = finite(mask.latitudeDegrees, 0);
    const absLat = Math.abs(latitude);
    const basin = basinInfluence(mask);
    const inlandWater = inlandWaterInfluence(mask);
    const summit = summitMoisture(mask);

    const coast = clamp01(finite(mask.coastProximity, 0));
    const shelf = clamp01(finite(mask.shelf, 0));
    const beachEdge = clamp01(finite(mask.beachEdge, 0));
    const landScore = finite(mask.landScore, 0);

    const tropical = 1 - smoothstep(18, 34, absLat);
    const temperate = smoothstep(18, 40, absLat) * (1 - smoothstep(56, 74, absLat));
    const polar = smoothstep(62, 84, absLat);

    const waterMemory = fbm2(u * 0.86 + 0.19, v * 0.72 - 0.13, { seed: 9101, scale: 2.2, octaves: 5 });
    const drainageField = ridgeNoise2(u * 5.4 + basin.score * 0.33, v * 4.6 - summit.drainage, { seed: 9102, scale: 5.6, octaves: 4 });
    const tributaryField = ridgeNoise2(u * 11.2 - 0.27, v * 8.8 + 0.22, { seed: 9103, scale: 10.0, octaves: 3 });
    const lakeField = fbm2(u * 3.0 + 0.41, v * 2.5 - 0.18, { seed: 9104, scale: 4.2, octaves: 4 });
    const wetlandField = fbm2(u * 5.2 - 0.14, v * 4.6 + 0.28, { seed: 9105, scale: 5.4, octaves: 4 });
    const bayField = fbm2(u * 2.1 + 0.31, v * 1.8 - 0.24, { seed: 9106, scale: 3.0, octaves: 5 });
    const inletField = ridgeNoise2(u * 7.0 - 0.41, v * 5.8 + 0.27, { seed: 9107, scale: 7.5, octaves: 4 });
    const deltaField = ridgeNoise2(u * 8.8 + 0.13, v * 7.2 - 0.19, { seed: 9108, scale: 8.6, octaves: 3 });
    const lagoonField = fbm2(u * 8.4 - 0.21, v * 7.6 + 0.31, { seed: 9109, scale: 8.8, octaves: 3 });

    const rainfallSupply = clamp01(
      basin.rainfallBias * 0.34 +
      waterMemory * 0.22 +
      tropical * 0.16 +
      temperate * 0.08 +
      summit.moisture -
      polar * 0.12
    );

    const meltwaterSupply = clamp01(
      polar * 0.26 +
      smoothstep(0.34, 0.82, landScore) * 0.10 +
      (mask.isPolarIce ? 0.26 : 0)
    );

    const dryness = clamp01(
      (1 - rainfallSupply) * 0.44 +
      smoothstep(22, 42, absLat) * 0.12 -
      coast * 0.08 -
      summit.moisture * 0.28
    );

    return Object.freeze({
      u,
      v,
      latitude,
      absLat,
      basin,
      inlandWater,
      summit,
      coast,
      shelf,
      beachEdge,
      landScore,
      tropical,
      temperate,
      polar,
      waterMemory,
      drainageField,
      tributaryField,
      lakeField,
      wetlandField,
      bayField,
      inletField,
      deltaField,
      lagoonField,
      rainfallSupply,
      meltwaterSupply,
      dryness
    });
  }

  function computeHydrology(mask, signals) {
    const isOcean = Boolean(mask.isOcean);
    const isShelf = Boolean(mask.isShelf);
    const isBeach = Boolean(mask.isBeach);
    const isLand = Boolean(mask.isLand);
    const isCoastal = Boolean(mask.isCoastal);

    const watershed = clamp01(
      signals.basin.score * 0.24 +
      signals.waterMemory * 0.22 +
      signals.rainfallSupply * 0.22 +
      signals.drainageField * 0.12 +
      signals.summit.basin * 0.32 +
      signals.meltwaterSupply * 0.10
    );

    const drainage = clamp01(
      signals.drainageField * 0.34 +
      signals.tributaryField * 0.18 +
      watershed * 0.20 +
      signals.basin.riverBias * 0.18 +
      signals.summit.drainage * 0.26 -
      signals.dryness * 0.14
    );

    const river = clamp01(
      drainage * 0.42 +
      signals.tributaryField * 0.20 +
      signals.rainfallSupply * 0.16 +
      signals.meltwaterSupply * 0.10 -
      signals.dryness * 0.22
    );

    const dryChannel = clamp01(
      drainage * 0.36 +
      signals.dryness * 0.34 +
      signals.tributaryField * 0.16 -
      signals.rainfallSupply * 0.20
    );

    const lake = clamp01(
      signals.inlandWater.className === "lake" ? signals.inlandWater.score * 0.72 : 0 +
      signals.lakeField * 0.20 +
      signals.basin.lakeBias * 0.20 +
      watershed * 0.12 +
      signals.rainfallSupply * 0.08 -
      signals.dryness * 0.16
    );

    const inlandSea = clamp01(
      signals.inlandWater.className === "inland-sea" ? signals.inlandWater.score * 0.76 : 0 +
      signals.basin.lakeBias * 0.24 +
      signals.waterMemory * 0.14 +
      watershed * 0.10 -
      signals.dryness * 0.12
    );

    const wetland = clamp01(
      signals.wetlandField * 0.24 +
      signals.basin.wetlandBias * 0.24 +
      signals.rainfallSupply * 0.18 +
      signals.coast * 0.10 +
      watershed * 0.10 -
      signals.dryness * 0.18
    );

    const marsh = clamp01(
      wetland * 0.44 +
      signals.lakeField * 0.14 +
      signals.basin.wetlandBias * 0.20 +
      signals.landScore < 0.22 ? 0.12 : 0
    );

    const bay = clamp01(
      signals.coast * 0.30 +
      signals.bayField * 0.24 +
      signals.shelf * 0.20 +
      signals.beachEdge * 0.10 -
      (isOcean ? 0.02 : 0)
    );

    const inlet = clamp01(
      signals.coast * 0.26 +
      signals.inletField * 0.28 +
      river * 0.10 +
      signals.shelf * 0.10
    );

    const estuary = clamp01(
      signals.coast * 0.22 +
      river * 0.24 +
      inlet * 0.22 +
      signals.shelf * 0.10 +
      signals.deltaField * 0.08
    );

    const delta = clamp01(
      river * 0.28 +
      signals.deltaField * 0.24 +
      signals.coast * 0.22 +
      signals.basin.wetlandBias * 0.10 -
      signals.dryness * 0.10
    );

    const lagoon = clamp01(
      signals.inlandWater.className === "lagoon" ? signals.inlandWater.score * 0.64 : 0 +
      signals.coast * 0.22 +
      signals.shelf * 0.20 +
      signals.lagoonField * 0.18 +
      signals.tropical * 0.08
    );

    const coastalShelfWater = clamp01(
      signals.shelf * 0.34 +
      signals.coast * 0.24 +
      bay * 0.14 +
      inlet * 0.10 +
      lagoon * 0.10
    );

    const shouldBeInlandWater = isLand && (
      lake > 0.66 ||
      inlandSea > 0.68 ||
      river > 0.72 ||
      wetland > 0.72 ||
      marsh > 0.74
    );

    const shouldShapeLand = Boolean(
      isLand || isBeach || isShelf || isCoastal
    ) && (
      watershed > 0.56 ||
      drainage > 0.58 ||
      bay > 0.58 ||
      inlet > 0.58 ||
      estuary > 0.56 ||
      delta > 0.56 ||
      lagoon > 0.58
    );

    return Object.freeze({
      watershed,
      drainage,
      river,
      dryChannel,
      lake,
      inlandSea,
      wetland,
      marsh,
      bay,
      inlet,
      estuary,
      delta,
      lagoon,
      coastalShelfWater,
      shouldBeInlandWater,
      shouldShapeLand,
      isOcean,
      isShelf,
      isBeach,
      isLand,
      isCoastal
    });
  }

  function classifyHydrology(mask, hydro) {
    if (mask.isOcean) {
      if (hydro.bay > 0.66) return ["bay-water", "coastal-water", "open-water-shaped-by-bay"];
      if (hydro.inlet > 0.66) return ["inlet-water", "coastal-water", "open-water-cut-by-inlet"];
      if (hydro.lagoon > 0.66) return ["lagoon-water", "coastal-water", "lagoon-shelf"];
      if (hydro.coastalShelfWater > 0.58) return ["shelf-water", "coastal-shelf-water", "shallow-transition-water"];
      return ["open-ocean", "marine", "ocean-held-by-landmask"];
    }

    if (mask.isShelf) {
      if (hydro.bay > 0.62) return ["bay-shelf", "coastal-shelf-water", "bay-shaped-shelf"];
      if (hydro.inlet > 0.62) return ["inlet-shelf", "coastal-shelf-water", "inlet-cut-shelf"];
      if (hydro.lagoon > 0.62) return ["lagoon-shelf", "coastal-shelf-water", "sheltered-lagoon-shelf"];
      return ["shelf-water", "coastal-shelf-water", "continental-shelf"];
    }

    if (mask.isBeach) {
      if (hydro.delta > 0.58) return ["delta-mouth", "coastal-wetland", "river-mouth-beach"];
      if (hydro.estuary > 0.58) return ["estuary-edge", "coastal-water", "river-meets-sea"];
      if (hydro.lagoon > 0.58) return ["lagoon-edge", "coastal-water", "beach-lagoon"];
      return ["beach-hydrology", "coastal-edge", "wet-beach-transition"];
    }

    if (hydro.inlandSea > 0.68) return ["inland-sea", "interior-water", "large-basin-water"];
    if (hydro.lake > 0.66) return ["lake", "interior-water", "lake-basin"];
    if (hydro.marsh > 0.70) return ["marsh", "wetland", "low-basin-marsh"];
    if (hydro.wetland > 0.68) return ["wetland", "wetland", "saturated-lowland"];
    if (hydro.delta > 0.66) return ["delta", "coastal-wetland", "river-mouth-delta"];
    if (hydro.estuary > 0.64) return ["estuary", "coastal-water", "river-meets-sea"];
    if (hydro.river > 0.68) return ["river", "drainage", "flowing-river-corridor"];
    if (hydro.dryChannel > 0.70) return ["dry-channel", "seasonal-drainage", "dry-riverbed"];
    if (hydro.watershed > 0.58) return ["watershed", "drainage-basin", "water-shaped-terrain"];

    return ["ordinary-land", "dry-land", "hydrology-background"];
  }

  function sampleHydrology(input, vMaybe) {
    const mask = sampleLandmaskFromInput(input, vMaybe);
    const signals = baseHydrologySignals(mask);
    const hydro = computeHydrology(mask, signals);
    const classification = classifyHydrology(mask, hydro);
    const waterClass = classification[0];
    const zone = classification[1];
    const form = classification[2];

    const isInlandWater = Boolean(
      waterClass === "inland-sea" ||
      waterClass === "lake" ||
      waterClass === "river" ||
      waterClass === "wetland" ||
      waterClass === "marsh" ||
      waterClass === "delta" ||
      waterClass === "estuary"
    );

    const isSurfaceWater = Boolean(
      mask.isOcean ||
      mask.isShelf ||
      isInlandWater ||
      hydro.lake > 0.66 ||
      hydro.inlandSea > 0.68 ||
      hydro.river > 0.68 ||
      hydro.wetland > 0.68 ||
      hydro.marsh > 0.70 ||
      hydro.delta > 0.66 ||
      hydro.estuary > 0.64 ||
      hydro.lagoon > 0.66
    );

    const waterColorRole =
      waterClass === "inland-sea" ? "inlandSea" :
      waterClass === "lake" ? "lake" :
      waterClass === "river" ? "river" :
      waterClass === "wetland" ? "wetland" :
      waterClass === "marsh" ? "marsh" :
      waterClass === "delta" ? "delta" :
      waterClass === "estuary" ? "estuary" :
      waterClass.includes("lagoon") ? "lagoon" :
      waterClass.includes("shelf") ? "shelfWater" :
      waterClass.includes("bay") ? "bayWater" :
      waterClass.includes("inlet") ? "inletWater" :
      "background";

    return Object.freeze({
      allowed: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-water-behavior",
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
      isInlandWater,
      isSurfaceWater,

      class: waterClass,
      zone,
      form,
      waterColorRole,

      watershedBasinId: signals.basin.id,
      watershedBasinLabel: signals.basin.label,
      inlandWaterId: signals.inlandWater.id,
      inlandWaterLabel: signals.inlandWater.label,
      inlandWaterClass: signals.inlandWater.className,

      rainfallSupply: signals.rainfallSupply,
      meltwaterSupply: signals.meltwaterSupply,
      dryness: signals.dryness,
      waterMemory: signals.waterMemory,

      watershed: hydro.watershed,
      drainage: hydro.drainage,
      river: hydro.river,
      dryChannel: hydro.dryChannel,
      lake: hydro.lake,
      inlandSea: hydro.inlandSea,
      wetland: hydro.wetland,
      marsh: hydro.marsh,
      bay: hydro.bay,
      inlet: hydro.inlet,
      estuary: hydro.estuary,
      delta: hydro.delta,
      lagoon: hydro.lagoon,
      coastalShelfWater: hydro.coastalShelfWater,

      visualGuidance: Object.freeze({
        shouldPaintInlandWater: isInlandWater && !mask.isOcean && !mask.isShelf,
        shouldShapeLand: hydro.shouldShapeLand,
        shouldSupportWetlandColor: hydro.wetland > 0.58 || hydro.marsh > 0.58 || hydro.delta > 0.56,
        shouldSupportRiverCorridor: hydro.river > 0.58 || hydro.drainage > 0.58,
        shouldSupportDryChannel: hydro.dryChannel > 0.64,
        shouldSupportBayOrInlet: hydro.bay > 0.58 || hydro.inlet > 0.58,
        shouldSupportLagoon: hydro.lagoon > 0.58
      }),

      sourceReads: Object.freeze({
        landmask: Boolean(mask.landmaskOwnsFootprint || mask.ownsFootprint || mask.footprintClass),
        lattice: Boolean(L()?.coordinatesFromUV),
        math: Boolean(M()?.fbm2),
        identity: Boolean(window.AUDRALIA_IDENTITY || window.AUDRALIA_CLEAN_CANVAS_IDENTITY)
      }),

      ownsFootprint: false,
      ownsLandSea: false,
      ownsHydrology: true,
      ownsWaterBehavior: true,
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
      canvasMayPaint: true,
      hEarthMayInherit: true,

      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function sample(input, vMaybe) {
    return sampleHydrology(input, vMaybe);
  }

  function classifyWater(input, vMaybe) {
    return sampleHydrology(input, vMaybe).class;
  }

  function getWatershedBasins() {
    return Object.freeze(WATERSHED_BASINS.map((basin) => Object.freeze({ ...basin })));
  }

  function getInlandWaterBodies() {
    return Object.freeze(INLAND_WATER_BODIES.map((body) => Object.freeze({ ...body })));
  }

  function estimateHydrology(width = 128, height = 64) {
    const w = clamp(Math.floor(finite(width, 128)), 16, 384);
    const h = clamp(Math.floor(finite(height, 64)), 8, 192);

    let inlandWater = 0;
    let river = 0;
    let lake = 0;
    let wetland = 0;
    let coastWater = 0;
    let dryChannel = 0;
    let shapeLand = 0;
    let total = 0;

    for (let y = 0; y < h; y += 1) {
      const v = (y + 0.5) / h;

      for (let x = 0; x < w; x += 1) {
        const u = (x + 0.5) / w;
        const hydro = sampleHydrology(u, v);

        total += 1;
        if (hydro.isInlandWater) inlandWater += 1;
        if (hydro.river > 0.62) river += 1;
        if (hydro.lake > 0.62 || hydro.inlandSea > 0.62) lake += 1;
        if (hydro.wetland > 0.60 || hydro.marsh > 0.60) wetland += 1;
        if (hydro.bay > 0.60 || hydro.inlet > 0.60 || hydro.lagoon > 0.60 || hydro.coastalShelfWater > 0.60) coastWater += 1;
        if (hydro.dryChannel > 0.66) dryChannel += 1;
        if (hydro.visualGuidance.shouldShapeLand) shapeLand += 1;
      }
    }

    const denominator = Math.max(1, total);

    return Object.freeze({
      samples: total,
      inlandWaterRatio: Number((inlandWater / denominator).toFixed(4)),
      riverSignalRatio: Number((river / denominator).toFixed(4)),
      lakeSignalRatio: Number((lake / denominator).toFixed(4)),
      wetlandSignalRatio: Number((wetland / denominator).toFixed(4)),
      coastWaterSignalRatio: Number((coastWater / denominator).toFixed(4)),
      dryChannelSignalRatio: Number((dryChannel / denominator).toFixed(4)),
      landShapingSignalRatio: Number((shapeLand / denominator).toFixed(4))
    });
  }

  function validateManifestRegistration() {
    try {
      const manifest = window.DGB_PLANET_FAMILY_MANIFEST || window.AUDRALIA_CLEAN_CANVAS_MANIFEST;
      if (!manifest || typeof manifest.validatePrimaryFile !== "function") {
        return Object.freeze({
          manifestAvailable: false,
          valid: true,
          reason: "manifest_not_loaded_yet_hydrology_can_still_register"
        });
      }

      return manifest.validatePrimaryFile({
        path: "/assets/audralia/clean/audralia.hydrology.js",
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
      })
    });
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-water-behavior",
      fileNumber: FILE_NUMBER,
      primaryNode: PRIMARY_NODE,
      subnodes: SUBNODE_RANGE,
      parentAnchor: AUDRALIA_ROUTE,
      universalParent: UNIVERSAL_ANCHOR,
      downstreamGroundView: H_EARTH_ROUTE,
      targets: HYDROLOGY_TARGETS,
      watershedBasins: WATERSHED_BASINS.length,
      inlandWaterBodies: INLAND_WATER_BODIES.length,
      hydrologyEstimate: estimateHydrology(96, 48),
      owns: Object.freeze([
        "water behavior",
        "watersheds",
        "drainage corridors",
        "rivers",
        "lakes",
        "inland seas",
        "wetlands",
        "marshes",
        "deltas",
        "estuaries",
        "lagoons",
        "bay-water",
        "inlet-water",
        "coastal shelf water",
        "dry channels"
      ]),
      doesNotOwn: Object.freeze([
        "universal manifest law",
        "math primitives",
        "lattice authority",
        "palette constants",
        "Audralia identity",
        "land/ocean footprint",
        "continent creation",
        "island creation",
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
      hEarthReceivesHydrologyThroughAudralia: true,
      coreFootprintCreationForbidden: true,
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
    HYDROLOGY_TARGETS,

    sampleHydrology,
    sample,
    classifyWater,
    estimateHydrology,
    getWatershedBasins,
    getInlandWaterBodies,
    validateManifestRegistration,
    validatePriorAuthorities,
    getStatus
  });

  window.AUDRALIA_HYDROLOGY = API;
  window.AUDRALIA_HYDROLOGY_RECEIPT = getStatus();

  window.AUDRALIA_CLEAN_CANVAS_HYDROLOGY = API;
  window.AUDRALIA_CLEAN_CANVAS_HYDROLOGY_RECEIPT = getStatus();

  if (document?.documentElement?.dataset) {
    document.documentElement.dataset.audraliaHydrologyLoaded = "true";
    document.documentElement.dataset.audraliaHydrologyContract = CONTRACT;
    document.documentElement.dataset.audraliaHydrologyReceipt = RECEIPT;
    document.documentElement.dataset.audraliaHydrologyVersion = VERSION;
    document.documentElement.dataset.audraliaCleanCanvasHydrologyLoaded = "true";
    document.documentElement.dataset.audraliaCleanCanvasHydrologyContract = CONTRACT;
    document.documentElement.dataset.audraliaCleanCanvasHydrologyReceipt = RECEIPT;
    document.documentElement.dataset.audraliaCleanCanvasHydrologyNode = String(PRIMARY_NODE);
    document.documentElement.dataset.audraliaCleanCanvasHydrologySubnodes = "97-112";
    document.documentElement.dataset.audraliaHydrologyOwnsWaterBehavior = "true";
    document.documentElement.dataset.audraliaHydrologyOwnsFootprint = "false";
    document.documentElement.dataset.audraliaHydrologyOwnsElevation = "false";
    document.documentElement.dataset.audraliaHydrologyOwnsClimate = "false";
    document.documentElement.dataset.audraliaHydrologyOwnsSurface = "false";
    document.documentElement.dataset.audraliaHydrologyRivers = "true";
    document.documentElement.dataset.audraliaHydrologyLakes = "true";
    document.documentElement.dataset.audraliaHydrologyWetlands = "true";
    document.documentElement.dataset.audraliaHydrologyDeltas = "true";
    document.documentElement.dataset.audraliaHydrologyBays = "true";
    document.documentElement.dataset.audraliaHydrologyInlets = "true";
    document.documentElement.dataset.hEarthReceivesAudraliaHydrology = "true";
    document.documentElement.dataset.audraliaCleanCanvasFibonacciChronology = "true";
    document.documentElement.dataset.audraliaCleanCanvasPrimaryStructure16 = "true";
    document.documentElement.dataset.audraliaCleanCanvasNodalConstruct256 = "true";
    document.documentElement.dataset.audraliaCleanCanvasOneFileOneJob = "true";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }
})();

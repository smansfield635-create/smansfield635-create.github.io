// /assets/audralia/audralia.hydrology.js
// AUDRALIA_HYDROLOGY_CORRIDOR_AND_INLAND_WATER_RENEWAL_TNT_v2
// Full-file replacement.
// Hydrology / hydration authority only.
// Purpose:
// - Consumes renewed separated Audralia Landmap authority.
// - Strengthens visible hydrology guidance after landmass separation.
// - Defines water corridors, inland lakes, inland seas, rivers, drainage corridors, wetlands, deltas, marsh basins,
//   bays, inlets, estuaries, peninsulas, lagoon systems, watershed basins, mountain-fed rivers,
//   dry channels, meltwater fields, coastal shelf water, and solid-land interruption pressure.
// - Does not own land/sea footprint.
// - Does not replace Landmap.
// - Does not own beaches.
// - Does not own climate.
// - Does not own elevation.
// - Does not own surface color.
// - Does not render canvas.
// - Does not touch runtime.
// - Does not touch Gauges.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_HYDROLOGY_CORRIDOR_AND_INLAND_WATER_RENEWAL_TNT_v2";
  const RECEIPT = "AUDRALIA_HYDROLOGY_CORRIDOR_AND_INLAND_WATER_RENEWAL_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "AUDRALIA_ORGANIC_HYDRATION_AND_WATERSHED_AUTHORITY_TNT_v1";
  const VERSION = "2026-05-19.audralia-hydrology-corridor-and-inland-water-renewal-v2";

  const PHI = 1.618033988749895;
  const INV_PHI = 1 / PHI;

  const WATER_CLASSES = Object.freeze({
    OPEN_OCEAN: "open-ocean",
    SHELF_WATER: "shelf-water",
    BAY_WATER: "bay-water",
    INLET_WATER: "inlet-water",
    LAGOON_WATER: "lagoon-water",
    INLAND_SEA: "inland-sea",
    LAKE: "lake",
    RIVER: "river",
    WETLAND: "wetland",
    MARSH_BASIN: "marsh-basin",
    DELTA: "delta",
    ESTUARY: "estuary",
    PENINSULA: "peninsula",
    BAY_EDGE: "bay-edge",
    INLET_EDGE: "inlet-edge",
    WATERSHED: "watershed",
    DRY_CHANNEL: "dry-channel",
    ORDINARY_LAND: "ordinary-land"
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

  function smoothstep(edge0, edge1, value) {
    const t = clamp((value - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function sharpen(value, strength = 1.18) {
    const x = clamp(value, 0, 1);
    return clamp((x - 0.5) * strength + 0.5, 0, 1);
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

  function fallbackMap(uInput, vInput) {
    const u = wrap01(Number.isFinite(Number(uInput)) ? Number(uInput) : 0);
    const v = clamp(Number.isFinite(Number(vInput)) ? Number(vInput) : 0, 0, 1);
    const longitude = u * 360 - 180;
    const latitude = 90 - v * 180;
    const row16 = clamp(Math.floor(v * 16), 0, 15);
    const col16 = clamp(Math.floor(u * 16), 0, 15);
    const cell256 = row16 * 16 + col16 + 1;
    const signal = fbm(u * 1.4 + 0.14, v * 1.1 - 0.08, 50001, 5);
    const isOcean = signal < 0.56;

    return Object.freeze({
      u,
      v,
      longitude,
      latitude,
      cell256,
      cell64: Math.floor(row16 / 2) * 8 + Math.floor(col16 / 2) + 1,
      cell16: Math.floor(row16 / 4) * 4 + Math.floor(col16 / 4) + 1,
      row16,
      col16,
      terrainClass: isOcean ? "ocean" : "lowland",
      topology: isOcean ? "deep-ocean" : "fallback-land",
      elevation: isOcean ? "sea" : "lowland",
      shelf: isOcean ? smoothstep(0.48, 0.60, signal) * 0.36 : smoothstep(0.56, 0.62, signal) * 0.42,
      beachEdge: smoothstep(0.52, 0.60, signal) * (1 - smoothstep(0.61, 0.72, signal)),
      isOcean,
      isShelf: isOcean && signal > 0.48,
      isBeach: !isOcean && signal < 0.62,
      isLand: !isOcean,
      hydrologyFallbackMap: true
    });
  }

  function coerceMap(input, maybeV) {
    if (input && typeof input === "object") return input;

    const u = wrap01(Number.isFinite(Number(input)) ? Number(input) : 0);
    const v = clamp(Number.isFinite(Number(maybeV)) ? Number(maybeV) : 0, 0, 1);

    try {
      if (window.AUDRALIA_LANDMAP?.sampleLandmap) {
        const map = window.AUDRALIA_LANDMAP.sampleLandmap(u, v);
        if (map && typeof map === "object") return map;
      }

      if (window.AUDRALIA_LANDMAP?.sample) {
        const map = window.AUDRALIA_LANDMAP.sample(u, v);
        if (map && typeof map === "object") return map;
      }
    } catch {
      document.documentElement.dataset.audraliaHydrologyLandmapReadFailed = "true";
    }

    return fallbackMap(u, v);
  }

  function getCell256(map) {
    const existing = Number(map?.cell256);
    if (Number.isFinite(existing) && existing >= 1 && existing <= 256) return Math.floor(existing);

    const u = clamp(Number(map?.u || 0), 0, 1);
    const v = clamp(Number(map?.v || 0), 0, 1);
    return Math.max(1, Math.min(256, Math.floor(v * 16) * 16 + Math.floor(u * 16) + 1));
  }

  function getCellXY(cell256) {
    const index = clamp(Math.floor(cell256) - 1, 0, 255);
    return Object.freeze({
      x: index % 16,
      y: Math.floor(index / 16)
    });
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
      includesAny(map?.topology, ["beach", "shore", "coastline", "coastal"])
    );
  }

  function isSeparatedLandmap(map) {
    return Boolean(
      map?.oneBigGlobCorrected ||
      map?.landmassSeparationActive ||
      map?.oceanCorridorsActive ||
      map?.archipelagoChainsActive ||
      map?.baysInletsStraitsActive
    );
  }

  function readElevation(map) {
    try {
      if (window.AUDRALIA_ELEVATION?.sampleElevation) {
        const value = window.AUDRALIA_ELEVATION.sampleElevation(map);
        if (value && typeof value === "object") return value;
      }

      if (window.AUDRALIA_ELEVATION?.sample) {
        const value = window.AUDRALIA_ELEVATION.sample(map);
        if (value && typeof value === "object") return value;
      }
    } catch {
      document.documentElement.dataset.audraliaHydrologyElevationReadFailed = "true";
    }

    return null;
  }

  function readTopology(map) {
    try {
      if (window.AUDRALIA_TOPOLOGY?.sampleTopology) {
        const value = window.AUDRALIA_TOPOLOGY.sampleTopology(map);
        if (value && typeof value === "object") return value;
      }

      if (window.AUDRALIA_TOPOLOGY?.sample) {
        const value = window.AUDRALIA_TOPOLOGY.sample(map);
        if (value && typeof value === "object") return value;
      }
    } catch {
      document.documentElement.dataset.audraliaHydrologyTopologyReadFailed = "true";
    }

    return null;
  }

  function readClimate(map) {
    try {
      if (window.AUDRALIA_CLIMATE_RENDER?.sampleClimate) {
        const value = window.AUDRALIA_CLIMATE_RENDER.sampleClimate(map);
        if (value && typeof value === "object") return value;
      }

      if (window.AUDRALIA_CLIMATE_RENDER?.sample) {
        const value = window.AUDRALIA_CLIMATE_RENDER.sample(map);
        if (value && typeof value === "object") return value;
      }
    } catch {
      document.documentElement.dataset.audraliaHydrologyClimateReadFailed = "true";
    }

    return null;
  }

  function readBeach(map) {
    try {
      if (window.AUDRALIA_BEACHES?.sampleBeach) {
        const value = window.AUDRALIA_BEACHES.sampleBeach(map);
        if (value && typeof value === "object") return value;
      }

      if (window.AUDRALIA_BEACHES?.sample) {
        const value = window.AUDRALIA_BEACHES.sample(map);
        if (value && typeof value === "object") return value;
      }
    } catch {
      document.documentElement.dataset.audraliaHydrologyBeachReadFailed = "true";
    }

    return null;
  }

  function readTerrainFingers(map) {
    try {
      if (window.AUDRALIA_TERRAIN_FINGERS?.sampleTerrainFingers) {
        const value = window.AUDRALIA_TERRAIN_FINGERS.sampleTerrainFingers(map);
        if (value && typeof value === "object") return value;
      }

      if (window.AUDRALIA_TERRAIN_FINGERS?.sample) {
        const value = window.AUDRALIA_TERRAIN_FINGERS.sample(map);
        if (value && typeof value === "object") return value;
      }
    } catch {
      document.documentElement.dataset.audraliaHydrologyTerrainFingersReadFailed = "true";
    }

    return null;
  }

  function latitudeBands(latitude) {
    const absLat = Math.abs(latitude);

    return Object.freeze({
      absLat,
      tropical: 1 - smoothstep(18, 30, absLat),
      subtropical: smoothstep(18, 30, absLat) * (1 - smoothstep(34, 48, absLat)),
      temperate: smoothstep(32, 48, absLat) * (1 - smoothstep(56, 70, absLat)),
      tundra: smoothstep(58, 72, absLat) * (1 - smoothstep(78, 88, absLat)),
      polar: smoothstep(72, 88, absLat)
    });
  }

  function baseSignals(map, elevation, topology, terrain, climate, beach) {
    const u = wrap01(Number(map?.u || 0));
    const v = clamp(Number(map?.v || 0), 0, 1);
    const latitude = Number.isFinite(Number(map?.latitude)) ? Number(map.latitude) : 90 - v * 180;
    const longitude = Number.isFinite(Number(map?.longitude)) ? Number(map.longitude) : u * 360 - 180;
    const cell256 = getCell256(map);
    const cell = getCellXY(cell256);
    const lat = latitudeBands(latitude);

    const cellPhaseX = (cell.x / 15) * PHI;
    const cellPhaseY = (cell.y / 15) * INV_PHI;

    const shelf = normalize01(map?.shelf, 0.18);
    const beachEdge = normalize01(map?.beachEdge, 0);
    const coastline = normalize01(map?.coastline, shelf * 0.28 + beachEdge * 0.52);

    const coastalText = includesAny(
      [map?.terrainClass, map?.topology, map?.elevation, map?.geologyHint].map(text).join(" "),
      ["coast", "shore", "beach", "landrise", "shelf", "delta", "bay", "inlet", "archipelago", "island"]
    ) ? 0.32 : 0;

    const ocean = isOceanLike(map);
    const beachLike = isBeachLike(map);
    const separated = isSeparatedLandmap(map);
    const archipelago = Boolean(map?.archipelagoIsland || map?.landmassFamily === "archipelago" || includesAny(map?.topology, ["archipelago", "island"]));
    const oceanCut = normalize01(map?.oceanCut, 0);
    const bodyScore = normalize01(map?.bodyScore, 0.48);
    const archipelagoScore = normalize01(map?.archipelagoScore, archipelago ? 0.66 : 0.22);
    const landScore = Number.isFinite(Number(map?.landScore)) ? Number(map.landScore) : ocean ? -0.18 : 0.18;

    const elevation01 = normalize01(elevation?.elevation01 ?? elevation?.height ?? elevation?.altitude ?? map?.elevationScore, ocean ? 0 : 0.40);
    const slope = normalize01(elevation?.slope, 0.34);
    const relief = normalize01(elevation?.relief, 0.34);
    const mountain = normalize01(elevation?.mountain, 0.10) * 0.58 + normalize01(terrain?.mountainFinger, 0) * 0.42;
    const ridge = normalize01(elevation?.ridge, 0.16) * 0.56 + normalize01(terrain?.ridgeChain, 0) * 0.44;
    const valley = normalize01(elevation?.valley, 0.16) * 0.46 + normalize01(terrain?.valleyCut, 0) * 0.28 + normalize01(terrain?.drainageCorridor, 0) * 0.26;
    const basin = normalize01(elevation?.basin, 0.16) * 0.52 + normalize01(terrain?.basinBowl, 0) * 0.48;
    const plateau = normalize01(elevation?.plateau, 0.18) * 0.54 + normalize01(terrain?.plateauShelf, 0) * 0.46;
    const cliff = normalize01(elevation?.cliff, 0.08) * 0.54 + normalize01(terrain?.cliffWall, 0) * 0.46;
    const coastalRise = normalize01(elevation?.coastalRise, 0.12) * 0.52 + normalize01(terrain?.coastalRise, 0) * 0.48;
    const walkability = normalize01(terrain?.walkability, 0.54);

    const heat = normalize01(climate?.heat ?? climate?.temperature ?? climate?.warmth, lat.tropical * 0.82 + lat.subtropical * 0.64 + lat.temperate * 0.46);
    const moisture = normalize01(climate?.moisture ?? climate?.humidity ?? climate?.wetness ?? climate?.rainfall, 0.46);
    const aridity = normalize01(climate?.aridity ?? climate?.dryness, 1 - moisture);
    const cold = normalize01(climate?.cold, lat.tundra * 0.55 + lat.polar * 0.80);
    const wetlandPotential = normalize01(climate?.wetlandPotential, basin * 0.36 + valley * 0.28 + moisture * 0.24);
    const desertPotential = normalize01(climate?.desertPotential, aridity * 0.72);
    const beachWetness = normalize01(beach?.wetness ?? beach?.tidalWash ?? beach?.beachEdge, beachEdge);

    const waterMemory = fbm(u * 0.74 + cellPhaseX, v * 0.66 - cellPhaseY, 201010, 5);
    const basinMemory = fbm(u * 1.10 - cellPhaseY, v * 0.96 + cellPhaseX, 201810, 5);
    const riverField = ridgeNoise(u * 4.8 + cellPhaseY, v * 3.9 - cellPhaseX, 202610, 5);
    const tributaryField = ridgeNoise(u * 12.0 - cellPhaseX, v * 9.8 + cellPhaseY, 203410, 4);
    const bayField = fbm(u * 2.6 + 0.31, v * 2.2 - 0.24, 204210, 5);
    const inletField = ridgeNoise(u * 8.8 - 0.41, v * 6.9 + 0.27, 205010, 4);
    const lakeField = fbm(u * 3.4 + cellPhaseX, v * 2.8 - cellPhaseY, 205810, 4);
    const wetlandField = fbm(u * 5.8 - cellPhaseY, v * 4.6 + cellPhaseX, 206610, 4);
    const deltaField = ridgeNoise(u * 9.4 + 0.13, v * 7.8 - 0.19, 207410, 3);
    const peninsulaField = ridgeNoise(u * 3.2 - cellPhaseX, v * 2.6 + cellPhaseY, 208210, 4);
    const islandField = fbm(u * 10.4 + cellPhaseY, v * 8.9 - cellPhaseX, 209010, 3);
    const corridorField = ridgeNoise(u * 3.6 + oceanCut * 0.4, v * 2.8 - coastline * 0.2, 209810, 5);

    return Object.freeze({
      u,
      v,
      latitude,
      longitude,
      cell256,
      cellX: cell.x,
      cellY: cell.y,
      lat,
      ocean,
      beachLike,
      separated,
      archipelago,
      coastline: clamp(coastline + coastalText + (beachLike ? 0.24 : 0) + (archipelago ? 0.16 : 0), 0, 1),
      shelf,
      beachEdge,
      beachWetness,
      oceanCut,
      bodyScore,
      archipelagoScore,
      landScore,
      elevation01,
      slope,
      relief,
      mountain,
      ridge,
      valley,
      basin,
      plateau,
      cliff,
      coastalRise,
      walkability,
      heat,
      moisture,
      aridity,
      cold,
      wetlandPotential,
      desertPotential,
      waterMemory,
      basinMemory,
      riverField,
      tributaryField,
      bayField,
      inletField,
      lakeField,
      wetlandField,
      deltaField,
      peninsulaField,
      islandField,
      corridorField,
      topologySeaFloor: normalize01(topology?.seaFloorShape ?? topology?.belowSeaDepth, ocean ? 0.60 : 0.24),
      topologyShelf: normalize01(topology?.shelf, shelf),
      topologyBasin: normalize01(topology?.basin, basin),
      topologyLandEligibility: normalize01(topology?.landEligibility, ocean ? 0.18 : 0.72),
      topologyIslandEligibility: normalize01(topology?.islandEligibility, archipelago ? 0.72 : 0.28)
    });
  }

  function computeHydrology(signals) {
    const separatedBoost = signals.separated ? 0.10 : 0;
    const archipelagoBoost = signals.archipelago ? 0.14 : 0;

    const highlandSource = clamp(
      signals.mountain * 0.38 +
      signals.ridge * 0.24 +
      signals.elevation01 * 0.18 +
      signals.relief * 0.10,
      0,
      1
    );

    const lowlandReceiver = clamp(
      signals.basin * 0.30 +
      signals.valley * 0.26 +
      (1 - signals.elevation01) * 0.18 +
      signals.wetlandPotential * 0.14 +
      signals.topologyBasin * 0.10,
      0,
      1
    );

    const rainfallSupply = clamp(
      signals.moisture * 0.36 +
      signals.lat.tropical * 0.14 +
      signals.lat.temperate * 0.08 +
      signals.cold * 0.08 -
      signals.aridity * 0.20,
      0,
      1
    );

    const meltwaterSupply = clamp(
      signals.cold * 0.28 +
      signals.mountain * 0.22 +
      smoothstep(0.54, 0.86, signals.elevation01) * 0.16,
      0,
      1
    );

    const seasonalDryness = clamp(
      signals.aridity * 0.42 +
      signals.desertPotential * 0.24 +
      signals.lat.subtropical * 0.12 -
      signals.moisture * 0.20,
      0,
      1
    );

    const oceanCorridor = clamp(
      signals.oceanCut * 0.42 +
      signals.corridorField * 0.24 +
      signals.topologySeaFloor * 0.18 +
      separatedBoost,
      0,
      1
    );

    const coastalCut = clamp(
      signals.coastline * 0.28 +
      signals.oceanCut * 0.26 +
      signals.inletField * 0.16 +
      signals.bayField * 0.12 +
      archipelagoBoost,
      0,
      1
    );

    const watershed = clamp(
      signals.waterMemory * 0.20 +
      highlandSource * 0.22 +
      lowlandReceiver * 0.18 +
      rainfallSupply * 0.18 +
      meltwaterSupply * 0.10 +
      signals.riverField * 0.12,
      0,
      1
    );

    const drainage = clamp(
      signals.riverField * 0.30 +
      signals.tributaryField * 0.18 +
      signals.valley * 0.22 +
      highlandSource * 0.10 +
      lowlandReceiver * 0.14 +
      rainfallSupply * 0.10 +
      separatedBoost * 0.20,
      0,
      1
    );

    const river = clamp(
      drainage * 0.42 +
      signals.riverField * 0.22 +
      signals.tributaryField * 0.16 +
      highlandSource * 0.08 +
      rainfallSupply * 0.08 -
      seasonalDryness * 0.18,
      0,
      1
    );

    const dryChannel = clamp(
      drainage * 0.36 +
      signals.riverField * 0.20 +
      seasonalDryness * 0.32 -
      rainfallSupply * 0.18,
      0,
      1
    );

    const lake = clamp(
      signals.lakeField * 0.26 +
      signals.basinMemory * 0.20 +
      signals.basin * 0.20 +
      lowlandReceiver * 0.14 +
      rainfallSupply * 0.10 +
      meltwaterSupply * 0.06 -
      signals.slope * 0.18 -
      seasonalDryness * 0.12,
      0,
      1
    );

    const inlandSea = clamp(
      lake * 0.34 +
      signals.basin * 0.24 +
      signals.basinMemory * 0.18 +
      signals.waterMemory * 0.11 +
      signals.oceanCut * 0.08 -
      signals.mountain * 0.14 -
      signals.slope * 0.12,
      0,
      1
    );

    const wetland = clamp(
      signals.wetlandField * 0.22 +
      signals.wetlandPotential * 0.26 +
      signals.basin * 0.16 +
      signals.valley * 0.14 +
      drainage * 0.12 +
      rainfallSupply * 0.12 -
      seasonalDryness * 0.18,
      0,
      1
    );

    const delta = clamp(
      signals.coastline * 0.24 +
      signals.deltaField * 0.24 +
      river * 0.24 +
      lowlandReceiver * 0.14 +
      signals.shelf * 0.10 -
      signals.cliff * 0.20 -
      signals.coastalRise * 0.14,
      0,
      1
    );

    const bay = clamp(
      signals.coastline * 0.30 +
      signals.bayField * 0.24 +
      signals.inletField * 0.14 +
      signals.shelf * 0.14 +
      oceanCorridor * 0.12 -
      signals.cliff * 0.16 -
      signals.mountain * 0.10,
      0,
      1
    );

    const inlet = clamp(
      signals.coastline * 0.24 +
      signals.inletField * 0.30 +
      signals.valley * 0.14 +
      river * 0.10 +
      signals.shelf * 0.08 +
      coastalCut * 0.14 -
      signals.cliff * 0.16,
      0,
      1
    );

    const estuary = clamp(
      signals.coastline * 0.22 +
      inlet * 0.22 +
      river * 0.24 +
      delta * 0.18 +
      signals.shelf * 0.08,
      0,
      1
    );

    const peninsula = clamp(
      signals.coastline * 0.22 +
      signals.peninsulaField * 0.28 +
      bay * 0.18 +
      inlet * 0.16 +
      signals.coastalRise * 0.08 +
      signals.walkability * 0.06 -
      signals.cliff * 0.12,
      0,
      1
    );

    const lagoon = clamp(
      signals.coastline * 0.24 +
      bay * 0.18 +
      signals.shelf * 0.20 +
      signals.islandField * 0.14 +
      archipelagoBoost +
      signals.lat.tropical * 0.10 +
      signals.lat.subtropical * 0.08 -
      signals.cliff * 0.12,
      0,
      1
    );

    const marshBasin = clamp(
      wetland * 0.28 +
      signals.basin * 0.24 +
      lake * 0.14 +
      lowlandReceiver * 0.14 +
      signals.wetlandPotential * 0.14 -
      seasonalDryness * 0.12,
      0,
      1
    );

    const coastalShelfWater = clamp(
      signals.coastline * 0.30 +
      signals.shelf * 0.28 +
      bay * 0.14 +
      lagoon * 0.12 +
      signals.beachEdge * 0.08 +
      signals.topologyShelf * 0.10,
      0,
      1
    );

    const landCutPressure = clamp(
      oceanCorridor * 0.26 +
      bay * 0.20 +
      inlet * 0.22 +
      inlandSea * 0.12 +
      lagoon * 0.08 +
      delta * 0.06 +
      peninsula * 0.06,
      0,
      1
    );

    const surfaceWaterPressure = clamp(
      lake * 0.18 +
      inlandSea * 0.20 +
      river * 0.18 +
      wetland * 0.14 +
      delta * 0.10 +
      estuary * 0.08 +
      marshBasin * 0.08 +
      coastalShelfWater * 0.04,
      0,
      1
    );

    return Object.freeze({
      highlandSource,
      lowlandReceiver,
      rainfallSupply,
      meltwaterSupply,
      seasonalDryness,
      oceanCorridor,
      coastalCut,
      watershed,
      drainage,
      river,
      dryChannel,
      lake,
      inlandSea,
      wetland,
      delta,
      bay,
      inlet,
      estuary,
      peninsula,
      lagoon,
      marshBasin,
      coastalShelfWater,
      landCutPressure,
      surfaceWaterPressure
    });
  }

  function classifyHydrology(signals, hydro) {
    if (signals.ocean) {
      if (hydro.oceanCorridor > 0.64) return [WATER_CLASSES.OPEN_OCEAN, "marine-corridor", "ocean-corridor"];
      if (hydro.bay > 0.62) return [WATER_CLASSES.BAY_WATER, "coastal-water", "bay-shaped-coast"];
      if (hydro.inlet > 0.62) return [WATER_CLASSES.INLET_WATER, "coastal-water", "inlet-shaped-coast"];
      if (hydro.lagoon > 0.64) return [WATER_CLASSES.LAGOON_WATER, "coastal-water", "lagoon-shelf"];
      if (hydro.coastalShelfWater > 0.56) return [WATER_CLASSES.SHELF_WATER, "coastal-shelf", "shallow-shelf-transition"];
      return [WATER_CLASSES.OPEN_OCEAN, "marine", "ocean-held"];
    }

    if (hydro.inlandSea > 0.70 && hydro.lake > 0.58) return [WATER_CLASSES.INLAND_SEA, "interior-water", "large-basin-water"];
    if (hydro.lake > 0.66) return [WATER_CLASSES.LAKE, "interior-water", "lake-basin"];
    if (hydro.marshBasin > 0.66) return [WATER_CLASSES.MARSH_BASIN, "wetland", "low-basin-marsh"];
    if (hydro.wetland > 0.66) return [WATER_CLASSES.WETLAND, "wetland", "saturated-lowland"];
    if (hydro.delta > 0.64) return [WATER_CLASSES.DELTA, "coastal-wetland", "river-mouth-delta"];
    if (hydro.estuary > 0.62) return [WATER_CLASSES.ESTUARY, "coastal-water", "river-meets-sea"];
    if (hydro.river > 0.66) return [WATER_CLASSES.RIVER, "drainage", "flowing-river-corridor"];
    if (hydro.dryChannel > 0.70) return [WATER_CLASSES.DRY_CHANNEL, "seasonal-drainage", "dry-riverbed"];
    if (hydro.peninsula > 0.64) return [WATER_CLASSES.PENINSULA, "coastal-landform", "water-shaped-land-arm"];
    if (hydro.bay > 0.60) return [WATER_CLASSES.BAY_EDGE, "coastal-landform", "land-shaped-by-bay"];
    if (hydro.inlet > 0.60) return [WATER_CLASSES.INLET_EDGE, "coastal-landform", "narrow-water-cut"];
    if (hydro.watershed > 0.56) return [WATER_CLASSES.WATERSHED, "drainage-basin", "water-shaped-terrain"];

    return [WATER_CLASSES.ORDINARY_LAND, "dry-land", "hydrology-background"];
  }

  function waterColorHintFor(waterClass) {
    switch (waterClass) {
      case WATER_CLASSES.INLAND_SEA:
        return "deep-inland-blue";
      case WATER_CLASSES.LAKE:
        return "lake-blue";
      case WATER_CLASSES.RIVER:
        return "river-blue-green";
      case WATER_CLASSES.WETLAND:
        return "wetland-green-blue";
      case WATER_CLASSES.MARSH_BASIN:
        return "marsh-green";
      case WATER_CLASSES.DELTA:
        return "delta-green-blue";
      case WATER_CLASSES.ESTUARY:
        return "estuary-blue-green";
      case WATER_CLASSES.LAGOON_WATER:
        return "lagoon-turquoise";
      case WATER_CLASSES.SHELF_WATER:
        return "shelf-blue";
      case WATER_CLASSES.BAY_WATER:
        return "bay-blue";
      case WATER_CLASSES.INLET_WATER:
        return "inlet-blue";
      case WATER_CLASSES.OPEN_OCEAN:
        return "deep-ocean-blue";
      default:
        return "hydrology-background";
    }
  }

  function sampleHydrology(input, maybeV) {
    const source = coerceMap(input, maybeV);
    const elevation = readElevation(source);
    const topology = readTopology(source);
    const terrain = readTerrainFingers(source);
    const climate = readClimate(source);
    const beach = readBeach(source);

    const signals = baseSignals(source, elevation, topology, terrain, climate, beach);
    const hydro = computeHydrology(signals);
    const [waterClass, zone, form] = classifyHydrology(signals, hydro);

    const isInlandWater = !signals.ocean && (
      waterClass === WATER_CLASSES.INLAND_SEA ||
      waterClass === WATER_CLASSES.LAKE ||
      waterClass === WATER_CLASSES.RIVER ||
      waterClass === WATER_CLASSES.WETLAND ||
      waterClass === WATER_CLASSES.MARSH_BASIN ||
      waterClass === WATER_CLASSES.DELTA ||
      waterClass === WATER_CLASSES.ESTUARY
    );

    const isSurfaceWater = Boolean(
      signals.ocean ||
      isInlandWater ||
      hydro.surfaceWaterPressure > 0.54 ||
      hydro.lake > 0.64 ||
      hydro.river > 0.64 ||
      hydro.wetland > 0.64 ||
      hydro.delta > 0.62 ||
      hydro.estuary > 0.60
    );

    const isLandformShaping = Boolean(
      hydro.landCutPressure > 0.48 ||
      hydro.peninsula > 0.56 ||
      hydro.bay > 0.56 ||
      hydro.inlet > 0.56 ||
      hydro.oceanCorridor > 0.56 ||
      hydro.watershed > 0.54 ||
      hydro.drainage > 0.56 ||
      hydro.coastalShelfWater > 0.54
    );

    const shouldInterruptSolidLandmass = Boolean(
      !signals.ocean &&
      (
        hydro.landCutPressure > 0.54 ||
        hydro.inlandSea > 0.66 ||
        hydro.bay > 0.62 ||
        hydro.inlet > 0.62 ||
        hydro.lagoon > 0.64 ||
        hydro.oceanCorridor > 0.64
      )
    );

    return Object.freeze({
      allowed: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-hydrology-corridor-and-inland-water-renewal",
      mathBinding: "high_order_computable_planetary_math",
      chronologicalFormationFirst: true,

      cell256: signals.cell256,
      cellX: signals.cellX,
      cellY: signals.cellY,
      latitude: signals.latitude,
      longitude: signals.longitude,

      isOcean: signals.ocean,
      isSeparatedLandmap: signals.separated,
      isArchipelago: signals.archipelago,
      isInlandWater,
      isSurfaceWater,
      isLandformShaping,

      class: waterClass,
      zone,
      form,
      waterColorHint: waterColorHintFor(waterClass),

      oceanCorridor: sharpen(hydro.oceanCorridor, 1.12),
      coastalCut: sharpen(hydro.coastalCut, 1.14),
      landCutPressure: sharpen(hydro.landCutPressure, 1.18),
      surfaceWaterPressure: sharpen(hydro.surfaceWaterPressure, 1.14),

      watershed: hydro.watershed,
      drainage: hydro.drainage,
      river: hydro.river,
      dryChannel: hydro.dryChannel,
      lake: hydro.lake,
      inlandSea: hydro.inlandSea,
      wetland: hydro.wetland,
      delta: hydro.delta,
      bay: hydro.bay,
      inlet: hydro.inlet,
      estuary: hydro.estuary,
      peninsula: hydro.peninsula,
      lagoon: hydro.lagoon,
      marshBasin: hydro.marshBasin,
      coastalShelfWater: hydro.coastalShelfWater,
      highlandSource: hydro.highlandSource,
      lowlandReceiver: hydro.lowlandReceiver,
      rainfallSupply: hydro.rainfallSupply,
      meltwaterSupply: hydro.meltwaterSupply,
      seasonalDryness: hydro.seasonalDryness,

      sourceReads: {
        landmap: Boolean(window.AUDRALIA_LANDMAP?.sampleLandmap || window.AUDRALIA_LANDMAP?.sample),
        separatedLandmap: signals.separated,
        elevation: Boolean(elevation),
        topology: Boolean(topology),
        terrainFingers: Boolean(terrain),
        climate: Boolean(climate),
        beachAuthority: Boolean(beach)
      },

      visualGuidance: {
        shouldPaintWater: isSurfaceWater && !signals.ocean,
        shouldShapeLand: isLandformShaping,
        shouldInterruptSolidLandmass,
        shouldSupportWetlandColor: hydro.wetland > 0.58 || hydro.marshBasin > 0.58 || hydro.delta > 0.58,
        shouldSupportRiverCorridor: hydro.river > 0.58 || hydro.drainage > 0.58,
        shouldSupportDryChannel: hydro.dryChannel > 0.64,
        shouldSupportArchipelagoWater: signals.archipelago && (hydro.lagoon > 0.48 || hydro.coastalShelfWater > 0.48),
        shouldSupportOceanCorridor: hydro.oceanCorridor > 0.56,
        shouldSupportBayInletBreaks: hydro.bay > 0.56 || hydro.inlet > 0.56,
        shouldSupportInlandWater: hydro.lake > 0.60 || hydro.inlandSea > 0.60
      },

      ownsFootprint: false,
      ownsLandSea: false,
      ownsBeach: false,
      ownsClimate: false,
      ownsElevation: false,
      ownsTopology: false,
      ownsTerrainFingers: false,
      ownsSurfaceColor: false,
      ownsCanvas: false,
      canvasMayPaint: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function sample(input, maybeV) {
    return sampleHydrology(input, maybeV);
  }

  function classifyWater(input, maybeV) {
    return sampleHydrology(input, maybeV).class;
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-hydrology-authority",
      role: "hydrology_corridor_and_inland_water_renewal",
      mathBinding: "high_order_computable_planetary_math",
      consumesRenewedLandmap: true,
      expectsLandmapContract: "AUDRALIA_LANDMASS_SEPARATION_AND_ARCHIPELAGO_RENEWAL_TNT_v1",
      exposes: [
        "sampleHydrology",
        "sample",
        "classifyWater",
        "getStatus"
      ],
      hydrologyOutputs: [
        "ocean_corridors",
        "coastal_cuts",
        "inland_lakes",
        "inland_seas",
        "river_systems",
        "drainage_corridors",
        "wetlands",
        "deltas",
        "marsh_basins",
        "coastal_bays",
        "inlets",
        "estuaries",
        "peninsulas",
        "lagoon_systems",
        "watershed_basins",
        "mountain_fed_rivers",
        "desert_dry_channels",
        "tropical_wetlands",
        "subtropical_seasonal_rivers",
        "tundra_meltwater_fields",
        "archipelago_shelf_water",
        "solid_land_interruption_pressure"
      ],
      canonicalLaw: [
        "hydrology_does_not_own_footprint",
        "landmap_separates_landmasses_before_hydrology_guides_water_expression",
        "hydrology_shapes_visible_water_behavior_without_replacing_landmap",
        "bays_and_inlets_must_visibly_break_solid_continental_read",
        "rivers_follow_elevation_and_drainage_logic",
        "interior_land_cannot_be_all_dry_terrain",
        "archipelagos_require_shelf_lagoon_and_channel_guidance"
      ],
      ownsFootprint: false,
      ownsLandSea: false,
      ownsBeach: false,
      ownsClimate: false,
      ownsElevation: false,
      ownsTopology: false,
      ownsTerrainFingers: false,
      ownsSurfaceColor: false,
      ownsCanvas: false,
      ownsRuntime: false,
      ownsGauges: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.AUDRALIA_HYDROLOGY = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    waterClasses: WATER_CLASSES,
    sampleHydrology,
    sample,
    classifyWater,
    getStatus
  });

  window.AUDRALIA_HYDROLOGY_RECEIPT = getStatus();

  document.documentElement.dataset.audraliaHydrologyLoaded = "true";
  document.documentElement.dataset.audraliaHydrologyContract = CONTRACT;
  document.documentElement.dataset.audraliaHydrologyReceipt = RECEIPT;
  document.documentElement.dataset.audraliaHydrologyPreviousContract = PREVIOUS_CONTRACT;
  document.documentElement.dataset.audraliaHydrologyRole = "hydrology_corridor_and_inland_water_renewal";
  document.documentElement.dataset.audraliaHydrologyMathBinding = "high_order_computable_planetary_math";
  document.documentElement.dataset.audraliaHydrologyConsumesRenewedLandmap = "true";
  document.documentElement.dataset.audraliaHydrologyOceanCorridors = "true";
  document.documentElement.dataset.audraliaHydrologyCoastalCuts = "true";
  document.documentElement.dataset.audraliaHydrologyWatersheds = "true";
  document.documentElement.dataset.audraliaHydrologyRivers = "true";
  document.documentElement.dataset.audraliaHydrologyLakes = "true";
  document.documentElement.dataset.audraliaHydrologyInlandSeas = "true";
  document.documentElement.dataset.audraliaHydrologyWetlands = "true";
  document.documentElement.dataset.audraliaHydrologyDeltas = "true";
  document.documentElement.dataset.audraliaHydrologyBays = "true";
  document.documentElement.dataset.audraliaHydrologyInlets = "true";
  document.documentElement.dataset.audraliaHydrologyPeninsulas = "true";
  document.documentElement.dataset.audraliaHydrologyLagoons = "true";
  document.documentElement.dataset.audraliaHydrologyArchipelagoShelfWater = "true";
  document.documentElement.dataset.audraliaHydrologySolidLandInterruptionPressure = "true";
  document.documentElement.dataset.audraliaHydrologyOwnsFootprint = "false";
  document.documentElement.dataset.audraliaHydrologyOwnsLandSea = "false";
  document.documentElement.dataset.audraliaHydrologyOwnsBeach = "false";
  document.documentElement.dataset.audraliaHydrologyOwnsClimate = "false";
  document.documentElement.dataset.audraliaHydrologyOwnsElevation = "false";
  document.documentElement.dataset.audraliaHydrologyOwnsTopology = "false";
  document.documentElement.dataset.audraliaHydrologyOwnsTerrainFingers = "false";
  document.documentElement.dataset.audraliaHydrologyOwnsSurfaceColor = "false";
  document.documentElement.dataset.audraliaHydrologyOwnsCanvas = "false";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();

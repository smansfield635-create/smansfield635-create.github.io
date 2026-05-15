// /assets/audralia/audralia.hydrology.js
// AUDRALIA_ORGANIC_HYDRATION_AND_WATERSHED_AUTHORITY_TNT_v1
// Full-file replacement.
// Hydrology / hydration authority only.
// Purpose:
// - Gives Audralia organic water-shaped landform logic before further surface detail.
// - Defines inland lakes, inland seas, rivers, drainage corridors, wetlands, deltas, marsh basins, bays, inlets, estuaries, peninsulas, lagoon systems, watershed basins, mountain-fed rivers, dry channels, and meltwater fields.
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

  const CONTRACT = "AUDRALIA_ORGANIC_HYDRATION_AND_WATERSHED_AUTHORITY_TNT_v1";
  const RECEIPT = "AUDRALIA_ORGANIC_HYDRATION_AND_WATERSHED_AUTHORITY_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_HYDROLOGY_HELD_OR_UNDEFINED";
  const VERSION = "2026-05-15.audralia-organic-hydration-and-watershed-authority-v1";

  const PHI = 1.618033988749895;
  const INV_PHI = 1 / PHI;

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

  function baseSignals(map, elevation, terrain, climate) {
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
    const coastalText = includesAny(
      [map?.terrainClass, map?.topology, map?.elevation].map(text).join(" "),
      ["coast", "shore", "beach", "landrise", "shelf", "delta"]
    ) ? 0.32 : 0;

    const coastline = clamp(shelf * 0.28 + beachEdge * 0.52 + coastalText + (isBeachLike(map) ? 0.28 : 0), 0, 1);
    const ocean = isOceanLike(map);

    const elevation01 = normalize01(elevation?.elevation01 ?? elevation?.height ?? elevation?.altitude, 0.38);
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

    const waterMemory = fbm(u * 0.74 + cellPhaseX, v * 0.66 - cellPhaseY, 101010, 5);
    const basinMemory = fbm(u * 1.10 - cellPhaseY, v * 0.96 + cellPhaseX, 101810, 5);
    const riverField = ridgeNoise(u * 4.6 + cellPhaseY, v * 3.8 - cellPhaseX, 102610, 5);
    const tributaryField = ridgeNoise(u * 11.5 - cellPhaseX, v * 9.6 + cellPhaseY, 103410, 4);
    const bayField = fbm(u * 2.2 + 0.31, v * 1.9 - 0.24, 104210, 5);
    const inletField = ridgeNoise(u * 7.2 - 0.41, v * 5.9 + 0.27, 105010, 4);
    const lakeField = fbm(u * 3.2 + cellPhaseX, v * 2.7 - cellPhaseY, 105810, 4);
    const wetlandField = fbm(u * 5.6 - cellPhaseY, v * 4.4 + cellPhaseX, 106610, 4);
    const deltaField = ridgeNoise(u * 8.7 + 0.13, v * 7.4 - 0.19, 107410, 3);
    const peninsulaField = ridgeNoise(u * 2.8 - cellPhaseX, v * 2.3 + cellPhaseY, 108210, 4);
    const islandField = fbm(u * 9.1 + cellPhaseY, v * 8.3 - cellPhaseX, 109010, 3);

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
      coastline,
      shelf,
      beachEdge,
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
      islandField
    });
  }

  function computeHydrology(signals) {
    const highlandSource = clamp(signals.mountain * 0.38 + signals.ridge * 0.24 + signals.elevation01 * 0.18, 0, 1);
    const lowlandReceiver = clamp(signals.basin * 0.30 + signals.valley * 0.26 + (1 - signals.elevation01) * 0.18 + signals.wetlandPotential * 0.14, 0, 1);

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

    const watershed = clamp(
      signals.waterMemory * 0.22 +
      highlandSource * 0.22 +
      lowlandReceiver * 0.18 +
      rainfallSupply * 0.18 +
      meltwaterSupply * 0.10 +
      signals.riverField * 0.10,
      0,
      1
    );

    const drainage = clamp(
      signals.riverField * 0.30 +
      signals.tributaryField * 0.18 +
      signals.valley * 0.22 +
      highlandSource * 0.10 +
      lowlandReceiver * 0.14 +
      rainfallSupply * 0.10,
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
      lake * 0.36 +
      signals.basin * 0.26 +
      signals.basinMemory * 0.20 +
      signals.waterMemory * 0.12 -
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
      signals.coastline * 0.32 +
      signals.bayField * 0.26 +
      signals.inletField * 0.14 +
      signals.shelf * 0.14 -
      signals.cliff * 0.16 -
      signals.mountain * 0.10,
      0,
      1
    );

    const inlet = clamp(
      signals.coastline * 0.26 +
      signals.inletField * 0.30 +
      signals.valley * 0.14 +
      river * 0.10 +
      signals.shelf * 0.08 -
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
      signals.coastline * 0.24 +
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
      signals.beachEdge * 0.08,
      0,
      1
    );

    return Object.freeze({
      highlandSource,
      lowlandReceiver,
      rainfallSupply,
      meltwaterSupply,
      seasonalDryness,
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
      coastalShelfWater
    });
  }

  function classifyHydrology(signals, hydro) {
    if (signals.ocean) {
      if (hydro.bay > 0.62) return ["bay-water", "coastal-water", "bay-shaped-coast"];
      if (hydro.inlet > 0.62) return ["inlet-water", "coastal-water", "inlet-shaped-coast"];
      if (hydro.lagoon > 0.64) return ["lagoon-water", "coastal-water", "lagoon-shelf"];
      if (hydro.coastalShelfWater > 0.58) return ["shelf-water", "coastal-shelf", "shallow-shelf-transition"];
      return ["open-ocean", "marine", "ocean-held"];
    }

    if (hydro.inlandSea > 0.72 && hydro.lake > 0.62) return ["inland-sea", "interior-water", "large-basin-water"];
    if (hydro.lake > 0.68) return ["lake", "interior-water", "lake-basin"];
    if (hydro.marshBasin > 0.68) return ["marsh-basin", "wetland", "low-basin-marsh"];
    if (hydro.wetland > 0.68) return ["wetland", "wetland", "saturated-lowland"];
    if (hydro.delta > 0.66) return ["delta", "coastal-wetland", "river-mouth-delta"];
    if (hydro.estuary > 0.64) return ["estuary", "coastal-water", "river-meets-sea"];
    if (hydro.river > 0.68) return ["river", "drainage", "flowing-river-corridor"];
    if (hydro.dryChannel > 0.70) return ["dry-channel", "seasonal-drainage", "dry-riverbed"];
    if (hydro.peninsula > 0.66) return ["peninsula", "coastal-landform", "water-shaped-land-arm"];
    if (hydro.bay > 0.62) return ["bay-edge", "coastal-landform", "land-shaped-by-bay"];
    if (hydro.inlet > 0.62) return ["inlet-edge", "coastal-landform", "narrow-water-cut"];
    if (hydro.watershed > 0.58) return ["watershed", "drainage-basin", "water-shaped-terrain"];

    return ["ordinary-land", "dry-land", "hydrology-background"];
  }

  function sampleHydrology(map) {
    const source = map && typeof map === "object" ? map : {};
    const elevation = readElevation(source);
    const terrain = readTerrainFingers(source);
    const climate = readClimate(source);
    const beach = readBeach(source);

    const signals = baseSignals(source, elevation, terrain, climate);
    const hydro = computeHydrology(signals);
    const [waterClass, zone, form] = classifyHydrology(signals, hydro);

    const isInlandWater = !signals.ocean && (
      waterClass === "inland-sea" ||
      waterClass === "lake" ||
      waterClass === "river" ||
      waterClass === "wetland" ||
      waterClass === "marsh-basin" ||
      waterClass === "delta" ||
      waterClass === "estuary"
    );

    const isSurfaceWater = Boolean(
      signals.ocean ||
      isInlandWater ||
      hydro.lake > 0.68 ||
      hydro.river > 0.68 ||
      hydro.wetland > 0.68 ||
      hydro.delta > 0.66 ||
      hydro.estuary > 0.64
    );

    const isLandformShaping = Boolean(
      hydro.peninsula > 0.58 ||
      hydro.bay > 0.58 ||
      hydro.inlet > 0.58 ||
      hydro.watershed > 0.56 ||
      hydro.drainage > 0.58 ||
      hydro.coastalShelfWater > 0.56
    );

    const waterColorHint =
      waterClass === "inland-sea" ? "deep-inland-blue" :
      waterClass === "lake" ? "lake-blue" :
      waterClass === "river" ? "river-blue-green" :
      waterClass === "wetland" ? "wetland-green-blue" :
      waterClass === "marsh-basin" ? "marsh-green" :
      waterClass === "delta" ? "delta-green-blue" :
      waterClass === "estuary" ? "estuary-blue-green" :
      waterClass === "lagoon-water" ? "lagoon-turquoise" :
      waterClass === "shelf-water" ? "shelf-blue" :
      "hydrology-background";

    return Object.freeze({
      allowed: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-organic-hydration-and-watershed-authority",
      mathBinding: "high_order_computable_planetary_math",
      chronologicalFormationFirst: true,
      cell256: signals.cell256,
      cellX: signals.cellX,
      cellY: signals.cellY,
      latitude: signals.latitude,
      longitude: signals.longitude,
      isOcean: signals.ocean,
      isInlandWater,
      isSurfaceWater,
      isLandformShaping,
      class: waterClass,
      zone,
      form,
      waterColorHint,
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
        elevation: Boolean(elevation),
        terrainFingers: Boolean(terrain),
        climate: Boolean(climate),
        beachAuthority: Boolean(beach)
      },
      visualGuidance: {
        shouldPaintWater: isSurfaceWater && !signals.ocean,
        shouldShapeLand: isLandformShaping,
        shouldInterruptSolidLandmass: hydro.bay > 0.60 || hydro.inlet > 0.60 || hydro.peninsula > 0.62 || hydro.inlandSea > 0.68,
        shouldSupportWetlandColor: hydro.wetland > 0.60 || hydro.marshBasin > 0.60 || hydro.delta > 0.60,
        shouldSupportRiverCorridor: hydro.river > 0.60 || hydro.drainage > 0.60,
        shouldSupportDryChannel: hydro.dryChannel > 0.66
      },
      ownsFootprint: false,
      ownsLandSea: false,
      ownsBeach: false,
      ownsClimate: false,
      ownsElevation: false,
      ownsTerrainFingers: false,
      ownsSurfaceColor: false,
      ownsCanvas: false,
      canvasMayPaint: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function sample(map) {
    return sampleHydrology(map);
  }

  function classifyWater(map) {
    const sampleResult = sampleHydrology(map);
    return sampleResult.class;
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-hydrology-authority",
      role: "organic_hydration_and_watershed_authority",
      mathBinding: "high_order_computable_planetary_math",
      exposes: [
        "sampleHydrology",
        "sample",
        "classifyWater",
        "getStatus"
      ],
      hydrologyOutputs: [
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
        "tundra_meltwater_fields"
      ],
      canonicalLaw: [
        "terrain_detail_cannot_be_natural_until_water_system_and_landform_footprint_are_natural",
        "landform_shape_must_precede_landform_decoration",
        "hydrology_shapes_land_before_surface_adds_detail",
        "peninsulas_require_water_cut_logic",
        "bays_and_inlets_break_continental_slabs",
        "rivers_follow_terrain_logic",
        "interior_land_cannot_be_all_dry_terrain"
      ],
      ownsFootprint: false,
      ownsLandSea: false,
      ownsBeach: false,
      ownsClimate: false,
      ownsElevation: false,
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
  document.documentElement.dataset.audraliaHydrologyRole = "organic_hydration_and_watershed_authority";
  document.documentElement.dataset.audraliaHydrologyMathBinding = "high_order_computable_planetary_math";
  document.documentElement.dataset.audraliaHydrologyChronologyFirst = "true";
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
  document.documentElement.dataset.audraliaHydrologyOwnsFootprint = "false";
  document.documentElement.dataset.audraliaHydrologyOwnsLandSea = "false";
  document.documentElement.dataset.audraliaHydrologyOwnsBeach = "false";
  document.documentElement.dataset.audraliaHydrologyOwnsClimate = "false";
  document.documentElement.dataset.audraliaHydrologyOwnsElevation = "false";
  document.documentElement.dataset.audraliaHydrologyOwnsTerrainFingers = "false";
  document.documentElement.dataset.audraliaHydrologyOwnsSurfaceColor = "false";
  document.documentElement.dataset.audraliaHydrologyOwnsCanvas = "false";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();

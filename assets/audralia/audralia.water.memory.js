// /assets/audralia/audralia.water.memory.js
// AUDRALIA_WATER_MEMORY_CYCLE_AND_FIBONACCI_LATTICE_AUTHORITY_TNT_v1
// Full-file replacement.
// Water Memory / Hydrological Coherent Cycle authority only.
// Purpose:
// - Gives Audralia’s water system its own independent Fibonacci lattice, 16-node packet, 256-state expression, and accumulated memory.
// - Water expresses according to physics, history, watershed memory, climate pressure, terrain permission, elevation flow, and current coherent cycle.
// - Builds water as a living planetary system: rivers remember paths, basins remember water, deltas remember deposition, dry channels remember absence, and coastlines remember pressure.
// - Does not own terrain.
// - Does not own land/sea footprint.
// - Does not own beaches.
// - Does not own elevation.
// - Does not own climate.
// - Does not own groundcover.
// - Does not own surface color.
// - Does not render canvas.
// - Does not touch runtime.
// - Does not touch Gauges.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_WATER_MEMORY_CYCLE_AND_FIBONACCI_LATTICE_AUTHORITY_TNT_v1";
  const RECEIPT = "AUDRALIA_WATER_MEMORY_CYCLE_AND_FIBONACCI_LATTICE_AUTHORITY_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_ORGANIC_HYDRATION_AND_WATERSHED_AUTHORITY_TNT_v1";
  const VERSION = "2026-05-15.audralia-water-memory-cycle-and-fibonacci-lattice-authority-v1";

  const PHI = 1.618033988749895;
  const INV_PHI = 1 / PHI;
  const CURRENT_CYCLE_YEARS_REMAINING = 300;

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

  function sharpen(value, strength = 1.16) {
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

  function getCell16(cell256) {
    const index = clamp(Math.floor(cell256) - 1, 0, 255);
    return Math.floor(index / 16) + 1;
  }

  function getNode16(cell256) {
    const index = clamp(Math.floor(cell256) - 1, 0, 255);
    return (index % 16) + 1;
  }

  function readAuthority(name, primaryMethod, fallbackMethod, map) {
    try {
      const authority = window[name];
      if (!authority) return null;

      if (typeof authority[primaryMethod] === "function") {
        const value = authority[primaryMethod](map);
        if (value && typeof value === "object") return value;
      }

      if (typeof authority[fallbackMethod] === "function") {
        const value = authority[fallbackMethod](map);
        if (value && typeof value === "object") return value;
      }
    } catch {
      document.documentElement.dataset.audraliaWaterMemoryAuthorityReadFailed = name;
    }

    return null;
  }

  function buildBase(map) {
    const source = map && typeof map === "object" ? map : {};
    const u = wrap01(Number(source.u || 0));
    const v = clamp(Number(source.v || 0), 0, 1);
    const latitude = Number.isFinite(Number(source.latitude)) ? Number(source.latitude) : 90 - v * 180;
    const longitude = Number.isFinite(Number(source.longitude)) ? Number(source.longitude) : u * 360 - 180;
    const cell256 = getCell256(source);
    const cell = getCellXY(cell256);
    const cell16 = getCell16(cell256);
    const node16 = getNode16(cell256);

    const cellPhaseX = (cell.x / 15) * PHI;
    const cellPhaseY = (cell.y / 15) * INV_PHI;

    return Object.freeze({
      source,
      u,
      v,
      latitude,
      longitude,
      cell256,
      cell16,
      node16,
      cellX: cell.x,
      cellY: cell.y,
      cellPhaseX,
      cellPhaseY
    });
  }

  function readContext(base) {
    const map = base.source;

    return Object.freeze({
      memory: readAuthority("AUDRALIA_MEMORY", "sampleMemory", "sample", map),
      hydrology: readAuthority("AUDRALIA_HYDROLOGY", "sampleHydrology", "sample", map),
      terrain: readAuthority("AUDRALIA_TERRAIN_FINGERS", "sampleTerrainFingers", "sample", map),
      elevation: readAuthority("AUDRALIA_ELEVATION", "sampleElevation", "sample", map),
      climate: readAuthority("AUDRALIA_CLIMATE_RENDER", "sampleClimate", "sample", map),
      beaches: readAuthority("AUDRALIA_BEACHES", "sampleBeach", "sample", map),
      groundcover: readAuthority("AUDRALIA_GROUNDCOVER", "sampleGroundcover", "sample", map)
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

  function isCoastalLike(map) {
    return Boolean(
      map?.isBeach ||
      map?.isShelf ||
      map?.beachEdge > 0.25 ||
      includesAny([map?.terrainClass, map?.topology, map?.elevation].map(text).join(" "), [
        "coast",
        "shore",
        "beach",
        "shelf",
        "delta",
        "landrise"
      ])
    );
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

  function computeWaterPhysics(base, context) {
    const map = base.source;
    const lat = latitudeBands(base.latitude);

    const ocean = isOceanLike(map);
    const coastal = isCoastalLike(map);

    const shelf = normalize01(map.shelf, 0.16);
    const beachEdge = normalize01(map.beachEdge, 0);

    const elevation01 = normalize01(context.elevation?.elevation01 ?? context.elevation?.height ?? context.elevation?.altitude, 0.38);
    const slope = normalize01(context.elevation?.slope, 0.34);
    const relief = normalize01(context.elevation?.relief, 0.34);
    const mountain = normalize01(context.elevation?.mountain, 0.12) * 0.54 + normalize01(context.terrain?.mountainFinger, 0.08) * 0.46;
    const ridge = normalize01(context.elevation?.ridge, 0.18) * 0.52 + normalize01(context.terrain?.ridgeChain, 0.14) * 0.48;
    const valley = normalize01(context.elevation?.valley, 0.18) * 0.46 + normalize01(context.terrain?.valleyCut, 0.16) * 0.30 + normalize01(context.terrain?.drainageCorridor, 0.16) * 0.24;
    const basin = normalize01(context.elevation?.basin, 0.18) * 0.50 + normalize01(context.terrain?.basinBowl, 0.16) * 0.50;
    const cliff = normalize01(context.elevation?.cliff, 0.08) * 0.52 + normalize01(context.terrain?.cliffWall, 0.08) * 0.48;
    const coastalRise = normalize01(context.elevation?.coastalRise, 0.10) * 0.50 + normalize01(context.terrain?.coastalRise, 0.10) * 0.50;

    const heat = normalize01(context.climate?.heat ?? context.climate?.temperature ?? context.climate?.warmth, lat.tropical * 0.82 + lat.subtropical * 0.64 + lat.temperate * 0.46);
    const moisture = normalize01(context.climate?.moisture ?? context.climate?.humidity ?? context.climate?.wetness ?? context.climate?.rainfall, 0.44);
    const rainfall = normalize01(context.climate?.rainfall ?? context.climate?.precipitation, moisture);
    const aridity = normalize01(context.climate?.aridity ?? context.climate?.dryness, 1 - moisture);
    const cold = normalize01(context.climate?.cold, lat.tundra * 0.55 + lat.polar * 0.80);
    const seasonality = normalize01(context.climate?.seasonality, lat.subtropical * 0.38 + lat.temperate * 0.24);

    const geologicalMemory = normalize01(context.memory?.geologicalMemory, 0.46);
    const hydrologicalMemory = normalize01(context.memory?.hydrologicalMemory, 0.42);
    const climateMemory = normalize01(context.memory?.climateMemory, 0.42);
    const impactMemory = normalize01(context.memory?.impactMemory, 0.24);
    const restorationMemory = normalize01(context.memory?.restorationMemory, 0.38);
    const transitionPressure = normalize01(context.memory?.transitionPressure, 0.34);
    const coherentCycleState = normalize01(context.memory?.coherentCycleState, 0.50);

    const waterMemoryField = fbm(base.u * 0.62 + base.cellPhaseX, base.v * 0.56 - base.cellPhaseY, 141100, 5);
    const ancientSeaField = fbm(base.u * 0.92 - base.cellPhaseY, base.v * 0.82 + base.cellPhaseX, 141900, 5);
    const riverMemoryField = ridgeNoise(base.u * 4.8 + base.cellPhaseY, base.v * 3.9 - base.cellPhaseX, 142700, 5);
    const tributaryMemoryField = ridgeNoise(base.u * 12.6 - base.cellPhaseX, base.v * 9.8 + base.cellPhaseY, 143500, 4);
    const basinWaterField = fbm(base.u * 2.4 + base.cellPhaseX, base.v * 2.0 - base.cellPhaseY, 144300, 5);
    const deltaMemoryField = ridgeNoise(base.u * 8.8 + 0.21, base.v * 7.2 - 0.16, 145100, 4);
    const bayMemoryField = fbm(base.u * 2.0 - 0.33, base.v * 1.7 + 0.28, 145900, 5);
    const inletMemoryField = ridgeNoise(base.u * 7.0 + 0.41, base.v * 5.5 - 0.31, 146700, 4);
    const droughtMemoryField = fbm(base.u * PHI - 0.44, base.v * INV_PHI + 0.37, 147500, 5);
    const floodMemoryField = fbm(base.u * 1.3 + base.cellPhaseY, base.v * 1.1 - base.cellPhaseX, 148300, 5);

    const highlandSource = clamp(mountain * 0.36 + ridge * 0.24 + elevation01 * 0.16 + cold * 0.08 + relief * 0.08, 0, 1);
    const lowlandReceiver = clamp(basin * 0.30 + valley * 0.28 + (1 - elevation01) * 0.18 + moisture * 0.10 + shelf * 0.06, 0, 1);
    const flowPermission = clamp(1 - slope * 0.20 - cliff * 0.26 + valley * 0.24 + basin * 0.18 + hydrologicalMemory * 0.16, 0, 1);
    const waterSupply = clamp(rainfall * 0.26 + moisture * 0.20 + cold * mountain * 0.12 + hydrologicalMemory * 0.18 + waterMemoryField * 0.14 - aridity * 0.14, 0, 1);
    const waterStress = clamp(aridity * 0.32 + droughtMemoryField * 0.22 + transitionPressure * 0.12 + seasonality * 0.14 - restorationMemory * 0.10 - moisture * 0.16, 0, 1);

    return Object.freeze({
      ocean,
      coastal,
      shelf,
      beachEdge,
      elevation01,
      slope,
      relief,
      mountain,
      ridge,
      valley,
      basin,
      cliff,
      coastalRise,
      heat,
      moisture,
      rainfall,
      aridity,
      cold,
      seasonality,
      geologicalMemory,
      hydrologicalMemory,
      climateMemory,
      impactMemory,
      restorationMemory,
      transitionPressure,
      coherentCycleState,
      waterMemoryField,
      ancientSeaField,
      riverMemoryField,
      tributaryMemoryField,
      basinWaterField,
      deltaMemoryField,
      bayMemoryField,
      inletMemoryField,
      droughtMemoryField,
      floodMemoryField,
      highlandSource,
      lowlandReceiver,
      flowPermission,
      waterSupply,
      waterStress
    });
  }

  function computeWaterExpression(physics) {
    const watershedMemory = clamp(
      physics.hydrologicalMemory * 0.26 +
      physics.waterMemoryField * 0.22 +
      physics.highlandSource * 0.18 +
      physics.lowlandReceiver * 0.18 +
      physics.flowPermission * 0.10 +
      physics.geologicalMemory * 0.06,
      0,
      1
    );

    const riverMemory = clamp(
      physics.riverMemoryField * 0.28 +
      physics.tributaryMemoryField * 0.18 +
      physics.valley * 0.22 +
      physics.highlandSource * 0.12 +
      physics.waterSupply * 0.14 -
      physics.waterStress * 0.14,
      0,
      1
    );

    const lakeMemory = clamp(
      physics.basinWaterField * 0.26 +
      physics.basin * 0.24 +
      physics.lowlandReceiver * 0.16 +
      physics.waterSupply * 0.14 +
      physics.ancientSeaField * 0.10 -
      physics.slope * 0.14 -
      physics.waterStress * 0.10,
      0,
      1
    );

    const inlandSeaMemory = clamp(
      lakeMemory * 0.34 +
      physics.ancientSeaField * 0.22 +
      physics.basin * 0.22 +
      physics.geologicalMemory * 0.08 -
      physics.mountain * 0.12 -
      physics.cliff * 0.08,
      0,
      1
    );

    const wetlandMemory = clamp(
      physics.moisture * 0.20 +
      physics.lowlandReceiver * 0.18 +
      physics.basin * 0.18 +
      physics.valley * 0.12 +
      physics.floodMemoryField * 0.16 +
      physics.hydrologicalMemory * 0.12 -
      physics.waterStress * 0.16,
      0,
      1
    );

    const deltaMemory = clamp(
      riverMemory * 0.24 +
      physics.deltaMemoryField * 0.22 +
      physics.coastal ? 0.12 : 0 +
      physics.shelf * 0.10 +
      physics.lowlandReceiver * 0.12 -
      physics.cliff * 0.16 -
      physics.coastalRise * 0.10,
      0,
      1
    );

    const bayMemory = clamp(
      physics.coastal ? 0.20 : 0 +
      physics.bayMemoryField * 0.24 +
      physics.shelf * 0.14 +
      physics.ancientSeaField * 0.12 +
      physics.geologicalMemory * 0.08 -
      physics.cliff * 0.14 -
      physics.mountain * 0.10,
      0,
      1
    );

    const inletMemory = clamp(
      physics.coastal ? 0.16 : 0 +
      physics.inletMemoryField * 0.28 +
      riverMemory * 0.12 +
      physics.valley * 0.14 +
      bayMemory * 0.10 -
      physics.cliff * 0.12,
      0,
      1
    );

    const peninsulaWaterCut = clamp(
      physics.coastal ? 0.14 : 0 +
      bayMemory * 0.20 +
      inletMemory * 0.20 +
      physics.shelf * 0.10 +
      physics.geologicalMemory * 0.08 +
      physics.flowPermission * 0.08 -
      physics.cliff * 0.12,
      0,
      1
    );

    const dryChannelMemory = clamp(
      riverMemory * 0.20 +
      physics.riverMemoryField * 0.16 +
      physics.waterStress * 0.32 +
      physics.droughtMemoryField * 0.20 -
      physics.waterSupply * 0.20,
      0,
      1
    );

    const floodplainMemory = clamp(
      riverMemory * 0.24 +
      wetlandMemory * 0.20 +
      physics.floodMemoryField * 0.22 +
      physics.lowlandReceiver * 0.12 +
      physics.seasonality * 0.10 -
      physics.cliff * 0.10,
      0,
      1
    );

    const waterCycleState = clamp(
      watershedMemory * 0.16 +
      riverMemory * 0.13 +
      lakeMemory * 0.11 +
      inlandSeaMemory * 0.08 +
      wetlandMemory * 0.12 +
      deltaMemory * 0.08 +
      bayMemory * 0.08 +
      inletMemory * 0.08 +
      peninsulaWaterCut * 0.06 +
      floodplainMemory * 0.06 +
      physics.coherentCycleState * 0.04,
      0,
      1
    );

    return Object.freeze({
      watershedMemory: sharpen(watershedMemory, 1.10),
      riverMemory: sharpen(riverMemory, 1.14),
      lakeMemory: sharpen(lakeMemory, 1.12),
      inlandSeaMemory: sharpen(inlandSeaMemory, 1.12),
      wetlandMemory: sharpen(wetlandMemory, 1.14),
      deltaMemory: sharpen(deltaMemory, 1.12),
      bayMemory: sharpen(bayMemory, 1.10),
      inletMemory: sharpen(inletMemory, 1.10),
      peninsulaWaterCut: sharpen(peninsulaWaterCut, 1.08),
      dryChannelMemory: sharpen(dryChannelMemory, 1.14),
      floodplainMemory: sharpen(floodplainMemory, 1.10),
      waterCycleState: sharpen(waterCycleState, 1.10)
    });
  }

  function classifyWaterMemory(physics, water) {
    if (physics.ocean) {
      if (water.bayMemory > 0.64) return ["remembered-bay-water", "coastal-water-memory", "bay-shaped-by-ancient-water"];
      if (water.inletMemory > 0.64) return ["remembered-inlet-water", "coastal-water-memory", "narrow-water-cut-memory"];
      if (physics.shelf > 0.56) return ["remembered-shelf-water", "coastal-shelf-memory", "shallow-water-edge"];
      return ["ocean-memory", "marine-memory", "open-water-cycle"];
    }

    if (water.inlandSeaMemory > 0.70 && water.lakeMemory > 0.58) return ["inland-sea-memory", "interior-water-memory", "ancient-basin-sea"];
    if (water.lakeMemory > 0.66) return ["lake-memory", "interior-water-memory", "remembered-lake-basin"];
    if (water.wetlandMemory > 0.68) return ["wetland-memory", "lowland-water-memory", "saturated-living-basin"];
    if (water.deltaMemory > 0.66) return ["delta-memory", "river-mouth-memory", "deposition-fan"];
    if (water.riverMemory > 0.68) return ["river-memory", "flow-path-memory", "remembered-river-corridor"];
    if (water.dryChannelMemory > 0.70) return ["dry-channel-memory", "absence-of-water-memory", "remembered-riverbed"];
    if (water.peninsulaWaterCut > 0.64) return ["peninsula-water-cut", "coastal-shape-memory", "land-arm-cut-by-water"];
    if (water.floodplainMemory > 0.62) return ["floodplain-memory", "seasonal-water-memory", "overflow-plain"];
    if (water.watershedMemory > 0.58) return ["watershed-memory", "water-routing-memory", "basin-flow-field"];

    return ["background-water-memory", "latent-hydrology", "water-potential-field"];
  }

  function buildNodePacket16(base, physics, water, classification) {
    const values = [
      water.watershedMemory,
      water.riverMemory,
      water.lakeMemory,
      water.inlandSeaMemory,
      water.wetlandMemory,
      water.deltaMemory,
      water.bayMemory,
      water.inletMemory,
      water.peninsulaWaterCut,
      water.dryChannelMemory,
      water.floodplainMemory,
      water.waterCycleState,
      physics.waterSupply,
      physics.waterStress,
      physics.flowPermission,
      physics.lowlandReceiver
    ];

    const roles = [
      "watershed_memory",
      "river_memory",
      "lake_memory",
      "inland_sea_memory",
      "wetland_memory",
      "delta_memory",
      "bay_memory",
      "inlet_memory",
      "peninsula_water_cut",
      "dry_channel_memory",
      "floodplain_memory",
      "water_cycle_state",
      "water_supply",
      "water_stress",
      "flow_permission",
      "lowland_receiver"
    ];

    return Object.freeze(values.map((value, index) => Object.freeze({
      nodeIndex: index + 1,
      node16: index + 1,
      cell16: base.cell16,
      cell256: base.cell256,
      role: roles[index],
      value: clamp(value, 0, 1),
      class: classification.className,
      zone: classification.zone,
      form: classification.form,
      authority: "water-memory",
      contract: CONTRACT,
      receipt: RECEIPT,
      ownership: "water_memory_only"
    })));
  }

  function sampleWaterMemory(map) {
    const base = buildBase(map);
    const context = readContext(base);
    const physics = computeWaterPhysics(base, context);
    const water = computeWaterExpression(physics);
    const [className, zone, form] = classifyWaterMemory(physics, water);
    const classification = Object.freeze({ className, zone, form });
    const nodePacket16 = buildNodePacket16(base, physics, water, classification);

    const currentWaterState256 = Math.max(1, Math.min(256, Math.round(water.waterCycleState * 255) + 1));
    const waterStressState256 = Math.max(1, Math.min(256, Math.round(physics.waterStress * 255) + 1));
    const waterSupplyState256 = Math.max(1, Math.min(256, Math.round(physics.waterSupply * 255) + 1));

    return Object.freeze({
      allowed: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-water-memory-cycle-and-fibonacci-lattice-authority",
      latticeName: "water-memory-fibonacci-lattice",
      mathBinding: "physics_aligned_256_state_water_memory_cycle",
      cell256: base.cell256,
      cell16: base.cell16,
      node16: base.node16,
      cellX: base.cellX,
      cellY: base.cellY,
      u: base.u,
      v: base.v,
      latitude: base.latitude,
      longitude: base.longitude,
      class: className,
      zone,
      form,
      yearsRemainingInCurrentCycle: CURRENT_CYCLE_YEARS_REMAINING,
      currentWaterState256,
      waterStressState256,
      waterSupplyState256,
      watershedMemory: water.watershedMemory,
      riverMemory: water.riverMemory,
      lakeMemory: water.lakeMemory,
      inlandSeaMemory: water.inlandSeaMemory,
      wetlandMemory: water.wetlandMemory,
      deltaMemory: water.deltaMemory,
      bayMemory: water.bayMemory,
      inletMemory: water.inletMemory,
      peninsulaWaterCut: water.peninsulaWaterCut,
      dryChannelMemory: water.dryChannelMemory,
      floodplainMemory: water.floodplainMemory,
      waterCycleState: water.waterCycleState,
      waterSupply: physics.waterSupply,
      waterStress: physics.waterStress,
      flowPermission: physics.flowPermission,
      highlandSource: physics.highlandSource,
      lowlandReceiver: physics.lowlandReceiver,
      hydrologicalMemory: physics.hydrologicalMemory,
      climateMemory: physics.climateMemory,
      geologicalMemory: physics.geologicalMemory,
      impactMemory: physics.impactMemory,
      restorationMemory: physics.restorationMemory,
      transitionPressure: physics.transitionPressure,
      nodePacket16,
      brokerGuidance: {
        shouldInformHydrology: true,
        shouldInformTerrain: true,
        shouldInformElevation: true,
        shouldInformClimate: true,
        shouldInformBeachAuthority: true,
        shouldInformSurface: true,
        shouldInformCanvasInspection: true,
        mayMergeAuthorities: false,
        mustUseZipperLaw: true
      },
      sourceReads: {
        memory: Boolean(context.memory),
        hydrology: Boolean(context.hydrology),
        terrain: Boolean(context.terrain),
        elevation: Boolean(context.elevation),
        climate: Boolean(context.climate),
        beaches: Boolean(context.beaches),
        groundcover: Boolean(context.groundcover)
      },
      ownership: {
        ownsWaterMemory: true,
        ownsTerrain: false,
        ownsLandSeaFootprint: false,
        ownsBeaches: false,
        ownsElevation: false,
        ownsClimate: false,
        ownsGroundcover: false,
        ownsSurfaceColor: false,
        ownsCanvas: false
      },
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function sample(map) {
    return sampleWaterMemory(map);
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-water-memory-authority",
      role: "water_memory_cycle_and_independent_fibonacci_lattice",
      mathBinding: "physics_aligned_256_state_water_memory_cycle",
      currentCycle: {
        yearsRemaining: CURRENT_CYCLE_YEARS_REMAINING,
        waterExpressesCurrentCoherentCycle: true,
        everyWaterExpressionHas256State: true
      },
      exposes: [
        "sampleWaterMemory",
        "sample",
        "getStatus"
      ],
      waterMemoryTypes: [
        "watershed_memory",
        "river_memory",
        "lake_memory",
        "inland_sea_memory",
        "wetland_memory",
        "delta_memory",
        "bay_memory",
        "inlet_memory",
        "peninsula_water_cut",
        "dry_channel_memory",
        "floodplain_memory",
        "water_cycle_state"
      ],
      canonicalLaw: [
        "water_has_its_own_independent_fibonacci_lattice",
        "water_expresses_according_to_physics_history_and_current_coherent_cycle",
        "rivers_remember_paths",
        "basins_remember_water",
        "deltas_remember_deposition",
        "dry_channels_remember_absence",
        "coastlines_remember_pressure",
        "water_packets_zip_with_other_authorities_without_merging"
      ],
      ownsWaterMemory: true,
      ownsTerrain: false,
      ownsLandSeaFootprint: false,
      ownsBeaches: false,
      ownsElevation: false,
      ownsClimate: false,
      ownsGroundcover: false,
      ownsSurfaceColor: false,
      ownsCanvas: false,
      ownsRuntime: false,
      ownsGauges: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.AUDRALIA_WATER_MEMORY = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    sampleWaterMemory,
    sample,
    getStatus
  });

  window.AUDRALIA_WATER_MEMORY_RECEIPT = getStatus();

  document.documentElement.dataset.audraliaWaterMemoryLoaded = "true";
  document.documentElement.dataset.audraliaWaterMemoryContract = CONTRACT;
  document.documentElement.dataset.audraliaWaterMemoryReceipt = RECEIPT;
  document.documentElement.dataset.audraliaWaterMemoryPreviousContract = PREVIOUS_CONTRACT;
  document.documentElement.dataset.audraliaWaterMemoryRole = "water_memory_cycle_and_independent_fibonacci_lattice";
  document.documentElement.dataset.audraliaWaterMemoryMathBinding = "physics_aligned_256_state_water_memory_cycle";
  document.documentElement.dataset.audraliaWaterMemoryYearsRemaining = String(CURRENT_CYCLE_YEARS_REMAINING);
  document.documentElement.dataset.audraliaWaterMemoryIndependentLattice = "true";
  document.documentElement.dataset.audraliaWaterMemoryZipperLaw = "true";
  document.documentElement.dataset.audraliaWaterMemoryWatershed = "true";
  document.documentElement.dataset.audraliaWaterMemoryRiver = "true";
  document.documentElement.dataset.audraliaWaterMemoryLake = "true";
  document.documentElement.dataset.audraliaWaterMemoryInlandSea = "true";
  document.documentElement.dataset.audraliaWaterMemoryWetland = "true";
  document.documentElement.dataset.audraliaWaterMemoryDelta = "true";
  document.documentElement.dataset.audraliaWaterMemoryBay = "true";
  document.documentElement.dataset.audraliaWaterMemoryInlet = "true";
  document.documentElement.dataset.audraliaWaterMemoryPeninsulaWaterCut = "true";
  document.documentElement.dataset.audraliaWaterMemoryDryChannel = "true";
  document.documentElement.dataset.audraliaWaterMemoryFloodplain = "true";
  document.documentElement.dataset.audraliaWaterMemoryOwnsTerrain = "false";
  document.documentElement.dataset.audraliaWaterMemoryOwnsLandSeaFootprint = "false";
  document.documentElement.dataset.audraliaWaterMemoryOwnsBeaches = "false";
  document.documentElement.dataset.audraliaWaterMemoryOwnsElevation = "false";
  document.documentElement.dataset.audraliaWaterMemoryOwnsClimate = "false";
  document.documentElement.dataset.audraliaWaterMemoryOwnsGroundcover = "false";
  document.documentElement.dataset.audraliaWaterMemoryOwnsSurfaceColor = "false";
  document.documentElement.dataset.audraliaWaterMemoryOwnsCanvas = "false";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();

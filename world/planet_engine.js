import worldKernel from "./world_kernel.js";

const PLANET_ENGINE_META = Object.freeze({
  name: "planet_engine",
  version: "G1",
  role: "deterministic_world_derivation_layer",
  deterministic: true,
  sourceOfTruth: false,
  mutatesState: false
});

const PLANET_ENGINE_CONSTANTS = Object.freeze({
  GRID_SIZE: 16,
  TOTAL_NODES: 256,
  REQUIRED_TOTAL_NODES: 256,
  REQUIRED_LOCAL_GATE: 61,
  WHOLE_ENVELOPE: 451,
  REGION_COUNT: 9,
  WATER_ACCUMULATION_THRESHOLD: 2.75,
  LAKE_ACCUMULATION_THRESHOLD: 5.5,
  RIVER_FLOW_THRESHOLD: 3.25,
  ELEVATION_SEA_LEVEL: 0.44,
  ELEVATION_HIGHLAND_LEVEL: 0.68,
  ELEVATION_PEAK_LEVEL: 0.82,
  TEMPERATURE_LAPSE_RATE: 0.35,
  RAINFALL_FLOW_WEIGHT: 0.45,
  RAINFALL_MOISTURE_WEIGHT: 0.55,
  BIOMES: Object.freeze([
    "ocean",
    "lake",
    "river",
    "wetland",
    "desert",
    "grassland",
    "forest",
    "temperate_forest",
    "boreal_forest",
    "tundra",
    "highland",
    "alpine",
    "peak"
  ]),
  REGION_NAMES: Object.freeze([
    "Gratitude",
    "Generosity",
    "Dependability",
    "Accountability",
    "Humility",
    "Forgiveness",
    "Self-Control",
    "Patience",
    "Purity"
  ]),
  CLIMATE_BANDS: Object.freeze([
    "polar",
    "cool",
    "temperate",
    "warm",
    "tropical"
  ])
});

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const key of Object.keys(value)) deepFreeze(value[key]);
  return value;
}

function invariant(condition, message) {
  if (!condition) throw new Error(`[planet_engine] ${message}`);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round(value, places = 6) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function create2D(width, height, fill) {
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, () => fill)
  );
}

function copy2D(matrix) {
  return matrix.map((row) => row.slice());
}

function toKey(i, j) {
  return `${i},${j}`;
}

function fromKey(key) {
  const [i, j] = key.split(",").map(Number);
  return { i, j };
}

function getKernelNodes() {
  const nodes = worldKernel.getNodes();
  invariant(Array.isArray(nodes), "kernel nodes unavailable");
  invariant(nodes.length === PLANET_ENGINE_CONSTANTS.TOTAL_NODES, "kernel node count mismatch");
  return nodes;
}

function buildKernelIndex(nodes) {
  const index = new Map();
  for (const node of nodes) index.set(toKey(node.i, node.j), node);
  return index;
}

function computeElevation(node) {
  const latitudePenalty = Math.abs(node.normalized.cy) * 0.08;
  const diagonalLift =
    node.boundary === "BRIDGE" ? 0.05 :
    node.boundary === "GATE" ? 0.03 :
    node.boundary === "BLOCK" ? 0.07 : 0;
  const holdLift = node.boundary === "HOLD" ? 0.02 : 0;

  const base =
    0.42 * node.forces.B +
    0.18 * node.coherence.C +
    0.14 * ((node.state.E1 + node.state.I2 + node.state.V1) / 3) +
    0.10 * (1 - Math.abs(node.normalized.cx)) +
    0.10 * (1 - Math.abs(node.normalized.cy)) +
    diagonalLift +
    holdLift -
    latitudePenalty;

  return round(clamp(base, 0, 1));
}

function computeSlopeMatrix(elevation, width, height) {
  const slope = create2D(width, height, 0);
  for (let j = 0; j < height; j += 1) {
    for (let i = 0; i < width; i += 1) {
      let maxDrop = 0;
      const current = elevation[j][i];
      const neighbors = getNeighborCoords(i, j, width, height);
      for (const neighbor of neighbors) {
        const drop = current - elevation[neighbor.j][neighbor.i];
        if (drop > maxDrop) maxDrop = drop;
      }
      slope[j][i] = round(clamp(maxDrop, 0, 1));
    }
  }
  return slope;
}

function getNeighborCoords(i, j, width, height) {
  const out = [];
  const deltas = [
    [0, -1], [1, 0], [0, 1], [-1, 0]
  ];
  for (const [dx, dy] of deltas) {
    const ni = i + dx;
    const nj = j + dy;
    if (ni >= 0 && ni < width && nj >= 0 && nj < height) out.push({ i: ni, j: nj });
  }
  return out;
}

function pickDownstream(i, j, elevation, width, height) {
  const current = elevation[j][i];
  const neighbors = getNeighborCoords(i, j, width, height);
  let best = null;
  let bestValue = current;

  for (const neighbor of neighbors) {
    const candidate = elevation[neighbor.j][neighbor.i];
    if (candidate < bestValue) {
      bestValue = candidate;
      best = neighbor;
    }
  }

  return best;
}

function computeFlowAndAccumulation(elevation, precipitationSeed, width, height) {
  const flowTo = create2D(width, height, null);
  const incoming = create2D(width, height, 0);
  const baseWater = create2D(width, height, 0);
  const accumulation = create2D(width, height, 0);
  const sorted = [];

  for (let j = 0; j < height; j += 1) {
    for (let i = 0; i < width; i += 1) {
      const downstream = pickDownstream(i, j, elevation, width, height);
      flowTo[j][i] = downstream ? deepFreeze({ i: downstream.i, j: downstream.j }) : null;
      if (downstream) incoming[downstream.j][downstream.i] += 1;
      baseWater[j][i] = round(1 + precipitationSeed[j][i]);
      sorted.push({ i, j, elevation: elevation[j][i] });
    }
  }

  sorted.sort((a, b) => b.elevation - a.elevation);

  for (const cell of sorted) {
    const own = baseWater[cell.j][cell.i];
    accumulation[cell.j][cell.i] = round(accumulation[cell.j][cell.i] + own);
    const downstream = flowTo[cell.j][cell.i];
    if (downstream) {
      accumulation[downstream.j][downstream.i] = round(
        accumulation[downstream.j][downstream.i] + accumulation[cell.j][cell.i]
      );
    }
  }

  return deepFreeze({
    flowTo,
    incoming,
    baseWater,
    accumulation
  });
}

function computeTemperature(node, elevationValue) {
  const lat = Math.abs(node.normalized.cy);
  const base = (1 - lat) - PLANET_ENGINE_CONSTANTS.TEMPERATURE_LAPSE_RATE * elevationValue;
  return round(clamp(base, 0, 1));
}

function computeMoisture(node, accumulationValue, waterClass) {
  const centerMoisture = 0.22 * node.forces.B;
  const edgeMoisture = 0.14 * (1 - Math.abs(node.normalized.cx));
  const flowMoisture = 0.12 * clamp(accumulationValue / 8, 0, 1);
  const waterBoost =
    waterClass === "ocean" ? 0.45 :
    waterClass === "lake" ? 0.35 :
    waterClass === "river" ? 0.22 : 0;
  const value = centerMoisture + edgeMoisture + flowMoisture + waterBoost;
  return round(clamp(value, 0, 1));
}

function computeRainfall(moisture, accumulationValue) {
  const normalizedFlow = clamp(accumulationValue / 10, 0, 1);
  return round(clamp(
    moisture * PLANET_ENGINE_CONSTANTS.RAINFALL_MOISTURE_WEIGHT +
    normalizedFlow * PLANET_ENGINE_CONSTANTS.RAINFALL_FLOW_WEIGHT,
    0,
    1
  ));
}

function classifyWater(elevationValue, accumulationValue) {
  if (elevationValue <= PLANET_ENGINE_CONSTANTS.ELEVATION_SEA_LEVEL) return "ocean";
  if (accumulationValue >= PLANET_ENGINE_CONSTANTS.LAKE_ACCUMULATION_THRESHOLD) return "lake";
  if (accumulationValue >= PLANET_ENGINE_CONSTANTS.RIVER_FLOW_THRESHOLD) return "river";
  return "land";
}

function classifyClimateBand(temperature) {
  if (temperature < 0.18) return "polar";
  if (temperature < 0.36) return "cool";
  if (temperature < 0.58) return "temperate";
  if (temperature < 0.78) return "warm";
  return "tropical";
}

function classifyBiome({ waterClass, elevation, temperature, rainfall }) {
  if (waterClass === "ocean") return "ocean";
  if (waterClass === "lake") return "lake";
  if (waterClass === "river") return "river";

  if (elevation >= PLANET_ENGINE_CONSTANTS.ELEVATION_PEAK_LEVEL) return "peak";
  if (elevation >= PLANET_ENGINE_CONSTANTS.ELEVATION_HIGHLAND_LEVEL && temperature < 0.28) return "alpine";
  if (elevation >= PLANET_ENGINE_CONSTANTS.ELEVATION_HIGHLAND_LEVEL) return "highland";
  if (temperature < 0.16) return "tundra";
  if (temperature < 0.30 && rainfall >= 0.42) return "boreal_forest";
  if (rainfall < 0.18) return "desert";
  if (rainfall < 0.32) return "grassland";
  if (rainfall >= 0.68 && temperature >= 0.56) return "forest";
  return "temperate_forest";
}

function assignRegion(node) {
  const rowBand = Math.min(2, Math.floor(node.j / 6));
  const colBand = Math.min(2, Math.floor(node.i / 6));
  const regionId = rowBand * 3 + colBand;
  return deepFreeze({
    id: regionId,
    name: PLANET_ENGINE_CONSTANTS.REGION_NAMES[regionId]
  });
}

function buildDerivedCell(node, elevationValue, slopeValue, accumulationValue, flowTarget) {
  const waterClass = classifyWater(elevationValue, accumulationValue);
  const temperature = computeTemperature(node, elevationValue);
  const moisture = computeMoisture(node, accumulationValue, waterClass);
  const rainfall = computeRainfall(moisture, accumulationValue);
  const climateBand = classifyClimateBand(temperature);
  const biome = classifyBiome({
    waterClass,
    elevation: elevationValue,
    temperature,
    rainfall
  });
  const region = assignRegion(node);

  return deepFreeze({
    index: node.index,
    i: node.i,
    j: node.j,
    summit: node.summit,
    region,
    boundary: node.boundary,
    coherence: node.coherence,
    state: node.state,
    forces: node.forces,
    elevation: elevationValue,
    slope: slopeValue,
    hydrology: deepFreeze({
      waterClass,
      flowAccumulation: accumulationValue,
      flowTo: flowTarget ? deepFreeze({ i: flowTarget.i, j: flowTarget.j }) : null,
      isRiver: waterClass === "river",
      isLake: waterClass === "lake",
      isOcean: waterClass === "ocean"
    }),
    climate: deepFreeze({
      temperature,
      moisture,
      rainfall,
      band: climateBand
    }),
    biome,
    normalized: node.normalized,
    projections: node.projections
  });
}

function matrixFromNodes(nodes, selector) {
  const width = PLANET_ENGINE_CONSTANTS.GRID_SIZE;
  const height = PLANET_ENGINE_CONSTANTS.GRID_SIZE;
  const matrix = create2D(width, height, 0);
  for (const node of nodes) matrix[node.j][node.i] = selector(node);
  return matrix;
}

function buildDerivedCells(nodes) {
  const width = PLANET_ENGINE_CONSTANTS.GRID_SIZE;
  const height = PLANET_ENGINE_CONSTANTS.GRID_SIZE;

  const elevation = matrixFromNodes(nodes, computeElevation);
  const slope = computeSlopeMatrix(elevation, width, height);
  const precipitationSeed = matrixFromNodes(nodes, (node) =>
    round(
      0.28 * node.forces.B +
      0.18 * node.coherence.C +
      0.10 * (1 - Math.abs(node.normalized.cy))
    )
  );

  const hydro = computeFlowAndAccumulation(elevation, precipitationSeed, width, height);

  const cells = [];
  for (const node of nodes) {
    cells.push(
      buildDerivedCell(
        node,
        elevation[node.j][node.i],
        slope[node.j][node.i],
        hydro.accumulation[node.j][node.i],
        hydro.flowTo[node.j][node.i]
      )
    );
  }

  invariant(cells.length === PLANET_ENGINE_CONSTANTS.TOTAL_NODES, "derived cell count mismatch");

  return deepFreeze({
    cells,
    matrices: deepFreeze({
      elevation: deepFreeze(copy2D(elevation)),
      slope: deepFreeze(copy2D(slope)),
      precipitationSeed: deepFreeze(copy2D(precipitationSeed)),
      flowAccumulation: deepFreeze(copy2D(hydro.accumulation))
    }),
    hydrology: hydro
  });
}

function summarizeRegions(cells) {
  const buckets = new Map();

  for (const name of PLANET_ENGINE_CONSTANTS.REGION_NAMES) {
    buckets.set(name, {
      name,
      id: PLANET_ENGINE_CONSTANTS.REGION_NAMES.indexOf(name),
      cellCount: 0,
      landCount: 0,
      waterCount: 0,
      averageElevation: 0,
      averageTemperature: 0,
      averageRainfall: 0,
      biomeCounts: {}
    });
  }

  for (const cell of cells) {
    const bucket = buckets.get(cell.region.name);
    bucket.cellCount += 1;
    if (cell.hydrology.waterClass === "land") bucket.landCount += 1;
    else bucket.waterCount += 1;
    bucket.averageElevation += cell.elevation;
    bucket.averageTemperature += cell.climate.temperature;
    bucket.averageRainfall += cell.climate.rainfall;
    bucket.biomeCounts[cell.biome] = (bucket.biomeCounts[cell.biome] || 0) + 1;
  }

  const out = [];
  for (const bucket of buckets.values()) {
    const denom = Math.max(bucket.cellCount, 1);
    out.push(deepFreeze({
      id: bucket.id,
      name: bucket.name,
      cellCount: bucket.cellCount,
      landCount: bucket.landCount,
      waterCount: bucket.waterCount,
      averageElevation: round(bucket.averageElevation / denom),
      averageTemperature: round(bucket.averageTemperature / denom),
      averageRainfall: round(bucket.averageRainfall / denom),
      biomeCounts: deepFreeze(bucket.biomeCounts)
    }));
  }

  return deepFreeze(out.sort((a, b) => a.id - b.id));
}

function summarizeBiomes(cells) {
  const counts = {};
  for (const biome of PLANET_ENGINE_CONSTANTS.BIOMES) counts[biome] = 0;
  for (const cell of cells) {
    if (!(cell.biome in counts)) counts[cell.biome] = 0;
    counts[cell.biome] += 1;
  }
  return deepFreeze(counts);
}

function summarizeClimateBands(cells) {
  const counts = {};
  for (const band of PLANET_ENGINE_CONSTANTS.CLIMATE_BANDS) counts[band] = 0;
  for (const cell of cells) counts[cell.climate.band] += 1;
  return deepFreeze(counts);
}

function buildHydrologySummary(cells) {
  let oceans = 0;
  let lakes = 0;
  let rivers = 0;
  let land = 0;
  let maxAccumulation = 0;

  for (const cell of cells) {
    if (cell.hydrology.waterClass === "ocean") oceans += 1;
    else if (cell.hydrology.waterClass === "lake") lakes += 1;
    else if (cell.hydrology.waterClass === "river") rivers += 1;
    else land += 1;

    if (cell.hydrology.flowAccumulation > maxAccumulation) {
      maxAccumulation = cell.hydrology.flowAccumulation;
    }
  }

  return deepFreeze({
    oceanCells: oceans,
    lakeCells: lakes,
    riverCells: rivers,
    landCells: land,
    maxFlowAccumulation: round(maxAccumulation)
  });
}

function computeChecksum(cells) {
  let acc = 23;
  for (const cell of cells) {
    acc = (
      acc * 37 +
      cell.index * 13 +
      Math.round(cell.elevation * 1000) +
      Math.round(cell.climate.temperature * 1000) +
      Math.round(cell.climate.rainfall * 1000) +
      Math.round(cell.hydrology.flowAccumulation * 1000) +
      cell.biome.charCodeAt(0)
    ) % 1000000007;
  }
  return String(acc);
}

function buildReceipt(nodes, cells) {
  const kernelReceipt = worldKernel.getReceipt();
  const hydrology = buildHydrologySummary(cells);

  return deepFreeze({
    engine: PLANET_ENGINE_META.name,
    version: PLANET_ENGINE_META.version,
    deterministic: true,
    kernelChecksum: kernelReceipt.checksum,
    engineChecksum: computeChecksum(cells),
    totalNodes: nodes.length,
    derivedCells: cells.length,
    requiredTotalNodes: PLANET_ENGINE_CONSTANTS.REQUIRED_TOTAL_NODES,
    requiredLocalGate: PLANET_ENGINE_CONSTANTS.REQUIRED_LOCAL_GATE,
    wholeEnvelope: PLANET_ENGINE_CONSTANTS.WHOLE_ENVELOPE,
    hydrology,
    regions: summarizeRegions(cells),
    biomeCounts: summarizeBiomes(cells),
    climateBands: summarizeClimateBands(cells)
  });
}

function projectWorld(cells, projection) {
  return deepFreeze(
    cells.map((cell) => deepFreeze({
      index: cell.index,
      i: cell.i,
      j: cell.j,
      point: cell.projections[projection],
      biome: cell.biome,
      elevation: cell.elevation,
      waterClass: cell.hydrology.waterClass,
      region: cell.region.name
    }))
  );
}

function buildWorld() {
  const kernelValidation = worldKernel.validate();
  invariant(kernelValidation.latticeCompleteness, "kernel lattice invalid");
  invariant(kernelValidation.thresholdIntegrity, "kernel thresholds invalid");
  invariant(kernelValidation.determinism, "kernel determinism invalid");

  const nodes = getKernelNodes();
  const derived = buildDerivedCells(nodes);
  const cells = derived.cells;
  const receipt = buildReceipt(nodes, cells);

  invariant(receipt.totalNodes === PLANET_ENGINE_CONSTANTS.REQUIRED_TOTAL_NODES, "node total invalid");
  invariant(receipt.derivedCells === PLANET_ENGINE_CONSTANTS.REQUIRED_TOTAL_NODES, "derived total invalid");

  return deepFreeze({
    meta: PLANET_ENGINE_META,
    constants: PLANET_ENGINE_CONSTANTS,
    cells,
    matrices: derived.matrices,
    receipt,
    projections: deepFreeze({
      flat: projectWorld(cells, "flat"),
      tree: projectWorld(cells, "tree"),
      globe: projectWorld(cells, "globe")
    })
  });
}

const WORLD = buildWorld();

const planetEngine = deepFreeze({
  meta: WORLD.meta,
  constants: WORLD.constants,

  getMeta() {
    return WORLD.meta;
  },

  getConstants() {
    return WORLD.constants;
  },

  getCells() {
    return WORLD.cells;
  },

  getCell(i, j) {
    invariant(Number.isInteger(i) && i >= 0 && i < PLANET_ENGINE_CONSTANTS.GRID_SIZE, "invalid i");
    invariant(Number.isInteger(j) && j >= 0 && j < PLANET_ENGINE_CONSTANTS.GRID_SIZE, "invalid j");
    return WORLD.cells[j * PLANET_ENGINE_CONSTANTS.GRID_SIZE + i];
  },

  getCellByIndex(index) {
    invariant(Number.isInteger(index) && index >= 0 && index < PLANET_ENGINE_CONSTANTS.TOTAL_NODES, "invalid index");
    return WORLD.cells[index];
  },

  getProjection(projection) {
    invariant(["flat", "tree", "globe"].includes(projection), `unknown projection: ${projection}`);
    return WORLD.projections[projection];
  },

  getMatrices() {
    return WORLD.matrices;
  },

  getReceipt() {
    return WORLD.receipt;
  },

  summarizeRegions() {
    return WORLD.receipt.regions;
  },

  summarizeBiomes() {
    return WORLD.receipt.biomeCounts;
  },

  summarizeClimateBands() {
    return WORLD.receipt.climateBands;
  },

  validate() {
    const cells = WORLD.cells;
    const receipt = WORLD.receipt;
    const hydrology = buildHydrologySummary(cells);

    return deepFreeze({
      runtimeTraceability: true,
      kernelDependencyIntegrity: worldKernel.getReceipt().checksum === receipt.kernelChecksum,
      totalNodeIntegrity:
        receipt.totalNodes === PLANET_ENGINE_CONSTANTS.REQUIRED_TOTAL_NODES &&
        receipt.derivedCells === PLANET_ENGINE_CONSTANTS.REQUIRED_TOTAL_NODES,
      projectionCompleteness:
        WORLD.projections.flat.length === PLANET_ENGINE_CONSTANTS.REQUIRED_TOTAL_NODES &&
        WORLD.projections.tree.length === PLANET_ENGINE_CONSTANTS.REQUIRED_TOTAL_NODES &&
        WORLD.projections.globe.length === PLANET_ENGINE_CONSTANTS.REQUIRED_TOTAL_NODES,
      determinism: receipt.engineChecksum === computeChecksum(cells),
      hydrologyIntegrity: hydrology.maxFlowAccumulation === receipt.hydrology.maxFlowAccumulation,
      regionIntegrity: receipt.regions.length === PLANET_ENGINE_CONSTANTS.REGION_COUNT,
      climateIntegrity: Object.values(receipt.climateBands).reduce((sum, value) => sum + value, 0) === PLANET_ENGINE_CONSTANTS.REQUIRED_TOTAL_NODES
    });
  }
});

export default planetEngine;

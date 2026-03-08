import { byteToStateVector, validateByte } from "../assets/four_pixel_codec.js";

const DATA_FILES = {
  regions: new URL("./data/regions.json", import.meta.url),
  graphs: new URL("./data/graphs.json", import.meta.url),
  paths: new URL("./data/paths.json", import.meta.url),
  hazards: new URL("./data/hazards.json", import.meta.url),
  waters: new URL("./data/waters.json", import.meta.url),
  environment: new URL("./data/environment.json", import.meta.url),
  diamondGrid: new URL("./data/diamond_grid.json", import.meta.url),
  stateEncodings: new URL("./data/state_encodings.json", import.meta.url),
  latticeMap: new URL("./data/lattice_encoding_map.json", import.meta.url)
};

function indexBy(rows, key) {
  const map = new Map();
  for (const row of rows) {
    if (map.has(row[key])) throw new Error(`Duplicate ${key}: ${row[key]}`);
    map.set(row[key], Object.freeze({ ...row }));
  }
  return map;
}

function freezeObjectTree(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const sub of Object.values(value)) freezeObjectTree(sub);
  }
  return value;
}

async function readJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to load ${url}`);
  return response.json();
}

function assertRoot(root, expectedSchema) {
  if (!root || typeof root !== "object") throw new Error(`Missing root for ${expectedSchema}`);
  if (root.schemaVersion !== expectedSchema) throw new Error(`Schema mismatch for ${expectedSchema}`);
  if (root.worldId !== "nine_summits_island") throw new Error(`worldId mismatch in ${expectedSchema}`);
  return true;
}

function validateEncodingRows(encodingsById) {
  for (const row of encodingsById.values()) {
    if (!row.byte) throw new Error(`Encoding row ${row.encodingId} missing byte`);
    validateByte(row.byte);
  }
}

function assertReferenceExists(map, id, label) {
  if (!map.has(id)) throw new Error(`Missing ${label}: ${id}`);
}

function validateCrossReferences(data) {
  const {
    regionsById,
    pathsById,
    hazardsById,
    watersById,
    encodingsById,
    diamondCellsById,
    graphRows
  } = data;

  for (const region of regionsById.values()) {
    assertReferenceExists(encodingsById, region.stateEncodingId, "stateEncodingId");
    for (const pathId of region.pathAnchors) assertReferenceExists(pathsById, pathId, "pathId");
    for (const hazardId of region.hazardAdjacency) assertReferenceExists(hazardsById, hazardId, "hazardId");
    for (const waterId of region.waterAdjacency) assertReferenceExists(watersById, waterId, "waterId");
    for (const predecessorId of region.requiredPredecessors) assertReferenceExists(regionsById, predecessorId, "requiredPredecessor");
  }

  for (const path of pathsById.values()) {
    assertReferenceExists(regionsById, path.fromRegionId, "fromRegionId");
    assertReferenceExists(regionsById, path.toRegionId, "toRegionId");
    assertReferenceExists(encodingsById, path.stateEncodingId, "path.stateEncodingId");
  }

  for (const hazard of hazardsById.values()) {
    assertReferenceExists(encodingsById, hazard.stateEncodingId, "hazard.stateEncodingId");
    for (const regionId of hazard.affectedRegionIds) assertReferenceExists(regionsById, regionId, "hazard.affectedRegionId");
    for (const pathId of hazard.pathIds) assertReferenceExists(pathsById, pathId, "hazard.pathId");
  }

  for (const water of watersById.values()) {
    assertReferenceExists(encodingsById, water.stateEncodingId, "water.stateEncodingId");
  }

  for (const cell of diamondCellsById.values()) {
    assertReferenceExists(regionsById, cell.regionId, "cell.regionId");
    if (cell.pathId) assertReferenceExists(pathsById, cell.pathId, "cell.pathId");
    assertReferenceExists(encodingsById, cell.stateEncodingId, "cell.stateEncodingId");
    for (const neighborId of cell.neighborIds) assertReferenceExists(diamondCellsById, neighborId, "cell.neighborId");
  }

  for (const graphType of Object.keys(graphRows)) {
    for (const edge of graphRows[graphType]) {
      if (regionsById.has(edge.fromId) === false && hazardsById.has(edge.fromId) === false && watersById.has(edge.fromId) === false) {
        throw new Error(`Graph fromId missing: ${edge.fromId}`);
      }
      if (regionsById.has(edge.toId) === false && hazardsById.has(edge.toId) === false && watersById.has(edge.toId) === false) {
        throw new Error(`Graph toId missing: ${edge.toId}`);
      }
    }
  }
}

function nearestCell(cells, x, y) {
  let best = null;
  let bestDistance = Infinity;
  for (const cell of cells.values()) {
    const dx = cell.centerPoint[0] - x;
    const dy = cell.centerPoint[1] - y;
    const d2 = dx * dx + dy * dy;
    if (d2 < bestDistance) {
      bestDistance = d2;
      best = cell;
    }
  }
  return best;
}

function sectorFromVector(dx, dy) {
  const sectors = ["E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N", "NNE", "NE", "ENE"];
  const angle = Math.atan2(dy, dx);
  const normalized = (angle + Math.PI * 2) % (Math.PI * 2);
  const idx = Math.round(normalized / (Math.PI * 2 / 16)) % 16;
  return sectors[idx];
}

export async function loadWorldKernel() {
  const [
    regions,
    graphs,
    paths,
    hazards,
    waters,
    environment,
    diamondGrid,
    stateEncodings,
    latticeMap
  ] = await Promise.all([
    readJson(DATA_FILES.regions),
    readJson(DATA_FILES.graphs),
    readJson(DATA_FILES.paths),
    readJson(DATA_FILES.hazards),
    readJson(DATA_FILES.waters),
    readJson(DATA_FILES.environment),
    readJson(DATA_FILES.diamondGrid),
    readJson(DATA_FILES.stateEncodings),
    readJson(DATA_FILES.latticeMap)
  ]);

  assertRoot(regions, "WORLD_REGION_DATA_SCHEMA_v1");
  assertRoot(graphs, "WORLD_RELATIONSHIP_GRAPH_v1");
  assertRoot(paths, "WORLD_TRAVERSAL_RULES_v1");
  assertRoot(hazards, "WORLD_HAZARD_DATA_SCHEMA_v1");
  assertRoot(waters, "WORLD_WATER_DATA_SCHEMA_v1");
  assertRoot(environment, "WORLD_ENVIRONMENT_MODEL_v1");
  assertRoot(diamondGrid, "DIAMOND_RUNTIME_NAVIGATION_GRID_KERNEL_v1");
  assertRoot(stateEncodings, "STATE_ENCODINGS_v1");
  assertRoot(latticeMap, "LATTICE_ENCODING_MAP_v1");

  const regionsById = indexBy(regions.regionRows, "regionId");
  const pathsById = indexBy(paths.pathRows, "pathId");
  const hazardsById = indexBy(hazards.hazardRows, "hazardId");
  const watersById = indexBy(waters.waterRows, "waterId");
  const encodingsById = indexBy(stateEncodings.encodingRows, "encodingId");
  const diamondCellsById = indexBy(diamondGrid.diamondCells, "diamondCellId");

  validateEncodingRows(encodingsById);

  const graphRows = freezeObjectTree({
    spatialAdjacencyGraph: graphs.graphRows.spatialAdjacencyGraph.map((edge) => Object.freeze({ ...edge })),
    traversalGraph: graphs.graphRows.traversalGraph.map((edge) => Object.freeze({ ...edge })),
    progressionGraph: graphs.graphRows.progressionGraph.map((edge) => Object.freeze({ ...edge })),
    hazardAdjacencyGraph: graphs.graphRows.hazardAdjacencyGraph.map((edge) => Object.freeze({ ...edge })),
    waterAdjacencyGraph: graphs.graphRows.waterAdjacencyGraph.map((edge) => Object.freeze({ ...edge }))
  });

  const kernel = {
    worldMeta: Object.freeze({
      worldId: regions.worldId,
      encodingFamilyVersion: regions.encodingFamilyVersion
    }),
    regionsById,
    pathsById,
    hazardsById,
    watersById,
    encodingsById,
    latticeEncodingLaw: Object.freeze(latticeMap),
    environmentModel: freezeObjectTree(environment.environmentModel),
    diamondCellsById,
    graphRows,
    helpers: {
      getRegion(regionId) {
        return regionsById.get(regionId) ?? null;
      },
      getPath(pathId) {
        return pathsById.get(pathId) ?? null;
      },
      getHazard(hazardId) {
        return hazardsById.get(hazardId) ?? null;
      },
      getWater(waterId) {
        return watersById.get(waterId) ?? null;
      },
      getCell(cellId) {
        return diamondCellsById.get(cellId) ?? null;
      },
      getNeighbors(cellId) {
        const cell = diamondCellsById.get(cellId);
        if (!cell) return [];
        return cell.neighborIds.map((id) => diamondCellsById.get(id)).filter(Boolean);
      },
      getTraversalEdge(fromId, toId) {
        return graphRows.traversalGraph.find((edge) => edge.fromId === fromId && edge.toId === toId) ?? null;
      },
      getRequiredPredecessors(regionId) {
        return regionsById.get(regionId)?.requiredPredecessors ?? [];
      },
      getEncoding(encodingId) {
        return encodingsById.get(encodingId) ?? null;
      },
      decodeStateByte(byte) {
        validateByte(byte);
        return byteToStateVector(byte);
      },
      projectWorldPositionToCell(input) {
        const { x, y, previousCellId = null } = input;
        const activeCell = nearestCell(diamondCellsById, x, y);
        const previousCell = previousCellId ? diamondCellsById.get(previousCellId) : null;
        const dx = activeCell.centerPoint[0] - x;
        const dy = activeCell.centerPoint[1] - y;
        const encoding = encodingsById.get(activeCell.stateEncodingId);
        return Object.freeze({
          regionId: activeCell.regionId,
          pathId: activeCell.pathId,
          cellId: activeCell.diamondCellId,
          bandIndex: activeCell.bandIndex,
          sector: activeCell.sector || sectorFromVector(dx, dy),
          stateByte: encoding.byte,
          stateEncodingId: activeCell.stateEncodingId,
          previousCellId: previousCell?.diamondCellId ?? null
        });
      },
      assertValidWorld() {
        validateCrossReferences({
          regionsById,
          pathsById,
          hazardsById,
          watersById,
          encodingsById,
          diamondCellsById,
          graphRows
        });
        return true;
      }
    }
  };

  kernel.helpers.assertValidWorld();
  return freezeObjectTree(kernel);
}

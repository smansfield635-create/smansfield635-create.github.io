import { byteToStateVector, validateByte } from "../assets/four_pixel_codec.js";
import { validateLoadedWorldKernel } from "./kernel_boot_validator.js";

const DATA_FILES = {
  regions: new URL("./data/regions.json", import.meta.url),
  graphs: new URL("./data/graphs.json", import.meta.url),
  paths: new URL("./data/paths.json", import.meta.url),
  hazards: new URL("./data/hazards.json", import.meta.url),
  waters: new URL("./data/waters.json", import.meta.url),
  environment: new URL("./data/environment.json", import.meta.url),
  diamondGrid: new URL("./data/diamond_grid.json", import.meta.url),
  stateEncodings: new URL("./data/state_encodings.json", import.meta.url),
  latticeMap: new URL("./data/lattice_encoding_map.json", import.meta.url),
  coastlines: new URL("./data/coastlines.json", import.meta.url),
  coastalBlueprint: new URL("./data/coastal_blueprint.json", import.meta.url),
  regionBoundaries: new URL("./data/region_boundaries.json", import.meta.url),
  terrainPolygons: new URL("./data/terrain_polygons.json", import.meta.url),
  substratePolygons: new URL("./data/substrate_polygons.json", import.meta.url),
  harborNavigationGraph: new URL("./data/harbor_navigation_graph.json", import.meta.url),
  harborInstances: new URL("./data/harbor_instances.json", import.meta.url),
  maritimeNetwork: new URL("./data/maritime_network.json", import.meta.url),
  terrainTemplates: new URL("./templates/terrain_templates.json", import.meta.url),
  substrateTemplates: new URL("./templates/substrate_templates.json", import.meta.url),
  regionTemplates: new URL("./templates/region_templates.json", import.meta.url)
};

const DEV_VALIDATE_ON_BOOT = false;

function indexBy(rows, key) {

  const map = new Map();

  for (const row of rows) {

    const id = row?.[key];

    if (typeof id !== "string" || id.length === 0) {
      throw new Error(`Invalid ${key} in indexed rows`);
    }

    if (map.has(id)) {
      throw new Error(`Duplicate ${key}: ${id}`);
    }

    map.set(id, row);

  }

  return map;

}

async function readJson(url) {

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load ${url}`);
  }

  return response.json();

}

function assertRoot(root, expectedSchema) {

  if (!root || typeof root !== "object") {
    throw new Error(`Missing root for ${expectedSchema}`);
  }

  if (root.schemaVersion !== expectedSchema) {
    throw new Error(`Schema mismatch for ${expectedSchema}`);
  }

  if (root.worldId !== "nine_summits_island") {
    throw new Error(`worldId mismatch in ${expectedSchema}`);
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
    latticeMap,
    coastlines,
    coastalBlueprintRoot,
    regionBoundaries,
    terrainPolygons,
    substratePolygons,
    harborNavigationGraph,
    harborInstances,
    maritimeNetwork,
    terrainTemplates,
    substrateTemplates,
    regionTemplates
  ] = await Promise.all([

    readJson(DATA_FILES.regions),
    readJson(DATA_FILES.graphs),
    readJson(DATA_FILES.paths),
    readJson(DATA_FILES.hazards),
    readJson(DATA_FILES.waters),
    readJson(DATA_FILES.environment),
    readJson(DATA_FILES.diamondGrid),
    readJson(DATA_FILES.stateEncodings),
    readJson(DATA_FILES.latticeMap),
    readJson(DATA_FILES.coastlines),
    readJson(DATA_FILES.coastalBlueprint),
    readJson(DATA_FILES.regionBoundaries),
    readJson(DATA_FILES.terrainPolygons),
    readJson(DATA_FILES.substratePolygons),
    readJson(DATA_FILES.harborNavigationGraph),
    readJson(DATA_FILES.harborInstances),
    readJson(DATA_FILES.maritimeNetwork),
    readJson(DATA_FILES.terrainTemplates),
    readJson(DATA_FILES.substrateTemplates),
    readJson(DATA_FILES.regionTemplates)

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

  const kernel = {

    worldMeta: {
      worldId: regions.worldId,
      encodingFamilyVersion: regions.encodingFamilyVersion
    },

    regionsById,
    pathsById,
    hazardsById,
    watersById,
    encodingsById,
    latticeEncodingLaw: latticeMap,
    environmentModel: environment.environmentModel,
    diamondCellsById,

    helpers: null

  };

  kernel.helpers = {

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

      return cell.neighborIds
        .map(id => diamondCellsById.get(id))
        .filter(Boolean);

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

      const previousCell = previousCellId
        ? diamondCellsById.get(previousCellId)
        : null;

      const encoding = encodingsById.get(activeCell.stateEncodingId);

      return {
        regionId: activeCell.regionId,
        pathId: activeCell.pathId,
        cellId: activeCell.diamondCellId,
        bandIndex: activeCell.bandIndex,
        sector: activeCell.sector,
        stateByte: encoding.byte,
        stateEncodingId: activeCell.stateEncodingId,
        previousCellId: previousCell?.diamondCellId ?? null
      };

    },

    assertValidWorld() {

      return validateLoadedWorldKernel(kernel);

    }

  };

  if (DEV_VALIDATE_ON_BOOT) {
    kernel.helpers.assertValidWorld();
  }

  return kernel;

}

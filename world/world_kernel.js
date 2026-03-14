import { byteToStateVector, validateByte } from "../assets/four_pixel_codec.js";

const DATA_FILES = {
  regions: new URL("./data/regions.json", import.meta.url),
  paths: new URL("./data/paths.json", import.meta.url),
  hazards: new URL("./data/hazards.json", import.meta.url),
  waters: new URL("./data/waters.json", import.meta.url),
  diamondGrid: new URL("./data/diamond_grid.json", import.meta.url),
  stateEncodings: new URL("./data/state_encodings.json", import.meta.url),

  terrainPolygons: new URL("./data/terrain_polygons.json", import.meta.url),
  substratePolygons: new URL("./data/substrate_polygons.json", import.meta.url),
  regionBoundaries: new URL("./data/region_boundaries.json", import.meta.url),
  coastlines: new URL("./data/coastlines.json", import.meta.url),
  coastalBlueprint: new URL("./data/coastal_blueprint.json", import.meta.url),
  harborNavigationGraph: new URL("./data/harbor_navigation_graph.json", import.meta.url),
  harborInstances: new URL("./data/harbor_instances.json", import.meta.url),
  maritimeNetwork: new URL("./data/maritime_network.json", import.meta.url)
};

function freeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
  }
  return value;
}

async function readJsonSafe(url, label) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn("Kernel data missing:", label);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.warn("Kernel load failed:", label, error);
    return null;
  }
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function pickArray(source, keys) {
  if (!source || typeof source !== "object") return [];
  for (const key of keys) {
    if (Array.isArray(source[key])) return source[key];
  }
  return [];
}

function pickObject(source, keys) {
  if (!source || typeof source !== "object") return {};
  for (const key of keys) {
    const value = source[key];
    if (value && typeof value === "object" && !Array.isArray(value)) return value;
  }
  return {};
}

function indexBy(rows, candidateKeys) {
  const keyList = Array.isArray(candidateKeys) ? candidateKeys : [candidateKeys];
  const map = new Map();

  for (const row of asArray(rows)) {
    if (!row || typeof row !== "object") continue;

    let id = null;
    for (const key of keyList) {
      if (typeof row[key] === "string" && row[key].length > 0) {
        id = row[key];
        break;
      }
    }

    if (!id) continue;
    map.set(id, freeze({ ...row }));
  }

  return map;
}

function nearestCell(cells, x, y) {
  let best = null;
  let bestD = Infinity;

  for (const cell of cells.values()) {
    const point = Array.isArray(cell.centerPoint) ? cell.centerPoint : null;
    if (!point || point.length < 2) continue;

    const dx = point[0] - x;
    const dy = point[1] - y;
    const d = (dx * dx) + (dy * dy);

    if (d < bestD) {
      bestD = d;
      best = cell;
    }
  }

  return best;
}

function buildHarborGraph(dataset) {
  const navigationNodes = pickArray(dataset, ["navigationNodes", "nodeRows", "nodes"]);
  const navigationEdges = pickArray(dataset, ["navigationEdges", "edgeRows", "edges"]);
  const graphMeta = pickObject(dataset, ["graphMeta", "meta"]);

  return freeze({
    graphMeta: freeze({ ...graphMeta }),
    navigationNodesById: indexBy(navigationNodes, ["navNodeId", "nodeId", "id"]),
    navigationEdgesById: indexBy(navigationEdges, ["edgeId", "navEdgeId", "id"])
  });
}

function buildMaritimeNetwork(dataset) {
  const seaNodes = pickArray(dataset, ["seaNodes", "nodeRows", "nodes"]);
  const seaRoutes = pickArray(dataset, ["seaRoutes", "routeRows", "routes"]);
  const seaHazards = pickArray(dataset, ["seaHazards", "hazardRows", "hazards"]);
  const networkMeta = pickObject(dataset, ["networkMeta", "meta"]);

  return freeze({
    networkMeta: freeze({ ...networkMeta }),
    seaNodesById: indexBy(seaNodes, ["seaNodeId", "nodeId", "id"]),
    seaRoutesById: indexBy(seaRoutes, ["seaRouteId", "routeId", "id"]),
    seaHazardsById: indexBy(seaHazards, ["seaHazardId", "hazardId", "id"])
  });
}

function buildCoastlineModel(dataset) {
  if (!dataset || typeof dataset !== "object") {
    return freeze({
      harborChannel: [],
      harborBasin: [],
      coastlineOuter: []
    });
  }

  return freeze({
    ...dataset,
    harborChannel: asArray(dataset.harborChannel),
    harborBasin: asArray(dataset.harborBasin),
    coastlineOuter: asArray(dataset.coastlineOuter)
  });
}

function buildHarborInstances(dataset) {
  const rows = pickArray(dataset, ["harborInstances", "instances", "rows"]);
  return indexBy(rows, ["harborInstanceId", "id"]);
}

export async function loadWorldKernel() {
  const [
    regions,
    paths,
    hazards,
    waters,
    diamondGrid,
    stateEncodings,
    terrainPolygons,
    substratePolygons,
    regionBoundaries,
    coastlines,
    coastalBlueprint,
    harborNavigationGraph,
    harborInstances,
    maritimeNetwork
  ] = await Promise.all([
    readJsonSafe(DATA_FILES.regions, "regions"),
    readJsonSafe(DATA_FILES.paths, "paths"),
    readJsonSafe(DATA_FILES.hazards, "hazards"),
    readJsonSafe(DATA_FILES.waters, "waters"),
    readJsonSafe(DATA_FILES.diamondGrid, "diamondGrid"),
    readJsonSafe(DATA_FILES.stateEncodings, "stateEncodings"),
    readJsonSafe(DATA_FILES.terrainPolygons, "terrainPolygons"),
    readJsonSafe(DATA_FILES.substratePolygons, "substratePolygons"),
    readJsonSafe(DATA_FILES.regionBoundaries, "regionBoundaries"),
    readJsonSafe(DATA_FILES.coastlines, "coastlines"),
    readJsonSafe(DATA_FILES.coastalBlueprint, "coastalBlueprint"),
    readJsonSafe(DATA_FILES.harborNavigationGraph, "harborNavigationGraph"),
    readJsonSafe(DATA_FILES.harborInstances, "harborInstances"),
    readJsonSafe(DATA_FILES.maritimeNetwork, "maritimeNetwork")
  ]);

  if (!regions) {
    throw new Error("Critical kernel file missing: regions");
  }

  const regionsById = indexBy(pickArray(regions, ["regionRows", "regions"]), ["regionId", "id"]);
  const pathsById = indexBy(pickArray(paths, ["pathRows", "paths"]), ["pathId", "id"]);
  const hazardsById = indexBy(pickArray(hazards, ["hazardRows", "hazards"]), ["hazardId", "id"]);
  const watersById = indexBy(pickArray(waters, ["waterRows", "waters"]), ["waterId", "id"]);
  const encodingsById = indexBy(pickArray(stateEncodings, ["encodingRows", "encodings"]), ["encodingId", "id"]);
  const diamondCellsById = indexBy(pickArray(diamondGrid, ["diamondCells", "cells"]), ["diamondCellId", "cellId", "id"]);

  const terrainPolygonsById = indexBy(pickArray(terrainPolygons, ["terrain", "terrainRows", "rows"]), ["terrainId", "id"]);
  const substratePolygonsById = indexBy(pickArray(substratePolygons, ["substrates", "substrateRows", "rows"]), ["substrateId", "id"]);
  const regionBoundariesById = indexBy(pickArray(regionBoundaries, ["regions", "boundaryRows", "rows"]), ["regionId", "boundaryId", "id"]);

  const harborNavigation = buildHarborGraph(harborNavigationGraph);
  const maritime = buildMaritimeNetwork(maritimeNetwork);
  const coastlineModel = buildCoastlineModel(coastlines);
  const harborInstancesById = buildHarborInstances(harborInstances);

  const kernel = {
    worldMeta: freeze({
      worldId: regions.worldId ?? "unknown_world",
      encodingFamilyVersion: regions.encodingFamilyVersion ?? "unknown_encoding_family"
    }),

    regionsById,
    pathsById,
    hazardsById,
    watersById,
    encodingsById,
    diamondCellsById,

    terrainPolygonsById,
    substratePolygonsById,
    regionBoundariesById,

    coastlineModel,
    coastalBlueprint: freeze({ ...(coastalBlueprint ?? {}) }),
    harborNavigationGraph: harborNavigation,
    harborInstancesById,
    maritimeNetwork: maritime,

    helpers: null
  };

  kernel.helpers = {
    getRegion(id) {
      return regionsById.get(id) ?? null;
    },

    getEncoding(id) {
      return encodingsById.get(id) ?? null;
    },

    getHarborInstances() {
      return [...harborInstancesById.values()];
    },

    getHarborInstance(harborInstanceId) {
      return harborInstancesById.get(harborInstanceId) ?? null;
    },

    getHarborInstanceByRegion(regionId) {
      for (const instance of harborInstancesById.values()) {
        if (instance.marketLinkRegionId === regionId) return instance;
        if (instance.parentRegionId === regionId) return instance;

        const transfers = asArray(instance.transferRules?.dockTransfers);
        for (const transfer of transfers) {
          if (transfer.landRegionId === regionId) return instance;
        }
      }
      return null;
    },

    getHarborDockTransfers(harborInstanceId) {
      const instance = harborInstancesById.get(harborInstanceId);
      return asArray(instance?.transferRules?.dockTransfers);
    },

    getHarborNavNode(navNodeId) {
      return harborNavigation.navigationNodesById.get(navNodeId) ?? null;
    },

    getHarborNavNeighbors(navNodeId) {
      const out = [];
      for (const edge of harborNavigation.navigationEdgesById.values()) {
        const fromId = edge.fromNavNodeId ?? edge.fromNodeId ?? null;
        const toId = edge.toNavNodeId ?? edge.toNodeId ?? null;

        if (fromId === navNodeId && toId) {
          const node = harborNavigation.navigationNodesById.get(toId);
          if (node) out.push(node);
        }

        if (toId === navNodeId && fromId) {
          const node = harborNavigation.navigationNodesById.get(fromId);
          if (node) out.push(node);
        }
      }
      return out;
    },

    projectWorldPositionToCell({ x, y, previousCellId = null }) {
      const cell = nearestCell(diamondCellsById, x, y);

      if (!cell) {
        return freeze({
          regionId: null,
          pathId: null,
          cellId: previousCellId,
          bandIndex: null,
          sector: null,
          stateByte: 0,
          stateEncodingId: null,
          previousCellId
        });
      }

      const encoding = encodingsById.get(cell.stateEncodingId) ?? null;

      return freeze({
        regionId: cell.regionId ?? null,
        pathId: cell.pathId ?? null,
        cellId: cell.diamondCellId ?? null,
        bandIndex: cell.bandIndex ?? null,
        sector: cell.sector ?? null,
        stateByte: encoding?.byte ?? 0,
        stateEncodingId: cell.stateEncodingId ?? null,
        previousCellId
      });
    },

    decodeStateByte(byte) {
      validateByte(byte);
      return byteToStateVector(byte);
    }
  };

  freeze(kernel.helpers);
  freeze(kernel);

  return kernel;
}

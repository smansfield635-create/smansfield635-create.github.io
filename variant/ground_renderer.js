import { byteToStateVector, validateByte } from "../assets/four_pixel_codec.js";
import { validateLoadedWorldKernel } from "./kernel_boot_validator.js";

const DEV_VALIDATE_ON_BOOT = false;

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

function shallowFreeze(v) {
  if (v && typeof v === "object" && !Object.isFrozen(v)) {
    Object.freeze(v);
  }
  return v;
}

async function readJsonSafe(url, label) {
  try {
    const r = await fetch(url);
    if (!r.ok) {
      console.warn("Kernel data missing:", label);
      return null;
    }
    return await r.json();
  } catch (e) {
    console.warn("Kernel load failed:", label, e);
    return null;
  }
}

function indexBy(rows, key) {
  if (!rows) return new Map();

  const map = new Map();

  for (const row of rows) {
    const id = row?.[key];
    if (typeof id !== "string" || id.length === 0) continue;
    map.set(id, shallowFreeze({ ...row }));
  }

  return shallowFreeze(map);
}

function nearestCell(cells, x, y) {
  let best = null;
  let bestD = Infinity;

  for (const c of cells.values()) {
    const dx = c.centerPoint[0] - x;
    const dy = c.centerPoint[1] - y;
    const d = dx * dx + dy * dy;

    if (d < bestD) {
      bestD = d;
      best = c;
    }
  }

  return best;
}

function deepFreezeMapsObject(obj) {
  for (const key of Object.keys(obj)) {
    shallowFreeze(obj[key]);
  }
  return shallowFreeze(obj);
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
    coastalBlueprint,
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
    readJsonSafe(DATA_FILES.regions, "regions"),
    readJsonSafe(DATA_FILES.graphs, "graphs"),
    readJsonSafe(DATA_FILES.paths, "paths"),
    readJsonSafe(DATA_FILES.hazards, "hazards"),
    readJsonSafe(DATA_FILES.waters, "waters"),
    readJsonSafe(DATA_FILES.environment, "environment"),
    readJsonSafe(DATA_FILES.diamondGrid, "diamondGrid"),
    readJsonSafe(DATA_FILES.stateEncodings, "stateEncodings"),
    readJsonSafe(DATA_FILES.latticeMap, "latticeMap"),
    readJsonSafe(DATA_FILES.coastlines, "coastlines"),
    readJsonSafe(DATA_FILES.coastalBlueprint, "coastalBlueprint"),
    readJsonSafe(DATA_FILES.regionBoundaries, "regionBoundaries"),
    readJsonSafe(DATA_FILES.terrainPolygons, "terrainPolygons"),
    readJsonSafe(DATA_FILES.substratePolygons, "substratePolygons"),
    readJsonSafe(DATA_FILES.harborNavigationGraph, "harborNavigationGraph"),
    readJsonSafe(DATA_FILES.harborInstances, "harborInstances"),
    readJsonSafe(DATA_FILES.maritimeNetwork, "maritimeNetwork"),
    readJsonSafe(DATA_FILES.terrainTemplates, "terrainTemplates"),
    readJsonSafe(DATA_FILES.substrateTemplates, "substrateTemplates"),
    readJsonSafe(DATA_FILES.regionTemplates, "regionTemplates")
  ]);

  if (!regions) throw new Error("Critical kernel file missing: regions");

  const regionsById = indexBy(regions.regionRows, "regionId");
  const pathsById = indexBy(paths?.pathRows, "pathId");
  const hazardsById = indexBy(hazards?.hazardRows, "hazardId");
  const watersById = indexBy(waters?.waterRows, "waterId");
  const encodingsById = indexBy(stateEncodings?.encodingRows, "encodingId");
  const diamondCellsById = indexBy(diamondGrid?.diamondCells, "diamondCellId");

  const regionBoundariesById = indexBy(regionBoundaries?.regions, "regionId");
  const terrainPolygonsById = indexBy(terrainPolygons?.terrain, "terrainId");
  const substratePolygonsById = indexBy(substratePolygons?.substrates, "substrateId");

  const harborNavigationNodesById = indexBy(
    harborNavigationGraph?.navigationNodes,
    "navNodeId"
  );

  const harborNavigationEdgesById = indexBy(
    harborNavigationGraph?.navigationEdges,
    "edgeId"
  );

  const harborInstancesById = indexBy(
    harborInstances?.instances,
    "harborInstanceId"
  );

  const maritimeHarborInstancesById = indexBy(
    maritimeNetwork?.harborInstances,
    "harborInstanceId"
  );

  const seaNodesById = indexBy(
    maritimeNetwork?.seaNodes,
    "seaNodeId"
  );

  const seaRoutesById = indexBy(
    maritimeNetwork?.seaRoutes,
    "seaRouteId"
  );

  const seaHazardsById = indexBy(
    maritimeNetwork?.seaHazards,
    "seaHazardId"
  );

  const terrainTemplatesById = indexBy(
    terrainTemplates?.templates,
    "templateId"
  );

  const substrateTemplatesById = indexBy(
    substrateTemplates?.templates,
    "templateId"
  );

  const regionTemplatesById = indexBy(
    regionTemplates?.templates,
    "templateId"
  );

  const kernel = {
    worldMeta: shallowFreeze({
      worldId: regions.worldId,
      encodingFamilyVersion: regions.encodingFamilyVersion
    }),

    regionsById,
    pathsById,
    hazardsById,
    watersById,
    encodingsById,
    diamondCellsById,

    graphRows: shallowFreeze(graphs?.graphRows ?? {}),
    environmentModel: shallowFreeze(environment?.environmentModel ?? {}),
    latticeEncodingLaw: shallowFreeze(latticeMap ?? {}),

    coastlineModel: shallowFreeze({
      version: coastlines?.version ?? 0,
      coastlineOuter: coastlines?.coastlineOuter ?? [],
      harborPeninsula: coastlines?.harborPeninsula ?? [],
      harborBasin: coastlines?.harborBasin ?? [],
      harborChannel: coastlines?.harborChannel ?? [],
      coastalSegmentMap: coastlines?.coastalSegmentMap ?? {},
      reefZones: coastlines?.reefZones ?? [],
      exposureZones: coastlines?.exposureZones ?? [],
      firmnessZones: coastlines?.firmnessZones ?? []
    }),

    coastalBlueprint: shallowFreeze(coastalBlueprint ?? {}),

    regionBoundariesById,
    terrainPolygonsById,
    substratePolygonsById,

    harborNavigationGraph: deepFreezeMapsObject({
      graphMeta: shallowFreeze(harborNavigationGraph?.graphMeta ?? {}),
      navigationNodesById: harborNavigationNodesById,
      navigationEdgesById: harborNavigationEdgesById
    }),

    harborInstancesById,

    maritimeNetwork: deepFreezeMapsObject({
      version: maritimeNetwork?.version ?? 0,
      networkMeta: shallowFreeze(maritimeNetwork?.networkMeta ?? {}),
      maritimeHarborInstancesById,
      seaNodesById,
      seaRoutesById,
      seaHazardsById
    }),

    templateRegistry: deepFreezeMapsObject({
      terrainTemplatesById,
      substrateTemplatesById,
      regionTemplatesById
    }),

    helpers: null
  };

  kernel.helpers = {

    getRegion(id) {
      return regionsById.get(id) ?? null;
    },

    getPath(id) {
      return pathsById.get(id) ?? null;
    },

    getHazard(id) {
      return hazardsById.get(id) ?? null;
    },

    getWater(id) {
      return watersById.get(id) ?? null;
    },

    getEncoding(id) {
      return encodingsById.get(id) ?? null;
    },

    getRegionBoundary(regionId) {
      return regionBoundariesById.get(regionId) ?? null;
    },

    getTerrainPolygon(terrainId) {
      return terrainPolygonsById.get(terrainId) ?? null;
    },

    getSubstratePolygon(substrateId) {
      return substratePolygonsById.get(substrateId) ?? null;
    },

    getTerrainTemplate(templateId) {
      return terrainTemplatesById.get(templateId) ?? null;
    },

    getSubstrateTemplate(templateId) {
      return substrateTemplatesById.get(templateId) ?? null;
    },

    getRegionTemplate(templateId) {
      return regionTemplatesById.get(templateId) ?? null;
    },

    getHarborInstances() {
      return [...harborInstancesById.values()];
    },

    getHarborInstance(id) {
      return harborInstancesById.get(id) ?? null;
    },

    getHarborInstanceByRegion(regionId) {
      for (const instance of harborInstancesById.values()) {
        if (instance.parentRegionId === regionId) return instance;
        if (instance.marketLinkRegionId === regionId) return instance;

        const transfers = instance.transferRules?.dockTransfers ?? [];
        for (const transfer of transfers) {
          if (transfer.landRegionId === regionId) return instance;
        }
      }
      return null;
    },

    getHarborDockTransfers(harborInstanceId) {
      const instance = harborInstancesById.get(harborInstanceId);
      return instance?.transferRules?.dockTransfers ?? [];
    },

    getHarborNavNode(navNodeId) {
      return harborNavigationNodesById.get(navNodeId) ?? null;
    },

    getHarborNavEdge(edgeId) {
      return harborNavigationEdgesById.get(edgeId) ?? null;
    },

    getHarborNavNeighbors(navNodeId) {
      const neighbors = [];

      for (const edge of harborNavigationEdgesById.values()) {
        const fromNodeId = edge.fromNodeId ?? edge.fromNavNodeId ?? null;
        const toNodeId = edge.toNodeId ?? edge.toNavNodeId ?? null;

        if (fromNodeId === navNodeId && toNodeId) {
          neighbors.push(harborNavigationNodesById.get(toNodeId));
        }
        if (toNodeId === navNodeId && fromNodeId) {
          neighbors.push(harborNavigationNodesById.get(fromNodeId));
        }
      }

      return neighbors.filter(Boolean);
    },

    getMaritimeHarborInstance(harborInstanceId) {
      return maritimeHarborInstancesById.get(harborInstanceId) ?? null;
    },

    getSeaNode(seaNodeId) {
      return seaNodesById.get(seaNodeId) ?? null;
    },

    getSeaRoute(seaRouteId) {
      return seaRoutesById.get(seaRouteId) ?? null;
    },

    getSeaHazard(seaHazardId) {
      return seaHazardsById.get(seaHazardId) ?? null;
    },

    projectWorldPositionToCell({ x, y, previousCellId = null }) {
      const cell = nearestCell(diamondCellsById, x, y);

      if (!cell) {
        return shallowFreeze({
          regionId: null,
          pathId: null,
          cellId: null,
          bandIndex: 0,
          sector: null,
          stateByte: 0,
          stateEncodingId: null,
          previousCellId
        });
      }

      const enc = encodingsById.get(cell.stateEncodingId);

      return shallowFreeze({
        regionId: cell.regionId ?? null,
        pathId: cell.pathId ?? null,
        cellId: cell.diamondCellId ?? null,
        bandIndex: cell.bandIndex ?? 0,
        sector: cell.sector ?? null,
        stateByte: enc?.byte ?? 0,
        stateEncodingId: cell.stateEncodingId ?? null,
        previousCellId
      });
    },

    decodeStateByte(byte) {
      validateByte(byte);
      return byteToStateVector(byte);
    },

    assertValidWorld() {
      return validateLoadedWorldKernel(kernel);
    }
  };

  shallowFreeze(kernel.helpers);
  shallowFreeze(kernel);

  if (DEV_VALIDATE_ON_BOOT) {
    kernel.helpers.assertValidWorld();
  }

  return kernel;
}

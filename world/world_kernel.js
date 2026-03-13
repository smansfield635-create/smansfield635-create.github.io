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

    map.set(id, Object.freeze({ ...row }));
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
    const d2 = (dx * dx) + (dy * dy);

    if (d2 < bestDistance) {
      bestDistance = d2;
      best = cell;
    }
  }

  return best;
}

function makeEmptyMap() {
  return new Map();
}

function makeEmptyObject() {
  return Object.freeze({});
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
  assertRoot(coastlines, "HARBOR_COASTLINE_DATASET_v1");
  assertRoot(regionBoundaries, "HARBOR_REGION_BOUNDARIES_DATASET_v1");
  assertRoot(terrainPolygons, "HARBOR_TERRAIN_POLYGONS_DATASET_v1");
  assertRoot(substratePolygons, "HARBOR_SUBSTRATE_POLYGONS_DATASET_v1");
  assertRoot(harborNavigationGraph, "HARBOR_NAVIGATION_GRAPH_v1");
  assertRoot(harborInstances, "HARBOR_INSTANCE_LIBRARY_v1");
  assertRoot(maritimeNetwork, "WORLD_MARITIME_NETWORK_v1");
  assertRoot(terrainTemplates, "TERRAIN_TEMPLATE_LIBRARY_v1");
  assertRoot(substrateTemplates, "SUBSTRATE_TEMPLATE_LIBRARY_v1");
  assertRoot(regionTemplates, "REGION_TEMPLATE_LIBRARY_v1");
  assertRoot(coastalBlueprintRoot, "COASTAL_BLUEPRINT_v2");

  const regionsById = indexBy(regions.regionRows, "regionId");
  const pathsById = indexBy(paths.pathRows, "pathId");
  const hazardsById = indexBy(hazards.hazardRows, "hazardId");
  const watersById = indexBy(waters.waterRows, "waterId");
  const encodingsById = indexBy(stateEncodings.encodingRows, "encodingId");
  const diamondCellsById = indexBy(diamondGrid.diamondCells, "diamondCellId");

  for (const row of encodingsById.values()) {
    if (!row.byte) {
      throw new Error(`Encoding row ${row.encodingId} missing byte`);
    }
    validateByte(row.byte);
  }

  const graphRows = Object.freeze({
    spatialAdjacencyGraph: Object.freeze([...(graphs.graphRows?.spatialAdjacencyGraph ?? [])]),
    traversalGraph: Object.freeze([...(graphs.graphRows?.traversalGraph ?? [])]),
    progressionGraph: Object.freeze([...(graphs.graphRows?.progressionGraph ?? [])]),
    hazardAdjacencyGraph: Object.freeze([...(graphs.graphRows?.hazardAdjacencyGraph ?? [])]),
    waterAdjacencyGraph: Object.freeze([...(graphs.graphRows?.waterAdjacencyGraph ?? [])])
  });

  const regionBoundariesById = Array.isArray(regionBoundaries.regions)
    ? indexBy(regionBoundaries.regions, "regionId")
    : makeEmptyMap();

  const terrainPolygonsById = Array.isArray(terrainPolygons.terrain)
    ? indexBy(terrainPolygons.terrain, "terrainId")
    : makeEmptyMap();

  const substratePolygonsById = Array.isArray(substratePolygons.substrates)
    ? indexBy(substratePolygons.substrates, "substrateId")
    : makeEmptyMap();

  const terrainTemplatesById = Array.isArray(terrainTemplates.templates)
    ? indexBy(terrainTemplates.templates, "templateId")
    : makeEmptyMap();

  const substrateTemplatesById = Array.isArray(substrateTemplates.templates)
    ? indexBy(substrateTemplates.templates, "templateId")
    : makeEmptyMap();

  const regionTemplatesById = Array.isArray(regionTemplates.templates)
    ? indexBy(regionTemplates.templates, "templateId")
    : makeEmptyMap();

  const harborNavigationNodesById = Array.isArray(harborNavigationGraph.navigationNodes)
    ? indexBy(harborNavigationGraph.navigationNodes, "navNodeId")
    : makeEmptyMap();

  const harborNavigationEdgesById = Array.isArray(harborNavigationGraph.navigationEdges)
    ? indexBy(harborNavigationGraph.navigationEdges, "edgeId")
    : makeEmptyMap();

  const harborInstancesById = Array.isArray(harborInstances.instances)
    ? indexBy(harborInstances.instances, "harborInstanceId")
    : makeEmptyMap();

  const maritimeHarborInstancesById = Array.isArray(maritimeNetwork.harborInstances)
    ? indexBy(maritimeNetwork.harborInstances, "harborInstanceId")
    : makeEmptyMap();

  const seaNodesById = Array.isArray(maritimeNetwork.seaNodes)
    ? indexBy(maritimeNetwork.seaNodes, "seaNodeId")
    : makeEmptyMap();

  const seaRoutesById = Array.isArray(maritimeNetwork.seaRoutes)
    ? indexBy(maritimeNetwork.seaRoutes, "seaRouteId")
    : makeEmptyMap();

  const seaHazardsById = Array.isArray(maritimeNetwork.seaHazards)
    ? indexBy(maritimeNetwork.seaHazards, "seaHazardId")
    : makeEmptyMap();

  const coastalDomainsById = Array.isArray(coastalBlueprintRoot.coastalDomains)
    ? indexBy(coastalBlueprintRoot.coastalDomains, "domainId")
    : makeEmptyMap();

  const coastalRegionIds = new Set();
  for (const domain of coastalDomainsById.values()) {
    if (typeof domain.regionId === "string" && domain.regionId.length > 0) {
      coastalRegionIds.add(domain.regionId);
    }
  }

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
    diamondCellsById,

    graphRows,

    latticeEncodingLaw: Object.freeze(latticeMap),
    environmentModel: Object.freeze(environment.environmentModel ?? {}),

    coastlineModel: Object.freeze({
      version: coastlines.version,
      coastlineOuter: coastlines.coastlineOuter ?? [],
      harborPeninsula: coastlines.harborPeninsula ?? [],
      harborBasin: coastlines.harborBasin ?? [],
      harborChannel: coastlines.harborChannel ?? [],
      coastalSegmentMap: coastlines.coastalSegmentMap ?? {},
      reefZones: coastlines.reefZones ?? [],
      exposureZones: coastlines.exposureZones ?? [],
      firmnessZones: coastlines.firmnessZones ?? []
    }),

    coastalBlueprint: Object.freeze({
      version: coastalBlueprintRoot.version,
      scope: coastalBlueprintRoot.scope ?? "harbor_baseline",
      authority: coastalBlueprintRoot.authority ?? "COASTAL_BLUEPRINT_V2_HARBOR_BASELINE",
      notes: coastalBlueprintRoot.notes ?? "",
      materialStacks: Object.freeze(coastalBlueprintRoot.materialStacks ?? {}),
      coastalClasses: Object.freeze(coastalBlueprintRoot.coastalClasses ?? {}),
      coastalDomainsById
    }),

    regionBoundariesById,

    terrainDatasetMeta: Object.freeze({
      version: terrainPolygons.version,
      sourceVersion: terrainPolygons.version
    }),

    substrateDatasetMeta: Object.freeze({
      version: substratePolygons.version,
      sourceVersion: substratePolygons.version
    }),

    terrainPolygonsById,
    substratePolygonsById,

    legacyTerrainPolygonsById: terrainPolygonsById,
    legacySubstratePolygonsById: substratePolygonsById,

    generatedTerrainPolygonsById: makeEmptyMap(),
    generatedSubstratePolygonsById: makeEmptyMap(),

    coastalGeneration: Object.freeze({
      receipts: Object.freeze({
        fallbackMode: "legacy_boot_fast_path",
        activeTerrainBandCount: 0,
        activeSubstrateBandCount: 0,
        pendingTerrainReceipts: [],
        pendingSubstrateReceipts: [],
        preservedManualTerrainRowCount: terrainPolygonsById.size,
        preservedManualSubstrateRowCount: substratePolygonsById.size,
        generationReceipts: []
      }),
      coastalRegionIds
    }),

    templateRegistry: Object.freeze({
      terrainTemplatesById,
      substrateTemplatesById,
      regionTemplatesById
    }),

    harborNavigationGraph: Object.freeze({
      graphMeta: Object.freeze(harborNavigationGraph.graphMeta ?? {}),
      navigationNodesById: harborNavigationNodesById,
      navigationEdgesById: harborNavigationEdgesById
    }),

    harborInstancesById,

    maritimeNetwork: Object.freeze({
      version: maritimeNetwork.version,
      networkMeta: Object.freeze(maritimeNetwork.networkMeta ?? {}),
      maritimeHarborInstancesById,
      seaNodesById,
      seaRoutesById,
      seaHazardsById
    }),

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

    getRegionBoundary(regionId) {
      return regionBoundariesById.get(regionId) ?? null;
    },

    getTerrainPolygon(terrainId) {
      return terrainPolygonsById.get(terrainId) ?? null;
    },

    getSubstratePolygon(substrateId) {
      return substratePolygonsById.get(substrateId) ?? null;
    },

    getLegacyTerrainPolygon(terrainId) {
      return terrainPolygonsById.get(terrainId) ?? null;
    },

    getLegacySubstratePolygon(substrateId) {
      return substratePolygonsById.get(substrateId) ?? null;
    },

    getGeneratedTerrainPolygon(_terrainId) {
      return null;
    },

    getGeneratedSubstratePolygon(_substrateId) {
      return null;
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

    getGeneratedTerrainForRegion(_regionId) {
      return [];
    },

    getGeneratedSubstrateForRegion(_regionId) {
      return [];
    },

    getActiveTerrainForRegion(regionId) {
      return [...terrainPolygonsById.values()].filter((row) => row.regionId === regionId);
    },

    getActiveSubstrateForRegion(regionId) {
      return [...substratePolygonsById.values()].filter((row) => row.regionId === regionId);
    },

    getCoastalDomain(domainId) {
      return coastalDomainsById.get(domainId) ?? null;
    },

    getCoastalStack(stackId) {
      return kernel.coastalBlueprint.materialStacks[stackId] ?? null;
    },

    getCoastalClass(classId) {
      return kernel.coastalBlueprint.coastalClasses[classId] ?? null;
    },

    getCoastalDomains() {
      return [...coastalDomainsById.values()];
    },

    getCoastalDomainsByRegion(regionId) {
      return [...coastalDomainsById.values()].filter((domain) => domain.regionId === regionId);
    },

    getPlantableCoastalDomains() {
      return [...coastalDomainsById.values()].filter((domain) => domain.plantable === true);
    },

    getCoastalClassesByFamily(family) {
      if (family !== "terrain" && family !== "substrate") return [];
      return Object.values(kernel.coastalBlueprint.coastalClasses).filter((coastalClass) => coastalClass.family === family);
    },

    getCoastalGenerationReceipts() {
      return kernel.coastalGeneration.receipts;
    },

    getCoastalRegionIds() {
      return [...kernel.coastalGeneration.coastalRegionIds];
    },

    isCoastalRegion(regionId) {
      return kernel.coastalGeneration.coastalRegionIds.has(regionId);
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
        if (edge.fromNodeId === navNodeId) neighbors.push(harborNavigationNodesById.get(edge.toNodeId));
        if (edge.toNodeId === navNodeId) neighbors.push(harborNavigationNodesById.get(edge.fromNodeId));
      }

      return neighbors.filter(Boolean);
    },

    getHarborInstance(harborInstanceId) {
      return harborInstancesById.get(harborInstanceId) ?? null;
    },

    getHarborInstanceByRegion(regionId) {
      for (const instance of harborInstancesById.values()) {
        if (instance.parentRegionId === regionId) return instance;
      }
      return null;
    },

    getHarborInstances() {
      return [...harborInstancesById.values()];
    },

    getHarborDockTransfers(harborInstanceId) {
      const instance = harborInstancesById.get(harborInstanceId);
      return instance?.transferRules?.dockTransfers ?? [];
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

    getMaritimeNode(nodeId) {
      return seaNodesById.get(nodeId) ?? harborNavigationNodesById.get(nodeId) ?? null;
    },

    getMaritimeNeighbors(nodeId) {
      const neighbors = [];

      for (const edge of seaRoutesById.values()) {
        if (edge.fromNodeId === nodeId) neighbors.push(this.getMaritimeNode(edge.toNodeId));
        if (edge.toNodeId === nodeId) neighbors.push(this.getMaritimeNode(edge.fromNodeId));
      }

      for (const edge of harborNavigationEdgesById.values()) {
        if (edge.fromNodeId === nodeId) neighbors.push(this.getMaritimeNode(edge.toNodeId));
        if (edge.toNodeId === nodeId) neighbors.push(this.getMaritimeNode(edge.fromNodeId));
      }

      return neighbors.filter(Boolean);
    },

    getSeaRoutesForNode(nodeId) {
      return [...seaRoutesById.values()].filter(
        (route) => route.fromNodeId === nodeId || route.toNodeId === nodeId
      );
    },

    decodeStateByte(byte) {
      validateByte(byte);
      return byteToStateVector(byte);
    },

    projectWorldPositionToCell(input) {
      const { x, y, previousCellId = null } = input;
      const activeCell = nearestCell(diamondCellsById, x, y);

      if (!activeCell) {
        return null;
      }

      const previousCell = previousCellId ? diamondCellsById.get(previousCellId) : null;
      const encoding = encodingsById.get(activeCell.stateEncodingId);

      if (!encoding) {
        throw new Error(`Missing encoding for stateEncodingId ${activeCell.stateEncodingId}`);
      }

      if (typeof activeCell.sector !== "string" || activeCell.sector.length === 0) {
        throw new Error(`Missing sealed sector for cell ${activeCell.diamondCellId}`);
      }

      return Object.freeze({
        regionId: activeCell.regionId,
        pathId: activeCell.pathId,
        cellId: activeCell.diamondCellId,
        bandIndex: activeCell.bandIndex,
        sector: activeCell.sector,
        stateByte: encoding.byte,
        stateEncodingId: activeCell.stateEncodingId,
        previousCellId: previousCell?.diamondCellId ?? null
      });
    },

    assertValidWorld() {
      return validateLoadedWorldKernel(kernel);
    }
  };

  Object.freeze(kernel.helpers);
  Object.freeze(kernel);

  if (DEV_VALIDATE_ON_BOOT) {
    kernel.helpers.assertValidWorld();
  }

  return kernel;
}

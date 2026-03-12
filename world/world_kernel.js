import { byteToStateVector, validateByte } from "../assets/four_pixel_codec.js";
import { terrainSubstrateRebuildTool } from "./terrain_substrate_rebuild_tool.js";

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

function freezeObjectTree(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const sub of Object.values(value)) {
      freezeObjectTree(sub);
    }
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

function assertPolygon(points, label) {
  if (!Array.isArray(points) || points.length < 3) {
    throw new Error(`Invalid polygon for ${label}`);
  }

  for (const point of points) {
    if (!Array.isArray(point) || point.length !== 2) {
      throw new Error(`Invalid point in ${label}`);
    }
    if (!Number.isFinite(point[0]) || !Number.isFinite(point[1])) {
      throw new Error(`Non-numeric point in ${label}`);
    }
  }
}

function assertPointList(points, label, minLength = 1) {
  if (!Array.isArray(points) || points.length < minLength) {
    throw new Error(`Invalid point list for ${label}`);
  }

  for (const point of points) {
    if (!Array.isArray(point) || point.length !== 2) {
      throw new Error(`Invalid point in ${label}`);
    }
    if (!Number.isFinite(point[0]) || !Number.isFinite(point[1])) {
      throw new Error(`Non-numeric point in ${label}`);
    }
  }
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

function validateHarborPolygonDatasets(coastlines, regionBoundariesById, terrainPolygonsById, substratePolygonsById) {
  assertPolygon(coastlines.coastlineOuter, "coastlineOuter");
  assertPolygon(coastlines.harborPeninsula, "harborPeninsula");
  assertPolygon(coastlines.harborBasin, "harborBasin");
  assertPolygon(coastlines.harborChannel, "harborChannel");

  const requiredBoundaryIds = [
    "harbor_peninsula",
    "harbor_basin",
    "harbor_channel",
    "harbor_approach_reef_band",
    "harbor_inner_shore_west",
    "harbor_inner_shore_east"
  ];

  for (const regionId of requiredBoundaryIds) {
    const row = regionBoundariesById.get(regionId);
    if (!row) throw new Error(`Missing harbor region boundary: ${regionId}`);
    assertPolygon(row.polygon, `region_boundaries.${regionId}`);
  }

  for (const row of terrainPolygonsById.values()) {
    assertReferenceExists(regionBoundariesById, row.regionId, "terrain.regionId");
    assertPolygon(row.polygon, `terrain.${row.terrainId}`);
  }

  for (const row of substratePolygonsById.values()) {
    assertReferenceExists(regionBoundariesById, row.regionId, "substrate.regionId");
    assertPolygon(row.polygon, `substrate.${row.substrateId}`);
  }
}

function validateTemplateLibrary(root, expectedSchema, containerKey) {
  assertRoot(root, expectedSchema);
  if (!Array.isArray(root[containerKey])) {
    throw new Error(`Missing ${containerKey} in ${expectedSchema}`);
  }
}

function validateRegionTemplates(regionTemplatesById) {
  const requiredTemplateIds = [
    "harbor_template",
    "market_template",
    "basin_template",
    "ridge_template",
    "canyon_template",
    "summit_template"
  ];

  for (const templateId of requiredTemplateIds) {
    const row = regionTemplatesById.get(templateId);
    if (!row) throw new Error(`Missing region template: ${templateId}`);
    if (typeof row.templateClass !== "string" || row.templateClass.length === 0) {
      throw new Error(`Invalid templateClass for ${templateId}`);
    }
    if (typeof row.defaultTerrain !== "string" || row.defaultTerrain.length === 0) {
      throw new Error(`Invalid defaultTerrain for ${templateId}`);
    }
    if (typeof row.defaultSubstrate !== "string" || row.defaultSubstrate.length === 0) {
      throw new Error(`Invalid defaultSubstrate for ${templateId}`);
    }
  }
}

function validateTerrainTemplateLibrary(terrainTemplatesById) {
  for (const row of terrainTemplatesById.values()) {
    if (typeof row.templateId !== "string" || row.templateId.length === 0) {
      throw new Error("Invalid terrain templateId");
    }
    if (!Array.isArray(row.terrain) || row.terrain.length === 0) {
      throw new Error(`Missing terrain array for ${row.templateId}`);
    }
    for (const item of row.terrain) {
      if (typeof item.terrainClass !== "string" || item.terrainClass.length === 0) {
        throw new Error(`Invalid terrainClass in ${row.templateId}`);
      }
      if (typeof item.shape !== "string" || item.shape.length === 0) {
        throw new Error(`Invalid terrain shape in ${row.templateId}`);
      }
    }
  }
}

function validateSubstrateTemplateLibrary(substrateTemplatesById) {
  for (const row of substrateTemplatesById.values()) {
    if (typeof row.templateId !== "string" || row.templateId.length === 0) {
      throw new Error("Invalid substrate templateId");
    }
    if (!Array.isArray(row.substrates) || row.substrates.length === 0) {
      throw new Error(`Missing substrates array for ${row.templateId}`);
    }
    for (const item of row.substrates) {
      if (typeof item.substrateClass !== "string" || item.substrateClass.length === 0) {
        throw new Error(`Invalid substrateClass in ${row.templateId}`);
      }
      if (typeof item.shape !== "string" || item.shape.length === 0) {
        throw new Error(`Invalid substrate shape in ${row.templateId}`);
      }
    }
  }
}

function validateTemplateCrossReferences(regionTemplatesById, terrainTemplatesById, substrateTemplatesById) {
  for (const regionTemplate of regionTemplatesById.values()) {
    assertReferenceExists(terrainTemplatesById, regionTemplate.defaultTerrain, "regionTemplate.defaultTerrain");
    assertReferenceExists(substrateTemplatesById, regionTemplate.defaultSubstrate, "regionTemplate.defaultSubstrate");
  }
}

function validateRegionTemplateBindings(regionsById, regionTemplatesById) {
  for (const region of regionsById.values()) {
    if (!region.templateId) continue;
    assertReferenceExists(regionTemplatesById, region.templateId, "region.templateId");
  }
}

function validateHarborNavigationGraph(harborNavigationGraph, encodingsById) {
  assertRoot(harborNavigationGraph, "HARBOR_NAVIGATION_GRAPH_v1");

  if (!harborNavigationGraph.graphMeta || typeof harborNavigationGraph.graphMeta !== "object") {
    throw new Error("Missing graphMeta in HARBOR_NAVIGATION_GRAPH_v1");
  }

  if (!Array.isArray(harborNavigationGraph.navigationNodes)) {
    throw new Error("Missing navigationNodes in HARBOR_NAVIGATION_GRAPH_v1");
  }

  if (!Array.isArray(harborNavigationGraph.navigationEdges)) {
    throw new Error("Missing navigationEdges in HARBOR_NAVIGATION_GRAPH_v1");
  }

  const navigationNodesById = indexBy(harborNavigationGraph.navigationNodes, "navNodeId");
  const navigationEdgesById = indexBy(harborNavigationGraph.navigationEdges, "edgeId");

  const entryNodeId = harborNavigationGraph.graphMeta.entryNodeId;
  const exitNodeId = harborNavigationGraph.graphMeta.exitNodeId;

  assertReferenceExists(navigationNodesById, entryNodeId, "harborNavigation.entryNodeId");
  assertReferenceExists(navigationNodesById, exitNodeId, "harborNavigation.exitNodeId");

  for (const node of navigationNodesById.values()) {
    if (typeof node.displayName !== "string" || node.displayName.length === 0) {
      throw new Error(`Invalid displayName for harbor navigation node: ${node.navNodeId}`);
    }
    if (typeof node.nodeClass !== "string" || node.nodeClass.length === 0) {
      throw new Error(`Invalid nodeClass for harbor navigation node: ${node.navNodeId}`);
    }
    assertPointList([node.centerPoint], `harborNavigation.node.${node.navNodeId}.centerPoint`, 1);
    if (!Array.isArray(node.allowedModes) || node.allowedModes.length === 0) {
      throw new Error(`Invalid allowedModes for harbor navigation node: ${node.navNodeId}`);
    }
    assertReferenceExists(encodingsById, node.stateEncodingId, "harborNavigation.node.stateEncodingId");
  }

  for (const edge of navigationEdgesById.values()) {
    assertReferenceExists(navigationNodesById, edge.fromNodeId, "harborNavigation.edge.fromNodeId");
    assertReferenceExists(navigationNodesById, edge.toNodeId, "harborNavigation.edge.toNodeId");
    if (typeof edge.edgeClass !== "string" || edge.edgeClass.length === 0) {
      throw new Error(`Invalid edgeClass for harbor navigation edge: ${edge.edgeId}`);
    }
    assertPointList(edge.centerline, `harborNavigation.edge.${edge.edgeId}.centerline`, 2);
    if (!Number.isFinite(edge.nominalWidth) || edge.nominalWidth <= 0) {
      throw new Error(`Invalid nominalWidth for harbor navigation edge: ${edge.edgeId}`);
    }
    assertReferenceExists(encodingsById, edge.stateEncodingId, "harborNavigation.edge.stateEncodingId");
  }

  return {
    navigationNodesById,
    navigationEdgesById
  };
}

function validateHarborInstances(harborInstancesRoot, regionsById, watersById, harborNavigationGraph, coastlineModel) {
  assertRoot(harborInstancesRoot, "HARBOR_INSTANCE_LIBRARY_v1");

  if (!Array.isArray(harborInstancesRoot.bindingOrder) || harborInstancesRoot.bindingOrder.length === 0) {
    throw new Error("Missing bindingOrder in HARBOR_INSTANCE_LIBRARY_v1");
  }

  if (!Array.isArray(harborInstancesRoot.killConditions) || harborInstancesRoot.killConditions.length === 0) {
    throw new Error("Missing killConditions in HARBOR_INSTANCE_LIBRARY_v1");
  }

  if (!Array.isArray(harborInstancesRoot.instances) || harborInstancesRoot.instances.length === 0) {
    throw new Error("Missing instances in HARBOR_INSTANCE_LIBRARY_v1");
  }

  const harborInstancesById = indexBy(harborInstancesRoot.instances, "harborInstanceId");

  const validCoastlineDatasetIds = new Set(["coastline_primary_harbor"]);
  const validNavigationGraphIds = new Set(["harbor_navigation_primary"]);
  const validDockIds = new Set(
    harborNavigationGraph.navigationNodes
      .filter((node) => node.nodeClass === "mooring" || node.nodeClass === "transfer")
      .map((node) => node.navNodeId)
  );

  if (!coastlineModel.harborPeninsula || !coastlineModel.harborBasin || !coastlineModel.harborChannel) {
    throw new Error("Coastline model incomplete for harbor instances");
  }

  for (const instance of harborInstancesById.values()) {
    if (typeof instance.harborId !== "string" || instance.harborId.length === 0) {
      throw new Error(`Invalid harborId for ${instance.harborInstanceId}`);
    }

    assertReferenceExists(regionsById, instance.parentRegionId, "harborInstance.parentRegionId");
    assertReferenceExists(watersById, instance.waterBodyId, "harborInstance.waterBodyId");
    assertReferenceExists(regionsById, instance.marketLinkRegionId, "harborInstance.marketLinkRegionId");

    if (!validCoastlineDatasetIds.has(instance.coastlineDatasetId)) {
      throw new Error(`Invalid harborInstance.coastlineDatasetId: ${instance.coastlineDatasetId}`);
    }

    if (typeof instance.dockSetId !== "string" || instance.dockSetId.length === 0) {
      throw new Error(`Invalid harborInstance.dockSetId for ${instance.harborInstanceId}`);
    }

    if (!validNavigationGraphIds.has(instance.navigationGraphId)) {
      throw new Error(`Invalid harborInstance.navigationGraphId: ${instance.navigationGraphId}`);
    }

    if (!instance.transferRules || typeof instance.transferRules !== "object") {
      throw new Error(`Missing transferRules for ${instance.harborInstanceId}`);
    }

    if (!Array.isArray(instance.transferRules.dockTransfers) || instance.transferRules.dockTransfers.length === 0) {
      throw new Error(`Missing dockTransfers for ${instance.harborInstanceId}`);
    }

    for (const transfer of instance.transferRules.dockTransfers) {
      if (!validDockIds.has(transfer.dockId)) {
        throw new Error(`Invalid dock transfer dockId: ${transfer.dockId}`);
      }
      assertReferenceExists(regionsById, transfer.landRegionId, "harborInstance.transfer.landRegionId");
      if (typeof transfer.modeIn !== "string" || transfer.modeIn.length === 0) {
        throw new Error(`Invalid modeIn for dock transfer ${transfer.dockId}`);
      }
      if (typeof transfer.modeOut !== "string" || transfer.modeOut.length === 0) {
        throw new Error(`Invalid modeOut for dock transfer ${transfer.dockId}`);
      }
      if (typeof transfer.transferClass !== "string" || transfer.transferClass.length === 0) {
        throw new Error(`Invalid transferClass for dock transfer ${transfer.dockId}`);
      }
    }

    if (typeof instance.operatingMode !== "string" || instance.operatingMode.length === 0) {
      throw new Error(`Invalid operatingMode for ${instance.harborInstanceId}`);
    }

    if (!instance.receipts || typeof instance.receipts !== "object") {
      throw new Error(`Missing receipts for ${instance.harborInstanceId}`);
    }

    const requiredReceiptKeys = [
      "coastlineReceipt",
      "waterReceipt",
      "dockReceipt",
      "navigationReceipt",
      "marketLinkReceipt"
    ];

    for (const receiptKey of requiredReceiptKeys) {
      if (typeof instance.receipts[receiptKey] !== "string" || instance.receipts[receiptKey].length === 0) {
        throw new Error(`Missing ${receiptKey} for ${instance.harborInstanceId}`);
      }
    }
  }

  return harborInstancesById;
}

function validateMaritimeNetwork(maritimeNetworkRoot, encodingsById, regionsById, harborNavigationNodesById) {
  assertRoot(maritimeNetworkRoot, "WORLD_MARITIME_NETWORK_v1");

  if (!maritimeNetworkRoot.networkMeta || typeof maritimeNetworkRoot.networkMeta !== "object") {
    throw new Error("Missing networkMeta in WORLD_MARITIME_NETWORK_v1");
  }

  if (!Array.isArray(maritimeNetworkRoot.harborInstances) || maritimeNetworkRoot.harborInstances.length === 0) {
    throw new Error("Missing harborInstances in WORLD_MARITIME_NETWORK_v1");
  }

  if (!Array.isArray(maritimeNetworkRoot.seaNodes) || maritimeNetworkRoot.seaNodes.length === 0) {
    throw new Error("Missing seaNodes in WORLD_MARITIME_NETWORK_v1");
  }

  if (!Array.isArray(maritimeNetworkRoot.seaRoutes) || maritimeNetworkRoot.seaRoutes.length === 0) {
    throw new Error("Missing seaRoutes in WORLD_MARITIME_NETWORK_v1");
  }

  if (!Array.isArray(maritimeNetworkRoot.seaHazards)) {
    throw new Error("Missing seaHazards in WORLD_MARITIME_NETWORK_v1");
  }

  const maritimeHarborInstancesById = indexBy(maritimeNetworkRoot.harborInstances, "harborInstanceId");
  const seaNodesById = indexBy(maritimeNetworkRoot.seaNodes, "seaNodeId");
  const seaRoutesById = indexBy(maritimeNetworkRoot.seaRoutes, "seaRouteId");
  const seaHazardsById = indexBy(maritimeNetworkRoot.seaHazards, "seaHazardId");

  assertReferenceExists(
    maritimeHarborInstancesById,
    maritimeNetworkRoot.networkMeta.entryHarborInstanceId,
    "maritime.networkMeta.entryHarborInstanceId"
  );

  const validMaritimeNodeIds = new Set([
    ...seaNodesById.keys(),
    ...harborNavigationNodesById.keys()
  ]);

  for (const instance of maritimeHarborInstancesById.values()) {
    if (typeof instance.displayName !== "string" || instance.displayName.length === 0) {
      throw new Error(`Invalid displayName for maritime harbor instance: ${instance.harborInstanceId}`);
    }
    if (typeof instance.harborGraphId !== "string" || instance.harborGraphId.length === 0) {
      throw new Error(`Invalid harborGraphId for maritime harbor instance: ${instance.harborInstanceId}`);
    }
    assertReferenceExists(regionsById, instance.primaryRegionId, "maritime.harborInstance.primaryRegionId");
    assertReferenceExists(regionsById, instance.marketLinkRegionId, "maritime.harborInstance.marketLinkRegionId");

    if (!instance.transferRules || typeof instance.transferRules !== "object") {
      throw new Error(`Missing transferRules for maritime harbor instance: ${instance.harborInstanceId}`);
    }
    if (!Array.isArray(instance.transferRules.dockTransfers) || instance.transferRules.dockTransfers.length === 0) {
      throw new Error(`Missing dockTransfers for maritime harbor instance: ${instance.harborInstanceId}`);
    }

    for (const transfer of instance.transferRules.dockTransfers) {
      assertReferenceExists(harborNavigationNodesById, transfer.dockId, "maritime.harborInstance.transfer.dockId");
      assertReferenceExists(regionsById, transfer.landRegionId, "maritime.harborInstance.transfer.landRegionId");

      if (typeof transfer.modeIn !== "string" || transfer.modeIn.length === 0) {
        throw new Error(`Invalid modeIn for maritime dock transfer: ${transfer.transferId ?? transfer.dockId}`);
      }
      if (typeof transfer.modeOut !== "string" || transfer.modeOut.length === 0) {
        throw new Error(`Invalid modeOut for maritime dock transfer: ${transfer.transferId ?? transfer.dockId}`);
      }
      if (typeof transfer.transferClass !== "string" || transfer.transferClass.length === 0) {
        throw new Error(`Invalid transferClass for maritime dock transfer: ${transfer.transferId ?? transfer.dockId}`);
      }
    }
  }

  for (const node of seaNodesById.values()) {
    if (typeof node.displayName !== "string" || node.displayName.length === 0) {
      throw new Error(`Invalid displayName for sea node: ${node.seaNodeId}`);
    }
    if (typeof node.nodeClass !== "string" || node.nodeClass.length === 0) {
      throw new Error(`Invalid nodeClass for sea node: ${node.seaNodeId}`);
    }
    assertPointList([node.centerPoint], `maritime.seaNode.${node.seaNodeId}.centerPoint`, 1);
    if (!Array.isArray(node.allowedModes) || node.allowedModes.length === 0) {
      throw new Error(`Invalid allowedModes for sea node: ${node.seaNodeId}`);
    }
    assertReferenceExists(encodingsById, node.stateEncodingId, "maritime.seaNode.stateEncodingId");
  }

  for (const route of seaRoutesById.values()) {
    if (!validMaritimeNodeIds.has(route.fromNodeId)) {
      throw new Error(`Invalid maritime route fromNodeId: ${route.fromNodeId}`);
    }
    if (!validMaritimeNodeIds.has(route.toNodeId)) {
      throw new Error(`Invalid maritime route toNodeId: ${route.toNodeId}`);
    }
    if (typeof route.routeClass !== "string" || route.routeClass.length === 0) {
      throw new Error(`Invalid routeClass for maritime route: ${route.seaRouteId}`);
    }
    assertPointList(route.centerline, `maritime.seaRoute.${route.seaRouteId}.centerline`, 2);
    if (!Number.isFinite(route.nominalWidth) || route.nominalWidth <= 0) {
      throw new Error(`Invalid nominalWidth for maritime route: ${route.seaRouteId}`);
    }
    assertReferenceExists(encodingsById, route.stateEncodingId, "maritime.seaRoute.stateEncodingId");
  }

  for (const hazard of seaHazardsById.values()) {
    if (typeof hazard.displayName !== "string" || hazard.displayName.length === 0) {
      throw new Error(`Invalid displayName for sea hazard: ${hazard.seaHazardId}`);
    }
    if (typeof hazard.hazardClass !== "string" || hazard.hazardClass.length === 0) {
      throw new Error(`Invalid hazardClass for sea hazard: ${hazard.seaHazardId}`);
    }
    assertPolygon(hazard.polygon, `maritime.seaHazard.${hazard.seaHazardId}.polygon`);
    if (!Number.isFinite(hazard.severity) || hazard.severity < 0) {
      throw new Error(`Invalid severity for sea hazard: ${hazard.seaHazardId}`);
    }
    assertReferenceExists(encodingsById, hazard.stateEncodingId, "maritime.seaHazard.stateEncodingId");
  }

  return {
    maritimeHarborInstancesById,
    seaNodesById,
    seaRoutesById,
    seaHazardsById
  };
}

function validateCoastalBlueprintRoot(coastalBlueprintRoot) {
  assertRoot(coastalBlueprintRoot, "COASTAL_BLUEPRINT_v2");

  if (!Array.isArray(coastalBlueprintRoot.coastalDomains) || coastalBlueprintRoot.coastalDomains.length === 0) {
    throw new Error("Missing coastalDomains in COASTAL_BLUEPRINT_v2");
  }

  if (!coastalBlueprintRoot.materialStacks || typeof coastalBlueprintRoot.materialStacks !== "object") {
    throw new Error("Missing materialStacks in COASTAL_BLUEPRINT_v2");
  }

  if (!coastalBlueprintRoot.coastalClasses || typeof coastalBlueprintRoot.coastalClasses !== "object") {
    throw new Error("Missing coastalClasses in COASTAL_BLUEPRINT_v2");
  }
}

function normalizeCoastalBlueprint(coastalBlueprintRoot, regionsById, regionBoundariesById) {
  validateCoastalBlueprintRoot(coastalBlueprintRoot);

  const coastalDomainsById = indexBy(coastalBlueprintRoot.coastalDomains, "domainId");

  const materialStacks = {};
  for (const [stackId, stackRows] of Object.entries(coastalBlueprintRoot.materialStacks)) {
    if (typeof stackId !== "string" || stackId.length === 0) {
      throw new Error("Invalid coastal blueprint stack key");
    }
    if (!Array.isArray(stackRows) || stackRows.length === 0) {
      throw new Error(`Invalid coastal blueprint stack: ${stackId}`);
    }
    materialStacks[stackId] = Object.freeze([...stackRows]);
  }

  const coastalClasses = {};
  for (const [classId, classRow] of Object.entries(coastalBlueprintRoot.coastalClasses)) {
    if (typeof classId !== "string" || classId.length === 0) {
      throw new Error("Invalid coastal blueprint class key");
    }
    if (!classRow || typeof classRow !== "object") {
      throw new Error(`Invalid coastal blueprint class row: ${classId}`);
    }

    if (typeof classRow.targetClass !== "string" || classRow.targetClass.length === 0) {
      throw new Error(`Invalid targetClass for coastal class: ${classId}`);
    }
    if (classRow.family !== "terrain" && classRow.family !== "substrate") {
      throw new Error(`Invalid family for coastal class: ${classId}`);
    }
    if (typeof classRow.plantable !== "boolean") {
      throw new Error(`Invalid plantable flag for coastal class: ${classId}`);
    }
    if (typeof classRow.status !== "string" || classRow.status.length === 0) {
      throw new Error(`Invalid status for coastal class: ${classId}`);
    }

    coastalClasses[classId] = Object.freeze({ classId, ...classRow });
  }

  for (const [stackId, stackRows] of Object.entries(materialStacks)) {
    for (const classToken of stackRows) {
      if (typeof classToken !== "string" || classToken.length === 0) {
        throw new Error(`Invalid class token in coastal stack: ${stackId}`);
      }
      if (!coastalClasses[classToken]) {
        throw new Error(`Missing coastal class ${classToken} referenced by stack ${stackId}`);
      }
    }
  }

  for (const domain of coastalDomainsById.values()) {
    if (typeof domain.geometrySource !== "string" || domain.geometrySource.length === 0) {
      throw new Error(`Invalid geometrySource for coastal domain: ${domain.domainId}`);
    }
    if (typeof domain.coastType !== "string" || domain.coastType.length === 0) {
      throw new Error(`Invalid coastType for coastal domain: ${domain.domainId}`);
    }
    if (typeof domain.exposureClass !== "string" || domain.exposureClass.length === 0) {
      throw new Error(`Invalid exposureClass for coastal domain: ${domain.domainId}`);
    }
    if (typeof domain.sedimentType !== "string" || domain.sedimentType.length === 0) {
      throw new Error(`Invalid sedimentType for coastal domain: ${domain.domainId}`);
    }
    if (typeof domain.plantable !== "boolean") {
      throw new Error(`Invalid plantable flag for coastal domain: ${domain.domainId}`);
    }

    if (!regionsById.has(domain.regionId) && !regionBoundariesById.has(domain.regionId)) {
      throw new Error(`Missing coastal domain region reference: ${domain.regionId}`);
    }

    if (!materialStacks[domain.stackId]) {
      throw new Error(`Missing coastal stack ${domain.stackId} for domain ${domain.domainId}`);
    }

    if (Array.isArray(domain.adjacentDomains)) {
      for (const adjacentDomainId of domain.adjacentDomains) {
        if (!coastalDomainsById.has(adjacentDomainId)) {
          throw new Error(`Invalid adjacent coastal domain ${adjacentDomainId} for ${domain.domainId}`);
        }
      }
    }
  }

  const scope =
    typeof coastalBlueprintRoot.scope === "string" && coastalBlueprintRoot.scope.length > 0
      ? coastalBlueprintRoot.scope
      : "harbor_baseline";

  const authority =
    typeof coastalBlueprintRoot.authority === "string" && coastalBlueprintRoot.authority.length > 0
      ? coastalBlueprintRoot.authority
      : "COASTAL_BLUEPRINT_V2_HARBOR_BASELINE";

  const notes = typeof coastalBlueprintRoot.notes === "string" ? coastalBlueprintRoot.notes : "";

  return freezeObjectTree({
    version: coastalBlueprintRoot.version,
    scope,
    authority,
    notes,
    coastalDomainsById,
    materialStacks,
    coastalClasses
  });
}

function validateCoastalBlueprintBindings(
  coastalBlueprint,
  terrainPolygonsById,
  substratePolygonsById,
  generatedTerrainPolygonsById,
  generatedSubstratePolygonsById
) {
  const activeTerrainClassNames = new Set();
  for (const row of terrainPolygonsById.values()) activeTerrainClassNames.add(row.terrainClass);
  for (const row of generatedTerrainPolygonsById.values()) activeTerrainClassNames.add(row.terrainClass);

  const activeSubstrateClassNames = new Set();
  for (const row of substratePolygonsById.values()) activeSubstrateClassNames.add(row.substrateClass);
  for (const row of generatedSubstratePolygonsById.values()) activeSubstrateClassNames.add(row.substrateClass);

  for (const coastalClass of Object.values(coastalBlueprint.coastalClasses)) {
    if (coastalClass.status !== "BOUND") continue;

    if (coastalClass.family === "terrain" && !activeTerrainClassNames.has(coastalClass.targetClass)) {
      throw new Error(`BOUND terrain coastal class target missing: ${coastalClass.targetClass}`);
    }

    if (coastalClass.family === "substrate" && !activeSubstrateClassNames.has(coastalClass.targetClass)) {
      throw new Error(`BOUND substrate coastal class target missing: ${coastalClass.targetClass}`);
    }
  }

  return true;
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
    if (typeof cell.sector !== "string" || cell.sector.length === 0) {
      throw new Error(`Missing sealed sector for cell ${cell.diamondCellId}`);
    }
  }

  for (const graphType of Object.keys(graphRows)) {
    for (const edge of graphRows[graphType]) {
      if (
        regionsById.has(edge.fromId) === false &&
        hazardsById.has(edge.fromId) === false &&
        watersById.has(edge.fromId) === false
      ) {
        throw new Error(`Graph fromId missing: ${edge.fromId}`);
      }
      if (
        regionsById.has(edge.toId) === false &&
        hazardsById.has(edge.toId) === false &&
        watersById.has(edge.toId) === false
      ) {
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

function roundPoint(value) {
  return Math.round(value * 1000) / 1000;
}

function regularPolygon(cx, cy, radius, sides, rotation = -Math.PI / 2) {
  const points = [];
  for (let i = 0; i < sides; i += 1) {
    const angle = rotation + ((Math.PI * 2 * i) / sides);
    points.push([
      roundPoint(cx + (Math.cos(angle) * radius)),
      roundPoint(cy + (Math.sin(angle) * radius))
    ]);
  }
  return points;
}

function ellipsePolygon(cx, cy, radiusX, radiusY, segments = 16) {
  const points = [];
  for (let i = 0; i < segments; i += 1) {
    const angle = -Math.PI / 2 + ((Math.PI * 2 * i) / segments);
    points.push([
      roundPoint(cx + (Math.cos(angle) * radiusX)),
      roundPoint(cy + (Math.sin(angle) * radiusY))
    ]);
  }
  return points;
}

function rectPolygon(cx, cy, width, height) {
  const hw = width * 0.5;
  const hh = height * 0.5;
  return [
    [roundPoint(cx - hw), roundPoint(cy - hh)],
    [roundPoint(cx + hw), roundPoint(cy - hh)],
    [roundPoint(cx + hw), roundPoint(cy + hh)],
    [roundPoint(cx - hw), roundPoint(cy + hh)]
  ];
}

function shapeToPolygon(shapeSpec, centerPoint) {
  const [cx, cy] = centerPoint;
  const shape = shapeSpec.shape;

  if (shape === "hex") {
    return regularPolygon(cx, cy, shapeSpec.radius ?? 48, 6);
  }

  if (shape === "diamond") {
    return regularPolygon(cx, cy, shapeSpec.radius ?? 36, 4, 0);
  }

  if (shape === "oval") {
    return ellipsePolygon(cx, cy, shapeSpec.radiusX ?? 48, shapeSpec.radiusY ?? 28, 18);
  }

  if (shape === "rect") {
    return rectPolygon(cx, cy, shapeSpec.width ?? 72, shapeSpec.height ?? 36);
  }

  if (shape === "ring") {
    return regularPolygon(cx, cy, shapeSpec.radius ?? 64, 8);
  }

  return regularPolygon(cx, cy, shapeSpec.radius ?? 40, 6);
}

function buildGeneratedTerrainPolygons(regionsById, regionTemplatesById, terrainTemplatesById) {
  const generated = [];

  for (const region of regionsById.values()) {
    if (!region.templateId) continue;

    const regionTemplate = regionTemplatesById.get(region.templateId);
    if (!regionTemplate) continue;

    const terrainTemplate = terrainTemplatesById.get(regionTemplate.defaultTerrain);
    if (!terrainTemplate) continue;

    for (let index = 0; index < terrainTemplate.terrain.length; index += 1) {
      const item = terrainTemplate.terrain[index];
      generated.push(Object.freeze({
        terrainId: `${region.regionId}__generated_terrain__${index}`,
        terrainClass: item.terrainClass,
        regionId: region.regionId,
        polygon: shapeToPolygon(item, region.centerPoint),
        generationSource: {
          regionId: region.regionId,
          templateId: region.templateId,
          terrainTemplateId: terrainTemplate.templateId,
          index
        }
      }));
    }
  }

  return indexBy(generated, "terrainId");
}

function buildGeneratedSubstratePolygons(regionsById, regionTemplatesById, substrateTemplatesById) {
  const generated = [];

  for (const region of regionsById.values()) {
    if (!region.templateId) continue;

    const regionTemplate = regionTemplatesById.get(region.templateId);
    if (!regionTemplate) continue;

    const substrateTemplate = substrateTemplatesById.get(regionTemplate.defaultSubstrate);
    if (!substrateTemplate) continue;

    for (let index = 0; index < substrateTemplate.substrates.length; index += 1) {
      const item = substrateTemplate.substrates[index];
      generated.push(Object.freeze({
        substrateId: `${region.regionId}__generated_substrate__${index}`,
        substrateClass: item.substrateClass,
        regionId: region.regionId,
        polygon: shapeToPolygon(item, region.centerPoint),
        generationSource: {
          regionId: region.regionId,
          templateId: region.templateId,
          substrateTemplateId: substrateTemplate.templateId,
          index
        }
      }));
    }
  }

  return indexBy(generated, "substrateId");
}

function validateRebuiltDatasetRoot(root, expectedSchema, containerKey) {
  assertRoot(root, expectedSchema);

  if (!Array.isArray(root[containerKey]) || root[containerKey].length === 0) {
    throw new Error(`Missing ${containerKey} in ${expectedSchema}`);
  }
}

function buildCoastalRegionIdSet(coastalBlueprint) {
  const ids = new Set();
  for (const domain of coastalBlueprint.coastalDomainsById.values()) {
    ids.add(domain.regionId);
  }
  return ids;
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
  validateTemplateLibrary(terrainTemplates, "TERRAIN_TEMPLATE_LIBRARY_v1", "templates");
  validateTemplateLibrary(substrateTemplates, "SUBSTRATE_TEMPLATE_LIBRARY_v1", "templates");
  validateTemplateLibrary(regionTemplates, "REGION_TEMPLATE_LIBRARY_v1", "templates");
  validateCoastalBlueprintRoot(coastalBlueprintRoot);

  const regionsById = indexBy(regions.regionRows, "regionId");
  const pathsById = indexBy(paths.pathRows, "pathId");
  const hazardsById = indexBy(hazards.hazardRows, "hazardId");
  const watersById = indexBy(waters.waterRows, "waterId");
  const encodingsById = indexBy(stateEncodings.encodingRows, "encodingId");
  const diamondCellsById = indexBy(diamondGrid.diamondCells, "diamondCellId");
  const regionBoundariesById = indexBy(regionBoundaries.regions, "regionId");
  const legacyTerrainPolygonsById = indexBy(terrainPolygons.terrain, "terrainId");
  const legacySubstratePolygonsById = indexBy(substratePolygons.substrates, "substrateId");
  const terrainTemplatesById = indexBy(terrainTemplates.templates, "templateId");
  const substrateTemplatesById = indexBy(substrateTemplates.templates, "templateId");
  const regionTemplatesById = indexBy(regionTemplates.templates, "templateId");

  validateEncodingRows(encodingsById);

  const harborNavigation = validateHarborNavigationGraph(harborNavigationGraph, encodingsById);

  const coastlineModel = freezeObjectTree({
    version: coastlines.version,
    coastlineOuter: coastlines.coastlineOuter,
    harborPeninsula: coastlines.harborPeninsula,
    harborBasin: coastlines.harborBasin,
    harborChannel: coastlines.harborChannel,
    coastalSegmentMap: coastlines.coastalSegmentMap ?? {},
    reefZones: coastlines.reefZones ?? [],
    exposureZones: coastlines.exposureZones ?? [],
    firmnessZones: coastlines.firmnessZones ?? []
  });

  const coastalBlueprint = normalizeCoastalBlueprint(
    coastalBlueprintRoot,
    regionsById,
    regionBoundariesById
  );

  const harborInstancesById = validateHarborInstances(
    harborInstances,
    regionsById,
    watersById,
    harborNavigationGraph,
    coastlineModel
  );

  const maritimeNetworkModel = validateMaritimeNetwork(
    maritimeNetwork,
    encodingsById,
    regionsById,
    harborNavigation.navigationNodesById
  );

  const graphRows = freezeObjectTree({
    spatialAdjacencyGraph: graphs.graphRows.spatialAdjacencyGraph.map((edge) => Object.freeze({ ...edge })),
    traversalGraph: graphs.graphRows.traversalGraph.map((edge) => Object.freeze({ ...edge })),
    progressionGraph: graphs.graphRows.progressionGraph.map((edge) => Object.freeze({ ...edge })),
    hazardAdjacencyGraph: graphs.graphRows.hazardAdjacencyGraph.map((edge) => Object.freeze({ ...edge })),
    waterAdjacencyGraph: graphs.graphRows.waterAdjacencyGraph.map((edge) => Object.freeze({ ...edge }))
  });

  validateHarborPolygonDatasets(
    coastlines,
    regionBoundariesById,
    legacyTerrainPolygonsById,
    legacySubstratePolygonsById
  );

  validateTerrainTemplateLibrary(terrainTemplatesById);
  validateSubstrateTemplateLibrary(substrateTemplatesById);
  validateRegionTemplates(regionTemplatesById);
  validateTemplateCrossReferences(regionTemplatesById, terrainTemplatesById, substrateTemplatesById);
  validateRegionTemplateBindings(regionsById, regionTemplatesById);

  const generatedTerrainPolygonsById = buildGeneratedTerrainPolygons(
    regionsById,
    regionTemplatesById,
    terrainTemplatesById
  );

  const generatedSubstratePolygonsById = buildGeneratedSubstratePolygons(
    regionsById,
    regionTemplatesById,
    substrateTemplatesById
  );

  const provisionalKernel = freezeObjectTree({
    worldMeta: {
      worldId: regions.worldId,
      encodingFamilyVersion: regions.encodingFamilyVersion
    },
    coastlineModel,
    coastalBlueprint,
    regionBoundariesById,
    watersById,
    terrainPolygonsById: legacyTerrainPolygonsById,
    substratePolygonsById: legacySubstratePolygonsById,
    terrainDatasetMeta: {
      version: terrainPolygons.version
    },
    substrateDatasetMeta: {
      version: substratePolygons.version
    }
  });

  const rebuildResult = terrainSubstrateRebuildTool.rebuildTerrainAndSubstrateDatasets({
    kernel: provisionalKernel
  });

  validateRebuiltDatasetRoot(
    rebuildResult.terrainDataset,
    "HARBOR_TERRAIN_POLYGONS_DATASET_v1",
    "terrain"
  );
  validateRebuiltDatasetRoot(
    rebuildResult.substrateDataset,
    "HARBOR_SUBSTRATE_POLYGONS_DATASET_v1",
    "substrates"
  );

  const terrainPolygonsById = indexBy(rebuildResult.terrainDataset.terrain, "terrainId");
  const substratePolygonsById = indexBy(rebuildResult.substrateDataset.substrates, "substrateId");

  validateHarborPolygonDatasets(
    coastlines,
    regionBoundariesById,
    terrainPolygonsById,
    substratePolygonsById
  );

  validateCoastalBlueprintBindings(
    coastalBlueprint,
    terrainPolygonsById,
    substratePolygonsById,
    generatedTerrainPolygonsById,
    generatedSubstratePolygonsById
  );

  const coastalRegionIds = buildCoastalRegionIdSet(coastalBlueprint);

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
    coastlineModel,
    coastalBlueprint,
    harborNavigationGraph: freezeObjectTree({
      graphMeta: harborNavigationGraph.graphMeta,
      navigationNodesById: harborNavigation.navigationNodesById,
      navigationEdgesById: harborNavigation.navigationEdgesById
    }),
    harborInstancesById,
    maritimeNetwork: freezeObjectTree({
      version: maritimeNetwork.version,
      networkMeta: maritimeNetwork.networkMeta,
      maritimeHarborInstancesById: maritimeNetworkModel.maritimeHarborInstancesById,
      seaNodesById: maritimeNetworkModel.seaNodesById,
      seaRoutesById: maritimeNetworkModel.seaRoutesById,
      seaHazardsById: maritimeNetworkModel.seaHazardsById
    }),
    regionBoundariesById,
    terrainDatasetMeta: Object.freeze({
      version: rebuildResult.terrainDataset.version,
      sourceVersion: terrainPolygons.version
    }),
    substrateDatasetMeta: Object.freeze({
      version: rebuildResult.substrateDataset.version,
      sourceVersion: substratePolygons.version
    }),
    terrainPolygonsById,
    substratePolygonsById,
    legacyTerrainPolygonsById,
    legacySubstratePolygonsById,
    generatedTerrainPolygonsById,
    generatedSubstratePolygonsById,
    coastalGeneration: freezeObjectTree({
      receipts: rebuildResult.receipts,
      coastalRegionIds
    }),
    templateRegistry: freezeObjectTree({
      terrainTemplatesById,
      substrateTemplatesById,
      regionTemplatesById
    }),
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
        return legacyTerrainPolygonsById.get(terrainId) ?? null;
      },
      getLegacySubstratePolygon(substrateId) {
        return legacySubstratePolygonsById.get(substrateId) ?? null;
      },
      getGeneratedTerrainPolygon(terrainId) {
        return generatedTerrainPolygonsById.get(terrainId) ?? null;
      },
      getGeneratedSubstratePolygon(substrateId) {
        return generatedSubstratePolygonsById.get(substrateId) ?? null;
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
      getGeneratedTerrainForRegion(regionId) {
        return [...generatedTerrainPolygonsById.values()].filter((row) => row.regionId === regionId);
      },
      getGeneratedSubstrateForRegion(regionId) {
        return [...generatedSubstratePolygonsById.values()].filter((row) => row.regionId === regionId);
      },
      getActiveTerrainForRegion(regionId) {
        return [...terrainPolygonsById.values()].filter((row) => row.regionId === regionId);
      },
      getActiveSubstrateForRegion(regionId) {
        return [...substratePolygonsById.values()].filter((row) => row.regionId === regionId);
      },
      getCoastalDomain(domainId) {
        return kernel.coastalBlueprint.coastalDomainsById.get(domainId) ?? null;
      },
      getCoastalStack(stackId) {
        return kernel.coastalBlueprint.materialStacks[stackId] ?? null;
      },
      getCoastalClass(classId) {
        return kernel.coastalBlueprint.coastalClasses[classId] ?? null;
      },
      getCoastalDomains() {
        return [...kernel.coastalBlueprint.coastalDomainsById.values()];
      },
      getCoastalDomainsByRegion(regionId) {
        return [...kernel.coastalBlueprint.coastalDomainsById.values()].filter((domain) => domain.regionId === regionId);
      },
      getPlantableCoastalDomains() {
        return [...kernel.coastalBlueprint.coastalDomainsById.values()].filter((domain) => domain.plantable === true);
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
        return harborNavigation.navigationNodesById.get(navNodeId) ?? null;
      },
      getHarborNavEdge(edgeId) {
        return harborNavigation.navigationEdgesById.get(edgeId) ?? null;
      },
      getHarborNavNeighbors(navNodeId) {
        const neighbors = [];
        for (const edge of harborNavigation.navigationEdgesById.values()) {
          if (edge.fromNodeId === navNodeId) neighbors.push(harborNavigation.navigationNodesById.get(edge.toNodeId));
          if (edge.toNodeId === navNodeId) neighbors.push(harborNavigation.navigationNodesById.get(edge.fromNodeId));
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
        return kernel.maritimeNetwork.maritimeHarborInstancesById.get(harborInstanceId) ?? null;
      },
      getSeaNode(seaNodeId) {
        return kernel.maritimeNetwork.seaNodesById.get(seaNodeId) ?? null;
      },
      getSeaRoute(seaRouteId) {
        return kernel.maritimeNetwork.seaRoutesById.get(seaRouteId) ?? null;
      },
      getSeaHazard(seaHazardId) {
        return kernel.maritimeNetwork.seaHazardsById.get(seaHazardId) ?? null;
      },
      getMaritimeNode(nodeId) {
        return kernel.maritimeNetwork.seaNodesById.get(nodeId) ?? harborNavigation.navigationNodesById.get(nodeId) ?? null;
      },
      getMaritimeNeighbors(nodeId) {
        const neighbors = [];

        for (const edge of kernel.maritimeNetwork.seaRoutesById.values()) {
          if (edge.fromNodeId === nodeId) neighbors.push(this.getMaritimeNode(edge.toNodeId));
          if (edge.toNodeId === nodeId) neighbors.push(this.getMaritimeNode(edge.fromNodeId));
        }

        for (const edge of harborNavigation.navigationEdgesById.values()) {
          if (edge.fromNodeId === nodeId) neighbors.push(this.getMaritimeNode(edge.toNodeId));
          if (edge.toNodeId === nodeId) neighbors.push(this.getMaritimeNode(edge.fromNodeId));
        }

        return neighbors.filter(Boolean);
      },
      getSeaRoutesForNode(nodeId) {
        return [...kernel.maritimeNetwork.seaRoutesById.values()].filter(
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
        const previousCell = previousCellId ? diamondCellsById.get(previousCellId) : null;
        const encoding = encodingsById.get(activeCell.stateEncodingId);

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
        validateCrossReferences({
          regionsById,
          pathsById,
          hazardsById,
          watersById,
          encodingsById,
          diamondCellsById,
          graphRows
        });

        validateHarborPolygonDatasets(
          coastlines,
          regionBoundariesById,
          terrainPolygonsById,
          substratePolygonsById
        );

        validateTerrainTemplateLibrary(terrainTemplatesById);
        validateSubstrateTemplateLibrary(substrateTemplatesById);
        validateRegionTemplates(regionTemplatesById);
        validateTemplateCrossReferences(regionTemplatesById, terrainTemplatesById, substrateTemplatesById);
        validateRegionTemplateBindings(regionsById, regionTemplatesById);

        validateHarborInstances(
          harborInstances,
          regionsById,
          watersById,
          harborNavigationGraph,
          coastlineModel
        );

        validateMaritimeNetwork(
          maritimeNetwork,
          encodingsById,
          regionsById,
          harborNavigation.navigationNodesById
        );

        validateCoastalBlueprintRoot(coastalBlueprintRoot);
        validateCoastalBlueprintBindings(
          coastalBlueprint,
          terrainPolygonsById,
          substratePolygonsById,
          generatedTerrainPolygonsById,
          generatedSubstratePolygonsById
        );

        const rebuildCheck = terrainSubstrateRebuildTool.rebuildTerrainAndSubstrateDatasets({
          kernel: freezeObjectTree({
            worldMeta: {
              worldId: kernel.worldMeta.worldId,
              encodingFamilyVersion: kernel.worldMeta.encodingFamilyVersion
            },
            coastlineModel: kernel.coastlineModel,
            coastalBlueprint: kernel.coastalBlueprint,
            regionBoundariesById: kernel.regionBoundariesById,
            watersById: kernel.watersById,
            terrainPolygonsById: kernel.legacyTerrainPolygonsById,
            substratePolygonsById: kernel.legacySubstratePolygonsById,
            terrainDatasetMeta: {
              version: terrainPolygons.version
            },
            substrateDatasetMeta: {
              version: substratePolygons.version
            }
          })
        });

        validateRebuiltDatasetRoot(
          rebuildCheck.terrainDataset,
          "HARBOR_TERRAIN_POLYGONS_DATASET_v1",
          "terrain"
        );
        validateRebuiltDatasetRoot(
          rebuildCheck.substrateDataset,
          "HARBOR_SUBSTRATE_POLYGONS_DATASET_v1",
          "substrates"
        );

        for (const row of terrainPolygonsById.values()) {
          assertPolygon(row.polygon, `activeTerrain.${row.terrainId}`);
        }

        for (const row of substratePolygonsById.values()) {
          assertPolygon(row.polygon, `activeSubstrate.${row.substrateId}`);
        }

        for (const row of generatedTerrainPolygonsById.values()) {
          assertPolygon(row.polygon, `generatedTerrain.${row.terrainId}`);
        }

        for (const row of generatedSubstratePolygonsById.values()) {
          assertPolygon(row.polygon, `generatedSubstrate.${row.substrateId}`);
        }

        for (const edge of harborNavigation.navigationEdgesById.values()) {
          assertPointList(edge.centerline, `harborNavigation.edge.${edge.edgeId}.centerline`, 2);
        }

        for (const route of kernel.maritimeNetwork.seaRoutesById.values()) {
          assertPointList(route.centerline, `maritime.seaRoute.${route.seaRouteId}.centerline`, 2);
        }

        for (const hazard of kernel.maritimeNetwork.seaHazardsById.values()) {
          assertPolygon(hazard.polygon, `maritime.seaHazard.${hazard.seaHazardId}.polygon`);
        }

        return true;
      }
    }
  };

  kernel.helpers.assertValidWorld();
  return freezeObjectTree(kernel);
}

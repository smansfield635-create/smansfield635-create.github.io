function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertMap(map, label) {
  assert(map instanceof Map, `${label} must be a Map`);
}

function assertReferenceExists(map, id, label) {
  assert(map instanceof Map, `${label} reference map must be a Map`);
  assert(map.has(id), `Missing ${label}: ${id}`);
}

function assertPoint(point, label) {
  assert(Array.isArray(point) && point.length === 2, `Invalid point in ${label}`);
  assert(Number.isFinite(point[0]) && Number.isFinite(point[1]), `Non-numeric point in ${label}`);
}

function assertPointList(points, label, minLength = 1) {
  assert(Array.isArray(points) && points.length >= minLength, `Invalid point list for ${label}`);
  for (const point of points) {
    assertPoint(point, label);
  }
}

function assertPolygon(points, label) {
  assert(Array.isArray(points) && points.length >= 3, `Invalid polygon for ${label}`);
  for (const point of points) {
    assertPoint(point, label);
  }
}

function validateGraphRows(graphRows, regionsById, hazardsById, watersById) {
  assert(graphRows && typeof graphRows === "object", "graphRows missing");

  for (const graphType of Object.keys(graphRows)) {
    const edges = graphRows[graphType];
    assert(Array.isArray(edges), `graphRows.${graphType} must be an array`);

    for (const edge of edges) {
      assert(edge && typeof edge === "object", `Invalid edge in ${graphType}`);
      assert(typeof edge.fromId === "string" && edge.fromId.length > 0, `Missing fromId in ${graphType}`);
      assert(typeof edge.toId === "string" && edge.toId.length > 0, `Missing toId in ${graphType}`);

      const fromExists =
        regionsById.has(edge.fromId) ||
        hazardsById.has(edge.fromId) ||
        watersById.has(edge.fromId);

      const toExists =
        regionsById.has(edge.toId) ||
        hazardsById.has(edge.toId) ||
        watersById.has(edge.toId);

      assert(fromExists, `Graph fromId missing: ${edge.fromId}`);
      assert(toExists, `Graph toId missing: ${edge.toId}`);
    }
  }
}

function validateRegions(regionsById, pathsById, hazardsById, watersById, encodingsById, regionTemplatesById) {
  for (const region of regionsById.values()) {
    assert(typeof region.regionId === "string" && region.regionId.length > 0, "Invalid regionId");
    assertPoint(region.centerPoint, `region.${region.regionId}.centerPoint`);
    assertReferenceExists(encodingsById, region.stateEncodingId, "region.stateEncodingId");

    const pathAnchors = Array.isArray(region.pathAnchors) ? region.pathAnchors : [];
    const hazardAdjacency = Array.isArray(region.hazardAdjacency) ? region.hazardAdjacency : [];
    const waterAdjacency = Array.isArray(region.waterAdjacency) ? region.waterAdjacency : [];
    const requiredPredecessors = Array.isArray(region.requiredPredecessors) ? region.requiredPredecessors : [];

    for (const pathId of pathAnchors) assertReferenceExists(pathsById, pathId, "pathId");
    for (const hazardId of hazardAdjacency) assertReferenceExists(hazardsById, hazardId, "hazardId");
    for (const waterId of waterAdjacency) assertReferenceExists(watersById, waterId, "waterId");
    for (const predecessorId of requiredPredecessors) assertReferenceExists(regionsById, predecessorId, "requiredPredecessor");

    if (region.templateId) {
      assertReferenceExists(regionTemplatesById, region.templateId, "region.templateId");
    }
  }
}

function validatePaths(pathsById, regionsById, encodingsById) {
  for (const path of pathsById.values()) {
    assert(typeof path.pathId === "string" && path.pathId.length > 0, "Invalid pathId");
    assertReferenceExists(regionsById, path.fromRegionId, "fromRegionId");
    assertReferenceExists(regionsById, path.toRegionId, "toRegionId");
    assertReferenceExists(encodingsById, path.stateEncodingId, "path.stateEncodingId");
    assertPointList(path.centerline, `path.${path.pathId}.centerline`, 2);
  }
}

function validateHazards(hazardsById, regionsById, pathsById, encodingsById) {
  for (const hazard of hazardsById.values()) {
    assert(typeof hazard.hazardId === "string" && hazard.hazardId.length > 0, "Invalid hazardId");
    assertReferenceExists(encodingsById, hazard.stateEncodingId, "hazard.stateEncodingId");

    const affectedRegionIds = Array.isArray(hazard.affectedRegionIds) ? hazard.affectedRegionIds : [];
    const pathIds = Array.isArray(hazard.pathIds) ? hazard.pathIds : [];

    for (const regionId of affectedRegionIds) assertReferenceExists(regionsById, regionId, "hazard.affectedRegionId");
    for (const pathId of pathIds) assertReferenceExists(pathsById, pathId, "hazard.pathId");
  }
}

function validateWaters(watersById, encodingsById) {
  for (const water of watersById.values()) {
    assert(typeof water.waterId === "string" && water.waterId.length > 0, "Invalid waterId");
    assertReferenceExists(encodingsById, water.stateEncodingId, "water.stateEncodingId");
    if (water.polygon) {
      assertPolygon(water.polygon, `water.${water.waterId}.polygon`);
    }
  }
}

function validateDiamondCells(diamondCellsById, regionsById, pathsById, encodingsById) {
  for (const cell of diamondCellsById.values()) {
    assert(typeof cell.diamondCellId === "string" && cell.diamondCellId.length > 0, "Invalid diamondCellId");
    assertReferenceExists(regionsById, cell.regionId, "cell.regionId");
    if (cell.pathId) assertReferenceExists(pathsById, cell.pathId, "cell.pathId");
    assertReferenceExists(encodingsById, cell.stateEncodingId, "cell.stateEncodingId");
    assertPoint(cell.centerPoint, `cell.${cell.diamondCellId}.centerPoint`);
    assert(typeof cell.sector === "string" && cell.sector.length > 0, `Missing sealed sector for cell ${cell.diamondCellId}`);

    const neighborIds = Array.isArray(cell.neighborIds) ? cell.neighborIds : [];
    for (const neighborId of neighborIds) {
      assertReferenceExists(diamondCellsById, neighborId, "cell.neighborId");
    }
  }
}

function validateRegionBoundaries(regionBoundariesById) {
  for (const row of regionBoundariesById.values()) {
    assert(typeof row.regionId === "string" && row.regionId.length > 0, "Invalid region boundary regionId");
    assertPolygon(row.polygon, `region_boundaries.${row.regionId}`);
  }
}

function validateTerrainAndSubstrate(regionBoundariesById, terrainPolygonsById, substratePolygonsById) {
  for (const row of terrainPolygonsById.values()) {
    assert(typeof row.terrainId === "string" && row.terrainId.length > 0, "Invalid terrainId");
    assertReferenceExists(regionBoundariesById, row.regionId, "terrain.regionId");
    assertPolygon(row.polygon, `terrain.${row.terrainId}`);
  }

  for (const row of substratePolygonsById.values()) {
    assert(typeof row.substrateId === "string" && row.substrateId.length > 0, "Invalid substrateId");
    assertReferenceExists(regionBoundariesById, row.regionId, "substrate.regionId");
    assertPolygon(row.polygon, `substrate.${row.substrateId}`);
  }
}

function validateGeneratedPolygons(generatedTerrainPolygonsById, generatedSubstratePolygonsById) {
  for (const row of generatedTerrainPolygonsById.values()) {
    assert(typeof row.terrainId === "string" && row.terrainId.length > 0, "Invalid generated terrainId");
    assertPolygon(row.polygon, `generatedTerrain.${row.terrainId}`);
  }

  for (const row of generatedSubstratePolygonsById.values()) {
    assert(typeof row.substrateId === "string" && row.substrateId.length > 0, "Invalid generated substrateId");
    assertPolygon(row.polygon, `generatedSubstrate.${row.substrateId}`);
  }
}

function validateCoastlineModel(coastlineModel) {
  assert(coastlineModel && typeof coastlineModel === "object", "coastlineModel missing");
  assertPolygon(coastlineModel.coastlineOuter, "coastlineOuter");
  assertPolygon(coastlineModel.harborPeninsula, "harborPeninsula");
  assertPolygon(coastlineModel.harborBasin, "harborBasin");
  assertPointList(coastlineModel.harborChannel, "harborChannel", 2);
}

function validateTemplateRegistry(templateRegistry) {
  assert(templateRegistry && typeof templateRegistry === "object", "templateRegistry missing");

  const {
    terrainTemplatesById,
    substrateTemplatesById,
    regionTemplatesById
  } = templateRegistry;

  assertMap(terrainTemplatesById, "templateRegistry.terrainTemplatesById");
  assertMap(substrateTemplatesById, "templateRegistry.substrateTemplatesById");
  assertMap(regionTemplatesById, "templateRegistry.regionTemplatesById");

  for (const row of terrainTemplatesById.values()) {
    assert(typeof row.templateId === "string" && row.templateId.length > 0, "Invalid terrain templateId");
    assert(Array.isArray(row.terrain) && row.terrain.length > 0, `Missing terrain array for ${row.templateId}`);
  }

  for (const row of substrateTemplatesById.values()) {
    assert(typeof row.templateId === "string" && row.templateId.length > 0, "Invalid substrate templateId");
    assert(Array.isArray(row.substrates) && row.substrates.length > 0, `Missing substrates array for ${row.templateId}`);
  }

  for (const row of regionTemplatesById.values()) {
    assert(typeof row.templateId === "string" && row.templateId.length > 0, "Invalid region templateId");
    assertReferenceExists(terrainTemplatesById, row.defaultTerrain, "regionTemplate.defaultTerrain");
    assertReferenceExists(substrateTemplatesById, row.defaultSubstrate, "regionTemplate.defaultSubstrate");
  }
}

function validateCoastalBlueprint(kernel) {
  const blueprint = kernel.coastalBlueprint;
  assert(blueprint && typeof blueprint === "object", "coastalBlueprint missing");
  assertMap(blueprint.coastalDomainsById, "coastalBlueprint.coastalDomainsById");
  assert(blueprint.materialStacks && typeof blueprint.materialStacks === "object", "coastalBlueprint.materialStacks missing");
  assert(blueprint.coastalClasses && typeof blueprint.coastalClasses === "object", "coastalBlueprint.coastalClasses missing");

  for (const domain of blueprint.coastalDomainsById.values()) {
    assert(typeof domain.domainId === "string" && domain.domainId.length > 0, "Invalid coastal domainId");
    assert(typeof domain.regionId === "string" && domain.regionId.length > 0, `Invalid regionId for coastal domain ${domain.domainId}`);
    assert(
      kernel.regionsById.has(domain.regionId) || kernel.regionBoundariesById.has(domain.regionId),
      `Missing coastal domain region reference: ${domain.regionId}`
    );
    assert(typeof domain.stackId === "string" && domain.stackId.length > 0, `Invalid stackId for coastal domain ${domain.domainId}`);
    assert(Array.isArray(kernel.coastalBlueprint.materialStacks[domain.stackId]), `Missing coastal stack ${domain.stackId} for domain ${domain.domainId}`);
  }

  for (const [classId, coastalClass] of Object.entries(blueprint.coastalClasses)) {
    assert(typeof classId === "string" && classId.length > 0, "Invalid coastal class key");
    assert(coastalClass && typeof coastalClass === "object", `Invalid coastal class row: ${classId}`);
    assert(typeof coastalClass.targetClass === "string" && coastalClass.targetClass.length > 0, `Invalid targetClass for coastal class: ${classId}`);
  }
}

function validateHarborNavigationGraph(kernel) {
  const graph = kernel.harborNavigationGraph;
  assert(graph && typeof graph === "object", "harborNavigationGraph missing");
  assertMap(graph.navigationNodesById, "harborNavigationGraph.navigationNodesById");
  assertMap(graph.navigationEdgesById, "harborNavigationGraph.navigationEdgesById");

  for (const node of graph.navigationNodesById.values()) {
    assert(typeof node.navNodeId === "string" && node.navNodeId.length > 0, "Invalid harbor navNodeId");
    assertPoint(node.centerPoint, `harborNavigation.node.${node.navNodeId}.centerPoint`);
    assertReferenceExists(kernel.encodingsById, node.stateEncodingId, "harborNavigation.node.stateEncodingId");
  }

  for (const edge of graph.navigationEdgesById.values()) {
    assert(typeof edge.edgeId === "string" && edge.edgeId.length > 0, "Invalid harbor edgeId");
    assertReferenceExists(graph.navigationNodesById, edge.fromNodeId, "harborNavigation.edge.fromNodeId");
    assertReferenceExists(graph.navigationNodesById, edge.toNodeId, "harborNavigation.edge.toNodeId");
    assertPointList(edge.centerline, `harborNavigation.edge.${edge.edgeId}.centerline`, 2);
    assertReferenceExists(kernel.encodingsById, edge.stateEncodingId, "harborNavigation.edge.stateEncodingId");
  }
}

function validateHarborInstances(kernel) {
  assertMap(kernel.harborInstancesById, "harborInstancesById");
  const navNodes = kernel.harborNavigationGraph.navigationNodesById;

  for (const instance of kernel.harborInstancesById.values()) {
    assert(typeof instance.harborInstanceId === "string" && instance.harborInstanceId.length > 0, "Invalid harborInstanceId");
    assertReferenceExists(kernel.regionsById, instance.parentRegionId, "harborInstance.parentRegionId");
    assertReferenceExists(kernel.watersById, instance.waterBodyId, "harborInstance.waterBodyId");
    assertReferenceExists(kernel.regionsById, instance.marketLinkRegionId, "harborInstance.marketLinkRegionId");

    const transfers = instance?.transferRules?.dockTransfers ?? [];
    assert(Array.isArray(transfers) && transfers.length > 0, `Missing dockTransfers for ${instance.harborInstanceId}`);

    for (const transfer of transfers) {
      assertReferenceExists(navNodes, transfer.dockId, "harborInstance.transfer.dockId");
      assertReferenceExists(kernel.regionsById, transfer.landRegionId, "harborInstance.transfer.landRegionId");
    }
  }
}

function validateMaritimeNetwork(kernel) {
  const maritime = kernel.maritimeNetwork;
  assert(maritime && typeof maritime === "object", "maritimeNetwork missing");
  assertMap(maritime.maritimeHarborInstancesById, "maritimeNetwork.maritimeHarborInstancesById");
  assertMap(maritime.seaNodesById, "maritimeNetwork.seaNodesById");
  assertMap(maritime.seaRoutesById, "maritimeNetwork.seaRoutesById");
  assertMap(maritime.seaHazardsById, "maritimeNetwork.seaHazardsById");

  const validMaritimeNodeIds = new Set([
    ...maritime.seaNodesById.keys(),
    ...kernel.harborNavigationGraph.navigationNodesById.keys()
  ]);

  for (const instance of maritime.maritimeHarborInstancesById.values()) {
    assertReferenceExists(kernel.regionsById, instance.primaryRegionId, "maritime.harborInstance.primaryRegionId");
    assertReferenceExists(kernel.regionsById, instance.marketLinkRegionId, "maritime.harborInstance.marketLinkRegionId");
  }

  for (const node of maritime.seaNodesById.values()) {
    assertPoint(node.centerPoint, `maritime.seaNode.${node.seaNodeId}.centerPoint`);
    assertReferenceExists(kernel.encodingsById, node.stateEncodingId, "maritime.seaNode.stateEncodingId");
  }

  for (const route of maritime.seaRoutesById.values()) {
    assert(validMaritimeNodeIds.has(route.fromNodeId), `Invalid maritime route fromNodeId: ${route.fromNodeId}`);
    assert(validMaritimeNodeIds.has(route.toNodeId), `Invalid maritime route toNodeId: ${route.toNodeId}`);
    assertPointList(route.centerline, `maritime.seaRoute.${route.seaRouteId}.centerline`, 2);
    assertReferenceExists(kernel.encodingsById, route.stateEncodingId, "maritime.seaRoute.stateEncodingId");
  }

  for (const hazard of maritime.seaHazardsById.values()) {
    assertPolygon(hazard.polygon, `maritime.seaHazard.${hazard.seaHazardId}.polygon`);
    assertReferenceExists(kernel.encodingsById, hazard.stateEncodingId, "maritime.seaHazard.stateEncodingId");
  }
}

export function validateLoadedWorldKernel(kernel) {
  assert(kernel && typeof kernel === "object", "kernel missing");
  assert(kernel.worldMeta && typeof kernel.worldMeta === "object", "worldMeta missing");
  assert(typeof kernel.worldMeta.worldId === "string" && kernel.worldMeta.worldId.length > 0, "worldMeta.worldId missing");

  assertMap(kernel.regionsById, "regionsById");
  assertMap(kernel.pathsById, "pathsById");
  assertMap(kernel.hazardsById, "hazardsById");
  assertMap(kernel.watersById, "watersById");
  assertMap(kernel.encodingsById, "encodingsById");
  assertMap(kernel.diamondCellsById, "diamondCellsById");
  assertMap(kernel.regionBoundariesById, "regionBoundariesById");
  assertMap(kernel.terrainPolygonsById, "terrainPolygonsById");
  assertMap(kernel.substratePolygonsById, "substratePolygonsById");
  assertMap(kernel.legacyTerrainPolygonsById, "legacyTerrainPolygonsById");
  assertMap(kernel.legacySubstratePolygonsById, "legacySubstratePolygonsById");
  assertMap(kernel.generatedTerrainPolygonsById, "generatedTerrainPolygonsById");
  assertMap(kernel.generatedSubstratePolygonsById, "generatedSubstratePolygonsById");

  validateTemplateRegistry(kernel.templateRegistry);
  validateCoastlineModel(kernel.coastlineModel);
  validateRegions(
    kernel.regionsById,
    kernel.pathsById,
    kernel.hazardsById,
    kernel.watersById,
    kernel.encodingsById,
    kernel.templateRegistry.regionTemplatesById
  );
  validatePaths(kernel.pathsById, kernel.regionsById, kernel.encodingsById);
  validateHazards(kernel.hazardsById, kernel.regionsById, kernel.pathsById, kernel.encodingsById);
  validateWaters(kernel.watersById, kernel.encodingsById);
  validateDiamondCells(kernel.diamondCellsById, kernel.regionsById, kernel.pathsById, kernel.encodingsById);
  validateRegionBoundaries(kernel.regionBoundariesById);
  validateTerrainAndSubstrate(kernel.regionBoundariesById, kernel.terrainPolygonsById, kernel.substratePolygonsById);
  validateGeneratedPolygons(kernel.generatedTerrainPolygonsById, kernel.generatedSubstratePolygonsById);
  validateGraphRows(kernel.graphRows, kernel.regionsById, kernel.hazardsById, kernel.watersById);
  validateCoastalBlueprint(kernel);
  validateHarborNavigationGraph(kernel);
  validateHarborInstances(kernel);
  validateMaritimeNetwork(kernel);

  return true;
}

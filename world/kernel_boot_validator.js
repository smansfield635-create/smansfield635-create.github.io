export function validateLoadedWorldKernel(kernel) {

  if (!kernel || typeof kernel !== "object") {
    throw new Error("Kernel missing");
  }

  if (!kernel.worldMeta) {
    throw new Error("Kernel worldMeta missing");
  }

  if (kernel.worldMeta.worldId !== "nine_summits_island") {
    throw new Error("Invalid worldId");
  }

  if (!kernel.regionsById || typeof kernel.regionsById.values !== "function") {
    throw new Error("regionsById missing");
  }

  if (!kernel.pathsById) {
    throw new Error("pathsById missing");
  }

  if (!kernel.hazardsById) {
    throw new Error("hazardsById missing");
  }

  if (!kernel.watersById) {
    throw new Error("watersById missing");
  }

  if (!kernel.encodingsById) {
    throw new Error("encodingsById missing");
  }

  if (!kernel.diamondCellsById) {
    throw new Error("diamondCellsById missing");
  }

  if (!kernel.harborNavigationGraph) {
    throw new Error("harborNavigationGraph missing");
  }

  if (!kernel.maritimeNetwork) {
    throw new Error("maritimeNetwork missing");
  }

  if (!kernel.terrainPolygonsById) {
    throw new Error("terrainPolygonsById missing");
  }

  if (!kernel.substratePolygonsById) {
    throw new Error("substratePolygonsById missing");
  }

  if (!kernel.helpers) {
    throw new Error("helpers missing");
  }

  // Validate region references

  for (const region of kernel.regionsById.values()) {

    if (!region.regionId) {
      throw new Error("Region missing id");
    }

    if (!region.displayName) {
      throw new Error(`Region ${region.regionId} missing displayName`);
    }

  }

  // Validate terrain polygons

  for (const terrain of kernel.terrainPolygonsById.values()) {

    if (!terrain.terrainId) {
      throw new Error("Terrain missing terrainId");
    }

    if (!Array.isArray(terrain.polygon)) {
      throw new Error(`Terrain polygon invalid ${terrain.terrainId}`);
    }

  }

  // Validate substrate polygons

  for (const substrate of kernel.substratePolygonsById.values()) {

    if (!substrate.substrateId) {
      throw new Error("Substrate missing substrateId");
    }

    if (!Array.isArray(substrate.polygon)) {
      throw new Error(`Substrate polygon invalid ${substrate.substrateId}`);
    }

  }

  // Validate navigation graph

  const nav = kernel.harborNavigationGraph;

  if (!nav.navigationNodesById) {
    throw new Error("Navigation nodes missing");
  }

  if (!nav.navigationEdgesById) {
    throw new Error("Navigation edges missing");
  }

  for (const node of nav.navigationNodesById.values()) {

    if (!node.navNodeId) {
      throw new Error("Nav node missing id");
    }

    if (!Array.isArray(node.centerPoint)) {
      throw new Error(`Nav node center invalid ${node.navNodeId}`);
    }

  }

  for (const edge of nav.navigationEdgesById.values()) {

    if (!edge.edgeId) {
      throw new Error("Nav edge missing id");
    }

    if (!Array.isArray(edge.centerline)) {
      throw new Error(`Nav edge centerline invalid ${edge.edgeId}`);
    }

  }

  // Validate maritime network

  const maritime = kernel.maritimeNetwork;

  if (!maritime.seaNodesById) {
    throw new Error("Sea nodes missing");
  }

  if (!maritime.seaRoutesById) {
    throw new Error("Sea routes missing");
  }

  if (!maritime.seaHazardsById) {
    throw new Error("Sea hazards missing");
  }

  for (const route of maritime.seaRoutesById.values()) {

    if (!Array.isArray(route.centerline)) {
      throw new Error(`Sea route centerline invalid ${route.seaRouteId}`);
    }

  }

  for (const hazard of maritime.seaHazardsById.values()) {

    if (!Array.isArray(hazard.polygon)) {
      throw new Error(`Sea hazard polygon invalid ${hazard.seaHazardId}`);
    }

  }

  return true;

}

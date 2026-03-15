import { WORLD_KERNEL } from "./world_kernel.js";

function makeScaleNode(id, displayName, depth, upstreamId = null) {
  return Object.freeze({
    id,
    displayName,
    depth,
    upstreamId
  });
}

function resolveCosmic() {
  return makeScaleNode("cosmic", "Cosmic", 0, null);
}

function resolveRegion(cosmic) {
  return makeScaleNode("region", "Region", 1, cosmic.id);
}

function resolveGalaxy(region) {
  return makeScaleNode("galaxy", "Galaxy", 2, region.id);
}

function resolveHarbor(galaxy) {
  return makeScaleNode("harbor", "Harbor", 3, galaxy.id);
}

function resolvePlanet(harbor) {
  return makeScaleNode("planet", "Planet", 4, harbor.id);
}

function resolveSurface(planet) {
  return makeScaleNode("surface", "Surface", 5, planet.id);
}

function splitHarborGratitude() {
  const source = WORLD_KERNEL.branches.harbor.gratitude;

  return Object.freeze({
    north: source.north,
    south: source.south,
    east: source.east,
    west: source.west,
    conclusion: "acknowledged_value_stabilized"
  });
}

function splitHarborGenerosity() {
  const source = WORLD_KERNEL.branches.harbor.generosity;

  return Object.freeze({
    north: source.north,
    south: source.south,
    east: source.east,
    west: source.west,
    conclusion: "outward_support_coherently_distributed"
  });
}

function resolveHarborExchange(gratitude, generosity) {
  return Object.freeze({
    label: "harbor_exchange_state",
    premise: "recognized_value_and_distributed_value_balance_at_the_node",
    gratitudeConclusion: gratitude.conclusion,
    generosityConclusion: generosity.conclusion
  });
}

function resolveBranches() {
  const gratitude = splitHarborGratitude();
  const generosity = splitHarborGenerosity();
  const corePremise = resolveHarborExchange(gratitude, generosity);

  return Object.freeze({
    harbor: Object.freeze({
      gratitude,
      generosity,
      corePremise
    })
  });
}

export function createCosmicEngineSpine() {
  function resolveWorldState(input = {}) {
    const cosmic = resolveCosmic();
    const region = resolveRegion(cosmic);
    const galaxy = resolveGalaxy(region);
    const harbor = resolveHarbor(galaxy);
    const planet = resolvePlanet(harbor);
    const surface = resolveSurface(planet);
    const branches = resolveBranches();

    return Object.freeze({
      activeScale: WORLD_KERNEL.naming.activeScale,
      externalViewLock: WORLD_KERNEL.modes.externalViewOnly,
      cosmic,
      region,
      galaxy,
      harbor,
      planet,
      surface,
      branches,
      input
    });
  }

  return Object.freeze({
    resolveWorldState
  });
}

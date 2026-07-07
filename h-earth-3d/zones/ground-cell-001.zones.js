/**
 * ROOM 3 — CELL / OBJECTS / ZONES
 * File: h-earth-3d/zones/ground-cell-001.zones.js
 *
 * Status:
 * GitHub-ready raw JavaScript source body.
 * Manual installation only.
 * Zone map only.
 * Zones do not create gameplay traversal.
 * Zones do not activate runtime.
 * Zones do not activate renderer.
 * No visual-pass claim.
 * No validation claim.
 */

export const H_EARTH_ZONE_BOUNDARIES = Object.freeze({
  openWorldTraversalAuthorized: false,
  manorInteriorAccessAuthorized: false,
  distantTraversalAuthorized: false,
  swimmingAuthorized: false,
  waterTraversalAuthorized: false,
  fluidSimulationAuthorized: false,
  runtimeActivationClaim: false,
  rendererActivationClaim: false,
  canvasActivationClaim: false,
  webglActivationClaim: false,
  visualPassClaim: false,
  validationClaim: false,
  survivalSimulationAuthorized: false,
  matrixCollapse: false,
});

export const H_EARTH_GROUND_CELL_001_ZONES = Object.freeze([
  Object.freeze({
    zoneId: "ZONE_001_FOREGROUND_INSPECTION_ZONE",
    label: "Foreground Inspection Zone",
    role: "bounded local inspection",
    allowedUse: "Inspect Ground target area",
    inspectGroundAllowed: true,
    openWorldTraversalAuthorized: false,
    runtimeActivationClaim: false,
    rendererActivationClaim: false,
  }),

  Object.freeze({
    zoneId: "ZONE_002_SHORELINE_CONTACT_ZONE",
    label: "Shoreline Contact Zone",
    role: "local shoreline contact only, non-simulated",
    allowedUse: "bounded environmental context for moisture and waterContact",
    inspectGroundAllowed: true,
    fullFluidSimulationAuthorized: false,
    waterTraversalAuthorized: false,
    runtimeActivationClaim: false,
    rendererActivationClaim: false,
  }),

  Object.freeze({
    zoneId: "ZONE_003_WATER_SURFACE_ZONE",
    label: "Water Surface Zone",
    role: "context only",
    allowedUse: "water surface reference for Ground Condition Read",
    inspectGroundAllowed: false,
    swimmingAuthorized: false,
    waterTraversalAuthorized: false,
    fullFluidSimulationAuthorized: false,
    runtimeActivationClaim: false,
    rendererActivationClaim: false,
  }),

  Object.freeze({
    zoneId: "ZONE_004_MANOR_CONTEXT_ZONE",
    label: "Manor Context Zone",
    role: "manor exterior context only",
    allowedUse: "Hearth-visible support/control context",
    hearthMergedIntoHEarth: false,
    manorInteriorAccessAuthorized: false,
    runtimeActivationClaim: false,
    rendererActivationClaim: false,
  }),

  Object.freeze({
    zoneId: "ZONE_005_DISTANT_WORLD_CONTEXT_ZONE",
    label: "Distant World Context Zone",
    role: "distant world visual/context only",
    allowedUse: "Audralia / planetary-world continuity context",
    audraliaMergedIntoHEarth: false,
    distantTraversalAuthorized: false,
    openWorldTraversalAuthorized: false,
    runtimeActivationClaim: false,
    rendererActivationClaim: false,
  }),
]);

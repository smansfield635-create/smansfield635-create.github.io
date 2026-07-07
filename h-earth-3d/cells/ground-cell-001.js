/**
 * ROOM 3 — CELL / OBJECTS / ZONES
 * File: h-earth-3d/cells/ground-cell-001.js
 *
 * Status:
 * GitHub-ready raw JavaScript source body.
 * Manual installation only.
 * No GitHub installation performed by this packet.
 * No public route integration.
 * No runtime activation.
 * No renderer/canvas/WebGL activation.
 * No visual-pass claim.
 * No validation claim.
 * No open-world expansion.
 * No survival simulation.
 * No manor interior.
 * No distant traversal.
 * No matrix collapse.
 */

export const H_EARTH_GROUND_CELL_001 = Object.freeze({
  cellId: "H_EARTH_GROUND_CELL_001",
  matrix: "H-Earth",
  matrixRole: "Ground-View Matrix",
  sceneIdentity: "earth-water-air-survival-shoreline-manor",

  firstAction: "Inspect Ground",
  firstReadout: "Ground Condition Read",
  firstReceipt: "H_EARTH_GROUND_INSPECTION_RECEIPT",

  ownedObjectRegistry: "H_EARTH_GROUND_CELL_001_OBJECTS",
  ownedZoneMap: "H_EARTH_GROUND_CELL_001_ZONES",

  cellScope: Object.freeze({
    localGroundViewInspectionOnly: true,
    openWorldTraversalAuthorized: false,
    survivalSimulationAuthorized: false,
    manorInteriorAccessAuthorized: false,
    distantTraversalAuthorized: false,
    runtimeActivationClaim: false,
    rendererActivationClaim: false,
    canvasActivationClaim: false,
    webglActivationClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionDeploymentClaim: false,
    matrixCollapse: false,
  }),

  allowedActions: Object.freeze([
    "Inspect Ground",
  ]),

  blockedActions: Object.freeze([
    "Enter Manor Interior",
    "Traverse Distant World",
    "Start Open World Movement",
    "Start Survival Simulation",
    "Activate Renderer",
    "Claim Visual Pass",
    "Claim Validation",
  ]),
});

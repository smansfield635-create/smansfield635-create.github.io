/**
 * h-earth.receipts.js
 *
 * DGB H-Earth Scratch Rebuild
 * Room 2 — Manifest / State / Receipts Lane
 *
 * Purpose:
 * Defines bounded receipt structures for the first H-Earth ground inspection
 * action and the non-rendering test harness receipt.
 *
 * Boundary:
 * These receipts are GitHub-ready raw source bodies only.
 * They do not claim execution, validation, rendering, route integration,
 * production readiness, open-world traversal, or survival simulation.
 */

export const H_EARTH_GROUND_INSPECTION_RECEIPT = Object.freeze({
  receiptType: 'H_EARTH_GROUND_INSPECTION_RECEIPT',

  activeMatrix: 'H-Earth',
  activeMatrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  previousState: 'H_EARTH_GROUND_VIEW_ACTIVE',
  newState: 'H_EARTH_SURFACE_INSPECTION_ACTIVE',

  userAction: 'Inspect Ground',
  readoutReturned: 'Ground Condition Read',

  primaryFocusTarget: 'OBJ_002_FOREGROUND_WET_SAND',
  supportingInspectionTargets: Object.freeze([
    'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
    'OBJ_010_SMALL_BEACH_STONES',
    'OBJ_011_FOREGROUND_JAGGED_ROCKS',
    'OBJ_005_SHORELINE_FOAM_LINE'
  ]),

  matrixSeparation: Object.freeze({
    hEarth: 'Ground-View Matrix',
    hearth: 'support/control context only',
    audralia: 'planetary-world context only',
    matrixSeparationPreserved: true,
    matrixCollapse: false
  }),

  claimBoundary: Object.freeze({
    githubInstallationClaim: false,
    publicRouteIntegrationClaim: false,
    runtimeActivationClaim: false,
    rendererActivationClaim: false,
    canvasActivationClaim: false,
    webglActivationClaim: false,
    visualPassClaim: false,
    validationClaimUpgrade: false,
    productionDeploymentClaim: false,
    openWorldExpansionClaim: false,
    survivalSimulationClaim: false,
    manorInteriorClaim: false,
    distantTraversalClaim: false
  })
});

export const H_EARTH_NON_RENDERING_TEST_HARNESS_RECEIPT = Object.freeze({
  receiptType: 'H_EARTH_NON_RENDERING_TEST_HARNESS_RECEIPT',

  activeMatrix: 'H-Earth',
  activeMatrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  manifestLoaded: true,
  matrixLoaded: true,
  stateModelLoaded: true,
  cell001Loaded: true,
  objectsLoaded: true,
  zonesLoaded: true,
  inspectGroundAvailable: true,
  groundConditionReadReturned: true,
  groundInspectionReceiptReturned: true,
  matrixBoundariesPreserved: true,
  renderPlaceholderInactive: true,
  deferredClaimsRemainFalse: true,

  claimBoundary: Object.freeze({
    githubInstallationClaim: false,
    publicRouteIntegrationClaim: false,
    runtimeActivationClaim: false,
    rendererActivationClaim: false,
    canvasActivationClaim: false,
    webglActivationClaim: false,
    visualPassClaim: false,
    validationClaimUpgrade: false,
    productionDeploymentClaim: false,
    openWorldExpansionClaim: false,
    survivalSimulationClaim: false,
    manorInteriorClaim: false,
    distantTraversalClaim: false
  })
});

export const H_EARTH_RECEIPTS = Object.freeze({
  H_EARTH_GROUND_INSPECTION_RECEIPT,
  H_EARTH_NON_RENDERING_TEST_HARNESS_RECEIPT
});

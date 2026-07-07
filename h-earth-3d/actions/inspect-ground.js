/**
 * DGB H-Earth Scratch Rebuild — Room 4 Raw Source File
 * File: h-earth-3d/actions/inspect-ground.js
 * Step: 016B base-path correction / GitHub-ready raw file reissue only.
 *
 * Boundary:
 * - No GitHub installation by this file body.
 * - No public route integration by this file body.
 * - No runtime activation by this file body.
 * - No renderer/canvas/WebGL activation by this file body.
 * - No visual-pass claim.
 * - No validation claim.
 * - No open-world expansion.
 * - No survival simulation.
 * - No manor interior access.
 * - No distant traversal.
 * - No persistent save logic.
 */

export const H_EARTH_INSPECT_GROUND_TARGETS = Object.freeze({
  primaryFocusTarget: 'OBJ_002_FOREGROUND_WET_SAND',
  supportingInspectionTargets: Object.freeze([
    'OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES',
    'OBJ_010_SMALL_BEACH_STONES',
    'OBJ_011_FOREGROUND_JAGGED_ROCKS',
    'OBJ_005_SHORELINE_FOAM_LINE',
  ]),
});

export const H_EARTH_INSPECT_GROUND_ACTION = Object.freeze({
  actionId: 'H_EARTH_INSPECT_GROUND_ACTION',
  actionLabel: 'Inspect Ground',
  actionRole: 'FIRST_GROUND_VIEW_ACTION',

  activeMatrix: 'H-Earth',
  activeMatrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  primaryFocusTarget: H_EARTH_INSPECT_GROUND_TARGETS.primaryFocusTarget,
  supportingInspectionTargets: H_EARTH_INSPECT_GROUND_TARGETS.supportingInspectionTargets,

  outputReadout: 'Ground Condition Read',
  outputReceipt: 'H_EARTH_GROUND_INSPECTION_RECEIPT',

  actionScope: 'BOUNDED_ENVIRONMENTAL_GROUND_INSPECTION_ONLY',

  statePath: Object.freeze({
    previousState: 'H_EARTH_GROUND_VIEW_ACTIVE',
    newState: 'H_EARTH_SURFACE_INSPECTION_ACTIVE',
  }),

  boundaries: Object.freeze({
    rawDriveScratchFileOnly: false,
    githubReadySourceBodyOnly: true,

    runtimeActionExecutionClaim: false,
    gameplayExecutionClaim: false,
    survivalScoreClaim: false,
    healthScoreClaim: false,
    empiricalDiagnosisClaim: false,
    rendererStatusClaim: false,
    visualPassStatusClaim: false,
    validationStatusClaim: false,
    openWorldScanClaim: false,
    manorInteriorAccessClaim: false,
    distantTraversalClaim: false,
    persistentSaveLogic: false,
    routeIntegration: false,
    githubInstallation: false,
    matrixCollapse: false,
  }),
});

export default H_EARTH_INSPECT_GROUND_ACTION;

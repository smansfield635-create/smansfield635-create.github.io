/**
 * DGB_H_EARTH_SCRATCH_REBUILD — Room 5
 * File: h-earth-3d/boundaries/matrix-boundaries.js
 *
 * Status:
 * GitHub-ready raw JavaScript source body.
 * Manual installation only.
 * No GitHub installation performed by this output.
 * No public route integration.
 * No runtime activation.
 * No renderer / canvas / WebGL activation.
 * No visual-pass claim.
 * No validation claim.
 * No open-world expansion.
 * No survival simulation.
 *
 * Purpose:
 * Define explicit matrix and scope boundaries for H_EARTH_GROUND_CELL_001.
 */

export const H_EARTH_DEFERRED_CLAIMS = Object.freeze({
  room5DoesNotAuthorizeCodeConstructionBeyondItsLane: true,
  room5DoesNotAuthorizeRawFileConstructionBeyondItsLane: true,
  githubInstallation: false,
  publicRouteIntegration: false,
  runtimeActivation: false,
  rendererActivation: false,
  canvasActivation: false,
  webglActivation: false,
  visualPassClaim: false,
  validationClaimUpgrade: false,
  productionReadinessClaim: false,
  deploymentReadinessClaim: false,
  openWorldExpansion: false,
  openWorldTraversal: false,
  survivalSimulation: false,
  manorInteriorAccess: false,
  distantTraversal: false,
  swimming: false,
  waterTraversal: false,
  fluidSimulation: false,
  matrixCollapse: false
});

export const H_EARTH_SCOPE_BOUNDARIES = Object.freeze({
  project: "DGB_H_EARTH_SCRATCH_REBUILD",
  matrix: "H-Earth",
  matrixRole: "Ground-View Matrix",
  activeCell: "H_EARTH_GROUND_CELL_001",
  sceneIdentity: "earth-water-air-survival-shoreline-manor",

  allowed: Object.freeze({
    hEarthGroundViewMatrix: true,
    boundedLocalInspection: true,
    inspectGroundAction: true,
    groundConditionReadout: true,
    groundInspectionReceipt: true,
    manorExteriorContextVisible: true,
    distantWorldContextVisible: true,
    waterSurfaceContextVisible: true,
    renderPlaceholderAsFuturePositionMarker: true
  }),

  prohibited: Object.freeze({
    hEarthBecomesHearth: true,
    hearthBecomesHEarth: true,
    audraliaBecomesHEarth: true,
    localInspectionAuthorizesWorldTraversal: true,
    manorExteriorAuthorizesInterior: true,
    distantWorldContextAuthorizesTraversal: true,
    waterSurfaceContextAuthorizesSwimming: true,
    waterSurfaceContextAuthorizesFluidSimulation: true,
    waterSurfaceContextAuthorizesWaterTraversal: true,
    routeIntegration: true,
    runtimeActivation: true,
    rendererActivation: true,
    canvasActivation: true,
    webglActivation: true,
    visualPassClaim: true,
    validationClaimUpgrade: true,
    openWorldExpansion: true,
    survivalSimulation: true
  })
});

export const H_EARTH_MATRIX_BOUNDARIES = Object.freeze({
  hEarth: Object.freeze({
    role: "Ground-View Matrix",
    owns: Object.freeze([
      "H_EARTH_GROUND_CELL_001",
      "bounded local ground-view inspection",
      "Inspect Ground",
      "Ground Condition Read",
      "H_EARTH_GROUND_INSPECTION_RECEIPT"
    ]),
    mayNotBecome: Object.freeze([
      "Hearth support/control context",
      "Audralia planetary-world context",
      "open-world traversal authority",
      "survival simulation authority",
      "renderer proof",
      "validation proof"
    ])
  }),

  hearth: Object.freeze({
    role: "support/control context only",
    visibleAs: Object.freeze([
      "OBJ_009_MANOR_EXTERIOR_CONTEXT",
      "manor exterior/support presence"
    ]),
    mayNotBecome: Object.freeze([
      "H-Earth Ground-View Matrix",
      "H-Earth terrain system",
      "H-Earth local surface system",
      "H-Earth action owner",
      "manor interior access authority"
    ])
  }),

  audralia: Object.freeze({
    role: "planetary-world context only",
    visibleAs: Object.freeze([
      "OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS",
      "distant planetary-world context",
      "horizon/coastline continuity"
    ]),
    mayNotBecome: Object.freeze([
      "H-Earth Ground-View Matrix",
      "H_EARTH_GROUND_CELL_001",
      "active traversal authority",
      "open-world authority"
    ])
  }),

  objectScope: Object.freeze({
    primaryInspectionTarget: "OBJ_002_FOREGROUND_WET_SAND",
    supportingInspectionTargets: Object.freeze([
      "OBJ_004_TIDE_POOLS_AND_REFLECTIVE_PUDDLES",
      "OBJ_010_SMALL_BEACH_STONES",
      "OBJ_011_FOREGROUND_JAGGED_ROCKS",
      "OBJ_005_SHORELINE_FOAM_LINE"
    ]),
    contextOnlyObjects: Object.freeze({
      manorExterior: "OBJ_009_MANOR_EXTERIOR_CONTEXT",
      distantWorld: "OBJ_012_DISTANCE_ROCK_STACKS_AND_ISLETS"
    })
  }),

  zoneScope: Object.freeze({
    foregroundInspection: "bounded local inspection only",
    shorelineContact: "local and non-simulated",
    waterSurface: "context only; no swimming, traversal, or fluid simulation",
    manorContext: "exterior support/control context only; no interior access",
    distantWorldContext: "visual/contextual only; no traversal authority"
  }),

  actionReadoutScope: Object.freeze({
    firstAction: "Inspect Ground",
    firstReadout: "Ground Condition Read",
    firstReceipt: "H_EARTH_GROUND_INSPECTION_RECEIPT",
    prohibitedOutputs: Object.freeze([
      "survival score",
      "health score",
      "empirical diagnosis",
      "renderer status",
      "visual-pass status",
      "validation status",
      "open-world scan",
      "persistent save state"
    ])
  }),

  deferredClaims: H_EARTH_DEFERRED_CLAIMS,
  scopeBoundaries: H_EARTH_SCOPE_BOUNDARIES,

  matrixSeparationPreserved: true,
  matrixCollapse: false
});

/**
 * Contract-level boundary read.
 * This function has no side effects and performs no runtime, route, renderer,
 * canvas, WebGL, validation, or production activation.
 */
export function getHEarthMatrixBoundaryReadout() {
  return Object.freeze({
    receiptType: "H_EARTH_MATRIX_BOUNDARY_READOUT",
    activeMatrix: "H-Earth",
    activeMatrixRole: "Ground-View Matrix",
    hearthContext: "SUPPORT_CONTROL_CONTEXT_ONLY",
    audraliaContext: "PLANETARY_WORLD_CONTEXT_ONLY",
    matrixSeparationPreserved: H_EARTH_MATRIX_BOUNDARIES.matrixSeparationPreserved,
    matrixCollapse: H_EARTH_MATRIX_BOUNDARIES.matrixCollapse,
    deferredClaims: H_EARTH_DEFERRED_CLAIMS
  });
}

/**
 * Contract-level guard for Room 6 or later static review.
 * Returns false if a proposed claim would breach Room 5 boundaries.
 */
export function isHEarthBoundaryClaimAllowed(claimName) {
  if (!claimName || typeof claimName !== "string") return false;

  const blockedClaims = new Set([
    "githubInstallation",
    "publicRouteIntegration",
    "runtimeActivation",
    "rendererActivation",
    "canvasActivation",
    "webglActivation",
    "visualPassClaim",
    "validationClaimUpgrade",
    "productionReadinessClaim",
    "deploymentReadinessClaim",
    "openWorldExpansion",
    "openWorldTraversal",
    "survivalSimulation",
    "manorInteriorAccess",
    "distantTraversal",
    "swimming",
    "waterTraversal",
    "fluidSimulation",
    "matrixCollapse"
  ]);

  return !blockedClaims.has(claimName);
}

export default H_EARTH_MATRIX_BOUNDARIES;

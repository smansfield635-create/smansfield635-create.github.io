/**
 * /showroom/globe/h-earth/capacity.js
 * COMPLETE RENEWED FILE
 *
 * H_EARTH_3D_CAPACITY_FILE_RENEWAL_STEP_034O_PRECHECK_EXECUTION_CORRIDOR_v1
 *
 * Layer:
 * H-Earth Layer 4 · Showroom Execution Corridor
 *
 * Purpose:
 * Define the bounded execution capacity available to the renewed H-Earth
 * public-stage corridor for Ground Cell 001.
 *
 * Controlling source truth:
 * - Layers 1–3 of the current H-Earth architecture.
 * - Accepted Path 3 → /h-earth-3d/ binding chain.
 * - H_EARTH_REGION_CELL_X07_Z08 → H_EARTH_GROUND_CELL_001.
 * - Step 034I boundaries.
 * - Step 034J objects.
 * - Step 034K zones.
 * - Step 034L landscape lattice.
 *
 * This file owns:
 * - Layer 4 execution-capacity boundaries.
 * - Binding identity projection into Layer 4.
 * - Public-stage local bounds.
 * - Viewport and camera capacity.
 * - DOM/CSS3D stage limits.
 * - Node and primitive budgets.
 * - Interaction-capacity boundaries.
 * - Actor-candidate limits.
 * - Mount eligibility.
 * - Conservative claim ceilings.
 *
 * This file does not own:
 * - Path 3 spatial authority.
 * - Matrix authority.
 * - Ground Cell source truth.
 * - Environment construction.
 * - Scene composition.
 * - Renderer geometry.
 * - DOM creation or mounting.
 * - Camera input or controller behavior.
 * - Actor creation.
 * - Collision.
 * - Ground contact.
 * - Traversal.
 * - Gameplay.
 * - Runtime activation.
 * - Visual, validation, or production approval.
 */

export const H_EARTH_3D_CAPACITY_CONTRACT_ID =
  'H_EARTH_3D_CAPACITY_FILE_RENEWAL_STEP_034O_PRECHECK_EXECUTION_CORRIDOR_v1';

export const H_EARTH_3D_CAPACITY_SCHEMA_VERSION = 1;

const deepFreeze = (value) => {
  if (
    value === null ||
    typeof value !== 'object' ||
    Object.isFrozen(value)
  ) {
    return value;
  }

  for (const nestedValue of Object.values(value)) {
    deepFreeze(nestedValue);
  }

  return Object.freeze(value);
};

const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));

const isFiniteNumber = (value) =>
  typeof value === 'number' && Number.isFinite(value);

const createCapacityError = (code, message, details = null) =>
  deepFreeze({
    code,
    message,
    details
  });

/**
 * Stable public-stage compatibility surfaces.
 *
 * These IDs are retained as route and integration surfaces only.
 * Their presence here does not prove that corresponding DOM elements exist.
 */
export const H_EARTH_3D_PUBLIC_STAGE_IDS = deepFreeze({
  routeRootId: 'h-earth-3d-route-root',
  rendererMountId: 'h-earth-3d-renderer-mount',
  statusId: 'h-earth-3d-status',
  fallbackId: 'h-earth-3d-fallback',
  hudId: 'h-earth-3d-hud',
  inspectionPanelId: 'h-earth-3d-inspection-panel'
});

/**
 * Accepted binding identity projected into the renewed Layer 4 corridor.
 *
 * This is a record of admitted upstream identity.
 * It does not recreate or supersede matrix, region, or cell authority.
 */
export const H_EARTH_3D_CAPACITY_BINDING_IDENTITY = deepFreeze({
  matrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',

  activeCell: 'H_EARTH_GROUND_CELL_001',
  domainCellId: 'H_EARTH_GROUND_CELL_001',
  spatialCellId: 'H_EARTH_REGION_CELL_X07_Z08',

  bindingExpression:
    'H_EARTH_REGION_CELL_X07_Z08 → H_EARTH_GROUND_CELL_001',

  sceneIdentity:
    'earth-water-air-survival-shoreline-manor',

  bindingSource: deepFreeze({
    path3DomainConsumerPreflight:
      '/showroom/globe/h-earth/region-domain-consumer-preflight.js',

    matrix:
      '/h-earth-3d/h-earth.matrix.js',

    groundCell:
      '/h-earth-3d/cells/ground-cell-001.js',

    familyIntegrity:
      '/h-earth-3d/h-earth.integrity.js'
  }),

  bindingChainAcceptedForSourceIdentity: true,

  rendererPreflightCompleted: false,
  rendererExecutionAuthorized: false,
  runtimeActivationAuthorized: false,

  descriptorOnly: true
});

/**
 * Current controlling source references.
 *
 * These records identify the source-spine authorities that downstream Layer 4
 * files must consume. This file does not execute or validate those modules.
 */
export const H_EARTH_3D_CAPACITY_SOURCE_REFERENCES = deepFreeze({
  controllingArchitecture: deepFreeze({
    layers1To3Accepted: true,
    layer4RenewalRequired: true,
    oldLayer4ControllingAuthority: false
  }),

  path3BindingChain: deepFreeze({
    status: 'ACCEPTED_FOR_SOURCE_CHAIN',
    rendererPreflightStatus: 'NOT_COMPLETE',
    layer4ExecutionHandoffStatus: 'IN_RENEWAL'
  }),

  publicStageSourceSpine: deepFreeze({
    step034I: deepFreeze({
      role: 'BOUNDARIES',
      path: '/h-earth-3d/boundaries/',
      requiredByEnvironmentRenewal: true
    }),

    step034J: deepFreeze({
      role: 'OBJECTS',
      path: '/h-earth-3d/objects/',
      requiredByEnvironmentRenewal: true
    }),

    step034K: deepFreeze({
      role: 'ZONES',
      path: '/h-earth-3d/zones/',
      requiredByEnvironmentRenewal: true
    }),

    step034L: deepFreeze({
      role: 'LANDSCAPE_LATTICE',
      path:
        '/h-earth-3d/zones/ground-cell-001.landscape-lattice.js',
      requiredByEnvironmentRenewal: true
    })
  }),

  implementationPatternPolicy: deepFreeze({
    workingWebsiteCodeMayGuideTechnique: true,
    workingWebsiteCodeMayReplaceHEarthTruth: false,

    legacyHEarthLayer4MayProvide: deepFreeze([
      'stable-public-ids',
      'route-hooks',
      'compatibility-export-names',
      'status-readout-hooks',
      'fallback-hooks',
      'h-earth-local-naming',
      'claim-ceiling-language'
    ]),

    legacyHEarthLayer4MayControlArchitecture: false
  })
});

/**
 * Boundary flags for the renewed Layer 4 capacity corridor.
 */
export const H_EARTH_3D_CAPACITY_BOUNDARY_FLAGS = deepFreeze({
  ownsExecutionCapacity: true,

  ownsEnvironmentContent: false,
  ownsSceneComposition: false,
  ownsRendererGeometry: false,
  ownsCameraController: false,
  ownsRouteBootstrap: false,
  ownsDiagnosticJudgment: false,

  createsDOM: false,
  mutatesDOM: false,
  mountsRenderer: false,
  mountsController: false,

  createsActor: false,
  createsCollisionSystem: false,
  createsGroundContactSystem: false,
  createsTraversalSystem: false,
  createsInventorySystem: false,
  createsGameplayLoop: false,
  createsFluidSimulation: false,

  createsPath3Authority: false,
  createsMatrixAuthority: false,
  createsCellAuthority: false,
  createsBoundaryAuthority: false,
  createsObjectAuthority: false,
  createsZoneAuthority: false,
  createsLandscapeLatticeAuthority: false,

  openWorldAuthorized: false,
  distantTraversalAuthorized: false,
  manorInteriorAuthorized: false,
  swimmingAuthorized: false,

  canvasAuthorized: false,
  webGLAuthorized: false,
  iframeAuthorized: false,
  svgDependencyAuthorized: false,

  matrixCollapse: false
});

/**
 * Public-stage local execution volume.
 *
 * This is a Layer 4 local projection frame for the bounded Ground Cell 001
 * scene. It does not redefine the global Path 3 coordinate constitution.
 *
 * Environment renewal may place admitted scene descriptors inside this local
 * capacity. Any global-to-local normalization must remain traceable to the
 * accepted Ground Cell binding.
 */
export const H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS = deepFreeze({
  coordinateFrame: 'H_EARTH_GROUND_CELL_001_PUBLIC_STAGE_LOCAL',

  authorityClass: 'LAYER_4_EXECUTION_CAPACITY_ONLY',

  axisVocabulary: deepFreeze({
    x: deepFreeze({
      meaning: 'lateral',
      negativeDirection: 'west-left',
      positiveDirection: 'east-right'
    }),

    y: deepFreeze({
      meaning: 'elevation',
      zeroMeaning: 'local-ground-datum',
      negativeDirection: 'below-local-ground-datum',
      positiveDirection: 'above-local-ground-datum'
    }),

    z: deepFreeze({
      meaning: 'ground-view-depth',
      negativeDirection: 'camera-near-field',
      positiveDirection: 'forward-far-field'
    })
  }),

  bounds: deepFreeze({
    xMin: -16,
    xMax: 16,

    yMin: -4,
    yMax: 20,

    zMin: -4,
    zMax: 28
  }),

  span: deepFreeze({
    widthX: 32,
    heightY: 24,
    depthZ: 32
  }),

  localGroundDatumY: 0,

  initialEnvironmentCandidateEnvelope: deepFreeze({
    foregroundZMin: -2,
    foregroundZMax: 8,

    shorelineCandidateZMin: 8,
    shorelineCandidateZMax: 14,

    nearshoreWaterCandidateZMin: 12,
    nearshoreWaterCandidateZMax: 19,

    distantContextCandidateZMin: 18,
    distantContextCandidateZMax: 28
  }),

  traversalCapacity: deepFreeze({
    boundedGroundCellOnly: true,
    openWorld: false,
    adjacentCellCrossing: false,
    distantTraversal: false,
    manorInterior: false,
    waterTraversal: false
  }),

  normalizationPolicy: deepFreeze({
    mayNormalizeUpstreamCoordinatesForProjection: true,
    mustPreserveBindingIdentity: true,
    mayRedefinePath3Coordinates: false,
    mayRedefineLandscapeLattice: false,
    globalOriginResolutionDeferredToEnvironment: true
  })
});

/**
 * Viewport capacity for route-stage consumption.
 *
 * These values describe safe operating expectations. They do not inspect the
 * current viewport or create a resize observer.
 */
export const H_EARTH_3D_VIEWPORT_CAPACITY = deepFreeze({
  rendererMountId:
    H_EARTH_3D_PUBLIC_STAGE_IDS.rendererMountId,

  supportedStageMode: 'BOUNDED_RESPONSIVE_STAGE',

  minimumUsableViewport: deepFreeze({
    widthPx: 320,
    heightPx: 420
  }),

  preferredMinimumViewport: deepFreeze({
    widthPx: 360,
    heightPx: 540
  }),

  preferredDesignViewport: deepFreeze({
    widthPx: 1280,
    heightPx: 720
  }),

  supportedAspectRatio: deepFreeze({
    minimum: 0.56,
    maximum: 2.4
  }),

  preferredAspectRatio: deepFreeze({
    portrait: 9 / 16,
    landscape: 16 / 9
  }),

  pixelRatioCapacity: deepFreeze({
    minimum: 1,
    preferredMaximum: 2,
    hardMaximumForCapacityAccounting: 3
  }),

  resizePolicy: deepFreeze({
    responsiveProjectionExpected: true,
    rendererOwnsResizeObservation: false,
    controllerOwnsResizeObservation: false,
    routeOrMountCoordinatorMayOwnResizeObservation: true
  }),

  safeFallbackConditions: deepFreeze([
    'renderer-mount-element-missing',
    'viewport-width-below-minimum',
    'viewport-height-below-minimum',
    'invalid-aspect-ratio',
    'capacity-handoff-missing',
    'environment-handoff-missing',
    'compositor-handoff-missing',
    'renderer-construction-error'
  ])
});

/**
 * Camera capacity.
 *
 * This defines a static initial projection candidate and the limits within
 * which a later controller may operate. It does not create or update a camera.
 */
export const H_EARTH_3D_CAMERA_CAPACITY = deepFreeze({
  cameraModel: 'BOUNDED_GROUND_VIEW_PERSPECTIVE',

  initialProjectionCandidate: deepFreeze({
    position: deepFreeze({
      x: 0,
      y: 2.8,
      z: -3.5
    }),

    target: deepFreeze({
      x: 0,
      y: 0.8,
      z: 12
    }),

    up: deepFreeze({
      x: 0,
      y: 1,
      z: 0
    }),

    verticalFovDegrees: 52,
    nearPlane: 0.25,
    farPlane: 48
  }),

  futureControllerCapacity: deepFreeze({
    positionBounds: deepFreeze({
      xMin: -5,
      xMax: 5,

      yMin: 1.4,
      yMax: 6,

      zMin: -4,
      zMax: 5
    }),

    targetBounds: deepFreeze({
      xMin: -10,
      xMax: 10,

      yMin: -1,
      yMax: 8,

      zMin: 2,
      zMax: 24
    }),

    yawDegrees: deepFreeze({
      minimum: -38,
      maximum: 38,
      initial: 0
    }),

    pitchDegrees: deepFreeze({
      minimum: -24,
      maximum: 12,
      initial: -7
    }),

    verticalFovDegrees: deepFreeze({
      minimum: 38,
      maximum: 68,
      initial: 52
    }),

    zoomScale: deepFreeze({
      minimum: 0.72,
      maximum: 1.42,
      initial: 1
    })
  }),

  focusCandidateIds: deepFreeze([
    'GROUND',
    'INSPECTION_ANCHOR',
    'SHORELINE',
    'MANOR_CONTEXT',
    'OFFSHORE_CONTEXT'
  ]),

  controllerStatus: 'NOT_RENEWED_FOR_CURRENT_CORRIDOR',

  activeCameraControllerCreated: false,
  actorCameraCreated: false,
  actorCameraProven: false,
  cameraCollisionCreated: false
});

/**
 * Render-stage implementation limits.
 */
export const H_EARTH_3D_RENDER_STAGE_LIMITS = deepFreeze({
  permittedOutputModel: 'DOM_CSS3D_BOUNDED_STAGE',

  domAuthorized: true,
  cssAuthorized: true,
  cssTransformsAuthorized: true,
  cssClipPathAuthorized: true,
  cssGradientsAuthorized: true,
  cssPseudoElementsAuthorized: true,

  webGLAuthorized: false,
  canvasAuthorized: false,
  iframeAuthorized: false,

  svgDependencyAuthorized: false,
  svgDependencyMayBeAuthorizedLater: true,

  externalRenderEngineRequired: false,

  renderScope: deepFreeze({
    boundedGroundCell: true,
    environmentSubstrateFirst: true,
    minimalLocalDetails: true,
    simplifiedBackgroundContext: true,

    detailedObjectFieldDeferred: true,
    manorInteriorDeferred: true,
    actorRenderingDeferred: true,
    fluidSimulationDeferred: true
  }),

  rendererResponsibilitiesAllowed: deepFreeze([
    'consume-compositor-approved-descriptors',
    'consume-binding-aware-capacity',
    'consume-binding-aware-environment',
    'project-world-coordinates',
    'construct-projected-polygons',
    'materialize-dom-css3d',
    'resolve-camera-depth-order',
    'mount-owned-render-root',
    'destroy-owned-render-root',
    'emit-renderer-specific-receipt'
  ]),

  rendererResponsibilitiesForbidden: deepFreeze([
    'define-path3-spatial-authority',
    'define-matrix-authority',
    'define-ground-cell-authority',
    'define-landscape-lattice-authority',
    'invent-environmental-meaning',
    'invent-semantic-scene-order',
    'control-camera-input',
    'claim-ground-contact',
    'claim-collision',
    'claim-playable-environment',
    'claim-visual-pass',
    'claim-validation',
    'claim-production'
  ])
});

/**
 * Node and primitive budgets.
 *
 * Budgets describe the maximum execution capacity available to the renewed
 * corridor. They do not require later files to consume the maximum.
 */
export const H_EARTH_3D_NODE_BUDGET = deepFreeze({
  semanticLayerContainers: deepFreeze({
    target: 15,
    warning: 16,
    maximum: 18
  }),

  environmentPrimitives: deepFreeze({
    target: 40,
    warning: 56,
    maximum: 72
  }),

  interactionNodes: deepFreeze({
    target: 2,
    warning: 4,
    maximum: 6
  }),

  diagnosticOwnedNodes: deepFreeze({
    target: 4,
    warning: 8,
    maximum: 12
  }),

  totalRendererOwnedNodes: deepFreeze({
    target: 58,
    warning: 76,
    maximum: 96
  }),

  primitiveTierTargets: deepFreeze({
    environmentSubstrate: deepFreeze({
      target: 20,
      maximum: 28
    }),

    minimalGroundedDetails: deepFreeze({
      target: 12,
      maximum: 20
    }),

    simplifiedBackgroundContext: deepFreeze({
      target: 6,
      maximum: 12
    })
  }),

  warningPolicy: deepFreeze({
    warnWhenEnvironmentPrimitiveCountExceeds: 56,
    warnWhenTotalRendererOwnedNodeCountExceeds: 76,
    failClosedWhenTotalRendererOwnedNodeCountExceeds: 96
  }),

  budgetIsValidationProof: false,
  budgetIsPerformanceProof: false,
  budgetIsVisualProof: false
});

/**
 * Interaction capacity boundaries.
 */
export const H_EARTH_3D_INTERACTION_CAPACITY = deepFreeze({
  allowedIntents: deepFreeze([
    'INSPECT_GROUND',
    'FOCUS_GROUND',
    'FOCUS_SHORELINE',
    'FOCUS_MANOR_CONTEXT',
    'FOCUS_OFFSHORE_CONTEXT',
    'RESET_CAMERA'
  ]),

  inspectGround: deepFreeze({
    allowedAsDescriptorIntent: true,
    allowedAsReadoutIntent: true,

    maySampleCandidateGroundDescriptorLater: true,

    groundContactProof: false,
    collisionProof: false,
    gameplayProof: false
  }),

  cameraInputCapacity: deepFreeze({
    pointerInputMayBeAddedByController: true,
    touchInputMayBeAddedByController: true,
    keyboardInputMayBeAddedByController: true,

    activeInputOwnedHere: false
  }),

  forbiddenSystems: deepFreeze({
    gameplayLoop: true,
    inventory: true,
    movementSystem: true,
    collisionSystem: true,
    physicsSystem: true,
    survivalSimulation: true,
    swimmingSystem: true,
    fluidSimulation: true,
    combatSystem: true,
    persistenceSystem: true
  })
});

/**
 * Actor-candidate limits.
 */
export const H_EARTH_3D_ACTOR_CANDIDATE_LIMITS = deepFreeze({
  actorProxyCreated: false,
  actorCapsuleCreated: false,

  groundContactSystemCreated: false,
  collisionSystemCreated: false,
  movementSystemCreated: false,

  actorReadyGroundStatus: 'NOT_YET_DEFINED',

  futureCandidateEnvelope: deepFreeze({
    xMin: -8,
    xMax: 8,

    zMin: 0,
    zMax: 10,

    minimumCandidateClearanceY: 1.8
  }),

  futureActorCapacity: deepFreeze({
    maximumCandidateRadius: 0.45,
    maximumCandidateHeight: 1.9,
    maximumCandidateStepHeight: 0.3,
    maximumCandidateSlopeDegrees: 8
  }),

  restrictions: deepFreeze({
    actorMayNotEnterWater: true,
    actorMayNotEnterManor: true,
    actorMayNotLeaveGroundCell: true,
    actorMayNotCrossUnprovenGround: true
  }),

  actorReadyGroundMayBecomeCandidateLater: true,

  actorReadyGroundProven: false,
  groundContactProven: false,
  collisionProven: false,
  traversalProven: false
});

/**
 * Claim ceilings apply to this file and all direct interpretations of its
 * receipt.
 */
export const H_EARTH_3D_CAPACITY_CLAIM_CEILINGS = deepFreeze({
  runtimeActivationClaim: false,
  rendererPassClaim: false,
  visualPassClaim: false,
  playableEnvironmentClaim: false,
  validationClaim: false,
  productionClaim: false,

  groundContactClaim: false,
  collisionClaim: false,
  traversalClaim: false,
  actorClaim: false,
  gameplayClaim: false,

  matrixCollapse: false
});

/**
 * Mount eligibility.
 *
 * Renderer mounting remains ineligible until the renewed environment and
 * compositor handoffs exist and a renderer preflight evaluates them.
 */
export const H_EARTH_3D_MOUNT_ELIGIBILITY = deepFreeze({
  capacityContractPresent: true,

  capacityRenewalStatus: 'DEFINED_BY_CURRENT_FILE',
  environmentRenewalStatus: 'REQUIRED_NOT_YET_CONFIRMED',
  compositorRenewalStatus: 'REQUIRED_NOT_YET_CONFIRMED',
  rendererRenewalStatus: 'HELD',
  controllerRenewalStatus: 'HELD',

  rendererPreflightStatus: 'NOT_COMPLETE',

  rendererMayMount: false,
  controllerMayMount: false,

  requiredBeforeRendererMount: deepFreeze([
    'capacity-contract-admitted',
    'binding-aware-environment-handoff-present',
    'binding-aware-compositor-handoff-present',
    'compositor-layer-order-present',
    'renderer-preflight-pass-or-explicit-candidate-admission',
    'renderer-mount-element-present',
    'viewport-capacity-satisfied'
  ]),

  currentBlockingReasons: deepFreeze([
    'environment-renewal-not-yet-confirmed',
    'compositor-renewal-not-yet-confirmed',
    'renderer-preflight-not-complete',
    'renderer-renewal-held'
  ]),

  publicStatusPolicy: deepFreeze({
    incompleteHandoffMustDowngradeStatus: true,

    permittedStatus:
      'Layer 4 capacity defined. Environment and compositor handoff pending. Renderer preflight incomplete.',

    forbiddenStatusClaims: deepFreeze([
      'renderer-ready',
      'renderer-passed',
      'visual-pass',
      'playable',
      'validated',
      'production-ready'
    ])
  })
});

/**
 * Complete capacity contract.
 */
export const H_EARTH_3D_CAPACITY_CONTRACT = deepFreeze({
  contractId:
    H_EARTH_3D_CAPACITY_CONTRACT_ID,

  schemaVersion:
    H_EARTH_3D_CAPACITY_SCHEMA_VERSION,

  file:
    '/showroom/globe/h-earth/capacity.js',

  layer:
    'H_EARTH_LAYER_4_SHOWROOM_EXECUTION_CORRIDOR',

  role:
    'GROUND_CELL_001_EXECUTION_CAPACITY_AUTHORITY',

  status:
    'CURRENT_ROLE_RENEWAL_CANDIDATE',

  bindingIdentity:
    H_EARTH_3D_CAPACITY_BINDING_IDENTITY,

  sourceReferences:
    H_EARTH_3D_CAPACITY_SOURCE_REFERENCES,

  publicStageIds:
    H_EARTH_3D_PUBLIC_STAGE_IDS,

  worldBounds:
    H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS,

  viewportCapacity:
    H_EARTH_3D_VIEWPORT_CAPACITY,

  cameraCapacity:
    H_EARTH_3D_CAMERA_CAPACITY,

  renderStageLimits:
    H_EARTH_3D_RENDER_STAGE_LIMITS,

  nodeBudget:
    H_EARTH_3D_NODE_BUDGET,

  interactionCapacity:
    H_EARTH_3D_INTERACTION_CAPACITY,

  actorCandidateLimits:
    H_EARTH_3D_ACTOR_CANDIDATE_LIMITS,

  mountEligibility:
    H_EARTH_3D_MOUNT_ELIGIBILITY,

  boundaryFlags:
    H_EARTH_3D_CAPACITY_BOUNDARY_FLAGS,

  claimCeilings:
    H_EARTH_3D_CAPACITY_CLAIM_CEILINGS
});

/**
 * Static receipt.
 *
 * This receipt reports what the file defines. It does not report repository
 * installation, import resolution, route execution, or visual inspection.
 */
export const H_EARTH_3D_CAPACITY_RECEIPT = deepFreeze({
  receiptType:
    'H_EARTH_3D_CAPACITY_EXECUTION_CORRIDOR_RECEIPT',

  contractId:
    H_EARTH_3D_CAPACITY_CONTRACT_ID,

  file:
    '/showroom/globe/h-earth/capacity.js',

  layer4CapacityDefined: true,

  acceptedBindingIdentityRecorded: true,
  currentSourceSpineReferenced: true,

  executionCapacityDefined: true,
  environmentContentDefined: false,
  semanticCompositionDefined: false,
  rendererGeometryDefined: false,
  controllerBehaviorDefined: false,

  publicStageWorldBoundsDefined: true,
  viewportCapacityDefined: true,
  cameraCapacityDefined: true,
  renderStageLimitsDefined: true,
  nodeBudgetDefined: true,
  interactionCapacityDefined: true,
  actorCandidateLimitsDefined: true,

  rendererPreflightStatus:
    H_EARTH_3D_MOUNT_ELIGIBILITY.rendererPreflightStatus,

  rendererMayMount:
    H_EARTH_3D_MOUNT_ELIGIBILITY.rendererMayMount,

  nextRequired:
    'RENEW_ENVIRONMENT_JS_FROM_CURRENT_CAPACITY_AND_ACCEPTED_SOURCE_TRUTH',

  repositoryInstallationVerified: false,
  importResolutionVerified: false,
  moduleGraphExecutionVerified: false,
  routeMountVerified: false,
  rendererMountVerified: false,
  visualOutputInspected: false,

  ...H_EARTH_3D_CAPACITY_CLAIM_CEILINGS
});

/**
 * Returns the immutable renewed capacity contract.
 */
export function getHEarth3DCapacityContract() {
  return H_EARTH_3D_CAPACITY_CONTRACT;
}

/**
 * Returns the immutable static capacity receipt.
 */
export function getHEarth3DCapacityReceipt() {
  return H_EARTH_3D_CAPACITY_RECEIPT;
}

/**
 * Returns the public-stage local execution bounds.
 */
export function getHEarth3DPublicStageWorldBounds() {
  return H_EARTH_3D_PUBLIC_STAGE_WORLD_BOUNDS;
}

/**
 * Returns responsive viewport capacity.
 */
export function getHEarth3DViewportCapacity() {
  return H_EARTH_3D_VIEWPORT_CAPACITY;
}

/**
 * Returns static and future-controller camera capacity.
 */
export function getHEarth3DCameraCapacity() {
  return H_EARTH_3D_CAMERA_CAPACITY;
}

/**
 * Returns the permitted render-stage implementation limits.
 */
export function getHEarth3DRenderStageLimits() {
  return H_EARTH_3D_RENDER_STAGE_LIMITS;
}

/**
 * Returns Layer 4 node and primitive budgets.
 */
export function getHEarth3DNodeBudget() {
  return H_EARTH_3D_NODE_BUDGET;
}

/**
 * Returns permitted and prohibited interaction capacity.
 */
export function getHEarth3DInteractionCapacity() {
  return H_EARTH_3D_INTERACTION_CAPACITY;
}

/**
 * Returns actor-candidate limits without creating an actor.
 */
export function getHEarth3DActorCandidateLimits() {
  return H_EARTH_3D_ACTOR_CANDIDATE_LIMITS;
}

/**
 * Returns the current renderer/controller mount eligibility state.
 */
export function getHEarth3DMountEligibility() {
  return H_EARTH_3D_MOUNT_ELIGIBILITY;
}

/**
 * Evaluates viewport measurements against the renewed capacity contract.
 *
 * This function does not read the browser viewport itself.
 */
export function evaluateHEarth3DViewportCapacity({
  widthPx,
  heightPx,
  pixelRatio = 1
} = {}) {
  if (
    !isFiniteNumber(widthPx) ||
    !isFiniteNumber(heightPx) ||
    !isFiniteNumber(pixelRatio)
  ) {
    return deepFreeze({
      eligible: false,
      status: 'INVALID_VIEWPORT_INPUT',

      errors: deepFreeze([
        createCapacityError(
          'INVALID_VIEWPORT_MEASUREMENT',
          'Viewport width, height, and pixel ratio must be finite numbers.'
        )
      ]),

      receiptClaim: 'CAPACITY_EVALUATION_ONLY'
    });
  }

  const width = Math.max(0, widthPx);
  const height = Math.max(0, heightPx);
  const safePixelRatio = clamp(
    pixelRatio,
    0,
    H_EARTH_3D_VIEWPORT_CAPACITY
      .pixelRatioCapacity
      .hardMaximumForCapacityAccounting
  );

  const aspectRatio =
    height > 0
      ? width / height
      : 0;

  const minimum =
    H_EARTH_3D_VIEWPORT_CAPACITY.minimumUsableViewport;

  const aspect =
    H_EARTH_3D_VIEWPORT_CAPACITY.supportedAspectRatio;

  const errors = [];

  if (width < minimum.widthPx) {
    errors.push(
      createCapacityError(
        'VIEWPORT_WIDTH_BELOW_MINIMUM',
        `Viewport width must be at least ${minimum.widthPx}px.`,
        deepFreeze({
          received: width,
          required: minimum.widthPx
        })
      )
    );
  }

  if (height < minimum.heightPx) {
    errors.push(
      createCapacityError(
        'VIEWPORT_HEIGHT_BELOW_MINIMUM',
        `Viewport height must be at least ${minimum.heightPx}px.`,
        deepFreeze({
          received: height,
          required: minimum.heightPx
        })
      )
    );
  }

  if (
    aspectRatio < aspect.minimum ||
    aspectRatio > aspect.maximum
  ) {
    errors.push(
      createCapacityError(
        'VIEWPORT_ASPECT_OUTSIDE_CAPACITY',
        'Viewport aspect ratio is outside the supported capacity range.',
        deepFreeze({
          received: aspectRatio,
          minimum: aspect.minimum,
          maximum: aspect.maximum
        })
      )
    );
  }

  return deepFreeze({
    eligible: errors.length === 0,

    status:
      errors.length === 0
        ? 'VIEWPORT_WITHIN_CAPACITY'
        : 'VIEWPORT_REQUIRES_FALLBACK',

    measurements: deepFreeze({
      widthPx: width,
      heightPx: height,
      aspectRatio,
      pixelRatio: safePixelRatio
    }),

    errors: deepFreeze(errors),

    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false
  });
}

/**
 * Evaluates a candidate renderer-owned node count.
 *
 * This is capacity accounting only. It is not a performance test.
 */
export function evaluateHEarth3DNodeBudget({
  semanticLayerContainers = 0,
  environmentPrimitives = 0,
  interactionNodes = 0,
  diagnosticOwnedNodes = 0
} = {}) {
  const values = {
    semanticLayerContainers,
    environmentPrimitives,
    interactionNodes,
    diagnosticOwnedNodes
  };

  const invalidKeys = Object.entries(values)
    .filter(
      ([, value]) =>
        !Number.isInteger(value) ||
        value < 0
    )
    .map(([key]) => key);

  if (invalidKeys.length > 0) {
    return deepFreeze({
      eligible: false,
      status: 'INVALID_NODE_BUDGET_INPUT',

      errors: deepFreeze([
        createCapacityError(
          'INVALID_NODE_COUNTS',
          'All node counts must be non-negative integers.',
          deepFreeze({
            invalidKeys
          })
        )
      ]),

      performanceClaim: false,
      validationClaim: false
    });
  }

  const totalRendererOwnedNodes =
    semanticLayerContainers +
    environmentPrimitives +
    interactionNodes +
    diagnosticOwnedNodes;

  const budget =
    H_EARTH_3D_NODE_BUDGET;

  const errors = [];
  const warnings = [];

  if (
    semanticLayerContainers >
    budget.semanticLayerContainers.maximum
  ) {
    errors.push(
      createCapacityError(
        'LAYER_CONTAINER_BUDGET_EXCEEDED',
        'Semantic layer-container maximum exceeded.'
      )
    );
  } else if (
    semanticLayerContainers >
    budget.semanticLayerContainers.warning
  ) {
    warnings.push(
      createCapacityError(
        'LAYER_CONTAINER_BUDGET_WARNING',
        'Semantic layer-container warning threshold exceeded.'
      )
    );
  }

  if (
    environmentPrimitives >
    budget.environmentPrimitives.maximum
  ) {
    errors.push(
      createCapacityError(
        'ENVIRONMENT_PRIMITIVE_BUDGET_EXCEEDED',
        'Environment primitive maximum exceeded.'
      )
    );
  } else if (
    environmentPrimitives >
    budget.environmentPrimitives.warning
  ) {
    warnings.push(
      createCapacityError(
        'ENVIRONMENT_PRIMITIVE_BUDGET_WARNING',
        'Environment primitive warning threshold exceeded.'
      )
    );
  }

  if (
    interactionNodes >
    budget.interactionNodes.maximum
  ) {
    errors.push(
      createCapacityError(
        'INTERACTION_NODE_BUDGET_EXCEEDED',
        'Interaction-node maximum exceeded.'
      )
    );
  }

  if (
    diagnosticOwnedNodes >
    budget.diagnosticOwnedNodes.maximum
  ) {
    errors.push(
      createCapacityError(
        'DIAGNOSTIC_NODE_BUDGET_EXCEEDED',
        'Diagnostic-owned-node maximum exceeded.'
      )
    );
  }

  if (
    totalRendererOwnedNodes >
    budget.totalRendererOwnedNodes.maximum
  ) {
    errors.push(
      createCapacityError(
        'TOTAL_RENDERER_NODE_BUDGET_EXCEEDED',
        'Total renderer-owned-node maximum exceeded.'
      )
    );
  } else if (
    totalRendererOwnedNodes >
    budget.totalRendererOwnedNodes.warning
  ) {
    warnings.push(
      createCapacityError(
        'TOTAL_RENDERER_NODE_BUDGET_WARNING',
        'Total renderer-owned-node warning threshold exceeded.'
      )
    );
  }

  return deepFreeze({
    eligible: errors.length === 0,

    status:
      errors.length > 0
        ? 'NODE_BUDGET_EXCEEDED'
        : warnings.length > 0
          ? 'NODE_BUDGET_WARNING'
          : 'NODE_BUDGET_WITHIN_CAPACITY',

    counts: deepFreeze({
      ...values,
      totalRendererOwnedNodes
    }),

    errors: deepFreeze(errors),
    warnings: deepFreeze(warnings),

    performanceClaim: false,
    rendererPassClaim: false,
    validationClaim: false
  });
}

/**
 * Evaluates a proposed Layer 4 handoff.
 *
 * This function does not import or execute the environment, compositor, or
 * renderer. Callers must supply the observed handoff facts.
 */
export function evaluateHEarth3DMountEligibility({
  capacityContractPresent = true,
  bindingIdentityMatches = false,
  environmentHandoffPresent = false,
  compositorHandoffPresent = false,
  compositorLayerOrderPresent = false,
  rendererPreflightPassed = false,
  rendererMountElementPresent = false,
  viewportEligible = false
} = {}) {
  const failures = [];

  if (!capacityContractPresent) {
    failures.push('capacity-contract-missing');
  }

  if (!bindingIdentityMatches) {
    failures.push('binding-identity-mismatch-or-unverified');
  }

  if (!environmentHandoffPresent) {
    failures.push('environment-handoff-missing');
  }

  if (!compositorHandoffPresent) {
    failures.push('compositor-handoff-missing');
  }

  if (!compositorLayerOrderPresent) {
    failures.push('compositor-layer-order-missing');
  }

  if (!rendererPreflightPassed) {
    failures.push('renderer-preflight-not-passed');
  }

  if (!rendererMountElementPresent) {
    failures.push('renderer-mount-element-missing');
  }

  if (!viewportEligible) {
    failures.push('viewport-outside-capacity-or-unverified');
  }

  return deepFreeze({
    rendererMayMount:
      failures.length === 0,

    status:
      failures.length === 0
        ? 'RENDERER_MOUNT_CAPACITY_ELIGIBLE'
        : 'RENDERER_MOUNT_CAPACITY_INELIGIBLE',

    failures: deepFreeze(failures),

    mountExecuted: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    playableEnvironmentClaim: false,
    validationClaim: false,
    productionClaim: false
  });
}

export default H_EARTH_3D_CAPACITY_CONTRACT;

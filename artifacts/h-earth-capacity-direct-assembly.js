__H_EARTH_CAPACITY_PART_01__
    span: 512
  }),

  origin: deepFreeze({
    x: 0,
    y: 0,
    z: 0
  }),
__H_EARTH_CAPACITY_PART_02__
      0,
      1,
      2
    ]),

    maximumNormalizedDeltaPxPerEvent: 1200,

    normalizedZoomScalePerPixel: deepFreeze({
__H_EARTH_CAPACITY_PART_03__

    rendererMayOwnCameraState: false,
    rendererMayOwnViewportState: false,
    rendererMayOwnNavigationConstraints: false,
    rendererMayInventLayerOrder: false,

    rendererPassClaimCreated: false,
    visualPassClaimCreated: false
__H_EARTH_CAPACITY_PART_04__
    ]
  ];

  for (
    const [field, value]
    of requiredFiniteFields
  ) {
    const passed =
__H_EARTH_CAPACITY_PART_05__
      vector.x,
      vector.y,
      vector.z
    );

  const tolerance =
    H_EARTH_3D_CAMERA_CAPACITY
      .resolvedCameraPoseEligibility
__H_EARTH_CAPACITY_PART_06__
        checks.push(
          createCapacityCheck(
            'CONTROLLER_INTENT_CAMERA_STATE_ELIGIBLE',
            cameraEvaluation.eligible,
            cameraEvaluation
          )
        );

__H_EARTH_CAPACITY_PART_07__
    )
  );

  if (!requiredFieldsPresent) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_REQUIRED_FIELDS_MISSING',
        'The compositor frame is missing required fields.',
        deepFreeze({
          missingFields
        })
      )
    );
  }

  const frameTypeMatches =
    frameCandidate.frameType ===
      frameCapacity.frameType;

  const frameIdEligible =
    isNonEmptyString(
      frameCandidate.frameId
    );

  const frameRevisionEligible =
    Number.isInteger(
      frameCandidate.frameRevision
    ) &&
    frameCandidate.frameRevision >=
      frameCapacity.revisions.minimum;

  const componentRevisionsEligible = [
    frameCandidate.cameraRevision,
    frameCandidate.viewportRevision,
    frameCandidate.visibilityRevision,
    frameCandidate.inertiaRevision
  ].every(
    (revision) =>
      Number.isInteger(revision) &&
      revision >= 0
  );

  const bindingIdentityEligible =
    frameCandidate.bindingIdentity
      ?.activeCell ===
      frameCapacity.bindingRequirements.activeCell &&
    frameCandidate.bindingIdentity
      ?.spatialCellId ===
      frameCapacity.bindingRequirements.spatialCellId &&
    frameCandidate.bindingIdentity
      ?.sceneIdentity ===
      frameCapacity.bindingRequirements.sceneIdentity;

  const coordinateFrameEligible =
    frameCandidate.coordinateFrame ===
      frameCapacity.bindingRequirements.coordinateFrame;

  checks.push(
    createCapacityCheck(
      'COMPOSITOR_FRAME_TYPE_MATCHES',
      frameTypeMatches,
      frameCandidate.frameType
    )
  );

  checks.push(
    createCapacityCheck(
      'COMPOSITOR_FRAME_ID_ELIGIBLE',
      frameIdEligible,
      frameCandidate.frameId
    )
  );

  checks.push(
    createCapacityCheck(
      'COMPOSITOR_FRAME_REVISION_ELIGIBLE',
      frameRevisionEligible,
      frameCandidate.frameRevision
    )
  );

  checks.push(
    createCapacityCheck(
      'COMPOSITOR_FRAME_COMPONENT_REVISIONS_ELIGIBLE',
      componentRevisionsEligible
    )
  );

  checks.push(
    createCapacityCheck(
      'COMPOSITOR_FRAME_BINDING_IDENTITY_ELIGIBLE',
      bindingIdentityEligible,
      frameCandidate.bindingIdentity
    )
  );

  checks.push(
    createCapacityCheck(
      'COMPOSITOR_FRAME_COORDINATE_FRAME_ELIGIBLE',
      coordinateFrameEligible,
      frameCandidate.coordinateFrame
    )
  );

  if (!frameTypeMatches) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_TYPE_MISMATCH',
        'Compositor frame type does not match capacity.',
        frameCandidate.frameType
      )
    );
  }

  if (!frameIdEligible) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_ID_INVALID',
        'Compositor frame ID must be a non-empty string.',
        frameCandidate.frameId
      )
    );
  }

  if (!frameRevisionEligible) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_REVISION_INVALID',
        'Compositor frame revision must be a non-negative integer.',
        frameCandidate.frameRevision
      )
    );
  }

  if (!componentRevisionsEligible) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_COMPONENT_REVISION_INVALID',
        'All compositor component revisions must be non-negative integers.'
      )
    );
  }

  if (!bindingIdentityEligible) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_BINDING_IDENTITY_MISMATCH',
        'Compositor frame binding identity does not match capacity.',
        frameCandidate.bindingIdentity
      )
    );
  }

  if (!coordinateFrameEligible) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_COORDINATE_FRAME_MISMATCH',
        'Compositor frame coordinate frame does not match capacity.',
        frameCandidate.coordinateFrame
      )
    );
  }

  let viewportEvaluation = null;

  if (
    isPlainObject(
      frameCandidate.viewport
    )
  ) {
    viewportEvaluation =
      evaluateHEarth3DViewportCapacity(
        frameCandidate.viewport
      );
  }

  const viewportEligible =
    viewportEvaluation
      ?.eligible === true;

  checks.push(
    createCapacityCheck(
      'COMPOSITOR_FRAME_VIEWPORT_ELIGIBLE',
      viewportEligible,
      viewportEvaluation
    )
  );

  if (!viewportEligible) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_VIEWPORT_NOT_ELIGIBLE',
        'Compositor frame viewport is not eligible.',
        viewportEvaluation
      )
    );
  }

  const cameraEvaluation =
    evaluateHEarth3DCameraPose(
      frameCandidate.resolvedCameraPose
    );

  checks.push(
    createCapacityCheck(
      'COMPOSITOR_FRAME_CAMERA_POSE_ELIGIBLE',
      cameraEvaluation.eligible,
      cameraEvaluation
    )
  );

  if (!cameraEvaluation.eligible) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_CAMERA_POSE_NOT_ELIGIBLE',
        'Compositor frame camera pose is not eligible.',
        cameraEvaluation
      )
    );
  }

  const orderedLayerIds =
    frameCandidate.composition
      ?.orderedLayerIds;

  const orderedLayers =
    frameCandidate.composition
      ?.orderedLayers;

  const visibleLayerIds =
    frameCandidate.composition
      ?.visibleLayerIds;

  const compositionArraysPresent =
    Array.isArray(
      orderedLayerIds
    ) &&
    Array.isArray(
      orderedLayers
    ) &&
    Array.isArray(
      visibleLayerIds
    );

  const layerCountEligible =
    compositionArraysPresent &&
    orderedLayerIds.length >=
      frameCapacity
        .compositionRequirements
        .minimumSemanticLayers &&
    orderedLayerIds.length <=
      frameCapacity
        .compositionRequirements
        .maximumSemanticLayers;

  const layerIdsUnique =
    compositionArraysPresent &&
    new Set(
      orderedLayerIds
    ).size ===
      orderedLayerIds.length;

  checks.push(
    createCapacityCheck(
      'COMPOSITOR_FRAME_COMPOSITION_ARRAYS_PRESENT',
      compositionArraysPresent
    )
  );

  checks.push(
    createCapacityCheck(
      'COMPOSITOR_FRAME_LAYER_COUNT_ELIGIBLE',
      layerCountEligible,
      orderedLayerIds?.length
    )
  );

  checks.push(
    createCapacityCheck(
      'COMPOSITOR_FRAME_LAYER_IDS_UNIQUE',
      layerIdsUnique
    )
  );

  if (!compositionArraysPresent) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_COMPOSITION_MISSING',
        'Compositor frame composition arrays are required.'
      )
    );
  }

  if (!layerCountEligible) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_LAYER_COUNT_OUTSIDE_CAPACITY',
        'Compositor frame semantic-layer count falls outside capacity.',
        orderedLayerIds?.length
      )
    );
  }

  if (!layerIdsUnique) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_LAYER_IDS_NOT_UNIQUE',
        'Compositor frame semantic-layer IDs must be unique.'
      )
    );
  }

  const environmentEligible =
    isNonEmptyString(
      frameCandidate.environment
        ?.contractId
    ) &&
    isPlainObject(
      frameCandidate.environment
        ?.primitivePlan
    ) &&
    isPlainObject(
      frameCandidate.environment
        ?.materials
    ) &&
    isPlainObject(
      frameCandidate.environment
        ?.inspectionAnchor
    );

  checks.push(
    createCapacityCheck(
      'COMPOSITOR_FRAME_ENVIRONMENT_ENVELOPE_ELIGIBLE',
      environmentEligible
    )
  );

  if (!environmentEligible) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_ENVIRONMENT_ENVELOPE_INVALID',
        'Compositor frame environment envelope is incomplete.'
      )
    );
  }

  const rendererRules =
    frameCandidate.rendererRules;

  const rendererRulesEligible =
    rendererRules
      ?.projectionOwnedByRenderer === true &&
    rendererRules
      ?.primitiveConstructionOwnedByRenderer === true &&
    rendererRules
      ?.DOMCSSMaterializationOwnedByRenderer === true &&
    rendererRules
      ?.cameraStateOwnedByRenderer === false &&
    rendererRules
      ?.viewportStateOwnedByRenderer === false &&
    rendererRules
      ?.navigationConstraintsOwnedByRenderer === false &&
    rendererRules
      ?.semanticLayerOrderOwnedByRenderer === false;

  checks.push(
    createCapacityCheck(
      'COMPOSITOR_FRAME_RENDERER_RULES_ELIGIBLE',
      rendererRulesEligible,
      rendererRules
    )
  );

  if (!rendererRulesEligible) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_RENDERER_RULES_INVALID',
        'Compositor frame renderer rules violate the frame-based corridor boundary.',
        rendererRules
      )
    );
  }

  const eligible =
    allChecksPass(checks);

  return deepFreeze({
    eligible,

    status:
      eligible
        ? 'COMPOSITOR_FRAME_ELIGIBLE'
        : 'COMPOSITOR_FRAME_NOT_ELIGIBLE',

    checks:
      deepFreeze(checks),

    issues:
      deepFreeze(issues),

    viewportEvaluation,
    cameraEvaluation,

    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false
  });
}

/**
 * Evaluates renderer consumption of a compositor frame.
 */
export function evaluateHEarth3DRendererFrameConsumption({
  frame = null,
  rendererContractId = null,
  compositorContractIdMatches = false,
  capacityContractIdMatches = false,
  environmentContractIdMatches = false,
  bindingIdentityMatches = false,
  coordinateFrameMatches = false,
  requiredLayerOrderConsumed = false,
  requiredLayersPresent = false,
  primitiveBudgetWithinCapacity = false,
  rendererOutputModelAllowed = false,
  rendererImportedSuccessfully = false,
  rendererConstructedSuccessfully = false,
  compositorFrameConsumed = false,
  compositorFrameRevisionRecorded = false,
  appliedFrameRevision = null,
  previouslyAppliedFrameRevision = null
} = {}) {
  const checks = [];
__H_EARTH_CAPACITY_PART_09__
      cameraStateAuthorityDenied: true
    }),

    index: deepFreeze({
      publicStageIdsProvided: true,
      mountEligibilityEvaluatorProvided: true,
      routeActivationClaimNotProvided: true
    }),
__H_EARTH_CAPACITY_PART_10__

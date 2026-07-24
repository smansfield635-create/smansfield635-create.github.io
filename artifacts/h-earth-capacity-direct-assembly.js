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

        if (!cameraEvaluation.eligible) {
          issues.push(
            ...cameraEvaluation.issues
          );
        }
      }
      break;

    case 'H_EARTH_COMPOSITOR_INTENT_SET_VISIBLE_LAYERS':
      {
        const visibleLayerIds =
          intent.visibleLayerIds;

        const eligible =
          Array.isArray(
            visibleLayerIds
          ) &&
          visibleLayerIds.every(
            isNonEmptyString
          );

        checks.push(
          createCapacityCheck(
            'CONTROLLER_INTENT_VISIBLE_LAYER_IDS_STRUCTURALLY_ELIGIBLE',
            eligible,
            visibleLayerIds
          )
        );

        if (!eligible) {
          issues.push(
            createCapacityIssue(
              'CONTROLLER_INTENT_VISIBLE_LAYER_IDS_INVALID',
              'Visible layer IDs must be an array of non-empty strings.',
              visibleLayerIds
            )
          );
        }
      }
      break;

    case 'H_EARTH_COMPOSITOR_INTENT_START_INERTIA':
      {
        for (
          const field
          of H_EARTH_3D_CONTROLLER_INTENT_CAPACITY
            .inertia
            .acceptedVelocityFields
        ) {
          finiteWithin(
            field,
            -H_EARTH_3D_INTERACTION_CAPACITY
              .inertia
              .maximumInitialVelocity,
            H_EARTH_3D_INTERACTION_CAPACITY
              .inertia
              .maximumInitialVelocity
          );
        }
      }
      break;

    case 'H_EARTH_COMPOSITOR_INTENT_ADVANCE_INERTIA':
    case 'H_EARTH_COMPOSITOR_INTENT_STOP_INERTIA':
    case 'H_EARTH_COMPOSITOR_INTENT_RESET_VIEW':
      break;

    default:
      break;
  }

  const eligible =
    allChecksPass(checks);

  return deepFreeze({
    eligible,

    status:
      eligible
        ? 'CONTROLLER_INTENT_ELIGIBLE'
        : 'CONTROLLER_INTENT_NOT_ELIGIBLE',

    intentType,

    checks:
      deepFreeze(checks),

    issues:
      deepFreeze(issues)
  });
}

/**
 * Explicit controller-intent evaluator alias.
 */
export function evaluateHEarth3DControllerIntentEligibility(
  intent = {}
) {
  return evaluateHEarth3DInteractionIntent(
    intent
  );
}

/**
 * Evaluates the node and primitive budget.
 */
export function evaluateHEarth3DNodeBudget({
  semanticLayerContainers = 0,
  environmentPrimitives = 0,
  interactionNodes = 0,
  routeOverlayNodes = 0,
  diagnosticOwnedNodes = 0
} = {}) {
  const issues = [];
  const checks = [];

  const inputs = {
    semanticLayerContainers,
    environmentPrimitives,
    interactionNodes,
    routeOverlayNodes,
    diagnosticOwnedNodes
  };

  for (
    const [field, value]
    of Object.entries(inputs)
  ) {
    const eligible =
      Number.isInteger(value) &&
      value >= 0;

    checks.push(
      createCapacityCheck(
        `NODE_BUDGET_${field.toUpperCase()}_NON_NEGATIVE_INTEGER`,
        eligible,
        value
      )
    );

    if (!eligible) {
      issues.push(
        createCapacityIssue(
          'NODE_BUDGET_FIELD_INVALID',
          `Node-budget field ${field} must be a non-negative integer.`,
          deepFreeze({
            field,
            value
          })
        )
      );
    }
  }

  if (issues.length > 0) {
    return deepFreeze({
      eligible: false,

      status:
        'NODE_BUDGET_NOT_ELIGIBLE',

      checks:
        deepFreeze(checks),

      issues:
        deepFreeze(issues)
    });
  }

  const budget =
    H_EARTH_3D_NODE_BUDGET;

  const semanticLayerContainersEligible =
    semanticLayerContainers >=
      budget.semanticLayerContainers.minimum &&
    semanticLayerContainers <=
      budget.semanticLayerContainers.maximum;

  const environmentPrimitivesEligible =
    environmentPrimitives >=
      budget.environmentPrimitives.minimum &&
    environmentPrimitives <=
      budget.environmentPrimitives.absoluteMaximum;

  const interactionNodesEligible =
    interactionNodes >=
      budget.interactionNodes.minimum &&
    interactionNodes <=
      budget.interactionNodes.absoluteMaximum;

  const routeOverlayNodesEligible =
    routeOverlayNodes >=
      budget.routeOverlayNodes.minimum &&
    routeOverlayNodes <=
      budget.routeOverlayNodes.absoluteMaximum;

  const diagnosticOwnedNodesEligible =
    diagnosticOwnedNodes >=
      budget.diagnosticOwnedNodes.minimum &&
    diagnosticOwnedNodes <=
      budget.diagnosticOwnedNodes.absoluteMaximum;

  const totalRendererOwnedNodes =
    semanticLayerContainers +
    environmentPrimitives +
    interactionNodes +
    routeOverlayNodes +
    diagnosticOwnedNodes;

  const totalEligible =
    totalRendererOwnedNodes <=
      budget.totalRendererOwnedNodes.absoluteMaximum;

  checks.push(
    createCapacityCheck(
      'SEMANTIC_LAYER_CONTAINER_BUDGET_ELIGIBLE',
      semanticLayerContainersEligible,
      semanticLayerContainers
    )
  );

  checks.push(
    createCapacityCheck(
      'ENVIRONMENT_PRIMITIVE_BUDGET_ELIGIBLE',
      environmentPrimitivesEligible,
      environmentPrimitives
    )
  );

  checks.push(
    createCapacityCheck(
      'INTERACTION_NODE_BUDGET_ELIGIBLE',
      interactionNodesEligible,
      interactionNodes
    )
  );

  checks.push(
    createCapacityCheck(
      'ROUTE_OVERLAY_NODE_BUDGET_ELIGIBLE',
      routeOverlayNodesEligible,
      routeOverlayNodes
    )
  );

  checks.push(
    createCapacityCheck(
      'DIAGNOSTIC_NODE_BUDGET_ELIGIBLE',
      diagnosticOwnedNodesEligible,
      diagnosticOwnedNodes
    )
  );

  checks.push(
    createCapacityCheck(
      'TOTAL_RENDERER_NODE_BUDGET_ELIGIBLE',
      totalEligible,
      totalRendererOwnedNodes
    )
  );

  if (!semanticLayerContainersEligible) {
    issues.push(
      createCapacityIssue(
        'SEMANTIC_LAYER_CONTAINER_BUDGET_EXCEEDED',
        'Semantic layer-container count falls outside capacity.',
        semanticLayerContainers
      )
    );
  }

  if (!environmentPrimitivesEligible) {
    issues.push(
      createCapacityIssue(
        'ENVIRONMENT_PRIMITIVE_BUDGET_EXCEEDED',
        'Environment primitive count falls outside capacity.',
        environmentPrimitives
      )
    );
  }

  if (!interactionNodesEligible) {
    issues.push(
      createCapacityIssue(
        'INTERACTION_NODE_BUDGET_EXCEEDED',
        'Interaction node count falls outside capacity.',
        interactionNodes
      )
    );
  }

  if (!routeOverlayNodesEligible) {
    issues.push(
      createCapacityIssue(
        'ROUTE_OVERLAY_NODE_BUDGET_EXCEEDED',
        'Route overlay node count falls outside capacity.',
        routeOverlayNodes
      )
    );
  }

  if (!diagnosticOwnedNodesEligible) {
    issues.push(
      createCapacityIssue(
        'DIAGNOSTIC_NODE_BUDGET_EXCEEDED',
        'Diagnostic-owned node count falls outside capacity.',
        diagnosticOwnedNodes
      )
    );
  }

  if (!totalEligible) {
    issues.push(
      createCapacityIssue(
        'TOTAL_RENDERER_NODE_BUDGET_EXCEEDED',
        'Total renderer-owned node count exceeds capacity.',
        totalRendererOwnedNodes
      )
    );
  }

  const eligible =
    allChecksPass(checks);

  return deepFreeze({
    eligible,

    status:
      eligible
        ? 'NODE_BUDGET_ELIGIBLE'
        : 'NODE_BUDGET_NOT_ELIGIBLE',

    checks:
      deepFreeze(checks),

    issues:
      deepFreeze(issues),

    accounting: deepFreeze({
      semanticLayerContainers,
      environmentPrimitives,
      interactionNodes,
      routeOverlayNodes,
      diagnosticOwnedNodes,
      totalRendererOwnedNodes
    }),

    budget
  });
}

/**
 * Evaluates compositor-frame capacity.
 */
export function evaluateHEarth3DCompositorFrameEligibility(
  frameCandidate = {}
) {
  const issues = [];
  const checks = [];

  const frameCapacity =
    H_EARTH_3D_RENDER_FRAME_CAPACITY;

  const objectEligible =
    isPlainObject(
      frameCandidate
    );

  checks.push(
    createCapacityCheck(
      'COMPOSITOR_FRAME_OBJECT_PRESENT',
      objectEligible
    )
  );

  if (!objectEligible) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_MISSING',
        'A compositor render-frame object is required.'
      )
    );

    return deepFreeze({
      eligible: false,

      status:
        'COMPOSITOR_FRAME_NOT_ELIGIBLE',

      checks:
        deepFreeze(checks),

      issues:
        deepFreeze(issues)
    });
  }

  const missingFields =
    frameCapacity.requiredTopLevelFields
      .filter(
        (field) =>
          frameCandidate[field] ===
          undefined
      );

  const requiredFieldsPresent =
    missingFields.length === 0;

  checks.push(
    createCapacityCheck(
      'COMPOSITOR_FRAME_REQUIRED_FIELDS_PRESENT',
      requiredFieldsPresent,
      deepFreeze({
        missingFields
      })
    )
  );

  if (!requiredFieldsPresent) {
    issues.push(
      createCapacityIssue(
        'COMPOSITOR_FRAME_REQUIRED_FIELDS_MISSING',
        'The compositor frame is missing required fields.',
__H_EARTH_CAPACITY_PART_08__
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

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
      .orthogonalBasisTolerance;

  const forwardNormalized =
    Math.abs(
      vectorLength(forward) -
      1
    ) <= tolerance;

  const rightNormalized =
    Math.abs(
      vectorLength(right) -
      1
    ) <= tolerance;

  const upNormalized =
    Math.abs(
      vectorLength(up) -
      1
    ) <= tolerance;

  const revisionEligible =
    Number.isInteger(
      poseCandidate.cameraRevision
    ) &&
    poseCandidate.cameraRevision >= 0;

  const distanceEligible =
    isPositiveFiniteNumber(
      poseCandidate.distance
    ) &&
    Math.abs(
      poseCandidate.distance -
      getVectorDistance(
        position,
        target
      )
    ) <= 0.01;

  checks.push(
    createCapacityCheck(
      'CAMERA_POSE_POSITION_WITHIN_CAPACITY',
      positionWithinCapacity,
      position
    )
  );

  checks.push(
    createCapacityCheck(
      'CAMERA_POSE_TARGET_WITHIN_CAPACITY',
      targetWithinCapacity,
      target
    )
  );

  checks.push(
    createCapacityCheck(
      'CAMERA_POSE_FORWARD_NORMALIZED',
      forwardNormalized,
      vectorLength(forward)
    )
  );

  checks.push(
    createCapacityCheck(
      'CAMERA_POSE_RIGHT_NORMALIZED',
      rightNormalized,
      vectorLength(right)
    )
  );

  checks.push(
    createCapacityCheck(
      'CAMERA_POSE_UP_NORMALIZED',
      upNormalized,
      vectorLength(up)
    )
  );

  checks.push(
    createCapacityCheck(
      'CAMERA_POSE_REVISION_ELIGIBLE',
      revisionEligible,
      poseCandidate.cameraRevision
    )
  );

  checks.push(
    createCapacityCheck(
      'CAMERA_POSE_DISTANCE_ELIGIBLE',
      distanceEligible,
      poseCandidate.distance
    )
  );

  if (!positionWithinCapacity) {
    issues.push(
      createCapacityIssue(
        'CAMERA_POSE_POSITION_OUTSIDE_CAPACITY',
        'Resolved camera position falls outside capacity.',
        position
      )
    );
  }

  if (!targetWithinCapacity) {
    issues.push(
      createCapacityIssue(
        'CAMERA_POSE_TARGET_OUTSIDE_CAPACITY',
        'Resolved camera target falls outside capacity.',
        target
      )
    );
  }

  if (
    !forwardNormalized ||
    !rightNormalized ||
    !upNormalized
  ) {
    issues.push(
      createCapacityIssue(
        'CAMERA_POSE_BASIS_NOT_NORMALIZED',
        'Resolved camera basis vectors must be normalized.'
      )
    );
  }

  if (!revisionEligible) {
    issues.push(
      createCapacityIssue(
        'CAMERA_POSE_REVISION_INVALID',
        'Resolved camera pose requires a non-negative integer camera revision.',
        poseCandidate.cameraRevision
      )
    );
  }

  if (!distanceEligible) {
    issues.push(
      createCapacityIssue(
        'CAMERA_POSE_DISTANCE_INVALID',
        'Resolved camera distance is invalid or inconsistent with position and target.',
        poseCandidate.distance
      )
    );
  }

  const eligible =
    allChecksPass(checks);

  return deepFreeze({
    eligible,

    status:
      eligible
        ? 'CAMERA_POSE_ELIGIBLE'
        : 'CAMERA_POSE_NOT_ELIGIBLE',

    checks:
      deepFreeze(checks),

    issues:
      deepFreeze(issues)
  });
}

/**
 * Evaluates controller/compositor interaction intent capacity.
 */
export function evaluateHEarth3DInteractionIntent(
  intent = {}
) {
  const issues = [];
  const checks = [];

  const intentType =
    intent.type;

  const typePresent =
    isNonEmptyString(
      intentType
    );

  const typeAccepted =
    typePresent &&
    H_EARTH_3D_CONTROLLER_INTENT_CAPACITY
      .acceptedIntentTypes
      .includes(
        intentType
      );

  checks.push(
    createCapacityCheck(
      'CONTROLLER_INTENT_TYPE_PRESENT',
      typePresent,
      intentType
    )
  );

  checks.push(
    createCapacityCheck(
      'CONTROLLER_INTENT_TYPE_ACCEPTED',
      typeAccepted,
      intentType
    )
  );

  if (!typePresent) {
    issues.push(
      createCapacityIssue(
        'CONTROLLER_INTENT_TYPE_MISSING',
        'Controller intent type is required.'
      )
    );
  } else if (!typeAccepted) {
    issues.push(
      createCapacityIssue(
        'CONTROLLER_INTENT_TYPE_UNKNOWN',
        'Controller intent type is not accepted by capacity.',
        intentType
      )
    );
  }

  if (!typeAccepted) {
    return deepFreeze({
      eligible: false,

      status:
        'CONTROLLER_INTENT_NOT_ELIGIBLE',

      checks:
        deepFreeze(checks),

      issues:
        deepFreeze(issues)
    });
  }

  const finiteWithin = (
    field,
    minimum,
    maximum,
    defaultValue = 0
  ) => {
    const value =
      intent[field] ??
      defaultValue;

    const finite =
      isFiniteNumber(
        value
      );

    const within =
      finite &&
      value >= minimum &&
      value <= maximum;

    checks.push(
      createCapacityCheck(
        `CONTROLLER_INTENT_${field.toUpperCase()}_FINITE`,
        finite,
        value
      )
    );

    checks.push(
      createCapacityCheck(
        `CONTROLLER_INTENT_${field.toUpperCase()}_WITHIN_CAPACITY`,
        within,
        deepFreeze({
          value,
          minimum,
          maximum
        })
      )
    );

    if (!finite) {
      issues.push(
        createCapacityIssue(
          'CONTROLLER_INTENT_FIELD_NOT_FINITE',
          `Controller intent field ${field} must be finite.`,
          deepFreeze({
            field,
            value
          })
        )
      );
    } else if (!within) {
      issues.push(
        createCapacityIssue(
          'CONTROLLER_INTENT_FIELD_OUTSIDE_CAPACITY',
          `Controller intent field ${field} falls outside capacity.`,
          deepFreeze({
            field,
            value,
            minimum,
            maximum
          })
        )
      );
    }
  };

  switch (intentType) {
    case 'H_EARTH_COMPOSITOR_INTENT_ORBIT':
      finiteWithin(
        'yawDeltaDegrees',
        H_EARTH_3D_CONTROLLER_INTENT_CAPACITY
          .orbit
          .yawDeltaDegrees
          .minimum,
        H_EARTH_3D_CONTROLLER_INTENT_CAPACITY
          .orbit
          .yawDeltaDegrees
          .maximum
      );

      finiteWithin(
        'pitchDeltaDegrees',
        H_EARTH_3D_CONTROLLER_INTENT_CAPACITY
          .orbit
          .pitchDeltaDegrees
          .minimum,
        H_EARTH_3D_CONTROLLER_INTENT_CAPACITY
          .orbit
          .pitchDeltaDegrees
          .maximum
      );
      break;

    case 'H_EARTH_COMPOSITOR_INTENT_PAN':
      finiteWithin(
        'horizontalDelta',
        H_EARTH_3D_CONTROLLER_INTENT_CAPACITY
          .pan
          .horizontalDelta
          .minimum,
        H_EARTH_3D_CONTROLLER_INTENT_CAPACITY
          .pan
          .horizontalDelta
          .maximum
      );

      finiteWithin(
        'verticalDelta',
        H_EARTH_3D_CONTROLLER_INTENT_CAPACITY
          .pan
          .verticalDelta
          .minimum,
        H_EARTH_3D_CONTROLLER_INTENT_CAPACITY
          .pan
          .verticalDelta
          .maximum
      );

      finiteWithin(
        'depthDelta',
        H_EARTH_3D_CONTROLLER_INTENT_CAPACITY
          .pan
          .depthDelta
          .minimum,
        H_EARTH_3D_CONTROLLER_INTENT_CAPACITY
          .pan
          .depthDelta
          .maximum
      );
      break;

    case 'H_EARTH_COMPOSITOR_INTENT_ZOOM':
      finiteWithin(
        'zoomScaleDelta',
        H_EARTH_3D_CONTROLLER_INTENT_CAPACITY
          .zoom
          .zoomScaleDelta
          .minimum,
        H_EARTH_3D_CONTROLLER_INTENT_CAPACITY
          .zoom
          .zoomScaleDelta
          .maximum
      );
      break;

    case 'H_EARTH_COMPOSITOR_INTENT_SET_VIEWPORT':
      {
        const viewportEvaluation =
          evaluateHEarth3DViewportCapacity(
            intent.viewport ??
            intent
          );

        checks.push(
          createCapacityCheck(
            'CONTROLLER_INTENT_VIEWPORT_ELIGIBLE',
            viewportEvaluation.eligible,
            viewportEvaluation
          )
        );

        if (!viewportEvaluation.eligible) {
          issues.push(
            ...viewportEvaluation.issues
          );
        }
      }
      break;

    case 'H_EARTH_COMPOSITOR_INTENT_SET_CAMERA_STATE':
      {
        const cameraEvaluation =
          evaluateHEarth3DCameraCapacity(
            intent.cameraState
          );

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

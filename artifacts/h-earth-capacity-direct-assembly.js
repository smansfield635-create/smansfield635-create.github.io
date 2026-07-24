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
      isFiniteNumber(value);

    checks.push(
      createCapacityCheck(
        `CAMERA_${field.toUpperCase().replace('.', '_')}_FINITE`,
        passed,
        value
      )
    );

    if (!passed) {
      issues.push(
        createCapacityIssue(
          'CAMERA_FIELD_NOT_FINITE',
          `Camera field ${field} must be finite.`,
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
        'CAMERA_CAPACITY_NOT_ELIGIBLE',

      checks:
        deepFreeze(checks),

      issues:
        deepFreeze(issues),

      normalizedCameraState: null
    });
  }

  const normalizedCameraState =
    deepFreeze({
      yawDegrees:
        clamp(
          cameraCandidate.yawDegrees,
          controllerCapacity.yawDegrees.minimum,
          controllerCapacity.yawDegrees.maximum
        ),

      pitchDegrees:
        clamp(
          cameraCandidate.pitchDegrees,
          controllerCapacity.pitchDegrees.minimum,
          controllerCapacity.pitchDegrees.maximum
        ),

      zoomScale:
        clamp(
          cameraCandidate.zoomScale,
          controllerCapacity.zoomScale.minimum,
          controllerCapacity.zoomScale.maximum
        ),

      target: deepFreeze({
        x:
          clamp(
            cameraCandidate.target.x,
            controllerCapacity.targetBounds.xMin,
            controllerCapacity.targetBounds.xMax
          ),

        y:
          clamp(
            cameraCandidate.target.y,
            controllerCapacity.targetBounds.yMin,
            controllerCapacity.targetBounds.yMax
          ),

        z:
          clamp(
            cameraCandidate.target.z,
            controllerCapacity.targetBounds.zMin,
            controllerCapacity.targetBounds.zMax
          )
      }),

      verticalFovDegrees:
        clamp(
          cameraCandidate.verticalFovDegrees,
          controllerCapacity.verticalFovDegrees.minimum,
          controllerCapacity.verticalFovDegrees.maximum
        ),

      nearPlane:
        H_EARTH_3D_CAMERA_CAPACITY
          .initialProjectionCandidate
          .nearPlane,

      farPlane:
        H_EARTH_3D_CAMERA_CAPACITY
          .initialProjectionCandidate
          .farPlane
    });

  const yawWithinCapacity =
    cameraCandidate.yawDegrees >=
      controllerCapacity.yawDegrees.minimum &&
    cameraCandidate.yawDegrees <=
      controllerCapacity.yawDegrees.maximum;

  const pitchWithinCapacity =
    cameraCandidate.pitchDegrees >=
      controllerCapacity.pitchDegrees.minimum &&
    cameraCandidate.pitchDegrees <=
      controllerCapacity.pitchDegrees.maximum;

  const zoomWithinCapacity =
    cameraCandidate.zoomScale >=
      controllerCapacity.zoomScale.minimum &&
    cameraCandidate.zoomScale <=
      controllerCapacity.zoomScale.maximum;

  const targetWithinCapacity =
    cameraCandidate.target.x >=
      controllerCapacity.targetBounds.xMin &&
    cameraCandidate.target.x <=
      controllerCapacity.targetBounds.xMax &&
    cameraCandidate.target.y >=
      controllerCapacity.targetBounds.yMin &&
    cameraCandidate.target.y <=
      controllerCapacity.targetBounds.yMax &&
    cameraCandidate.target.z >=
      controllerCapacity.targetBounds.zMin &&
    cameraCandidate.target.z <=
      controllerCapacity.targetBounds.zMax;

  const fovWithinCapacity =
    cameraCandidate.verticalFovDegrees >=
      controllerCapacity.verticalFovDegrees.minimum &&
    cameraCandidate.verticalFovDegrees <=
      controllerCapacity.verticalFovDegrees.maximum;

  const planesEligible =
    cameraCandidate.nearPlane >=
      H_EARTH_3D_CAMERA_CAPACITY
        .resolvedCameraPoseEligibility
        .nearPlaneMinimum &&
    cameraCandidate.farPlane <=
      H_EARTH_3D_CAMERA_CAPACITY
        .resolvedCameraPoseEligibility
        .farPlaneMaximum &&
    cameraCandidate.farPlane >
      cameraCandidate.nearPlane;

  checks.push(
    createCapacityCheck(
      'CAMERA_YAW_WITHIN_CAPACITY',
      yawWithinCapacity,
      cameraCandidate.yawDegrees
    )
  );

  checks.push(
    createCapacityCheck(
      'CAMERA_PITCH_WITHIN_CAPACITY',
      pitchWithinCapacity,
      cameraCandidate.pitchDegrees
    )
  );

  checks.push(
    createCapacityCheck(
      'CAMERA_ZOOM_WITHIN_CAPACITY',
      zoomWithinCapacity,
      cameraCandidate.zoomScale
    )
  );

  checks.push(
    createCapacityCheck(
      'CAMERA_TARGET_WITHIN_CAPACITY',
      targetWithinCapacity,
      cameraCandidate.target
    )
  );

  checks.push(
    createCapacityCheck(
      'CAMERA_FOV_WITHIN_CAPACITY',
      fovWithinCapacity,
      cameraCandidate.verticalFovDegrees
    )
  );

  checks.push(
    createCapacityCheck(
      'CAMERA_PLANES_ELIGIBLE',
      planesEligible,
      deepFreeze({
        nearPlane:
          cameraCandidate.nearPlane,

        farPlane:
          cameraCandidate.farPlane
      })
    )
  );

  if (!yawWithinCapacity) {
    issues.push(
      createCapacityIssue(
        'CAMERA_YAW_OUTSIDE_CAPACITY',
        'Camera yaw falls outside capacity.',
        cameraCandidate.yawDegrees
      )
    );
  }

  if (!pitchWithinCapacity) {
    issues.push(
      createCapacityIssue(
        'CAMERA_PITCH_OUTSIDE_CAPACITY',
        'Camera pitch falls outside capacity.',
        cameraCandidate.pitchDegrees
      )
    );
  }

  if (!zoomWithinCapacity) {
    issues.push(
      createCapacityIssue(
        'CAMERA_ZOOM_OUTSIDE_CAPACITY',
        'Camera zoom scale falls outside capacity.',
        cameraCandidate.zoomScale
      )
    );
  }

  if (!targetWithinCapacity) {
    issues.push(
      createCapacityIssue(
        'CAMERA_TARGET_OUTSIDE_CAPACITY',
        'Camera target falls outside capacity.',
        cameraCandidate.target
      )
    );
  }

  if (!fovWithinCapacity) {
    issues.push(
      createCapacityIssue(
        'CAMERA_FOV_OUTSIDE_CAPACITY',
        'Camera vertical field of view falls outside capacity.',
        cameraCandidate.verticalFovDegrees
      )
    );
  }

  if (!planesEligible) {
    issues.push(
      createCapacityIssue(
        'CAMERA_PLANES_NOT_ELIGIBLE',
        'Camera near and far planes are not eligible.',
        deepFreeze({
          nearPlane:
            cameraCandidate.nearPlane,

          farPlane:
            cameraCandidate.farPlane
        })
      )
    );
  }

  const eligible =
    yawWithinCapacity &&
    pitchWithinCapacity &&
    zoomWithinCapacity &&
    targetWithinCapacity &&
    fovWithinCapacity &&
    planesEligible;

  return deepFreeze({
    eligible,

    status:
      eligible
        ? 'CAMERA_CAPACITY_ELIGIBLE'
        : 'CAMERA_CAPACITY_NOT_ELIGIBLE',

    checks:
      deepFreeze(checks),

    issues:
      deepFreeze(issues),

    normalizedCameraState,

    adjustmentRequired:
      JSON.stringify(
        cameraCandidate
      ) !==
      JSON.stringify(
        normalizedCameraState
      )
  });
}

/**
 * Evaluates a resolved camera pose.
 */
export function evaluateHEarth3DCameraPose(
  poseCandidate = {}
) {
  const issues = [];
  const checks = [];

  const position =
    poseCandidate.position;

  const target =
    poseCandidate.target;

  const forward =
    poseCandidate.forward;

  const right =
    poseCandidate.right;

  const up =
    poseCandidate.up;

  const vectors = [
    ['position', position],
    ['target', target],
    ['forward', forward],
    ['right', right],
    ['up', up]
  ];

  for (
    const [name, vector]
    of vectors
  ) {
    const valid =
      isPlainObject(vector) &&
      isFiniteNumber(vector.x) &&
      isFiniteNumber(vector.y) &&
      isFiniteNumber(vector.z);

    checks.push(
      createCapacityCheck(
        `CAMERA_POSE_${name.toUpperCase()}_FINITE`,
        valid,
        vector
      )
    );

    if (!valid) {
      issues.push(
        createCapacityIssue(
          'CAMERA_POSE_VECTOR_INVALID',
          `Camera pose vector ${name} must contain finite x, y, and z values.`,
          deepFreeze({
            name,
            vector
          })
        )
      );
    }
  }

  if (issues.length > 0) {
    return deepFreeze({
      eligible: false,

      status:
        'CAMERA_POSE_NOT_ELIGIBLE',

      checks:
        deepFreeze(checks),

      issues:
        deepFreeze(issues)
    });
  }

  const bounds =
    H_EARTH_3D_CAMERA_CAPACITY
      .futureControllerCapacity
      .positionBounds;

  const positionWithinCapacity =
    position.x >= bounds.xMin &&
    position.x <= bounds.xMax &&
    position.y >= bounds.yMin &&
    position.y <= bounds.yMax &&
    position.z >= bounds.zMin &&
    position.z <= bounds.zMax;

  const targetBounds =
    H_EARTH_3D_CAMERA_CAPACITY
      .futureControllerCapacity
      .targetBounds;

  const targetWithinCapacity =
    target.x >= targetBounds.xMin &&
    target.x <= targetBounds.xMax &&
    target.y >= targetBounds.yMin &&
    target.y <= targetBounds.yMax &&
    target.z >= targetBounds.zMin &&
    target.z <= targetBounds.zMax;

  const vectorLength = (vector) =>
    Math.hypot(
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

/**
 * /showroom/globe/h-earth/capacity.js
 * COMPLETE BOUNDED AUTHORITY WRAPPER
 *
 * H_EARTH_3D_CAPACITY_CAMERA_ENVELOPE_AND_LIVING_PRESENTATION_STANDARD_v1
 *
 * This wrapper preserves the complete prior capacity implementation in
 * ./capacity.base.js and overrides only the camera envelope, camera-state
 * evaluator, decision-facing capacity aggregates, and the bounded
 * living-presentation standard.
 *
 * It does not alter admitted geometry, shoreline identity, renderer
 * projection mathematics, compositor authority, controller authority,
 * traversal, collision, gameplay, or fluid simulation.
 */

import * as BaseCapacity from './capacity.base.js';

export * from './capacity.base.js';

const deepFreeze = (
  value,
  seen = new WeakSet()
) => {
  if (
    value === null ||
    typeof value !== 'object' ||
    Object.isFrozen(value)
  ) {
    return value;
  }

  if (seen.has(value)) {
    return value;
  }

  seen.add(value);

  for (const nestedValue of Object.values(value)) {
    deepFreeze(nestedValue, seen);
  }

  return Object.freeze(value);
};

const isFiniteNumber = (value) =>
  typeof value === 'number' &&
  Number.isFinite(value);

const clamp = (
  value,
  minimum,
  maximum
) =>
  Math.min(
    maximum,
    Math.max(
      minimum,
      value
    )
  );

const createCheck = (
  id,
  passed,
  details = null
) =>
  deepFreeze({
    id,
    passed: passed === true,
    details
  });

const createIssue = (
  code,
  message,
  details = null,
  severity = 'ERROR'
) =>
  deepFreeze({
    code,
    severity,
    message,
    details
  });

export const H_EARTH_3D_CAMERA_ENVELOPE_CORRECTION_ID =
  'H_EARTH_LANDWARD_GROUND_INSPECTION_CAMERA_ENVELOPE_v1';

export const H_EARTH_3D_CAMERA_CAPACITY =
  deepFreeze({
    ...BaseCapacity.H_EARTH_3D_CAMERA_CAPACITY,

    initialProjectionCandidate: deepFreeze({
      ...BaseCapacity.H_EARTH_3D_CAMERA_CAPACITY
        .initialProjectionCandidate,

      position: deepFreeze({
        x: 0,
        y: 14,
        z: -240
      }),

      target: deepFreeze({
        x: 0,
        y: 0.6,
        z: -48
      }),

      up: deepFreeze({
        x: 0,
        y: 1,
        z: 0
      }),

      verticalFovDegrees: 60,
      nearPlane: 0.25,
      farPlane: 512,

      cameraStateAuthority:
        'COMPOSITOR',

      projectionAuthority:
        'RENDERER'
    })
  });

export const H_EARTH_3D_CAMERA_COMPOSITION_INTENT =
  deepFreeze({
    compositionId:
      H_EARTH_3D_CAMERA_ENVELOPE_CORRECTION_ID,

    compositionRole:
      'LANDWARD_GROUND_INSPECTION_LOOKING_WATERWARD',

    cameraSide:
      'LAND_SIDE_NEGATIVE_Z',

    viewDirection:
      'TOWARD_POSITIVE_Z_WATER_SIDE',

    shorelineReferenceZ: -96,

    wetSandForegroundRequired: true,
    foamContactSeamRequired: true,
    waterRecessionRequired: true,
    futureContextDepthReserved: true,

    admittedGeometryMutationPermitted: false,
    animationStandardPreparationOnly: true
  });

export const H_EARTH_3D_LIVING_PRESENTATION_CAPACITY_ID =
  'H_EARTH_MINIMUM_SHORELINE_LIVING_PRESENTATION_CAPACITY_v1';

export const H_EARTH_3D_LIVING_PRESENTATION_CAPACITY =
  deepFreeze({
    capacityId:
      H_EARTH_3D_LIVING_PRESENTATION_CAPACITY_ID,

    status:
      'CAPACITY_STANDARD_DEFINED_RUNTIME_NOT_CREATED',

    sourceObjectIds: deepFreeze([
      'OBJ_002_FOREGROUND_WET_SAND',
      'OBJ_005_SHORELINE_FOAM_LINE',
      'OBJ_007_WATER_SURFACE_PLANE'
    ]),

    geometryBoundary: deepFreeze({
      admittedGeometryMutationPermitted: false,
      admittedVertexMutationPermitted: false,
      admittedIndexMutationPermitted: false,
      admittedBoundsMutationPermitted: false,
      primitiveIdentityMutationPermitted: false,
      sourceObjectIdentityMutationPermitted: false,
      sharedShorelineBoundaryMutationPermitted: false,
      materialPresentationMutationPermitted: true
    }),

    scheduler: deepFreeze({
      singleCoordinatorRequired: true,
      requestAnimationFrameRequired: true,
      maximumActiveFramesPerSecond: 30,
      nominalFrameIntervalMilliseconds:
        1000 / 30,
      maximumMainThreadWorkMillisecondsPerFrame: 8,
      unboundedTimersPermitted: false,
      duplicateAnimationLoopsPermitted: false,
      deterministicPhaseSeedsRequired: true
    }),

    suspension: deepFreeze({
      suspendWhenDocumentHidden: true,
      suspendWhenStageOffscreen: true,
      suspendOnPageHide: true,
      controlledResumeRequired: true,
      backgroundAnimationWorkPermitted: false
    }),

    reducedMotion: deepFreeze({
      operatingSystemPreferenceRequired: true,
      staticEquivalentRequired: true,
      animationLoopsMustStop: true,
      timersMustStop: true,
      semanticInformationMustRemainAvailable: true
    }),

    permittedMotionChannels: deepFreeze([
      'TRANSFORM',
      'OPACITY',
      'BACKGROUND_POSITION',
      'BOUNDED_CSS_CUSTOM_PROPERTY'
    ]),

    prohibitedMotionChannels: deepFreeze([
      'LAYOUT_GEOMETRY',
      'DOM_NODE_CHURN',
      'ADMITTED_VERTEX_REWRITE',
      'ADMITTED_INDEX_REWRITE',
      'SHORELINE_BOUNDARY_REWRITE',
      'PHYSICAL_FLUID_SIMULATION'
    ]),

    materialMotionIntent: deepFreeze({
      wetSand:
        'SUBTLE_REFLECTED_LIGHT_AND_DAMP_SHEEN_VARIATION',

      foam:
        'GENTLE_CONTACT_BRIGHTNESS_AND_LATERAL_PHASE_MOTION',

      water:
        'SLOW_SURFACE_SHIMMER_AND_DIRECTIONAL_HIGHLIGHT_DRIFT'
    }),

    qualityCapacity: deepFreeze({
      maximumConcurrentMaterialAnimations: 3,
      devicePixelRatioMustRemainWithinViewportCapacity: true,
      adaptiveQualityPermitted: true,
      frameCostSamplingRequired: true,
      qualityMayDecreaseToProtectFrameBudget: true,
      qualityMayIncreaseOnlyWithinDeclaredCapacity: true
    }),

    lifecycleStates: deepFreeze([
      'IDLE',
      'RUNNING',
      'SUSPENDED',
      'REDUCED_MOTION_STATIC',
      'DISPOSED'
    ]),

    claimCeilings: deepFreeze({
      animationRuntimeCreated: false,
      animationExecuted: false,
      fluidSimulationCreated: false,
      physicalWaveSimulationCreated: false,
      weatherSimulationCreated: false,
      traversalCreated: false,
      gameplayCreated: false,
      visualPassClaim: false,
      productionClaim: false
    })
  });

export function evaluateHEarth3DCameraCapacity(
  cameraCandidate = {}
) {
  const issues = [];
  const checks = [];

  const controllerCapacity =
    H_EARTH_3D_CAMERA_CAPACITY
      .futureControllerCapacity;

  const requiredFiniteFields = [
    ['yawDegrees', cameraCandidate.yawDegrees],
    ['pitchDegrees', cameraCandidate.pitchDegrees],
    ['zoomScale', cameraCandidate.zoomScale],
    [
      'verticalFovDegrees',
      cameraCandidate.verticalFovDegrees
    ],
    ['nearPlane', cameraCandidate.nearPlane],
    ['farPlane', cameraCandidate.farPlane],
    ['target.x', cameraCandidate.target?.x],
    ['target.y', cameraCandidate.target?.y],
    ['target.z', cameraCandidate.target?.z]
  ];

  for (const [field, value] of requiredFiniteFields) {
    const passed =
      isFiniteNumber(value);

    checks.push(
      createCheck(
        `CAMERA_${field
          .toUpperCase()
          .replace('.', '_')}_FINITE`,
        passed,
        value
      )
    );

    if (!passed) {
      issues.push(
        createIssue(
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
      checks: deepFreeze(checks),
      issues: deepFreeze(issues),
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
    createCheck(
      'CAMERA_YAW_WITHIN_CAPACITY',
      yawWithinCapacity,
      cameraCandidate.yawDegrees
    ),
    createCheck(
      'CAMERA_PITCH_WITHIN_CAPACITY',
      pitchWithinCapacity,
      cameraCandidate.pitchDegrees
    ),
    createCheck(
      'CAMERA_ZOOM_WITHIN_CAPACITY',
      zoomWithinCapacity,
      cameraCandidate.zoomScale
    ),
    createCheck(
      'CAMERA_TARGET_WITHIN_CAPACITY',
      targetWithinCapacity,
      cameraCandidate.target
    ),
    createCheck(
      'CAMERA_FOV_WITHIN_CAPACITY',
      fovWithinCapacity,
      cameraCandidate.verticalFovDegrees
    ),
    createCheck(
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
      createIssue(
        'CAMERA_YAW_OUTSIDE_CAPACITY',
        'Camera yaw falls outside capacity.',
        cameraCandidate.yawDegrees
      )
    );
  }

  if (!pitchWithinCapacity) {
    issues.push(
      createIssue(
        'CAMERA_PITCH_OUTSIDE_CAPACITY',
        'Camera pitch falls outside capacity.',
        cameraCandidate.pitchDegrees
      )
    );
  }

  if (!zoomWithinCapacity) {
    issues.push(
      createIssue(
        'CAMERA_ZOOM_OUTSIDE_CAPACITY',
        'Camera zoom scale falls outside capacity.',
        cameraCandidate.zoomScale
      )
    );
  }

  if (!targetWithinCapacity) {
    issues.push(
      createIssue(
        'CAMERA_TARGET_OUTSIDE_CAPACITY',
        'Camera target falls outside capacity.',
        cameraCandidate.target
      )
    );
  }

  if (!fovWithinCapacity) {
    issues.push(
      createIssue(
        'CAMERA_FOV_OUTSIDE_CAPACITY',
        'Camera vertical field of view falls outside capacity.',
        cameraCandidate.verticalFovDegrees
      )
    );
  }

  if (!planesEligible) {
    issues.push(
      createIssue(
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
    checks: deepFreeze(checks),
    issues: deepFreeze(issues),
    normalizedCameraState,
    adjustmentRequired:
      JSON.stringify(cameraCandidate) !==
      JSON.stringify(normalizedCameraState)
  });
}

export function evaluateHEarth3DInteractionIntent(
  intent = {}
) {
  if (
    intent?.type !==
      'H_EARTH_COMPOSITOR_INTENT_SET_CAMERA_STATE'
  ) {
    return BaseCapacity
      .evaluateHEarth3DInteractionIntent(
        intent
      );
  }

  const cameraEvaluation =
    evaluateHEarth3DCameraCapacity(
      intent.cameraState ?? {}
    );

  return deepFreeze({
    eligible:
      cameraEvaluation.eligible,

    status:
      cameraEvaluation.eligible
        ? 'CONTROLLER_INTENT_ELIGIBLE'
        : 'CONTROLLER_INTENT_NOT_ELIGIBLE',

    intentType:
      intent.type,

    checks: deepFreeze([
      createCheck(
        'CONTROLLER_INTENT_TYPE_PRESENT',
        true,
        intent.type
      ),
      createCheck(
        'CONTROLLER_INTENT_TYPE_ACCEPTED',
        true,
        intent.type
      ),
      createCheck(
        'CONTROLLER_INTENT_CAMERA_STATE_ELIGIBLE',
        cameraEvaluation.eligible,
        cameraEvaluation
      )
    ]),

    issues:
      cameraEvaluation.issues
  });
}

export function evaluateHEarth3DControllerIntentEligibility(
  intent = {}
) {
  return evaluateHEarth3DInteractionIntent(
    intent
  );
}

export const H_EARTH_3D_CAPACITY_PREFLIGHT =
  deepFreeze({
    ...BaseCapacity.H_EARTH_3D_CAPACITY_PREFLIGHT,

    checks: deepFreeze([
      ...BaseCapacity.H_EARTH_3D_CAPACITY_PREFLIGHT.checks,
      createCheck(
        'LANDWARD_CAMERA_ENVELOPE_DEFINED',
        true,
        H_EARTH_3D_CAMERA_ENVELOPE_CORRECTION_ID
      ),
      createCheck(
        'LIVING_PRESENTATION_CAPACITY_DEFINED',
        true,
        H_EARTH_3D_LIVING_PRESENTATION_CAPACITY_ID
      ),
      createCheck(
        'ANIMATION_RUNTIME_WITHHELD',
        H_EARTH_3D_LIVING_PRESENTATION_CAPACITY
          .claimCeilings
          .animationRuntimeCreated === false
      )
    ]),

    issues:
      BaseCapacity.H_EARTH_3D_CAPACITY_PREFLIGHT.issues,

    eligible:
      BaseCapacity.H_EARTH_3D_CAPACITY_PREFLIGHT.eligible === true,

    status:
      BaseCapacity.H_EARTH_3D_CAPACITY_PREFLIGHT.eligible === true
        ? 'FRAME_BASED_CAPACITY_AND_LIVING_PRESENTATION_PREFLIGHT_ELIGIBLE'
        : 'FRAME_BASED_CAPACITY_AND_LIVING_PRESENTATION_PREFLIGHT_NOT_ELIGIBLE'
  });

export const H_EARTH_3D_CAPACITY_RECEIPT =
  deepFreeze({
    ...BaseCapacity.H_EARTH_3D_CAPACITY_RECEIPT,

    file:
      '/showroom/globe/h-earth/capacity.js',

    implementationBaseFile:
      '/showroom/globe/h-earth/capacity.base.js',

    cameraEnvelopeCorrectionId:
      H_EARTH_3D_CAMERA_ENVELOPE_CORRECTION_ID,

    cameraEnvelopeDefined: true,

    cameraCompositionIntentDefined: true,

    livingPresentationCapacityId:
      H_EARTH_3D_LIVING_PRESENTATION_CAPACITY_ID,

    livingPresentationCapacityDefined: true,

    animationRuntimeCreated: false,

    capacityPreflightStatus:
      H_EARTH_3D_CAPACITY_PREFLIGHT.status,

    capacityPreflightEligible:
      H_EARTH_3D_CAPACITY_PREFLIGHT.eligible,

    nextRequired:
      'IMPLEMENT_BOUNDED_MINIMUM_SHORELINE_LIVING_PRESENTATION_RUNTIME'
  });

export const H_EARTH_3D_CAPACITY_CONTRACT =
  deepFreeze({
    ...BaseCapacity.H_EARTH_3D_CAPACITY_CONTRACT,

    file:
      '/showroom/globe/h-earth/capacity.js',

    implementationBaseFile:
      '/showroom/globe/h-earth/capacity.base.js',

    cameraCapacity:
      H_EARTH_3D_CAMERA_CAPACITY,

    cameraCompositionIntent:
      H_EARTH_3D_CAMERA_COMPOSITION_INTENT,

    livingPresentationCapacity:
      H_EARTH_3D_LIVING_PRESENTATION_CAPACITY,

    preflight:
      H_EARTH_3D_CAPACITY_PREFLIGHT
  });

export function getHEarth3DCapacityContract() {
  return H_EARTH_3D_CAPACITY_CONTRACT;
}

export function getHEarth3DCapacityReceipt() {
  return H_EARTH_3D_CAPACITY_RECEIPT;
}

export function getHEarth3DCapacityPreflight() {
  return H_EARTH_3D_CAPACITY_PREFLIGHT;
}

export const H_EARTH_3D_PUBLIC_STAGE_CAPACITY =
  H_EARTH_3D_CAPACITY_CONTRACT;

export default H_EARTH_3D_CAPACITY_CONTRACT;

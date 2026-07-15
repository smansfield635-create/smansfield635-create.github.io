/**
 * /showroom/globe/h-earth/renderer.js
 * COMPLETE RENEWED FILE
 *
 * H_EARTH_3D_RENDERER_FILE_RENEWAL_STEP_034O_9_ADMITTED_GEOMETRY_FRAME_MATERIALIZATION_v1
 *
 * Frozen Canon:
 *
 * COMPOSITOR RENDERER HANDOFF
 * → ADMITTED GEOMETRY FRAME VALIDATION
 * → FRAME OCCURRENCE CORRESPONDENCE
 * → ADMITTED PRIMITIVE PROJECTION
 * → PRESENTATION ASSIGNMENT CORRELATION
 * → DOM/CSS RESOURCE CONSTRUCTION
 * → MOUNT / APPLY FRAME / REPROJECT / DESTROY
 * → RENDERER RECEIPTS
 *
 * Canonical public input:
 *
 * {
 *   ok: true,
 *   admittedGeometryFrame: <lawful admitted frame>
 * }
 *
 * This file owns:
 * - compositor-handoff consumption;
 * - admitted-frame validation at the renderer boundary;
 * - frame occurrence and revision application law;
 * - projection of already-admitted vertices;
 * - projected point, line, and triangle construction;
 * - presentation-assignment consumption;
 * - renderer-owned DOM/CSS resources;
 * - renderer mount, frame replacement, reprojection, and destroy lifecycle;
 * - renderer operational receipts.
 *
 * This file does not own:
 * - Packet 002 construction;
 * - admitted-frame construction;
 * - geometry construction;
 * - geometry admission;
 * - admitted-coordinate mutation;
 * - admitted-index mutation;
 * - admitted-bounds mutation;
 * - camera state;
 * - viewport state;
 * - visibility state;
 * - compositor revisions;
 * - route bootstrap;
 * - controller behavior;
 * - diagnostic judgment;
 * - renderer-pass approval;
 * - visual-pass approval;
 * - production validation.
 */

import {
  H_EARTH_3D_CAPACITY_CONTRACT_ID,
  H_EARTH_3D_PUBLIC_STAGE_IDS,
  H_EARTH_3D_RENDER_STAGE_LIMITS,
  evaluateHEarth3DNodeBudget
} from './capacity.js';

import {
  H_EARTH_3D_COMPOSITOR_CONTRACT_ID
} from './compositor.js';

import {
  H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID,
  isHEarth3DAdmittedGeometryFrame,
  getHEarth3DAdmittedGeometryFrameContract,
  getHEarth3DAdmittedGeometryFrameReceipt
} from './admitted-geometry-frame.js';


/* ==========================================================================
 * 01 · CONTRACT IDENTITY
 * ========================================================================== */

export const H_EARTH_3D_RENDERER_CONTRACT_ID =
  'H_EARTH_3D_RENDERER_FILE_RENEWAL_STEP_034O_9_ADMITTED_GEOMETRY_FRAME_MATERIALIZATION_v1';

export const H_EARTH_3D_RENDERER_SCHEMA_VERSION =
  2;

export const H_EARTH_3D_RENDERER_SOURCE_FILE =
  '/showroom/globe/h-earth/renderer.js';

export const H_EARTH_3D_RENDERER_ROLE =
  'ADMITTED_GEOMETRY_FRAME_PROJECTION_AND_DOM_CSS_MATERIALIZATION_CONSUMER';

export const H_EARTH_3D_RENDERER_STATUS =
  'FROZEN_CANON_RENEWAL_CANDIDATE';

const RENEWS_RENDERER_CONTRACT_ID =
  'H_EARTH_3D_RENDERER_FILE_RENEWAL_STEP_034O_1_ENVIRONMENT_GEOMETRY_MATERIALIZATION_v1';

const EMPTY_FROZEN_ARRAY =
  Object.freeze([]);

const EMPTY_FROZEN_RECORD =
  Object.freeze({});

const FRAME_APPLICATION_STATUS =
  Object.freeze({
    FIRST_FRAME:
      'FIRST_FRAME',

    REPLACEMENT_FRAME:
      'REPLACEMENT_FRAME',

    DUPLICATE_FRAME:
      'DUPLICATE_FRAME',

    STALE_FRAME:
      'STALE_FRAME',

    REVISION_REGRESSION:
      'REVISION_REGRESSION',

    INVALID_FRAME:
      'INVALID_FRAME'
  });

const TOPOLOGY_MODE =
  Object.freeze({
    POINTS:
      'POINTS',

    LINES:
      'LINES',

    LINE_LIST:
      'LINE_LIST',

    LINE_STRIP:
      'LINE_STRIP',

    TRIANGLES:
      'TRIANGLES',

    TRIANGLE_LIST:
      'TRIANGLE_LIST',

    TRIANGLE_STRIP:
      'TRIANGLE_STRIP',

    TRIANGLE_FAN:
      'TRIANGLE_FAN'
  });


/* ==========================================================================
 * 02 · GENERIC HELPERS
 * ========================================================================== */

function isPlainRecord(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    Array.isArray(value) === false &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function isFiniteNumber(value) {
  return (
    typeof value === 'number' &&
    Number.isFinite(value)
  );
}

function isPositiveFiniteNumber(value) {
  return (
    isFiniteNumber(value) &&
    value > 0
  );
}

function isNonNegativeSafeInteger(value) {
  return (
    Number.isSafeInteger(value) &&
    value >= 0
  );
}

function isNonEmptyExactString(value) {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value.trim() === value
  );
}

function deepFreeze(
  value,
  seen = new WeakSet()
) {
  if (
    value === null ||
    typeof value !== 'object'
  ) {
    return value;
  }

  if (seen.has(value)) {
    return value;
  }

  seen.add(value);

  for (
    const key
    of Reflect.ownKeys(value)
  ) {
    const descriptor =
      Object.getOwnPropertyDescriptor(
        value,
        key
      );

    if (
      descriptor &&
      Object.prototype.hasOwnProperty.call(
        descriptor,
        'value'
      )
    ) {
      deepFreeze(
        descriptor.value,
        seen
      );
    }
  }

  if (!Object.isFrozen(value)) {
    Object.freeze(value);
  }

  return value;
}

function cloneKnownPlain(value) {
  if (
    value === null ||
    typeof value !== 'object'
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(
      cloneKnownPlain
    );
  }

  const output = {};

  for (
    const [key, nestedValue]
    of Object.entries(value)
  ) {
    output[key] =
      cloneKnownPlain(
        nestedValue
      );
  }

  return output;
}

function cloneAndFreeze(value) {
  return deepFreeze(
    cloneKnownPlain(
      value
    )
  );
}

function clamp(
  value,
  minimum,
  maximum
) {
  return Math.min(
    maximum,
    Math.max(
      minimum,
      value
    )
  );
}

function toRadians(degrees) {
  return (
    degrees *
    Math.PI /
    180
  );
}

function round(
  value,
  precision = 4
) {
  const factor =
    10 ** precision;

  return (
    Math.round(
      value *
      factor
    ) /
    factor
  );
}

function createRendererIssue(
  code,
  message,
  {
    field = null,
    expected = null,
    actual = null,
    details = null,
    severity = 'ERROR'
  } = {}
) {
  return deepFreeze({
    code,
    severity,
    message,
    field,
    expected,
    actual,
    details
  });
}

function freezeIssues(issues) {
  return Object.freeze(
    issues.map(
      (issue) =>
        createRendererIssue(
          issue.code,
          issue.message,
          issue
        )
    )
  );
}

function setStyles(
  element,
  styles
) {
  for (
    const [property, value]
    of Object.entries(styles)
  ) {
    if (
      value !== null &&
      value !== undefined
    ) {
      element.style[property] =
        String(value);
    }
  }

  return element;
}

function createVector(
  x = 0,
  y = 0,
  z = 0
) {
  return {
    x,
    y,
    z
  };
}

function isVector3(value) {
  return (
    isPlainRecord(value) &&
    isFiniteNumber(value.x) &&
    isFiniteNumber(value.y) &&
    isFiniteNumber(value.z)
  );
}

function subtractVector(
  left,
  right
) {
  return createVector(
    left.x - right.x,
    left.y - right.y,
    left.z - right.z
  );
}

function scaleVector(
  vector,
  scalar
) {
  return createVector(
    vector.x * scalar,
    vector.y * scalar,
    vector.z * scalar
  );
}

function dotVector(
  left,
  right
) {
  return (
    left.x * right.x +
    left.y * right.y +
    left.z * right.z
  );
}

function crossVector(
  left,
  right
) {
  return createVector(
    left.y * right.z -
      left.z * right.y,

    left.z * right.x -
      left.x * right.z,

    left.x * right.y -
      left.y * right.x
  );
}

function getVectorLength(vector) {
  return Math.hypot(
    vector.x,
    vector.y,
    vector.z
  );
}

function normalizeVector(vector) {
  const length =
    getVectorLength(vector);

  if (
    !isFiniteNumber(length) ||
    length <= Number.EPSILON
  ) {
    return createVector(
      0,
      0,
      0
    );
  }

  return scaleVector(
    vector,
    1 / length
  );
}

function arraysEqual(
  left,
  right
) {
  return (
    Array.isArray(left) &&
    Array.isArray(right) &&
    left.length === right.length &&
    left.every(
      (value, index) =>
        value === right[index]
    )
  );
}


/* ==========================================================================
 * 03 · DEPENDENCY SNAPSHOTS
 * ========================================================================== */

const ADMITTED_FRAME_CONTRACT =
  getHEarth3DAdmittedGeometryFrameContract();

const ADMITTED_FRAME_RECEIPT =
  getHEarth3DAdmittedGeometryFrameReceipt();

const RENDERER_MOUNT_ID =
  H_EARTH_3D_PUBLIC_STAGE_IDS
    ?.rendererMountId ??
  'h-earth-3d-renderer-mount';

const PERMITTED_OUTPUT_MODEL =
  H_EARTH_3D_RENDER_STAGE_LIMITS
    ?.permittedOutputModel ??
  null;


/* ==========================================================================
 * 04 · BOUNDARY FLAGS
 * ========================================================================== */

export const H_EARTH_3D_RENDERER_BOUNDARY_FLAGS =
  deepFreeze({
    consumesCompositorRendererHandoff:
      true,

    consumesAdmittedGeometryFrame:
      true,

    directlyValidatesAdmittedGeometryFrame:
      true,

    ownsProjectionMathematics:
      true,

    ownsProjectedPrimitiveConstruction:
      true,

    ownsDOMCSSMaterialization:
      true,

    ownsRendererResourceLifecycle:
      true,

    ownsRendererFrameApplicationLaw:
      true,

    ownsRendererReceipts:
      true,

    ownsPacket002Construction:
      false,

    ownsAdmittedFrameConstruction:
      false,

    ownsGeometryConstruction:
      false,

    ownsWestAdmission:
      false,

    ownsGeometryIndex:
      false,

    ownsCameraState:
      false,

    ownsViewportState:
      false,

    ownsVisibilityState:
      false,

    ownsCompositorRevisions:
      false,

    ownsRouteBootstrap:
      false,

    ownsControllerBehavior:
      false,

    ownsDiagnosticJudgment:
      false,

    reconstructsSourceGeometry:
      false,

    altersAdmittedCoordinates:
      false,

    altersAdmittedIndices:
      false,

    altersAdmittedBounds:
      false,

    altersPrimitiveIdentity:
      false,

    mutatesInputHandoff:
      false,

    mutatesInputFrame:
      false,

    createsActor:
      false,

    createsCollisionSystem:
      false,

    createsGroundContactSystem:
      false,

    createsTraversalSystem:
      false,

    createsGameplayLoop:
      false,

    createsFluidSimulation:
      false,

    runtimeActivationClaim:
      false,

    rendererPassClaim:
      false,

    visualPassClaim:
      false,

    validationClaim:
      false,

    productionClaim:
      false,

    matrixCollapse:
      false
  });


/* ==========================================================================
 * 05 · MATERIAL PRESENTATION
 * ========================================================================== */

export const H_EARTH_3D_RENDERER_MATERIAL_PRESENTATION =
  deepFreeze({
    H_EARTH_MATERIAL_WET_SAND:
      deepFreeze({
        background:
          'linear-gradient(180deg, #656158 0%, #504e48 46%, #383b39 100%)',

        boxShadow:
          'inset 0 1px 0 rgba(215,224,216,0.10), 0 2px 5px rgba(17,23,22,0.24)',

        opacity:
          1
      }),

    H_EARTH_MATERIAL_DRY_SAND:
      deepFreeze({
        background:
          'linear-gradient(180deg, #a18d69 0%, #806f55 55%, #655a49 100%)',

        opacity:
          1
      }),

    H_EARTH_MATERIAL_STONE:
      deepFreeze({
        background:
          'linear-gradient(145deg, #79766d 0%, #55564f 54%, #343936 100%)',

        opacity:
          1
      }),

    H_EARTH_MATERIAL_NEARSHORE_WATER:
      deepFreeze({
        background:
          'linear-gradient(180deg, rgba(68,132,148,0.94) 0%, rgba(34,91,111,0.96) 100%)',

        opacity:
          0.94
      }),

    H_EARTH_MATERIAL_OPEN_WATER:
      deepFreeze({
        background:
          'linear-gradient(180deg, #2f7084 0%, #1f5369 55%, #143d53 100%)',

        opacity:
          0.96
      }),

    H_EARTH_MATERIAL_FOAM:
      deepFreeze({
        background:
          'linear-gradient(180deg, rgba(241,243,232,0.94) 0%, rgba(193,211,207,0.76) 100%)',

        opacity:
          0.9
      }),

    H_EARTH_MATERIAL_DEFAULT:
      deepFreeze({
        background:
          'linear-gradient(180deg, #6c746f 0%, #454c48 100%)',

        opacity:
          1
      })
  });


/* ==========================================================================
 * 06 · RENDERER STAGE MODEL
 * ========================================================================== */

export const H_EARTH_3D_RENDERER_STAGE_MODEL =
  deepFreeze({
    permittedOutputModel:
      PERMITTED_OUTPUT_MODEL,

    rendererMountId:
      RENDERER_MOUNT_ID,

    stageClass:
      'h-earth-3d-render-stage',

    sceneClass:
      'h-earth-3d-render-scene',

    primitiveClass:
      'h-earth-3d-render-primitive',

    pointClass:
      'h-earth-3d-render-point',

    lineClass:
      'h-earth-3d-render-line',

    triangleClass:
      'h-earth-3d-render-triangle',

    DOMAuthorized:
      H_EARTH_3D_RENDER_STAGE_LIMITS
        ?.domAuthorized === true,

    CSSAuthorized:
      H_EARTH_3D_RENDER_STAGE_LIMITS
        ?.cssAuthorized === true,

    CSSClipPathAuthorized:
      H_EARTH_3D_RENDER_STAGE_LIMITS
        ?.cssClipPathAuthorized === true,

    webGLAuthorized:
      false,

    canvasAuthorized:
      false,

    iframeAuthorized:
      false,

    SVGAuthorized:
      false
  });


/* ==========================================================================
 * 07 · INTERNAL RENDERER STATE
 * ========================================================================== */

const rendererState = {
  constructed:
    false,

  mounted:
    false,

  mountElement:
    null,

  stageElement:
    null,

  sceneElement:
    null,

  primitiveElements:
    [],

  currentHandoff:
    null,

  currentFrame:
    null,

  currentFrameOccurrenceId:
    null,

  currentFrameRevision:
    null,

  currentCameraRevision:
    null,

  currentViewportRevision:
    null,

  currentVisibilityRevision:
    null,

  currentProjectionContext:
    null,

  constructSequence:
    0,

  mountSequence:
    0,

  applySequence:
    0,

  reprojectSequence:
    0,

  destroySequence:
    0,

  lastConstructReceipt:
    null,

  lastMountReceipt:
    null,

  lastApplyReceipt:
    null,

  lastReprojectReceipt:
    null,

  lastDestroyReceipt:
    null
};


/* ==========================================================================
 * 08 · HANDOFF AND FRAME VALIDATION
 * ========================================================================== */

function evaluateCompositorHandoff(
  handoff
) {
  const issues = [];

  if (!isPlainRecord(handoff)) {
    return deepFreeze({
      eligible:
        false,

      status:
        'RENDERER_HANDOFF_NOT_ELIGIBLE',

      handoff:
        null,

      frame:
        null,

      issues:
        freezeIssues([
          createRendererIssue(
            'RENDERER_HANDOFF_NOT_RECORD',
            'The renderer requires a strict compositor-handoff record.'
          )
        ])
    });
  }

  if (handoff.ok !== true) {
    issues.push(
      createRendererIssue(
        'RENDERER_HANDOFF_NOT_READY',
        'The compositor handoff must expose ok === true.',
        {
          field:
            'ok',

          actual:
            handoff.ok
        }
      )
    );
  }

  if (
    handoff.contractId !==
    H_EARTH_3D_COMPOSITOR_CONTRACT_ID
  ) {
    issues.push(
      createRendererIssue(
        'COMPOSITOR_CONTRACT_ID_MISMATCH',
        'The renderer handoff does not identify the backed compositor contract.',
        {
          expected:
            H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

          actual:
            handoff.contractId ??
            null
        }
      )
    );
  }

  if (
    handoff.admittedGeometryFrameContractId !==
    H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID
  ) {
    issues.push(
      createRendererIssue(
        'ADMITTED_FRAME_CONTRACT_ID_MISMATCH',
        'The renderer handoff does not identify the backed admitted-frame contract.',
        {
          expected:
            H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID,

          actual:
            handoff.admittedGeometryFrameContractId ??
            null
        }
      )
    );
  }

  const frame =
    handoff.admittedGeometryFrame;

  if (
    !isHEarth3DAdmittedGeometryFrame(
      frame
    )
  ) {
    issues.push(
      createRendererIssue(
        'ADMITTED_GEOMETRY_FRAME_INVALID',
        'The renderer handoff does not carry a lawful admitted geometry frame.',
        {
          field:
            'admittedGeometryFrame'
        }
      )
    );
  }

  if (
    frame?.rendererConsumerEligibility !==
    true
  ) {
    issues.push(
      createRendererIssue(
        'FRAME_RENDERER_CONSUMER_ELIGIBILITY_INVALID',
        'The admitted frame does not authorize renderer consumption.',
        {
          field:
            'admittedGeometryFrame.rendererConsumerEligibility',

          actual:
            frame?.rendererConsumerEligibility ??
            null
        }
      )
    );
  }

  return deepFreeze({
    eligible:
      issues.length === 0,

    status:
      issues.length === 0
        ? 'RENDERER_HANDOFF_ELIGIBLE'
        : 'RENDERER_HANDOFF_NOT_ELIGIBLE',

    handoff:
      issues.length === 0
        ? handoff
        : null,

    frame:
      issues.length === 0
        ? frame
        : null,

    issues:
      freezeIssues(issues)
  });
}

function evaluateFrameApplication(
  frame
) {
  if (
    !isHEarth3DAdmittedGeometryFrame(
      frame
    )
  ) {
    return deepFreeze({
      eligible:
        false,

      status:
        FRAME_APPLICATION_STATUS
          .INVALID_FRAME,

      duplicate:
        false,

      issues:
        freezeIssues([
          createRendererIssue(
            'FRAME_APPLICATION_INPUT_INVALID',
            'Only a lawful admitted geometry frame may be applied.'
          )
        ])
    });
  }

  const occurrenceId =
    frame.compositorFrameOccurrenceId;

  const frameRevision =
    frame.revisions?.frame;

  if (
    !isNonEmptyExactString(
      occurrenceId
    ) ||
    !isNonNegativeSafeInteger(
      frameRevision
    )
  ) {
    return deepFreeze({
      eligible:
        false,

      status:
        FRAME_APPLICATION_STATUS
          .INVALID_FRAME,

      duplicate:
        false,

      issues:
        freezeIssues([
          createRendererIssue(
            'FRAME_OCCURRENCE_OR_REVISION_INVALID',
            'The admitted frame must carry an exact occurrence identity and nonnegative frame revision.'
          )
        ])
    });
  }

  if (rendererState.currentFrame === null) {
    return deepFreeze({
      eligible:
        true,

      status:
        FRAME_APPLICATION_STATUS
          .FIRST_FRAME,

      duplicate:
        false,

      issues:
        EMPTY_FROZEN_ARRAY
    });
  }

  if (
    occurrenceId ===
      rendererState.currentFrameOccurrenceId &&
    frameRevision ===
      rendererState.currentFrameRevision
  ) {
    const exactDuplicate =
      frame ===
      rendererState.currentFrame;

    return deepFreeze({
      eligible:
        exactDuplicate,

      status:
        exactDuplicate
          ? FRAME_APPLICATION_STATUS
              .DUPLICATE_FRAME
          : FRAME_APPLICATION_STATUS
              .STALE_FRAME,

      duplicate:
        exactDuplicate,

      issues:
        exactDuplicate
          ? EMPTY_FROZEN_ARRAY
          : freezeIssues([
              createRendererIssue(
                'FRAME_OCCURRENCE_REUSED_WITH_DIFFERENT_IDENTITY',
                'An existing occurrence identity and frame revision may not be reused for a different frame object.'
              )
            ])
    });
  }

  if (
    frameRevision <
    rendererState.currentFrameRevision
  ) {
    return deepFreeze({
      eligible:
        false,

      status:
        FRAME_APPLICATION_STATUS
          .REVISION_REGRESSION,

      duplicate:
        false,

      issues:
        freezeIssues([
          createRendererIssue(
            'FRAME_REVISION_REGRESSION',
            'A frame with an older compositor frame revision cannot replace the current renderer frame.',
            {
              expected:
                rendererState.currentFrameRevision,

              actual:
                frameRevision
            }
          )
        ])
    });
  }

  if (
    frameRevision ===
    rendererState.currentFrameRevision
  ) {
    return deepFreeze({
      eligible:
        false,

      status:
        FRAME_APPLICATION_STATUS
          .STALE_FRAME,

      duplicate:
        false,

      issues:
        freezeIssues([
          createRendererIssue(
            'FRAME_REVISION_NOT_ADVANCED',
            'A different frame occurrence must advance the compositor frame revision.'
          )
        ])
    });
  }

  return deepFreeze({
    eligible:
      true,

    status:
      FRAME_APPLICATION_STATUS
        .REPLACEMENT_FRAME,

    duplicate:
      false,

    issues:
      EMPTY_FROZEN_ARRAY
  });
}


/* ==========================================================================
 * 09 · FRAME-OWNED VIEWPORT AND CAMERA
 * ========================================================================== */

function createViewportFromFrame(
  frame
) {
  const viewport =
    frame.viewportSnapshot;

  if (
    !isPlainRecord(viewport) ||
    !isPositiveFiniteNumber(
      viewport.widthPx
    ) ||
    !isPositiveFiniteNumber(
      viewport.heightPx
    ) ||
    !isPositiveFiniteNumber(
      viewport.pixelRatio
    ) ||
    !isPositiveFiniteNumber(
      viewport.aspectRatio
    ) ||
    viewport.capacityStatus !==
      'WITHIN_CAPACITY'
  ) {
    return null;
  }

  return deepFreeze({
    widthPx:
      viewport.widthPx,

    heightPx:
      viewport.heightPx,

    pixelRatio:
      viewport.pixelRatio,

    aspectRatio:
      viewport.aspectRatio,

    orientation:
      viewport.orientation,

    capacityStatus:
      viewport.capacityStatus
  });
}

function createCameraBasisFromFrame(
  frame
) {
  const pose =
    frame.normalizedResolvedCameraPose;

  if (
    !isPlainRecord(pose) ||
    !isVector3(pose.position) ||
    !isVector3(pose.target) ||
    !isVector3(pose.up) ||
    !isVector3(pose.forward) ||
    !isVector3(pose.right) ||
    !isPositiveFiniteNumber(
      pose.verticalFovDegrees
    ) ||
    !isPositiveFiniteNumber(
      pose.nearPlane
    ) ||
    !isPositiveFiniteNumber(
      pose.farPlane
    )
  ) {
    return null;
  }

  const forward =
    normalizeVector(
      pose.forward
    );

  const right =
    normalizeVector(
      pose.right
    );

  const up =
    normalizeVector(
      pose.up
    );

  if (
    getVectorLength(forward) <=
      Number.EPSILON ||
    getVectorLength(right) <=
      Number.EPSILON ||
    getVectorLength(up) <=
      Number.EPSILON
  ) {
    return null;
  }

  const focalLength =
    1 /
    Math.tan(
      toRadians(
        pose.verticalFovDegrees
      ) /
      2
    );

  return deepFreeze({
    position:
      cloneAndFreeze(
        pose.position
      ),

    target:
      cloneAndFreeze(
        pose.target
      ),

    forward:
      deepFreeze(forward),

    right:
      deepFreeze(right),

    up:
      deepFreeze(up),

    verticalFovDegrees:
      pose.verticalFovDegrees,

    nearPlane:
      pose.nearPlane,

    farPlane:
      pose.farPlane,

    focalLength,

    cameraRevision:
      frame.revisions.camera
  });
}

function createProjectionContextFromFrame(
  frame,
  viewportOverride = null
) {
  const frameViewport =
    createViewportFromFrame(
      frame
    );

  const cameraBasis =
    createCameraBasisFromFrame(
      frame
    );

  if (
    !frameViewport ||
    !cameraBasis
  ) {
    return null;
  }

  const viewport =
    viewportOverride === null
      ? frameViewport
      : deepFreeze({
          widthPx:
            viewportOverride.widthPx,

          heightPx:
            viewportOverride.heightPx,

          pixelRatio:
            frameViewport.pixelRatio,

          aspectRatio:
            viewportOverride.widthPx /
            viewportOverride.heightPx,

          orientation:
            viewportOverride.widthPx ===
              viewportOverride.heightPx
              ? 'SQUARE'
              : viewportOverride.widthPx >
                  viewportOverride.heightPx
                ? 'LANDSCAPE'
                : 'PORTRAIT',

          capacityStatus:
            frameViewport.capacityStatus
        });

  return deepFreeze({
    viewport,
    frameViewport,
    cameraBasis,

    compositorFrameOccurrenceId:
      frame.compositorFrameOccurrenceId,

    compositorFrameRevision:
      frame.revisions.frame,

    cameraRevision:
      frame.revisions.camera,

    viewportRevision:
      frame.revisions.viewport,

    visibilityRevision:
      frame.revisions.visibility
  });
}


/* ==========================================================================
 * 10 · WORLD-SPACE PROJECTION
 * ========================================================================== */

export function projectHEarth3DAdmittedWorldPoint(
  point,
  projectionContext
) {
  if (
    !isVector3(point) ||
    !isPlainRecord(projectionContext) ||
    !isPlainRecord(
      projectionContext.cameraBasis
    ) ||
    !isPlainRecord(
      projectionContext.viewport
    )
  ) {
    return deepFreeze({
      visible:
        false,

      reason:
        'INVALID_POINT_OR_PROJECTION_CONTEXT'
    });
  }

  const cameraBasis =
    projectionContext.cameraBasis;

  const viewport =
    projectionContext.viewport;

  const relative =
    subtractVector(
      point,
      cameraBasis.position
    );

  const cameraX =
    dotVector(
      relative,
      cameraBasis.right
    );

  const cameraY =
    dotVector(
      relative,
      cameraBasis.up
    );

  const cameraZ =
    dotVector(
      relative,
      cameraBasis.forward
    );

  if (
    cameraZ <=
      cameraBasis.nearPlane ||
    cameraZ >=
      cameraBasis.farPlane
  ) {
    return deepFreeze({
      visible:
        false,

      cameraDepth:
        cameraZ,

      reason:
        'OUTSIDE_CAMERA_DEPTH_RANGE'
    });
  }

  const ndcX =
    (
      cameraX *
      cameraBasis.focalLength
    ) /
    (
      cameraZ *
      viewport.aspectRatio
    );

  const ndcY =
    (
      cameraY *
      cameraBasis.focalLength
    ) /
    cameraZ;

  return deepFreeze({
    visible:
      true,

    world:
      deepFreeze({
        x:
          point.x,

        y:
          point.y,

        z:
          point.z
      }),

    camera:
      deepFreeze({
        x:
          cameraX,

        y:
          cameraY,

        z:
          cameraZ
      }),

    ndc:
      deepFreeze({
        x:
          ndcX,

        y:
          ndcY
      }),

    screen:
      deepFreeze({
        x:
          (
            ndcX +
            1
          ) *
          0.5 *
          viewport.widthPx,

        y:
          (
            1 -
            ndcY
          ) *
          0.5 *
          viewport.heightPx
      }),

    cameraDepth:
      cameraZ
  });
}


/* ==========================================================================
 * 11 · ADMITTED GEOMETRY EXTRACTION
 * ========================================================================== */

function getPrimitiveGeometry(
  admittedPrimitive
) {
  return isPlainRecord(
    admittedPrimitive?.geometry
  )
    ? admittedPrimitive.geometry
    : null;
}

function getPrimitiveTopologyMode(
  admittedPrimitive
) {
  const geometry =
    getPrimitiveGeometry(
      admittedPrimitive
    );

  const candidate =
    geometry?.topologyMode ??
    geometry?.topology ??
    geometry?.primitiveMode ??
    null;

  return isNonEmptyExactString(candidate)
    ? candidate
    : null;
}

function getPrimitiveVertices(
  admittedPrimitive
) {
  const geometry =
    getPrimitiveGeometry(
      admittedPrimitive
    );

  const vertices =
    geometry?.vertices;

  if (!Array.isArray(vertices)) {
    return null;
  }

  if (
    vertices.every(
      isVector3
    )
  ) {
    return vertices;
  }

  if (
    vertices.length % 3 === 0 &&
    vertices.every(
      isFiniteNumber
    )
  ) {
    const expanded = [];

    for (
      let index = 0;
      index < vertices.length;
      index += 3
    ) {
      expanded.push(
        deepFreeze({
          x:
            vertices[index],

          y:
            vertices[index + 1],

          z:
            vertices[index + 2]
        })
      );
    }

    return Object.freeze(
      expanded
    );
  }

  return null;
}

function getPrimitiveIndices(
  admittedPrimitive,
  vertexCount
) {
  const geometry =
    getPrimitiveGeometry(
      admittedPrimitive
    );

  const indices =
    geometry?.indices;

  if (
    indices === undefined ||
    indices === null
  ) {
    return Object.freeze(
      Array.from(
        {
          length:
            vertexCount
        },
        (
          _unused,
          index
        ) =>
          index
      )
    );
  }

  if (
    !Array.isArray(indices) ||
    !indices.every(
      (index) =>
        Number.isSafeInteger(index) &&
        index >= 0 &&
        index < vertexCount
    )
  ) {
    return null;
  }

  return indices;
}

function evaluateAdmittedPrimitiveForRenderer(
  admittedPrimitive
) {
  const issues = [];

  if (!isPlainRecord(admittedPrimitive)) {
    issues.push(
      createRendererIssue(
        'ADMITTED_PRIMITIVE_NOT_RECORD',
        'Each admitted primitive must be a strict plain record.'
      )
    );

    return deepFreeze({
      eligible:
        false,

      primitiveId:
        null,

      topologyMode:
        null,

      vertices:
        null,

      indices:
        null,

      issues:
        freezeIssues(issues)
    });
  }

  const primitiveId =
    admittedPrimitive.primitiveId;

  if (
    !isNonEmptyExactString(
      primitiveId
    )
  ) {
    issues.push(
      createRendererIssue(
        'ADMITTED_PRIMITIVE_ID_INVALID',
        'Each admitted primitive must expose an exact primitiveId.',
        {
          field:
            'primitiveId'
        }
      )
    );
  }

  const topologyMode =
    getPrimitiveTopologyMode(
      admittedPrimitive
    );

  if (!topologyMode) {
    issues.push(
      createRendererIssue(
        'ADMITTED_PRIMITIVE_TOPOLOGY_UNRESOLVED',
        'The admitted primitive geometry must expose a topology mode.'
      )
    );
  }

  const vertices =
    getPrimitiveVertices(
      admittedPrimitive
    );

  if (
    !Array.isArray(vertices) ||
    vertices.length === 0
  ) {
    issues.push(
      createRendererIssue(
        'ADMITTED_PRIMITIVE_VERTICES_INVALID',
        'The admitted primitive geometry must expose nonempty finite vertices.'
      )
    );
  }

  const indices =
    Array.isArray(vertices)
      ? getPrimitiveIndices(
          admittedPrimitive,
          vertices.length
        )
      : null;

  if (!Array.isArray(indices)) {
    issues.push(
      createRendererIssue(
        'ADMITTED_PRIMITIVE_INDICES_INVALID',
        'The admitted primitive geometry indices are invalid.'
      )
    );
  }

  return deepFreeze({
    eligible:
      issues.length === 0,

    primitiveId:
      issues.length === 0
        ? primitiveId
        : null,

    topologyMode:
      issues.length === 0
        ? topologyMode
        : null,

    vertices:
      issues.length === 0
        ? vertices
        : null,

    indices:
      issues.length === 0
        ? indices
        : null,

    issues:
      freezeIssues(issues)
  });
}


/* ==========================================================================
 * 12 · PRESENTATION ASSIGNMENT CORRELATION
 * ========================================================================== */

function buildPresentationAssignmentMap(
  frame
) {
  const assignments =
    frame.presentationAssignments;

  if (!Array.isArray(assignments)) {
    return null;
  }

  const map =
    new Map();

  for (const assignment of assignments) {
    if (
      !isPlainRecord(assignment) ||
      !isNonEmptyExactString(
        assignment.primitiveId
      ) ||
      map.has(
        assignment.primitiveId
      )
    ) {
      return null;
    }

    map.set(
      assignment.primitiveId,
      assignment
    );
  }

  return map;
}

function isPresentationAssignmentVisible(
  assignment,
  visibilitySnapshot
) {
  if (
    assignment.visibleEligible !==
    true
  ) {
    return false;
  }

  if (
    !isPlainRecord(
      visibilitySnapshot
    )
  ) {
    return false;
  }

  const role =
    assignment.presentationRole;

  if (
    Object.prototype.hasOwnProperty.call(
      visibilitySnapshot,
      role
    )
  ) {
    return (
      visibilitySnapshot[role] ===
      true
    );
  }

  return true;
}

function getMaterialPresentation(
  assignment
) {
  return (
    H_EARTH_3D_RENDERER_MATERIAL_PRESENTATION[
      assignment.materialReference
    ] ??
    H_EARTH_3D_RENDERER_MATERIAL_PRESENTATION
      .H_EARTH_MATERIAL_DEFAULT
  );
}


/* ==========================================================================
 * 13 · PROJECTED PRIMITIVE DESCRIPTORS
 * ========================================================================== */

function createProjectedPointDescriptor({
  primitiveId,
  assignment,
  sourceVertexIndex,
  projectedPoint
}) {
  return deepFreeze({
    type:
      'POINT',

    primitiveId,

    sourceVertexIndices:
      Object.freeze([
        sourceVertexIndex
      ]),

    assignment,

    cameraDepth:
      projectedPoint.cameraDepth,

    projectedPoints:
      Object.freeze([
        projectedPoint
      ])
  });
}

function createProjectedLineDescriptor({
  primitiveId,
  assignment,
  sourceVertexIndices,
  projectedPoints
}) {
  if (
    projectedPoints.some(
      (point) =>
        point.visible !== true
    )
  ) {
    return null;
  }

  return deepFreeze({
    type:
      'LINE',

    primitiveId,

    sourceVertexIndices:
      Object.freeze([
        ...sourceVertexIndices
      ]),

    assignment,

    cameraDepth:
      (
        projectedPoints[0].cameraDepth +
        projectedPoints[1].cameraDepth
      ) /
      2,

    projectedPoints:
      Object.freeze([
        ...projectedPoints
      ])
  });
}

function createProjectedTriangleDescriptor({
  primitiveId,
  assignment,
  sourceVertexIndices,
  projectedPoints
}) {
  if (
    projectedPoints.some(
      (point) =>
        point.visible !== true
    )
  ) {
    return null;
  }

  return deepFreeze({
    type:
      'TRIANGLE',

    primitiveId,

    sourceVertexIndices:
      Object.freeze([
        ...sourceVertexIndices
      ]),

    assignment,

    cameraDepth:
      projectedPoints.reduce(
        (
          total,
          point
        ) =>
          total +
          point.cameraDepth,
        0
      ) /
      3,

    projectedPoints:
      Object.freeze([
        ...projectedPoints
      ])
  });
}

function createPointDescriptors({
  primitiveId,
  assignment,
  vertices,
  indices,
  projectionContext
}) {
  const descriptors = [];

  for (const index of indices) {
    const point =
      projectHEarth3DAdmittedWorldPoint(
        vertices[index],
        projectionContext
      );

    if (point.visible) {
      descriptors.push(
        createProjectedPointDescriptor({
          primitiveId,
          assignment,

          sourceVertexIndex:
            index,

          projectedPoint:
            point
        })
      );
    }
  }

  return descriptors;
}

function createLineListDescriptors({
  primitiveId,
  assignment,
  vertices,
  indices,
  projectionContext
}) {
  const descriptors = [];

  for (
    let index = 0;
    index + 1 < indices.length;
    index += 2
  ) {
    const sourceIndices = [
      indices[index],
      indices[index + 1]
    ];

    const projectedPoints =
      sourceIndices.map(
        (sourceIndex) =>
          projectHEarth3DAdmittedWorldPoint(
            vertices[sourceIndex],
            projectionContext
          )
      );

    const descriptor =
      createProjectedLineDescriptor({
        primitiveId,
        assignment,
        sourceVertexIndices:
          sourceIndices,
        projectedPoints
      });

    if (descriptor) {
      descriptors.push(descriptor);
    }
  }

  return descriptors;
}

function createLineStripDescriptors({
  primitiveId,
  assignment,
  vertices,
  indices,
  projectionContext
}) {
  const descriptors = [];

  for (
    let index = 0;
    index + 1 < indices.length;
    index += 1
  ) {
    const sourceIndices = [
      indices[index],
      indices[index + 1]
    ];

    const projectedPoints =
      sourceIndices.map(
        (sourceIndex) =>
          projectHEarth3DAdmittedWorldPoint(
            vertices[sourceIndex],
            projectionContext
          )
      );

    const descriptor =
      createProjectedLineDescriptor({
        primitiveId,
        assignment,
        sourceVertexIndices:
          sourceIndices,
        projectedPoints
      });

    if (descriptor) {
      descriptors.push(descriptor);
    }
  }

  return descriptors;
}

function createTriangleListDescriptors({
  primitiveId,
  assignment,
  vertices,
  indices,
  projectionContext
}) {
  const descriptors = [];

  for (
    let index = 0;
    index + 2 < indices.length;
    index += 3
  ) {
    const sourceIndices = [
      indices[index],
      indices[index + 1],
      indices[index + 2]
    ];

    const projectedPoints =
      sourceIndices.map(
        (sourceIndex) =>
          projectHEarth3DAdmittedWorldPoint(
            vertices[sourceIndex],
            projectionContext
          )
      );

    const descriptor =
      createProjectedTriangleDescriptor({
        primitiveId,
        assignment,
        sourceVertexIndices:
          sourceIndices,
        projectedPoints
      });

    if (descriptor) {
      descriptors.push(descriptor);
    }
  }

  return descriptors;
}

function createTriangleStripDescriptors({
  primitiveId,
  assignment,
  vertices,
  indices,
  projectionContext
}) {
  const descriptors = [];

  for (
    let index = 0;
    index + 2 < indices.length;
    index += 1
  ) {
    const sourceIndices =
      index % 2 === 0
        ? [
            indices[index],
            indices[index + 1],
            indices[index + 2]
          ]
        : [
            indices[index + 1],
            indices[index],
            indices[index + 2]
          ];

    const projectedPoints =
      sourceIndices.map(
        (sourceIndex) =>
          projectHEarth3DAdmittedWorldPoint(
            vertices[sourceIndex],
            projectionContext
          )
      );

    const descriptor =
      createProjectedTriangleDescriptor({
        primitiveId,
        assignment,
        sourceVertexIndices:
          sourceIndices,
        projectedPoints
      });

    if (descriptor) {
      descriptors.push(descriptor);
    }
  }

  return descriptors;
}

function createTriangleFanDescriptors({
  primitiveId,
  assignment,
  vertices,
  indices,
  projectionContext
}) {
  const descriptors = [];

  if (indices.length < 3) {
    return descriptors;
  }

  const centerIndex =
    indices[0];

  for (
    let index = 1;
    index + 1 < indices.length;
    index += 1
  ) {
    const sourceIndices = [
      centerIndex,
      indices[index],
      indices[index + 1]
    ];

    const projectedPoints =
      sourceIndices.map(
        (sourceIndex) =>
          projectHEarth3DAdmittedWorldPoint(
            vertices[sourceIndex],
            projectionContext
          )
      );

    const descriptor =
      createProjectedTriangleDescriptor({
        primitiveId,
        assignment,
        sourceVertexIndices:
          sourceIndices,
        projectedPoints
      });

    if (descriptor) {
      descriptors.push(descriptor);
    }
  }

  return descriptors;
}

function projectAdmittedPrimitive({
  admittedPrimitive,
  assignment,
  projectionContext
}) {
  const evaluation =
    evaluateAdmittedPrimitiveForRenderer(
      admittedPrimitive
    );

  if (!evaluation.eligible) {
    return deepFreeze({
      eligible:
        false,

      primitiveId:
        admittedPrimitive?.primitiveId ??
        null,

      descriptors:
        EMPTY_FROZEN_ARRAY,

      issues:
        evaluation.issues
    });
  }

  const {
    primitiveId,
    topologyMode,
    vertices,
    indices
  } = evaluation;

  let descriptors;

  switch (topologyMode) {
    case TOPOLOGY_MODE.POINTS:
      descriptors =
        createPointDescriptors({
          primitiveId,
          assignment,
          vertices,
          indices,
          projectionContext
        });
      break;

    case TOPOLOGY_MODE.LINES:
    case TOPOLOGY_MODE.LINE_LIST:
      descriptors =
        createLineListDescriptors({
          primitiveId,
          assignment,
          vertices,
          indices,
          projectionContext
        });
      break;

    case TOPOLOGY_MODE.LINE_STRIP:
      descriptors =
        createLineStripDescriptors({
          primitiveId,
          assignment,
          vertices,
          indices,
          projectionContext
        });
      break;

    case TOPOLOGY_MODE.TRIANGLES:
    case TOPOLOGY_MODE.TRIANGLE_LIST:
      descriptors =
        createTriangleListDescriptors({
          primitiveId,
          assignment,
          vertices,
          indices,
          projectionContext
        });
      break;

    case TOPOLOGY_MODE.TRIANGLE_STRIP:
      descriptors =
        createTriangleStripDescriptors({
          primitiveId,
          assignment,
          vertices,
          indices,
          projectionContext
        });
      break;

    case TOPOLOGY_MODE.TRIANGLE_FAN:
      descriptors =
        createTriangleFanDescriptors({
          primitiveId,
          assignment,
          vertices,
          indices,
          projectionContext
        });
      break;

    default:
      return deepFreeze({
        eligible:
          false,

        primitiveId,

        descriptors:
          EMPTY_FROZEN_ARRAY,

        issues:
          freezeIssues([
            createRendererIssue(
              'ADMITTED_TOPOLOGY_MODE_UNSUPPORTED',
              'The admitted primitive topology mode is not supported by the DOM/CSS renderer.',
              {
                expected:
                  Object.values(
                    TOPOLOGY_MODE
                  ),

                actual:
                  topologyMode
              }
            )
          ])
      });
  }

  return deepFreeze({
    eligible:
      true,

    primitiveId,

    topologyMode,

    sourceVertexCount:
      vertices.length,

    sourceIndexCount:
      indices.length,

    descriptors:
      Object.freeze(
        descriptors
      ),

    issues:
      EMPTY_FROZEN_ARRAY
  });
}


/* ==========================================================================
 * 14 · FRAME PROJECTION PLAN
 * ========================================================================== */

function createFrameProjectionPlan(
  frame,
  viewportOverride = null
) {
  const issues = [];

  const projectionContext =
    createProjectionContextFromFrame(
      frame,
      viewportOverride
    );

  if (!projectionContext) {
    return deepFreeze({
      eligible:
        false,

      status:
        'FRAME_PROJECTION_CONTEXT_NOT_RESOLVED',

      projectionContext:
        null,

      primitivePlans:
        EMPTY_FROZEN_ARRAY,

      projectedDescriptors:
        EMPTY_FROZEN_ARRAY,

      issues:
        freezeIssues([
          createRendererIssue(
            'FRAME_CAMERA_OR_VIEWPORT_INVALID',
            'The renderer could not resolve the frame-owned camera and viewport.'
          )
        ])
    });
  }

  const assignmentMap =
    buildPresentationAssignmentMap(
      frame
    );

  if (!assignmentMap) {
    return deepFreeze({
      eligible:
        false,

      status:
        'FRAME_PRESENTATION_ASSIGNMENTS_INVALID',

      projectionContext,

      primitivePlans:
        EMPTY_FROZEN_ARRAY,

      projectedDescriptors:
        EMPTY_FROZEN_ARRAY,

      issues:
        freezeIssues([
          createRendererIssue(
            'FRAME_PRESENTATION_ASSIGNMENT_MAP_INVALID',
            'The admitted frame presentation assignments are missing, duplicated, or malformed.'
          )
        ])
    });
  }

  const primitivePlans = [];
  const projectedDescriptors = [];

  for (
    const admittedPrimitive
    of frame.admittedPrimitives
  ) {
    const primitiveId =
      admittedPrimitive?.primitiveId;

    const assignment =
      assignmentMap.get(
        primitiveId
      );

    if (!assignment) {
      issues.push(
        createRendererIssue(
          'PRIMITIVE_PRESENTATION_ASSIGNMENT_MISSING',
          'Every admitted primitive requires exactly one presentation assignment.',
          {
            field:
              primitiveId ??
              null
          }
        )
      );

      continue;
    }

    if (
      !isPresentationAssignmentVisible(
        assignment,
        frame.visibilitySnapshot
      )
    ) {
      primitivePlans.push(
        deepFreeze({
          eligible:
            true,

          primitiveId,

          topologyMode:
            getPrimitiveTopologyMode(
              admittedPrimitive
            ),

          visible:
            false,

          sourceVertexCount:
            getPrimitiveVertices(
              admittedPrimitive
            )?.length ??
            0,

          sourceIndexCount:
            0,

          descriptors:
            EMPTY_FROZEN_ARRAY,

          issues:
            EMPTY_FROZEN_ARRAY
        })
      );

      continue;
    }

    const primitivePlan =
      projectAdmittedPrimitive({
        admittedPrimitive,
        assignment,
        projectionContext
      });

    primitivePlans.push(
      primitivePlan
    );

    if (!primitivePlan.eligible) {
      issues.push(
        ...primitivePlan.issues
      );

      continue;
    }

    projectedDescriptors.push(
      ...primitivePlan.descriptors
    );
  }

  if (
    frame.admittedPrimitiveIds.length !==
    primitivePlans.length ||
    !arraysEqual(
      frame.admittedPrimitiveIds,
      primitivePlans.map(
        (plan) =>
          plan.primitiveId
      )
    )
  ) {
    issues.push(
      createRendererIssue(
        'RENDERER_PRIMITIVE_MEMBERSHIP_CORRESPONDENCE_FAILED',
        'The renderer projection plan must preserve admitted primitive membership and order exactly.'
      )
    );
  }

  return deepFreeze({
    eligible:
      issues.length === 0,

    status:
      issues.length === 0
        ? 'FRAME_PROJECTION_PLAN_ELIGIBLE'
        : 'FRAME_PROJECTION_PLAN_NOT_ELIGIBLE',

    projectionContext,

    primitivePlans:
      Object.freeze(
        primitivePlans
      ),

    projectedDescriptors:
      Object.freeze(
        projectedDescriptors
      ),

    issues:
      freezeIssues(issues)
  });
}


/* ==========================================================================
 * 15 · DOM RESOURCE CONSTRUCTION
 * ========================================================================== */

function createStageElement() {
  const element =
    document.createElement(
      'div'
    );

  element.className =
    H_EARTH_3D_RENDERER_STAGE_MODEL
      .stageClass;

  element.dataset.rendererContractId =
    H_EARTH_3D_RENDERER_CONTRACT_ID;

  element.dataset.compositorContractId =
    H_EARTH_3D_COMPOSITOR_CONTRACT_ID;

  element.dataset.admittedFrameContractId =
    H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID;

  setStyles(
    element,
    {
      position:
        'relative',

      width:
        '100%',

      height:
        '100%',

      minHeight:
        '320px',

      overflow:
        'hidden',

      isolation:
        'isolate',

      contain:
        'layout paint style',

      background:
        'linear-gradient(180deg, #546f7b 0%, #789095 42%, #52686c 58%, #303d3e 100%)',

      userSelect:
        'none',

      touchAction:
        'none'
    }
  );

  return element;
}

function createSceneElement() {
  const element =
    document.createElement(
      'div'
    );

  element.className =
    H_EARTH_3D_RENDERER_STAGE_MODEL
      .sceneClass;

  setStyles(
    element,
    {
      position:
        'absolute',

      inset:
        '0',

      overflow:
        'hidden',

      transformOrigin:
        '50% 50%'
    }
  );

  return element;
}

function applyPresentation(
  element,
  assignment
) {
  const presentation =
    getMaterialPresentation(
      assignment
    );

  setStyles(
    element,
    presentation
  );

  element.dataset.materialReference =
    assignment.materialReference;

  element.dataset.materialIntent =
    assignment.materialIntent;

  element.dataset.presentationRole =
    assignment.presentationRole;

  element.dataset.renderLayer =
    assignment.renderLayer;

  return element;
}

function resolveDepthZIndex(
  cameraDepth,
  descriptorIndex
) {
  return (
    1000000 -
    Math.round(
      cameraDepth *
      1000
    ) +
    descriptorIndex
  );
}

function createPointElement(
  descriptor,
  descriptorIndex
) {
  const point =
    descriptor.projectedPoints[0];

  const element =
    document.createElement(
      'div'
    );

  element.className =
    `${H_EARTH_3D_RENDERER_STAGE_MODEL.primitiveClass} ` +
    H_EARTH_3D_RENDERER_STAGE_MODEL.pointClass;

  element.dataset.primitiveId =
    descriptor.primitiveId;

  element.dataset.projectedType =
    descriptor.type;

  element.dataset.sourceVertexIndices =
    descriptor.sourceVertexIndices.join(
      ','
    );

  setStyles(
    element,
    {
      position:
        'absolute',

      left:
        `${round(
          point.screen.x -
          2,
          2
        )}px`,

      top:
        `${round(
          point.screen.y -
          2,
          2
        )}px`,

      width:
        '4px',

      height:
        '4px',

      borderRadius:
        '50%',

      pointerEvents:
        'none',

      zIndex:
        resolveDepthZIndex(
          descriptor.cameraDepth,
          descriptorIndex
        )
    }
  );

  return applyPresentation(
    element,
    descriptor.assignment
  );
}

function createLineElement(
  descriptor,
  descriptorIndex
) {
  const start =
    descriptor.projectedPoints[0]
      .screen;

  const end =
    descriptor.projectedPoints[1]
      .screen;

  const deltaX =
    end.x -
    start.x;

  const deltaY =
    end.y -
    start.y;

  const length =
    Math.hypot(
      deltaX,
      deltaY
    );

  const rotationDegrees =
    Math.atan2(
      deltaY,
      deltaX
    ) *
    180 /
    Math.PI;

  const element =
    document.createElement(
      'div'
    );

  element.className =
    `${H_EARTH_3D_RENDERER_STAGE_MODEL.primitiveClass} ` +
    H_EARTH_3D_RENDERER_STAGE_MODEL.lineClass;

  element.dataset.primitiveId =
    descriptor.primitiveId;

  element.dataset.projectedType =
    descriptor.type;

  element.dataset.sourceVertexIndices =
    descriptor.sourceVertexIndices.join(
      ','
    );

  setStyles(
    element,
    {
      position:
        'absolute',

      left:
        `${round(
          start.x,
          2
        )}px`,

      top:
        `${round(
          start.y,
          2
        )}px`,

      width:
        `${round(
          length,
          2
        )}px`,

      height:
        '2px',

      transform:
        `rotate(${round(
          rotationDegrees,
          3
        )}deg)`,

      transformOrigin:
        '0 50%',

      pointerEvents:
        'none',

      zIndex:
        resolveDepthZIndex(
          descriptor.cameraDepth,
          descriptorIndex
        )
    }
  );

  return applyPresentation(
    element,
    descriptor.assignment
  );
}

function createTriangleElement(
  descriptor,
  descriptorIndex
) {
  const points =
    descriptor.projectedPoints.map(
      (point) =>
        point.screen
    );

  const xValues =
    points.map(
      (point) =>
        point.x
    );

  const yValues =
    points.map(
      (point) =>
        point.y
    );

  const xMin =
    Math.min(
      ...xValues
    );

  const xMax =
    Math.max(
      ...xValues
    );

  const yMin =
    Math.min(
      ...yValues
    );

  const yMax =
    Math.max(
      ...yValues
    );

  const width =
    Math.max(
      1,
      xMax -
      xMin
    );

  const height =
    Math.max(
      1,
      yMax -
      yMin
    );

  const clipPath =
    points
      .map(
        (point) => {
          const localX =
            (
              point.x -
              xMin
            ) /
            width *
            100;

          const localY =
            (
              point.y -
              yMin
            ) /
            height *
            100;

          return (
            `${round(
              localX,
              4
            )}% ` +
            `${round(
              localY,
              4
            )}%`
          );
        }
      )
      .join(
        ', '
      );

  const element =
    document.createElement(
      'div'
    );

  element.className =
    `${H_EARTH_3D_RENDERER_STAGE_MODEL.primitiveClass} ` +
    H_EARTH_3D_RENDERER_STAGE_MODEL.triangleClass;

  element.dataset.primitiveId =
    descriptor.primitiveId;

  element.dataset.projectedType =
    descriptor.type;

  element.dataset.sourceVertexIndices =
    descriptor.sourceVertexIndices.join(
      ','
    );

  setStyles(
    element,
    {
      position:
        'absolute',

      left:
        `${round(
          xMin,
          2
        )}px`,

      top:
        `${round(
          yMin,
          2
        )}px`,

      width:
        `${round(
          width,
          2
        )}px`,

      height:
        `${round(
          height,
          2
        )}px`,

      clipPath:
        `polygon(${clipPath})`,

      pointerEvents:
        'none',

      backfaceVisibility:
        'hidden',

      zIndex:
        resolveDepthZIndex(
          descriptor.cameraDepth,
          descriptorIndex
        )
    }
  );

  return applyPresentation(
    element,
    descriptor.assignment
  );
}

function createDescriptorElement(
  descriptor,
  descriptorIndex
) {
  switch (descriptor.type) {
    case 'POINT':
      return createPointElement(
        descriptor,
        descriptorIndex
      );

    case 'LINE':
      return createLineElement(
        descriptor,
        descriptorIndex
      );

    case 'TRIANGLE':
      return createTriangleElement(
        descriptor,
        descriptorIndex
      );

    default:
      return null;
  }
}

function buildSceneFragment(
  projectionPlan
) {
  const fragment =
    document.createDocumentFragment();

  const elements = [];

  projectionPlan
    .projectedDescriptors
    .forEach(
      (
        descriptor,
        descriptorIndex
      ) => {
        const element =
          createDescriptorElement(
            descriptor,
            descriptorIndex
          );

        if (element) {
          fragment.appendChild(
            element
          );

          elements.push(
            element
          );
        }
      }
    );

  return {
    fragment,
    elements
  };
}


/* ==========================================================================
 * 16 · NODE BUDGET
 * ========================================================================== */

function evaluateRendererNodeBudget(
  projectedDescriptorCount
) {
  const evaluation =
    evaluateHEarth3DNodeBudget({
      semanticLayerContainers:
        1,

      environmentPrimitives:
        projectedDescriptorCount,

      interactionNodes:
        0,

      diagnosticOwnedNodes:
        0
    });

  return evaluation;
}


/* ==========================================================================
 * 17 · RESOURCE CONSTRUCTION
 * ========================================================================== */

export function constructHEarth3DRenderer(
  handoff
) {
  const handoffEvaluation =
    evaluateCompositorHandoff(
      handoff
    );

  if (!handoffEvaluation.eligible) {
    const receipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_RENDERER_CONSTRUCT_RECEIPT',

        contractId:
          H_EARTH_3D_RENDERER_CONTRACT_ID,

        constructed:
          false,

        status:
          'RENDERER_CONSTRUCTION_REJECTED',

        compositorFrameOccurrenceId:
          handoff?.admittedGeometryFrame
            ?.compositorFrameOccurrenceId ??
          null,

        compositorFrameRevision:
          handoff?.admittedGeometryFrame
            ?.revisions
            ?.frame ??
          null,

        rendererResourceCreated:
          false,

        issues:
          handoffEvaluation.issues,

        rendererPassClaim:
          false,

        visualPassClaim:
          false
      });

    rendererState.lastConstructReceipt =
      receipt;

    return receipt;
  }

  const frame =
    handoffEvaluation.frame;

  const applicationEvaluation =
    evaluateFrameApplication(
      frame
    );

  if (
    !applicationEvaluation.eligible &&
    !applicationEvaluation.duplicate
  ) {
    const receipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_RENDERER_CONSTRUCT_RECEIPT',

        contractId:
          H_EARTH_3D_RENDERER_CONTRACT_ID,

        constructed:
          false,

        status:
          'RENDERER_FRAME_APPLICATION_REJECTED',

        frameApplicationStatus:
          applicationEvaluation.status,

        compositorFrameOccurrenceId:
          frame.compositorFrameOccurrenceId,

        compositorFrameRevision:
          frame.revisions.frame,

        rendererResourceCreated:
          false,

        issues:
          applicationEvaluation.issues,

        rendererPassClaim:
          false,

        visualPassClaim:
          false
      });

    rendererState.lastConstructReceipt =
      receipt;

    return receipt;
  }

  if (
    applicationEvaluation.duplicate &&
    rendererState.constructed
  ) {
    const receipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_RENDERER_CONSTRUCT_RECEIPT',

        contractId:
          H_EARTH_3D_RENDERER_CONTRACT_ID,

        constructed:
          true,

        status:
          'RENDERER_ALREADY_CONSTRUCTED_FOR_FRAME',

        frameApplicationStatus:
          applicationEvaluation.status,

        compositorFrameOccurrenceId:
          frame.compositorFrameOccurrenceId,

        compositorFrameRevision:
          frame.revisions.frame,

        rendererResourceCreated:
          true,

        duplicateFrame:
          true,

        issues:
          EMPTY_FROZEN_ARRAY,

        rendererPassClaim:
          false,

        visualPassClaim:
          false
      });

    rendererState.lastConstructReceipt =
      receipt;

    return receipt;
  }

  const projectionPlan =
    createFrameProjectionPlan(
      frame
    );

  if (!projectionPlan.eligible) {
    const receipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_RENDERER_CONSTRUCT_RECEIPT',

        contractId:
          H_EARTH_3D_RENDERER_CONTRACT_ID,

        constructed:
          false,

        status:
          'RENDERER_PROJECTION_PLAN_REJECTED',

        frameApplicationStatus:
          applicationEvaluation.status,

        compositorFrameOccurrenceId:
          frame.compositorFrameOccurrenceId,

        compositorFrameRevision:
          frame.revisions.frame,

        rendererResourceCreated:
          false,

        issues:
          projectionPlan.issues,

        rendererPassClaim:
          false,

        visualPassClaim:
          false
      });

    rendererState.lastConstructReceipt =
      receipt;

    return receipt;
  }

  const nodeBudgetEvaluation =
    evaluateRendererNodeBudget(
      projectionPlan
        .projectedDescriptors
        .length
    );

  if (
    !isPlainRecord(
      nodeBudgetEvaluation
    ) ||
    nodeBudgetEvaluation.eligible !==
      true
  ) {
    const receipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_RENDERER_CONSTRUCT_RECEIPT',

        contractId:
          H_EARTH_3D_RENDERER_CONTRACT_ID,

        constructed:
          false,

        status:
          'RENDERER_NODE_BUDGET_REJECTED',

        frameApplicationStatus:
          applicationEvaluation.status,

        compositorFrameOccurrenceId:
          frame.compositorFrameOccurrenceId,

        compositorFrameRevision:
          frame.revisions.frame,

        rendererResourceCreated:
          false,

        nodeBudgetEvaluation,

        issues:
          freezeIssues([
            createRendererIssue(
              'RENDERER_NODE_BUDGET_NOT_ELIGIBLE',
              'The projected admitted frame exceeds the renderer node budget.'
            )
          ]),

        rendererPassClaim:
          false,

        visualPassClaim:
          false
      });

    rendererState.lastConstructReceipt =
      receipt;

    return receipt;
  }

  rendererState.constructSequence +=
    1;

  rendererState.constructed =
    true;

  rendererState.currentHandoff =
    handoff;

  rendererState.currentFrame =
    frame;

  rendererState.currentFrameOccurrenceId =
    frame.compositorFrameOccurrenceId;

  rendererState.currentFrameRevision =
    frame.revisions.frame;

  rendererState.currentCameraRevision =
    frame.revisions.camera;

  rendererState.currentViewportRevision =
    frame.revisions.viewport;

  rendererState.currentVisibilityRevision =
    frame.revisions.visibility;

  rendererState.currentProjectionContext =
    projectionPlan.projectionContext;

  const receipt =
    deepFreeze({
      receiptType:
        'H_EARTH_3D_RENDERER_CONSTRUCT_RECEIPT',

      contractId:
        H_EARTH_3D_RENDERER_CONTRACT_ID,

      constructSequence:
        rendererState.constructSequence,

      constructed:
        true,

      status:
        'RENDERER_RESOURCES_CONSTRUCTED',

      frameApplicationStatus:
        applicationEvaluation.status,

      compositorFrameOccurrenceId:
        frame.compositorFrameOccurrenceId,

      packet002TransferOccurrenceId:
        frame.packet002TransferOccurrenceId,

      compositorFrameRevision:
        frame.revisions.frame,

      cameraRevision:
        frame.revisions.camera,

      viewportRevision:
        frame.revisions.viewport,

      visibilityRevision:
        frame.revisions.visibility,

      admittedPrimitiveCount:
        frame.admittedPrimitives.length,

      projectedPrimitiveFragmentCount:
        projectionPlan
          .projectedDescriptors
          .length,

      presentationAssignmentCount:
        frame.presentationAssignments.length,

      sourcePrimitiveIdentityPreserved:
        true,

      sourceGeometryReconstructed:
        false,

      admittedCoordinatesAltered:
        false,

      admittedIndicesAltered:
        false,

      rendererResourceCreated:
        true,

      nodeBudgetEvaluation,

      projectionPlan,

      issues:
        EMPTY_FROZEN_ARRAY,

      rendererPassClaim:
        false,

      visualPassClaim:
        false,

      validationClaim:
        false,

      productionClaim:
        false
    });

  rendererState.lastConstructReceipt =
    receipt;

  return receipt;
}


/* ==========================================================================
 * 18 · FRAME MATERIALIZATION
 * ========================================================================== */

function materializeCurrentFrame(
  viewportOverride = null
) {
  if (
    !rendererState.constructed ||
    !rendererState.currentFrame ||
    !rendererState.sceneElement
  ) {
    return deepFreeze({
      rendered:
        false,

      status:
        'RENDERER_NOT_READY_FOR_MATERIALIZATION',

      issues:
        freezeIssues([
          createRendererIssue(
            'RENDERER_RESOURCES_OR_SCENE_UNAVAILABLE',
            'The renderer must be constructed and mounted before materialization.'
          )
        ])
    });
  }

  const projectionPlan =
    createFrameProjectionPlan(
      rendererState.currentFrame,
      viewportOverride
    );

  if (!projectionPlan.eligible) {
    return deepFreeze({
      rendered:
        false,

      status:
        'RENDERER_PROJECTION_PLAN_REJECTED',

      projectionPlan,

      issues:
        projectionPlan.issues
    });
  }

  const nodeBudgetEvaluation =
    evaluateRendererNodeBudget(
      projectionPlan
        .projectedDescriptors
        .length
    );

  if (
    !isPlainRecord(
      nodeBudgetEvaluation
    ) ||
    nodeBudgetEvaluation.eligible !==
      true
  ) {
    return deepFreeze({
      rendered:
        false,

      status:
        'RENDERER_NODE_BUDGET_REJECTED',

      nodeBudgetEvaluation,

      issues:
        freezeIssues([
          createRendererIssue(
            'RENDERER_NODE_BUDGET_NOT_ELIGIBLE',
            'The projected admitted frame exceeds the renderer node budget.'
          )
        ])
    });
  }

  const {
    fragment,
    elements
  } =
    buildSceneFragment(
      projectionPlan
    );

  rendererState
    .sceneElement
    .replaceChildren(
      fragment
    );

  rendererState.primitiveElements =
    elements;

  rendererState.currentProjectionContext =
    projectionPlan.projectionContext;

  rendererState.applySequence +=
    1;

  return deepFreeze({
    rendered:
      true,

    status:
      'ADMITTED_GEOMETRY_FRAME_MATERIALIZED',

    applySequence:
      rendererState.applySequence,

    compositorFrameOccurrenceId:
      rendererState
        .currentFrameOccurrenceId,

    compositorFrameRevision:
      rendererState
        .currentFrameRevision,

    cameraRevision:
      rendererState
        .currentCameraRevision,

    viewportRevision:
      rendererState
        .currentViewportRevision,

    visibilityRevision:
      rendererState
        .currentVisibilityRevision,

    projectedPrimitiveFragmentCount:
      elements.length,

    projectionPlan,

    nodeBudgetEvaluation,

    rendererResourceCreated:
      true,

    sourcePrimitiveIdentityPreserved:
      true,

    sourceGeometryReconstructed:
      false,

    admittedCoordinatesAltered:
      false,

    admittedIndicesAltered:
      false,

    issues:
      EMPTY_FROZEN_ARRAY
  });
}


/* ==========================================================================
 * 19 · MOUNT
 * ========================================================================== */

export function mountHEarth3DRenderer({
  mountElement = null,
  mountId =
    RENDERER_MOUNT_ID
} = {}) {
  if (
    typeof document ===
    'undefined'
  ) {
    const receipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_RENDERER_MOUNT_RECEIPT',

        contractId:
          H_EARTH_3D_RENDERER_CONTRACT_ID,

        mounted:
          false,

        status:
          'DOCUMENT_NOT_AVAILABLE',

        issues:
          freezeIssues([
            createRendererIssue(
              'DOCUMENT_NOT_AVAILABLE',
              'The renderer mount lifecycle requires a DOM document.'
            )
          ]),

        rendererPassClaim:
          false,

        visualPassClaim:
          false
      });

    rendererState.lastMountReceipt =
      receipt;

    return receipt;
  }

  if (
    !rendererState.constructed ||
    !rendererState.currentFrame
  ) {
    const receipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_RENDERER_MOUNT_RECEIPT',

        contractId:
          H_EARTH_3D_RENDERER_CONTRACT_ID,

        mounted:
          false,

        status:
          'RENDERER_NOT_CONSTRUCTED',

        issues:
          freezeIssues([
            createRendererIssue(
              'RENDERER_CONSTRUCTION_REQUIRED',
              'constructHEarth3DRenderer() must accept a lawful handoff before mounting.'
            )
          ]),

        rendererPassClaim:
          false,

        visualPassClaim:
          false
      });

    rendererState.lastMountReceipt =
      receipt;

    return receipt;
  }

  if (rendererState.mounted) {
    destroyHEarth3DRenderer();
  }

  const resolvedMountElement =
    mountElement ??
    (
      isNonEmptyExactString(
        mountId
      )
        ? document.getElementById(
            mountId
          )
        : null
    );

  if (
    !resolvedMountElement ||
    typeof resolvedMountElement
      .replaceChildren !==
      'function'
  ) {
    const receipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_RENDERER_MOUNT_RECEIPT',

        contractId:
          H_EARTH_3D_RENDERER_CONTRACT_ID,

        mounted:
          false,

        status:
          'RENDERER_MOUNT_ELEMENT_NOT_FOUND',

        mountId,

        issues:
          freezeIssues([
            createRendererIssue(
              'RENDERER_MOUNT_ELEMENT_NOT_FOUND',
              'A lawful mount element is required.'
            )
          ]),

        rendererPassClaim:
          false,

        visualPassClaim:
          false
      });

    rendererState.lastMountReceipt =
      receipt;

    return receipt;
  }

  const stageElement =
    createStageElement();

  const sceneElement =
    createSceneElement();

  stageElement.appendChild(
    sceneElement
  );

  resolvedMountElement.replaceChildren(
    stageElement
  );

  rendererState.mountElement =
    resolvedMountElement;

  rendererState.stageElement =
    stageElement;

  rendererState.sceneElement =
    sceneElement;

  rendererState.mounted =
    true;

  const rect =
    resolvedMountElement
      .getBoundingClientRect();

  const widthPx =
    Math.max(
      rect.width,
      resolvedMountElement.clientWidth,
      rendererState
        .currentFrame
        .viewportSnapshot
        .widthPx
    );

  const heightPx =
    Math.max(
      rect.height,
      resolvedMountElement.clientHeight,
      rendererState
        .currentFrame
        .viewportSnapshot
        .heightPx
    );

  const materialization =
    materializeCurrentFrame({
      widthPx,
      heightPx
    });

  if (!materialization.rendered) {
    resolvedMountElement.replaceChildren();

    rendererState.mountElement =
      null;

    rendererState.stageElement =
      null;

    rendererState.sceneElement =
      null;

    rendererState.mounted =
      false;

    const receipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_RENDERER_MOUNT_RECEIPT',

        contractId:
          H_EARTH_3D_RENDERER_CONTRACT_ID,

        mounted:
          false,

        status:
          'INITIAL_FRAME_MATERIALIZATION_FAILED',

        materialization,

        issues:
          materialization.issues,

        rendererPassClaim:
          false,

        visualPassClaim:
          false
      });

    rendererState.lastMountReceipt =
      receipt;

    return receipt;
  }

  rendererState.mountSequence +=
    1;

  const receipt =
    deepFreeze({
      receiptType:
        'H_EARTH_3D_RENDERER_MOUNT_RECEIPT',

      contractId:
        H_EARTH_3D_RENDERER_CONTRACT_ID,

      mountSequence:
        rendererState.mountSequence,

      mounted:
        true,

      status:
        'RENDERER_MOUNTED_WITH_ADMITTED_FRAME',

      mountId:
        resolvedMountElement.id ||
        null,

      compositorFrameOccurrenceId:
        rendererState
          .currentFrameOccurrenceId,

      compositorFrameRevision:
        rendererState
          .currentFrameRevision,

      cameraRevision:
        rendererState
          .currentCameraRevision,

      viewportRevision:
        rendererState
          .currentViewportRevision,

      visibilityRevision:
        rendererState
          .currentVisibilityRevision,

      materialization,

      routeBootstrapExecuted:
        false,

      controllerMounted:
        false,

      diagnosticJudgmentPerformed:
        false,

      visibleOutputConfirmed:
        false,

      issues:
        EMPTY_FROZEN_ARRAY,

      runtimeActivationClaim:
        false,

      rendererPassClaim:
        false,

      visualPassClaim:
        false,

      validationClaim:
        false,

      productionClaim:
        false
    });

  rendererState.lastMountReceipt =
    receipt;

  return receipt;
}


/* ==========================================================================
 * 20 · APPLY OR REPLACE FRAME
 * ========================================================================== */

export function applyHEarth3DRendererHandoff(
  handoff
) {
  const handoffEvaluation =
    evaluateCompositorHandoff(
      handoff
    );

  if (!handoffEvaluation.eligible) {
    const receipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_RENDERER_FRAME_APPLY_RECEIPT',

        contractId:
          H_EARTH_3D_RENDERER_CONTRACT_ID,

        applied:
          false,

        status:
          'RENDERER_HANDOFF_REJECTED',

        frameApplicationStatus:
          FRAME_APPLICATION_STATUS
            .INVALID_FRAME,

        currentFramePreserved:
          true,

        issues:
          handoffEvaluation.issues,

        rendererPassClaim:
          false,

        visualPassClaim:
          false
      });

    rendererState.lastApplyReceipt =
      receipt;

    return receipt;
  }

  const frame =
    handoffEvaluation.frame;

  const applicationEvaluation =
    evaluateFrameApplication(
      frame
    );

  if (!applicationEvaluation.eligible) {
    const receipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_RENDERER_FRAME_APPLY_RECEIPT',

        contractId:
          H_EARTH_3D_RENDERER_CONTRACT_ID,

        applied:
          false,

        status:
          applicationEvaluation.duplicate
            ? 'RENDERER_DUPLICATE_FRAME_NO_OP'
            : 'RENDERER_FRAME_REPLACEMENT_REJECTED',

        frameApplicationStatus:
          applicationEvaluation.status,

        duplicateFrame:
          applicationEvaluation.duplicate,

        currentFramePreserved:
          true,

        compositorFrameOccurrenceId:
          frame.compositorFrameOccurrenceId,

        compositorFrameRevision:
          frame.revisions.frame,

        issues:
          applicationEvaluation.issues,

        rendererPassClaim:
          false,

        visualPassClaim:
          false
      });

    rendererState.lastApplyReceipt =
      receipt;

    return receipt;
  }

  if (applicationEvaluation.duplicate) {
    const receipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_RENDERER_FRAME_APPLY_RECEIPT',

        contractId:
          H_EARTH_3D_RENDERER_CONTRACT_ID,

        applied:
          true,

        status:
          'RENDERER_DUPLICATE_FRAME_NO_OP',

        frameApplicationStatus:
          applicationEvaluation.status,

        duplicateFrame:
          true,

        materiallyChanged:
          false,

        currentFramePreserved:
          true,

        compositorFrameOccurrenceId:
          frame.compositorFrameOccurrenceId,

        compositorFrameRevision:
          frame.revisions.frame,

        issues:
          EMPTY_FROZEN_ARRAY,

        rendererPassClaim:
          false,

        visualPassClaim:
          false
      });

    rendererState.lastApplyReceipt =
      receipt;

    return receipt;
  }

  const projectionPlan =
    createFrameProjectionPlan(
      frame,
      rendererState.mounted &&
      rendererState.mountElement
        ? {
            widthPx:
              Math.max(
                rendererState
                  .mountElement
                  .clientWidth,
                frame.viewportSnapshot
                  .widthPx
              ),

            heightPx:
              Math.max(
                rendererState
                  .mountElement
                  .clientHeight,
                frame.viewportSnapshot
                  .heightPx
              )
          }
        : null
    );

  if (!projectionPlan.eligible) {
    const receipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_RENDERER_FRAME_APPLY_RECEIPT',

        contractId:
          H_EARTH_3D_RENDERER_CONTRACT_ID,

        applied:
          false,

        status:
          'RENDERER_FRAME_PROJECTION_REJECTED',

        frameApplicationStatus:
          applicationEvaluation.status,

        currentFramePreserved:
          true,

        compositorFrameOccurrenceId:
          frame.compositorFrameOccurrenceId,

        compositorFrameRevision:
          frame.revisions.frame,

        issues:
          projectionPlan.issues,

        rendererPassClaim:
          false,

        visualPassClaim:
          false
      });

    rendererState.lastApplyReceipt =
      receipt;

    return receipt;
  }

  const nodeBudgetEvaluation =
    evaluateRendererNodeBudget(
      projectionPlan
        .projectedDescriptors
        .length
    );

  if (
    !isPlainRecord(
      nodeBudgetEvaluation
    ) ||
    nodeBudgetEvaluation.eligible !==
      true
  ) {
    const receipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_RENDERER_FRAME_APPLY_RECEIPT',

        contractId:
          H_EARTH_3D_RENDERER_CONTRACT_ID,

        applied:
          false,

        status:
          'RENDERER_FRAME_NODE_BUDGET_REJECTED',

        frameApplicationStatus:
          applicationEvaluation.status,

        currentFramePreserved:
          true,

        compositorFrameOccurrenceId:
          frame.compositorFrameOccurrenceId,

        compositorFrameRevision:
          frame.revisions.frame,

        nodeBudgetEvaluation,

        issues:
          freezeIssues([
            createRendererIssue(
              'RENDERER_NODE_BUDGET_NOT_ELIGIBLE',
              'The replacement frame exceeds the renderer node budget.'
            )
          ]),

        rendererPassClaim:
          false,

        visualPassClaim:
          false
      });

    rendererState.lastApplyReceipt =
      receipt;

    return receipt;
  }

  let replacementElements =
    null;

  if (
    rendererState.mounted &&
    rendererState.sceneElement
  ) {
    replacementElements =
      buildSceneFragment(
        projectionPlan
      );
  }

  rendererState.currentHandoff =
    handoff;

  rendererState.currentFrame =
    frame;

  rendererState.currentFrameOccurrenceId =
    frame.compositorFrameOccurrenceId;

  rendererState.currentFrameRevision =
    frame.revisions.frame;

  rendererState.currentCameraRevision =
    frame.revisions.camera;

  rendererState.currentViewportRevision =
    frame.revisions.viewport;

  rendererState.currentVisibilityRevision =
    frame.revisions.visibility;

  rendererState.currentProjectionContext =
    projectionPlan.projectionContext;

  if (
    replacementElements &&
    rendererState.sceneElement
  ) {
    rendererState
      .sceneElement
      .replaceChildren(
        replacementElements.fragment
      );

    rendererState.primitiveElements =
      replacementElements.elements;
  }

  rendererState.applySequence +=
    1;

  const receipt =
    deepFreeze({
      receiptType:
        'H_EARTH_3D_RENDERER_FRAME_APPLY_RECEIPT',

      contractId:
        H_EARTH_3D_RENDERER_CONTRACT_ID,

      applySequence:
        rendererState.applySequence,

      applied:
        true,

      status:
        'RENDERER_FRAME_REPLACED',

      frameApplicationStatus:
        applicationEvaluation.status,

      duplicateFrame:
        false,

      materiallyChanged:
        true,

      currentFramePreserved:
        false,

      compositorFrameOccurrenceId:
        frame.compositorFrameOccurrenceId,

      packet002TransferOccurrenceId:
        frame.packet002TransferOccurrenceId,

      compositorFrameRevision:
        frame.revisions.frame,

      cameraRevision:
        frame.revisions.camera,

      viewportRevision:
        frame.revisions.viewport,

      visibilityRevision:
        frame.revisions.visibility,

      projectedPrimitiveFragmentCount:
        projectionPlan
          .projectedDescriptors
          .length,

      sourcePrimitiveIdentityPreserved:
        true,

      sourceGeometryReconstructed:
        false,

      admittedCoordinatesAltered:
        false,

      admittedIndicesAltered:
        false,

      mountedDOMUpdated:
        replacementElements !==
        null,

      nodeBudgetEvaluation,

      issues:
        EMPTY_FROZEN_ARRAY,

      rendererPassClaim:
        false,

      visualPassClaim:
        false,

      validationClaim:
        false,

      productionClaim:
        false
    });

  rendererState.lastApplyReceipt =
    receipt;

  return receipt;
}


/* ==========================================================================
 * 21 · RESIZE / REPROJECT
 * ========================================================================== */

export function resizeHEarth3DRenderer({
  widthPx = null,
  heightPx = null
} = {}) {
  if (
    !rendererState.mounted ||
    !rendererState.mountElement ||
    !rendererState.currentFrame
  ) {
    const receipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_RENDERER_REPROJECT_RECEIPT',

        contractId:
          H_EARTH_3D_RENDERER_CONTRACT_ID,

        reprojected:
          false,

        status:
          'RENDERER_NOT_MOUNTED',

        issues:
          freezeIssues([
            createRendererIssue(
              'RENDERER_MOUNT_REQUIRED',
              'The renderer must be mounted before reprojection.'
            )
          ]),

        rendererPassClaim:
          false,

        visualPassClaim:
          false
      });

    rendererState.lastReprojectReceipt =
      receipt;

    return receipt;
  }

  const rect =
    rendererState
      .mountElement
      .getBoundingClientRect();

  const resolvedWidth =
    isPositiveFiniteNumber(
      widthPx
    )
      ? widthPx
      : Math.max(
          rect.width,
          rendererState
            .mountElement
            .clientWidth
        );

  const resolvedHeight =
    isPositiveFiniteNumber(
      heightPx
    )
      ? heightPx
      : Math.max(
          rect.height,
          rendererState
            .mountElement
            .clientHeight
        );

  if (
    !isPositiveFiniteNumber(
      resolvedWidth
    ) ||
    !isPositiveFiniteNumber(
      resolvedHeight
    )
  ) {
    const receipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_RENDERER_REPROJECT_RECEIPT',

        contractId:
          H_EARTH_3D_RENDERER_CONTRACT_ID,

        reprojected:
          false,

        status:
          'RENDERER_REPROJECT_VIEWPORT_INVALID',

        issues:
          freezeIssues([
            createRendererIssue(
              'REPROJECT_VIEWPORT_INVALID',
              'Renderer reprojection requires positive finite mount dimensions.'
            )
          ]),

        rendererPassClaim:
          false,

        visualPassClaim:
          false
      });

    rendererState.lastReprojectReceipt =
      receipt;

    return receipt;
  }

  const materialization =
    materializeCurrentFrame({
      widthPx:
        resolvedWidth,

      heightPx:
        resolvedHeight
    });

  if (!materialization.rendered) {
    const receipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_RENDERER_REPROJECT_RECEIPT',

        contractId:
          H_EARTH_3D_RENDERER_CONTRACT_ID,

        reprojected:
          false,

        status:
          'RENDERER_REPROJECTION_FAILED',

        materialization,

        issues:
          materialization.issues,

        rendererPassClaim:
          false,

        visualPassClaim:
          false
      });

    rendererState.lastReprojectReceipt =
      receipt;

    return receipt;
  }

  rendererState.reprojectSequence +=
    1;

  const receipt =
    deepFreeze({
      receiptType:
        'H_EARTH_3D_RENDERER_REPROJECT_RECEIPT',

      contractId:
        H_EARTH_3D_RENDERER_CONTRACT_ID,

      reprojectSequence:
        rendererState.reprojectSequence,

      reprojected:
        true,

      status:
        'RENDERER_REPROJECTED',

      compositorFrameOccurrenceId:
        rendererState
          .currentFrameOccurrenceId,

      compositorFrameRevision:
        rendererState
          .currentFrameRevision,

      widthPx:
        resolvedWidth,

      heightPx:
        resolvedHeight,

      materialization,

      issues:
        EMPTY_FROZEN_ARRAY,

      rendererPassClaim:
        false,

      visualPassClaim:
        false
    });

  rendererState.lastReprojectReceipt =
    receipt;

  return receipt;
}


/* ==========================================================================
 * 22 · DESTROY
 * ========================================================================== */

export function destroyHEarth3DRenderer() {
  const wasMounted =
    rendererState.mounted;

  const removedPrimitiveCount =
    rendererState
      .primitiveElements
      .length;

  if (
    rendererState.mountElement &&
    rendererState.stageElement &&
    rendererState.stageElement.parentNode ===
      rendererState.mountElement
  ) {
    rendererState
      .mountElement
      .removeChild(
        rendererState.stageElement
      );
  }

  rendererState.mounted =
    false;

  rendererState.mountElement =
    null;

  rendererState.stageElement =
    null;

  rendererState.sceneElement =
    null;

  rendererState.primitiveElements =
    [];

  rendererState.destroySequence +=
    1;

  const receipt =
    deepFreeze({
      receiptType:
        'H_EARTH_3D_RENDERER_DESTROY_RECEIPT',

      contractId:
        H_EARTH_3D_RENDERER_CONTRACT_ID,

      destroySequence:
        rendererState.destroySequence,

      destroyed:
        wasMounted,

      status:
        wasMounted
          ? 'RENDERER_DOM_RESOURCES_DESTROYED'
          : 'RENDERER_WAS_NOT_MOUNTED',

      removedPrimitiveCount,

      frameStatePreserved:
        rendererState.currentFrame !==
        null,

      rendererConstructionPreserved:
        rendererState.constructed,

      routeDOMRemoved:
        false,

      controllerDestroyed:
        false,

      issues:
        EMPTY_FROZEN_ARRAY,

      rendererPassClaim:
        false,

      visualPassClaim:
        false,

      validationClaim:
        false
    });

  rendererState.lastDestroyReceipt =
    receipt;

  return receipt;
}


/* ==========================================================================
 * 23 · COMPLETE RELEASE
 * ========================================================================== */

export function releaseHEarth3DRenderer() {
  const destroyReceipt =
    destroyHEarth3DRenderer();

  rendererState.constructed =
    false;

  rendererState.currentHandoff =
    null;

  rendererState.currentFrame =
    null;

  rendererState.currentFrameOccurrenceId =
    null;

  rendererState.currentFrameRevision =
    null;

  rendererState.currentCameraRevision =
    null;

  rendererState.currentViewportRevision =
    null;

  rendererState.currentVisibilityRevision =
    null;

  rendererState.currentProjectionContext =
    null;

  return deepFreeze({
    receiptType:
      'H_EARTH_3D_RENDERER_RELEASE_RECEIPT',

    contractId:
      H_EARTH_3D_RENDERER_CONTRACT_ID,

    released:
      true,

    status:
      'RENDERER_RELEASED',

    destroyReceipt,

    frameStatePreserved:
      false,

    rendererConstructionPreserved:
      false,

    issues:
      EMPTY_FROZEN_ARRAY,

    rendererPassClaim:
      false,

    visualPassClaim:
      false
  });
}


/* ==========================================================================
 * 24 · STATE AND OPERATIONAL RECEIPTS
 * ========================================================================== */

export function getHEarth3DRendererState() {
  return deepFreeze({
    constructed:
      rendererState.constructed,

    mounted:
      rendererState.mounted,

    mountId:
      rendererState
        .mountElement
        ?.id ??
      null,

    compositorFrameOccurrenceId:
      rendererState
        .currentFrameOccurrenceId,

    compositorFrameRevision:
      rendererState
        .currentFrameRevision,

    cameraRevision:
      rendererState
        .currentCameraRevision,

    viewportRevision:
      rendererState
        .currentViewportRevision,

    visibilityRevision:
      rendererState
        .currentVisibilityRevision,

    admittedPrimitiveCount:
      rendererState
        .currentFrame
        ?.admittedPrimitives
        ?.length ??
      0,

    projectedPrimitiveFragmentCount:
      rendererState
        .primitiveElements
        .length,

    constructSequence:
      rendererState
        .constructSequence,

    mountSequence:
      rendererState
        .mountSequence,

    applySequence:
      rendererState
        .applySequence,

    reprojectSequence:
      rendererState
        .reprojectSequence,

    destroySequence:
      rendererState
        .destroySequence,

    lastConstructReceipt:
      rendererState
        .lastConstructReceipt,

    lastMountReceipt:
      rendererState
        .lastMountReceipt,

    lastApplyReceipt:
      rendererState
        .lastApplyReceipt,

    lastReprojectReceipt:
      rendererState
        .lastReprojectReceipt,

    lastDestroyReceipt:
      rendererState
        .lastDestroyReceipt
  });
}

export function getHEarth3DRendererOperationalReceipts() {
  return deepFreeze({
    construct:
      rendererState
        .lastConstructReceipt,

    mount:
      rendererState
        .lastMountReceipt,

    apply:
      rendererState
        .lastApplyReceipt,

    reproject:
      rendererState
        .lastReprojectReceipt,

    destroy:
      rendererState
        .lastDestroyReceipt
  });
}


/* ==========================================================================
 * 25 · STATIC COHERENCE
 * ========================================================================== */

export const H_EARTH_3D_RENDERER_STATIC_COHERENCE =
  (() => {
    const issues = [];

    if (
      ADMITTED_FRAME_CONTRACT
        ?.contractId !==
      H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID
    ) {
      issues.push(
        createRendererIssue(
          'ADMITTED_FRAME_CONTRACT_ID_MISMATCH',
          'The admitted-frame dependency contract identity is inconsistent.'
        )
      );
    }

    if (
      typeof isHEarth3DAdmittedGeometryFrame !==
      'function'
    ) {
      issues.push(
        createRendererIssue(
          'ADMITTED_FRAME_VALIDATOR_UNAVAILABLE',
          'The admitted-frame validator is unavailable.'
        )
      );
    }

    if (
      typeof evaluateHEarth3DNodeBudget !==
      'function'
    ) {
      issues.push(
        createRendererIssue(
          'NODE_BUDGET_EVALUATOR_UNAVAILABLE',
          'The renderer node-budget evaluator is unavailable.'
        )
      );
    }

    if (
      H_EARTH_3D_RENDERER_STAGE_MODEL
        .DOMAuthorized !==
      true
    ) {
      issues.push(
        createRendererIssue(
          'DOM_OUTPUT_NOT_AUTHORIZED',
          'The current capacity surface does not authorize DOM output.'
        )
      );
    }

    if (
      H_EARTH_3D_RENDERER_STAGE_MODEL
        .CSSAuthorized !==
      true
    ) {
      issues.push(
        createRendererIssue(
          'CSS_OUTPUT_NOT_AUTHORIZED',
          'The current capacity surface does not authorize CSS output.'
        )
      );
    }

    return deepFreeze({
      eligible:
        issues.length === 0,

      status:
        issues.length === 0
          ? 'RENDERER_STATIC_CONFIGURATION_COHERENT'
          : 'RENDERER_STATIC_CONFIGURATION_NOT_COHERENT',

      issues:
        freezeIssues(issues),

      compositorContractId:
        H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

      admittedFrameContractId:
        H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID,

      capacityContractId:
        H_EARTH_3D_CAPACITY_CONTRACT_ID,

      admittedFrameContractPresent:
        ADMITTED_FRAME_CONTRACT !==
        null,

      admittedFrameReceiptPresent:
        ADMITTED_FRAME_RECEIPT !==
        null,

      canonicalInputIsCompositorHandoff:
        true,

      admittedFrameValidatorImportedDirectly:
        true,

      admittedVerticesConsumed:
        true,

      admittedIndicesConsumed:
        true,

      admittedTopologyConsumed:
        true,

      presentationAssignmentsConsumed:
        true,

      frameCameraConsumed:
        true,

      frameViewportConsumed:
        true,

      frameVisibilityConsumed:
        true,

      frameRevisionsConsumed:
        true,

      geometryReconstructed:
        false,

      independentCameraAuthority:
        false,

      independentViewportAuthority:
        false,

      independentVisibilityAuthority:
        false,

      moduleScopeHandoffInvocation:
        false,

      routeBootstrapOwned:
        false,

      rendererMounted:
        false,

      rendererPassClaim:
        false,

      visualPassClaim:
        false,

      validationClaim:
        false,

      productionClaim:
        false
    });
  })();


/* ==========================================================================
 * 26 · CLAIM CEILINGS
 * ========================================================================== */

export const H_EARTH_3D_RENDERER_CLAIM_CEILINGS =
  deepFreeze({
    packet002ConstructionClaim:
      false,

    admittedFrameConstructionClaim:
      false,

    geometryConstructionClaim:
      false,

    westAdmissionClaim:
      false,

    geometryIndexClaim:
      false,

    cameraAuthorityClaim:
      false,

    viewportAuthorityClaim:
      false,

    visibilityAuthorityClaim:
      false,

    compositorRevisionAuthorityClaim:
      false,

    routeBootstrapClaim:
      false,

    controllerClaim:
      false,

    diagnosticJudgmentClaim:
      false,

    actorClaim:
      false,

    groundContactClaim:
      false,

    collisionClaim:
      false,

    traversalClaim:
      false,

    gameplayClaim:
      false,

    fluidSimulationClaim:
      false,

    runtimeActivationClaim:
      false,

    rendererPassClaim:
      false,

    visualPassClaim:
      false,

    validationClaim:
      false,

    productionClaim:
      false,

    matrixCollapse:
      false
  });


/* ==========================================================================
 * 27 · STATIC RECEIPT
 * ========================================================================== */

export const H_EARTH_3D_RENDERER_RECEIPT =
  deepFreeze({
    receiptType:
      'H_EARTH_3D_ADMITTED_GEOMETRY_RENDERER_STATIC_RECEIPT',

    contractId:
      H_EARTH_3D_RENDERER_CONTRACT_ID,

    renewsContractId:
      RENEWS_RENDERER_CONTRACT_ID,

    sourceFile:
      H_EARTH_3D_RENDERER_SOURCE_FILE,

    canonicalInputSelected:
      'COMPOSITOR_RENDERER_HANDOFF',

    admittedFrameCompatibilityWrapperDefined:
      false,

    compositorGetterInvokedAtModuleScope:
      false,

    directAdmittedFrameValidatorImported:
      true,

    admittedPrimitiveMembershipConsumed:
      true,

    admittedPrimitiveIdentityPreserved:
      true,

    admittedGeometryTopologyConsumed:
      true,

    admittedVerticesConsumedWithoutAlteration:
      true,

    admittedIndicesConsumedWithoutAlteration:
      true,

    presentationAssignmentsCorrelatedByPrimitiveId:
      true,

    frameCameraConsumed:
      true,

    frameViewportConsumed:
      true,

    frameVisibilityConsumed:
      true,

    frameRevisionsConsumed:
      true,

    firstFrameLawDefined:
      true,

    replacementFrameLawDefined:
      true,

    duplicateFrameLawDefined:
      true,

    staleFrameLawDefined:
      true,

    revisionRegressionLawDefined:
      true,

    failedReplacementPreservesCurrentFrame:
      true,

    constructLifecycleDefined:
      true,

    mountLifecycleDefined:
      true,

    frameApplyLifecycleDefined:
      true,

    resizeReprojectionDefined:
      true,

    destroyLifecycleDefined:
      true,

    completeReleaseDefined:
      true,

    DOMCSSMaterializationDefined:
      true,

    pointTopologyDefined:
      true,

    lineTopologyDefined:
      true,

    triangleTopologyDefined:
      true,

    nodeBudgetEvaluationDefined:
      true,

    independentRendererCameraSetterRemoved:
      true,

    independentRendererVisibleLayerSetterRemoved:
      true,

    proceduralEnvironmentGeometryRemoved:
      true,

    sourceGeometryReconstructed:
      false,

    admittedCoordinatesAltered:
      false,

    admittedIndicesAltered:
      false,

    moduleSyntaxVerified:
      false,

    importResolutionVerified:
      false,

    moduleInitializationVerified:
      false,

    lawfulHandoffControlledExecutionVerified:
      false,

    firstFrameMaterializationVerified:
      false,

    replacementFrameVerified:
      false,

    duplicateFrameVerified:
      false,

    staleFrameRejectionVerified:
      false,

    revisionRegressionRejectionVerified:
      false,

    browserModuleGraphVerified:
      false,

    routeBootstrapVerified:
      false,

    rendererMountVerified:
      false,

    visibleOutputVerified:
      false,

    visualCorrespondenceVerified:
      false,

    productionValidationClaimed:
      false,

    claimCeilings:
      H_EARTH_3D_RENDERER_CLAIM_CEILINGS
  });


/* ==========================================================================
 * 28 · COMPLETE CONTRACT
 * ========================================================================== */

export const H_EARTH_3D_RENDERER_CONTRACT =
  deepFreeze({
    contractId:
      H_EARTH_3D_RENDERER_CONTRACT_ID,

    schemaVersion:
      H_EARTH_3D_RENDERER_SCHEMA_VERSION,

    renewsContractId:
      RENEWS_RENDERER_CONTRACT_ID,

    sourceFile:
      H_EARTH_3D_RENDERER_SOURCE_FILE,

    layer:
      'H_EARTH_LAYER_4_SHOWROOM_EXECUTION_CORRIDOR',

    role:
      H_EARTH_3D_RENDERER_ROLE,

    status:
      H_EARTH_3D_RENDERER_STATUS,

    corridor:
      deepFreeze([
        'COMPOSITOR_RENDERER_HANDOFF',
        'ADMITTED_GEOMETRY_FRAME_VALIDATION',
        'FRAME_OCCURRENCE_CORRESPONDENCE',
        'ADMITTED_PRIMITIVE_PROJECTION',
        'PRESENTATION_ASSIGNMENT_CORRELATION',
        'DOM_CSS_RESOURCE_CONSTRUCTION',
        'MOUNT_APPLY_REPROJECT_DESTROY',
        'RENDERER_RECEIPTS'
      ]),

    directDependencies:
      deepFreeze({
        capacity:
          './capacity.js',

        compositor:
          './compositor.js',

        admittedGeometryFrame:
          './admitted-geometry-frame.js'
      }),

    compositorContractId:
      H_EARTH_3D_COMPOSITOR_CONTRACT_ID,

    capacityContractId:
      H_EARTH_3D_CAPACITY_CONTRACT_ID,

    admittedGeometryFrameContractId:
      H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_CONTRACT_ID,

    canonicalPublicInput:
      deepFreeze({
        type:
          'COMPOSITOR_RENDERER_HANDOFF',

        requiredFields:
          Object.freeze([
            'ok',
            'contractId',
            'admittedGeometryFrameContractId',
            'admittedGeometryFrame'
          ]),

        admittedFrameField:
          'admittedGeometryFrame'
      }),

    frameApplicationLaw:
      deepFreeze({
        firstFrame:
          'ACCEPT_AND_CONSTRUCT',

        exactDuplicate:
          'ACCEPT_AS_NO_OP',

        sameOccurrenceAndRevisionDifferentIdentity:
          'REJECT_AS_STALE_OR_REUSED_OCCURRENCE',

        lowerFrameRevision:
          'REJECT_AS_REVISION_REGRESSION',

        differentOccurrenceWithSameFrameRevision:
          'REJECT_AS_STALE_FRAME',

        higherFrameRevision:
          'ACCEPT_AS_REPLACEMENT',

        failedReplacement:
          'PRESERVE_CURRENT_FRAME_AND_CURRENT_DOM'
      }),

    materializationLaw:
      deepFreeze({
        primitiveIdentity:
          'PRESERVE_PRIMITIVE_ID',

        geometrySource:
          'ADMITTED_PRIMITIVE_GEOMETRY_ONLY',

        topologySource:
          'ADMITTED_PRIMITIVE_GEOMETRY_TOPOLOGY_MODE',

        vertexSource:
          'ADMITTED_PRIMITIVE_GEOMETRY_VERTICES',

        indexSource:
          'ADMITTED_PRIMITIVE_GEOMETRY_INDICES',

        presentationSource:
          'FRAME_PRESENTATION_ASSIGNMENTS_BY_PRIMITIVE_ID',

        visibilitySource:
          'FRAME_VISIBILITY_SNAPSHOT',

        cameraSource:
          'FRAME_NORMALIZED_RESOLVED_CAMERA_POSE',

        viewportSource:
          'FRAME_VIEWPORT_SNAPSHOT',

        revisionSource:
          'FRAME_REVISIONS',

        geometryReconstruction:
          false,

        coordinateAlteration:
          false,

        indexAlteration:
          false
      }),

    publicLifecycle:
      deepFreeze({
        construct:
          'constructHEarth3DRenderer',

        mount:
          'mountHEarth3DRenderer',

        applyFrame:
          'applyHEarth3DRendererHandoff',

        resize:
          'resizeHEarth3DRenderer',

        destroy:
          'destroyHEarth3DRenderer',

        release:
          'releaseHEarth3DRenderer'
      }),

    stageModel:
      H_EARTH_3D_RENDERER_STAGE_MODEL,

    materialPresentation:
      H_EARTH_3D_RENDERER_MATERIAL_PRESENTATION,

    staticCoherence:
      H_EARTH_3D_RENDERER_STATIC_COHERENCE,

    boundaryFlags:
      H_EARTH_3D_RENDERER_BOUNDARY_FLAGS,

    claimCeilings:
      H_EARTH_3D_RENDERER_CLAIM_CEILINGS
  });


/* ==========================================================================
 * 29 · PUBLIC GETTERS
 * ========================================================================== */

export function getHEarth3DRendererContract() {
  return H_EARTH_3D_RENDERER_CONTRACT;
}

export function getHEarth3DRendererReceipt() {
  return H_EARTH_3D_RENDERER_RECEIPT;
}

export function getHEarth3DRendererStaticCoherence() {
  return H_EARTH_3D_RENDERER_STATIC_COHERENCE;
}

export function getHEarth3DRendererBoundaryFlags() {
  return H_EARTH_3D_RENDERER_BOUNDARY_FLAGS;
}

export function getHEarth3DRendererClaimCeilings() {
  return H_EARTH_3D_RENDERER_CLAIM_CEILINGS;
}


/* ==========================================================================
 * 30 · COMPATIBILITY ALIASES
 * ========================================================================== */

export function mountHEarthCandidateRenderer(
  options = {}
) {
  return mountHEarth3DRenderer(
    options
  );
}

export function destroyHEarthCandidateRenderer() {
  return destroyHEarth3DRenderer();
}


/* ==========================================================================
 * 31 · AGGREGATE EXPORT
 * ========================================================================== */

export const H_EARTH_3D_RENDERER_AGGREGATE =
  deepFreeze({
    contractId:
      H_EARTH_3D_RENDERER_CONTRACT_ID,

    contract:
      H_EARTH_3D_RENDERER_CONTRACT,

    receipt:
      H_EARTH_3D_RENDERER_RECEIPT,

    staticCoherence:
      H_EARTH_3D_RENDERER_STATIC_COHERENCE,

    boundaryFlags:
      H_EARTH_3D_RENDERER_BOUNDARY_FLAGS,

    claimCeilings:
      H_EARTH_3D_RENDERER_CLAIM_CEILINGS,

    constructHEarth3DRenderer,

    mountHEarth3DRenderer,

    applyHEarth3DRendererHandoff,

    resizeHEarth3DRenderer,

    destroyHEarth3DRenderer,

    releaseHEarth3DRenderer,

    projectHEarth3DAdmittedWorldPoint,

    getHEarth3DRendererState,

    getHEarth3DRendererOperationalReceipts,

    getHEarth3DRendererContract,

    getHEarth3DRendererReceipt,

    getHEarth3DRendererStaticCoherence,

    getHEarth3DRendererBoundaryFlags,

    getHEarth3DRendererClaimCeilings,

    mountHEarthCandidateRenderer,

    destroyHEarthCandidateRenderer
  });

export default H_EARTH_3D_RENDERER_AGGREGATE;

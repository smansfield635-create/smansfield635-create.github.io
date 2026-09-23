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
 * → FRAME-OWNED CAMERA AND VIEWPORT
 * → RENDERER MATERIALIZATION EXTENT
 * → CANONICAL ADMITTED GEOMETRY CONSUMPTION
 * → VISIBILITY CORRESPONDENCE
 * → SCALE-AWARE NEAR/FAR CLIPPING
 * → HORIZONTAL/VERTICAL VIEWPORT-FRUSTUM CLIPPING
 * → PRESENTATION CORRELATION
 * → FIFTEEN SEMANTIC LAYER CONTAINERS
 * → ONE INTERACTION-BOUNDARY NODE
 * → DOM/CSS MATERIALIZATION
 * → STAGE-ALIGNED WET-SAND MATERIAL PRESENTATION
 * → MOUNT / APPLY / REPROJECT / DESTROY
 * → RENDERER RECEIPTS
 *
 * Canonical public input:
 *
 * {
 *   ok: true,
 *   contractId: <backed compositor contract>,
 *   admittedGeometryFrameContractId: <backed admitted-frame contract>,
 *   admittedGeometryFrame: <lawful admitted frame>
 * }
 *
 * Public projection law:
 *
 * point + admittedGeometryFrame
 * → internal frame-derived projection context
 * → projected point
 *
 * No public caller may supply independent camera or viewport authority.
 *
 * This file owns:
 * - compositor-handoff consumption;
 * - admitted-frame validation at the renderer boundary;
 * - frame occurrence and revision application law;
 * - exact-duplicate no-op behavior;
 * - frame-derived projection mathematics;
 * - renderer materialization-extent management;
 * - canonical admitted point, line, and triangle consumption;
 * - scale-aware near/far depth clipping;
 * - horizontal and vertical viewport-frustum clipping;
 * - presentation-assignment and visibility correspondence;
 * - fifteen semantic DOM containers;
 * - one non-controller interaction-boundary node;
 * - DOM/CSS materialization;
 * - exact wet-sand material-presentation mapping;
 * - mount, replacement, reprojection, destroy, and release lifecycle;
 * - renderer operational receipts.
 *
 * This file does not own:
 * - Packet 002 construction;
 * - compositor handoff construction;
 * - admitted-frame construction;
 * - geometry creation or reconstruction;
 * - geometry admission;
 * - camera state;
 * - compositor viewport state;
 * - visibility state;
 * - compositor revision advancement;
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
  4;

export const H_EARTH_3D_RENDERER_SOURCE_FILE =
  '/showroom/globe/h-earth/renderer.js';

export const H_EARTH_3D_RENDERER_ROLE =
  'FRAME_AUTHENTICATED_ADMITTED_GEOMETRY_PROJECTION_AND_DOM_CSS_MATERIALIZATION_CONSUMER';

export const H_EARTH_3D_RENDERER_STATUS =
  'FROZEN_CANON_DUPLICATE_CLIPPING_LIFECYCLE_AND_SHORELINE_PRESENTATION_COHERENCE_CANDIDATE';

const RENEWS_RENDERER_CONTRACT_ID =
  'H_EARTH_3D_RENDERER_FILE_RENEWAL_STEP_034O_1_ENVIRONMENT_GEOMETRY_MATERIALIZATION_v1';

const DOM_CSS3D_PROJECTED_ENVIRONMENT_OUTPUT_MODEL =
  'DOM_CSS3D_PROJECTED_ENVIRONMENT';

const RENDERER_SEMANTIC_LAYER_CONTAINER_COUNT =
  15;

const RENDERER_INTERACTION_NODE_COUNT =
  1;

const EMPTY_FROZEN_ARRAY =
  Object.freeze([]);

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

const VIEWPORT_FRUSTUM_PLANE =
  Object.freeze({
    LEFT:
      'LEFT',

    RIGHT:
      'RIGHT',

    BOTTOM:
      'BOTTOM',

    TOP:
      'TOP'
  });

const VIEWPORT_FRUSTUM_TOLERANCE =
  1e-10;

const RENDERER_SEMANTIC_LAYER_CONTAINER_IDS =
  Object.freeze(
    Array.from(
      {
        length:
          RENDERER_SEMANTIC_LAYER_CONTAINER_COUNT
      },
      (
        _unused,
        index
      ) =>
        `H_EARTH_3D_RENDERER_SEMANTIC_LAYER_${String(
          index + 1
        ).padStart(
          2,
          '0'
        )}`
    )
  );


/* ==========================================================================
 * 02 · GENERIC HELPERS
 * ========================================================================== */

function isPlainRecord(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    Array.isArray(value) === false &&
    Object.getPrototypeOf(value) ===
      Object.prototype
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
 * 03 · VECTOR HELPERS
 * ========================================================================== */

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

function addVector(
  left,
  right
) {
  return createVector(
    left.x + right.x,
    left.y + right.y,
    left.z + right.z
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

function interpolateVector(
  start,
  end,
  amount
) {
  return addVector(
    start,
    scaleVector(
      subtractVector(
        end,
        start
      ),
      amount
    )
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


/* ==========================================================================
 * 04 · DEPENDENCY SNAPSHOTS
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

const PERMITTED_OUTPUT_MODELS =
  Array.isArray(
    H_EARTH_3D_RENDER_STAGE_LIMITS
      ?.permittedOutputModels
  )
    ? Object.freeze([
        ...H_EARTH_3D_RENDER_STAGE_LIMITS
          .permittedOutputModels
      ])
    : PERMITTED_OUTPUT_MODEL === null
      ? EMPTY_FROZEN_ARRAY
      : Object.freeze([
          PERMITTED_OUTPUT_MODEL
        ]);

const DOM_CSS3D_OUTPUT_AUTHORIZED =
  (
    PERMITTED_OUTPUT_MODEL ===
      DOM_CSS3D_PROJECTED_ENVIRONMENT_OUTPUT_MODEL ||
    PERMITTED_OUTPUT_MODELS.includes(
      DOM_CSS3D_PROJECTED_ENVIRONMENT_OUTPUT_MODEL
    )
  );


/* ==========================================================================
 * 05 · BOUNDARY FLAGS
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

    ownsRendererMaterializationExtent:
      true,

    ownsProjectedPrimitiveConstruction:
      true,

    ownsNearFarClipping:
      true,

    ownsDOMCSSMaterialization:
      true,

    ownsSemanticLayerContainers:
      true,

    ownsInteractionBoundaryNode:
      true,

    ownsRendererResourceLifecycle:
      true,

    ownsRendererFrameApplicationLaw:
      true,

    ownsRendererReceipts:
      true,

    ownsPacket002Construction:
      false,

    ownsCompositorHandoffConstruction:
      false,

    ownsAdmittedFrameConstruction:
      false,

    ownsGeometryConstruction:
      false,

    ownsGeometryAdmission:
      false,

    ownsCameraState:
      false,

    ownsCompositorViewportState:
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

    acceptsNoncanonicalGeometryFallbacks:
      false,

    generatesMissingIndices:
      false,

    altersAdmittedCoordinates:
      false,

    altersAdmittedIndices:
      false,

    altersAdmittedBounds:
      false,

    altersPrimitiveIdentity:
      false,

    defaultsUnknownVisibilityRoleToVisible:
      false,

    exposesArbitraryProjectionContext:
      false,

    duplicateApplyRebuildsProjection:
      false,

    duplicateApplyReplacesDOM:
      false,

    duplicateApplyAdvancesSequence:
      false,

    repeatedConstructMayReplaceFrame:
      false,

    failedMaterializationAdvancesExtentRevision:
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
 * 06 · MATERIAL PRESENTATION
 * ========================================================================== */

export const H_EARTH_3D_RENDERER_MATERIAL_PRESENTATION =
  deepFreeze({
    H_EARTH_MATERIAL_WET_SAND:
      deepFreeze({
        background:
          'linear-gradient(180deg, #8e8068 0%, #716750 50%, #454d46 100%)',

        boxShadow:
          'none',

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
          'linear-gradient(180deg, rgba(151,188,190,0.94) 0%, rgba(73,142,154,0.97) 36%, rgba(29,91,113,0.99) 100%)',

        opacity:
          0.94
      }),

    H_EARTH_MATERIAL_OPEN_WATER:
      deepFreeze({
        background:
          'linear-gradient(180deg, #4d91a3 0%, #2c7189 44%, #174a67 100%)',

        opacity:
          0.96
      }),

    H_EARTH_MATERIAL_FOAM:
      deepFreeze({
        background:
          'linear-gradient(180deg, rgba(246,247,237,0.97) 0%, rgba(214,227,220,0.88) 56%, rgba(163,194,191,0.54) 100%)',

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
 * 07 · STAGE MODEL
 * ========================================================================== */

export const H_EARTH_3D_RENDERER_STAGE_MODEL =
  deepFreeze({
    permittedOutputModel:
      PERMITTED_OUTPUT_MODEL,

    permittedOutputModels:
      PERMITTED_OUTPUT_MODELS,

    requiredOutputModel:
      DOM_CSS3D_PROJECTED_ENVIRONMENT_OUTPUT_MODEL,

    outputModelAuthorized:
      DOM_CSS3D_OUTPUT_AUTHORIZED,

    rendererMountId:
      RENDERER_MOUNT_ID,

    semanticLayerContainerCount:
      RENDERER_SEMANTIC_LAYER_CONTAINER_COUNT,

    semanticLayerContainerIds:
      RENDERER_SEMANTIC_LAYER_CONTAINER_IDS,

    interactionNodeCount:
      RENDERER_INTERACTION_NODE_COUNT,

    emptyProjectedScenePolicy:
      'LAWFUL_NONVISIBLE_RENDERER_OCCURRENCE_WITHOUT_ENVIRONMENT_PRIMITIVE_BUDGET_CLAIM',

    clippingPolicy:
      'SCALE_AWARE_NEAR_AND_FAR_DEPTH_CLIPPING_ONLY',

    duplicateFramePolicy:
      'EXACT_DUPLICATE_ACCEPTED_AS_IMMEDIATE_NO_OP',

    repeatedConstructionPolicy:
      'ONLY_FIRST_FRAME_OR_EXACT_DUPLICATE_ALLOWED',

    materializationExtentRevisionPolicy:
      'ADVANCE_ONLY_AFTER_SUCCESSFUL_MATERIALIZATION_COMMIT',

    stageClass:
      'h-earth-3d-render-stage',

    sceneClass:
      'h-earth-3d-render-scene',

    semanticLayerClass:
      'h-earth-3d-render-semantic-layer',

    interactionBoundaryClass:
      'h-earth-3d-render-interaction-boundary',

    primitiveClass:
      'h-earth-3d-render-primitive',

    pointClass:
      'h-earth-3d-render-point',

    lineClass:
      'h-earth-3d-render-line',

    triangleClass:
      'h-earth-3d-render-triangle',

    DOMAuthorized:
      DOM_CSS3D_OUTPUT_AUTHORIZED,

    CSSAuthorized:
      DOM_CSS3D_OUTPUT_AUTHORIZED,

    CSSClipPathAuthorized:
      DOM_CSS3D_OUTPUT_AUTHORIZED,

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
 * 08 · INTERNAL STATE
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

  semanticLayerElements:
    new Map(),

  interactionBoundaryElement:
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

  currentCompositorViewportRevision:
    null,

  currentVisibilityRevision:
    null,

  currentProjectionContext:
    null,

  currentProjectionPlan:
    null,

  constructSequence:
    0,

  mountSequence:
    0,

  applySequence:
    0,

  reprojectSequence:
    0,

  materializationExtentRevision:
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
 * 09 · HANDOFF VALIDATION
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
            handoff
              .admittedGeometryFrameContractId ??
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
            frame
              ?.rendererConsumerEligibility ??
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


/* ==========================================================================
 * 10 · FRAME APPLICATION LAW
 * ========================================================================== */

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
                'An existing occurrence identity and frame revision may not identify a different frame object.'
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
 * 11 · FRAME VIEWPORT AND MATERIALIZATION EXTENT
 * ========================================================================== */

function createFrameViewport(
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
      viewport.capacityStatus,

    authority:
      'COMPOSITOR_ADMITTED_FRAME',

    compositorViewportRevision:
      frame.revisions.viewport
  });
}

function createMaterializationExtent(
  frameViewport,
  extentOverride = null,
  extentRevision =
    rendererState.materializationExtentRevision
) {
  if (extentOverride === null) {
    return deepFreeze({
      widthPx:
        frameViewport.widthPx,

      heightPx:
        frameViewport.heightPx,

      pixelRatio:
        frameViewport.pixelRatio,

      aspectRatio:
        frameViewport.aspectRatio,

      orientation:
        frameViewport.orientation,

      source:
        'FRAME_VIEWPORT',

      rendererMaterializationExtentRevision:
        extentRevision
    });
  }

  if (
    !isPlainRecord(
      extentOverride
    ) ||
    !isPositiveFiniteNumber(
      extentOverride.widthPx
    ) ||
    !isPositiveFiniteNumber(
      extentOverride.heightPx
    )
  ) {
    return null;
  }

  const widthPx =
    extentOverride.widthPx;

  const heightPx =
    extentOverride.heightPx;

  return deepFreeze({
    widthPx,

    heightPx,

    pixelRatio:
      frameViewport.pixelRatio,

    aspectRatio:
      widthPx /
      heightPx,

    orientation:
      widthPx === heightPx
        ? 'SQUARE'
        : widthPx > heightPx
          ? 'LANDSCAPE'
          : 'PORTRAIT',

    source:
      'RENDERER_MOUNT_EXTENT',

    rendererMaterializationExtentRevision:
      extentRevision
  });
}


/* ==========================================================================
 * 12 · CAMERA BASIS
 * ========================================================================== */

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
    !isPositiveFiniteNumber(
      pose.verticalFovDegrees
    ) ||
    !isPositiveFiniteNumber(
      pose.nearPlane
    ) ||
    !isPositiveFiniteNumber(
      pose.farPlane
    ) ||
    pose.farPlane <=
      pose.nearPlane
  ) {
    return null;
  }

  const publishedUp =
    normalizeVector(
      pose.up
    );

  const forward =
    normalizeVector(
      subtractVector(
        pose.target,
        pose.position
      )
    );

  const right =
    normalizeVector(
      crossVector(
        publishedUp,
        forward
      )
    );

  const correctedUp =
    normalizeVector(
      crossVector(
        forward,
        right
      )
    );

  if (
    getVectorLength(forward) <=
      Number.EPSILON ||
    getVectorLength(right) <=
      Number.EPSILON ||
    getVectorLength(correctedUp) <=
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

  if (
    !isPositiveFiniteNumber(
      focalLength
    )
  ) {
    return null;
  }

  return deepFreeze({
    position:
      cloneAndFreeze(
        pose.position
      ),

    target:
      cloneAndFreeze(
        pose.target
      ),

    publishedUp:
      deepFreeze(
        publishedUp
      ),

    forward:
      deepFreeze(
        forward
      ),

    right:
      deepFreeze(
        right
      ),

    up:
      deepFreeze(
        correctedUp
      ),

    verticalFovDegrees:
      pose.verticalFovDegrees,

    nearPlane:
      pose.nearPlane,

    farPlane:
      pose.farPlane,

    focalLength,

    cameraRevision:
      frame.revisions.camera,

    basisDerivation:
      'FORWARD_FROM_TARGET_MINUS_POSITION_RIGHT_FROM_CROSS_PUBLISHED_UP_FORWARD_CORRECTED_UP_FROM_CROSS_FORWARD_RIGHT'
  });
}


/* ==========================================================================
 * 13 · PROJECTION CONTEXT
 * ========================================================================== */

function createProjectionContextFromFrame(
  frame,
  materializationExtentOverride = null,
  materializationExtentRevision =
    rendererState.materializationExtentRevision
) {
  const frameViewport =
    createFrameViewport(
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

  const materializationExtent =
    createMaterializationExtent(
      frameViewport,
      materializationExtentOverride,
      materializationExtentRevision
    );

  if (!materializationExtent) {
    return null;
  }

  return deepFreeze({
    frameViewport,

    materializationExtent,

    cameraBasis,

    compositorFrameOccurrenceId:
      frame.compositorFrameOccurrenceId,

    compositorFrameRevision:
      frame.revisions.frame,

    cameraRevision:
      frame.revisions.camera,

    compositorViewportRevision:
      frame.revisions.viewport,

    visibilityRevision:
      frame.revisions.visibility,

    rendererMaterializationExtentRevision:
      materializationExtentRevision
  });
}


/* ==========================================================================
 * 14 · CAMERA-SPACE AND SCREEN PROJECTION
 * ========================================================================== */

function transformWorldPointToCamera(
  point,
  cameraBasis
) {
  const relative =
    subtractVector(
      point,
      cameraBasis.position
    );

  return deepFreeze({
    x:
      dotVector(
        relative,
        cameraBasis.right
      ),

    y:
      dotVector(
        relative,
        cameraBasis.up
      ),

    z:
      dotVector(
        relative,
        cameraBasis.forward
      )
  });
}

function projectCameraPointToScreen(
  cameraPoint,
  projectionContext
) {
  const {
    cameraBasis,
    materializationExtent
  } = projectionContext;

  if (
    cameraPoint.z <=
      cameraBasis.nearPlane ||
    cameraPoint.z >=
      cameraBasis.farPlane
  ) {
    return deepFreeze({
      visible:
        false,

      cameraDepth:
        cameraPoint.z,

      reason:
        'OUTSIDE_CAMERA_DEPTH_RANGE'
    });
  }

  const ndcX =
    (
      cameraPoint.x *
      cameraBasis.focalLength
    ) /
    (
      cameraPoint.z *
      materializationExtent.aspectRatio
    );

  const ndcY =
    (
      cameraPoint.y *
      cameraBasis.focalLength
    ) /
    cameraPoint.z;

  if (
    ndcX <
      -1 -
      VIEWPORT_FRUSTUM_TOLERANCE ||
    ndcX >
      1 +
      VIEWPORT_FRUSTUM_TOLERANCE ||
    ndcY <
      -1 -
      VIEWPORT_FRUSTUM_TOLERANCE ||
    ndcY >
      1 +
      VIEWPORT_FRUSTUM_TOLERANCE
  ) {
    return deepFreeze({
      visible:
        false,

      cameraDepth:
        cameraPoint.z,

      reason:
        'OUTSIDE_HORIZONTAL_VERTICAL_FRUSTUM'
    });
  }

  const boundedNdcX =
    Math.max(
      -1,
      Math.min(
        1,
        ndcX
      )
    );

  const boundedNdcY =
    Math.max(
      -1,
      Math.min(
        1,
        ndcY
      )
    );

  return deepFreeze({
    visible:
      true,

    camera:
      cloneAndFreeze(
        cameraPoint
      ),

    ndc:
      deepFreeze({
        x:
          boundedNdcX,

        y:
          boundedNdcY
      }),

    screen:
      deepFreeze({
        x:
          (
            boundedNdcX +
            1
          ) *
          0.5 *
          materializationExtent.widthPx,

        y:
          (
            1 -
            boundedNdcY
          ) *
          0.5 *
          materializationExtent.heightPx
      }),

    cameraDepth:
      cameraPoint.z
  });
}

function projectWorldPointWithFrameProjectionContext(
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
      projectionContext.materializationExtent
    )
  ) {
    return deepFreeze({
      visible:
        false,

      reason:
        'INVALID_POINT_OR_FRAME_PROJECTION_CONTEXT'
    });
  }

  const cameraPoint =
    transformWorldPointToCamera(
      point,
      projectionContext.cameraBasis
    );

  const projected =
    projectCameraPointToScreen(
      cameraPoint,
      projectionContext
    );

  if (!projected.visible) {
    return projected;
  }

  return deepFreeze({
    ...projected,

    world:
      cloneAndFreeze(
        point
      )
  });
}


/* ==========================================================================
 * 15 · FRAME-AUTHENTICATED PUBLIC PROJECTION API
 * ========================================================================== */

export function projectHEarth3DAdmittedWorldPoint(
  point,
  admittedGeometryFrame
) {
  if (
    !isHEarth3DAdmittedGeometryFrame(
      admittedGeometryFrame
    ) ||
    admittedGeometryFrame
      .rendererConsumerEligibility !==
      true
  ) {
    return deepFreeze({
      projected:
        false,

      visible:
        false,

      status:
        'PUBLIC_POINT_PROJECTION_FRAME_REJECTED',

      compositorFrameOccurrenceId:
        admittedGeometryFrame
          ?.compositorFrameOccurrenceId ??
        null,

      compositorFrameRevision:
        admittedGeometryFrame
          ?.revisions
          ?.frame ??
        null,

      issues:
        freezeIssues([
          createRendererIssue(
            'PUBLIC_POINT_PROJECTION_REQUIRES_ADMITTED_FRAME',
            'Public point projection requires a lawful renderer-eligible admitted geometry frame.'
          )
        ])
    });
  }

  if (!isVector3(point)) {
    return deepFreeze({
      projected:
        false,

      visible:
        false,

      status:
        'PUBLIC_POINT_PROJECTION_POINT_REJECTED',

      compositorFrameOccurrenceId:
        admittedGeometryFrame
          .compositorFrameOccurrenceId,

      compositorFrameRevision:
        admittedGeometryFrame
          .revisions
          .frame,

      issues:
        freezeIssues([
          createRendererIssue(
            'PUBLIC_POINT_PROJECTION_REQUIRES_VECTOR3',
            'Public point projection requires a finite Vector3 record.'
          )
        ])
    });
  }

  const projectionContext =
    createProjectionContextFromFrame(
      admittedGeometryFrame
    );

  if (!projectionContext) {
    return deepFreeze({
      projected:
        false,

      visible:
        false,

      status:
        'PUBLIC_POINT_PROJECTION_CONTEXT_REJECTED',

      compositorFrameOccurrenceId:
        admittedGeometryFrame
          .compositorFrameOccurrenceId,

      compositorFrameRevision:
        admittedGeometryFrame
          .revisions
          .frame,

      issues:
        freezeIssues([
          createRendererIssue(
            'PUBLIC_POINT_PROJECTION_CONTEXT_UNAVAILABLE',
            'The admitted frame did not produce a lawful renderer projection context.'
          )
        ])
    });
  }

  const projection =
    projectWorldPointWithFrameProjectionContext(
      point,
      projectionContext
    );

  return deepFreeze({
    projected:
      projection.visible ===
      true,

    visible:
      projection.visible ===
      true,

    status:
      projection.visible
        ? 'PUBLIC_POINT_PROJECTED'
        : 'PUBLIC_POINT_NOT_VISIBLE',

    compositorFrameOccurrenceId:
      admittedGeometryFrame
        .compositorFrameOccurrenceId,

    compositorFrameRevision:
      admittedGeometryFrame
        .revisions
        .frame,

    cameraRevision:
      admittedGeometryFrame
        .revisions
        .camera,

    compositorViewportRevision:
      admittedGeometryFrame
        .revisions
        .viewport,

    frameViewport:
      projectionContext
        .frameViewport,

    materializationExtent:
      projectionContext
        .materializationExtent,

    projection,

    issues:
      EMPTY_FROZEN_ARRAY
  });
}


/* ==========================================================================
 * 16 · CANONICAL ADMITTED GEOMETRY EXTRACTION
 * ========================================================================== */

function getCanonicalPrimitiveGeometry(
  admittedPrimitive
) {
  return isPlainRecord(
    admittedPrimitive?.geometry
  )
    ? admittedPrimitive.geometry
    : null;
}

function evaluateCanonicalAdmittedPrimitive(
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

  const geometry =
    getCanonicalPrimitiveGeometry(
      admittedPrimitive
    );

  if (!geometry) {
    issues.push(
      createRendererIssue(
        'ADMITTED_PRIMITIVE_GEOMETRY_INVALID',
        'Each admitted primitive must expose a canonical geometry record.'
      )
    );
  }

  const topologyMode =
    geometry?.topologyMode;

  if (
    !isNonEmptyExactString(
      topologyMode
    )
  ) {
    issues.push(
      createRendererIssue(
        'ADMITTED_PRIMITIVE_TOPOLOGY_MODE_INVALID',
        'Canonical admitted geometry must expose geometry.topologyMode.'
      )
    );
  }

  const vertices =
    geometry?.vertices;

  if (
    !Array.isArray(vertices) ||
    vertices.length === 0 ||
    vertices.every(
      isVector3
    ) === false
  ) {
    issues.push(
      createRendererIssue(
        'ADMITTED_PRIMITIVE_VERTICES_INVALID',
        'Canonical admitted geometry must expose nonempty Vector3-record vertices.'
      )
    );
  }

  const indices =
    geometry?.indices;

  if (
    !Array.isArray(indices) ||
    indices.length === 0 ||
    !Array.isArray(vertices) ||
    indices.every(
      (index) =>
        Number.isSafeInteger(index) &&
        index >= 0 &&
        index < vertices.length
    ) === false
  ) {
    issues.push(
      createRendererIssue(
        'ADMITTED_PRIMITIVE_INDICES_INVALID',
        'Canonical admitted geometry must expose explicit in-range indices.'
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
 * 17 · VISIBILITY CORRESPONDENCE
 * ========================================================================== */

function evaluatePresentationAssignmentVisibility(
  assignment,
  visibilitySnapshot
) {
  if (
    !isPlainRecord(
      assignment
    ) ||
    !isNonEmptyExactString(
      assignment.presentationRole
    )
  ) {
    return deepFreeze({
      eligible:
        false,

      visible:
        false,

      status:
        'PRESENTATION_VISIBILITY_ASSIGNMENT_INVALID',

      issues:
        freezeIssues([
          createRendererIssue(
            'PRESENTATION_ROLE_INVALID',
            'The presentation assignment must expose an exact presentation role.'
          )
        ])
    });
  }

  if (
    !isPlainRecord(
      visibilitySnapshot
    )
  ) {
    return deepFreeze({
      eligible:
        false,

      visible:
        false,

      status:
        'FRAME_VISIBILITY_SNAPSHOT_INVALID',

      issues:
        freezeIssues([
          createRendererIssue(
            'VISIBILITY_SNAPSHOT_NOT_RECORD',
            'The admitted frame visibility snapshot must be a strict plain record.'
          )
        ])
    });
  }

  const role =
    assignment.presentationRole;

  if (
    !Object.prototype.hasOwnProperty.call(
      visibilitySnapshot,
      role
    )
  ) {
    return deepFreeze({
      eligible:
        false,

      visible:
        false,

      status:
        'PRESENTATION_ROLE_UNRESOLVED',

      issues:
        freezeIssues([
          createRendererIssue(
            'PRESENTATION_ROLE_NOT_IN_VISIBILITY_SNAPSHOT',
            'The presentation role cannot be correlated to the admitted frame visibility snapshot.',
            {
              field:
                role
            }
          )
        ])
    });
  }

  if (
    typeof visibilitySnapshot[role] !==
    'boolean'
  ) {
    return deepFreeze({
      eligible:
        false,

      visible:
        false,

      status:
        'PRESENTATION_ROLE_VISIBILITY_NOT_BOOLEAN',

      issues:
        freezeIssues([
          createRendererIssue(
            'PRESENTATION_ROLE_VISIBILITY_INVALID',
            'The admitted visibility value for the presentation role must be boolean.',
            {
              field:
                role,

              actual:
                visibilitySnapshot[
                  role
                ]
            }
          )
        ])
    });
  }

  return deepFreeze({
    eligible:
      true,

    visible:
      visibilitySnapshot[role],

    status:
      visibilitySnapshot[role]
        ? 'PRESENTATION_ROLE_VISIBLE'
        : 'PRESENTATION_ROLE_HIDDEN',

    issues:
      EMPTY_FROZEN_ARRAY
  });
}


/* ==========================================================================
 * 18 · PRESENTATION ASSIGNMENT MAP
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

function getBaseMaterialPresentation(
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
 * 19 · SCALE-AWARE NEAR/FAR CLIPPING
 * ========================================================================== */

function resolveDepthTolerance(
  nearPlane,
  farPlane
) {
  const scale =
    Math.max(
      1,
      Math.abs(nearPlane),
      Math.abs(farPlane),
      Math.abs(
        farPlane -
        nearPlane
      )
    );

  const relativeTolerance =
    scale *
    1e-9;

  const ulpTolerance =
    Number.EPSILON *
    scale *
    256;

  const maximumTolerance =
    Math.max(
      Number.EPSILON,
      (
        farPlane -
        nearPlane
      ) *
      1e-6
    );

  return Math.min(
    maximumTolerance,
    Math.max(
      relativeTolerance,
      ulpTolerance
    )
  );
}

function getInteriorDepthBounds(
  nearPlane,
  farPlane
) {
  const tolerance =
    resolveDepthTolerance(
      nearPlane,
      farPlane
    );

  const nearInterior =
    nearPlane +
    tolerance;

  const farInterior =
    farPlane -
    tolerance;

  if (
    !isFiniteNumber(nearInterior) ||
    !isFiniteNumber(farInterior) ||
    nearInterior >=
      farInterior
  ) {
    return null;
  }

  return deepFreeze({
    tolerance,
    nearInterior,
    farInterior
  });
}

function isDepthInside(
  depth,
  nearInterior,
  farInterior
) {
  return (
    depth >
      nearInterior &&
    depth <
      farInterior
  );
}

function clipCameraLineAgainstDepthRange(
  start,
  end,
  nearPlane,
  farPlane
) {
  const interiorBounds =
    getInteriorDepthBounds(
      nearPlane,
      farPlane
    );

  if (!interiorBounds) {
    return null;
  }

  const {
    nearInterior,
    farInterior
  } =
    interiorBounds;

  const startInside =
    isDepthInside(
      start.z,
      nearInterior,
      farInterior
    );

  const endInside =
    isDepthInside(
      end.z,
      nearInterior,
      farInterior
    );

  if (
    startInside &&
    endInside
  ) {
    return deepFreeze({
      start:
        cloneAndFreeze(
          start
        ),

      end:
        cloneAndFreeze(
          end
        ),

      clipped:
        false,

      clippedNear:
        false,

      clippedFar:
        false
    });
  }

  const deltaZ =
    end.z -
    start.z;

  if (
    Math.abs(deltaZ) <=
    Number.EPSILON
  ) {
    return null;
  }

  let tMinimum =
    0;

  let tMaximum =
    1;

  let clippedNear =
    false;

  let clippedFar =
    false;

  if (
    start.z <=
      nearInterior ||
    end.z <=
      nearInterior
  ) {
    const nearT =
      (
        nearInterior -
        start.z
      ) /
      deltaZ;

    if (deltaZ > 0) {
      if (nearT > tMinimum) {
        tMinimum =
          nearT;

        clippedNear =
          true;
      }
    } else if (nearT < tMaximum) {
      tMaximum =
        nearT;

      clippedNear =
        true;
    }
  }

  if (
    start.z >=
      farInterior ||
    end.z >=
      farInterior
  ) {
    const farT =
      (
        farInterior -
        start.z
      ) /
      deltaZ;

    if (deltaZ > 0) {
      if (farT < tMaximum) {
        tMaximum =
          farT;

        clippedFar =
          true;
      }
    } else if (farT > tMinimum) {
      tMinimum =
        farT;

      clippedFar =
        true;
    }
  }

  tMinimum =
    Math.max(
      0,
      tMinimum
    );

  tMaximum =
    Math.min(
      1,
      tMaximum
    );

  if (
    tMinimum >
    tMaximum
  ) {
    return null;
  }

  const clippedStart =
    tMinimum === 0
      ? cloneKnownPlain(
          start
        )
      : interpolateVector(
          start,
          end,
          tMinimum
        );

  const clippedEnd =
    tMaximum === 1
      ? cloneKnownPlain(
          end
        )
      : interpolateVector(
          start,
          end,
          tMaximum
        );

  if (
    !isDepthInside(
      clippedStart.z,
      nearPlane,
      farPlane
    ) ||
    !isDepthInside(
      clippedEnd.z,
      nearPlane,
      farPlane
    )
  ) {
    return null;
  }

  return deepFreeze({
    start:
      deepFreeze(
        clippedStart
      ),

    end:
      deepFreeze(
        clippedEnd
      ),

    clipped:
      tMinimum !== 0 ||
      tMaximum !== 1,

    clippedNear,

    clippedFar
  });
}

function clipCameraPolygonAgainstPlane(
  points,
  {
    boundary,
    keepGreater
  }
) {
  if (points.length === 0) {
    return [];
  }

  const output = [];

  const isInside =
    (point) =>
      keepGreater
        ? point.z >
          boundary
        : point.z <
          boundary;

  const intersect =
    (
      start,
      end
    ) => {
      const deltaZ =
        end.z -
        start.z;

      if (
        Math.abs(deltaZ) <=
        Number.EPSILON
      ) {
        return cloneKnownPlain(
          start
        );
      }

      const amount =
        (
          boundary -
          start.z
        ) /
        deltaZ;

      return interpolateVector(
        start,
        end,
        amount
      );
    };

  let previous =
    points[
      points.length - 1
    ];

  let previousInside =
    isInside(
      previous
    );

  for (const current of points) {
    const currentInside =
      isInside(
        current
      );

    if (
      currentInside &&
      previousInside
    ) {
      output.push(
        current
      );
    } else if (
      currentInside &&
      !previousInside
    ) {
      output.push(
        intersect(
          previous,
          current
        )
      );

      output.push(
        current
      );
    } else if (
      !currentInside &&
      previousInside
    ) {
      output.push(
        intersect(
          previous,
          current
        )
      );
    }

    previous =
      current;

    previousInside =
      currentInside;
  }

  return output;
}

function clipCameraPolygonAgainstDepthRange(
  cameraPoints,
  nearPlane,
  farPlane
) {
  const interiorBounds =
    getInteriorDepthBounds(
      nearPlane,
      farPlane
    );

  if (!interiorBounds) {
    return deepFreeze({
      points:
        EMPTY_FROZEN_ARRAY,

      clipped:
        false,

      clippedNear:
        false,

      clippedFar:
        false
    });
  }

  const {
    nearInterior,
    farInterior
  } =
    interiorBounds;

  const fullyInside =
    cameraPoints.every(
      (point) =>
        isDepthInside(
          point.z,
          nearInterior,
          farInterior
        )
    );

  if (fullyInside) {
    return deepFreeze({
      points:
        Object.freeze([
          ...cameraPoints
        ]),

      clipped:
        false,

      clippedNear:
        false,

      clippedFar:
        false
    });
  }

  const requiresNearClip =
    cameraPoints.some(
      (point) =>
        point.z <=
        nearInterior
    );

  const requiresFarClip =
    cameraPoints.some(
      (point) =>
        point.z >=
        farInterior
    );

  const nearClipped =
    requiresNearClip
      ? clipCameraPolygonAgainstPlane(
          cameraPoints,
          {
            boundary:
              nearInterior,

            keepGreater:
              true
          }
        )
      : [
          ...cameraPoints
        ];

  const farClipped =
    requiresFarClip
      ? clipCameraPolygonAgainstPlane(
          nearClipped,
          {
            boundary:
              farInterior,

            keepGreater:
              false
          }
        )
      : nearClipped;

  const validPoints =
    farClipped.filter(
      (point) =>
        isDepthInside(
          point.z,
          nearPlane,
          farPlane
        )
    );

  return deepFreeze({
    points:
      Object.freeze(
        validPoints.map(
          (point) =>
            deepFreeze(
              cloneKnownPlain(
                point
              )
            )
        )
      ),

    clipped:
      requiresNearClip ||
      requiresFarClip,

    clippedNear:
      requiresNearClip,

    clippedFar:
      requiresFarClip
  });
}


function resolveViewportFrustumPlaneDistance(
  cameraPoint,
  plane,
  projectionContext
) {
  const horizontalExtent =
    (
      cameraPoint.z *
      projectionContext
        .materializationExtent
        .aspectRatio
    ) /
    projectionContext
      .cameraBasis
      .focalLength;

  const verticalExtent =
    cameraPoint.z /
    projectionContext
      .cameraBasis
      .focalLength;

  switch (plane) {
    case VIEWPORT_FRUSTUM_PLANE.LEFT:
      return (
        cameraPoint.x +
        horizontalExtent
      );

    case VIEWPORT_FRUSTUM_PLANE.RIGHT:
      return (
        horizontalExtent -
        cameraPoint.x
      );

    case VIEWPORT_FRUSTUM_PLANE.BOTTOM:
      return (
        cameraPoint.y +
        verticalExtent
      );

    case VIEWPORT_FRUSTUM_PLANE.TOP:
      return (
        verticalExtent -
        cameraPoint.y
      );

    default:
      return Number.NaN;
  }
}

function isInsideViewportFrustumPlane(
  cameraPoint,
  plane,
  projectionContext
) {
  const distance =
    resolveViewportFrustumPlaneDistance(
      cameraPoint,
      plane,
      projectionContext
    );

  return (
    isFiniteNumber(distance) &&
    distance >=
      -VIEWPORT_FRUSTUM_TOLERANCE
  );
}

function interpolateCameraPointAtFrustumPlane(
  start,
  end,
  plane,
  projectionContext
) {
  const startDistance =
    resolveViewportFrustumPlaneDistance(
      start,
      plane,
      projectionContext
    );

  const endDistance =
    resolveViewportFrustumPlaneDistance(
      end,
      plane,
      projectionContext
    );

  const denominator =
    startDistance -
    endDistance;

  if (
    !isFiniteNumber(startDistance) ||
    !isFiniteNumber(endDistance) ||
    Math.abs(denominator) <=
      Number.EPSILON
  ) {
    return cloneKnownPlain(
      start
    );
  }

  const amount =
    Math.max(
      0,
      Math.min(
        1,
        startDistance /
          denominator
      )
    );

  return interpolateVector(
    start,
    end,
    amount
  );
}

function clipCameraLineAgainstViewportFrustum(
  start,
  end,
  projectionContext
) {
  let tMinimum =
    0;

  let tMaximum =
    1;

  let clipped =
    false;

  for (
    const plane
    of Object.values(
      VIEWPORT_FRUSTUM_PLANE
    )
  ) {
    const startDistance =
      resolveViewportFrustumPlaneDistance(
        start,
        plane,
        projectionContext
      );

    const endDistance =
      resolveViewportFrustumPlaneDistance(
        end,
        plane,
        projectionContext
      );

    if (
      !isFiniteNumber(startDistance) ||
      !isFiniteNumber(endDistance)
    ) {
      return null;
    }

    const startInside =
      startDistance >=
        -VIEWPORT_FRUSTUM_TOLERANCE;

    const endInside =
      endDistance >=
        -VIEWPORT_FRUSTUM_TOLERANCE;

    if (
      !startInside &&
      !endInside
    ) {
      return null;
    }

    if (
      startInside ===
      endInside
    ) {
      continue;
    }

    const denominator =
      startDistance -
      endDistance;

    if (
      Math.abs(denominator) <=
      Number.EPSILON
    ) {
      return null;
    }

    const amount =
      Math.max(
        0,
        Math.min(
          1,
          startDistance /
            denominator
        )
      );

    if (!startInside) {
      tMinimum =
        Math.max(
          tMinimum,
          amount
        );
    } else {
      tMaximum =
        Math.min(
          tMaximum,
          amount
        );
    }

    clipped =
      true;

    if (
      tMinimum >
      tMaximum
    ) {
      return null;
    }
  }

  const clippedStart =
    tMinimum === 0
      ? cloneKnownPlain(
          start
        )
      : interpolateVector(
          start,
          end,
          tMinimum
        );

  const clippedEnd =
    tMaximum === 1
      ? cloneKnownPlain(
          end
        )
      : interpolateVector(
          start,
          end,
          tMaximum
        );

  if (
    !Object.values(
      VIEWPORT_FRUSTUM_PLANE
    ).every(
      (plane) =>
        isInsideViewportFrustumPlane(
          clippedStart,
          plane,
          projectionContext
        ) &&
        isInsideViewportFrustumPlane(
          clippedEnd,
          plane,
          projectionContext
        )
    )
  ) {
    return null;
  }

  return deepFreeze({
    start:
      deepFreeze(
        clippedStart
      ),

    end:
      deepFreeze(
        clippedEnd
      ),

    clipped
  });
}

function clipCameraPolygonAgainstViewportPlane(
  points,
  plane,
  projectionContext
) {
  if (points.length === 0) {
    return [];
  }

  const output = [];

  let previous =
    points[
      points.length - 1
    ];

  let previousInside =
    isInsideViewportFrustumPlane(
      previous,
      plane,
      projectionContext
    );

  for (const current of points) {
    const currentInside =
      isInsideViewportFrustumPlane(
        current,
        plane,
        projectionContext
      );

    if (
      currentInside &&
      previousInside
    ) {
      output.push(
        current
      );
    } else if (
      currentInside &&
      !previousInside
    ) {
      output.push(
        interpolateCameraPointAtFrustumPlane(
          previous,
          current,
          plane,
          projectionContext
        )
      );

      output.push(
        current
      );
    } else if (
      !currentInside &&
      previousInside
    ) {
      output.push(
        interpolateCameraPointAtFrustumPlane(
          previous,
          current,
          plane,
          projectionContext
        )
      );
    }

    previous =
      current;

    previousInside =
      currentInside;
  }

  return output;
}

function clipCameraPolygonAgainstViewportFrustum(
  cameraPoints,
  projectionContext
) {
  const fullyInside =
    cameraPoints.every(
      (cameraPoint) =>
        Object.values(
          VIEWPORT_FRUSTUM_PLANE
        ).every(
          (plane) =>
            isInsideViewportFrustumPlane(
              cameraPoint,
              plane,
              projectionContext
            )
        )
    );

  if (fullyInside) {
    return deepFreeze({
      points:
        Object.freeze([
          ...cameraPoints
        ]),

      clipped:
        false
    });
  }

  let clippedPoints = [
    ...cameraPoints
  ];

  for (
    const plane
    of Object.values(
      VIEWPORT_FRUSTUM_PLANE
    )
  ) {
    clippedPoints =
      clipCameraPolygonAgainstViewportPlane(
        clippedPoints,
        plane,
        projectionContext
      );

    if (
      clippedPoints.length === 0
    ) {
      break;
    }
  }

  return deepFreeze({
    points:
      Object.freeze(
        clippedPoints.map(
          (cameraPoint) =>
            deepFreeze(
              cloneKnownPlain(
                cameraPoint
              )
            )
        )
      ),

    clipped:
      true
  });
}


/* ==========================================================================
 * 20 · PROJECTED DESCRIPTORS
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
      ]),

    depthClipped:
      false,

    viewportClipped:
      false
  });
}

function createProjectedLineDescriptor({
  primitiveId,
  assignment,
  sourceVertexIndices,
  projectedPoints,
  depthClipped,
  viewportClipped
}) {
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
      ]),

    depthClipped,

    viewportClipped
  });
}

function createProjectedTriangleDescriptor({
  primitiveId,
  assignment,
  sourceVertexIndices,
  projectedPoints,
  depthClipped,
  viewportClipped
}) {
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
      projectedPoints.length,

    projectedPoints:
      Object.freeze([
        ...projectedPoints
      ]),

    depthClipped,

    viewportClipped
  });
}


/* ==========================================================================
 * 21 · POINT TOPOLOGY
 * ========================================================================== */

function createPointDescriptors({
  primitiveId,
  assignment,
  vertices,
  indices,
  projectionContext
}) {
  const descriptors = [];

  for (const index of indices) {
    const projectedPoint =
      projectWorldPointWithFrameProjectionContext(
        vertices[index],
        projectionContext
      );

    if (projectedPoint.visible) {
      descriptors.push(
        createProjectedPointDescriptor({
          primitiveId,
          assignment,

          sourceVertexIndex:
            index,

          projectedPoint
        })
      );
    }
  }

  return descriptors;
}


/* ==========================================================================
 * 22 · LINE TOPOLOGY
 * ========================================================================== */

function createLineDescriptorFromIndices({
  primitiveId,
  assignment,
  vertices,
  sourceIndices,
  projectionContext
}) {
  const startCamera =
    transformWorldPointToCamera(
      vertices[
        sourceIndices[0]
      ],
      projectionContext.cameraBasis
    );

  const endCamera =
    transformWorldPointToCamera(
      vertices[
        sourceIndices[1]
      ],
      projectionContext.cameraBasis
    );

  const clippedLine =
    clipCameraLineAgainstDepthRange(
      startCamera,
      endCamera,
      projectionContext
        .cameraBasis
        .nearPlane,
      projectionContext
        .cameraBasis
        .farPlane
    );

  if (!clippedLine) {
    return null;
  }

  const viewportClippedLine =
    clipCameraLineAgainstViewportFrustum(
      clippedLine.start,
      clippedLine.end,
      projectionContext
    );

  if (!viewportClippedLine) {
    return null;
  }

  const projectedStart =
    projectCameraPointToScreen(
      viewportClippedLine.start,
      projectionContext
    );

  const projectedEnd =
    projectCameraPointToScreen(
      viewportClippedLine.end,
      projectionContext
    );

  if (
    !projectedStart.visible ||
    !projectedEnd.visible
  ) {
    return null;
  }

  return createProjectedLineDescriptor({
    primitiveId,
    assignment,

    sourceVertexIndices:
      sourceIndices,

    projectedPoints:
      [
        projectedStart,
        projectedEnd
      ],

    depthClipped:
      clippedLine.clipped,

    viewportClipped:
      viewportClippedLine.clipped
  });
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
    const descriptor =
      createLineDescriptorFromIndices({
        primitiveId,
        assignment,
        vertices,

        sourceIndices: [
          indices[index],
          indices[index + 1]
        ],

        projectionContext
      });

    if (descriptor) {
      descriptors.push(
        descriptor
      );
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
    const descriptor =
      createLineDescriptorFromIndices({
        primitiveId,
        assignment,
        vertices,

        sourceIndices: [
          indices[index],
          indices[index + 1]
        ],

        projectionContext
      });

    if (descriptor) {
      descriptors.push(
        descriptor
      );
    }
  }

  return descriptors;
}


/* ==========================================================================
 * 23 · TRIANGLE TOPOLOGY
 * ========================================================================== */

function createClippedTriangleDescriptors({
  primitiveId,
  assignment,
  vertices,
  sourceIndices,
  projectionContext
}) {
  const cameraPoints =
    sourceIndices.map(
      (sourceIndex) =>
        transformWorldPointToCamera(
          vertices[sourceIndex],
          projectionContext.cameraBasis
        )
    );

  const clippingResult =
    clipCameraPolygonAgainstDepthRange(
      cameraPoints,
      projectionContext
        .cameraBasis
        .nearPlane,
      projectionContext
        .cameraBasis
        .farPlane
    );

  const viewportClippingResult =
    clipCameraPolygonAgainstViewportFrustum(
      clippingResult.points,
      projectionContext
    );

  const clippedPolygon =
    viewportClippingResult.points;

  if (
    clippedPolygon.length < 3
  ) {
    return [];
  }

  const descriptors = [];

  const anchor =
    clippedPolygon[0];

  for (
    let index = 1;
    index + 1 <
      clippedPolygon.length;
    index += 1
  ) {
    const triangleCameraPoints = [
      anchor,
      clippedPolygon[index],
      clippedPolygon[index + 1]
    ];

    const projectedPoints =
      triangleCameraPoints.map(
        (cameraPoint) =>
          projectCameraPointToScreen(
            cameraPoint,
            projectionContext
          )
      );

    if (
      projectedPoints.every(
        (point) =>
          point.visible === true
      )
    ) {
      descriptors.push(
        createProjectedTriangleDescriptor({
          primitiveId,
          assignment,

          sourceVertexIndices:
            sourceIndices,

          projectedPoints,

          depthClipped:
            clippingResult.clipped,

          viewportClipped:
            viewportClippingResult.clipped
        })
      );
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
    descriptors.push(
      ...createClippedTriangleDescriptors({
        primitiveId,
        assignment,
        vertices,

        sourceIndices: [
          indices[index],
          indices[index + 1],
          indices[index + 2]
        ],

        projectionContext
      })
    );
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

    descriptors.push(
      ...createClippedTriangleDescriptors({
        primitiveId,
        assignment,
        vertices,
        sourceIndices,
        projectionContext
      })
    );
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
    descriptors.push(
      ...createClippedTriangleDescriptors({
        primitiveId,
        assignment,
        vertices,

        sourceIndices: [
          centerIndex,
          indices[index],
          indices[index + 1]
        ],

        projectionContext
      })
    );
  }

  return descriptors;
}


/* ==========================================================================
 * 24 · PRIMITIVE PROJECTION
 * ========================================================================== */

function projectAdmittedPrimitive({
  admittedPrimitive,
  assignment,
  projectionContext
}) {
  const evaluation =
    evaluateCanonicalAdmittedPrimitive(
      admittedPrimitive
    );

  if (!evaluation.eligible) {
    return deepFreeze({
      eligible:
        false,

      primitiveId:
        admittedPrimitive
          ?.primitiveId ??
        null,

      visible:
        false,

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

        visible:
          false,

        descriptors:
          EMPTY_FROZEN_ARRAY,

        issues:
          freezeIssues([
            createRendererIssue(
              'ADMITTED_TOPOLOGY_MODE_UNSUPPORTED',
              'The canonical admitted topology mode is not supported by the DOM/CSS renderer.',
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

    visible:
      descriptors.length > 0,

    sourceVertexCount:
      vertices.length,

    sourceIndexCount:
      indices.length,

    projectedDescriptorCount:
      descriptors.length,

    descriptors:
      Object.freeze(
        descriptors
      ),

    issues:
      EMPTY_FROZEN_ARRAY
  });
}


/* ==========================================================================
 * 25 · SEMANTIC LAYER PLAN
 * ========================================================================== */

function createSemanticLayerPlan(
  projectedDescriptors
) {
  const renderLayerIds = [];
  const seenRenderLayerIds =
    new Set();

  for (
    const descriptor
    of projectedDescriptors
  ) {
    const renderLayer =
      descriptor
        ?.assignment
        ?.renderLayer;

    if (
      !isNonEmptyExactString(
        renderLayer
      )
    ) {
      return deepFreeze({
        eligible:
          false,

        assignments:
          EMPTY_FROZEN_ARRAY,

        issues:
          freezeIssues([
            createRendererIssue(
              'PRESENTATION_RENDER_LAYER_INVALID',
              'Every projected descriptor requires an exact presentation renderLayer.'
            )
          ])
      });
    }

    if (
      !seenRenderLayerIds.has(
        renderLayer
      )
    ) {
      seenRenderLayerIds.add(
        renderLayer
      );

      renderLayerIds.push(
        renderLayer
      );
    }
  }

  if (
    renderLayerIds.length >
    RENDERER_SEMANTIC_LAYER_CONTAINER_COUNT
  ) {
    return deepFreeze({
      eligible:
        false,

      assignments:
        EMPTY_FROZEN_ARRAY,

      issues:
        freezeIssues([
          createRendererIssue(
            'SEMANTIC_RENDER_LAYER_CAPACITY_EXCEEDED',
            'The frame requires more semantic render layers than the renderer stage model admits.',
            {
              expected:
                RENDERER_SEMANTIC_LAYER_CONTAINER_COUNT,

              actual:
                renderLayerIds.length
            }
          )
        ])
    });
  }

  const assignments =
    RENDERER_SEMANTIC_LAYER_CONTAINER_IDS.map(
      (
        containerId,
        index
      ) =>
        deepFreeze({
          containerId,

          semanticIndex:
            index,

          renderLayer:
            renderLayerIds[index] ??
            null
        })
    );

  return deepFreeze({
    eligible:
      true,

    activeRenderLayerCount:
      renderLayerIds.length,

    containerCount:
      RENDERER_SEMANTIC_LAYER_CONTAINER_COUNT,

    renderLayerIds:
      Object.freeze([
        ...renderLayerIds
      ]),

    assignments:
      Object.freeze(
        assignments
      ),

    issues:
      EMPTY_FROZEN_ARRAY
  });
}

function resolveDescriptorSemanticContainerId(
  descriptor,
  semanticLayerPlan
) {
  const renderLayer =
    descriptor.assignment.renderLayer;

  const assignment =
    semanticLayerPlan
      .assignments
      .find(
        (candidate) =>
          candidate.renderLayer ===
          renderLayer
      );

  return (
    assignment?.containerId ??
    null
  );
}


/* ==========================================================================
 * 26 · FRAME PROJECTION PLAN
 * ========================================================================== */

function createFrameProjectionPlan(
  frame,
  materializationExtentOverride = null,
  materializationExtentRevision =
    rendererState.materializationExtentRevision
) {
  const issues = [];

  const projectionContext =
    createProjectionContextFromFrame(
      frame,
      materializationExtentOverride,
      materializationExtentRevision
    );

  if (!projectionContext) {
    return deepFreeze({
      eligible:
        false,

      status:
        'FRAME_PROJECTION_CONTEXT_NOT_RESOLVED',

      emptyProjectedScene:
        false,

      projectionContext:
        null,

      primitivePlans:
        EMPTY_FROZEN_ARRAY,

      projectedDescriptors:
        EMPTY_FROZEN_ARRAY,

      semanticLayerPlan:
        null,

      issues:
        freezeIssues([
          createRendererIssue(
            'FRAME_CAMERA_VIEWPORT_OR_EXTENT_INVALID',
            'The renderer could not resolve the frame camera, compositor viewport, or renderer materialization extent.'
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

      emptyProjectedScene:
        false,

      projectionContext,

      primitivePlans:
        EMPTY_FROZEN_ARRAY,

      projectedDescriptors:
        EMPTY_FROZEN_ARRAY,

      semanticLayerPlan:
        null,

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
      const issue =
        createRendererIssue(
          'PRIMITIVE_PRESENTATION_ASSIGNMENT_MISSING',
          'Every admitted primitive requires exactly one presentation assignment.',
          {
            field:
              primitiveId ??
              null
          }
        );

      issues.push(
        issue
      );

      primitivePlans.push(
        deepFreeze({
          eligible:
            false,

          primitiveId:
            primitiveId ??
            null,

          visible:
            false,

          descriptors:
            EMPTY_FROZEN_ARRAY,

          issues:
            Object.freeze([
              issue
            ])
        })
      );

      continue;
    }

    const visibilityEvaluation =
      evaluatePresentationAssignmentVisibility(
        assignment,
        frame.visibilitySnapshot
      );

    if (!visibilityEvaluation.eligible) {
      issues.push(
        ...visibilityEvaluation.issues
      );

      primitivePlans.push(
        deepFreeze({
          eligible:
            false,

          primitiveId,

          topologyMode:
            admittedPrimitive
              ?.geometry
              ?.topologyMode ??
            null,

          visible:
            false,

          descriptors:
            EMPTY_FROZEN_ARRAY,

          visibilityEvaluation,

          issues:
            visibilityEvaluation.issues
        })
      );

      continue;
    }

    if (!visibilityEvaluation.visible) {
      const canonicalEvaluation =
        evaluateCanonicalAdmittedPrimitive(
          admittedPrimitive
        );

      if (!canonicalEvaluation.eligible) {
        issues.push(
          ...canonicalEvaluation.issues
        );

        primitivePlans.push(
          deepFreeze({
            eligible:
              false,

            primitiveId,

            visible:
              false,

            descriptors:
              EMPTY_FROZEN_ARRAY,

            visibilityEvaluation,

            issues:
              canonicalEvaluation.issues
          })
        );

        continue;
      }

      primitivePlans.push(
        deepFreeze({
          eligible:
            true,

          primitiveId,

          topologyMode:
            canonicalEvaluation
              .topologyMode,

          visible:
            false,

          sourceVertexCount:
            canonicalEvaluation
              .vertices
              .length,

          sourceIndexCount:
            canonicalEvaluation
              .indices
              .length,

          projectedDescriptorCount:
            0,

          descriptors:
            EMPTY_FROZEN_ARRAY,

          visibilityEvaluation,

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
      deepFreeze({
        ...primitivePlan,
        visibilityEvaluation
      })
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

  const projectedPrimitiveIds =
    primitivePlans.map(
      (plan) =>
        plan.primitiveId
    );

  const canonicalFramePrimitiveIds =
    Object.freeze([
      ...frame.admittedPrimitiveIds
    ].sort());

  const canonicalProjectedPrimitiveIds =
    Object.freeze([
      ...projectedPrimitiveIds
    ].sort());

  if (
    frame.admittedPrimitiveIds.length !==
      primitivePlans.length ||
    !arraysEqual(
      canonicalFramePrimitiveIds,
      canonicalProjectedPrimitiveIds
    )
  ) {
    issues.push(
      createRendererIssue(
        'RENDERER_PRIMITIVE_MEMBERSHIP_CORRESPONDENCE_FAILED',
        'The renderer projection plan must preserve admitted primitive membership exactly regardless of lawful West insertion order.'
      )
    );
  }

  const semanticLayerPlan =
    createSemanticLayerPlan(
      projectedDescriptors
    );

  if (!semanticLayerPlan.eligible) {
    issues.push(
      ...semanticLayerPlan.issues
    );
  }

  const emptyProjectedScene =
    issues.length === 0 &&
    projectedDescriptors.length === 0;

  return deepFreeze({
    eligible:
      issues.length === 0,

    status:
      issues.length > 0
        ? 'FRAME_PROJECTION_PLAN_NOT_ELIGIBLE'
        : emptyProjectedScene
          ? 'FRAME_PROJECTION_PLAN_ELIGIBLE_EMPTY_SCENE'
          : 'FRAME_PROJECTION_PLAN_ELIGIBLE',

    emptyProjectedScene,

    projectionContext,

    primitivePlans:
      Object.freeze(
        primitivePlans
      ),

    projectedDescriptors:
      Object.freeze(
        projectedDescriptors
      ),

    semanticLayerPlan,

    issues:
      freezeIssues(issues)
  });
}


/* ==========================================================================
 * 27 · NODE-BUDGET POLICY
 * ========================================================================== */

function evaluateRendererNodeBudget(
  projectedDescriptorCount
) {
  if (
    !isNonNegativeSafeInteger(
      projectedDescriptorCount
    )
  ) {
    return deepFreeze({
      eligible:
        false,

      status:
        'RENDERER_NODE_BUDGET_INPUT_INVALID',

      emptyProjectedScene:
        false,

      authorityEvaluation:
        null
    });
  }

  if (
    projectedDescriptorCount ===
    0
  ) {
    return deepFreeze({
      eligible:
        true,

      status:
        'EMPTY_PROJECTED_SCENE_NOT_SUBMITTED_AS_ENVIRONMENT_PRIMITIVE_BUDGET',

      emptyProjectedScene:
        true,

      semanticLayerContainers:
        RENDERER_SEMANTIC_LAYER_CONTAINER_COUNT,

      environmentPrimitives:
        0,

      interactionNodes:
        RENDERER_INTERACTION_NODE_COUNT,

      diagnosticOwnedNodes:
        0,

      authorityEvaluation:
        null,

      authorityClaim:
        false,

      rationale:
        'ZERO_PROJECTED_DESCRIPTORS_IS_CHARACTERIZED_AS_A_LAWFUL_NONVISIBLE_RENDERER_OCCURRENCE_NOT_AS_A_NODE_BUDGET_OVERFLOW'
    });
  }

  const authorityEvaluation =
    evaluateHEarth3DNodeBudget({
      semanticLayerContainers:
        RENDERER_SEMANTIC_LAYER_CONTAINER_COUNT,

      environmentPrimitives:
        projectedDescriptorCount,

      interactionNodes:
        RENDERER_INTERACTION_NODE_COUNT,

      diagnosticOwnedNodes:
        0
    });

  return deepFreeze({
    eligible:
      authorityEvaluation
        ?.eligible === true,

    status:
      authorityEvaluation
        ?.eligible === true
        ? 'RENDERER_NODE_BUDGET_ELIGIBLE'
        : 'RENDERER_NODE_BUDGET_NOT_ELIGIBLE',

    emptyProjectedScene:
      false,

    semanticLayerContainers:
      RENDERER_SEMANTIC_LAYER_CONTAINER_COUNT,

    environmentPrimitives:
      projectedDescriptorCount,

    interactionNodes:
      RENDERER_INTERACTION_NODE_COUNT,

    diagnosticOwnedNodes:
      0,

    authorityEvaluation
  });
}


/* ==========================================================================
 * 28 · DOM RESOURCE CONSTRUCTION
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

  element.dataset.semanticLayerContainerCount =
    String(
      RENDERER_SEMANTIC_LAYER_CONTAINER_COUNT
    );

  element.dataset.interactionNodeCount =
    String(
      RENDERER_INTERACTION_NODE_COUNT
    );

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
        'linear-gradient(180deg, #4f6874 0%, #6f878e 38%, #9ca9a4 53%, #667772 66%, #303b39 100%)',

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

function createSemanticLayerElement(
  assignment
) {
  const element =
    document.createElement(
      'div'
    );

  element.className =
    H_EARTH_3D_RENDERER_STAGE_MODEL
      .semanticLayerClass;

  element.dataset.semanticLayerContainerId =
    assignment.containerId;

  element.dataset.semanticLayerIndex =
    String(
      assignment.semanticIndex
    );

  if (
    assignment.renderLayer !==
    null
  ) {
    element.dataset.renderLayer =
      assignment.renderLayer;
  }

  setStyles(
    element,
    {
      position:
        'absolute',

      inset:
        '0',

      overflow:
        'visible',

      pointerEvents:
        'none',

      zIndex:
        assignment.semanticIndex
    }
  );

  return element;
}

function createInteractionBoundaryElement() {
  const element =
    document.createElement(
      'div'
    );

  element.className =
    H_EARTH_3D_RENDERER_STAGE_MODEL
      .interactionBoundaryClass;

  element.dataset.rendererInteractionBoundary =
    'true';

  element.dataset.controllerBehaviorOwned =
    'false';

  element.tabIndex =
    -1;

  element.setAttribute(
    'aria-hidden',
    'true'
  );

  setStyles(
    element,
    {
      position:
        'absolute',

      inset:
        '0',

      pointerEvents:
        'none',

      background:
        'transparent',

      zIndex:
        RENDERER_SEMANTIC_LAYER_CONTAINER_COUNT +
        1
    }
  );

  return element;
}

const H_EARTH_3D_WET_SAND_BALANCED_PRESENTATION =
  deepFreeze({
    background:
      'radial-gradient(ellipse at 22% 70%, rgba(197, 174, 129, 0.18) 0%, rgba(197, 174, 129, 0) 43%), radial-gradient(ellipse at 78% 76%, rgba(49, 71, 65, 0.20) 0%, rgba(49, 71, 65, 0) 48%), linear-gradient(180deg, rgba(199, 218, 211, 0.22) 0%, rgba(151, 147, 121, 0.11) 32%, rgba(78, 76, 61, 0.20) 68%, rgba(43, 55, 51, 0.34) 100%), linear-gradient(180deg, #978568 0%, #756a52 50%, #424b45 100%)',

    boxShadow:
      'none',

    filter:
      'none',

    mixBlendMode:
      'normal',

    opacity:
      '1'
  });

function isWetSandPresentationAssignment(
  assignment
) {
  return (
    assignment?.materialReference ===
      'H_EARTH_MATERIAL_WET_SAND' &&
    assignment?.materialIntent ===
      'WET_SAND'
  );
}

const H_EARTH_3D_STAGE_ALIGNED_SHORELINE_MATERIAL_REFERENCES =
  new Set([
    'H_EARTH_MATERIAL_WET_SAND',
    'H_EARTH_MATERIAL_NEARSHORE_WATER',
    'H_EARTH_MATERIAL_OPEN_WATER',
    'H_EARTH_MATERIAL_FOAM'
  ]);

function isStageAlignedShorelinePresentationAssignment(
  assignment
) {
  return H_EARTH_3D_STAGE_ALIGNED_SHORELINE_MATERIAL_REFERENCES
    .has(
      assignment?.materialReference
    );
}

function getMaterialPresentation(
  assignment
) {
  const basePresentation =
    getBaseMaterialPresentation(
      assignment
    );

  if (
    !isWetSandPresentationAssignment(
      assignment
    )
  ) {
    return basePresentation;
  }

  return deepFreeze({
    ...basePresentation,
    ...H_EARTH_3D_WET_SAND_BALANCED_PRESENTATION
  });
}

function applyStageAlignedShorelinePresentation(
  element,
  assignment,
  materializationExtent
) {
  if (
    !isStageAlignedShorelinePresentationAssignment(
      assignment
    ) ||
    !isPlainRecord(
      materializationExtent
    ) ||
    !isPositiveFiniteNumber(
      materializationExtent.widthPx
    ) ||
    !isPositiveFiniteNumber(
      materializationExtent.heightPx
    )
  ) {
    return element;
  }

  const parsedLeftPx =
    Number.parseFloat(
      element.style.left
    );

  const parsedTopPx =
    Number.parseFloat(
      element.style.top
    );

  const leftPx =
    Number.isFinite(parsedLeftPx)
      ? parsedLeftPx
      : 0;

  const topPx =
    Number.isFinite(parsedTopPx)
      ? parsedTopPx
      : 0;

  setStyles(
    element,
    {
      backgroundSize:
        `${materializationExtent.widthPx}px ${materializationExtent.heightPx}px`,

      backgroundPosition:
        `${-leftPx}px ${-topPx}px`,

      backgroundRepeat:
        'no-repeat'
    }
  );

  element.dataset.shorelinePresentationModel =
    'COHERENT_STAGE_ALIGNED_v2';

  return element;
}

function applyPresentation(
  element,
  assignment,
  materializationExtent = null
) {
  const presentation =
    getMaterialPresentation(
      assignment
    );

  setStyles(
    element,
    presentation
  );

  applyStageAlignedShorelinePresentation(
    element,
    assignment,
    materializationExtent
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
  descriptorIndex,
  materializationExtent
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

  element.dataset.depthClipped =
    String(
      descriptor.depthClipped
    );

  element.dataset.viewportClipped =
    String(
      descriptor.viewportClipped
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
    descriptor.assignment,
    materializationExtent
  );
}

function createLineElement(
  descriptor,
  descriptorIndex,
  materializationExtent
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

  element.dataset.depthClipped =
    String(
      descriptor.depthClipped
    );

  element.dataset.viewportClipped =
    String(
      descriptor.viewportClipped
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
    descriptor.assignment,
    materializationExtent
  );
}

function createTriangleElement(
  descriptor,
  descriptorIndex,
  materializationExtent
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

  element.dataset.depthClipped =
    String(
      descriptor.depthClipped
    );

  element.dataset.viewportClipped =
    String(
      descriptor.viewportClipped
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
    descriptor.assignment,
    materializationExtent
  );
}

function createDescriptorElement(
  descriptor,
  descriptorIndex,
  materializationExtent
) {
  switch (descriptor.type) {
    case 'POINT':
      return createPointElement(
        descriptor,
        descriptorIndex,
        materializationExtent
      );

    case 'LINE':
      return createLineElement(
        descriptor,
        descriptorIndex,
        materializationExtent
      );

    case 'TRIANGLE':
      return createTriangleElement(
        descriptor,
        descriptorIndex,
        materializationExtent
      );

    default:
      return null;
  }
}

function buildSceneFragment(
  projectionPlan
) {
  const rootFragment =
    document.createDocumentFragment();

  const semanticLayerElements =
    new Map();

  for (
    const assignment
    of projectionPlan
      .semanticLayerPlan
      .assignments
  ) {
    const layerElement =
      createSemanticLayerElement(
        assignment
      );

    semanticLayerElements.set(
      assignment.containerId,
      layerElement
    );

    rootFragment.appendChild(
      layerElement
    );
  }

  const primitiveElements = [];

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
            descriptorIndex,
            projectionPlan
              .projectionContext
              .materializationExtent
          );

        if (!element) {
          return;
        }

        const containerId =
          resolveDescriptorSemanticContainerId(
            descriptor,
            projectionPlan
              .semanticLayerPlan
          );

        const layerElement =
          semanticLayerElements.get(
            containerId
          );

        if (!layerElement) {
          return;
        }

        layerElement.appendChild(
          element
        );

        primitiveElements.push(
          element
        );
      }
    );

  const interactionBoundaryElement =
    createInteractionBoundaryElement();

  rootFragment.appendChild(
    interactionBoundaryElement
  );

  return {
    fragment:
      rootFragment,

    semanticLayerElements,

    interactionBoundaryElement,

    primitiveElements
  };
}


/* ==========================================================================
 * 29 · CONSTRUCTION
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

        rendererStateConstructed:
          rendererState.constructed,

        projectionPlanConstructed:
          false,

        rendererDOMResourcesCreated:
          rendererState.mounted,

        rendererMounted:
          rendererState.mounted,

        status:
          'RENDERER_CONSTRUCTION_REJECTED',

        currentFramePreserved:
          true,

        currentDOMPreserved:
          true,

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
    rendererState.constructed
  ) {
    if (
      applicationEvaluation.duplicate ===
      true
    ) {
      const receipt =
        deepFreeze({
          receiptType:
            'H_EARTH_3D_RENDERER_CONSTRUCT_RECEIPT',

          contractId:
            H_EARTH_3D_RENDERER_CONTRACT_ID,

          constructed:
            true,

          rendererStateConstructed:
            true,

          projectionPlanConstructed:
            rendererState
              .currentProjectionPlan !==
            null,

          rendererDOMResourcesCreated:
            rendererState.mounted,

          rendererMounted:
            rendererState.mounted,

          status:
            'RENDERER_ALREADY_CONSTRUCTED_FOR_FRAME',

          frameApplicationStatus:
            FRAME_APPLICATION_STATUS
              .DUPLICATE_FRAME,

          compositorFrameOccurrenceId:
            rendererState
              .currentFrameOccurrenceId,

          compositorFrameRevision:
            rendererState
              .currentFrameRevision,

          duplicateFrame:
            true,

          materiallyChanged:
            false,

          currentFramePreserved:
            true,

          currentDOMPreserved:
            true,

          constructSequenceAdvanced:
            false,

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

    const receipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_RENDERER_CONSTRUCT_RECEIPT',

        contractId:
          H_EARTH_3D_RENDERER_CONTRACT_ID,

        constructed:
          false,

        rendererStateConstructed:
          true,

        projectionPlanConstructed:
          rendererState
            .currentProjectionPlan !==
          null,

        rendererDOMResourcesCreated:
          rendererState.mounted,

        rendererMounted:
          rendererState.mounted,

        status:
          'RENDERER_ALREADY_CONSTRUCTED_USE_APPLY_FOR_REPLACEMENT',

        frameApplicationStatus:
          applicationEvaluation.status,

        compositorFrameOccurrenceId:
          frame.compositorFrameOccurrenceId,

        compositorFrameRevision:
          frame.revisions.frame,

        currentFramePreserved:
          true,

        currentDOMPreserved:
          true,

        constructSequenceAdvanced:
          false,

        issues:
          freezeIssues([
            createRendererIssue(
              'RENDERER_REPLACEMENT_REQUIRES_APPLY',
              'An established renderer may accept only an exact duplicate through constructHEarth3DRenderer(); replacement frames must use applyHEarth3DRendererHandoff().'
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

  if (
    applicationEvaluation.eligible !==
    true ||
    applicationEvaluation.status !==
      FRAME_APPLICATION_STATUS
        .FIRST_FRAME
  ) {
    const receipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_RENDERER_CONSTRUCT_RECEIPT',

        contractId:
          H_EARTH_3D_RENDERER_CONTRACT_ID,

        constructed:
          false,

        rendererStateConstructed:
          false,

        projectionPlanConstructed:
          false,

        rendererDOMResourcesCreated:
          false,

        rendererMounted:
          false,

        status:
          'RENDERER_FIRST_FRAME_CONSTRUCTION_REJECTED',

        frameApplicationStatus:
          applicationEvaluation.status,

        compositorFrameOccurrenceId:
          frame.compositorFrameOccurrenceId,

        compositorFrameRevision:
          frame.revisions.frame,

        currentFramePreserved:
          true,

        currentDOMPreserved:
          true,

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

        rendererStateConstructed:
          false,

        projectionPlanConstructed:
          false,

        rendererDOMResourcesCreated:
          false,

        rendererMounted:
          false,

        status:
          'RENDERER_PROJECTION_PLAN_REJECTED',

        frameApplicationStatus:
          applicationEvaluation.status,

        compositorFrameOccurrenceId:
          frame.compositorFrameOccurrenceId,

        compositorFrameRevision:
          frame.revisions.frame,

        currentFramePreserved:
          true,

        currentDOMPreserved:
          true,

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

  if (!nodeBudgetEvaluation.eligible) {
    const receipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_RENDERER_CONSTRUCT_RECEIPT',

        contractId:
          H_EARTH_3D_RENDERER_CONTRACT_ID,

        constructed:
          false,

        rendererStateConstructed:
          false,

        projectionPlanConstructed:
          true,

        rendererDOMResourcesCreated:
          false,

        rendererMounted:
          false,

        status:
          'RENDERER_NODE_BUDGET_REJECTED',

        frameApplicationStatus:
          applicationEvaluation.status,

        compositorFrameOccurrenceId:
          frame.compositorFrameOccurrenceId,

        compositorFrameRevision:
          frame.revisions.frame,

        currentFramePreserved:
          true,

        currentDOMPreserved:
          true,

        nodeBudgetEvaluation,

        issues:
          freezeIssues([
            createRendererIssue(
              'RENDERER_NODE_BUDGET_NOT_ELIGIBLE',
              'The nonempty renderer projection plan does not satisfy the backed node-budget authority.'
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

  rendererState.currentCompositorViewportRevision =
    frame.revisions.viewport;

  rendererState.currentVisibilityRevision =
    frame.revisions.visibility;

  rendererState.currentProjectionContext =
    projectionPlan.projectionContext;

  rendererState.currentProjectionPlan =
    projectionPlan;

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

      rendererStateConstructed:
        true,

      projectionPlanConstructed:
        true,

      rendererDOMResourcesCreated:
        false,

      rendererMounted:
        false,

      status:
        projectionPlan.emptyProjectedScene
          ? 'RENDERER_STATE_CONSTRUCTED_FOR_LAWFUL_EMPTY_SCENE'
          : 'RENDERER_STATE_AND_PROJECTION_PLAN_CONSTRUCTED',

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

      compositorViewportRevision:
        frame.revisions.viewport,

      visibilityRevision:
        frame.revisions.visibility,

      frameViewport:
        projectionPlan
          .projectionContext
          .frameViewport,

      materializationExtent:
        projectionPlan
          .projectionContext
          .materializationExtent,

      rendererMaterializationExtentRevision:
        rendererState
          .materializationExtentRevision,

      admittedPrimitiveCount:
        frame.admittedPrimitives.length,

      projectedPrimitiveFragmentCount:
        projectionPlan
          .projectedDescriptors
          .length,

      emptyProjectedScene:
        projectionPlan
          .emptyProjectedScene,

      semanticLayerContainerCount:
        RENDERER_SEMANTIC_LAYER_CONTAINER_COUNT,

      interactionNodeCount:
        RENDERER_INTERACTION_NODE_COUNT,

      presentationAssignmentCount:
        frame.presentationAssignments.length,

      sourcePrimitiveIdentityPreserved:
        true,

      canonicalGeometryFieldsOnly:
        true,

      missingIndicesGenerated:
        false,

      sourceGeometryReconstructed:
        false,

      admittedCoordinatesAltered:
        false,

      admittedIndicesAltered:
        false,

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
 * 30 · MATERIALIZATION
 * ========================================================================== */

function prepareCurrentFrameMaterialization(
  materializationExtentOverride = null,
  proposedExtentRevision =
    rendererState.materializationExtentRevision
) {
  if (
    !rendererState.constructed ||
    !rendererState.currentFrame ||
    !rendererState.sceneElement
  ) {
    return deepFreeze({
      prepared:
        false,

      status:
        'RENDERER_NOT_READY_FOR_MATERIALIZATION',

      projectionPlan:
        null,

      nodeBudgetEvaluation:
        null,

      issues:
        freezeIssues([
          createRendererIssue(
            'RENDERER_STATE_OR_SCENE_UNAVAILABLE',
            'The renderer must be constructed and mounted before materialization.'
          )
        ])
    });
  }

  const projectionPlan =
    createFrameProjectionPlan(
      rendererState.currentFrame,
      materializationExtentOverride,
      proposedExtentRevision
    );

  if (!projectionPlan.eligible) {
    return deepFreeze({
      prepared:
        false,

      status:
        'RENDERER_PROJECTION_PLAN_REJECTED',

      projectionPlan,

      nodeBudgetEvaluation:
        null,

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

  if (!nodeBudgetEvaluation.eligible) {
    return deepFreeze({
      prepared:
        false,

      status:
        'RENDERER_NODE_BUDGET_REJECTED',

      projectionPlan,

      nodeBudgetEvaluation,

      issues:
        freezeIssues([
          createRendererIssue(
            'RENDERER_NODE_BUDGET_NOT_ELIGIBLE',
            'The nonempty renderer projection plan does not satisfy the backed node-budget authority.'
          )
        ])
    });
  }

  return deepFreeze({
    prepared:
      true,

    status:
      'RENDERER_MATERIALIZATION_PREPARED',

    projectionPlan,

    nodeBudgetEvaluation,

    issues:
      EMPTY_FROZEN_ARRAY
  });
}

function commitPreparedMaterialization(
  preparation,
  {
    commitExtentRevision =
      false,

    proposedExtentRevision =
      rendererState.materializationExtentRevision
  } = {}
) {
  if (
    preparation?.prepared !==
      true ||
    !rendererState.sceneElement
  ) {
    return deepFreeze({
      rendered:
        false,

      status:
        'RENDERER_MATERIALIZATION_NOT_PREPARED',

      issues:
        preparation?.issues ??
        freezeIssues([
          createRendererIssue(
            'RENDERER_MATERIALIZATION_PREPARATION_REQUIRED',
            'A lawful materialization preparation is required before commit.'
          )
        ])
    });
  }

  const projectionPlan =
    preparation.projectionPlan;

  const sceneResources =
    buildSceneFragment(
      projectionPlan
    );

  rendererState
    .sceneElement
    .replaceChildren(
      sceneResources.fragment
    );

  rendererState.semanticLayerElements =
    sceneResources
      .semanticLayerElements;

  rendererState.interactionBoundaryElement =
    sceneResources
      .interactionBoundaryElement;

  rendererState.primitiveElements =
    sceneResources
      .primitiveElements;

  rendererState.currentProjectionContext =
    projectionPlan.projectionContext;

  rendererState.currentProjectionPlan =
    projectionPlan;

  if (commitExtentRevision) {
    rendererState.materializationExtentRevision =
      proposedExtentRevision;
  }

  rendererState.applySequence +=
    1;

  return deepFreeze({
    rendered:
      true,

    status:
      projectionPlan.emptyProjectedScene
        ? 'LAWFUL_EMPTY_RENDERER_SCENE_MATERIALIZED'
        : 'ADMITTED_GEOMETRY_FRAME_MATERIALIZED',

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

    compositorViewportRevision:
      rendererState
        .currentCompositorViewportRevision,

    visibilityRevision:
      rendererState
        .currentVisibilityRevision,

    rendererMaterializationExtentRevision:
      rendererState
        .materializationExtentRevision,

    frameViewport:
      projectionPlan
        .projectionContext
        .frameViewport,

    materializationExtent:
      projectionPlan
        .projectionContext
        .materializationExtent,

    semanticLayerContainerCount:
      rendererState
        .semanticLayerElements
        .size,

    interactionNodeCount:
      rendererState
        .interactionBoundaryElement ===
      null
        ? 0
        : 1,

    projectedPrimitiveFragmentCount:
      rendererState
        .primitiveElements
        .length,

    emptyProjectedScene:
      projectionPlan
        .emptyProjectedScene,

    projectionPlan,

    nodeBudgetEvaluation:
      preparation
        .nodeBudgetEvaluation,

    rendererDOMResourcesCreated:
      true,

    rendererMounted:
      rendererState.mounted,

    sourcePrimitiveIdentityPreserved:
      true,

    canonicalGeometryFieldsOnly:
      true,

    missingIndicesGenerated:
      false,

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
 * 31 · MOUNT
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

        rendererDOMResourcesCreated:
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

        rendererDOMResourcesCreated:
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

        rendererDOMResourcesCreated:
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

  const measuredWidth =
    Math.max(
      rect.width,
      resolvedMountElement.clientWidth
    );

  const measuredHeight =
    Math.max(
      rect.height,
      resolvedMountElement.clientHeight
    );

  const extentOverride =
    (
      isPositiveFiniteNumber(
        measuredWidth
      ) &&
      isPositiveFiniteNumber(
        measuredHeight
      )
    )
      ? {
          widthPx:
            measuredWidth,

          heightPx:
            measuredHeight
        }
      : null;

  const extentChangeRequested =
    extentOverride !==
    null;

  const proposedExtentRevision =
    extentChangeRequested
      ? rendererState
          .materializationExtentRevision +
        1
      : rendererState
          .materializationExtentRevision;

  const preparation =
    prepareCurrentFrameMaterialization(
      extentOverride,
      proposedExtentRevision
    );

  if (!preparation.prepared) {
    resolvedMountElement.replaceChildren();

    rendererState.mountElement =
      null;

    rendererState.stageElement =
      null;

    rendererState.sceneElement =
      null;

    rendererState.semanticLayerElements =
      new Map();

    rendererState.interactionBoundaryElement =
      null;

    rendererState.primitiveElements =
      [];

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

        rendererDOMResourcesCreated:
          false,

        status:
          'INITIAL_FRAME_MATERIALIZATION_FAILED',

        materializationExtentRevisionAdvanced:
          false,

        rendererMaterializationExtentRevision:
          rendererState
            .materializationExtentRevision,

        preparation,

        issues:
          preparation.issues,

        rendererPassClaim:
          false,

        visualPassClaim:
          false
      });

    rendererState.lastMountReceipt =
      receipt;

    return receipt;
  }

  const materialization =
    commitPreparedMaterialization(
      preparation,
      {
        commitExtentRevision:
          extentChangeRequested,

        proposedExtentRevision
      }
    );

  if (!materialization.rendered) {
    resolvedMountElement.replaceChildren();

    rendererState.mountElement =
      null;

    rendererState.stageElement =
      null;

    rendererState.sceneElement =
      null;

    rendererState.semanticLayerElements =
      new Map();

    rendererState.interactionBoundaryElement =
      null;

    rendererState.primitiveElements =
      [];

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

        rendererDOMResourcesCreated:
          false,

        status:
          'INITIAL_FRAME_MATERIALIZATION_COMMIT_FAILED',

        materializationExtentRevisionAdvanced:
          false,

        rendererMaterializationExtentRevision:
          rendererState
            .materializationExtentRevision,

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

      rendererDOMResourcesCreated:
        true,

      status:
        materialization.emptyProjectedScene
          ? 'RENDERER_MOUNTED_WITH_LAWFUL_EMPTY_SCENE'
          : 'RENDERER_MOUNTED_WITH_ADMITTED_FRAME',

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

      compositorViewportRevision:
        rendererState
          .currentCompositorViewportRevision,

      visibilityRevision:
        rendererState
          .currentVisibilityRevision,

      materializationExtentRevisionAdvanced:
        extentChangeRequested,

      rendererMaterializationExtentRevision:
        rendererState
          .materializationExtentRevision,

      frameViewport:
        materialization
          .frameViewport,

      materializationExtent:
        materialization
          .materializationExtent,

      semanticLayerContainerCount:
        rendererState
          .semanticLayerElements
          .size,

      interactionNodeCount:
        rendererState
          .interactionBoundaryElement ===
        null
          ? 0
          : 1,

      projectedPrimitiveFragmentCount:
        rendererState
          .primitiveElements
          .length,

      emptyProjectedScene:
        materialization
          .emptyProjectedScene,

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
 * 32 · APPLY OR REPLACE FRAME
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

        currentDOMPreserved:
          true,

        applySequenceAdvanced:
          false,

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

  if (!rendererState.constructed) {
    const receipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_RENDERER_FRAME_APPLY_RECEIPT',

        contractId:
          H_EARTH_3D_RENDERER_CONTRACT_ID,

        applied:
          false,

        status:
          'RENDERER_CONSTRUCTION_REQUIRED_BEFORE_FRAME_APPLICATION',

        frameApplicationStatus:
          FRAME_APPLICATION_STATUS
            .INVALID_FRAME,

        currentFramePreserved:
          true,

        currentDOMPreserved:
          true,

        applySequenceAdvanced:
          false,

        issues:
          freezeIssues([
            createRendererIssue(
              'RENDERER_CONSTRUCTION_REQUIRED',
              'Frame application is available only after the canonical construct transition.'
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

  const frame =
    handoffEvaluation.frame;

  const applicationEvaluation =
    evaluateFrameApplication(
      frame
    );

  if (
    applicationEvaluation.duplicate ===
    true
  ) {
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
          FRAME_APPLICATION_STATUS
            .DUPLICATE_FRAME,

        duplicateFrame:
          true,

        materiallyChanged:
          false,

        currentFramePreserved:
          true,

        currentDOMPreserved:
          true,

        projectionRebuilt:
          false,

        nodeBudgetEvaluated:
          false,

        DOMReplaced:
          false,

        frameStateAssigned:
          false,

        applySequenceAdvanced:
          false,

        compositorFrameOccurrenceId:
          rendererState
            .currentFrameOccurrenceId,

        compositorFrameRevision:
          rendererState
            .currentFrameRevision,

        applySequence:
          rendererState
            .applySequence,

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
          'RENDERER_FRAME_REPLACEMENT_REJECTED',

        frameApplicationStatus:
          applicationEvaluation.status,

        duplicateFrame:
          false,

        materiallyChanged:
          false,

        currentFramePreserved:
          true,

        currentDOMPreserved:
          true,

        applySequenceAdvanced:
          false,

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

  const extentOverride =
    (
      rendererState.mounted &&
      rendererState.mountElement &&
      isPositiveFiniteNumber(
        rendererState
          .mountElement
          .clientWidth
      ) &&
      isPositiveFiniteNumber(
        rendererState
          .mountElement
          .clientHeight
      )
    )
      ? {
          widthPx:
            rendererState
              .mountElement
              .clientWidth,

          heightPx:
            rendererState
              .mountElement
              .clientHeight
        }
      : null;

  const projectionPlan =
    createFrameProjectionPlan(
      frame,
      extentOverride,
      rendererState
        .materializationExtentRevision
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

        currentDOMPreserved:
          true,

        applySequenceAdvanced:
          false,

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

  if (!nodeBudgetEvaluation.eligible) {
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

        currentDOMPreserved:
          true,

        applySequenceAdvanced:
          false,

        compositorFrameOccurrenceId:
          frame.compositorFrameOccurrenceId,

        compositorFrameRevision:
          frame.revisions.frame,

        nodeBudgetEvaluation,

        issues:
          freezeIssues([
            createRendererIssue(
              'RENDERER_NODE_BUDGET_NOT_ELIGIBLE',
              'The nonempty replacement projection plan does not satisfy the backed node-budget authority.'
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

  const replacementResources =
    (
      rendererState.mounted &&
      rendererState.sceneElement
    )
      ? buildSceneFragment(
          projectionPlan
        )
      : null;

  if (
    replacementResources &&
    rendererState.sceneElement
  ) {
    rendererState
      .sceneElement
      .replaceChildren(
        replacementResources.fragment
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

  rendererState.currentCompositorViewportRevision =
    frame.revisions.viewport;

  rendererState.currentVisibilityRevision =
    frame.revisions.visibility;

  rendererState.currentProjectionContext =
    projectionPlan.projectionContext;

  rendererState.currentProjectionPlan =
    projectionPlan;

  if (replacementResources) {
    rendererState.semanticLayerElements =
      replacementResources
        .semanticLayerElements;

    rendererState.interactionBoundaryElement =
      replacementResources
        .interactionBoundaryElement;

    rendererState.primitiveElements =
      replacementResources
        .primitiveElements;
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
        projectionPlan.emptyProjectedScene
          ? 'RENDERER_FRAME_REPLACED_WITH_LAWFUL_EMPTY_SCENE'
          : 'RENDERER_FRAME_REPLACED',

      frameApplicationStatus:
        applicationEvaluation.status,

      duplicateFrame:
        false,

      materiallyChanged:
        true,

      currentFramePreserved:
        false,

      currentDOMPreserved:
        replacementResources ===
        null,

      projectionRebuilt:
        true,

      nodeBudgetEvaluated:
        true,

      DOMReplaced:
        replacementResources !==
        null,

      frameStateAssigned:
        true,

      applySequenceAdvanced:
        true,

      compositorFrameOccurrenceId:
        frame.compositorFrameOccurrenceId,

      packet002TransferOccurrenceId:
        frame.packet002TransferOccurrenceId,

      compositorFrameRevision:
        frame.revisions.frame,

      cameraRevision:
        frame.revisions.camera,

      compositorViewportRevision:
        frame.revisions.viewport,

      visibilityRevision:
        frame.revisions.visibility,

      rendererMaterializationExtentRevision:
        rendererState
          .materializationExtentRevision,

      frameViewport:
        projectionPlan
          .projectionContext
          .frameViewport,

      materializationExtent:
        projectionPlan
          .projectionContext
          .materializationExtent,

      emptyProjectedScene:
        projectionPlan
          .emptyProjectedScene,

      projectedPrimitiveFragmentCount:
        projectionPlan
          .projectedDescriptors
          .length,

      semanticLayerContainerCount:
        RENDERER_SEMANTIC_LAYER_CONTAINER_COUNT,

      interactionNodeCount:
        RENDERER_INTERACTION_NODE_COUNT,

      sourcePrimitiveIdentityPreserved:
        true,

      canonicalGeometryFieldsOnly:
        true,

      missingIndicesGenerated:
        false,

      sourceGeometryReconstructed:
        false,

      admittedCoordinatesAltered:
        false,

      admittedIndicesAltered:
        false,

      mountedDOMUpdated:
        replacementResources !==
        null,

      rendererDOMResourcesCreated:
        replacementResources !==
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
 * 33 · RESIZE / REPROJECT
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

        materializationExtentRevisionAdvanced:
          false,

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
          'RENDERER_MATERIALIZATION_EXTENT_INVALID',

        materializationExtentRevisionAdvanced:
          false,

        rendererMaterializationExtentRevision:
          rendererState
            .materializationExtentRevision,

        issues:
          freezeIssues([
            createRendererIssue(
              'MATERIALIZATION_EXTENT_INVALID',
              'Renderer reprojection requires positive finite materialization dimensions.'
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

  const proposedExtentRevision =
    rendererState
      .materializationExtentRevision +
    1;

  const preparation =
    prepareCurrentFrameMaterialization(
      {
        widthPx:
          resolvedWidth,

        heightPx:
          resolvedHeight
      },
      proposedExtentRevision
    );

  if (!preparation.prepared) {
    const receipt =
      deepFreeze({
        receiptType:
          'H_EARTH_3D_RENDERER_REPROJECT_RECEIPT',

        contractId:
          H_EARTH_3D_RENDERER_CONTRACT_ID,

        reprojected:
          false,

        status:
          'RENDERER_REPROJECTION_PREPARATION_FAILED',

        compositorViewportRevision:
          rendererState
            .currentCompositorViewportRevision,

        materializationExtentRevisionAdvanced:
          false,

        rendererMaterializationExtentRevision:
          rendererState
            .materializationExtentRevision,

        proposedRendererMaterializationExtentRevision:
          proposedExtentRevision,

        preparation,

        issues:
          preparation.issues,

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
    commitPreparedMaterialization(
      preparation,
      {
        commitExtentRevision:
          true,

        proposedExtentRevision
      }
    );

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
          'RENDERER_REPROJECTION_COMMIT_FAILED',

        compositorViewportRevision:
          rendererState
            .currentCompositorViewportRevision,

        materializationExtentRevisionAdvanced:
          false,

        rendererMaterializationExtentRevision:
          rendererState
            .materializationExtentRevision,

        proposedRendererMaterializationExtentRevision:
          proposedExtentRevision,

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
        materialization.emptyProjectedScene
          ? 'RENDERER_REPROJECTED_TO_LAWFUL_EMPTY_SCENE'
          : 'RENDERER_REPROJECTED',

      compositorFrameOccurrenceId:
        rendererState
          .currentFrameOccurrenceId,

      compositorFrameRevision:
        rendererState
          .currentFrameRevision,

      compositorViewportRevision:
        rendererState
          .currentCompositorViewportRevision,

      materializationExtentRevisionAdvanced:
        true,

      rendererMaterializationExtentRevision:
        rendererState
          .materializationExtentRevision,

      frameViewport:
        materialization
          .frameViewport,

      materializationExtent:
        materialization
          .materializationExtent,

      compositorViewportMutated:
        false,

      compositorViewportRevisionAdvanced:
        false,

      semanticLayerContainerCount:
        rendererState
          .semanticLayerElements
          .size,

      interactionNodeCount:
        rendererState
          .interactionBoundaryElement ===
        null
          ? 0
          : 1,

      projectedPrimitiveFragmentCount:
        rendererState
          .primitiveElements
          .length,

      emptyProjectedScene:
        materialization
          .emptyProjectedScene,

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
 * 34 · DESTROY
 * ========================================================================== */

export function destroyHEarth3DRenderer() {
  const wasMounted =
    rendererState.mounted;

  const removedPrimitiveCount =
    rendererState
      .primitiveElements
      .length;

  const removedSemanticLayerContainerCount =
    rendererState
      .semanticLayerElements
      .size;

  const removedInteractionNodeCount =
    rendererState
      .interactionBoundaryElement ===
    null
      ? 0
      : 1;

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

  rendererState.semanticLayerElements =
    new Map();

  rendererState.interactionBoundaryElement =
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

      removedSemanticLayerContainerCount,

      removedInteractionNodeCount,

      removedPrimitiveCount,

      rendererDOMResourcesCreated:
        false,

      rendererMounted:
        false,

      frameStatePreserved:
        rendererState.currentFrame !==
        null,

      rendererConstructionPreserved:
        rendererState.constructed,

      compositorViewportStatePreserved:
        true,

      materializationExtentRevisionPreserved:
        true,

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
 * 35 · COMPLETE RELEASE
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

  rendererState.currentCompositorViewportRevision =
    null;

  rendererState.currentVisibilityRevision =
    null;

  rendererState.currentProjectionContext =
    null;

  rendererState.currentProjectionPlan =
    null;

  rendererState.materializationExtentRevision =
    0;

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

    rendererDOMResourcesCreated:
      false,

    rendererMounted:
      false,

    rendererMaterializationExtentRevision:
      0,

    issues:
      EMPTY_FROZEN_ARRAY,

    rendererPassClaim:
      false,

    visualPassClaim:
      false
  });
}


/* ==========================================================================
 * 36 · STATE AND OPERATIONAL RECEIPTS
 * ========================================================================== */

export function getHEarth3DRendererState() {
  return deepFreeze({
    constructed:
      rendererState.constructed,

    mounted:
      rendererState.mounted,

    rendererStateConstructed:
      rendererState.constructed,

    rendererDOMResourcesCreated:
      rendererState.mounted &&
      rendererState.stageElement !==
        null &&
      rendererState.sceneElement !==
        null,

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

    compositorViewportRevision:
      rendererState
        .currentCompositorViewportRevision,

    visibilityRevision:
      rendererState
        .currentVisibilityRevision,

    rendererMaterializationExtentRevision:
      rendererState
        .materializationExtentRevision,

    frameViewport:
      rendererState
        .currentProjectionContext
        ?.frameViewport ??
      null,

    materializationExtent:
      rendererState
        .currentProjectionContext
        ?.materializationExtent ??
      null,

    admittedPrimitiveCount:
      rendererState
        .currentFrame
        ?.admittedPrimitives
        ?.length ??
      0,

    semanticLayerContainerCount:
      rendererState
        .semanticLayerElements
        .size,

    interactionNodeCount:
      rendererState
        .interactionBoundaryElement ===
      null
        ? 0
        : 1,

    projectedPrimitiveFragmentCount:
      rendererState
        .primitiveElements
        .length,

    emptyProjectedScene:
      rendererState
        .currentProjectionPlan
        ?.emptyProjectedScene ??
      null,

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
 * 37 · STATIC COHERENCE
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
      DOM_CSS3D_OUTPUT_AUTHORIZED !==
      true
    ) {
      issues.push(
        createRendererIssue(
          'DOM_CSS3D_OUTPUT_MODEL_NOT_AUTHORIZED',
          'The backed capacity surface does not authorize DOM_CSS3D_PROJECTED_ENVIRONMENT.',
          {
            expected:
              DOM_CSS3D_PROJECTED_ENVIRONMENT_OUTPUT_MODEL,

            actual:
              deepFreeze({
                permittedOutputModel:
                  PERMITTED_OUTPUT_MODEL,

                permittedOutputModels:
                  PERMITTED_OUTPUT_MODELS
              })
          }
        )
      );
    }

    if (
      RENDERER_SEMANTIC_LAYER_CONTAINER_IDS
        .length !==
      RENDERER_SEMANTIC_LAYER_CONTAINER_COUNT
    ) {
      issues.push(
        createRendererIssue(
          'RENDERER_SEMANTIC_LAYER_CONTAINER_ID_COUNT_INVALID',
          'The renderer semantic-layer-container identifier set is incomplete.'
        )
      );
    }

    if (
      RENDERER_INTERACTION_NODE_COUNT !==
      1
    ) {
      issues.push(
        createRendererIssue(
          'RENDERER_INTERACTION_NODE_COUNT_INVALID',
          'The renderer interaction-boundary model must contain exactly one node.'
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

      publicProjectionRequiresAdmittedFrame:
        true,

      arbitraryPublicProjectionContextAccepted:
        false,

      cameraBasisDerivedFromPublishedPoseFields:
        true,

      permittedOutputAuthorizationDerivedFromExactModel:
        true,

      compositorViewportSeparatedFromMaterializationExtent:
        true,

      resizeAdvancesCompositorViewportRevision:
        false,

      unknownVisibilityRoleRejectsProjectionPlan:
        true,

      unknownVisibilityRoleDefaultsVisible:
        false,

      canonicalTopologyFieldOnly:
        true,

      vectorRecordVerticesOnly:
        true,

      explicitAdmittedIndicesRequired:
        true,

      missingIndicesGenerated:
        false,

      semanticLayerContainerCount:
        RENDERER_SEMANTIC_LAYER_CONTAINER_COUNT,

      interactionNodeCount:
        RENDERER_INTERACTION_NODE_COUNT,

      zeroDescriptorPolicyDefined:
        true,

      zeroDescriptorsMisreportedAsBudgetOverflow:
        false,

      fullyInteriorLinesPreserveEndpoints:
        true,

      clippingToleranceScaleAware:
        true,

      clippingInsetAppliedOnlyWhenRequired:
        true,

      nearFarLineClippingDefined:
        true,

      nearFarTriangleClippingDefined:
        true,

      horizontalVerticalFrustumClippingDefined:
        true,

      exactDuplicateApplyImmediateNoOp:
        true,

      exactDuplicateApplyRebuildsProjection:
        false,

      exactDuplicateApplyReplacesDOM:
        false,

      exactDuplicateApplyAdvancesSequence:
        false,

      repeatedConstructReplacementRejected:
        true,

      materializationExtentRevisionTransactional:
        true,

      failedMaterializationAdvancesExtentRevision:
        false,

      geometryReconstructed:
        false,

      independentCameraAuthority:
        false,

      independentCompositorViewportAuthority:
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
 * 38 · CLAIM CEILINGS
 * ========================================================================== */

export const H_EARTH_3D_RENDERER_CLAIM_CEILINGS =
  deepFreeze({
    packet002ConstructionClaim:
      false,

    compositorHandoffConstructionClaim:
      false,

    admittedFrameConstructionClaim:
      false,

    geometryConstructionClaim:
      false,

    geometryAdmissionClaim:
      false,

    cameraAuthorityClaim:
      false,

    compositorViewportAuthorityClaim:
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
 * 39 · STATIC RECEIPT
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

    publicProjectionTopology:
      'ADMITTED_FRAME_INPUT_WITH_INTERNAL_CONTEXT_DERIVATION',

    arbitraryPublicProjectionContextRemoved:
      true,

    unresolvedVisibilityRolePolicy:
      'REJECT_COMPLETE_FRAME_PROJECTION_PLAN',

    permissiveVisibilityFallbackRemoved:
      true,

    compositorViewportAndMaterializationExtentSeparated:
      true,

    rendererResizeMutatesCompositorViewport:
      false,

    rendererResizeAdvancesCompositorViewportRevision:
      false,

    canonicalGeometryFieldsOnly:
      true,

    acceptedTopologyField:
      'geometry.topologyMode',

    acceptedVertexSurface:
      'geometry.vertices_VECTOR3_RECORDS',

    acceptedIndexSurface:
      'geometry.indices_EXPLICIT',

    topologyFallbacksRemoved:
      true,

    flatNumericVertexFallbackRemoved:
      true,

    sequentialIndexGenerationRemoved:
      true,

    zeroProjectedDescriptorPolicy:
      'LAWFUL_NONVISIBLE_RENDERER_OCCURRENCE',

    zeroProjectedDescriptorsSubmittedAsBudgetOverflow:
      false,

    exactDuplicateApplyPolicy:
      'IMMEDIATE_NO_OP',

    exactDuplicateProjectionRebuilt:
      false,

    exactDuplicateBudgetEvaluated:
      false,

    exactDuplicateDOMReplaced:
      false,

    exactDuplicateFrameStateAssigned:
      false,

    exactDuplicateApplySequenceAdvanced:
      false,

    repeatedConstructReplacementPolicy:
      'REJECT_AND_REQUIRE_APPLY',

    fullyInteriorLineEndpointCorrespondencePreserved:
      true,

    scaleAwareDepthToleranceDefined:
      true,

    clippingInsetAppliedOnlyForActualBoundaryCrossing:
      true,

    nearFarLineClippingDefined:
      true,

    nearFarTriangleClippingDefined:
      true,

    screenRectangleClippingDefined:
      true,

    materializationExtentRevisionPolicy:
      'COMMIT_AFTER_SUCCESSFUL_MATERIALIZATION_ONLY',

    failedMountMaterializationAdvancesExtentRevision:
      false,

    failedResizeMaterializationAdvancesExtentRevision:
      false,

    semanticLayerContainerCount:
      RENDERER_SEMANTIC_LAYER_CONTAINER_COUNT,

    interactionNodeCount:
      RENDERER_INTERACTION_NODE_COUNT,

    admittedPrimitiveIdentityPreserved:
      true,

    admittedCoordinatesAltered:
      false,

    admittedIndicesAltered:
      false,

    sourceGeometryReconstructed:
      false,

    constructionReceiptResourceTerminologySeparated:
      true,

    applyBeforeConstructRejected:
      true,

    moduleSyntaxVerified:
      false,

    importResolutionVerified:
      false,

    moduleInitializationVerified:
      false,

    lawfulHandoffControlledExecutionVerified:
      false,

    publicProjectionControlledExecutionVerified:
      false,

    unresolvedVisibilityRoleRejectionVerified:
      false,

    emptyScenePolicyVerified:
      false,

    fullyInteriorLinePreservationVerified:
      false,

    nearCrossingLineVerified:
      false,

    farCrossingLineVerified:
      false,

    nearCrossingTriangleVerified:
      false,

    farCrossingTriangleVerified:
      false,

    fullyOutsideGeometryRejectionVerified:
      false,

    exactDuplicateNoOpVerified:
      false,

    repeatedConstructReplacementRejectionVerified:
      false,

    materializationExtentRevisionRollbackVerified:
      false,

    firstFrameMaterializationVerified:
      false,

    replacementFrameVerified:
      false,

    staleFrameRejectionVerified:
      false,

    revisionRegressionRejectionVerified:
      false,

    failedReplacementPreservationVerified:
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
 * 40 · COMPLETE CONTRACT
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

    publicProjectionLaw:
      deepFreeze({
        publicFunction:
          'projectHEarth3DAdmittedWorldPoint',

        publicInputs:
          Object.freeze([
            'point',
            'admittedGeometryFrame'
          ]),

        arbitraryProjectionContextAccepted:
          false,

        projectionContextDerivation:
          'INTERNAL_FROM_ADMITTED_FRAME'
      }),

    visibilityLaw:
      deepFreeze({
        source:
          'FRAME_VISIBILITY_SNAPSHOT',

        unresolvedRole:
          'REJECT_FRAME_PROJECTION_PLAN',

        unresolvedRoleDefaultsVisible:
          false,

        unresolvedRoleDefaultsHidden:
          false
      }),

    viewportLaw:
      deepFreeze({
        compositorViewport:
          'FRAME_VIEWPORT_SNAPSHOT',

        compositorViewportRevision:
          'FRAME_REVISIONS_VIEWPORT',

        rendererMaterializationExtent:
          'PHYSICAL_DOM_PROJECTION_DIMENSIONS',

        resizeEffect:
          'ADVANCE_RENDERER_MATERIALIZATION_EXTENT_REVISION_AFTER_SUCCESSFUL_COMMIT_ONLY',

        resizeMutatesCompositorViewport:
          false,

        failedMaterializationAdvancesRevision:
          false
      }),

    cameraBasisLaw:
      deepFreeze({
        publishedInput:
          Object.freeze([
            'position',
            'target',
            'up',
            'verticalFovDegrees',
            'nearPlane',
            'farPlane'
          ]),

        forward:
          'NORMALIZE_TARGET_MINUS_POSITION',

        right:
          'NORMALIZE_CROSS_PUBLISHED_UP_FORWARD',

        correctedUp:
          'NORMALIZE_CROSS_FORWARD_RIGHT'
      }),

    geometryConsumptionLaw:
      deepFreeze({
        topology:
          'geometry.topologyMode',

        vertices:
          'geometry.vertices_VECTOR3_RECORDS',

        indices:
          'geometry.indices_EXPLICIT',

        fallbackTopologyFields:
          false,

        flatNumericVertices:
          false,

        generatedIndices:
          false,

        sourcePrimitiveIdentityPreserved:
          true,

        geometryReconstruction:
          false
      }),

    clippingLaw:
      deepFreeze({
        tolerance:
          'SCALE_AWARE_DEPTH_TOLERANCE',

        fullyInteriorLine:
          'PRESERVE_EXACT_ENDPOINT_VALUES_AND_REPORT_UNCLIPPED',

        nearCrossingLine:
          'CLIP_TO_SCALE_AWARE_NEAR_INTERIOR_BOUNDARY',

        farCrossingLine:
          'CLIP_TO_SCALE_AWARE_FAR_INTERIOR_BOUNDARY',

        nearCrossingTriangle:
          'POLYGON_CLIP_TO_SCALE_AWARE_NEAR_INTERIOR_BOUNDARY',

        farCrossingTriangle:
          'POLYGON_CLIP_TO_SCALE_AWARE_FAR_INTERIOR_BOUNDARY',

        fullyOutsideGeometry:
          'REJECT',

        horizontalVerticalFrustumClipping:
          'CAMERA_SPACE_CLIP_TO_MATERIALIZATION_VIEWPORT_FRUSTUM'
      }),

    emptySceneLaw:
      deepFreeze({
        zeroProjectedDescriptors:
          'LAWFUL_NONVISIBLE_RENDERER_OCCURRENCE',

        nodeBudgetOverflowClaim:
          false,

        DOMContainersCreated:
          true,

        interactionBoundaryCreated:
          true,

        visibleOutputClaim:
          false
      }),

    nodeBudgetModel:
      deepFreeze({
        semanticLayerContainers:
          RENDERER_SEMANTIC_LAYER_CONTAINER_COUNT,

        environmentPrimitives:
          'ACTUAL_NONZERO_PROJECTED_DESCRIPTOR_COUNT',

        interactionNodes:
          RENDERER_INTERACTION_NODE_COUNT,

        diagnosticOwnedNodes:
          0,

        zeroProjectedDescriptorHandling:
          'NOT_SUBMITTED_AS_ENVIRONMENT_PRIMITIVE_BUDGET'
      }),

    frameApplicationLaw:
      deepFreeze({
        firstFrame:
          'ACCEPT_AND_CONSTRUCT',

        exactDuplicate:
          'IMMEDIATE_NO_OP',

        exactDuplicateRebuildsProjection:
          false,

        exactDuplicateEvaluatesBudget:
          false,

        exactDuplicateReplacesDOM:
          false,

        exactDuplicateAssignsFrameState:
          false,

        exactDuplicateAdvancesApplySequence:
          false,

        sameOccurrenceAndRevisionDifferentIdentity:
          'REJECT',

        lowerFrameRevision:
          'REJECT_AS_REVISION_REGRESSION',

        differentOccurrenceWithSameFrameRevision:
          'REJECT_AS_STALE_FRAME',

        higherFrameRevision:
          'ACCEPT_AS_REPLACEMENT_THROUGH_APPLY_ONLY',

        failedReplacement:
          'PRESERVE_CURRENT_FRAME_AND_CURRENT_DOM',

        applyBeforeConstruction:
          'REJECT',

        constructAfterInitialFrame:
          'ALLOW_EXACT_DUPLICATE_ONLY',

        constructReplacementFrame:
          'REJECT_AND_REQUIRE_applyHEarth3DRendererHandoff'
      }),

    materializationTransactionLaw:
      deepFreeze({
        prepare:
          'VALIDATE_PROJECTION_AND_BUDGET_WITH_PROPOSED_EXTENT_REVISION',

        commit:
          'REPLACE_DOM_AND_COMMIT_EXTENT_REVISION_ATOMICALLY',

        failedPreparation:
          'PRESERVE_CURRENT_EXTENT_REVISION',

        failedCommit:
          'DO_NOT_ADVANCE_EXTENT_REVISION'
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
 * 41 · PUBLIC GETTERS
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
 * 42 · COMPATIBILITY ALIASES
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
 * 43 · AGGREGATE EXPORT
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

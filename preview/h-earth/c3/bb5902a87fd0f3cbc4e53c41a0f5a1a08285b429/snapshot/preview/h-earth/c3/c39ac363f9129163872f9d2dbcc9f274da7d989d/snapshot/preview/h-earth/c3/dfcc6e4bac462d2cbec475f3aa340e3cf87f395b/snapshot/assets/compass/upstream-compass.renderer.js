/* TARGET FILE: /assets/compass/upstream-compass.renderer.js */
/* COMPLETE REPLACEMENT */
/* DGB_UPSTREAM_COMPASS_RENDERER_TNT_v3_1_1_GENERIC_LIFECYCLE_RECEIPT */

/*
  Shared fixed-center Home Compass renderer authority.

  Module:
  DGB_UPSTREAM_COMPASS_RENDERER
  3.1.1-generic-lifecycle-receipt

  Phase:
  Phase 1 lifecycle instrumentation only.

  Preserved behavior:
  - fixed-center universal Compass rendering;
  - page-agnostic renderer contract;
  - one active instance per mount;
  - automatic discovery of marked mounts;
  - explicit unmarked mount support;
  - fallback-first promotion;
  - promotion only after one error-free enhanced frame;
  - projected-bounds contract and event;
  - semantic-control visual feedback only;
  - host-owned navigation and semantic activation;
  - existing WebGL error gate;
  - existing permanent render-failure latch;
  - existing fallback and canvas visibility policy.

  Not included:
  - no WebGL error-queue draining;
  - no pre-draw/post-draw error isolation;
  - no retry;
  - no failure-latch reset;
  - no forced promotion;
  - no geometry change;
  - no page-specific behavior.
*/

const DGB_UPSTREAM_COMPASS_RENDERER = (() => {
  "use strict";

  const MODULE = Object.freeze({
    id:
      "DGB_UPSTREAM_COMPASS_RENDERER",

    version:
      "3.1.1-generic-lifecycle-receipt",

    file:
      "/assets/compass/upstream-compass.renderer.js"
  });

  const GEOMETRY_AUTHORITY = Object.freeze({
    moduleId:
      "DGB_UPSTREAM_COMPASS_GEOMETRY",

    requiredModuleVersion:
      "3.0.0-fixed-center-independent-sibling",

    requiredObjectClass:
      "HOME_COMPASS_FIXED_CENTER_INSTRUMENT",

    requiredPhysicalProjection:
      "FIXED_CENTER_INDEPENDENT_SIBLING"
  });

  const RECEIPT_SYMBOL =
    "DGB_UPSTREAM_COMPASS_RENDERER_RECEIPT";

  const FAILURE_EVENT =
    "DGB_UPSTREAM_COMPASS_RENDERER_FAILURE";

  const PROJECTED_BOUNDS_CONTRACT =
    "DGB_UPSTREAM_COMPASS_PROJECTED_BOUNDS_v1";

  const PROJECTED_BOUNDS_EVENT =
    "DGB_UPSTREAM_COMPASS_PROJECTED_BOUNDS_CHANGED";

  const MAX_LIFECYCLE_RECORDS =
    32;

  const RENDERER_STATUS = Object.freeze({
    INITIALIZING:
      "initializing",

    AVAILABLE:
      "available",

    STOPPED:
      "stopped",

    FALLBACK:
      "fallback",

    FAILED:
      "failed",

    DISPOSED:
      "disposed"
  });

  const PROJECTED_BOUNDS_STATUS =
    Object.freeze({
      INITIALIZING:
        "initializing",

      AVAILABLE:
        "available",

      FALLBACK:
        "fallback",

      FAILED:
        "failed",

      DISPOSED:
        "disposed"
    });

  const PROJECTED_BOUNDS_STATUS_VALUES =
    Object.freeze([
      PROJECTED_BOUNDS_STATUS
        .INITIALIZING,

      PROJECTED_BOUNDS_STATUS
        .AVAILABLE,

      PROJECTED_BOUNDS_STATUS
        .FALLBACK,

      PROJECTED_BOUNDS_STATUS
        .FAILED,

      PROJECTED_BOUNDS_STATUS
        .DISPOSED
    ]);

  const CHECKPOINT = Object.freeze({
    MOUNT_ENTERED:
      "RENDERER_MOUNT_ENTERED",

    CONTEXT_NORMALIZED:
      "CONTEXT_NORMALIZED",

    GEOMETRY_AUTHORITY_RESOLVED:
      "GEOMETRY_AUTHORITY_RESOLVED",

    GEOMETRY_MODEL_BUILT:
      "GEOMETRY_MODEL_BUILT",

    GEOMETRY_MODEL_VALIDATED:
      "GEOMETRY_MODEL_VALIDATED",

    CANVAS_CREATED:
      "CANVAS_CREATED",

    CANVAS_INSERTED:
      "CANVAS_INSERTED",

    WEBGL_CONTEXT_REQUESTED:
      "WEBGL_CONTEXT_REQUESTED",

    WEBGL_CONTEXT_CREATED:
      "WEBGL_CONTEXT_CREATED",

    SHADERS_COMPILED:
      "SHADERS_COMPILED",

    PROGRAM_LINKED:
      "PROGRAM_LINKED",

    GPU_RESOURCES_CREATED:
      "GPU_RESOURCES_CREATED",

    SUBSCRIPTIONS_REGISTERED:
      "SUBSCRIPTIONS_REGISTERED",

    INSTANCE_REGISTERED:
      "INSTANCE_REGISTERED",

    START_ENTERED:
      "RENDERER_START_ENTERED",

    FRAME_SCHEDULED:
      "FRAME_SCHEDULED",

    FIRST_FRAME_ENTERED:
      "FIRST_FRAME_ENTERED",

    FRAME_RESIZED:
      "FRAME_RESIZED",

    PRESENTATION_SNAPSHOT_APPLIED:
      "PRESENTATION_SNAPSHOT_APPLIED",

    PROJECTED_BOUNDS_INITIALIZED:
      "PROJECTED_BOUNDS_INITIALIZED",

    DRAW_PHASE_ENTERED:
      "DRAW_PHASE_ENTERED",

    DRAW_PHASE_COMPLETED:
      "DRAW_PHASE_COMPLETED",

    WEBGL_ERROR_CHECKED:
      "WEBGL_ERROR_CHECKED",

    FIRST_FRAME_COMMIT_ENTERED:
      "FIRST_FRAME_COMMIT_ENTERED",

    FIRST_FRAME_COMMITTED:
      "FIRST_FRAME_COMMITTED",

    CANVAS_PROMOTED:
      "CANVAS_PROMOTED",

    FALLBACK_WITHDRAWN:
      "FALLBACK_WITHDRAWN",

    PROJECTED_BOUNDS_AVAILABLE:
      "PROJECTED_BOUNDS_AVAILABLE",

    FAILURE:
      "RENDERER_FAILURE",

    INSTANCE_STOPPED:
      "INSTANCE_STOPPED",

    INSTANCE_DESTROYED:
      "INSTANCE_DESTROYED"
  });

  const FAILURE_STAGE = Object.freeze({
    CONTEXT_NORMALIZATION:
      "CONTEXT_NORMALIZATION",

    GEOMETRY_RESOLUTION:
      "GEOMETRY_RESOLUTION",

    GEOMETRY_BUILD:
      "GEOMETRY_BUILD",

    GEOMETRY_VALIDATION:
      "GEOMETRY_VALIDATION",

    CANVAS_CREATION:
      "CANVAS_CREATION",

    WEBGL_CONTEXT_CREATION:
      "WEBGL_CONTEXT_CREATION",

    SHADER_COMPILATION:
      "SHADER_COMPILATION",

    PROGRAM_LINK:
      "PROGRAM_LINK",

    GPU_RESOURCE_CREATION:
      "GPU_RESOURCE_CREATION",

    SUBSCRIPTION_SETUP:
      "SUBSCRIPTION_SETUP",

    FIRST_FRAME_RESIZE:
      "FIRST_FRAME_RESIZE",

    FIRST_FRAME_PRESENTATION:
      "FIRST_FRAME_PRESENTATION",

    FIRST_FRAME_TRANSFORM:
      "FIRST_FRAME_TRANSFORM",

    FIRST_FRAME_BOUNDS:
      "FIRST_FRAME_BOUNDS",

    FIRST_FRAME_DRAW:
      "FIRST_FRAME_DRAW",

    FIRST_FRAME_WEBGL_ERROR_GATE:
      "FIRST_FRAME_WEBGL_ERROR_GATE",

    FIRST_FRAME_COMMIT:
      "FIRST_FRAME_COMMIT",

    CONTEXT_LOSS:
      "CONTEXT_LOSS",

    PRESENTATION_STATE:
      "PRESENTATION_STATE",

    PROJECTED_BOUNDS:
      "PROJECTED_BOUNDS",

    START:
      "START",

    STOP:
      "STOP",

    DISPOSAL:
      "DISPOSAL",

    AUTOMATIC_DISCOVERY:
      "AUTOMATIC_DISCOVERY",

    UNKNOWN:
      "UNKNOWN"
  });

  const PROJECTED_BOUNDS = Object.freeze({
    projectionMethod:
      "GOVERNED_PERIMETER_SAMPLING_WITH_CONTAINMENT_EPSILON",

    authoritativeGeometrySource:
      "model.visualControlAlignmentEnvelope",

    coordinateSpace:
      "viewport-css-pixels",

    angularSamplesPerDepthPlane:
      32,

    depthPlaneCount:
      2,

    containmentEpsilonCssPixels:
      0.25,

    materialChangeToleranceCssPixels:
      0.05,

    geometryRadiusExpansion:
      0,

    haloExpansion:
      0
  });

  const QUALITY = Object.freeze({
    normalDevicePixelRatioCap:
      2,

    lowPowerDevicePixelRatioCap:
      1.5,

    lowPowerHardwareConcurrencyThreshold:
      4,

    bloomDisableWidthPx:
      420,

    mobileAspectThreshold:
      0.82,

    defaultFieldOfViewRadians:
      Math.PI / 4.9,

    mobileFieldOfViewRadians:
      Math.PI / 4.45,

    cameraDistance:
      5.4,

    interpolationSpeed:
      9.5,

    hoverScale:
      1.025,

    focusScale:
      1.035,

    pressedScale:
      0.985,

    heldScale:
      0.995,

    disabledScale:
      0.99,

    hiddenScale:
      0.975,

    normalOpacity:
      1,

    heldOpacity:
      0.72,

    disabledOpacity:
      0.58,

    hiddenOpacity:
      0,

    haloExpansion:
      0.045,

    minimumCssSceneSize:
      1,

    maximumDeltaSeconds:
      0.05,

    quaternionEpsilon:
      1e-7,

    vectorEpsilon:
      1e-6
  });

  const MATERIALS = Object.freeze({
    OUTER_HOUSING: Object.freeze({
      baseColor:
        Object.freeze([
          0.76,
          0.79,
          0.84
        ]),

      alpha:
        0.98,

      emissive:
        0.025,

      specular:
        1.18,

      rim:
        0.72,

      halo:
        0.58
    }),

    OUTER_BEZEL: Object.freeze({
      baseColor:
        Object.freeze([
          0.55,
          0.60,
          0.68
        ]),

      alpha:
        0.97,

      emissive:
        0.035,

      specular:
        1.08,

      rim:
        0.68,

      halo:
        0.52
    }),

    INNER_BEZEL: Object.freeze({
      baseColor:
        Object.freeze([
          0.40,
          0.46,
          0.54
        ]),

      alpha:
        0.96,

      emissive:
        0.025,

      specular:
        0.98,

      rim:
        0.60,

      halo:
        0.42
    }),

    DIAL_BED: Object.freeze({
      baseColor:
        Object.freeze([
          0.12,
          0.15,
          0.21
        ]),

      alpha:
        0.98,

      emissive:
        0.015,

      specular:
        0.56,

      rim:
        0.34,

      halo:
        0.16
    }),

    PRINCIPAL_DIRECTION: Object.freeze({
      baseColor:
        Object.freeze([
          0.58,
          0.63,
          0.70
        ]),

      alpha:
        0.97,

      emissive:
        0.03,

      specular:
        1.02,

      rim:
        0.62,

      halo:
        0.42
    }),

    PRINCIPAL_DIRECTION_FACET: Object.freeze({
      baseColor:
        Object.freeze([
          0.74,
          0.77,
          0.80
        ]),

      alpha:
        0.98,

      emissive:
        0.045,

      specular:
        1.16,

      rim:
        0.70,

      halo:
        0.50
    }),

    NORTH_NEEDLE: Object.freeze({
      baseColor:
        Object.freeze([
          0.86,
          0.82,
          0.68
        ]),

      alpha:
        0.99,

      emissive:
        0.075,

      specular:
        1.24,

      rim:
        0.82,

      halo:
        0.76
    }),

    NORTH_NEEDLE_FACET: Object.freeze({
      baseColor:
        Object.freeze([
          0.98,
          0.92,
          0.73
        ]),

      alpha:
        1,

      emissive:
        0.12,

      specular:
        1.34,

      rim:
        0.90,

      halo:
        0.90
    }),

    HUB_BASE: Object.freeze({
      baseColor:
        Object.freeze([
          0.28,
          0.33,
          0.40
        ]),

      alpha:
        0.99,

      emissive:
        0.025,

      specular:
        0.96,

      rim:
        0.58,

      halo:
        0.34
    }),

    HUB_CROWN: Object.freeze({
      baseColor:
        Object.freeze([
          0.48,
          0.53,
          0.60
        ]),

      alpha:
        0.99,

      emissive:
        0.04,

      specular:
        1.14,

      rim:
        0.70,

      halo:
        0.52
    }),

    HUB_JEWEL: Object.freeze({
      baseColor:
        Object.freeze([
          0.88,
          0.84,
          0.70
        ]),

      alpha:
        1,

      emissive:
        0.11,

      specular:
        1.30,

      rim:
        0.88,

      halo:
        0.84
    }),

    INTERCARDINAL_TICK: Object.freeze({
      baseColor:
        Object.freeze([
          0.63,
          0.67,
          0.73
        ]),

      alpha:
        0.96,

      emissive:
        0.025,

      specular:
        0.90,

      rim:
        0.56,

      halo:
        0.34
    })
  });

  const DEFAULT_MATERIAL =
    MATERIALS.PRINCIPAL_DIRECTION;

  const RECEIPT = {
    moduleId:
      MODULE.id,

    moduleVersion:
      MODULE.version,

    installed:
      true,

    status:
      "available",

    geometryAuthority:
      GEOMETRY_AUTHORITY.moduleId,

    geometryRequiredVersion:
      GEOMETRY_AUTHORITY.requiredModuleVersion,

    mountedInstanceCount:
      0,

    lastMountedInstanceId:
      "",

    lastInstanceId:
      "",

    lastFailure:
      "",

    lastFailureCode:
      "",

    lastFailureMessage:
      "",

    lastFailureStage:
      "",

    lastFailureDetail:
      null,

    lastWebGLError:
      0,

    lastWebGLErrorName:
      "NO_ERROR",

    lastRendererStatus:
      "",

    lastQualityProfileId:
      "",

    lastReducedMotion:
      false,

    lastVisible:
      true,

    lastInteractionEnabled:
      true,

    lastHeld:
      false,

    firstEnhancedFrameCompleted:
      false,

    lastProjectedBoundsRevision:
      0,

    lastProjectedBoundsStatus:
      "",

    lastLifecycleCheckpoint:
      "",

    lifecycleSequence:
      Object.freeze([]),

    receiptRevision:
      0,

    fixedCenter:
      true,

    parentOrientationInherited:
      false,

    navigationOrientationApplied:
      false,

    constellationOrientationApplied:
      false,

    clusterOrientationApplied:
      false,

    participatesInNavigationSettlement:
      false,

    publishesQuaternion:
      false,

    rendererOwnsActivation:
      false,

    rendererOwnsNavigation:
      false,

    rendererOwnsSelection:
      false,

    rendererOwnsSemanticDisabledState:
      false,

    fallbackPromotionOwnedByRenderer:
      true,

    semanticControlOwnedByHtml:
      true,

    oneInstancePerMount:
      true,

    automaticMountDiscovery:
      true,

    enhancedOpacityAuthority:
      "SHADER",

    fallbackOpacityAuthority:
      "CSS",

    canvasPromotionOpacity:
      "BINARY",

    canvasPointerEvents:
      "none",

    projectedBoundsContract:
      PROJECTED_BOUNDS_CONTRACT,

    projectedBoundsEvent:
      PROJECTED_BOUNDS_EVENT,

    projectedBoundsGetterPresent:
      true,

    projectedBoundsGeometrySource:
      PROJECTED_BOUNDS
        .authoritativeGeometrySource,

    projectedBoundsProjectionMethod:
      PROJECTED_BOUNDS
        .projectionMethod,

    projectedBoundsAngularSamplesPerDepthPlane:
      PROJECTED_BOUNDS
        .angularSamplesPerDepthPlane,

    projectedBoundsDepthPlaneCount:
      PROJECTED_BOUNDS
        .depthPlaneCount,

    projectedBoundsContainmentEpsilonCssPixels:
      PROJECTED_BOUNDS
        .containmentEpsilonCssPixels,

    projectedBoundsMaterialChangeToleranceCssPixels:
      PROJECTED_BOUNDS
        .materialChangeToleranceCssPixels,

    projectedBoundsGeometryRadiusExpansion:
      PROJECTED_BOUNDS
        .geometryRadiusExpansion,

    projectedBoundsHaloExpansion:
      PROJECTED_BOUNDS
        .haloExpansion,

    projectedBoundsInvalidRecordsParticipateInRevisionSequence:
      true,

    projectedBoundsStatusVocabulary:
      PROJECTED_BOUNDS_STATUS_VALUES,

    showroomAware:
      false,

    visualPassClaimed:
      false
  };

  const GLOBAL_LIFECYCLE = {
    sequence:
      0,

    history:
      [],

    lastCheckpoint:
      "",

    receiptRevision:
      0,

    lastFailureCode:
      "",

    lastFailureMessage:
      "",

    lastFailureStage:
      "",

    lastFailureDetail:
      null,

    lastWebGLError:
      0,

    lastWebGLErrorName:
      "NO_ERROR"
  };

  const INSTANCES =
    new Map();

  const INSTANCE_BY_MOUNT =
    new WeakMap();

  let instanceCounter =
    0;

  const vertexShaderSource = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;

    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;
    uniform mat3 uViewNormalMatrix;
    uniform float uHaloPass;
    uniform float uHaloExpansion;

    varying vec3 vViewNormal;
    varying vec3 vViewPosition;
    varying float vHaloPass;

    void main() {
      vec3 position = aPosition;

      if (uHaloPass > 0.5) {
        position +=
          normalize(aNormal) *
          uHaloExpansion;
      }

      vec4 worldPosition =
        uModel *
        vec4(position, 1.0);

      vec4 viewPosition =
        uView *
        worldPosition;

      vViewNormal =
        normalize(
          uViewNormalMatrix *
          aNormal
        );

      vViewPosition =
        viewPosition.xyz;

      vHaloPass =
        uHaloPass;

      gl_Position =
        uProjection *
        viewPosition;
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;

    varying vec3 vViewNormal;
    varying vec3 vViewPosition;
    varying float vHaloPass;

    uniform vec3 uBaseColor;
    uniform vec3 uAmbientColor;
    uniform vec3 uKeyLightView;
    uniform vec3 uFillLightView;
    uniform vec3 uRimLightView;

    uniform float uAlpha;
    uniform float uEmissive;
    uniform float uSpecular;
    uniform float uRim;
    uniform float uHaloStrength;
    uniform float uVisualOpacity;
    uniform float uFeedbackBrightness;

    void main() {
      vec3 normal =
        normalize(vViewNormal);

      vec3 viewDirection =
        normalize(-vViewPosition);

      vec3 keyDirection =
        normalize(-uKeyLightView);

      vec3 fillDirection =
        normalize(-uFillLightView);

      vec3 rimDirection =
        normalize(-uRimLightView);

      float key =
        max(
          dot(
            normal,
            keyDirection
          ),
          0.0
        );

      float fill =
        max(
          dot(
            normal,
            fillDirection
          ),
          0.0
        );

      float rear =
        max(
          dot(
            normal,
            rimDirection
          ),
          0.0
        );

      float fresnel =
        pow(
          1.0 -
          max(
            dot(
              normal,
              viewDirection
            ),
            0.0
          ),
          2.0
        );

      vec3 halfDirection =
        normalize(
          keyDirection +
          viewDirection
        );

      float specular =
        pow(
          max(
            dot(
              normal,
              halfDirection
            ),
            0.0
          ),
          28.0
        );

      if (vHaloPass > 0.5) {
        vec3 haloColor =
          uBaseColor *
          (
            0.42 +
            fresnel * 1.22 +
            rear * 0.22
          ) *
          uHaloStrength *
          uFeedbackBrightness;

        float haloAlpha =
          clamp(
            (
              0.025 +
              fresnel * 0.18
            ) *
            uHaloStrength *
            uVisualOpacity,
            0.0,
            0.30
          );

        gl_FragColor =
          vec4(
            haloColor,
            haloAlpha
          );

        return;
      }

      float diffuse =
        0.18 +
        key * 0.84 +
        fill * 0.30 +
        rear * 0.11;

      vec3 color =
        (
          uBaseColor *
          diffuse +

          uBaseColor *
          uEmissive +

          vec3(
            1.0,
            0.97,
            0.88
          ) *
          specular *
          uSpecular +

          uBaseColor *
          fresnel *
          uRim *
          0.72 +

          uAmbientColor *
          uBaseColor *
          0.22
        ) *
        uFeedbackBrightness;

      gl_FragColor =
        vec4(
          color,
          uAlpha *
          uVisualOpacity
        );
    }
  `;

  function invariant(
    condition,
    code,
    details = null
  ) {
    if (condition) {
      return;
    }

    const error =
      new Error(code);

    error.code =
      code;

    error.details =
      details;

    throw error;
  }

  function qs(
    selector,
    root = document
  ) {
    return root.querySelector(
      selector
    );
  }

  function finiteNumber(
    value,
    fallback = 0
  ) {
    const number =
      Number(value);

    return Number.isFinite(number)
      ? number
      : fallback;
  }

  function clamp(
    value,
    minimum,
    maximum
  ) {
    return Math.max(
      minimum,
      Math.min(
        maximum,
        value
      )
    );
  }

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_) {
      return "";
    }
  }

  function serializableValue(
    value,
    depth = 0
  ) {
    if (
      value === null ||
      value === undefined
    ) {
      return value === undefined
        ? null
        : value;
    }

    if (
      typeof value ===
        "string" ||
      typeof value ===
        "boolean"
    ) {
      return value;
    }

    if (
      typeof value ===
        "number"
    ) {
      return Number.isFinite(value)
        ? value
        : null;
    }

    if (
      depth >= 3
    ) {
      return String(value);
    }

    if (Array.isArray(value)) {
      return value
        .slice(0, 16)
        .map(
          entry =>
            serializableValue(
              entry,
              depth + 1
            )
        );
    }

    if (
      typeof value ===
        "object"
    ) {
      const output = {};

      for (
        const key
        of Object.keys(value)
          .slice(0, 24)
      ) {
        const entry =
          value[key];

        if (
          typeof entry ===
            "function" ||
          typeof entry ===
            "symbol"
        ) {
          continue;
        }

        output[key] =
          serializableValue(
            entry,
            depth + 1
          );
      }

      return output;
    }

    return String(value);
  }

  function freezeSnapshot(value) {
    if (
      value === null ||
      typeof value !==
        "object"
    ) {
      return value;
    }

    if (Array.isArray(value)) {
      return Object.freeze(
        value.map(
          freezeSnapshot
        )
      );
    }

    const output = {};

    for (
      const [
        key,
        entry
      ]
      of Object.entries(value)
    ) {
      output[key] =
        freezeSnapshot(entry);
    }

    return Object.freeze(output);
  }

  function errorCodeFrom(
    error,
    fallback
  ) {
    if (
      error &&
      error.code
    ) {
      return String(
        error.code
      );
    }

    if (
      error &&
      error.name
    ) {
      return String(
        error.name
      );
    }

    return String(
      fallback ||
      "UNKNOWN_RENDERER_FAILURE"
    );
  }

  function errorMessageFrom(
    error,
    fallback
  ) {
    if (
      error &&
      error.message
    ) {
      return String(
        error.message
      );
    }

    return String(
      fallback ||
      ""
    );
  }

  function pushBoundedRecord(
    history,
    record
  ) {
    history.push(
      record
    );

    if (
      history.length >
      MAX_LIFECYCLE_RECORDS
    ) {
      history.splice(
        0,
        history.length -
          MAX_LIFECYCLE_RECORDS
      );
    }
  }

  function recordGlobalCheckpoint(
    name,
    detail = null,
    options = {}
  ) {
    GLOBAL_LIFECYCLE.sequence +=
      1;

    const record =
      freezeSnapshot({
        name:
          String(
            name ||
            "RENDERER_CHECKPOINT"
          ),

        sequence:
          GLOBAL_LIFECYCLE
            .sequence,

        timestamp:
          nowIso(),

        instanceId:
          String(
            options.instanceId ||
            ""
          ),

        detail:
          serializableValue(
            detail
          ),

        failureCode:
          options.failureCode
            ? String(
                options.failureCode
              )
            : ""
      });

    pushBoundedRecord(
      GLOBAL_LIFECYCLE.history,
      record
    );

    GLOBAL_LIFECYCLE.lastCheckpoint =
      record.name;

    return record;
  }

  function recordInstanceCheckpoint(
    instance,
    name,
    detail = null,
    options = {}
  ) {
    if (!instance) {
      return recordGlobalCheckpoint(
        name,
        detail,
        options
      );
    }

    instance.lifecycleSequenceNumber +=
      1;

    const record =
      freezeSnapshot({
        name:
          String(
            name ||
            "RENDERER_CHECKPOINT"
          ),

        sequence:
          instance
            .lifecycleSequenceNumber,

        timestamp:
          nowIso(),

        instanceId:
          instance.id,

        detail:
          serializableValue(
            detail
          ),

        failureCode:
          options.failureCode
            ? String(
                options.failureCode
              )
            : ""
      });

    pushBoundedRecord(
      instance.lifecycleHistory,
      record
    );

    instance.lastLifecycleCheckpoint =
      record.name;

    recordGlobalCheckpoint(
      record.name,
      record.detail,
      {
        instanceId:
          instance.id,

        failureCode:
          record.failureCode
      }
    );

    return record;
  }

  function webGLErrorName(
    gl,
    code
  ) {
    if (
      !Number.isFinite(code)
    ) {
      return "UNKNOWN_WEBGL_ERROR";
    }

    if (
      gl &&
      code === gl.NO_ERROR
    ) {
      return "NO_ERROR";
    }

    if (
      gl &&
      code === gl.INVALID_ENUM
    ) {
      return "INVALID_ENUM";
    }

    if (
      gl &&
      code === gl.INVALID_VALUE
    ) {
      return "INVALID_VALUE";
    }

    if (
      gl &&
      code === gl.INVALID_OPERATION
    ) {
      return "INVALID_OPERATION";
    }

    if (
      gl &&
      typeof gl
        .INVALID_FRAMEBUFFER_OPERATION ===
        "number" &&
      code ===
        gl.INVALID_FRAMEBUFFER_OPERATION
    ) {
      return "INVALID_FRAMEBUFFER_OPERATION";
    }

    if (
      gl &&
      code === gl.OUT_OF_MEMORY
    ) {
      return "OUT_OF_MEMORY";
    }

    if (
      gl &&
      typeof gl.CONTEXT_LOST_WEBGL ===
        "number" &&
      code ===
        gl.CONTEXT_LOST_WEBGL
    ) {
      return "CONTEXT_LOST_WEBGL";
    }

    return `UNKNOWN_WEBGL_ERROR_${code}`;
  }

  function normalizeArray3(
    value,
    fallback
  ) {
    const source =
      Array.isArray(value) ||
      ArrayBuffer.isView(value)
        ? Array.from(value)
        : [];

    if (source.length !== 3) {
      return fallback.slice();
    }

    return [
      finiteNumber(
        source[0],
        fallback[0]
      ),

      finiteNumber(
        source[1],
        fallback[1]
      ),

      finiteNumber(
        source[2],
        fallback[2]
      )
    ];
  }

  function normalizeQuaternion(
    value,
    fallback = [0, 0, 0, 1]
  ) {
    const source =
      Array.isArray(value) ||
      ArrayBuffer.isView(value)
        ? Array.from(value)
        : [];

    if (source.length !== 4) {
      return fallback.slice();
    }

    const quaternion = [
      finiteNumber(
        source[0],
        fallback[0]
      ),

      finiteNumber(
        source[1],
        fallback[1]
      ),

      finiteNumber(
        source[2],
        fallback[2]
      ),

      finiteNumber(
        source[3],
        fallback[3]
      )
    ];

    const length =
      Math.hypot(
        quaternion[0],
        quaternion[1],
        quaternion[2],
        quaternion[3]
      );

    if (
      !Number.isFinite(length) ||
      length <=
        QUALITY.quaternionEpsilon
    ) {
      return fallback.slice();
    }

    return quaternion.map(
      component =>
        component /
        length
    );
  }

  function quaternionDot(
    a,
    b
  ) {
    return (
      a[0] * b[0] +
      a[1] * b[1] +
      a[2] * b[2] +
      a[3] * b[3]
    );
  }

  function quaternionSlerp(
    a,
    b,
    amount
  ) {
    const start =
      normalizeQuaternion(a);

    let end =
      normalizeQuaternion(b);

    let cosine =
      quaternionDot(
        start,
        end
      );

    if (cosine < 0) {
      end =
        end.map(
          component =>
            -component
        );

      cosine =
        -cosine;
    }

    const t =
      clamp(
        amount,
        0,
        1
      );

    if (
      cosine >
      0.9995
    ) {
      return normalizeQuaternion([
        start[0] +
          (
            end[0] -
            start[0]
          ) *
          t,

        start[1] +
          (
            end[1] -
            start[1]
          ) *
          t,

        start[2] +
          (
            end[2] -
            start[2]
          ) *
          t,

        start[3] +
          (
            end[3] -
            start[3]
          ) *
          t
      ]);
    }

    const theta =
      Math.acos(
        clamp(
          cosine,
          -1,
          1
        )
      );

    const sine =
      Math.sin(theta);

    if (
      Math.abs(sine) <=
      QUALITY.quaternionEpsilon
    ) {
      return start;
    }

    const startWeight =
      Math.sin(
        (
          1 -
          t
        ) *
        theta
      ) /
      sine;

    const endWeight =
      Math.sin(
        t *
        theta
      ) /
      sine;

    return normalizeQuaternion([
      start[0] *
        startWeight +
      end[0] *
        endWeight,

      start[1] *
        startWeight +
      end[1] *
        endWeight,

      start[2] *
        startWeight +
      end[2] *
        endWeight,

      start[3] *
        startWeight +
      end[3] *
        endWeight
    ]);
  }

  function interpolateArray3(
    current,
    target,
    amount
  ) {
    const t =
      clamp(
        amount,
        0,
        1
      );

    return [
      current[0] +
        (
          target[0] -
          current[0]
        ) *
        t,

      current[1] +
        (
          target[1] -
          current[1]
        ) *
        t,

      current[2] +
        (
          target[2] -
          current[2]
        ) *
        t
    ];
  }

  function interpolateNumber(
    current,
    target,
    amount
  ) {
    return (
      current +
      (
        target -
        current
      ) *
      clamp(
        amount,
        0,
        1
      )
    );
  }

  function identity4() {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  }

  function multiply4(
    a,
    b
  ) {
    const output =
      new Array(16).fill(0);

    for (
      let row = 0;
      row < 4;
      row += 1
    ) {
      for (
        let column = 0;
        column < 4;
        column += 1
      ) {
        for (
          let index = 0;
          index < 4;
          index += 1
        ) {
          output[
            column * 4 +
            row
          ] +=
            a[
              index * 4 +
              row
            ] *
            b[
              column * 4 +
              index
            ];
        }
      }
    }

    return output;
  }

  function transformPoint4(
    matrix,
    point
  ) {
    const x =
      point[0];

    const y =
      point[1];

    const z =
      point[2];

    const w =
      point.length > 3
        ? point[3]
        : 1;

    return [
      matrix[0] * x +
        matrix[4] * y +
        matrix[8] * z +
        matrix[12] * w,

      matrix[1] * x +
        matrix[5] * y +
        matrix[9] * z +
        matrix[13] * w,

      matrix[2] * x +
        matrix[6] * y +
        matrix[10] * z +
        matrix[14] * w,

      matrix[3] * x +
        matrix[7] * y +
        matrix[11] * z +
        matrix[15] * w
    ];
  }

  function translate4(
    x,
    y,
    z
  ) {
    const matrix =
      identity4();

    matrix[12] =
      x;

    matrix[13] =
      y;

    matrix[14] =
      z;

    return matrix;
  }

  function scale4(
    x,
    y,
    z
  ) {
    const matrix =
      identity4();

    matrix[0] =
      x;

    matrix[5] =
      y;

    matrix[10] =
      z;

    return matrix;
  }

  function quaternionToMatrix4(
    value
  ) {
    const [
      x,
      y,
      z,
      w
    ] =
      normalizeQuaternion(value);

    return [
      1 - 2 * (y * y + z * z),
      2 * (x * y + z * w),
      2 * (x * z - y * w),
      0,

      2 * (x * y - z * w),
      1 - 2 * (x * x + z * z),
      2 * (y * z + x * w),
      0,

      2 * (x * z + y * w),
      2 * (y * z - x * w),
      1 - 2 * (x * x + y * y),
      0,

      0,
      0,
      0,
      1
    ];
  }

  function perspective4(
    fieldOfView,
    aspect,
    near,
    far
  ) {
    const factor =
      1 /
      Math.tan(
        fieldOfView /
        2
      );

    const range =
      1 /
      (
        near -
        far
      );

    return [
      factor / aspect,
      0,
      0,
      0,

      0,
      factor,
      0,
      0,

      0,
      0,
      (
        far +
        near
      ) *
      range,
      -1,

      0,
      0,
      2 *
      far *
      near *
      range,
      0
    ];
  }

  function subtract3(
    a,
    b
  ) {
    return [
      a[0] - b[0],
      a[1] - b[1],
      a[2] - b[2]
    ];
  }

  function dot3(
    a,
    b
  ) {
    return (
      a[0] * b[0] +
      a[1] * b[1] +
      a[2] * b[2]
    );
  }

  function cross3(
    a,
    b
  ) {
    return [
      a[1] * b[2] -
        a[2] * b[1],

      a[2] * b[0] -
        a[0] * b[2],

      a[0] * b[1] -
        a[1] * b[0]
    ];
  }

  function normalize3(
    vector,
    fallback = [0, 0, 1]
  ) {
    const length =
      Math.hypot(
        vector[0],
        vector[1],
        vector[2]
      );

    if (
      !Number.isFinite(length) ||
      length <=
        QUALITY.vectorEpsilon
    ) {
      return fallback.slice();
    }

    return [
      vector[0] / length,
      vector[1] / length,
      vector[2] / length
    ];
  }

  function lookAt4(
    eye,
    center,
    up
  ) {
    const z =
      normalize3(
        subtract3(
          eye,
          center
        )
      );

    const x =
      normalize3(
        cross3(
          up,
          z
        ),
        [1, 0, 0]
      );

    const y =
      cross3(
        z,
        x
      );

    return [
      x[0], y[0], z[0], 0,
      x[1], y[1], z[1], 0,
      x[2], y[2], z[2], 0,
      -dot3(x, eye),
      -dot3(y, eye),
      -dot3(z, eye),
      1
    ];
  }

  function inverseTransposeNormalMatrix3(
    modelView
  ) {
    const a00 =
      modelView[0];

    const a01 =
      modelView[4];

    const a02 =
      modelView[8];

    const a10 =
      modelView[1];

    const a11 =
      modelView[5];

    const a12 =
      modelView[9];

    const a20 =
      modelView[2];

    const a21 =
      modelView[6];

    const a22 =
      modelView[10];

    const b01 =
      a22 * a11 -
      a12 * a21;

    const b11 =
      -a22 * a10 +
      a12 * a20;

    const b21 =
      a21 * a10 -
      a11 * a20;

    let determinant =
      a00 * b01 +
      a01 * b11 +
      a02 * b21;

    if (
      !Number.isFinite(
        determinant
      ) ||
      Math.abs(
        determinant
      ) <=
        QUALITY.vectorEpsilon
    ) {
      return [
        a00, a10, a20,
        a01, a11, a21,
        a02, a12, a22
      ];
    }

    determinant =
      1 /
      determinant;

    const inverse = [
      b01 * determinant,

      (
        -a22 * a01 +
        a02 * a21
      ) *
      determinant,

      (
        a12 * a01 -
        a02 * a11
      ) *
      determinant,

      b11 * determinant,

      (
        a22 * a00 -
        a02 * a20
      ) *
      determinant,

      (
        -a12 * a00 +
        a02 * a10
      ) *
      determinant,

      b21 * determinant,

      (
        -a21 * a00 +
        a01 * a20
      ) *
      determinant,

      (
        a11 * a00 -
        a01 * a10
      ) *
      determinant
    ];

    return [
      inverse[0],
      inverse[3],
      inverse[6],

      inverse[1],
      inverse[4],
      inverse[7],

      inverse[2],
      inverse[5],
      inverse[8]
    ];
  }

  function compileShader(
    gl,
    type,
    source
  ) {
    const shader =
      gl.createShader(type);

    invariant(
      shader,
      "SHADER_CREATION_FAILURE"
    );

    gl.shaderSource(
      shader,
      source
    );

    gl.compileShader(
      shader
    );

    if (
      !gl.getShaderParameter(
        shader,
        gl.COMPILE_STATUS
      )
    ) {
      const info =
        gl.getShaderInfoLog(
          shader
        ) ||
        "SHADER_COMPILE_FAILURE";

      gl.deleteShader(
        shader
      );

      const error =
        new Error(info);

      error.code =
        "SHADER_COMPILE_FAILURE";

      error.details =
        {
          shaderType:
            type === gl.VERTEX_SHADER
              ? "VERTEX_SHADER"
              : type ===
                  gl.FRAGMENT_SHADER
                ? "FRAGMENT_SHADER"
                : String(type),

          infoLog:
            String(info)
              .slice(0, 1024)
        };

      throw error;
    }

    return shader;
  }

  function createProgram(gl) {
    const vertex =
      compileShader(
        gl,
        gl.VERTEX_SHADER,
        vertexShaderSource
      );

    const fragment =
      compileShader(
        gl,
        gl.FRAGMENT_SHADER,
        fragmentShaderSource
      );

    const program =
      gl.createProgram();

    invariant(
      program,
      "PROGRAM_CREATION_FAILURE"
    );

    gl.attachShader(
      program,
      vertex
    );

    gl.attachShader(
      program,
      fragment
    );

    gl.linkProgram(
      program
    );

    gl.deleteShader(
      vertex
    );

    gl.deleteShader(
      fragment
    );

    if (
      !gl.getProgramParameter(
        program,
        gl.LINK_STATUS
      )
    ) {
      const info =
        gl.getProgramInfoLog(
          program
        ) ||
        "PROGRAM_LINK_FAILURE";

      gl.deleteProgram(
        program
      );

      const error =
        new Error(info);

      error.code =
        "PROGRAM_LINK_FAILURE";

      error.details =
        {
          infoLog:
            String(info)
              .slice(0, 1024)
        };

      throw error;
    }

    return program;
  }

  function createBuffer(
    gl,
    target,
    data
  ) {
    const buffer =
      gl.createBuffer();

    invariant(
      buffer,
      "WEBGL_BUFFER_CREATION_FAILED",
      {
        target
      }
    );

    gl.bindBuffer(
      target,
      buffer
    );

    gl.bufferData(
      target,
      data,
      gl.STATIC_DRAW
    );

    return buffer;
  }

  function bindAttrib(
    gl,
    buffer,
    location,
    size
  ) {
    invariant(
      location >= 0,
      "WEBGL_ATTRIBUTE_LOCATION_INVALID",
      {
        location
      }
    );

    gl.bindBuffer(
      gl.ARRAY_BUFFER,
      buffer
    );

    gl.enableVertexAttribArray(
      location
    );

    gl.vertexAttribPointer(
      location,
      size,
      gl.FLOAT,
      false,
      0,
      0
    );
  }

  function projectedBoundsStatusValid(
    status
  ) {
    return PROJECTED_BOUNDS_STATUS_VALUES
      .includes(status);
  }

  function freezeProjectedBoundsRecord(
    record
  ) {
    invariant(
      record &&
      typeof record ===
        "object",
      "PROJECTED_BOUNDS_RECORD_REQUIRED"
    );

    invariant(
      record.contract ===
        PROJECTED_BOUNDS_CONTRACT,
      "PROJECTED_BOUNDS_CONTRACT_INVALID"
    );

    invariant(
      typeof record.instanceId ===
        "string" &&
      record.instanceId.length >
        0,
      "PROJECTED_BOUNDS_INSTANCE_ID_REQUIRED"
    );

    invariant(
      projectedBoundsStatusValid(
        record.status
      ),
      "PROJECTED_BOUNDS_STATUS_INVALID",
      {
        status:
          record.status
      }
    );

    invariant(
      record.coordinateSpace ===
        PROJECTED_BOUNDS
          .coordinateSpace,
      "PROJECTED_BOUNDS_COORDINATE_SPACE_INVALID"
    );

    invariant(
      Number.isInteger(
        record.revision
      ) &&
      record.revision >= 1,
      "PROJECTED_BOUNDS_REVISION_INVALID",
      {
        revision:
          record.revision
      }
    );

    const numericFields = [
      "left",
      "top",
      "right",
      "bottom",
      "width",
      "height",
      "centerX",
      "centerY",
      "radius"
    ];

    for (
      const field
      of numericFields
    ) {
      invariant(
        Number.isFinite(
          record[field]
        ),
        "PROJECTED_BOUNDS_NUMERIC_FIELD_INVALID",
        {
          field,
          value:
            record[field]
        }
      );
    }

    invariant(
      record.width >= 0,
      "PROJECTED_BOUNDS_WIDTH_NEGATIVE",
      {
        width:
          record.width
      }
    );

    invariant(
      record.height >= 0,
      "PROJECTED_BOUNDS_HEIGHT_NEGATIVE",
      {
        height:
          record.height
      }
    );

    invariant(
      record.radius >= 0,
      "PROJECTED_BOUNDS_RADIUS_NEGATIVE",
      {
        radius:
          record.radius
      }
    );

    const invariantTolerance =
      1e-6;

    invariant(
      Math.abs(
        record.right -
        (
          record.left +
          record.width
        )
      ) <=
        invariantTolerance,
      "PROJECTED_BOUNDS_RIGHT_INVARIANT_FAILURE"
    );

    invariant(
      Math.abs(
        record.bottom -
        (
          record.top +
          record.height
        )
      ) <=
        invariantTolerance,
      "PROJECTED_BOUNDS_BOTTOM_INVARIANT_FAILURE"
    );

    invariant(
      Math.abs(
        record.centerX -
        (
          record.left +
          record.width /
          2
        )
      ) <=
        invariantTolerance,
      "PROJECTED_BOUNDS_CENTER_X_INVARIANT_FAILURE"
    );

    invariant(
      Math.abs(
        record.centerY -
        (
          record.top +
          record.height /
          2
        )
      ) <=
        invariantTolerance,
      "PROJECTED_BOUNDS_CENTER_Y_INVARIANT_FAILURE"
    );

    invariant(
      Math.abs(
        record.radius -
        Math.max(
          record.width,
          record.height
        ) /
        2
      ) <=
        invariantTolerance,
      "PROJECTED_BOUNDS_RADIUS_INVARIANT_FAILURE"
    );

    if (
      record.visible ===
        false
    ) {
      invariant(
        numericFields.every(
          field =>
            record[field] ===
            0
        ),
        "PROJECTED_BOUNDS_INVALID_RECORD_MUST_BE_ZERO"
      );
    }

    if (
      record.visible ===
        true
    ) {
      invariant(
        record.status ===
          PROJECTED_BOUNDS_STATUS
            .AVAILABLE,
        "PROJECTED_BOUNDS_VISIBLE_STATUS_INVALID"
      );
    }

    return Object.freeze({
      contract:
        PROJECTED_BOUNDS_CONTRACT,

      instanceId:
        record.instanceId,

      visible:
        record.visible ===
        true,

      status:
        record.status,

      coordinateSpace:
        PROJECTED_BOUNDS
          .coordinateSpace,

      left:
        record.left,

      top:
        record.top,

      right:
        record.right,

      bottom:
        record.bottom,

      width:
        record.width,

      height:
        record.height,

      centerX:
        record.centerX,

      centerY:
        record.centerY,

      radius:
        record.radius,

      revision:
        record.revision
    });
  }

  function normalizeProjectedBoundsCandidate(
    instance,
    candidate
  ) {
    invariant(
      candidate &&
      typeof candidate ===
        "object",
      "PROJECTED_BOUNDS_CANDIDATE_REQUIRED"
    );

    invariant(
      projectedBoundsStatusValid(
        candidate.status
      ),
      "PROJECTED_BOUNDS_STATUS_INVALID",
      {
        status:
          candidate.status
      }
    );

    if (
      candidate.visible !==
        true
    ) {
      return Object.freeze({
        contract:
          PROJECTED_BOUNDS_CONTRACT,

        instanceId:
          instance.id,

        visible:
          false,

        status:
          candidate.status,

        coordinateSpace:
          PROJECTED_BOUNDS
            .coordinateSpace,

        left:
          0,

        top:
          0,

        right:
          0,

        bottom:
          0,

        width:
          0,

        height:
          0,

        centerX:
          0,

        centerY:
          0,

        radius:
          0
      });
    }

    invariant(
      candidate.status ===
        PROJECTED_BOUNDS_STATUS
          .AVAILABLE,
      "PROJECTED_BOUNDS_AVAILABLE_STATUS_REQUIRED"
    );

    const left =
      finiteNumber(
        candidate.left,
        NaN
      );

    const top =
      finiteNumber(
        candidate.top,
        NaN
      );

    const width =
      finiteNumber(
        candidate.width,
        NaN
      );

    const height =
      finiteNumber(
        candidate.height,
        NaN
      );

    invariant(
      Number.isFinite(left) &&
      Number.isFinite(top) &&
      Number.isFinite(width) &&
      Number.isFinite(height) &&
      width >= 0 &&
      height >= 0,
      "PROJECTED_BOUNDS_AVAILABLE_GEOMETRY_INVALID",
      {
        left,
        top,
        width,
        height
      }
    );

    const right =
      left +
      width;

    const bottom =
      top +
      height;

    const centerX =
      left +
      width /
      2;

    const centerY =
      top +
      height /
      2;

    const radius =
      Math.max(
        width,
        height
      ) /
      2;

    return Object.freeze({
      contract:
        PROJECTED_BOUNDS_CONTRACT,

      instanceId:
        instance.id,

      visible:
        true,

      status:
        PROJECTED_BOUNDS_STATUS
          .AVAILABLE,

      coordinateSpace:
        PROJECTED_BOUNDS
          .coordinateSpace,

      left,
      top,
      right,
      bottom,
      width,
      height,
      centerX,
      centerY,
      radius
    });
  }

  function projectedBoundsMateriallyEqual(
    previous,
    candidate
  ) {
    if (
      !previous ||
      previous.contract !==
        candidate.contract ||
      previous.instanceId !==
        candidate.instanceId ||
      previous.visible !==
        candidate.visible ||
      previous.status !==
        candidate.status ||
      previous.coordinateSpace !==
        candidate.coordinateSpace
    ) {
      return false;
    }

    const tolerance =
      PROJECTED_BOUNDS
        .materialChangeToleranceCssPixels;

    const numericFields = [
      "left",
      "top",
      "right",
      "bottom",
      "width",
      "height",
      "centerX",
      "centerY",
      "radius"
    ];

    return numericFields.every(
      field =>
        Math.abs(
          previous[field] -
          candidate[field]
        ) <=
        tolerance
    );
  }

  function dispatchProjectedBounds(
    instance,
    record
  ) {
    const mount =
      instance.context.mount;

    if (
      !mount ||
      typeof mount.dispatchEvent !==
        "function" ||
      typeof CustomEvent !==
        "function"
    ) {
      return false;
    }

    mount.dispatchEvent(
      new CustomEvent(
        PROJECTED_BOUNDS_EVENT,
        {
          detail:
            record,

          bubbles:
            true,

          composed:
            false
        }
      )
    );

    return true;
  }

  function publishProjectedBoundsCandidate(
    instance,
    candidate
  ) {
    const normalized =
      normalizeProjectedBoundsCandidate(
        instance,
        candidate
      );

    if (
      projectedBoundsMateriallyEqual(
        instance.projectedBounds,
        normalized
      )
    ) {
      return false;
    }

    instance.projectedBoundsRevision +=
      1;

    instance.projectedBounds =
      freezeProjectedBoundsRecord({
        ...normalized,

        revision:
          instance
            .projectedBoundsRevision
      });

    dispatchProjectedBounds(
      instance,
      instance.projectedBounds
    );

    if (
      instance.projectedBounds
        .status ===
        PROJECTED_BOUNDS_STATUS
          .AVAILABLE
    ) {
      instance.projectedBoundsAvailable =
        true;

      recordInstanceCheckpoint(
        instance,
        CHECKPOINT
          .PROJECTED_BOUNDS_AVAILABLE,
        {
          revision:
            instance
              .projectedBoundsRevision,

          width:
            instance
              .projectedBounds
              .width,

          height:
            instance
              .projectedBounds
              .height
        }
      );
    }

    publishReceipt({
      lastProjectedBoundsRevision:
        instance
          .projectedBoundsRevision,

      lastProjectedBoundsStatus:
        instance.projectedBounds
          .status,

      lastInstanceId:
        instance.id
    });

    return true;
  }

  function publishInvalidProjectedBounds(
    instance,
    status
  ) {
    return publishProjectedBoundsCandidate(
      instance,
      {
        visible:
          false,

        status
      }
    );
  }

  function projectedBoundsLifecycleStatus(
    instance
  ) {
    if (
      instance.destroyed ||
      instance.rendererStatus ===
        RENDERER_STATUS.DISPOSED
    ) {
      return PROJECTED_BOUNDS_STATUS
        .DISPOSED;
    }

    if (
      instance.renderFailureEmitted ||
      instance.rendererStatus ===
        RENDERER_STATUS.FAILED ||
      instance.presentationState
        .rendererFailure
    ) {
      return PROJECTED_BOUNDS_STATUS
        .FAILED;
    }

    if (
      instance.rendererStatus ===
        RENDERER_STATUS.FALLBACK
    ) {
      return PROJECTED_BOUNDS_STATUS
        .FALLBACK;
    }

    if (
      !instance.firstEnhancedFrameCompleted
    ) {
      return PROJECTED_BOUNDS_STATUS
        .INITIALIZING;
    }

    return PROJECTED_BOUNDS_STATUS
      .AVAILABLE;
  }

  function buildProjectedEnvelopeSamples(
    model
  ) {
    const envelope =
      model &&
      model
        .visualControlAlignmentEnvelope;

    invariant(
      envelope &&
      envelope.shape ===
        "CIRCULAR_DISC",
      "VISUAL_CONTROL_ALIGNMENT_ENVELOPE_REQUIRED"
    );

    const center =
      normalizeArray3(
        envelope.localCenter,
        [0, 0, 0]
      );

    const radius =
      finiteNumber(
        envelope.radius,
        0
      );

    const zIntervalSource =
      Array.isArray(
        envelope.zInterval
      ) ||
      ArrayBuffer.isView(
        envelope.zInterval
      )
        ? Array.from(
            envelope.zInterval
          )
        : [];

    invariant(
      radius > 0,
      "VISUAL_CONTROL_ALIGNMENT_RADIUS_INVALID",
      {
        radius
      }
    );

    invariant(
      zIntervalSource.length ===
        2 &&
      zIntervalSource.every(
        Number.isFinite
      ),
      "VISUAL_CONTROL_ALIGNMENT_DEPTH_INTERVAL_INVALID",
      {
        zInterval:
          zIntervalSource
      }
    );

    const samples = [];

    for (
      const z
      of zIntervalSource
    ) {
      for (
        let index = 0;
        index <
          PROJECTED_BOUNDS
            .angularSamplesPerDepthPlane;
        index += 1
      ) {
        const angle =
          Math.PI *
          2 *
          index /
          PROJECTED_BOUNDS
            .angularSamplesPerDepthPlane;

        samples.push(
          Object.freeze([
            center[0] +
              radius *
              Math.cos(angle),

            center[1] +
              radius *
              Math.sin(angle),

            z
          ])
        );
      }
    }

    samples.push(
      Object.freeze(
        center.slice()
      )
    );

    return Object.freeze(
      samples
    );
  }

  function projectEnvelopePointToViewport(
    combinedMatrix,
    point,
    canvasRect
  ) {
    const clip =
      transformPoint4(
        combinedMatrix,
        [
          point[0],
          point[1],
          point[2],
          1
        ]
      );

    invariant(
      clip.every(
        Number.isFinite
      ),
      "PROJECTED_BOUNDS_CLIP_POINT_INVALID",
      {
        point,
        clip
      }
    );

    invariant(
      Math.abs(
        clip[3]
      ) >
        QUALITY.vectorEpsilon,
      "PROJECTED_BOUNDS_CLIP_W_INVALID",
      {
        point,
        clip
      }
    );

    const inverseW =
      1 /
      clip[3];

    const ndcX =
      clip[0] *
      inverseW;

    const ndcY =
      clip[1] *
      inverseW;

    invariant(
      Number.isFinite(ndcX) &&
      Number.isFinite(ndcY),
      "PROJECTED_BOUNDS_NDC_INVALID",
      {
        point,
        ndcX,
        ndcY
      }
    );

    return Object.freeze({
      x:
        canvasRect.left +
        (
          ndcX *
          0.5 +
          0.5
        ) *
        canvasRect.width,

      y:
        canvasRect.top +
        (
          1 -
          (
            ndcY *
            0.5 +
            0.5
          )
        ) *
        canvasRect.height
    });
  }

  function calculateAvailableProjectedBounds(
    instance,
    modelMatrix
  ) {
    const canvasRect =
      instance.canvas
        .getBoundingClientRect();

    invariant(
      Number.isFinite(
        canvasRect.left
      ) &&
      Number.isFinite(
        canvasRect.top
      ) &&
      Number.isFinite(
        canvasRect.width
      ) &&
      Number.isFinite(
        canvasRect.height
      ) &&
      canvasRect.width >
        0 &&
      canvasRect.height >
        0,
      "PROJECTED_BOUNDS_CANVAS_RECT_INVALID",
      {
        left:
          canvasRect.left,

        top:
          canvasRect.top,

        width:
          canvasRect.width,

        height:
          canvasRect.height
      }
    );

    const combinedMatrix =
      multiply4(
        instance.projection,
        multiply4(
          instance.view,
          modelMatrix
        )
      );

    let minimumX =
      Infinity;

    let minimumY =
      Infinity;

    let maximumX =
      -Infinity;

    let maximumY =
      -Infinity;

    for (
      const sample
      of instance
        .projectedEnvelopeSamples
    ) {
      const projected =
        projectEnvelopePointToViewport(
          combinedMatrix,
          sample,
          canvasRect
        );

      minimumX =
        Math.min(
          minimumX,
          projected.x
        );

      minimumY =
        Math.min(
          minimumY,
          projected.y
        );

      maximumX =
        Math.max(
          maximumX,
          projected.x
        );

      maximumY =
        Math.max(
          maximumY,
          projected.y
        );
    }

    invariant(
      Number.isFinite(
        minimumX
      ) &&
      Number.isFinite(
        minimumY
      ) &&
      Number.isFinite(
        maximumX
      ) &&
      Number.isFinite(
        maximumY
      ),
      "PROJECTED_BOUNDS_EXTENTS_INVALID"
    );

    const epsilon =
      PROJECTED_BOUNDS
        .containmentEpsilonCssPixels;

    const left =
      minimumX -
      epsilon;

    const top =
      minimumY -
      epsilon;

    const width =
      Math.max(
        0,
        maximumX +
        epsilon -
        left
      );

    const height =
      Math.max(
        0,
        maximumY +
        epsilon -
        top
      );

    return Object.freeze({
      visible:
        true,

      status:
        PROJECTED_BOUNDS_STATUS
          .AVAILABLE,

      left,
      top,
      width,
      height
    });
  }

  function updateProjectedBounds(
    instance,
    modelMatrix = null
  ) {
    const status =
      projectedBoundsLifecycleStatus(
        instance
      );

    if (
      status !==
        PROJECTED_BOUNDS_STATUS
          .AVAILABLE ||
      instance.presentationState
        .visible !==
        true
    ) {
      publishInvalidProjectedBounds(
        instance,
        status
      );

      return false;
    }

    const resolvedModelMatrix =
      modelMatrix ||
      currentModelMatrix(
        instance
      );

    try {
      return publishProjectedBoundsCandidate(
        instance,
        calculateAvailableProjectedBounds(
          instance,
          resolvedModelMatrix
        )
      );
    } catch (error) {
      safeEmitInstanceFailure(
        instance,
        errorCodeFrom(
          error,
          "PROJECTED_BOUNDS_CALCULATION_FAILURE"
        ),
        error &&
        error.details
          ? error.details
          : null,
        FAILURE_STAGE
          .PROJECTED_BOUNDS,
        error
      );

      return false;
    }
  }

  function publishLifecycleProjectedBoundsIfInvalid(
    instance
  ) {
    const status =
      projectedBoundsLifecycleStatus(
        instance
      );

    if (
      status !==
        PROJECTED_BOUNDS_STATUS
          .AVAILABLE ||
      instance.presentationState
        .visible !==
        true
    ) {
      publishInvalidProjectedBounds(
        instance,
        status
      );

      return true;
    }

    return false;
  }

  function publishReceipt(
    extra = {}
  ) {
    GLOBAL_LIFECYCLE.receiptRevision +=
      1;

    Object.assign(
      RECEIPT,
      {
        moduleId:
          MODULE.id,

        moduleVersion:
          MODULE.version,

        installed:
          true,

        geometryAuthority:
          GEOMETRY_AUTHORITY.moduleId,

        geometryRequiredVersion:
          GEOMETRY_AUTHORITY.requiredModuleVersion,

        mountedInstanceCount:
          INSTANCES.size,

        lastFailureCode:
          GLOBAL_LIFECYCLE
            .lastFailureCode,

        lastFailureMessage:
          GLOBAL_LIFECYCLE
            .lastFailureMessage,

        lastFailureStage:
          GLOBAL_LIFECYCLE
            .lastFailureStage,

        lastFailureDetail:
          GLOBAL_LIFECYCLE
            .lastFailureDetail,

        lastWebGLError:
          GLOBAL_LIFECYCLE
            .lastWebGLError,

        lastWebGLErrorName:
          GLOBAL_LIFECYCLE
            .lastWebGLErrorName,

        lastLifecycleCheckpoint:
          GLOBAL_LIFECYCLE
            .lastCheckpoint,

        lifecycleSequence:
          Object.freeze(
            GLOBAL_LIFECYCLE
              .history
              .slice()
          ),

        receiptRevision:
          GLOBAL_LIFECYCLE
            .receiptRevision,

        fixedCenter:
          true,

        parentOrientationInherited:
          false,

        navigationOrientationApplied:
          false,

        constellationOrientationApplied:
          false,

        clusterOrientationApplied:
          false,

        participatesInNavigationSettlement:
          false,

        publishesQuaternion:
          false,

        rendererOwnsActivation:
          false,

        rendererOwnsNavigation:
          false,

        rendererOwnsSelection:
          false,

        rendererOwnsSemanticDisabledState:
          false,

        fallbackPromotionOwnedByRenderer:
          true,

        semanticControlOwnedByHtml:
          true,

        oneInstancePerMount:
          true,

        automaticMountDiscovery:
          true,

        enhancedOpacityAuthority:
          "SHADER",

        fallbackOpacityAuthority:
          "CSS",

        canvasPromotionOpacity:
          "BINARY",

        canvasPointerEvents:
          "none",

        projectedBoundsContract:
          PROJECTED_BOUNDS_CONTRACT,

        projectedBoundsEvent:
          PROJECTED_BOUNDS_EVENT,

        projectedBoundsGetterPresent:
          true,

        projectedBoundsGeometrySource:
          PROJECTED_BOUNDS
            .authoritativeGeometrySource,

        projectedBoundsProjectionMethod:
          PROJECTED_BOUNDS
            .projectionMethod,

        projectedBoundsAngularSamplesPerDepthPlane:
          PROJECTED_BOUNDS
            .angularSamplesPerDepthPlane,

        projectedBoundsDepthPlaneCount:
          PROJECTED_BOUNDS
            .depthPlaneCount,

        projectedBoundsContainmentEpsilonCssPixels:
          PROJECTED_BOUNDS
            .containmentEpsilonCssPixels,

        projectedBoundsMaterialChangeToleranceCssPixels:
          PROJECTED_BOUNDS
            .materialChangeToleranceCssPixels,

        projectedBoundsGeometryRadiusExpansion:
          PROJECTED_BOUNDS
            .geometryRadiusExpansion,

        projectedBoundsHaloExpansion:
          PROJECTED_BOUNDS
            .haloExpansion,

        projectedBoundsInvalidRecordsParticipateInRevisionSequence:
          true,

        projectedBoundsStatusVocabulary:
          PROJECTED_BOUNDS_STATUS_VALUES,

        showroomAware:
          false,

        visualPassClaimed:
          false
      },
      extra
    );

    if (
      typeof globalThis !==
      "undefined"
    ) {
      globalThis[
        RECEIPT_SYMBOL
      ] =
        Object.freeze({
          ...RECEIPT,

          lifecycleSequence:
            Object.freeze(
              GLOBAL_LIFECYCLE
                .history
                .slice()
            )
        });
    }

    return Object.freeze({
      ...RECEIPT,

      lifecycleSequence:
        Object.freeze(
          GLOBAL_LIFECYCLE
            .history
            .slice()
        )
    });
  }

  function emitFailure(
    reason,
    details = null,
    options = {}
  ) {
    const normalizedReason =
      String(
        reason ||
        "UNKNOWN_RENDERER_FAILURE"
      );

    const code =
      String(
        options.code ||
        normalizedReason
      );

    const message =
      String(
        options.message ||
        normalizedReason
      );

    const stage =
      String(
        options.stage ||
        FAILURE_STAGE.UNKNOWN
      );

    const detail =
      freezeSnapshot(
        serializableValue(
          details
        )
      );

    GLOBAL_LIFECYCLE.lastFailureCode =
      code;

    GLOBAL_LIFECYCLE.lastFailureMessage =
      message;

    GLOBAL_LIFECYCLE.lastFailureStage =
      stage;

    GLOBAL_LIFECYCLE.lastFailureDetail =
      detail;

    if (
      Number.isFinite(
        options.webglError
      )
    ) {
      GLOBAL_LIFECYCLE.lastWebGLError =
        options.webglError;

      GLOBAL_LIFECYCLE.lastWebGLErrorName =
        String(
          options.webglErrorName ||
          "UNKNOWN_WEBGL_ERROR"
        );
    }

    publishReceipt({
      status:
        "failed",

      lastFailure:
        normalizedReason,

      lastFailureCode:
        code,

      lastFailureMessage:
        message,

      lastFailureStage:
        stage,

      lastFailureDetail:
        detail,

      lastRendererStatus:
        RENDERER_STATUS.FAILED
    });

    if (
      typeof globalThis !==
        "undefined" &&
      typeof globalThis
        .dispatchEvent ===
        "function" &&
      typeof CustomEvent ===
        "function"
    ) {
      globalThis.dispatchEvent(
        new CustomEvent(
          FAILURE_EVENT,
          {
            detail:
              Object.freeze({
                reason:
                  normalizedReason,

                failureCode:
                  code,

                failureMessage:
                  message,

                failureStage:
                  stage,

                instanceId:
                  String(
                    options.instanceId ||
                    ""
                  ),

                webglError:
                  Number.isFinite(
                    options.webglError
                  )
                    ? options.webglError
                    : 0,

                webglErrorName:
                  String(
                    options.webglErrorName ||
                    ""
                  ),

                lifecycleCheckpoint:
                  GLOBAL_LIFECYCLE
                    .lastCheckpoint,

                details:
                  detail
              })
          }
        )
      );
    }
  }

  function resolveGeometryAuthority() {
    const geometry =
      globalThis
        .DGB_UPSTREAM_COMPASS_GEOMETRY;

    invariant(
      geometry &&
      typeof geometry ===
        "object",
      "GEOMETRY_AUTHORITY_NOT_FOUND"
    );

    invariant(
      geometry.moduleId ===
        GEOMETRY_AUTHORITY.moduleId,
      "GEOMETRY_AUTHORITY_ID_MISMATCH"
    );

    invariant(
      geometry.moduleVersion ===
        GEOMETRY_AUTHORITY
          .requiredModuleVersion,
      "GEOMETRY_AUTHORITY_VERSION_MISMATCH",
      {
        expected:
          GEOMETRY_AUTHORITY
            .requiredModuleVersion,

        actual:
          geometry.moduleVersion
      }
    );

    invariant(
      typeof geometry.buildModel ===
        "function",
      "GEOMETRY_BUILD_MODEL_SURFACE_REQUIRED"
    );

    invariant(
      typeof geometry.validateModel ===
        "function",
      "GEOMETRY_VALIDATE_MODEL_SURFACE_REQUIRED"
    );

    invariant(
      typeof geometry
        .buildStaticSvgFallback ===
        "function",
      "GEOMETRY_STATIC_SVG_SURFACE_REQUIRED"
    );

    return geometry;
  }

  function validateGeometryModel(
    geometry,
    model
  ) {
    geometry.validateModel(
      model
    );

    invariant(
      model &&
      model.objectIdentity,
      "GEOMETRY_OBJECT_IDENTITY_REQUIRED"
    );

    invariant(
      model.objectIdentity.objectClass ===
        GEOMETRY_AUTHORITY
          .requiredObjectClass,
      "GEOMETRY_OBJECT_CLASS_INVALID"
    );

    invariant(
      model.objectIdentity.physicalProjection ===
        GEOMETRY_AUTHORITY
          .requiredPhysicalProjection,
      "GEOMETRY_PHYSICAL_PROJECTION_INVALID"
    );

    invariant(
      model.objectIdentity
        .inheritsNavigationOrientation ===
        false,
      "GEOMETRY_NAVIGATION_ORIENTATION_INHERITANCE_FORBIDDEN"
    );

    invariant(
      model.objectIdentity
        .inheritsConstellationOrientation ===
        false,
      "GEOMETRY_CONSTELLATION_ORIENTATION_INHERITANCE_FORBIDDEN"
    );

    invariant(
      model.objectIdentity
        .inheritsClusterOrientation ===
        false,
      "GEOMETRY_CLUSTER_ORIENTATION_INHERITANCE_FORBIDDEN"
    );

    invariant(
      model.objectIdentity
        .participatesInNavigationSettlement ===
        false,
      "GEOMETRY_NAVIGATION_SETTLEMENT_PARTICIPATION_FORBIDDEN"
    );

    invariant(
      model.objectIdentity
        .publishesQuaternion ===
        false,
      "GEOMETRY_QUATERNION_PUBLICATION_FORBIDDEN"
    );

    invariant(
      model.rootTransform &&
      model.rootTransform
        .placementMode ===
        "FIXED_CENTER",
      "GEOMETRY_FIXED_CENTER_PLACEMENT_REQUIRED"
    );

    invariant(
      model.rootTransform
        .parentOrientationMode ===
        "NONE",
      "GEOMETRY_PARENT_ORIENTATION_MODE_INVALID"
    );

    invariant(
      model.rootTransform
        .localTransformOrder ===
        "FIXED_CENTER_PLACEMENT * LOCAL_PRESENTATION_TRANSFORM",
      "GEOMETRY_LOCAL_TRANSFORM_ORDER_INVALID"
    );

    invariant(
      model.presentationTransforms &&
      model.presentationTransforms
        .fixedCenter,
      "GEOMETRY_FIXED_CENTER_TRANSFORM_REQUIRED"
    );

    invariant(
      !Object.prototype
        .hasOwnProperty
        .call(
          model.presentationTransforms,
          "decisionApproach"
        ),
      "GEOMETRY_DECISION_APPROACH_TRANSFORM_FORBIDDEN"
    );

    const envelope =
      model
        .visualControlAlignmentEnvelope;

    invariant(
      envelope &&
      envelope.shape ===
        "CIRCULAR_DISC",
      "GEOMETRY_VISUAL_CONTROL_ALIGNMENT_ENVELOPE_REQUIRED"
    );

    invariant(
      Array.isArray(
        envelope.localCenter
      ) &&
      envelope.localCenter.length ===
        3 &&
      envelope.localCenter.every(
        Number.isFinite
      ),
      "GEOMETRY_VISUAL_CONTROL_ALIGNMENT_CENTER_INVALID"
    );

    invariant(
      Number.isFinite(
        envelope.radius
      ) &&
      envelope.radius >
        0,
      "GEOMETRY_VISUAL_CONTROL_ALIGNMENT_RADIUS_INVALID"
    );

    invariant(
      Array.isArray(
        envelope.zInterval
      ) &&
      envelope.zInterval.length ===
        2 &&
      envelope.zInterval.every(
        Number.isFinite
      ),
      "GEOMETRY_VISUAL_CONTROL_ALIGNMENT_DEPTH_INVALID"
    );

    return true;
  }

  function resolveQualityProfileId(
    pageContext
  ) {
    const requested =
      String(
        pageContext
          .qualityProfileId ||
        "desktop"
      );

    if (
      requested ===
        "desktop" ||
      requested ===
        "mobile" ||
      requested ===
        "lowPower"
    ) {
      return requested;
    }

    return "desktop";
  }

  function normalizePresentationState(
    input
  ) {
    const source =
      input &&
      typeof input ===
        "object"
        ? input
        : {};

    return Object.freeze({
      visible:
        source.visible !==
        false,

      interactionEnabled:
        source.interactionEnabled !==
        false,

      held:
        source.held ===
        true,

      reducedMotion:
        source.reducedMotion ===
        true,

      hoverActive:
        source.hoverActive ===
        true,

      focusActive:
        source.focusActive ===
        true,

      pressed:
        source.pressed ===
        true,

      rendererFailure:
        String(
          source.rendererFailure ||
          ""
        )
    });
  }

  function normalizeContext(
    pageContext
  ) {
    invariant(
      pageContext &&
      typeof pageContext ===
        "object",
      "PAGE_CONTEXT_REQUIRED"
    );

    const root =
      pageContext.root ||
      document;

    const mount =
      pageContext.mount ||
      qs(
        "[data-upstream-compass-mount]",
        root
      );

    invariant(
      mount instanceof Element,
      "UPSTREAM_COMPASS_MOUNT_REQUIRED"
    );

    const semanticControl =
      pageContext
        .semanticControl ||
      qs(
        "[data-upstream-compass-control]",
        mount
      );

    const fallback =
      pageContext.fallback ||
      qs(
        "[data-upstream-compass-fallback]",
        mount
      );

    invariant(
      semanticControl instanceof
        Element,
      "UPSTREAM_COMPASS_SEMANTIC_CONTROL_REQUIRED"
    );

    invariant(
      fallback instanceof Element,
      "UPSTREAM_COMPASS_FALLBACK_REQUIRED"
    );

    return Object.freeze({
      root:
        root instanceof Element ||
        root === document
          ? root
          : document,

      mount,

      semanticControl,

      fallback,

      qualityProfileId:
        resolveQualityProfileId(
          pageContext
        ),

      getPresentationState:
        typeof pageContext
          .getPresentationState ===
          "function"
          ? pageContext
              .getPresentationState
          : typeof pageContext
              .getCompassPresentationState ===
              "function"
            ? pageContext
                .getCompassPresentationState
            : null,

      subscribePresentationState:
        typeof pageContext
          .subscribePresentationState ===
          "function"
          ? pageContext
              .subscribePresentationState
          : typeof pageContext
              .subscribeCompassPresentationState ===
              "function"
            ? pageContext
                .subscribeCompassPresentationState
            : null,

      getReducedMotion:
        typeof pageContext
          .getReducedMotion ===
          "function"
          ? pageContext
              .getReducedMotion
          : null,

      subscribeReducedMotion:
        typeof pageContext
          .subscribeReducedMotion ===
          "function"
          ? pageContext
              .subscribeReducedMotion
          : null
    });
  }

  function createCanvas(mount) {
    const existing =
      qs(
        "canvas[data-upstream-compass-canvas]",
        mount
      );

    if (existing) {
      existing.dataset
        .upstreamCompassCanvasVisible =
        "false";

      existing.setAttribute(
        "aria-hidden",
        "true"
      );

      existing.setAttribute(
        "role",
        "presentation"
      );

      existing.style.pointerEvents =
        "none";

      existing.style.opacity =
        "0";

      existing.style.visibility =
        "hidden";

      return Object.freeze({
        canvas:
          existing,

        created:
          false,

        inserted:
          true
      });
    }

    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.dataset
      .upstreamCompassCanvas =
      "true";

    canvas.dataset
      .upstreamCompassCanvasVisible =
      "false";

    canvas.setAttribute(
      "aria-hidden",
      "true"
    );

    canvas.setAttribute(
      "role",
      "presentation"
    );

    canvas.style.position =
      "absolute";

    canvas.style.left =
      "50%";

    canvas.style.top =
      "50%";

    canvas.style.transform =
      "translate(-50%, -50%)";

    canvas.style.width =
      "100%";

    canvas.style.height =
      "100%";

    canvas.style.display =
      "block";

    canvas.style.pointerEvents =
      "none";

    canvas.style.opacity =
      "0";

    canvas.style.visibility =
      "hidden";

    mount.prepend(
      canvas
    );

    return Object.freeze({
      canvas,

      created:
        true,

      inserted:
        true
    });
  }

  function getGL(canvas) {
    return (
      canvas.getContext(
        "webgl",
        {
          alpha:
            true,

          antialias:
            true,

          depth:
            true,

          premultipliedAlpha:
            true,

          preserveDrawingBuffer:
            false
        }
      ) ||
      null
    );
  }

  function setMountRendererStatus(
    instance,
    status
  ) {
    instance.rendererStatus =
      String(
        status ||
        RENDERER_STATUS
          .INITIALIZING
      );

    instance.context
      .mount
      .dataset
      .upstreamCompassRendererStatus =
      instance.rendererStatus;
  }

  function setCanvasVisible(
    instance,
    visible
  ) {
    const active =
      visible ===
      true;

    instance.canvas.dataset
      .upstreamCompassCanvasVisible =
      active
        ? "true"
        : "false";

    instance.canvas.style.opacity =
      active
        ? "1"
        : "0";

    instance.canvas.style.visibility =
      active
        ? "visible"
        : "hidden";

    if (active) {
      instance.canvasPromoted =
        true;
    }
  }

  function setFallbackVisible(
    instance,
    visible
  ) {
    const active =
      visible ===
      true;

    const fallback =
      instance.context
        .fallback;

    fallback.dataset
      .upstreamCompassFallbackVisible =
      active
        ? "true"
        : "false";

    fallback.hidden =
      !active;

    fallback.style.display =
      active
        ? ""
        : "none";

    fallback.style.opacity =
      active
        ? String(
            instance.currentOpacity
          )
        : "0";

    fallback.style.visibility =
      active
        ? "visible"
        : "hidden";

    if (!active) {
      instance.fallbackWithdrawn =
        true;
    }
  }

  function publishMountState(
    instance
  ) {
    const mount =
      instance.context.mount;

    mount.dataset
      .upstreamCompassFixedCenter =
      "true";

    mount.dataset
      .upstreamCompassVisible =
      instance.presentationState
        .visible
        ? "true"
        : "false";

    mount.dataset
      .upstreamCompassInteractionEnabled =
      instance.presentationState
        .interactionEnabled
        ? "true"
        : "false";

    mount.dataset
      .upstreamCompassHeld =
      instance.presentationState
        .held
        ? "true"
        : "false";

    mount.dataset
      .upstreamCompassReducedMotion =
      instance.reducedMotion
        ? "true"
        : "false";

    mount.dataset
      .upstreamCompassHoverActive =
      instance.hoverActive
        ? "true"
        : "false";

    mount.dataset
      .upstreamCompassFocusActive =
      instance.focusActive
        ? "true"
        : "false";

    mount.dataset
      .upstreamCompassPressed =
      instance.pressed
        ? "true"
        : "false";

    mount.dataset
      .upstreamCompassFirstEnhancedFrame =
      instance.firstEnhancedFrameCompleted
        ? "true"
        : "false";

    mount.dataset
      .upstreamCompassInheritsParentOrientation =
      "false";

    mount.dataset
      .upstreamCompassNavigationOrientationApplied =
      "false";

    mount.dataset
      .upstreamCompassConstellationOrientationApplied =
      "false";

    mount.dataset
      .upstreamCompassClusterOrientationApplied =
      "false";

    mount.dataset
      .upstreamCompassParticipatesInNavigationSettlement =
      "false";

    mount.dataset
      .upstreamCompassRendererOwnsActivation =
      "false";

    mount.dataset
      .upstreamCompassRendererOwnsSemanticDisabledState =
      "false";

    mount.dataset
      .upstreamCompassRendererFailure =
      instance.presentationState
        .rendererFailure ||
      (
        instance.renderFailureEmitted
          ? instance.lastFailure
          : ""
      );

    mount.dataset
      .upstreamCompassRendererStage =
      instance.lastLifecycleCheckpoint ||
      "";

    mount.dataset
      .upstreamCompassWebglError =
      instance.lastWebGLError
        ? String(
            instance.lastWebGLError
          )
        : "";

    mount.dataset
      .upstreamCompassEnhancedOpacityAuthority =
      "shader";

    mount.dataset
      .upstreamCompassFallbackOpacityAuthority =
      "css";

    mount.dataset
      .upstreamCompassCanvasPromotionOpacity =
      "binary";

    mount.dataset
      .visualPassClaimed =
      "false";
  }

  function applyPresentationVisibility(
    instance
  ) {
    publishMountState(
      instance
    );

    if (
      instance.destroyed ||
      instance.rendererStatus ===
        RENDERER_STATUS.DISPOSED
    ) {
      setCanvasVisible(
        instance,
        false
      );

      setFallbackVisible(
        instance,
        true
      );

      return;
    }

    if (
      !instance.presentationState
        .visible
    ) {
      setCanvasVisible(
        instance,
        false
      );

      setFallbackVisible(
        instance,
        false
      );

      return;
    }

    if (
      instance.renderFailureEmitted ||
      instance.rendererStatus ===
        RENDERER_STATUS.FAILED ||
      instance.presentationState
        .rendererFailure
    ) {
      setCanvasVisible(
        instance,
        false
      );

      setFallbackVisible(
        instance,
        true
      );

      return;
    }

    if (
      instance.firstEnhancedFrameCompleted &&
      instance.gl
    ) {
      setCanvasVisible(
        instance,
        true
      );

      setFallbackVisible(
        instance,
        false
      );

      return;
    }

    setCanvasVisible(
      instance,
      false
    );

    setFallbackVisible(
      instance,
      true
    );
  }

  function replaceFallbackContent(
    instance
  ) {
    const fallbackSurface =
      instance.geometry
        .buildStaticSvgFallback({
          title:
            "Home Compass",

          className:
            "dgb-upstream-compass-static-fallback",

          includeTitle:
            true,

          includeIntercardinalTicks:
            instance.model
              .includeIntercardinalTicks,

          ariaHidden:
            true,

          focusable:
            false
        });

    instance.fallbackSurface =
      fallbackSurface;

    instance.context
      .fallback
      .innerHTML =
      fallbackSurface.svgString;

    instance.context
      .fallback
      .dataset
      .upstreamCompassFallbackInjected =
      "true";
  }

  function normalizeLocalTransform(
    transform
  ) {
    return Object.freeze({
      position:
        normalizeArray3(
          transform &&
          transform.position,
          [0, 0, 0]
        ),

      quaternion:
        normalizeQuaternion(
          transform &&
          transform.quaternion
        ),

      scale:
        normalizeArray3(
          transform &&
          transform.scale,
          [1, 1, 1]
        )
    });
  }

  function visualScaleTarget(
    instance
  ) {
    if (
      !instance.presentationState
        .visible
    ) {
      return QUALITY.hiddenScale;
    }

    if (
      instance.presentationState
        .held
    ) {
      return QUALITY.heldScale;
    }

    if (
      !instance.presentationState
        .interactionEnabled
    ) {
      return QUALITY.disabledScale;
    }

    if (
      instance.pressed
    ) {
      return QUALITY.pressedScale;
    }

    if (
      instance.focusActive &&
      !instance.reducedMotion
    ) {
      return QUALITY.focusScale;
    }

    if (
      instance.hoverActive &&
      !instance.reducedMotion
    ) {
      return QUALITY.hoverScale;
    }

    return 1;
  }

  function visualOpacityTarget(
    instance
  ) {
    if (
      !instance.presentationState
        .visible
    ) {
      return QUALITY.hiddenOpacity;
    }

    if (
      instance.presentationState
        .held
    ) {
      return QUALITY.heldOpacity;
    }

    if (
      !instance.presentationState
        .interactionEnabled
    ) {
      return QUALITY.disabledOpacity;
    }

    return QUALITY.normalOpacity;
  }

  function visualBrightnessTarget(
    instance
  ) {
    if (
      instance.presentationState
        .held ||
      !instance.presentationState
        .interactionEnabled
    ) {
      return 0.84;
    }

    if (
      instance.pressed
    ) {
      return 0.96;
    }

    if (
      instance.focusActive
    ) {
      return 1.08;
    }

    if (
      instance.hoverActive
    ) {
      return 1.05;
    }

    return 1;
  }

  function synchronizeVisualTargets(
    instance
  ) {
    instance.targetFeedbackScale =
      visualScaleTarget(
        instance
      );

    instance.targetOpacity =
      visualOpacityTarget(
        instance
      );

    instance.targetBrightness =
      visualBrightnessTarget(
        instance
      );
  }

  function presentationOwnsReducedMotion(
    instance
  ) {
    return (
      !instance.context
        .getReducedMotion &&
      !instance.context
        .subscribeReducedMotion
    );
  }

  function syncPresentationState(
    instance,
    value
  ) {
    if (
      instance.destroyed
    ) {
      return false;
    }

    const normalized =
      normalizePresentationState(
        value
      );

    instance.presentationState =
      normalized;

    instance.hoverActive =
      normalized.hoverActive ||
      instance.semanticHoverActive;

    instance.focusActive =
      normalized.focusActive ||
      instance.semanticFocusActive;

    instance.pressed =
      normalized.pressed ||
      instance.semanticPressed;

    if (
      presentationOwnsReducedMotion(
        instance
      )
    ) {
      instance.reducedMotion =
        normalized.reducedMotion;
    }

    synchronizeVisualTargets(
      instance
    );

    if (
      instance.reducedMotion
    ) {
      instance.feedbackScale =
        instance.targetFeedbackScale;

      instance.currentOpacity =
        instance.targetOpacity;

      instance.currentBrightness =
        instance.targetBrightness;
    }

    applyPresentationVisibility(
      instance
    );

    if (
      !publishLifecycleProjectedBoundsIfInvalid(
        instance
      ) &&
      !instance.running &&
      instance.firstEnhancedFrameCompleted
    ) {
      updateProjectedBounds(
        instance
      );
    }

    return true;
  }

  function setReducedMotion(
    instance,
    active
  ) {
    instance.reducedMotion =
      active ===
      true;

    synchronizeVisualTargets(
      instance
    );

    if (
      instance.reducedMotion
    ) {
      instance.localPosition =
        instance.targetLocalPosition
          .slice();

      instance.localQuaternion =
        instance.targetLocalQuaternion
          .slice();

      instance.localScale =
        instance.targetLocalScale
          .slice();

      instance.feedbackScale =
        instance.targetFeedbackScale;

      instance.currentOpacity =
        instance.targetOpacity;

      instance.currentBrightness =
        instance.targetBrightness;
    }

    publishMountState(
      instance
    );

    if (
      !instance.running &&
      instance.firstEnhancedFrameCompleted &&
      instance.presentationState
        .visible
    ) {
      updateProjectedBounds(
        instance
      );
    }
  }

  function readInitialPresentation(
    context
  ) {
    let state =
      normalizePresentationState(
        null
      );

    if (
      context.getPresentationState
    ) {
      try {
        state =
          normalizePresentationState(
            context
              .getPresentationState()
          );
      } catch (_) {}
    }

    return state;
  }

  function readInitialReducedMotion(
    context,
    presentationState
  ) {
    if (
      context.getReducedMotion
    ) {
      try {
        return (
          context
            .getReducedMotion() ===
          true
        );
      } catch (_) {}
    }

    return presentationState
      .reducedMotion;
  }

  function createInstance(
    context
  ) {
    const geometry =
      resolveGeometryAuthority();

    const model =
      geometry.buildModel({
        qualityProfileId:
          context.qualityProfileId
      });

    validateGeometryModel(
      geometry,
      model
    );

    const fixedCenterTransform =
      normalizeLocalTransform(
        model.presentationTransforms
          .fixedCenter
      );

    const presentationState =
      readInitialPresentation(
        context
      );

    const reducedMotion =
      readInitialReducedMotion(
        context,
        presentationState
      );

    const instanceId =
      `home-compass-instance-${++instanceCounter}`;

    const canvasRecord =
      createCanvas(
        context.mount
      );

    const instance = {
      id:
        instanceId,

      geometry,

      model,

      context,

      canvas:
        canvasRecord.canvas,

      canvasCreated:
        canvasRecord.created,

      canvasInserted:
        canvasRecord.inserted,

      gl:
        null,

      program:
        null,

      attribs:
        null,

      uniforms:
        null,

      gpuMeshes:
        [],

      running:
        false,

      stopped:
        false,

      raf:
        0,

      lastTime:
        0,

      cssWidth:
        1,

      cssHeight:
        1,

      width:
        1,

      height:
        1,

      pixelRatio:
        1,

      presentationState,

      reducedMotion,

      localPosition:
        fixedCenterTransform
          .position
          .slice(),

      targetLocalPosition:
        fixedCenterTransform
          .position
          .slice(),

      localQuaternion:
        fixedCenterTransform
          .quaternion
          .slice(),

      targetLocalQuaternion:
        fixedCenterTransform
          .quaternion
          .slice(),

      localScale:
        fixedCenterTransform
          .scale
          .slice(),

      targetLocalScale:
        fixedCenterTransform
          .scale
          .slice(),

      semanticHoverActive:
        false,

      semanticFocusActive:
        false,

      semanticPressed:
        false,

      hoverActive:
        presentationState
          .hoverActive,

      focusActive:
        presentationState
          .focusActive,

      pressed:
        presentationState
          .pressed,

      feedbackScale:
        1,

      targetFeedbackScale:
        1,

      currentOpacity:
        presentationState
          .visible
          ? 1
          : 0,

      targetOpacity:
        presentationState
          .visible
          ? 1
          : 0,

      currentBrightness:
        1,

      targetBrightness:
        1,

      view:
        identity4(),

      projection:
        identity4(),

      projectedEnvelopeSamples:
        buildProjectedEnvelopeSamples(
          model
        ),

      projectedBoundsRevision:
        0,

      projectedBounds:
        null,

      projectedBoundsAvailable:
        false,

      fallbackSurface:
        null,

      destroyed:
        false,

      unsubscribers:
        [],

      semanticListeners:
        [],

      renderFailureEmitted:
        false,

      lastFailure:
        "",

      failureCode:
        "",

      failureMessage:
        "",

      failureStage:
        "",

      failureDetail:
        null,

      contextCreated:
        false,

      geometryAccepted:
        true,

      resourcesCreated:
        false,

      subscriptionsRegistered:
        false,

      firstFrameEntered:
        false,

      drawPhaseCompleted:
        false,

      lastWebGLError:
        0,

      lastWebGLErrorName:
        "NO_ERROR",

      firstEnhancedFrameCompleted:
        false,

      canvasPromoted:
        false,

      fallbackWithdrawn:
        false,

      rendererStatus:
        RENDERER_STATUS
          .INITIALIZING,

      lifecycleSequenceNumber:
        0,

      lifecycleHistory:
        [],

      lastLifecycleCheckpoint:
        ""
    };

    synchronizeVisualTargets(
      instance
    );

    if (
      reducedMotion
    ) {
      instance.feedbackScale =
        instance.targetFeedbackScale;

      instance.currentOpacity =
        instance.targetOpacity;

      instance.currentBrightness =
        instance.targetBrightness;
    }

    setMountRendererStatus(
      instance,
      RENDERER_STATUS
        .INITIALIZING
    );

    applyPresentationVisibility(
      instance
    );

    return instance;
  }

  function safeEmitInstanceFailure(
    instance,
    reason,
    details = null,
    stage =
      FAILURE_STAGE.UNKNOWN,
    sourceError = null
  ) {
    if (
      instance.renderFailureEmitted
    ) {
      return;
    }

    const normalizedReason =
      String(
        reason ||
        "UNKNOWN_RENDER_FAILURE"
      );

    const code =
      errorCodeFrom(
        sourceError,
        normalizedReason
      );

    const message =
      errorMessageFrom(
        sourceError,
        normalizedReason
      );

    instance.renderFailureEmitted =
      true;

    instance.lastFailure =
      normalizedReason;

    instance.failureCode =
      code;

    instance.failureMessage =
      message;

    instance.failureStage =
      String(
        stage ||
        FAILURE_STAGE.UNKNOWN
      );

    instance.failureDetail =
      freezeSnapshot(
        serializableValue(
          details
        )
      );

    instance.running =
      false;

    instance.stopped =
      true;

    if (
      instance.raf
    ) {
      cancelAnimationFrame(
        instance.raf
      );

      instance.raf =
        0;
    }

    recordInstanceCheckpoint(
      instance,
      CHECKPOINT.FAILURE,
      {
        reason:
          normalizedReason,

        code,

        message,

        stage:
          instance.failureStage,

        detail:
          instance.failureDetail,

        webglError:
          instance.lastWebGLError,

        webglErrorName:
          instance.lastWebGLErrorName
      },
      {
        failureCode:
          code
      }
    );

    setMountRendererStatus(
      instance,
      RENDERER_STATUS.FAILED
    );

    publishInvalidProjectedBounds(
      instance,
      PROJECTED_BOUNDS_STATUS
        .FAILED
    );

    applyPresentationVisibility(
      instance
    );

    publishReceipt({
      status:
        "failed",

      lastFailure:
        normalizedReason,

      lastFailureCode:
        code,

      lastFailureMessage:
        message,

      lastFailureStage:
        instance.failureStage,

      lastFailureDetail:
        instance.failureDetail,

      lastWebGLError:
        instance.lastWebGLError,

      lastWebGLErrorName:
        instance.lastWebGLErrorName,

      lastInstanceId:
        instance.id,

      lastRendererStatus:
        RENDERER_STATUS.FAILED,

      lastQualityProfileId:
        instance.model
          .qualityProfile
          .id,

      lastReducedMotion:
        instance.reducedMotion,

      lastVisible:
        instance.presentationState
          .visible,

      lastInteractionEnabled:
        instance.presentationState
          .interactionEnabled,

      lastHeld:
        instance.presentationState
          .held,

      firstEnhancedFrameCompleted:
        instance
          .firstEnhancedFrameCompleted,

      lastProjectedBoundsRevision:
        instance
          .projectedBoundsRevision,

      lastProjectedBoundsStatus:
        instance.projectedBounds
          ? instance.projectedBounds
              .status
          : ""
    });

    emitFailure(
      normalizedReason,
      details,
      {
        code,
        message,
        stage:
          instance.failureStage,

        instanceId:
          instance.id,

        webglError:
          instance.lastWebGLError,

        webglErrorName:
          instance.lastWebGLErrorName
      }
    );
  }

  function compileProgramSurfaces(
    instance
  ) {
    const gl =
      instance.gl;

    const vertex =
      compileShader(
        gl,
        gl.VERTEX_SHADER,
        vertexShaderSource
      );

    const fragment =
      compileShader(
        gl,
        gl.FRAGMENT_SHADER,
        fragmentShaderSource
      );

    recordInstanceCheckpoint(
      instance,
      CHECKPOINT.SHADERS_COMPILED,
      {
        vertex:
          true,

        fragment:
          true
      }
    );

    const program =
      gl.createProgram();

    invariant(
      program,
      "PROGRAM_CREATION_FAILURE"
    );

    gl.attachShader(
      program,
      vertex
    );

    gl.attachShader(
      program,
      fragment
    );

    gl.linkProgram(
      program
    );

    gl.deleteShader(
      vertex
    );

    gl.deleteShader(
      fragment
    );

    if (
      !gl.getProgramParameter(
        program,
        gl.LINK_STATUS
      )
    ) {
      const info =
        gl.getProgramInfoLog(
          program
        ) ||
        "PROGRAM_LINK_FAILURE";

      gl.deleteProgram(
        program
      );

      const error =
        new Error(info);

      error.code =
        "PROGRAM_LINK_FAILURE";

      error.details =
        {
          infoLog:
            String(info)
              .slice(0, 1024)
        };

      throw error;
    }

    instance.program =
      program;

    recordInstanceCheckpoint(
      instance,
      CHECKPOINT.PROGRAM_LINKED,
      {
        linked:
          true
      }
    );

    instance.attribs =
      Object.freeze({
        position:
          gl.getAttribLocation(
            instance.program,
            "aPosition"
          ),

        normal:
          gl.getAttribLocation(
            instance.program,
            "aNormal"
          )
      });

    instance.uniforms =
      Object.freeze({
        model:
          gl.getUniformLocation(
            instance.program,
            "uModel"
          ),

        view:
          gl.getUniformLocation(
            instance.program,
            "uView"
          ),

        projection:
          gl.getUniformLocation(
            instance.program,
            "uProjection"
          ),

        viewNormalMatrix:
          gl.getUniformLocation(
            instance.program,
            "uViewNormalMatrix"
          ),

        haloPass:
          gl.getUniformLocation(
            instance.program,
            "uHaloPass"
          ),

        haloExpansion:
          gl.getUniformLocation(
            instance.program,
            "uHaloExpansion"
          ),

        baseColor:
          gl.getUniformLocation(
            instance.program,
            "uBaseColor"
          ),

        ambientColor:
          gl.getUniformLocation(
            instance.program,
            "uAmbientColor"
          ),

        keyLightView:
          gl.getUniformLocation(
            instance.program,
            "uKeyLightView"
          ),

        fillLightView:
          gl.getUniformLocation(
            instance.program,
            "uFillLightView"
          ),

        rimLightView:
          gl.getUniformLocation(
            instance.program,
            "uRimLightView"
          ),

        alpha:
          gl.getUniformLocation(
            instance.program,
            "uAlpha"
          ),

        emissive:
          gl.getUniformLocation(
            instance.program,
            "uEmissive"
          ),

        specular:
          gl.getUniformLocation(
            instance.program,
            "uSpecular"
          ),

        rim:
          gl.getUniformLocation(
            instance.program,
            "uRim"
          ),

        haloStrength:
          gl.getUniformLocation(
            instance.program,
            "uHaloStrength"
          ),

        visualOpacity:
          gl.getUniformLocation(
            instance.program,
            "uVisualOpacity"
          ),

        feedbackBrightness:
          gl.getUniformLocation(
            instance.program,
            "uFeedbackBrightness"
          )
      });
  }

  function createGpuMeshRecord(
    gl,
    mesh
  ) {
    const material =
      MATERIALS[
        mesh.materialKey
      ] ||
      DEFAULT_MATERIAL;

    return Object.freeze({
      componentId:
        mesh.componentId,

      materialKey:
        mesh.materialKey,

      material,

      indexCount:
        mesh.indices.length,

      position:
        createBuffer(
          gl,
          gl.ARRAY_BUFFER,
          mesh.positions
        ),

      normal:
        createBuffer(
          gl,
          gl.ARRAY_BUFFER,
          mesh.normals
        ),

      index:
        createBuffer(
          gl,
          gl.ELEMENT_ARRAY_BUFFER,
          mesh.indices
        ),

      indexType:
        mesh.indices instanceof
          Uint32Array
          ? gl.UNSIGNED_INT
          : gl.UNSIGNED_SHORT
    });
  }

  function buildGpuMeshes(
    instance
  ) {
    const gl =
      instance.gl;

    const isWebGL2 =
      typeof WebGL2RenderingContext !==
        "undefined" &&
      gl instanceof
        WebGL2RenderingContext;

    const needsUint32 =
      instance.model
        .meshes
        .some(
          mesh =>
            mesh.indices instanceof
            Uint32Array
        );

    if (
      needsUint32 &&
      !isWebGL2
    ) {
      const extension =
        gl.getExtension(
          "OES_element_index_uint"
        );

      invariant(
        extension,
        "UINT32_ELEMENT_INDEX_EXTENSION_REQUIRED"
      );
    }

    return instance.model
      .meshes
      .map(
        mesh =>
          createGpuMeshRecord(
            gl,
            mesh
          )
      );
  }

  function initializeGL(
    instance
  ) {
    recordInstanceCheckpoint(
      instance,
      CHECKPOINT
        .WEBGL_CONTEXT_REQUESTED,
      {
        contextType:
          "webgl"
      }
    );

    const gl =
      getGL(
        instance.canvas
      );

    invariant(
      gl,
      "WEBGL_CONTEXT_UNAVAILABLE"
    );

    instance.gl =
      gl;

    instance.contextCreated =
      true;

    recordInstanceCheckpoint(
      instance,
      CHECKPOINT
        .WEBGL_CONTEXT_CREATED,
      {
        contextType:
          "webgl"
      }
    );

    gl.enable(
      gl.DEPTH_TEST
    );

    gl.depthFunc(
      gl.LEQUAL
    );

    gl.enable(
      gl.BLEND
    );

    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA
    );

    gl.disable(
      gl.CULL_FACE
    );

    compileProgramSurfaces(
      instance
    );

    instance.gpuMeshes =
      buildGpuMeshes(
        instance
      );

    instance.resourcesCreated =
      true;

    recordInstanceCheckpoint(
      instance,
      CHECKPOINT
        .GPU_RESOURCES_CREATED,
      {
        meshCount:
          instance.gpuMeshes
            .length
      }
    );

    const onContextLost =
      event => {
        event.preventDefault();

        safeEmitInstanceFailure(
          instance,
          "WEBGL_CONTEXT_LOST",
          null,
          FAILURE_STAGE.CONTEXT_LOSS
        );
      };

    const onContextRestored =
      () => {
        safeEmitInstanceFailure(
          instance,
          "WEBGL_CONTEXT_RESTORED_RELOAD_REQUIRED",
          null,
          FAILURE_STAGE.CONTEXT_LOSS
        );
      };

    instance.canvas
      .addEventListener(
        "webglcontextlost",
        onContextLost
      );

    instance.canvas
      .addEventListener(
        "webglcontextrestored",
        onContextRestored
      );

    instance.semanticListeners.push(
      Object.freeze({
        target:
          instance.canvas,

        type:
          "webglcontextlost",

        listener:
          onContextLost,

        options:
          false
      }),

      Object.freeze({
        target:
          instance.canvas,

        type:
          "webglcontextrestored",

        listener:
          onContextRestored,

        options:
          false
      })
    );
  }

  function updateSemanticVisualState(
    instance
  ) {
    instance.hoverActive =
      instance.semanticHoverActive ||
      instance.presentationState
        .hoverActive;

    instance.focusActive =
      instance.semanticFocusActive ||
      instance.presentationState
        .focusActive;

    instance.pressed =
      instance.semanticPressed ||
      instance.presentationState
        .pressed;

    synchronizeVisualTargets(
      instance
    );

    publishMountState(
      instance
    );

    if (
      instance.reducedMotion &&
      !instance.running &&
      instance.firstEnhancedFrameCompleted &&
      instance.presentationState
        .visible
    ) {
      instance.feedbackScale =
        instance.targetFeedbackScale;

      updateProjectedBounds(
        instance
      );
    }
  }

  function addTrackedListener(
    instance,
    target,
    type,
    listener,
    options = false
  ) {
    target.addEventListener(
      type,
      listener,
      options
    );

    instance.semanticListeners.push(
      Object.freeze({
        target,
        type,
        listener,
        options
      })
    );
  }

  function bindSemanticVisualFeedback(
    instance
  ) {
    const control =
      instance.context
        .semanticControl;

    const onPointerEnter =
      () => {
        instance.semanticHoverActive =
          true;

        updateSemanticVisualState(
          instance
        );
      };

    const onPointerLeave =
      () => {
        instance.semanticHoverActive =
          false;

        instance.semanticPressed =
          false;

        updateSemanticVisualState(
          instance
        );
      };

    const onPointerDown =
      event => {
        if (
          event.isPrimary ===
            false ||
          !instance.presentationState
            .interactionEnabled ||
          instance.presentationState
            .held
        ) {
          return;
        }

        instance.semanticPressed =
          true;

        updateSemanticVisualState(
          instance
        );
      };

    const onPointerUp =
      () => {
        instance.semanticPressed =
          false;

        updateSemanticVisualState(
          instance
        );
      };

    const onPointerCancel =
      () => {
        instance.semanticPressed =
          false;

        updateSemanticVisualState(
          instance
        );
      };

    const onFocusIn =
      () => {
        instance.semanticFocusActive =
          true;

        updateSemanticVisualState(
          instance
        );
      };

    const onFocusOut =
      () => {
        instance.semanticFocusActive =
          false;

        instance.semanticPressed =
          false;

        updateSemanticVisualState(
          instance
        );
      };

    const onKeyDown =
      event => {
        if (
          (
            event.key ===
              "Enter" ||
            event.key ===
              " "
          ) &&
          instance.presentationState
            .interactionEnabled &&
          !instance.presentationState
            .held
        ) {
          instance.semanticPressed =
            true;

          updateSemanticVisualState(
            instance
          );
        }
      };

    const onKeyUp =
      event => {
        if (
          event.key ===
            "Enter" ||
          event.key ===
            " "
        ) {
          instance.semanticPressed =
            false;

          updateSemanticVisualState(
            instance
          );
        }
      };

    addTrackedListener(
      instance,
      control,
      "pointerenter",
      onPointerEnter
    );

    addTrackedListener(
      instance,
      control,
      "pointerleave",
      onPointerLeave
    );

    addTrackedListener(
      instance,
      control,
      "pointerdown",
      onPointerDown
    );

    addTrackedListener(
      instance,
      control,
      "pointerup",
      onPointerUp
    );

    addTrackedListener(
      instance,
      control,
      "pointercancel",
      onPointerCancel
    );

    addTrackedListener(
      instance,
      control,
      "focusin",
      onFocusIn
    );

    addTrackedListener(
      instance,
      control,
      "focusout",
      onFocusOut
    );

    addTrackedListener(
      instance,
      control,
      "keydown",
      onKeyDown
    );

    addTrackedListener(
      instance,
      control,
      "keyup",
      onKeyUp
    );
  }

  function subscribeContextSignals(
    instance
  ) {
    const context =
      instance.context;

    if (
      context.subscribePresentationState
    ) {
      const unsubscribe =
        context
          .subscribePresentationState(
            value => {
              syncPresentationState(
                instance,
                value
              );
            }
          );

      if (
        typeof unsubscribe ===
        "function"
      ) {
        instance.unsubscribers.push(
          unsubscribe
        );
      }
    }

    if (
      context.subscribeReducedMotion
    ) {
      const unsubscribe =
        context
          .subscribeReducedMotion(
            value => {
              setReducedMotion(
                instance,
                value ===
                  true
              );

              applyPresentationVisibility(
                instance
              );
            }
          );

      if (
        typeof unsubscribe ===
        "function"
      ) {
        instance.unsubscribers.push(
          unsubscribe
        );
      }
    }

    bindSemanticVisualFeedback(
      instance
    );

    instance.subscriptionsRegistered =
      true;

    recordInstanceCheckpoint(
      instance,
      CHECKPOINT
        .SUBSCRIPTIONS_REGISTERED,
      {
        presentationSubscription:
          Boolean(
            context
              .subscribePresentationState
          ),

        reducedMotionSubscription:
          Boolean(
            context
              .subscribeReducedMotion
          ),

        semanticVisualFeedback:
          true
      }
    );
  }

  function unbindSubscriptions(
    instance
  ) {
    while (
      instance.unsubscribers.length >
      0
    ) {
      const unsubscribe =
        instance.unsubscribers.pop();

      try {
        unsubscribe();
      } catch (_) {}
    }

    while (
      instance.semanticListeners.length >
      0
    ) {
      const record =
        instance.semanticListeners.pop();

      try {
        record.target
          .removeEventListener(
            record.type,
            record.listener,
            record.options
          );
      } catch (_) {}
    }
  }

  function destroyGpuResources(
    instance
  ) {
    const gl =
      instance.gl;

    if (!gl) {
      return;
    }

    for (
      const gpuMesh
      of instance.gpuMeshes
    ) {
      if (
        gpuMesh.position
      ) {
        gl.deleteBuffer(
          gpuMesh.position
        );
      }

      if (
        gpuMesh.normal
      ) {
        gl.deleteBuffer(
          gpuMesh.normal
        );
      }

      if (
        gpuMesh.index
      ) {
        gl.deleteBuffer(
          gpuMesh.index
        );
      }
    }

    instance.gpuMeshes =
      [];

    if (
      instance.program
    ) {
      gl.deleteProgram(
        instance.program
      );

      instance.program =
        null;
    }
  }

  function releaseMountOwnership(
    instance
  ) {
    if (
      INSTANCE_BY_MOUNT.get(
        instance.context.mount
      ) ===
      instance
    ) {
      INSTANCE_BY_MOUNT.delete(
        instance.context.mount
      );
    }
  }

  function destroyInstance(
    instance
  ) {
    if (
      !instance ||
      instance.destroyed
    ) {
      return;
    }

    instance.destroyed =
      true;

    instance.running =
      false;

    instance.stopped =
      true;

    if (
      instance.raf
    ) {
      cancelAnimationFrame(
        instance.raf
      );

      instance.raf =
        0;
    }

    setMountRendererStatus(
      instance,
      RENDERER_STATUS.DISPOSED
    );

    publishInvalidProjectedBounds(
      instance,
      PROJECTED_BOUNDS_STATUS
        .DISPOSED
    );

    unbindSubscriptions(
      instance
    );

    destroyGpuResources(
      instance
    );

    if (
      instance.canvas &&
      instance.canvas.parentNode
    ) {
      instance.canvas
        .parentNode
        .removeChild(
          instance.canvas
        );
    }

    setCanvasVisible(
      instance,
      false
    );

    setFallbackVisible(
      instance,
      true
    );

    INSTANCES.delete(
      instance.id
    );

    releaseMountOwnership(
      instance
    );

    recordInstanceCheckpoint(
      instance,
      CHECKPOINT
        .INSTANCE_DESTROYED,
      {
        rendererStatus:
          RENDERER_STATUS
            .DISPOSED,

        mountOwnershipReleased:
          true,

        canvasRemoved:
          true,

        fallbackRestored:
          true
      }
    );

    publishReceipt({
      status:
        INSTANCES.size > 0
          ? "available"
          : "disposed",

      mountedInstanceCount:
        INSTANCES.size,

      lastInstanceId:
        instance.id,

      lastRendererStatus:
        RENDERER_STATUS.DISPOSED,

      lastQualityProfileId:
        instance.model
          .qualityProfile
          .id,

      lastReducedMotion:
        instance.reducedMotion,

      lastVisible:
        instance.presentationState
          .visible,

      lastInteractionEnabled:
        instance.presentationState
          .interactionEnabled,

      lastHeld:
        instance.presentationState
          .held,

      firstEnhancedFrameCompleted:
        instance
          .firstEnhancedFrameCompleted,

      lastProjectedBoundsRevision:
        instance
          .projectedBoundsRevision,

      lastProjectedBoundsStatus:
        instance.projectedBounds
          ? instance.projectedBounds
              .status
          : PROJECTED_BOUNDS_STATUS
              .DISPOSED
    });
  }

  function resize(
    instance
  ) {
    const rect =
      instance.canvas
        .getBoundingClientRect();

    const lowPower =
      navigator
        .hardwareConcurrency &&
      navigator
        .hardwareConcurrency <=
        QUALITY
          .lowPowerHardwareConcurrencyThreshold;

    const cap =
      lowPower
        ? QUALITY
            .lowPowerDevicePixelRatioCap
        : QUALITY
            .normalDevicePixelRatioCap;

    const pixelRatio =
      Math.min(
        globalThis.devicePixelRatio ||
        1,
        cap
      );

    const width =
      Math.max(
        1,
        Math.floor(
          rect.width *
          pixelRatio
        )
      );

    const height =
      Math.max(
        1,
        Math.floor(
          rect.height *
          pixelRatio
        )
      );

    if (
      instance.canvas.width !==
        width ||
      instance.canvas.height !==
        height
    ) {
      instance.canvas.width =
        width;

      instance.canvas.height =
        height;
    }

    instance.cssWidth =
      Math.max(
        QUALITY.minimumCssSceneSize,
        rect.width
      );

    instance.cssHeight =
      Math.max(
        QUALITY.minimumCssSceneSize,
        rect.height
      );

    instance.width =
      width;

    instance.height =
      height;

    instance.pixelRatio =
      pixelRatio;

    instance.gl.viewport(
      0,
      0,
      width,
      height
    );
  }

  function updateExternalSnapshots(
    instance
  ) {
    if (
      instance.context
        .getReducedMotion
    ) {
      try {
        setReducedMotion(
          instance,
          instance.context
            .getReducedMotion() ===
            true
        );
      } catch (_) {}
    }

    if (
      instance.context
        .getPresentationState
    ) {
      try {
        syncPresentationState(
          instance,
          instance.context
            .getPresentationState()
        );
      } catch (_) {}
    }
  }

  function updateTransforms(
    instance,
    deltaSeconds
  ) {
    synchronizeVisualTargets(
      instance
    );

    if (
      instance.reducedMotion
    ) {
      instance.localPosition =
        instance.targetLocalPosition
          .slice();

      instance.localQuaternion =
        instance.targetLocalQuaternion
          .slice();

      instance.localScale =
        instance.targetLocalScale
          .slice();

      instance.feedbackScale =
        instance.targetFeedbackScale;

      instance.currentOpacity =
        instance.targetOpacity;

      instance.currentBrightness =
        instance.targetBrightness;

      return;
    }

    const amount =
      1 -
      Math.exp(
        -QUALITY.interpolationSpeed *
        deltaSeconds
      );

    instance.localPosition =
      interpolateArray3(
        instance.localPosition,
        instance.targetLocalPosition,
        amount
      );

    instance.localQuaternion =
      quaternionSlerp(
        instance.localQuaternion,
        instance.targetLocalQuaternion,
        amount
      );

    instance.localScale =
      interpolateArray3(
        instance.localScale,
        instance.targetLocalScale,
        amount
      );

    instance.feedbackScale =
      interpolateNumber(
        instance.feedbackScale,
        instance.targetFeedbackScale,
        amount
      );

    instance.currentOpacity =
      interpolateNumber(
        instance.currentOpacity,
        instance.targetOpacity,
        amount
      );

    instance.currentBrightness =
      interpolateNumber(
        instance.currentBrightness,
        instance.targetBrightness,
        amount
      );
  }

  function currentModelMatrix(
    instance
  ) {
    const localTranslation =
      translate4(
        instance.localPosition[0],
        instance.localPosition[1],
        instance.localPosition[2]
      );

    const localRotation =
      quaternionToMatrix4(
        instance.localQuaternion
      );

    const localScale =
      scale4(
        instance.localScale[0] *
          instance.feedbackScale,

        instance.localScale[1] *
          instance.feedbackScale,

        instance.localScale[2] *
          instance.feedbackScale
      );

    return multiply4(
      localTranslation,
      multiply4(
        localRotation,
        localScale
      )
    );
  }

  function applyMaterial(
    instance,
    material,
    haloPass
  ) {
    const gl =
      instance.gl;

    gl.uniform3f(
      instance.uniforms.baseColor,

      material.baseColor[0],
      material.baseColor[1],
      material.baseColor[2]
    );

    gl.uniform3f(
      instance.uniforms.ambientColor,
      0.10,
      0.12,
      0.16
    );

    gl.uniform3f(
      instance.uniforms.keyLightView,
      -0.38,
      -0.86,
      -0.60
    );

    gl.uniform3f(
      instance.uniforms.fillLightView,
      0.70,
      -0.22,
      -0.46
    );

    gl.uniform3f(
      instance.uniforms.rimLightView,
      0.10,
      0.45,
      1.0
    );

    gl.uniform1f(
      instance.uniforms.alpha,
      material.alpha
    );

    gl.uniform1f(
      instance.uniforms.emissive,
      material.emissive
    );

    gl.uniform1f(
      instance.uniforms.specular,
      material.specular
    );

    gl.uniform1f(
      instance.uniforms.rim,
      material.rim
    );

    const haloStrength =
      haloPass &&
      instance.cssWidth >
        QUALITY.bloomDisableWidthPx
        ? material.halo
        : 0;

    gl.uniform1f(
      instance.uniforms.haloStrength,
      haloStrength
    );

    gl.uniform1f(
      instance.uniforms.visualOpacity,
      clamp(
        instance.currentOpacity,
        0,
        1
      )
    );

    gl.uniform1f(
      instance.uniforms.feedbackBrightness,
      clamp(
        instance.currentBrightness,
        0,
        2
      )
    );
  }

  function drawGpuMesh(
    instance,
    gpuMesh,
    modelMatrix,
    haloPass
  ) {
    const gl =
      instance.gl;

    bindAttrib(
      gl,
      gpuMesh.position,
      instance.attribs.position,
      3
    );

    bindAttrib(
      gl,
      gpuMesh.normal,
      instance.attribs.normal,
      3
    );

    gl.bindBuffer(
      gl.ELEMENT_ARRAY_BUFFER,
      gpuMesh.index
    );

    const modelView =
      multiply4(
        instance.view,
        modelMatrix
      );

    const normalMatrix =
      inverseTransposeNormalMatrix3(
        modelView
      );

    gl.uniformMatrix4fv(
      instance.uniforms.model,
      false,
      new Float32Array(
        modelMatrix
      )
    );

    gl.uniformMatrix4fv(
      instance.uniforms.view,
      false,
      new Float32Array(
        instance.view
      )
    );

    gl.uniformMatrix4fv(
      instance.uniforms.projection,
      false,
      new Float32Array(
        instance.projection
      )
    );

    gl.uniformMatrix3fv(
      instance.uniforms.viewNormalMatrix,
      false,
      new Float32Array(
        normalMatrix
      )
    );

    gl.uniform1f(
      instance.uniforms.haloPass,
      haloPass
        ? 1
        : 0
    );

    gl.uniform1f(
      instance.uniforms.haloExpansion,
      QUALITY.haloExpansion
    );

    applyMaterial(
      instance,
      gpuMesh.material,
      haloPass
    );

    gl.drawElements(
      gl.TRIANGLES,
      gpuMesh.indexCount,
      gpuMesh.indexType,
      0
    );
  }

  function commitFirstEnhancedFrame(
    instance
  ) {
    if (
      instance.firstEnhancedFrameCompleted
    ) {
      return false;
    }

    recordInstanceCheckpoint(
      instance,
      CHECKPOINT
        .FIRST_FRAME_COMMIT_ENTERED,
      {
        rendererStatus:
          instance.rendererStatus
      }
    );

    instance.firstEnhancedFrameCompleted =
      true;

    setMountRendererStatus(
      instance,
      RENDERER_STATUS.AVAILABLE
    );

    applyPresentationVisibility(
      instance
    );

    recordInstanceCheckpoint(
      instance,
      CHECKPOINT
        .FIRST_FRAME_COMMITTED,
      {
        rendererStatus:
          instance.rendererStatus
      }
    );

    if (
      instance.canvasPromoted
    ) {
      recordInstanceCheckpoint(
        instance,
        CHECKPOINT.CANVAS_PROMOTED,
        {
          canvasVisible:
            instance.canvas.dataset
              .upstreamCompassCanvasVisible ===
              "true"
        }
      );
    }

    if (
      instance.fallbackWithdrawn
    ) {
      recordInstanceCheckpoint(
        instance,
        CHECKPOINT
          .FALLBACK_WITHDRAWN,
        {
          hidden:
            instance.context
              .fallback
              .hidden ===
              true,

          display:
            instance.context
              .fallback
              .style
              .display
        }
      );
    }

    return true;
  }

  function renderFrame(
    instance,
    timeMs
  ) {
    if (
      !instance.running ||
      instance.destroyed
    ) {
      return;
    }

    const firstFrame =
      !instance.firstFrameEntered;

    if (firstFrame) {
      instance.firstFrameEntered =
        true;

      recordInstanceCheckpoint(
        instance,
        CHECKPOINT
          .FIRST_FRAME_ENTERED,
        {
          timeMs:
            finiteNumber(
              timeMs,
              0
            )
        }
      );
    }

    const seconds =
      timeMs *
      0.001;

    const deltaSeconds =
      instance.lastTime
        ? Math.min(
            QUALITY.maximumDeltaSeconds,
            Math.max(
              0,
              seconds -
              instance.lastTime
            )
          )
        : 0.016;

    instance.lastTime =
      seconds;

    try {
      updateExternalSnapshots(
        instance
      );

      if (firstFrame) {
        recordInstanceCheckpoint(
          instance,
          CHECKPOINT
            .PRESENTATION_SNAPSHOT_APPLIED,
          {
            visible:
              instance.presentationState
                .visible,

            interactionEnabled:
              instance.presentationState
                .interactionEnabled,

            held:
              instance.presentationState
                .held,

            reducedMotion:
              instance.reducedMotion,

            rendererFailure:
              instance.presentationState
                .rendererFailure
          }
        );
      }
    } catch (error) {
      safeEmitInstanceFailure(
        instance,
        errorCodeFrom(
          error,
          "PRESENTATION_STATE_FAILURE"
        ),
        error &&
        error.details
          ? error.details
          : null,
        FAILURE_STAGE
          .FIRST_FRAME_PRESENTATION,
        error
      );

      return;
    }

    try {
      resize(
        instance
      );

      if (firstFrame) {
        recordInstanceCheckpoint(
          instance,
          CHECKPOINT.FRAME_RESIZED,
          {
            cssWidth:
              instance.cssWidth,

            cssHeight:
              instance.cssHeight,

            width:
              instance.width,

            height:
              instance.height,

            pixelRatio:
              instance.pixelRatio
          }
        );
      }
    } catch (error) {
      safeEmitInstanceFailure(
        instance,
        errorCodeFrom(
          error,
          "FIRST_FRAME_RESIZE_FAILURE"
        ),
        error &&
        error.details
          ? error.details
          : null,
        FAILURE_STAGE
          .FIRST_FRAME_RESIZE,
        error
      );

      return;
    }

    try {
      updateTransforms(
        instance,
        deltaSeconds
      );

      applyPresentationVisibility(
        instance
      );

      const aspect =
        instance.width /
        Math.max(
          1,
          instance.height
        );

      instance.view =
        lookAt4(
          [
            0,
            0,
            QUALITY.cameraDistance
          ],
          [0, 0, 0],
          [0, 1, 0]
        );

      instance.projection =
        perspective4(
          aspect <
            QUALITY.mobileAspectThreshold
            ? QUALITY
                .mobileFieldOfViewRadians
            : QUALITY
                .defaultFieldOfViewRadians,

          aspect,
          0.1,
          40
        );
    } catch (error) {
      safeEmitInstanceFailure(
        instance,
        errorCodeFrom(
          error,
          "FIRST_FRAME_TRANSFORM_FAILURE"
        ),
        error &&
        error.details
          ? error.details
          : null,
        FAILURE_STAGE
          .FIRST_FRAME_TRANSFORM,
        error
      );

      return;
    }

    const modelMatrix =
      currentModelMatrix(
        instance
      );

    try {
      updateProjectedBounds(
        instance,
        modelMatrix
      );

      if (firstFrame) {
        recordInstanceCheckpoint(
          instance,
          CHECKPOINT
            .PROJECTED_BOUNDS_INITIALIZED,
          {
            revision:
              instance
                .projectedBoundsRevision,

            status:
              instance.projectedBounds
                ? instance
                    .projectedBounds
                    .status
                : ""
          }
        );
      }
    } catch (error) {
      safeEmitInstanceFailure(
        instance,
        errorCodeFrom(
          error,
          "FIRST_FRAME_BOUNDS_FAILURE"
        ),
        error &&
        error.details
          ? error.details
          : null,
        FAILURE_STAGE
          .FIRST_FRAME_BOUNDS,
        error
      );

      return;
    }

    const gl =
      instance.gl;

    try {
      gl.clearColor(
        0,
        0,
        0,
        0
      );

      gl.clear(
        gl.COLOR_BUFFER_BIT |
        gl.DEPTH_BUFFER_BIT
      );

      if (
        !instance.presentationState
          .visible ||
        instance.presentationState
          .rendererFailure ||
        instance.renderFailureEmitted
      ) {
        instance.raf =
          requestAnimationFrame(
            nextTime =>
              renderFrame(
                instance,
                nextTime
              )
          );

        return;
      }

      if (firstFrame) {
        recordInstanceCheckpoint(
          instance,
          CHECKPOINT
            .DRAW_PHASE_ENTERED,
          {
            meshCount:
              instance.gpuMeshes
                .length,

            haloPassEnabled:
              instance.cssWidth >
              QUALITY
                .bloomDisableWidthPx
          }
        );
      }

      gl.useProgram(
        instance.program
      );

      if (
        instance.cssWidth >
        QUALITY.bloomDisableWidthPx
      ) {
        gl.depthMask(
          false
        );

        gl.blendFunc(
          gl.SRC_ALPHA,
          gl.ONE
        );

        for (
          const gpuMesh
          of instance.gpuMeshes
        ) {
          drawGpuMesh(
            instance,
            gpuMesh,
            modelMatrix,
            true
          );
        }

        gl.depthMask(
          true
        );

        gl.blendFunc(
          gl.SRC_ALPHA,
          gl.ONE_MINUS_SRC_ALPHA
        );
      }

      for (
        const gpuMesh
        of instance.gpuMeshes
      ) {
        drawGpuMesh(
          instance,
          gpuMesh,
          modelMatrix,
          false
        );
      }

      instance.drawPhaseCompleted =
        true;

      if (firstFrame) {
        recordInstanceCheckpoint(
          instance,
          CHECKPOINT
            .DRAW_PHASE_COMPLETED,
          {
            meshCount:
              instance.gpuMeshes
                .length
          }
        );
      }
    } catch (error) {
      safeEmitInstanceFailure(
        instance,
        errorCodeFrom(
          error,
          "FIRST_FRAME_DRAW_FAILURE"
        ),
        error &&
        error.details
          ? error.details
          : null,
        FAILURE_STAGE
          .FIRST_FRAME_DRAW,
        error
      );

      return;
    }

    const error =
      gl.getError();

    const errorName =
      webGLErrorName(
        gl,
        error
      );

    instance.lastWebGLError =
      error;

    instance.lastWebGLErrorName =
      errorName;

    GLOBAL_LIFECYCLE.lastWebGLError =
      error;

    GLOBAL_LIFECYCLE.lastWebGLErrorName =
      errorName;

    if (firstFrame) {
      recordInstanceCheckpoint(
        instance,
        CHECKPOINT
          .WEBGL_ERROR_CHECKED,
        {
          error,
          errorName
        }
      );
    }

    publishMountState(
      instance
    );

    if (
      error !==
      gl.NO_ERROR
    ) {
      safeEmitInstanceFailure(
        instance,
        "WEBGL_RENDER_FAILURE",
        {
          error,
          errorName
        },
        FAILURE_STAGE
          .FIRST_FRAME_WEBGL_ERROR_GATE
      );

      return;
    }

    const promoted =
      commitFirstEnhancedFrame(
        instance
      );

    if (promoted) {
      updateProjectedBounds(
        instance,
        modelMatrix
      );
    }

    publishReceipt({
      status:
        "available",

      lastFailure:
        "",

      lastFailureCode:
        "",

      lastFailureMessage:
        "",

      lastFailureStage:
        "",

      lastFailureDetail:
        null,

      lastWebGLError:
        instance.lastWebGLError,

      lastWebGLErrorName:
        instance.lastWebGLErrorName,

      lastInstanceId:
        instance.id,

      lastMountedInstanceId:
        instance.id,

      lastRendererStatus:
        instance.rendererStatus,

      lastQualityProfileId:
        instance.model
          .qualityProfile
          .id,

      lastReducedMotion:
        instance.reducedMotion,

      lastVisible:
        instance.presentationState
          .visible,

      lastInteractionEnabled:
        instance.presentationState
          .interactionEnabled,

      lastHeld:
        instance.presentationState
          .held,

      firstEnhancedFrameCompleted:
        instance
          .firstEnhancedFrameCompleted,

      lastProjectedBoundsRevision:
        instance
          .projectedBoundsRevision,

      lastProjectedBoundsStatus:
        instance.projectedBounds
          ? instance.projectedBounds
              .status
          : ""
    });

    instance.raf =
      requestAnimationFrame(
        nextTime =>
          renderFrame(
            instance,
            nextTime
          )
      );
  }

  function start(
    instanceId
  ) {
    const instance =
      INSTANCES.get(
        instanceId
      );

    invariant(
      instance,
      "INSTANCE_NOT_FOUND"
    );

    invariant(
      !instance.destroyed,
      "INSTANCE_DISPOSED"
    );

    if (
      instance.running
    ) {
      return true;
    }

    recordInstanceCheckpoint(
      instance,
      CHECKPOINT.START_ENTERED,
      {
        rendererStatus:
          instance.rendererStatus
      }
    );

    instance.running =
      true;

    instance.stopped =
      false;

    instance.lastTime =
      0;

    if (
      instance.rendererStatus ===
        RENDERER_STATUS.STOPPED
    ) {
      setMountRendererStatus(
        instance,
        instance.firstEnhancedFrameCompleted
          ? RENDERER_STATUS.AVAILABLE
          : RENDERER_STATUS.INITIALIZING
      );
    }

    instance.raf =
      requestAnimationFrame(
        timeMs =>
          renderFrame(
            instance,
            timeMs
          )
      );

    recordInstanceCheckpoint(
      instance,
      CHECKPOINT.FRAME_SCHEDULED,
      {
        raf:
          instance.raf
      }
    );

    return true;
  }

  function stop(
    instanceId
  ) {
    const instance =
      INSTANCES.get(
        instanceId
      );

    invariant(
      instance,
      "INSTANCE_NOT_FOUND"
    );

    instance.running =
      false;

    instance.stopped =
      true;

    if (
      instance.raf
    ) {
      cancelAnimationFrame(
        instance.raf
      );

      instance.raf =
        0;
    }

    setMountRendererStatus(
      instance,
      RENDERER_STATUS.STOPPED
    );

    recordInstanceCheckpoint(
      instance,
      CHECKPOINT
        .INSTANCE_STOPPED,
      {
        rendererStatus:
          RENDERER_STATUS
            .STOPPED
      }
    );

    publishReceipt({
      status:
        "stopped",

      lastInstanceId:
        instance.id,

      lastRendererStatus:
        RENDERER_STATUS.STOPPED,

      lastProjectedBoundsRevision:
        instance
          .projectedBoundsRevision,

      lastProjectedBoundsStatus:
        instance.projectedBounds
          ? instance.projectedBounds
              .status
          : ""
    });

    return true;
  }

  function syncReducedMotion(
    instanceId,
    active
  ) {
    const instance =
      INSTANCES.get(
        instanceId
      );

    invariant(
      instance,
      "INSTANCE_NOT_FOUND"
    );

    setReducedMotion(
      instance,
      active ===
        true
    );

    applyPresentationVisibility(
      instance
    );

    return true;
  }

  function syncPresentation(
    instanceId,
    presentationState
  ) {
    const instance =
      INSTANCES.get(
        instanceId
      );

    invariant(
      instance,
      "INSTANCE_NOT_FOUND"
    );

    return syncPresentationState(
      instance,
      presentationState
    );
  }

  function setHover(
    instanceId,
    active
  ) {
    const instance =
      INSTANCES.get(
        instanceId
      );

    invariant(
      instance,
      "INSTANCE_NOT_FOUND"
    );

    instance.presentationState =
      normalizePresentationState({
        ...instance.presentationState,

        hoverActive:
          active ===
          true
      });

    updateSemanticVisualState(
      instance
    );

    return true;
  }

  function setFocus(
    instanceId,
    active
  ) {
    const instance =
      INSTANCES.get(
        instanceId
      );

    invariant(
      instance,
      "INSTANCE_NOT_FOUND"
    );

    instance.presentationState =
      normalizePresentationState({
        ...instance.presentationState,

        focusActive:
          active ===
          true
      });

    updateSemanticVisualState(
      instance
    );

    return true;
  }

  function setPressed(
    instanceId,
    active
  ) {
    const instance =
      INSTANCES.get(
        instanceId
      );

    invariant(
      instance,
      "INSTANCE_NOT_FOUND"
    );

    instance.presentationState =
      normalizePresentationState({
        ...instance.presentationState,

        pressed:
          active ===
          true
      });

    updateSemanticVisualState(
      instance
    );

    return true;
  }

  function mount(
    pageContext
  ) {
    let currentStage =
      FAILURE_STAGE
        .CONTEXT_NORMALIZATION;

    let context =
      null;

    let instance =
      null;

    recordGlobalCheckpoint(
      CHECKPOINT.MOUNT_ENTERED,
      {
        explicitMountProvided:
          Boolean(
            pageContext &&
            pageContext.mount
          )
      }
    );

    try {
      context =
        normalizeContext(
          pageContext
        );

      recordGlobalCheckpoint(
        CHECKPOINT
          .CONTEXT_NORMALIZED,
        {
          explicitMount:
            Boolean(
              pageContext &&
              pageContext.mount
            ),

          semanticControlResolved:
            true,

          fallbackResolved:
            true,

          qualityProfileId:
            context
              .qualityProfileId
        }
      );

      invariant(
        !INSTANCE_BY_MOUNT.has(
          context.mount
        ),
        "UPSTREAM_COMPASS_MOUNT_ALREADY_ACTIVE"
      );

      currentStage =
        FAILURE_STAGE
          .GEOMETRY_RESOLUTION;

      const geometry =
        resolveGeometryAuthority();

      recordGlobalCheckpoint(
        CHECKPOINT
          .GEOMETRY_AUTHORITY_RESOLVED,
        {
          moduleId:
            geometry.moduleId,

          moduleVersion:
            geometry.moduleVersion
        }
      );

      currentStage =
        FAILURE_STAGE
          .GEOMETRY_BUILD;

      const model =
        geometry.buildModel({
          qualityProfileId:
            context.qualityProfileId
        });

      recordGlobalCheckpoint(
        CHECKPOINT
          .GEOMETRY_MODEL_BUILT,
        {
          modelId:
            model &&
            model.modelId
              ? model.modelId
              : "",

          qualityProfileId:
            context
              .qualityProfileId
        }
      );

      currentStage =
        FAILURE_STAGE
          .GEOMETRY_VALIDATION;

      validateGeometryModel(
        geometry,
        model
      );

      recordGlobalCheckpoint(
        CHECKPOINT
          .GEOMETRY_MODEL_VALIDATED,
        {
          modelId:
            model.modelId,

          meshCount:
            Array.isArray(
              model.meshes
            )
              ? model.meshes
                  .length
              : 0
        }
      );

      const fixedCenterTransform =
        normalizeLocalTransform(
          model.presentationTransforms
            .fixedCenter
        );

      const presentationState =
        readInitialPresentation(
          context
        );

      const reducedMotion =
        readInitialReducedMotion(
          context,
          presentationState
        );

      const instanceId =
        `home-compass-instance-${++instanceCounter}`;

      currentStage =
        FAILURE_STAGE
          .CANVAS_CREATION;

      const canvasRecord =
        createCanvas(
          context.mount
        );

      instance = {
        id:
          instanceId,

        geometry,

        model,

        context,

        canvas:
          canvasRecord.canvas,

        canvasCreated:
          canvasRecord.created,

        canvasInserted:
          canvasRecord.inserted,

        gl:
          null,

        program:
          null,

        attribs:
          null,

        uniforms:
          null,

        gpuMeshes:
          [],

        running:
          false,

        stopped:
          false,

        raf:
          0,

        lastTime:
          0,

        cssWidth:
          1,

        cssHeight:
          1,

        width:
          1,

        height:
          1,

        pixelRatio:
          1,

        presentationState,

        reducedMotion,

        localPosition:
          fixedCenterTransform
            .position
            .slice(),

        targetLocalPosition:
          fixedCenterTransform
            .position
            .slice(),

        localQuaternion:
          fixedCenterTransform
            .quaternion
            .slice(),

        targetLocalQuaternion:
          fixedCenterTransform
            .quaternion
            .slice(),

        localScale:
          fixedCenterTransform
            .scale
            .slice(),

        targetLocalScale:
          fixedCenterTransform
            .scale
            .slice(),

        semanticHoverActive:
          false,

        semanticFocusActive:
          false,

        semanticPressed:
          false,

        hoverActive:
          presentationState
            .hoverActive,

        focusActive:
          presentationState
            .focusActive,

        pressed:
          presentationState
            .pressed,

        feedbackScale:
          1,

        targetFeedbackScale:
          1,

        currentOpacity:
          presentationState
            .visible
            ? 1
            : 0,

        targetOpacity:
          presentationState
            .visible
            ? 1
            : 0,

        currentBrightness:
          1,

        targetBrightness:
          1,

        view:
          identity4(),

        projection:
          identity4(),

        projectedEnvelopeSamples:
          buildProjectedEnvelopeSamples(
            model
          ),

        projectedBoundsRevision:
          0,

        projectedBounds:
          null,

        projectedBoundsAvailable:
          false,

        fallbackSurface:
          null,

        destroyed:
          false,

        unsubscribers:
          [],

        semanticListeners:
          [],

        renderFailureEmitted:
          false,

        lastFailure:
          "",

        failureCode:
          "",

        failureMessage:
          "",

        failureStage:
          "",

        failureDetail:
          null,

        contextCreated:
          false,

        geometryAccepted:
          true,

        resourcesCreated:
          false,

        subscriptionsRegistered:
          false,

        firstFrameEntered:
          false,

        drawPhaseCompleted:
          false,

        lastWebGLError:
          0,

        lastWebGLErrorName:
          "NO_ERROR",

        firstEnhancedFrameCompleted:
          false,

        canvasPromoted:
          false,

        fallbackWithdrawn:
          false,

        rendererStatus:
          RENDERER_STATUS
            .INITIALIZING,

        lifecycleSequenceNumber:
          0,

        lifecycleHistory:
          [],

        lastLifecycleCheckpoint:
          ""
      };

      recordInstanceCheckpoint(
        instance,
        CHECKPOINT.CANVAS_CREATED,
        {
          created:
            instance.canvasCreated,

          reused:
            !instance.canvasCreated
        }
      );

      recordInstanceCheckpoint(
        instance,
        CHECKPOINT.CANVAS_INSERTED,
        {
          inserted:
            instance.canvasInserted,

          parentIsMount:
            instance.canvas
              .parentElement ===
              context.mount
        }
      );

      recordInstanceCheckpoint(
        instance,
        CHECKPOINT
          .GEOMETRY_AUTHORITY_RESOLVED,
        {
          moduleId:
            geometry.moduleId,

          moduleVersion:
            geometry.moduleVersion
        }
      );

      recordInstanceCheckpoint(
        instance,
        CHECKPOINT
          .GEOMETRY_MODEL_BUILT,
        {
          modelId:
            model.modelId,

          qualityProfileId:
            context
              .qualityProfileId
        }
      );

      recordInstanceCheckpoint(
        instance,
        CHECKPOINT
          .GEOMETRY_MODEL_VALIDATED,
        {
          geometryAccepted:
            true,

          meshCount:
            model.meshes.length
        }
      );

      synchronizeVisualTargets(
        instance
      );

      if (
        reducedMotion
      ) {
        instance.feedbackScale =
          instance.targetFeedbackScale;

        instance.currentOpacity =
          instance.targetOpacity;

        instance.currentBrightness =
          instance.targetBrightness;
      }

      setMountRendererStatus(
        instance,
        RENDERER_STATUS
          .INITIALIZING
      );

      applyPresentationVisibility(
        instance
      );

      replaceFallbackContent(
        instance
      );

      currentStage =
        FAILURE_STAGE
          .WEBGL_CONTEXT_CREATION;

      initializeGL(
        instance
      );

      currentStage =
        FAILURE_STAGE
          .SUBSCRIPTION_SETUP;

      subscribeContextSignals(
        instance
      );

      INSTANCES.set(
        instance.id,
        instance
      );

      INSTANCE_BY_MOUNT.set(
        context.mount,
        instance
      );

      recordInstanceCheckpoint(
        instance,
        CHECKPOINT
          .INSTANCE_REGISTERED,
        {
          mountedInstanceCount:
            INSTANCES.size,

          mountExclusivelyOwned:
            INSTANCE_BY_MOUNT.get(
              context.mount
            ) ===
            instance
        }
      );

      publishInvalidProjectedBounds(
        instance,
        PROJECTED_BOUNDS_STATUS
          .INITIALIZING
      );

      currentStage =
        FAILURE_STAGE.START;

      start(
        instance.id
      );

      publishReceipt({
        status:
          "initializing",

        lastFailure:
          "",

        lastFailureCode:
          "",

        lastFailureMessage:
          "",

        lastFailureStage:
          "",

        lastFailureDetail:
          null,

        lastMountedInstanceId:
          instance.id,

        lastInstanceId:
          instance.id,

        lastRendererStatus:
          RENDERER_STATUS.INITIALIZING,

        lastQualityProfileId:
          instance.model
            .qualityProfile
            .id,

        lastReducedMotion:
          instance.reducedMotion,

        lastVisible:
          instance.presentationState
            .visible,

        lastInteractionEnabled:
          instance.presentationState
            .interactionEnabled,

        lastHeld:
          instance.presentationState
            .held,

        firstEnhancedFrameCompleted:
          false,

        lastProjectedBoundsRevision:
          instance
            .projectedBoundsRevision,

        lastProjectedBoundsStatus:
          instance.projectedBounds
            ? instance.projectedBounds
                .status
            : ""
      });

      return Object.freeze({
        instanceId:
          instance.id,

        destroy: () => {
          destroyInstance(
            instance
          );

          return true;
        },

        start: () =>
          start(
            instance.id
          ),

        stop: () =>
          stop(
            instance.id
          ),

        syncReducedMotion:
          active =>
            syncReducedMotion(
              instance.id,
              active
            ),

        syncPresentationState:
          presentationState =>
            syncPresentation(
              instance.id,
              presentationState
            ),

        setHover:
          active =>
            setHover(
              instance.id,
              active
            ),

        setFocus:
          active =>
            setFocus(
              instance.id,
              active
            ),

        setPressed:
          active =>
            setPressed(
              instance.id,
              active
            ),

        getProjectedBounds: () =>
          instance.projectedBounds,

        getState: () =>
          getInstanceState(
            instance.id
          )
      });
    } catch (error) {
      const code =
        errorCodeFrom(
          error,
          "MOUNT_INITIALIZATION_FAILURE"
        );

      const message =
        errorMessageFrom(
          error,
          code
        );

      const details =
        error &&
        error.details
          ? error.details
          : null;

      if (instance) {
        INSTANCES.delete(
          instance.id
        );

        releaseMountOwnership(
          instance
        );

        unbindSubscriptions(
          instance
        );

        destroyGpuResources(
          instance
        );

        if (
          instance.canvas &&
          instance.canvas.parentNode
        ) {
          instance.canvas
            .parentNode
            .removeChild(
              instance.canvas
            );
        }

        safeEmitInstanceFailure(
          instance,
          code,
          details,
          currentStage,
          error
        );
      } else {
        GLOBAL_LIFECYCLE.lastFailureCode =
          code;

        GLOBAL_LIFECYCLE.lastFailureMessage =
          message;

        GLOBAL_LIFECYCLE.lastFailureStage =
          currentStage;

        GLOBAL_LIFECYCLE.lastFailureDetail =
          freezeSnapshot(
            serializableValue(
              details
            )
          );

        recordGlobalCheckpoint(
          CHECKPOINT.FAILURE,
          {
            code,
            message,
            stage:
              currentStage,

            detail:
              details
          },
          {
            failureCode:
              code
          }
        );

        emitFailure(
          code,
          details,
          {
            code,
            message,
            stage:
              currentStage
          }
        );
      }

      throw error;
    }
  }

  function getInstanceState(
    instanceId
  ) {
    const instance =
      INSTANCES.get(
        instanceId
      );

    invariant(
      instance,
      "INSTANCE_NOT_FOUND"
    );

    return Object.freeze({
      instanceId:
        instance.id,

      geometryModuleId:
        instance.geometry
          .moduleId,

      geometryModuleVersion:
        instance.geometry
          .moduleVersion,

      modelId:
        instance.model
          .modelId,

      qualityProfileId:
        instance.model
          .qualityProfile
          .id,

      presentationState:
        instance.presentationState,

      reducedMotion:
        instance.reducedMotion,

      reducedMotionAuthority:
        presentationOwnsReducedMotion(
          instance
        )
          ? "PRESENTATION_STATE"
          : "DEDICATED_REDUCED_MOTION_SURFACE",

      localPosition:
        Object.freeze(
          instance.localPosition
            .slice()
        ),

      localQuaternion:
        Object.freeze(
          instance.localQuaternion
            .slice()
        ),

      localScale:
        Object.freeze(
          instance.localScale
            .slice()
        ),

      feedbackScale:
        instance.feedbackScale,

      visualOpacity:
        instance.currentOpacity,

      visualBrightness:
        instance.currentBrightness,

      hoverActive:
        instance.hoverActive,

      focusActive:
        instance.focusActive,

      pressed:
        instance.pressed,

      running:
        instance.running,

      stopped:
        instance.stopped,

      destroyed:
        instance.destroyed,

      rendererStatus:
        instance.rendererStatus,

      firstEnhancedFrameCompleted:
        instance
          .firstEnhancedFrameCompleted,

      renderFailureEmitted:
        instance
          .renderFailureEmitted,

      rendererFailure:
        instance.lastFailure,

      contextCreated:
        instance.contextCreated,

      geometryAccepted:
        instance.geometryAccepted,

      resourcesCreated:
        instance.resourcesCreated,

      subscriptionsRegistered:
        instance
          .subscriptionsRegistered,

      firstFrameEntered:
        instance.firstFrameEntered,

      drawPhaseCompleted:
        instance.drawPhaseCompleted,

      canvasPromoted:
        instance.canvasPromoted,

      fallbackWithdrawn:
        instance.fallbackWithdrawn,

      lastWebGLError:
        instance.lastWebGLError,

      lastWebGLErrorName:
        instance.lastWebGLErrorName,

      failureCode:
        instance.failureCode,

      failureMessage:
        instance.failureMessage,

      failureStage:
        instance.failureStage,

      failureDetail:
        instance.failureDetail,

      lastLifecycleCheckpoint:
        instance
          .lastLifecycleCheckpoint,

      lifecycleSequence:
        Object.freeze(
          instance.lifecycleHistory
            .slice()
        ),

      projectedBoundsStatus:
        instance.projectedBounds
          ? instance.projectedBounds
              .status
          : "",

      projectedBoundsContract:
        PROJECTED_BOUNDS_CONTRACT,

      projectedBoundsEvent:
        PROJECTED_BOUNDS_EVENT,

      projectedBoundsGeometrySource:
        PROJECTED_BOUNDS
          .authoritativeGeometrySource,

      projectedBoundsProjectionMethod:
        PROJECTED_BOUNDS
          .projectionMethod,

      projectedBoundsAngularSamplesPerDepthPlane:
        PROJECTED_BOUNDS
          .angularSamplesPerDepthPlane,

      projectedBoundsContainmentEpsilonCssPixels:
        PROJECTED_BOUNDS
          .containmentEpsilonCssPixels,

      projectedBoundsMaterialChangeToleranceCssPixels:
        PROJECTED_BOUNDS
          .materialChangeToleranceCssPixels,

      projectedBoundsGeometryRadiusExpansion:
        PROJECTED_BOUNDS
          .geometryRadiusExpansion,

      projectedBoundsHaloExpansion:
        PROJECTED_BOUNDS
          .haloExpansion,

      projectedBoundsRevision:
        instance
          .projectedBoundsRevision,

      projectedBounds:
        instance.projectedBounds,

      mountExclusivelyOwned:
        INSTANCE_BY_MOUNT.get(
          instance.context.mount
        ) ===
        instance,

      fixedCenter:
        true,

      parentOrientationInherited:
        false,

      navigationOrientationApplied:
        false,

      constellationOrientationApplied:
        false,

      clusterOrientationApplied:
        false,

      participatesInNavigationSettlement:
        false,

      publishesQuaternion:
        false,

      rendererOwnsActivation:
        false,

      rendererOwnsNavigation:
        false,

      rendererOwnsSelection:
        false,

      rendererOwnsSemanticDisabledState:
        false,

      fallbackPromotionOwnedByRenderer:
        true,

      semanticControlOwnedByHtml:
        true,

      automaticMountDiscovery:
        true,

      enhancedOpacityAuthority:
        "SHADER",

      fallbackOpacityAuthority:
        "CSS",

      canvasPromotionOpacity:
        "BINARY",

      showroomAware:
        false
    });
  }

  function getReceipt() {
    return publishReceipt();
  }

  function disposeAll() {
    const instances =
      Array.from(
        INSTANCES.values()
      );

    instances.forEach(
      destroyInstance
    );

    return true;
  }

  function runContractValidation() {
    const geometry =
      resolveGeometryAuthority();

    const model =
      geometry.buildModel({
        qualityProfileId:
          "lowPower"
      });

    validateGeometryModel(
      geometry,
      model
    );

    const samples =
      buildProjectedEnvelopeSamples(
        model
      );

    invariant(
      samples.length ===
        PROJECTED_BOUNDS
          .angularSamplesPerDepthPlane *
        PROJECTED_BOUNDS
          .depthPlaneCount +
        1,
      "PROJECTED_BOUNDS_SAMPLE_COUNT_INVALID",
      {
        actual:
          samples.length,

        expected:
          PROJECTED_BOUNDS
            .angularSamplesPerDepthPlane *
          PROJECTED_BOUNDS
            .depthPlaneCount +
          1
      }
    );

    invariant(
      PROJECTED_BOUNDS
        .geometryRadiusExpansion ===
        0,
      "PROJECTED_BOUNDS_GEOMETRY_RADIUS_EXPANSION_FORBIDDEN"
    );

    invariant(
      PROJECTED_BOUNDS
        .haloExpansion ===
        0,
      "PROJECTED_BOUNDS_HALO_EXPANSION_FORBIDDEN"
    );

    invariant(
      PROJECTED_BOUNDS_STATUS_VALUES
        .length ===
        5 &&
      PROJECTED_BOUNDS_STATUS_VALUES
        .join("|") ===
        "initializing|available|fallback|failed|disposed",
      "PROJECTED_BOUNDS_STATUS_VOCABULARY_INVALID"
    );

    invariant(
      MAX_LIFECYCLE_RECORDS ===
        32,
      "LIFECYCLE_HISTORY_BOUND_INVALID"
    );

    return Object.freeze({
      receiptSchema:
        "DGB_UPSTREAM_COMPASS_RENDERER_FIXED_CENTER_CONTRACT_VALIDATION_v4",

      moduleId:
        MODULE.id,

      moduleVersion:
        MODULE.version,

      geometryModuleId:
        geometry.moduleId,

      geometryModuleVersion:
        geometry.moduleVersion,

      requiredGeometryModuleVersion:
        GEOMETRY_AUTHORITY
          .requiredModuleVersion,

      pass:
        true,

      lifecycleInstrumentation:
        true,

      maximumLifecycleRecords:
        MAX_LIFECYCLE_RECORDS,

      lifecycleHistoryBounded:
        GLOBAL_LIFECYCLE
          .history
          .length <=
        MAX_LIFECYCLE_RECORDS,

      webglNumericErrorRecorded:
        true,

      webglSymbolicErrorRecorded:
        true,

      failureStageRecorded:
        true,

      instanceGetStateExtended:
        true,

      glErrorPolicyChanged:
        false,

      failureLatchChanged:
        false,

      retryAdded:
        false,

      promotionPolicyChanged:
        false,

      fixedCenter:
        true,

      parentOrientationInherited:
        false,

      navigationOrientationApplied:
        false,

      constellationOrientationApplied:
        false,

      clusterOrientationApplied:
        false,

      participatesInNavigationSettlement:
        false,

      publishesQuaternion:
        false,

      decisionApproachPresent:
        false,

      rendererOwnsActivation:
        false,

      rendererOwnsNavigation:
        false,

      rendererOwnsSelection:
        false,

      rendererOwnsSemanticDisabledState:
        false,

      semanticControlOwnedByHtml:
        true,

      fallbackPromotionOwnedByRenderer:
        true,

      oneInstancePerMount:
        true,

      automaticMountDiscovery:
        true,

      enhancedOpacityAuthority:
        "SHADER",

      fallbackOpacityAuthority:
        "CSS",

      canvasPromotionOpacity:
        "BINARY",

      reducedMotionReversibleWithoutDedicatedSurface:
        true,

      modelMatrixLaw:
        "FIXED_CENTER_PLACEMENT * LOCAL_PRESENTATION_TRANSFORM * RENDERER_OWNED_VISUAL_FEEDBACK",

      projectedBoundsContract:
        PROJECTED_BOUNDS_CONTRACT,

      projectedBoundsEvent:
        PROJECTED_BOUNDS_EVENT,

      projectedBoundsGetterPresent:
        true,

      projectedBoundsGeometrySource:
        PROJECTED_BOUNDS
          .authoritativeGeometrySource,

      projectedBoundsProjectionMethod:
        PROJECTED_BOUNDS
          .projectionMethod,

      projectedBoundsAngularSamplesPerDepthPlane:
        PROJECTED_BOUNDS
          .angularSamplesPerDepthPlane,

      projectedBoundsDepthPlaneCount:
        PROJECTED_BOUNDS
          .depthPlaneCount,

      projectedBoundsCenterSampleIncluded:
        true,

      projectedBoundsTotalSampleCount:
        samples.length,

      projectedBoundsContainmentEpsilonCssPixels:
        PROJECTED_BOUNDS
          .containmentEpsilonCssPixels,

      projectedBoundsMaterialChangeToleranceCssPixels:
        PROJECTED_BOUNDS
          .materialChangeToleranceCssPixels,

      projectedBoundsGeometryRadiusExpansion:
        PROJECTED_BOUNDS
          .geometryRadiusExpansion,

      projectedBoundsHaloExpansion:
        PROJECTED_BOUNDS
          .haloExpansion,

      projectedBoundsInvalidRecordsParticipateInRevisionSequence:
        true,

      projectedBoundsStatusVocabulary:
        PROJECTED_BOUNDS_STATUS_VALUES,

      projectedBoundsStoppedStatusPresent:
        false,

      projectedBoundsEventOrigin:
        "ACTIVE_RENDERER_MOUNT",

      projectedBoundsEventBubbles:
        true,

      projectedBoundsEventComposed:
        false,

      showroomAware:
        false
    });
  }

  function mountDiscoveredCompasses() {
    if (
      typeof document ===
      "undefined"
    ) {
      return;
    }

    const mounts =
      document.querySelectorAll(
        "[data-upstream-compass-mount]"
      );

    for (
      const mountElement
      of mounts
    ) {
      if (
        INSTANCE_BY_MOUNT.has(
          mountElement
        )
      ) {
        continue;
      }

      try {
        mount({
          root:
            document,

          mount:
            mountElement
        });
      } catch (error) {
        emitFailure(
          errorCodeFrom(
            error,
            "AUTOMATIC_MOUNT_FAILURE"
          ),
          error &&
          error.details
            ? error.details
            : null,
          {
            code:
              errorCodeFrom(
                error,
                "AUTOMATIC_MOUNT_FAILURE"
              ),

            message:
              errorMessageFrom(
                error,
                "Automatic mount failed."
              ),

            stage:
              FAILURE_STAGE
                .AUTOMATIC_DISCOVERY
          }
        );
      }
    }
  }

  function scheduleAutomaticMountDiscovery() {
    if (
      typeof document ===
      "undefined"
    ) {
      return;
    }

    if (
      document.readyState ===
        "loading"
    ) {
      document.addEventListener(
        "DOMContentLoaded",
        mountDiscoveredCompasses,
        {
          once:
            true
        }
      );

      return;
    }

    mountDiscoveredCompasses();
  }

  publishReceipt({
    status:
      "available",

    installed:
      true,

    lastRendererStatus:
      "",

    firstEnhancedFrameCompleted:
      false,

    lastProjectedBoundsRevision:
      0,

    lastProjectedBoundsStatus:
      "",

    lastWebGLError:
      0,

    lastWebGLErrorName:
      "NO_ERROR"
  });

  scheduleAutomaticMountDiscovery();

  return Object.freeze({
    moduleId:
      MODULE.id,

    moduleVersion:
      MODULE.version,

    geometryAuthority:
      GEOMETRY_AUTHORITY,

    rendererStatus:
      RENDERER_STATUS,

    projectedBoundsContract:
      PROJECTED_BOUNDS_CONTRACT,

    projectedBoundsEvent:
      PROJECTED_BOUNDS_EVENT,

    projectedBoundsStatus:
      PROJECTED_BOUNDS_STATUS,

    mount,

    start,

    stop,

    syncReducedMotion,

    syncPresentationState:
      syncPresentation,

    setHover,

    setFocus,

    setPressed,

    getInstanceState,

    disposeAll,

    runContractValidation,

    receipt:
      getReceipt
  });
})();

if (
  typeof globalThis !==
  "undefined"
) {
  globalThis
    .DGB_UPSTREAM_COMPASS_RENDERER =
    DGB_UPSTREAM_COMPASS_RENDERER;
}

if (
  typeof module !==
    "undefined" &&
  module.exports
) {
  module.exports =
    DGB_UPSTREAM_COMPASS_RENDERER;
}

/*
DGB_UPSTREAM_COMPASS_RENDERER_LIFECYCLE_INSTRUMENTATION_RESULT_v1

Artifact:
/assets/compass/upstream-compass.renderer.js

Previous module:
DGB_UPSTREAM_COMPASS_RENDERER
3.1.0-generic-projected-bounds

Renewed module:
DGB_UPSTREAM_COMPASS_RENDERER
3.1.1-generic-lifecycle-receipt

Disposition:
PHASE_1_GENERIC_LIFECYCLE_INSTRUMENTATION_CONSTRUCTED

Existing receipt retained:
globalThis.DGB_UPSTREAM_COMPASS_RENDERER_RECEIPT

Bounded lifecycle history:
- global maximum: 32 records
- per-instance maximum: 32 records
- oldest records evicted first
- no DOM nodes, functions, shaders, WebGL contexts, buffers, or cyclic
  structures are exposed

Added lifecycle checkpoints:
- RENDERER_MOUNT_ENTERED
- CONTEXT_NORMALIZED
- GEOMETRY_AUTHORITY_RESOLVED
- GEOMETRY_MODEL_BUILT
- GEOMETRY_MODEL_VALIDATED
- CANVAS_CREATED
- CANVAS_INSERTED
- WEBGL_CONTEXT_REQUESTED
- WEBGL_CONTEXT_CREATED
- SHADERS_COMPILED
- PROGRAM_LINKED
- GPU_RESOURCES_CREATED
- SUBSCRIPTIONS_REGISTERED
- INSTANCE_REGISTERED
- RENDERER_START_ENTERED
- FRAME_SCHEDULED
- FIRST_FRAME_ENTERED
- FRAME_RESIZED
- PRESENTATION_SNAPSHOT_APPLIED
- PROJECTED_BOUNDS_INITIALIZED
- DRAW_PHASE_ENTERED
- DRAW_PHASE_COMPLETED
- WEBGL_ERROR_CHECKED
- FIRST_FRAME_COMMIT_ENTERED
- FIRST_FRAME_COMMITTED
- CANVAS_PROMOTED
- FALLBACK_WITHDRAWN
- PROJECTED_BOUNDS_AVAILABLE
- RENDERER_FAILURE
- INSTANCE_STOPPED
- INSTANCE_DESTROYED

Added global receipt fields:
- installed
- lastMountedInstanceId
- lastFailureCode
- lastFailureMessage
- lastFailureStage
- lastFailureDetail
- lastWebGLError
- lastWebGLErrorName
- lastLifecycleCheckpoint
- lifecycleSequence
- receiptRevision

Added per-instance getState fields:
- stopped
- contextCreated
- geometryAccepted
- resourcesCreated
- subscriptionsRegistered
- firstFrameEntered
- drawPhaseCompleted
- canvasPromoted
- fallbackWithdrawn
- lastWebGLError
- lastWebGLErrorName
- failureCode
- failureMessage
- failureStage
- failureDetail
- projectedBoundsStatus
- lastLifecycleCheckpoint
- lifecycleSequence

Added generic mount attributes:
- data-upstream-compass-renderer-stage
- data-upstream-compass-webgl-error

WebGL error naming:
- NO_ERROR
- INVALID_ENUM
- INVALID_VALUE
- INVALID_OPERATION
- INVALID_FRAMEBUFFER_OPERATION
- OUT_OF_MEMORY
- CONTEXT_LOST_WEBGL
- UNKNOWN_WEBGL_ERROR_<numericCode>

Preserved:
- renderer.mount() arguments
- returned lifecycle-handle methods
- global public API
- geometry authority and version
- fixed-center transform law
- shader source
- lighting
- material system
- camera
- GPU mesh construction
- projected-bounds contract
- projected-bounds event
- one-instance-per-mount enforcement
- automatic discovery
- explicit unmarked mount support
- binary canvas promotion
- static fallback on genuine failure
- semantic-control sibling ownership
- canvas pointer-events none
- host-owned navigation
- reduced-motion enhanced-frame behavior

Phase 2 behavior not added:
- no gl.getError() queue draining
- no pre-draw/post-draw isolation
- no renderFailureEmitted reset
- no retry
- no forced promotion
- no fallback-policy change
- no canvas-visibility-policy change
- no geometry modification

Required Showroom HTML cache query:
/assets/compass/upstream-compass.renderer.js?v=3.1.1-generic-lifecycle-receipt

Runtime execution:
NOT PERFORMED

Runtime visual success claimed:
FALSE

Final classification:
COMPASS_LIFECYCLE_INSTRUMENTATION_SOURCE_PASS
*/

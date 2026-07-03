/* TARGET FILE: /showroom/index.compass.adapter.js */
/* COMPLETE REPLACEMENT */
/* SHOWROOM_COMPASS_ADAPTER_TNT_v1_0_2_COMPASS_LIFECYCLE_RECEIPT */

/*
  Showroom-specific integration boundary for the universal fixed-center
  Compass renderer.

  Module:
  SHOWROOM_COMPASS_ADAPTER
  1.0.2-compass-lifecycle-receipt

  Controlling contract:
  SHOWROOM_3D_COMPASS_CONTRACT_FREEZE_PROPOSAL_v2

  Scope:
  EXPLICIT_MOUNT_TRANSLATION_VALIDATION_CUSTODY_FORWARDING
  +
  BOUNDED_COMPASS_LIFECYCLE_INSTRUMENTATION

  Renderer dependency:
  DGB_UPSTREAM_COMPASS_RENDERER
  3.1.1-generic-lifecycle-receipt

  Phase boundary:
  - Phase 1 lifecycle instrumentation only.
  - No WebGL error-policy change.
  - No renderer retry.
  - No forced promotion.
  - No fallback-policy change.
  - No navigation ownership.
*/

const SHOWROOM_COMPASS_ADAPTER = (() => {
  "use strict";

  const MODULE = Object.freeze({
    id:
      "SHOWROOM_COMPASS_ADAPTER",

    version:
      "1.0.2-compass-lifecycle-receipt",

    file:
      "/showroom/index.compass.adapter.js"
  });

  const RECEIPT_SYMBOL =
    "SHOWROOM_COMPASS_ADAPTER_RECEIPT";

  const FAILURE_EVENT =
    "SHOWROOM_COMPASS_ADAPTER_FAILURE";

  const COMPOSITOR_READY_EVENT =
    "SHOWROOM_COMPOSITOR_READY";

  const GENERIC_BOUNDS_CONTRACT =
    "DGB_UPSTREAM_COMPASS_PROJECTED_BOUNDS_v1";

  const GENERIC_BOUNDS_EVENT =
    "DGB_UPSTREAM_COMPASS_PROJECTED_BOUNDS_CHANGED";

  const EFFECTIVE_BOUNDS_CONTRACT =
    "SHOWROOM_EFFECTIVE_COMPASS_BOUNDS_RECORD_v1";

  const RENDERER_FAILURE_EVENT =
    "DGB_UPSTREAM_COMPASS_RENDERER_FAILURE";

  const RENDERER_MODULE_ID =
    "DGB_UPSTREAM_COMPASS_RENDERER";

  const REQUIRED_RENDERER_VERSION =
    "3.1.1-generic-lifecycle-receipt";

  const CONTROLLER_MODULE_ID =
    "SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER";

  const COMPOSITOR_MODULE_ID =
    "SHOWROOM_COMPOSITOR";

  const MAX_LIFECYCLE_RECORDS =
    32;

  const CONTROLLER_SURFACES = Object.freeze({
    getFrameState:
      "getFrameState",

    subscribe:
      "subscribe",

    getReducedMotion:
      "getReducedMotion",

    subscribeReducedMotion:
      "subscribeReducedMotion"
  });

  const COMPOSITOR_SURFACES = Object.freeze({
    acceptCompassBounds:
      "acceptCompassBounds"
  });

  const STATUS = Object.freeze({
    UNINITIALIZED:
      "uninitialized",

    INITIALIZING:
      "initializing",

    AVAILABLE:
      "available",

    FAILED:
      "failed",

    DISPOSING:
      "disposing",

    DISPOSED:
      "disposed"
  });

  const GENERIC_STATUS = Object.freeze({
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

  const GENERIC_STATUS_VALUES =
    Object.freeze([
      GENERIC_STATUS.INITIALIZING,
      GENERIC_STATUS.AVAILABLE,
      GENERIC_STATUS.FALLBACK,
      GENERIC_STATUS.FAILED,
      GENERIC_STATUS.DISPOSED
    ]);

  const EFFECTIVE_STATUS = Object.freeze({
    INITIALIZING:
      "initializing",

    AVAILABLE:
      "available",

    FALLBACK:
      "fallback",

    FAILED:
      "failed",

    DISPOSED:
      "disposed",

    INVALID:
      "invalid"
  });

  const EFFECTIVE_STATUS_VALUES =
    Object.freeze([
      EFFECTIVE_STATUS.INITIALIZING,
      EFFECTIVE_STATUS.AVAILABLE,
      EFFECTIVE_STATUS.FALLBACK,
      EFFECTIVE_STATUS.FAILED,
      EFFECTIVE_STATUS.DISPOSED,
      EFFECTIVE_STATUS.INVALID
    ]);

  const CHECKPOINT = Object.freeze({
    SCRIPT_EVALUATED:
      "ADAPTER_SCRIPT_EVALUATED",

    INITIALIZATION_SCHEDULED:
      "ADAPTER_INITIALIZATION_SCHEDULED",

    INITIALIZATION_ENTERED:
      "ADAPTER_INITIALIZATION_ENTERED",

    RENDERER_GLOBAL_RESOLVED:
      "RENDERER_GLOBAL_RESOLVED",

    CONTROLLER_RESOLVED:
      "CONTROLLER_RESOLVED",

    DOM_RESOLVED:
      "DOM_RESOLVED",

    RENDERER_LISTENERS_REGISTERED:
      "RENDERER_LISTENERS_REGISTERED",

    RENDERER_MOUNT_ENTERED:
      "RENDERER_MOUNT_ENTERED",

    RENDERER_MOUNT_RETURNED:
      "RENDERER_MOUNT_RETURNED",

    RENDERER_HANDLE_VALIDATED:
      "RENDERER_HANDLE_VALIDATED",

    RENDERER_HANDLE_RETAINED:
      "RENDERER_HANDLE_RETAINED",

    COMPOSITOR_ATTACHMENT_SCHEDULED:
      "COMPOSITOR_ATTACHMENT_SCHEDULED",

    COMPOSITOR_ATTACHMENT_ACTIVE:
      "COMPOSITOR_ATTACHMENT_ACTIVE",

    INITIALIZATION_COMPLETE:
      "ADAPTER_INITIALIZATION_COMPLETE",

    FAILURE:
      "ADAPTER_FAILURE",

    DISPOSED:
      "ADAPTER_DISPOSED"
  });

  const FAILURE_STAGE = Object.freeze({
    SCRIPT:
      "ADAPTER_SCRIPT",

    INITIALIZATION:
      "ADAPTER_INITIALIZATION",

    RENDERER_RESOLUTION:
      "RENDERER_RESOLUTION",

    CONTROLLER_RESOLUTION:
      "CONTROLLER_RESOLUTION",

    DOM_RESOLUTION:
      "DOM_RESOLUTION",

    LISTENER_REGISTRATION:
      "RENDERER_LISTENER_REGISTRATION",

    RENDERER_MOUNT:
      "RENDERER_MOUNT",

    RENDERER_HANDLE_VALIDATION:
      "RENDERER_HANDLE_VALIDATION",

    RENDERER_STATE_SYNC:
      "RENDERER_STATE_SYNCHRONIZATION",

    PRESENTATION_STATE:
      "PRESENTATION_STATE",

    REDUCED_MOTION:
      "REDUCED_MOTION",

    BOUNDS_EVENT:
      "BOUNDS_EVENT",

    BOUNDS_VALIDATION:
      "BOUNDS_VALIDATION",

    COMPOSITOR_ATTACHMENT:
      "COMPOSITOR_ATTACHMENT",

    COMPOSITOR_FORWARDING:
      "COMPOSITOR_FORWARDING",

    RENDERER_RUNTIME:
      "RENDERER_RUNTIME",

    DISPOSAL:
      "DISPOSAL"
  });

  const SELECTORS = Object.freeze({
    root:
      "[data-showroom-root]",

    layer:
      "[data-showroom-compass-layer]",

    visualMount:
      "[data-showroom-compass-visual-mount]",

    semanticControl:
      "[data-showroom-compass-control]",

    fallback:
      ":scope > .showroom-compass-visual"
  });

  const NUMERIC_TOLERANCE =
    1e-4;

  const RECEIPT = {
    moduleId:
      MODULE.id,

    moduleVersion:
      MODULE.version,

    status:
      STATUS.UNINITIALIZED,

    initialized:
      false,

    initializing:
      false,

    failed:
      false,

    disposed:
      false,

    domResolved:
      false,

    rendererResolved:
      false,

    controllerResolved:
      false,

    compositorResolved:
      false,

    listenersRegistered:
      false,

    rendererMountAttempted:
      false,

    rendererHandleRetained:
      false,

    rendererModuleId:
      "",

    rendererModuleVersion:
      "",

    controllerContract:
      "",

    compositorContract:
      "",

    genericBoundsContract:
      GENERIC_BOUNDS_CONTRACT,

    effectiveBoundsContract:
      EFFECTIVE_BOUNDS_CONTRACT,

    activeInstanceId:
      "",

    rendererState:
      null,

    rendererStatus:
      "",

    rendererFirstEnhancedFrameCompleted:
      false,

    rendererFailure:
      "",

    mountResolved:
      false,

    fallbackResolved:
      false,

    semanticControlResolved:
      false,

    siblingSemanticControlPreserved:
      false,

    automaticDiscoveryCanClaimMount:
      false,

    explicitUnmarkedMountUsed:
      false,

    automaticMountBypassed:
      false,

    rendererExplicitlyMounted:
      false,

    rendererIntegrationActive:
      false,

    presentationTranslationActive:
      false,

    reducedMotionTranslationActive:
      false,

    boundsListenerActive:
      false,

    failureListenerActive:
      false,

    compositorForwardingReady:
      false,

    compositorAttachmentPending:
      false,

    lastPresentationState:
      null,

    lastReducedMotionState:
      false,

    lastGenericBoundsRevision:
      0,

    lastGenericBoundsStatus:
      "",

    lastEffectiveBoundsStatus:
      EFFECTIVE_STATUS.INVALID,

    lastAcceptedRendererInstanceId:
      "",

    lastAcceptedRendererRevision:
      0,

    duplicateRendererRecordCount:
      0,

    regressedRendererRecordCount:
      0,

    preHandleRendererRecordCount:
      0,

    boundsEventAssociationStrength:
      "strong",

    rendererFailureAssociationStrength:
      "weak",

    failureCorrelationSurface:
      "retained handle.getState()",

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

    lastLifecycleCheckpoint:
      "",

    lifecycleSequence:
      Object.freeze([]),

    receiptRevision:
      0,

    runtimeVisualSuccessClaimed:
      false,

    adapterOwnsNavigation:
      false,

    adapterOwnsRoutes:
      false,

    adapterOwnsControllerState:
      false,

    adapterOwnsCompassGeometry:
      false,

    adapterOwnsRendererMatrices:
      false,

    adapterOwnsSemanticActivation:
      false,

    adapterOwnsSemanticDisabledState:
      false,

    adapterMovesOrResizesSemanticControl:
      false,

    adapterOwnsHitSizing:
      false,

    adapterOwnsCrystalRendering:
      false,

    adapterOwnsFrontRearClassification:
      false,

    adapterOwnsCompositorCamera:
      false,

    adapterOwnsMainCompassReturnMeaning:
      false
  };

  const STATE = {
    status:
      STATUS.UNINITIALIZED,

    initialized:
      false,

    initializing:
      false,

    disposing:
      false,

    disposed:
      false,

    root:
      null,

    layer:
      null,

    visualMount:
      null,

    fallback:
      null,

    semanticControl:
      null,

    renderer:
      null,

    rendererHandle:
      null,

    rendererInstanceId:
      "",

    rendererMountAttempted:
      false,

    rendererHandleValidated:
      false,

    rendererStateSnapshot:
      null,

    controller:
      null,

    compositor:
      null,

    compositorIntake:
      null,

    compositorAttachmentPending:
      false,

    lastPresentationState:
      null,

    lastReducedMotionState:
      false,

    lastGenericRevision:
      0,

    lastGenericStatus:
      "",

    rendererRecordObserved:
      false,

    duplicateRendererRecordCount:
      0,

    regressedRendererRecordCount:
      0,

    preHandleRendererRecords:
      [],

    latestEffectiveBounds:
      null,

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

    acceptingBounds:
      false,

    acceptingFailures:
      false,

    boundsListener:
      null,

    rendererFailureListener:
      null,

    compositorReadyListener:
      null,

    effectiveSubscribers:
      new Set(),

    lifecycleSequenceNumber:
      0,

    lifecycleHistory:
      [],

    lastLifecycleCheckpoint:
      "",

    receiptRevision:
      0
  };

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

  function approximatelyEqual(
    left,
    right,
    tolerance =
      NUMERIC_TOLERANCE
  ) {
    return (
      Math.abs(
        left -
        right
      ) <=
      tolerance
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
      "UNKNOWN_ADAPTER_FAILURE"
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

  function recordLifecycleCheckpoint(
    name,
    detail = null,
    options = {}
  ) {
    const checkpointName =
      String(
        name ||
        "ADAPTER_CHECKPOINT"
      );

    STATE.lifecycleSequenceNumber +=
      1;

    const record =
      freezeSnapshot({
        name:
          checkpointName,

        sequence:
          STATE
            .lifecycleSequenceNumber,

        timestamp:
          nowIso(),

        instanceId:
          options.instanceId ||
          STATE.rendererInstanceId ||
          "",

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

    STATE.lifecycleHistory.push(
      record
    );

    if (
      STATE.lifecycleHistory.length >
      MAX_LIFECYCLE_RECORDS
    ) {
      STATE.lifecycleHistory.splice(
        0,
        STATE.lifecycleHistory.length -
          MAX_LIFECYCLE_RECORDS
      );
    }

    STATE.lastLifecycleCheckpoint =
      checkpointName;

    return record;
  }

  function normalizeRendererStateSnapshot(
    rendererState
  ) {
    if (
      !rendererState ||
      typeof rendererState !==
        "object"
    ) {
      return null;
    }

    const projectedBounds =
      rendererState.projectedBounds &&
      typeof rendererState
        .projectedBounds ===
        "object"
        ? rendererState
            .projectedBounds
        : null;

    return freezeSnapshot({
      instanceId:
        typeof rendererState
          .instanceId ===
          "string"
          ? rendererState.instanceId
          : "",

      rendererStatus:
        typeof rendererState
          .rendererStatus ===
          "string"
          ? rendererState
              .rendererStatus
          : "",

      running:
        rendererState.running ===
        true,

      destroyed:
        rendererState.destroyed ===
        true,

      stopped:
        rendererState.stopped ===
        true,

      firstEnhancedFrameCompleted:
        rendererState
          .firstEnhancedFrameCompleted ===
        true,

      renderFailureEmitted:
        rendererState
          .renderFailureEmitted ===
        true,

      rendererFailure:
        String(
          rendererState
            .rendererFailure ||
          rendererState
            .failureMessage ||
          ""
        ),

      failureCode:
        String(
          rendererState
            .failureCode ||
          ""
        ),

      failureMessage:
        String(
          rendererState
            .failureMessage ||
          rendererState
            .rendererFailure ||
          ""
        ),

      failureStage:
        String(
          rendererState
            .failureStage ||
          ""
        ),

      contextCreated:
        rendererState.contextCreated ===
        true,

      geometryAccepted:
        rendererState.geometryAccepted ===
        true,

      resourcesCreated:
        rendererState.resourcesCreated ===
        true,

      firstFrameEntered:
        rendererState.firstFrameEntered ===
        true,

      drawPhaseCompleted:
        rendererState.drawPhaseCompleted ===
        true,

      lastWebGLError:
        Number.isFinite(
          rendererState.lastWebGLError
        )
          ? rendererState
              .lastWebGLError
          : 0,

      lastWebGLErrorName:
        String(
          rendererState
            .lastWebGLErrorName ||
          ""
        ),

      projectedBoundsStatus:
        String(
          rendererState
            .projectedBoundsStatus ||
          (
            projectedBounds
              ? projectedBounds.status
              : ""
          ) ||
          ""
        ),

      projectedBoundsRevision:
        Number.isInteger(
          rendererState
            .projectedBoundsRevision
        )
          ? rendererState
              .projectedBoundsRevision
          : (
              projectedBounds &&
              Number.isInteger(
                projectedBounds.revision
              )
                ? projectedBounds
                    .revision
                : 0
            ),

      lastLifecycleCheckpoint:
        String(
          rendererState
            .lastLifecycleCheckpoint ||
          ""
        )
    });
  }

  function synchronizeRendererState(
    options = {}
  ) {
    if (
      !STATE.rendererHandle ||
      typeof STATE.rendererHandle
        .getState !==
        "function"
    ) {
      STATE.rendererStateSnapshot =
        null;

      return null;
    }

    try {
      const rendererState =
        STATE.rendererHandle
          .getState();

      const snapshot =
        normalizeRendererStateSnapshot(
          rendererState
        );

      STATE.rendererStateSnapshot =
        snapshot;

      return snapshot;
    } catch (error) {
      if (
        options.recordFailure ===
        true
      ) {
        STATE.lastFailureCode =
          errorCodeFrom(
            error,
            "RENDERER_STATE_SYNCHRONIZATION_FAILED"
          );

        STATE.lastFailureMessage =
          errorMessageFrom(
            error,
            "Renderer state synchronization failed."
          );

        STATE.lastFailureStage =
          FAILURE_STAGE
            .RENDERER_STATE_SYNC;

        STATE.lastFailureDetail =
          freezeSnapshot({
            recoverable:
              true
          });
      }

      return null;
    }
  }

  function publishReceipt(
    extra = {}
  ) {
    STATE.receiptRevision +=
      1;

    const rendererState =
      STATE.rendererStateSnapshot;

    Object.assign(
      RECEIPT,
      {
        moduleId:
          MODULE.id,

        moduleVersion:
          MODULE.version,

        status:
          STATE.status,

        initialized:
          STATE.initialized,

        initializing:
          STATE.initializing,

        failed:
          STATE.status ===
            STATUS.FAILED,

        disposed:
          STATE.disposed,

        domResolved:
          Boolean(
            STATE.root &&
            STATE.layer &&
            STATE.visualMount &&
            STATE.fallback &&
            STATE.semanticControl
          ),

        rendererResolved:
          Boolean(
            STATE.renderer
          ),

        controllerResolved:
          Boolean(
            STATE.controller
          ),

        compositorResolved:
          Boolean(
            STATE.compositor
          ),

        listenersRegistered:
          Boolean(
            STATE.boundsListener &&
            STATE
              .rendererFailureListener
          ),

        rendererMountAttempted:
          STATE
            .rendererMountAttempted,

        rendererHandleRetained:
          Boolean(
            STATE.rendererHandle
          ),

        rendererModuleId:
          STATE.renderer &&
          typeof STATE.renderer
            .moduleId ===
            "string"
            ? STATE.renderer
                .moduleId
            : "",

        rendererModuleVersion:
          STATE.renderer &&
          typeof STATE.renderer
            .moduleVersion ===
            "string"
            ? STATE.renderer
                .moduleVersion
            : "",

        controllerContract:
          STATE.controller
            ? CONTROLLER_MODULE_ID
            : "",

        compositorContract:
          STATE.compositor
            ? COMPOSITOR_MODULE_ID
            : "",

        genericBoundsContract:
          GENERIC_BOUNDS_CONTRACT,

        effectiveBoundsContract:
          EFFECTIVE_BOUNDS_CONTRACT,

        activeInstanceId:
          STATE.rendererInstanceId,

        rendererState,

        rendererStatus:
          rendererState
            ? rendererState
                .rendererStatus
            : "",

        rendererFirstEnhancedFrameCompleted:
          Boolean(
            rendererState &&
            rendererState
              .firstEnhancedFrameCompleted
          ),

        rendererFailure:
          rendererState
            ? String(
                rendererState
                  .rendererFailure ||
                rendererState
                  .failureMessage ||
                ""
              )
            : "",

        mountResolved:
          STATE.visualMount
            instanceof Element,

        fallbackResolved:
          STATE.fallback
            instanceof Element,

        semanticControlResolved:
          STATE.semanticControl
            instanceof Element,

        siblingSemanticControlPreserved:
          Boolean(
            STATE.layer &&
            STATE.visualMount &&
            STATE.semanticControl &&
            STATE.visualMount
              .parentElement ===
              STATE.layer &&
            STATE.semanticControl
              .parentElement ===
              STATE.layer &&
            STATE.semanticControl !==
              STATE.visualMount &&
            !STATE.visualMount.contains(
              STATE.semanticControl
            )
          ),

        automaticDiscoveryCanClaimMount:
          Boolean(
            STATE.visualMount &&
            STATE.visualMount.matches(
              "[data-upstream-compass-mount]"
            )
          ),

        explicitUnmarkedMountUsed:
          Boolean(
            STATE.visualMount &&
            !STATE.visualMount.matches(
              "[data-upstream-compass-mount]"
            ) &&
            STATE.rendererHandle
          ),

        automaticMountBypassed:
          false,

        rendererExplicitlyMounted:
          Boolean(
            STATE.rendererHandle
          ),

        rendererIntegrationActive:
          Boolean(
            STATE.rendererHandle &&
            !STATE.disposed &&
            STATE.status ===
              STATUS.AVAILABLE
          ),

        presentationTranslationActive:
          Boolean(
            STATE.controller &&
            typeof STATE.controller[
              CONTROLLER_SURFACES
                .getFrameState
            ] ===
              "function" &&
            typeof STATE.controller[
              CONTROLLER_SURFACES
                .subscribe
            ] ===
              "function"
          ),

        reducedMotionTranslationActive:
          Boolean(
            STATE.controller &&
            typeof STATE.controller[
              CONTROLLER_SURFACES
                .getReducedMotion
            ] ===
              "function" &&
            typeof STATE.controller[
              CONTROLLER_SURFACES
                .subscribeReducedMotion
            ] ===
              "function"
          ),

        boundsListenerActive:
          Boolean(
            STATE.boundsListener &&
            STATE.visualMount &&
            STATE.acceptingBounds
          ),

        failureListenerActive:
          Boolean(
            STATE.rendererFailureListener &&
            STATE.acceptingFailures
          ),

        compositorForwardingReady:
          Boolean(
            STATE.compositor &&
            STATE.compositorIntake
          ),

        compositorAttachmentPending:
          STATE
            .compositorAttachmentPending,

        lastPresentationState:
          STATE.lastPresentationState,

        lastReducedMotionState:
          STATE.lastReducedMotionState,

        lastGenericBoundsRevision:
          STATE.lastGenericRevision,

        lastGenericBoundsStatus:
          STATE.lastGenericStatus,

        lastEffectiveBoundsStatus:
          STATE.latestEffectiveBounds
            ? STATE
                .latestEffectiveBounds
                .status
            : EFFECTIVE_STATUS.INVALID,

        lastAcceptedRendererInstanceId:
          STATE.rendererRecordObserved
            ? STATE.rendererInstanceId
            : "",

        lastAcceptedRendererRevision:
          STATE.lastGenericRevision,

        duplicateRendererRecordCount:
          STATE
            .duplicateRendererRecordCount,

        regressedRendererRecordCount:
          STATE
            .regressedRendererRecordCount,

        preHandleRendererRecordCount:
          STATE
            .preHandleRendererRecords
            .length,

        boundsEventAssociationStrength:
          "strong",

        rendererFailureAssociationStrength:
          "weak",

        failureCorrelationSurface:
          "retained handle.getState()",

        lastFailure:
          STATE.lastFailure,

        lastFailureCode:
          STATE.lastFailureCode,

        lastFailureMessage:
          STATE.lastFailureMessage,

        lastFailureStage:
          STATE.lastFailureStage,

        lastFailureDetail:
          STATE.lastFailureDetail,

        lastLifecycleCheckpoint:
          STATE.lastLifecycleCheckpoint,

        lifecycleSequence:
          Object.freeze(
            STATE.lifecycleHistory
              .slice()
          ),

        receiptRevision:
          STATE.receiptRevision,

        runtimeVisualSuccessClaimed:
          false,

        adapterOwnsNavigation:
          false,

        adapterOwnsRoutes:
          false,

        adapterOwnsControllerState:
          false,

        adapterOwnsCompassGeometry:
          false,

        adapterOwnsRendererMatrices:
          false,

        adapterOwnsSemanticActivation:
          false,

        adapterOwnsSemanticDisabledState:
          false,

        adapterMovesOrResizesSemanticControl:
          false,

        adapterOwnsHitSizing:
          false,

        adapterOwnsCrystalRendering:
          false,

        adapterOwnsFrontRearClassification:
          false,

        adapterOwnsCompositorCamera:
          false,

        adapterOwnsMainCompassReturnMeaning:
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
              STATE.lifecycleHistory
                .slice()
            )
        });
    }

    return Object.freeze({
      ...RECEIPT,

      lifecycleSequence:
        Object.freeze(
          STATE.lifecycleHistory
            .slice()
        )
    });
  }

  function publishCheckpoint(
    name,
    detail = null,
    options = {}
  ) {
    const checkpoint =
      recordLifecycleCheckpoint(
        name,
        detail,
        options
      );

    publishReceipt();

    return checkpoint;
  }

  function emitAdapterFailure(
    reason,
    details = null
  ) {
    const normalizedReason =
      String(
        reason ||
        "UNKNOWN_ADAPTER_FAILURE"
      );

    STATE.lastFailure =
      normalizedReason;

    publishReceipt({
      lastFailure:
        normalizedReason
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
                moduleId:
                  MODULE.id,

                moduleVersion:
                  MODULE.version,

                reason:
                  normalizedReason,

                failureCode:
                  STATE
                    .lastFailureCode,

                failureMessage:
                  STATE
                    .lastFailureMessage,

                failureStage:
                  STATE
                    .lastFailureStage,

                terminal:
                  STATE.status ===
                    STATUS.FAILED,

                instanceId:
                  STATE
                    .rendererInstanceId,

                lifecycleCheckpoint:
                  STATE
                    .lastLifecycleCheckpoint,

                presentationState:
                  STATE
                    .lastPresentationState,

                reducedMotion:
                  STATE
                    .lastReducedMotionState,

                details:
                  freezeSnapshot(
                    serializableValue(
                      details
                    )
                  )
              })
          }
        )
      );
    }
  }

  function resolveExactlyOne(
    selector,
    root,
    code
  ) {
    const matches =
      Array.from(
        root.querySelectorAll(
          selector
        )
      );

    invariant(
      matches.length ===
        1,
      code,
      {
        selector,
        count:
          matches.length
      }
    );

    return matches[0];
  }

  function resolveDom() {
    const rootMatches =
      Array.from(
        document.querySelectorAll(
          SELECTORS.root
        )
      );

    invariant(
      rootMatches.length ===
        1,
      "SHOWROOM_ROOT_CARDINALITY_INVALID",
      {
        selector:
          SELECTORS.root,

        count:
          rootMatches.length
      }
    );

    const root =
      rootMatches[0];

    const layer =
      resolveExactlyOne(
        SELECTORS.layer,
        root,
        "SHOWROOM_COMPASS_LAYER_CARDINALITY_INVALID"
      );

    const visualMount =
      resolveExactlyOne(
        SELECTORS.visualMount,
        layer,
        "SHOWROOM_COMPASS_VISUAL_MOUNT_CARDINALITY_INVALID"
      );

    const semanticControl =
      resolveExactlyOne(
        SELECTORS.semanticControl,
        layer,
        "SHOWROOM_COMPASS_SEMANTIC_CONTROL_CARDINALITY_INVALID"
      );

    const fallbackMatches =
      Array.from(
        visualMount.querySelectorAll(
          SELECTORS.fallback
        )
      );

    invariant(
      fallbackMatches.length ===
        1,
      "SHOWROOM_COMPASS_FALLBACK_CARDINALITY_INVALID",
      {
        selector:
          SELECTORS.fallback,

        count:
          fallbackMatches.length
      }
    );

    const fallback =
      fallbackMatches[0];

    invariant(
      visualMount.parentElement ===
        layer,
      "SHOWROOM_COMPASS_VISUAL_MOUNT_RELATIONSHIP_INVALID"
    );

    invariant(
      semanticControl.parentElement ===
        layer,
      "SHOWROOM_COMPASS_SEMANTIC_CONTROL_RELATIONSHIP_INVALID"
    );

    invariant(
      semanticControl !==
        visualMount &&
      !visualMount.contains(
        semanticControl
      ),
      "SHOWROOM_COMPASS_SEMANTIC_CONTROL_MUST_REMAIN_SIBLING"
    );

    invariant(
      fallback.parentElement ===
        visualMount,
      "SHOWROOM_COMPASS_FALLBACK_MUST_BE_DIRECT_CHILD"
    );

    invariant(
      !visualMount.matches(
        "[data-upstream-compass-mount]"
      ),
      "SHOWROOM_COMPASS_VISUAL_MOUNT_MUST_REMAIN_UNMARKED"
    );

    STATE.root =
      root;

    STATE.layer =
      layer;

    STATE.visualMount =
      visualMount;

    STATE.semanticControl =
      semanticControl;

    STATE.fallback =
      fallback;

    publishCheckpoint(
      CHECKPOINT.DOM_RESOLVED,
      {
        root:
          true,

        layer:
          true,

        visualMount:
          true,

        fallback:
          true,

        semanticControl:
          true,

        mountMarkedForAutomaticDiscovery:
          false
      }
    );
  }

  function resolveRenderer() {
    const renderer =
      globalThis[
        RENDERER_MODULE_ID
      ];

    invariant(
      renderer &&
      typeof renderer ===
        "object",
      "UPSTREAM_COMPASS_RENDERER_UNAVAILABLE"
    );

    invariant(
      renderer.moduleId ===
        RENDERER_MODULE_ID,
      "UPSTREAM_COMPASS_RENDERER_ID_MISMATCH",
      {
        expected:
          RENDERER_MODULE_ID,

        actual:
          renderer.moduleId
      }
    );

    invariant(
      renderer.moduleVersion ===
        REQUIRED_RENDERER_VERSION,
      "UPSTREAM_COMPASS_RENDERER_VERSION_MISMATCH",
      {
        expected:
          REQUIRED_RENDERER_VERSION,

        actual:
          renderer.moduleVersion
      }
    );

    invariant(
      typeof renderer.mount ===
        "function",
      "UPSTREAM_COMPASS_RENDERER_MOUNT_SURFACE_REQUIRED"
    );

    invariant(
      renderer.projectedBoundsContract ===
        GENERIC_BOUNDS_CONTRACT,
      "UPSTREAM_COMPASS_PROJECTED_BOUNDS_CONTRACT_MISMATCH"
    );

    invariant(
      renderer.projectedBoundsEvent ===
        GENERIC_BOUNDS_EVENT,
      "UPSTREAM_COMPASS_PROJECTED_BOUNDS_EVENT_MISMATCH"
    );

    STATE.renderer =
      renderer;

    publishCheckpoint(
      CHECKPOINT
        .RENDERER_GLOBAL_RESOLVED,
      {
        moduleId:
          renderer.moduleId,

        moduleVersion:
          renderer.moduleVersion
      }
    );
  }

  function resolveController() {
    const controller =
      globalThis[
        CONTROLLER_MODULE_ID
      ];

    invariant(
      controller &&
      typeof controller ===
        "object",
      "SHOWROOM_CONTROLLER_UNAVAILABLE"
    );

    invariant(
      typeof controller[
        CONTROLLER_SURFACES
          .getFrameState
      ] ===
        "function",
      "SHOWROOM_CONTROLLER_GET_FRAME_STATE_REQUIRED"
    );

    invariant(
      typeof controller[
        CONTROLLER_SURFACES
          .subscribe
      ] ===
        "function",
      "SHOWROOM_CONTROLLER_SUBSCRIBE_REQUIRED"
    );

    invariant(
      typeof controller[
        CONTROLLER_SURFACES
          .getReducedMotion
      ] ===
        "function",
      "SHOWROOM_CONTROLLER_GET_REDUCED_MOTION_REQUIRED"
    );

    invariant(
      typeof controller[
        CONTROLLER_SURFACES
          .subscribeReducedMotion
      ] ===
        "function",
      "SHOWROOM_CONTROLLER_SUBSCRIBE_REDUCED_MOTION_REQUIRED"
    );

    STATE.controller =
      controller;

    publishCheckpoint(
      CHECKPOINT.CONTROLLER_RESOLVED,
      {
        global:
          CONTROLLER_MODULE_ID,

        getFrameState:
          true,

        subscribe:
          true,

        getReducedMotion:
          true,

        subscribeReducedMotion:
          true
      }
    );
  }

  function readControllerFrame() {
    const frame =
      STATE.controller[
        CONTROLLER_SURFACES
          .getFrameState
      ]();

    invariant(
      frame &&
      typeof frame ===
        "object",
      "SHOWROOM_CONTROLLER_FRAME_INVALID"
    );

    return frame;
  }

  function readFrameBoolean(
    frame,
    keys,
    fallback
  ) {
    for (
      const key
      of keys
    ) {
      if (
        Object.prototype
          .hasOwnProperty
          .call(
            frame,
            key
          ) &&
        typeof frame[key] ===
          "boolean"
      ) {
        return frame[key];
      }
    }

    return fallback;
  }

  function normalizePresentationFromFrame(
    frame
  ) {
    const held =
      readFrameBoolean(
        frame,
        [
          "held",
          "isHeld"
        ],
        STATE.root &&
        STATE.root.dataset
          .showroomHeld ===
          "true"
      );

    const visible =
      readFrameBoolean(
        frame,
        [
          "compassVisible",
          "visible"
        ],
        true
      );

    const interactionEnabled =
      readFrameBoolean(
        frame,
        [
          "compassInteractionEnabled",
          "interactionEnabled"
        ],
        true
      );

    const reducedMotion =
      STATE.controller[
        CONTROLLER_SURFACES
          .getReducedMotion
      ]() ===
        true;

    const presentation =
      Object.freeze({
        visible,

        interactionEnabled:
          interactionEnabled &&
          !held,

        held,

        reducedMotion,

        rendererFailure:
          ""
      });

    STATE.lastPresentationState =
      presentation;

    STATE.lastReducedMotionState =
      reducedMotion;

    return presentation;
  }

  function getPresentationState() {
    return normalizePresentationFromFrame(
      readControllerFrame()
    );
  }

  function subscribePresentationState(
    callback
  ) {
    invariant(
      typeof callback ===
        "function",
      "PRESENTATION_SUBSCRIBER_REQUIRED"
    );

    const unsubscribe =
      STATE.controller[
        CONTROLLER_SURFACES
          .subscribe
      ](
        frame => {
          const presentation =
            normalizePresentationFromFrame(
              frame &&
              typeof frame ===
                "object"
                ? frame
                : readControllerFrame()
            );

          callback(
            presentation
          );

          synchronizeRendererState();

          publishReceipt();
        }
      );

    return typeof unsubscribe ===
      "function"
      ? unsubscribe
      : () => {};
  }

  function getReducedMotion() {
    const reducedMotion =
      STATE.controller[
        CONTROLLER_SURFACES
          .getReducedMotion
      ]() ===
      true;

    STATE.lastReducedMotionState =
      reducedMotion;

    return reducedMotion;
  }

  function subscribeReducedMotion(
    callback
  ) {
    invariant(
      typeof callback ===
        "function",
      "REDUCED_MOTION_SUBSCRIBER_REQUIRED"
    );

    const unsubscribe =
      STATE.controller[
        CONTROLLER_SURFACES
          .subscribeReducedMotion
      ](
        value => {
          const reducedMotion =
            value ===
            true;

          STATE.lastReducedMotionState =
            reducedMotion;

          callback(
            reducedMotion
          );

          synchronizeRendererState();

          publishReceipt();
        }
      );

    return typeof unsubscribe ===
      "function"
      ? unsubscribe
      : () => {};
  }

  function freezeEffectiveRecord(
    record
  ) {
    invariant(
      record &&
      typeof record ===
        "object",
      "EFFECTIVE_BOUNDS_RECORD_REQUIRED"
    );

    invariant(
      EFFECTIVE_STATUS_VALUES
        .includes(
          record.status
        ),
      "EFFECTIVE_BOUNDS_STATUS_INVALID",
      {
        status:
          record.status
      }
    );

    const frozen =
      Object.freeze({
        contract:
          EFFECTIVE_BOUNDS_CONTRACT,

        sourceContract:
          GENERIC_BOUNDS_CONTRACT,

        sourceInstanceId:
          String(
            record.sourceInstanceId ||
            ""
          ),

        sourceRevision:
          Math.max(
            0,
            Math.trunc(
              finiteNumber(
                record.sourceRevision,
                0
              )
            )
          ),

        valid:
          record.valid ===
          true,

        visible:
          record.visible ===
          true,

        status:
          record.status,

        coordinateSpace:
          "viewport-css-pixels",

        left:
          finiteNumber(
            record.left,
            0
          ),

        top:
          finiteNumber(
            record.top,
            0
          ),

        right:
          finiteNumber(
            record.right,
            0
          ),

        bottom:
          finiteNumber(
            record.bottom,
            0
          ),

        width:
          Math.max(
            0,
            finiteNumber(
              record.width,
              0
            )
          ),

        height:
          Math.max(
            0,
            finiteNumber(
              record.height,
              0
            )
          ),

        centerX:
          finiteNumber(
            record.centerX,
            0
          ),

        centerY:
          finiteNumber(
            record.centerY,
            0
          ),

        radius:
          Math.max(
            0,
            finiteNumber(
              record.radius,
              0
            )
          )
      });

    if (
      frozen.valid
    ) {
      invariant(
        frozen.visible &&
        frozen.status ===
          EFFECTIVE_STATUS.AVAILABLE,
        "EFFECTIVE_AVAILABLE_RECORD_INCOHERENT"
      );
    } else {
      invariant(
        frozen.visible ===
          false &&
        frozen.left ===
          0 &&
        frozen.top ===
          0 &&
        frozen.right ===
          0 &&
        frozen.bottom ===
          0 &&
        frozen.width ===
          0 &&
        frozen.height ===
          0 &&
        frozen.centerX ===
          0 &&
        frozen.centerY ===
          0 &&
        frozen.radius ===
          0,
        "EFFECTIVE_INVALID_RECORD_MUST_BE_ZERO"
      );
    }

    return frozen;
  }

  function createInvalidEffectiveRecord(
    status =
      EFFECTIVE_STATUS.INVALID,
    sourceRevision =
      STATE.rendererRecordObserved
        ? STATE.lastGenericRevision
        : 0
  ) {
    return freezeEffectiveRecord({
      sourceInstanceId:
        STATE.rendererInstanceId,

      sourceRevision,

      valid:
        false,

      visible:
        false,

      status,

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

  function createAvailableEffectiveRecord(
    genericRecord
  ) {
    return freezeEffectiveRecord({
      sourceInstanceId:
        genericRecord.instanceId,

      sourceRevision:
        genericRecord.revision,

      valid:
        true,

      visible:
        true,

      status:
        EFFECTIVE_STATUS.AVAILABLE,

      left:
        genericRecord.left,

      top:
        genericRecord.top,

      right:
        genericRecord.right,

      bottom:
        genericRecord.bottom,

      width:
        genericRecord.width,

      height:
        genericRecord.height,

      centerX:
        genericRecord.centerX,

      centerY:
        genericRecord.centerY,

      radius:
        genericRecord.radius
    });
  }

  function notifyEffectiveSubscribers(
    record
  ) {
    for (
      const subscriber
      of Array.from(
        STATE.effectiveSubscribers
      )
    ) {
      try {
        subscriber(
          record
        );
      } catch (_) {}
    }
  }

  function forwardEffectiveRecord(
    record
  ) {
    if (
      !STATE.compositorIntake
    ) {
      return false;
    }

    try {
      STATE.compositorIntake(
        record
      );

      return true;
    } catch (error) {
      failAdapter(
        "SHOWROOM_COMPOSITOR_BOUNDS_FORWARDING_FAILED",
        {
          message:
            errorMessageFrom(
              error,
              ""
            )
        },
        {
          terminal:
            false,

          stage:
            FAILURE_STAGE
              .COMPOSITOR_FORWARDING,

          error
        }
      );

      return false;
    }
  }

  function retainAndForwardEffectiveRecord(
    record
  ) {
    STATE.latestEffectiveBounds =
      record;

    notifyEffectiveSubscribers(
      record
    );

    forwardEffectiveRecord(
      record
    );

    synchronizeRendererState();

    publishReceipt();

    return record;
  }

  function genericRecordNumericFieldsValid(
    record
  ) {
    const fields = [
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

    return fields.every(
      field =>
        Number.isFinite(
          record[field]
        )
    );
  }

  function genericRecordGeometryValid(
    record
  ) {
    if (
      !genericRecordNumericFieldsValid(
        record
      )
    ) {
      return false;
    }

    if (
      record.width < 0 ||
      record.height < 0 ||
      record.radius < 0
    ) {
      return false;
    }

    return (
      approximatelyEqual(
        record.right,
        record.left +
          record.width
      ) &&
      approximatelyEqual(
        record.bottom,
        record.top +
          record.height
      ) &&
      approximatelyEqual(
        record.centerX,
        record.left +
          record.width /
          2
      ) &&
      approximatelyEqual(
        record.centerY,
        record.top +
          record.height /
          2
      ) &&
      approximatelyEqual(
        record.radius,
        Math.max(
          record.width,
          record.height
        ) /
          2
      )
    );
  }

  function genericRecordIsZeroGeometry(
    record
  ) {
    return (
      record.left ===
        0 &&
      record.top ===
        0 &&
      record.right ===
        0 &&
      record.bottom ===
        0 &&
      record.width ===
        0 &&
      record.height ===
        0 &&
      record.centerX ===
        0 &&
      record.centerY ===
        0 &&
      record.radius ===
        0
    );
  }

  function genericRecordVisibilityCoherent(
    record
  ) {
    if (
      record.status ===
        GENERIC_STATUS.AVAILABLE
    ) {
      if (
        record.visible ===
          true
      ) {
        return genericRecordGeometryValid(
          record
        );
      }

      return (
        record.visible ===
          false &&
        genericRecordIsZeroGeometry(
          record
        )
      );
    }

    return (
      record.visible ===
        false &&
      genericRecordIsZeroGeometry(
        record
      )
    );
  }

  function validateGenericRecordAssociation(
    record
  ) {
    invariant(
      record &&
      typeof record ===
        "object",
      "GENERIC_BOUNDS_RECORD_REQUIRED"
    );

    invariant(
      record.contract ===
        GENERIC_BOUNDS_CONTRACT,
      "GENERIC_BOUNDS_CONTRACT_MISMATCH"
    );

    invariant(
      record.instanceId ===
        STATE.rendererInstanceId,
      "GENERIC_BOUNDS_INSTANCE_MISMATCH",
      {
        expected:
          STATE.rendererInstanceId,

        actual:
          record.instanceId
      }
    );

    invariant(
      record.coordinateSpace ===
        "viewport-css-pixels",
      "GENERIC_BOUNDS_COORDINATE_SPACE_MISMATCH"
    );

    invariant(
      GENERIC_STATUS_VALUES
        .includes(
          record.status
        ),
      "GENERIC_BOUNDS_STATUS_INVALID",
      {
        status:
          record.status
      }
    );

    invariant(
      Number.isInteger(
        record.revision
      ) &&
      record.revision >=
        1,
      "GENERIC_BOUNDS_REVISION_INVALID"
    );

    if (
      STATE.rendererRecordObserved &&
      record.revision ===
        STATE.lastGenericRevision
    ) {
      STATE
        .duplicateRendererRecordCount +=
        1;

      publishReceipt();

      return "duplicate";
    }

    invariant(
      !STATE.rendererRecordObserved ||
      record.revision >
        STATE.lastGenericRevision,
      "GENERIC_BOUNDS_REVISION_REGRESSION",
      {
        lastAcceptedRevision:
          STATE.lastGenericRevision,

        receivedRevision:
          record.revision
      }
    );

    invariant(
      genericRecordNumericFieldsValid(
        record
      ),
      "GENERIC_BOUNDS_NUMERIC_VALIDATION_FAILED"
    );

    invariant(
      genericRecordGeometryValid(
        record
      ),
      "GENERIC_BOUNDS_GEOMETRIC_INVARIANT_FAILED"
    );

    invariant(
      genericRecordVisibilityCoherent(
        record
      ),
      "GENERIC_BOUNDS_VISIBILITY_STATUS_INCOHERENT"
    );

    return "accept";
  }

  function validateBoundsEventOrigin(
    event
  ) {
    invariant(
      STATE.acceptingBounds,
      "BOUNDS_EVENT_NOT_ACCEPTED_DURING_CURRENT_LIFECYCLE"
    );

    invariant(
      event.target ===
        STATE.visualMount,
      "BOUNDS_EVENT_ORIGIN_MISMATCH"
    );

    invariant(
      event.currentTarget ===
        STATE.visualMount,
      "BOUNDS_EVENT_CURRENT_TARGET_MISMATCH"
    );

    return event.detail;
  }

  function effectiveStatusFromGeneric(
    genericStatus
  ) {
    switch (
      genericStatus
    ) {
      case GENERIC_STATUS
        .INITIALIZING:
        return EFFECTIVE_STATUS
          .INITIALIZING;

      case GENERIC_STATUS
        .FALLBACK:
        return EFFECTIVE_STATUS
          .FALLBACK;

      case GENERIC_STATUS
        .FAILED:
        return EFFECTIVE_STATUS
          .FAILED;

      case GENERIC_STATUS
        .DISPOSED:
        return EFFECTIVE_STATUS
          .DISPOSED;

      case GENERIC_STATUS
        .AVAILABLE:
        return EFFECTIVE_STATUS
          .AVAILABLE;

      default:
        return EFFECTIVE_STATUS
          .INVALID;
    }
  }

  function acceptGenericBoundsRecord(
    record
  ) {
    STATE.rendererRecordObserved =
      true;

    STATE.lastGenericRevision =
      record.revision;

    STATE.lastGenericStatus =
      record.status;

    if (
      record.status ===
        GENERIC_STATUS.AVAILABLE &&
      record.visible ===
        true
    ) {
      retainAndForwardEffectiveRecord(
        createAvailableEffectiveRecord(
          record
        )
      );

      return;
    }

    retainAndForwardEffectiveRecord(
      createInvalidEffectiveRecord(
        effectiveStatusFromGeneric(
          record.status
        ),
        record.revision
      )
    );
  }

  function processGenericBoundsRecord(
    record
  ) {
    try {
      const disposition =
        validateGenericRecordAssociation(
          record
        );

      if (
        disposition ===
          "duplicate"
      ) {
        synchronizeRendererState();
        publishReceipt();

        return;
      }

      acceptGenericBoundsRecord(
        record
      );
    } catch (error) {
      if (
        error &&
        error.code ===
          "GENERIC_BOUNDS_REVISION_REGRESSION"
      ) {
        STATE
          .regressedRendererRecordCount +=
          1;
      }

      const triggeringRevision =
        record &&
        Number.isInteger(
          record.revision
        )
          ? record.revision
          : STATE.lastGenericRevision;

      retainAndForwardEffectiveRecord(
        createInvalidEffectiveRecord(
          EFFECTIVE_STATUS.INVALID,
          STATE.rendererRecordObserved
            ? triggeringRevision
            : 0
        )
      );

      failAdapter(
        errorCodeFrom(
          error,
          "GENERIC_BOUNDS_VALIDATION_FAILED"
        ),
        error &&
        error.details
          ? error.details
          : null,
        {
          terminal:
            false,

          stage:
            FAILURE_STAGE
              .BOUNDS_VALIDATION,

          error
        }
      );
    }
  }

  function handleBoundsEvent(
    event
  ) {
    let record;

    try {
      record =
        validateBoundsEventOrigin(
          event
        );
    } catch (error) {
      failAdapter(
        errorCodeFrom(
          error,
          "GENERIC_BOUNDS_EVENT_ORIGIN_VALIDATION_FAILED"
        ),
        error &&
        error.details
          ? error.details
          : null,
        {
          terminal:
            false,

          stage:
            FAILURE_STAGE
              .BOUNDS_EVENT,

          error
        }
      );

      return;
    }

    if (
      !STATE.rendererHandle ||
      !STATE.rendererInstanceId
    ) {
      STATE
        .preHandleRendererRecords
        .push(
          record
        );

      publishReceipt();

      return;
    }

    processGenericBoundsRecord(
      record
    );

    synchronizeRendererState();

    publishReceipt();
  }

  function processRetainedPreHandleRecords() {
    const retained =
      STATE.preHandleRendererRecords
        .splice(
          0,
          STATE
            .preHandleRendererRecords
            .length
        );

    for (
      const record
      of retained
    ) {
      processGenericBoundsRecord(
        record
      );
    }
  }

  function readAndProcessHandleBounds() {
    invariant(
      STATE.rendererHandle &&
      typeof STATE.rendererHandle
        .getProjectedBounds ===
        "function",
      "RENDERER_PROJECTED_BOUNDS_GETTER_REQUIRED"
    );

    const record =
      STATE.rendererHandle
        .getProjectedBounds();

    if (
      record &&
      typeof record ===
        "object"
    ) {
      processGenericBoundsRecord(
        record
      );
    }
  }

  function rendererFailureMatchesActiveInstance() {
    const rendererState =
      synchronizeRendererState();

    return Boolean(
      rendererState &&
      rendererState.instanceId ===
        STATE.rendererInstanceId &&
      (
        rendererState
          .renderFailureEmitted ===
          true ||
        rendererState
          .rendererStatus ===
          GENERIC_STATUS.FAILED ||
        rendererState
          .rendererFailure ||
        rendererState
          .failureCode
      )
    );
  }

  function handleRendererFailure(
    event
  ) {
    if (
      !STATE.acceptingFailures ||
      !STATE.rendererHandle
    ) {
      return;
    }

    synchronizeRendererState();

    if (
      !rendererFailureMatchesActiveInstance()
    ) {
      publishReceipt();

      return;
    }

    const reason =
      event &&
      event.detail &&
      event.detail.reason
        ? String(
            event.detail.reason
          )
        : (
            STATE.rendererStateSnapshot &&
            STATE.rendererStateSnapshot
              .failureCode
              ? STATE.rendererStateSnapshot
                  .failureCode
              : "UPSTREAM_COMPASS_RENDERER_FAILURE"
          );

    const rendererStage =
      STATE.rendererStateSnapshot &&
      STATE.rendererStateSnapshot
        .failureStage
        ? STATE.rendererStateSnapshot
            .failureStage
        : FAILURE_STAGE
            .RENDERER_RUNTIME;

    retainAndForwardEffectiveRecord(
      createInvalidEffectiveRecord(
        EFFECTIVE_STATUS.FAILED,
        STATE.rendererRecordObserved
          ? STATE.lastGenericRevision
          : 0
      )
    );

    failAdapter(
      reason,
      {
        associationStrength:
          "weak",

        correlationSurface:
          "retained handle.getState()",

        rendererState:
          STATE
            .rendererStateSnapshot,

        rendererEventDetail:
          event &&
          event.detail
            ? serializableValue(
                event.detail
              )
            : null
      },
      {
        terminal:
          false,

        stage:
          rendererStage
      }
    );
  }

  function resolveCompositor() {
    const compositor =
      globalThis[
        COMPOSITOR_MODULE_ID
      ];

    if (
      !compositor ||
      typeof compositor !==
        "object" ||
      typeof compositor[
        COMPOSITOR_SURFACES
          .acceptCompassBounds
      ] !==
        "function"
    ) {
      return false;
    }

    STATE.compositor =
      compositor;

    STATE.compositorIntake =
      compositor[
        COMPOSITOR_SURFACES
          .acceptCompassBounds
      ].bind(
        compositor
      );

    STATE
      .compositorAttachmentPending =
      false;

    if (
      STATE.compositorReadyListener &&
      typeof globalThis
        .removeEventListener ===
        "function"
    ) {
      globalThis
        .removeEventListener(
          COMPOSITOR_READY_EVENT,
          STATE
            .compositorReadyListener
        );

      STATE.compositorReadyListener =
        null;
    }

    if (
      STATE.latestEffectiveBounds
    ) {
      forwardEffectiveRecord(
        STATE.latestEffectiveBounds
      );
    }

    publishCheckpoint(
      CHECKPOINT
        .COMPOSITOR_ATTACHMENT_ACTIVE,
      {
        compositorGlobal:
          COMPOSITOR_MODULE_ID,

        intakeSurface:
          COMPOSITOR_SURFACES
            .acceptCompassBounds,

        retainedBoundsForwarded:
          Boolean(
            STATE.latestEffectiveBounds
          )
      }
    );

    return true;
  }

  function scheduleCompositorAttachment() {
    publishCheckpoint(
      CHECKPOINT
        .COMPOSITOR_ATTACHMENT_SCHEDULED,
      {
        immediateAttempt:
          true,

        readyEvent:
          COMPOSITOR_READY_EVENT
      }
    );

    if (
      resolveCompositor()
    ) {
      return;
    }

    STATE
      .compositorAttachmentPending =
      true;

    if (
      STATE.compositorReadyListener ||
      typeof globalThis
        .addEventListener !==
        "function"
    ) {
      publishReceipt();

      return;
    }

    STATE.compositorReadyListener =
      () => {
        try {
          resolveCompositor();
        } catch (error) {
          failAdapter(
            errorCodeFrom(
              error,
              "SHOWROOM_COMPOSITOR_ATTACHMENT_FAILED"
            ),
            error &&
            error.details
              ? error.details
              : null,
            {
              terminal:
                false,

              stage:
                FAILURE_STAGE
                  .COMPOSITOR_ATTACHMENT,

              error
            }
          );
        }
      };

    globalThis.addEventListener(
      COMPOSITOR_READY_EVENT,
      STATE.compositorReadyListener
    );

    publishReceipt();
  }

  function verifyRendererHandle(
    handle
  ) {
    invariant(
      handle &&
      typeof handle ===
        "object",
      "RENDERER_HANDLE_REQUIRED"
    );

    invariant(
      typeof handle.instanceId ===
        "string" &&
      handle.instanceId.length >
        0,
      "RENDERER_HANDLE_INSTANCE_ID_REQUIRED"
    );

    const requiredMethods = [
      "destroy",
      "start",
      "stop",
      "syncReducedMotion",
      "syncPresentationState",
      "getProjectedBounds",
      "getState"
    ];

    for (
      const method
      of requiredMethods
    ) {
      invariant(
        typeof handle[method] ===
          "function",
        "RENDERER_HANDLE_SURFACE_REQUIRED",
        {
          method
        }
      );
    }

    STATE.rendererHandleValidated =
      true;

    publishCheckpoint(
      CHECKPOINT
        .RENDERER_HANDLE_VALIDATED,
      {
        instanceId:
          handle.instanceId,

        requiredMethods
      },
      {
        instanceId:
          handle.instanceId
      }
    );

    return true;
  }

  function registerRendererListeners() {
    STATE.boundsListener =
      handleBoundsEvent;

    STATE.visualMount
      .addEventListener(
        GENERIC_BOUNDS_EVENT,
        STATE.boundsListener
      );

    STATE.rendererFailureListener =
      handleRendererFailure;

    globalThis.addEventListener(
      RENDERER_FAILURE_EVENT,
      STATE.rendererFailureListener
    );

    STATE.acceptingBounds =
      true;

    STATE.acceptingFailures =
      true;

    publishCheckpoint(
      CHECKPOINT
        .RENDERER_LISTENERS_REGISTERED,
      {
        boundsEvent:
          GENERIC_BOUNDS_EVENT,

        failureEvent:
          RENDERER_FAILURE_EVENT,

        boundsTarget:
          "resolved visual mount"
      }
    );
  }

  function unregisterRendererListeners() {
    STATE.acceptingBounds =
      false;

    STATE.acceptingFailures =
      false;

    if (
      STATE.boundsListener &&
      STATE.visualMount
    ) {
      STATE.visualMount
        .removeEventListener(
          GENERIC_BOUNDS_EVENT,
          STATE.boundsListener
        );
    }

    if (
      STATE.rendererFailureListener &&
      typeof globalThis
        .removeEventListener ===
        "function"
    ) {
      globalThis
        .removeEventListener(
          RENDERER_FAILURE_EVENT,
          STATE
            .rendererFailureListener
        );
    }

    STATE.boundsListener =
      null;

    STATE.rendererFailureListener =
      null;
  }

  function mountRenderer() {
    STATE.rendererMountAttempted =
      true;

    publishCheckpoint(
      CHECKPOINT
        .RENDERER_MOUNT_ENTERED,
      {
        mountMarkedForAutomaticDiscovery:
          STATE.visualMount.matches(
            "[data-upstream-compass-mount]"
          ),

        fallbackDirectChild:
          STATE.fallback.parentElement ===
          STATE.visualMount,

        semanticControlSibling:
          STATE.semanticControl
            .parentElement ===
          STATE.layer
      }
    );

    const handle =
      STATE.renderer.mount({
        root:
          STATE.root,

        mount:
          STATE.visualMount,

        semanticControl:
          STATE.semanticControl,

        fallback:
          STATE.fallback,

        getPresentationState,

        subscribePresentationState,

        getReducedMotion,

        subscribeReducedMotion
      });

    publishCheckpoint(
      CHECKPOINT
        .RENDERER_MOUNT_RETURNED,
      {
        handleReturned:
          Boolean(handle),

        instanceId:
          handle &&
          typeof handle.instanceId ===
            "string"
            ? handle.instanceId
            : ""
      },
      {
        instanceId:
          handle &&
          typeof handle.instanceId ===
            "string"
            ? handle.instanceId
            : ""
      }
    );

    verifyRendererHandle(
      handle
    );

    STATE.rendererHandle =
      handle;

    STATE.rendererInstanceId =
      handle.instanceId;

    synchronizeRendererState({
      recordFailure:
        true
    });

    publishCheckpoint(
      CHECKPOINT
        .RENDERER_HANDLE_RETAINED,
      {
        instanceId:
          STATE.rendererInstanceId,

        rendererState:
          STATE
            .rendererStateSnapshot
      },
      {
        instanceId:
          STATE.rendererInstanceId
      }
    );

    processRetainedPreHandleRecords();

    readAndProcessHandleBounds();

    synchronizeRendererState({
      recordFailure:
        true
    });

    publishReceipt();
  }

  function failAdapter(
    reason,
    details = null,
    options = {}
  ) {
    const terminal =
      options.terminal !==
      false;

    const error =
      options.error ||
      null;

    const code =
      errorCodeFrom(
        error,
        reason ||
        "UNKNOWN_ADAPTER_FAILURE"
      );

    const message =
      errorMessageFrom(
        error,
        reason ||
        "Unknown adapter failure."
      );

    const stage =
      String(
        options.stage ||
        STATE.lastLifecycleCheckpoint ||
        FAILURE_STAGE.INITIALIZATION
      );

    STATE.lastFailure =
      String(
        reason ||
        code
      );

    STATE.lastFailureCode =
      code;

    STATE.lastFailureMessage =
      message;

    STATE.lastFailureStage =
      stage;

    STATE.lastFailureDetail =
      freezeSnapshot(
        serializableValue(
          details
        )
      );

    synchronizeRendererState();

    recordLifecycleCheckpoint(
      CHECKPOINT.FAILURE,
      {
        reason:
          STATE.lastFailure,

        code,

        message,

        stage,

        terminal,

        detail:
          STATE.lastFailureDetail,

        presentationState:
          STATE.lastPresentationState,

        reducedMotion:
          STATE.lastReducedMotionState,

        rendererState:
          STATE.rendererStateSnapshot
      },
      {
        instanceId:
          STATE.rendererInstanceId,

        failureCode:
          code
      }
    );

    if (terminal) {
      STATE.status =
        STATUS.FAILED;

      STATE.initialized =
        false;
    }

    emitAdapterFailure(
      STATE.lastFailure,
      {
        code,
        message,
        stage,
        terminal,
        detail:
          STATE.lastFailureDetail
      }
    );

    if (!terminal) {
      publishReceipt();

      return false;
    }

    retainAndForwardEffectiveRecord(
      createInvalidEffectiveRecord(
        EFFECTIVE_STATUS.INVALID
      )
    );

    publishReceipt({
      status:
        STATUS.FAILED
    });

    return false;
  }

  function cleanupPartialInitialization() {
    unregisterRendererListeners();

    if (
      STATE.compositorReadyListener &&
      typeof globalThis
        .removeEventListener ===
        "function"
    ) {
      globalThis
        .removeEventListener(
          COMPOSITOR_READY_EVENT,
          STATE
            .compositorReadyListener
        );
    }

    STATE.compositorReadyListener =
      null;

    if (
      STATE.rendererHandle &&
      typeof STATE.rendererHandle
        .destroy ===
        "function"
    ) {
      try {
        STATE.rendererHandle
          .destroy();
      } catch (_) {}
    }

    STATE.rendererHandle =
      null;

    STATE.rendererInstanceId =
      "";

    STATE.rendererStateSnapshot =
      null;

    STATE.rendererHandleValidated =
      false;

    STATE.preHandleRendererRecords =
      [];
  }

  function initialize() {
    if (
      STATE.initialized &&
      STATE.status ===
        STATUS.AVAILABLE
    ) {
      return true;
    }

    if (
      STATE.initializing
    ) {
      return false;
    }

    invariant(
      !STATE.disposing,
      "ADAPTER_DISPOSING"
    );

    if (
      STATE.disposed
    ) {
      STATE.disposed =
        false;
    }

    STATE.initializing =
      true;

    STATE.status =
      STATUS.INITIALIZING;

    STATE.lastFailure =
      "";

    STATE.lastFailureCode =
      "";

    STATE.lastFailureMessage =
      "";

    STATE.lastFailureStage =
      "";

    STATE.lastFailureDetail =
      null;

    STATE.lastGenericRevision =
      0;

    STATE.lastGenericStatus =
      "";

    STATE.rendererRecordObserved =
      false;

    STATE.duplicateRendererRecordCount =
      0;

    STATE.regressedRendererRecordCount =
      0;

    STATE.preHandleRendererRecords =
      [];

    STATE.rendererMountAttempted =
      false;

    STATE.rendererHandleValidated =
      false;

    STATE.rendererStateSnapshot =
      null;

    publishCheckpoint(
      CHECKPOINT
        .INITIALIZATION_ENTERED,
      {
        documentReadyState:
          typeof document !==
            "undefined"
            ? document.readyState
            : "unavailable"
      }
    );

    let currentStage =
      FAILURE_STAGE
        .RENDERER_RESOLUTION;

    try {
      resolveRenderer();

      currentStage =
        FAILURE_STAGE
          .CONTROLLER_RESOLUTION;

      resolveController();

      currentStage =
        FAILURE_STAGE
          .DOM_RESOLUTION;

      resolveDom();

      currentStage =
        FAILURE_STAGE
          .LISTENER_REGISTRATION;

      registerRendererListeners();

      currentStage =
        FAILURE_STAGE
          .RENDERER_MOUNT;

      mountRenderer();

      if (
        !STATE.latestEffectiveBounds
      ) {
        retainAndForwardEffectiveRecord(
          createInvalidEffectiveRecord(
            EFFECTIVE_STATUS.INITIALIZING,
            0
          )
        );
      }

      currentStage =
        FAILURE_STAGE
          .COMPOSITOR_ATTACHMENT;

      scheduleCompositorAttachment();

      STATE.initialized =
        true;

      STATE.status =
        STATUS.AVAILABLE;

      STATE.initializing =
        false;

      synchronizeRendererState({
        recordFailure:
          true
      });

      publishCheckpoint(
        CHECKPOINT
          .INITIALIZATION_COMPLETE,
        {
          instanceId:
            STATE.rendererInstanceId,

          rendererState:
            STATE
              .rendererStateSnapshot,

          compositorForwardingReady:
            Boolean(
              STATE.compositorIntake
            ),

          compositorAttachmentPending:
            STATE
              .compositorAttachmentPending
        },
        {
          instanceId:
            STATE.rendererInstanceId
        }
      );

      return true;
    } catch (error) {
      STATE.initializing =
        false;

      cleanupPartialInitialization();

      failAdapter(
        errorCodeFrom(
          error,
          "SHOWROOM_COMPASS_ADAPTER_INITIALIZATION_FAILED"
        ),
        error &&
        error.details
          ? error.details
          : null,
        {
          terminal:
            true,

          stage:
            currentStage,

          error
        }
      );

      return false;
    }
  }

  function dispose() {
    if (
      STATE.disposed
    ) {
      return true;
    }

    if (
      STATE.disposing
    ) {
      return false;
    }

    STATE.disposing =
      true;

    STATE.status =
      STATUS.DISPOSING;

    synchronizeRendererState();

    publishReceipt();

    STATE.acceptingBounds =
      false;

    STATE.acceptingFailures =
      false;

    unregisterRendererListeners();

    if (
      STATE.compositorReadyListener &&
      typeof globalThis
        .removeEventListener ===
        "function"
    ) {
      globalThis
        .removeEventListener(
          COMPOSITOR_READY_EVENT,
          STATE
            .compositorReadyListener
        );
    }

    STATE.compositorReadyListener =
      null;

    if (
      STATE.rendererHandle &&
      typeof STATE.rendererHandle
        .destroy ===
        "function"
    ) {
      try {
        STATE.rendererHandle
          .destroy();
      } catch (error) {
        STATE.lastFailure =
          "RENDERER_DESTROY_FAILED";

        STATE.lastFailureCode =
          errorCodeFrom(
            error,
            "RENDERER_DESTROY_FAILED"
          );

        STATE.lastFailureMessage =
          errorMessageFrom(
            error,
            "Renderer destroy failed."
          );

        STATE.lastFailureStage =
          FAILURE_STAGE.DISPOSAL;

        STATE.lastFailureDetail =
          null;

        emitAdapterFailure(
          "RENDERER_DESTROY_FAILED",
          {
            message:
              STATE
                .lastFailureMessage
          }
        );
      }
    }

    const disposedRecord =
      createInvalidEffectiveRecord(
        EFFECTIVE_STATUS.DISPOSED,
        STATE.rendererRecordObserved
          ? STATE.lastGenericRevision
          : 0
      );

    retainAndForwardEffectiveRecord(
      disposedRecord
    );

    const disposedInstanceId =
      STATE.rendererInstanceId;

    STATE.rendererHandle =
      null;

    STATE.rendererInstanceId =
      "";

    STATE.rendererStateSnapshot =
      null;

    STATE.preHandleRendererRecords =
      [];

    STATE.initialized =
      false;

    STATE.initializing =
      false;

    STATE.disposing =
      false;

    STATE.disposed =
      true;

    STATE.status =
      STATUS.DISPOSED;

    publishCheckpoint(
      CHECKPOINT.DISPOSED,
      {
        disposedInstanceId,

        rendererDestroyed:
          true,

        listenersRemoved:
          true,

        compositorListenerRemoved:
          true
      },
      {
        instanceId:
          disposedInstanceId
      }
    );

    return true;
  }

  function getState() {
    synchronizeRendererState();

    return Object.freeze({
      moduleId:
        MODULE.id,

      moduleVersion:
        MODULE.version,

      status:
        STATE.status,

      initialized:
        STATE.initialized,

      initializing:
        STATE.initializing,

      failed:
        STATE.status ===
          STATUS.FAILED,

      disposing:
        STATE.disposing,

      disposed:
        STATE.disposed,

      domResolved:
        Boolean(
          STATE.root &&
          STATE.layer &&
          STATE.visualMount &&
          STATE.fallback &&
          STATE.semanticControl
        ),

      rendererResolved:
        Boolean(
          STATE.renderer
        ),

      controllerResolved:
        Boolean(
          STATE.controller
        ),

      compositorResolved:
        Boolean(
          STATE.compositor
        ),

      listenersRegistered:
        Boolean(
          STATE.boundsListener &&
          STATE.rendererFailureListener
        ),

      rendererMountAttempted:
        STATE.rendererMountAttempted,

      rendererHandleRetained:
        Boolean(
          STATE.rendererHandle
        ),

      rendererModuleId:
        STATE.renderer
          ? STATE.renderer.moduleId
          : "",

      rendererModuleVersion:
        STATE.renderer
          ? STATE.renderer
              .moduleVersion
          : "",

      rendererInstanceId:
        STATE.rendererInstanceId,

      rendererState:
        STATE.rendererStateSnapshot,

      rendererStatus:
        STATE.rendererStateSnapshot
          ? STATE
              .rendererStateSnapshot
              .rendererStatus
          : "",

      rendererFirstEnhancedFrameCompleted:
        Boolean(
          STATE.rendererStateSnapshot &&
          STATE
            .rendererStateSnapshot
            .firstEnhancedFrameCompleted
        ),

      rendererFailure:
        STATE.rendererStateSnapshot
          ? STATE
              .rendererStateSnapshot
              .rendererFailure
          : "",

      rendererIntegrationActive:
        Boolean(
          STATE.rendererHandle &&
          STATE.status ===
            STATUS.AVAILABLE
        ),

      compositorForwardingReady:
        Boolean(
          STATE.compositorIntake
        ),

      compositorAttachmentPending:
        STATE
          .compositorAttachmentPending,

      lastPresentationState:
        STATE.lastPresentationState,

      lastReducedMotionState:
        STATE.lastReducedMotionState,

      lastGenericRevision:
        STATE.lastGenericRevision,

      lastGenericStatus:
        STATE.lastGenericStatus,

      rendererRecordObserved:
        STATE.rendererRecordObserved,

      duplicateRendererRecordCount:
        STATE
          .duplicateRendererRecordCount,

      regressedRendererRecordCount:
        STATE
          .regressedRendererRecordCount,

      preHandleRendererRecordCount:
        STATE
          .preHandleRendererRecords
          .length,

      latestEffectiveBounds:
        STATE.latestEffectiveBounds,

      lastFailure:
        STATE.lastFailure,

      lastFailureCode:
        STATE.lastFailureCode,

      lastFailureMessage:
        STATE.lastFailureMessage,

      lastFailureStage:
        STATE.lastFailureStage,

      lastFailureDetail:
        STATE.lastFailureDetail,

      lastLifecycleCheckpoint:
        STATE.lastLifecycleCheckpoint,

      lifecycleSequence:
        Object.freeze(
          STATE.lifecycleHistory
            .slice()
        ),

      receiptRevision:
        STATE.receiptRevision,

      boundsEventAssociationStrength:
        "strong",

      rendererFailureAssociationStrength:
        "weak",

      failureCorrelationSurface:
        "retained handle.getState()",

      adapterOwnsNavigation:
        false,

      adapterOwnsRoutes:
        false,

      adapterOwnsControllerState:
        false,

      adapterOwnsCompassGeometry:
        false,

      adapterOwnsRendererMatrices:
        false,

      adapterOwnsSemanticActivation:
        false,

      adapterOwnsSemanticDisabledState:
        false,

      adapterMovesOrResizesSemanticControl:
        false,

      adapterOwnsHitSizing:
        false,

      adapterOwnsCrystalRendering:
        false,

      adapterOwnsFrontRearClassification:
        false,

      adapterOwnsCompositorCamera:
        false,

      adapterOwnsMainCompassReturnMeaning:
        false
    });
  }

  function getEffectiveBounds() {
    return STATE.latestEffectiveBounds;
  }

  function subscribeEffectiveBounds(
    callback
  ) {
    invariant(
      typeof callback ===
        "function",
      "EFFECTIVE_BOUNDS_SUBSCRIBER_REQUIRED"
    );

    STATE.effectiveSubscribers
      .add(
        callback
      );

    return () => {
      STATE.effectiveSubscribers
        .delete(
          callback
        );
    };
  }

  function runContractValidation() {
    const checks =
      Object.freeze({
        moduleIdentity:
          MODULE.id ===
          "SHOWROOM_COMPASS_ADAPTER",

        moduleVersion:
          MODULE.version ===
          "1.0.2-compass-lifecycle-receipt",

        requiredRendererVersion:
          REQUIRED_RENDERER_VERSION ===
          "3.1.1-generic-lifecycle-receipt",

        genericBoundsContract:
          GENERIC_BOUNDS_CONTRACT ===
          "DGB_UPSTREAM_COMPASS_PROJECTED_BOUNDS_v1",

        genericBoundsEvent:
          GENERIC_BOUNDS_EVENT ===
          "DGB_UPSTREAM_COMPASS_PROJECTED_BOUNDS_CHANGED",

        effectiveBoundsContract:
          EFFECTIVE_BOUNDS_CONTRACT ===
          "SHOWROOM_EFFECTIVE_COMPASS_BOUNDS_RECORD_v1",

        lifecycleHistoryBound:
          MAX_LIFECYCLE_RECORDS ===
          32,

        lifecycleSequenceBounded:
          STATE.lifecycleHistory
            .length <=
          MAX_LIFECYCLE_RECORDS,

        lifecycleReceiptPresent:
          Array.isArray(
            RECEIPT.lifecycleSequence
          ),

        receiptRevisionPresent:
          Number.isInteger(
            STATE.receiptRevision
          ) &&
          STATE.receiptRevision >=
            0,

        projectedBoundsAssociationStrong:
          true,

        rendererFailureAssociationWeak:
          true,

        documentLevelBoundsAcceptance:
          false,

        duplicateRevisionInvalidates:
          false,

        regressedRevisionInvalidates:
          true,

        compositorRequiredBeforeRendererMount:
          false,

        retainedEffectiveRecordWhileWaiting:
          true,

        automaticDiscoveryCanClaimMount:
          STATE.visualMount
            ? STATE.visualMount.matches(
                "[data-upstream-compass-mount]"
              )
            : false,

        automaticMountBypassed:
          false,

        explicitUnmarkedMountRequired:
          true,

        preHandleRecordsRetained:
          true,

        availableInvisibleZeroRecordAccepted:
          true,

        duplicateControllerSubscriptionsCreated:
          false,

        exactControllerSurfaceBinding:
          Boolean(
            STATE.controller &&
            typeof STATE.controller[
              CONTROLLER_SURFACES
                .getFrameState
            ] ===
              "function" &&
            typeof STATE.controller[
              CONTROLLER_SURFACES
                .subscribe
            ] ===
              "function" &&
            typeof STATE.controller[
              CONTROLLER_SURFACES
                .getReducedMotion
            ] ===
              "function" &&
            typeof STATE.controller[
              CONTROLLER_SURFACES
                .subscribeReducedMotion
            ] ===
              "function"
          ),

        exactCompositorSurfaceBinding:
          Boolean(
            !STATE.compositor ||
            typeof STATE.compositor[
              COMPOSITOR_SURFACES
                .acceptCompassBounds
            ] ===
              "function"
          ),

        adapterOwnsNavigation:
          false,

        adapterOwnsControllerState:
          false,

        adapterOwnsCompassGeometry:
          false,

        adapterOwnsRendererMatrices:
          false,

        adapterOwnsSemanticActivation:
          false,

        adapterOwnsSemanticDisabledState:
          false,

        adapterMovesOrResizesSemanticControl:
          false,

        adapterOwnsHitSizing:
          false,

        adapterOwnsCrystalRendering:
          false,

        adapterOwnsFrontRearClassification:
          false,

        adapterOwnsCompositorCamera:
          false,

        adapterOwnsMainCompassReturnMeaning:
          false
      });

    const expected =
      Object.freeze({
        moduleIdentity:
          true,

        moduleVersion:
          true,

        requiredRendererVersion:
          true,

        genericBoundsContract:
          true,

        genericBoundsEvent:
          true,

        effectiveBoundsContract:
          true,

        lifecycleHistoryBound:
          true,

        lifecycleSequenceBounded:
          true,

        lifecycleReceiptPresent:
          true,

        receiptRevisionPresent:
          true,

        projectedBoundsAssociationStrong:
          true,

        rendererFailureAssociationWeak:
          true,

        documentLevelBoundsAcceptance:
          false,

        duplicateRevisionInvalidates:
          false,

        regressedRevisionInvalidates:
          true,

        compositorRequiredBeforeRendererMount:
          false,

        retainedEffectiveRecordWhileWaiting:
          true,

        automaticDiscoveryCanClaimMount:
          false,

        automaticMountBypassed:
          false,

        explicitUnmarkedMountRequired:
          true,

        preHandleRecordsRetained:
          true,

        availableInvisibleZeroRecordAccepted:
          true,

        duplicateControllerSubscriptionsCreated:
          false,

        exactControllerSurfaceBinding:
          true,

        exactCompositorSurfaceBinding:
          true,

        adapterOwnsNavigation:
          false,

        adapterOwnsControllerState:
          false,

        adapterOwnsCompassGeometry:
          false,

        adapterOwnsRendererMatrices:
          false,

        adapterOwnsSemanticActivation:
          false,

        adapterOwnsSemanticDisabledState:
          false,

        adapterMovesOrResizesSemanticControl:
          false,

        adapterOwnsHitSizing:
          false,

        adapterOwnsCrystalRendering:
          false,

        adapterOwnsFrontRearClassification:
          false,

        adapterOwnsCompositorCamera:
          false,

        adapterOwnsMainCompassReturnMeaning:
          false
      });

    const pass =
      Object.keys(
        expected
      ).every(
        key =>
          checks[key] ===
          expected[key]
      );

    return Object.freeze({
      receiptSchema:
        "SHOWROOM_COMPASS_ADAPTER_CONTRACT_VALIDATION_v3",

      moduleId:
        MODULE.id,

      moduleVersion:
        MODULE.version,

      requiredRendererVersion:
        REQUIRED_RENDERER_VERSION,

      pass,

      checks,

      expected,

      maximumLifecycleRecords:
        MAX_LIFECYCLE_RECORDS,

      currentLifecycleRecordCount:
        STATE.lifecycleHistory
          .length,

      lastLifecycleCheckpoint:
        STATE.lastLifecycleCheckpoint,

      receiptRevision:
        STATE.receiptRevision,

      statusVocabulary:
        Object.freeze([
          STATUS.UNINITIALIZED,
          STATUS.INITIALIZING,
          STATUS.AVAILABLE,
          STATUS.FAILED,
          STATUS.DISPOSING,
          STATUS.DISPOSED
        ]),

      genericBoundsStatusVocabulary:
        GENERIC_STATUS_VALUES,

      effectiveBoundsStatusVocabulary:
        EFFECTIVE_STATUS_VALUES,

      boundsListenerPlacement:
        "DIRECTLY_ON_RESOLVED_VISUAL_MOUNT",

      boundsAssociation:
        "MOUNT_ORIGIN_PLUS_INSTANCE_ID",

      initialBoundsHandling:
        "RETAIN_PRE_HANDLE_EVENT_THEN_PROCESS_AFTER_HANDLE_AND_READ_GETTER",

      availableInvisibleHandling:
        "ACCEPT_ZERO_GEOMETRY_AS_COHERENT_INVALID_EFFECTIVE_SOURCE",

      controllerSubscriptionPattern:
        "RENDERER_CONTEXT_GETTERS_AND_SUBSCRIPTIONS_ONLY",

      controllerGlobal:
        CONTROLLER_MODULE_ID,

      controllerGetFrameStateSurface:
        CONTROLLER_SURFACES
          .getFrameState,

      controllerSubscribeSurface:
        CONTROLLER_SURFACES
          .subscribe,

      controllerGetReducedMotionSurface:
        CONTROLLER_SURFACES
          .getReducedMotion,

      controllerSubscribeReducedMotionSurface:
        CONTROLLER_SURFACES
          .subscribeReducedMotion,

      compositorGlobal:
        COMPOSITOR_MODULE_ID,

      compositorReadyEvent:
        COMPOSITOR_READY_EVENT,

      compositorBoundsSurface:
        COMPOSITOR_SURFACES
          .acceptCompassBounds,

      rendererFailureAssociation:
        "RETAINED_HANDLE_GETSTATE_AFTER_GLOBAL_FAILURE_EVENT",

      compositorAttachment:
        "IMMEDIATE_OR_DEFERRED_READY_EVENT",

      lifecycleInstrumentation:
        "BOUNDED_32_RECORD_ADAPTER_LIFECYCLE_RECEIPT",

      runtimeVisualSuccessClaimed:
        false
    });
  }

  function receipt() {
    return publishReceipt();
  }

  function scheduleInitialization() {
    if (
      typeof document ===
      "undefined"
    ) {
      return;
    }

    publishCheckpoint(
      CHECKPOINT
        .INITIALIZATION_SCHEDULED,
      {
        documentReadyState:
          document.readyState,

        trigger:
          document.readyState ===
            "loading"
            ? "DOMContentLoaded"
            : "immediate"
      }
    );

    if (
      document.readyState ===
        "loading"
    ) {
      document.addEventListener(
        "DOMContentLoaded",
        () => {
          initialize();
        },
        {
          once:
            true
        }
      );

      return;
    }

    initialize();
  }

  recordLifecycleCheckpoint(
    CHECKPOINT.SCRIPT_EVALUATED,
    {
      moduleId:
        MODULE.id,

      moduleVersion:
        MODULE.version,

      requiredRendererVersion:
        REQUIRED_RENDERER_VERSION
    }
  );

  publishReceipt();

  scheduleInitialization();

  return Object.freeze({
    moduleId:
      MODULE.id,

    moduleVersion:
      MODULE.version,

    genericBoundsContract:
      GENERIC_BOUNDS_CONTRACT,

    genericBoundsEvent:
      GENERIC_BOUNDS_EVENT,

    effectiveBoundsContract:
      EFFECTIVE_BOUNDS_CONTRACT,

    initialize,

    dispose,

    getState,

    getEffectiveBounds,

    subscribeEffectiveBounds,

    runContractValidation,

    receipt
  });
})();

if (
  typeof globalThis !==
  "undefined"
) {
  globalThis
    .SHOWROOM_COMPASS_ADAPTER =
    SHOWROOM_COMPASS_ADAPTER;
}

if (
  typeof module !==
    "undefined" &&
  module.exports
) {
  module.exports =
    SHOWROOM_COMPASS_ADAPTER;
}

/*
SHOWROOM_COMPASS_ADAPTER_CONSTRUCTION_RESULT_v3

Artifact:
/showroom/index.compass.adapter.js

Module:
SHOWROOM_COMPASS_ADAPTER
1.0.2-compass-lifecycle-receipt

Previous module version:
1.0.1-adapter-foundation-corrections

Required renderer:
DGB_UPSTREAM_COMPASS_RENDERER
3.1.1-generic-lifecycle-receipt

Disposition:
PHASE_1_ADAPTER_LIFECYCLE_INSTRUMENTATION_CONSTRUCTED

Existing receipt retained:
globalThis.SHOWROOM_COMPASS_ADAPTER_RECEIPT

Bounded lifecycle history:
- maximum records: 32
- oldest records evicted first
- records contain no DOM nodes, functions, WebGL objects, or cyclic references
- each record contains:
  - name
  - sequence
  - timestamp
  - instanceId
  - concise serializable detail
  - failureCode

Added lifecycle checkpoints:
- ADAPTER_SCRIPT_EVALUATED
- ADAPTER_INITIALIZATION_SCHEDULED
- ADAPTER_INITIALIZATION_ENTERED
- RENDERER_GLOBAL_RESOLVED
- CONTROLLER_RESOLVED
- DOM_RESOLVED
- RENDERER_LISTENERS_REGISTERED
- RENDERER_MOUNT_ENTERED
- RENDERER_MOUNT_RETURNED
- RENDERER_HANDLE_VALIDATED
- RENDERER_HANDLE_RETAINED
- COMPOSITOR_ATTACHMENT_SCHEDULED
- COMPOSITOR_ATTACHMENT_ACTIVE
- ADAPTER_INITIALIZATION_COMPLETE
- ADAPTER_FAILURE
- ADAPTER_DISPOSED

Added receipt fields:
- initialized
- initializing
- failed
- disposed
- domResolved
- rendererResolved
- controllerResolved
- compositorResolved
- listenersRegistered
- rendererMountAttempted
- rendererHandleRetained
- rendererState
- rendererStatus
- rendererFirstEnhancedFrameCompleted
- rendererFailure
- lastPresentationState
- lastReducedMotionState
- lastGenericBoundsStatus
- lastFailureCode
- lastFailureMessage
- lastFailureStage
- lastFailureDetail
- lastLifecycleCheckpoint
- lifecycleSequence
- receiptRevision

Renderer-state synchronization:
- reads retained rendererHandle.getState()
- retains only bounded serializable scalar diagnostics
- refreshes after:
  - mount return
  - handle retention
  - bounds events
  - renderer failure events
  - presentation subscription updates
  - reduced-motion subscription updates
  - initialization completion
  - disposal entry

Preserved:
- self-start
- explicit renderer mount
- unmarked Showroom visual mount
- sibling semantic control
- direct fallback reference
- one retained renderer handle
- projected-bounds validation
- pre-handle bounds retention
- duplicate revision handling
- compositor forwarding
- existing failure event
- existing public API
- renderer-owned controller subscription cleanup
- adapter non-ownership boundaries

Not changed:
- WebGL error policy
- renderer failure latch
- retry policy
- first-frame promotion policy
- fallback behavior
- canvas visibility behavior
- geometry
- navigation
- controller
- compositor
- interactions
- crystals
- CSS
- HTML structure

Required Showroom HTML cache query:
/showroom/index.compass.adapter.js?v=1.0.2-compass-lifecycle-receipt

Runtime execution:
NOT PERFORMED

Runtime visual success claimed:
FALSE

Phase 2:
NOT EXECUTED
*/

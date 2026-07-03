/* /showroom/index.compass.adapter.js
   Showroom-specific integration boundary for the universal fixed-center
   Compass renderer.

   Module:
   SHOWROOM_COMPASS_ADAPTER
   1.0.1-adapter-foundation-corrections

   Controlling contract:
   SHOWROOM_3D_COMPASS_CONTRACT_FREEZE_PROPOSAL_v2

   Scope:
   EXPLICIT_MOUNT_TRANSLATION_VALIDATION_CUSTODY_FORWARDING

   Corrections incorporated:
   - pre-handle projected-bounds events are retained and processed only after
     the renderer handle and instance ID are known;
   - available + visible:false + zero geometry is accepted as a coherent
     presentation invalidation;
   - controller subscriptions are supplied only through the renderer context;
     the adapter does not create duplicate push subscriptions;
   - contract validation compares every check against an explicit expected
     value;
   - controller and compositor integration use exact inspected surfaces.

   Exact controller surfaces:
   - globalThis.SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER
   - getFrameState()
   - subscribe(callback)
   - getReducedMotion()
   - subscribeReducedMotion(callback)

   Exact compositor surfaces:
   - globalThis.SHOWROOM_COMPOSITOR
   - acceptCompassBounds(record)
   - SHOWROOM_COMPOSITOR_READY

   Ownership:
   - Resolves the existing Showroom Compass layer, visual mount, fallback,
     and sibling semantic control.
   - Explicitly mounts exactly one universal Compass renderer instance.
   - Translates existing Showroom presentation and reduced-motion facts into
     generic renderer inputs.
   - Retains renderer-instance custody.
   - Validates generic projected-bounds events originating from the owned
     visual mount.
   - Translates validated generic viewport bounds into the frozen effective
     Showroom bounds record.
   - Retains the latest effective record.
   - Attaches to the Showroom compositor immediately or through its readiness
     event and forwards the retained effective record.
   - Publishes bounded failure and receipt surfaces.
   - Performs complete adapter and renderer teardown.

   Strict non-ownership:
   - no navigation;
   - no route construction;
   - no controller mutation;
   - no semantic activation;
   - no semantic disabled-state authorship;
   - no semantic-control movement or resizing;
   - no CSS-variable publication;
   - no Compass projection mathematics;
   - no Compass matrix reconstruction;
   - no crystal rendering;
   - no front/rear classification;
   - no compositor camera ownership;
   - no Main Compass return interpretation.
*/

const SHOWROOM_COMPASS_ADAPTER = (() => {
  "use strict";

  const MODULE = Object.freeze({
    id:
      "SHOWROOM_COMPASS_ADAPTER",

    version:
      "1.0.1-adapter-foundation-corrections",

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
    "3.1.0-generic-projected-bounds";

  const CONTROLLER_MODULE_ID =
    "SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER";

  const COMPOSITOR_MODULE_ID =
    "SHOWROOM_COMPOSITOR";

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

    lastGenericBoundsRevision:
      0,

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

    disposed:
      false,

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

    controller:
      null,

    compositor:
      null,

    compositorIntake:
      null,

    compositorAttachmentPending:
      false,

    lastGenericRevision:
      0,

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
      new Set()
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

  function publishReceipt(
    extra = {}
  ) {
    Object.assign(
      RECEIPT,
      {
        moduleId:
          MODULE.id,

        moduleVersion:
          MODULE.version,

        status:
          STATE.status,

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
            STATE.visualMount
          ),

        failureListenerActive:
          Boolean(
            STATE.rendererFailureListener
          ),

        compositorForwardingReady:
          Boolean(
            STATE.compositor &&
            STATE.compositorIntake
          ),

        compositorAttachmentPending:
          STATE
            .compositorAttachmentPending,

        lastGenericBoundsRevision:
          STATE.lastGenericRevision,

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

        disposed:
          STATE.disposed,

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
          ...RECEIPT
        });
    }

    return Object.freeze({
      ...RECEIPT
    });
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

                details:
                  details &&
                  typeof details ===
                    "object"
                    ? Object.freeze({
                        ...details
                      })
                    : details
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

    return Object.freeze({
      visible,

      interactionEnabled:
        interactionEnabled &&
        !held,

      held,

      reducedMotion:
        STATE.controller[
          CONTROLLER_SURFACES
            .getReducedMotion
        ]() ===
          true,

      rendererFailure:
        ""
    });
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
          callback(
            normalizePresentationFromFrame(
              frame &&
              typeof frame ===
                "object"
                ? frame
                : readControllerFrame()
            )
          );
        }
      );

    return typeof unsubscribe ===
      "function"
      ? unsubscribe
      : () => {};
  }

  function getReducedMotion() {
    return (
      STATE.controller[
        CONTROLLER_SURFACES
          .getReducedMotion
      ]() ===
      true
    );
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
          callback(
            value ===
              true
          );
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
            error &&
            error.message
              ? String(
                  error.message
                )
              : ""
        },
        {
          terminal:
            false
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
        error &&
        (
          error.code ||
          error.message
        )
          ? String(
              error.code ||
              error.message
            )
          : "GENERIC_BOUNDS_VALIDATION_FAILED",
        error &&
        error.details
          ? error.details
          : null,
        {
          terminal:
            false
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
        error &&
        (
          error.code ||
          error.message
        )
          ? String(
              error.code ||
              error.message
            )
          : "GENERIC_BOUNDS_EVENT_ORIGIN_VALIDATION_FAILED",
        error &&
        error.details
          ? error.details
          : null,
        {
          terminal:
            false
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
    if (
      !STATE.rendererHandle ||
      typeof STATE.rendererHandle
        .getState !==
        "function"
    ) {
      return false;
    }

    try {
      const rendererState =
        STATE.rendererHandle
          .getState();

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
            .rendererFailure
        )
      );
    } catch (_) {
      return false;
    }
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

    if (
      !rendererFailureMatchesActiveInstance()
    ) {
      return;
    }

    const reason =
      event &&
      event.detail &&
      event.detail.reason
        ? String(
            event.detail.reason
          )
        : "UPSTREAM_COMPASS_RENDERER_FAILURE";

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
          "retained handle.getState()"
      },
      {
        terminal:
          false
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

    publishReceipt();

    return true;
  }

  function scheduleCompositorAttachment() {
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
        resolveCompositor();
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

    verifyRendererHandle(
      handle
    );

    STATE.rendererHandle =
      handle;

    STATE.rendererInstanceId =
      handle.instanceId;

    processRetainedPreHandleRecords();

    readAndProcessHandleBounds();
  }

  function failAdapter(
    reason,
    details = null,
    options = {}
  ) {
    const terminal =
      options.terminal !==
      false;

    STATE.lastFailure =
      String(
        reason ||
        "UNKNOWN_ADAPTER_FAILURE"
      );

    emitAdapterFailure(
      STATE.lastFailure,
      details
    );

    if (!terminal) {
      publishReceipt();

      return false;
    }

    STATE.status =
      STATUS.FAILED;

    STATE.initialized =
      false;

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

    STATE.lastGenericRevision =
      0;

    STATE.rendererRecordObserved =
      false;

    STATE.duplicateRendererRecordCount =
      0;

    STATE.regressedRendererRecordCount =
      0;

    STATE.preHandleRendererRecords =
      [];

    publishReceipt();

    try {
      resolveRenderer();

      resolveController();

      resolveDom();

      registerRendererListeners();

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

      scheduleCompositorAttachment();

      STATE.initialized =
        true;

      STATE.status =
        STATUS.AVAILABLE;

      STATE.initializing =
        false;

      publishReceipt();

      return true;
    } catch (error) {
      STATE.initializing =
        false;

      cleanupPartialInitialization();

      failAdapter(
        error &&
        (
          error.code ||
          error.message
        )
          ? String(
              error.code ||
              error.message
            )
          : "SHOWROOM_COMPASS_ADAPTER_INITIALIZATION_FAILED",
        error &&
        error.details
          ? error.details
          : null,
        {
          terminal:
            true
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
        emitAdapterFailure(
          "RENDERER_DESTROY_FAILED",
          {
            message:
              error &&
              error.message
                ? String(
                    error.message
                  )
                : ""
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

    STATE.rendererHandle =
      null;

    STATE.rendererInstanceId =
      "";

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

    publishReceipt();

    return true;
  }

  function getState() {
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

      disposing:
        STATE.disposing,

      disposed:
        STATE.disposed,

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

      lastGenericRevision:
        STATE.lastGenericRevision,

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
          "1.0.1-adapter-foundation-corrections",

        genericBoundsContract:
          GENERIC_BOUNDS_CONTRACT ===
          "DGB_UPSTREAM_COMPASS_PROJECTED_BOUNDS_v1",

        genericBoundsEvent:
          GENERIC_BOUNDS_EVENT ===
          "DGB_UPSTREAM_COMPASS_PROJECTED_BOUNDS_CHANGED",

        effectiveBoundsContract:
          EFFECTIVE_BOUNDS_CONTRACT ===
          "SHOWROOM_EFFECTIVE_COMPASS_BOUNDS_RECORD_v1",

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

        genericBoundsContract:
          true,

        genericBoundsEvent:
          true,

        effectiveBoundsContract:
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
        "SHOWROOM_COMPASS_ADAPTER_CONTRACT_VALIDATION_v2",

      moduleId:
        MODULE.id,

      moduleVersion:
        MODULE.version,

      pass,

      checks,

      expected,

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

      runtimeVisualSuccessClaimed:
        false
    });
  }

  function receipt() {
    return Object.freeze({
      ...RECEIPT
    });
  }

  function scheduleInitialization() {
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
SHOWROOM_COMPASS_ADAPTER_CONSTRUCTION_RESULT_v2

Artifact:
/showroom/index.compass.adapter.js

Module:
SHOWROOM_COMPASS_ADAPTER
1.0.1-adapter-foundation-corrections

Disposition:
ADAPTER_FOUNDATION_CORRECTED

Scope:
EXPLICIT_MOUNT_TRANSLATION_VALIDATION_CUSTODY_FORWARDING

Renderer dependency:
DGB_UPSTREAM_COMPASS_RENDERER
3.1.0-generic-projected-bounds

Controller dependency:
SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER

Exact controller surfaces:
- getFrameState()
- subscribe(callback)
- getReducedMotion()
- subscribeReducedMotion(callback)

Compositor dependency:
SHOWROOM_COMPOSITOR

Exact compositor surfaces:
- acceptCompassBounds(record)
- SHOWROOM_COMPOSITOR_READY

Generic bounds contract:
DGB_UPSTREAM_COMPASS_PROJECTED_BOUNDS_v1

Generic bounds event:
DGB_UPSTREAM_COMPASS_PROJECTED_BOUNDS_CHANGED

Effective bounds contract:
SHOWROOM_EFFECTIVE_COMPASS_BOUNDS_RECORD_v1

Correction 1:
INITIAL PROJECTED-BOUNDS EVENT RACE RESOLVED

- the mount listener remains registered before renderer.mount();
- events received before handle return are retained;
- the renderer handle and instance ID are then stored;
- retained records are processed through normal validation;
- handle.getProjectedBounds() is read immediately afterward;
- a getter/event duplicate revision is ignored rather than invalidated.

Correction 2:
AVAILABLE INVISIBLE RECORD ACCEPTED

Accepted coherent forms:
- available + visible:true + valid finite geometry;
- available + visible:false + zero geometry.

The second form becomes:
- effective valid:false;
- effective visible:false;
- effective status:available;
- zero-valued geometry.

It is not treated as an adapter contract failure.

Correction 3:
DUPLICATE CONTROLLER SUBSCRIPTIONS REMOVED

- getters and subscription surfaces are supplied through renderer.mount();
- the renderer owns their cleanup through its instance lifecycle;
- the adapter does not separately subscribe and push the same facts;
- redundant post-mount syncPresentationState() and syncReducedMotion()
  calls are removed.

Correction 4:
CONTRACT VALIDATION CORRECTED

- every check has an explicit expected value;
- validation passes only when checks[key] exactly equals expected[key];
- false values cannot accidentally satisfy unrelated false expectations.

DOM resolution:
- exactly one Showroom root;
- exactly one Showroom Compass layer;
- exactly one unmarked visual mount;
- exactly one direct flat fallback host;
- exactly one sibling semantic control;
- no DOM cloning;
- no DOM movement;
- no universal mount marker;
- no universal fallback marker.

Renderer installation:
- explicit unmarked mount;
- direct fallback supplied;
- sibling semantic control supplied;
- exactly one retained renderer handle;
- exact active instance ID retained;
- automatic discovery not intercepted;
- automatic discovery cannot claim the unmarked Showroom mount.

Bounds validation:
- listener attached directly to resolved visual mount;
- event target must equal resolved visual mount;
- event currentTarget must equal resolved visual mount;
- contract identity validated;
- active instance ID validated after handle retention;
- coordinate space validated;
- five-status vocabulary validated;
- numeric fields validated;
- geometric invariants validated;
- visibility and status coherence validated;
- duplicate revisions ignored;
- regressed revisions invalidated;
- stale available geometry not retained after invalidation.

Failure association:
- projected-bounds association: strong;
- renderer-failure association: weak;
- failure correlation: retained handle.getState();
- weak association reported truthfully.

Compositor attachment:
- compositor not required before renderer mounting;
- immediate attachment attempted;
- readiness event used when unavailable;
- latest effective record retained while waiting;
- retained record forwarded immediately after attachment.

Teardown:
- adapter event listeners removed;
- compositor readiness listener removed;
- renderer instance destroyed;
- renderer-owned controller subscriptions are released through destroy();
- disposed invalid effective record retained and forwarded;
- fallback restoration remains renderer-owned.

Strict non-ownership:
- navigation: false;
- routes: false;
- controller state: false;
- Compass geometry: false;
- renderer matrices: false;
- semantic activation: false;
- semantic disabled state: false;
- semantic movement or resizing: false;
- hit sizing: false;
- crystal rendering: false;
- front/rear classification: false;
- compositor camera: false;
- Main Compass return meaning: false.

Runtime visual success claimed:
FALSE

Isolated runtime validation:
NOT RUN

Production authorization:
FALSE

Deployment authorization:
FALSE
*/

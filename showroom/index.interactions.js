/* TARGET FILE: /showroom/index.interactions.js */
/* TNT FULL-FILE REPLACEMENT */
/* SHOWROOM_SCENE_BOUNDED_CONSTELLATION_INTERACTIONS_TNT_v4 */
/*
  Current-runtime interaction renewal.

  Upstream semantic authority:
  - /showroom/index.controller.js
  - window.SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER
  - moduleId:
      SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER
  - moduleVersion:
      7.0.0-controller-interaction-semantic-priority

  Projection authority:
  - /showroom/index.compositor.js
  - window.SHOWROOM_COMPOSITOR
  - contract:
      SHOWROOM_CONSTELLATION_SINGLE_FRAME_COMPOSITOR_TNT_v5

  Rendered-object authority:
  - /showroom/index.crystals.js
  - crystal rendering and compositor-node registration remain external.

  Interaction authority:
  - bounded orbit-field pointer listeners;
  - one active primary pointer;
  - pointer capture and release;
  - authoritative compositor hit-test consumption;
  - projected tap correspondence;
  - semantic-control activation;
  - drag and flick classification;
  - optional controller preview calls when supported;
  - optional cluster return calls when supported;
  - duplicate native-click suppression;
  - interruption cancellation;
  - runtime readiness recovery;
  - complete listener and style restoration.

  Explicit exclusions:
  - no world-to-screen projection;
  - no hit-region construction;
  - no crystal geometry or rendering;
  - no camera mutation;
  - no controller-state construction;
  - no route interpretation;
  - no destination interpretation;
  - no Compass rendering lifecycle;
  - no root, compositor, or crystal readiness ownership.

  Form A behavior:
  - projected taps activate the compositor-corresponding semantic control;
  - Compass taps retain their native semantic-control path;
  - ordinary drag is consumed but does not mutate orientation;
  - a qualifying flick may request cluster return when the controller exposes
    an accepted closeCluster() or returnToOrbit() surface;
  - continuous direct manipulation remains unavailable unless an upstream
    controller transaction surface is explicitly exposed.
*/

(() => {
  "use strict";

  const CONTRACT =
    "SHOWROOM_SCENE_BOUNDED_CONSTELLATION_INTERACTIONS_TNT_v4";

  const OWNER =
    "/showroom/index.interactions.js";

  const CONTROLLER_GLOBAL =
    "SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER";

  const CONTROLLER_MODULE_ID =
    "SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER";

  const CONTROLLER_MODULE_VERSION =
    "7.0.0-controller-interaction-semantic-priority";

  const COMPOSITOR_GLOBAL =
    "SHOWROOM_COMPOSITOR";

  const COMPOSITOR_CONTRACT =
    "SHOWROOM_CONSTELLATION_SINGLE_FRAME_COMPOSITOR_TNT_v5";

  const EVENTS = Object.freeze({
    controllerReady:
      "SHOWROOM_CONTROLLER_READY",

    controllerFailure:
      "SHOWROOM_CONTROLLER_FAILURE",

    compositorReady:
      "SHOWROOM_COMPOSITOR_READY",

    compositorFailed:
      "SHOWROOM_COMPOSITOR_FAILURE",

    compositorDisposed:
      "SHOWROOM_COMPOSITOR_DISPOSED",

    compositorProjectionChanged:
      "SHOWROOM_COMPOSITOR_PROJECTION_CHANGED",

    crystalsReady:
      "SHOWROOM_CRYSTALS_READY",

    crystalsFailed:
      "ARCHCOIN_CRYSTALS_RENDER_FAILURE",

    crystalsDisposed:
      "SHOWROOM_CRYSTALS_DISPOSED",

    interactionsReady:
      "SHOWROOM_INTERACTIONS_READY",

    interactionsFailed:
      "SHOWROOM_INTERACTIONS_FAILURE",

    interactionsDisposed:
      "SHOWROOM_INTERACTIONS_DISPOSED",

    interactionsReceipt:
      "SHOWROOM_INTERACTIONS_RECEIPT"
  });

  const LEGACY_EVENT_ALIASES = Object.freeze({
    controllerReady:
      "showroom:controller-ready",

    controllerFrameChanged:
      "showroom:frame-state-changed",

    controllerStateChanged:
      "showroom:state-changed",

    compositorReady:
      "showroom:compositor-ready",

    compositorFailed:
      "showroom:compositor-failed",

    compositorDisposed:
      "showroom:compositor-disposed",

    crystalsReady:
      "showroom:crystals-ready",

    crystalsFailed:
      "showroom:crystals-failed",

    crystalsDisposed:
      "showroom:crystals-disposed"
  });

  const SELECTORS = Object.freeze({
    root:
      "[data-showroom-root]",

    orbitField:
      "[data-showroom-orbit-field]",

    receipt:
      "[data-showroom-interactions-receipt]",

    semanticObject:
      [
        "[data-showroom-object]",
        "[data-showroom-object-id]",
        "[data-showroom-cardinal-control]",
        "[data-showroom-child-control]",
        "[data-showroom-child-id]"
      ].join(","),

    compassControl:
      "[data-showroom-compass-control]",

    protectedTarget:
      [
        "[data-showroom-diamond-stage]",
        "[data-showroom-window-control]",
        "[data-showroom-diamond-controls]",
        "[data-showroom-gauge-dashboard]",
        "[data-showroom-information-tabs]",
        "dialog"
      ].join(",")
  });

  const CONFIG = Object.freeze({
    minimumDragDistancePx:
      8,

    maximumTapDistancePx:
      13,

    suppressClickMs:
      520,

    maximumSamples:
      18,

    sampleWindowMs:
      140,

    flickMaximumDurationMs:
      280,

    flickMinimumDistancePx:
      48,

    flickMinimumAverageVelocityPxPerMs:
      0.48,

    flickMinimumReleaseVelocityPxPerMs:
      0.62,

    flickMinimumDirectionalRatio:
      1.22,

    flickMaximumPauseBeforeReleaseMs:
      110,

    flickMaximumPathEfficiencyLoss:
      0.3,

    runtimeRetryLimit:
      120,

    runtimeRetryIntervalMs:
      100
  });

  const state = {
    root: null,
    orbitField: null,
    receipt: null,

    controller: null,
    compositor: null,

    controllerFrameUnsubscribe: null,
    controllerHeldUnsubscribe: null,

    pointer: null,
    suppressedClick: null,

    initialized: false,
    initializing: false,
    disposed: false,
    failed: false,

    runtimeActive: false,
    waitingForRuntime: true,
    readyPublished: false,

    apiExposed: false,

    coreListeners: [],
    runtimeListeners: [],

    nativeOrbitFieldStyle: null,
    orbitFieldStyleCaptured: false,

    retryTimer: 0,
    retryCount: 0,

    counters: {
      readinessChecks: 0,
      runtimeActivations: 0,
      runtimeDeactivations: 0,

      pointerDown: 0,
      pointerMove: 0,
      pointerUp: 0,
      pointerCancel: 0,

      pointerCaptureFailures: 0,
      projectedHits: 0,
      projectedMisses: 0,
      projectedTapCommits: 0,
      projectedTapRejects: 0,
      compassTapCommits: 0,
      compassTapRejects: 0,

      previewsBegun: 0,
      previewsCancelled: 0,

      dragsConsumed: 0,
      flicksQualified: 0,
      clusterReturnsCommitted: 0,
      ambiguousReleases: 0,

      nativeClicksSuppressed: 0,
      interruptions: 0,
      failures: 0
    }
  };

  function normalize(value) {
    return String(
      value == null
        ? ""
        : value
    ).trim();
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function isElement(value) {
    return value instanceof Element;
  }

  function isFiniteNumber(value) {
    return (
      typeof value === "number" &&
      Number.isFinite(value)
    );
  }

  function distance2d(
    x1,
    y1,
    x2,
    y2
  ) {
    return Math.hypot(
      x2 - x1,
      y2 - y1
    );
  }

  function freezePlain(value) {
    if (
      value === null ||
      typeof value !== "object"
    ) {
      return value;
    }

    if (Array.isArray(value)) {
      return Object.freeze(
        value.map(freezePlain)
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
        freezePlain(entry);
    }

    return Object.freeze(output);
  }

  function cssEscape(value) {
    const normalized =
      normalize(value);

    if (
      globalThis.CSS &&
      typeof globalThis.CSS.escape ===
        "function"
    ) {
      return globalThis.CSS.escape(
        normalized
      );
    }

    return normalized.replace(
      /["\\]/g,
      "\\$&"
    );
  }

  function dispatch(
    eventName,
    detail = {}
  ) {
    const payload =
      freezePlain({
        contract:
          CONTRACT,

        owner:
          OWNER,

        controllerModuleId:
          CONTROLLER_MODULE_ID,

        controllerModuleVersion:
          CONTROLLER_MODULE_VERSION,

        compositorContract:
          COMPOSITOR_CONTRACT,

        timestamp:
          nowIso(),

        ...detail
      });

    window.dispatchEvent(
      new CustomEvent(
        eventName,
        {
          detail:
            payload
        }
      )
    );

    return payload;
  }

  function createReceipt(
    event,
    extra = {}
  ) {
    const pointer =
      state.pointer;

    return freezePlain({
      contract:
        CONTRACT,

      owner:
        OWNER,

      controllerModuleId:
        CONTROLLER_MODULE_ID,

      controllerModuleVersion:
        CONTROLLER_MODULE_VERSION,

      compositorContract:
        COMPOSITOR_CONTRACT,

      event,

      timestamp:
        nowIso(),

      initialized:
        state.initialized,

      initializing:
        state.initializing,

      disposed:
        state.disposed,

      failed:
        state.failed,

      runtimeActive:
        state.runtimeActive,

      waitingForRuntime:
        state.waitingForRuntime,

      readyPublished:
        state.readyPublished,

      controllerAvailable:
        Boolean(state.controller),

      compositorAvailable:
        Boolean(state.compositor),

      pointerActive:
        Boolean(pointer),

      pointer:
        pointer
          ? {
              pointerId:
                pointer.pointerId,

              pointerType:
                pointer.pointerType,

              territory:
                pointer.territory,

              dragging:
                pointer.dragging,

              downSemanticObjectId:
                pointer.downSemanticObjectId ||
                null,

              downProjectionId:
                pointer.downProjectionId ||
                null,

              activeClusterId:
                pointer.activeClusterId ||
                null,

              previewActive:
                pointer.previewActive
            }
          : null,

      counters: {
        ...state.counters
      },

      ...extra
    });
  }

  function publishReceipt(
    event,
    extra = {}
  ) {
    const payload =
      createReceipt(
        event,
        extra
      );

    if (state.receipt) {
      const serialized =
        JSON.stringify(payload);

      if (
        "value" in
        state.receipt
      ) {
        state.receipt.value =
          serialized;
      }

      state.receipt.textContent =
        serialized;
    }

    dispatch(
      EVENTS.interactionsReceipt,
      payload
    );

    return payload;
  }

  function addManagedListener(
    registry,
    target,
    type,
    handler,
    options
  ) {
    if (
      !target ||
      typeof target.addEventListener !==
        "function"
    ) {
      return false;
    }

    target.addEventListener(
      type,
      handler,
      options
    );

    registry.push(() => {
      target.removeEventListener(
        type,
        handler,
        options
      );
    });

    return true;
  }

  function addCoreListener(
    target,
    type,
    handler,
    options
  ) {
    return addManagedListener(
      state.coreListeners,
      target,
      type,
      handler,
      options
    );
  }

  function addRuntimeListener(
    target,
    type,
    handler,
    options
  ) {
    return addManagedListener(
      state.runtimeListeners,
      target,
      type,
      handler,
      options
    );
  }

  function removeListenerRegistry(
    registry
  ) {
    for (
      const remove
      of registry.splice(0)
    ) {
      try {
        remove();
      } catch {
        /* Best-effort cleanup. */
      }
    }
  }

  function discoverDom() {
    state.root =
      document.querySelector(
        SELECTORS.root
      );

    state.orbitField =
      document.querySelector(
        SELECTORS.orbitField
      );

    state.receipt =
      document.querySelector(
        SELECTORS.receipt
      );
  }

  function isValidControllerApi(
    controller
  ) {
    return Boolean(
      controller &&
      typeof controller ===
        "object" &&
      controller.moduleId ===
        CONTROLLER_MODULE_ID &&
      controller.moduleVersion ===
        CONTROLLER_MODULE_VERSION &&
      typeof controller.getFrameState ===
        "function" &&
      typeof controller.subscribeFrameState ===
        "function"
    );
  }

  function isValidControllerFrame(
    frame
  ) {
    return Boolean(
      frame &&
      typeof frame ===
        "object" &&
      frame.moduleId ===
        CONTROLLER_MODULE_ID &&
      frame.moduleVersion ===
        CONTROLLER_MODULE_VERSION &&
      typeof frame.state ===
        "string" &&
      typeof frame.navigationState ===
        "string" &&
      typeof frame.presentationMode ===
        "string" &&
      typeof frame.held ===
        "boolean"
    );
  }

  function resolveController() {
    const controller =
      window[
        CONTROLLER_GLOBAL
      ];

    if (
      !isValidControllerApi(
        controller
      )
    ) {
      state.controller =
        null;

      return null;
    }

    state.controller =
      controller;

    return controller;
  }

  function readControllerFrame() {
    const controller =
      state.controller ||
      resolveController();

    if (!controller) {
      return null;
    }

    try {
      const frame =
        controller.getFrameState();

      if (
        !isValidControllerFrame(
          frame
        )
      ) {
        return null;
      }

      return frame;
    } catch {
      return null;
    }
  }

  function controllerInteractionAllowed() {
    const frame =
      readControllerFrame();

    return Boolean(
      frame &&
      frame.held === false &&
      frame.disposed !== true &&
      frame.failed !== true
    );
  }

  function isValidCompositorApi(
    compositor
  ) {
    return Boolean(
      compositor &&
      typeof compositor ===
        "object" &&
      compositor.contract ===
        COMPOSITOR_CONTRACT &&
      typeof compositor.getState ===
        "function" &&
      typeof compositor.hitTest ===
        "function"
    );
  }

  function resolveCompositor() {
    const compositor =
      window[
        COMPOSITOR_GLOBAL
      ];

    if (
      !isValidCompositorApi(
        compositor
      )
    ) {
      state.compositor =
        null;

      return null;
    }

    state.compositor =
      compositor;

    return compositor;
  }

  function readCompositorState() {
    const compositor =
      state.compositor ||
      resolveCompositor();

    if (!compositor) {
      return null;
    }

    try {
      const compositorState =
        compositor.getState();

      if (
        !compositorState ||
        compositorState.contract !==
          COMPOSITOR_CONTRACT
      ) {
        return null;
      }

      return compositorState;
    } catch {
      return null;
    }
  }

  function compositorProjectionReady() {
    const compositorState =
      readCompositorState();

    return Boolean(
      compositorState &&
      compositorState.initialized ===
        true &&
      compositorState.disposed ===
        false &&
      compositorState.failed ===
        false &&
      compositorState.readyPublished ===
        true &&
      compositorState.controllerReady ===
        true
    );
  }

  function projectedSelectionAllowed() {
    return Boolean(
      controllerInteractionAllowed() &&
      compositorProjectionReady()
    );
  }

  function isPrimaryPointerEvent(
    event
  ) {
    if (
      event.pointerType ===
        "mouse" &&
      event.button !== 0
    ) {
      return false;
    }

    return event.isPrimary !== false;
  }

  function isInsideOrbitField(
    target
  ) {
    return Boolean(
      isElement(target) &&
      state.orbitField &&
      state.orbitField.contains(
        target
      )
    );
  }

  function isProtectedTarget(
    target
  ) {
    return Boolean(
      isElement(target) &&
      target.closest(
        SELECTORS.protectedTarget
      )
    );
  }

  function resolveCompassControl(
    target
  ) {
    if (
      !isElement(target) ||
      !state.orbitField
    ) {
      return null;
    }

    const control =
      target.closest(
        SELECTORS.compassControl
      );

    return (
      control &&
      state.orbitField.contains(
        control
      )
        ? control
        : null
    );
  }

  function resolveDirectSemanticControl(
    target
  ) {
    if (
      !isElement(target) ||
      !state.orbitField
    ) {
      return null;
    }

    const control =
      target.closest(
        SELECTORS.semanticObject
      );

    return (
      control &&
      state.orbitField.contains(
        control
      )
        ? control
        : null
    );
  }

  function getElementSemanticEvidence(
    element
  ) {
    if (!element) {
      return null;
    }

    return freezePlain({
      objectId:
        normalize(
          element.getAttribute(
            "data-showroom-object-id"
          )
        ) ||
        null,

      cardinalId:
        normalize(
          element.getAttribute(
            "data-showroom-cardinal-id"
          )
        ) ||
        null,

      childId:
        normalize(
          element.getAttribute(
            "data-showroom-child-id"
          )
        ) ||
        null,

      clusterId:
        normalize(
          element.getAttribute(
            "data-showroom-cluster-id"
          )
        ) ||
        null
    });
  }

  function querySemanticControlByAttribute(
    attribute,
    value
  ) {
    const normalizedValue =
      normalize(value);

    if (
      !normalizedValue ||
      !state.orbitField
    ) {
      return null;
    }

    const selector =
      `[${attribute}="${cssEscape(
        normalizedValue
      )}"]`;

    const candidates =
      state.orbitField.querySelectorAll(
        selector
      );

    for (
      const candidate
      of candidates
    ) {
      if (
        candidate.matches(
          SELECTORS.semanticObject
        ) ||
        candidate.matches(
          "button, a, [role='button'], [tabindex]"
        )
      ) {
        return candidate;
      }

      const nested =
        candidate.querySelector(
          [
            SELECTORS.semanticObject,
            "button",
            "a",
            "[role='button']",
            "[tabindex]"
          ].join(",")
        );

      if (nested) {
        return nested;
      }
    }

    return null;
  }

  function resolveSemanticControlFromHit(
    hit
  ) {
    if (
      !hit ||
      !state.orbitField
    ) {
      return null;
    }

    const attempts = [
      [
        "data-showroom-object-id",
        hit.semanticObjectId
      ],
      [
        "data-showroom-child-id",
        hit.childId
      ],
      [
        "data-showroom-cardinal-id",
        hit.cardinalId
      ],
      [
        "data-showroom-cluster-id",
        hit.clusterId
      ],
      [
        "data-showroom-object-id",
        hit.projectionId
      ]
    ];

    for (
      const [
        attribute,
        value
      ]
      of attempts
    ) {
      const control =
        querySemanticControlByAttribute(
          attribute,
          value
        );

      if (control) {
        return control;
      }
    }

    return null;
  }

  function authoritativeHitTest(
    clientX,
    clientY
  ) {
    if (!projectedSelectionAllowed()) {
      return null;
    }

    const compositor =
      state.compositor ||
      resolveCompositor();

    if (!compositor) {
      return null;
    }

    try {
      const hit =
        compositor.hitTest(
          clientX,
          clientY
        );

      if (!hit) {
        state.counters.projectedMisses +=
          1;

        return null;
      }

      const hasIdentity =
        Boolean(
          normalize(
            hit.semanticObjectId
          ) ||
          normalize(
            hit.projectionId
          ) ||
          normalize(
            hit.cardinalId
          ) ||
          normalize(
            hit.childId
          )
        );

      if (!hasIdentity) {
        state.counters.projectedMisses +=
          1;

        return null;
      }

      state.counters.projectedHits +=
        1;

      return hit;
    } catch {
      state.counters.projectedMisses +=
        1;

      return null;
    }
  }

  function deriveHitIdentity(
    hit
  ) {
    if (!hit) {
      return "";
    }

    return normalize(
      hit.semanticObjectId ||
      hit.projectionId ||
      hit.childId ||
      hit.cardinalId ||
      hit.id
    );
  }

  function deriveFrameActiveClusterId(
    frame
  ) {
    if (!frame) {
      return "";
    }

    return normalize(
      frame.activeClusterId ||
      frame.selectedWing ||
      frame.selectedCardinalId ||
      (
        frame.selection &&
        frame.selection.clusterId
      )
    );
  }

  function appendSample(
    pointer,
    x,
    y,
    timestamp
  ) {
    pointer.samples.push({
      x,
      y,
      timestamp
    });

    const cutoff =
      timestamp -
      CONFIG.sampleWindowMs;

    while (
      pointer.samples.length > 1 &&
      pointer.samples[0].timestamp <
        cutoff
    ) {
      pointer.samples.shift();
    }

    if (
      pointer.samples.length >
      CONFIG.maximumSamples
    ) {
      pointer.samples.splice(
        0,
        pointer.samples.length -
          CONFIG.maximumSamples
      );
    }
  }

  function beginOptionalPreview(
    pointer
  ) {
    if (
      !pointer ||
      !pointer.downSemanticObjectId ||
      pointer.previewActive
    ) {
      return false;
    }

    const controller =
      state.controller ||
      resolveController();

    if (
      !controller ||
      typeof controller.beginPreview !==
        "function"
    ) {
      return false;
    }

    try {
      const token =
        controller.beginPreview(
          pointer.downSemanticObjectId,
          {
            source:
              "pointer",

            contract:
              CONTRACT
          }
        );

      if (
        token === false ||
        token === null ||
        token === undefined
      ) {
        return false;
      }

      pointer.previewToken =
        token;

      pointer.previewActive =
        true;

      state.counters.previewsBegun +=
        1;

      return true;
    } catch {
      return false;
    }
  }

  function cancelOptionalPreview(
    pointer,
    reason
  ) {
    if (
      !pointer ||
      !pointer.previewActive
    ) {
      return false;
    }

    pointer.previewActive =
      false;

    pointer.previewToken =
      null;

    const controller =
      state.controller ||
      resolveController();

    if (
      !controller ||
      typeof controller.cancelPreview !==
        "function"
    ) {
      return false;
    }

    try {
      const cancelled =
        controller.cancelPreview(
          reason,
          {
            source:
              "pointer",

            contract:
              CONTRACT
          }
        ) !== false;

      if (cancelled) {
        state.counters.previewsCancelled +=
          1;
      }

      return cancelled;
    } catch {
      return false;
    }
  }

  function capturePointer(
    pointerId
  ) {
    if (!state.orbitField) {
      return false;
    }

    try {
      state.orbitField.setPointerCapture(
        pointerId
      );

      return (
        typeof state.orbitField
          .hasPointerCapture !==
          "function" ||
        state.orbitField.hasPointerCapture(
          pointerId
        )
      );
    } catch {
      state.counters.pointerCaptureFailures +=
        1;

      return false;
    }
  }

  function releasePointer(
    pointerId
  ) {
    if (!state.orbitField) {
      return;
    }

    try {
      if (
        typeof state.orbitField
          .hasPointerCapture !==
          "function" ||
        state.orbitField.hasPointerCapture(
          pointerId
        )
      ) {
        state.orbitField.releasePointerCapture(
          pointerId
        );
      }
    } catch {
      /* Best-effort release. */
    }
  }

  function armClickSuppression(
    element,
    clientX,
    clientY,
    reason
  ) {
    state.suppressedClick = {
      element:
        element ||
        state.orbitField,

      clientX:
        isFiniteNumber(clientX)
          ? clientX
          : null,

      clientY:
        isFiniteNumber(clientY)
          ? clientY
          : null,

      reason:
        normalize(reason) ||
        "pointer-gesture",

      expires:
        performance.now() +
        CONFIG.suppressClickMs
    };
  }

  function clearExpiredSuppression() {
    if (
      state.suppressedClick &&
      performance.now() >
        state.suppressedClick.expires
    ) {
      state.suppressedClick =
        null;
    }
  }

  function shouldSuppressClick(
    event
  ) {
    clearExpiredSuppression();

    const suppression =
      state.suppressedClick;

    if (!suppression) {
      return false;
    }

    /*
      Programmatic activation and keyboard activation use detail === 0 and
      must remain available.
    */
    if (event.detail === 0) {
      return false;
    }

    const target =
      isElement(event.target)
        ? event.target
        : null;

    if (!target) {
      return false;
    }

    const element =
      suppression.element;

    const related =
      !element ||
      element === target ||
      element.contains(target) ||
      target.contains(element);

    if (!related) {
      return false;
    }

    state.suppressedClick =
      null;

    return true;
  }

  function handleClickCapture(
    event
  ) {
    if (!shouldSuppressClick(event)) {
      return;
    }

    state.counters.nativeClicksSuppressed +=
      1;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    publishReceipt(
      "duplicate-click-suppressed"
    );
  }

  function activateSemanticControl(
    control
  ) {
    if (
      !control ||
      typeof control.click !==
        "function"
    ) {
      return false;
    }

    if (
      control.matches(
        ":disabled"
      ) ||
      control.getAttribute(
        "aria-disabled"
      ) === "true"
    ) {
      return false;
    }

    try {
      control.click();

      return true;
    } catch {
      return false;
    }
  }

  function createPointerState(
    event,
    frame,
    compassControl,
    directSemanticControl
  ) {
    const timestamp =
      performance.now();

    const hit =
      compassControl
        ? null
        : authoritativeHitTest(
            event.clientX,
            event.clientY
          );

    const semanticControl =
      hit
        ? resolveSemanticControlFromHit(
            hit
          )
        : null;

    const semanticObjectId =
      deriveHitIdentity(
        hit
      );

    return {
      pointerId:
        event.pointerId,

      pointerType:
        normalize(
          event.pointerType
        ) ||
        "mouse",

      territory:
        compassControl
          ? "compass"
          : hit
            ? "projected-object"
            : directSemanticControl
              ? "native-semantic"
              : "orbit-field",

      startX:
        event.clientX,

      startY:
        event.clientY,

      currentX:
        event.clientX,

      currentY:
        event.clientY,

      startTime:
        timestamp,

      currentTime:
        timestamp,

      maximumDistance:
        0,

      pathLength:
        0,

      dragging:
        false,

      cancelled:
        false,

      finishing:
        false,

      captureAcquired:
        false,

      downHit:
        hit,

      downProjectionId:
        normalize(
          hit &&
          hit.projectionId
        ),

      downSemanticObjectId:
        semanticObjectId,

      semanticControl,

      compassControl,

      directSemanticControl:
        directSemanticControl ||
        null,

      directSemanticEvidence:
        getElementSemanticEvidence(
          directSemanticControl
        ),

      activeClusterId:
        deriveFrameActiveClusterId(
          frame
        ),

      previewToken:
        null,

      previewActive:
        false,

      samples: [
        {
          x:
            event.clientX,

          y:
            event.clientY,

          timestamp
        }
      ]
    };
  }

  function updatePointer(
    pointer,
    event
  ) {
    const timestamp =
      performance.now();

    const previousX =
      pointer.currentX;

    const previousY =
      pointer.currentY;

    pointer.currentX =
      event.clientX;

    pointer.currentY =
      event.clientY;

    pointer.currentTime =
      timestamp;

    pointer.pathLength +=
      distance2d(
        previousX,
        previousY,
        pointer.currentX,
        pointer.currentY
      );

    pointer.maximumDistance =
      Math.max(
        pointer.maximumDistance,
        distance2d(
          pointer.startX,
          pointer.startY,
          pointer.currentX,
          pointer.currentY
        )
      );

    appendSample(
      pointer,
      pointer.currentX,
      pointer.currentY,
      timestamp
    );
  }

  function classifyFlick(
    pointer,
    releaseX,
    releaseY,
    releaseTime,
    previousX,
    previousY
  ) {
    const totalDeltaX =
      releaseX -
      pointer.startX;

    const totalDeltaY =
      releaseY -
      pointer.startY;

    const distance =
      Math.hypot(
        totalDeltaX,
        totalDeltaY
      );

    const duration =
      Math.max(
        1,
        releaseTime -
          pointer.startTime
      );

    const averageVelocity =
      distance /
      duration;

    const recentSamples =
      pointer.samples.filter(
        sample =>
          sample.timestamp >=
            releaseTime -
              CONFIG.sampleWindowMs &&
          sample.timestamp <
            releaseTime
      );

    const releaseStart =
      recentSamples.length
        ? recentSamples[0]
        : {
            x:
              pointer.startX,

            y:
              pointer.startY,

            timestamp:
              pointer.startTime
          };

    const releaseDistance =
      distance2d(
        releaseStart.x,
        releaseStart.y,
        releaseX,
        releaseY
      );

    const releaseDuration =
      Math.max(
        1,
        releaseTime -
          releaseStart.timestamp
      );

    const releaseVelocity =
      releaseDistance /
      releaseDuration;

    const lastRecentSample =
      recentSamples.length
        ? recentSamples[
            recentSamples.length - 1
          ]
        : null;

    const dominant =
      Math.max(
        Math.abs(totalDeltaX),
        Math.abs(totalDeltaY)
      );

    const secondary =
      Math.min(
        Math.abs(totalDeltaX),
        Math.abs(totalDeltaY)
      );

    const directionalRatio =
      secondary <= 1e-6
        ? Infinity
        : dominant /
          secondary;

    const finalSegment =
      distance2d(
        previousX,
        previousY,
        releaseX,
        releaseY
      );

    const pathLength =
      Math.max(
        distance,
        pointer.pathLength +
          finalSegment
      );

    const pathEfficiency =
      pathLength <= 1e-6
        ? 0
        : distance /
          pathLength;

    const pathEfficiencyLoss =
      1 -
      pathEfficiency;

    const pauseBeforeRelease =
      lastRecentSample
        ? Math.max(
            0,
            releaseTime -
              lastRecentSample.timestamp
          )
        : duration;

    const direction =
      Math.abs(totalDeltaX) >=
      Math.abs(totalDeltaY)
        ? (
            totalDeltaX >= 0
              ? "right"
              : "left"
          )
        : (
            totalDeltaY >= 0
              ? "down"
              : "up"
          );

    const qualifies =
      duration <=
        CONFIG.flickMaximumDurationMs &&
      distance >=
        CONFIG.flickMinimumDistancePx &&
      averageVelocity >=
        CONFIG
          .flickMinimumAverageVelocityPxPerMs &&
      releaseVelocity >=
        CONFIG
          .flickMinimumReleaseVelocityPxPerMs &&
      directionalRatio >=
        CONFIG.flickMinimumDirectionalRatio &&
      pauseBeforeRelease <=
        CONFIG
          .flickMaximumPauseBeforeReleaseMs &&
      pathEfficiencyLoss <=
        CONFIG
          .flickMaximumPathEfficiencyLoss;

    return freezePlain({
      qualifies,

      direction,

      duration,

      distance,

      totalDeltaX,

      totalDeltaY,

      averageVelocity,

      releaseVelocity,

      directionalRatio,

      pathLength,

      finalSegment,

      pathEfficiency,

      pathEfficiencyLoss,

      pauseBeforeRelease,

      recentSampleCount:
        recentSamples.length
    });
  }

  function hitCorresponds(
    downHit,
    releaseHit
  ) {
    if (
      !downHit ||
      !releaseHit
    ) {
      return false;
    }

    const downIdentity =
      deriveHitIdentity(
        downHit
      );

    const releaseIdentity =
      deriveHitIdentity(
        releaseHit
      );

    return Boolean(
      downIdentity &&
      releaseIdentity &&
      downIdentity ===
        releaseIdentity
    );
  }

  function commitProjectedTap(
    pointer,
    event
  ) {
    if (
      !pointer.downHit ||
      !pointer.semanticControl ||
      !projectedSelectionAllowed()
    ) {
      state.counters.projectedTapRejects +=
        1;

      cancelOptionalPreview(
        pointer,
        "projected-tap-runtime-unavailable"
      );

      armClickSuppression(
        state.orbitField,
        event.clientX,
        event.clientY,
        "projected-tap-rejected"
      );

      return false;
    }

    const releaseHit =
      authoritativeHitTest(
        event.clientX,
        event.clientY
      );

    if (
      !hitCorresponds(
        pointer.downHit,
        releaseHit
      )
    ) {
      state.counters.projectedTapRejects +=
        1;

      cancelOptionalPreview(
        pointer,
        "projected-tap-correspondence-mismatch"
      );

      armClickSuppression(
        state.orbitField,
        event.clientX,
        event.clientY,
        "projected-tap-correspondence-mismatch"
      );

      return false;
    }

    cancelOptionalPreview(
      pointer,
      "projected-semantic-activation"
    );

    armClickSuppression(
      state.orbitField,
      event.clientX,
      event.clientY,
      "projected-semantic-activation"
    );

    const activated =
      activateSemanticControl(
        pointer.semanticControl
      );

    if (activated) {
      state.counters.projectedTapCommits +=
        1;
    } else {
      state.counters.projectedTapRejects +=
        1;
    }

    return activated;
  }

  function commitCompassTap(
    pointer,
    event
  ) {
    const control =
      pointer.compassControl;

    if (
      !control ||
      !controllerInteractionAllowed()
    ) {
      state.counters.compassTapRejects +=
        1;

      return false;
    }

    const releaseElement =
      typeof document.elementFromPoint ===
        "function"
        ? document.elementFromPoint(
            event.clientX,
            event.clientY
          )
        : null;

    const corresponds =
      releaseElement === control ||
      (
        releaseElement &&
        control.contains(
          releaseElement
        )
      );

    if (!corresponds) {
      state.counters.compassTapRejects +=
        1;

      armClickSuppression(
        control,
        event.clientX,
        event.clientY,
        "compass-tap-correspondence-mismatch"
      );

      return false;
    }

    armClickSuppression(
      control,
      event.clientX,
      event.clientY,
      "compass-semantic-activation"
    );

    const activated =
      activateSemanticControl(
        control
      );

    if (activated) {
      state.counters.compassTapCommits +=
        1;
    } else {
      state.counters.compassTapRejects +=
        1;
    }

    return activated;
  }

  function requestClusterFlickReturn(
    pointer,
    flick
  ) {
    const controller =
      state.controller ||
      resolveController();

    const frame =
      readControllerFrame();

    if (
      !controller ||
      !frame ||
      frame.held === true ||
      frame.disposed === true
    ) {
      return false;
    }

    cancelOptionalPreview(
      pointer,
      "cluster-flick-return"
    );

    const activeClusterId =
      deriveFrameActiveClusterId(
        frame
      );

    let committed =
      false;

    try {
      if (
        activeClusterId &&
        typeof controller.closeCluster ===
          "function"
      ) {
        committed =
          controller.closeCluster(
            activeClusterId,
            {
              source:
                "pointer-flick",

              direction:
                flick.direction,

              contract:
                CONTRACT
            }
          ) !== false;
      } else if (
        typeof controller.returnToOrbit ===
          "function"
      ) {
        committed =
          controller.returnToOrbit({
            source:
              "pointer-flick",

            direction:
              flick.direction,

            contract:
              CONTRACT
          }) !== false;
      }
    } catch {
      committed =
        false;
    }

    if (committed) {
      state.counters.clusterReturnsCommitted +=
        1;
    }

    publishReceipt(
      committed
        ? "cluster-flick-return-committed"
        : "cluster-flick-return-unavailable",
      {
        activeClusterId:
          activeClusterId ||
          null,

        flick
      }
    );

    return committed;
  }

  function clearPointer(
    pointer,
    options = {}
  ) {
    if (!pointer) {
      return;
    }

    pointer.finishing =
      true;

    if (
      state.pointer === pointer
    ) {
      state.pointer =
        null;
    }

    if (
      options.releaseCapture !== false
    ) {
      releasePointer(
        pointer.pointerId
      );
    }
  }

  function interruptActivePointer(
    reason,
    options = {}
  ) {
    const pointer =
      state.pointer;

    if (!pointer) {
      return false;
    }

    pointer.cancelled =
      true;

    state.counters.interruptions +=
      1;

    cancelOptionalPreview(
      pointer,
      reason
    );

    if (
      pointer.dragging ||
      pointer.maximumDistance >
        CONFIG.maximumTapDistancePx
    ) {
      armClickSuppression(
        pointer.compassControl ||
        state.orbitField,
        pointer.currentX,
        pointer.currentY,
        reason
      );
    }

    clearPointer(
      pointer,
      {
        releaseCapture:
          options.releaseCapture !==
          false
      }
    );

    publishReceipt(
      "gesture-interrupted",
      {
        reason,

        pointerId:
          pointer.pointerId,

        territory:
          pointer.territory,

        dragging:
          pointer.dragging
      }
    );

    return true;
  }

  function beginPointerTransaction(
    event,
    frame,
    compassControl,
    directSemanticControl
  ) {
    const pointer =
      createPointerState(
        event,
        frame,
        compassControl,
        directSemanticControl
      );

    /*
      Preserve native semantic fallback if a real semantic control received the
      event but compositor projection did not identify an enhanced object.
    */
    if (
      pointer.territory ===
        "native-semantic"
    ) {
      publishReceipt(
        "native-semantic-fallback-preserved",
        {
          evidence:
            pointer.directSemanticEvidence
        }
      );

      return null;
    }

    state.pointer =
      pointer;

    pointer.captureAcquired =
      capturePointer(
        pointer.pointerId
      );

    if (!pointer.captureAcquired) {
      state.pointer =
        null;

      publishReceipt(
        "pointer-capture-rejected",
        {
          pointerId:
            pointer.pointerId,

          territory:
            pointer.territory
        }
      );

      return null;
    }

    state.counters.pointerDown +=
      1;

    event.preventDefault();

    if (
      pointer.territory ===
        "projected-object"
    ) {
      beginOptionalPreview(
        pointer
      );
    }

    publishReceipt(
      "pointer-started",
      {
        pointerId:
          pointer.pointerId,

        pointerType:
          pointer.pointerType,

        territory:
          pointer.territory,

        semanticObjectId:
          pointer.downSemanticObjectId ||
          null,

        projectionId:
          pointer.downProjectionId ||
          null,

        activeClusterId:
          pointer.activeClusterId ||
          null
      }
    );

    return pointer;
  }

  function handlePointerDown(
    event
  ) {
    if (
      state.pointer ||
      state.disposed ||
      state.failed ||
      !state.runtimeActive ||
      !isPrimaryPointerEvent(
        event
      ) ||
      !isInsideOrbitField(
        event.target
      ) ||
      isProtectedTarget(
        event.target
      )
    ) {
      return;
    }

    const compassControl =
      resolveCompassControl(
        event.target
      );

    if (
      compassControl &&
      !controllerInteractionAllowed()
    ) {
      return;
    }

    const directSemanticControl =
      resolveDirectSemanticControl(
        event.target
      );

    if (
      !compassControl &&
      !projectedSelectionAllowed() &&
      !directSemanticControl
    ) {
      return;
    }

    const frame =
      readControllerFrame();

    if (!frame) {
      return;
    }

    beginPointerTransaction(
      event,
      frame,
      compassControl,
      directSemanticControl
    );
  }

  function handlePointerMove(
    event
  ) {
    const pointer =
      state.pointer;

    if (
      !pointer ||
      pointer.pointerId !==
        event.pointerId ||
      pointer.finishing
    ) {
      return;
    }

    if (
      pointer.territory ===
        "compass"
    ) {
      if (!controllerInteractionAllowed()) {
        interruptActivePointer(
          "controller-runtime-invalid"
        );

        return;
      }
    } else if (!projectedSelectionAllowed()) {
      interruptActivePointer(
        "projected-runtime-invalid"
      );

      return;
    }

    state.counters.pointerMove +=
      1;

    updatePointer(
      pointer,
      event
    );

    if (
      !pointer.dragging &&
      pointer.maximumDistance >=
        CONFIG.minimumDragDistancePx
    ) {
      pointer.dragging =
        true;

      cancelOptionalPreview(
        pointer,
        "drag-recognized"
      );
    }

    event.preventDefault();
  }

  function finishPointer(
    event,
    cancelled
  ) {
    const pointer =
      state.pointer;

    if (
      !pointer ||
      pointer.pointerId !==
        event.pointerId ||
      pointer.finishing
    ) {
      return;
    }

    const releaseTime =
      performance.now();

    const releaseX =
      isFiniteNumber(
        event.clientX
      )
        ? event.clientX
        : pointer.currentX;

    const releaseY =
      isFiniteNumber(
        event.clientY
      )
        ? event.clientY
        : pointer.currentY;

    const previousX =
      pointer.currentX;

    const previousY =
      pointer.currentY;

    pointer.cancelled =
      Boolean(cancelled);

    pointer.maximumDistance =
      Math.max(
        pointer.maximumDistance,
        distance2d(
          pointer.startX,
          pointer.startY,
          releaseX,
          releaseY
        )
      );

    const duration =
      Math.max(
        0,
        releaseTime -
          pointer.startTime
      );

    let outcome =
      "cancelled";

    let activationCommitted =
      false;

    let flick =
      null;

    if (cancelled) {
      cancelOptionalPreview(
        pointer,
        "pointer-cancelled"
      );

      if (
        pointer.dragging ||
        pointer.maximumDistance >
          CONFIG.maximumTapDistancePx
      ) {
        armClickSuppression(
          pointer.compassControl ||
          state.orbitField,
          releaseX,
          releaseY,
          "pointer-cancelled"
        );
      }
    } else if (
      pointer.territory ===
        "compass" &&
      !controllerInteractionAllowed()
    ) {
      cancelOptionalPreview(
        pointer,
        "compass-runtime-invalid"
      );

      armClickSuppression(
        pointer.compassControl ||
        state.orbitField,
        releaseX,
        releaseY,
        "compass-runtime-invalid"
      );

      outcome =
        "runtime-invalid";
    } else if (
      pointer.territory !==
        "compass" &&
      !projectedSelectionAllowed()
    ) {
      cancelOptionalPreview(
        pointer,
        "projected-runtime-invalid"
      );

      armClickSuppression(
        state.orbitField,
        releaseX,
        releaseY,
        "projected-runtime-invalid"
      );

      outcome =
        "runtime-invalid";
    } else if (
      !pointer.dragging &&
      pointer.maximumDistance <=
        CONFIG.maximumTapDistancePx
    ) {
      if (
        pointer.territory ===
          "compass"
      ) {
        activationCommitted =
          commitCompassTap(
            pointer,
            event
          );

        outcome =
          activationCommitted
            ? "compass-tap"
            : "compass-tap-rejected";
      } else if (
        pointer.territory ===
          "projected-object"
      ) {
        activationCommitted =
          commitProjectedTap(
            pointer,
            event
          );

        outcome =
          activationCommitted
            ? "projected-tap"
            : "projected-tap-rejected";
      } else {
        cancelOptionalPreview(
          pointer,
          "empty-field-tap"
        );

        outcome =
          "empty-field-tap";
      }
    } else if (
      pointer.dragging
    ) {
      flick =
        classifyFlick(
          pointer,
          releaseX,
          releaseY,
          releaseTime,
          previousX,
          previousY
        );

      armClickSuppression(
        pointer.compassControl ||
        state.orbitField,
        releaseX,
        releaseY,
        flick.qualifies
          ? "flick-completion"
          : "drag-completion"
      );

      cancelOptionalPreview(
        pointer,
        flick.qualifies
          ? "flick-completion"
          : "drag-completion"
      );

      if (
        flick.qualifies &&
        pointer.activeClusterId &&
        pointer.territory !==
          "compass"
      ) {
        state.counters.flicksQualified +=
          1;

        const returned =
          requestClusterFlickReturn(
            pointer,
            flick
          );

        outcome =
          returned
            ? "cluster-flick-return"
            : "flick-consumed";
      } else {
        state.counters.dragsConsumed +=
          1;

        outcome =
          "drag-consumed";
      }
    } else {
      cancelOptionalPreview(
        pointer,
        "ambiguous-release"
      );

      armClickSuppression(
        pointer.compassControl ||
        state.orbitField,
        releaseX,
        releaseY,
        "ambiguous-release"
      );

      state.counters.ambiguousReleases +=
        1;

      outcome =
        "ambiguous-release";
    }

    pointer.currentX =
      releaseX;

    pointer.currentY =
      releaseY;

    pointer.currentTime =
      releaseTime;

    event.preventDefault();

    clearPointer(
      pointer
    );

    publishReceipt(
      "pointer-finished",
      {
        outcome,

        pointerId:
          pointer.pointerId,

        pointerType:
          pointer.pointerType,

        territory:
          pointer.territory,

        duration,

        maximumDistance:
          pointer.maximumDistance,

        pathLength:
          flick
            ? flick.pathLength
            : pointer.pathLength,

        dragging:
          pointer.dragging,

        cancelled:
          pointer.cancelled,

        activationCommitted,

        semanticObjectId:
          pointer.downSemanticObjectId ||
          null,

        projectionId:
          pointer.downProjectionId ||
          null,

        activeClusterId:
          pointer.activeClusterId ||
          null,

        flick
      }
    );
  }

  function handlePointerUp(
    event
  ) {
    if (
      !state.pointer ||
      state.pointer.pointerId !==
        event.pointerId
    ) {
      return;
    }

    state.counters.pointerUp +=
      1;

    finishPointer(
      event,
      false
    );
  }

  function handlePointerCancel(
    event
  ) {
    if (
      !state.pointer ||
      state.pointer.pointerId !==
        event.pointerId
    ) {
      return;
    }

    state.counters.pointerCancel +=
      1;

    finishPointer(
      event,
      true
    );
  }

  function handleLostPointerCapture(
    event
  ) {
    const pointer =
      state.pointer;

    if (
      !pointer ||
      pointer.pointerId !==
        event.pointerId ||
      pointer.finishing
    ) {
      return;
    }

    interruptActivePointer(
      "lost-pointer-capture",
      {
        releaseCapture:
          false
      }
    );
  }

  function handleContextMenu(
    event
  ) {
    if (
      state.pointer &&
      isInsideOrbitField(
        event.target
      )
    ) {
      event.preventDefault();
    }
  }

  function handleDragStart(
    event
  ) {
    if (
      isInsideOrbitField(
        event.target
      )
    ) {
      event.preventDefault();
    }
  }

  function handleWindowBlur() {
    interruptActivePointer(
      "window-blur"
    );
  }

  function handleVisibilityChange() {
    if (document.hidden) {
      interruptActivePointer(
        "document-hidden"
      );
    }
  }

  function captureOrbitFieldStyle() {
    if (
      !state.orbitField ||
      state.orbitFieldStyleCaptured
    ) {
      return;
    }

    state.nativeOrbitFieldStyle =
      state.orbitField.getAttribute(
        "style"
      );

    state.orbitFieldStyleCaptured =
      true;

    state.orbitField.style.touchAction =
      "none";

    state.orbitField.style.overscrollBehavior =
      "contain";

    state.orbitField.style.userSelect =
      "none";

    state.orbitField.style.webkitUserSelect =
      "none";
  }

  function restoreOrbitFieldStyle() {
    if (
      !state.orbitField ||
      !state.orbitFieldStyleCaptured
    ) {
      return;
    }

    if (
      state.nativeOrbitFieldStyle ===
        null
    ) {
      state.orbitField.removeAttribute(
        "style"
      );
    } else {
      state.orbitField.setAttribute(
        "style",
        state.nativeOrbitFieldStyle
      );
    }

    state.nativeOrbitFieldStyle =
      null;

    state.orbitFieldStyleCaptured =
      false;
  }

  function initializeRuntimeListeners() {
    addRuntimeListener(
      state.orbitField,
      "pointerdown",
      handlePointerDown,
      {
        passive:
          false
      }
    );

    addRuntimeListener(
      state.orbitField,
      "pointermove",
      handlePointerMove,
      {
        passive:
          false
      }
    );

    addRuntimeListener(
      state.orbitField,
      "pointerup",
      handlePointerUp,
      {
        passive:
          false
      }
    );

    addRuntimeListener(
      state.orbitField,
      "pointercancel",
      handlePointerCancel,
      {
        passive:
          false
      }
    );

    addRuntimeListener(
      state.orbitField,
      "lostpointercapture",
      handleLostPointerCapture
    );

    addRuntimeListener(
      state.orbitField,
      "contextmenu",
      handleContextMenu
    );

    addRuntimeListener(
      state.orbitField,
      "dragstart",
      handleDragStart
    );

    addRuntimeListener(
      window,
      "blur",
      handleWindowBlur
    );

    addRuntimeListener(
      document,
      "visibilitychange",
      handleVisibilityChange
    );
  }

  function activateRuntime(
    reason
  ) {
    if (
      state.runtimeActive ||
      state.disposed ||
      state.failed
    ) {
      return false;
    }

    captureOrbitFieldStyle();
    initializeRuntimeListeners();

    state.runtimeActive =
      true;

    state.waitingForRuntime =
      false;

    state.counters.runtimeActivations +=
      1;

    if (!state.readyPublished) {
      state.readyPublished =
        true;

      publishReceipt(
        "ready",
        {
          reason,

          form:
            "A",

          currentControllerAligned:
            true,

          currentCompositorAligned:
            true,

          projectedTapSelection:
            true,

          authoritativeCompositorHitTest:
            true,

          projectedTapCorrespondence:
            true,

          semanticControlActivation:
            true,

          pointerCapture:
            true,

          boundedTouchLandscape:
            true,

          duplicateClickSuppression:
            true,

          optionalSemanticPreview:
            true,

          dragClassification:
            true,

          flickClassification:
            true,

          optionalClusterReturn:
            true,

          continuousDirectManipulation:
            false,

          nativeSemanticFallbackPreserved:
            true,

          fixedCompassNativeActivationPreserved:
            true
        }
      );

      dispatch(
        EVENTS.interactionsReady,
        {
          reason,

          contract:
            CONTRACT,

          form:
            "A",

          projectedTapSelection:
            true,

          continuousDirectManipulation:
            false,

          api: [
            "getState",
            "cancelGesture",
            "retryRuntime",
            "dispose"
          ]
        }
      );
    }

    return true;
  }

  function deactivateRuntime(
    reason
  ) {
    if (!state.runtimeActive) {
      return false;
    }

    interruptActivePointer(
      reason
    );

    removeListenerRegistry(
      state.runtimeListeners
    );

    restoreOrbitFieldStyle();

    state.runtimeActive =
      false;

    state.waitingForRuntime =
      true;

    state.counters.runtimeDeactivations +=
      1;

    return true;
  }

  function clearRetryTimer() {
    if (state.retryTimer) {
      clearTimeout(
        state.retryTimer
      );
    }

    state.retryTimer =
      0;
  }

  function scheduleRuntimeRetry(
    reason
  ) {
    if (
      state.retryTimer ||
      state.runtimeActive ||
      state.disposed ||
      state.failed ||
      state.retryCount >=
        CONFIG.runtimeRetryLimit
    ) {
      return;
    }

    state.retryTimer =
      window.setTimeout(
        () => {
          state.retryTimer =
            0;

          state.retryCount +=
            1;

          attemptRuntimeActivation(
            `${reason}:retry-${state.retryCount}`
          );
        },
        CONFIG.runtimeRetryIntervalMs
      );
  }

  function attemptRuntimeActivation(
    reason = "runtime-check"
  ) {
    if (
      state.disposed ||
      state.failed ||
      !state.initialized
    ) {
      return false;
    }

    state.counters.readinessChecks +=
      1;

    const controller =
      resolveController();

    const compositor =
      resolveCompositor();

    const controllerReady =
      Boolean(
        controller &&
        controllerInteractionAllowed()
      );

    const compositorReady =
      Boolean(
        compositor &&
        compositorProjectionReady()
      );

    if (
      !controllerReady ||
      !compositorReady
    ) {
      state.waitingForRuntime =
        true;

      publishReceipt(
        "waiting-for-runtime",
        {
          reason,

          controllerAvailable:
            Boolean(controller),

          controllerReady,

          compositorAvailable:
            Boolean(compositor),

          compositorProjectionReady:
            compositorReady,

          retryCount:
            state.retryCount
        }
      );

      scheduleRuntimeRetry(
        reason
      );

      return false;
    }

    clearRetryTimer();

    state.retryCount =
      0;

    return activateRuntime(
      reason
    );
  }

  function unsubscribeController() {
    const subscriptions = [
      "controllerFrameUnsubscribe",
      "controllerHeldUnsubscribe"
    ];

    for (
      const key
      of subscriptions
    ) {
      const unsubscribe =
        state[key];

      state[key] =
        null;

      if (
        typeof unsubscribe ===
          "function"
      ) {
        try {
          unsubscribe();
        } catch {
          /* Best-effort unsubscription. */
        }
      }
    }
  }

  function bindControllerSubscriptions() {
    unsubscribeController();

    const controller =
      resolveController();

    if (!controller) {
      return false;
    }

    try {
      const frameUnsubscribe =
        controller.subscribeFrameState(
          frame => {
            if (
              state.disposed ||
              state.failed
            ) {
              return;
            }

            if (
              !isValidControllerFrame(
                frame
              )
            ) {
              interruptActivePointer(
                "invalid-controller-frame"
              );

              deactivateRuntime(
                "invalid-controller-frame"
              );

              scheduleRuntimeRetry(
                "invalid-controller-frame"
              );

              return;
            }

            if (
              frame.held === true ||
              frame.disposed === true ||
              frame.failed === true
            ) {
              interruptActivePointer(
                "controller-frame-blocked"
              );
            }

            attemptRuntimeActivation(
              "controller-frame"
            );
          }
        );

      if (
        frameUnsubscribe != null &&
        typeof frameUnsubscribe !==
          "function"
      ) {
        throw new Error(
          "Controller subscribeFrameState() returned an invalid unsubscribe surface."
        );
      }

      state.controllerFrameUnsubscribe =
        frameUnsubscribe ||
        null;

      if (
        typeof controller.subscribeHeldState ===
          "function"
      ) {
        const heldUnsubscribe =
          controller.subscribeHeldState(
            heldState => {
              if (
                heldState &&
                heldState.held === true
              ) {
                interruptActivePointer(
                  "controller-held"
                );
              }

              attemptRuntimeActivation(
                "controller-held-state"
              );
            }
          );

        if (
          heldUnsubscribe != null &&
          typeof heldUnsubscribe !==
            "function"
        ) {
          throw new Error(
            "Controller subscribeHeldState() returned an invalid unsubscribe surface."
          );
        }

        state.controllerHeldUnsubscribe =
          heldUnsubscribe ||
          null;
      }

      return true;
    } catch (error) {
      unsubscribeController();

      publishReceipt(
        "controller-subscription-failed",
        {
          error: {
            name:
              error instanceof Error
                ? error.name
                : "Error",

            message:
              error instanceof Error
                ? error.message
                : String(error)
          }
        }
      );

      return false;
    }
  }

  function handleControllerReady() {
    resolveController();
    bindControllerSubscriptions();

    attemptRuntimeActivation(
      "controller-ready-event"
    );
  }

  function handleControllerFailure(
    event
  ) {
    interruptActivePointer(
      "controller-failure"
    );

    deactivateRuntime(
      "controller-failure"
    );

    publishReceipt(
      "controller-unavailable",
      {
        detail:
          event &&
          event.detail
            ? event.detail
            : null
      }
    );
  }

  function handleCompositorReady() {
    resolveCompositor();

    attemptRuntimeActivation(
      "compositor-ready-event"
    );
  }

  function handleCompositorProjectionChanged() {
    if (
      state.runtimeActive &&
      state.pointer &&
      !projectedSelectionAllowed()
    ) {
      interruptActivePointer(
        "projection-invalidated"
      );
    }

    attemptRuntimeActivation(
      "compositor-projection"
    );
  }

  function handleCompositorFailure(
    event
  ) {
    interruptActivePointer(
      "compositor-failure"
    );

    deactivateRuntime(
      "compositor-failure"
    );

    state.compositor =
      null;

    publishReceipt(
      "compositor-unavailable",
      {
        detail:
          event &&
          event.detail
            ? event.detail
            : null,

        nativeSemanticFallbackPreserved:
          true
      }
    );
  }

  function handleCompositorDisposed() {
    interruptActivePointer(
      "compositor-disposed"
    );

    deactivateRuntime(
      "compositor-disposed"
    );

    state.compositor =
      null;

    scheduleRuntimeRetry(
      "compositor-disposed"
    );
  }

  function handleCrystalsReady() {
    attemptRuntimeActivation(
      "crystals-ready-event"
    );
  }

  function handleCrystalsUnavailable(
    reason
  ) {
    interruptActivePointer(
      reason
    );

    publishReceipt(
      "crystal-enhancement-unavailable",
      {
        reason,

        compositorHitTestingRetained:
          compositorProjectionReady(),

        nativeSemanticFallbackPreserved:
          true
      }
    );
  }

  function initializeCoreListeners() {
    addCoreListener(
      document,
      "click",
      handleClickCapture,
      true
    );

    addCoreListener(
      window,
      EVENTS.controllerReady,
      handleControllerReady
    );

    addCoreListener(
      window,
      LEGACY_EVENT_ALIASES.controllerReady,
      handleControllerReady
    );

    addCoreListener(
      window,
      EVENTS.controllerFailure,
      handleControllerFailure
    );

    addCoreListener(
      window,
      LEGACY_EVENT_ALIASES.controllerFrameChanged,
      () => {
        attemptRuntimeActivation(
          "legacy-controller-frame-event"
        );
      }
    );

    addCoreListener(
      window,
      LEGACY_EVENT_ALIASES.controllerStateChanged,
      () => {
        attemptRuntimeActivation(
          "legacy-controller-state-event"
        );
      }
    );

    addCoreListener(
      window,
      EVENTS.compositorReady,
      handleCompositorReady
    );

    addCoreListener(
      window,
      LEGACY_EVENT_ALIASES.compositorReady,
      handleCompositorReady
    );

    addCoreListener(
      window,
      EVENTS.compositorProjectionChanged,
      handleCompositorProjectionChanged
    );

    addCoreListener(
      window,
      EVENTS.compositorFailed,
      handleCompositorFailure
    );

    addCoreListener(
      window,
      LEGACY_EVENT_ALIASES.compositorFailed,
      handleCompositorFailure
    );

    addCoreListener(
      window,
      EVENTS.compositorDisposed,
      handleCompositorDisposed
    );

    addCoreListener(
      window,
      LEGACY_EVENT_ALIASES.compositorDisposed,
      handleCompositorDisposed
    );

    addCoreListener(
      window,
      EVENTS.crystalsReady,
      handleCrystalsReady
    );

    addCoreListener(
      window,
      LEGACY_EVENT_ALIASES.crystalsReady,
      handleCrystalsReady
    );

    addCoreListener(
      window,
      EVENTS.crystalsFailed,
      () => {
        handleCrystalsUnavailable(
          "crystals-failed"
        );
      }
    );

    addCoreListener(
      window,
      LEGACY_EVENT_ALIASES.crystalsFailed,
      () => {
        handleCrystalsUnavailable(
          "legacy-crystals-failed"
        );
      }
    );

    addCoreListener(
      window,
      EVENTS.crystalsDisposed,
      () => {
        handleCrystalsUnavailable(
          "crystals-disposed"
        );
      }
    );

    addCoreListener(
      window,
      LEGACY_EVENT_ALIASES.crystalsDisposed,
      () => {
        handleCrystalsUnavailable(
          "legacy-crystals-disposed"
        );
      }
    );

    addCoreListener(
      window,
      "pageshow",
      () => {
        if (
          !state.disposed &&
          !state.failed
        ) {
          attemptRuntimeActivation(
            "pageshow"
          );
        }
      }
    );

    addCoreListener(
      window,
      "pagehide",
      event => {
        if (event.persisted) {
          interruptActivePointer(
            "pagehide-persisted"
          );

          deactivateRuntime(
            "pagehide-persisted"
          );

          return;
        }

        dispose(
          "pagehide"
        );
      }
    );
  }

  function validateDom() {
    const issues = [];

    if (!state.root) {
      issues.push(
        "Missing [data-showroom-root]."
      );
    }

    if (!state.orbitField) {
      issues.push(
        "Missing [data-showroom-orbit-field]."
      );
    }

    if (
      state.root &&
      state.orbitField &&
      !state.root.contains(
        state.orbitField
      )
    ) {
      issues.push(
        "The orbit field is not inside the Showroom root."
      );
    }

    return issues;
  }

  function getState() {
    return createReceipt(
      "state-requested"
    );
  }

  function exposeApi() {
    const api =
      Object.freeze({
        contract:
          CONTRACT,

        owner:
          OWNER,

        controllerGlobal:
          CONTROLLER_GLOBAL,

        controllerModuleId:
          CONTROLLER_MODULE_ID,

        controllerModuleVersion:
          CONTROLLER_MODULE_VERSION,

        compositorGlobal:
          COMPOSITOR_GLOBAL,

        compositorContract:
          COMPOSITOR_CONTRACT,

        getState,

        cancelGesture(
          reason = "api"
        ) {
          return interruptActivePointer(
            `api:${normalize(reason) || "cancel"}`
          );
        },

        retryRuntime(
          reason = "api"
        ) {
          clearRetryTimer();

          state.retryCount =
            0;

          return attemptRuntimeActivation(
            `api:${normalize(reason) || "retry"}`
          );
        },

        dispose
      });

    Object.defineProperty(
      window,
      "SHOWROOM_INTERACTIONS",
      {
        configurable:
          true,

        enumerable:
          false,

        writable:
          false,

        value:
          api
      }
    );

    state.apiExposed =
      true;
  }

  function removeApi() {
    if (!state.apiExposed) {
      return;
    }

    try {
      delete window.SHOWROOM_INTERACTIONS;
    } catch {
      /* Best-effort cleanup. */
    }

    state.apiExposed =
      false;
  }

  function enterTerminalFailure(
    reason,
    error
  ) {
    if (
      state.failed ||
      state.disposed
    ) {
      return;
    }

    state.counters.failures +=
      1;

    clearRetryTimer();

    interruptActivePointer(
      reason
    );

    deactivateRuntime(
      reason
    );

    unsubscribeController();

    state.failed =
      true;

    state.waitingForRuntime =
      false;

    const errorPayload = {
      name:
        error instanceof Error
          ? error.name
          : "Error",

      message:
        error instanceof Error
          ? error.message
          : String(error)
    };

    publishReceipt(
      "runtime-failed",
      {
        reason,

        error:
          errorPayload,

        nativeSemanticFallbackPreserved:
          true,

        rootReadinessMutated:
          false,

        compositorStateMutated:
          false,

        crystalStateMutated:
          false
      }
    );

    dispatch(
      EVENTS.interactionsFailed,
      {
        reason,

        error:
          errorPayload
      }
    );
  }

  function rollbackInitialization(
    error
  ) {
    clearRetryTimer();

    interruptActivePointer(
      "initialization-rollback"
    );

    deactivateRuntime(
      "initialization-rollback"
    );

    unsubscribeController();

    removeListenerRegistry(
      state.coreListeners
    );

    restoreOrbitFieldStyle();
    removeApi();

    state.initialized =
      false;

    state.initializing =
      false;

    state.failed =
      true;

    state.waitingForRuntime =
      false;

    state.controller =
      null;

    state.compositor =
      null;

    state.counters.failures +=
      1;

    const errorPayload = {
      name:
        error instanceof Error
          ? error.name
          : "Error",

      message:
        error instanceof Error
          ? error.message
          : String(error)
    };

    publishReceipt(
      "fatal-error",
      {
        error:
          errorPayload,

        listenersRemoved:
          true,

        pointerReleased:
          true,

        orbitFieldRestored:
          true,

        controllerSubscriptionsRemoved:
          true,

        rootReadinessMutated:
          false
      }
    );

    dispatch(
      EVENTS.interactionsFailed,
      {
        reason:
          "initialization-failed",

        error:
          errorPayload
      }
    );
  }

  function initialize() {
    if (
      state.initialized ||
      state.initializing ||
      state.disposed
    ) {
      return;
    }

    state.initializing =
      true;

    try {
      discoverDom();

      const issues =
        validateDom();

      if (issues.length) {
        throw new Error(
          issues.join(" ")
        );
      }

      initializeCoreListeners();
      exposeApi();

      state.initialized =
        true;

      state.initializing =
        false;

      state.failed =
        false;

      state.waitingForRuntime =
        true;

      resolveController();
      resolveCompositor();
      bindControllerSubscriptions();

      publishReceipt(
        "core-initialized",
        {
          controllerResolution:
            state.controller
              ? "resolved"
              : "pending",

          compositorResolution:
            state.compositor
              ? "resolved"
              : "pending",

          pointerRuntime:
            "deferred-until-controller-and-compositor-ready",

          currentControllerContractRequired:
            true,

          currentCompositorContractRequired:
            true,

          nativeSemanticFallbackPreserved:
            true
        }
      );

      attemptRuntimeActivation(
        "startup"
      );
    } catch (error) {
      rollbackInitialization(
        error
      );
    }
  }

  function dispose(
    reason = "api"
  ) {
    if (state.disposed) {
      return;
    }

    state.disposed =
      true;

    clearRetryTimer();

    interruptActivePointer(
      `dispose:${normalize(reason) || "api"}`
    );

    deactivateRuntime(
      `dispose:${normalize(reason) || "api"}`
    );

    unsubscribeController();

    removeListenerRegistry(
      state.coreListeners
    );

    restoreOrbitFieldStyle();
    removeApi();

    state.suppressedClick =
      null;

    state.controller =
      null;

    state.compositor =
      null;

    state.initialized =
      false;

    state.initializing =
      false;

    state.waitingForRuntime =
      false;

    publishReceipt(
      "disposed",
      {
        reason,

        pointerReleased:
          true,

        listenersRemoved:
          true,

        controllerSubscriptionsRemoved:
          true,

        orbitFieldRestored:
          true,

        nativeSemanticFallbackPreserved:
          true,

        rootReadinessMutated:
          false,

        compositorStateMutated:
          false,

        crystalStateMutated:
          false
      }
    );

    dispatch(
      EVENTS.interactionsDisposed,
      {
        reason,

        disposed:
          true
      }
    );
  }

  if (
    document.readyState ===
      "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initialize,
      {
        once:
          true
      }
    );
  } else {
    initialize();
  }
})();

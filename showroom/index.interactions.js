/* TARGET FILE: /showroom/index.interactions.js */
/* TNT FULL-FILE REPLACEMENT */
/* SHOWROOM_SCENE_BOUNDED_CONSTELLATION_INTERACTIONS_TNT_v3 */
/*
  Form A interaction contract.

  Interaction authority:
  - one active pointer;
  - pointer capture and release;
  - pointer coordinates, elapsed time, travel, and bounded recent samples;
  - tap, drag, ambiguous-release, and flick classification;
  - authoritative compositor hit-result consumption;
  - stable projected-tap correspondence;
  - optional controller semantic-preview transactions;
  - native semantic-control activation;
  - controller-owned cluster return requests;
  - 520 ms duplicate-click suppression;
  - interruption cancellation;
  - deferred runtime readiness;
  - listener rollback, disposal, and bounded receipts.

  Explicit exclusions:
  - no projection;
  - no rendered hit geometry;
  - no rendered-node ordering;
  - no quaternion construction;
  - no axis selection;
  - no camera mutation;
  - no pointer-delta-to-orientation conversion;
  - no orbit or cluster orientation preview;
  - no nearest-node settlement;
  - no semantic-state interpretation;
  - no route or destination interpretation;
  - no navigation;
  - no rendering;
  - no root readiness ownership;
  - no fallback visibility ownership;
  - no crystal readiness ownership.

  Form A limitation:
  - ordinary drag is deliberately consumed and noncommitting;
  - continuous direct manipulation is intentionally absent because no accepted
    upstream pointer-delta/orientation transaction surface exists.

  Runtime lifecycle:
  - core initialization may complete while compositor projection is pending;
  - projected-pointer runtime surfaces activate only after authoritative
    compositor readiness;
  - the fixed Compass retains its native semantic-control path independently
    of compositor projection;
  - native semantic fallback remains operational during crystal degradation;
  - compositor terminal failure fails only this interaction enhancement;
  - compositor disposal disposes this module;
  - crystal failure cancels projected gestures without disabling native
    fallback.

  Direct semantic-origin constraint:
  - directSemanticControl is evidence only;
  - it may support suppression, fallback recognition, diagnostics, and receipts;
  - it must never supply semanticObjectId;
  - it must never replace compositor.hitTest();
  - it must never authorize activation;
  - it must never determine route, cluster, child, or destination meaning.
*/

(() => {
  "use strict";

  const CONTRACT =
    "SHOWROOM_SCENE_BOUNDED_CONSTELLATION_INTERACTIONS_TNT_v3";

  const OWNER =
    "/showroom/index.interactions.js";

  const CONTROLLER_CONTRACT =
    "SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER_TNT_v5";

  const COMPOSITOR_CONTRACT =
    "SHOWROOM_CONSTELLATION_SINGLE_FRAME_COMPOSITOR_TNT_v2";

  const EVENTS = Object.freeze({
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
      "showroom:crystals-disposed",

    interactionsReady:
      "showroom:interactions-ready",

    interactionsFailed:
      "showroom:interactions-failed",

    interactionsDisposed:
      "showroom:interactions-disposed",

    interactionsReceipt:
      "showroom:interactions-receipt"
  });

  const SELECTORS = Object.freeze({
    root:
      "[data-showroom-root]",

    receipt:
      "[data-showroom-interactions-receipt]",

    orbitField:
      "[data-showroom-orbit-field]",

    semanticObject:
      "[data-showroom-object]",

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
      12,

    suppressClickMs:
      520,

    sampleWindowMs:
      140,

    maximumSamples:
      18,

    flickMaximumDurationMs:
      260,

    flickMinimumDistancePx:
      52,

    flickMinimumAverageVelocityPxPerMs:
      0.55,

    flickMinimumReleaseVelocityPxPerMs:
      0.72,

    flickMinimumDirectionalRatio:
      1.28,

    flickMaximumPauseBeforeReleaseMs:
      90,

    flickMaximumPathEfficiencyLoss:
      0.22
  });

  const state = {
    root:
      null,

    receipt:
      null,

    orbitField:
      null,

    controller:
      null,

    compositor:
      null,

    pointer:
      null,

    suppressedClick:
      null,

    reducedMotion:
      false,

    reducedMotionQuery:
      null,

    crystalsAvailable:
      false,

    initialized:
      false,

    initializing:
      false,

    disposed:
      false,

    failed:
      false,

    ready:
      false,

    readyPublished:
      false,

    waitingForRuntime:
      false,

    runtimeSurfacesActivated:
      false,

    apiExposed:
      false,

    coreListeners:
      [],

    runtimeListeners:
      [],

    nativeOrbitFieldStyle:
      null,

    orbitFieldStyleCaptured:
      false,

    counters: {
      pointerDown:
        0,

      pointerMove:
        0,

      pointerUp:
        0,

      pointerCancel:
        0,

      pointerCaptureFailures:
        0,

      projectedHits:
        0,

      projectedMisses:
        0,

      previewsBegun:
        0,

      previewsCancelled:
        0,

      projectedTapsCommitted:
        0,

      compassTapsCommitted:
        0,

      projectedHitMissesRejected:
        0,

      dragsConsumed:
        0,

      ambiguousReleases:
        0,

      flicksQualified:
        0,

      clusterReturnsCommitted:
        0,

      syntheticClicksSuppressed:
        0,

      interruptions:
        0,

      readinessChecks:
        0,

      runtimeActivations:
        0,

      runtimeDeactivations:
        0
    }
  };

  function normalize(value) {
    return String(value || "").trim();
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

  function directSemanticEvidence(
    control
  ) {
    if (!control) {
      return null;
    }

    return freezePlain({
      objectId:
        normalize(
          control.dataset
            .showroomObjectId
        ) ||
        null,

      cardinalId:
        normalize(
          control.dataset
            .showroomCardinalId
        ) ||
        null,

      clusterId:
        normalize(
          control.dataset
            .showroomClusterId
        ) ||
        null,

      childId:
        normalize(
          control.dataset
            .showroomChildId
        ) ||
        null,

      behavior:
        normalize(
          control.dataset
            .showroomObjectBehavior
        ) ||
        null
    });
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
      return;
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
  }

  function addCoreListener(
    target,
    type,
    handler,
    options
  ) {
    addManagedListener(
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
    addManagedListener(
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

        controllerContract:
          CONTROLLER_CONTRACT,

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

      controllerContract:
        CONTROLLER_CONTRACT,

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

      ready:
        state.ready,

      readyPublished:
        state.readyPublished,

      waitingForRuntime:
        state.waitingForRuntime,

      runtimeSurfacesActivated:
        state.runtimeSurfacesActivated,

      reducedMotion:
        state.reducedMotion,

      crystalsAvailable:
        state.crystalsAvailable,

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

              directSemanticOrigin:
                pointer.directSemanticEvidence,

              activeClusterId:
                pointer.activeClusterId ||
                null,

              previewToken:
                pointer.previewToken ||
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

      state.receipt.value =
        serialized;

      state.receipt.textContent =
        serialized;
    }

    dispatch(
      EVENTS.interactionsReceipt,
      payload
    );

    return payload;
  }

  function readController() {
    const controller =
      window.SHOWROOM_CONTROLLER;

    if (
      !controller ||
      controller.contract !==
        CONTROLLER_CONTRACT ||
      typeof controller.getFrameState !==
        "function" ||
      typeof controller.beginPreview !==
        "function" ||
      typeof controller.cancelPreview !==
        "function" ||
      typeof controller.closeCluster !==
        "function" ||
      typeof controller.returnToOrbit !==
        "function"
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
      readController();

    if (!controller) {
      return null;
    }

    try {
      const frame =
        controller.getFrameState();

      if (
        !frame ||
        frame.contract !==
          CONTROLLER_CONTRACT
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
      frame.controllerReady ===
        true &&
      frame.disposed ===
        false &&
      frame.held ===
        false
    );
  }

  function readCompositor() {
    const compositor =
      window.SHOWROOM_COMPOSITOR;

    if (
      !compositor ||
      compositor.contract !==
        COMPOSITOR_CONTRACT ||
      typeof compositor.getState !==
        "function" ||
      typeof compositor.hitTest !==
        "function"
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
      readCompositor();

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
      compositorState.readyPublished ===
        true &&
      compositorState.controllerReady ===
        true
    );
  }

  function projectedSelectionAllowed() {
    const frame =
      readControllerFrame();

    const readiness =
      frame &&
      frame.readiness &&
      typeof frame.readiness ===
        "object"
        ? frame.readiness
        : null;

    return Boolean(
      frame &&
      frame.controllerReady ===
        true &&
      frame.disposed ===
        false &&
      frame.held ===
        false &&
      readiness &&
      readiness.compositorFailed !==
        true &&
      readiness.crystalsFailed !==
        true &&
      state.crystalsAvailable &&
      compositorProjectionReady()
    );
  }

  function refreshControllerDerivedState() {
    const frame =
      readControllerFrame();

    if (!frame) {
      state.crystalsAvailable =
        false;

      return null;
    }

    const readiness =
      frame.readiness &&
      typeof frame.readiness ===
        "object"
        ? frame.readiness
        : null;

    state.reducedMotion =
      Boolean(
        frame.reducedMotion
      ) ||
      Boolean(
        state.reducedMotionQuery &&
        state.reducedMotionQuery.matches
      );

    state.crystalsAvailable =
      Boolean(
        readiness &&
        readiness.crystals ===
          true &&
        readiness.crystalsFailed !==
          true
      );

    return frame;
  }

  function isPrimaryPointerEvent(event) {
    if (
      event.pointerType === "mouse" &&
      event.button !== 0
    ) {
      return false;
    }

    return event.isPrimary !== false;
  }

  function isInsideOrbitField(target) {
    return Boolean(
      isElement(target) &&
      state.orbitField &&
      state.orbitField.contains(target)
    );
  }

  function isProtectedTarget(target) {
    return Boolean(
      isElement(target) &&
      target.closest(
        SELECTORS.protectedTarget
      )
    );
  }

  function resolveCompassControl(target) {
    if (!isElement(target)) {
      return null;
    }

    const control =
      target.closest(
        SELECTORS.compassControl
      );

    return (
      control &&
      state.orbitField &&
      state.orbitField.contains(control)
        ? control
        : null
    );
  }

  function resolveDirectSemanticControl(
    target
  ) {
    if (!isElement(target)) {
      return null;
    }

    const control =
      target.closest(
        SELECTORS.semanticObject
      );

    return (
      control &&
      state.orbitField &&
      state.orbitField.contains(control)
        ? control
        : null
    );
  }

  function resolveSemanticControl(
    semanticObjectId
  ) {
    const objectId =
      normalize(
        semanticObjectId
      );

    if (
      !objectId ||
      !state.root
    ) {
      return null;
    }

    const selector =
      `[data-showroom-object-id="${cssEscape(
        objectId
      )}"]`;

    const control =
      state.root.querySelector(
        selector
      );

    if (
      !control ||
      !control.matches(
        SELECTORS.semanticObject
      ) ||
      !state.orbitField ||
      !state.orbitField.contains(
        control
      )
    ) {
      return null;
    }

    return control;
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
      readCompositor();

    if (!compositor) {
      return null;
    }

    try {
      const hit =
        compositor.hitTest(
          clientX,
          clientY
        );

      if (
        !hit ||
        !normalize(
          hit.semanticObjectId
        )
      ) {
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

  function beginSemanticPreview(
    pointer
  ) {
    if (
      !pointer.downSemanticObjectId ||
      pointer.previewActive
    ) {
      return false;
    }

    const controller =
      state.controller ||
      readController();

    if (!controller) {
      return false;
    }

    let token;

    try {
      token =
        controller.beginPreview(
          pointer.downSemanticObjectId,
          {
            source:
              "pointer"
          }
        );
    } catch {
      return false;
    }

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
  }

  function cancelSemanticPreview(
    pointer,
    reason
  ) {
    if (
      !pointer ||
      !pointer.previewActive
    ) {
      return false;
    }

    const controller =
      state.controller ||
      readController();

    pointer.previewActive =
      false;

    pointer.previewToken =
      null;

    if (!controller) {
      return false;
    }

    let cancelled =
      false;

    try {
      cancelled =
        controller.cancelPreview(
          reason,
          {
            source:
              "pointer"
          }
        ) !== false;
    } catch {
      cancelled =
        false;
    }

    if (cancelled) {
      state.counters.previewsCancelled +=
        1;
    }

    return cancelled;
  }

  function projectedSuppressionTarget() {
    return state.orbitField;
  }

  function suppressionTargetForPointer(
    pointer
  ) {
    if (
      pointer &&
      pointer.territory ===
        "compass" &&
      pointer.compassControl
    ) {
      return pointer.compassControl;
    }

    return projectedSuppressionTarget();
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

  function shouldSuppressClick(event) {
    clearExpiredSuppression();

    const suppression =
      state.suppressedClick;

    if (!suppression) {
      return false;
    }

    /*
      Keyboard-generated and HTMLElement.click()-generated activation remains
      available. Those events have detail === 0.
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

  function handleClickCapture(event) {
    if (!shouldSuppressClick(event)) {
      return;
    }

    state.counters.syntheticClicksSuppressed +=
      1;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    publishReceipt(
      "duplicate-click-suppressed"
    );
  }

  function capturePointer(pointerId) {
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

  function releasePointer(pointerId) {
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
      /* Release remains best-effort. */
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

    /*
      semanticObjectId is derived only from the compositor hit result.
      directSemanticControl is retained only as evidence and never supplies
      selection identity or activation authority.
    */
    const semanticObjectId =
      hit
        ? normalize(
            hit.semanticObjectId
          )
        : "";

    const semanticControl =
      semanticObjectId
        ? resolveSemanticControl(
            semanticObjectId
          )
        : null;

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
          : semanticObjectId
            ? "projected-object"
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

      downSemanticObjectId:
        semanticObjectId,

      semanticControl,

      compassControl,

      directSemanticControl:
        directSemanticControl ||
        null,

      directSemanticEvidence:
        directSemanticEvidence(
          directSemanticControl
        ),

      activeClusterId:
        normalize(
          frame.activeClusterId
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

    /*
      Pointer-up is deliberately not inserted into the movement sample array.
      The physical release point remains the endpoint for release velocity and
      the final path segment.
    */
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

    try {
      control.click();

      return true;
    } catch {
      return false;
    }
  }

  function commitProjectedTap(
    pointer,
    event
  ) {
    if (
      !pointer.downSemanticObjectId ||
      !pointer.semanticControl ||
      !projectedSelectionAllowed()
    ) {
      cancelSemanticPreview(
        pointer,
        "tap-projection-unavailable"
      );

      armClickSuppression(
        projectedSuppressionTarget(),
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
      !releaseHit ||
      normalize(
        releaseHit.semanticObjectId
      ) !==
        pointer.downSemanticObjectId
    ) {
      cancelSemanticPreview(
        pointer,
        "tap-correspondence-mismatch"
      );

      armClickSuppression(
        projectedSuppressionTarget(),
        event.clientX,
        event.clientY,
        "projected-tap-rejected"
      );

      return false;
    }

    cancelSemanticPreview(
      pointer,
      "native-semantic-activation"
    );

    armClickSuppression(
      projectedSuppressionTarget(),
      event.clientX,
      event.clientY,
      "projected-semantic-activation"
    );

    const activated =
      activateSemanticControl(
        pointer.semanticControl
      );

    if (activated) {
      state.counters.projectedTapsCommitted +=
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
      if (control) {
        armClickSuppression(
          control,
          event.clientX,
          event.clientY,
          "compass-tap-rejected"
        );
      }

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

    const correspondence =
      releaseElement === control ||
      (
        releaseElement &&
        control.contains(
          releaseElement
        )
      );

    if (!correspondence) {
      armClickSuppression(
        control,
        event.clientX,
        event.clientY,
        "compass-tap-rejected"
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
      state.counters.compassTapsCommitted +=
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
      readController();

    const frame =
      readControllerFrame();

    if (
      !controller ||
      !frame ||
      frame.controllerReady !==
        true ||
      frame.held ===
        true ||
      frame.disposed ===
        true
    ) {
      return false;
    }

    cancelSemanticPreview(
      pointer,
      "cluster-flick-return"
    );

    const activeClusterId =
      normalize(
        frame.activeClusterId
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
            activeClusterId
          ) !== false;
      } else {
        committed =
          controller.returnToOrbit({
            source:
              "pointer-flick"
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
        : "cluster-flick-return-rejected",
      {
        activeClusterId:
          activeClusterId ||
          null,

        directSemanticOrigin:
          pointer.directSemanticEvidence,

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

    cancelSemanticPreview(
      pointer,
      reason
    );

    if (
      pointer.dragging ||
      pointer.maximumDistance >
        CONFIG.maximumTapDistancePx ||
      pointer.directSemanticControl
    ) {
      armClickSuppression(
        suppressionTargetForPointer(
          pointer
        ),
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

        dragging:
          pointer.dragging,

        directSemanticOrigin:
          pointer.directSemanticEvidence
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
            pointer.territory,

          directSemanticOrigin:
            pointer.directSemanticEvidence
        }
      );

      return null;
    }

    state.counters.pointerDown +=
      1;

    if (
      pointer.territory ===
        "projected-object"
    ) {
      beginSemanticPreview(
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

        directSemanticOrigin:
          pointer.directSemanticEvidence,

        activeClusterId:
          pointer.activeClusterId ||
          null
      }
    );

    return pointer;
  }

  function handlePointerDown(event) {
    if (
      state.pointer ||
      state.disposed ||
      state.failed ||
      !state.runtimeSurfacesActivated ||
      !isPrimaryPointerEvent(event) ||
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

    if (compassControl) {
      if (!controllerInteractionAllowed()) {
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
        null
      );

      return;
    }

    const directSemanticControl =
      resolveDirectSemanticControl(
        event.target
      );

    if (
      !projectedSelectionAllowed() &&
      directSemanticControl
    ) {
      return;
    }

    if (!projectedSelectionAllowed()) {
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
      null,
      directSemanticControl
    );
  }

  function handlePointerMove(event) {
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
          "controller-state-invalid"
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

      cancelSemanticPreview(
        pointer,
        "drag-recognized"
      );
    }

    if (pointer.dragging) {
      event.preventDefault();
    }
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
      cancelSemanticPreview(
        pointer,
        "pointer-cancelled"
      );

      if (
        pointer.dragging ||
        pointer.maximumDistance >
          CONFIG.maximumTapDistancePx ||
        pointer.directSemanticControl
      ) {
        armClickSuppression(
          suppressionTargetForPointer(
            pointer
          ),
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
      cancelSemanticPreview(
        pointer,
        "compass-release-controller-invalid"
      );

      armClickSuppression(
        pointer.compassControl ||
        state.orbitField,
        releaseX,
        releaseY,
        "compass-release-controller-invalid"
      );

      outcome =
        "runtime-invalid";
    } else if (
      pointer.territory !==
        "compass" &&
      !projectedSelectionAllowed()
    ) {
      cancelSemanticPreview(
        pointer,
        "release-projection-invalid"
      );

      armClickSuppression(
        projectedSuppressionTarget(),
        releaseX,
        releaseY,
        "release-projection-invalid"
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
            : "tap-rejected";
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
            : "tap-rejected";
      } else if (
        pointer.territory ===
          "orbit-field" &&
        pointer.directSemanticControl
      ) {
        cancelSemanticPreview(
          pointer,
          "projected-hit-miss"
        );

        armClickSuppression(
          projectedSuppressionTarget(),
          releaseX,
          releaseY,
          "projected-hit-miss"
        );

        state.counters.projectedHitMissesRejected +=
          1;

        outcome =
          "projected-hit-miss";
      } else {
        cancelSemanticPreview(
          pointer,
          "empty-field-tap"
        );

        outcome =
          "empty-field-tap";
      }
    } else if (pointer.dragging) {
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
        suppressionTargetForPointer(
          pointer
        ),
        releaseX,
        releaseY,
        flick.qualifies
          ? "flick-completion"
          : "drag-completion"
      );

      cancelSemanticPreview(
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
            ? "cluster-flick"
            : "cluster-flick-rejected";
      } else {
        state.counters.dragsConsumed +=
          1;

        outcome =
          "drag-consumed";
      }
    } else {
      cancelSemanticPreview(
        pointer,
        "ambiguous-release"
      );

      armClickSuppression(
        suppressionTargetForPointer(
          pointer
        ),
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

        directSemanticOrigin:
          pointer.directSemanticEvidence,

        activeClusterId:
          pointer.activeClusterId ||
          null,

        flick
      }
    );
  }

  function handlePointerUp(event) {
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

  function handlePointerCancel(event) {
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

  function handleContextMenu(event) {
    if (
      state.pointer &&
      state.pointer.dragging &&
      isInsideOrbitField(
        event.target
      )
    ) {
      event.preventDefault();
    }
  }

  function handleDragStart(event) {
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

  function handleControllerFrameChange() {
    const previousReducedMotion =
      state.reducedMotion;

    const frame =
      refreshControllerDerivedState();

    if (
      state.pointer &&
      previousReducedMotion !==
        state.reducedMotion
    ) {
      interruptActivePointer(
        "reduced-motion-transition"
      );
    }

    if (
      state.pointer &&
      (
        !frame ||
        frame.controllerReady !==
          true ||
        frame.disposed ===
          true ||
        frame.held ===
          true
      )
    ) {
      interruptActivePointer(
        "controller-frame-invalid"
      );
    }

    attemptRuntimeActivation(
      "controller-frame"
    );
  }

  function handleReducedMotionMediaChange() {
    const previousReducedMotion =
      state.reducedMotion;

    refreshControllerDerivedState();

    if (
      state.pointer &&
      previousReducedMotion !==
        state.reducedMotion
    ) {
      interruptActivePointer(
        "reduced-motion-transition"
      );
    }

    publishReceipt(
      "reduced-motion-observed"
    );
  }

  function handleCrystalsReady() {
    refreshControllerDerivedState();

    attemptRuntimeActivation(
      "crystals-ready"
    );
  }

  function handleCrystalsUnavailable(
    reason
  ) {
    state.crystalsAvailable =
      false;

    interruptActivePointer(
      reason
    );

    publishReceipt(
      "projected-crystal-interaction-unavailable",
      {
        reason,

        nativeSemanticFallbackPreserved:
          true,

        fixedCompassPreserved:
          true
      }
    );
  }

  function prepareOrbitField() {
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

    state.orbitField.style.webkitUserSelect =
      "none";

    state.orbitField.style.userSelect =
      "none";
  }

  function restoreOrbitField() {
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

  function activateRuntimeSurfaces(
    reason
  ) {
    if (
      state.runtimeSurfacesActivated ||
      state.disposed ||
      state.failed
    ) {
      return false;
    }

    prepareOrbitField();
    initializeRuntimeListeners();

    state.runtimeSurfacesActivated =
      true;

    state.waitingForRuntime =
      false;

    state.ready =
      true;

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

          projectedTapSelection:
            true,

          semanticPreview:
            true,

          dragClassification:
            true,

          flickClassification:
            true,

          clusterFlickReturn:
            true,

          fixedCompassIndependent:
            true,

          nativeSemanticFallbackPreserved:
            true,

          directSemanticOriginEvidenceOnly:
            true,

          continuousDirectManipulation:
            false,

          minimumDragDistancePx:
            CONFIG.minimumDragDistancePx,

          maximumTapDistancePx:
            CONFIG.maximumTapDistancePx,

          suppressClickMs:
            CONFIG.suppressClickMs,

          sampleWindowMs:
            CONFIG.sampleWindowMs,

          maximumSamples:
            CONFIG.maximumSamples
        }
      );

      dispatch(
        EVENTS.interactionsReady,
        {
          reason,

          form:
            "A",

          projectedTapSelection:
            true,

          semanticPreview:
            true,

          dragClassification:
            true,

          flickClassification:
            true,

          clusterFlickReturn:
            true,

          fixedCompassIndependent:
            true,

          nativeSemanticFallbackPreserved:
            true,

          directSemanticOriginEvidenceOnly:
            true,

          continuousDirectManipulation:
            false,

          api: [
            "getState",
            "cancelGesture",
            "dispose"
          ]
        }
      );
    }

    return true;
  }

  function deactivateRuntimeSurfaces(
    reason
  ) {
    if (!state.runtimeSurfacesActivated) {
      return false;
    }

    interruptActivePointer(
      reason
    );

    removeListenerRegistry(
      state.runtimeListeners
    );

    restoreOrbitField();

    state.runtimeSurfacesActivated =
      false;

    state.ready =
      false;

    state.counters.runtimeDeactivations +=
      1;

    return true;
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

    refreshControllerDerivedState();

    const controllerReady =
      controllerInteractionAllowed();

    const projectionReady =
      compositorProjectionReady();

    if (
      !controllerReady ||
      !projectionReady
    ) {
      state.waitingForRuntime =
        true;

      publishReceipt(
        "waiting-for-runtime",
        {
          reason,

          controllerReady,

          compositorProjectionReady:
            projectionReady
        }
      );

      return false;
    }

    return activateRuntimeSurfaces(
      reason
    );
  }

  function enterTerminalFailure(
    reason,
    error = null
  ) {
    if (
      state.failed ||
      state.disposed
    ) {
      return false;
    }

    deactivateRuntimeSurfaces(
      reason
    );

    state.failed =
      true;

    state.ready =
      false;

    state.waitingForRuntime =
      false;

    const errorPayload =
      error
        ? {
            name:
              error instanceof Error
                ? error.name
                : "Error",

            message:
              error instanceof Error
                ? error.message
                : String(error)
          }
        : null;

    publishReceipt(
      "runtime-failed",
      {
        reason,

        error:
          errorPayload,

        nativeSemanticFallbackPreserved:
          true,

        fixedCompassNativeControlPreserved:
          true,

        rootReadinessMutated:
          false,

        crystalReadinessMutated:
          false
      }
    );

    dispatch(
      EVENTS.interactionsFailed,
      {
        reason,

        error:
          errorPayload,

        nativeSemanticFallbackPreserved:
          true
      }
    );

    return true;
  }

  function initializeCoreListeners() {
    /*
      Click suppression is core-managed because an interruption may arm
      suppression immediately before projected runtime listeners are removed.
      The capture listener must remain alive until final disposal or rollback.
    */
    addCoreListener(
      document,
      "click",
      handleClickCapture,
      true
    );

    addCoreListener(
      window,
      EVENTS.controllerReady,
      () => {
        attemptRuntimeActivation(
          "controller-ready"
        );
      }
    );

    addCoreListener(
      window,
      EVENTS.controllerFrameChanged,
      handleControllerFrameChange
    );

    addCoreListener(
      window,
      EVENTS.controllerStateChanged,
      handleControllerFrameChange
    );

    addCoreListener(
      window,
      EVENTS.compositorReady,
      () => {
        attemptRuntimeActivation(
          "compositor-ready"
        );
      }
    );

    addCoreListener(
      window,
      EVENTS.compositorFailed,
      event => {
        enterTerminalFailure(
          "compositor-failed",
          event &&
          event.detail &&
          event.detail.error
            ? event.detail.error
            : null
        );
      }
    );

    addCoreListener(
      window,
      EVENTS.compositorDisposed,
      () => {
        dispose(
          "compositor-disposed"
        );
      }
    );

    addCoreListener(
      window,
      EVENTS.crystalsReady,
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
      EVENTS.crystalsDisposed,
      () => {
        handleCrystalsUnavailable(
          "crystals-disposed"
        );
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

          return;
        }

        dispose(
          "pagehide"
        );
      }
    );
  }

  function initializeReducedMotion() {
    if (
      typeof window.matchMedia !==
        "function"
    ) {
      state.reducedMotionQuery =
        null;

      refreshControllerDerivedState();

      return;
    }

    state.reducedMotionQuery =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    refreshControllerDerivedState();

    if (
      typeof state.reducedMotionQuery
        .addEventListener ===
        "function"
    ) {
      addCoreListener(
        state.reducedMotionQuery,
        "change",
        handleReducedMotionMediaChange
      );
    } else if (
      typeof state.reducedMotionQuery
        .addListener ===
        "function"
    ) {
      state.reducedMotionQuery.addListener(
        handleReducedMotionMediaChange
      );

      state.coreListeners.push(() => {
        if (
          state.reducedMotionQuery &&
          typeof state.reducedMotionQuery
            .removeListener ===
            "function"
        ) {
          state.reducedMotionQuery.removeListener(
            handleReducedMotionMediaChange
          );
        }
      });
    }
  }

  function discoverDom() {
    state.root =
      document.querySelector(
        SELECTORS.root
      );

    state.receipt =
      document.querySelector(
        SELECTORS.receipt
      );

    state.orbitField =
      document.querySelector(
        SELECTORS.orbitField
      );
  }

  function validateCoreDependencies() {
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

    const controller =
      readController();

    if (!controller) {
      issues.push(
        `Missing compatible controller ${CONTROLLER_CONTRACT}.`
      );
    }

    const compositor =
      readCompositor();

    if (!compositor) {
      issues.push(
        `Missing compatible compositor ${COMPOSITOR_CONTRACT}.`
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

        controllerContract:
          CONTROLLER_CONTRACT,

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
      /* Best-effort API cleanup. */
    }

    state.apiExposed =
      false;
  }

  function rollbackInitialization(
    error
  ) {
    interruptActivePointer(
      "initialization-rollback"
    );

    deactivateRuntimeSurfaces(
      "initialization-rollback"
    );

    removeListenerRegistry(
      state.coreListeners
    );

    removeApi();
    restoreOrbitField();

    state.initialized =
      false;

    state.initializing =
      false;

    state.failed =
      true;

    state.ready =
      false;

    state.readyPublished =
      false;

    state.waitingForRuntime =
      false;

    state.controller =
      null;

    state.compositor =
      null;

    state.reducedMotionQuery =
      null;

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

        semanticPreviewCancelled:
          true,

        orbitFieldRestored:
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
        validateCoreDependencies();

      if (issues.length) {
        throw new Error(
          issues.join(" ")
        );
      }

      initializeReducedMotion();
      initializeCoreListeners();
      exposeApi();

      state.initialized =
        true;

      state.initializing =
        false;

      state.failed =
        false;

      state.ready =
        false;

      state.waitingForRuntime =
        true;

      publishReceipt(
        "core-initialized",
        {
          runtimeReadiness:
            "pending-or-ready",

          pointerRuntimeDeferred:
            true,

          directSemanticOriginEvidenceOnly:
            true,

          rootReadinessMutated:
            false
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

    interruptActivePointer(
      `dispose:${normalize(reason) || "api"}`
    );

    state.disposed =
      true;

    state.ready =
      false;

    state.waitingForRuntime =
      false;

    deactivateRuntimeSurfaces(
      `dispose:${normalize(reason) || "api"}`
    );

    removeListenerRegistry(
      state.coreListeners
    );

    removeApi();
    restoreOrbitField();

    state.suppressedClick =
      null;

    state.controller =
      null;

    state.compositor =
      null;

    state.reducedMotionQuery =
      null;

    state.initialized =
      false;

    state.initializing =
      false;

    publishReceipt(
      "disposed",
      {
        reason,

        pointerReleased:
          true,

        semanticPreviewCancelled:
          true,

        listenersRemoved:
          true,

        orbitFieldRestored:
          true,

        nativeSemanticFallbackPreserved:
          true,

        rootReadinessMutated:
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

  /*
    Bootstrap listener only. Stateful runtime listeners are installed and
    removed through the managed core/runtime registries above.
  */
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

/* TARGET FILE: /showroom/index.interactions.js */
/* TNT FULL-FILE REPLACEMENT */
/* SHOWROOM_COMPLETE_QUATERNION_INTERACTIONS_TNT_v6_HELPER_INTEGRATED */

(() => {
  "use strict";

  const CONTRACT = "SHOWROOM_COMPLETE_QUATERNION_INTERACTIONS_TNT_v6";
  const OWNER = "/showroom/index.interactions.js";

  const CONTROLLER_GLOBAL = "SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER";
  const CONTROLLER_MODULE_ID = "SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER";
  const CONTROLLER_MODULE_VERSION = "7.0.0-controller-interaction-semantic-priority";

  const EXPECTED_INTERACTION_MODULE_ID = "DGB_ARCHCOIN_INTERACTIONS";
  const EXPECTED_INTERACTION_MODULE_VERSION = "1.0.0-pointer-gesture-interpreter";

  const COMPOSITOR_GLOBAL = "SHOWROOM_COMPOSITOR";
  const COMPOSITOR_CONTRACT = "SHOWROOM_CONSTELLATION_SINGLE_FRAME_COMPOSITOR_TNT_v5";

  const GESTURES_GLOBAL = "SHOWROOM_INTERACTION_GESTURES";
  const GESTURES_CONTRACT = "SHOWROOM_INTERACTION_GESTURE_SUPPORT_TNT_v1";

  const EVENTS = Object.freeze({
    controllerReady: "SHOWROOM_CONTROLLER_READY",
    controllerFailure: "SHOWROOM_CONTROLLER_FAILURE",
    compositorReady: "SHOWROOM_COMPOSITOR_READY",
    compositorFailure: "SHOWROOM_COMPOSITOR_FAILURE",
    compositorDisposed: "SHOWROOM_COMPOSITOR_DISPOSED",
    compositorProjectionChanged: "SHOWROOM_COMPOSITOR_PROJECTION_CHANGED",
    crystalsReady: "SHOWROOM_CRYSTALS_READY",
    crystalsFailure: "ARCHCOIN_CRYSTALS_RENDER_FAILURE",
    crystalsDisposed: "SHOWROOM_CRYSTALS_DISPOSED",
    interactionsReady: "SHOWROOM_INTERACTIONS_READY",
    interactionsFailure: "SHOWROOM_INTERACTIONS_FAILURE",
    interactionsDisposed: "SHOWROOM_INTERACTIONS_DISPOSED",
    interactionsReceipt: "SHOWROOM_INTERACTIONS_RECEIPT"
  });

  const SELECTORS = Object.freeze({
    root: "[data-showroom-root]",
    orbitField: "[data-showroom-orbit-field]",
    receipt: "[data-showroom-interactions-receipt]",
    cardinalControl: "[data-showroom-cardinal-control][data-showroom-cardinal-id]",
    roomControl:
      "[data-showroom-child-control][data-showroom-child-id]" +
      "[data-showroom-cardinal-id]",
    compassControl: "[data-showroom-compass-control]",
    semanticControl: [
      "[data-showroom-cardinal-control][data-showroom-cardinal-id]",
      "[data-showroom-child-control][data-showroom-child-id]",
      "[data-showroom-compass-control]"
    ].join(","),
    protectedTarget: [
      "[data-showroom-controller-panel]",
      "[data-showroom-diamond-stage]",
      "[data-showroom-window-control]",
      "[data-showroom-diamond-controls]",
      "[data-showroom-gauge-dashboard]",
      "[data-showroom-information-tabs]",
      "[data-showroom-controller-enter]",
      "[data-showroom-controller-return-to-orbit]",
      "[data-showroom-controller-return-home-compass]",
      "dialog",
      "input",
      "textarea",
      "select",
      "summary"
    ].join(",")
  });

  const NAVIGATION_STATES = Object.freeze({
    SYSTEM_HELD: "SYSTEM_HELD"
  });

  const PRESENTATION_MODES = Object.freeze({
    CONSTELLATION: "CONSTELLATION",
    CLUSTER: "CLUSTER",
    HELD: "HELD"
  });

  const GESTURE_SCOPES = Object.freeze({
    ORBIT: "orbit",
    CLUSTER: "cluster"
  });

  const TERRITORIES = Object.freeze({
    COMPASS: "compass",
    CARDINAL: "cardinal",
    ROOM: "room",
    FIELD: "field",
    NATIVE_SEMANTIC: "native-semantic"
  });

  const SEMANTIC_KINDS = Object.freeze({
    CARDINAL: "cardinal",
    ROOM: "room",
    COMPASS: "compass"
  });

  const CONFIG = Object.freeze({
    dragDeadZonePx: 7,
    maximumTapDistancePx: 14,
    minimumCommitDistancePx: 8,
    radiansPerViewport: Math.PI * 1.14,
    maximumPitchRadians: Math.PI * 0.72,
    maximumSamples: 20,
    sampleWindowMs: 150,
    flickMaximumDurationMs: 285,
    flickMinimumDistancePx: 50,
    flickMinimumAverageVelocityPxPerMs: 0.50,
    flickMinimumReleaseVelocityPxPerMs: 0.64,
    flickMinimumDirectionalRatio: 1.20,
    flickMaximumPauseBeforeReleaseMs: 115,
    flickMaximumPathEfficiencyLoss: 0.32,
    suppressClickMs: 560,
    runtimeRetryLimit: 160,
    runtimeRetryIntervalMs: 100
  });

  const WINGS = Object.freeze(["north", "east", "south", "west"]);

  const state = {
    root: null,
    orbitField: null,
    receipt: null,
    controller: null,
    compositor: null,
    gestures: null,
    controllerFrame: null,
    compositorState: null,
    controllerFrameUnsubscribe: null,
    controllerHeldUnsubscribe: null,
    pointer: null,
    suppressedClick: null,
    initialized: false,
    initializing: false,
    runtimeActive: false,
    waitingForRuntime: true,
    readyPublished: false,
    failed: false,
    disposed: false,
    apiExposed: false,
    coreListeners: [],
    runtimeListeners: [],
    nativeOrbitFieldStyle: null,
    orbitFieldStyleCaptured: false,
    retryTimer: 0,
    retryCount: 0,
    lastReceiptSignature: "",
    counters: {
      readinessChecks: 0,
      runtimeActivations: 0,
      runtimeDeactivations: 0,
      pointerDown: 0,
      pointerMove: 0,
      pointerUp: 0,
      pointerCancel: 0,
      pointerCaptureFailures: 0,
      compositorHits: 0,
      compositorMisses: 0,
      projectedTapCommits: 0,
      projectedTapRejects: 0,
      nativeCardinalCommits: 0,
      nativeRoomCommits: 0,
      nativeCompassCommits: 0,
      nativeSemanticRejects: 0,
      orbitBegins: 0,
      orbitPreviews: 0,
      orbitCommits: 0,
      orbitCancels: 0,
      clusterBegins: 0,
      clusterPreviews: 0,
      clusterCommits: 0,
      clusterCancels: 0,
      flicksQualified: 0,
      clusterReturns: 0,
      nativeClicksSuppressed: 0,
      interruptions: 0,
      failures: 0
    }
  };

  function normalize(value) {
    return String(value == null ? "" : value).trim();
  }

  function normalizeLower(value) {
    return normalize(value).toLowerCase();
  }

  function normalizeUpper(value) {
    return normalize(value).toUpperCase();
  }

  function normalizeWing(value) {
    const wing = normalizeLower(value);
    return WINGS.includes(wing) ? wing : "";
  }

  function normalizeRoomId(value) {
    return normalize(value);
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function isElement(value) {
    return typeof Element !== "undefined" && value instanceof Element;
  }

  function freezePlain(value) {
    if (value === null || typeof value !== "object") {
      return value;
    }

    if (Object.isFrozen(value)) {
      return value;
    }

    if (Array.isArray(value)) {
      return Object.freeze(value.map(freezePlain));
    }

    const output = {};
    for (const [key, entry] of Object.entries(value)) {
      output[key] = freezePlain(entry);
    }

    return Object.freeze(output);
  }

  function dispatch(eventName, detail = {}) {
    const payload = freezePlain({
      contract: CONTRACT,
      owner: OWNER,
      controllerModuleId: CONTROLLER_MODULE_ID,
      controllerModuleVersion: CONTROLLER_MODULE_VERSION,
      compositorContract: COMPOSITOR_CONTRACT,
      gestureHelperContract: GESTURES_CONTRACT,
      timestamp: nowIso(),
      ...detail
    });

    window.dispatchEvent(
      new CustomEvent(eventName, {
        detail: payload
      })
    );

    return payload;
  }

  function createReceipt(event, detail = {}) {
    const pointer = state.pointer;

    return freezePlain({
      contract: CONTRACT,
      owner: OWNER,
      event,
      timestamp: nowIso(),
      initialized: state.initialized,
      initializing: state.initializing,
      runtimeActive: state.runtimeActive,
      waitingForRuntime: state.waitingForRuntime,
      readyPublished: state.readyPublished,
      failed: state.failed,
      disposed: state.disposed,
      controllerAvailable: Boolean(state.controller),
      compositorAvailable: Boolean(state.compositor),
      gestureHelperAvailable: Boolean(state.gestures),
      pointerActive: Boolean(pointer),
      pointer: pointer
        ? {
            pointerId: pointer.pointerId,
            pointerType: pointer.pointerType,
            territory: pointer.territory,
            gestureScope: pointer.gestureScope,
            dragging: pointer.dragging,
            finishing: pointer.finishing,
            cancelled: pointer.cancelled,
            controllerGestureActive: pointer.controllerGestureActive,
            previewAccepted: pointer.previewAccepted,
            activeWing: pointer.activeWing || null,
            downIdentity: pointer.downIdentity || null,
            previewPrimaryId: pointer.previewPrimaryId || null
          }
        : null,
      counters: {
        ...state.counters
      },
      ...detail
    });
  }

  function publishReceipt(event, detail = {}) {
    const payload = createReceipt(event, detail);
    const signature = JSON.stringify({
      event,
      runtimeActive: payload.runtimeActive,
      waitingForRuntime: payload.waitingForRuntime,
      failed: payload.failed,
      disposed: payload.disposed,
      pointerActive: payload.pointerActive,
      detail
    });

    if (
      event === "waiting-for-runtime" &&
      signature === state.lastReceiptSignature
    ) {
      return payload;
    }

    state.lastReceiptSignature = signature;

    if (state.receipt) {
      const serialized = JSON.stringify(payload);

      if ("value" in state.receipt) {
        state.receipt.value = serialized;
      }

      state.receipt.textContent = serialized;
    }

    dispatch(EVENTS.interactionsReceipt, payload);
    return payload;
  }

  function addManagedListener(registry, target, type, handler, options) {
    if (!target || typeof target.addEventListener !== "function") {
      return false;
    }

    target.addEventListener(type, handler, options);

    registry.push(() => {
      target.removeEventListener(type, handler, options);
    });

    return true;
  }

  function addCoreListener(target, type, handler, options) {
    return addManagedListener(state.coreListeners, target, type, handler, options);
  }

  function addRuntimeListener(target, type, handler, options) {
    return addManagedListener(state.runtimeListeners, target, type, handler, options);
  }

  function removeListenerRegistry(registry) {
    for (const remove of registry.splice(0)) {
      try {
        remove();
      } catch {
        /* Best-effort cleanup. */
      }
    }
  }

  function sameMajorVersion(actual, expected) {
    const actualMajor = normalize(actual).split(".")[0];
    const expectedMajor = normalize(expected).split(".")[0];

    return Boolean(actualMajor && expectedMajor && actualMajor === expectedMajor);
  }

  function validGesturesApi(gestures) {
    return Boolean(
      gestures &&
        typeof gestures === "object" &&
        gestures.contract === GESTURES_CONTRACT &&
        typeof gestures.orientationQuaternion === "function" &&
        typeof gestures.dragQuaternion === "function" &&
        typeof gestures.primaryWingForQuaternion === "function" &&
        typeof gestures.primaryRoomForQuaternion === "function" &&
        typeof gestures.appendSample === "function" &&
        typeof gestures.classifyFlick === "function" &&
        typeof gestures.distance2d === "function"
    );
  }

  function resolveGestures() {
    const gestures = window[GESTURES_GLOBAL];

    if (!validGesturesApi(gestures)) {
      state.gestures = null;
      return null;
    }

    state.gestures = gestures;
    return gestures;
  }

  function discoverDom() {
    state.root = document.querySelector(SELECTORS.root);
    state.orbitField = state.root
      ? state.root.querySelector(SELECTORS.orbitField)
      : null;
    state.receipt = state.root
      ? state.root.querySelector(SELECTORS.receipt)
      : null;
  }

  function validateDom() {
    const issues = [];

    if (!state.root) {
      issues.push("Missing [data-showroom-root].");
    }

    if (!state.orbitField) {
      issues.push("Missing [data-showroom-orbit-field].");
    }

    if (
      state.root &&
      state.orbitField &&
      !state.root.contains(state.orbitField)
    ) {
      issues.push("The Showroom orbit field is outside the Showroom root.");
    }

    return issues;
  }

  function validControllerApi(controller) {
    return Boolean(
      controller &&
        typeof controller === "object" &&
        controller.moduleId === CONTROLLER_MODULE_ID &&
        sameMajorVersion(controller.moduleVersion, CONTROLLER_MODULE_VERSION) &&
        controller.interactionModuleId === EXPECTED_INTERACTION_MODULE_ID &&
        sameMajorVersion(
          controller.interactionModuleVersion,
          EXPECTED_INTERACTION_MODULE_VERSION
        ) &&
        typeof controller.getFrameState === "function" &&
        typeof controller.subscribeFrameState === "function" &&
        typeof controller.beginOrbitGesture === "function" &&
        typeof controller.requestOrbitPreview === "function" &&
        typeof controller.requestOrbitCommit === "function" &&
        typeof controller.requestOrbitCancel === "function" &&
        typeof controller.beginClusterGesture === "function" &&
        typeof controller.requestClusterPreview === "function" &&
        typeof controller.requestClusterCommit === "function" &&
        typeof controller.requestClusterCancel === "function" &&
        typeof controller.requestCardinalSelection === "function" &&
        typeof controller.requestRoomSelection === "function" &&
        typeof controller.requestCompassSelection === "function" &&
        typeof controller.requestReturnToConstellation === "function"
    );
  }

  function validControllerFrame(frame) {
    return Boolean(
      frame &&
        typeof frame === "object" &&
        frame.moduleId === CONTROLLER_MODULE_ID &&
        sameMajorVersion(frame.moduleVersion, CONTROLLER_MODULE_VERSION) &&
        typeof frame.state === "string" &&
        typeof frame.navigationState === "string" &&
        typeof frame.presentationMode === "string" &&
        typeof frame.held === "boolean" &&
        frame.orbitOrientation &&
        Array.isArray(frame.orbitOrientation.quaternion) &&
        frame.orbitOrientation.quaternion.length === 4 &&
        (
          frame.cluster === null ||
          (
            frame.cluster &&
            typeof frame.cluster === "object"
          )
        )
    );
  }

  function resolveController() {
    const controller = window[CONTROLLER_GLOBAL];

    if (!validControllerApi(controller)) {
      state.controller = null;
      state.controllerFrame = null;
      return null;
    }

    state.controller = controller;
    return controller;
  }

  function readControllerFrame(force = false) {
    if (!force && validControllerFrame(state.controllerFrame)) {
      return state.controllerFrame;
    }

    const controller = state.controller || resolveController();

    if (!controller) {
      return null;
    }

    try {
      const frame = controller.getFrameState();

      if (!validControllerFrame(frame)) {
        return null;
      }

      state.controllerFrame = frame;
      return frame;
    } catch {
      return null;
    }
  }

  function controllerInteractionAllowed(frame = null) {
    const resolvedFrame = frame || readControllerFrame();

    return Boolean(
      resolvedFrame &&
        resolvedFrame.held === false &&
        resolvedFrame.navigationState !== NAVIGATION_STATES.SYSTEM_HELD &&
        resolvedFrame.disposed !== true &&
        resolvedFrame.failed !== true
    );
  }

  function validCompositorApi(compositor) {
    return Boolean(
      compositor &&
        typeof compositor === "object" &&
        compositor.contract === COMPOSITOR_CONTRACT &&
        typeof compositor.getState === "function" &&
        typeof compositor.hitTest === "function"
    );
  }

  function resolveCompositor() {
    const compositor = window[COMPOSITOR_GLOBAL];

    if (!validCompositorApi(compositor)) {
      state.compositor = null;
      state.compositorState = null;
      return null;
    }

    state.compositor = compositor;
    return compositor;
  }

  function readCompositorState(force = false) {
    if (!force && state.compositorState) {
      return state.compositorState;
    }

    const compositor = state.compositor || resolveCompositor();

    if (!compositor) {
      return null;
    }

    try {
      const compositorState = compositor.getState();

      if (
        !compositorState ||
        compositorState.contract !== COMPOSITOR_CONTRACT
      ) {
        return null;
      }

      state.compositorState = compositorState;
      return compositorState;
    } catch {
      return null;
    }
  }

  function compositorProjectionReady(compositorState = null) {
    const resolvedState = compositorState || readCompositorState();

    return Boolean(
      resolvedState &&
        resolvedState.initialized === true &&
        resolvedState.readyPublished === true &&
        resolvedState.controllerReady === true &&
        resolvedState.failed !== true &&
        resolvedState.disposed !== true &&
        resolvedState.held !== true
    );
  }

  function runtimeSnapshot(force = false) {
    const gestures = state.gestures || resolveGestures();
    const controller = state.controller || resolveController();
    const compositor = state.compositor || resolveCompositor();
    const frame = readControllerFrame(force);
    const compositorState = readCompositorState(force);

    const controllerReady = Boolean(controller && controllerInteractionAllowed(frame));
    const compositorReady = Boolean(compositor && compositorProjectionReady(compositorState));
    const gesturesReady = Boolean(gestures);

    return Object.freeze({
      gestures,
      controller,
      compositor,
      frame,
      compositorState,
      gesturesReady,
      controllerReady,
      compositorReady,
      ready: Boolean(gesturesReady && controllerReady && compositorReady)
    });
  }

  function runtimeReady() {
    return runtimeSnapshot().ready;
  }

  function isPrimaryPointerEvent(event) {
    if (event.pointerType === "mouse" && event.button !== 0) {
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
        target.closest(SELECTORS.protectedTarget)
    );
  }

  function resolveSemanticControl(target) {
    if (!isElement(target) || !state.orbitField) {
      return null;
    }

    const control = target.closest(SELECTORS.semanticControl);

    return control && state.orbitField.contains(control)
      ? control
      : null;
  }

  function semanticKindFromControl(control) {
    if (!control) {
      return "";
    }

    if (control.matches(SELECTORS.compassControl)) {
      return SEMANTIC_KINDS.COMPASS;
    }

    if (control.matches(SELECTORS.roomControl)) {
      return SEMANTIC_KINDS.ROOM;
    }

    if (control.matches(SELECTORS.cardinalControl)) {
      return SEMANTIC_KINDS.CARDINAL;
    }

    return "";
  }

  function semanticIdentityFromControl(control) {
    if (!control) {
      return "";
    }

    const kind = semanticKindFromControl(control);

    if (kind === SEMANTIC_KINDS.ROOM) {
      return normalizeRoomId(control.dataset.showroomChildId);
    }

    if (kind === SEMANTIC_KINDS.CARDINAL) {
      return normalizeWing(control.dataset.showroomCardinalId);
    }

    if (kind === SEMANTIC_KINDS.COMPASS) {
      return "home-compass";
    }

    return "";
  }

  function semanticControlEnabled(control) {
    return Boolean(
      control &&
        !control.matches(":disabled") &&
        control.getAttribute("aria-disabled") !== "true"
    );
  }

  function deriveHitIdentity(hit) {
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

  function roomOrdinal(roomId) {
    const match = normalizeRoomId(roomId).match(/-(\d+)$/);

    if (!match) {
      return 0;
    }

    const ordinal = Number(match[1]);
    return ordinal >= 1 && ordinal <= 4 ? ordinal : 0;
  }

  function semanticKindFromHit(hit) {
    if (!hit) {
      return "";
    }

    const kind = normalizeLower(hit.kind);

    if (kind === "room" || kind === "child") {
      return SEMANTIC_KINDS.ROOM;
    }

    if (kind === "cardinal" || kind === "coin") {
      return SEMANTIC_KINDS.CARDINAL;
    }

    if (normalize(hit.childId)) {
      return SEMANTIC_KINDS.ROOM;
    }

    if (normalizeWing(hit.cardinalId)) {
      return SEMANTIC_KINDS.CARDINAL;
    }

    const identity = deriveHitIdentity(hit);

    if (roomOrdinal(identity) > 0) {
      return SEMANTIC_KINDS.ROOM;
    }

    if (normalizeWing(identity)) {
      return SEMANTIC_KINDS.CARDINAL;
    }

    return "";
  }

  function semanticIdentityFromHit(hit, kind = semanticKindFromHit(hit)) {
    if (!hit) {
      return "";
    }

    if (kind === SEMANTIC_KINDS.ROOM) {
      return normalizeRoomId(
        hit.childId ||
          hit.semanticObjectId ||
          hit.projectionId ||
          hit.id
      );
    }

    if (kind === SEMANTIC_KINDS.CARDINAL) {
      return normalizeWing(
        hit.cardinalId ||
          hit.semanticObjectId ||
          hit.projectionId ||
          hit.id
      );
    }

    return "";
  }

  function authoritativeHitTest(clientX, clientY) {
    if (!runtimeReady()) {
      return null;
    }

    const compositor = state.compositor || resolveCompositor();

    if (!compositor) {
      return null;
    }

    try {
      const hit = compositor.hitTest(clientX, clientY);

      if (!hit || !deriveHitIdentity(hit)) {
        state.counters.compositorMisses += 1;
        return null;
      }

      state.counters.compositorHits += 1;
      return hit;
    } catch {
      state.counters.compositorMisses += 1;
      return null;
    }
  }

  function hitsCorrespond(first, second) {
    if (!first || !second) {
      return false;
    }

    const firstKind = semanticKindFromHit(first);
    const secondKind = semanticKindFromHit(second);
    const firstIdentity = semanticIdentityFromHit(first, firstKind);
    const secondIdentity = semanticIdentityFromHit(second, secondKind);

    return Boolean(
      firstKind &&
        secondKind &&
        firstKind === secondKind &&
        firstIdentity &&
        secondIdentity &&
        firstIdentity === secondIdentity
    );
  }

  function presentationMode(frame) {
    if (!frame || frame.held === true) {
      return PRESENTATION_MODES.HELD;
    }

    const mode = normalizeUpper(frame.presentationMode);

    if (mode === PRESENTATION_MODES.CONSTELLATION) {
      return PRESENTATION_MODES.CONSTELLATION;
    }

    if (mode === PRESENTATION_MODES.CLUSTER) {
      return PRESENTATION_MODES.CLUSTER;
    }

    return PRESENTATION_MODES.HELD;
  }

  function gestureScopeForFrame(frame) {
    const mode = presentationMode(frame);

    if (mode === PRESENTATION_MODES.CONSTELLATION) {
      return GESTURE_SCOPES.ORBIT;
    }

    if (mode === PRESENTATION_MODES.CLUSTER) {
      return GESTURE_SCOPES.CLUSTER;
    }

    return "";
  }

  function activeWingFromFrame(frame) {
    return normalizeWing(
      frame &&
        (
          frame.activeClusterWing ||
          frame.selectedCardinal ||
          (
            frame.cluster &&
            frame.cluster.wing
          )
        )
    );
  }

  function clusterRoomIdsFromFrame(frame, wing) {
    if (
      frame &&
      frame.cluster &&
      frame.cluster.wing === wing &&
      Array.isArray(frame.cluster.roomIds) &&
      frame.cluster.roomIds.length === 4
    ) {
      return frame.cluster.roomIds.map(normalizeRoomId);
    }

    return [
      `${wing}-1`,
      `${wing}-2`,
      `${wing}-3`,
      `${wing}-4`
    ];
  }

  function startQuaternionFromFrame(frame, scope) {
    const gestures = state.gestures || resolveGestures();

    if (!gestures) {
      return [0, 0, 0, 1];
    }

    if (
      scope === GESTURE_SCOPES.CLUSTER &&
      frame &&
      frame.cluster
    ) {
      return gestures.orientationQuaternion(frame.cluster.orientation);
    }

    return gestures.orientationQuaternion(frame && frame.orbitOrientation);
  }

  function capturePointer(pointerId) {
    if (!state.orbitField) {
      return false;
    }

    try {
      state.orbitField.setPointerCapture(pointerId);

      return (
        typeof state.orbitField.hasPointerCapture !== "function" ||
        state.orbitField.hasPointerCapture(pointerId)
      );
    } catch {
      state.counters.pointerCaptureFailures += 1;
      return false;
    }
  }

  function releasePointer(pointerId) {
    if (!state.orbitField) {
      return;
    }

    try {
      if (
        typeof state.orbitField.hasPointerCapture !== "function" ||
        state.orbitField.hasPointerCapture(pointerId)
      ) {
        state.orbitField.releasePointerCapture(pointerId);
      }
    } catch {
      /* Best-effort release. */
    }
  }

  function armClickSuppression(element, reason) {
    state.suppressedClick = {
      element: element || state.orbitField,
      reason: normalize(reason) || "pointer-interaction",
      expires: performance.now() + CONFIG.suppressClickMs
    };
  }

  function shouldSuppressClick(event) {
    const suppression = state.suppressedClick;

    if (!suppression) {
      return false;
    }

    if (performance.now() > suppression.expires) {
      state.suppressedClick = null;
      return false;
    }

    if (event.detail === 0) {
      return false;
    }

    const target = isElement(event.target) ? event.target : null;

    if (!target) {
      return false;
    }

    const element = suppression.element;
    const related =
      !element ||
      element === target ||
      element.contains(target) ||
      target.contains(element);

    if (!related) {
      return false;
    }

    state.suppressedClick = null;
    return true;
  }

  function requestSemanticSelection(kind, identity, source) {
    const snapshot = runtimeSnapshot();

    if (!snapshot.controller || !snapshot.controllerReady) {
      return false;
    }

    let committed = false;

    try {
      if (kind === SEMANTIC_KINDS.CARDINAL) {
        const wing = normalizeWing(identity);

        committed = Boolean(
          wing &&
            snapshot.controller.requestCardinalSelection(wing) !== false
        );
      } else if (kind === SEMANTIC_KINDS.ROOM) {
        const roomId = normalizeRoomId(identity);

        committed = Boolean(
          roomId &&
            snapshot.controller.requestRoomSelection(roomId) !== false
        );
      } else if (kind === SEMANTIC_KINDS.COMPASS) {
        committed = snapshot.controller.requestCompassSelection() !== false;
      }
    } catch {
      committed = false;
    }

    publishReceipt(
      committed
        ? "semantic-selection-committed"
        : "semantic-selection-rejected",
      {
        source,
        kind: kind || null,
        identity: identity || null
      }
    );

    return committed;
  }

  function commitProjectedTap(pointer, event) {
    if (!pointer || !pointer.downHit || !runtimeReady()) {
      state.counters.projectedTapRejects += 1;
      return false;
    }

    const releaseHit = authoritativeHitTest(event.clientX, event.clientY);

    if (!releaseHit || !hitsCorrespond(pointer.downHit, releaseHit)) {
      state.counters.projectedTapRejects += 1;

      armClickSuppression(
        pointer.directControl || state.orbitField,
        "projected-tap-correspondence-rejected"
      );

      return false;
    }

    const kind = semanticKindFromHit(releaseHit);
    const identity = semanticIdentityFromHit(releaseHit, kind);

    if (!kind || !identity) {
      state.counters.projectedTapRejects += 1;
      return false;
    }

    const committed = requestSemanticSelection(
      kind,
      identity,
      "projected-pointer"
    );

    armClickSuppression(
      pointer.directControl || state.orbitField,
      committed ? "projected-tap-committed" : "projected-tap-rejected"
    );

    if (committed) {
      state.counters.projectedTapCommits += 1;
    } else {
      state.counters.projectedTapRejects += 1;
    }

    return committed;
  }

  function commitCompassTap(pointer, event) {
    const control = pointer && pointer.directControl;

    if (
      !control ||
      !semanticControlEnabled(control) ||
      !controllerInteractionAllowed()
    ) {
      return false;
    }

    const releaseElement =
      typeof document.elementFromPoint === "function"
        ? document.elementFromPoint(event.clientX, event.clientY)
        : null;

    const corresponds = Boolean(
      releaseElement &&
        (
          releaseElement === control ||
          control.contains(releaseElement)
        )
    );

    if (!corresponds) {
      armClickSuppression(control, "compass-tap-correspondence-rejected");
      return false;
    }

    const committed = requestSemanticSelection(
      SEMANTIC_KINDS.COMPASS,
      "home-compass",
      "compass-pointer"
    );

    armClickSuppression(
      control,
      committed ? "compass-tap-committed" : "compass-tap-rejected"
    );

    return committed;
  }

  function beginControllerGesture(pointer) {
    const snapshot = runtimeSnapshot();

    if (!snapshot.controller || pointer.controllerGestureActive) {
      return Boolean(pointer.controllerGestureActive);
    }

    let accepted = false;

    try {
      if (pointer.gestureScope === GESTURE_SCOPES.ORBIT) {
        accepted = snapshot.controller.beginOrbitGesture() !== false;

        if (accepted) {
          state.counters.orbitBegins += 1;
        }
      } else if (
        pointer.gestureScope === GESTURE_SCOPES.CLUSTER &&
        pointer.activeWing
      ) {
        accepted =
          snapshot.controller.beginClusterGesture(pointer.activeWing) !== false;

        if (accepted) {
          state.counters.clusterBegins += 1;
        }
      }
    } catch {
      accepted = false;
    }

    pointer.controllerGestureActive = accepted;
    return accepted;
  }

  function previewControllerGesture(pointer, frame) {
    const snapshot = runtimeSnapshot();
    const gestures = snapshot.gestures;

    if (
      !snapshot.controller ||
      !gestures ||
      !pointer.controllerGestureActive
    ) {
      return false;
    }

    let accepted = false;

    try {
      if (pointer.gestureScope === GESTURE_SCOPES.ORBIT) {
        const primaryId =
          gestures.primaryWingForQuaternion(pointer.currentQuaternion);

        accepted =
          snapshot.controller.requestOrbitPreview({
            quaternion: pointer.currentQuaternion.slice(),
            primaryId
          }) !== false;

        pointer.previewPrimaryId = primaryId;

        if (accepted) {
          state.counters.orbitPreviews += 1;
        }
      } else if (
        pointer.gestureScope === GESTURE_SCOPES.CLUSTER &&
        pointer.activeWing
      ) {
        const primaryId =
          gestures.primaryRoomForQuaternion(
            pointer.clusterRoomIds,
            pointer.currentQuaternion
          );

        if (!primaryId) {
          return false;
        }

        accepted =
          snapshot.controller.requestClusterPreview(
            pointer.activeWing,
            {
              quaternion: pointer.currentQuaternion.slice(),
              primaryId
            }
          ) !== false;

        pointer.previewPrimaryId = primaryId;

        if (accepted) {
          state.counters.clusterPreviews += 1;
        }
      }
    } catch {
      accepted = false;
    }

    pointer.previewAccepted = accepted;
    return accepted;
  }

  function commitControllerGesture(pointer) {
    const snapshot = runtimeSnapshot();

    if (
      !snapshot.controller ||
      !pointer.controllerGestureActive ||
      !pointer.previewAccepted
    ) {
      return false;
    }

    let committed = false;

    try {
      if (pointer.gestureScope === GESTURE_SCOPES.ORBIT) {
        committed = snapshot.controller.requestOrbitCommit() !== false;

        if (committed) {
          state.counters.orbitCommits += 1;
        }
      } else if (
        pointer.gestureScope === GESTURE_SCOPES.CLUSTER &&
        pointer.activeWing
      ) {
        committed =
          snapshot.controller.requestClusterCommit(pointer.activeWing) !== false;

        if (committed) {
          state.counters.clusterCommits += 1;
        }
      }
    } catch {
      committed = false;
    }

    if (committed) {
      pointer.controllerGestureActive = false;
      pointer.previewAccepted = false;
    }

    return committed;
  }

  function cancelControllerGesture(pointer, reason) {
    if (!pointer || !pointer.controllerGestureActive) {
      return false;
    }

    const controller = state.controller || resolveController();
    let cancelled = false;

    try {
      if (
        controller &&
        pointer.gestureScope === GESTURE_SCOPES.ORBIT
      ) {
        cancelled = controller.requestOrbitCancel(reason) !== false;

        if (cancelled) {
          state.counters.orbitCancels += 1;
        }
      } else if (
        controller &&
        pointer.gestureScope === GESTURE_SCOPES.CLUSTER &&
        pointer.activeWing
      ) {
        cancelled =
          controller.requestClusterCancel(pointer.activeWing, reason) !== false;

        if (cancelled) {
          state.counters.clusterCancels += 1;
        }
      }
    } catch {
      cancelled = false;
    }

    pointer.controllerGestureActive = false;
    pointer.previewAccepted = false;
    return cancelled;
  }

  function requestClusterFlickReturn(pointer, flick) {
    const snapshot = runtimeSnapshot();

    if (
      !snapshot.controller ||
      pointer.gestureScope !== GESTURE_SCOPES.CLUSTER ||
      !pointer.activeWing
    ) {
      return false;
    }

    cancelControllerGesture(pointer, "cluster-flick-return");

    let committed = false;

    try {
      committed =
        snapshot.controller.requestReturnToConstellation({
          scrollToScene: true
        }) !== false;
    } catch {
      committed = false;
    }

    if (committed) {
      state.counters.clusterReturns += 1;
    }

    publishReceipt(
      committed
        ? "cluster-flick-return-committed"
        : "cluster-flick-return-rejected",
      {
        activeWing: pointer.activeWing,
        direction: flick.direction
      }
    );

    return committed;
  }

  function createPointerState(event, frame) {
    const directControl = resolveSemanticControl(event.target);
    const directKind = semanticKindFromControl(directControl);
    const downHit =
      directKind === SEMANTIC_KINDS.COMPASS
        ? null
        : authoritativeHitTest(event.clientX, event.clientY);

    const hitKind = semanticKindFromHit(downHit);
    const hitIdentity = semanticIdentityFromHit(downHit, hitKind);
    const directIdentity = semanticIdentityFromControl(directControl);

    let territory = TERRITORIES.FIELD;

    if (directKind === SEMANTIC_KINDS.COMPASS) {
      territory = TERRITORIES.COMPASS;
    } else if (hitKind === SEMANTIC_KINDS.CARDINAL) {
      territory = TERRITORIES.CARDINAL;
    } else if (hitKind === SEMANTIC_KINDS.ROOM) {
      territory = TERRITORIES.ROOM;
    } else if (directControl) {
      territory = TERRITORIES.NATIVE_SEMANTIC;
    }

    const gestureScope =
      territory === TERRITORIES.COMPASS ||
      territory === TERRITORIES.NATIVE_SEMANTIC
        ? ""
        : gestureScopeForFrame(frame);

    const activeWing = activeWingFromFrame(frame);
    const startQuaternion = startQuaternionFromFrame(frame, gestureScope);
    const timestamp = performance.now();

    return {
      pointerId: event.pointerId,
      pointerType: normalize(event.pointerType) || "mouse",
      territory,
      gestureScope,
      directControl,
      directKind,
      directIdentity,
      downHit,
      downKind: hitKind,
      downIdentity: hitIdentity || directIdentity,
      activeWing,
      clusterRoomIds: activeWing
        ? clusterRoomIdsFromFrame(frame, activeWing)
        : [],
      startQuaternion,
      currentQuaternion: startQuaternion.slice(),
      previewPrimaryId: "",
      previewAccepted: false,
      controllerGestureActive: false,
      startX: event.clientX,
      startY: event.clientY,
      currentX: event.clientX,
      currentY: event.clientY,
      startTime: timestamp,
      currentTime: timestamp,
      maximumDistance: 0,
      pathLength: 0,
      dragging: false,
      finishing: false,
      cancelled: false,
      captureAcquired: false,
      samples: [
        {
          x: event.clientX,
          y: event.clientY,
          timestamp
        }
      ]
    };
  }

  function updatePointer(pointer, event) {
    const gestures = state.gestures || resolveGestures();

    if (!gestures) {
      return false;
    }

    const timestamp = performance.now();

    pointer.pathLength += gestures.distance2d(
      pointer.currentX,
      pointer.currentY,
      event.clientX,
      event.clientY
    );

    pointer.currentX = event.clientX;
    pointer.currentY = event.clientY;
    pointer.currentTime = timestamp;
    pointer.maximumDistance = Math.max(
      pointer.maximumDistance,
      gestures.distance2d(
        pointer.startX,
        pointer.startY,
        pointer.currentX,
        pointer.currentY
      )
    );

    pointer.samples = gestures.appendSample(
      pointer.samples,
      pointer.currentX,
      pointer.currentY,
      timestamp,
      CONFIG
    );

    return true;
  }

  function clearPointer(pointer, releaseCapture = true) {
    if (!pointer || pointer.finishing) {
      return;
    }

    pointer.finishing = true;

    if (state.pointer === pointer) {
      state.pointer = null;
    }

    if (releaseCapture) {
      releasePointer(pointer.pointerId);
    }
  }

  function interruptActivePointer(reason, releaseCapture = true) {
    const pointer = state.pointer;

    if (!pointer || pointer.finishing) {
      return false;
    }

    pointer.cancelled = true;
    state.counters.interruptions += 1;

    cancelControllerGesture(pointer, reason);

    if (
      pointer.dragging ||
      pointer.maximumDistance > CONFIG.maximumTapDistancePx
    ) {
      armClickSuppression(
        pointer.directControl || state.orbitField,
        reason
      );
    }

    clearPointer(pointer, releaseCapture);

    publishReceipt("gesture-interrupted", {
      reason,
      pointerId: pointer.pointerId,
      territory: pointer.territory,
      gestureScope: pointer.gestureScope
    });

    return true;
  }

  function handlePointerDown(event) {
    if (
      state.pointer ||
      state.disposed ||
      state.failed ||
      !state.runtimeActive ||
      !isPrimaryPointerEvent(event) ||
      !isInsideOrbitField(event.target) ||
      isProtectedTarget(event.target)
    ) {
      return;
    }

    const frame = readControllerFrame();

    if (!frame || frame.held === true) {
      return;
    }

    const pointer = createPointerState(event, frame);

    if (pointer.territory === TERRITORIES.NATIVE_SEMANTIC) {
      publishReceipt("native-semantic-path-preserved", {
        kind: pointer.directKind || null,
        identity: pointer.directIdentity || null
      });

      return;
    }

    if (
      pointer.territory !== TERRITORIES.COMPASS &&
      !pointer.gestureScope
    ) {
      return;
    }

    state.pointer = pointer;
    pointer.captureAcquired = capturePointer(pointer.pointerId);

    if (!pointer.captureAcquired) {
      state.pointer = null;

      publishReceipt("pointer-capture-rejected", {
        pointerId: pointer.pointerId,
        territory: pointer.territory
      });

      return;
    }

    state.counters.pointerDown += 1;
    event.preventDefault();

    publishReceipt("pointer-started", {
      pointerId: pointer.pointerId,
      pointerType: pointer.pointerType,
      territory: pointer.territory,
      gestureScope: pointer.gestureScope,
      downKind: pointer.downKind || null,
      downIdentity: pointer.downIdentity || null,
      activeWing: pointer.activeWing || null
    });
  }

  function handlePointerMove(event) {
    const pointer = state.pointer;

    if (
      !pointer ||
      pointer.pointerId !== event.pointerId ||
      pointer.finishing
    ) {
      return;
    }

    if (pointer.territory === TERRITORIES.COMPASS) {
      if (!controllerInteractionAllowed()) {
        interruptActivePointer("controller-runtime-invalid");
        return;
      }
    } else if (!runtimeReady()) {
      interruptActivePointer("projected-runtime-invalid");
      return;
    }

    state.counters.pointerMove += 1;

    if (!updatePointer(pointer, event)) {
      interruptActivePointer("gesture-helper-unavailable");
      return;
    }

    if (
      !pointer.dragging &&
      pointer.maximumDistance >= CONFIG.dragDeadZonePx
    ) {
      pointer.dragging = true;

      if (pointer.territory !== TERRITORIES.COMPASS) {
        const began = beginControllerGesture(pointer);

        if (!began) {
          interruptActivePointer("gesture-begin-rejected");
          return;
        }
      }
    }

    if (
      pointer.dragging &&
      pointer.territory !== TERRITORIES.COMPASS
    ) {
      const gestures = state.gestures || resolveGestures();
      const rect = state.orbitField.getBoundingClientRect();

      pointer.currentQuaternion = gestures.dragQuaternion({
        pointer,
        clientX: event.clientX,
        clientY: event.clientY,
        width: Math.max(1, rect.width),
        height: Math.max(1, rect.height),
        config: CONFIG
      });

      const frame = readControllerFrame();

      if (!frame || !previewControllerGesture(pointer, frame)) {
        interruptActivePointer("gesture-preview-rejected");
        return;
      }
    }

    event.preventDefault();
  }

  function finishPointer(event, cancelled) {
    const pointer = state.pointer;

    if (
      !pointer ||
      pointer.pointerId !== event.pointerId ||
      pointer.finishing
    ) {
      return;
    }

    const gestures = state.gestures || resolveGestures();

    if (!gestures) {
      interruptActivePointer("gesture-helper-unavailable");
      return;
    }

    const releaseTime = performance.now();
    const releaseX = Number.isFinite(event.clientX)
      ? event.clientX
      : pointer.currentX;
    const releaseY = Number.isFinite(event.clientY)
      ? event.clientY
      : pointer.currentY;

    pointer.pathLength += gestures.distance2d(
      pointer.currentX,
      pointer.currentY,
      releaseX,
      releaseY
    );

    pointer.currentX = releaseX;
    pointer.currentY = releaseY;
    pointer.currentTime = releaseTime;
    pointer.maximumDistance = Math.max(
      pointer.maximumDistance,
      gestures.distance2d(
        pointer.startX,
        pointer.startY,
        releaseX,
        releaseY
      )
    );
    pointer.cancelled = Boolean(cancelled);
    pointer.samples = gestures.appendSample(
      pointer.samples,
      releaseX,
      releaseY,
      releaseTime,
      CONFIG
    );

    const duration = Math.max(0, releaseTime - pointer.startTime);
    let outcome = "cancelled";
    let committed = false;
    let flick = null;

    if (cancelled) {
      cancelControllerGesture(pointer, "pointer-cancelled");

      if (
        pointer.dragging ||
        pointer.maximumDistance > CONFIG.maximumTapDistancePx
      ) {
        armClickSuppression(
          pointer.directControl || state.orbitField,
          "pointer-cancelled"
        );
      }
    } else if (
      pointer.territory === TERRITORIES.COMPASS &&
      !controllerInteractionAllowed()
    ) {
      outcome = "runtime-invalid";
      armClickSuppression(pointer.directControl, "compass-runtime-invalid");
    } else if (
      pointer.territory !== TERRITORIES.COMPASS &&
      !runtimeReady()
    ) {
      cancelControllerGesture(pointer, "runtime-invalid-at-release");
      outcome = "runtime-invalid";
      armClickSuppression(
        pointer.directControl || state.orbitField,
        "projected-runtime-invalid"
      );
    } else if (
      !pointer.dragging &&
      pointer.maximumDistance <= CONFIG.maximumTapDistancePx
    ) {
      if (pointer.territory === TERRITORIES.COMPASS) {
        committed = commitCompassTap(pointer, event);
        outcome = committed ? "compass-tap-committed" : "compass-tap-rejected";
      } else if (
        pointer.territory === TERRITORIES.CARDINAL ||
        pointer.territory === TERRITORIES.ROOM
      ) {
        committed = commitProjectedTap(pointer, event);
        outcome = committed ? "projected-tap-committed" : "projected-tap-rejected";
      } else {
        outcome = "empty-field-tap";
      }
    } else if (pointer.dragging) {
      flick = gestures.classifyFlick(
        pointer,
        releaseX,
        releaseY,
        releaseTime,
        CONFIG
      );

      armClickSuppression(
        pointer.directControl || state.orbitField,
        flick.qualifies ? "flick-completion" : "drag-completion"
      );

      if (pointer.territory === TERRITORIES.COMPASS) {
        outcome = "compass-drag-consumed";
      } else if (
        flick.qualifies &&
        pointer.gestureScope === GESTURE_SCOPES.CLUSTER &&
        pointer.activeWing
      ) {
        state.counters.flicksQualified += 1;
        committed = requestClusterFlickReturn(pointer, flick);
        outcome = committed
          ? "cluster-flick-return"
          : "cluster-flick-return-rejected";
      } else if (
        pointer.maximumDistance >= CONFIG.minimumCommitDistancePx &&
        pointer.controllerGestureActive &&
        pointer.previewAccepted
      ) {
        committed = commitControllerGesture(pointer);

        if (!committed) {
          cancelControllerGesture(pointer, "gesture-commit-rejected");
        }

        outcome = committed
          ? (
              pointer.gestureScope === GESTURE_SCOPES.ORBIT
                ? "orbit-committed"
                : "cluster-committed"
            )
          : "gesture-commit-rejected";
      } else {
        cancelControllerGesture(pointer, "drag-without-accepted-preview");
        outcome = "drag-cancelled";
      }
    } else {
      cancelControllerGesture(pointer, "ambiguous-release");
      armClickSuppression(
        pointer.directControl || state.orbitField,
        "ambiguous-release"
      );
      outcome = "ambiguous-release";
    }

    event.preventDefault();
    clearPointer(pointer);

    publishReceipt("pointer-finished", {
      outcome,
      committed,
      pointerId: pointer.pointerId,
      pointerType: pointer.pointerType,
      territory: pointer.territory,
      gestureScope: pointer.gestureScope,
      downKind: pointer.downKind || null,
      downIdentity: pointer.downIdentity || null,
      activeWing: pointer.activeWing || null,
      previewPrimaryId: pointer.previewPrimaryId || null,
      duration,
      maximumDistance: pointer.maximumDistance,
      pathLength: pointer.pathLength,
      dragging: pointer.dragging,
      cancelled: pointer.cancelled,
      flick
    });
  }

  function handlePointerUp(event) {
    if (
      !state.pointer ||
      state.pointer.pointerId !== event.pointerId
    ) {
      return;
    }

    state.counters.pointerUp += 1;
    finishPointer(event, false);
  }

  function handlePointerCancel(event) {
    if (
      !state.pointer ||
      state.pointer.pointerId !== event.pointerId
    ) {
      return;
    }

    state.counters.pointerCancel += 1;
    finishPointer(event, true);
  }

  function handleLostPointerCapture(event) {
    const pointer = state.pointer;

    if (
      !pointer ||
      pointer.pointerId !== event.pointerId ||
      pointer.finishing
    ) {
      return;
    }

    interruptActivePointer("lost-pointer-capture", false);
  }

  function handleSemanticClick(event) {
    if (shouldSuppressClick(event)) {
      state.counters.nativeClicksSuppressed += 1;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      publishReceipt("duplicate-click-suppressed");
      return;
    }

    if (
      state.disposed ||
      state.failed ||
      !state.initialized ||
      event.defaultPrevented
    ) {
      return;
    }

    const control = resolveSemanticControl(event.target);

    if (!control || !semanticControlEnabled(control)) {
      return;
    }

    const kind = semanticKindFromControl(control);
    const identity = semanticIdentityFromControl(control);

    if (!kind || !identity) {
      state.counters.nativeSemanticRejects += 1;
      return;
    }

    const committed = requestSemanticSelection(
      kind,
      identity,
      event.detail === 0
        ? "keyboard-semantic-control"
        : "native-semantic-control"
    );

    if (!committed) {
      state.counters.nativeSemanticRejects += 1;
      return;
    }

    if (kind === SEMANTIC_KINDS.CARDINAL) {
      state.counters.nativeCardinalCommits += 1;
    } else if (kind === SEMANTIC_KINDS.ROOM) {
      state.counters.nativeRoomCommits += 1;
    } else if (kind === SEMANTIC_KINDS.COMPASS) {
      state.counters.nativeCompassCommits += 1;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  function handleContextMenu(event) {
    if (state.pointer && isInsideOrbitField(event.target)) {
      event.preventDefault();
    }
  }

  function handleDragStart(event) {
    if (isInsideOrbitField(event.target)) {
      event.preventDefault();
    }
  }

  function handleWindowBlur() {
    interruptActivePointer("window-blur");
  }

  function handleVisibilityChange() {
    if (document.hidden) {
      interruptActivePointer("document-hidden");
    }
  }

  function captureOrbitFieldStyle() {
    if (
      !state.orbitField ||
      state.orbitFieldStyleCaptured
    ) {
      return;
    }

    state.nativeOrbitFieldStyle = state.orbitField.getAttribute("style");
    state.orbitFieldStyleCaptured = true;
    state.orbitField.style.touchAction = "none";
    state.orbitField.style.overscrollBehavior = "contain";
    state.orbitField.style.userSelect = "none";
    state.orbitField.style.webkitUserSelect = "none";
  }

  function restoreOrbitFieldStyle() {
    if (
      !state.orbitField ||
      !state.orbitFieldStyleCaptured
    ) {
      return;
    }

    if (state.nativeOrbitFieldStyle === null) {
      state.orbitField.removeAttribute("style");
    } else {
      state.orbitField.setAttribute("style", state.nativeOrbitFieldStyle);
    }

    state.nativeOrbitFieldStyle = null;
    state.orbitFieldStyleCaptured = false;
  }

  function initializeRuntimeListeners() {
    addRuntimeListener(state.orbitField, "pointerdown", handlePointerDown, {
      passive: false
    });

    addRuntimeListener(state.orbitField, "pointermove", handlePointerMove, {
      passive: false
    });

    addRuntimeListener(state.orbitField, "pointerup", handlePointerUp, {
      passive: false
    });

    addRuntimeListener(state.orbitField, "pointercancel", handlePointerCancel, {
      passive: false
    });

    addRuntimeListener(
      state.orbitField,
      "lostpointercapture",
      handleLostPointerCapture
    );

    addRuntimeListener(state.orbitField, "contextmenu", handleContextMenu);
    addRuntimeListener(state.orbitField, "dragstart", handleDragStart);
    addRuntimeListener(window, "blur", handleWindowBlur);
    addRuntimeListener(document, "visibilitychange", handleVisibilityChange);
  }

  function activateRuntime(reason) {
    if (
      state.runtimeActive ||
      state.disposed ||
      state.failed
    ) {
      return false;
    }

    captureOrbitFieldStyle();
    initializeRuntimeListeners();

    state.runtimeActive = true;
    state.waitingForRuntime = false;
    state.counters.runtimeActivations += 1;

    if (!state.readyPublished) {
      state.readyPublished = true;

      publishReceipt("ready", {
        reason,
        gestureHelperIntegrated: true,
        projectedTapSelection: true,
        directControllerTapCommit: true,
        syntheticSemanticClickCommit: false,
        nativeSemanticDelegation: true,
        keyboardSemanticDelegation: true,
        authoritativeCompositorHitTest: true,
        downReleaseCorrespondence: true,
        pointerCapture: true,
        orbitDirectManipulation: true,
        clusterDirectManipulation: true,
        completeQuaternionPreview: true,
        explicitPrimaryIdentity: true,
        qualifyingClusterFlickReturn: true,
        duplicateClickSuppression: true
      });

      dispatch(EVENTS.interactionsReady, {
        reason,
        contract: CONTRACT,
        gestureHelperContract: GESTURES_CONTRACT,
        directControllerTapCommit: true,
        orbitDirectManipulation: true,
        clusterDirectManipulation: true,
        api: Object.freeze([
          "getState",
          "cancelGesture",
          "retryRuntime",
          "dispose"
        ])
      });
    }

    return true;
  }

  function deactivateRuntime(reason) {
    if (!state.runtimeActive) {
      return false;
    }

    interruptActivePointer(reason);
    removeListenerRegistry(state.runtimeListeners);
    restoreOrbitFieldStyle();

    state.runtimeActive = false;
    state.waitingForRuntime = true;
    state.counters.runtimeDeactivations += 1;

    publishReceipt("runtime-deactivated", {
      reason
    });

    return true;
  }

  function clearRetryTimer() {
    if (state.retryTimer) {
      clearTimeout(state.retryTimer);
    }

    state.retryTimer = 0;
  }

  function scheduleRuntimeRetry(reason) {
    if (
      state.retryTimer ||
      state.runtimeActive ||
      state.disposed ||
      state.failed ||
      state.retryCount >= CONFIG.runtimeRetryLimit
    ) {
      return;
    }

    const delay =
      CONFIG.runtimeRetryIntervalMs +
      Math.min(1000, state.retryCount * 25);

    state.retryTimer = window.setTimeout(() => {
      state.retryTimer = 0;
      state.retryCount += 1;
      attemptRuntimeActivation(`${reason}:retry-${state.retryCount}`);
    }, delay);
  }

  function attemptRuntimeActivation(reason = "runtime-check") {
    if (
      state.disposed ||
      state.failed ||
      !state.initialized
    ) {
      return false;
    }

    state.counters.readinessChecks += 1;

    const snapshot = runtimeSnapshot(true);

    if (!snapshot.ready) {
      if (state.runtimeActive) {
        deactivateRuntime(`${reason}:dependency-unavailable`);
      }

      state.waitingForRuntime = true;

      publishReceipt("waiting-for-runtime", {
        reason,
        gestureHelperAvailable: snapshot.gesturesReady,
        controllerAvailable: Boolean(snapshot.controller),
        controllerReady: snapshot.controllerReady,
        compositorAvailable: Boolean(snapshot.compositor),
        compositorProjectionReady: snapshot.compositorReady,
        retryCount: state.retryCount
      });

      scheduleRuntimeRetry(reason);
      return false;
    }

    clearRetryTimer();
    state.retryCount = 0;

    return state.runtimeActive
      ? true
      : activateRuntime(reason);
  }

  function unsubscribeController() {
    for (const key of [
      "controllerFrameUnsubscribe",
      "controllerHeldUnsubscribe"
    ]) {
      const unsubscribe = state[key];
      state[key] = null;

      if (typeof unsubscribe === "function") {
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

    const controller = resolveController();

    if (!controller) {
      return false;
    }

    try {
      const frameUnsubscribe = controller.subscribeFrameState(frame => {
        if (state.disposed || state.failed) {
          return;
        }

        if (!validControllerFrame(frame)) {
          state.controllerFrame = null;
          interruptActivePointer("invalid-controller-frame");
          deactivateRuntime("invalid-controller-frame");
          scheduleRuntimeRetry("invalid-controller-frame");
          return;
        }

        state.controllerFrame = frame;

        if (frame.held === true) {
          interruptActivePointer("controller-held");
          deactivateRuntime("controller-held");
        }

        attemptRuntimeActivation("controller-frame");
      });

      if (
        frameUnsubscribe != null &&
        typeof frameUnsubscribe !== "function"
      ) {
        throw new Error(
          "Controller subscribeFrameState() returned an invalid unsubscribe surface."
        );
      }

      state.controllerFrameUnsubscribe = frameUnsubscribe || null;

      if (typeof controller.subscribeHeldState === "function") {
        const heldUnsubscribe = controller.subscribeHeldState(heldState => {
          if (heldState && heldState.held === true) {
            interruptActivePointer("controller-held-state");
            deactivateRuntime("controller-held-state");
          }

          attemptRuntimeActivation("controller-held-state");
        });

        if (
          heldUnsubscribe != null &&
          typeof heldUnsubscribe !== "function"
        ) {
          throw new Error(
            "Controller subscribeHeldState() returned an invalid unsubscribe surface."
          );
        }

        state.controllerHeldUnsubscribe = heldUnsubscribe || null;
      }

      return true;
    } catch (error) {
      unsubscribeController();

      publishReceipt("controller-subscription-failed", {
        error: {
          name: error instanceof Error ? error.name : "Error",
          message: error instanceof Error ? error.message : String(error)
        }
      });

      return false;
    }
  }

  function initializeCoreListeners() {
    addCoreListener(document, "click", handleSemanticClick, true);

    addCoreListener(window, EVENTS.controllerReady, () => {
      resolveController();
      bindControllerSubscriptions();
      attemptRuntimeActivation("controller-ready");
    });

    addCoreListener(window, EVENTS.controllerFailure, event => {
      interruptActivePointer("controller-failure");
      deactivateRuntime("controller-failure");
      state.controller = null;
      state.controllerFrame = null;

      publishReceipt("controller-unavailable", {
        detail: event && event.detail ? event.detail : null
      });
    });

    addCoreListener(window, EVENTS.compositorReady, () => {
      resolveCompositor();
      state.compositorState = null;
      attemptRuntimeActivation("compositor-ready");
    });

    addCoreListener(window, EVENTS.compositorProjectionChanged, () => {
      state.compositorState = null;

      if (state.pointer && !runtimeReady()) {
        interruptActivePointer("projection-invalidated");
      }

      attemptRuntimeActivation("compositor-projection-changed");
    });

    addCoreListener(window, EVENTS.compositorFailure, event => {
      interruptActivePointer("compositor-failure");
      deactivateRuntime("compositor-failure");
      state.compositor = null;
      state.compositorState = null;

      publishReceipt("compositor-unavailable", {
        detail: event && event.detail ? event.detail : null
      });
    });

    addCoreListener(window, EVENTS.compositorDisposed, () => {
      interruptActivePointer("compositor-disposed");
      deactivateRuntime("compositor-disposed");
      state.compositor = null;
      state.compositorState = null;
      scheduleRuntimeRetry("compositor-disposed");
    });

    addCoreListener(window, EVENTS.crystalsReady, () => {
      attemptRuntimeActivation("crystals-ready");
    });

    addCoreListener(window, EVENTS.crystalsFailure, event => {
      interruptActivePointer("crystals-failure");

      publishReceipt("crystals-unavailable", {
        detail: event && event.detail ? event.detail : null,
        compositorProjectionRetained: compositorProjectionReady()
      });
    });

    addCoreListener(window, EVENTS.crystalsDisposed, () => {
      interruptActivePointer("crystals-disposed");
      publishReceipt("crystals-disposed");
    });

    addCoreListener(window, "pageshow", () => {
      if (!state.disposed && !state.failed) {
        attemptRuntimeActivation("pageshow");
      }
    });

    addCoreListener(window, "pagehide", event => {
      if (event.persisted) {
        interruptActivePointer("pagehide-persisted");
        deactivateRuntime("pagehide-persisted");
        return;
      }

      dispose("pagehide");
    });
  }

  function exposeApi() {
    const api = Object.freeze({
      contract: CONTRACT,
      owner: OWNER,
      controllerGlobal: CONTROLLER_GLOBAL,
      controllerModuleId: CONTROLLER_MODULE_ID,
      controllerModuleVersion: CONTROLLER_MODULE_VERSION,
      compositorGlobal: COMPOSITOR_GLOBAL,
      compositorContract: COMPOSITOR_CONTRACT,
      gestureHelperGlobal: GESTURES_GLOBAL,
      gestureHelperContract: GESTURES_CONTRACT,

      getState() {
        return createReceipt("state-requested");
      },

      cancelGesture(reason = "api") {
        return interruptActivePointer(`api:${normalize(reason) || "cancel"}`);
      },

      retryRuntime(reason = "api") {
        clearRetryTimer();
        state.retryCount = 0;
        return attemptRuntimeActivation(`api:${normalize(reason) || "retry"}`);
      },

      dispose
    });

    Object.defineProperty(window, "SHOWROOM_INTERACTIONS", {
      configurable: true,
      enumerable: false,
      writable: false,
      value: api
    });

    state.apiExposed = true;
  }

  function removeApi() {
    if (!state.apiExposed) {
      return;
    }

    try {
      delete window.SHOWROOM_INTERACTIONS;
    } catch {
      /* Best-effort removal. */
    }

    state.apiExposed = false;
  }

  function rollbackInitialization(error) {
    clearRetryTimer();
    interruptActivePointer("initialization-rollback");
    deactivateRuntime("initialization-rollback");
    unsubscribeController();
    removeListenerRegistry(state.coreListeners);
    restoreOrbitFieldStyle();
    removeApi();

    state.initialized = false;
    state.initializing = false;
    state.waitingForRuntime = false;
    state.failed = true;
    state.controller = null;
    state.compositor = null;
    state.gestures = null;
    state.controllerFrame = null;
    state.compositorState = null;
    state.counters.failures += 1;

    const errorPayload = {
      name: error instanceof Error ? error.name : "Error",
      message: error instanceof Error ? error.message : String(error)
    };

    publishReceipt("fatal-error", {
      error: errorPayload,
      listenersRemoved: true,
      pointerReleased: true,
      controllerSubscriptionsRemoved: true,
      orbitFieldStyleRestored: true
    });

    dispatch(EVENTS.interactionsFailure, {
      reason: "initialization-failed",
      error: errorPayload
    });
  }

  function initialize() {
    if (
      state.initialized ||
      state.initializing ||
      state.disposed
    ) {
      return;
    }

    state.initializing = true;

    try {
      discoverDom();

      const issues = validateDom();

      if (issues.length) {
        throw new Error(issues.join(" "));
      }

      if (!resolveGestures()) {
        throw new Error(
          "Missing or incompatible SHOWROOM_INTERACTION_GESTURES helper."
        );
      }

      initializeCoreListeners();
      exposeApi();

      state.initialized = true;
      state.initializing = false;
      state.failed = false;
      state.waitingForRuntime = true;

      resolveController();
      resolveCompositor();
      bindControllerSubscriptions();

      publishReceipt("core-initialized", {
        controllerResolution: state.controller ? "resolved" : "pending",
        compositorResolution: state.compositor ? "resolved" : "pending",
        gestureHelperResolution: state.gestures ? "resolved" : "missing",
        pointerRuntime: "deferred-until-controller-and-compositor-ready",
        directProjectedTapCommit: true,
        directCompassTapCommit: true,
        nativeSemanticDelegation: true,
        syntheticControlClickRequired: false,
        quaternionConstructionDelegated: true,
        primaryIdentityDerivationDelegated: true
      });

      attemptRuntimeActivation("startup");
    } catch (error) {
      rollbackInitialization(error);
    }
  }

  function dispose(reason = "api") {
    if (state.disposed) {
      return true;
    }

    state.disposed = true;

    clearRetryTimer();
    interruptActivePointer(`dispose:${normalize(reason) || "api"}`);
    deactivateRuntime(`dispose:${normalize(reason) || "api"}`);
    unsubscribeController();
    removeListenerRegistry(state.coreListeners);
    restoreOrbitFieldStyle();
    removeApi();

    state.suppressedClick = null;
    state.controller = null;
    state.compositor = null;
    state.gestures = null;
    state.controllerFrame = null;
    state.compositorState = null;
    state.initialized = false;
    state.initializing = false;
    state.waitingForRuntime = false;

    publishReceipt("disposed", {
      reason,
      pointerReleased: true,
      listenersRemoved: true,
      controllerSubscriptionsRemoved: true,
      orbitFieldStyleRestored: true,
      controllerStateMutatedDirectly: false,
      compositorStateMutated: false,
      crystalStateMutated: false,
      gestureHelperMutated: false
    });

    dispatch(EVENTS.interactionsDisposed, {
      reason,
      disposed: true
    });

    return true;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, {
      once: true
    });
  } else {
    initialize();
  }
})();

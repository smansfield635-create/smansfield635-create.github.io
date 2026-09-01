/* TARGET FILE: /showroom/index.interactions.js */
/* COMPLETE REPLACEMENT */
/* GROUP_A_INTERACTIONS_CONSUMER_ALIGNMENT_TO_EXISTING_ANCHORS_ONLY */
/* SHOWROOM_COMPLETE_QUATERNION_INTERACTIONS_TNT_v6_COMPASS_SEMANTIC_RECOVERY_INITIALIZATION_GATE_CORRECTED */
/* SHOWROOM_CENTER_HIT_PROJECTED_LABELS_20260726A */
/* SHOWROOM_LABEL_CONTAINMENT_20260726B */
/* SHOWROOM_LABEL_HIERARCHY_PRIMARY_ONLY_20260729A */
/* SHOWROOM_CLUSTER_CAMERA_FRONT_LOCK_AND_COMPASS_FIT_20260729B */

(() => { 
  "use strict";

  const CONTRACT =
    "SHOWROOM_COMPLETE_QUATERNION_INTERACTIONS_TNT_v6";

  const OWNER =
    "/showroom/index.interactions.js";

  const CONTROLLER_GLOBAL =
    "SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER";

  const CONTROLLER_MODULE_ID =
    "SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER";

  const CONTROLLER_MODULE_VERSION =
    "9.0.0-archcoin-route-gateway";

  const EXPECTED_INTERACTION_MODULE_ID =
    "DGB_ARCHCOIN_INTERACTIONS";

  const EXPECTED_INTERACTION_MODULE_VERSION =
    "1.0.0-pointer-gesture-interpreter";

  const COMPOSITOR_GLOBAL =
    "SHOWROOM_COMPOSITOR";

  const COMPOSITOR_CONTRACT =
    "SHOWROOM_CONSTELLATION_SINGLE_FRAME_COMPOSITOR_TNT_v6";

  const GESTURES_GLOBAL =
    "SHOWROOM_INTERACTION_GESTURES";

  const GESTURES_CONTRACT =
    "SHOWROOM_INTERACTION_GESTURE_SUPPORT_TNT_v1";

  const EVENTS = Object.freeze({
    controllerReady:
      "SHOWROOM_CONTROLLER_READY",

    controllerFailure:
      "SHOWROOM_CONTROLLER_FAILURE",

    compositorReady:
      "SHOWROOM_COMPOSITOR_READY",

    compositorFailure:
      "SHOWROOM_COMPOSITOR_FAILURE",

    compositorDisposed:
      "SHOWROOM_COMPOSITOR_DISPOSED",

    compositorProjectionChanged:
      "SHOWROOM_COMPOSITOR_PROJECTION_CHANGED",

    crystalsReady:
      "SHOWROOM_CRYSTALS_READY",

    crystalsFailure:
      "SHOWROOM_CRYSTALS_FAILURE",

    crystalsRenderFailure:
      "ARCHCOIN_CRYSTALS_RENDER_FAILURE",

    crystalsDisposed:
      "SHOWROOM_CRYSTALS_DISPOSED",

    interactionsReady:
      "SHOWROOM_INTERACTIONS_READY",

    interactionsFailure:
      "SHOWROOM_INTERACTIONS_FAILURE",

    interactionsDisposed:
      "SHOWROOM_INTERACTIONS_DISPOSED",

    interactionsReceipt:
      "SHOWROOM_INTERACTIONS_RECEIPT"
  });

  const SELECTORS = Object.freeze({
    root:
      "[data-showroom-root]",

    orbitField:
      "[data-showroom-orbit-field]",

    receipt:
      "[data-showroom-interactions-receipt]",

    controllerPanel:
      "[data-showroom-controller-panel]",

    returnHomeCompass:
      "[data-showroom-controller-return-home-compass]",

    cardinalControl:
      "[data-showroom-cardinal-control][data-showroom-cardinal-id]",

    roomControl:
      "[data-showroom-child-control][data-showroom-child-id]" +
      "[data-showroom-cardinal-id]",

    compassControl:
      "[data-showroom-compass-control]",

    compassAction:
      "[data-showroom-controller-action=\"request-compass-selection\"]",

    compassAlias:
      "[data-showroom-compass-selection-alias]",

    compassSemanticControl:
      [
        "[data-showroom-compass-control]",
        "[data-showroom-compass-selection-alias]" +
          "[data-showroom-controller-action=\"request-compass-selection\"]",
        "[data-showroom-controller-action=\"request-compass-selection\"]"
      ].join(","),

    semanticControl:
      [
        "[data-showroom-cardinal-control][data-showroom-cardinal-id]",
        "[data-showroom-child-control][data-showroom-child-id]" +
          "[data-showroom-cardinal-id]",
        "[data-showroom-compass-control]",
        "[data-showroom-compass-selection-alias]" +
          "[data-showroom-controller-action=\"request-compass-selection\"]",
        "[data-showroom-controller-action=\"request-compass-selection\"]"
      ].join(","),

    protectedTarget:
      [
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
    CONSTELLATION:
      "CONSTELLATION",

    CLUSTER_OPEN:
      "CLUSTER_OPEN",

    ROOM_SELECTED:
      "ROOM_SELECTED",

    SYSTEM_HELD:
      "SYSTEM_HELD"
  });

  const PRESENTATION_MODES = Object.freeze({
    CONSTELLATION:
      "CONSTELLATION",

    CLUSTER:
      "CLUSTER",

    HELD:
      "HELD"
  });

  const GESTURE_SCOPES = Object.freeze({
    ORBIT:
      "orbit",

    CLUSTER:
      "cluster"
  });

  const TERRITORIES = Object.freeze({
    COMPASS:
      "compass",

    CARDINAL:
      "cardinal",

    ROOM:
      "room",

    FIELD:
      "field",

    NATIVE_SEMANTIC:
      "native-semantic"
  });

  const SEMANTIC_KINDS = Object.freeze({
    CARDINAL:
      "cardinal",

    ROOM:
      "room",

    COMPASS:
      "compass"
  });

  const CONFIG = Object.freeze({
    dragDeadZonePx:
      7,

    maximumTapDistancePx:
      14,

    minimumCommitDistancePx:
      8,

    radiansPerViewport:
      Math.PI * 1.14,

    maximumPitchRadians:
      Math.PI * 0.72,

    maximumSamples:
      20,

    sampleWindowMs:
      150,

    flickMaximumDurationMs:
      285,

    flickMinimumDistancePx:
      50,

    flickMinimumAverageVelocityPxPerMs:
      0.50,

    flickMinimumReleaseVelocityPxPerMs:
      0.64,

    flickMinimumDirectionalRatio:
      1.20,

    flickMaximumPauseBeforeReleaseMs:
      115,

    flickMaximumPathEfficiencyLoss:
      0.32,

    suppressClickMs:
      560,

    runtimeRetryLimit:
      160,

    runtimeRetryIntervalMs:
      100,

    compassPanelScrollDelayMs:
      35
  });

  const WINGS = Object.freeze([
    "north",
    "east",
    "south",
    "west"
  ]);

  const CARDINAL_DISPLAY_LABELS = Object.freeze({
    north: "Story",
    east: "Characters",
    south: "Wonders",
    west: "Mysteries"
  });

  const CARDINAL_DISPLAY_LETTERS = Object.freeze({
    north: "N",
    east: "E",
    south: "S",
    west: "W"
  });

  const ROOM_DISPLAY_LABELS = Object.freeze({
    "north-1": "Welcome",
    "north-2": "Mission",
    "north-3": "Timeline",
    "north-4": "Invitation",
    "east-1": "Jeeves",
    "east-2": "Elara",
    "east-3": "Auren",
    "east-4": "Characters",
    "south-1": "Window",
    "south-2": "Diamond",
    "south-3": "Stars",
    "south-4": "Hearth",
    "west-1": "Unfinished World",
    "west-2": "Glass Questions",
    "west-3": "Closed Paths",
    "west-4": "Audralia"
  });

  const state = {
    root:
      null,

    orbitField:
      null,

    receipt:
      null,

    controllerPanel:
      null,

    controller:
      null,

    compositor:
      null,

    gestures:
      null,

    controllerFrameUnsubscribe:
      null,

    controllerHeldUnsubscribe:
      null,

    pointer:
      null,

    suppressedClick:
      null,

    initialized:
      false,

    initializing:
      false,

    runtimeActive:
      false,

    waitingForRuntime:
      true,

    readyPublished:
      false,

    compassSemanticReadyPublished:
      false,

    failed:
      false,

    disposed:
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

    projectedLabelLayer:
      null,

    projectedLabels:
      new Map(),

    projectedLabelFrame:
      0,

    retryTimer:
      0,

    retryCount:
      0,

    counters: {
      readinessChecks:
        0,

      runtimeActivations:
        0,

      runtimeDeactivations:
        0,

      compassSemanticReadinessChecks:
        0,

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

      compositorHits:
        0,

      compositorMisses:
        0,

      projectedTapCommits:
        0,

      projectedTapRejects:
        0,

      nativeCardinalCommits:
        0,

      nativeRoomCommits:
        0,

      nativeCompassCommits:
        0,

      nativeSemanticRejects:
        0,

      compassDirectCommits:
        0,

      compassDirectRejects:
        0,

      compassPanelFocusAttempts:
        0,

      orbitBegins:
        0,

      orbitPreviews:
        0,

      orbitCommits:
        0,

      orbitCancels:
        0,

      clusterBegins:
        0,

      clusterPreviews:
        0,

      clusterCommits:
        0,

      clusterCancels:
        0,

      flicksQualified:
        0,

      clusterReturns:
        0,

      nativeClicksSuppressed:
        0,

      interruptions:
        0,

      failures:
        0
    }
  };

  function normalize(value) {
    return String(
      value == null
        ? ""
        : value
    ).trim();
  }

  function normalizeLower(value) {
    return normalize(value)
      .toLowerCase();
  }

  function normalizeUpper(value) {
    return normalize(value)
      .toUpperCase();
  }

  function normalizeWing(value) {
    const wing =
      normalizeLower(value);

    return WINGS.includes(wing)
      ? wing
      : "";
  }

  function normalizeRoomId(value) {
    return normalize(value);
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function isElement(value) {
    return (
      typeof Element !== "undefined" &&
      value instanceof Element
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

        gestureHelperContract:
          GESTURES_CONTRACT,

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
    detail = {}
  ) {
    const pointer =
      state.pointer;

    return freezePlain({
      contract:
        CONTRACT,

      owner:
        OWNER,

      event,

      timestamp:
        nowIso(),

      initialized:
        state.initialized,

      initializing:
        state.initializing,

      runtimeActive:
        state.runtimeActive,

      waitingForRuntime:
        state.waitingForRuntime,

      readyPublished:
        state.readyPublished,

      compassSemanticReadyPublished:
        state.compassSemanticReadyPublished,

      failed:
        state.failed,

      disposed:
        state.disposed,

      controllerAvailable:
        Boolean(
          state.controller
        ),

      controllerCompassEndpointAvailable:
        Boolean(
          state.controller &&
          typeof state.controller.requestCompassSelection === "function"
        ),

      compositorAvailable:
        Boolean(
          state.compositor
        ),

      gestureHelperAvailable:
        Boolean(
          state.gestures
        ),

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

              gestureScope:
                pointer.gestureScope,

              dragging:
                pointer.dragging,

              controllerGestureActive:
                pointer.controllerGestureActive,

              previewAccepted:
                pointer.previewAccepted,

              activeWing:
                pointer.activeWing ||
                null,

              downIdentity:
                pointer.downIdentity ||
                null,

              previewPrimaryId:
                pointer.previewPrimaryId ||
                null
            }
          : null,

      counters: {
        ...state.counters
      },

      ...detail
    });
  }

  function publishReceipt(
    event,
    detail = {}
  ) {
    const payload =
      createReceipt(
        event,
        detail
      );

    if (state.receipt) {
      const serialized =
        JSON.stringify(payload);

      if ("value" in state.receipt) {
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
      typeof target.addEventListener !== "function"
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

  function removeListenerRegistry(registry) {
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
    const gestures =
      window[GESTURES_GLOBAL];

    if (!validGesturesApi(gestures)) {
      state.gestures =
        null;

      return null;
    }

    state.gestures =
      gestures;

    return gestures;
  }

  function discoverDom() {
    state.root =
      document.querySelector(
        SELECTORS.root
      );

    state.orbitField =
      state.root
        ? state.root.querySelector(
            SELECTORS.orbitField
          )
        : null;

    state.receipt =
      state.root
        ? state.root.querySelector(
            SELECTORS.receipt
          )
        : null;

    state.controllerPanel =
      state.root
        ? state.root.querySelector(
            SELECTORS.controllerPanel
          )
        : null;
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
        "The Showroom orbit field is outside the Showroom root."
      );
    }

    return issues;
  }

  function validControllerApi(controller) {
    return Boolean(
      controller &&
      typeof controller === "object" &&
      controller.moduleId === CONTROLLER_MODULE_ID &&
      controller.moduleVersion === CONTROLLER_MODULE_VERSION &&
      controller.interactionModuleId === EXPECTED_INTERACTION_MODULE_ID &&
      controller.interactionModuleVersion === EXPECTED_INTERACTION_MODULE_VERSION &&
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

  function validCompassControllerApi(controller) {
    return Boolean(
      controller &&
      typeof controller === "object" &&
      typeof controller.requestCompassSelection === "function"
    );
  }

  function resolveController() {
    const controller =
      window[CONTROLLER_GLOBAL];

    if (!controller || typeof controller !== "object") {
      state.controller =
        null;

      return null;
    }

    if (
      validControllerApi(controller) ||
      validCompassControllerApi(controller)
    ) {
      state.controller =
        controller;

      return controller;
    }

    state.controller =
      null;

    return null;
  }

  function strictControllerReady() {
    const controller =
      state.controller ||
      resolveController();

    return validControllerApi(
      controller
    );
  }

  function validControllerFrame(frame) {
    return Boolean(
      frame &&
      typeof frame === "object" &&
      frame.moduleId === CONTROLLER_MODULE_ID &&
      frame.moduleVersion === CONTROLLER_MODULE_VERSION &&
      typeof frame.state === "string" &&
      typeof frame.navigationState === "string" &&
      typeof frame.presentationMode === "string" &&
      typeof frame.held === "boolean" &&
      frame.orbitOrientation &&
      Array.isArray(
        frame.orbitOrientation.quaternion
      ) &&
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

  function readControllerFrame() {
    const controller =
      state.controller ||
      resolveController();

    if (
      !controller ||
      typeof controller.getFrameState !== "function"
    ) {
      return null;
    }

    try {
      const frame =
        controller.getFrameState();

      return validControllerFrame(frame)
        ? frame
        : null;
    } catch {
      return null;
    }
  }

  function controllerInteractionAllowed() {
    const frame =
      readControllerFrame();

    return Boolean(
      strictControllerReady() &&
      frame &&
      frame.held === false &&
      frame.navigationState !== NAVIGATION_STATES.SYSTEM_HELD &&
      frame.disposed !== true &&
      frame.failed !== true
    );
  }

  function compassControllerInteractionAllowed() {
    const controller =
      state.controller ||
      resolveController();

    if (!validCompassControllerApi(controller)) {
      return false;
    }

    if (typeof controller.getFrameState !== "function") {
      return true;
    }

    try {
      const frame =
        controller.getFrameState();

      if (
        !frame ||
        typeof frame !== "object"
      ) {
        return true;
      }

      if (
        frame.held === true ||
        frame.failed === true ||
        frame.disposed === true ||
        frame.navigationState === NAVIGATION_STATES.SYSTEM_HELD
      ) {
        return false;
      }

      return true;
    } catch {
      return true;
    }
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
    const compositor =
      window[COMPOSITOR_GLOBAL];

    if (!validCompositorApi(compositor)) {
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
        compositorState.contract !== COMPOSITOR_CONTRACT
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
      compositorState.initialized === true &&
      compositorState.readyPublished === true &&
      compositorState.controllerReady === true &&
      compositorState.failed !== true &&
      compositorState.disposed !== true &&
      compositorState.held !== true
    );
  }

  function runtimeReady() {
    return Boolean(
      (state.gestures || resolveGestures()) &&
      controllerInteractionAllowed() &&
      compositorProjectionReady()
    );
  }

  function compassSemanticReady() {
    state.counters.compassSemanticReadinessChecks +=
      1;

    return Boolean(
      state.initialized &&
      !state.disposed &&
      !state.failed &&
      compassControllerInteractionAllowed()
    );
  }

  function publishCompassSemanticReady(reason) {
    if (state.compassSemanticReadyPublished) {
      return;
    }

    if (!compassSemanticReady()) {
      return;
    }

    state.compassSemanticReadyPublished =
      true;

    publishReceipt(
      "compass-semantic-ready",
      {
        reason:
          normalize(reason) ||
          "controller-compass-endpoint-available",

        selector:
          SELECTORS.compassSemanticControl,

        directControllerRequest:
          true,

        compositorRequired:
          false,

        webGLRequired:
          false,

        planetRequired:
          false,

        gestureHelperRequired:
          false,

        projectedRuntimeRequired:
          false,

        immediateNavigation:
          false,

        navigationMeaning:
          "main-compass-return-selection",

        scrollOrFocusPanelAfterSelection:
          true
      }
    );
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

  function isInsideRoot(target) {
    return Boolean(
      isElement(target) &&
      state.root &&
      state.root.contains(target)
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

  function isCompassSemanticControl(control) {
    return Boolean(
      control &&
      control.matches(
        SELECTORS.compassSemanticControl
      )
    );
  }

  function resolveSemanticControl(target) {
    if (
      !isElement(target) ||
      !state.root
    ) {
      return null;
    }

    const control =
      target.closest(
        SELECTORS.semanticControl
      );

    if (!control) {
      return null;
    }

    if (!state.root.contains(control)) {
      return null;
    }

    if (isCompassSemanticControl(control)) {
      return control;
    }

    return (
      state.orbitField &&
      state.orbitField.contains(control)
    )
      ? control
      : null;
  }

  function semanticKindFromControl(control) {
    if (!control) {
      return "";
    }

    if (
      control.matches(
        SELECTORS.compassSemanticControl
      )
    ) {
      return SEMANTIC_KINDS.COMPASS;
    }

    if (
      control.matches(
        SELECTORS.roomControl
      )
    ) {
      return SEMANTIC_KINDS.ROOM;
    }

    if (
      control.matches(
        SELECTORS.cardinalControl
      )
    ) {
      return SEMANTIC_KINDS.CARDINAL;
    }

    return "";
  }

  function semanticIdentityFromControl(control) {
    if (!control) {
      return "";
    }

    const kind =
      semanticKindFromControl(
        control
      );

    if (
      kind === SEMANTIC_KINDS.ROOM
    ) {
      return normalizeRoomId(
        control.dataset.showroomChildId
      );
    }

    if (
      kind === SEMANTIC_KINDS.CARDINAL
    ) {
      return normalizeWing(
        control.dataset.showroomCardinalId
      );
    }

    if (
      kind === SEMANTIC_KINDS.COMPASS
    ) {
      return "home-compass";
    }

    return "";
  }

  function semanticControlEnabled(control) {
    if (!control) {
      return false;
    }

    return !(
      control.matches(":disabled") ||
      control.getAttribute("aria-disabled") === "true"
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
    const match =
      normalizeRoomId(roomId)
        .match(/-(\d+)$/);

    if (!match) {
      return 0;
    }

    const ordinal =
      Number(match[1]);

    return (
      ordinal >= 1 &&
      ordinal <= 4
    )
      ? ordinal
      : 0;
  }

  function semanticKindFromHit(hit) {
    if (!hit) {
      return "";
    }

    const kind =
      normalizeLower(
        hit.kind
      );

    if (
      kind === "room" ||
      kind === "child"
    ) {
      return SEMANTIC_KINDS.ROOM;
    }

    if (
      kind === "cardinal" ||
      kind === "coin"
    ) {
      return SEMANTIC_KINDS.CARDINAL;
    }

    if (
      normalize(hit.childId)
    ) {
      return SEMANTIC_KINDS.ROOM;
    }

    if (
      normalizeWing(hit.cardinalId)
    ) {
      return SEMANTIC_KINDS.CARDINAL;
    }

    const identity =
      deriveHitIdentity(hit);

    if (
      roomOrdinal(identity) > 0
    ) {
      return SEMANTIC_KINDS.ROOM;
    }

    if (normalizeWing(identity)) {
      return SEMANTIC_KINDS.CARDINAL;
    }

    return "";
  }

  function semanticIdentityFromHit(
    hit,
    kind = semanticKindFromHit(hit)
  ) {
    if (!hit) {
      return "";
    }

    if (
      kind === SEMANTIC_KINDS.ROOM
    ) {
      return normalizeRoomId(
        hit.childId ||
        hit.semanticObjectId ||
        hit.projectionId ||
        hit.id
      );
    }

    if (
      kind === SEMANTIC_KINDS.CARDINAL
    ) {
      return normalizeWing(
        hit.cardinalId ||
        hit.semanticObjectId ||
        hit.projectionId ||
        hit.id
      );
    }

    return "";
  }

  function authoritativeHitTest(
    clientX,
    clientY
  ) {
    if (!runtimeReady()) {
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

      if (
        !hit ||
        !deriveHitIdentity(hit)
      ) {
        state.counters.compositorMisses +=
          1;

        return null;
      }

      state.counters.compositorHits +=
        1;

      return hit;
    } catch {
      state.counters.compositorMisses +=
        1;

      return null;
    }
  }


  function projectedLabelText(kind, identity) {
    if (kind === SEMANTIC_KINDS.CARDINAL) {
      return CARDINAL_DISPLAY_LABELS[identity] || "";
    }

    if (kind === SEMANTIC_KINDS.ROOM) {
      return ROOM_DISPLAY_LABELS[identity] || "";
    }

    return "";
  }

  function ensureProjectedLabelLayer() {
    if (
      state.projectedLabelLayer &&
      state.projectedLabelLayer.isConnected
    ) {
      return state.projectedLabelLayer;
    }

    if (!state.orbitField) {
      return null;
    }

    let layer =
      state.orbitField.querySelector(
        "[data-showroom-projected-label-layer]"
      );

    if (!layer) {
      layer = document.createElement("div");
      layer.className = "showroom-projected-label-layer";
      layer.dataset.showroomProjectedLabelLayer = "true";
      layer.setAttribute("aria-hidden", "true");
      state.orbitField.appendChild(layer);
    }

    state.projectedLabelLayer = layer;
    return layer;
  }

  function syncProjectedLabelContent(
    element,
    kind,
    identity,
    label
  ) {
    if (kind === SEMANTIC_KINDS.CARDINAL) {
      let letter =
        element.querySelector(
          "[data-showroom-projected-cardinal-letter]"
        );
      let word =
        element.querySelector(
          "[data-showroom-projected-cardinal-word]"
        );

      if (!letter || !word) {
        element.replaceChildren();

        letter = document.createElement("span");
        letter.className =
          "showroom-projected-label__cardinal-letter";
        letter.dataset.showroomProjectedCardinalLetter = identity;
        letter.setAttribute("aria-hidden", "true");

        word = document.createElement("span");
        word.className =
          "showroom-projected-label__cardinal-word";
        word.dataset.showroomProjectedCardinalWord = identity;

        element.append(letter, word);
      }

      letter.textContent =
        CARDINAL_DISPLAY_LETTERS[identity] || "";
      word.textContent = label;
      element.dataset.showroomProjectedContentModel =
        "compass-family-letter-word";
      return;
    }

    if (
      element.dataset.showroomProjectedContentModel !==
      "cluster-primary-only"
    ) {
      element.replaceChildren();
    }

    element.textContent = label;
    element.dataset.showroomProjectedContentModel =
      "cluster-primary-only";
  }

  function syncProjectedLabels() {
    state.projectedLabelFrame = 0;

    const layer = ensureProjectedLabelLayer();
    const controller =
      state.controller ||
      resolveController();

    const gestures =
      state.gestures ||
      resolveGestures();

    if (
      !layer ||
      !controller ||
      typeof controller.getSemanticProjection !== "function" ||
      typeof controller.getFrameState !== "function"
    ) {
      return false;
    }

    let records = [];
    let frame = null;

    try {
      records = Array.from(
        controller.getSemanticProjection() || []
      );
      frame = controller.getFrameState();
    } catch {
      records = [];
      frame = null;
    }

    const mode = presentationMode(frame);
    const activeIdentities = new Set();
    const rect = state.orbitField.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const constellationPrimary = normalizeWing(
      frame && frame.orbitGestureActive
        ? frame.orbitPreviewFocus
        : frame && frame.orbitFocus
    );
    const controllerClusterPrimary = normalizeRoomId(
      frame && frame.cluster
        ? frame.cluster.gestureActive
          ? frame.cluster.previewPrimaryRoom
          : frame.cluster.primaryRoom
        : ""
    );
    const clusterPrimary = normalizeRoomId(
      frame &&
      frame.cluster &&
      gestures &&
      typeof gestures.primaryRoomForQuaternion === "function" &&
      typeof gestures.orientationQuaternion === "function"
        ? gestures.primaryRoomForQuaternion(
            frame.cluster.roomIds,
            gestures.orientationQuaternion(
              frame.cluster.orientation
            ),
            controllerClusterPrimary
          )
        : controllerClusterPrimary
    );

    layer.dataset.showroomProjectedLabelMode =
      normalizeLower(mode);
    layer.dataset.showroomProjectedClusterModel =
      "primary-only";

    for (const record of records) {
      if (!record || record.visible === false) {
        continue;
      }

      const kind = semanticKindFromHit(record);
      const identity = semanticIdentityFromHit(record, kind);
      const label = projectedLabelText(kind, identity);

      if (!identity || !label) {
        continue;
      }

      if (
        mode === PRESENTATION_MODES.CONSTELLATION &&
        kind !== SEMANTIC_KINDS.CARDINAL
      ) {
        continue;
      }

      if (
        mode === PRESENTATION_MODES.CLUSTER &&
        (
          kind !== SEMANTIC_KINDS.ROOM ||
          identity !== clusterPrimary
        )
      ) {
        continue;
      }

      if (mode === PRESENTATION_MODES.HELD) {
        continue;
      }

      activeIdentities.add(identity);

      let element = state.projectedLabels.get(identity);

      if (!element) {
        element = document.createElement("span");
        element.className = "showroom-projected-label";
        element.dataset.showroomProjectedLabel = identity;
        layer.appendChild(element);
        state.projectedLabels.set(identity, element);
      }

      syncProjectedLabelContent(
        element,
        kind,
        identity,
        label
      );

      const x = Number(record.x);
      const y = Number(record.y);
      const radius = Math.max(0, Number(record.radiusPx) || 0);
      const dx = x - centerX;
      const dy = y - centerY;
      const magnitude = Math.hypot(dx, dy) || 1;
      const roomOffset =
        Math.min(30, Math.max(17, radius * 0.24 + 8));
      const candidateLeft =
        kind === SEMANTIC_KINDS.CARDINAL
          ? x
          : x - (dx / magnitude) * roomOffset;
      const candidateTop =
        kind === SEMANTIC_KINDS.CARDINAL
          ? y
          : y - (dy / magnitude) * roomOffset;
      const depth = normalizeLower(record.depthLayer) || "unknown";
      const primary =
        kind === SEMANTIC_KINDS.CARDINAL
          ? identity === constellationPrimary
          : identity === clusterPrimary;

      element.hidden = false;
      element.dataset.showroomProjectedKind = kind;
      element.dataset.showroomProjectedDepth = depth;
      element.dataset.showroomProjectedPrimary = primary ? "true" : "false";
      element.dataset.showroomProjectedPlacement =
        kind === SEMANTIC_KINDS.CARDINAL
          ? "star-center-protected-letter-word"
          : "inward-edge-primary-only";
      element.style.visibility = "hidden";
      element.style.left = "0px";
      element.style.top = "0px";

      const labelRect = element.getBoundingClientRect();
      const labelWidth = Math.max(
        1,
        labelRect.width || element.offsetWidth || 1
      );
      const labelHeight = Math.max(
        1,
        labelRect.height || element.offsetHeight || 1
      );
      const safeInset = kind === SEMANTIC_KINDS.CARDINAL ? 10 : 8;
      const minLeft = safeInset + labelWidth / 2;
      const maxLeft = Math.max(
        minLeft,
        rect.width - safeInset - labelWidth / 2
      );
      const minTop = safeInset + labelHeight / 2;
      const maxTop = Math.max(
        minTop,
        rect.height - safeInset - labelHeight / 2
      );
      const left = Math.min(
        maxLeft,
        Math.max(minLeft, candidateLeft)
      );
      const top = Math.min(
        maxTop,
        Math.max(minTop, candidateTop)
      );
      const clamped =
        Math.abs(left - candidateLeft) > 0.5 ||
        Math.abs(top - candidateTop) > 0.5;

      element.style.left = `${left}px`;
      element.style.top = `${top}px`;
      element.style.zIndex = depth === "front" ? "28" : "8";
      element.style.visibility = "visible";
      element.dataset.showroomProjectedClamped = clamped ? "true" : "false";
    }

    for (const [identity, element] of state.projectedLabels) {
      if (!activeIdentities.has(identity)) {
        element.hidden = true;
      }
    }

    return true;
  }

  function scheduleProjectedLabels() {
    if (
      state.projectedLabelFrame ||
      state.disposed ||
      state.failed
    ) {
      return;
    }

    state.projectedLabelFrame =
      window.requestAnimationFrame(
        syncProjectedLabels
      );
  }

  function hitsCorrespond(first, second) {
    if (
      !first ||
      !second
    ) {
      return false;
    }

    const firstKind =
      semanticKindFromHit(first);

    const secondKind =
      semanticKindFromHit(second);

    const firstIdentity =
      semanticIdentityFromHit(
        first,
        firstKind
      );

    const secondIdentity =
      semanticIdentityFromHit(
        second,
        secondKind
      );

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
    if (
      !frame ||
      frame.held === true
    ) {
      return PRESENTATION_MODES.HELD;
    }

    const mode =
      normalizeUpper(
        frame.presentationMode
      );

    if (
      mode === PRESENTATION_MODES.CONSTELLATION
    ) {
      return PRESENTATION_MODES.CONSTELLATION;
    }

    if (
      mode === PRESENTATION_MODES.CLUSTER
    ) {
      return PRESENTATION_MODES.CLUSTER;
    }

    return PRESENTATION_MODES.HELD;
  }

  function gestureScopeForFrame(frame) {
    const mode =
      presentationMode(frame);

    if (
      mode === PRESENTATION_MODES.CONSTELLATION
    ) {
      return GESTURE_SCOPES.ORBIT;
    }

    if (
      mode === PRESENTATION_MODES.CLUSTER
    ) {
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

  function clusterRoomIdsFromFrame(
    frame,
    wing
  ) {
    if (
      frame &&
      frame.cluster &&
      frame.cluster.wing === wing &&
      Array.isArray(frame.cluster.roomIds) &&
      frame.cluster.roomIds.length === 4
    ) {
      return frame.cluster.roomIds
        .map(normalizeRoomId);
    }

    return [
      `${wing}-1`,
      `${wing}-2`,
      `${wing}-3`,
      `${wing}-4`
    ];
  }

  function startQuaternionFromFrame(
    frame,
    scope
  ) {
    const gestures =
      state.gestures ||
      resolveGestures();

    if (!gestures) {
      return [
        0,
        0,
        0,
        1
      ];
    }

    if (
      scope === GESTURE_SCOPES.CLUSTER &&
      frame &&
      frame.cluster
    ) {
      return gestures.orientationQuaternion(
        frame.cluster.orientation
      );
    }

    return gestures.orientationQuaternion(
      frame &&
      frame.orbitOrientation
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
        typeof state.orbitField.hasPointerCapture !== "function" ||
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
        typeof state.orbitField.hasPointerCapture !== "function" ||
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
    reason
  ) {
    state.suppressedClick = {
      element:
        element ||
        state.orbitField,

      reason:
        normalize(reason) ||
        "pointer-interaction",

      expires:
        performance.now() +
        CONFIG.suppressClickMs
    };
  }

  function shouldSuppressClick(event) {
    const suppression =
      state.suppressedClick;

    if (!suppression) {
      return false;
    }

    if (
      performance.now() >
      suppression.expires
    ) {
      state.suppressedClick =
        null;

      return false;
    }

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

  function focusCompassPanelAfterSelection() {
    const panel =
      state.controllerPanel ||
      (
        state.root &&
        state.root.querySelector(
          SELECTORS.controllerPanel
        )
      );

    if (!panel) {
      return false;
    }

    state.controllerPanel =
      panel;

    state.counters.compassPanelFocusAttempts +=
      1;

    window.setTimeout(
      () => {
        try {
          panel.scrollIntoView({
            block:
              "nearest",

            inline:
              "nearest",

            behavior:
              "smooth"
          });
        } catch {
          try {
            panel.scrollIntoView();
          } catch {
            /* Best-effort scroll. */
          }
        }

        try {
          const hadTabIndex =
            panel.hasAttribute(
              "tabindex"
            );

          if (!hadTabIndex) {
            panel.setAttribute(
              "tabindex",
              "-1"
            );
          }

          panel.focus({
            preventScroll:
              true
          });

          if (!hadTabIndex) {
            window.setTimeout(
              () => {
                if (
                  panel.getAttribute(
                    "tabindex"
                  ) === "-1"
                ) {
                  panel.removeAttribute(
                    "tabindex"
                  );
                }
              },
              700
            );
          }
        } catch {
          /* Best-effort focus. */
        }
      },
      CONFIG.compassPanelScrollDelayMs
    );

    return true;
  }

  function requestSemanticSelection(
    kind,
    identity,
    source
  ) {
    const controller =
      state.controller ||
      resolveController();

    let committed =
      false;

    if (
      kind === SEMANTIC_KINDS.COMPASS
    ) {
      if (!compassControllerInteractionAllowed()) {
        state.counters.compassDirectRejects +=
          1;

        publishReceipt(
          "semantic-selection-rejected",
          {
            source,

            kind:
              SEMANTIC_KINDS.COMPASS,

            identity:
              identity ||
              "home-compass",

            reason:
              "compass-controller-unavailable-or-held",

            compositorRequired:
              false,

            webGLRequired:
              false,

            planetRequired:
              false,

            gestureHelperRequired:
              false,

            projectedRuntimeRequired:
              false
          }
        );

        return false;
      }

      try {
        committed =
          controller.requestCompassSelection() !== false;
      } catch {
        committed =
          false;
      }

      if (committed) {
        state.counters.compassDirectCommits +=
          1;

        focusCompassPanelAfterSelection();
      } else {
        state.counters.compassDirectRejects +=
          1;
      }

      publishReceipt(
        committed
          ? "semantic-selection-committed"
          : "semantic-selection-rejected",
        {
          source,

          kind:
            SEMANTIC_KINDS.COMPASS,

          identity:
            identity ||
            "home-compass",

          directControllerRequest:
            true,

          requestedControllerMethod:
            "requestCompassSelection",

          immediateNavigation:
            false,

          compositorRequired:
            false,

          webGLRequired:
            false,

          planetRequired:
            false,

          gestureHelperRequired:
            false,

          projectedRuntimeRequired:
            false,

          scrollOrFocusPanelAfterSelection:
            committed
        }
      );

      return committed;
    }

    if (
      !controller ||
      !controllerInteractionAllowed()
    ) {
      return false;
    }

    try {
      if (
        kind === SEMANTIC_KINDS.CARDINAL
      ) {
        const wing =
          normalizeWing(identity);

        committed =
          Boolean(
            wing &&
            controller.requestCardinalSelection(
              wing
            ) !== false
          );
      } else if (
        kind === SEMANTIC_KINDS.ROOM
      ) {
        const roomId =
          normalizeRoomId(identity);

        committed =
          Boolean(
            roomId &&
            controller.requestRoomSelection(
              roomId
            ) !== false
          );
      }
    } catch {
      committed =
        false;
    }

    publishReceipt(
      committed
        ? "semantic-selection-committed"
        : "semantic-selection-rejected",
      {
        source,

        kind:
          kind ||
          null,

        identity:
          identity ||
          null
      }
    );

    return committed;
  }

  function commitProjectedTap(
    pointer,
    event
  ) {
    if (
      !pointer ||
      !pointer.downHit ||
      !runtimeReady()
    ) {
      state.counters.projectedTapRejects +=
        1;

      return false;
    }

    const releaseHit =
      authoritativeHitTest(
        event.clientX,
        event.clientY
      );

    if (
      !releaseHit ||
      !hitsCorrespond(
        pointer.downHit,
        releaseHit
      )
    ) {
      state.counters.projectedTapRejects +=
        1;

      armClickSuppression(
        pointer.directControl ||
        state.orbitField,
        "projected-tap-correspondence-rejected"
      );

      return false;
    }

    const kind =
      semanticKindFromHit(
        releaseHit
      );

    const identity =
      semanticIdentityFromHit(
        releaseHit,
        kind
      );

    if (
      !kind ||
      !identity
    ) {
      state.counters.projectedTapRejects +=
        1;

      return false;
    }

    const committed =
      requestSemanticSelection(
        kind,
        identity,
        "projected-pointer"
      );

    armClickSuppression(
      pointer.directControl ||
      state.orbitField,
      committed
        ? "projected-tap-committed"
        : "projected-tap-rejected"
    );

    if (committed) {
      state.counters.projectedTapCommits +=
        1;
    } else {
      state.counters.projectedTapRejects +=
        1;
    }

    return committed;
  }

  function commitCompassTap(
    pointer,
    event
  ) {
    const control =
      pointer &&
      pointer.directControl;

    if (
      !control ||
      !semanticControlEnabled(control) ||
      !compassSemanticReady()
    ) {
      return false;
    }

    const releaseElement =
      typeof document.elementFromPoint === "function"
        ? document.elementFromPoint(
            event.clientX,
            event.clientY
          )
        : null;

    const releaseStillInRoot =
      !releaseElement ||
      isInsideRoot(releaseElement);

    const movementAcceptable =
      pointer.maximumDistance <=
      CONFIG.maximumTapDistancePx;

    if (
      !releaseStillInRoot ||
      !movementAcceptable
    ) {
      armClickSuppression(
        control,
        "compass-tap-correspondence-rejected"
      );

      return false;
    }

    const committed =
      requestSemanticSelection(
        SEMANTIC_KINDS.COMPASS,
        "home-compass",
        "compass-pointer"
      );

    armClickSuppression(
      control,
      committed
        ? "compass-tap-committed"
        : "compass-tap-rejected"
    );

    return committed;
  }

  function beginControllerGesture(pointer) {
    const controller =
      state.controller ||
      resolveController();

    if (
      !controller ||
      pointer.controllerGestureActive
    ) {
      return Boolean(
        pointer.controllerGestureActive
      );
    }

    let accepted =
      false;

    try {
      if (
        pointer.gestureScope === GESTURE_SCOPES.ORBIT
      ) {
        accepted =
          controller.beginOrbitGesture() !== false;

        if (accepted) {
          state.counters.orbitBegins +=
            1;
        }
      } else if (
        pointer.gestureScope === GESTURE_SCOPES.CLUSTER &&
        pointer.activeWing
      ) {
        accepted =
          controller.beginClusterGesture(
            pointer.activeWing
          ) !== false;

        if (accepted) {
          state.counters.clusterBegins +=
            1;
        }
      }
    } catch {
      accepted =
        false;
    }

    pointer.controllerGestureActive =
      accepted;

    return accepted;
  }

  function previewControllerGesture(
    pointer,
    frame
  ) {
    const controller =
      state.controller ||
      resolveController();

    const gestures =
      state.gestures ||
      resolveGestures();

    if (
      !controller ||
      !gestures ||
      !pointer.controllerGestureActive
    ) {
      return false;
    }

    let accepted =
      false;

    try {
      if (
        pointer.gestureScope === GESTURE_SCOPES.ORBIT
      ) {
        const primaryId =
          gestures.primaryWingForQuaternion(
            pointer.currentQuaternion
          );

        accepted =
          controller.requestOrbitPreview({
            quaternion:
              pointer.currentQuaternion.slice(),

            primaryId
          }) !== false;

        pointer.previewPrimaryId =
          primaryId;

        if (accepted) {
          state.counters.orbitPreviews +=
            1;
        }
      } else if (
        pointer.gestureScope === GESTURE_SCOPES.CLUSTER &&
        pointer.activeWing
      ) {
        const previousPrimaryId =
          pointer.previewPrimaryId ||
          normalizeRoomId(
            frame && frame.cluster
              ? frame.cluster.previewPrimaryRoom ||
                frame.cluster.primaryRoom
              : ""
          );
        const primaryId =
          gestures.primaryRoomForQuaternion(
            pointer.clusterRoomIds,
            pointer.currentQuaternion,
            previousPrimaryId
          );

        if (!primaryId) {
          return false;
        }

        accepted =
          controller.requestClusterPreview(
            pointer.activeWing,
            {
              quaternion:
                pointer.currentQuaternion.slice(),

              primaryId
            }
          ) !== false;

        pointer.previewPrimaryId =
          primaryId;

        if (accepted) {
          state.counters.clusterPreviews +=
            1;
        }
      }
    } catch {
      accepted =
        false;
    }

    pointer.previewAccepted =
      accepted;

    return accepted;
  }

  function commitControllerGesture(pointer) {
    const controller =
      state.controller ||
      resolveController();

    if (
      !controller ||
      !pointer.controllerGestureActive ||
      !pointer.previewAccepted
    ) {
      return false;
    }

    let committed =
      false;

    try {
      if (
        pointer.gestureScope === GESTURE_SCOPES.ORBIT
      ) {
        committed =
          controller.requestOrbitCommit() !== false;

        if (committed) {
          state.counters.orbitCommits +=
            1;
        }
      } else if (
        pointer.gestureScope === GESTURE_SCOPES.CLUSTER &&
        pointer.activeWing
      ) {
        committed =
          controller.requestClusterCommit(
            pointer.activeWing
          ) !== false;

        if (committed) {
          state.counters.clusterCommits +=
            1;
        }
      }
    } catch {
      committed =
        false;
    }

    if (committed) {
      pointer.controllerGestureActive =
        false;

      pointer.previewAccepted =
        false;
    }

    return committed;
  }

  function cancelControllerGesture(
    pointer,
    reason
  ) {
    if (
      !pointer ||
      !pointer.controllerGestureActive
    ) {
      return false;
    }

    const controller =
      state.controller ||
      resolveController();

    let cancelled =
      false;

    try {
      if (
        controller &&
        pointer.gestureScope === GESTURE_SCOPES.ORBIT
      ) {
        cancelled =
          controller.requestOrbitCancel(
            reason
          ) !== false;

        if (cancelled) {
          state.counters.orbitCancels +=
            1;
        }
      } else if (
        controller &&
        pointer.gestureScope === GESTURE_SCOPES.CLUSTER &&
        pointer.activeWing
      ) {
        cancelled =
          controller.requestClusterCancel(
            pointer.activeWing,
            reason
          ) !== false;

        if (cancelled) {
          state.counters.clusterCancels +=
            1;
        }
      }
    } catch {
      cancelled =
        false;
    }

    pointer.controllerGestureActive =
      false;

    pointer.previewAccepted =
      false;

    return cancelled;
  }

  function requestClusterFlickReturn(
    pointer,
    flick
  ) {
    const controller =
      state.controller ||
      resolveController();

    if (
      !controller ||
      pointer.gestureScope !== GESTURE_SCOPES.CLUSTER ||
      !pointer.activeWing
    ) {
      return false;
    }

    cancelControllerGesture(
      pointer,
      "cluster-flick-return"
    );

    let committed =
      false;

    try {
      committed =
        controller.requestReturnToConstellation({
          scrollToScene:
            true
        }) !== false;
    } catch {
      committed =
        false;
    }

    if (committed) {
      state.counters.clusterReturns +=
        1;
    }

    publishReceipt(
      committed
        ? "cluster-flick-return-committed"
        : "cluster-flick-return-rejected",
      {
        activeWing:
          pointer.activeWing,

        direction:
          flick.direction
      }
    );

    return committed;
  }

  function createPointerState(
    event,
    frame
  ) {
    const directControl =
      resolveSemanticControl(
        event.target
      );

    const directKind =
      semanticKindFromControl(
        directControl
      );

    const projectedHit =
      authoritativeHitTest(
        event.clientX,
        event.clientY
      );

    const projectedHitKind =
      semanticKindFromHit(
        projectedHit
      );

    const frontProjectionOverridesCompass =
      directKind === SEMANTIC_KINDS.COMPASS &&
      projectedHit &&
      projectedHit.visible !== false &&
      normalizeLower(projectedHit.depthLayer) === "front" &&
      (
        projectedHitKind === SEMANTIC_KINDS.CARDINAL ||
        projectedHitKind === SEMANTIC_KINDS.ROOM
      );

    const downHit =
      directKind === SEMANTIC_KINDS.COMPASS &&
      !frontProjectionOverridesCompass
        ? null
        : projectedHit;

    const hitKind =
      semanticKindFromHit(
        downHit
      );

    const hitIdentity =
      semanticIdentityFromHit(
        downHit,
        hitKind
      );

    const directIdentity =
      semanticIdentityFromControl(
        directControl
      );

    let territory =
      TERRITORIES.FIELD;

    if (
      directKind === SEMANTIC_KINDS.COMPASS &&
      !frontProjectionOverridesCompass
    ) {
      territory =
        TERRITORIES.COMPASS;
    } else if (
      hitKind === SEMANTIC_KINDS.CARDINAL
    ) {
      territory =
        TERRITORIES.CARDINAL;
    } else if (
      hitKind === SEMANTIC_KINDS.ROOM
    ) {
      territory =
        TERRITORIES.ROOM;
    } else if (directControl) {
      territory =
        TERRITORIES.NATIVE_SEMANTIC;
    }

    const gestureScope =
      territory === TERRITORIES.COMPASS ||
      territory === TERRITORIES.NATIVE_SEMANTIC
        ? ""
        : gestureScopeForFrame(frame);

    const activeWing =
      activeWingFromFrame(frame);

    const startQuaternion =
      startQuaternionFromFrame(
        frame,
        gestureScope
      );

    const timestamp =
      performance.now();

    return {
      pointerId:
        event.pointerId,

      pointerType:
        normalize(event.pointerType) ||
        "mouse",

      territory,
      gestureScope,

      directControl,
      directKind,
      directIdentity,

      downHit,
      downKind:
        hitKind,

      downIdentity:
        hitIdentity ||
        directIdentity,

      activeWing,

      clusterRoomIds:
        activeWing
          ? clusterRoomIdsFromFrame(
              frame,
              activeWing
            )
          : [],

      startQuaternion,
      currentQuaternion:
        startQuaternion.slice(),

      previewPrimaryId:
        "",

      previewAccepted:
        false,

      controllerGestureActive:
        false,

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

      finishing:
        false,

      cancelled:
        false,

      captureAcquired:
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
    const gestures =
      state.gestures ||
      resolveGestures();

    if (!gestures) {
      return false;
    }

    const timestamp =
      performance.now();

    pointer.pathLength +=
      gestures.distance2d(
        pointer.currentX,
        pointer.currentY,
        event.clientX,
        event.clientY
      );

    pointer.currentX =
      event.clientX;

    pointer.currentY =
      event.clientY;

    pointer.currentTime =
      timestamp;

    pointer.maximumDistance =
      Math.max(
        pointer.maximumDistance,
        gestures.distance2d(
          pointer.startX,
          pointer.startY,
          pointer.currentX,
          pointer.currentY
        )
      );

    pointer.samples =
      gestures.appendSample(
        pointer.samples,
        pointer.currentX,
        pointer.currentY,
        timestamp,
        CONFIG
      );

    return true;
  }

  function clearPointer(
    pointer,
    releaseCapture = true
  ) {
    if (!pointer) {
      return;
    }

    pointer.finishing =
      true;

    if (state.pointer === pointer) {
      state.pointer =
        null;
    }

    if (releaseCapture) {
      releasePointer(
        pointer.pointerId
      );
    }
  }

  function interruptActivePointer(
    reason,
    releaseCapture = true
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

    cancelControllerGesture(
      pointer,
      reason
    );

    if (
      pointer.dragging ||
      pointer.maximumDistance > CONFIG.maximumTapDistancePx
    ) {
      armClickSuppression(
        pointer.directControl ||
        state.orbitField,
        reason
      );
    }

    clearPointer(
      pointer,
      releaseCapture
    );

    publishReceipt(
      "gesture-interrupted",
      {
        reason,

        pointerId:
          pointer.pointerId,

        territory:
          pointer.territory,

        gestureScope:
          pointer.gestureScope
      }
    );

    return true;
  }

  function handlePointerDown(event) {
    if (
      state.pointer ||
      state.disposed ||
      state.failed ||
      !isPrimaryPointerEvent(event) ||
      !isInsideOrbitField(event.target) ||
      isProtectedTarget(event.target)
    ) {
      return;
    }

    const directControl =
      resolveSemanticControl(
        event.target
      );

    const directKind =
      semanticKindFromControl(
        directControl
      );

    if (
      directKind !== SEMANTIC_KINDS.COMPASS &&
      !state.runtimeActive
    ) {
      return;
    }

    const frame =
      readControllerFrame();

    if (
      directKind !== SEMANTIC_KINDS.COMPASS &&
      (
        !frame ||
        frame.held === true
      )
    ) {
      return;
    }

    if (
      directKind === SEMANTIC_KINDS.COMPASS &&
      !compassSemanticReady()
    ) {
      publishReceipt(
        "compass-pointer-rejected",
        {
          reason:
            "compass-semantic-controller-not-ready",

          compositorRequired:
            false,

          webGLRequired:
            false,

          planetRequired:
            false,

          gestureHelperRequired:
            false,

          projectedRuntimeRequired:
            false
        }
      );

      return;
    }

    const pointer =
      createPointerState(
        event,
        frame
      );

    if (
      pointer.territory === TERRITORIES.NATIVE_SEMANTIC
    ) {
      publishReceipt(
        "native-semantic-path-preserved",
        {
          kind:
            pointer.directKind ||
            null,

          identity:
            pointer.directIdentity ||
            null
        }
      );

      return;
    }

    if (
      pointer.territory !== TERRITORIES.COMPASS &&
      !pointer.gestureScope
    ) {
      return;
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

      return;
    }

    state.counters.pointerDown +=
      1;

    event.preventDefault();

    publishReceipt(
      "pointer-started",
      {
        pointerId:
          pointer.pointerId,

        pointerType:
          pointer.pointerType,

        territory:
          pointer.territory,

        gestureScope:
          pointer.gestureScope,

        downKind:
          pointer.downKind ||
          null,

        downIdentity:
          pointer.downIdentity ||
          null,

        activeWing:
          pointer.activeWing ||
          null,

        compassSemanticDirect:
          pointer.territory === TERRITORIES.COMPASS,

        compositorRequired:
          pointer.territory === TERRITORIES.COMPASS
            ? false
            : true,

        gestureHelperRequired:
          pointer.territory === TERRITORIES.COMPASS
            ? false
            : true,

        projectedRuntimeRequired:
          pointer.territory === TERRITORIES.COMPASS
            ? false
            : true
      }
    );
  }

  function handlePointerMove(event) {
    const pointer =
      state.pointer;

    if (
      !pointer ||
      pointer.pointerId !== event.pointerId ||
      pointer.finishing
    ) {
      return;
    }

    if (
      pointer.territory === TERRITORIES.COMPASS
    ) {
      if (!compassSemanticReady()) {
        interruptActivePointer(
          "compass-controller-runtime-invalid"
        );

        return;
      }
    } else if (!runtimeReady()) {
      interruptActivePointer(
        "projected-runtime-invalid"
      );

      return;
    }

    state.counters.pointerMove +=
      1;

    if (
      !updatePointer(
        pointer,
        event
      )
    ) {
      interruptActivePointer(
        "gesture-helper-unavailable"
      );

      return;
    }

    if (
      !pointer.dragging &&
      pointer.maximumDistance >= CONFIG.dragDeadZonePx
    ) {
      pointer.dragging =
        true;

      if (
        pointer.territory !== TERRITORIES.COMPASS
      ) {
        const began =
          beginControllerGesture(
            pointer
          );

        if (!began) {
          interruptActivePointer(
            "gesture-begin-rejected"
          );

          return;
        }
      }
    }

    if (
      pointer.dragging &&
      pointer.territory !== TERRITORIES.COMPASS
    ) {
      const gestures =
        state.gestures ||
        resolveGestures();

      if (!gestures) {
        interruptActivePointer(
          "gesture-helper-unavailable"
        );

        return;
      }

      const rect =
        state.orbitField.getBoundingClientRect();

      pointer.currentQuaternion =
        gestures.dragQuaternion({
          pointer,

          clientX:
            event.clientX,

          clientY:
            event.clientY,

          width:
            Math.max(
              1,
              rect.width
            ),

          height:
            Math.max(
              1,
              rect.height
            ),

          config:
            CONFIG
        });

      const frame =
        readControllerFrame();

      if (
        !frame ||
        !previewControllerGesture(
          pointer,
          frame
        )
      ) {
        interruptActivePointer(
          "gesture-preview-rejected"
        );

        return;
      }
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
      pointer.pointerId !== event.pointerId ||
      pointer.finishing
    ) {
      return;
    }

    const gestures =
      state.gestures ||
      resolveGestures();

    if (
      !gestures &&
      pointer.territory !== TERRITORIES.COMPASS
    ) {
      interruptActivePointer(
        "gesture-helper-unavailable"
      );

      return;
    }

    const releaseTime =
      performance.now();

    const releaseX =
      Number.isFinite(event.clientX)
        ? event.clientX
        : pointer.currentX;

    const releaseY =
      Number.isFinite(event.clientY)
        ? event.clientY
        : pointer.currentY;

    if (gestures) {
      pointer.pathLength +=
        gestures.distance2d(
          pointer.currentX,
          pointer.currentY,
          releaseX,
          releaseY
        );

      pointer.maximumDistance =
        Math.max(
          pointer.maximumDistance,
          gestures.distance2d(
            pointer.startX,
            pointer.startY,
            releaseX,
            releaseY
          )
        );

      pointer.samples =
        gestures.appendSample(
          pointer.samples,
          releaseX,
          releaseY,
          releaseTime,
          CONFIG
        );
    } else {
      pointer.pathLength +=
        Math.hypot(
          pointer.currentX - releaseX,
          pointer.currentY - releaseY
        );

      pointer.maximumDistance =
        Math.max(
          pointer.maximumDistance,
          Math.hypot(
            pointer.startX - releaseX,
            pointer.startY - releaseY
          )
        );
    }

    pointer.currentX =
      releaseX;

    pointer.currentY =
      releaseY;

    pointer.currentTime =
      releaseTime;

    pointer.cancelled =
      Boolean(cancelled);

    const duration =
      Math.max(
        0,
        releaseTime -
        pointer.startTime
      );

    let outcome =
      "cancelled";

    let committed =
      false;

    let flick =
      null;

    if (cancelled) {
      cancelControllerGesture(
        pointer,
        "pointer-cancelled"
      );

      if (
        pointer.dragging ||
        pointer.maximumDistance > CONFIG.maximumTapDistancePx
      ) {
        armClickSuppression(
          pointer.directControl ||
          state.orbitField,
          "pointer-cancelled"
        );
      }
    } else if (
      pointer.territory === TERRITORIES.COMPASS &&
      !compassSemanticReady()
    ) {
      outcome =
        "runtime-invalid";

      armClickSuppression(
        pointer.directControl,
        "compass-runtime-invalid"
      );
    } else if (
      pointer.territory !== TERRITORIES.COMPASS &&
      !runtimeReady()
    ) {
      cancelControllerGesture(
        pointer,
        "runtime-invalid-at-release"
      );

      outcome =
        "runtime-invalid";

      armClickSuppression(
        pointer.directControl ||
        state.orbitField,
        "projected-runtime-invalid"
      );
    } else if (
      !pointer.dragging &&
      pointer.maximumDistance <= CONFIG.maximumTapDistancePx
    ) {
      if (
        pointer.territory === TERRITORIES.COMPASS
      ) {
        committed =
          commitCompassTap(
            pointer,
            event
          );

        outcome =
          committed
            ? "compass-tap-committed"
            : "compass-tap-rejected";
      } else if (
        pointer.territory === TERRITORIES.CARDINAL ||
        pointer.territory === TERRITORIES.ROOM
      ) {
        committed =
          commitProjectedTap(
            pointer,
            event
          );

        outcome =
          committed
            ? "projected-tap-committed"
            : "projected-tap-rejected";
      } else {
        outcome =
          "empty-field-tap";
      }
    } else if (
      pointer.dragging
    ) {
      if (!gestures) {
        outcome =
          "gesture-helper-unavailable";
      } else {
        flick =
          gestures.classifyFlick(
            pointer,
            releaseX,
            releaseY,
            releaseTime,
            CONFIG
          );

        armClickSuppression(
          pointer.directControl ||
          state.orbitField,
          flick.qualifies
            ? "flick-completion"
            : "drag-completion"
        );

        if (
          pointer.territory === TERRITORIES.COMPASS
        ) {
          outcome =
            "compass-drag-consumed";
        } else if (
          flick.qualifies &&
          pointer.gestureScope === GESTURE_SCOPES.CLUSTER &&
          pointer.activeWing
        ) {
          state.counters.flicksQualified +=
            1;

          committed =
            requestClusterFlickReturn(
              pointer,
              flick
            );

          outcome =
            committed
              ? "cluster-flick-return"
              : "cluster-flick-return-rejected";
        } else if (
          pointer.maximumDistance >= CONFIG.minimumCommitDistancePx &&
          pointer.controllerGestureActive &&
          pointer.previewAccepted
        ) {
          committed =
            commitControllerGesture(
              pointer
            );

          if (!committed) {
            cancelControllerGesture(
              pointer,
              "gesture-commit-rejected"
            );
          }

          outcome =
            committed
              ? (
                  pointer.gestureScope === GESTURE_SCOPES.ORBIT
                    ? "orbit-committed"
                    : "cluster-committed"
                )
              : "gesture-commit-rejected";
        } else {
          cancelControllerGesture(
            pointer,
            "drag-without-accepted-preview"
          );

          outcome =
            "drag-cancelled";
        }
      }
    } else {
      cancelControllerGesture(
        pointer,
        "ambiguous-release"
      );

      armClickSuppression(
        pointer.directControl ||
        state.orbitField,
        "ambiguous-release"
      );

      outcome =
        "ambiguous-release";
    }

    event.preventDefault();

    clearPointer(pointer);

    publishReceipt(
      "pointer-finished",
      {
        outcome,

        committed,

        pointerId:
          pointer.pointerId,

        pointerType:
          pointer.pointerType,

        territory:
          pointer.territory,

        gestureScope:
          pointer.gestureScope,

        downKind:
          pointer.downKind ||
          null,

        downIdentity:
          pointer.downIdentity ||
          null,

        activeWing:
          pointer.activeWing ||
          null,

        previewPrimaryId:
          pointer.previewPrimaryId ||
          null,

        duration,

        maximumDistance:
          pointer.maximumDistance,

        pathLength:
          pointer.pathLength,

        dragging:
          pointer.dragging,

        cancelled:
          pointer.cancelled,

        flick,

        compassSemanticDirect:
          pointer.territory === TERRITORIES.COMPASS,

        compositorRequired:
          pointer.territory === TERRITORIES.COMPASS
            ? false
            : true,

        gestureHelperRequired:
          pointer.territory === TERRITORIES.COMPASS
            ? false
            : true,

        projectedRuntimeRequired:
          pointer.territory === TERRITORIES.COMPASS
            ? false
            : true
      }
    );
  }

  function handlePointerUp(event) {
    if (
      !state.pointer ||
      state.pointer.pointerId !== event.pointerId
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
      state.pointer.pointerId !== event.pointerId
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

  function handleLostPointerCapture(event) {
    const pointer =
      state.pointer;

    if (
      !pointer ||
      pointer.pointerId !== event.pointerId ||
      pointer.finishing
    ) {
      return;
    }

    interruptActivePointer(
      "lost-pointer-capture",
      false
    );
  }

  function handleSemanticClick(event) {
    if (shouldSuppressClick(event)) {
      state.counters.nativeClicksSuppressed +=
        1;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      publishReceipt(
        "duplicate-click-suppressed"
      );

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

    const control =
      resolveSemanticControl(
        event.target
      );

    if (
      !control ||
      !semanticControlEnabled(control)
    ) {
      return;
    }

    const kind =
      semanticKindFromControl(
        control
      );

    const identity =
      semanticIdentityFromControl(
        control
      );

    if (
      !kind ||
      !identity
    ) {
      state.counters.nativeSemanticRejects +=
        1;

      return;
    }

    const committed =
      requestSemanticSelection(
        kind,
        identity,
        event.detail === 0
          ? "keyboard-semantic-control"
          : (
              kind === SEMANTIC_KINDS.COMPASS
                ? "native-compass-semantic-control"
                : "native-semantic-control"
            )
      );

    if (!committed) {
      state.counters.nativeSemanticRejects +=
        1;

      if (
        kind === SEMANTIC_KINDS.COMPASS
      ) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      }

      return;
    }

    if (
      kind === SEMANTIC_KINDS.CARDINAL
    ) {
      state.counters.nativeCardinalCommits +=
        1;
    } else if (
      kind === SEMANTIC_KINDS.ROOM
    ) {
      state.counters.nativeRoomCommits +=
        1;
    } else if (
      kind === SEMANTIC_KINDS.COMPASS
    ) {
      state.counters.nativeCompassCommits +=
        1;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  function handleContextMenu(event) {
    if (
      state.pointer &&
      isInsideOrbitField(event.target)
    ) {
      event.preventDefault();
    }
  }

  function handleDragStart(event) {
    if (
      isInsideOrbitField(event.target)
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
      state.nativeOrbitFieldStyle === null
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

          gestureHelperIntegrated:
            true,

          projectedTapSelection:
            true,

          directControllerTapCommit:
            true,

          compassSemanticRecovery:
            true,

          compassRequiresCompositor:
            false,

          compassRequiresWebGL:
            false,

          compassRequiresPlanet:
            false,

          compassRequiresGestureHelper:
            false,

          compassRequiresProjectedRuntime:
            false,

          syntheticSemanticClickCommit:
            false,

          nativeSemanticDelegation:
            true,

          keyboardSemanticDelegation:
            true,

          authoritativeCompositorHitTest:
            true,

          downReleaseCorrespondence:
            true,

          pointerCapture:
            true,

          orbitDirectManipulation:
            true,

          clusterDirectManipulation:
            true,

          completeQuaternionPreview:
            true,

          explicitPrimaryIdentity:
            true,

          qualifyingClusterFlickReturn:
            true,

          duplicateClickSuppression:
            true
        }
      );

      dispatch(
        EVENTS.interactionsReady,
        {
          reason,

          contract:
            CONTRACT,

          gestureHelperContract:
            GESTURES_CONTRACT,

          directControllerTapCommit:
            true,

          compassSemanticRecovery:
            true,

          compassRequiresGestureHelper:
            false,

          compassRequiresProjectedRuntime:
            false,

          orbitDirectManipulation:
            true,

          clusterDirectManipulation:
            true,

          api:
            Object.freeze([
              "getState",
              "cancelGesture",
              "retryRuntime",
              "dispose"
            ])
        }
      );
    }

    return true;
  }

  function deactivateRuntime(reason) {
    if (!state.runtimeActive) {
      return false;
    }

    interruptActivePointer(reason);

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

    publishReceipt(
      "runtime-deactivated",
      {
        reason
      }
    );

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

    const gestures =
      resolveGestures();

    const controller =
      resolveController();

    const compositor =
      resolveCompositor();

    const compassReady =
      compassSemanticReady();

    if (compassReady) {
      publishCompassSemanticReady(reason);
    }

    const gesturesReady =
      Boolean(gestures);

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
      !gesturesReady ||
      !controllerReady ||
      !compositorReady
    ) {
      if (state.runtimeActive) {
        deactivateRuntime(
          `${reason}:dependency-unavailable`
        );
      }

      state.waitingForRuntime =
        true;

      publishReceipt(
        "waiting-for-runtime",
        {
          reason,

          gestureHelperAvailable:
            gesturesReady,

          controllerAvailable:
            Boolean(controller),

          controllerReady,

          compassSemanticReady:
            compassReady,

          compassSemanticPathUsable:
            compassReady,

          compositorAvailable:
            Boolean(compositor),

          compositorProjectionReady:
            compositorReady,

          projectedStarRuntimeReady:
            false,

          compassRequiresProjectedRuntime:
            false,

          compassRequiresGestureHelper:
            false,

          retryCount:
            state.retryCount
        }
      );

      scheduleRuntimeRetry(reason);

      return false;
    }

    clearRetryTimer();

    state.retryCount =
      0;

    return state.runtimeActive
      ? true
      : activateRuntime(reason);
  }

  function unsubscribeController() {
    for (
      const key
      of [
        "controllerFrameUnsubscribe",
        "controllerHeldUnsubscribe"
      ]
    ) {
      const unsubscribe =
        state[key];

      state[key] =
        null;

      if (
        typeof unsubscribe === "function"
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

    if (
      !controller ||
      typeof controller.subscribeFrameState !== "function"
    ) {
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
              frame &&
              frame.held === true
            ) {
              interruptActivePointer(
                "controller-held"
              );

              deactivateRuntime(
                "controller-held"
              );
            }

            if (
              frame &&
              !validControllerFrame(frame)
            ) {
              publishReceipt(
                "controller-frame-nonstrict-for-runtime",
                {
                  compassSemanticPathRetained:
                    compassSemanticReady(),

                  strictProjectedRuntimeRetained:
                    false
                }
              );
            }

            attemptRuntimeActivation(
              "controller-frame"
            );

            scheduleProjectedLabels();
          }
        );

      if (
        frameUnsubscribe != null &&
        typeof frameUnsubscribe !== "function"
      ) {
        throw new Error(
          "Controller subscribeFrameState() returned an invalid unsubscribe surface."
        );
      }

      state.controllerFrameUnsubscribe =
        frameUnsubscribe ||
        null;

      if (
        typeof controller.subscribeHeldState === "function"
      ) {
        const heldUnsubscribe =
          controller.subscribeHeldState(
            heldState => {
              if (
                heldState &&
                heldState.held === true
              ) {
                interruptActivePointer(
                  "controller-held-state"
                );

                deactivateRuntime(
                  "controller-held-state"
                );
              }

              attemptRuntimeActivation(
                "controller-held-state"
              );
            }
          );

        if (
          heldUnsubscribe != null &&
          typeof heldUnsubscribe !== "function"
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
          },

          compassSemanticPathRetained:
            compassSemanticReady()
        }
      );

      return false;
    }
  }

  function initializeCoreListeners() {
    addCoreListener(
      document,
      "click",
      handleSemanticClick,
      true
    );

    addCoreListener(
      window,
      EVENTS.controllerReady,
      () => {
        resolveController();
        bindControllerSubscriptions();

        publishCompassSemanticReady(
          "controller-ready"
        );

        attemptRuntimeActivation(
          "controller-ready"
        );
      }
    );

    addCoreListener(
      window,
      EVENTS.controllerFailure,
      event => {
        interruptActivePointer(
          "controller-failure"
        );

        deactivateRuntime(
          "controller-failure"
        );

        state.controller =
          null;

        state.compassSemanticReadyPublished =
          false;

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
    );

    addCoreListener(
      window,
      EVENTS.compositorReady,
      () => {
        resolveCompositor();

        attemptRuntimeActivation(
          "compositor-ready"
        );

        scheduleProjectedLabels();
      }
    );

    addCoreListener(
      window,
      EVENTS.compositorProjectionChanged,
      () => {
        if (
          state.pointer &&
          state.pointer.territory !== TERRITORIES.COMPASS &&
          !runtimeReady()
        ) {
          interruptActivePointer(
            "projection-invalidated"
          );
        }

        attemptRuntimeActivation(
          "compositor-projection-changed"
        );

        scheduleProjectedLabels();
      }
    );

    addCoreListener(
      window,
      EVENTS.compositorFailure,
      event => {
        if (
          state.pointer &&
          state.pointer.territory !== TERRITORIES.COMPASS
        ) {
          interruptActivePointer(
            "compositor-failure"
          );
        }

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

            compassSemanticPathRetained:
              compassSemanticReady()
          }
        );
      }
    );

    addCoreListener(
      window,
      EVENTS.compositorDisposed,
      () => {
        if (
          state.pointer &&
          state.pointer.territory !== TERRITORIES.COMPASS
        ) {
          interruptActivePointer(
            "compositor-disposed"
          );
        }

        deactivateRuntime(
          "compositor-disposed"
        );

        state.compositor =
          null;

        scheduleRuntimeRetry(
          "compositor-disposed"
        );
      }
    );

    addCoreListener(
      window,
      EVENTS.crystalsReady,
      () => {
        attemptRuntimeActivation(
          "crystals-ready"
        );

        scheduleProjectedLabels();
      }
    );

    addCoreListener(
      window,
      EVENTS.crystalsFailure,
      event => {
        if (
          state.pointer &&
          state.pointer.territory !== TERRITORIES.COMPASS
        ) {
          interruptActivePointer(
            "crystals-failure"
          );
        }

        publishReceipt(
          "crystals-unavailable",
          {
            detail:
              event &&
              event.detail
                ? event.detail
                : null,

            compositorProjectionRetained:
              compositorProjectionReady(),

            compassSemanticPathRetained:
              compassSemanticReady()
          }
        );
      }
    );

    addCoreListener(
      window,
      EVENTS.crystalsRenderFailure,
      event => {
        if (
          state.pointer &&
          state.pointer.territory !== TERRITORIES.COMPASS
        ) {
          interruptActivePointer(
            "crystals-render-failure"
          );
        }

        publishReceipt(
          "crystals-unavailable",
          {
            detail:
              event &&
              event.detail
                ? event.detail
                : null,

            compositorProjectionRetained:
              compositorProjectionReady(),

            compassSemanticPathRetained:
              compassSemanticReady(),

            sourceEvent:
              EVENTS.crystalsRenderFailure,

            aliasFor:
              EVENTS.crystalsFailure
          }
        );
      }
    );

    addCoreListener(
      window,
      EVENTS.crystalsDisposed,
      () => {
        if (
          state.pointer &&
          state.pointer.territory !== TERRITORIES.COMPASS
        ) {
          interruptActivePointer(
            "crystals-disposed"
          );
        }

        publishReceipt(
          "crystals-disposed",
          {
            compassSemanticPathRetained:
              compassSemanticReady()
          }
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

        dispose("pagehide");
      }
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

        gestureHelperGlobal:
          GESTURES_GLOBAL,

        gestureHelperContract:
          GESTURES_CONTRACT,

        compassSemanticRecovery:
          true,

        compassRequiresCompositor:
          false,

        compassRequiresWebGL:
          false,

        compassRequiresPlanet:
          false,

        compassRequiresGestureHelper:
          false,

        compassRequiresProjectedRuntime:
          false,

        getState() {
          return createReceipt(
            "state-requested",
            {
              compassSemanticReady:
                compassSemanticReady(),

              projectedRuntimeReady:
                runtimeReady()
            }
          );
        },

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
      /* Best-effort removal. */
    }

    state.apiExposed =
      false;
  }

  function rollbackInitialization(error) {
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

    state.waitingForRuntime =
      false;

    state.failed =
      true;

    state.controller =
      null;

    state.compositor =
      null;

    state.gestures =
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

        controllerSubscriptionsRemoved:
          true,

        orbitFieldStyleRestored:
          true
      }
    );

    dispatch(
      EVENTS.interactionsFailure,
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

      const gestures =
        resolveGestures();

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

          gestureHelperResolution:
            gestures
              ? "resolved"
              : "pending",

          semanticLayer:
            "initialized-before-projected-runtime",

          projectedRuntime:
            "deferred-until-gesture-controller-and-compositor-ready",

          pointerRuntime:
            "deferred-until-controller-and-compositor-ready",

          directProjectedTapCommit:
            true,

          directCompassTapCommit:
            true,

          compassSemanticRecovery:
            true,

          compassSemanticRequiresCompositor:
            false,

          compassSemanticRequiresWebGL:
            false,

          compassSemanticRequiresPlanet:
            false,

          compassSemanticRequiresGestureHelper:
            false,

          compassSemanticRequiresProjectedRuntime:
            false,

          nativeSemanticDelegation:
            true,

          syntheticControlClickRequired:
            false,

          quaternionConstructionDelegated:
            true,

          primaryIdentityDerivationDelegated:
            true
        }
      );

      publishCompassSemanticReady(
        "startup"
      );

      attemptRuntimeActivation(
        "startup"
      );

      scheduleProjectedLabels();
    } catch (error) {
      rollbackInitialization(error);
    }
  }

  function dispose(reason = "api") {
    if (state.disposed) {
      return true;
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

    state.gestures =
      null;

    state.initialized =
      false;

    state.initializing =
      false;

    state.waitingForRuntime =
      false;

    state.compassSemanticReadyPublished =
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

        orbitFieldStyleRestored:
          true,

        controllerStateMutatedDirectly:
          false,

        compositorStateMutated:
          false,

        crystalStateMutated:
          false,

        gestureHelperMutated:
          false,

        planetStateMutated:
          false,

        compassRendererMutated:
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

    return true;
  }

  if (
    document.readyState === "loading"
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

/*
RECEIPT:
SHOWROOM_COMPLETE_QUATERNION_INTERACTIONS_RECEIPT_TNT_v6_COMPASS_SEMANTIC_RECOVERY_INITIALIZATION_GATE_CORRECTED

TARGET:
- /showroom/index.interactions.js

PURPOSE:
- Restore Main Compass semantic activation after replacement of the center
  visual with the decorative Audralia WebGL planet.
- Correct the initialization gate that previously made all interactions fail
  when SHOWROOM_INTERACTION_GESTURES was absent or late.
- Preserve stars, clusters, swipe, Atlas behavior, controller route authority,
  compositor projection authority, crystal ownership, and planet decorative
  status.

PRIMARY CORRECTION:
- Core semantic initialization now runs before projected-runtime dependency
  validation.
- Document-level semantic click routing is registered before gesture helper,
  compositor, WebGL, planet, crystal, or projected-runtime readiness is required.
- Missing or late SHOWROOM_INTERACTION_GESTURES no longer causes fatal
  initialization failure.
- [data-showroom-compass-control], [data-showroom-compass-selection-alias],
  and data-showroom-controller-action="request-compass-selection" route directly
  to controller.requestCompassSelection() when the controller endpoint exists and
  the controller is not held, failed, or disposed.

TWO-LAYER INITIALIZATION:
1. CORE SEMANTIC LAYER:
   - discovers root/orbit field/receipt;
   - registers document-level semantic click listener;
   - exposes SHOWROOM_INTERACTIONS;
   - resolves controller when available;
   - supports Main Compass semantic activation;
   - does not require gesture helper;
   - does not require compositor;
   - does not require WebGL;
   - does not require planet;
   - does not require crystals;
   - does not require projected runtime.

2. PROJECTED GESTURE RUNTIME:
   - waits for SHOWROOM_INTERACTION_GESTURES;
   - waits for controller projected-interaction readiness;
   - waits for compositor projection readiness;
   - owns stars, clusters, swipe, projected hit testing, pointer capture,
     quaternion previews, cluster flick return, and duplicate-click suppression.

EXPECTED USER BEHAVIOR:
- Tap Main Compass label or center semantic Compass button.
- Do not immediately hard-navigate.
- Request controller Compass-selection state.
- Scroll/focus the Atlas panel after accepted selection.
- Existing controller-owned state should expose the Return to Main Compass
  option.

PRESERVED:
- Controller owns route state and Main Compass selection state.
- Interactions owns pointer/click/tap routing only.
- Planet JS remains decorative and owns no navigation.
- CSS owns hit-area layout and stage support only.
- Compositor remains required for projected star/cluster hit testing only.
- Gesture helper remains required for orbit/cluster quaternion behavior only.
- No shared Compass renderer, adapter, or geometry dependency is introduced.
- Canonical written direction expression remains NEWS / N-E-W-S where written
  order is expressed.

DO NOT CHANGE:
- /showroom/index.controller.js
- /showroom/index.planet.js
- /showroom/index.html
- /showroom/index.css
- /showroom/index.compositor.js
- /showroom/index.crystals.js
- shared Compass assets

RUNTIME VALIDATION:
NOT RUN

VISUAL VALIDATION:
NOT RUN

PRODUCTION AUTHORIZATION:
FALSE

DEPLOYMENT AUTHORIZATION:
FALSE
*/

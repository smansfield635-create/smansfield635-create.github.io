/* TARGET FILE: /showroom/index.interactions.js */
/* TNT FULL-FILE REPLACEMENT */
/* SHOWROOM_SCENE_BOUNDED_CONSTELLATION_INTERACTIONS_TNT_v5 */
/*
  Controller authority:
  - window.SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER
  - SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER
  - 7.0.0-controller-interaction-semantic-priority

  Compositor authority:
  - window.SHOWROOM_COMPOSITOR
  - SHOWROOM_CONSTELLATION_SINGLE_FRAME_COMPOSITOR_TNT_v5

  Interaction authority:
  - bounded orbit-field pointer listeners;
  - one active primary pointer;
  - pointer capture and release;
  - compositor hit-test consumption;
  - projected tap correspondence;
  - semantic-control activation;
  - orbit quaternion construction and preview;
  - active-cluster quaternion construction and preview;
  - controller-authorized gesture begin, preview, commit, and cancel;
  - qualifying cluster-flick return to constellation;
  - duplicate native-click suppression;
  - interruption cancellation;
  - runtime-readiness recovery;
  - complete listener and style restoration.

  Exact controller transaction signatures:
  - beginOrbitGesture()
  - requestOrbitPreview({ quaternion, primaryId })
  - requestOrbitCommit()
  - requestOrbitCancel(reason)
  - beginClusterGesture(wing)
  - requestClusterPreview(wing, { quaternion, primaryId })
  - requestClusterCommit(wing)
  - requestClusterCancel(wing, reason)
  - requestReturnToConstellation(options)

  Explicit exclusions:
  - no controller-state construction;
  - no navigation-state mutation outside controller APIs;
  - no route or destination interpretation;
  - no world-to-screen projection;
  - no hit-region construction;
  - no crystal rendering;
  - no camera mutation;
  - no Compass renderer lifecycle;
  - no compositor lifecycle ownership;
  - no crystal lifecycle ownership.
*/

(() => {
  "use strict";

  const CONTRACT =
    "SHOWROOM_SCENE_BOUNDED_CONSTELLATION_INTERACTIONS_TNT_v5";

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

    compositorFailure:
      "SHOWROOM_COMPOSITOR_FAILURE",

    compositorDisposed:
      "SHOWROOM_COMPOSITOR_DISPOSED",

    compositorProjectionChanged:
      "SHOWROOM_COMPOSITOR_PROJECTION_CHANGED",

    crystalsReady:
      "SHOWROOM_CRYSTALS_READY",

    crystalsFailure:
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

    compassControl:
      "[data-showroom-compass-control]",

    semanticObject:
      [
        "[data-showroom-object]",
        "[data-showroom-object-id]",
        "[data-showroom-cardinal-control]",
        "[data-showroom-child-control]",
        "[data-showroom-child-id]"
      ].join(","),

    protectedTarget:
      [
        "[data-showroom-diamond-stage]",
        "[data-showroom-window-control]",
        "[data-showroom-diamond-controls]",
        "[data-showroom-gauge-dashboard]",
        "[data-showroom-information-tabs]",
        "[data-showroom-controller-panel]",
        "dialog",
        "input",
        "textarea",
        "select",
        "summary"
      ].join(",")
  });

  const MODES = Object.freeze({
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

  const CONFIG = Object.freeze({
    dragDeadZonePx:
      6,

    maximumTapDistancePx:
      13,

    radiansPerViewport:
      Math.PI * 1.12,

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
      0.30,

    runtimeRetryLimit:
      160,

    runtimeRetryIntervalMs:
      100
  });

  const CARDINAL_BASE_POSITIONS = Object.freeze({
    north:
      Object.freeze([
        0,
        1.42,
        -0.48
      ]),

    east:
      Object.freeze([
        1.58,
        0,
        0.54
      ]),

    south:
      Object.freeze([
        0,
        -1.42,
        0.44
      ]),

    west:
      Object.freeze([
        -1.58,
        0,
        -0.58
      ])
  });

  const ROOM_BASE_POSITIONS = Object.freeze({
    1:
      Object.freeze([
        -0.92,
        0.82,
        -0.46
      ]),

    2:
      Object.freeze([
        0.92,
        0.82,
        0.50
      ]),

    3:
      Object.freeze([
        0.92,
        -0.82,
        -0.42
      ]),

    4:
      Object.freeze([
        -0.92,
        -0.82,
        0.46
      ])
  });

  const WINGS = Object.freeze([
    "north",
    "east",
    "south",
    "west"
  ]);

  const state = {
    root:
      null,

    orbitField:
      null,

    receipt:
      null,

    controller:
      null,

    compositor:
      null,

    pointer:
      null,

    suppressedClick:
      null,

    initialized:
      false,

    initializing:
      false,

    disposed:
      false,

    failed:
      false,

    runtimeActive:
      false,

    waitingForRuntime:
      true,

    readyPublished:
      false,

    controllerFrameUnsubscribe:
      null,

    controllerHeldUnsubscribe:
      null,

    coreListeners:
      [],

    runtimeListeners:
      [],

    retryTimer:
      0,

    retryCount:
      0,

    nativeOrbitFieldStyle:
      null,

    orbitFieldStyleCaptured:
      false,

    counters: {
      readinessChecks:
        0,

      runtimeActivations:
        0,

      runtimeDeactivations:
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

      projectedHits:
        0,

      projectedMisses:
        0,

      projectedTapCommits:
        0,

      projectedTapRejects:
        0,

      compassTapCommits:
        0,

      compassTapRejects:
        0,

      orbitGesturesBegun:
        0,

      orbitPreviewsAccepted:
        0,

      orbitCommits:
        0,

      orbitCancels:
        0,

      clusterGesturesBegun:
        0,

      clusterPreviewsAccepted:
        0,

      clusterCommits:
        0,

      clusterCancels:
        0,

      flicksQualified:
        0,

      clusterReturnsCommitted:
        0,

      dragsConsumed:
        0,

      ambiguousReleases:
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

  function nowIso() {
    return new Date().toISOString();
  }

  function isElement(value) {
    return (
      typeof Element !==
        "undefined" &&
      value instanceof Element
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
    return Math.min(
      maximum,
      Math.max(
        minimum,
        value
      )
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
      typeof value !==
        "object"
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
    const text =
      normalize(value);

    if (
      globalThis.CSS &&
      typeof globalThis.CSS.escape ===
        "function"
    ) {
      return globalThis.CSS.escape(
        text
      );
    }

    return text.replace(
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
        Boolean(
          state.controller
        ),

      compositorAvailable:
        Boolean(
          state.compositor
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

              activeWing:
                pointer.activeWing ||
                null,

              downIdentity:
                pointer.downIdentity ||
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

  function quaternionNormalize(
    value,
    fallback = [
      0,
      0,
      0,
      1
    ]
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
        0
      ),

      finiteNumber(
        source[1],
        0
      ),

      finiteNumber(
        source[2],
        0
      ),

      finiteNumber(
        source[3],
        1
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
      length <= 1e-10
    ) {
      return fallback.slice();
    }

    return quaternion.map(
      component =>
        component / length
    );
  }

  function quaternionMultiplyRaw(
    first,
    second
  ) {
    return [
      first[3] * second[0] +
        first[0] * second[3] +
        first[1] * second[2] -
        first[2] * second[1],

      first[3] * second[1] -
        first[0] * second[2] +
        first[1] * second[3] +
        first[2] * second[0],

      first[3] * second[2] +
        first[0] * second[1] -
        first[1] * second[0] +
        first[2] * second[3],

      first[3] * second[3] -
        first[0] * second[0] -
        first[1] * second[1] -
        first[2] * second[2]
    ];
  }

  function quaternionMultiply(
    first,
    second
  ) {
    return quaternionNormalize(
      quaternionMultiplyRaw(
        quaternionNormalize(first),
        quaternionNormalize(second)
      )
    );
  }

  function quaternionFromAxisAngle(
    axis,
    angle
  ) {
    const length =
      Math.hypot(
        axis[0],
        axis[1],
        axis[2]
      );

    if (
      !Number.isFinite(length) ||
      length <= 1e-10
    ) {
      return [
        0,
        0,
        0,
        1
      ];
    }

    const half =
      angle * 0.5;

    const sine =
      Math.sin(half);

    return quaternionNormalize([
      axis[0] / length * sine,
      axis[1] / length * sine,
      axis[2] / length * sine,
      Math.cos(half)
    ]);
  }

  function quaternionConjugate(
    quaternionValue
  ) {
    const quaternion =
      quaternionNormalize(
        quaternionValue
      );

    return [
      -quaternion[0],
      -quaternion[1],
      -quaternion[2],
      quaternion[3]
    ];
  }

  function quaternionRotateVector(
    quaternionValue,
    vector
  ) {
    const quaternion =
      quaternionNormalize(
        quaternionValue
      );

    const pure = [
      vector[0],
      vector[1],
      vector[2],
      0
    ];

    const rotated =
      quaternionMultiplyRaw(
        quaternionMultiplyRaw(
          quaternion,
          pure
        ),
        quaternionConjugate(
          quaternion
        )
      );

    return [
      rotated[0],
      rotated[1],
      rotated[2]
    ];
  }

  function dragQuaternion(
    pointer,
    clientX,
    clientY
  ) {
    const rect =
      state.orbitField
        .getBoundingClientRect();

    const width =
      Math.max(
        1,
        rect.width
      );

    const height =
      Math.max(
        1,
        rect.height
      );

    const deltaX =
      clientX -
      pointer.startX;

    const deltaY =
      clientY -
      pointer.startY;

    const yaw =
      (
        deltaX /
        width
      ) *
      CONFIG.radiansPerViewport;

    const pitch =
      (
        deltaY /
        height
      ) *
      CONFIG.radiansPerViewport;

    const yawQuaternion =
      quaternionFromAxisAngle(
        [
          0,
          1,
          0
        ],
        yaw
      );

    const pitchQuaternion =
      quaternionFromAxisAngle(
        [
          1,
          0,
          0
        ],
        pitch
      );

    return quaternionMultiply(
      pitchQuaternion,
      quaternionMultiply(
        yawQuaternion,
        pointer.startQuaternion
      )
    );
  }

  function primaryWingForQuaternion(
    quaternion
  ) {
    let bestWing =
      "north";

    let bestDepth =
      -Infinity;

    for (
      const wing
      of WINGS
    ) {
      const rotated =
        quaternionRotateVector(
          quaternion,
          CARDINAL_BASE_POSITIONS[
            wing
          ]
        );

      if (rotated[2] > bestDepth) {
        bestDepth =
          rotated[2];

        bestWing =
          wing;
      }
    }

    return bestWing;
  }

  function roomOrdinal(roomId) {
    const match =
      normalize(roomId).match(
        /-(\d+)$/
      );

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

  function primaryRoomForQuaternion(
    wing,
    roomIds,
    quaternion
  ) {
    const validRoomIds =
      Array.isArray(roomIds)
        ? roomIds.filter(
            roomId =>
              roomOrdinal(roomId) > 0
          )
        : [];

    if (!validRoomIds.length) {
      return `${wing}-1`;
    }

    let bestRoom =
      validRoomIds[0];

    let bestDepth =
      -Infinity;

    for (
      const roomId
      of validRoomIds
    ) {
      const ordinal =
        roomOrdinal(roomId);

      const rotated =
        quaternionRotateVector(
          quaternion,
          ROOM_BASE_POSITIONS[
            ordinal
          ]
        );

      if (rotated[2] > bestDepth) {
        bestDepth =
          rotated[2];

        bestRoom =
          roomId;
      }
    }

    return bestRoom;
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
        "function" &&
      typeof controller.beginOrbitGesture ===
        "function" &&
      typeof controller.requestOrbitPreview ===
        "function" &&
      typeof controller.requestOrbitCommit ===
        "function" &&
      typeof controller.requestOrbitCancel ===
        "function" &&
      typeof controller.beginClusterGesture ===
        "function" &&
      typeof controller.requestClusterPreview ===
        "function" &&
      typeof controller.requestClusterCommit ===
        "function" &&
      typeof controller.requestClusterCancel ===
        "function" &&
      typeof controller.requestReturnToConstellation ===
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
        "boolean" &&
      frame.orbitOrientation &&
      Array.isArray(
        frame.orbitOrientation
          .quaternion
      ) &&
      frame.orbitOrientation
        .quaternion.length ===
        4
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

      return isValidControllerFrame(
        frame
      )
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

  function currentDisplayMode(frame) {
    if (!frame || frame.held) {
      return MODES.HELD;
    }

    const presentationMode =
      normalizeUpper(
        frame.presentationMode
      );

    if (
      presentationMode ===
      MODES.CLUSTER
    ) {
      return MODES.CLUSTER;
    }

    if (
      presentationMode ===
      MODES.CONSTELLATION
    ) {
      return MODES.CONSTELLATION;
    }

    if (
      frame.presentation &&
      frame.presentation
        .activeRoomCluster ===
        true
    ) {
      return MODES.CLUSTER;
    }

    if (
      frame.presentation &&
      frame.presentation
        .outerCardinalsActive ===
        true
    ) {
      return MODES.CONSTELLATION;
    }

    return MODES.HELD;
  }

  function activeWingFromFrame(frame) {
    const candidates = [
      frame &&
        frame.activeClusterWing,

      frame &&
        frame.selectedCardinal,

      frame &&
        frame.cluster
        ? frame.cluster.wing
        : ""
    ];

    for (
      const candidate
      of candidates
    ) {
      const wing =
        normalizeWing(candidate);

      if (wing) {
        return wing;
      }
    }

    return "";
  }

  function clusterRoomIdsFromFrame(
    frame,
    wing
  ) {
    if (
      frame &&
      frame.cluster &&
      frame.cluster.wing === wing &&
      Array.isArray(
        frame.cluster.roomIds
      )
    ) {
      return frame.cluster.roomIds
        .slice();
    }

    return [
      `${wing}-1`,
      `${wing}-2`,
      `${wing}-3`,
      `${wing}-4`
    ];
  }

  function orientationQuaternion(
    orientation
  ) {
    return quaternionNormalize(
      orientation &&
      orientation.quaternion
        ? orientation.quaternion
        : [
            0,
            0,
            0,
            1
          ]
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
    )
      ? control
      : null;
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
    )
      ? control
      : null;
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

    const candidates =
      state.orbitField.querySelectorAll(
        `[${attribute}="${cssEscape(
          normalizedValue
        )}"]`
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
    if (!hit) {
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

      if (!deriveHitIdentity(hit)) {
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

  function hitCorresponds(
    first,
    second
  ) {
    const firstIdentity =
      deriveHitIdentity(first);

    const secondIdentity =
      deriveHitIdentity(second);

    return Boolean(
      firstIdentity &&
      secondIdentity &&
      firstIdentity ===
        secondIdentity
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
      Math.max(
        CONFIG.sampleWindowMs * 2,
        260
      );

    pointer.samples =
      pointer.samples
        .filter(
          sample =>
            sample.timestamp >=
              cutoff
        )
        .slice(
          -CONFIG.maximumSamples
        );
  }

  function classifyFlick(
    pointer,
    releaseX,
    releaseY,
    releaseTime
  ) {
    const deltaX =
      releaseX -
      pointer.startX;

    const deltaY =
      releaseY -
      pointer.startY;

    const distance =
      Math.hypot(
        deltaX,
        deltaY
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
            CONFIG.sampleWindowMs
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

    const dominant =
      Math.max(
        Math.abs(deltaX),
        Math.abs(deltaY)
      );

    const secondary =
      Math.min(
        Math.abs(deltaX),
        Math.abs(deltaY)
      );

    const directionalRatio =
      secondary <= 1e-6
        ? Infinity
        : dominant /
          secondary;

    const pathLength =
      Math.max(
        distance,
        pointer.pathLength
      );

    const pathEfficiency =
      pathLength > 0
        ? distance /
          pathLength
        : 1;

    const pathEfficiencyLoss =
      1 -
      pathEfficiency;

    const lastSample =
      recentSamples.length
        ? recentSamples[
            recentSamples.length - 1
          ]
        : null;

    const pauseBeforeRelease =
      lastSample
        ? Math.max(
            0,
            releaseTime -
              lastSample.timestamp
          )
        : duration;

    const direction =
      Math.abs(deltaX) >=
      Math.abs(deltaY)
        ? (
            deltaX >= 0
              ? "right"
              : "left"
          )
        : (
            deltaY >= 0
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
      deltaX,
      deltaY,
      averageVelocity,
      releaseVelocity,
      directionalRatio,
      pathLength,
      pathEfficiency,
      pathEfficiencyLoss,
      pauseBeforeRelease
    });
  }

  function capturePointer(pointerId) {
    try {
      state.orbitField
        .setPointerCapture(
          pointerId
        );

      return (
        typeof state.orbitField
          .hasPointerCapture !==
          "function" ||
        state.orbitField
          .hasPointerCapture(
            pointerId
          )
      );
    } catch {
      state.counters
        .pointerCaptureFailures +=
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
        state.orbitField
          .hasPointerCapture(
            pointerId
          )
      ) {
        state.orbitField
          .releasePointerCapture(
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
        "pointer-gesture",

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

  function handleClickCapture(event) {
    if (!shouldSuppressClick(event)) {
      return;
    }

    state.counters
      .nativeClicksSuppressed +=
      1;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    publishReceipt(
      "duplicate-click-suppressed"
    );
  }

  function activateSemanticControl(control) {
    if (
      !control ||
      typeof control.click !==
        "function"
    ) {
      return false;
    }

    if (
      control.matches(":disabled") ||
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

  function beginControllerGesture(pointer) {
    const controller =
      state.controller ||
      resolveController();

    if (!controller) {
      return false;
    }

    try {
      if (
        pointer.gestureScope ===
        GESTURE_SCOPES.ORBIT
      ) {
        const accepted =
          controller
            .beginOrbitGesture() !==
          false;

        if (accepted) {
          state.counters
            .orbitGesturesBegun +=
            1;
        }

        return accepted;
      }

      if (
        pointer.gestureScope ===
          GESTURE_SCOPES.CLUSTER &&
        pointer.activeWing
      ) {
        const accepted =
          controller
            .beginClusterGesture(
              pointer.activeWing
            ) !== false;

        if (accepted) {
          state.counters
            .clusterGesturesBegun +=
            1;
        }

        return accepted;
      }
    } catch {
      return false;
    }

    return false;
  }

  function previewControllerGesture(
    pointer,
    quaternion
  ) {
    const controller =
      state.controller ||
      resolveController();

    if (
      !controller ||
      !pointer.controllerGestureActive
    ) {
      return false;
    }

    try {
      if (
        pointer.gestureScope ===
        GESTURE_SCOPES.ORBIT
      ) {
        const primaryId =
          primaryWingForQuaternion(
            quaternion
          );

        pointer.previewPrimaryId =
          primaryId;

        const accepted =
          controller
            .requestOrbitPreview({
              quaternion:
                quaternion.slice(),

              primaryId
            }) !== false;

        if (accepted) {
          state.counters
            .orbitPreviewsAccepted +=
            1;

          pointer.previewAccepted =
            true;
        }

        return accepted;
      }

      if (
        pointer.gestureScope ===
          GESTURE_SCOPES.CLUSTER &&
        pointer.activeWing
      ) {
        const primaryId =
          primaryRoomForQuaternion(
            pointer.activeWing,
            pointer.clusterRoomIds,
            quaternion
          );

        pointer.previewPrimaryId =
          primaryId;

        const accepted =
          controller
            .requestClusterPreview(
              pointer.activeWing,
              {
                quaternion:
                  quaternion.slice(),

                primaryId
              }
            ) !== false;

        if (accepted) {
          state.counters
            .clusterPreviewsAccepted +=
            1;

          pointer.previewAccepted =
            true;
        }

        return accepted;
      }
    } catch {
      return false;
    }

    return false;
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

    try {
      if (
        pointer.gestureScope ===
        GESTURE_SCOPES.ORBIT
      ) {
        const committed =
          controller
            .requestOrbitCommit() !==
          false;

        if (committed) {
          state.counters
            .orbitCommits +=
            1;
        }

        return committed;
      }

      if (
        pointer.gestureScope ===
          GESTURE_SCOPES.CLUSTER &&
        pointer.activeWing
      ) {
        const committed =
          controller
            .requestClusterCommit(
              pointer.activeWing
            ) !== false;

        if (committed) {
          state.counters
            .clusterCommits +=
            1;
        }

        return committed;
      }
    } catch {
      return false;
    }

    return false;
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

    pointer.controllerGestureActive =
      false;

    const controller =
      state.controller ||
      resolveController();

    if (!controller) {
      return false;
    }

    try {
      if (
        pointer.gestureScope ===
        GESTURE_SCOPES.ORBIT
      ) {
        const cancelled =
          controller
            .requestOrbitCancel(
              reason
            ) !== false;

        if (cancelled) {
          state.counters
            .orbitCancels +=
            1;
        }

        return cancelled;
      }

      if (
        pointer.gestureScope ===
          GESTURE_SCOPES.CLUSTER &&
        pointer.activeWing
      ) {
        const cancelled =
          controller
            .requestClusterCancel(
              pointer.activeWing,
              reason
            ) !== false;

        if (cancelled) {
          state.counters
            .clusterCancels +=
            1;
        }

        return cancelled;
      }
    } catch {
      return false;
    }

    return false;
  }

  function requestClusterReturn(
    pointer,
    flick
  ) {
    const controller =
      state.controller ||
      resolveController();

    if (
      !controller ||
      pointer.gestureScope !==
        GESTURE_SCOPES.CLUSTER
    ) {
      return false;
    }

    cancelControllerGesture(
      pointer,
      "cluster-flick-return"
    );

    try {
      const committed =
        controller
          .requestReturnToConstellation({
            scrollToScene:
              true,

            source:
              "showroom-interactions-cluster-flick",

            direction:
              flick.direction
          }) !== false;

      if (committed) {
        state.counters
          .clusterReturnsCommitted +=
          1;
      }

      return committed;
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

    const mode =
      currentDisplayMode(frame);

    const activeWing =
      activeWingFromFrame(frame);

    const gestureScope =
      mode ===
        MODES.CONSTELLATION
        ? GESTURE_SCOPES.ORBIT
        : mode ===
            MODES.CLUSTER
          ? GESTURE_SCOPES.CLUSTER
          : "";

    const startQuaternion =
      gestureScope ===
        GESTURE_SCOPES.CLUSTER
        ? orientationQuaternion(
            frame.cluster &&
            frame.cluster.orientation
          )
        : orientationQuaternion(
            frame.orbitOrientation
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

      gestureScope,

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

      downHit:
        hit,

      downIdentity:
        deriveHitIdentity(
          hit
        ),

      semanticControl,

      compassControl,

      directSemanticControl,

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

    pointer.pathLength +=
      distance2d(
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
      When no compositor hit corresponds to a real semantic control,
      preserve the browser-native semantic activation path.
    */
    if (
      pointer.territory ===
      "native-semantic"
    ) {
      publishReceipt(
        "native-semantic-fallback-preserved"
      );

      return null;
    }

    if (
      !pointer.gestureScope &&
      pointer.territory !==
        "compass"
    ) {
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

        activeWing:
          pointer.activeWing ||
          null,

        downIdentity:
          pointer.downIdentity ||
          null
      }
    );

    return pointer;
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
      state.counters
        .projectedTapRejects +=
        1;

      armClickSuppression(
        state.orbitField,
        "projected-tap-runtime-unavailable"
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
      state.counters
        .projectedTapRejects +=
        1;

      armClickSuppression(
        state.orbitField,
        "projected-tap-correspondence-mismatch"
      );

      return false;
    }

    armClickSuppression(
      state.orbitField,
      "projected-semantic-activation"
    );

    const activated =
      activateSemanticControl(
        pointer.semanticControl
      );

    if (activated) {
      state.counters
        .projectedTapCommits +=
        1;
    } else {
      state.counters
        .projectedTapRejects +=
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
      state.counters
        .compassTapRejects +=
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
      state.counters
        .compassTapRejects +=
        1;

      armClickSuppression(
        control,
        "compass-tap-correspondence-mismatch"
      );

      return false;
    }

    armClickSuppression(
      control,
      "compass-semantic-activation"
    );

    const activated =
      activateSemanticControl(
        control
      );

    if (activated) {
      state.counters
        .compassTapCommits +=
        1;
    } else {
      state.counters
        .compassTapRejects +=
        1;
    }

    return activated;
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

    if (
      state.pointer === pointer
    ) {
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
      pointer.maximumDistance >
        CONFIG.maximumTapDistancePx
    ) {
      armClickSuppression(
        pointer.compassControl ||
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
          pointer.gestureScope,

        dragging:
          pointer.dragging
      }
    );

    return true;
  }

  function handlePointerDown(event) {
    if (
      state.pointer ||
      state.disposed ||
      state.failed ||
      !state.runtimeActive ||
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
        CONFIG.dragDeadZonePx
    ) {
      pointer.dragging =
        true;

      if (
        pointer.territory !==
        "compass"
      ) {
        pointer.controllerGestureActive =
          beginControllerGesture(
            pointer
          );
      }
    }

    if (
      pointer.dragging &&
      pointer.territory !==
        "compass" &&
      pointer.controllerGestureActive
    ) {
      pointer.currentQuaternion =
        dragQuaternion(
          pointer,
          event.clientX,
          event.clientY
        );

      previewControllerGesture(
        pointer,
        pointer.currentQuaternion
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
      Number.isFinite(
        event.clientX
      )
        ? event.clientX
        : pointer.currentX;

    const releaseY =
      Number.isFinite(
        event.clientY
      )
        ? event.clientY
        : pointer.currentY;

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

    pointer.pathLength +=
      distance2d(
        pointer.currentX,
        pointer.currentY,
        releaseX,
        releaseY
      );

    pointer.currentX =
      releaseX;

    pointer.currentY =
      releaseY;

    pointer.currentTime =
      releaseTime;

    pointer.cancelled =
      Boolean(cancelled);

    appendSample(
      pointer,
      releaseX,
      releaseY,
      releaseTime
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

    let gestureCommitted =
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
        pointer.maximumDistance >
          CONFIG.maximumTapDistancePx
      ) {
        armClickSuppression(
          pointer.compassControl ||
          state.orbitField,
          "pointer-cancelled"
        );
      }
    } else if (
      pointer.territory ===
        "compass" &&
      !controllerInteractionAllowed()
    ) {
      armClickSuppression(
        pointer.compassControl,
        "compass-runtime-invalid"
      );

      outcome =
        "runtime-invalid";
    } else if (
      pointer.territory !==
        "compass" &&
      !projectedSelectionAllowed()
    ) {
      cancelControllerGesture(
        pointer,
        "projected-runtime-invalid"
      );

      armClickSuppression(
        state.orbitField,
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
        outcome =
          "empty-field-tap";
      }
    } else if (pointer.dragging) {
      flick =
        classifyFlick(
          pointer,
          releaseX,
          releaseY,
          releaseTime
        );

      armClickSuppression(
        pointer.compassControl ||
        state.orbitField,
        flick.qualifies
          ? "flick-completion"
          : "drag-completion"
      );

      if (
        pointer.territory ===
        "compass"
      ) {
        state.counters
          .dragsConsumed +=
          1;

        outcome =
          "compass-drag-consumed";
      } else if (
        flick.qualifies &&
        pointer.gestureScope ===
          GESTURE_SCOPES.CLUSTER &&
        pointer.activeWing
      ) {
        state.counters
          .flicksQualified +=
          1;

        gestureCommitted =
          requestClusterReturn(
            pointer,
            flick
          );

        outcome =
          gestureCommitted
            ? "cluster-flick-return"
            : "cluster-flick-return-rejected";
      } else if (
        pointer.controllerGestureActive &&
        pointer.previewAccepted
      ) {
        gestureCommitted =
          commitControllerGesture(
            pointer
          );

        pointer.controllerGestureActive =
          false;

        if (gestureCommitted) {
          outcome =
            pointer.gestureScope ===
              GESTURE_SCOPES.ORBIT
              ? "orbit-committed"
              : "cluster-committed";
        } else {
          cancelControllerGesture(
            pointer,
            "gesture-commit-rejected"
          );

          outcome =
            "gesture-commit-rejected";
        }
      } else {
        cancelControllerGesture(
          pointer,
          "drag-without-accepted-preview"
        );

        state.counters
          .dragsConsumed +=
          1;

        outcome =
          "drag-consumed";
      }
    } else {
      cancelControllerGesture(
        pointer,
        "ambiguous-release"
      );

      armClickSuppression(
        pointer.compassControl ||
        state.orbitField,
        "ambiguous-release"
      );

      state.counters
        .ambiguousReleases +=
        1;

      outcome =
        "ambiguous-release";
    }

    event.preventDefault();

    clearPointer(pointer);

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

        gestureScope:
          pointer.gestureScope,

        activeWing:
          pointer.activeWing ||
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

        activationCommitted,

        gestureCommitted,

        previewPrimaryId:
          pointer.previewPrimaryId ||
          null,

        downIdentity:
          pointer.downIdentity ||
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

  function handleLostPointerCapture(event) {
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
      false
    );
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

  function handleContextMenu(event) {
    if (
      state.pointer &&
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

    state.counters
      .runtimeActivations +=
      1;

    if (!state.readyPublished) {
      state.readyPublished =
        true;

      publishReceipt(
        "ready",
        {
          reason,

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

          orbitDirectManipulation:
            true,

          clusterDirectManipulation:
            true,

          completeQuaternionPreview:
            true,

          explicitPrimaryIdentity:
            true,

          exactControllerTransactionSignatures:
            true,

          qualifyingClusterFlickReturn:
            true,

          duplicateClickSuppression:
            true,

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

          projectedTapSelection:
            true,

          orbitDirectManipulation:
            true,

          clusterDirectManipulation:
            true,

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

    state.counters
      .runtimeDeactivations +=
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

  function scheduleRuntimeRetry(reason) {
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
      if (state.runtimeActive) {
        deactivateRuntime(
          "runtime-dependency-unavailable"
        );
      }

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

      scheduleRuntimeRetry(reason);

      return false;
    }

    clearRetryTimer();

    state.retryCount =
      0;

    return activateRuntime(reason);
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

            if (frame.held === true) {
              interruptActivePointer(
                "controller-held"
              );

              deactivateRuntime(
                "controller-held"
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
                heldState.held ===
                  true
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
      () => {
        resolveController();
        bindControllerSubscriptions();

        attemptRuntimeActivation(
          "controller-ready-event"
        );
      }
    );

    addCoreListener(
      window,
      EVENTS.controllerFailure,
      () => {
        interruptActivePointer(
          "controller-failure"
        );

        deactivateRuntime(
          "controller-failure"
        );

        state.controller =
          null;
      }
    );

    addCoreListener(
      window,
      EVENTS.compositorReady,
      () => {
        resolveCompositor();

        attemptRuntimeActivation(
          "compositor-ready-event"
        );
      }
    );

    addCoreListener(
      window,
      EVENTS.compositorProjectionChanged,
      () => {
        if (
          state.pointer &&
          !projectedSelectionAllowed()
        ) {
          interruptActivePointer(
            "projection-invalidated"
          );
        }

        attemptRuntimeActivation(
          "compositor-projection-changed"
        );
      }
    );

    addCoreListener(
      window,
      EVENTS.compositorFailure,
      () => {
        interruptActivePointer(
          "compositor-failure"
        );

        deactivateRuntime(
          "compositor-failure"
        );

        state.compositor =
          null;
      }
    );

    addCoreListener(
      window,
      EVENTS.compositorDisposed,
      () => {
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
    );

    addCoreListener(
      window,
      EVENTS.crystalsReady,
      () => {
        attemptRuntimeActivation(
          "crystals-ready-event"
        );
      }
    );

    addCoreListener(
      window,
      EVENTS.crystalsFailure,
      () => {
        interruptActivePointer(
          "crystals-failure"
        );

        publishReceipt(
          "crystal-enhancement-unavailable",
          {
            compositorHitTestingRetained:
              compositorProjectionReady(),

            nativeSemanticFallbackPreserved:
              true
          }
        );
      }
    );

    addCoreListener(
      window,
      EVENTS.crystalsDisposed,
      () => {
        interruptActivePointer(
          "crystals-disposed"
        );

        publishReceipt(
          "crystal-enhancement-disposed",
          {
            nativeSemanticFallbackPreserved:
              true
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
            `api:${
              normalize(reason) ||
              "cancel"
            }`
          );
        },

        retryRuntime(
          reason = "api"
        ) {
          clearRetryTimer();

          state.retryCount =
            0;

          return attemptRuntimeActivation(
            `api:${
              normalize(reason) ||
              "retry"
            }`
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
  }

  function removeApi() {
    try {
      delete window
        .SHOWROOM_INTERACTIONS;
    } catch {
      /* Best-effort cleanup. */
    }
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

          exactControllerTransactionSignatures:
            true,

          quaternionConstructionOwned:
            true,

          primaryIdentityDerivationOwned:
            true,

          nativeSemanticFallbackPreserved:
            true
        }
      );

      attemptRuntimeActivation(
        "startup"
      );
    } catch (error) {
      rollbackInitialization(error);
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
      `dispose:${
        normalize(reason) ||
        "api"
      }`
    );

    deactivateRuntime(
      `dispose:${
        normalize(reason) ||
        "api"
      }`
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

        controllerStateMutatedDirectly:
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

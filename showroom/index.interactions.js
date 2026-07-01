/* TARGET FILE: /showroom/index.interactions.js */
/* TNT FULL-FILE REPLACEMENT */
/* SHOWROOM_COMPLETE_QUATERNION_DIRECT_INTERACTIONS_TNT_v5 */
/*
  Accepted dependencies:
  - window.SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER
  - controller module:
      SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER
      7.0.0-controller-interaction-semantic-priority
  - window.SHOWROOM_COMPOSITOR
  - compositor contract:
      SHOWROOM_CONSTELLATION_SINGLE_FRAME_COMPOSITOR_TNT_v5

  Interaction authority:
  - bounded orbit-field pointer lifecycle;
  - one active primary pointer;
  - pointer capture and release;
  - authoritative compositor hit-test consumption;
  - semantic-control correspondence;
  - tap, drag, flick, interruption, and cancellation classification;
  - complete quaternion construction;
  - orbit primary-cardinal inference;
  - cluster primary-room inference;
  - controller gesture transaction orchestration;
  - orbit preview, commit, and cancellation;
  - cluster preview, commit, and cancellation;
  - cluster flick return to constellation;
  - cardinal, room, and Compass semantic activation;
  - native semantic-control delegation;
  - duplicate native-click suppression;
  - runtime readiness recovery;
  - complete listener and style restoration.

  Exact controller gesture signatures:
  - beginOrbitGesture()
  - requestOrbitPreview({ quaternion, primaryId })
  - requestOrbitCommit()
  - requestOrbitCancel(reason)
  - beginClusterGesture(wing)
  - requestClusterPreview(wing, { quaternion, primaryId })
  - requestClusterCommit(wing)
  - requestClusterCancel(wing, reason)

  Explicit exclusions:
  - no accepted navigation-state ownership;
  - no route interpretation or destination execution;
  - no crystal geometry or rendering;
  - no compositor projection construction;
  - no camera mutation;
  - no Compass rendering lifecycle;
  - no controller-panel ownership;
  - no front-host visibility ownership;
  - no Diamond or Window ownership.
*/

(() => {
  "use strict";

  const CONTRACT =
    "SHOWROOM_COMPLETE_QUATERNION_DIRECT_INTERACTIONS_TNT_v5";

  const OWNER =
    "/showroom/index.interactions.js";

  const CONTROLLER_GLOBAL =
    "SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER";

  const CONTROLLER_MODULE_ID =
    "SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER";

  const CONTROLLER_MODULE_VERSION =
    "7.0.0-controller-interaction-semantic-priority";

  const CONTROLLER_INTERACTION_MODULE_ID =
    "DGB_ARCHCOIN_INTERACTIONS";

  const CONTROLLER_INTERACTION_MODULE_VERSION =
    "1.0.0-pointer-gesture-interpreter";

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

    cardinalControl:
      "[data-showroom-cardinal-control][data-showroom-cardinal-id]",

    roomControl:
      "[data-showroom-child-control][data-showroom-child-id]" +
      "[data-showroom-cardinal-id]",

    compassControl:
      "[data-showroom-compass-control]",

    semanticControl:
      [
        "[data-showroom-cardinal-control][data-showroom-cardinal-id]",
        "[data-showroom-child-control][data-showroom-child-id]",
        "[data-showroom-compass-control]"
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

  const GESTURE_SCOPES = Object.freeze({
    ORBIT:
      "orbit",

    CLUSTER:
      "cluster"
  });

  const POINTER_TERRITORIES = Object.freeze({
    COMPASS:
      "compass",

    CARDINAL:
      "cardinal",

    ROOM:
      "room",

    EMPTY_FIELD:
      "empty-field"
  });

  const OUTCOMES = Object.freeze({
    CARDINAL_TAP:
      "cardinal-tap",

    ROOM_TAP:
      "room-tap",

    COMPASS_TAP:
      "compass-tap",

    EMPTY_TAP:
      "empty-tap",

    ORBIT_COMMIT:
      "orbit-commit",

    CLUSTER_COMMIT:
      "cluster-commit",

    CLUSTER_FLICK_RETURN:
      "cluster-flick-return",

    CANCELLED:
      "cancelled",

    INTERRUPTED:
      "interrupted",

    REJECTED:
      "rejected",

    AMBIGUOUS:
      "ambiguous"
  });

  const CONFIG = Object.freeze({
    dragDeadZonePx:
      7,

    maximumTapDistancePx:
      13,

    minimumCommitDistancePx:
      8,

    radiansPerViewport:
      Math.PI * 1.18,

    maximumPitchRadians:
      Math.PI * 0.74,

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
      0.65,

    flickMinimumDirectionalRatio:
      1.20,

    flickMaximumPauseBeforeReleaseMs:
      110,

    flickMaximumPathEfficiencyLoss:
      0.30,

    suppressClickMs:
      560,

    runtimeRetryLimit:
      120,

    runtimeRetryIntervalMs:
      100
  });

  const WINGS = Object.freeze([
    "north",
    "east",
    "south",
    "west"
  ]);

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

  const PRIMARY_ANCHORS = Object.freeze({
    orbit:
      Object.freeze([
        0,
        1,
        0.08
      ]),

    cluster:
      Object.freeze([
        0,
        1,
        0.18
      ])
  });

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

      cardinalSelections:
        0,

      roomSelections:
        0,

      compassSelections:
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

  function finiteNumber(
    value,
    fallback = 0
  ) {
    const numeric =
      Number(value);

    return Number.isFinite(numeric)
      ? numeric
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

      controllerModuleId:
        CONTROLLER_MODULE_ID,

      controllerModuleVersion:
        CONTROLLER_MODULE_VERSION,

      interactionModuleId:
        CONTROLLER_INTERACTION_MODULE_ID,

      interactionModuleVersion:
        CONTROLLER_INTERACTION_MODULE_VERSION,

      compositorContract:
        COMPOSITOR_CONTRACT,

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

      failed:
        state.failed,

      disposed:
        state.disposed,

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

              transactionBegan:
                pointer.transactionBegan,

              identity:
                pointer.identity ||
                null,

              activeWing:
                pointer.activeWing ||
                null,

              currentPrimaryId:
                pointer.currentPrimaryId ||
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

  function vectorLength(vector) {
    return Math.hypot(
      vector[0],
      vector[1],
      vector[2]
    );
  }

  function normalizeVector(
    vector,
    fallback = [
      0,
      0,
      1
    ]
  ) {
    const length =
      vectorLength(vector);

    if (
      !Number.isFinite(length) ||
      length <= 1e-12
    ) {
      return fallback.slice();
    }

    return [
      vector[0] / length,
      vector[1] / length,
      vector[2] / length
    ];
  }

  function dot(
    first,
    second
  ) {
    return (
      first[0] * second[0] +
      first[1] * second[1] +
      first[2] * second[2]
    );
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
      length <= 1e-12
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

  function quaternionConjugate(
    quaternion
  ) {
    return [
      -quaternion[0],
      -quaternion[1],
      -quaternion[2],
      quaternion[3]
    ];
  }

  function quaternionFromAxisAngle(
    axis,
    angle
  ) {
    const normalizedAxis =
      normalizeVector(axis);

    const half =
      angle * 0.5;

    const sine =
      Math.sin(half);

    return quaternionNormalize([
      normalizedAxis[0] * sine,
      normalizedAxis[1] * sine,
      normalizedAxis[2] * sine,
      Math.cos(half)
    ]);
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

  function orientationQuaternion(
    orientation
  ) {
    if (
      orientation &&
      (
        Array.isArray(
          orientation.quaternion
        ) ||
        ArrayBuffer.isView(
          orientation.quaternion
        )
      )
    ) {
      return quaternionNormalize(
        orientation.quaternion
      );
    }

    return [
      0,
      0,
      0,
      1
    ];
  }

  function roomOrdinal(
    roomId
  ) {
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

  function deriveOrbitPrimaryId(
    quaternion
  ) {
    const anchor =
      normalizeVector(
        PRIMARY_ANCHORS.orbit
      );

    let bestId =
      "north";

    let bestScore =
      -Infinity;

    for (
      const wing
      of WINGS
    ) {
      const vector =
        normalizeVector(
          quaternionRotateVector(
            quaternion,
            CARDINAL_BASE_POSITIONS[
              wing
            ]
          )
        );

      const score =
        dot(
          vector,
          anchor
        );

      if (score > bestScore) {
        bestScore =
          score;

        bestId =
          wing;
      }
    }

    return bestId;
  }

  function deriveClusterPrimaryId(
    frame,
    quaternion
  ) {
    const wing =
      normalizeWing(
        frame &&
        frame.activeClusterWing
      ) ||
      normalizeWing(
        frame &&
        frame.selectedCardinal
      );

    const roomIds =
      frame &&
      frame.cluster &&
      Array.isArray(
        frame.cluster.roomIds
      )
        ? frame.cluster.roomIds
            .map(normalizeRoomId)
            .filter(Boolean)
        : [];

    if (
      !wing ||
      roomIds.length !== 4
    ) {
      return "";
    }

    const anchor =
      normalizeVector(
        PRIMARY_ANCHORS.cluster
      );

    let bestId =
      roomIds[0];

    let bestScore =
      -Infinity;

    for (
      const roomId
      of roomIds
    ) {
      const ordinal =
        roomOrdinal(roomId);

      if (!ordinal) {
        continue;
      }

      const vector =
        normalizeVector(
          quaternionRotateVector(
            quaternion,
            ROOM_BASE_POSITIONS[
              ordinal
            ]
          )
        );

      const score =
        dot(
          vector,
          anchor
        );

      if (score > bestScore) {
        bestScore =
          score;

        bestId =
          roomId;
      }
    }

    return bestId;
  }

  function dragQuaternionFromPointer(
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
      clamp(
        (
          deltaY /
          height
        ) *
        CONFIG.radiansPerViewport,

        -CONFIG.maximumPitchRadians,
        CONFIG.maximumPitchRadians
      );

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

  function validControllerApi(
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
      typeof controller.requestCardinalSelection ===
        "function" &&
      typeof controller.requestRoomSelection ===
        "function" &&
      typeof controller.requestCompassSelection ===
        "function" &&
      typeof controller.requestReturnToConstellation ===
        "function"
    );
  }

  function validControllerFrame(
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
      typeof frame.orbitOrientation ===
        "object" &&
      Array.isArray(
        frame.orbitOrientation
          .quaternion
      ) &&
      frame.orbitOrientation
        .quaternion.length ===
        4 &&
      (
        frame.cluster === null ||
        (
          frame.cluster &&
          typeof frame.cluster ===
            "object"
        )
      )
    );
  }

  function resolveController() {
    const controller =
      window[
        CONTROLLER_GLOBAL
      ];

    if (!validControllerApi(controller)) {
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

      return validControllerFrame(frame)
        ? frame
        : null;
    } catch {
      return null;
    }
  }

  function controllerReady() {
    const frame =
      readControllerFrame();

    return Boolean(
      frame &&
      frame.held === false &&
      frame.navigationState !==
        NAVIGATION_STATES.SYSTEM_HELD
    );
  }

  function validCompositorApi(
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

      return (
        compositorState &&
        compositorState.contract ===
          COMPOSITOR_CONTRACT
      )
        ? compositorState
        : null;
    } catch {
      return null;
    }
  }

  function compositorReady() {
    const compositorState =
      readCompositorState();

    return Boolean(
      compositorState &&
      compositorState.initialized ===
        true &&
      compositorState.readyPublished ===
        true &&
      compositorState.controllerReady ===
        true &&
      compositorState.failed ===
        false &&
      compositorState.disposed ===
        false &&
      compositorState.held ===
        false
    );
  }

  function runtimeReady() {
    return Boolean(
      controllerReady() &&
      compositorReady()
    );
  }

  function authoritativeHitTest(
    clientX,
    clientY
  ) {
    const compositor =
      state.compositor ||
      resolveCompositor();

    if (
      !compositor ||
      !compositorReady()
    ) {
      return null;
    }

    try {
      const hit =
        compositor.hitTest(
          clientX,
          clientY
        );

      if (!hit) {
        state.counters.compositorMisses +=
          1;

        return null;
      }

      const identity =
        normalize(
          hit.semanticObjectId ||
          hit.projectionId ||
          hit.childId ||
          hit.cardinalId ||
          hit.id
        );

      if (!identity) {
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

  function identityFromHit(hit) {
    return normalize(
      hit &&
      (
        hit.semanticObjectId ||
        hit.projectionId ||
        hit.childId ||
        hit.cardinalId ||
        hit.id
      )
    );
  }

  function semanticKindFromHit(hit) {
    const kind =
      normalizeLower(
        hit &&
        hit.kind
      );

    if (
      kind === "cardinal" ||
      kind === "coin"
    ) {
      return "cardinal";
    }

    if (
      kind === "room" ||
      kind === "child"
    ) {
      return "room";
    }

    if (
      normalize(
        hit &&
        hit.childId
      )
    ) {
      return "room";
    }

    if (
      normalize(
        hit &&
        hit.cardinalId
      )
    ) {
      return "cardinal";
    }

    return "";
  }

  function semanticControlFromTarget(
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
        SELECTORS.semanticControl
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

  function semanticIdentityFromControl(
    control
  ) {
    if (!control) {
      return "";
    }

    return normalize(
      control.getAttribute(
        "data-showroom-child-id"
      ) ||
      control.getAttribute(
        "data-showroom-cardinal-id"
      ) ||
      control.getAttribute(
        "data-showroom-object-id"
      )
    );
  }

  function semanticKindFromControl(
    control
  ) {
    if (!control) {
      return "";
    }

    if (
      control.matches(
        SELECTORS.compassControl
      )
    ) {
      return "compass";
    }

    if (
      control.matches(
        SELECTORS.roomControl
      )
    ) {
      return "room";
    }

    if (
      control.matches(
        SELECTORS.cardinalControl
      )
    ) {
      return "cardinal";
    }

    return "";
  }

  function isProtectedTarget(target) {
    return Boolean(
      isElement(target) &&
      target.closest(
        SELECTORS.protectedTarget
      )
    );
  }

  function isPrimaryPointerEvent(event) {
    if (
      event.pointerType ===
        "mouse" &&
      event.button !== 0
    ) {
      return false;
    }

    return event.isPrimary !== false;
  }

  function insideOrbitField(target) {
    return Boolean(
      state.orbitField &&
      isElement(target) &&
      state.orbitField.contains(
        target
      )
    );
  }

  function deriveGestureScope(frame) {
    if (!frame) {
      return "";
    }

    if (
      frame.navigationState ===
      NAVIGATION_STATES.CONSTELLATION
    ) {
      return GESTURE_SCOPES.ORBIT;
    }

    if (
      frame.navigationState ===
        NAVIGATION_STATES.CLUSTER_OPEN ||
      frame.navigationState ===
        NAVIGATION_STATES.ROOM_SELECTED
    ) {
      return GESTURE_SCOPES.CLUSTER;
    }

    return "";
  }

  function activeClusterWing(frame) {
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

  function startQuaternionFromFrame(
    frame,
    gestureScope
  ) {
    if (
      gestureScope ===
        GESTURE_SCOPES.CLUSTER &&
      frame &&
      frame.cluster &&
      frame.cluster.orientation
    ) {
      return orientationQuaternion(
        frame.cluster.orientation
      );
    }

    return orientationQuaternion(
      frame &&
      frame.orbitOrientation
    );
  }

  function classifyPointerTerritory(
    event,
    hit,
    directControl
  ) {
    const directKind =
      semanticKindFromControl(
        directControl
      );

    if (directKind === "compass") {
      return POINTER_TERRITORIES.COMPASS;
    }

    const hitKind =
      semanticKindFromHit(hit);

    if (
      hitKind === "cardinal" ||
      directKind === "cardinal"
    ) {
      return POINTER_TERRITORIES.CARDINAL;
    }

    if (
      hitKind === "room" ||
      directKind === "room"
    ) {
      return POINTER_TERRITORIES.ROOM;
    }

    return POINTER_TERRITORIES.EMPTY_FIELD;
  }

  function createPointerState(
    event,
    frame
  ) {
    const directControl =
      semanticControlFromTarget(
        event.target
      );

    const directKind =
      semanticKindFromControl(
        directControl
      );

    const hit =
      directKind === "compass"
        ? null
        : authoritativeHitTest(
            event.clientX,
            event.clientY
          );

    const hitIdentity =
      identityFromHit(hit);

    const directIdentity =
      semanticIdentityFromControl(
        directControl
      );

    const identity =
      hitIdentity ||
      directIdentity;

    const territory =
      classifyPointerTerritory(
        event,
        hit,
        directControl
      );

    const gestureScope =
      territory ===
        POINTER_TERRITORIES.COMPASS
        ? ""
        : deriveGestureScope(frame);

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
        normalize(
          event.pointerType
        ) ||
        "mouse",

      territory,

      gestureScope,

      identity,

      hit,

      directControl,

      activeWing:
        activeClusterWing(frame),

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

      transactionBegan:
        false,

      previewAccepted:
        false,

      startQuaternion,

      currentQuaternion:
        startQuaternion.slice(),

      currentPrimaryId:
        gestureScope ===
          GESTURE_SCOPES.CLUSTER
          ? deriveClusterPrimaryId(
              frame,
              startQuaternion
            )
          : deriveOrbitPrimaryId(
              startQuaternion
            ),

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
        280
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
      Math.hypot(
        pointer.currentX -
          previousX,

        pointer.currentY -
          previousY
      );

    pointer.maximumDistance =
      Math.max(
        pointer.maximumDistance,

        Math.hypot(
          pointer.currentX -
            pointer.startX,

          pointer.currentY -
            pointer.startY
        )
      );

    appendSample(
      pointer,
      pointer.currentX,
      pointer.currentY,
      timestamp
    );
  }

  function beginControllerTransaction(
    pointer
  ) {
    const controller =
      state.controller ||
      resolveController();

    if (
      !controller ||
      pointer.transactionBegan
    ) {
      return Boolean(
        pointer.transactionBegan
      );
    }

    let accepted =
      false;

    try {
      if (
        pointer.gestureScope ===
        GESTURE_SCOPES.ORBIT
      ) {
        accepted =
          controller.beginOrbitGesture() !==
          false;

        if (accepted) {
          state.counters.orbitBegins +=
            1;
        }
      } else if (
        pointer.gestureScope ===
          GESTURE_SCOPES.CLUSTER &&
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

    pointer.transactionBegan =
      accepted;

    return accepted;
  }

  function previewControllerTransaction(
    pointer,
    frame
  ) {
    const controller =
      state.controller ||
      resolveController();

    if (
      !controller ||
      !pointer.transactionBegan
    ) {
      return false;
    }

    let accepted =
      false;

    if (
      pointer.gestureScope ===
      GESTURE_SCOPES.ORBIT
    ) {
      pointer.currentPrimaryId =
        deriveOrbitPrimaryId(
          pointer.currentQuaternion
        );

      try {
        accepted =
          controller.requestOrbitPreview({
            quaternion:
              pointer.currentQuaternion
                .slice(),

            primaryId:
              pointer.currentPrimaryId
          }) !== false;
      } catch {
        accepted =
          false;
      }

      if (accepted) {
        state.counters.orbitPreviews +=
          1;
      }
    } else if (
      pointer.gestureScope ===
        GESTURE_SCOPES.CLUSTER &&
      pointer.activeWing
    ) {
      pointer.currentPrimaryId =
        deriveClusterPrimaryId(
          frame,
          pointer.currentQuaternion
        );

      if (!pointer.currentPrimaryId) {
        return false;
      }

      try {
        accepted =
          controller.requestClusterPreview(
            pointer.activeWing,
            {
              quaternion:
                pointer.currentQuaternion
                  .slice(),

              primaryId:
                pointer.currentPrimaryId
            }
          ) !== false;
      } catch {
        accepted =
          false;
      }

      if (accepted) {
        state.counters.clusterPreviews +=
          1;
      }
    }

    pointer.previewAccepted =
      accepted;

    return accepted;
  }

  function cancelControllerTransaction(
    pointer,
    reason
  ) {
    if (
      !pointer ||
      !pointer.transactionBegan
    ) {
      return false;
    }

    const controller =
      state.controller ||
      resolveController();

    if (!controller) {
      return false;
    }

    let cancelled =
      false;

    try {
      if (
        pointer.gestureScope ===
        GESTURE_SCOPES.ORBIT
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
        pointer.gestureScope ===
          GESTURE_SCOPES.CLUSTER &&
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

    pointer.transactionBegan =
      false;

    pointer.previewAccepted =
      false;

    return cancelled;
  }

  function commitControllerTransaction(
    pointer
  ) {
    if (
      !pointer ||
      !pointer.transactionBegan ||
      !pointer.previewAccepted
    ) {
      return false;
    }

    const controller =
      state.controller ||
      resolveController();

    if (!controller) {
      return false;
    }

    let committed =
      false;

    try {
      if (
        pointer.gestureScope ===
        GESTURE_SCOPES.ORBIT
      ) {
        committed =
          controller.requestOrbitCommit() !==
          false;

        if (committed) {
          state.counters.orbitCommits +=
            1;
        }
      } else if (
        pointer.gestureScope ===
          GESTURE_SCOPES.CLUSTER &&
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
      pointer.transactionBegan =
        false;

      pointer.previewAccepted =
        false;
    }

    return committed;
  }

  function capturePointer(pointerId) {
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
      /* Best-effort release. */
    }
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

    const recent =
      pointer.samples.filter(
        sample =>
          sample.timestamp >=
          releaseTime -
            CONFIG.sampleWindowMs
      );

    const releaseStart =
      recent.length
        ? recent[0]
        : {
            x:
              pointer.startX,

            y:
              pointer.startY,

            timestamp:
              pointer.startTime
          };

    const releaseDistance =
      Math.hypot(
        releaseX -
          releaseStart.x,

        releaseY -
          releaseStart.y
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
      pathLength > 1e-6
        ? distance /
          pathLength
        : 0;

    const pathEfficiencyLoss =
      1 -
      pathEfficiency;

    const lastSample =
      recent.length
        ? recent[
            recent.length - 1
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
      distance,
      duration,
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

  function invokeSemanticSelection(
    kind,
    identity
  ) {
    const controller =
      state.controller ||
      resolveController();

    if (
      !controller ||
      !controllerReady()
    ) {
      return false;
    }

    let accepted =
      false;

    try {
      if (kind === "compass") {
        accepted =
          controller.requestCompassSelection() !==
          false;

        if (accepted) {
          state.counters.compassSelections +=
            1;
        }
      } else if (kind === "cardinal") {
        const wing =
          normalizeWing(identity);

        accepted =
          Boolean(
            wing &&
            controller.requestCardinalSelection(
              wing
            ) !== false
          );

        if (accepted) {
          state.counters.cardinalSelections +=
            1;
        }
      } else if (kind === "room") {
        const roomId =
          normalizeRoomId(identity);

        accepted =
          Boolean(
            roomId &&
            controller.requestRoomSelection(
              roomId
            ) !== false
          );

        if (accepted) {
          state.counters.roomSelections +=
            1;
        }
      }
    } catch {
      accepted =
        false;
    }

    return accepted;
  }

  function hitCorresponds(
    downHit,
    releaseHit
  ) {
    const downIdentity =
      identityFromHit(
        downHit
      );

    const releaseIdentity =
      identityFromHit(
        releaseHit
      );

    return Boolean(
      downIdentity &&
      releaseIdentity &&
      downIdentity ===
        releaseIdentity
    );
  }

  function commitTap(
    pointer,
    event
  ) {
    if (
      pointer.territory ===
      POINTER_TERRITORIES.COMPASS
    ) {
      const releaseElement =
        typeof document.elementFromPoint ===
          "function"
          ? document.elementFromPoint(
              event.clientX,
              event.clientY
            )
          : null;

      const control =
        pointer.directControl;

      const corresponds =
        Boolean(
          control &&
          releaseElement &&
          (
            releaseElement === control ||
            control.contains(
              releaseElement
            )
          )
        );

      if (!corresponds) {
        return false;
      }

      armClickSuppression(
        control,
        "compass-pointer-activation"
      );

      return invokeSemanticSelection(
        "compass",
        "home-compass"
      );
    }

    if (
      pointer.territory ===
        POINTER_TERRITORIES.CARDINAL ||
      pointer.territory ===
        POINTER_TERRITORIES.ROOM
    ) {
      const releaseHit =
        authoritativeHitTest(
          event.clientX,
          event.clientY
        );

      if (
        pointer.hit &&
        releaseHit &&
        !hitCorresponds(
          pointer.hit,
          releaseHit
        )
      ) {
        return false;
      }

      const releaseControl =
        semanticControlFromTarget(
          typeof document.elementFromPoint ===
            "function"
            ? document.elementFromPoint(
                event.clientX,
                event.clientY
              )
            : null
        );

      const releaseIdentity =
        identityFromHit(
          releaseHit
        ) ||
        semanticIdentityFromControl(
          releaseControl
        ) ||
        pointer.identity;

      const releaseKind =
        semanticKindFromHit(
          releaseHit
        ) ||
        semanticKindFromControl(
          releaseControl
        ) ||
        (
          pointer.territory ===
          POINTER_TERRITORIES.CARDINAL
            ? "cardinal"
            : "room"
        );

      if (
        !releaseIdentity ||
        (
          pointer.identity &&
          releaseIdentity !==
            pointer.identity
        )
      ) {
        return false;
      }

      armClickSuppression(
        pointer.directControl ||
        state.orbitField,
        "projected-pointer-activation"
      );

      return invokeSemanticSelection(
        releaseKind,
        releaseIdentity
      );
    }

    return false;
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
      !pointer.activeWing
    ) {
      return false;
    }

    if (pointer.transactionBegan) {
      cancelControllerTransaction(
        pointer,
        "cluster-flick-return"
      );
    }

    let returned =
      false;

    try {
      returned =
        controller.requestReturnToConstellation({
          scrollToScene:
            true,

          source:
            "pointer-flick",

          direction:
            flick.direction
        }) !== false;
    } catch {
      /*
        The controller accepts one options object but ignores unsupported
        metadata. Retry with its minimum accepted options surface.
      */
      try {
        returned =
          controller.requestReturnToConstellation({
            scrollToScene:
              true
          }) !== false;
      } catch {
        returned =
          false;
      }
    }

    if (returned) {
      state.counters.clusterReturns +=
        1;
    }

    return returned;
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

    cancelControllerTransaction(
      pointer,
      reason
    );

    if (
      pointer.dragging ||
      pointer.maximumDistance >
        CONFIG.maximumTapDistancePx
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
      !state.runtimeActive ||
      !isPrimaryPointerEvent(event) ||
      !insideOrbitField(
        event.target
      ) ||
      isProtectedTarget(
        event.target
      )
    ) {
      return;
    }

    const frame =
      readControllerFrame();

    if (
      !frame ||
      frame.held === true
    ) {
      return;
    }

    const pointer =
      createPointerState(
        event,
        frame
      );

    if (
      pointer.territory !==
        POINTER_TERRITORIES.COMPASS &&
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
            pointer.pointerId
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

        territory:
          pointer.territory,

        gestureScope:
          pointer.gestureScope,

        identity:
          pointer.identity ||
          null,

        activeWing:
          pointer.activeWing ||
          null,

        primaryId:
          pointer.currentPrimaryId ||
          null
      }
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

    if (!runtimeReady()) {
      interruptActivePointer(
        "runtime-invalidated"
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
      pointer.territory ===
      POINTER_TERRITORIES.COMPASS
    ) {
      if (
        pointer.maximumDistance >=
        CONFIG.dragDeadZonePx
      ) {
        pointer.dragging =
          true;
      }

      event.preventDefault();
      return;
    }

    if (
      !pointer.dragging &&
      pointer.maximumDistance >=
        CONFIG.dragDeadZonePx
    ) {
      pointer.dragging =
        true;

      if (
        !beginControllerTransaction(
          pointer
        )
      ) {
        interruptActivePointer(
          "gesture-transaction-rejected"
        );

        return;
      }
    }

    if (!pointer.dragging) {
      return;
    }

    event.preventDefault();

    pointer.currentQuaternion =
      dragQuaternionFromPointer(
        pointer,
        event.clientX,
        event.clientY
      );

    const frame =
      readControllerFrame();

    if (
      !frame ||
      !previewControllerTransaction(
        pointer,
        frame
      )
    ) {
      interruptActivePointer(
        "gesture-preview-rejected"
      );
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

    pointer.currentX =
      releaseX;

    pointer.currentY =
      releaseY;

    pointer.currentTime =
      releaseTime;

    pointer.maximumDistance =
      Math.max(
        pointer.maximumDistance,

        Math.hypot(
          releaseX -
            pointer.startX,

          releaseY -
            pointer.startY
        )
      );

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
      OUTCOMES.REJECTED;

    let committed =
      false;

    let flick =
      null;

    if (cancelled) {
      cancelControllerTransaction(
        pointer,
        "pointer-cancelled"
      );

      outcome =
        OUTCOMES.CANCELLED;
    } else if (!runtimeReady()) {
      cancelControllerTransaction(
        pointer,
        "runtime-invalid-at-release"
      );

      outcome =
        OUTCOMES.INTERRUPTED;
    } else if (
      !pointer.dragging &&
      pointer.maximumDistance <=
        CONFIG.maximumTapDistancePx
    ) {
      committed =
        commitTap(
          pointer,
          event
        );

      if (
        pointer.territory ===
        POINTER_TERRITORIES.COMPASS
      ) {
        outcome =
          committed
            ? OUTCOMES.COMPASS_TAP
            : OUTCOMES.REJECTED;
      } else if (
        pointer.territory ===
        POINTER_TERRITORIES.CARDINAL
      ) {
        outcome =
          committed
            ? OUTCOMES.CARDINAL_TAP
            : OUTCOMES.REJECTED;
      } else if (
        pointer.territory ===
        POINTER_TERRITORIES.ROOM
      ) {
        outcome =
          committed
            ? OUTCOMES.ROOM_TAP
            : OUTCOMES.REJECTED;
      } else {
        outcome =
          OUTCOMES.EMPTY_TAP;
      }
    } else if (
      pointer.dragging &&
      pointer.gestureScope ===
        GESTURE_SCOPES.CLUSTER
    ) {
      flick =
        classifyFlick(
          pointer,
          releaseX,
          releaseY,
          releaseTime
        );

      armClickSuppression(
        pointer.directControl ||
        state.orbitField,
        flick.qualifies
          ? "cluster-flick"
          : "cluster-drag"
      );

      if (flick.qualifies) {
        state.counters.flicksQualified +=
          1;

        committed =
          requestClusterFlickReturn(
            pointer,
            flick
          );

        outcome =
          committed
            ? OUTCOMES.CLUSTER_FLICK_RETURN
            : OUTCOMES.REJECTED;
      } else if (
        pointer.maximumDistance >=
        CONFIG.minimumCommitDistancePx
      ) {
        committed =
          commitControllerTransaction(
            pointer
          );

        if (!committed) {
          cancelControllerTransaction(
            pointer,
            "cluster-commit-rejected"
          );
        }

        outcome =
          committed
            ? OUTCOMES.CLUSTER_COMMIT
            : OUTCOMES.REJECTED;
      } else {
        cancelControllerTransaction(
          pointer,
          "cluster-ambiguous-release"
        );

        outcome =
          OUTCOMES.AMBIGUOUS;
      }
    } else if (
      pointer.dragging &&
      pointer.gestureScope ===
        GESTURE_SCOPES.ORBIT
    ) {
      armClickSuppression(
        pointer.directControl ||
        state.orbitField,
        "orbit-drag"
      );

      if (
        pointer.maximumDistance >=
        CONFIG.minimumCommitDistancePx
      ) {
        committed =
          commitControllerTransaction(
            pointer
          );

        if (!committed) {
          cancelControllerTransaction(
            pointer,
            "orbit-commit-rejected"
          );
        }

        outcome =
          committed
            ? OUTCOMES.ORBIT_COMMIT
            : OUTCOMES.REJECTED;
      } else {
        cancelControllerTransaction(
          pointer,
          "orbit-ambiguous-release"
        );

        outcome =
          OUTCOMES.AMBIGUOUS;
      }
    } else {
      cancelControllerTransaction(
        pointer,
        "ambiguous-release"
      );

      outcome =
        OUTCOMES.AMBIGUOUS;
    }

    if (
      pointer.dragging ||
      committed
    ) {
      event.preventDefault();
    }

    clearPointer(
      pointer
    );

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

        identity:
          pointer.identity ||
          null,

        activeWing:
          pointer.activeWing ||
          null,

        primaryId:
          pointer.currentPrimaryId ||
          null,

        duration,

        maximumDistance:
          pointer.maximumDistance,

        pathLength:
          pointer.pathLength,

        cancelled:
          Boolean(cancelled),

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

  function handleClickCapture(event) {
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
      !state.runtimeActive ||
      event.defaultPrevented ||
      event.detail === 0
    ) {
      return;
    }

    const control =
      semanticControlFromTarget(
        event.target
      );

    if (!control) {
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

    if (!kind) {
      return;
    }

    const accepted =
      invokeSemanticSelection(
        kind,
        identity
      );

    if (!accepted) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    publishReceipt(
      "native-semantic-selection",
      {
        kind,

        identity:
          identity ||
          null
      }
    );
  }

  function handleContextMenu(event) {
    if (
      state.pointer &&
      insideOrbitField(
        event.target
      )
    ) {
      event.preventDefault();
    }
  }

  function handleDragStart(event) {
    if (
      insideOrbitField(
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

          completeQuaternionDirectManipulation:
            true,

          exactControllerGestureSignatures:
            true,

          orbitGestureTransactions:
            true,

          clusterGestureTransactions:
            true,

          orbitPrimaryInference:
            true,

          clusterPrimaryInference:
            true,

          compositorHitTestAuthoritative:
            true,

          cardinalSemanticSelection:
            true,

          roomSemanticSelection:
            true,

          compassSemanticSelection:
            true,

          clusterFlickReturn:
            true,

          duplicateClickSuppression:
            true,

          controllerStateOwnership:
            false,

          compositorProjectionOwnership:
            false,

          crystalRenderingOwnership:
            false
        }
      );

      dispatch(
        EVENTS.interactionsReady,
        {
          reason,

          completeQuaternionDirectManipulation:
            true,

          orbitGestureTransactions:
            true,

          clusterGestureTransactions:
            true,

          clusterFlickReturn:
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
    reason =
      "runtime-check"
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

    resolveController();
    resolveCompositor();

    const ready =
      runtimeReady();

    if (!ready) {
      if (state.runtimeActive) {
        deactivateRuntime(
          `${reason}:runtime-not-ready`
        );
      }

      state.waitingForRuntime =
        true;

      publishReceipt(
        "waiting-for-runtime",
        {
          reason,

          controllerAvailable:
            Boolean(
              state.controller
            ),

          controllerReady:
            controllerReady(),

          compositorAvailable:
            Boolean(
              state.compositor
            ),

          compositorReady:
            compositorReady(),

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

    return state.runtimeActive
      ? true
      : activateRuntime(
          reason
        );
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
          /* Best-effort cleanup. */
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
              !validControllerFrame(
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
          "Controller subscribeFrameState() returned an invalid unsubscribe value."
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
            "Controller subscribeHeldState() returned an invalid unsubscribe value."
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
      }
    );

    addCoreListener(
      window,
      EVENTS.compositorProjectionChanged,
      () => {
        if (
          state.pointer &&
          !runtimeReady()
        ) {
          interruptActivePointer(
            "projection-invalidated"
          );
        }

        attemptRuntimeActivation(
          "compositor-projection"
        );
      }
    );

    addCoreListener(
      window,
      EVENTS.compositorFailure,
      event => {
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
                : null
          }
        );
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
          "crystals-ready"
        );
      }
    );

    addCoreListener(
      window,
      EVENTS.crystalsFailure,
      event => {
        interruptActivePointer(
          "crystals-failure"
        );

        publishReceipt(
          "crystals-unavailable",
          {
            detail:
              event &&
              event.detail
                ? event.detail
                : null,

            compositorProjectionRetained:
              compositorReady()
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
          "crystals-disposed"
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

        interactionModuleId:
          CONTROLLER_INTERACTION_MODULE_ID,

        interactionModuleVersion:
          CONTROLLER_INTERACTION_MODULE_VERSION,

        compositorGlobal:
          COMPOSITOR_GLOBAL,

        compositorContract:
          COMPOSITOR_CONTRACT,

        getState() {
          return createReceipt(
            "state-requested"
          );
        },

        cancelGesture(
          reason =
            "api"
        ) {
          return interruptActivePointer(
            `api:${normalize(reason) || "cancel"}`
          );
        },

        retryRuntime(
          reason =
            "api"
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

      resolveController();
      resolveCompositor();
      bindControllerSubscriptions();

      publishReceipt(
        "core-initialized",
        {
          pointerRuntime:
            "deferred-until-controller-and-compositor-ready",

          completeQuaternionConstruction:
            true,

          exactControllerTransactionSurface:
            true,

          nativeSemanticDelegation:
            true,

          compositorHitTesting:
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
    reason =
      "api"
  ) {
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

        orbitFieldStyleRestored:
          true,

        controllerStateMutated:
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

    return true;
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

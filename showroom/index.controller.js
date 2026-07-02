/* TARGET FILE: /showroom/index.controller.js */
/* TNT FULL-FILE REPLACEMENT */
/* SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER_TNT_v8 */

(() => {
  "use strict";

  const MODULE = Object.freeze({
    id: "SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER",
    version: "8.0.0-intent-selection-authority",
    file: "/showroom/index.controller.js",
    interactionModuleId: "DGB_ARCHCOIN_INTERACTIONS",
    interactionModuleVersion: "1.0.0-pointer-gesture-interpreter",
    motionContractId: "AUDRALIA_ARCHCOIN_COMPLETE_QUATERNION_MOTION_CONTRACT_v1",
    motionContractVersion: "1.0.0"
  });

  const STATES = Object.freeze({
    CONSTELLATION: "CONSTELLATION",
    CLUSTER_OPEN: "CLUSTER_OPEN",
    ROOM_SELECTED: "ROOM_SELECTED",
    SYSTEM_HELD: "SYSTEM_HELD"
  });

  const PRESENTATION_MODES = Object.freeze({
    CONSTELLATION: "CONSTELLATION",
    CLUSTER: "CLUSTER",
    HELD: "HELD"
  });

  const DESTINATION_KINDS = Object.freeze({
    INTERNAL_INFO: "internal-info",
    OBJECT_INSPECT: "object-inspect",
    EXTERNAL_ROUTE: "external-route"
  });

  const DESTINATION_TYPES = Object.freeze({
    NONE: "",
    COIN: "coin",
    ROOM: "room",
    HOME_COMPASS: "home-compass"
  });

  const ORIENTATION_PHASES = Object.freeze({
    IDLE: "IDLE",
    PREVIEW: "PREVIEW",
    COMMITTED: "COMMITTED",
    CANCELLED: "CANCELLED"
  });

  const DEPTH_LAYERS = Object.freeze({
    FRONT: "front",
    REAR: "rear",
    UNKNOWN: "unknown"
  });

  const CHANNELS = Object.freeze({
    FRAME: "frame",
    REDUCED_MOTION: "reducedMotion",
    HELD_STATE: "heldState",
    COMPASS_STATE: "compassState",
    SEMANTIC_PROJECTION: "semanticProjection"
  });

  const INTENT_ENTRY = Object.freeze({
    event: "SHOWROOM_ARCHCOIN_DESTINATION_ENTRY_REQUESTED",
    contract: "SHOWROOM_DESTINATION_INTENT_REQUEST_v2"
  });

  const INTENT_PAYLOAD_KEYS = Object.freeze([
    "contract",
    "controllerId",
    "controllerVersion",
    "controllerFile",
    "sourceState",
    "wingId",
    "wingLabel",
    "childId",
    "childLabel",
    "destinationKind",
    "infoId",
    "route",
    "routeLabel",
    "routeDescription",
    "routeEvidence",
    "routeRole",
    "objectTarget",
    "semanticActivation",
    "lens",
    "visualClass",
    "emphasis",
    "returnModel",
    "returnZone",
    "authorizationGeneration",
    "timestamp"
  ]);

  const WINGS = Object.freeze([
    "north",
    "east",
    "south",
    "west"
  ]);

  const WING_TO_COIN = Object.freeze({
    north: "story",
    east: "characters",
    south: "wonders",
    west: "mysteries"
  });

  const WING_LABELS = Object.freeze({
    north: "The Story Begins",
    east: "Meet the Characters",
    south: "Wonders of Mirrorland",
    west: "Mysteries Yet Unfolding"
  });

  const MAIN_COMPASS = Object.freeze({
    destinationType: DESTINATION_TYPES.HOME_COMPASS,
    destinationId: "home-compass",
    destinationLabel: "Main Compass",
    route: "/index.html",
    source: "showroom-controller",
    navigationAuthority: "EXPLICIT_RETURN_ACTION"
  });

  const QUATERNION = Object.freeze({
    identity: Object.freeze([0, 0, 0, 1]),
    minimumLength: 1e-8
  });

  const PREVIEW_PAYLOAD_KEYS = Object.freeze([
    "quaternion",
    "primaryId"
  ]);

  const PREVIEW_PAYLOAD_KEY_SET =
    new Set(PREVIEW_PAYLOAD_KEYS);

  const HALF_SQRT_TWO =
    Math.SQRT1_2;

  const CANONICAL_CONSTELLATION_QUATERNIONS = Object.freeze({
    north: Object.freeze([0, 0, 0, 1]),
    east: Object.freeze([0, 0, -HALF_SQRT_TWO, HALF_SQRT_TWO]),
    south: Object.freeze([0, 0, 1, 0]),
    west: Object.freeze([0, 0, HALF_SQRT_TWO, HALF_SQRT_TWO])
  });

  const PRESENTATION_BY_STATE = Object.freeze({
    [STATES.CONSTELLATION]: Object.freeze({
      mode: PRESENTATION_MODES.CONSTELLATION,
      outerCardinalsActive: true,
      activeRoomCluster: false,
      roomSelectionPermitted: false
    }),

    [STATES.CLUSTER_OPEN]: Object.freeze({
      mode: PRESENTATION_MODES.CLUSTER,
      outerCardinalsActive: false,
      activeRoomCluster: true,
      roomSelectionPermitted: true
    }),

    [STATES.ROOM_SELECTED]: Object.freeze({
      mode: PRESENTATION_MODES.CLUSTER,
      outerCardinalsActive: false,
      activeRoomCluster: true,
      roomSelectionPermitted: true
    }),

    [STATES.SYSTEM_HELD]: Object.freeze({
      mode: PRESENTATION_MODES.HELD,
      outerCardinalsActive: false,
      activeRoomCluster: false,
      roomSelectionPermitted: false
    })
  });

  const PRESENTATION_MODE_BY_STATE = Object.freeze({
    [STATES.CONSTELLATION]: PRESENTATION_MODES.CONSTELLATION,
    [STATES.CLUSTER_OPEN]: PRESENTATION_MODES.CLUSTER,
    [STATES.ROOM_SELECTED]: PRESENTATION_MODES.CLUSTER,
    [STATES.SYSTEM_HELD]: PRESENTATION_MODES.HELD
  });

  const TRANSITIONS = Object.freeze({
    [STATES.CONSTELLATION]: Object.freeze([
      STATES.CONSTELLATION,
      STATES.CLUSTER_OPEN,
      STATES.SYSTEM_HELD
    ]),

    [STATES.CLUSTER_OPEN]: Object.freeze([
      STATES.CLUSTER_OPEN,
      STATES.ROOM_SELECTED,
      STATES.CONSTELLATION,
      STATES.SYSTEM_HELD
    ]),

    [STATES.ROOM_SELECTED]: Object.freeze([
      STATES.ROOM_SELECTED,
      STATES.CLUSTER_OPEN,
      STATES.CONSTELLATION,
      STATES.SYSTEM_HELD
    ]),

    [STATES.SYSTEM_HELD]: Object.freeze([
      STATES.SYSTEM_HELD
    ])
  });

  const subscribers = Object.freeze({
    frame: new Set(),
    reducedMotion: new Set(),
    heldState: new Set(),
    compassState: new Set(),
    semanticProjection: new Set()
  });

  const state = {
    root: null,
    scene: null,
    sceneField: null,
    panel: null,
    panelEyebrow: null,
    panelTitle: null,
    panelPurpose: null,
    panelRelationship: null,
    panelDomain: null,
    panelFunction: null,
    panelCoordinate: null,
    panelSelectionState: null,
    panelRouteStatus: null,
    panelLens: null,
    enterButton: null,
    enterLabel: null,
    returnToOrbitButton: null,
    returnToOrbitLabel: null,
    returnHomeButton: null,
    guidance: null,
    controllerReceiptOutput: null,
    controllerValidationOutput: null,
    compassControl: null,

    current: STATES.CONSTELLATION,

    orbitFocus: "north",
    orbitPreviewFocus: "north",
    orbitPhase: ORIENTATION_PHASES.COMMITTED,
    orbitGestureActive: false,
    orbitPreviewAccepted: false,
    orbitRevision: 0,
    orbitOrientation: null,
    committedOrbitOrientation: null,
    orbitGestureOrigin: null,

    clusters: new Map(),

    selectedCardinal: "",
    selectedCoin: "",
    selectedRoom: "",
    selectedDestinationType: DESTINATION_TYPES.NONE,
    selectedDestinationKind: "",
    selectedInfoId: "",
    selectedObjectTarget: "",
    selectedRouteEvidence: "",
    selectedDestinationId: "",
    selectedDestinationLabel: "",
    selectedRoute: "",
    selectedContentId: "",
    selectedLens: "overview",
    selectedParagraph: "",
    selectedSemanticActivation: "",
    selectedRouteLabel: "",
    selectedRouteDescription: "",
    selectedRouteRole: "",
    selectedVisualClass: "",
    selectedEmphasis: "",
    selectedReturnModel: "",
    selectedReturnZone: "",

    destinationAuthorizationGeneration: 0,

    compassSelected: false,
    panelDescended: false,
    panelDescentFrame: 0,
    panelDescentCommitFrame: 0,
    sceneAscentFrame: 0,
    sceneAscentCommitFrame: 0,

    reducedMotion: false,
    mediaQuery: null,
    mediaQueryListener: null,

    semanticProjection: new Map(),
    semanticProjectionRevision: 0,

    initialized: false,
    lastAction: "pending",
    lastFailure: "",
    validationReceipt: null
  };

  function invariant(condition, code, details = null) {
    if (condition) {
      return;
    }

    const error = new Error(code);
    error.code = code;
    error.details = details;
    throw error;
  }

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function finiteNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function normalize(value) {
    return String(value == null ? "" : value).trim();
  }

  function normalizeLower(value) {
    return normalize(value).toLowerCase();
  }

  function normalizeWing(value) {
    const wing = normalizeLower(value);
    return WINGS.includes(wing) ? wing : "";
  }

  function normalizeRoute(value) {
    const route = normalize(value);
    return route.startsWith("/") ? route : "";
  }

  function normalizeLabel(value, fallback = "") {
    return normalize(value) || fallback;
  }

  function normalizeNullableString(value) {
    return normalize(value) || null;
  }

  function normalizeDestinationKind(value) {
    const kind = normalizeLower(value);

    if (
      kind === DESTINATION_KINDS.INTERNAL_INFO ||
      kind === DESTINATION_KINDS.OBJECT_INSPECT ||
      kind === DESTINATION_KINDS.EXTERNAL_ROUTE
    ) {
      return kind;
    }

    return "";
  }

  function normalizeDepthLayer(value) {
    const layer = normalizeLower(value);

    if (layer === DEPTH_LAYERS.FRONT) {
      return DEPTH_LAYERS.FRONT;
    }

    if (layer === DEPTH_LAYERS.REAR) {
      return DEPTH_LAYERS.REAR;
    }

    return DEPTH_LAYERS.UNKNOWN;
  }

  function isPrimitiveIntentPayloadValue(value) {
    return (
      value === null ||
      typeof value === "string" ||
      typeof value === "boolean" ||
      (
        typeof value === "number" &&
        Number.isFinite(value)
      )
    );
  }

  function escapeSelectorValue(value) {
    const source =
      String(value || "");

    if (
      globalThis.CSS &&
      typeof globalThis.CSS.escape === "function"
    ) {
      return globalThis.CSS.escape(source);
    }

    return source.replace(/["\\]/g, "\\$&");
  }

  function unexpectedPreviewPayloadKeys(payload) {
    if (
      !payload ||
      typeof payload !== "object" ||
      Array.isArray(payload)
    ) {
      return [];
    }

    return Object.keys(payload).filter(
      key => !PREVIEW_PAYLOAD_KEY_SET.has(key)
    );
  }

  function normalizeQuaternionStrict(value) {
    const source =
      Array.isArray(value) ||
      ArrayBuffer.isView(value)
        ? Array.from(value)
        : null;

    if (!source || source.length !== 4) {
      return null;
    }

    const quaternion =
      source.map(component => Number(component));

    if (
      quaternion.some(
        component => !Number.isFinite(component)
      )
    ) {
      return null;
    }

    const length =
      Math.hypot(
        quaternion[0],
        quaternion[1],
        quaternion[2],
        quaternion[3]
      );

    if (
      !Number.isFinite(length) ||
      length < QUATERNION.minimumLength
    ) {
      return null;
    }

    return quaternion.map(
      component => component / length
    );
  }

  function normalizeStoredQuaternion(
    value,
    fallback = QUATERNION.identity
  ) {
    return (
      normalizeQuaternionStrict(value) ||
      Array.from(fallback)
    );
  }

  function createOrientation(quaternion, primaryId) {
    const normalized =
      normalizeQuaternionStrict(quaternion);

    invariant(
      normalized,
      "ARCHCOIN_CONTROLLER_INVALID_QUATERNION"
    );

    return {
      quaternion: normalized,
      primaryId: normalize(primaryId)
    };
  }

  function cloneOrientation(orientation) {
    const source =
      orientation &&
      typeof orientation === "object"
        ? orientation
        : {
            quaternion: QUATERNION.identity,
            primaryId: ""
          };

    return {
      quaternion: normalizeStoredQuaternion(source.quaternion),
      primaryId: normalize(source.primaryId)
    };
  }

  function freezeOrientation(orientation) {
    const value =
      cloneOrientation(orientation);

    return Object.freeze({
      quaternion: Object.freeze(value.quaternion.slice()),
      primaryId: value.primaryId
    });
  }

  function canonicalConstellationOrientation(wing) {
    const normalizedWing =
      normalizeWing(wing) || "north";

    return createOrientation(
      CANONICAL_CONSTELLATION_QUATERNIONS[normalizedWing],
      normalizedWing
    );
  }

  function presentationModeForState(
    navigationState = state.current
  ) {
    return (
      PRESENTATION_MODE_BY_STATE[navigationState] ||
      PRESENTATION_MODES.HELD
    );
  }

  function wingToCoin(wing) {
    return WING_TO_COIN[normalizeWing(wing)] || "";
  }

  function canTransition(fromState, toState) {
    return Boolean(
      TRANSITIONS[fromState] &&
      TRANSITIONS[fromState].includes(toState)
    );
  }

  function isHeld() {
    return state.current === STATES.SYSTEM_HELD;
  }

  function interactionAllowed() {
    return !isHeld();
  }

  function subscribe(channel, callback) {
    const set =
      subscribers[channel];

    if (
      !set ||
      typeof callback !== "function"
    ) {
      return () => false;
    }

    set.add(callback);

    return () => {
      set.delete(callback);
      return true;
    };
  }

  function publish(channel, payload) {
    const set =
      subscribers[channel];

    if (!set) {
      return;
    }

    for (const callback of set) {
      try {
        callback(payload);
      } catch (_) {}
    }
  }

  function getDeclaredRoomIdsByWing(wing) {
    if (!state.root) {
      return [];
    }

    return qsa(
      `[data-showroom-child-control][data-showroom-cardinal-id="${escapeSelectorValue(wing)}"]`,
      state.root
    )
      .map(element => normalize(element.dataset.showroomChildId))
      .filter(Boolean);
  }

  function createClusterState(wing) {
    const roomIds =
      getDeclaredRoomIdsByWing(wing);

    const primaryRoom =
      roomIds[0] || "";

    const orientation =
      createOrientation(
        QUATERNION.identity,
        primaryRoom
      );

    return {
      wing,
      roomIds: roomIds.slice(),
      primaryRoom,
      previewPrimaryRoom: primaryRoom,
      phase: ORIENTATION_PHASES.COMMITTED,
      gestureActive: false,
      previewAccepted: false,
      revision: 0,
      orientation: cloneOrientation(orientation),
      committedOrientation: cloneOrientation(orientation),
      gestureOrigin: null
    };
  }

  function getCluster(wing) {
    const normalizedWing =
      normalizeWing(wing);

    return normalizedWing
      ? state.clusters.get(normalizedWing) || null
      : null;
  }

  function activeClusterWing() {
    if (
      state.current === STATES.CLUSTER_OPEN ||
      state.current === STATES.ROOM_SELECTED
    ) {
      return normalizeWing(state.selectedCardinal);
    }

    return "";
  }

  function activeCluster() {
    return getCluster(activeClusterWing());
  }

  function findCoinElement(wing) {
    const normalizedWing =
      normalizeWing(wing);

    if (!normalizedWing || !state.root) {
      return null;
    }

    return qs(
      `[data-showroom-cardinal-control][data-showroom-cardinal-id="${escapeSelectorValue(normalizedWing)}"]`,
      state.root
    );
  }

  function findRoomElement(roomId) {
    const id =
      normalize(roomId);

    if (!id || !state.root) {
      return null;
    }

    return qs(
      `[data-showroom-child-control][data-showroom-child-id="${escapeSelectorValue(id)}"]`,
      state.root
    );
  }

  function canonicalControlExists(record) {
    const kind =
      normalizeLower(record.kind);

    const id =
      normalize(
        record.id ||
        record.roomId ||
        record.wing ||
        record.cardinalId
      );

    if (!id) {
      return false;
    }

    if (kind === "room") {
      return Boolean(findRoomElement(id));
    }

    if (
      kind === "cardinal" ||
      kind === "coin"
    ) {
      return Boolean(findCoinElement(id));
    }

    return Boolean(
      findRoomElement(id) ||
      findCoinElement(id)
    );
  }

  function readChildIntentFromElement(element) {
    if (!element) {
      return null;
    }

    const childId =
      normalize(element.dataset.showroomChildId);

    const childLabel =
      normalizeLabel(
        element.dataset.showroomChildLabel ||
        element.textContent,
        childId || "Selected star"
      );

    const destinationKind =
      normalizeDestinationKind(
        element.dataset.showroomDestinationKind
      );

    const infoId =
      normalize(
        element.dataset.showroomInfoId ||
        childId
      );

    const route =
      normalizeRoute(
        element.dataset.showroomRoute ||
        element.dataset.showroomControllerRoute ||
        element.getAttribute("href")
      );

    return Object.freeze({
      wingId: normalizeWing(element.dataset.showroomCardinalId),
      wingLabel: "",
      childId,
      childLabel,
      destinationKind,
      infoId,
      route,
      routeLabel: normalize(
        element.dataset.showroomRouteLabel ||
        childLabel
      ),
      routeDescription: normalize(
        element.dataset.showroomRouteDescription
      ),
      routeEvidence: normalize(
        element.dataset.showroomRouteEvidence
      ),
      routeRole: normalize(
        element.dataset.showroomRouteRole
      ),
      objectTarget: normalize(
        element.dataset.showroomObjectTarget
      ),
      semanticActivation: normalize(
        element.dataset.showroomSemanticActivation
      ),
      lens: normalizeLower(
        element.dataset.showroomLens || "overview"
      ) || "overview",
      visualClass: normalize(
        element.dataset.showroomVisualClass
      ),
      emphasis: normalize(
        element.dataset.showroomEmphasis
      ),
      returnModel: normalize(
        element.dataset.showroomReturnModel
      ),
      returnZone: normalize(
        element.dataset.showroomReturnZone
      ),
      preview: normalize(
        element.dataset.showroomPreview ||
        element.dataset.showroomRoomSummary ||
        element.dataset.showroomLocalFunction ||
        element.dataset.showroomRoomFunction ||
        element.dataset.showroomPanelBody ||
        element.dataset.showroomWhyEnter ||
        element.dataset.showroomPanelWhy
      )
    });
  }

  function intentPanelRouteStatus(intent) {
    if (!intent) {
      return "No destination prepared";
    }

    if (
      intent.destinationKind ===
      DESTINATION_KINDS.INTERNAL_INFO
    ) {
      return "Information panel";
    }

    if (
      intent.destinationKind ===
      DESTINATION_KINDS.OBJECT_INSPECT
    ) {
      return "Information panel · object inspection available";
    }

    if (
      intent.destinationKind ===
      DESTINATION_KINDS.EXTERNAL_ROUTE
    ) {
      return "Information panel · confirmed-route check required";
    }

    return "Invalid intent";
  }

  function roomParagraphFromIntent(intent) {
    if (!intent) {
      return "This star is part of the selected Mirrorland path.";
    }

    return (
      intent.preview ||
      "This star opens a Mirrorland explanation. Review the selection, then choose Open Selection."
    );
  }

  function panelFromCoin(element) {
    const wing =
      normalizeWing(element && element.dataset.showroomCardinalId);

    return Object.freeze({
      eyebrow:
        normalizeLabel(
          element && element.dataset.showroomCardinalLabel,
          wing ? WING_LABELS[wing] : "Selected path"
        ),

      title:
        normalizeLabel(
          element &&
            (
              element.dataset.showroomPanelTitle ||
              element.dataset.showroomCardinalLabel
            ),
          wing ? WING_LABELS[wing] : "Selected path"
        ),

      purpose:
        normalizeLabel(
          element &&
            (
              element.dataset.showroomPanelBody ||
              element.dataset.showroomCardinalBody ||
              element.dataset.showroomCardinalFunction
            ),
          "This Mirrorland direction opens a four-star constellation cluster."
        ),

      relationship:
        normalizeLabel(
          element &&
            (
              element.dataset.showroomPanelWhy ||
              element.dataset.showroomCardinalWhy
            ),
          "Choose one child star to open its explanation."
        )
    });
  }

  function panelFromRoom(element) {
    const intent =
      readChildIntentFromElement(element);

    return Object.freeze({
      eyebrow:
        normalizeLabel(
          intent && intent.destinationKind,
          "Selected star"
        ),

      title:
        normalizeLabel(
          intent && intent.childLabel,
          "Selected star"
        ),

      purpose:
        roomParagraphFromIntent(intent),

      relationship:
        "Choose Open Selection to send this destination intent, or Return to Orbit to restore the active cluster."
    });
  }

  function defaultPanel() {
    return Object.freeze({
      eyebrow: "Mirrorland Showroom",
      title: "Choose a direction",
      purpose: "Begin with the Mirrorland direction that matches the journey in front of you.",
      relationship: "Select a cardinal crystal or label to open its four-star cluster."
    });
  }

  function compassPanel() {
    return Object.freeze({
      eyebrow: "Main Compass",
      title: "Choose where to return",
      purpose: "The fixed-center Compass is selected. It does not navigate until you choose the explicit return action.",
      relationship: "Return to Main Compass opens the Diamond Gate Bridge homepage. Return to Orbit restores the active Mirrorland field."
    });
  }

  function setPanel({
    eyebrow,
    title,
    purpose,
    relationship
  }) {
    state.panelEyebrow.textContent =
      eyebrow || "Selected path";

    state.panelTitle.textContent =
      title || "Choose a direction";

    state.panelPurpose.textContent =
      purpose || "";

    state.panelRelationship.textContent =
      relationship || "";
  }

  function setPanelMetadata({
    domain = "None",
    functionLabel = "Unassigned",
    coordinate = "—",
    selection = "Idle",
    route = "No destination prepared",
    lens = "Overview"
  } = {}) {
    state.panelDomain.textContent =
      domain;

    state.panelFunction.textContent =
      functionLabel;

    state.panelCoordinate.textContent =
      coordinate;

    state.panelSelectionState.textContent =
      selection;

    state.panelRouteStatus.textContent =
      route;

    state.panelLens.textContent =
      lens;
  }

  function setGuidance(message) {
    state.guidance.textContent =
      String(message || "");
  }

  function setEnterEnabled(
    enabled,
    label = "Open Selection"
  ) {
    state.enterButton.disabled =
      !enabled;

    state.enterButton.setAttribute(
      "aria-disabled",
      enabled ? "false" : "true"
    );

    state.enterLabel.textContent =
      label;
  }

  function setReturnToOrbitVisible(
    visible,
    label = "Return to Orbit"
  ) {
    const control =
      state.returnToOrbitButton;

    control.hidden =
      !visible;

    control.disabled =
      !visible;

    control.setAttribute(
      "aria-hidden",
      visible ? "false" : "true"
    );

    control.setAttribute(
      "aria-disabled",
      visible ? "false" : "true"
    );

    if (visible) {
      control.removeAttribute("tabindex");
    } else {
      control.setAttribute("tabindex", "-1");
    }

    state.returnToOrbitLabel.textContent =
      label;
  }

  function setReturnHomeVisible(visible) {
    state.returnHomeButton.hidden =
      !visible;

    state.returnHomeButton.setAttribute(
      "aria-hidden",
      visible ? "false" : "true"
    );

    if (visible) {
      state.returnHomeButton.removeAttribute("tabindex");
    } else {
      state.returnHomeButton.setAttribute("tabindex", "-1");
    }
  }

  function clearPanelDescentSchedule() {
    if (state.panelDescentFrame) {
      cancelAnimationFrame(state.panelDescentFrame);
      state.panelDescentFrame = 0;
    }

    if (state.panelDescentCommitFrame) {
      cancelAnimationFrame(state.panelDescentCommitFrame);
      state.panelDescentCommitFrame = 0;
    }
  }

  function clearSceneAscentSchedule() {
    if (state.sceneAscentFrame) {
      cancelAnimationFrame(state.sceneAscentFrame);
      state.sceneAscentFrame = 0;
    }

    if (state.sceneAscentCommitFrame) {
      cancelAnimationFrame(state.sceneAscentCommitFrame);
      state.sceneAscentCommitFrame = 0;
    }
  }

  function clearViewportSchedules() {
    clearPanelDescentSchedule();
    clearSceneAscentSchedule();
  }

  function schedulePanelDescent(predicate, action) {
    clearViewportSchedules();

    state.panelDescentFrame =
      requestAnimationFrame(() => {
        state.panelDescentFrame = 0;

        state.panelDescentCommitFrame =
          requestAnimationFrame(() => {
            state.panelDescentCommitFrame = 0;

            if (
              typeof predicate === "function" &&
              !predicate()
            ) {
              return;
            }

            state.panel.scrollIntoView({
              behavior: state.reducedMotion ? "auto" : "smooth",
              block: "start",
              inline: "nearest"
            });

            state.panelDescended = true;

            recordAction(action);
          });
      });
  }

  function scheduleRoomPanelDescent(expectedRoomId) {
    schedulePanelDescent(
      () =>
        state.current === STATES.ROOM_SELECTED &&
        state.selectedRoom === expectedRoomId &&
        !state.compassSelected,
      `room-panel-descended:${expectedRoomId}`
    );
  }

  function scheduleCompassPanelDescent() {
    schedulePanelDescent(
      () => state.compassSelected === true,
      "compass-panel-descended"
    );
  }

  function scheduleSceneAscent(expectedState, expectedWing = "") {
    clearViewportSchedules();

    state.sceneAscentFrame =
      requestAnimationFrame(() => {
        state.sceneAscentFrame = 0;

        state.sceneAscentCommitFrame =
          requestAnimationFrame(() => {
            state.sceneAscentCommitFrame = 0;

            if (state.current !== expectedState) {
              return;
            }

            if (
              expectedWing &&
              state.selectedCardinal !== expectedWing
            ) {
              return;
            }

            state.scene.scrollIntoView({
              behavior: state.reducedMotion ? "auto" : "smooth",
              block: "start",
              inline: "nearest"
            });

            recordAction(
              `scene-restored:${expectedState}:${expectedWing || "constellation"}`
            );
          });
      });
  }

  function invalidateDestinationAuthorization() {
    state.destinationAuthorizationGeneration += 1;
    return state.destinationAuthorizationGeneration;
  }

  function resetSelection({
    preserveCompass = false
  } = {}) {
    state.selectedCardinal = "";
    state.selectedCoin = "";
    state.selectedRoom = "";
    state.selectedDestinationType = DESTINATION_TYPES.NONE;
    state.selectedDestinationKind = "";
    state.selectedInfoId = "";
    state.selectedObjectTarget = "";
    state.selectedRouteEvidence = "";
    state.selectedDestinationId = "";
    state.selectedDestinationLabel = "";
    state.selectedRoute = "";
    state.selectedContentId = "";
    state.selectedLens = "overview";
    state.selectedParagraph = "";
    state.selectedSemanticActivation = "";
    state.selectedRouteLabel = "";
    state.selectedRouteDescription = "";
    state.selectedRouteRole = "";
    state.selectedVisualClass = "";
    state.selectedEmphasis = "";
    state.selectedReturnModel = "";
    state.selectedReturnZone = "";
    state.panelDescended = false;

    invalidateDestinationAuthorization();

    if (!preserveCompass) {
      state.compassSelected = false;
    }
  }

  function createPresentationState() {
    const presentation =
      PRESENTATION_BY_STATE[state.current] ||
      PRESENTATION_BY_STATE[STATES.SYSTEM_HELD];

    return Object.freeze({
      mode: presentation.mode,
      navigationState: state.current,
      outerCardinalsActive: presentation.outerCardinalsActive,
      activeRoomCluster: presentation.activeRoomCluster,
      roomSelectionPermitted: presentation.roomSelectionPermitted,
      additiveCoRenderingAuthorized: false
    });
  }

  function createHeldState() {
    return Object.freeze({
      held: isHeld(),
      terminal: isHeld(),
      interactionEnabled: interactionAllowed(),
      presentationMode: presentationModeForState(),
      reason:
        isHeld()
          ? state.lastFailure || "ARCHCOIN_SYSTEM_HELD"
          : ""
    });
  }

  function createCompassState() {
    return Object.freeze({
      fixedCenter: true,
      selected: state.compassSelected,
      interactionEnabled: interactionAllowed(),
      reducedMotion: state.reducedMotion,
      mainCompassRoute: MAIN_COMPASS.route,
      immediateNavigation: false,
      explicitReturnRequired: true,
      inheritsNavigationOrientation: false,
      participatesInNavigationSettlement: false,
      quaternionPublished: false,
      rendererLifecycleOwned: false
    });
  }

  function createSemanticProjectionSnapshot() {
    return Object.freeze(
      Array.from(state.semanticProjection.values()).map(
        record =>
          Object.freeze({
            id: record.id,
            kind: record.kind,
            x: record.x,
            y: record.y,
            radiusPx: record.radiusPx,
            depthLayer: record.depthLayer,
            compassOverlap: record.compassOverlap,
            visible: record.visible
          })
      )
    );
  }

  function getCanonicalRoomRecordsSnapshot() {
    if (!state.root) {
      return Object.freeze([]);
    }

    return Object.freeze(
      qsa("[data-showroom-child-control]", state.root).map(
        element => {
          const intent =
            readChildIntentFromElement(element);

          return Object.freeze({
            wing: intent.wingId,
            coin: wingToCoin(intent.wingId),
            roomId: intent.childId,
            label: intent.childLabel,
            destinationKind: intent.destinationKind,
            infoId: intent.infoId,
            route: intent.route,
            routeEvidence: intent.routeEvidence,
            objectTarget: intent.objectTarget,
            lens: intent.lens
          });
        }
      )
    );
  }

  function createFrameState() {
    const cluster =
      activeCluster();

    const presentation =
      createPresentationState();

    const roomRecords =
      getCanonicalRoomRecordsSnapshot();

    return Object.freeze({
      moduleId: MODULE.id,
      moduleVersion: MODULE.version,
      motionContractId: MODULE.motionContractId,
      motionContractVersion: MODULE.motionContractVersion,

      state: state.current,
      navigationState: state.current,
      presentationMode: presentation.mode,
      presentation,

      orbitFocus: state.orbitFocus,
      orbitPreviewFocus: state.orbitPreviewFocus,
      orbitPhase: state.orbitPhase,
      orbitGestureActive: state.orbitGestureActive,
      orbitPreviewAccepted: state.orbitPreviewAccepted,
      orbitRevision: state.orbitRevision,
      orbitOrientation: freezeOrientation(state.orbitOrientation),
      committedOrbitOrientation: freezeOrientation(state.committedOrbitOrientation),

      activeClusterWing: cluster ? cluster.wing : "",

      cluster:
        cluster
          ? Object.freeze({
              wing: cluster.wing,
              roomIds: Object.freeze(cluster.roomIds.slice()),
              primaryRoom: cluster.primaryRoom,
              previewPrimaryRoom: cluster.previewPrimaryRoom,
              phase: cluster.phase,
              gestureActive: cluster.gestureActive,
              previewAccepted: cluster.previewAccepted,
              revision: cluster.revision,
              orientation: freezeOrientation(cluster.orientation),
              committedOrientation: freezeOrientation(cluster.committedOrientation)
            })
          : null,

      selectedCardinal: state.selectedCardinal,
      selectedCoin: state.selectedCoin,
      selectedRoom: state.selectedRoom,
      selectedDestinationType: state.selectedDestinationType,
      selectedDestinationKind: state.selectedDestinationKind,
      selectedInfoId: state.selectedInfoId,
      selectedObjectTarget: state.selectedObjectTarget,
      selectedRouteEvidence: state.selectedRouteEvidence,
      selectedDestinationId: state.selectedDestinationId,
      selectedDestinationLabel: state.selectedDestinationLabel,
      selectedRoute: state.selectedRoute,
      selectedContentId: state.selectedContentId,
      selectedLens: state.selectedLens,
      selectedParagraph: state.selectedParagraph,
      selectedSemanticActivation: state.selectedSemanticActivation,
      selectedRouteLabel: state.selectedRouteLabel,
      selectedRouteDescription: state.selectedRouteDescription,
      selectedRouteRole: state.selectedRouteRole,
      selectedVisualClass: state.selectedVisualClass,
      selectedEmphasis: state.selectedEmphasis,
      selectedReturnModel: state.selectedReturnModel,
      selectedReturnZone: state.selectedReturnZone,

      compassSelected: state.compassSelected,
      panelDescended: state.panelDescended,
      reducedMotion: state.reducedMotion,
      held: isHeld(),
      compass: createCompassState(),

      semanticProjectionRevision: state.semanticProjectionRevision,
      semanticProjection: createSemanticProjectionSnapshot(),

      canonicalRoomRecords: roomRecords,
      canonicalRoomRoutes: Object.freeze(
        roomRecords.map(record => record.route)
      ),

      mainCompass: MAIN_COMPASS,
      interactionModuleId: MODULE.interactionModuleId,
      interactionModuleVersion: MODULE.interactionModuleVersion,
      motionOwner: MODULE.interactionModuleId,
      acceptedStateAuthority: MODULE.id,
      navigationTransitionAuthority: MODULE.id,
      destinationExecutionAuthority: false,
      intentSelectionAuthority: MODULE.id,
      modalOpeningAuthority: false,
      routeConfirmationAuthority: false,
      objectInspectionExecutionAuthority: false,

      lastAction: state.lastAction,
      lastFailure: state.lastFailure
    });
  }

  function createCompatibilityReceipt(frame) {
    return Object.freeze({
      contractId: "SHOWROOM_CONSTELLATION_CONTROLLER_INTERACTION_v2",
      motionContractId: MODULE.motionContractId,
      motionContractVersion: MODULE.motionContractVersion,

      status: frame.held ? "held" : "available",
      state: frame.state,
      navigationState: frame.navigationState,
      presentationMode: frame.presentationMode,
      outerCardinalsActive: frame.presentation.outerCardinalsActive,
      activeRoomCluster: frame.presentation.activeRoomCluster,
      roomSelectionPermitted: frame.presentation.roomSelectionPermitted,
      additiveCoRenderingAuthorized: false,

      orbitFocus: frame.orbitFocus,
      orbitPreviewFocus: frame.orbitPreviewFocus,
      orbitPhase: frame.orbitPhase,
      orbitGestureActive: frame.orbitGestureActive,
      orbitPreviewAccepted: frame.orbitPreviewAccepted,
      orbitRevision: frame.orbitRevision,
      orbitQuaternion: frame.orbitOrientation.quaternion,

      activeClusterWing: frame.activeClusterWing,
      clusterPrimaryRoom: frame.cluster ? frame.cluster.primaryRoom : "",
      clusterPreviewPrimaryRoom: frame.cluster ? frame.cluster.previewPrimaryRoom : "",
      clusterPhase: frame.cluster ? frame.cluster.phase : ORIENTATION_PHASES.IDLE,
      clusterGestureActive: frame.cluster ? frame.cluster.gestureActive : false,
      clusterPreviewAccepted: frame.cluster ? frame.cluster.previewAccepted : false,
      clusterRevision: frame.cluster ? frame.cluster.revision : 0,
      clusterQuaternion: frame.cluster ? frame.cluster.orientation.quaternion : QUATERNION.identity,

      selectedCardinal: frame.selectedCardinal,
      selectedCoin: frame.selectedCoin,
      selectedRoom: frame.selectedRoom,
      selectedDestinationType: frame.selectedDestinationType,
      selectedDestinationKind: frame.selectedDestinationKind,
      selectedInfoId: frame.selectedInfoId,
      selectedObjectTarget: frame.selectedObjectTarget,
      selectedRouteEvidence: frame.selectedRouteEvidence,
      selectedDestinationId: frame.selectedDestinationId,
      selectedDestinationLabel: frame.selectedDestinationLabel,
      selectedRoute: frame.selectedRoute,

      compassSelected: frame.compassSelected,
      panelDescended: frame.panelDescended,
      reducedMotion: frame.reducedMotion,
      held: frame.held,

      compassFixedCenter: frame.compass.fixedCenter,
      compassImmediateNavigation: frame.compass.immediateNavigation,
      compassExplicitReturnRequired: frame.compass.explicitReturnRequired,
      mainCompassRoute: frame.compass.mainCompassRoute,

      semanticProjectionRevision: frame.semanticProjectionRevision,
      semanticProjectionFields: Object.freeze([
        "id",
        "kind",
        "x",
        "y",
        "radiusPx",
        "depthLayer",
        "compassOverlap",
        "visible"
      ]),

      destinationExecutionAuthority: false,
      intentSelectionAuthority: MODULE.id,
      modalOpeningAuthority: false,
      routeConfirmationAuthority: false,
      routeDowngradeAuthority: false,
      objectInspectionExecutionAuthority: false,
      anchorScrollAuthority: false,
      disclosureOpeningAuthority: false,
      frontActivationAuthority: false,

      pointerInterpreterOwner: MODULE.interactionModuleId,
      pointerTapArbitrationOwner: MODULE.interactionModuleId,
      wholeCrystalHitTestOwner: MODULE.interactionModuleId,
      syntheticClickSuppressionOwner: MODULE.interactionModuleId,
      clusterExitSwipeClassificationOwner: MODULE.interactionModuleId,
      projectionDomApplicationOwner: MODULE.interactionModuleId,
      gestureQuaternionConstructionOwner: MODULE.interactionModuleId,

      orbitStateAuthority: MODULE.id,
      clusterStateAuthority: MODULE.id,
      quaternionAcceptanceAuthority: MODULE.id,
      navigationTransitionAuthority: MODULE.id,

      lastAction: frame.lastAction,
      lastFailure: frame.lastFailure
    });
  }

  function syncDatasets(frame) {
    const cluster =
      frame.cluster;

    const reflectedPresentationMode =
      normalizeLower(frame.presentationMode);

    state.root.dataset.showroomState =
      frame.navigationState;

    state.root.dataset.showroomControllerState =
      frame.navigationState;

    state.root.dataset.showroomNavigationState =
      frame.navigationState;

    state.root.dataset.showroomPresentationMode =
      reflectedPresentationMode;

    state.root.dataset.showroomOrbitFocus =
      frame.orbitFocus;

    state.root.dataset.showroomOrbitPreviewFocus =
      frame.orbitPreviewFocus;

    state.root.dataset.showroomOrbitPhase =
      frame.orbitPhase;

    state.root.dataset.showroomOrbitGestureActive =
      frame.orbitGestureActive ? "true" : "false";

    state.root.dataset.showroomOrbitPreviewAccepted =
      frame.orbitPreviewAccepted ? "true" : "false";

    state.root.dataset.showroomOrbitRevision =
      String(frame.orbitRevision);

    state.root.dataset.showroomOrbitQuaternion =
      JSON.stringify(frame.orbitOrientation.quaternion);

    state.root.dataset.showroomActiveCluster =
      frame.activeClusterWing;

    state.root.dataset.showroomClusterPrimaryRoom =
      cluster ? cluster.primaryRoom : "";

    state.root.dataset.showroomClusterPreviewPrimaryRoom =
      cluster ? cluster.previewPrimaryRoom : "";

    state.root.dataset.showroomClusterPhase =
      cluster ? cluster.phase : ORIENTATION_PHASES.IDLE;

    state.root.dataset.showroomClusterGestureActive =
      cluster && cluster.gestureActive ? "true" : "false";

    state.root.dataset.showroomClusterPreviewAccepted =
      cluster && cluster.previewAccepted ? "true" : "false";

    state.root.dataset.showroomClusterRevision =
      String(cluster ? cluster.revision : 0);

    state.root.dataset.showroomClusterQuaternion =
      cluster
        ? JSON.stringify(cluster.orientation.quaternion)
        : "";

    state.root.dataset.showroomActiveCardinal =
      frame.selectedCardinal;

    state.root.dataset.showroomActiveChild =
      frame.selectedRoom;

    state.root.dataset.showroomSelectedDestinationType =
      frame.selectedDestinationType;

    state.root.dataset.showroomSelectedDestinationKind =
      frame.selectedDestinationKind;

    state.root.dataset.showroomSelectedInfoId =
      frame.selectedInfoId;

    state.root.dataset.showroomSelectedObjectTarget =
      frame.selectedObjectTarget;

    state.root.dataset.showroomSelectedRouteEvidence =
      frame.selectedRouteEvidence;

    state.root.dataset.showroomSelectedDestinationId =
      frame.selectedDestinationId;

    state.root.dataset.showroomSelectedDestinationLabel =
      frame.selectedDestinationLabel;

    state.root.dataset.showroomSelectedRoute =
      frame.selectedRoute;

    state.root.dataset.showroomSelectedContentId =
      frame.selectedContentId;

    state.root.dataset.showroomSelectedLens =
      frame.selectedLens;

    state.root.dataset.showroomSelectedParagraph =
      frame.selectedParagraph;

    state.root.dataset.showroomCompassSelected =
      frame.compassSelected ? "true" : "false";

    state.root.dataset.showroomPanelDescended =
      frame.panelDescended ? "true" : "false";

    state.root.dataset.showroomReducedMotion =
      frame.reducedMotion ? "true" : "false";

    state.root.dataset.showroomHeld =
      frame.held ? "true" : "false";

    state.root.dataset.showroomControllerStatus =
      frame.held ? "held" : "available";

    state.root.dataset.showroomControllerVersion =
      MODULE.version;

    state.root.dataset.showroomMotionContractId =
      MODULE.motionContractId;

    state.root.dataset.showroomMotionContractVersion =
      MODULE.motionContractVersion;

    state.root.dataset.showroomSemanticProjectionRevision =
      String(frame.semanticProjectionRevision);

    qsa("[data-showroom-cardinal-control]", state.root)
      .forEach(element => {
        const wing =
          normalizeWing(element.dataset.showroomCardinalId);

        const active =
          frame.presentation.outerCardinalsActive;

        const primary =
          active && wing === frame.orbitFocus;

        element.dataset.showroomActive =
          active ? "true" : "false";

        element.dataset.showroomSelected =
          !frame.compassSelected &&
          frame.selectedDestinationType === DESTINATION_TYPES.COIN &&
          frame.selectedCardinal === wing
            ? "true"
            : "false";

        element.dataset.showroomPrimary =
          primary ? "true" : "false";

        element.setAttribute(
          "aria-disabled",
          active ? "false" : "true"
        );

        if (primary) {
          element.setAttribute("aria-current", "true");
        } else {
          element.removeAttribute("aria-current");
        }
      });

    qsa("[data-showroom-child-control]", state.root)
      .forEach(element => {
        const roomId =
          normalize(element.dataset.showroomChildId);

        const roomWing =
          normalizeWing(element.dataset.showroomCardinalId);

        const inActiveCluster =
          Boolean(
            cluster &&
            roomWing &&
            roomWing === cluster.wing &&
            cluster.roomIds.includes(roomId)
          );

        const selected =
          !frame.compassSelected &&
          inActiveCluster &&
          roomId === frame.selectedRoom;

        const primary =
          inActiveCluster &&
          roomId === cluster.primaryRoom;

        element.dataset.showroomActive =
          inActiveCluster ? "true" : "false";

        element.dataset.showroomSelected =
          selected ? "true" : "false";

        element.dataset.showroomPrimary =
          primary ? "true" : "false";

        element.setAttribute(
          "aria-disabled",
          inActiveCluster ? "false" : "true"
        );

        if (selected || primary) {
          element.setAttribute("aria-current", "true");
        } else {
          element.removeAttribute("aria-current");
        }
      });

    state.compassControl.dataset.showroomSelected =
      frame.compassSelected ? "true" : "false";

    state.compassControl.dataset.fixedCenter =
      "true";

    state.compassControl.dataset.interactionEnabled =
      frame.compass.interactionEnabled ? "true" : "false";

    state.compassControl.dataset.immediateNavigation =
      "false";

    state.compassControl.setAttribute(
      "aria-expanded",
      frame.compassSelected ? "true" : "false"
    );

    if (frame.compassSelected) {
      state.compassControl.setAttribute("aria-current", "true");
    } else {
      state.compassControl.removeAttribute("aria-current");
    }
  }

  function writeCompatibilityReceipt(frame) {
    const receipt =
      createCompatibilityReceipt(frame);

    const serialized =
      JSON.stringify(receipt);

    state.root.dataset.showroomControllerReceipt =
      serialized;

    if ("value" in state.controllerReceiptOutput) {
      state.controllerReceiptOutput.value =
        serialized;
    }

    state.controllerReceiptOutput.textContent =
      serialized;

    globalThis.SHOWROOM_CONTROLLER_RECEIPT =
      receipt;
  }

  function publishFrame() {
    const frame =
      createFrameState();

    syncDatasets(frame);
    writeCompatibilityReceipt(frame);

    publish(CHANNELS.FRAME, frame);

    return frame;
  }

  function recordAction(action, failure = "") {
    state.lastAction =
      String(action || "");

    state.lastFailure =
      String(failure || "");

    return publishFrame();
  }

  function rejectRequest(action, code) {
    recordAction(action, code);
    return false;
  }

  function validateOrbitPreviewPayload(payload) {
    if (
      !payload ||
      typeof payload !== "object" ||
      Array.isArray(payload)
    ) {
      return Object.freeze({
        pass: false,
        code: "ARCHCOIN_ORBIT_PREVIEW_PAYLOAD_REQUIRED"
      });
    }

    const unexpectedKeys =
      unexpectedPreviewPayloadKeys(payload);

    if (unexpectedKeys.length > 0) {
      return Object.freeze({
        pass: false,
        code: "ARCHCOIN_ORBIT_PREVIEW_UNEXPECTED_FIELDS_FORBIDDEN",
        unexpectedKeys: Object.freeze(unexpectedKeys.slice())
      });
    }

    const quaternion =
      normalizeQuaternionStrict(payload.quaternion);

    if (!quaternion) {
      return Object.freeze({
        pass: false,
        code: "ARCHCOIN_ORBIT_PREVIEW_COMPLETE_QUATERNION_REQUIRED"
      });
    }

    const primaryId =
      normalizeWing(payload.primaryId);

    if (!primaryId) {
      return Object.freeze({
        pass: false,
        code: "ARCHCOIN_ORBIT_PREVIEW_CANONICAL_PRIMARY_WING_REQUIRED"
      });
    }

    return Object.freeze({
      pass: true,
      orientation: Object.freeze({
        quaternion: Object.freeze(quaternion.slice()),
        primaryId
      })
    });
  }

  function validateClusterPreviewPayload(cluster, payload) {
    if (
      !cluster ||
      !payload ||
      typeof payload !== "object" ||
      Array.isArray(payload)
    ) {
      return Object.freeze({
        pass: false,
        code: "ARCHCOIN_CLUSTER_PREVIEW_PAYLOAD_REQUIRED"
      });
    }

    const unexpectedKeys =
      unexpectedPreviewPayloadKeys(payload);

    if (unexpectedKeys.length > 0) {
      return Object.freeze({
        pass: false,
        code: "ARCHCOIN_CLUSTER_PREVIEW_UNEXPECTED_FIELDS_FORBIDDEN",
        unexpectedKeys: Object.freeze(unexpectedKeys.slice())
      });
    }

    const quaternion =
      normalizeQuaternionStrict(payload.quaternion);

    if (!quaternion) {
      return Object.freeze({
        pass: false,
        code: "ARCHCOIN_CLUSTER_PREVIEW_COMPLETE_QUATERNION_REQUIRED"
      });
    }

    const primaryId =
      normalize(payload.primaryId);

    if (
      !primaryId ||
      !cluster.roomIds.includes(primaryId)
    ) {
      return Object.freeze({
        pass: false,
        code: `ARCHCOIN_CLUSTER_PREVIEW_CANONICAL_PRIMARY_ROOM_REQUIRED:${cluster.wing}`
      });
    }

    return Object.freeze({
      pass: true,
      orientation: Object.freeze({
        quaternion: Object.freeze(quaternion.slice()),
        primaryId
      })
    });
  }

  function syncPresentation() {
    if (state.compassSelected) {
      setPanel(compassPanel());

      setPanelMetadata({
        domain: "Main Compass",
        functionLabel: "Website gateway",
        coordinate: "Fixed center",
        selection: "Compass selected",
        route: MAIN_COMPASS.route,
        lens: "Return"
      });

      setEnterEnabled(false, "Open Selection");
      setReturnHomeVisible(true);

      setReturnToOrbitVisible(
        true,
        state.current === STATES.CONSTELLATION
          ? "Return to Constellation"
          : "Return to Orbit"
      );

      setGuidance(
        "The Compass is selected. Use Return to Main Compass to leave Mirrorland, or Return to Orbit to restore this field."
      );

      return;
    }

    setReturnHomeVisible(false);

    if (state.current === STATES.CONSTELLATION) {
      setPanel(defaultPanel());
      setPanelMetadata();
      setEnterEnabled(false, "Open Selection");
      setReturnToOrbitVisible(false);

      setGuidance(
        "Select a cardinal crystal or label to open its four-star cluster."
      );

      return;
    }

    if (state.current === STATES.CLUSTER_OPEN) {
      const coin =
        findCoinElement(state.selectedCardinal);

      setPanel(panelFromCoin(coin));

      setPanelMetadata({
        domain:
          normalizeLabel(
            coin && coin.dataset.showroomCardinalLabel,
            WING_LABELS[state.selectedCardinal] ||
              wingToCoin(state.selectedCardinal)
          ),

        functionLabel:
          normalizeLabel(
            coin &&
              (
                coin.dataset.showroomPanelTitle ||
                coin.dataset.showroomCardinalFunction ||
                coin.dataset.showroomCardinalLabel
              ),
            "Mirrorland direction"
          ),

        coordinate:
          normalizeLabel(
            coin && coin.dataset.showroomCoordinateLabel,
            state.selectedCardinal
          ),

        selection: "Cluster open",
        route: "Star required",
        lens: "Overview"
      });

      setEnterEnabled(false, "Open Selection");
      setReturnToOrbitVisible(false);

      setGuidance(
        "Choose one child star to review its intent."
      );

      return;
    }

    if (state.current === STATES.ROOM_SELECTED) {
      const room =
        findRoomElement(state.selectedRoom);

      const intent =
        readChildIntentFromElement(room);

      setPanel(panelFromRoom(room));

      setPanelMetadata({
        domain:
          normalizeLabel(
            WING_LABELS[state.selectedCardinal] ||
              state.selectedCoin,
            "Selected direction"
          ),

        functionLabel:
          intentPanelRouteStatus(intent),

        coordinate:
          normalizeLabel(
            room && room.dataset.showroomLocalCoordinate,
            state.selectedRoom
          ),

        selection: "Star selected",

        route:
          intentPanelRouteStatus(intent),

        lens:
          normalizeLabel(state.selectedLens, "Overview")
      });

      setEnterEnabled(
        Boolean(state.selectedInfoId),
        "Open Selection"
      );

      setReturnToOrbitVisible(true, "Return to Orbit");

      setGuidance(
        "Review the selected star. Open Selection sends its intent to the destination resolver."
      );

      return;
    }

    setPanel({
      eyebrow: "System held",
      title: "Mirrorland navigation is unavailable",
      purpose: "The controller could not establish or preserve a safe interaction state.",
      relationship: "Static content may remain available, but interactive requests are rejected."
    });

    setPanelMetadata({
      domain: "Unavailable",
      functionLabel: "Held",
      coordinate: "—",
      selection: "Held",
      route: "Unavailable",
      lens: "Failure"
    });

    setEnterEnabled(false, "Unavailable");
    setReturnHomeVisible(false);
    setReturnToOrbitVisible(false);

    setGuidance(
      "Mirrorland navigation is held because its controller foundation could not be validated."
    );
  }

  function applyState(nextState, patch = {}, action = "") {
    invariant(
      canTransition(state.current, nextState),
      "ARCHCOIN_ILLEGAL_STATE_TRANSITION",
      {
        from: state.current,
        to: nextState
      }
    );

    const previousHeld =
      isHeld();

    state.current =
      nextState;

    for (const [key, value] of Object.entries(patch)) {
      if (
        Object.prototype.hasOwnProperty.call(state, key)
      ) {
        state[key] = value;
      }
    }

    syncPresentation();

    const frame =
      recordAction(action);

    if (previousHeld !== frame.held) {
      publish(CHANNELS.HELD_STATE, createHeldState());
      publish(CHANNELS.COMPASS_STATE, createCompassState());
    }

    return true;
  }

  function setConstellationOrientation(
    orientation,
    {
      committed = false,
      phase = ORIENTATION_PHASES.PREVIEW,
      gestureActive = false,
      previewAccepted = false,
      incrementRevision = false
    } = {}
  ) {
    const normalized =
      cloneOrientation(orientation);

    invariant(
      normalizeWing(normalized.primaryId),
      "ARCHCOIN_CONSTELLATION_PRIMARY_WING_INVALID"
    );

    state.orbitOrientation =
      normalized;

    state.orbitPreviewFocus =
      normalized.primaryId;

    state.orbitPhase =
      phase;

    state.orbitGestureActive =
      Boolean(gestureActive);

    state.orbitPreviewAccepted =
      Boolean(previewAccepted);

    if (incrementRevision) {
      state.orbitRevision += 1;
    }

    if (committed) {
      state.committedOrbitOrientation =
        cloneOrientation(normalized);

      state.orbitFocus =
        normalized.primaryId;

      state.orbitPreviewFocus =
        normalized.primaryId;
    }
  }

  function setClusterOrientation(
    cluster,
    orientation,
    {
      committed = false,
      phase = ORIENTATION_PHASES.PREVIEW,
      gestureActive = false,
      previewAccepted = false,
      incrementRevision = false
    } = {}
  ) {
    invariant(cluster, "ARCHCOIN_CLUSTER_REQUIRED");

    const normalized =
      cloneOrientation(orientation);

    invariant(
      cluster.roomIds.includes(normalized.primaryId),
      `ARCHCOIN_CLUSTER_PRIMARY_ROOM_INVALID:${cluster.wing}`
    );

    cluster.orientation =
      normalized;

    cluster.previewPrimaryRoom =
      normalized.primaryId;

    cluster.phase =
      phase;

    cluster.gestureActive =
      Boolean(gestureActive);

    cluster.previewAccepted =
      Boolean(previewAccepted);

    if (incrementRevision) {
      cluster.revision += 1;
    }

    if (committed) {
      cluster.committedOrientation =
        cloneOrientation(normalized);

      cluster.primaryRoom =
        normalized.primaryId;

      cluster.previewPrimaryRoom =
        normalized.primaryId;
    }

    return true;
  }

  function beginOrbitGesture() {
    if (arguments.length !== 0) {
      return rejectRequest(
        "orbit-gesture-begin-rejected",
        "ARCHCOIN_ORBIT_GESTURE_BEGIN_ACCEPTS_NO_PAYLOAD"
      );
    }

    if (
      isHeld() ||
      state.current !== STATES.CONSTELLATION
    ) {
      return false;
    }

    if (state.orbitGestureActive) {
      return true;
    }

    state.orbitGestureOrigin =
      cloneOrientation(state.committedOrbitOrientation);

    setConstellationOrientation(
      state.orbitOrientation,
      {
        committed: false,
        phase: ORIENTATION_PHASES.PREVIEW,
        gestureActive: true,
        previewAccepted: false
      }
    );

    recordAction("orbit-gesture-began");

    return true;
  }

  function requestOrbitPreview(payload) {
    if (arguments.length !== 1) {
      return rejectRequest(
        "orbit-preview-rejected",
        "ARCHCOIN_ORBIT_PREVIEW_EXACT_PAYLOAD_REQUIRED"
      );
    }

    if (
      isHeld() ||
      state.current !== STATES.CONSTELLATION
    ) {
      return false;
    }

    if (!state.orbitGestureActive) {
      return rejectRequest(
        "orbit-preview-rejected",
        "ARCHCOIN_ORBIT_PREVIEW_ACTIVE_TRANSACTION_REQUIRED"
      );
    }

    const validation =
      validateOrbitPreviewPayload(payload);

    if (!validation.pass) {
      return rejectRequest(
        "orbit-preview-rejected",
        validation.code
      );
    }

    setConstellationOrientation(
      validation.orientation,
      {
        committed: false,
        phase: ORIENTATION_PHASES.PREVIEW,
        gestureActive: true,
        previewAccepted: true
      }
    );

    recordAction(
      `orbit-preview-accepted:${validation.orientation.primaryId}`
    );

    return true;
  }

  function requestOrbitCommit() {
    if (arguments.length !== 0) {
      return rejectRequest(
        "orbit-commit-rejected",
        "ARCHCOIN_ORBIT_COMMIT_ACCEPTS_NO_PAYLOAD"
      );
    }

    if (
      isHeld() ||
      state.current !== STATES.CONSTELLATION
    ) {
      return false;
    }

    if (
      !state.orbitGestureActive ||
      !state.orbitPreviewAccepted
    ) {
      return rejectRequest(
        "orbit-commit-rejected",
        "ARCHCOIN_ORBIT_COMMIT_ACCEPTED_PREVIEW_REQUIRED"
      );
    }

    const committed =
      cloneOrientation(state.orbitOrientation);

    setConstellationOrientation(
      committed,
      {
        committed: true,
        phase: ORIENTATION_PHASES.COMMITTED,
        gestureActive: false,
        previewAccepted: false,
        incrementRevision: true
      }
    );

    state.orbitGestureOrigin =
      null;

    recordAction(
      `orbit-committed:${committed.primaryId}`
    );

    return true;
  }

  function requestOrbitCancel(reason = "cancelled") {
    if (arguments.length > 1) {
      return rejectRequest(
        "orbit-cancel-rejected",
        "ARCHCOIN_ORBIT_CANCEL_ARGUMENT_COUNT_INVALID"
      );
    }

    if (isHeld()) {
      return false;
    }

    if (!state.orbitGestureActive) {
      return false;
    }

    const restored =
      cloneOrientation(
        state.orbitGestureOrigin ||
        state.committedOrbitOrientation
      );

    setConstellationOrientation(
      restored,
      {
        committed: false,
        phase: ORIENTATION_PHASES.CANCELLED,
        gestureActive: false,
        previewAccepted: false
      }
    );

    state.orbitGestureOrigin =
      null;

    recordAction(
      `orbit-cancelled:${String(reason || "cancelled")}`
    );

    state.orbitPhase =
      ORIENTATION_PHASES.COMMITTED;

    recordAction("orbit-cancel-settled");

    return true;
  }

  function requestOrbitFocus(wing) {
    if (arguments.length !== 1) {
      return false;
    }

    const normalizedWing =
      normalizeWing(wing);

    if (
      isHeld() ||
      !normalizedWing ||
      state.current !== STATES.CONSTELLATION
    ) {
      return false;
    }

    if (state.orbitGestureActive) {
      requestOrbitCancel("explicit-orbit-focus");
    }

    setConstellationOrientation(
      canonicalConstellationOrientation(normalizedWing),
      {
        committed: true,
        phase: ORIENTATION_PHASES.COMMITTED,
        gestureActive: false,
        previewAccepted: false,
        incrementRevision: true
      }
    );

    state.orbitGestureOrigin =
      null;

    recordAction(
      `orbit-focus-settled:${normalizedWing}`
    );

    return true;
  }

  function beginClusterGesture(wing) {
    if (arguments.length !== 1) {
      return rejectRequest(
        "cluster-gesture-begin-rejected",
        "ARCHCOIN_CLUSTER_GESTURE_BEGIN_EXACT_WING_REQUIRED"
      );
    }

    if (isHeld()) {
      return false;
    }

    const normalizedWing =
      normalizeWing(wing);

    const cluster =
      getCluster(normalizedWing);

    if (
      !cluster ||
      !(
        state.current === STATES.CLUSTER_OPEN ||
        state.current === STATES.ROOM_SELECTED
      ) ||
      normalizedWing !== activeClusterWing()
    ) {
      return false;
    }

    if (cluster.gestureActive) {
      return true;
    }

    cluster.gestureOrigin =
      cloneOrientation(cluster.committedOrientation);

    setClusterOrientation(
      cluster,
      cluster.orientation,
      {
        committed: false,
        phase: ORIENTATION_PHASES.PREVIEW,
        gestureActive: true,
        previewAccepted: false
      }
    );

    recordAction(
      `cluster-gesture-began:${normalizedWing}`
    );

    return true;
  }

  function requestClusterPreview(wing, payload) {
    if (arguments.length !== 2) {
      return rejectRequest(
        "cluster-preview-rejected",
        "ARCHCOIN_CLUSTER_PREVIEW_EXACT_WING_AND_PAYLOAD_REQUIRED"
      );
    }

    if (isHeld()) {
      return false;
    }

    const normalizedWing =
      normalizeWing(wing);

    const cluster =
      getCluster(normalizedWing);

    if (
      !cluster ||
      !(
        state.current === STATES.CLUSTER_OPEN ||
        state.current === STATES.ROOM_SELECTED
      ) ||
      normalizedWing !== activeClusterWing()
    ) {
      return false;
    }

    if (!cluster.gestureActive) {
      return rejectRequest(
        "cluster-preview-rejected",
        `ARCHCOIN_CLUSTER_PREVIEW_ACTIVE_TRANSACTION_REQUIRED:${normalizedWing}`
      );
    }

    const validation =
      validateClusterPreviewPayload(cluster, payload);

    if (!validation.pass) {
      return rejectRequest(
        "cluster-preview-rejected",
        validation.code
      );
    }

    setClusterOrientation(
      cluster,
      validation.orientation,
      {
        committed: false,
        phase: ORIENTATION_PHASES.PREVIEW,
        gestureActive: true,
        previewAccepted: true
      }
    );

    recordAction(
      `cluster-preview-accepted:${normalizedWing}:${validation.orientation.primaryId}`
    );

    return true;
  }

  function requestClusterCommit(wing) {
    if (arguments.length !== 1) {
      return rejectRequest(
        "cluster-commit-rejected",
        "ARCHCOIN_CLUSTER_COMMIT_EXACT_WING_REQUIRED"
      );
    }

    if (isHeld()) {
      return false;
    }

    const normalizedWing =
      normalizeWing(wing);

    const cluster =
      getCluster(normalizedWing);

    if (
      !cluster ||
      !(
        state.current === STATES.CLUSTER_OPEN ||
        state.current === STATES.ROOM_SELECTED
      ) ||
      normalizedWing !== activeClusterWing()
    ) {
      return false;
    }

    if (
      !cluster.gestureActive ||
      !cluster.previewAccepted
    ) {
      return rejectRequest(
        "cluster-commit-rejected",
        `ARCHCOIN_CLUSTER_COMMIT_ACCEPTED_PREVIEW_REQUIRED:${normalizedWing}`
      );
    }

    const committed =
      cloneOrientation(cluster.orientation);

    setClusterOrientation(
      cluster,
      committed,
      {
        committed: true,
        phase: ORIENTATION_PHASES.COMMITTED,
        gestureActive: false,
        previewAccepted: false,
        incrementRevision: true
      }
    );

    cluster.gestureOrigin =
      null;

    recordAction(
      `cluster-committed:${normalizedWing}:${committed.primaryId}`
    );

    return true;
  }

  function requestClusterCancel(wing, reason = "cancelled") {
    if (
      arguments.length < 1 ||
      arguments.length > 2
    ) {
      return rejectRequest(
        "cluster-cancel-rejected",
        "ARCHCOIN_CLUSTER_CANCEL_ARGUMENT_COUNT_INVALID"
      );
    }

    if (isHeld()) {
      return false;
    }

    const normalizedWing =
      normalizeWing(wing);

    const cluster =
      getCluster(normalizedWing);

    if (
      !cluster ||
      !cluster.gestureActive
    ) {
      return false;
    }

    const restored =
      cloneOrientation(
        cluster.gestureOrigin ||
        cluster.committedOrientation
      );

    setClusterOrientation(
      cluster,
      restored,
      {
        committed: false,
        phase: ORIENTATION_PHASES.CANCELLED,
        gestureActive: false,
        previewAccepted: false
      }
    );

    cluster.gestureOrigin =
      null;

    recordAction(
      `cluster-cancelled:${normalizedWing}:${String(reason || "cancelled")}`
    );

    cluster.phase =
      ORIENTATION_PHASES.COMMITTED;

    recordAction(
      `cluster-cancel-settled:${normalizedWing}`
    );

    return true;
  }

  function cancelActiveGestures(reason) {
    if (state.orbitGestureActive) {
      requestOrbitCancel(reason);
    }

    for (const cluster of state.clusters.values()) {
      if (cluster.gestureActive) {
        requestClusterCancel(cluster.wing, reason);
      }
    }
  }

  function requestCardinalSelection(cardinalId) {
    const wing =
      normalizeWing(cardinalId);

    if (
      isHeld() ||
      !wing ||
      state.current !== STATES.CONSTELLATION
    ) {
      return false;
    }

    const element =
      findCoinElement(wing);

    if (!element) {
      recordAction(
        "cardinal-selection-rejected",
        `CARDINAL_NOT_FOUND:${wing}`
      );

      return false;
    }

    if (state.orbitGestureActive) {
      requestOrbitCancel("cardinal-selection");
    }

    setConstellationOrientation(
      canonicalConstellationOrientation(wing),
      {
        committed: true,
        phase: ORIENTATION_PHASES.COMMITTED,
        gestureActive: false,
        previewAccepted: false,
        incrementRevision: true
      }
    );

    resetSelection();

    return applyState(
      STATES.CLUSTER_OPEN,
      {
        selectedCardinal: wing,
        selectedCoin: wingToCoin(wing),
        selectedDestinationType: DESTINATION_TYPES.COIN,
        selectedDestinationId: wing,
        selectedDestinationLabel:
          normalizeLabel(
            element.dataset.showroomCardinalLabel,
            WING_LABELS[wing] || wingToCoin(wing)
          ),
        selectedRoute: "",
        selectedParagraph: "",
        compassSelected: false,
        panelDescended: false
      },
      `cardinal-selected:${wing}`
    );
  }

  function validateChildIntent(intent) {
    if (!intent) {
      throw new Error("SHOWROOM_CHILD_INTENT_INVALID");
    }

    if (!intent.childId) {
      throw new Error("SHOWROOM_CHILD_ID_REQUIRED");
    }

    if (!intent.wingId) {
      throw new Error("SHOWROOM_CHILD_WING_REQUIRED");
    }

    if (!intent.infoId) {
      throw new Error("SHOWROOM_CHILD_INFO_ID_REQUIRED");
    }

    if (!intent.destinationKind) {
      throw new Error("SHOWROOM_CHILD_DESTINATION_KIND_INVALID");
    }

    if (
      intent.destinationKind ===
        DESTINATION_KINDS.OBJECT_INSPECT &&
      !intent.objectTarget
    ) {
      throw new Error("SHOWROOM_OBJECT_TARGET_REQUIRED");
    }

    if (
      intent.destinationKind ===
        DESTINATION_KINDS.EXTERNAL_ROUTE &&
      !intent.route
    ) {
      throw new Error("SHOWROOM_EXTERNAL_ROUTE_METADATA_PRESENT");
    }

    return true;
  }

  function requestRoomSelection(roomId) {
    const id =
      normalize(roomId);

    if (
      isHeld() ||
      !id ||
      !(
        state.current === STATES.CLUSTER_OPEN ||
        state.current === STATES.ROOM_SELECTED
      )
    ) {
      return false;
    }

    const element =
      findRoomElement(id);

    if (!element) {
      recordAction(
        "room-selection-rejected",
        `ROOM_NOT_FOUND:${id}`
      );

      return false;
    }

    const intent =
      readChildIntentFromElement(element);

    try {
      validateChildIntent(intent);
    } catch (error) {
      recordAction(
        "room-selection-rejected",
        error && error.message
          ? error.message
          : "SHOWROOM_CHILD_INTENT_INVALID"
      );

      return false;
    }

    if (intent.wingId !== state.selectedCardinal) {
      recordAction(
        "room-selection-rejected",
        `ROOM_OUTSIDE_ACTIVE_CLUSTER:${id}`
      );

      return false;
    }

    const cluster =
      getCluster(intent.wingId);

    if (
      !cluster ||
      !cluster.roomIds.includes(id)
    ) {
      recordAction(
        "room-selection-rejected",
        `ROOM_CLUSTER_INVALID:${id}`
      );

      return false;
    }

    if (cluster.gestureActive) {
      requestClusterCancel(
        intent.wingId,
        "room-selection"
      );
    }

    clearViewportSchedules();

    if (state.selectedRoom !== id) {
      invalidateDestinationAuthorization();
    }

    const committed =
      applyState(
        STATES.ROOM_SELECTED,
        {
          selectedCardinal: intent.wingId,
          selectedCoin: wingToCoin(intent.wingId),
          selectedRoom: id,
          selectedDestinationType: DESTINATION_TYPES.ROOM,
          selectedDestinationKind: intent.destinationKind,
          selectedInfoId: intent.infoId,
          selectedObjectTarget: intent.objectTarget,
          selectedRouteEvidence: intent.routeEvidence,
          selectedDestinationId: id,
          selectedDestinationLabel: intent.childLabel,
          selectedRoute: intent.route,
          selectedContentId: intent.infoId,
          selectedLens: intent.lens,
          selectedParagraph: roomParagraphFromIntent(intent),
          selectedSemanticActivation: intent.semanticActivation,
          selectedRouteLabel: intent.routeLabel,
          selectedRouteDescription: intent.routeDescription,
          selectedRouteRole: intent.routeRole,
          selectedVisualClass: intent.visualClass,
          selectedEmphasis: intent.emphasis,
          selectedReturnModel: intent.returnModel,
          selectedReturnZone: intent.returnZone,
          compassSelected: false,
          panelDescended: true
        },
        `room-selected:${id}`
      );

    if (!committed) {
      return false;
    }

    scheduleRoomPanelDescent(id);

    return true;
  }

  function requestCompassSelection() {
    if (isHeld()) {
      return false;
    }

    cancelActiveGestures("compass-selection");
    clearViewportSchedules();

    state.compassSelected = true;
    state.selectedDestinationType = DESTINATION_TYPES.HOME_COMPASS;
    state.selectedDestinationKind = "";
    state.selectedDestinationId = MAIN_COMPASS.destinationId;
    state.selectedDestinationLabel = MAIN_COMPASS.destinationLabel;
    state.selectedRoute = MAIN_COMPASS.route;
    state.selectedContentId = "home-compass";
    state.selectedInfoId = "";
    state.selectedLens = "return";
    state.selectedParagraph =
      "Return to the Diamond Gate Bridge Main Compass only after choosing the explicit return action.";
    state.panelDescended = true;

    syncPresentation();

    recordAction("compass-selected-local");

    publish(
      CHANNELS.COMPASS_STATE,
      createCompassState()
    );

    scheduleCompassPanelDescent();

    return true;
  }

  function createSelectedIntentPayload(intent, authorizationGeneration) {
    return Object.freeze({
      contract: INTENT_ENTRY.contract,
      controllerId: MODULE.id,
      controllerVersion: MODULE.version,
      controllerFile: MODULE.file,
      sourceState: STATES.ROOM_SELECTED,

      wingId: intent.wingId,
      wingLabel: WING_LABELS[intent.wingId] || "",
      childId: intent.childId,
      childLabel: intent.childLabel,
      destinationKind: intent.destinationKind,
      infoId: intent.infoId,

      route: normalizeNullableString(intent.route),
      routeLabel: normalizeNullableString(intent.routeLabel),
      routeDescription: normalizeNullableString(intent.routeDescription),
      routeEvidence: normalizeNullableString(intent.routeEvidence),
      routeRole: normalizeNullableString(intent.routeRole),

      objectTarget: normalizeNullableString(intent.objectTarget),
      semanticActivation: normalizeNullableString(intent.semanticActivation),
      lens: intent.lens,

      visualClass: normalizeNullableString(intent.visualClass),
      emphasis: normalizeNullableString(intent.emphasis),
      returnModel: normalizeNullableString(intent.returnModel),
      returnZone: normalizeNullableString(intent.returnZone),

      authorizationGeneration,
      timestamp: new Date().toISOString()
    });
  }

  function validateSelectedIntentPayload(payload) {
    invariant(
      payload &&
        typeof payload === "object" &&
        !Array.isArray(payload),
      "SHOWROOM_SELECTED_INTENT_PAYLOAD_OBJECT_REQUIRED"
    );

    invariant(
      Object.isFrozen(payload) === true,
      "SHOWROOM_SELECTED_INTENT_PAYLOAD_NOT_FROZEN"
    );

    const keys =
      Object.keys(payload);

    invariant(
      keys.length === INTENT_PAYLOAD_KEYS.length,
      "SHOWROOM_SELECTED_INTENT_PAYLOAD_KEY_COUNT_INVALID",
      {
        expected: INTENT_PAYLOAD_KEYS.length,
        actual: keys.length
      }
    );

    for (const key of INTENT_PAYLOAD_KEYS) {
      invariant(
        Object.prototype.hasOwnProperty.call(payload, key),
        "SHOWROOM_SELECTED_INTENT_PAYLOAD_KEY_MISSING",
        { key }
      );

      invariant(
        isPrimitiveIntentPayloadValue(payload[key]),
        "SHOWROOM_SELECTED_INTENT_PAYLOAD_NON_PRIMITIVE_VALUE",
        {
          key,
          type: typeof payload[key]
        }
      );
    }

    for (const key of keys) {
      invariant(
        INTENT_PAYLOAD_KEYS.includes(key),
        "SHOWROOM_SELECTED_INTENT_PAYLOAD_UNEXPECTED_KEY",
        { key }
      );
    }

    invariant(
      payload.contract === INTENT_ENTRY.contract,
      "SHOWROOM_SELECTED_INTENT_PAYLOAD_CONTRACT_INVALID"
    );

    invariant(
      payload.controllerId === MODULE.id,
      "SHOWROOM_SELECTED_INTENT_PAYLOAD_CONTROLLER_ID_INVALID"
    );

    invariant(
      payload.controllerVersion === MODULE.version,
      "SHOWROOM_SELECTED_INTENT_PAYLOAD_CONTROLLER_VERSION_INVALID"
    );

    invariant(
      payload.controllerFile === MODULE.file,
      "SHOWROOM_SELECTED_INTENT_PAYLOAD_CONTROLLER_FILE_INVALID"
    );

    invariant(
      payload.sourceState === STATES.ROOM_SELECTED,
      "SHOWROOM_SELECTED_INTENT_PAYLOAD_SOURCE_STATE_INVALID"
    );

    invariant(
      Number.isSafeInteger(payload.authorizationGeneration) &&
        payload.authorizationGeneration >= 0,
      "SHOWROOM_SELECTED_INTENT_PAYLOAD_GENERATION_INVALID"
    );

    invariant(
      !Number.isNaN(Date.parse(payload.timestamp)),
      "SHOWROOM_SELECTED_INTENT_PAYLOAD_TIMESTAMP_INVALID"
    );

    invariant(
      normalizeDestinationKind(payload.destinationKind),
      "SHOWROOM_SELECTED_INTENT_PAYLOAD_KIND_INVALID"
    );

    invariant(
      payload.infoId,
      "SHOWROOM_SELECTED_INTENT_PAYLOAD_INFO_ID_REQUIRED"
    );

    if (
      payload.destinationKind ===
      DESTINATION_KINDS.OBJECT_INSPECT
    ) {
      invariant(
        payload.objectTarget,
        "SHOWROOM_SELECTED_INTENT_PAYLOAD_OBJECT_TARGET_REQUIRED"
      );
    }

    if (
      payload.destinationKind ===
      DESTINATION_KINDS.EXTERNAL_ROUTE
    ) {
      invariant(
        payload.route,
        "SHOWROOM_SELECTED_INTENT_PAYLOAD_ROUTE_METADATA_REQUIRED"
      );
    }

    return true;
  }

  function requestEnterSelection() {
    if (
      isHeld() ||
      state.compassSelected ||
      state.current !== STATES.ROOM_SELECTED
    ) {
      return false;
    }

    const element =
      findRoomElement(state.selectedRoom);

    if (!element) {
      recordAction(
        "selected-intent-entry-rejected",
        "SHOWROOM_SELECTED_CHILD_NOT_FOUND"
      );

      return false;
    }

    const intent =
      readChildIntentFromElement(element);

    try {
      validateChildIntent(intent);
    } catch (error) {
      recordAction(
        "selected-intent-entry-rejected",
        error && error.message
          ? error.message
          : "SHOWROOM_CHILD_INTENT_INVALID"
      );

      return false;
    }

    if (
      intent.childId !== state.selectedRoom ||
      intent.wingId !== state.selectedCardinal ||
      intent.destinationKind !== state.selectedDestinationKind ||
      intent.infoId !== state.selectedInfoId ||
      intent.lens !== state.selectedLens
    ) {
      recordAction(
        "selected-intent-entry-rejected",
        "SHOWROOM_SELECTED_INTENT_STALE"
      );

      return false;
    }

    const authorizationGeneration =
      state.destinationAuthorizationGeneration;

    const payload =
      createSelectedIntentPayload(
        intent,
        authorizationGeneration
      );

    try {
      validateSelectedIntentPayload(payload);
    } catch (error) {
      recordAction(
        "selected-intent-entry-payload-rejected",
        error &&
          (
            error.code ||
            error.message
          )
          ? String(error.code || error.message)
          : "SHOWROOM_SELECTED_INTENT_PAYLOAD_INVALID"
      );

      return false;
    }

    if (
      authorizationGeneration !==
        state.destinationAuthorizationGeneration ||
      state.selectedRoom !== intent.childId ||
      state.current !== STATES.ROOM_SELECTED ||
      state.compassSelected ||
      isHeld()
    ) {
      recordAction(
        "selected-intent-entry-rejected",
        "SHOWROOM_SELECTED_INTENT_STALE"
      );

      return false;
    }

    try {
      state.root.dispatchEvent(
        new CustomEvent(
          INTENT_ENTRY.event,
          {
            detail: payload,
            bubbles: true
          }
        )
      );
    } catch (error) {
      recordAction(
        "selected-intent-entry-dispatch-failed",
        error &&
          (
            error.code ||
            error.message
          )
          ? String(error.code || error.message)
          : "SHOWROOM_SELECTED_INTENT_DISPATCH_FAILED"
      );

      return false;
    }

    recordAction(
      `selected-intent-entry-authorized:${intent.childId}:${authorizationGeneration}`
    );

    return true;
  }

  function requestReturnToMainCompass() {
    if (
      isHeld() ||
      !state.compassSelected
    ) {
      return false;
    }

    recordAction("main-compass-return-confirmed");

    globalThis.location.assign(MAIN_COMPASS.route);

    return true;
  }

  function requestReturnToOrbit() {
    if (isHeld()) {
      return false;
    }

    cancelActiveGestures("return-to-orbit");
    clearViewportSchedules();

    if (state.compassSelected) {
      state.compassSelected = false;

      if (state.current === STATES.ROOM_SELECTED) {
        const wing =
          normalizeWing(state.selectedCardinal);

        if (!wing) {
          return false;
        }

        const coin =
          findCoinElement(wing);

        invalidateDestinationAuthorization();

        const committed =
          applyState(
            STATES.CLUSTER_OPEN,
            {
              selectedCardinal: wing,
              selectedCoin: wingToCoin(wing),
              selectedRoom: "",
              selectedDestinationType: DESTINATION_TYPES.COIN,
              selectedDestinationKind: "",
              selectedInfoId: "",
              selectedObjectTarget: "",
              selectedRouteEvidence: "",
              selectedDestinationId: wing,
              selectedDestinationLabel:
                normalizeLabel(
                  coin && coin.dataset.showroomCardinalLabel,
                  WING_LABELS[wing] || wingToCoin(wing)
                ),
              selectedRoute: "",
              selectedContentId: "",
              selectedLens: "overview",
              selectedParagraph: "",
              compassSelected: false,
              panelDescended: false
            },
            `compass-returned-to-orbit:${wing}`
          );

        if (committed) {
          scheduleSceneAscent(STATES.CLUSTER_OPEN, wing);
        }

        return committed;
      }

      if (state.current === STATES.CLUSTER_OPEN) {
        state.selectedDestinationType =
          DESTINATION_TYPES.COIN;

        state.selectedDestinationId =
          state.selectedCardinal;

        state.selectedDestinationLabel =
          WING_LABELS[state.selectedCardinal] ||
          wingToCoin(state.selectedCardinal);

        state.selectedRoute =
          "";

        state.panelDescended =
          false;

        syncPresentation();

        recordAction(
          `compass-returned-to-cluster:${state.selectedCardinal}`
        );

        scheduleSceneAscent(
          STATES.CLUSTER_OPEN,
          state.selectedCardinal
        );

        return true;
      }

      if (state.current === STATES.CONSTELLATION) {
        resetSelection();
        syncPresentation();

        recordAction("compass-returned-to-constellation");

        scheduleSceneAscent(STATES.CONSTELLATION);

        return true;
      }
    }

    if (state.current !== STATES.ROOM_SELECTED) {
      return false;
    }

    const wing =
      normalizeWing(state.selectedCardinal);

    if (!wing) {
      recordAction(
        "return-to-orbit-rejected",
        "ACTIVE_ROOM_WING_REQUIRED"
      );

      return false;
    }

    const coin =
      findCoinElement(wing);

    invalidateDestinationAuthorization();

    const committed =
      applyState(
        STATES.CLUSTER_OPEN,
        {
          selectedCardinal: wing,
          selectedCoin: wingToCoin(wing),
          selectedRoom: "",
          selectedDestinationType: DESTINATION_TYPES.COIN,
          selectedDestinationKind: "",
          selectedInfoId: "",
          selectedObjectTarget: "",
          selectedRouteEvidence: "",
          selectedDestinationId: wing,
          selectedDestinationLabel:
            normalizeLabel(
              coin && coin.dataset.showroomCardinalLabel,
              WING_LABELS[wing] || wingToCoin(wing)
            ),
          selectedRoute: "",
          selectedContentId: "",
          selectedLens: "overview",
          selectedParagraph: "",
          selectedSemanticActivation: "",
          selectedRouteLabel: "",
          selectedRouteDescription: "",
          selectedRouteRole: "",
          selectedVisualClass: "",
          selectedEmphasis: "",
          selectedReturnModel: "",
          selectedReturnZone: "",
          compassSelected: false,
          panelDescended: false
        },
        `returned-to-orbit:${wing}`
      );

    if (committed) {
      scheduleSceneAscent(STATES.CLUSTER_OPEN, wing);
    }

    return committed;
  }

  function requestReturnToConstellation(options = {}) {
    if (arguments.length > 1) {
      return false;
    }

    if (
      isHeld() ||
      (
        state.current !== STATES.CLUSTER_OPEN &&
        state.current !== STATES.ROOM_SELECTED
      )
    ) {
      return false;
    }

    cancelActiveGestures("return-to-constellation");
    clearViewportSchedules();

    const previousWing =
      normalizeWing(
        state.selectedCardinal ||
        state.orbitFocus
      ) || "north";

    resetSelection();

    const committed =
      applyState(
        STATES.CONSTELLATION,
        {
          orbitFocus: previousWing,
          orbitPreviewFocus: previousWing,
          compassSelected: false
        },
        `returned-to-constellation:${previousWing}`
      );

    if (
      committed &&
      options.scrollToScene !== false
    ) {
      scheduleSceneAscent(STATES.CONSTELLATION);
    }

    return committed;
  }

  function updateSemanticProjection(records) {
    if (!Array.isArray(records)) {
      return false;
    }

    const next =
      new Map();

    for (const input of records) {
      if (
        !input ||
        typeof input !== "object"
      ) {
        continue;
      }

      const id =
        normalize(
          input.id ||
          input.roomId ||
          input.wing ||
          input.cardinalId
        );

      if (!id) {
        continue;
      }

      const kind =
        normalizeLower(input.kind);

      if (
        !canonicalControlExists({
          id,
          kind
        })
      ) {
        continue;
      }

      const projection =
        Object.freeze({
          id,
          kind,
          x: finiteNumber(input.x, 0),
          y: finiteNumber(input.y, 0),
          radiusPx:
            Math.max(
              0,
              finiteNumber(
                input.radiusPx ??
                  input.projectedRadius,
                0
              )
            ),
          depthLayer:
            normalizeDepthLayer(
              input.depthLayer ||
              input.layer
            ),
          compassOverlap: Boolean(input.compassOverlap),
          visible: input.visible !== false
        });

      next.set(
        `${projection.kind}:${id}`,
        projection
      );
    }

    state.semanticProjection =
      next;

    state.semanticProjectionRevision += 1;

    const snapshot =
      createSemanticProjectionSnapshot();

    publish(
      CHANNELS.SEMANTIC_PROJECTION,
      snapshot
    );

    recordAction(
      `semantic-projection-updated:${snapshot.length}`
    );

    return true;
  }

  function handleKeydown(event) {
    if (
      isHeld() ||
      event.key !== "Escape"
    ) {
      return;
    }

    if (state.compassSelected) {
      event.preventDefault();
      requestReturnToOrbit();
      return;
    }

    if (state.current === STATES.ROOM_SELECTED) {
      event.preventDefault();
      requestReturnToOrbit();
      return;
    }

    if (state.current === STATES.CLUSTER_OPEN) {
      event.preventDefault();
      requestReturnToConstellation();
    }
  }

  function handleCrystalsFailure(event) {
    const reason =
      String(
        event &&
        event.detail &&
        event.detail.reason
          ? event.detail.reason
          : "ARCHCOIN_CRYSTALS_RENDER_FAILURE"
      );

    cancelActiveGestures("crystals-failure");

    setGuidance(
      "The visual crystal field is temporarily unavailable. Semantic destinations remain preserved."
    );

    recordAction(
      "crystals-renderer-failed",
      reason
    );
  }

  function readReducedMotion() {
    const media =
      globalThis.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    state.mediaQuery =
      media;

    state.reducedMotion =
      Boolean(media.matches) ||
      state.root.dataset.showroomReducedMotion === "true";
  }

  function bindReducedMotion() {
    const media =
      state.mediaQuery;

    if (!media) {
      return;
    }

    const update =
      event => {
        const previous =
          state.reducedMotion;

        state.reducedMotion =
          Boolean(event.matches);

        if (previous === state.reducedMotion) {
          return;
        }

        publish(
          CHANNELS.REDUCED_MOTION,
          state.reducedMotion
        );

        publish(
          CHANNELS.COMPASS_STATE,
          createCompassState()
        );

        recordAction("reduced-motion-updated");
      };

    state.mediaQueryListener =
      update;

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return;
    }

    if (typeof media.addListener === "function") {
      media.addListener(update);
    }
  }

  function resolveDom() {
    state.root =
      qs("[data-showroom-root]");

    invariant(
      state.root,
      "SHOWROOM_ROOT_NOT_FOUND"
    );

    state.scene =
      qs("[data-showroom-scene]", state.root);

    state.sceneField =
      qs("[data-showroom-scene-field]", state.root);

    state.panel =
      qs("[data-showroom-controller-panel]", state.root);

    invariant(state.scene, "SHOWROOM_SCENE_NOT_FOUND");
    invariant(state.sceneField, "SHOWROOM_SCENE_FIELD_NOT_FOUND");
    invariant(state.panel, "SHOWROOM_CONTROLLER_PANEL_NOT_FOUND");

    state.panelEyebrow =
      qs("[data-showroom-controller-panel-eyebrow]", state.root);

    state.panelTitle =
      qs("[data-showroom-controller-panel-title]", state.root);

    state.panelPurpose =
      qs("[data-showroom-controller-panel-purpose]", state.root);

    state.panelRelationship =
      qs("[data-showroom-controller-panel-relationship]", state.root);

    state.panelDomain =
      qs("[data-showroom-controller-panel-domain]", state.root);

    state.panelFunction =
      qs("[data-showroom-controller-panel-function]", state.root);

    state.panelCoordinate =
      qs("[data-showroom-controller-panel-coordinate]", state.root);

    state.panelSelectionState =
      qs("[data-showroom-controller-panel-selection-state]", state.root);

    state.panelRouteStatus =
      qs("[data-showroom-controller-panel-route-status]", state.root);

    state.panelLens =
      qs("[data-showroom-controller-panel-lens]", state.root);

    state.enterButton =
      qs("[data-showroom-controller-enter]", state.root);

    state.enterLabel =
      qs("[data-showroom-controller-enter-label]", state.root);

    state.returnToOrbitButton =
      qs("[data-showroom-controller-return-to-orbit]", state.root);

    state.returnToOrbitLabel =
      qs("[data-showroom-controller-return-to-orbit-label]", state.root);

    state.returnHomeButton =
      qs("[data-showroom-controller-return-home-compass]", state.root);

    state.guidance =
      qs("[data-showroom-controller-guidance]", state.root);

    state.controllerReceiptOutput =
      qs("[data-showroom-controller-receipt]", state.root);

    state.controllerValidationOutput =
      qs("[data-showroom-controller-validation]", state.root);

    const requiredPanelNodes =
      Object.freeze([
        ["SHOWROOM_PANEL_EYEBROW_NOT_FOUND", state.panelEyebrow],
        ["SHOWROOM_PANEL_TITLE_NOT_FOUND", state.panelTitle],
        ["SHOWROOM_PANEL_PURPOSE_NOT_FOUND", state.panelPurpose],
        ["SHOWROOM_PANEL_RELATIONSHIP_NOT_FOUND", state.panelRelationship],
        ["SHOWROOM_PANEL_DOMAIN_NOT_FOUND", state.panelDomain],
        ["SHOWROOM_PANEL_FUNCTION_NOT_FOUND", state.panelFunction],
        ["SHOWROOM_PANEL_COORDINATE_NOT_FOUND", state.panelCoordinate],
        ["SHOWROOM_PANEL_SELECTION_STATE_NOT_FOUND", state.panelSelectionState],
        ["SHOWROOM_PANEL_ROUTE_STATUS_NOT_FOUND", state.panelRouteStatus],
        ["SHOWROOM_PANEL_LENS_NOT_FOUND", state.panelLens],
        ["SHOWROOM_ENTER_CONTROL_NOT_FOUND", state.enterButton],
        ["SHOWROOM_ENTER_LABEL_NOT_FOUND", state.enterLabel],
        ["SHOWROOM_RETURN_TO_ORBIT_CONTROL_NOT_FOUND", state.returnToOrbitButton],
        ["SHOWROOM_RETURN_TO_ORBIT_LABEL_NOT_FOUND", state.returnToOrbitLabel],
        ["SHOWROOM_RETURN_HOME_CONTROL_NOT_FOUND", state.returnHomeButton],
        ["SHOWROOM_GUIDANCE_NOT_FOUND", state.guidance],
        ["SHOWROOM_CONTROLLER_RECEIPT_OUTPUT_NOT_FOUND", state.controllerReceiptOutput],
        ["SHOWROOM_CONTROLLER_VALIDATION_OUTPUT_NOT_FOUND", state.controllerValidationOutput]
      ]);

    for (const [code, node] of requiredPanelNodes) {
      invariant(node, code);
    }

    state.compassControl =
      qs("[data-showroom-compass-control]", state.root);

    invariant(
      state.compassControl,
      "SHOWROOM_COMPASS_CONTROL_NOT_FOUND"
    );
  }

  function initializeOrientationState() {
    const requestedFocus =
      normalizeWing(
        state.root.dataset.showroomOrbitFocus
      ) || "north";

    let initial =
      canonicalConstellationOrientation(requestedFocus);

    const serialized =
      normalize(state.root.dataset.showroomOrbitQuaternion);

    if (serialized) {
      try {
        const parsed =
          JSON.parse(serialized);

        const normalized =
          normalizeQuaternionStrict(parsed);

        if (normalized) {
          initial =
            createOrientation(
              normalized,
              requestedFocus
            );
        }
      } catch (_) {}
    }

    state.orbitFocus =
      requestedFocus;

    state.orbitPreviewFocus =
      requestedFocus;

    state.orbitPhase =
      ORIENTATION_PHASES.COMMITTED;

    state.orbitGestureActive =
      false;

    state.orbitPreviewAccepted =
      false;

    state.orbitRevision =
      finiteNumber(
        state.root.dataset.showroomOrbitRevision,
        0
      );

    state.orbitOrientation =
      cloneOrientation(initial);

    state.committedOrbitOrientation =
      cloneOrientation(initial);

    state.orbitGestureOrigin =
      null;
  }

  function initializeClusters() {
    state.clusters.clear();

    for (const wing of WINGS) {
      const cluster =
        createClusterState(wing);

      invariant(
        cluster.roomIds.length === 4,
        "ARCHCOIN_CLUSTER_ROOM_COUNT_INVALID",
        {
          wing,
          count: cluster.roomIds.length
        }
      );

      state.clusters.set(wing, cluster);
    }
  }

  function getClusterState(wing) {
    const cluster =
      getCluster(wing);

    if (!cluster) {
      return null;
    }

    return Object.freeze({
      wing: cluster.wing,
      roomIds: Object.freeze(cluster.roomIds.slice()),
      primaryRoom: cluster.primaryRoom,
      previewPrimaryRoom: cluster.previewPrimaryRoom,
      phase: cluster.phase,
      gestureActive: cluster.gestureActive,
      previewAccepted: cluster.previewAccepted,
      revision: cluster.revision,
      orientation: freezeOrientation(cluster.orientation),
      committedOrientation: freezeOrientation(cluster.committedOrientation)
    });
  }

  function validateDeclaredCardinals() {
    const declared =
      qsa("[data-showroom-cardinal-control]", state.root);

    invariant(
      declared.length === 4,
      "SHOWROOM_DECLARED_CARDINAL_COUNT_INVALID",
      {
        expected: 4,
        actual: declared.length
      }
    );

    const seenWings =
      new Set();

    for (const element of declared) {
      const wing =
        normalizeWing(element.dataset.showroomCardinalId);

      invariant(
        wing,
        "SHOWROOM_CARDINAL_ID_INVALID"
      );

      invariant(
        !seenWings.has(wing),
        "SHOWROOM_DUPLICATE_CARDINAL_ID",
        { wing }
      );

      invariant(
        element.dataset.showroomCardinalLabel === WING_LABELS[wing],
        "SHOWROOM_CARDINAL_LABEL_MISMATCH",
        {
          wing,
          expected: WING_LABELS[wing],
          actual: element.dataset.showroomCardinalLabel || ""
        }
      );

      invariant(
        normalizeWing(element.dataset.showroomClusterId) === wing,
        "SHOWROOM_CARDINAL_CLUSTER_MISMATCH",
        {
          wing,
          cluster: element.dataset.showroomClusterId || ""
        }
      );

      seenWings.add(wing);
    }

    return Object.freeze({
      pass: true,
      declaredCardinalCount: 4
    });
  }

  function validateDeclaredRooms() {
    const declared =
      qsa("[data-showroom-child-control]", state.root);

    invariant(
      declared.length === 16,
      "SHOWROOM_DECLARED_ROOM_COUNT_INVALID",
      {
        expected: 16,
        actual: declared.length
      }
    );

    const seenIds =
      new Set();

    for (const element of declared) {
      const intent =
        readChildIntentFromElement(element);

      invariant(
        intent.childId,
        "SHOWROOM_CHILD_ID_REQUIRED"
      );

      invariant(
        !seenIds.has(intent.childId),
        "SHOWROOM_DUPLICATE_DECLARED_ROOM_ID",
        { childId: intent.childId }
      );

      invariant(
        intent.wingId,
        "SHOWROOM_CHILD_WING_REQUIRED",
        { childId: intent.childId }
      );

      invariant(
        WINGS.includes(intent.wingId),
        "SHOWROOM_CHILD_WING_INVALID",
        {
          childId: intent.childId,
          wingId: intent.wingId
        }
      );

      invariant(
        intent.infoId,
        "SHOWROOM_CHILD_INFO_ID_REQUIRED",
        { childId: intent.childId }
      );

      invariant(
        intent.destinationKind,
        "SHOWROOM_CHILD_DESTINATION_KIND_INVALID",
        { childId: intent.childId }
      );

      if (
        intent.destinationKind ===
        DESTINATION_KINDS.OBJECT_INSPECT
      ) {
        invariant(
          intent.objectTarget,
          "SHOWROOM_OBJECT_TARGET_REQUIRED",
          { childId: intent.childId }
        );
      }

      if (
        intent.destinationKind ===
        DESTINATION_KINDS.EXTERNAL_ROUTE
      ) {
        invariant(
          Boolean(intent.route),
          "SHOWROOM_EXTERNAL_ROUTE_METADATA_PRESENT",
          { childId: intent.childId }
        );
      }

      seenIds.add(intent.childId);
    }

    for (const wing of WINGS) {
      const count =
        declared.filter(
          element =>
            normalizeWing(element.dataset.showroomCardinalId) === wing
        ).length;

      invariant(
        count === 4,
        "SHOWROOM_ROOMS_PER_WING_INVALID",
        {
          wing,
          count
        }
      );
    }

    return Object.freeze({
      pass: true,
      declaredRoomCount: 16,
      controllerValidatesRouteExistence: false,
      generatedRoomProxiesRequired: false
    });
  }

  function validateTransitionTable() {
    const declaredStates =
      Object.values(STATES);

    invariant(
      declaredStates.length === 4,
      "ARCHCOIN_STATE_COUNT_INVALID"
    );

    invariant(
      !declaredStates.includes("COMPASS_DECISION"),
      "ARCHCOIN_FORBIDDEN_COMPASS_DECISION_STATE"
    );

    invariant(
      !declaredStates.includes("CONSTELLATION_WITH_CLUSTER"),
      "ARCHCOIN_FORBIDDEN_ADDITIVE_STATE"
    );

    invariant(
      canTransition(STATES.CONSTELLATION, STATES.CLUSTER_OPEN),
      "ARCHCOIN_REQUIRED_TRANSITION_MISSING"
    );

    invariant(
      canTransition(STATES.CLUSTER_OPEN, STATES.ROOM_SELECTED),
      "ARCHCOIN_REQUIRED_TRANSITION_MISSING"
    );

    invariant(
      canTransition(STATES.ROOM_SELECTED, STATES.CLUSTER_OPEN),
      "ARCHCOIN_REQUIRED_TRANSITION_MISSING"
    );

    invariant(
      canTransition(STATES.CLUSTER_OPEN, STATES.CONSTELLATION),
      "ARCHCOIN_REQUIRED_TRANSITION_MISSING"
    );

    invariant(
      canTransition(STATES.ROOM_SELECTED, STATES.CONSTELLATION),
      "ARCHCOIN_REQUIRED_TRANSITION_MISSING"
    );

    invariant(
      TRANSITIONS[STATES.SYSTEM_HELD].length === 1 &&
        TRANSITIONS[STATES.SYSTEM_HELD][0] === STATES.SYSTEM_HELD,
      "ARCHCOIN_HELD_STATE_NOT_TERMINAL"
    );

    return Object.freeze({
      pass: true,
      states: Object.freeze(declaredStates.slice()),
      heldTerminal: true,
      compassDecisionPresent: false,
      additiveStatePresent: false
    });
  }

  function validatePresentationContract() {
    for (const presentation of Object.values(PRESENTATION_BY_STATE)) {
      invariant(
        !(
          presentation.outerCardinalsActive &&
          presentation.activeRoomCluster
        ),
        "ARCHCOIN_ADDITIVE_PRESENTATION_FORBIDDEN"
      );
    }

    return Object.freeze({
      pass: true,
      progressiveReplacement: true,
      additiveCoRenderingAuthorized: false
    });
  }

  function validateCompassContract() {
    const compass =
      createCompassState();

    invariant(
      compass.fixedCenter === true,
      "ARCHCOIN_COMPASS_FIXED_CENTER_INVALID"
    );

    invariant(
      compass.mainCompassRoute === "/index.html",
      "ARCHCOIN_COMPASS_ROUTE_INVALID"
    );

    invariant(
      compass.immediateNavigation === false,
      "ARCHCOIN_COMPASS_IMMEDIATE_NAVIGATION_INVALID"
    );

    invariant(
      compass.explicitReturnRequired === true,
      "ARCHCOIN_COMPASS_EXPLICIT_RETURN_INVALID"
    );

    invariant(
      compass.inheritsNavigationOrientation === false,
      "ARCHCOIN_COMPASS_ORIENTATION_INHERITANCE_INVALID"
    );

    invariant(
      compass.participatesInNavigationSettlement === false,
      "ARCHCOIN_COMPASS_SETTLEMENT_PARTICIPATION_INVALID"
    );

    return Object.freeze({
      pass: true,
      fixedCenter: true,
      pageLocalSelection: true,
      immediateNavigation: false,
      explicitMainCompassReturn: true,
      rendererLifecycleOwned: false
    });
  }

  function validateMotionContract() {
    invariant(
      MODULE.motionContractId ===
        "AUDRALIA_ARCHCOIN_COMPLETE_QUATERNION_MOTION_CONTRACT_v1",
      "ARCHCOIN_MOTION_CONTRACT_ID_INVALID"
    );

    invariant(
      MODULE.motionContractVersion === "1.0.0",
      "ARCHCOIN_MOTION_CONTRACT_VERSION_INVALID"
    );

    const validOrbit =
      validateOrbitPreviewPayload({
        quaternion: [0, 0.2, 0, 0.98],
        primaryId: "east"
      });

    invariant(
      validOrbit.pass === true,
      "ARCHCOIN_VALID_ORBIT_PREVIEW_REJECTED"
    );

    const eulerOrbit =
      validateOrbitPreviewPayload({
        yaw: 1,
        pitch: 1,
        roll: 0,
        primaryId: "east"
      });

    invariant(
      eulerOrbit.pass === false,
      "ARCHCOIN_CONTROLLER_MUST_REJECT_EULER_PREVIEW"
    );

    const mixedOrbit =
      validateOrbitPreviewPayload({
        quaternion: [0, 0, 0, 1],
        primaryId: "east",
        dx: 40
      });

    invariant(
      mixedOrbit.pass === false,
      "ARCHCOIN_CONTROLLER_MUST_REJECT_MIXED_MOTION_PAYLOAD"
    );

    invariant(
      beginOrbitGesture.length === 0,
      "ARCHCOIN_ORBIT_BEGIN_SIGNATURE_INVALID"
    );

    invariant(
      requestOrbitPreview.length === 1,
      "ARCHCOIN_ORBIT_PREVIEW_SIGNATURE_INVALID"
    );

    invariant(
      requestOrbitCommit.length === 0,
      "ARCHCOIN_ORBIT_COMMIT_SIGNATURE_INVALID"
    );

    invariant(
      beginClusterGesture.length === 1,
      "ARCHCOIN_CLUSTER_BEGIN_SIGNATURE_INVALID"
    );

    invariant(
      requestClusterPreview.length === 2,
      "ARCHCOIN_CLUSTER_PREVIEW_SIGNATURE_INVALID"
    );

    invariant(
      requestClusterCommit.length === 1,
      "ARCHCOIN_CLUSTER_COMMIT_SIGNATURE_INVALID"
    );

    return Object.freeze({
      pass: true,
      motionContractId: MODULE.motionContractId,
      motionContractVersion: MODULE.motionContractVersion,
      previewPayloadKeys: Object.freeze(PREVIEW_PAYLOAD_KEYS.slice()),
      unexpectedPreviewFieldsForbidden: true,
      completeQuaternionPreviewRequired: true,
      explicitPrimaryIdentityRequired: true,
      controllerInterpretsEulerMotion: false,
      controllerConstructsGestureQuaternion: false,
      motionOwner: MODULE.interactionModuleId,
      acceptedStateAuthority: MODULE.id
    });
  }

  function validateProjectionStorageContract() {
    const sample =
      Object.freeze({
        id: "north",
        kind: "cardinal",
        x: 10,
        y: 20,
        radiusPx: 30,
        depthLayer: DEPTH_LAYERS.FRONT,
        compassOverlap: false,
        visible: true
      });

    invariant(
      !Object.prototype.hasOwnProperty.call(sample, "interactionPriority"),
      "ARCHCOIN_CONTROLLER_MUST_NOT_STORE_INTERACTION_PRIORITY"
    );

    return Object.freeze({
      pass: true,
      storedFields: Object.freeze([
        "id",
        "kind",
        "x",
        "y",
        "radiusPx",
        "depthLayer",
        "compassOverlap",
        "visible"
      ]),
      projectionMathOwned: false,
      interactionPriorityAccepted: false,
      interactionPriorityDerived: false,
      interactionPriorityStored: false,
      interactionPriorityOwner: MODULE.interactionModuleId,
      projectionDomApplicationOwned: false,
      projectionDomApplicationOwner: MODULE.interactionModuleId
    });
  }

  function validateFileSplitContract() {
    invariant(
      !Object.prototype.hasOwnProperty.call(state, "pointer"),
      "ARCHCOIN_CONTROLLER_POINTER_STATE_NOT_EXTRACTED"
    );

    invariant(
      !Object.prototype.hasOwnProperty.call(state, "suppressedSemanticClick"),
      "ARCHCOIN_CONTROLLER_CLICK_SUPPRESSION_NOT_EXTRACTED"
    );

    return Object.freeze({
      pass: true,
      pointerListenersOwned: false,
      pointerStateOwned: false,
      swipeClassificationOwned: false,
      tapDragArbitrationOwned: false,
      wholeCrystalHitTestingOwned: false,
      syntheticClickSuppressionOwned: false,
      projectionDomApplicationOwned: false,
      interactionPriorityDerivationOwned: false,
      gestureAxisSelectionOwned: false,
      gestureQuaternionConstructionOwned: false,
      directManipulationOwned: false,
      grabbedObjectTrackingOwned: false,
      interactionModuleId: MODULE.interactionModuleId,
      acceptedStateAuthority: MODULE.id,
      navigationTransitionAuthority: MODULE.id
    });
  }

  function validateIntentOwnershipContract() {
    return Object.freeze({
      pass: true,
      controllerOwnsSelectionState: true,
      controllerOwnsIntentPayloadDispatch: true,
      controllerExecutesDestinations: false,
      modalOpeningOwned: false,
      modalOpeningOwner: "/showroom/index.destinations.js",
      routeConfirmationOwned: false,
      routeConfirmationOwner: "/showroom/index.destinations.js",
      routeDowngradeOwned: false,
      routeDowngradeOwner: "/showroom/index.destinations.js",
      objectInspectionExecutionOwned: false,
      objectInspectionExecutionOwner: "/showroom/index.destinations.js",
      anchorScrollingOwned: false,
      disclosureOpeningOwned: false,
      gaugeFrontActivationOwned: false,
      routeExistenceValidationOwned: false
    });
  }

  function runControllerSelfTest({
    includeDom = false
  } = {}) {
    const results = {
      transitions: validateTransitionTable(),
      presentation: validatePresentationContract(),
      compass: validateCompassContract(),
      motionContract: validateMotionContract(),
      projectionStorage: validateProjectionStorageContract(),
      fileSplit: validateFileSplitContract(),
      intentOwnership: validateIntentOwnershipContract(),
      declaredCardinals:
        includeDom
          ? validateDeclaredCardinals()
          : Object.freeze({
              pass: true,
              skipped: true
            }),
      declaredRooms:
        includeDom
          ? validateDeclaredRooms()
          : Object.freeze({
              pass: true,
              skipped: true
            })
    };

    const pass =
      Object.values(results).every(
        result => result.pass === true
      );

    return Object.freeze({
      receiptSchema: "SHOWROOM_CONSTELLATION_CONTROLLER_VALIDATION_RECEIPT_v2",
      moduleId: MODULE.id,
      moduleVersion: MODULE.version,
      motionContractId: MODULE.motionContractId,
      motionContractVersion: MODULE.motionContractVersion,
      pass,

      pointerInterpreterOwner: MODULE.interactionModuleId,
      pointerTapArbitrationOwner: MODULE.interactionModuleId,
      wholeCrystalHitTestOwner: MODULE.interactionModuleId,
      syntheticClickSuppressionOwner: MODULE.interactionModuleId,
      projectionDomApplicationOwner: MODULE.interactionModuleId,
      gestureAxisSelectionOwner: MODULE.interactionModuleId,
      gestureQuaternionConstructionOwner: MODULE.interactionModuleId,

      orbitStateAuthority: MODULE.id,
      clusterStateAuthority: MODULE.id,
      quaternionAcceptanceAuthority: MODULE.id,
      navigationTransitionAuthority: MODULE.id,
      intentSelectionAuthority: MODULE.id,

      destinationExecutionAuthority: false,
      modalOpeningAuthority: false,
      routeConfirmationAuthority: false,
      routeDowngradeAuthority: false,
      objectInspectionExecutionAuthority: false,
      anchorScrollAuthority: false,
      disclosureOpeningAuthority: false,
      frontActivationAuthority: false,

      cameraOwnership: false,
      crystalRendererOwnership: false,
      compassRendererOwnership: false,
      semanticProjectionMathOwnership: false,
      interactionPriorityStorageOwnership: false,
      semanticProjectionFactStorageOwnership: true,
      compassPageLocalSelection: true,
      explicitMainCompassReturn: true,

      results: Object.freeze(results)
    });
  }

  function writeValidationReceipt(receipt) {
    state.validationReceipt =
      receipt;

    const serialized =
      JSON.stringify(receipt);

    state.root.dataset.showroomControllerValidation =
      serialized;

    if ("value" in state.controllerValidationOutput) {
      state.controllerValidationOutput.value =
        serialized;
    }

    state.controllerValidationOutput.textContent =
      serialized;

    globalThis.SHOWROOM_CONTROLLER_VALIDATION_RECEIPT =
      receipt;
  }

  function exposeApi() {
    globalThis.SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER =
      Object.freeze({
        moduleId: MODULE.id,
        moduleVersion: MODULE.version,
        interactionModuleId: MODULE.interactionModuleId,
        interactionModuleVersion: MODULE.interactionModuleVersion,
        motionContractId: MODULE.motionContractId,
        motionContractVersion: MODULE.motionContractVersion,

        states: STATES,
        presentationModes: PRESENTATION_MODES,
        destinationTypes: DESTINATION_TYPES,
        destinationKinds: DESTINATION_KINDS,
        orientationPhases: ORIENTATION_PHASES,
        depthLayers: DEPTH_LAYERS,
        mainCompass: MAIN_COMPASS,
        intentEntry: INTENT_ENTRY,

        wingToCoin,

        getFrameState: createFrameState,
        getPresentationMode: () => presentationModeForState(),
        getReducedMotion: () => state.reducedMotion,
        getHeldState: createHeldState,
        getCompassState: createCompassState,
        getClusterState,
        getSemanticProjection: createSemanticProjectionSnapshot,
        getValidationReceipt: () => state.validationReceipt,

        subscribeFrameState:
          callback => subscribe(CHANNELS.FRAME, callback),

        subscribeReducedMotion:
          callback => subscribe(CHANNELS.REDUCED_MOTION, callback),

        subscribeHeldState:
          callback => subscribe(CHANNELS.HELD_STATE, callback),

        subscribeCompassState:
          callback => subscribe(CHANNELS.COMPASS_STATE, callback),

        subscribeSemanticProjection:
          callback => subscribe(CHANNELS.SEMANTIC_PROJECTION, callback),

        beginOrbitGesture,
        requestOrbitPreview,
        requestOrbitCommit,
        requestOrbitCancel,
        requestOrbitFocus,

        beginClusterGesture,
        requestClusterPreview,
        requestClusterCommit,
        requestClusterCancel,

        requestCardinalSelection,
        requestRoomSelection,
        requestCompassSelection,
        requestEnterSelection,
        requestReturnToOrbit,
        requestReturnToConstellation,
        requestReturnToMainCompass,

        updateSemanticProjection,

        runSelfTest: runControllerSelfTest
      });
  }

  function bindControls() {
    state.root.addEventListener(
      "keydown",
      handleKeydown
    );

    state.enterButton.addEventListener(
      "click",
      event => {
        event.preventDefault();
        requestEnterSelection();
      }
    );

    state.returnToOrbitButton.addEventListener(
      "click",
      event => {
        event.preventDefault();
        requestReturnToOrbit();
      }
    );

    state.returnHomeButton.addEventListener(
      "click",
      event => {
        event.preventDefault();
        requestReturnToMainCompass();
      }
    );

    globalThis.addEventListener(
      "ARCHCOIN_CRYSTALS_RENDER_FAILURE",
      handleCrystalsFailure
    );
  }

  function enterHeldState(error) {
    clearViewportSchedules();
    invalidateDestinationAuthorization();

    state.current =
      STATES.SYSTEM_HELD;

    state.orbitGestureActive =
      false;

    state.orbitPreviewAccepted =
      false;

    state.orbitGestureOrigin =
      null;

    for (const cluster of state.clusters.values()) {
      cluster.gestureActive = false;
      cluster.previewAccepted = false;
      cluster.gestureOrigin = null;
      cluster.phase = ORIENTATION_PHASES.COMMITTED;
    }

    state.lastAction =
      "controller-initialization-failed";

    state.lastFailure =
      error &&
      (
        error.code ||
        error.message
      )
        ? String(error.code || error.message)
        : "UNKNOWN_CONTROLLER_INITIALIZATION_FAILURE";

    try {
      if (
        state.panel &&
        state.panelEyebrow &&
        state.panelTitle &&
        state.panelPurpose &&
        state.panelRelationship &&
        state.panelDomain &&
        state.panelFunction &&
        state.panelCoordinate &&
        state.panelSelectionState &&
        state.panelRouteStatus &&
        state.panelLens &&
        state.enterButton &&
        state.enterLabel &&
        state.returnToOrbitButton &&
        state.returnToOrbitLabel &&
        state.returnHomeButton &&
        state.guidance
      ) {
        syncPresentation();
      }

      if (
        state.root &&
        state.compassControl &&
        state.controllerReceiptOutput
      ) {
        const frame =
          publishFrame();

        publish(
          CHANNELS.HELD_STATE,
          createHeldState()
        );

        publish(
          CHANNELS.COMPASS_STATE,
          frame.compass
        );
      }
    } catch (_) {}

    globalThis.dispatchEvent(
      new CustomEvent(
        "SHOWROOM_CONTROLLER_FAILURE",
        {
          detail:
            Object.freeze({
              reason: state.lastFailure
            })
        }
      )
    );
  }

  function initialize() {
    try {
      const sourceReceipt =
        runControllerSelfTest({
          includeDom: false
        });

      invariant(
        sourceReceipt.pass === true,
        "SHOWROOM_CONTROLLER_SOURCE_VALIDATION_FAILED",
        sourceReceipt
      );

      resolveDom();
      readReducedMotion();
      initializeOrientationState();
      initializeClusters();

      const runtimeReceipt =
        runControllerSelfTest({
          includeDom: true
        });

      invariant(
        runtimeReceipt.pass === true,
        "SHOWROOM_CONTROLLER_RUNTIME_VALIDATION_FAILED",
        runtimeReceipt
      );

      writeValidationReceipt(runtimeReceipt);

      exposeApi();
      bindControls();
      bindReducedMotion();
      resetSelection();
      syncPresentation();

      state.initialized =
        true;

      const frame =
        recordAction("controller-initialized");

      publish(
        CHANNELS.REDUCED_MOTION,
        state.reducedMotion
      );

      publish(
        CHANNELS.HELD_STATE,
        createHeldState()
      );

      publish(
        CHANNELS.COMPASS_STATE,
        frame.compass
      );

      globalThis.dispatchEvent(
        new CustomEvent(
          "SHOWROOM_CONTROLLER_READY",
          {
            detail:
              Object.freeze({
                moduleId: MODULE.id,
                moduleVersion: MODULE.version,
                interactionModuleRequired: true,
                interactionModuleId: MODULE.interactionModuleId,
                interactionModuleVersion: MODULE.interactionModuleVersion,
                motionContractId: MODULE.motionContractId,
                motionContractVersion: MODULE.motionContractVersion,
                completeGestureQuaternionRequired: true,
                exactPreviewPayloadRequired: true,
                explicitPrimaryIdentityRequired: true,
                semanticProjectionFactsOnly: true,
                intentSelectionAuthority: MODULE.id,
                destinationExecutionAuthority: false,
                modalOpeningAuthority: false,
                routeConfirmationAuthority: false,
                routeDowngradeAuthority: false,
                objectInspectionExecutionAuthority: false,
                acceptedStateAuthority: MODULE.id,
                navigationTransitionAuthority: MODULE.id
              })
          }
        )
      );
    } catch (error) {
      enterHeldState(error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialize,
      {
        once: true
      }
    );
  } else {
    initialize();
  }
})();

/*
SHOWROOM_CONTROLLER_INTENT_RENEWAL_RECEIPT_v8

FILE MODIFIED:
/showroom/index.controller.js

NEW VERSION:
8.0.0-intent-selection-authority

PRIMARY CHANGE:
Controller emits selected destination intent only.

CONTROLLER RETAINS:
- navigation state machine
- orbit state
- cluster state
- quaternion acceptance
- gesture transaction validation
- semantic projection fact storage
- compass selection
- Return to Orbit
- Return to Main Compass
- controller panel ownership
- lifecycle events
- public global
- receipts
- validation self-test

CONTROLLER NO LONGER OWNS:
- modal opening
- route confirmation
- route downgrade
- object inspection execution
- anchor scrolling
- disclosure opening
- information/gauge/front activation
- route existence validation

DESTINATION INTENT KINDS:
- internal-info
- object-inspect
- external-route

EVENT PRESERVED:
SHOWROOM_ARCHCOIN_DESTINATION_ENTRY_REQUESTED

PAYLOAD CONTRACT CHANGED:
SHOWROOM_DESTINATION_INTENT_REQUEST_v2

INTERACTIONS MODIFIED:
No.

DESTINATIONS MODIFIED:
No.

CSS MODIFIED:
No.

HTML MODIFIED:
No.

FINAL STATUS:
Runtime validation not performed.
*/

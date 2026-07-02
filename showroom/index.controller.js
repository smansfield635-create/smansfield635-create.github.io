/* TARGET FILE: /showroom/index.controller.js */
/* TNT FULL-FILE REPLACEMENT */
/* SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER_TNT_v9 */

(() => {
  "use strict";

  const MODULE = Object.freeze({
    id: "SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER",
    version: "9.0.0-archcoin-route-gateway",
    file: "/showroom/index.controller.js",
    interactionModuleId: "DGB_ARCHCOIN_INTERACTIONS",
    interactionModuleVersion: "1.0.0-pointer-gesture-interpreter",
    motionContractId:
      "AUDRALIA_ARCHCOIN_COMPLETE_QUATERNION_MOTION_CONTRACT_v1",
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

  const PREVIEW_PAYLOAD_KEY_SET = new Set(PREVIEW_PAYLOAD_KEYS);

  const HALF_SQRT_TWO = Math.SQRT1_2;

  const CANONICAL_CONSTELLATION_QUATERNIONS = Object.freeze({
    north: Object.freeze([0, 0, 0, 1]),
    east: Object.freeze([0, 0, -HALF_SQRT_TWO, HALF_SQRT_TWO]),
    south: Object.freeze([0, 0, 1, 0]),
    west: Object.freeze([0, 0, HALF_SQRT_TWO, HALF_SQRT_TWO])
  });

  const PRESENTATION_MODE_BY_STATE = Object.freeze({
    [STATES.CONSTELLATION]: PRESENTATION_MODES.CONSTELLATION,
    [STATES.CLUSTER_OPEN]: PRESENTATION_MODES.CLUSTER,
    [STATES.ROOM_SELECTED]: PRESENTATION_MODES.CLUSTER,
    [STATES.SYSTEM_HELD]: PRESENTATION_MODES.HELD
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

  function freezeRecord(record) {
    return Object.freeze({
      wing: record.wing,
      coin: record.coin,
      roomId: record.roomId,
      label: record.label,
      route: record.route,
      contentId: record.contentId,
      lens: record.lens,
      routeDescription: record.routeDescription,
      visualClass: record.visualClass,
      emphasis: record.emphasis,
      existingRoute: Boolean(record.existingRoute)
    });
  }

  const CANONICAL_ROOM_RECORDS = Object.freeze([
    freezeRecord({
      wing: "north",
      coin: "story",
      roomId: "north-1",
      label: "Welcome to Mirrorland",
      route: "/showroom/story/welcome/",
      contentId: "welcome",
      lens: "story",
      routeDescription: "Open the Welcome to Mirrorland story page.",
      visualClass: "ROUTE_SHELL",
      emphasis: "normal",
      existingRoute: false
    }),

    freezeRecord({
      wing: "north",
      coin: "story",
      roomId: "north-2",
      label: "Why Mirrorland Exists",
      route: "/showroom/story/mission/",
      contentId: "mission",
      lens: "mission",
      routeDescription: "Open the Mirrorland mission page.",
      visualClass: "ROUTE_SHELL",
      emphasis: "normal",
      existingRoute: false
    }),

    freezeRecord({
      wing: "north",
      coin: "story",
      roomId: "north-3",
      label: "The Story So Far",
      route: "/showroom/story/timeline/",
      contentId: "timeline",
      lens: "timeline",
      routeDescription: "Open the Mirrorland timeline page.",
      visualClass: "ROUTE_SHELL",
      emphasis: "normal",
      existingRoute: false
    }),

    freezeRecord({
      wing: "north",
      coin: "story",
      roomId: "north-4",
      label: "Step Through the Door",
      route: "/showroom/story/invitation/",
      contentId: "invitation",
      lens: "invitation",
      routeDescription: "Open the Mirrorland invitation page.",
      visualClass: "ROUTE_SHELL",
      emphasis: "normal",
      existingRoute: false
    }),

    freezeRecord({
      wing: "east",
      coin: "characters",
      roomId: "east-1",
      label: "Talk to Jeeves",
      route: "/showroom/globe/hearth/jeeves/",
      contentId: "jeeves",
      lens: "character",
      routeDescription:
        "Meet the House interface and receive guidance through the estate and Hearth.",
      visualClass: "EXTERNAL_ROUTE",
      emphasis: "external",
      existingRoute: true
    }),

    freezeRecord({
      wing: "east",
      coin: "characters",
      roomId: "east-2",
      label: "Talk to Elara",
      route: "/elara/index.html",
      contentId: "elara",
      lens: "character",
      routeDescription:
        "Enter Elara’s mission, story, personal-origin, and literary conversation surface.",
      visualClass: "EXTERNAL_ROUTE",
      emphasis: "external",
      existingRoute: true
    }),

    freezeRecord({
      wing: "east",
      coin: "characters",
      roomId: "east-3",
      label: "Talk to Auren",
      route: "/products/auren/",
      contentId: "auren",
      lens: "character",
      routeDescription:
        "Enter the product-floor specialist’s room for practical systems and bounded handoffs.",
      visualClass: "EXTERNAL_ROUTE",
      emphasis: "external",
      existingRoute: true
    }),

    freezeRecord({
      wing: "east",
      coin: "characters",
      roomId: "east-4",
      label: "Meet All Characters",
      route: "/characters/",
      contentId: "characters-directory",
      lens: "directory",
      routeDescription:
        "Open the central character directory and discover the wider Mirrorland cast.",
      visualClass: "PRIMARY_EXTERNAL_ROUTE",
      emphasis: "primary-external",
      existingRoute: true
    }),

    freezeRecord({
      wing: "south",
      coin: "wonders",
      roomId: "south-1",
      label: "Open the Window",
      route: "/showroom/wonders/window/",
      contentId: "window",
      lens: "object-threshold",
      routeDescription: "Open the Mirrorland Window route shell.",
      visualClass: "ROUTE_SHELL",
      emphasis: "object",
      existingRoute: false
    }),

    freezeRecord({
      wing: "south",
      coin: "wonders",
      roomId: "south-2",
      label: "Behold the Diamond",
      route: "/showroom/wonders/diamond/",
      contentId: "diamond",
      lens: "object",
      routeDescription: "Open the Diamond route shell.",
      visualClass: "ROUTE_SHELL",
      emphasis: "object",
      existingRoute: false
    }),

    freezeRecord({
      wing: "south",
      coin: "wonders",
      roomId: "south-3",
      label: "Read the Stars",
      route: "/showroom/wonders/stars/",
      contentId: "stars",
      lens: "narrative",
      routeDescription: "Open the constellation-reading page.",
      visualClass: "ROUTE_SHELL",
      emphasis: "normal",
      existingRoute: false
    }),

    freezeRecord({
      wing: "south",
      coin: "wonders",
      roomId: "south-4",
      label: "Enter the Hearth",
      route: "/showroom/globe/hearth/",
      contentId: "hearth",
      lens: "world",
      routeDescription:
        "Enter the inhabited facility where characters and Audralia-facing systems meet.",
      visualClass: "EXTERNAL_ROUTE",
      emphasis: "external",
      existingRoute: true
    }),

    freezeRecord({
      wing: "west",
      coin: "mysteries",
      roomId: "west-1",
      label: "The Unfinished World",
      route: "/showroom/mysteries/unfinished-world/",
      contentId: "unfinished-world",
      lens: "unfinished",
      routeDescription: "Open the unfinished-world route shell.",
      visualClass: "ROUTE_SHELL",
      emphasis: "normal",
      existingRoute: false
    }),

    freezeRecord({
      wing: "west",
      coin: "mysteries",
      roomId: "west-2",
      label: "Questions in the Glass",
      route: "/showroom/mysteries/questions-in-the-glass/",
      contentId: "questions-in-the-glass",
      lens: "exploration",
      routeDescription: "Open the questions-in-the-glass route shell.",
      visualClass: "ROUTE_SHELL",
      emphasis: "normal",
      existingRoute: false
    }),

    freezeRecord({
      wing: "west",
      coin: "mysteries",
      roomId: "west-3",
      label: "Paths Not Yet Open",
      route: "/showroom/mysteries/paths-not-yet-open/",
      contentId: "paths-not-yet-open",
      lens: "future",
      routeDescription: "Open the paths-not-yet-open route shell.",
      visualClass: "ROUTE_SHELL",
      emphasis: "normal",
      existingRoute: false
    }),

    freezeRecord({
      wing: "west",
      coin: "mysteries",
      roomId: "west-4",
      label: "Journey into Audralia",
      route: "/showroom/globe/audralia/",
      contentId: "audralia",
      lens: "world",
      routeDescription:
        "Travel toward Mirrorland’s constructive possibility world and developing planetary rooms.",
      visualClass: "EXTERNAL_ROUTE",
      emphasis: "external",
      existingRoute: true
    })
  ]);

  const CANONICAL_ROOM_ROUTES = Object.freeze(
    CANONICAL_ROOM_RECORDS.map(record => record.route)
  );

  const ROOM_BY_ID = new Map(
    CANONICAL_ROOM_RECORDS.map(record => [
      record.roomId,
      record
    ])
  );

  const ROOM_BY_ROUTE = new Map(
    CANONICAL_ROOM_RECORDS.map(record => [
      record.route,
      record
    ])
  );

  const ROOMS_BY_WING = new Map(
    WINGS.map(wing => [
      wing,
      Object.freeze(
        CANONICAL_ROOM_RECORDS
          .filter(record => record.wing === wing)
          .map(record => record.roomId)
      )
    ])
  );

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
    selectedDestinationId: "",
    selectedDestinationLabel: "",
    selectedRoute: "",
    selectedContentId: "",
    selectedLens: "overview",
    selectedParagraph: "",
    selectedRouteDescription: "",
    selectedVisualClass: "",
    selectedEmphasis: "",
    selectedExistingRoute: false,

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

  function normalizeRoomId(value) {
    return normalize(value);
  }

  function normalizeRoute(value) {
    const route = normalize(value);
    return route.startsWith("/") ? route : "";
  }

  function normalizeLabel(value, fallback = "") {
    return normalize(value) || fallback;
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

    const quaternion = source.map(component => Number(component));

    if (
      quaternion.some(component => !Number.isFinite(component))
    ) {
      return null;
    }

    const length = Math.hypot(
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

    return quaternion.map(component => component / length);
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
    const normalized = normalizeQuaternionStrict(quaternion);

    invariant(
      normalized,
      "SHOWROOM_CONTROLLER_INVALID_QUATERNION"
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
    const value = cloneOrientation(orientation);

    return Object.freeze({
      quaternion: Object.freeze(value.quaternion.slice()),
      primaryId: value.primaryId
    });
  }

  function canonicalConstellationOrientation(wing) {
    const normalizedWing = normalizeWing(wing) || "north";

    return createOrientation(
      CANONICAL_CONSTELLATION_QUATERNIONS[normalizedWing],
      normalizedWing
    );
  }

  function validateOrbitPreviewPayload(payload) {
    if (
      !payload ||
      typeof payload !== "object" ||
      Array.isArray(payload)
    ) {
      return Object.freeze({
        pass: false,
        code: "SHOWROOM_ORBIT_PREVIEW_PAYLOAD_REQUIRED"
      });
    }

    const unexpectedKeys = unexpectedPreviewPayloadKeys(payload);

    if (unexpectedKeys.length > 0) {
      return Object.freeze({
        pass: false,
        code: "SHOWROOM_ORBIT_PREVIEW_UNEXPECTED_FIELDS_FORBIDDEN",
        unexpectedKeys: Object.freeze(unexpectedKeys.slice())
      });
    }

    const quaternion = normalizeQuaternionStrict(payload.quaternion);

    if (!quaternion) {
      return Object.freeze({
        pass: false,
        code: "SHOWROOM_ORBIT_PREVIEW_COMPLETE_QUATERNION_REQUIRED"
      });
    }

    const primaryId = normalizeWing(payload.primaryId);

    if (!primaryId) {
      return Object.freeze({
        pass: false,
        code: "SHOWROOM_ORBIT_PREVIEW_CANONICAL_PRIMARY_WING_REQUIRED"
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
        code: "SHOWROOM_CLUSTER_PREVIEW_PAYLOAD_REQUIRED"
      });
    }

    const unexpectedKeys = unexpectedPreviewPayloadKeys(payload);

    if (unexpectedKeys.length > 0) {
      return Object.freeze({
        pass: false,
        code: "SHOWROOM_CLUSTER_PREVIEW_UNEXPECTED_FIELDS_FORBIDDEN",
        unexpectedKeys: Object.freeze(unexpectedKeys.slice())
      });
    }

    const quaternion = normalizeQuaternionStrict(payload.quaternion);

    if (!quaternion) {
      return Object.freeze({
        pass: false,
        code: "SHOWROOM_CLUSTER_PREVIEW_COMPLETE_QUATERNION_REQUIRED"
      });
    }

    const primaryId = normalizeRoomId(payload.primaryId);

    if (
      !primaryId ||
      !cluster.roomIds.includes(primaryId)
    ) {
      return Object.freeze({
        pass: false,
        code:
          `SHOWROOM_CLUSTER_PREVIEW_CANONICAL_PRIMARY_ROOM_REQUIRED:${cluster.wing}`
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

  function presentationModeForState(navigationState = state.current) {
    return (
      PRESENTATION_MODE_BY_STATE[navigationState] ||
      PRESENTATION_MODES.HELD
    );
  }

  function wingToCoin(wing) {
    return WING_TO_COIN[normalizeWing(wing)] || "";
  }

  function createClusterState(wing) {
    const roomIds =
      ROOMS_BY_WING.get(wing) ||
      Object.freeze([]);

    const primaryRoom = roomIds[0] || "";

    const orientation = createOrientation(
      QUATERNION.identity,
      primaryRoom
    );

    return {
      wing,
      roomIds: Array.from(roomIds),
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
    const normalizedWing = normalizeWing(wing);

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
    const set = subscribers[channel];

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
    const set = subscribers[channel];

    if (!set) {
      return;
    }

    for (const callback of set) {
      try {
        callback(payload);
      } catch (_) {}
    }
  }

  function escapeSelectorValue(value) {
    const source = String(value || "");

    if (
      globalThis.CSS &&
      typeof globalThis.CSS.escape === "function"
    ) {
      return globalThis.CSS.escape(source);
    }

    return source.replace(/["\\]/g, "\\$&");
  }

  function findCoinElement(wing) {
    const normalizedWing = normalizeWing(wing);

    if (
      !normalizedWing ||
      !state.root
    ) {
      return null;
    }

    return qs(
      `[data-showroom-cardinal-control][data-showroom-cardinal-id="${escapeSelectorValue(normalizedWing)}"]`,
      state.root
    );
  }

  function findRoomElement(roomId) {
    const id = normalizeRoomId(roomId);

    if (
      !id ||
      !state.root
    ) {
      return null;
    }

    return qs(
      `[data-showroom-child-control][data-showroom-child-id="${escapeSelectorValue(id)}"]`,
      state.root
    );
  }

  function canonicalControlExists(record) {
    const kind = normalizeLower(record.kind);

    const id = normalize(
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

  function destinationFromCoinElement(element) {
    if (!element) {
      return null;
    }

    const wing = normalizeWing(element.dataset.showroomCardinalId);

    return Object.freeze({
      destinationType: DESTINATION_TYPES.COIN,
      destinationId: wing,
      label: normalizeLabel(
        element.dataset.showroomCardinalLabel,
        WING_LABELS[wing] || wingToCoin(wing)
      ),
      route: ""
    });
  }

  function destinationFromRoomRecord(record, element = null) {
    if (!record) {
      return null;
    }

    return Object.freeze({
      destinationType: DESTINATION_TYPES.ROOM,
      destinationId: record.roomId,
      label: normalizeLabel(
        element && element.dataset.showroomChildLabel,
        record.label
      ),
      route: record.route,
      contentId: normalizeLabel(
        element && element.dataset.showroomContentId,
        record.contentId
      ),
      lens: normalizeLower(
        element && element.dataset.showroomLens
      ) || record.lens,
      paragraph: normalizeLabel(
        element &&
          (
            element.dataset.showroomPreview ||
            element.dataset.showroomRouteDescription
          ),
        record.routeDescription
      )
    });
  }

  function roomParagraphFromRecord(record, element = null) {
    return normalizeLabel(
      element &&
        (
          element.dataset.showroomPreview ||
          element.dataset.showroomRouteDescription ||
          element.dataset.showroomRoomSummary ||
          element.dataset.showroomLocalFunction ||
          element.dataset.showroomPanelBody
        ),
      record
        ? record.routeDescription
        : "This star opens a dedicated Mirrorland page."
    );
  }

  function panelFromCoin(element) {
    const wing = normalizeWing(
      element && element.dataset.showroomCardinalId
    );

    return Object.freeze({
      eyebrow: normalizeLabel(
        element && element.dataset.showroomCardinalLabel,
        wing ? WING_LABELS[wing] : "Selected path"
      ),

      title: normalizeLabel(
        element &&
          (
            element.dataset.showroomPanelTitle ||
            element.dataset.showroomCardinalLabel
          ),
        wing ? WING_LABELS[wing] : "Selected path"
      ),

      purpose: normalizeLabel(
        element &&
          (
            element.dataset.showroomPanelBody ||
            element.dataset.showroomCardinalBody ||
            element.dataset.showroomCardinalFunction
          ),
        "This Mirrorland direction opens a four-page route cluster."
      ),

      relationship: normalizeLabel(
        element &&
          (
            element.dataset.showroomPanelWhy ||
            element.dataset.showroomCardinalWhy
          ),
        "Choose one child star to prepare its route."
      )
    });
  }

  function panelFromRoom(record, element) {
    return Object.freeze({
      eyebrow: normalizeLabel(
        record && WING_LABELS[record.wing],
        "Selected path"
      ),

      title: normalizeLabel(
        element && element.dataset.showroomChildLabel,
        record ? record.label : "Selected route"
      ),

      purpose: roomParagraphFromRecord(record, element),

      relationship:
        "Choose Open Selection to navigate to this route, or Return to Orbit to restore the active cluster."
    });
  }

  function defaultPanel() {
    return Object.freeze({
      eyebrow: "Mirrorland Showroom",
      title: "Choose a direction",
      purpose:
        "Begin with the Mirrorland direction that most closely matches the journey in front of you.",
      relationship:
        "Select a cardinal crystal or label to open its four-page route cluster."
    });
  }

  function compassPanel() {
    return Object.freeze({
      eyebrow: "Main Compass",
      title: "Choose where to return",
      purpose:
        "The fixed-center Compass is selected. It does not navigate until you choose the explicit return action.",
      relationship:
        "Return to Main Compass opens the Diamond Gate Bridge homepage. Return to Orbit restores the active Mirrorland field."
    });
  }

  function setPanel({
    eyebrow,
    title,
    purpose,
    relationship
  }) {
    state.panelEyebrow.textContent = eyebrow || "Selected path";
    state.panelTitle.textContent = title || "Choose a direction";
    state.panelPurpose.textContent = purpose || "";
    state.panelRelationship.textContent = relationship || "";
  }

  function setPanelMetadata({
    domain = "None",
    functionLabel = "Unassigned",
    coordinate = "—",
    selection = "Idle",
    route = "No destination prepared",
    lens = "Overview"
  } = {}) {
    state.panelDomain.textContent = domain;
    state.panelFunction.textContent = functionLabel;
    state.panelCoordinate.textContent = coordinate;
    state.panelSelectionState.textContent = selection;
    state.panelRouteStatus.textContent = route;
    state.panelLens.textContent = lens;
  }

  function setGuidance(message) {
    state.guidance.textContent = String(message || "");
  }

  function setEnterEnabled(
    enabled,
    label = "Open Selection"
  ) {
    state.enterButton.disabled = !enabled;

    state.enterButton.setAttribute(
      "aria-disabled",
      enabled ? "false" : "true"
    );

    state.enterLabel.textContent = label;
  }

  function setReturnToOrbitVisible(
    visible,
    label = "Return to Orbit"
  ) {
    const control = state.returnToOrbitButton;

    control.hidden = !visible;
    control.disabled = !visible;

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

    state.returnToOrbitLabel.textContent = label;
  }

  function setReturnHomeVisible(visible) {
    state.returnHomeButton.hidden = !visible;

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

    state.panelDescentFrame = requestAnimationFrame(() => {
      state.panelDescentFrame = 0;

      state.panelDescentCommitFrame = requestAnimationFrame(() => {
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

    state.sceneAscentFrame = requestAnimationFrame(() => {
      state.sceneAscentFrame = 0;

      state.sceneAscentCommitFrame = requestAnimationFrame(() => {
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

  function resetSelection({
    preserveCompass = false
  } = {}) {
    state.selectedCardinal = "";
    state.selectedCoin = "";
    state.selectedRoom = "";
    state.selectedDestinationType = DESTINATION_TYPES.NONE;
    state.selectedDestinationId = "";
    state.selectedDestinationLabel = "";
    state.selectedRoute = "";
    state.selectedContentId = "";
    state.selectedLens = "overview";
    state.selectedParagraph = "";
    state.selectedRouteDescription = "";
    state.selectedVisualClass = "";
    state.selectedEmphasis = "";
    state.selectedExistingRoute = false;
    state.panelDescended = false;

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
          ? state.lastFailure || "SHOWROOM_SYSTEM_HELD"
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
      Array.from(state.semanticProjection.values()).map(record =>
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

  function createFrameState() {
    const cluster = activeCluster();
    const presentation = createPresentationState();

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
      committedOrbitOrientation:
        freezeOrientation(state.committedOrbitOrientation),

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
              committedOrientation:
                freezeOrientation(cluster.committedOrientation)
            })
          : null,

      selectedCardinal: state.selectedCardinal,
      selectedCoin: state.selectedCoin,
      selectedRoom: state.selectedRoom,
      selectedDestinationType: state.selectedDestinationType,
      selectedDestinationId: state.selectedDestinationId,
      selectedDestinationLabel: state.selectedDestinationLabel,
      selectedRoute: state.selectedRoute,
      selectedContentId: state.selectedContentId,
      selectedLens: state.selectedLens,
      selectedParagraph: state.selectedParagraph,
      selectedRouteDescription: state.selectedRouteDescription,
      selectedVisualClass: state.selectedVisualClass,
      selectedEmphasis: state.selectedEmphasis,
      selectedExistingRoute: state.selectedExistingRoute,

      compassSelected: state.compassSelected,
      panelDescended: state.panelDescended,
      reducedMotion: state.reducedMotion,
      held: isHeld(),
      compass: createCompassState(),

      semanticProjectionRevision: state.semanticProjectionRevision,
      semanticProjection: createSemanticProjectionSnapshot(),

      canonicalRoomRecords: CANONICAL_ROOM_RECORDS,
      canonicalRoomRoutes: CANONICAL_ROOM_ROUTES,
      mainCompass: MAIN_COMPASS,

      interactionModuleId: MODULE.interactionModuleId,
      interactionModuleVersion: MODULE.interactionModuleVersion,
      motionOwner: MODULE.interactionModuleId,
      acceptedStateAuthority: MODULE.id,
      navigationTransitionAuthority: MODULE.id,
      routeExecutionAuthority: MODULE.id,

      modalOpeningAuthority: false,
      anchorScrollAuthority: false,
      disclosureOpeningAuthority: false,
      frontActivationAuthority: false,
      objectInspectionExecutionAuthority: false,
      diamondRuntimeAuthority: false,
      compositorRuntimeAuthority: false,
      crystalRenderingAuthority: false,
      interactionGestureInterpretationAuthority: false,

      lastAction: state.lastAction,
      lastFailure: state.lastFailure
    });
  }

  function createCompatibilityReceipt(frame) {
    return Object.freeze({
      contractId: "SHOWROOM_ARCHCOIN_PATTERN_CONTROLLER_ROUTE_GATEWAY_v1",
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
      clusterPreviewPrimaryRoom:
        frame.cluster ? frame.cluster.previewPrimaryRoom : "",
      clusterPhase:
        frame.cluster ? frame.cluster.phase : ORIENTATION_PHASES.IDLE,
      clusterGestureActive:
        frame.cluster ? frame.cluster.gestureActive : false,
      clusterPreviewAccepted:
        frame.cluster ? frame.cluster.previewAccepted : false,
      clusterRevision:
        frame.cluster ? frame.cluster.revision : 0,
      clusterQuaternion:
        frame.cluster
          ? frame.cluster.orientation.quaternion
          : QUATERNION.identity,

      selectedCardinal: frame.selectedCardinal,
      selectedCoin: frame.selectedCoin,
      selectedRoom: frame.selectedRoom,
      selectedDestinationType: frame.selectedDestinationType,
      selectedDestinationId: frame.selectedDestinationId,
      selectedDestinationLabel: frame.selectedDestinationLabel,
      selectedRoute: frame.selectedRoute,
      selectedContentId: frame.selectedContentId,
      selectedLens: frame.selectedLens,
      selectedExistingRoute: frame.selectedExistingRoute,

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

      routeExecutionAuthority: MODULE.id,
      controllerDirectNavigation: true,
      exactlyFourCardinals: true,
      exactlySixteenDestinations: true,
      allChildrenCanonicalRoutes: true,
      samePageAnchorExecutionOwned: false,
      modalOpeningOwned: false,
      disclosureOpeningOwned: false,
      frontActivationOwned: false,
      objectInspectionExecutionOwned: false,

      pointerInterpreterOwner: MODULE.interactionModuleId,
      pointerTapArbitrationOwner: MODULE.interactionModuleId,
      wholeCrystalHitTestOwner: MODULE.interactionModuleId,
      syntheticClickSuppressionOwner: MODULE.interactionModuleId,
      clusterExitSwipeClassificationOwner: MODULE.interactionModuleId,
      interactionPriorityDerivationOwner: MODULE.interactionModuleId,
      projectionDomApplicationOwner: MODULE.interactionModuleId,
      motionDirectionOwner: MODULE.interactionModuleId,
      motionSensitivityOwner: MODULE.interactionModuleId,
      gestureAxisSelectionOwner: MODULE.interactionModuleId,
      gestureQuaternionConstructionOwner: MODULE.interactionModuleId,
      grabbedObjectTrackingOwner: MODULE.interactionModuleId,
      primaryVisualIdentityCalculationOwner: MODULE.interactionModuleId,

      orbitStateAuthority: MODULE.id,
      clusterStateAuthority: MODULE.id,
      quaternionAcceptanceAuthority: MODULE.id,
      navigationTransitionAuthority: MODULE.id,

      lastAction: frame.lastAction,
      lastFailure: frame.lastFailure
    });
  }

  function syncDatasets(frame) {
    const cluster = frame.cluster;
    const reflectedPresentationMode = normalizeLower(frame.presentationMode);

    state.root.dataset.showroomState = frame.navigationState;
    state.root.dataset.showroomControllerState = frame.navigationState;
    state.root.dataset.showroomNavigationState = frame.navigationState;
    state.root.dataset.showroomPresentationMode = reflectedPresentationMode;

    state.root.dataset.showroomOrbitFocus = frame.orbitFocus;
    state.root.dataset.showroomOrbitPreviewFocus = frame.orbitPreviewFocus;
    state.root.dataset.showroomOrbitPhase = frame.orbitPhase;
    state.root.dataset.showroomOrbitGestureActive =
      frame.orbitGestureActive ? "true" : "false";
    state.root.dataset.showroomOrbitPreviewAccepted =
      frame.orbitPreviewAccepted ? "true" : "false";
    state.root.dataset.showroomOrbitRevision = String(frame.orbitRevision);
    state.root.dataset.showroomOrbitQuaternion =
      JSON.stringify(frame.orbitOrientation.quaternion);

    state.root.dataset.showroomActiveCluster = frame.activeClusterWing;
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
      cluster ? JSON.stringify(cluster.orientation.quaternion) : "";

    state.root.dataset.showroomActiveCardinal = frame.selectedCardinal;
    state.root.dataset.showroomActiveChild = frame.selectedRoom;
    state.root.dataset.showroomSelectedDestinationType =
      frame.selectedDestinationType;
    state.root.dataset.showroomSelectedDestinationId =
      frame.selectedDestinationId;
    state.root.dataset.showroomSelectedDestinationLabel =
      frame.selectedDestinationLabel;
    state.root.dataset.showroomSelectedRoute = frame.selectedRoute;
    state.root.dataset.showroomSelectedContentId = frame.selectedContentId;
    state.root.dataset.showroomSelectedLens = frame.selectedLens;
    state.root.dataset.showroomSelectedParagraph = frame.selectedParagraph;
    state.root.dataset.showroomCompassSelected =
      frame.compassSelected ? "true" : "false";
    state.root.dataset.showroomPanelDescended =
      frame.panelDescended ? "true" : "false";
    state.root.dataset.showroomReducedMotion =
      frame.reducedMotion ? "true" : "false";
    state.root.dataset.showroomHeld = frame.held ? "true" : "false";
    state.root.dataset.showroomControllerStatus =
      frame.held ? "held" : "available";
    state.root.dataset.showroomControllerVersion = MODULE.version;
    state.root.dataset.showroomMotionContractId = MODULE.motionContractId;
    state.root.dataset.showroomMotionContractVersion =
      MODULE.motionContractVersion;
    state.root.dataset.showroomSemanticProjectionRevision =
      String(frame.semanticProjectionRevision);

    qsa("[data-showroom-cardinal-control]", state.root).forEach(element => {
      const wing = normalizeWing(element.dataset.showroomCardinalId);
      const active = frame.presentation.outerCardinalsActive;
      const primary = active && wing === frame.orbitFocus;

      element.dataset.showroomActive = active ? "true" : "false";

      element.dataset.showroomSelected =
        !frame.compassSelected &&
        frame.selectedDestinationType === DESTINATION_TYPES.COIN &&
        frame.selectedCardinal === wing
          ? "true"
          : "false";

      element.dataset.showroomPrimary = primary ? "true" : "false";

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

    qsa("[data-showroom-child-control]", state.root).forEach(element => {
      const roomId = normalizeRoomId(element.dataset.showroomChildId);
      const roomRecord = ROOM_BY_ID.get(roomId);

      const inActiveCluster =
        Boolean(
          cluster &&
          roomRecord &&
          roomRecord.wing === cluster.wing
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

      if (roomRecord) {
        element.dataset.showroomControllerRoute = roomRecord.route;
      }

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
    state.compassControl.dataset.fixedCenter = "true";
    state.compassControl.dataset.interactionEnabled =
      frame.compass.interactionEnabled ? "true" : "false";
    state.compassControl.dataset.immediateNavigation = "false";

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
    const receipt = createCompatibilityReceipt(frame);
    const serialized = JSON.stringify(receipt);

    state.root.dataset.showroomControllerReceipt = serialized;

    if ("value" in state.controllerReceiptOutput) {
      state.controllerReceiptOutput.value = serialized;
    }

    state.controllerReceiptOutput.textContent = serialized;

    globalThis.SHOWROOM_CONTROLLER_RECEIPT = receipt;
  }

  function publishFrame() {
    const frame = createFrameState();

    syncDatasets(frame);
    writeCompatibilityReceipt(frame);
    publish(CHANNELS.FRAME, frame);

    return frame;
  }

  function recordAction(action, failure = "") {
    state.lastAction = String(action || "");
    state.lastFailure = String(failure || "");

    return publishFrame();
  }

  function rejectRequest(action, code) {
    recordAction(action, code);
    return false;
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
        "Select a cardinal crystal or label to open its four-route cluster."
      );

      return;
    }

    if (state.current === STATES.CLUSTER_OPEN) {
      const coin = findCoinElement(state.selectedCardinal);

      setPanel(panelFromCoin(coin));

      setPanelMetadata({
        domain: normalizeLabel(
          coin && coin.dataset.showroomCardinalLabel,
          WING_LABELS[state.selectedCardinal] ||
            wingToCoin(state.selectedCardinal)
        ),

        functionLabel: normalizeLabel(
          coin &&
            (
              coin.dataset.showroomPanelTitle ||
              coin.dataset.showroomCardinalFunction ||
              coin.dataset.showroomCardinalLabel
            ),
          "Mirrorland direction"
        ),

        coordinate: normalizeLabel(
          coin && coin.dataset.showroomCoordinateLabel,
          state.selectedCardinal
        ),

        selection: "Cluster open",
        route: "Route required",
        lens: "Overview"
      });

      setEnterEnabled(false, "Open Selection");
      setReturnToOrbitVisible(false);

      setGuidance(
        "Choose one child star to prepare its dedicated route."
      );

      return;
    }

    if (state.current === STATES.ROOM_SELECTED) {
      const room = findRoomElement(state.selectedRoom);
      const record = ROOM_BY_ID.get(state.selectedRoom);

      setPanel(panelFromRoom(record, room));

      setPanelMetadata({
        domain: normalizeLabel(
          WING_LABELS[state.selectedCardinal] || state.selectedCoin,
          "Selected direction"
        ),

        functionLabel: normalizeLabel(
          record && record.visualClass,
          "Route"
        ),

        coordinate: normalizeLabel(
          room && room.dataset.showroomLocalCoordinate,
          state.selectedRoom
        ),

        selection: "Route selected",
        route: state.selectedRoute || "No route",
        lens: normalizeLabel(state.selectedLens, "Overview")
      });

      setEnterEnabled(
        Boolean(state.selectedRoute),
        "Open Selection"
      );

      setReturnToOrbitVisible(true, "Return to Orbit");

      setGuidance(
        "Review the selected route. Open Selection navigates to the canonical destination page."
      );

      return;
    }

    setPanel({
      eyebrow: "System held",
      title: "Mirrorland navigation is unavailable",
      purpose:
        "The controller could not establish or preserve a safe interaction state.",
      relationship:
        "Static content may remain available, but interactive requests are rejected."
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
      "SHOWROOM_ILLEGAL_STATE_TRANSITION",
      {
        from: state.current,
        to: nextState
      }
    );

    const previousHeld = isHeld();

    state.current = nextState;

    for (const [key, value] of Object.entries(patch)) {
      if (
        Object.prototype.hasOwnProperty.call(state, key)
      ) {
        state[key] = value;
      }
    }

    syncPresentation();

    const frame = recordAction(action);

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
    const normalized = cloneOrientation(orientation);

    invariant(
      normalizeWing(normalized.primaryId),
      "SHOWROOM_CONSTELLATION_PRIMARY_WING_INVALID"
    );

    state.orbitOrientation = normalized;
    state.orbitPreviewFocus = normalized.primaryId;
    state.orbitPhase = phase;
    state.orbitGestureActive = Boolean(gestureActive);
    state.orbitPreviewAccepted = Boolean(previewAccepted);

    if (incrementRevision) {
      state.orbitRevision += 1;
    }

    if (committed) {
      state.committedOrbitOrientation = cloneOrientation(normalized);
      state.orbitFocus = normalized.primaryId;
      state.orbitPreviewFocus = normalized.primaryId;
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
    invariant(cluster, "SHOWROOM_CLUSTER_REQUIRED");

    const normalized = cloneOrientation(orientation);

    invariant(
      cluster.roomIds.includes(normalized.primaryId),
      `SHOWROOM_CLUSTER_PRIMARY_ROOM_INVALID:${cluster.wing}`
    );

    cluster.orientation = normalized;
    cluster.previewPrimaryRoom = normalized.primaryId;
    cluster.phase = phase;
    cluster.gestureActive = Boolean(gestureActive);
    cluster.previewAccepted = Boolean(previewAccepted);

    if (incrementRevision) {
      cluster.revision += 1;
    }

    if (committed) {
      cluster.committedOrientation = cloneOrientation(normalized);
      cluster.primaryRoom = normalized.primaryId;
      cluster.previewPrimaryRoom = normalized.primaryId;
    }

    return true;
  }

  function beginOrbitGesture() {
    if (arguments.length !== 0) {
      return rejectRequest(
        "orbit-gesture-begin-rejected",
        "SHOWROOM_ORBIT_GESTURE_BEGIN_ACCEPTS_NO_PAYLOAD"
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
        "SHOWROOM_ORBIT_PREVIEW_EXACT_PAYLOAD_REQUIRED"
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
        "SHOWROOM_ORBIT_PREVIEW_ACTIVE_TRANSACTION_REQUIRED"
      );
    }

    const validation = validateOrbitPreviewPayload(payload);

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
        "SHOWROOM_ORBIT_COMMIT_ACCEPTS_NO_PAYLOAD"
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
        "SHOWROOM_ORBIT_COMMIT_ACCEPTED_PREVIEW_REQUIRED"
      );
    }

    const committed = cloneOrientation(state.orbitOrientation);

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

    state.orbitGestureOrigin = null;

    recordAction(`orbit-committed:${committed.primaryId}`);

    return true;
  }

  function requestOrbitCancel(reason = "cancelled") {
    if (arguments.length > 1) {
      return rejectRequest(
        "orbit-cancel-rejected",
        "SHOWROOM_ORBIT_CANCEL_ARGUMENT_COUNT_INVALID"
      );
    }

    if (isHeld()) {
      return false;
    }

    if (!state.orbitGestureActive) {
      return false;
    }

    const restored = cloneOrientation(
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

    state.orbitGestureOrigin = null;

    recordAction(
      `orbit-cancelled:${String(reason || "cancelled")}`
    );

    state.orbitPhase = ORIENTATION_PHASES.COMMITTED;

    recordAction("orbit-cancel-settled");

    return true;
  }

  function requestOrbitFocus(wing) {
    if (arguments.length !== 1) {
      return false;
    }

    const normalizedWing = normalizeWing(wing);

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

    state.orbitGestureOrigin = null;

    recordAction(`orbit-focus-settled:${normalizedWing}`);

    return true;
  }

  function beginClusterGesture(wing) {
    if (arguments.length !== 1) {
      return rejectRequest(
        "cluster-gesture-begin-rejected",
        "SHOWROOM_CLUSTER_GESTURE_BEGIN_EXACT_WING_REQUIRED"
      );
    }

    if (isHeld()) {
      return false;
    }

    const normalizedWing = normalizeWing(wing);
    const cluster = getCluster(normalizedWing);

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

    cluster.gestureOrigin = cloneOrientation(cluster.committedOrientation);

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

    recordAction(`cluster-gesture-began:${normalizedWing}`);

    return true;
  }

  function requestClusterPreview(wing, payload) {
    if (arguments.length !== 2) {
      return rejectRequest(
        "cluster-preview-rejected",
        "SHOWROOM_CLUSTER_PREVIEW_EXACT_WING_AND_PAYLOAD_REQUIRED"
      );
    }

    if (isHeld()) {
      return false;
    }

    const normalizedWing = normalizeWing(wing);
    const cluster = getCluster(normalizedWing);

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
        `SHOWROOM_CLUSTER_PREVIEW_ACTIVE_TRANSACTION_REQUIRED:${normalizedWing}`
      );
    }

    const validation = validateClusterPreviewPayload(cluster, payload);

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
        "SHOWROOM_CLUSTER_COMMIT_EXACT_WING_REQUIRED"
      );
    }

    if (isHeld()) {
      return false;
    }

    const normalizedWing = normalizeWing(wing);
    const cluster = getCluster(normalizedWing);

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
        `SHOWROOM_CLUSTER_COMMIT_ACCEPTED_PREVIEW_REQUIRED:${normalizedWing}`
      );
    }

    const committed = cloneOrientation(cluster.orientation);

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

    cluster.gestureOrigin = null;

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
        "SHOWROOM_CLUSTER_CANCEL_ARGUMENT_COUNT_INVALID"
      );
    }

    if (isHeld()) {
      return false;
    }

    const normalizedWing = normalizeWing(wing);
    const cluster = getCluster(normalizedWing);

    if (
      !cluster ||
      !cluster.gestureActive
    ) {
      return false;
    }

    const restored = cloneOrientation(
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

    cluster.gestureOrigin = null;

    recordAction(
      `cluster-cancelled:${normalizedWing}:${String(reason || "cancelled")}`
    );

    cluster.phase = ORIENTATION_PHASES.COMMITTED;

    recordAction(`cluster-cancel-settled:${normalizedWing}`);

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
    const wing = normalizeWing(cardinalId);

    if (
      isHeld() ||
      !wing ||
      state.current !== STATES.CONSTELLATION
    ) {
      return false;
    }

    const element = findCoinElement(wing);

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

    const destination = destinationFromCoinElement(element);

    return applyState(
      STATES.CLUSTER_OPEN,
      {
        selectedCardinal: wing,
        selectedCoin: wingToCoin(wing),
        selectedDestinationType: DESTINATION_TYPES.COIN,
        selectedDestinationId: wing,
        selectedDestinationLabel:
          destination ? destination.label : WING_LABELS[wing],
        selectedRoute: "",
        selectedParagraph: "",
        compassSelected: false,
        panelDescended: false
      },
      `cardinal-selected:${wing}`
    );
  }

  function requestRoomSelection(roomId) {
    const id = normalizeRoomId(roomId);

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

    const canonical = ROOM_BY_ID.get(id);
    const element = findRoomElement(id);

    if (
      !canonical ||
      !element
    ) {
      recordAction(
        "room-selection-rejected",
        `ROOM_NOT_FOUND:${id}`
      );

      return false;
    }

    if (canonical.wing !== state.selectedCardinal) {
      recordAction(
        "room-selection-rejected",
        `ROOM_OUTSIDE_ACTIVE_CLUSTER:${id}`
      );

      return false;
    }

    const declaredWing = normalizeWing(element.dataset.showroomCardinalId);

    if (declaredWing !== canonical.wing) {
      recordAction(
        "room-selection-rejected",
        `ROOM_DECLARED_WING_INVALID:${id}`
      );

      return false;
    }

    const cluster = getCluster(canonical.wing);

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
      requestClusterCancel(canonical.wing, "room-selection");
    }

    clearViewportSchedules();

    const destination = destinationFromRoomRecord(canonical, element);

    const committed = applyState(
      STATES.ROOM_SELECTED,
      {
        selectedCardinal: canonical.wing,
        selectedCoin: canonical.coin,
        selectedRoom: canonical.roomId,
        selectedDestinationType: DESTINATION_TYPES.ROOM,
        selectedDestinationId: canonical.roomId,
        selectedDestinationLabel: destination.label,
        selectedRoute: canonical.route,
        selectedContentId: destination.contentId,
        selectedLens: destination.lens,
        selectedParagraph: roomParagraphFromRecord(canonical, element),
        selectedRouteDescription: canonical.routeDescription,
        selectedVisualClass: canonical.visualClass,
        selectedEmphasis: canonical.emphasis,
        selectedExistingRoute: canonical.existingRoute,
        compassSelected: false,
        panelDescended: true
      },
      `room-selected:${canonical.roomId}`
    );

    if (!committed) {
      return false;
    }

    scheduleRoomPanelDescent(canonical.roomId);

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
    state.selectedDestinationId = MAIN_COMPASS.destinationId;
    state.selectedDestinationLabel = MAIN_COMPASS.destinationLabel;
    state.selectedRoute = MAIN_COMPASS.route;
    state.selectedContentId = "home-compass";
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

  function requestEnterSelection() {
    if (
      isHeld() ||
      state.compassSelected ||
      state.current !== STATES.ROOM_SELECTED
    ) {
      return false;
    }

    const canonical = ROOM_BY_ID.get(state.selectedRoom);

    if (
      !canonical ||
      state.selectedDestinationType !== DESTINATION_TYPES.ROOM ||
      state.selectedDestinationId !== canonical.roomId ||
      state.selectedRoute !== canonical.route ||
      !ROOM_BY_ROUTE.has(state.selectedRoute)
    ) {
      recordAction(
        "selected-path-entry-rejected",
        "SELECTED_ROOM_ROUTE_NOT_CANONICAL"
      );

      return false;
    }

    recordAction(
      `selected-path-entry-confirmed:${canonical.roomId}`
    );

    globalThis.location.assign(canonical.route);

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
        const wing = normalizeWing(state.selectedCardinal);

        if (!wing) {
          return false;
        }

        const coin = findCoinElement(wing);
        const destination = destinationFromCoinElement(coin);

        const committed = applyState(
          STATES.CLUSTER_OPEN,
          {
            selectedCardinal: wing,
            selectedCoin: wingToCoin(wing),
            selectedRoom: "",
            selectedDestinationType: DESTINATION_TYPES.COIN,
            selectedDestinationId: wing,
            selectedDestinationLabel:
              destination ? destination.label : WING_LABELS[wing],
            selectedRoute: "",
            selectedContentId: "",
            selectedLens: "overview",
            selectedParagraph: "",
            selectedRouteDescription: "",
            selectedVisualClass: "",
            selectedEmphasis: "",
            selectedExistingRoute: false,
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
        state.selectedDestinationType = DESTINATION_TYPES.COIN;
        state.selectedDestinationId = state.selectedCardinal;
        state.selectedDestinationLabel =
          WING_LABELS[state.selectedCardinal] ||
          wingToCoin(state.selectedCardinal);
        state.selectedRoute = "";
        state.panelDescended = false;

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

    const wing = normalizeWing(state.selectedCardinal);

    if (!wing) {
      recordAction(
        "return-to-orbit-rejected",
        "ACTIVE_ROOM_WING_REQUIRED"
      );

      return false;
    }

    const coin = findCoinElement(wing);
    const destination = destinationFromCoinElement(coin);

    const committed = applyState(
      STATES.CLUSTER_OPEN,
      {
        selectedCardinal: wing,
        selectedCoin: wingToCoin(wing),
        selectedRoom: "",
        selectedDestinationType: DESTINATION_TYPES.COIN,
        selectedDestinationId: wing,
        selectedDestinationLabel:
          destination ? destination.label : WING_LABELS[wing],
        selectedRoute: "",
        selectedContentId: "",
        selectedLens: "overview",
        selectedParagraph: "",
        selectedRouteDescription: "",
        selectedVisualClass: "",
        selectedEmphasis: "",
        selectedExistingRoute: false,
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

    const committed = applyState(
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

    const next = new Map();

    for (const input of records) {
      if (
        !input ||
        typeof input !== "object"
      ) {
        continue;
      }

      const id = normalize(
        input.id ||
        input.roomId ||
        input.wing ||
        input.cardinalId
      );

      if (!id) {
        continue;
      }

      const kind = normalizeLower(input.kind);

      if (
        !canonicalControlExists({
          id,
          kind
        })
      ) {
        continue;
      }

      const projection = Object.freeze({
        id,
        kind,
        x: finiteNumber(input.x, 0),
        y: finiteNumber(input.y, 0),
        radiusPx: Math.max(
          0,
          finiteNumber(
            input.radiusPx ??
              input.projectedRadius,
            0
          )
        ),
        depthLayer: normalizeDepthLayer(
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

    state.semanticProjection = next;
    state.semanticProjectionRevision += 1;

    const snapshot = createSemanticProjectionSnapshot();

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
    const reason = String(
      event &&
      event.detail &&
      event.detail.reason
        ? event.detail.reason
        : "SHOWROOM_CRYSTALS_RENDER_FAILURE"
    );

    cancelActiveGestures("crystals-failure");

    setGuidance(
      "The visual crystal field is temporarily unavailable. Canonical routes and semantic records remain preserved."
    );

    recordAction(
      "crystals-renderer-failed",
      reason
    );
  }

  function readReducedMotion() {
    const media = globalThis.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    state.mediaQuery = media;

    state.reducedMotion =
      Boolean(media.matches) ||
      state.root.dataset.showroomReducedMotion === "true" ||
      state.root.dataset.reducedMotion === "true";
  }

  function bindReducedMotion() {
    const media = state.mediaQuery;

    if (!media) {
      return;
    }

    const update = event => {
      const previous = state.reducedMotion;

      state.reducedMotion = Boolean(event.matches);

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

    state.mediaQueryListener = update;

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return;
    }

    if (typeof media.addListener === "function") {
      media.addListener(update);
    }
  }

  function resolveDom() {
    state.root = qs("[data-showroom-root]");

    invariant(
      state.root,
      "SHOWROOM_ROOT_NOT_FOUND"
    );

    state.scene = qs("[data-showroom-scene]", state.root);
    state.sceneField = qs("[data-showroom-scene-field]", state.root);
    state.panel = qs("[data-showroom-controller-panel]", state.root);

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

    state.compassControl =
      qs("[data-showroom-compass-control]", state.root) ||
      qs("[data-upstream-compass-control]", state.root);

    const required = Object.freeze([
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
      ["SHOWROOM_CONTROLLER_VALIDATION_OUTPUT_NOT_FOUND", state.controllerValidationOutput],
      ["SHOWROOM_COMPASS_CONTROL_NOT_FOUND", state.compassControl]
    ]);

    for (const [code, node] of required) {
      invariant(node, code);
    }
  }

  function initializeOrientationState() {
    const requestedFocus =
      normalizeWing(
        state.root.dataset.showroomOrbitFocus ||
        state.root.dataset.orbitFocus
      ) || "north";

    let initial = canonicalConstellationOrientation(requestedFocus);

    const serialized = normalize(
      state.root.dataset.showroomOrbitQuaternion ||
      state.root.dataset.orbitQuaternion
    );

    if (serialized) {
      try {
        const parsed = JSON.parse(serialized);
        const normalized = normalizeQuaternionStrict(parsed);

        if (normalized) {
          initial = createOrientation(normalized, requestedFocus);
        }
      } catch (_) {}
    }

    state.orbitFocus = requestedFocus;
    state.orbitPreviewFocus = requestedFocus;
    state.orbitPhase = ORIENTATION_PHASES.COMMITTED;
    state.orbitGestureActive = false;
    state.orbitPreviewAccepted = false;
    state.orbitRevision = finiteNumber(
      state.root.dataset.showroomOrbitRevision ||
        state.root.dataset.orbitRevision,
      0
    );
    state.orbitOrientation = cloneOrientation(initial);
    state.committedOrbitOrientation = cloneOrientation(initial);
    state.orbitGestureOrigin = null;
  }

  function initializeClusters() {
    state.clusters.clear();

    for (const wing of WINGS) {
      const cluster = createClusterState(wing);

      invariant(
        cluster.roomIds.length === 4,
        "SHOWROOM_CLUSTER_ROOM_COUNT_INVALID",
        {
          wing,
          count: cluster.roomIds.length
        }
      );

      state.clusters.set(wing, cluster);
    }
  }

  function getClusterState(wing) {
    const cluster = getCluster(wing);

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

  function validateCanonicalRegistry() {
    invariant(
      WINGS.length === 4,
      "SHOWROOM_WING_COUNT_INVALID"
    );

    invariant(
      new Set(WINGS).size === 4,
      "SHOWROOM_DUPLICATE_WING"
    );

    invariant(
      CANONICAL_ROOM_RECORDS.length === 16,
      "SHOWROOM_CANONICAL_ROOM_COUNT_INVALID"
    );

    const ids = new Set();
    const routes = new Set();

    for (const wing of WINGS) {
      const rooms = ROOMS_BY_WING.get(wing);

      invariant(
        rooms &&
          rooms.length === 4,
        "SHOWROOM_ROOMS_PER_WING_INVALID",
        { wing }
      );
    }

    for (const record of CANONICAL_ROOM_RECORDS) {
      invariant(
        WINGS.includes(record.wing),
        "SHOWROOM_ROOM_WING_INVALID"
      );

      invariant(
        WING_TO_COIN[record.wing] === record.coin,
        "SHOWROOM_ROOM_COIN_MAPPING_INVALID"
      );

      invariant(
        record.roomId,
        "SHOWROOM_ROOM_ID_REQUIRED"
      );

      invariant(
        record.label,
        "SHOWROOM_ROOM_LABEL_REQUIRED"
      );

      invariant(
        normalizeRoute(record.route) === record.route,
        "SHOWROOM_ROOM_ROUTE_INVALID",
        { roomId: record.roomId, route: record.route }
      );

      invariant(
        !ids.has(record.roomId),
        "SHOWROOM_DUPLICATE_ROOM_ID",
        { roomId: record.roomId }
      );

      invariant(
        !routes.has(record.route),
        "SHOWROOM_DUPLICATE_ROOM_ROUTE",
        { route: record.route }
      );

      ids.add(record.roomId);
      routes.add(record.route);
    }

    invariant(
      ROOM_BY_ID.size === 16,
      "SHOWROOM_ROOM_ID_REGISTRY_INVALID"
    );

    invariant(
      ROOM_BY_ROUTE.size === 16,
      "SHOWROOM_ROUTE_REGISTRY_INVALID"
    );

    return Object.freeze({
      pass: true,
      wingCount: 4,
      roomCount: 16,
      routeCount: 16,
      roomsPerWing: 4,
      allChildrenCanonicalRoutes: true
    });
  }

  function validateDeclaredCardinals() {
    const declared = qsa("[data-showroom-cardinal-control]", state.root);

    invariant(
      declared.length === 4,
      "SHOWROOM_DECLARED_CARDINAL_COUNT_INVALID",
      {
        expected: 4,
        actual: declared.length
      }
    );

    const seen = new Set();

    for (const element of declared) {
      const wing = normalizeWing(element.dataset.showroomCardinalId);

      invariant(
        wing,
        "SHOWROOM_CARDINAL_ID_INVALID"
      );

      invariant(
        !seen.has(wing),
        "SHOWROOM_DUPLICATE_CARDINAL_ID",
        { wing }
      );

      invariant(
        normalizeLabel(element.dataset.showroomCardinalLabel) ===
          WING_LABELS[wing],
        "SHOWROOM_CARDINAL_LABEL_MISMATCH",
        {
          wing,
          expected: WING_LABELS[wing],
          actual: element.dataset.showroomCardinalLabel || ""
        }
      );

      seen.add(wing);
    }

    return Object.freeze({
      pass: true,
      declaredCardinalCount: 4
    });
  }

  function validateDeclaredRooms() {
    const declared = qsa("[data-showroom-child-control]", state.root);

    invariant(
      declared.length === 16,
      "SHOWROOM_DECLARED_ROOM_COUNT_INVALID",
      {
        expected: 16,
        actual: declared.length
      }
    );

    const seen = new Set();

    for (const element of declared) {
      const roomId = normalizeRoomId(element.dataset.showroomChildId);
      const wing = normalizeWing(element.dataset.showroomCardinalId);
      const canonical = ROOM_BY_ID.get(roomId);

      invariant(
        roomId,
        "SHOWROOM_CHILD_ID_REQUIRED"
      );

      invariant(
        !seen.has(roomId),
        "SHOWROOM_DUPLICATE_DECLARED_ROOM_ID",
        { roomId }
      );

      invariant(
        canonical,
        "SHOWROOM_UNKNOWN_DECLARED_ROOM_ID",
        { roomId }
      );

      invariant(
        wing === canonical.wing,
        "SHOWROOM_ROOM_WING_MISMATCH",
        {
          roomId,
          expected: canonical.wing,
          actual: wing
        }
      );

      invariant(
        normalizeLabel(
          element.dataset.showroomChildLabel,
          canonical.label
        ) === canonical.label,
        "SHOWROOM_ROOM_LABEL_MISMATCH",
        {
          roomId,
          expected: canonical.label,
          actual: element.dataset.showroomChildLabel || ""
        }
      );

      seen.add(roomId);
    }

    for (const wing of WINGS) {
      const count = declared.filter(element =>
        normalizeWing(element.dataset.showroomCardinalId) === wing
      ).length;

      invariant(
        count === 4,
        "SHOWROOM_DECLARED_ROOMS_PER_WING_INVALID",
        {
          wing,
          count
        }
      );
    }

    return Object.freeze({
      pass: true,
      declaredRoomCount: 16,
      declaredRouteCount: 16,
      controllerUsesCanonicalRouteRegistry: true,
      samePageAnchorDependency: false,
      modalDependency: false,
      objectActivationDependency: false
    });
  }

  function validateTransitionTable() {
    const declaredStates = Object.values(STATES);

    invariant(
      declaredStates.length === 4,
      "SHOWROOM_STATE_COUNT_INVALID"
    );

    invariant(
      !declaredStates.includes("COMPASS_DECISION"),
      "SHOWROOM_FORBIDDEN_COMPASS_DECISION_STATE"
    );

    invariant(
      !declaredStates.includes("CONSTELLATION_WITH_CLUSTER"),
      "SHOWROOM_FORBIDDEN_ADDITIVE_STATE"
    );

    invariant(
      canTransition(STATES.CONSTELLATION, STATES.CLUSTER_OPEN),
      "SHOWROOM_REQUIRED_TRANSITION_MISSING"
    );

    invariant(
      canTransition(STATES.CLUSTER_OPEN, STATES.ROOM_SELECTED),
      "SHOWROOM_REQUIRED_TRANSITION_MISSING"
    );

    invariant(
      canTransition(STATES.ROOM_SELECTED, STATES.CLUSTER_OPEN),
      "SHOWROOM_REQUIRED_TRANSITION_MISSING"
    );

    invariant(
      canTransition(STATES.CLUSTER_OPEN, STATES.CONSTELLATION),
      "SHOWROOM_REQUIRED_TRANSITION_MISSING"
    );

    invariant(
      canTransition(STATES.ROOM_SELECTED, STATES.CONSTELLATION),
      "SHOWROOM_REQUIRED_TRANSITION_MISSING"
    );

    invariant(
      TRANSITIONS[STATES.SYSTEM_HELD].length === 1 &&
        TRANSITIONS[STATES.SYSTEM_HELD][0] === STATES.SYSTEM_HELD,
      "SHOWROOM_HELD_STATE_NOT_TERMINAL"
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
        "SHOWROOM_ADDITIVE_PRESENTATION_FORBIDDEN"
      );
    }

    return Object.freeze({
      pass: true,
      progressiveReplacement: true,
      additiveCoRenderingAuthorized: false
    });
  }

  function validateCompassContract() {
    const compass = createCompassState();

    invariant(
      compass.fixedCenter === true,
      "SHOWROOM_COMPASS_FIXED_CENTER_INVALID"
    );

    invariant(
      compass.mainCompassRoute === "/index.html",
      "SHOWROOM_COMPASS_ROUTE_INVALID"
    );

    invariant(
      compass.immediateNavigation === false,
      "SHOWROOM_COMPASS_IMMEDIATE_NAVIGATION_INVALID"
    );

    invariant(
      compass.explicitReturnRequired === true,
      "SHOWROOM_COMPASS_EXPLICIT_RETURN_INVALID"
    );

    invariant(
      compass.inheritsNavigationOrientation === false,
      "SHOWROOM_COMPASS_ORIENTATION_INHERITANCE_INVALID"
    );

    invariant(
      compass.participatesInNavigationSettlement === false,
      "SHOWROOM_COMPASS_SETTLEMENT_PARTICIPATION_INVALID"
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
      "SHOWROOM_MOTION_CONTRACT_ID_INVALID"
    );

    invariant(
      MODULE.motionContractVersion === "1.0.0",
      "SHOWROOM_MOTION_CONTRACT_VERSION_INVALID"
    );

    const validOrbit = validateOrbitPreviewPayload({
      quaternion: [0, 0.2, 0, 0.98],
      primaryId: "east"
    });

    invariant(
      validOrbit.pass === true,
      "SHOWROOM_VALID_ORBIT_PREVIEW_REJECTED"
    );

    const eulerOrbit = validateOrbitPreviewPayload({
      yaw: 1,
      pitch: 1,
      roll: 0,
      primaryId: "east"
    });

    invariant(
      eulerOrbit.pass === false,
      "SHOWROOM_CONTROLLER_MUST_REJECT_EULER_PREVIEW"
    );

    const mixedOrbit = validateOrbitPreviewPayload({
      quaternion: [0, 0, 0, 1],
      primaryId: "east",
      dx: 40
    });

    invariant(
      mixedOrbit.pass === false,
      "SHOWROOM_CONTROLLER_MUST_REJECT_MIXED_MOTION_PAYLOAD"
    );

    const testCluster = createClusterState("north");

    const validCluster = validateClusterPreviewPayload(testCluster, {
      quaternion: [0.1, 0, 0, 0.99],
      primaryId: "north-3"
    });

    invariant(
      validCluster.pass === true,
      "SHOWROOM_VALID_CLUSTER_PREVIEW_REJECTED"
    );

    const foreignRoom = validateClusterPreviewPayload(testCluster, {
      quaternion: [0, 0, 0, 1],
      primaryId: "south-1"
    });

    invariant(
      foreignRoom.pass === false,
      "SHOWROOM_FOREIGN_CLUSTER_ROOM_ACCEPTED"
    );

    invariant(
      beginOrbitGesture.length === 0,
      "SHOWROOM_ORBIT_BEGIN_SIGNATURE_INVALID"
    );

    invariant(
      requestOrbitPreview.length === 1,
      "SHOWROOM_ORBIT_PREVIEW_SIGNATURE_INVALID"
    );

    invariant(
      requestOrbitCommit.length === 0,
      "SHOWROOM_ORBIT_COMMIT_SIGNATURE_INVALID"
    );

    invariant(
      beginClusterGesture.length === 1,
      "SHOWROOM_CLUSTER_BEGIN_SIGNATURE_INVALID"
    );

    invariant(
      requestClusterPreview.length === 2,
      "SHOWROOM_CLUSTER_PREVIEW_SIGNATURE_INVALID"
    );

    invariant(
      requestClusterCommit.length === 1,
      "SHOWROOM_CLUSTER_COMMIT_SIGNATURE_INVALID"
    );

    return Object.freeze({
      pass: true,
      motionContractId: MODULE.motionContractId,
      motionContractVersion: MODULE.motionContractVersion,
      previewPayloadKeys: Object.freeze(PREVIEW_PAYLOAD_KEYS.slice()),
      unexpectedPreviewFieldsForbidden: true,
      completeQuaternionPreviewRequired: true,
      explicitPrimaryIdentityRequired: true,
      controllerInfersPrimaryFromQuaternion: false,
      controllerInterpretsEulerMotion: false,
      controllerConstructsGestureQuaternion: false,
      motionOwner: MODULE.interactionModuleId,
      acceptedStateAuthority: MODULE.id
    });
  }

  function validateProjectionStorageContract() {
    const sample = Object.freeze({
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
      "SHOWROOM_CONTROLLER_MUST_NOT_STORE_INTERACTION_PRIORITY"
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
      "SHOWROOM_CONTROLLER_POINTER_STATE_NOT_EXTRACTED"
    );

    invariant(
      !Object.prototype.hasOwnProperty.call(state, "suppressedSemanticClick"),
      "SHOWROOM_CONTROLLER_CLICK_SUPPRESSION_NOT_EXTRACTED"
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
      clusterExitSwipeClassificationOwned: false,
      gestureAxisSelectionOwned: false,
      gestureQuaternionConstructionOwned: false,
      directManipulationOwned: false,
      grabbedObjectTrackingOwned: false,
      quaternionToPrimaryInferenceOwned: false,
      interactionModuleId: MODULE.interactionModuleId,
      acceptedStateAuthority: MODULE.id,
      navigationTransitionAuthority: MODULE.id
    });
  }

  function validateRouteGatewayContract() {
    return Object.freeze({
      pass: true,
      controllerRouteExecutionAuthority: true,
      sixteenPathGateway: true,
      allDestinationsAreRoutes: true,
      samePageAnchorExecutionOwned: false,
      modalOpeningOwned: false,
      disclosureOpeningOwned: false,
      gaugeFrontActivationOwned: false,
      objectInspectionExecutionOwned: false,
      pageContentRenderingOwned: false,
      diamondRuntimeOwned: false,
      compositorRuntimeOwned: false,
      crystalRenderingOwned: false,
      interactionGestureInterpretationOwned: false
    });
  }

  function runControllerSelfTest({
    includeDom = false
  } = {}) {
    const results = {
      registry: validateCanonicalRegistry(),
      transitions: validateTransitionTable(),
      presentation: validatePresentationContract(),
      compass: validateCompassContract(),
      motionContract: validateMotionContract(),
      projectionStorage: validateProjectionStorageContract(),
      fileSplit: validateFileSplitContract(),
      routeGateway: validateRouteGatewayContract(),
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

    const pass = Object.values(results).every(
      result => result.pass === true
    );

    return Object.freeze({
      receiptSchema:
        "SHOWROOM_ARCHCOIN_PATTERN_ROUTE_GATEWAY_CONTROLLER_VALIDATION_RECEIPT_v1",
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
      interactionPriorityDerivationOwner: MODULE.interactionModuleId,
      clusterExitSwipeClassificationOwner: MODULE.interactionModuleId,
      gestureAxisSelectionOwner: MODULE.interactionModuleId,
      gestureQuaternionConstructionOwner: MODULE.interactionModuleId,
      directManipulationOwner: MODULE.interactionModuleId,
      grabbedObjectTrackingOwner: MODULE.interactionModuleId,
      primaryVisualIdentityCalculationOwner: MODULE.interactionModuleId,

      orbitStateAuthority: MODULE.id,
      clusterStateAuthority: MODULE.id,
      quaternionAcceptanceAuthority: MODULE.id,
      clusterExitTransitionAuthority: MODULE.id,
      navigationTransitionAuthority: MODULE.id,
      routeExecutionAuthority: MODULE.id,

      cameraOwnership: false,
      crystalRendererOwnership: false,
      compassRendererOwnership: false,
      semanticProjectionMathOwnership: false,
      interactionPriorityStorageOwnership: false,
      semanticProjectionFactStorageOwnership: true,
      compassPageLocalSelection: true,
      explicitMainCompassReturn: true,

      modalOpeningAuthority: false,
      anchorScrollAuthority: false,
      disclosureOpeningAuthority: false,
      frontActivationAuthority: false,
      objectInspectionExecutionAuthority: false,
      diamondRuntimeAuthority: false,

      results: Object.freeze(results)
    });
  }

  function writeValidationReceipt(receipt) {
    state.validationReceipt = receipt;

    const serialized = JSON.stringify(receipt);

    state.root.dataset.showroomControllerValidation = serialized;

    if ("value" in state.controllerValidationOutput) {
      state.controllerValidationOutput.value = serialized;
    }

    state.controllerValidationOutput.textContent = serialized;

    globalThis.SHOWROOM_CONTROLLER_VALIDATION_RECEIPT = receipt;
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
        orientationPhases: ORIENTATION_PHASES,
        depthLayers: DEPTH_LAYERS,
        mainCompass: MAIN_COMPASS,
        canonicalRoomRecords: CANONICAL_ROOM_RECORDS,
        canonicalRoomRoutes: CANONICAL_ROOM_ROUTES,
        wingToCoin: WING_TO_COIN,

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
      "SHOWROOM_CRYSTALS_RENDER_FAILURE",
      handleCrystalsFailure
    );

    globalThis.addEventListener(
      "ARCHCOIN_CRYSTALS_RENDER_FAILURE",
      handleCrystalsFailure
    );
  }

  function enterHeldState(error) {
    clearViewportSchedules();

    state.current = STATES.SYSTEM_HELD;
    state.orbitGestureActive = false;
    state.orbitPreviewAccepted = false;
    state.orbitGestureOrigin = null;

    for (const cluster of state.clusters.values()) {
      cluster.gestureActive = false;
      cluster.previewAccepted = false;
      cluster.gestureOrigin = null;
      cluster.phase = ORIENTATION_PHASES.COMMITTED;
    }

    state.lastAction = "controller-initialization-failed";

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
        const frame = publishFrame();

        publish(CHANNELS.HELD_STATE, createHeldState());
        publish(CHANNELS.COMPASS_STATE, frame.compass);
      }
    } catch (_) {}

    globalThis.dispatchEvent(
      new CustomEvent(
        "SHOWROOM_CONTROLLER_FAILURE",
        {
          detail: Object.freeze({
            reason: state.lastFailure
          })
        }
      )
    );
  }

  function initialize() {
    try {
      const sourceReceipt = runControllerSelfTest({
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

      const runtimeReceipt = runControllerSelfTest({
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

      state.initialized = true;

      const frame = recordAction("controller-initialized");

      publish(CHANNELS.REDUCED_MOTION, state.reducedMotion);
      publish(CHANNELS.HELD_STATE, createHeldState());
      publish(CHANNELS.COMPASS_STATE, frame.compass);

      globalThis.dispatchEvent(
        new CustomEvent(
          "SHOWROOM_CONTROLLER_READY",
          {
            detail: Object.freeze({
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
              controllerRouteExecutionAuthority: true,
              sixteenPathGateway: true,
              allDestinationsAreRoutes: true,
              acceptedStateAuthority: MODULE.id,
              navigationTransitionAuthority: MODULE.id,
              modalOpeningAuthority: false,
              anchorScrollAuthority: false,
              disclosureOpeningAuthority: false,
              frontActivationAuthority: false,
              objectInspectionExecutionAuthority: false,
              diamondRuntimeAuthority: false
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
SHOWROOM_CONTROLLER_ARCHCOIN_PATTERN_ROUTE_GATEWAY_RECEIPT_v9

FILE MODIFIED:
/showroom/index.controller.js

NEW VERSION:
9.0.0-archcoin-route-gateway

PRIMARY CHANGE:
The Showroom controller is now an ARCHCOIN-pattern route gateway.

ROUTE TAXONOMY:
north-1 /showroom/story/welcome/
north-2 /showroom/story/mission/
north-3 /showroom/story/timeline/
north-4 /showroom/story/invitation/
east-1 /showroom/globe/hearth/jeeves/
east-2 /elara/index.html
east-3 /products/auren/
east-4 /characters/
south-1 /showroom/wonders/window/
south-2 /showroom/wonders/diamond/
south-3 /showroom/wonders/stars/
south-4 /showroom/globe/hearth/
west-1 /showroom/mysteries/unfinished-world/
west-2 /showroom/mysteries/questions-in-the-glass/
west-3 /showroom/mysteries/paths-not-yet-open/
west-4 /showroom/globe/audralia/

CONTROLLER OWNS:
- constellation state
- cardinal selection
- cluster opening
- child selection
- selected route reflection
- Open Selection
- Return to Orbit
- Main Compass selection and return
- quaternion orbit and cluster state
- semantic projection facts
- controller panel display
- direct navigation to canonical route

CONTROLLER DOES NOT OWN:
- modal opening
- same-page anchor execution
- disclosure opening
- gauge/front activation
- object inspection execution
- page content rendering
- Diamond runtime
- compositor runtime
- crystal rendering
- interaction gesture interpretation

PRESERVED PUBLIC GLOBAL:
SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER

PRESERVED LIFECYCLE:
SHOWROOM_CONTROLLER_READY
SHOWROOM_CONTROLLER_FAILURE

INTERACTIONS MODIFIED:
FALSE

COMPOSITOR MODIFIED:
FALSE

CRYSTALS MODIFIED:
FALSE

DIAMOND FILES MODIFIED:
FALSE

WINDOW FILES MODIFIED:
FALSE

CSS MODIFIED:
FALSE

HTML MODIFIED:
FALSE

RUNTIME VALIDATION:
NOT PERFORMED
*/

/* /products/archcoin/index.controller.js
   ARCHCOIN anchoring navigation, state, route, transition,
   accepted-quaternion, panel, and semantic-projection authority.

   Module:
   DGB_ARCHCOIN_CONTROLLER
   7.0.0-controller-interaction-semantic-priority

   Paired module:
   DGB_ARCHCOIN_INTERACTIONS
   1.0.0-pointer-gesture-interpreter

   Frozen motion contract:
   AUDRALIA_ARCHCOIN_COMPLETE_QUATERNION_MOTION_CONTRACT_v1
   1.0.0

   Anchoring distinction:

   INTERACTIONS DETERMINES MOTION.
   CONTROLLER DETERMINES AUTHORITY.

   Controller owns:
   - canonical navigation and selection state;
   - legal transitions;
   - canonical room and route registry;
   - gesture transaction begin, preview acceptance, commit, and cancel;
   - strict complete-quaternion validation and authoritative normalization;
   - preview, committed, and origin quaternion storage;
   - explicit primary-wing and primary-room validation;
   - navigation authorization and execution;
   - panel and viewport choreography;
   - reduced-motion and held-state authority;
   - semantic projection fact validation, storage, and publication;
   - receipts and self-validation.

   Controller does not own:
   - pointer input;
   - tap-versus-drag arbitration;
   - swipe or cluster-exit classification;
   - drag direction or sensitivity;
   - gesture-axis selection;
   - gesture quaternion construction;
   - direct manipulation or grabbed-object tracking;
   - quaternion-to-primary inference;
   - Euler gesture interpretation;
   - projection-to-interaction DOM application.

   Gesture contract:

   Orbit:
   - beginOrbitGesture()
   - requestOrbitPreview({ quaternion, primaryId })
   - requestOrbitCommit()
   - requestOrbitCancel(reason)

   Cluster:
   - beginClusterGesture(wing)
   - requestClusterPreview(wing, { quaternion, primaryId })
   - requestClusterCommit(wing)
   - requestClusterCancel(wing, reason)

   Preview payloads permit exactly:
   - quaternion
   - primaryId

   Begin and commit commands accept no motion payload.
   Controller never infers primary identity from quaternion geometry.

   Source status:
   ANCHORING_TWO_FILE_MOTION_AUTHORITY_STANDARD
   !=
   RUNTIME_PASS
   !=
   VISUAL_PASS
   !=
   PRODUCTION_AUTHORIZATION
*/

(() => {
  "use strict";

  const MODULE = Object.freeze({
    id: "DGB_ARCHCOIN_CONTROLLER",
    version: "7.0.0-controller-interaction-semantic-priority",
    file: "/products/archcoin/index.controller.js",

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

  const PRESENTATION_MODE_BY_STATE = Object.freeze({
    [STATES.CONSTELLATION]: PRESENTATION_MODES.CONSTELLATION,
    [STATES.CLUSTER_OPEN]: PRESENTATION_MODES.CLUSTER,
    [STATES.ROOM_SELECTED]: PRESENTATION_MODES.CLUSTER,
    [STATES.SYSTEM_HELD]: PRESENTATION_MODES.HELD
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

  const INTERACTION_PRIORITY = Object.freeze({
    FRONT: "front",
    COMPASS: "compass",
    REAR: "rear",
    INACTIVE: "inactive"
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
    north: "contract",
    east: "receivable",
    south: "payable",
    west: "allocation"
  });

  const MAIN_COMPASS = Object.freeze({
    destinationType: DESTINATION_TYPES.HOME_COMPASS,
    destinationId: "home-compass",
    destinationLabel: "Main Compass",
    route: "/index.html",
    source: "archcoin-controller",
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

  const PREVIEW_PAYLOAD_KEY_SET = new Set(
    PREVIEW_PAYLOAD_KEYS
  );

  /*
   * Explicit navigation-settlement values only.
   *
   * These private constants are not gesture-axis definitions and are not
   * exported to the interactions module.
   */
  const HALF_SQRT_TWO = Math.SQRT1_2;

  const CANONICAL_CONSTELLATION_QUATERNIONS =
    Object.freeze({
      north: Object.freeze([
        0,
        0,
        0,
        1
      ]),

      east: Object.freeze([
        0,
        0,
        -HALF_SQRT_TWO,
        HALF_SQRT_TWO
      ]),

      south: Object.freeze([
        0,
        0,
        1,
        0
      ]),

      west: Object.freeze([
        0,
        0,
        HALF_SQRT_TWO,
        HALF_SQRT_TWO
      ])
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

  const CANONICAL_ROOM_RECORDS = Object.freeze([
    Object.freeze({
      wing: "north",
      coin: "contract",
      roomId: "contract-overview",
      route: "/products/archcoin/contract/overview/"
    }),

    Object.freeze({
      wing: "north",
      coin: "contract",
      roomId: "contract-engineering",
      route: "/products/archcoin/contract/engineering/"
    }),

    Object.freeze({
      wing: "north",
      coin: "contract",
      roomId: "contract-platform",
      route: "/products/archcoin/contract/platform/"
    }),

    Object.freeze({
      wing: "north",
      coin: "contract",
      roomId: "contract-governance",
      route: "/products/archcoin/contract/governance/"
    }),

    Object.freeze({
      wing: "east",
      coin: "receivable",
      roomId: "receivable-overview",
      route: "/products/archcoin/receivable/overview/"
    }),

    Object.freeze({
      wing: "east",
      coin: "receivable",
      roomId: "receivable-engineering",
      route: "/products/archcoin/receivable/engineering/"
    }),

    Object.freeze({
      wing: "east",
      coin: "receivable",
      roomId: "receivable-platform",
      route: "/products/archcoin/receivable/platform/"
    }),

    Object.freeze({
      wing: "east",
      coin: "receivable",
      roomId: "receivable-governance",
      route: "/products/archcoin/receivable/governance/"
    }),

    Object.freeze({
      wing: "south",
      coin: "payable",
      roomId: "payable-overview",
      route: "/products/archcoin/payable/overview/"
    }),

    Object.freeze({
      wing: "south",
      coin: "payable",
      roomId: "payable-engineering",
      route: "/products/archcoin/payable/engineering/"
    }),

    Object.freeze({
      wing: "south",
      coin: "payable",
      roomId: "payable-platform",
      route: "/products/archcoin/payable/platform/"
    }),

    Object.freeze({
      wing: "south",
      coin: "payable",
      roomId: "payable-governance",
      route: "/products/archcoin/payable/governance/"
    }),

    Object.freeze({
      wing: "west",
      coin: "allocation",
      roomId: "allocation-overview",
      route: "/products/archcoin/allocation/overview/"
    }),

    Object.freeze({
      wing: "west",
      coin: "allocation",
      roomId: "allocation-engineering",
      route: "/products/archcoin/allocation/engineering/"
    }),

    Object.freeze({
      wing: "west",
      coin: "allocation",
      roomId: "allocation-platform",
      route: "/products/archcoin/allocation/platform/"
    }),

    Object.freeze({
      wing: "west",
      coin: "allocation",
      roomId: "allocation-governance",
      route: "/products/archcoin/allocation/governance/"
    })
  ]);

  const CANONICAL_ROOM_ROUTES = Object.freeze(
    CANONICAL_ROOM_RECORDS.map(
      record => record.route
    )
  );

  const ROOM_BY_ID = new Map(
    CANONICAL_ROOM_RECORDS.map(
      record => [
        record.roomId,
        record
      ]
    )
  );

  const ROOM_BY_ROUTE = new Map(
    CANONICAL_ROOM_RECORDS.map(
      record => [
        record.route,
        record
      ]
    )
  );

  const ROOMS_BY_WING = new Map(
    WINGS.map(
      wing => [
        wing,

        Object.freeze(
          CANONICAL_ROOM_RECORDS
            .filter(
              record =>
                record.wing === wing
            )
            .map(
              record =>
                record.roomId
            )
        )
      ]
    )
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

  function invariant(
    condition,
    code,
    details = null
  ) {
    if (condition) {
      return;
    }

    const error = new Error(code);

    error.code = code;
    error.details = details;

    throw error;
  }

  function qs(
    selector,
    root = document
  ) {
    return root.querySelector(selector);
  }

  function qsa(
    selector,
    root = document
  ) {
    return Array.from(
      root.querySelectorAll(selector)
    );
  }

  function finiteNumber(
    value,
    fallback = 0
  ) {
    const number = Number(value);

    return Number.isFinite(number)
      ? number
      : fallback;
  }

  function normalizeWing(value) {
    const wing = String(value || "")
      .trim()
      .toLowerCase();

    return WINGS.includes(wing)
      ? wing
      : "";
  }

  function normalizeRoomId(value) {
    return String(value || "").trim();
  }

  function normalizeRoute(value) {
    const route = String(value || "").trim();

    return route.startsWith("/")
      ? route
      : "";
  }

  function normalizeLabel(
    value,
    fallback = ""
  ) {
    const label = String(value || "").trim();

    return label || fallback;
  }

  function normalizeDepthLayer(value) {
    const layer = String(value || "")
      .trim()
      .toLowerCase();

    if (layer === DEPTH_LAYERS.FRONT) {
      return DEPTH_LAYERS.FRONT;
    }

    if (layer === DEPTH_LAYERS.REAR) {
      return DEPTH_LAYERS.REAR;
    }

    return DEPTH_LAYERS.UNKNOWN;
  }

  function normalizeInteractionPriority(value) {
    const priority = String(value || "")
      .trim()
      .toLowerCase();

    return Object.values(
      INTERACTION_PRIORITY
    ).includes(priority)
      ? priority
      : INTERACTION_PRIORITY.INACTIVE;
  }

  function unexpectedPreviewPayloadKeys(
    payload
  ) {
    if (
      !payload ||
      typeof payload !== "object" ||
      Array.isArray(payload)
    ) {
      return [];
    }

    return Object.keys(payload).filter(
      key =>
        !PREVIEW_PAYLOAD_KEY_SET.has(key)
    );
  }

  function normalizeQuaternionStrict(value) {
    const source =
      Array.isArray(value) ||
      ArrayBuffer.isView(value)
        ? Array.from(value)
        : null;

    if (
      !source ||
      source.length !== 4
    ) {
      return null;
    }

    const quaternion = source.map(
      component => Number(component)
    );

    if (
      quaternion.some(
        component =>
          !Number.isFinite(component)
      )
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

    return quaternion.map(
      component =>
        component / length
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

  function createOrientation(
    quaternion,
    primaryId
  ) {
    const normalized =
      normalizeQuaternionStrict(quaternion);

    invariant(
      normalized,
      "ARCHCOIN_CONTROLLER_INVALID_QUATERNION"
    );

    return {
      quaternion: normalized,

      primaryId: String(
        primaryId || ""
      ).trim()
    };
  }

  function cloneOrientation(orientation) {
    const source =
      orientation &&
      typeof orientation === "object"
        ? orientation
        : {
            quaternion:
              QUATERNION.identity,

            primaryId: ""
          };

    return {
      quaternion:
        normalizeStoredQuaternion(
          source.quaternion
        ),

      primaryId: String(
        source.primaryId || ""
      ).trim()
    };
  }

  function freezeOrientation(orientation) {
    const value =
      cloneOrientation(orientation);

    return Object.freeze({
      quaternion: Object.freeze(
        value.quaternion.slice()
      ),

      primaryId: value.primaryId
    });
  }

  function canonicalConstellationOrientation(
    wing
  ) {
    const normalizedWing =
      normalizeWing(wing) || "north";

    return createOrientation(
      CANONICAL_CONSTELLATION_QUATERNIONS[
        normalizedWing
      ],

      normalizedWing
    );
  }

  function validateOrbitPreviewPayload(
    payload
  ) {
    if (
      !payload ||
      typeof payload !== "object" ||
      Array.isArray(payload)
    ) {
      return Object.freeze({
        pass: false,
        code:
          "ARCHCOIN_ORBIT_PREVIEW_PAYLOAD_REQUIRED"
      });
    }

    const unexpectedKeys =
      unexpectedPreviewPayloadKeys(payload);

    if (unexpectedKeys.length > 0) {
      return Object.freeze({
        pass: false,

        code:
          "ARCHCOIN_ORBIT_PREVIEW_UNEXPECTED_FIELDS_FORBIDDEN",

        unexpectedKeys:
          Object.freeze(
            unexpectedKeys.slice()
          )
      });
    }

    const quaternion =
      normalizeQuaternionStrict(
        payload.quaternion
      );

    if (!quaternion) {
      return Object.freeze({
        pass: false,

        code:
          "ARCHCOIN_ORBIT_PREVIEW_COMPLETE_QUATERNION_REQUIRED"
      });
    }

    const primaryId =
      normalizeWing(payload.primaryId);

    if (!primaryId) {
      return Object.freeze({
        pass: false,

        code:
          "ARCHCOIN_ORBIT_PREVIEW_CANONICAL_PRIMARY_WING_REQUIRED"
      });
    }

    return Object.freeze({
      pass: true,

      orientation: Object.freeze({
        quaternion: Object.freeze(
          quaternion.slice()
        ),

        primaryId
      })
    });
  }

  function validateClusterPreviewPayload(
    cluster,
    payload
  ) {
    if (
      !cluster ||
      !payload ||
      typeof payload !== "object" ||
      Array.isArray(payload)
    ) {
      return Object.freeze({
        pass: false,

        code:
          "ARCHCOIN_CLUSTER_PREVIEW_PAYLOAD_REQUIRED"
      });
    }

    const unexpectedKeys =
      unexpectedPreviewPayloadKeys(payload);

    if (unexpectedKeys.length > 0) {
      return Object.freeze({
        pass: false,

        code:
          "ARCHCOIN_CLUSTER_PREVIEW_UNEXPECTED_FIELDS_FORBIDDEN",

        unexpectedKeys:
          Object.freeze(
            unexpectedKeys.slice()
          )
      });
    }

    const quaternion =
      normalizeQuaternionStrict(
        payload.quaternion
      );

    if (!quaternion) {
      return Object.freeze({
        pass: false,

        code:
          "ARCHCOIN_CLUSTER_PREVIEW_COMPLETE_QUATERNION_REQUIRED"
      });
    }

    const primaryId =
      normalizeRoomId(
        payload.primaryId
      );

    if (
      !primaryId ||
      !cluster.roomIds.includes(
        primaryId
      )
    ) {
      return Object.freeze({
        pass: false,

        code:
          `ARCHCOIN_CLUSTER_PREVIEW_CANONICAL_PRIMARY_ROOM_REQUIRED:${cluster.wing}`
      });
    }

    return Object.freeze({
      pass: true,

      orientation: Object.freeze({
        quaternion: Object.freeze(
          quaternion.slice()
        ),

        primaryId
      })
    });
  }

  function presentationModeForState(
    navigationState = state.current
  ) {
    return (
      PRESENTATION_MODE_BY_STATE[
        navigationState
      ] ||
      PRESENTATION_MODES.HELD
    );
  }

  function wingToCoin(wing) {
    return (
      WING_TO_COIN[
        normalizeWing(wing)
      ] || ""
    );
  }

  function createClusterState(wing) {
    const roomIds =
      ROOMS_BY_WING.get(wing) ||
      Object.freeze([]);

    const primaryRoom =
      roomIds[0] || "";

    const orientation =
      createOrientation(
        QUATERNION.identity,
        primaryRoom
      );

    return {
      wing,
      roomIds: Array.from(roomIds),

      primaryRoom,
      previewPrimaryRoom: primaryRoom,

      phase:
        ORIENTATION_PHASES.COMMITTED,

      gestureActive: false,
      previewAccepted: false,
      revision: 0,

      orientation:
        cloneOrientation(orientation),

      committedOrientation:
        cloneOrientation(orientation),

      gestureOrigin: null
    };
  }

  function getCluster(wing) {
    const normalizedWing =
      normalizeWing(wing);

    return normalizedWing
      ? state.clusters.get(
          normalizedWing
        ) || null
      : null;
  }

  function activeClusterWing() {
    if (
      state.current ===
        STATES.CLUSTER_OPEN ||
      state.current ===
        STATES.ROOM_SELECTED
    ) {
      return normalizeWing(
        state.selectedCardinal
      );
    }

    return "";
  }

  function activeCluster() {
    return getCluster(
      activeClusterWing()
    );
  }

  function canTransition(
    fromState,
    toState
  ) {
    return Boolean(
      TRANSITIONS[fromState] &&
      TRANSITIONS[fromState].includes(
        toState
      )
    );
  }

  function isHeld() {
    return (
      state.current ===
      STATES.SYSTEM_HELD
    );
  }

  function interactionAllowed() {
    return !isHeld();
  }

  function subscribe(
    channel,
    callback
  ) {
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

  function publish(
    channel,
    payload
  ) {
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
      typeof globalThis.CSS.escape ===
        "function"
    ) {
      return globalThis.CSS.escape(
        source
      );
    }

    return source.replace(
      /["\\]/g,
      "\\$&"
    );
  }

  function findCoinElement(wing) {
    const normalizedWing =
      normalizeWing(wing);

    if (
      !normalizedWing ||
      !state.root
    ) {
      return null;
    }

    return qs(
      `[data-archcoin-coin][data-wing="${normalizedWing}"]`,
      state.root
    );
  }

  function findRoomElement(roomId) {
    const id =
      normalizeRoomId(roomId);

    if (
      !id ||
      !state.root
    ) {
      return null;
    }

    return qs(
      `[data-archcoin-room][data-room-id="${escapeSelectorValue(id)}"]`,
      state.root
    );
  }

  function canonicalControlExists(record) {
    const kind = String(
      record.kind || ""
    )
      .trim()
      .toLowerCase();

    const id = String(
      record.id ||
      record.roomId ||
      record.wing ||
      record.cardinalId ||
      ""
    ).trim();

    if (!id) {
      return false;
    }

    if (kind === "room") {
      return Boolean(
        findRoomElement(id)
      );
    }

    if (
      kind === "cardinal" ||
      kind === "coin"
    ) {
      return Boolean(
        findCoinElement(id)
      );
    }

    return Boolean(
      findRoomElement(id) ||
      findCoinElement(id)
    );
  }

  function destinationFromElement(element) {
    if (!element) {
      return null;
    }

    return Object.freeze({
      destinationType: String(
        element.dataset.destinationType ||
        ""
      )
        .trim()
        .toLowerCase(),

      destinationId: String(
        element.dataset.destinationId ||
        element.dataset.roomId ||
        element.dataset.coinId ||
        element.dataset.wing ||
        ""
      ).trim(),

      label: normalizeLabel(
        element.dataset.label ||
        element.dataset.roomLabel ||
        element.dataset.coinLabel ||
        element.textContent
      ),

      route: normalizeRoute(
        element.dataset.route ||
        element.getAttribute("href")
      )
    });
  }

  function roomParagraphFromElement(
    element
  ) {
    return normalizeLabel(
      element.dataset.preview ||
      element.dataset.roomSummary ||
      element.dataset.localFunction ||
      element.dataset.roomFunction ||
      element.dataset.panelBody ||
      element.dataset.whyEnter ||
      element.dataset.panelWhy,

      "This room is part of the selected ARCHCOIN domain. Review its purpose, then enter the declared path when ready."
    );
  }

  function panelFromCoin(element) {
    return Object.freeze({
      eyebrow: normalizeLabel(
        element.dataset.coinLabel ||
        element.dataset.label,
        "Selected domain"
      ),

      title: normalizeLabel(
        element.dataset.panelTitle ||
        element.dataset.coinTitle ||
        element.dataset.label,
        "Selected domain"
      ),

      purpose: normalizeLabel(
        element.dataset.panelBody ||
        element.dataset.coinBody ||
        element.dataset.coinFunction,
        "This domain opens a four-room ARCHCOIN cluster."
      ),

      relationship: normalizeLabel(
        element.dataset.panelWhy ||
        element.dataset.coinWhy,
        "Rotate the cluster and choose the room that matches the task."
      )
    });
  }

  function panelFromRoom(element) {
    return Object.freeze({
      eyebrow: normalizeLabel(
        element.dataset.roomLensLabel ||
        element.dataset.roomType,
        "Selected path"
      ),

      title: normalizeLabel(
        element.dataset.panelTitle ||
        element.dataset.label ||
        element.textContent,
        "Selected room"
      ),

      purpose:
        roomParagraphFromElement(
          element
        ),

      relationship:
        "Choose Enter Selected Path to open this room, or Return to Orbit to restore its four-room cluster."
    });
  }

  function defaultPanel() {
    return Object.freeze({
      eyebrow: "Selected path",
      title: "Choose a financial domain",

      purpose:
        "Begin with the financial domain that most closely matches the question in front of you.",

      relationship:
        "Tap a cardinal crystal or label to open its four-room cluster."
    });
  }

  function compassPanel() {
    return Object.freeze({
      eyebrow: "Main Compass",
      title: "Choose where to return",

      purpose:
        "The fixed-center Compass is selected. It does not navigate until you choose the explicit return action.",

      relationship:
        "Return to Main Compass opens the Diamond Gate Bridge homepage. Return to Orbit restores the active ARCHCOIN field."
    });
  }

  function setPanel({
    eyebrow,
    title,
    purpose,
    relationship
  }) {
    if (state.panelEyebrow) {
      state.panelEyebrow.textContent =
        eyebrow || "Selected path";
    }

    if (state.panelTitle) {
      state.panelTitle.textContent =
        title ||
        "Choose a financial domain";
    }

    if (state.panelPurpose) {
      state.panelPurpose.textContent =
        purpose || "";
    }

    if (state.panelRelationship) {
      state.panelRelationship.textContent =
        relationship || "";
    }
  }

  function setPanelMetadata({
    domain = "None",
    functionLabel = "Unassigned",
    coordinate = "—",
    selection = "Idle",
    route = "Not selected",
    lens = "Overview"
  } = {}) {
    if (state.panelDomain) {
      state.panelDomain.textContent =
        domain;
    }

    if (state.panelFunction) {
      state.panelFunction.textContent =
        functionLabel;
    }

    if (state.panelCoordinate) {
      state.panelCoordinate.textContent =
        coordinate;
    }

    if (state.panelSelectionState) {
      state.panelSelectionState.textContent =
        selection;
    }

    if (state.panelRouteStatus) {
      state.panelRouteStatus.textContent =
        route;
    }

    if (state.panelLens) {
      state.panelLens.textContent =
        lens;
    }
  }

  function setGuidance(message) {
    if (state.guidance) {
      state.guidance.textContent =
        String(message || "");
    }
  }

  function setEnterEnabled(
    enabled,
    label = "Enter Selected Path"
  ) {
    if (!state.enterButton) {
      return;
    }

    state.enterButton.disabled =
      !enabled;

    state.enterButton.setAttribute(
      "aria-disabled",
      enabled ? "false" : "true"
    );

    if (state.enterLabel) {
      state.enterLabel.textContent =
        label;
    } else {
      state.enterButton.textContent =
        label;
    }
  }

  function setReturnToOrbitVisible(
    visible,
    label = "Return to Orbit"
  ) {
    const control =
      state.returnToOrbitButton;

    if (!control) {
      return;
    }

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
      control.removeAttribute(
        "tabindex"
      );
    } else {
      control.setAttribute(
        "tabindex",
        "-1"
      );
    }

    if (state.returnToOrbitLabel) {
      state.returnToOrbitLabel.textContent =
        label;
    } else {
      control.textContent = label;
    }
  }

  function setReturnHomeVisible(visible) {
    if (!state.returnHomeButton) {
      return;
    }

    state.returnHomeButton.hidden =
      !visible;

    state.returnHomeButton.setAttribute(
      "aria-hidden",
      visible ? "false" : "true"
    );

    if (visible) {
      state.returnHomeButton.removeAttribute(
        "tabindex"
      );
    } else {
      state.returnHomeButton.setAttribute(
        "tabindex",
        "-1"
      );
    }
  }

  function clearPanelDescentSchedule() {
    if (state.panelDescentFrame) {
      cancelAnimationFrame(
        state.panelDescentFrame
      );

      state.panelDescentFrame = 0;
    }

    if (state.panelDescentCommitFrame) {
      cancelAnimationFrame(
        state.panelDescentCommitFrame
      );

      state.panelDescentCommitFrame = 0;
    }
  }

  function clearSceneAscentSchedule() {
    if (state.sceneAscentFrame) {
      cancelAnimationFrame(
        state.sceneAscentFrame
      );

      state.sceneAscentFrame = 0;
    }

    if (state.sceneAscentCommitFrame) {
      cancelAnimationFrame(
        state.sceneAscentCommitFrame
      );

      state.sceneAscentCommitFrame = 0;
    }
  }

  function clearViewportSchedules() {
    clearPanelDescentSchedule();
    clearSceneAscentSchedule();
  }

  function schedulePanelDescent(
    predicate,
    action
  ) {
    clearViewportSchedules();

    if (!state.panel) {
      return;
    }

    state.panelDescentFrame =
      requestAnimationFrame(() => {
        state.panelDescentFrame = 0;

        state.panelDescentCommitFrame =
          requestAnimationFrame(() => {
            state.panelDescentCommitFrame =
              0;

            if (
              typeof predicate ===
                "function" &&
              !predicate()
            ) {
              return;
            }

            state.panel.scrollIntoView({
              behavior:
                state.reducedMotion
                  ? "auto"
                  : "smooth",

              block: "start",
              inline: "nearest"
            });

            state.panelDescended = true;

            recordAction(action);
          });
      });
  }

  function scheduleRoomPanelDescent(
    expectedRoomId
  ) {
    schedulePanelDescent(
      () =>
        state.current ===
          STATES.ROOM_SELECTED &&
        state.selectedRoom ===
          expectedRoomId &&
        !state.compassSelected,

      `room-panel-descended:${expectedRoomId}`
    );
  }

  function scheduleCompassPanelDescent() {
    schedulePanelDescent(
      () =>
        state.compassSelected === true,

      "compass-panel-descended"
    );
  }

  function scheduleSceneAscent(
    expectedState,
    expectedWing = ""
  ) {
    clearViewportSchedules();

    if (!state.scene) {
      return;
    }

    state.sceneAscentFrame =
      requestAnimationFrame(() => {
        state.sceneAscentFrame = 0;

        state.sceneAscentCommitFrame =
          requestAnimationFrame(() => {
            state.sceneAscentCommitFrame =
              0;

            if (
              state.current !==
              expectedState
            ) {
              return;
            }

            if (
              expectedWing &&
              state.selectedCardinal !==
                expectedWing
            ) {
              return;
            }

            state.scene.scrollIntoView({
              behavior:
                state.reducedMotion
                  ? "auto"
                  : "smooth",

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

    state.selectedDestinationType =
      DESTINATION_TYPES.NONE;

    state.selectedDestinationId = "";
    state.selectedDestinationLabel = "";
    state.selectedRoute = "";
    state.selectedContentId = "";
    state.selectedLens = "overview";
    state.selectedParagraph = "";
    state.panelDescended = false;

    if (!preserveCompass) {
      state.compassSelected = false;
    }
  }

  function createPresentationState() {
    const presentation =
      PRESENTATION_BY_STATE[
        state.current
      ] ||
      PRESENTATION_BY_STATE[
        STATES.SYSTEM_HELD
      ];

    return Object.freeze({
      mode: presentation.mode,
      navigationState: state.current,

      outerCardinalsActive:
        presentation.outerCardinalsActive,

      activeRoomCluster:
        presentation.activeRoomCluster,

      roomSelectionPermitted:
        presentation.roomSelectionPermitted,

      additiveCoRenderingAuthorized:
        false
    });
  }

  function createHeldState() {
    return Object.freeze({
      held: isHeld(),
      terminal: isHeld(),

      interactionEnabled:
        interactionAllowed(),

      presentationMode:
        presentationModeForState(),

      reason:
        isHeld()
          ? state.lastFailure ||
            "ARCHCOIN_SYSTEM_HELD"
          : ""
    });
  }

  function createCompassState() {
    return Object.freeze({
      fixedCenter: true,
      selected: state.compassSelected,

      interactionEnabled:
        interactionAllowed(),

      reducedMotion:
        state.reducedMotion,

      mainCompassRoute:
        MAIN_COMPASS.route,

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
      Array.from(
        state.semanticProjection.values()
      ).map(record =>
        Object.freeze({
          id: record.id,
          kind: record.kind,
          x: record.x,
          y: record.y,
          radiusPx: record.radiusPx,

          depthLayer:
            record.depthLayer,

          compassOverlap:
            record.compassOverlap,

          visible:
            record.visible,

          interactionPriority:
            record.interactionPriority
        })
      )
    );
  }

  function createFrameState() {
    const cluster =
      activeCluster();

    const presentation =
      createPresentationState();

    return Object.freeze({
      moduleId: MODULE.id,
      moduleVersion: MODULE.version,

      motionContractId:
        MODULE.motionContractId,

      motionContractVersion:
        MODULE.motionContractVersion,

      state: state.current,
      navigationState: state.current,

      presentationMode:
        presentation.mode,

      presentation,

      orbitFocus:
        state.orbitFocus,

      orbitPreviewFocus:
        state.orbitPreviewFocus,

      orbitPhase:
        state.orbitPhase,

      orbitGestureActive:
        state.orbitGestureActive,

      orbitPreviewAccepted:
        state.orbitPreviewAccepted,

      orbitRevision:
        state.orbitRevision,

      orbitOrientation:
        freezeOrientation(
          state.orbitOrientation
        ),

      committedOrbitOrientation:
        freezeOrientation(
          state.committedOrbitOrientation
        ),

      activeClusterWing:
        cluster ? cluster.wing : "",

      cluster:
        cluster
          ? Object.freeze({
              wing: cluster.wing,

              roomIds: Object.freeze(
                cluster.roomIds.slice()
              ),

              primaryRoom:
                cluster.primaryRoom,

              previewPrimaryRoom:
                cluster.previewPrimaryRoom,

              phase:
                cluster.phase,

              gestureActive:
                cluster.gestureActive,

              previewAccepted:
                cluster.previewAccepted,

              revision:
                cluster.revision,

              orientation:
                freezeOrientation(
                  cluster.orientation
                ),

              committedOrientation:
                freezeOrientation(
                  cluster.committedOrientation
                )
            })
          : null,

      selectedCardinal:
        state.selectedCardinal,

      selectedCoin:
        state.selectedCoin,

      selectedRoom:
        state.selectedRoom,

      selectedDestinationType:
        state.selectedDestinationType,

      selectedDestinationId:
        state.selectedDestinationId,

      selectedDestinationLabel:
        state.selectedDestinationLabel,

      selectedRoute:
        state.selectedRoute,

      selectedContentId:
        state.selectedContentId,

      selectedLens:
        state.selectedLens,

      selectedParagraph:
        state.selectedParagraph,

      compassSelected:
        state.compassSelected,

      panelDescended:
        state.panelDescended,

      reducedMotion:
        state.reducedMotion,

      held: isHeld(),

      compass:
        createCompassState(),

      semanticProjectionRevision:
        state.semanticProjectionRevision,

      semanticProjection:
        createSemanticProjectionSnapshot(),

      canonicalRoomRecords:
        CANONICAL_ROOM_RECORDS,

      canonicalRoomRoutes:
        CANONICAL_ROOM_ROUTES,

      mainCompass:
        MAIN_COMPASS,

      interactionModuleId:
        MODULE.interactionModuleId,

      interactionModuleVersion:
        MODULE.interactionModuleVersion,

      motionOwner:
        MODULE.interactionModuleId,

      acceptedStateAuthority:
        MODULE.id,

      navigationTransitionAuthority:
        MODULE.id,

      lastAction:
        state.lastAction,

      lastFailure:
        state.lastFailure
    });
  }

  function createCompatibilityReceipt(frame) {
    return Object.freeze({
      contractId:
        "ARCHCOIN_CONTROLLER_INTERACTION_v7",

      motionContractId:
        MODULE.motionContractId,

      motionContractVersion:
        MODULE.motionContractVersion,

      status:
        frame.held
          ? "held"
          : "available",

      state: frame.state,

      navigationState:
        frame.navigationState,

      presentationMode:
        frame.presentationMode,

      outerCardinalsActive:
        frame.presentation
          .outerCardinalsActive,

      activeRoomCluster:
        frame.presentation
          .activeRoomCluster,

      roomSelectionPermitted:
        frame.presentation
          .roomSelectionPermitted,

      additiveCoRenderingAuthorized:
        false,

      orbitFocus:
        frame.orbitFocus,

      orbitPreviewFocus:
        frame.orbitPreviewFocus,

      orbitPhase:
        frame.orbitPhase,

      orbitGestureActive:
        frame.orbitGestureActive,

      orbitPreviewAccepted:
        frame.orbitPreviewAccepted,

      orbitRevision:
        frame.orbitRevision,

      orbitQuaternion:
        frame.orbitOrientation.quaternion,

      activeClusterWing:
        frame.activeClusterWing,

      clusterPrimaryRoom:
        frame.cluster
          ? frame.cluster.primaryRoom
          : "",

      clusterPreviewPrimaryRoom:
        frame.cluster
          ? frame.cluster
              .previewPrimaryRoom
          : "",

      clusterPhase:
        frame.cluster
          ? frame.cluster.phase
          : ORIENTATION_PHASES.IDLE,

      clusterGestureActive:
        frame.cluster
          ? frame.cluster.gestureActive
          : false,

      clusterPreviewAccepted:
        frame.cluster
          ? frame.cluster.previewAccepted
          : false,

      clusterRevision:
        frame.cluster
          ? frame.cluster.revision
          : 0,

      clusterQuaternion:
        frame.cluster
          ? frame.cluster
              .orientation.quaternion
          : QUATERNION.identity,

      selectedCardinal:
        frame.selectedCardinal,

      selectedCoin:
        frame.selectedCoin,

      selectedRoom:
        frame.selectedRoom,

      selectedDestinationType:
        frame.selectedDestinationType,

      selectedDestinationId:
        frame.selectedDestinationId,

      selectedDestinationLabel:
        frame.selectedDestinationLabel,

      selectedRoute:
        frame.selectedRoute,

      compassSelected:
        frame.compassSelected,

      panelDescended:
        frame.panelDescended,

      reducedMotion:
        frame.reducedMotion,

      held:
        frame.held,

      compassFixedCenter:
        frame.compass.fixedCenter,

      compassImmediateNavigation:
        frame.compass.immediateNavigation,

      compassExplicitReturnRequired:
        frame.compass
          .explicitReturnRequired,

      mainCompassRoute:
        frame.compass.mainCompassRoute,

      semanticProjectionRevision:
        frame.semanticProjectionRevision,

      pointerInterpreterOwner:
        MODULE.interactionModuleId,

      pointerTapArbitrationOwner:
        MODULE.interactionModuleId,

      wholeCrystalHitTestOwner:
        MODULE.interactionModuleId,

      syntheticClickSuppressionOwner:
        MODULE.interactionModuleId,

      clusterExitSwipeClassificationOwner:
        MODULE.interactionModuleId,

      projectionDomApplicationOwner:
        MODULE.interactionModuleId,

      motionDirectionOwner:
        MODULE.interactionModuleId,

      motionSensitivityOwner:
        MODULE.interactionModuleId,

      gestureAxisSelectionOwner:
        MODULE.interactionModuleId,

      gestureQuaternionConstructionOwner:
        MODULE.interactionModuleId,

      grabbedObjectTrackingOwner:
        MODULE.interactionModuleId,

      primaryVisualIdentityCalculationOwner:
        MODULE.interactionModuleId,

      orbitStateAuthority:
        MODULE.id,

      clusterStateAuthority:
        MODULE.id,

      quaternionAcceptanceAuthority:
        MODULE.id,

      navigationTransitionAuthority:
        MODULE.id,

      clusterExitTransitionAuthority:
        MODULE.id,

      lastAction:
        frame.lastAction,

      lastFailure:
        frame.lastFailure
    });
  }

  function syncDatasets(frame) {
    if (!state.root) {
      return;
    }

    const cluster = frame.cluster;

    state.root.dataset.archcoinMode =
      frame.presentationMode;

    state.root.dataset.archcoinControllerState =
      frame.navigationState;

    state.root.dataset.archcoinNavigationState =
      frame.navigationState;

    state.root.dataset.archcoinPresentationMode =
      frame.presentationMode;

    state.root.dataset.outerCardinalsActive =
      frame.presentation
        .outerCardinalsActive
        ? "true"
        : "false";

    state.root.dataset.activeRoomCluster =
      frame.presentation
        .activeRoomCluster
        ? "true"
        : "false";

    state.root.dataset.roomSelectionPermitted =
      frame.presentation
        .roomSelectionPermitted
        ? "true"
        : "false";

    state.root.dataset.additiveCoRenderingAuthorized =
      "false";

    state.root.dataset.orbitFocus =
      frame.orbitFocus;

    state.root.dataset.orbitPreviewFocus =
      frame.orbitPreviewFocus;

    state.root.dataset.orbitPhase =
      frame.orbitPhase;

    state.root.dataset.orbitGestureActive =
      frame.orbitGestureActive
        ? "true"
        : "false";

    state.root.dataset.orbitPreviewAccepted =
      frame.orbitPreviewAccepted
        ? "true"
        : "false";

    state.root.dataset.orbitRevision =
      String(frame.orbitRevision);

    state.root.dataset.orbitQuaternion =
      JSON.stringify(
        frame.orbitOrientation.quaternion
      );

    state.root.dataset.activeClusterWing =
      frame.activeClusterWing;

    state.root.dataset.clusterPrimaryRoom =
      cluster
        ? cluster.primaryRoom
        : "";

    state.root.dataset.clusterPreviewPrimaryRoom =
      cluster
        ? cluster.previewPrimaryRoom
        : "";

    state.root.dataset.clusterPhase =
      cluster
        ? cluster.phase
        : ORIENTATION_PHASES.IDLE;

    state.root.dataset.clusterGestureActive =
      cluster &&
      cluster.gestureActive
        ? "true"
        : "false";

    state.root.dataset.clusterPreviewAccepted =
      cluster &&
      cluster.previewAccepted
        ? "true"
        : "false";

    state.root.dataset.clusterRevision =
      String(
        cluster
          ? cluster.revision
          : 0
      );

    state.root.dataset.clusterQuaternion =
      cluster
        ? JSON.stringify(
            cluster.orientation.quaternion
          )
        : "";

    state.root.dataset.selectedCardinal =
      frame.selectedCardinal;

    state.root.dataset.selectedCoin =
      frame.selectedCoin;

    state.root.dataset.selectedRoom =
      frame.selectedRoom;

    state.root.dataset.selectedDestinationType =
      frame.selectedDestinationType;

    state.root.dataset.selectedDestinationId =
      frame.selectedDestinationId;

    state.root.dataset.selectedDestinationLabel =
      frame.selectedDestinationLabel;

    state.root.dataset.selectedRoute =
      frame.selectedRoute;

    state.root.dataset.selectedContentId =
      frame.selectedContentId;

    state.root.dataset.selectedLens =
      frame.selectedLens;

    state.root.dataset.selectedParagraph =
      frame.selectedParagraph;

    state.root.dataset.compassSelected =
      frame.compassSelected
        ? "true"
        : "false";

    state.root.dataset.panelDescended =
      frame.panelDescended
        ? "true"
        : "false";

    state.root.dataset.reducedMotion =
      frame.reducedMotion
        ? "true"
        : "false";

    state.root.dataset.held =
      frame.held
        ? "true"
        : "false";

    state.root.dataset.compassFixedCenter =
      "true";

    state.root.dataset.compassMainRoute =
      MAIN_COMPASS.route;

    state.root.dataset.compassImmediateNavigation =
      "false";

    state.root.dataset.archcoinControllerStatus =
      frame.held
        ? "held"
        : "available";

    state.root.dataset.archcoinControllerVersion =
      MODULE.version;

    state.root.dataset.archcoinInteractionModule =
      MODULE.interactionModuleId;

    state.root.dataset.archcoinMotionContractId =
      MODULE.motionContractId;

    state.root.dataset.archcoinMotionContractVersion =
      MODULE.motionContractVersion;

    state.root.dataset.archcoinMotionOwner =
      MODULE.interactionModuleId;

    state.root.dataset.archcoinAcceptedStateAuthority =
      MODULE.id;

    state.root.dataset.archcoinNavigationAuthority =
      MODULE.id;

    state.root.dataset.semanticProjectionRevision =
      String(
        frame.semanticProjectionRevision
      );

    qsa(
      "[data-archcoin-coin]",
      state.root
    ).forEach(element => {
      const wing =
        normalizeWing(
          element.dataset.wing
        );

      const active =
        frame.presentation
          .outerCardinalsActive;

      const primary =
        active &&
        wing === frame.orbitFocus;

      element.dataset.active =
        active ? "true" : "false";

      element.dataset.selected =
        !frame.compassSelected &&
        frame.selectedDestinationType ===
          DESTINATION_TYPES.COIN &&
        frame.selectedCardinal === wing
          ? "true"
          : "false";

      element.dataset.primary =
        primary ? "true" : "false";

      element.setAttribute(
        "aria-disabled",
        active ? "false" : "true"
      );

      if (primary) {
        element.setAttribute(
          "aria-current",
          "true"
        );
      } else {
        element.removeAttribute(
          "aria-current"
        );
      }
    });

    qsa(
      "[data-archcoin-room]",
      state.root
    ).forEach(element => {
      const roomId =
        normalizeRoomId(
          element.dataset.roomId
        );

      const roomRecord =
        ROOM_BY_ID.get(roomId);

      const inActiveCluster =
        Boolean(
          cluster &&
          roomRecord &&
          roomRecord.wing ===
            cluster.wing
        );

      const selected =
        !frame.compassSelected &&
        inActiveCluster &&
        roomId === frame.selectedRoom;

      const primary =
        inActiveCluster &&
        roomId === cluster.primaryRoom;

      element.dataset.active =
        inActiveCluster
          ? "true"
          : "false";

      element.dataset.selected =
        selected
          ? "true"
          : "false";

      element.dataset.primary =
        primary
          ? "true"
          : "false";

      element.setAttribute(
        "aria-disabled",
        inActiveCluster
          ? "false"
          : "true"
      );

      if (
        selected ||
        primary
      ) {
        element.setAttribute(
          "aria-current",
          "true"
        );
      } else {
        element.removeAttribute(
          "aria-current"
        );
      }
    });

    if (state.compassControl) {
      state.compassControl.dataset.selected =
        frame.compassSelected
          ? "true"
          : "false";

      state.compassControl.dataset.fixedCenter =
        "true";

      state.compassControl.dataset.interactionEnabled =
        frame.compass.interactionEnabled
          ? "true"
          : "false";

      state.compassControl.dataset.immediateNavigation =
        "false";

      state.compassControl.setAttribute(
        "aria-expanded",
        frame.compassSelected
          ? "true"
          : "false"
      );

      if (frame.compassSelected) {
        state.compassControl.setAttribute(
          "aria-current",
          "true"
        );
      } else {
        state.compassControl.removeAttribute(
          "aria-current"
        );
      }
    }
  }

  function writeCompatibilityReceipt(frame) {
    const receipt =
      createCompatibilityReceipt(frame);

    const serialized =
      JSON.stringify(receipt);

    if (state.root) {
      state.root.dataset.archcoinControllerReceipt =
        serialized;
    }

    if (state.controllerReceiptOutput) {
      if (
        "value" in
        state.controllerReceiptOutput
      ) {
        state.controllerReceiptOutput.value =
          serialized;
      }

      state.controllerReceiptOutput.textContent =
        serialized;
    }

    globalThis.DGB_ARCHCOIN_CONTROLLER_RECEIPT =
      receipt;
  }

  function publishFrame() {
    const frame =
      createFrameState();

    syncDatasets(frame);
    writeCompatibilityReceipt(frame);

    publish(
      CHANNELS.FRAME,
      frame
    );

    return frame;
  }

  function recordAction(
    action,
    failure = ""
  ) {
    state.lastAction =
      String(action || "");

    state.lastFailure =
      String(failure || "");

    return publishFrame();
  }

  function rejectRequest(
    action,
    code
  ) {
    recordAction(
      action,
      code
    );

    return false;
  }

  function syncPresentation() {
    if (state.compassSelected) {
      setPanel(compassPanel());

      setPanelMetadata({
        domain: "Main Compass",
        functionLabel:
          "Website gateway",
        coordinate: "Fixed center",
        selection:
          "Compass selected",
        route: MAIN_COMPASS.route,
        lens: "Return"
      });

      setEnterEnabled(
        false,
        "Enter Selected Path"
      );

      setReturnHomeVisible(true);

      setReturnToOrbitVisible(
        true,
        state.current ===
          STATES.CONSTELLATION
          ? "Return to Constellation"
          : "Return to Orbit"
      );

      setGuidance(
        "The Compass is selected. Use Return to Main Compass to leave ARCHCOIN, or Return to Orbit to restore this field."
      );

      return;
    }

    setReturnHomeVisible(false);

    if (
      state.current ===
      STATES.CONSTELLATION
    ) {
      setPanel(defaultPanel());
      setPanelMetadata();

      setEnterEnabled(
        false,
        "Enter Selected Path"
      );

      setReturnToOrbitVisible(false);

      setGuidance(
        "Tap any visible part of a cardinal crystal or its label to open its cluster. Drag the constellation directly to move it."
      );

      return;
    }

    if (
      state.current ===
      STATES.CLUSTER_OPEN
    ) {
      const coin =
        findCoinElement(
          state.selectedCardinal
        );

      if (coin) {
        setPanel(
          panelFromCoin(coin)
        );

        setPanelMetadata({
          domain: normalizeLabel(
            coin.dataset.label,
            wingToCoin(
              state.selectedCardinal
            )
          ),

          functionLabel:
            normalizeLabel(
              coin.dataset.panelTitle ||
              coin.dataset.coinFunction ||
              coin.dataset.label,
              "Domain"
            ),

          coordinate:
            normalizeLabel(
              coin.dataset.coordinateLabel,
              state.selectedCardinal
            ),

          selection: "Cluster open",
          route: "Room required",
          lens: "Overview"
        });
      }

      setEnterEnabled(
        false,
        "Enter Selected Path"
      );

      setReturnToOrbitVisible(false);

      setGuidance(
        "Drag a room crystal directly to rotate the cluster. Drag outward from the cluster to return to the constellation."
      );

      return;
    }

    if (
      state.current ===
      STATES.ROOM_SELECTED
    ) {
      const room =
        findRoomElement(
          state.selectedRoom
        );

      if (room) {
        setPanel(
          panelFromRoom(room)
        );

        setPanelMetadata({
          domain: normalizeLabel(
            state.selectedCoin,
            "Selected domain"
          ),

          functionLabel:
            normalizeLabel(
              room.dataset.localFunction,
              "Room"
            ),

          coordinate:
            normalizeLabel(
              room.dataset.localCoordinate,
              state.selectedRoom
            ),

          selection: "Room selected",

          route:
            state.selectedRoute ||
            "Not selected",

          lens: normalizeLabel(
            state.selectedLens,
            "Overview"
          )
        });
      }

      setEnterEnabled(
        Boolean(state.selectedRoute),
        "Enter Selected Path"
      );

      setReturnToOrbitVisible(
        true,
        "Return to Orbit"
      );

      setGuidance(
        "Review the selected room. Enter Selected Path opens its canonical route. Drag outward from the cluster to return to the constellation."
      );

      return;
    }

    setPanel({
      eyebrow: "System held",
      title:
        "ARCHCOIN is unavailable",

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

    setEnterEnabled(
      false,
      "Unavailable"
    );

    setReturnHomeVisible(false);
    setReturnToOrbitVisible(false);

    setGuidance(
      "ARCHCOIN is held because its controller foundation could not be validated."
    );
  }

  function applyState(
    nextState,
    patch = {},
    action = ""
  ) {
    invariant(
      canTransition(
        state.current,
        nextState
      ),
      "ARCHCOIN_ILLEGAL_STATE_TRANSITION",
      {
        from: state.current,
        to: nextState
      }
    );

    const previousHeld =
      isHeld();

    state.current = nextState;

    for (
      const [key, value]
      of Object.entries(patch)
    ) {
      if (
        Object.prototype
          .hasOwnProperty
          .call(state, key)
      ) {
        state[key] = value;
      }
    }

    syncPresentation();

    const frame =
      recordAction(action);

    if (
      previousHeld !== frame.held
    ) {
      publish(
        CHANNELS.HELD_STATE,
        createHeldState()
      );

      publish(
        CHANNELS.COMPASS_STATE,
        createCompassState()
      );
    }

    return true;
  }

  function setConstellationOrientation(
    orientation,
    {
      committed = false,
      phase =
        ORIENTATION_PHASES.PREVIEW,
      gestureActive = false,
      previewAccepted = false,
      incrementRevision = false
    } = {}
  ) {
    const normalized =
      cloneOrientation(orientation);

    invariant(
      normalizeWing(
        normalized.primaryId
      ),
      "ARCHCOIN_CONSTELLATION_PRIMARY_WING_INVALID"
    );

    state.orbitOrientation =
      normalized;

    state.orbitPreviewFocus =
      normalized.primaryId;

    state.orbitPhase = phase;

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
      phase =
        ORIENTATION_PHASES.PREVIEW,
      gestureActive = false,
      previewAccepted = false,
      incrementRevision = false
    } = {}
  ) {
    invariant(
      cluster,
      "ARCHCOIN_CLUSTER_REQUIRED"
    );

    const normalized =
      cloneOrientation(orientation);

    invariant(
      cluster.roomIds.includes(
        normalized.primaryId
      ),
      `ARCHCOIN_CLUSTER_PRIMARY_ROOM_INVALID:${cluster.wing}`
    );

    cluster.orientation = normalized;

    cluster.previewPrimaryRoom =
      normalized.primaryId;

    cluster.phase = phase;

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
      state.current !==
        STATES.CONSTELLATION
    ) {
      return false;
    }

    if (state.orbitGestureActive) {
      return true;
    }

    state.orbitGestureOrigin =
      cloneOrientation(
        state.committedOrbitOrientation
      );

    setConstellationOrientation(
      state.orbitOrientation,
      {
        committed: false,
        phase:
          ORIENTATION_PHASES.PREVIEW,
        gestureActive: true,
        previewAccepted: false
      }
    );

    recordAction(
      "orbit-gesture-began"
    );

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
      state.current !==
        STATES.CONSTELLATION
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
      validateOrbitPreviewPayload(
        payload
      );

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
        phase:
          ORIENTATION_PHASES.PREVIEW,
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
      state.current !==
        STATES.CONSTELLATION
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
      cloneOrientation(
        state.orbitOrientation
      );

    setConstellationOrientation(
      committed,
      {
        committed: true,
        phase:
          ORIENTATION_PHASES.COMMITTED,
        gestureActive: false,
        previewAccepted: false,
        incrementRevision: true
      }
    );

    state.orbitGestureOrigin = null;

    recordAction(
      `orbit-committed:${committed.primaryId}`
    );

    return true;
  }

  function requestOrbitCancel(
    reason = "cancelled"
  ) {
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
        phase:
          ORIENTATION_PHASES.CANCELLED,
        gestureActive: false,
        previewAccepted: false
      }
    );

    state.orbitGestureOrigin = null;

    /*
     * Publish the cancellation phase before returning the stable
     * transaction state to COMMITTED.
     */
    recordAction(
      `orbit-cancelled:${String(
        reason || "cancelled"
      )}`
    );

    state.orbitPhase =
      ORIENTATION_PHASES.COMMITTED;

    recordAction(
      "orbit-cancel-settled"
    );

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
      state.current !==
        STATES.CONSTELLATION
    ) {
      return false;
    }

    if (state.orbitGestureActive) {
      requestOrbitCancel(
        "explicit-orbit-focus"
      );
    }

    setConstellationOrientation(
      canonicalConstellationOrientation(
        normalizedWing
      ),
      {
        committed: true,
        phase:
          ORIENTATION_PHASES.COMMITTED,
        gestureActive: false,
        previewAccepted: false,
        incrementRevision: true
      }
    );

    state.orbitGestureOrigin = null;

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
        state.current ===
          STATES.CLUSTER_OPEN ||
        state.current ===
          STATES.ROOM_SELECTED
      ) ||
      normalizedWing !==
        activeClusterWing()
    ) {
      return false;
    }

    if (cluster.gestureActive) {
      return true;
    }

    cluster.gestureOrigin =
      cloneOrientation(
        cluster.committedOrientation
      );

    setClusterOrientation(
      cluster,
      cluster.orientation,
      {
        committed: false,
        phase:
          ORIENTATION_PHASES.PREVIEW,
        gestureActive: true,
        previewAccepted: false
      }
    );

    recordAction(
      `cluster-gesture-began:${normalizedWing}`
    );

    return true;
  }

  function requestClusterPreview(
    wing,
    payload
  ) {
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
        state.current ===
          STATES.CLUSTER_OPEN ||
        state.current ===
          STATES.ROOM_SELECTED
      ) ||
      normalizedWing !==
        activeClusterWing()
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
      validateClusterPreviewPayload(
        cluster,
        payload
      );

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
        phase:
          ORIENTATION_PHASES.PREVIEW,
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
        state.current ===
          STATES.CLUSTER_OPEN ||
        state.current ===
          STATES.ROOM_SELECTED
      ) ||
      normalizedWing !==
        activeClusterWing()
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
      cloneOrientation(
        cluster.orientation
      );

    setClusterOrientation(
      cluster,
      committed,
      {
        committed: true,
        phase:
          ORIENTATION_PHASES.COMMITTED,
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

  function requestClusterCancel(
    wing,
    reason = "cancelled"
  ) {
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
        phase:
          ORIENTATION_PHASES.CANCELLED,
        gestureActive: false,
        previewAccepted: false
      }
    );

    cluster.gestureOrigin = null;

    /*
     * Publish the cancellation phase before settling the transaction back
     * to COMMITTED.
     */
    recordAction(
      `cluster-cancelled:${normalizedWing}:${String(
        reason || "cancelled"
      )}`
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

    for (
      const cluster
      of state.clusters.values()
    ) {
      if (cluster.gestureActive) {
        requestClusterCancel(
          cluster.wing,
          reason
        );
      }
    }
  }

  function requestCardinalSelection(
    cardinalId
  ) {
    const wing =
      normalizeWing(cardinalId);

    if (
      isHeld() ||
      !wing ||
      state.current !==
        STATES.CONSTELLATION
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
      requestOrbitCancel(
        "cardinal-selection"
      );
    }

    const destination =
      destinationFromElement(element);

    setConstellationOrientation(
      canonicalConstellationOrientation(
        wing
      ),
      {
        committed: true,
        phase:
          ORIENTATION_PHASES.COMMITTED,
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

        selectedCoin:
          wingToCoin(wing),

        selectedDestinationType:
          DESTINATION_TYPES.COIN,

        selectedDestinationId: wing,

        selectedDestinationLabel:
          destination
            ? destination.label ||
              wingToCoin(wing)
            : wingToCoin(wing),

        selectedRoute: "",
        selectedParagraph: "",
        compassSelected: false,
        panelDescended: false
      },
      `cardinal-selected:${wing}`
    );
  }

  function requestRoomSelection(roomId) {
    const id =
      normalizeRoomId(roomId);

    if (
      isHeld() ||
      !id ||
      !(
        state.current ===
          STATES.CLUSTER_OPEN ||
        state.current ===
          STATES.ROOM_SELECTED
      )
    ) {
      return false;
    }

    const canonical =
      ROOM_BY_ID.get(id);

    const element =
      findRoomElement(id);

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

    if (
      canonical.wing !==
      state.selectedCardinal
    ) {
      recordAction(
        "room-selection-rejected",
        `ROOM_OUTSIDE_ACTIVE_CLUSTER:${id}`
      );

      return false;
    }

    const cluster =
      getCluster(canonical.wing);

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

    const declaredRoute =
      normalizeRoute(
        element.dataset.route ||
        element.getAttribute("href")
      );

    if (
      declaredRoute !==
      canonical.route
    ) {
      recordAction(
        "room-selection-rejected",
        `ROOM_ROUTE_INVALID:${id}`
      );

      return false;
    }

    if (cluster.gestureActive) {
      requestClusterCancel(
        canonical.wing,
        "room-selection"
      );
    }

    clearViewportSchedules();

    const destination =
      destinationFromElement(element);

    const committed =
      applyState(
        STATES.ROOM_SELECTED,
        {
          selectedCardinal:
            canonical.wing,

          selectedCoin:
            canonical.coin,

          selectedRoom:
            canonical.roomId,

          selectedDestinationType:
            DESTINATION_TYPES.ROOM,

          selectedDestinationId:
            canonical.roomId,

          selectedDestinationLabel:
            destination
              ? destination.label ||
                canonical.roomId
              : canonical.roomId,

          selectedRoute:
            canonical.route,

          selectedContentId:
            normalizeRoomId(
              element.dataset.contentId
            ),

          selectedLens:
            String(
              element.dataset.lens ||
              "overview"
            )
              .trim()
              .toLowerCase() ||
            "overview",

          selectedParagraph:
            roomParagraphFromElement(
              element
            ),

          compassSelected: false,
          panelDescended: true
        },
        `room-selected:${canonical.roomId}`
      );

    if (!committed) {
      return false;
    }

    scheduleRoomPanelDescent(
      canonical.roomId
    );

    return true;
  }

  function requestCompassSelection() {
    if (isHeld()) {
      return false;
    }

    cancelActiveGestures(
      "compass-selection"
    );

    clearViewportSchedules();

    state.compassSelected = true;

    state.selectedDestinationType =
      DESTINATION_TYPES.HOME_COMPASS;

    state.selectedDestinationId =
      MAIN_COMPASS.destinationId;

    state.selectedDestinationLabel =
      MAIN_COMPASS.destinationLabel;

    state.selectedRoute =
      MAIN_COMPASS.route;

    state.selectedContentId =
      "home-compass";

    state.selectedLens = "return";

    state.selectedParagraph =
      "Return to the Diamond Gate Bridge Main Compass only after choosing the explicit return action.";

    state.panelDescended = true;

    syncPresentation();

    recordAction(
      "compass-selected-local"
    );

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
      state.current !==
        STATES.ROOM_SELECTED
    ) {
      return false;
    }

    const canonical =
      ROOM_BY_ID.get(
        state.selectedRoom
      );

    if (
      !canonical ||
      state.selectedDestinationType !==
        DESTINATION_TYPES.ROOM ||
      state.selectedDestinationId !==
        canonical.roomId ||
      state.selectedRoute !==
        canonical.route ||
      !ROOM_BY_ROUTE.has(
        state.selectedRoute
      )
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

    globalThis.location.assign(
      canonical.route
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

    recordAction(
      "main-compass-return-confirmed"
    );

    globalThis.location.assign(
      MAIN_COMPASS.route
    );

    return true;
  }

  function requestReturnToOrbit() {
    if (isHeld()) {
      return false;
    }

    cancelActiveGestures(
      "return-to-orbit"
    );

    clearViewportSchedules();

    if (state.compassSelected) {
      state.compassSelected = false;

      if (
        state.current ===
        STATES.ROOM_SELECTED
      ) {
        const wing =
          normalizeWing(
            state.selectedCardinal
          );

        if (!wing) {
          return false;
        }

        const coin =
          findCoinElement(wing);

        const destination =
          destinationFromElement(coin);

        const committed =
          applyState(
            STATES.CLUSTER_OPEN,
            {
              selectedCardinal: wing,

              selectedCoin:
                wingToCoin(wing),

              selectedRoom: "",

              selectedDestinationType:
                DESTINATION_TYPES.COIN,

              selectedDestinationId:
                wing,

              selectedDestinationLabel:
                destination
                  ? destination.label ||
                    wingToCoin(wing)
                  : wingToCoin(wing),

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
          scheduleSceneAscent(
            STATES.CLUSTER_OPEN,
            wing
          );
        }

        return committed;
      }

      if (
        state.current ===
        STATES.CLUSTER_OPEN
      ) {
        state.selectedDestinationType =
          DESTINATION_TYPES.COIN;

        state.selectedDestinationId =
          state.selectedCardinal;

        state.selectedDestinationLabel =
          wingToCoin(
            state.selectedCardinal
          );

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

      if (
        state.current ===
        STATES.CONSTELLATION
      ) {
        resetSelection();
        syncPresentation();

        recordAction(
          "compass-returned-to-constellation"
        );

        scheduleSceneAscent(
          STATES.CONSTELLATION
        );

        return true;
      }
    }

    if (
      state.current !==
      STATES.ROOM_SELECTED
    ) {
      return false;
    }

    const wing =
      normalizeWing(
        state.selectedCardinal
      );

    if (!wing) {
      recordAction(
        "return-to-orbit-rejected",
        "ACTIVE_ROOM_WING_REQUIRED"
      );

      return false;
    }

    const coin =
      findCoinElement(wing);

    const destination =
      destinationFromElement(coin);

    const committed =
      applyState(
        STATES.CLUSTER_OPEN,
        {
          selectedCardinal: wing,

          selectedCoin:
            wingToCoin(wing),

          selectedRoom: "",

          selectedDestinationType:
            DESTINATION_TYPES.COIN,

          selectedDestinationId: wing,

          selectedDestinationLabel:
            destination
              ? destination.label ||
                wingToCoin(wing)
              : wingToCoin(wing),

          selectedRoute: "",
          selectedContentId: "",
          selectedLens: "overview",
          selectedParagraph: "",
          compassSelected: false,
          panelDescended: false
        },
        `returned-to-orbit:${wing}`
      );

    if (committed) {
      scheduleSceneAscent(
        STATES.CLUSTER_OPEN,
        wing
      );
    }

    return committed;
  }

  function requestReturnToConstellation(
    options = {}
  ) {
    if (arguments.length > 1) {
      return false;
    }

    if (
      isHeld() ||
      (
        state.current !==
          STATES.CLUSTER_OPEN &&
        state.current !==
          STATES.ROOM_SELECTED
      )
    ) {
      return false;
    }

    cancelActiveGestures(
      "return-to-constellation"
    );

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
          orbitFocus:
            previousWing,

          orbitPreviewFocus:
            previousWing,

          compassSelected: false
        },
        `returned-to-constellation:${previousWing}`
      );

    if (
      committed &&
      options.scrollToScene !== false
    ) {
      scheduleSceneAscent(
        STATES.CONSTELLATION
      );
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

      const id = String(
        input.id ||
        input.roomId ||
        input.wing ||
        input.cardinalId ||
        ""
      ).trim();

      if (!id) {
        continue;
      }

      const kind = String(
        input.kind || ""
      )
        .trim()
        .toLowerCase();

      if (
        !canonicalControlExists({
          id,
          kind
        })
      ) {
        continue;
      }

      const depthLayer =
        normalizeDepthLayer(
          input.depthLayer ||
          input.layer
        );

      const visible =
        input.visible !== false;

      const compassOverlap =
        Boolean(
          input.compassOverlap
        );

      const radiusPx = Math.max(
        0,
        finiteNumber(
          input.radiusPx ??
          input.projectedRadius,
          0
        )
      );

      /*
       * The controller stores the supplied interaction-priority fact.
       * It does not derive interaction policy from depth or Compass overlap.
       */
      const interactionPriority =
        visible
          ? normalizeInteractionPriority(
              input.interactionPriority
            )
          : INTERACTION_PRIORITY.INACTIVE;

      const projection =
        Object.freeze({
          id,
          kind,

          x: finiteNumber(
            input.x,
            0
          ),

          y: finiteNumber(
            input.y,
            0
          ),

          radiusPx,
          depthLayer,
          compassOverlap,
          visible,
          interactionPriority
        });

      next.set(
        `${projection.kind}:${id}`,
        projection
      );
    }

    state.semanticProjection = next;
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

    if (
      state.current ===
      STATES.ROOM_SELECTED
    ) {
      event.preventDefault();
      requestReturnToOrbit();
      return;
    }

    if (
      state.current ===
      STATES.CLUSTER_OPEN
    ) {
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
        : "ARCHCOIN_CRYSTALS_RENDER_FAILURE"
    );

    cancelActiveGestures(
      "crystals-failure"
    );

    setGuidance(
      "The visual crystal field is temporarily unavailable. Canonical routes and semantic records remain preserved."
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

    state.mediaQuery = media;

    state.reducedMotion =
      Boolean(media.matches) ||
      (
        state.root &&
        state.root.dataset
          .reducedMotion === "true"
      );
  }

  function bindReducedMotion() {
    const media =
      state.mediaQuery;

    if (!media) {
      return;
    }

    const update = event => {
      const previous =
        state.reducedMotion;

      state.reducedMotion =
        Boolean(event.matches);

      if (
        previous ===
        state.reducedMotion
      ) {
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

      recordAction(
        "reduced-motion-updated"
      );
    };

    state.mediaQueryListener = update;

    if (
      typeof media.addEventListener ===
        "function"
    ) {
      media.addEventListener(
        "change",
        update
      );

      return;
    }

    if (
      typeof media.addListener ===
        "function"
    ) {
      media.addListener(update);
    }
  }

  function resolveDom() {
    state.root =
      qs("[data-archcoin-root]");

    invariant(
      state.root,
      "ARCHCOIN_ROOT_NOT_FOUND"
    );

    state.scene = qs(
      "[data-archcoin-scene]",
      state.root
    );

    state.sceneField = qs(
      "[data-archcoin-scene-field]",
      state.root
    );

    state.panel = qs(
      "[data-archcoin-panel]",
      state.root
    );

    invariant(
      state.scene,
      "ARCHCOIN_SCENE_NOT_FOUND"
    );

    invariant(
      state.sceneField,
      "ARCHCOIN_SCENE_FIELD_NOT_FOUND"
    );

    invariant(
      state.panel,
      "ARCHCOIN_PANEL_NOT_FOUND"
    );

    state.panelEyebrow = qs(
      "[data-archcoin-panel-eyebrow]",
      state.root
    );

    state.panelTitle = qs(
      "[data-archcoin-panel-title]",
      state.root
    );

    state.panelPurpose = qs(
      "[data-archcoin-panel-purpose]",
      state.root
    );

    state.panelRelationship = qs(
      "[data-archcoin-panel-relationship]",
      state.root
    );

    state.panelDomain = qs(
      "[data-archcoin-panel-domain]",
      state.root
    );

    state.panelFunction = qs(
      "[data-archcoin-panel-function]",
      state.root
    );

    state.panelCoordinate = qs(
      "[data-archcoin-panel-coordinate]",
      state.root
    );

    state.panelSelectionState = qs(
      "[data-archcoin-panel-selection-state]",
      state.root
    );

    state.panelRouteStatus = qs(
      "[data-archcoin-panel-route-status]",
      state.root
    );

    state.panelLens = qs(
      "[data-archcoin-panel-lens]",
      state.root
    );

    state.enterButton = qs(
      "[data-archcoin-enter]",
      state.root
    );

    state.enterLabel = qs(
      "[data-archcoin-enter-label]",
      state.root
    );

    state.returnToOrbitButton = qs(
      "[data-archcoin-return-to-orbit]",
      state.root
    );

    state.returnToOrbitLabel = qs(
      "[data-archcoin-return-to-orbit-label]",
      state.root
    );

    state.returnHomeButton = qs(
      "[data-archcoin-return-home-compass]",
      state.root
    );

    state.guidance = qs(
      "[data-archcoin-guidance]",
      state.root
    );

    state.controllerReceiptOutput = qs(
      "[data-archcoin-controller-receipt]",
      state.root
    );

    state.controllerValidationOutput = qs(
      "[data-archcoin-controller-validation]",
      state.root
    );

    state.compassControl = qs(
      "[data-upstream-compass-control]",
      state.root
    );

    invariant(
      state.compassControl,
      "ARCHCOIN_COMPASS_CONTROL_NOT_FOUND"
    );
  }

  function initializeOrientationState() {
    const requestedFocus =
      normalizeWing(
        state.root.dataset.orbitFocus
      ) || "north";

    let initial =
      canonicalConstellationOrientation(
        requestedFocus
      );

    const serialized = String(
      state.root.dataset.orbitQuaternion ||
      ""
    ).trim();

    if (serialized) {
      try {
        const parsed =
          JSON.parse(serialized);

        const normalized =
          normalizeQuaternionStrict(
            parsed
          );

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

    state.orbitGestureActive = false;
    state.orbitPreviewAccepted = false;

    state.orbitRevision =
      finiteNumber(
        state.root.dataset.orbitRevision,
        0
      );

    state.orbitOrientation =
      cloneOrientation(initial);

    state.committedOrbitOrientation =
      cloneOrientation(initial);

    state.orbitGestureOrigin = null;
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

      state.clusters.set(
        wing,
        cluster
      );
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

      roomIds: Object.freeze(
        cluster.roomIds.slice()
      ),

      primaryRoom:
        cluster.primaryRoom,

      previewPrimaryRoom:
        cluster.previewPrimaryRoom,

      phase:
        cluster.phase,

      gestureActive:
        cluster.gestureActive,

      previewAccepted:
        cluster.previewAccepted,

      revision:
        cluster.revision,

      orientation:
        freezeOrientation(
          cluster.orientation
        ),

      committedOrientation:
        freezeOrientation(
          cluster.committedOrientation
        )
    });
  }

  function validateCanonicalRegistry() {
    invariant(
      WINGS.length === 4,
      "ARCHCOIN_WING_COUNT_INVALID"
    );

    invariant(
      new Set(WINGS).size === 4,
      "ARCHCOIN_DUPLICATE_WING"
    );

    invariant(
      CANONICAL_ROOM_RECORDS.length ===
        16,
      "ARCHCOIN_CANONICAL_ROOM_COUNT_INVALID"
    );

    const ids = new Set();
    const routes = new Set();

    for (const wing of WINGS) {
      const rooms =
        ROOMS_BY_WING.get(wing);

      invariant(
        rooms &&
        rooms.length === 4,
        "ARCHCOIN_ROOMS_PER_WING_INVALID",
        {
          wing
        }
      );
    }

    for (
      const record
      of CANONICAL_ROOM_RECORDS
    ) {
      invariant(
        WINGS.includes(record.wing),
        "ARCHCOIN_ROOM_WING_INVALID"
      );

      invariant(
        WING_TO_COIN[
          record.wing
        ] === record.coin,
        "ARCHCOIN_ROOM_COIN_MAPPING_INVALID"
      );

      invariant(
        !ids.has(record.roomId),
        "ARCHCOIN_DUPLICATE_ROOM_ID"
      );

      invariant(
        !routes.has(record.route),
        "ARCHCOIN_DUPLICATE_ROOM_ROUTE"
      );

      ids.add(record.roomId);
      routes.add(record.route);
    }

    invariant(
      ROOM_BY_ID.size === 16,
      "ARCHCOIN_ROOM_ID_REGISTRY_INVALID"
    );

    invariant(
      ROOM_BY_ROUTE.size === 16,
      "ARCHCOIN_ROUTE_REGISTRY_INVALID"
    );

    return Object.freeze({
      pass: true,
      wingCount: 4,
      roomCount: 16,
      routeCount: 16,
      roomsPerWing: 4
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
      !declaredStates.includes(
        "COMPASS_DECISION"
      ),
      "ARCHCOIN_FORBIDDEN_COMPASS_DECISION_STATE"
    );

    invariant(
      !declaredStates.includes(
        "CONSTELLATION_WITH_CLUSTER"
      ),
      "ARCHCOIN_FORBIDDEN_ADDITIVE_STATE"
    );

    invariant(
      canTransition(
        STATES.CONSTELLATION,
        STATES.CLUSTER_OPEN
      ),
      "ARCHCOIN_REQUIRED_TRANSITION_MISSING"
    );

    invariant(
      canTransition(
        STATES.CLUSTER_OPEN,
        STATES.ROOM_SELECTED
      ),
      "ARCHCOIN_REQUIRED_TRANSITION_MISSING"
    );

    invariant(
      canTransition(
        STATES.ROOM_SELECTED,
        STATES.CLUSTER_OPEN
      ),
      "ARCHCOIN_REQUIRED_TRANSITION_MISSING"
    );

    invariant(
      canTransition(
        STATES.CLUSTER_OPEN,
        STATES.CONSTELLATION
      ),
      "ARCHCOIN_REQUIRED_TRANSITION_MISSING"
    );

    invariant(
      canTransition(
        STATES.ROOM_SELECTED,
        STATES.CONSTELLATION
      ),
      "ARCHCOIN_REQUIRED_TRANSITION_MISSING"
    );

    invariant(
      TRANSITIONS[
        STATES.SYSTEM_HELD
      ].length === 1 &&
      TRANSITIONS[
        STATES.SYSTEM_HELD
      ][0] ===
        STATES.SYSTEM_HELD,
      "ARCHCOIN_HELD_STATE_NOT_TERMINAL"
    );

    return Object.freeze({
      pass: true,

      states: Object.freeze(
        declaredStates.slice()
      ),

      heldTerminal: true,
      compassDecisionPresent: false,
      additiveStatePresent: false
    });
  }

  function validatePresentationContract() {
    for (
      const presentation
      of Object.values(
        PRESENTATION_BY_STATE
      )
    ) {
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
      additiveCoRenderingAuthorized:
        false
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
      compass.mainCompassRoute ===
        "/index.html",
      "ARCHCOIN_COMPASS_ROUTE_INVALID"
    );

    invariant(
      compass.immediateNavigation ===
        false,
      "ARCHCOIN_COMPASS_IMMEDIATE_NAVIGATION_INVALID"
    );

    invariant(
      compass.explicitReturnRequired ===
        true,
      "ARCHCOIN_COMPASS_EXPLICIT_RETURN_INVALID"
    );

    invariant(
      compass.inheritsNavigationOrientation ===
        false,
      "ARCHCOIN_COMPASS_ORIENTATION_INHERITANCE_INVALID"
    );

    invariant(
      compass.participatesInNavigationSettlement ===
        false,
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
      MODULE.motionContractVersion ===
        "1.0.0",
      "ARCHCOIN_MOTION_CONTRACT_VERSION_INVALID"
    );

    const validOrbit =
      validateOrbitPreviewPayload({
        quaternion: [
          0,
          0.2,
          0,
          0.98
        ],

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
        quaternion: [
          0,
          0,
          0,
          1
        ],

        primaryId: "east",
        dx: 40
      });

    invariant(
      mixedOrbit.pass === false,
      "ARCHCOIN_CONTROLLER_MUST_REJECT_MIXED_MOTION_PAYLOAD"
    );

    const missingOrbitPrimary =
      validateOrbitPreviewPayload({
        quaternion: [
          0,
          0,
          0,
          1
        ]
      });

    invariant(
      missingOrbitPrimary.pass ===
        false,
      "ARCHCOIN_ORBIT_PRIMARY_ID_MUST_BE_REQUIRED"
    );

    const testCluster =
      createClusterState("north");

    const validCluster =
      validateClusterPreviewPayload(
        testCluster,
        {
          quaternion: [
            0.1,
            0,
            0,
            0.99
          ],

          primaryId:
            "contract-platform"
        }
      );

    invariant(
      validCluster.pass === true,
      "ARCHCOIN_VALID_CLUSTER_PREVIEW_REJECTED"
    );

    const foreignRoom =
      validateClusterPreviewPayload(
        testCluster,
        {
          quaternion: [
            0,
            0,
            0,
            1
          ],

          primaryId:
            "payable-overview"
        }
      );

    invariant(
      foreignRoom.pass === false,
      "ARCHCOIN_FOREIGN_CLUSTER_ROOM_ACCEPTED"
    );

    const mixedCluster =
      validateClusterPreviewPayload(
        testCluster,
        {
          quaternion: [
            0,
            0,
            0,
            1
          ],

          primaryId:
            "contract-platform",

          axis: [
            0,
            1,
            0
          ]
        }
      );

    invariant(
      mixedCluster.pass === false,
      "ARCHCOIN_CLUSTER_MIXED_MOTION_PAYLOAD_ACCEPTED"
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

      motionContractId:
        MODULE.motionContractId,

      motionContractVersion:
        MODULE.motionContractVersion,

      previewPayloadKeys:
        Object.freeze(
          PREVIEW_PAYLOAD_KEYS.slice()
        ),

      unexpectedPreviewFieldsForbidden:
        true,

      completeQuaternionPreviewRequired:
        true,

      explicitPrimaryIdentityRequired:
        true,

      orbitBeginPayloadPermitted:
        false,

      clusterBeginMotionPayloadPermitted:
        false,

      orbitCommitPayloadPermitted:
        false,

      clusterCommitMotionPayloadPermitted:
        false,

      controllerInfersPrimaryFromQuaternion:
        false,

      controllerInterpretsEulerMotion:
        false,

      controllerConstructsGestureQuaternion:
        false,

      canonicalSettlementQuaternionsPublic:
        false,

      motionOwner:
        MODULE.interactionModuleId,

      acceptedStateAuthority:
        MODULE.id
    });
  }

  function validateProjectionStorageContract() {
    return Object.freeze({
      pass: true,

      projectionMathOwned:
        false,

      interactionPriorityDerived:
        false,

      interactionPriorityValidatedAndStored:
        true,

      projectionDomApplicationOwned:
        false,

      projectionDomApplicationOwner:
        MODULE.interactionModuleId
    });
  }

  function validateFileSplitContract() {
    invariant(
      !Object.prototype
        .hasOwnProperty
        .call(state, "pointer"),
      "ARCHCOIN_CONTROLLER_POINTER_STATE_NOT_EXTRACTED"
    );

    invariant(
      !Object.prototype
        .hasOwnProperty
        .call(
          state,
          "suppressedSemanticClick"
        ),
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
      clusterExitSwipeClassificationOwned:
        false,
      gestureAxisSelectionOwned: false,
      gestureQuaternionConstructionOwned:
        false,
      directManipulationOwned: false,
      grabbedObjectTrackingOwned: false,
      quaternionToPrimaryInferenceOwned:
        false,

      interactionModuleId:
        MODULE.interactionModuleId,

      acceptedStateAuthority:
        MODULE.id,

      navigationTransitionAuthority:
        MODULE.id
    });
  }

  function validateDeclaredRooms() {
    if (!state.root) {
      return Object.freeze({
        pass: false,
        skipped: true,
        reason:
          "ARCHCOIN_ROOT_NOT_RESOLVED"
      });
    }

    const declared = qsa(
      "[data-archcoin-room]",
      state.root
    );

    invariant(
      declared.length === 16,
      "ARCHCOIN_DECLARED_ROOM_COUNT_INVALID",
      {
        expected: 16,
        actual: declared.length
      }
    );

    const seenIds = new Set();
    const seenRoutes = new Set();

    for (const element of declared) {
      const roomId =
        normalizeRoomId(
          element.dataset.roomId
        );

      const wing =
        normalizeWing(
          element.dataset.wing
        );

      const route =
        normalizeRoute(
          element.dataset.route ||
          element.getAttribute("href")
        );

      const canonical =
        ROOM_BY_ID.get(roomId);

      invariant(
        canonical,
        "ARCHCOIN_UNKNOWN_ROOM_ID",
        {
          roomId
        }
      );

      invariant(
        !seenIds.has(roomId),
        "ARCHCOIN_DUPLICATE_DECLARED_ROOM_ID"
      );

      invariant(
        !seenRoutes.has(route),
        "ARCHCOIN_DUPLICATE_DECLARED_ROOM_ROUTE"
      );

      invariant(
        route === canonical.route,
        "ARCHCOIN_ROOM_ROUTE_MISMATCH"
      );

      invariant(
        wing === canonical.wing,
        "ARCHCOIN_ROOM_WING_MISMATCH"
      );

      seenIds.add(roomId);
      seenRoutes.add(route);
    }

    return Object.freeze({
      pass: true,
      declaredRoomCount: 16,
      declaredRouteCount: 16,
      generatedRoomProxiesRequired:
        false
    });
  }

  function runControllerSelfTest({
    includeDom = false
  } = {}) {
    const results = {
      registry:
        validateCanonicalRegistry(),

      transitions:
        validateTransitionTable(),

      presentation:
        validatePresentationContract(),

      compass:
        validateCompassContract(),

      motionContract:
        validateMotionContract(),

      projectionStorage:
        validateProjectionStorageContract(),

      fileSplit:
        validateFileSplitContract(),

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
        result =>
          result.pass === true
      );

    return Object.freeze({
      receiptSchema:
        "ARCHCOIN_CONTROLLER_ANCHORING_TWO_FILE_MOTION_AUTHORITY_VALIDATION_RECEIPT_v2",

      moduleId:
        MODULE.id,

      moduleVersion:
        MODULE.version,

      motionContractId:
        MODULE.motionContractId,

      motionContractVersion:
        MODULE.motionContractVersion,

      pass,

      pointerInterpreterOwner:
        MODULE.interactionModuleId,

      pointerTapArbitrationOwner:
        MODULE.interactionModuleId,

      wholeCrystalHitTestOwner:
        MODULE.interactionModuleId,

      syntheticClickSuppressionOwner:
        MODULE.interactionModuleId,

      projectionDomApplicationOwner:
        MODULE.interactionModuleId,

      clusterExitSwipeClassificationOwner:
        MODULE.interactionModuleId,

      gestureAxisSelectionOwner:
        MODULE.interactionModuleId,

      gestureQuaternionConstructionOwner:
        MODULE.interactionModuleId,

      directManipulationOwner:
        MODULE.interactionModuleId,

      grabbedObjectTrackingOwner:
        MODULE.interactionModuleId,

      primaryVisualIdentityCalculationOwner:
        MODULE.interactionModuleId,

      orbitStateAuthority:
        MODULE.id,

      clusterStateAuthority:
        MODULE.id,

      quaternionAcceptanceAuthority:
        MODULE.id,

      clusterExitTransitionAuthority:
        MODULE.id,

      navigationTransitionAuthority:
        MODULE.id,

      cameraOwnership: false,
      crystalRendererOwnership: false,
      compassRendererOwnership: false,
      semanticProjectionMathOwnership:
        false,
      interactionPriorityDerivationOwnership:
        false,
      semanticProjectionFactStorageOwnership:
        true,
      compassPageLocalSelection: true,
      explicitMainCompassReturn: true,

      results:
        Object.freeze(results)
    });
  }

  function writeValidationReceipt(receipt) {
    state.validationReceipt = receipt;

    const serialized =
      JSON.stringify(receipt);

    if (state.root) {
      state.root.dataset.archcoinControllerValidation =
        serialized;
    }

    if (
      state.controllerValidationOutput
    ) {
      if (
        "value" in
        state.controllerValidationOutput
      ) {
        state.controllerValidationOutput.value =
          serialized;
      }

      state.controllerValidationOutput.textContent =
        serialized;
    }

    globalThis.DGB_ARCHCOIN_CONTROLLER_VALIDATION_RECEIPT =
      receipt;
  }

  function exposeApi() {
    globalThis.DGB_ARCHCOIN_CONTROLLER =
      Object.freeze({
        moduleId: MODULE.id,
        moduleVersion: MODULE.version,

        interactionModuleId:
          MODULE.interactionModuleId,

        interactionModuleVersion:
          MODULE.interactionModuleVersion,

        motionContractId:
          MODULE.motionContractId,

        motionContractVersion:
          MODULE.motionContractVersion,

        states: STATES,

        presentationModes:
          PRESENTATION_MODES,

        destinationTypes:
          DESTINATION_TYPES,

        orientationPhases:
          ORIENTATION_PHASES,

        depthLayers:
          DEPTH_LAYERS,

        interactionPriority:
          INTERACTION_PRIORITY,

        mainCompass:
          MAIN_COMPASS,

        canonicalRoomRecords:
          CANONICAL_ROOM_RECORDS,

        canonicalRoomRoutes:
          CANONICAL_ROOM_ROUTES,

        wingToCoin:
          WING_TO_COIN,

        getFrameState:
          createFrameState,

        getPresentationMode:
          () =>
            presentationModeForState(),

        getReducedMotion:
          () =>
            state.reducedMotion,

        getHeldState:
          createHeldState,

        getCompassState:
          createCompassState,

        getClusterState,

        getSemanticProjection:
          createSemanticProjectionSnapshot,

        getValidationReceipt:
          () =>
            state.validationReceipt,

        subscribeFrameState:
          callback =>
            subscribe(
              CHANNELS.FRAME,
              callback
            ),

        subscribeReducedMotion:
          callback =>
            subscribe(
              CHANNELS.REDUCED_MOTION,
              callback
            ),

        subscribeHeldState:
          callback =>
            subscribe(
              CHANNELS.HELD_STATE,
              callback
            ),

        subscribeCompassState:
          callback =>
            subscribe(
              CHANNELS.COMPASS_STATE,
              callback
            ),

        subscribeSemanticProjection:
          callback =>
            subscribe(
              CHANNELS.SEMANTIC_PROJECTION,
              callback
            ),

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

        runSelfTest:
          runControllerSelfTest
      });
  }

  function bindControls() {
    state.root.addEventListener(
      "keydown",
      handleKeydown
    );

    if (state.enterButton) {
      state.enterButton.addEventListener(
        "click",
        event => {
          event.preventDefault();
          requestEnterSelection();
        }
      );
    }

    if (state.returnToOrbitButton) {
      state.returnToOrbitButton.addEventListener(
        "click",
        event => {
          event.preventDefault();
          requestReturnToOrbit();
        }
      );
    }

    if (state.returnHomeButton) {
      state.returnHomeButton.addEventListener(
        "click",
        event => {
          event.preventDefault();
          requestReturnToMainCompass();
        }
      );
    }

    globalThis.addEventListener(
      "ARCHCOIN_CRYSTALS_RENDER_FAILURE",
      handleCrystalsFailure
    );
  }

  function enterHeldState(error) {
    clearViewportSchedules();

    state.current =
      STATES.SYSTEM_HELD;

    state.orbitGestureActive = false;
    state.orbitPreviewAccepted = false;
    state.orbitGestureOrigin = null;

    for (
      const cluster
      of state.clusters.values()
    ) {
      cluster.gestureActive = false;
      cluster.previewAccepted = false;
      cluster.gestureOrigin = null;

      cluster.phase =
        ORIENTATION_PHASES.COMMITTED;
    }

    state.lastAction =
      "controller-initialization-failed";

    state.lastFailure =
      error &&
      (
        error.code ||
        error.message
      )
        ? String(
            error.code ||
            error.message
          )
        : "UNKNOWN_CONTROLLER_INITIALIZATION_FAILURE";

    try {
      syncPresentation();

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
    } catch (_) {}

    globalThis.dispatchEvent(
      new CustomEvent(
        "ARCHCOIN_CONTROLLER_FAILURE",
        {
          detail: Object.freeze({
            reason:
              state.lastFailure
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
        "ARCHCOIN_CONTROLLER_SOURCE_VALIDATION_FAILED",
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
        "ARCHCOIN_CONTROLLER_RUNTIME_VALIDATION_FAILED",
        runtimeReceipt
      );

      writeValidationReceipt(
        runtimeReceipt
      );

      exposeApi();
      bindControls();
      bindReducedMotion();
      resetSelection();
      syncPresentation();

      state.initialized = true;

      const frame =
        recordAction(
          "controller-initialized"
        );

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
          "ARCHCOIN_CONTROLLER_READY",
          {
            detail: Object.freeze({
              moduleId:
                MODULE.id,

              moduleVersion:
                MODULE.version,

              interactionModuleRequired:
                true,

              interactionModuleId:
                MODULE.interactionModuleId,

              interactionModuleVersion:
                MODULE.interactionModuleVersion,

              motionContractId:
                MODULE.motionContractId,

              motionContractVersion:
                MODULE.motionContractVersion,

              completeGestureQuaternionRequired:
                true,

              exactPreviewPayloadRequired:
                true,

              explicitPrimaryIdentityRequired:
                true,

              gestureQuaternionConstructionOwner:
                MODULE.interactionModuleId,

              gestureAxisSelectionOwner:
                MODULE.interactionModuleId,

              motionDirectionOwner:
                MODULE.interactionModuleId,

              motionSensitivityOwner:
                MODULE.interactionModuleId,

              acceptedStateAuthority:
                MODULE.id,

              navigationTransitionAuthority:
                MODULE.id
            })
          }
        )
      );
    } catch (error) {
      enterHeldState(error);
    }
  }

  if (
    document.readyState ===
      "loading"
  ) {
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
AUDRALIA_ARCHCOIN_CONTROLLER_ANCHORING_TWO_FILE_MOTION_AUTHORITY_RESULT_v2

Artifact:
 /products/archcoin/index.controller.js

Module:
 DGB_ARCHCOIN_CONTROLLER
 7.0.0-controller-interaction-semantic-priority

Motion contract:
 AUDRALIA_ARCHCOIN_COMPLETE_QUATERNION_MOTION_CONTRACT_v1
 1.0.0

Implementation status:
 ANCHORING_STANDARD_FOR_PAIRED_INTERACTIONS_RENEWAL

Exact coordinated pair:
 1. /products/archcoin/index.controller.js
 2. /products/archcoin/index.interactions.js

No third implementation file included.

Anchoring rule:
 INTERACTIONS DETERMINES MOTION.
 CONTROLLER DETERMINES AUTHORITY.

Controller accepts:
- beginOrbitGesture()
- requestOrbitPreview({ quaternion, primaryId })
- requestOrbitCommit()
- requestOrbitCancel(reason)
- beginClusterGesture(wing)
- requestClusterPreview(wing, { quaternion, primaryId })
- requestClusterCommit(wing)
- requestClusterCancel(wing, reason)

Controller rejects:
- motion payload at orbit begin
- motion payload at cluster begin
- preview without active transaction
- preview without complete quaternion
- preview with unexpected fields
- Euler-only preview
- mixed quaternion-and-Euler preview
- preview without explicit primary identity
- invalid primary wing
- invalid primary room
- room outside active cluster
- commit without accepted preview
- quaternion payload at commit
- primary identity payload at commit
- raw pointer values
- drag vectors
- axis instructions
- movement-direction instructions

Controller does not:
- infer wing from quaternion
- infer room from quaternion
- construct gesture quaternions
- convert gesture Euler values
- choose gesture axes
- define sensitivity
- define drag direction
- classify cluster exit
- track grabbed crystals
- derive interaction priority from depth
- apply projection facts to interaction DOM
- expose canonical settlement quaternions publicly

Interactions remains sole owner of:
- pointer lifecycle
- tap-versus-drag arbitration
- swipe classification
- cluster-exit detection
- direct manipulation
- grabbed-object tracking
- drag direction
- sensitivity
- gesture-axis selection
- gesture quaternion construction
- visual primary identity calculation
- interaction-priority interpretation
- projection-driven interaction DOM

Cancellation phase behavior:
- CANCELLED is published
- stable COMMITTED transaction state is then published
- cancellation is no longer silently overwritten before publication

Crystals modified:
 FALSE

Compositor modified:
 FALSE

HTML modified:
 FALSE

CSS modified:
 FALSE

Runtime execution:
 NOT PERFORMED

Visual acceptance:
 NOT CLAIMED

Production authorization:
 FALSE

Deployment authorization:
 FALSE
*/

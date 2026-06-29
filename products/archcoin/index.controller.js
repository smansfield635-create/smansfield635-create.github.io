/* /products/archcoin/index.controller.js
   ARCHCOIN locked navigation, state, route, panel, and transition authority.

   Module:
   DGB_ARCHCOIN_CONTROLLER
   7.0.0-controller-interaction-semantic-priority

   Runtime order:
   1. /products/archcoin/index.controller.js
   2. /assets/compass/upstream-compass.geometry.js
   3. /assets/compass/upstream-compass.renderer.js
   4. /products/archcoin/index.compositor.js
   5. /products/archcoin/index.crystals.js
   6. /products/archcoin/index.interactions.js
   7. /products/archcoin/index.html
   8. /assets/compass/upstream-compass.css
   9. /products/archcoin/index.css

   Controller ownership:
   - canonical navigation state;
   - legal state transitions;
   - selected wing, coin, room, route, content, and lens;
   - canonical room registry;
   - orbit and cluster orientation state;
   - gesture-command authorization;
   - cardinal and room selection authorization;
   - Compass page-local selection;
   - Return to Main Compass;
   - Return to Orbit;
   - Return to Constellation;
   - panel state and viewport choreography;
   - reduced motion and terminal held state;
   - semantic projection fact storage;
   - controller receipts and validation.

   Extracted to DGB_ARCHCOIN_INTERACTIONS:
   - pointer events;
   - pointer capture;
   - tap-versus-drag arbitration;
   - swipe classification;
   - outward cluster-exit classification;
   - whole-star hit testing;
   - semantic click delegation;
   - synthetic-click suppression;
   - projection-to-interaction DOM writes;
   - pointer-event enablement and hit-target sizing.

   Source status:
   FILE_SPLIT_CONTROLLER_SOURCE_CANDIDATE
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
    interactionModuleVersion: "1.0.0-pointer-gesture-interpreter"
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

  const ORIENTATION = Object.freeze({
    maximumPitch: Math.PI * 0.42
  });

  const QUATERNION = Object.freeze({
    identity: Object.freeze([0, 0, 0, 1]),
    minimumLength: 1e-8
  });

  const CANONICAL_CONSTELLATION_EULER = Object.freeze({
    north: Object.freeze({
      yaw: 0,
      pitch: 0,
      roll: 0
    }),

    east: Object.freeze({
      yaw: -Math.PI / 2,
      pitch: 0,
      roll: 0
    }),

    south: Object.freeze({
      yaw: Math.PI,
      pitch: 0,
      roll: 0
    }),

    west: Object.freeze({
      yaw: Math.PI / 2,
      pitch: 0,
      roll: 0
    })
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

  function clamp(
    value,
    minimum,
    maximum
  ) {
    return Math.max(
      minimum,
      Math.min(maximum, value)
    );
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

  function wrapRadians(value) {
    let angle = finiteNumber(value, 0);

    while (angle > Math.PI) {
      angle -= Math.PI * 2;
    }

    while (angle < -Math.PI) {
      angle += Math.PI * 2;
    }

    return angle;
  }

  function normalizeQuaternion(
    value,
    fallback = QUATERNION.identity
  ) {
    const source =
      Array.isArray(value) ||
      ArrayBuffer.isView(value)
        ? Array.from(value)
        : [];

    if (source.length !== 4) {
      return Array.from(fallback);
    }

    const quaternion = [
      finiteNumber(source[0], 0),
      finiteNumber(source[1], 0),
      finiteNumber(source[2], 0),
      finiteNumber(source[3], 1)
    ];

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
      return Array.from(fallback);
    }

    return quaternion.map(
      component => component / length
    );
  }

  function quaternionFromEuler(
    yaw,
    pitch,
    roll
  ) {
    const safeYaw = wrapRadians(yaw);

    const safePitch = clamp(
      finiteNumber(pitch, 0),
      -Math.PI / 2,
      Math.PI / 2
    );

    const safeRoll = wrapRadians(roll);

    const cy = Math.cos(safeYaw * 0.5);
    const sy = Math.sin(safeYaw * 0.5);
    const cp = Math.cos(safePitch * 0.5);
    const sp = Math.sin(safePitch * 0.5);
    const cr = Math.cos(safeRoll * 0.5);
    const sr = Math.sin(safeRoll * 0.5);

    return normalizeQuaternion([
      sr * cp * cy - cr * sp * sy,
      cr * sp * cy + sr * cp * sy,
      cr * cp * sy - sr * sp * cy,
      cr * cp * cy + sr * sp * sy
    ]);
  }

  function eulerFromQuaternion(value) {
    const [
      x,
      y,
      z,
      w
    ] = normalizeQuaternion(value);

    const sinPitch = 2 * (
      w * y -
      z * x
    );

    const pitch =
      Math.abs(sinPitch) >= 1
        ? Math.sign(sinPitch) *
          Math.PI /
          2
        : Math.asin(sinPitch);

    const yaw = Math.atan2(
      2 * (
        w * z +
        x * y
      ),
      1 -
      2 * (
        y * y +
        z * z
      )
    );

    const roll = Math.atan2(
      2 * (
        w * x +
        y * z
      ),
      1 -
      2 * (
        x * x +
        y * y
      )
    );

    return {
      yaw: wrapRadians(yaw),
      pitch: clamp(
        pitch,
        -Math.PI / 2,
        Math.PI / 2
      ),
      roll: wrapRadians(roll)
    };
  }

  function orientationFromEuler(
    yaw,
    pitch,
    roll,
    primaryId = ""
  ) {
    const safeYaw = wrapRadians(yaw);

    const safePitch = clamp(
      finiteNumber(pitch, 0),
      -ORIENTATION.maximumPitch,
      ORIENTATION.maximumPitch
    );

    const safeRoll = wrapRadians(roll);

    return {
      yaw: safeYaw,
      pitch: safePitch,
      roll: safeRoll,

      quaternion: quaternionFromEuler(
        safeYaw,
        safePitch,
        safeRoll
      ),

      primaryId: String(
        primaryId || ""
      ).trim()
    };
  }

  function orientationFromQuaternion(
    quaternion,
    primaryId = ""
  ) {
    const normalized =
      normalizeQuaternion(quaternion);

    const euler =
      eulerFromQuaternion(normalized);

    return orientationFromEuler(
      euler.yaw,
      euler.pitch,
      euler.roll,
      primaryId
    );
  }

  function cloneOrientation(orientation) {
    const source =
      orientation ||
      orientationFromQuaternion(
        QUATERNION.identity
      );

    return {
      yaw: finiteNumber(source.yaw, 0),
      pitch: finiteNumber(source.pitch, 0),
      roll: finiteNumber(source.roll, 0),

      quaternion: normalizeQuaternion(
        source.quaternion
      ),

      primaryId: String(
        source.primaryId ||
        source.primaryWing ||
        source.primaryRoom ||
        ""
      ).trim()
    };
  }

  function freezeOrientation(orientation) {
    const value =
      cloneOrientation(orientation);

    return Object.freeze({
      yaw: value.yaw,
      pitch: value.pitch,
      roll: value.roll,

      quaternion: Object.freeze(
        value.quaternion.slice()
      ),

      primaryId: value.primaryId
    });
  }

  function resolveOrientation(
    payload,
    fallbackOrientation
  ) {
    const fallback =
      cloneOrientation(
        fallbackOrientation
      );

    if (
      !payload ||
      typeof payload !== "object"
    ) {
      return fallback;
    }

    const primaryId = String(
      payload.primaryId ||
      payload.primaryWing ||
      payload.primaryRoom ||
      payload.focus ||
      fallback.primaryId ||
      ""
    ).trim();

    if (
      Array.isArray(payload.quaternion) ||
      ArrayBuffer.isView(
        payload.quaternion
      )
    ) {
      return orientationFromQuaternion(
        payload.quaternion,
        primaryId
      );
    }

    if (
      payload.orientation &&
      (
        Array.isArray(
          payload.orientation.quaternion
        ) ||
        ArrayBuffer.isView(
          payload.orientation.quaternion
        )
      )
    ) {
      return orientationFromQuaternion(
        payload.orientation.quaternion,
        primaryId ||
        payload.orientation.primaryId
      );
    }

    return orientationFromEuler(
      payload.yaw !== undefined
        ? payload.yaw
        : fallback.yaw,

      payload.pitch !== undefined
        ? payload.pitch
        : fallback.pitch,

      payload.roll !== undefined
        ? payload.roll
        : fallback.roll,

      primaryId
    );
  }

  function canonicalConstellationOrientation(
    wing
  ) {
    const normalizedWing =
      normalizeWing(wing) ||
      "north";

    const euler =
      CANONICAL_CONSTELLATION_EULER[
        normalizedWing
      ];

    return orientationFromEuler(
      euler.yaw,
      euler.pitch,
      euler.roll,
      normalizedWing
    );
  }

  function nearestCardinalFromYaw(yaw) {
    const wrapped = wrapRadians(yaw);

    let bestWing = "north";
    let bestDistance = Infinity;

    for (const wing of WINGS) {
      const canonicalYaw =
        CANONICAL_CONSTELLATION_EULER[
          wing
        ].yaw;

      const distance = Math.abs(
        wrapRadians(
          wrapped -
          canonicalYaw
        )
      );

      if (distance < bestDistance) {
        bestDistance = distance;
        bestWing = wing;
      }
    }

    return bestWing;
  }

  function wingToCoin(wing) {
    return (
      WING_TO_COIN[
        normalizeWing(wing)
      ] ||
      ""
    );
  }

  function createClusterState(wing) {
    const roomIds =
      ROOMS_BY_WING.get(wing) ||
      Object.freeze([]);

    const primaryRoom =
      roomIds[0] ||
      "";

    const orientation =
      orientationFromQuaternion(
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
      revision: 0,
      orientation: cloneOrientation(
        orientation
      ),
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
        ) ||
        null
      : null;
  }

  function activeClusterWing() {
    if (
      state.current === STATES.CLUSTER_OPEN ||
      state.current === STATES.ROOM_SELECTED
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

  function clusterContainsRoom(
    cluster,
    roomId
  ) {
    return Boolean(
      cluster &&
      cluster.roomIds.includes(
        normalizeRoomId(roomId)
      )
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

  function canonicalControlExists(
    record
  ) {
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

  function destinationFromElement(
    element
  ) {
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
        eyebrow ||
        "Selected path";
    }

    if (state.panelTitle) {
      state.panelTitle.textContent =
        title ||
        "Choose a financial domain";
    }

    if (state.panelPurpose) {
      state.panelPurpose.textContent =
        purpose ||
        "";
    }

    if (state.panelRelationship) {
      state.panelRelationship.textContent =
        relationship ||
        "";
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
      enabled
        ? "false"
        : "true"
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
      visible
        ? "false"
        : "true"
    );

    control.setAttribute(
      "aria-disabled",
      visible
        ? "false"
        : "true"
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

  function setReturnHomeVisible(
    visible
  ) {
    if (!state.returnHomeButton) {
      return;
    }

    state.returnHomeButton.hidden =
      !visible;

    state.returnHomeButton.setAttribute(
      "aria-hidden",
      visible
        ? "false"
        : "true"
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

    if (
      state.panelDescentCommitFrame
    ) {
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

    if (
      state.sceneAscentCommitFrame
    ) {
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
        state.compassSelected ===
        true,

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
      inheritsNavigationOrientation:
        false,
      participatesInNavigationSettlement:
        false,
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
          visible: record.visible,
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
        cluster
          ? cluster.wing
          : "",

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

      lastAction:
        state.lastAction,

      lastFailure:
        state.lastFailure
    });
  }

  function createCompatibilityReceipt(
    frame
  ) {
    return Object.freeze({
      contractId:
        "ARCHCOIN_CONTROLLER_INTERACTION_v7",

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

      orbitRevision:
        frame.orbitRevision,

      orbitQuaternion:
        frame.orbitOrientation
          .quaternion,

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

      clusterRevision:
        frame.cluster
          ? frame.cluster.revision
          : 0,

      clusterQuaternion:
        frame.cluster
          ? frame.cluster.orientation
              .quaternion
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
        frame.compass
          .immediateNavigation,

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

      orbitStateAuthority:
        MODULE.id,

      clusterStateAuthority:
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

    const cluster =
      frame.cluster;

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

    state.root.dataset.orbitRevision =
      String(frame.orbitRevision);

    state.root.dataset.orbitQuaternion =
      JSON.stringify(
        frame.orbitOrientation
          .quaternion
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

    state.root.dataset.clusterRevision =
      String(
        cluster
          ? cluster.revision
          : 0
      );

    state.root.dataset.clusterQuaternion =
      cluster
        ? JSON.stringify(
            cluster.orientation
              .quaternion
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

    state.root.dataset.archcoinPointerInterpreterOwner =
      MODULE.interactionModuleId;

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
        active
          ? "true"
          : "false";

      element.dataset.selected =
        !frame.compassSelected &&
        frame.selectedDestinationType ===
          DESTINATION_TYPES.COIN &&
        frame.selectedCardinal === wing
          ? "true"
          : "false";

      element.dataset.primary =
        primary
          ? "true"
          : "false";

      element.setAttribute(
        "aria-disabled",
        active
          ? "false"
          : "true"
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
        frame.compass
          .interactionEnabled
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

  function writeCompatibilityReceipt(
    frame
  ) {
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
        "Tap any visible part of a cardinal crystal or its label to open its cluster. Swipe across the field to rotate the constellation."
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
              coin.dataset
                .coordinateLabel,
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
        "Tap any visible part of a room crystal to select it. Swipe across the field to rotate the cluster, or swipe outward to return to the constellation."
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
        "Review the selected room. Enter Selected Path opens its canonical route. Swipe outward from the cluster to return to the constellation."
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
      const [
        key,
        value
      ] of Object.entries(patch)
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
      previousHeld !==
      frame.held
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
      incrementRevision = false
    } = {}
  ) {
    const normalized =
      cloneOrientation(orientation);

    const primaryWing =
      normalizeWing(
        normalized.primaryId
      ) ||
      nearestCardinalFromYaw(
        normalized.yaw
      );

    normalized.primaryId =
      primaryWing;

    state.orbitOrientation =
      normalized;

    state.orbitPreviewFocus =
      primaryWing;

    state.orbitPhase =
      phase;

    state.orbitGestureActive =
      Boolean(gestureActive);

    if (incrementRevision) {
      state.orbitRevision += 1;
    }

    if (committed) {
      state.committedOrbitOrientation =
        cloneOrientation(
          normalized
        );

      state.orbitFocus =
        primaryWing;

      state.orbitPreviewFocus =
        primaryWing;
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
      incrementRevision = false
    } = {}
  ) {
    if (!cluster) {
      return false;
    }

    const normalized =
      cloneOrientation(orientation);

    const primaryRoom =
      normalizeRoomId(
        normalized.primaryId
      );

    normalized.primaryId =
      clusterContainsRoom(
        cluster,
        primaryRoom
      )
        ? primaryRoom
        : (
            cluster.previewPrimaryRoom ||
            cluster.primaryRoom ||
            cluster.roomIds[0] ||
            ""
          );

    cluster.orientation =
      normalized;

    cluster.previewPrimaryRoom =
      normalized.primaryId;

    cluster.phase =
      phase;

    cluster.gestureActive =
      Boolean(gestureActive);

    if (incrementRevision) {
      cluster.revision += 1;
    }

    if (committed) {
      cluster.committedOrientation =
        cloneOrientation(
          normalized
        );

      cluster.primaryRoom =
        normalized.primaryId;

      cluster.previewPrimaryRoom =
        normalized.primaryId;
    }

    return true;
  }

  function beginOrbitGesture(
    payload = {}
  ) {
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
        state.committedOrbitOrientation ||
        state.orbitOrientation
      );

    setConstellationOrientation(
      resolveOrientation(
        payload,
        state.orbitOrientation
      ),
      {
        committed: false,
        phase:
          ORIENTATION_PHASES.PREVIEW,
        gestureActive: true
      }
    );

    recordAction(
      "orbit-gesture-began"
    );

    return true;
  }

  function requestOrbitPreview(
    payload = {}
  ) {
    if (
      isHeld() ||
      state.current !==
        STATES.CONSTELLATION
    ) {
      return false;
    }

    if (!state.orbitGestureActive) {
      beginOrbitGesture();
    }

    setConstellationOrientation(
      resolveOrientation(
        payload,
        state.orbitOrientation
      ),
      {
        committed: false,
        phase:
          ORIENTATION_PHASES.PREVIEW,
        gestureActive: true
      }
    );

    recordAction(
      "orbit-preview-updated"
    );

    return true;
  }

  function requestOrbitCommit(
    payload = {}
  ) {
    if (
      isHeld() ||
      state.current !==
        STATES.CONSTELLATION
    ) {
      return false;
    }

    const orientation =
      resolveOrientation(
        payload,
        state.orbitOrientation ||
        state.committedOrbitOrientation
      );

    const primaryWing =
      normalizeWing(
        payload.primaryWing ||
        payload.primaryId ||
        orientation.primaryId
      ) ||
      nearestCardinalFromYaw(
        orientation.yaw
      );

    orientation.primaryId =
      primaryWing;

    setConstellationOrientation(
      orientation,
      {
        committed: true,
        phase:
          ORIENTATION_PHASES.COMMITTED,
        gestureActive: false,
        incrementRevision: true
      }
    );

    state.orbitGestureOrigin =
      null;

    recordAction(
      `orbit-committed:${primaryWing}`
    );

    return true;
  }

  function requestOrbitCancel(
    reason = "cancelled"
  ) {
    if (isHeld()) {
      return false;
    }

    if (
      !state.orbitGestureActive &&
      state.orbitPhase !==
        ORIENTATION_PHASES.PREVIEW
    ) {
      return false;
    }

    setConstellationOrientation(
      cloneOrientation(
        state.orbitGestureOrigin ||
        state.committedOrbitOrientation ||
        canonicalConstellationOrientation(
          state.orbitFocus
        )
      ),
      {
        committed: false,
        phase:
          ORIENTATION_PHASES.CANCELLED,
        gestureActive: false
      }
    );

    state.orbitGestureOrigin =
      null;

    state.orbitPhase =
      ORIENTATION_PHASES.COMMITTED;

    recordAction(
      `orbit-cancelled:${String(
        reason ||
        "cancelled"
      )}`
    );

    return true;
  }

  function requestOrbitFocus(wing) {
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

    return requestOrbitCommit({
      ...canonicalConstellationOrientation(
        normalizedWing
      ),

      primaryWing:
        normalizedWing
    });
  }

  function beginClusterGesture(
    wingOrPayload,
    maybePayload = {}
  ) {
    if (isHeld()) {
      return false;
    }

    const wing =
      typeof wingOrPayload ===
        "string"
        ? normalizeWing(
            wingOrPayload
          )
        : activeClusterWing();

    const payload =
      typeof wingOrPayload ===
        "object" &&
      wingOrPayload !== null
        ? wingOrPayload
        : maybePayload;

    const cluster =
      getCluster(wing);

    if (
      !cluster ||
      !(
        state.current ===
          STATES.CLUSTER_OPEN ||
        state.current ===
          STATES.ROOM_SELECTED
      ) ||
      wing !==
        normalizeWing(
          state.selectedCardinal
        )
    ) {
      return false;
    }

    if (cluster.gestureActive) {
      return true;
    }

    cluster.gestureOrigin =
      cloneOrientation(
        cluster.committedOrientation ||
        cluster.orientation
      );

    setClusterOrientation(
      cluster,
      resolveOrientation(
        payload,
        cluster.orientation
      ),
      {
        committed: false,
        phase:
          ORIENTATION_PHASES.PREVIEW,
        gestureActive: true
      }
    );

    recordAction(
      `cluster-gesture-began:${wing}`
    );

    return true;
  }

  function requestClusterPreview(
    wingOrPayload,
    maybePayload = {}
  ) {
    if (isHeld()) {
      return false;
    }

    const wing =
      typeof wingOrPayload ===
        "string"
        ? normalizeWing(
            wingOrPayload
          )
        : activeClusterWing();

    const payload =
      typeof wingOrPayload ===
        "object" &&
      wingOrPayload !== null
        ? wingOrPayload
        : maybePayload;

    const cluster =
      getCluster(wing);

    if (
      !cluster ||
      !(
        state.current ===
          STATES.CLUSTER_OPEN ||
        state.current ===
          STATES.ROOM_SELECTED
      ) ||
      wing !==
        normalizeWing(
          state.selectedCardinal
        )
    ) {
      return false;
    }

    if (!cluster.gestureActive) {
      beginClusterGesture(wing);
    }

    setClusterOrientation(
      cluster,
      resolveOrientation(
        payload,
        cluster.orientation
      ),
      {
        committed: false,
        phase:
          ORIENTATION_PHASES.PREVIEW,
        gestureActive: true
      }
    );

    recordAction(
      `cluster-preview-updated:${wing}`
    );

    return true;
  }

  function requestClusterCommit(
    wingOrPayload,
    maybePayload = {}
  ) {
    if (isHeld()) {
      return false;
    }

    const wing =
      typeof wingOrPayload ===
        "string"
        ? normalizeWing(
            wingOrPayload
          )
        : activeClusterWing();

    const payload =
      typeof wingOrPayload ===
        "object" &&
      wingOrPayload !== null
        ? wingOrPayload
        : maybePayload;

    const cluster =
      getCluster(wing);

    if (
      !cluster ||
      !(
        state.current ===
          STATES.CLUSTER_OPEN ||
        state.current ===
          STATES.ROOM_SELECTED
      ) ||
      wing !==
        normalizeWing(
          state.selectedCardinal
        )
    ) {
      return false;
    }

    const orientation =
      resolveOrientation(
        payload,
        cluster.orientation ||
        cluster.committedOrientation
      );

    orientation.primaryId =
      cluster.previewPrimaryRoom ||
      cluster.primaryRoom ||
      cluster.roomIds[0] ||
      "";

    setClusterOrientation(
      cluster,
      orientation,
      {
        committed: true,
        phase:
          ORIENTATION_PHASES.COMMITTED,
        gestureActive: false,
        incrementRevision: true
      }
    );

    cluster.gestureOrigin =
      null;

    recordAction(
      `cluster-committed:${wing}:${orientation.primaryId}`
    );

    return true;
  }

  function requestClusterCancel(
    wingOrReason,
    maybeReason = "cancelled"
  ) {
    if (isHeld()) {
      return false;
    }

    const explicitWing =
      normalizeWing(wingOrReason);

    const wing =
      explicitWing ||
      activeClusterWing();

    const reason =
      explicitWing
        ? maybeReason
        : wingOrReason ||
          maybeReason;

    const cluster =
      getCluster(wing);

    if (
      !cluster ||
      (
        !cluster.gestureActive &&
        cluster.phase !==
          ORIENTATION_PHASES.PREVIEW
      )
    ) {
      return false;
    }

    setClusterOrientation(
      cluster,
      cloneOrientation(
        cluster.gestureOrigin ||
        cluster.committedOrientation ||
        orientationFromQuaternion(
          QUATERNION.identity,
          cluster.primaryRoom
        )
      ),
      {
        committed: false,
        phase:
          ORIENTATION_PHASES.CANCELLED,
        gestureActive: false
      }
    );

    cluster.gestureOrigin =
      null;

    cluster.phase =
      ORIENTATION_PHASES.COMMITTED;

    recordAction(
      `cluster-cancelled:${wing}:${String(
        reason ||
        "cancelled"
      )}`
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
      !clusterContainsRoom(
        cluster,
        id
      )
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

    state.selectedLens =
      "return";

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
      ) ||
      "north";

    resetSelection();

    const committed =
      applyState(
        STATES.CONSTELLATION,
        {
          orbitFocus:
            previousWing,

          orbitPreviewFocus:
            previousWing,

          compassSelected:
            false
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

      let interactionPriority =
        INTERACTION_PRIORITY.INACTIVE;

      if (visible) {
        if (
          depthLayer ===
          DEPTH_LAYERS.FRONT
        ) {
          interactionPriority =
            INTERACTION_PRIORITY.FRONT;
        } else if (
          depthLayer ===
          DEPTH_LAYERS.REAR
        ) {
          interactionPriority =
            compassOverlap
              ? INTERACTION_PRIORITY.COMPASS
              : INTERACTION_PRIORITY.REAR;
        }
      }

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

    state.mediaQueryListener =
      update;

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
      ) ||
      "north";

    let initial =
      canonicalConstellationOrientation(
        requestedFocus
      );

    const serialized = String(
      state.root.dataset
        .orbitQuaternion ||
      ""
    ).trim();

    if (serialized) {
      try {
        initial =
          orientationFromQuaternion(
            JSON.parse(serialized),
            requestedFocus
          );
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

    state.orbitRevision =
      finiteNumber(
        state.root.dataset
          .orbitRevision,
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
          count:
            cluster.roomIds.length
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
        WINGS.includes(
          record.wing
        ),
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
      compassDecisionPresent:
        false,
      additiveStatePresent:
        false
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
          presentation
            .outerCardinalsActive &&
          presentation
            .activeRoomCluster
        ),
        "ARCHCOIN_ADDITIVE_PRESENTATION_FORBIDDEN"
      );
    }

    return Object.freeze({
      pass: true,
      progressiveReplacement:
        true,
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
      explicitMainCompassReturn:
        true,
      rendererLifecycleOwned:
        false
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
      swipeClassificationOwned:
        false,
      tapDragArbitrationOwned:
        false,
      wholeCrystalHitTestingOwned:
        false,
      syntheticClickSuppressionOwned:
        false,
      projectionDomApplicationOwned:
        false,
      clusterExitSwipeClassificationOwned:
        false,
      interactionModuleId:
        MODULE.interactionModuleId,
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
        "ARCHCOIN_CONTROLLER_FILE_SPLIT_VALIDATION_RECEIPT_v1",

      moduleId:
        MODULE.id,

      moduleVersion:
        MODULE.version,

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

      orbitStateAuthority:
        MODULE.id,

      clusterStateAuthority:
        MODULE.id,

      clusterExitTransitionAuthority:
        MODULE.id,

      navigationTransitionAuthority:
        MODULE.id,

      cameraOwnership: false,
      crystalRendererOwnership:
        false,
      compassRendererOwnership:
        false,
      semanticProjectionMathOwnership:
        false,
      semanticProjectionFactStorageOwnership:
        true,
      compassPageLocalSelection:
        true,
      explicitMainCompassReturn:
        true,

      results: Object.freeze(results)
    });
  }

  function writeValidationReceipt(
    receipt
  ) {
    state.validationReceipt =
      receipt;

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
        moduleId:
          MODULE.id,

        moduleVersion:
          MODULE.version,

        interactionModuleId:
          MODULE.interactionModuleId,

        interactionModuleVersion:
          MODULE.interactionModuleVersion,

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

    if (
      state.returnToOrbitButton
    ) {
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

    state.orbitGestureActive =
      false;

    state.orbitGestureOrigin =
      null;

    for (
      const cluster
      of state.clusters.values()
    ) {
      cluster.gestureActive =
        false;

      cluster.gestureOrigin =
        null;

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
              moduleId: MODULE.id,

              moduleVersion:
                MODULE.version,

              interactionModuleRequired:
                true,

              interactionModuleId:
                MODULE.interactionModuleId,

              interactionModuleVersion:
                MODULE.interactionModuleVersion
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
AUDRALIA_ARCHCOIN_CONTROLLER_GENUINE_FILE_SPLIT_RESULT_v2

Artifact:
 /products/archcoin/index.controller.js

Module:
 DGB_ARCHCOIN_CONTROLLER
 7.0.0-controller-interaction-semantic-priority

Paired interaction module:
 DGB_ARCHCOIN_INTERACTIONS
 1.0.0-pointer-gesture-interpreter

Preserved:
- canonical state machine
- canonical transition table
- exact sixteen-room registry
- exact canonical routes
- orbit orientation authority
- cluster orientation authority
- selection authority
- route-entry authority
- Return to Orbit
- Return to Constellation
- page-local Compass selection
- explicit Main Compass return
- panel choreography
- reduced-motion state
- terminal held state
- semantic projection fact storage
- receipts and validation

Removed:
- pointer state
- pointer listeners
- pointer capture
- pointer release
- drag dead zone
- swipe recognition
- outward swipe recognition
- tap-versus-drag arbitration
- whole-star hit testing
- semantic click delegation
- synthetic-click suppression
- projection-to-control positioning
- projected-radius CSS writes
- projected-radius dataset writes
- control pointer-event writes
- unprojected-control deactivation
- interaction-layer DOM authorization

Controller semantic projection behavior:
- validates canonical semantic identity
- stores x
- stores y
- stores radiusPx
- stores depth layer
- stores Compass overlap
- stores visibility
- stores interaction-priority fact
- publishes immutable snapshots
- does not apply those facts to DOM controls
- does not perform hit testing

Required next artifact:
 /products/archcoin/index.interactions.js

Runtime execution:
 NOT PERFORMED

Visual acceptance:
 NOT CLAIMED

Production authorization:
 FALSE

Deployment authorization:
 FALSE
*/

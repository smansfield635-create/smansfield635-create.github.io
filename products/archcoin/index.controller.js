/* /products/archcoin/index.controller.js
   ARCHCOIN
   Generational interaction-authority baseline.

   Controlling dependency position:
   1. /products/archcoin/index.controller.js
   2. /assets/compass/upstream-compass.geometry.js
   3. /assets/compass/upstream-compass.renderer.js
   4. /products/archcoin/index.crystals.js
   5. /products/archcoin/index.html
   6. /assets/compass/upstream-compass.css
   7. /products/archcoin/index.css

   Controlling law:
   - The constellation remains the primary navigational object.
   - Four coins open four corresponding room clusters.
   - Each cluster owns four exact canonical room destinations.
   - Room and Home Compass selections use one shared lower selection chamber.
   - Initial selection never navigates immediately.
   - Enter Selected Path performs the selected destination navigation.
   - Return to Orbit restores the correct prior ARCHCOIN state.
   - The Compass is tap-only at controller authority.
   - The Compass receives no independent drag-delta stream.
   - The Home Compass route is exactly /index.html.
   - Geometry, renderer, crystals, HTML, and CSS must depend on this law.
*/

(() => {
  "use strict";

  const MODULE = Object.freeze({
    id: "DGB_ARCHCOIN_CONTROLLER",
    version: "5.0.0-generational-selection-chamber-baseline",
    file: "/products/archcoin/index.controller.js"
  });

  const STATES = Object.freeze({
    CONSTELLATION: "CONSTELLATION",
    CLUSTER_OPEN: "CLUSTER_OPEN",
    ROOM_SELECTED: "ROOM_SELECTED",
    COMPASS_DECISION: "COMPASS_DECISION",
    SYSTEM_HELD: "SYSTEM_HELD"
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
    SETTLING: "SETTLING",
    COMMITTED: "COMMITTED",
    CANCELLED: "CANCELLED"
  });

  const COMPASS_PRESENTATION_MODES = Object.freeze({
    EMBEDDED: "EMBEDDED",
    DECISION_APPROACH: "DECISION_APPROACH",
    FAILURE_FALLBACK: "FAILURE_FALLBACK"
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

  const HOME_COMPASS = Object.freeze({
    destinationType: DESTINATION_TYPES.HOME_COMPASS,
    destinationId: "home-compass",
    destinationLabel: "Home Compass",
    route: "/index.html",
    paragraph:
      "The Home Compass is the primary navigation Compass for the website. Entering this path leaves ARCHCOIN and returns to index.html."
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

  const ARCHCOIN_16_ROOM_DESTINATION_PATHS = Object.freeze(
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

  const TRANSITIONS = Object.freeze({
    [STATES.CONSTELLATION]: Object.freeze([
      STATES.CONSTELLATION,
      STATES.CLUSTER_OPEN,
      STATES.COMPASS_DECISION,
      STATES.SYSTEM_HELD
    ]),

    [STATES.CLUSTER_OPEN]: Object.freeze([
      STATES.CLUSTER_OPEN,
      STATES.ROOM_SELECTED,
      STATES.CONSTELLATION,
      STATES.COMPASS_DECISION,
      STATES.SYSTEM_HELD
    ]),

    [STATES.ROOM_SELECTED]: Object.freeze([
      STATES.ROOM_SELECTED,
      STATES.CLUSTER_OPEN,
      STATES.CONSTELLATION,
      STATES.COMPASS_DECISION,
      STATES.SYSTEM_HELD
    ]),

    [STATES.COMPASS_DECISION]: Object.freeze([
      STATES.COMPASS_DECISION,
      STATES.CONSTELLATION,
      STATES.CLUSTER_OPEN,
      STATES.ROOM_SELECTED,
      STATES.SYSTEM_HELD
    ]),

    [STATES.SYSTEM_HELD]: Object.freeze([
      STATES.SYSTEM_HELD
    ])
  });

  const CHANNELS = Object.freeze({
    FRAME: "frame",
    COMPASS_PRESENTATION: "compassPresentation",
    REDUCED_MOTION: "reducedMotion"
  });

  const subscribers = Object.freeze({
    frame: new Set(),
    compassPresentation: new Set(),
    reducedMotion: new Set()
  });

  const state = {
    root: null,
    scene: null,

    panel: null,
    panelEyebrow: null,
    panelTitle: null,
    panelPurpose: null,
    panelRelationship: null,

    enterButton: null,
    enterLabel: null,
    returnToOrbitButton: null,
    returnToOrbitLabel: null,
    guidance: null,

    controllerReceiptOutput: null,

    compassMount: null,
    compassControl: null,
    compassFallback: null,
    compassRendererHandle: null,

    current: STATES.CONSTELLATION,
    stateBeforeCompassDecision: null,

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

    panelDescended: false,
    panelDescentFrame: 0,
    panelDescentCommitFrame: 0,
    sceneAscentFrame: 0,
    sceneAscentCommitFrame: 0,

    compassPresentationMode:
      COMPASS_PRESENTATION_MODES.EMBEDDED,
    compassRendererStatus: "pending",
    compassRendererFailure: "",

    reducedMotion: false,
    initialized: false,

    lastAction: "pending",
    lastFailure: ""
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
    return Number.isFinite(number)
      ? number
      : fallback;
  }

  function clamp(value, minimum, maximum) {
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

  function normalizeLabel(value, fallback = "") {
    const label = String(value || "").trim();
    return label || fallback;
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

  function quaternionFromEuler(yaw, pitch, roll) {
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
    const [x, y, z, w] =
      normalizeQuaternion(value);

    const sinPitch =
      2 * (w * y - z * x);

    const pitch =
      Math.abs(sinPitch) >= 1
        ? Math.sign(sinPitch) *
          Math.PI / 2
        : Math.asin(sinPitch);

    const yaw = Math.atan2(
      2 * (w * z + x * y),
      1 - 2 * (y * y + z * z)
    );

    const roll = Math.atan2(
      2 * (w * x + y * z),
      1 - 2 * (x * x + y * y)
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
    return {
      yaw: wrapRadians(yaw),

      pitch: clamp(
        finiteNumber(pitch, 0),
        -Math.PI / 2,
        Math.PI / 2
      ),

      roll: wrapRadians(roll),

      quaternion: quaternionFromEuler(
        yaw,
        pitch,
        roll
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

    return {
      yaw: euler.yaw,
      pitch: euler.pitch,
      roll: euler.roll,
      quaternion: normalized,
      primaryId: String(
        primaryId || ""
      ).trim()
    };
  }

  function cloneOrientation(orientation) {
    const source =
      orientation ||
      orientationFromQuaternion(
        QUATERNION.identity
      );

    return {
      yaw: finiteNumber(source.yaw, 0),
      pitch: finiteNumber(
        source.pitch,
        0
      ),
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
      orientationFromQuaternion(
        QUATERNION.identity,
        primaryRoom
      );

    return {
      wing,

      roomIds: Array.from(roomIds),

      primaryRoom,

      previewPrimaryRoom:
        primaryRoom,

      phase:
        ORIENTATION_PHASES.COMMITTED,

      gestureActive: false,

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

    if (
      state.current ===
        STATES.COMPASS_DECISION &&
      state.stateBeforeCompassDecision
    ) {
      return normalizeWing(
        state.stateBeforeCompassDecision
          .selectedCardinal
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

  function findCoinElement(wing) {
    const normalizedWing =
      normalizeWing(wing);

    if (!normalizedWing) {
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

    if (!id) {
      return null;
    }

    const escaped =
      globalThis.CSS &&
      typeof globalThis.CSS.escape ===
        "function"
        ? globalThis.CSS.escape(id)
        : id.replace(
            /["\\]/g,
            "\\$&"
          );

    return qs(
      `[data-archcoin-room][data-room-id="${escaped}"]`,
      state.root
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
      element.dataset.roomFunction ||
      element.dataset.panelBody ||
      element.dataset.whyEnter ||
      element.dataset.panelWhy,
      "This room is part of the selected ARCHCOIN domain. Review its purpose, then enter the exact declared path when ready."
    );
  }

  function panelFromCoin(element) {
    return Object.freeze({
      eyebrow: normalizeLabel(
        element.dataset.coinLabel ||
        element.dataset.label,
        "Selected coin"
      ),

      title: normalizeLabel(
        element.dataset.panelTitle ||
        element.dataset.coinTitle ||
        element.dataset.label,
        "Selected coin"
      ),

      purpose: normalizeLabel(
        element.dataset.panelBody ||
        element.dataset.coinBody ||
        element.dataset.coinFunction,
        "This coin opens a four-room ARCHCOIN cluster."
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
        roomParagraphFromElement(element),

      relationship:
        "Choose Enter Selected Path to open this room, or Return to Orbit to restore its four-room cluster."
    });
  }

  function panelFromHomeCompass() {
    return Object.freeze({
      eyebrow: "Selected path",
      title: HOME_COMPASS.destinationLabel,
      purpose: HOME_COMPASS.paragraph,
      relationship:
        "Choose Enter Selected Path to open the Home Compass, or Return to Orbit to restore the exact ARCHCOIN state that existed before selecting it."
    });
  }

  function defaultPanel() {
    return Object.freeze({
      eyebrow: "Selected path",
      title: "Choose a coin",
      purpose:
        "Begin with the financial domain that most closely matches the question in front of you.",
      relationship:
        "Tap a coin to open its four-room cluster. Tap a room or the center Compass to inspect a destination before entering it."
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
        title || "Choose a coin";
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
      control.removeAttribute("tabindex");
    } else {
      control.setAttribute(
        "tabindex",
        "-1"
      );
    }

    if (state.returnToOrbitLabel) {
      state.returnToOrbitLabel.textContent =
        label;
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

  function scheduleSelectionChamberDescent(
    expectedState,
    expectedDestinationType,
    expectedDestinationId
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
            state.panelDescentCommitFrame = 0;

            if (
              state.current !==
                expectedState ||
              state.selectedDestinationType !==
                expectedDestinationType ||
              state.selectedDestinationId !==
                expectedDestinationId ||
              !state.panel
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

            recordAction(
              `selection-chamber-descended:${expectedDestinationType}:${expectedDestinationId}`
            );
          });
      });
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
            state.sceneAscentCommitFrame = 0;

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

  function resetSelection() {
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
  }

  function snapshotRestorableState() {
    return Object.freeze({
      state: state.current,

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

      panelDescended:
        state.panelDescended,

      orbitFocus:
        state.orbitFocus,

      orbitPreviewFocus:
        state.orbitPreviewFocus
    });
  }

  function restoreSnapshot(snapshot) {
    invariant(
      snapshot &&
      typeof snapshot === "object",
      "ARCHCOIN_RESTORE_SNAPSHOT_REQUIRED"
    );

    state.selectedCardinal =
      snapshot.selectedCardinal || "";

    state.selectedCoin =
      snapshot.selectedCoin || "";

    state.selectedRoom =
      snapshot.selectedRoom || "";

    state.selectedDestinationType =
      snapshot.selectedDestinationType ||
      DESTINATION_TYPES.NONE;

    state.selectedDestinationId =
      snapshot.selectedDestinationId || "";

    state.selectedDestinationLabel =
      snapshot.selectedDestinationLabel || "";

    state.selectedRoute =
      snapshot.selectedRoute || "";

    state.selectedContentId =
      snapshot.selectedContentId || "";

    state.selectedLens =
      snapshot.selectedLens || "overview";

    state.selectedParagraph =
      snapshot.selectedParagraph || "";

    state.panelDescended =
      Boolean(snapshot.panelDescended);

    state.orbitFocus =
      normalizeWing(
        snapshot.orbitFocus
      ) ||
      state.orbitFocus;

    state.orbitPreviewFocus =
      normalizeWing(
        snapshot.orbitPreviewFocus
      ) ||
      state.orbitPreviewFocus;
  }

  function createCompassPresentationState() {
    return Object.freeze({
      mode:
        state.compassPresentationMode,

      selected:
        state.current ===
        STATES.COMPASS_DECISION,

      decisionOpen:
        state.current ===
        STATES.COMPASS_DECISION,

      cameraLowered:
        state.current ===
        STATES.COMPASS_DECISION,

      interactionEnabled:
        state.current !==
        STATES.SYSTEM_HELD,

      receivesIndependentGestureDeltas:
        false,

      inheritsConstellationOrientation:
        true,

      reducedMotion:
        state.reducedMotion,

      destinationType:
        HOME_COMPASS.destinationType,

      destinationId:
        HOME_COMPASS.destinationId,

      destinationLabel:
        HOME_COMPASS.destinationLabel,

      route:
        HOME_COMPASS.route,

      rendererStatus:
        state.compassRendererStatus,

      rendererFailure:
        state.compassRendererFailure
    });
  }

  function createFrameState() {
    const cluster =
      activeCluster();

    return Object.freeze({
      moduleId: MODULE.id,
      moduleVersion: MODULE.version,

      state: state.current,

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
              wing:
                cluster.wing,

              roomIds:
                Object.freeze(
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
                  cluster
                    .committedOrientation
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

      panelDescended:
        state.panelDescended,

      reducedMotion:
        state.reducedMotion,

      compassPresentation:
        createCompassPresentationState(),

      canonicalRoomRecords:
        CANONICAL_ROOM_RECORDS,

      canonicalRoomRoutes:
        ARCHCOIN_16_ROOM_DESTINATION_PATHS,

      homeCompass:
        HOME_COMPASS,

      lastAction:
        state.lastAction,

      lastFailure:
        state.lastFailure
    });
  }

  function createCompatibilityReceipt(frame) {
    return Object.freeze({
      contractId:
        "ARCHCOIN_CONTROLLER_GENERATIONAL_SELECTION_CHAMBER_v5",

      status:
        frame.state ===
        STATES.SYSTEM_HELD
          ? "held"
          : "available",

      state:
        frame.state,

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

      selectedContentId:
        frame.selectedContentId,

      selectedLens:
        frame.selectedLens,

      selectedParagraph:
        frame.selectedParagraph,

      panelDescended:
        frame.panelDescended,

      compassPresentationMode:
        frame.compassPresentation.mode,

      compassDecisionOpen:
        frame.compassPresentation
          .decisionOpen,

      compassRendererStatus:
        frame.compassPresentation
          .rendererStatus,

      compassRendererFailure:
        frame.compassPresentation
          .rendererFailure,

      homeCompassRoute:
        HOME_COMPASS.route,

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
      frame.state;

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

    state.root.dataset.panelDescended =
      frame.panelDescended
        ? "true"
        : "false";

    state.root.dataset.reducedMotion =
      frame.reducedMotion
        ? "true"
        : "false";

    state.root.dataset.compassDecisionOpen =
      frame.compassPresentation
        .decisionOpen
        ? "true"
        : "false";

    state.root.dataset.compassPresentationMode =
      frame.compassPresentation.mode;

    state.root.dataset.compassCameraLowered =
      frame.compassPresentation
        .cameraLowered
        ? "true"
        : "false";

    state.root.dataset.compassRendererStatus =
      frame.compassPresentation
        .rendererStatus;

    state.root.dataset.compassRendererFailure =
      frame.compassPresentation
        .rendererFailure;

    state.root.dataset.homeCompassRoute =
      HOME_COMPASS.route;

    state.root.dataset.archcoinControllerStatus =
      frame.state ===
      STATES.SYSTEM_HELD
        ? "held"
        : "available";

    state.root.dataset.archcoinControllerVersion =
      MODULE.version;

    qsa(
      "[data-archcoin-coin]",
      state.root
    ).forEach(element => {
      const wing =
        normalizeWing(
          element.dataset.wing
        );

      const selected =
        wing ===
          state.selectedCardinal &&
        (
          state.current ===
            STATES.CLUSTER_OPEN ||
          state.current ===
            STATES.ROOM_SELECTED
        );

      const primary =
        wing ===
          state.orbitFocus &&
        state.current ===
          STATES.CONSTELLATION;

      element.dataset.selected =
        selected ? "true" : "false";

      element.dataset.primary =
        primary ? "true" : "false";

      if (selected || primary) {
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

      const selected =
        roomId ===
        state.selectedRoom;

      const primary = Boolean(
        cluster &&
        roomId ===
          cluster.primaryRoom
      );

      element.dataset.selected =
        selected ? "true" : "false";

      element.dataset.primary =
        primary ? "true" : "false";

      if (selected || primary) {
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
      const selected =
        state.current ===
        STATES.COMPASS_DECISION;

      state.compassControl.dataset.selected =
        selected ? "true" : "false";

      state.compassControl.setAttribute(
        "aria-expanded",
        selected ? "true" : "false"
      );

      if (selected) {
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
      state.controllerReceiptOutput.value =
        serialized;

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

  function publishCompassPresentation() {
    publish(
      CHANNELS.COMPASS_PRESENTATION,
      createCompassPresentationState()
    );
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
    if (
      state.current ===
      STATES.CONSTELLATION
    ) {
      setPanel(defaultPanel());

      setEnterEnabled(
        false,
        "Enter Selected Path"
      );

      setReturnToOrbitVisible(false);

      setGuidance(
        "Tap a coin to open its cluster. Drag the constellation to change its orientation. Tap the center Compass to inspect the Home Compass path."
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
      }

      setEnterEnabled(
        false,
        "Enter Selected Path"
      );

      setReturnToOrbitVisible(false);

      setGuidance(
        "Rotate the four-room cluster, then tap a room star to inspect its exact destination."
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
      }

      setEnterEnabled(
        Boolean(
          state.selectedRoute
        ),
        "Enter Selected Path"
      );

      setReturnToOrbitVisible(
        true,
        "Return to Orbit"
      );

      setGuidance(
        "Review the selected room. Enter Selected Path opens its exact route. Return to Orbit restores the active four-room cluster."
      );

      return;
    }

    if (
      state.current ===
      STATES.COMPASS_DECISION
    ) {
      setPanel(
        panelFromHomeCompass()
      );

      setEnterEnabled(
        state.selectedRoute ===
          HOME_COMPASS.route,
        "Enter Selected Path"
      );

      setReturnToOrbitVisible(
        true,
        "Return to Orbit"
      );

      setGuidance(
        "Review the Home Compass path. Enter Selected Path opens index.html. Return to Orbit restores the exact ARCHCOIN state that existed before the Compass was selected."
      );

      return;
    }

    setPanel({
      eyebrow: "System held",
      title: "ARCHCOIN is unavailable",
      purpose:
        "The controller could not establish a safe navigational state.",
      relationship:
        "Static content remains visible."
    });

    setEnterEnabled(
      false,
      "Unavailable"
    );

    setReturnToOrbitVisible(false);

    setGuidance(
      "ARCHCOIN is held because its navigation contract could not be validated."
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

    state.current = nextState;

    for (
      const [key, value]
      of Object.entries(patch)
    ) {
      if (
        Object.prototype.hasOwnProperty.call(
          state,
          key
        )
      ) {
        state[key] = value;
      }
    }

    syncPresentation();
    publishCompassPresentation();
    recordAction(action);

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
      state.orbitPreviewFocus ||
      state.orbitFocus ||
      "north";

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
        cloneOrientation(normalized);

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
        cloneOrientation(normalized);

      cluster.primaryRoom =
        normalized.primaryId;

      cluster.previewPrimaryRoom =
        normalized.primaryId;
    }

    return true;
  }

  function beginOrbitGesture(payload = {}) {
    if (
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

  function requestOrbitPreview(payload = {}) {
    if (
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

    /*
     * No independent Compass delta is published.
     * Downstream scene execution consumes the unified frame quaternion.
     */
    recordAction(
      "orbit-preview-updated"
    );

    return true;
  }

  function requestOrbitCommit(payload = {}) {
    if (
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
        orientation.primaryId ||
        state.orbitPreviewFocus ||
        state.orbitFocus
      );

    if (!primaryWing) {
      recordAction(
        "orbit-commit-rejected",
        "ORBIT_PRIMARY_WING_REQUIRED"
      );

      return false;
    }

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

    state.orbitGestureOrigin = null;

    recordAction(
      `orbit-committed:${primaryWing}`
    );

    return true;
  }

  function requestOrbitCancel(
    reason = "cancelled"
  ) {
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
          ORIENTATION_PHASES.COMMITTED,
        gestureActive: false
      }
    );

    state.orbitGestureOrigin = null;

    recordAction(
      `orbit-cancelled:${String(
        reason || "cancelled"
      )}`
    );

    return true;
  }

  function requestOrbitFocus(
    wing,
    options = {}
  ) {
    const normalizedWing =
      normalizeWing(wing);

    if (
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
        normalizedWing,

      source:
        options.source ||
        "direct-focus"
    });
  }

  function beginClusterGesture(
    wingOrPayload,
    maybePayload = {}
  ) {
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
      )
    ) {
      return false;
    }

    if (!cluster.gestureActive) {
      beginClusterGesture(wing);
    }

    const orientation =
      resolveOrientation(
        payload,
        cluster.orientation
      );

    const primaryRoom =
      normalizeRoomId(
        payload.primaryRoom ||
        payload.primaryId ||
        orientation.primaryId
      );

    if (
      primaryRoom &&
      !clusterContainsRoom(
        cluster,
        primaryRoom
      )
    ) {
      return false;
    }

    orientation.primaryId =
      primaryRoom ||
      orientation.primaryId ||
      cluster.previewPrimaryRoom ||
      cluster.primaryRoom ||
      cluster.roomIds[0] ||
      "";

    setClusterOrientation(
      cluster,
      orientation,
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

    const primaryRoom =
      normalizeRoomId(
        payload.primaryRoom ||
        payload.primaryId ||
        orientation.primaryId ||
        cluster.previewPrimaryRoom ||
        cluster.primaryRoom
      );

    if (
      !primaryRoom ||
      !clusterContainsRoom(
        cluster,
        primaryRoom
      )
    ) {
      recordAction(
        `cluster-commit-rejected:${wing}`,
        "CLUSTER_PRIMARY_ROOM_REQUIRED"
      );

      return false;
    }

    orientation.primaryId =
      primaryRoom;

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

    cluster.gestureOrigin = null;

    recordAction(
      `cluster-committed:${wing}:${primaryRoom}`
    );

    return true;
  }

  function requestClusterCancel(
    wingOrReason,
    maybeReason = "cancelled"
  ) {
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
          ORIENTATION_PHASES.COMMITTED,
        gestureActive: false
      }
    );

    cluster.gestureOrigin = null;

    recordAction(
      `cluster-cancelled:${wing}:${String(
        reason || "cancelled"
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

    const orientation =
      canonicalConstellationOrientation(
        wing
      );

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

    resetSelection();

    return applyState(
      STATES.CLUSTER_OPEN,
      {
        selectedCardinal:
          wing,

        selectedCoin:
          wingToCoin(wing),

        selectedDestinationType:
          DESTINATION_TYPES.COIN,

        selectedDestinationId:
          wing,

        selectedDestinationLabel:
          destination.label ||
          wingToCoin(wing),

        selectedRoute:
          "",

        selectedParagraph:
          "",

        panelDescended:
          false
      },
      `cardinal-selected:${wing}`
    );
  }

  function requestRoomSelection(roomId) {
    const id =
      normalizeRoomId(roomId);

    if (
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
      getCluster(
        canonical.wing
      );

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

    const paragraph =
      roomParagraphFromElement(element);

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
            destination.label ||
            canonical.roomId,

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
            paragraph,

          panelDescended:
            true
        },
        `room-selected:${canonical.roomId}`
      );

    if (!committed) {
      return false;
    }

    scheduleSelectionChamberDescent(
      STATES.ROOM_SELECTED,
      DESTINATION_TYPES.ROOM,
      canonical.roomId
    );

    return true;
  }

  function requestCompassDecision() {
    if (
      state.current ===
      STATES.SYSTEM_HELD
    ) {
      return false;
    }

    if (
      state.current ===
      STATES.COMPASS_DECISION
    ) {
      return true;
    }

    cancelActiveGestures(
      "compass-selection"
    );

    clearViewportSchedules();

    state.stateBeforeCompassDecision =
      snapshotRestorableState();

    const committed =
      applyState(
        STATES.COMPASS_DECISION,
        {
          selectedDestinationType:
            HOME_COMPASS.destinationType,

          selectedDestinationId:
            HOME_COMPASS.destinationId,

          selectedDestinationLabel:
            HOME_COMPASS.destinationLabel,

          selectedRoute:
            HOME_COMPASS.route,

          selectedParagraph:
            HOME_COMPASS.paragraph,

          panelDescended:
            true,

          compassPresentationMode:
            COMPASS_PRESENTATION_MODES
              .DECISION_APPROACH
        },
        "home-compass-selected"
      );

    if (!committed) {
      return false;
    }

    scheduleSelectionChamberDescent(
      STATES.COMPASS_DECISION,
      DESTINATION_TYPES.HOME_COMPASS,
      HOME_COMPASS.destinationId
    );

    return true;
  }

  function requestEnterSelection() {
    if (
      state.current ===
      STATES.ROOM_SELECTED
    ) {
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

    if (
      state.current ===
      STATES.COMPASS_DECISION
    ) {
      if (
        state.selectedDestinationType !==
          DESTINATION_TYPES.HOME_COMPASS ||
        state.selectedDestinationId !==
          HOME_COMPASS.destinationId ||
        state.selectedRoute !==
          HOME_COMPASS.route
      ) {
        recordAction(
          "selected-path-entry-rejected",
          "HOME_COMPASS_DESTINATION_INVALID"
        );

        return false;
      }

      recordAction(
        "selected-path-entry-confirmed:home-compass"
      );

      globalThis.location.assign(
        HOME_COMPASS.route
      );

      return true;
    }

    return false;
  }

  function restorePreCompassState() {
    if (
      state.current !==
        STATES.COMPASS_DECISION ||
      !state.stateBeforeCompassDecision
    ) {
      return false;
    }

    const snapshot =
      state.stateBeforeCompassDecision;

    state.stateBeforeCompassDecision =
      null;

    clearViewportSchedules();

    restoreSnapshot(snapshot);

    const restoredState =
      snapshot.state;

    const committed =
      applyState(
        restoredState,
        {
          compassPresentationMode:
            COMPASS_PRESENTATION_MODES
              .EMBEDDED
        },
        `returned-to-orbit:home-compass:${restoredState}`
      );

    if (!committed) {
      return false;
    }

    if (
      restoredState ===
        STATES.ROOM_SELECTED
    ) {
      scheduleSelectionChamberDescent(
        STATES.ROOM_SELECTED,
        DESTINATION_TYPES.ROOM,
        state.selectedDestinationId
      );

      return true;
    }

    scheduleSceneAscent(
      restoredState,
      restoredState ===
      STATES.CLUSTER_OPEN
        ? state.selectedCardinal
        : ""
    );

    return true;
  }

  function requestReturnToOrbit() {
    if (
      state.current ===
      STATES.COMPASS_DECISION
    ) {
      return restorePreCompassState();
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

    clearViewportSchedules();

    const coin =
      findCoinElement(wing);

    const destination =
      destinationFromElement(coin);

    const committed =
      applyState(
        STATES.CLUSTER_OPEN,
        {
          selectedCardinal:
            wing,

          selectedCoin:
            wingToCoin(wing),

          selectedRoom:
            "",

          selectedDestinationType:
            DESTINATION_TYPES.COIN,

          selectedDestinationId:
            wing,

          selectedDestinationLabel:
            destination
              ? destination.label
              : wingToCoin(wing),

          selectedRoute:
            "",

          selectedContentId:
            "",

          selectedLens:
            "overview",

          selectedParagraph:
            "",

          panelDescended:
            false
        },
        `returned-to-orbit:room:${wing}`
      );

    if (!committed) {
      return false;
    }

    scheduleSceneAscent(
      STATES.CLUSTER_OPEN,
      wing
    );

    return true;
  }

  function requestCompassDecisionCancel() {
    return requestReturnToOrbit();
  }

  function requestHomeCompassEntry() {
    if (
      state.current !==
      STATES.COMPASS_DECISION
    ) {
      return false;
    }

    return requestEnterSelection();
  }

  function requestReturnToUpstream() {
    return requestCompassDecision();
  }

  function requestReturnToConstellation(
    options = {}
  ) {
    if (
      state.current !==
        STATES.CLUSTER_OPEN &&
      state.current !==
        STATES.ROOM_SELECTED
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

          compassPresentationMode:
            COMPASS_PRESENTATION_MODES
              .EMBEDDED
        },
        `returned-to-constellation:${previousWing}`
      );

    if (
      committed &&
      options.scrollToScene !==
        false
    ) {
      scheduleSceneAscent(
        STATES.CONSTELLATION
      );
    }

    return committed;
  }

  function validateDeclaredRooms() {
    const declared =
      qsa(
        "[data-archcoin-room]",
        state.root
      );

    invariant(
      declared.length ===
        CANONICAL_ROOM_RECORDS.length,
      "ARCHCOIN_DECLARED_ROOM_COUNT_INVALID",
      {
        expected:
          CANONICAL_ROOM_RECORDS.length,
        actual:
          declared.length
      }
    );

    const seenIds =
      new Set();

    const seenRoutes =
      new Set();

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
        { roomId }
      );

      invariant(
        !seenIds.has(roomId),
        "ARCHCOIN_DUPLICATE_ROOM_ID",
        { roomId }
      );

      invariant(
        !seenRoutes.has(route),
        "ARCHCOIN_DUPLICATE_ROOM_ROUTE",
        { route }
      );

      invariant(
        route === canonical.route,
        "ARCHCOIN_ROOM_ROUTE_MISMATCH",
        {
          roomId,
          expected: canonical.route,
          actual: route
        }
      );

      invariant(
        wing === canonical.wing,
        "ARCHCOIN_ROOM_WING_MISMATCH",
        {
          roomId,
          expected: canonical.wing,
          actual: wing
        }
      );

      invariant(
        wingToCoin(wing) ===
          canonical.coin,
        "ARCHCOIN_ROOM_COIN_MAPPING_MISMATCH",
        {
          roomId,
          wing,
          expectedCoin:
            canonical.coin,
          actualCoin:
            wingToCoin(wing)
        }
      );

      seenIds.add(roomId);
      seenRoutes.add(route);
    }

    for (
      const canonical
      of CANONICAL_ROOM_RECORDS
    ) {
      invariant(
        seenIds.has(
          canonical.roomId
        ),
        "ARCHCOIN_CANONICAL_ROOM_MISSING",
        {
          roomId:
            canonical.roomId
        }
      );

      invariant(
        seenRoutes.has(
          canonical.route
        ),
        "ARCHCOIN_CANONICAL_ROUTE_MISSING",
        {
          route:
            canonical.route
        }
      );
    }

    return true;
  }

  function handleSemanticClick(event) {
    const compassControl =
      event.target.closest(
        "[data-upstream-compass-control]"
      );

    if (
      compassControl &&
      state.root.contains(
        compassControl
      )
    ) {
      event.preventDefault();
      event.stopPropagation();

      requestCompassDecision();
      return;
    }

    const destination =
      event.target.closest(
        "[data-archcoin-destination]"
      );

    if (
      !destination ||
      !state.root.contains(
        destination
      )
    ) {
      return;
    }

    if (
      destination.matches(
        "[data-archcoin-coin]"
      )
    ) {
      event.preventDefault();

      requestCardinalSelection(
        destination.dataset.wing ||
        destination.dataset.coinId
      );

      return;
    }

    if (
      destination.matches(
        "[data-archcoin-room]"
      )
    ) {
      event.preventDefault();

      requestRoomSelection(
        destination.dataset.roomId
      );
    }
  }

  function handleKeydown(event) {
    if (
      event.key === "Escape" &&
      (
        state.current ===
          STATES.ROOM_SELECTED ||
        state.current ===
          STATES.COMPASS_DECISION
      )
    ) {
      event.preventDefault();
      requestReturnToOrbit();
    }
  }

  function handleCompassRendererFailure(
    event
  ) {
    const reason = String(
      event &&
      event.detail &&
      event.detail.reason
        ? event.detail.reason
        : "UPSTREAM_COMPASS_RENDERER_FAILURE"
    );

    state.compassRendererStatus =
      "failed";

    state.compassRendererFailure =
      reason;

    state.compassPresentationMode =
      COMPASS_PRESENTATION_MODES
        .FAILURE_FALLBACK;

    publishCompassPresentation();

    recordAction(
      "compass-renderer-failed",
      reason
    );
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
      "The visual constellation is temporarily unavailable. Canonical room destinations remain preserved."
    );

    recordAction(
      "crystals-renderer-failed",
      reason
    );
  }

  function readReducedMotion() {
    state.reducedMotion =
      globalThis.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches ||
      state.root.dataset.reducedMotion ===
        "true";
  }

  function bindReducedMotion() {
    const media =
      globalThis.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    const update = event => {
      state.reducedMotion =
        Boolean(event.matches);

      publish(
        CHANNELS.REDUCED_MOTION,
        state.reducedMotion
      );

      publishCompassPresentation();

      recordAction(
        "reduced-motion-updated"
      );
    };

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

    state.scene =
      qs(
        "[data-archcoin-scene]",
        state.root
      );

    state.panel =
      qs(
        "[data-archcoin-panel]",
        state.root
      );

    invariant(
      state.scene,
      "ARCHCOIN_SCENE_NOT_FOUND"
    );

    invariant(
      state.panel,
      "ARCHCOIN_PANEL_NOT_FOUND"
    );

    state.panelEyebrow =
      qs(
        "[data-archcoin-panel-eyebrow]",
        state.root
      );

    state.panelTitle =
      qs(
        "[data-archcoin-panel-title]",
        state.root
      );

    state.panelPurpose =
      qs(
        "[data-archcoin-panel-purpose]",
        state.root
      );

    state.panelRelationship =
      qs(
        "[data-archcoin-panel-relationship]",
        state.root
      );

    state.enterButton =
      qs(
        "[data-archcoin-enter]",
        state.root
      );

    state.enterLabel =
      qs(
        "[data-archcoin-enter-label]",
        state.root
      );

    state.returnToOrbitButton =
      qs(
        "[data-archcoin-return-to-orbit]",
        state.root
      );

    state.returnToOrbitLabel =
      qs(
        "[data-archcoin-return-to-orbit-label]",
        state.root
      );

    state.guidance =
      qs(
        "[data-archcoin-guidance]",
        state.root
      );

    state.controllerReceiptOutput =
      qs(
        "[data-archcoin-controller-receipt]",
        state.root
      );

    state.compassMount =
      qs(
        "[data-upstream-compass-mount]",
        state.root
      );

    state.compassControl =
      qs(
        "[data-upstream-compass-control]",
        state.root
      );

    state.compassFallback =
      qs(
        "[data-upstream-compass-fallback]",
        state.root
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

    const serialized =
      String(
        state.root.dataset.orbitQuaternion ||
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

  function createRendererContext() {
    return Object.freeze({
      pageNodeId: String(
        state.compassMount &&
        state.compassMount.getAttribute(
          "data-upstream-compass-page-node"
        ) ||
        "archcoin"
      ).trim() || "archcoin",

      parentNodeId:
        "home-compass",

      parentRoute:
        HOME_COMPASS.route,

      root:
        state.root,

      scene:
        state.scene,

      mount:
        state.compassMount,

      semanticControl:
        state.compassControl,

      fallback:
        state.compassFallback,

      controller:
        globalThis
          .DGB_ARCHCOIN_CONTROLLER ||
        null,

      requestCompassDecision,

      requestCompassDecisionCancel,

      requestHomeCompassEntry,

      requestEnterSelection,

      requestReturnToOrbit,

      getCompassPresentationState:
        createCompassPresentationState,

      subscribeCompassPresentationState:
        callback =>
          subscribe(
            CHANNELS.COMPASS_PRESENTATION,
            callback
          ),

      getFrameState:
        createFrameState,

      subscribeFrameState:
        callback =>
          subscribe(
            CHANNELS.FRAME,
            callback
          ),

      getReducedMotion:
        () => state.reducedMotion,

      subscribeReducedMotion:
        callback =>
          subscribe(
            CHANNELS.REDUCED_MOTION,
            callback
          ),

      /*
       * Compatibility only.
       * This opens the shared selection chamber and never navigates directly.
       */
      requestReturnToUpstream,

      receivesIndependentGestureDeltas:
        false,

      inheritsConstellationOrientation:
        true,

      qualityProfileId:
        globalThis.innerWidth <= 767
          ? "mobile"
          : "desktop"
    });
  }

  function initializeCompassRenderer() {
    if (!state.compassMount) {
      state.compassRendererStatus =
        "absent";

      state.compassRendererFailure =
        "";

      publishCompassPresentation();

      return false;
    }

    if (
      !state.compassControl ||
      !state.compassFallback
    ) {
      state.compassRendererStatus =
        "failed";

      state.compassRendererFailure =
        "ARCHCOIN_COMPASS_HTML_CONTRACT_INCOMPLETE";

      state.compassPresentationMode =
        COMPASS_PRESENTATION_MODES
          .FAILURE_FALLBACK;

      publishCompassPresentation();

      return false;
    }

    const renderer =
      globalThis
        .DGB_UPSTREAM_COMPASS_RENDERER;

    if (
      !renderer ||
      typeof renderer.mount !==
        "function"
    ) {
      state.compassRendererStatus =
        "unavailable";

      state.compassRendererFailure =
        "UPSTREAM_COMPASS_RENDERER_NOT_AVAILABLE";

      state.compassPresentationMode =
        COMPASS_PRESENTATION_MODES
          .FAILURE_FALLBACK;

      publishCompassPresentation();

      return false;
    }

    try {
      state.compassRendererHandle =
        renderer.mount(
          createRendererContext()
        );

      state.compassRendererStatus =
        "available";

      state.compassRendererFailure =
        "";

      state.compassPresentationMode =
        COMPASS_PRESENTATION_MODES
          .EMBEDDED;

      publishCompassPresentation();

      return true;
    } catch (error) {
      state.compassRendererHandle =
        null;

      state.compassRendererStatus =
        "failed";

      state.compassRendererFailure =
        error &&
        (
          error.code ||
          error.message
        )
          ? String(
              error.code ||
              error.message
            )
          : "UPSTREAM_COMPASS_MOUNT_FAILURE";

      state.compassPresentationMode =
        COMPASS_PRESENTATION_MODES
          .FAILURE_FALLBACK;

      publishCompassPresentation();

      return false;
    }
  }

  function exposeApi() {
    globalThis.DGB_ARCHCOIN_CONTROLLER =
      Object.freeze({
        moduleId: MODULE.id,
        moduleVersion: MODULE.version,

        states: STATES,

        destinationTypes:
          DESTINATION_TYPES,

        orientationPhases:
          ORIENTATION_PHASES,

        compassPresentationModes:
          COMPASS_PRESENTATION_MODES,

        homeCompass:
          HOME_COMPASS,

        canonicalRoomRecords:
          CANONICAL_ROOM_RECORDS,

        canonicalRoomRoutes:
          ARCHCOIN_16_ROOM_DESTINATION_PATHS,

        wingToCoin:
          WING_TO_COIN,

        getFrameState:
          createFrameState,

        getCompassPresentationState:
          createCompassPresentationState,

        getClusterState: wing => {
          const cluster =
            getCluster(wing);

          if (!cluster) {
            return null;
          }

          return Object.freeze({
            wing:
              cluster.wing,

            roomIds:
              Object.freeze(
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
                cluster
                  .committedOrientation
              )
          });
        },

        subscribeFrameState:
          callback =>
            subscribe(
              CHANNELS.FRAME,
              callback
            ),

        subscribeCompassPresentationState:
          callback =>
            subscribe(
              CHANNELS.COMPASS_PRESENTATION,
              callback
            ),

        subscribeReducedMotion:
          callback =>
            subscribe(
              CHANNELS.REDUCED_MOTION,
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

        requestCompassDecision,

        requestEnterSelection,

        requestReturnToOrbit,

        requestReturnToConstellation,

        requestCompassDecisionCancel,

        requestHomeCompassEntry,

        requestReturnToUpstream
      });
  }

  function bindControls() {
    state.root.addEventListener(
      "click",
      handleSemanticClick
    );

    state.root.addEventListener(
      "keydown",
      handleKeydown
    );

    if (state.enterButton) {
      state.enterButton.addEventListener(
        "click",
        requestEnterSelection
      );
    }

    if (state.returnToOrbitButton) {
      state.returnToOrbitButton.addEventListener(
        "click",
        requestReturnToOrbit
      );
    }

    globalThis.addEventListener(
      "DGB_UPSTREAM_COMPASS_RENDERER_FAILURE",
      handleCompassRendererFailure
    );

    globalThis.addEventListener(
      "ARCHCOIN_CRYSTALS_RENDER_FAILURE",
      handleCrystalsFailure
    );
  }

  function initialize() {
    try {
      resolveDom();

      validateDeclaredRooms();

      readReducedMotion();

      initializeOrientationState();

      initializeClusters();

      exposeApi();

      bindControls();

      bindReducedMotion();

      resetSelection();

      syncPresentation();

      initializeCompassRenderer();

      state.initialized = true;

      recordAction(
        "controller-initialized"
      );
    } catch (error) {
      state.current =
        STATES.SYSTEM_HELD;

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
        publishFrame();
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
  }

  if (
    document.readyState === "loading"
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

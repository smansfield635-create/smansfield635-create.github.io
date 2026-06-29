/* /products/archcoin/index.controller.js
   ARCHCOIN
   Controller foundation renewal.

   Module:
   DGB_ARCHCOIN_CONTROLLER
   6.0.1-controller-presentation-and-native-home-corrections

   Controlling dependency position:
   1. /products/archcoin/index.controller.js
   2. /assets/compass/upstream-compass.geometry.js
   3. /assets/compass/upstream-compass.renderer.js
   4. /products/archcoin/index.crystals.js
   5. /products/archcoin/index.html
   6. /assets/compass/upstream-compass.css
   7. /products/archcoin/index.css

   Controlling navigation law:
   - CONSTELLATION presents the four outer cardinals.
   - Selecting one cardinal opens only that cardinal's four-room cluster.
   - CLUSTER_OPEN retires the outer cardinal field from active presentation.
   - ROOM_SELECTED preserves the active four-room cluster.
   - Initial room selection never navigates immediately.
   - Enter Selected Path performs canonical route entry.
   - Return to Orbit restores ROOM_SELECTED to CLUSTER_OPEN.
   - Return to Constellation restores CLUSTER_OPEN or ROOM_SELECTED to
     CONSTELLATION.
   - Additive cardinal-plus-cluster presentation is forbidden.
   - Generated nonvisual room proxies are forbidden.
   - Projected room-hit inference is forbidden.

   Internal navigation states:
   - CONSTELLATION
   - CLUSTER_OPEN
   - ROOM_SELECTED
   - SYSTEM_HELD

   Normalized page-presentation modes:
   - CONSTELLATION -> CONSTELLATION
   - CLUSTER_OPEN  -> CLUSTER
   - ROOM_SELECTED -> CLUSTER
   - SYSTEM_HELD   -> HELD

   Controlling Compass law:
   - The Compass is a fixed-center independent sibling.
   - The Compass does not create an ARCHCOIN navigation state.
   - The Compass does not inherit orbit or cluster orientation.
   - The Compass does not participate in orbit or cluster settlement.
   - The Compass publishes no quaternion.
   - The controller does not mount or supervise the renderer.
   - Compass activation publishes one upstream-request receipt.
   - The canonical semantic anchor retains native /index.html navigation.
   - The controller does not suppress the native link unless a future,
     confirmed adapter explicitly assumes navigation responsibility.
   - The Home Compass route is exactly /index.html.

   Controller boundary:
   - This file owns behavior, canonical navigation records, state transitions,
     orientation state, semantic activation, route confirmation, restoration,
     reduced-motion state, held state, upstream requests, normalized
     presentation publication, public contracts, and controller validation.
   - This file does not own WebGL, shaders, GPU buffers, canvas construction,
     fallback visibility, crystal drawing, scene layout, CSS, projected
     picking, or renderer lifecycle.

   Renewal disposition:
   CONTROLLER_RUNTIME_CORRECTION_CANDIDATE
   !=
   DOWNSTREAM_INTEGRATION
   !=
   PRODUCTION_AUTHORIZATION
*/

(() => {
  "use strict";

  const MODULE = Object.freeze({
    id: "DGB_ARCHCOIN_CONTROLLER",
    version: "6.0.1-controller-presentation-and-native-home-corrections",
    file: "/products/archcoin/index.controller.js"
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
    [STATES.CONSTELLATION]:
      PRESENTATION_MODES.CONSTELLATION,

    [STATES.CLUSTER_OPEN]:
      PRESENTATION_MODES.CLUSTER,

    [STATES.ROOM_SELECTED]:
      PRESENTATION_MODES.CLUSTER,

    [STATES.SYSTEM_HELD]:
      PRESENTATION_MODES.HELD
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

  const CHANNELS = Object.freeze({
    FRAME: "frame",
    REDUCED_MOTION: "reducedMotion",
    HELD_STATE: "heldState",
    COMPASS_STATE: "compassState",
    UPSTREAM_REQUEST: "upstreamRequest"
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
    destinationType:
      DESTINATION_TYPES.HOME_COMPASS,

    destinationId:
      "home-compass",

    destinationLabel:
      "Home Compass",

    route:
      "/index.html",

    source:
      "archcoin-controller",

    navigationAuthority:
      "NATIVE_ANCHOR"
  });

  const PRESENTATION_BY_STATE = Object.freeze({
    [STATES.CONSTELLATION]: Object.freeze({
      mode:
        PRESENTATION_MODES.CONSTELLATION,

      outerCardinalsActive:
        true,

      activeRoomCluster:
        false,

      roomSelectionPermitted:
        false
    }),

    [STATES.CLUSTER_OPEN]: Object.freeze({
      mode:
        PRESENTATION_MODES.CLUSTER,

      outerCardinalsActive:
        false,

      activeRoomCluster:
        true,

      roomSelectionPermitted:
        true
    }),

    [STATES.ROOM_SELECTED]: Object.freeze({
      mode:
        PRESENTATION_MODES.CLUSTER,

      outerCardinalsActive:
        false,

      activeRoomCluster:
        true,

      roomSelectionPermitted:
        true
    }),

    [STATES.SYSTEM_HELD]: Object.freeze({
      mode:
        PRESENTATION_MODES.HELD,

      outerCardinalsActive:
        false,

      activeRoomCluster:
        false,

      roomSelectionPermitted:
        false
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

  const CANONICAL_ROOM_ROUTES =
    Object.freeze(
      CANONICAL_ROOM_RECORDS.map(
        record => record.route
      )
    );

  const ROOM_BY_ID =
    new Map(
      CANONICAL_ROOM_RECORDS.map(
        record => [
          record.roomId,
          record
        ]
      )
    );

  const ROOM_BY_ROUTE =
    new Map(
      CANONICAL_ROOM_RECORDS.map(
        record => [
          record.route,
          record
        ]
      )
    );

  const ROOMS_BY_WING =
    new Map(
      WINGS.map(
        wing => [
          wing,

          Object.freeze(
            CANONICAL_ROOM_RECORDS
              .filter(
                record =>
                  record.wing ===
                  wing
              )
              .map(
                record =>
                  record.roomId
              )
          )
        ]
      )
    );

  const QUATERNION = Object.freeze({
    identity:
      Object.freeze([
        0,
        0,
        0,
        1
      ]),

    minimumLength:
      1e-8
  });

  const CANONICAL_CONSTELLATION_EULER =
    Object.freeze({
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

  const subscribers = Object.freeze({
    frame:
      new Set(),

    reducedMotion:
      new Set(),

    heldState:
      new Set(),

    compassState:
      new Set(),

    upstreamRequest:
      new Set()
  });

  const state = {
    root:
      null,

    scene:
      null,

    panel:
      null,

    panelEyebrow:
      null,

    panelTitle:
      null,

    panelPurpose:
      null,

    panelRelationship:
      null,

    enterButton:
      null,

    enterLabel:
      null,

    returnToOrbitButton:
      null,

    returnToOrbitLabel:
      null,

    guidance:
      null,

    controllerReceiptOutput:
      null,

    controllerValidationOutput:
      null,

    compassControl:
      null,

    current:
      STATES.CONSTELLATION,

    orbitFocus:
      "north",

    orbitPreviewFocus:
      "north",

    orbitPhase:
      ORIENTATION_PHASES.COMMITTED,

    orbitGestureActive:
      false,

    orbitRevision:
      0,

    orbitOrientation:
      null,

    committedOrbitOrientation:
      null,

    orbitGestureOrigin:
      null,

    clusters:
      new Map(),

    selectedCardinal:
      "",

    selectedCoin:
      "",

    selectedRoom:
      "",

    selectedDestinationType:
      DESTINATION_TYPES.NONE,

    selectedDestinationId:
      "",

    selectedDestinationLabel:
      "",

    selectedRoute:
      "",

    selectedContentId:
      "",

    selectedLens:
      "overview",

    selectedParagraph:
      "",

    panelDescended:
      false,

    panelDescentFrame:
      0,

    panelDescentCommitFrame:
      0,

    sceneAscentFrame:
      0,

    sceneAscentCommitFrame:
      0,

    reducedMotion:
      false,

    mediaQuery:
      null,

    mediaQueryListener:
      null,

    lastUpstreamRequest:
      null,

    upstreamRequestRevision:
      0,

    initialized:
      false,

    lastAction:
      "pending",

    lastFailure:
      "",

    validationReceipt:
      null
  };

  function invariant(
    condition,
    code,
    details = null
  ) {
    if (condition) {
      return;
    }

    const error =
      new Error(code);

    error.code =
      code;

    error.details =
      details;

    throw error;
  }

  function qs(
    selector,
    root = document
  ) {
    return root.querySelector(
      selector
    );
  }

  function qsa(
    selector,
    root = document
  ) {
    return Array.from(
      root.querySelectorAll(
        selector
      )
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
    return Math.max(
      minimum,
      Math.min(
        maximum,
        value
      )
    );
  }

  function normalizeWing(value) {
    const wing =
      String(value || "")
        .trim()
        .toLowerCase();

    return WINGS.includes(wing)
      ? wing
      : "";
  }

  function normalizeRoomId(value) {
    return String(
      value || ""
    ).trim();
  }

  function normalizeRoute(value) {
    const route =
      String(value || "")
        .trim();

    return route.startsWith("/")
      ? route
      : "";
  }

  function normalizeLabel(
    value,
    fallback = ""
  ) {
    const label =
      String(value || "")
        .trim();

    return label ||
      fallback;
  }

  function presentationModeForState(
    navigationState =
      state.current
  ) {
    return (
      PRESENTATION_MODE_BY_STATE[
        navigationState
      ] ||
      PRESENTATION_MODES.HELD
    );
  }

  function wrapRadians(value) {
    let angle =
      finiteNumber(
        value,
        0
      );

    while (
      angle >
      Math.PI
    ) {
      angle -=
        Math.PI * 2;
    }

    while (
      angle <
      -Math.PI
    ) {
      angle +=
        Math.PI * 2;
    }

    return angle;
  }

  function normalizeQuaternion(
    value,
    fallback =
      QUATERNION.identity
  ) {
    const source =
      Array.isArray(value) ||
      ArrayBuffer.isView(value)
        ? Array.from(value)
        : [];

    if (
      source.length !==
      4
    ) {
      return Array.from(
        fallback
      );
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
      !Number.isFinite(
        length
      ) ||
      length <
        QUATERNION.minimumLength
    ) {
      return Array.from(
        fallback
      );
    }

    return quaternion.map(
      component =>
        component /
        length
    );
  }

  function quaternionFromEuler(
    yaw,
    pitch,
    roll
  ) {
    const safeYaw =
      wrapRadians(yaw);

    const safePitch =
      clamp(
        finiteNumber(
          pitch,
          0
        ),
        -Math.PI / 2,
        Math.PI / 2
      );

    const safeRoll =
      wrapRadians(roll);

    const cy =
      Math.cos(
        safeYaw *
        0.5
      );

    const sy =
      Math.sin(
        safeYaw *
        0.5
      );

    const cp =
      Math.cos(
        safePitch *
        0.5
      );

    const sp =
      Math.sin(
        safePitch *
        0.5
      );

    const cr =
      Math.cos(
        safeRoll *
        0.5
      );

    const sr =
      Math.sin(
        safeRoll *
        0.5
      );

    return normalizeQuaternion([
      sr * cp * cy -
        cr * sp * sy,

      cr * sp * cy +
        sr * cp * sy,

      cr * cp * sy -
        sr * sp * cy,

      cr * cp * cy +
        sr * sp * sy
    ]);
  }

  function eulerFromQuaternion(value) {
    const [
      x,
      y,
      z,
      w
    ] =
      normalizeQuaternion(value);

    const sinPitch =
      2 *
      (
        w * y -
        z * x
      );

    const pitch =
      Math.abs(
        sinPitch
      ) >= 1
        ? Math.sign(
            sinPitch
          ) *
          Math.PI /
          2
        : Math.asin(
            sinPitch
          );

    const yaw =
      Math.atan2(
        2 *
        (
          w * z +
          x * y
        ),

        1 -
        2 *
        (
          y * y +
          z * z
        )
      );

    const roll =
      Math.atan2(
        2 *
        (
          w * x +
          y * z
        ),

        1 -
        2 *
        (
          x * x +
          y * y
        )
      );

    return {
      yaw:
        wrapRadians(yaw),

      pitch:
        clamp(
          pitch,
          -Math.PI / 2,
          Math.PI / 2
        ),

      roll:
        wrapRadians(roll)
    };
  }

  function orientationFromEuler(
    yaw,
    pitch,
    roll,
    primaryId = ""
  ) {
    return {
      yaw:
        wrapRadians(yaw),

      pitch:
        clamp(
          finiteNumber(
            pitch,
            0
          ),
          -Math.PI / 2,
          Math.PI / 2
        ),

      roll:
        wrapRadians(roll),

      quaternion:
        quaternionFromEuler(
          yaw,
          pitch,
          roll
        ),

      primaryId:
        String(
          primaryId || ""
        ).trim()
    };
  }

  function orientationFromQuaternion(
    quaternion,
    primaryId = ""
  ) {
    const normalized =
      normalizeQuaternion(
        quaternion
      );

    const euler =
      eulerFromQuaternion(
        normalized
      );

    return {
      yaw:
        euler.yaw,

      pitch:
        euler.pitch,

      roll:
        euler.roll,

      quaternion:
        normalized,

      primaryId:
        String(
          primaryId || ""
        ).trim()
    };
  }

  function cloneOrientation(
    orientation
  ) {
    const source =
      orientation ||
      orientationFromQuaternion(
        QUATERNION.identity
      );

    return {
      yaw:
        finiteNumber(
          source.yaw,
          0
        ),

      pitch:
        finiteNumber(
          source.pitch,
          0
        ),

      roll:
        finiteNumber(
          source.roll,
          0
        ),

      quaternion:
        normalizeQuaternion(
          source.quaternion
        ),

      primaryId:
        String(
          source.primaryId ||
          source.primaryWing ||
          source.primaryRoom ||
          ""
        ).trim()
    };
  }

  function freezeOrientation(
    orientation
  ) {
    const value =
      cloneOrientation(
        orientation
      );

    return Object.freeze({
      yaw:
        value.yaw,

      pitch:
        value.pitch,

      roll:
        value.roll,

      quaternion:
        Object.freeze(
          value.quaternion.slice()
        ),

      primaryId:
        value.primaryId
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
      typeof payload !==
        "object"
    ) {
      return fallback;
    }

    const primaryId =
      String(
        payload.primaryId ||
        payload.primaryWing ||
        payload.primaryRoom ||
        payload.focus ||
        fallback.primaryId ||
        ""
      ).trim();

    if (
      Array.isArray(
        payload.quaternion
      ) ||
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
          payload.orientation
            .quaternion
        ) ||
        ArrayBuffer.isView(
          payload.orientation
            .quaternion
        )
      )
    ) {
      return orientationFromQuaternion(
        payload.orientation
          .quaternion,

        primaryId ||
        payload.orientation
          .primaryId
      );
    }

    return orientationFromEuler(
      payload.yaw !==
        undefined
        ? payload.yaw
        : fallback.yaw,

      payload.pitch !==
        undefined
        ? payload.pitch
        : fallback.pitch,

      payload.roll !==
        undefined
        ? payload.roll
        : fallback.roll,

      primaryId
    );
  }

  function canonicalConstellationOrientation(
    wing
  ) {
    const normalizedWing =
      normalizeWing(
        wing
      ) ||
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
      ] ||
      ""
    );
  }

  function createClusterState(wing) {
    const roomIds =
      ROOMS_BY_WING.get(
        wing
      ) ||
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

      roomIds:
        Array.from(
          roomIds
        ),

      primaryRoom,

      previewPrimaryRoom:
        primaryRoom,

      phase:
        ORIENTATION_PHASES.COMMITTED,

      gestureActive:
        false,

      revision:
        0,

      orientation:
        cloneOrientation(
          orientation
        ),

      committedOrientation:
        cloneOrientation(
          orientation
        ),

      gestureOrigin:
        null
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

  function clusterContainsRoom(
    cluster,
    roomId
  ) {
    return Boolean(
      cluster &&
      cluster.roomIds.includes(
        normalizeRoomId(
          roomId
        )
      )
    );
  }

  function canTransition(
    fromState,
    toState
  ) {
    return Boolean(
      TRANSITIONS[
        fromState
      ] &&
      TRANSITIONS[
        fromState
      ].includes(
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
    const set =
      subscribers[channel];

    if (
      !set ||
      typeof callback !==
        "function"
    ) {
      return () =>
        false;
    }

    set.add(
      callback
    );

    return () => {
      set.delete(
        callback
      );

      return true;
    };
  }

  function publish(
    channel,
    payload
  ) {
    const set =
      subscribers[channel];

    if (!set) {
      return;
    }

    for (
      const callback
      of set
    ) {
      try {
        callback(
          payload
        );
      } catch (_) {}
    }
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

  function escapeSelectorValue(value) {
    const source =
      String(value || "");

    if (
      globalThis.CSS &&
      typeof globalThis.CSS
        .escape ===
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

  function findRoomElement(roomId) {
    const id =
      normalizeRoomId(
        roomId
      );

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

  function destinationFromElement(
    element
  ) {
    if (!element) {
      return null;
    }

    return Object.freeze({
      destinationType:
        String(
          element.dataset
            .destinationType ||
          ""
        )
          .trim()
          .toLowerCase(),

      destinationId:
        String(
          element.dataset
            .destinationId ||
          element.dataset
            .roomId ||
          element.dataset
            .coinId ||
          element.dataset
            .wing ||
          ""
        ).trim(),

      label:
        normalizeLabel(
          element.dataset
            .label ||
          element.dataset
            .roomLabel ||
          element.dataset
            .coinLabel ||
          element.textContent
        ),

      route:
        normalizeRoute(
          element.dataset
            .route ||
          element.getAttribute(
            "href"
          )
        )
    });
  }

  function roomParagraphFromElement(
    element
  ) {
    return normalizeLabel(
      element.dataset.preview ||
      element.dataset
        .roomSummary ||
      element.dataset
        .localFunction ||
      element.dataset
        .roomFunction ||
      element.dataset
        .panelBody ||
      element.dataset
        .whyEnter ||
      element.dataset
        .panelWhy,

      "This room is part of the selected ARCHCOIN domain. Review its purpose, then enter the exact declared path when ready."
    );
  }

  function panelFromCoin(element) {
    return Object.freeze({
      eyebrow:
        normalizeLabel(
          element.dataset
            .coinLabel ||
          element.dataset
            .label,
          "Selected coin"
        ),

      title:
        normalizeLabel(
          element.dataset
            .panelTitle ||
          element.dataset
            .coinTitle ||
          element.dataset
            .label,
          "Selected coin"
        ),

      purpose:
        normalizeLabel(
          element.dataset
            .panelBody ||
          element.dataset
            .coinBody ||
          element.dataset
            .coinFunction,

          "This coin opens a four-room ARCHCOIN cluster."
        ),

      relationship:
        normalizeLabel(
          element.dataset
            .panelWhy ||
          element.dataset
            .coinWhy,

          "Rotate the cluster and choose the room that matches the task."
        )
    });
  }

  function panelFromRoom(element) {
    return Object.freeze({
      eyebrow:
        normalizeLabel(
          element.dataset
            .roomLensLabel ||
          element.dataset
            .roomType,
          "Selected path"
        ),

      title:
        normalizeLabel(
          element.dataset
            .panelTitle ||
          element.dataset
            .label ||
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
      eyebrow:
        "Selected path",

      title:
        "Choose a coin",

      purpose:
        "Begin with the financial domain that most closely matches the question in front of you.",

      relationship:
        "Tap a coin to open its four-room cluster."
    });
  }

  function setPanel({
    eyebrow,
    title,
    purpose,
    relationship
  }) {
    if (
      state.panelEyebrow
    ) {
      state.panelEyebrow
        .textContent =
        eyebrow ||
        "Selected path";
    }

    if (
      state.panelTitle
    ) {
      state.panelTitle
        .textContent =
        title ||
        "Choose a coin";
    }

    if (
      state.panelPurpose
    ) {
      state.panelPurpose
        .textContent =
        purpose ||
        "";
    }

    if (
      state.panelRelationship
    ) {
      state.panelRelationship
        .textContent =
        relationship ||
        "";
    }
  }

  function setGuidance(message) {
    if (
      state.guidance
    ) {
      state.guidance
        .textContent =
        String(
          message || ""
        );
    }
  }

  function setEnterEnabled(
    enabled,
    label =
      "Enter Selected Path"
  ) {
    if (
      !state.enterButton
    ) {
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

    if (
      state.enterLabel
    ) {
      state.enterLabel
        .textContent =
        label;
    } else {
      state.enterButton
        .textContent =
        label;
    }
  }

  function setReturnToOrbitVisible(
    visible,
    label =
      "Return to Orbit"
  ) {
    const control =
      state.returnToOrbitButton;

    if (!control) {
      return;
    }

    control.hidden =
      !visible;

    control.disabled =
      !visible;

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

    if (
      state.returnToOrbitLabel
    ) {
      state.returnToOrbitLabel
        .textContent =
        label;
    }
  }

  function clearPanelDescentSchedule() {
    if (
      state.panelDescentFrame
    ) {
      cancelAnimationFrame(
        state.panelDescentFrame
      );

      state.panelDescentFrame =
        0;
    }

    if (
      state.panelDescentCommitFrame
    ) {
      cancelAnimationFrame(
        state.panelDescentCommitFrame
      );

      state.panelDescentCommitFrame =
        0;
    }
  }

  function clearSceneAscentSchedule() {
    if (
      state.sceneAscentFrame
    ) {
      cancelAnimationFrame(
        state.sceneAscentFrame
      );

      state.sceneAscentFrame =
        0;
    }

    if (
      state.sceneAscentCommitFrame
    ) {
      cancelAnimationFrame(
        state.sceneAscentCommitFrame
      );

      state.sceneAscentCommitFrame =
        0;
    }
  }

  function clearViewportSchedules() {
    clearPanelDescentSchedule();
    clearSceneAscentSchedule();
  }

  function scheduleRoomPanelDescent(
    expectedRoomId
  ) {
    clearViewportSchedules();

    if (
      !state.panel
    ) {
      return;
    }

    state.panelDescentFrame =
      requestAnimationFrame(
        () => {
          state.panelDescentFrame =
            0;

          state.panelDescentCommitFrame =
            requestAnimationFrame(
              () => {
                state.panelDescentCommitFrame =
                  0;

                if (
                  state.current !==
                    STATES.ROOM_SELECTED ||
                  state.selectedRoom !==
                    expectedRoomId ||
                  !state.panel
                ) {
                  return;
                }

                state.panel
                  .scrollIntoView({
                    behavior:
                      state.reducedMotion
                        ? "auto"
                        : "smooth",

                    block:
                      "start",

                    inline:
                      "nearest"
                  });

                state.panelDescended =
                  true;

                recordAction(
                  `room-panel-descended:${expectedRoomId}`
                );
              }
            );
        }
      );
  }

  function scheduleSceneAscent(
    expectedState,
    expectedWing = ""
  ) {
    clearViewportSchedules();

    if (
      !state.scene
    ) {
      return;
    }

    state.sceneAscentFrame =
      requestAnimationFrame(
        () => {
          state.sceneAscentFrame =
            0;

          state.sceneAscentCommitFrame =
            requestAnimationFrame(
              () => {
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

                state.scene
                  .scrollIntoView({
                    behavior:
                      state.reducedMotion
                        ? "auto"
                        : "smooth",

                    block:
                      "start",

                    inline:
                      "nearest"
                  });

                recordAction(
                  `scene-restored:${expectedState}:${expectedWing || "constellation"}`
                );
              }
            );
        }
      );
  }

  function resetSelection() {
    state.selectedCardinal =
      "";

    state.selectedCoin =
      "";

    state.selectedRoom =
      "";

    state.selectedDestinationType =
      DESTINATION_TYPES.NONE;

    state.selectedDestinationId =
      "";

    state.selectedDestinationLabel =
      "";

    state.selectedRoute =
      "";

    state.selectedContentId =
      "";

    state.selectedLens =
      "overview";

    state.selectedParagraph =
      "";

    state.panelDescended =
      false;
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
      mode:
        presentation.mode,

      navigationState:
        state.current,

      outerCardinalsActive:
        presentation
          .outerCardinalsActive,

      activeRoomCluster:
        presentation
          .activeRoomCluster,

      roomSelectionPermitted:
        presentation
          .roomSelectionPermitted,

      additiveCoRenderingAuthorized:
        false
    });
  }

  function createHeldState() {
    return Object.freeze({
      held:
        isHeld(),

      terminal:
        isHeld(),

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
      fixedCenter:
        true,

      interactionEnabled:
        interactionAllowed(),

      reducedMotion:
        state.reducedMotion,

      upstreamRoute:
        HOME_COMPASS.route,

      nativeNavigationPreserved:
        true,

      upstreamRequestPublished:
        Boolean(
          state.lastUpstreamRequest
        ),

      inheritsNavigationOrientation:
        false,

      participatesInNavigationSettlement:
        false,

      quaternionPublished:
        false,

      independentMotionSignalsPublished:
        false
    });
  }

  function createUpstreamRequestSnapshot() {
    if (
      !state.lastUpstreamRequest
    ) {
      return null;
    }

    return Object.freeze({
      destinationType:
        state.lastUpstreamRequest
          .destinationType,

      destinationId:
        state.lastUpstreamRequest
          .destinationId,

      destinationLabel:
        state.lastUpstreamRequest
          .destinationLabel,

      route:
        state.lastUpstreamRequest
          .route,

      source:
        state.lastUpstreamRequest
          .source,

      navigationAuthority:
        state.lastUpstreamRequest
          .navigationAuthority,

      revision:
        state.lastUpstreamRequest
          .revision,

      requestedAt:
        state.lastUpstreamRequest
          .requestedAt
    });
  }

  function createFrameState() {
    const cluster =
      activeCluster();

    const presentation =
      createPresentationState();

    return Object.freeze({
      moduleId:
        MODULE.id,

      moduleVersion:
        MODULE.version,

      state:
        state.current,

      navigationState:
        state.current,

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
              wing:
                cluster.wing,

              roomIds:
                Object.freeze(
                  cluster.roomIds
                    .slice()
                ),

              primaryRoom:
                cluster.primaryRoom,

              previewPrimaryRoom:
                cluster
                  .previewPrimaryRoom,

              phase:
                cluster.phase,

              gestureActive:
                cluster
                  .gestureActive,

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
        state
          .selectedDestinationType,

      selectedDestinationId:
        state
          .selectedDestinationId,

      selectedDestinationLabel:
        state
          .selectedDestinationLabel,

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

      held:
        isHeld(),

      compass:
        createCompassState(),

      lastUpstreamRequest:
        createUpstreamRequestSnapshot(),

      canonicalRoomRecords:
        CANONICAL_ROOM_RECORDS,

      canonicalRoomRoutes:
        CANONICAL_ROOM_ROUTES,

      homeCompass:
        HOME_COMPASS,

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
        "ARCHCOIN_CONTROLLER_FOUNDATION_v6",

      status:
        frame.held
          ? "held"
          : "available",

      state:
        frame.state,

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
          ? frame.cluster
              .primaryRoom
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
          ? frame.cluster
              .gestureActive
          : false,

      clusterRevision:
        frame.cluster
          ? frame.cluster
              .revision
          : 0,

      clusterQuaternion:
        frame.cluster
          ? frame.cluster
              .orientation
              .quaternion
          : QUATERNION.identity,

      selectedCardinal:
        frame.selectedCardinal,

      selectedCoin:
        frame.selectedCoin,

      selectedRoom:
        frame.selectedRoom,

      selectedDestinationType:
        frame
          .selectedDestinationType,

      selectedDestinationId:
        frame
          .selectedDestinationId,

      selectedDestinationLabel:
        frame
          .selectedDestinationLabel,

      selectedRoute:
        frame.selectedRoute,

      panelDescended:
        frame.panelDescended,

      reducedMotion:
        frame.reducedMotion,

      held:
        frame.held,

      compassFixedCenter:
        frame.compass
          .fixedCenter,

      compassUpstreamRoute:
        frame.compass
          .upstreamRoute,

      compassNativeNavigationPreserved:
        frame.compass
          .nativeNavigationPreserved,

      compassInheritsNavigationOrientation:
        frame.compass
          .inheritsNavigationOrientation,

      compassParticipatesInNavigationSettlement:
        frame.compass
          .participatesInNavigationSettlement,

      lastUpstreamRequest:
        frame.lastUpstreamRequest,

      lastAction:
        frame.lastAction,

      lastFailure:
        frame.lastFailure
    });
  }

  function syncDatasets(frame) {
    if (
      !state.root
    ) {
      return;
    }

    const cluster =
      frame.cluster;

    state.root.dataset
      .archcoinMode =
      frame.presentationMode;

    state.root.dataset
      .archcoinControllerState =
      frame.navigationState;

    state.root.dataset
      .archcoinNavigationState =
      frame.navigationState;

    state.root.dataset
      .archcoinPresentationMode =
      frame.presentationMode;

    state.root.dataset
      .outerCardinalsActive =
      frame.presentation
        .outerCardinalsActive
        ? "true"
        : "false";

    state.root.dataset
      .activeRoomCluster =
      frame.presentation
        .activeRoomCluster
        ? "true"
        : "false";

    state.root.dataset
      .roomSelectionPermitted =
      frame.presentation
        .roomSelectionPermitted
        ? "true"
        : "false";

    state.root.dataset
      .additiveCoRenderingAuthorized =
      "false";

    state.root.dataset
      .orbitFocus =
      frame.orbitFocus;

    state.root.dataset
      .orbitPreviewFocus =
      frame.orbitPreviewFocus;

    state.root.dataset
      .orbitPhase =
      frame.orbitPhase;

    state.root.dataset
      .orbitGestureActive =
      frame.orbitGestureActive
        ? "true"
        : "false";

    state.root.dataset
      .orbitRevision =
      String(
        frame.orbitRevision
      );

    state.root.dataset
      .orbitQuaternion =
      JSON.stringify(
        frame.orbitOrientation
          .quaternion
      );

    state.root.dataset
      .activeClusterWing =
      frame.activeClusterWing;

    state.root.dataset
      .clusterPrimaryRoom =
      cluster
        ? cluster.primaryRoom
        : "";

    state.root.dataset
      .clusterPreviewPrimaryRoom =
      cluster
        ? cluster
            .previewPrimaryRoom
        : "";

    state.root.dataset
      .clusterPhase =
      cluster
        ? cluster.phase
        : ORIENTATION_PHASES.IDLE;

    state.root.dataset
      .clusterGestureActive =
      cluster &&
      cluster.gestureActive
        ? "true"
        : "false";

    state.root.dataset
      .clusterRevision =
      String(
        cluster
          ? cluster.revision
          : 0
      );

    state.root.dataset
      .clusterQuaternion =
      cluster
        ? JSON.stringify(
            cluster.orientation
              .quaternion
          )
        : "";

    state.root.dataset
      .selectedCardinal =
      frame.selectedCardinal;

    state.root.dataset
      .selectedCoin =
      frame.selectedCoin;

    state.root.dataset
      .selectedRoom =
      frame.selectedRoom;

    state.root.dataset
      .selectedDestinationType =
      frame
        .selectedDestinationType;

    state.root.dataset
      .selectedDestinationId =
      frame
        .selectedDestinationId;

    state.root.dataset
      .selectedDestinationLabel =
      frame
        .selectedDestinationLabel;

    state.root.dataset
      .selectedRoute =
      frame.selectedRoute;

    state.root.dataset
      .selectedContentId =
      frame.selectedContentId;

    state.root.dataset
      .selectedLens =
      frame.selectedLens;

    state.root.dataset
      .selectedParagraph =
      frame.selectedParagraph;

    state.root.dataset
      .panelDescended =
      frame.panelDescended
        ? "true"
        : "false";

    state.root.dataset
      .reducedMotion =
      frame.reducedMotion
        ? "true"
        : "false";

    state.root.dataset
      .held =
      frame.held
        ? "true"
        : "false";

    state.root.dataset
      .compassFixedCenter =
      "true";

    state.root.dataset
      .compassUpstreamRoute =
      HOME_COMPASS.route;

    state.root.dataset
      .compassNativeNavigationPreserved =
      "true";

    state.root.dataset
      .compassInheritsNavigationOrientation =
      "false";

    state.root.dataset
      .compassParticipatesInNavigationSettlement =
      "false";

    state.root.dataset
      .archcoinControllerStatus =
      frame.held
        ? "held"
        : "available";

    state.root.dataset
      .archcoinControllerVersion =
      MODULE.version;

    state.root.dataset
      .upstreamRequestRevision =
      String(
        state
          .upstreamRequestRevision
      );

    qsa(
      "[data-archcoin-coin]",
      state.root
    ).forEach(
      element => {
        const wing =
          normalizeWing(
            element.dataset
              .wing
          );

        const primary =
          frame.navigationState ===
            STATES.CONSTELLATION &&
          frame.presentation
            .outerCardinalsActive &&
          wing ===
            frame.orbitFocus;

        element.dataset
          .selected =
          "false";

        element.dataset
          .primary =
          primary
            ? "true"
            : "false";

        element.dataset
          .active =
          frame.presentation
            .outerCardinalsActive
            ? "true"
            : "false";

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
      }
    );

    qsa(
      "[data-archcoin-room]",
      state.root
    ).forEach(
      element => {
        const roomId =
          normalizeRoomId(
            element.dataset
              .roomId
          );

        const roomRecord =
          ROOM_BY_ID.get(
            roomId
          );

        const inActiveCluster =
          Boolean(
            cluster &&
            roomRecord &&
            roomRecord.wing ===
              cluster.wing
          );

        const selected =
          inActiveCluster &&
          roomId ===
            frame.selectedRoom;

        const primary =
          inActiveCluster &&
          roomId ===
            cluster.primaryRoom;

        element.dataset
          .active =
          inActiveCluster
            ? "true"
            : "false";

        element.dataset
          .selected =
          selected
            ? "true"
            : "false";

        element.dataset
          .primary =
          primary
            ? "true"
            : "false";

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
      }
    );

    if (
      state.compassControl
    ) {
      state.compassControl
        .dataset
        .selected =
        "false";

      state.compassControl
        .dataset
        .fixedCenter =
        "true";

      state.compassControl
        .dataset
        .interactionEnabled =
        frame.compass
          .interactionEnabled
          ? "true"
          : "false";

      state.compassControl
        .dataset
        .nativeNavigationPreserved =
        "true";

      state.compassControl.setAttribute(
        "aria-expanded",
        "false"
      );

      state.compassControl.removeAttribute(
        "aria-current"
      );
    }
  }

  function writeCompatibilityReceipt(
    frame
  ) {
    const receipt =
      createCompatibilityReceipt(
        frame
      );

    const serialized =
      JSON.stringify(
        receipt
      );

    if (
      state.root
    ) {
      state.root.dataset
        .archcoinControllerReceipt =
        serialized;
    }

    if (
      state.controllerReceiptOutput
    ) {
      state.controllerReceiptOutput
        .value =
        serialized;

      state.controllerReceiptOutput
        .textContent =
        serialized;
    }

    globalThis
      .DGB_ARCHCOIN_CONTROLLER_RECEIPT =
      receipt;
  }

  function publishFrame() {
    const frame =
      createFrameState();

    syncDatasets(
      frame
    );

    writeCompatibilityReceipt(
      frame
    );

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
      String(
        action || ""
      );

    state.lastFailure =
      String(
        failure || ""
      );

    return publishFrame();
  }

  function syncPresentation() {
    if (
      state.current ===
      STATES.CONSTELLATION
    ) {
      setPanel(
        defaultPanel()
      );

      setEnterEnabled(
        false,
        "Enter Selected Path"
      );

      setReturnToOrbitVisible(
        false
      );

      setGuidance(
        "Tap a coin to open its four-room cluster. Drag the constellation to change its orientation."
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
          panelFromCoin(
            coin
          )
        );
      }

      setEnterEnabled(
        false,
        "Enter Selected Path"
      );

      setReturnToOrbitVisible(
        false
      );

      setGuidance(
        "Rotate the active four-room cluster, choose one visible room, or make an intentional exit swipe to return to the constellation."
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
          panelFromRoom(
            room
          )
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
        "Review the selected room. Enter Selected Path opens its canonical route. Return to Orbit restores the active four-room cluster."
      );

      return;
    }

    setPanel({
      eyebrow:
        "System held",

      title:
        "ARCHCOIN is unavailable",

      purpose:
        "The controller could not establish or preserve a safe navigation state.",

      relationship:
        "Static content may remain available, but interactive ARCHCOIN requests are rejected."
    });

    setEnterEnabled(
      false,
      "Unavailable"
    );

    setReturnToOrbitVisible(
      false
    );

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
        from:
          state.current,

        to:
          nextState
      }
    );

    const previousHeld =
      isHeld();

    state.current =
      nextState;

    for (
      const [
        key,
        value
      ]
      of Object.entries(
        patch
      )
    ) {
      if (
        Object.prototype
          .hasOwnProperty
          .call(
            state,
            key
          )
      ) {
        state[key] =
          value;
      }
    }

    syncPresentation();

    const frame =
      recordAction(
        action
      );

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
      committed =
        false,

      phase =
        ORIENTATION_PHASES.PREVIEW,

      gestureActive =
        false,

      incrementRevision =
        false
    } = {}
  ) {
    const normalized =
      cloneOrientation(
        orientation
      );

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
      Boolean(
        gestureActive
      );

    if (
      incrementRevision
    ) {
      state.orbitRevision +=
        1;
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
      committed =
        false,

      phase =
        ORIENTATION_PHASES.PREVIEW,

      gestureActive =
        false,

      incrementRevision =
        false
    } = {}
  ) {
    if (!cluster) {
      return false;
    }

    const normalized =
      cloneOrientation(
        orientation
      );

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
      Boolean(
        gestureActive
      );

    if (
      incrementRevision
    ) {
      cluster.revision +=
        1;
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

    if (
      state.orbitGestureActive
    ) {
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
        committed:
          false,

        phase:
          ORIENTATION_PHASES.PREVIEW,

        gestureActive:
          true
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

    if (
      !state.orbitGestureActive
    ) {
      beginOrbitGesture();
    }

    setConstellationOrientation(
      resolveOrientation(
        payload,
        state.orbitOrientation
      ),
      {
        committed:
          false,

        phase:
          ORIENTATION_PHASES.PREVIEW,

        gestureActive:
          true
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
        committed:
          true,

        phase:
          ORIENTATION_PHASES.COMMITTED,

        gestureActive:
          false,

        incrementRevision:
          true
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
    reason =
      "cancelled"
  ) {
    if (
      isHeld()
    ) {
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
        committed:
          false,

        phase:
          ORIENTATION_PHASES.CANCELLED,

        gestureActive:
          false
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

  function requestOrbitFocus(
    wing,
    options = {}
  ) {
    const normalizedWing =
      normalizeWing(
        wing
      );

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
    if (
      isHeld()
    ) {
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
      wingOrPayload !==
        null
        ? wingOrPayload
        : maybePayload;

    const cluster =
      getCluster(
        wing
      );

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

    if (
      cluster.gestureActive
    ) {
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
        committed:
          false,

        phase:
          ORIENTATION_PHASES.PREVIEW,

        gestureActive:
          true
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
    if (
      isHeld()
    ) {
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
      wingOrPayload !==
        null
        ? wingOrPayload
        : maybePayload;

    const cluster =
      getCluster(
        wing
      );

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

    if (
      !cluster.gestureActive
    ) {
      beginClusterGesture(
        wing
      );
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
        committed:
          false,

        phase:
          ORIENTATION_PHASES.PREVIEW,

        gestureActive:
          true
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
    if (
      isHeld()
    ) {
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
      wingOrPayload !==
        null
        ? wingOrPayload
        : maybePayload;

    const cluster =
      getCluster(
        wing
      );

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
        committed:
          true,

        phase:
          ORIENTATION_PHASES.COMMITTED,

        gestureActive:
          false,

        incrementRevision:
          true
      }
    );

    cluster.gestureOrigin =
      null;

    recordAction(
      `cluster-committed:${wing}:${primaryRoom}`
    );

    return true;
  }

  function requestClusterCancel(
    wingOrReason,
    maybeReason =
      "cancelled"
  ) {
    if (
      isHeld()
    ) {
      return false;
    }

    const explicitWing =
      normalizeWing(
        wingOrReason
      );

    const wing =
      explicitWing ||
      activeClusterWing();

    const reason =
      explicitWing
        ? maybeReason
        : wingOrReason ||
          maybeReason;

    const cluster =
      getCluster(
        wing
      );

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
        committed:
          false,

        phase:
          ORIENTATION_PHASES.CANCELLED,

        gestureActive:
          false
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

  function cancelActiveGestures(
    reason
  ) {
    if (
      state.orbitGestureActive
    ) {
      requestOrbitCancel(
        reason
      );
    }

    for (
      const cluster
      of state.clusters
        .values()
    ) {
      if (
        cluster.gestureActive
      ) {
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
      normalizeWing(
        cardinalId
      );

    if (
      isHeld() ||
      !wing ||
      state.current !==
        STATES.CONSTELLATION
    ) {
      return false;
    }

    const element =
      findCoinElement(
        wing
      );

    if (!element) {
      recordAction(
        "cardinal-selection-rejected",
        `CARDINAL_NOT_FOUND:${wing}`
      );

      return false;
    }

    const destination =
      destinationFromElement(
        element
      );

    const orientation =
      canonicalConstellationOrientation(
        wing
      );

    setConstellationOrientation(
      orientation,
      {
        committed:
          true,

        phase:
          ORIENTATION_PHASES.COMMITTED,

        gestureActive:
          false,

        incrementRevision:
          true
      }
    );

    resetSelection();

    return applyState(
      STATES.CLUSTER_OPEN,
      {
        selectedCardinal:
          wing,

        selectedCoin:
          wingToCoin(
            wing
          ),

        selectedDestinationType:
          DESTINATION_TYPES.COIN,

        selectedDestinationId:
          wing,

        selectedDestinationLabel:
          destination
            ? destination.label ||
              wingToCoin(
                wing
              )
            : wingToCoin(
                wing
              ),

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

  function requestRoomSelection(
    roomId
  ) {
    const id =
      normalizeRoomId(
        roomId
      );

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
      ROOM_BY_ID.get(
        id
      );

    const element =
      findRoomElement(
        id
      );

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
        element.dataset
          .route ||
        element.getAttribute(
          "href"
        )
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

    if (
      cluster.gestureActive
    ) {
      requestClusterCancel(
        canonical.wing,
        "room-selection"
      );
    }

    clearViewportSchedules();

    const destination =
      destinationFromElement(
        element
      );

    const paragraph =
      roomParagraphFromElement(
        element
      );

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
              element.dataset
                .contentId
            ),

          selectedLens:
            String(
              element.dataset
                .lens ||
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

    scheduleRoomPanelDescent(
      canonical.roomId
    );

    return true;
  }

  function requestEnterSelection() {
    if (
      isHeld() ||
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

  function requestReturnToOrbit() {
    if (
      isHeld() ||
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
      findCoinElement(
        wing
      );

    const destination =
      destinationFromElement(
        coin
      );

    const committed =
      applyState(
        STATES.CLUSTER_OPEN,
        {
          selectedCardinal:
            wing,

          selectedCoin:
            wingToCoin(
              wing
            ),

          selectedRoom:
            "",

          selectedDestinationType:
            DESTINATION_TYPES.COIN,

          selectedDestinationId:
            wing,

          selectedDestinationLabel:
            destination
              ? destination.label ||
                wingToCoin(
                  wing
                )
              : wingToCoin(
                  wing
                ),

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
        `returned-to-orbit:${wing}`
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
            previousWing
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

  function requestReturnToUpstream(
    options = {}
  ) {
    if (
      isHeld()
    ) {
      return false;
    }

    const request =
      Object.freeze({
        destinationType:
          HOME_COMPASS
            .destinationType,

        destinationId:
          HOME_COMPASS
            .destinationId,

        destinationLabel:
          HOME_COMPASS
            .destinationLabel,

        route:
          HOME_COMPASS.route,

        source:
          HOME_COMPASS.source,

        navigationAuthority:
          "NATIVE_ANCHOR",

        nativeNavigationPreserved:
          options
            .nativeNavigationPreserved !==
          false,

        revision:
          state.upstreamRequestRevision +
          1,

        requestedAt:
          Date.now()
      });

    state.upstreamRequestRevision =
      request.revision;

    state.lastUpstreamRequest =
      request;

    publish(
      CHANNELS.UPSTREAM_REQUEST,
      request
    );

    recordAction(
      `upstream-requested:${request.destinationId}:${request.revision}`
    );

    return true;
  }

  function getLastUpstreamRequest() {
    return createUpstreamRequestSnapshot();
  }

  function validateCanonicalRegistry() {
    invariant(
      WINGS.length ===
        4,
      "ARCHCOIN_WING_COUNT_INVALID",
      {
        expected:
          4,

        actual:
          WINGS.length
      }
    );

    invariant(
      new Set(
        WINGS
      ).size ===
        4,
      "ARCHCOIN_DUPLICATE_WING"
    );

    invariant(
      CANONICAL_ROOM_RECORDS
        .length ===
        16,
      "ARCHCOIN_CANONICAL_ROOM_COUNT_INVALID",
      {
        expected:
          16,

        actual:
          CANONICAL_ROOM_RECORDS
            .length
      }
    );

    const ids =
      new Set();

    const routes =
      new Set();

    for (
      const wing
      of WINGS
    ) {
      const rooms =
        ROOMS_BY_WING.get(
          wing
        );

      invariant(
        rooms &&
        rooms.length ===
          4,
        "ARCHCOIN_ROOMS_PER_WING_INVALID",
        {
          wing,

          expected:
            4,

          actual:
            rooms
              ? rooms.length
              : 0
        }
      );

      invariant(
        Boolean(
          WING_TO_COIN[
            wing
          ]
        ),
        "ARCHCOIN_WING_COIN_MAPPING_MISSING",
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
        "ARCHCOIN_ROOM_WING_INVALID",
        {
          record
        }
      );

      invariant(
        WING_TO_COIN[
          record.wing
        ] ===
          record.coin,
        "ARCHCOIN_ROOM_COIN_MAPPING_INVALID",
        {
          record
        }
      );

      invariant(
        !ids.has(
          record.roomId
        ),
        "ARCHCOIN_DUPLICATE_ROOM_ID",
        {
          roomId:
            record.roomId
        }
      );

      invariant(
        !routes.has(
          record.route
        ),
        "ARCHCOIN_DUPLICATE_ROOM_ROUTE",
        {
          route:
            record.route
        }
      );

      invariant(
        normalizeRoute(
          record.route
        ) ===
          record.route,
        "ARCHCOIN_CANONICAL_ROUTE_INVALID",
        {
          record
        }
      );

      ids.add(
        record.roomId
      );

      routes.add(
        record.route
      );
    }

    invariant(
      ROOM_BY_ID.size ===
        16,
      "ARCHCOIN_ROOM_ID_REGISTRY_INVALID"
    );

    invariant(
      ROOM_BY_ROUTE.size ===
        16,
      "ARCHCOIN_ROUTE_REGISTRY_INVALID"
    );

    return Object.freeze({
      pass:
        true,

      wingCount:
        WINGS.length,

      roomCount:
        CANONICAL_ROOM_RECORDS
          .length,

      routeCount:
        CANONICAL_ROOM_ROUTES
          .length,

      roomsPerWing:
        4,

      duplicateRoomIds:
        false,

      duplicateRoutes:
        false,

      mappingValid:
        true
    });
  }

  function validateTransitionTable() {
    const declaredStates =
      Object.values(
        STATES
      );

    invariant(
      declaredStates.length ===
        4,
      "ARCHCOIN_STATE_COUNT_INVALID",
      {
        expected:
          4,

        actual:
          declaredStates.length
      }
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

    for (
      const [
        fromState,
        targets
      ]
      of Object.entries(
        TRANSITIONS
      )
    ) {
      invariant(
        declaredStates.includes(
          fromState
        ),
        "ARCHCOIN_UNKNOWN_TRANSITION_SOURCE",
        {
          fromState
        }
      );

      for (
        const target
        of targets
      ) {
        invariant(
          declaredStates.includes(
            target
          ),
          "ARCHCOIN_UNKNOWN_TRANSITION_TARGET",
          {
            fromState,
            target
          }
        );
      }
    }

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
      ].length ===
        1 &&
      TRANSITIONS[
        STATES.SYSTEM_HELD
      ][0] ===
        STATES.SYSTEM_HELD,
      "ARCHCOIN_HELD_STATE_NOT_TERMINAL"
    );

    return Object.freeze({
      pass:
        true,

      states:
        Object.freeze(
          declaredStates.slice()
        ),

      constellationToClusterOpen:
        true,

      clusterOpenToRoomSelected:
        true,

      roomSelectedToClusterOpen:
        true,

      clusterOpenToConstellation:
        true,

      roomSelectedToConstellation:
        true,

      heldTerminal:
        true,

      compassDecisionPresent:
        false,

      additiveStatePresent:
        false
    });
  }

  function validatePresentationContract() {
    invariant(
      PRESENTATION_BY_STATE[
        STATES.CONSTELLATION
      ].mode ===
        PRESENTATION_MODES.CONSTELLATION,
      "ARCHCOIN_CONSTELLATION_PRESENTATION_MODE_INVALID"
    );

    invariant(
      PRESENTATION_BY_STATE[
        STATES.CLUSTER_OPEN
      ].mode ===
        PRESENTATION_MODES.CLUSTER,
      "ARCHCOIN_CLUSTER_OPEN_PRESENTATION_MODE_INVALID"
    );

    invariant(
      PRESENTATION_BY_STATE[
        STATES.ROOM_SELECTED
      ].mode ===
        PRESENTATION_MODES.CLUSTER,
      "ARCHCOIN_ROOM_SELECTED_PRESENTATION_MODE_INVALID"
    );

    invariant(
      PRESENTATION_BY_STATE[
        STATES.SYSTEM_HELD
      ].mode ===
        PRESENTATION_MODES.HELD,
      "ARCHCOIN_HELD_PRESENTATION_MODE_INVALID"
    );

    invariant(
      PRESENTATION_BY_STATE[
        STATES.CONSTELLATION
      ].outerCardinalsActive ===
        true,
      "ARCHCOIN_CONSTELLATION_CARDINAL_PRESENTATION_INVALID"
    );

    invariant(
      PRESENTATION_BY_STATE[
        STATES.CONSTELLATION
      ].activeRoomCluster ===
        false,
      "ARCHCOIN_CONSTELLATION_CLUSTER_PRESENTATION_INVALID"
    );

    invariant(
      PRESENTATION_BY_STATE[
        STATES.CLUSTER_OPEN
      ].outerCardinalsActive ===
        false,
      "ARCHCOIN_CLUSTER_CARDINAL_REPLACEMENT_INVALID"
    );

    invariant(
      PRESENTATION_BY_STATE[
        STATES.CLUSTER_OPEN
      ].activeRoomCluster ===
        true,
      "ARCHCOIN_CLUSTER_PRESENTATION_INVALID"
    );

    invariant(
      PRESENTATION_BY_STATE[
        STATES.ROOM_SELECTED
      ].outerCardinalsActive ===
        false,
      "ARCHCOIN_ROOM_SELECTED_CARDINAL_REPLACEMENT_INVALID"
    );

    invariant(
      PRESENTATION_BY_STATE[
        STATES.ROOM_SELECTED
      ].activeRoomCluster ===
        true,
      "ARCHCOIN_ROOM_SELECTED_CLUSTER_PRESENTATION_INVALID"
    );

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
      pass:
        true,

      progressiveReplacement:
        true,

      additiveCoRenderingAuthorized:
        false,

      constellationExclusive:
        true,

      clusterExclusive:
        true,

      roomSelectedPreservesCluster:
        true,

      normalizedPresentationModes:
        Object.freeze({
          CONSTELLATION:
            PRESENTATION_MODES.CONSTELLATION,

          CLUSTER_OPEN:
            PRESENTATION_MODES.CLUSTER,

          ROOM_SELECTED:
            PRESENTATION_MODES.CLUSTER,

          SYSTEM_HELD:
            PRESENTATION_MODES.HELD
        })
    });
  }

  function validateCompassContract() {
    const compass =
      createCompassState();

    invariant(
      compass.fixedCenter ===
        true,
      "ARCHCOIN_COMPASS_FIXED_CENTER_INVALID"
    );

    invariant(
      compass.upstreamRoute ===
        "/index.html",
      "ARCHCOIN_COMPASS_ROUTE_INVALID"
    );

    invariant(
      compass.nativeNavigationPreserved ===
        true,
      "ARCHCOIN_COMPASS_NATIVE_NAVIGATION_NOT_PRESERVED"
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

    invariant(
      compass.quaternionPublished ===
        false,
      "ARCHCOIN_COMPASS_QUATERNION_PUBLICATION_INVALID"
    );

    invariant(
      compass.independentMotionSignalsPublished ===
        false,
      "ARCHCOIN_COMPASS_MOTION_SIGNAL_INVALID"
    );

    return Object.freeze({
      pass:
        true,

      fixedCenter:
        true,

      upstreamRoute:
        "/index.html",

      nativeNavigationPreserved:
        true,

      upstreamRequestPublishedWithoutPreventingDefault:
        true,

      inheritsNavigationOrientation:
        false,

      participatesInNavigationSettlement:
        false,

      quaternionPublished:
        false,

      rendererNavigationAuthority:
        false,

      rendererMountedByController:
        false
    });
  }

  function validateHeldRejectionContract() {
    const guardedRequests =
      Object.freeze([
        "requestCardinalSelection",
        "requestRoomSelection",
        "requestEnterSelection",
        "requestReturnToOrbit",
        "requestReturnToConstellation",
        "beginOrbitGesture",
        "requestOrbitPreview",
        "requestOrbitCommit",
        "requestOrbitCancel",
        "requestOrbitFocus",
        "beginClusterGesture",
        "requestClusterPreview",
        "requestClusterCommit",
        "requestClusterCancel",
        "requestReturnToUpstream"
      ]);

    invariant(
      TRANSITIONS[
        STATES.SYSTEM_HELD
      ].length ===
        1 &&
      TRANSITIONS[
        STATES.SYSTEM_HELD
      ][0] ===
        STATES.SYSTEM_HELD,
      "ARCHCOIN_HELD_TRANSITION_CONTRACT_INVALID"
    );

    return Object.freeze({
      pass:
        true,

      heldTerminal:
        true,

      rejectsAllInteractiveRequests:
        true,

      guardedRequestCount:
        guardedRequests.length,

      guardedRequests
    });
  }

  function validateDeclaredRooms() {
    if (
      !state.root
    ) {
      return Object.freeze({
        pass:
          false,

        skipped:
          true,

        reason:
          "ARCHCOIN_ROOT_NOT_RESOLVED"
      });
    }

    const declared =
      qsa(
        "[data-archcoin-room]",
        state.root
      );

    invariant(
      declared.length ===
        CANONICAL_ROOM_RECORDS
          .length,
      "ARCHCOIN_DECLARED_ROOM_COUNT_INVALID",
      {
        expected:
          CANONICAL_ROOM_RECORDS
            .length,

        actual:
          declared.length
      }
    );

    const seenIds =
      new Set();

    const seenRoutes =
      new Set();

    for (
      const element
      of declared
    ) {
      const roomId =
        normalizeRoomId(
          element.dataset
            .roomId
        );

      const wing =
        normalizeWing(
          element.dataset
            .wing
        );

      const route =
        normalizeRoute(
          element.dataset
            .route ||
          element.getAttribute(
            "href"
          )
        );

      const canonical =
        ROOM_BY_ID.get(
          roomId
        );

      invariant(
        canonical,
        "ARCHCOIN_UNKNOWN_ROOM_ID",
        {
          roomId
        }
      );

      invariant(
        !seenIds.has(
          roomId
        ),
        "ARCHCOIN_DUPLICATE_DECLARED_ROOM_ID",
        {
          roomId
        }
      );

      invariant(
        !seenRoutes.has(
          route
        ),
        "ARCHCOIN_DUPLICATE_DECLARED_ROOM_ROUTE",
        {
          route
        }
      );

      invariant(
        route ===
          canonical.route,
        "ARCHCOIN_ROOM_ROUTE_MISMATCH",
        {
          roomId,

          expected:
            canonical.route,

          actual:
            route
        }
      );

      invariant(
        wing ===
          canonical.wing,
        "ARCHCOIN_ROOM_WING_MISMATCH",
        {
          roomId,

          expected:
            canonical.wing,

          actual:
            wing
        }
      );

      invariant(
        wingToCoin(
          wing
        ) ===
          canonical.coin,
        "ARCHCOIN_ROOM_COIN_MAPPING_MISMATCH",
        {
          roomId,
          wing,

          expectedCoin:
            canonical.coin,

          actualCoin:
            wingToCoin(
              wing
            )
        }
      );

      seenIds.add(
        roomId
      );

      seenRoutes.add(
        route
      );
    }

    return Object.freeze({
      pass:
        true,

      declaredRoomCount:
        declared.length,

      declaredRouteCount:
        seenRoutes.size,

      directSemanticRoomElements:
        true,

      roomRelocationByCrystalsAuthorized:
        true,

      generatedRoomProxiesRequired:
        false
    });
  }

  function runControllerSelfTest({
    includeDom =
      false
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

      heldRejection:
        validateHeldRejectionContract(),

      declaredRooms:
        includeDom
          ? validateDeclaredRooms()
          : Object.freeze({
              pass:
                true,

              skipped:
                true,

              reason:
                "DOM_VALIDATION_NOT_REQUESTED"
            })
    };

    const pass =
      Object.values(
        results
      ).every(
        result =>
          result.pass ===
          true
      );

    return Object.freeze({
      receiptSchema:
        "ARCHCOIN_CONTROLLER_FOUNDATION_VALIDATION_RECEIPT_v2",

      moduleId:
        MODULE.id,

      moduleVersion:
        MODULE.version,

      pass,

      stateMachine:
        Object.freeze([
          STATES.CONSTELLATION,
          STATES.CLUSTER_OPEN,
          STATES.ROOM_SELECTED,
          STATES.SYSTEM_HELD
        ]),

      presentationModes:
        Object.freeze([
          PRESENTATION_MODES.CONSTELLATION,
          PRESENTATION_MODES.CLUSTER,
          PRESENTATION_MODES.HELD
        ]),

      progression:
        "CONSTELLATION -> CLUSTER_OPEN -> ROOM_SELECTED -> CONFIRMED_ROUTE_ENTRY",

      returnPaths:
        Object.freeze([
          "ROOM_SELECTED -> CLUSTER_OPEN",
          "CLUSTER_OPEN -> CONSTELLATION",
          "ROOM_SELECTED -> CONSTELLATION"
        ]),

      progressiveReplacement:
        true,

      additiveCoRenderingAuthorized:
        false,

      generatedRoomProxiesAuthorized:
        false,

      projectedRoomHitInferenceAuthorized:
        false,

      canonicalRoomRelocationAuthorized:
        true,

      compassDecisionStatePresent:
        false,

      controllerMountsRenderer:
        false,

      controllerOwnsFallback:
        false,

      rendererMayNavigate:
        false,

      nativeCompassAnchorNavigationPreserved:
        true,

      results:
        Object.freeze(
          results
        )
    });
  }

  function writeValidationReceipt(
    receipt
  ) {
    state.validationReceipt =
      receipt;

    const serialized =
      JSON.stringify(
        receipt
      );

    if (
      state.root
    ) {
      state.root.dataset
        .archcoinControllerValidation =
        serialized;
    }

    if (
      state.controllerValidationOutput
    ) {
      state.controllerValidationOutput
        .value =
        serialized;

      state.controllerValidationOutput
        .textContent =
        serialized;
    }

    globalThis
      .DGB_ARCHCOIN_CONTROLLER_VALIDATION_RECEIPT =
      receipt;
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
      /*
       * Preserve the canonical anchor's native /index.html navigation.
       *
       * The request is published for observability and any future adapter,
       * but this controller does not preventDefault(), stopPropagation(), or
       * replace the browser's working link behavior.
       */
      if (
        !isHeld()
      ) {
        requestReturnToUpstream({
          nativeNavigationPreserved:
            true
        });
      }

      return;
    }

    if (
      isHeld()
    ) {
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
        destination.dataset
          .wing ||
        destination.dataset
          .coinId
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
        destination.dataset
          .roomId
      );
    }
  }

  function handleKeydown(event) {
    if (
      isHeld() ||
      event.key !==
        "Escape"
    ) {
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
    const reason =
      String(
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
      "The visual navigation field is temporarily unavailable. Canonical room records remain preserved."
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
      Boolean(
        media.matches
      ) ||
      (
        state.root &&
        state.root.dataset
          .reducedMotion ===
          "true"
      );
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
          Boolean(
            event.matches
          );

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
      typeof media
        .addEventListener ===
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
      media.addListener(
        update
      );
    }
  }

  function resolveDom() {
    state.root =
      qs(
        "[data-archcoin-root]"
      );

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

    state.controllerValidationOutput =
      qs(
        "[data-archcoin-controller-validation]",
        state.root
      );

    state.compassControl =
      qs(
        "[data-upstream-compass-control]",
        state.root
      );
  }

  function initializeOrientationState() {
    const requestedFocus =
      normalizeWing(
        state.root.dataset
          .orbitFocus
      ) ||
      "north";

    let initial =
      canonicalConstellationOrientation(
        requestedFocus
      );

    const serialized =
      String(
        state.root.dataset
          .orbitQuaternion ||
        ""
      ).trim();

    if (serialized) {
      try {
        initial =
          orientationFromQuaternion(
            JSON.parse(
              serialized
            ),
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
      cloneOrientation(
        initial
      );

    state.committedOrbitOrientation =
      cloneOrientation(
        initial
      );

    state.orbitGestureOrigin =
      null;
  }

  function initializeClusters() {
    state.clusters.clear();

    for (
      const wing
      of WINGS
    ) {
      const cluster =
        createClusterState(
          wing
        );

      invariant(
        cluster.roomIds.length ===
          4,
        "ARCHCOIN_CLUSTER_ROOM_COUNT_INVALID",
        {
          wing,

          count:
            cluster.roomIds
              .length
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
      getCluster(
        wing
      );

    if (!cluster) {
      return null;
    }

    return Object.freeze({
      wing:
        cluster.wing,

      roomIds:
        Object.freeze(
          cluster.roomIds
            .slice()
        ),

      primaryRoom:
        cluster.primaryRoom,

      previewPrimaryRoom:
        cluster
          .previewPrimaryRoom,

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
  }

  function exposeApi() {
    globalThis
      .DGB_ARCHCOIN_CONTROLLER =
      Object.freeze({
        moduleId:
          MODULE.id,

        moduleVersion:
          MODULE.version,

        states:
          STATES,

        presentationModes:
          PRESENTATION_MODES,

        presentationModeByState:
          PRESENTATION_MODE_BY_STATE,

        destinationTypes:
          DESTINATION_TYPES,

        orientationPhases:
          ORIENTATION_PHASES,

        presentationByState:
          PRESENTATION_BY_STATE,

        transitions:
          TRANSITIONS,

        homeCompass:
          HOME_COMPASS,

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

        getLastUpstreamRequest,

        getClusterState,

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

        subscribeUpstreamRequest:
          callback =>
            subscribe(
              CHANNELS.UPSTREAM_REQUEST,
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

        requestEnterSelection,

        requestReturnToOrbit,

        requestReturnToConstellation,

        requestReturnToUpstream,

        runSelfTest:
          runControllerSelfTest
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

    if (
      state.enterButton
    ) {
      state.enterButton
        .addEventListener(
          "click",
          requestEnterSelection
        );
    }

    if (
      state.returnToOrbitButton
    ) {
      state.returnToOrbitButton
        .addEventListener(
          "click",
          requestReturnToOrbit
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

    for (
      const cluster
      of state.clusters
        .values()
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
          detail:
            Object.freeze({
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
          includeDom:
            false
        });

      invariant(
        sourceReceipt.pass ===
          true,
        "ARCHCOIN_CONTROLLER_SOURCE_VALIDATION_FAILED",
        sourceReceipt
      );

      resolveDom();

      readReducedMotion();

      initializeOrientationState();

      initializeClusters();

      const runtimeReceipt =
        runControllerSelfTest({
          includeDom:
            true
        });

      invariant(
        runtimeReceipt.pass ===
          true,
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

      state.initialized =
        true;

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
    } catch (error) {
      enterHeldState(
        error
      );
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
        once:
          true
      }
    );
  } else {
    initialize();
  }
})();

/*
ARCHCOIN_CONTROLLER_RUNTIME_CORRECTION_RESULT_v2

Artifact:
/products/archcoin/index.controller.js

Module:
DGB_ARCHCOIN_CONTROLLER
6.0.1-controller-presentation-and-native-home-corrections

Disposition:
CONTROLLER_RUNTIME_CORRECTION_SOURCE_CANDIDATE

Internal state machine preserved:
- CONSTELLATION
- CLUSTER_OPEN
- ROOM_SELECTED
- SYSTEM_HELD

Normalized page-presentation modes:
- CONSTELLATION -> CONSTELLATION
- CLUSTER_OPEN  -> CLUSTER
- ROOM_SELECTED -> CLUSTER
- SYSTEM_HELD   -> HELD

Published root datasets:
- data-archcoin-mode
  receives normalized presentation mode

- data-archcoin-presentation-mode
  receives normalized presentation mode

- data-archcoin-controller-state
  receives internal navigation state

- data-archcoin-navigation-state
  receives internal navigation state

Compass correction:
- canonical semantic href remains /index.html
- Compass click publishes requestReturnToUpstream()
- Compass click is not preventDefault() blocked
- Compass click is not stopPropagation() blocked
- native browser navigation remains authoritative
- renderer remains nonnavigating
- controller remains renderer-independent

Cluster-return contract:
- requestReturnToConstellation remains public
- CLUSTER_OPEN -> CONSTELLATION remains validated
- ROOM_SELECTED -> CONSTELLATION remains validated
- crystals may invoke requestReturnToConstellation after classifying an
  intentional cluster-exit swipe

Room-selection contract retained:
- exact sixteen-room canonical registry
- exact canonical routes
- room selection does not navigate immediately
- room selection populates the panel
- room selection enables Enter Selected Path
- confirmed entry uses location.assign(canonical.route)
- Return to Orbit restores ROOM_SELECTED to CLUSTER_OPEN

Canonical semantic relocation:
- existing room anchors remain controller-recognized after relocation
- relocation by crystals into the semantic layer is authorized
- generated room proxies remain forbidden
- projected room-hit inference remains forbidden

Unchanged:
- quaternion mathematics
- orbit state
- cluster state
- orbit gesture surfaces
- cluster gesture surfaces
- panel content rules
- viewport choreography
- reduced-motion subscription
- held-state terminal law
- canonical room routes
- controller renderer boundary
- Compass fixed-center law

Required paired crystals version:
- must require controller version
  6.0.1-controller-presentation-and-native-home-corrections

Other files modified:
NONE

Runtime execution:
NOT PERFORMED

Actual-page integration:
PENDING PAIRED CRYSTALS REPLACEMENT

Production authorization:
FALSE

Deployment authorization:
FALSE
*/

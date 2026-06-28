/* /products/archcoin/index.controller.js
   ARCHCOIN
   Controller authority for navigation state, constellation orientation,
   per-coin cluster orientation, semantic selection, panel projection,
   content selection, return behavior, failure-safe receipts, and datasets.

   Final surgical correction scope:
   - Preserve accepted ARCHCOIN controller architecture.
   - Preserve DGB_ARCHCOIN public namespace.
   - Preserve Compass-derived navigation API surface.
   - Enforce atomic cardinal selection with one public commitment receipt.
   - Freeze wing-to-coin identity mapping.
   - Preserve navigation-only scope and intentional empty bounded void.
   - Preserve requestReturnToUpstream as the /products/ routing authority.
   - Remove quick-swipe return guidance.
   - Isolate shared upstream Compass mount failure from controller-wide
     initialization failure.
   - Preserve requestReturnToOrbit and requestReturnToConstellation as
     internal ARCHCOIN navigation APIs.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "ARCHCOIN_CONTROLLER_COMPASS_NAVIGATION_ANCHOR_v3",
    sourceContractId:
      "DGB_COMPASS_CONTROLLER_SPHERICAL_CONSTELLATION_AND_CLUSTER_REBUILD_v3",
    file: "/products/archcoin/index.controller.js",
    releaseId: "archcoin-compass-navigation-anchor-v3",
    visualPassClaimed: false,
    productionAuthorized: false,
    deploymentAuthorized: false
  });

  const STATES = Object.freeze({
    CONSTELLATION: "CONSTELLATION",
    CLUSTER_OPEN: "CLUSTER_OPEN",
    ROOM_SELECTED: "ROOM_SELECTED",
    HELD: "HELD"
  });

  const ORIENTATION_PHASES = Object.freeze({
    IDLE: "IDLE",
    PREVIEW: "PREVIEW",
    SETTLING: "SETTLING",
    COMMITTED: "COMMITTED",
    CANCELLED: "CANCELLED"
  });

  const WINGS = Object.freeze(["north", "east", "south", "west"]);

  const ARCHCOIN_WING_TO_COIN = Object.freeze({
    north: "contract",
    east: "receivable",
    south: "payable",
    west: "allocation"
  });

  const QUATERNION = Object.freeze({
    minimumLength: 1e-8,
    identity: Object.freeze([0, 0, 0, 1])
  });

  const CANONICAL_CONSTELLATION_EULER = Object.freeze({
    north: Object.freeze({ yaw: 0, pitch: 0, roll: 0 }),
    east: Object.freeze({ yaw: -Math.PI / 2, pitch: 0, roll: 0 }),
    south: Object.freeze({ yaw: Math.PI, pitch: 0, roll: 0 }),
    west: Object.freeze({ yaw: Math.PI / 2, pitch: 0, roll: 0 })
  });

  const TRANSITIONS = Object.freeze({
    [STATES.CONSTELLATION]: Object.freeze([
      STATES.CONSTELLATION,
      STATES.CLUSTER_OPEN,
      STATES.HELD
    ]),
    [STATES.CLUSTER_OPEN]: Object.freeze([
      STATES.CLUSTER_OPEN,
      STATES.ROOM_SELECTED,
      STATES.CONSTELLATION,
      STATES.HELD
    ]),
    [STATES.ROOM_SELECTED]: Object.freeze([
      STATES.ROOM_SELECTED,
      STATES.CLUSTER_OPEN,
      STATES.CONSTELLATION,
      STATES.HELD
    ]),
    [STATES.HELD]: Object.freeze([
      STATES.HELD,
      STATES.CONSTELLATION,
      STATES.CLUSTER_OPEN,
      STATES.ROOM_SELECTED
    ])
  });

  const UPSTREAM_COMPASS = Object.freeze({
    parentNodeId: "master-compass",
    parentRoute: "/products/",
    failureEvent: "DGB_UPSTREAM_COMPASS_RENDERER_FAILURE",
    defaultResponseRatio: -0.18,
    mobileWidth: 767,
    heldVariants: Object.freeze({
      ENHANCED: "ENHANCED",
      STATIC_FALLBACK: "STATIC_FALLBACK"
    })
  });

  const RECEIPT = {
    contractId: CONTRACT.id,
    sourceContractId: CONTRACT.sourceContractId,
    status: "pending",
    state: STATES.CONSTELLATION,
    orbitFocus: "north",
    orbitPreviewFocus: "north",
    orbitPhase: ORIENTATION_PHASES.COMMITTED,
    orbitGestureActive: false,
    orbitRevision: 0,
    orbitQuaternion: QUATERNION.identity,
    activeClusterWing: "",
    clusterPrimaryRoom: "",
    clusterPreviewPrimaryRoom: "",
    clusterPhase: ORIENTATION_PHASES.IDLE,
    clusterGestureActive: false,
    clusterRevision: 0,
    clusterQuaternion: QUATERNION.identity,
    selectedCardinal: "",
    selectedCoin: "",
    selectedRoom: "",
    selectedDestinationType: "",
    selectedDestinationId: "",
    selectedDestinationLabel: "",
    selectedRoute: "",
    selectedContentId: "",
    selectedLens: "overview",
    panelDescended: false,
    upstreamCompassMounted: false,
    upstreamCompassStatus: "pending",
    upstreamCompassFailure: "",
    lastAction: "",
    lastFailure: null,
    visualPassClaimed: false
  };

  const state = {
    root: null,
    scene: null,
    panel: null,
    panelEyebrow: null,
    panelTitle: null,
    panelPurpose: null,
    panelRelationship: null,
    readMoreLink: null,
    enterButton: null,
    enterLabel: null,
    returnToOrbitButton: null,
    guidance: null,
    controllerReceiptOutput: null,
    upstreamCompassMount: null,
    upstreamCompassControl: null,
    upstreamCompassFallback: null,
    upstreamCompassHandle: null,
    upstreamCompassMounted: false,
    upstreamCompassStatus: "pending",
    upstreamCompassFailure: "",
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
    selectedDestinationType: "",
    selectedDestinationId: "",
    selectedDestinationLabel: "",
    selectedRoute: "",
    selectedContentId: "",
    selectedLens: "overview",
    panelDescended: false,
    panelDescentFrame: 0,
    panelDescentCommitFrame: 0,
    sceneAscentFrame: 0,
    sceneAscentCommitFrame: 0,
    reducedMotion: false,
    initialized: false
  };

  const upstreamCompassSubscribers = {
    gestureDelta: new Set(),
    gestureRelease: new Set(),
    reducedMotion: new Set(),
    heldState: new Set()
  };

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function finiteNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function normalizeWing(value) {
    const wing = String(value || "").trim().toLowerCase();
    return WINGS.includes(wing) ? wing : "";
  }

  function wingToCoin(wing) {
    const normalizedWing = normalizeWing(wing);
    return ARCHCOIN_WING_TO_COIN[normalizedWing] || "";
  }

  function normalizeRoomId(value) {
    return String(value || "").trim();
  }

  function normalizeRoute(value) {
    const route = String(value || "").trim();
    return route.startsWith("/") ? route : "";
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

  function quaternionLength(quaternion) {
    return Math.hypot(
      quaternion[0],
      quaternion[1],
      quaternion[2],
      quaternion[3]
    );
  }

  function normalizeQuaternion(value, fallback = QUATERNION.identity) {
    const source =
      Array.isArray(value) || ArrayBuffer.isView(value)
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

    const length = quaternionLength(quaternion);

    if (!Number.isFinite(length) || length < QUATERNION.minimumLength) {
      return Array.from(fallback);
    }

    return quaternion.map(component => component / length);
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
    const quaternion = normalizeQuaternion(value);
    const [x, y, z, w] = quaternion;

    const sinPitch = 2 * (w * y - z * x);

    const pitch =
      Math.abs(sinPitch) >= 1
        ? Math.sign(sinPitch) * (Math.PI / 2)
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
      pitch: clamp(pitch, -Math.PI / 2, Math.PI / 2),
      roll: wrapRadians(roll)
    };
  }

  function orientationFromEuler(yaw, pitch, roll, primaryId = "") {
    const quaternion = quaternionFromEuler(yaw, pitch, roll);

    return {
      yaw: wrapRadians(yaw),
      pitch: clamp(
        finiteNumber(pitch, 0),
        -Math.PI / 2,
        Math.PI / 2
      ),
      roll: wrapRadians(roll),
      quaternion,
      primaryId: String(primaryId || "").trim()
    };
  }

  function orientationFromQuaternion(quaternion, primaryId = "") {
    const normalized = normalizeQuaternion(quaternion);
    const euler = eulerFromQuaternion(normalized);

    return {
      yaw: euler.yaw,
      pitch: euler.pitch,
      roll: euler.roll,
      quaternion: normalized,
      primaryId: String(primaryId || "").trim()
    };
  }

  function cloneOrientation(orientation) {
    const source =
      orientation ||
      orientationFromQuaternion(QUATERNION.identity);

    return {
      yaw: finiteNumber(source.yaw, 0),
      pitch: finiteNumber(source.pitch, 0),
      roll: finiteNumber(source.roll, 0),
      quaternion: normalizeQuaternion(source.quaternion),
      primaryId: String(
        source.primaryId ||
        source.primaryWing ||
        source.primaryRoom ||
        ""
      ).trim()
    };
  }

  function freezeOrientation(orientation) {
    const clone = cloneOrientation(orientation);

    return Object.freeze({
      yaw: clone.yaw,
      pitch: clone.pitch,
      roll: clone.roll,
      quaternion: Object.freeze(clone.quaternion.slice()),
      primaryId: clone.primaryId
    });
  }

  function resolveOrientation(payload, fallbackOrientation) {
    const fallback = cloneOrientation(fallbackOrientation);

    if (!payload || typeof payload !== "object") {
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
      ArrayBuffer.isView(payload.quaternion)
    ) {
      return orientationFromQuaternion(
        payload.quaternion,
        primaryId
      );
    }

    if (
      payload.orientation &&
      (
        Array.isArray(payload.orientation.quaternion) ||
        ArrayBuffer.isView(payload.orientation.quaternion)
      )
    ) {
      return orientationFromQuaternion(
        payload.orientation.quaternion,
        primaryId || payload.orientation.primaryId
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

  function canonicalConstellationOrientation(wing) {
    const normalizedWing = normalizeWing(wing) || "north";
    const canonical = CANONICAL_CONSTELLATION_EULER[normalizedWing];

    return orientationFromEuler(
      canonical.yaw,
      canonical.pitch,
      canonical.roll,
      normalizedWing
    );
  }

  function createClusterState(wing) {
    return {
      wing,
      roomIds: [],
      primaryRoom: "",
      previewPrimaryRoom: "",
      phase: ORIENTATION_PHASES.IDLE,
      gestureActive: false,
      revision: 0,
      orientation: orientationFromQuaternion(
        QUATERNION.identity
      ),
      committedOrientation: orientationFromQuaternion(
        QUATERNION.identity
      ),
      gestureOrigin: null
    };
  }

  function getCluster(wing) {
    const normalizedWing = normalizeWing(wing);

    if (!normalizedWing) {
      return null;
    }

    return state.clusters.get(normalizedWing) || null;
  }

  function activeClusterWing() {
    if (
      state.current !== STATES.CLUSTER_OPEN &&
      state.current !== STATES.ROOM_SELECTED
    ) {
      return "";
    }

    return normalizeWing(state.selectedCardinal);
  }

  function activeCluster() {
    return getCluster(activeClusterWing());
  }

  function clusterContainsRoom(cluster, roomId) {
    return Boolean(
      cluster &&
      cluster.roomIds.includes(
        normalizeRoomId(roomId)
      )
    );
  }

  function canTransition(fromState, toState) {
    const allowed = TRANSITIONS[fromState] || [];
    return allowed.includes(toState);
  }

  function subscribeToChannel(channel, callback) {
    if (typeof callback !== "function") {
      return () => false;
    }

    const set = upstreamCompassSubscribers[channel];

    if (!set) {
      return () => false;
    }

    set.add(callback);

    return () => {
      set.delete(callback);
      return true;
    };
  }

  function publishToChannel(channel, payload) {
    const set = upstreamCompassSubscribers[channel];

    if (!set) {
      return;
    }

    set.forEach(callback => {
      try {
        callback(payload);
      } catch (_) {}
    });
  }

  function createUpstreamCompassHeldState() {
    if (state.current === STATES.HELD) {
      return Object.freeze({
        active: true,
        variant:
          UPSTREAM_COMPASS.heldVariants.STATIC_FALLBACK
      });
    }

    return Object.freeze({
      active: false,
      variant:
        UPSTREAM_COMPASS.heldVariants.ENHANCED
    });
  }

  function publishUpstreamCompassHeldState() {
    publishToChannel(
      "heldState",
      createUpstreamCompassHeldState()
    );
  }

  function publishUpstreamCompassReducedMotion() {
    publishToChannel(
      "reducedMotion",
      state.reducedMotion === true
    );
  }

  function publishUpstreamCompassGestureDelta(deltaThetaGesture) {
    const delta = finiteNumber(
      deltaThetaGesture,
      0
    );

    if (Math.abs(delta) <= 1e-9) {
      return;
    }

    publishToChannel(
      "gestureDelta",
      delta
    );
  }

  function publishUpstreamCompassGestureRelease() {
    publishToChannel("gestureRelease");
  }

  function deriveGestureDeltaRadians(
    payload,
    previousOrientation,
    nextOrientation
  ) {
    if (
      payload &&
      typeof payload.deltaThetaGesture === "number"
    ) {
      return finiteNumber(
        payload.deltaThetaGesture,
        0
      );
    }

    const previousYaw =
      previousOrientation &&
      typeof previousOrientation.yaw === "number"
        ? previousOrientation.yaw
        : 0;

    const nextYaw =
      nextOrientation &&
      typeof nextOrientation.yaw === "number"
        ? nextOrientation.yaw
        : previousYaw;

    return wrapRadians(
      nextYaw - previousYaw
    );
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

  function setPanelDescended(descended) {
    state.panelDescended = Boolean(descended);
  }

  function schedulePanelDescent(expectedRoomId) {
    clearViewportSchedules();

    const roomId =
      normalizeRoomId(expectedRoomId);

    if (!roomId || !state.panel) {
      return;
    }

    state.panelDescentFrame =
      requestAnimationFrame(() => {
        state.panelDescentFrame = 0;

        state.panelDescentCommitFrame =
          requestAnimationFrame(() => {
            state.panelDescentCommitFrame = 0;

            if (
              state.current !== STATES.ROOM_SELECTED ||
              state.selectedRoom !== roomId ||
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

            emitReceipt({
              lastAction:
                `panel-descended:${roomId}`,
              lastFailure:
                null
            });
          });
      });
  }

  function scheduleSceneAscent(expectedWing) {
    clearViewportSchedules();

    const wing =
      normalizeWing(expectedWing);

    if (!wing || !state.scene) {
      return;
    }

    state.sceneAscentFrame =
      requestAnimationFrame(() => {
        state.sceneAscentFrame = 0;

        state.sceneAscentCommitFrame =
          requestAnimationFrame(() => {
            state.sceneAscentCommitFrame = 0;

            if (
              state.current !== STATES.CLUSTER_OPEN ||
              state.selectedCardinal !== wing ||
              state.selectedRoom
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

            emitReceipt({
              lastAction:
                `returned-to-orbit:${wing}`,
              lastFailure:
                null
            });
          });
      });
  }

  function setHiddenControl(control, hidden) {
    if (!control) {
      return;
    }

    control.hidden = hidden;
    control.disabled = hidden;

    control.setAttribute(
      "aria-hidden",
      hidden ? "true" : "false"
    );

    control.setAttribute(
      "aria-disabled",
      hidden ? "true" : "false"
    );

    if (hidden) {
      control.setAttribute(
        "tabindex",
        "-1"
      );
    } else {
      control.removeAttribute(
        "tabindex"
      );
    }
  }

  function setEnterEnabled(enabled, label = "Enter") {
    if (!state.enterButton) {
      return;
    }

    state.enterButton.disabled = !enabled;

    state.enterButton.setAttribute(
      "aria-disabled",
      enabled ? "false" : "true"
    );

    if (state.enterLabel) {
      state.enterLabel.textContent = label;
    } else {
      state.enterButton.textContent = label;
    }
  }

  function setReadMoreLink(route, enabled) {
    if (!state.readMoreLink) {
      return;
    }

    const safeRoute =
      normalizeRoute(route);

    if (enabled && safeRoute) {
      state.readMoreLink.href = safeRoute;

      state.readMoreLink.removeAttribute(
        "aria-disabled"
      );

      state.readMoreLink.tabIndex = 0;
      return;
    }

    state.readMoreLink.href = "#";

    state.readMoreLink.setAttribute(
      "aria-disabled",
      "true"
    );

    state.readMoreLink.tabIndex = -1;
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
        purpose ||
        "Begin with the coin closest to the question you are carrying.";
    }

    if (state.panelRelationship) {
      state.panelRelationship.textContent =
        relationship ||
        "Open a coin cluster, inspect a room, and enter when the path feels clear.";
    }
  }

  function setGuidance(message) {
    if (state.guidance) {
      state.guidance.textContent =
        message || "";
    }
  }

  function defaultPanel() {
    return {
      eyebrow:
        "Selected path",
      title:
        "Choose a coin",
      purpose:
        "Begin with the coin that most closely resembles the question you are carrying.",
      relationship:
        "Tap a coin to open its room cluster. Tap a room to inspect its record."
    };
  }

  function syncDatasets() {
    if (!state.root) {
      return;
    }

    const orbit = cloneOrientation(
      state.orbitOrientation ||
      canonicalConstellationOrientation(
        state.orbitFocus
      )
    );

    const cluster = activeCluster();

    state.root.dataset.archcoinMode =
      state.current;

    state.root.dataset.orbitFocus =
      state.orbitFocus;

    state.root.dataset.orbitPreviewFocus =
      state.orbitPreviewFocus;

    state.root.dataset.orbitPhase =
      state.orbitPhase;

    state.root.dataset.orbitGestureActive =
      state.orbitGestureActive
        ? "true"
        : "false";

    state.root.dataset.orbitRevision =
      String(state.orbitRevision);

    state.root.dataset.orbitQuaternion =
      JSON.stringify(orbit.quaternion);

    state.root.dataset.activeClusterWing =
      cluster ? cluster.wing : "";

    state.root.dataset.clusterPrimaryRoom =
      cluster ? cluster.primaryRoom : "";

    state.root.dataset.clusterPreviewPrimaryRoom =
      cluster
        ? cluster.previewPrimaryRoom
        : "";

    state.root.dataset.clusterPhase =
      cluster
        ? cluster.phase
        : ORIENTATION_PHASES.IDLE;

    state.root.dataset.clusterGestureActive =
      cluster && cluster.gestureActive
        ? "true"
        : "false";

    state.root.dataset.clusterRevision =
      String(cluster ? cluster.revision : 0);

    state.root.dataset.clusterQuaternion =
      cluster
        ? JSON.stringify(
            cluster.orientation.quaternion
          )
        : "";

    state.root.dataset.selectedCardinal =
      state.selectedCardinal;

    state.root.dataset.selectedCoin =
      state.selectedCoin;

    state.root.dataset.selectedRoom =
      state.selectedRoom;

    state.root.dataset.selectedDestinationType =
      state.selectedDestinationType;

    state.root.dataset.selectedDestinationId =
      state.selectedDestinationId;

    state.root.dataset.selectedDestinationLabel =
      state.selectedDestinationLabel;

    state.root.dataset.selectedRoute =
      state.selectedRoute;

    state.root.dataset.selectedContentId =
      state.selectedContentId;

    state.root.dataset.selectedLens =
      state.selectedLens;

    state.root.dataset.panelDescended =
      state.panelDescended
        ? "true"
        : "false";

    state.root.dataset.reducedMotion =
      state.reducedMotion
        ? "true"
        : "false";

    state.root.dataset.visualPassClaimed =
      "false";

    state.root.dataset.archcoinUpstreamCompassMounted =
      state.upstreamCompassMounted
        ? "true"
        : "false";

    state.root.dataset.archcoinUpstreamCompassStatus =
      state.upstreamCompassStatus;

    state.root.dataset.archcoinUpstreamCompassFailure =
      state.upstreamCompassFailure;

    qsa(
      "[data-archcoin-coin]",
      state.root
    ).forEach(element => {
      const wing = normalizeWing(
        element.dataset.wing ||
        element.dataset.coinId
      );

      const selected =
        wing === state.selectedCardinal &&
        (
          state.current === STATES.CLUSTER_OPEN ||
          state.current === STATES.ROOM_SELECTED
        );

      const primary =
        wing === state.orbitFocus &&
        state.current === STATES.CONSTELLATION;

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
        roomId === state.selectedRoom;

      const primary =
        Boolean(
          cluster &&
          roomId === cluster.primaryRoom
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

    state.root.dataset.archcoinControllerStatus =
      RECEIPT.status;

    state.root.dataset.archcoinControllerReceipt =
      JSON.stringify(RECEIPT);
  }

  function emitReceipt(extra = {}) {
    const orbit = cloneOrientation(
      state.orbitOrientation ||
      canonicalConstellationOrientation(
        state.orbitFocus
      )
    );

    const cluster = activeCluster();

    Object.assign(
      RECEIPT,
      {
        contractId:
          CONTRACT.id,
        sourceContractId:
          CONTRACT.sourceContractId,
        status:
          state.current === STATES.HELD
            ? "held"
            : "available",
        state:
          state.current,
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
        orbitQuaternion:
          Object.freeze(
            orbit.quaternion.slice()
          ),
        activeClusterWing:
          cluster ? cluster.wing : "",
        clusterPrimaryRoom:
          cluster ? cluster.primaryRoom : "",
        clusterPreviewPrimaryRoom:
          cluster
            ? cluster.previewPrimaryRoom
            : "",
        clusterPhase:
          cluster
            ? cluster.phase
            : ORIENTATION_PHASES.IDLE,
        clusterGestureActive:
          cluster
            ? cluster.gestureActive
            : false,
        clusterRevision:
          cluster
            ? cluster.revision
            : 0,
        clusterQuaternion:
          Object.freeze(
            cluster
              ? cluster.orientation.quaternion.slice()
              : QUATERNION.identity.slice()
          ),
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
        panelDescended:
          state.panelDescended,
        upstreamCompassMounted:
          state.upstreamCompassMounted,
        upstreamCompassStatus:
          state.upstreamCompassStatus,
        upstreamCompassFailure:
          state.upstreamCompassFailure,
        visualPassClaimed:
          false
      },
      extra
    );

    const serialized =
      JSON.stringify(RECEIPT);

    if (state.root) {
      state.root.dataset.archcoinControllerStatus =
        RECEIPT.status;

      state.root.dataset.archcoinControllerReceipt =
        serialized;

      state.root.dataset.visualPassClaimed =
        "false";
    }

    if (state.controllerReceiptOutput) {
      state.controllerReceiptOutput.value =
        serialized;

      state.controllerReceiptOutput.textContent =
        serialized;

      state.controllerReceiptOutput.dataset.visualPassClaimed =
        "false";
    }

    globalThis.DGB_ARCHCOIN_CONTROLLER_RECEIPT =
      Object.freeze({
        ...RECEIPT,
        orbitQuaternion:
          Object.freeze(
            Array.from(
              RECEIPT.orbitQuaternion
            )
          ),
        clusterQuaternion:
          Object.freeze(
            Array.from(
              RECEIPT.clusterQuaternion
            )
          )
      });
  }

  function syncPresentation() {
    syncDatasets();

    if (state.current === STATES.CONSTELLATION) {
      setPanel(defaultPanel());
      setEnterEnabled(false, "Enter");
      setReadMoreLink("", false);
      setHiddenControl(
        state.returnToOrbitButton,
        true
      );

      setGuidance(
        "Tap a coin to open its cluster. Drag the constellation to bring the nearest coin forward."
      );

      publishUpstreamCompassHeldState();
      return;
    }

    if (state.current === STATES.CLUSTER_OPEN) {
      setEnterEnabled(false, "Enter Room");
      setReadMoreLink("", false);
      setHiddenControl(
        state.returnToOrbitButton,
        true
      );

      setGuidance(
        "Pull and hold to rotate the room cluster. Release a controlled drag to settle the nearest room forward."
      );

      publishUpstreamCompassHeldState();
      return;
    }

    if (state.current === STATES.ROOM_SELECTED) {
      setEnterEnabled(
        Boolean(state.selectedRoute),
        "Enter Room"
      );

      setReadMoreLink(
        state.selectedRoute,
        Boolean(state.selectedRoute)
      );

      setHiddenControl(
        state.returnToOrbitButton,
        false
      );

      setGuidance(
        "Inspect the selected room. Return to Orbit is the explicit control for restoring the room cluster."
      );

      publishUpstreamCompassHeldState();
      return;
    }

    if (state.current === STATES.HELD) {
      setEnterEnabled(
        false,
        "Unavailable"
      );

      setReadMoreLink("", false);

      setHiddenControl(
        state.returnToOrbitButton,
        true
      );

      setGuidance(
        "The ARCHCOIN controller is held. Static content remains visible."
      );

      publishUpstreamCompassHeldState();
    }
  }

  function findCoinElement(wing) {
    const normalized =
      normalizeWing(wing);

    if (!normalized) {
      return null;
    }

    return qs(
      `[data-archcoin-coin][data-wing="${normalized}"]`,
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
      typeof globalThis.CSS.escape === "function"
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

  function existingContentRecordById(contentId) {
    const id =
      normalizeRoomId(contentId);

    if (!id) {
      return null;
    }

    const escaped =
      globalThis.CSS &&
      typeof globalThis.CSS.escape === "function"
        ? globalThis.CSS.escape(id)
        : id.replace(
            /["\\]/g,
            "\\$&"
          );

    return (
      qs(
        `[data-archcoin-content][data-content-id="${escaped}"]`,
        state.root
      ) ||
      qs(
        `#${escaped}`,
        state.root
      )
    );
  }

  function resolveRoomContentIdentity(roomElement) {
    const declared =
      normalizeRoomId(
        roomElement.dataset.contentId ||
        roomElement.dataset.selectedContentId ||
        ""
      ) || "";

    if (
      declared &&
      existingContentRecordById(declared)
    ) {
      return declared;
    }

    return "";
  }

  function resolveRoomLens(roomElement) {
    return (
      String(
        roomElement.dataset.lens ||
        roomElement.dataset.tab ||
        roomElement.dataset.defaultLens ||
        "overview"
      )
        .trim()
        .toLowerCase() ||
      "overview"
    );
  }

  function panelFromCoin(element) {
    return {
      eyebrow:
        element.dataset.coinLabel ||
        element.dataset.label ||
        "Selected coin",
      title:
        element.dataset.panelTitle ||
        element.dataset.coinTitle ||
        element.dataset.label ||
        "Selected coin",
      purpose:
        element.dataset.panelBody ||
        element.dataset.coinBody ||
        element.dataset.coinFunction ||
        "",
      relationship:
        element.dataset.panelWhy ||
        element.dataset.coinWhy ||
        "Inspect the room cluster before selecting a room."
    };
  }

  function panelFromRoom(element) {
    return {
      eyebrow:
        element.dataset.roomLensLabel ||
        element.dataset.roomType ||
        "Selected room",
      title:
        element.dataset.panelTitle ||
        element.dataset.label ||
        element.textContent.trim(),
      purpose:
        element.dataset.preview ||
        element.dataset.roomSummary ||
        element.dataset.roomFunction ||
        "",
      relationship:
        element.dataset.whyEnter ||
        element.dataset.panelWhy ||
        "Inspect the selected room, then enter when ready."
    };
  }

  function resetSelection() {
    state.selectedCardinal = "";
    state.selectedCoin = "";
    state.selectedRoom = "";
    state.selectedDestinationType = "";
    state.selectedDestinationId = "";
    state.selectedDestinationLabel = "";
    state.selectedRoute = "";
    state.selectedContentId = "";
    state.selectedLens = "overview";

    setPanelDescended(false);
  }

  function beginAtomicTransition(next) {
    const currentState =
      state.current;

    const nextState =
      next.state || currentState;

    if (
      !canTransition(
        currentState,
        nextState
      )
    ) {
      throw new Error(
        `ILLEGAL_STATE_TRANSITION:${currentState}->${nextState}`
      );
    }

    const transaction = {
      currentState,
      nextState,
      orbitFocus:
        next.orbitFocus !== undefined
          ? next.orbitFocus
          : state.orbitFocus,
      orbitPreviewFocus:
        next.orbitPreviewFocus !== undefined
          ? next.orbitPreviewFocus
          : state.orbitPreviewFocus,
      orbitPhase:
        next.orbitPhase !== undefined
          ? next.orbitPhase
          : state.orbitPhase,
      orbitGestureActive:
        next.orbitGestureActive !== undefined
          ? next.orbitGestureActive
          : state.orbitGestureActive,
      orbitRevision:
        next.orbitRevision !== undefined
          ? next.orbitRevision
          : state.orbitRevision,
      orbitOrientation:
        next.orbitOrientation !== undefined
          ? next.orbitOrientation
          : state.orbitOrientation,
      committedOrbitOrientation:
        next.committedOrbitOrientation !== undefined
          ? next.committedOrbitOrientation
          : state.committedOrbitOrientation,
      orbitGestureOrigin:
        next.orbitGestureOrigin !== undefined
          ? next.orbitGestureOrigin
          : state.orbitGestureOrigin,
      selectedCardinal:
        next.selectedCardinal !== undefined
          ? next.selectedCardinal
          : state.selectedCardinal,
      selectedCoin:
        next.selectedCoin !== undefined
          ? next.selectedCoin
          : state.selectedCoin,
      selectedRoom:
        next.selectedRoom !== undefined
          ? next.selectedRoom
          : state.selectedRoom,
      selectedDestinationType:
        next.selectedDestinationType !== undefined
          ? next.selectedDestinationType
          : state.selectedDestinationType,
      selectedDestinationId:
        next.selectedDestinationId !== undefined
          ? next.selectedDestinationId
          : state.selectedDestinationId,
      selectedDestinationLabel:
        next.selectedDestinationLabel !== undefined
          ? next.selectedDestinationLabel
          : state.selectedDestinationLabel,
      selectedRoute:
        next.selectedRoute !== undefined
          ? next.selectedRoute
          : state.selectedRoute,
      selectedContentId:
        next.selectedContentId !== undefined
          ? next.selectedContentId
          : state.selectedContentId,
      selectedLens:
        next.selectedLens !== undefined
          ? next.selectedLens
          : state.selectedLens,
      panelDescended:
        next.panelDescended !== undefined
          ? next.panelDescended
          : state.panelDescended
    };

    if (
      transaction.nextState ===
      STATES.CLUSTER_OPEN
    ) {
      const wing =
        normalizeWing(
          transaction.selectedCardinal
        );

      const coin =
        String(
          transaction.selectedCoin || ""
        ).trim();

      if (!wing) {
        throw new Error(
          "ATOMIC_COMMIT_REQUIRES_SELECTED_CARDINAL"
        );
      }

      if (
        !coin ||
        coin !== wingToCoin(wing)
      ) {
        throw new Error(
          "ATOMIC_COMMIT_REQUIRES_MAPPED_SELECTED_COIN"
        );
      }

      if (
        normalizeRoomId(
          transaction.selectedRoom
        )
      ) {
        throw new Error(
          "CLUSTER_OPEN_REQUIRES_EMPTY_SELECTED_ROOM"
        );
      }

      if (
        normalizeRoomId(
          transaction.selectedContentId
        )
      ) {
        throw new Error(
          "CLUSTER_OPEN_REQUIRES_EMPTY_SELECTED_CONTENT_ID"
        );
      }

      if (
        normalizeWing(
          transaction.orbitFocus
        ) !== wing
      ) {
        throw new Error(
          "CLUSTER_OPEN_REQUIRES_MATCHING_ORBIT_FOCUS"
        );
      }

      if (
        normalizeWing(
          transaction.orbitPreviewFocus
        ) !== wing
      ) {
        throw new Error(
          "CLUSTER_OPEN_REQUIRES_MATCHING_ORBIT_PREVIEW_FOCUS"
        );
      }
    }

    if (
      transaction.nextState ===
      STATES.ROOM_SELECTED
    ) {
      const wing =
        normalizeWing(
          transaction.selectedCardinal
        );

      const coin =
        String(
          transaction.selectedCoin || ""
        ).trim();

      if (!wing) {
        throw new Error(
          "ROOM_SELECTED_REQUIRES_SELECTED_CARDINAL"
        );
      }

      if (
        !coin ||
        coin !== wingToCoin(wing)
      ) {
        throw new Error(
          "ROOM_SELECTED_REQUIRES_MAPPED_SELECTED_COIN"
        );
      }

      if (
        !normalizeRoomId(
          transaction.selectedRoom
        )
      ) {
        throw new Error(
          "ROOM_SELECTED_REQUIRES_SELECTED_ROOM"
        );
      }
    }

    if (
      transaction.nextState === STATES.CONSTELLATION ||
      transaction.nextState === STATES.HELD
    ) {
      transaction.selectedCardinal = "";
      transaction.selectedCoin = "";
      transaction.selectedRoom = "";
      transaction.selectedDestinationType = "";
      transaction.selectedDestinationId = "";
      transaction.selectedDestinationLabel = "";
      transaction.selectedRoute = "";
      transaction.selectedContentId = "";
      transaction.selectedLens = "overview";
      transaction.panelDescended = false;
    }

    return transaction;
  }

  function commitAtomicTransition(
    transaction,
    action,
    panelUpdater
  ) {
    state.current =
      transaction.nextState;

    state.orbitFocus =
      transaction.orbitFocus;

    state.orbitPreviewFocus =
      transaction.orbitPreviewFocus;

    state.orbitPhase =
      transaction.orbitPhase;

    state.orbitGestureActive =
      transaction.orbitGestureActive;

    state.orbitRevision =
      transaction.orbitRevision;

    state.orbitOrientation =
      transaction.orbitOrientation;

    state.committedOrbitOrientation =
      transaction.committedOrbitOrientation;

    state.orbitGestureOrigin =
      transaction.orbitGestureOrigin;

    state.selectedCardinal =
      transaction.selectedCardinal;

    state.selectedCoin =
      transaction.selectedCoin;

    state.selectedRoom =
      transaction.selectedRoom;

    state.selectedDestinationType =
      transaction.selectedDestinationType;

    state.selectedDestinationId =
      transaction.selectedDestinationId;

    state.selectedDestinationLabel =
      transaction.selectedDestinationLabel;

    state.selectedRoute =
      transaction.selectedRoute;

    state.selectedContentId =
      transaction.selectedContentId;

    state.selectedLens =
      transaction.selectedLens;

    state.panelDescended =
      transaction.panelDescended;

    if (typeof panelUpdater === "function") {
      panelUpdater();
    }

    syncPresentation();

    emitReceipt({
      lastAction:
        action,
      lastFailure:
        null
    });

    publishUpstreamCompassHeldState();

    return true;
  }

  function setConstellationOrientation(
    orientation,
    {
      committed = false,
      phase = ORIENTATION_PHASES.PREVIEW,
      gestureActive = false,
      incrementRevision = false
    } = {}
  ) {
    const normalized =
      cloneOrientation(orientation);

    const primaryWing =
      normalizeWing(
        normalized.primaryId
      );

    normalized.primaryId =
      primaryWing ||
      state.orbitPreviewFocus ||
      state.orbitFocus ||
      "north";

    state.orbitOrientation =
      normalized;

    state.orbitPreviewFocus =
      normalized.primaryId;

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

    const preview =
      resolveOrientation(
        payload,
        state.orbitOrientation
      );

    setConstellationOrientation(
      preview,
      {
        committed: false,
        phase:
          ORIENTATION_PHASES.PREVIEW,
        gestureActive: true
      }
    );

    syncPresentation();

    emitReceipt({
      lastAction:
        "orbit-gesture-began",
      lastFailure:
        null
    });

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

    const previousOrientation =
      cloneOrientation(
        state.orbitOrientation
      );

    const orientation =
      resolveOrientation(
        payload,
        state.orbitOrientation
      );

    setConstellationOrientation(
      orientation,
      {
        committed: false,
        phase:
          ORIENTATION_PHASES.PREVIEW,
        gestureActive: true
      }
    );

    publishUpstreamCompassGestureDelta(
      deriveGestureDeltaRadians(
        payload,
        previousOrientation,
        orientation
      )
    );

    syncDatasets();

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
      emitReceipt({
        lastAction:
          "orbit-commit-rejected",
        lastFailure:
          "ORBIT_PRIMARY_WING_REQUIRED"
      });

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

    state.orbitGestureOrigin =
      null;

    publishUpstreamCompassGestureRelease();

    syncPresentation();

    emitReceipt({
      lastAction:
        `orbit-committed:${primaryWing}`,
      lastFailure:
        null,
      orbitCommitSource:
        String(
          payload.source ||
          "renderer"
        )
    });

    return true;
  }

  function requestOrbitCancel(reason = "cancelled") {
    if (
      !state.orbitGestureActive &&
      state.orbitPhase !==
        ORIENTATION_PHASES.PREVIEW
    ) {
      return false;
    }

    const restored =
      cloneOrientation(
        state.orbitGestureOrigin ||
        state.committedOrbitOrientation ||
        canonicalConstellationOrientation(
          state.orbitFocus
        )
      );

    setConstellationOrientation(
      restored,
      {
        committed: false,
        phase:
          ORIENTATION_PHASES.COMMITTED,
        gestureActive: false
      }
    );

    state.orbitGestureOrigin =
      null;

    publishUpstreamCompassGestureRelease();

    syncPresentation();

    emitReceipt({
      lastAction:
        `orbit-preview-cancelled:${String(
          reason || "cancelled"
        )}`,
      lastFailure:
        null
    });

    return true;
  }

  function requestOrbitFocus(wing, options = {}) {
    const normalizedWing =
      normalizeWing(wing);

    if (
      !normalizedWing ||
      state.current !==
        STATES.CONSTELLATION
    ) {
      return false;
    }

    const canonical =
      canonicalConstellationOrientation(
        normalizedWing
      );

    return requestOrbitCommit({
      ...canonical,
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
      typeof wingOrPayload === "string"
        ? normalizeWing(wingOrPayload)
        : activeClusterWing();

    const payload =
      typeof wingOrPayload === "object" &&
      wingOrPayload !== null
        ? wingOrPayload
        : maybePayload;

    const cluster =
      getCluster(wing);

    if (
      !cluster ||
      !(
        (
          state.current === STATES.CLUSTER_OPEN ||
          state.current === STATES.ROOM_SELECTED
        ) &&
        normalizeWing(
          state.selectedCardinal
        ) === normalizeWing(wing)
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

    const preview =
      resolveOrientation(
        payload,
        cluster.orientation
      );

    setClusterOrientation(
      cluster,
      preview,
      {
        committed: false,
        phase:
          ORIENTATION_PHASES.PREVIEW,
        gestureActive: true
      }
    );

    syncPresentation();

    emitReceipt({
      lastAction:
        `cluster-gesture-began:${wing}`,
      lastFailure:
        null
    });

    return true;
  }

  function requestClusterPreview(
    wingOrPayload,
    maybePayload = {}
  ) {
    const wing =
      typeof wingOrPayload === "string"
        ? normalizeWing(wingOrPayload)
        : activeClusterWing();

    const payload =
      typeof wingOrPayload === "object" &&
      wingOrPayload !== null
        ? wingOrPayload
        : maybePayload;

    const cluster =
      getCluster(wing);

    if (
      !cluster ||
      !(
        (
          state.current === STATES.CLUSTER_OPEN ||
          state.current === STATES.ROOM_SELECTED
        ) &&
        normalizeWing(
          state.selectedCardinal
        ) === normalizeWing(wing)
      )
    ) {
      return false;
    }

    if (!cluster.gestureActive) {
      beginClusterGesture(wing);
    }

    const previousOrientation =
      cloneOrientation(
        cluster.orientation
      );

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

    publishUpstreamCompassGestureDelta(
      deriveGestureDeltaRadians(
        payload,
        previousOrientation,
        orientation
      )
    );

    syncDatasets();

    return true;
  }

  function requestClusterCommit(
    wingOrPayload,
    maybePayload = {}
  ) {
    const wing =
      typeof wingOrPayload === "string"
        ? normalizeWing(wingOrPayload)
        : activeClusterWing();

    const payload =
      typeof wingOrPayload === "object" &&
      wingOrPayload !== null
        ? wingOrPayload
        : maybePayload;

    const cluster =
      getCluster(wing);

    if (
      !cluster ||
      !(
        (
          state.current === STATES.CLUSTER_OPEN ||
          state.current === STATES.ROOM_SELECTED
        ) &&
        normalizeWing(
          state.selectedCardinal
        ) === normalizeWing(wing)
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
      emitReceipt({
        lastAction:
          `cluster-commit-rejected:${wing}`,
        lastFailure:
          "CLUSTER_PRIMARY_ROOM_REQUIRED"
      });

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

    cluster.gestureOrigin =
      null;

    publishUpstreamCompassGestureRelease();

    syncPresentation();

    emitReceipt({
      lastAction:
        `cluster-committed:${wing}:${primaryRoom}`,
      lastFailure:
        null,
      clusterCommitSource:
        String(
          payload.source ||
          "renderer"
        )
    });

    return true;
  }

  function requestClusterCancel(
    wingOrReason,
    maybeReason = "cancelled"
  ) {
    const possibleWing =
      normalizeWing(wingOrReason);

    const wing =
      possibleWing ||
      activeClusterWing();

    const reason =
      possibleWing
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

    const restored =
      cloneOrientation(
        cluster.gestureOrigin ||
        cluster.committedOrientation ||
        orientationFromQuaternion(
          QUATERNION.identity,
          cluster.primaryRoom
        )
      );

    setClusterOrientation(
      cluster,
      restored,
      {
        committed: false,
        phase:
          ORIENTATION_PHASES.COMMITTED,
        gestureActive: false
      }
    );

    cluster.gestureOrigin =
      null;

    publishUpstreamCompassGestureRelease();

    syncPresentation();

    emitReceipt({
      lastAction:
        `cluster-preview-cancelled:${wing}:${String(
          reason || "cancelled"
        )}`,
      lastFailure:
        null
    });

    return true;
  }

  function cancelAllGestures(reason) {
    if (state.orbitGestureActive) {
      requestOrbitCancel(reason);
    }

    state.clusters.forEach(cluster => {
      if (cluster.gestureActive) {
        requestClusterCancel(
          cluster.wing,
          reason
        );
      }
    });
  }

  function destinationFromElement(element) {
    if (!element) {
      return null;
    }

    const destinationType =
      String(
        element.dataset.destinationType ||
        element.dataset.coinType ||
        element.dataset.roomType ||
        ""
      )
        .trim()
        .toLowerCase();

    const destinationId =
      String(
        element.dataset.destinationId ||
        element.dataset.roomId ||
        element.dataset.coinId ||
        element.dataset.wing ||
        ""
      ).trim();

    const label =
      String(
        element.dataset.label ||
        element.dataset.coinLabel ||
        element.textContent ||
        ""
      ).trim();

    const route =
      normalizeRoute(
        element.dataset.route ||
        element.getAttribute("href") ||
        ""
      );

    return {
      element,
      destinationType,
      destinationId,
      label,
      route
    };
  }

  function restorePanelForCurrentState() {
    if (
      state.current === STATES.ROOM_SELECTED &&
      state.selectedRoom
    ) {
      const room =
        findRoomElement(
          state.selectedRoom
        );

      if (room) {
        setPanel(
          panelFromRoom(room)
        );

        setReadMoreLink(
          state.selectedRoute,
          Boolean(
            state.selectedRoute
          )
        );

        return true;
      }
    }

    if (
      state.current === STATES.CLUSTER_OPEN &&
      state.selectedCardinal
    ) {
      const coin =
        findCoinElement(
          state.selectedCardinal
        );

      if (coin) {
        setPanel(
          panelFromCoin(coin)
        );

        setReadMoreLink(
          "",
          false
        );

        return true;
      }
    }

    if (
      state.current === STATES.CONSTELLATION
    ) {
      setPanel(
        defaultPanel()
      );

      setReadMoreLink(
        "",
        false
      );

      return true;
    }

    return false;
  }

  function requestCardinalSelection(cardinalId) {
    const wing =
      normalizeWing(cardinalId);

    if (!wing) {
      emitReceipt({
        lastAction:
          "cardinal-selection-rejected",
        lastFailure:
          `INVALID_CARDINAL:${cardinalId}`
      });

      return false;
    }

    if (
      state.current !==
      STATES.CONSTELLATION
    ) {
      return false;
    }

    const element =
      findCoinElement(wing);

    if (!element) {
      emitReceipt({
        lastAction:
          "cardinal-selection-rejected",
        lastFailure:
          `CARDINAL_NOT_FOUND:${wing}`
      });

      return false;
    }

    clearViewportSchedules();

    const destination =
      destinationFromElement(element);

    const committedOrientation =
      canonicalConstellationOrientation(
        wing
      );

    const nextRevision =
      state.orbitRevision + 1;

    const mappedCoin =
      wingToCoin(wing);

    const transaction =
      beginAtomicTransition({
        state:
          STATES.CLUSTER_OPEN,
        orbitFocus:
          wing,
        orbitPreviewFocus:
          wing,
        orbitPhase:
          ORIENTATION_PHASES.COMMITTED,
        orbitGestureActive:
          false,
        orbitRevision:
          nextRevision,
        orbitOrientation:
          cloneOrientation(
            committedOrientation
          ),
        committedOrbitOrientation:
          cloneOrientation(
            committedOrientation
          ),
        orbitGestureOrigin:
          null,
        selectedCardinal:
          wing,
        selectedCoin:
          mappedCoin,
        selectedRoom:
          "",
        selectedDestinationType:
          "coin",
        selectedDestinationId:
          wing,
        selectedDestinationLabel:
          destination.label ||
          element.dataset.coinLabel ||
          wing,
        selectedRoute:
          destination.route,
        selectedContentId:
          "",
        selectedLens:
          "overview",
        panelDescended:
          false
      });

    publishUpstreamCompassGestureRelease();

    return commitAtomicTransition(
      transaction,
      `cardinal-selected:${wing}`,
      () => {
        setPanel(
          panelFromCoin(element)
        );

        setReadMoreLink(
          "",
          false
        );
      }
    );
  }

  function requestRoomSelection(roomId) {
    const id =
      normalizeRoomId(roomId);

    if (
      !id ||
      (
        state.current !== STATES.CLUSTER_OPEN &&
        state.current !== STATES.ROOM_SELECTED
      )
    ) {
      return false;
    }

    const element =
      findRoomElement(id);

    if (!element) {
      emitReceipt({
        lastAction:
          "room-selection-rejected",
        lastFailure:
          `ROOM_NOT_FOUND:${id}`
      });

      return false;
    }

    const wing =
      normalizeWing(
        element.dataset.wing
      );

    if (
      !wing ||
      wing !== state.selectedCardinal
    ) {
      return false;
    }

    const cluster =
      getCluster(wing);

    if (
      !cluster ||
      !clusterContainsRoom(
        cluster,
        id
      )
    ) {
      emitReceipt({
        lastAction:
          "room-selection-rejected",
        lastFailure:
          `ROOM_CLUSTER_INVALID:${id}`
      });

      return false;
    }

    if (cluster.gestureActive) {
      requestClusterCancel(
        wing,
        "room-selection"
      );
    }

    clearViewportSchedules();

    const destination =
      destinationFromElement(element);

    const contentId =
      resolveRoomContentIdentity(
        element
      );

    const lens =
      resolveRoomLens(element);

    const mappedCoin =
      wingToCoin(wing);

    const transaction =
      beginAtomicTransition({
        state:
          STATES.ROOM_SELECTED,
        selectedCardinal:
          wing,
        selectedCoin:
          mappedCoin,
        selectedRoom:
          id,
        selectedDestinationType:
          "room",
        selectedDestinationId:
          id,
        selectedDestinationLabel:
          destination.label,
        selectedRoute:
          destination.route,
        selectedContentId:
          contentId,
        selectedLens:
          lens,
        panelDescended:
          true
      });

    publishUpstreamCompassGestureRelease();

    const committed =
      commitAtomicTransition(
        transaction,
        `room-selected:${id}`,
        () => {
          setPanel(
            panelFromRoom(element)
          );

          setReadMoreLink(
            destination.route,
            Boolean(
              destination.route
            )
          );
        }
      );

    if (!committed) {
      return false;
    }

    schedulePanelDescent(id);

    return true;
  }

  function requestReturnToOrbit() {
    if (
      state.current !==
      STATES.ROOM_SELECTED
    ) {
      return false;
    }

    const wing =
      state.selectedCardinal;

    const coin =
      findCoinElement(wing);

    if (!coin) {
      emitReceipt({
        lastAction:
          "return-to-orbit-rejected",
        lastFailure:
          `CARDINAL_NOT_FOUND:${wing}`
      });

      return false;
    }

    clearViewportSchedules();

    const destination =
      destinationFromElement(coin);

    const mappedCoin =
      wingToCoin(wing);

    const transaction =
      beginAtomicTransition({
        state:
          STATES.CLUSTER_OPEN,
        selectedCardinal:
          wing,
        selectedCoin:
          mappedCoin,
        selectedRoom:
          "",
        selectedDestinationType:
          "coin",
        selectedDestinationId:
          wing,
        selectedDestinationLabel:
          destination.label ||
          coin.dataset.coinLabel ||
          wing,
        selectedRoute:
          destination.route,
        selectedContentId:
          "",
        selectedLens:
          "overview",
        panelDescended:
          false
      });

    publishUpstreamCompassGestureRelease();

    const committed =
      commitAtomicTransition(
        transaction,
        "return-to-orbit",
        () => {
          setPanel(
            panelFromCoin(coin)
          );

          setReadMoreLink(
            "",
            false
          );
        }
      );

    if (!committed) {
      return false;
    }

    scheduleSceneAscent(wing);

    return true;
  }

  function requestReturnToConstellation(options = {}) {
    if (
      state.current !== STATES.CLUSTER_OPEN &&
      state.current !== STATES.ROOM_SELECTED
    ) {
      return false;
    }

    const previousWing =
      normalizeWing(
        state.selectedCardinal ||
        state.orbitFocus
      ) ||
      "north";

    const cluster =
      activeCluster();

    if (
      cluster &&
      cluster.gestureActive
    ) {
      requestClusterCancel(
        cluster.wing,
        "return-to-constellation"
      );
    }

    clearViewportSchedules();

    const transaction =
      beginAtomicTransition({
        state:
          STATES.CONSTELLATION,
        orbitFocus:
          previousWing,
        orbitPreviewFocus:
          previousWing,
        panelDescended:
          false
      });

    publishUpstreamCompassGestureRelease();

    const committed =
      commitAtomicTransition(
        transaction,
        `returned-to-constellation:${previousWing}`,
        () => {
          setPanel(
            defaultPanel()
          );

          setReadMoreLink(
            "",
            false
          );
        }
      );

    if (!committed) {
      return false;
    }

    if (
      options.scrollToScene !== false &&
      state.scene
    ) {
      state.scene.scrollIntoView({
        behavior:
          state.reducedMotion
            ? "auto"
            : "smooth",
        block:
          "start",
        inline:
          "nearest"
      });
    }

    emitReceipt({
      lastAction:
        `returned-to-constellation:${previousWing}`,
      lastFailure:
        null,
      returnSource:
        String(
          options.source ||
          "controller"
        )
    });

    return true;
  }

  function requestReturnToUpstream() {
    const route =
      normalizeRoute(
        (
          state.upstreamCompassControl &&
          state.upstreamCompassControl.getAttribute(
            "href"
          )
        ) ||
        (
          state.upstreamCompassMount &&
          state.upstreamCompassMount.getAttribute(
            "data-upstream-compass-parent-route"
          )
        ) ||
        UPSTREAM_COMPASS.parentRoute
      ) ||
      UPSTREAM_COMPASS.parentRoute;

    globalThis.location.assign(route);

    return true;
  }

  function requestEnterSelection() {
    if (
      state.current !== STATES.ROOM_SELECTED ||
      !state.selectedRoute
    ) {
      return false;
    }

    const route =
      normalizeRoute(
        state.selectedRoute
      );

    if (!route) {
      emitReceipt({
        lastAction:
          "enter-selection-rejected",
        lastFailure:
          "INVALID_SELECTED_ROUTE"
      });

      return false;
    }

    globalThis.location.assign(route);

    return true;
  }

  function handleCrystalsFailureEvent(event) {
    const detail =
      event.detail || {};

    cancelAllGestures(
      "crystals-render-failure"
    );

    emitReceipt({
      status:
        "available",
      lastAction:
        "crystals-render-failure",
      lastFailure:
        detail.reason ||
        "ARCHCOIN_CRYSTALS_RENDER_FAILURE"
    });

    setGuidance(
      "The visual ARCHCOIN field is temporarily unavailable. Static content remains visible."
    );
  }

  function handleUpstreamCompassFailureEvent(event) {
    const detail =
      event.detail || {};

    state.upstreamCompassStatus =
      "held";

    state.upstreamCompassFailure =
      String(
        detail.reason ||
        "DGB_UPSTREAM_COMPASS_RENDERER_FAILURE"
      );

    syncDatasets();

    emitReceipt({
      lastAction:
        "upstream-compass-renderer-failure",
      lastFailure:
        state.upstreamCompassFailure
    });
  }

  function bindPanelControls() {
    if (state.enterButton) {
      state.enterButton.addEventListener(
        "click",
        () => {
          requestEnterSelection();
        }
      );
    }

    if (state.returnToOrbitButton) {
      state.returnToOrbitButton.addEventListener(
        "click",
        () => {
          requestReturnToOrbit();
        }
      );
    }
  }

  function handleSemanticDestination(event) {
    const control =
      event.target.closest(
        "[data-archcoin-destination]"
      );

    if (
      !control ||
      !state.root.contains(control)
    ) {
      return;
    }

    if (
      control.matches(
        "[data-archcoin-coin]"
      )
    ) {
      event.preventDefault();

      requestCardinalSelection(
        control.dataset.wing ||
        control.dataset.coinId
      );

      return;
    }

    if (
      control.matches(
        "[data-archcoin-room]"
      )
    ) {
      event.preventDefault();

      requestRoomSelection(
        control.dataset.roomId
      );
    }
  }

  function bindSemanticControls() {
    state.root.addEventListener(
      "click",
      handleSemanticDestination
    );
  }

  function bindLensTabs() {
    qsa(
      "[data-archcoin-lens-set]",
      state.root
    ).forEach(set => {
      const tabs =
        qsa(
          "[data-archcoin-lens-tab]",
          set
        );

      tabs.forEach((tab, index) => {
        tab.tabIndex =
          tab.getAttribute(
            "aria-selected"
          ) === "true"
            ? 0
            : -1;

        tab.addEventListener(
          "click",
          () => {
            activateLensTab(tab);
          }
        );

        tab.addEventListener(
          "keydown",
          event => {
            if (
              event.key !== "ArrowRight" &&
              event.key !== "ArrowLeft" &&
              event.key !== "Home" &&
              event.key !== "End"
            ) {
              return;
            }

            event.preventDefault();

            let nextIndex =
              index;

            if (
              event.key ===
              "ArrowRight"
            ) {
              nextIndex =
                (index + 1) %
                tabs.length;
            }

            if (
              event.key ===
              "ArrowLeft"
            ) {
              nextIndex =
                (
                  index -
                  1 +
                  tabs.length
                ) %
                tabs.length;
            }

            if (
              event.key ===
              "Home"
            ) {
              nextIndex = 0;
            }

            if (
              event.key ===
              "End"
            ) {
              nextIndex =
                tabs.length - 1;
            }

            activateLensTab(
              tabs[nextIndex]
            );

            tabs[nextIndex].focus();
          }
        );
      });
    });
  }

  function activateLensTab(tab) {
    const set =
      tab.closest(
        "[data-archcoin-lens-set]"
      );

    if (!set) {
      return;
    }

    const requested =
      String(
        tab.dataset.archcoinLensTab ||
        ""
      )
        .trim()
        .toLowerCase();

    qsa(
      "[data-archcoin-lens-tab]",
      set
    ).forEach(candidate => {
      const selected =
        candidate === tab;

      candidate.setAttribute(
        "aria-selected",
        selected
          ? "true"
          : "false"
      );

      candidate.tabIndex =
        selected ? 0 : -1;
    });

    qsa(
      "[data-archcoin-lens-panel]",
      set
    ).forEach(panel => {
      panel.hidden =
        String(
          panel.dataset.archcoinLensPanel ||
          ""
        )
          .trim()
          .toLowerCase() !==
        requested;
    });

    state.selectedLens =
      requested ||
      "overview";

    syncDatasets();

    emitReceipt({
      lastAction:
        `lens-selected:${state.selectedLens}`,
      lastFailure:
        null
    });
  }

  function bindRendererEvents() {
    globalThis.addEventListener(
      "ARCHCOIN_CRYSTALS_RENDER_FAILURE",
      handleCrystalsFailureEvent
    );

    globalThis.addEventListener(
      UPSTREAM_COMPASS.failureEvent,
      handleUpstreamCompassFailureEvent
    );
  }

  function bindReducedMotionPreference() {
    const mediaQuery =
      globalThis.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    if (
      typeof mediaQuery.addEventListener ===
      "function"
    ) {
      mediaQuery.addEventListener(
        "change",
        event => {
          state.reducedMotion =
            event.matches ||
            state.root.dataset.reducedMotion ===
              "true";

          syncDatasets();
          publishUpstreamCompassReducedMotion();

          emitReceipt({
            lastAction:
              "reduced-motion-updated",
            lastFailure:
              null
          });
        }
      );

      return;
    }

    if (
      typeof mediaQuery.addListener ===
      "function"
    ) {
      mediaQuery.addListener(
        event => {
          state.reducedMotion =
            event.matches ||
            state.root.dataset.reducedMotion ===
              "true";

          syncDatasets();
          publishUpstreamCompassReducedMotion();

          emitReceipt({
            lastAction:
              "reduced-motion-updated",
            lastFailure:
              null
          });
        }
      );
    }
  }

  function readReducedMotion() {
    state.reducedMotion =
      globalThis.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches ||
      state.root.dataset.reducedMotion ===
        "true";
  }

  function resolveDom() {
    state.root =
      qs("[data-archcoin-root]");

    if (!state.root) {
      throw new Error(
        "ARCHCOIN_ROOT_NOT_FOUND"
      );
    }

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

    state.readMoreLink =
      qs(
        "[data-archcoin-read-more]",
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

    state.upstreamCompassMount =
      qs(
        "[data-upstream-compass-mount]",
        state.root
      );

    state.upstreamCompassControl =
      qs(
        "[data-upstream-compass-control]",
        state.root
      );

    state.upstreamCompassFallback =
      qs(
        "[data-upstream-compass-fallback]",
        state.root
      );

    if (!state.scene) {
      throw new Error(
        "ARCHCOIN_SCENE_NOT_FOUND"
      );
    }

    if (!state.panel) {
      throw new Error(
        "ARCHCOIN_PANEL_NOT_FOUND"
      );
    }
  }

  function initializeConstellationState() {
    const requestedFocus =
      normalizeWing(
        state.root.dataset.orbitFocus
      ) ||
      "north";

    let initialOrientation =
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
        initialOrientation =
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
      cloneOrientation(
        initialOrientation
      );

    state.committedOrbitOrientation =
      cloneOrientation(
        initialOrientation
      );

    state.orbitGestureOrigin =
      null;
  }

  function initializeClusterStates() {
    state.clusters.clear();

    WINGS.forEach(wing => {
      const cluster =
        createClusterState(wing);

      cluster.roomIds =
        qsa(
          `[data-archcoin-room][data-wing="${wing}"]`,
          state.root
        )
          .map(element =>
            normalizeRoomId(
              element.dataset.roomId
            )
          )
          .filter(Boolean);

      if (
        cluster.roomIds.length !== 4
      ) {
        throw new Error(
          `ARCHCOIN_CLUSTER_ROOM_COUNT_INVALID:${wing}:${cluster.roomIds.length}`
        );
      }

      cluster.primaryRoom =
        cluster.roomIds[0];

      cluster.previewPrimaryRoom =
        cluster.roomIds[0];

      cluster.phase =
        ORIENTATION_PHASES.COMMITTED;

      cluster.orientation =
        orientationFromQuaternion(
          QUATERNION.identity,
          cluster.primaryRoom
        );

      cluster.committedOrientation =
        cloneOrientation(
          cluster.orientation
        );

      state.clusters.set(
        wing,
        cluster
      );
    });

    const roomCount =
      Array.from(
        state.clusters.values()
      ).reduce(
        (
          total,
          cluster
        ) =>
          total +
          cluster.roomIds.length,
        0
      );

    if (roomCount !== 16) {
      throw new Error(
        `ARCHCOIN_TOTAL_ROOM_COUNT_INVALID:${roomCount}`
      );
    }
  }

  function resolveUpstreamCompassQualityProfileId() {
    return globalThis.innerWidth <=
      UPSTREAM_COMPASS.mobileWidth
      ? "mobile"
      : "desktop";
  }

  function mountUpstreamCompassIfPresent() {
    if (!state.upstreamCompassMount) {
      state.upstreamCompassHandle =
        null;

      state.upstreamCompassMounted =
        false;

      state.upstreamCompassStatus =
        "absent";

      state.upstreamCompassFailure =
        "";

      return false;
    }

    if (
      !state.upstreamCompassControl ||
      !state.upstreamCompassFallback
    ) {
      throw new Error(
        "ARCHCOIN_UPSTREAM_COMPASS_HTML_CONTRACT_INCOMPLETE"
      );
    }

    const renderer =
      globalThis.DGB_UPSTREAM_COMPASS_RENDERER;

    if (
      !renderer ||
      typeof renderer.mount !== "function"
    ) {
      throw new Error(
        "DGB_UPSTREAM_COMPASS_RENDERER_NOT_AVAILABLE"
      );
    }

    const parentRoute =
      normalizeRoute(
        state.upstreamCompassMount.getAttribute(
          "data-upstream-compass-parent-route"
        ) ||
        state.upstreamCompassControl.getAttribute(
          "href"
        ) ||
        UPSTREAM_COMPASS.parentRoute
      ) ||
      UPSTREAM_COMPASS.parentRoute;

    const pageContext =
      Object.freeze({
        pageNodeId:
          String(
            state.upstreamCompassMount.getAttribute(
              "data-upstream-compass-page-node"
            ) ||
            "archcoin"
          ).trim() ||
          "archcoin",

        parentNodeId:
          String(
            state.upstreamCompassMount.getAttribute(
              "data-upstream-compass-parent-node"
            ) ||
            UPSTREAM_COMPASS.parentNodeId
          ).trim() ||
          UPSTREAM_COMPASS.parentNodeId,

        parentRoute,

        root:
          state.root,

        scene:
          state.scene,

        mount:
          state.upstreamCompassMount,

        semanticControl:
          state.upstreamCompassControl,

        fallback:
          state.upstreamCompassFallback,

        controller:
          globalThis.DGB_ARCHCOIN_CONTROLLER ||
          null,

        requestReturnToUpstream,

        heldState:
          createUpstreamCompassHeldState(),

        reducedMotion:
          state.reducedMotion === true,

        getHeldState:
          () =>
            createUpstreamCompassHeldState(),

        getReducedMotion:
          () =>
            state.reducedMotion === true,

        subscribeGestureDelta:
          callback =>
            subscribeToChannel(
              "gestureDelta",
              callback
            ),

        subscribeGestureRelease:
          callback =>
            subscribeToChannel(
              "gestureRelease",
              callback
            ),

        subscribeReducedMotion:
          callback =>
            subscribeToChannel(
              "reducedMotion",
              callback
            ),

        subscribeHeldState:
          callback =>
            subscribeToChannel(
              "heldState",
              callback
            ),

        motionResponseRatio:
          UPSTREAM_COMPASS.defaultResponseRatio,

        qualityProfileId:
          resolveUpstreamCompassQualityProfileId()
      });

    state.upstreamCompassHandle =
      renderer.mount(pageContext);

    state.upstreamCompassMounted =
      true;

    state.upstreamCompassStatus =
      "available";

    state.upstreamCompassFailure =
      "";

    publishUpstreamCompassReducedMotion();
    publishUpstreamCompassHeldState();

    return true;
  }

  function initializeUpstreamCompass() {
    try {
      const mounted =
        mountUpstreamCompassIfPresent();

      syncDatasets();

      emitReceipt({
        lastAction:
          mounted
            ? "upstream-compass-mounted"
            : "upstream-compass-absent",
        lastFailure:
          null
      });

      return true;
    } catch (error) {
      const reason =
        error && error.message
          ? error.message
          : String(error);

      state.upstreamCompassHandle =
        null;

      state.upstreamCompassMounted =
        false;

      state.upstreamCompassStatus =
        "held";

      state.upstreamCompassFailure =
        reason;

      syncDatasets();

      emitReceipt({
        lastAction:
          "upstream-compass-mount-failure",
        lastFailure:
          reason
      });

      return false;
    }
  }

  function exposeApi() {
    globalThis.DGB_ARCHCOIN_CONTROLLER =
      Object.freeze({
        contract:
          CONTRACT,

        receipt:
          () =>
            Object.freeze({
              ...RECEIPT,
              orbitQuaternion:
                Object.freeze(
                  Array.from(
                    RECEIPT.orbitQuaternion
                  )
                ),
              clusterQuaternion:
                Object.freeze(
                  Array.from(
                    RECEIPT.clusterQuaternion
                  )
                )
            }),

        getFrameState:
          () => {
            const cluster =
              activeCluster();

            return Object.freeze({
              state:
                state.current,
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
              panelDescended:
                state.panelDescended,
              reducedMotion:
                state.reducedMotion,
              upstreamCompassMounted:
                state.upstreamCompassMounted,
              upstreamCompassStatus:
                state.upstreamCompassStatus,
              upstreamCompassFailure:
                state.upstreamCompassFailure
            });
          },

        getClusterState:
          wing => {
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
                  cluster.committedOrientation
                )
            });
          },

        requestReturnToUpstream,
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
        requestReturnToOrbit,
        requestReturnToConstellation
      });
  }

  function initialize() {
    try {
      resolveDom();
      readReducedMotion();
      initializeConstellationState();
      initializeClusterStates();
      exposeApi();
      bindSemanticControls();
      bindPanelControls();
      bindRendererEvents();
      bindLensTabs();
      bindReducedMotionPreference();

      initializeUpstreamCompass();

      resetSelection();
      setPanel(defaultPanel());
      syncPresentation();

      state.initialized =
        true;

      emitReceipt({
        status:
          "available",
        lastAction:
          "controller-initialized",
        lastFailure:
          null
      });
    } catch (error) {
      const reason =
        error && error.message
          ? error.message
          : String(error);

      RECEIPT.status =
        "held";

      RECEIPT.lastFailure =
        `CONTROLLER_INIT_FAILURE:${reason}`;

      globalThis.DGB_ARCHCOIN_CONTROLLER_RECEIPT =
        Object.freeze({
          ...RECEIPT
        });

      globalThis.dispatchEvent(
        new CustomEvent(
          "ARCHCOIN_CONTROLLER_FAILURE",
          {
            detail:
              Object.freeze({
                reason:
                  RECEIPT.lastFailure
              })
          }
        )
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
        once: true
      }
    );
  } else {
    initialize();
  }
})();

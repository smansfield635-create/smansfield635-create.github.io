/* /products/archcoin/index.controller.js
   ARCHCOIN
   SIMPLIFIED CONSTELLATION CONTROLLER

   Full-file replacement scope:
   - Preserve ARCHCOIN as a visible-first four-coin chamber.
   - Preserve controller authority for semantic page state and panel state.
   - Keep one outer orbit focus for the four main coins.
   - Cut back the room cluster system hard.
   - Treat room stars as selectable local paths, not a second fully independent orbit system.
   - Keep panel behavior below the field controlled and stable.
   - Keep "Return to Orbit" as the only local restoration control.
   - Remove dependence on center-compass behavior.
   - Preserve receipts and fail-soft behavior.
   - Preserve enough public API compatibility for the crystal renderer to attach.

   This file does not:
   - Render crystals.
   - Calculate hit targets.
   - Own visual geometry.
   - Execute financial behavior.
   - Own external navigation beyond ordinary links already present in HTML.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "ARCHCOIN_CONTROLLER_SIMPLIFIED_FIELD_AND_PANEL_v3",
    previousId: "ARCHCOIN_CONTROLLER_SPHERICAL_CONSTELLATION_AND_CLUSTER_REBUILD_v2",
    file: "/products/archcoin/index.controller.js",
    releaseId: "archcoin-controller-simplified-field-and-panel-v3",
    visualPassClaimed: false,
    productionAuthorized: false,
    deploymentAuthorized: false
  });

  const STATES = Object.freeze({
    ORBIT: "ORBIT",
    CLUSTER_OPEN: "CLUSTER_OPEN",
    INFO_OPEN: "INFO_OPEN",
    HELD: "HELD"
  });

  const ORIENTATION_PHASES = Object.freeze({
    IDLE: "IDLE",
    PREVIEW: "PREVIEW",
    COMMITTED: "COMMITTED",
    CANCELLED: "CANCELLED"
  });

  const WINGS = Object.freeze(["north", "east", "south", "west"]);
  const TABS = Object.freeze(["overview", "engineering", "platform", "governance"]);

  const COIN_BY_WING = Object.freeze({
    north: "contract",
    east: "receivable",
    south: "payable",
    west: "allocation"
  });

  const WING_BY_COIN = Object.freeze({
    contract: "north",
    receivable: "east",
    payable: "south",
    allocation: "west"
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

  const CONSTELLATION_ORBIT = Object.freeze({
    coordinateSystem: "RIGHT_HANDED_EUCLIDEAN_XYZ",
    orientationRepresentation: "UNIT_QUATERNION",
    manipulationStates: Object.freeze([STATES.ORBIT]),
    commitStates: Object.freeze([STATES.ORBIT]),
    directCoinSelectionCommitsFocus: true,
    dragCommitOpensCluster: false,
    dragCommitClosesCluster: false
  });

  const CLUSTER_ORBIT = Object.freeze({
    coordinateSystem: "RIGHT_HANDED_EUCLIDEAN_XYZ",
    orientationRepresentation: "UNIT_QUATERNION",
    manipulationStates: Object.freeze([STATES.CLUSTER_OPEN, STATES.INFO_OPEN]),
    commitStates: Object.freeze([STATES.CLUSTER_OPEN, STATES.INFO_OPEN]),
    dragCommitSelectsRoom: false,
    dragCommitDescendsPanel: false,
    flickReturnsToConstellation: true,
    ordinaryDragReturnsToConstellation: false,
    roomSelectionCommitsPrimary: true
  });

  const PROMINENCE = Object.freeze({
    [STATES.ORBIT]: Object.freeze({ compass: 1, window: 0 }),
    [STATES.CLUSTER_OPEN]: Object.freeze({ compass: 1, window: 0 }),
    [STATES.INFO_OPEN]: Object.freeze({ compass: 0.96, window: 0 }),
    [STATES.HELD]: Object.freeze({ compass: 0.8, window: 0 })
  });

  const DEFAULT_PANEL = Object.freeze({
    eyebrow: "Selected path",
    title: "Choose a coin.",
    purpose:
      "Start with one of the four outer coins. Each coin opens its local stars. Select a local star to inspect that path below. Return to Orbit restores the family field.",
    relationship:
      "The field changes only when you select something else. The reading surface below remains stable until another coin or star is selected."
  });

  const DEFAULT_GUIDANCE = Object.freeze({
    ORBIT:
      "Drag the four-coin field or tap a coin to open its local stars. The reading surface below changes only after selection.",
    CLUSTER_OPEN:
      "Select a local star to inspect that path below. Return to Orbit restores the family field.",
    INFO_OPEN:
      "Inspect the selected path below. Return to Orbit restores the family field.",
    HELD:
      "ARCHCOIN controller is held. Interactive field and information descent are unavailable until the controller is restored."
  });

  const COIN_PANEL_COPY = Object.freeze({
    north: Object.freeze({
      eyebrow: "North Coin",
      title: "Contract Coin",
      purpose:
        "Contract Coin governs authority, permissions, terms, signatures, execution frame, and what authorizes movement before value proceeds any farther.",
      relationship:
        "Contract Coin opens four local stars: overview, engineering, platform, and governance."
    }),
    east: Object.freeze({
      eyebrow: "East Coin",
      title: "Receivable Coin",
      purpose:
        "Receivable Coin governs inbound value, arrival visibility, inflow accounting, source reading, and how received value becomes legible inside the family field.",
      relationship:
        "Receivable Coin opens four local stars: overview, engineering, platform, and governance."
    }),
    south: Object.freeze({
      eyebrow: "South Coin",
      title: "Payable Coin",
      purpose:
        "Payable Coin governs obligation, settlement pressure, what is owed, how duty is carried, and how outgoing liability remains visible rather than disappearing behind vague movement.",
      relationship:
        "Payable Coin opens four local stars: overview, engineering, platform, and governance."
    }),
    west: Object.freeze({
      eyebrow: "West Coin",
      title: "Allocation Coin",
      purpose:
        "Allocation Coin governs distribution, retained value, growth channels, allocation rules, and how expansion remains disciplined inside the family frame.",
      relationship:
        "Allocation Coin opens four local stars: overview, engineering, platform, and governance."
    })
  });

  const RECEIPT = {
    contractId: CONTRACT.id,
    previousContractId: CONTRACT.previousId,
    status: "pending",
    state: STATES.ORBIT,
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
    selectedWing: "",
    selectedCoin: "",
    selectedRoom: "",
    selectedDestinationType: "",
    selectedDestinationId: "",
    selectedDestinationLabel: "",
    selectedRoute: "",
    activeTab: "overview",
    panelDescended: false,
    compassMenuOpen: false,
    sphericalConstellationEnabled: true,
    sphericalClustersEnabled: false,
    lastAction: "",
    lastFailure: null,
    visualPassClaimed: false
  };

  const state = {
    root: null,
    scene: null,
    objects: null,
    panel: null,
    panelEyebrow: null,
    panelTitle: null,
    panelPurpose: null,
    panelRelationship: null,
    returnToOrbitButton: null,
    returnToClusterButton: null,
    guidance: null,
    controllerReceiptOutput: null,
    lensTabs: new Map(),
    lensPanels: new Map(),

    current: STATES.ORBIT,

    orbitFocus: "north",
    orbitPreviewFocus: "north",
    orbitPhase: ORIENTATION_PHASES.COMMITTED,
    orbitGestureActive: false,
    orbitRevision: 0,
    orbitOrientation: null,
    committedOrbitOrientation: null,
    orbitGestureOrigin: null,

    clusters: new Map(),

    selectedWing: "",
    selectedCoin: "",
    selectedRoom: "",
    selectedDestinationType: "",
    selectedDestinationId: "",
    selectedDestinationLabel: "",
    selectedRoute: "",

    activeTab: "overview",
    panelDescended: false,

    panelDescentFrame: 0,
    panelDescentCommitFrame: 0,
    sceneAscentFrame: 0,
    sceneAscentCommitFrame: 0,

    compassMenuOpen: false,
    initialized: false,
    reducedMotion: false
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

  function normalizeRoomId(value) {
    return String(value || "").trim();
  }

  function normalizeTab(value) {
    const tab = String(value || "").trim().toLowerCase();
    return TABS.includes(tab) ? tab : "overview";
  }

  function normalizeRoute(value) {
    const route = String(value || "").trim();
    return route.startsWith("/") || route.startsWith("#") ? route : "";
  }

  function cssEscape(value) {
    const text = String(value || "");
    if (globalThis.CSS && typeof globalThis.CSS.escape === "function") {
      return globalThis.CSS.escape(text);
    }
    return text.replace(/["\\]/g, "\\$&");
  }

  function coinForWing(wing) {
    return COIN_BY_WING[normalizeWing(wing)] || "";
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
    return Math.hypot(quaternion[0], quaternion[1], quaternion[2], quaternion[3]);
  }

  function normalizeQuaternion(value, fallback = QUATERNION.identity) {
    const source =
      Array.isArray(value) || ArrayBuffer.isView(value) ? Array.from(value) : [];

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
    const safePitch = clamp(finiteNumber(pitch, 0), -Math.PI / 2, Math.PI / 2);
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

    const yaw = Math.atan2(2 * (w * z + x * y), 1 - 2 * (y * y + z * z));
    const roll = Math.atan2(2 * (w * x + y * z), 1 - 2 * (x * x + y * y));

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
      pitch: clamp(finiteNumber(pitch, 0), -Math.PI / 2, Math.PI / 2),
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
    const source = orientation || orientationFromQuaternion(QUATERNION.identity);

    return {
      yaw: finiteNumber(source.yaw, 0),
      pitch: finiteNumber(source.pitch, 0),
      roll: finiteNumber(source.roll, 0),
      quaternion: normalizeQuaternion(source.quaternion),
      primaryId: String(source.primaryId || "").trim()
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

    if (Array.isArray(payload.quaternion) || ArrayBuffer.isView(payload.quaternion)) {
      return orientationFromQuaternion(payload.quaternion, primaryId);
    }

    if (
      payload.orientation &&
      (Array.isArray(payload.orientation.quaternion) ||
        ArrayBuffer.isView(payload.orientation.quaternion))
    ) {
      return orientationFromQuaternion(
        payload.orientation.quaternion,
        primaryId || payload.orientation.primaryId
      );
    }

    return orientationFromEuler(
      payload.yaw !== undefined ? payload.yaw : fallback.yaw,
      payload.pitch !== undefined ? payload.pitch : fallback.pitch,
      payload.roll !== undefined ? payload.roll : fallback.roll,
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
      orientation: orientationFromQuaternion(QUATERNION.identity),
      committedOrientation: orientationFromQuaternion(QUATERNION.identity),
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
    return normalizeWing(state.selectedWing || state.orbitFocus);
  }

  function activeCluster() {
    return getCluster(activeClusterWing());
  }

  function clusterContainsRoom(cluster, roomId) {
    return Boolean(cluster && cluster.roomIds.includes(normalizeRoomId(roomId)));
  }

  function findCoinElement(wing) {
    const normalized = normalizeWing(wing);
    if (!normalized) {
      return null;
    }
    return qs(`[data-archcoin-cardinal][data-wing="${normalized}"]`, state.root);
  }

  function findRoomElement(roomId) {
    const id = normalizeRoomId(roomId);
    if (!id) {
      return null;
    }
    return qs(`[data-archcoin-room][data-room-id="${cssEscape(id)}"]`, state.root);
  }

  function destinationFromElement(element) {
    if (!element) {
      return null;
    }

    const destinationType = String(element.dataset.destinationType || "").trim().toLowerCase();
    const destinationId = String(
      element.dataset.destinationId || element.dataset.roomId || element.dataset.coinId || ""
    ).trim();
    const label = String(
      element.dataset.label ||
        element.dataset.panelTitle ||
        element.dataset.coordinateLabel ||
        element.textContent ||
        ""
    ).trim();
    const route = normalizeRoute(element.dataset.route || element.getAttribute("href") || "");

    return {
      element,
      destinationType,
      destinationId,
      label,
      route
    };
  }

  function panelFromCoin(element) {
    const wing = normalizeWing(element.dataset.wing);
    const copy = COIN_PANEL_COPY[wing] || DEFAULT_PANEL;

    return {
      eyebrow: copy.eyebrow,
      title: copy.title,
      purpose: copy.purpose,
      relationship: copy.relationship
    };
  }

  function panelFromRoom(element) {
    return {
      eyebrow: element.dataset.localCoordinate || element.dataset.label || "Information point",
      title: element.dataset.label || element.dataset.roomId || "Information",
      purpose:
        element.dataset.preview ||
        element.dataset.whyEnter ||
        "This information point explains the selected ARCHCOIN path.",
      relationship:
        element.dataset.localFunction ||
        "This information point remains local to the selected coin."
    };
  }

  function setPanel({ eyebrow, title, purpose, relationship }) {
    if (state.panelEyebrow) {
      state.panelEyebrow.textContent = eyebrow || DEFAULT_PANEL.eyebrow;
    }
    if (state.panelTitle) {
      state.panelTitle.textContent = title || DEFAULT_PANEL.title;
    }
    if (state.panelPurpose) {
      state.panelPurpose.textContent = purpose || DEFAULT_PANEL.purpose;
    }
    if (state.panelRelationship) {
      state.panelRelationship.textContent = relationship || DEFAULT_PANEL.relationship;
    }
  }

  function setGuidance(message) {
    if (state.guidance) {
      state.guidance.textContent = message || "";
    }
  }

  function setHiddenControl(control, hidden) {
    if (!control) {
      return;
    }

    control.hidden = hidden;
    control.disabled = hidden;
    control.setAttribute("aria-hidden", hidden ? "true" : "false");
    control.setAttribute("aria-disabled", hidden ? "true" : "false");

    if (hidden) {
      control.setAttribute("tabindex", "-1");
    } else {
      control.removeAttribute("tabindex");
    }
  }

  function prominenceFor(currentState) {
    return PROMINENCE[currentState] || PROMINENCE[STATES.HELD];
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

  function setPanelDescended(descended) {
    state.panelDescended = Boolean(descended);
  }

  function schedulePanelDescent(expectedRoomId) {
    clearViewportSchedules();

    const roomId = normalizeRoomId(expectedRoomId);
    if (!roomId || !state.panel) {
      return;
    }

    state.panelDescentFrame = requestAnimationFrame(() => {
      state.panelDescentFrame = 0;

      state.panelDescentCommitFrame = requestAnimationFrame(() => {
        state.panelDescentCommitFrame = 0;

        if (state.current !== STATES.INFO_OPEN || state.selectedRoom !== roomId || !state.panel) {
          return;
        }

        state.panel.scrollIntoView({
          behavior: state.reducedMotion ? "auto" : "smooth",
          block: "start",
          inline: "nearest"
        });

        emitReceipt({
          lastAction: `panel-descended:${roomId}`,
          lastFailure: null
        });
      });
    });
  }

  function scheduleSceneAscent(expectedWing) {
    clearViewportSchedules();

    const wing = normalizeWing(expectedWing);
    if (!wing || !state.scene) {
      return;
    }

    state.sceneAscentFrame = requestAnimationFrame(() => {
      state.sceneAscentFrame = 0;

      state.sceneAscentCommitFrame = requestAnimationFrame(() => {
        state.sceneAscentCommitFrame = 0;

        if (
          state.current !== STATES.CLUSTER_OPEN ||
          state.selectedWing !== wing ||
          state.selectedRoom ||
          !state.scene
        ) {
          return;
        }

        state.scene.scrollIntoView({
          behavior: state.reducedMotion ? "auto" : "smooth",
          block: "start",
          inline: "nearest"
        });

        emitReceipt({
          lastAction: `returned-to-orbit:${wing}`,
          lastFailure: null
        });
      });
    });
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
    const normalized = cloneOrientation(orientation);
    const primaryWing = normalizeWing(normalized.primaryId);

    normalized.primaryId =
      primaryWing || state.orbitPreviewFocus || state.orbitFocus || "north";

    state.orbitOrientation = normalized;
    state.orbitPreviewFocus = normalized.primaryId;
    state.orbitPhase = phase;
    state.orbitGestureActive = Boolean(gestureActive);

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
      incrementRevision = false
    } = {}
  ) {
    if (!cluster) {
      return false;
    }

    const normalized = cloneOrientation(orientation);
    const primaryRoom = normalizeRoomId(normalized.primaryId);

    normalized.primaryId = clusterContainsRoom(cluster, primaryRoom)
      ? primaryRoom
      : cluster.primaryRoom || cluster.roomIds[0] || "";

    cluster.orientation = normalized;
    cluster.previewPrimaryRoom = normalized.primaryId;
    cluster.phase = phase;
    cluster.gestureActive = Boolean(gestureActive);

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

  function resetSelection() {
    state.selectedWing = "";
    state.selectedCoin = "";
    state.selectedRoom = "";
    state.selectedDestinationType = "";
    state.selectedDestinationId = "";
    state.selectedDestinationLabel = "";
    state.selectedRoute = "";
    setPanelDescended(false);
  }

  function syncCompassMenu() {
    if (state.scene) {
      state.scene.dataset.archcoinCompassMenu = "closed";
    }
  }

  function syncLensTabs() {
    const selectedTab = normalizeTab(state.activeTab);

    state.lensTabs.forEach((button, tab) => {
      const active = tab === selectedTab;
      button.setAttribute("aria-selected", active ? "true" : "false");
      button.tabIndex = active ? 0 : -1;
    });

    state.lensPanels.forEach((panel, tab) => {
      panel.hidden = tab !== selectedTab;
    });
  }

  function syncDatasets() {
    if (!state.root) {
      return;
    }

    const prominence = prominenceFor(state.current);
    const orbit = cloneOrientation(
      state.orbitOrientation || canonicalConstellationOrientation(state.orbitFocus)
    );
    const cluster = activeCluster();

    state.root.dataset.archcoinState =
      state.current === STATES.ORBIT
        ? "orbit"
        : state.current === STATES.CLUSTER_OPEN
          ? "cluster-open"
          : state.current === STATES.INFO_OPEN
            ? "info-open"
            : "held";

    state.root.dataset.orbitFocus = state.orbitFocus;
    state.root.dataset.orbitPreviewFocus = state.orbitPreviewFocus;
    state.root.dataset.orbitPhase = state.orbitPhase;
    state.root.dataset.orbitGestureActive = state.orbitGestureActive ? "true" : "false";
    state.root.dataset.orbitRevision = String(state.orbitRevision);
    state.root.dataset.orbitQuaternion = JSON.stringify(orbit.quaternion);

    state.root.dataset.activeClusterWing = cluster ? cluster.wing : "";
    state.root.dataset.clusterPrimaryRoom = cluster ? cluster.primaryRoom : "";
    state.root.dataset.clusterPreviewPrimaryRoom = cluster ? cluster.previewPrimaryRoom : "";
    state.root.dataset.clusterPhase = cluster ? cluster.phase : ORIENTATION_PHASES.IDLE;
    state.root.dataset.clusterGestureActive =
      cluster && cluster.gestureActive ? "true" : "false";
    state.root.dataset.clusterRevision = String(cluster ? cluster.revision : 0);
    state.root.dataset.clusterQuaternion = cluster
      ? JSON.stringify(cluster.orientation.quaternion)
      : "";

    state.root.dataset.selectedCardinal = state.selectedWing;
    state.root.dataset.selectedWing = state.selectedWing;
    state.root.dataset.selectedCoin = state.selectedCoin;
    state.root.dataset.selectedRoom = state.selectedRoom;
    state.root.dataset.selectedDestinationType = state.selectedDestinationType;
    state.root.dataset.selectedDestinationId = state.selectedDestinationId;
    state.root.dataset.selectedDestinationLabel = state.selectedDestinationLabel;
    state.root.dataset.selectedRoute = state.selectedRoute;
    state.root.dataset.panelDescended = state.panelDescended ? "true" : "false";
    state.root.dataset.reducedMotion = state.reducedMotion ? "true" : "false";
    state.root.dataset.compassProminence = String(prominence.compass);
    state.root.dataset.windowProminence = String(prominence.window);
    state.root.dataset.archcoinCompassMenuOpen = "false";
    state.root.dataset.visualPassClaimed = "false";

    if (state.scene) {
      state.scene.dataset.archcoinState =
        state.current === STATES.ORBIT
          ? "orbit"
          : state.current === STATES.CLUSTER_OPEN
            ? "cluster-open"
            : state.current === STATES.INFO_OPEN
              ? "info-open"
              : "held";

      state.scene.dataset.archcoinSelectedWing = state.selectedWing;
      state.scene.dataset.archcoinSelectedRoom = state.selectedRoom;
      state.scene.dataset.archcoinActiveTab = state.activeTab;
      state.scene.dataset.archcoinCompassMenu = "closed";
      state.scene.dataset.visualPassClaimed = "false";
    }

    qsa("[data-archcoin-cardinal]", state.root).forEach(element => {
      const wing = normalizeWing(element.dataset.wing);
      const selected =
        wing === state.selectedWing &&
        (state.current === STATES.CLUSTER_OPEN || state.current === STATES.INFO_OPEN);
      const primary = wing === state.orbitFocus && state.current === STATES.ORBIT;

      element.dataset.selected = selected ? "true" : "false";
      element.dataset.primary = primary ? "true" : "false";

      if (selected || primary) {
        element.setAttribute("aria-current", "true");
      } else {
        element.removeAttribute("aria-current");
      }
    });

    qsa("[data-archcoin-room]", state.root).forEach(element => {
      const roomId = normalizeRoomId(element.dataset.roomId);
      const selected = roomId === state.selectedRoom;
      const primary = Boolean(cluster && roomId === cluster.primaryRoom);

      element.dataset.selected = selected ? "true" : "false";
      element.dataset.primary = primary ? "true" : "false";

      if (selected || primary) {
        element.setAttribute("aria-current", "true");
      } else {
        element.removeAttribute("aria-current");
      }
    });
  }

  function emitReceipt(extra = {}) {
    const orbit = cloneOrientation(
      state.orbitOrientation || canonicalConstellationOrientation(state.orbitFocus)
    );
    const cluster = activeCluster();

    Object.assign(
      RECEIPT,
      {
        status: state.current === STATES.HELD ? "held" : "available",
        state: state.current,
        orbitFocus: state.orbitFocus,
        orbitPreviewFocus: state.orbitPreviewFocus,
        orbitPhase: state.orbitPhase,
        orbitGestureActive: state.orbitGestureActive,
        orbitRevision: state.orbitRevision,
        orbitQuaternion: Object.freeze(orbit.quaternion.slice()),
        activeClusterWing: cluster ? cluster.wing : "",
        clusterPrimaryRoom: cluster ? cluster.primaryRoom : "",
        clusterPreviewPrimaryRoom: cluster ? cluster.previewPrimaryRoom : "",
        clusterPhase: cluster ? cluster.phase : ORIENTATION_PHASES.IDLE,
        clusterGestureActive: cluster ? cluster.gestureActive : false,
        clusterRevision: cluster ? cluster.revision : 0,
        clusterQuaternion: Object.freeze(
          cluster ? cluster.orientation.quaternion.slice() : QUATERNION.identity.slice()
        ),
        selectedWing: state.selectedWing,
        selectedCoin: state.selectedCoin,
        selectedRoom: state.selectedRoom,
        selectedDestinationType: state.selectedDestinationType,
        selectedDestinationId: state.selectedDestinationId,
        selectedDestinationLabel: state.selectedDestinationLabel,
        selectedRoute: state.selectedRoute,
        activeTab: state.activeTab,
        panelDescended: state.panelDescended,
        compassMenuOpen: false,
        sphericalConstellationEnabled: true,
        sphericalClustersEnabled: false,
        visualPassClaimed: false
      },
      extra
    );

    const serialized = JSON.stringify(RECEIPT);

    if (state.root) {
      state.root.dataset.archcoinControllerReceipt = serialized;
      state.root.dataset.archcoinControllerStatus = RECEIPT.status;
      state.root.dataset.visualPassClaimed = "false";
    }

    if (state.controllerReceiptOutput) {
      state.controllerReceiptOutput.value = serialized;
      state.controllerReceiptOutput.textContent = serialized;
      state.controllerReceiptOutput.dataset.visualPassClaimed = "false";
    }

    globalThis.DGB_ARCHCOIN_CONTROLLER_RECEIPT = Object.freeze({
      ...RECEIPT,
      orbitQuaternion: Object.freeze(Array.from(RECEIPT.orbitQuaternion)),
      clusterQuaternion: Object.freeze(Array.from(RECEIPT.clusterQuaternion))
    });
  }

  function syncPresentation() {
    syncDatasets();
    syncCompassMenu();
    syncLensTabs();

    if (state.current === STATES.HELD) {
      setPanel({
        eyebrow: "Controller held",
        title: "ARCHCOIN controller is unavailable.",
        purpose:
          "The page has entered a held state. Interactive field and local information descent are suspended until the controller is restored.",
        relationship: "Controller recovery is required before interactive descent resumes."
      });

      setGuidance(DEFAULT_GUIDANCE.HELD);
      setHiddenControl(state.returnToOrbitButton, true);
      setHiddenControl(state.returnToClusterButton, true);
      return;
    }

    if (state.current === STATES.ORBIT) {
      setPanel(DEFAULT_PANEL);
      setGuidance(DEFAULT_GUIDANCE.ORBIT);
      setHiddenControl(state.returnToOrbitButton, true);
      setHiddenControl(state.returnToClusterButton, true);
      return;
    }

    if (state.current === STATES.CLUSTER_OPEN) {
      const coinElement = findCoinElement(state.selectedWing);
      if (coinElement) {
        setPanel(panelFromCoin(coinElement));
      }

      setGuidance(DEFAULT_GUIDANCE.CLUSTER_OPEN);
      setHiddenControl(state.returnToOrbitButton, false);
      setHiddenControl(state.returnToClusterButton, true);
      return;
    }

    if (state.current === STATES.INFO_OPEN) {
      const roomElement = findRoomElement(state.selectedRoom);
      if (roomElement) {
        setPanel(panelFromRoom(roomElement));
      }

      setGuidance(DEFAULT_GUIDANCE.INFO_OPEN);
      setHiddenControl(state.returnToOrbitButton, false);
      setHiddenControl(state.returnToClusterButton, true);
    }
  }

  function fail(reason, action = "controller-failure") {
    clearViewportSchedules();
    cancelAllGestures("controller-failure");
    state.current = STATES.HELD;
    setPanelDescended(false);
    syncPresentation();

    emitReceipt({
      lastAction: action,
      lastFailure: String(reason || "UNKNOWN_FAILURE")
    });
  }

  function cancelAllGestures(reason) {
    if (state.orbitGestureActive) {
      requestOrbitCancel(reason);
    }

    state.clusters.forEach(cluster => {
      if (cluster.gestureActive) {
        requestClusterCancel(cluster.wing, reason);
      }
    });
  }

  function readReducedMotion() {
    state.reducedMotion =
      Boolean(
        globalThis.matchMedia &&
          globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) || state.root.dataset.reducedMotion === "true";
  }

  function initializeConstellationState() {
    const requestedFocus = normalizeWing(state.root.dataset.orbitFocus) || "north";
    let initialOrientation = canonicalConstellationOrientation(requestedFocus);

    const serialized = String(state.root.dataset.orbitQuaternion || "").trim();
    if (serialized) {
      try {
        initialOrientation = orientationFromQuaternion(JSON.parse(serialized), requestedFocus);
      } catch (_) {}
    }

    state.orbitFocus = requestedFocus;
    state.orbitPreviewFocus = requestedFocus;
    state.orbitPhase = ORIENTATION_PHASES.COMMITTED;
    state.orbitGestureActive = false;
    state.orbitRevision = finiteNumber(state.root.dataset.orbitRevision, 0);
    state.orbitOrientation = cloneOrientation(initialOrientation);
    state.committedOrbitOrientation = cloneOrientation(initialOrientation);
    state.orbitGestureOrigin = null;
  }

  function initializeClusterStates() {
    state.clusters.clear();

    WINGS.forEach(wing => {
      const cluster = createClusterState(wing);

      cluster.roomIds = qsa(`[data-archcoin-room][data-wing="${wing}"]`, state.root)
        .map(element => normalizeRoomId(element.dataset.roomId))
        .filter(Boolean);

      if (cluster.roomIds.length !== 4) {
        throw new Error(`CLUSTER_ROOM_DECLARATIONS_INVALID:${wing}:${cluster.roomIds.length}`);
      }

      cluster.primaryRoom = cluster.roomIds[0];
      cluster.previewPrimaryRoom = cluster.roomIds[0];
      cluster.phase = ORIENTATION_PHASES.COMMITTED;
      cluster.orientation = orientationFromQuaternion(QUATERNION.identity, cluster.primaryRoom);
      cluster.committedOrientation = cloneOrientation(cluster.orientation);

      state.clusters.set(wing, cluster);
    });

    const roomCount = Array.from(state.clusters.values()).reduce(
      (total, cluster) => total + cluster.roomIds.length,
      0
    );

    if (roomCount !== 16) {
      throw new Error(`CLUSTER_ROOM_COUNT_INVALID:${roomCount}`);
    }
  }

  function canManipulateConstellation() {
    return CONSTELLATION_ORBIT.manipulationStates.includes(state.current);
  }

  function canCommitConstellation() {
    return CONSTELLATION_ORBIT.commitStates.includes(state.current);
  }

  function canManipulateCluster(wing = activeClusterWing()) {
    return Boolean(
      normalizeWing(wing) &&
        CLUSTER_ORBIT.manipulationStates.includes(state.current) &&
        normalizeWing(state.selectedWing) === normalizeWing(wing)
    );
  }

  function canCommitCluster(wing = activeClusterWing()) {
    return Boolean(
      normalizeWing(wing) &&
        CLUSTER_ORBIT.commitStates.includes(state.current) &&
        normalizeWing(state.selectedWing) === normalizeWing(wing)
    );
  }

  function beginOrbitGesture(payload = {}) {
    if (!canManipulateConstellation()) {
      return false;
    }

    if (state.orbitGestureActive) {
      return true;
    }

    state.orbitGestureOrigin = cloneOrientation(
      state.committedOrbitOrientation || state.orbitOrientation
    );

    const preview = resolveOrientation(payload, state.orbitOrientation);

    setConstellationOrientation(preview, {
      committed: false,
      phase: ORIENTATION_PHASES.PREVIEW,
      gestureActive: true
    });

    syncPresentation();

    emitReceipt({
      lastAction: "orbit-gesture-began",
      lastFailure: null
    });

    return true;
  }

  function requestOrbitPreview(payload = {}) {
    if (!canManipulateConstellation()) {
      return false;
    }

    if (!state.orbitGestureActive) {
      beginOrbitGesture();
    }

    const orientation = resolveOrientation(payload, state.orbitOrientation);

    setConstellationOrientation(orientation, {
      committed: false,
      phase: ORIENTATION_PHASES.PREVIEW,
      gestureActive: true
    });

    syncDatasets();
    return true;
  }

  function requestOrbitCommit(payload = {}) {
    if (!canCommitConstellation()) {
      return false;
    }

    const orientation = resolveOrientation(
      payload,
      state.orbitOrientation || state.committedOrbitOrientation
    );

    const primaryWing = normalizeWing(
      payload.primaryWing ||
        payload.primaryId ||
        orientation.primaryId ||
        state.orbitPreviewFocus ||
        state.orbitFocus
    );

    if (!primaryWing) {
      emitReceipt({
        lastAction: "orbit-commit-rejected",
        lastFailure: "ORBIT_PRIMARY_WING_REQUIRED"
      });
      return false;
    }

    orientation.primaryId = primaryWing;

    setConstellationOrientation(orientation, {
      committed: true,
      phase: ORIENTATION_PHASES.COMMITTED,
      gestureActive: false,
      incrementRevision: true
    });

    state.orbitGestureOrigin = null;
    setPanelDescended(false);

    syncPresentation();

    emitReceipt({
      lastAction: `orbit-committed:${primaryWing}`,
      lastFailure: null,
      orbitCommitSource: String(payload.source || "renderer")
    });

    return true;
  }

  function requestOrbitCancel(reason = "cancelled") {
    if (!state.orbitGestureActive && state.orbitPhase !== ORIENTATION_PHASES.PREVIEW) {
      return false;
    }

    const restored = cloneOrientation(
      state.orbitGestureOrigin ||
        state.committedOrbitOrientation ||
        canonicalConstellationOrientation(state.orbitFocus)
    );

    setConstellationOrientation(restored, {
      committed: false,
      phase: ORIENTATION_PHASES.CANCELLED,
      gestureActive: false
    });

    state.orbitGestureOrigin = null;

    syncPresentation();

    emitReceipt({
      lastAction: `orbit-preview-cancelled:${String(reason || "cancelled")}`,
      lastFailure: null
    });

    return true;
  }

  function requestOrbitFocus(wing, options = {}) {
    const normalizedWing = normalizeWing(wing);

    if (!normalizedWing || !canCommitConstellation()) {
      return false;
    }

    const canonical = canonicalConstellationOrientation(normalizedWing);

    return requestOrbitCommit({
      ...canonical,
      primaryWing: normalizedWing,
      source: options.source || "direct-focus"
    });
  }

  function beginClusterGesture(wingOrPayload, maybePayload = {}) {
    const wing =
      typeof wingOrPayload === "string" ? normalizeWing(wingOrPayload) : activeClusterWing();

    const payload =
      typeof wingOrPayload === "object" && wingOrPayload !== null
        ? wingOrPayload
        : maybePayload;

    const cluster = getCluster(wing);

    if (!cluster || !canManipulateCluster(wing)) {
      return false;
    }

    if (cluster.gestureActive) {
      return true;
    }

    cluster.gestureOrigin = cloneOrientation(cluster.committedOrientation || cluster.orientation);

    const preview = resolveOrientation(payload, cluster.orientation);

    setClusterOrientation(cluster, preview, {
      committed: false,
      phase: ORIENTATION_PHASES.PREVIEW,
      gestureActive: true
    });

    syncPresentation();

    emitReceipt({
      lastAction: `cluster-gesture-began:${wing}`,
      lastFailure: null
    });

    return true;
  }

  function requestClusterPreview(wingOrPayload, maybePayload = {}) {
    const wing =
      typeof wingOrPayload === "string" ? normalizeWing(wingOrPayload) : activeClusterWing();

    const payload =
      typeof wingOrPayload === "object" && wingOrPayload !== null
        ? wingOrPayload
        : maybePayload;

    const cluster = getCluster(wing);

    if (!cluster || !canManipulateCluster(wing)) {
      return false;
    }

    if (!cluster.gestureActive) {
      beginClusterGesture(wing);
    }

    const orientation = resolveOrientation(payload, cluster.orientation);
    const primaryRoom = normalizeRoomId(
      payload.primaryRoom || payload.primaryId || orientation.primaryId
    );

    if (primaryRoom && !clusterContainsRoom(cluster, primaryRoom)) {
      return false;
    }

    orientation.primaryId =
      primaryRoom ||
      cluster.primaryRoom ||
      cluster.roomIds[0] ||
      "";

    setClusterOrientation(cluster, orientation, {
      committed: false,
      phase: ORIENTATION_PHASES.PREVIEW,
      gestureActive: true
    });

    syncDatasets();
    return true;
  }

  function requestClusterCommit(wingOrPayload, maybePayload = {}) {
    const wing =
      typeof wingOrPayload === "string" ? normalizeWing(wingOrPayload) : activeClusterWing();

    const payload =
      typeof wingOrPayload === "object" && wingOrPayload !== null
        ? wingOrPayload
        : maybePayload;

    const cluster = getCluster(wing);

    if (!cluster || !canCommitCluster(wing)) {
      return false;
    }

    const orientation = resolveOrientation(
      payload,
      cluster.orientation || cluster.committedOrientation
    );

    const primaryRoom = normalizeRoomId(
      payload.primaryRoom ||
        payload.primaryId ||
        orientation.primaryId ||
        cluster.primaryRoom
    );

    if (!primaryRoom || !clusterContainsRoom(cluster, primaryRoom)) {
      emitReceipt({
        lastAction: `cluster-commit-rejected:${wing}`,
        lastFailure: "CLUSTER_PRIMARY_ROOM_REQUIRED"
      });
      return false;
    }

    orientation.primaryId = primaryRoom;

    setClusterOrientation(cluster, orientation, {
      committed: true,
      phase: ORIENTATION_PHASES.COMMITTED,
      gestureActive: false,
      incrementRevision: true
    });

    cluster.gestureOrigin = null;

    syncPresentation();

    emitReceipt({
      lastAction: `cluster-committed:${wing}:${primaryRoom}`,
      lastFailure: null,
      clusterCommitSource: String(payload.source || "renderer")
    });

    return true;
  }

  function requestClusterCancel(wingOrReason, maybeReason = "cancelled") {
    const possibleWing = normalizeWing(wingOrReason);
    const wing = possibleWing || activeClusterWing();
    const reason = possibleWing ? maybeReason : wingOrReason || maybeReason;
    const cluster = getCluster(wing);

    if (!cluster || (!cluster.gestureActive && cluster.phase !== ORIENTATION_PHASES.PREVIEW)) {
      return false;
    }

    const restored = cloneOrientation(
      cluster.gestureOrigin ||
        cluster.committedOrientation ||
        orientationFromQuaternion(QUATERNION.identity, cluster.primaryRoom)
    );

    setClusterOrientation(cluster, restored, {
      committed: false,
      phase: ORIENTATION_PHASES.CANCELLED,
      gestureActive: false
    });

    cluster.gestureOrigin = null;

    syncPresentation();

    emitReceipt({
      lastAction: `cluster-preview-cancelled:${wing}:${String(reason || "cancelled")}`,
      lastFailure: null
    });

    return true;
  }

  function requestCoinSelection(wing, source = "controller") {
    const normalizedWing = normalizeWing(wing);

    if (!normalizedWing || state.current !== STATES.ORBIT) {
      return false;
    }

    const element = findCoinElement(normalizedWing);
    if (!element) {
      fail(`COIN_NOT_FOUND:${normalizedWing}`, "requestCoinSelection");
      return false;
    }

    if (state.orbitGestureActive) {
      requestOrbitCancel("coin-selection");
    }

    if (CONSTELLATION_ORBIT.directCoinSelectionCommitsFocus) {
      requestOrbitFocus(normalizedWing, { source });
    }

    clearViewportSchedules();
    setPanelDescended(false);

    const destination = destinationFromElement(element);
    const cluster = getCluster(normalizedWing);

    state.selectedWing = normalizedWing;
    state.selectedCoin = coinForWing(normalizedWing);
    state.selectedRoom = "";
    state.selectedDestinationType = "coin";
    state.selectedDestinationId = state.selectedCoin;
    state.selectedDestinationLabel =
      destination.label || element.dataset.panelTitle || normalizedWing;
    state.selectedRoute = destination.route || "";

    if (cluster) {
      cluster.primaryRoom = cluster.primaryRoom || cluster.roomIds[0] || "";
      cluster.previewPrimaryRoom = cluster.primaryRoom;
      cluster.phase = ORIENTATION_PHASES.COMMITTED;
    }

    setPanel(panelFromCoin(element));

    return setState(
      STATES.CLUSTER_OPEN,
      `coin-selected:${normalizedWing}:${String(source || "controller")}`
    );
  }

  function requestRoomSelection(roomId, source = "controller") {
    const id = normalizeRoomId(roomId);

    if (!id || (state.current !== STATES.CLUSTER_OPEN && state.current !== STATES.INFO_OPEN)) {
      return false;
    }

    const element = findRoomElement(id);
    if (!element) {
      fail(`ROOM_NOT_FOUND:${id}`, "requestRoomSelection");
      return false;
    }

    const wing = normalizeWing(element.dataset.wing);
    if (!wing || wing !== state.selectedWing) {
      return false;
    }

    const cluster = getCluster(wing);
    if (!cluster || !clusterContainsRoom(cluster, id)) {
      fail(`ROOM_CLUSTER_INVALID:${id}`, "requestRoomSelection");
      return false;
    }

    if (cluster.gestureActive) {
      requestClusterCancel(wing, "room-selection");
    }

    clearViewportSchedules();

    cluster.primaryRoom = id;
    cluster.previewPrimaryRoom = id;
    cluster.phase = ORIENTATION_PHASES.COMMITTED;

    const destination = destinationFromElement(element);

    state.selectedRoom = id;
    state.selectedCoin = coinForWing(wing);
    state.selectedDestinationType = "info";
    state.selectedDestinationId = id;
    state.selectedDestinationLabel = destination.label;
    state.selectedRoute = destination.route || "";
    state.activeTab = normalizeTab(element.dataset.tab);
    setPanelDescended(true);

    setPanel(panelFromRoom(element));

    const committed = setState(
      STATES.INFO_OPEN,
      `room-selected:${id}:${String(source || "controller")}`
    );

    if (!committed) {
      setPanelDescended(false);
      return false;
    }

    schedulePanelDescent(id);
    return true;
  }

  function requestReturnToConstellation(options = {}) {
    if (state.current !== STATES.CLUSTER_OPEN && state.current !== STATES.INFO_OPEN) {
      return false;
    }

    const wing = normalizeWing(state.selectedWing || state.orbitFocus) || "north";
    const cluster = getCluster(wing);

    if (cluster && cluster.gestureActive) {
      requestClusterCancel(wing, "return-to-constellation");
    }

    clearViewportSchedules();
    resetSelection();
    state.orbitFocus = wing;
    state.orbitPreviewFocus = wing;
    state.activeTab = "overview";

    setPanel(DEFAULT_PANEL);

    const committed = setState(
      STATES.ORBIT,
      `returned-to-constellation:${wing}:${String(options.source || "controller")}`
    );

    if (!committed) {
      return false;
    }

    if (options.scrollToScene !== false && state.scene) {
      state.scene.scrollIntoView({
        behavior: state.reducedMotion ? "auto" : "smooth",
        block: "start",
        inline: "nearest"
      });
    }

    emitReceipt({
      lastAction: `returned-to-constellation:${wing}`,
      lastFailure: null,
      returnSource: String(options.source || "controller")
    });

    return true;
  }

  function requestReturnToOrbit(options = {}) {
    if (state.current !== STATES.CLUSTER_OPEN && state.current !== STATES.INFO_OPEN) {
      return false;
    }

    const wing = normalizeWing(state.selectedWing || state.orbitFocus);
    const coinElement = findCoinElement(wing);

    if (!coinElement) {
      fail(`COIN_NOT_FOUND:${wing}`, "requestReturnToOrbit");
      return false;
    }

    clearViewportSchedules();
    setPanelDescended(false);

    state.selectedWing = wing;
    state.selectedCoin = coinForWing(wing);
    state.selectedRoom = "";
    state.selectedDestinationType = "coin";
    state.selectedDestinationId = coinForWing(wing);

    const destination = destinationFromElement(coinElement);
    state.selectedDestinationLabel =
      destination.label || coinElement.dataset.panelTitle || wing;
    state.selectedRoute = destination.route || "";

    setPanel(panelFromCoin(coinElement));

    const committed = setState(
      STATES.CLUSTER_OPEN,
      `return-to-orbit:${wing}:${String(options.source || "controller")}`
    );

    if (!committed) {
      return false;
    }

    scheduleSceneAscent(wing);
    return true;
  }

  function requestReturnToCluster(options = {}) {
    return requestReturnToOrbit(options);
  }

  function requestLensTab(tab, source = "controller") {
    if (state.current === STATES.HELD) {
      return false;
    }

    state.activeTab = normalizeTab(tab);
    syncPresentation();

    emitReceipt({
      lastAction: `tab-selected:${state.activeTab}:${String(source || "controller")}`,
      lastFailure: null
    });

    return true;
  }

  function requestCenterCompassOpen() {
    return false;
  }

  function requestCenterCompassClose() {
    return false;
  }

  function requestCenterCompassToggle() {
    return false;
  }

  function setState(nextState, action) {
    if (!Object.values(STATES).includes(nextState)) {
      fail(`INVALID_STATE:${nextState}`, action);
      return false;
    }

    state.current = nextState;
    syncPresentation();

    emitReceipt({
      lastAction: action || `state:${nextState}`,
      lastFailure: null
    });

    return true;
  }

  function activateLensTab(tabButton) {
    const tab = normalizeTab(tabButton.dataset.archcoinLensTab);
    requestLensTab(tab, "ui-click");
  }

  function bindLensTabs() {
    qsa("[data-archcoin-lens-tab]", state.root).forEach(button => {
      const tab = normalizeTab(button.dataset.archcoinLensTab);
      state.lensTabs.set(tab, button);

      button.addEventListener("click", () => {
        activateLensTab(button);
      });

      button.addEventListener("keydown", event => {
        const buttons = Array.from(state.lensTabs.values());
        const currentIndex = buttons.indexOf(button);

        if (
          event.key !== "ArrowRight" &&
          event.key !== "ArrowLeft" &&
          event.key !== "Home" &&
          event.key !== "End"
        ) {
          return;
        }

        event.preventDefault();

        let nextIndex = currentIndex;

        if (event.key === "ArrowRight") {
          nextIndex = (currentIndex + 1) % buttons.length;
        }
        if (event.key === "ArrowLeft") {
          nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
        }
        if (event.key === "Home") {
          nextIndex = 0;
        }
        if (event.key === "End") {
          nextIndex = buttons.length - 1;
        }

        const nextButton = buttons[nextIndex];
        activateLensTab(nextButton);
        nextButton.focus();
      });
    });

    qsa("[data-archcoin-lens-panel]", state.root).forEach(panel => {
      const tab = normalizeTab(panel.dataset.archcoinLensPanel);
      state.lensPanels.set(tab, panel);
    });
  }

  function bindPanelControls() {
    if (state.returnToOrbitButton) {
      state.returnToOrbitButton.addEventListener("click", event => {
        event.preventDefault();
        requestReturnToOrbit({ source: "button" });
      });
    }

    if (state.returnToClusterButton) {
      state.returnToClusterButton.addEventListener("click", event => {
        event.preventDefault();
        requestReturnToCluster({ source: "button" });
      });
    }
  }

  function handleSemanticDestination(event) {
    const roomControl =
      event.target && event.target.closest
        ? event.target.closest("[data-archcoin-room]")
        : null;

    if (roomControl && state.root.contains(roomControl)) {
      event.preventDefault();
      requestRoomSelection(roomControl.dataset.roomId, "semantic-click");
      return;
    }

    const coinControl =
      event.target && event.target.closest
        ? event.target.closest("[data-archcoin-cardinal]")
        : null;

    if (coinControl && state.root.contains(coinControl)) {
      event.preventDefault();
      requestCoinSelection(coinControl.dataset.wing, "semantic-click");
    }
  }

  function bindSemanticControls() {
    state.root.addEventListener("click", handleSemanticDestination);
  }

  function bindKeyboardControls() {
    document.addEventListener("keydown", event => {
      if (event.key !== "Escape") {
        return;
      }

      if (state.current === STATES.INFO_OPEN || state.current === STATES.CLUSTER_OPEN) {
        requestReturnToConstellation({ source: "escape", scrollToScene: false });
      }
    });
  }

  function clusterFrameSnapshot(cluster) {
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
      revision: cluster.revision,
      orientation: freezeOrientation(cluster.orientation),
      committedOrientation: freezeOrientation(cluster.committedOrientation)
    });
  }

  function exposeApi() {
    globalThis.DGB_ARCHCOIN_CONTROLLER = Object.freeze({
      contract: CONTRACT,
      constellationOrbit: CONSTELLATION_ORBIT,
      clusterOrbit: CLUSTER_ORBIT,

      receipt: () =>
        Object.freeze({
          ...RECEIPT,
          orbitQuaternion: Object.freeze(Array.from(RECEIPT.orbitQuaternion)),
          clusterQuaternion: Object.freeze(Array.from(RECEIPT.clusterQuaternion))
        }),

      beginOrbitGesture,
      requestOrbitPreview,
      requestOrbitCommit,
      requestOrbitCancel,
      requestOrbitFocus,

      beginClusterGesture,
      requestClusterPreview,
      requestClusterCommit,
      requestClusterCancel,

      requestCoinSelection,
      requestRoomSelection,
      requestReturnToOrbit,
      requestReturnToCluster,
      requestReturnToConstellation,

      requestCenterCompassToggle,
      requestCenterCompassOpen,
      requestCenterCompassClose,

      requestLensTab,

      getFrameState: () => {
        const cluster = activeCluster();

        return Object.freeze({
          state: state.current,
          orbitFocus: state.orbitFocus,
          orbitPreviewFocus: state.orbitPreviewFocus,
          orbitPhase: state.orbitPhase,
          orbitGestureActive: state.orbitGestureActive,
          orbitRevision: state.orbitRevision,
          orbitOrientation: freezeOrientation(state.orbitOrientation),
          committedOrbitOrientation: freezeOrientation(state.committedOrbitOrientation),
          activeClusterWing: cluster ? cluster.wing : "",
          cluster: clusterFrameSnapshot(cluster),
          sphericalConstellation: CONSTELLATION_ORBIT,
          sphericalCluster: CLUSTER_ORBIT,
          selectedCardinal: state.selectedWing,
          selectedWing: state.selectedWing,
          selectedCoin: state.selectedCoin,
          selectedRoom: state.selectedRoom,
          selectedDestinationType: state.selectedDestinationType,
          selectedDestinationId: state.selectedDestinationId,
          selectedDestinationLabel: state.selectedDestinationLabel,
          selectedRoute: state.selectedRoute,
          activeTab: state.activeTab,
          panelDescended: state.panelDescended,
          compassMenuOpen: false,
          reducedMotion: state.reducedMotion,
          prominence: Object.freeze({ ...prominenceFor(state.current) })
        });
      },

      getClusterState: wing => clusterFrameSnapshot(getCluster(wing))
    });
  }

  function resolveDom() {
    state.root = qs("[data-archcoin-root]");
    if (!state.root) {
      throw new Error("ARCHCOIN_ROOT_NOT_FOUND");
    }

    state.scene = qs("[data-archcoin-scene]", state.root);
    if (!state.scene) {
      throw new Error("ARCHCOIN_SCENE_NOT_FOUND");
    }

    state.objects = qs("[data-archcoin-objects]", state.root);
    if (!state.objects) {
      throw new Error("ARCHCOIN_OBJECTS_NOT_FOUND");
    }

    state.panel = qs("[data-archcoin-panel]", state.root);
    if (!state.panel) {
      throw new Error("ARCHCOIN_PANEL_NOT_FOUND");
    }

    state.panelEyebrow = qs("[data-archcoin-panel-eyebrow]", state.root);
    state.panelTitle = qs("[data-archcoin-panel-title]", state.root);
    state.panelPurpose = qs("[data-archcoin-panel-purpose]", state.root);
    state.panelRelationship = qs("[data-archcoin-panel-relationship]", state.root);
    state.returnToOrbitButton = qs("[data-archcoin-return-to-orbit]", state.root);
    state.returnToClusterButton = qs("[data-archcoin-return-to-cluster]", state.root);
    state.guidance = qs("[data-archcoin-guidance]", state.root);
    state.controllerReceiptOutput = qs("[data-archcoin-controller-receipt]", state.root);
  }

  function init() {
    try {
      resolveDom();
      readReducedMotion();
      initializeConstellationState();
      initializeClusterStates();
      exposeApi();
      bindSemanticControls();
      bindPanelControls();
      bindKeyboardControls();
      bindLensTabs();

      state.current = STATES.ORBIT;
      resetSelection();
      state.activeTab = "overview";

      setPanel(DEFAULT_PANEL);
      syncPresentation();

      state.initialized = true;

      emitReceipt({
        status: "available",
        lastAction: "controller-initialized-simplified-field-and-panel",
        lastFailure: null,
        sphericalConstellationEnabled: true,
        sphericalClustersEnabled: false
      });
    } catch (error) {
      const reason = error && error.message ? error.message : String(error);

      RECEIPT.status = "held";
      RECEIPT.lastFailure = `CONTROLLER_INIT_FAILURE:${reason}`;

      globalThis.DGB_ARCHCOIN_CONTROLLER_RECEIPT = Object.freeze({
        ...RECEIPT
      });

      globalThis.dispatchEvent(
        new CustomEvent("ARCHCOIN_CONTROLLER_FAILURE", {
          detail: Object.freeze({
            reason: RECEIPT.lastFailure
          })
        })
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

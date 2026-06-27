/* products/archcoin/index.controller.js
   ARCHCOIN
   Four-coin constellation controller with per-coin cluster descent,
   information-panel state authority, local return logic, and center-compass menu control.

   Anchor-role intent:
   - This file is the controlling state authority for the ARCHCOIN page rebuild.
   - Runtime geometry must conform to this controller.
   - HTML hooks and panel surfaces must conform to this controller.
   - Local return-to-orbit is distinct from center-compass navigation.
   - Coin selection, cluster preview, cluster commitment, information selection,
     lens/tab selection, and compass-menu state remain distinct.

   Ownership:
   - Page state machine.
   - Published controller APIs.
   - DOM dataset synchronization.
   - Information panel synchronization.
   - Return-to-orbit / return-to-cluster behavior.
   - Center-compass menu open/close state.
   - Guidance text.
   - Controller receipt emission.

   Non-ownership:
   - 3D crystal rendering.
   - WebGL geometry, shaders, depth scoring, projection, or hit testing.
   - External navigation execution beyond ordinary links already present in HTML.
   - Financial execution, custody, exchange behavior, or launch claims.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "ARCHCOIN_CONTROLLER_FOUR_COIN_CONSTELLATION_CLUSTER_INFORMATION_REBUILD_v1",
    file: "/products/archcoin/index.controller.js",
    releaseId: "archcoin-controller-constellation-v1",
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

  const PHASES = Object.freeze({
    COMMITTED: "COMMITTED",
    PREVIEWING: "PREVIEWING"
  });

  const WINGS = Object.freeze(["north", "east", "south", "west"]);
  const LENS_TABS = Object.freeze(["overview", "engineering", "platform", "governance"]);

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

  const DEFAULT_PANEL_COPY = Object.freeze({
    eyebrow: "Selected path",
    title: "Choose a coin.",
    purpose:
      "Start with one of the four outer coins. Each coin opens a local cluster. Each local cluster opens information. Return to Orbit restores the family field. The center compass opens higher-order compass destinations.",
    relationship:
      "Local inspection and cross-chamber navigation remain separate. Return to Orbit is not the same as the center compass."
  });

  const DEFAULT_GUIDANCE =
    "Drag or rotate through the four-coin field. Select a coin to open its cluster. Select a cluster path to inspect information. Return to Orbit restores the coin family field.";

  const COIN_PANEL_COPY = Object.freeze({
    north: Object.freeze({
      eyebrow: "North Coin",
      title: "Contract Coin",
      purpose:
        "Contract Coin governs authority, permissions, terms, signatures, execution frame, and what authorizes movement before value proceeds any farther.",
      relationship:
        "Contract Coin is the local north authority surface. Open one of its cluster points to inspect overview, engineering, platform, or governance."
    }),
    east: Object.freeze({
      eyebrow: "East Coin",
      title: "Receivable Coin",
      purpose:
        "Receivable Coin governs inbound value, arrival visibility, inflow accounting, source reading, and how received value becomes legible inside the family field.",
      relationship:
        "Receivable Coin is the local east intake surface. Open one of its cluster points to inspect overview, engineering, platform, or governance."
    }),
    south: Object.freeze({
      eyebrow: "South Coin",
      title: "Payable Coin",
      purpose:
        "Payable Coin governs obligation, settlement pressure, what is owed, how duty is carried, and how outgoing liability remains visible rather than disappearing behind vague movement.",
      relationship:
        "Payable Coin is the local south obligation surface. Open one of its cluster points to inspect overview, engineering, platform, or governance."
    }),
    west: Object.freeze({
      eyebrow: "West Coin",
      title: "Allocation Coin",
      purpose:
        "Allocation Coin governs distribution, retained value, growth channels, allocation rules, and how expansion remains disciplined inside the family frame.",
      relationship:
        "Allocation Coin is the local west growth surface. Open one of its cluster points to inspect overview, engineering, platform, or governance."
    })
  });

  const RECEIPT = {
    contractId: CONTRACT.id,
    status: "pending",
    controllerInitialized: false,
    state: STATES.ORBIT,
    selectedWing: "",
    selectedCoin: "",
    selectedRoom: "",
    activeTab: "overview",
    orbitGestureActive: false,
    clusterGestureActive: false,
    orbitPhase: PHASES.COMMITTED,
    clusterPhase: PHASES.COMMITTED,
    orbitFocus: "north",
    orbitPreviewFocus: "north",
    clusterPrimaryRoom: "",
    clusterPreviewPrimaryRoom: "",
    activeClusterWing: "",
    compassMenuOpen: false,
    visualPassClaimed: false,
    failureReason: ""
  };

  const state = {
    root: null,
    scene: null,
    objects: null,
    guidance: null,

    centerCompassButton: null,
    centerCompassShell: null,
    centerCompassClose: null,

    panel: null,
    panelEyebrow: null,
    panelTitle: null,
    panelPurpose: null,
    panelRelationship: null,
    returnToOrbitButton: null,
    returnToClusterButton: null,

    lensTabs: new Map(),
    lensPanels: new Map(),

    receiptOutput: null,

    currentState: STATES.ORBIT,

    orbit: {
      focusWing: "north",
      previewFocusWing: "north",
      phase: PHASES.COMMITTED,
      gestureActive: false,
      quaternion: [0, 0, 0, 1]
    },

    cluster: {
      wing: "",
      primaryRoom: "",
      previewPrimaryRoom: "",
      phase: PHASES.COMMITTED,
      gestureActive: false,
      quaternionByWing: new Map()
    },

    selected: {
      wing: "",
      coinId: "",
      roomId: "",
      destinationType: "",
      destinationId: "",
      destinationLabel: "",
      route: ""
    },

    activeTab: "overview",
    compassMenuOpen: false,

    held: false,
    failureReason: "",

    suppressClickUntil: 0
  };

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function normalizeWing(value) {
    const wing = String(value || "").trim().toLowerCase();
    return WINGS.includes(wing) ? wing : "";
  }

  function normalizeCoinId(value) {
    const coin = String(value || "").trim().toLowerCase();
    return WING_BY_COIN[coin] ? coin : "";
  }

  function normalizeRoomId(value) {
    return String(value || "").trim();
  }

  function normalizeTab(value) {
    const tab = String(value || "").trim().toLowerCase();
    return LENS_TABS.includes(tab) ? tab : "overview";
  }

  function now() {
    return performance.now();
  }

  function roomElementsForWing(wing) {
    return qsa(`[data-archcoin-room][data-wing="${wing}"]`, state.root);
  }

  function roomElementById(roomId) {
    return qs(`[data-archcoin-room][data-room-id="${cssEscape(roomId)}"]`, state.root);
  }

  function coinElementByWing(wing) {
    return qs(`[data-archcoin-cardinal][data-wing="${wing}"]`, state.root);
  }

  function cssEscape(value) {
    const text = String(value || "");
    if (globalThis.CSS && typeof globalThis.CSS.escape === "function") {
      return globalThis.CSS.escape(text);
    }
    return text.replace(/["\\]/g, "\\$&");
  }

  function getRoomTab(roomId) {
    const element = roomElementById(roomId);
    return element ? normalizeTab(element.dataset.tab) : "overview";
  }

  function firstRoomIdForWing(wing) {
    const rooms = roomElementsForWing(wing);
    return rooms.length ? normalizeRoomId(rooms[0].dataset.roomId) : "";
  }

  function coinIdForWing(wing) {
    return COIN_BY_WING[wing] || "";
  }

  function wingForCoinId(coinId) {
    return WING_BY_COIN[coinId] || "";
  }

  function getCoinPanelCopy(wing) {
    return COIN_PANEL_COPY[wing] || DEFAULT_PANEL_COPY;
  }

  function dispatch(type, detail = {}) {
    globalThis.dispatchEvent(
      new CustomEvent(type, {
        detail: Object.freeze({ ...detail })
      })
    );
  }

  function emitReceipt(extra = {}) {
    Object.assign(RECEIPT, {
      status: state.held ? "held" : "available",
      controllerInitialized: Boolean(state.root),
      state: state.currentState,
      selectedWing: state.selected.wing,
      selectedCoin: state.selected.coinId,
      selectedRoom: state.selected.roomId,
      activeTab: state.activeTab,
      orbitGestureActive: state.orbit.gestureActive,
      clusterGestureActive: state.cluster.gestureActive,
      orbitPhase: state.orbit.phase,
      clusterPhase: state.cluster.phase,
      orbitFocus: state.orbit.focusWing,
      orbitPreviewFocus: state.orbit.previewFocusWing,
      clusterPrimaryRoom: state.cluster.primaryRoom,
      clusterPreviewPrimaryRoom: state.cluster.previewPrimaryRoom,
      activeClusterWing: state.cluster.wing,
      compassMenuOpen: state.compassMenuOpen,
      visualPassClaimed: false,
      failureReason: state.failureReason || "",
      ...extra
    });

    const serialized = JSON.stringify(RECEIPT);

    if (state.root) {
      state.root.dataset.archcoinControllerReceipt = serialized;
      state.root.dataset.archcoinControllerStatus = RECEIPT.status;
      state.root.dataset.visualPassClaimed = "false";
    }

    if (state.scene) {
      state.scene.dataset.archcoinControllerStatus = RECEIPT.status;
      state.scene.dataset.visualPassClaimed = "false";
    }

    if (state.receiptOutput) {
      state.receiptOutput.value = serialized;
      state.receiptOutput.textContent = serialized;
      state.receiptOutput.dataset.visualPassClaimed = "false";
    }

    globalThis.DGB_ARCHCOIN_CONTROLLER_RECEIPT = Object.freeze({ ...RECEIPT });
  }

  function failHeld(reason) {
    state.held = true;
    state.failureReason = String(reason || "UNKNOWN_CONTROLLER_FAILURE");
    state.currentState = STATES.HELD;
    syncAll();
    emitReceipt({ status: "held" });
  }

  function safeQuaternion(value, fallback = [0, 0, 0, 1]) {
    const source =
      Array.isArray(value) || ArrayBuffer.isView(value) ? Array.from(value) : [];
    if (source.length !== 4) {
      return fallback.slice();
    }
    const x = Number(source[0]);
    const y = Number(source[1]);
    const z = Number(source[2]);
    const w = Number(source[3]);
    if (![x, y, z, w].every(Number.isFinite)) {
      return fallback.slice();
    }
    const length = Math.hypot(x, y, z, w);
    if (!Number.isFinite(length) || length <= 1e-12) {
      return fallback.slice();
    }
    return [x / length, y / length, z / length, w / length];
  }

  function syncDatasets() {
    if (!state.root || !state.scene) {
      return;
    }

    state.root.dataset.archcoinState = state.currentState.toLowerCase();
    state.scene.dataset.archcoinState =
      state.currentState === STATES.ORBIT
        ? "orbit"
        : state.currentState === STATES.CLUSTER_OPEN
          ? "cluster-open"
          : state.currentState === STATES.INFO_OPEN
            ? "info-open"
            : "held";

    state.scene.dataset.archcoinSelectedWing = state.selected.wing;
    state.scene.dataset.archcoinSelectedRoom = state.selected.roomId;
    state.scene.dataset.archcoinActiveTab = state.activeTab;
    state.scene.dataset.archcoinCompassMenu = state.compassMenuOpen ? "open" : "closed";

    state.root.dataset.selectedCardinal = state.selected.wing;
    state.root.dataset.selectedCoin = state.selected.coinId;
    state.root.dataset.selectedRoom = state.selected.roomId;
    state.root.dataset.selectedDestinationType = state.selected.destinationType;
    state.root.dataset.selectedDestinationId = state.selected.destinationId;
    state.root.dataset.selectedDestinationLabel = state.selected.destinationLabel;
    state.root.dataset.selectedRoute = state.selected.route;

    state.root.dataset.orbitFocus = state.orbit.focusWing;
    state.root.dataset.orbitPreviewFocus = state.orbit.previewFocusWing;
    state.root.dataset.orbitPhase = state.orbit.phase;
    state.root.dataset.orbitGestureActive = String(state.orbit.gestureActive);
    state.root.dataset.orbitQuaternion = JSON.stringify(state.orbit.quaternion);

    state.root.dataset.activeClusterWing = state.cluster.wing;
    state.root.dataset.clusterPrimaryRoom = state.cluster.primaryRoom;
    state.root.dataset.clusterPreviewPrimaryRoom = state.cluster.previewPrimaryRoom;
    state.root.dataset.clusterPhase = state.cluster.phase;
    state.root.dataset.clusterGestureActive = String(state.cluster.gestureActive);

    const activeClusterQuaternion =
      state.cluster.wing && state.cluster.quaternionByWing.has(state.cluster.wing)
        ? state.cluster.quaternionByWing.get(state.cluster.wing)
        : [0, 0, 0, 1];

    state.root.dataset.clusterQuaternion = JSON.stringify(activeClusterQuaternion);
    state.root.dataset.panelDescended = String(state.currentState === STATES.INFO_OPEN);
    state.root.dataset.archcoinCompassMenuOpen = String(state.compassMenuOpen);
  }

  function syncSelectionAttributes() {
    qsa("[data-archcoin-cardinal]", state.root).forEach(element => {
      const wing = normalizeWing(element.dataset.wing || element.dataset.coinId);
      const selected = wing && wing === state.selected.wing;
      const primary = wing && wing === state.orbit.focusWing;

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
      const wing = normalizeWing(element.dataset.wing);
      const selected = roomId && roomId === state.selected.roomId;
      const primary = wing && roomId && wing === state.cluster.wing && roomId === state.cluster.primaryRoom;

      element.dataset.selected = selected ? "true" : "false";
      element.dataset.primary = primary ? "true" : "false";
      if (selected || primary) {
        element.setAttribute("aria-current", "true");
      } else {
        element.removeAttribute("aria-current");
      }
    });
  }

  function syncCompassMenu() {
    if (!state.centerCompassButton || !state.centerCompassShell) {
      return;
    }

    state.centerCompassButton.setAttribute(
      "aria-expanded",
      state.compassMenuOpen ? "true" : "false"
    );

    if (state.compassMenuOpen) {
      state.centerCompassShell.hidden = false;
    } else {
      state.centerCompassShell.hidden = true;
    }
  }

  function syncGuidance() {
    if (!state.guidance) {
      return;
    }

    let text = DEFAULT_GUIDANCE;

    if (state.currentState === STATES.CLUSTER_OPEN && state.selected.wing) {
      const copy = getCoinPanelCopy(state.selected.wing);
      text =
        `${copy.title} is open. Select one of the four local information stars, or use Return to Orbit to restore the family field.`;
    }

    if (state.currentState === STATES.INFO_OPEN && state.selected.roomId) {
      const room = roomElementById(state.selected.roomId);
      const label = room ? room.dataset.label || state.selected.roomId : state.selected.roomId;
      text =
        `${label} is open. Return to Cluster restores the local four-path ring. Return to Orbit restores the four-coin family field.`;
    }

    if (state.currentState === STATES.HELD) {
      text = "ARCHCOIN controller is held. Interactive descent is unavailable until the controller is restored.";
    }

    state.guidance.textContent = text;
  }

  function syncPanel() {
    if (!state.panel) {
      return;
    }

    let eyebrow = DEFAULT_PANEL_COPY.eyebrow;
    let title = DEFAULT_PANEL_COPY.title;
    let purpose = DEFAULT_PANEL_COPY.purpose;
    let relationship = DEFAULT_PANEL_COPY.relationship;

    if (state.currentState === STATES.CLUSTER_OPEN && state.selected.wing) {
      const copy = getCoinPanelCopy(state.selected.wing);
      eyebrow = copy.eyebrow;
      title = copy.title;
      purpose = copy.purpose;
      relationship = copy.relationship;
    }

    if (state.currentState === STATES.INFO_OPEN && state.selected.roomId) {
      const room = roomElementById(state.selected.roomId);
      if (room) {
        eyebrow = room.dataset.localCoordinate || room.dataset.label || "Information point";
        title = room.dataset.label || room.dataset.roomId || "Information";
        purpose =
          room.dataset.preview ||
          room.dataset.whyEnter ||
          "This information point explains the selected ARCHCOIN path.";
        relationship =
          room.dataset.localFunction ||
          "This information point remains local to the selected coin cluster.";
      }
    }

    if (state.currentState === STATES.HELD) {
      eyebrow = "Controller held";
      title = "ARCHCOIN controller is unavailable.";
      purpose =
        "The page has entered a held state. Interactive constellation, cluster, and local information descent are suspended until the controller is restored.";
      relationship = state.failureReason || "No failure reason was published.";
    }

    if (state.panelEyebrow) {
      state.panelEyebrow.textContent = eyebrow;
    }
    if (state.panelTitle) {
      state.panelTitle.textContent = title;
    }
    if (state.panelPurpose) {
      state.panelPurpose.textContent = purpose;
    }
    if (state.panelRelationship) {
      state.panelRelationship.textContent = relationship;
    }

    if (state.returnToOrbitButton) {
      state.returnToOrbitButton.hidden = !(state.currentState === STATES.CLUSTER_OPEN || state.currentState === STATES.INFO_OPEN);
      state.returnToOrbitButton.disabled = state.currentState === STATES.HELD;
    }

    if (state.returnToClusterButton) {
      state.returnToClusterButton.hidden = state.currentState !== STATES.INFO_OPEN;
      state.returnToClusterButton.disabled = state.currentState !== STATES.INFO_OPEN || state.currentState === STATES.HELD;
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

  function syncAll() {
    syncDatasets();
    syncSelectionAttributes();
    syncCompassMenu();
    syncGuidance();
    syncPanel();
    syncLensTabs();
  }

  function setActiveTab(tab, source = "internal") {
    const nextTab = normalizeTab(tab);
    state.activeTab = nextTab;
    syncAll();
    emitReceipt({ activeTab: nextTab, lastAction: `tab:${source}:${nextTab}` });
    return true;
  }

  function commitOrbitFocus(wing, quaternion = null) {
    const nextWing = normalizeWing(wing) || "north";
    state.orbit.focusWing = nextWing;
    state.orbit.previewFocusWing = nextWing;
    state.orbit.phase = PHASES.COMMITTED;
    state.orbit.gestureActive = false;

    if (quaternion) {
      state.orbit.quaternion = safeQuaternion(quaternion, state.orbit.quaternion);
    }

    emitReceipt({ orbitFocus: nextWing, lastAction: "orbit-commit" });
  }

  function commitClusterPrimary(wing, roomId, quaternion = null) {
    const nextWing = normalizeWing(wing);
    const nextRoom = normalizeRoomId(roomId);

    if (!nextWing) {
      return false;
    }

    state.cluster.wing = nextWing;
    state.cluster.primaryRoom = nextRoom;
    state.cluster.previewPrimaryRoom = nextRoom;
    state.cluster.phase = PHASES.COMMITTED;
    state.cluster.gestureActive = false;

    if (quaternion) {
      state.cluster.quaternionByWing.set(
        nextWing,
        safeQuaternion(quaternion, state.cluster.quaternionByWing.get(nextWing) || [0, 0, 0, 1])
      );
    }

    emitReceipt({
      activeClusterWing: nextWing,
      clusterPrimaryRoom: nextRoom,
      lastAction: "cluster-commit"
    });

    return true;
  }

  function enterOrbitState(source = "internal") {
    state.currentState = STATES.ORBIT;

    state.selected.wing = "";
    state.selected.coinId = "";
    state.selected.roomId = "";
    state.selected.destinationType = "";
    state.selected.destinationId = "";
    state.selected.destinationLabel = "";
    state.selected.route = "";

    state.cluster.wing = "";
    state.cluster.primaryRoom = "";
    state.cluster.previewPrimaryRoom = "";
    state.cluster.phase = PHASES.COMMITTED;
    state.cluster.gestureActive = false;

    state.compassMenuOpen = false;

    syncAll();
    emitReceipt({ lastAction: `state:${source}:orbit` });
    return true;
  }

  function enterClusterState(wing, source = "internal") {
    const nextWing = normalizeWing(wing);
    if (!nextWing) {
      return false;
    }

    const coinId = coinIdForWing(nextWing);
    const primaryRoom =
      state.cluster.primaryRoom && state.cluster.wing === nextWing
        ? state.cluster.primaryRoom
        : firstRoomIdForWing(nextWing);

    state.currentState = STATES.CLUSTER_OPEN;

    state.selected.wing = nextWing;
    state.selected.coinId = coinId;
    state.selected.roomId = "";
    state.selected.destinationType = "coin";
    state.selected.destinationId = coinId;
    state.selected.destinationLabel = getCoinPanelCopy(nextWing).title;
    state.selected.route = "";

    commitOrbitFocus(nextWing);
    commitClusterPrimary(nextWing, primaryRoom);

    state.compassMenuOpen = false;

    syncAll();
    emitReceipt({ lastAction: `state:${source}:cluster-open` });
    return true;
  }

  function enterInfoState(roomId, source = "internal") {
    const room = roomElementById(roomId);
    if (!room) {
      return false;
    }

    const wing = normalizeWing(room.dataset.wing);
    const tab = normalizeTab(room.dataset.tab);
    const coinId = coinIdForWing(wing);

    state.currentState = STATES.INFO_OPEN;

    state.selected.wing = wing;
    state.selected.coinId = coinId;
    state.selected.roomId = normalizeRoomId(roomId);
    state.selected.destinationType = "info";
    state.selected.destinationId = normalizeRoomId(roomId);
    state.selected.destinationLabel = room.dataset.label || roomId;
    state.selected.route = room.dataset.route || "";

    commitOrbitFocus(wing);
    commitClusterPrimary(wing, normalizeRoomId(roomId));

    state.compassMenuOpen = false;
    setActiveTab(tab, source);

    syncAll();
    emitReceipt({ lastAction: `state:${source}:info-open` });
    return true;
  }

  function openCompassMenu(source = "internal") {
    if (state.held) {
      return false;
    }

    state.compassMenuOpen = true;
    syncAll();
    emitReceipt({ compassMenuOpen: true, lastAction: `compass-menu:${source}:open` });
    return true;
  }

  function closeCompassMenu(source = "internal") {
    state.compassMenuOpen = false;
    syncAll();
    emitReceipt({ compassMenuOpen: false, lastAction: `compass-menu:${source}:close` });
    return true;
  }

  function bindOrdinaryUi() {
    qsa("[data-archcoin-lens-tab]", state.root).forEach(button => {
      const tab = normalizeTab(button.dataset.archcoinLensTab);
      state.lensTabs.set(tab, button);

      button.addEventListener("click", event => {
        event.preventDefault();
        if (state.held) {
          return;
        }

        if (state.currentState !== STATES.INFO_OPEN) {
          state.activeTab = tab;
          syncAll();
          emitReceipt({ lastAction: `tab:preselect:${tab}` });
          return;
        }

        requestLensTab(tab, "ui-click");
      });
    });

    qsa("[data-archcoin-lens-panel]", state.root).forEach(panel => {
      const tab = normalizeTab(panel.dataset.archcoinLensPanel);
      state.lensPanels.set(tab, panel);
    });

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

    if (state.centerCompassButton) {
      state.centerCompassButton.addEventListener("click", event => {
        event.preventDefault();
        requestCenterCompassToggle("button");
      });
    }

    if (state.centerCompassClose) {
      state.centerCompassClose.addEventListener("click", event => {
        event.preventDefault();
        closeCompassMenu("close-button");
      });
    }

    qsa("[data-archcoin-compass-destination]", state.root).forEach(link => {
      link.addEventListener("click", () => {
        closeCompassMenu("navigate-away");
      });
    });

    qsa("[data-archcoin-cardinal]", state.root).forEach(element => {
      element.addEventListener("click", event => {
        if (now() < state.suppressClickUntil) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }

        const wing = normalizeWing(element.dataset.wing || element.dataset.coinId);
        if (!wing || state.held) {
          return;
        }

        requestCoinSelection(wing, "semantic-click");
      });
    });

    qsa("[data-archcoin-room]", state.root).forEach(element => {
      element.addEventListener("click", event => {
        if (now() < state.suppressClickUntil) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }

        const roomId = normalizeRoomId(element.dataset.roomId);
        if (!roomId || state.held) {
          return;
        }

        requestRoomSelection(roomId, "semantic-click");
      });
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        if (state.compassMenuOpen) {
          closeCompassMenu("escape");
          return;
        }

        if (state.currentState === STATES.INFO_OPEN) {
          requestReturnToCluster({ source: "escape" });
          return;
        }

        if (state.currentState === STATES.CLUSTER_OPEN) {
          requestReturnToOrbit({ source: "escape" });
        }
      }
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
      throw new Error("ARCHCOIN_OBJECT_LAYER_NOT_FOUND");
    }

    state.guidance = qs("[data-archcoin-guidance]", state.root);

    state.centerCompassButton = qs("[data-archcoin-center-compass]", state.root);
    state.centerCompassShell = qs("[data-archcoin-compass-shell]", state.root);
    state.centerCompassClose = qs("[data-archcoin-compass-close]", state.root);

    state.panel = qs("[data-archcoin-panel]", state.root);
    state.panelEyebrow = qs("[data-archcoin-panel-eyebrow]", state.root);
    state.panelTitle = qs("[data-archcoin-panel-title]", state.root);
    state.panelPurpose = qs("[data-archcoin-panel-purpose]", state.root);
    state.panelRelationship = qs("[data-archcoin-panel-relationship]", state.root);
    state.returnToOrbitButton = qs("[data-archcoin-return-to-orbit]", state.root);
    state.returnToClusterButton = qs("[data-archcoin-return-to-cluster]", state.root);

    state.receiptOutput = qs("[data-archcoin-controller-receipt]", state.root);

    if (!state.centerCompassButton) {
      throw new Error("ARCHCOIN_CENTER_COMPASS_BUTTON_NOT_FOUND");
    }

    if (!state.centerCompassShell) {
      throw new Error("ARCHCOIN_CENTER_COMPASS_SHELL_NOT_FOUND");
    }

    if (!state.panel) {
      throw new Error("ARCHCOIN_PANEL_NOT_FOUND");
    }
  }

  function initializeClusterMaps() {
    WINGS.forEach(wing => {
      state.cluster.quaternionByWing.set(wing, [0, 0, 0, 1]);
    });
  }

  function getFrameState() {
    return Object.freeze({
      state: state.currentState,
      orbitFocus: state.orbit.focusWing,
      orbitPreviewFocus: state.orbit.previewFocusWing,
      orbitPhase: state.orbit.phase,
      orbitGestureActive: state.orbit.gestureActive,
      orbitOrientation: Object.freeze({
        quaternion: Object.freeze(state.orbit.quaternion.slice()),
        primaryId: state.orbit.previewFocusWing || state.orbit.focusWing || "north"
      }),
      activeClusterWing: state.cluster.wing,
      cluster:
        state.cluster.wing
          ? Object.freeze({
              wing: state.cluster.wing,
              roomIds: Object.freeze(
                roomElementsForWing(state.cluster.wing).map(element =>
                  normalizeRoomId(element.dataset.roomId)
                )
              ),
              primaryRoom: state.cluster.primaryRoom,
              previewPrimaryRoom: state.cluster.previewPrimaryRoom,
              phase: state.cluster.phase,
              gestureActive: state.cluster.gestureActive,
              revision: 1,
              orientation: Object.freeze({
                quaternion: Object.freeze(
                  (
                    state.cluster.quaternionByWing.get(state.cluster.wing) || [0, 0, 0, 1]
                  ).slice()
                ),
                primaryId:
                  state.cluster.previewPrimaryRoom || state.cluster.primaryRoom || ""
              })
            })
          : null,
      selectedCardinal: state.selected.wing,
      selectedRoom: state.selected.roomId,
      selectedDestinationType: state.selected.destinationType,
      selectedDestinationId: state.selected.destinationId,
      selectedDestinationLabel: state.selected.destinationLabel,
      selectedRoute: state.selected.route,
      reducedMotion:
        state.root && state.root.dataset.reducedMotion === "true"
          ? true
          : globalThis.matchMedia &&
              globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches,
      prominence: Object.freeze({
        compass: 1,
        window: 0
      })
    });
  }

  function beginOrbitGesture(payload = {}) {
    if (state.held || state.currentState !== STATES.ORBIT) {
      return false;
    }

    state.orbit.gestureActive = true;
    state.orbit.phase = PHASES.PREVIEWING;
    state.orbit.quaternion = safeQuaternion(payload.quaternion, state.orbit.quaternion);
    state.orbit.previewFocusWing =
      normalizeWing(payload.primaryWing) || state.orbit.focusWing || "north";

    state.suppressClickUntil = now() + 520;

    syncAll();
    emitReceipt({ lastAction: "orbit-gesture-begin" });
    return true;
  }

  function requestOrbitPreview(payload = {}) {
    if (state.held || state.currentState !== STATES.ORBIT) {
      return false;
    }

    state.orbit.phase = PHASES.PREVIEWING;
    state.orbit.gestureActive = true;
    state.orbit.quaternion = safeQuaternion(payload.quaternion, state.orbit.quaternion);
    state.orbit.previewFocusWing =
      normalizeWing(payload.primaryWing) || state.orbit.previewFocusWing || state.orbit.focusWing;

    syncAll();
    emitReceipt({ lastAction: "orbit-preview" });
    return true;
  }

  function requestOrbitCommit(payload = {}) {
    if (state.held || state.currentState !== STATES.ORBIT) {
      return false;
    }

    const wing = normalizeWing(payload.primaryWing) || state.orbit.previewFocusWing || state.orbit.focusWing;
    commitOrbitFocus(wing, payload.quaternion || state.orbit.quaternion);
    syncAll();
    emitReceipt({ lastAction: "orbit-commit-api" });
    return true;
  }

  function requestOrbitCancel(reason = "orbit-cancel") {
    if (state.held || state.currentState !== STATES.ORBIT) {
      return false;
    }

    state.orbit.gestureActive = false;
    state.orbit.phase = PHASES.COMMITTED;
    state.orbit.previewFocusWing = state.orbit.focusWing;

    syncAll();
    emitReceipt({ lastAction: String(reason || "orbit-cancel") });
    return true;
  }

  function beginClusterGesture(wing, payload = {}) {
    const nextWing = normalizeWing(wing);

    if (
      state.held ||
      !nextWing ||
      (state.currentState !== STATES.CLUSTER_OPEN && state.currentState !== STATES.INFO_OPEN) ||
      nextWing !== state.selected.wing
    ) {
      return false;
    }

    state.cluster.wing = nextWing;
    state.cluster.gestureActive = true;
    state.cluster.phase = PHASES.PREVIEWING;
    state.cluster.primaryRoom =
      state.cluster.primaryRoom || firstRoomIdForWing(nextWing);
    state.cluster.previewPrimaryRoom =
      normalizeRoomId(payload.primaryRoom) || state.cluster.primaryRoom;

    const safe = safeQuaternion(
      payload.quaternion,
      state.cluster.quaternionByWing.get(nextWing) || [0, 0, 0, 1]
    );
    state.cluster.quaternionByWing.set(nextWing, safe);

    state.suppressClickUntil = now() + 520;

    syncAll();
    emitReceipt({ lastAction: "cluster-gesture-begin" });
    return true;
  }

  function requestClusterPreview(wing, payload = {}) {
    const nextWing = normalizeWing(wing);

    if (
      state.held ||
      !nextWing ||
      (state.currentState !== STATES.CLUSTER_OPEN && state.currentState !== STATES.INFO_OPEN)
    ) {
      return false;
    }

    state.cluster.wing = nextWing;
    state.cluster.gestureActive = true;
    state.cluster.phase = PHASES.PREVIEWING;
    state.cluster.previewPrimaryRoom =
      normalizeRoomId(payload.primaryRoom) ||
      state.cluster.previewPrimaryRoom ||
      state.cluster.primaryRoom ||
      firstRoomIdForWing(nextWing);

    state.cluster.quaternionByWing.set(
      nextWing,
      safeQuaternion(
        payload.quaternion,
        state.cluster.quaternionByWing.get(nextWing) || [0, 0, 0, 1]
      )
    );

    if (state.currentState === STATES.CLUSTER_OPEN && !state.selected.roomId) {
      const roomId = state.cluster.previewPrimaryRoom;
      if (roomId) {
        const tab = getRoomTab(roomId);
        state.activeTab = tab;
      }
    }

    syncAll();
    emitReceipt({ lastAction: "cluster-preview" });
    return true;
  }

  function requestClusterCommit(wing, payload = {}) {
    const nextWing = normalizeWing(wing);
    if (
      state.held ||
      !nextWing ||
      (state.currentState !== STATES.CLUSTER_OPEN && state.currentState !== STATES.INFO_OPEN)
    ) {
      return false;
    }

    const roomId =
      normalizeRoomId(payload.primaryRoom) ||
      state.cluster.previewPrimaryRoom ||
      state.cluster.primaryRoom ||
      firstRoomIdForWing(nextWing);

    commitClusterPrimary(nextWing, roomId, payload.quaternion);

    if (state.currentState === STATES.CLUSTER_OPEN && !state.selected.roomId) {
      state.activeTab = getRoomTab(roomId);
    }

    syncAll();
    emitReceipt({ lastAction: "cluster-commit-api" });
    return true;
  }

  function requestClusterCancel(wing, reason = "cluster-cancel") {
    const nextWing = normalizeWing(wing);

    if (
      state.held ||
      !nextWing ||
      (state.currentState !== STATES.CLUSTER_OPEN && state.currentState !== STATES.INFO_OPEN)
    ) {
      return false;
    }

    state.cluster.wing = nextWing;
    state.cluster.gestureActive = false;
    state.cluster.phase = PHASES.COMMITTED;
    state.cluster.previewPrimaryRoom = state.cluster.primaryRoom;

    syncAll();
    emitReceipt({ lastAction: String(reason || "cluster-cancel") });
    return true;
  }

  function requestCoinSelection(wing, source = "api") {
    const nextWing = normalizeWing(wing);
    if (state.held || !nextWing) {
      return false;
    }

    const ok = enterClusterState(nextWing, source);
    if (ok) {
      dispatch("ARCHCOIN_COIN_SELECTED", {
        wing: nextWing,
        coinId: coinIdForWing(nextWing),
        source
      });
    }
    return ok;
  }

  function requestRoomSelection(roomId, source = "api") {
    const nextRoom = normalizeRoomId(roomId);
    if (state.held || !nextRoom) {
      return false;
    }

    const ok = enterInfoState(nextRoom, source);
    if (ok) {
      dispatch("ARCHCOIN_ROOM_SELECTED", {
        roomId: nextRoom,
        wing: state.selected.wing,
        tab: state.activeTab,
        source
      });
    }
    return ok;
  }

  function requestReturnToOrbit(options = {}) {
    if (state.held) {
      return false;
    }

    enterOrbitState(options.source || "api");
    dispatch("ARCHCOIN_RETURN_TO_ORBIT", {
      source: options.source || "api",
      scrollToScene: Boolean(options.scrollToScene)
    });
    return true;
  }

  function requestReturnToCluster(options = {}) {
    if (state.held || state.currentState !== STATES.INFO_OPEN || !state.selected.wing) {
      return false;
    }

    const wing = state.selected.wing;
    const ok = enterClusterState(wing, options.source || "api");
    if (ok) {
      dispatch("ARCHCOIN_RETURN_TO_CLUSTER", {
        wing,
        source: options.source || "api"
      });
    }
    return ok;
  }

  function requestReturnToConstellation(options = {}) {
    return requestReturnToOrbit(options);
  }

  function requestCenterCompassToggle(source = "api") {
    if (state.held) {
      return false;
    }

    if (state.compassMenuOpen) {
      return closeCompassMenu(source);
    }

    return openCompassMenu(source);
  }

  function requestCenterCompassOpen(source = "api") {
    return openCompassMenu(source);
  }

  function requestCenterCompassClose(source = "api") {
    return closeCompassMenu(source);
  }

  function requestLensTab(tab, source = "api") {
    if (state.held) {
      return false;
    }
    return setActiveTab(tab, source);
  }

  function syncReducedMotionFlag() {
    if (!globalThis.matchMedia) {
      return;
    }

    const media = globalThis.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = matches => {
      state.root.dataset.reducedMotion = matches ? "true" : "false";
      emitReceipt({ lastAction: "reduced-motion-sync" });
    };

    apply(media.matches);

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", event => {
        apply(event.matches);
      });
    }
  }

  function exposeApi() {
    globalThis.DGB_ARCHCOIN_CONTROLLER = Object.freeze({
      contract: CONTRACT,
      receipt: () => Object.freeze({ ...RECEIPT }),
      getFrameState,
      beginOrbitGesture,
      requestOrbitPreview,
      requestOrbitCommit,
      requestOrbitCancel,
      beginClusterGesture,
      requestClusterPreview,
      requestClusterCommit,
      requestClusterCancel,
      requestCoinSelection,
      requestRoomSelection,
      requestReturnToOrbit,
      requestReturnToConstellation,
      requestReturnToCluster,
      requestCenterCompassToggle,
      requestCenterCompassOpen,
      requestCenterCompassClose,
      requestLensTab
    });
  }

  function init() {
    try {
      resolveDom();
      initializeClusterMaps();
      exposeApi();
      bindOrdinaryUi();
      syncReducedMotionFlag();

      state.currentState = STATES.ORBIT;
      state.orbit.focusWing = "north";
      state.orbit.previewFocusWing = "north";
      state.orbit.phase = PHASES.COMMITTED;
      state.orbit.gestureActive = false;
      state.orbit.quaternion = [0, 0, 0, 1];

      state.cluster.wing = "";
      state.cluster.primaryRoom = "";
      state.cluster.previewPrimaryRoom = "";
      state.cluster.phase = PHASES.COMMITTED;
      state.cluster.gestureActive = false;

      state.activeTab = "overview";
      state.compassMenuOpen = false;
      state.held = false;
      state.failureReason = "";

      syncAll();
      emitReceipt({ status: "available", lastAction: "controller-initialized" });
    } catch (error) {
      failHeld(
        `ARCHCOIN_CONTROLLER_INIT_FAILURE:${
          error && error.message ? error.message : String(error)
        }`
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

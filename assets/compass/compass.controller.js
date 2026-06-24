// /assets/compass/compass.controller.js
// DGB_COMPASS_CONTROLLER_CINEMATIC_BOUNDARY_RESTRUCTURE_TNT_v2_1
// FULL-FILE
// Owns: state, wing selection, room selection, expansion state, focus state,
// panel-slot updates from HTML-owned data attributes, and navigation execution.
// Does not own: visitor copy, page markup, CSS presentation, WebGL rendering,
// diagnostics, visual-pass claims, or room-specific content.

(() => {
  "use strict";

  if (typeof window === "undefined" || typeof document === "undefined") return;

  const CONTRACT = "DGB_COMPASS_CONTROLLER_CINEMATIC_BOUNDARY_RESTRUCTURE_TNT_v2_1";
  const PREVIOUS_CONTRACT = "DGB_COMPASS_CONTROLLER_CINEMATIC_REDESIGN_TNT_v2";
  const FILE = "/assets/compass/compass.controller.js";
  const GLOBAL = "DGBCompassController";

  const SELECTORS = Object.freeze({
    stage: "[data-compass-stage]",
    primary: "[data-compass-primary-route]",
    core: "[data-compass-core]",
    wing: "[data-compass-wing]",
    room: "[data-compass-room]",
    reset: "[data-compass-reset]",
    panel: "[data-compass-room-panel]",
    panelWing: "[data-compass-panel-wing]",
    panelTitle: "[data-compass-panel-title]",
    panelPurpose: "[data-compass-panel-purpose]",
    panelRelationship: "[data-compass-panel-relationship]",
    panelEnter: "[data-compass-enter]"
  });

  const state = {
    mounted: false,
    activeWing: "",
    activeRoom: "",
    expanded: false,
    focused: false,
    roomPanelOpen: false,
    lastAction: "loaded",
    lastNavigationTarget: "",
    updatedAt: now(),
    bound: false
  };

  function now() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function one(selector, root = document) {
    return root.querySelector(selector);
  }

  function all(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function getText(node, name) {
    return node && node.dataset && typeof node.dataset[name] === "string"
      ? node.dataset[name]
      : "";
  }

  function getRoute(node) {
    if (!node) return "";

    return (
      getText(node, "compassRoute") ||
      getText(node, "compassPrimaryRoute") ||
      node.getAttribute("href") ||
      ""
    ).trim();
  }

  function setText(selector, value) {
    const node = one(selector);
    if (node) node.textContent = value || "";
  }

  function setHidden(node, hidden) {
    if (!node) return;
    node.hidden = Boolean(hidden);
  }

  function emit(name, detail) {
    try {
      window.dispatchEvent(new CustomEvent(name, { detail }));
    } catch (_error) {}
  }

  function setPageState() {
    const root = document.documentElement;

    root.dataset.compassControllerContract = CONTRACT;
    root.dataset.compassControllerPreviousContract = PREVIOUS_CONTRACT;
    root.dataset.compassActiveWing = state.activeWing;
    root.dataset.compassActiveRoom = state.activeRoom;
    root.dataset.compassExpanded = String(state.expanded);
    root.dataset.compassFocused = String(state.focused);
    root.dataset.compassRoomPanelOpen = String(state.roomPanelOpen);
  }

  function setSceneState(value) {
    const stage = one(SELECTORS.stage);
    if (stage) stage.dataset.compassSceneState = value;
  }

  function updateWingNodes() {
    all(SELECTORS.wing).forEach((node) => {
      const id = getText(node, "compassWing");
      const selected = Boolean(state.activeWing && id === state.activeWing);
      const faded = Boolean(state.activeWing && id !== state.activeWing);

      node.dataset.compassSelected = String(selected);
      node.dataset.compassFaded = String(faded);
      node.setAttribute("aria-pressed", String(selected));
    });
  }

  function updateRoomNodes() {
    all(SELECTORS.room).forEach((node) => {
      const wing = getText(node, "compassRoomWing");
      const room = getText(node, "compassRoom");
      const visible = Boolean(state.activeWing && wing === state.activeWing);
      const selected = Boolean(state.activeRoom && room === state.activeRoom);

      setHidden(node, !visible);
      node.dataset.compassVisible = String(visible);
      node.dataset.compassSelected = String(selected);
      node.setAttribute("aria-pressed", String(selected));
    });
  }

  function closePanel() {
    const panel = one(SELECTORS.panel);

    state.roomPanelOpen = false;

    if (panel) {
      panel.hidden = true;
      panel.dataset.compassPanelState = "closed";
    }

    setText(SELECTORS.panelWing, "");
    setText(SELECTORS.panelTitle, "");
    setText(SELECTORS.panelPurpose, "");
    setText(SELECTORS.panelRelationship, "");

    const enter = one(SELECTORS.panelEnter);
    if (enter) {
      enter.dataset.compassEnter = "";
      enter.hidden = true;
      enter.setAttribute("aria-disabled", "true");
    }
  }

  function openWingPanel(wingNode) {
    const panel = one(SELECTORS.panel);

    state.roomPanelOpen = true;

    if (panel) {
      panel.hidden = false;
      panel.dataset.compassPanelState = "wing";
    }

    setText(SELECTORS.panelWing, getText(wingNode, "compassLabel") || getText(wingNode, "compassWing"));
    setText(SELECTORS.panelTitle, getText(wingNode, "compassTitle"));
    setText(SELECTORS.panelPurpose, getText(wingNode, "compassPurpose"));
    setText(SELECTORS.panelRelationship, getText(wingNode, "compassRelationship"));

    const enter = one(SELECTORS.panelEnter);
    if (enter) {
      enter.dataset.compassEnter = "";
      enter.hidden = true;
      enter.setAttribute("aria-disabled", "true");
    }
  }

  function openRoomPanel(roomNode) {
    const panel = one(SELECTORS.panel);

    state.roomPanelOpen = true;

    if (panel) {
      panel.hidden = false;
      panel.dataset.compassPanelState = "room";
    }

    setText(SELECTORS.panelWing, getText(roomNode, "compassWingTitle"));
    setText(SELECTORS.panelTitle, getText(roomNode, "compassTitle"));
    setText(SELECTORS.panelPurpose, getText(roomNode, "compassPurpose"));
    setText(SELECTORS.panelRelationship, getText(roomNode, "compassRelationship"));

    const enter = one(SELECTORS.panelEnter);
    if (enter) {
      const route = getRoute(roomNode);
      enter.dataset.compassEnter = route;
      enter.hidden = false;
      enter.setAttribute("aria-disabled", route ? "false" : "true");
    }
  }

  function publish() {
    state.updatedAt = now();
    setPageState();

    const status = getStatus();

    window.DGB_COMPASS_CONTROLLER_STATUS = status;
    window.DGB_COMPASS_CONTROLLER_RECEIPT = getReceiptLight();

    emit("dgb-compass-controller-state", getReceiptLight());

    return status;
  }

  function selectWing(wingId) {
    const clean = String(wingId || "").trim().toLowerCase();
    const wingNode = one(`${SELECTORS.wing}[data-compass-wing="${cssEscape(clean)}"]`);

    if (!clean || !wingNode) return false;

    state.activeWing = clean;
    state.activeRoom = "";
    state.expanded = true;
    state.focused = true;
    state.lastAction = "select-wing:" + clean;

    setSceneState("wing");
    updateWingNodes();
    updateRoomNodes();
    openWingPanel(wingNode);

    publish();
    return true;
  }

  function selectRoom(roomId) {
    const clean = String(roomId || "").trim();
    const roomNode = one(`${SELECTORS.room}[data-compass-room="${cssEscape(clean)}"]`);

    if (!clean || !roomNode) return false;

    state.activeWing = getText(roomNode, "compassRoomWing");
    state.activeRoom = clean;
    state.expanded = true;
    state.focused = true;
    state.lastAction = "select-room:" + clean;

    setSceneState("room");
    updateWingNodes();
    updateRoomNodes();
    openRoomPanel(roomNode);

    publish();
    return true;
  }

  function reset() {
    state.activeWing = "";
    state.activeRoom = "";
    state.expanded = false;
    state.focused = false;
    state.lastAction = "reset";

    setSceneState("startup");
    updateWingNodes();
    updateRoomNodes();
    closePanel();

    publish();
    return true;
  }

  function navigate(route) {
    const target = String(route || "").trim();

    if (!target) return false;

    state.lastNavigationTarget = target;
    state.lastAction = "navigate";
    publish();

    window.location.href = target;
    return true;
  }

  function handleClick(event) {
    const primary = event.target.closest(SELECTORS.primary);
    if (primary) {
      event.preventDefault();
      navigate(getRoute(primary));
      return;
    }

    const core = event.target.closest(SELECTORS.core);
    if (core) {
      event.preventDefault();
      navigate(getRoute(core));
      return;
    }

    const room = event.target.closest(SELECTORS.room);
    if (room) {
      event.preventDefault();
      selectRoom(getText(room, "compassRoom"));
      return;
    }

    const wing = event.target.closest(SELECTORS.wing);
    if (wing) {
      event.preventDefault();
      selectWing(getText(wing, "compassWing"));
      return;
    }

    const enter = event.target.closest(SELECTORS.panelEnter);
    if (enter) {
      event.preventDefault();
      navigate(getText(enter, "compassEnter"));
      return;
    }

    const resetNode = event.target.closest(SELECTORS.reset);
    if (resetNode) {
      event.preventDefault();
      reset();
    }
  }

  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === "function") {
      return window.CSS.escape(value);
    }

    return String(value).replace(/[^a-zA-Z0-9_-]/g, "\\$&");
  }

  function mount() {
    if (state.mounted) return getStatus();

    state.mounted = true;
    state.lastAction = "mounted";

    setSceneState("startup");
    updateWingNodes();
    updateRoomNodes();
    closePanel();

    if (!state.bound) {
      document.addEventListener("click", handleClick);
      state.bound = true;
    }

    publish();
    return getStatus();
  }

  function destroy() {
    if (state.bound) {
      document.removeEventListener("click", handleClick);
      state.bound = false;
    }

    state.mounted = false;
    state.lastAction = "destroyed";

    publish();
    return getStatus();
  }

  function getStatus() {
    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      file: FILE,
      globalName: GLOBAL,
      mounted: state.mounted,
      bound: state.bound,
      activeWing: state.activeWing,
      activeRoom: state.activeRoom,
      expanded: state.expanded,
      focused: state.focused,
      roomPanelOpen: state.roomPanelOpen,
      lastAction: state.lastAction,
      lastNavigationTarget: state.lastNavigationTarget,
      updatedAt: state.updatedAt,
      wingCount: all(SELECTORS.wing).length,
      roomCount: all(SELECTORS.room).length,
      primaryActionCount: all(SELECTORS.primary).length,
      htmlOwnsCopy: true,
      cssOwnsPresentation: true,
      controllerOwnsBehavior: true,
      crystalsOwnVisualization: true,
      estateArchitectureShared: true,
      pageExpressionLocal: true,
      noFifthFile: true,
      diagnosticChamber: false,
      canvas2DFallback: false,
      visualPassClaimed: false
    };
  }

  function getReceiptLight() {
    const status = getStatus();

    return {
      contract: CONTRACT,
      file: FILE,
      status: status.mounted ? "READY" : "HELD",
      mounted: status.mounted,
      activeWing: status.activeWing,
      activeRoom: status.activeRoom,
      expanded: status.expanded,
      lastAction: status.lastAction,
      updatedAt: status.updatedAt,
      visualPassClaimed: false
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),
      state: { ...state },
      status: getStatus(),
      generatedAt: now()
    };
  }

  const API = Object.freeze({
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    file: FILE,
    mount,
    destroy,
    reset,
    selectWing,
    selectRoom,
    navigate,
    getStatus,
    getReceiptLight,
    getReceipt
  });

  window[GLOBAL] = API;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();

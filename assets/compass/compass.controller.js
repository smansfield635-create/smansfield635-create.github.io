// /assets/compass/compass.controller.js
// DGB_COMPASS_GENERATION_ONE_CONTROLLER_TNT_v1_1
// FULL-FILE

(() => {
  "use strict";

  if (typeof window === "undefined" || typeof document === "undefined") return;

  const CONTRACT = "DGB_COMPASS_GENERATION_ONE_CONTROLLER_TNT_v1_1";
  const PREVIOUS_CONTRACT = "DGB_COMPASS_GENERATION_ONE_CONTROLLER_TNT_v1";
  const GLOBAL = "DGBCompassController";

  const S = Object.freeze({
    root: "[data-compass-root]",
    object: "[data-compass-object]",
    wing: "[data-compass-wing]",
    room: "[data-compass-room]",
    mirrorland: "[data-compass-mirrorland]",
    return: "[data-compass-return]",
    enter: "[data-compass-enter]",
    panel: "[data-compass-panel]",
    panelWing: "[data-compass-panel-wing]",
    panelTitle: "[data-compass-panel-title]",
    panelPurpose: "[data-compass-panel-purpose]",
    panelRelationship: "[data-compass-panel-relationship]"
  });

  const state = {
    mounted: false,
    mode: "compass",
    activeWing: "",
    activeRoom: "",
    lastAction: "loaded",
    lastNavigationTarget: "",
    updatedAt: stamp()
  };

  function stamp() {
    return new Date().toISOString();
  }

  function one(selector, root = document) {
    return root.querySelector(selector);
  }

  function all(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function data(node, key) {
    return node && node.dataset ? String(node.dataset[key] || "") : "";
  }

  function routeOf(node) {
    return data(node, "compassRoute") || (node ? node.getAttribute("href") || "" : "");
  }

  function setText(selector, value) {
    const node = one(selector);
    if (node) node.textContent = value || "";
  }

  function escapeCss(value) {
    if (window.CSS && typeof window.CSS.escape === "function") {
      return window.CSS.escape(value);
    }

    return String(value).replace(/[^a-zA-Z0-9_-]/g, "\\$&");
  }

  function currentRoot() {
    return one(S.root);
  }

  function setMode(mode) {
    state.mode = mode;

    const root = currentRoot();
    if (root) {
      root.dataset.compassMode = mode;
      root.dataset.compassActiveWing = state.activeWing;
      root.dataset.compassActiveRoom = state.activeRoom;
    }

    document.documentElement.dataset.compassMode = mode;
    document.documentElement.dataset.compassActiveWing = state.activeWing;
    document.documentElement.dataset.compassActiveRoom = state.activeRoom;
  }

  function objectInfo(node) {
    const objectType = data(node, "compassObject");
    const wing = data(node, "compassWing");
    const room = data(node, "compassRoom");

    return {
      objectType,
      wing,
      room,
      slot: data(node, "compassSlot"),
      isMirrorland: Boolean(node.matches(S.mirrorland) || objectType === "mirrorland"),
      isReturn: Boolean(node.matches(S.return) || objectType === "return"),
      isWing: Boolean(wing && !room),
      isRoom: Boolean(room)
    };
  }

  function updateObjects() {
    all(S.object).forEach((node) => {
      const info = objectInfo(node);

      let visible = false;
      let centered = false;
      let selected = false;
      let faded = false;

      if (state.mode === "compass") {
        visible = info.isMirrorland || info.isWing;
        centered = info.isMirrorland;
      }

      if (state.mode === "expanded") {
        visible =
          info.isReturn ||
          (info.isWing && info.wing === state.activeWing) ||
          (info.isRoom && info.wing === state.activeWing);

        centered = info.isWing && info.wing === state.activeWing;
        selected = centered;
      }

      if (state.mode === "room") {
        visible =
          info.isReturn ||
          (info.isWing && info.wing === state.activeWing) ||
          (info.isRoom && info.wing === state.activeWing);

        centered = info.isWing && info.wing === state.activeWing;
        selected = centered || info.room === state.activeRoom;
        faded = info.isRoom && info.room !== state.activeRoom;
      }

      node.hidden = !visible;
      node.dataset.compassVisible = String(visible);
      node.dataset.compassCentered = String(centered);
      node.dataset.compassSelected = String(selected);
      node.dataset.compassFaded = String(faded);

      if (node.matches("button")) {
        node.setAttribute("aria-pressed", String(selected));
      }
    });
  }

  function closePanel() {
    const panel = one(S.panel);
    if (panel) {
      panel.hidden = true;
      panel.dataset.compassPanelState = "closed";
    }

    setText(S.panelWing, "");
    setText(S.panelTitle, "");
    setText(S.panelPurpose, "");
    setText(S.panelRelationship, "");

    const enter = one(S.enter);
    if (enter) {
      enter.hidden = true;
      enter.dataset.compassRoute = "";
      enter.setAttribute("aria-disabled", "true");
    }
  }

  function openRoomPanel(roomNode) {
    const panel = one(S.panel);
    if (panel) {
      panel.hidden = false;
      panel.dataset.compassPanelState = "room";
    }

    setText(S.panelWing, data(roomNode, "compassWingTitle"));
    setText(S.panelTitle, data(roomNode, "compassTitle"));
    setText(S.panelPurpose, data(roomNode, "compassPurpose"));
    setText(S.panelRelationship, data(roomNode, "compassRelationship"));

    const enter = one(S.enter);
    if (enter) {
      const route = routeOf(roomNode);
      enter.hidden = false;
      enter.dataset.compassRoute = route;
      enter.setAttribute("aria-disabled", route ? "false" : "true");
    }
  }

  function roomsForWing(wing) {
    return all(`${S.room}[data-compass-wing="${escapeCss(wing)}"]`);
  }

  function slotAudit() {
    const warnings = [];
    const rooms = all(S.room);

    rooms.forEach((room) => {
      const wing = data(room, "compassWing");
      const id = data(room, "compassRoom");
      const slot = data(room, "compassSlot");

      if (!slot) {
        warnings.push({
          type: "missing-slot",
          wing,
          room: id
        });
      }

      if (slot && !/^[1-5]$/.test(slot)) {
        warnings.push({
          type: "invalid-slot",
          wing,
          room: id,
          slot
        });
      }
    });

    Object.keys(groupRoomsByWing()).forEach((wing) => {
      const seen = new Set();

      groupRoomsByWing()[wing].forEach((room) => {
        const slot = data(room, "compassSlot");
        if (!slot) return;

        if (seen.has(slot)) {
          warnings.push({
            type: "duplicate-slot",
            wing,
            slot
          });
        }

        seen.add(slot);
      });
    });

    return warnings;
  }

  function groupRoomsByWing() {
    return all(S.room).reduce((acc, room) => {
      const wing = data(room, "compassWing") || "unknown";
      if (!acc[wing]) acc[wing] = [];
      acc[wing].push(room);
      return acc;
    }, {});
  }

  function publish() {
    state.updatedAt = stamp();

    const status = getStatus();
    window.DGB_COMPASS_CONTROLLER_STATUS = status;
    window.DGB_COMPASS_CONTROLLER_RECEIPT = getReceiptLight();

    try {
      window.dispatchEvent(
        new CustomEvent("dgb-compass-controller-state", {
          detail: getReceiptLight()
        })
      );
    } catch (_error) {}

    return status;
  }

  function selectWing(wing) {
    const clean = String(wing || "").trim().toLowerCase();
    if (!clean) return false;

    const wingNode = one(`${S.wing}[data-compass-wing="${escapeCss(clean)}"]`);
    if (!wingNode) return false;

    state.activeWing = clean;
    state.activeRoom = "";
    state.lastAction = "select-wing:" + clean;

    setMode("expanded");
    updateObjects();
    closePanel();
    publish();

    return true;
  }

  function selectRoom(room) {
    const clean = String(room || "").trim();
    if (!clean) return false;

    const roomNode = one(`${S.room}[data-compass-room="${escapeCss(clean)}"]`);
    if (!roomNode) return false;

    state.activeWing = data(roomNode, "compassWing");
    state.activeRoom = clean;
    state.lastAction = "select-room:" + clean;

    setMode("room");
    updateObjects();
    openRoomPanel(roomNode);
    publish();

    return true;
  }

  function returnToCompass() {
    state.activeWing = "";
    state.activeRoom = "";
    state.lastAction = "return-to-compass";

    setMode("compass");
    updateObjects();
    closePanel();
    publish();

    return true;
  }

  function navigate(route) {
    const target = String(route || "").trim();
    if (!target) return false;

    state.lastNavigationTarget = target;
    state.lastAction = "navigate:" + target;
    publish();

    window.location.href = target;
    return true;
  }

  function handleClick(event) {
    const enter = event.target.closest(S.enter);
    if (enter) {
      event.preventDefault();
      navigate(routeOf(enter));
      return;
    }

    const back = event.target.closest(S.return);
    if (back) {
      event.preventDefault();
      returnToCompass();
      return;
    }

    const mirrorland = event.target.closest(S.mirrorland);
    if (mirrorland) {
      event.preventDefault();
      navigate(routeOf(mirrorland));
      return;
    }

    const room = event.target.closest(S.room);
    if (room) {
      event.preventDefault();
      selectRoom(data(room, "compassRoom"));
      return;
    }

    const wing = event.target.closest(S.wing);
    if (wing) {
      event.preventDefault();
      selectWing(data(wing, "compassWing"));
    }
  }

  function mount() {
    if (state.mounted) return getStatus();

    state.mounted = true;
    state.lastAction = "mounted";

    document.addEventListener("click", handleClick);

    setMode("compass");
    updateObjects();
    closePanel();
    publish();

    return getStatus();
  }

  function destroy() {
    document.removeEventListener("click", handleClick);

    state.mounted = false;
    state.lastAction = "destroyed";

    publish();
    return getStatus();
  }

  function activeWingSlots() {
    if (!state.activeWing) return [];

    return roomsForWing(state.activeWing).map((room) => ({
      room: data(room, "compassRoom"),
      slot: data(room, "compassSlot")
    }));
  }

  function getStatus() {
    const warnings = slotAudit();

    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      mounted: state.mounted,
      mode: state.mode,
      activeWing: state.activeWing,
      activeRoom: state.activeRoom,
      lastAction: state.lastAction,
      lastNavigationTarget: state.lastNavigationTarget,
      updatedAt: state.updatedAt,

      mirrorlandDirectRoute: routeOf(one(S.mirrorland)),
      wingCount: all(S.wing).length,
      roomCount: all(S.room).length,
      activeWingRoomCount: state.activeWing ? roomsForWing(state.activeWing).length : 0,
      activeWingSlots: activeWingSlots(),

      roomSlotsPresent: warnings.filter((item) => item.type === "missing-slot").length === 0,
      slotWarnings: warnings,

      htmlOwnsCopy: true,
      htmlOwnsSlots: true,
      cssConsumesSlots: true,
      controllerOwnsBehavior: true,
      controllerDoesNotOwnGeometry: true,
      crystalsOwnVisualization: true,

      noFifthFile: true,
      canvas2DFallback: false,
      diagnosticChamber: false,
      visualPassClaimed: false
    };
  }

  function getReceiptLight() {
    return {
      contract: CONTRACT,
      status: state.mounted ? "READY" : "HELD",
      mode: state.mode,
      activeWing: state.activeWing,
      activeRoom: state.activeRoom,
      lastAction: state.lastAction,
      updatedAt: state.updatedAt,
      visualPassClaimed: false
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),
      state: { ...state },
      statusDetail: getStatus(),
      generatedAt: stamp()
    };
  }

  window[GLOBAL] = Object.freeze({
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    mount,
    destroy,
    selectWing,
    selectRoom,
    returnToCompass,
    navigate,
    getStatus,
    getReceiptLight,
    getReceipt
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();

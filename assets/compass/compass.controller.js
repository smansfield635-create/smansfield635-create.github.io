/* /assets/compass/compass.controller.js
   DGB Compass Generation Two — controller routing and reveal correction.
   Scope: compass.controller.js only.
   Owns behavior, state transitions, panel population, explicit Enter navigation, route validation, reveal copy, and receipts.
   Does not own WebGL geometry, buffers, camera, lighting, projection, render loop, CSS, HTML route membership, or visual-pass claims.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "DGB_COMPASS_GENERATION_TWO_CONTROLLER_ROUTING_REVEAL_TNT_v1",
    file: "/assets/compass/compass.controller.js",
    visualPassClaimed: false,
    productionAuthorized: false,
    deploymentAuthorized: false,
    fifthFileAuthorized: false
  });

  const MODES = Object.freeze({
    COMPASS: "COMPASS_MODE",
    EXPANDED: "EXPANDED_MODE",
    ROOM: "ROOM_MODE"
  });

  const WINGS = Object.freeze(["north", "east", "south", "west"]);

  const state = {
    root: null,
    wings: [],
    rooms: [],
    returnControl: null,
    panel: null,
    panelTitle: null,
    panelPurpose: null,
    panelRelationship: null,
    enterControl: null,
    receiptSlot: null,
    mode: MODES.COMPASS,
    selectedWing: "",
    selectedRoom: "",
    selectedRoomLabel: "",
    activeRoute: "",
    routeSource: "none",
    reducedMotion: false,
    lastAction: "init",
    held: false,
    failureReason: null,
    invalidRooms: []
  };

  const RECEIPT = {
    contractId: CONTRACT.id,
    rootStatus: "pending",
    wingCount: 0,
    roomCount: 0,
    mode: MODES.COMPASS,
    selectedWing: "",
    selectedRoom: "",
    selectedRoomLabel: "",
    selectedRoomRoute: "",
    activeRoutePresent: false,
    enterEnabled: false,
    routeSource: "none",
    panelStatus: "pending",
    returnStatus: "pending",
    lastAction: "init",
    failureReason: null,
    visualPassClaimed: false
  };

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function $all(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function normalizeWing(value) {
    const wing = String(value || "").trim().toLowerCase();
    return WINGS.includes(wing) ? wing : "";
  }

  function normalizeMode(value) {
    const mode = String(value || "").trim().toUpperCase();
    if (mode === MODES.EXPANDED) return MODES.EXPANDED;
    if (mode === MODES.ROOM) return MODES.ROOM;
    return MODES.COMPASS;
  }

  function setText(el, value) {
    if (el) el.textContent = value || "";
  }

  function emitReceipt(extra = {}) {
    const enterEnabled = !!state.enterControl && state.enterControl.disabled === false;

    Object.assign(RECEIPT, {
      rootStatus: state.root ? "found" : "missing",
      wingCount: state.wings.length,
      roomCount: state.rooms.length,
      mode: state.mode,
      selectedWing: state.selectedWing,
      selectedRoom: state.selectedRoom,
      selectedRoomLabel: state.selectedRoomLabel,
      selectedRoomRoute: state.activeRoute,
      activeRoutePresent: !!state.activeRoute,
      enterEnabled,
      routeSource: state.routeSource,
      panelStatus: state.panel ? "found" : "missing",
      returnStatus: state.returnControl ? "found" : "missing",
      lastAction: state.lastAction,
      failureReason: state.failureReason,
      visualPassClaimed: false
    }, extra);

    if (state.receiptSlot) {
      const text = JSON.stringify(RECEIPT);
      state.receiptSlot.value = text;
      state.receiptSlot.textContent = text;
      state.receiptSlot.dataset.visualPassClaimed = "false";
    }

    if (state.root) {
      state.root.dataset.compassControllerReceipt = JSON.stringify(RECEIPT);
      state.root.dataset.visualPassClaimed = "false";
    }

    globalThis.DGB_COMPASS_CONTROLLER_RECEIPT = Object.freeze({ ...RECEIPT });
  }

  function hold(reason) {
    state.held = true;
    state.failureReason = reason;
    state.lastAction = "hold";
    emitReceipt({ failureReason: reason });
  }

  function acquireDom() {
    state.root = $("[data-compass-root]");
    if (!state.root) {
      hold("MISSING_DATA_COMPASS_ROOT");
      return false;
    }

    state.wings = $all("[data-compass-wing][data-wing]", state.root)
      .filter((el) => normalizeWing(el.dataset.wing));

    state.rooms = $all("[data-compass-room][data-wing][data-room-id]", state.root)
      .map(readRoom)
      .filter(Boolean);

    state.returnControl = $("[data-compass-return]", state.root);
    state.panel = $("[data-compass-panel]", state.root);
    state.panelTitle = $("[data-compass-panel-title]", state.root);
    state.panelPurpose = $("[data-compass-panel-purpose]", state.root);
    state.panelRelationship = $("[data-compass-panel-relationship]", state.root);
    state.enterControl = $("[data-compass-enter]", state.root);
    state.receiptSlot = $("[data-compass-controller-receipt]", state.root);

    if (state.wings.length < 1) {
      hold("NO_VALID_WING_SELECTORS");
      return false;
    }

    if (state.rooms.length < 1) {
      hold("NO_VALID_ROOM_DECLARATIONS");
      return false;
    }

    state.reducedMotion =
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      state.root.dataset.reducedMotion === "true";

    state.root.dataset.reducedMotion = state.reducedMotion ? "true" : "false";
    state.root.dataset.visualPassClaimed = "false";

    return true;
  }

  function readRoom(el) {
    const wing = normalizeWing(el.dataset.wing);
    const roomId = String(el.dataset.roomId || "").trim();
    const route = String(el.dataset.route || el.getAttribute("href") || "").trim();

    if (!wing || !roomId || !route) {
      state.invalidRooms.push(el);
      return null;
    }

    return {
      el,
      wing,
      roomId,
      label: el.dataset.label || el.textContent.trim() || roomId,
      route,
      purpose: el.dataset.purpose || "Open this estate room.",
      relationship: el.dataset.relationship || "Compass destination.",
      preview: el.dataset.preview || el.dataset.purpose || "A room behind the selected Compass direction.",
      whyEnter: el.dataset.whyEnter || "Enter to cross into this destination.",
      hidden: el.hidden
    };
  }

  function findWingElement(wing) {
    return state.wings.find((el) => normalizeWing(el.dataset.wing) === wing) || null;
  }

  function findRoom(roomId) {
    return state.rooms.find((room) => room.roomId === roomId) || null;
  }

  function getSelectedRoom() {
    if (!state.selectedRoom) return null;
    return findRoom(state.selectedRoom);
  }

  function writeRootState() {
    state.root.dataset.compassMode = state.mode;
    state.root.dataset.selectedWing = state.selectedWing || "";
    state.root.dataset.selectedRoom = state.selectedRoom || "";
    state.root.dataset.reducedMotion = state.reducedMotion ? "true" : "false";
    state.root.dataset.visualPassClaimed = "false";
  }

  function clearRoute() {
    state.activeRoute = "";
    state.routeSource = "none";
    state.selectedRoomLabel = "";
  }

  function setInvalidRoute(reason) {
    state.activeRoute = "";
    state.routeSource = reason || "invalid-room";
  }

  function updateVisibility() {
    if (state.returnControl) {
      state.returnControl.hidden = state.mode === MODES.COMPASS;
      state.returnControl.disabled = state.mode === MODES.COMPASS;
    }

    state.rooms.forEach((room) => {
      const visible =
        (state.mode === MODES.EXPANDED || state.mode === MODES.ROOM) &&
        room.wing === state.selectedWing;

      room.el.hidden = !visible;
      room.el.dataset.active = room.roomId === state.selectedRoom ? "true" : "false";
    });

    state.wings.forEach((wingEl) => {
      const wing = normalizeWing(wingEl.dataset.wing);
      wingEl.dataset.active = wing && wing === state.selectedWing ? "true" : "false";
      wingEl.dataset.withdrawn =
        state.selectedWing && wing !== state.selectedWing ? "true" : "false";
    });
  }

  function updatePanel() {
    if (!state.panel) return;

    if (state.mode === MODES.COMPASS) {
      setText(state.panelTitle, "Choose a wing");
      setText(state.panelPurpose, "A navigation system for coherence.");
      setText(state.panelRelationship, "Choose a direction. Explore a world. Open an instrument. Find what moves you forward.");
      setEnter(null);
      return;
    }

    if (state.mode === MODES.EXPANDED) {
      const wingEl = findWingElement(state.selectedWing);
      const title =
        wingEl ? wingEl.dataset.title || wingEl.dataset.label || state.selectedWing : state.selectedWing;

      const meaning =
        wingEl && wingEl.dataset.wingMeaning
          ? wingEl.dataset.wingMeaning
          : "Choose a room inside this wing.";

      const why =
        wingEl && wingEl.dataset.wingWhy
          ? wingEl.dataset.wingWhy
          : "Return steps back to the full Compass.";

      setText(state.panelTitle, title);
      setText(state.panelPurpose, meaning);
      setText(state.panelRelationship, why);
      setEnter(null);
      return;
    }

    if (state.mode === MODES.ROOM) {
      const room = getSelectedRoom();

      if (!room) {
        setText(state.panelTitle, "Room unavailable");
        setText(state.panelPurpose, "The selected room could not be resolved.");
        setText(state.panelRelationship, "Return to the wing and choose again.");
        setEnter(null);
        setInvalidRoute("invalid-room");
        return;
      }

      if (!room.route) {
        setText(state.panelTitle, room.label);
        setText(state.panelPurpose, room.preview);
        setText(state.panelRelationship, "This room has no verified route. Return and choose another room.");
        setEnter(null);
        setInvalidRoute("missing-route");
        return;
      }

      state.selectedRoomLabel = room.label;
      state.activeRoute = room.route;
      state.routeSource = "html-room-declaration";

      setText(state.panelTitle, room.label);
      setText(state.panelPurpose, room.preview);
      setText(state.panelRelationship, room.whyEnter);
      setEnter(room.route, room.whyEnter);
    }
  }

  function setEnter(route, whyEnter = "") {
    if (!state.enterControl) return;

    if (route) {
      state.enterControl.disabled = false;
      state.enterControl.dataset.route = route;
      state.enterControl.dataset.whyEnter = whyEnter || "";
      state.enterControl.setAttribute("aria-disabled", "false");
      state.enterControl.setAttribute("aria-label", whyEnter || "Enter selected room");
    } else {
      state.enterControl.disabled = true;
      delete state.enterControl.dataset.route;
      delete state.enterControl.dataset.whyEnter;
      state.enterControl.setAttribute("aria-disabled", "true");
      state.enterControl.setAttribute("aria-label", "Enter");
    }
  }

  function commit(action) {
    state.lastAction = action;
    writeRootState();
    updateVisibility();
    updatePanel();
    emitReceipt();
  }

  function enterCompassMode(action = "enter-compass-mode") {
    state.mode = MODES.COMPASS;
    state.selectedWing = "";
    state.selectedRoom = "";
    clearRoute();
    commit(action);
  }

  function enterExpandedMode(wing, action = "enter-expanded-mode") {
    const normalized = normalizeWing(wing);
    if (!normalized) return;

    state.mode = MODES.EXPANDED;
    state.selectedWing = normalized;
    state.selectedRoom = "";
    clearRoute();
    commit(action);
  }

  function enterRoomMode(roomId, action = "enter-room-mode") {
    const normalizedRoomId = String(roomId || "").trim();
    const room = findRoom(normalizedRoomId);

    if (!room) {
      state.selectedRoom = "";
      setInvalidRoute("invalid-room");
      commit("room-selection-rejected-invalid-room");
      return;
    }

    if (!state.selectedWing) {
      state.selectedWing = room.wing;
    }

    if (room.wing !== state.selectedWing) {
      setInvalidRoute("invalid-room-wing-mismatch");
      commit("room-selection-rejected-wing-mismatch");
      return;
    }

    state.mode = MODES.ROOM;
    state.selectedRoom = room.roomId;
    state.selectedRoomLabel = room.label;

    if (room.route) {
      state.activeRoute = room.route;
      state.routeSource = "html-room-declaration";
    } else {
      setInvalidRoute("missing-route");
    }

    commit(action);
  }

  function returnStep() {
    if (state.mode === MODES.ROOM) {
      state.mode = MODES.EXPANDED;
      state.selectedRoom = "";
      clearRoute();
      commit("return-room-to-wing");
      return;
    }

    if (state.mode === MODES.EXPANDED) {
      enterCompassMode("return-wing-to-compass");
      return;
    }

    enterCompassMode("return-at-compass");
  }

  function navigateEnter() {
    const room = getSelectedRoom();

    if (
      state.mode !== MODES.ROOM ||
      !room ||
      !room.route ||
      state.activeRoute !== room.route ||
      state.routeSource !== "html-room-declaration"
    ) {
      state.lastAction = "enter-held-invalid-or-missing-room-route";
      if (!room) setInvalidRoute("invalid-room");
      else if (!room.route) setInvalidRoute("missing-route");
      else setInvalidRoute("route-mismatch");
      setEnter(null);
      emitReceipt();
      return;
    }

    state.lastAction = "enter-navigation";
    state.activeRoute = room.route;
    state.selectedRoomLabel = room.label;
    state.routeSource = "html-room-declaration";
    emitReceipt();
    window.location.assign(room.route);
  }

  function bindEvents() {
    state.wings.forEach((wingEl) => {
      wingEl.addEventListener("click", (event) => {
        event.preventDefault();
        enterExpandedMode(wingEl.dataset.wing, "wing-selected");
      });
    });

    state.rooms.forEach((room) => {
      room.el.addEventListener("click", (event) => {
        event.preventDefault();
        enterRoomMode(room.roomId, "room-selected");
      });
    });

    if (state.returnControl) {
      state.returnControl.addEventListener("click", (event) => {
        event.preventDefault();
        returnStep();
      });
    }

    if (state.enterControl) {
      state.enterControl.addEventListener("click", (event) => {
        event.preventDefault();
        navigateEnter();
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && state.mode !== MODES.COMPASS) {
        event.preventDefault();
        returnStep();
      }
    });

    const motionQuery = globalThis.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery && typeof motionQuery.addEventListener === "function") {
      motionQuery.addEventListener("change", () => {
        state.reducedMotion = motionQuery.matches;
        commit("reduced-motion-updated");
      });
    }
  }

  function restoreInitialState() {
    const initialMode = normalizeMode(state.root.dataset.compassMode);
    const initialWing = normalizeWing(state.root.dataset.selectedWing);
    const initialRoom = String(state.root.dataset.selectedRoom || "").trim();

    if (initialMode === MODES.ROOM && initialWing && findRoom(initialRoom)) {
      state.mode = MODES.ROOM;
      state.selectedWing = initialWing;
      enterRoomMode(initialRoom, "restore-room-mode");
      return;
    }

    if (initialMode === MODES.EXPANDED && initialWing) {
      enterExpandedMode(initialWing, "restore-expanded-mode");
      return;
    }

    enterCompassMode("restore-compass-mode");
  }

  function exposeApi() {
    globalThis.DGB_COMPASS_CONTROLLER = Object.freeze({
      contract: CONTRACT,
      receipt: () => Object.freeze({ ...RECEIPT }),

      selectWing: (wing) => {
        enterExpandedMode(wing, "api-select-wing");
      },

      selectRoom: (roomId) => {
        enterRoomMode(roomId, "api-select-room");
      },

      requestRoomSelection: (roomId) => {
        enterRoomMode(roomId, "api-request-room-selection");
      },

      returnStep,

      enter: navigateEnter
    });
  }

  function init() {
    if (!acquireDom()) return;

    bindEvents();
    exposeApi();
    restoreInitialState();

    emitReceipt({
      rootStatus: "found",
      panelStatus: state.panel ? "found" : "missing",
      returnStatus: state.returnControl ? "found" : "missing",
      visualPassClaimed: false
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

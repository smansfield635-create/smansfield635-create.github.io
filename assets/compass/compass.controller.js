/* /assets/compass/compass.controller.js
   DGB Compass Generation Two — controller state machine with swipe/tap/Enter hardening.
   Scope: compass.controller.js only. 
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "DGB_COMPASS_GENERATION_TWO_CONTROLLER_SWIPE_TAP_ENTER_TNT_v1",
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
    selectedRoomRoute: "",
    activeRoute: "",
    routeSource: "",
    enterEnabled: false,
    reducedMotion: false,
    lastAction: "init",
    lastOrientationInput: "init",
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
    activeDirection: "",
    activeDestination: "",
    selectedWing: "",
    selectedRoom: "",
    selectedRoomLabel: "",
    selectedRoomRoute: "",
    activeRoutePresent: false,
    routeSource: "",
    enterEnabled: false,
    panelStatus: "pending",
    returnStatus: "pending",
    lastAction: "init",
    lastOrientationInput: "init",
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

  function isValidRoute(route) {
    const value = String(route || "").trim();
    return value.length > 0 && value.charAt(0) === "/";
  }

  function emitReceipt(extra = {}) {
    Object.assign(RECEIPT, {
      rootStatus: state.root ? "found" : "missing",
      wingCount: state.wings.length,
      roomCount: state.rooms.length,
      mode: state.mode,
      activeDirection: state.selectedWing || "",
      activeDestination: state.selectedRoom || "",
      selectedWing: state.selectedWing || "",
      selectedRoom: state.selectedRoom || "",
      selectedRoomLabel: state.selectedRoomLabel || "",
      selectedRoomRoute: state.selectedRoomRoute || "",
      activeRoutePresent: !!state.activeRoute,
      routeSource: state.routeSource || "",
      enterEnabled: state.enterEnabled === true,
      panelStatus: state.panel ? "found" : "missing",
      returnStatus: state.returnControl ? "found" : "missing",
      lastAction: state.lastAction,
      lastOrientationInput: state.lastOrientationInput,
      failureReason: state.failureReason,
      visualPassClaimed: false
    }, extra, { visualPassClaimed: false });

    if (state.receiptSlot) {
      state.receiptSlot.value = JSON.stringify(RECEIPT);
      state.receiptSlot.textContent = JSON.stringify(RECEIPT);
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

  function readRoom(el) {
    const wing = normalizeWing(el.dataset.wing);
    const roomId = String(el.dataset.roomId || "").trim();
    const route = String(el.dataset.route || el.getAttribute("href") || "").trim();

    if (!wing || !roomId) {
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
      preview: el.dataset.preview || el.dataset.purpose || "Open this estate room.",
      whyEnter: el.dataset.whyEnter || "Enter this room.",
      validRoute: isValidRoute(route)
    };
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

  function findRoom(roomId) {
    return state.rooms.find((room) => room.roomId === roomId) || null;
  }

  function findWingEl(wing) {
    return state.wings.find((el) => normalizeWing(el.dataset.wing) === wing) || null;
  }

  function clearRouteState() {
    state.selectedRoom = "";
    state.selectedRoomLabel = "";
    state.selectedRoomRoute = "";
    state.activeRoute = "";
    state.routeSource = "";
    state.enterEnabled = false;
  }

  function writeRootState() {
    state.root.dataset.compassMode = state.mode;
    state.root.dataset.selectedWing = state.selectedWing || "";
    state.root.dataset.selectedRoom = state.selectedRoom || "";
    state.root.dataset.reducedMotion = state.reducedMotion ? "true" : "false";
    state.root.dataset.visualPassClaimed = "false";
  }

  function setEnter(route, source) {
    const valid = isValidRoute(route);

    state.activeRoute = valid ? route : "";
    state.selectedRoomRoute = valid ? route : "";
    state.routeSource = valid ? source || "html-room-declaration" : "";
    state.enterEnabled = valid;

    if (!state.enterControl) return;

    if (valid) {
      state.enterControl.disabled = false;
      state.enterControl.dataset.route = route;
      state.enterControl.dataset.routeSource = state.routeSource;
      state.enterControl.setAttribute("aria-disabled", "false");
    } else {
      state.enterControl.disabled = true;
      delete state.enterControl.dataset.route;
      delete state.enterControl.dataset.routeSource;
      state.enterControl.setAttribute("aria-disabled", "true");
    }
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
      setEnter("", "");
      return;
    }

    if (state.mode === MODES.EXPANDED) {
      const wingEl = findWingEl(state.selectedWing);
      const title = wingEl ? wingEl.dataset.title || wingEl.dataset.label || state.selectedWing : state.selectedWing;

      setText(state.panelTitle, title);
      setText(state.panelPurpose, wingEl && wingEl.dataset.wingMeaning ? wingEl.dataset.wingMeaning : "Choose a destination inside this direction.");
      setText(state.panelRelationship, wingEl && wingEl.dataset.wingWhy ? wingEl.dataset.wingWhy : "Select a room to preview its value before entering.");
      setEnter("", "");
      return;
    }

    if (state.mode === MODES.ROOM) {
      const room = findRoom(state.selectedRoom);

      if (!room) {
        setText(state.panelTitle, "Room unavailable");
        setText(state.panelPurpose, "The selected room could not be resolved.");
        setText(state.panelRelationship, "Return to the wing and choose again.");
        setEnter("", "");
        return;
      }

      setText(state.panelTitle, room.label);
      setText(state.panelPurpose, room.preview || room.purpose);
      setText(state.panelRelationship, room.whyEnter || room.relationship);

      if (room.validRoute) {
        setEnter(room.route, "html-room-declaration");
      } else {
        setEnter("", "");
      }
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
    clearRouteState();
    commit(action);
  }

  function enterExpandedMode(wing, action = "enter-expanded-mode", input = "direct") {
    const normalized = normalizeWing(wing);
    if (!normalized) return false;

    state.mode = MODES.EXPANDED;
    state.selectedWing = normalized;
    clearRouteState();
    state.lastOrientationInput = input;
    commit(action);
    return true;
  }

  function enterRoomMode(roomId, action = "enter-room-mode", input = "direct") {
    const room = findRoom(roomId);

    if (!room) {
      clearRouteState();
      state.lastOrientationInput = input;
      commit("room-selection-rejected");
      return false;
    }

    state.selectedWing = room.wing;
    state.mode = MODES.ROOM;
    state.selectedRoom = room.roomId;
    state.selectedRoomLabel = room.label;
    state.lastOrientationInput = input;

    if (room.validRoute) {
      state.activeRoute = room.route;
      state.selectedRoomRoute = room.route;
      state.routeSource = "html-room-declaration";
      state.enterEnabled = true;
    } else {
      state.activeRoute = "";
      state.selectedRoomRoute = "";
      state.routeSource = "";
      state.enterEnabled = false;
    }

    commit(action);
    return true;
  }

  function requestDirectionSelection(direction) {
    return enterExpandedMode(direction, "direction-selection-requested", "orientation-plane-request");
  }

  function requestRoomSelection(roomId) {
    return enterRoomMode(roomId, "room-selection-requested", "visual-room-request");
  }

  function returnStep() {
    if (state.mode === MODES.ROOM) {
      state.mode = MODES.EXPANDED;
      clearRouteState();
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
    const room = findRoom(state.selectedRoom);
    const routeIsValid =
      state.mode === MODES.ROOM &&
      room &&
      room.validRoute &&
      state.enterEnabled === true &&
      state.activeRoute === room.route &&
      state.routeSource === "html-room-declaration";

    if (!routeIsValid) {
      state.lastAction = "enter-held-no-valid-selected-room-route";
      state.enterEnabled = false;
      setEnter("", "");
      emitReceipt({
        lastAction: state.lastAction,
        enterEnabled: false,
        failureReason: "ENTER_HELD_NO_VALID_SELECTED_ROOM_ROUTE"
      });
      return;
    }

    state.lastAction = "enter-navigation";
    emitReceipt({
      selectedRoomRoute: state.activeRoute,
      routeSource: "html-room-declaration",
      enterEnabled: true
    });

    window.location.assign(state.activeRoute);
  }

  function bindEvents() {
    state.wings.forEach((wingEl) => {
      wingEl.addEventListener("click", (event) => {
        event.preventDefault();
        enterExpandedMode(wingEl.dataset.wing, "wing-selected", "tap-wing");
      });
    });

    state.rooms.forEach((room) => {
      room.el.addEventListener("click", (event) => {
        event.preventDefault();
        enterRoomMode(room.roomId, "room-selected", "tap-room");
      });
    });

    if (state.returnControl) {
      state.returnControl.addEventListener("click", () => {
        returnStep();
      });
    }

    if (state.enterControl) {
      state.enterControl.addEventListener("click", () => {
        navigateEnter();
      });
    }

    document.addEventListener("keydown", (event) => {
      const active = document.activeElement;
      const isTypingTarget =
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          active.tagName === "SELECT" ||
          active.isContentEditable);

      if (isTypingTarget) return;

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

    if (initialMode === MODES.ROOM && findRoom(initialRoom)) {
      enterRoomMode(initialRoom, "restore-room-mode", "restore");
      return;
    }

    if (initialMode === MODES.EXPANDED && initialWing) {
      enterExpandedMode(initialWing, "restore-expanded-mode", "restore");
      return;
    }

    enterCompassMode("restore-compass-mode");
  }

  function exposeApi() {
    globalThis.DGB_COMPASS_CONTROLLER = Object.freeze({
      contract: CONTRACT,
      receipt: () => Object.freeze({ ...RECEIPT }),
      selectWing: (wing) => enterExpandedMode(wing, "api-select-wing", "api"),
      selectRoom: (roomId) => enterRoomMode(roomId, "api-select-room", "api"),
      requestDirectionSelection,
      requestRoomSelection,
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

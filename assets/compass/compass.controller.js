/* /assets/compass/compass.controller.js
   DGB Compass Generation One — controller state machine.
   Scope: compass.controller.js only.
   Owns behavior, state transitions, panel population, explicit navigation, and receipts.
   Does not own WebGL geometry, buffers, camera, lighting, projection, render loop, CSS, or visual-pass claims.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "DGB_COMPASS_GENERATION_ONE_CONTROLLER_TNT_v1",
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
    activeRoute: "",
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
    activeRoutePresent: false,
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
    Object.assign(RECEIPT, {
      rootStatus: state.root ? "found" : "missing",
      wingCount: state.wings.length,
      roomCount: state.rooms.length,
      mode: state.mode,
      selectedWing: state.selectedWing,
      selectedRoom: state.selectedRoom,
      activeRoutePresent: !!state.activeRoute,
      panelStatus: state.panel ? "found" : "missing",
      returnStatus: state.returnControl ? "found" : "missing",
      lastAction: state.lastAction,
      failureReason: state.failureReason,
      visualPassClaimed: false
    }, extra);

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
      hidden: el.hidden
    };
  }

  function roomsForWing(wing) {
    return state.rooms.filter((room) => room.wing === wing);
  }

  function findRoom(roomId) {
    return state.rooms.find((room) => room.roomId === roomId) || null;
  }

  function writeRootState() {
    state.root.dataset.compassMode = state.mode;
    state.root.dataset.selectedWing = state.selectedWing || "";
    state.root.dataset.selectedRoom = state.selectedRoom || "";
    state.root.dataset.reducedMotion = state.reducedMotion ? "true" : "false";
    state.root.dataset.visualPassClaimed = "false";
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
      setText(state.panelPurpose, "Select North, East, South, or West to reveal the estate rooms.");
      setText(state.panelRelationship, "The Compass orients the visitor before navigation.");
      setEnter(null);
      return;
    }

    if (state.mode === MODES.EXPANDED) {
      const wingEl = state.wings.find((el) => normalizeWing(el.dataset.wing) === state.selectedWing);
      const title = wingEl ? wingEl.dataset.title || wingEl.dataset.label || state.selectedWing : state.selectedWing;

      setText(state.panelTitle, title);
      setText(state.panelPurpose, "Choose a room inside this wing.");
      setText(state.panelRelationship, "Return steps back to the full Compass.");
      setEnter(null);
      return;
    }

    if (state.mode === MODES.ROOM) {
      const room = findRoom(state.selectedRoom);
      if (!room) {
        setText(state.panelTitle, "Room unavailable");
        setText(state.panelPurpose, "The selected room could not be resolved.");
        setText(state.panelRelationship, "Return to the wing and choose again.");
        setEnter(null);
        return;
      }

      setText(state.panelTitle, room.label);
      setText(state.panelPurpose, room.purpose);
      setText(state.panelRelationship, room.relationship);
      setEnter(room.route);
    }
  }

  function setEnter(route) {
    state.activeRoute = route || "";

    if (!state.enterControl) return;

    if (route) {
      state.enterControl.disabled = false;
      state.enterControl.dataset.route = route;
      state.enterControl.setAttribute("aria-disabled", "false");
    } else {
      state.enterControl.disabled = true;
      delete state.enterControl.dataset.route;
      state.enterControl.setAttribute("aria-disabled", "true");
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
    state.activeRoute = "";
    commit(action);
  }

  function enterExpandedMode(wing, action = "enter-expanded-mode") {
    const normalized = normalizeWing(wing);
    if (!normalized) return;

    state.mode = MODES.EXPANDED;
    state.selectedWing = normalized;
    state.selectedRoom = "";
    state.activeRoute = "";
    commit(action);
  }

  function enterRoomMode(roomId, action = "enter-room-mode") {
    const room = findRoom(roomId);
    if (!room) return;

    if (!state.selectedWing) {
      state.selectedWing = room.wing;
    }

    if (room.wing !== state.selectedWing) {
      return;
    }

    state.mode = MODES.ROOM;
    state.selectedRoom = room.roomId;
    state.activeRoute = room.route;
    commit(action);
  }

  function returnStep() {
    if (state.mode === MODES.ROOM) {
      state.mode = MODES.EXPANDED;
      state.selectedRoom = "";
      state.activeRoute = "";
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
    if (state.mode !== MODES.ROOM || !state.activeRoute) {
      emitReceipt({ lastAction: "enter-held-no-active-route" });
      return;
    }

    state.lastAction = "enter-navigation";
    emitReceipt();
    window.location.assign(state.activeRoute);
  }

  function bindEvents() {
    state.wings.forEach((wingEl) => {
      wingEl.addEventListener("click", () => {
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
      state.selectedRoom = initialRoom;
      const room = findRoom(initialRoom);
      state.activeRoute = room ? room.route : "";
      commit("restore-room-mode");
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
      selectWing: (wing) => enterExpandedMode(wing, "api-select-wing"),
      selectRoom: (roomId) => enterRoomMode(roomId, "api-select-room"),
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

/* /assets/compass/compass.controller.js
   DGB Compass — Orbit Flower Traversal Controller with coordinate/function label state.
   Scope: compass.controller.js only.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "DGB_COMPASS_COORDINATE_FUNCTION_CONTROLLER_TNT_v2",
    file: "/assets/compass/compass.controller.js",
    visualPassClaimed: false,
    productionAuthorized: false,
    deploymentAuthorized: false,
    fifthFileAuthorized: false
  });

  const MODES = Object.freeze({
    COMPASS: "COMPASS_MODE",
    ORBIT: "ORBIT_MODE",
    DESTINATION: "DESTINATION_MODE"
  });

  const WINGS = Object.freeze(["north", "east", "south", "west"]);

  const state = {
    root: null,
    scene: null,
    panel: null,
    panelEyebrow: null,
    panelTitle: null,
    panelPurpose: null,
    panelRelationship: null,
    enterControl: null,
    returnToOrbitControl: null,
    returnControl: null,
    receiptSlot: null,
    cardinals: [],
    rooms: [],
    mirrorland: null,

    mode: MODES.COMPASS,
    orbitFocus: "",
    selectedCardinal: "",
    selectedRoom: "",
    selectedDestinationType: "",
    selectedDestinationId: "",
    selectedDestinationLabel: "",
    selectedDestinationRoute: "",
    routeSource: "",
    flowerExpanded: false,
    panelDescended: false,
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
    cardinalCount: 0,
    roomCount: 0,
    mode: MODES.COMPASS,
    orbitFocus: "",
    selectedCardinal: "",
    selectedRoom: "",
    destinationType: "",
    destinationId: "",
    destinationLabel: "",
    destinationRoute: "",
    routeSource: "",
    flowerExpanded: false,
    panelDescended: false,
    enterEnabled: false,
    coordinateFunction: "",
    localCoordinate: "",
    localFunction: "",
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

  function isValidRoute(route) {
    const value = String(route || "").trim();
    return value.length > 0 && value.charAt(0) === "/";
  }

  function setText(el, value) {
    if (el) el.textContent = value || "";
  }

  function setObjectText(el, primary, secondary) {
    if (!el) return;
    const spans = el.querySelectorAll("span");
    if (spans[0]) spans[0].textContent = primary || "";
    if (spans[1]) spans[1].textContent = secondary || "";
  }

  function reducedScrollBehavior() {
    return state.reducedMotion ? "auto" : "smooth";
  }

  function readCardinal(el) {
    const wing = normalizeWing(el.dataset.wing || el.dataset.cardinalId);
    if (!wing) return null;

    const route = String(el.dataset.cardinalRoute || el.dataset.route || "").trim();

    return {
      el,
      wing,
      destinationId: wing,
      destinationType: "cardinal",
      label: el.dataset.label || el.dataset.title || wing,
      route,
      globalCoordinate: el.dataset.globalCoordinate || wing,
      coordinateFunction: el.dataset.coordinateFunction || "",
      orbitLabel: el.dataset.orbitLabel || el.dataset.label || wing,
      flowerAnchorLabel: el.dataset.flowerAnchorLabel || "Anchor",
      panelTitle: el.dataset.panelTitle || el.dataset.title || el.dataset.label || wing,
      panelBody: el.dataset.panelBody || el.dataset.wingMeaning || "Open this coordinate field.",
      panelWhy: el.dataset.panelWhy || el.dataset.wingWhy || "Enter this coordinate.",
      validRoute: isValidRoute(route)
    };
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
      destinationType: "petal",
      label: el.dataset.label || el.textContent.trim() || roomId,
      route,
      localCoordinate: el.dataset.localCoordinate || "Petal",
      localFunction: el.dataset.localFunction || "",
      preview: el.dataset.preview || el.dataset.purpose || "Open this estate room.",
      whyEnter: el.dataset.whyEnter || el.dataset.relationship || "Enter this room.",
      validRoute: isValidRoute(route)
    };
  }

  function readMirrorland(el) {
    if (!el) return null;

    const route = String(el.dataset.route || el.getAttribute("href") || "/showroom/").trim();

    return {
      el,
      destinationType: "mirrorland",
      destinationId: "mirrorland",
      label: el.dataset.label || "Mirrorland",
      route,
      coordinateFunction: el.dataset.coordinateFunction || "Center fulcrum",
      orbitLabel: el.dataset.orbitLabel || "Center",
      panelTitle: el.dataset.panelTitle || "Mirrorland",
      panelBody: el.dataset.panelBody || "Enter the estate core and move into the central showroom.",
      panelWhy: el.dataset.panelWhy || "Use Mirrorland when you are ready to step into the center.",
      validRoute: isValidRoute(route)
    };
  }

  function acquireDom() {
    state.root = $("[data-compass-root]");
    if (!state.root) {
      hold("MISSING_DATA_COMPASS_ROOT");
      return false;
    }

    state.scene = $("[data-compass-scene]", state.root) || $(".compass-scene", state.root);
    state.panel = $("[data-compass-panel]", state.root);
    state.panelEyebrow = $("[data-compass-panel-eyebrow]", state.root);
    state.panelTitle = $("[data-compass-panel-title]", state.root);
    state.panelPurpose = $("[data-compass-panel-purpose]", state.root);
    state.panelRelationship = $("[data-compass-panel-relationship]", state.root);
    state.enterControl = $("[data-compass-enter]", state.root);
    state.returnToOrbitControl = $("[data-compass-return-to-orbit]", state.root);
    state.returnControl = $("[data-compass-return]", state.root);
    state.receiptSlot = $("[data-compass-controller-receipt]", state.root);

    state.mirrorland = readMirrorland($("[data-compass-object='mirrorland']", state.root));
    state.cardinals = $all("[data-compass-cardinal][data-wing]", state.root).map(readCardinal).filter(Boolean);
    state.rooms = $all("[data-compass-room][data-wing][data-room-id]", state.root).map(readRoom).filter(Boolean);

    if (!state.mirrorland) return hold("MISSING_MIRRORLAND_DESTINATION"), false;
    if (state.cardinals.length < 4) return hold("CARDINAL_DESTINATIONS_INCOMPLETE"), false;
    if (state.rooms.length < 1) return hold("NO_VALID_ROOM_DECLARATIONS"), false;

    state.reducedMotion =
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      state.root.dataset.reducedMotion === "true";

    state.root.dataset.reducedMotion = state.reducedMotion ? "true" : "false";
    state.root.dataset.visualPassClaimed = "false";

    return true;
  }

  function findCardinal(wing) {
    return state.cardinals.find((item) => item.wing === normalizeWing(wing)) || null;
  }

  function findRoom(roomId) {
    return state.rooms.find((room) => room.roomId === roomId) || null;
  }

  function clearDestination() {
    state.selectedRoom = "";
    state.selectedDestinationType = "";
    state.selectedDestinationId = "";
    state.selectedDestinationLabel = "";
    state.selectedDestinationRoute = "";
    state.routeSource = "";
    state.enterEnabled = false;
  }

  function setEnter(route, source) {
    const valid = isValidRoute(route);

    state.selectedDestinationRoute = valid ? route : "";
    state.routeSource = valid ? source || "html-destination-declaration" : "";
    state.enterEnabled = valid;

    if (!state.enterControl) return;

    state.enterControl.disabled = !valid;
    state.enterControl.setAttribute("aria-disabled", valid ? "false" : "true");

    if (valid) {
      state.enterControl.dataset.route = route;
      state.enterControl.dataset.routeSource = state.routeSource;
    } else {
      delete state.enterControl.dataset.route;
      delete state.enterControl.dataset.routeSource;
    }
  }

  function currentCoordinatePayload() {
    const cardinal = findCardinal(state.selectedCardinal || state.orbitFocus);
    const room = findRoom(state.selectedRoom);

    return {
      coordinateFunction: cardinal ? cardinal.coordinateFunction : "",
      localCoordinate: room ? room.localCoordinate : "",
      localFunction: room ? room.localFunction : ""
    };
  }

  function writeRootState() {
    const payload = currentCoordinatePayload();

    state.root.dataset.compassMode = state.mode;
    state.root.dataset.orbitFocus = state.orbitFocus || "";
    state.root.dataset.selectedCardinal = state.selectedCardinal || "";
    state.root.dataset.selectedWing = state.selectedCardinal || "";
    state.root.dataset.selectedRoom = state.selectedRoom || "";
    state.root.dataset.selectedDestinationType = state.selectedDestinationType || "";
    state.root.dataset.selectedDestinationId = state.selectedDestinationId || "";
    state.root.dataset.selectedDestinationLabel = state.selectedDestinationLabel || "";
    state.root.dataset.coordinateFunction = payload.coordinateFunction || "";
    state.root.dataset.localCoordinate = payload.localCoordinate || "";
    state.root.dataset.localFunction = payload.localFunction || "";
    state.root.dataset.flowerExpanded = state.flowerExpanded ? "true" : "false";
    state.root.dataset.panelDescended = state.panelDescended ? "true" : "false";
    state.root.dataset.reducedMotion = state.reducedMotion ? "true" : "false";
    state.root.dataset.visualPassClaimed = "false";
  }

  function updateSemanticLabels() {
    if (state.mirrorland && state.mirrorland.el) {
      const withdrawn = state.flowerExpanded ? "true" : "false";
      state.mirrorland.el.dataset.withdrawn = withdrawn;
      setObjectText(state.mirrorland.el, "Mirrorland", state.flowerExpanded ? "Withdrawn Center" : "Center Fulcrum");
    }

    state.cardinals.forEach((item) => {
      const active = item.wing === state.orbitFocus || item.wing === state.selectedCardinal;
      const flowerAnchor = item.wing === state.selectedCardinal && state.flowerExpanded;

      item.el.dataset.active = active ? "true" : "false";
      item.el.dataset.flowerExpanded = flowerAnchor ? "true" : "false";
      item.el.dataset.withdrawn = state.flowerExpanded && !flowerAnchor ? "true" : "false";

      if (flowerAnchor) {
        setObjectText(item.el, item.flowerAnchorLabel, "Anchor");
      } else if (state.flowerExpanded) {
        setObjectText(item.el, item.orbitLabel, "Outside Field");
      } else {
        setObjectText(item.el, item.orbitLabel, active ? "Facing Coordinate" : "Orbit Coordinate");
      }
    });

    state.rooms.forEach((room) => {
      const visible = state.flowerExpanded && room.wing === state.selectedCardinal;
      room.el.hidden = !visible;
      room.el.dataset.active = room.roomId === state.selectedRoom ? "true" : "false";
      room.el.dataset.coordinateLabel = room.localCoordinate || "";
      room.el.dataset.coordinateFunction = room.localFunction || "";
      if (visible) room.el.textContent = `${room.localCoordinate}: ${room.label}`;
    });
  }

  function updateVisibility() {
    updateSemanticLabels();

    if (state.returnControl) {
      state.returnControl.hidden = state.mode === MODES.COMPASS;
      state.returnControl.disabled = state.mode === MODES.COMPASS;
    }

    if (state.returnToOrbitControl) {
      state.returnToOrbitControl.hidden = !state.panelDescended;
      state.returnToOrbitControl.disabled = !state.panelDescended;
    }
  }

  function updatePanelDefault() {
    setText(state.panelEyebrow, "Orbit");
    setText(state.panelTitle, "Choose a coordinate");
    setText(state.panelPurpose, "Swipe to rotate the orbit. Tap an axis, petal, or label to open meaning.");
    setText(state.panelRelationship, "Enter only when the selected coordinate is the path you want.");
    setEnter("", "");
  }

  function updatePanelForCardinal(cardinal) {
    setText(state.panelEyebrow, "Coordinate axis");
    setText(state.panelTitle, cardinal.panelTitle);
    setText(state.panelPurpose, cardinal.panelBody);
    setText(state.panelRelationship, cardinal.panelWhy);
    setEnter(cardinal.validRoute ? cardinal.route : "", "html-cardinal-declaration");
  }

  function updatePanelForRoom(room) {
    setText(state.panelEyebrow, room.localCoordinate || "Room coordinate");
    setText(state.panelTitle, room.label);
    setText(state.panelPurpose, room.preview);
    setText(state.panelRelationship, room.localFunction || room.whyEnter);
    setEnter(room.validRoute ? room.route : "", "html-room-declaration");
  }

  function updatePanelForMirrorland() {
    const mirror = state.mirrorland;
    setText(state.panelEyebrow, mirror.orbitLabel || "Center destination");
    setText(state.panelTitle, mirror.panelTitle);
    setText(state.panelPurpose, mirror.panelBody);
    setText(state.panelRelationship, mirror.panelWhy);
    setEnter(mirror.validRoute ? mirror.route : "", "html-mirrorland-declaration");
  }

  function updatePanel() {
    if (!state.panel) return;

    if (!state.selectedDestinationType) return updatePanelDefault();
    if (state.selectedDestinationType === "mirrorland") return updatePanelForMirrorland();
    if (state.selectedDestinationType === "cardinal") {
      const cardinal = findCardinal(state.selectedCardinal);
      if (cardinal) updatePanelForCardinal(cardinal);
      return;
    }
    if (state.selectedDestinationType === "petal") {
      const room = findRoom(state.selectedRoom);
      if (room) updatePanelForRoom(room);
    }
  }

  function emitReceipt(extra = {}) {
    const payload = currentCoordinatePayload();

    Object.assign(RECEIPT, {
      rootStatus: state.root ? "found" : "missing",
      cardinalCount: state.cardinals.length,
      roomCount: state.rooms.length,
      mode: state.mode,
      orbitFocus: state.orbitFocus || "",
      selectedCardinal: state.selectedCardinal || "",
      selectedRoom: state.selectedRoom || "",
      destinationType: state.selectedDestinationType || "",
      destinationId: state.selectedDestinationId || "",
      destinationLabel: state.selectedDestinationLabel || "",
      destinationRoute: state.selectedDestinationRoute || "",
      routeSource: state.routeSource || "",
      flowerExpanded: state.flowerExpanded === true,
      panelDescended: state.panelDescended === true,
      enterEnabled: state.enterEnabled === true,
      coordinateFunction: payload.coordinateFunction,
      localCoordinate: payload.localCoordinate,
      localFunction: payload.localFunction,
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

  function commit(action) {
    state.lastAction = action;
    writeRootState();
    updateVisibility();
    updatePanel();
    emitReceipt();
  }

  function scrollToPanel() {
    if (!state.panel) return;
    state.panelDescended = true;
    state.panel.scrollIntoView({ behavior: reducedScrollBehavior(), block: "center" });
  }

  function scrollToOrbit() {
    if (!state.scene) return;
    state.panelDescended = false;
    state.scene.scrollIntoView({ behavior: reducedScrollBehavior(), block: "center" });
  }

  function enterCompassMode(action = "enter-compass-mode") {
    state.mode = MODES.COMPASS;
    state.orbitFocus = "";
    state.selectedCardinal = "";
    state.flowerExpanded = false;
    state.panelDescended = false;
    clearDestination();
    commit(action);
  }

  function focusOrbit(wing, action = "orbit-focus-requested", input = "direct") {
    const normalized = normalizeWing(wing);
    if (!normalized) return false;

    const changed = state.orbitFocus !== normalized;

    state.mode = MODES.ORBIT;
    state.orbitFocus = normalized;
    state.lastOrientationInput = input;

    if (changed) {
      state.flowerExpanded = false;
      state.selectedCardinal = "";
      clearDestination();
    }

    state.panelDescended = false;
    commit(action);
    return true;
  }

  function requestAxisSwipe(axis) {
    const current = state.orbitFocus;
    let next = "";

    if (axis === "vertical") {
      if (current === "north") next = "south";
      else if (current === "south") next = "north";
      else next = "north";
    }

    if (axis === "horizontal") {
      if (current === "east") next = "west";
      else if (current === "west") next = "east";
      else next = "east";
    }

    if (!next) return false;
    return focusOrbit(next, "axis-swipe-orbit-focus", "swipe-" + axis);
  }

  function requestDirectionSelection(direction) {
    return focusOrbit(direction, "direction-selection-requested", "orientation-plane-request");
  }

  function selectCardinal(wing, input = "tap-cardinal") {
    const normalized = normalizeWing(wing);
    const cardinal = findCardinal(normalized);
    if (!cardinal) return false;

    state.mode = MODES.DESTINATION;
    state.orbitFocus = normalized;
    state.selectedCardinal = normalized;
    state.selectedRoom = "";
    state.selectedDestinationType = "cardinal";
    state.selectedDestinationId = normalized;
    state.selectedDestinationLabel = cardinal.label;
    state.flowerExpanded = true;
    state.lastOrientationInput = input;

    setEnter(cardinal.validRoute ? cardinal.route : "", "html-cardinal-declaration");
    scrollToPanel();
    commit("cardinal-destination-selected");
    return true;
  }

  function selectRoom(roomId, input = "tap-petal") {
    const room = findRoom(roomId);
    if (!room) {
      clearDestination();
      commit("room-selection-rejected");
      return false;
    }

    state.mode = MODES.DESTINATION;
    state.orbitFocus = room.wing;
    state.selectedCardinal = room.wing;
    state.selectedRoom = room.roomId;
    state.selectedDestinationType = "petal";
    state.selectedDestinationId = room.roomId;
    state.selectedDestinationLabel = room.label;
    state.flowerExpanded = true;
    state.lastOrientationInput = input;

    setEnter(room.validRoute ? room.route : "", "html-room-declaration");
    scrollToPanel();
    commit("petal-destination-selected");
    return true;
  }

  function selectMirrorland(input = "tap-mirrorland") {
    const mirror = state.mirrorland;
    if (!mirror) return false;

    state.mode = MODES.DESTINATION;
    state.orbitFocus = "mirrorland";
    state.selectedCardinal = "";
    state.selectedRoom = "";
    state.selectedDestinationType = "mirrorland";
    state.selectedDestinationId = "mirrorland";
    state.selectedDestinationLabel = mirror.label;
    state.flowerExpanded = false;
    state.lastOrientationInput = input;

    setEnter(mirror.validRoute ? mirror.route : "", "html-mirrorland-declaration");
    scrollToPanel();
    commit("mirrorland-destination-selected");
    return true;
  }

  function returnToOrbit() {
    scrollToOrbit();
    state.mode = state.orbitFocus ? MODES.ORBIT : MODES.COMPASS;
    state.lastOrientationInput = "return-to-orbit";
    commit("return-to-orbit");
  }

  function navigateEnter() {
    const routeIsValid =
      state.enterEnabled === true &&
      isValidRoute(state.selectedDestinationRoute) &&
      !!state.routeSource;

    if (!routeIsValid) {
      state.lastAction = "enter-held-no-valid-destination-route";
      setEnter("", "");
      emitReceipt({
        enterEnabled: false,
        failureReason: "ENTER_HELD_NO_VALID_DESTINATION_ROUTE"
      });
      return;
    }

    state.lastAction = "enter-navigation";
    emitReceipt({
      destinationRoute: state.selectedDestinationRoute,
      routeSource: state.routeSource,
      enterEnabled: true
    });

    window.location.assign(state.selectedDestinationRoute);
  }

  function bindEvents() {
    if (state.mirrorland && state.mirrorland.el) {
      state.mirrorland.el.addEventListener("click", (event) => {
        event.preventDefault();
        selectMirrorland("tap-mirrorland-label");
      });
    }

    state.cardinals.forEach((cardinal) => {
      cardinal.el.addEventListener("click", (event) => {
        event.preventDefault();
        selectCardinal(cardinal.wing, "tap-cardinal-label");
      });
    });

    state.rooms.forEach((room) => {
      room.el.addEventListener("click", (event) => {
        event.preventDefault();
        selectRoom(room.roomId, "tap-petal-label");
      });
    });

    if (state.returnToOrbitControl) {
      state.returnToOrbitControl.addEventListener("click", (event) => {
        event.preventDefault();
        returnToOrbit();
      });
    }

    if (state.returnControl) {
      state.returnControl.addEventListener("click", (event) => {
        event.preventDefault();
        returnToOrbit();
      });
    }

    if (state.enterControl) {
      state.enterControl.addEventListener("click", (event) => {
        event.preventDefault();
        navigateEnter();
      });
    }
  }

  function exposeApi() {
    globalThis.DGB_COMPASS_CONTROLLER = Object.freeze({
      contract: CONTRACT,
      receipt: () => Object.freeze({ ...RECEIPT }),
      requestAxisSwipe,
      requestDirectionSelection,
      selectWing: requestDirectionSelection,
      selectCardinal,
      requestCardinalSelection: selectCardinal,
      selectRoom,
      requestRoomSelection: selectRoom,
      selectMirrorland,
      requestMirrorlandSelection: selectMirrorland,
      returnToOrbit,
      returnStep: returnToOrbit,
      enter: navigateEnter
    });
  }

  function init() {
    if (!acquireDom()) return;
    bindEvents();
    exposeApi();
    enterCompassMode("restore-compass-mode");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

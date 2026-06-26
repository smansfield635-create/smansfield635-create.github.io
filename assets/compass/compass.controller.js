/* /assets/compass/compass.controller.js
   DGB Compass — Constellation Cluster Path Controller.
   Scope: compass.controller.js only.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "DGB_COMPASS_CONSTELLATION_CLUSTER_PATH_CONTROLLER_TNT_v8",
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

  const GUIDANCE = Object.freeze({
    constellation:
      "Swipe to rotate the constellation. Tap a star or label to open its cluster.",
    cluster:
      "Tap a cluster star or label to inspect its path. Swipe to return to the constellation.",
    path:
      "Inspect the selected path. Enter only when this is the path you want. Return To Orbit moves back to the open cluster."
  });

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
    lastLensSet: "",
    lastLens: "",
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
    guidanceState: "pending",
    guidanceCopy: "",
    sceneOverlayGuidanceCreated: false,
    sceneReturnSuppressed: true,
    panelReturnSuppressed: false,
    panelReturnVisible: false,
    labelTapDelegationEnabled: true,
    lensSwitchingEnabled: true,
    stateMachine: "CONSTELLATION_TO_CLUSTER_TO_PATH",
    returnToOrbitBehavior: "PATH_TO_CLUSTER",
    swipeReturnBehavior: "CLUSTER_TO_CONSTELLATION",
    lastLensSet: "",
    lastLens: "",
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
      clusterAnchorLabel: el.dataset.clusterAnchorLabel || "Opened Cluster",
      panelTitle: el.dataset.panelTitle || el.dataset.title || el.dataset.label || wing,
      panelBody: el.dataset.panelBody || el.dataset.wingMeaning || "Open this star field.",
      panelWhy: el.dataset.panelWhy || el.dataset.wingWhy || "Inspect this path, then enter when ready.",
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
      localCoordinate: el.dataset.localCoordinate || "Path",
      localFunction: el.dataset.localFunction || "",
      preview: el.dataset.preview || el.dataset.purpose || "Open this estate room.",
      whyEnter: el.dataset.whyEnter || el.dataset.relationship || "Inspect this path, then enter when ready.",
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

  function currentGuidancePayload() {
    if (state.flowerExpanded && state.selectedRoom) {
      return { state: "path", copy: GUIDANCE.path };
    }

    if (state.flowerExpanded && state.selectedCardinal) {
      return { state: "cluster", copy: GUIDANCE.cluster };
    }

    return { state: "constellation", copy: GUIDANCE.constellation };
  }

  function updateGuidanceDataset() {
    const payload = currentGuidancePayload();

    state.root.dataset.compassGuidanceState = payload.state;
    state.root.dataset.compassGuidanceCopy = payload.copy;

    return payload;
  }

  function updateReturnControls() {
    if (state.returnControl) {
      state.returnControl.hidden = true;
      state.returnControl.disabled = true;
      state.returnControl.setAttribute("aria-hidden", "true");
      state.returnControl.setAttribute("tabindex", "-1");
      state.returnControl.style.display = "none";
    }

    if (!state.returnToOrbitControl) return;

    const shouldShow =
      state.flowerExpanded === true &&
      !!state.selectedCardinal;

    state.returnToOrbitControl.hidden = !shouldShow;
    state.returnToOrbitControl.disabled = !shouldShow;
    state.returnToOrbitControl.setAttribute("aria-hidden", shouldShow ? "false" : "true");
    state.returnToOrbitControl.setAttribute("tabindex", shouldShow ? "0" : "-1");
    state.returnToOrbitControl.style.display = shouldShow ? "" : "none";
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
      state.mirrorland.el.dataset.withdrawn = state.flowerExpanded ? "true" : "false";
      setObjectText(
        state.mirrorland.el,
        "Mirrorland",
        state.flowerExpanded ? "Withdrawn Center" : "Center Fulcrum"
      );
    }

    state.cardinals.forEach((item) => {
      const active = item.wing === state.orbitFocus || item.wing === state.selectedCardinal;
      const clusterAnchor = item.wing === state.selectedCardinal && state.flowerExpanded;

      item.el.dataset.active = active ? "true" : "false";
      item.el.dataset.flowerExpanded = clusterAnchor ? "true" : "false";
      item.el.dataset.withdrawn = state.flowerExpanded && !clusterAnchor ? "true" : "false";

      if (clusterAnchor) {
        setObjectText(item.el, item.clusterAnchorLabel, "Opened Cluster");
      } else if (state.flowerExpanded) {
        setObjectText(item.el, item.orbitLabel, "Outside Cluster");
      } else {
        setObjectText(item.el, item.orbitLabel, active ? "Facing Star" : "Constellation Star");
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
    updateReturnControls();
    updateGuidanceDataset();
  }

  function updatePanelDefault() {
    setText(state.panelEyebrow, "Constellation");
    setText(state.panelTitle, "Choose a star");
    setText(state.panelPurpose, GUIDANCE.constellation);
    setText(state.panelRelationship, "Enter only after a path is selected.");
    setEnter("", "");
  }

  function updatePanelForCardinal(cardinal) {
    setText(state.panelEyebrow, "Star cluster");
    setText(state.panelTitle, cardinal.panelTitle);
    setText(state.panelPurpose, cardinal.panelBody);
    setText(state.panelRelationship, GUIDANCE.cluster);
    setEnter(cardinal.validRoute ? cardinal.route : "", "html-cardinal-declaration");
  }

  function updatePanelForRoom(room) {
    setText(state.panelEyebrow, room.localCoordinate || "Path");
    setText(state.panelTitle, room.label);
    setText(state.panelPurpose, room.preview);
    setText(state.panelRelationship, GUIDANCE.path);
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

    if (state.selectedDestinationType === "mirrorland") {
      return updatePanelForMirrorland();
    }

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

  function findLensSet(target) {
    return target && target.closest
      ? target.closest("[data-compass-lens-set]")
      : null;
  }

  function activateLens(tab) {
    const lensSet = findLensSet(tab);
    if (!lensSet) return false;

    const requestedLens = String(tab.dataset.compassLensTab || "").trim();
    if (!requestedLens) return false;

    const tabs = $all("[data-compass-lens-tab]", lensSet);
    const panels = $all("[data-compass-lens-panel]", lensSet);

    tabs.forEach((item) => {
      const active = item === tab;
      item.setAttribute("aria-selected", active ? "true" : "false");
      item.tabIndex = active ? 0 : -1;
    });

    panels.forEach((panel) => {
      const active = panel.dataset.compassLensPanel === requestedLens;
      panel.hidden = !active;
    });

    state.lastLensSet = lensSet.dataset.compassLensSet || "";
    state.lastLens = requestedLens;
    state.lastAction = "formula-lens-selected";

    emitReceipt({
      lastLensSet: state.lastLensSet,
      lastLens: state.lastLens,
      lastAction: state.lastAction,
      lensSwitchingEnabled: true
    });

    return true;
  }

  function initializeLensSets() {
    $all("[data-compass-lens-set]", state.root).forEach((lensSet) => {
      const tabs = $all("[data-compass-lens-tab]", lensSet);
      const panels = $all("[data-compass-lens-panel]", lensSet);
      const selected =
        tabs.find((tab) => tab.getAttribute("aria-selected") === "true") ||
        tabs[0];

      if (!selected) return;

      const activeLens = selected.dataset.compassLensTab || "";

      tabs.forEach((tab) => {
        const active = tab === selected;
        tab.setAttribute("aria-selected", active ? "true" : "false");
        tab.tabIndex = active ? 0 : -1;
      });

      panels.forEach((panel) => {
        panel.hidden = panel.dataset.compassLensPanel !== activeLens;
      });
    });
  }

  function emitReceipt(extra = {}) {
    const payload = currentCoordinatePayload();
    const guidance = currentGuidancePayload();
    const panelReturnVisible =
      !!state.returnToOrbitControl &&
      state.returnToOrbitControl.hidden !== true &&
      state.returnToOrbitControl.disabled !== true;

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
      guidanceState: guidance.state,
      guidanceCopy: guidance.copy,
      sceneOverlayGuidanceCreated: false,
      sceneReturnSuppressed: true,
      panelReturnSuppressed: !panelReturnVisible,
      panelReturnVisible,
      labelTapDelegationEnabled: true,
      lensSwitchingEnabled: true,
      stateMachine: "CONSTELLATION_TO_CLUSTER_TO_PATH",
      returnToOrbitBehavior: "PATH_TO_CLUSTER",
      swipeReturnBehavior: "CLUSTER_TO_CONSTELLATION",
      lastLensSet: state.lastLensSet,
      lastLens: state.lastLens,
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
    updateReturnControls();
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

  function focusConstellationWing(wing, action = "constellation-focus-requested", input = "direct") {
    const normalized = normalizeWing(wing);
    if (!normalized) return false;

    state.mode = MODES.ORBIT;
    state.orbitFocus = normalized;
    state.selectedCardinal = "";
    state.flowerExpanded = false;
    state.panelDescended = false;
    state.lastOrientationInput = input;
    clearDestination();

    commit(action);
    return true;
  }

  function returnToConstellation(input = "swipe-return-to-constellation") {
    const preserved = normalizeWing(state.selectedCardinal || state.orbitFocus);

    state.mode = preserved ? MODES.ORBIT : MODES.COMPASS;
    state.orbitFocus = preserved;
    state.selectedCardinal = "";
    state.flowerExpanded = false;
    state.panelDescended = false;
    state.lastOrientationInput = input;
    clearDestination();

    commit("return-to-constellation");
    scrollToOrbit();
    return true;
  }

  function returnToCluster(input = "panel-return-to-open-cluster") {
    const preserved = normalizeWing(state.selectedCardinal || state.orbitFocus);

    if (!preserved) {
      return returnToConstellation(input);
    }

    const cardinal = findCardinal(preserved);
    if (!cardinal) {
      return returnToConstellation(input);
    }

    state.mode = MODES.DESTINATION;
    state.orbitFocus = preserved;
    state.selectedCardinal = preserved;
    state.selectedRoom = "";
    state.selectedDestinationType = "cardinal";
    state.selectedDestinationId = preserved;
    state.selectedDestinationLabel = cardinal.label;
    state.flowerExpanded = true;
    state.panelDescended = false;
    state.lastOrientationInput = input;

    setEnter(cardinal.validRoute ? cardinal.route : "", "html-cardinal-declaration");

    commit("return-to-open-cluster");
    scrollToOrbit();
    return true;
  }

  function requestAxisSwipe(axis) {
    if (state.flowerExpanded && state.selectedCardinal) {
      return returnToConstellation("swipe-return-to-constellation");
    }

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
    return focusConstellationWing(next, "axis-swipe-constellation-focus", "swipe-" + axis);
  }

  function requestDirectionSelection(direction) {
    return focusConstellationWing(direction, "direction-selection-requested", "orientation-plane-request");
  }

  function selectCardinal(wing, input = "tap-star") {
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
    state.panelDescended = true;
    state.lastOrientationInput = input;

    setEnter(cardinal.validRoute ? cardinal.route : "", "html-cardinal-declaration");
    commit("star-cluster-selected");
    scrollToPanel();
    return true;
  }

  function selectRoom(roomId, input = "tap-cluster-star") {
    const room = findRoom(roomId);
    if (!room) {
      clearDestination();
      commit("path-selection-rejected");
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
    state.panelDescended = true;
    state.lastOrientationInput = input;

    setEnter(room.validRoute ? room.route : "", "html-room-declaration");
    commit("cluster-star-path-selected");
    scrollToPanel();
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
    state.panelDescended = true;
    state.lastOrientationInput = input;

    setEnter(mirror.validRoute ? mirror.route : "", "html-mirrorland-declaration");
    commit("mirrorland-destination-selected");
    scrollToPanel();
    return true;
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

  function handleDelegatedActivation(event) {
    const target = event.target && event.target.closest
      ? event.target.closest(
          "[data-compass-lens-tab], [data-compass-object='mirrorland'], [data-compass-cardinal][data-wing], [data-compass-room][data-room-id], [data-compass-enter], [data-compass-return-to-orbit]"
        )
      : null;

    if (!target || !state.root.contains(target)) return;

    if (target.matches("[data-compass-lens-tab]")) {
      event.preventDefault();
      event.stopPropagation();
      activateLens(target);
      return;
    }

    if (target.matches("[data-compass-return-to-orbit]")) {
      event.preventDefault();
      returnToCluster("panel-return-to-open-cluster");
      return;
    }

    if (target.matches("[data-compass-enter]")) {
      event.preventDefault();
      navigateEnter();
      return;
    }

    if (target.matches("[data-compass-object='mirrorland']")) {
      event.preventDefault();
      selectMirrorland("delegated-tap-mirrorland-label");
      return;
    }

    if (target.matches("[data-compass-cardinal][data-wing]")) {
      event.preventDefault();
      selectCardinal(target.dataset.wing, "delegated-tap-star-label");
      return;
    }

    if (target.matches("[data-compass-room][data-room-id]")) {
      event.preventDefault();
      selectRoom(target.dataset.roomId, "delegated-tap-cluster-star-label");
    }
  }

  function bindEvents() {
    state.root.addEventListener("click", handleDelegatedActivation, true);

    if (state.returnToOrbitControl) {
      state.returnToOrbitControl.addEventListener("click", (event) => {
        event.preventDefault();
        returnToCluster("panel-return-to-open-cluster");
      });
    }

    if (state.returnControl) {
      state.returnControl.addEventListener("click", (event) => {
        event.preventDefault();
        returnToConstellation("scene-return-to-constellation");
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
      returnToCluster,
      returnToOrbit: returnToCluster,
      returnToConstellation,
      returnStep: returnToCluster,
      enter: navigateEnter,
      activateLens
    });
  }

  function init() {
    if (!acquireDom()) return;
    initializeLensSets();
    bindEvents();
    exposeApi();
    updateReturnControls();
    enterCompassMode("restore-compass-mode");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

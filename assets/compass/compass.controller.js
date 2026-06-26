/* /assets/compass/compass.controller.js
   DGB Compass — State, interaction, transition, and navigation authority.

   Protected behavior:
   - cardinal star → open cluster;
   - cluster star → select path;
   - Return to Orbit → selected path back to its open cluster;
   - cluster swipe → constellation;
   - constellation swipe → change facing wing;
   - Mirrorland → reveal, focus, enter, withdraw, or recover.

   Scope: compass.controller.js only.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "DGB_COMPASS_CONTROLLER_v11",
    file: "/assets/compass/compass.controller.js",
    architecture: "FIVE_FILE_SELF_CONTAINED_MIRRORLAND",
    stateAuthority: true,
    navigationAuthority: true,
    pointerClassificationAuthority: false,
    crystalsProtected: true,
    visualPassClaimed: false
  });

  const MODES = Object.freeze({
    COMPASS: "COMPASS_MODE",
    ORBIT: "ORBIT_MODE",
    DESTINATION: "DESTINATION_MODE"
  });

  const WINDOW_STATES = Object.freeze({
    DORMANT: "dormant",
    REVEALING: "revealing",
    FOCUSED: "focused",
    WITHDRAWING: "withdrawing",
    NAVIGATING: "navigating"
  });

  const WINDOW_EVENTS = Object.freeze({
    REVEAL_COMPLETE: "MIRRORLAND_WINDOW_REVEAL_COMPLETE",
    WITHDRAWAL_COMPLETE: "MIRRORLAND_WINDOW_WITHDRAWAL_COMPLETE",
    FAILURE: "MIRRORLAND_WINDOW_RENDER_FAILURE"
  });

  const WINDOW_SOURCE = "compass.mirrorland-window";
  const MIRRORLAND_ROUTE = "/showroom/";
  const REVEAL_TIMEOUT_MS = 8000;
  const WITHDRAWAL_TIMEOUT_MS = 6000;

  const WINGS = Object.freeze([
    "north",
    "east",
    "south",
    "west"
  ]);

  const COPY = Object.freeze({
    constellation:
      "Swipe to rotate the constellation. Tap a star or label to open its cluster.",

    cluster:
      "Tap a cluster star or label to inspect its path. Swipe to return to the constellation.",

    path:
      "Inspect the selected path. Enter only when this is the path you want. Back to Cluster moves back to the open cluster.",

    mirrorland: Object.freeze({
      eyebrow: "Mirrorland Threshold",
      title: "Mirrorland",
      purpose:
        "A stained-glass window into the world beyond the Compass.",
      relationship:
        "Inspect the threshold. Enter Mirrorland when ready, or return to the Compass without losing your orientation.",
      revealing:
        "The Mirrorland threshold is resolving. Enter and Back remain unavailable until the Window is stable.",
      focused:
        "Inspect the Mirrorland threshold. Enter Mirrorland or return to the Compass.",
      withdrawing:
        "The Mirrorland threshold is withdrawing and the prior Compass orientation is being restored.",
      navigating:
        "Entering Mirrorland.",
      enter: "Enter Mirrorland",
      back: "Back to Compass"
    })
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
    legacyReturnControl: null,
    mirrorlandBackControl: null,
    receiptSlot: null,

    cardinals: [],
    rooms: [],
    mirrorland: null,

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
    reducedMotion: false,

    windowState: WINDOW_STATES.DORMANT,
    windowStable: false,
    windowEnterEnabled: false,
    windowBackEnabled: false,
    windowRouteValid: false,
    preservedOrbitFocus: "",

    transitionId: 0,
    transitionTimer: 0,
    transitionExpectedState: "",
    transitionTimeoutMs: 0,
    lastCompletionKey: "",

    lastAction: "init",
    lastOrientationInput: "init",
    lastWindowAction: "init",
    lastLensSet: "",
    lastLens: "",
    failureReason: null
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

  function validRoute(value) {
    const route = String(value || "").trim();
    return route.startsWith("/") ? route : "";
  }

  function validMirrorlandRoute(value) {
    return validRoute(value) === MIRRORLAND_ROUTE;
  }

  function setText(element, value) {
    if (element) {
      element.textContent = value || "";
    }
  }

  function setControlText(control, value) {
    if (!control) return;

    const label =
      $("[data-compass-control-label]", control) ||
      $("[data-compass-enter-label]", control);

    if (label) {
      label.textContent = value || "";
    } else {
      control.textContent = value || "";
    }
  }

  function setObjectText(element, primary, secondary) {
    if (!element) return;

    const spans = element.querySelectorAll("span");

    if (spans[0]) {
      spans[0].textContent = primary || "";
    }

    if (spans[1]) {
      spans[1].textContent = secondary || "";
    }
  }

  function setControlState(control, visible, enabled) {
    if (!control) return;

    control.hidden = !visible;
    control.disabled = !enabled;
    control.style.display = visible ? "" : "none";

    control.setAttribute(
      "aria-hidden",
      visible ? "false" : "true"
    );

    control.setAttribute(
      "aria-disabled",
      enabled ? "false" : "true"
    );

    control.setAttribute(
      "tabindex",
      visible && enabled ? "0" : "-1"
    );
  }

  function readCardinal(element) {
    const wing = normalizeWing(
      element.dataset.wing ||
      element.dataset.cardinalId
    );

    if (!wing) return null;

    const route = validRoute(
      element.dataset.cardinalRoute ||
      element.dataset.route
    );

    return {
      element,
      wing,
      route,
      label:
        element.dataset.label ||
        element.dataset.title ||
        wing,
      orbitLabel:
        element.dataset.orbitLabel ||
        element.dataset.label ||
        wing,
      clusterAnchorLabel:
        element.dataset.clusterAnchorLabel ||
        "Opened Cluster",
      title:
        element.dataset.panelTitle ||
        element.dataset.title ||
        element.dataset.label ||
        wing,
      purpose:
        element.dataset.panelBody ||
        element.dataset.wingMeaning ||
        "Open this star field.",
      coordinateFunction:
        element.dataset.coordinateFunction || ""
    };
  }

  function readRoom(element) {
    const wing = normalizeWing(element.dataset.wing);
    const id = String(element.dataset.roomId || "").trim();

    if (!wing || !id) return null;

    const route = validRoute(
      element.dataset.route ||
      element.getAttribute("href")
    );

    return {
      element,
      wing,
      id,
      route,
      label:
        element.dataset.label ||
        element.textContent.trim() ||
        id,
      coordinate:
        element.dataset.localCoordinate ||
        "Path",
      localFunction:
        element.dataset.localFunction || "",
      purpose:
        element.dataset.preview ||
        element.dataset.purpose ||
        "Open this estate room."
    };
  }

  function readMirrorland(element) {
    if (!element) return null;

    const route = String(
      element.dataset.route ||
      element.getAttribute("href") ||
      MIRRORLAND_ROUTE
    ).trim();

    return {
      element,
      route,
      validRoute: validMirrorlandRoute(route),
      label:
        element.dataset.label ||
        COPY.mirrorland.title
    };
  }

  function acquireDom() {
    state.root = $("[data-compass-root]");

    if (!state.root) {
      return false;
    }

    state.scene =
      $("[data-compass-scene]", state.root) ||
      $(".compass-scene", state.root);

    state.panel =
      $("[data-compass-panel]", state.root);

    state.panelEyebrow =
      $("[data-compass-panel-eyebrow]", state.root);

    state.panelTitle =
      $("[data-compass-panel-title]", state.root);

    state.panelPurpose =
      $("[data-compass-panel-purpose]", state.root);

    state.panelRelationship =
      $("[data-compass-panel-relationship]", state.root);

    state.enterControl =
      $("[data-compass-enter]", state.root);

    state.returnToOrbitControl =
      $("[data-compass-return-to-orbit]", state.root);

    state.legacyReturnControl =
      $("[data-compass-return]", state.root);

    state.mirrorlandBackControl =
      $("[data-compass-mirrorland-back]", state.root);

    state.receiptSlot =
      $("[data-compass-controller-receipt]", state.root);

    state.mirrorland = readMirrorland(
      $("[data-compass-object='mirrorland']", state.root)
    );

    state.cardinals = $all(
      "[data-compass-cardinal][data-wing]",
      state.root
    )
      .map(readCardinal)
      .filter(Boolean);

    state.rooms = $all(
      "[data-compass-room][data-wing][data-room-id]",
      state.root
    )
      .map(readRoom)
      .filter(Boolean);

    state.reducedMotion =
      (
        typeof globalThis.matchMedia === "function" &&
        globalThis.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
      ) ||
      state.root.dataset.reducedMotion === "true";

    state.windowRouteValid =
      !!state.mirrorland &&
      state.mirrorland.validRoute;

    return (
      !!state.scene &&
      !!state.mirrorland &&
      state.cardinals.length >= 4 &&
      state.rooms.length > 0
    );
  }

  function findCardinal(wing) {
    const normalized = normalizeWing(wing);

    return (
      state.cardinals.find(
        (cardinal) => cardinal.wing === normalized
      ) ||
      null
    );
  }

  function findRoom(roomId) {
    return (
      state.rooms.find(
        (room) => room.id === String(roomId || "")
      ) ||
      null
    );
  }

  function mirrorlandBlocksCompass() {
    return state.windowState !== WINDOW_STATES.DORMANT;
  }

  function clearDestination() {
    state.selectedRoom = "";
    state.destinationType = "";
    state.destinationId = "";
    state.destinationLabel = "";
    state.destinationRoute = "";
    state.routeSource = "";
    state.enterEnabled = false;
  }

  function setDestination({
    type = "",
    id = "",
    label = "",
    route = "",
    source = "",
    enterEnabled = false
  } = {}) {
    const normalizedRoute = validRoute(route);

    state.destinationType = type;
    state.destinationId = id;
    state.destinationLabel = label;
    state.destinationRoute = normalizedRoute;
    state.routeSource = normalizedRoute ? source : "";
    state.enterEnabled =
      !!normalizedRoute &&
      enterEnabled === true;
  }

  function setEnterControl(label) {
    const control = state.enterControl;

    if (!control) return;

    setControlText(control, label);

    control.disabled = !state.enterEnabled;

    control.setAttribute(
      "aria-disabled",
      state.enterEnabled ? "false" : "true"
    );

    if (state.destinationRoute) {
      control.dataset.route = state.destinationRoute;
      control.dataset.routeSource = state.routeSource;
    } else {
      delete control.dataset.route;
      delete control.dataset.routeSource;
    }
  }

  function currentGuidance() {
    if (state.windowState === WINDOW_STATES.REVEALING) {
      return {
        key: "mirrorland-revealing",
        copy: COPY.mirrorland.revealing
      };
    }

    if (state.windowState === WINDOW_STATES.FOCUSED) {
      return {
        key: "mirrorland-focused",
        copy: COPY.mirrorland.focused
      };
    }

    if (state.windowState === WINDOW_STATES.WITHDRAWING) {
      return {
        key: "mirrorland-withdrawing",
        copy: COPY.mirrorland.withdrawing
      };
    }

    if (state.windowState === WINDOW_STATES.NAVIGATING) {
      return {
        key: "mirrorland-navigating",
        copy: COPY.mirrorland.navigating
      };
    }

    if (state.flowerExpanded && state.selectedRoom) {
      return {
        key: "path",
        copy: COPY.path
      };
    }

    if (state.flowerExpanded && state.selectedCardinal) {
      return {
        key: "cluster",
        copy: COPY.cluster
      };
    }

    return {
      key: "constellation",
      copy: COPY.constellation
    };
  }

  function coordinatePayload() {
    const cardinal = findCardinal(
      state.selectedCardinal ||
      state.orbitFocus
    );

    const room = findRoom(state.selectedRoom);

    return {
      coordinateFunction:
        cardinal
          ? cardinal.coordinateFunction
          : "",
      localCoordinate:
        room
          ? room.coordinate
          : "",
      localFunction:
        room
          ? room.localFunction
          : ""
    };
  }

  function writeRootState() {
    const root = state.root;
    const coordinate = coordinatePayload();
    const guidance = currentGuidance();

    root.dataset.compassMode = state.mode;
    root.dataset.orbitFocus = state.orbitFocus;
    root.dataset.selectedCardinal = state.selectedCardinal;
    root.dataset.selectedWing = state.selectedCardinal;
    root.dataset.selectedRoom = state.selectedRoom;

    root.dataset.selectedDestinationType =
      state.destinationType;

    root.dataset.selectedDestinationId =
      state.destinationId;

    root.dataset.selectedDestinationLabel =
      state.destinationLabel;

    root.dataset.coordinateFunction =
      coordinate.coordinateFunction;

    root.dataset.localCoordinate =
      coordinate.localCoordinate;

    root.dataset.localFunction =
      coordinate.localFunction;

    root.dataset.flowerExpanded =
      state.flowerExpanded ? "true" : "false";

    root.dataset.panelDescended =
      state.panelDescended ? "true" : "false";

    root.dataset.reducedMotion =
      state.reducedMotion ? "true" : "false";

    root.dataset.mirrorlandWindowState =
      state.windowState;

    root.dataset.mirrorlandWindowActive =
      mirrorlandBlocksCompass()
        ? "true"
        : "false";

    root.dataset.mirrorlandWindowStable =
      state.windowStable ? "true" : "false";

    root.dataset.mirrorlandEnterEnabled =
      state.windowEnterEnabled ? "true" : "false";

    root.dataset.mirrorlandBackEnabled =
      state.windowBackEnabled ? "true" : "false";

    root.dataset.preservedOrbitFocus =
      state.preservedOrbitFocus;

    root.dataset.mirrorlandTransitionId =
      String(state.transitionId);

    root.dataset.compassGuidanceState =
      guidance.key;

    root.dataset.compassGuidanceCopy =
      guidance.copy;

    root.dataset.visualPassClaimed =
      "false";
  }

  function updateSemanticObjects() {
    const mirrorlandBlocking =
      mirrorlandBlocksCompass();

    if (state.mirrorland) {
      const element = state.mirrorland.element;

      element.dataset.active =
        state.destinationType === "mirrorland"
          ? "true"
          : "false";

      element.dataset.withdrawn =
        state.flowerExpanded &&
        !mirrorlandBlocking
          ? "true"
          : "false";

      element.dataset.windowState =
        state.windowState;

      element.setAttribute(
        "aria-expanded",
        mirrorlandBlocking ? "true" : "false"
      );

      element.setAttribute(
        "aria-disabled",
        mirrorlandBlocking ? "true" : "false"
      );

      if (mirrorlandBlocking) {
        element.setAttribute("tabindex", "-1");
      } else {
        element.removeAttribute("tabindex");
      }

      setObjectText(
        element,
        COPY.mirrorland.title,
        "Threshold"
      );
    }

    state.cardinals.forEach((cardinal) => {
      const active =
        cardinal.wing === state.orbitFocus ||
        cardinal.wing === state.selectedCardinal;

      const clusterAnchor =
        state.flowerExpanded &&
        cardinal.wing === state.selectedCardinal;

      cardinal.element.dataset.active =
        active ? "true" : "false";

      cardinal.element.dataset.flowerExpanded =
        clusterAnchor ? "true" : "false";

      cardinal.element.dataset.withdrawn =
        state.flowerExpanded &&
        !clusterAnchor
          ? "true"
          : "false";

      cardinal.element.dataset.mirrorlandContext =
        mirrorlandBlocking ? "true" : "false";

      cardinal.element.disabled =
        mirrorlandBlocking;

      cardinal.element.setAttribute(
        "aria-disabled",
        mirrorlandBlocking ? "true" : "false"
      );

      cardinal.element.setAttribute(
        "tabindex",
        mirrorlandBlocking ? "-1" : "0"
      );

      if (clusterAnchor) {
        setObjectText(
          cardinal.element,
          cardinal.clusterAnchorLabel,
          "Opened Cluster"
        );
      } else if (state.flowerExpanded) {
        setObjectText(
          cardinal.element,
          cardinal.orbitLabel,
          "Outside Cluster"
        );
      } else {
        setObjectText(
          cardinal.element,
          cardinal.orbitLabel,
          active
            ? "Facing Star"
            : "Constellation Star"
        );
      }
    });

    state.rooms.forEach((room) => {
      const visible =
        !mirrorlandBlocking &&
        state.flowerExpanded &&
        room.wing === state.selectedCardinal;

      room.element.hidden = !visible;

      room.element.dataset.active =
        room.id === state.selectedRoom
          ? "true"
          : "false";

      room.element.dataset.coordinateLabel =
        room.coordinate;

      room.element.dataset.coordinateFunction =
        room.localFunction;

      room.element.setAttribute(
        "aria-disabled",
        mirrorlandBlocking ? "true" : "false"
      );

      if (mirrorlandBlocking) {
        room.element.setAttribute("tabindex", "-1");
      } else {
        room.element.removeAttribute("tabindex");
      }

      if (visible) {
        room.element.textContent =
          `${room.coordinate}: ${room.label}`;
      }
    });
  }

  function updateControls() {
    if (state.legacyReturnControl) {
      setControlState(
        state.legacyReturnControl,
        false,
        false
      );
    }

    const clusterReturnVisible =
      state.windowState === WINDOW_STATES.DORMANT &&
      state.flowerExpanded &&
      !!state.selectedCardinal;

    setControlState(
      state.returnToOrbitControl,
      clusterReturnVisible,
      clusterReturnVisible
    );

    const mirrorlandBackVisible =
      state.windowState === WINDOW_STATES.FOCUSED;

    setControlState(
      state.mirrorlandBackControl,
      mirrorlandBackVisible,
      mirrorlandBackVisible &&
      state.windowBackEnabled
    );

    setControlText(
      state.mirrorlandBackControl,
      COPY.mirrorland.back
    );
  }

  function updatePanel() {
    if (!state.panel) return;

    if (state.destinationType === "mirrorland") {
      setText(
        state.panelEyebrow,
        COPY.mirrorland.eyebrow
      );

      setText(
        state.panelTitle,
        COPY.mirrorland.title
      );

      setText(
        state.panelPurpose,
        COPY.mirrorland.purpose
      );

      setText(
        state.panelRelationship,
        COPY.mirrorland.relationship
      );

      setEnterControl(COPY.mirrorland.enter);
      return;
    }

    if (state.destinationType === "petal") {
      const room = findRoom(state.selectedRoom);

      if (room) {
        setText(
          state.panelEyebrow,
          room.coordinate
        );

        setText(
          state.panelTitle,
          room.label
        );

        setText(
          state.panelPurpose,
          room.purpose
        );

        setText(
          state.panelRelationship,
          COPY.path
        );
      }

      setEnterControl("Enter Room");
      return;
    }

    if (state.destinationType === "cardinal") {
      const cardinal = findCardinal(
        state.selectedCardinal
      );

      if (cardinal) {
        setText(
          state.panelEyebrow,
          "Star cluster"
        );

        setText(
          state.panelTitle,
          cardinal.title
        );

        setText(
          state.panelPurpose,
          cardinal.purpose
        );

        setText(
          state.panelRelationship,
          COPY.cluster
        );
      }

      setEnterControl("Enter Room");
      return;
    }

    setText(
      state.panelEyebrow,
      "Constellation"
    );

    setText(
      state.panelTitle,
      "Choose a star"
    );

    setText(
      state.panelPurpose,
      COPY.constellation
    );

    setText(
      state.panelRelationship,
      "Enter only after a path is selected."
    );

    setEnterControl("Enter Room");
  }

  function receiptPayload(extra = {}) {
    const coordinate = coordinatePayload();
    const guidance = currentGuidance();

    return Object.freeze({
      contractId: CONTRACT.id,
      rootStatus: state.root ? "found" : "missing",

      mode: state.mode,
      orbitFocus: state.orbitFocus,
      selectedCardinal: state.selectedCardinal,
      selectedRoom: state.selectedRoom,

      destinationType: state.destinationType,
      destinationId: state.destinationId,
      destinationLabel: state.destinationLabel,
      destinationRoute: state.destinationRoute,
      routeSource: state.routeSource,

      flowerExpanded: state.flowerExpanded,
      panelDescended: state.panelDescended,
      enterEnabled: state.enterEnabled,

      coordinateFunction:
        coordinate.coordinateFunction,

      localCoordinate:
        coordinate.localCoordinate,

      localFunction:
        coordinate.localFunction,

      guidanceState: guidance.key,
      guidanceCopy: guidance.copy,

      mirrorlandWindowState: state.windowState,
      mirrorlandWindowActive:
        mirrorlandBlocksCompass(),
      mirrorlandWindowStable:
        state.windowStable,
      mirrorlandEnterEnabled:
        state.windowEnterEnabled,
      mirrorlandBackEnabled:
        state.windowBackEnabled,
      mirrorlandRouteValid:
        state.windowRouteValid,
      preservedOrbitFocus:
        state.preservedOrbitFocus,
      mirrorlandTransitionId:
        state.transitionId,
      mirrorlandTransitionTimeoutArmed:
        !!state.transitionTimer,
      mirrorlandTransitionTimeoutMs:
        state.transitionTimeoutMs,
      mirrorlandTransitionTimeoutState:
        state.transitionExpectedState,

      returnToOrbitBehavior:
        "PATH_TO_OPEN_CLUSTER",
      swipeReturnBehavior:
        "OPEN_CLUSTER_TO_CONSTELLATION",

      lastAction: state.lastAction,
      lastOrientationInput:
        state.lastOrientationInput,
      lastMirrorlandWindowAction:
        state.lastWindowAction,
      lastLensSet: state.lastLensSet,
      lastLens: state.lastLens,
      failureReason: state.failureReason,

      crystalsProtected: true,
      visualPassClaimed: false,

      ...extra,

      visualPassClaimed: false
    });
  }

  function emitReceipt(extra = {}) {
    const receipt = receiptPayload(extra);
    const serialized = JSON.stringify(receipt);

    if (state.receiptSlot) {
      state.receiptSlot.value = serialized;
      state.receiptSlot.textContent = serialized;
    }

    if (state.root) {
      state.root.dataset.compassControllerReceipt =
        serialized;
    }

    globalThis.DGB_COMPASS_CONTROLLER_RECEIPT =
      receipt;
  }

  function commit(action, extra = {}) {
    state.lastAction = action;

    writeRootState();
    updateSemanticObjects();
    updateControls();
    updatePanel();
    emitReceipt(extra);
  }

  function scrollTo(element) {
    if (!element) return;

    element.scrollIntoView({
      behavior:
        state.reducedMotion
          ? "auto"
          : "smooth",
      block: "center"
    });
  }

  function scrollToPanel() {
    state.panelDescended = true;
    scrollTo(state.panel);
  }

  function scrollToOrbit() {
    state.panelDescended = false;
    scrollTo(state.scene);
  }

  function clearTransitionTimer() {
    if (state.transitionTimer) {
      globalThis.clearTimeout(
        state.transitionTimer
      );
    }

    state.transitionTimer = 0;
    state.transitionExpectedState = "";
    state.transitionTimeoutMs = 0;
  }

  function nextTransitionId() {
    state.transitionId += 1;

    if (
      !Number.isSafeInteger(state.transitionId) ||
      state.transitionId > 999999
    ) {
      state.transitionId = 1;
    }

    return state.transitionId;
  }

  function armTransition(
    expectedState,
    transitionId,
    timeoutMs,
    reason
  ) {
    clearTransitionTimer();

    state.transitionExpectedState =
      expectedState;

    state.transitionTimeoutMs =
      timeoutMs;

    state.transitionTimer =
      globalThis.setTimeout(() => {
        state.transitionTimer = 0;

        if (
          state.windowState === expectedState &&
          state.transitionId === transitionId
        ) {
          recoverFromMirrorlandFailure(reason);
        }
      }, timeoutMs);
  }

  function resetWindowState({
    preserveFailure = false
  } = {}) {
    clearTransitionTimer();

    state.windowState = WINDOW_STATES.DORMANT;
    state.windowStable = false;
    state.windowEnterEnabled = false;
    state.windowBackEnabled = false;
    state.lastCompletionKey = "";
    state.lastWindowAction = "mirrorland-reset";

    if (!preserveFailure) {
      state.failureReason = null;
    }
  }

  function focusConstellationWing(
    wing,
    input = "direct"
  ) {
    if (mirrorlandBlocksCompass()) {
      return false;
    }

    const normalized = normalizeWing(wing);

    if (!normalized) {
      return false;
    }

    state.mode = MODES.ORBIT;
    state.orbitFocus = normalized;
    state.selectedCardinal = "";
    state.selectedRoom = "";
    state.flowerExpanded = false;
    state.panelDescended = false;
    state.preservedOrbitFocus = "";
    state.lastOrientationInput = input;

    clearDestination();

    commit("constellation-focus-requested");
    return true;
  }

  function returnToConstellation(
    input = "swipe-return-to-constellation"
  ) {
    if (mirrorlandBlocksCompass()) {
      return false;
    }

    const preserved = normalizeWing(
      state.selectedCardinal ||
      state.orbitFocus
    );

    state.mode =
      preserved
        ? MODES.ORBIT
        : MODES.COMPASS;

    state.orbitFocus = preserved;
    state.selectedCardinal = "";
    state.selectedRoom = "";
    state.flowerExpanded = false;
    state.panelDescended = false;
    state.preservedOrbitFocus = "";
    state.lastOrientationInput = input;

    clearDestination();

    commit("return-to-constellation");
    scrollToOrbit();

    return true;
  }

  function returnToCluster(
    input = "panel-return-to-open-cluster"
  ) {
    if (mirrorlandBlocksCompass()) {
      return false;
    }

    const wing = normalizeWing(
      state.selectedCardinal ||
      state.orbitFocus
    );

    const cardinal = findCardinal(wing);

    if (!cardinal) {
      return returnToConstellation(input);
    }

    state.mode = MODES.DESTINATION;
    state.orbitFocus = wing;
    state.selectedCardinal = wing;
    state.selectedRoom = "";
    state.flowerExpanded = true;
    state.panelDescended = false;
    state.preservedOrbitFocus = "";
    state.lastOrientationInput = input;

    setDestination({
      type: "cardinal",
      id: wing,
      label: cardinal.label,
      route: cardinal.route,
      source: "html-cardinal-declaration",
      enterEnabled: !!cardinal.route
    });

    commit("return-to-open-cluster");
    scrollToOrbit();

    return true;
  }

  function requestAxisSwipe(axis) {
    if (mirrorlandBlocksCompass()) {
      emitReceipt({
        lastAction:
          "axis-swipe-held-during-mirrorland-window"
      });

      return false;
    }

    if (
      state.flowerExpanded &&
      state.selectedCardinal
    ) {
      return returnToConstellation(
        "swipe-return-to-constellation"
      );
    }

    const current = state.orbitFocus;
    let next = "";

    if (axis === "vertical") {
      next =
        current === "north"
          ? "south"
          : current === "south"
            ? "north"
            : "north";
    }

    if (axis === "horizontal") {
      next =
        current === "east"
          ? "west"
          : current === "west"
            ? "east"
            : "east";
    }

    return next
      ? focusConstellationWing(
          next,
          "swipe-" + axis
        )
      : false;
  }

  function selectCardinal(
    wing,
    input = "tap-star"
  ) {
    if (mirrorlandBlocksCompass()) {
      return false;
    }

    const cardinal = findCardinal(wing);

    if (!cardinal) {
      return false;
    }

    state.mode = MODES.DESTINATION;
    state.orbitFocus = cardinal.wing;
    state.selectedCardinal = cardinal.wing;
    state.selectedRoom = "";
    state.flowerExpanded = true;
    state.panelDescended = true;
    state.preservedOrbitFocus = "";
    state.lastOrientationInput = input;

    setDestination({
      type: "cardinal",
      id: cardinal.wing,
      label: cardinal.label,
      route: cardinal.route,
      source: "html-cardinal-declaration",
      enterEnabled: !!cardinal.route
    });

    commit("star-cluster-selected");
    scrollToPanel();

    return true;
  }

  function selectRoom(
    roomId,
    input = "tap-cluster-star"
  ) {
    if (mirrorlandBlocksCompass()) {
      return false;
    }

    const room = findRoom(roomId);

    if (!room) {
      return false;
    }

    state.mode = MODES.DESTINATION;
    state.orbitFocus = room.wing;
    state.selectedCardinal = room.wing;
    state.selectedRoom = room.id;
    state.flowerExpanded = true;
    state.panelDescended = true;
    state.preservedOrbitFocus = "";
    state.lastOrientationInput = input;

    setDestination({
      type: "petal",
      id: room.id,
      label: room.label,
      route: room.route,
      source: "html-room-declaration",
      enterEnabled: !!room.route
    });

    commit("cluster-star-path-selected");
    scrollToPanel();

    return true;
  }

  function requestMirrorlandFocus(
    input = "tap-mirrorland"
  ) {
    if (
      !state.mirrorland ||
      state.windowState !== WINDOW_STATES.DORMANT
    ) {
      return false;
    }

    state.preservedOrbitFocus =
      normalizeWing(
        state.selectedCardinal ||
        state.orbitFocus
      );

    state.mode = MODES.DESTINATION;
    state.orbitFocus = state.preservedOrbitFocus;
    state.selectedCardinal = "";
    state.selectedRoom = "";
    state.flowerExpanded = false;
    state.panelDescended = true;
    state.lastOrientationInput = input;

    state.windowState = WINDOW_STATES.REVEALING;
    state.windowStable = false;
    state.windowEnterEnabled = false;
    state.windowBackEnabled = false;
    state.failureReason = null;
    state.lastCompletionKey = "";
    state.lastWindowAction =
      "mirrorland-reveal-requested";

    setDestination({
      type: "mirrorland",
      id: "mirrorland",
      label: state.mirrorland.label,
      route: state.mirrorland.route,
      source: "html-mirrorland-declaration",
      enterEnabled: false
    });

    const transitionId =
      nextTransitionId();

    armTransition(
      WINDOW_STATES.REVEALING,
      transitionId,
      REVEAL_TIMEOUT_MS,
      "MIRRORLAND_WINDOW_REVEAL_TIMEOUT"
    );

    commit("mirrorland-window-reveal-requested");
    scrollToPanel();

    return true;
  }

  function requestBackToCompass(
    input = "mirrorland-back-control"
  ) {
    if (state.windowState !== WINDOW_STATES.FOCUSED) {
      return false;
    }

    state.windowState = WINDOW_STATES.WITHDRAWING;
    state.windowStable = false;
    state.windowEnterEnabled = false;
    state.windowBackEnabled = false;
    state.enterEnabled = false;
    state.lastOrientationInput = input;
    state.lastCompletionKey = "";
    state.lastWindowAction =
      "mirrorland-withdrawal-requested";

    const transitionId =
      nextTransitionId();

    armTransition(
      WINDOW_STATES.WITHDRAWING,
      transitionId,
      WITHDRAWAL_TIMEOUT_MS,
      "MIRRORLAND_WINDOW_WITHDRAWAL_TIMEOUT"
    );

    commit("mirrorland-window-withdrawal-requested");
    return true;
  }

  function eventDetail(event) {
    return (
      event &&
      event.detail &&
      typeof event.detail === "object"
        ? event.detail
        : {}
    );
  }

  function completionIsValid(
    event,
    controllerState,
    reportedState
  ) {
    if (state.windowState !== controllerState) {
      return false;
    }

    const detail = eventDetail(event);

    if (detail.source !== WINDOW_SOURCE) {
      return false;
    }

    if (detail.windowState !== reportedState) {
      return false;
    }

    if (
      String(detail.completionId) !==
      String(state.transitionId)
    ) {
      return false;
    }

    const key =
      `${event.type}:${detail.completionId}`;

    if (key === state.lastCompletionKey) {
      return false;
    }

    state.lastCompletionKey = key;
    return true;
  }

  function completeReveal(event) {
    if (
      !completionIsValid(
        event,
        WINDOW_STATES.REVEALING,
        WINDOW_STATES.FOCUSED
      )
    ) {
      return false;
    }

    clearTransitionTimer();

    state.windowState = WINDOW_STATES.FOCUSED;
    state.windowStable = true;
    state.windowEnterEnabled =
      state.windowRouteValid;
    state.windowBackEnabled = true;
    state.enterEnabled =
      state.windowRouteValid;
    state.lastWindowAction =
      "mirrorland-reveal-complete";

    commit("mirrorland-window-focused");
    return true;
  }

  function restoreCompass() {
    const restored = normalizeWing(
      state.preservedOrbitFocus
    );

    state.mode =
      restored
        ? MODES.ORBIT
        : MODES.COMPASS;

    state.orbitFocus = restored;
    state.selectedCardinal = "";
    state.selectedRoom = "";
    state.flowerExpanded = false;
    state.panelDescended = false;

    clearDestination();
    resetWindowState({
      preserveFailure: true
    });
  }

  function completeWithdrawal(event) {
    if (
      !completionIsValid(
        event,
        WINDOW_STATES.WITHDRAWING,
        WINDOW_STATES.DORMANT
      )
    ) {
      return false;
    }

    restoreCompass();

    state.lastWindowAction =
      "mirrorland-withdrawal-complete";

    commit("mirrorland-window-dormant-restored");
    scrollToOrbit();

    return true;
  }

  function recoverFromMirrorlandFailure(reason) {
    state.failureReason =
      String(
        reason ||
        "MIRRORLAND_WINDOW_RENDER_FAILURE"
      )
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9:_-]+/g, "_")
        .slice(0, 120);

    restoreCompass();

    state.lastWindowAction =
      "mirrorland-render-failure";

    commit("mirrorland-window-render-failure");
    scrollToOrbit();

    return true;
  }

  function handleMirrorlandFailure(event) {
    const detail = eventDetail(event);

    if (detail.source !== WINDOW_SOURCE) {
      return false;
    }

    return recoverFromMirrorlandFailure(
      detail.reasonCode
    );
  }

  function navigateEnter() {
    if (state.destinationType === "mirrorland") {
      const allowed =
        state.windowState === WINDOW_STATES.FOCUSED &&
        state.windowStable &&
        state.windowEnterEnabled &&
        state.enterEnabled &&
        state.windowRouteValid &&
        validMirrorlandRoute(
          state.destinationRoute
        );

      if (!allowed) {
        state.enterEnabled = false;

        emitReceipt({
          failureReason:
            "MIRRORLAND_ENTER_HELD_INVALID_WINDOW_STATE"
        });

        return false;
      }

      clearTransitionTimer();

      state.windowState = WINDOW_STATES.NAVIGATING;
      state.windowEnterEnabled = false;
      state.windowBackEnabled = false;
      state.enterEnabled = false;
      state.lastWindowAction =
        "mirrorland-navigation-authorized";

      commit("mirrorland-enter-navigation");

      globalThis.location.assign(
        state.destinationRoute
      );

      return true;
    }

    if (
      !state.enterEnabled ||
      !state.destinationRoute ||
      !state.routeSource
    ) {
      emitReceipt({
        failureReason:
          "ENTER_HELD_NO_VALID_DESTINATION_ROUTE"
      });

      return false;
    }

    state.lastAction = "enter-navigation";
    emitReceipt();

    globalThis.location.assign(
      state.destinationRoute
    );

    return true;
  }

  function activateLens(tab) {
    const lensSet =
      tab &&
      tab.closest
        ? tab.closest(
            "[data-compass-lens-set]"
          )
        : null;

    if (!lensSet) return false;

    const requested =
      String(
        tab.dataset.compassLensTab ||
        ""
      ).trim();

    if (!requested) return false;

    $all(
      "[data-compass-lens-tab]",
      lensSet
    ).forEach((candidate) => {
      const active = candidate === tab;

      candidate.setAttribute(
        "aria-selected",
        active ? "true" : "false"
      );

      candidate.tabIndex =
        active ? 0 : -1;
    });

    $all(
      "[data-compass-lens-panel]",
      lensSet
    ).forEach((panel) => {
      panel.hidden =
        panel.dataset.compassLensPanel !==
        requested;
    });

    state.lastLensSet =
      lensSet.dataset.compassLensSet || "";

    state.lastLens = requested;

    emitReceipt({
      lastAction: "formula-lens-selected"
    });

    return true;
  }

  function initializeLensSets() {
    $all(
      "[data-compass-lens-set]",
      state.root
    ).forEach((lensSet) => {
      const selected =
        $(
          "[data-compass-lens-tab][aria-selected='true']",
          lensSet
        ) ||
        $(
          "[data-compass-lens-tab]",
          lensSet
        );

      if (selected) {
        activateLens(selected);
      }
    });
  }

  function delegatedActivation(event) {
    const target =
      event.target &&
      event.target.closest
        ? event.target.closest(
            [
              "[data-compass-lens-tab]",
              "[data-compass-object='mirrorland']",
              "[data-compass-cardinal][data-wing]",
              "[data-compass-room][data-room-id]",
              "[data-compass-enter]",
              "[data-compass-return-to-orbit]",
              "[data-compass-mirrorland-back]"
            ].join(", ")
          )
        : null;

    if (
      !target ||
      !state.root.contains(target)
    ) {
      return;
    }

    if (
      target.matches(
        "[data-compass-lens-tab]"
      )
    ) {
      event.preventDefault();
      event.stopPropagation();
      activateLens(target);
      return;
    }

    if (
      target.matches(
        "[data-compass-mirrorland-back]"
      )
    ) {
      event.preventDefault();
      event.stopPropagation();
      requestBackToCompass();
      return;
    }

    if (
      target.matches(
        "[data-compass-return-to-orbit]"
      )
    ) {
      event.preventDefault();
      event.stopPropagation();
      returnToCluster();
      return;
    }

    if (
      target.matches(
        "[data-compass-enter]"
      )
    ) {
      event.preventDefault();
      event.stopPropagation();
      navigateEnter();
      return;
    }

    if (
      target.matches(
        "[data-compass-object='mirrorland']"
      )
    ) {
      event.preventDefault();
      event.stopPropagation();
      requestMirrorlandFocus(
        "semantic-mirrorland-activation"
      );
      return;
    }

    if (
      target.matches(
        "[data-compass-cardinal][data-wing]"
      )
    ) {
      event.preventDefault();
      event.stopPropagation();
      selectCardinal(
        target.dataset.wing,
        "semantic-cardinal-activation"
      );
      return;
    }

    if (
      target.matches(
        "[data-compass-room][data-room-id]"
      )
    ) {
      event.preventDefault();
      event.stopPropagation();
      selectRoom(
        target.dataset.roomId,
        "semantic-room-activation"
      );
    }
  }

  function bindEvents() {
    state.root.addEventListener(
      "click",
      delegatedActivation,
      true
    );

    state.root.addEventListener(
      WINDOW_EVENTS.REVEAL_COMPLETE,
      completeReveal
    );

    state.root.addEventListener(
      WINDOW_EVENTS.WITHDRAWAL_COMPLETE,
      completeWithdrawal
    );

    state.root.addEventListener(
      WINDOW_EVENTS.FAILURE,
      handleMirrorlandFailure
    );
  }

  function exposeApi() {
    globalThis.DGB_COMPASS_CONTROLLER =
      Object.freeze({
        contract: CONTRACT,

        receipt() {
          return receiptPayload();
        },

        requestAxisSwipe,

        requestDirectionSelection:
          focusConstellationWing,

        requestCardinalSelection:
          selectCardinal,

        requestRoomSelection:
          selectRoom,

        requestMirrorlandFocus,

        requestMirrorlandSelection:
          requestMirrorlandFocus,

        requestBackToCompass,

        returnToCluster,

        returnToOrbit:
          returnToCluster,

        returnToConstellation,

        enter:
          navigateEnter,

        activateLens
      });
  }

  function init() {
    if (!acquireDom()) {
      state.failureReason =
        "COMPASS_REQUIRED_DOM_INCOMPLETE";

      emitReceipt();
      return;
    }

    bindEvents();
    exposeApi();
    initializeLensSets();

    state.mode = MODES.COMPASS;
    state.orbitFocus = "";
    state.selectedCardinal = "";
    state.selectedRoom = "";
    state.flowerExpanded = false;
    state.panelDescended = false;
    state.preservedOrbitFocus = "";

    clearDestination();
    resetWindowState();

    commit("restore-compass-mode");
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }
})();

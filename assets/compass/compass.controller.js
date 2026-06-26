/* /assets/compass/compass.controller.js
   DGB Compass — Constellation Cluster Path Controller.
   Mirrorland Window state-authority renewal with bounded transition watchdogs.
   Scope: compass.controller.js only.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "DGB_COMPASS_CONSTELLATION_CLUSTER_PATH_CONTROLLER_TNT_v10",
    file: "/assets/compass/compass.controller.js",
    mirrorlandRendererFile:
      "/assets/compass/compass.mirrorland-window.js",
    fifthFileRequired: true,
    crystalsProtected: true,
    visualPassClaimed: false,
    productionAuthorized: false,
    deploymentAuthorized: false
  });

  const MODES = Object.freeze({
    COMPASS: "COMPASS_MODE",
    ORBIT: "ORBIT_MODE",
    DESTINATION: "DESTINATION_MODE"
  });

  const MIRRORLAND_WINDOW_STATES = Object.freeze({
    DORMANT: "dormant",
    REVEALING: "revealing",
    FOCUSED: "focused",
    WITHDRAWING: "withdrawing",
    NAVIGATING: "navigating"
  });

  const MIRRORLAND_EVENTS = Object.freeze({
    REVEAL_COMPLETE:
      "MIRRORLAND_WINDOW_REVEAL_COMPLETE",
    WITHDRAWAL_COMPLETE:
      "MIRRORLAND_WINDOW_WITHDRAWAL_COMPLETE",
    RENDER_FAILURE:
      "MIRRORLAND_WINDOW_RENDER_FAILURE"
  });

  const MIRRORLAND_TIMEOUTS = Object.freeze({
    REVEAL_MS: 8000,
    WITHDRAWAL_MS: 6000
  });

  const MIRRORLAND_RENDERER_SOURCE =
    "compass.mirrorland-window";

  const MIRRORLAND_ROUTE =
    "/showroom/";

  const MIRRORLAND_COPY = Object.freeze({
    eyebrow:
      "Mirrorland Threshold",
    title:
      "Mirrorland",
    purpose:
      "A stained-glass window into the world beyond the Compass.",
    relationship:
      "Inspect the threshold. Enter Mirrorland when ready, or return to the Compass without losing your orientation.",
    primaryAction:
      "Enter Mirrorland",
    secondaryAction:
      "Back to Compass"
  });

  const WINGS = Object.freeze([
    "north",
    "east",
    "south",
    "west"
  ]);

  const GUIDANCE = Object.freeze({
    constellation:
      "Swipe to rotate the constellation. Tap a star or label to open its cluster.",
    cluster:
      "Tap a cluster star or label to inspect its path. Swipe to return to the constellation.",
    path:
      "Inspect the selected path. Enter only when this is the path you want. Back to Cluster moves back to the open cluster.",
    mirrorlandRevealing:
      "The Mirrorland threshold is resolving. Enter and Back remain unavailable until the Window is stable.",
    mirrorlandFocused:
      "Inspect the Mirrorland threshold. Enter Mirrorland or return to the Compass.",
    mirrorlandWithdrawing:
      "The Mirrorland threshold is withdrawing and the prior Compass orientation is being restored.",
    mirrorlandNavigating:
      "Entering Mirrorland."
  });

  const ALLOWED_FAILURE_STAGES = Object.freeze([
    "initialization",
    "geometry",
    "reveal",
    "focused",
    "withdrawal",
    "context"
  ]);

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
    mirrorlandBackControl: null,
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

    mirrorlandWindowState:
      MIRRORLAND_WINDOW_STATES.DORMANT,
    mirrorlandWindowActive: false,
    mirrorlandWindowStable: false,
    mirrorlandEnterEnabled: false,
    mirrorlandBackEnabled: false,
    mirrorlandRouteValid: false,
    preservedOrbitFocus: "",
    mirrorlandTransitionId: 0,
    mirrorlandTransitionTimer: 0,
    mirrorlandTransitionTimeoutMs: 0,
    mirrorlandTransitionTimeoutState: "",
    mirrorlandTransitionTimeoutArmed: false,
    lastMirrorlandWindowAction: "init",
    lastMirrorlandWindowCompletionEvent: "",
    mirrorlandWindowFailureReason: null,

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
    stateMachine:
      "CONSTELLATION_TO_CLUSTER_TO_PATH_WITH_MIRRORLAND_WINDOW",
    returnToOrbitBehavior:
      "PATH_TO_CLUSTER",
    swipeReturnBehavior:
      "CLUSTER_TO_CONSTELLATION",
    mirrorlandBackBehavior:
      "FOCUSED_WINDOW_TO_WITHDRAWAL_TO_RESTORED_COMPASS",

    lastLensSet: "",
    lastLens: "",
    coordinateFunction: "",
    localCoordinate: "",
    localFunction: "",

    mirrorlandWindowState:
      MIRRORLAND_WINDOW_STATES.DORMANT,
    mirrorlandWindowActive: false,
    mirrorlandWindowStable: false,
    mirrorlandEnterEnabled: false,
    mirrorlandBackEnabled: false,
    preservedOrbitFocus: "",
    mirrorlandRouteValid: false,
    mirrorlandTransitionId: 0,
    mirrorlandTransitionTimeoutArmed: false,
    mirrorlandTransitionTimeoutMs: 0,
    mirrorlandTransitionTimeoutState: "",
    lastMirrorlandWindowAction: "init",
    lastMirrorlandWindowCompletionEvent: "",
    mirrorlandWindowFailureReason: null,

    fifthFileRequired: true,
    mirrorlandRendererFile:
      CONTRACT.mirrorlandRendererFile,
    crystalsProtected: true,

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
    const wing = String(value || "")
      .trim()
      .toLowerCase();

    return WINGS.includes(wing)
      ? wing
      : "";
  }

  function normalizeWindowState(value) {
    const requested = String(value || "")
      .trim()
      .toLowerCase();

    return Object.values(MIRRORLAND_WINDOW_STATES)
      .includes(requested)
      ? requested
      : MIRRORLAND_WINDOW_STATES.DORMANT;
  }

  function isValidRoute(route) {
    const value = String(route || "").trim();

    return (
      value.length > 0 &&
      value.charAt(0) === "/"
    );
  }

  function isFrozenMirrorlandRoute(route) {
    return (
      isValidRoute(route) &&
      String(route).trim() === MIRRORLAND_ROUTE
    );
  }

  function setText(el, value) {
    if (el) {
      el.textContent = value || "";
    }
  }

  function setObjectText(el, primary, secondary) {
    if (!el) return;

    const spans = el.querySelectorAll("span");

    if (spans[0]) {
      spans[0].textContent = primary || "";
    }

    if (spans[1]) {
      spans[1].textContent = secondary || "";
    }
  }

  function setControlText(control, value) {
    if (!control) return;

    const label =
      control.querySelector("[data-compass-control-label]") ||
      control.querySelector("[data-compass-enter-label]");

    if (label) {
      label.textContent = value || "";
      return;
    }

    control.textContent = value || "";
  }

  function setControlAvailability(
    control,
    visible,
    enabled
  ) {
    if (!control) return;

    control.hidden = !visible;
    control.disabled = !enabled;

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

    control.style.display =
      visible ? "" : "none";
  }

  function reducedScrollBehavior() {
    return state.reducedMotion
      ? "auto"
      : "smooth";
  }

  function mirrorlandBlocksCompassInteraction() {
    return (
      state.mirrorlandWindowState !==
      MIRRORLAND_WINDOW_STATES.DORMANT
    );
  }

  function readCardinal(el) {
    const wing = normalizeWing(
      el.dataset.wing ||
      el.dataset.cardinalId
    );

    if (!wing) return null;

    const route = String(
      el.dataset.cardinalRoute ||
      el.dataset.route ||
      ""
    ).trim();

    return {
      el,
      wing,
      destinationId: wing,
      destinationType: "cardinal",
      label:
        el.dataset.label ||
        el.dataset.title ||
        wing,
      route,
      globalCoordinate:
        el.dataset.globalCoordinate ||
        wing,
      coordinateFunction:
        el.dataset.coordinateFunction ||
        "",
      orbitLabel:
        el.dataset.orbitLabel ||
        el.dataset.label ||
        wing,
      clusterAnchorLabel:
        el.dataset.clusterAnchorLabel ||
        "Opened Cluster",
      panelTitle:
        el.dataset.panelTitle ||
        el.dataset.title ||
        el.dataset.label ||
        wing,
      panelBody:
        el.dataset.panelBody ||
        el.dataset.wingMeaning ||
        "Open this star field.",
      panelWhy:
        el.dataset.panelWhy ||
        el.dataset.wingWhy ||
        "Inspect this path, then enter when ready.",
      validRoute:
        isValidRoute(route)
    };
  }

  function readRoom(el) {
    const wing =
      normalizeWing(el.dataset.wing);

    const roomId = String(
      el.dataset.roomId || ""
    ).trim();

    const route = String(
      el.dataset.route ||
      el.getAttribute("href") ||
      ""
    ).trim();

    if (!wing || !roomId) {
      state.invalidRooms.push(el);
      return null;
    }

    return {
      el,
      wing,
      roomId,
      destinationType: "petal",
      label:
        el.dataset.label ||
        el.textContent.trim() ||
        roomId,
      route,
      localCoordinate:
        el.dataset.localCoordinate ||
        "Path",
      localFunction:
        el.dataset.localFunction ||
        "",
      preview:
        el.dataset.preview ||
        el.dataset.purpose ||
        "Open this estate room.",
      whyEnter:
        el.dataset.whyEnter ||
        el.dataset.relationship ||
        "Inspect this path, then enter when ready.",
      validRoute:
        isValidRoute(route)
    };
  }

  function readMirrorland(el) {
    if (!el) return null;

    const route = String(
      el.dataset.route ||
      el.getAttribute("href") ||
      MIRRORLAND_ROUTE
    ).trim();

    return {
      el,
      destinationType: "mirrorland",
      destinationId: "mirrorland",
      label:
        el.dataset.label ||
        MIRRORLAND_COPY.title,
      route,
      coordinateFunction:
        el.dataset.coordinateFunction ||
        "Center threshold",
      orbitLabel:
        el.dataset.orbitLabel ||
        MIRRORLAND_COPY.eyebrow,
      panelTitle:
        MIRRORLAND_COPY.title,
      panelBody:
        MIRRORLAND_COPY.purpose,
      panelWhy:
        MIRRORLAND_COPY.relationship,
      validRoute:
        isFrozenMirrorlandRoute(route)
    };
  }

  function acquireDom() {
    state.root =
      $("[data-compass-root]");

    if (!state.root) {
      hold("MISSING_DATA_COMPASS_ROOT");
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

    state.returnControl =
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

    if (!state.mirrorland) {
      hold("MISSING_MIRRORLAND_DESTINATION");
      return false;
    }

    if (state.cardinals.length < 4) {
      hold("CARDINAL_DESTINATIONS_INCOMPLETE");
      return false;
    }

    if (state.rooms.length < 1) {
      hold("NO_VALID_ROOM_DECLARATIONS");
      return false;
    }

    state.mirrorlandRouteValid =
      state.mirrorland.validRoute === true;

    state.reducedMotion =
      globalThis.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches ||
      state.root.dataset.reducedMotion === "true";

    state.root.dataset.reducedMotion =
      state.reducedMotion ? "true" : "false";

    state.root.dataset.visualPassClaimed =
      "false";

    return true;
  }

  function findCardinal(wing) {
    return (
      state.cardinals.find(
        (item) =>
          item.wing === normalizeWing(wing)
      ) ||
      null
    );
  }

  function findRoom(roomId) {
    return (
      state.rooms.find(
        (room) =>
          room.roomId === roomId
      ) ||
      null
    );
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

  function setEnter(
    route,
    source,
    enabled = true,
    label = "Enter Room"
  ) {
    const valid =
      isValidRoute(route);

    const available =
      valid && enabled === true;

    state.selectedDestinationRoute =
      valid
        ? String(route).trim()
        : "";

    state.routeSource =
      valid
        ? source ||
          "html-destination-declaration"
        : "";

    state.enterEnabled =
      available;

    if (!state.enterControl) return;

    setControlText(
      state.enterControl,
      label
    );

    state.enterControl.disabled =
      !available;

    state.enterControl.setAttribute(
      "aria-disabled",
      available ? "false" : "true"
    );

    if (valid) {
      state.enterControl.dataset.route =
        state.selectedDestinationRoute;

      state.enterControl.dataset.routeSource =
        state.routeSource;
    } else {
      delete state.enterControl.dataset.route;
      delete state.enterControl.dataset.routeSource;
    }
  }

  function currentCoordinatePayload() {
    const cardinal = findCardinal(
      state.selectedCardinal ||
      state.orbitFocus
    );

    const room =
      findRoom(state.selectedRoom);

    return {
      coordinateFunction:
        cardinal
          ? cardinal.coordinateFunction
          : "",
      localCoordinate:
        room
          ? room.localCoordinate
          : "",
      localFunction:
        room
          ? room.localFunction
          : ""
    };
  }

  function currentGuidancePayload() {
    if (
      state.mirrorlandWindowState ===
      MIRRORLAND_WINDOW_STATES.REVEALING
    ) {
      return {
        state: "mirrorland-revealing",
        copy: GUIDANCE.mirrorlandRevealing
      };
    }

    if (
      state.mirrorlandWindowState ===
      MIRRORLAND_WINDOW_STATES.FOCUSED
    ) {
      return {
        state: "mirrorland-focused",
        copy: GUIDANCE.mirrorlandFocused
      };
    }

    if (
      state.mirrorlandWindowState ===
      MIRRORLAND_WINDOW_STATES.WITHDRAWING
    ) {
      return {
        state: "mirrorland-withdrawing",
        copy: GUIDANCE.mirrorlandWithdrawing
      };
    }

    if (
      state.mirrorlandWindowState ===
      MIRRORLAND_WINDOW_STATES.NAVIGATING
    ) {
      return {
        state: "mirrorland-navigating",
        copy: GUIDANCE.mirrorlandNavigating
      };
    }

    if (
      state.flowerExpanded &&
      state.selectedRoom
    ) {
      return {
        state: "path",
        copy: GUIDANCE.path
      };
    }

    if (
      state.flowerExpanded &&
      state.selectedCardinal
    ) {
      return {
        state: "cluster",
        copy: GUIDANCE.cluster
      };
    }

    return {
      state: "constellation",
      copy: GUIDANCE.constellation
    };
  }

  function updateGuidanceDataset() {
    const payload =
      currentGuidancePayload();

    state.root.dataset.compassGuidanceState =
      payload.state;

    state.root.dataset.compassGuidanceCopy =
      payload.copy;

    return payload;
  }

  function updateReturnControls() {
    if (state.returnControl) {
      state.returnControl.hidden = true;
      state.returnControl.disabled = true;

      state.returnControl.setAttribute(
        "aria-hidden",
        "true"
      );

      state.returnControl.setAttribute(
        "tabindex",
        "-1"
      );

      state.returnControl.style.display =
        "none";
    }

    const clusterReturnVisible =
      state.mirrorlandWindowState ===
        MIRRORLAND_WINDOW_STATES.DORMANT &&
      state.flowerExpanded === true &&
      !!state.selectedCardinal;

    setControlAvailability(
      state.returnToOrbitControl,
      clusterReturnVisible,
      clusterReturnVisible
    );

    const mirrorlandBackVisible =
      state.mirrorlandWindowState ===
      MIRRORLAND_WINDOW_STATES.FOCUSED;

    const mirrorlandBackEnabled =
      mirrorlandBackVisible &&
      state.mirrorlandBackEnabled === true;

    setControlAvailability(
      state.mirrorlandBackControl,
      mirrorlandBackVisible,
      mirrorlandBackEnabled
    );

    setControlText(
      state.mirrorlandBackControl,
      MIRRORLAND_COPY.secondaryAction
    );
  }

  function writeRootState() {
    if (!state.root) return;

    const payload =
      currentCoordinatePayload();

    state.root.dataset.compassMode =
      state.mode;

    state.root.dataset.orbitFocus =
      state.orbitFocus || "";

    state.root.dataset.selectedCardinal =
      state.selectedCardinal || "";

    state.root.dataset.selectedWing =
      state.selectedCardinal || "";

    state.root.dataset.selectedRoom =
      state.selectedRoom || "";

    state.root.dataset.selectedDestinationType =
      state.selectedDestinationType || "";

    state.root.dataset.selectedDestinationId =
      state.selectedDestinationId || "";

    state.root.dataset.selectedDestinationLabel =
      state.selectedDestinationLabel || "";

    state.root.dataset.coordinateFunction =
      payload.coordinateFunction || "";

    state.root.dataset.localCoordinate =
      payload.localCoordinate || "";

    state.root.dataset.localFunction =
      payload.localFunction || "";

    state.root.dataset.flowerExpanded =
      state.flowerExpanded ? "true" : "false";

    state.root.dataset.panelDescended =
      state.panelDescended ? "true" : "false";

    state.root.dataset.reducedMotion =
      state.reducedMotion ? "true" : "false";

    state.root.dataset.mirrorlandWindowState =
      normalizeWindowState(
        state.mirrorlandWindowState
      );

    state.root.dataset.mirrorlandWindowActive =
      state.mirrorlandWindowActive
        ? "true"
        : "false";

    state.root.dataset.mirrorlandWindowStable =
      state.mirrorlandWindowStable
        ? "true"
        : "false";

    state.root.dataset.mirrorlandEnterEnabled =
      state.mirrorlandEnterEnabled
        ? "true"
        : "false";

    state.root.dataset.mirrorlandBackEnabled =
      state.mirrorlandBackEnabled
        ? "true"
        : "false";

    state.root.dataset.preservedOrbitFocus =
      state.preservedOrbitFocus || "";

    state.root.dataset.mirrorlandTransitionId =
      String(state.mirrorlandTransitionId);

    state.root.dataset.visualPassClaimed =
      "false";
  }

  function updateSemanticLabels() {
    const mirrorlandBlocking =
      mirrorlandBlocksCompassInteraction();

    if (
      state.mirrorland &&
      state.mirrorland.el
    ) {
      const mirrorlandEl =
        state.mirrorland.el;

      mirrorlandEl.dataset.withdrawn =
        state.flowerExpanded &&
        !mirrorlandBlocking
          ? "true"
          : "false";

      mirrorlandEl.dataset.active =
        state.selectedDestinationType ===
        "mirrorland"
          ? "true"
          : "false";

      mirrorlandEl.dataset.windowState =
        state.mirrorlandWindowState;

      mirrorlandEl.setAttribute(
        "aria-expanded",
        mirrorlandBlocking
          ? "true"
          : "false"
      );

      mirrorlandEl.setAttribute(
        "aria-disabled",
        mirrorlandBlocking
          ? "true"
          : "false"
      );

      if (mirrorlandBlocking) {
        mirrorlandEl.setAttribute(
          "tabindex",
          "-1"
        );
      } else {
        mirrorlandEl.removeAttribute(
          "tabindex"
        );
      }

      setObjectText(
        mirrorlandEl,
        MIRRORLAND_COPY.title,
        "Threshold"
      );
    }

    state.cardinals.forEach((item) => {
      const active =
        item.wing === state.orbitFocus ||
        item.wing === state.selectedCardinal;

      const clusterAnchor =
        item.wing === state.selectedCardinal &&
        state.flowerExpanded;

      item.el.dataset.active =
        active ? "true" : "false";

      item.el.dataset.flowerExpanded =
        clusterAnchor ? "true" : "false";

      item.el.dataset.withdrawn =
        state.flowerExpanded &&
        !clusterAnchor
          ? "true"
          : "false";

      item.el.dataset.mirrorlandContext =
        mirrorlandBlocking
          ? "true"
          : "false";

      item.el.disabled =
        mirrorlandBlocking;

      item.el.setAttribute(
        "aria-disabled",
        mirrorlandBlocking
          ? "true"
          : "false"
      );

      item.el.setAttribute(
        "tabindex",
        mirrorlandBlocking
          ? "-1"
          : "0"
      );

      if (clusterAnchor) {
        setObjectText(
          item.el,
          item.clusterAnchorLabel,
          "Opened Cluster"
        );
      } else if (state.flowerExpanded) {
        setObjectText(
          item.el,
          item.orbitLabel,
          "Outside Cluster"
        );
      } else {
        setObjectText(
          item.el,
          item.orbitLabel,
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

      room.el.hidden =
        !visible;

      room.el.dataset.active =
        room.roomId === state.selectedRoom
          ? "true"
          : "false";

      room.el.dataset.coordinateLabel =
        room.localCoordinate || "";

      room.el.dataset.coordinateFunction =
        room.localFunction || "";

      room.el.setAttribute(
        "aria-disabled",
        mirrorlandBlocking
          ? "true"
          : "false"
      );

      if (mirrorlandBlocking) {
        room.el.setAttribute(
          "tabindex",
          "-1"
        );
      } else {
        room.el.removeAttribute(
          "tabindex"
        );
      }

      if (visible) {
        room.el.textContent =
          `${room.localCoordinate}: ${room.label}`;
      }
    });
  }

  function updateVisibility() {
    updateSemanticLabels();
    updateReturnControls();
    updateGuidanceDataset();
  }

  function updatePanelDefault() {
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
      GUIDANCE.constellation
    );

    setText(
      state.panelRelationship,
      "Enter only after a path is selected."
    );

    setEnter(
      "",
      "",
      false,
      "Enter Room"
    );
  }

  function updatePanelForCardinal(cardinal) {
    setText(
      state.panelEyebrow,
      "Star cluster"
    );

    setText(
      state.panelTitle,
      cardinal.panelTitle
    );

    setText(
      state.panelPurpose,
      cardinal.panelBody
    );

    setText(
      state.panelRelationship,
      GUIDANCE.cluster
    );

    setEnter(
      cardinal.validRoute
        ? cardinal.route
        : "",
      "html-cardinal-declaration",
      cardinal.validRoute,
      "Enter Room"
    );
  }

  function updatePanelForRoom(room) {
    setText(
      state.panelEyebrow,
      room.localCoordinate ||
      "Path"
    );

    setText(
      state.panelTitle,
      room.label
    );

    setText(
      state.panelPurpose,
      room.preview
    );

    setText(
      state.panelRelationship,
      GUIDANCE.path
    );

    setEnter(
      room.validRoute
        ? room.route
        : "",
      "html-room-declaration",
      room.validRoute,
      "Enter Room"
    );
  }

  function updatePanelForMirrorland() {
    const mirror =
      state.mirrorland;

    setText(
      state.panelEyebrow,
      MIRRORLAND_COPY.eyebrow
    );

    setText(
      state.panelTitle,
      MIRRORLAND_COPY.title
    );

    setText(
      state.panelPurpose,
      MIRRORLAND_COPY.purpose
    );

    setText(
      state.panelRelationship,
      MIRRORLAND_COPY.relationship
    );

    const mayEnter =
      state.mirrorlandWindowState ===
        MIRRORLAND_WINDOW_STATES.FOCUSED &&
      state.mirrorlandWindowStable === true &&
      state.mirrorlandEnterEnabled === true &&
      state.mirrorlandRouteValid === true;

    setEnter(
      mirror &&
      mirror.validRoute
        ? mirror.route
        : "",
      "html-mirrorland-declaration",
      mayEnter,
      MIRRORLAND_COPY.primaryAction
    );
  }

  function updatePanel() {
    if (!state.panel) return;

    if (!state.selectedDestinationType) {
      updatePanelDefault();
      return;
    }

    if (
      state.selectedDestinationType ===
      "mirrorland"
    ) {
      updatePanelForMirrorland();
      return;
    }

    if (
      state.selectedDestinationType ===
      "cardinal"
    ) {
      const cardinal =
        findCardinal(
          state.selectedCardinal
        );

      if (cardinal) {
        updatePanelForCardinal(cardinal);
      }

      return;
    }

    if (
      state.selectedDestinationType ===
      "petal"
    ) {
      const room =
        findRoom(
          state.selectedRoom
        );

      if (room) {
        updatePanelForRoom(room);
      }
    }
  }

  function findLensSet(target) {
    return target && target.closest
      ? target.closest(
          "[data-compass-lens-set]"
        )
      : null;
  }

  function activateLens(tab) {
    const lensSet =
      findLensSet(tab);

    if (!lensSet) return false;

    const requestedLens = String(
      tab.dataset.compassLensTab || ""
    ).trim();

    if (!requestedLens) return false;

    const tabs = $all(
      "[data-compass-lens-tab]",
      lensSet
    );

    const panels = $all(
      "[data-compass-lens-panel]",
      lensSet
    );

    tabs.forEach((item) => {
      const active =
        item === tab;

      item.setAttribute(
        "aria-selected",
        active ? "true" : "false"
      );

      item.tabIndex =
        active ? 0 : -1;
    });

    panels.forEach((panel) => {
      const active =
        panel.dataset.compassLensPanel ===
        requestedLens;

      panel.hidden =
        !active;
    });

    state.lastLensSet =
      lensSet.dataset.compassLensSet || "";

    state.lastLens =
      requestedLens;

    state.lastAction =
      "formula-lens-selected";

    emitReceipt({
      lastLensSet:
        state.lastLensSet,
      lastLens:
        state.lastLens,
      lastAction:
        state.lastAction,
      lensSwitchingEnabled:
        true
    });

    return true;
  }

  function initializeLensSets() {
    $all(
      "[data-compass-lens-set]",
      state.root
    ).forEach((lensSet) => {
      const tabs = $all(
        "[data-compass-lens-tab]",
        lensSet
      );

      const panels = $all(
        "[data-compass-lens-panel]",
        lensSet
      );

      const selected =
        tabs.find(
          (tab) =>
            tab.getAttribute(
              "aria-selected"
            ) === "true"
        ) ||
        tabs[0];

      if (!selected) return;

      const activeLens =
        selected.dataset.compassLensTab ||
        "";

      tabs.forEach((tab) => {
        const active =
          tab === selected;

        tab.setAttribute(
          "aria-selected",
          active ? "true" : "false"
        );

        tab.tabIndex =
          active ? 0 : -1;
      });

      panels.forEach((panel) => {
        panel.hidden =
          panel.dataset.compassLensPanel !==
          activeLens;
      });
    });
  }

  function emitReceipt(extra = {}) {
    const payload =
      currentCoordinatePayload();

    const guidance =
      currentGuidancePayload();

    const panelReturnVisible =
      !!state.returnToOrbitControl &&
      state.returnToOrbitControl.hidden !== true &&
      state.returnToOrbitControl.disabled !== true;

    Object.assign(
      RECEIPT,
      {
        rootStatus:
          state.root
            ? "found"
            : "missing",

        cardinalCount:
          state.cardinals.length,

        roomCount:
          state.rooms.length,

        mode:
          state.mode,

        orbitFocus:
          state.orbitFocus || "",

        selectedCardinal:
          state.selectedCardinal || "",

        selectedRoom:
          state.selectedRoom || "",

        destinationType:
          state.selectedDestinationType || "",

        destinationId:
          state.selectedDestinationId || "",

        destinationLabel:
          state.selectedDestinationLabel || "",

        destinationRoute:
          state.selectedDestinationRoute || "",

        routeSource:
          state.routeSource || "",

        flowerExpanded:
          state.flowerExpanded === true,

        panelDescended:
          state.panelDescended === true,

        enterEnabled:
          state.enterEnabled === true,

        guidanceState:
          guidance.state,

        guidanceCopy:
          guidance.copy,

        sceneOverlayGuidanceCreated:
          false,

        sceneReturnSuppressed:
          true,

        panelReturnSuppressed:
          !panelReturnVisible,

        panelReturnVisible,

        labelTapDelegationEnabled:
          true,

        lensSwitchingEnabled:
          true,

        stateMachine:
          "CONSTELLATION_TO_CLUSTER_TO_PATH_WITH_MIRRORLAND_WINDOW",

        returnToOrbitBehavior:
          "PATH_TO_CLUSTER",

        swipeReturnBehavior:
          "CLUSTER_TO_CONSTELLATION",

        mirrorlandBackBehavior:
          "FOCUSED_WINDOW_TO_WITHDRAWAL_TO_RESTORED_COMPASS",

        lastLensSet:
          state.lastLensSet,

        lastLens:
          state.lastLens,

        coordinateFunction:
          payload.coordinateFunction,

        localCoordinate:
          payload.localCoordinate,

        localFunction:
          payload.localFunction,

        mirrorlandWindowState:
          state.mirrorlandWindowState,

        mirrorlandWindowActive:
          state.mirrorlandWindowActive === true,

        mirrorlandWindowStable:
          state.mirrorlandWindowStable === true,

        mirrorlandEnterEnabled:
          state.mirrorlandEnterEnabled === true,

        mirrorlandBackEnabled:
          state.mirrorlandBackEnabled === true,

        preservedOrbitFocus:
          state.preservedOrbitFocus || "",

        mirrorlandRouteValid:
          state.mirrorlandRouteValid === true,

        mirrorlandTransitionId:
          state.mirrorlandTransitionId,

        mirrorlandTransitionTimeoutArmed:
          state.mirrorlandTransitionTimeoutArmed === true,

        mirrorlandTransitionTimeoutMs:
          state.mirrorlandTransitionTimeoutMs,

        mirrorlandTransitionTimeoutState:
          state.mirrorlandTransitionTimeoutState,

        lastMirrorlandWindowAction:
          state.lastMirrorlandWindowAction,

        lastMirrorlandWindowCompletionEvent:
          state.lastMirrorlandWindowCompletionEvent,

        mirrorlandWindowFailureReason:
          state.mirrorlandWindowFailureReason,

        fifthFileRequired:
          true,

        mirrorlandRendererFile:
          CONTRACT.mirrorlandRendererFile,

        crystalsProtected:
          true,

        lastAction:
          state.lastAction,

        lastOrientationInput:
          state.lastOrientationInput,

        failureReason:
          state.failureReason,

        visualPassClaimed:
          false
      },
      extra,
      {
        visualPassClaimed: false
      }
    );

    const serialized =
      JSON.stringify(RECEIPT);

    if (state.receiptSlot) {
      state.receiptSlot.value =
        serialized;

      state.receiptSlot.textContent =
        serialized;

      state.receiptSlot.dataset.visualPassClaimed =
        "false";
    }

    if (state.root) {
      state.root.dataset.compassControllerReceipt =
        serialized;

      state.root.dataset.visualPassClaimed =
        "false";
    }

    globalThis.DGB_COMPASS_CONTROLLER_RECEIPT =
      Object.freeze({
        ...RECEIPT
      });
  }

  function hold(reason) {
    state.held = true;
    state.failureReason = reason;
    state.lastAction = "hold";

    emitReceipt({
      failureReason: reason
    });
  }

  function commit(action) {
    state.lastAction =
      action;

    writeRootState();
    updateVisibility();
    updatePanel();
    updateReturnControls();
    emitReceipt();
  }

  function scrollToPanel() {
    if (!state.panel) return;

    state.panelDescended =
      true;

    state.panel.scrollIntoView({
      behavior:
        reducedScrollBehavior(),
      block:
        "center"
    });
  }

  function scrollToOrbit() {
    if (!state.scene) return;

    state.panelDescended =
      false;

    state.scene.scrollIntoView({
      behavior:
        reducedScrollBehavior(),
      block:
        "center"
    });
  }

  function clearMirrorlandTransitionTimeout() {
    if (state.mirrorlandTransitionTimer) {
      globalThis.clearTimeout(
        state.mirrorlandTransitionTimer
      );
    }

    state.mirrorlandTransitionTimer = 0;
    state.mirrorlandTransitionTimeoutMs = 0;
    state.mirrorlandTransitionTimeoutState = "";
    state.mirrorlandTransitionTimeoutArmed = false;
  }

  function armMirrorlandTransitionTimeout(
    expectedState,
    transitionId,
    timeoutMs,
    reasonCode,
    stage
  ) {
    clearMirrorlandTransitionTimeout();

    state.mirrorlandTransitionTimeoutMs =
      timeoutMs;

    state.mirrorlandTransitionTimeoutState =
      expectedState;

    state.mirrorlandTransitionTimeoutArmed =
      true;

    state.mirrorlandTransitionTimer =
      globalThis.setTimeout(() => {
        state.mirrorlandTransitionTimer = 0;
        state.mirrorlandTransitionTimeoutArmed = false;

        const stillExpected =
          state.mirrorlandWindowState ===
            expectedState &&
          state.mirrorlandTransitionId ===
            transitionId;

        if (!stillExpected) return;

        applyMirrorlandFailure(
          reasonCode,
          stage,
          null
        );
      }, timeoutMs);
  }

  function resetMirrorlandWindowState(
    options = {}
  ) {
    clearMirrorlandTransitionTimeout();

    const preserveFailure =
      options.preserveFailure === true;

    state.mirrorlandWindowState =
      MIRRORLAND_WINDOW_STATES.DORMANT;

    state.mirrorlandWindowActive =
      false;

    state.mirrorlandWindowStable =
      false;

    state.mirrorlandEnterEnabled =
      false;

    state.mirrorlandBackEnabled =
      false;

    state.lastMirrorlandWindowCompletionEvent =
      "";

    if (!preserveFailure) {
      state.mirrorlandWindowFailureReason =
        null;
    }
  }

  function enterCompassMode(
    action = "enter-compass-mode"
  ) {
    if (mirrorlandBlocksCompassInteraction()) {
      return false;
    }

    state.mode =
      MODES.COMPASS;

    state.orbitFocus = "";
    state.selectedCardinal = "";
    state.flowerExpanded = false;
    state.panelDescended = false;
    state.preservedOrbitFocus = "";

    clearDestination();
    resetMirrorlandWindowState();

    commit(action);
    return true;
  }

  function focusConstellationWing(
    wing,
    action = "constellation-focus-requested",
    input = "direct"
  ) {
    if (mirrorlandBlocksCompassInteraction()) {
      return false;
    }

    const normalized =
      normalizeWing(wing);

    if (!normalized) return false;

    state.mode =
      MODES.ORBIT;

    state.orbitFocus =
      normalized;

    state.selectedCardinal = "";
    state.flowerExpanded = false;
    state.panelDescended = false;
    state.lastOrientationInput = input;
    state.preservedOrbitFocus = "";

    clearDestination();
    commit(action);

    return true;
  }

  function returnToConstellation(
    input = "swipe-return-to-constellation"
  ) {
    if (mirrorlandBlocksCompassInteraction()) {
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

    state.orbitFocus =
      preserved;

    state.selectedCardinal = "";
    state.flowerExpanded = false;
    state.panelDescended = false;
    state.lastOrientationInput = input;
    state.preservedOrbitFocus = "";

    clearDestination();

    commit(
      "return-to-constellation"
    );

    scrollToOrbit();
    return true;
  }

  function returnToCluster(
    input = "panel-return-to-open-cluster"
  ) {
    if (mirrorlandBlocksCompassInteraction()) {
      return false;
    }

    const preserved = normalizeWing(
      state.selectedCardinal ||
      state.orbitFocus
    );

    if (!preserved) {
      return returnToConstellation(input);
    }

    const cardinal =
      findCardinal(preserved);

    if (!cardinal) {
      return returnToConstellation(input);
    }

    state.mode =
      MODES.DESTINATION;

    state.orbitFocus =
      preserved;

    state.selectedCardinal =
      preserved;

    state.selectedRoom = "";

    state.selectedDestinationType =
      "cardinal";

    state.selectedDestinationId =
      preserved;

    state.selectedDestinationLabel =
      cardinal.label;

    state.flowerExpanded =
      true;

    state.panelDescended =
      false;

    state.lastOrientationInput =
      input;

    state.preservedOrbitFocus = "";

    setEnter(
      cardinal.validRoute
        ? cardinal.route
        : "",
      "html-cardinal-declaration",
      cardinal.validRoute,
      "Enter Room"
    );

    commit(
      "return-to-open-cluster"
    );

    scrollToOrbit();
    return true;
  }

  function requestAxisSwipe(axis) {
    if (mirrorlandBlocksCompassInteraction()) {
      state.lastAction =
        "axis-swipe-held-during-mirrorland-window";

      emitReceipt();
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

    const current =
      state.orbitFocus;

    let next = "";

    if (axis === "vertical") {
      if (current === "north") {
        next = "south";
      } else if (current === "south") {
        next = "north";
      } else {
        next = "north";
      }
    }

    if (axis === "horizontal") {
      if (current === "east") {
        next = "west";
      } else if (current === "west") {
        next = "east";
      } else {
        next = "east";
      }
    }

    if (!next) return false;

    return focusConstellationWing(
      next,
      "axis-swipe-constellation-focus",
      "swipe-" + axis
    );
  }

  function requestDirectionSelection(direction) {
    if (mirrorlandBlocksCompassInteraction()) {
      return false;
    }

    return focusConstellationWing(
      direction,
      "direction-selection-requested",
      "orientation-plane-request"
    );
  }

  function selectCardinal(
    wing,
    input = "tap-star"
  ) {
    if (mirrorlandBlocksCompassInteraction()) {
      return false;
    }

    const normalized =
      normalizeWing(wing);

    const cardinal =
      findCardinal(normalized);

    if (!cardinal) return false;

    state.mode =
      MODES.DESTINATION;

    state.orbitFocus =
      normalized;

    state.selectedCardinal =
      normalized;

    state.selectedRoom = "";

    state.selectedDestinationType =
      "cardinal";

    state.selectedDestinationId =
      normalized;

    state.selectedDestinationLabel =
      cardinal.label;

    state.flowerExpanded =
      true;

    state.panelDescended =
      true;

    state.lastOrientationInput =
      input;

    state.preservedOrbitFocus = "";

    setEnter(
      cardinal.validRoute
        ? cardinal.route
        : "",
      "html-cardinal-declaration",
      cardinal.validRoute,
      "Enter Room"
    );

    commit(
      "star-cluster-selected"
    );

    scrollToPanel();
    return true;
  }

  function selectRoom(
    roomId,
    input = "tap-cluster-star"
  ) {
    if (mirrorlandBlocksCompassInteraction()) {
      return false;
    }

    const room =
      findRoom(roomId);

    if (!room) {
      clearDestination();

      commit(
        "path-selection-rejected"
      );

      return false;
    }

    state.mode =
      MODES.DESTINATION;

    state.orbitFocus =
      room.wing;

    state.selectedCardinal =
      room.wing;

    state.selectedRoom =
      room.roomId;

    state.selectedDestinationType =
      "petal";

    state.selectedDestinationId =
      room.roomId;

    state.selectedDestinationLabel =
      room.label;

    state.flowerExpanded =
      true;

    state.panelDescended =
      true;

    state.lastOrientationInput =
      input;

    state.preservedOrbitFocus = "";

    setEnter(
      room.validRoute
        ? room.route
        : "",
      "html-room-declaration",
      room.validRoute,
      "Enter Room"
    );

    commit(
      "cluster-star-path-selected"
    );

    scrollToPanel();
    return true;
  }

  function nextMirrorlandTransitionId() {
    state.mirrorlandTransitionId += 1;

    if (
      !Number.isSafeInteger(
        state.mirrorlandTransitionId
      ) ||
      state.mirrorlandTransitionId > 999999
    ) {
      state.mirrorlandTransitionId = 1;
    }

    return state.mirrorlandTransitionId;
  }

  function requestMirrorlandFocus(
    input = "tap-mirrorland"
  ) {
    const mirror =
      state.mirrorland;

    if (!mirror) return false;

    if (
      state.mirrorlandWindowState !==
      MIRRORLAND_WINDOW_STATES.DORMANT
    ) {
      state.lastMirrorlandWindowAction =
        "focus-request-rejected-invalid-state";

      emitReceipt();
      return false;
    }

    const preserved = normalizeWing(
      state.selectedCardinal ||
      state.orbitFocus
    );

    state.preservedOrbitFocus =
      preserved;

    state.mode =
      MODES.DESTINATION;

    state.orbitFocus =
      preserved;

    state.selectedCardinal = "";
    state.selectedRoom = "";

    state.selectedDestinationType =
      "mirrorland";

    state.selectedDestinationId =
      "mirrorland";

    state.selectedDestinationLabel =
      mirror.label;

    state.flowerExpanded =
      false;

    state.panelDescended =
      true;

    state.lastOrientationInput =
      input;

    state.mirrorlandRouteValid =
      mirror.validRoute === true;

    state.mirrorlandWindowState =
      MIRRORLAND_WINDOW_STATES.REVEALING;

    state.mirrorlandWindowActive =
      true;

    state.mirrorlandWindowStable =
      false;

    state.mirrorlandEnterEnabled =
      false;

    state.mirrorlandBackEnabled =
      false;

    state.mirrorlandWindowFailureReason =
      null;

    state.failureReason =
      null;

    state.lastMirrorlandWindowCompletionEvent =
      "";

    const transitionId =
      nextMirrorlandTransitionId();

    state.lastMirrorlandWindowAction =
      "mirrorland-reveal-requested";

    setEnter(
      mirror.validRoute
        ? mirror.route
        : "",
      "html-mirrorland-declaration",
      false,
      MIRRORLAND_COPY.primaryAction
    );

    armMirrorlandTransitionTimeout(
      MIRRORLAND_WINDOW_STATES.REVEALING,
      transitionId,
      MIRRORLAND_TIMEOUTS.REVEAL_MS,
      "MIRRORLAND_WINDOW_REVEAL_TIMEOUT",
      "reveal"
    );

    commit(
      "mirrorland-window-reveal-requested"
    );

    scrollToPanel();
    return true;
  }

  function selectMirrorland(
    input = "tap-mirrorland"
  ) {
    return requestMirrorlandFocus(input);
  }

  function requestBackToCompass(
    input = "mirrorland-back-control"
  ) {
    if (
      state.mirrorlandWindowState !==
      MIRRORLAND_WINDOW_STATES.FOCUSED
    ) {
      state.lastMirrorlandWindowAction =
        "back-request-rejected-invalid-state";

      emitReceipt();
      return false;
    }

    state.lastOrientationInput =
      input;

    state.mirrorlandWindowState =
      MIRRORLAND_WINDOW_STATES.WITHDRAWING;

    state.mirrorlandWindowActive =
      true;

    state.mirrorlandWindowStable =
      false;

    state.mirrorlandEnterEnabled =
      false;

    state.mirrorlandBackEnabled =
      false;

    state.lastMirrorlandWindowCompletionEvent =
      "";

    const transitionId =
      nextMirrorlandTransitionId();

    state.lastMirrorlandWindowAction =
      "mirrorland-withdrawal-requested";

    setEnter(
      state.mirrorland &&
      state.mirrorland.validRoute
        ? state.mirrorland.route
        : "",
      "html-mirrorland-declaration",
      false,
      MIRRORLAND_COPY.primaryAction
    );

    armMirrorlandTransitionTimeout(
      MIRRORLAND_WINDOW_STATES.WITHDRAWING,
      transitionId,
      MIRRORLAND_TIMEOUTS.WITHDRAWAL_MS,
      "MIRRORLAND_WINDOW_WITHDRAWAL_TIMEOUT",
      "withdrawal"
    );

    commit(
      "mirrorland-window-withdrawal-requested"
    );

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

  function transitionCompletionKey(
    eventName,
    completionId
  ) {
    return (
      String(eventName || "") +
      ":" +
      String(completionId || "")
    );
  }

  function validCompletionEvent(
    event,
    expectedControllerState,
    expectedReportedState
  ) {
    if (
      state.mirrorlandWindowState !==
      expectedControllerState
    ) {
      return false;
    }

    const detail =
      eventDetail(event);

    if (
      detail.source !==
      MIRRORLAND_RENDERER_SOURCE
    ) {
      return false;
    }

    if (
      String(detail.windowState || "") !==
      expectedReportedState
    ) {
      return false;
    }

    if (
      String(detail.completionId || "") !==
      String(state.mirrorlandTransitionId)
    ) {
      return false;
    }

    const key =
      transitionCompletionKey(
        event.type,
        detail.completionId
      );

    if (
      state.lastMirrorlandWindowCompletionEvent ===
      key
    ) {
      return false;
    }

    return true;
  }

  function completeMirrorlandReveal(event) {
    if (
      !validCompletionEvent(
        event,
        MIRRORLAND_WINDOW_STATES.REVEALING,
        MIRRORLAND_WINDOW_STATES.FOCUSED
      )
    ) {
      state.lastMirrorlandWindowAction =
        "reveal-completion-rejected";

      emitReceipt();
      return false;
    }

    clearMirrorlandTransitionTimeout();

    const detail =
      eventDetail(event);

    state.lastMirrorlandWindowCompletionEvent =
      transitionCompletionKey(
        event.type,
        detail.completionId
      );

    state.mirrorlandWindowState =
      MIRRORLAND_WINDOW_STATES.FOCUSED;

    state.mirrorlandWindowActive =
      true;

    state.mirrorlandWindowStable =
      true;

    state.mirrorlandEnterEnabled =
      state.mirrorlandRouteValid === true;

    state.mirrorlandBackEnabled =
      true;

    state.lastMirrorlandWindowAction =
      "mirrorland-reveal-complete";

    setEnter(
      state.mirrorland &&
      state.mirrorland.validRoute
        ? state.mirrorland.route
        : "",
      "html-mirrorland-declaration",
      state.mirrorlandEnterEnabled,
      MIRRORLAND_COPY.primaryAction
    );

    commit(
      "mirrorland-window-focused"
    );

    return true;
  }

  function completeMirrorlandWithdrawal(event) {
    if (
      !validCompletionEvent(
        event,
        MIRRORLAND_WINDOW_STATES.WITHDRAWING,
        MIRRORLAND_WINDOW_STATES.DORMANT
      )
    ) {
      state.lastMirrorlandWindowAction =
        "withdrawal-completion-rejected";

      emitReceipt();
      return false;
    }

    clearMirrorlandTransitionTimeout();

    const detail =
      eventDetail(event);

    state.lastMirrorlandWindowCompletionEvent =
      transitionCompletionKey(
        event.type,
        detail.completionId
      );

    const restoredFocus =
      normalizeWing(
        state.preservedOrbitFocus
      );

    state.mode =
      restoredFocus
        ? MODES.ORBIT
        : MODES.COMPASS;

    state.orbitFocus =
      restoredFocus;

    state.selectedCardinal = "";
    state.selectedRoom = "";
    state.flowerExpanded = false;
    state.panelDescended = false;

    clearDestination();

    state.mirrorlandWindowState =
      MIRRORLAND_WINDOW_STATES.DORMANT;

    state.mirrorlandWindowActive =
      false;

    state.mirrorlandWindowStable =
      false;

    state.mirrorlandEnterEnabled =
      false;

    state.mirrorlandBackEnabled =
      false;

    state.lastMirrorlandWindowAction =
      "mirrorland-withdrawal-complete";

    commit(
      "mirrorland-window-dormant-restored"
    );

    scrollToOrbit();
    return true;
  }

  function boundedReasonCode(value) {
    const normalized = String(
      value ||
      "MIRRORLAND_WINDOW_RENDER_FAILURE"
    )
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9:_-]+/g, "_")
      .slice(0, 120);

    return (
      normalized ||
      "MIRRORLAND_WINDOW_RENDER_FAILURE"
    );
  }

  function boundedFailureStage(value) {
    const stage = String(
      value || ""
    )
      .trim()
      .toLowerCase();

    return ALLOWED_FAILURE_STAGES.includes(stage)
      ? stage
      : "context";
  }

  function restoreCompassAfterMirrorlandFailure() {
    clearMirrorlandTransitionTimeout();

    const restoredFocus =
      normalizeWing(
        state.preservedOrbitFocus
      );

    state.mode =
      restoredFocus
        ? MODES.ORBIT
        : MODES.COMPASS;

    state.orbitFocus =
      restoredFocus;

    state.selectedCardinal = "";
    state.selectedRoom = "";
    state.flowerExpanded = false;
    state.panelDescended = false;

    clearDestination();

    state.mirrorlandWindowState =
      MIRRORLAND_WINDOW_STATES.DORMANT;

    state.mirrorlandWindowActive =
      false;

    state.mirrorlandWindowStable =
      false;

    state.mirrorlandEnterEnabled =
      false;

    state.mirrorlandBackEnabled =
      false;
  }

  function applyMirrorlandFailure(
    reasonCode,
    stage = "context",
    glError = null
  ) {
    clearMirrorlandTransitionTimeout();

    const boundedReason =
      boundedReasonCode(reasonCode);

    const boundedStage =
      boundedFailureStage(stage);

    const boundedGlError =
      glError === null ||
      typeof glError === "undefined"
        ? null
        : String(glError).slice(0, 160);

    state.mirrorlandWindowFailureReason =
      boundedReason;

    state.failureReason =
      "MIRRORLAND_WINDOW_RENDER_FAILURE:" +
      boundedReason;

    state.lastMirrorlandWindowAction =
      "mirrorland-render-failure";

    restoreCompassAfterMirrorlandFailure();

    commit(
      "mirrorland-window-render-failure"
    );

    emitReceipt({
      mirrorlandWindowFailureReason:
        boundedReason,
      mirrorlandWindowFailureStage:
        boundedStage,
      mirrorlandWindowFailureGlError:
        boundedGlError,
      failureReason:
        state.failureReason
    });

    scrollToOrbit();
    return true;
  }

  function handleMirrorlandRenderFailure(event) {
    const detail =
      eventDetail(event);

    if (
      detail.source !==
      MIRRORLAND_RENDERER_SOURCE
    ) {
      return false;
    }

    return applyMirrorlandFailure(
      detail.reasonCode,
      detail.stage,
      detail.glError
    );
  }

  function navigateEnter() {
    if (
      state.selectedDestinationType ===
      "mirrorland"
    ) {
      const routeIsValid =
        state.mirrorlandWindowState ===
          MIRRORLAND_WINDOW_STATES.FOCUSED &&
        state.mirrorlandWindowStable === true &&
        state.mirrorlandEnterEnabled === true &&
        state.enterEnabled === true &&
        state.mirrorlandRouteValid === true &&
        isFrozenMirrorlandRoute(
          state.selectedDestinationRoute
        ) &&
        !!state.routeSource;

      if (!routeIsValid) {
        state.lastAction =
          "mirrorland-enter-held-invalid-window-state";

        state.lastMirrorlandWindowAction =
          "mirrorland-enter-rejected";

        state.mirrorlandEnterEnabled =
          false;

        setEnter(
          state.mirrorland &&
          state.mirrorland.validRoute
            ? state.mirrorland.route
            : "",
          "html-mirrorland-declaration",
          false,
          MIRRORLAND_COPY.primaryAction
        );

        emitReceipt({
          enterEnabled: false,
          mirrorlandEnterEnabled: false,
          failureReason:
            "MIRRORLAND_ENTER_HELD_INVALID_WINDOW_STATE"
        });

        return false;
      }

      clearMirrorlandTransitionTimeout();

      state.mirrorlandWindowState =
        MIRRORLAND_WINDOW_STATES.NAVIGATING;

      state.mirrorlandWindowActive =
        true;

      state.mirrorlandWindowStable =
        true;

      state.mirrorlandEnterEnabled =
        false;

      state.mirrorlandBackEnabled =
        false;

      state.lastMirrorlandWindowAction =
        "mirrorland-navigation-authorized";

      setEnter(
        state.selectedDestinationRoute,
        state.routeSource,
        false,
        MIRRORLAND_COPY.primaryAction
      );

      commit(
        "mirrorland-enter-navigation"
      );

      window.location.assign(
        state.selectedDestinationRoute
      );

      return true;
    }

    const routeIsValid =
      state.enterEnabled === true &&
      isValidRoute(
        state.selectedDestinationRoute
      ) &&
      !!state.routeSource;

    if (!routeIsValid) {
      state.lastAction =
        "enter-held-no-valid-destination-route";

      setEnter(
        "",
        "",
        false,
        "Enter Room"
      );

      emitReceipt({
        enterEnabled: false,
        failureReason:
          "ENTER_HELD_NO_VALID_DESTINATION_ROUTE"
      });

      return false;
    }

    state.lastAction =
      "enter-navigation";

    emitReceipt({
      destinationRoute:
        state.selectedDestinationRoute,
      routeSource:
        state.routeSource,
      enterEnabled:
        true
    });

    window.location.assign(
      state.selectedDestinationRoute
    );

    return true;
  }

  function handleDelegatedActivation(event) {
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

      requestBackToCompass(
        "delegated-back-to-compass"
      );

      return;
    }

    if (
      target.matches(
        "[data-compass-return-to-orbit]"
      )
    ) {
      event.preventDefault();
      event.stopPropagation();

      returnToCluster(
        "panel-return-to-open-cluster"
      );

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
        "delegated-tap-mirrorland-threshold"
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
        "delegated-tap-star-label"
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
        "delegated-tap-cluster-star-label"
      );
    }
  }

  function bindEvents() {
    state.root.addEventListener(
      "click",
      handleDelegatedActivation,
      true
    );

    state.root.addEventListener(
      MIRRORLAND_EVENTS.REVEAL_COMPLETE,
      completeMirrorlandReveal
    );

    state.root.addEventListener(
      MIRRORLAND_EVENTS.WITHDRAWAL_COMPLETE,
      completeMirrorlandWithdrawal
    );

    state.root.addEventListener(
      MIRRORLAND_EVENTS.RENDER_FAILURE,
      handleMirrorlandRenderFailure
    );

    if (state.returnControl) {
      state.returnControl.addEventListener(
        "click",
        (event) => {
          event.preventDefault();

          returnToConstellation(
            "scene-return-to-constellation"
          );
        }
      );
    }
  }

  function exposeApi() {
    globalThis.DGB_COMPASS_CONTROLLER =
      Object.freeze({
        contract:
          CONTRACT,

        receipt:
          () =>
            Object.freeze({
              ...RECEIPT
            }),

        requestAxisSwipe,

        requestDirectionSelection,

        selectWing:
          requestDirectionSelection,

        selectCardinal,

        requestCardinalSelection:
          selectCardinal,

        selectRoom,

        requestRoomSelection:
          selectRoom,

        selectMirrorland,

        requestMirrorlandSelection:
          requestMirrorlandFocus,

        requestMirrorlandFocus,

        requestBackToCompass,

        returnToCluster,

        returnToOrbit:
          returnToCluster,

        returnToConstellation,

        returnStep:
          returnToCluster,

        enter:
          navigateEnter,

        activateLens
      });
  }

  function init() {
    if (!acquireDom()) return;

    clearMirrorlandTransitionTimeout();
    initializeLensSets();
    bindEvents();
    exposeApi();
    resetMirrorlandWindowState();

    state.mode =
      MODES.COMPASS;

    state.orbitFocus = "";
    state.selectedCardinal = "";
    state.selectedRoom = "";
    state.flowerExpanded = false;
    state.panelDescended = false;
    state.preservedOrbitFocus = "";

    clearDestination();

    commit(
      "restore-compass-mode"
    );
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once: true
      }
    );
  } else {
    init();
  }
})();

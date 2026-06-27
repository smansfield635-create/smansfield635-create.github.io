/* /assets/compass/compass.controller.js
   Diamond Gate Bridge Compass
   Controller authority for state, selection, panel presentation,
   Mirrorland lifecycle, navigation, lens tabs, and receipts.

   This file does not render crystals or Mirrorland geometry.
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "DGB_COMPASS_CONTROLLER_FIVE_FILE_REBUILD_v1",
    file: "/assets/compass/compass.controller.js",
    releaseId: "dgb-compass-mirrorland-rebuild-v1",
    visualPassClaimed: false,
    productionAuthorized: false,
    deploymentAuthorized: false
  });

  const STATES = Object.freeze({
    CONSTELLATION: "CONSTELLATION",
    CLUSTER_OPEN: "CLUSTER_OPEN",
    ROOM_SELECTED: "ROOM_SELECTED",
    MIRRORLAND_REVEALING: "MIRRORLAND_REVEALING",
    MIRRORLAND_FOCUSED: "MIRRORLAND_FOCUSED",
    MIRRORLAND_WITHDRAWING: "MIRRORLAND_WITHDRAWING",
    NAVIGATING: "NAVIGATING",
    HELD: "HELD"
  });

  const MIRRORLAND_STATES = Object.freeze({
    DORMANT: "DORMANT",
    REVEALING: "MIRRORLAND_REVEALING",
    FOCUSED: "MIRRORLAND_FOCUSED",
    WITHDRAWING: "MIRRORLAND_WITHDRAWING",
    HELD: "HELD"
  });

  const WINGS = Object.freeze([
    "north",
    "east",
    "south",
    "west"
  ]);

  const ORBIT_SEQUENCE = Object.freeze([
    "north",
    "east",
    "south",
    "west"
  ]);

  const PROMINENCE = Object.freeze({
    [STATES.CONSTELLATION]: Object.freeze({
      compass: 1.0,
      window: 0.36
    }),

    [STATES.CLUSTER_OPEN]: Object.freeze({
      compass: 1.0,
      window: 0.34
    }),

    [STATES.ROOM_SELECTED]: Object.freeze({
      compass: 0.94,
      window: 0.32
    }),

    [STATES.MIRRORLAND_REVEALING]: Object.freeze({
      compass: 0.62,
      window: 1.0
    }),

    [STATES.MIRRORLAND_FOCUSED]: Object.freeze({
      compass: 0.36,
      window: 1.0
    }),

    [STATES.MIRRORLAND_WITHDRAWING]: Object.freeze({
      compass: 0.70,
      window: 0.82
    }),

    [STATES.NAVIGATING]: Object.freeze({
      compass: 0.22,
      window: 1.0
    }),

    [STATES.HELD]: Object.freeze({
      compass: 0.80,
      window: 0.0
    })
  });

  const TIMEOUTS = Object.freeze({
    mirrorlandRevealMs: 8000,
    mirrorlandWithdrawalMs: 6000,
    rendererReadyMs: 3000
  });

  const DEFAULT_PANEL = Object.freeze({
    eyebrow: "Selected path",
    title: "Choose a star",
    purpose: "Tap a star to open its cluster.",
    relationship:
      "Tap a cluster star to inspect its path. Return To Orbit moves back to the open cluster. Swipe returns to the constellation."
  });

  const GUIDANCE = Object.freeze({
    CONSTELLATION:
      "Tap a star to open its cluster. Swipe across open space to rotate the constellation.",

    CLUSTER_OPEN:
      "Tap a cluster star to inspect its path. Swipe across open space to return to the constellation.",

    ROOM_SELECTED:
      "Inspect the selected path. Use Enter Room to navigate, or Return To Orbit to reopen the cluster.",

    MIRRORLAND_DORMANT:
      "Activate the center threshold to reveal Mirrorland without losing your Compass position.",

    MIRRORLAND_REVEALING:
      "Mirrorland is revealing. Wait for the Window to stabilize.",

    MIRRORLAND_FOCUSED:
      "Mirrorland is stable. Enter when ready, or use Back to Compass to restore the prior state.",

    MIRRORLAND_WITHDRAWING:
      "Mirrorland is withdrawing. Your prior Compass state will be restored.",

    HELD:
      "The Compass remains available, but one visual subsystem is temporarily held."
  });

  const RECEIPT = {
    contractId: CONTRACT.id,
    status: "pending",
    state: STATES.CONSTELLATION,
    orbitFocus: "",
    selectedCardinal: "",
    selectedRoom: "",
    selectedDestinationType: "",
    selectedRoute: "",
    mirrorlandState: MIRRORLAND_STATES.DORMANT,
    mirrorlandTransitionId: "",
    lastAction: "",
    lastFailure: null,
    visualPassClaimed: false
  };

  const state = {
    root: null,
    scene: null,
    panel: null,
    panelEyebrow: null,
    panelTitle: null,
    panelPurpose: null,
    panelRelationship: null,
    enterButton: null,
    enterLabel: null,
    returnButton: null,
    mirrorlandBackButton: null,
    guidance: null,
    controllerReceiptOutput: null,

    current: STATES.CONSTELLATION,
    orbitFocus: "",
    selectedCardinal: "",
    selectedRoom: "",
    selectedDestinationType: "",
    selectedDestinationId: "",
    selectedDestinationLabel: "",
    selectedRoute: "",

    mirrorlandState: MIRRORLAND_STATES.DORMANT,
    mirrorlandTransitionId: "",
    mirrorlandTimeout: 0,
    rendererReadyTimeout: 0,

    preserved: null,
    initialized: false,
    reducedMotion: false
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

  function normalizeRoute(value) {
    const route = String(value || "").trim();
    return route.startsWith("/") ? route : "";
  }

  function makeTransitionId(prefix = "mirrorland") {
    const time = Date.now().toString(36);
    const random = Math.random().toString(36).slice(2, 8);
    return `${prefix}-${time}-${random}`;
  }

  function setHiddenControl(control, hidden) {
    if (!control) return;

    control.hidden = hidden;
    control.disabled = hidden;
    control.setAttribute("aria-hidden", hidden ? "true" : "false");
    control.setAttribute("aria-disabled", hidden ? "true" : "false");

    if (hidden) {
      control.setAttribute("tabindex", "-1");
    } else {
      control.removeAttribute("tabindex");
    }
  }

  function setEnterEnabled(enabled, label = "Enter Room") {
    if (!state.enterButton) return;

    state.enterButton.disabled = !enabled;
    state.enterButton.setAttribute(
      "aria-disabled",
      enabled ? "false" : "true"
    );

    if (state.enterLabel) {
      state.enterLabel.textContent = label;
    } else {
      state.enterButton.textContent = label;
    }
  }

  function setPanel({
    eyebrow,
    title,
    purpose,
    relationship
  }) {
    if (state.panelEyebrow) {
      state.panelEyebrow.textContent =
        eyebrow || DEFAULT_PANEL.eyebrow;
    }

    if (state.panelTitle) {
      state.panelTitle.textContent =
        title || DEFAULT_PANEL.title;
    }

    if (state.panelPurpose) {
      state.panelPurpose.textContent =
        purpose || DEFAULT_PANEL.purpose;
    }

    if (state.panelRelationship) {
      state.panelRelationship.textContent =
        relationship || DEFAULT_PANEL.relationship;
    }
  }

  function setGuidance(message) {
    if (state.guidance) {
      state.guidance.textContent = message || "";
    }
  }

  function prominenceFor(currentState) {
    return (
      PROMINENCE[currentState] ||
      PROMINENCE[STATES.HELD]
    );
  }

  function syncDatasets() {
    if (!state.root) return;

    const prominence = prominenceFor(state.current);

    state.root.dataset.compassMode = state.current;
    state.root.dataset.orbitFocus = state.orbitFocus;
    state.root.dataset.selectedCardinal = state.selectedCardinal;
    state.root.dataset.selectedWing = state.selectedCardinal;
    state.root.dataset.selectedRoom = state.selectedRoom;
    state.root.dataset.selectedDestinationType =
      state.selectedDestinationType;
    state.root.dataset.selectedDestinationId =
      state.selectedDestinationId;
    state.root.dataset.selectedDestinationLabel =
      state.selectedDestinationLabel;
    state.root.dataset.selectedRoute = state.selectedRoute;
    state.root.dataset.flowerExpanded =
      state.current === STATES.CLUSTER_OPEN ||
      state.current === STATES.ROOM_SELECTED
        ? "true"
        : "false";
    state.root.dataset.panelDescended =
      state.selectedDestinationType ? "true" : "false";
    state.root.dataset.reducedMotion =
      state.reducedMotion ? "true" : "false";

    state.root.dataset.mirrorlandWindowState =
      state.mirrorlandState;
    state.root.dataset.mirrorlandWindowActive =
      state.mirrorlandState === MIRRORLAND_STATES.REVEALING ||
      state.mirrorlandState === MIRRORLAND_STATES.FOCUSED ||
      state.mirrorlandState === MIRRORLAND_STATES.WITHDRAWING
        ? "true"
        : "false";
    state.root.dataset.mirrorlandWindowStable =
      state.mirrorlandState === MIRRORLAND_STATES.FOCUSED
        ? "true"
        : state.mirrorlandState === MIRRORLAND_STATES.DORMANT
          ? "true"
          : "false";
    state.root.dataset.mirrorlandEnterEnabled =
      state.current === STATES.MIRRORLAND_FOCUSED
        ? "true"
        : "false";
    state.root.dataset.mirrorlandBackEnabled =
      state.current === STATES.MIRRORLAND_REVEALING ||
      state.current === STATES.MIRRORLAND_FOCUSED
        ? "true"
        : "false";
    state.root.dataset.mirrorlandTransitionId =
      state.mirrorlandTransitionId;
    state.root.dataset.compassProminence =
      String(prominence.compass);
    state.root.dataset.windowProminence =
      String(prominence.window);
    state.root.dataset.visualPassClaimed = "false";

    if (state.preserved) {
      state.root.dataset.preservedCompassMode =
        state.preserved.current || "";
      state.root.dataset.preservedOrbitFocus =
        state.preserved.orbitFocus || "";
      state.root.dataset.preservedSelectedCardinal =
        state.preserved.selectedCardinal || "";
      state.root.dataset.preservedSelectedRoom =
        state.preserved.selectedRoom || "";
    } else {
      state.root.dataset.preservedCompassMode = "";
      state.root.dataset.preservedOrbitFocus = "";
      state.root.dataset.preservedSelectedCardinal = "";
      state.root.dataset.preservedSelectedRoom = "";
    }

    const mirrorlandControl = qs(
      "[data-compass-object='mirrorland']",
      state.root
    );

    if (mirrorlandControl) {
      mirrorlandControl.setAttribute(
        "aria-expanded",
        state.mirrorlandState === MIRRORLAND_STATES.REVEALING ||
        state.mirrorlandState === MIRRORLAND_STATES.FOCUSED
          ? "true"
          : "false"
      );
    }

    qsa("[data-compass-cardinal]", state.root).forEach((element) => {
      const wing = normalizeWing(element.dataset.wing);
      const selected =
        wing === state.selectedCardinal &&
        (
          state.current === STATES.CLUSTER_OPEN ||
          state.current === STATES.ROOM_SELECTED
        );

      element.dataset.selected = selected ? "true" : "false";

      if (selected) {
        element.setAttribute("aria-current", "true");
      } else {
        element.removeAttribute("aria-current");
      }
    });

    qsa("[data-compass-room]", state.root).forEach((element) => {
      const selected =
        element.dataset.roomId === state.selectedRoom;

      element.dataset.selected = selected ? "true" : "false";

      if (selected) {
        element.setAttribute("aria-current", "true");
      } else {
        element.removeAttribute("aria-current");
      }
    });
  }

  function emitReceipt(extra = {}) {
    Object.assign(RECEIPT, {
      status:
        state.current === STATES.HELD
          ? "held"
          : "available",
      state: state.current,
      orbitFocus: state.orbitFocus,
      selectedCardinal: state.selectedCardinal,
      selectedRoom: state.selectedRoom,
      selectedDestinationType:
        state.selectedDestinationType,
      selectedRoute: state.selectedRoute,
      mirrorlandState: state.mirrorlandState,
      mirrorlandTransitionId:
        state.mirrorlandTransitionId,
      visualPassClaimed: false
    }, extra);

    if (state.root) {
      state.root.dataset.compassControllerReceipt =
        JSON.stringify(RECEIPT);
      state.root.dataset.compassControllerStatus =
        RECEIPT.status;
      state.root.dataset.visualPassClaimed = "false";
    }

    if (state.controllerReceiptOutput) {
      state.controllerReceiptOutput.value =
        JSON.stringify(RECEIPT);
      state.controllerReceiptOutput.textContent =
        JSON.stringify(RECEIPT);
      state.controllerReceiptOutput.dataset.visualPassClaimed =
        "false";
    }

    globalThis.DGB_COMPASS_CONTROLLER_RECEIPT =
      Object.freeze({ ...RECEIPT });
  }

  function fail(reason, action = "controller-failure") {
    clearMirrorlandTimers();

    state.current = STATES.HELD;
    state.mirrorlandState = MIRRORLAND_STATES.HELD;

    syncPresentation();

    emitReceipt({
      lastAction: action,
      lastFailure: String(reason || "UNKNOWN_FAILURE")
    });
  }

  function clearMirrorlandTimers() {
    if (state.mirrorlandTimeout) {
      clearTimeout(state.mirrorlandTimeout);
      state.mirrorlandTimeout = 0;
    }

    if (state.rendererReadyTimeout) {
      clearTimeout(state.rendererReadyTimeout);
      state.rendererReadyTimeout = 0;
    }
  }

  function destinationFromElement(element) {
    if (!element) return null;

    const destinationType =
      String(element.dataset.destinationType || "")
        .trim()
        .toLowerCase();

    const destinationId =
      String(
        element.dataset.destinationId ||
        element.dataset.roomId ||
        element.dataset.cardinalId ||
        ""
      ).trim();

    const label =
      String(
        element.dataset.label ||
        element.dataset.coordinateLabel ||
        element.textContent ||
        ""
      ).trim();

    const route = normalizeRoute(
      element.dataset.route ||
      element.getAttribute("href") ||
      ""
    );

    return {
      element,
      destinationType,
      destinationId,
      label,
      route
    };
  }

  function panelFromCardinal(element) {
    return {
      eyebrow:
        element.dataset.coordinateLabel ||
        "Selected coordinate",
      title:
        element.dataset.panelTitle ||
        element.dataset.title ||
        element.dataset.coordinateLabel ||
        "Selected coordinate",
      purpose:
        element.dataset.panelBody ||
        element.dataset.coordinateFunction ||
        "",
      relationship:
        element.dataset.panelWhy ||
        "Inspect this coordinate before entering."
    };
  }

  function panelFromRoom(element) {
    return {
      eyebrow:
        element.dataset.localCoordinate ||
        "Selected path",
      title:
        element.dataset.label ||
        element.textContent.trim(),
      purpose:
        element.dataset.preview ||
        element.dataset.localFunction ||
        "",
      relationship:
        element.dataset.whyEnter ||
        "Inspect this path, then enter when ready."
    };
  }

  function panelFromMirrorland(element) {
    return {
      eyebrow:
        element.dataset.panelEyebrow ||
        element.dataset.orbitLabel ||
        "Mirrorland Threshold",
      title:
        element.dataset.panelTitle ||
        "Mirrorland",
      purpose:
        element.dataset.panelBody ||
        element.dataset.coordinateFunction ||
        "",
      relationship:
        element.dataset.panelWhy ||
        "Reveal the threshold before entering."
    };
  }

  function resetSelection() {
    state.selectedCardinal = "";
    state.selectedRoom = "";
    state.selectedDestinationType = "";
    state.selectedDestinationId = "";
    state.selectedDestinationLabel = "";
    state.selectedRoute = "";
  }

  function setState(nextState, action) {
    if (!Object.values(STATES).includes(nextState)) {
      fail(`INVALID_STATE:${nextState}`, action);
      return false;
    }

    state.current = nextState;
    syncPresentation();

    emitReceipt({
      lastAction: action || `state:${nextState}`,
      lastFailure: null
    });

    return true;
  }

  function syncPresentation() {
    syncDatasets();

    const mirrorlandActive =
      state.current === STATES.MIRRORLAND_REVEALING ||
      state.current === STATES.MIRRORLAND_FOCUSED ||
      state.current === STATES.MIRRORLAND_WITHDRAWING;

    if (mirrorlandActive) {
      setHiddenControl(state.returnButton, true);
      setHiddenControl(
        state.mirrorlandBackButton,
        state.current === STATES.MIRRORLAND_WITHDRAWING
      );

      setEnterEnabled(
        state.current === STATES.MIRRORLAND_FOCUSED,
        "Enter Mirrorland"
      );

      if (state.current === STATES.MIRRORLAND_REVEALING) {
        setGuidance(GUIDANCE.MIRRORLAND_REVEALING);
      } else if (
        state.current === STATES.MIRRORLAND_FOCUSED
      ) {
        setGuidance(GUIDANCE.MIRRORLAND_FOCUSED);
      } else {
        setGuidance(GUIDANCE.MIRRORLAND_WITHDRAWING);
      }

      return;
    }

    if (state.current === STATES.CONSTELLATION) {
      setPanel(DEFAULT_PANEL);
      setEnterEnabled(false, "Enter Room");
      setHiddenControl(state.returnButton, true);
      setHiddenControl(state.mirrorlandBackButton, true);
      setGuidance(GUIDANCE.CONSTELLATION);
      return;
    }

    if (state.current === STATES.CLUSTER_OPEN) {
      setEnterEnabled(
        Boolean(state.selectedRoute),
        "Enter Coordinate"
      );
      setHiddenControl(state.returnButton, true);
      setHiddenControl(state.mirrorlandBackButton, true);
      setGuidance(GUIDANCE.CLUSTER_OPEN);
      return;
    }

    if (state.current === STATES.ROOM_SELECTED) {
      setEnterEnabled(
        Boolean(state.selectedRoute),
        "Enter Room"
      );
      setHiddenControl(state.returnButton, false);
      setHiddenControl(state.mirrorlandBackButton, true);
      setGuidance(GUIDANCE.ROOM_SELECTED);
      return;
    }

    if (state.current === STATES.NAVIGATING) {
      setEnterEnabled(false, "Entering…");
      setHiddenControl(state.returnButton, true);
      setHiddenControl(state.mirrorlandBackButton, true);
      return;
    }

    if (state.current === STATES.HELD) {
      setEnterEnabled(false, "Unavailable");
      setHiddenControl(state.returnButton, true);
      setHiddenControl(state.mirrorlandBackButton, true);
      setGuidance(GUIDANCE.HELD);
    }
  }

  function requestCardinalSelection(cardinalId) {
    const wing = normalizeWing(cardinalId);

    if (!wing) {
      fail(
        `INVALID_CARDINAL:${cardinalId}`,
        "requestCardinalSelection"
      );
      return false;
    }

    if (
      state.current === STATES.MIRRORLAND_REVEALING ||
      state.current === STATES.MIRRORLAND_FOCUSED ||
      state.current === STATES.MIRRORLAND_WITHDRAWING ||
      state.current === STATES.NAVIGATING
    ) {
      return false;
    }

    const element = qs(
      `[data-compass-cardinal][data-wing="${wing}"]`,
      state.root
    );

    if (!element) {
      fail(
        `CARDINAL_NOT_FOUND:${wing}`,
        "requestCardinalSelection"
      );
      return false;
    }

    const destination = destinationFromElement(element);

    state.orbitFocus = wing;
    state.selectedCardinal = wing;
    state.selectedRoom = "";
    state.selectedDestinationType = "cardinal";
    state.selectedDestinationId = wing;
    state.selectedDestinationLabel =
      destination.label ||
      element.dataset.coordinateLabel ||
      wing;
    state.selectedRoute = destination.route;

    setPanel(panelFromCardinal(element));

    return setState(
      STATES.CLUSTER_OPEN,
      `cardinal-selected:${wing}`
    );
  }

  function requestRoomSelection(roomId) {
    const id = String(roomId || "").trim();

    if (
      !id ||
      (
        state.current !== STATES.CLUSTER_OPEN &&
        state.current !== STATES.ROOM_SELECTED
      )
    ) {
      return false;
    }

    const element = qs(
      `[data-compass-room][data-room-id="${CSS.escape(id)}"]`,
      state.root
    );

    if (!element) {
      fail(
        `ROOM_NOT_FOUND:${id}`,
        "requestRoomSelection"
      );
      return false;
    }

    const wing = normalizeWing(element.dataset.wing);

    if (
      state.selectedCardinal &&
      wing !== state.selectedCardinal
    ) {
      return false;
    }

    const destination = destinationFromElement(element);

    state.orbitFocus = wing;
    state.selectedCardinal = wing;
    state.selectedRoom = id;
    state.selectedDestinationType = "petal";
    state.selectedDestinationId = id;
    state.selectedDestinationLabel =
      destination.label;
    state.selectedRoute = destination.route;

    setPanel(panelFromRoom(element));

    return setState(
      STATES.ROOM_SELECTED,
      `room-selected:${id}`
    );
  }

  function requestAxisSwipe(axis) {
    const normalized = String(axis || "")
      .trim()
      .toLowerCase();

    if (
      state.current === STATES.MIRRORLAND_REVEALING ||
      state.current === STATES.MIRRORLAND_FOCUSED ||
      state.current === STATES.MIRRORLAND_WITHDRAWING ||
      state.current === STATES.NAVIGATING
    ) {
      return false;
    }

    if (
      state.current === STATES.CLUSTER_OPEN ||
      state.current === STATES.ROOM_SELECTED
    ) {
      resetSelection();

      return setState(
        STATES.CONSTELLATION,
        `cluster-closed-by-${normalized || "swipe"}`
      );
    }

    const currentIndex = Math.max(
      0,
      ORBIT_SEQUENCE.indexOf(
        state.orbitFocus || "north"
      )
    );

    let step = 1;

    if (
      normalized === "vertical" ||
      normalized === "up" ||
      normalized === "left"
    ) {
      step = -1;
    }

    const nextIndex =
      (
        currentIndex +
        step +
        ORBIT_SEQUENCE.length
      ) % ORBIT_SEQUENCE.length;

    state.orbitFocus = ORBIT_SEQUENCE[nextIndex];

    syncPresentation();

    emitReceipt({
      lastAction:
        `orbit-rotated:${state.orbitFocus}`,
      lastFailure: null
    });

    return true;
  }

  function requestReturnToOrbit() {
    if (state.current !== STATES.ROOM_SELECTED) {
      return false;
    }

    state.selectedRoom = "";
    state.selectedDestinationType = "cardinal";
    state.selectedDestinationId =
      state.selectedCardinal;

    const cardinal = qs(
      `[data-compass-cardinal][data-wing="${state.selectedCardinal}"]`,
      state.root
    );

    if (cardinal) {
      const destination =
        destinationFromElement(cardinal);

      state.selectedDestinationLabel =
        destination.label ||
        cardinal.dataset.coordinateLabel ||
        state.selectedCardinal;
      state.selectedRoute = destination.route;

      setPanel(panelFromCardinal(cardinal));
    }

    return setState(
      STATES.CLUSTER_OPEN,
      "return-to-orbit"
    );
  }

  function preserveCompassState() {
    state.preserved = Object.freeze({
      current:
        state.current === STATES.MIRRORLAND_REVEALING ||
        state.current === STATES.MIRRORLAND_FOCUSED ||
        state.current === STATES.MIRRORLAND_WITHDRAWING
          ? STATES.CONSTELLATION
          : state.current,
      orbitFocus: state.orbitFocus,
      selectedCardinal: state.selectedCardinal,
      selectedRoom: state.selectedRoom,
      selectedDestinationType:
        state.selectedDestinationType,
      selectedDestinationId:
        state.selectedDestinationId,
      selectedDestinationLabel:
        state.selectedDestinationLabel,
      selectedRoute: state.selectedRoute
    });
  }

  function requestMirrorlandReveal() {
    if (
      state.current === STATES.MIRRORLAND_REVEALING ||
      state.current === STATES.MIRRORLAND_FOCUSED ||
      state.current === STATES.MIRRORLAND_WITHDRAWING ||
      state.current === STATES.NAVIGATING
    ) {
      return false;
    }

    const element = qs(
      "[data-compass-object='mirrorland']",
      state.root
    );

    if (!element) {
      fail(
        "MIRRORLAND_CONTROL_NOT_FOUND",
        "requestMirrorlandReveal"
      );
      return false;
    }

    preserveCompassState();
    clearMirrorlandTimers();

    const destination = destinationFromElement(element);

    state.selectedDestinationType = "mirrorland";
    state.selectedDestinationId = "mirrorland";
    state.selectedDestinationLabel =
      destination.label || "Mirrorland";
    state.selectedRoute = destination.route;
    state.mirrorlandTransitionId =
      makeTransitionId("reveal");
    state.mirrorlandState =
      MIRRORLAND_STATES.REVEALING;

    setPanel(panelFromMirrorland(element));

    setState(
      STATES.MIRRORLAND_REVEALING,
      "mirrorland-reveal-requested"
    );

    dispatchWindowCommand(
      "DGB_MIRRORLAND_WINDOW_REVEAL_REQUEST",
      {
        transitionId:
          state.mirrorlandTransitionId,
        reducedMotion:
          state.reducedMotion
      }
    );

    state.mirrorlandTimeout = globalThis.setTimeout(
      () => {
        if (
          state.current ===
          STATES.MIRRORLAND_REVEALING
        ) {
          handleMirrorlandFailure(
            "MIRRORLAND_REVEAL_TIMEOUT",
            state.mirrorlandTransitionId
          );
        }
      },
      TIMEOUTS.mirrorlandRevealMs
    );

    return true;
  }

  function requestMirrorlandBack() {
    if (
      state.current !== STATES.MIRRORLAND_REVEALING &&
      state.current !== STATES.MIRRORLAND_FOCUSED
    ) {
      return false;
    }

    clearMirrorlandTimers();

    state.mirrorlandTransitionId =
      makeTransitionId("withdraw");
    state.mirrorlandState =
      MIRRORLAND_STATES.WITHDRAWING;

    setState(
      STATES.MIRRORLAND_WITHDRAWING,
      "mirrorland-withdrawal-requested"
    );

    dispatchWindowCommand(
      "DGB_MIRRORLAND_WINDOW_WITHDRAW_REQUEST",
      {
        transitionId:
          state.mirrorlandTransitionId,
        reducedMotion:
          state.reducedMotion
      }
    );

    state.mirrorlandTimeout = globalThis.setTimeout(
      () => {
        if (
          state.current ===
          STATES.MIRRORLAND_WITHDRAWING
        ) {
          handleMirrorlandFailure(
            "MIRRORLAND_WITHDRAWAL_TIMEOUT",
            state.mirrorlandTransitionId
          );
        }
      },
      TIMEOUTS.mirrorlandWithdrawalMs
    );

    return true;
  }

  function restorePreservedCompassState() {
    const preserved = state.preserved;

    state.preserved = null;
    state.mirrorlandState =
      MIRRORLAND_STATES.DORMANT;
    state.mirrorlandTransitionId = "";

    if (!preserved) {
      resetSelection();
      state.current = STATES.CONSTELLATION;
      setPanel(DEFAULT_PANEL);
      syncPresentation();

      emitReceipt({
        lastAction:
          "mirrorland-withdrawal-complete-default",
        lastFailure: null
      });

      return;
    }

    state.current = preserved.current;
    state.orbitFocus = preserved.orbitFocus;
    state.selectedCardinal =
      preserved.selectedCardinal;
    state.selectedRoom = preserved.selectedRoom;
    state.selectedDestinationType =
      preserved.selectedDestinationType;
    state.selectedDestinationId =
      preserved.selectedDestinationId;
    state.selectedDestinationLabel =
      preserved.selectedDestinationLabel;
    state.selectedRoute = preserved.selectedRoute;

    if (
      state.current === STATES.ROOM_SELECTED &&
      state.selectedRoom
    ) {
      const room = qs(
        `[data-compass-room][data-room-id="${CSS.escape(state.selectedRoom)}"]`,
        state.root
      );

      if (room) {
        setPanel(panelFromRoom(room));
      }
    } else if (
      state.current === STATES.CLUSTER_OPEN &&
      state.selectedCardinal
    ) {
      const cardinal = qs(
        `[data-compass-cardinal][data-wing="${state.selectedCardinal}"]`,
        state.root
      );

      if (cardinal) {
        setPanel(panelFromCardinal(cardinal));
      }
    } else {
      state.current = STATES.CONSTELLATION;
      resetSelection();
      setPanel(DEFAULT_PANEL);
    }

    syncPresentation();

    emitReceipt({
      lastAction:
        "mirrorland-withdrawal-complete-restored",
      lastFailure: null
    });
  }

  function requestEnterSelection() {
    if (!state.selectedRoute) {
      return false;
    }

    if (
      state.selectedDestinationType === "mirrorland" &&
      state.current !== STATES.MIRRORLAND_FOCUSED
    ) {
      return false;
    }

    if (
      state.current !== STATES.CLUSTER_OPEN &&
      state.current !== STATES.ROOM_SELECTED &&
      state.current !== STATES.MIRRORLAND_FOCUSED
    ) {
      return false;
    }

    const route = normalizeRoute(state.selectedRoute);

    if (!route) {
      fail(
        "INVALID_SELECTED_ROUTE",
        "requestEnterSelection"
      );
      return false;
    }

    setState(
      STATES.NAVIGATING,
      `navigate:${route}`
    );

    globalThis.location.assign(route);
    return true;
  }

  function dispatchWindowCommand(type, detail) {
    globalThis.dispatchEvent(
      new CustomEvent(type, {
        detail: Object.freeze({
          ...detail
        })
      })
    );
  }

  function handleMirrorlandRevealComplete(event) {
    const detail = event.detail || {};

    if (
      state.current !== STATES.MIRRORLAND_REVEALING ||
      !detail.transitionId ||
      detail.transitionId !==
        state.mirrorlandTransitionId
    ) {
      return;
    }

    clearMirrorlandTimers();

    state.mirrorlandState =
      MIRRORLAND_STATES.FOCUSED;

    setState(
      STATES.MIRRORLAND_FOCUSED,
      "mirrorland-reveal-complete"
    );
  }

  function handleMirrorlandWithdrawalComplete(event) {
    const detail = event.detail || {};

    if (
      state.current !==
        STATES.MIRRORLAND_WITHDRAWING ||
      !detail.transitionId ||
      detail.transitionId !==
        state.mirrorlandTransitionId
    ) {
      return;
    }

    clearMirrorlandTimers();
    restorePreservedCompassState();
  }

  function handleMirrorlandFailure(reason, transitionId) {
    if (
      transitionId &&
      state.mirrorlandTransitionId &&
      transitionId !== state.mirrorlandTransitionId
    ) {
      return;
    }

    clearMirrorlandTimers();

    state.mirrorlandState =
      MIRRORLAND_STATES.DORMANT;
    state.mirrorlandTransitionId = "";

    const preserved = state.preserved;
    state.preserved = null;

    if (preserved) {
      state.current = preserved.current;
      state.orbitFocus = preserved.orbitFocus;
      state.selectedCardinal =
        preserved.selectedCardinal;
      state.selectedRoom = preserved.selectedRoom;
      state.selectedDestinationType =
        preserved.selectedDestinationType;
      state.selectedDestinationId =
        preserved.selectedDestinationId;
      state.selectedDestinationLabel =
        preserved.selectedDestinationLabel;
      state.selectedRoute = preserved.selectedRoute;
    } else {
      state.current = STATES.CONSTELLATION;
      resetSelection();
    }

    syncPresentation();

    emitReceipt({
      status: "available",
      lastAction:
        "mirrorland-failure-compass-preserved",
      lastFailure:
        String(reason || "MIRRORLAND_RENDER_FAILURE")
    });
  }

  function handleMirrorlandFailureEvent(event) {
    const detail = event.detail || {};

    handleMirrorlandFailure(
      detail.reason ||
        "MIRRORLAND_RENDER_FAILURE",
      detail.transitionId || ""
    );
  }

  function handleCrystalsFailureEvent(event) {
    const detail = event.detail || {};

    emitReceipt({
      status: "available",
      lastAction:
        "crystals-render-failure-semantic-fallback-active",
      lastFailure:
        detail.reason ||
        "COMPASS_CRYSTALS_RENDER_FAILURE"
    });

    setGuidance(
      "The visual star field is temporarily unavailable. Semantic Compass controls remain active."
    );
  }

  function handleSemanticDestination(event) {
    const control = event.target.closest(
      "[data-compass-destination]"
    );

    if (!control || !state.root.contains(control)) {
      return;
    }

    const type = String(
      control.dataset.destinationType || ""
    ).toLowerCase();

    if (type === "mirrorland") {
      event.preventDefault();
      requestMirrorlandReveal();
      return;
    }

    if (
      control.matches("[data-compass-cardinal]")
    ) {
      event.preventDefault();
      requestCardinalSelection(
        control.dataset.wing ||
        control.dataset.cardinalId
      );
      return;
    }

    if (control.matches("[data-compass-room]")) {
      event.preventDefault();
      requestRoomSelection(
        control.dataset.roomId
      );
    }
  }

  function bindPanelControls() {
    if (state.enterButton) {
      state.enterButton.addEventListener(
        "click",
        () => requestEnterSelection()
      );
    }

    if (state.returnButton) {
      state.returnButton.addEventListener(
        "click",
        () => requestReturnToOrbit()
      );
    }

    if (state.mirrorlandBackButton) {
      state.mirrorlandBackButton.addEventListener(
        "click",
        () => requestMirrorlandBack()
      );
    }
  }

  function bindSemanticControls() {
    state.root.addEventListener(
      "click",
      handleSemanticDestination
    );
  }

  function bindRendererEvents() {
    globalThis.addEventListener(
      "MIRRORLAND_WINDOW_REVEAL_COMPLETE",
      handleMirrorlandRevealComplete
    );

    globalThis.addEventListener(
      "MIRRORLAND_WINDOW_WITHDRAWAL_COMPLETE",
      handleMirrorlandWithdrawalComplete
    );

    globalThis.addEventListener(
      "MIRRORLAND_WINDOW_RENDER_FAILURE",
      handleMirrorlandFailureEvent
    );

    globalThis.addEventListener(
      "COMPASS_CRYSTALS_RENDER_FAILURE",
      handleCrystalsFailureEvent
    );
  }

  function activateLensTab(tab) {
    const set = tab.closest(
      "[data-compass-lens-set]"
    );

    if (!set) return;

    const requested =
      tab.dataset.compassLensTab;

    qsa(
      "[data-compass-lens-tab]",
      set
    ).forEach((candidate) => {
      const selected =
        candidate === tab;

      candidate.setAttribute(
        "aria-selected",
        selected ? "true" : "false"
      );

      candidate.tabIndex = selected ? 0 : -1;
    });

    qsa(
      "[data-compass-lens-panel]",
      set
    ).forEach((panel) => {
      panel.hidden =
        panel.dataset.compassLensPanel !==
        requested;
    });
  }

  function bindLensTabs() {
    qsa(
      "[data-compass-lens-set]",
      state.root
    ).forEach((set) => {
      const tabs = qsa(
        "[data-compass-lens-tab]",
        set
      );

      tabs.forEach((tab, index) => {
        tab.tabIndex =
          tab.getAttribute("aria-selected") === "true"
            ? 0
            : -1;

        tab.addEventListener("click", () => {
          activateLensTab(tab);
        });

        tab.addEventListener(
          "keydown",
          (event) => {
            if (
              event.key !== "ArrowRight" &&
              event.key !== "ArrowLeft" &&
              event.key !== "Home" &&
              event.key !== "End"
            ) {
              return;
            }

            event.preventDefault();

            let nextIndex = index;

            if (event.key === "ArrowRight") {
              nextIndex =
                (index + 1) % tabs.length;
            }

            if (event.key === "ArrowLeft") {
              nextIndex =
                (
                  index -
                  1 +
                  tabs.length
                ) % tabs.length;
            }

            if (event.key === "Home") {
              nextIndex = 0;
            }

            if (event.key === "End") {
              nextIndex =
                tabs.length - 1;
            }

            activateLensTab(
              tabs[nextIndex]
            );

            tabs[nextIndex].focus();
          }
        );
      });
    });
  }

  function readReducedMotion() {
    state.reducedMotion =
      globalThis.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches ||
      state.root.dataset.reducedMotion === "true";
  }

  function exposeApi() {
    globalThis.DGB_COMPASS_CONTROLLER =
      Object.freeze({
        contract: CONTRACT,

        receipt: () =>
          Object.freeze({ ...RECEIPT }),

        requestAxisSwipe,

        requestCardinalSelection,

        requestRoomSelection,

        requestReturnToOrbit,

        requestMirrorlandReveal,

        requestMirrorlandBack,

        requestEnterSelection,

        getFrameState: () =>
          Object.freeze({
            state: state.current,
            orbitFocus: state.orbitFocus,
            selectedCardinal:
              state.selectedCardinal,
            selectedRoom:
              state.selectedRoom,
            selectedDestinationType:
              state.selectedDestinationType,
            selectedDestinationId:
              state.selectedDestinationId,
            selectedDestinationLabel:
              state.selectedDestinationLabel,
            selectedRoute:
              state.selectedRoute,
            mirrorlandState:
              state.mirrorlandState,
            mirrorlandTransitionId:
              state.mirrorlandTransitionId,
            reducedMotion:
              state.reducedMotion,
            prominence:
              Object.freeze({
                ...prominenceFor(
                  state.current
                )
              })
          })
      });
  }

  function resolveDom() {
    state.root = qs("[data-compass-root]");

    if (!state.root) {
      throw new Error(
        "COMPASS_ROOT_NOT_FOUND"
      );
    }

    state.scene = qs(
      "[data-compass-scene]",
      state.root
    );

    state.panel = qs(
      "[data-compass-panel]",
      state.root
    );

    state.panelEyebrow = qs(
      "[data-compass-panel-eyebrow]",
      state.root
    );

    state.panelTitle = qs(
      "[data-compass-panel-title]",
      state.root
    );

    state.panelPurpose = qs(
      "[data-compass-panel-purpose]",
      state.root
    );

    state.panelRelationship = qs(
      "[data-compass-panel-relationship]",
      state.root
    );

    state.enterButton = qs(
      "[data-compass-enter]",
      state.root
    );

    state.enterLabel = qs(
      "[data-compass-enter-label]",
      state.root
    );

    state.returnButton = qs(
      "[data-compass-return-to-orbit]",
      state.root
    );

    state.mirrorlandBackButton = qs(
      "[data-compass-mirrorland-back]",
      state.root
    );

    state.guidance = qs(
      "[data-compass-guidance]",
      state.root
    );

    state.controllerReceiptOutput = qs(
      "[data-compass-controller-receipt]",
      state.root
    );

    if (!state.scene) {
      throw new Error(
        "COMPASS_SCENE_NOT_FOUND"
      );
    }

    if (!state.panel) {
      throw new Error(
        "COMPASS_PANEL_NOT_FOUND"
      );
    }
  }

  function init() {
    try {
      resolveDom();
      readReducedMotion();
      exposeApi();
      bindSemanticControls();
      bindPanelControls();
      bindRendererEvents();
      bindLensTabs();

      state.current =
        STATES.CONSTELLATION;
      state.mirrorlandState =
        MIRRORLAND_STATES.DORMANT;
      state.orbitFocus =
        normalizeWing(
          state.root.dataset.orbitFocus
        );

      resetSelection();
      setPanel(DEFAULT_PANEL);
      syncPresentation();

      state.initialized = true;

      emitReceipt({
        status: "available",
        lastAction:
          "controller-initialized",
        lastFailure: null
      });
    } catch (error) {
      const reason =
        error && error.message
          ? error.message
          : String(error);

      RECEIPT.status = "held";
      RECEIPT.lastFailure =
        `CONTROLLER_INIT_FAILURE:${reason}`;

      globalThis.DGB_COMPASS_CONTROLLER_RECEIPT =
        Object.freeze({ ...RECEIPT });

      globalThis.dispatchEvent(
        new CustomEvent(
          "COMPASS_CONTROLLER_FAILURE",
          {
            detail: Object.freeze({
              reason:
                RECEIPT.lastFailure
            })
          }
        )
      );
    }
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

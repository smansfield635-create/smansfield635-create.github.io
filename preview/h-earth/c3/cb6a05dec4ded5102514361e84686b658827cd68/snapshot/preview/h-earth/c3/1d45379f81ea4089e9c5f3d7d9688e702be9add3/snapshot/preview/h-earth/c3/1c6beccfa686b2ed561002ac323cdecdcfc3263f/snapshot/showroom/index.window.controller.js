/* TARGET FILE: /showroom/index.window.controller.js */
/* COMPLETE REPLACEMENT */
/* SHOWROOM_WINDOW_CONTROLLER_v1_EXISTING_BUTTON_CURTAIN_TOGGLE */

/*
  Mirrorland Window Controller

  Purpose:
  - Use the existing Window button and existing CSS layout.
  - Toggle the visual Window object between closed and open states.
  - Reuse the same button as both "Open the Window" and "Restore the Window".
  - Coordinate only with SHOWROOM_MIRRORLAND_WINDOW_OBJECT.
  - Preserve Diamond, Compass, orbit, star, route, and CSS ownership boundaries.

  Owns:
  - [data-showroom-window-control] click binding
  - [data-showroom-window-label] label text
  - aria-expanded / aria-busy / aria-label on the Window control
  - local data-showroom-window-state values
  - open / restore transition decisions
  - controller-level receipt

  Does not own:
  - stained-glass geometry
  - canvas rendering
  - CSS layout
  - Diamond renderer state
  - Diamond controls
  - Diamond wake behavior
  - orbit gestures
  - Compass
  - star controls
  - route state
*/

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id:
      "SHOWROOM_WINDOW_CONTROLLER_v1_EXISTING_BUTTON_CURTAIN_TOGGLE",

    file:
      "/showroom/index.window.controller.js",

    publicSurface:
      "SHOWROOM_MIRRORLAND_WINDOW_CONTROLLER",

    objectSurface:
      "SHOWROOM_MIRRORLAND_WINDOW_OBJECT",

    requiredObjectContract:
      "SHOWROOM_WINDOW_OBJECT_v1_2_CRISP_3D_COMPOUND_CURTAIN_HOST",

    role:
      "existing-button-curtain-toggle-controller",

    cssOwnership:
      false,

    buttonLayoutOwnership:
      false,

    objectGeometryOwnership:
      false,

    objectCanvasOwnership:
      false,

    diamondOwnership:
      false,

    diamondWakeOwnership:
      false,

    routeOwnership:
      false,

    orbitGestureOwnership:
      false,

    compassOwnership:
      false,

    starOwnership:
      false,

    visualPassClaimed:
      false,

    productionAuthorized:
      false,

    deploymentAuthorized:
      false
  });

  const SELECTORS = Object.freeze({
    threshold:
      "#showroom-window-threshold, [data-showroom-window-threshold]",

    layer:
      "[data-showroom-window-layer], .showroom-window-layer",

    mount:
      "[data-showroom-window-mount], .showroom-window-mount",

    control:
      "[data-showroom-window-control], .showroom-window-control",

    label:
      "[data-showroom-window-label], .showroom-window-control__label",

    canvas:
      "canvas[data-showroom-window-canvas]"
  });

  const EVENTS = Object.freeze({
    READY:
      "SHOWROOM_MIRRORLAND_WINDOW_CONTROLLER_READY",

    STATE_CHANGED:
      "SHOWROOM_MIRRORLAND_WINDOW_CONTROLLER_STATE_CHANGED",

    OPEN_REQUEST:
      "SHOWROOM_MIRRORLAND_WINDOW_CONTROLLER_OPEN_REQUEST",

    RESTORE_REQUEST:
      "SHOWROOM_MIRRORLAND_WINDOW_CONTROLLER_RESTORE_REQUEST",

    FAILURE:
      "SHOWROOM_MIRRORLAND_WINDOW_CONTROLLER_FAILURE",

    DISPOSED:
      "SHOWROOM_MIRRORLAND_WINDOW_CONTROLLER_DISPOSED"
  });

  const OBJECT_EVENTS = Object.freeze({
    READY:
      "SHOWROOM_MIRRORLAND_WINDOW_OBJECT_READY",

    TRANSITION_COMPLETE:
      "SHOWROOM_MIRRORLAND_WINDOW_OBJECT_TRANSITION_COMPLETE",

    FAILURE:
      "SHOWROOM_MIRRORLAND_WINDOW_OBJECT_FAILURE"
  });

  const STATES = Object.freeze({
    WAITING:
      "waiting",

    CLOSED:
      "closed",

    OPENING:
      "opening",

    OPEN:
      "open",

    CLOSING:
      "closing",

    FAILED:
      "failed",

    DISPOSED:
      "disposed"
  });

  const LABELS = Object.freeze({
    closed:
      "Open the Window",

    opening:
      "Restore the Window",

    open:
      "Restore the Window",

    closing:
      "Open the Window",

    waiting:
      "Preparing the Window",

    failed:
      "Window Unavailable",

    disposed:
      "Window Unavailable"
  });

  const ARIA_LABELS = Object.freeze({
    openAction:
      "Open the Mirrorland Window and reveal the rotating Diamond",

    restoreAction:
      "Restore the Mirrorland Window over the rotating Diamond",

    waiting:
      "Preparing the Mirrorland Window",

    failed:
      "Mirrorland Window unavailable",

    disposed:
      "Mirrorland Window unavailable"
  });

  const TIMING = Object.freeze({
    objectReadyTimeoutMs:
      5000,

    openDurationMs:
      980,

    restoreDurationMs:
      760
  });

  const state = {
    threshold:
      null,

    layer:
      null,

    mount:
      null,

    control:
      null,

    label:
      null,

    object:
      null,

    windowState:
      STATES.WAITING,

    initialized:
      false,

    bound:
      false,

    disposed:
      false,

    failed:
      false,

    pendingTransition:
      null,

    objectReadyTimer:
      0
  };

  const receipt = {
    contractId:
      CONTRACT.id,

    file:
      CONTRACT.file,

    publicSurface:
      CONTRACT.publicSurface,

    objectSurface:
      CONTRACT.objectSurface,

    requiredObjectContract:
      CONTRACT.requiredObjectContract,

    status:
      "pending",

    initialized:
      false,

    disposed:
      false,

    failed:
      false,

    currentState:
      STATES.WAITING,

    thresholdPresent:
      false,

    layerPresent:
      false,

    mountPresent:
      false,

    controlPresent:
      false,

    labelPresent:
      false,

    objectPresent:
      false,

    objectReady:
      false,

    ownsCss:
      false,

    ownsButtonLayout:
      false,

    ownsObjectGeometry:
      false,

    ownsObjectCanvas:
      false,

    ownsDiamond:
      false,

    ownsDiamondWake:
      false,

    ownsRoute:
      false,

    ownsOrbitGestures:
      false,

    ownsCompass:
      false,

    ownsStars:
      false,

    visualPassClaimed:
      false,

    productionAuthorized:
      false,

    deploymentAuthorized:
      false,

    lastAction:
      "",

    lastFailure:
      null
  };

  function dispatch(
    type,
    detail = {}
  ) {
    try {
      globalThis.dispatchEvent(
        new CustomEvent(
          type,
          {
            detail:
              Object.freeze({
                contractId:
                  CONTRACT.id,

                file:
                  CONTRACT.file,

                ...detail
              })
          }
        )
      );
    } catch (_) {}
  }

  function getObject() {
    const object =
      globalThis.SHOWROOM_MIRRORLAND_WINDOW_OBJECT;

    if (
      object &&
      typeof object === "object" &&
      typeof object.isReady === "function" &&
      typeof object.showCurtain === "function" &&
      typeof object.hideCurtain === "function" &&
      typeof object.setCurtainAmount === "function" &&
      typeof object.getCurtainAmount === "function"
    ) {
      return object;
    }

    return null;
  }

  function isObjectReady(object) {
    try {
      return Boolean(
        object &&
          typeof object.isReady === "function" &&
          object.isReady()
      );
    } catch (_) {
      return false;
    }
  }

  function updateReceipt(extra = {}) {
    Object.assign(
      receipt,
      {
        status:
          state.disposed
            ? "disposed"
            : state.failed
              ? "failed"
              : state.initialized
                ? "available"
                : "pending",

        initialized:
          state.initialized,

        disposed:
          state.disposed,

        failed:
          state.failed,

        currentState:
          state.windowState,

        thresholdPresent:
          Boolean(state.threshold),

        layerPresent:
          Boolean(state.layer),

        mountPresent:
          Boolean(state.mount),

        controlPresent:
          Boolean(state.control),

        labelPresent:
          Boolean(state.label),

        objectPresent:
          Boolean(state.object),

        objectReady:
          isObjectReady(state.object),

        ownsCss:
          false,

        ownsButtonLayout:
          false,

        ownsObjectGeometry:
          false,

        ownsObjectCanvas:
          false,

        ownsDiamond:
          false,

        ownsDiamondWake:
          false,

        ownsRoute:
          false,

        ownsOrbitGestures:
          false,

        ownsCompass:
          false,

        ownsStars:
          false,

        visualPassClaimed:
          false,

        productionAuthorized:
          false,

        deploymentAuthorized:
          false,

        ...extra
      }
    );

    globalThis.SHOWROOM_MIRRORLAND_WINDOW_CONTROLLER_RECEIPT =
      Object.freeze({
        ...receipt
      });

    if (state.threshold) {
      state.threshold.dataset.showroomWindowControllerStatus =
        receipt.status;

      state.threshold.dataset.showroomWindowControllerContract =
        CONTRACT.id;

      state.threshold.dataset.visualPassClaimed =
        "false";
    }

    if (state.control) {
      state.control.dataset.showroomWindowControllerStatus =
        receipt.status;

      state.control.dataset.showroomWindowControllerContract =
        CONTRACT.id;
    }
  }

  function setLabel(text) {
    if (!state.label) {
      return;
    }

    state.label.textContent =
      String(text);
  }

  function ariaLabelForState(nextState) {
    if (
      nextState === STATES.OPEN ||
      nextState === STATES.OPENING
    ) {
      return ARIA_LABELS.restoreAction;
    }

    if (
      nextState === STATES.WAITING
    ) {
      return ARIA_LABELS.waiting;
    }

    if (
      nextState === STATES.FAILED
    ) {
      return ARIA_LABELS.failed;
    }

    if (
      nextState === STATES.DISPOSED
    ) {
      return ARIA_LABELS.disposed;
    }

    return ARIA_LABELS.openAction;
  }

  function setLocalState(nextState) {
    state.windowState =
      nextState;

    const label =
      LABELS[nextState] ||
      LABELS.closed;

    setLabel(label);

    [
      state.threshold,
      state.layer,
      state.mount,
      state.control
    ].forEach(element => {
      if (element) {
        element.dataset.showroomWindowState =
          nextState;
      }
    });

    if (state.control) {
      state.control.setAttribute(
        "aria-expanded",
        nextState === STATES.OPEN ||
        nextState === STATES.OPENING
          ? "true"
          : "false"
      );

      state.control.setAttribute(
        "aria-busy",
        nextState === STATES.OPENING ||
        nextState === STATES.CLOSING
          ? "true"
          : "false"
      );

      state.control.setAttribute(
        "aria-label",
        ariaLabelForState(nextState)
      );

      state.control.disabled =
        nextState === STATES.WAITING ||
        nextState === STATES.FAILED ||
        nextState === STATES.DISPOSED;
    }

    updateReceipt({
      lastAction:
        "window-controller-state-set",

      lastFailure:
        null
    });

    dispatch(
      EVENTS.STATE_CHANGED,
      {
        state:
          nextState,

        receipt:
          getReceipt()
      }
    );
  }

  function enforcePointerContract() {
    if (state.layer) {
      state.layer.style.pointerEvents =
        "none";
    }

    if (state.mount) {
      state.mount.style.pointerEvents =
        "none";
    }

    if (state.control) {
      state.control.style.pointerEvents =
        "auto";

      state.control.style.touchAction =
        "manipulation";
    }

    if (state.mount) {
      state.mount
        .querySelectorAll(SELECTORS.canvas)
        .forEach(canvas => {
          canvas.style.pointerEvents =
            "none";

          canvas.style.touchAction =
            "none";
        });
    }
  }

  function fail(reason) {
    state.failed =
      true;

    state.pendingTransition =
      null;

    if (state.objectReadyTimer) {
      clearTimeout(state.objectReadyTimer);

      state.objectReadyTimer =
        0;
    }

    setLocalState(STATES.FAILED);

    updateReceipt({
      status:
        "failed",

      lastAction:
        "window-controller-failed",

      lastFailure:
        String(reason || "UNKNOWN_WINDOW_CONTROLLER_FAILURE")
    });

    dispatch(
      EVENTS.FAILURE,
      {
        reason:
          String(reason || "UNKNOWN_WINDOW_CONTROLLER_FAILURE"),

        receipt:
          getReceipt()
      }
    );
  }

  function completeOpen(detail = {}) {
    if (
      state.object &&
      typeof state.object.setCurtainAmount === "function"
    ) {
      state.object.setCurtainAmount(0);
    }

    state.pendingTransition =
      null;

    setLocalState(STATES.OPEN);

    updateReceipt({
      lastAction:
        "window-controller-open-complete",

      curtainAmount:
        typeof detail.curtainAmount === "number"
          ? detail.curtainAmount
          : 0,

      lastFailure:
        null
    });
  }

  function completeClosed(detail = {}) {
    if (
      state.object &&
      typeof state.object.setCurtainAmount === "function"
    ) {
      state.object.setCurtainAmount(1);
    }

    state.pendingTransition =
      null;

    setLocalState(STATES.CLOSED);

    updateReceipt({
      lastAction:
        "window-controller-restore-complete",

      curtainAmount:
        typeof detail.curtainAmount === "number"
          ? detail.curtainAmount
          : 1,

      lastFailure:
        null
    });
  }

  function handleObjectTransitionComplete(event) {
    if (
      state.disposed ||
      state.failed ||
      !state.pendingTransition
    ) {
      return;
    }

    const detail =
      event && event.detail
        ? event.detail
        : {};

    if (state.pendingTransition === "open") {
      completeOpen(detail);
      return;
    }

    if (state.pendingTransition === "closed") {
      completeClosed(detail);
    }
  }

  function requestOpen() {
    if (
      state.disposed ||
      state.failed ||
      !state.object ||
      !isObjectReady(state.object)
    ) {
      return false;
    }

    if (
      state.windowState === STATES.OPEN ||
      state.windowState === STATES.OPENING
    ) {
      return true;
    }

    enforcePointerContract();

    state.pendingTransition =
      "open";

    setLocalState(STATES.OPENING);

    updateReceipt({
      lastAction:
        "window-controller-open-requested",

      lastFailure:
        null
    });

    dispatch(
      EVENTS.OPEN_REQUEST,
      {
        receipt:
          getReceipt()
      }
    );

    const started =
      state.object.hideCurtain({
        duration:
          TIMING.openDurationMs,

        reason:
          "window-controller-open"
      });

    if (!started) {
      state.pendingTransition =
        null;

      fail(
        "SHOWROOM_WINDOW_OBJECT_HIDE_CURTAIN_REJECTED"
      );

      return false;
    }

    return true;
  }

  function requestRestore() {
    if (
      state.disposed ||
      state.failed ||
      !state.object ||
      !isObjectReady(state.object)
    ) {
      return false;
    }

    if (
      state.windowState === STATES.CLOSED ||
      state.windowState === STATES.CLOSING
    ) {
      return true;
    }

    enforcePointerContract();

    state.pendingTransition =
      "closed";

    setLocalState(STATES.CLOSING);

    updateReceipt({
      lastAction:
        "window-controller-restore-requested",

      lastFailure:
        null
    });

    dispatch(
      EVENTS.RESTORE_REQUEST,
      {
        receipt:
          getReceipt()
      }
    );

    const started =
      state.object.showCurtain({
        duration:
          TIMING.restoreDurationMs,

        reason:
          "window-controller-restore"
      });

    if (!started) {
      state.pendingTransition =
        null;

      fail(
        "SHOWROOM_WINDOW_OBJECT_SHOW_CURTAIN_REJECTED"
      );

      return false;
    }

    return true;
  }

  function handleControlClick(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();

      if (typeof event.stopImmediatePropagation === "function") {
        event.stopImmediatePropagation();
      }
    }

    if (
      state.windowState === STATES.WAITING ||
      state.windowState === STATES.FAILED ||
      state.windowState === STATES.DISPOSED ||
      state.windowState === STATES.OPENING ||
      state.windowState === STATES.CLOSING
    ) {
      return;
    }

    if (state.windowState === STATES.OPEN) {
      requestRestore();
      return;
    }

    requestOpen();
  }

  function bindControl() {
    if (
      state.bound ||
      !state.control
    ) {
      return;
    }

    state.control.addEventListener(
      "click",
      handleControlClick
    );

    state.bound =
      true;
  }

  function unbindControl() {
    if (
      !state.bound ||
      !state.control
    ) {
      return;
    }

    state.control.removeEventListener(
      "click",
      handleControlClick
    );

    state.bound =
      false;
  }

  function resolveDom() {
    state.threshold =
      document.querySelector(
        SELECTORS.threshold
      );

    state.layer =
      document.querySelector(
        SELECTORS.layer
      );

    state.mount =
      document.querySelector(
        SELECTORS.mount
      );

    state.control =
      document.querySelector(
        SELECTORS.control
      );

    state.label =
      state.control
        ? state.control.querySelector(
            SELECTORS.label
          )
        : document.querySelector(
            SELECTORS.label
          );

    if (!state.threshold) {
      state.threshold =
        state.layer ||
        state.mount ||
        null;
    }
  }

  function attachObject(object) {
    state.object =
      object;

    enforcePointerContract();

    bindControl();

    if (
      typeof state.object.setCurtainAmount === "function"
    ) {
      state.object.setCurtainAmount(1);
    }

    state.initialized =
      true;

    setLocalState(STATES.CLOSED);

    updateReceipt({
      status:
        "available",

      lastAction:
        "window-controller-ready-existing-button-bound",

      lastFailure:
        null
    });

    dispatch(
      EVENTS.READY,
      {
        receipt:
          getReceipt()
      }
    );
  }

  function handleObjectReady() {
    if (
      state.disposed ||
      state.failed ||
      state.object
    ) {
      return;
    }

    const object =
      getObject();

    if (!isObjectReady(object)) {
      return;
    }

    if (state.objectReadyTimer) {
      clearTimeout(state.objectReadyTimer);

      state.objectReadyTimer =
        0;
    }

    attachObject(object);
  }

  function waitForObject() {
    const object =
      getObject();

    if (isObjectReady(object)) {
      attachObject(object);
      return;
    }

    setLocalState(STATES.WAITING);

    globalThis.addEventListener(
      OBJECT_EVENTS.READY,
      handleObjectReady,
      {
        once:
          true
      }
    );

    state.objectReadyTimer =
      globalThis.setTimeout(
        () => {
          state.objectReadyTimer =
            0;

          if (
            !state.object &&
            !state.disposed &&
            !state.failed
          ) {
            fail(
              "SHOWROOM_WINDOW_OBJECT_READY_TIMEOUT"
            );
          }
        },
        TIMING.objectReadyTimeoutMs
      );
  }

  function handleObjectFailure(event) {
    const detail =
      event && event.detail
        ? event.detail
        : {};

    fail(
      detail.reason ||
      "SHOWROOM_WINDOW_OBJECT_FAILURE"
    );
  }

  function dispose() {
    if (state.disposed) {
      return true;
    }

    if (state.objectReadyTimer) {
      clearTimeout(state.objectReadyTimer);

      state.objectReadyTimer =
        0;
    }

    unbindControl();

    globalThis.removeEventListener(
      OBJECT_EVENTS.READY,
      handleObjectReady
    );

    globalThis.removeEventListener(
      OBJECT_EVENTS.TRANSITION_COMPLETE,
      handleObjectTransitionComplete
    );

    globalThis.removeEventListener(
      OBJECT_EVENTS.FAILURE,
      handleObjectFailure
    );

    state.pendingTransition =
      null;

    state.disposed =
      true;

    state.initialized =
      false;

    setLocalState(STATES.DISPOSED);

    updateReceipt({
      status:
        "disposed",

      initialized:
        false,

      disposed:
        true,

      lastAction:
        "window-controller-disposed",

      lastFailure:
        null
    });

    dispatch(
      EVENTS.DISPOSED,
      {
        receipt:
          getReceipt()
      }
    );

    return true;
  }

  function getReceipt() {
    return Object.freeze({
      ...receipt
    });
  }

  function exposeControllerApi() {
    globalThis.SHOWROOM_MIRRORLAND_WINDOW_CONTROLLER =
      Object.freeze({
        contract:
          CONTRACT,

        events:
          EVENTS,

        states:
          STATES,

        open:
          requestOpen,

        restore:
          requestRestore,

        toggle:
          () => {
            if (state.windowState === STATES.OPEN) {
              return requestRestore();
            }

            if (state.windowState === STATES.CLOSED) {
              return requestOpen();
            }

            return false;
          },

        enforcePointerContract,

        dispose,

        getReceipt,

        getState:
          () => state.windowState,

        isReady:
          () => Boolean(
            state.initialized &&
            !state.failed &&
            !state.disposed &&
            state.object &&
            isObjectReady(state.object)
          )
      });
  }

  function init() {
    try {
      const previous =
        globalThis.SHOWROOM_MIRRORLAND_WINDOW_CONTROLLER;

      if (
        previous &&
        typeof previous.dispose === "function"
      ) {
        try {
          previous.dispose();
        } catch (_) {}
      }

      exposeControllerApi();

      resolveDom();

      if (!state.mount) {
        throw new Error(
          "SHOWROOM_WINDOW_MOUNT_NOT_FOUND"
        );
      }

      if (!state.control) {
        throw new Error(
          "SHOWROOM_WINDOW_CONTROL_NOT_FOUND"
        );
      }

      enforcePointerContract();

      globalThis.addEventListener(
        OBJECT_EVENTS.TRANSITION_COMPLETE,
        handleObjectTransitionComplete
      );

      globalThis.addEventListener(
        OBJECT_EVENTS.FAILURE,
        handleObjectFailure
      );

      waitForObject();

      updateReceipt({
        lastAction:
          "window-controller-initialized-waiting-for-object",

        lastFailure:
          null
      });
    } catch (error) {
      exposeControllerApi();

      fail(
        error && error.message
          ? error.message
          : String(error)
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once:
          true
      }
    );
  } else {
    init();
  }
})();

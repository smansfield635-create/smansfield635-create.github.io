// /assets/house-control-pad/house.control-pad.js
// HOUSE_CONTROL_PAD_HEART_ESTATE_RUNTIME_TNT_v4_1
// Full-file replacement.
//
// Renewal boundary:
// - Preserve HOUSE_CONTROL_PAD_HEART_ESTATE_RUNTIME_TNT_v4 architecture.
// - Restrict public routing to admitted canonical room/avatar targets.
// - Make close completion execute exactly once.
// - Preserve all other contracts, selectors, events, data boundaries,
//   lifecycle behavior, CSS handshake, fallback behavior, and ownership.
//
// Purpose:
// - Create one shared, dynamically mounted House Control Pad overlay.
// - Consume canonical estate data from window.HOUSE_CONTROL_PAD_DATA.
// - Render a heart-estate SVG, room controls, avatar controls, and corridors.
// - Allow many page-level doors to open the same shared controller.
// - Route outward to canonical destination routes.
// - Preserve each door's native href unless the overlay opens successfully.
// - Provide complete lifecycle, accessibility, observability, cleanup, and
//   duplicate-authority protection.
//
// Owns:
// - controller lifecycle
// - generated overlay DOM
// - external-data validation
// - nonmutating runtime view model
// - SVG and marker rendering
// - room/avatar selection
// - canonical route requests
// - focus custody
// - listener custody
// - scroll/background custody
// - runtime events
// - runtime status markers
//
// Does not own:
// - canonical estate data
// - canonical route truth
// - Manor Blueprint authority
// - CSS presentation
// - host-page markup
// - room interiors
// - map-level Avatar Life
// - resident-transfer runtime
// - camera travel or arrival systems
// - diagnostics
// - Jeeves or API/North reasoning
// - planet runtime
//
// Dependencies:
// - window.HOUSE_CONTROL_PAD_DATA
// - /assets/house-control-pad/house.control-pad.css
// - host-page doors using [data-house-control-pad-open]
//
// Public global:
// - window.HOUSE_CONTROL_PAD
//
// Primary events:
// - house:control-pad-initializing
// - house:control-pad-ready
// - house:control-pad-degraded
// - house:control-pad-hold
// - house:control-pad-error
// - house:control-pad-open-request
// - house:control-pad-open
// - house:control-pad-close-request
// - house:control-pad-close
// - house:control-pad-select
// - house:control-pad-route-request
// - house:control-pad-route-commit
// - house:control-pad-data-refreshed
// - house:control-pad-rebound
// - house:control-pad-authority-conflict
// - house:control-pad-destroy
// - house:control-pad-receipt
//
// Failure behavior:
// - Never overwrite a different controller authority.
// - Never invent canonical rooms, avatars, routes, geometry, or labels.
// - Never accept an arbitrary route through the public routing API.
// - Never intercept a native door unless opening succeeds synchronously.
// - Hold invalid items individually when the remaining estate is usable.
// - Preserve the last valid runtime model when a refresh fails.
// - Complete close exactly once.
// - Restore focus, scroll, inert state, listeners, observers, and timers.
// - Withhold final completion claims until live CCR / OPS verification.
//
(function houseControlPadRuntime(global, document) {
  "use strict";

  if (!global || !document) {
    return;
  }

  const CONTRACT = "HOUSE_CONTROL_PAD_HEART_ESTATE_RUNTIME_TNT_v4_1";
  const CONTROLLER_FAMILY = "HOUSE_CONTROL_PAD_RUNTIME_AUTHORITY";
  const PUBLIC_GLOBAL = "HOUSE_CONTROL_PAD";
  const STATUS_GLOBAL = "__HOUSE_CONTROL_PAD_STATUS__";
  const DATA_GLOBAL = "HOUSE_CONTROL_PAD_DATA";
  const SVG_NS = "http://www.w3.org/2000/svg";

  const SELECTORS = Object.freeze({
    door: "[data-house-control-pad-open]",
    root: "[data-house-control-pad]",
    dialog: "[data-house-dialog]",
    backdrop: "[data-house-backdrop]",
    close: "[data-house-close]",
    status: "[data-house-status]",
    estate: "[data-house-estate]",
    svg: "[data-house-svg]",
    markers: "[data-house-markers]",
    details: "[data-house-details]",
    route: "[data-house-route]",
    selectable: "[data-house-select]",
    room: "[data-house-room]",
    avatar: "[data-house-avatar]",
    corridor: "[data-house-corridor]"
  });

  const EVENTS = Object.freeze({
    initializing: "house:control-pad-initializing",
    ready: "house:control-pad-ready",
    degraded: "house:control-pad-degraded",
    hold: "house:control-pad-hold",
    error: "house:control-pad-error",
    openRequest: "house:control-pad-open-request",
    open: "house:control-pad-open",
    closeRequest: "house:control-pad-close-request",
    close: "house:control-pad-close",
    select: "house:control-pad-select",
    routeRequest: "house:control-pad-route-request",
    routeCommit: "house:control-pad-route-commit",
    dataRefreshed: "house:control-pad-data-refreshed",
    rebound: "house:control-pad-rebound",
    authorityConflict: "house:control-pad-authority-conflict",
    destroy: "house:control-pad-destroy",
    receipt: "house:control-pad-receipt",
    state: "house:control-pad-state"
  });

  const STATES = Object.freeze({
    uninitialized: "uninitialized",
    initializing: "initializing",
    ready: "ready",
    opening: "opening",
    open: "open",
    routing: "routing",
    closing: "closing",
    closed: "closed",
    degraded: "degraded",
    held: "held",
    failed: "failed",
    destroyed: "destroyed",
    authorityConflict: "authority-conflict"
  });

  const ITEM_STATES = Object.freeze({
    valid: "valid",
    held: "held",
    invalid: "invalid"
  });

  const DEFAULTS = Object.freeze({
    autoBoot: true,
    observeDynamicDoors: false,
    allowBackdropClose: true,
    preserveSelectionOnClose: true,
    selectBeforeRoute: true,
    cssContractProperty: "--house-control-pad-css-contract",
    closeTransitionTimeoutMs: 360,
    maxTextLength: 2000,
    maxItemsPerFamily: 512,
    maxPathLength: 12000,
    maxPolygonPoints: 2048,
    maxPolylinePoints: 4096,
    maxWarnings: 256,
    maxErrors: 256,
    allowExternalRoutes: false,
    debug: false
  });

  const ALLOWED_TRANSITIONS = Object.freeze({
    [STATES.uninitialized]: new Set([
      STATES.initializing,
      STATES.destroyed,
      STATES.authorityConflict
    ]),
    [STATES.initializing]: new Set([
      STATES.ready,
      STATES.degraded,
      STATES.held,
      STATES.failed,
      STATES.destroyed,
      STATES.authorityConflict
    ]),
    [STATES.ready]: new Set([
      STATES.opening,
      STATES.initializing,
      STATES.destroyed,
      STATES.authorityConflict,
      STATES.degraded,
      STATES.held
    ]),
    [STATES.opening]: new Set([
      STATES.open,
      STATES.ready,
      STATES.degraded,
      STATES.held,
      STATES.failed,
      STATES.destroyed
    ]),
    [STATES.open]: new Set([
      STATES.routing,
      STATES.closing,
      STATES.initializing,
      STATES.destroyed,
      STATES.authorityConflict,
      STATES.degraded
    ]),
    [STATES.routing]: new Set([
      STATES.open,
      STATES.closing,
      STATES.destroyed,
      STATES.failed
    ]),
    [STATES.closing]: new Set([
      STATES.closed,
      STATES.destroyed,
      STATES.failed
    ]),
    [STATES.closed]: new Set([
      STATES.opening,
      STATES.initializing,
      STATES.destroyed,
      STATES.authorityConflict,
      STATES.degraded,
      STATES.held
    ]),
    [STATES.degraded]: new Set([
      STATES.initializing,
      STATES.opening,
      STATES.destroyed,
      STATES.authorityConflict,
      STATES.held,
      STATES.failed
    ]),
    [STATES.held]: new Set([
      STATES.initializing,
      STATES.destroyed,
      STATES.authorityConflict,
      STATES.failed
    ]),
    [STATES.failed]: new Set([
      STATES.initializing,
      STATES.destroyed,
      STATES.authorityConflict
    ]),
    [STATES.authorityConflict]: new Set([
      STATES.destroyed
    ]),
    [STATES.destroyed]: new Set()
  });

  const existingController = global[PUBLIC_GLOBAL];

  if (
    existingController &&
    !isCompatibleController(existingController)
  ) {
    const conflictSnapshot = Object.freeze({
      contract: CONTRACT,
      family: CONTROLLER_FAMILY,
      state: STATES.authorityConflict,
      initialized: false,
      ready: false,
      mounted: false,
      open: false,
      destroyed: false,
      authorityConflict: true,
      finalReceiptAvailable: false,
      reason: "A different controller already owns window.HOUSE_CONTROL_PAD.",
      lastUpdatedAt: nowIso()
    });

    safeDefineStatusGlobal(conflictSnapshot);

    dispatchDocumentEvent(EVENTS.authorityConflict, {
      contract: CONTRACT,
      state: STATES.authorityConflict,
      previousState: "",
      reason: conflictSnapshot.reason,
      timestamp: nowIso()
    });

    return;
  }

  if (existingController && isCompatibleController(existingController)) {
    try {
      existingController.rebind({
        reason: "duplicate-compatible-script-load"
      });
    } catch (error) {
      dispatchDocumentEvent(EVENTS.error, {
        contract: CONTRACT,
        state: existingController.getStatus
          ? existingController.getStatus().state
          : "",
        reason: "Compatible controller rebind failed.",
        error: normalizeError(error),
        timestamp: nowIso()
      });
    }

    return;
  }

  const state = {
    contract: CONTRACT,
    family: CONTROLLER_FAMILY,
    version: "4.1",
    lifecycleState: STATES.uninitialized,
    previousState: "",
    initialized: false,
    ready: false,
    mounted: false,
    open: false,
    destroyed: false,
    authorityConflict: false,
    dataState: "unverified",
    styleState: "unverified",
    activeContext: "",
    activeDoor: null,
    returnFocusTarget: null,
    selectedType: "",
    selectedId: "",
    root: null,
    dialog: null,
    backdrop: null,
    closeButton: null,
    statusNode: null,
    estateNode: null,
    svg: null,
    markersLayer: null,
    detailsPanel: null,
    validData: null,
    lastValidData: null,
    heldItems: [],
    warnings: [],
    errors: [],
    listeners: [],
    observers: [],
    timers: new Set(),
    backgroundRecords: [],
    doorCount: 0,
    openCount: 0,
    closeCount: 0,
    routeRequestCount: 0,
    lastRouteRequest: null,
    options: { ...DEFAULTS },
    initializedAt: "",
    openedAt: "",
    closedAt: "",
    destroyedAt: "",
    lastUpdatedAt: nowIso(),
    mutationObserver: null,
    reducedMotionQuery: null
  };

  const controller = Object.freeze({
    __houseControlPadController: true,
    __houseControlPadFamily: CONTROLLER_FAMILY,
    __houseControlPadContract: CONTRACT,
    init,
    open,
    close,
    toggle,
    rebind,
    refreshData,
    routeTo,
    getStatus,
    getSnapshot,
    destroy
  });

  Object.defineProperty(global, PUBLIC_GLOBAL, {
    configurable: true,
    enumerable: true,
    writable: false,
    value: controller
  });

  publishStatus();

  if (DEFAULTS.autoBoot) {
    autoBoot();
  }

  function init(options) {
    if (state.destroyed) {
      return result(false, STATES.destroyed, "Controller has been destroyed.");
    }

    if (global[PUBLIC_GLOBAL] !== controller) {
      return enterAuthorityConflict(
        "window.HOUSE_CONTROL_PAD no longer points to this controller."
      );
    }

    mergeOptions(options);

    if (
      state.lifecycleState === STATES.initializing ||
      state.lifecycleState === STATES.opening ||
      state.lifecycleState === STATES.closing
    ) {
      return result(
        false,
        state.lifecycleState,
        "Controller is already transitioning."
      );
    }

    transitionTo(STATES.initializing, "init");

    state.warnings = [];
    state.errors = [];
    state.heldItems = [];

    dispatch(EVENTS.initializing, {
      reason: "init"
    });

    const validation = validateData(global[DATA_GLOBAL]);

    if (!validation.ok) {
      state.dataState = "held";
      state.validData = state.lastValidData;

      if (state.validData) {
        addWarning(
          "The current external data failed validation; the last valid model remains preserved."
        );

        ensureRoot();
        renderEstate(state.validData);
        bindRuntime();
        detectCssContract();
        finalizeInitialization(true);

        return result(
          true,
          state.lifecycleState,
          "Last valid data model preserved after refresh failure.",
          {
            heldItems: clonePlain(state.heldItems)
          }
        );
      }

      addError(validation.reason || "Canonical House data is unavailable.");
      state.initialized = true;
      state.ready = false;
      state.mounted = false;

      transitionTo(STATES.held, "data-unavailable");
      publishStatus();

      dispatch(EVENTS.hold, {
        reason: validation.reason || "Canonical House data is unavailable."
      });

      return result(
        false,
        STATES.held,
        validation.reason || "Canonical House data is unavailable."
      );
    }

    state.validData = validation.model;
    state.lastValidData = validation.model;
    state.dataState = validation.heldItems.length
      ? "partial"
      : "valid";
    state.heldItems = validation.heldItems.slice();
    state.warnings.push(...validation.warnings);

    const rootResult = ensureRoot();

    if (!rootResult.ok) {
      addError(rootResult.reason);
      state.initialized = true;
      state.ready = false;

      transitionTo(STATES.failed, "dom-construction-failure");
      publishStatus();

      dispatch(EVENTS.error, {
        reason: rootResult.reason
      });

      return rootResult;
    }

    renderEstate(state.validData);
    bindRuntime();
    detectCssContract();
    finalizeInitialization(false);

    return result(
      state.ready,
      state.lifecycleState,
      state.ready
        ? "House Control Pad initialized."
        : "House Control Pad initialized below full ready state.",
      {
        heldItems: clonePlain(state.heldItems)
      }
    );
  }

  function finalizeInitialization(preservedModel) {
    state.initialized = true;
    state.initializedAt = state.initializedAt || nowIso();
    state.mounted = Boolean(state.root && state.root.isConnected);
    state.doorCount = document.querySelectorAll(SELECTORS.door).length;

    const hasMinimumModel = Boolean(
      state.validData &&
      state.validData.estate &&
      state.validData.viewBox &&
      (
        state.validData.rooms.length > 0 ||
        state.validData.avatars.length > 0
      )
    );

    if (!hasMinimumModel) {
      state.ready = false;

      transitionTo(STATES.held, "minimum-model-unavailable");

      updateStatusMessage(
        "The House map is held because no valid navigable rooms or avatars are available."
      );

      dispatch(EVENTS.hold, {
        reason: "No valid navigable rooms or avatars are available."
      });

      publishStatus();
      return;
    }

    if (state.styleState !== "loaded") {
      state.ready = false;

      transitionTo(STATES.degraded, "css-contract-unverified");

      updateStatusMessage(
        "The House map runtime is present, but its CSS contract is not verified."
      );

      dispatch(EVENTS.degraded, {
        reason: "CSS contract is not verified."
      });

      publishStatus();
      return;
    }

    state.ready = true;

    transitionTo(
      STATES.ready,
      preservedModel
        ? "preserved-valid-model"
        : "initialization-complete"
    );

    updateStatusMessage(
      state.heldItems.length
        ? `${state.heldItems.length} item${state.heldItems.length === 1 ? "" : "s"} held; valid destinations remain available.`
        : "House map ready."
    );

    dispatch(EVENTS.ready, {
      reason: preservedModel
        ? "preserved-valid-model"
        : "initialization-complete"
    });

    dispatch(EVENTS.receipt, {
      reason: "runtime-ready-contribution",
      receipt: {
        id: "HOUSE_CONTROL_PAD_RUNTIME_READY_RECEIPT",
        contract: CONTRACT,
        runtimeReady: true,
        finalReceiptAvailable: false,
        liveSystemCompletionProven: false
      }
    });

    publishStatus();
  }

  function open(request) {
    if (state.destroyed) {
      return result(false, STATES.destroyed, "Controller has been destroyed.");
    }

    if (global[PUBLIC_GLOBAL] !== controller) {
      return enterAuthorityConflict(
        "Primary controller authority changed before opening."
      );
    }

    if (!state.initialized) {
      const initResult = init();

      if (!initResult.ok) {
        return initResult;
      }
    }

    if (state.open) {
      applyOpenRequest(request);

      return result(
        true,
        STATES.open,
        "House Control Pad is already open."
      );
    }

    if (
      state.lifecycleState !== STATES.ready &&
      state.lifecycleState !== STATES.closed
    ) {
      return result(
        false,
        state.lifecycleState,
        `House Control Pad cannot open from state "${state.lifecycleState}".`
      );
    }

    if (
      !state.root ||
      !state.dialog ||
      !state.validData ||
      state.styleState !== "loaded"
    ) {
      return result(
        false,
        STATES.held,
        "The House Control Pad cannot open because required runtime conditions are not proven."
      );
    }

    const normalizedRequest = normalizeOpenRequest(request);

    const openRequestEvent = dispatch(
      EVENTS.openRequest,
      {
        reason: "open-request",
        context: normalizedRequest.context,
        targetType: normalizedRequest.initialType,
        targetId: normalizedRequest.initialId
      },
      {
        cancelable: true
      }
    );

    if (openRequestEvent.defaultPrevented) {
      return result(
        false,
        state.lifecycleState,
        "Open request was canceled."
      );
    }

    state.activeDoor = normalizedRequest.door || null;
    state.activeContext = normalizedRequest.context || "";
    state.returnFocusTarget = resolveReturnFocusTarget(
      normalizedRequest.door
    );

    transitionTo(STATES.opening, "open");

    try {
      state.root.hidden = false;
      state.root.setAttribute("aria-hidden", "false");
      state.root.dataset.houseOpen = "true";
      state.root.dataset.houseContext = state.activeContext;
      state.open = true;

      applyBackgroundCustody();
      lockDocumentScroll();
      applyOpenRequest(normalizedRequest);

      transitionTo(STATES.open, "open-complete");

      state.openCount += 1;
      state.openedAt = nowIso();

      focusInitialElement();

      dispatch(EVENTS.open, {
        reason: "open-complete",
        context: state.activeContext,
        targetType: state.selectedType,
        targetId: state.selectedId
      });

      publishStatus();

      return result(
        true,
        STATES.open,
        "House Control Pad opened."
      );
    } catch (error) {
      restoreBackgroundCustody();
      unlockDocumentScroll();

      state.open = false;

      if (state.root) {
        state.root.hidden = true;
        state.root.setAttribute("aria-hidden", "true");
        state.root.dataset.houseOpen = "false";
      }

      addError(`Open failed: ${normalizeError(error).message}`);

      transitionTo(STATES.ready, "open-failed");

      dispatch(EVENTS.error, {
        reason: "open-failed",
        error: normalizeError(error)
      });

      publishStatus();

      return result(
        false,
        STATES.ready,
        "House Control Pad could not open safely.",
        {
          error: normalizeError(error)
        }
      );
    }
  }

  function close(reason) {
    if (state.destroyed) {
      return result(false, STATES.destroyed, "Controller has been destroyed.");
    }

    if (!state.open) {
      return result(
        true,
        state.lifecycleState,
        "House Control Pad is already closed."
      );
    }

    const closeReason = safeString(reason, 240) || "close-request";

    const closeRequestEvent = dispatch(
      EVENTS.closeRequest,
      {
        reason: closeReason
      },
      {
        cancelable: true
      }
    );

    if (closeRequestEvent.defaultPrevented) {
      return result(
        false,
        STATES.open,
        "Close request was canceled."
      );
    }

    transitionTo(STATES.closing, closeReason);

    state.open = false;

    if (state.root) {
      state.root.dataset.houseOpen = "false";
    }

    restoreBackgroundCustody();
    unlockDocumentScroll();

    let completed = false;
    let closeTimeoutId = null;
    const transitionTarget = state.dialog || state.root;

    const removeCloseTransitionListener = () => {
      if (!transitionTarget) {
        return;
      }

      removeManagedListener(
        transitionTarget,
        "transitionend",
        onTransitionEnd
      );
    };

    const clearCloseTimeout = () => {
      if (closeTimeoutId === null) {
        return;
      }

      global.clearTimeout(closeTimeoutId);
      state.timers.delete(closeTimeoutId);
      closeTimeoutId = null;
    };

    const completeClose = () => {
      if (completed || state.destroyed) {
        return;
      }

      completed = true;

      clearCloseTimeout();
      removeCloseTransitionListener();

      if (state.root) {
        state.root.hidden = true;
        state.root.setAttribute("aria-hidden", "true");
      }

      if (!state.options.preserveSelectionOnClose) {
        clearSelection();
      }

      transitionTo(STATES.closed, closeReason);

      state.closeCount += 1;
      state.closedAt = nowIso();

      restoreFocus();

      dispatch(EVENTS.close, {
        reason: closeReason
      });

      publishStatus();
    };

    function onTransitionEnd(event) {
      if (
        completed ||
        (
          event.target !== state.dialog &&
          event.target !== state.root
        )
      ) {
        return;
      }

      completeClose();
    }

    if (prefersReducedMotion()) {
      completeClose();
    } else {
      if (transitionTarget) {
        addManagedListener(
          transitionTarget,
          "transitionend",
          onTransitionEnd
        );
      }

      closeTimeoutId = global.setTimeout(
        completeClose,
        state.options.closeTransitionTimeoutMs
      );

      state.timers.add(closeTimeoutId);
    }

    return result(
      true,
      STATES.closing,
      "House Control Pad is closing."
    );
  }

  function toggle(request) {
    return state.open
      ? close("toggle")
      : open(request);
  }

  function rebind(options) {
    if (state.destroyed) {
      return result(false, STATES.destroyed, "Controller has been destroyed.");
    }

    if (global[PUBLIC_GLOBAL] !== controller) {
      return enterAuthorityConflict(
        "Primary controller authority changed before rebind."
      );
    }

    mergeOptions(options);

    state.doorCount = document.querySelectorAll(SELECTORS.door).length;

    detectCssContract();

    if (
      state.initialized &&
      state.validData &&
      state.root &&
      state.root.isConnected
    ) {
      renderEstate(state.validData);
    }

    configureMutationObserver();

    dispatch(EVENTS.rebound, {
      reason: safeString(options && options.reason, 240) || "manual-rebind"
    });

    publishStatus();

    return result(
      true,
      state.lifecycleState,
      "House Control Pad rebound.",
      {
        doorCount: state.doorCount
      }
    );
  }

  function refreshData() {
    if (state.destroyed) {
      return result(false, STATES.destroyed, "Controller has been destroyed.");
    }

    const validation = validateData(global[DATA_GLOBAL]);

    if (!validation.ok) {
      addWarning(
        validation.reason ||
        "External data refresh failed; the last valid model remains active."
      );

      if (state.lastValidData) {
        state.validData = state.lastValidData;
        state.dataState = "preserved-last-valid";

        dispatch(EVENTS.hold, {
          reason:
            validation.reason ||
            "External data refresh failed; last valid model preserved."
        });

        publishStatus();

        return result(
          false,
          state.lifecycleState,
          "Data refresh failed; last valid model preserved."
        );
      }

      state.dataState = "held";
      state.ready = false;

      transitionTo(STATES.held, "data-refresh-failed");

      dispatch(EVENTS.hold, {
        reason: validation.reason || "Data refresh failed."
      });

      publishStatus();

      return result(
        false,
        STATES.held,
        validation.reason || "Data refresh failed."
      );
    }

    const previousSelection = {
      type: state.selectedType,
      id: state.selectedId
    };

    state.validData = validation.model;
    state.lastValidData = validation.model;
    state.dataState = validation.heldItems.length
      ? "partial"
      : "valid";
    state.heldItems = validation.heldItems.slice();
    state.warnings.push(...validation.warnings);

    if (!state.root) {
      const rootResult = ensureRoot();

      if (!rootResult.ok) {
        return rootResult;
      }

      bindRuntime();
    }

    renderEstate(state.validData);

    if (
      previousSelection.type &&
      previousSelection.id &&
      findTarget(previousSelection.type, previousSelection.id)
    ) {
      selectTarget(
        previousSelection.type,
        previousSelection.id,
        {
          focus: false,
          announce: false
        }
      );
    } else {
      clearSelection();
    }

    detectCssContract();

    state.ready = state.styleState === "loaded";

    if (state.ready) {
      transitionTo(
        state.open ? STATES.open : STATES.ready,
        "data-refreshed"
      );
    } else {
      transitionTo(
        STATES.degraded,
        "data-refreshed-css-unverified"
      );
    }

    dispatch(EVENTS.dataRefreshed, {
      reason: "data-refreshed"
    });

    publishStatus();

    return result(
      true,
      state.lifecycleState,
      "House Control Pad data refreshed.",
      {
        heldItems: clonePlain(state.heldItems)
      }
    );
  }

  function routeTo(targetRequest) {
    if (state.destroyed) {
      return result(false, STATES.destroyed, "Controller has been destroyed.");
    }

    const normalized = normalizeCanonicalRouteTarget(targetRequest);

    if (!normalized.ok) {
      updateStatusMessage(normalized.reason);

      dispatch(EVENTS.hold, {
        reason: normalized.reason,
        targetType: normalized.targetType || "",
        targetId: normalized.targetId || ""
      });

      return normalized;
    }

    const routeValidation = validateRoute(
      normalized.route,
      normalized.allowExternal === true
    );

    if (!routeValidation.ok) {
      updateStatusMessage(routeValidation.reason);

      dispatch(EVENTS.hold, {
        reason: routeValidation.reason,
        targetType: normalized.targetType,
        targetId: normalized.targetId,
        route: normalized.route
      });

      return routeValidation;
    }

    const previousState = state.lifecycleState;

    if (state.open) {
      transitionTo(STATES.routing, "route-request");
    }

    const event = dispatch(
      EVENTS.routeRequest,
      {
        reason: "route-request",
        targetType: normalized.targetType,
        targetId: normalized.targetId,
        route: routeValidation.route
      },
      {
        cancelable: true
      }
    );

    if (event.defaultPrevented) {
      if (state.lifecycleState === STATES.routing) {
        transitionTo(STATES.open, "route-canceled");
      }

      updateStatusMessage("Navigation request canceled.");
      publishStatus();

      return result(
        false,
        state.lifecycleState,
        "Route request was canceled.",
        {
          targetId: normalized.targetId,
          route: routeValidation.route
        }
      );
    }

    state.routeRequestCount += 1;

    state.lastRouteRequest = Object.freeze({
      targetType: normalized.targetType,
      targetId: normalized.targetId,
      route: routeValidation.route,
      requestedAt: nowIso()
    });

    dispatch(EVENTS.routeCommit, {
      reason: "route-commit",
      targetType: normalized.targetType,
      targetId: normalized.targetId,
      route: routeValidation.route
    });

    publishStatus();

    try {
      global.location.assign(routeValidation.route);

      return result(
        true,
        STATES.routing,
        "Navigation committed.",
        {
          targetId: normalized.targetId,
          route: routeValidation.route
        }
      );
    } catch (error) {
      if (previousState === STATES.open || state.open) {
        transitionTo(STATES.open, "route-failed");
      }

      addError(`Route commit failed: ${normalizeError(error).message}`);

      dispatch(EVENTS.error, {
        reason: "route-commit-failed",
        targetType: normalized.targetType,
        targetId: normalized.targetId,
        route: routeValidation.route,
        error: normalizeError(error)
      });

      publishStatus();

      return result(
        false,
        state.lifecycleState,
        "Navigation could not be committed.",
        {
          error: normalizeError(error),
          targetId: normalized.targetId,
          route: routeValidation.route
        }
      );
    }
  }

  function getStatus() {
    return Object.freeze(buildStatusSnapshot());
  }

  function getSnapshot() {
    return deepFreeze(
      clonePlain({
        status: buildStatusSnapshot(),
        state: {
          lifecycleState: state.lifecycleState,
          previousState: state.previousState,
          activeContext: state.activeContext,
          selectedType: state.selectedType,
          selectedId: state.selectedId,
          heldItems: state.heldItems,
          warnings: state.warnings,
          errors: state.errors,
          openCount: state.openCount,
          closeCount: state.closeCount,
          routeRequestCount: state.routeRequestCount,
          lastRouteRequest: state.lastRouteRequest,
          initializedAt: state.initializedAt,
          openedAt: state.openedAt,
          closedAt: state.closedAt,
          destroyedAt: state.destroyedAt
        },
        data: state.validData
          ? {
              contract: state.validData.contract,
              version: state.validData.version,
              estate: state.validData.estate,
              viewBox: state.validData.viewBox,
              roomCount: state.validData.rooms.length,
              avatarCount: state.validData.avatars.length,
              corridorCount: state.validData.corridors.length,
              labelCount: state.validData.labels.length
            }
          : null
      })
    );
  }

  function destroy(reason) {
    if (state.destroyed) {
      return result(
        true,
        STATES.destroyed,
        "Controller is already destroyed."
      );
    }

    const destroyReason = safeString(reason, 240) || "destroy";

    if (state.open) {
      forceCloseForDestroy();
    }

    removeAllManagedListeners();
    disconnectAllObservers();
    clearAllTimers();
    restoreBackgroundCustody();
    unlockDocumentScroll();

    if (state.root && state.root.parentNode) {
      state.root.parentNode.removeChild(state.root);
    }

    state.root = null;
    state.dialog = null;
    state.backdrop = null;
    state.closeButton = null;
    state.statusNode = null;
    state.estateNode = null;
    state.svg = null;
    state.markersLayer = null;
    state.detailsPanel = null;
    state.activeDoor = null;
    state.returnFocusTarget = null;
    state.open = false;
    state.ready = false;
    state.mounted = false;
    state.initialized = false;
    state.destroyed = true;
    state.destroyedAt = nowIso();

    transitionTo(
      STATES.destroyed,
      destroyReason,
      {
        force: true
      }
    );

    dispatch(EVENTS.destroy, {
      reason: destroyReason
    });

    publishStatus();

    if (global[PUBLIC_GLOBAL] === controller) {
      try {
        delete global[PUBLIC_GLOBAL];
      } catch (_error) {
        try {
          Object.defineProperty(global, PUBLIC_GLOBAL, {
            configurable: true,
            enumerable: true,
            writable: true,
            value: undefined
          });
        } catch (_secondaryError) {
          // Internal cleanup has already completed.
        }
      }
    }

    return result(
      true,
      STATES.destroyed,
      "House Control Pad destroyed."
    );
  }

  function validateData(rawData) {
    const heldItems = [];
    const warnings = [];

    if (!isPlainObject(rawData)) {
      return {
        ok: false,
        reason:
          "window.HOUSE_CONTROL_PAD_DATA must be a non-null object."
      };
    }

    const contract = safeString(rawData.contract, 240);
    const version = normalizeVersion(rawData.version);

    if (!contract) {
      return {
        ok: false,
        reason:
          "HOUSE_CONTROL_PAD_DATA.contract is required."
      };
    }

    if (!version) {
      return {
        ok: false,
        reason:
          "HOUSE_CONTROL_PAD_DATA.version is required."
      };
    }

    if (!isPlainObject(rawData.estate)) {
      return {
        ok: false,
        reason:
          "HOUSE_CONTROL_PAD_DATA.estate must be an object."
      };
    }

    const estateId = safeIdentifier(rawData.estate.id);

    if (!estateId) {
      return {
        ok: false,
        reason:
          "HOUSE_CONTROL_PAD_DATA.estate.id is required."
      };
    }

    const estateLabel = safeString(
      rawData.estate.label,
      state.options.maxTextLength
    );

    if (!estateLabel) {
      return {
        ok: false,
        reason:
          "HOUSE_CONTROL_PAD_DATA.estate.label is required."
      };
    }

    const viewBoxValidation = validateViewBox(
      rawData.estate.viewBox
    );

    if (!viewBoxValidation.ok) {
      return viewBoxValidation;
    }

    const rooms = validateRooms(
      Array.isArray(rawData.rooms)
        ? rawData.rooms
        : [],
      viewBoxValidation.viewBox,
      heldItems,
      warnings
    );

    const avatars = validateAvatars(
      Array.isArray(rawData.avatars)
        ? rawData.avatars
        : [],
      viewBoxValidation.viewBox,
      heldItems,
      warnings
    );

    const roomIndex = new Map(
      rooms.map((room) => [room.id, room])
    );

    const avatarIndex = new Map(
      avatars.map((avatar) => [avatar.id, avatar])
    );

    const corridors = validateCorridors(
      Array.isArray(rawData.corridors)
        ? rawData.corridors
        : [],
      roomIndex,
      avatarIndex,
      viewBoxValidation.viewBox,
      heldItems,
      warnings
    );

    const labels = validateLabels(
      Array.isArray(rawData.labels)
        ? rawData.labels
        : [],
      heldItems
    );

    if (
      rooms.length === 0 &&
      avatars.length === 0
    ) {
      return {
        ok: false,
        reason:
          "The canonical data contains no valid navigable rooms or avatars."
      };
    }

    const model = deepFreeze({
      contract,
      version,
      estate: {
        id: estateId,
        label: estateLabel,
        description: safeString(
          rawData.estate.description,
          state.options.maxTextLength
        ),
        eyebrow: safeString(
          rawData.estate.eyebrow,
          240
        )
      },
      viewBox: viewBoxValidation.viewBox,
      rooms,
      avatars,
      corridors,
      labels,
      roomIndex,
      avatarIndex,
      settings: validateSettings(rawData.settings)
    });

    return {
      ok: true,
      model,
      heldItems,
      warnings
    };
  }

  function validateViewBox(rawViewBox) {
    if (!isPlainObject(rawViewBox)) {
      return {
        ok: false,
        reason:
          "The estate viewBox must be an object."
      };
    }

    const minX = finiteNumber(rawViewBox.minX);
    const minY = finiteNumber(rawViewBox.minY);
    const width = finiteNumber(rawViewBox.width);
    const height = finiteNumber(rawViewBox.height);

    if (
      minX === null ||
      minY === null ||
      width === null ||
      height === null
    ) {
      return {
        ok: false,
        reason:
          "The estate viewBox requires finite minX, minY, width, and height values."
      };
    }

    if (width <= 0) {
      return {
        ok: false,
        reason:
          "The estate viewBox width must be greater than zero."
      };
    }

    if (height <= 0) {
      return {
        ok: false,
        reason:
          "The estate viewBox height must be greater than zero."
      };
    }

    if (
      Math.abs(minX) > 1e9 ||
      Math.abs(minY) > 1e9 ||
      width > 1e9 ||
      height > 1e9
    ) {
      return {
        ok: false,
        reason:
          "The estate viewBox exceeds safe render limits."
      };
    }

    return {
      ok: true,
      viewBox: Object.freeze({
        minX,
        minY,
        width,
        height
      })
    };
  }

  function validateRooms(rawRooms, viewBox, heldItems, warnings) {
    const rooms = [];
    const seen = new Set();
    const limit = Math.min(
      rawRooms.length,
      state.options.maxItemsPerFamily
    );

    if (rawRooms.length > limit) {
      warnings.push(
        `Room input exceeded the safety limit of ${limit}; excess entries were not admitted.`
      );
    }

    for (let index = 0; index < limit; index += 1) {
      const rawRoom = rawRooms[index];
      const validation = validateRoom(
        rawRoom,
        index,
        viewBox
      );

      if (!validation.ok) {
        heldItems.push({
          family: "room",
          index,
          id: safeIdentifier(rawRoom && rawRoom.id),
          reason: validation.reason
        });

        continue;
      }

      if (seen.has(validation.room.id)) {
        heldItems.push({
          family: "room",
          index,
          id: validation.room.id,
          reason: `Duplicate room id "${validation.room.id}".`
        });

        continue;
      }

      seen.add(validation.room.id);
      rooms.push(validation.room);
    }

    return deepFreeze(rooms);
  }

  function validateRoom(rawRoom, index, viewBox) {
    if (!isPlainObject(rawRoom)) {
      return {
        ok: false,
        reason:
          `Room at index ${index} must be an object.`
      };
    }

    const id = safeIdentifier(rawRoom.id);
    const label = safeString(
      rawRoom.label,
      state.options.maxTextLength
    );

    if (!id) {
      return {
        ok: false,
        reason:
          `Room at index ${index} requires a valid id.`
      };
    }

    if (!label) {
      return {
        ok: false,
        reason:
          `Room "${id}" requires a label.`
      };
    }

    const routeValidation = validateRoute(
      rawRoom.route,
      rawRoom.allowExternal === true
    );

    if (!routeValidation.ok) {
      return {
        ok: false,
        reason:
          `Room "${id}" has an invalid route: ${routeValidation.reason}`
      };
    }

    const markerValidation = validateMarker(
      rawRoom.marker,
      viewBox,
      `Room "${id}"`
    );

    if (!markerValidation.ok) {
      return markerValidation;
    }

    const geometryValidation = validateRoomGeometry(
      rawRoom,
      viewBox,
      id
    );

    if (!geometryValidation.ok) {
      return geometryValidation;
    }

    const corridorAnchors = validateAnchorMap(
      rawRoom.corridorAnchors,
      viewBox,
      `Room "${id}"`
    );

    return {
      ok: true,
      room: deepFreeze({
        id,
        label,
        shortLabel: safeString(rawRoom.shortLabel, 240),
        description: safeString(
          rawRoom.description,
          state.options.maxTextLength
        ),
        route: routeValidation.route,
        routeKind: routeValidation.kind,
        allowExternal: routeValidation.kind === "external",
        status: safeString(rawRoom.status, 120) || "active",
        marker: markerValidation.marker,
        geometry: geometryValidation.geometry,
        corridorAnchors,
        avatarIds: safeIdentifierArray(rawRoom.avatarIds),
        tags: safeStringArray(rawRoom.tags, 120),
        public: rawRoom.public !== false,
        required: rawRoom.required === true,
        sourceIndex: index
      })
    };
  }

  function validateAvatars(rawAvatars, viewBox, heldItems, warnings) {
    const avatars = [];
    const seen = new Set();
    const limit = Math.min(
      rawAvatars.length,
      state.options.maxItemsPerFamily
    );

    if (rawAvatars.length > limit) {
      warnings.push(
        `Avatar input exceeded the safety limit of ${limit}; excess entries were not admitted.`
      );
    }

    for (let index = 0; index < limit; index += 1) {
      const rawAvatar = rawAvatars[index];
      const validation = validateAvatar(
        rawAvatar,
        index,
        viewBox
      );

      if (!validation.ok) {
        heldItems.push({
          family: "avatar",
          index,
          id: safeIdentifier(rawAvatar && rawAvatar.id),
          reason: validation.reason
        });

        continue;
      }

      if (seen.has(validation.avatar.id)) {
        heldItems.push({
          family: "avatar",
          index,
          id: validation.avatar.id,
          reason: `Duplicate avatar id "${validation.avatar.id}".`
        });

        continue;
      }

      seen.add(validation.avatar.id);
      avatars.push(validation.avatar);
    }

    return deepFreeze(avatars);
  }

  function validateAvatar(rawAvatar, index, viewBox) {
    if (!isPlainObject(rawAvatar)) {
      return {
        ok: false,
        reason:
          `Avatar at index ${index} must be an object.`
      };
    }

    const id = safeIdentifier(rawAvatar.id);
    const label = safeString(
      rawAvatar.label,
      state.options.maxTextLength
    );

    if (!id) {
      return {
        ok: false,
        reason:
          `Avatar at index ${index} requires a valid id.`
      };
    }

    if (!label) {
      return {
        ok: false,
        reason:
          `Avatar "${id}" requires a label.`
      };
    }

    const hasExplicitNonRoutingStatus =
      rawAvatar.route === null ||
      rawAvatar.route === "" ||
      rawAvatar.route === undefined;

    let route = "";
    let routeKind = "none";

    if (!hasExplicitNonRoutingStatus) {
      const routeValidation = validateRoute(
        rawAvatar.route,
        rawAvatar.allowExternal === true
      );

      if (!routeValidation.ok) {
        return {
          ok: false,
          reason:
            `Avatar "${id}" has an invalid route: ${routeValidation.reason}`
        };
      }

      route = routeValidation.route;
      routeKind = routeValidation.kind;
    }

    const markerValidation = validateMarker(
      rawAvatar.marker,
      viewBox,
      `Avatar "${id}"`
    );

    if (!markerValidation.ok) {
      return markerValidation;
    }

    const imageValidation = validateOptionalResourceUrl(
      rawAvatar.image
    );

    return {
      ok: true,
      avatar: deepFreeze({
        id,
        label,
        role: safeString(rawAvatar.role, 240),
        description: safeString(
          rawAvatar.description,
          state.options.maxTextLength
        ),
        route,
        routeKind,
        allowExternal: routeKind === "external",
        roomId: safeIdentifier(rawAvatar.roomId),
        marker: markerValidation.marker,
        image: imageValidation.ok
          ? imageValidation.url
          : "",
        status: safeString(rawAvatar.status, 120) || "active",
        tags: safeStringArray(rawAvatar.tags, 120),
        public: rawAvatar.public !== false,
        required: rawAvatar.required === true,
        sourceIndex: index
      })
    };
  }

  function validateCorridors(
    rawCorridors,
    roomIndex,
    avatarIndex,
    viewBox,
    heldItems,
    warnings
  ) {
    const corridors = [];
    const seen = new Set();
    const limit = Math.min(
      rawCorridors.length,
      state.options.maxItemsPerFamily
    );

    if (rawCorridors.length > limit) {
      warnings.push(
        `Corridor input exceeded the safety limit of ${limit}; excess entries were not admitted.`
      );
    }

    for (let index = 0; index < limit; index += 1) {
      const rawCorridor = rawCorridors[index];
      const validation = validateCorridor(
        rawCorridor,
        index,
        roomIndex,
        avatarIndex,
        viewBox
      );

      if (!validation.ok) {
        heldItems.push({
          family: "corridor",
          index,
          id: safeIdentifier(rawCorridor && rawCorridor.id),
          reason: validation.reason
        });

        continue;
      }

      if (seen.has(validation.corridor.id)) {
        heldItems.push({
          family: "corridor",
          index,
          id: validation.corridor.id,
          reason: `Duplicate corridor id "${validation.corridor.id}".`
        });

        continue;
      }

      seen.add(validation.corridor.id);
      corridors.push(validation.corridor);
    }

    return deepFreeze(corridors);
  }

  function validateCorridor(
    rawCorridor,
    index,
    roomIndex,
    avatarIndex,
    viewBox
  ) {
    if (!isPlainObject(rawCorridor)) {
      return {
        ok: false,
        reason:
          `Corridor at index ${index} must be an object.`
      };
    }

    const id = safeIdentifier(rawCorridor.id);
    const type = safeString(rawCorridor.type, 40).toLowerCase();

    if (!id) {
      return {
        ok: false,
        reason:
          `Corridor at index ${index} requires a valid id.`
      };
    }

    if (
      !["line", "polyline", "path", "relational", "automatic"].includes(type)
    ) {
      return {
        ok: false,
        reason:
          `Corridor "${id}" has unsupported type "${type}".`
      };
    }

    let geometry = null;

    if (type === "line") {
      geometry = validateLineCorridor(
        rawCorridor,
        viewBox,
        id
      );
    } else if (type === "polyline") {
      geometry = validatePolylineCorridor(
        rawCorridor,
        viewBox,
        id
      );
    } else if (type === "path") {
      geometry = validatePathCorridor(
        rawCorridor,
        id
      );
    } else {
      geometry = validateRelationalCorridor(
        rawCorridor,
        roomIndex,
        avatarIndex,
        viewBox,
        id,
        type
      );
    }

    if (!geometry.ok) {
      return geometry;
    }

    return {
      ok: true,
      corridor: deepFreeze({
        id,
        type,
        label: safeString(rawCorridor.label, 240),
        status: safeString(rawCorridor.status, 120) || "active",
        public: rawCorridor.public !== false,
        required: rawCorridor.required === true,
        geometry: geometry.geometry,
        sourceIndex: index
      })
    };
  }

  function validateLineCorridor(rawCorridor, viewBox, id) {
    const start = validateSourcePoint(
      rawCorridor.start,
      viewBox,
      `Corridor "${id}" start`
    );

    const end = validateSourcePoint(
      rawCorridor.end,
      viewBox,
      `Corridor "${id}" end`
    );

    if (!start.ok) {
      return start;
    }

    if (!end.ok) {
      return end;
    }

    return {
      ok: true,
      geometry: deepFreeze({
        kind: "line",
        start: start.point,
        end: end.point
      })
    };
  }

  function validatePolylineCorridor(rawCorridor, viewBox, id) {
    if (!Array.isArray(rawCorridor.points)) {
      return {
        ok: false,
        reason:
          `Corridor "${id}" polyline requires points.`
      };
    }

    if (
      rawCorridor.points.length < 2 ||
      rawCorridor.points.length > state.options.maxPolylinePoints
    ) {
      return {
        ok: false,
        reason:
          `Corridor "${id}" polyline requires between 2 and ${state.options.maxPolylinePoints} points.`
      };
    }

    const points = [];

    for (
      let index = 0;
      index < rawCorridor.points.length;
      index += 1
    ) {
      const pointValidation = validateSourcePoint(
        rawCorridor.points[index],
        viewBox,
        `Corridor "${id}" point ${index}`
      );

      if (!pointValidation.ok) {
        return pointValidation;
      }

      points.push(pointValidation.point);
    }

    return {
      ok: true,
      geometry: deepFreeze({
        kind: "polyline",
        points: deepFreeze(points)
      })
    };
  }

  function validatePathCorridor(rawCorridor, id) {
    const path = safeSvgPath(rawCorridor.path);

    if (!path) {
      return {
        ok: false,
        reason:
          `Corridor "${id}" requires valid SVG path data.`
      };
    }

    return {
      ok: true,
      geometry: deepFreeze({
        kind: "path",
        path
      })
    };
  }

  function validateRelationalCorridor(
    rawCorridor,
    roomIndex,
    avatarIndex,
    viewBox,
    id,
    type
  ) {
    const from = validateRelationEndpoint(
      rawCorridor.from,
      roomIndex,
      avatarIndex,
      viewBox,
      `Corridor "${id}" from`,
      type
    );

    if (!from.ok) {
      return from;
    }

    const to = validateRelationEndpoint(
      rawCorridor.to,
      roomIndex,
      avatarIndex,
      viewBox,
      `Corridor "${id}" to`,
      type
    );

    if (!to.ok) {
      return to;
    }

    return {
      ok: true,
      geometry: deepFreeze({
        kind: type,
        from: from.endpoint,
        to: to.endpoint
      })
    };
  }

  function validateRelationEndpoint(
    rawEndpoint,
    roomIndex,
    avatarIndex,
    viewBox,
    label,
    corridorType
  ) {
    if (!isPlainObject(rawEndpoint)) {
      return {
        ok: false,
        reason:
          `${label} must be an object.`
      };
    }

    const roomId = safeIdentifier(rawEndpoint.roomId);
    const avatarId = safeIdentifier(rawEndpoint.avatarId);
    const explicitAnchor = safeIdentifier(rawEndpoint.anchor);

    if (!roomId && !avatarId) {
      return {
        ok: false,
        reason:
          `${label} requires roomId or avatarId.`
      };
    }

    let owner = null;
    let ownerType = "";

    if (roomId) {
      owner = roomIndex.get(roomId);
      ownerType = "room";
    } else if (avatarId) {
      owner = avatarIndex.get(avatarId);
      ownerType = "avatar";
    }

    if (!owner) {
      return {
        ok: false,
        reason:
          `${label} references a missing ${ownerType || "target"}.`
      };
    }

    if (explicitAnchor) {
      if (
        ownerType !== "room" ||
        !owner.corridorAnchors ||
        !owner.corridorAnchors[explicitAnchor]
      ) {
        return {
          ok: false,
          reason:
            `${label} explicitly references missing anchor "${explicitAnchor}".`
        };
      }

      return {
        ok: true,
        endpoint: deepFreeze({
          ownerType,
          ownerId: owner.id,
          anchor: explicitAnchor,
          point: owner.corridorAnchors[explicitAnchor]
        })
      };
    }

    if (corridorType === "relational") {
      return {
        ok: false,
        reason:
          `${label} requires an explicit anchor for relational corridors.`
      };
    }

    if (!owner.marker) {
      return {
        ok: false,
        reason:
          `${label} cannot resolve an automatic point because the target has no marker.`
      };
    }

    return {
      ok: true,
      endpoint: deepFreeze({
        ownerType,
        ownerId: owner.id,
        anchor: "",
        point: owner.marker
      })
    };
  }

  function validateLabels(rawLabels, heldItems) {
    const labels = [];
    const seen = new Set();
    const limit = Math.min(
      rawLabels.length,
      state.options.maxItemsPerFamily
    );

    for (let index = 0; index < limit; index += 1) {
      const rawLabel = rawLabels[index];

      if (!isPlainObject(rawLabel)) {
        heldItems.push({
          family: "label",
          index,
          id: "",
          reason:
            `Label at index ${index} must be an object.`
        });

        continue;
      }

      const id = safeIdentifier(rawLabel.id);
      const text = safeString(
        rawLabel.text,
        state.options.maxTextLength
      );

      if (!id || !text || seen.has(id)) {
        heldItems.push({
          family: "label",
          index,
          id,
          reason:
            !id
              ? `Label at index ${index} requires a valid id.`
              : !text
                ? `Label "${id}" requires text.`
                : `Duplicate label id "${id}".`
        });

        continue;
      }

      seen.add(id);

      labels.push(
        deepFreeze({
          id,
          text,
          targetType: safeString(rawLabel.targetType, 40),
          targetId: safeIdentifier(rawLabel.targetId),
          position: isPlainObject(rawLabel.position)
            ? {
                x: finiteNumber(rawLabel.position.x),
                y: finiteNumber(rawLabel.position.y)
              }
            : null
        })
      );
    }

    return deepFreeze(labels);
  }

  function validateSettings(rawSettings) {
    if (!isPlainObject(rawSettings)) {
      return Object.freeze({});
    }

    return deepFreeze({
      allowBackdropClose:
        typeof rawSettings.allowBackdropClose === "boolean"
          ? rawSettings.allowBackdropClose
          : undefined,
      selectBeforeRoute:
        typeof rawSettings.selectBeforeRoute === "boolean"
          ? rawSettings.selectBeforeRoute
          : undefined,
      title: safeString(rawSettings.title, 240),
      description: safeString(
        rawSettings.description,
        state.options.maxTextLength
      ),
      eyebrow: safeString(rawSettings.eyebrow, 240)
    });
  }

  function validateRoomGeometry(rawRoom, viewBox, roomId) {
    if (Array.isArray(rawRoom.polygon)) {
      if (
        rawRoom.polygon.length < 3 ||
        rawRoom.polygon.length > state.options.maxPolygonPoints
      ) {
        return {
          ok: false,
          reason:
            `Room "${roomId}" polygon requires between 3 and ${state.options.maxPolygonPoints} points.`
        };
      }

      const points = [];

      for (
        let index = 0;
        index < rawRoom.polygon.length;
        index += 1
      ) {
        const pointValidation = validateSourcePoint(
          rawRoom.polygon[index],
          viewBox,
          `Room "${roomId}" polygon point ${index}`
        );

        if (!pointValidation.ok) {
          return pointValidation;
        }

        points.push(pointValidation.point);
      }

      return {
        ok: true,
        geometry: deepFreeze({
          kind: "polygon",
          points: deepFreeze(points)
        })
      };
    }

    if (rawRoom.path !== undefined) {
      const path = safeSvgPath(rawRoom.path);

      if (!path) {
        return {
          ok: false,
          reason:
            `Room "${roomId}" contains invalid SVG path data.`
        };
      }

      return {
        ok: true,
        geometry: deepFreeze({
          kind: "path",
          path
        })
      };
    }

    return {
      ok: true,
      geometry: deepFreeze({
        kind: "marker-only"
      })
    };
  }

  function validateMarker(rawMarker, viewBox, label) {
    const pointValidation = validateSourcePoint(
      rawMarker,
      viewBox,
      `${label} marker`
    );

    if (!pointValidation.ok) {
      return pointValidation;
    }

    return {
      ok: true,
      marker: pointValidation.point
    };
  }

  function validateSourcePoint(rawPoint, viewBox, label) {
    if (!isPlainObject(rawPoint)) {
      return {
        ok: false,
        reason:
          `${label} must be an object with x and y.`
      };
    }

    const sourceX = finiteNumber(rawPoint.x);
    const sourceY = finiteNumber(rawPoint.y);

    if (sourceX === null || sourceY === null) {
      return {
        ok: false,
        reason:
          `${label} requires finite x and y values.`
      };
    }

    const allowOutside = rawPoint.allowOutside === true;
    const maxX = viewBox.minX + viewBox.width;
    const maxY = viewBox.minY + viewBox.height;

    const inside =
      sourceX >= viewBox.minX &&
      sourceX <= maxX &&
      sourceY >= viewBox.minY &&
      sourceY <= maxY;

    if (!inside && !allowOutside) {
      return {
        ok: false,
        reason:
          `${label} falls outside the estate viewBox.`
      };
    }

    const normalizedX =
      ((sourceX - viewBox.minX) / viewBox.width) * 100;

    const normalizedY =
      ((sourceY - viewBox.minY) / viewBox.height) * 100;

    return {
      ok: true,
      point: deepFreeze({
        sourceX,
        sourceY,
        normalizedX,
        normalizedY,
        allowOutside
      })
    };
  }

  function validateAnchorMap(rawAnchors, viewBox, label) {
    if (!isPlainObject(rawAnchors)) {
      return deepFreeze({});
    }

    const anchors = {};

    for (const key of Object.keys(rawAnchors)) {
      const anchorId = safeIdentifier(key);

      if (!anchorId) {
        continue;
      }

      const validation = validateSourcePoint(
        rawAnchors[key],
        viewBox,
        `${label} anchor "${anchorId}"`
      );

      if (!validation.ok) {
        addWarning(validation.reason);
        continue;
      }

      anchors[anchorId] = validation.point;
    }

    return deepFreeze(anchors);
  }

  function ensureRoot() {
    if (
      state.root &&
      state.root.isConnected
    ) {
      return result(
        true,
        state.lifecycleState,
        "Existing root reused."
      );
    }

    const existingRoot = document.querySelector(SELECTORS.root);

    if (existingRoot) {
      if (
        existingRoot.dataset.houseContract &&
        existingRoot.dataset.houseContract !== CONTRACT
      ) {
        return result(
          false,
          STATES.authorityConflict,
          "A different House Control Pad root already exists."
        );
      }

      state.root = existingRoot;
      cacheDomReferences();

      if (!state.dialog || !state.svg || !state.markersLayer) {
        return result(
          false,
          STATES.failed,
          "The existing House Control Pad root does not satisfy the required DOM contract."
        );
      }

      return result(
        true,
        state.lifecycleState,
        "Existing root adopted."
      );
    }

    try {
      const fragment = document.createDocumentFragment();

      const root = createElement("div", {
        className: "house-control-pad",
        attributes: {
          "data-house-control-pad": "",
          "data-house-state": STATES.closed,
          "data-house-ready": "false",
          "data-house-open": "false",
          "data-house-degraded": "false",
          "data-house-hold": "false",
          "data-house-error": "false",
          "data-house-contract": CONTRACT,
          "aria-hidden": "true"
        }
      });

      root.hidden = true;

      const backdrop = createElement("div", {
        className: "house-control-pad__backdrop",
        attributes: {
          "data-house-backdrop": "",
          "aria-hidden": "true"
        }
      });

      const dialog = createElement("section", {
        className: "house-control-pad__dialog",
        attributes: {
          "data-house-dialog": "",
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": "house-control-pad-title",
          "aria-describedby": "house-control-pad-description",
          tabindex: "-1"
        }
      });

      const header = createElement("header", {
        className: "house-control-pad__header"
      });

      const heading = createElement("div", {
        className: "house-control-pad__heading"
      });

      const eyebrow = createElement("p", {
        className: "house-control-pad__eyebrow",
        attributes: {
          "data-house-eyebrow": ""
        }
      });

      const title = createElement("h2", {
        className: "house-control-pad__title",
        attributes: {
          id: "house-control-pad-title",
          "data-house-title": ""
        }
      });

      const description = createElement("p", {
        className: "house-control-pad__description",
        attributes: {
          id: "house-control-pad-description",
          "data-house-description": ""
        }
      });

      const closeButton = createElement("button", {
        className: "house-control-pad__close",
        text: "Close",
        attributes: {
          type: "button",
          "data-house-close": "",
          "aria-label": "Close the House map"
        }
      });

      heading.append(
        eyebrow,
        title,
        description
      );

      header.append(
        heading,
        closeButton
      );

      const statusNode = createElement("div", {
        className: "house-control-pad__status",
        attributes: {
          "data-house-status": "",
          role: "status",
          "aria-live": "polite",
          "aria-atomic": "true"
        }
      });

      const estateNode = createElement("div", {
        className: "house-control-pad__estate",
        attributes: {
          "data-house-estate": ""
        }
      });

      const svg = createSvgElement("svg", {
        class: "house-control-pad__svg",
        "data-house-svg": "",
        "aria-hidden": "true",
        focusable: "false",
        preserveAspectRatio: "xMidYMid meet"
      });

      const markersLayer = createElement("div", {
        className: "house-control-pad__markers",
        attributes: {
          "data-house-markers": ""
        }
      });

      estateNode.append(
        svg,
        markersLayer
      );

      const detailsPanel = createElement("aside", {
        className: "house-control-pad__details",
        attributes: {
          "data-house-details": "",
          "aria-live": "polite"
        }
      });

      const footer = createElement("footer", {
        className: "house-control-pad__footer",
        attributes: {
          "data-house-footer": ""
        }
      });

      dialog.append(
        header,
        statusNode,
        estateNode,
        detailsPanel,
        footer
      );

      root.append(
        backdrop,
        dialog
      );

      fragment.append(root);
      document.body.append(fragment);

      state.root = root;
      state.dialog = dialog;
      state.backdrop = backdrop;
      state.closeButton = closeButton;
      state.statusNode = statusNode;
      state.estateNode = estateNode;
      state.svg = svg;
      state.markersLayer = markersLayer;
      state.detailsPanel = detailsPanel;
      state.mounted = true;

      return result(
        true,
        state.lifecycleState,
        "House Control Pad root created."
      );
    } catch (error) {
      return result(
        false,
        STATES.failed,
        "House Control Pad DOM construction failed.",
        {
          error: normalizeError(error)
        }
      );
    }
  }

  function cacheDomReferences() {
    state.dialog = state.root.querySelector(SELECTORS.dialog);
    state.backdrop = state.root.querySelector(SELECTORS.backdrop);
    state.closeButton = state.root.querySelector(SELECTORS.close);
    state.statusNode = state.root.querySelector(SELECTORS.status);
    state.estateNode = state.root.querySelector(SELECTORS.estate);
    state.svg = state.root.querySelector(SELECTORS.svg);
    state.markersLayer = state.root.querySelector(SELECTORS.markers);
    state.detailsPanel = state.root.querySelector(SELECTORS.details);
  }

  function renderEstate(model) {
    if (
      !model ||
      !state.svg ||
      !state.markersLayer ||
      !state.root
    ) {
      return;
    }

    state.root.dataset.houseDataContract = model.contract;

    updateHeading(model);
    clearElement(state.svg);
    clearElement(state.markersLayer);
    clearElement(state.detailsPanel);

    state.svg.setAttribute(
      "viewBox",
      [
        model.viewBox.minX,
        model.viewBox.minY,
        model.viewBox.width,
        model.viewBox.height
      ].join(" ")
    );

    const svgFragment = document.createDocumentFragment();
    const markerFragment = document.createDocumentFragment();

    const corridorGroup = createSvgElement("g", {
      class: "house-control-pad__corridors",
      "data-house-corridors": ""
    });

    model.corridors.forEach((corridor, index) => {
      const corridorElement = renderCorridor(
        corridor,
        index
      );

      if (corridorElement) {
        corridorGroup.append(corridorElement);
      }
    });

    svgFragment.append(corridorGroup);

    const roomGroup = createSvgElement("g", {
      class: "house-control-pad__rooms",
      "data-house-rooms": ""
    });

    model.rooms.forEach((room, index) => {
      const roomElement = renderRoomGeometry(
        room,
        index
      );

      if (roomElement) {
        roomGroup.append(roomElement);
      }

      markerFragment.append(
        renderMarkerButton(
          "room",
          room,
          index
        )
      );
    });

    svgFragment.append(roomGroup);

    model.avatars.forEach((avatar, index) => {
      markerFragment.append(
        renderMarkerButton(
          "avatar",
          avatar,
          index
        )
      );
    });

    state.svg.append(svgFragment);
    state.markersLayer.append(markerFragment);

    renderDefaultDetails(model);
    syncSelectionAttributes();
  }

  function renderRoomGeometry(room, index) {
    if (!room.geometry) {
      return null;
    }

    let element = null;

    if (room.geometry.kind === "polygon") {
      element = createSvgElement("polygon", {
        points: room.geometry.points
          .map((point) => `${point.sourceX},${point.sourceY}`)
          .join(" ")
      });
    } else if (room.geometry.kind === "path") {
      element = createSvgElement("path", {
        d: room.geometry.path
      });
    } else {
      return null;
    }

    element.setAttribute(
      "class",
      "house-control-pad__room-shape"
    );

    element.setAttribute(
      "data-house-room-shape",
      ""
    );

    element.setAttribute(
      "data-house-room-id",
      room.id
    );

    element.setAttribute(
      "data-house-validity",
      ITEM_STATES.valid
    );

    element.setAttribute(
      "data-house-status",
      room.status
    );

    element.style.setProperty(
      "--house-room-index",
      String(index)
    );

    return element;
  }

  function renderCorridor(corridor, index) {
    const geometry = corridor.geometry;
    let element = null;

    if (geometry.kind === "line") {
      element = createSvgElement("line", {
        x1: String(geometry.start.sourceX),
        y1: String(geometry.start.sourceY),
        x2: String(geometry.end.sourceX),
        y2: String(geometry.end.sourceY)
      });
    } else if (geometry.kind === "polyline") {
      element = createSvgElement("polyline", {
        points: geometry.points
          .map((point) => `${point.sourceX},${point.sourceY}`)
          .join(" ")
      });
    } else if (geometry.kind === "path") {
      element = createSvgElement("path", {
        d: geometry.path
      });
    } else if (
      geometry.kind === "relational" ||
      geometry.kind === "automatic"
    ) {
      element = createSvgElement("line", {
        x1: String(geometry.from.point.sourceX),
        y1: String(geometry.from.point.sourceY),
        x2: String(geometry.to.point.sourceX),
        y2: String(geometry.to.point.sourceY)
      });
    }

    if (!element) {
      return null;
    }

    element.setAttribute(
      "class",
      "house-control-pad__corridor"
    );

    element.setAttribute(
      "data-house-corridor",
      ""
    );

    element.setAttribute(
      "data-house-corridor-id",
      corridor.id
    );

    element.setAttribute(
      "data-house-status",
      corridor.status
    );

    element.setAttribute(
      "data-house-validity",
      ITEM_STATES.valid
    );

    element.setAttribute(
      "aria-hidden",
      "true"
    );

    element.style.setProperty(
      "--house-corridor-index",
      String(index)
    );

    return element;
  }

  function renderMarkerButton(type, item, index) {
    const button = createElement("button", {
      className:
        type === "room"
          ? "house-control-pad__marker house-control-pad__marker--room"
          : "house-control-pad__marker house-control-pad__marker--avatar",
      attributes: {
        type: "button",
        "data-house-select": "",
        "data-house-validity": ITEM_STATES.valid,
        "data-house-status": item.status,
        "aria-pressed": "false"
      }
    });

    if (type === "room") {
      button.setAttribute(
        "data-house-room",
        ""
      );

      button.setAttribute(
        "data-house-room-id",
        item.id
      );

      button.style.setProperty(
        "--house-room-index",
        String(index)
      );
    } else {
      button.setAttribute(
        "data-house-avatar",
        ""
      );

      button.setAttribute(
        "data-house-avatar-id",
        item.id
      );

      button.style.setProperty(
        "--house-avatar-index",
        String(index)
      );
    }

    button.style.setProperty(
      "--house-marker-x",
      `${item.marker.normalizedX}%`
    );

    button.style.setProperty(
      "--house-marker-y",
      `${item.marker.normalizedY}%`
    );

    button.style.setProperty(
      "--house-source-x",
      String(item.marker.sourceX)
    );

    button.style.setProperty(
      "--house-source-y",
      String(item.marker.sourceY)
    );

    button.dataset.houseSourceX = String(item.marker.sourceX);
    button.dataset.houseSourceY = String(item.marker.sourceY);
    button.dataset.houseNormalizedX = String(
      item.marker.normalizedX
    );
    button.dataset.houseNormalizedY = String(
      item.marker.normalizedY
    );

    const label = createElement("span", {
      className: "house-control-pad__marker-label",
      text: item.shortLabel || item.label
    });

    button.append(label);

    if (item.route) {
      button.dataset.houseRoute = item.route;
    }

    return button;
  }

  function renderDefaultDetails(model) {
    if (!state.detailsPanel) {
      return;
    }

    clearElement(state.detailsPanel);

    const heading = createElement("h3", {
      className: "house-control-pad__details-title",
      text: model.estate.label
    });

    const description = createElement("p", {
      className: "house-control-pad__details-description",
      text:
        model.estate.description ||
        "Select a room or avatar to view its destination."
    });

    state.detailsPanel.append(
      heading,
      description
    );
  }

  function renderSelectedDetails(type, item) {
    if (!state.detailsPanel || !item) {
      return;
    }

    clearElement(state.detailsPanel);

    const heading = createElement("h3", {
      className: "house-control-pad__details-title",
      text: item.label
    });

    state.detailsPanel.append(heading);

    const roleText =
      type === "avatar"
        ? safeString(item.role, 240)
        : "";

    if (roleText) {
      state.detailsPanel.append(
        createElement("p", {
          className: "house-control-pad__details-role",
          text: roleText
        })
      );
    }

    if (item.description) {
      state.detailsPanel.append(
        createElement("p", {
          className: "house-control-pad__details-description",
          text: item.description
        })
      );
    }

    if (item.route) {
      const routeButton = createElement("button", {
        className: "house-control-pad__route",
        text: `Visit ${item.label}`,
        attributes: {
          type: "button",
          "data-house-route": "",
          "data-house-target-type": type,
          "data-house-target-id": item.id
        }
      });

      state.detailsPanel.append(routeButton);
    } else {
      state.detailsPanel.append(
        createElement("p", {
          className: "house-control-pad__details-status",
          text:
            "This destination is informational and does not currently expose a route."
        })
      );
    }
  }

  function selectTarget(type, id, options) {
    const item = findTarget(type, id);

    if (!item) {
      return result(
        false,
        state.lifecycleState,
        `No valid ${type} target "${id}" exists.`
      );
    }

    state.selectedType = type;
    state.selectedId = id;

    syncSelectionAttributes();
    renderSelectedDetails(type, item);

    if (!options || options.announce !== false) {
      updateStatusMessage(`${item.label} selected.`);
    }

    dispatch(EVENTS.select, {
      reason: "selection",
      targetType: type,
      targetId: id,
      route: item.route || ""
    });

    if (
      options &&
      options.focus === true
    ) {
      const selector =
        type === "room"
          ? `[data-house-room-id="${cssEscape(id)}"]`
          : `[data-house-avatar-id="${cssEscape(id)}"]`;

      const marker = state.markersLayer
        ? state.markersLayer.querySelector(selector)
        : null;

      if (marker && isFocusable(marker)) {
        marker.focus({
          preventScroll: true
        });
      }
    }

    publishStatus();

    return result(
      true,
      state.lifecycleState,
      `${item.label} selected.`,
      {
        targetId: id,
        route: item.route || ""
      }
    );
  }

  function clearSelection() {
    state.selectedType = "";
    state.selectedId = "";

    syncSelectionAttributes();

    if (state.validData) {
      renderDefaultDetails(state.validData);
    }
  }

  function syncSelectionAttributes() {
    if (!state.root) {
      return;
    }

    state.root.dataset.houseSelectedType = state.selectedType;
    state.root.dataset.houseSelectedId = state.selectedId;

    const controls = state.root.querySelectorAll(
      SELECTORS.selectable
    );

    controls.forEach((control) => {
      const controlType = control.matches(SELECTORS.room)
        ? "room"
        : control.matches(SELECTORS.avatar)
          ? "avatar"
          : "";

      const controlId =
        controlType === "room"
          ? control.dataset.houseRoomId
          : control.dataset.houseAvatarId;

      const selected =
        controlType === state.selectedType &&
        controlId === state.selectedId;

      control.setAttribute(
        "aria-pressed",
        selected ? "true" : "false"
      );

      if (selected) {
        control.setAttribute(
          "aria-current",
          "location"
        );
      } else {
        control.removeAttribute("aria-current");
      }
    });
  }

  function findTarget(type, id) {
    if (!state.validData || !id) {
      return null;
    }

    if (type === "room") {
      return state.validData.rooms.find(
        (room) => room.id === id
      ) || null;
    }

    if (type === "avatar") {
      return state.validData.avatars.find(
        (avatar) => avatar.id === id
      ) || null;
    }

    return null;
  }

  function normalizeCanonicalRouteTarget(targetRequest) {
    if (!isPlainObject(targetRequest)) {
      return result(
        false,
        state.lifecycleState,
        "Public routing requires a canonical target object with type and id."
      );
    }

    const targetType = safeString(
      targetRequest.type,
      40
    );

    const targetId = safeIdentifier(
      targetRequest.id
    );

    if (
      !["room", "avatar"].includes(targetType) ||
      !targetId
    ) {
      return result(
        false,
        state.lifecycleState,
        "Public routing requires a valid canonical room or avatar type and id.",
        {
          targetType,
          targetId
        }
      );
    }

    const item = findTarget(
      targetType,
      targetId
    );

    if (!item) {
      return result(
        false,
        state.lifecycleState,
        `No admitted canonical ${targetType} target "${targetId}" exists.`,
        {
          targetType,
          targetId
        }
      );
    }

    if (!item.route) {
      return result(
        false,
        state.lifecycleState,
        `The admitted canonical ${targetType} target "${targetId}" does not expose a route.`,
        {
          targetType,
          targetId
        }
      );
    }

    return {
      ok: true,
      targetType,
      targetId,
      route: item.route,
      allowExternal: item.allowExternal === true
    };
  }

  function bindRuntime() {
    if (!state.root) {
      return;
    }

    removeAllManagedListeners();

    addManagedListener(
      document,
      "click",
      onDocumentClick
    );

    addManagedListener(
      document,
      "keydown",
      onDocumentKeydown
    );

    addManagedListener(
      document,
      "focusin",
      onDocumentFocusIn
    );

    addManagedListener(
      state.root,
      "click",
      onRootClick
    );

    configureMutationObserver();
    configureReducedMotionQuery();
  }

  function onDocumentClick(event) {
    if (state.destroyed || event.defaultPrevented) {
      return;
    }

    const door = closestElement(
      event.target,
      SELECTORS.door
    );

    if (!door) {
      return;
    }

    if (!isEligibleDoorActivation(event, door)) {
      return;
    }

    const request = {
      door,
      context: safeString(
        door.dataset.houseContext,
        240
      ),
      initialRoom: safeIdentifier(
        door.dataset.houseInitialRoom
      ),
      initialAvatar: safeIdentifier(
        door.dataset.houseInitialAvatar
      )
    };

    const openResult = open(request);

    if (openResult.ok && state.open) {
      event.preventDefault();
    }
  }

  function onRootClick(event) {
    const closeControl = closestElement(
      event.target,
      SELECTORS.close
    );

    if (closeControl) {
      event.preventDefault();
      close("close-control");
      return;
    }

    const backdrop = closestElement(
      event.target,
      SELECTORS.backdrop
    );

    if (backdrop && event.target === backdrop) {
      const allowBackdropClose =
        state.validData &&
        state.validData.settings &&
        typeof state.validData.settings.allowBackdropClose === "boolean"
          ? state.validData.settings.allowBackdropClose
          : state.options.allowBackdropClose;

      if (allowBackdropClose) {
        close("backdrop");
      }

      return;
    }

    const routeControl = closestElement(
      event.target,
      SELECTORS.route
    );

    if (routeControl) {
      event.preventDefault();

      routeTo({
        type: safeString(
          routeControl.dataset.houseTargetType,
          40
        ),
        id: safeIdentifier(
          routeControl.dataset.houseTargetId
        )
      });

      return;
    }

    const selectable = closestElement(
      event.target,
      SELECTORS.selectable
    );

    if (!selectable) {
      return;
    }

    event.preventDefault();

    const type = selectable.matches(SELECTORS.room)
      ? "room"
      : selectable.matches(SELECTORS.avatar)
        ? "avatar"
        : "";

    const id =
      type === "room"
        ? safeIdentifier(selectable.dataset.houseRoomId)
        : safeIdentifier(selectable.dataset.houseAvatarId);

    if (!type || !id) {
      return;
    }

    const selectBeforeRoute =
      state.validData &&
      state.validData.settings &&
      typeof state.validData.settings.selectBeforeRoute === "boolean"
        ? state.validData.settings.selectBeforeRoute
        : state.options.selectBeforeRoute;

    if (
      !selectBeforeRoute &&
      selectable.dataset.houseRoute
    ) {
      routeTo({
        type,
        id
      });

      return;
    }

    selectTarget(
      type,
      id,
      {
        focus: false,
        announce: true
      }
    );
  }

  function onDocumentKeydown(event) {
    if (!state.open || state.destroyed) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      close("escape");
      return;
    }

    if (event.key === "Tab") {
      trapFocus(event);
      return;
    }

    if (
      [
        "ArrowRight",
        "ArrowDown",
        "ArrowLeft",
        "ArrowUp",
        "Home",
        "End"
      ].includes(event.key)
    ) {
      const activeMarker = closestElement(
        document.activeElement,
        SELECTORS.selectable
      );

      if (activeMarker) {
        moveMarkerFocus(
          event,
          activeMarker
        );
      }
    }
  }

  function onDocumentFocusIn(event) {
    if (
      !state.open ||
      !state.dialog ||
      state.dialog.contains(event.target)
    ) {
      return;
    }

    const focusable = getFocusableElements(
      state.dialog
    );

    const target = focusable[0] || state.dialog;

    try {
      target.focus({
        preventScroll: true
      });
    } catch (_error) {
      target.focus();
    }
  }

  function moveMarkerFocus(event, activeMarker) {
    if (!state.markersLayer) {
      return;
    }

    const markers = Array.from(
      state.markersLayer.querySelectorAll(
        SELECTORS.selectable
      )
    ).filter(isFocusable);

    if (!markers.length) {
      return;
    }

    const currentIndex = markers.indexOf(activeMarker);

    if (currentIndex < 0) {
      return;
    }

    let nextIndex = currentIndex;

    if (
      event.key === "ArrowRight" ||
      event.key === "ArrowDown"
    ) {
      nextIndex =
        (currentIndex + 1) % markers.length;
    } else if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowUp"
    ) {
      nextIndex =
        (currentIndex - 1 + markers.length) %
        markers.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = markers.length - 1;
    }

    event.preventDefault();

    markers[nextIndex].focus({
      preventScroll: true
    });
  }

  function trapFocus(event) {
    if (!state.dialog) {
      return;
    }

    const focusable = getFocusableElements(
      state.dialog
    );

    if (!focusable.length) {
      event.preventDefault();
      state.dialog.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (
      !event.shiftKey &&
      active === last
    ) {
      event.preventDefault();
      first.focus();
    } else if (!state.dialog.contains(active)) {
      event.preventDefault();
      first.focus();
    }
  }

  function focusInitialElement() {
    if (!state.dialog) {
      return;
    }

    let target = null;

    if (
      state.selectedType &&
      state.selectedId &&
      state.markersLayer
    ) {
      const selector =
        state.selectedType === "room"
          ? `[data-house-room-id="${cssEscape(state.selectedId)}"]`
          : `[data-house-avatar-id="${cssEscape(state.selectedId)}"]`;

      target = state.markersLayer.querySelector(
        selector
      );
    }

    if (!target) {
      target = state.closeButton || state.dialog;
    }

    try {
      target.focus({
        preventScroll: true
      });
    } catch (_error) {
      target.focus();
    }
  }

  function restoreFocus() {
    const target = state.returnFocusTarget;

    state.returnFocusTarget = null;
    state.activeDoor = null;

    if (
      target &&
      target.isConnected &&
      isFocusable(target)
    ) {
      try {
        target.focus({
          preventScroll: true
        });
      } catch (_error) {
        target.focus();
      }

      return;
    }

    const fallbackDoor = document.querySelector(
      SELECTORS.door
    );

    if (
      fallbackDoor &&
      isFocusable(fallbackDoor)
    ) {
      fallbackDoor.focus({
        preventScroll: true
      });
    }
  }

  function resolveReturnFocusTarget(door) {
    if (door && door.isConnected) {
      return door;
    }

    if (
      document.activeElement &&
      document.activeElement !== document.body &&
      document.activeElement.isConnected
    ) {
      return document.activeElement;
    }

    return null;
  }

  function applyOpenRequest(request) {
    const normalized = normalizeOpenRequest(
      request
    );

    if (
      normalized.initialType &&
      normalized.initialId
    ) {
      selectTarget(
        normalized.initialType,
        normalized.initialId,
        {
          focus: false,
          announce: false
        }
      );
    }
  }

  function normalizeOpenRequest(request) {
    const source = isPlainObject(request)
      ? request
      : {};

    const door =
      source.door &&
      source.door.nodeType === 1
        ? source.door
        : null;

    let initialType = "";
    let initialId = "";

    const requestedRoom =
      safeIdentifier(source.initialRoom) ||
      safeIdentifier(
        door && door.dataset.houseInitialRoom
      );

    const requestedAvatar =
      safeIdentifier(source.initialAvatar) ||
      safeIdentifier(
        door && door.dataset.houseInitialAvatar
      );

    if (
      requestedRoom &&
      findTarget("room", requestedRoom)
    ) {
      initialType = "room";
      initialId = requestedRoom;
    } else if (
      requestedAvatar &&
      findTarget("avatar", requestedAvatar)
    ) {
      initialType = "avatar";
      initialId = requestedAvatar;
    }

    return {
      door,
      context:
        safeString(source.context, 240) ||
        safeString(
          door && door.dataset.houseContext,
          240
        ),
      initialType,
      initialId
    };
  }

  function transitionTo(nextState, reason, options) {
    const force = options && options.force === true;
    const current = state.lifecycleState;

    if (current === nextState) {
      syncRootState();
      publishStatus();
      return true;
    }

    const allowed =
      ALLOWED_TRANSITIONS[current] &&
      ALLOWED_TRANSITIONS[current].has(nextState);

    if (!allowed && !force) {
      addError(
        `Invalid lifecycle transition from "${current}" to "${nextState}".`
      );

      dispatch(EVENTS.error, {
        reason:
          `Invalid lifecycle transition from "${current}" to "${nextState}".`
      });

      publishStatus();
      return false;
    }

    state.previousState = current;
    state.lifecycleState = nextState;
    state.lastUpdatedAt = nowIso();

    if (nextState === STATES.ready) {
      state.ready = true;
    } else if (
      nextState === STATES.held ||
      nextState === STATES.failed ||
      nextState === STATES.authorityConflict ||
      nextState === STATES.destroyed
    ) {
      state.ready = false;
    }

    syncRootState();

    dispatch(EVENTS.state, {
      reason: safeString(reason, 240),
      previousState: current
    });

    publishStatus();

    return true;
  }

  function syncRootState() {
    if (!state.root) {
      return;
    }

    state.root.dataset.houseState =
      state.lifecycleState;

    state.root.dataset.houseReady =
      state.ready ? "true" : "false";

    state.root.dataset.houseOpen =
      state.open ? "true" : "false";

    state.root.dataset.houseDegraded =
      state.lifecycleState === STATES.degraded
        ? "true"
        : "false";

    state.root.dataset.houseHold =
      state.lifecycleState === STATES.held
        ? "true"
        : "false";

    state.root.dataset.houseError =
      state.lifecycleState === STATES.failed
        ? "true"
        : "false";

    state.root.dataset.houseContract =
      CONTRACT;

    state.root.dataset.houseSelectedType =
      state.selectedType;

    state.root.dataset.houseSelectedId =
      state.selectedId;

    state.root.dataset.houseContext =
      state.activeContext;
  }

  function detectCssContract() {
    const propertyName =
      state.options.cssContractProperty;

    let detected = "";

    try {
      const rootStyle = global.getComputedStyle(
        state.root || document.documentElement
      );

      detected = stripWrappingQuotes(
        rootStyle
          .getPropertyValue(propertyName)
          .trim()
      );

      if (!detected) {
        const documentStyle = global.getComputedStyle(
          document.documentElement
        );

        detected = stripWrappingQuotes(
          documentStyle
            .getPropertyValue(propertyName)
            .trim()
        );
      }
    } catch (_error) {
      detected = "";
    }

    state.styleState = detected
      ? "loaded"
      : "unverified";

    if (state.root) {
      state.root.dataset.houseCssDetected =
        detected ? "true" : "false";

      state.root.dataset.houseCssContract =
        detected;
    }

    return detected;
  }

  function configureMutationObserver() {
    if (state.mutationObserver) {
      state.mutationObserver.disconnect();
      state.mutationObserver = null;
    }

    if (
      !state.options.observeDynamicDoors ||
      typeof global.MutationObserver !== "function"
    ) {
      return;
    }

    let scheduled = false;

    const observer = new global.MutationObserver(() => {
      if (scheduled || state.destroyed) {
        return;
      }

      scheduled = true;

      const timer = global.setTimeout(() => {
        state.timers.delete(timer);
        scheduled = false;
        state.doorCount = document.querySelectorAll(
          SELECTORS.door
        ).length;
        publishStatus();
      }, 50);

      state.timers.add(timer);
    });

    observer.observe(
      document.documentElement,
      {
        childList: true,
        subtree: true
      }
    );

    state.mutationObserver = observer;
    state.observers.push(observer);
  }

  function configureReducedMotionQuery() {
    if (typeof global.matchMedia !== "function") {
      return;
    }

    const query = global.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    state.reducedMotionQuery = query;

    if (typeof query.addEventListener === "function") {
      addManagedListener(
        query,
        "change",
        () => {
          if (state.root) {
            state.root.dataset.houseReducedMotion =
              query.matches ? "true" : "false";
          }
        }
      );
    }

    if (state.root) {
      state.root.dataset.houseReducedMotion =
        query.matches ? "true" : "false";
    }
  }

  function prefersReducedMotion() {
    return Boolean(
      state.reducedMotionQuery &&
      state.reducedMotionQuery.matches
    );
  }

  function applyBackgroundCustody() {
    if (!state.root || !document.body) {
      return;
    }

    state.backgroundRecords = [];

    const children = Array.from(
      document.body.children
    );

    for (const child of children) {
      if (child === state.root) {
        continue;
      }

      const record = {
        element: child,
        hadInertAttribute:
          child.hasAttribute("inert"),
        inertValue:
          "inert" in child
            ? Boolean(child.inert)
            : null,
        ariaHidden:
          child.getAttribute("aria-hidden")
      };

      state.backgroundRecords.push(record);

      try {
        if ("inert" in child) {
          child.inert = true;
        } else {
          child.setAttribute(
            "aria-hidden",
            "true"
          );
        }
      } catch (_error) {
        // Continue applying custody to remaining elements.
      }
    }
  }

  function restoreBackgroundCustody() {
    for (const record of state.backgroundRecords) {
      const element = record.element;

      if (!element || !element.isConnected) {
        continue;
      }

      try {
        if (
          "inert" in element &&
          record.inertValue !== null
        ) {
          element.inert = record.inertValue;
        }

        if (record.hadInertAttribute) {
          element.setAttribute("inert", "");
        } else if (!record.inertValue) {
          element.removeAttribute("inert");
        }

        if (record.ariaHidden === null) {
          element.removeAttribute("aria-hidden");
        } else {
          element.setAttribute(
            "aria-hidden",
            record.ariaHidden
          );
        }
      } catch (_error) {
        // Continue restoring remaining elements.
      }
    }

    state.backgroundRecords = [];
  }

  function lockDocumentScroll() {
    const html = document.documentElement;
    const body = document.body;

    if (!html || !body) {
      return;
    }

    if (!html.hasAttribute("data-house-scroll-lock")) {
      html.dataset.housePreviousOverflow =
        html.style.overflow || "";

      body.dataset.housePreviousOverflow =
        body.style.overflow || "";

      html.style.overflow = "hidden";
      body.style.overflow = "hidden";

      html.setAttribute(
        "data-house-scroll-lock",
        "true"
      );
    }
  }

  function unlockDocumentScroll() {
    const html = document.documentElement;
    const body = document.body;

    if (!html || !body) {
      return;
    }

    if (
      html.getAttribute("data-house-scroll-lock") !== "true"
    ) {
      return;
    }

    html.style.overflow =
      html.dataset.housePreviousOverflow || "";

    body.style.overflow =
      body.dataset.housePreviousOverflow || "";

    delete html.dataset.housePreviousOverflow;
    delete body.dataset.housePreviousOverflow;

    html.removeAttribute(
      "data-house-scroll-lock"
    );
  }

  function forceCloseForDestroy() {
    state.open = false;

    if (state.root) {
      state.root.hidden = true;
      state.root.setAttribute("aria-hidden", "true");
      state.root.dataset.houseOpen = "false";
    }

    restoreBackgroundCustody();
    unlockDocumentScroll();
    restoreFocus();
  }

  function clearAllTimers() {
    for (const timer of state.timers) {
      global.clearTimeout(timer);
      global.clearInterval(timer);
    }

    state.timers.clear();
  }

  function addManagedListener(
    target,
    type,
    handler,
    options
  ) {
    if (
      !target ||
      typeof target.addEventListener !== "function"
    ) {
      return false;
    }

    const exists = state.listeners.some(
      (record) => (
        record.target === target &&
        record.type === type &&
        record.handler === handler
      )
    );

    if (exists) {
      return false;
    }

    target.addEventListener(
      type,
      handler,
      options
    );

    state.listeners.push({
      target,
      type,
      handler,
      options
    });

    return true;
  }

  function removeManagedListener(
    target,
    type,
    handler
  ) {
    const remaining = [];

    for (const record of state.listeners) {
      if (
        record.target === target &&
        record.type === type &&
        record.handler === handler
      ) {
        try {
          record.target.removeEventListener(
            record.type,
            record.handler,
            record.options
          );
        } catch (_error) {
          // Continue removing remaining listeners.
        }
      } else {
        remaining.push(record);
      }
    }

    state.listeners = remaining;
  }

  function removeAllManagedListeners() {
    for (const record of state.listeners) {
      try {
        record.target.removeEventListener(
          record.type,
          record.handler,
          record.options
        );
      } catch (_error) {
        // Continue removing remaining listeners.
      }
    }

    state.listeners = [];
  }

  function disconnectAllObservers() {
    for (const observer of state.observers) {
      try {
        observer.disconnect();
      } catch (_error) {
        // Continue disconnecting remaining observers.
      }
    }

    state.observers = [];
    state.mutationObserver = null;
  }

  function updateHeading(model) {
    if (!state.root) {
      return;
    }

    const title = state.root.querySelector(
      "[data-house-title]"
    );

    const description = state.root.querySelector(
      "[data-house-description]"
    );

    const eyebrow = state.root.querySelector(
      "[data-house-eyebrow]"
    );

    const settings = model.settings || {};

    if (title) {
      title.textContent =
        settings.title ||
        model.estate.label;
    }

    if (description) {
      description.textContent =
        settings.description ||
        model.estate.description ||
        "Choose a room or avatar to continue through the Estate.";
    }

    if (eyebrow) {
      eyebrow.textContent =
        settings.eyebrow ||
        model.estate.eyebrow ||
        "House Control Pad";
    }
  }

  function updateStatusMessage(message) {
    if (state.statusNode) {
      state.statusNode.textContent = safeString(
        message,
        state.options.maxTextLength
      );
    }
  }

  function dispatch(
    eventName,
    extraDetail,
    options
  ) {
    const detail = Object.freeze({
      contract: CONTRACT,
      state: state.lifecycleState,
      previousState: state.previousState,
      context: state.activeContext,
      targetType: "",
      targetId: "",
      route: "",
      reason: "",
      dataContract:
        state.validData
          ? state.validData.contract
          : "",
      heldCount: state.heldItems.length,
      warningCount: state.warnings.length,
      errorCount: state.errors.length,
      timestamp: nowIso(),
      ...clonePlain(extraDetail || {})
    });

    const event = new CustomEvent(
      eventName,
      {
        detail,
        bubbles: false,
        cancelable:
          Boolean(options && options.cancelable),
        composed: false
      }
    );

    document.dispatchEvent(event);

    if (state.root && state.root.isConnected) {
      state.root.dispatchEvent(
        new CustomEvent(
          eventName,
          {
            detail,
            bubbles: false,
            cancelable:
              Boolean(options && options.cancelable),
            composed: false
          }
        )
      );
    }

    return event;
  }

  function dispatchDocumentEvent(
    eventName,
    detail
  ) {
    document.dispatchEvent(
      new CustomEvent(
        eventName,
        {
          detail: Object.freeze(
            clonePlain(detail || {})
          ),
          bubbles: false,
          cancelable: false,
          composed: false
        }
      )
    );
  }

  function publishStatus() {
    state.lastUpdatedAt = nowIso();

    const snapshot = Object.freeze(
      buildStatusSnapshot()
    );

    safeDefineStatusGlobal(snapshot);
    syncRootState();

    return snapshot;
  }

  function safeDefineStatusGlobal(snapshot) {
    try {
      Object.defineProperty(
        global,
        STATUS_GLOBAL,
        {
          configurable: true,
          enumerable: false,
          writable: false,
          value: snapshot
        }
      );
    } catch (_error) {
      try {
        global[STATUS_GLOBAL] = snapshot;
      } catch (_secondaryError) {
        // Observability must not break runtime authority.
      }
    }
  }

  function buildStatusSnapshot() {
    return {
      contract: CONTRACT,
      family: CONTROLLER_FAMILY,
      initialized: state.initialized,
      ready: state.ready,
      mounted:
        Boolean(state.root && state.root.isConnected),
      open: state.open,
      state: state.lifecycleState,
      previousState: state.previousState,
      dataContract:
        state.validData
          ? state.validData.contract
          : "",
      dataVersion:
        state.validData
          ? state.validData.version
          : "",
      validRoomCount:
        state.validData
          ? state.validData.rooms.length
          : 0,
      validAvatarCount:
        state.validData
          ? state.validData.avatars.length
          : 0,
      validCorridorCount:
        state.validData
          ? state.validData.corridors.length
          : 0,
      heldItemCount: state.heldItems.length,
      warningCount: state.warnings.length,
      errorCount: state.errors.length,
      doorCount: state.doorCount,
      cssDetected:
        state.styleState === "loaded",
      authorityConflict:
        state.authorityConflict,
      selectedType:
        state.selectedType,
      selectedId:
        state.selectedId,
      openCount:
        state.openCount,
      closeCount:
        state.closeCount,
      routeRequestCount:
        state.routeRequestCount,
      finalReceiptAvailable: false,
      lastUpdatedAt:
        state.lastUpdatedAt
    };
  }

  function enterAuthorityConflict(reason) {
    state.authorityConflict = true;
    state.ready = false;

    transitionTo(
      STATES.authorityConflict,
      reason,
      {
        force: true
      }
    );

    dispatch(EVENTS.authorityConflict, {
      reason
    });

    publishStatus();

    return result(
      false,
      STATES.authorityConflict,
      reason
    );
  }

  function mergeOptions(options) {
    if (!isPlainObject(options)) {
      return;
    }

    const next = {
      ...state.options
    };

    if (
      typeof options.observeDynamicDoors === "boolean"
    ) {
      next.observeDynamicDoors =
        options.observeDynamicDoors;
    }

    if (
      typeof options.allowBackdropClose === "boolean"
    ) {
      next.allowBackdropClose =
        options.allowBackdropClose;
    }

    if (
      typeof options.preserveSelectionOnClose === "boolean"
    ) {
      next.preserveSelectionOnClose =
        options.preserveSelectionOnClose;
    }

    if (
      typeof options.selectBeforeRoute === "boolean"
    ) {
      next.selectBeforeRoute =
        options.selectBeforeRoute;
    }

    if (
      typeof options.allowExternalRoutes === "boolean"
    ) {
      next.allowExternalRoutes =
        options.allowExternalRoutes;
    }

    if (
      typeof options.debug === "boolean"
    ) {
      next.debug =
        options.debug;
    }

    if (
      Number.isFinite(
        options.closeTransitionTimeoutMs
      ) &&
      options.closeTransitionTimeoutMs >= 0 &&
      options.closeTransitionTimeoutMs <= 10000
    ) {
      next.closeTransitionTimeoutMs =
        options.closeTransitionTimeoutMs;
    }

    state.options = next;
  }

  function validateRoute(rawRoute, allowExternal) {
    const route = safeString(
      rawRoute,
      state.options.maxTextLength
    );

    if (!route) {
      return result(
        false,
        state.lifecycleState,
        "Route must be a nonempty string."
      );
    }

    const lowered = route
      .trim()
      .toLowerCase();

    if (
      lowered.startsWith("javascript:") ||
      lowered.startsWith("data:") ||
      lowered.startsWith("vbscript:") ||
      lowered.startsWith("file:")
    ) {
      return result(
        false,
        state.lifecycleState,
        "Unsafe route scheme rejected."
      );
    }

    try {
      const url = new URL(
        route,
        global.location.href
      );

      const sameOrigin =
        url.origin === global.location.origin;

      if (!sameOrigin) {
        const permitted =
          allowExternal === true &&
          state.options.allowExternalRoutes === true;

        if (!permitted) {
          return result(
            false,
            state.lifecycleState,
            "External route is not authorized."
          );
        }

        if (
          !["http:", "https:"].includes(
            url.protocol
          )
        ) {
          return result(
            false,
            state.lifecycleState,
            "External route protocol is not authorized."
          );
        }

        return {
          ok: true,
          route: url.href,
          kind: "external"
        };
      }

      return {
        ok: true,
        route:
          url.pathname +
          url.search +
          url.hash,
        kind: "internal"
      };
    } catch (_error) {
      return result(
        false,
        state.lifecycleState,
        "Route could not be parsed."
      );
    }
  }

  function validateOptionalResourceUrl(rawUrl) {
    const url = safeString(
      rawUrl,
      state.options.maxTextLength
    );

    if (!url) {
      return {
        ok: true,
        url: ""
      };
    }

    try {
      const parsed = new URL(
        url,
        global.location.href
      );

      if (
        !["http:", "https:"].includes(
          parsed.protocol
        )
      ) {
        return {
          ok: false,
          url: ""
        };
      }

      return {
        ok: true,
        url:
          parsed.origin === global.location.origin
            ? parsed.pathname +
              parsed.search +
              parsed.hash
            : parsed.href
      };
    } catch (_error) {
      return {
        ok: false,
        url: ""
      };
    }
  }

  function isEligibleDoorActivation(event, door) {
    if (!door || door.nodeType !== 1) {
      return false;
    }

    if (
      door.hasAttribute("disabled") ||
      door.getAttribute("aria-disabled") === "true"
    ) {
      return false;
    }

    if (
      event.type === "click" &&
      (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
    ) {
      return false;
    }

    if (door.hasAttribute("download")) {
      return false;
    }

    const target = safeString(
      door.getAttribute("target"),
      40
    );

    if (target && target !== "_self") {
      return false;
    }

    return true;
  }

  function createElement(tagName, config) {
    const element = document.createElement(
      tagName
    );

    const source = config || {};

    if (source.className) {
      element.className =
        source.className;
    }

    if (source.text !== undefined) {
      element.textContent = safeString(
        source.text,
        state.options.maxTextLength
      );
    }

    if (isPlainObject(source.attributes)) {
      for (
        const [name, value]
        of Object.entries(source.attributes)
      ) {
        if (
          value === undefined ||
          value === null
        ) {
          continue;
        }

        element.setAttribute(
          name,
          String(value)
        );
      }
    }

    return element;
  }

  function createSvgElement(
    tagName,
    attributes
  ) {
    const element = document.createElementNS(
      SVG_NS,
      tagName
    );

    if (isPlainObject(attributes)) {
      for (
        const [name, value]
        of Object.entries(attributes)
      ) {
        if (
          value === undefined ||
          value === null
        ) {
          continue;
        }

        element.setAttribute(
          name,
          String(value)
        );
      }
    }

    return element;
  }

  function clearElement(element) {
    if (!element) {
      return;
    }

    while (element.firstChild) {
      element.removeChild(
        element.firstChild
      );
    }
  }

  function getFocusableElements(container) {
    if (!container) {
      return [];
    }

    const selector = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "[tabindex]:not([tabindex='-1'])",
      "[contenteditable='true']"
    ].join(",");

    return Array.from(
      container.querySelectorAll(selector)
    ).filter(isFocusable);
  }

  function isFocusable(element) {
    if (
      !element ||
      element.nodeType !== 1 ||
      element.hidden ||
      element.getAttribute("aria-hidden") === "true" ||
      element.getAttribute("aria-disabled") === "true" ||
      element.hasAttribute("disabled")
    ) {
      return false;
    }

    const style = global.getComputedStyle(
      element
    );

    return (
      style.display !== "none" &&
      style.visibility !== "hidden"
    );
  }

  function closestElement(target, selector) {
    if (!target) {
      return null;
    }

    const element =
      target.nodeType === 1
        ? target
        : target.parentElement;

    return (
      element &&
      typeof element.closest === "function"
    )
      ? element.closest(selector)
      : null;
  }

  function isCompatibleController(value) {
    return Boolean(
      value &&
      typeof value === "object" &&
      value.__houseControlPadController === true &&
      value.__houseControlPadFamily === CONTROLLER_FAMILY &&
      typeof value.init === "function" &&
      typeof value.open === "function" &&
      typeof value.close === "function" &&
      typeof value.destroy === "function"
    );
  }

  function isPlainObject(value) {
    if (
      value === null ||
      typeof value !== "object"
    ) {
      return false;
    }

    const prototype = Object.getPrototypeOf(
      value
    );

    return (
      prototype === Object.prototype ||
      prototype === null
    );
  }

  function finiteNumber(value) {
    const number =
      typeof value === "number"
        ? value
        : typeof value === "string" &&
            value.trim() !== ""
          ? Number(value)
          : NaN;

    return Number.isFinite(number)
      ? number
      : null;
  }

  function normalizeVersion(value) {
    if (
      typeof value === "number" &&
      Number.isFinite(value)
    ) {
      return String(value);
    }

    return safeString(
      value,
      120
    );
  }

  function safeString(value, maxLength) {
    if (
      value === undefined ||
      value === null
    ) {
      return "";
    }

    const stringValue = String(value)
      .replace(
        /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,
        ""
      )
      .trim();

    return stringValue.slice(
      0,
      Number.isFinite(maxLength)
        ? maxLength
        : state.options.maxTextLength
    );
  }

  function safeIdentifier(value) {
    const candidate = safeString(
      value,
      160
    );

    if (!candidate) {
      return "";
    }

    return /^[A-Za-z0-9][A-Za-z0-9._:-]{0,159}$/.test(
      candidate
    )
      ? candidate
      : "";
  }

  function safeIdentifierArray(value) {
    if (!Array.isArray(value)) {
      return deepFreeze([]);
    }

    const output = [];
    const seen = new Set();

    for (const entry of value) {
      const id = safeIdentifier(entry);

      if (id && !seen.has(id)) {
        seen.add(id);
        output.push(id);
      }
    }

    return deepFreeze(output);
  }

  function safeStringArray(
    value,
    itemLength
  ) {
    if (!Array.isArray(value)) {
      return deepFreeze([]);
    }

    const output = [];

    for (const entry of value) {
      const stringValue = safeString(
        entry,
        itemLength
      );

      if (stringValue) {
        output.push(stringValue);
      }
    }

    return deepFreeze(output);
  }

  function safeSvgPath(value) {
    const path = safeString(
      value,
      state.options.maxPathLength
    );

    if (!path) {
      return "";
    }

    if (
      !/^[MmLlHhVvCcSsQqTtAaZz0-9eE+.,\-\s]+$/.test(
        path
      )
    ) {
      return "";
    }

    return path;
  }

  function normalizeError(error) {
    if (error instanceof Error) {
      return {
        name: safeString(
          error.name,
          120
        ),
        message: safeString(
          error.message,
          1000
        )
      };
    }

    return {
      name: "Error",
      message:
        safeString(error, 1000) ||
        "Unknown error"
    };
  }

  function result(
    ok,
    resultState,
    reason,
    extra
  ) {
    return Object.freeze({
      ok: Boolean(ok),
      state:
        resultState ||
        state.lifecycleState,
      reason: safeString(
        reason,
        1000
      ),
      targetId: "",
      route: "",
      heldItems: clonePlain(
        state.heldItems
      ),
      error: null,
      ...clonePlain(extra || {})
    });
  }

  function addWarning(message) {
    if (
      state.warnings.length >=
      state.options.maxWarnings
    ) {
      return;
    }

    state.warnings.push(
      safeString(
        message,
        1000
      )
    );

    debugLog(
      "warn",
      message
    );
  }

  function addError(message) {
    if (
      state.errors.length >=
      state.options.maxErrors
    ) {
      return;
    }

    state.errors.push(
      safeString(
        message,
        1000
      )
    );

    debugLog(
      "error",
      message
    );
  }

  function debugLog(level, message) {
    if (
      !state.options.debug ||
      !global.console
    ) {
      return;
    }

    const method =
      typeof global.console[level] === "function"
        ? global.console[level]
        : global.console.log;

    method.call(
      global.console,
      `[${CONTRACT}] ${safeString(message, 1000)}`
    );
  }

  function clonePlain(value, seen) {
    if (
      value === null ||
      typeof value !== "object"
    ) {
      return value;
    }

    const memory = seen || new WeakMap();

    if (memory.has(value)) {
      return "[Circular]";
    }

    memory.set(value, true);

    if (Array.isArray(value)) {
      return value.map(
        (entry) => clonePlain(entry, memory)
      );
    }

    if (value instanceof Map) {
      return Array.from(
        value.entries()
      ).map(
        ([key, entry]) => ([
          clonePlain(key, memory),
          clonePlain(entry, memory)
        ])
      );
    }

    if (
      value.nodeType ||
      value === global ||
      value === document
    ) {
      return undefined;
    }

    const output = {};

    for (
      const [key, entry]
      of Object.entries(value)
    ) {
      const cloned = clonePlain(
        entry,
        memory
      );

      if (cloned !== undefined) {
        output[key] = cloned;
      }
    }

    return output;
  }

  function deepFreeze(value, seen) {
    if (
      value === null ||
      typeof value !== "object" ||
      Object.isFrozen(value)
    ) {
      return value;
    }

    const memory = seen || new WeakSet();

    if (memory.has(value)) {
      return value;
    }

    memory.add(value);

    if (value instanceof Map) {
      for (
        const [key, entry]
        of value.entries()
      ) {
        deepFreeze(key, memory);
        deepFreeze(entry, memory);
      }

      return Object.freeze(value);
    }

    for (
      const entry
      of Object.values(value)
    ) {
      deepFreeze(entry, memory);
    }

    return Object.freeze(value);
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function stripWrappingQuotes(value) {
    if (
      value.length >= 2 &&
      (
        (
          value.startsWith('"') &&
          value.endsWith('"')
        ) ||
        (
          value.startsWith("'") &&
          value.endsWith("'")
        )
      )
    ) {
      return value.slice(1, -1);
    }

    return value;
  }

  function cssEscape(value) {
    if (
      global.CSS &&
      typeof global.CSS.escape === "function"
    ) {
      return global.CSS.escape(value);
    }

    return String(value).replace(
      /[^A-Za-z0-9_-]/g,
      (character) => `\\${character}`
    );
  }

  function autoBoot() {
    const boot = () => {
      if (
        !state.destroyed &&
        global[PUBLIC_GLOBAL] === controller
      ) {
        init();
      }
    };

    if (document.readyState === "loading") {
      document.addEventListener(
        "DOMContentLoaded",
        boot,
        {
          once: true
        }
      );
    } else {
      boot();
    }
  }
})(window, document);

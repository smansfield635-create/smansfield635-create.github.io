/* TARGET FILE: /showroom/index.destinations.js */
/* TNT FULL-FILE REPLACEMENT */
/* SHOWROOM_DESTINATION_EXECUTOR_TNT_v1_1_0 */

(() => {
  "use strict";

  const CONTRACT =
    "SHOWROOM_DESTINATION_EXECUTOR_TNT_v1";

  const MODULE_ID =
    "SHOWROOM_DESTINATION_EXECUTOR";

  const VERSION =
    "1.1.0-local-constellation-direct-execution";

  const OWNER =
    "/showroom/index.destinations.js";

  const GLOBAL_GUARD =
    "__SHOWROOM_DESTINATION_EXECUTOR_BOOTSTRAP__";

  const existingGuard =
    window[GLOBAL_GUARD];

  if (
    existingGuard &&
    existingGuard.contract === CONTRACT &&
    existingGuard.moduleId === MODULE_ID &&
    existingGuard.version === VERSION &&
    existingGuard.owner === OWNER
  ) {
    return;
  }

  Object.defineProperty(
    window,
    GLOBAL_GUARD,
    {
      configurable: true,
      enumerable: false,
      writable: false,
      value: Object.freeze({
        contract: CONTRACT,
        moduleId: MODULE_ID,
        version: VERSION,
        owner: OWNER
      })
    }
  );

  const CONTROLLER_GLOBAL =
    "SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER";

  const CONTROLLER_ID =
    "SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER";

  const CONTROLLER_VERSION =
    "7.0.0-controller-interaction-semantic-priority";

  const CONTROLLER_FILE =
    "/showroom/index.controller.js";

  const REQUEST_EVENT =
    "SHOWROOM_ARCHCOIN_DESTINATION_ENTRY_REQUESTED";

  const REQUEST_CONTRACT =
    "SHOWROOM_ARCHCOIN_DESTINATION_ENTRY_REQUEST_v1";

  const EVENTS = Object.freeze({
    ready: "SHOWROOM_DESTINATIONS_READY",
    failure: "SHOWROOM_DESTINATIONS_FAILURE",
    disposed: "SHOWROOM_DESTINATIONS_DISPOSED",
    receipt: "SHOWROOM_DESTINATIONS_RECEIPT"
  });

  const OUTCOMES = Object.freeze({
    initialized: "INITIALIZED",
    requestRejected: "REQUEST_REJECTED",
    localExecuted: "LOCAL_DESTINATION_EXECUTED",
    dialogOpened: "DIALOG_OPENED",
    dialogCancelled: "DIALOG_CANCELLED",
    externalConfirmed: "EXTERNAL_NAVIGATION_CONFIRMED",
    executionFailed: "EXECUTION_FAILED",
    disposed: "DISPOSED"
  });

  const OPERATIONS = Object.freeze({
    scrollAnchor: "scroll-anchor",
    openDisclosureAndScroll: "open-disclosure-and-scroll",
    openFrontAndActivateWindow: "open-front-and-activate-window",
    openFrontAndScroll: "open-front-and-scroll",
    scrollLocalSurface: "scroll-local-surface",
    confirmedHardNavigation: "confirmed-hard-navigation"
  });

  const DESTINATION_TYPES = Object.freeze({
    localAnchor: "local-anchor",
    localDisclosureTarget: "local-disclosure-target",
    localWindowExperience: "local-window-experience",
    localDiamondExperience: "local-diamond-experience",
    localNarrativeSurface: "local-narrative-surface",
    externalRoute: "external-route"
  });

  const LOCAL_KIND_TO_OPERATION = Object.freeze({
    [DESTINATION_TYPES.localAnchor]:
      OPERATIONS.scrollAnchor,

    [DESTINATION_TYPES.localDisclosureTarget]:
      OPERATIONS.openDisclosureAndScroll,

    [DESTINATION_TYPES.localWindowExperience]:
      OPERATIONS.openFrontAndActivateWindow,

    [DESTINATION_TYPES.localDiamondExperience]:
      OPERATIONS.openFrontAndScroll,

    [DESTINATION_TYPES.localNarrativeSurface]:
      OPERATIONS.scrollLocalSurface
  });

  const OPERATION_DESTINATION_TYPES = Object.freeze({
    [OPERATIONS.scrollAnchor]:
      Object.freeze([DESTINATION_TYPES.localAnchor]),

    [OPERATIONS.openDisclosureAndScroll]:
      Object.freeze([DESTINATION_TYPES.localDisclosureTarget]),

    [OPERATIONS.openFrontAndActivateWindow]:
      Object.freeze([DESTINATION_TYPES.localWindowExperience]),

    [OPERATIONS.openFrontAndScroll]:
      Object.freeze([DESTINATION_TYPES.localDiamondExperience]),

    [OPERATIONS.scrollLocalSurface]:
      Object.freeze([DESTINATION_TYPES.localNarrativeSurface]),

    [OPERATIONS.confirmedHardNavigation]:
      Object.freeze([DESTINATION_TYPES.externalRoute])
  });

  const SUPPORTED_OPERATIONS =
    Object.freeze(Object.values(OPERATIONS));

  const PAYLOAD_KEYS = Object.freeze([
    "contract",
    "controllerId",
    "controllerVersion",
    "controllerFile",
    "sourceState",
    "wingId",
    "wingLabel",
    "roomId",
    "destinationType",
    "destinationId",
    "contentId",
    "route",
    "localTarget",
    "openAncestor",
    "informationFront",
    "confirmationRequired",
    "operationType",
    "label",
    "lens",
    "preview",
    "whyEnter",
    "semanticActivation",
    "routeDescription",
    "routeRole",
    "visualClass",
    "emphasis",
    "returnModel",
    "returnZone",
    "authorizationGeneration",
    "timestamp"
  ]);

  const SELECTORS = Object.freeze({
    root: "[data-showroom-root]",
    receipt: "[data-showroom-destinations-receipt]",
    controllerEnter: "[data-showroom-controller-enter]",
    portal: "[data-showroom-fallback-portal]",
    childControl: "[data-showroom-child-control]",
    dialog: "[data-showroom-route-dialog]",
    dialogTitle: "[data-showroom-route-dialog-title]",
    dialogDescription: "[data-showroom-route-dialog-description]",
    close: "[data-showroom-route-close]",
    stay: "[data-showroom-route-stay]",
    continue: "[data-showroom-route-continue]",
    forbiddenSemanticActivation: [
      "[data-showroom-cardinal-control]",
      "[data-showroom-child-control]",
      "[data-showroom-compass-control]",
      "[data-showroom-compass-selection-alias]"
    ].join(",")
  });

  const MAX_CONSUMED_KEYS =
    64;

  const MAX_REQUEST_AGE_MS =
    5000;

  const LOCAL_IN_FLIGHT_MS =
    750;

  const state = {
    root: null,
    receipt: null,
    controllerEnter: null,
    dialog: null,
    dialogTitle: null,
    dialogDescription: null,
    closeButton: null,
    stayButton: null,
    continueButton: null,
    portals: [],
    pending: null,
    activator: null,
    confirmationLocked: false,
    initialized: false,
    initializing: false,
    failed: false,
    disposed: false,
    listeners: [],
    consumedKeys: new Map(),
    localInFlightKeys: new Map()
  };

  function normalize(value) {
    return String(value == null ? "" : value).trim();
  }

  function normalizeLower(value) {
    return normalize(value).toLowerCase();
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function isElement(value) {
    return (
      typeof Element !== "undefined" &&
      value instanceof Element
    );
  }

  function isPrimitive(value) {
    return (
      value === null ||
      typeof value === "string" ||
      typeof value === "boolean" ||
      (
        typeof value === "number" &&
        Number.isFinite(value)
      )
    );
  }

  function freezeRecord(value) {
    return Object.freeze({
      ...value
    });
  }

  function addListener(target, type, handler, options) {
    if (
      !target ||
      typeof target.addEventListener !== "function"
    ) {
      return false;
    }

    target.addEventListener(type, handler, options);

    state.listeners.push(() => {
      target.removeEventListener(type, handler, options);
    });

    return true;
  }

  function removeListeners() {
    for (const remove of state.listeners.splice(0)) {
      try {
        remove();
      } catch {
        /* Best-effort cleanup. */
      }
    }
  }

  function dispatch(eventName, detail) {
    const payload =
      freezeRecord({
        contract: CONTRACT,
        moduleId: MODULE_ID,
        version: VERSION,
        owner: OWNER,
        timestamp: nowIso(),
        ...detail
      });

    window.dispatchEvent(
      new CustomEvent(
        eventName,
        {
          detail: payload
        }
      )
    );

    return payload;
  }

  function publishReceipt(outcome, detail = {}) {
    const payload =
      freezeRecord({
        contract: CONTRACT,
        moduleId: MODULE_ID,
        version: VERSION,
        owner: OWNER,
        outcome,
        timestamp: nowIso(),
        ...detail
      });

    if (state.receipt) {
      const serialized =
        JSON.stringify(payload);

      if ("value" in state.receipt) {
        state.receipt.value =
          serialized;
      }

      state.receipt.textContent =
        serialized;
    }

    dispatch(EVENTS.receipt, payload);

    return payload;
  }

  function failRequest(reason, detail = {}) {
    publishReceipt(
      OUTCOMES.requestRejected,
      {
        reason:
          normalize(reason) ||
          "REQUEST_REJECTED",

        ...detail
      }
    );

    return false;
  }

  function failExecution(reason, detail = {}) {
    publishReceipt(
      OUTCOMES.executionFailed,
      {
        reason:
          normalize(reason) ||
          "EXECUTION_FAILED",

        ...detail
      }
    );

    return false;
  }

  function queryExactlyOne(
    selector,
    {
      root = document,
      required = true
    } = {}
  ) {
    const normalized =
      normalize(selector);

    if (!normalized) {
      if (required) {
        throw new Error(
          "DESTINATION_SELECTOR_REQUIRED"
        );
      }

      return null;
    }

    let matches;

    try {
      matches =
        root.querySelectorAll(normalized);
    } catch {
      throw new Error(
        `DESTINATION_SELECTOR_INVALID:${normalized}`
      );
    }

    if (
      matches.length === 0 &&
      !required
    ) {
      return null;
    }

    if (matches.length !== 1) {
      throw new Error(
        matches.length === 0
          ? `DESTINATION_TARGET_NOT_FOUND:${normalized}`
          : `DESTINATION_TARGET_AMBIGUOUS:${normalized}`
      );
    }

    return matches[0];
  }

  function parseBooleanAttribute(value) {
    const normalized =
      normalizeLower(value);

    if (normalized === "true") {
      return true;
    }

    if (normalized === "false") {
      return false;
    }

    return null;
  }

  function validateSameOriginRoute(route) {
    const normalized =
      normalize(route);

    if (
      !normalized ||
      !normalized.startsWith("/") ||
      normalized.startsWith("//")
    ) {
      throw new Error(
        "DESTINATION_ROUTE_INVALID"
      );
    }

    let url;

    try {
      url =
        new URL(
          normalized,
          window.location.origin
        );
    } catch {
      throw new Error(
        "DESTINATION_ROUTE_MALFORMED"
      );
    }

    if (
      url.origin !== window.location.origin ||
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password
    ) {
      throw new Error(
        "DESTINATION_ROUTE_NOT_SAME_ORIGIN"
      );
    }

    return (
      url.pathname +
      url.search +
      url.hash
    );
  }

  function validateLocalSelector(selector) {
    const normalized =
      normalize(selector);

    if (
      !normalized ||
      !normalized.startsWith("#")
    ) {
      throw new Error(
        "DESTINATION_LOCAL_SELECTOR_INVALID"
      );
    }

    return normalized;
  }

  function validateNullableAbsent(value, code) {
    if (
      value !== null &&
      normalize(value)
    ) {
      throw new Error(code);
    }
  }

  function validateRequiredSelectorValue(value, code) {
    const normalized =
      normalize(value);

    if (
      !normalized ||
      !normalized.startsWith("#")
    ) {
      throw new Error(code);
    }
  }

  function validateOperationCorrespondence(payload) {
    const allowedTypes =
      OPERATION_DESTINATION_TYPES[
        payload.operationType
      ];

    if (
      !allowedTypes ||
      !allowedTypes.includes(
        payload.destinationType
      )
    ) {
      throw new Error(
        "DESTINATION_OPERATION_TYPE_MISMATCH"
      );
    }

    const isExternal =
      payload.operationType ===
      OPERATIONS.confirmedHardNavigation;

    if (isExternal) {
      if (
        payload.confirmationRequired !== true
      ) {
        throw new Error(
          "DESTINATION_EXTERNAL_CONFIRMATION_REQUIRED"
        );
      }

      validateNullableAbsent(
        payload.localTarget,
        "DESTINATION_EXTERNAL_LOCAL_TARGET_FORBIDDEN"
      );

      validateNullableAbsent(
        payload.openAncestor,
        "DESTINATION_EXTERNAL_OPEN_ANCESTOR_FORBIDDEN"
      );

      validateNullableAbsent(
        payload.informationFront,
        "DESTINATION_EXTERNAL_INFORMATION_FRONT_FORBIDDEN"
      );

      validateNullableAbsent(
        payload.semanticActivation,
        "DESTINATION_EXTERNAL_SEMANTIC_ACTIVATION_FORBIDDEN"
      );

      return true;
    }

    if (
      payload.destinationType ===
      DESTINATION_TYPES.externalRoute
    ) {
      throw new Error(
        "DESTINATION_LOCAL_EXTERNAL_TYPE_FORBIDDEN"
      );
    }

    if (
      payload.confirmationRequired !== false
    ) {
      throw new Error(
        "DESTINATION_LOCAL_CONFIRMATION_FORBIDDEN"
      );
    }

    validateRequiredSelectorValue(
      payload.localTarget,
      "DESTINATION_LOCAL_TARGET_REQUIRED"
    );

    switch (payload.operationType) {
      case OPERATIONS.scrollAnchor:
      case OPERATIONS.scrollLocalSurface:
        validateNullableAbsent(
          payload.openAncestor,
          "DESTINATION_LOCAL_OPEN_ANCESTOR_FORBIDDEN"
        );

        validateNullableAbsent(
          payload.informationFront,
          "DESTINATION_LOCAL_INFORMATION_FRONT_FORBIDDEN"
        );

        validateNullableAbsent(
          payload.semanticActivation,
          "DESTINATION_LOCAL_SEMANTIC_ACTIVATION_FORBIDDEN"
        );
        break;

      case OPERATIONS.openDisclosureAndScroll:
        validateRequiredSelectorValue(
          payload.openAncestor,
          "DESTINATION_DISCLOSURE_ANCESTOR_REQUIRED"
        );

        validateNullableAbsent(
          payload.informationFront,
          "DESTINATION_DISCLOSURE_INFORMATION_FRONT_FORBIDDEN"
        );

        validateNullableAbsent(
          payload.semanticActivation,
          "DESTINATION_DISCLOSURE_SEMANTIC_ACTIVATION_FORBIDDEN"
        );
        break;

      case OPERATIONS.openFrontAndScroll:
        validateRequiredSelectorValue(
          payload.informationFront,
          "DESTINATION_INFORMATION_FRONT_REQUIRED"
        );

        validateNullableAbsent(
          payload.openAncestor,
          "DESTINATION_FRONT_OPEN_ANCESTOR_FORBIDDEN"
        );

        validateNullableAbsent(
          payload.semanticActivation,
          "DESTINATION_FRONT_SEMANTIC_ACTIVATION_FORBIDDEN"
        );
        break;

      case OPERATIONS.openFrontAndActivateWindow:
        validateRequiredSelectorValue(
          payload.informationFront,
          "DESTINATION_INFORMATION_FRONT_REQUIRED"
        );

        validateNullableAbsent(
          payload.openAncestor,
          "DESTINATION_FRONT_OPEN_ANCESTOR_FORBIDDEN"
        );

        if (!normalize(payload.semanticActivation)) {
          throw new Error(
            "DESTINATION_SEMANTIC_ACTIVATION_REQUIRED"
          );
        }
        break;

      default:
        throw new Error(
          "DESTINATION_OPERATION_UNSUPPORTED"
        );
    }

    return true;
  }

  function validateRouteFragment(route, target) {
    const routeUrl =
      new URL(route, window.location.origin);

    if (
      routeUrl.pathname !==
      window.location.pathname
    ) {
      throw new Error(
        "DESTINATION_LOCAL_ROUTE_PATH_MISMATCH"
      );
    }

    if (
      routeUrl.hash &&
      target.id &&
      routeUrl.hash !== `#${target.id}`
    ) {
      throw new Error(
        "DESTINATION_LOCAL_ROUTE_FRAGMENT_MISMATCH"
      );
    }
  }

  function getController() {
    const controller =
      window[CONTROLLER_GLOBAL];

    if (
      !controller ||
      typeof controller !== "object" ||
      controller.moduleId !== CONTROLLER_ID ||
      controller.moduleVersion !== CONTROLLER_VERSION ||
      typeof controller.getFrameState !== "function"
    ) {
      return null;
    }

    return controller;
  }

  function validateControllerPayloadShape(payload) {
    if (
      !payload ||
      typeof payload !== "object" ||
      Array.isArray(payload)
    ) {
      throw new Error(
        "DESTINATION_PAYLOAD_OBJECT_REQUIRED"
      );
    }

    if (Object.isFrozen(payload) !== true) {
      throw new Error(
        "DESTINATION_PAYLOAD_NOT_FROZEN"
      );
    }

    const keys =
      Object.keys(payload);

    if (keys.length !== PAYLOAD_KEYS.length) {
      throw new Error(
        "DESTINATION_PAYLOAD_KEY_COUNT_INVALID"
      );
    }

    for (const key of PAYLOAD_KEYS) {
      if (
        !Object.prototype.hasOwnProperty.call(
          payload,
          key
        )
      ) {
        throw new Error(
          `DESTINATION_PAYLOAD_KEY_MISSING:${key}`
        );
      }

      if (!isPrimitive(payload[key])) {
        throw new Error(
          `DESTINATION_PAYLOAD_VALUE_INVALID:${key}`
        );
      }
    }

    for (const key of keys) {
      if (!PAYLOAD_KEYS.includes(key)) {
        throw new Error(
          `DESTINATION_PAYLOAD_KEY_UNEXPECTED:${key}`
        );
      }
    }

    if (
      payload.contract !== REQUEST_CONTRACT ||
      payload.controllerId !== CONTROLLER_ID ||
      payload.controllerVersion !== CONTROLLER_VERSION ||
      payload.controllerFile !== CONTROLLER_FILE ||
      payload.sourceState !== "ROOM_SELECTED"
    ) {
      throw new Error(
        "DESTINATION_PAYLOAD_IDENTITY_INVALID"
      );
    }

    if (
      !Number.isSafeInteger(payload.authorizationGeneration) ||
      payload.authorizationGeneration < 0
    ) {
      throw new Error(
        "DESTINATION_AUTHORIZATION_GENERATION_INVALID"
      );
    }

    const timestamp =
      Date.parse(payload.timestamp);

    if (Number.isNaN(timestamp)) {
      throw new Error(
        "DESTINATION_TIMESTAMP_INVALID"
      );
    }

    if (
      Date.now() - timestamp >
      MAX_REQUEST_AGE_MS
    ) {
      throw new Error(
        "DESTINATION_REQUEST_EXPIRED"
      );
    }

    if (
      !SUPPORTED_OPERATIONS.includes(
        payload.operationType
      )
    ) {
      throw new Error(
        "DESTINATION_OPERATION_UNSUPPORTED"
      );
    }

    validateOperationCorrespondence(payload);
    validateSameOriginRoute(payload.route);

    return true;
  }

  function validateControllerCorrespondence(payload) {
    const controller =
      getController();

    if (!controller) {
      throw new Error(
        "DESTINATION_CONTROLLER_UNAVAILABLE"
      );
    }

    let frame;

    try {
      frame =
        controller.getFrameState();
    } catch {
      throw new Error(
        "DESTINATION_CONTROLLER_FRAME_UNAVAILABLE"
      );
    }

    if (
      !frame ||
      typeof frame !== "object" ||
      frame.held !== false ||
      frame.navigationState !== "ROOM_SELECTED" ||
      frame.compassSelected !== false ||
      frame.selectedRoom !== payload.roomId ||
      frame.selectedCardinal !== payload.wingId ||
      frame.selectedDestinationId !== payload.destinationId ||
      frame.selectedRoute !== payload.route ||
      frame.selectedContentId !== payload.contentId ||
      frame.selectedLens !== payload.lens
    ) {
      throw new Error(
        "DESTINATION_CONTROLLER_STATE_STALE"
      );
    }

    return frame;
  }

  function requestKey(request) {
    return [
      request.sourceType,
      request.controllerId || "",
      request.controllerVersion || "",
      request.roomId || "",
      request.route,
      request.operationType,
      String(request.authorizationGeneration ?? "")
    ].join("|");
  }

  function localRequestKey(request) {
    return [
      request.sourceType,
      request.destinationId || "",
      request.route,
      request.operationType
    ].join("|");
  }

  function rememberConsumedKey(key) {
    state.consumedKeys.set(key, Date.now());

    while (
      state.consumedKeys.size >
      MAX_CONSUMED_KEYS
    ) {
      const oldest =
        state.consumedKeys.keys().next().value;

      state.consumedKeys.delete(oldest);
    }
  }

  function isConsumed(key) {
    return state.consumedKeys.has(key);
  }

  function markLocalInFlight(key) {
    const now =
      Date.now();

    for (
      const [storedKey, timestamp]
      of state.localInFlightKeys
    ) {
      if (
        now - timestamp >
        LOCAL_IN_FLIGHT_MS
      ) {
        state.localInFlightKeys.delete(storedKey);
      }
    }

    if (state.localInFlightKeys.has(key)) {
      return false;
    }

    state.localInFlightKeys.set(key, now);

    return true;
  }

  function clearLocalInFlight(key) {
    state.localInFlightKeys.delete(key);
  }

  function readReducedMotion() {
    const controller =
      getController();

    if (
      controller &&
      typeof controller.getReducedMotion === "function"
    ) {
      try {
        return Boolean(controller.getReducedMotion());
      } catch {
        /* Use media-query fallback. */
      }
    }

    return Boolean(
      window.matchMedia &&
      window
        .matchMedia("(prefers-reduced-motion: reduce)")
        .matches
    );
  }

  function scrollToTarget(target) {
    target.scrollIntoView({
      behavior:
        readReducedMotion()
          ? "auto"
          : "smooth",
      block: "start",
      inline: "nearest"
    });
  }

  function updateFragment(route) {
    const url =
      new URL(route, window.location.origin);

    if (
      !url.hash ||
      url.hash === window.location.hash
    ) {
      return;
    }

    window.history.pushState(
      null,
      "",
      (
        window.location.pathname +
        window.location.search +
        url.hash
      )
    );
  }

  function preflightLocalTarget(request) {
    const selector =
      validateLocalSelector(request.localTarget);

    const target =
      queryExactlyOne(selector);

    validateRouteFragment(
      request.route,
      target
    );

    return target;
  }

  function preflightDisclosure(request) {
    const selector =
      validateLocalSelector(request.openAncestor);

    const ancestor =
      queryExactlyOne(selector);

    if (!("open" in ancestor)) {
      throw new Error(
        "DESTINATION_DISCLOSURE_NOT_OPEN_CAPABLE"
      );
    }

    return ancestor;
  }

  function elementIsVisiblyAvailable(element) {
    if (
      !element ||
      !element.isConnected ||
      element.hidden
    ) {
      return false;
    }

    const style =
      window.getComputedStyle(element);

    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      style.visibility !== "collapse"
    );
  }

  function preflightInformationFront(request) {
    const selector =
      validateLocalSelector(request.informationFront);

    const front =
      queryExactlyOne(selector);

    if (!front.isConnected) {
      throw new Error(
        "DESTINATION_INFORMATION_FRONT_DISCONNECTED"
      );
    }

    return front;
  }

  function preflightSemanticActivation(request) {
    const selector =
      normalize(request.semanticActivation);

    if (!selector) {
      throw new Error(
        "DESTINATION_SEMANTIC_ACTIVATION_REQUIRED"
      );
    }

    const target =
      queryExactlyOne(selector);

    if (
      target.matches(
        SELECTORS.forbiddenSemanticActivation
      )
    ) {
      throw new Error(
        "DESTINATION_SEMANTIC_ACTIVATION_FORBIDDEN"
      );
    }

    if (
      ![
        "BUTTON",
        "A",
        "INPUT",
        "SELECT",
        "TEXTAREA",
        "SUMMARY"
      ].includes(target.tagName) ||
      target.matches(":disabled") ||
      target.getAttribute("aria-disabled") === "true" ||
      !elementIsVisiblyAvailable(target)
    ) {
      throw new Error(
        "DESTINATION_SEMANTIC_ACTIVATION_UNAVAILABLE"
      );
    }

    return target;
  }

  function executeLocalRequest(request) {
    let target;
    let disclosure;
    let informationFront;
    let semanticTarget;

    switch (request.operationType) {
      case OPERATIONS.scrollAnchor:
      case OPERATIONS.scrollLocalSurface:
        target =
          preflightLocalTarget(request);
        break;

      case OPERATIONS.openDisclosureAndScroll:
        disclosure =
          preflightDisclosure(request);

        target =
          preflightLocalTarget(request);

        if (!disclosure.contains(target)) {
          throw new Error(
            "DESTINATION_TARGET_OUTSIDE_DISCLOSURE"
          );
        }
        break;

      case OPERATIONS.openFrontAndScroll:
        informationFront =
          preflightInformationFront(request);

        target =
          preflightLocalTarget(request);
        break;

      case OPERATIONS.openFrontAndActivateWindow:
        informationFront =
          preflightInformationFront(request);

        semanticTarget =
          preflightSemanticActivation(request);

        target =
          preflightLocalTarget(request);
        break;

      default:
        throw new Error(
          "DESTINATION_LOCAL_OPERATION_UNSUPPORTED"
        );
    }

    if (disclosure) {
      disclosure.open =
        true;
    }

    if (
      informationFront &&
      !informationFront.isConnected
    ) {
      throw new Error(
        "DESTINATION_INFORMATION_FRONT_DISCONNECTED"
      );
    }

    if (semanticTarget) {
      semanticTarget.click();
    }

    scrollToTarget(target);
    updateFragment(request.route);

    return true;
  }

  function focusElement(element) {
    if (
      !element ||
      !element.isConnected ||
      typeof element.focus !== "function"
    ) {
      return;
    }

    window.requestAnimationFrame(() => {
      if (!element.isConnected) {
        return;
      }

      try {
        element.focus({
          preventScroll: true
        });
      } catch {
        element.focus();
      }
    });
  }

  function clearPending({
    restoreFocus = false,
    closeDialog = false
  } = {}) {
    const activator =
      state.activator;

    state.pending =
      null;

    state.activator =
      null;

    state.confirmationLocked =
      false;

    if (state.continueButton) {
      state.continueButton.disabled =
        true;
    }

    if (
      closeDialog &&
      state.dialog &&
      state.dialog.open
    ) {
      try {
        state.dialog.close();
      } catch {
        /* Best-effort closure. */
      }
    }

    if (restoreFocus) {
      focusElement(activator);
    }
  }

  function resolveControllerActivator() {
    const active =
      document.activeElement;

    if (
      isElement(active) &&
      active !== document.body &&
      active !== document.documentElement
    ) {
      return active;
    }

    return (
      state.controllerEnter ||
      null
    );
  }

  function prepareDialog(request, activator) {
    if (
      !state.dialog ||
      !state.dialogTitle ||
      !state.dialogDescription ||
      !state.continueButton
    ) {
      throw new Error(
        "DESTINATION_DIALOG_UNAVAILABLE"
      );
    }

    if (
      state.dialog.open ||
      state.pending
    ) {
      clearPending({
        restoreFocus: false,
        closeDialog: true
      });
    }

    state.pending =
      freezeRecord({
        ...request
      });

    state.activator =
      isElement(activator)
        ? activator
        : resolveControllerActivator();

    state.confirmationLocked =
      false;

    state.dialogTitle.textContent =
      `Continue to ${request.label}?`;

    state.dialogDescription.textContent =
      request.routeDescription;

    state.continueButton.disabled =
      false;

    state.dialog.showModal();

    window.requestAnimationFrame(() => {
      if (
        state.dialog.open &&
        state.continueButton &&
        !state.continueButton.disabled
      ) {
        state.continueButton.focus();
      }
    });

    publishReceipt(
      OUTCOMES.dialogOpened,
      {
        sourceType: request.sourceType,
        roomId: request.roomId || "",
        destinationId: request.destinationId || "",
        operationType: request.operationType,
        route: request.route,
        requestKey: request.key
      }
    );

    return true;
  }

  function cancelDialog(reason) {
    const pending =
      state.pending;

    clearPending({
      restoreFocus: true,
      closeDialog: true
    });

    publishReceipt(
      OUTCOMES.dialogCancelled,
      {
        reason:
          normalize(reason) ||
          "cancelled",

        sourceType:
          pending
            ? pending.sourceType
            : "",

        route:
          pending
            ? pending.route
            : ""
      }
    );

    return true;
  }

  function createControllerRequest(payload) {
    validateControllerPayloadShape(payload);
    validateControllerCorrespondence(payload);

    const validatedRoute =
      validateSameOriginRoute(payload.route);

    const request =
      freezeRecord({
        sourceType: "controller",
        contract: payload.contract,
        controllerId: payload.controllerId,
        controllerVersion: payload.controllerVersion,
        roomId: payload.roomId,
        wingId: payload.wingId,
        destinationType: payload.destinationType,
        destinationId: payload.destinationId,
        contentId: payload.contentId,
        route: validatedRoute,
        localTarget: payload.localTarget,
        openAncestor: payload.openAncestor,
        informationFront: payload.informationFront,
        confirmationRequired: payload.confirmationRequired,
        operationType: payload.operationType,
        semanticActivation: payload.semanticActivation,
        label: normalize(payload.label),
        lens: payload.lens,
        routeDescription: normalize(payload.routeDescription),
        authorizationGeneration: payload.authorizationGeneration,
        timestamp: payload.timestamp
      });

    return freezeRecord({
      ...request,
      key: requestKey(request)
    });
  }

  function createPortalRequest(control) {
    const destinationType =
      normalizeLower(
        control.dataset.showroomDestinationKind
      );

    const route =
      validateSameOriginRoute(
        control.dataset.showroomRoute
      );

    const label =
      normalize(
        control.dataset.showroomRouteLabel
      );

    const description =
      normalize(
        control.dataset.showroomRouteDescription
      );

    const confirmationRequired =
      parseBooleanAttribute(
        control.dataset.showroomRouteConfirmationRequired
      );

    const immediateNavigation =
      parseBooleanAttribute(
        control.dataset.showroomImmediateNavigation
      );

    const ariaControls =
      normalize(
        control.getAttribute("aria-controls")
      );

    if (
      destinationType !== DESTINATION_TYPES.externalRoute ||
      !label ||
      !description ||
      confirmationRequired !== true ||
      immediateNavigation !== false
    ) {
      throw new Error(
        "DESTINATION_PORTAL_METADATA_INVALID"
      );
    }

    if (
      !state.dialog.id ||
      ariaControls !== state.dialog.id
    ) {
      throw new Error(
        "DESTINATION_PORTAL_DIALOG_CORRESPONDENCE_INVALID"
      );
    }

    const request =
      freezeRecord({
        sourceType: "fallback-portal",
        controllerId: "",
        controllerVersion: "",
        roomId: "",
        wingId: "",
        destinationType,
        destinationId:
          normalize(
            control.dataset.showroomContentId
          ),
        contentId:
          normalize(
            control.dataset.showroomContentId
          ),
        route,
        localTarget: null,
        openAncestor: null,
        informationFront: null,
        confirmationRequired: true,
        operationType: OPERATIONS.confirmedHardNavigation,
        semanticActivation: null,
        label,
        lens: "",
        routeDescription: description,
        authorizationGeneration: null,
        timestamp: nowIso()
      });

    return freezeRecord({
      ...request,
      key: requestKey(request)
    });
  }

  function createLocalControlRequest(control) {
    const destinationType =
      normalizeLower(
        control.dataset.showroomDestinationKind
      );

    if (
      destinationType ===
      DESTINATION_TYPES.externalRoute
    ) {
      return null;
    }

    const operationType =
      LOCAL_KIND_TO_OPERATION[
        destinationType
      ];

    if (!operationType) {
      return null;
    }

    const route =
      validateSameOriginRoute(
        control.dataset.showroomControllerRoute ||
        control.dataset.showroomRoute
      );

    const request =
      freezeRecord({
        sourceType: "constellation-local-control",
        controllerId: "",
        controllerVersion: "",
        roomId:
          normalize(
            control.dataset.showroomChildId
          ),
        wingId:
          normalizeLower(
            control.dataset.showroomCardinalId
          ),
        destinationType,
        destinationId:
          normalize(
            control.dataset.showroomContentId ||
            control.dataset.showroomChildId
          ),
        contentId:
          normalize(
            control.dataset.showroomContentId
          ),
        route,
        localTarget:
          normalize(
            control.dataset.showroomTarget
          ) || null,
        openAncestor:
          normalize(
            control.dataset.showroomOpenAncestor
          ) || null,
        informationFront:
          normalize(
            control.dataset.showroomRequiredFront
          ) || null,
        confirmationRequired: false,
        operationType,
        semanticActivation:
          normalize(
            control.dataset.showroomSemanticActivation
          ) || null,
        label:
          normalize(
            control.dataset.showroomChildLabel ||
            control.textContent
          ),
        lens:
          normalizeLower(
            control.dataset.showroomLens
          ),
        routeDescription: "",
        authorizationGeneration: null,
        timestamp: nowIso()
      });

    validateOperationCorrespondence(request);
    validateSameOriginRoute(request.route);

    return freezeRecord({
      ...request,
      key: localRequestKey(request)
    });
  }

  function processControllerRequest(event) {
    if (
      state.disposed ||
      state.failed ||
      !state.initialized
    ) {
      return;
    }

    let request;

    try {
      request =
        createControllerRequest(event.detail);

      if (isConsumed(request.key)) {
        throw new Error(
          "DESTINATION_REQUEST_ALREADY_CONSUMED"
        );
      }

      if (
        state.pending &&
        state.pending.key === request.key
      ) {
        throw new Error(
          "DESTINATION_REQUEST_ALREADY_PENDING"
        );
      }

      if (
        request.operationType ===
        OPERATIONS.confirmedHardNavigation
      ) {
        prepareDialog(
          request,
          resolveControllerActivator()
        );

        return;
      }

      executeLocalRequest(request);
      rememberConsumedKey(request.key);

      publishReceipt(
        OUTCOMES.localExecuted,
        {
          sourceType: request.sourceType,
          roomId: request.roomId,
          destinationId: request.destinationId,
          operationType: request.operationType,
          route: request.route,
          authorizationGeneration: request.authorizationGeneration,
          requestKey: request.key
        }
      );
    } catch (error) {
      failRequest(
        error instanceof Error
          ? error.message
          : String(error),
        {
          sourceType: "controller",
          roomId:
            request
              ? request.roomId
              : "",
          operationType:
            request
              ? request.operationType
              : "",
          route:
            request
              ? request.route
              : ""
        }
      );
    }
  }

  function handleLocalConstellationActivation(event) {
    if (
      state.disposed ||
      state.failed ||
      !state.initialized ||
      event.defaultPrevented
    ) {
      return;
    }

    const target =
      isElement(event.target)
        ? event.target
        : null;

    const control =
      target
        ? target.closest(SELECTORS.childControl)
        : null;

    if (
      !control ||
      !state.root.contains(control) ||
      !control.isConnected ||
      control.matches(":disabled") ||
      control.getAttribute("aria-disabled") === "true"
    ) {
      return;
    }

    const destinationType =
      normalizeLower(
        control.dataset.showroomDestinationKind
      );

    if (
      destinationType ===
      DESTINATION_TYPES.externalRoute
    ) {
      return;
    }

    let request;

    try {
      request =
        createLocalControlRequest(control);

      if (!request) {
        return;
      }

      if (!markLocalInFlight(request.key)) {
        return;
      }

      window.requestAnimationFrame(() => {
        try {
          executeLocalRequest(request);

          publishReceipt(
            OUTCOMES.localExecuted,
            {
              sourceType: request.sourceType,
              destinationType: request.destinationType,
              destinationId: request.destinationId,
              operationType: request.operationType,
              route: request.route,
              localTarget: request.localTarget || "",
              requestKey: request.key
            }
          );
        } catch (error) {
          failExecution(
            error instanceof Error
              ? error.message
              : String(error),
            {
              sourceType:
                "constellation-local-control",
              destinationType:
                request.destinationType,
              destinationId:
                request.destinationId,
              operationType:
                request.operationType,
              route:
                request.route,
              localTarget:
                request.localTarget || ""
            }
          );
        } finally {
          clearLocalInFlight(request.key);
        }
      });
    } catch (error) {
      if (request && request.key) {
        clearLocalInFlight(request.key);
      }

      failRequest(
        error instanceof Error
          ? error.message
          : String(error),
        {
          sourceType:
            "constellation-local-control",
          route:
            request
              ? request.route
              : normalize(
                  control.dataset.showroomControllerRoute ||
                  control.dataset.showroomRoute
                )
        }
      );
    }
  }

  function handlePortalClick(event) {
    if (
      state.disposed ||
      state.failed ||
      !state.initialized
    ) {
      return;
    }

    const target =
      isElement(event.target)
        ? event.target
        : null;

    const control =
      target
        ? target.closest(SELECTORS.portal)
        : null;

    if (
      !control ||
      !state.portals.includes(control)
    ) {
      return;
    }

    event.preventDefault();

    let request;

    try {
      request =
        createPortalRequest(control);

      if (isConsumed(request.key)) {
        throw new Error(
          "DESTINATION_PORTAL_ALREADY_CONSUMED"
        );
      }

      if (
        state.pending &&
        state.pending.key === request.key
      ) {
        throw new Error(
          "DESTINATION_PORTAL_ALREADY_PENDING"
        );
      }

      prepareDialog(request, control);
    } catch (error) {
      failRequest(
        error instanceof Error
          ? error.message
          : String(error),
        {
          sourceType: "fallback-portal",
          route:
            request
              ? request.route
              : normalize(
                  control.dataset.showroomRoute
                )
        }
      );
    }
  }

  function handleContinue() {
    const pending =
      state.pending;

    if (
      !pending ||
      state.confirmationLocked ||
      state.continueButton.disabled
    ) {
      return;
    }

    state.confirmationLocked =
      true;

    state.continueButton.disabled =
      true;

    try {
      if (
        pending.sourceType === "controller"
      ) {
        validateControllerCorrespondence(pending);
      }

      const route =
        validateSameOriginRoute(pending.route);

      if (isConsumed(pending.key)) {
        throw new Error(
          "DESTINATION_REQUEST_ALREADY_CONSUMED"
        );
      }

      window.location.assign(route);

      rememberConsumedKey(pending.key);

      publishReceipt(
        OUTCOMES.externalConfirmed,
        {
          sourceType: pending.sourceType,
          roomId: pending.roomId || "",
          destinationId: pending.destinationId || "",
          operationType: pending.operationType,
          route,
          authorizationGeneration:
            pending.authorizationGeneration,
          requestKey: pending.key
        }
      );
    } catch (error) {
      clearPending({
        restoreFocus: true,
        closeDialog: true
      });

      failExecution(
        error instanceof Error
          ? error.message
          : String(error),
        {
          sourceType: pending.sourceType,
          roomId: pending.roomId || "",
          route: pending.route
        }
      );
    }
  }

  function handleDialogCancel(event) {
    event.preventDefault();

    cancelDialog("escape");
  }

  function discoverDom() {
    state.root =
      queryExactlyOne(SELECTORS.root);

    state.receipt =
      queryExactlyOne(
        SELECTORS.receipt,
        {
          root: state.root,
          required: false
        }
      );

    state.controllerEnter =
      queryExactlyOne(
        SELECTORS.controllerEnter,
        {
          root: state.root,
          required: false
        }
      );

    state.dialog =
      queryExactlyOne(SELECTORS.dialog);

    state.dialogTitle =
      queryExactlyOne(SELECTORS.dialogTitle);

    state.dialogDescription =
      queryExactlyOne(SELECTORS.dialogDescription);

    state.closeButton =
      queryExactlyOne(SELECTORS.close);

    state.stayButton =
      queryExactlyOne(SELECTORS.stay);

    state.continueButton =
      queryExactlyOne(SELECTORS.continue);

    state.portals =
      Array.from(
        document.querySelectorAll(SELECTORS.portal)
      );
  }

  function validateDialogContainment() {
    for (
      const [node, code]
      of [
        [
          state.dialogTitle,
          "DESTINATION_DIALOG_TITLE_OUTSIDE_DIALOG"
        ],
        [
          state.dialogDescription,
          "DESTINATION_DIALOG_DESCRIPTION_OUTSIDE_DIALOG"
        ],
        [
          state.closeButton,
          "DESTINATION_DIALOG_CLOSE_OUTSIDE_DIALOG"
        ],
        [
          state.stayButton,
          "DESTINATION_DIALOG_STAY_OUTSIDE_DIALOG"
        ],
        [
          state.continueButton,
          "DESTINATION_DIALOG_CONTINUE_OUTSIDE_DIALOG"
        ]
      ]
    ) {
      if (!state.dialog.contains(node)) {
        throw new Error(code);
      }
    }
  }

  function validateStaticContract() {
    if (
      !(state.dialog instanceof HTMLDialogElement)
    ) {
      throw new Error(
        "DESTINATION_DIALOG_ELEMENT_INVALID"
      );
    }

    validateDialogContainment();

    if (state.portals.length !== 8) {
      throw new Error(
        `DESTINATION_PORTAL_COUNT_INVALID:${state.portals.length}`
      );
    }

    if (
      state.dialog.getAttribute("aria-labelledby") !==
        state.dialogTitle.id ||
      state.dialog.getAttribute("aria-describedby") !==
        state.dialogDescription.id
    ) {
      throw new Error(
        "DESTINATION_DIALOG_ARIA_CORRESPONDENCE_INVALID"
      );
    }

    for (const portal of state.portals) {
      createPortalRequest(portal);
    }

    state.continueButton.disabled =
      true;
  }

  function bindListeners() {
    addListener(
      document,
      REQUEST_EVENT,
      processControllerRequest
    );

    addListener(
      document,
      "click",
      handleLocalConstellationActivation,
      true
    );

    addListener(
      document,
      "click",
      handlePortalClick
    );

    addListener(
      state.closeButton,
      "click",
      () => {
        cancelDialog("close");
      }
    );

    addListener(
      state.stayButton,
      "click",
      () => {
        cancelDialog("stay");
      }
    );

    addListener(
      state.continueButton,
      "click",
      handleContinue
    );

    addListener(
      state.dialog,
      "cancel",
      handleDialogCancel
    );

    addListener(
      window,
      "pagehide",
      event => {
        if (!event.persisted) {
          dispose("pagehide");
        }
      }
    );
  }

  function exposeApi() {
    const api =
      Object.freeze({
        contract: CONTRACT,
        moduleId: MODULE_ID,
        moduleVersion: VERSION,
        owner: OWNER,

        getState() {
          return freezeRecord({
            initialized: state.initialized,
            failed: state.failed,
            disposed: state.disposed,
            portalCount: state.portals.length,
            dialogOpen:
              Boolean(
                state.dialog &&
                state.dialog.open
              ),
            pending:
              state.pending
                ? freezeRecord({
                    sourceType:
                      state.pending.sourceType,
                    roomId:
                      state.pending.roomId || "",
                    destinationId:
                      state.pending.destinationId || "",
                    operationType:
                      state.pending.operationType,
                    route:
                      state.pending.route
                  })
                : null,
            confirmationLocked:
              state.confirmationLocked,
            consumedRequestCount:
              state.consumedKeys.size,
            localInFlightCount:
              state.localInFlightKeys.size
          });
        },

        cancelPending(reason = "api") {
          if (!state.pending) {
            return false;
          }

          return cancelDialog(
            `api:${normalize(reason) || "cancel"}`
          );
        },

        dispose
      });

    Object.defineProperty(
      window,
      "SHOWROOM_DESTINATIONS",
      {
        configurable: true,
        enumerable: false,
        writable: false,
        value: api
      }
    );
  }

  function removeApi() {
    const api =
      window.SHOWROOM_DESTINATIONS;

    if (
      api &&
      api.contract === CONTRACT &&
      api.moduleId === MODULE_ID &&
      api.moduleVersion === VERSION &&
      api.owner === OWNER
    ) {
      try {
        delete window.SHOWROOM_DESTINATIONS;
      } catch {
        /* Best-effort removal. */
      }
    }
  }

  function removeGlobalGuard() {
    const guard =
      window[GLOBAL_GUARD];

    if (
      guard &&
      guard.contract === CONTRACT &&
      guard.moduleId === MODULE_ID &&
      guard.version === VERSION &&
      guard.owner === OWNER
    ) {
      try {
        delete window[GLOBAL_GUARD];
      } catch {
        /* Best-effort removal. */
      }
    }
  }

  function dispose(reason = "api") {
    if (state.disposed) {
      return true;
    }

    state.disposed =
      true;

    removeListeners();

    clearPending({
      restoreFocus: true,
      closeDialog: true
    });

    state.consumedKeys.clear();
    state.localInFlightKeys.clear();
    state.portals = [];

    removeApi();
    removeGlobalGuard();

    state.initialized =
      false;

    publishReceipt(
      OUTCOMES.disposed,
      {
        reason:
          normalize(reason) ||
          "api",
        listenersRemoved: true,
        pendingCleared: true
      }
    );

    dispatch(
      EVENTS.disposed,
      {
        reason:
          normalize(reason) ||
          "api"
      }
    );

    return true;
  }

  function rollbackInitialization(error) {
    removeListeners();

    clearPending({
      restoreFocus: false,
      closeDialog: true
    });

    if (state.continueButton) {
      state.continueButton.disabled =
        true;
    }

    removeApi();
    removeGlobalGuard();

    state.initialized =
      false;

    state.initializing =
      false;

    state.failed =
      true;

    const reason =
      error instanceof Error
        ? error.message
        : String(error);

    publishReceipt(
      OUTCOMES.executionFailed,
      {
        phase: "initialization",
        reason
      }
    );

    dispatch(
      EVENTS.failure,
      {
        phase: "initialization",
        reason
      }
    );
  }

  function initialize() {
    if (
      state.initialized ||
      state.initializing ||
      state.disposed
    ) {
      return;
    }

    state.initializing =
      true;

    try {
      discoverDom();
      validateStaticContract();
      bindListeners();
      exposeApi();

      state.initialized =
        true;

      state.initializing =
        false;

      state.failed =
        false;

      publishReceipt(
        OUTCOMES.initialized,
        {
          controllerEvent: REQUEST_EVENT,
          controllerContract: REQUEST_CONTRACT,
          portalSelector: SELECTORS.portal,
          childControlSelector: SELECTORS.childControl,
          portalCount: state.portals.length,
          dialogSelector: SELECTORS.dialog,
          localConstellationDirectExecution: true,
          localConstellationListenerCapture: true,
          fullyImplementedOperations: [
            OPERATIONS.scrollAnchor,
            OPERATIONS.openDisclosureAndScroll,
            OPERATIONS.scrollLocalSurface,
            OPERATIONS.confirmedHardNavigation
          ].join(","),
          conditionallyImplementedOperations: [
            OPERATIONS.openFrontAndScroll,
            OPERATIONS.openFrontAndActivateWindow
          ].join(","),
          listenersBound: true
        }
      );

      dispatch(
        EVENTS.ready,
        {
          controllerEvent: REQUEST_EVENT,
          controllerContract: REQUEST_CONTRACT,
          portalCount: state.portals.length,
          dialogDiscovered: true,
          localConstellationDirectExecution: true,
          localConstellationListenerCapture: true,
          listenersBound: true
        }
      );
    } catch (error) {
      rollbackInitialization(error);
    }
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initialize,
      {
        once: true
      }
    );
  } else {
    initialize();
  }
})();

/*
SHOWROOM_LOCAL_CONSTELLATION_DIRECT_EXECUTION_CONSTRUCTION_RECEIPT

FILE CONSTRUCTED:
/showroom/index.destinations.js

CONTRACT:
SHOWROOM_DESTINATION_EXECUTOR_TNT_v1

MODULE ID:
SHOWROOM_DESTINATION_EXECUTOR

VERSION:
1.1.0-local-constellation-direct-execution

DELEGATED LOCAL LISTENER:
ADDED

LOCAL LISTENER PHASE:
CAPTURE

LOCAL DESTINATION KINDS HANDLED:

- local-anchor
- local-disclosure-target
- local-window-experience
- local-diamond-experience
- local-narrative-surface

EXTERNAL CONSTELLATION CONTROLS:
IGNORED BY LOCAL HANDLER

LOCAL EXECUTION SOURCE:
HTML CONSTELLATION CHILD METADATA

CONTROLLER PAYLOAD VALIDATION:
RETAINED FOR CONTROLLER-ISSUED REQUESTS ONLY

LOCAL HTML REQUEST VALIDATION:
DEDICATED DIRECT-LOCAL REQUEST PATH

LOCAL DEDUPLICATION:
IN-FLIGHT ONLY

REQUESTANIMATIONFRAME SCHEDULING:
SINGLE FRAME RETAINED

WINDOW PUBLIC CONTROL:
PRESERVED THROUGH DECLARED SEMANTIC ACTIVATION ONLY

DIAMOND BEHAVIOR:
DIRECT LOCAL SCROLL ONLY

CONTROLLER MODIFIED:
NO

HTML MODIFIED:
NO

CSS MODIFIED:
NO

INTERACTIONS MODIFIED:
NO

BROWSER VALIDATION:
NOT PERFORMED

DEPLOYED RUNTIME STATUS:
NOT CLAIMED
*/

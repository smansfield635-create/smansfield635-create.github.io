/* TARGET FILE: /showroom/index.controller.js */
/* TNT FULL-FILE REPLACEMENT */
/* SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER_TNT_v5 */
/*
  Bounded correction pass against the last full candidate.

  Controller authority:
  - canonical semantic state;
  - compact immutable frame state;
  - diagnostic state;
  - semantic transitions;
  - confirmation state;
  - readiness aggregation;
  - native fallback recovery;
  - public controller API.

  Compositor, crystals, and interactions consume controller authority.
  They do not reinterpret or duplicate it.
*/

(() => {
  "use strict";

  const CONTRACT =
    "SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER_TNT_v5";

  const OWNER =
    "/showroom/index.controller.js";

  const MAIN_COMPASS_ROUTE =
    "/index.html";

  const DURABLE_STATES = Object.freeze({
    CONSTELLATION:
      "CONSTELLATION",

    CLUSTER_OPEN:
      "CLUSTER_OPEN",

    LOCAL_DESTINATION:
      "LOCAL_DESTINATION"
  });

  const TRANSIENT_STATES = Object.freeze({
    NONE:
      "NONE",

    ROUTE_CONFIRMATION:
      "ROUTE_CONFIRMATION",

    COMPASS_CONFIRMATION:
      "COMPASS_CONFIRMATION",

    HELD:
      "HELD"
  });

  const PRESENTATION_MODES = Object.freeze({
    CONSTELLATION:
      "constellation",

    CLUSTER:
      "cluster",

    FRONT:
      "front",

    BASELINE:
      "baseline"
  });

  const ENHANCEMENT_STATES = Object.freeze({
    PENDING:
      "enhancement-pending",

    AVAILABLE:
      "enhanced-available",

    ACTIVE:
      "enhanced-active",

    FAILED:
      "enhancement-failed"
  });

  const READINESS_KEYS = Object.freeze({
    controller:
      "controller",

    compositor:
      "compositor",

    crystals:
      "crystals",

    interactions:
      "interactions"
  });

  const EVENTS = Object.freeze({
    controllerReady:
      "showroom:controller-ready",

    controllerReceipt:
      "showroom:controller-receipt",

    stateChanged:
      "showroom:state-changed",

    frameChanged:
      "showroom:frame-state-changed",

    previewChanged:
      "showroom:preview-changed",

    clusterChanged:
      "showroom:cluster-changed",

    frontChanged:
      "showroom:front-changed",

    dialogChanged:
      "showroom:dialog-changed",

    readinessChanged:
      "showroom:enhancement-readiness-changed",

    semanticActivate:
      "showroom:semantic-activate",

    objectActivate:
      "showroom:object-activate",

    compassActivate:
      "showroom:compass-activate",

    clusterExitIntent:
      "showroom:cluster-exit-intent",

    compositorReady:
      "showroom:compositor-ready",

    compositorFailed:
      "showroom:compositor-failed",

    compositorDisposed:
      "showroom:compositor-disposed",

    crystalsReady:
      "showroom:crystals-ready",

    crystalsFailed:
      "showroom:crystals-failed",

    crystalsDisposed:
      "showroom:crystals-disposed",

    interactionsReady:
      "showroom:interactions-ready",

    interactionsFailed:
      "showroom:interactions-failed",

    interactionsDisposed:
      "showroom:interactions-disposed",

    gaugesReady:
      "showroom:gauges-ready",

    windowHeld:
      "showroom:window-held",

    windowReleased:
      "showroom:window-released"
  });

  const SELECTORS = Object.freeze({
    root:
      "[data-showroom-root]",

    receipt:
      "[data-showroom-controller-receipt]",

    validation:
      "[data-showroom-controller-validation]",

    orbit:
      "#showroom-orbit",

    orbitScene:
      "[data-showroom-orbit-scene]",

    orbitField:
      "[data-showroom-orbit-field]",

    semanticLayer:
      "[data-showroom-semantic-star-layer]",

    object:
      "[data-showroom-object]",

    cardinalControl:
      "[data-showroom-cardinal-control]",

    childControl:
      "[data-showroom-child-control]",

    cluster:
      "[data-showroom-cluster]",

    front:
      "[data-showroom-front]",

    frontHost:
      "[data-showroom-front-host]",

    localDestination:
      "[data-showroom-local-destination-surface]",

    fallbackNavigation:
      "[data-showroom-fallback-navigation]",

    fallbackPortal:
      "[data-showroom-fallback-portal]",

    fallbackStarLayer:
      "[data-showroom-fallback-star-layer]",

    fallbackStar:
      "[data-showroom-fallback-star]",

    compassLayer:
      "[data-showroom-compass-layer]",

    compassVisualMount:
      "[data-showroom-compass-visual-mount]",

    compassControl:
      "[data-showroom-compass-control]",

    openCompassDialog:
      "[data-showroom-open-compass-dialog]",

    sharedReturnToCompass:
      "[data-showroom-shared-return-to-compass]",

    accessibleReturnToOrbit:
      "[data-showroom-accessible-orbit-return]",

    sharedReturnToOrbit:
      "[data-showroom-shared-return-to-orbit]",

    legacyReturnToOrbit:
      "[data-showroom-return-to-orbit]",

    routeDialog:
      "[data-showroom-route-dialog]",

    routeDialogTitle:
      "[data-showroom-route-dialog-title]",

    routeDialogDescription:
      "[data-showroom-route-dialog-description]",

    routeClose:
      "[data-showroom-route-close]",

    routeStay:
      "[data-showroom-route-stay]",

    routeContinue:
      "[data-showroom-route-continue]",

    compassDialog:
      "[data-showroom-compass-dialog]",

    compassClose:
      "[data-showroom-compass-close]",

    compassStay:
      "[data-showroom-compass-stay]",

    compassReturn:
      "[data-showroom-compass-return]",

    instructionsDisclosure:
      "[data-showroom-instructions-disclosure]",

    instructionsOpen:
      "[data-showroom-open-instructions]",

    constructionDialog:
      "#construction-record-dialog",

    constructionOpen:
      "[data-open-construction-record]",

    constructionClose:
      "[data-close-construction-record]",

    informationTab:
      "[data-showroom-information-tab]"
  });

  const ATTRIBUTES = Object.freeze({
    controllerReady:
      "data-showroom-controller-ready",

    controllerState:
      "data-showroom-controller-state",

    pageState:
      "data-showroom-state",

    presentationMode:
      "data-showroom-presentation-mode",

    enhancementState:
      "data-showroom-enhancement-state",

    activeCardinal:
      "data-showroom-active-cardinal",

    activeChild:
      "data-showroom-active-child",

    activeCluster:
      "data-showroom-active-cluster",

    activeFront:
      "data-showroom-active-front",

    activeGaugeSet:
      "data-showroom-active-gauge-set",

    activeInformationTab:
      "data-showroom-active-information-tab",

    routeDialogOpen:
      "data-showroom-route-dialog-open",

    compassDialogOpen:
      "data-showroom-compass-dialog-open",

    held:
      "data-showroom-held",

    reducedMotion:
      "data-showroom-reduced-motion",

    compositorReady:
      "data-showroom-compositor-ready",

    crystalsReady:
      "data-showroom-crystals-ready",

    interactionsReady:
      "data-showroom-interactions-ready",

    clusterState:
      "data-showroom-cluster-state",

    clusterActive:
      "data-showroom-cluster-active",

    frontState:
      "data-showroom-front-state",

    dialogState:
      "data-showroom-dialog-state",

    fallbackVisibility:
      "data-showroom-fallback-star-visibility",

    fallbackRendering:
      "data-showroom-fallback-star-rendering",

    objectId:
      "data-showroom-object-id",

    objectBehavior:
      "data-showroom-object-behavior",

    cardinalId:
      "data-showroom-cardinal-id",

    childId:
      "data-showroom-child-id",

    clusterId:
      "data-showroom-cluster-id",

    destinationKind:
      "data-showroom-destination-kind",

    target:
      "data-showroom-target",

    openAncestor:
      "data-showroom-open-ancestor",

    requiredFront:
      "data-showroom-required-front",

    informationTab:
      "data-showroom-information-tab",

    route:
      "data-showroom-route",

    routeLabel:
      "data-showroom-route-label",

    routeDescription:
      "data-showroom-route-description",

    routeConfirmation:
      "data-showroom-route-confirmation-required",

    controllerManagedHidden:
      "data-showroom-controller-managed-hidden"
  });

  const CAPTURED_ATTRIBUTES = Object.freeze([
    "hidden",
    "open",
    "aria-hidden",
    "aria-disabled",
    "aria-expanded",
    "disabled",
    "inert",
    "tabindex",
    ATTRIBUTES.clusterState,
    ATTRIBUTES.clusterActive,
    ATTRIBUTES.frontState,
    ATTRIBUTES.controllerManagedHidden,
    ATTRIBUTES.fallbackVisibility,
    ATTRIBUTES.fallbackRendering,
    ATTRIBUTES.dialogState
  ]);

  const ROOT_CAPTURED_ATTRIBUTES = Object.freeze([
    ATTRIBUTES.controllerReady,
    ATTRIBUTES.controllerState,
    ATTRIBUTES.pageState,
    ATTRIBUTES.presentationMode,
    ATTRIBUTES.enhancementState,
    ATTRIBUTES.activeCardinal,
    ATTRIBUTES.activeChild,
    ATTRIBUTES.activeCluster,
    ATTRIBUTES.activeFront,
    ATTRIBUTES.activeGaugeSet,
    ATTRIBUTES.activeInformationTab,
    ATTRIBUTES.routeDialogOpen,
    ATTRIBUTES.compassDialogOpen,
    ATTRIBUTES.held,
    ATTRIBUTES.reducedMotion,
    ATTRIBUTES.compositorReady,
    ATTRIBUTES.crystalsReady,
    ATTRIBUTES.interactionsReady
  ]);

  const state = {
    root: null,
    receipt: null,
    validation: null,

    orbit: null,
    orbitScene: null,
    orbitField: null,
    semanticLayer: null,
    frontHost: null,

    compassLayer: null,
    compassVisualMount: null,
    compassControls: [],

    routeDialog: null,
    routeDialogTitle: null,
    routeDialogDescription: null,
    routeContinue: null,

    compassDialog: null,
    compassReturn: null,

    instructionsDisclosure: null,
    instructionControls: [],

    constructionDialog: null,

    objects: new Map(),
    cardinals: new Map(),
    children: new Map(),
    clusters: new Map(),
    fronts: new Map(),

    durableState:
      DURABLE_STATES.CONSTELLATION,

    committed: {
      cardinalId: "",
      childId: "",
      clusterId: "",
      localTargetId: "",
      frontId: "",
      gaugeSet: "",
      informationTab: ""
    },

    preview: {
      active: false,
      objectId: "",
      cardinalId: "",
      childId: "",
      clusterId: "",
      source: "",
      token: 0
    },

    pendingRoute: {
      data: null,
      trigger: null,
      generation: 0
    },

    dialogGeneration: {
      route: 0,
      compass: 0,
      construction: 0
    },

    activeDialogGeneration: {
      route: 0,
      compass: 0,
      construction: 0
    },

    lastTriggers: {
      compass: null,
      construction: null,
      instructions: null,
      orbit: null
    },

    readiness: {
      controller: false,
      compositor: false,
      crystals: false,
      interactions: false,

      compositorFailed: false,
      crystalsFailed: false,
      interactionsFailed: false
    },

    nativeDomStates: {
      root: null,

      fronts: new Map(),
      clusters: new Map(),
      cardinals: new Map(),
      fallbackLayers: new Map(),
      fallbackStars: new Map(),

      routeDialog: null,
      routeDialogTitle: null,
      routeDialogDescription: null,
      routeContinue: null,

      compassDialog: null,
      compassControls: new Map(),

      constructionDialog: null,

      instructionsDisclosure: null,
      instructionControls: new Map(),

      temporaryFocusTargets: new Map()
    },

    temporaryFocusCleanups:
      new Map(),

    expectedDialogClose: {
      route: null,
      compass: null,
      construction: null
    },

    held: false,

    reducedMotionQuery: null,
    reducedMotion: false,

    validationIssues: [],

    initialized: false,
    initializing: false,
    disposed: false,
    apiExposed: false,

    listeners: [],
    observers: [],

    activationGuard: {
      key: "",
      timestamp: 0
    },

    counters: {
      previewsBegun: 0,
      previewsCommitted: 0,
      previewsCancelled: 0,
      cardinalCommits: 0,
      childCommits: 0,
      localActivations: 0,
      portalOffers: 0,
      compassOffers: 0,
      returnsToOrbit: 0,
      rejectedActivations: 0,
      readinessChanges: 0
    }
  };

  function normalize(value) {
    return String(value || "").trim();
  }

  function toArray(value) {
    return Array.from(value || []);
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function isElement(value) {
    return value instanceof Element;
  }

  function isPlainObject(value) {
    if (
      value === null ||
      typeof value !== "object"
    ) {
      return false;
    }

    const prototype =
      Object.getPrototypeOf(value);

    return (
      prototype === Object.prototype ||
      prototype === null
    );
  }

  function immutableClone(value) {
    if (
      value === null ||
      typeof value !== "object"
    ) {
      return value;
    }

    if (Array.isArray(value)) {
      return Object.freeze(
        value.map(immutableClone)
      );
    }

    if (!isPlainObject(value)) {
      throw new TypeError(
        "Controller snapshots may contain only plain data."
      );
    }

    const clone = {};

    for (
      const [
        key,
        entry
      ]
      of Object.entries(value)
    ) {
      clone[key] =
        immutableClone(entry);
    }

    return Object.freeze(clone);
  }

  function addListener(
    target,
    type,
    handler,
    options
  ) {
    if (
      !target ||
      typeof target.addEventListener !==
        "function"
    ) {
      return;
    }

    target.addEventListener(
      type,
      handler,
      options
    );

    state.listeners.push(() => {
      target.removeEventListener(
        type,
        handler,
        options
      );
    });
  }

  function addObserver(observer) {
    if (observer) {
      state.observers.push(observer);
    }
  }

  function removeInstalledResources() {
    restoreTemporaryFocusTargets();

    for (
      const removeListener
      of state.listeners.splice(0)
    ) {
      try {
        removeListener();
      } catch {
        /* Best-effort resource rollback. */
      }
    }

    for (
      const observer
      of state.observers.splice(0)
    ) {
      try {
        observer.disconnect();
      } catch {
        /* Best-effort resource rollback. */
      }
    }
  }

  function setRootAttribute(
    name,
    value
  ) {
    if (!state.root) {
      return;
    }

    state.root.setAttribute(
      name,
      String(value)
    );
  }

  function dispatch(
    eventName,
    detail = {}
  ) {
    const payload =
      immutableClone({
        contract:
          CONTRACT,

        owner:
          OWNER,

        timestamp:
          nowIso(),

        ...detail
      });

    window.dispatchEvent(
      new CustomEvent(
        eventName,
        {
          detail:
            payload
        }
      )
    );

    return payload;
  }

  function focusElement(
    element,
    options = {}
  ) {
    if (
      !element ||
      typeof element.focus !==
        "function"
    ) {
      return;
    }

    try {
      element.focus({
        preventScroll:
          options.preventScroll !==
          false
      });
    } catch {
      element.focus();
    }
  }

  function scrollToElement(
    element,
    block = "start"
  ) {
    if (
      !element ||
      typeof element.scrollIntoView !==
        "function"
    ) {
      return;
    }

    element.scrollIntoView({
      behavior:
        state.reducedMotion
          ? "auto"
          : "smooth",

      block,

      inline:
        "nearest"
    });
  }

  function safelyShowModal(dialog) {
    if (!dialog) {
      return false;
    }

    if (dialog.open) {
      return true;
    }

    if (
      typeof dialog.showModal ===
        "function"
    ) {
      dialog.showModal();
      return true;
    }

    dialog.setAttribute(
      "open",
      ""
    );

    return true;
  }

  function safelyCloseDialog(
    dialog,
    returnValue = ""
  ) {
    if (!dialog) {
      return false;
    }

    if (
      dialog.open &&
      typeof dialog.close ===
        "function"
    ) {
      dialog.close(returnValue);
      return true;
    }

    if (dialog.hasAttribute("open")) {
      dialog.removeAttribute("open");
      return true;
    }

    return false;
  }

  function nextDialogGeneration(type) {
    state.dialogGeneration[type] += 1;
    state.activeDialogGeneration[type] =
      state.dialogGeneration[type];

    return state.activeDialogGeneration[type];
  }

  function isDuplicateActivation(
    key,
    threshold = 260
  ) {
    const timestamp =
      performance.now();

    const duplicate =
      state.activationGuard.key === key &&
      timestamp -
        state.activationGuard.timestamp <
        threshold;

    state.activationGuard.key =
      key;

    state.activationGuard.timestamp =
      timestamp;

    return duplicate;
  }

  function captureAttributeState(
    element,
    attributeName
  ) {
    return {
      present:
        element.hasAttribute(
          attributeName
        ),

      value:
        element.getAttribute(
          attributeName
        )
    };
  }

  function captureElementState(
    element,
    options = {}
  ) {
    const attributes = {};

    const attributeNames =
      options.attributeNames ||
      CAPTURED_ATTRIBUTES;

    for (
      const attributeName
      of attributeNames
    ) {
      attributes[attributeName] =
        captureAttributeState(
          element,
          attributeName
        );
    }

    return {
      hiddenProperty:
        "hidden" in element
          ? Boolean(element.hidden)
          : null,

      disabledProperty:
        "disabled" in element
          ? Boolean(element.disabled)
          : null,

      inertProperty:
        "inert" in element
          ? Boolean(element.inert)
          : null,

      openProperty:
        "open" in element
          ? Boolean(element.open)
          : null,

      capturesText:
        Boolean(options.captureText),

      textContent:
        options.captureText
          ? element.textContent
          : null,

      attributes
    };
  }

  function restoreAttributeState(
    element,
    attributeName,
    attributeState
  ) {
    if (!attributeState) {
      return;
    }

    if (attributeState.present) {
      element.setAttribute(
        attributeName,
        attributeState.value === null
          ? ""
          : attributeState.value
      );
    } else {
      element.removeAttribute(
        attributeName
      );
    }
  }

  function restoreElementState(
    element,
    capturedState
  ) {
    if (
      !element ||
      !capturedState
    ) {
      return;
    }

    for (
      const [
        attributeName,
        attributeState
      ]
      of Object.entries(
        capturedState.attributes
      )
    ) {
      restoreAttributeState(
        element,
        attributeName,
        attributeState
      );
    }

    if (
      capturedState.hiddenProperty !== null &&
      "hidden" in element
    ) {
      element.hidden =
        capturedState.hiddenProperty;
    }

    if (
      capturedState.disabledProperty !== null &&
      "disabled" in element
    ) {
      element.disabled =
        capturedState.disabledProperty;
    }

    if (
      capturedState.inertProperty !== null &&
      "inert" in element
    ) {
      element.inert =
        capturedState.inertProperty;
    }

    if (
      capturedState.openProperty !== null &&
      "open" in element
    ) {
      element.open =
        capturedState.openProperty;
    }

    if (capturedState.capturesText) {
      element.textContent =
        capturedState.textContent;
    }
  }

  function captureNativeDomStates() {
    state.nativeDomStates.fronts.clear();
    state.nativeDomStates.clusters.clear();
    state.nativeDomStates.cardinals.clear();
    state.nativeDomStates.fallbackLayers.clear();
    state.nativeDomStates.fallbackStars.clear();
    state.nativeDomStates.compassControls.clear();
    state.nativeDomStates.instructionControls.clear();
    state.nativeDomStates.temporaryFocusTargets.clear();
    state.temporaryFocusCleanups.clear();

    if (state.root) {
      state.nativeDomStates.root =
        captureElementState(
          state.root,
          {
            attributeNames:
              ROOT_CAPTURED_ATTRIBUTES
          }
        );
    }

    for (
      const [
        frontId,
        front
      ]
      of state.fronts
    ) {
      state.nativeDomStates.fronts.set(
        frontId,
        captureElementState(front)
      );
    }

    for (
      const [
        clusterId,
        cluster
      ]
      of state.clusters
    ) {
      state.nativeDomStates.clusters.set(
        clusterId,
        captureElementState(cluster)
      );
    }

    for (
      const [
        cardinalId,
        cardinal
      ]
      of state.cardinals
    ) {
      state.nativeDomStates.cardinals.set(
        cardinalId,
        captureElementState(cardinal)
      );
    }

    for (
      const layer
      of document.querySelectorAll(
        SELECTORS.fallbackStarLayer
      )
    ) {
      state.nativeDomStates.fallbackLayers.set(
        layer,
        captureElementState(layer)
      );
    }

    for (
      const star
      of document.querySelectorAll(
        SELECTORS.fallbackStar
      )
    ) {
      state.nativeDomStates.fallbackStars.set(
        star,
        captureElementState(star)
      );
    }

    if (state.routeDialog) {
      state.nativeDomStates.routeDialog =
        captureElementState(
          state.routeDialog
        );
    }

    if (state.routeDialogTitle) {
      state.nativeDomStates.routeDialogTitle =
        captureElementState(
          state.routeDialogTitle,
          {
            captureText:
              true
          }
        );
    }

    if (state.routeDialogDescription) {
      state.nativeDomStates.routeDialogDescription =
        captureElementState(
          state.routeDialogDescription,
          {
            captureText:
              true
          }
        );
    }

    if (state.routeContinue) {
      state.nativeDomStates.routeContinue =
        captureElementState(
          state.routeContinue,
          {
            captureText:
              true
          }
        );
    }

    if (state.compassDialog) {
      state.nativeDomStates.compassDialog =
        captureElementState(
          state.compassDialog
        );
    }

    for (
      const control
      of state.compassControls
    ) {
      state.nativeDomStates.compassControls.set(
        control,
        captureElementState(control)
      );
    }

    if (state.constructionDialog) {
      state.nativeDomStates.constructionDialog =
        captureElementState(
          state.constructionDialog
        );
    }

    if (state.instructionsDisclosure) {
      state.nativeDomStates.instructionsDisclosure =
        captureElementState(
          state.instructionsDisclosure
        );
    }

    for (
      const control
      of state.instructionControls
    ) {
      state.nativeDomStates.instructionControls.set(
        control,
        captureElementState(control)
      );
    }
  }

  function restoreNativeRootState() {
    restoreElementState(
      state.root,
      state.nativeDomStates.root
    );
  }

  function restoreNativeFrontStates() {
    for (
      const [
        frontId,
        capturedState
      ]
      of state.nativeDomStates.fronts
    ) {
      restoreElementState(
        state.fronts.get(frontId),
        capturedState
      );
    }
  }

  function restoreNativeClusterStates() {
    for (
      const [
        clusterId,
        capturedState
      ]
      of state.nativeDomStates.clusters
    ) {
      restoreElementState(
        state.clusters.get(clusterId),
        capturedState
      );
    }

    for (
      const [
        cardinalId,
        capturedState
      ]
      of state.nativeDomStates.cardinals
    ) {
      restoreElementState(
        state.cardinals.get(cardinalId),
        capturedState
      );
    }
  }

  function restoreNativeFallbackStates() {
    for (
      const [
        layer,
        capturedState
      ]
      of state.nativeDomStates.fallbackLayers
    ) {
      restoreElementState(
        layer,
        capturedState
      );
    }

    for (
      const [
        star,
        capturedState
      ]
      of state.nativeDomStates.fallbackStars
    ) {
      restoreElementState(
        star,
        capturedState
      );
    }
  }

  function restoreNativePresentationStates() {
    restoreNativeFrontStates();
    restoreNativeClusterStates();
    restoreNativeFallbackStates();
  }

  function restoreNativeDialogAndControlStates() {
    restoreElementState(
      state.routeDialog,
      state.nativeDomStates.routeDialog
    );

    restoreElementState(
      state.routeDialogTitle,
      state.nativeDomStates.routeDialogTitle
    );

    restoreElementState(
      state.routeDialogDescription,
      state.nativeDomStates.routeDialogDescription
    );

    restoreElementState(
      state.routeContinue,
      state.nativeDomStates.routeContinue
    );

    restoreElementState(
      state.compassDialog,
      state.nativeDomStates.compassDialog
    );

    restoreElementState(
      state.constructionDialog,
      state.nativeDomStates.constructionDialog
    );

    for (
      const [
        control,
        capturedState
      ]
      of state.nativeDomStates.compassControls
    ) {
      restoreElementState(
        control,
        capturedState
      );
    }

    restoreElementState(
      state.instructionsDisclosure,
      state.nativeDomStates.instructionsDisclosure
    );

    for (
      const [
        control,
        capturedState
      ]
      of state.nativeDomStates.instructionControls
    ) {
      restoreElementState(
        control,
        capturedState
      );
    }
  }

  function cleanupTemporaryFocusTarget(
    heading
  ) {
    const remove =
      state.temporaryFocusCleanups.get(
        heading
      );

    if (remove) {
      try {
        remove();
      } catch {
        /* Best-effort transient cleanup. */
      }

      state.temporaryFocusCleanups.delete(
        heading
      );
    }

    const captured =
      state.nativeDomStates
        .temporaryFocusTargets
        .get(heading);

    restoreElementState(
      heading,
      captured
    );

    state.nativeDomStates
      .temporaryFocusTargets
      .delete(heading);
  }

  function installTemporaryFocusCleanup(
    heading
  ) {
    const existingRemove =
      state.temporaryFocusCleanups.get(
        heading
      );

    if (existingRemove) {
      try {
        existingRemove();
      } catch {
        /* Best-effort replacement cleanup. */
      }

      state.temporaryFocusCleanups.delete(
        heading
      );
    }

    const handler = () => {
      cleanupTemporaryFocusTarget(
        heading
      );
    };

    heading.addEventListener(
      "blur",
      handler,
      {
        once:
          true
      }
    );

    state.temporaryFocusCleanups.set(
      heading,
      () => {
        heading.removeEventListener(
          "blur",
          handler
        );
      }
    );
  }

  function restoreTemporaryFocusTargets() {
    const targets =
      new Set([
        ...state.temporaryFocusCleanups.keys(),
        ...state.nativeDomStates
          .temporaryFocusTargets
          .keys()
      ]);

    for (
      const heading
      of targets
    ) {
      cleanupTemporaryFocusTarget(
        heading
      );
    }

    state.temporaryFocusCleanups.clear();

    state.nativeDomStates
      .temporaryFocusTargets
      .clear();
  }

  function restoreNativeSemanticFallback() {
    restoreNativePresentationStates();
    restoreNativeDialogAndControlStates();
    restoreTemporaryFocusTargets();
  }

  function aggregateEnhancedReady() {
    return (
      state.readiness.controller &&
      state.readiness.compositor &&
      state.readiness.crystals &&
      state.readiness.interactions &&
      !state.disposed
    );
  }

  function aggregateEnhancementFailed() {
    return (
      state.readiness.compositorFailed ||
      state.readiness.crystalsFailed ||
      state.readiness.interactionsFailed
    );
  }

  function currentEnhancementState() {
    if (aggregateEnhancedReady()) {
      return (
        state.durableState ===
          DURABLE_STATES.CONSTELLATION
          ? ENHANCEMENT_STATES.AVAILABLE
          : ENHANCEMENT_STATES.ACTIVE
      );
    }

    if (aggregateEnhancementFailed()) {
      return ENHANCEMENT_STATES.FAILED;
    }

    return ENHANCEMENT_STATES.PENDING;
  }

  function deriveDurableState() {
    return state.durableState;
  }

  function deriveTransientState() {
    if (state.held) {
      return TRANSIENT_STATES.HELD;
    }

    if (
      state.compassDialog &&
      state.compassDialog.open
    ) {
      return TRANSIENT_STATES.COMPASS_CONFIRMATION;
    }

    if (
      state.routeDialog &&
      state.routeDialog.open
    ) {
      return TRANSIENT_STATES.ROUTE_CONFIRMATION;
    }

    return TRANSIENT_STATES.NONE;
  }

  function derivePageState() {
    const transientState =
      deriveTransientState();

    return transientState ===
      TRANSIENT_STATES.NONE
      ? deriveDurableState()
      : transientState;
  }

  function derivePresentationMode() {
    if (!aggregateEnhancedReady()) {
      return PRESENTATION_MODES.BASELINE;
    }

    switch (state.durableState) {
      case DURABLE_STATES.LOCAL_DESTINATION:
        return PRESENTATION_MODES.FRONT;

      case DURABLE_STATES.CLUSTER_OPEN:
        return PRESENTATION_MODES.CLUSTER;

      case DURABLE_STATES.CONSTELLATION:
      default:
        return PRESENTATION_MODES.CONSTELLATION;
    }
  }

  function getFrameState() {
    return immutableClone({
      contract:
        CONTRACT,

      controllerReady:
        state.readiness.controller &&
        !state.disposed,

      disposed:
        state.disposed,

      held:
        state.held,

      reducedMotion:
        state.reducedMotion,

      durableState:
        deriveDurableState(),

      transientState:
        deriveTransientState(),

      pageState:
        derivePageState(),

      presentationMode:
        derivePresentationMode(),

      enhancementState:
        currentEnhancementState(),

      enhancedStageReady:
        aggregateEnhancedReady(),

      activeCardinalId:
        state.committed.cardinalId ||
        null,

      activeChildId:
        state.committed.childId ||
        null,

      activeClusterId:
        state.committed.clusterId ||
        null,

      activeLocalTargetId:
        state.committed.localTargetId ||
        null,

      activeFrontId:
        state.committed.frontId ||
        null,

      activeGaugeSet:
        state.committed.gaugeSet ||
        null,

      activeInformationTab:
        state.committed.informationTab ||
        null,

      pendingRouteId:
        state.pendingRoute.data
          ? state.pendingRoute.data.objectId
          : null,

      preview: {
        active:
          state.preview.active,

        objectId:
          state.preview.objectId ||
          null,

        cardinalId:
          state.preview.cardinalId ||
          null,

        childId:
          state.preview.childId ||
          null,

        clusterId:
          state.preview.clusterId ||
          null,

        source:
          state.preview.source ||
          null,

        token:
          state.preview.token
      },

      readiness: {
        controller:
          state.readiness.controller,

        compositor:
          state.readiness.compositor,

        crystals:
          state.readiness.crystals,

        interactions:
          state.readiness.interactions,

        compositorFailed:
          state.readiness.compositorFailed,

        crystalsFailed:
          state.readiness.crystalsFailed,

        interactionsFailed:
          state.readiness.interactionsFailed
      }
    });
  }

  function getState() {
    return immutableClone({
      contract:
        CONTRACT,

      owner:
        OWNER,

      initialized:
        state.initialized,

      initializing:
        state.initializing,

      disposed:
        state.disposed,

      frame:
        getFrameState(),

      committed: {
        ...state.committed
      },

      pendingRoute:
        state.pendingRoute.data
          ? {
              ...state.pendingRoute.data,
              generation:
                state.pendingRoute.generation
            }
          : null,

      dialogGeneration: {
        ...state.dialogGeneration
      },

      activeDialogGeneration: {
        ...state.activeDialogGeneration
      },

      counters: {
        ...state.counters
      },

      registered: {
        objectIds:
          Array.from(
            state.objects.keys()
          ),

        cardinalIds:
          Array.from(
            state.cardinals.keys()
          ),

        childIds:
          Array.from(
            state.children.keys()
          ),

        clusterIds:
          Array.from(
            state.clusters.keys()
          ),

        frontIds:
          Array.from(
            state.fronts.keys()
          )
      },

      validationIssues:
        state.validationIssues.slice(),

      nativeStateRegistry: {
        root:
          Boolean(
            state.nativeDomStates.root
          ),

        fronts:
          state.nativeDomStates.fronts.size,

        clusters:
          state.nativeDomStates.clusters.size,

        cardinals:
          state.nativeDomStates.cardinals.size,

        fallbackLayers:
          state.nativeDomStates.fallbackLayers.size,

        fallbackStars:
          state.nativeDomStates.fallbackStars.size,

        routeDialog:
          Boolean(
            state.nativeDomStates.routeDialog
          ),

        routeDialogTitle:
          Boolean(
            state.nativeDomStates.routeDialogTitle
          ),

        routeDialogDescription:
          Boolean(
            state.nativeDomStates.routeDialogDescription
          ),

        routeContinue:
          Boolean(
            state.nativeDomStates.routeContinue
          ),

        compassDialog:
          Boolean(
            state.nativeDomStates.compassDialog
          ),

        compassControls:
          state.nativeDomStates.compassControls.size,

        constructionDialog:
          Boolean(
            state.nativeDomStates.constructionDialog
          ),

        instructionsDisclosure:
          Boolean(
            state.nativeDomStates.instructionsDisclosure
          ),

        instructionControls:
          state.nativeDomStates.instructionControls.size,

        temporaryFocusTargets:
          state.nativeDomStates.temporaryFocusTargets.size,

        temporaryFocusCleanups:
          state.temporaryFocusCleanups.size
      },

      expectedDialogClose: {
        route:
          Boolean(
            state.expectedDialogClose.route
          ),

        compass:
          Boolean(
            state.expectedDialogClose.compass
          ),

        construction:
          Boolean(
            state.expectedDialogClose.construction
          )
      },

      listenerCount:
        state.listeners.length,

      observerCount:
        state.observers.length
    });
  }

  function createReceipt(
    event,
    extra = {}
  ) {
    return immutableClone({
      contract:
        CONTRACT,

      owner:
        OWNER,

      event,

      timestamp:
        nowIso(),

      frame:
        getFrameState(),

      counters: {
        ...state.counters
      },

      ...extra
    });
  }

  function publishReceipt(
    event,
    extra = {}
  ) {
    const payload =
      createReceipt(
        event,
        extra
      );

    if (state.receipt) {
      const serialized =
        JSON.stringify(payload);

      state.receipt.value =
        serialized;

      state.receipt.textContent =
        serialized;
    }

    dispatch(
      EVENTS.controllerReceipt,
      payload
    );

    return payload;
  }

  function publishValidation(
    status,
    issues
  ) {
    state.validationIssues =
      issues.slice();

    const payload =
      immutableClone({
        contract:
          CONTRACT,

        owner:
          OWNER,

        timestamp:
          nowIso(),

        status,

        issues:
          issues.slice()
      });

    if (state.validation) {
      const serialized =
        JSON.stringify(payload);

      state.validation.value =
        serialized;

      state.validation.textContent =
        serialized;
    }

    return payload;
  }

  function reflectState() {
    const frame =
      getFrameState();

    setRootAttribute(
      ATTRIBUTES.pageState,
      frame.pageState
    );

    setRootAttribute(
      ATTRIBUTES.presentationMode,
      frame.presentationMode
    );

    setRootAttribute(
      ATTRIBUTES.enhancementState,
      frame.enhancementState
    );

    setRootAttribute(
      ATTRIBUTES.activeCardinal,
      state.committed.cardinalId
    );

    setRootAttribute(
      ATTRIBUTES.activeChild,
      state.committed.childId
    );

    setRootAttribute(
      ATTRIBUTES.activeCluster,
      state.committed.clusterId
    );

    setRootAttribute(
      ATTRIBUTES.activeFront,
      state.committed.frontId
    );

    setRootAttribute(
      ATTRIBUTES.activeGaugeSet,
      state.committed.gaugeSet
    );

    setRootAttribute(
      ATTRIBUTES.activeInformationTab,
      state.committed.informationTab
    );

    setRootAttribute(
      ATTRIBUTES.routeDialogOpen,
      state.routeDialog &&
      state.routeDialog.open
        ? "true"
        : "false"
    );

    setRootAttribute(
      ATTRIBUTES.compassDialogOpen,
      state.compassDialog &&
      state.compassDialog.open
        ? "true"
        : "false"
    );

    setRootAttribute(
      ATTRIBUTES.held,
      state.held
        ? "true"
        : "false"
    );

    setRootAttribute(
      ATTRIBUTES.reducedMotion,
      state.reducedMotion
        ? "true"
        : "false"
    );

    setRootAttribute(
      ATTRIBUTES.compositorReady,
      state.readiness.compositor
        ? "true"
        : "false"
    );

    setRootAttribute(
      ATTRIBUTES.crystalsReady,
      state.readiness.crystals
        ? "true"
        : "false"
    );

    setRootAttribute(
      ATTRIBUTES.interactionsReady,
      state.readiness.interactions
        ? "true"
        : "false"
    );

    dispatch(
      EVENTS.stateChanged,
      {
        frame
      }
    );

    dispatch(
      EVENTS.frameChanged,
      {
        frame
      }
    );

    return frame;
  }

  function setFallbackEnhancedPresentation() {
    for (
      const layer
      of document.querySelectorAll(
        SELECTORS.fallbackStarLayer
      )
    ) {
      layer.setAttribute(
        ATTRIBUTES.fallbackVisibility,
        "semantic-only"
      );
    }

    for (
      const star
      of document.querySelectorAll(
        SELECTORS.fallbackStar
      )
    ) {
      star.setAttribute(
        ATTRIBUTES.fallbackRendering,
        "hidden"
      );
    }
  }

  function setClusterDomExpanded(
    clusterId,
    expanded
  ) {
    const normalizedClusterId =
      normalize(clusterId);

    const cluster =
      state.clusters.get(
        normalizedClusterId
      );

    if (!cluster) {
      return false;
    }

    cluster.hidden =
      !expanded;

    cluster.toggleAttribute(
      "hidden",
      !expanded
    );

    cluster.setAttribute(
      ATTRIBUTES.clusterState,
      expanded
        ? "expanded"
        : "collapsed"
    );

    cluster.setAttribute(
      "aria-hidden",
      expanded
        ? "false"
        : "true"
    );

    for (
      const cardinal
      of state.cardinals.values()
    ) {
      const cardinalClusterId =
        normalize(
          cardinal.getAttribute(
            ATTRIBUTES.clusterId
          )
        ) ||
        normalize(
          cardinal.getAttribute(
            ATTRIBUTES.cardinalId
          )
        );

      const active =
        expanded &&
        cardinalClusterId ===
          normalizedClusterId;

      if (
        cardinalClusterId ===
          normalizedClusterId
      ) {
        cardinal.setAttribute(
          "aria-expanded",
          active
            ? "true"
            : "false"
        );

        cardinal.toggleAttribute(
          ATTRIBUTES.clusterActive,
          active
        );
      }
    }

    return true;
  }

  function setFrontVisibility(
    front,
    visible
  ) {
    if (!front) {
      return;
    }

    front.hidden =
      !visible;

    front.toggleAttribute(
      "hidden",
      !visible
    );

    front.toggleAttribute(
      ATTRIBUTES.controllerManagedHidden,
      !visible
    );

    front.setAttribute(
      ATTRIBUTES.frontState,
      visible
        ? "active"
        : "inactive"
    );

    front.setAttribute(
      "aria-hidden",
      visible
        ? "false"
        : "true"
    );

    if ("inert" in front) {
      front.inert =
        !visible;
    }

    front.toggleAttribute(
      "inert",
      !visible
    );
  }

  function applyEnhancedConstellationPresentation() {
    for (
      const clusterId
      of state.clusters.keys()
    ) {
      setClusterDomExpanded(
        clusterId,
        false
      );
    }

    for (
      const front
      of state.fronts.values()
    ) {
      setFrontVisibility(
        front,
        false
      );
    }

    setFallbackEnhancedPresentation();
  }

  function applyEnhancedClusterPresentation() {
    for (
      const clusterId
      of state.clusters.keys()
    ) {
      setClusterDomExpanded(
        clusterId,
        clusterId ===
          state.committed.clusterId
      );
    }

    for (
      const front
      of state.fronts.values()
    ) {
      setFrontVisibility(
        front,
        false
      );
    }

    setFallbackEnhancedPresentation();
  }

  function applyEnhancedLocalPresentation() {
    for (
      const clusterId
      of state.clusters.keys()
    ) {
      setClusterDomExpanded(
        clusterId,
        clusterId ===
          state.committed.clusterId
      );
    }

    for (
      const [
        frontId,
        front
      ]
      of state.fronts
    ) {
      setFrontVisibility(
        front,
        Boolean(
          state.committed.frontId &&
          frontId ===
            state.committed.frontId
        )
      );
    }

    setFallbackEnhancedPresentation();
  }

  function applyPresentationForCurrentState(
    reason = ""
  ) {
    if (!aggregateEnhancedReady()) {
      restoreNativePresentationStates();

      return {
        mode:
          PRESENTATION_MODES.BASELINE,

        reason
      };
    }

    switch (state.durableState) {
      case DURABLE_STATES.CLUSTER_OPEN:
        applyEnhancedClusterPresentation();
        break;

      case DURABLE_STATES.LOCAL_DESTINATION:
        applyEnhancedLocalPresentation();
        break;

      case DURABLE_STATES.CONSTELLATION:
      default:
        applyEnhancedConstellationPresentation();
        break;
    }

    return {
      mode:
        derivePresentationMode(),

      reason
    };
  }

  function dispatchReadinessChanged(
    reason
  ) {
    state.counters.readinessChanges +=
      1;

    applyPresentationForCurrentState(
      reason
    );

    const frame =
      reflectState();

    dispatch(
      EVENTS.readinessChanged,
      {
        reason,
        frame
      }
    );

    publishReceipt(
      "readiness-changed",
      {
        reason
      }
    );
  }

  function setSubsystemReadiness(
    subsystem,
    ready,
    options = {}
  ) {
    if (
      !Object.prototype.hasOwnProperty.call(
        state.readiness,
        subsystem
      )
    ) {
      return false;
    }

    state.readiness[subsystem] =
      Boolean(ready);

    const failedKey =
      `${subsystem}Failed`;

    if (
      Object.prototype.hasOwnProperty.call(
        state.readiness,
        failedKey
      )
    ) {
      state.readiness[failedKey] =
        Boolean(options.failed);
    }

    if (!ready) {
      cancelPreview(
        `${subsystem}-unavailable`,
        {
          silent:
            true
        }
      );
    }

    dispatchReadinessChanged(
      options.reason ||
      `${subsystem}-readiness`
    );

    return true;
  }

  function resolveObject(value) {
    if (isElement(value)) {
      const object =
        value.matches(
          SELECTORS.object
        )
          ? value
          : value.closest(
              SELECTORS.object
            );

      if (
        object &&
        state.orbitField &&
        state.orbitField.contains(
          object
        )
      ) {
        return object;
      }

      return null;
    }

    const objectId =
      normalize(value);

    if (!objectId) {
      return null;
    }

    return (
      state.objects.get(
        objectId
      ) ||
      null
    );
  }

  function describeObject(object) {
    if (!object) {
      return null;
    }

    return immutableClone({
      objectId:
        normalize(
          object.getAttribute(
            ATTRIBUTES.objectId
          )
        ),

      behavior:
        normalize(
          object.getAttribute(
            ATTRIBUTES.objectBehavior
          )
        ),

      cardinalId:
        normalize(
          object.getAttribute(
            ATTRIBUTES.cardinalId
          )
        ),

      childId:
        normalize(
          object.getAttribute(
            ATTRIBUTES.childId
          )
        ),

      clusterId:
        normalize(
          object.getAttribute(
            ATTRIBUTES.clusterId
          )
        ),

      destinationKind:
        normalize(
          object.getAttribute(
            ATTRIBUTES.destinationKind
          )
        ),

      target:
        normalize(
          object.getAttribute(
            ATTRIBUTES.target
          )
        ),

      openAncestor:
        normalize(
          object.getAttribute(
            ATTRIBUTES.openAncestor
          )
        ),

      requiredFront:
        normalize(
          object.getAttribute(
            ATTRIBUTES.requiredFront
          )
        ),

      informationTab:
        normalize(
          object.getAttribute(
            ATTRIBUTES.informationTab
          )
        ),

      route:
        normalize(
          object.getAttribute(
            ATTRIBUTES.route
          )
        ),

      routeLabel:
        normalize(
          object.getAttribute(
            ATTRIBUTES.routeLabel
          )
        ),

      routeDescription:
        normalize(
          object.getAttribute(
            ATTRIBUTES.routeDescription
          )
        )
    });
  }

  function isOrbitOwnedElement(element) {
    return Boolean(
      isElement(element) &&
      state.orbitField &&
      state.orbitField.contains(element)
    );
  }

  function isOrbitOwnedObject(object) {
    return Boolean(
      object &&
      object.matches(
        SELECTORS.object
      ) &&
      isOrbitOwnedElement(object)
    );
  }

  function isFiniteNumber(value) {
    return (
      typeof value === "number" &&
      Number.isFinite(value)
    );
  }

  function readActivationCoordinates(detail) {
    if (!detail) {
      return null;
    }

    const candidates = [
      [
        detail.endX,
        detail.endY
      ],
      [
        detail.clientX,
        detail.clientY
      ],
      [
        detail.releaseClientX,
        detail.releaseClientY
      ],
      [
        detail.x,
        detail.y
      ],
      [
        detail.releaseX,
        detail.releaseY
      ],
      [
        detail.point &&
          detail.point.x,
        detail.point &&
          detail.point.y
      ]
    ];

    for (
      const [
        x,
        y
      ]
      of candidates
    ) {
      if (
        isFiniteNumber(x) &&
        isFiniteNumber(y)
      ) {
        return {
          x,
          y
        };
      }
    }

    return null;
  }

  function pointInsideElement(
    point,
    element
  ) {
    if (
      !point ||
      !element ||
      typeof element.getBoundingClientRect !==
        "function"
    ) {
      return false;
    }

    const rect =
      element.getBoundingClientRect();

    return (
      point.x >= rect.left &&
      point.x <= rect.right &&
      point.y >= rect.top &&
      point.y <= rect.bottom
    );
  }

  function resolveElementAtPoint(point) {
    if (
      !point ||
      typeof document.elementFromPoint !==
        "function"
    ) {
      return null;
    }

    return document.elementFromPoint(
      point.x,
      point.y
    );
  }

  function rejectSemanticActivation(
    reason,
    detail = {}
  ) {
    state.counters.rejectedActivations +=
      1;

    publishReceipt(
      "semantic-activation-rejected",
      {
        reason,

        objectId:
          normalize(
            detail.objectId
          ) ||
          null
      }
    );

    return {
      valid:
        false,

      reason
    };
  }

  function validateSemanticEvent(detail) {
    if (
      detail.validTap === false ||
      detail.cancelled === true ||
      detail.wasDrag === true
    ) {
      return rejectSemanticActivation(
        "gesture-not-committable",
        detail
      );
    }

    const suppliedElement =
      isElement(detail.element)
        ? detail.element
        : null;

    const object =
      resolveObject(
        suppliedElement ||
        detail.objectId
      );

    if (!object) {
      return rejectSemanticActivation(
        "object-not-found",
        detail
      );
    }

    if (!isOrbitOwnedObject(object)) {
      return rejectSemanticActivation(
        "object-outside-orbit",
        detail
      );
    }

    if (
      suppliedElement &&
      suppliedElement !== object &&
      !object.contains(
        suppliedElement
      )
    ) {
      return rejectSemanticActivation(
        "element-object-mismatch",
        detail
      );
    }

    if (
      suppliedElement &&
      !isOrbitOwnedElement(
        suppliedElement
      )
    ) {
      return rejectSemanticActivation(
        "element-outside-orbit",
        detail
      );
    }

    const point =
      readActivationCoordinates(
        detail
      );

    if (!point && !suppliedElement) {
      return rejectSemanticActivation(
        "ungrounded-object-id",
        detail
      );
    }

    if (point) {
      if (
        !pointInsideElement(
          point,
          state.orbitField
        )
      ) {
        return rejectSemanticActivation(
          "release-outside-orbit",
          detail
        );
      }

      if (
        !pointInsideElement(
          point,
          object
        )
      ) {
        return rejectSemanticActivation(
          "release-outside-object",
          detail
        );
      }

      const releaseElement =
        resolveElementAtPoint(
          point
        );

      if (
        !releaseElement ||
        !isOrbitOwnedElement(
          releaseElement
        )
      ) {
        return rejectSemanticActivation(
          "release-not-orbit-grounded",
          detail
        );
      }

      const releaseObject =
        releaseElement.matches(
          SELECTORS.object
        )
          ? releaseElement
          : releaseElement.closest(
              SELECTORS.object
            );

      if (releaseObject !== object) {
        return rejectSemanticActivation(
          "release-object-mismatch",
          detail
        );
      }
    }

    return {
      valid:
        true,

      object
    };
  }

  function validateCompassEvent(detail) {
    if (
      detail.validTap === false ||
      detail.cancelled === true ||
      detail.wasDrag === true
    ) {
      return {
        valid:
          false,

        reason:
          "gesture-not-committable"
      };
    }

    const suppliedElement =
      isElement(detail.element)
        ? detail.element
        : null;

    const control =
      suppliedElement
        ? (
            suppliedElement.matches(
              SELECTORS.compassControl
            )
              ? suppliedElement
              : suppliedElement.closest(
                  SELECTORS.compassControl
                )
          )
        : state.orbitField
          ? state.orbitField.querySelector(
              SELECTORS.compassControl
            )
          : null;

    if (
      !control ||
      !isOrbitOwnedElement(control)
    ) {
      return {
        valid:
          false,

        reason:
          "compass-control-not-grounded"
      };
    }

    if (
      suppliedElement &&
      suppliedElement !== control &&
      !control.contains(
        suppliedElement
      )
    ) {
      return {
        valid:
          false,

        reason:
          "compass-element-mismatch"
      };
    }

    const point =
      readActivationCoordinates(
        detail
      );

    if (!point && !suppliedElement) {
      return {
        valid:
          false,

        reason:
          "ungrounded-compass-activation"
      };
    }

    if (point) {
      if (
        !pointInsideElement(
          point,
          state.orbitField
        ) ||
        !pointInsideElement(
          point,
          control
        )
      ) {
        return {
          valid:
            false,

          reason:
            "compass-release-outside-control"
        };
      }

      const releaseElement =
        resolveElementAtPoint(
          point
        );

      if (
        !releaseElement ||
        (
          releaseElement !== control &&
          !control.contains(
            releaseElement
          )
        )
      ) {
        return {
          valid:
            false,

          reason:
            "compass-release-mismatch"
        };
      }
    }

    return {
      valid:
        true,

      control
    };
  }

  function beginPreview(
    objectValue,
    options = {}
  ) {
    if (
      state.disposed ||
      state.held
    ) {
      return false;
    }

    const object =
      resolveObject(
        objectValue
      );

    if (!object) {
      return false;
    }

    const descriptor =
      describeObject(object);

    state.preview.active =
      true;

    state.preview.objectId =
      descriptor.objectId;

    state.preview.cardinalId =
      descriptor.cardinalId;

    state.preview.childId =
      descriptor.childId;

    state.preview.clusterId =
      descriptor.clusterId;

    state.preview.source =
      normalize(
        options.source
      ) ||
      "api";

    state.preview.token += 1;

    state.counters.previewsBegun +=
      1;

    const frame =
      reflectState();

    dispatch(
      EVENTS.previewChanged,
      {
        action:
          "preview",

        frame
      }
    );

    publishReceipt(
      "preview-begun",
      {
        objectId:
          descriptor.objectId,

        source:
          state.preview.source,

        token:
          state.preview.token
      }
    );

    return state.preview.token;
  }

  function cancelPreview(
    reason = "cancelled",
    options = {}
  ) {
    if (!state.preview.active) {
      return false;
    }

    const previous = {
      ...state.preview
    };

    state.preview.active = false;
    state.preview.objectId = "";
    state.preview.cardinalId = "";
    state.preview.childId = "";
    state.preview.clusterId = "";
    state.preview.source = "";

    state.counters.previewsCancelled +=
      1;

    const frame =
      reflectState();

    dispatch(
      EVENTS.previewChanged,
      {
        action:
          "cancel",

        reason,

        previous:
          immutableClone(previous),

        frame
      }
    );

    if (!options.silent) {
      publishReceipt(
        "preview-cancelled",
        {
          reason,

          previousObjectId:
            previous.objectId ||
            null
        }
      );
    }

    return true;
  }

  function clearLocalCommit() {
    state.committed.localTargetId = "";
    state.committed.frontId = "";
    state.committed.gaugeSet = "";
    state.committed.informationTab = "";
  }

  function setRouteContinueEnabled(
    enabled,
    label = ""
  ) {
    if (!state.routeContinue) {
      return;
    }

    state.routeContinue.disabled =
      !enabled;

    state.routeContinue.toggleAttribute(
      "disabled",
      !enabled
    );

    state.routeContinue.setAttribute(
      "aria-disabled",
      enabled
        ? "false"
        : "true"
    );

    if (enabled && label) {
      state.routeContinue.textContent =
        `Continue to ${label}`;
    }
  }

  function finalizeRouteDialogClose(
    closeRecord,
    options = {}
  ) {
    const record =
      closeRecord || {
        generation:
          state.activeDialogGeneration.route,

        reason:
          "native-close",

        restoreFocus:
          false,

        silent:
          false,

        trigger:
          state.pendingRoute.trigger,

        routeData:
          state.pendingRoute.data
      };

    const ownsPendingRoute =
      record.generation !== 0 &&
      record.generation ===
        state.pendingRoute.generation;

    const ownsActiveDialog =
      record.generation !== 0 &&
      record.generation ===
        state.activeDialogGeneration.route;

    if (ownsPendingRoute) {
      state.pendingRoute.data = null;
      state.pendingRoute.trigger = null;
      state.pendingRoute.generation = 0;

      setRouteContinueEnabled(false);
    }

    if (ownsActiveDialog) {
      state.activeDialogGeneration.route =
        0;

      if (state.routeDialog) {
        state.routeDialog.setAttribute(
          ATTRIBUTES.dialogState,
          "closed"
        );
      }
    }

    if (
      options.stateOnly === true
    ) {
      return;
    }

    if (record.restoreFocus) {
      requestAnimationFrame(
        () => {
          focusElement(
            record.trigger
          );
        }
      );
    }

    if (!record.silent) {
      const frame =
        reflectState();

      dispatch(
        EVENTS.dialogChanged,
        {
          dialog:
            "route",

          open:
            Boolean(
              state.routeDialog &&
              state.routeDialog.open &&
              state.activeDialogGeneration.route
            ),

          generation:
            record.generation,

          frame
        }
      );

      publishReceipt(
        "route-dialog-closed",
        {
          generation:
            record.generation,

          reason:
            record.reason,

          route:
            record.routeData
              ? record.routeData.route
              : null
        }
      );
    } else {
      reflectState();
    }
  }

  function clearRouteConfirmation(
    options = {}
  ) {
    const generation =
      state.activeDialogGeneration.route ||
      state.pendingRoute.generation;

    const record = {
      generation,

      reason:
        options.reason ||
        "closed",

      restoreFocus:
        options.restoreFocus === true,

      silent:
        Boolean(options.silent),

      trigger:
        state.pendingRoute.trigger,

      routeData:
        state.pendingRoute.data
    };

    if (
      state.routeDialog &&
      state.routeDialog.open
    ) {
      state.expectedDialogClose.route =
        record;

      safelyCloseDialog(
        state.routeDialog,
        record.reason
      );

      if (
        options.finalizeBeforeReplacement ===
        true
      ) {
        finalizeRouteDialogClose(
          record,
          {
            stateOnly:
              true
          }
        );
      }

      return;
    }

    state.expectedDialogClose.route =
      null;

    finalizeRouteDialogClose(
      record
    );
  }

  function finalizeCompassDialogClose(
    closeRecord,
    options = {}
  ) {
    const record =
      closeRecord || {
        generation:
          state.activeDialogGeneration.compass,

        reason:
          "native-close",

        restoreFocus:
          false,

        silent:
          false,

        trigger:
          state.lastTriggers.compass
      };

    const ownsActiveDialog =
      record.generation !== 0 &&
      record.generation ===
        state.activeDialogGeneration.compass;

    if (ownsActiveDialog) {
      state.activeDialogGeneration.compass =
        0;

      for (
        const control
        of state.compassControls
      ) {
        control.setAttribute(
          "aria-expanded",
          "false"
        );
      }

      if (state.compassDialog) {
        state.compassDialog.setAttribute(
          ATTRIBUTES.dialogState,
          "closed"
        );
      }
    }

    if (
      options.stateOnly === true
    ) {
      return;
    }

    if (record.restoreFocus) {
      requestAnimationFrame(
        () => {
          focusElement(
            record.trigger
          );
        }
      );
    }

    if (!record.silent) {
      const frame =
        reflectState();

      dispatch(
        EVENTS.dialogChanged,
        {
          dialog:
            "compass",

          open:
            Boolean(
              state.compassDialog &&
              state.compassDialog.open &&
              state.activeDialogGeneration.compass
            ),

          generation:
            record.generation,

          frame
        }
      );

      publishReceipt(
        "compass-dialog-closed",
        {
          generation:
            record.generation,

          reason:
            record.reason
        }
      );
    } else {
      reflectState();
    }
  }

  function clearCompassConfirmation(
    options = {}
  ) {
    const record = {
      generation:
        state.activeDialogGeneration.compass,

      reason:
        options.reason ||
        "closed",

      restoreFocus:
        options.restoreFocus === true,

      silent:
        Boolean(options.silent),

      trigger:
        state.lastTriggers.compass
    };

    if (
      state.compassDialog &&
      state.compassDialog.open
    ) {
      state.expectedDialogClose.compass =
        record;

      safelyCloseDialog(
        state.compassDialog,
        record.reason
      );

      if (
        options.finalizeBeforeReplacement ===
        true
      ) {
        finalizeCompassDialogClose(
          record,
          {
            stateOnly:
              true
          }
        );
      }

      return;
    }

    state.expectedDialogClose.compass =
      null;

    finalizeCompassDialogClose(
      record
    );
  }

  function finalizeConstructionDialogClose(
    closeRecord,
    options = {}
  ) {
    const record =
      closeRecord || {
        generation:
          state.activeDialogGeneration.construction,

        reason:
          "native-close",

        restoreFocus:
          false,

        silent:
          false,

        trigger:
          state.lastTriggers.construction
      };

    const ownsActiveDialog =
      record.generation !== 0 &&
      record.generation ===
        state.activeDialogGeneration.construction;

    if (ownsActiveDialog) {
      state.activeDialogGeneration.construction =
        0;

      if (state.constructionDialog) {
        state.constructionDialog.setAttribute(
          ATTRIBUTES.dialogState,
          "closed"
        );
      }
    }

    if (
      options.stateOnly === true
    ) {
      return;
    }

    if (record.restoreFocus) {
      requestAnimationFrame(
        () => {
          focusElement(
            record.trigger
          );
        }
      );
    }

    if (!record.silent) {
      publishReceipt(
        "construction-dialog-closed",
        {
          generation:
            record.generation,

          reason:
            record.reason
        }
      );
    }
  }

  function closeConstructionDialog(
    options = {}
  ) {
    if (!state.constructionDialog) {
      return;
    }

    const record = {
      generation:
        state.activeDialogGeneration.construction,

      reason:
        options.reason ||
        "closed",

      restoreFocus:
        options.restoreFocus !== false,

      silent:
        Boolean(options.silent),

      trigger:
        state.lastTriggers.construction
    };

    if (state.constructionDialog.open) {
      state.expectedDialogClose.construction =
        record;

      safelyCloseDialog(
        state.constructionDialog,
        record.reason
      );

      if (
        options.finalizeBeforeReplacement ===
        true
      ) {
        finalizeConstructionDialogClose(
          record,
          {
            stateOnly:
              true
          }
        );
      }

      return;
    }

    state.expectedDialogClose.construction =
      null;

    finalizeConstructionDialogClose(
      record
    );
  }

  function clearAllTransientState(
    reason = "cleared"
  ) {
    cancelPreview(
      reason,
      {
        silent:
          true
      }
    );

    clearRouteConfirmation({
      restoreFocus:
        false,

      silent:
        true,

      reason
    });

    clearCompassConfirmation({
      restoreFocus:
        false,

      silent:
        true,

      reason
    });
  }

  function commitConstellationState() {
    clearAllTransientState(
      "constellation-commit"
    );

    state.durableState =
      DURABLE_STATES.CONSTELLATION;

    state.committed.cardinalId = "";
    state.committed.childId = "";
    state.committed.clusterId = "";
    state.committed.localTargetId = "";
    state.committed.frontId = "";
    state.committed.gaugeSet = "";
    state.committed.informationTab = "";
  }

  function commitClusterState(
    cardinalId,
    clusterId
  ) {
    clearAllTransientState(
      "cluster-commit"
    );

    state.durableState =
      DURABLE_STATES.CLUSTER_OPEN;

    state.committed.cardinalId =
      normalize(cardinalId);

    state.committed.clusterId =
      normalize(clusterId);

    state.committed.childId = "";

    clearLocalCommit();
  }

  function commitPortalSelection(
    descriptor
  ) {
    cancelPreview(
      "portal-selection-commit",
      {
        silent:
          true
      }
    );

    clearLocalCommit();

    state.committed.cardinalId =
      descriptor.cardinalId ||
      state.committed.cardinalId;

    state.committed.clusterId =
      descriptor.clusterId ||
      state.committed.clusterId;

    state.committed.childId =
      descriptor.childId ||
      descriptor.objectId;
  }

  function commitLocalState(
    descriptor,
    frontId
  ) {
    clearAllTransientState(
      "local-commit"
    );

    state.durableState =
      DURABLE_STATES.LOCAL_DESTINATION;

    state.committed.cardinalId =
      descriptor.cardinalId;

    state.committed.clusterId =
      descriptor.clusterId;

    state.committed.childId =
      descriptor.childId ||
      descriptor.objectId;

    state.committed.localTargetId =
      descriptor.target;

    state.committed.frontId =
      frontId;

    const front =
      state.fronts.get(frontId);

    state.committed.gaugeSet =
      front
        ? normalize(
            front.getAttribute(
              "data-showroom-gauge-set"
            )
          )
        : "";

    state.committed.informationTab = "";
  }

  function openCluster(
    clusterId,
    options = {}
  ) {
    if (
      state.disposed ||
      state.held
    ) {
      return false;
    }

    const normalizedClusterId =
      normalize(clusterId);

    const normalizedCardinalId =
      normalize(
        options.cardinalId
      ) ||
      normalizedClusterId;

    if (
      !state.clusters.has(
        normalizedClusterId
      ) ||
      !state.cardinals.has(
        normalizedCardinalId
      )
    ) {
      return false;
    }

    commitClusterState(
      normalizedCardinalId,
      normalizedClusterId
    );

    state.counters.cardinalCommits +=
      1;

    applyPresentationForCurrentState(
      "cluster-opened"
    );

    const frame =
      reflectState();

    dispatch(
      EVENTS.clusterChanged,
      {
        cardinalId:
          normalizedCardinalId,

        clusterId:
          normalizedClusterId,

        expanded:
          true,

        committed:
          true,

        frame
      }
    );

    if (options.focusFirstChild) {
      const cluster =
        state.clusters.get(
          normalizedClusterId
        );

      const firstChild =
        cluster
          ? cluster.querySelector(
              SELECTORS.childControl
            )
          : null;

      requestAnimationFrame(
        () => {
          focusElement(firstChild);
        }
      );
    }

    return true;
  }

  function closeCluster(clusterId) {
    const normalizedClusterId =
      normalize(clusterId);

    if (
      state.committed.clusterId !==
        normalizedClusterId ||
      !state.clusters.has(
        normalizedClusterId
      )
    ) {
      return false;
    }

    commitConstellationState();

    applyPresentationForCurrentState(
      "cluster-closed"
    );

    const frame =
      reflectState();

    dispatch(
      EVENTS.clusterChanged,
      {
        clusterId:
          normalizedClusterId,

        expanded:
          false,

        committed:
          true,

        frame
      }
    );

    publishReceipt(
      "cluster-closed",
      {
        clusterId:
          normalizedClusterId
      }
    );

    return true;
  }

  function toggleCluster(
    clusterId,
    options = {}
  ) {
    const normalizedClusterId =
      normalize(clusterId);

    if (
      state.committed.clusterId ===
        normalizedClusterId &&
      (
        state.durableState ===
          DURABLE_STATES.CLUSTER_OPEN ||
        state.durableState ===
          DURABLE_STATES.LOCAL_DESTINATION
      )
    ) {
      return closeCluster(
        normalizedClusterId
      );
    }

    return openCluster(
      normalizedClusterId,
      options
    );
  }

  function resolveFrontId(
    selectorOrId
  ) {
    const normalized =
      normalize(selectorOrId);

    if (!normalized) {
      return "";
    }

    return normalized.startsWith("#")
      ? normalized.slice(1)
      : normalized;
  }

  function resolveTarget(selector) {
    const normalized =
      normalize(selector);

    if (!normalized) {
      return null;
    }

    try {
      return document.querySelector(
        normalized
      );
    } catch {
      return null;
    }
  }

  function resolveDeclaredAncestor(selector) {
    const normalized =
      normalize(selector);

    if (!normalized) {
      return null;
    }

    try {
      return document.querySelector(
        normalized
      );
    } catch {
      return null;
    }
  }

  function findNativeInformationTab(
    tabId
  ) {
    const normalizedTabId =
      normalize(tabId);

    if (!normalizedTabId) {
      return null;
    }

    return (
      toArray(
        document.querySelectorAll(
          SELECTORS.informationTab
        )
      ).find(
        candidate =>
          normalize(
            candidate.getAttribute(
              "data-information-tab-id"
            )
          ) === normalizedTabId
      ) ||
      null
    );
  }

  function attemptInformationTabSelection(
    tabId,
    options = {}
  ) {
    const normalizedTabId =
      normalize(tabId);

    if (!normalizedTabId) {
      return {
        success:
          true,

        tabId:
          "",

        implementation:
          "none"
      };
    }

    const gauges =
      window.SHOWROOM_GAUGES;

    if (
      gauges &&
      typeof gauges.selectInformationTab ===
        "function"
    ) {
      try {
        const selected =
          gauges.selectInformationTab(
            normalizedTabId,
            {
              focus:
                Boolean(options.focus),

              announce:
                options.announce !== false
            }
          ) !== false;

        return {
          success:
            selected,

          tabId:
            normalizedTabId,

          implementation:
            selected
              ? "gauges"
              : null
        };
      } catch {
        return {
          success:
            false,

          tabId:
            normalizedTabId,

          implementation:
            null
        };
      }
    }

    const nativeTab =
      findNativeInformationTab(
        normalizedTabId
      );

    if (!nativeTab) {
      return {
        success:
          false,

        tabId:
          normalizedTabId,

        implementation:
          null
      };
    }

    try {
      nativeTab.click();

      return {
        success:
          true,

        tabId:
          normalizedTabId,

        implementation:
          "native"
      };
    } catch {
      return {
        success:
          false,

        tabId:
          normalizedTabId,

        implementation:
          null
      };
    }
  }

  function requestInformationTab(tabId) {
    const selectionResult =
      attemptInformationTabSelection(
        tabId,
        {
          focus:
            false,

          announce:
            true
        }
      );

    if (!selectionResult.success) {
      return false;
    }

    state.committed.informationTab =
      selectionResult.tabId;

    reflectState();

    return true;
  }

  function activateLocalDestination(
    descriptor,
    options = {}
  ) {
    const target =
      resolveTarget(
        descriptor.target
      );

    if (!target) {
      publishReceipt(
        "local-target-missing",
        {
          objectId:
            descriptor.objectId,

          target:
            descriptor.target ||
            null
        }
      );

      return false;
    }

    const ancestor =
      descriptor.openAncestor
        ? resolveDeclaredAncestor(
            descriptor.openAncestor
          )
        : null;

    if (
      descriptor.openAncestor &&
      !ancestor
    ) {
      publishReceipt(
        "local-ancestor-missing",
        {
          objectId:
            descriptor.objectId,

          ancestor:
            descriptor.openAncestor
        }
      );

      return false;
    }

    const frontId =
      resolveFrontId(
        descriptor.requiredFront
      );

    if (
      frontId &&
      !state.fronts.has(frontId)
    ) {
      publishReceipt(
        "local-front-missing",
        {
          objectId:
            descriptor.objectId,

          frontId
        }
      );

      return false;
    }

    if (
      !descriptor.cardinalId ||
      !descriptor.clusterId
    ) {
      publishReceipt(
        "local-parent-state-missing",
        {
          objectId:
            descriptor.objectId,

          cardinalId:
            descriptor.cardinalId ||
            null,

          clusterId:
            descriptor.clusterId ||
            null
        }
      );

      return false;
    }

    if (
      !state.cardinals.has(
        descriptor.cardinalId
      ) ||
      !state.clusters.has(
        descriptor.clusterId
      )
    ) {
      publishReceipt(
        "local-parent-state-invalid",
        {
          objectId:
            descriptor.objectId,

          cardinalId:
            descriptor.cardinalId,

          clusterId:
            descriptor.clusterId
        }
      );

      return false;
    }

    const selectionResult =
      attemptInformationTabSelection(
        descriptor.informationTab,
        {
          focus:
            false,

          announce:
            true
        }
      );

    if (!selectionResult.success) {
      publishReceipt(
        "local-information-tab-selection-failed",
        {
          objectId:
            descriptor.objectId,

          informationTab:
            descriptor.informationTab ||
            null
        }
      );

      return false;
    }

    commitLocalState(
      descriptor,
      frontId
    );

    state.committed.informationTab =
      selectionResult.tabId;

    if (
      ancestor instanceof
        HTMLDetailsElement
    ) {
      ancestor.open = true;
    }

    applyPresentationForCurrentState(
      "local-destination-committed"
    );

    state.counters.localActivations +=
      1;

    state.counters.childCommits +=
      1;

    const frame =
      reflectState();

    if (
      options.scroll !== false
    ) {
      requestAnimationFrame(
        () => {
          scrollToElement(
            target,
            "start"
          );
        }
      );
    }

    if (
      options.focus !== false
    ) {
      const heading =
        target.matches(
          "h1,h2,h3,h4,h5,h6"
        )
          ? target
          : target.querySelector(
              "h1,h2,h3,h4,h5,h6"
            );

      if (heading) {
        if (
          !heading.hasAttribute(
            "tabindex"
          )
        ) {
          state.nativeDomStates
            .temporaryFocusTargets
            .set(
              heading,
              captureElementState(heading)
            );

          heading.setAttribute(
            "tabindex",
            "-1"
          );

          installTemporaryFocusCleanup(
            heading
          );
        }

        requestAnimationFrame(
          () => {
            focusElement(heading);
          }
        );
      }
    }

    dispatch(
      EVENTS.frontChanged,
      {
        frontId:
          state.committed.frontId ||
          null,

        localTarget:
          descriptor.target,

        childId:
          state.committed.childId,

        active:
          true,

        frame
      }
    );

    publishReceipt(
      "local-destination-committed",
      {
        objectId:
          descriptor.objectId,

        target:
          descriptor.target,

        destinationKind:
          descriptor.destinationKind ||
          null,

        informationTabImplementation:
          selectionResult.implementation
      }
    );

    return true;
  }

  function readRouteDefinition(source) {
    const element =
      isElement(source)
        ? source
        : null;

    if (!element) {
      return null;
    }

    const route =
      normalize(
        element.getAttribute(
          ATTRIBUTES.route
        )
      );

    if (!route) {
      return null;
    }

    return immutableClone({
      objectId:
        normalize(
          element.getAttribute(
            ATTRIBUTES.objectId
          )
        ) ||
        normalize(
          element.getAttribute(
            ATTRIBUTES.childId
          )
        ) ||
        "fallback-route",

      route,

      label:
        normalize(
          element.getAttribute(
            ATTRIBUTES.routeLabel
          )
        ) ||
        "Destination",

      description:
        normalize(
          element.getAttribute(
            ATTRIBUTES.routeDescription
          )
        ) ||
        "This path leaves the current Showroom page."
    });
  }

  function setDialogState(
    dialog,
    type,
    open
  ) {
    if (dialog) {
      dialog.setAttribute(
        ATTRIBUTES.dialogState,
        open
          ? "open"
          : "closed"
      );
    }

    const frame =
      reflectState();

    dispatch(
      EVENTS.dialogChanged,
      {
        dialog:
          type,

        open,

        frame
      }
    );
  }

  function openRouteDialog(
    source,
    options = {}
  ) {
    if (
      state.disposed ||
      state.held ||
      !state.routeDialog
    ) {
      return false;
    }

    const definition =
      readRouteDefinition(
        source
      );

    if (!definition) {
      return false;
    }

    if (
      isDuplicateActivation(
        `route:${definition.objectId}`
      )
    ) {
      return false;
    }

    cancelPreview(
      "route-confirmation-opened",
      {
        silent:
          true
      }
    );

    clearCompassConfirmation({
      restoreFocus:
        false,

      silent:
        true,

      reason:
        "route-superseded-compass",

      finalizeBeforeReplacement:
        true
    });

    if (
      state.routeDialog.open ||
      state.activeDialogGeneration.route ||
      state.pendingRoute.generation
    ) {
      clearRouteConfirmation({
        restoreFocus:
          false,

        silent:
          true,

        reason:
          "route-replaced",

        finalizeBeforeReplacement:
          true
      });
    }

    const generation =
      nextDialogGeneration(
        "route"
      );

    state.pendingRoute.data =
      definition;

    state.pendingRoute.trigger =
      options.trigger ||
      source;

    state.pendingRoute.generation =
      generation;

    if (state.routeDialogTitle) {
      state.routeDialogTitle.textContent =
        definition.label;
    }

    if (state.routeDialogDescription) {
      state.routeDialogDescription.textContent =
        definition.description;
    }

    setRouteContinueEnabled(
      true,
      definition.label
    );

    safelyShowModal(
      state.routeDialog
    );

    setDialogState(
      state.routeDialog,
      "route",
      true
    );

    const stay =
      state.routeDialog.querySelector(
        SELECTORS.routeStay
      );

    requestAnimationFrame(
      () => {
        focusElement(
          stay ||
          state.routeDialog
        );
      }
    );

    state.counters.portalOffers +=
      1;

    publishReceipt(
      "route-dialog-opened",
      {
        generation,

        objectId:
          definition.objectId,

        route:
          definition.route
      }
    );

    return true;
  }

  function closeRouteDialog(
    options = {}
  ) {
    clearRouteConfirmation({
      restoreFocus:
        options.restoreFocus !== false,

      silent:
        Boolean(options.silent),

      reason:
        options.reason ||
        "closed"
    });
  }

  function continuePendingRoute() {
    if (
      state.disposed ||
      state.held ||
      !state.pendingRoute.data
    ) {
      return false;
    }

    const routeData =
      state.pendingRoute.data;

    publishReceipt(
      "route-navigation-requested",
      {
        generation:
          state.pendingRoute.generation,

        route:
          routeData.route,

        objectId:
          routeData.objectId
      }
    );

    window.location.assign(
      routeData.route
    );

    return true;
  }

  function openCompassDialog(
    trigger = null
  ) {
    if (
      state.disposed ||
      state.held ||
      !state.compassDialog
    ) {
      return false;
    }

    if (
      isDuplicateActivation(
        "compass-dialog"
      )
    ) {
      return false;
    }

    cancelPreview(
      "compass-confirmation-opened",
      {
        silent:
          true
      }
    );

    clearRouteConfirmation({
      restoreFocus:
        false,

      silent:
        true,

      reason:
        "compass-superseded-route",

      finalizeBeforeReplacement:
        true
    });

    if (
      state.compassDialog.open ||
      state.activeDialogGeneration.compass
    ) {
      clearCompassConfirmation({
        restoreFocus:
          false,

        silent:
          true,

        reason:
          "compass-reopened",

        finalizeBeforeReplacement:
          true
      });
    }

    const generation =
      nextDialogGeneration(
        "compass"
      );

    state.lastTriggers.compass =
      trigger ||
      state.compassControls[0] ||
      null;

    safelyShowModal(
      state.compassDialog
    );

    for (
      const control
      of state.compassControls
    ) {
      control.setAttribute(
        "aria-expanded",
        "true"
      );
    }

    setDialogState(
      state.compassDialog,
      "compass",
      true
    );

    const stay =
      state.compassDialog.querySelector(
        SELECTORS.compassStay
      );

    requestAnimationFrame(
      () => {
        focusElement(
          stay ||
          state.compassDialog
        );
      }
    );

    state.counters.compassOffers +=
      1;

    publishReceipt(
      "compass-dialog-opened",
      {
        generation
      }
    );

    return true;
  }

  function closeCompassDialog(
    options = {}
  ) {
    clearCompassConfirmation({
      restoreFocus:
        options.restoreFocus !== false,

      silent:
        Boolean(options.silent),

      reason:
        options.reason ||
        "closed"
    });
  }

  function stayInShowroom() {
    closeCompassDialog({
      restoreFocus:
        true,

      reason:
        "stay"
    });

    publishReceipt(
      "stayed-in-showroom"
    );
  }

  function openConstructionDialog(
    trigger = null
  ) {
    if (
      !state.constructionDialog ||
      state.disposed
    ) {
      return false;
    }

    clearRouteConfirmation({
      restoreFocus:
        false,

      silent:
        true,

      reason:
        "construction-superseded-route",

      finalizeBeforeReplacement:
        true
    });

    clearCompassConfirmation({
      restoreFocus:
        false,

      silent:
        true,

      reason:
        "construction-superseded-compass",

      finalizeBeforeReplacement:
        true
    });

    if (
      state.constructionDialog.open ||
      state.activeDialogGeneration.construction
    ) {
      closeConstructionDialog({
        restoreFocus:
          false,

        silent:
          true,

        reason:
          "construction-reopened",

        finalizeBeforeReplacement:
          true
      });
    }

    const generation =
      nextDialogGeneration(
        "construction"
      );

    state.lastTriggers.construction =
      trigger;

    safelyShowModal(
      state.constructionDialog
    );

    state.constructionDialog.setAttribute(
      ATTRIBUTES.dialogState,
      "open"
    );

    const close =
      state.constructionDialog
        .querySelector(
          SELECTORS.constructionClose
        );

    requestAnimationFrame(
      () => {
        focusElement(
          close ||
          state.constructionDialog
        );
      }
    );

    publishReceipt(
      "construction-dialog-opened",
      {
        generation
      }
    );

    return true;
  }

  function openInstructions(
    options = {}
  ) {
    if (
      !state.instructionsDisclosure ||
      state.disposed
    ) {
      return false;
    }

    state.instructionsDisclosure.open =
      true;

    for (
      const control
      of state.instructionControls
    ) {
      control.setAttribute(
        "aria-expanded",
        "true"
      );
    }

    const summary =
      state.instructionsDisclosure.querySelector(
        ":scope > summary"
      );

    if (
      options.scroll !== false
    ) {
      requestAnimationFrame(
        () => {
          scrollToElement(
            summary ||
            state.instructionsDisclosure
          );
        }
      );
    }

    if (options.focus === true) {
      requestAnimationFrame(
        () => {
          focusElement(summary);
        }
      );
    }

    publishReceipt(
      "instructions-opened"
    );

    return true;
  }

  function syncInstructionsState() {
    if (!state.instructionsDisclosure) {
      return;
    }

    const open =
      state.instructionsDisclosure.open;

    for (
      const control
      of state.instructionControls
    ) {
      control.setAttribute(
        "aria-expanded",
        open
          ? "true"
          : "false"
      );
    }
  }

  function commitObject(
    objectValue,
    options = {}
  ) {
    if (
      state.disposed ||
      state.held
    ) {
      state.counters.rejectedActivations +=
        1;

      return false;
    }

    const object =
      resolveObject(
        objectValue
      );

    if (!object) {
      state.counters.rejectedActivations +=
        1;

      return false;
    }

    const descriptor =
      describeObject(object);

    if (
      options.dedupe !== false &&
      isDuplicateActivation(
        `object:${descriptor.objectId}`
      )
    ) {
      return false;
    }

    switch (descriptor.behavior) {
      case "cluster": {
        const clusterId =
          descriptor.clusterId ||
          descriptor.cardinalId;

        const cardinalId =
          descriptor.cardinalId ||
          clusterId;

        const changed =
          toggleCluster(
            clusterId,
            {
              cardinalId,

              focusFirstChild:
                Boolean(
                  options.focusFirstChild
                )
            }
          );

        publishReceipt(
          "cluster-commit",
          {
            objectId:
              descriptor.objectId,

            cardinalId,

            clusterId,

            changed
          }
        );

        return changed;
      }

      case "local":
        return activateLocalDestination(
          descriptor,
          options
        );

      case "portal":
        commitPortalSelection(
          descriptor
        );

        applyPresentationForCurrentState(
          "portal-child-selected"
        );

        reflectState();

        state.counters.childCommits +=
          1;

        return openRouteDialog(
          object,
          {
            trigger:
              object
          }
        );

      case "compass-return":
        cancelPreview(
          "compass-confirmation-requested",
          {
            silent:
              true
          }
        );

        return openCompassDialog(
          object
        );

      default:
        state.counters.rejectedActivations +=
          1;

        publishReceipt(
          "object-commit-rejected",
          {
            objectId:
              descriptor.objectId,

            behavior:
              descriptor.behavior ||
              null
          }
        );

        return false;
    }
  }

  function commitPreview(
    token,
    options = {}
  ) {
    if (
      !state.preview.active ||
      state.held ||
      state.disposed
    ) {
      return false;
    }

    if (
      token !== undefined &&
      token !== null &&
      Number(token) !==
        state.preview.token
    ) {
      return false;
    }

    const objectId =
      state.preview.objectId;

    const committed =
      commitObject(
        objectId,
        {
          ...options,

          dedupe:
            false
        }
      );

    if (committed) {
      state.counters.previewsCommitted +=
        1;
    }

    return committed;
  }

  function returnToOrbit(
    options = {}
  ) {
    commitConstellationState();

    applyPresentationForCurrentState(
      "return-to-orbit"
    );

    const frame =
      reflectState();

    if (
      options.scroll !== false
    ) {
      requestAnimationFrame(
        () => {
          scrollToElement(
            state.orbit,
            "start"
          );
        }
      );
    }

    if (
      options.focus !== false
    ) {
      requestAnimationFrame(
        () => {
          focusElement(
            state.compassControls[0] ||
            state.orbit
          );
        }
      );
    }

    state.counters.returnsToOrbit +=
      1;

    dispatch(
      EVENTS.frontChanged,
      {
        frontId:
          null,

        active:
          false,

        returnedToOrbit:
          true,

        frame
      }
    );

    publishReceipt(
      "returned-to-orbit"
    );

    return true;
  }

  function setHeld(
    value,
    reason = ""
  ) {
    const next =
      Boolean(value);

    if (state.held === next) {
      return state.held;
    }

    if (next) {
      cancelPreview(
        "held",
        {
          silent:
            true
        }
      );

      clearRouteConfirmation({
        restoreFocus:
          false,

        silent:
          true,

        reason:
          "held"
      });

      clearCompassConfirmation({
        restoreFocus:
          false,

        silent:
          true,

        reason:
          "held"
      });

      state.held = true;
    } else {
      state.held = false;

      applyPresentationForCurrentState(
        "held-released"
      );
    }

    const frame =
      reflectState();

    publishReceipt(
      "held-state-changed",
      {
        held:
          state.held,

        reason:
          reason ||
          null,

        frame
      }
    );

    return state.held;
  }

  function applyReducedMotion() {
    state.reducedMotion =
      Boolean(
        state.reducedMotionQuery &&
        state.reducedMotionQuery.matches
      );

    reflectState();

    publishReceipt(
      "reduced-motion-changed"
    );
  }

  function initializeReducedMotion() {
    state.reducedMotionQuery =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    if (
      typeof state.reducedMotionQuery
        .addEventListener ===
        "function"
    ) {
      addListener(
        state.reducedMotionQuery,
        "change",
        applyReducedMotion
      );
    } else if (
      typeof state.reducedMotionQuery
        .addListener ===
        "function"
    ) {
      state.reducedMotionQuery.addListener(
        applyReducedMotion
      );

      state.listeners.push(() => {
        state.reducedMotionQuery.removeListener(
          applyReducedMotion
        );
      });
    }

    applyReducedMotion();
  }

  function handleSemanticActivation(event) {
    const detail =
      event &&
      event.detail
        ? event.detail
        : {};

    const validation =
      validateSemanticEvent(
        detail
      );

    if (!validation.valid) {
      return;
    }

    commitObject(
      validation.object
    );
  }

  function handleCompassActivation(event) {
    const detail =
      event &&
      event.detail
        ? event.detail
        : {};

    const validation =
      validateCompassEvent(
        detail
      );

    if (!validation.valid) {
      state.counters.rejectedActivations +=
        1;

      publishReceipt(
        "compass-activation-rejected",
        {
          reason:
            validation.reason
        }
      );

      return;
    }

    openCompassDialog(
      validation.control
    );
  }

  function handleClusterExitIntent(event) {
    const detail =
      event &&
      event.detail
        ? event.detail
        : {};

    const clusterId =
      normalize(
        detail.clusterId
      );

    if (
      !clusterId ||
      clusterId !==
        state.committed.clusterId
    ) {
      return;
    }

    closeCluster(clusterId);
  }

  function handleDirectObjectClick(event) {
    if (
      event.defaultPrevented ||
      state.disposed ||
      state.held
    ) {
      return;
    }

    const object =
      resolveObject(
        event.currentTarget
      );

    if (!object) {
      return;
    }

    if (event.detail === 0) {
      commitObject(object);
      return;
    }

    const point = {
      x:
        event.clientX,

      y:
        event.clientY
    };

    if (
      !pointInsideElement(
        point,
        state.orbitField
      ) ||
      !pointInsideElement(
        point,
        object
      )
    ) {
      state.counters.rejectedActivations +=
        1;

      return;
    }

    const releaseElement =
      resolveElementAtPoint(
        point
      );

    const releaseObject =
      releaseElement
        ? (
            releaseElement.matches(
              SELECTORS.object
            )
              ? releaseElement
              : releaseElement.closest(
                  SELECTORS.object
                )
          )
        : null;

    if (releaseObject !== object) {
      state.counters.rejectedActivations +=
        1;

      return;
    }

    commitObject(object);
  }

  function handleFallbackPortalClick(event) {
    if (
      state.disposed ||
      state.held
    ) {
      return;
    }

    event.preventDefault();

    openRouteDialog(
      event.currentTarget,
      {
        trigger:
          event.currentTarget
      }
    );
  }

  function discoverDom() {
    state.root =
      document.querySelector(
        SELECTORS.root
      );

    state.receipt =
      document.querySelector(
        SELECTORS.receipt
      );

    state.validation =
      document.querySelector(
        SELECTORS.validation
      );

    state.orbit =
      document.querySelector(
        SELECTORS.orbit
      );

    state.orbitScene =
      document.querySelector(
        SELECTORS.orbitScene
      );

    state.orbitField =
      document.querySelector(
        SELECTORS.orbitField
      );

    state.semanticLayer =
      document.querySelector(
        SELECTORS.semanticLayer
      );

    state.frontHost =
      document.querySelector(
        SELECTORS.frontHost
      );

    state.compassLayer =
      document.querySelector(
        SELECTORS.compassLayer
      );

    state.compassVisualMount =
      document.querySelector(
        SELECTORS.compassVisualMount
      );

    state.compassControls =
      toArray(
        document.querySelectorAll(
          [
            SELECTORS.compassControl,
            SELECTORS.openCompassDialog,
            SELECTORS.sharedReturnToCompass
          ].join(",")
        )
      );

    state.routeDialog =
      document.querySelector(
        SELECTORS.routeDialog
      );

    state.routeDialogTitle =
      document.querySelector(
        SELECTORS.routeDialogTitle
      );

    state.routeDialogDescription =
      document.querySelector(
        SELECTORS.routeDialogDescription
      );

    state.routeContinue =
      document.querySelector(
        SELECTORS.routeContinue
      );

    state.compassDialog =
      document.querySelector(
        SELECTORS.compassDialog
      );

    state.compassReturn =
      document.querySelector(
        SELECTORS.compassReturn
      );

    state.instructionsDisclosure =
      document.querySelector(
        SELECTORS.instructionsDisclosure
      );

    state.instructionControls =
      toArray(
        document.querySelectorAll(
          SELECTORS.instructionsOpen
        )
      );

    state.constructionDialog =
      document.querySelector(
        SELECTORS.constructionDialog
      );

    state.objects.clear();
    state.cardinals.clear();
    state.children.clear();
    state.clusters.clear();
    state.fronts.clear();

    if (state.orbitField) {
      for (
        const object
        of state.orbitField.querySelectorAll(
          SELECTORS.object
        )
      ) {
        const objectId =
          normalize(
            object.getAttribute(
              ATTRIBUTES.objectId
            )
          );

        if (objectId) {
          state.objects.set(
            objectId,
            object
          );
        }

        if (
          object.matches(
            SELECTORS.cardinalControl
          )
        ) {
          const cardinalId =
            normalize(
              object.getAttribute(
                ATTRIBUTES.cardinalId
              )
            );

          if (cardinalId) {
            state.cardinals.set(
              cardinalId,
              object
            );
          }
        }

        if (
          object.matches(
            SELECTORS.childControl
          )
        ) {
          const childId =
            normalize(
              object.getAttribute(
                ATTRIBUTES.childId
              )
            );

          if (childId) {
            state.children.set(
              childId,
              object
            );
          }
        }
      }

      for (
        const cluster
        of state.orbitField.querySelectorAll(
          SELECTORS.cluster
        )
      ) {
        const clusterId =
          normalize(
            cluster.getAttribute(
              ATTRIBUTES.clusterId
            )
          );

        if (clusterId) {
          state.clusters.set(
            clusterId,
            cluster
          );
        }
      }
    }

    for (
      const front
      of document.querySelectorAll(
        SELECTORS.front
      )
    ) {
      if (front.id) {
        state.fronts.set(
          front.id,
          front
        );
      }
    }
  }

  function validateDom() {
    const issues = [];

    if (!state.root) {
      issues.push(
        "Missing [data-showroom-root]."
      );
    }

    if (!state.orbit) {
      issues.push(
        "Missing #showroom-orbit."
      );
    }

    if (!state.orbitField) {
      issues.push(
        "Missing [data-showroom-orbit-field]."
      );
    }

    if (!state.semanticLayer) {
      issues.push(
        "Missing [data-showroom-semantic-star-layer]."
      );
    }

    if (!state.compassLayer) {
      issues.push(
        "Missing [data-showroom-compass-layer]."
      );
    }

    if (!state.compassVisualMount) {
      issues.push(
        "Missing [data-showroom-compass-visual-mount]."
      );
    }

    if (!state.compassControls.length) {
      issues.push(
        "No Main Compass semantic controls were found."
      );
    }

    if (!state.routeDialog) {
      issues.push(
        "Missing [data-showroom-route-dialog]."
      );
    }

    if (!state.compassDialog) {
      issues.push(
        "Missing [data-showroom-compass-dialog]."
      );
    }

    if (state.cardinals.size !== 4) {
      issues.push(
        `Expected four cardinal controls; found ${state.cardinals.size}.`
      );
    }

    if (state.children.size !== 16) {
      issues.push(
        `Expected sixteen child controls; found ${state.children.size}.`
      );
    }

    for (
      const cardinalId
      of [
        "north",
        "east",
        "south",
        "west"
      ]
    ) {
      if (
        !state.cardinals.has(
          cardinalId
        )
      ) {
        issues.push(
          `Missing cardinal control "${cardinalId}".`
        );
      }

      if (
        !state.clusters.has(
          cardinalId
        )
      ) {
        issues.push(
          `Missing cluster "${cardinalId}".`
        );
      }
    }

    for (
      const [
        objectId,
        object
      ]
      of state.objects
    ) {
      const behavior =
        normalize(
          object.getAttribute(
            ATTRIBUTES.objectBehavior
          )
        );

      if (
        ![
          "cluster",
          "local",
          "portal",
          "compass-return"
        ].includes(behavior)
      ) {
        issues.push(
          `Object "${objectId}" has unsupported behavior "${behavior}".`
        );
      }
    }

    if (
      state.compassReturn &&
      new URL(
        state.compassReturn.href,
        window.location.href
      ).pathname !==
        MAIN_COMPASS_ROUTE
    ) {
      issues.push(
        "Main Compass return link does not target /index.html."
      );
    }

    publishValidation(
      issues.length
        ? "failed"
        : "passed",
      issues
    );

    return issues;
  }

  function initializeObjectListeners() {
    for (
      const object
      of state.objects.values()
    ) {
      addListener(
        object,
        "click",
        handleDirectObjectClick
      );
    }

    for (
      const control
      of document.querySelectorAll(
        SELECTORS.fallbackPortal
      )
    ) {
      addListener(
        control,
        "click",
        handleFallbackPortalClick
      );
    }
  }

  function initializeCompassControls() {
    for (
      const control
      of state.compassControls
    ) {
      addListener(
        control,
        "click",
        event => {
          event.preventDefault();

          openCompassDialog(control);
        }
      );
    }

    for (
      const control
      of document.querySelectorAll(
        SELECTORS.compassClose
      )
    ) {
      addListener(
        control,
        "click",
        () => {
          closeCompassDialog({
            restoreFocus:
              true,

            reason:
              "close-button"
          });
        }
      );
    }

    for (
      const control
      of document.querySelectorAll(
        SELECTORS.compassStay
      )
    ) {
      addListener(
        control,
        "click",
        stayInShowroom
      );
    }

    if (state.compassReturn) {
      addListener(
        state.compassReturn,
        "click",
        () => {
          publishReceipt(
            "main-compass-navigation-requested",
            {
              route:
                MAIN_COMPASS_ROUTE
            }
          );
        }
      );
    }
  }

  function initializeRouteControls() {
    for (
      const control
      of document.querySelectorAll(
        SELECTORS.routeClose
      )
    ) {
      addListener(
        control,
        "click",
        () => {
          closeRouteDialog({
            restoreFocus:
              true,

            reason:
              "close-button"
          });
        }
      );
    }

    for (
      const control
      of document.querySelectorAll(
        SELECTORS.routeStay
      )
    ) {
      addListener(
        control,
        "click",
        () => {
          closeRouteDialog({
            restoreFocus:
              true,

            reason:
              "stay"
          });
        }
      );
    }

    if (state.routeContinue) {
      addListener(
        state.routeContinue,
        "click",
        event => {
          event.preventDefault();

          continuePendingRoute();
        }
      );
    }
  }

  function initializeReturnControls() {
    const controls =
      toArray(
        document.querySelectorAll(
          [
            SELECTORS.accessibleReturnToOrbit,
            SELECTORS.sharedReturnToOrbit,
            SELECTORS.legacyReturnToOrbit
          ].join(",")
        )
      );

    for (
      const control
      of controls
    ) {
      addListener(
        control,
        "click",
        event => {
          event.preventDefault();

          state.lastTriggers.orbit =
            control;

          returnToOrbit();
        }
      );
    }
  }

  function initializeInstructionsControls() {
    for (
      const control
      of state.instructionControls
    ) {
      addListener(
        control,
        "click",
        event => {
          event.preventDefault();

          state.lastTriggers.instructions =
            control;

          openInstructions({
            scroll:
              true,

            focus:
              false
          });
        }
      );
    }

    if (state.instructionsDisclosure) {
      addListener(
        state.instructionsDisclosure,
        "toggle",
        syncInstructionsState
      );
    }

    syncInstructionsState();
  }

  function initializeConstructionControls() {
    for (
      const control
      of document.querySelectorAll(
        SELECTORS.constructionOpen
      )
    ) {
      addListener(
        control,
        "click",
        () => {
          openConstructionDialog(
            control
          );
        }
      );
    }

    for (
      const control
      of document.querySelectorAll(
        SELECTORS.constructionClose
      )
    ) {
      addListener(
        control,
        "click",
        () => {
          closeConstructionDialog({
            restoreFocus:
              true,

            reason:
              "close-button"
          });
        }
      );
    }
  }

  function initializeDialogEvents() {
    if (state.routeDialog) {
      addListener(
        state.routeDialog,
        "cancel",
        event => {
          event.preventDefault();

          closeRouteDialog({
            restoreFocus:
              true,

            reason:
              "escape"
          });
        }
      );

      addListener(
        state.routeDialog,
        "close",
        () => {
          const expected =
            state.expectedDialogClose.route;

          state.expectedDialogClose.route =
            null;

          finalizeRouteDialogClose(
            expected || {
              generation:
                state.activeDialogGeneration.route ||
                state.pendingRoute.generation,

              reason:
                "native-close",

              restoreFocus:
                false,

              silent:
                false,

              trigger:
                state.pendingRoute.trigger,

              routeData:
                state.pendingRoute.data
            }
          );
        }
      );
    }

    if (state.compassDialog) {
      addListener(
        state.compassDialog,
        "cancel",
        event => {
          event.preventDefault();

          closeCompassDialog({
            restoreFocus:
              true,

            reason:
              "escape"
          });
        }
      );

      addListener(
        state.compassDialog,
        "close",
        () => {
          const expected =
            state.expectedDialogClose.compass;

          state.expectedDialogClose.compass =
            null;

          finalizeCompassDialogClose(
            expected || {
              generation:
                state.activeDialogGeneration.compass,

              reason:
                "native-close",

              restoreFocus:
                false,

              silent:
                false,

              trigger:
                state.lastTriggers.compass
            }
          );
        }
      );
    }

    if (state.constructionDialog) {
      addListener(
        state.constructionDialog,
        "cancel",
        event => {
          event.preventDefault();

          closeConstructionDialog({
            restoreFocus:
              true,

            reason:
              "escape"
          });
        }
      );

      addListener(
        state.constructionDialog,
        "close",
        () => {
          const expected =
            state.expectedDialogClose.construction;

          state.expectedDialogClose.construction =
            null;

          finalizeConstructionDialogClose(
            expected || {
              generation:
                state.activeDialogGeneration.construction,

              reason:
                "native-close",

              restoreFocus:
                false,

              silent:
                false,

              trigger:
                state.lastTriggers.construction
            }
          );
        }
      );
    }
  }

  function initializeRuntimeEvents() {
    addListener(
      window,
      EVENTS.semanticActivate,
      handleSemanticActivation
    );

    addListener(
      window,
      EVENTS.objectActivate,
      handleSemanticActivation
    );

    addListener(
      window,
      EVENTS.compassActivate,
      handleCompassActivation
    );

    addListener(
      window,
      EVENTS.clusterExitIntent,
      handleClusterExitIntent
    );

    addListener(
      window,
      EVENTS.compositorReady,
      () => {
        setSubsystemReadiness(
          READINESS_KEYS.compositor,
          true,
          {
            reason:
              EVENTS.compositorReady
          }
        );
      }
    );

    addListener(
      window,
      EVENTS.compositorFailed,
      () => {
        setSubsystemReadiness(
          READINESS_KEYS.compositor,
          false,
          {
            failed:
              true,

            reason:
              EVENTS.compositorFailed
          }
        );
      }
    );

    addListener(
      window,
      EVENTS.compositorDisposed,
      () => {
        setSubsystemReadiness(
          READINESS_KEYS.compositor,
          false,
          {
            reason:
              EVENTS.compositorDisposed
          }
        );
      }
    );

    addListener(
      window,
      EVENTS.crystalsReady,
      () => {
        setSubsystemReadiness(
          READINESS_KEYS.crystals,
          true,
          {
            reason:
              EVENTS.crystalsReady
          }
        );
      }
    );

    addListener(
      window,
      EVENTS.crystalsFailed,
      () => {
        setSubsystemReadiness(
          READINESS_KEYS.crystals,
          false,
          {
            failed:
              true,

            reason:
              EVENTS.crystalsFailed
          }
        );
      }
    );

    addListener(
      window,
      EVENTS.crystalsDisposed,
      () => {
        setSubsystemReadiness(
          READINESS_KEYS.crystals,
          false,
          {
            reason:
              EVENTS.crystalsDisposed
          }
        );
      }
    );

    addListener(
      window,
      EVENTS.interactionsReady,
      () => {
        setSubsystemReadiness(
          READINESS_KEYS.interactions,
          true,
          {
            reason:
              EVENTS.interactionsReady
          }
        );
      }
    );

    addListener(
      window,
      EVENTS.interactionsFailed,
      () => {
        setSubsystemReadiness(
          READINESS_KEYS.interactions,
          false,
          {
            failed:
              true,

            reason:
              EVENTS.interactionsFailed
          }
        );
      }
    );

    addListener(
      window,
      EVENTS.interactionsDisposed,
      () => {
        setSubsystemReadiness(
          READINESS_KEYS.interactions,
          false,
          {
            reason:
              EVENTS.interactionsDisposed
          }
        );
      }
    );

    addListener(
      window,
      EVENTS.windowHeld,
      () => {
        setHeld(
          true,
          "window-held"
        );
      }
    );

    addListener(
      window,
      EVENTS.windowReleased,
      () => {
        setHeld(
          false,
          "window-released"
        );
      }
    );

    addListener(
      window,
      EVENTS.gaugesReady,
      () => {
        if (
          state.committed.informationTab
        ) {
          requestInformationTab(
            state.committed.informationTab
          );
        }
      }
    );
  }

  function initializeRootObserver() {
    if (!state.root) {
      return;
    }

    const observer =
      new MutationObserver(
        mutations => {
          for (
            const mutation
            of mutations
          ) {
            if (
              mutation.attributeName ===
              ATTRIBUTES.held
            ) {
              const requested =
                state.root.getAttribute(
                  ATTRIBUTES.held
                ) === "true";

              if (
                requested !==
                state.held
              ) {
                setHeld(
                  requested,
                  "root-attribute"
                );
              }
            }
          }
        }
      );

    observer.observe(
      state.root,
      {
        attributes:
          true,

        attributeFilter: [
          ATTRIBUTES.held
        ]
      }
    );

    addObserver(observer);
  }

  function initializeBaseline() {
    state.durableState =
      DURABLE_STATES.CONSTELLATION;

    state.committed.cardinalId = "";
    state.committed.childId = "";
    state.committed.clusterId = "";
    state.committed.localTargetId = "";
    state.committed.frontId = "";
    state.committed.gaugeSet = "";
    state.committed.informationTab = "";

    state.preview.active = false;
    state.preview.objectId = "";
    state.preview.cardinalId = "";
    state.preview.childId = "";
    state.preview.clusterId = "";
    state.preview.source = "";

    state.pendingRoute.data = null;
    state.pendingRoute.trigger = null;
    state.pendingRoute.generation = 0;

    state.activeDialogGeneration.route = 0;
    state.activeDialogGeneration.compass = 0;
    state.activeDialogGeneration.construction = 0;

    state.expectedDialogClose.route = null;
    state.expectedDialogClose.compass = null;
    state.expectedDialogClose.construction = null;

    state.held = false;

    restoreNativeSemanticFallback();

    reflectState();
  }

  function exposeApi() {
    const api =
      Object.freeze({
        contract:
          CONTRACT,

        getFrameState,

        getState,

        beginPreview,

        previewObject:
          beginPreview,

        commitPreview,

        cancelPreview,

        commitObject,

        activateObjectById(
          objectId,
          options = {}
        ) {
          return commitObject(
            objectId,
            options
          );
        },

        openCluster,

        closeCluster,

        toggleCluster,

        activateLocalDestinationByObjectId(
          objectId,
          options = {}
        ) {
          const object =
            resolveObject(
              objectId
            );

          if (!object) {
            return false;
          }

          const descriptor =
            describeObject(object);

          if (
            descriptor.behavior !==
            "local"
          ) {
            return false;
          }

          return activateLocalDestination(
            descriptor,
            options
          );
        },

        openRouteDialogByObjectId(
          objectId
        ) {
          const object =
            resolveObject(
              objectId
            );

          return object
            ? openRouteDialog(
                object,
                {
                  trigger:
                    object
                }
              )
            : false;
        },

        closeRouteDialog,

        continuePendingRoute,

        openCompassDialog,

        closeCompassDialog,

        returnToOrbit,

        openInstructions,

        requestInformationTab,

        setHeld,

        setSubsystemReadiness,

        dispose
      });

    Object.defineProperty(
      window,
      "SHOWROOM_CONTROLLER",
      {
        configurable:
          true,

        enumerable:
          false,

        writable:
          false,

        value:
          api
      }
    );

    state.apiExposed = true;
  }

  function removeExposedApi() {
    if (!state.apiExposed) {
      return;
    }

    try {
      delete window.SHOWROOM_CONTROLLER;
    } catch {
      /* Noncritical cleanup. */
    }

    state.apiExposed = false;
  }

  function rollbackInitialization() {
    state.expectedDialogClose.route = null;
    state.expectedDialogClose.compass = null;
    state.expectedDialogClose.construction = null;

    state.activeDialogGeneration.route = 0;
    state.activeDialogGeneration.compass = 0;
    state.activeDialogGeneration.construction = 0;

    state.pendingRoute.data = null;
    state.pendingRoute.trigger = null;
    state.pendingRoute.generation = 0;

    state.preview.active = false;
    state.preview.objectId = "";
    state.preview.cardinalId = "";
    state.preview.childId = "";
    state.preview.clusterId = "";
    state.preview.source = "";

    removeInstalledResources();
    removeExposedApi();

    restoreNativeSemanticFallback();
    restoreNativeRootState();

    state.readiness.controller = false;
    state.readiness.compositor = false;
    state.readiness.crystals = false;
    state.readiness.interactions = false;

    state.initialized = false;
    state.initializing = false;
  }

  function initialize() {
    if (
      state.initialized ||
      state.initializing ||
      state.disposed
    ) {
      return;
    }

    state.initializing = true;

    try {
      discoverDom();

      if (!state.root) {
        throw new Error(
          "The Showroom controller cannot initialize without [data-showroom-root]."
        );
      }

      captureNativeDomStates();

      const issues =
        validateDom();

      initializeReducedMotion();
      initializeBaseline();

      initializeObjectListeners();
      initializeCompassControls();
      initializeRouteControls();
      initializeReturnControls();
      initializeInstructionsControls();
      initializeConstructionControls();
      initializeDialogEvents();
      initializeRuntimeEvents();
      initializeRootObserver();

      exposeApi();

      state.initialized = true;
      state.initializing = false;
      state.readiness.controller = true;

      setRootAttribute(
        ATTRIBUTES.controllerReady,
        "true"
      );

      setRootAttribute(
        ATTRIBUTES.controllerState,
        issues.length
          ? "ready-with-validation-issues"
          : "ready"
      );

      dispatchReadinessChanged(
        "controller-ready"
      );

      publishReceipt(
        "ready",
        {
          validationIssues:
            issues,

          cardinalCount:
            state.cardinals.size,

          childCount:
            state.children.size,

          clusterCount:
            state.clusters.size,

          frontCount:
            state.fronts.size,

          fallbackNavigationPresent:
            Boolean(
              document.querySelector(
                SELECTORS.fallbackNavigation
              )
            ),

          compassVisualMount:
            Boolean(
              state.compassVisualMount
            )
        }
      );

      dispatch(
        EVENTS.controllerReady,
        {
          frame:
            getFrameState(),

          api: [
            "getFrameState",
            "getState",
            "beginPreview",
            "commitPreview",
            "cancelPreview",
            "commitObject",
            "openCluster",
            "closeCluster",
            "toggleCluster",
            "openRouteDialogByObjectId",
            "closeRouteDialog",
            "openCompassDialog",
            "closeCompassDialog",
            "returnToOrbit",
            "openInstructions",
            "requestInformationTab",
            "setHeld",
            "setSubsystemReadiness",
            "dispose"
          ]
        }
      );
    } catch (error) {
      const errorPayload = {
        name:
          error instanceof Error
            ? error.name
            : "Error",

        message:
          error instanceof Error
            ? error.message
            : String(error)
      };

      rollbackInitialization();

      try {
        publishReceipt(
          "fatal-error",
          {
            error:
              errorPayload,

            partialInstallationRolledBack:
              true,

            nativePresentationRestored:
              true,

            nativeControlsRestored:
              true
          }
        );
      } catch {
        /* The rollback remains authoritative if receipt output also fails. */
      }
    }
  }

  function dispose() {
    if (state.disposed) {
      return;
    }

    state.disposed = true;

    state.expectedDialogClose.route = null;
    state.expectedDialogClose.compass = null;
    state.expectedDialogClose.construction = null;

    state.activeDialogGeneration.route = 0;
    state.activeDialogGeneration.compass = 0;
    state.activeDialogGeneration.construction = 0;

    state.pendingRoute.data = null;
    state.pendingRoute.trigger = null;
    state.pendingRoute.generation = 0;

    state.preview.active = false;
    state.preview.objectId = "";
    state.preview.cardinalId = "";
    state.preview.childId = "";
    state.preview.clusterId = "";
    state.preview.source = "";

    state.readiness.controller = false;
    state.readiness.compositor = false;
    state.readiness.crystals = false;
    state.readiness.interactions = false;

    removeInstalledResources();
    removeExposedApi();

    restoreNativeSemanticFallback();
    restoreNativeRootState();

    state.initialized = false;
    state.initializing = false;

    try {
      publishReceipt(
        "disposed",
        {
          durableSemanticStatePreserved:
            true,

          nativePresentationRestored:
            true,

          nativeControlsRestored:
            true,

          rootStateRestored:
            true
        }
      );
    } catch {
      /* Disposal restoration remains authoritative. */
    }
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initialize,
      {
        once:
          true
      }
    );
  } else {
    initialize();
  }

  window.addEventListener(
    "pagehide",
    event => {
      if (!event.persisted) {
        dispose();
      }
    },
    {
      once:
        true
    }
  );
})();

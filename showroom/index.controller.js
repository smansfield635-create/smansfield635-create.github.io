/* TARGET FILE: /showroom/index.controller.js */
/* TNT FULL-FILE REPLACEMENT */
/* SHOWROOM_MIRRORLAND_FOCAL_CONTROLLER_TNT_v4 */
/*
  Recovery invariant:

  The complete HTML/CSS Showroom remains visible and usable when the
  compositor, crystals, or interactions are absent, pending, failed,
  stopped, or disposed.

  Renewal objectives:
  - Preserve the canonical baseline and all existing controller authority.
  - Accept constellation activation only from controls physically owned by
    [data-showroom-orbit-field].
  - Reject malformed, displaced, stale, or out-of-field semantic events.
  - Reject malformed Compass activation events.
  - Prevent disclosure taps outside the orbit field from activating stars,
    hiding fronts, or returning focus to the Compass.
  - Preserve direct keyboard activation of semantic star controls.
  - Add optional support for an external instructions-opening control.
  - Preserve native <details>/<summary> behavior for the Mirrorland preface.
  - Preserve route, cluster, front, dialog, fallback, recovery, and disposal
    behavior from v3.

  Page-level authority:
  - Own canonical Showroom presentation state.
  - Own active orbit cluster.
  - Own active local front.
  - Own requested informational tab.
  - Own Main Compass return-dialog behavior.
  - Own route-offer dialogs.
  - Own Return to Orbit behavior.
  - Own construction-record dialog behavior.
  - Own optional external instructions-opening behavior.
  - Own page-level focus restoration.
  - Reflect reduced-motion and held states.
  - Coordinate fallback-star paint with crystal readiness.
  - Restore the canonical baseline after enhancement failure or disposal.

  Does not own:
  - pointer deltas;
  - drag sensitivity;
  - tap-versus-drag arbitration;
  - gesture quaternion construction;
  - orbital camera or projection;
  - crystal geometry, animation, drawing, or semantic positioning;
  - gauge-local selection;
  - Diamond camera, rendering, rotation, zoom, or lifecycle;
  - Mirrorland Window geometry, rendering, or animation;
  - Compass renderer lifecycle.
*/

(() => {
  "use strict";

  const CONTRACT =
    "SHOWROOM_MIRRORLAND_FOCAL_CONTROLLER_TNT_v4";

  const MAIN_COMPASS_ROUTE =
    "/index.html";

  const PRESENTATION = Object.freeze({
    BASELINE:
      "baseline",

    PENDING:
      "enhancement-pending",

    AVAILABLE:
      "enhanced-available",

    ACTIVE:
      "enhanced-active",

    FAILED:
      "enhancement-failed"
  });

  const EVENTS = Object.freeze({
    ready:
      "showroom:controller-ready",

    receipt:
      "showroom:controller-receipt",

    stateChanged:
      "showroom:state-changed",

    frontChanged:
      "showroom:front-changed",

    clusterChanged:
      "showroom:cluster-changed",

    dialogChanged:
      "showroom:dialog-changed",

    semanticActivate:
      "showroom:semantic-activate",

    objectActivate:
      "showroom:object-activate",

    compassActivate:
      "showroom:compass-activate",

    crystalsReady:
      "showroom:crystals-ready",

    crystalsFailed:
      "showroom:crystals-failed",

    crystalsDisposed:
      "showroom:crystals-disposed",

    compositorFailed:
      "showroom:compositor-failed",

    compositorDisposed:
      "showroom:compositor-disposed",

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

    orbitField:
      "[data-showroom-orbit-field]",

    object:
      "[data-showroom-object]",

    compassControl:
      "[data-showroom-compass-control]",

    compassDialog:
      "[data-showroom-compass-dialog]",

    compassClose:
      "[data-showroom-compass-close]",

    compassStay:
      "[data-showroom-compass-stay]",

    compassReturn:
      "[data-showroom-compass-return]",

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

    cluster:
      "[data-showroom-cluster]",

    front:
      "[data-showroom-front]",

    returnToOrbit:
      "[data-showroom-return-to-orbit]",

    constructionDialog:
      "#construction-record-dialog",

    constructionOpen:
      "[data-open-construction-record]",

    constructionClose:
      "[data-close-construction-record]",

    fallbackStarLayer:
      "[data-showroom-fallback-star-layer]",

    fallbackStar:
      "[data-showroom-fallback-star]",

    instructionsDisclosure:
      "[data-showroom-instructions-disclosure]",

    instructionsOpen:
      "[data-showroom-open-instructions]"
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

    crystalsReady:
      "data-showroom-crystals-ready",

    clusterState:
      "data-showroom-cluster-state",

    frontState:
      "data-showroom-front-state",

    fallbackVisibility:
      "data-showroom-fallback-star-visibility",

    fallbackRendering:
      "data-showroom-fallback-star-rendering",

    dialogState:
      "data-showroom-dialog-state",

    controllerManagedHidden:
      "data-showroom-controller-managed-hidden"
  });

  const state = {
    root: null,
    receipt: null,
    validation: null,

    orbit: null,
    orbitField: null,

    compassControl: null,
    compassDialog: null,
    compassReturn: null,

    routeDialog: null,
    routeTitle: null,
    routeDescription: null,
    routeContinue: null,

    constructionDialog: null,

    instructionsDisclosure: null,
    instructionsOpenControls: [],

    objects: [],
    clusters: new Map(),
    fronts: new Map(),

    originalFrontStates: new Map(),

    activeClusterId: "",
    activeFrontId: "",
    activeGaugeSet: "",
    activeInformationTab: "",

    pendingRoute: null,

    lastCompassTrigger: null,
    lastRouteTrigger: null,
    lastConstructionTrigger: null,
    lastInstructionsTrigger: null,

    reducedMotionQuery: null,
    reducedMotion: false,

    crystalsReady: false,
    enhancementAvailable: false,
    enhancedPresentationActive: false,

    held: false,

    initialized: false,
    disposed: false,

    listeners: [],
    observers: [],

    lastActivation: {
      key: "",
      timestamp: 0
    },

    counters: {
      acceptedSemanticActivations: 0,
      rejectedSemanticActivations: 0,
      acceptedCompassActivations: 0,
      rejectedCompassActivations: 0,
      directObjectClicks: 0,
      instructionsOpened: 0
    }
  };

  function toArray(value) {
    return Array.from(value || []);
  }

  function normalize(value) {
    return String(value || "").trim();
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function isFiniteNumber(value) {
    return (
      typeof value === "number" &&
      Number.isFinite(value)
    );
  }

  function addListener(
    target,
    type,
    handler,
    options
  ) {
    if (!target) {
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

  function currentEnhancementState() {
    if (
      state.enhancedPresentationActive &&
      state.enhancementAvailable
    ) {
      return PRESENTATION.ACTIVE;
    }

    if (state.enhancementAvailable) {
      return PRESENTATION.AVAILABLE;
    }

    if (state.initialized) {
      return PRESENTATION.PENDING;
    }

    return PRESENTATION.BASELINE;
  }

  function createStateSnapshot(extra = {}) {
    return Object.freeze({
      contract:
        CONTRACT,

      timestamp:
        nowIso(),

      ready:
        state.initialized &&
        !state.disposed,

      disposed:
        state.disposed,

      pageState:
        state.root
          ? state.root.getAttribute(
              ATTRIBUTES.pageState
            )
          : null,

      presentationMode:
        state.root
          ? state.root.getAttribute(
              ATTRIBUTES.presentationMode
            )
          : null,

      enhancementState:
        state.root
          ? state.root.getAttribute(
              ATTRIBUTES.enhancementState
            )
          : null,

      enhancementAvailable:
        state.enhancementAvailable,

      enhancedPresentationActive:
        state.enhancedPresentationActive,

      activeClusterId:
        state.activeClusterId || null,

      activeFrontId:
        state.activeFrontId || null,

      activeGaugeSet:
        state.activeGaugeSet || null,

      activeInformationTab:
        state.activeInformationTab || null,

      compassDialogOpen:
        Boolean(
          state.compassDialog &&
          state.compassDialog.open
        ),

      routeDialogOpen:
        Boolean(
          state.routeDialog &&
          state.routeDialog.open
        ),

      constructionDialogOpen:
        Boolean(
          state.constructionDialog &&
          state.constructionDialog.open
        ),

      instructionsOpen:
        Boolean(
          state.instructionsDisclosure &&
          state.instructionsDisclosure.open
        ),

      crystalsReady:
        state.crystalsReady,

      reducedMotion:
        state.reducedMotion,

      held:
        state.held,

      counters:
        Object.freeze({
          ...state.counters
        }),

      ...extra
    });
  }

  function publishReceipt(
    event,
    extra = {}
  ) {
    const payload =
      createStateSnapshot({
        event,
        ...extra
      });

    if (state.receipt) {
      const serialized =
        JSON.stringify(payload);

      state.receipt.value =
        serialized;

      state.receipt.textContent =
        serialized;
    }

    window.dispatchEvent(
      new CustomEvent(
        EVENTS.receipt,
        {
          detail:
            payload
        }
      )
    );

    return payload;
  }

  function publishValidation(
    status,
    issues = []
  ) {
    const payload =
      Object.freeze({
        contract:
          CONTRACT,

        timestamp:
          nowIso(),

        status,

        issues:
          Object.freeze(
            issues.slice()
          )
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

  function dispatchStateEvent(
    eventName,
    detail = {}
  ) {
    window.dispatchEvent(
      new CustomEvent(
        eventName,
        {
          detail:
            Object.freeze({
              contract:
                CONTRACT,

              ...detail
            })
        }
      )
    );
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
      return;
    }

    if (
      typeof dialog.close ===
        "function" &&
      dialog.open
    ) {
      dialog.close(
        returnValue
      );

      return;
    }

    dialog.removeAttribute(
      "open"
    );
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
    if (!element) {
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

  function setPageState(
    pageState,
    presentationMode = pageState,
    enhancementState =
      currentEnhancementState()
  ) {
    setRootAttribute(
      ATTRIBUTES.pageState,
      pageState
    );

    setRootAttribute(
      ATTRIBUTES.presentationMode,
      presentationMode
    );

    setRootAttribute(
      ATTRIBUTES.enhancementState,
      enhancementState
    );

    dispatchStateEvent(
      EVENTS.stateChanged,
      {
        pageState,
        presentationMode,
        enhancementState
      }
    );
  }

  function isDuplicateActivation(
    key,
    threshold = 260
  ) {
    const timestamp =
      performance.now();

    const duplicate =
      state.lastActivation.key ===
        key &&
      timestamp -
        state.lastActivation.timestamp <
        threshold;

    state.lastActivation.key =
      key;

    state.lastActivation.timestamp =
      timestamp;

    return duplicate;
  }

  function findObjectById(
    objectId
  ) {
    return (
      state.objects.find(
        object =>
          object.getAttribute(
            "data-showroom-object-id"
          ) === objectId
      ) ||
      null
    );
  }

  function resolveSemanticObject(
    source
  ) {
    if (!(source instanceof Element)) {
      return null;
    }

    if (
      source.matches(
        SELECTORS.object
      )
    ) {
      return source;
    }

    return source.closest(
      SELECTORS.object
    );
  }

  function isOrbitOwnedElement(
    element
  ) {
    return Boolean(
      element &&
      state.orbitField &&
      state.orbitField.contains(
        element
      )
    );
  }

  function isOrbitOwnedObject(
    object
  ) {
    return Boolean(
      object &&
      object.matches(
        SELECTORS.object
      ) &&
      isOrbitOwnedElement(
        object
      )
    );
  }

  function pointInsideElement(
    element,
    x,
    y
  ) {
    if (
      !element ||
      !isFiniteNumber(x) ||
      !isFiniteNumber(y)
    ) {
      return false;
    }

    const rect =
      element.getBoundingClientRect();

    return (
      x >= rect.left &&
      x <= rect.right &&
      y >= rect.top &&
      y <= rect.bottom
    );
  }

  function readActivationCoordinates(
    detail
  ) {
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
        detail.x,
        detail.y
      ],
      [
        detail.startX,
        detail.startY
      ]
    ];

    for (
      const candidate
      of candidates
    ) {
      if (
        isFiniteNumber(
          candidate[0]
        ) &&
        isFiniteNumber(
          candidate[1]
        )
      ) {
        return Object.freeze({
          x:
            candidate[0],

          y:
            candidate[1]
        });
      }
    }

    return null;
  }

  function resolveElementAtPoint(
    coordinates
  ) {
    if (!coordinates) {
      return null;
    }

    try {
      return document.elementFromPoint(
        coordinates.x,
        coordinates.y
      );
    } catch {
      return null;
    }
  }

  function validateSemanticEvent(
    detail,
    object
  ) {
    if (
      detail.validTap === false ||
      detail.cancelled === true ||
      detail.wasDrag === true
    ) {
      return Object.freeze({
        valid:
          false,

        reason:
          "event-reported-invalid-tap"
      });
    }

    if (!isOrbitOwnedObject(object)) {
      return Object.freeze({
        valid:
          false,

        reason:
          "object-outside-orbit-field"
      });
    }

    if (
      detail.element instanceof
        Element &&
      !isOrbitOwnedElement(
        detail.element
      )
    ) {
      return Object.freeze({
        valid:
          false,

        reason:
          "event-element-outside-orbit-field"
      });
    }

    const coordinates =
      readActivationCoordinates(
        detail
      );

    if (
      coordinates &&
      !pointInsideElement(
        state.orbitField,
        coordinates.x,
        coordinates.y
      )
    ) {
      return Object.freeze({
        valid:
          false,

        reason:
          "activation-point-outside-orbit-field"
      });
    }

    if (
      !coordinates &&
      !(detail.element instanceof Element)
    ) {
      return Object.freeze({
        valid:
          false,

        reason:
          "event-has-no-grounded-element-or-coordinates"
      });
    }

    if (coordinates) {
      const releaseElement =
        resolveElementAtPoint(
          coordinates
        );

      const releaseObject =
        resolveSemanticObject(
          releaseElement
        );

      if (
        releaseObject &&
        releaseObject !== object
      ) {
        return Object.freeze({
          valid:
            false,

          reason:
            "release-point-resolves-to-different-object"
        });
      }

      if (
        releaseElement &&
        !state.orbitField.contains(
          releaseElement
        )
      ) {
        return Object.freeze({
          valid:
            false,

          reason:
            "release-point-resolves-outside-orbit-field"
        });
      }
    }

    return Object.freeze({
      valid:
        true,

      reason:
        "validated"
    });
  }

  function validateCompassEvent(
    detail
  ) {
    if (
      detail.validTap === false ||
      detail.cancelled === true ||
      detail.wasDrag === true
    ) {
      return Object.freeze({
        valid:
          false,

        reason:
          "event-reported-invalid-tap"
      });
    }

    if (
      !state.compassControl ||
      !isOrbitOwnedElement(
        state.compassControl
      )
    ) {
      return Object.freeze({
        valid:
          false,

        reason:
          "compass-control-outside-orbit-field"
      });
    }

    if (
      detail.element instanceof
        Element &&
      detail.element !==
        state.compassControl &&
      !state.compassControl.contains(
        detail.element
      )
    ) {
      return Object.freeze({
        valid:
          false,

        reason:
          "event-element-is-not-compass-control"
      });
    }

    const coordinates =
      readActivationCoordinates(
        detail
      );

    if (
      coordinates &&
      (
        !pointInsideElement(
          state.orbitField,
          coordinates.x,
          coordinates.y
        ) ||
        !pointInsideElement(
          state.compassControl,
          coordinates.x,
          coordinates.y
        )
      )
    ) {
      return Object.freeze({
        valid:
          false,

        reason:
          "compass-activation-point-invalid"
      });
    }

    if (
      !coordinates &&
      !(detail.element instanceof Element)
    ) {
      return Object.freeze({
        valid:
          false,

        reason:
          "compass-event-has-no-grounded-element-or-coordinates"
      });
    }

    return Object.freeze({
      valid:
        true,

      reason:
        "validated"
    });
  }

  function closeOtherDialogs(
    exceptDialog = null
  ) {
    const dialogs = [
      state.compassDialog,
      state.routeDialog,
      state.constructionDialog
    ];

    for (
      const dialog
      of dialogs
    ) {
      if (
        dialog &&
        dialog !== exceptDialog &&
        dialog.open
      ) {
        safelyCloseDialog(
          dialog,
          "superseded"
        );
      }
    }
  }

  /* =======================================================
     BASELINE PRESERVATION
     ======================================================= */

  function captureOriginalFrontStates() {
    for (
      const [
        frontId,
        front
      ]
      of state.fronts
    ) {
      state.originalFrontStates.set(
        frontId,
        Object.freeze({
          hidden:
            front.hidden,

          ariaHidden:
            front.getAttribute(
              "aria-hidden"
            ),

          frontState:
            front.getAttribute(
              ATTRIBUTES.frontState
            ),

          hadInertAttribute:
            front.hasAttribute(
              "inert"
            ),

          inertProperty:
            "inert" in front
              ? Boolean(front.inert)
              : false
        })
      );
    }
  }

  function makeFrontBaselineVisible(
    front
  ) {
    if (!front) {
      return;
    }

    front.hidden = false;

    front.removeAttribute(
      "hidden"
    );

    front.setAttribute(
      ATTRIBUTES.frontState,
      "baseline"
    );

    front.setAttribute(
      "aria-hidden",
      "false"
    );

    front.removeAttribute(
      ATTRIBUTES.controllerManagedHidden
    );

    front.removeAttribute(
      "inert"
    );

    if ("inert" in front) {
      front.inert = false;
    }
  }

  function restoreBaselineFronts() {
    for (
      const front
      of state.fronts.values()
    ) {
      makeFrontBaselineVisible(
        front
      );
    }
  }

  function clearPresentationSelection() {
    state.activeFrontId = "";
    state.activeClusterId = "";
    state.activeGaugeSet = "";
    state.activeInformationTab = "";

    setRootAttribute(
      ATTRIBUTES.activeFront,
      ""
    );

    setRootAttribute(
      ATTRIBUTES.activeCluster,
      ""
    );

    setRootAttribute(
      ATTRIBUTES.activeGaugeSet,
      ""
    );

    setRootAttribute(
      ATTRIBUTES.activeInformationTab,
      ""
    );
  }

  function restoreBaselinePresentation(
    reason = "baseline-restored",
    options = {}
  ) {
    state.enhancedPresentationActive =
      false;

    restoreBaselineFronts();
    closeAllClusters();
    clearPresentationSelection();

    setPageState(
      PRESENTATION.BASELINE,
      PRESENTATION.BASELINE,
      options.failed
        ? PRESENTATION.FAILED
        : state.enhancementAvailable
          ? PRESENTATION.AVAILABLE
          : PRESENTATION.PENDING
    );

    publishReceipt(
      "baseline-restored",
      {
        reason,

        failed:
          Boolean(
            options.failed
          )
      }
    );

    dispatchStateEvent(
      EVENTS.frontChanged,
      {
        frontId:
          null,

        active:
          false,

        baselineRestored:
          true,

        reason
      }
    );
  }

  function enterEnhancedPresentation(
    reason = "user-activation"
  ) {
    if (
      !state.enhancementAvailable ||
      !state.crystalsReady
    ) {
      return false;
    }

    state.enhancedPresentationActive =
      true;

    setPageState(
      state.activeFrontId
        ? "front"
        : "orbit",

      state.activeFrontId
        ? "front"
        : "orbit",

      PRESENTATION.ACTIVE
    );

    publishReceipt(
      "enhanced-presentation-entered",
      {
        reason
      }
    );

    return true;
  }

  /* =======================================================
     COMPASS RETURN DIALOG
     ======================================================= */

  function setCompassDialogState(
    open
  ) {
    setRootAttribute(
      ATTRIBUTES.compassDialogOpen,
      open
        ? "true"
        : "false"
    );

    if (state.compassControl) {
      state.compassControl.setAttribute(
        "aria-expanded",
        open
          ? "true"
          : "false"
      );

      state.compassControl.toggleAttribute(
        "data-showroom-compass-active",
        open
      );
    }

    if (state.compassDialog) {
      state.compassDialog.setAttribute(
        ATTRIBUTES.dialogState,
        open
          ? "open"
          : "closed"
      );
    }

    dispatchStateEvent(
      EVENTS.dialogChanged,
      {
        dialog:
          "compass",

        open
      }
    );
  }

  function openCompassDialog(
    trigger =
      state.compassControl
  ) {
    if (
      state.disposed ||
      state.held ||
      !state.compassDialog ||
      !state.compassControl ||
      !isOrbitOwnedElement(
        state.compassControl
      )
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

    closeOtherDialogs(
      state.compassDialog
    );

    state.lastCompassTrigger =
      trigger ||
      state.compassControl;

    setCompassDialogState(
      true
    );

    safelyShowModal(
      state.compassDialog
    );

    const firstChoice =
      state.compassDialog
        .querySelector(
          SELECTORS.compassStay
        );

    window.requestAnimationFrame(
      () => {
        focusElement(
          firstChoice ||
          state.compassDialog
        );
      }
    );

    publishReceipt(
      "compass-dialog-opened"
    );

    return true;
  }

  function closeCompassDialog(
    options = {}
  ) {
    const {
      restoreFocus = true,
      reason = "closed"
    } = options;

    if (!state.compassDialog) {
      return;
    }

    setCompassDialogState(
      false
    );

    if (state.compassDialog.open) {
      safelyCloseDialog(
        state.compassDialog,
        reason
      );
    }

    if (restoreFocus) {
      window.requestAnimationFrame(
        () => {
          focusElement(
            state.lastCompassTrigger ||
            state.compassControl
          );
        }
      );
    }

    publishReceipt(
      "compass-dialog-closed",
      {
        reason
      }
    );
  }

  function stayInShowroom() {
    closeCompassDialog({
      restoreFocus:
        true,

      reason:
        "stay"
    });

    if (
      state.enhancedPresentationActive
    ) {
      setPageState(
        state.activeFrontId
          ? "front"
          : "orbit",

        state.activeFrontId
          ? "front"
          : "orbit",

        PRESENTATION.ACTIVE
      );
    } else {
      setPageState(
        PRESENTATION.BASELINE,
        PRESENTATION.BASELINE,
        currentEnhancementState()
      );
    }

    publishReceipt(
      "stayed-in-showroom"
    );
  }

  /* =======================================================
     ROUTE DIALOG
     ======================================================= */

  function setRouteDialogState(
    open
  ) {
    setRootAttribute(
      ATTRIBUTES.routeDialogOpen,
      open
        ? "true"
        : "false"
    );

    dispatchStateEvent(
      EVENTS.dialogChanged,
      {
        dialog:
          "route",

        open,

        routeId:
          state.pendingRoute
            ? state.pendingRoute.id
            : null
      }
    );
  }

  function readRouteDefinition(
    object
  ) {
    if (!isOrbitOwnedObject(object)) {
      return null;
    }

    const route =
      normalize(
        object.getAttribute(
          "data-showroom-route"
        )
      );

    if (!route) {
      return null;
    }

    return Object.freeze({
      id:
        normalize(
          object.getAttribute(
            "data-showroom-route-id"
          )
        ) ||
        normalize(
          object.getAttribute(
            "data-showroom-object-id"
          )
        ),

      label:
        normalize(
          object.getAttribute(
            "data-showroom-route-label"
          )
        ) ||
        "Continue to destination",

      description:
        normalize(
          object.getAttribute(
            "data-showroom-route-description"
          )
        ) ||
        "This path leaves the current Showroom page.",

      route,

      object
    });
  }

  function openRouteDialog(
    object
  ) {
    if (
      state.disposed ||
      state.held ||
      !state.routeDialog ||
      !isOrbitOwnedObject(object)
    ) {
      return false;
    }

    const routeDefinition =
      readRouteDefinition(
        object
      );

    if (!routeDefinition) {
      publishReceipt(
        "route-definition-missing",
        {
          objectId:
            object
              ? object.getAttribute(
                  "data-showroom-object-id"
                )
              : null
        }
      );

      return false;
    }

    const activationKey =
      `route:${routeDefinition.id}`;

    if (
      isDuplicateActivation(
        activationKey
      )
    ) {
      return false;
    }

    closeOtherDialogs(
      state.routeDialog
    );

    state.pendingRoute =
      routeDefinition;

    state.lastRouteTrigger =
      object;

    if (state.routeTitle) {
      state.routeTitle.textContent =
        routeDefinition.label;
    }

    if (state.routeDescription) {
      state.routeDescription.textContent =
        routeDefinition.description;
    }

    if (state.routeContinue) {
      state.routeContinue.href =
        routeDefinition.route;

      state.routeContinue.textContent =
        `Continue to ${routeDefinition.label}`;
    }

    setRouteDialogState(
      true
    );

    safelyShowModal(
      state.routeDialog
    );

    const stayButton =
      state.routeDialog
        .querySelector(
          SELECTORS.routeStay
        );

    window.requestAnimationFrame(
      () => {
        focusElement(
          stayButton ||
          state.routeDialog
        );
      }
    );

    publishReceipt(
      "route-dialog-opened",
      {
        routeId:
          routeDefinition.id,

        route:
          routeDefinition.route
      }
    );

    return true;
  }

  function closeRouteDialog(
    options = {}
  ) {
    const {
      restoreFocus = true,
      reason = "closed"
    } = options;

    if (!state.routeDialog) {
      return;
    }

    setRouteDialogState(
      false
    );

    if (state.routeDialog.open) {
      safelyCloseDialog(
        state.routeDialog,
        reason
      );
    }

    const trigger =
      state.lastRouteTrigger;

    const closedRoute =
      state.pendingRoute;

    state.pendingRoute = null;

    if (restoreFocus) {
      window.requestAnimationFrame(
        () => {
          focusElement(
            trigger
          );
        }
      );
    }

    publishReceipt(
      "route-dialog-closed",
      {
        reason,

        routeId:
          closedRoute
            ? closedRoute.id
            : null
      }
    );
  }

  /* =======================================================
     CLUSTERS
     ======================================================= */

  function setClusterExpanded(
    clusterId,
    expanded,
    options = {}
  ) {
    const cluster =
      state.clusters.get(
        clusterId
      );

    if (!cluster) {
      return false;
    }

    const trigger =
      state.objects.find(
        object =>
          object.getAttribute(
            "data-showroom-cluster-id"
          ) === clusterId &&
          isOrbitOwnedObject(
            object
          )
      ) ||
      null;

    cluster.setAttribute(
      ATTRIBUTES.clusterState,
      expanded
        ? "expanded"
        : "collapsed"
    );

    cluster.hidden =
      !expanded;

    cluster.setAttribute(
      "aria-hidden",
      expanded
        ? "false"
        : "true"
    );

    if (trigger) {
      trigger.setAttribute(
        "aria-expanded",
        expanded
          ? "true"
          : "false"
      );

      trigger.toggleAttribute(
        "data-showroom-cluster-active",
        expanded
      );
    }

    if (expanded) {
      state.activeClusterId =
        clusterId;

      setRootAttribute(
        ATTRIBUTES.activeCluster,
        clusterId
      );

      if (
        options.focusFirstChild
      ) {
        const firstChild =
          cluster.querySelector(
            SELECTORS.object
          );

        window.requestAnimationFrame(
          () => {
            focusElement(
              firstChild
            );
          }
        );
      }
    } else if (
      state.activeClusterId ===
      clusterId
    ) {
      state.activeClusterId =
        "";

      setRootAttribute(
        ATTRIBUTES.activeCluster,
        ""
      );
    }

    dispatchStateEvent(
      EVENTS.clusterChanged,
      {
        clusterId,
        expanded
      }
    );

    publishReceipt(
      expanded
        ? "cluster-expanded"
        : "cluster-collapsed",
      {
        clusterId
      }
    );

    return true;
  }

  function closeAllClusters(
    exceptClusterId = ""
  ) {
    for (
      const clusterId
      of state.clusters.keys()
    ) {
      if (
        clusterId !==
        exceptClusterId
      ) {
        setClusterExpanded(
          clusterId,
          false
        );
      }
    }
  }

  function toggleCluster(
    clusterId,
    trigger = null
  ) {
    if (
      trigger &&
      !isOrbitOwnedObject(
        trigger
      )
    ) {
      return false;
    }

    const cluster =
      state.clusters.get(
        clusterId
      );

    if (!cluster) {
      return false;
    }

    const expanded =
      cluster.getAttribute(
        ATTRIBUTES.clusterState
      ) === "expanded";

    if (!expanded) {
      closeAllClusters(
        clusterId
      );

      if (
        state.enhancementAvailable
      ) {
        enterEnhancedPresentation(
          "cluster-activation"
        );
      }
    }

    const changed =
      setClusterExpanded(
        clusterId,
        !expanded
      );

    if (
      changed &&
      expanded &&
      trigger
    ) {
      focusElement(
        trigger
      );
    }

    return changed;
  }

  /* =======================================================
     LOCAL FRONTS
     ======================================================= */

  function setFrontVisibility(
    frontId,
    active
  ) {
    const front =
      state.fronts.get(
        frontId
      );

    if (!front) {
      return false;
    }

    front.hidden =
      !active;

    front.toggleAttribute(
      ATTRIBUTES.controllerManagedHidden,
      !active
    );

    front.setAttribute(
      ATTRIBUTES.frontState,
      active
        ? "active"
        : "inactive"
    );

    front.setAttribute(
      "aria-hidden",
      active
        ? "false"
        : "true"
    );

    if ("inert" in front) {
      front.inert =
        !active;
    }

    if (active) {
      front.removeAttribute(
        "inert"
      );
    }

    return true;
  }

  function hideAllFronts(
    exceptFrontId = ""
  ) {
    if (
      !state.enhancementAvailable ||
      !state.enhancedPresentationActive
    ) {
      return false;
    }

    for (
      const frontId
      of state.fronts.keys()
    ) {
      if (
        frontId !==
        exceptFrontId
      ) {
        setFrontVisibility(
          frontId,
          false
        );
      }
    }

    return true;
  }

  function requestInformationTab(
    tabId
  ) {
    const normalizedTabId =
      normalize(
        tabId
      );

    if (!normalizedTabId) {
      return false;
    }

    state.activeInformationTab =
      normalizedTabId;

    setRootAttribute(
      ATTRIBUTES.activeInformationTab,
      normalizedTabId
    );

    const gaugeApi =
      window.SHOWROOM_GAUGES;

    if (
      gaugeApi &&
      typeof gaugeApi
        .selectInformationTab ===
        "function"
    ) {
      gaugeApi.selectInformationTab(
        normalizedTabId,
        {
          focus:
            false,

          announce:
            true
        }
      );

      return true;
    }

    const tab =
      toArray(
        document.querySelectorAll(
          "[data-showroom-information-tab]"
        )
      ).find(
        candidate =>
          candidate.getAttribute(
            "data-information-tab-id"
          ) === normalizedTabId
      ) ||
      null;

    if (tab) {
      tab.click();

      return true;
    }

    return false;
  }

  function openFront(
    frontId,
    options = {}
  ) {
    const normalizedFrontId =
      normalize(
        frontId
      );

    const front =
      state.fronts.get(
        normalizedFrontId
      );

    if (!front) {
      publishReceipt(
        "front-not-found",
        {
          frontId:
            normalizedFrontId
        }
      );

      return false;
    }

    closeOtherDialogs();
    closeAllClusters();

    if (
      state.enhancementAvailable &&
      state.crystalsReady
    ) {
      enterEnhancedPresentation(
        "front-activation"
      );

      hideAllFronts(
        normalizedFrontId
      );

      setFrontVisibility(
        normalizedFrontId,
        true
      );
    } else {
      makeFrontBaselineVisible(
        front
      );

      state.enhancedPresentationActive =
        false;
    }

    state.activeFrontId =
      normalizedFrontId;

    state.activeGaugeSet =
      normalize(
        front.getAttribute(
          "data-showroom-gauge-set"
        )
      );

    setRootAttribute(
      ATTRIBUTES.activeFront,
      normalizedFrontId
    );

    setRootAttribute(
      ATTRIBUTES.activeGaugeSet,
      state.activeGaugeSet
    );

    if (
      options.informationTab
    ) {
      requestInformationTab(
        options.informationTab
      );
    }

    setPageState(
      state.enhancedPresentationActive
        ? "front"
        : PRESENTATION.BASELINE,

      state.enhancedPresentationActive
        ? "front"
        : PRESENTATION.BASELINE,

      currentEnhancementState()
    );

    if (
      options.scroll !== false
    ) {
      window.requestAnimationFrame(
        () => {
          scrollToElement(
            front,
            "start"
          );
        }
      );
    }

    if (
      options.focus !== false
    ) {
      const heading =
        front.querySelector(
          "h1,h2,h3"
        );

      if (heading) {
        const hadTabindex =
          heading.hasAttribute(
            "tabindex"
          );

        if (!hadTabindex) {
          heading.setAttribute(
            "tabindex",
            "-1"
          );
        }

        window.requestAnimationFrame(
          () => {
            focusElement(
              heading
            );

            if (!hadTabindex) {
              heading.addEventListener(
                "blur",
                () => {
                  heading.removeAttribute(
                    "tabindex"
                  );
                },
                {
                  once:
                    true
                }
              );
            }
          }
        );
      }
    }

    dispatchStateEvent(
      EVENTS.frontChanged,
      {
        frontId:
          normalizedFrontId,

        active:
          true,

        enhanced:
          state.enhancedPresentationActive,

        informationTab:
          options.informationTab ||
          null
      }
    );

    publishReceipt(
      "front-opened",
      {
        frontId:
          normalizedFrontId,

        enhanced:
          state.enhancedPresentationActive,

        informationTab:
          options.informationTab ||
          null
      }
    );

    return true;
  }

  function returnToOrbit(
    options = {}
  ) {
    const previousFrontId =
      state.activeFrontId;

    closeAllClusters();
    closeOtherDialogs();

    if (
      !state.enhancementAvailable ||
      !state.enhancedPresentationActive
    ) {
      restoreBaselineFronts();
      clearPresentationSelection();

      setPageState(
        PRESENTATION.BASELINE,
        PRESENTATION.BASELINE,
        currentEnhancementState()
      );

      if (
        options.scroll !== false
      ) {
        window.requestAnimationFrame(
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
        window.requestAnimationFrame(
          () => {
            focusElement(
              state.compassControl ||
              state.orbit
            );
          }
        );
      }

      publishReceipt(
        "returned-to-orbit-baseline",
        {
          previousFrontId:
            previousFrontId ||
            null
        }
      );

      return true;
    }

    hideAllFronts();

    state.activeFrontId = "";
    state.activeGaugeSet = "";
    state.activeInformationTab = "";

    setRootAttribute(
      ATTRIBUTES.activeFront,
      ""
    );

    setRootAttribute(
      ATTRIBUTES.activeGaugeSet,
      ""
    );

    setRootAttribute(
      ATTRIBUTES.activeInformationTab,
      ""
    );

    setPageState(
      "orbit",
      "orbit",
      PRESENTATION.ACTIVE
    );

    if (
      options.scroll !== false
    ) {
      window.requestAnimationFrame(
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
      window.requestAnimationFrame(
        () => {
          focusElement(
            state.compassControl ||
            state.orbit
          );
        }
      );
    }

    dispatchStateEvent(
      EVENTS.frontChanged,
      {
        frontId:
          previousFrontId ||
          null,

        active:
          false,

        enhanced:
          true
      }
    );

    publishReceipt(
      "returned-to-orbit",
      {
        previousFrontId:
          previousFrontId ||
          null
      }
    );

    return true;
  }

  /* =======================================================
     INSTRUCTIONS DISCLOSURE
     ======================================================= */

  function syncInstructionsDisclosureState() {
    const open =
      Boolean(
        state.instructionsDisclosure &&
        state.instructionsDisclosure.open
      );

    for (
      const control
      of state.instructionsOpenControls
    ) {
      control.setAttribute(
        "aria-expanded",
        open
          ? "true"
          : "false"
      );
    }
  }

  function openInstructionsDisclosure(
    trigger = null,
    options = {}
  ) {
    if (
      !state.instructionsDisclosure ||
      state.disposed
    ) {
      return false;
    }

    state.lastInstructionsTrigger =
      trigger ||
      state.lastInstructionsTrigger;

    state.instructionsDisclosure.open =
      true;

    syncInstructionsDisclosureState();

    const summary =
      state.instructionsDisclosure
        .querySelector(
          ":scope > summary"
        );

    if (
      options.scroll !== false
    ) {
      window.requestAnimationFrame(
        () => {
          scrollToElement(
            summary ||
            state.instructionsDisclosure,
            "start"
          );
        }
      );
    }

    if (
      options.focus === true
    ) {
      window.requestAnimationFrame(
        () => {
          focusElement(
            summary
          );
        }
      );
    }

    state.counters.instructionsOpened +=
      1;

    publishReceipt(
      "instructions-disclosure-opened"
    );

    return true;
  }

  /* =======================================================
     CONSTRUCTION DIALOG
     ======================================================= */

  function openConstructionDialog(
    trigger
  ) {
    if (!state.constructionDialog) {
      return false;
    }

    closeOtherDialogs(
      state.constructionDialog
    );

    state.lastConstructionTrigger =
      trigger ||
      null;

    safelyShowModal(
      state.constructionDialog
    );

    const closeButton =
      state.constructionDialog
        .querySelector(
          SELECTORS.constructionClose
        );

    window.requestAnimationFrame(
      () => {
        focusElement(
          closeButton ||
          state.constructionDialog
        );
      }
    );

    publishReceipt(
      "construction-dialog-opened"
    );

    return true;
  }

  function closeConstructionDialog(
    options = {}
  ) {
    if (!state.constructionDialog) {
      return;
    }

    if (
      state.constructionDialog.open
    ) {
      safelyCloseDialog(
        state.constructionDialog,
        options.reason ||
        "closed"
      );
    }

    if (
      options.restoreFocus !== false
    ) {
      window.requestAnimationFrame(
        () => {
          focusElement(
            state.lastConstructionTrigger
          );
        }
      );
    }

    publishReceipt(
      "construction-dialog-closed",
      {
        reason:
          options.reason ||
          "closed"
      }
    );
  }

  /* =======================================================
     FALLBACK STAR VISIBILITY
     ======================================================= */

  function applyFallbackStarState() {
    const semanticOnly =
      state.crystalsReady &&
      state.enhancementAvailable;

    setRootAttribute(
      ATTRIBUTES.crystalsReady,
      semanticOnly
        ? "true"
        : "false"
    );

    const layers =
      toArray(
        document.querySelectorAll(
          SELECTORS.fallbackStarLayer
        )
      );

    const stars =
      toArray(
        document.querySelectorAll(
          SELECTORS.fallbackStar
        )
      );

    for (
      const layer
      of layers
    ) {
      layer.setAttribute(
        ATTRIBUTES.fallbackVisibility,
        semanticOnly
          ? "semantic-only"
          : "visible"
      );
    }

    for (
      const star
      of stars
    ) {
      star.setAttribute(
        ATTRIBUTES.fallbackRendering,
        semanticOnly
          ? "hidden"
          : "visible"
      );
    }

    publishReceipt(
      semanticOnly
        ? "fallback-stars-semantic-only"
        : "fallback-stars-visible"
    );
  }

  function setCrystalsReady(
    ready,
    reason = ""
  ) {
    state.crystalsReady =
      Boolean(ready);

    state.enhancementAvailable =
      state.crystalsReady;

    if (!state.crystalsReady) {
      state.enhancedPresentationActive =
        false;
    }

    applyFallbackStarState();

    if (state.crystalsReady) {
      restoreBaselineFronts();

      setPageState(
        PRESENTATION.BASELINE,
        PRESENTATION.BASELINE,
        PRESENTATION.AVAILABLE
      );
    } else {
      restoreBaselinePresentation(
        reason ||
        "crystals-unavailable",
        {
          failed:
            reason.includes(
              "failure"
            ) ||
            reason.includes(
              "disposed"
            )
        }
      );
    }

    publishReceipt(
      "crystals-readiness-changed",
      {
        crystalsReady:
          state.crystalsReady,

        enhancementAvailable:
          state.enhancementAvailable,

        reason:
          reason ||
          null
      }
    );
  }

  /* =======================================================
     HELD AND REDUCED MOTION
     ======================================================= */

  function setHeld(
    held,
    reason = ""
  ) {
    state.held =
      Boolean(held);

    setRootAttribute(
      ATTRIBUTES.held,
      state.held
        ? "true"
        : "false"
    );

    publishReceipt(
      "held-state-changed",
      {
        held:
          state.held,

        reason:
          reason ||
          null
      }
    );
  }

  function applyReducedMotion() {
    state.reducedMotion =
      Boolean(
        state.reducedMotionQuery &&
        state.reducedMotionQuery.matches
      );

    setRootAttribute(
      ATTRIBUTES.reducedMotion,
      state.reducedMotion
        ? "true"
        : "false"
    );

    publishReceipt(
      "reduced-motion-changed"
    );
  }

  function initializeReducedMotion() {
    state.reducedMotionQuery =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    state.reducedMotion =
      state.reducedMotionQuery.matches;

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
      state.reducedMotionQuery
        .addListener(
          applyReducedMotion
        );

      state.listeners.push(
        () => {
          state.reducedMotionQuery
            .removeListener(
              applyReducedMotion
            );
        }
      );
    }

    applyReducedMotion();
  }

  /* =======================================================
     OBJECT ACTIVATION
     ======================================================= */

  function activateObject(
    object,
    options = {}
  ) {
    if (
      !isOrbitOwnedObject(object) ||
      state.disposed ||
      state.held
    ) {
      publishReceipt(
        "object-activation-rejected",
        {
          reason:
            !isOrbitOwnedObject(object)
              ? "object-outside-orbit-field"
              : state.held
                ? "showroom-held"
                : "controller-disposed"
        }
      );

      return false;
    }

    const objectId =
      normalize(
        object.getAttribute(
          "data-showroom-object-id"
        )
      );

    const behavior =
      normalize(
        object.getAttribute(
          "data-showroom-object-behavior"
        )
      );

    if (
      options.dedupe !== false &&
      isDuplicateActivation(
        `object:${
          objectId ||
          behavior
        }`
      )
    ) {
      return false;
    }

    switch (behavior) {
      case "route":
        return openRouteDialog(
          object
        );

      case "cluster":
        return toggleCluster(
          normalize(
            object.getAttribute(
              "data-showroom-cluster-id"
            )
          ),
          object
        );

      case "gauge":
        return openFront(
          normalize(
            object.getAttribute(
              "data-showroom-front-id"
            )
          )
        );

      case "information":
        return openFront(
          normalize(
            object.getAttribute(
              "data-showroom-front-id"
            )
          ),
          {
            informationTab:
              normalize(
                object.getAttribute(
                  "data-showroom-information-tab"
                )
              )
          }
        );

      case "compass-return":
        return openCompassDialog(
          object
        );

      default:
        publishReceipt(
          "unknown-object-behavior",
          {
            objectId:
              objectId ||
              null,

            behavior:
              behavior ||
              null
          }
        );

        return false;
    }
  }

  function rejectSemanticActivation(
    reason,
    detail = {},
    object = null
  ) {
    state.counters
      .rejectedSemanticActivations +=
      1;

    publishReceipt(
      "semantic-activation-rejected",
      {
        reason,

        objectId:
          object
            ? object.getAttribute(
                "data-showroom-object-id"
              )
            : normalize(
                detail.objectId
              ) ||
              null
      }
    );
  }

  function handleSemanticActivationEvent(
    event
  ) {
    const detail =
      event &&
      event.detail
        ? event.detail
        : {};

    if (
      detail.target ===
        "compass" ||
      detail.kind ===
        "compass"
    ) {
      const validation =
        validateCompassEvent(
          detail
        );

      if (!validation.valid) {
        state.counters
          .rejectedCompassActivations +=
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

      state.counters
        .acceptedCompassActivations +=
        1;

      openCompassDialog(
        state.compassControl
      );

      return;
    }

    let object = null;

    if (
      detail.element instanceof
      Element
    ) {
      object =
        resolveSemanticObject(
          detail.element
        );
    }

    if (
      !object &&
      detail.objectId
    ) {
      object =
        findObjectById(
          normalize(
            detail.objectId
          )
        );
    }

    if (!object) {
      rejectSemanticActivation(
        "semantic-object-not-found",
        detail
      );

      return;
    }

    const validation =
      validateSemanticEvent(
        detail,
        object
      );

    if (!validation.valid) {
      rejectSemanticActivation(
        validation.reason,
        detail,
        object
      );

      return;
    }

    state.counters
      .acceptedSemanticActivations +=
      1;

    activateObject(
      object
    );
  }

  function handleCompassActivationEvent(
    event
  ) {
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
      state.counters
        .rejectedCompassActivations +=
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

    state.counters
      .acceptedCompassActivations +=
      1;

    openCompassDialog(
      state.compassControl
    );
  }

  function handleObjectClick(
    event
  ) {
    const object =
      resolveSemanticObject(
        event.currentTarget
      );

    if (!isOrbitOwnedObject(object)) {
      publishReceipt(
        "direct-object-click-rejected",
        {
          reason:
            "object-outside-orbit-field"
        }
      );

      return;
    }

    /*
      Keyboard-generated clicks commonly report detail === 0 and
      coordinates of 0,0. They remain valid because the focused semantic
      object itself is physically owned by the orbit field.

      Pointer clicks must either occur inside the orbit field or be the
      synthetic click following the validated pointer event, which the
      interactions module normally suppresses before this listener.
    */

    if (
      event.detail !== 0 &&
      (
        !pointInsideElement(
          state.orbitField,
          event.clientX,
          event.clientY
        ) ||
        !pointInsideElement(
          object,
          event.clientX,
          event.clientY
        )
      )
    ) {
      publishReceipt(
        "direct-object-click-rejected",
        {
          reason:
            "pointer-click-outside-object-or-orbit",

          objectId:
            object.getAttribute(
              "data-showroom-object-id"
            )
        }
      );

      return;
    }

    state.counters.directObjectClicks +=
      1;

    activateObject(
      object
    );
  }

  /* =======================================================
     DIALOG EVENTS
     ======================================================= */

  function initializeDialogEvents() {
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
          setCompassDialogState(
            false
          );
        }
      );
    }

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
          setRouteDialogState(
            false
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
    }
  }

  /* =======================================================
     DOM DISCOVERY AND VALIDATION
     ======================================================= */

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

    state.orbitField =
      document.querySelector(
        SELECTORS.orbitField
      );

    state.compassControl =
      document.querySelector(
        SELECTORS.compassControl
      );

    state.compassDialog =
      document.querySelector(
        SELECTORS.compassDialog
      );

    state.compassReturn =
      document.querySelector(
        SELECTORS.compassReturn
      );

    state.routeDialog =
      document.querySelector(
        SELECTORS.routeDialog
      );

    state.routeTitle =
      document.querySelector(
        SELECTORS.routeDialogTitle
      );

    state.routeDescription =
      document.querySelector(
        SELECTORS.routeDialogDescription
      );

    state.routeContinue =
      document.querySelector(
        SELECTORS.routeContinue
      );

    state.constructionDialog =
      document.querySelector(
        SELECTORS.constructionDialog
      );

    state.instructionsDisclosure =
      document.querySelector(
        SELECTORS.instructionsDisclosure
      );

    state.instructionsOpenControls =
      toArray(
        document.querySelectorAll(
          SELECTORS.instructionsOpen
        )
      );

    state.objects =
      state.orbitField
        ? toArray(
            state.orbitField
              .querySelectorAll(
                SELECTORS.object
              )
          )
        : [];

    state.clusters.clear();
    state.fronts.clear();

    if (state.orbitField) {
      for (
        const cluster
        of state.orbitField
          .querySelectorAll(
            SELECTORS.cluster
          )
      ) {
        const clusterId =
          normalize(
            cluster.getAttribute(
              "data-showroom-cluster-id"
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

    if (!state.compassControl) {
      issues.push(
        "Missing [data-showroom-compass-control]."
      );
    }

    if (!state.compassDialog) {
      issues.push(
        "Missing [data-showroom-compass-dialog]."
      );
    }

    if (
      state.compassControl &&
      !isOrbitOwnedElement(
        state.compassControl
      )
    ) {
      issues.push(
        "Compass control is not contained by the orbit field."
      );
    }

    if (
      state.compassControl &&
      state.compassControl.getAttribute(
        "aria-controls"
      ) !==
        "showroom-compass-dialog"
    ) {
      issues.push(
        "Compass control does not target showroom-compass-dialog."
      );
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
        "Compass return link does not target /index.html."
      );
    }

    for (
      const object
      of state.objects
    ) {
      const objectId =
        normalize(
          object.getAttribute(
            "data-showroom-object-id"
          )
        ) ||
        "unknown";

      const behavior =
        normalize(
          object.getAttribute(
            "data-showroom-object-behavior"
          )
        );

      if (!behavior) {
        issues.push(
          `Object "${objectId}" has no behavior.`
        );
      }

      if (!isOrbitOwnedObject(object)) {
        issues.push(
          `Object "${objectId}" is outside the orbit field.`
        );
      }
    }

    if (
      state.instructionsOpenControls.length &&
      !state.instructionsDisclosure
    ) {
      issues.push(
        "Instructions-opening controls exist without an instructions disclosure."
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

  /* =======================================================
     LISTENER INSTALLATION
     ======================================================= */

  function initializeObjectListeners() {
    for (
      const object
      of state.objects
    ) {
      addListener(
        object,
        "click",
        handleObjectClick
      );
    }

    if (state.compassControl) {
      addListener(
        state.compassControl,
        "click",
        event => {
          if (
            event.detail !== 0 &&
            (
              !pointInsideElement(
                state.orbitField,
                event.clientX,
                event.clientY
              ) ||
              !pointInsideElement(
                state.compassControl,
                event.clientX,
                event.clientY
              )
            )
          ) {
            publishReceipt(
              "direct-compass-click-rejected",
              {
                reason:
                  "pointer-click-outside-compass-or-orbit"
              }
            );

            return;
          }

          openCompassDialog(
            state.compassControl
          );
        }
      );
    }
  }

  function initializeCompassActions() {
    for (
      const button
      of document.querySelectorAll(
        SELECTORS.compassClose
      )
    ) {
      addListener(
        button,
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
      const button
      of document.querySelectorAll(
        SELECTORS.compassStay
      )
    ) {
      addListener(
        button,
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

  function initializeRouteActions() {
    for (
      const button
      of document.querySelectorAll(
        SELECTORS.routeClose
      )
    ) {
      addListener(
        button,
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
      const button
      of document.querySelectorAll(
        SELECTORS.routeStay
      )
    ) {
      addListener(
        button,
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
        () => {
          publishReceipt(
            "route-navigation-requested",
            {
              routeId:
                state.pendingRoute
                  ? state.pendingRoute.id
                  : null,

              route:
                state.pendingRoute
                  ? state.pendingRoute.route
                  : state.routeContinue.href
            }
          );
        }
      );
    }
  }

  function initializeReturnToOrbitActions() {
    for (
      const control
      of document.querySelectorAll(
        SELECTORS.returnToOrbit
      )
    ) {
      addListener(
        control,
        "click",
        event => {
          event.preventDefault();

          returnToOrbit();
        }
      );
    }
  }

  function initializeInstructionsActions() {
    for (
      const control
      of state.instructionsOpenControls
    ) {
      addListener(
        control,
        "click",
        event => {
          event.preventDefault();

          openInstructionsDisclosure(
            control,
            {
              scroll:
                true,

              focus:
                false
            }
          );
        }
      );
    }

    if (state.instructionsDisclosure) {
      addListener(
        state.instructionsDisclosure,
        "toggle",
        syncInstructionsDisclosureState
      );
    }

    syncInstructionsDisclosureState();
  }

  function initializeConstructionActions() {
    for (
      const button
      of document.querySelectorAll(
        SELECTORS.constructionOpen
      )
    ) {
      addListener(
        button,
        "click",
        () => {
          openConstructionDialog(
            button
          );
        }
      );
    }

    for (
      const button
      of document.querySelectorAll(
        SELECTORS.constructionClose
      )
    ) {
      addListener(
        button,
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

  function handleEnhancementFailure(
    reason
  ) {
    state.crystalsReady =
      false;

    state.enhancementAvailable =
      false;

    state.enhancedPresentationActive =
      false;

    applyFallbackStarState();

    restoreBaselinePresentation(
      reason,
      {
        failed:
          true
      }
    );

    publishReceipt(
      "enhancement-failure-restored-baseline",
      {
        reason
      }
    );
  }

  function initializeRuntimeEvents() {
    addListener(
      window,
      EVENTS.semanticActivate,
      handleSemanticActivationEvent
    );

    addListener(
      window,
      EVENTS.objectActivate,
      handleSemanticActivationEvent
    );

    addListener(
      window,
      EVENTS.compassActivate,
      handleCompassActivationEvent
    );

    addListener(
      window,
      EVENTS.crystalsReady,
      () => {
        setCrystalsReady(
          true,
          "ready-event"
        );
      }
    );

    addListener(
      window,
      EVENTS.crystalsFailed,
      () => {
        handleEnhancementFailure(
          "crystals-failure-event"
        );
      }
    );

    addListener(
      window,
      EVENTS.crystalsDisposed,
      () => {
        handleEnhancementFailure(
          "crystals-disposed-event"
        );
      }
    );

    addListener(
      window,
      EVENTS.compositorFailed,
      () => {
        handleEnhancementFailure(
          "compositor-failure-event"
        );
      }
    );

    addListener(
      window,
      EVENTS.compositorDisposed,
      () => {
        handleEnhancementFailure(
          "compositor-disposed-event"
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
      "showroom:gauges-ready",
      () => {
        if (
          state.activeInformationTab
        ) {
          requestInformationTab(
            state.activeInformationTab
          );
        }
      }
    );
  }

  function initializeInitialPresentation() {
    captureOriginalFrontStates();
    restoreBaselineFronts();
    closeAllClusters();
    clearPresentationSelection();

    setCompassDialogState(
      false
    );

    setRouteDialogState(
      false
    );

    state.crystalsReady =
      false;

    state.enhancementAvailable =
      false;

    state.enhancedPresentationActive =
      false;

    applyFallbackStarState();

    setPageState(
      PRESENTATION.BASELINE,
      PRESENTATION.BASELINE,
      PRESENTATION.PENDING
    );
  }

  function exposeApi() {
    const api =
      Object.freeze({
        contract:
          CONTRACT,

        getState() {
          return createStateSnapshot({
            clusterIds:
              toArray(
                state.clusters.keys()
              ),

            frontIds:
              toArray(
                state.fronts.keys()
              )
          });
        },

        openCompassDialog,

        closeCompassDialog,

        openRouteDialogByObjectId(
          objectId
        ) {
          return openRouteDialog(
            findObjectById(
              normalize(
                objectId
              )
            )
          );
        },

        closeRouteDialog,

        toggleCluster,

        openFront,

        returnToOrbit,

        openInstructions(
          options = {}
        ) {
          return openInstructionsDisclosure(
            null,
            options
          );
        },

        restoreBaseline(
          reason =
            "api-request"
        ) {
          restoreBaselinePresentation(
            reason
          );

          return true;
        },

        activateObjectById(
          objectId,
          options = {}
        ) {
          return activateObject(
            findObjectById(
              normalize(
                objectId
              )
            ),
            options
          );
        },

        setCrystalsReady,

        setHeld,

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
  }

  /* =======================================================
     INITIALIZATION
     ======================================================= */

  function initialize() {
    if (
      state.initialized ||
      state.disposed
    ) {
      return;
    }

    try {
      discoverDom();

      const issues =
        validateDom();

      if (!state.root) {
        throw new Error(
          "Showroom controller cannot initialize without a root element."
        );
      }

      initializeReducedMotion();
      initializeInitialPresentation();

      initializeObjectListeners();
      initializeCompassActions();
      initializeRouteActions();
      initializeReturnToOrbitActions();
      initializeInstructionsActions();
      initializeConstructionActions();
      initializeDialogEvents();
      initializeRuntimeEvents();

      exposeApi();

      state.initialized =
        true;

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

      setRootAttribute(
        ATTRIBUTES.enhancementState,
        PRESENTATION.PENDING
      );

      publishReceipt(
        "ready",
        {
          validationIssues:
            issues,

          baselinePreserved:
            true,

          orbitScopedObjectCount:
            state.objects.length,

          semanticActivationGuard:
            true,

          compassActivationGuard:
            true
        }
      );

      dispatchStateEvent(
        EVENTS.ready,
        {
          validationIssues:
            issues,

          baselinePreserved:
            true
        }
      );
    } catch (error) {
      if (state.root) {
        restoreBaselineFronts();

        setRootAttribute(
          ATTRIBUTES.controllerReady,
          "false"
        );

        setRootAttribute(
          ATTRIBUTES.controllerState,
          "failed"
        );

        setRootAttribute(
          ATTRIBUTES.enhancementState,
          PRESENTATION.FAILED
        );
      }

      publishReceipt(
        "fatal-error",
        {
          error:
            {
              name:
                error instanceof Error
                  ? error.name
                  : "Error",

              message:
                error instanceof Error
                  ? error.message
                  : String(error)
            },

          baselinePreserved:
            true
        }
      );
    }
  }

  /* =======================================================
     DISPOSAL
     ======================================================= */

  function dispose() {
    if (state.disposed) {
      return;
    }

    state.enhancementAvailable =
      false;

    state.crystalsReady =
      false;

    state.enhancedPresentationActive =
      false;

    restoreBaselineFronts();
    closeAllClusters();
    clearPresentationSelection();
    applyFallbackStarState();

    setPageState(
      PRESENTATION.BASELINE,
      PRESENTATION.BASELINE,
      PRESENTATION.FAILED
    );

    state.disposed =
      true;

    for (
      const removeListener
      of state.listeners.splice(0)
    ) {
      try {
        removeListener();
      } catch {
        /* Best-effort disposal. */
      }
    }

    for (
      const observer
      of state.observers.splice(0)
    ) {
      try {
        observer.disconnect();
      } catch {
        /* Best-effort disposal. */
      }
    }

    if (
      state.compassDialog &&
      state.compassDialog.open
    ) {
      safelyCloseDialog(
        state.compassDialog,
        "disposed"
      );
    }

    if (
      state.routeDialog &&
      state.routeDialog.open
    ) {
      safelyCloseDialog(
        state.routeDialog,
        "disposed"
      );
    }

    if (
      state.constructionDialog &&
      state.constructionDialog.open
    ) {
      safelyCloseDialog(
        state.constructionDialog,
        "disposed"
      );
    }

    setRootAttribute(
      ATTRIBUTES.controllerReady,
      "false"
    );

    setRootAttribute(
      ATTRIBUTES.controllerState,
      "disposed"
    );

    publishReceipt(
      "disposed",
      {
        baselineRestored:
          true
      }
    );

    try {
      delete window.SHOWROOM_CONTROLLER;
    } catch {
      /* Noncritical cleanup. */
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

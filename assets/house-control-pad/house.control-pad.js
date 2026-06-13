// /assets/house-control-pad/house.control-pad.js
// HOUSE_CONTROL_PAD_SELF_CONTAINED_ESTATE_MAP_RUNTIME_TNT_v1
// Full-file replacement.
//
// Complete authority for:
// - canonical estate map
// - room and guide definitions
// - map rendering
// - shared overlay construction
// - page-door binding
// - opening and closing
// - room selection
// - canonical navigation
// - focus custody
// - background custody
// - scroll custody
// - runtime status
// - cleanup
//
(function houseControlPadSelfContainedRuntime(global, document) {
  "use strict";

  if (!global || !document) {
    return;
  }

  const CONTRACT =
    "HOUSE_CONTROL_PAD_SELF_CONTAINED_ESTATE_MAP_RUNTIME_TNT_v1";

  const PUBLIC_GLOBAL = "HOUSE_CONTROL_PAD";
  const STATUS_GLOBAL = "__HOUSE_CONTROL_PAD_STATUS__";
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
    avatar: "[data-house-avatar]"
  });

  const EVENTS = Object.freeze({
    ready: "house:control-pad-ready",
    openRequest: "house:control-pad-open-request",
    open: "house:control-pad-open",
    closeRequest: "house:control-pad-close-request",
    close: "house:control-pad-close",
    select: "house:control-pad-select",
    routeRequest: "house:control-pad-route-request",
    routeCommit: "house:control-pad-route-commit",
    state: "house:control-pad-state",
    error: "house:control-pad-error",
    destroy: "house:control-pad-destroy"
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
    failed: "failed",
    destroyed: "destroyed"
  });

  const MAP = deepFreeze({
    contract: CONTRACT,

    estate: {
      id: "diamond-gate-heart-estate",
      eyebrow: "Diamond Gate Bridge",
      label: "The House Map",
      description:
        "Choose a chamber, world, guide, or diagnostic path from the Heart Estate."
    },

    viewBox: {
      minX: 0,
      minY: 0,
      width: 1000,
      height: 720
    },

    heartPath:
      "M500 668 C438 618 224 493 143 348 C75 226 119 92 253 68 C346 51 428 101 500 184 C572 101 654 51 747 68 C881 92 925 226 857 348 C776 493 562 618 500 668 Z",

    rooms: [
      {
        id: "website-grand-hall",
        label: "Website Grand Hall",
        shortLabel: "Website",
        description:
          "Enter the traditional Diamond Gate Bridge website and its primary public pages.",
        route: "/home/",
        marker: {
          x: 500,
          y: 120
        },
        polygon: [
          [388, 82],
          [500, 54],
          [612, 82],
          [582, 194],
          [500, 226],
          [418, 194]
        ]
      },

      {
        id: "guide-library",
        label: "Guide Library",
        shortLabel: "Guide",
        description:
          "Open the site guide and instructions for navigating the House.",
        route: "/site-guide/",
        marker: {
          x: 282,
          y: 190
        },
        polygon: [
          [166, 112],
          [300, 78],
          [416, 144],
          [382, 258],
          [250, 282],
          [150, 220]
        ]
      },

      {
        id: "jeeves-salon",
        label: "Jeeves Salon",
        shortLabel: "Jeeves",
        description:
          "Talk directly to Jeeves, the House guide and estate interpreter.",
        route: "/showroom/globe/hearth/jeeves/",
        marker: {
          x: 718,
          y: 190
        },
        polygon: [
          [584, 144],
          [700, 78],
          [834, 112],
          [850, 220],
          [750, 282],
          [618, 258]
        ]
      },

      {
        id: "atlas-observatory",
        label: "Atlas Observatory",
        shortLabel: "Atlas",
        description:
          "Enter the planetary atlas and choose among the available worlds.",
        route: "/showroom/globe/",
        marker: {
          x: 208,
          y: 360
        },
        polygon: [
          [112, 252],
          [250, 282],
          [350, 360],
          [286, 458],
          [150, 438],
          [88, 350]
        ]
      },

      {
        id: "mirrorland-gallery",
        label: "Mirrorland Gallery",
        shortLabel: "Mirrorland",
        description:
          "Enter Mirrorland and move into the interactive world layer.",
        route: "/showroom/",
        marker: {
          x: 792,
          y: 360
        },
        polygon: [
          [650, 360],
          [750, 282],
          [888, 252],
          [912, 350],
          [850, 438],
          [714, 458]
        ]
      },

      {
        id: "audralia-conservatory",
        label: "Audralia Conservatory",
        shortLabel: "Audralia",
        description:
          "Enter Audralia, its planetary conservatory, and its living world.",
        route: "/showroom/globe/audralia/",
        marker: {
          x: 318,
          y: 515
        },
        polygon: [
          [150, 438],
          [286, 458],
          [430, 520],
          [398, 618],
          [282, 592],
          [194, 526]
        ]
      },

      {
        id: "coherence-diagnostic-chamber",
        label: "Coherence Diagnostic Chamber",
        shortLabel: "Diagnostic",
        description:
          "Take the coherence diagnostic and begin the structured assessment path.",
        route: "/coherence-diagnostic/",
        marker: {
          x: 682,
          y: 515
        },
        polygon: [
          [570, 520],
          [714, 458],
          [850, 438],
          [806, 526],
          [718, 592],
          [602, 618]
        ]
      },

      {
        id: "hearth-chamber",
        label: "Hearth Chamber",
        shortLabel: "Hearth",
        description:
          "Enter Hearth, the central planetary and House-world chamber.",
        route: "/showroom/globe/hearth/",
        marker: {
          x: 500,
          y: 574
        },
        polygon: [
          [430, 520],
          [500, 476],
          [570, 520],
          [602, 618],
          [500, 674],
          [398, 618]
        ]
      }
    ],

    avatars: [
      {
        id: "house-guide",
        label: "House Guide",
        shortLabel: "Guide",
        role: "Estate Interpreter",
        description:
          "The central guide can explain the House and direct you to its rooms.",
        route: "/showroom/globe/hearth/jeeves/",
        marker: {
          x: 500,
          y: 356
        }
      }
    ],

    corridors: [
      {
        id: "corridor-guide-library",
        from: {
          type: "avatar",
          id: "house-guide"
        },
        to: {
          type: "room",
          id: "guide-library"
        }
      },

      {
        id: "corridor-website",
        from: {
          type: "avatar",
          id: "house-guide"
        },
        to: {
          type: "room",
          id: "website-grand-hall"
        }
      },

      {
        id: "corridor-jeeves",
        from: {
          type: "avatar",
          id: "house-guide"
        },
        to: {
          type: "room",
          id: "jeeves-salon"
        }
      },

      {
        id: "corridor-atlas",
        from: {
          type: "avatar",
          id: "house-guide"
        },
        to: {
          type: "room",
          id: "atlas-observatory"
        }
      },

      {
        id: "corridor-mirrorland",
        from: {
          type: "avatar",
          id: "house-guide"
        },
        to: {
          type: "room",
          id: "mirrorland-gallery"
        }
      },

      {
        id: "corridor-audralia",
        from: {
          type: "avatar",
          id: "house-guide"
        },
        to: {
          type: "room",
          id: "audralia-conservatory"
        }
      },

      {
        id: "corridor-diagnostic",
        from: {
          type: "avatar",
          id: "house-guide"
        },
        to: {
          type: "room",
          id: "coherence-diagnostic-chamber"
        }
      },

      {
        id: "corridor-hearth",
        from: {
          type: "avatar",
          id: "house-guide"
        },
        to: {
          type: "room",
          id: "hearth-chamber"
        }
      }
    ]
  });

  const existingController = global[PUBLIC_GLOBAL];

  if (
    existingController &&
    typeof existingController.destroy === "function"
  ) {
    try {
      existingController.destroy("full-file-renewal");
    } catch (_error) {
      removeExistingRoot();
    }
  } else {
    removeExistingRoot();
  }

  const state = {
    lifecycleState: STATES.uninitialized,
    previousState: "",
    initialized: false,
    ready: false,
    mounted: false,
    open: false,
    destroyed: false,
    root: null,
    dialog: null,
    backdrop: null,
    closeButton: null,
    statusNode: null,
    estateNode: null,
    svg: null,
    markersLayer: null,
    detailsPanel: null,
    activeDoor: null,
    returnFocusTarget: null,
    selectedType: "",
    selectedId: "",
    activeContext: "",
    listeners: [],
    backgroundRecords: [],
    closeTimer: null,
    openCount: 0,
    closeCount: 0,
    routeCount: 0,
    initializedAt: "",
    openedAt: "",
    closedAt: "",
    destroyedAt: "",
    lastUpdatedAt: nowIso()
  };

  const controller = Object.freeze({
    contract: CONTRACT,
    init,
    open,
    close,
    toggle,
    rebind,
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
  autoBoot();

  function autoBoot() {
    if (document.readyState === "loading") {
      document.addEventListener(
        "DOMContentLoaded",
        () => {
          init();
        },
        {
          once: true
        }
      );

      return;
    }

    init();
  }

  function init() {
    if (state.destroyed) {
      return makeResult(
        false,
        STATES.destroyed,
        "The House Map runtime has been destroyed."
      );
    }

    if (state.initialized && state.root && state.root.isConnected) {
      bindRuntime();

      return makeResult(
        true,
        state.lifecycleState,
        "The House Map is already initialized."
      );
    }

    transitionTo(STATES.initializing);

    try {
      buildRoot();
      renderMap();
      bindRuntime();

      state.initialized = true;
      state.ready = true;
      state.mounted = Boolean(
        state.root &&
        state.root.isConnected
      );
      state.initializedAt =
        state.initializedAt ||
        nowIso();

      transitionTo(STATES.ready);
      updateStatus("House Map ready.");

      dispatch(EVENTS.ready, {
        reason: "initialization-complete"
      });

      publishStatus();

      return makeResult(
        true,
        STATES.ready,
        "The House Map initialized successfully."
      );
    } catch (error) {
      state.ready = false;

      transitionTo(STATES.failed);

      updateStatus(
        "The House Map could not initialize."
      );

      dispatch(EVENTS.error, {
        reason: "initialization-failed",
        error: normalizeError(error)
      });

      publishStatus();

      return makeResult(
        false,
        STATES.failed,
        "The House Map could not initialize.",
        {
          error: normalizeError(error)
        }
      );
    }
  }

  function open(request) {
    if (state.destroyed) {
      return makeResult(
        false,
        STATES.destroyed,
        "The House Map runtime has been destroyed."
      );
    }

    if (!state.initialized) {
      const initialization = init();

      if (!initialization.ok) {
        return initialization;
      }
    }

    if (!state.root || !state.dialog) {
      return makeResult(
        false,
        STATES.failed,
        "The House Map overlay is unavailable."
      );
    }

    const normalizedRequest =
      normalizeOpenRequest(request);

    if (state.open) {
      state.activeDoor =
        normalizedRequest.door ||
        state.activeDoor;

      state.activeContext =
        normalizedRequest.context ||
        state.activeContext;

      return makeResult(
        true,
        STATES.open,
        "The House Map is already open."
      );
    }

    const openRequestEvent = dispatch(
      EVENTS.openRequest,
      {
        reason: "open-request",
        context: normalizedRequest.context
      },
      {
        cancelable: true
      }
    );

    if (openRequestEvent.defaultPrevented) {
      return makeResult(
        false,
        state.lifecycleState,
        "The House Map open request was canceled."
      );
    }

    state.activeDoor =
      normalizedRequest.door;

    state.activeContext =
      normalizedRequest.context;

    state.returnFocusTarget =
      resolveReturnFocusTarget(
        normalizedRequest.door
      );

    transitionTo(STATES.opening);

    try {
      clearCloseTimer();

      state.root.hidden = false;
      state.root.setAttribute(
        "aria-hidden",
        "false"
      );
      state.root.dataset.houseOpen = "true";
      state.root.dataset.houseContext =
        state.activeContext;

      state.open = true;

      applyBackgroundCustody();
      lockDocumentScroll();

      transitionTo(STATES.open);

      state.openCount += 1;
      state.openedAt = nowIso();

      updateStatus("House Map open.");
      focusInitialElement();

      dispatch(EVENTS.open, {
        reason: "open-complete",
        context: state.activeContext
      });

      publishStatus();

      return makeResult(
        true,
        STATES.open,
        "The House Map opened."
      );
    } catch (error) {
      state.open = false;

      restoreBackgroundCustody();
      unlockDocumentScroll();

      state.root.hidden = true;
      state.root.setAttribute(
        "aria-hidden",
        "true"
      );
      state.root.dataset.houseOpen = "false";

      transitionTo(STATES.ready);

      dispatch(EVENTS.error, {
        reason: "open-failed",
        error: normalizeError(error)
      });

      publishStatus();

      return makeResult(
        false,
        STATES.ready,
        "The House Map could not open.",
        {
          error: normalizeError(error)
        }
      );
    }
  }

  function close(reason) {
    if (state.destroyed) {
      return makeResult(
        false,
        STATES.destroyed,
        "The House Map runtime has been destroyed."
      );
    }

    if (!state.open) {
      return makeResult(
        true,
        state.lifecycleState,
        "The House Map is already closed."
      );
    }

    const closeReason =
      safeString(reason, 200) ||
      "close-request";

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
      return makeResult(
        false,
        STATES.open,
        "The House Map close request was canceled."
      );
    }

    transitionTo(STATES.closing);

    state.open = false;

    if (state.root) {
      state.root.dataset.houseOpen = "false";
    }

    restoreBackgroundCustody();
    unlockDocumentScroll();
    clearCloseTimer();

    state.closeTimer = global.setTimeout(
      completeClose,
      prefersReducedMotion()
        ? 0
        : 280
    );

    return makeResult(
      true,
      STATES.closing,
      "The House Map is closing."
    );

    function completeClose() {
      state.closeTimer = null;

      if (
        state.destroyed ||
        !state.root
      ) {
        return;
      }

      state.root.hidden = true;
      state.root.setAttribute(
        "aria-hidden",
        "true"
      );

      transitionTo(STATES.closed);

      state.closeCount += 1;
      state.closedAt = nowIso();

      updateStatus("House Map closed.");
      restoreFocus();

      dispatch(EVENTS.close, {
        reason: closeReason
      });

      publishStatus();
    }
  }

  function toggle(request) {
    return state.open
      ? close("toggle")
      : open(request);
  }

  function rebind() {
    if (state.destroyed) {
      return makeResult(
        false,
        STATES.destroyed,
        "The House Map runtime has been destroyed."
      );
    }

    bindRuntime();

    return makeResult(
      true,
      state.lifecycleState,
      "The House Map controls were rebound."
    );
  }

  function routeTo(request) {
    if (state.destroyed) {
      return makeResult(
        false,
        STATES.destroyed,
        "The House Map runtime has been destroyed."
      );
    }

    const normalized =
      normalizeRouteRequest(request);

    if (!normalized.ok) {
      updateStatus(normalized.reason);

      return normalized;
    }

    const routeRequestEvent = dispatch(
      EVENTS.routeRequest,
      {
        reason: "route-request",
        targetType: normalized.type,
        targetId: normalized.id,
        route: normalized.route
      },
      {
        cancelable: true
      }
    );

    if (routeRequestEvent.defaultPrevented) {
      updateStatus(
        "Navigation request canceled."
      );

      return makeResult(
        false,
        state.lifecycleState,
        "Navigation request canceled."
      );
    }

    transitionTo(STATES.routing);

    state.routeCount += 1;

    dispatch(EVENTS.routeCommit, {
      reason: "route-commit",
      targetType: normalized.type,
      targetId: normalized.id,
      route: normalized.route
    });

    publishStatus();

    try {
      global.location.assign(
        normalized.route
      );

      return makeResult(
        true,
        STATES.routing,
        "Navigation committed.",
        {
          targetId: normalized.id,
          route: normalized.route
        }
      );
    } catch (error) {
      transitionTo(
        state.open
          ? STATES.open
          : STATES.ready
      );

      dispatch(EVENTS.error, {
        reason: "navigation-failed",
        error: normalizeError(error)
      });

      publishStatus();

      return makeResult(
        false,
        state.lifecycleState,
        "Navigation could not be completed.",
        {
          error: normalizeError(error)
        }
      );
    }
  }

  function getStatus() {
    return Object.freeze(
      buildStatusSnapshot()
    );
  }

  function getSnapshot() {
    return deepFreeze({
      status: buildStatusSnapshot(),
      map: {
        estate: MAP.estate,
        viewBox: MAP.viewBox,
        roomCount: MAP.rooms.length,
        avatarCount: MAP.avatars.length,
        corridorCount:
          MAP.corridors.length
      },
      selection: {
        type: state.selectedType,
        id: state.selectedId
      }
    });
  }

  function destroy(reason) {
    if (state.destroyed) {
      return makeResult(
        true,
        STATES.destroyed,
        "The House Map runtime is already destroyed."
      );
    }

    clearCloseTimer();
    removeAllListeners();
    restoreBackgroundCustody();
    unlockDocumentScroll();

    if (
      state.root &&
      state.root.parentNode
    ) {
      state.root.parentNode.removeChild(
        state.root
      );
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
      true
    );

    dispatch(EVENTS.destroy, {
      reason:
        safeString(reason, 200) ||
        "destroy"
    });

    publishStatus();

    if (
      global[PUBLIC_GLOBAL] ===
      controller
    ) {
      try {
        delete global[PUBLIC_GLOBAL];
      } catch (_error) {
        // Runtime cleanup is already complete.
      }
    }

    return makeResult(
      true,
      STATES.destroyed,
      "The House Map runtime was destroyed."
    );
  }

  function buildRoot() {
    removeExistingRoot();

    const root = createElement(
      "div",
      {
        className: "house-control-pad",
        attributes: {
          "data-house-control-pad": "",
          "data-house-contract":
            CONTRACT,
          "data-house-state":
            STATES.closed,
          "data-house-ready":
            "false",
          "data-house-open":
            "false",
          "data-house-context":
            "",
          "data-house-selected-type":
            "",
          "data-house-selected-id":
            "",
          "aria-hidden":
            "true"
        }
      }
    );

    root.hidden = true;

    const backdrop = createElement(
      "div",
      {
        className:
          "house-control-pad__backdrop",
        attributes: {
          "data-house-backdrop": "",
          "aria-hidden": "true"
        }
      }
    );

    const dialog = createElement(
      "section",
      {
        className:
          "house-control-pad__dialog",
        attributes: {
          "data-house-dialog": "",
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby":
            "house-control-pad-title",
          "aria-describedby":
            "house-control-pad-description",
          tabindex: "-1"
        }
      }
    );

    const header = createElement(
      "header",
      {
        className:
          "house-control-pad__header"
      }
    );

    const heading = createElement(
      "div",
      {
        className:
          "house-control-pad__heading"
      }
    );

    const eyebrow = createElement(
      "p",
      {
        className:
          "house-control-pad__eyebrow",
        text:
          MAP.estate.eyebrow
      }
    );

    const title = createElement(
      "h2",
      {
        className:
          "house-control-pad__title",
        text:
          MAP.estate.label,
        attributes: {
          id:
            "house-control-pad-title"
        }
      }
    );

    const description = createElement(
      "p",
      {
        className:
          "house-control-pad__description",
        text:
          MAP.estate.description,
        attributes: {
          id:
            "house-control-pad-description"
        }
      }
    );

    const closeButton = createElement(
      "button",
      {
        className:
          "house-control-pad__close",
        text:
          "Close",
        attributes: {
          type: "button",
          "data-house-close": "",
          "aria-label":
            "Close the House Map"
        }
      }
    );

    heading.append(
      eyebrow,
      title,
      description
    );

    header.append(
      heading,
      closeButton
    );

    const statusNode = createElement(
      "div",
      {
        className:
          "house-control-pad__status",
        text:
          "House Map ready.",
        attributes: {
          "data-house-status": "",
          role: "status",
          "aria-live": "polite",
          "aria-atomic": "true"
        }
      }
    );

    const content = createElement(
      "div",
      {
        className:
          "house-control-pad__content"
      }
    );

    const estateNode = createElement(
      "div",
      {
        className:
          "house-control-pad__estate",
        attributes: {
          "data-house-estate": ""
        }
      }
    );

    const svg = createSvgElement(
      "svg",
      {
        class:
          "house-control-pad__svg",
        "data-house-svg":
          "",
        "aria-hidden":
          "true",
        focusable:
          "false",
        viewBox:
          [
            MAP.viewBox.minX,
            MAP.viewBox.minY,
            MAP.viewBox.width,
            MAP.viewBox.height
          ].join(" "),
        preserveAspectRatio:
          "xMidYMid meet"
      }
    );

    const markersLayer =
      createElement(
        "div",
        {
          className:
            "house-control-pad__markers",
          attributes: {
            "data-house-markers": ""
          }
        }
      );

    const detailsPanel =
      createElement(
        "aside",
        {
          className:
            "house-control-pad__details",
          attributes: {
            "data-house-details": "",
            "aria-live": "polite"
          }
        }
      );

    const footer = createElement(
      "footer",
      {
        className:
          "house-control-pad__footer",
        text:
          "Select a destination, then choose Enter."
      }
    );

    estateNode.append(
      svg,
      markersLayer
    );

    content.append(
      estateNode,
      detailsPanel
    );

    dialog.append(
      header,
      statusNode,
      content,
      footer
    );

    root.append(
      backdrop,
      dialog
    );

    document.body.append(root);

    state.root = root;
    state.dialog = dialog;
    state.backdrop = backdrop;
    state.closeButton = closeButton;
    state.statusNode = statusNode;
    state.estateNode = estateNode;
    state.svg = svg;
    state.markersLayer =
      markersLayer;
    state.detailsPanel =
      detailsPanel;
    state.mounted = true;
  }

  function renderMap() {
    if (
      !state.svg ||
      !state.markersLayer ||
      !state.detailsPanel
    ) {
      throw new Error(
        "The House Map DOM contract is incomplete."
      );
    }

    clearElement(state.svg);
    clearElement(state.markersLayer);
    clearElement(state.detailsPanel);

    const defs = createSvgElement(
      "defs"
    );

    const estateGradient =
      createSvgElement(
        "radialGradient",
        {
          id:
            "houseEstateGradient",
          cx:
            "50%",
          cy:
            "40%",
          r:
            "68%"
        }
      );

    estateGradient.append(
      createSvgElement(
        "stop",
        {
          offset:
            "0%",
          "stop-color":
            "#183977",
          "stop-opacity":
            ".78"
        }
      ),
      createSvgElement(
        "stop",
        {
          offset:
            "48%",
          "stop-color":
            "#07152f",
          "stop-opacity":
            ".94"
        }
      ),
      createSvgElement(
        "stop",
        {
          offset:
            "100%",
          "stop-color":
            "#020711",
          "stop-opacity":
            "1"
        }
      )
    );

    const roomGradient =
      createSvgElement(
        "linearGradient",
        {
          id:
            "houseRoomGradient",
          x1:
            "0%",
          y1:
            "0%",
          x2:
            "100%",
          y2:
            "100%"
        }
      );

    roomGradient.append(
      createSvgElement(
        "stop",
        {
          offset:
            "0%",
          "stop-color":
            "#8dd8ff",
          "stop-opacity":
            ".20"
        }
      ),
      createSvgElement(
        "stop",
        {
          offset:
            "52%",
          "stop-color":
            "#244f9a",
          "stop-opacity":
            ".18"
        }
      ),
      createSvgElement(
        "stop",
        {
          offset:
            "100%",
          "stop-color":
            "#f3c86f",
          "stop-opacity":
            ".10"
        }
      )
    );

    const glowFilter =
      createSvgElement(
        "filter",
        {
          id:
            "houseEstateGlow",
          x:
            "-30%",
          y:
            "-30%",
          width:
            "160%",
          height:
            "160%"
        }
      );

    glowFilter.append(
      createSvgElement(
        "feGaussianBlur",
        {
          stdDeviation:
            "9",
          result:
            "blur"
        }
      ),
      createSvgElement(
        "feMerge"
      )
    );

    const merge =
      glowFilter.querySelector(
        "feMerge"
      );

    merge.append(
      createSvgElement(
        "feMergeNode",
        {
          in:
            "blur"
        }
      ),
      createSvgElement(
        "feMergeNode",
        {
          in:
            "SourceGraphic"
        }
      )
    );

    defs.append(
      estateGradient,
      roomGradient,
      glowFilter
    );

    const estateBackdrop =
      createSvgElement(
        "path",
        {
          class:
            "house-control-pad__estate-shape",
          d:
            MAP.heartPath,
          fill:
            "url(#houseEstateGradient)",
          stroke:
            "rgba(243,200,111,.58)",
          "stroke-width":
            "5",
          filter:
            "url(#houseEstateGlow)"
        }
      );

    const corridorGroup =
      createSvgElement(
        "g",
        {
          class:
            "house-control-pad__corridors",
          "data-house-corridors":
            ""
        }
      );

    MAP.corridors.forEach(
      (
        corridor,
        index
      ) => {
        const start =
          findMapItem(
            corridor.from.type,
            corridor.from.id
          );

        const end =
          findMapItem(
            corridor.to.type,
            corridor.to.id
          );

        if (!start || !end) {
          return;
        }

        const line =
          createSvgElement(
            "line",
            {
              class:
                "house-control-pad__corridor",
              "data-house-corridor":
                "",
              "data-house-corridor-id":
                corridor.id,
              x1:
                String(
                  start.marker.x
                ),
              y1:
                String(
                  start.marker.y
                ),
              x2:
                String(
                  end.marker.x
                ),
              y2:
                String(
                  end.marker.y
                )
            }
          );

        line.style.setProperty(
          "--house-corridor-index",
          String(index)
        );

        corridorGroup.append(
          line
        );
      }
    );

    const roomGroup =
      createSvgElement(
        "g",
        {
          class:
            "house-control-pad__rooms",
          "data-house-rooms":
            ""
        }
      );

    MAP.rooms.forEach(
      (
        room,
        index
      ) => {
        const polygon =
          createSvgElement(
            "polygon",
            {
              class:
                "house-control-pad__room-shape",
              "data-house-room-shape":
                "",
              "data-house-room-id":
                room.id,
              points:
                room.polygon
                  .map(
                    (point) =>
                      `${point[0]},${point[1]}`
                  )
                  .join(" "),
              fill:
                "url(#houseRoomGradient)"
            }
          );

        polygon.style.setProperty(
          "--house-room-index",
          String(index)
        );

        roomGroup.append(
          polygon
        );
      }
    );

    const coreRing =
      createSvgElement(
        "circle",
        {
          class:
            "house-control-pad__core-ring",
          cx:
            "500",
          cy:
            "356",
          r:
            "73"
        }
      );

    const coreDiamond =
      createSvgElement(
        "path",
        {
          class:
            "house-control-pad__core-diamond",
          d:
            "M500 292 L564 356 L500 420 L436 356 Z"
        }
      );

    state.svg.append(
      defs,
      estateBackdrop,
      corridorGroup,
      roomGroup,
      coreRing,
      coreDiamond
    );

    MAP.rooms.forEach(
      (
        room,
        index
      ) => {
        state.markersLayer.append(
          createMarker(
            "room",
            room,
            index
          )
        );
      }
    );

    MAP.avatars.forEach(
      (
        avatar,
        index
      ) => {
        state.markersLayer.append(
          createMarker(
            "avatar",
            avatar,
            index
          )
        );
      }
    );

    renderDefaultDetails();
  }

  function createMarker(
    type,
    item,
    index
  ) {
    const marker = createElement(
      "button",
      {
        className:
          type === "room"
            ? "house-control-pad__marker house-control-pad__marker--room"
            : "house-control-pad__marker house-control-pad__marker--avatar",
        attributes: {
          type: "button",
          "data-house-select": "",
          "aria-pressed": "false",
          "aria-label": item.label
        }
      }
    );

    if (type === "room") {
      marker.setAttribute(
        "data-house-room",
        ""
      );

      marker.dataset.houseRoomId =
        item.id;

      marker.style.setProperty(
        "--house-room-index",
        String(index)
      );
    } else {
      marker.setAttribute(
        "data-house-avatar",
        ""
      );

      marker.dataset.houseAvatarId =
        item.id;

      marker.style.setProperty(
        "--house-avatar-index",
        String(index)
      );
    }

    const normalizedX =
      (
        (
          item.marker.x -
          MAP.viewBox.minX
        ) /
        MAP.viewBox.width
      ) *
      100;

    const normalizedY =
      (
        (
          item.marker.y -
          MAP.viewBox.minY
        ) /
        MAP.viewBox.height
      ) *
      100;

    marker.style.setProperty(
      "--house-marker-x",
      `${normalizedX}%`
    );

    marker.style.setProperty(
      "--house-marker-y",
      `${normalizedY}%`
    );

    marker.dataset.houseNormalizedX =
      String(normalizedX);

    marker.dataset.houseNormalizedY =
      String(normalizedY);

    marker.append(
      createElement(
        "span",
        {
          className:
            "house-control-pad__marker-label",
          text:
            item.shortLabel ||
            item.label
        }
      )
    );

    return marker;
  }

  function renderDefaultDetails() {
    clearElement(
      state.detailsPanel
    );

    const title = createElement(
      "h3",
      {
        className:
          "house-control-pad__details-title",
        text:
          MAP.estate.label
      }
    );

    const description =
      createElement(
        "p",
        {
          className:
            "house-control-pad__details-description",
          text:
            "Select any chamber or the central House Guide."
        }
      );

    state.detailsPanel.append(
      title,
      description
    );
  }

  function renderSelectedDetails(
    type,
    item
  ) {
    clearElement(
      state.detailsPanel
    );

    const title = createElement(
      "h3",
      {
        className:
          "house-control-pad__details-title",
        text:
          item.label
      }
    );

    state.detailsPanel.append(
      title
    );

    if (
      type === "avatar" &&
      item.role
    ) {
      state.detailsPanel.append(
        createElement(
          "p",
          {
            className:
              "house-control-pad__details-role",
            text:
              item.role
          }
        )
      );
    }

    state.detailsPanel.append(
      createElement(
        "p",
        {
          className:
            "house-control-pad__details-description",
          text:
            item.description
        }
      )
    );

    state.detailsPanel.append(
      createElement(
        "button",
        {
          className:
            "house-control-pad__route",
          text:
            `Enter ${item.shortLabel || item.label}`,
          attributes: {
            type:
              "button",
            "data-house-route":
              "",
            "data-house-target-type":
              type,
            "data-house-target-id":
              item.id
          }
        }
      )
    );
  }

  function bindRuntime() {
    removeAllListeners();

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

    if (state.root) {
      addManagedListener(
        state.root,
        "click",
        onRootClick
      );
    }
  }

  function onDocumentClick(event) {
    if (
      state.destroyed ||
      event.defaultPrevented
    ) {
      return;
    }

    const door = closestElement(
      event.target,
      SELECTORS.door
    );

    if (!door) {
      return;
    }

    if (
      !isEligibleDoorActivation(
        event,
        door
      )
    ) {
      return;
    }

    const result = open({
      door,
      context:
        safeString(
          door.dataset.houseContext,
          200
        )
    });

    if (
      result.ok &&
      state.open
    ) {
      event.preventDefault();
    }
  }

  function onRootClick(event) {
    const closeControl =
      closestElement(
        event.target,
        SELECTORS.close
      );

    if (closeControl) {
      event.preventDefault();

      close("close-control");
      return;
    }

    if (
      state.backdrop &&
      event.target ===
        state.backdrop
    ) {
      close("backdrop");
      return;
    }

    const routeControl =
      closestElement(
        event.target,
        SELECTORS.route
      );

    if (routeControl) {
      event.preventDefault();

      routeTo({
        type:
          routeControl.dataset
            .houseTargetType,
        id:
          routeControl.dataset
            .houseTargetId
      });

      return;
    }

    const selectable =
      closestElement(
        event.target,
        SELECTORS.selectable
      );

    if (!selectable) {
      return;
    }

    event.preventDefault();

    const type =
      selectable.matches(
        SELECTORS.room
      )
        ? "room"
        : selectable.matches(
            SELECTORS.avatar
          )
          ? "avatar"
          : "";

    const id =
      type === "room"
        ? selectable.dataset
            .houseRoomId
        : selectable.dataset
            .houseAvatarId;

    if (!type || !id) {
      return;
    }

    selectTarget(
      type,
      id
    );
  }

  function onDocumentKeydown(event) {
    if (
      !state.open ||
      state.destroyed
    ) {
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
      const activeMarker =
        closestElement(
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
      state.dialog.contains(
        event.target
      )
    ) {
      return;
    }

    focusInitialElement();
  }

  function selectTarget(type, id) {
    const item = findMapItem(
      type,
      id
    );

    if (!item) {
      return makeResult(
        false,
        state.lifecycleState,
        "The selected destination does not exist."
      );
    }

    state.selectedType = type;
    state.selectedId = id;

    syncSelection();
    renderSelectedDetails(
      type,
      item
    );

    updateStatus(
      `${item.label} selected.`
    );

    dispatch(EVENTS.select, {
      reason:
        "selection",
      targetType:
        type,
      targetId:
        id,
      route:
        item.route
    });

    publishStatus();

    return makeResult(
      true,
      state.lifecycleState,
      `${item.label} selected.`,
      {
        targetId:
          id,
        route:
          item.route
      }
    );
  }

  function syncSelection() {
    if (!state.root) {
      return;
    }

    state.root.dataset
      .houseSelectedType =
        state.selectedType;

    state.root.dataset
      .houseSelectedId =
        state.selectedId;

    const markers =
      state.root.querySelectorAll(
        SELECTORS.selectable
      );

    markers.forEach(
      (marker) => {
        const type =
          marker.matches(
            SELECTORS.room
          )
            ? "room"
            : "avatar";

        const id =
          type === "room"
            ? marker.dataset
                .houseRoomId
            : marker.dataset
                .houseAvatarId;

        const selected =
          type ===
            state.selectedType &&
          id ===
            state.selectedId;

        marker.setAttribute(
          "aria-pressed",
          selected
            ? "true"
            : "false"
        );

        if (selected) {
          marker.setAttribute(
            "aria-current",
            "location"
          );
        } else {
          marker.removeAttribute(
            "aria-current"
          );
        }
      }
    );

    const shapes =
      state.root.querySelectorAll(
        "[data-house-room-shape]"
      );

    shapes.forEach(
      (shape) => {
        const selected =
          state.selectedType ===
            "room" &&
          shape.dataset
            .houseRoomId ===
            state.selectedId;

        shape.dataset
          .houseSelected =
            selected
              ? "true"
              : "false";
      }
    );
  }

  function normalizeRouteRequest(
    request
  ) {
    if (
      !request ||
      typeof request !== "object"
    ) {
      return makeResult(
        false,
        state.lifecycleState,
        "A destination type and id are required."
      );
    }

    const type =
      safeString(
        request.type,
        40
      );

    const id =
      safeIdentifier(
        request.id
      );

    if (
      !["room", "avatar"].includes(
        type
      ) ||
      !id
    ) {
      return makeResult(
        false,
        state.lifecycleState,
        "A valid destination type and id are required."
      );
    }

    const item =
      findMapItem(
        type,
        id
      );

    if (!item) {
      return makeResult(
        false,
        state.lifecycleState,
        "The requested destination does not exist."
      );
    }

    const route =
      validateInternalRoute(
        item.route
      );

    if (!route) {
      return makeResult(
        false,
        state.lifecycleState,
        "The requested destination route is invalid."
      );
    }

    return {
      ok: true,
      type,
      id,
      route
    };
  }

  function findMapItem(type, id) {
    if (type === "room") {
      return (
        MAP.rooms.find(
          (room) =>
            room.id === id
        ) ||
        null
      );
    }

    if (type === "avatar") {
      return (
        MAP.avatars.find(
          (avatar) =>
            avatar.id === id
        ) ||
        null
      );
    }

    return null;
  }

  function validateInternalRoute(
    rawRoute
  ) {
    const route =
      safeString(
        rawRoute,
        2000
      );

    if (!route) {
      return "";
    }

    try {
      const parsed = new URL(
        route,
        global.location.href
      );

      if (
        parsed.origin !==
        global.location.origin
      ) {
        return "";
      }

      if (
        !["http:", "https:"].includes(
          parsed.protocol
        )
      ) {
        return "";
      }

      return (
        parsed.pathname +
        parsed.search +
        parsed.hash
      );
    } catch (_error) {
      return "";
    }
  }

  function normalizeOpenRequest(
    request
  ) {
    const source =
      request &&
      typeof request === "object"
        ? request
        : {};

    const door =
      source.door &&
      source.door.nodeType === 1
        ? source.door
        : null;

    return {
      door,
      context:
        safeString(
          source.context,
          200
        ) ||
        safeString(
          door &&
            door.dataset
              .houseContext,
          200
        )
    };
  }

  function resolveReturnFocusTarget(
    door
  ) {
    if (
      door &&
      door.isConnected
    ) {
      return door;
    }

    if (
      document.activeElement &&
      document.activeElement !==
        document.body &&
      document.activeElement
        .isConnected
    ) {
      return document.activeElement;
    }

    return null;
  }

  function focusInitialElement() {
    if (!state.dialog) {
      return;
    }

    let target =
      state.closeButton ||
      state.dialog;

    if (
      state.selectedType &&
      state.selectedId &&
      state.markersLayer
    ) {
      const selector =
        state.selectedType ===
        "room"
          ? `[data-house-room-id="${cssEscape(
              state.selectedId
            )}"]`
          : `[data-house-avatar-id="${cssEscape(
              state.selectedId
            )}"]`;

      target =
        state.markersLayer.querySelector(
          selector
        ) ||
        target;
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
    const target =
      state.returnFocusTarget;

    state.returnFocusTarget =
      null;
    state.activeDoor =
      null;

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

    const firstDoor =
      document.querySelector(
        SELECTORS.door
      );

    if (
      firstDoor &&
      isFocusable(firstDoor)
    ) {
      firstDoor.focus({
        preventScroll: true
      });
    }
  }

  function trapFocus(event) {
    const focusable =
      getFocusableElements(
        state.dialog
      );

    if (!focusable.length) {
      event.preventDefault();
      state.dialog.focus();
      return;
    }

    const first =
      focusable[0];

    const last =
      focusable[
        focusable.length - 1
      ];

    const active =
      document.activeElement;

    if (
      event.shiftKey &&
      active === first
    ) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (
      !event.shiftKey &&
      active === last
    ) {
      event.preventDefault();
      first.focus();
      return;
    }

    if (
      !state.dialog.contains(active)
    ) {
      event.preventDefault();
      first.focus();
    }
  }

  function moveMarkerFocus(
    event,
    activeMarker
  ) {
    if (!state.markersLayer) {
      return;
    }

    const markers =
      Array.from(
        state.markersLayer
          .querySelectorAll(
            SELECTORS.selectable
          )
      ).filter(isFocusable);

    if (!markers.length) {
      return;
    }

    const currentIndex =
      markers.indexOf(
        activeMarker
      );

    if (currentIndex < 0) {
      return;
    }

    let nextIndex =
      currentIndex;

    if (
      event.key ===
        "ArrowRight" ||
      event.key ===
        "ArrowDown"
    ) {
      nextIndex =
        (
          currentIndex + 1
        ) %
        markers.length;
    } else if (
      event.key ===
        "ArrowLeft" ||
      event.key ===
        "ArrowUp"
    ) {
      nextIndex =
        (
          currentIndex -
          1 +
          markers.length
        ) %
        markers.length;
    } else if (
      event.key === "Home"
    ) {
      nextIndex = 0;
    } else if (
      event.key === "End"
    ) {
      nextIndex =
        markers.length - 1;
    }

    event.preventDefault();

    markers[
      nextIndex
    ].focus({
      preventScroll: true
    });
  }

  function applyBackgroundCustody() {
    if (
      !state.root ||
      !document.body
    ) {
      return;
    }

    state.backgroundRecords = [];

    Array.from(
      document.body.children
    ).forEach(
      (element) => {
        if (
          element === state.root
        ) {
          return;
        }

        const record = {
          element,
          inertSupported:
            "inert" in element,
          inertValue:
            "inert" in element
              ? Boolean(
                  element.inert
                )
              : false,
          ariaHidden:
            element.getAttribute(
              "aria-hidden"
            )
        };

        state.backgroundRecords.push(
          record
        );

        if (
          record.inertSupported
        ) {
          element.inert = true;
        } else {
          element.setAttribute(
            "aria-hidden",
            "true"
          );
        }
      }
    );
  }

  function restoreBackgroundCustody() {
    state.backgroundRecords.forEach(
      (record) => {
        const element =
          record.element;

        if (
          !element ||
          !element.isConnected
        ) {
          return;
        }

        if (
          record.inertSupported
        ) {
          element.inert =
            record.inertValue;
        }

        if (
          record.ariaHidden === null
        ) {
          element.removeAttribute(
            "aria-hidden"
          );
        } else {
          element.setAttribute(
            "aria-hidden",
            record.ariaHidden
          );
        }
      }
    );

    state.backgroundRecords = [];
  }

  function lockDocumentScroll() {
    const html =
      document.documentElement;
    const body =
      document.body;

    if (
      !html ||
      !body ||
      html.dataset
        .houseScrollLock ===
        "true"
    ) {
      return;
    }

    html.dataset
      .housePreviousOverflow =
        html.style.overflow ||
        "";

    body.dataset
      .housePreviousOverflow =
        body.style.overflow ||
        "";

    html.style.overflow =
      "hidden";

    body.style.overflow =
      "hidden";

    html.dataset
      .houseScrollLock =
        "true";
  }

  function unlockDocumentScroll() {
    const html =
      document.documentElement;
    const body =
      document.body;

    if (
      !html ||
      !body ||
      html.dataset
        .houseScrollLock !==
        "true"
    ) {
      return;
    }

    html.style.overflow =
      html.dataset
        .housePreviousOverflow ||
      "";

    body.style.overflow =
      body.dataset
        .housePreviousOverflow ||
      "";

    delete html.dataset
      .housePreviousOverflow;

    delete body.dataset
      .housePreviousOverflow;

    delete html.dataset
      .houseScrollLock;
  }

  function updateStatus(message) {
    if (state.statusNode) {
      state.statusNode.textContent =
        safeString(
          message,
          1000
        );
    }
  }

  function transitionTo(
    nextState,
    force
  ) {
    if (
      state.lifecycleState ===
        STATES.destroyed &&
      !force
    ) {
      return false;
    }

    const previous =
      state.lifecycleState;

    state.previousState =
      previous;

    state.lifecycleState =
      nextState;

    state.lastUpdatedAt =
      nowIso();

    if (state.root) {
      state.root.dataset
        .houseState =
          nextState;

      state.root.dataset
        .houseReady =
          state.ready
            ? "true"
            : "false";

      state.root.dataset
        .houseOpen =
          state.open
            ? "true"
            : "false";
    }

    dispatch(EVENTS.state, {
      reason:
        "state-transition",
      previousState:
        previous,
      nextState
    });

    publishStatus();

    return true;
  }

  function dispatch(
    eventName,
    extraDetail,
    options
  ) {
    const detail = Object.freeze({
      contract:
        CONTRACT,
      state:
        state.lifecycleState,
      previousState:
        state.previousState,
      context:
        state.activeContext,
      selectedType:
        state.selectedType,
      selectedId:
        state.selectedId,
      timestamp:
        nowIso(),
      ...clonePlain(
        extraDetail ||
        {}
      )
    });

    const event =
      new CustomEvent(
        eventName,
        {
          detail,
          bubbles:
            false,
          cancelable:
            Boolean(
              options &&
              options.cancelable
            ),
          composed:
            false
        }
      );

    document.dispatchEvent(
      event
    );

    if (
      state.root &&
      state.root.isConnected
    ) {
      state.root.dispatchEvent(
        new CustomEvent(
          eventName,
          {
            detail,
            bubbles:
              false,
            cancelable:
              Boolean(
                options &&
                options.cancelable
              ),
            composed:
              false
          }
        )
      );
    }

    return event;
  }

  function publishStatus() {
    state.lastUpdatedAt =
      nowIso();

    const snapshot =
      Object.freeze(
        buildStatusSnapshot()
      );

    try {
      Object.defineProperty(
        global,
        STATUS_GLOBAL,
        {
          configurable:
            true,
          enumerable:
            false,
          writable:
            false,
          value:
            snapshot
        }
      );
    } catch (_error) {
      global[STATUS_GLOBAL] =
        snapshot;
    }

    if (state.root) {
      state.root.dataset
        .houseState =
          state.lifecycleState;

      state.root.dataset
        .houseReady =
          state.ready
            ? "true"
            : "false";

      state.root.dataset
        .houseOpen =
          state.open
            ? "true"
            : "false";

      state.root.dataset
        .houseSelectedType =
          state.selectedType;

      state.root.dataset
        .houseSelectedId =
          state.selectedId;
    }

    return snapshot;
  }

  function buildStatusSnapshot() {
    return {
      contract:
        CONTRACT,
      state:
        state.lifecycleState,
      previousState:
        state.previousState,
      initialized:
        state.initialized,
      ready:
        state.ready,
      mounted:
        Boolean(
          state.root &&
          state.root.isConnected
        ),
      open:
        state.open,
      destroyed:
        state.destroyed,
      selectedType:
        state.selectedType,
      selectedId:
        state.selectedId,
      activeContext:
        state.activeContext,
      roomCount:
        MAP.rooms.length,
      avatarCount:
        MAP.avatars.length,
      corridorCount:
        MAP.corridors.length,
      doorCount:
        document.querySelectorAll(
          SELECTORS.door
        ).length,
      openCount:
        state.openCount,
      closeCount:
        state.closeCount,
      routeCount:
        state.routeCount,
      initializedAt:
        state.initializedAt,
      openedAt:
        state.openedAt,
      closedAt:
        state.closedAt,
      destroyedAt:
        state.destroyedAt,
      lastUpdatedAt:
        state.lastUpdatedAt
    };
  }

  function addManagedListener(
    target,
    type,
    handler,
    options
  ) {
    if (
      !target ||
      typeof target
        .addEventListener !==
        "function"
    ) {
      return;
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
  }

  function removeAllListeners() {
    state.listeners.forEach(
      (record) => {
        try {
          record.target
            .removeEventListener(
              record.type,
              record.handler,
              record.options
            );
        } catch (_error) {
          // Continue cleanup.
        }
      }
    );

    state.listeners = [];
  }

  function clearCloseTimer() {
    if (
      state.closeTimer ===
      null
    ) {
      return;
    }

    global.clearTimeout(
      state.closeTimer
    );

    state.closeTimer = null;
  }

  function isEligibleDoorActivation(
    event,
    door
  ) {
    if (
      !door ||
      door.nodeType !== 1
    ) {
      return false;
    }

    if (
      door.hasAttribute(
        "disabled"
      ) ||
      door.getAttribute(
        "aria-disabled"
      ) === "true"
    ) {
      return false;
    }

    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return false;
    }

    if (
      door.hasAttribute(
        "download"
      )
    ) {
      return false;
    }

    const target =
      safeString(
        door.getAttribute(
          "target"
        ),
        40
      );

    if (
      target &&
      target !== "_self"
    ) {
      return false;
    }

    return true;
  }

  function getFocusableElements(
    container
  ) {
    if (!container) {
      return [];
    }

    return Array.from(
      container.querySelectorAll(
        [
          "a[href]",
          "button:not([disabled])",
          "input:not([disabled])",
          "select:not([disabled])",
          "textarea:not([disabled])",
          "[tabindex]:not([tabindex='-1'])"
        ].join(",")
      )
    ).filter(isFocusable);
  }

  function isFocusable(element) {
    if (
      !element ||
      element.nodeType !== 1 ||
      element.hidden ||
      element.hasAttribute(
        "disabled"
      ) ||
      element.getAttribute(
        "aria-hidden"
      ) === "true"
    ) {
      return false;
    }

    const style =
      global.getComputedStyle(
        element
      );

    return (
      style.display !== "none" &&
      style.visibility !==
        "hidden"
    );
  }

  function closestElement(
    target,
    selector
  ) {
    if (!target) {
      return null;
    }

    const element =
      target.nodeType === 1
        ? target
        : target.parentElement;

    return (
      element &&
      typeof element.closest ===
        "function"
    )
      ? element.closest(
          selector
        )
      : null;
  }

  function createElement(
    tagName,
    config
  ) {
    const element =
      document.createElement(
        tagName
      );

    const source =
      config ||
      {};

    if (source.className) {
      element.className =
        source.className;
    }

    if (
      source.text !==
      undefined
    ) {
      element.textContent =
        safeString(
          source.text,
          3000
        );
    }

    if (
      source.attributes &&
      typeof source.attributes ===
        "object"
    ) {
      Object.entries(
        source.attributes
      ).forEach(
        (
          [
            name,
            value
          ]
        ) => {
          if (
            value === undefined ||
            value === null
          ) {
            return;
          }

          element.setAttribute(
            name,
            String(value)
          );
        }
      );
    }

    return element;
  }

  function createSvgElement(
    tagName,
    attributes
  ) {
    const element =
      document.createElementNS(
        SVG_NS,
        tagName
      );

    if (
      attributes &&
      typeof attributes ===
        "object"
    ) {
      Object.entries(
        attributes
      ).forEach(
        (
          [
            name,
            value
          ]
        ) => {
          if (
            value === undefined ||
            value === null
          ) {
            return;
          }

          element.setAttribute(
            name,
            String(value)
          );
        }
      );
    }

    return element;
  }

  function clearElement(element) {
    if (!element) {
      return;
    }

    while (
      element.firstChild
    ) {
      element.removeChild(
        element.firstChild
      );
    }
  }

  function removeExistingRoot() {
    document
      .querySelectorAll(
        SELECTORS.root
      )
      .forEach(
        (root) => {
          if (
            root.parentNode
          ) {
            root.parentNode.removeChild(
              root
            );
          }
        }
      );
  }

  function prefersReducedMotion() {
    return Boolean(
      global.matchMedia &&
      global
        .matchMedia(
          "(prefers-reduced-motion: reduce)"
        )
        .matches
    );
  }

  function safeString(
    value,
    maxLength
  ) {
    if (
      value === undefined ||
      value === null
    ) {
      return "";
    }

    return String(value)
      .replace(
        /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,
        ""
      )
      .trim()
      .slice(
        0,
        Number.isFinite(
          maxLength
        )
          ? maxLength
          : 2000
      );
  }

  function safeIdentifier(
    value
  ) {
    const candidate =
      safeString(
        value,
        160
      );

    return /^[A-Za-z0-9][A-Za-z0-9._:-]{0,159}$/.test(
      candidate
    )
      ? candidate
      : "";
  }

  function normalizeError(error) {
    if (
      error instanceof Error
    ) {
      return {
        name:
          safeString(
            error.name,
            120
          ),
        message:
          safeString(
            error.message,
            1000
          )
      };
    }

    return {
      name:
        "Error",
      message:
        safeString(
          error,
          1000
        ) ||
        "Unknown error"
    };
  }

  function makeResult(
    ok,
    resultState,
    reason,
    extra
  ) {
    return Object.freeze({
      ok:
        Boolean(ok),
      state:
        resultState ||
        state.lifecycleState,
      reason:
        safeString(
          reason,
          1000
        ),
      targetId:
        "",
      route:
        "",
      error:
        null,
      ...clonePlain(
        extra ||
        {}
      )
    });
  }

  function clonePlain(
    value,
    seen
  ) {
    if (
      value === null ||
      typeof value !==
        "object"
    ) {
      return value;
    }

    const memory =
      seen ||
      new WeakMap();

    if (
      memory.has(value)
    ) {
      return "[Circular]";
    }

    memory.set(
      value,
      true
    );

    if (
      Array.isArray(value)
    ) {
      return value.map(
        (entry) =>
          clonePlain(
            entry,
            memory
          )
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

    Object.entries(
      value
    ).forEach(
      (
        [
          key,
          entry
        ]
      ) => {
        const cloned =
          clonePlain(
            entry,
            memory
          );

        if (
          cloned !== undefined
        ) {
          output[key] =
            cloned;
        }
      }
    );

    return output;
  }

  function deepFreeze(
    value,
    seen
  ) {
    if (
      value === null ||
      typeof value !==
        "object" ||
      Object.isFrozen(value)
    ) {
      return value;
    }

    const memory =
      seen ||
      new WeakSet();

    if (
      memory.has(value)
    ) {
      return value;
    }

    memory.add(value);

    Object.values(
      value
    ).forEach(
      (entry) => {
        deepFreeze(
          entry,
          memory
        );
      }
    );

    return Object.freeze(
      value
    );
  }

  function cssEscape(value) {
    if (
      global.CSS &&
      typeof global.CSS
        .escape ===
        "function"
    ) {
      return global.CSS.escape(
        value
      );
    }

    return String(value)
      .replace(
        /[^A-Za-z0-9_-]/g,
        (character) =>
          `\\${character}`
      );
  }

  function nowIso() {
    return new Date()
      .toISOString();
  }
})(window, document);

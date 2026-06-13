// /assets/house-control-pad/house.control-pad.js
// HOUSE_CONTROL_PAD_NINE_ROOM_DIGITAL_GEM_RUNTIME_TNT_v2
// Full-file replacement.
// Complete runtime authority for the nine-room estate map.

(function houseControlPadNineRoomRuntime(global, document) {
  "use strict";

  if (!global || !document) {
    return;
  }

  const CONTRACT =
    "HOUSE_CONTROL_PAD_NINE_ROOM_DIGITAL_GEM_RUNTIME_TNT_v2";

  const PUBLIC_GLOBAL = "HOUSE_CONTROL_PAD";
  const SVG_NS = "http://www.w3.org/2000/svg";

  const SELECTORS = Object.freeze({
    open: "[data-house-control-pad-open]",
    root: "[data-house-control-pad]",
    dialog: "[data-house-dialog]",
    backdrop: "[data-house-backdrop]",
    close: "[data-house-close]",
    status: "[data-house-status]",
    estate: "[data-house-estate]",
    svg: "[data-house-svg]",
    markers: "[data-house-markers]",
    details: "[data-house-details]",
    room: "[data-house-room]",
    guide: "[data-house-guide]",
    route: "[data-house-route]"
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

  const ESTATE = deepFreeze({
    id: "diamond-gate-nine-room-estate",
    eyebrow: "Diamond Gate Bridge",
    label: "The House Map",
    description:
      "Nine primary rooms form the public estate. Select a room gem to preview its purpose and enter its route.",

    viewBox: {
      minX: 0,
      minY: 0,
      width: 1200,
      height: 900
    },

    center: {
      x: 600,
      y: 450
    },

    guide: {
      id: "house-guide",
      label: "House Guide",
      shortLabel: "Guide",
      description:
        "The center of the estate. Use the guide to reset the map and review the complete nine-room structure.",
      marker: {
        x: 600,
        y: 450
      }
    },

    rooms: [
      {
        id: "main-hall",
        order: 1,
        label: "Main Hall",
        shortLabel: "Main Hall",
        category: "Public Center",
        description:
          "The primary public center of the House and the main entrance into the traditional website.",
        route: "/home/",
        marker: {
          x: 600,
          y: 112
        }
      },

      {
        id: "law-library",
        order: 2,
        label: "Law Library",
        shortLabel: "Law",
        category: "Law and Coherence",
        description:
          "The estate chamber for laws, governing principles, boundaries, coherence, and admissibility.",
        route: "/laws/",
        marker: {
          x: 835,
          y: 190
        }
      },

      {
        id: "council-room",
        order: 3,
        label: "Council Room",
        shortLabel: "Council",
        category: "Coherence Diagnostic",
        description:
          "The chamber where coherence is examined, conditions are weighed, and the diagnostic path begins.",
        route: "/coherence-diagnostic/",
        marker: {
          x: 1018,
          y: 392
        }
      },

      {
        id: "hearth-room-lab",
        order: 4,
        label: "Hearth Room / The Lab",
        shortLabel: "Hearth Lab",
        category: "Living Laboratory",
        description:
          "The estate laboratory inside Hearth, where the living world, House systems, experiments, and guided interpretation meet.",
        route: "/showroom/globe/hearth/",
        marker: {
          x: 974,
          y: 650
        }
      },

      {
        id: "portrait-hall",
        order: 5,
        label: "Portrait Hall",
        shortLabel: "Portrait Hall",
        category: "Characters",
        description:
          "The hall of characters, inhabitants, identities, and narrative presences throughout the estate.",
        route: "/characters/",
        marker: {
          x: 748,
          y: 798
        }
      },

      {
        id: "portrait-room",
        order: 6,
        label: "Portrait Room / Host Portrait",
        shortLabel: "Host Portrait",
        category: "Host Identity",
        description:
          "The estate portrait room for the host, the Underdog identity, and the human center behind the House.",
        route: "/about-this-underdog/",
        marker: {
          x: 452,
          y: 798
        }
      },

      {
        id: "product-gallery",
        order: 7,
        label: "Product Gallery",
        shortLabel: "Products",
        category: "Usable Value",
        description:
          "The public gallery for tools, products, applications, and usable expressions of the estate.",
        route: "/products/",
        marker: {
          x: 226,
          y: 650
        }
      },

      {
        id: "atlas-study",
        order: 8,
        label: "Atlas Study",
        shortLabel: "Atlas",
        category: "World Study",
        description:
          "The parent world-study chamber containing the estate's planetary routes, worlds, and annexes.",
        route: "/showroom/globe/",
        marker: {
          x: 182,
          y: 392
        }
      },

      {
        id: "atrium",
        order: 9,
        label: "Atrium",
        shortLabel: "Atrium",
        category: "Mirrorland Entrance",
        description:
          "The main entrance into Mirrorland, the estate's interactive narrative and world-expression layer.",
        route: "/showroom/",
        marker: {
          x: 365,
          y: 190
        }
      }
    ]
  });

  validateEstate(ESTATE);

  const priorController = global[PUBLIC_GLOBAL];

  if (
    priorController &&
    typeof priorController.destroy === "function"
  ) {
    try {
      priorController.destroy("authority-replacement");
    } catch (_error) {
      removeExistingRoots();
    }
  } else {
    removeExistingRoots();
  }

  try {
    delete global[PUBLIC_GLOBAL];
  } catch (_error) {
    // The new authority is installed below.
  }

  const state = {
    lifecycle: STATES.uninitialized,
    previousLifecycle: "",
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
    guideButton: null,

    selectedRoomId: "",
    activeContext: "",
    activeDoor: null,
    returnFocusTarget: null,

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
    updatedAt: nowIso()
  };

  const controller = Object.freeze({
    contract: CONTRACT,
    roomCount: ESTATE.rooms.length,

    init,
    open,
    close,
    toggle,
    rebind,
    selectRoom,
    routeTo,
    getRegistry,
    getStatus,
    getSnapshot,
    destroy
  });

  installController();
  autoBoot();

  function installController() {
    Object.defineProperty(global, PUBLIC_GLOBAL, {
      configurable: true,
      enumerable: true,
      writable: false,
      value: controller
    });
  }

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
      return result(
        false,
        STATES.destroyed,
        "The House Map runtime has been destroyed."
      );
    }

    if (
      state.initialized &&
      state.root &&
      state.root.isConnected
    ) {
      bindRuntime();

      return result(
        true,
        state.lifecycle,
        "The House Map is already initialized."
      );
    }

    transitionTo(STATES.initializing);

    try {
      buildRoot();
      renderEstate();
      renderGuideDetails();
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
      updateStatus("Nine-room estate ready.");

      dispatch(EVENTS.ready, {
        reason: "initialization-complete",
        roomCount: ESTATE.rooms.length
      });

      return result(
        true,
        STATES.ready,
        "The House Map initialized successfully."
      );
    } catch (error) {
      state.ready = false;

      transitionTo(STATES.failed);
      updateStatus("The House Map could not initialize.");

      dispatch(EVENTS.error, {
        reason: "initialization-failed",
        error: normalizeError(error)
      });

      return result(
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
      return result(
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

    if (
      !state.root ||
      !state.dialog
    ) {
      return result(
        false,
        STATES.failed,
        "The House Map overlay is unavailable."
      );
    }

    const normalized = normalizeOpenRequest(request);

    if (state.open) {
      state.activeDoor =
        normalized.door ||
        state.activeDoor;

      state.activeContext =
        normalized.context ||
        state.activeContext;

      return result(
        true,
        STATES.open,
        "The House Map is already open."
      );
    }

    const openRequestEvent = dispatch(
      EVENTS.openRequest,
      {
        reason: "open-request",
        context: normalized.context
      },
      {
        cancelable: true
      }
    );

    if (openRequestEvent.defaultPrevented) {
      return result(
        false,
        state.lifecycle,
        "The House Map open request was canceled."
      );
    }

    state.activeDoor = normalized.door;
    state.activeContext = normalized.context;
    state.returnFocusTarget = resolveReturnFocusTarget(
      normalized.door
    );

    transitionTo(STATES.opening);
    clearCloseTimer();

    try {
      state.root.hidden = false;
      state.root.setAttribute("aria-hidden", "false");
      state.root.dataset.houseContext = state.activeContext;

      void state.root.offsetWidth;

      state.open = true;
      state.root.dataset.houseOpen = "true";

      applyBackgroundCustody();
      lockDocumentScroll();

      transitionTo(STATES.open);

      state.openCount += 1;
      state.openedAt = nowIso();

      updateStatus("Nine-room estate open.");
      focusInitialElement();

      dispatch(EVENTS.open, {
        reason: "open-complete",
        context: state.activeContext,
        roomCount: ESTATE.rooms.length
      });

      return result(
        true,
        STATES.open,
        "The House Map opened."
      );
    } catch (error) {
      state.open = false;

      restoreBackgroundCustody();
      unlockDocumentScroll();

      state.root.dataset.houseOpen = "false";
      state.root.hidden = true;
      state.root.setAttribute("aria-hidden", "true");

      transitionTo(STATES.ready);

      dispatch(EVENTS.error, {
        reason: "open-failed",
        error: normalizeError(error)
      });

      return result(
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
      return result(
        false,
        STATES.destroyed,
        "The House Map runtime has been destroyed."
      );
    }

    if (!state.open) {
      return result(
        true,
        state.lifecycle,
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
      return result(
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
      prefersReducedMotion() ? 0 : 280
    );

    return result(
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
      state.root.setAttribute("aria-hidden", "true");

      transitionTo(STATES.closed);

      state.closeCount += 1;
      state.closedAt = nowIso();

      updateStatus("Nine-room estate closed.");
      restoreFocus();

      dispatch(EVENTS.close, {
        reason: closeReason
      });
    }
  }

  function toggle(request) {
    return state.open
      ? close("toggle")
      : open(request);
  }

  function rebind() {
    if (state.destroyed) {
      return result(
        false,
        STATES.destroyed,
        "The House Map runtime has been destroyed."
      );
    }

    bindRuntime();

    return result(
      true,
      state.lifecycle,
      "The House Map controls were rebound."
    );
  }

  function selectRoom(roomId, options) {
    if (state.destroyed) {
      return result(
        false,
        STATES.destroyed,
        "The House Map runtime has been destroyed."
      );
    }

    const id = safeIdentifier(roomId);
    const room = findRoom(id);

    if (!room) {
      return result(
        false,
        state.lifecycle,
        "The requested estate room does not exist."
      );
    }

    state.selectedRoomId = room.id;

    syncSelection();
    renderRoomDetails(room);

    if (
      !options ||
      options.silent !== true
    ) {
      updateStatus(`${room.label} selected.`);

      dispatch(EVENTS.select, {
        reason: "room-selection",
        roomId: room.id,
        roomLabel: room.label,
        route: room.route
      });
    }

    if (
      options &&
      options.focus === true
    ) {
      focusSelectedMarker();
    }

    return result(
      true,
      state.lifecycle,
      `${room.label} selected.`,
      {
        roomId: room.id,
        route: room.route
      }
    );
  }

  function routeTo(request) {
    if (state.destroyed) {
      return result(
        false,
        STATES.destroyed,
        "The House Map runtime has been destroyed."
      );
    }

    const normalized = normalizeRouteRequest(request);

    if (!normalized.ok) {
      updateStatus(normalized.reason);
      return normalized;
    }

    const routeRequestEvent = dispatch(
      EVENTS.routeRequest,
      {
        reason: "route-request",
        roomId: normalized.room.id,
        roomLabel: normalized.room.label,
        route: normalized.route
      },
      {
        cancelable: true
      }
    );

    if (routeRequestEvent.defaultPrevented) {
      updateStatus("Navigation request canceled.");

      return result(
        false,
        state.lifecycle,
        "Navigation request canceled."
      );
    }

    transitionTo(STATES.routing);

    state.routeCount += 1;

    dispatch(EVENTS.routeCommit, {
      reason: "route-commit",
      roomId: normalized.room.id,
      roomLabel: normalized.room.label,
      route: normalized.route
    });

    try {
      global.location.assign(normalized.route);

      return result(
        true,
        STATES.routing,
        "Navigation committed.",
        {
          roomId: normalized.room.id,
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

      return result(
        false,
        state.lifecycle,
        "Navigation could not be completed.",
        {
          error: normalizeError(error)
        }
      );
    }
  }

  function getRegistry() {
    return deepFreeze({
      contract: CONTRACT,
      estateId: ESTATE.id,
      roomCount: ESTATE.rooms.length,
      rooms: ESTATE.rooms.map((room) => ({
        id: room.id,
        order: room.order,
        label: room.label,
        shortLabel: room.shortLabel,
        category: room.category,
        description: room.description,
        route: room.route
      }))
    });
  }

  function getStatus() {
    return Object.freeze(buildStatus());
  }

  function getSnapshot() {
    return deepFreeze({
      status: buildStatus(),

      estate: {
        id: ESTATE.id,
        label: ESTATE.label,
        roomCount: ESTATE.rooms.length
      },

      selection: {
        roomId: state.selectedRoomId
      },

      registry: ESTATE.rooms.map((room) => ({
        id: room.id,
        label: room.label,
        route: room.route
      }))
    });
  }

  function destroy(reason) {
    if (state.destroyed) {
      return result(
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
    state.guideButton = null;

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

    if (
      global[PUBLIC_GLOBAL] === controller
    ) {
      try {
        delete global[PUBLIC_GLOBAL];
      } catch (_error) {
        // Destruction is already complete.
      }
    }

    return result(
      true,
      STATES.destroyed,
      "The House Map runtime was destroyed."
    );
  }

  function buildRoot() {
    removeExistingRoots();

    const root = createElement("div", {
      className: "house-control-pad",
      attributes: {
        "data-house-control-pad": "",
        "data-house-contract": CONTRACT,
        "data-house-state": STATES.closed,
        "data-house-ready": "false",
        "data-house-open": "false",
        "data-house-room-count": String(
          ESTATE.rooms.length
        ),
        "data-house-selected-room": "",
        "data-house-context": "",
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
        "aria-describedby":
          "house-control-pad-description",
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
      text: ESTATE.eyebrow
    });

    const title = createElement("h2", {
      className: "house-control-pad__title",
      text: ESTATE.label,
      attributes: {
        id: "house-control-pad-title"
      }
    });

    const description = createElement("p", {
      className: "house-control-pad__description",
      text: ESTATE.description,
      attributes: {
        id: "house-control-pad-description"
      }
    });

    const closeButton = createElement("button", {
      className: "house-control-pad__close",
      text: "Close",
      attributes: {
        type: "button",
        "data-house-close": "",
        "aria-label": "Close the House Map"
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
      text: "Nine-room estate ready.",
      attributes: {
        "data-house-status": "",
        role: "status",
        "aria-live": "polite",
        "aria-atomic": "true"
      }
    });

    const content = createElement("div", {
      className: "house-control-pad__content"
    });

    const estateNode = createElement("div", {
      className: "house-control-pad__estate",
      attributes: {
        "data-house-estate": "",
        "data-house-digital-gem-map": "true"
      }
    });

    const svg = createSvgElement("svg", {
      class: "house-control-pad__svg",
      "data-house-svg": "",
      "aria-hidden": "true",
      focusable: "false",
      viewBox: [
        ESTATE.viewBox.minX,
        ESTATE.viewBox.minY,
        ESTATE.viewBox.width,
        ESTATE.viewBox.height
      ].join(" "),
      preserveAspectRatio: "xMidYMid meet"
    });

    const markersLayer = createElement("div", {
      className: "house-control-pad__markers",
      attributes: {
        "data-house-markers": ""
      }
    });

    const detailsPanel = createElement("aside", {
      className: "house-control-pad__details",
      attributes: {
        id: "house-control-pad-details",
        "data-house-details": "",
        "aria-live": "polite"
      }
    });

    const footer = createElement("footer", {
      className: "house-control-pad__footer",
      text: "Nine rooms · one estate"
    });

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
    state.markersLayer = markersLayer;
    state.detailsPanel = detailsPanel;
    state.mounted = true;
  }

  function renderEstate() {
    if (
      !state.svg ||
      !state.markersLayer
    ) {
      throw new Error(
        "The House Map rendering surface is unavailable."
      );
    }

    clearElement(state.svg);
    clearElement(state.markersLayer);

    const defs = createSvgElement("defs");

    const estateGradient = createSvgElement(
      "radialGradient",
      {
        id: "houseEstateGradient",
        cx: "50%",
        cy: "46%",
        r: "72%"
      }
    );

    estateGradient.append(
      createSvgElement("stop", {
        offset: "0%",
        "stop-color": "#174687",
        "stop-opacity": ".48"
      }),
      createSvgElement("stop", {
        offset: "46%",
        "stop-color": "#071a38",
        "stop-opacity": ".76"
      }),
      createSvgElement("stop", {
        offset: "100%",
        "stop-color": "#01040d",
        "stop-opacity": ".98"
      })
    );

    const roomGradient = createSvgElement(
      "linearGradient",
      {
        id: "houseRoomGradient",
        x1: "0%",
        y1: "0%",
        x2: "100%",
        y2: "100%"
      }
    );

    roomGradient.append(
      createSvgElement("stop", {
        offset: "0%",
        "stop-color": "#d7f4ff",
        "stop-opacity": ".78"
      }),
      createSvgElement("stop", {
        offset: "28%",
        "stop-color": "#55a9ff",
        "stop-opacity": ".42"
      }),
      createSvgElement("stop", {
        offset: "62%",
        "stop-color": "#142d63",
        "stop-opacity": ".74"
      }),
      createSvgElement("stop", {
        offset: "100%",
        "stop-color": "#f3c86f",
        "stop-opacity": ".38"
      })
    );

    const roomCoreGradient = createSvgElement(
      "radialGradient",
      {
        id: "houseRoomCoreGradient",
        cx: "35%",
        cy: "28%",
        r: "82%"
      }
    );

    roomCoreGradient.append(
      createSvgElement("stop", {
        offset: "0%",
        "stop-color": "#ffffff",
        "stop-opacity": ".72"
      }),
      createSvgElement("stop", {
        offset: "34%",
        "stop-color": "#8dd8ff",
        "stop-opacity": ".34"
      }),
      createSvgElement("stop", {
        offset: "76%",
        "stop-color": "#08245b",
        "stop-opacity": ".58"
      }),
      createSvgElement("stop", {
        offset: "100%",
        "stop-color": "#020711",
        "stop-opacity": ".82"
      })
    );

    const glow = createSvgElement("filter", {
      id: "houseEstateGlow",
      x: "-40%",
      y: "-40%",
      width: "180%",
      height: "180%"
    });

    glow.append(
      createSvgElement("feGaussianBlur", {
        stdDeviation: "8",
        result: "blur"
      })
    );

    const merge = createSvgElement("feMerge");

    merge.append(
      createSvgElement("feMergeNode", {
        in: "blur"
      }),
      createSvgElement("feMergeNode", {
        in: "SourceGraphic"
      })
    );

    glow.append(merge);

    const gridPattern = createSvgElement("pattern", {
      id: "houseDigitalGrid",
      width: "60",
      height: "60",
      patternUnits: "userSpaceOnUse"
    });

    gridPattern.append(
      createSvgElement("path", {
        d: "M 60 0 L 0 0 0 60",
        fill: "none",
        stroke: "rgba(141,216,255,.09)",
        "stroke-width": "1"
      })
    );

    defs.append(
      estateGradient,
      roomGradient,
      roomCoreGradient,
      glow,
      gridPattern
    );

    const background = createSvgElement("rect", {
      class: "house-control-pad__digital-grid",
      x: "0",
      y: "0",
      width: String(ESTATE.viewBox.width),
      height: String(ESTATE.viewBox.height),
      fill: "url(#houseDigitalGrid)"
    });

    const estateShell = createSvgElement("polygon", {
      class: "house-control-pad__estate-shape",
      points: polygonPoints(
        ESTATE.center.x,
        ESTATE.center.y,
        455,
        9,
        -Math.PI / 2
      ),
      fill: "url(#houseEstateGradient)",
      stroke: "rgba(243,200,111,.45)",
      "stroke-width": "4",
      filter: "url(#houseEstateGlow)"
    });

    const outerOrbit = createSvgElement("ellipse", {
      class:
        "house-control-pad__orbit house-control-pad__orbit--outer",
      cx: String(ESTATE.center.x),
      cy: String(ESTATE.center.y),
      rx: "438",
      ry: "352",
      fill: "none",
      stroke: "rgba(141,216,255,.24)",
      "stroke-width": "2",
      "stroke-dasharray": "9 15"
    });

    const middleOrbit = createSvgElement("ellipse", {
      class:
        "house-control-pad__orbit house-control-pad__orbit--middle",
      cx: String(ESTATE.center.x),
      cy: String(ESTATE.center.y),
      rx: "316",
      ry: "256",
      fill: "none",
      stroke: "rgba(243,200,111,.18)",
      "stroke-width": "2",
      "stroke-dasharray": "4 13"
    });

    const innerOrbit = createSvgElement("circle", {
      class:
        "house-control-pad__orbit house-control-pad__orbit--inner",
      cx: String(ESTATE.center.x),
      cy: String(ESTATE.center.y),
      r: "126",
      fill: "rgba(4,14,35,.54)",
      stroke: "rgba(141,216,255,.26)",
      "stroke-width": "3"
    });

    const network = createSvgElement("g", {
      class: "house-control-pad__network"
    });

    ESTATE.rooms.forEach((room, index) => {
      const nextRoom =
        ESTATE.rooms[
          (index + 1) %
          ESTATE.rooms.length
        ];

      network.append(
        createSvgElement("line", {
          class:
            "house-control-pad__corridor house-control-pad__corridor--spoke",
          "data-house-corridor": "",
          "data-house-corridor-room": room.id,
          x1: String(ESTATE.center.x),
          y1: String(ESTATE.center.y),
          x2: String(room.marker.x),
          y2: String(room.marker.y)
        }),
        createSvgElement("line", {
          class:
            "house-control-pad__corridor house-control-pad__corridor--ring",
          "data-house-ring-link": "",
          "data-house-ring-from": room.id,
          "data-house-ring-to": nextRoom.id,
          x1: String(room.marker.x),
          y1: String(room.marker.y),
          x2: String(nextRoom.marker.x),
          y2: String(nextRoom.marker.y)
        })
      );
    });

    const roomsGroup = createSvgElement("g", {
      class: "house-control-pad__rooms",
      "data-house-room-gems": ""
    });

    ESTATE.rooms.forEach((room, index) => {
      roomsGroup.append(
        createRoomGem(room, index)
      );
    });

    const centerHalo = createSvgElement("circle", {
      class: "house-control-pad__guide-halo",
      cx: String(ESTATE.center.x),
      cy: String(ESTATE.center.y),
      r: "88",
      fill: "rgba(36,120,255,.10)",
      stroke: "rgba(243,200,111,.32)",
      "stroke-width": "2",
      "stroke-dasharray": "5 9"
    });

    const centerDiamond = createSvgElement("path", {
      class: "house-control-pad__guide-diamond",
      d: [
        `M ${ESTATE.center.x} ${ESTATE.center.y - 62}`,
        `L ${ESTATE.center.x + 62} ${ESTATE.center.y}`,
        `L ${ESTATE.center.x} ${ESTATE.center.y + 62}`,
        `L ${ESTATE.center.x - 62} ${ESTATE.center.y}`,
        "Z"
      ].join(" "),
      fill: "url(#houseRoomCoreGradient)",
      stroke: "rgba(255,232,163,.72)",
      "stroke-width": "3",
      filter: "url(#houseEstateGlow)"
    });

    state.svg.append(
      defs,
      background,
      estateShell,
      outerOrbit,
      middleOrbit,
      innerOrbit,
      network,
      roomsGroup,
      centerHalo,
      centerDiamond
    );

    ESTATE.rooms.forEach((room, index) => {
      state.markersLayer.append(
        createRoomMarker(room, index)
      );
    });

    const guideButton = createElement("button", {
      className:
        "house-control-pad__marker house-control-pad__marker--avatar house-control-pad__guide",
      attributes: {
        type: "button",
        "data-house-guide": "",
        "aria-label": "Open the House Guide overview",
        "aria-controls": "house-control-pad-details"
      }
    });

    guideButton.style.setProperty(
      "--house-marker-x",
      percentageX(ESTATE.guide.marker.x)
    );

    guideButton.style.setProperty(
      "--house-marker-y",
      percentageY(ESTATE.guide.marker.y)
    );

    guideButton.append(
      createElement("span", {
        className:
          "house-control-pad__marker-label",
        text: ESTATE.guide.shortLabel
      })
    );

    state.markersLayer.append(guideButton);
    state.guideButton = guideButton;
  }

  function createRoomGem(room, index) {
    const group = createSvgElement("g", {
      class: "house-control-pad__room-gem",
      "data-house-room-gem": "",
      "data-house-room-id": room.id,
      "data-house-selected": "false"
    });

    group.style.setProperty(
      "--house-room-index",
      String(index)
    );

    const outerVertices = polygonVertexList(
      room.marker.x,
      room.marker.y,
      78,
      8,
      Math.PI / 8
    );

    const innerVertices = polygonVertexList(
      room.marker.x,
      room.marker.y,
      50,
      8,
      Math.PI / 8
    );

    const outer = createSvgElement("polygon", {
      class:
        "house-control-pad__room-shape house-control-pad__room-shell",
      "data-house-room-shape": "",
      "data-house-room-id": room.id,
      "data-house-selected": "false",
      points: vertexString(outerVertices),
      fill: "url(#houseRoomGradient)",
      stroke: "rgba(215,244,255,.55)",
      "stroke-width": "3",
      filter: "url(#houseEstateGlow)"
    });

    const inner = createSvgElement("polygon", {
      class: "house-control-pad__room-core",
      points: vertexString(innerVertices),
      fill: "url(#houseRoomCoreGradient)",
      stroke: "rgba(141,216,255,.34)",
      "stroke-width": "2"
    });

    group.append(outer);

    for (
      let facetIndex = 0;
      facetIndex < outerVertices.length;
      facetIndex += 1
    ) {
      const current = outerVertices[facetIndex];
      const next =
        outerVertices[
          (facetIndex + 1) %
          outerVertices.length
        ];

      group.append(
        createSvgElement("polygon", {
          class: "house-control-pad__room-facet",
          points: [
            `${room.marker.x},${room.marker.y}`,
            `${current.x},${current.y}`,
            `${next.x},${next.y}`
          ].join(" "),
          fill:
            facetIndex % 3 === 0
              ? "rgba(255,255,255,.12)"
              : facetIndex % 3 === 1
                ? "rgba(36,120,255,.08)"
                : "rgba(243,200,111,.07)"
        })
      );
    }

    const node = createSvgElement("circle", {
      class: "house-control-pad__room-node",
      cx: String(room.marker.x),
      cy: String(room.marker.y),
      r: "8",
      fill: "rgba(255,232,163,.88)",
      stroke: "rgba(255,255,255,.76)",
      "stroke-width": "2"
    });

    group.append(
      inner,
      node
    );

    return group;
  }

  function createRoomMarker(room, index) {
    const marker = createElement("button", {
      className:
        "house-control-pad__marker house-control-pad__marker--room",
      attributes: {
        type: "button",
        "data-house-room": "",
        "data-house-room-id": room.id,
        "data-house-room-order": String(room.order),
        "aria-label": room.label,
        "aria-pressed": "false",
        "aria-controls": "house-control-pad-details"
      }
    });

    marker.style.setProperty(
      "--house-marker-x",
      percentageX(room.marker.x)
    );

    marker.style.setProperty(
      "--house-marker-y",
      percentageY(room.marker.y)
    );

    marker.style.setProperty(
      "--house-room-index",
      String(index)
    );

    const number = createElement("span", {
      className:
        "house-control-pad__marker-number",
      text: String(room.order)
    });

    const label = createElement("span", {
      className:
        "house-control-pad__marker-label",
      text: room.shortLabel
    });

    marker.append(
      number,
      label
    );

    return marker;
  }

  function renderGuideDetails() {
    if (!state.detailsPanel) {
      return;
    }

    state.selectedRoomId = "";
    syncSelection();
    clearElement(state.detailsPanel);

    const eyebrow = createElement("p", {
      className:
        "house-control-pad__details-eyebrow",
      text: "Nine-room estate"
    });

    const title = createElement("h3", {
      className:
        "house-control-pad__details-title",
      text: ESTATE.guide.label
    });

    const description = createElement("p", {
      className:
        "house-control-pad__details-description",
      text: ESTATE.guide.description
    });

    const count = createElement("p", {
      className:
        "house-control-pad__details-count",
      text: `${ESTATE.rooms.length} primary rooms`
    });

    state.detailsPanel.append(
      eyebrow,
      title,
      description,
      count
    );
  }

  function renderRoomDetails(room) {
    if (!state.detailsPanel) {
      return;
    }

    clearElement(state.detailsPanel);

    const eyebrow = createElement("p", {
      className:
        "house-control-pad__details-eyebrow",
      text: room.category
    });

    const title = createElement("h3", {
      className:
        "house-control-pad__details-title",
      text: room.label
    });

    const description = createElement("p", {
      className:
        "house-control-pad__details-description",
      text: room.description
    });

    const routeButton = createElement("button", {
      className: "house-control-pad__route",
      text: `Enter ${room.shortLabel}`,
      attributes: {
        type: "button",
        "data-house-route": "",
        "data-house-room-id": room.id
      }
    });

    state.detailsPanel.append(
      eyebrow,
      title,
      description,
      routeButton
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
      SELECTORS.open
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

    const opened = open({
      door,
      context:
        safeString(
          door.dataset.houseContext,
          200
        )
    });

    if (
      opened.ok &&
      state.open
    ) {
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

    if (
      state.backdrop &&
      event.target === state.backdrop
    ) {
      close("backdrop");
      return;
    }

    const guideControl = closestElement(
      event.target,
      SELECTORS.guide
    );

    if (guideControl) {
      event.preventDefault();

      renderGuideDetails();
      updateStatus("House Guide overview.");

      return;
    }

    const routeControl = closestElement(
      event.target,
      SELECTORS.route
    );

    if (routeControl) {
      event.preventDefault();

      routeTo({
        roomId:
          routeControl.dataset.houseRoomId
      });

      return;
    }

    const roomControl = closestElement(
      event.target,
      SELECTORS.room
    );

    if (!roomControl) {
      return;
    }

    event.preventDefault();

    selectRoom(
      roomControl.dataset.houseRoomId
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
      const activeMarker = closestElement(
        document.activeElement,
        `${SELECTORS.room}, ${SELECTORS.guide}`
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

    focusInitialElement();
  }

  function syncSelection() {
    if (!state.root) {
      return;
    }

    state.root.dataset.houseSelectedRoom =
      state.selectedRoomId;

    state.root
      .querySelectorAll(SELECTORS.room)
      .forEach((marker) => {
        const selected =
          marker.dataset.houseRoomId ===
          state.selectedRoomId;

        marker.setAttribute(
          "aria-pressed",
          selected ? "true" : "false"
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
      });

    state.root
      .querySelectorAll(
        "[data-house-room-gem]"
      )
      .forEach((gem) => {
        const selected =
          gem.dataset.houseRoomId ===
          state.selectedRoomId;

        gem.dataset.houseSelected =
          selected ? "true" : "false";
      });

    state.root
      .querySelectorAll(
        "[data-house-room-shape]"
      )
      .forEach((shape) => {
        const selected =
          shape.dataset.houseRoomId ===
          state.selectedRoomId;

        shape.dataset.houseSelected =
          selected ? "true" : "false";
      });
  }

  function focusInitialElement() {
    const target =
      state.selectedRoomId
        ? getSelectedMarker()
        : state.guideButton ||
          state.closeButton ||
          state.dialog;

    if (!target) {
      return;
    }

    try {
      target.focus({
        preventScroll: true
      });
    } catch (_error) {
      target.focus();
    }
  }

  function focusSelectedMarker() {
    const marker = getSelectedMarker();

    if (!marker) {
      return;
    }

    try {
      marker.focus({
        preventScroll: true
      });
    } catch (_error) {
      marker.focus();
    }
  }

  function getSelectedMarker() {
    if (
      !state.markersLayer ||
      !state.selectedRoomId
    ) {
      return null;
    }

    return state.markersLayer.querySelector(
      `[data-house-room-id="${cssEscape(
        state.selectedRoomId
      )}"]`
    );
  }

  function trapFocus(event) {
    const focusable = getFocusableElements(
      state.dialog
    );

    if (!focusable.length) {
      event.preventDefault();
      state.dialog.focus();
      return;
    }

    const first = focusable[0];
    const last =
      focusable[
        focusable.length - 1
      ];

    const active = document.activeElement;

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

    const markers = Array.from(
      state.markersLayer.querySelectorAll(
        `${SELECTORS.room}, ${SELECTORS.guide}`
      )
    ).filter(isFocusable);

    if (!markers.length) {
      return;
    }

    const currentIndex =
      markers.indexOf(activeMarker);

    if (currentIndex < 0) {
      return;
    }

    let nextIndex = currentIndex;

    if (
      event.key === "ArrowRight" ||
      event.key === "ArrowDown"
    ) {
      nextIndex =
        (currentIndex + 1) %
        markers.length;
    } else if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowUp"
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

    markers[nextIndex].focus({
      preventScroll: true
    });
  }

  function normalizeOpenRequest(request) {
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
            door.dataset.houseContext,
          200
        )
    };
  }

  function normalizeRouteRequest(request) {
    const roomId =
      typeof request === "string"
        ? safeIdentifier(request)
        : request &&
            typeof request === "object"
          ? safeIdentifier(
              request.roomId ||
              request.id
            )
          : "";

    if (!roomId) {
      return result(
        false,
        state.lifecycle,
        "A valid estate room is required."
      );
    }

    const room = findRoom(roomId);

    if (!room) {
      return result(
        false,
        state.lifecycle,
        "The requested estate room does not exist."
      );
    }

    const route = validateInternalRoute(
      room.route
    );

    if (!route) {
      return result(
        false,
        state.lifecycle,
        "The requested estate route is invalid."
      );
    }

    return {
      ok: true,
      room,
      route
    };
  }

  function findRoom(roomId) {
    return (
      ESTATE.rooms.find(
        (room) =>
          room.id === roomId
      ) ||
      null
    );
  }

  function validateEstate(estate) {
    if (
      !estate ||
      !Array.isArray(estate.rooms)
    ) {
      throw new Error(
        "The estate registry is unavailable."
      );
    }

    if (estate.rooms.length !== 9) {
      throw new Error(
        "The estate registry must contain exactly nine rooms."
      );
    }

    const ids = new Set();
    const routes = new Set();

    estate.rooms.forEach((room, index) => {
      if (
        !safeIdentifier(room.id)
      ) {
        throw new Error(
          `Invalid room id at index ${index}.`
        );
      }

      if (ids.has(room.id)) {
        throw new Error(
          `Duplicate room id: ${room.id}`
        );
      }

      ids.add(room.id);

      if (
        !safeString(room.label, 200)
      ) {
        throw new Error(
          `Missing room label: ${room.id}`
        );
      }

      const route =
        validateInternalRoute(room.route);

      if (!route) {
        throw new Error(
          `Invalid room route: ${room.id}`
        );
      }

      if (routes.has(route)) {
        throw new Error(
          `Duplicate room route: ${route}`
        );
      }

      routes.add(route);

      if (
        !room.marker ||
        !Number.isFinite(room.marker.x) ||
        !Number.isFinite(room.marker.y)
      ) {
        throw new Error(
          `Invalid room position: ${room.id}`
        );
      }
    });
  }

  function validateInternalRoute(rawRoute) {
    const route = safeString(
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

  function resolveReturnFocusTarget(door) {
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
      document.activeElement.isConnected
    ) {
      return document.activeElement;
    }

    return null;
  }

  function restoreFocus() {
    const target =
      state.returnFocusTarget;

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

    const firstDoor =
      document.querySelector(
        SELECTORS.open
      );

    if (
      firstDoor &&
      isFocusable(firstDoor)
    ) {
      try {
        firstDoor.focus({
          preventScroll: true
        });
      } catch (_error) {
        firstDoor.focus();
      }
    }
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
    ).forEach((element) => {
      if (element === state.root) {
        return;
      }

      const record = {
        element,
        inertSupported:
          "inert" in element,
        inertValue:
          "inert" in element
            ? Boolean(element.inert)
            : false,
        ariaHidden:
          element.getAttribute(
            "aria-hidden"
          )
      };

      state.backgroundRecords.push(record);

      if (record.inertSupported) {
        element.inert = true;
      } else {
        element.setAttribute(
          "aria-hidden",
          "true"
        );
      }
    });
  }

  function restoreBackgroundCustody() {
    state.backgroundRecords.forEach(
      (record) => {
        const element = record.element;

        if (
          !element ||
          !element.isConnected
        ) {
          return;
        }

        if (record.inertSupported) {
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
      html.dataset.houseScrollLock ===
        "true"
    ) {
      return;
    }

    html.dataset.housePreviousOverflow =
      html.style.overflow || "";

    body.dataset.housePreviousOverflow =
      body.style.overflow || "";

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    html.dataset.houseScrollLock =
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
      html.dataset.houseScrollLock !==
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

  function transitionTo(
    nextState,
    force
  ) {
    if (
      state.lifecycle ===
        STATES.destroyed &&
      !force
    ) {
      return false;
    }

    const previous =
      state.lifecycle;

    state.previousLifecycle =
      previous;

    state.lifecycle =
      nextState;

    state.updatedAt =
      nowIso();

    if (state.root) {
      state.root.dataset.houseState =
        nextState;

      state.root.dataset.houseReady =
        state.ready
          ? "true"
          : "false";

      state.root.dataset.houseOpen =
        state.open
          ? "true"
          : "false";
    }

    dispatch(EVENTS.state, {
      reason: "state-transition",
      previousState: previous,
      nextState
    });

    return true;
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

  function dispatch(
    eventName,
    extraDetail,
    options
  ) {
    const detail = Object.freeze({
      contract: CONTRACT,
      state: state.lifecycle,
      previousState:
        state.previousLifecycle,
      roomCount: ESTATE.rooms.length,
      selectedRoomId:
        state.selectedRoomId,
      context: state.activeContext,
      timestamp: nowIso(),
      ...clonePlain(
        extraDetail ||
        {}
      )
    });

    const event = new CustomEvent(
      eventName,
      {
        detail,
        bubbles: false,
        cancelable: Boolean(
          options &&
          options.cancelable
        ),
        composed: false
      }
    );

    document.dispatchEvent(event);

    return event;
  }

  function buildStatus() {
    return {
      contract: CONTRACT,
      state: state.lifecycle,
      previousState:
        state.previousLifecycle,
      initialized:
        state.initialized,
      ready: state.ready,
      mounted: Boolean(
        state.root &&
        state.root.isConnected
      ),
      open: state.open,
      destroyed:
        state.destroyed,
      roomCount:
        ESTATE.rooms.length,
      selectedRoomId:
        state.selectedRoomId,
      activeContext:
        state.activeContext,
      doorCount:
        document.querySelectorAll(
          SELECTORS.open
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
      updatedAt:
        state.updatedAt
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

    state.listeners.push({
      target,
      type,
      handler,
      options
    });
  }

  function removeAllListeners() {
    state.listeners.forEach((record) => {
      try {
        record.target.removeEventListener(
          record.type,
          record.handler,
          record.options
        );
      } catch (_error) {
        // Continue removing listeners.
      }
    });

    state.listeners = [];
  }

  function clearCloseTimer() {
    if (state.closeTimer === null) {
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
      door.hasAttribute("disabled") ||
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
      door.hasAttribute("download")
    ) {
      return false;
    }

    const target = safeString(
      door.getAttribute("target"),
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

  function getFocusableElements(container) {
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
      element.hasAttribute("disabled") ||
      element.getAttribute(
        "aria-hidden"
      ) === "true"
    ) {
      return false;
    }

    const style =
      global.getComputedStyle(element);

    return (
      style.display !== "none" &&
      style.visibility !== "hidden"
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
      ? element.closest(selector)
      : null;
  }

  function createElement(
    tagName,
    config
  ) {
    const element =
      document.createElement(tagName);

    const source = config || {};

    if (source.className) {
      element.className =
        source.className;
    }

    if (
      source.text !== undefined
    ) {
      element.textContent =
        safeString(
          source.text,
          4000
        );
    }

    if (
      source.attributes &&
      typeof source.attributes ===
        "object"
    ) {
      Object.entries(
        source.attributes
      ).forEach(([name, value]) => {
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
      });
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
      Object.entries(attributes).forEach(
        ([name, value]) => {
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

    while (element.firstChild) {
      element.removeChild(
        element.firstChild
      );
    }
  }

  function removeExistingRoots() {
    document
      .querySelectorAll(
        SELECTORS.root
      )
      .forEach((root) => {
        if (root.parentNode) {
          root.parentNode.removeChild(root);
        }
      });
  }

  function polygonVertexList(
    centerX,
    centerY,
    radius,
    sides,
    rotation
  ) {
    const vertices = [];

    for (
      let index = 0;
      index < sides;
      index += 1
    ) {
      const angle =
        rotation +
        (
          Math.PI *
          2 *
          index
        ) /
          sides;

      vertices.push({
        x:
          centerX +
          Math.cos(angle) *
            radius,
        y:
          centerY +
          Math.sin(angle) *
            radius
      });
    }

    return vertices;
  }

  function polygonPoints(
    centerX,
    centerY,
    radius,
    sides,
    rotation
  ) {
    return vertexString(
      polygonVertexList(
        centerX,
        centerY,
        radius,
        sides,
        rotation
      )
    );
  }

  function vertexString(vertices) {
    return vertices
      .map(
        (vertex) =>
          `${vertex.x.toFixed(2)},${vertex.y.toFixed(2)}`
      )
      .join(" ");
  }

  function percentageX(value) {
    return `${
      (
        (
          value -
          ESTATE.viewBox.minX
        ) /
        ESTATE.viewBox.width
      ) *
      100
    }%`;
  }

  function percentageY(value) {
    return `${
      (
        (
          value -
          ESTATE.viewBox.minY
        ) /
        ESTATE.viewBox.height
      ) *
      100
    }%`;
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
        Number.isFinite(maxLength)
          ? maxLength
          : 2000
      );
  }

  function safeIdentifier(value) {
    const candidate = safeString(
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
        state.lifecycle,
      reason: safeString(
        reason,
        1000
      ),
      roomId: "",
      route: "",
      error: null,
      ...clonePlain(extra || {})
    });
  }

  function clonePlain(value, seen) {
    if (
      value === null ||
      typeof value !== "object"
    ) {
      return value;
    }

    const memory =
      seen ||
      new WeakMap();

    if (memory.has(value)) {
      return "[Circular]";
    }

    memory.set(value, true);

    if (Array.isArray(value)) {
      return value.map((entry) =>
        clonePlain(entry, memory)
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

    Object.entries(value).forEach(
      ([key, entry]) => {
        const cloned =
          clonePlain(
            entry,
            memory
          );

        if (cloned !== undefined) {
          output[key] = cloned;
        }
      }
    );

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

    const memory =
      seen ||
      new WeakSet();

    if (memory.has(value)) {
      return value;
    }

    memory.add(value);

    Object.values(value).forEach(
      (entry) => {
        deepFreeze(entry, memory);
      }
    );

    return Object.freeze(value);
  }

  function cssEscape(value) {
    if (
      global.CSS &&
      typeof global.CSS.escape ===
        "function"
    ) {
      return global.CSS.escape(value);
    }

    return String(value).replace(
      /[^A-Za-z0-9_-]/g,
      (character) =>
        `\\${character}`
    );
  }

  function nowIso() {
    return new Date().toISOString();
  }
})(window, document);

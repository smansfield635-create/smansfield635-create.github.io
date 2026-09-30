// /assets/house-control-pad/house.control-pad.js
// HOUSE_CONTROL_PAD_NINE_ROOM_HEART_GEM_RUNTIME_TNT_v3
// Full-file replacement.
// Complete runtime authority for the nine-room Heart Estate map.

(function houseControlPadNineRoomHeartRuntime(global, document) {
  "use strict";

  if (!global || !document) {
    return;
  }

  const CONTRACT =
    "HOUSE_CONTROL_PAD_NINE_ROOM_HEART_GEM_RUNTIME_TNT_v3";

  const PUBLIC_GLOBAL = "HOUSE_CONTROL_PAD";
  const STATUS_GLOBAL = "__HOUSE_CONTROL_PAD_STATUS__";
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

  const HEART_PATH = [
    "M 600 830",
    "C 555 790 500 750 440 710",
    "C 300 616 180 520 150 360",
    "C 122 210 215 105 345 98",
    "C 462 92 553 165 600 256",
    "C 647 165 738 92 855 98",
    "C 985 105 1078 210 1050 360",
    "C 1020 520 900 616 760 710",
    "C 700 750 645 790 600 830",
    "Z"
  ].join(" ");

  const HEART_INNER_PATH = [
    "M 600 760",
    "C 557 723 511 690 461 657",
    "C 343 579 244 493 220 370",
    "C 199 261 269 180 368 174",
    "C 458 169 535 226 600 337",
    "C 665 226 742 169 832 174",
    "C 931 180 1001 261 980 370",
    "C 956 493 857 579 739 657",
    "C 689 690 643 723 600 760",
    "Z"
  ].join(" ");

  const HEART_BOUNDARY_POINTS = deepFreeze([
    { x: 600, y: 830 },
    { x: 475, y: 700 },
    { x: 340, y: 545 },
    { x: 240, y: 370 },
    { x: 360, y: 220 },
    { x: 480, y: 165 },
    { x: 600, y: 256 },
    { x: 720, y: 165 },
    { x: 840, y: 220 },
    { x: 960, y: 370 },
    { x: 860, y: 545 },
    { x: 725, y: 700 }
  ]);

  const ESTATE = deepFreeze({
    id: "diamond-gate-nine-room-heart-estate",
    shape: "heart",
    eyebrow: "Diamond Gate Bridge",
    label: "The House Map",
    description:
      "Nine primary rooms form the Heart Estate. Select a room gem to preview its purpose and enter its route.",

    viewBox: {
      minX: 0,
      minY: 0,
      width: 1200,
      height: 900
    },

    center: {
      x: 600,
      y: 495
    },

    heart: {
      outerPath: HEART_PATH,
      innerPath: HEART_INNER_PATH,
      boundaryPoints: HEART_BOUNDARY_POINTS
    },

    guide: {
      id: "house-guide",
      label: "House Guide",
      shortLabel: "Guide",
      description:
        "The living center of the Heart Estate. Use the guide to reset the map and review the complete nine-room structure.",
      marker: {
        x: 600,
        y: 495
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
          y: 292
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
          x: 360,
          y: 220
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
          x: 960,
          y: 370
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
          x: 860,
          y: 545
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
          x: 725,
          y: 700
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
          x: 475,
          y: 700
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
          x: 340,
          y: 545
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
          x: 240,
          y: 370
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
          x: 840,
          y: 220
        }
      }
    ]
  });

  validateEstate(ESTATE);

  const priorController = global[PUBLIC_GLOBAL];

  if (priorController && typeof priorController.destroy === "function") {
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
    estateShape: ESTATE.shape,

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
  publishStatus();
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
        { once: true }
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

    if (state.initialized && state.root && state.root.isConnected) {
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
      state.mounted = Boolean(state.root && state.root.isConnected);
      state.initializedAt = state.initializedAt || nowIso();

      transitionTo(STATES.ready);
      updateStatus("Nine-room Heart Estate ready.");

      dispatch(EVENTS.ready, {
        reason: "initialization-complete",
        roomCount: ESTATE.rooms.length,
        estateShape: ESTATE.shape
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

    if (!state.root || !state.dialog) {
      return result(
        false,
        STATES.failed,
        "The House Map overlay is unavailable."
      );
    }

    const normalized = normalizeOpenRequest(request);

    if (state.open) {
      state.activeDoor = normalized.door || state.activeDoor;
      state.activeContext = normalized.context || state.activeContext;

      publishStatus();

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
    state.returnFocusTarget = resolveReturnFocusTarget(normalized.door);

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

      updateStatus("Nine-room Heart Estate open.");
      focusInitialElement();

      dispatch(EVENTS.open, {
        reason: "open-complete",
        context: state.activeContext,
        roomCount: ESTATE.rooms.length,
        estateShape: ESTATE.shape
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

      if (state.destroyed || !state.root) {
        return;
      }

      state.root.hidden = true;
      state.root.setAttribute("aria-hidden", "true");

      transitionTo(STATES.closed);

      state.closeCount += 1;
      state.closedAt = nowIso();

      updateStatus("Nine-room Heart Estate closed.");
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

    if (!options || options.silent !== true) {
      updateStatus(`${room.label} selected.`);

      dispatch(EVENTS.select, {
        reason: "room-selection",
        roomId: room.id,
        roomLabel: room.label,
        route: room.route
      });
    }

    if (options && options.focus === true) {
      focusSelectedMarker();
    }

    publishStatus();

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
      estateShape: ESTATE.shape,
      roomCount: ESTATE.rooms.length,
      rooms: ESTATE.rooms.map((room) => ({
        id: room.id,
        order: room.order,
        label: room.label,
        shortLabel: room.shortLabel,
        category: room.category,
        description: room.description,
        route: room.route,
        marker: {
          x: room.marker.x,
          y: room.marker.y
        }
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
        shape: ESTATE.shape,
        roomCount: ESTATE.rooms.length,
        viewBox: clonePlain(ESTATE.viewBox)
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

    if (global[PUBLIC_GLOBAL] === controller) {
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
        "data-house-room-count": String(ESTATE.rooms.length),
        "data-house-selected-room": "",
        "data-house-context": "",
        "data-house-estate-shape": ESTATE.shape,
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
      text: "Nine-room Heart Estate ready.",
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
        "data-house-heart-estate": "true",
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
      text: "Nine rooms · one Heart Estate"
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
    if (!state.svg || !state.markersLayer) {
      throw new Error(
        "The House Map rendering surface is unavailable."
      );
    }

    clearElement(state.svg);
    clearElement(state.markersLayer);

    const defs = createSvgElement("defs");

    const heartClip = createSvgElement("clipPath", {
      id: "houseHeartClip"
    });

    heartClip.append(
      createSvgElement("path", {
        d: ESTATE.heart.outerPath
      })
    );

    const estateGradient = createSvgElement(
      "radialGradient",
      {
        id: "houseHeartEstateGradient",
        cx: "50%",
        cy: "45%",
        r: "72%"
      }
    );

    estateGradient.append(
      createSvgElement("stop", {
        offset: "0%",
        "stop-color": "#174687",
        "stop-opacity": ".52"
      }),
      createSvgElement("stop", {
        offset: "43%",
        "stop-color": "#071a38",
        "stop-opacity": ".78"
      }),
      createSvgElement("stop", {
        offset: "100%",
        "stop-color": "#01040d",
        "stop-opacity": ".99"
      })
    );

    const innerHeartGradient = createSvgElement(
      "linearGradient",
      {
        id: "houseHeartInnerGradient",
        x1: "0%",
        y1: "0%",
        x2: "100%",
        y2: "100%"
      }
    );

    innerHeartGradient.append(
      createSvgElement("stop", {
        offset: "0%",
        "stop-color": "#d7f4ff",
        "stop-opacity": ".14"
      }),
      createSvgElement("stop", {
        offset: "42%",
        "stop-color": "#2478ff",
        "stop-opacity": ".10"
      }),
      createSvgElement("stop", {
        offset: "100%",
        "stop-color": "#f3c86f",
        "stop-opacity": ".12"
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
      heartClip,
      estateGradient,
      innerHeartGradient,
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

    const heartShell = createSvgElement("path", {
      class:
        "house-control-pad__estate-shape house-control-pad__heart-shape",
      "data-house-heart-shell": "",
      d: ESTATE.heart.outerPath,
      fill: "url(#houseHeartEstateGradient)",
      stroke: "rgba(243,200,111,.55)",
      "stroke-width": "5",
      filter: "url(#houseEstateGlow)"
    });

    const heartInner = createSvgElement("path", {
      class: "house-control-pad__heart-inner",
      "data-house-heart-inner": "",
      d: ESTATE.heart.innerPath,
      fill: "url(#houseHeartInnerGradient)",
      stroke: "rgba(141,216,255,.24)",
      "stroke-width": "2.5",
      "stroke-dasharray": "9 14"
    });

    const clippedField = createSvgElement("g", {
      class: "house-control-pad__heart-field",
      "clip-path": "url(#houseHeartClip)"
    });

    const heartFacets = createSvgElement("g", {
      class: "house-control-pad__heart-facets",
      "data-house-heart-facets": ""
    });

    ESTATE.heart.boundaryPoints.forEach(
      (point, index, points) => {
        const nextPoint =
          points[
            (index + 1) %
            points.length
          ];

        heartFacets.append(
          createSvgElement("polygon", {
            class: "house-control-pad__heart-facet",
            "data-house-heart-facet": String(index + 1),
            points: [
              `${ESTATE.center.x},${ESTATE.center.y}`,
              `${point.x},${point.y}`,
              `${nextPoint.x},${nextPoint.y}`
            ].join(" "),
            fill: facetFallbackFill(index)
          })
        );
      }
    );

    const heartSeams = createSvgElement("g", {
      class: "house-control-pad__heart-seams",
      "data-house-heart-seams": ""
    });

    ESTATE.heart.boundaryPoints.forEach(
      (point, index) => {
        heartSeams.append(
          createSvgElement("line", {
            class: "house-control-pad__heart-seam",
            "data-house-heart-seam": String(index + 1),
            x1: String(ESTATE.center.x),
            y1: String(ESTATE.center.y),
            x2: String(point.x),
            y2: String(point.y)
          })
        );
      }
    );

    const heartPulse = createSvgElement("path", {
      class: "house-control-pad__heart-pulse",
      "data-house-heart-pulse": "",
      d: ESTATE.heart.innerPath,
      fill: "none",
      stroke: "rgba(99,239,255,.25)",
      "stroke-width": "3",
      "stroke-dasharray": "6 18"
    });

    clippedField.append(
      heartFacets,
      heartSeams,
      heartPulse
    );

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
        createSvgElement("path", {
          class:
            "house-control-pad__corridor house-control-pad__corridor--spoke",
          "data-house-corridor": "",
          "data-house-corridor-room": room.id,
          d: curvedConnectionPath(
            ESTATE.center,
            room.marker,
            index % 2 === 0 ? 24 : -24
          )
        }),
        createSvgElement("path", {
          class:
            "house-control-pad__corridor house-control-pad__corridor--ring",
          "data-house-ring-link": "",
          "data-house-ring-from": room.id,
          "data-house-ring-to": nextRoom.id,
          d: curvedConnectionPath(
            room.marker,
            nextRoom.marker,
            index % 2 === 0 ? -18 : 18
          )
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
      r: "92",
      fill: "rgba(36,120,255,.10)",
      stroke: "rgba(243,200,111,.35)",
      "stroke-width": "2.5",
      "stroke-dasharray": "5 9"
    });

    const centerHeart = createSvgElement("path", {
      class: "house-control-pad__heart-core",
      "data-house-heart-core": "",
      d: smallHeartPath(
        ESTATE.center.x,
        ESTATE.center.y,
        58
      ),
      fill: "rgba(243,200,111,.13)",
      stroke: "rgba(255,232,163,.48)",
      "stroke-width": "2"
    });

    const centerDiamond = createSvgElement("path", {
      class: "house-control-pad__guide-diamond",
      d: [
        `M ${ESTATE.center.x} ${ESTATE.center.y - 54}`,
        `L ${ESTATE.center.x + 54} ${ESTATE.center.y}`,
        `L ${ESTATE.center.x} ${ESTATE.center.y + 54}`,
        `L ${ESTATE.center.x - 54} ${ESTATE.center.y}`,
        "Z"
      ].join(" "),
      fill: "url(#houseRoomCoreGradient)",
      stroke: "rgba(255,232,163,.76)",
      "stroke-width": "3",
      filter: "url(#houseEstateGlow)"
    });

    state.svg.append(
      defs,
      background,
      heartShell,
      clippedField,
      heartInner,
      network,
      roomsGroup,
      centerHalo,
      centerHeart,
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
        className: "house-control-pad__marker-label",
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
      70,
      8,
      Math.PI / 8
    );

    const innerVertices = polygonVertexList(
      room.marker.x,
      room.marker.y,
      46,
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
      const current =
        outerVertices[facetIndex];

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
      className: "house-control-pad__marker-number",
      text: String(room.order)
    });

    const label = createElement("span", {
      className: "house-control-pad__marker-label",
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
      className: "house-control-pad__details-eyebrow",
      text: "Nine-room Heart Estate"
    });

    const title = createElement("h3", {
      className: "house-control-pad__details-title",
      text: ESTATE.guide.label
    });

    const description = createElement("p", {
      className: "house-control-pad__details-description",
      text: ESTATE.guide.description
    });

    const count = createElement("p", {
      className: "house-control-pad__details-count",
      text: `${ESTATE.rooms.length} primary rooms`
    });

    state.detailsPanel.append(
      eyebrow,
      title,
      description,
      count
    );

    publishStatus();
  }

  function renderRoomDetails(room) {
    if (!state.detailsPanel) {
      return;
    }

    clearElement(state.detailsPanel);

    const eyebrow = createElement("p", {
      className: "house-control-pad__details-eyebrow",
      text: room.category
    });

    const title = createElement("h3", {
      className: "house-control-pad__details-title",
      text: room.label
    });

    const description = createElement("p", {
      className: "house-control-pad__details-description",
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

    if (
      !door ||
      !isEligibleDoorActivation(event, door)
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
    const focusable =
      getFocusableElements(state.dialog);

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

    let nextIndex =
      currentIndex;

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

    const room =
      findRoom(roomId);

    if (!room) {
      return result(
        false,
        state.lifecycle,
        "The requested estate room does not exist."
      );
    }

    const route =
      validateInternalRoute(room.route);

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

    if (
      estate.shape !== "heart"
    ) {
      throw new Error(
        "The estate registry must declare the heart shape."
      );
    }

    if (
      !safeString(
        estate.heart &&
          estate.heart.outerPath,
        20000
      )
    ) {
      throw new Error(
        "The Heart Estate path is unavailable."
      );
    }

    if (
      estate.rooms.length !== 9
    ) {
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

      if (
        ids.has(room.id)
      ) {
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

      if (
        routes.has(route)
      ) {
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
    const route =
      safeString(rawRoute, 2000);

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
        const element =
          record.element;

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
      html.dataset.housePreviousOverflow ||
      "";

    body.style.overflow =
      body.dataset.housePreviousOverflow ||
      "";

    delete html.dataset.housePreviousOverflow;
    delete body.dataset.housePreviousOverflow;
    delete html.dataset.houseScrollLock;
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

    publishStatus();

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

    publishStatus();
  }

  function publishStatus() {
    const snapshot =
      Object.freeze(buildStatus());

    try {
      global[STATUS_GLOBAL] =
        snapshot;
    } catch (_error) {
      // Public status publication is non-blocking.
    }

    return snapshot;
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
      estateShape:
        ESTATE.shape,
      roomCount:
        ESTATE.rooms.length,
      selectedRoomId:
        state.selectedRoomId,
      context:
        state.activeContext,
      timestamp:
        nowIso(),
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
      state:
        state.lifecycle,
      previousState:
        state.previousLifecycle,
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
      estateShape:
        ESTATE.shape,
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
    if (
      state.closeTimer === null
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

    const target =
      safeString(
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

    const source =
      config || {};

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

  function curvedConnectionPath(
    start,
    end,
    bend
  ) {
    const dx =
      end.x - start.x;

    const dy =
      end.y - start.y;

    const length =
      Math.hypot(dx, dy) || 1;

    const perpendicularX =
      -dy / length;

    const perpendicularY =
      dx / length;

    const controlX =
      (start.x + end.x) / 2 +
      perpendicularX * bend;

    const controlY =
      (start.y + end.y) / 2 +
      perpendicularY * bend;

    return [
      `M ${start.x} ${start.y}`,
      `Q ${controlX.toFixed(2)} ${controlY.toFixed(2)} ${end.x} ${end.y}`
    ].join(" ");
  }

  function smallHeartPath(
    centerX,
    centerY,
    size
  ) {
    const top =
      centerY - size * 0.35;

    const bottom =
      centerY + size;

    const left =
      centerX - size;

    const right =
      centerX + size;

    const notch =
      centerY - size * 0.08;

    return [
      `M ${centerX} ${bottom}`,
      `C ${centerX - size * 0.28} ${centerY + size * 0.72}`,
      `${left} ${centerY + size * 0.2}`,
      `${left} ${centerY - size * 0.22}`,
      `C ${left} ${top}`,
      `${centerX - size * 0.18} ${top}`,
      `${centerX} ${notch}`,
      `C ${centerX + size * 0.18} ${top}`,
      `${right} ${top}`,
      `${right} ${centerY - size * 0.22}`,
      `C ${right} ${centerY + size * 0.2}`,
      `${centerX + size * 0.28} ${centerY + size * 0.72}`,
      `${centerX} ${bottom}`,
      "Z"
    ].join(" ");
  }

  function facetFallbackFill(index) {
    const fills = [
      "rgba(255,255,255,.055)",
      "rgba(36,120,255,.055)",
      "rgba(99,239,255,.038)",
      "rgba(243,200,111,.044)"
    ];

    return (
      fills[
        index %
        fills.length
      ]
    );
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
    if (error instanceof Error) {
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
      ok:
        Boolean(ok),
      state:
        resultState ||
        state.lifecycle,
      reason:
        safeString(reason, 1000),
      roomId: "",
      route: "",
      error: null,
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
      typeof value !== "object"
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
      return value.map((entry) =>
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

    Object.entries(value).forEach(
      ([key, entry]) => {
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
      typeof value !== "object" ||
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

    Object.values(value).forEach(
      (entry) => {
        deepFreeze(
          entry,
          memory
        );
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
      (character) => {
        return `\\${character}`;
      }
    );
  }

  function nowIso() {
    return new Date().toISOString();
  }
})(window, document);

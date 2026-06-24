// /assets/compass/compass.controller.js
// DGB_COMPASS_CONTROLLER_ARCHITECTURE_v1
// FULL-FILE
// Compass Authority + Runtime Controller.
// Owns: authority model, wing membership, routes, selection, expansion, room panel, navigation.
// Does not own: WebGL rendering, crystals, page styling, room content, Map Portal implementation.

(() => {
  "use strict";

  if (typeof window === "undefined" || typeof document === "undefined") return;

  const CONTRACT = "DGB_COMPASS_CONTROLLER_ARCHITECTURE_v1";
  const FILE = "/assets/compass/compass.controller.js";
  const GLOBAL = "DGBCompassController";

  const ROUTE_MIRRORLAND = "/showroom/";

  const MODEL = Object.freeze({
    core: Object.freeze({
      id: "mirrorland",
      label: "Mirrorland",
      route: ROUTE_MIRRORLAND,
      role: "estate-core",
      behavior: "navigate"
    }),

    primaryActions: Object.freeze([
      Object.freeze({
        id: "coherence-diagnostic",
        label: "Coherence Diagnostic",
        route: "/coherence-diagnostic/",
        description: "Open the immediate public diagnostic assessment."
      }),
      Object.freeze({
        id: "talk-to-house",
        label: "Talk to the House",
        route: "/showroom/globe/hearth/jeeves/",
        description: "Speak with Jeeves and learn how to move through the estate."
      })
    ]),

    wings: Object.freeze({
      north: Object.freeze({
        id: "north",
        label: "North",
        title: "Orientation Wing",
        description: "Orientation, entry, guidance, identity, and philosophical grounding.",
        rooms: Object.freeze([
          room("compass-desk", "Compass Desk", "/", "Return to the estate navigation controller.", "The front orientation desk."),
          room("guide-desk", "Guide Desk", "/site-guide/", "Learn how the site, rooms, gems, routes, and return paths work.", "The instruction desk."),
          room("front-door", "Front Door", "/door/", "Cross the public threshold into the estate.", "The public threshold."),
          room("about-sean", "About Sean", "/about-this-underdog/", "Meet the host and mission behind Diamond Gate Bridge.", "The host portrait room."),
          room("philosophy-library", "Philosophy Library", "/nine-summits-of-love/", "Enter the philosophical book path.", "The philosophical library.")
        ])
      }),

      east: Object.freeze({
        id: "east",
        label: "East",
        title: "World Wing",
        description: "World study, planetary rooms, living environments, and Mirrorland bodies.",
        rooms: Object.freeze([
          room("atlas-study", "Atlas Study", "/showroom/globe/", "Study the estate’s worlds and planetary doors.", "The world atlas room."),
          room("zionts", "ZIONTS", "/showroom/globe/earth/", "Enter ZIONTS, pronounced Zience.", "The reference-world room."),
          room("audralia-conservatory", "Audralia Conservatory", "/showroom/globe/audralia/", "Enter Audralia as the constructive living-world path.", "The living-world conservatory."),
          room("hearth", "Hearth", "/showroom/globe/hearth/", "Study Hearth as a forming world.", "The Hearth world room."),
          room("h-earth", "H-Earth", "/showroom/globe/h-earth/", "Study the H-Earth experimental world path.", "The H-Earth annex.")
        ])
      }),

      south: Object.freeze({
        id: "south",
        label: "South",
        title: "Instrument Wing",
        description: "Measurement, law, governance, diagnostics, and controls.",
        rooms: Object.freeze([
          room("the-lab", "The Lab", "/gauges/", "Inspect status, signals, and measurement results.", "The measurement room."),
          room("law-library", "Law Library", "/laws/", "Study the rules and constraints that keep the estate coherent.", "The law room."),
          room("council-room", "Council Room", "/governance/", "Review governance, responsibility, and decision structure.", "The governance room."),
          room("control-cockpit", "Control Cockpit", "/showroom/globe/audralia/disposition/", "Operate Audralia’s control and instrument-facing view.", "The control cockpit.")
        ])
      }),

      west: Object.freeze({
        id: "west",
        label: "West",
        title: "Frontier Wing",
        description: "Applied systems, future infrastructure, and workshop benches.",
        rooms: Object.freeze([
          room("frontier-workshop-yard", "Frontier Workshop Yard", "/explore/frontier/", "Enter the applied-systems testing yard.", "The workshop yard."),
          room("energy-bench", "Energy Bench", "/explore/frontier/energy/", "Study future power, storage, solar support, plasma, and fusion constraints.", "The energy bench."),
          room("water-bench", "Water Bench", "/explore/frontier/water/", "Study capture, treatment, routing, reuse, storage, and continuity.", "The water systems bench."),
          room("infrastructure-bay", "Infrastructure Bay", "/explore/frontier/infrastructure/", "Study roads, supports, utilities, corridors, and load-bearing systems.", "The infrastructure bay."),
          room("vision-window", "Vision Window", "/explore/frontier/vision/", "Study horizon, future clarity, imagination, and long-range consequence.", "The vision window.")
        ])
      })
    })
  });

  const state = {
    mounted: false,
    activeWing: "",
    activeRoom: "",
    focused: false,
    lastAction: "loaded",
    lastNavigationTarget: "",
    updatedAt: iso()
  };

  function room(id, label, route, description, relationship) {
    return Object.freeze({ id, label, route, description, relationship });
  }

  function iso() {
    return new Date().toISOString();
  }

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function all(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function wing(id) {
    return MODEL.wings[String(id || "").toLowerCase()] || null;
  }

  function findRoom(roomId) {
    const id = String(roomId || "");
    for (const wingItem of Object.values(MODEL.wings)) {
      const found = wingItem.rooms.find((item) => item.id === id);
      if (found) return { wing: wingItem, room: found };
    }
    return null;
  }

  function setRootDataset() {
    const root = document.documentElement;
    root.dataset.compassControllerContract = CONTRACT;
    root.dataset.compassActiveWing = state.activeWing;
    root.dataset.compassActiveRoom = state.activeRoom;
    root.dataset.compassFocused = String(state.focused);
  }

  function emit(name, detail) {
    try {
      window.dispatchEvent(new CustomEvent(name, { detail }));
    } catch (_error) {}
  }

  function publish() {
    state.updatedAt = iso();
    setRootDataset();
    window.DGB_COMPASS_CONTROLLER_STATUS = getStatus();
    emit("dgb-compass-controller-state", getReceiptLight());
    return window.DGB_COMPASS_CONTROLLER_STATUS;
  }

  function selectWing(wingId) {
    const selected = wing(wingId);
    if (!selected) return false;

    state.activeWing = selected.id;
    state.activeRoom = "";
    state.focused = true;
    state.lastAction = "select-wing:" + selected.id;

    all("[data-compass-wing]").forEach((node) => {
      const id = node.getAttribute("data-compass-wing");
      node.dataset.compassSelected = String(id === selected.id);
      node.dataset.compassFaded = String(id !== selected.id);
    });

    all("[data-compass-room]").forEach((node) => {
      const belongs = node.getAttribute("data-compass-room-wing") === selected.id;
      node.hidden = !belongs;
      node.dataset.compassVisible = String(belongs);
      node.dataset.compassSelected = "false";
    });

    renderPanelNeutral(selected);
    publish();
    return true;
  }

  function selectRoom(roomId) {
    const found = findRoom(roomId);
    if (!found) return false;

    state.activeWing = found.wing.id;
    state.activeRoom = found.room.id;
    state.focused = true;
    state.lastAction = "select-room:" + found.room.id;

    all("[data-compass-room]").forEach((node) => {
      const selected = node.getAttribute("data-compass-room") === found.room.id;
      node.dataset.compassSelected = String(selected);
    });

    renderPanelRoom(found.wing, found.room);
    publish();
    return true;
  }

  function reset() {
    state.activeWing = "";
    state.activeRoom = "";
    state.focused = false;
    state.lastAction = "reset";

    all("[data-compass-wing]").forEach((node) => {
      node.dataset.compassSelected = "false";
      node.dataset.compassFaded = "false";
    });

    all("[data-compass-room]").forEach((node) => {
      node.hidden = true;
      node.dataset.compassVisible = "false";
      node.dataset.compassSelected = "false";
    });

    renderPanelInitial();
    publish();
    return true;
  }

  function navigate(route) {
    const target = String(route || "");
    if (!target) return false;

    state.lastNavigationTarget = target;
    state.lastAction = "navigate:" + target;
    publish();

    window.location.href = target;
    return true;
  }

  function renderPanelInitial() {
    const panel = $("[data-compass-room-panel]");
    if (!panel) return;

    panel.dataset.compassPanelState = "neutral";
    panel.innerHTML = `
      <p class="compass-panel__kicker">Estate Compass</p>
      <h2>Choose a wing.</h2>
      <p>Select North, East, South, or West to reveal the rooms inside that part of the estate.</p>
    `;
  }

  function renderPanelNeutral(wingItem) {
    const panel = $("[data-compass-room-panel]");
    if (!panel) return;

    panel.dataset.compassPanelState = "wing";
    panel.innerHTML = `
      <p class="compass-panel__kicker">${escapeHtml(wingItem.label)} Wing</p>
      <h2>${escapeHtml(wingItem.title)}</h2>
      <p>${escapeHtml(wingItem.description)}</p>
      <p class="compass-panel__hint">Select a room to reveal its entrance.</p>
    `;
  }

  function renderPanelRoom(wingItem, roomItem) {
    const panel = $("[data-compass-room-panel]");
    if (!panel) return;

    panel.dataset.compassPanelState = "room";
    panel.innerHTML = `
      <p class="compass-panel__kicker">${escapeHtml(wingItem.title)}</p>
      <h2>${escapeHtml(roomItem.label)}</h2>
      <p>${escapeHtml(roomItem.description)}</p>
      <p class="compass-panel__relationship">${escapeHtml(roomItem.relationship)}</p>
      <button class="compass-enter" type="button" data-compass-enter="${escapeAttr(roomItem.route)}">
        Enter Room
      </button>
    `;
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function escapeAttr(value) {
    return escapeHtml(value).replaceAll("`", "&#96;");
  }

  function bind() {
    document.addEventListener("click", (event) => {
      const primary = event.target.closest("[data-compass-primary-route]");
      if (primary) {
        event.preventDefault();
        navigate(primary.getAttribute("data-compass-primary-route"));
        return;
      }

      const core = event.target.closest("[data-compass-core]");
      if (core) {
        event.preventDefault();
        navigate(MODEL.core.route);
        return;
      }

      const wingNode = event.target.closest("[data-compass-wing]");
      if (wingNode) {
        event.preventDefault();
        selectWing(wingNode.getAttribute("data-compass-wing"));
        return;
      }

      const roomNode = event.target.closest("[data-compass-room]");
      if (roomNode) {
        event.preventDefault();
        selectRoom(roomNode.getAttribute("data-compass-room"));
        return;
      }

      const enter = event.target.closest("[data-compass-enter]");
      if (enter) {
        event.preventDefault();
        navigate(enter.getAttribute("data-compass-enter"));
        return;
      }

      const resetNode = event.target.closest("[data-compass-reset]");
      if (resetNode) {
        event.preventDefault();
        reset();
      }
    });
  }

  function mount() {
    if (state.mounted) return getStatus();

    state.mounted = true;
    state.lastAction = "mounted";

    all("[data-compass-room]").forEach((node) => {
      node.hidden = true;
      node.dataset.compassVisible = "false";
      node.dataset.compassSelected = "false";
    });

    renderPanelInitial();
    bind();
    publish();

    return getStatus();
  }

  function getStatus() {
    return {
      contract: CONTRACT,
      file: FILE,
      globalName: GLOBAL,
      mounted: state.mounted,
      activeWing: state.activeWing,
      activeRoom: state.activeRoom,
      focused: state.focused,
      lastAction: state.lastAction,
      lastNavigationTarget: state.lastNavigationTarget,
      updatedAt: state.updatedAt,
      wingCount: Object.keys(MODEL.wings).length,
      roomCount: Object.values(MODEL.wings).reduce((sum, item) => sum + item.rooms.length, 0),
      primaryActionCount: MODEL.primaryActions.length,
      mirrorlandRoute: MODEL.core.route,
      noFifthFile: true,
      diagnosticChamber: false,
      canvas2DFallback: false,
      visualPassClaimed: false
    };
  }

  function getReceiptLight() {
    const status = getStatus();

    return {
      contract: CONTRACT,
      file: FILE,
      status: status.mounted ? "READY" : "HELD",
      mounted: status.mounted,
      activeWing: status.activeWing,
      activeRoom: status.activeRoom,
      lastAction: status.lastAction,
      updatedAt: status.updatedAt,
      visualPassClaimed: false
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),
      model: MODEL,
      state: { ...state },
      status: getStatus(),
      generatedAt: iso()
    };
  }

  const API = Object.freeze({
    contract: CONTRACT,
    file: FILE,
    model: MODEL,
    mount,
    reset,
    selectWing,
    selectRoom,
    navigate,
    getStatus,
    getReceiptLight,
    getReceipt
  });

  window[GLOBAL] = API;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();

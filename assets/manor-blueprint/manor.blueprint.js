// TARGET FILE: /assets/manor-blueprint/manor.blueprint.js
// TNT FULL-FILE REPLACEMENT
// MANOR_BLUEPRINT_VALUE_CATEGORY_ESTATE_LANGUAGE_RUNTIME_TNT_v2
//
// Purpose:
// Force the Manor Blueprint Portal runtime to render visitor-facing estate
// value categories instead of the stale cardinal / wing / role / path map.
//
// Previous runtime contract:
// MANOR_BLUEPRINT_VALUE_CATEGORY_ESTATE_LANGUAGE_RUNTIME_TNT_v1
//
// Emergency correction:
// This runtime contains path-based estate-language normalization so the map
// still renders correctly even if the registry cache is stale.
//
// Owns:
// - Map / Portal blip
// - Mirrorland Doors / Main Menu / Instructions lenses
// - value-category estate room rendering
// - current-room detection
// - visible estate labels
// - hidden builder path / visible room identity separation
// - full-viewport drag
// - strong-visible joystick scroll
// - status / receipt globals
//
// Does not own:
// - CSS source file
// - registry source file
// - page body content
// - planet renderers
// - Frontier node animation
// - Gauges logic
// - generated images
// - GraphicBox

(() => {
  "use strict";

  if (typeof window === "undefined" || typeof document === "undefined") return;

  const CONTRACT = "MANOR_BLUEPRINT_VALUE_CATEGORY_ESTATE_LANGUAGE_RUNTIME_TNT_v2";
  const PREVIOUS_CONTRACT = "MANOR_BLUEPRINT_VALUE_CATEGORY_ESTATE_LANGUAGE_RUNTIME_TNT_v1";
  const PRIOR_CONTRACT = "MANOR_BLUEPRINT_MENU_CATEGORY_OWNERSHIP_RUNTIME_TNT_v1";
  const API_CONTRACT = "MANOR_BLUEPRINT_FIXED_DRAGGABLE_BUBBLE_FULLSCREEN_MAP_INSTRUCTIONS_TOGGLE_JS_TNT_v1";

  const STATUS_GLOBAL = "DGB_MANOR_BLUEPRINT_STATUS";
  const RECEIPT_GLOBAL = "DGB_MANOR_BLUEPRINT_RECEIPT";
  const API_GLOBAL = "DGB_MANOR_BLUEPRINT_API";
  const CONTROLLER_GLOBAL = "__DGB_MANOR_BLUEPRINT_MOBILE_SAFE_CONTROLLER__";

  const STORAGE_KEY = "DGB_MANOR_BLUEPRINT_BUBBLE_POSITION_v1";
  const BUBBLE_SELECTOR = "[data-dgb-blueprint-bubble]";
  const OVERLAY_SELECTOR = "[data-dgb-blueprint-overlay]";

  const TAP_MOVE_THRESHOLD = 6;
  const MIN_SCROLL_SPEED = 8;
  const MAX_SCROLL_SPEED = 56;
  const JOYSTICK_SCROLL_FORCE_MULTIPLIER = 1.4;
  const JOYSTICK_SCROLL_FORCE_PROFILE = "strong-visible";
  const MOBILE_BREAKPOINT = 760;

  const VALUE_CATEGORIES = Object.freeze([
    {
      key: "arrival",
      label: "Arrival",
      shortLabel: "Arrival",
      purpose: "Orient, enter, and cross the public threshold.",
      order: 10
    },
    {
      key: "world-study",
      label: "World Study",
      shortLabel: "Worlds",
      purpose: "Study worlds, maps, planets, and living environments.",
      order: 20
    },
    {
      key: "control-instruments",
      label: "Control / Instruments",
      shortLabel: "Controls",
      purpose: "Operate cockpits, labs, inspections, and readiness surfaces.",
      order: 30
    },
    {
      key: "workshop-frontier",
      label: "Workshop / Frontier Systems",
      shortLabel: "Workshop",
      purpose: "Pressure-test applied systems before they become living-world infrastructure.",
      order: 40
    },
    {
      key: "law-governance-proof",
      label: "Law / Governance / Proof",
      shortLabel: "Proof",
      purpose: "Study boundaries, governance, proof, and accountability.",
      order: 50
    },
    {
      key: "public-product-value",
      label: "Public / Product Value",
      shortLabel: "Products",
      purpose: "Open usable offers, public identity, tools, and visitor-facing value.",
      order: 60
    },
    {
      key: "story-cast-universe",
      label: "Story / Cast / Universe",
      shortLabel: "Story",
      purpose: "Enter characters, story rooms, universe context, and narrative immersion.",
      order: 70
    }
  ]);

  const CATEGORY_BY_KEY = VALUE_CATEGORIES.reduce((acc, item) => {
    acc[item.key] = item;
    return acc;
  }, Object.create(null));

  const ESTATE_OVERRIDES = Object.freeze({
    "/": {
      routeId: "compass",
      menu: "main",
      publicRoomName: "Compass Desk",
      estateLocation: "Front Orientation Desk",
      valueCategory: "arrival",
      visitorPurpose: "Start here, regain orientation, and choose the next public route.",
      visitorAction: "Open Compass",
      shortContext: "The front orientation desk for the public website.",
      deepContext: "Compass keeps the ordinary website oriented before the visitor enters deeper rooms, products, proof paths, or Mirrorland."
    },
    "/door/": {
      routeId: "door",
      menu: "main",
      publicRoomName: "Front Door",
      estateLocation: "Public Threshold",
      valueCategory: "arrival",
      visitorPurpose: "Cross the ordinary website threshold.",
      visitorAction: "Open Door",
      shortContext: "The public threshold of the website.",
      deepContext: "The Front Door is separate from the Mirrorland Map / Portal."
    },
    "/home/": {
      routeId: "home",
      menu: "main",
      publicRoomName: "Main Hall",
      estateLocation: "Central House",
      valueCategory: "arrival",
      visitorPurpose: "Return to the central public hall of Diamond Gate Bridge.",
      visitorAction: "Open Main Hall",
      shortContext: "The central public hall.",
      deepContext: "Main Hall stabilizes the public website before the visitor branches into products, laws, proof, or Mirrorland."
    },
    "/site-guide/": {
      routeId: "site-guide",
      menu: "main",
      publicRoomName: "Guide Desk",
      estateLocation: "Orientation Desk",
      valueCategory: "arrival",
      visitorPurpose: "Read how the site, rooms, gems, routes, and return paths work.",
      visitorAction: "Open Guide",
      shortContext: "The visitor instruction desk.",
      deepContext: "Guide Desk explains navigation without turning Mirrorland into a file directory."
    },
    "/laws/": {
      routeId: "laws",
      menu: "main",
      publicRoomName: "Law Library",
      estateLocation: "Law Library",
      valueCategory: "law-governance-proof",
      visitorPurpose: "Study the rules, boundaries, and constraints that keep the estate coherent.",
      visitorAction: "Open Law Library",
      shortContext: "The room where boundaries and rules are studied.",
      deepContext: "Law Library supports Mirrorland, Frontier, products, and public claims by keeping each page attached to discipline and consequence."
    },
    "/governance/": {
      routeId: "governance",
      menu: "main",
      publicRoomName: "Council Room",
      estateLocation: "Governance Hall",
      valueCategory: "law-governance-proof",
      visitorPurpose: "Review policy, public risk, responsibility, and decision structure.",
      visitorAction: "Open Council Room",
      shortContext: "The estate room for decisions and accountability.",
      deepContext: "Council Room frames governance as the decision layer that keeps ambitious systems from outrunning responsibility."
    },
    "/gauges/": {
      routeId: "gauges",
      menu: "main",
      publicRoomName: "The Lab",
      estateLocation: "Measurement Lab",
      valueCategory: "control-instruments",
      visitorPurpose: "Inspect route status, readiness signals, and measurement results.",
      visitorAction: "Open The Lab",
      shortContext: "The Lab checks what is active, held, ready, or still under review.",
      deepContext: "The Lab is the estate’s measurement room. It supports proof and readiness without becoming a Mirrorland room."
    },
    "/gauges/h-earth/": {
      routeId: "gauges-h-earth",
      menu: "main",
      publicRoomName: "H-Earth Lab Bench",
      estateLocation: "Measurement Lab",
      valueCategory: "control-instruments",
      visitorPurpose: "Inspect H-Earth readiness from the lab bench.",
      visitorAction: "Open Lab Bench",
      shortContext: "A dedicated lab bench for H-Earth readiness.",
      deepContext: "H-Earth Lab Bench lets visitors inspect a specific world’s route state without confusing the lab with the world itself."
    },
    "/products/": {
      routeId: "products",
      menu: "main",
      publicRoomName: "Product Gallery",
      estateLocation: "Product Gallery",
      valueCategory: "public-product-value",
      visitorPurpose: "View usable objects, offers, games, tools, and product pathways.",
      visitorAction: "Open Gallery",
      shortContext: "The room where public value becomes usable.",
      deepContext: "Product Gallery turns ideas into usable objects and offers without mixing them with Mirrorland navigation."
    },
    "/about-this-underdog/": {
      routeId: "meet-sean",
      menu: "main",
      publicRoomName: "Host Portrait",
      estateLocation: "Portrait Room",
      valueCategory: "public-product-value",
      visitorPurpose: "Meet the person, mission, and public-facing host of Diamond Gate Bridge.",
      visitorAction: "Meet Sean",
      shortContext: "The host portrait room.",
      deepContext: "Host Portrait introduces the human mission behind the estate without turning the page into a technical index."
    },
    "/showroom/": {
      routeId: "showroom-door",
      menu: "mirrorland",
      publicRoomName: "Atrium",
      estateLocation: "Mirrorland Entrance Atrium",
      valueCategory: "arrival",
      visitorPurpose: "Enter the immersive estate threshold where visible objects and Mirrorland doors begin.",
      visitorAction: "Enter Atrium",
      shortContext: "The entrance atrium for Mirrorland-facing object display.",
      deepContext: "The Atrium frames the Diamond Lattice object and prepares the visitor for Mirrorland."
    },
    "/showroom/globe/": {
      routeId: "mirrorland-field",
      menu: "mirrorland",
      publicRoomName: "Atlas Study",
      estateLocation: "Atlas Study",
      valueCategory: "world-study",
      visitorPurpose: "Study the estate’s worlds, planetary doors, reference bodies, and living environments.",
      visitorAction: "Open Atlas Study",
      shortContext: "The estate study for worlds and planetary doors.",
      deepContext: "Atlas Study gives direct context to the planetary field. It is not a route directory."
    },
    "/showroom/globe/earth/": {
      routeId: "zionts",
      menu: "mirrorland",
      publicRoomName: "ZIONTS Room",
      estateLocation: "Atlas Study",
      valueCategory: "world-study",
      visitorPurpose: "Study ZIONTS, pronounced Zience, as the first contextual world-door in the Atlas Study.",
      visitorAction: "Enter ZIONTS",
      shortContext: "ZIONTS, pronounced Zience, is the immersive world identity served from the Earth route.",
      deepContext: "The file address is under Earth, but the estate-room identity is ZIONTS. The map shows what the room means, not what the builder path is named."
    },
    "/showroom/globe/audralia/": {
      routeId: "audralia",
      menu: "mirrorland",
      publicRoomName: "Audralia Conservatory",
      estateLocation: "Atlas Study",
      valueCategory: "world-study",
      visitorPurpose: "Enter Audralia as the constructive living-world path inside Mirrorland.",
      visitorAction: "Enter Conservatory",
      shortContext: "The living-world conservatory for Audralia.",
      deepContext: "Audralia Conservatory introduces the constructive world before its body, cockpit, and future systems are inspected elsewhere."
    },
    "/showroom/globe/audralia/planet/": {
      routeId: "audralia-planet",
      menu: "mirrorland",
      publicRoomName: "Audralia Worldroom",
      estateLocation: "Audralia Conservatory",
      valueCategory: "world-study",
      visitorPurpose: "Inspect Audralia as a visible world-body without claiming the world is final.",
      visitorAction: "Inspect Worldroom",
      shortContext: "The room where Audralia’s visible body is inspected.",
      deepContext: "Audralia Worldroom gives a focused planet-body read while keeping final terrain, water, and completion claims held until earned."
    },
    "/showroom/globe/audralia/disposition/": {
      routeId: "audralia-cockpit",
      menu: "mirrorland",
      publicRoomName: "Control Cockpit",
      estateLocation: "Audralia Conservatory",
      valueCategory: "control-instruments",
      visitorPurpose: "Operate Audralia’s cockpit-style instruments and inspect the world’s disposition.",
      visitorAction: "Open Cockpit",
      shortContext: "The control cockpit for Audralia inspection.",
      deepContext: "Control Cockpit is an instrument room for operating and inspecting Audralia’s disposition layer."
    },
    "/showroom/globe/hearth/": {
      routeId: "hearth",
      menu: "mirrorland",
      publicRoomName: "Hearth Room",
      estateLocation: "Atlas Study",
      valueCategory: "world-study",
      visitorPurpose: "Study Hearth as a forming world in the planetary estate.",
      visitorAction: "Enter Hearth Room",
      shortContext: "A world-study room for Hearth.",
      deepContext: "Hearth Room keeps Hearth readable as its own world inside the Atlas Study instead of reducing it to a path name."
    },
    "/showroom/globe/h-earth/": {
      routeId: "h-earth",
      menu: "mirrorland",
      publicRoomName: "H-Earth Annex",
      estateLocation: "Atlas Study",
      valueCategory: "world-study",
      visitorPurpose: "Study the H-Earth experimental world path from its annex.",
      visitorAction: "Open Annex",
      shortContext: "The annex for H-Earth world inspection.",
      deepContext: "H-Earth Annex is a world-study room. It stays separate from The Lab, which measures H-Earth readiness."
    },
    "/characters/": {
      routeId: "characters",
      menu: "mirrorland",
      publicRoomName: "Portrait Hall",
      estateLocation: "Story Wing",
      valueCategory: "story-cast-universe",
      visitorPurpose: "Meet the cast, faces, voices, and narrative presences of the estate.",
      visitorAction: "Enter Portrait Hall",
      shortContext: "The room where story faces are introduced.",
      deepContext: "Portrait Hall organizes characters as part of the immersive estate rather than presenting them as a route list."
    },
    "/nine-summits/universe/": {
      routeId: "nine-summits-universe",
      menu: "mirrorland",
      publicRoomName: "Universe Gallery",
      estateLocation: "Story Wing",
      valueCategory: "story-cast-universe",
      visitorPurpose: "Open the larger story-world context surrounding the estate.",
      visitorAction: "Open Universe Gallery",
      shortContext: "The room for the wider universe context.",
      deepContext: "Universe Gallery keeps the larger narrative field accessible without forcing it into technical site language."
    },
    "/explore/frontier/": {
      routeId: "frontier",
      menu: "mirrorland",
      publicRoomName: "Frontier Workshop Yard",
      estateLocation: "West Workshop Yard",
      valueCategory: "workshop-frontier",
      visitorPurpose: "Enter the outdoor testing yard where Audralia’s future systems are pressure-tested.",
      visitorAction: "Enter Workshop Yard",
      shortContext: "The applied-science yard for frontier system testing.",
      deepContext: "Frontier Workshop Yard is where possible systems are examined before they are allowed to become part of Audralia’s constructive future."
    },
    "/explore/frontier/energy/": {
      routeId: "frontier-energy",
      menu: "mirrorland",
      publicRoomName: "Fusion Bench",
      estateLocation: "Frontier Workshop Yard",
      valueCategory: "workshop-frontier",
      visitorPurpose: "Scratch the surface of power, storage, solar support, plasma regime, and long-range fusion constraints.",
      visitorAction: "Open Fusion Systems",
      shortContext: "The bench where future power systems are tested.",
      deepContext: "Fusion Bench studies the energy pathway without claiming commercial fusion completion."
    },
    "/explore/frontier/water/": {
      routeId: "frontier-water",
      menu: "mirrorland",
      publicRoomName: "Closed Water Systems Bench",
      estateLocation: "Frontier Workshop Yard",
      valueCategory: "workshop-frontier",
      visitorPurpose: "Scratch the surface of capture, treatment, routing, reuse, storage, and continuity.",
      visitorAction: "Open Water Systems",
      shortContext: "The bench where water continuity systems are studied.",
      deepContext: "Closed Water Systems Bench studies how a future world preserves flow, storage, cleanliness, continuity, and responsible reuse."
    },
    "/explore/frontier/waste/": {
      routeId: "frontier-waste",
      menu: "mirrorland",
      publicRoomName: "Wastewater Systems Bench",
      estateLocation: "Frontier Workshop Yard",
      valueCategory: "workshop-frontier",
      visitorPurpose: "Scratch the surface of sanitation, wastewater, return-material logic, recovery, and reuse.",
      visitorAction: "Open Wastewater Systems",
      shortContext: "The bench where discarded value is returned into system logic.",
      deepContext: "Wastewater Systems Bench studies discard, sanitation, recovery, reuse, and return-material pathways."
    },
    "/explore/frontier/closed-loop/": {
      routeId: "frontier-closed-loop",
      menu: "mirrorland",
      publicRoomName: "Closed Loop Table",
      estateLocation: "Frontier Workshop Yard",
      valueCategory: "workshop-frontier",
      visitorPurpose: "Scratch the surface of feedback, accountability, capture, correction, and system answer-back.",
      visitorAction: "Open Closed Loop",
      shortContext: "The table where systems prove they can answer back.",
      deepContext: "Closed Loop Table studies whether a system can capture outputs, correct losses, and prove accountability before scaling."
    },
    "/explore/frontier/infrastructure/": {
      routeId: "frontier-infrastructure",
      menu: "mirrorland",
      publicRoomName: "Infrastructure Bay",
      estateLocation: "Frontier Workshop Yard",
      valueCategory: "workshop-frontier",
      visitorPurpose: "Scratch the surface of roads, supports, utilities, corridors, and load-bearing systems.",
      visitorAction: "Open Infrastructure Bay",
      shortContext: "The bay where future support-load systems are tested.",
      deepContext: "Infrastructure Bay studies whether a future world can carry weight before people, cities, and systems depend on it."
    },
    "/explore/frontier/lattice/": {
      routeId: "frontier-lattice",
      menu: "mirrorland",
      publicRoomName: "Lattice Table",
      estateLocation: "Frontier Workshop Yard",
      valueCategory: "workshop-frontier",
      visitorPurpose: "Scratch the surface of placement, relationship, pattern, count, and measurable expansion.",
      visitorAction: "Open Lattice Table",
      shortContext: "The table where growth is tested for structure.",
      deepContext: "Lattice Table asks whether future growth can remain ordered rather than expanding randomly."
    },
    "/explore/frontier/manual/": {
      routeId: "frontier-manual",
      menu: "mirrorland",
      publicRoomName: "Field Manual Desk",
      estateLocation: "Frontier Workshop Yard",
      valueCategory: "workshop-frontier",
      visitorPurpose: "Scratch the surface of operating language, field notes, methods, and practical instructions.",
      visitorAction: "Open Field Manual",
      shortContext: "The desk where future systems become readable and usable.",
      deepContext: "Field Manual Desk keeps frontier systems from becoming mysterious by translating them into operating language."
    },
    "/explore/frontier/shimmer/": {
      routeId: "frontier-shimmer",
      menu: "mirrorland",
      publicRoomName: "Shimmer Signal Table",
      estateLocation: "Frontier Workshop Yard",
      valueCategory: "workshop-frontier",
      visitorPurpose: "Scratch the surface of signal, perception, visible clues, and surface change.",
      visitorAction: "Open Shimmer Signal",
      shortContext: "The table where faint signals become readable.",
      deepContext: "Shimmer Signal Table studies the visible clue that motion, change, or system response is beginning."
    },
    "/explore/frontier/trajectory/": {
      routeId: "frontier-trajectory",
      menu: "mirrorland",
      publicRoomName: "Trajectory Table",
      estateLocation: "Frontier Workshop Yard",
      valueCategory: "workshop-frontier",
      visitorPurpose: "Scratch the surface of direction, launch, arc, impact, and forward motion.",
      visitorAction: "Open Trajectory Table",
      shortContext: "The table where direction becomes testable.",
      deepContext: "Trajectory Table studies whether a frontier system has a direction strong enough to carry it forward."
    },
    "/explore/frontier/vision/": {
      routeId: "frontier-vision",
      menu: "mirrorland",
      publicRoomName: "Vision Window",
      estateLocation: "Frontier Workshop Yard",
      valueCategory: "workshop-frontier",
      visitorPurpose: "Scratch the surface of horizon, imagination, future clarity, and long-range consequence.",
      visitorAction: "Open Vision Window",
      shortContext: "The window where the future horizon is read.",
      deepContext: "Vision Window keeps Frontier attached to the horizon beyond the immediate experiment."
    },
    "/explore/frontier/urban/": {
      routeId: "frontier-urban",
      menu: "mirrorland",
      publicRoomName: "Urban Planning Table",
      estateLocation: "Frontier Workshop Yard",
      valueCategory: "workshop-frontier",
      visitorPurpose: "Scratch the surface of civic pressure, corridors, density, city systems, and built-world consequence.",
      visitorAction: "Open Urban Table",
      shortContext: "The table where future civic pressure is tested.",
      deepContext: "Urban Planning Table studies how frontier systems behave once they meet public space, density, corridors, and the built world."
    }
  });

  const FALLBACK_ROUTES = Object.freeze(Object.keys(ESTATE_OVERRIDES).map((path) => ({
    path,
    title: ESTATE_OVERRIDES[path].publicRoomName,
    shortTitle: ESTATE_OVERRIDES[path].publicRoomName,
    priority: defaultPriority(path),
    showInBlueprint: true
  })));

  let bubble = null;
  let overlay = null;
  let joystickRaf = 0;

  const state = {
    activeLens: "mirrorland",
    overlayOpen: false,
    dragging: false,
    dragMoved: false,
    pointerId: null,
    pointerStartX: 0,
    pointerStartY: 0,
    pointerClientY: 0,
    baseX: 0,
    baseY: 0,
    position: { x: 0, y: 0 },
    positionSource: "boot",
    positionWasClamped: false,
    joystickActive: false,
    joystickDirection: "none",
    joystickSpeed: 0,
    lastAction: "boot",
    errors: []
  };

  if (
    window[CONTROLLER_GLOBAL] &&
    typeof window[CONTROLLER_GLOBAL].stop === "function"
  ) {
    try {
      window[CONTROLLER_GLOBAL].stop();
    } catch (_error) {}
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function defaultPriority(path) {
    const ordered = [
      "/",
      "/showroom/",
      "/showroom/globe/",
      "/showroom/globe/audralia/",
      "/showroom/globe/audralia/planet/",
      "/showroom/globe/earth/",
      "/explore/frontier/",
      "/explore/frontier/energy/",
      "/explore/frontier/water/",
      "/explore/frontier/waste/",
      "/gauges/",
      "/laws/",
      "/products/"
    ];

    const index = ordered.indexOf(path);
    return index >= 0 ? 200 - index : 50;
  }

  function normalizePath(path) {
    let clean = String(path || "/").split("?")[0].split("#")[0] || "/";
    if (/^https?:\/\//i.test(clean)) {
      try {
        clean = new URL(clean).pathname || "/";
      } catch (_error) {
        clean = "/";
      }
    }
    if (!clean.startsWith("/")) clean = "/" + clean;
    clean = clean.replace(/\/{2,}/g, "/");
    return clean === "/" ? "/" : clean.replace(/\/?$/, "/");
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function registryApi() {
    return window.DGB_MANOR_BLUEPRINT_REGISTRY || null;
  }

  function registryRoutesRaw() {
    const api = registryApi();

    if (Array.isArray(api?.routes)) return api.routes;
    if (Array.isArray(window.DGB_MANOR_BLUEPRINT_ROUTE_REGISTRY)) return window.DGB_MANOR_BLUEPRINT_ROUTE_REGISTRY;

    return [];
  }

  function categoryFor(key) {
    return CATEGORY_BY_KEY[key] || CATEGORY_BY_KEY.arrival;
  }

  function sourceRoutesRaw() {
    const registry = registryRoutesRaw();
    const byPath = new Map();

    for (const item of FALLBACK_ROUTES) {
      byPath.set(normalizePath(item.path), item);
    }

    for (const item of registry) {
      const path = normalizePath(item.path || item.href || "/");
      byPath.set(path, {
        ...byPath.get(path),
        ...item,
        path
      });
    }

    return Array.from(byPath.values());
  }

  function normalizeRoute(input) {
    const path = normalizePath(input.path || input.href || "/");
    const override = ESTATE_OVERRIDES[path] || {};
    const valueCategory = override.valueCategory || input.valueCategory || "arrival";
    const category = categoryFor(valueCategory);

    const menu = override.menu || input.menu || (input.mirrorlandDoor || input.mirrorlandAligned ? "mirrorland" : "main");

    return Object.freeze({
      routeId: String(override.routeId || input.routeId || input.id || slug(path)),
      path,
      href: path,
      builderPathHidden: path,
      technicalLabelHidden: String(input.title || input.shortTitle || path),

      title: String(input.title || override.publicRoomName || "Estate Room"),
      shortTitle: String(input.shortTitle || override.publicRoomName || input.title || "Room"),
      publicRoomName: String(override.publicRoomName || input.publicRoomName || input.title || "Estate Room"),
      estateLocation: String(override.estateLocation || input.estateLocation || input.wing || "Estate Room"),

      valueCategory,
      valueCategoryLabel: category.label,
      valueCategoryShortLabel: category.shortLabel,

      visitorPurpose: String(override.visitorPurpose || input.visitorPurpose || input.description || "Open this estate room."),
      visitorAction: String(override.visitorAction || input.visitorAction || "Enter Room"),
      shortContext: String(override.shortContext || input.shortContext || input.visitorPurpose || input.description || "Open this estate room."),
      deepContext: String(override.deepContext || input.deepContext || input.body || input.shortContext || input.visitorPurpose || input.description || "This room has a visitor-facing purpose."),

      menu,
      group: String(menu === "main" ? "Main Menu / Website Options" : "Mirrorland Doors"),
      parent: input.parent ? normalizePath(input.parent) : "",
      priority: Number.isFinite(Number(input.priority)) ? Number(input.priority) : defaultPriority(path),
      showInBlueprint: input.showInBlueprint !== false,

      mirrorlandAligned: menu === "mirrorland",
      mirrorlandDoor: menu === "mirrorland",
      websiteOption: menu === "main"
    });
  }

  function slug(value) {
    return String(value || "room")
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "room";
  }

  function allRoutes() {
    return sourceRoutesRaw()
      .map(normalizeRoute)
      .filter((item) => item.showInBlueprint)
      .sort((a, b) => b.priority - a.priority || a.publicRoomName.localeCompare(b.publicRoomName));
  }

  function routesForLens(lens) {
    const menu = lens === "main" ? "main" : "mirrorland";
    return allRoutes().filter((item) => item.menu === menu);
  }

  function currentRoute(routes) {
    const path = normalizePath(window.location.pathname || "/");
    const source = routes && routes.length ? routes : allRoutes();

    return source.find((item) => item.path === path) ||
      source
        .filter((item) => item.path !== "/" && path.startsWith(item.path))
        .sort((a, b) => b.path.length - a.path.length || b.priority - a.priority)[0] ||
      source.find((item) => item.path === "/") ||
      source[0] ||
      null;
  }

  function groupedByValueCategory(routes) {
    const grouped = new Map();

    for (const category of VALUE_CATEGORIES) grouped.set(category.key, []);

    for (const route of routes) {
      if (!grouped.has(route.valueCategory)) grouped.set(route.valueCategory, []);
      grouped.get(route.valueCategory).push(route);
    }

    for (const [key, list] of grouped.entries()) {
      grouped.set(key, list.sort((a, b) => b.priority - a.priority || a.publicRoomName.localeCompare(b.publicRoomName)));
    }

    return grouped;
  }

  function instructions() {
    return [
      {
        title: "File Name Is Not Room Identity",
        body: "Builder paths stay hidden. The visitor sees the estate-room identity. Example: /showroom/globe/earth/ displays as ZIONTS, pronounced Zience."
      },
      {
        title: "Value Category First",
        body: "Rooms are grouped by the value they give the visitor: Arrival, World Study, Control / Instruments, Workshop / Frontier Systems, Law / Governance / Proof, Public / Product Value, and Story / Cast / Universe."
      },
      {
        title: "Mirrorland Doors",
        body: "Mirrorland Doors contains immersive estate rooms: Atrium, Atlas Study, planetary rooms, Control Cockpit, Frontier Workshop Yard, and story rooms."
      },
      {
        title: "Main Menu",
        body: "Main Menu contains regular website rooms: Compass Desk, Front Door, Main Hall, Law Library, Council Room, The Lab, Product Gallery, Host Portrait, and Guide Desk."
      }
    ];
  }

  function viewport() {
    const visual = window.visualViewport || null;

    return {
      width: Math.max(320, Math.floor(visual ? visual.width : window.innerWidth || 320)),
      height: Math.max(320, Math.floor(visual ? visual.height : window.innerHeight || 640)),
      offsetLeft: Math.floor(visual ? visual.offsetLeft : 0),
      offsetTop: Math.floor(visual ? visual.offsetTop : 0),
      scale: visual ? visual.scale : 1,
      visualViewportUsed: Boolean(visual)
    };
  }

  function isMobile() {
    return viewport().width <= MOBILE_BREAKPOINT;
  }

  function safeMargins() {
    return isMobile()
      ? { left: 14, right: 14, top: 14, bottom: 14 }
      : { left: 16, right: 16, top: 16, bottom: 16 };
  }

  function bubbleSize() {
    if (!bubble) return { width: 68, height: 68 };
    const rect = bubble.getBoundingClientRect();
    return {
      width: rect.width > 10 ? rect.width : 68,
      height: rect.height > 10 ? rect.height : 68
    };
  }

  function defaultPosition() {
    const v = viewport();
    const m = safeMargins();
    const s = bubbleSize();

    return {
      x: v.offsetLeft + v.width - s.width - m.right,
      y: v.offsetTop + (isMobile() ? 96 : v.height - s.height - m.bottom)
    };
  }

  function clampPosition(pos) {
    const v = viewport();
    const m = safeMargins();
    const s = bubbleSize();

    const minX = v.offsetLeft + m.left;
    const maxX = Math.max(minX, v.offsetLeft + v.width - s.width - m.right);
    const minY = v.offsetTop + m.top;
    const maxY = Math.max(minY, v.offsetTop + v.height - s.height - m.bottom);

    const rawX = Number(pos.x);
    const rawY = Number(pos.y);

    const sourceX = Number.isFinite(rawX) ? rawX : maxX;
    const sourceY = Number.isFinite(rawY) ? rawY : minY;

    const x = Math.min(Math.max(sourceX, minX), maxX);
    const y = Math.min(Math.max(sourceY, minY), maxY);

    return { x, y, clamped: x !== sourceX || y !== sourceY };
  }

  function readStoredPosition() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      const x = Number(parsed?.x);
      const y = Number(parsed?.y);

      if (!Number.isFinite(x) || !Number.isFinite(y)) return null;

      return { x, y };
    } catch (_error) {
      return null;
    }
  }

  function savePosition(pos) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        x: Math.round(pos.x),
        y: Math.round(pos.y),
        contract: CONTRACT,
        previousContract: PREVIOUS_CONTRACT,
        time: nowIso()
      }));
    } catch (_error) {}
  }

  function applyPosition(pos, source, shouldSave) {
    if (!bubble) return;

    const clamped = clampPosition(pos);

    state.position = { x: clamped.x, y: clamped.y };
    state.positionSource = source || "full-viewport";
    state.positionWasClamped = clamped.clamped;

    bubble.style.setProperty("left", `${Math.round(clamped.x)}px`, "important");
    bubble.style.setProperty("top", `${Math.round(clamped.y)}px`, "important");
    bubble.style.setProperty("right", "auto", "important");
    bubble.style.setProperty("bottom", "auto", "important");
    bubble.style.setProperty("display", "grid", "important");
    bubble.style.setProperty("visibility", "visible", "important");
    bubble.style.setProperty("opacity", "1", "important");
    bubble.style.setProperty("pointer-events", "auto", "important");

    if (shouldSave) savePosition(state.position);

    publishStatus();
  }

  function initializePosition() {
    const stored = readStoredPosition();
    applyPosition(stored || defaultPosition(), stored ? "stored" : "upper-right-safe-anchor", !stored);
  }

  function enforceSingleElement(selector) {
    const nodes = Array.from(document.querySelectorAll(selector));
    const keeper = nodes[0] || null;

    nodes.slice(1).forEach((node) => {
      try {
        node.remove();
      } catch (_error) {}
    });

    return keeper;
  }

  function createBubble() {
    bubble = enforceSingleElement(BUBBLE_SELECTOR);

    if (!bubble) {
      bubble = document.createElement("button");
      document.body.appendChild(bubble);
    }

    bubble.type = "button";
    bubble.className = "dgb-blueprint-bubble";
    bubble.setAttribute("aria-label", "Open Mirrorland Map Portal");
    bubble.setAttribute("data-dgb-blueprint-bubble", "true");
    bubble.setAttribute("data-manor-blueprint-contract", CONTRACT);
    bubble.setAttribute("data-value-category-estate-language", "true");
    bubble.setAttribute("data-builder-path-hidden", "true");
    bubble.setAttribute("data-zionts-visible-identity", "true");
    bubble.innerHTML = `
      <span class="dgb-blueprint-bubble-label dgb-blueprint-bubble__label">
        <strong>Map</strong>
        <span>Portal</span>
      </span>
    `;

    bubble.style.cssText = [
      "position:fixed!important",
      "z-index:99990!important",
      "display:grid!important",
      "visibility:visible!important",
      "opacity:1!important",
      "pointer-events:auto!important",
      "left:0!important",
      "top:0!important",
      "right:auto!important",
      "bottom:auto!important",
      "overflow:visible!important"
    ].join(";");

    return bubble;
  }

  function createOverlay() {
    overlay = enforceSingleElement(OVERLAY_SELECTOR);

    if (!overlay) {
      overlay = document.createElement("section");
      document.body.appendChild(overlay);
    }

    overlay.className = "dgb-blueprint-overlay";
    overlay.hidden = true;
    overlay.setAttribute("data-dgb-blueprint-overlay", "true");
    overlay.setAttribute("data-open", "false");
    overlay.setAttribute("data-manor-blueprint-contract", CONTRACT);
    overlay.setAttribute("data-value-category-estate-language", "true");
    overlay.setAttribute("data-builder-path-hidden", "true");
    overlay.setAttribute("data-zionts-visible-identity", "true");
    overlay.setAttribute("aria-label", "Mirrorland estate map portal");

    return overlay;
  }

  function lensTitle() {
    if (state.activeLens === "main") return "Main Menu";
    if (state.activeLens === "instructions") return "Instructions";
    return "Mirrorland Doors";
  }

  function lensSubtitle() {
    if (state.activeLens === "main") {
      return "Regular website rooms. These support the estate without becoming Mirrorland doors.";
    }

    if (state.activeLens === "instructions") {
      return "The public map uses estate-room identity. Builder file paths stay hidden.";
    }

    return "Choose rooms by visitor value: arrival, worlds, instruments, workshop systems, proof, products, and story.";
  }

  function renderCurrentPanel(routes, mode) {
    const current = currentRoute(routes);
    const label = mode === "main" ? "Website Position" : "Estate Position";

    return `
      <aside class="dgb-bp-current-card" data-current-room="${escapeHtml(current?.routeId || "")}">
        <span class="dgb-bp-chip">${escapeHtml(label)}</span>
        <h3>${escapeHtml(current?.publicRoomName || lensTitle())}</h3>
        <p>${escapeHtml(current?.shortContext || "Choose a room from the estate map.")}</p>
        <div class="dgb-bp-location-strip">
          <span>${escapeHtml(current?.valueCategoryLabel || "Arrival")}</span>
          <span>${escapeHtml(current?.estateLocation || "Estate")}</span>
        </div>
      </aside>
    `;
  }

  function renderRoomCard(item) {
    const currentPath = normalizePath(window.location.pathname || "/");
    const isCurrent = currentPath === item.path;

    return `
      <article
        class="dgb-bp-value-card${isCurrent ? " dgb-bp-value-card-current" : ""}"
        data-route-id="${escapeHtml(item.routeId)}"
        data-value-category="${escapeHtml(item.valueCategory)}"
        data-current="${isCurrent ? "true" : "false"}"
        data-builder-path="${escapeHtml(item.builderPathHidden)}"
        data-technical-label="${escapeHtml(item.technicalLabelHidden)}"
      >
        <div class="dgb-bp-value-card-top">
          <span class="dgb-bp-value-badge">${escapeHtml(item.valueCategoryShortLabel)}</span>
          <span class="dgb-bp-estate-location">${escapeHtml(item.estateLocation)}</span>
        </div>

        <h4>${escapeHtml(item.publicRoomName)}</h4>
        <p>${escapeHtml(item.visitorPurpose)}</p>

        <details class="dgb-bp-room-details">
          <summary>Read room</summary>
          <div class="dgb-bp-room-details-body">
            <b>What this room is</b>
            <p>${escapeHtml(item.shortContext)}</p>
            <b>Why it matters</b>
            <p>${escapeHtml(item.deepContext)}</p>
            <b>Where it sits</b>
            <p>${escapeHtml(item.estateLocation)} · ${escapeHtml(item.valueCategoryLabel)}</p>
          </div>
        </details>

        <a class="dgb-bp-room-action" href="${escapeHtml(item.href)}">
          ${escapeHtml(item.visitorAction)}
        </a>
      </article>
    `;
  }

  function renderCategorySection(category, routes) {
    if (!routes.length) return "";

    return `
      <section class="dgb-bp-value-section" data-value-category="${escapeHtml(category.key)}">
        <header class="dgb-bp-value-section-head">
          <span>${escapeHtml(category.shortLabel || category.label)}</span>
          <h3>${escapeHtml(category.label)}</h3>
          <p>${escapeHtml(category.purpose || "Choose a room.")}</p>
        </header>
        <div class="dgb-bp-value-grid">
          ${routes.map(renderRoomCard).join("")}
        </div>
      </section>
    `;
  }

  function renderEstateMap(mode) {
    const routes = routesForLens(mode);
    const grouped = groupedByValueCategory(routes);

    return `
      <div class="dgb-bp-estate-layout">
        ${renderCurrentPanel(routes, mode)}
        <div class="dgb-bp-estate-map" data-estate-map="value-category">
          ${VALUE_CATEGORIES.map((category) => renderCategorySection(category, grouped.get(category.key) || [])).join("")}
        </div>
      </div>
    `;
  }

  function renderInstructionsLens() {
    return `
      <div class="dgb-bp-instructions-grid">
        ${instructions().map((item, index) => `
          <article class="dgb-bp-instruction-card">
            <b>Instruction ${index + 1}</b>
            <h3>${escapeHtml(item.title || "Instruction")}</h3>
            <p>${escapeHtml(item.body || "Read this instruction.")}</p>
          </article>
        `).join("")}
      </div>
    `;
  }

  function renderActiveLens() {
    if (state.activeLens === "main") return renderEstateMap("main");
    if (state.activeLens === "instructions") return renderInstructionsLens();
    return renderEstateMap("mirrorland");
  }

  function renderOverlay() {
    if (!overlay) return;

    overlay.innerHTML = `
      <div class="dgb-bp-topbar">
        <div class="dgb-bp-titleblock">
          <div class="dgb-bp-kicker">Mirrorland House Blueprint</div>
          <h2 class="dgb-bp-title">${escapeHtml(lensTitle())}</h2>
          <p class="dgb-bp-subtitle">${escapeHtml(lensSubtitle())}</p>
        </div>
        <button class="dgb-bp-close" type="button" data-dgb-close aria-label="Close Map Portal">×</button>
      </div>

      <div class="dgb-bp-main">
        <div class="dgb-bp-tabs">
          <div class="dgb-bp-tablist" role="tablist" aria-label="Map Portal lenses">
            <button class="dgb-bp-tab" type="button" data-dgb-lens="mirrorland" aria-selected="${state.activeLens === "mirrorland"}" data-active="${state.activeLens === "mirrorland"}">Mirrorland Doors</button>
            <button class="dgb-bp-tab" type="button" data-dgb-lens="main" aria-selected="${state.activeLens === "main"}" data-active="${state.activeLens === "main"}">Main Menu</button>
            <button class="dgb-bp-tab" type="button" data-dgb-lens="instructions" aria-selected="${state.activeLens === "instructions"}" data-active="${state.activeLens === "instructions"}">Instructions</button>
          </div>
          <div class="dgb-bp-current-pill">${state.activeLens === "main" ? "Website Rooms" : state.activeLens === "instructions" ? "How To Read" : "Estate Rooms"}</div>
        </div>

        <div class="dgb-bp-content" data-value-category-estate-language="true">
          <section class="dgb-bp-lens" data-lens-panel="${escapeHtml(state.activeLens)}">
            ${renderActiveLens()}
          </section>
        </div>
      </div>
    `;

    overlay.querySelector("[data-dgb-close]")?.addEventListener("click", close);

    overlay.querySelectorAll("[data-dgb-lens]").forEach((button) => {
      button.addEventListener("click", () => setLens(button.getAttribute("data-dgb-lens") || "mirrorland"));
    });
  }

  function open() {
    if (!overlay) return;

    stopJoystickScroll();

    state.overlayOpen = true;
    state.lastAction = "open";
    state.activeLens = "mirrorland";

    renderOverlay();

    overlay.hidden = false;
    overlay.setAttribute("data-open", "true");
    overlay.setAttribute("data-active-lens", state.activeLens);

    document.documentElement.classList.add("dgb-blueprint-body-lock");
    document.body?.classList.add("dgb-blueprint-body-lock");

    publishStatus();
  }

  function close() {
    if (!overlay) return;

    state.overlayOpen = false;
    state.lastAction = "close";

    overlay.hidden = true;
    overlay.setAttribute("data-open", "false");

    document.documentElement.classList.remove("dgb-blueprint-body-lock");
    document.body?.classList.remove("dgb-blueprint-body-lock");

    publishStatus();
  }

  function toggle() {
    state.overlayOpen ? close() : open();
  }

  function setLens(lens) {
    const clean = lens === "main" || lens === "instructions" ? lens : "mirrorland";
    state.activeLens = clean;
    state.lastAction = "set-lens:" + clean;

    if (overlay) overlay.setAttribute("data-active-lens", clean);

    renderOverlay();
    publishStatus();
  }

  function resetPosition() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (_error) {}

    applyPosition(defaultPosition(), "reset", true);
  }

  function joystickSpeedFromPressure(pressure) {
    const cleanPressure = Math.max(0, Math.min(1, Number(pressure) || 0));
    return (MIN_SCROLL_SPEED + (MAX_SCROLL_SPEED - MIN_SCROLL_SPEED) * cleanPressure) * JOYSTICK_SCROLL_FORCE_MULTIPLIER;
  }

  function joystickMetrics(clientY) {
    const v = viewport();
    const topZone = Math.max(96, Math.floor(v.height * 0.18));
    const bottomZone = Math.max(120, Math.floor(v.height * 0.22));
    const y = clientY - v.offsetTop;

    if (y < topZone) {
      return {
        direction: "up",
        speed: joystickSpeedFromPressure((topZone - y) / topZone)
      };
    }

    if (y > v.height - bottomZone) {
      return {
        direction: "down",
        speed: joystickSpeedFromPressure((y - (v.height - bottomZone)) / bottomZone)
      };
    }

    return { direction: "none", speed: 0 };
  }

  function joystickStep() {
    if (!state.dragging || state.overlayOpen) {
      stopJoystickScroll();
      return;
    }

    const metric = joystickMetrics(state.pointerClientY);
    state.joystickDirection = metric.direction;
    state.joystickSpeed = metric.speed;

    if (metric.direction === "up") {
      window.scrollBy(0, -metric.speed);
      state.joystickActive = true;
    } else if (metric.direction === "down") {
      window.scrollBy(0, metric.speed);
      state.joystickActive = true;
    } else {
      state.joystickActive = false;
    }

    joystickRaf = window.requestAnimationFrame(joystickStep);
  }

  function startJoystickScroll() {
    if (joystickRaf || state.overlayOpen) return;
    joystickRaf = window.requestAnimationFrame(joystickStep);
  }

  function stopJoystickScroll() {
    if (joystickRaf) {
      try {
        window.cancelAnimationFrame(joystickRaf);
      } catch (_error) {}
    }

    joystickRaf = 0;
    state.joystickActive = false;
    state.joystickDirection = "none";
    state.joystickSpeed = 0;
  }

  function attachDrag() {
    if (!bubble || bubble.__dgbValueCategoryDragAttached) return;
    bubble.__dgbValueCategoryDragAttached = true;

    bubble.addEventListener("pointerdown", (event) => {
      if (state.overlayOpen) return;

      state.dragging = true;
      state.dragMoved = false;
      state.pointerId = event.pointerId;
      state.pointerStartX = event.clientX;
      state.pointerStartY = event.clientY;
      state.pointerClientY = event.clientY;
      state.baseX = state.position.x;
      state.baseY = state.position.y;
      state.lastAction = "pointerdown";

      bubble.setAttribute("data-dragging", "true");

      try {
        bubble.setPointerCapture(event.pointerId);
      } catch (_error) {}

      startJoystickScroll();
      publishStatus();
      event.preventDefault();
    }, { passive: false });

    bubble.addEventListener("pointermove", (event) => {
      if (!state.dragging) return;

      state.pointerClientY = event.clientY;

      const dx = event.clientX - state.pointerStartX;
      const dy = event.clientY - state.pointerStartY;
      const distance = Math.hypot(dx, dy);

      if (distance > TAP_MOVE_THRESHOLD) state.dragMoved = true;

      applyPosition(
        { x: state.baseX + dx, y: state.baseY + dy },
        state.dragMoved ? "drag-full-viewport" : "tap-pending",
        false
      );

      startJoystickScroll();
      event.preventDefault();
    }, { passive: false });

    function release(event) {
      if (!state.dragging) return;

      state.dragging = false;
      state.pointerId = null;
      bubble.removeAttribute("data-dragging");

      stopJoystickScroll();

      try {
        bubble.releasePointerCapture(event.pointerId);
      } catch (_error) {}

      if (state.dragMoved) {
        state.lastAction = "drag-release";
        savePosition(state.position);
        publishStatus();
      } else {
        state.lastAction = "tap-toggle";
        toggle();
      }

      try {
        event.preventDefault();
      } catch (_error2) {}
    }

    bubble.addEventListener("pointerup", release, { passive: false });
    bubble.addEventListener("pointercancel", release, { passive: false });
    bubble.addEventListener("lostpointercapture", release, { passive: false });
  }

  function publishStatus() {
    const v = viewport();
    const rect = bubble ? bubble.getBoundingClientRect() : null;
    const activeRoutes = state.activeLens === "main" ? routesForLens("main") : routesForLens("mirrorland");
    const current = currentRoute(activeRoutes) || currentRoute(allRoutes());

    const payload = {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      priorContract: PRIOR_CONTRACT,
      apiContract: API_CONTRACT,

      active: true,
      valueCategoryEstateLanguageActive: true,
      staleCardinalRendererSuppressed: true,
      builderPathHiddenFromVisitorCards: true,
      fileNameIsNotRoomIdentity: true,

      ziontsVisibleIdentity: true,
      ziontsSpelling: "ZIONTS",
      ziontsPronunciation: "Zience",
      earthRouteDisplayedAsZionts: true,
      gaugesDisplayedAsTheLab: true,
      frontierWorkshopYardLabelActive: true,

      mapBlipSingleEntryway: true,
      mirrorlandEntryway: "map_portal_blip",
      mainMenuWebsiteOptionsOnly: true,
      mirrorlandDoorsCategoryOnly: true,
      supportDoesNotEqualOwnership: true,

      bubbleMounted: Boolean(bubble && document.body.contains(bubble)),
      overlayMounted: Boolean(overlay && document.body.contains(overlay)),
      overlayOpen: state.overlayOpen,

      activeLens: state.activeLens,
      currentPath: normalizePath(window.location.pathname || "/"),
      currentRouteId: current?.routeId || "",
      currentPublicRoomName: current?.publicRoomName || "",
      currentEstateLocation: current?.estateLocation || "",
      currentValueCategory: current?.valueCategory || "",

      routeCount: allRoutes().length,
      mirrorlandRoomCount: routesForLens("mirrorland").length,
      mainMenuRoomCount: routesForLens("main").length,
      valueCategoryCount: VALUE_CATEGORIES.length,
      registryAvailable: Boolean(registryApi()),
      estateOverridesApplied: true,

      fullViewportDrag: true,
      joystickScrollActive: true,
      joystickScrolling: state.joystickActive,
      joystickDirection: state.joystickDirection,
      joystickSpeed: Math.round(state.joystickSpeed * 100) / 100,
      joystickScrollForceProfile: JOYSTICK_SCROLL_FORCE_PROFILE,

      fixedBubble: true,
      fullScreenOverlay: true,
      mobileSafePosition: Boolean(
        rect &&
        rect.left >= v.offsetLeft - 1 &&
        rect.top >= v.offsetTop - 1 &&
        rect.right <= v.offsetLeft + v.width + 1 &&
        rect.bottom <= v.offsetTop + v.height + 1
      ),

      positionSource: state.positionSource,
      positionWasClamped: state.positionWasClamped,
      bubblePosition: { ...state.position },

      imageGeneration: false,
      graphicBox: false,
      heavyRuntime: false,
      webGL: false,
      canvasMapEngine: false,

      lastAction: state.lastAction,
      updatedAt: nowIso(),
      errors: state.errors.slice()
    };

    window[STATUS_GLOBAL] = payload;
    window[RECEIPT_GLOBAL] = payload;

    try {
      document.documentElement.dataset.manorBlueprintActive = "true";
      document.documentElement.dataset.manorBlueprintContract = CONTRACT;
      document.documentElement.dataset.manorBlueprintPreviousContract = PREVIOUS_CONTRACT;
      document.documentElement.dataset.manorBlueprintValueCategoryEstateLanguage = "true";
      document.documentElement.dataset.manorBlueprintStaleCardinalRendererSuppressed = "true";
      document.documentElement.dataset.manorBlueprintBuilderPathHidden = "true";
      document.documentElement.dataset.manorBlueprintFileNameIsNotRoomIdentity = "true";
      document.documentElement.dataset.manorBlueprintZiontsVisibleIdentity = "true";
      document.documentElement.dataset.manorBlueprintGaugesDisplayedAsTheLab = "true";
      document.documentElement.dataset.manorBlueprintFrontierWorkshopYard = "true";
      document.documentElement.dataset.manorBlueprintActiveLens = state.activeLens;
      document.documentElement.dataset.manorBlueprintCurrentRoom = payload.currentRouteId;
      document.documentElement.dataset.manorBlueprintCurrentPublicRoomName = payload.currentPublicRoomName;
    } catch (_error) {}

    return payload;
  }

  function refresh() {
    createBubble();
    createOverlay();
    renderOverlay();
    attachDrag();
    initializePosition();
    state.lastAction = "refresh";
    return publishStatus();
  }

  function stop() {
    stopJoystickScroll();
    close();

    if (bubble) {
      try {
        bubble.remove();
      } catch (_error) {}
    }

    if (overlay) {
      try {
        overlay.remove();
      } catch (_error2) {}
    }

    bubble = null;
    overlay = null;
  }

  function exposeApi() {
    const api = {
      contract: API_CONTRACT,
      implementationContract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      priorContract: PRIOR_CONTRACT,

      valueCategoryEstateLanguageActive: true,
      staleCardinalRendererSuppressed: true,
      builderPathHiddenFromVisitorCards: true,
      fileNameIsNotRoomIdentity: true,
      ziontsVisibleIdentity: true,
      gaugesDisplayedAsTheLab: true,
      frontierWorkshopYardLabelActive: true,

      mapBlipSingleEntryway: true,
      mirrorlandEntryway: "map_portal_blip",
      mainMenuWebsiteOptionsOnly: true,
      mirrorlandDoorsCategoryOnly: true,
      supportDoesNotEqualOwnership: true,

      refresh,
      open,
      close,
      toggle,
      setLens,
      resetPosition,
      status: publishStatus,
      stop
    };

    window[API_GLOBAL] = api;
    window[CONTROLLER_GLOBAL] = api;
  }

  function mount() {
    try {
      createBubble();
      createOverlay();
      exposeApi();
      renderOverlay();
      attachDrag();
      initializePosition();

      window.addEventListener("resize", () => {
        applyPosition(state.position, "resize-reclamp", true);
      }, { passive: true });

      window.addEventListener("orientationchange", () => {
        window.setTimeout(() => {
          applyPosition(state.position, "orientation-reclamp", true);
        }, 250);
      }, { passive: true });

      if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", () => {
          applyPosition(state.position, "visual-viewport-reclamp", true);
        }, { passive: true });

        window.visualViewport.addEventListener("scroll", () => {
          if (!state.dragging) applyPosition(state.position, "visual-viewport-scroll-reclamp", false);
        }, { passive: true });
      }

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") close();
      });

      state.lastAction = "mounted";
      publishStatus();
    } catch (error) {
      state.errors.push({
        scope: "mount",
        message: error?.message || String(error),
        time: nowIso()
      });
      publishStatus();
    }
  }

  exposeApi();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();

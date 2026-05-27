// TARGET FILE: /assets/manor-blueprint/manor.blueprint.js
// TNT FULL-FILE REPLACEMENT
// MANOR_BLUEPRINT_MAIN_MENU_INSTRUCTIONS_RUNTIME_TNT_v1
//
// Purpose:
// Preserve the accepted Mirrorland estate-orientation model while correcting
// Main Menu into a regular-website exit board and expanding Instructions into
// a true operating guide for Map / Portal, Return to Orbit, estate-room
// identity, mobile-first construction, and quadrupedic traversal.
//
// Previous runtime contract:
// MANOR_BLUEPRINT_ESTATE_ORIENTATION_RUNTIME_TNT_v1
//
// Binding:
// MANOR_BLUEPRINT_MAIN_MENU_INSTRUCTIONS_SITE_GUIDE_CCR_v1
//
// Owns:
// - Map / Portal blip
// - Mirrorland Doors lens
// - Main Menu lens separation
// - Instructions lens expansion
// - estate-orientation overlay rendering
// - You Are Here placement model for Mirrorland
// - regular website exit board for Main Menu
// - full-viewport drag
// - strong-visible joystick scroll
// - status / receipt globals
//
// Does not own:
// - CSS source truth
// - registry source truth
// - /site-guide/index.html page body
// - page body content
// - planet renderers
// - Frontier node animation
// - Gauges logic
// - generated images
// - GraphicBox

(() => {
  "use strict";

  if (typeof window === "undefined" || typeof document === "undefined") return;

  const CONTRACT = "MANOR_BLUEPRINT_MAIN_MENU_INSTRUCTIONS_RUNTIME_TNT_v1";
  const PREVIOUS_CONTRACT = "MANOR_BLUEPRINT_ESTATE_ORIENTATION_RUNTIME_TNT_v1";
  const BINDING = "MANOR_BLUEPRINT_MAIN_MENU_INSTRUCTIONS_SITE_GUIDE_CCR_v1";
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
    { key: "arrival", label: "Arrival", shortLabel: "Arrival", purpose: "Orient, enter, and cross the public threshold.", order: 10 },
    { key: "world-study", label: "World Study", shortLabel: "Worlds", purpose: "Study worlds, maps, planets, and living environments.", order: 20 },
    { key: "control-instruments", label: "Control / Instruments", shortLabel: "Controls", purpose: "Operate cockpits, labs, inspections, and readiness surfaces.", order: 30 },
    { key: "workshop-frontier", label: "Workshop / Frontier Systems", shortLabel: "Workshop", purpose: "Pressure-test applied systems before they become living-world infrastructure.", order: 40 },
    { key: "law-governance-proof", label: "Law / Governance / Proof", shortLabel: "Proof", purpose: "Study boundaries, governance, proof, and accountability.", order: 50 },
    { key: "public-product-value", label: "Public / Product Value", shortLabel: "Products", purpose: "Open usable offers, public identity, tools, and visitor-facing value.", order: 60 },
    { key: "story-cast-universe", label: "Story / Cast / Universe", shortLabel: "Story", purpose: "Enter characters, story rooms, universe context, and narrative immersion.", order: 70 }
  ]);

  const CATEGORY_BY_KEY = VALUE_CATEGORIES.reduce((acc, item) => {
    acc[item.key] = item;
    return acc;
  }, Object.create(null));

  const ROOMS = Object.freeze({
    "/": {
      id: "compass",
      menu: "main",
      name: "Compass Desk",
      zone: "Front Orientation Desk",
      category: "arrival",
      purpose: "Start here, regain orientation, and choose the next public route.",
      action: "Open Compass",
      context: "The front orientation desk for the public website.",
      deeper: ["/door/", "/home/", "/laws/", "/gauges/"],
      nearby: ["/door/", "/home/"],
      connected: ["/showroom/"],
      returns: []
    },

    "/door/": {
      id: "door",
      menu: "main",
      name: "Front Door",
      zone: "Public Threshold",
      category: "arrival",
      purpose: "Cross the ordinary website threshold.",
      action: "Open Door",
      context: "The public threshold of the website. It is separate from the Mirrorland Map / Portal.",
      inside: "/",
      nearby: ["/home/", "/laws/"],
      deeper: ["/home/"],
      connected: ["/showroom/"],
      returns: ["/"]
    },

    "/home/": {
      id: "home",
      menu: "main",
      name: "Main Hall",
      zone: "Central House",
      category: "arrival",
      purpose: "Return to the central public hall of Diamond Gate Bridge.",
      action: "Open Main Hall",
      context: "Main Hall stabilizes the public website before branching into products, laws, proof, or Mirrorland.",
      inside: "/",
      nearby: ["/door/", "/products/", "/laws/"],
      deeper: ["/products/", "/laws/"],
      connected: ["/showroom/"],
      returns: ["/"]
    },

    "/site-guide/": {
      id: "site-guide",
      menu: "main",
      name: "Guide Desk",
      zone: "Orientation Desk",
      category: "arrival",
      purpose: "Read how the website, estate model, Map / Portal, Return to Orbit, and quadrupedic traversal connect.",
      action: "Open Guide Desk",
      context: "Guide Desk explains the website construction narrative without turning Mirrorland into a file directory.",
      inside: "/",
      nearby: ["/", "/gauges/", "/laws/"],
      deeper: [],
      connected: ["/showroom/"],
      returns: ["/"]
    },

    "/laws/": {
      id: "laws",
      menu: "main",
      name: "Law Library",
      zone: "Law Library",
      category: "law-governance-proof",
      purpose: "Study the rules, boundaries, and constraints that keep the estate coherent.",
      action: "Open Law Library",
      context: "Law Library supports Mirrorland, Frontier, products, and public claims by keeping each page attached to discipline and consequence.",
      inside: "/",
      nearby: ["/governance/", "/gauges/"],
      deeper: ["/governance/"],
      connected: ["/showroom/", "/explore/frontier/"],
      returns: ["/"]
    },

    "/governance/": {
      id: "governance",
      menu: "main",
      name: "Council Room",
      zone: "Governance Hall",
      category: "law-governance-proof",
      purpose: "Review policy, public risk, responsibility, and decision structure.",
      action: "Open Council Room",
      context: "Council Room keeps ambitious systems from outrunning responsibility.",
      inside: "/laws/",
      nearby: ["/laws/", "/gauges/"],
      deeper: [],
      connected: ["/explore/frontier/"],
      returns: ["/laws/", "/"]
    },

    "/gauges/": {
      id: "gauges",
      menu: "main",
      name: "The Lab",
      zone: "Measurement Lab",
      category: "control-instruments",
      purpose: "Inspect route status, readiness signals, and measurement results.",
      action: "Open The Lab",
      context: "The Lab is the estate’s measurement room. It supports proof and readiness without becoming a Mirrorland room.",
      inside: "/",
      nearby: ["/laws/", "/governance/"],
      deeper: ["/gauges/h-earth/"],
      connected: ["/showroom/globe/h-earth/", "/explore/frontier/"],
      returns: ["/"]
    },

    "/gauges/h-earth/": {
      id: "gauges-h-earth",
      menu: "main",
      name: "H-Earth Lab Bench",
      zone: "Measurement Lab",
      category: "control-instruments",
      purpose: "Inspect H-Earth readiness from the lab bench.",
      action: "Open Lab Bench",
      context: "H-Earth Lab Bench inspects a specific world’s route state without confusing the lab with the world itself.",
      inside: "/gauges/",
      nearby: ["/gauges/", "/showroom/globe/h-earth/"],
      deeper: [],
      connected: ["/showroom/globe/h-earth/"],
      returns: ["/gauges/", "/"]
    },

    "/products/": {
      id: "products",
      menu: "main",
      name: "Product Gallery",
      zone: "Product Gallery",
      category: "public-product-value",
      purpose: "View usable objects, offers, games, tools, and product pathways.",
      action: "Open Gallery",
      context: "Product Gallery turns ideas into usable objects and offers without mixing them with Mirrorland navigation.",
      inside: "/",
      nearby: ["/about-this-underdog/", "/home/"],
      deeper: [],
      connected: ["/showroom/", "/explore/frontier/"],
      returns: ["/home/", "/"]
    },

    "/about-this-underdog/": {
      id: "meet-sean",
      menu: "main",
      name: "Host Portrait",
      zone: "Portrait Room",
      category: "public-product-value",
      purpose: "Meet the person, mission, and public-facing host of Diamond Gate Bridge.",
      action: "Meet Sean",
      context: "Host Portrait introduces the human mission behind the estate.",
      inside: "/",
      nearby: ["/products/", "/home/"],
      deeper: [],
      connected: ["/showroom/"],
      returns: ["/"]
    },

    "/showroom/": {
      id: "atrium",
      menu: "mirrorland",
      name: "Atrium",
      zone: "Mirrorland Entrance Atrium",
      category: "arrival",
      purpose: "Enter the immersive estate threshold where visible objects and Mirrorland doors begin.",
      action: "Enter Atrium",
      context: "The Atrium frames the Diamond Lattice object and prepares the visitor for Mirrorland.",
      nearby: ["/showroom/globe/", "/characters/", "/nine-summits/universe/"],
      deeper: ["/showroom/globe/"],
      connected: ["/", "/explore/frontier/"],
      returns: ["/"]
    },

    "/showroom/globe/": {
      id: "atlas-study",
      menu: "mirrorland",
      name: "Atlas Study",
      zone: "Atlas Study",
      category: "world-study",
      purpose: "Study the estate’s worlds, planetary doors, reference bodies, and living environments.",
      action: "Open Atlas Study",
      context: "Atlas Study is the world-study room. It is not a route directory.",
      inside: "/showroom/",
      nearby: ["/showroom/", "/characters/", "/nine-summits/universe/"],
      deeper: ["/showroom/globe/earth/", "/showroom/globe/audralia/", "/showroom/globe/hearth/", "/showroom/globe/h-earth/"],
      connected: ["/explore/frontier/"],
      returns: ["/showroom/"]
    },

    "/showroom/globe/earth/": {
      id: "zionts",
      menu: "mirrorland",
      name: "ZIONTS Room",
      pronunciation: "Zience",
      zone: "Atlas Study",
      category: "world-study",
      purpose: "Study ZIONTS, pronounced Zience, as the first contextual world-door in the Atlas Study.",
      action: "Enter ZIONTS",
      context: "The file address is under Earth, but the estate-room identity is ZIONTS. The map shows what the room means, not what the builder path is named.",
      inside: "/showroom/globe/",
      nearby: ["/showroom/globe/audralia/", "/showroom/globe/hearth/", "/showroom/globe/h-earth/"],
      deeper: [],
      connected: ["/showroom/globe/audralia/"],
      returns: ["/showroom/globe/", "/showroom/"]
    },

    "/showroom/globe/audralia/": {
      id: "audralia",
      menu: "mirrorland",
      name: "Audralia Conservatory",
      zone: "Atlas Study",
      category: "world-study",
      purpose: "Enter Audralia as the constructive living-world path inside Mirrorland.",
      action: "Enter Conservatory",
      context: "Audralia Conservatory introduces the constructive world before its body, cockpit, and future systems are inspected elsewhere.",
      inside: "/showroom/globe/",
      nearby: ["/showroom/globe/earth/", "/showroom/globe/hearth/", "/showroom/globe/h-earth/"],
      deeper: ["/showroom/globe/audralia/planet/", "/showroom/globe/audralia/disposition/"],
      connected: ["/explore/frontier/"],
      returns: ["/showroom/globe/", "/showroom/"]
    },

    "/showroom/globe/audralia/planet/": {
      id: "audralia-worldroom",
      menu: "mirrorland",
      name: "Audralia Worldroom",
      zone: "Audralia Conservatory",
      category: "world-study",
      purpose: "Inspect Audralia as a visible world-body without claiming the world is final.",
      action: "Inspect Worldroom",
      context: "Audralia Worldroom gives a focused planet-body read while keeping final terrain, water, and completion claims held until earned.",
      inside: "/showroom/globe/audralia/",
      nearby: ["/showroom/globe/audralia/disposition/"],
      deeper: [],
      connected: ["/explore/frontier/"],
      returns: ["/showroom/globe/audralia/", "/showroom/globe/"]
    },

    "/showroom/globe/audralia/disposition/": {
      id: "control-cockpit",
      menu: "mirrorland",
      name: "Control Cockpit",
      zone: "Audralia Conservatory",
      category: "control-instruments",
      purpose: "Operate Audralia’s cockpit-style instruments and inspect the world’s disposition.",
      action: "Open Cockpit",
      context: "Control Cockpit is an instrument room for operating and inspecting Audralia’s disposition layer.",
      inside: "/showroom/globe/audralia/",
      nearby: ["/showroom/globe/audralia/planet/"],
      deeper: [],
      connected: ["/gauges/", "/explore/frontier/"],
      returns: ["/showroom/globe/audralia/", "/showroom/globe/"]
    },

    "/showroom/globe/hearth/": {
      id: "hearth",
      menu: "mirrorland",
      name: "Hearth Room",
      zone: "Atlas Study",
      category: "world-study",
      purpose: "Study Hearth as a forming world in the planetary estate.",
      action: "Enter Hearth Room",
      context: "Hearth Room keeps Hearth readable as its own world inside the Atlas Study.",
      inside: "/showroom/globe/",
      nearby: ["/showroom/globe/earth/", "/showroom/globe/audralia/", "/showroom/globe/h-earth/"],
      deeper: [],
      connected: ["/explore/frontier/"],
      returns: ["/showroom/globe/"]
    },

    "/showroom/globe/h-earth/": {
      id: "h-earth",
      menu: "mirrorland",
      name: "H-Earth Annex",
      zone: "Atlas Study",
      category: "world-study",
      purpose: "Study the H-Earth experimental world path from its annex.",
      action: "Open Annex",
      context: "H-Earth Annex is a world-study room. It stays separate from The Lab, which measures H-Earth readiness.",
      inside: "/showroom/globe/",
      nearby: ["/showroom/globe/earth/", "/showroom/globe/audralia/", "/showroom/globe/hearth/"],
      deeper: [],
      connected: ["/gauges/h-earth/"],
      returns: ["/showroom/globe/"]
    },

    "/characters/": {
      id: "characters",
      menu: "mirrorland",
      name: "Portrait Hall",
      zone: "Story Wing",
      category: "story-cast-universe",
      purpose: "Meet the cast, faces, voices, and narrative presences of the estate.",
      action: "Enter Portrait Hall",
      context: "Portrait Hall organizes characters as part of the immersive estate.",
      inside: "/showroom/",
      nearby: ["/nine-summits/universe/", "/showroom/globe/"],
      deeper: [],
      connected: ["/showroom/globe/audralia/"],
      returns: ["/showroom/"]
    },

    "/nine-summits/universe/": {
      id: "nine-summits",
      menu: "mirrorland",
      name: "Universe Gallery",
      zone: "Story Wing",
      category: "story-cast-universe",
      purpose: "Open the larger story-world context surrounding the estate.",
      action: "Open Universe Gallery",
      context: "Universe Gallery keeps the larger narrative field accessible without forcing it into technical site language.",
      inside: "/showroom/",
      nearby: ["/characters/", "/showroom/globe/"],
      deeper: [],
      connected: ["/showroom/globe/audralia/"],
      returns: ["/showroom/"]
    },

    "/explore/frontier/": {
      id: "frontier",
      menu: "mirrorland",
      name: "Frontier Workshop Yard",
      zone: "West Grounds",
      category: "workshop-frontier",
      purpose: "Enter the outdoor testing yard where Audralia’s future systems are pressure-tested.",
      action: "Enter Workshop Yard",
      context: "Frontier Workshop Yard is where possible systems are examined before they are allowed to become part of Audralia’s constructive future.",
      inside: "/showroom/",
      nearby: ["/showroom/globe/audralia/", "/gauges/", "/laws/"],
      deeper: [
        "/explore/frontier/energy/",
        "/explore/frontier/water/",
        "/explore/frontier/waste/",
        "/explore/frontier/closed-loop/",
        "/explore/frontier/infrastructure/",
        "/explore/frontier/lattice/",
        "/explore/frontier/manual/",
        "/explore/frontier/shimmer/",
        "/explore/frontier/trajectory/",
        "/explore/frontier/vision/",
        "/explore/frontier/urban/"
      ],
      connected: ["/showroom/globe/audralia/", "/laws/", "/gauges/"],
      returns: ["/showroom/", "/"]
    },

    "/explore/frontier/energy/": {
      id: "fusion-bench",
      menu: "mirrorland",
      name: "Fusion Bench",
      zone: "Frontier Workshop Yard",
      category: "workshop-frontier",
      purpose: "Scratch the surface of power, storage, solar support, plasma regime, and long-range fusion constraints.",
      action: "Open Fusion Systems",
      context: "Fusion Bench studies the energy pathway without claiming commercial fusion completion.",
      inside: "/explore/frontier/",
      nearby: ["/explore/frontier/water/", "/explore/frontier/waste/", "/explore/frontier/infrastructure/"],
      deeper: [],
      connected: ["/laws/", "/gauges/"],
      returns: ["/explore/frontier/"]
    },

    "/explore/frontier/water/": {
      id: "closed-water-systems",
      menu: "mirrorland",
      name: "Closed Water Systems Bench",
      zone: "Frontier Workshop Yard",
      category: "workshop-frontier",
      purpose: "Scratch the surface of capture, treatment, routing, reuse, storage, and continuity.",
      action: "Open Water Systems",
      context: "Closed Water Systems Bench studies how a future world preserves flow, storage, cleanliness, continuity, and responsible reuse.",
      inside: "/explore/frontier/",
      nearby: ["/explore/frontier/energy/", "/explore/frontier/waste/", "/explore/frontier/closed-loop/"],
      deeper: [],
      connected: ["/laws/", "/gauges/"],
      returns: ["/explore/frontier/"]
    },

    "/explore/frontier/waste/": {
      id: "wastewater-systems",
      menu: "mirrorland",
      name: "Wastewater Systems Bench",
      zone: "Frontier Workshop Yard",
      category: "workshop-frontier",
      purpose: "Scratch the surface of sanitation, wastewater, return-material logic, recovery, and reuse.",
      action: "Open Wastewater Systems",
      context: "Wastewater Systems Bench studies discard, sanitation, recovery, reuse, and return-material pathways.",
      inside: "/explore/frontier/",
      nearby: ["/explore/frontier/energy/", "/explore/frontier/water/", "/explore/frontier/closed-loop/"],
      deeper: [],
      connected: ["/laws/", "/gauges/"],
      returns: ["/explore/frontier/"]
    },

    "/explore/frontier/closed-loop/": {
      id: "closed-loop",
      menu: "mirrorland",
      name: "Closed Loop Table",
      zone: "Frontier Workshop Yard",
      category: "workshop-frontier",
      purpose: "Scratch the surface of feedback, accountability, capture, correction, and system answer-back.",
      action: "Open Closed Loop",
      context: "Closed Loop Table studies whether a system can capture outputs, correct losses, and prove accountability before scaling.",
      inside: "/explore/frontier/",
      nearby: ["/explore/frontier/water/", "/explore/frontier/waste/", "/explore/frontier/lattice/"],
      deeper: [],
      connected: ["/laws/", "/gauges/"],
      returns: ["/explore/frontier/"]
    },

    "/explore/frontier/infrastructure/": {
      id: "infrastructure",
      menu: "mirrorland",
      name: "Infrastructure Bay",
      zone: "Frontier Workshop Yard",
      category: "workshop-frontier",
      purpose: "Scratch the surface of roads, supports, utilities, corridors, and load-bearing systems.",
      action: "Open Infrastructure Bay",
      context: "Infrastructure Bay studies whether a future world can carry weight before people, cities, and systems depend on it.",
      inside: "/explore/frontier/",
      nearby: ["/explore/frontier/energy/", "/explore/frontier/urban/", "/explore/frontier/trajectory/"],
      deeper: [],
      connected: ["/laws/", "/gauges/"],
      returns: ["/explore/frontier/"]
    },

    "/explore/frontier/lattice/": {
      id: "lattice",
      menu: "mirrorland",
      name: "Lattice Table",
      zone: "Frontier Workshop Yard",
      category: "workshop-frontier",
      purpose: "Scratch the surface of placement, relationship, pattern, count, and measurable expansion.",
      action: "Open Lattice Table",
      context: "Lattice Table asks whether future growth can remain ordered rather than expanding randomly.",
      inside: "/explore/frontier/",
      nearby: ["/explore/frontier/closed-loop/", "/explore/frontier/manual/", "/explore/frontier/trajectory/"],
      deeper: [],
      connected: ["/laws/", "/gauges/"],
      returns: ["/explore/frontier/"]
    },

    "/explore/frontier/manual/": {
      id: "manual",
      menu: "mirrorland",
      name: "Field Manual Desk",
      zone: "Frontier Workshop Yard",
      category: "workshop-frontier",
      purpose: "Scratch the surface of operating language, field notes, methods, and practical instructions.",
      action: "Open Field Manual",
      context: "Field Manual Desk keeps frontier systems from becoming mysterious by translating them into operating language.",
      inside: "/explore/frontier/",
      nearby: ["/explore/frontier/lattice/", "/explore/frontier/shimmer/", "/explore/frontier/vision/"],
      deeper: [],
      connected: ["/laws/", "/gauges/"],
      returns: ["/explore/frontier/"]
    },

    "/explore/frontier/shimmer/": {
      id: "shimmer",
      menu: "mirrorland",
      name: "Shimmer Signal Table",
      zone: "Frontier Workshop Yard",
      category: "workshop-frontier",
      purpose: "Scratch the surface of signal, perception, visible clues, and surface change.",
      action: "Open Shimmer Signal",
      context: "Shimmer Signal Table studies the visible clue that motion, change, or system response is beginning.",
      inside: "/explore/frontier/",
      nearby: ["/explore/frontier/manual/", "/explore/frontier/vision/", "/explore/frontier/trajectory/"],
      deeper: [],
      connected: ["/laws/", "/gauges/"],
      returns: ["/explore/frontier/"]
    },

    "/explore/frontier/trajectory/": {
      id: "trajectory",
      menu: "mirrorland",
      name: "Trajectory Table",
      zone: "Frontier Workshop Yard",
      category: "workshop-frontier",
      purpose: "Scratch the surface of direction, launch, arc, impact, and forward motion.",
      action: "Open Trajectory Table",
      context: "Trajectory Table studies whether a frontier system has a direction strong enough to carry it forward.",
      inside: "/explore/frontier/",
      nearby: ["/explore/frontier/infrastructure/", "/explore/frontier/lattice/", "/explore/frontier/shimmer/"],
      deeper: [],
      connected: ["/laws/", "/gauges/"],
      returns: ["/explore/frontier/"]
    },

    "/explore/frontier/vision/": {
      id: "vision",
      menu: "mirrorland",
      name: "Vision Window",
      zone: "Frontier Workshop Yard",
      category: "workshop-frontier",
      purpose: "Scratch the surface of horizon, imagination, future clarity, and long-range consequence.",
      action: "Open Vision Window",
      context: "Vision Window keeps Frontier attached to the horizon beyond the immediate experiment.",
      inside: "/explore/frontier/",
      nearby: ["/explore/frontier/manual/", "/explore/frontier/shimmer/", "/explore/frontier/urban/"],
      deeper: [],
      connected: ["/laws/", "/gauges/"],
      returns: ["/explore/frontier/"]
    },

    "/explore/frontier/urban/": {
      id: "urban",
      menu: "mirrorland",
      name: "Urban Planning Table",
      zone: "Frontier Workshop Yard",
      category: "workshop-frontier",
      purpose: "Scratch the surface of civic pressure, corridors, density, city systems, and built-world consequence.",
      action: "Open Urban Table",
      context: "Urban Planning Table studies how frontier systems behave once they meet public space, density, corridors, and the built world.",
      inside: "/explore/frontier/",
      nearby: ["/explore/frontier/infrastructure/", "/explore/frontier/vision/", "/explore/frontier/trajectory/"],
      deeper: [],
      connected: ["/laws/", "/gauges/"],
      returns: ["/explore/frontier/"]
    }
  });

  let bubble = null;
  let overlay = null;
  let joystickRaf = 0;
  let staleGuardTimer = 0;
  let mutationObserver = null;

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
    staleRendererSuppressedCount: 0,
    errors: []
  };

  function stopPriorController() {
    const prior = window[CONTROLLER_GLOBAL];

    if (prior && prior.implementationContract !== CONTRACT && typeof prior.stop === "function") {
      try {
        prior.stop();
      } catch (_error) {}
    }
  }

  stopPriorController();

  function nowIso() {
    return new Date().toISOString();
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

  function room(path) {
    return ROOMS[normalizePath(path)] || null;
  }

  function allRooms() {
    return Object.keys(ROOMS)
      .map((path) => ({ path, ...ROOMS[path] }))
      .sort((a, b) => categoryOrder(a.category) - categoryOrder(b.category) || a.name.localeCompare(b.name));
  }

  function roomsForLens(lens) {
    const menu = lens === "main" ? "main" : "mirrorland";
    return allRooms().filter((item) => item.menu === menu);
  }

  function categoryOrder(category) {
    return CATEGORY_BY_KEY[category]?.order || 999;
  }

  function currentRoom() {
    const path = normalizePath(window.location.pathname || "/");

    return room(path)
      ? { path, ...room(path) }
      : allRooms()
          .filter((item) => item.path !== "/" && path.startsWith(item.path))
          .sort((a, b) => b.path.length - a.path.length)[0] || { path: "/", ...room("/") };
  }

  function resolveList(paths) {
    return (paths || [])
      .map((path) => {
        const normalized = normalizePath(path);
        const item = room(normalized);
        return item ? { path: normalized, ...item } : null;
      })
      .filter(Boolean);
  }

  function groupedByCategory(items) {
    const grouped = new Map();

    VALUE_CATEGORIES.forEach((category) => grouped.set(category.key, []));

    items.forEach((item) => {
      if (!grouped.has(item.category)) grouped.set(item.category, []);
      grouped.get(item.category).push(item);
    });

    return grouped;
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
        binding: BINDING,
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

  function removeExistingBlueprintNodes() {
    const overlays = Array.from(document.querySelectorAll(OVERLAY_SELECTOR));
    const bubbles = Array.from(document.querySelectorAll(BUBBLE_SELECTOR));

    overlays.forEach((node) => {
      if (node !== overlay) {
        try {
          node.remove();
        } catch (_error) {}
      }
    });

    bubbles.forEach((node) => {
      if (node !== bubble) {
        try {
          node.remove();
        } catch (_error) {}
      }
    });
  }

  function createBubble() {
    removeExistingBlueprintNodes();

    bubble = document.querySelector(BUBBLE_SELECTOR);

    if (!bubble) {
      bubble = document.createElement("button");
      document.body.appendChild(bubble);
    }

    bubble.type = "button";
    bubble.className = "dgb-blueprint-bubble";
    bubble.setAttribute("aria-label", "Open Mirrorland Map Portal");
    bubble.setAttribute("data-dgb-blueprint-bubble", "true");
    bubble.setAttribute("data-manor-blueprint-contract", CONTRACT);
    bubble.setAttribute("data-main-menu-separated", "true");
    bubble.setAttribute("data-instructions-expanded", "true");
    bubble.setAttribute("data-estate-orientation-runtime", "true");
    bubble.setAttribute("data-not-directory", "true");
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
    removeExistingBlueprintNodes();

    overlay = document.querySelector(OVERLAY_SELECTOR);

    if (!overlay) {
      overlay = document.createElement("section");
      document.body.appendChild(overlay);
    }

    overlay.className = "dgb-blueprint-overlay";
    overlay.hidden = true;
    overlay.setAttribute("data-dgb-blueprint-overlay", "true");
    overlay.setAttribute("data-open", "false");
    overlay.setAttribute("data-manor-blueprint-contract", CONTRACT);
    overlay.setAttribute("data-main-menu-separated", "true");
    overlay.setAttribute("data-instructions-expanded", "true");
    overlay.setAttribute("data-estate-orientation-runtime", "true");
    overlay.setAttribute("data-not-directory", "true");
    overlay.setAttribute("data-builder-path-hidden", "true");
    overlay.setAttribute("data-zionts-visible-identity", "true");
    overlay.setAttribute("aria-label", "Mirrorland estate orientation map");

    return overlay;
  }

  function lensTitle() {
    if (state.activeLens === "main") return "Main Menu";
    if (state.activeLens === "instructions") return "Instructions";
    return "Mirrorland Doors";
  }

  function lensSubtitle() {
    if (state.activeLens === "main") {
      return "Exit Mirrorland and return to regular Diamond Gate Bridge website rooms.";
    }

    if (state.activeLens === "instructions") {
      return "How the Map / Portal, Main Menu, Mirrorland Doors, Return to Orbit, and Guide Desk work.";
    }

    return "Find your placement first, then choose nearby, deeper, connected, or return rooms.";
  }

  function renderMiniRoom(item, relation) {
    const current = currentRoom();
    const isCurrent = current.path === item.path;

    return `
      <a
        class="dgb-bp-estate-room-card${isCurrent ? " dgb-bp-estate-room-card-current" : ""}"
        href="${escapeHtml(item.path)}"
        data-room-id="${escapeHtml(item.id)}"
        data-placement="${escapeHtml(relation)}"
        data-value-category="${escapeHtml(item.category)}"
        data-current="${isCurrent ? "true" : "false"}"
      >
        <span class="dgb-bp-estate-room-placement">${escapeHtml(relation)}</span>
        <strong>${escapeHtml(item.name)}</strong>
        <span>${escapeHtml(item.zone)}</span>
      </a>
    `;
  }

  function renderCompartment(title, items, emptyText, relation) {
    return `
      <section class="dgb-bp-placement-compartment" data-placement-compartment="${escapeHtml(relation)}">
        <header>
          <b>${escapeHtml(title)}</b>
        </header>
        <div class="dgb-bp-placement-list">
          ${
            items.length
              ? items.map((item) => renderMiniRoom(item, relation)).join("")
              : `<div class="dgb-bp-placement-empty">${escapeHtml(emptyText)}</div>`
          }
        </div>
      </section>
    `;
  }

  function renderOrientationPanel() {
    const current = currentRoom();
    const inside = current.inside ? resolveList([current.inside]) : [];
    const nearby = resolveList(current.nearby);
    const deeper = resolveList(current.deeper);
    const connected = resolveList(current.connected);
    const returns = resolveList(current.returns);
    const category = CATEGORY_BY_KEY[current.category] || CATEGORY_BY_KEY.arrival;

    return `
      <section class="dgb-bp-orientation-panel" data-current-room="${escapeHtml(current.id)}">
        <div class="dgb-bp-you-are-here">
          <span class="dgb-bp-chip">You Are Here</span>
          <h3>${escapeHtml(current.name)}</h3>
          <p>${escapeHtml(current.context || current.purpose)}</p>
          <div class="dgb-bp-location-strip">
            <span>${escapeHtml(current.zone)}</span>
            <span>${escapeHtml(category.label)}</span>
            ${current.pronunciation ? `<span>Pronounced ${escapeHtml(current.pronunciation)}</span>` : ""}
          </div>
        </div>

        <div class="dgb-bp-placement-grid">
          ${renderCompartment("Inside", inside, "This is a top-level estate position.", "inside")}
          ${renderCompartment("Nearby", nearby, "No sibling rooms assigned.", "nearby")}
          ${renderCompartment("Deeper", deeper, "No deeper rooms assigned.", "deeper")}
          ${renderCompartment("Connected", connected, "No connected rooms assigned.", "connected")}
          ${renderCompartment("Return", returns, "No return path required.", "return")}
        </div>
      </section>
    `;
  }

  function renderWebsiteExitPanel() {
    const current = currentRoom();
    const currentCategory = CATEGORY_BY_KEY[current.category] || CATEGORY_BY_KEY.arrival;
    const insideMirrorland = current.menu === "mirrorland";

    return `
      <section
        class="dgb-bp-orientation-panel dgb-bp-website-exit-panel"
        data-main-menu-exit-board="true"
        data-current-room="${escapeHtml(current.id)}"
      >
        <div class="dgb-bp-you-are-here">
          <span class="dgb-bp-chip">${insideMirrorland ? "Currently Inside Mirrorland" : "Current Website Room"}</span>
          <h3>${escapeHtml(current.name)}</h3>
          <p>
            ${
              insideMirrorland
                ? "Main Menu is the exit board back to the regular Diamond Gate Bridge website. The options shown here are website rooms only."
                : "Main Menu shows regular Diamond Gate Bridge website rooms."
            }
          </p>
          <div class="dgb-bp-location-strip">
            <span>${escapeHtml(current.zone)}</span>
            <span>${escapeHtml(currentCategory.label)}</span>
            <span>Main Menu Options Only</span>
          </div>
        </div>

        <div class="dgb-bp-placement-compartment" data-placement-compartment="return">
          <header>
            <b>Website Exit Board</b>
          </header>
          <div class="dgb-bp-placement-empty">
            This tab intentionally separates regular website navigation from Mirrorland room movement.
          </div>
        </div>
      </section>
    `;
  }

  function renderCategorySection(category, items) {
    if (!items.length) return "";

    return `
      <section class="dgb-bp-estate-zone" data-value-category="${escapeHtml(category.key)}">
        <header class="dgb-bp-estate-zone-head">
          <span>${escapeHtml(category.shortLabel)}</span>
          <h3>${escapeHtml(category.label)}</h3>
          <p>${escapeHtml(category.purpose)}</p>
        </header>

        <div class="dgb-bp-estate-room-grid">
          ${items.map((item) => renderFullRoomCard(item)).join("")}
        </div>
      </section>
    `;
  }

  function renderFullRoomCard(item) {
    const current = currentRoom();
    const isCurrent = current.path === item.path;
    const category = CATEGORY_BY_KEY[item.category] || CATEGORY_BY_KEY.arrival;

    return `
      <article
        class="dgb-bp-estate-room-card dgb-bp-estate-room-card-full${isCurrent ? " dgb-bp-estate-room-card-current" : ""}"
        data-room-id="${escapeHtml(item.id)}"
        data-value-category="${escapeHtml(item.category)}"
        data-current="${isCurrent ? "true" : "false"}"
      >
        <div class="dgb-bp-estate-room-top">
          <span class="dgb-bp-estate-room-placement">${isCurrent ? "Here" : escapeHtml(category.shortLabel)}</span>
          <span class="dgb-bp-estate-room-zone">${escapeHtml(item.zone)}</span>
        </div>

        <h4>${escapeHtml(item.name)}</h4>
        <p>${escapeHtml(item.purpose)}</p>

        <details class="dgb-bp-room-details">
          <summary>Read room</summary>
          <div class="dgb-bp-room-details-body">
            <b>What this room is</b>
            <p>${escapeHtml(item.context)}</p>
            <b>Where it sits</b>
            <p>${escapeHtml(item.zone)} · ${escapeHtml(category.label)}</p>
            <b>Movement</b>
            <p>${escapeHtml(movementSummary(item))}</p>
          </div>
        </details>

        <a class="dgb-bp-room-action" href="${escapeHtml(item.path)}">${escapeHtml(item.action)}</a>
      </article>
    `;
  }

  function movementSummary(item) {
    const parts = [];

    if (item.inside) {
      const parent = room(item.inside);
      if (parent) parts.push(`Inside ${parent.name}.`);
    }

    if (item.nearby?.length) parts.push(`${item.nearby.length} nearby room${item.nearby.length === 1 ? "" : "s"}.`);
    if (item.deeper?.length) parts.push(`${item.deeper.length} deeper room${item.deeper.length === 1 ? "" : "s"}.`);
    if (item.connected?.length) parts.push(`${item.connected.length} connected path${item.connected.length === 1 ? "" : "s"}.`);

    return parts.length ? parts.join(" ") : "This room opens directly from the active map lens.";
  }

  function renderMirrorlandEstateMap() {
    const rooms = roomsForLens("mirrorland");
    const grouped = groupedByCategory(rooms);

    return `
      <div class="dgb-bp-estate-orientation-layout" data-lens-layout="mirrorland-orientation">
        ${renderOrientationPanel()}

        <div class="dgb-bp-estate-map" data-estate-map="orientation-placement">
          ${VALUE_CATEGORIES.map((category) => renderCategorySection(category, grouped.get(category.key) || [])).join("")}
        </div>
      </div>
    `;
  }

  function renderMainMenuExitBoard() {
    const rooms = roomsForLens("main");
    const grouped = groupedByCategory(rooms);

    return `
      <div class="dgb-bp-estate-orientation-layout" data-lens-layout="main-menu-exit-board" data-main-menu-separated="true">
        ${renderWebsiteExitPanel()}

        <div class="dgb-bp-estate-map" data-estate-map="regular-website-options">
          ${VALUE_CATEGORIES.map((category) => renderCategorySection(category, grouped.get(category.key) || [])).join("")}
        </div>
      </div>
    `;
  }

  function renderInstructionsLens() {
    const instructionSections = [
      {
        label: "Map / Portal",
        title: "Global Mirrorland Estate Navigation",
        body: "The floating Map / Portal is the estate navigation layer for Mirrorland. It is not a simple dropdown, route list, or sitemap. It tells the visitor where they are, what contains them, what is nearby, what goes deeper, what connects outward, and how to return."
      },
      {
        label: "Main Menu",
        title: "Exit Board to the Regular Website",
        body: "Main Menu is separate from Mirrorland Doors. From anywhere inside Mirrorland, Main Menu lets the visitor leave the immersive estate layer and jump back to regular website rooms such as Compass Desk, Front Door, Main Hall, Law Library, The Lab, Product Gallery, Host Portrait, and Guide Desk."
      },
      {
        label: "Mirrorland Doors",
        title: "Immersive Estate-Room Navigation",
        body: "Mirrorland Doors uses visitor-facing estate room identity. The map shows Atrium, Atlas Study, ZIONTS Room, Audralia Conservatory, Frontier Workshop Yard, Control Cockpit, and other rooms according to what they mean inside the estate."
      },
      {
        label: "Return to Orbit",
        title: "Local Page Navigation",
        body: "Return to Orbit is different from the Map / Portal. Return to Orbit belongs to a specific page and returns the reader to that page’s own category orbit, gem orbit, node field, or section field. Map / Portal is global estate navigation; Return to Orbit is local page movement."
      },
      {
        label: "Estate Room Identity",
        title: "Room Names Are Not Builder Paths",
        body: "Visitor-facing room names explain context. Builder paths may differ. For example, the route /showroom/globe/earth/ displays as ZIONTS Room, pronounced Zience, because the map shows what the room means rather than what the file address is named."
      },
      {
        label: "Mobile-First Native Build",
        title: "Designed from a Mobile Device",
        body: "This system was designed and assembled from a mobile device using native code. The project began in late January 2026 and reached this integrated estate/navigation structure within roughly four months."
      },
      {
        label: "Why It Is Different",
        title: "Not a Sitemap, Dropdown, or Directory",
        body: "The navigation separates context, movement, destination, proof, worldbuilding, and return logic. It lets the visitor understand place before action instead of forcing them to decode a technical route tree."
      },
      {
        label: "Quadrupedic Traversal",
        title: "Four-Leg Design Logic",
        body: "The website moves through four coordinated legs: North for orientation, structure, and law; East for story, worlds, and visible expression; South for proof, gauges, and measurement; West for products, application, deployment, and Frontier systems."
      },
      {
        label: "Guide Desk",
        title: "Full Construction Narrative",
        body: "Guide Desk is the regular website page for the full explanation of how Diamond Gate Bridge connects: the estate model, Main Menu, Mirrorland Doors, Map / Portal, Return to Orbit, Frontier, Products, Laws, Gauges, Audralia, and quadrupedic traversal."
      }
    ];

    return `
      <div class="dgb-bp-instructions-grid" data-instructions-expanded="true">
        ${instructionSections.map((item, index) => `
          <article class="dgb-bp-instruction-card" data-instruction-category="${escapeHtml(item.label)}">
            <b>${escapeHtml(item.label)}</b>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.body)}</p>
            ${item.label === "Guide Desk" ? `<a class="dgb-bp-room-action" href="/site-guide/">Open Guide Desk</a>` : ""}
          </article>
        `).join("")}
      </div>
    `;
  }

  function renderActiveLens() {
    if (state.activeLens === "main") return renderMainMenuExitBoard();
    if (state.activeLens === "instructions") return renderInstructionsLens();
    return renderMirrorlandEstateMap();
  }

  function renderOverlay() {
    if (!overlay) return;

    overlay.innerHTML = `
      <div class="dgb-bp-topbar">
        <div class="dgb-bp-titleblock">
          <div class="dgb-bp-kicker">${
            state.activeLens === "main"
              ? "Regular Website Exit Board"
              : state.activeLens === "instructions"
                ? "Navigation Operating Guide"
                : "Estate Orientation Map"
          }</div>
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
          <div class="dgb-bp-current-pill">${
            state.activeLens === "main"
              ? "Website Rooms Only"
              : state.activeLens === "instructions"
                ? "How To Read"
                : "Estate Rooms"
          }</div>
        </div>

        <div
          class="dgb-bp-content"
          data-estate-orientation-runtime="true"
          data-main-menu-separated="${state.activeLens === "main" ? "true" : "false"}"
          data-instructions-expanded="${state.activeLens === "instructions" ? "true" : "false"}"
        >
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

    state.staleRendererSuppressedCount += suppressStaleRenderer();
  }

  function suppressStaleRenderer() {
    let removed = 0;

    document.querySelectorAll(".dgb-bp-room, .dgb-bp-room-map, .dgb-bp-cardinal-zone, .dgb-bp-room-stack").forEach((node) => {
      const activeOverlay = node.closest(OVERLAY_SELECTOR);
      if (activeOverlay && activeOverlay === overlay) {
        try {
          node.remove();
          removed += 1;
        } catch (_error) {}
      }
    });

    if (overlay && state.overlayOpen && !overlay.querySelector(".dgb-bp-estate-room-card") && state.activeLens !== "instructions") {
      try {
        renderOverlay();
      } catch (_error) {}
    }

    return removed;
  }

  function startStaleRendererGuard() {
    if (staleGuardTimer) return;

    staleGuardTimer = window.setInterval(() => {
      if (!overlay || !state.overlayOpen) return;
      const removed = suppressStaleRenderer();
      if (removed) publishStatus();
    }, 450);

    if (mutationObserver) {
      try {
        mutationObserver.disconnect();
      } catch (_error) {}
    }

    mutationObserver = new MutationObserver(() => {
      if (!overlay || !state.overlayOpen) return;
      const oldRendererActive = overlay.querySelector(".dgb-bp-room, .dgb-bp-room-map, .dgb-bp-cardinal-zone");
      if (oldRendererActive) {
        state.staleRendererSuppressedCount += suppressStaleRenderer();
        publishStatus();
      }
    });

    try {
      mutationObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    } catch (_error) {}
  }

  function stopStaleRendererGuard() {
    if (staleGuardTimer) {
      try {
        window.clearInterval(staleGuardTimer);
      } catch (_error) {}
    }

    staleGuardTimer = 0;

    if (mutationObserver) {
      try {
        mutationObserver.disconnect();
      } catch (_error) {}
    }

    mutationObserver = null;
  }

  function open() {
    if (!overlay) return;

    stopJoystickScroll();

    state.overlayOpen = true;
    state.lastAction = "open";
    state.activeLens = "mirrorland";

    removeExistingBlueprintNodes();
    createBubble();
    createOverlay();
    renderOverlay();

    overlay.hidden = false;
    overlay.setAttribute("data-open", "true");
    overlay.setAttribute("data-active-lens", state.activeLens);

    document.documentElement.classList.add("dgb-blueprint-body-lock");
    document.body?.classList.add("dgb-blueprint-body-lock");

    startStaleRendererGuard();
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

    stopStaleRendererGuard();
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
      return { direction: "up", speed: joystickSpeedFromPressure((topZone - y) / topZone) };
    }

    if (y > v.height - bottomZone) {
      return { direction: "down", speed: joystickSpeedFromPressure((y - (v.height - bottomZone)) / bottomZone) };
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
    if (!bubble || bubble.__dgbMainMenuInstructionsDragAttached) return;
    bubble.__dgbMainMenuInstructionsDragAttached = true;

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
    const current = currentRoom();
    const v = viewport();
    const rect = bubble ? bubble.getBoundingClientRect() : null;

    const payload = {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      binding: BINDING,
      apiContract: API_CONTRACT,

      active: true,
      estateOrientationRuntime: true,
      mirrorlandLensHeld: true,
      mainMenuSeparated: true,
      mainMenuShowsWebsiteRoomsOnly: true,
      mainMenuSuppressesMirrorlandMovementBoard: true,
      instructionsExpanded: true,
      guideDeskLinked: true,

      mapIsDirectory: false,
      placementBeforeAccess: true,
      staleCardinalRendererSuppressed: true,
      staleRendererSuppressedCount: state.staleRendererSuppressedCount,

      mapPortalGlobalEstateNavigation: true,
      returnToOrbitLocalPageNavigation: true,
      mainMenuExitBoard: true,
      mirrorlandDoorsImmersiveNavigation: true,
      guideDeskFullConstructionNarrative: true,

      builderPathHiddenFromVisitorCards: true,
      fileNameIsNotRoomIdentity: true,
      roomIdentityIsNotEstateLocation: true,
      estateLocationIsNotValueCategory: true,
      valueCategoryIsNotNavigationAction: true,

      ziontsVisibleIdentity: true,
      ziontsSpelling: "ZIONTS",
      ziontsPronunciation: "Zience",
      earthRouteDisplayedAsZionts: true,
      gaugesDisplayedAsTheLab: true,
      showroomDisplayedAsAtrium: true,
      globeDisplayedAsAtlasStudy: true,
      frontierDisplayedAsWorkshopYard: true,
      siteGuideDisplayedAsGuideDesk: true,

      mobileFirstNativeBuildStatement: true,
      projectBeganLateJanuary2026: true,
      fourMonthIntegratedNavigationStructureStatement: true,
      quadrupedicTraversalExplained: true,

      mapBlipSingleEntryway: true,
      mirrorlandEntryway: "map_portal_blip",
      mainMenuWebsiteOptionsOnly: true,
      mirrorlandDoorsCategoryOnly: true,

      bubbleMounted: Boolean(bubble && document.body.contains(bubble)),
      overlayMounted: Boolean(overlay && document.body.contains(overlay)),
      overlayOpen: state.overlayOpen,

      activeLens: state.activeLens,
      currentPath: normalizePath(window.location.pathname || "/"),
      currentRoomId: current.id,
      currentPublicRoomName: current.name,
      currentEstateLocation: current.zone,
      currentValueCategory: current.category,

      hasEstateRoomCards: Boolean(overlay?.querySelector(".dgb-bp-estate-room-card")),
      oldCardinalRoomCount: overlay ? overlay.querySelectorAll(".dgb-bp-room").length : 0,
      estateRoomCardCount: overlay ? overlay.querySelectorAll(".dgb-bp-estate-room-card").length : 0,
      instructionCardCount: overlay ? overlay.querySelectorAll(".dgb-bp-instruction-card").length : 0,

      mirrorlandRoomCount: roomsForLens("mirrorland").length,
      mainMenuRoomCount: roomsForLens("main").length,
      valueCategoryCount: VALUE_CATEGORIES.length,

      fullViewportDrag: true,
      joystickScrollActive: true,
      joystickScrolling: state.joystickActive,
      joystickDirection: state.joystickDirection,
      joystickSpeed: Math.round(state.joystickSpeed * 100) / 100,
      joystickScrollForceProfile: JOYSTICK_SCROLL_FORCE_PROFILE,

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
      document.documentElement.dataset.manorBlueprintBinding = BINDING;
      document.documentElement.dataset.manorBlueprintEstateOrientationRuntime = "true";
      document.documentElement.dataset.manorBlueprintMainMenuSeparated = "true";
      document.documentElement.dataset.manorBlueprintMainMenuShowsWebsiteRoomsOnly = "true";
      document.documentElement.dataset.manorBlueprintInstructionsExpanded = "true";
      document.documentElement.dataset.manorBlueprintGuideDeskLinked = "true";
      document.documentElement.dataset.manorBlueprintMapIsDirectory = "false";
      document.documentElement.dataset.manorBlueprintPlacementBeforeAccess = "true";
      document.documentElement.dataset.manorBlueprintStaleCardinalRendererSuppressed = "true";
      document.documentElement.dataset.manorBlueprintBuilderPathHidden = "true";
      document.documentElement.dataset.manorBlueprintFileNameIsNotRoomIdentity = "true";
      document.documentElement.dataset.manorBlueprintZiontsVisibleIdentity = "true";
      document.documentElement.dataset.manorBlueprintCurrentRoom = current.id;
      document.documentElement.dataset.manorBlueprintCurrentPublicRoomName = current.name;
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
    stopStaleRendererGuard();
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
      binding: BINDING,

      estateOrientationRuntime: true,
      mirrorlandLensHeld: true,
      mainMenuSeparated: true,
      mainMenuShowsWebsiteRoomsOnly: true,
      mainMenuSuppressesMirrorlandMovementBoard: true,
      instructionsExpanded: true,
      guideDeskLinked: true,

      mapIsDirectory: false,
      placementBeforeAccess: true,
      staleCardinalRendererSuppressed: true,

      mapPortalGlobalEstateNavigation: true,
      returnToOrbitLocalPageNavigation: true,
      mainMenuExitBoard: true,
      mirrorlandDoorsImmersiveNavigation: true,
      guideDeskFullConstructionNarrative: true,

      builderPathHiddenFromVisitorCards: true,
      fileNameIsNotRoomIdentity: true,
      ziontsVisibleIdentity: true,
      gaugesDisplayedAsTheLab: true,
      showroomDisplayedAsAtrium: true,
      globeDisplayedAsAtlasStudy: true,
      frontierDisplayedAsWorkshopYard: true,
      siteGuideDisplayedAsGuideDesk: true,

      mapBlipSingleEntryway: true,
      mirrorlandEntryway: "map_portal_blip",

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
      stopPriorController();
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

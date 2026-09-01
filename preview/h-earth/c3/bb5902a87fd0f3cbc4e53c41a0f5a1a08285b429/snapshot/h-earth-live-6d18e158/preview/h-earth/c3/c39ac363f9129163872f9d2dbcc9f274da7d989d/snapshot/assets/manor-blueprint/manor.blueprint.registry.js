// TARGET FILE: /assets/manor-blueprint/manor.blueprint.registry.js
// TNT FULL-FILE REPLACEMENT
// MANOR_BLUEPRINT_VALUE_CATEGORY_ESTATE_LANGUAGE_REGISTRY_TNT_v1
//
// Purpose:
// Convert the Manor Blueprint registry from route/path-facing classification
// into visitor-facing estate orientation by grouping rooms by categorical value.
//
// Previous contract:
// MANOR_BLUEPRINT_MENU_CATEGORY_OWNERSHIP_REGISTRY_TNT_v1
//
// Owns:
// - route truth
// - visitor-facing estate labels
// - value-category segregation
// - Mirrorland Doors category ownership
// - Main Menu / Website Options category ownership
// - ZIONTS / Zience visible identity for /showroom/globe/earth/
// - The Lab visible identity for /gauges/
// - Frontier Workshop Yard and Frontier bench labels
// - hidden builder path / visible room identity separation
//
// Does not own:
// - DOM rendering
// - CSS
// - draggable bubble behavior
// - overlay mechanics
// - page content
// - page layout
// - planet rendering
// - Frontier animation
// - Gauges logic
// - generated images
// - GraphicBox

(() => {
  "use strict";

  if (typeof window === "undefined") return;

  const CONTRACT = "MANOR_BLUEPRINT_VALUE_CATEGORY_ESTATE_LANGUAGE_REGISTRY_TNT_v1";
  const PREVIOUS_CONTRACT = "MANOR_BLUEPRINT_MENU_CATEGORY_OWNERSHIP_REGISTRY_TNT_v1";
  const REGISTRY_ID = "DGB_MANOR_BLUEPRINT_VALUE_CATEGORY_ROUTE_REGISTRY";
  const STATUS_GLOBAL = "DGB_MANOR_BLUEPRINT_REGISTRY_STATUS";
  const API_GLOBAL = "DGB_MANOR_BLUEPRINT_REGISTRY";
  const SITE_ROOT = "https://diamondgatebridge.com";

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
      purpose: "Study worlds, maps, planetary rooms, and living environments.",
      order: 20
    },
    {
      key: "control-instruments",
      label: "Control / Instruments",
      shortLabel: "Controls",
      purpose: "Operate cockpits, instruments, labs, inspections, and readiness surfaces.",
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
      purpose: "Study rules, boundaries, governance, proof, and accountability.",
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

  const CATEGORY_BY_KEY = Object.freeze(
    VALUE_CATEGORIES.reduce((acc, item) => {
      acc[item.key] = item;
      return acc;
    }, {})
  );

  function freeze(value) {
    if (Array.isArray(value)) return Object.freeze(value.map(freeze));
    if (value && typeof value === "object") {
      const copy = {};
      for (const key of Object.keys(value)) copy[key] = freeze(value[key]);
      return Object.freeze(copy);
    }
    return value;
  }

  function normalizePath(path) {
    let next = String(path || "/").trim();

    if (!next) next = "/";
    if (/^https?:\/\//i.test(next)) {
      try {
        next = new URL(next).pathname || "/";
      } catch (_error) {
        next = "/";
      }
    }

    next = next.split("#")[0].split("?")[0];
    if (!next.startsWith("/")) next = "/" + next;
    next = next.replace(/\/{2,}/g, "/");

    if (next !== "/" && !next.endsWith("/")) next += "/";

    return next;
  }

  function unique(items) {
    return Array.from(new Set((items || []).filter(Boolean)));
  }

  function categoryKey(value) {
    const key = String(value || "").trim().toLowerCase();
    return CATEGORY_BY_KEY[key] ? key : "arrival";
  }

  function route(config) {
    const path = normalizePath(config.path);
    const mirrorlandDoor = Boolean(config.mirrorlandDoor);
    const mirrorlandAligned = Boolean(config.mirrorlandAligned);
    const websiteOption = Boolean(config.websiteOption);
    const valueCategory = categoryKey(config.valueCategory);

    return freeze({
      routeId: String(config.routeId || config.id || "route"),
      id: String(config.id || config.routeId || "route"),
      key: String(config.key || config.id || config.routeId || "route"),
      path,
      href: path,
      builderPathHidden: path,
      technicalLabelHidden: String(config.technicalLabelHidden || config.title || path),

      title: String(config.title || "Route"),
      shortTitle: String(config.shortTitle || config.title || "Route"),
      publicRoomName: String(config.publicRoomName || config.title || "Room"),
      estateLocation: String(config.estateLocation || config.publicRoomName || config.title || "Estate Room"),
      valueCategory,
      valueCategoryLabel: CATEGORY_BY_KEY[valueCategory].label,
      valueCategoryShortLabel: CATEGORY_BY_KEY[valueCategory].shortLabel,

      visitorPurpose: String(config.visitorPurpose || config.description || "Open this room."),
      visitorAction: String(config.visitorAction || "Enter Room"),
      shortContext: String(config.shortContext || config.visitorPurpose || config.description || "Open this room."),
      deepContext: String(config.deepContext || config.shortContext || config.visitorPurpose || config.description || "Open this room."),
      estateMeaning: String(config.estateMeaning || config.deepContext || config.visitorPurpose || "This room has a visitor-facing purpose."),

      group: String(config.group || (mirrorlandDoor ? "Mirrorland Doors" : "Main Menu / Website Options")),
      menu: String(config.menu || (mirrorlandDoor ? "mirrorland" : "main")),
      wing: String(config.wing || config.estateLocation || (mirrorlandDoor ? "Mirrorland Estate" : "Website Options")),
      type: String(config.type || "route"),
      cardinal: String(config.cardinal || "center"),
      role: String(config.role || config.type || "room"),
      parent: config.parent ? normalizePath(config.parent) : "",
      children: unique((config.children || []).map(normalizePath)),
      nearby: unique((config.nearby || []).map(normalizePath)),
      description: String(config.description || config.visitorPurpose || "Open this route."),
      body: String(config.body || config.deepContext || config.visitorPurpose || config.description || "Open this route."),
      keywords: unique(config.keywords || []),

      mapX: Number.isFinite(Number(config.mapX)) ? Number(config.mapX) : 50,
      mapY: Number.isFinite(Number(config.mapY)) ? Number(config.mapY) : 50,
      x: Number.isFinite(Number(config.x)) ? Number(config.x) : Number.isFinite(Number(config.mapX)) ? Number(config.mapX) : 50,
      y: Number.isFinite(Number(config.y)) ? Number(config.y) : Number.isFinite(Number(config.mapY)) ? Number(config.mapY) : 50,

      status: String(config.status || "active"),
      priority: Number.isFinite(Number(config.priority)) ? Number(config.priority) : 50,
      showInBlueprint: config.showInBlueprint !== false,
      mirrorlandAligned,
      mirrorlandDoor,
      websiteOption,
      supportDoesNotEqualOwnership: true,
      singleEntryway: true,
      entryway: mirrorlandDoor ? "map-portal-blip" : "website-option"
    });
  }

  const ROUTES = freeze([
    route({
      routeId: "compass",
      path: "/",
      title: "Compass",
      shortTitle: "Compass",
      publicRoomName: "Compass Desk",
      estateLocation: "Front Orientation Desk",
      valueCategory: "arrival",
      visitorPurpose: "Start here, regain orientation, and choose the next part of the public site.",
      visitorAction: "Open Compass",
      shortContext: "The front orientation desk for the public website.",
      deepContext: "Compass keeps the ordinary website oriented before the visitor enters deeper rooms, products, proof paths, or Mirrorland.",
      group: "Main Menu / Website Options",
      menu: "main",
      cardinal: "north",
      role: "orientation",
      children: ["/door/", "/home/", "/laws/", "/gauges/"],
      nearby: ["/door/", "/home/", "/gauges/"],
      keywords: ["compass", "entry", "orientation", "website"],
      priority: 100,
      websiteOption: true
    }),

    route({
      routeId: "door",
      path: "/door/",
      title: "Door",
      shortTitle: "Door",
      publicRoomName: "Front Door",
      estateLocation: "Public Threshold",
      valueCategory: "arrival",
      visitorPurpose: "Cross the ordinary website threshold before entering deeper estate rooms.",
      visitorAction: "Open Door",
      shortContext: "The public threshold of the website.",
      deepContext: "The Door is the ordinary public entry route. It is separate from the Mirrorland Map / Portal.",
      group: "Main Menu / Website Options",
      menu: "main",
      cardinal: "north",
      parent: "/",
      nearby: ["/", "/home/", "/laws/"],
      keywords: ["door", "threshold", "entry"],
      priority: 96,
      websiteOption: true
    }),

    route({
      routeId: "home",
      path: "/home/",
      title: "Home",
      shortTitle: "Home",
      publicRoomName: "Main Hall",
      estateLocation: "Central House",
      valueCategory: "arrival",
      visitorPurpose: "Return to the central public hall of Diamond Gate Bridge.",
      visitorAction: "Open Main Hall",
      shortContext: "The central public hall.",
      deepContext: "Home stabilizes the public site and keeps the visitor connected to the central house before branching into products, laws, or Mirrorland.",
      group: "Main Menu / Website Options",
      menu: "main",
      cardinal: "north",
      parent: "/",
      children: ["/products/", "/laws/"],
      nearby: ["/", "/door/", "/gauges/"],
      keywords: ["home", "main hall", "manor"],
      priority: 92,
      websiteOption: true
    }),

    route({
      routeId: "site-guide",
      path: "/site-guide/",
      title: "Site Guide",
      shortTitle: "Guide",
      publicRoomName: "Guide Desk",
      estateLocation: "Orientation Desk",
      valueCategory: "arrival",
      visitorPurpose: "Read how the site, rooms, gems, routes, and return paths work.",
      visitorAction: "Open Guide",
      shortContext: "The instruction desk for visitors.",
      deepContext: "The Guide Desk explains site navigation without turning Mirrorland into a file directory.",
      group: "Main Menu / Website Options",
      menu: "main",
      cardinal: "north",
      parent: "/",
      nearby: ["/", "/gauges/", "/laws/"],
      keywords: ["guide", "instructions", "navigation"],
      priority: 88,
      status: "planned",
      websiteOption: true
    }),

    route({
      routeId: "laws",
      path: "/laws/",
      title: "Laws",
      shortTitle: "Laws",
      publicRoomName: "Law Library",
      estateLocation: "Law Library",
      valueCategory: "law-governance-proof",
      visitorPurpose: "Study the rules, boundaries, and constraints that keep the estate coherent.",
      visitorAction: "Open Law Library",
      shortContext: "The room where boundaries and rules are studied.",
      deepContext: "The Law Library supports Mirrorland, Frontier, products, and public claims by keeping each page attached to discipline and consequence.",
      group: "Main Menu / Website Options",
      menu: "main",
      cardinal: "south",
      parent: "/",
      nearby: ["/governance/", "/gauges/"],
      keywords: ["laws", "rules", "proof", "boundary"],
      priority: 90,
      websiteOption: true
    }),

    route({
      routeId: "governance",
      path: "/governance/",
      title: "Governance",
      shortTitle: "Governance",
      publicRoomName: "Council Room",
      estateLocation: "Governance Hall",
      valueCategory: "law-governance-proof",
      visitorPurpose: "Review policy, public risk, responsibility, and decision structure.",
      visitorAction: "Open Council Room",
      shortContext: "The estate room for decisions and accountability.",
      deepContext: "The Council Room frames governance as the decision layer that keeps ambitious systems from outrunning responsibility.",
      group: "Main Menu / Website Options",
      menu: "main",
      cardinal: "south",
      parent: "/",
      nearby: ["/laws/", "/gauges/"],
      keywords: ["governance", "policy", "risk", "decision"],
      priority: 82,
      websiteOption: true
    }),

    route({
      routeId: "gauges",
      path: "/gauges/",
      title: "Gauges / Triple G",
      shortTitle: "Gauges",
      publicRoomName: "The Lab",
      estateLocation: "Measurement Lab",
      valueCategory: "control-instruments",
      visitorPurpose: "Inspect route status, readiness signals, and measurement results.",
      visitorAction: "Open The Lab",
      shortContext: "The Lab checks what is active, held, ready, or still under review.",
      deepContext: "The Lab is the estate’s measurement room. It supports proof and readiness without becoming a Mirrorland room.",
      group: "Main Menu / Website Options",
      menu: "main",
      cardinal: "south",
      parent: "/",
      children: ["/gauges/h-earth/"],
      nearby: ["/laws/", "/"],
      keywords: ["gauges", "lab", "audit", "proof", "measurement"],
      priority: 95,
      websiteOption: true
    }),

    route({
      routeId: "gauges-h-earth",
      path: "/gauges/h-earth/",
      title: "H-Earth Gauges",
      shortTitle: "H-Earth Audit",
      publicRoomName: "H-Earth Lab Bench",
      estateLocation: "Measurement Lab",
      valueCategory: "control-instruments",
      visitorPurpose: "Inspect H-Earth readiness from the lab bench.",
      visitorAction: "Open Lab Bench",
      shortContext: "A dedicated lab bench for H-Earth readiness.",
      deepContext: "The H-Earth Lab Bench lets visitors inspect a specific world’s route state without confusing the lab with the world itself.",
      group: "Main Menu / Website Options",
      menu: "main",
      cardinal: "south",
      parent: "/gauges/",
      nearby: ["/gauges/", "/showroom/globe/h-earth/"],
      keywords: ["h-earth", "lab", "gauge", "audit"],
      priority: 74,
      websiteOption: true
    }),

    route({
      routeId: "products",
      path: "/products/",
      title: "Products",
      shortTitle: "Products",
      publicRoomName: "Product Gallery",
      estateLocation: "Product Gallery",
      valueCategory: "public-product-value",
      visitorPurpose: "View usable objects, offers, games, tools, and product pathways.",
      visitorAction: "Open Gallery",
      shortContext: "The room where public value becomes usable.",
      deepContext: "The Product Gallery turns the project’s ideas into usable objects and offers without mixing them with Mirrorland navigation.",
      group: "Main Menu / Website Options",
      menu: "main",
      cardinal: "west",
      parent: "/",
      nearby: ["/home/", "/about-this-underdog/"],
      keywords: ["products", "gallery", "offers", "tools"],
      priority: 72,
      websiteOption: true
    }),

    route({
      routeId: "meet-sean",
      path: "/about-this-underdog/",
      title: "Meet Sean Mansfield",
      shortTitle: "Meet Sean",
      publicRoomName: "Host Portrait",
      estateLocation: "Portrait Room",
      valueCategory: "public-product-value",
      visitorPurpose: "Meet the person, mission, and public-facing host of Diamond Gate Bridge.",
      visitorAction: "Meet Sean",
      shortContext: "The host portrait room.",
      deepContext: "The Host Portrait introduces the human mission behind the estate without turning the page into a technical index.",
      group: "Main Menu / Website Options",
      menu: "main",
      cardinal: "west",
      parent: "/",
      nearby: ["/products/", "/home/"],
      keywords: ["sean", "host", "portrait", "about"],
      priority: 76,
      websiteOption: true
    }),

    route({
      routeId: "showroom-door",
      path: "/showroom/",
      title: "Showroom",
      shortTitle: "Atrium",
      publicRoomName: "Atrium",
      estateLocation: "Mirrorland Entrance Atrium",
      valueCategory: "arrival",
      visitorPurpose: "Enter the immersive estate threshold where visible objects and Mirrorland doors begin.",
      visitorAction: "Enter Atrium",
      shortContext: "The entrance atrium for Mirrorland-facing object display.",
      deepContext: "The Atrium is the visitor’s first estate-feeling entry point. It frames the Diamond Lattice object and prepares the visitor for Mirrorland.",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      cardinal: "center",
      parent: "",
      children: ["/showroom/globe/"],
      nearby: ["/showroom/globe/", "/showroom/globe/audralia/"],
      keywords: ["showroom", "atrium", "mirrorland", "diamond lattice"],
      priority: 99,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "mirrorland-field",
      path: "/showroom/globe/",
      title: "Globe Showcase",
      shortTitle: "Atlas Study",
      publicRoomName: "Atlas Study",
      estateLocation: "Atlas Study",
      valueCategory: "world-study",
      visitorPurpose: "Study the estate’s worlds, planetary doors, reference bodies, and living environments.",
      visitorAction: "Open Atlas Study",
      shortContext: "The estate study for worlds and planetary doors.",
      deepContext: "The Atlas Study gives direct context to the planetary field. It is not a route directory; it is the room where worlds are inspected.",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      cardinal: "east",
      parent: "/showroom/",
      children: ["/showroom/globe/earth/", "/showroom/globe/audralia/", "/showroom/globe/hearth/", "/showroom/globe/h-earth/"],
      nearby: ["/showroom/", "/showroom/globe/audralia/"],
      keywords: ["atlas", "worlds", "planets", "mirrorland"],
      priority: 94,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "zionts",
      path: "/showroom/globe/earth/",
      title: "Earth Route",
      shortTitle: "ZIONTS",
      publicRoomName: "ZIONTS Room",
      estateLocation: "Atlas Study",
      valueCategory: "world-study",
      visitorPurpose: "Study ZIONTS, pronounced Zience, as the first contextual world-door in the Atlas Study.",
      visitorAction: "Enter ZIONTS",
      shortContext: "ZIONTS, pronounced Zience, is the immersive world identity served from the Earth route.",
      deepContext: "The file address is under Earth, but the estate-room identity is ZIONTS. The map shows the visitor what the room means, not what the builder path is named.",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      cardinal: "east",
      parent: "/showroom/globe/",
      nearby: ["/showroom/globe/", "/showroom/globe/audralia/", "/showroom/globe/hearth/"],
      keywords: ["zionts", "zience", "earth", "atlas", "world study"],
      priority: 93,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "audralia",
      path: "/showroom/globe/audralia/",
      title: "Audralia",
      shortTitle: "Audralia",
      publicRoomName: "Audralia Conservatory",
      estateLocation: "Atlas Study",
      valueCategory: "world-study",
      visitorPurpose: "Enter Audralia as the constructive living-world path inside Mirrorland.",
      visitorAction: "Enter Conservatory",
      shortContext: "The living-world conservatory for Audralia.",
      deepContext: "Audralia Conservatory introduces the constructive world before its detailed body, cockpit, and future systems are inspected elsewhere.",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      cardinal: "east",
      parent: "/showroom/globe/",
      children: ["/showroom/globe/audralia/planet/", "/showroom/globe/audralia/disposition/"],
      nearby: ["/showroom/globe/", "/showroom/globe/audralia/planet/", "/showroom/globe/audralia/disposition/"],
      keywords: ["audralia", "conservatory", "planet", "world"],
      priority: 98,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "audralia-planet",
      path: "/showroom/globe/audralia/planet/",
      title: "Audralia Planet",
      shortTitle: "Worldroom",
      publicRoomName: "Audralia Worldroom",
      estateLocation: "Audralia Conservatory",
      valueCategory: "world-study",
      visitorPurpose: "Inspect Audralia as a visible world-body without claiming the world is final.",
      visitorAction: "Inspect Worldroom",
      shortContext: "The room where Audralia’s visible body is inspected.",
      deepContext: "Audralia Worldroom gives the visitor a focused planet-body read while keeping final terrain, water, and completion claims held until earned.",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      cardinal: "east",
      parent: "/showroom/globe/audralia/",
      nearby: ["/showroom/globe/audralia/", "/showroom/globe/audralia/disposition/", "/showroom/globe/"],
      keywords: ["audralia", "worldroom", "planet", "body"],
      priority: 99,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "audralia-cockpit",
      path: "/showroom/globe/audralia/disposition/",
      title: "Audralia Intergalactic Cockpit",
      shortTitle: "Cockpit",
      publicRoomName: "Control Cockpit",
      estateLocation: "Audralia Conservatory",
      valueCategory: "control-instruments",
      visitorPurpose: "Operate Audralia’s cockpit-style instruments and inspect the world’s disposition.",
      visitorAction: "Open Cockpit",
      shortContext: "The control cockpit for Audralia inspection.",
      deepContext: "The Control Cockpit is not a map room. It is an instrument room for operating and inspecting Audralia’s disposition layer.",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      cardinal: "east",
      parent: "/showroom/globe/audralia/",
      nearby: ["/showroom/globe/audralia/", "/showroom/globe/audralia/planet/", "/showroom/globe/"],
      keywords: ["cockpit", "control", "audralia", "instrument"],
      priority: 91,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "hearth",
      path: "/showroom/globe/hearth/",
      title: "Hearth",
      shortTitle: "Hearth",
      publicRoomName: "Hearth Room",
      estateLocation: "Atlas Study",
      valueCategory: "world-study",
      visitorPurpose: "Study Hearth as a forming world in the planetary estate.",
      visitorAction: "Enter Hearth Room",
      shortContext: "A world-study room for Hearth.",
      deepContext: "Hearth Room keeps Hearth readable as its own world inside the Atlas Study instead of reducing it to a path name.",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      cardinal: "east",
      parent: "/showroom/globe/",
      nearby: ["/showroom/globe/", "/showroom/globe/audralia/", "/showroom/globe/h-earth/"],
      keywords: ["hearth", "planet", "world"],
      priority: 84,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "h-earth",
      path: "/showroom/globe/h-earth/",
      title: "H-Earth",
      shortTitle: "H-Earth",
      publicRoomName: "H-Earth Annex",
      estateLocation: "Atlas Study",
      valueCategory: "world-study",
      visitorPurpose: "Study the H-Earth experimental world path from its annex.",
      visitorAction: "Open Annex",
      shortContext: "The annex for H-Earth world inspection.",
      deepContext: "H-Earth Annex is a world-study room. It stays separate from The Lab, which measures H-Earth readiness.",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      cardinal: "east",
      parent: "/showroom/globe/",
      nearby: ["/showroom/globe/", "/showroom/globe/hearth/", "/gauges/h-earth/"],
      keywords: ["h-earth", "annex", "world", "planet"],
      priority: 83,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "characters",
      path: "/characters/",
      title: "Characters",
      shortTitle: "Characters",
      publicRoomName: "Portrait Hall",
      estateLocation: "Story Wing",
      valueCategory: "story-cast-universe",
      visitorPurpose: "Meet the cast, faces, voices, and narrative presences of the estate.",
      visitorAction: "Enter Portrait Hall",
      shortContext: "The room where story faces are introduced.",
      deepContext: "Portrait Hall organizes characters as part of the immersive estate rather than presenting them as a route list.",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      cardinal: "east",
      parent: "/showroom/",
      nearby: ["/showroom/", "/nine-summits/universe/", "/showroom/globe/audralia/"],
      keywords: ["characters", "portrait", "cast", "story"],
      priority: 86,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "nine-summits-universe",
      path: "/nine-summits/universe/",
      title: "Nine Summits Universe",
      shortTitle: "Nine Summits",
      publicRoomName: "Universe Gallery",
      estateLocation: "Story Wing",
      valueCategory: "story-cast-universe",
      visitorPurpose: "Open the larger story-world context surrounding the estate.",
      visitorAction: "Open Universe Gallery",
      shortContext: "The room for the wider universe context.",
      deepContext: "Universe Gallery keeps the larger narrative field accessible without forcing it into technical site language.",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      cardinal: "east",
      parent: "/showroom/",
      nearby: ["/characters/", "/showroom/globe/audralia/", "/showroom/globe/"],
      keywords: ["nine summits", "universe", "story", "gallery"],
      priority: 78,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "frontier",
      path: "/explore/frontier/",
      title: "Frontier",
      shortTitle: "Frontier",
      publicRoomName: "Frontier Workshop Yard",
      estateLocation: "West Workshop Yard",
      valueCategory: "workshop-frontier",
      visitorPurpose: "Enter the outdoor testing yard where Audralia’s future systems are pressure-tested.",
      visitorAction: "Enter Workshop Yard",
      shortContext: "The applied-science yard for frontier system testing.",
      deepContext: "Frontier Workshop Yard is where possible systems are examined before they are allowed to become part of Audralia’s constructive future.",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      cardinal: "west",
      parent: "/showroom/",
      children: [
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
      nearby: ["/explore/frontier/energy/", "/explore/frontier/water/", "/explore/frontier/waste/"],
      keywords: ["frontier", "workshop", "yard", "applied science"],
      priority: 94,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "frontier-energy",
      path: "/explore/frontier/energy/",
      title: "Frontier Energy",
      shortTitle: "Energy",
      publicRoomName: "Fusion Bench",
      estateLocation: "Frontier Workshop Yard",
      valueCategory: "workshop-frontier",
      visitorPurpose: "Scratch the surface of power, storage, solar support, plasma regime, and long-range fusion constraints.",
      visitorAction: "Open Fusion Systems",
      shortContext: "The bench where future power systems are tested.",
      deepContext: "Fusion Bench studies the energy pathway without claiming commercial fusion completion. It separates storage, load, solar support, plasma operating regimes, and long-horizon fusion research.",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      cardinal: "west",
      parent: "/explore/frontier/",
      nearby: ["/explore/frontier/", "/explore/frontier/water/", "/explore/frontier/infrastructure/"],
      keywords: ["energy", "fusion", "solar", "plasma", "storage"],
      priority: 88,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "frontier-water",
      path: "/explore/frontier/water/",
      title: "Frontier Water",
      shortTitle: "Water",
      publicRoomName: "Closed Water Systems Bench",
      estateLocation: "Frontier Workshop Yard",
      valueCategory: "workshop-frontier",
      visitorPurpose: "Scratch the surface of capture, treatment, routing, reuse, storage, and continuity.",
      visitorAction: "Open Water Systems",
      shortContext: "The bench where water continuity systems are studied.",
      deepContext: "Closed Water Systems Bench studies how a future world preserves flow, storage, cleanliness, continuity, and responsible reuse.",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      cardinal: "west",
      parent: "/explore/frontier/",
      nearby: ["/explore/frontier/", "/explore/frontier/waste/", "/explore/frontier/closed-loop/"],
      keywords: ["water", "closed water", "reuse", "flow"],
      priority: 87,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "frontier-waste",
      path: "/explore/frontier/waste/",
      title: "Frontier Waste",
      shortTitle: "Waste",
      publicRoomName: "Wastewater Systems Bench",
      estateLocation: "Frontier Workshop Yard",
      valueCategory: "workshop-frontier",
      visitorPurpose: "Scratch the surface of sanitation, wastewater, return-material logic, recovery, and reuse.",
      visitorAction: "Open Wastewater Systems",
      shortContext: "The bench where discarded value is returned into system logic.",
      deepContext: "Wastewater Systems Bench studies what a future world does with discard, sanitation, recovery, reuse, and return-material pathways.",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      cardinal: "west",
      parent: "/explore/frontier/",
      nearby: ["/explore/frontier/", "/explore/frontier/water/", "/explore/frontier/closed-loop/"],
      keywords: ["waste", "wastewater", "reuse", "recovery"],
      priority: 86,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "frontier-closed-loop",
      path: "/explore/frontier/closed-loop/",
      title: "Closed Loop",
      shortTitle: "Closed Loop",
      publicRoomName: "Closed Loop Table",
      estateLocation: "Frontier Workshop Yard",
      valueCategory: "workshop-frontier",
      visitorPurpose: "Scratch the surface of feedback, accountability, capture, correction, and system answer-back.",
      visitorAction: "Open Closed Loop",
      shortContext: "The table where systems prove they can answer back.",
      deepContext: "Closed Loop Table studies whether a system can capture its outputs, correct its losses, and prove accountability before scaling.",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      cardinal: "west",
      parent: "/explore/frontier/",
      keywords: ["closed loop", "feedback", "accountability"],
      priority: 85,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "frontier-infrastructure",
      path: "/explore/frontier/infrastructure/",
      title: "Infrastructure",
      shortTitle: "Infrastructure",
      publicRoomName: "Infrastructure Bay",
      estateLocation: "Frontier Workshop Yard",
      valueCategory: "workshop-frontier",
      visitorPurpose: "Scratch the surface of roads, supports, utilities, corridors, and load-bearing systems.",
      visitorAction: "Open Infrastructure Bay",
      shortContext: "The bay where future support-load systems are tested.",
      deepContext: "Infrastructure Bay studies whether a future world can carry weight before people, cities, and systems depend on it.",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      cardinal: "west",
      parent: "/explore/frontier/",
      keywords: ["infrastructure", "support", "load", "utilities"],
      priority: 84,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "frontier-lattice",
      path: "/explore/frontier/lattice/",
      title: "Lattice",
      shortTitle: "Lattice",
      publicRoomName: "Lattice Table",
      estateLocation: "Frontier Workshop Yard",
      valueCategory: "workshop-frontier",
      visitorPurpose: "Scratch the surface of placement, relationship, pattern, count, and measurable expansion.",
      visitorAction: "Open Lattice Table",
      shortContext: "The table where growth is tested for structure.",
      deepContext: "Lattice Table asks whether future growth can remain ordered rather than expanding randomly.",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      cardinal: "west",
      parent: "/explore/frontier/",
      keywords: ["lattice", "structure", "pattern", "count"],
      priority: 83,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "frontier-manual",
      path: "/explore/frontier/manual/",
      title: "Manual",
      shortTitle: "Manual",
      publicRoomName: "Field Manual Desk",
      estateLocation: "Frontier Workshop Yard",
      valueCategory: "workshop-frontier",
      visitorPurpose: "Scratch the surface of operating language, field notes, methods, and practical instructions.",
      visitorAction: "Open Field Manual",
      shortContext: "The desk where future systems become readable and usable.",
      deepContext: "Field Manual Desk keeps frontier systems from becoming mysterious by translating them into operating language.",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      cardinal: "west",
      parent: "/explore/frontier/",
      keywords: ["manual", "guide", "field notes"],
      priority: 82,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "frontier-shimmer",
      path: "/explore/frontier/shimmer/",
      title: "Shimmer",
      shortTitle: "Shimmer",
      publicRoomName: "Shimmer Signal Table",
      estateLocation: "Frontier Workshop Yard",
      valueCategory: "workshop-frontier",
      visitorPurpose: "Scratch the surface of signal, perception, visible clues, and surface change.",
      visitorAction: "Open Shimmer Signal",
      shortContext: "The table where faint signals become readable.",
      deepContext: "Shimmer Signal Table studies the visible clue that motion, change, or system response is beginning.",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      cardinal: "west",
      parent: "/explore/frontier/",
      keywords: ["shimmer", "signal", "perception"],
      priority: 81,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "frontier-trajectory",
      path: "/explore/frontier/trajectory/",
      title: "Trajectory",
      shortTitle: "Trajectory",
      publicRoomName: "Trajectory Table",
      estateLocation: "Frontier Workshop Yard",
      valueCategory: "workshop-frontier",
      visitorPurpose: "Scratch the surface of direction, launch, arc, impact, and forward motion.",
      visitorAction: "Open Trajectory Table",
      shortContext: "The table where direction becomes testable.",
      deepContext: "Trajectory Table studies whether a frontier system has a direction strong enough to carry it forward.",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      cardinal: "west",
      parent: "/explore/frontier/",
      keywords: ["trajectory", "direction", "motion"],
      priority: 80,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "frontier-vision",
      path: "/explore/frontier/vision/",
      title: "Vision",
      shortTitle: "Vision",
      publicRoomName: "Vision Window",
      estateLocation: "Frontier Workshop Yard",
      valueCategory: "workshop-frontier",
      visitorPurpose: "Scratch the surface of horizon, imagination, future clarity, and long-range consequence.",
      visitorAction: "Open Vision Window",
      shortContext: "The window where the future horizon is read.",
      deepContext: "Vision Window keeps Frontier attached to the horizon beyond the immediate experiment.",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      cardinal: "west",
      parent: "/explore/frontier/",
      keywords: ["vision", "future", "horizon"],
      priority: 79,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "frontier-urban",
      path: "/explore/frontier/urban/",
      title: "Urban",
      shortTitle: "Urban",
      publicRoomName: "Urban Planning Table",
      estateLocation: "Frontier Workshop Yard",
      valueCategory: "workshop-frontier",
      visitorPurpose: "Scratch the surface of civic pressure, corridors, density, city systems, and built-world consequence.",
      visitorAction: "Open Urban Table",
      shortContext: "The table where future civic pressure is tested.",
      deepContext: "Urban Planning Table studies how frontier systems behave once they meet public space, density, corridors, and the built world.",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      cardinal: "west",
      parent: "/explore/frontier/",
      keywords: ["urban", "city", "planning", "civic"],
      priority: 78,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    })
  ]);

  const INSTRUCTIONS = freeze([
    {
      termId: "file-name-is-not-room-identity",
      title: "File Name Is Not Room Identity",
      shortTitle: "Identity",
      body: "Builder paths stay hidden. The visitor sees the estate-room identity. Example: /showroom/globe/earth/ is the builder path, but the visible room is ZIONTS, pronounced Zience.",
      keywords: ["file", "identity", "zionts", "zience"]
    },
    {
      termId: "value-category-first",
      title: "Value Category First",
      shortTitle: "Categories",
      body: "Rooms are grouped by the value they give the visitor: Arrival, World Study, Control / Instruments, Workshop / Frontier Systems, Law / Governance / Proof, Public / Product Value, and Story / Cast / Universe.",
      keywords: ["value", "category", "segregation"]
    },
    {
      termId: "mirrorland-doors",
      title: "Mirrorland Doors",
      shortTitle: "Doors",
      body: "Mirrorland Doors contains only immersive rooms: the Atrium, Atlas Study, planetary rooms, cockpits, Frontier Workshop Yard, and story / universe rooms.",
      keywords: ["mirrorland", "doors", "estate"]
    },
    {
      termId: "main-menu-website-options",
      title: "Main Menu / Website Options",
      shortTitle: "Main Menu",
      body: "Main Menu contains regular website routes: Compass Desk, Front Door, Main Hall, Law Library, Council Room, The Lab, Product Gallery, Host Portrait, and Guide Desk.",
      keywords: ["main", "menu", "website"]
    },
    {
      termId: "lab-language",
      title: "The Lab",
      shortTitle: "Lab",
      body: "Gauges is visitor-facing as The Lab. It measures and inspects readiness, but it does not become a Mirrorland room.",
      keywords: ["gauges", "lab", "measurement"]
    },
    {
      termId: "frontier-workshop-yard",
      title: "Frontier Workshop Yard",
      shortTitle: "Frontier",
      body: "Frontier is visitor-facing as the Frontier Workshop Yard. Its child lanes are benches, bays, tables, and windows for applied-system testing.",
      keywords: ["frontier", "workshop", "yard"]
    }
  ]);

  const ROUTE_BY_PATH = new Map();
  const ROUTE_BY_ID = new Map();

  for (const item of ROUTES) {
    ROUTE_BY_PATH.set(item.path, item);
    ROUTE_BY_ID.set(item.routeId, item);
  }

  function getRouteByPath(path) {
    return ROUTE_BY_PATH.get(normalizePath(path)) || null;
  }

  function getRouteById(routeId) {
    return ROUTE_BY_ID.get(String(routeId || "")) || null;
  }

  function nearestRoute(path) {
    const normalized = normalizePath(path);

    if (ROUTE_BY_PATH.has(normalized)) return ROUTE_BY_PATH.get(normalized);

    const candidates = ROUTES
      .filter((item) => item.path !== "/" && normalized.startsWith(item.path))
      .sort((a, b) => b.path.length - a.path.length || b.priority - a.priority);

    if (candidates.length) return candidates[0];

    return ROUTE_BY_PATH.get("/") || ROUTES[0] || null;
  }

  function currentRoute() {
    return nearestRoute(window.location && window.location.pathname ? window.location.pathname : "/");
  }

  function routesByMenu(menu) {
    const key = String(menu || "").toLowerCase();
    return freeze(
      ROUTES
        .filter((item) => item.showInBlueprint && item.menu === key)
        .sort((a, b) => b.priority - a.priority || a.publicRoomName.localeCompare(b.publicRoomName))
    );
  }

  function routesByValueCategory(menu) {
    const source = routesByMenu(menu);
    const grouped = {};

    for (const category of VALUE_CATEGORIES) grouped[category.key] = [];

    for (const item of source) {
      if (!grouped[item.valueCategory]) grouped[item.valueCategory] = [];
      grouped[item.valueCategory].push(item);
    }

    for (const key of Object.keys(grouped)) {
      grouped[key] = grouped[key].sort((a, b) => b.priority - a.priority || a.publicRoomName.localeCompare(b.publicRoomName));
    }

    return freeze(grouped);
  }

  function searchRoutes(query) {
    const q = String(query || "").trim().toLowerCase();
    const visible = ROUTES.filter((item) => item.showInBlueprint);

    if (!q) return freeze(visible.sort((a, b) => b.priority - a.priority));

    return freeze(
      visible
        .filter((item) => {
          const haystack = [
            item.routeId,
            item.path,
            item.title,
            item.shortTitle,
            item.publicRoomName,
            item.estateLocation,
            item.valueCategory,
            item.valueCategoryLabel,
            item.visitorPurpose,
            item.shortContext,
            item.deepContext,
            item.group,
            item.menu,
            item.keywords.join(" ")
          ].join(" ").toLowerCase();

          return haystack.includes(q);
        })
        .sort((a, b) => b.priority - a.priority || a.publicRoomName.localeCompare(b.publicRoomName))
    );
  }

  function parentChain(path) {
    const chain = [];
    let current = nearestRoute(path);
    const seen = new Set();

    while (current && current.parent && !seen.has(current.path)) {
      seen.add(current.path);
      const parent = getRouteByPath(current.parent);
      if (!parent) break;
      chain.unshift(parent);
      current = parent;
    }

    const routeItem = nearestRoute(path);
    if (routeItem && !chain.some((item) => item.path === routeItem.path)) chain.push(routeItem);

    return freeze(chain);
  }

  function childrenOf(path) {
    const item = nearestRoute(path);
    if (!item) return freeze([]);

    return freeze(
      item.children
        .map(getRouteByPath)
        .filter(Boolean)
        .sort((a, b) => b.priority - a.priority || a.publicRoomName.localeCompare(b.publicRoomName))
    );
  }

  function nearbyFor(path) {
    const item = nearestRoute(path);
    if (!item) return freeze([]);

    return freeze(
      item.nearby
        .map(getRouteByPath)
        .filter(Boolean)
        .sort((a, b) => b.priority - a.priority || a.publicRoomName.localeCompare(b.publicRoomName))
    );
  }

  function routeSummary(path) {
    const item = nearestRoute(path);

    if (!item) {
      return freeze({ found: false, route: null, chain: [], children: [], nearby: [] });
    }

    return freeze({
      found: true,
      route: item,
      chain: parentChain(item.path),
      children: childrenOf(item.path),
      nearby: nearbyFor(item.path)
    });
  }

  function status() {
    const current = currentRoute();

    return freeze({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      registryId: REGISTRY_ID,
      active: true,
      routeCount: ROUTES.length,
      instructionCount: INSTRUCTIONS.length,
      valueCategoryCount: VALUE_CATEGORIES.length,
      currentPath: normalizePath(window.location && window.location.pathname ? window.location.pathname : "/"),
      currentRouteId: current ? current.routeId : "",
      currentPublicRoomName: current ? current.publicRoomName : "",
      currentValueCategory: current ? current.valueCategory : "",
      currentEstateLocation: current ? current.estateLocation : "",

      valueCategoryEstateLanguageActive: true,
      builderPathHiddenFromVisitorCards: true,
      fileNameIsNotRoomIdentity: true,
      ziontsVisibleIdentity: true,
      ziontsSpelling: "ZIONTS",
      ziontsPronunciation: "Zience",
      earthRouteDisplayedAsZionts: true,
      gaugesDisplayedAsTheLab: true,
      frontierWorkshopYardLabelActive: true,
      mainMenuRegularWebsiteOnly: true,
      mirrorlandDoorsSpecificRoutesOnly: true,
      supportDoesNotEqualOwnership: true,
      mapBlipSingleEntryway: true,

      imageGeneration: false,
      graphicBox: false,
      heavyRuntime: false
    });
  }

  const API = freeze({
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    registryId: REGISTRY_ID,
    siteRoot: SITE_ROOT,
    routes: ROUTES,
    valueCategories: VALUE_CATEGORIES,
    categoryByKey: CATEGORY_BY_KEY,
    instructions: INSTRUCTIONS,
    navigationTerms: INSTRUCTIONS,

    normalizePath,
    getRouteByPath,
    getRouteById,
    nearestRoute,
    currentRoute,
    routesByMenu,
    routesByValueCategory,
    searchRoutes,
    parentChain,
    childrenOf,
    nearbyFor,
    routeSummary,
    status,

    valueCategoryEstateLanguageActive: true,
    builderPathHiddenFromVisitorCards: true,
    fileNameIsNotRoomIdentity: true,
    ziontsVisibleIdentity: true,
    gaugesDisplayedAsTheLab: true,
    frontierWorkshopYardLabelActive: true,
    mainMenuRegularWebsiteOnly: true,
    mirrorlandDoorsSpecificRoutesOnly: true,
    supportDoesNotEqualOwnership: true,
    mirrorlandEntryway: "map_portal_blip"
  });

  window[API_GLOBAL] = API;
  window[STATUS_GLOBAL] = status();

  window.DGB_MANOR_BLUEPRINT_ROUTE_REGISTRY = ROUTES;
  window.DGB_MANOR_BLUEPRINT_NAVIGATION_TERMS = INSTRUCTIONS;
  window.DGB_MANOR_BLUEPRINT_INSTRUCTIONS = INSTRUCTIONS;
})();

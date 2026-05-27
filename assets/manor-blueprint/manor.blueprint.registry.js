// TARGET FILE: /assets/manor-blueprint/manor.blueprint.registry.js
// TNT FULL-FILE REPLACEMENT
// MANOR_BLUEPRINT_MIRRORLAND_DOORS_SINGLE_ENTRYWAY_REGISTRY_TNT_v1
//
// Manor Blueprint route registry.
// Renews route truth so the floating Map / Portal blip is the single public
// Mirrorland entryway, while the map interior owns Mirrorland Doors.
//
// Previous contract:
// MANOR_BLUEPRINT_ROUTE_REGISTRY_TNT_v1
//
// Owns:
// - route truth
// - Mirrorland Doors framing
// - Main Menu / Website Options separation
// - Compass separation
// - Frontier as Mirrorland-aligned West deployment wing
// - parent/child/nearby route metadata
// - instruction glossary metadata
//
// Does not own:
// - DOM rendering
// - CSS
// - draggable bubble behavior
// - overlay mechanics
// - page content
// - page layout
// - canvas rendering
// - Gauges logic
// - GraphicBox
// - generated images

(() => {
  "use strict";

  if (typeof window === "undefined") return;

  const CONTRACT = "MANOR_BLUEPRINT_MIRRORLAND_DOORS_SINGLE_ENTRYWAY_REGISTRY_TNT_v1";
  const PREVIOUS_CONTRACT = "MANOR_BLUEPRINT_ROUTE_REGISTRY_TNT_v1";
  const REGISTRY_ID = "DGB_MANOR_BLUEPRINT_ROUTE_REGISTRY";
  const STATUS_GLOBAL = "DGB_MANOR_BLUEPRINT_REGISTRY_STATUS";
  const API_GLOBAL = "DGB_MANOR_BLUEPRINT_REGISTRY";
  const SITE_ROOT = "https://diamondgatebridge.com";

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

  function route(config) {
    const path = normalizePath(config.path);

    return freeze({
      routeId: String(config.routeId || config.id || "route"),
      id: String(config.id || config.routeId || "route"),
      key: String(config.key || config.id || config.routeId || "route"),
      path,
      title: String(config.title || "Route"),
      shortTitle: String(config.shortTitle || config.title || "Route"),
      group: String(config.group || "Main Menu / Website Options"),
      menu: String(config.menu || "main"),
      wing: String(config.wing || "Website Options"),
      type: String(config.type || "route"),
      cardinal: String(config.cardinal || "center"),
      role: String(config.role || config.type || "room"),
      parent: config.parent ? normalizePath(config.parent) : "",
      children: unique((config.children || []).map(normalizePath)),
      nearby: unique((config.nearby || []).map(normalizePath)),
      description: String(config.description || "Open this route."),
      body: String(config.body || config.description || "Open this route."),
      keywords: unique(config.keywords || []),
      mapX: Number.isFinite(Number(config.mapX)) ? Number(config.mapX) : 50,
      mapY: Number.isFinite(Number(config.mapY)) ? Number(config.mapY) : 50,
      x: Number.isFinite(Number(config.x)) ? Number(config.x) : Number.isFinite(Number(config.mapX)) ? Number(config.mapX) : 50,
      y: Number.isFinite(Number(config.y)) ? Number(config.y) : Number.isFinite(Number(config.mapY)) ? Number(config.mapY) : 50,
      status: String(config.status || "active"),
      priority: Number.isFinite(Number(config.priority)) ? Number(config.priority) : 50,
      showInBlueprint: config.showInBlueprint !== false,
      mirrorlandAligned: Boolean(config.mirrorlandAligned),
      mirrorlandDoor: Boolean(config.mirrorlandDoor),
      websiteOption: Boolean(config.websiteOption),
      singleEntryway: true,
      entryway: config.mirrorlandDoor ? "map-portal-blip" : "website-option"
    });
  }

  const ROUTES = freeze([
    route({
      routeId: "compass",
      path: "/",
      title: "Compass",
      shortTitle: "Compass",
      group: "Main Menu / Website Options",
      menu: "main",
      wing: "Interface Origin",
      type: "root",
      role: "orientation",
      cardinal: "north",
      children: ["/door/", "/home/", "/laws/", "/gauges/"],
      nearby: ["/door/", "/home/", "/gauges/"],
      description: "The main-site orientation layer. Compass is separate from the Mirrorland Portal.",
      keywords: ["compass", "entry", "home", "root", "navigation", "website options"],
      mapX: 50,
      mapY: 12,
      priority: 100,
      websiteOption: true
    }),

    route({
      routeId: "door",
      path: "/door/",
      title: "Door",
      shortTitle: "Door",
      group: "Main Menu / Website Options",
      menu: "main",
      wing: "Website Threshold",
      type: "entry-threshold",
      role: "threshold",
      cardinal: "north",
      parent: "/",
      children: ["/home/"],
      nearby: ["/", "/home/", "/laws/"],
      description: "The ordinary site threshold route. It is not the Mirrorland entryway.",
      keywords: ["door", "threshold", "entry", "gateway", "main menu"],
      mapX: 50,
      mapY: 22,
      priority: 96,
      websiteOption: true
    }),

    route({
      routeId: "home",
      path: "/home/",
      title: "Home",
      shortTitle: "Home",
      group: "Main Menu / Website Options",
      menu: "main",
      wing: "Home Wing",
      type: "home-room",
      role: "stabilizer",
      cardinal: "north",
      parent: "/",
      children: ["/products/", "/laws/"],
      nearby: ["/", "/door/", "/gauges/"],
      description: "The central public home route for the Manor.",
      keywords: ["home", "manor", "main body", "center", "website options"],
      mapX: 50,
      mapY: 32,
      priority: 92,
      websiteOption: true
    }),

    route({
      routeId: "site-guide",
      path: "/site-guide/",
      title: "Site Guide",
      shortTitle: "Guide",
      group: "Main Menu / Website Options",
      menu: "main",
      wing: "Guide Wing",
      type: "instruction-page",
      role: "guide-room",
      cardinal: "north",
      parent: "/",
      nearby: ["/", "/gauges/", "/laws/"],
      description: "Full navigation guide for the Manor, route language, gems, chambers, lenses, and Gauges.",
      keywords: ["guide", "instructions", "navigation", "return to orbit", "gems"],
      mapX: 50,
      mapY: 90,
      priority: 88,
      status: "planned",
      websiteOption: true
    }),

    route({
      routeId: "meet-sean",
      path: "/about-this-underdog/",
      title: "Meet Sean Mansfield",
      shortTitle: "Meet Sean",
      group: "Main Menu / Website Options",
      menu: "main",
      wing: "Identity Wing",
      type: "identity-page",
      role: "public-facing-room",
      cardinal: "west",
      parent: "/",
      nearby: ["/", "/home/", "/products/"],
      description: "Public-facing identity and mission route.",
      keywords: ["sean", "this underdog", "identity", "about"],
      mapX: 28,
      mapY: 32,
      priority: 76,
      websiteOption: true
    }),

    route({
      routeId: "products",
      path: "/products/",
      title: "Products",
      shortTitle: "Products",
      group: "Main Menu / Website Options",
      menu: "main",
      wing: "Product Wing",
      type: "product-hub",
      role: "product-room",
      cardinal: "west",
      parent: "/",
      nearby: ["/", "/home/", "/gauges/"],
      description: "Product chamber and offering route.",
      keywords: ["products", "showroom", "offers", "store"],
      mapX: 78,
      mapY: 36,
      priority: 72,
      websiteOption: true
    }),

    route({
      routeId: "laws",
      path: "/laws/",
      title: "Laws",
      shortTitle: "Laws",
      group: "Main Menu / Website Options",
      menu: "main",
      wing: "Law Wing",
      type: "law-hub",
      role: "law-room",
      cardinal: "south",
      parent: "/",
      nearby: ["/", "/governance/", "/gauges/"],
      description: "Law and rule structure route. It may support Mirrorland, but it is not the entrance.",
      keywords: ["laws", "rules", "categories", "engineering", "truth layer"],
      mapX: 30,
      mapY: 46,
      priority: 90,
      websiteOption: true
    }),

    route({
      routeId: "governance",
      path: "/governance/",
      title: "Governance",
      shortTitle: "Governance",
      group: "Main Menu / Website Options",
      menu: "main",
      wing: "Governance Hall",
      type: "governance-hub",
      role: "governance-room",
      cardinal: "south",
      parent: "/",
      nearby: ["/laws/", "/gauges/", "/"],
      description: "Governance route for policy, compliance, public risk, and decisions.",
      keywords: ["governance", "policy", "compliance", "risk", "decision"],
      mapX: 24,
      mapY: 54,
      priority: 82,
      websiteOption: true
    }),

    route({
      routeId: "gauges",
      path: "/gauges/",
      title: "Gauges / Triple G",
      shortTitle: "Gauges",
      group: "Main Menu / Website Options",
      menu: "main",
      wing: "Audit Wing",
      type: "audit-hub",
      role: "measurement-room",
      cardinal: "south",
      parent: "/",
      children: ["/gauges/h-earth/"],
      nearby: ["/", "/laws/"],
      description: "Audit and proof surface for route status and readiness signals.",
      keywords: ["gauges", "triple g", "audit", "proof", "status"],
      mapX: 48,
      mapY: 78,
      priority: 95,
      websiteOption: true
    }),

    route({
      routeId: "gauges-h-earth",
      path: "/gauges/h-earth/",
      title: "H-Earth Gauges",
      shortTitle: "H-Earth Audit",
      group: "Main Menu / Website Options",
      menu: "main",
      wing: "Audit Wing",
      type: "audit-route",
      role: "measurement-room",
      cardinal: "south",
      parent: "/gauges/",
      nearby: ["/gauges/", "/showroom/globe/h-earth/"],
      description: "H-Earth audit and readiness route.",
      keywords: ["gauges", "h-earth", "audit", "readiness"],
      mapX: 56,
      mapY: 82,
      priority: 74,
      websiteOption: true
    }),

    route({
      routeId: "showroom-door",
      path: "/showroom/",
      title: "Door / Showroom",
      shortTitle: "Door",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      wing: "Portal Foyer",
      type: "showroom-hub",
      role: "door-context",
      cardinal: "center",
      parent: "",
      children: ["/showroom/globe/"],
      nearby: ["/showroom/globe/", "/showroom/globe/audralia/"],
      description: "The Door context and Diamond Lattice object page. The blip is the entryway; this is the threshold room.",
      keywords: ["showroom", "door", "diamond lattice", "mirrorland", "entryway"],
      mapX: 50,
      mapY: 50,
      priority: 99,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "mirrorland-field",
      path: "/showroom/globe/",
      title: "Globe / Mirrorland Field",
      shortTitle: "Mirrorland Field",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      wing: "Mirrorland Gate",
      type: "globe-hub",
      role: "field-door",
      cardinal: "east",
      parent: "/showroom/",
      children: [
        "/showroom/globe/earth/",
        "/showroom/globe/audralia/",
        "/showroom/globe/hearth/",
        "/showroom/globe/h-earth/"
      ],
      nearby: ["/showroom/", "/showroom/globe/audralia/", "/gauges/"],
      description: "The Mirrorland field door inside the map. Select it after entering through the blip.",
      keywords: ["globe", "planet", "showcase", "gateway", "mirrorland doors"],
      mapX: 70,
      mapY: 44,
      priority: 94,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "earth",
      path: "/showroom/globe/earth/",
      title: "Earth Reference",
      shortTitle: "Earth",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      wing: "Reference Bodies",
      type: "planet-reference",
      role: "reference-room",
      cardinal: "east",
      parent: "/showroom/globe/",
      nearby: ["/showroom/globe/", "/showroom/globe/audralia/", "/showroom/globe/hearth/"],
      description: "Reference body route for Earth inside the world inspection shelf.",
      keywords: ["earth", "reference", "blue marble", "planet"],
      mapX: 56,
      mapY: 52,
      priority: 80,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "audralia",
      path: "/showroom/globe/audralia/",
      title: "Audralia / Planetary Path",
      shortTitle: "Audralia",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      wing: "Audralia World Wing",
      type: "planet-hub",
      role: "planetary-door",
      cardinal: "east",
      parent: "/showroom/globe/",
      children: ["/showroom/globe/audralia/planet/", "/showroom/globe/audralia/disposition/"],
      nearby: ["/showroom/globe/", "/showroom/globe/audralia/planet/", "/showroom/globe/audralia/disposition/", "/gauges/"],
      description: "Audralia planet hub and first living planetary door inside Mirrorland.",
      keywords: ["audralia", "mirrorland", "planet", "world", "planetary path"],
      mapX: 70,
      mapY: 54,
      priority: 98,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "audralia-planet",
      path: "/showroom/globe/audralia/planet/",
      title: "Audralia Planet",
      shortTitle: "Planet",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      wing: "Audralia World Wing",
      type: "planet-screen",
      role: "planet-room",
      cardinal: "east",
      parent: "/showroom/globe/audralia/",
      nearby: ["/showroom/globe/audralia/", "/showroom/globe/audralia/disposition/", "/showroom/globe/", "/gauges/"],
      description: "Audralia future-body screen and planet inspection room.",
      keywords: ["audralia", "planet", "future body", "renderplex", "mirrorland"],
      mapX: 78,
      mapY: 58,
      priority: 99,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "audralia-cockpit",
      path: "/showroom/globe/audralia/disposition/",
      title: "Audralia Intergalactic Cockpit",
      shortTitle: "Cockpit",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      wing: "Audralia Instruments",
      type: "cockpit",
      role: "instrument-room",
      cardinal: "east",
      parent: "/showroom/globe/audralia/",
      nearby: ["/showroom/globe/audralia/", "/showroom/globe/audralia/planet/", "/showroom/globe/", "/gauges/"],
      description: "Audralia cockpit route for lattice and disposition inspection.",
      keywords: ["audralia", "cockpit", "lattice", "disposition"],
      mapX: 82,
      mapY: 50,
      priority: 91,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "hearth",
      path: "/showroom/globe/hearth/",
      title: "Hearth",
      shortTitle: "Hearth",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      wing: "Planet Hall",
      type: "planet-route",
      role: "world-room",
      cardinal: "east",
      parent: "/showroom/globe/",
      nearby: ["/showroom/globe/", "/showroom/globe/audralia/", "/showroom/globe/h-earth/"],
      description: "Hearth planet room inside the world inspection shelf.",
      keywords: ["hearth", "planet", "terrain", "world"],
      mapX: 64,
      mapY: 64,
      priority: 84,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "h-earth",
      path: "/showroom/globe/h-earth/",
      title: "H-Earth",
      shortTitle: "H-Earth",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      wing: "H-Earth World Wing",
      type: "planet-route",
      role: "world-room",
      cardinal: "east",
      parent: "/showroom/globe/",
      nearby: ["/showroom/globe/", "/showroom/globe/hearth/", "/gauges/h-earth/"],
      description: "H-Earth experimental world path inside Mirrorland.",
      keywords: ["h-earth", "hybrid earth", "planet", "surface"],
      mapX: 58,
      mapY: 64,
      priority: 83,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "characters",
      path: "/characters/",
      title: "Characters / Story Faces",
      shortTitle: "Characters",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      wing: "Character Wing",
      type: "narrative-hub",
      role: "character-room",
      cardinal: "east",
      parent: "/showroom/",
      nearby: ["/showroom/", "/nine-summits/universe/", "/showroom/globe/audralia/"],
      description: "Character and narrative room inside the Mirrorland field.",
      keywords: ["characters", "story", "narrative", "mirrorland"],
      mapX: 82,
      mapY: 70,
      priority: 86,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "nine-summits-universe",
      path: "/nine-summits/universe/",
      title: "Nine Summits Universe",
      shortTitle: "Nine Summits",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      wing: "Universe Hall",
      type: "universe-route",
      role: "universe-room",
      cardinal: "east",
      parent: "/showroom/",
      nearby: ["/characters/", "/showroom/globe/audralia/", "/showroom/globe/"],
      description: "Universe room for Nine Summits and Mirrorland context.",
      keywords: ["nine summits", "universe", "mirrorland", "story"],
      mapX: 72,
      mapY: 78,
      priority: 78,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "frontier",
      path: "/explore/frontier/",
      title: "Frontier / West Deployment Wing",
      shortTitle: "Frontier",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      wing: "Frontier Deployment",
      type: "frontier-hub",
      role: "west-deployment-door",
      cardinal: "west",
      parent: "/showroom/",
      children: ["/explore/frontier/water/", "/explore/frontier/waste/", "/explore/frontier/energy/"],
      nearby: ["/explore/frontier/water/", "/explore/frontier/waste/", "/gauges/"],
      description: "Frontier belongs to Mirrorland and sits in the West deployment wing.",
      keywords: ["frontier", "mirrorland", "water", "waste", "energy", "closed loop", "west"],
      mapX: 22,
      mapY: 70,
      priority: 94,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "frontier-water",
      path: "/explore/frontier/water/",
      title: "Frontier Water",
      shortTitle: "Water",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      wing: "Water Chamber",
      type: "frontier-route",
      role: "water-room",
      cardinal: "west",
      parent: "/explore/frontier/",
      nearby: ["/explore/frontier/", "/explore/frontier/waste/", "/explore/frontier/energy/"],
      description: "Water frontier room for closed-loop water thinking and system pressure.",
      keywords: ["water", "frontier", "closed loop", "lattice"],
      mapX: 18,
      mapY: 78,
      priority: 80,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "frontier-waste",
      path: "/explore/frontier/waste/",
      title: "Frontier Waste",
      shortTitle: "Waste",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      wing: "Waste Chamber",
      type: "frontier-route",
      role: "waste-room",
      cardinal: "west",
      parent: "/explore/frontier/",
      nearby: ["/explore/frontier/", "/explore/frontier/water/", "/explore/frontier/energy/"],
      description: "Waste frontier room for hazardous mass accountability and closure.",
      keywords: ["waste", "frontier", "closed loop", "capture", "destruction"],
      mapX: 26,
      mapY: 78,
      priority: 80,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    }),

    route({
      routeId: "frontier-energy",
      path: "/explore/frontier/energy/",
      title: "Frontier Energy",
      shortTitle: "Energy",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      wing: "Energy Chamber",
      type: "frontier-route",
      role: "energy-room",
      cardinal: "west",
      parent: "/explore/frontier/",
      nearby: ["/explore/frontier/", "/explore/frontier/water/", "/explore/frontier/waste/"],
      description: "Energy frontier room inside the West deployment wing.",
      keywords: ["energy", "frontier", "power", "infrastructure"],
      mapX: 34,
      mapY: 78,
      priority: 70,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    })
  ]);

  const INSTRUCTIONS = freeze([
    {
      termId: "single-entryway",
      title: "Single Entryway",
      shortTitle: "Entryway",
      body: "The floating Map / Portal blip is the single public entryway into Mirrorland.",
      description: "The floating Map / Portal blip is the single public entryway into Mirrorland.",
      keywords: ["entryway", "map", "portal", "mirrorland"]
    },
    {
      termId: "mirrorland-doors",
      title: "Mirrorland Doors",
      shortTitle: "Doors",
      body: "Inside the map, Mirrorland routes are presented as doors. Choose a door after opening the blip.",
      description: "Inside the map, Mirrorland routes are presented as doors. Choose a door after opening the blip.",
      keywords: ["doors", "mirrorland", "routes", "rooms"]
    },
    {
      termId: "main-menu-separation",
      title: "Main Menu Separation",
      shortTitle: "Main Menu",
      body: "Main Menu / Website Options remain separate from the Mirrorland Doors.",
      description: "Main Menu / Website Options remain separate from the Mirrorland Doors.",
      keywords: ["main menu", "website options", "separate"]
    },
    {
      termId: "compass-separated",
      title: "Compass Separated",
      shortTitle: "Compass",
      body: "Compass remains the main-site orientation layer. It is not the Mirrorland Portal.",
      description: "Compass remains the main-site orientation layer. It is not the Mirrorland Portal.",
      keywords: ["compass", "orientation", "separate"]
    },
    {
      termId: "frontier-west-wing",
      title: "Frontier West Wing",
      shortTitle: "Frontier",
      body: "Frontier belongs to Mirrorland and sits in the West deployment wing.",
      description: "Frontier belongs to Mirrorland and sits in the West deployment wing.",
      keywords: ["frontier", "west", "deployment", "mirrorland"]
    },
    {
      termId: "rooms",
      title: "Rooms",
      shortTitle: "Rooms",
      body: "Every route is represented as a room. Tap a room to enter that route.",
      description: "Every route is represented as a room. Tap a room to enter that route.",
      keywords: ["rooms", "routes", "map"]
    },
    {
      termId: "joystick-scroll",
      title: "Joystick Scroll",
      shortTitle: "Scroll",
      body: "Drag the Map / Portal blip near the top or bottom edge to scroll with the stronger visible force profile.",
      description: "Drag the Map / Portal blip near the top or bottom edge to scroll with the stronger visible force profile.",
      keywords: ["scroll", "joystick", "drag"]
    }
  ]);

  const GROUP_ORDER = freeze([
    "Mirrorland Doors",
    "Main Menu / Website Options"
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

    const parts = normalized.split("/").filter(Boolean);

    while (parts.length) {
      const parentPath = normalizePath("/" + parts.join("/") + "/");
      if (ROUTE_BY_PATH.has(parentPath)) return ROUTE_BY_PATH.get(parentPath);
      parts.pop();
    }

    return ROUTE_BY_PATH.get("/") || ROUTES[0] || null;
  }

  function currentRoute() {
    const pathname = window.location && window.location.pathname ? window.location.pathname : "/";
    return nearestRoute(pathname);
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
    if (routeItem && !chain.some((item) => item.path === routeItem.path)) {
      chain.push(routeItem);
    }

    return freeze(chain);
  }

  function childrenOf(path) {
    const item = nearestRoute(path);
    if (!item) return freeze([]);

    return freeze(
      item.children
        .map(getRouteByPath)
        .filter(Boolean)
        .sort((a, b) => b.priority - a.priority || a.title.localeCompare(b.title))
    );
  }

  function nearbyFor(path) {
    const item = nearestRoute(path);
    if (!item) return freeze([]);

    const nearby = item.nearby.map(getRouteByPath).filter(Boolean);
    const parent = item.parent ? getRouteByPath(item.parent) : null;
    const children = childrenOf(item.path);

    return freeze(
      unique([parent, ...children, ...nearby].filter(Boolean).map((routeItem) => routeItem.path))
        .map(getRouteByPath)
        .filter(Boolean)
        .sort((a, b) => b.priority - a.priority || a.title.localeCompare(b.title))
    );
  }

  function routesByGroup() {
    const groups = {};

    for (const groupName of GROUP_ORDER) groups[groupName] = [];

    for (const item of ROUTES) {
      if (!item.showInBlueprint) continue;
      if (!groups[item.group]) groups[item.group] = [];
      groups[item.group].push(item);
    }

    for (const key of Object.keys(groups)) {
      groups[key] = groups[key].sort((a, b) => b.priority - a.priority || a.title.localeCompare(b.title));
    }

    return freeze(groups);
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
            item.group,
            item.menu,
            item.wing,
            item.type,
            item.role,
            item.description,
            ...(item.keywords || [])
          ].join(" ").toLowerCase();

          return haystack.includes(q);
        })
        .sort((a, b) => b.priority - a.priority || a.title.localeCompare(b.title))
    );
  }

  function routeSummary(path) {
    const item = nearestRoute(path);
    if (!item) {
      return freeze({
        found: false,
        route: null,
        chain: [],
        children: [],
        nearby: []
      });
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
      groupCount: Object.keys(routesByGroup()).length,
      instructionCount: INSTRUCTIONS.length,
      navigationTermCount: INSTRUCTIONS.length,
      currentPath: normalizePath(window.location && window.location.pathname ? window.location.pathname : "/"),
      currentRouteId: current ? current.routeId : "",
      currentRouteTitle: current ? current.title : "",
      mapBlipSingleEntryway: true,
      mirrorlandEntryway: "map_portal_blip",
      mirrorlandMenuLabel: "Mirrorland Doors",
      mirrorlandDoorsInsideMap: true,
      mainMenuSeparated: true,
      websiteOptionsSeparated: true,
      compassSeparated: true,
      frontierMirrorlandAligned: true,
      pageBodyDirectory: false,
      hasAudraliaPlanet: Boolean(getRouteByPath("/showroom/globe/audralia/planet/")),
      supportsYouAreHere: true,
      supportsParentChain: true,
      supportsNearbyRoutes: true,
      supportsInstructionTerms: true,
      imageGeneration: false,
      graphicBox: false,
      heavyRuntime: false,
      perPageCustomCode: false
    });
  }

  const API = freeze({
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    registryId: REGISTRY_ID,
    siteRoot: SITE_ROOT,
    routes: ROUTES,
    groupOrder: GROUP_ORDER,
    instructions: INSTRUCTIONS,
    navigationTerms: INSTRUCTIONS,
    mapBlipSingleEntryway: true,
    mirrorlandEntryway: "map_portal_blip",
    mirrorlandMenuLabel: "Mirrorland Doors",
    mirrorlandDoorsInsideMap: true,
    mainMenuSeparated: true,
    websiteOptionsSeparated: true,
    compassSeparated: true,
    frontierMirrorlandAligned: true,
    pageBodyDirectory: false,
    normalizePath,
    getRouteByPath,
    getRouteById,
    nearestRoute,
    currentRoute,
    parentChain,
    childrenOf,
    nearbyFor,
    routesByGroup,
    searchRoutes,
    routeSummary,
    status
  });

  window[API_GLOBAL] = API;
  window[STATUS_GLOBAL] = status();

  window.DGB_MANOR_BLUEPRINT_ROUTE_REGISTRY = ROUTES;
  window.DGB_MANOR_BLUEPRINT_NAVIGATION_TERMS = INSTRUCTIONS;
  window.DGB_MANOR_BLUEPRINT_INSTRUCTIONS = INSTRUCTIONS;
})();

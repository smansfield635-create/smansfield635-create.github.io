// TARGET FILE: /assets/manor-blueprint/manor.blueprint.registry.js
// TNT FULL-FILE REPLACEMENT
// MANOR_BLUEPRINT_ROUTE_REGISTRY_TNT_v1
//
// Manor Blueprint route registry.
// Owns route truth, parent/child relationships, route matching, groups, nearby routes,
// and instruction glossary metadata for the future Blueprint HUD overlay.
//
// Does not own DOM rendering, CSS, draggable bubble behavior, overlay behavior,
// page content, page layout, canvas rendering, Gauges logic, GraphicBox, or generated images.

(() => {
  "use strict";

  if (typeof window === "undefined") return;

  const CONTRACT = "MANOR_BLUEPRINT_ROUTE_REGISTRY_TNT_v1";
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

  function route(
    routeId,
    path,
    title,
    shortTitle,
    group,
    wing,
    type,
    parent,
    children,
    nearby,
    description,
    keywords,
    mapX,
    mapY,
    priority,
    status = "active"
  ) {
    return freeze({
      routeId,
      path: normalizePath(path),
      title,
      shortTitle,
      group,
      wing,
      type,
      parent: parent ? normalizePath(parent) : "",
      children: unique((children || []).map(normalizePath)),
      nearby: unique((nearby || []).map(normalizePath)),
      description,
      keywords: unique(keywords || []),
      mapX,
      mapY,
      status,
      priority,
      showInBlueprint: true
    });
  }

  const ROUTES = freeze([
    route(
      "compass",
      "/",
      "Compass",
      "Compass",
      "Core Manor",
      "Entry Field",
      "root",
      "",
      ["/door/", "/home/", "/showroom/", "/laws/", "/gauges/"],
      ["/door/", "/showroom/", "/gauges/"],
      "The main orientation point for the Manor and Estate.",
      ["compass", "entry", "home", "root", "navigation"],
      50,
      12,
      100
    ),

    route(
      "door",
      "/door/",
      "Door",
      "Door",
      "Core Manor",
      "Threshold",
      "entry-threshold",
      "/",
      ["/home/", "/showroom/"],
      ["/", "/home/", "/showroom/", "/laws/"],
      "The threshold route into the Manor navigation field.",
      ["door", "threshold", "entry", "gateway"],
      50,
      22,
      96
    ),

    route(
      "home",
      "/home/",
      "Home",
      "Home",
      "Core Manor",
      "House Main Body",
      "home-room",
      "/",
      ["/showroom/", "/products/", "/laws/"],
      ["/", "/door/", "/showroom/"],
      "The central public home route for the Manor.",
      ["home", "manor", "main body", "center"],
      50,
      32,
      92
    ),

    route(
      "meet-sean",
      "/about-this-underdog/",
      "Meet Sean Mansfield",
      "Meet Sean",
      "Core Manor",
      "Identity Wing",
      "identity-page",
      "/",
      [],
      ["/", "/home/", "/showroom/"],
      "Public-facing identity and mission route.",
      ["sean", "this underdog", "identity", "about"],
      28,
      32,
      76
    ),

    route(
      "showroom",
      "/showroom/",
      "Showroom",
      "Showroom",
      "Showroom",
      "Showroom Hall",
      "showroom-hub",
      "/",
      ["/showroom/globe/"],
      ["/", "/home/", "/showroom/globe/", "/products/"],
      "The display wing for major visual and interactive systems.",
      ["showroom", "display", "gallery", "interactive"],
      68,
      34,
      94
    ),

    route(
      "globe-showcase",
      "/showroom/globe/",
      "Globe Showcase",
      "Globe",
      "Showroom Globe",
      "Planet Hall",
      "globe-hub",
      "/showroom/",
      [
        "/showroom/globe/earth/",
        "/showroom/globe/audralia/",
        "/showroom/globe/hearth/",
        "/showroom/globe/h-earth/"
      ],
      ["/showroom/", "/showroom/globe/audralia/", "/gauges/"],
      "Gateway into the planet and globe inspection routes.",
      ["globe", "planet", "showcase", "gateway"],
      70,
      44,
      93
    ),

    route(
      "earth",
      "/showroom/globe/earth/",
      "Earth",
      "Earth",
      "Showroom Globe",
      "Reference Bodies",
      "planet-reference",
      "/showroom/globe/",
      [],
      ["/showroom/globe/", "/showroom/globe/audralia/", "/showroom/globe/hearth/"],
      "Reference body route for Earth.",
      ["earth", "reference", "blue marble", "planet"],
      56,
      52,
      80
    ),

    route(
      "audralia",
      "/showroom/globe/audralia/",
      "Audralia",
      "Audralia",
      "Showroom Globe",
      "Audralia Wing",
      "planet-hub",
      "/showroom/globe/",
      ["/showroom/globe/audralia/planet/", "/showroom/globe/audralia/disposition/"],
      ["/showroom/globe/", "/showroom/globe/audralia/planet/", "/showroom/globe/audralia/disposition/", "/gauges/"],
      "Audralia planet hub and Mirrorland world route.",
      ["audralia", "mirrorland", "planet", "world"],
      70,
      54,
      98
    ),

    route(
      "audralia-planet",
      "/showroom/globe/audralia/planet/",
      "Audralia Planet",
      "Planet",
      "Showroom Globe",
      "Audralia Wing",
      "planet-screen",
      "/showroom/globe/audralia/",
      [],
      [
        "/showroom/globe/audralia/",
        "/showroom/globe/audralia/disposition/",
        "/showroom/globe/",
        "/gauges/"
      ],
      "Audralia future-body screen and planet inspection route.",
      ["audralia", "planet", "future body", "renderplex", "mirrorland"],
      78,
      58,
      99
    ),

    route(
      "audralia-cockpit",
      "/showroom/globe/audralia/disposition/",
      "Audralia Intergalactic Cockpit",
      "Cockpit",
      "Showroom Globe",
      "Audralia Wing",
      "cockpit",
      "/showroom/globe/audralia/",
      [],
      ["/showroom/globe/audralia/", "/showroom/globe/audralia/planet/", "/showroom/globe/", "/gauges/"],
      "Audralia cockpit route for lattice and disposition inspection.",
      ["audralia", "cockpit", "lattice", "disposition"],
      82,
      50,
      91
    ),

    route(
      "hearth",
      "/showroom/globe/hearth/",
      "Hearth",
      "Hearth",
      "Showroom Globe",
      "Planet Hall",
      "planet-route",
      "/showroom/globe/",
      [],
      ["/showroom/globe/", "/showroom/globe/audralia/", "/showroom/globe/h-earth/"],
      "Hearth planet route.",
      ["hearth", "planet", "terrain", "world"],
      64,
      64,
      84
    ),

    route(
      "h-earth",
      "/showroom/globe/h-earth/",
      "H-Earth",
      "H-Earth",
      "Showroom Globe",
      "Planet Hall",
      "planet-route",
      "/showroom/globe/",
      [],
      ["/showroom/globe/", "/showroom/globe/hearth/", "/gauges/h-earth/"],
      "H-Earth experimental planet route.",
      ["h-earth", "hybrid earth", "planet", "surface"],
      58,
      64,
      83
    ),

    route(
      "laws",
      "/laws/",
      "Laws",
      "Laws",
      "Law Wing",
      "Law Hall",
      "law-hub",
      "/",
      [],
      ["/", "/governance/", "/gauges/"],
      "Law and rule structure route.",
      ["laws", "rules", "categories", "engineering"],
      30,
      46,
      90
    ),

    route(
      "governance",
      "/governance/",
      "Governance",
      "Governance",
      "Law Wing",
      "Governance Hall",
      "governance-hub",
      "/",
      [],
      ["/laws/", "/gauges/", "/"],
      "Governance route for policy, compliance, public risk, and decisions.",
      ["governance", "policy", "compliance", "risk", "decision"],
      24,
      54,
      82
    ),

    route(
      "gauges",
      "/gauges/",
      "Gauges / Triple G",
      "Gauges",
      "Audit Wing",
      "Triple G",
      "audit-hub",
      "/",
      ["/gauges/h-earth/"],
      ["/", "/showroom/globe/", "/laws/"],
      "Audit and proof surface for route status and readiness signals.",
      ["gauges", "triple g", "audit", "proof", "status"],
      48,
      78,
      95
    ),

    route(
      "gauges-h-earth",
      "/gauges/h-earth/",
      "H-Earth Gauges",
      "H-Earth Audit",
      "Audit Wing",
      "Triple G",
      "audit-route",
      "/gauges/",
      [],
      ["/gauges/", "/showroom/globe/h-earth/", "/showroom/globe/"],
      "H-Earth audit and readiness route.",
      ["gauges", "h-earth", "audit", "readiness"],
      56,
      82,
      74
    ),

    route(
      "products",
      "/products/",
      "Products",
      "Products",
      "Products",
      "Product Hall",
      "product-hub",
      "/",
      [],
      ["/", "/home/", "/showroom/"],
      "Product chamber and offering route.",
      ["products", "showroom", "offers", "store"],
      78,
      36,
      72
    ),

    route(
      "frontier",
      "/explore/frontier/",
      "Frontier",
      "Frontier",
      "Frontier",
      "Frontier Hall",
      "frontier-hub",
      "/",
      ["/explore/frontier/water/", "/explore/frontier/waste/", "/explore/frontier/energy/"],
      ["/", "/explore/frontier/water/", "/explore/frontier/waste/", "/gauges/"],
      "Frontier exploration hub for water, waste, energy, and closed-loop systems.",
      ["frontier", "water", "waste", "energy", "closed loop"],
      22,
      70,
      86
    ),

    route(
      "frontier-water",
      "/explore/frontier/water/",
      "Frontier Water",
      "Water",
      "Frontier",
      "Water Chamber",
      "frontier-route",
      "/explore/frontier/",
      [],
      ["/explore/frontier/", "/explore/frontier/waste/", "/explore/frontier/energy/"],
      "Water frontier route for closed-loop water thinking and system pressure.",
      ["water", "frontier", "closed loop", "lattice"],
      18,
      78,
      80
    ),

    route(
      "frontier-waste",
      "/explore/frontier/waste/",
      "Frontier Waste",
      "Waste",
      "Frontier",
      "Waste Chamber",
      "frontier-route",
      "/explore/frontier/",
      [],
      ["/explore/frontier/", "/explore/frontier/water/", "/explore/frontier/energy/"],
      "Waste frontier route for hazardous mass accountability and closure.",
      ["waste", "frontier", "closed loop", "capture", "destruction"],
      26,
      78,
      80
    ),

    route(
      "frontier-energy",
      "/explore/frontier/energy/",
      "Frontier Energy",
      "Energy",
      "Frontier",
      "Energy Chamber",
      "frontier-route",
      "/explore/frontier/",
      [],
      ["/explore/frontier/", "/explore/frontier/water/", "/explore/frontier/waste/"],
      "Energy frontier route.",
      ["energy", "frontier", "power", "infrastructure"],
      34,
      78,
      70
    ),

    route(
      "characters",
      "/characters/",
      "Characters",
      "Characters",
      "Narrative Wing",
      "Character Hall",
      "narrative-hub",
      "/",
      [],
      ["/", "/showroom/", "/nine-summits/universe/"],
      "Character and narrative route.",
      ["characters", "story", "narrative", "mirrorland"],
      82,
      70,
      68
    ),

    route(
      "nine-summits-universe",
      "/nine-summits/universe/",
      "Nine Summits Universe",
      "Nine Summits",
      "Narrative Wing",
      "Universe Hall",
      "universe-route",
      "/",
      [],
      ["/characters/", "/showroom/globe/audralia/", "/showroom/globe/"],
      "Universe route for the Nine Summits and Mirrorland context.",
      ["nine summits", "universe", "mirrorland", "story"],
      72,
      78,
      78
    ),

    route(
      "site-guide",
      "/site-guide/",
      "Site Guide",
      "Guide",
      "Guide",
      "Instruction Hall",
      "instruction-page",
      "/",
      [],
      ["/", "/gauges/", "/showroom/globe/"],
      "Full navigation guide for the Manor, Return to Orbit, gems, chambers, lenses, and Gauges.",
      ["guide", "instructions", "navigation", "return to orbit", "gems"],
      50,
      90,
      88,
      "planned"
    )
  ]);

  const NAVIGATION_TERMS = freeze([
    {
      termId: "floating-bubble",
      title: "Floating Bubble",
      shortTitle: "Bubble",
      description: "The bubble stays on screen as you scroll. Drag it out of the way if it covers text. Tap it to open the Manor Blueprint.",
      keywords: ["bubble", "map", "blueprint", "hud"]
    },
    {
      termId: "you-are-here",
      title: "You Are Here",
      shortTitle: "You Are Here",
      description: "Shows the current route and where it sits inside the Manor / Estate structure.",
      keywords: ["current route", "location", "map"]
    },
    {
      termId: "return-to-orbit",
      title: "Return to Orbit",
      shortTitle: "Return",
      description: "Return to Orbit sends you back to the parent inspection field or route hub for the section you are reading.",
      keywords: ["return", "orbit", "hub", "parent"]
    },
    {
      termId: "route-map",
      title: "Route Map",
      shortTitle: "Route Map",
      description: "The Route Map is the page-level movement menu.",
      keywords: ["route", "menu", "navigation"]
    },
    {
      termId: "gems",
      title: "Gems",
      shortTitle: "Gems",
      description: "Gems are visual route instruments. They may open rooms, chambers, routes, or inspection areas.",
      keywords: ["gems", "diamonds", "routes", "instruments"]
    },
    {
      termId: "inspection-chambers",
      title: "Inspection Chambers",
      shortTitle: "Chambers",
      description: "Chambers are expandable sections that organize deeper page content.",
      keywords: ["chambers", "details", "sections"]
    },
    {
      termId: "platform-engineering",
      title: "Platform / Engineering Lens",
      shortTitle: "Lenses",
      description: "Platform language explains the idea for general visitors. Engineering language explains the same structure in system, route, runtime, or proof terms.",
      keywords: ["platform", "engineering", "lens", "toggle"]
    },
    {
      termId: "gauges-triple-g",
      title: "Gauges / Triple G",
      shortTitle: "Gauges",
      description: "Gauges are proof and audit surfaces. They show route status, checks, and readiness signals.",
      keywords: ["gauges", "triple g", "audit", "proof"]
    },
    {
      termId: "receipt-dock",
      title: "Receipt Dock",
      shortTitle: "Receipt",
      description: "Receipt Dock shows status, contract, and no-false-claim proof.",
      keywords: ["receipt", "status", "contract", "proof"]
    },
    {
      termId: "blueprint-map",
      title: "Blueprint Map",
      shortTitle: "Blueprint",
      description: "The Blueprint Map lets you move across the Manor without needing to understand every route name first.",
      keywords: ["blueprint", "map", "manor", "navigation"]
    }
  ]);

  const GROUP_ORDER = freeze([
    "Core Manor",
    "Showroom",
    "Showroom Globe",
    "Law Wing",
    "Audit Wing",
    "Products",
    "Frontier",
    "Narrative Wing",
    "Guide"
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

    const nearby = item.nearby
      .map(getRouteByPath)
      .filter(Boolean);

    const parent = item.parent ? getRouteByPath(item.parent) : null;
    const children = childrenOf(item.path);

    return freeze(
      unique([
        parent,
        ...children,
        ...nearby
      ].filter(Boolean).map((routeItem) => routeItem.path))
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
    if (!q) {
      return freeze(ROUTES.filter((item) => item.showInBlueprint).sort((a, b) => b.priority - a.priority));
    }

    return freeze(
      ROUTES
        .filter((item) => {
          const haystack = [
            item.routeId,
            item.path,
            item.title,
            item.shortTitle,
            item.group,
            item.wing,
            item.type,
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
      registryId: REGISTRY_ID,
      active: true,
      routeCount: ROUTES.length,
      groupCount: Object.keys(routesByGroup()).length,
      navigationTermCount: NAVIGATION_TERMS.length,
      currentPath: normalizePath(window.location && window.location.pathname ? window.location.pathname : "/"),
      currentRouteId: current ? current.routeId : "",
      currentRouteTitle: current ? current.title : "",
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
    registryId: REGISTRY_ID,
    siteRoot: SITE_ROOT,
    routes: ROUTES,
    groupOrder: GROUP_ORDER,
    navigationTerms: NAVIGATION_TERMS,
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
  window.DGB_MANOR_BLUEPRINT_NAVIGATION_TERMS = NAVIGATION_TERMS;
})();

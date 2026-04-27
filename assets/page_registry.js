/*
  PAGE_REGISTRY_TNT_B2
  FILE: /assets/page_registry.js
  PURPOSE: 15-center-room metadata contract for the Manor / planetary lattice.
  SCOPE: Safe standalone registry. No page body rewrites. No live Gauges override.
*/

(function attachManorPageRegistry(global) {
  "use strict";

  const VERSION = "PAGE_REGISTRY_TNT_B2";
  const SKIN_VERSION = "manor-skin-v1";
  const GEOMETRY = Object.freeze({
    lattice: "16x16",
    cells: 256,
    quadrants: 4,
    cellsPerQuadrant: 64,
    rule: "House first. Planets second. No isolated expressive island."
  });

  const QUADRANTS = Object.freeze({
    Q1_NORTHWEST: Object.freeze({
      label: "Orientation / Law / Authority",
      cellRange: "001-064"
    }),
    Q2_NORTHEAST: Object.freeze({
      label: "Discovery / Signal / Expansion",
      cellRange: "065-128"
    }),
    Q3_SOUTHEAST: Object.freeze({
      label: "Product / Execution / Public Utility",
      cellRange: "129-192"
    }),
    Q4_SOUTHWEST: Object.freeze({
      label: "Continuity / Events / Human Story",
      cellRange: "193-256"
    })
  });

  const HOUSE_BACKLINKS = Object.freeze([
    "/",
    "/door/",
    "/products/",
    "/showroom/",
    "/gauges/"
  ]);

  const PLANET_BACKLINKS = Object.freeze([
    "/",
    "/products/",
    "/showroom/",
    "/gauges/"
  ]);

  const PRODUCT_DESTINATIONS = Object.freeze([
    Object.freeze({
      id: "archcoin",
      title: "ARCHCOIN",
      route: "/products/archcoin/",
      rule: "Four-coin financial transaction template. Product chamber, not center-room planet."
    }),
    Object.freeze({
      id: "five-flags",
      title: "Five Flags",
      route: "/products/five-flags/",
      rule: "Canonical product destination."
    }),
    Object.freeze({
      id: "on-your-side-ai",
      title: "On Your Side AAI",
      route: "/products/on-your-side-ai/",
      rule: "Canonical AAI destination."
    }),
    Object.freeze({
      id: "education",
      title: "ESL Traversal Learning",
      route: "/products/education/",
      rule: "Canonical education destination."
    }),
    Object.freeze({
      id: "nutrition",
      title: "Baseline Nutrition Systems",
      route: "/products/nutrition/",
      rule: "Canonical nutrition destination."
    })
  ]);

  const PAGES = Object.freeze([
    Object.freeze({
      id: "compass",
      title: "Compass",
      class: "house",
      houseSlot: "H1_COMPASS",
      canonicalRoute: "/",
      aliases: Object.freeze(["/index.html"]),
      quadrant: "Q1_NORTHWEST",
      latticeRegion: "Center-cross",
      visualIdentity: "Root orientation, active-page gold compass, estate spatial meaning.",
      publicPurpose: "Orientation core. Shows where the visitor is and where they can go.",
      backlinkObligations: HOUSE_BACKLINKS,
      auditMarkers: Object.freeze(["route-exists", "active-compass", "manor-skin", "house-class"]),
      batch: "BATCH_1_HOUSE",
      nextDiagnosticDependency: "Confirm all center-room routes remain reachable from Compass."
    }),
    Object.freeze({
      id: "door",
      title: "Door",
      class: "house",
      houseSlot: "H2_DOOR",
      canonicalRoute: "/door/",
      aliases: Object.freeze([]),
      quadrant: "Q1_NORTHWEST",
      latticeRegion: "Outer threshold band",
      visualIdentity: "Entry threshold, warm gold permission surface, clear onward rail.",
      publicPurpose: "Arrival and transition into the Manor.",
      backlinkObligations: HOUSE_BACKLINKS,
      auditMarkers: Object.freeze(["route-exists", "entry-threshold", "manor-skin", "house-class"]),
      batch: "BATCH_1_HOUSE",
      nextDiagnosticDependency: "Confirm Door routes inward rather than becoming a detached landing page."
    }),
    Object.freeze({
      id: "home",
      title: "Home",
      class: "house",
      houseSlot: "H3_HOME",
      canonicalRoute: "/home/",
      aliases: Object.freeze([]),
      quadrant: "Q4_SOUTHWEST",
      latticeRegion: "Inner body band",
      visualIdentity: "Central Manor body, inhabited identity, stable public center.",
      publicPurpose: "The inhabited center and public identity of the house.",
      backlinkObligations: HOUSE_BACKLINKS,
      auditMarkers: Object.freeze(["route-exists", "central-body", "manor-skin", "house-class"]),
      batch: "BATCH_1_HOUSE",
      nextDiagnosticDependency: "Confirm Home stabilizes the estate and does not replace Compass."
    }),
    Object.freeze({
      id: "products",
      title: "Products",
      class: "house",
      houseSlot: "H4_PRODUCTS",
      canonicalRoute: "/products/",
      aliases: Object.freeze([]),
      quadrant: "Q3_SOUTHEAST",
      latticeRegion: "Source-waterfall corridor",
      visualIdentity: "Source chamber, product waterfall, many jump-off points / one destination law.",
      publicPurpose: "Product routing, product family logic, and canonical destination control.",
      backlinkObligations: HOUSE_BACKLINKS,
      auditMarkers: Object.freeze(["route-exists", "product-waterfall", "canonical-destinations", "house-class"]),
      batch: "BATCH_1_HOUSE",
      productDestinations: PRODUCT_DESTINATIONS,
      nextDiagnosticDependency: "Confirm product chambers remain beneath Products and do not become competing center rooms."
    }),
    Object.freeze({
      id: "showroom",
      title: "Showroom",
      class: "house",
      houseSlot: "H5_SHOWROOM",
      canonicalRoute: "/showroom/",
      aliases: Object.freeze([]),
      quadrant: "Q3_SOUTHEAST",
      latticeRegion: "Public proof window",
      visualIdentity: "Public proof room, demonstration surface, legitimacy window.",
      publicPurpose: "Visible proof, external-facing legitimacy, and estate presentation.",
      backlinkObligations: HOUSE_BACKLINKS,
      auditMarkers: Object.freeze(["route-exists", "proof-window", "manor-skin", "house-class"]),
      batch: "BATCH_1_HOUSE",
      nextDiagnosticDependency: "Confirm Showroom demonstrates without becoming the source chamber."
    }),
    Object.freeze({
      id: "gauges",
      title: "Gauges",
      class: "house",
      houseSlot: "H6_GAUGES",
      canonicalRoute: "/gauges/",
      aliases: Object.freeze([]),
      quadrant: "Q1_NORTHWEST",
      latticeRegion: "Diagnostic instrument room",
      visualIdentity: "Live site-health instrument surface, clear status rail, no static fake pass.",
      publicPurpose: "Live site health, route integrity, backlink integrity, render stability, and product connectivity.",
      backlinkObligations: HOUSE_BACKLINKS,
      auditMarkers: Object.freeze(["route-exists", "live-calculated", "diagnostic-room", "house-class"]),
      batch: "BATCH_1_HOUSE",
      liveCalculated: true,
      nextDiagnosticDependency: "Do not replace live Gauges with static output. Registry can inform Gauges; it must not fake Gauges."
    }),
    Object.freeze({
      id: "prelude",
      title: "Prelude",
      class: "planet",
      planetSlot: "P1_PRELUDE",
      canonicalRoute: "/prelude/",
      aliases: Object.freeze([]),
      quadrant: "Q4_SOUTHWEST",
      latticeRegion: "Outer entry atmosphere near Door",
      visualIdentity: "Opening atmosphere, symbolic first meaning layer, soft threshold glow.",
      publicPurpose: "Prepares the visitor for symbolic reading.",
      backlinkObligations: PLANET_BACKLINKS,
      auditMarkers: Object.freeze(["route-exists", "planet-class", "manor-orbit", "backlinks"]),
      batch: "BATCH_3_PLANETS",
      nextDiagnosticDependency: "Confirm Prelude routes back to Door or Compass and does not float."
    }),
    Object.freeze({
      id: "explore",
      title: "Explore",
      class: "planet",
      planetSlot: "P2_EXPLORE",
      canonicalRoute: "/explore/",
      aliases: Object.freeze([]),
      quadrant: "Q2_NORTHEAST",
      latticeRegion: "Traversal band between Compass and Frontier",
      visualIdentity: "Discovery surface, outward movement, signal path.",
      publicPurpose: "Lets the visitor move outward without losing orientation.",
      backlinkObligations: PLANET_BACKLINKS,
      auditMarkers: Object.freeze(["route-exists", "planet-class", "manor-orbit", "backlinks"]),
      batch: "BATCH_3_PLANETS",
      nextDiagnosticDependency: "Confirm Explore keeps orientation visible while widening the field."
    }),
    Object.freeze({
      id: "frontier",
      title: "Frontier",
      class: "planet",
      planetSlot: "P3_FRONTIER",
      canonicalRoute: "/frontier/",
      aliases: Object.freeze([]),
      quadrant: "Q2_NORTHEAST",
      latticeRegion: "Outer expansion band",
      visualIdentity: "Expansion edge, future-facing pressure, unknown-field atmosphere.",
      publicPurpose: "Carries edge-of-known research, future-facing systems, and frontier energy.",
      backlinkObligations: PLANET_BACKLINKS,
      auditMarkers: Object.freeze(["route-exists", "planet-class", "manor-orbit", "backlinks"]),
      batch: "BATCH_3_PLANETS",
      nextDiagnosticDependency: "Confirm Frontier expands without breaking return paths."
    }),
    Object.freeze({
      id: "laws",
      title: "Laws",
      class: "planet",
      planetSlot: "P4_LAWS",
      canonicalRoute: "/laws/",
      aliases: Object.freeze([]),
      quadrant: "Q1_NORTHWEST",
      latticeRegion: "North boundary layer",
      visualIdentity: "Doctrine, boundary, bright law line, non-negotiable structure.",
      publicPurpose: "States law, limits, and non-negotiable rules.",
      backlinkObligations: PLANET_BACKLINKS,
      auditMarkers: Object.freeze(["route-exists", "planet-class", "law-boundary", "backlinks"]),
      batch: "BATCH_3_PLANETS",
      nextDiagnosticDependency: "Confirm Laws informs Governance without becoming the institutional execution page."
    }),
    Object.freeze({
      id: "governance",
      title: "Governance",
      class: "planet",
      planetSlot: "P5_GOVERNANCE",
      canonicalRoute: "/governance/",
      aliases: Object.freeze([]),
      quadrant: "Q1_NORTHWEST",
      latticeRegion: "Law-to-execution bridge",
      visualIdentity: "Institutional execution, policy bridge, compliance pressure.",
      publicPurpose: "Turns law into policy, compliance, decision systems, public accountability, and enforcement shape.",
      backlinkObligations: PLANET_BACKLINKS,
      auditMarkers: Object.freeze(["route-exists", "planet-class", "governance-bridge", "backlinks"]),
      batch: "BATCH_3_PLANETS",
      nextDiagnosticDependency: "Confirm Governance routes back to Laws and Compass."
    }),
    Object.freeze({
      id: "upper-room",
      title: "Upper Room",
      class: "planet",
      planetSlot: "P6_UPPER_ROOM",
      canonicalRoute: "/upper-room/",
      aliases: Object.freeze(["/big-laugh/upper-room/"]),
      quadrant: "Q4_SOUTHWEST",
      latticeRegion: "Event and public gathering band",
      visualIdentity: "Upper-floor event chamber, live room, comedy, raffles, human gathering.",
      publicPurpose: "Public events, comedy, raffles, interaction, and human gathering.",
      backlinkObligations: PLANET_BACKLINKS,
      auditMarkers: Object.freeze(["route-exists", "planet-class", "event-room", "backlinks"]),
      batch: "BATCH_3_PLANETS",
      nextDiagnosticDependency: "Confirm Upper Room keeps the live event surface connected to the Manor."
    }),
    Object.freeze({
      id: "about-this-underdog",
      title: "About This Underdog",
      class: "planet",
      planetSlot: "P7_ABOUT_THIS_UNDERDOG",
      canonicalRoute: "/about-this-underdog/",
      aliases: Object.freeze(["/about/"]),
      quadrant: "Q4_SOUTHWEST",
      latticeRegion: "Origin-story human witness band",
      visualIdentity: "Human origin frame, grounded witness, no ego-center collapse.",
      publicPurpose: "Explains the underdog frame without making the whole site ego-centered.",
      backlinkObligations: PLANET_BACKLINKS,
      auditMarkers: Object.freeze(["route-exists", "planet-class", "origin-story", "backlinks"]),
      batch: "BATCH_3_PLANETS",
      nextDiagnosticDependency: "Confirm About remains a witness band, not the whole estate center."
    }),
    Object.freeze({
      id: "nine-summits-universe",
      title: "Nine Summits Universe",
      class: "planet",
      planetSlot: "P8_NINE_SUMMITS_UNIVERSE",
      canonicalRoute: "/nine-summits/",
      aliases: Object.freeze(["/nine-summits-universe/"]),
      quadrant: "Q2_NORTHEAST",
      latticeRegion: "Macro-orbit field",
      visualIdentity: "Metaverse-scale orbit, summit system, macro traversal field.",
      publicPurpose: "Metaverse-scale traversal of the larger summit system.",
      backlinkObligations: PLANET_BACKLINKS,
      auditMarkers: Object.freeze(["route-exists", "planet-class", "macro-orbit", "backlinks"]),
      batch: "BATCH_3_PLANETS",
      nextDiagnosticDependency: "Confirm Nine Summits Universe remains macro-world construct, not house skeleton."
    }),
    Object.freeze({
      id: "nine-summits-of-love",
      title: "Nine Summits of Love",
      class: "planet",
      planetSlot: "P9_NINE_SUMMITS_OF_LOVE",
      canonicalRoute: "/nine-summits-of-love/",
      aliases: Object.freeze([]),
      quadrant: "Q4_SOUTHWEST",
      latticeRegion: "Highest human-potential summit field",
      visualIdentity: "256 diamonds / carats of human potential, summit-scale transformation.",
      publicPurpose: "256 carats of human potential; summit-scale expression of transformation.",
      backlinkObligations: PLANET_BACKLINKS,
      auditMarkers: Object.freeze(["route-exists", "planet-class", "human-potential", "backlinks"]),
      batch: "BATCH_3_PLANETS",
      nextDiagnosticDependency: "Confirm the page extends Nine Summits without detaching from the Manor."
    })
  ]);

  function normalizeRoute(route) {
    if (!route || typeof route !== "string") return "/";
    let clean = route.trim();

    try {
      const parsed = new URL(clean, global.location ? global.location.origin : "https://diamondgatebridge.com");
      clean = parsed.pathname;
    } catch (error) {
      clean = clean.split("?")[0].split("#")[0];
    }

    if (!clean.startsWith("/")) clean = "/" + clean;
    if (clean !== "/" && clean.endsWith("/index.html")) {
      clean = clean.slice(0, -"index.html".length);
    }
    if (clean !== "/" && !clean.endsWith("/")) clean += "/";
    return clean;
  }

  function createRouteMap(pages) {
    const map = Object.create(null);

    pages.forEach(function registerPage(page) {
      map[normalizeRoute(page.canonicalRoute)] = page;

      page.aliases.forEach(function registerAlias(alias) {
        map[normalizeRoute(alias)] = page;
      });
    });

    return Object.freeze(map);
  }

  const ROUTE_MAP = createRouteMap(PAGES);

  function getById(id) {
    return PAGES.find(function findPage(page) {
      return page.id === id;
    }) || null;
  }

  function getByRoute(route) {
    return ROUTE_MAP[normalizeRoute(route)] || null;
  }

  function listByClass(pageClass) {
    return PAGES.filter(function filterByClass(page) {
      return page.class === pageClass;
    });
  }

  function listByBatch(batchName) {
    return PAGES.filter(function filterByBatch(page) {
      return page.batch === batchName;
    });
  }

  function getCurrentPage() {
    const path = global.location && global.location.pathname ? global.location.pathname : "/";
    return getByRoute(path);
  }

  function createPageDataset(pageOrId) {
    const page = typeof pageOrId === "string" ? getById(pageOrId) : pageOrId;
    if (!page) return null;

    return Object.freeze({
      manorSkin: "v1",
      manorRegistryVersion: VERSION,
      manorRoom: page.id,
      manorClass: page.class,
      manorSlot: page.houseSlot || page.planetSlot || "",
      manorRoute: page.canonicalRoute,
      manorQuadrant: page.quadrant,
      manorBatch: page.batch
    });
  }

  function requiredBacklinksFor(pageOrId) {
    const page = typeof pageOrId === "string" ? getById(pageOrId) : pageOrId;
    if (!page) return Object.freeze([]);
    return page.backlinkObligations;
  }

  function validatePageElement(rootElement, pageOrId) {
    const page = typeof pageOrId === "string" ? getById(pageOrId) : pageOrId;
    const root = rootElement || (global.document && global.document.body);

    if (!page || !root) {
      return Object.freeze({
        pass: false,
        errors: Object.freeze(["missing-page-or-root"]),
        warnings: Object.freeze([])
      });
    }

    const errors = [];
    const warnings = [];

    const roomValue = root.getAttribute("data-manor-room");
    const classValue = root.getAttribute("data-manor-class");
    const skinValue = root.getAttribute("data-manor-skin");

    if (roomValue && roomValue !== page.id) errors.push("wrong-manor-room");
    if (classValue && classValue !== page.class) errors.push("wrong-manor-class");
    if (skinValue && skinValue !== "v1") warnings.push("unexpected-manor-skin-version");
    if (!roomValue) warnings.push("missing-data-manor-room");
    if (!classValue) warnings.push("missing-data-manor-class");
    if (!skinValue) warnings.push("missing-data-manor-skin");

    return Object.freeze({
      pass: errors.length === 0,
      errors: Object.freeze(errors),
      warnings: Object.freeze(warnings)
    });
  }

  function auditDocument() {
    if (!global.document) {
      return Object.freeze({
        pass: false,
        errors: Object.freeze(["document-unavailable"]),
        warnings: Object.freeze([])
      });
    }

    const page = getCurrentPage();

    if (!page) {
      return Object.freeze({
        pass: false,
        errors: Object.freeze(["route-not-in-registry"]),
        warnings: Object.freeze([])
      });
    }

    return validatePageElement(global.document.body, page);
  }

  function applyDatasetToBody(pageOrId) {
    if (!global.document || !global.document.body) return null;

    const dataset = createPageDataset(pageOrId || getCurrentPage());
    if (!dataset) return null;

    Object.keys(dataset).forEach(function applyDatasetKey(key) {
      global.document.body.dataset[key] = dataset[key];
    });

    global.document.body.classList.add("manor-skin");

    if (dataset.manorClass === "house") {
      global.document.body.classList.add("manor-house");
      global.document.body.classList.remove("manor-planet");
    }

    if (dataset.manorClass === "planet") {
      global.document.body.classList.add("manor-planet");
      global.document.body.classList.remove("manor-house");
    }

    return dataset;
  }

  const registry = Object.freeze({
    version: VERSION,
    skinVersion: SKIN_VERSION,
    geometry: GEOMETRY,
    quadrants: QUADRANTS,
    counts: Object.freeze({
      centerExpressionRooms: 15,
      houseParts: 6,
      planetaryConstructs: 9,
      latticeCells: 256
    }),
    rules: Object.freeze({
      primary: "House first. Planets second.",
      noDetachedPlanet: "No planet floats without a house anchor.",
      noHousePlanetCollapse: "No house part becomes a detached planet unless explicitly reassigned.",
      routeLaw: "Many jump-off points, one destination.",
      gaugesLaw: "Gauges must remain live-calculated, not static."
    }),
    pages: PAGES,
    productDestinations: PRODUCT_DESTINATIONS,
    routeMap: ROUTE_MAP,
    normalizeRoute: normalizeRoute,
    getById: getById,
    getByRoute: getByRoute,
    listByClass: listByClass,
    listByBatch: listByBatch,
    listHouseParts: function listHouseParts() {
      return listByClass("house");
    },
    listPlanetaryConstructs: function listPlanetaryConstructs() {
      return listByClass("planet");
    },
    getCurrentPage: getCurrentPage,
    createPageDataset: createPageDataset,
    requiredBacklinksFor: requiredBacklinksFor,
    validatePageElement: validatePageElement,
    auditDocument: auditDocument,
    applyDatasetToBody: applyDatasetToBody
  });

  global.ManorPageRegistry = registry;

  if (global.document) {
    global.document.documentElement.setAttribute("data-manor-registry", VERSION);

    const event = new CustomEvent("manor:registry-ready", {
      detail: registry
    });

    global.document.dispatchEvent(event);
  }
})(typeof window !== "undefined" ? window : globalThis);

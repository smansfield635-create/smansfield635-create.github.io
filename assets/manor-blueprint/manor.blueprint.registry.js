// TARGET FILE: /assets/manor-blueprint/manor.blueprint.registry.js
// TNT FULL-FILE REPLACEMENT
// MIRRORLAND_BLUEPRINT_ESTATE_ROOM_LANGUAGE_REGISTRY_RUNTIME_CSS_TNT_v1
//
// Registry portion.
// Purpose:
// - Preserve Main Menu / Website Options versus Mirrorland Doors ownership.
// - Add visitor-facing estate-room language.
// - Keep route/file language as hidden builder metadata only.
// - Correct ZIONTS public identity while preserving /showroom/globe/earth/ route.
// - Bind Gauges public identity as The Lab.
// - Bind Frontier public identity as Frontier Workshop Yard.
//
// Previous contract:
// MANOR_BLUEPRINT_MENU_CATEGORY_OWNERSHIP_REGISTRY_TNT_v1

(() => {
  "use strict";

  if (typeof window === "undefined") return;

  const CONTRACT = "MIRRORLAND_BLUEPRINT_ESTATE_ROOM_LANGUAGE_REGISTRY_RUNTIME_CSS_TNT_v1";
  const PREVIOUS_CONTRACT = "MANOR_BLUEPRINT_MENU_CATEGORY_OWNERSHIP_REGISTRY_TNT_v1";
  const REGISTRY_ID = "DGB_MANOR_BLUEPRINT_ESTATE_ROOM_ROUTE_REGISTRY";
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
    const mirrorlandDoor = Boolean(config.mirrorlandDoor);
    const mirrorlandAligned = Boolean(config.mirrorlandAligned);
    const websiteOption = Boolean(config.websiteOption);

    const publicLabel = String(config.publicLabel || config.title || "Room");
    const publicShortLabel = String(config.publicShortLabel || config.shortTitle || publicLabel);
    const estateRoom = String(config.estateRoom || publicLabel);
    const estateSection = String(config.estateSection || (mirrorlandDoor ? "Mirrorland Estate" : "Main House"));
    const publicSummary = String(config.publicSummary || config.description || "Enter this room.");
    const enterLabel = String(config.enterLabel || "Enter");

    return freeze({
      routeId: String(config.routeId || config.id || "route"),
      id: String(config.id || config.routeId || "route"),
      key: String(config.key || config.id || config.routeId || "route"),
      path,

      title: String(config.title || publicLabel),
      shortTitle: String(config.shortTitle || publicShortLabel),
      group: String(config.group || (mirrorlandDoor ? "Mirrorland Doors" : "Main Menu / Website Options")),
      menu: String(config.menu || (mirrorlandDoor ? "mirrorland" : "main")),
      wing: String(config.wing || estateSection),
      type: String(config.type || "route"),
      cardinal: String(config.cardinal || "center"),
      role: String(config.role || config.type || "room"),

      publicLabel,
      publicShortLabel,
      estateRoom,
      estateSection,
      publicSummary,
      enterLabel,
      builderPathNote: String(config.builderPathNote || ""),
      publicLanguageVersion: "estate-room-v1",

      parent: config.parent ? normalizePath(config.parent) : "",
      children: unique((config.children || []).map(normalizePath)),
      nearby: unique((config.nearby || []).map(normalizePath)),
      description: String(config.description || publicSummary),
      body: String(config.body || publicSummary),
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
      publicLabel: "Compass",
      publicShortLabel: "Compass",
      estateRoom: "The Compass Desk",
      estateSection: "Main House",
      publicSummary: "Start here when you need ordinary site orientation before entering deeper rooms.",
      enterLabel: "Orient",
      group: "Main Menu / Website Options",
      menu: "main",
      wing: "Main House",
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
      publicLabel: "The Front Door",
      publicShortLabel: "Front Door",
      estateRoom: "The Front Door",
      estateSection: "Main House",
      publicSummary: "The ordinary entrance threshold before the estate opens further.",
      enterLabel: "Cross",
      group: "Main Menu / Website Options",
      menu: "main",
      wing: "Main House",
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
      publicLabel: "The Hearth",
      publicShortLabel: "Hearth",
      estateRoom: "The Hearth",
      estateSection: "Main House",
      publicSummary: "The stable return room for the main estate experience.",
      enterLabel: "Return",
      group: "Main Menu / Website Options",
      menu: "main",
      wing: "Main House",
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
      publicLabel: "The Guide Desk",
      publicShortLabel: "Guide Desk",
      estateRoom: "The Guide Desk",
      estateSection: "Main House",
      publicSummary: "A practical desk for learning how the estate, rooms, lenses, and returns work.",
      enterLabel: "Read",
      group: "Main Menu / Website Options",
      menu: "main",
      wing: "Main House",
      type: "instruction-page",
      role: "guide-room",
      cardinal: "north",
      parent: "/",
      nearby: ["/", "/gauges/", "/laws/"],
      description: "Full navigation guide for the regular website, route language, gems, chambers, lenses, and Gauges.",
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
      publicLabel: "Meet Sean",
      publicShortLabel: "Meet Sean",
      estateRoom: "The Host Portrait",
      estateSection: "Main House",
      publicSummary: "The public room for the human origin, mission, and voice behind the estate.",
      enterLabel: "Meet",
      group: "Main Menu / Website Options",
      menu: "main",
      wing: "Main House",
      type: "identity-page",
      role: "public-facing-room",
      cardinal: "west",
      parent: "/",
      nearby: ["/", "/home/", "/products/"],
      description: "Public-facing identity and mission route. Regular website route.",
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
      publicLabel: "The Product Gallery",
      publicShortLabel: "Product Gallery",
      estateRoom: "The Product Gallery",
      estateSection: "Main House",
      publicSummary: "A gallery of usable objects, offers, and public-facing extensions.",
      enterLabel: "View",
      group: "Main Menu / Website Options",
      menu: "main",
      wing: "Main House",
      type: "product-hub",
      role: "product-room",
      cardinal: "west",
      parent: "/",
      nearby: ["/", "/home/", "/gauges/"],
      description: "Product chamber and offering route. Regular website route.",
      keywords: ["products", "offers", "store", "website options", "gallery"],
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
      publicLabel: "The Law Library",
      publicShortLabel: "Law Library",
      estateRoom: "The Law Library",
      estateSection: "Main House",
      publicSummary: "The room where rules, boundaries, proof, and governing constraints are kept.",
      enterLabel: "Study",
      group: "Main Menu / Website Options",
      menu: "main",
      wing: "Main House",
      type: "law-hub",
      role: "law-room",
      cardinal: "south",
      parent: "/",
      nearby: ["/", "/governance/", "/gauges/"],
      description: "Law and rule structure route. It may support Mirrorland, but support does not equal ownership.",
      keywords: ["laws", "rules", "categories", "engineering", "truth layer", "library"],
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
      publicLabel: "The Council Room",
      publicShortLabel: "Council Room",
      estateRoom: "The Council Room",
      estateSection: "Main House",
      publicSummary: "The decision room for policy, compliance, public risk, and responsibility.",
      enterLabel: "Convene",
      group: "Main Menu / Website Options",
      menu: "main",
      wing: "Main House",
      type: "governance-hub",
      role: "governance-room",
      cardinal: "south",
      parent: "/",
      nearby: ["/laws/", "/gauges/", "/"],
      description: "Governance route for policy, compliance, public risk, and decisions. Regular website route.",
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
      publicLabel: "The Lab",
      publicShortLabel: "Lab",
      estateRoom: "The Lab",
      estateSection: "Main House",
      publicSummary: "The measurement room where route truth, readiness, and audit signals are checked.",
      enterLabel: "Test",
      group: "Main Menu / Website Options",
      menu: "main",
      wing: "Main House",
      type: "audit-hub",
      role: "measurement-room",
      cardinal: "south",
      parent: "/",
      children: ["/gauges/h-earth/"],
      nearby: ["/", "/laws/"],
      description: "Audit and proof surface for route status and readiness signals. Regular website route; support does not equal Mirrorland ownership.",
      keywords: ["gauges", "triple g", "audit", "proof", "status", "lab"],
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
      publicLabel: "H-Earth Lab Bench",
      publicShortLabel: "H-Earth Bench",
      estateRoom: "The Lab",
      estateSection: "Main House",
      publicSummary: "A dedicated test bench for H-Earth route readiness and served-page truth.",
      enterLabel: "Inspect",
      group: "Main Menu / Website Options",
      menu: "main",
      wing: "Main House",
      type: "audit-route",
      role: "measurement-room",
      cardinal: "south",
      parent: "/gauges/",
      nearby: ["/gauges/", "/showroom/globe/h-earth/"],
      description: "H-Earth audit and readiness route. Regular website route unless explicitly converted later.",
      keywords: ["gauges", "h-earth", "audit", "readiness", "lab"],
      mapX: 56,
      mapY: 82,
      priority: 74,
      websiteOption: true
    }),

    route({
      routeId: "showroom-door",
      path: "/showroom/",
      title: "Door / Showroom",
      shortTitle: "Showroom",
      publicLabel: "The Atrium",
      publicShortLabel: "Atrium",
      estateRoom: "The Atrium",
      estateSection: "Mirrorland Estate",
      publicSummary: "The first interior arrival room: display floor, orientation space, and Mirrorland entry presence.",
      enterLabel: "Enter",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      wing: "Mirrorland Estate",
      type: "showroom-hub",
      role: "door-context",
      cardinal: "center",
      parent: "",
      children: ["/showroom/globe/"],
      nearby: ["/showroom/globe/", "/showroom/globe/audralia/"],
      description: "The Door context and Diamond Lattice object page. Mirrorland category: Showroom.",
      keywords: ["showroom", "atrium", "door", "diamond lattice", "mirrorland", "entryway"],
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
      publicLabel: "The Atlas Study",
      publicShortLabel: "Atlas Study",
      estateRoom: "The Atlas Study",
      estateSection: "Mirrorland Estate",
      publicSummary: "The study of worlds: globes, maps, planetary doors, and living-world entries.",
      enterLabel: "Open",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      wing: "Mirrorland Estate",
      type: "globe-hub",
      role: "planetary-field-door",
      cardinal: "east",
      parent: "/showroom/",
      children: [
        "/showroom/globe/earth/",
        "/showroom/globe/audralia/",
        "/showroom/globe/hearth/",
        "/showroom/globe/h-earth/"
      ],
      nearby: ["/showroom/", "/showroom/globe/audralia/"],
      description: "The Mirrorland field door inside the map. Mirrorland category: planetary field.",
      keywords: ["atlas", "study", "globe", "planet", "showcase", "gateway", "mirrorland doors"],
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
      publicLabel: "ZIONTS",
      publicShortLabel: "ZIONTS",
      estateRoom: "The ZIONTS Room",
      estateSection: "The Atlas Study",
      publicSummary: "ZIONTS, pronounced Zience, is the first world-door in the Atlas Study.",
      enterLabel: "Enter",
      builderPathNote: "Served under /showroom/globe/earth/ while public context resolves as ZIONTS / Zience.",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      wing: "Mirrorland Estate",
      type: "planet-reference",
      role: "planetary-reference-room",
      cardinal: "east",
      parent: "/showroom/globe/",
      nearby: ["/showroom/globe/", "/showroom/globe/audralia/", "/showroom/globe/hearth/"],
      description: "Reference body route served under Earth path; public identity resolves as ZIONTS.",
      keywords: ["zionts", "zience", "earth", "reference", "blue marble", "planet"],
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
      publicLabel: "Audralia Conservatory",
      publicShortLabel: "Audralia",
      estateRoom: "Audralia Conservatory",
      estateSection: "The Atlas Study",
      publicSummary: "A living-world room where Audralia opens as a constructive future under formation.",
      enterLabel: "Enter",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      wing: "Mirrorland Estate",
      type: "planet-hub",
      role: "planetary-door",
      cardinal: "east",
      parent: "/showroom/globe/",
      children: ["/showroom/globe/audralia/planet/", "/showroom/globe/audralia/disposition/"],
      nearby: ["/showroom/globe/", "/showroom/globe/audralia/planet/", "/showroom/globe/audralia/disposition/"],
      description: "Audralia planet hub and first living planetary door inside Mirrorland.",
      keywords: ["audralia", "conservatory", "mirrorland", "planet", "world", "planetary path"],
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
      publicLabel: "Audralia Worldroom",
      publicShortLabel: "Worldroom",
      estateRoom: "Audralia Worldroom",
      estateSection: "Audralia Conservatory",
      publicSummary: "The room for inspecting Audralia’s future body, surface direction, and world-formation path.",
      enterLabel: "Inspect",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      wing: "Mirrorland Estate",
      type: "planet-screen",
      role: "planet-room",
      cardinal: "east",
      parent: "/showroom/globe/audralia/",
      nearby: ["/showroom/globe/audralia/", "/showroom/globe/audralia/disposition/", "/showroom/globe/"],
      description: "Audralia future-body screen and planet inspection room.",
      keywords: ["audralia", "worldroom", "planet", "future body", "renderplex", "mirrorland"],
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
      publicLabel: "The Control Room",
      publicShortLabel: "Control Room",
      estateRoom: "The Control Room",
      estateSection: "Audralia Conservatory",
      publicSummary: "The instrument room for reading Audralia’s disposition, controls, and operating signals.",
      enterLabel: "Operate",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      wing: "Mirrorland Estate",
      type: "cockpit",
      role: "cockpit-room",
      cardinal: "east",
      parent: "/showroom/globe/audralia/",
      nearby: ["/showroom/globe/audralia/", "/showroom/globe/audralia/planet/", "/showroom/globe/"],
      description: "Audralia cockpit route for lattice and disposition inspection. Mirrorland category: cockpit.",
      keywords: ["audralia", "control room", "cockpit", "lattice", "disposition"],
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
      publicLabel: "Hearth Room",
      publicShortLabel: "Hearth",
      estateRoom: "Hearth Room",
      estateSection: "The Atlas Study",
      publicSummary: "A world-room for Hearth’s planet path and terrain development.",
      enterLabel: "Enter",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      wing: "Mirrorland Estate",
      type: "planet-route",
      role: "planetary-room",
      cardinal: "east",
      parent: "/showroom/globe/",
      nearby: ["/showroom/globe/", "/showroom/globe/audralia/", "/showroom/globe/h-earth/"],
      description: "Hearth planet room inside the planetary inspection shelf.",
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
      publicLabel: "H-Earth Room",
      publicShortLabel: "H-Earth",
      estateRoom: "H-Earth Room",
      estateSection: "The Atlas Study",
      publicSummary: "A hybrid-world study room for surface, terrain, and parent-chain experiments.",
      enterLabel: "Enter",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      wing: "Mirrorland Estate",
      type: "planet-route",
      role: "planetary-room",
      cardinal: "east",
      parent: "/showroom/globe/",
      nearby: ["/showroom/globe/", "/showroom/globe/hearth/", "/gauges/h-earth/"],
      description: "H-Earth experimental world path inside the planetary route class.",
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
      publicLabel: "The Portrait Hall",
      publicShortLabel: "Portrait Hall",
      estateRoom: "The Portrait Hall",
      estateSection: "Mirrorland Estate",
      publicSummary: "The hall where the living characters and story faces of Mirrorland are introduced.",
      enterLabel: "Meet",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      wing: "Mirrorland Estate",
      type: "narrative-hub",
      role: "narrative-room",
      cardinal: "east",
      parent: "/showroom/",
      nearby: ["/showroom/", "/nine-summits/universe/", "/showroom/globe/audralia/"],
      description: "Character and narrative room inside the Mirrorland story layer.",
      keywords: ["characters", "portrait hall", "story", "narrative", "mirrorland"],
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
      publicLabel: "The Universe Gallery",
      publicShortLabel: "Universe Gallery",
      estateRoom: "The Universe Gallery",
      estateSection: "Mirrorland Estate",
      publicSummary: "A story-world gallery for Nine Summits, outer context, and the larger universe setting.",
      enterLabel: "Open",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      wing: "Mirrorland Estate",
      type: "universe-route",
      role: "narrative-room",
      cardinal: "east",
      parent: "/showroom/",
      nearby: ["/characters/", "/showroom/globe/audralia/", "/showroom/globe/"],
      description: "Universe room for Nine Summits and Mirrorland story context.",
      keywords: ["nine summits", "universe", "gallery", "mirrorland", "story"],
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
      publicLabel: "Frontier Workshop Yard",
      publicShortLabel: "Workshop Yard",
      estateRoom: "Frontier Workshop Yard",
      estateSection: "Mirrorland Grounds",
      publicSummary: "The outdoor testing yard where Audralia’s future systems are tried before they become living-world infrastructure.",
      enterLabel: "Test",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      wing: "Mirrorland Estate",
      type: "frontier-hub",
      role: "west-deployment-door",
      cardinal: "west",
      parent: "/showroom/",
      children: [
        "/explore/frontier/water/",
        "/explore/frontier/waste/",
        "/explore/frontier/energy/",
        "/explore/frontier/closed-loop/",
        "/explore/frontier/infrastructure/",
        "/explore/frontier/lattice/",
        "/explore/frontier/manual/",
        "/explore/frontier/shimmer/",
        "/explore/frontier/trajectory/",
        "/explore/frontier/urban/",
        "/explore/frontier/vision/"
      ],
      nearby: ["/explore/frontier/water/", "/explore/frontier/waste/", "/explore/frontier/energy/"],
      description: "Frontier belongs to Mirrorland and sits in the West deployment wing.",
      keywords: ["frontier", "workshop yard", "mirrorland", "water", "waste", "energy", "closed loop", "west"],
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
      publicLabel: "Closed Water Systems",
      publicShortLabel: "Water Systems",
      estateRoom: "Water Bench",
      estateSection: "Frontier Workshop Yard",
      publicSummary: "A workbench for capture, cleaning, routing, reuse, and water continuity.",
      enterLabel: "Open",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      wing: "Mirrorland Estate",
      type: "frontier-route",
      role: "frontier-room",
      cardinal: "west",
      parent: "/explore/frontier/",
      nearby: ["/explore/frontier/", "/explore/frontier/waste/", "/explore/frontier/energy/"],
      description: "Water frontier room inside the West deployment wing.",
      keywords: ["water", "closed water systems", "frontier", "closed loop", "lattice"],
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
      publicLabel: "Wastewater Systems",
      publicShortLabel: "Wastewater",
      estateRoom: "Wastewater Bench",
      estateSection: "Frontier Workshop Yard",
      publicSummary: "A workbench for sanitation, recovery, reuse, and return-material logic.",
      enterLabel: "Open",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      wing: "Mirrorland Estate",
      type: "frontier-route",
      role: "frontier-room",
      cardinal: "west",
      parent: "/explore/frontier/",
      nearby: ["/explore/frontier/", "/explore/frontier/water/", "/explore/frontier/energy/"],
      description: "Waste frontier room inside the West deployment wing.",
      keywords: ["waste", "wastewater systems", "frontier", "closed loop", "capture", "destruction"],
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
      publicLabel: "Fusion Systems",
      publicShortLabel: "Fusion",
      estateRoom: "Fusion Bench",
      estateSection: "Frontier Workshop Yard",
      publicSummary: "A workbench for power readiness, storage, load, and future clean-energy pathways.",
      enterLabel: "Open",
      group: "Mirrorland Doors",
      menu: "mirrorland",
      wing: "Mirrorland Estate",
      type: "frontier-route",
      role: "frontier-room",
      cardinal: "west",
      parent: "/explore/frontier/",
      nearby: ["/explore/frontier/", "/explore/frontier/water/", "/explore/frontier/waste/"],
      description: "Energy frontier room inside the West deployment wing.",
      keywords: ["energy", "fusion systems", "frontier", "power", "infrastructure"],
      mapX: 34,
      mapY: 78,
      priority: 70,
      mirrorlandAligned: true,
      mirrorlandDoor: true
    })
  ]);

  const INSTRUCTIONS = freeze([
    {
      termId: "estate-language",
      title: "Estate Room Language",
      shortTitle: "Estate Rooms",
      body: "The public map uses room names and real-world estate context. Route paths and file names stay in builder receipts.",
      description: "Public map uses estate-room language.",
      keywords: ["estate", "rooms", "visitor"]
    },
    {
      termId: "path-not-identity",
      title: "Path Is Not Identity",
      shortTitle: "Path",
      body: "A route address is only where a page is served. It is not automatically the room’s public identity.",
      description: "Route path is not public identity.",
      keywords: ["path", "identity", "route"]
    },
    {
      termId: "zionts-zience",
      title: "ZIONTS",
      shortTitle: "ZIONTS",
      body: "ZIONTS is pronounced Zience. It may be served through the Earth route, but the map presents the public world-door identity.",
      description: "ZIONTS is pronounced Zience.",
      keywords: ["zionts", "zience", "earth"]
    },
    {
      termId: "main-menu-website-options",
      title: "Main Menu / Website Options",
      shortTitle: "Main Menu",
      body: "Main Menu contains regular website routes only: Compass, Door, Home, Product Gallery, Law Library, Council Room, Lab, Meet Sean, and Guide Desk.",
      description: "Main Menu contains regular website routes only.",
      keywords: ["main menu", "website options", "regular website"]
    },
    {
      termId: "mirrorland-doors",
      title: "Mirrorland Doors",
      shortTitle: "Doors",
      body: "Mirrorland Doors contains the Atrium, Atlas Study, world rooms, Control Room, Frontier Workshop Yard, and story rooms.",
      description: "Mirrorland Doors contains Mirrorland-specific rooms.",
      keywords: ["doors", "mirrorland", "routes", "rooms"]
    },
    {
      termId: "support-does-not-equal-ownership",
      title: "Support Does Not Equal Ownership",
      shortTitle: "Support",
      body: "The Lab, Law Library, and proof routes may support Mirrorland, but they remain regular website rooms unless explicitly reclassified.",
      description: "Support does not equal Mirrorland ownership.",
      keywords: ["support", "ownership", "lab", "laws"]
    },
    {
      termId: "single-entryway",
      title: "Single Entryway",
      shortTitle: "Entryway",
      body: "The floating Map / Portal blip is the single public entryway into the estate map.",
      description: "The floating Map / Portal blip is the single public entryway into the estate map.",
      keywords: ["entryway", "map", "portal", "mirrorland"]
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
    "Main Menu / Website Options",
    "Mirrorland Doors"
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
        .sort((a, b) => b.priority - a.priority || a.publicLabel.localeCompare(b.publicLabel))
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
        .sort((a, b) => b.priority - a.priority || a.publicLabel.localeCompare(b.publicLabel))
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
      groups[key] = groups[key].sort((a, b) => b.priority - a.priority || a.publicLabel.localeCompare(b.publicLabel));
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
            item.publicLabel,
            item.publicShortLabel,
            item.estateRoom,
            item.estateSection,
            item.publicSummary,
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
        .sort((a, b) => b.priority - a.priority || a.publicLabel.localeCompare(b.publicLabel))
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
      currentPublicLabel: current ? current.publicLabel : "",
      currentEstateRoom: current ? current.estateRoom : "",

      estateRoomLanguageActive: true,
      publicLabelsBound: true,
      routePathHiddenFromPublicCards: true,
      builderMetadataHidden: true,
      ziontsPublicIdentityBound: true,
      ziontsPronunciation: "Zience",
      ziontsServedAtEarthRoute: true,
      labPublicLabelBound: true,
      frontierWorkshopYardBound: true,

      mapBlipSingleEntryway: true,
      mirrorlandEntryway: "map_portal_blip",
      mainMenuRegularWebsiteOnly: true,
      mirrorlandMenuSpecificRoutesOnly: true,
      supportDoesNotEqualOwnership: true,

      gaugesMovedToMainMenu: true,
      lawsMainMenu: true,
      governanceMainMenu: true,
      productsMainMenu: true,
      compassMainMenu: true,
      doorMainMenu: true,
      homeMainMenu: true,
      meetSeanMainMenu: true,
      siteGuideMainMenu: true,

      showroomMirrorland: true,
      planetaryPagesMirrorland: true,
      cockpitPagesMirrorland: true,
      frontierPagesMirrorland: true,
      narrativePagesMirrorland: true,
      charactersMirrorland: true,
      nineSummitsMirrorland: true,

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

    estateRoomLanguageActive: true,
    publicLabelsBound: true,
    routePathHiddenFromPublicCards: true,
    builderMetadataHidden: true,
    ziontsPublicIdentityBound: true,
    ziontsPronunciation: "Zience",
    labPublicLabelBound: true,
    frontierWorkshopYardBound: true,

    mapBlipSingleEntryway: true,
    mirrorlandEntryway: "map_portal_blip",
    mainMenuRegularWebsiteOnly: true,
    mirrorlandMenuSpecificRoutesOnly: true,
    supportDoesNotEqualOwnership: true,
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

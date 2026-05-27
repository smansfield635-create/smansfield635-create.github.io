// TARGET FILE: /assets/manor-blueprint/manor.blueprint.js
// TNT FULL-FILE REPLACEMENT
// MANOR_BLUEPRINT_MIRRORLAND_DOORS_SINGLE_ENTRYWAY_RUNTIME_TNT_v1
//
// Purpose:
// Renew the Manor Blueprint Portal runtime so the floating Map / Portal blip
// is the single public entryway into Mirrorland, while the opened map presents
// Mirrorland routes as Mirrorland Doors.
//
// Previous runtime contract:
// MANOR_BLUEPRINT_CARDINAL_ROOM_MAP_RUNTIME_JS_TNT_v1
//
// Compatibility API contract preserved:
// MANOR_BLUEPRINT_FIXED_DRAGGABLE_BUBBLE_FULLSCREEN_MAP_INSTRUCTIONS_TOGGLE_JS_TNT_v1
//
// Owns:
// - Map / Portal blip
// - Mirrorland Doors / Main Menu / Instructions lenses
// - route-to-room classification
// - cardinal room grouping
// - clickable room rendering
// - current-room detection
// - Frontier as Mirrorland-aligned and West-disposed
// - full-viewport drag
// - strong-visible joystick scroll
// - status / receipt globals
//
// Does not own:
// - /showroom/index.html
// - /assets/manor-blueprint/manor.blueprint.css
// - /assets/manor-blueprint/manor.blueprint.registry.js
// - /assets/site.bootstrap.js
// - /showroom/index.diamond.js
// - /showroom/index.ui.js
// - Audralia runtime
// - planet route files
// - Gauges logic

(() => {
  "use strict";

  if (typeof window === "undefined" || typeof document === "undefined") return;

  const CONTRACT = "MANOR_BLUEPRINT_MIRRORLAND_DOORS_SINGLE_ENTRYWAY_RUNTIME_TNT_v1";
  const PREVIOUS_CONTRACT = "MANOR_BLUEPRINT_CARDINAL_ROOM_MAP_RUNTIME_JS_TNT_v1";
  const PRIOR_CONTRACT = "MANOR_BLUEPRINT_MIRRORLAND_PORTAL_FRONTIER_SCROLL_FORCE_JS_TNT_v1";
  const LEGACY_CONTRACT = "MANOR_BLUEPRINT_MOBILE_SAFE_BUBBLE_POSITION_RENEWAL_TNT_v1";
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
  const JOYSTICK_SCROLL_FORCE_INCREASE_PERCENT = 40;
  const JOYSTICK_SCROLL_FORCE_PROFILE = "strong-visible";
  const MOBILE_BREAKPOINT = 760;
  const CARDINAL_ORDER = Object.freeze(["north", "east", "center", "west", "south"]);

  const CARDINAL_LABELS = Object.freeze({
    north: { title: "North", meaning: "Interface · Engineering · Known System" },
    east: { title: "East", meaning: "Narrative · Game · Mirrorland Expression" },
    center: { title: "Center", meaning: "Foyer · Current Position · Portal Threshold" },
    west: { title: "West", meaning: "Community · Products · Frontier Deployment" },
    south: { title: "South", meaning: "Scientific Backing · Proof · Measurement" }
  });

  const MIRRORLAND_PRIMARY_PATHS = Object.freeze([
    "/showroom/",
    "/showroom/globe/",
    "/showroom/globe/audralia/",
    "/showroom/globe/audralia/planet/",
    "/showroom/globe/audralia/disposition/",
    "/showroom/globe/hearth/",
    "/showroom/globe/h-earth/",
    "/characters/",
    "/nine-summits/universe/",
    "/explore/frontier/",
    "/explore/frontier/water/",
    "/explore/frontier/waste/",
    "/explore/frontier/energy/"
  ]);

  const MIRRORLAND_SUPPORT_PATHS = Object.freeze([
    "/gauges/",
    "/laws/"
  ]);

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
    pointerClientX: 0,
    pointerClientY: 0,
    baseX: 0,
    baseY: 0,
    position: { x: 0, y: 0 },
    positionSource: "boot",
    positionWasClamped: false,
    localStorageRepaired: false,
    joystickActive: false,
    joystickDirection: "none",
    joystickSpeed: 0,
    lastAction: "boot",
    lastRoomSummary: null,
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

  function normalizePath(path) {
    const clean = String(path || "/").split("?")[0].split("#")[0] || "/";
    return clean === "/" ? "/" : clean.replace(/\/?$/, "/");
  }

  function slug(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "room";
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
      ? { left: 14, right: 14, top: 14, bottom: 14, mode: "mobile-full-viewport" }
      : { left: 16, right: 16, top: 16, bottom: 16, mode: "desktop-full-viewport" };
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
      if (!parsed || typeof parsed !== "object") return null;

      const x = Number(parsed.x);
      const y = Number(parsed.y);

      if (!Number.isFinite(x) || !Number.isFinite(y)) return null;

      return { x, y, contract: String(parsed.contract || "") };
    } catch (_error) {
      return null;
    }
  }

  function clearStoredPosition() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (_error) {}
  }

  function storedPositionAllowed(stored) {
    if (!stored) return false;

    const acceptedContract =
      stored.contract === CONTRACT ||
      stored.contract === PREVIOUS_CONTRACT ||
      stored.contract === PRIOR_CONTRACT ||
      stored.contract === LEGACY_CONTRACT;

    if (!acceptedContract) return false;

    const clamped = clampPosition(stored);
    return !clamped.clamped;
  }

  function savePosition(pos) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        x: Math.round(pos.x),
        y: Math.round(pos.y),
        contract: CONTRACT,
        previousContract: PREVIOUS_CONTRACT,
        priorContract: PRIOR_CONTRACT,
        legacyContract: LEGACY_CONTRACT,
        mapBlipSingleEntryway: true,
        mirrorlandEntryway: "map-portal-blip",
        mirrorlandDoorsInsideMap: true,
        mainMenuSeparated: true,
        compassSeparated: true,
        frontierMirrorlandAligned: true,
        frontierBelongsToMirrorland: true,
        frontierCardinalDisposition: "west",
        fullViewportDrag: true,
        joystickScrollActive: true,
        joystickScrollForceProfile: JOYSTICK_SCROLL_FORCE_PROFILE,
        joystickMinScrollSpeed: MIN_SCROLL_SPEED,
        joystickMaxScrollSpeed: MAX_SCROLL_SPEED,
        joystickScrollForceMultiplier: JOYSTICK_SCROLL_FORCE_MULTIPLIER,
        joystickScrollForceIncreasePercent: JOYSTICK_SCROLL_FORCE_INCREASE_PERCENT,
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

  function queryForcesReset() {
    try {
      const params = new URLSearchParams(window.location.search || "");
      return params.get("dgbBlueprintReset") === "1" || params.get("dgbBlueprintTop") === "1";
    } catch (_error) {
      return false;
    }
  }

  function initializePosition() {
    if (queryForcesReset()) {
      clearStoredPosition();
      state.localStorageRepaired = true;
      applyPosition(defaultPosition(), "reset-query", true);
      return;
    }

    const stored = readStoredPosition();

    if (storedPositionAllowed(stored)) {
      applyPosition(stored, "stored", false);
      return;
    }

    if (stored) {
      clearStoredPosition();
      state.localStorageRepaired = true;
    }

    applyPosition(defaultPosition(), "upper-right-safe-anchor", true);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function registry() {
    return window.DGB_MANOR_BLUEPRINT_REGISTRY ||
      window.DGB_MANOR_BLUEPRINT_ROUTE_REGISTRY ||
      null;
  }

  function pathStartsWith(path, prefix) {
    const cleanPath = normalizePath(path);
    const cleanPrefix = normalizePath(prefix);

    if (cleanPrefix === "/") return cleanPath === "/";
    return cleanPath === cleanPrefix || cleanPath.startsWith(cleanPrefix);
  }

  function isMirrorlandPrimaryPath(path) {
    const clean = normalizePath(path);

    return MIRRORLAND_PRIMARY_PATHS.some((prefix) => pathStartsWith(clean, prefix));
  }

  function isMirrorlandSupportPath(path) {
    const clean = normalizePath(path);
    return MIRRORLAND_SUPPORT_PATHS.some((prefix) => pathStartsWith(clean, prefix));
  }

  function mirrorlandEntered() {
    return isMirrorlandPrimaryPath(window.location.pathname || "/");
  }

  function mirrorlandSupportActive() {
    return isMirrorlandSupportPath(window.location.pathname || "/");
  }

  function frontierActive() {
    const path = window.location.pathname || "/";
    return pathStartsWith(path, "/explore/frontier/");
  }

  function classifyCardinalFromPathAndTitle(path, title, group) {
    const p = normalizePath(path);
    const t = String(title || "").toLowerCase();
    const g = String(group || "").toLowerCase();

    if (
      p === "/" ||
      p.startsWith("/door/") ||
      p.startsWith("/home/") ||
      p.startsWith("/site-guide/") ||
      t.includes("compass") ||
      t === "door" ||
      t === "home" ||
      t.includes("site guide") ||
      g.includes("main menu") ||
      g.includes("website options")
    ) {
      return "north";
    }

    if (
      p.startsWith("/explore/frontier/") ||
      p.startsWith("/products/") ||
      p.startsWith("/about-this-underdog/") ||
      t.includes("frontier") ||
      t.includes("products") ||
      t.includes("sean") ||
      g.includes("frontier") ||
      g.includes("products") ||
      g.includes("community")
    ) {
      return "west";
    }

    if (
      p.startsWith("/laws/") ||
      p.startsWith("/gauges/") ||
      p.startsWith("/governance/") ||
      t.includes("law") ||
      t.includes("gauge") ||
      t.includes("audit") ||
      t.includes("proof") ||
      t.includes("governance") ||
      g.includes("audit") ||
      g.includes("law") ||
      g.includes("proof")
    ) {
      return "south";
    }

    if (
      p.startsWith("/showroom/") ||
      p.startsWith("/characters/") ||
      p.startsWith("/nine-summits/") ||
      p.includes("/audralia/") ||
      p.includes("/h-earth/") ||
      t.includes("mirrorland") ||
      t.includes("showroom") ||
      t.includes("character") ||
      t.includes("audralia") ||
      t.includes("h-earth") ||
      t.includes("nine summits") ||
      g.includes("mirrorland")
    ) {
      return "east";
    }

    return "center";
  }

  function inferWing(path, title, group, cardinal) {
    const p = normalizePath(path);
    const t = String(title || "").toLowerCase();
    const g = String(group || "").toLowerCase();

    if (p.startsWith("/explore/frontier/") || t.includes("frontier") || g.includes("frontier")) return "Frontier Deployment";
    if (p.startsWith("/showroom/globe/audralia/") || t.includes("audralia")) return "Audralia World Wing";
    if (p.startsWith("/showroom/globe/h-earth/") || t.includes("h-earth")) return "H-Earth World Wing";
    if (p.startsWith("/showroom/globe/") || t.includes("mirrorland")) return "Mirrorland Field";
    if (p.startsWith("/characters/") || t.includes("character")) return "Character Wing";
    if (p.startsWith("/nine-summits/") || t.includes("nine summits")) return "Narrative Wing";
    if (p.startsWith("/laws/") || t.includes("law")) return "Law Wing";
    if (p.startsWith("/gauges/") || t.includes("gauge") || t.includes("audit")) return "Audit Wing";
    if (p.startsWith("/products/") || t.includes("product")) return "Product Wing";
    if (t.includes("sean")) return "Identity Wing";
    if (p === "/" || t.includes("compass")) return "Interface Origin";
    if (p.startsWith("/door/") || t === "door") return "Website Threshold";
    if (p.startsWith("/home/") || t === "home") return "Home Wing";
    if (t.includes("guide")) return "Guide Wing";

    return CARDINAL_LABELS[cardinal]?.meaning || "Blueprint Wing";
  }

  function inferRole(path, title, cardinal) {
    const p = normalizePath(path);
    const t = String(title || "").toLowerCase();

    if (p === "/" || t.includes("compass")) return "orientation";
    if (p.startsWith("/door/") || t === "door") return "threshold";
    if (p.startsWith("/home/") || t === "home") return "stabilizer";
    if (p.startsWith("/showroom/") || t.includes("showroom")) return "door-object";
    if (p.startsWith("/showroom/globe/") || t.includes("mirrorland")) return "mirrorland-door";
    if (p.includes("/audralia/")) return "planetary-room";
    if (p.includes("/h-earth/")) return "world-room";
    if (p.startsWith("/characters/")) return "character-room";
    if (p.startsWith("/explore/frontier/") || t.includes("frontier")) return "deployment-room";
    if (p.startsWith("/laws/") || t.includes("law")) return "law-room";
    if (p.startsWith("/gauges/") || t.includes("gauge")) return "measurement-room";
    if (p.startsWith("/products/") || t.includes("product")) return "product-room";

    return cardinal + "-room";
  }

  function inferMirrorlandAligned(path, title, group) {
    const p = normalizePath(path);
    const t = String(title || "").toLowerCase();
    const g = String(group || "").toLowerCase();

    return Boolean(
      isMirrorlandPrimaryPath(p) ||
      p.startsWith("/explore/frontier/") ||
      p.startsWith("/characters/") ||
      p.startsWith("/nine-summits/") ||
      p.includes("/audralia/") ||
      p.includes("/h-earth/") ||
      t.includes("frontier") ||
      t.includes("mirrorland") ||
      t.includes("audralia") ||
      t.includes("h-earth") ||
      t.includes("nine summits") ||
      g.includes("frontier") ||
      g.includes("mirrorland")
    );
  }

  function room(input) {
    const path = normalizePath(input.path || "/");
    const title = String(input.title || "Room");
    const group = String(input.group || "");
    const cardinal = input.cardinal || classifyCardinalFromPathAndTitle(path, title, group);
    const wing = input.wing || inferWing(path, title, group, cardinal);
    const role = input.role || inferRole(path, title, cardinal);
    const mirrorlandAligned = input.mirrorlandAligned != null
      ? Boolean(input.mirrorlandAligned)
      : inferMirrorlandAligned(path, title, group);

    return Object.freeze({
      id: String(input.id || slug(title + "-" + path)),
      title,
      path,
      file: String(input.file || path.replace(/\/$/, "/index.html")),
      cardinal,
      wing,
      role,
      menu: String(input.menu || (mirrorlandAligned ? "mirrorland" : "main")),
      body: String(input.body || "Enter this room."),
      current: Boolean(input.current),
      mirrorlandAligned,
      support: Boolean(input.support),
      source: String(input.source || "runtime")
    });
  }

  function mirrorlandCoreRooms() {
    return [
      room({
        id: "showroom-door",
        title: "Door / Showroom",
        path: "/showroom/",
        cardinal: "center",
        wing: "Portal Foyer",
        role: "door-context",
        menu: "mirrorland",
        body: "Return to the Door context and Diamond Lattice object.",
        mirrorlandAligned: true,
        source: "core"
      }),
      room({
        id: "mirrorland-field",
        title: "Globe / Mirrorland Field",
        path: "/showroom/globe/",
        cardinal: "east",
        wing: "Mirrorland Field",
        role: "field-door",
        menu: "mirrorland",
        body: "Open the Mirrorland field from inside the map.",
        mirrorlandAligned: true,
        source: "core"
      }),
      room({
        id: "audralia",
        title: "Audralia / Planetary Path",
        path: "/showroom/globe/audralia/",
        cardinal: "east",
        wing: "Audralia World Wing",
        role: "planetary-door",
        menu: "mirrorland",
        body: "Enter Audralia, the first living planetary doorway.",
        mirrorlandAligned: true,
        source: "core"
      }),
      room({
        id: "audralia-planet",
        title: "Audralia Planet",
        path: "/showroom/globe/audralia/planet/",
        cardinal: "east",
        wing: "Audralia World Wing",
        role: "planet-room",
        menu: "mirrorland",
        body: "Inspect the Audralia future-body planetary template.",
        mirrorlandAligned: true,
        source: "core"
      }),
      room({
        id: "audralia-cockpit",
        title: "Audralia Cockpit",
        path: "/showroom/globe/audralia/disposition/",
        cardinal: "east",
        wing: "Audralia Instruments",
        role: "instrument-room",
        menu: "mirrorland",
        body: "Open the cockpit and disposition instruments.",
        mirrorlandAligned: true,
        source: "core"
      }),
      room({
        id: "characters",
        title: "Characters / Story Faces",
        path: "/characters/",
        cardinal: "east",
        wing: "Character Wing",
        role: "character-room",
        menu: "mirrorland",
        body: "Meet the faces waiting beyond the Door.",
        mirrorlandAligned: true,
        source: "core"
      }),
      room({
        id: "h-earth",
        title: "H-Earth",
        path: "/showroom/globe/h-earth/",
        cardinal: "east",
        wing: "H-Earth World Wing",
        role: "world-room",
        menu: "mirrorland",
        body: "Open the H-Earth world path.",
        mirrorlandAligned: true,
        source: "core"
      }),
      room({
        id: "frontier",
        title: "Frontier / West Deployment Wing",
        path: "/explore/frontier/",
        cardinal: "west",
        wing: "Frontier Deployment",
        role: "west-deployment-door",
        menu: "mirrorland",
        body: "Frontier belongs to Mirrorland and sits in the West deployment wing.",
        mirrorlandAligned: true,
        source: "core"
      }),
      room({
        id: "frontier-water",
        title: "Frontier Water",
        path: "/explore/frontier/water/",
        cardinal: "west",
        wing: "Water Chamber",
        role: "water-room",
        menu: "mirrorland",
        body: "Open the water frontier room.",
        mirrorlandAligned: true,
        source: "core"
      }),
      room({
        id: "frontier-waste",
        title: "Frontier Waste",
        path: "/explore/frontier/waste/",
        cardinal: "west",
        wing: "Waste Chamber",
        role: "waste-room",
        menu: "mirrorland",
        body: "Open the waste frontier room.",
        mirrorlandAligned: true,
        source: "core"
      }),
      room({
        id: "frontier-energy",
        title: "Frontier Energy",
        path: "/explore/frontier/energy/",
        cardinal: "west",
        wing: "Energy Chamber",
        role: "energy-room",
        menu: "mirrorland",
        body: "Open the energy frontier room.",
        mirrorlandAligned: true,
        source: "core"
      }),
      room({
        id: "gauges-proof",
        title: "Gauges / Proof",
        path: "/gauges/",
        cardinal: "south",
        wing: "Audit Wing",
        role: "measurement-room",
        menu: "mirrorland",
        body: "Measure what is present, routed, and holding shape.",
        mirrorlandAligned: true,
        support: true,
        source: "core"
      })
    ];
  }

  function mainCoreRooms() {
    return [
      room({
        id: "compass",
        title: "Compass",
        path: "/",
        cardinal: "north",
        wing: "Interface Origin",
        role: "orientation",
        menu: "main",
        body: "Return to the main website compass.",
        mirrorlandAligned: false,
        source: "core"
      }),
      room({
        id: "door",
        title: "Door",
        path: "/door/",
        cardinal: "north",
        wing: "Website Threshold",
        role: "threshold",
        menu: "main",
        body: "Open the ordinary site threshold.",
        mirrorlandAligned: false,
        source: "core"
      }),
      room({
        id: "home",
        title: "Home",
        path: "/home/",
        cardinal: "north",
        wing: "Home Wing",
        role: "stabilizer",
        menu: "main",
        body: "Return home.",
        mirrorlandAligned: false,
        source: "core"
      }),
      room({
        id: "site-guide",
        title: "Site Guide",
        path: "/site-guide/",
        cardinal: "north",
        wing: "Guide Wing",
        role: "guide-room",
        menu: "main",
        body: "Use the site guide.",
        mirrorlandAligned: false,
        source: "core"
      }),
      room({
        id: "laws",
        title: "Laws",
        path: "/laws/",
        cardinal: "south",
        wing: "Law Wing",
        role: "law-room",
        menu: "main",
        body: "Open the law and proof layer.",
        mirrorlandAligned: false,
        source: "core"
      }),
      room({
        id: "gauges-main",
        title: "Gauges",
        path: "/gauges/",
        cardinal: "south",
        wing: "Audit Wing",
        role: "measurement-room",
        menu: "main",
        body: "Open route proof and measurement.",
        mirrorlandAligned: false,
        source: "core"
      }),
      room({
        id: "products",
        title: "Products",
        path: "/products/",
        cardinal: "west",
        wing: "Product Wing",
        role: "product-room",
        menu: "main",
        body: "Open product rooms.",
        mirrorlandAligned: false,
        source: "core"
      }),
      room({
        id: "meet-sean",
        title: "Meet Sean Mansfield",
        path: "/about-this-underdog/",
        cardinal: "west",
        wing: "Identity Wing",
        role: "public-facing-room",
        menu: "main",
        body: "Open the public-facing human room.",
        mirrorlandAligned: false,
        source: "core"
      })
    ];
  }

  function registryRooms() {
    const reg = registry();
    const source = Array.isArray(reg?.routes)
      ? reg.routes
      : Array.isArray(window.DGB_MANOR_BLUEPRINT_ROUTE_REGISTRY)
        ? window.DGB_MANOR_BLUEPRINT_ROUTE_REGISTRY
        : [];

    return source.map((item, index) => {
      const title = String(item.title || item.label || item.name || "Room");
      const path = normalizePath(item.path || item.href || "/");
      const group = String(item.group || item.family || "");
      const cardinal = item.cardinal
        ? String(item.cardinal).toLowerCase()
        : classifyCardinalFromPathAndTitle(path, title, group);
      const mirrorlandAligned = item.mirrorlandAligned != null
        ? Boolean(item.mirrorlandAligned)
        : inferMirrorlandAligned(path, title, group);
      const menu = item.menu || (item.mirrorlandDoor || mirrorlandAligned ? "mirrorland" : "main");

      return room({
        id: String(item.id || item.routeId || item.key || `registry-${slug(title)}-${index}`),
        title,
        path,
        file: String(item.file || item.target || path.replace(/\/$/, "/index.html")),
        cardinal: CARDINAL_LABELS[cardinal] ? cardinal : classifyCardinalFromPathAndTitle(path, title, group),
        wing: item.wing || inferWing(path, title, group, cardinal),
        role: item.role || inferRole(path, title, cardinal),
        menu,
        body: String(item.body || item.description || "Enter this room."),
        mirrorlandAligned,
        source: "registry"
      });
    });
  }

  function dedupeRooms(rooms) {
    const seen = new Set();
    const output = [];

    rooms.forEach((item) => {
      const key = item.menu + "::" + normalizePath(item.path) + "::" + item.cardinal + "::" + item.title;
      if (seen.has(key)) return;
      seen.add(key);
      output.push(item);
    });

    return output;
  }

  function mirrorlandRooms() {
    const registryMirrorland = registryRooms().filter((item) => {
      if (!item.mirrorlandAligned) return false;
      if (item.path === "/") return false;
      return true;
    }).map((item) => room({ ...item, menu: "mirrorland" }));

    return dedupeRooms(mirrorlandCoreRooms().concat(registryMirrorland));
  }

  function mainMenuRooms() {
    const core = mainCoreRooms();
    const registryMain = registryRooms().filter((item) => {
      const path = normalizePath(item.path);
      const isDuplicateCore = core.some((coreRoom) => normalizePath(coreRoom.path) === path && coreRoom.title === item.title);
      if (isDuplicateCore) return false;
      if (item.mirrorlandAligned) return false;
      return true;
    }).map((item) => room({ ...item, menu: "main", mirrorlandAligned: false }));

    return dedupeRooms(core.concat(registryMain));
  }

  function allKnownRooms() {
    return dedupeRooms(mirrorlandRooms().concat(mainMenuRooms()));
  }

  function currentRoom(rooms) {
    const path = normalizePath(window.location.pathname || "/");

    return rooms.find((item) => normalizePath(item.path) === path) ||
      rooms.find((item) => normalizePath(item.path) !== "/" && pathStartsWith(path, item.path)) ||
      rooms[0] ||
      null;
  }

  function markCurrentRooms(rooms) {
    const current = currentRoom(rooms);

    return rooms.map((item) => room({
      ...item,
      current: Boolean(current && item.id === current.id)
    }));
  }

  function groupedRooms(rooms) {
    const grouped = { north: [], east: [], center: [], west: [], south: [] };

    markCurrentRooms(rooms).forEach((item) => {
      const key = CARDINAL_LABELS[item.cardinal] ? item.cardinal : "center";
      grouped[key].push(item);
    });

    return grouped;
  }

  function roomSummary(rooms) {
    const grouped = groupedRooms(rooms);
    const current = currentRoom(rooms);

    return {
      currentRoom: current,
      northRoomCount: grouped.north.length,
      eastRoomCount: grouped.east.length,
      centerRoomCount: grouped.center.length,
      westRoomCount: grouped.west.length,
      southRoomCount: grouped.south.length,
      totalRoomCount: rooms.length
    };
  }

  function instructions() {
    const reg = registry();
    const source = Array.isArray(reg?.instructions)
      ? reg.instructions
      : Array.isArray(reg?.navigationTerms)
        ? reg.navigationTerms
        : Array.isArray(window.DGB_MANOR_BLUEPRINT_INSTRUCTIONS)
          ? window.DGB_MANOR_BLUEPRINT_INSTRUCTIONS
          : [
            {
              title: "Single Entryway",
              body: "The floating Map / Portal blip is the single public entryway into Mirrorland."
            },
            {
              title: "Mirrorland Doors",
              body: "Inside the map, Mirrorland routes are represented as doors. Choose a door after opening the blip."
            },
            {
              title: "Main Menu",
              body: "Main Menu / Website Options remain separate from the Mirrorland Doors."
            },
            {
              title: "Compass",
              body: "Compass remains the main-site orientation layer. It is not the Mirrorland Portal."
            },
            {
              title: "Frontier",
              body: "Frontier belongs to Mirrorland and is placed in the West deployment wing."
            },
            {
              title: "Joystick Scroll",
              body: "Drag the Map / Portal blip near the top or bottom edge to scroll with the stronger visible force profile."
            }
          ];

    return source.map((item, index) => ({
      title: String(item.title || `Instruction ${index + 1}`),
      body: String(item.body || item.description || item.text || "Read this instruction.")
    }));
  }

  function normalizeLens(lens) {
    if (lens === "main" || lens === "website" || lens === "site") return "main";
    if (lens === "instructions") return "instructions";
    return "mirrorland";
  }

  function lensTitle() {
    if (state.activeLens === "main") return "Main Menu / Website Options";
    if (state.activeLens === "instructions") return "Instructions";
    return "Mirrorland Doors";
  }

  function lensSubtitle() {
    if (state.activeLens === "main") {
      return "Ordinary website options remain separate from Mirrorland. Compass is the main-site orientation layer, not the Mirrorland Portal.";
    }

    if (state.activeLens === "instructions") {
      return "Use the Map / Portal blip as the single entryway, then choose a door inside the Mirrorland room blueprint.";
    }

    if (frontierActive()) {
      return "Frontier is a Mirrorland door in the West deployment wing.";
    }

    return "You opened the Map / Portal blip. Choose a door into Mirrorland from the cardinal room blueprint.";
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
    if (bubble) return bubble;

    bubble = document.createElement("button");
    bubble.type = "button";
    bubble.className = "dgb-blueprint-bubble";
    bubble.setAttribute("aria-label", "Open Mirrorland Map Portal entryway");
    bubble.setAttribute("data-dgb-blueprint-bubble", "true");
    bubble.setAttribute("data-manor-blueprint-contract", CONTRACT);
    bubble.setAttribute("data-api-contract", API_CONTRACT);
    bubble.setAttribute("data-full-viewport-drag", "true");
    bubble.setAttribute("data-joystick-scroll", "true");
    bubble.setAttribute("data-joystick-scroll-force-profile", JOYSTICK_SCROLL_FORCE_PROFILE);
    bubble.setAttribute("data-map-blip-single-entryway", "true");
    bubble.setAttribute("data-mirrorland-entryway", "map-portal-blip");
    bubble.setAttribute("data-mirrorland-portal", "true");
    bubble.setAttribute("data-cardinal-room-map", "true");
    bubble.setAttribute("data-frontier-mirrorland-aligned", "true");
    bubble.setAttribute("data-dual-menu", "true");
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

    document.body.appendChild(bubble);
    return bubble;
  }

  function createOverlay() {
    overlay = enforceSingleElement(OVERLAY_SELECTOR);
    if (overlay) return overlay;

    overlay = document.createElement("section");
    overlay.className = "dgb-blueprint-overlay";
    overlay.hidden = true;
    overlay.setAttribute("data-dgb-blueprint-overlay", "true");
    overlay.setAttribute("data-open", "false");
    overlay.setAttribute("data-manor-blueprint-contract", CONTRACT);
    overlay.setAttribute("data-map-blip-single-entryway", "true");
    overlay.setAttribute("data-mirrorland-entryway", "map-portal-blip");
    overlay.setAttribute("data-mirrorland-portal", "true");
    overlay.setAttribute("data-cardinal-room-map", "true");
    overlay.setAttribute("data-frontier-mirrorland-aligned", "true");
    overlay.setAttribute("aria-label", "Mirrorland Doors cardinal room blueprint");

    document.body.appendChild(overlay);
    return overlay;
  }

  function renderRoomCard(item) {
    return `
      <a
        class="dgb-bp-room${item.current ? " dgb-bp-room-current" : ""}"
        href="${escapeHtml(item.path)}"
        data-room-id="${escapeHtml(item.id)}"
        data-cardinal="${escapeHtml(item.cardinal)}"
        data-wing="${escapeHtml(item.wing)}"
        data-role="${escapeHtml(item.role)}"
        data-menu="${escapeHtml(item.menu)}"
        data-current="${item.current ? "true" : "false"}"
        data-mirrorland-aligned="${item.mirrorlandAligned ? "true" : "false"}"
        data-file="${escapeHtml(item.file)}"
      >
        <span class="dgb-bp-room-door" aria-hidden="true"></span>
        <span class="dgb-bp-room-meta">
          <span class="dgb-bp-room-wing">${escapeHtml(item.wing)}</span>
          <strong class="dgb-bp-room-title">${escapeHtml(item.title)}</strong>
          <span class="dgb-bp-room-role">${escapeHtml(item.role.replaceAll("-", " "))}</span>
          <code class="dgb-bp-room-path">${escapeHtml(item.path)}</code>
        </span>
      </a>
    `;
  }

  function renderCardinalZone(cardinal, rooms) {
    const label = CARDINAL_LABELS[cardinal] || CARDINAL_LABELS.center;

    return `
      <section class="dgb-bp-cardinal-zone" data-cardinal="${escapeHtml(cardinal)}" data-room-count="${rooms.length}">
        <header class="dgb-bp-cardinal-head">
          <b>${escapeHtml(label.title)}</b>
          <span>${escapeHtml(label.meaning)}</span>
        </header>
        <div class="dgb-bp-room-stack">
          ${rooms.length ? rooms.map(renderRoomCard).join("") : `
            <div class="dgb-bp-room dgb-bp-room-empty" data-cardinal="${escapeHtml(cardinal)}">
              <span class="dgb-bp-room-door" aria-hidden="true"></span>
              <span class="dgb-bp-room-meta">
                <span class="dgb-bp-room-wing">${escapeHtml(label.title)}</span>
                <strong class="dgb-bp-room-title">Room Held</strong>
                <span class="dgb-bp-room-role">No room assigned</span>
              </span>
            </div>
          `}
        </div>
      </section>
    `;
  }

  function renderRoomMap(rooms) {
    const marked = markCurrentRooms(rooms);
    const grouped = groupedRooms(marked);
    const summary = roomSummary(marked);

    state.lastRoomSummary = summary;

    return `
      <div
        class="dgb-bp-room-map"
        data-room-map-active="true"
        data-cardinal-room-map="true"
        data-floating-nodes-replaced="true"
        data-blueprint-rooms-clickable="true"
        data-map-blip-single-entryway="true"
        data-current-room-id="${escapeHtml(summary.currentRoom?.id || "")}"
        data-current-cardinal="${escapeHtml(summary.currentRoom?.cardinal || "")}"
      >
        <div class="dgb-bp-room-map-axis dgb-bp-room-map-axis-north" aria-hidden="true">North</div>
        <div class="dgb-bp-room-map-axis dgb-bp-room-map-axis-east" aria-hidden="true">East</div>
        <div class="dgb-bp-room-map-axis dgb-bp-room-map-axis-west" aria-hidden="true">West</div>
        <div class="dgb-bp-room-map-axis dgb-bp-room-map-axis-south" aria-hidden="true">South</div>
        ${CARDINAL_ORDER.map((cardinal) => renderCardinalZone(cardinal, grouped[cardinal] || [])).join("")}
      </div>
    `;
  }

  function renderCurrentPanel(rooms, mode) {
    const current = currentRoom(rooms);
    const entered = mirrorlandEntered();
    const support = mirrorlandSupportActive();
    const frontier = frontierActive();

    return `
      <aside class="dgb-bp-panel">
        <div class="dgb-bp-panel-head">
          <b>${mode === "main" ? "Current Website Room" : "Map / Portal Entryway"}</b>
          <h3>${escapeHtml(current?.title || "Mirrorland Doors")}</h3>
          <p>${escapeHtml(mode === "main" ? (current?.body || "Choose a website option.") : "The blip is the entryway. Choose a Mirrorland door inside the map.")}</p>
        </div>

        <div class="dgb-bp-you-are-here">
          <div class="dgb-bp-location-card">
            <b>${frontier ? "Frontier · West Wing" : entered ? "Inside Mirrorland" : support ? "Proof / Support Route" : mode === "main" ? "Website Options" : "Entryway Opened"}</b>
            <strong>${escapeHtml(current?.wing || "Mirrorland Doors")}</strong>
            <code>${escapeHtml(normalizePath(window.location.pathname || "/"))}</code>
          </div>

          <div class="dgb-bp-chain">
            ${mode === "main" ? `
              <span>Compass</span>
              <span class="dgb-bp-chain-separator">→</span>
              <span>Website Options</span>
            ` : `
              <span>Map Blip</span>
              <span class="dgb-bp-chain-separator">→</span>
              <span>Mirrorland Doors</span>
              <span class="dgb-bp-chain-separator">→</span>
              <span>${escapeHtml(current?.title || "Choose Door")}</span>
            `}
          </div>

          <div class="dgb-bp-guide-link" aria-label="${mode === "main" ? "Main menu context" : "Mirrorland door context"}">
            ${mode === "main" ? "Compass remains separate." : "Choose a door below."}
          </div>
        </div>
      </aside>
    `;
  }

  function renderMirrorlandLens() {
    const rooms = mirrorlandRooms();

    return `
      <div class="dgb-bp-map-grid dgb-bp-room-grid">
        ${renderCurrentPanel(rooms, "mirrorland")}

        <section class="dgb-bp-panel dgb-bp-room-map-panel">
          <div class="dgb-bp-panel-head">
            <b>Mirrorland Doors</b>
            <h3>Choose a door into Mirrorland</h3>
            <p>The Map / Portal blip is the entryway. These rooms are doors inside the Mirrorland field. Frontier belongs to Mirrorland and sits in the West deployment wing.</p>
          </div>
          <div class="dgb-bp-route-tools dgb-bp-room-tools">
            ${renderRoomMap(rooms)}
          </div>
        </section>
      </div>
    `;
  }

  function renderMainLens() {
    const rooms = mainMenuRooms();

    return `
      <div class="dgb-bp-map-grid dgb-bp-room-grid">
        ${renderCurrentPanel(rooms, "main")}

        <section class="dgb-bp-panel dgb-bp-room-map-panel">
          <div class="dgb-bp-panel-head">
            <b>Main Menu / Website Options</b>
            <h3>Website options</h3>
            <p>Compass remains the main-site orientation room. It is not the Mirrorland Portal.</p>
          </div>
          <div class="dgb-bp-route-tools dgb-bp-room-tools">
            ${renderRoomMap(rooms)}
          </div>
        </section>
      </div>
    `;
  }

  function renderInstructionsLens() {
    const cards = instructions().map((item, index) => `
      <article class="dgb-bp-instruction-card">
        <b>Instruction ${index + 1}</b>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.body)}</p>
      </article>
    `).join("");

    return `<div class="dgb-bp-instructions-grid">${cards}</div>`;
  }

  function renderActiveLens() {
    if (state.activeLens === "main") return renderMainLens();
    if (state.activeLens === "instructions") return renderInstructionsLens();
    return renderMirrorlandLens();
  }

  function renderOverlay() {
    if (!overlay) return;

    const entered = mirrorlandEntered();
    const support = mirrorlandSupportActive();
    const frontier = frontierActive();

    overlay.innerHTML = `
      <div class="dgb-bp-topbar">
        <div class="dgb-bp-titleblock">
          <div class="dgb-bp-kicker">${state.activeLens === "main" ? "Website Options" : state.activeLens === "instructions" ? "Portal Instructions" : "Map / Portal Entryway"}</div>
          <h2 class="dgb-bp-title">${escapeHtml(lensTitle())}</h2>
          <p class="dgb-bp-subtitle">${escapeHtml(lensSubtitle())}</p>
        </div>
        <button class="dgb-bp-close" type="button" data-dgb-close aria-label="Close Mirrorland Portal">×</button>
      </div>

      <div class="dgb-bp-main">
        <div class="dgb-bp-tabs">
          <div class="dgb-bp-tablist" role="tablist" aria-label="Mirrorland Portal lenses">
            <button class="dgb-bp-tab" type="button" data-dgb-lens="mirrorland" aria-selected="${state.activeLens === "mirrorland"}" data-active="${state.activeLens === "mirrorland"}">Mirrorland Doors</button>
            <button class="dgb-bp-tab" type="button" data-dgb-lens="main" aria-selected="${state.activeLens === "main"}" data-active="${state.activeLens === "main"}">Main Menu</button>
            <button class="dgb-bp-tab" type="button" data-dgb-lens="instructions" aria-selected="${state.activeLens === "instructions"}" data-active="${state.activeLens === "instructions"}">Instructions</button>
          </div>
          <div class="dgb-bp-current-pill">${frontier ? "Frontier · West Wing" : entered ? "Inside Mirrorland" : support ? "Support Route" : "Entryway Opened"}</div>
        </div>

        <div class="dgb-bp-content" data-cardinal-room-map="true" data-map-blip-single-entryway="true">
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
    state.activeLens = normalizeLens(lens);
    state.lastAction = "set-lens:" + state.activeLens;

    if (overlay) overlay.setAttribute("data-active-lens", state.activeLens);

    renderOverlay();
    publishStatus();
  }

  function resetPosition() {
    clearStoredPosition();
    state.localStorageRepaired = true;
    applyPosition(defaultPosition(), "reset", true);
  }

  function joystickSpeedFromPressure(pressure) {
    const cleanPressure = Math.max(0, Math.min(1, Number(pressure) || 0));
    const baseSpeed = MIN_SCROLL_SPEED + (MAX_SCROLL_SPEED - MIN_SCROLL_SPEED) * cleanPressure;
    return baseSpeed * JOYSTICK_SCROLL_FORCE_MULTIPLIER;
  }

  function joystickMetrics(clientY) {
    const v = viewport();
    const topZone = Math.max(96, Math.floor(v.height * 0.18));
    const bottomZone = Math.max(120, Math.floor(v.height * 0.22));
    const y = clientY - v.offsetTop;

    if (y < topZone) {
      const pressure = Math.max(0, Math.min(1, (topZone - y) / topZone));
      return { direction: "up", speed: joystickSpeedFromPressure(pressure) };
    }

    if (y > v.height - bottomZone) {
      const pressure = Math.max(0, Math.min(1, (y - (v.height - bottomZone)) / bottomZone));
      return { direction: "down", speed: joystickSpeedFromPressure(pressure) };
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
    if (!bubble || bubble.__dgbJoystickDragAttached) return;
    bubble.__dgbJoystickDragAttached = true;

    bubble.addEventListener("pointerdown", (event) => {
      if (state.overlayOpen) return;

      state.dragging = true;
      state.dragMoved = false;
      state.pointerId = event.pointerId;
      state.pointerStartX = event.clientX;
      state.pointerStartY = event.clientY;
      state.pointerClientX = event.clientX;
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

      state.pointerClientX = event.clientX;
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

  function round2(value) {
    return Math.round(Number(value || 0) * 100) / 100;
  }

  function publishStatus() {
    const v = viewport();
    const m = safeMargins();
    const rect = bubble ? bubble.getBoundingClientRect() : null;

    const mirrorRooms = mirrorlandRooms();
    const mainRooms = mainMenuRooms();
    const activeRooms = state.activeLens === "main" ? mainRooms : mirrorRooms;
    const summary = roomSummary(activeRooms);
    const current = summary.currentRoom || currentRoom(allKnownRooms());

    const payload = {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      priorContract: PRIOR_CONTRACT,
      legacyContract: LEGACY_CONTRACT,
      apiContract: API_CONTRACT,

      active: true,
      mapBlipSingleEntryway: true,
      mirrorlandEntryway: "map_portal_blip",
      mirrorlandDoorsInsideMap: true,
      pageBodyDirectory: false,
      mirrorlandPortalActive: true,
      roomMapActive: true,
      cardinalRoomMap: true,
      floatingNodesReplaced: true,
      blueprintRoomsClickable: true,
      cardinalDispositionActive: true,

      mirrorlandEntered: mirrorlandEntered(),
      mirrorlandSupportActive: mirrorlandSupportActive(),
      frontierMirrorlandAligned: true,
      frontierBelongsToMirrorland: true,
      frontierCardinalDisposition: "west",
      frontierWing: "Frontier Deployment",
      frontierActive: frontierActive(),

      mirrorlandMenuDefault: true,
      mirrorlandMenuAvailable: true,
      mirrorlandMenuLabel: "Mirrorland Doors",
      mainMenuAvailable: true,
      websiteOptionsSeparated: true,
      instructionsAvailable: true,
      compassSeparated: true,
      dualMenuActive: true,

      bubbleMounted: Boolean(bubble && document.body.contains(bubble)),
      overlayMounted: Boolean(overlay && document.body.contains(overlay)),
      overlayOpen: state.overlayOpen,

      fullViewportDrag: true,
      joystickScrollActive: true,
      joystickScrolling: state.joystickActive,
      joystickDirection: state.joystickDirection,
      joystickSpeed: round2(state.joystickSpeed),
      joystickScrollForceProfile: JOYSTICK_SCROLL_FORCE_PROFILE,
      joystickScrollForceMultiplier: JOYSTICK_SCROLL_FORCE_MULTIPLIER,
      joystickScrollForceIncreasePercent: JOYSTICK_SCROLL_FORCE_INCREASE_PERCENT,
      joystickMinScrollSpeed: MIN_SCROLL_SPEED,
      joystickMaxScrollSpeed: MAX_SCROLL_SPEED,
      joystickEffectiveMinScrollSpeed: round2(MIN_SCROLL_SPEED * JOYSTICK_SCROLL_FORCE_MULTIPLIER),
      joystickEffectiveMaxScrollSpeed: round2(MAX_SCROLL_SPEED * JOYSTICK_SCROLL_FORCE_MULTIPLIER),

      activeLens: state.activeLens,
      currentPath: normalizePath(window.location.pathname || "/"),
      currentRoomId: current?.id || "",
      currentRoomTitle: current?.title || "",
      currentRoomCardinal: current?.cardinal || "",
      currentRoomWing: current?.wing || "",

      northRoomCount: summary.northRoomCount,
      eastRoomCount: summary.eastRoomCount,
      centerRoomCount: summary.centerRoomCount,
      westRoomCount: summary.westRoomCount,
      southRoomCount: summary.southRoomCount,
      activeRoomCount: summary.totalRoomCount,
      mirrorlandRoomCount: mirrorRooms.length,
      mainMenuRoomCount: mainRooms.length,

      registryAvailable: Boolean(registry()),

      fixedBubble: true,
      fullScreenOverlay: true,
      mapInstructionsToggle: true,
      draggable: true,
      mobileSafePosition: Boolean(
        rect &&
        rect.left >= v.offsetLeft - 1 &&
        rect.top >= v.offsetTop - 1 &&
        rect.right <= v.offsetLeft + v.width + 1 &&
        rect.bottom <= v.offsetTop + v.height + 1
      ),

      visualViewportUsed: v.visualViewportUsed,
      viewportWidth: v.width,
      viewportHeight: v.height,
      visualViewportScale: v.scale,
      safeMargins: m,

      positionSource: state.positionSource,
      positionWasClamped: state.positionWasClamped,
      localStorageRepaired: state.localStorageRepaired,
      bubblePosition: { ...state.position },
      bubbleRect: rect ? {
        x: rect.x,
        y: rect.y,
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height
      } : null,

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
      document.documentElement.dataset.manorBlueprintPriorContract = PRIOR_CONTRACT;
      document.documentElement.dataset.manorBlueprintLegacyContract = LEGACY_CONTRACT;

      document.documentElement.dataset.manorBlueprintMapBlipSingleEntryway = "true";
      document.documentElement.dataset.manorBlueprintMirrorlandEntryway = "map-portal-blip";
      document.documentElement.dataset.manorBlueprintMirrorlandDoorsInsideMap = "true";
      document.documentElement.dataset.manorBlueprintPageBodyDirectory = "false";
      document.documentElement.dataset.manorBlueprintMirrorlandMenuLabel = "Mirrorland Doors";
      document.documentElement.dataset.manorBlueprintWebsiteOptionsSeparated = "true";

      document.documentElement.dataset.manorBlueprintMirrorlandPortalActive = "true";
      document.documentElement.dataset.manorBlueprintRoomMapActive = "true";
      document.documentElement.dataset.manorBlueprintCardinalRoomMap = "true";
      document.documentElement.dataset.manorBlueprintFloatingNodesReplaced = "true";
      document.documentElement.dataset.manorBlueprintRoomsClickable = "true";
      document.documentElement.dataset.manorBlueprintCardinalDispositionActive = "true";

      document.documentElement.dataset.manorBlueprintFrontierMirrorlandAligned = "true";
      document.documentElement.dataset.manorBlueprintFrontierBelongsToMirrorland = "true";
      document.documentElement.dataset.manorBlueprintFrontierCardinalDisposition = "west";
      document.documentElement.dataset.manorBlueprintCompassSeparated = "true";
      document.documentElement.dataset.manorBlueprintDualMenuActive = "true";

      document.documentElement.dataset.manorBlueprintJoystickScrollForceProfile = JOYSTICK_SCROLL_FORCE_PROFILE;
      document.documentElement.dataset.manorBlueprintJoystickMinScrollSpeed = String(MIN_SCROLL_SPEED);
      document.documentElement.dataset.manorBlueprintJoystickMaxScrollSpeed = String(MAX_SCROLL_SPEED);
      document.documentElement.dataset.manorBlueprintJoystickScrollForceMultiplier = String(JOYSTICK_SCROLL_FORCE_MULTIPLIER);

      document.documentElement.dataset.manorBlueprintActiveLens = state.activeLens;
      document.documentElement.dataset.manorBlueprintCurrentRoom = payload.currentRoomId;
      document.documentElement.dataset.manorBlueprintCurrentRoomCardinal = payload.currentRoomCardinal;
      document.documentElement.dataset.manorBlueprintCurrentRoomWing = payload.currentRoomWing;
      document.documentElement.dataset.manorBlueprintNorthRoomCount = String(payload.northRoomCount);
      document.documentElement.dataset.manorBlueprintEastRoomCount = String(payload.eastRoomCount);
      document.documentElement.dataset.manorBlueprintCenterRoomCount = String(payload.centerRoomCount);
      document.documentElement.dataset.manorBlueprintWestRoomCount = String(payload.westRoomCount);
      document.documentElement.dataset.manorBlueprintSouthRoomCount = String(payload.southRoomCount);

      document.documentElement.dataset.manorBlueprintPositionSource = state.positionSource;
      document.documentElement.dataset.manorBlueprintPositionWasClamped = String(state.positionWasClamped);
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
      legacyContract: LEGACY_CONTRACT,

      mapBlipSingleEntryway: true,
      mirrorlandEntryway: "map_portal_blip",
      mirrorlandDoorsInsideMap: true,
      pageBodyDirectory: false,
      mirrorlandPortalActive: true,
      roomMapActive: true,
      cardinalRoomMap: true,
      floatingNodesReplaced: true,
      blueprintRoomsClickable: true,
      cardinalDispositionActive: true,

      frontierMirrorlandAligned: true,
      frontierBelongsToMirrorland: true,
      frontierCardinalDisposition: "west",
      frontierWing: "Frontier Deployment",
      compassSeparated: true,
      dualMenuActive: true,

      joystickScrollForceProfile: JOYSTICK_SCROLL_FORCE_PROFILE,
      joystickMinScrollSpeed: MIN_SCROLL_SPEED,
      joystickMaxScrollSpeed: MAX_SCROLL_SPEED,
      joystickScrollForceMultiplier: JOYSTICK_SCROLL_FORCE_MULTIPLIER,
      joystickScrollForceIncreasePercent: JOYSTICK_SCROLL_FORCE_INCREASE_PERCENT,

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

// TARGET FILE: /assets/manor-blueprint/manor.blueprint.js
// TNT FULL-FILE REPLACEMENT
// MIRRORLAND_BLUEPRINT_ESTATE_ROOM_LANGUAGE_REGISTRY_RUNTIME_CSS_TNT_v1
//
// Runtime portion.
// Purpose:
// - Render visitor-facing estate-room language.
// - Hide route/file/wing/role metadata from public cards.
// - Preserve Map / Portal blip, overlay, drag, joystick scroll, and menu split.
//
// Previous runtime contract:
// MANOR_BLUEPRINT_MENU_CATEGORY_OWNERSHIP_RUNTIME_TNT_v1

(() => {
  "use strict";

  if (typeof window === "undefined" || typeof document === "undefined") return;

  const CONTRACT = "MIRRORLAND_BLUEPRINT_ESTATE_ROOM_LANGUAGE_REGISTRY_RUNTIME_CSS_TNT_v1";
  const PREVIOUS_CONTRACT = "MANOR_BLUEPRINT_MENU_CATEGORY_OWNERSHIP_RUNTIME_TNT_v1";
  const PRIOR_CONTRACT = "MANOR_BLUEPRINT_MIRRORLAND_DOORS_SINGLE_ENTRYWAY_RUNTIME_TNT_v1";
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
    north: { title: "North Hall", meaning: "Front doors, orientation, and return rooms" },
    east: { title: "East Gallery", meaning: "Story rooms, worlds, studies, and living doors" },
    center: { title: "Center Foyer", meaning: "Arrival, threshold, and current position" },
    west: { title: "West Grounds", meaning: "Workshop yard, public rooms, and applied systems" },
    south: { title: "South Library", meaning: "Law, testing, proof, and measurement rooms" }
  });

  const MIRRORLAND_PREFIXES = Object.freeze([
    "/showroom/",
    "/characters/",
    "/nine-summits/universe/",
    "/explore/frontier/"
  ]);

  const REGULAR_WEBSITE_PREFIXES = Object.freeze([
    "/door/",
    "/home/",
    "/products/",
    "/laws/",
    "/governance/",
    "/gauges/",
    "/about-this-underdog/",
    "/site-guide/"
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
        estateRoomLanguageActive: true,
        publicLabelsBound: true,
        routePathHiddenFromPublicCards: true,
        mainMenuWebsiteOptionsOnly: true,
        mirrorlandDoorsCategoryOnly: true,
        supportDoesNotEqualOwnership: true,
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

  function isRegularWebsitePath(path) {
    const clean = normalizePath(path);
    if (clean === "/") return true;
    return REGULAR_WEBSITE_PREFIXES.some((prefix) => pathStartsWith(clean, prefix));
  }

  function isMirrorlandCategoryPath(path) {
    const clean = normalizePath(path);
    if (isRegularWebsitePath(clean)) return false;
    return MIRRORLAND_PREFIXES.some((prefix) => pathStartsWith(clean, prefix));
  }

  function mirrorlandEntered() {
    return isMirrorlandCategoryPath(window.location.pathname || "/");
  }

  function frontierActive() {
    return pathStartsWith(window.location.pathname || "/", "/explore/frontier/");
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
      t.includes("door") ||
      t.includes("home") ||
      t.includes("guide") ||
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
      t.includes("product") ||
      t.includes("sean") ||
      t.includes("workshop") ||
      t.includes("gallery")
    ) {
      return "west";
    }

    if (
      p.startsWith("/laws/") ||
      p.startsWith("/gauges/") ||
      p.startsWith("/governance/") ||
      t.includes("law") ||
      t.includes("lab") ||
      t.includes("council") ||
      t.includes("gauge") ||
      t.includes("governance")
    ) {
      return "south";
    }

    if (
      p.startsWith("/showroom/") ||
      p.startsWith("/characters/") ||
      p.startsWith("/nine-summits/") ||
      p.includes("/audralia/") ||
      p.includes("/h-earth/") ||
      t.includes("atrium") ||
      t.includes("atlas") ||
      t.includes("zionts") ||
      t.includes("audralia") ||
      t.includes("world") ||
      t.includes("portrait") ||
      t.includes("universe") ||
      g.includes("mirrorland")
    ) {
      return "east";
    }

    return "center";
  }

  function defaultEstateFromPath(path, title) {
    const p = normalizePath(path);
    const t = String(title || "").toLowerCase();

    if (p === "/" || t.includes("compass")) return "The Compass Desk";
    if (p.startsWith("/door/")) return "The Front Door";
    if (p.startsWith("/home/")) return "The Hearth";
    if (p.startsWith("/site-guide/")) return "The Guide Desk";
    if (p.startsWith("/products/")) return "The Product Gallery";
    if (p.startsWith("/laws/")) return "The Law Library";
    if (p.startsWith("/governance/")) return "The Council Room";
    if (p.startsWith("/gauges/")) return "The Lab";
    if (p.startsWith("/about-this-underdog/")) return "The Host Portrait";
    if (p.startsWith("/showroom/globe/earth/")) return "ZIONTS";
    if (p.startsWith("/showroom/globe/audralia/planet/")) return "Audralia Worldroom";
    if (p.startsWith("/showroom/globe/audralia/disposition/")) return "The Control Room";
    if (p.startsWith("/showroom/globe/audralia/")) return "Audralia Conservatory";
    if (p.startsWith("/showroom/globe/")) return "The Atlas Study";
    if (p.startsWith("/showroom/")) return "The Atrium";
    if (p.startsWith("/characters/")) return "The Portrait Hall";
    if (p.startsWith("/nine-summits/universe/")) return "The Universe Gallery";
    if (p.startsWith("/explore/frontier/")) return "Frontier Workshop Yard";

    return title || "Estate Room";
  }

  function defaultEstateSection(path, mirrorlandAligned) {
    const p = normalizePath(path);

    if (p.startsWith("/explore/frontier/")) return "Mirrorland Grounds";
    if (p.startsWith("/showroom/globe/audralia/")) return "Audralia Conservatory";
    if (p.startsWith("/showroom/globe/")) return "The Atlas Study";
    if (p.startsWith("/showroom/") || p.startsWith("/characters/") || p.startsWith("/nine-summits/")) return "Mirrorland Estate";

    return mirrorlandAligned ? "Mirrorland Estate" : "Main House";
  }

  function defaultSummary(path, label) {
    const p = normalizePath(path);

    if (p === "/") return "Start here when you need ordinary site orientation.";
    if (p.startsWith("/door/")) return "Cross the ordinary entrance threshold.";
    if (p.startsWith("/home/")) return "Return to the stable center of the main estate.";
    if (p.startsWith("/site-guide/")) return "Learn how the estate, rooms, lenses, and returns work.";
    if (p.startsWith("/products/")) return "View usable objects, offers, and public-facing extensions.";
    if (p.startsWith("/laws/")) return "Study the rules, boundaries, proof, and governing constraints.";
    if (p.startsWith("/governance/")) return "Enter the decision room for policy, risk, and responsibility.";
    if (p.startsWith("/gauges/")) return "Check route truth, readiness, and audit signals.";
    if (p.startsWith("/about-this-underdog/")) return "Meet the human origin, mission, and public voice behind the estate.";
    if (p.startsWith("/showroom/globe/earth/")) return "ZIONTS, pronounced Zience, is the first world-door in the Atlas Study.";
    if (p.startsWith("/showroom/globe/audralia/planet/")) return "Inspect Audralia’s future body and world-formation path.";
    if (p.startsWith("/showroom/globe/audralia/disposition/")) return "Open the instrument room for Audralia’s controls and operating signals.";
    if (p.startsWith("/showroom/globe/audralia/")) return "Enter a living-world room where Audralia opens as a constructive future.";
    if (p.startsWith("/showroom/globe/")) return "Open the study of worlds: globes, maps, planetary doors, and living-world entries.";
    if (p.startsWith("/showroom/")) return "Enter the first interior arrival room and display floor.";
    if (p.startsWith("/characters/")) return "Meet the living characters and story faces of Mirrorland.";
    if (p.startsWith("/nine-summits/universe/")) return "Open the story-world gallery for the larger universe setting.";
    if (p.startsWith("/explore/frontier/")) return "Enter the outdoor testing yard where Audralia’s future systems are tried.";

    return `Enter ${label}.`;
  }

  function inferMirrorlandAligned(path, title, group) {
    const p = normalizePath(path);
    if (isRegularWebsitePath(p)) return false;
    if (isMirrorlandCategoryPath(p)) return true;

    const t = String(title || "").toLowerCase();
    const g = String(group || "").toLowerCase();

    if (
      t.includes("showroom") ||
      t.includes("planet") ||
      t.includes("cockpit") ||
      t.includes("frontier") ||
      t.includes("character") ||
      t.includes("story") ||
      t.includes("narrative") ||
      t.includes("nine summits") ||
      g.includes("mirrorland")
    ) {
      return true;
    }

    return false;
  }

  function room(input) {
    const path = normalizePath(input.path || "/");
    const rawTitle = String(input.title || input.publicLabel || "Room");
    const group = String(input.group || "");
    const cardinal = input.cardinal || classifyCardinalFromPathAndTitle(path, rawTitle, group);
    const mirrorlandAligned = input.mirrorlandAligned != null
      ? Boolean(input.mirrorlandAligned)
      : inferMirrorlandAligned(path, rawTitle, group);

    const publicLabel = String(input.publicLabel || input.publicShortLabel || defaultEstateFromPath(path, rawTitle));
    const estateRoom = String(input.estateRoom || publicLabel);
    const estateSection = String(input.estateSection || defaultEstateSection(path, mirrorlandAligned));
    const publicSummary = String(input.publicSummary || input.body || defaultSummary(path, publicLabel));
    const enterLabel = String(input.enterLabel || "Enter");

    return Object.freeze({
      id: String(input.id || slug(publicLabel + "-" + path)),
      title: rawTitle,
      publicLabel,
      publicShortLabel: String(input.publicShortLabel || publicLabel),
      estateRoom,
      estateSection,
      publicSummary,
      enterLabel,
      path,
      file: String(input.file || path.replace(/\/$/, "/index.html")),
      builderPathNote: String(input.builderPathNote || ""),
      cardinal: CARDINAL_LABELS[cardinal] ? cardinal : classifyCardinalFromPathAndTitle(path, publicLabel, group),
      wing: String(input.wing || estateSection),
      role: String(input.role || "estate-room"),
      menu: String(input.menu || (mirrorlandAligned ? "mirrorland" : "main")),
      body: publicSummary,
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
        publicLabel: "The Atrium",
        publicShortLabel: "Atrium",
        estateRoom: "The Atrium",
        estateSection: "Mirrorland Estate",
        publicSummary: "The first interior arrival room: display floor, orientation space, and Mirrorland entry presence.",
        path: "/showroom/",
        cardinal: "center",
        menu: "mirrorland",
        mirrorlandAligned: true,
        source: "core"
      }),
      room({
        id: "mirrorland-field",
        title: "Globe / Mirrorland Field",
        publicLabel: "The Atlas Study",
        publicShortLabel: "Atlas Study",
        estateRoom: "The Atlas Study",
        estateSection: "Mirrorland Estate",
        publicSummary: "The study of worlds: globes, maps, planetary doors, and living-world entries.",
        path: "/showroom/globe/",
        cardinal: "east",
        menu: "mirrorland",
        mirrorlandAligned: true,
        source: "core"
      }),
      room({
        id: "earth-reference",
        title: "Earth Reference",
        publicLabel: "ZIONTS",
        publicShortLabel: "ZIONTS",
        estateRoom: "The ZIONTS Room",
        estateSection: "The Atlas Study",
        publicSummary: "ZIONTS, pronounced Zience, is the first world-door in the Atlas Study.",
        builderPathNote: "Served under /showroom/globe/earth/ while public context resolves as ZIONTS.",
        path: "/showroom/globe/earth/",
        cardinal: "east",
        menu: "mirrorland",
        mirrorlandAligned: true,
        source: "core"
      }),
      room({
        id: "audralia",
        title: "Audralia / Planetary Path",
        publicLabel: "Audralia Conservatory",
        publicShortLabel: "Audralia",
        estateRoom: "Audralia Conservatory",
        estateSection: "The Atlas Study",
        publicSummary: "A living-world room where Audralia opens as a constructive future under formation.",
        path: "/showroom/globe/audralia/",
        cardinal: "east",
        menu: "mirrorland",
        mirrorlandAligned: true,
        source: "core"
      }),
      room({
        id: "audralia-planet",
        title: "Audralia Planet",
        publicLabel: "Audralia Worldroom",
        publicShortLabel: "Worldroom",
        estateRoom: "Audralia Worldroom",
        estateSection: "Audralia Conservatory",
        publicSummary: "The room for inspecting Audralia’s future body, surface direction, and world-formation path.",
        path: "/showroom/globe/audralia/planet/",
        cardinal: "east",
        menu: "mirrorland",
        mirrorlandAligned: true,
        source: "core"
      }),
      room({
        id: "audralia-cockpit",
        title: "Audralia Cockpit",
        publicLabel: "The Control Room",
        publicShortLabel: "Control Room",
        estateRoom: "The Control Room",
        estateSection: "Audralia Conservatory",
        publicSummary: "The instrument room for reading Audralia’s disposition, controls, and operating signals.",
        path: "/showroom/globe/audralia/disposition/",
        cardinal: "east",
        menu: "mirrorland",
        mirrorlandAligned: true,
        source: "core"
      }),
      room({
        id: "hearth",
        title: "Hearth",
        publicLabel: "Hearth Room",
        estateRoom: "Hearth Room",
        estateSection: "The Atlas Study",
        publicSummary: "A world-room for Hearth’s planet path and terrain development.",
        path: "/showroom/globe/hearth/",
        cardinal: "east",
        menu: "mirrorland",
        mirrorlandAligned: true,
        source: "core"
      }),
      room({
        id: "h-earth",
        title: "H-Earth",
        publicLabel: "H-Earth Room",
        estateRoom: "H-Earth Room",
        estateSection: "The Atlas Study",
        publicSummary: "A hybrid-world study room for surface, terrain, and parent-chain experiments.",
        path: "/showroom/globe/h-earth/",
        cardinal: "east",
        menu: "mirrorland",
        mirrorlandAligned: true,
        source: "core"
      }),
      room({
        id: "characters",
        title: "Characters / Story Faces",
        publicLabel: "The Portrait Hall",
        publicShortLabel: "Portrait Hall",
        estateRoom: "The Portrait Hall",
        estateSection: "Mirrorland Estate",
        publicSummary: "The hall where the living characters and story faces of Mirrorland are introduced.",
        path: "/characters/",
        cardinal: "east",
        menu: "mirrorland",
        mirrorlandAligned: true,
        source: "core"
      }),
      room({
        id: "nine-summits",
        title: "Nine Summits Universe",
        publicLabel: "The Universe Gallery",
        publicShortLabel: "Universe Gallery",
        estateRoom: "The Universe Gallery",
        estateSection: "Mirrorland Estate",
        publicSummary: "A story-world gallery for Nine Summits, outer context, and the larger universe setting.",
        path: "/nine-summits/universe/",
        cardinal: "east",
        menu: "mirrorland",
        mirrorlandAligned: true,
        source: "core"
      }),
      room({
        id: "frontier",
        title: "Frontier / West Deployment Wing",
        publicLabel: "Frontier Workshop Yard",
        publicShortLabel: "Workshop Yard",
        estateRoom: "Frontier Workshop Yard",
        estateSection: "Mirrorland Grounds",
        publicSummary: "The outdoor testing yard where Audralia’s future systems are tried before they become living-world infrastructure.",
        path: "/explore/frontier/",
        cardinal: "west",
        menu: "mirrorland",
        mirrorlandAligned: true,
        source: "core"
      })
    ];
  }

  function mainCoreRooms() {
    return [
      room({
        id: "compass",
        title: "Compass",
        publicLabel: "Compass",
        estateRoom: "The Compass Desk",
        estateSection: "Main House",
        publicSummary: "Start here when you need ordinary site orientation.",
        path: "/",
        cardinal: "north",
        menu: "main",
        mirrorlandAligned: false,
        source: "core"
      }),
      room({
        id: "door",
        title: "Door",
        publicLabel: "The Front Door",
        estateRoom: "The Front Door",
        estateSection: "Main House",
        publicSummary: "Cross the ordinary entrance threshold.",
        path: "/door/",
        cardinal: "north",
        menu: "main",
        mirrorlandAligned: false,
        source: "core"
      }),
      room({
        id: "home",
        title: "Home",
        publicLabel: "The Hearth",
        estateRoom: "The Hearth",
        estateSection: "Main House",
        publicSummary: "Return to the stable center of the main estate.",
        path: "/home/",
        cardinal: "north",
        menu: "main",
        mirrorlandAligned: false,
        source: "core"
      }),
      room({
        id: "site-guide",
        title: "Site Guide",
        publicLabel: "The Guide Desk",
        estateRoom: "The Guide Desk",
        estateSection: "Main House",
        publicSummary: "Learn how the estate, rooms, lenses, and returns work.",
        path: "/site-guide/",
        cardinal: "north",
        menu: "main",
        mirrorlandAligned: false,
        source: "core"
      }),
      room({
        id: "laws",
        title: "Laws",
        publicLabel: "The Law Library",
        estateRoom: "The Law Library",
        estateSection: "Main House",
        publicSummary: "Study the rules, boundaries, proof, and governing constraints.",
        path: "/laws/",
        cardinal: "south",
        menu: "main",
        mirrorlandAligned: false,
        source: "core"
      }),
      room({
        id: "governance",
        title: "Governance",
        publicLabel: "The Council Room",
        estateRoom: "The Council Room",
        estateSection: "Main House",
        publicSummary: "Enter the decision room for policy, risk, and responsibility.",
        path: "/governance/",
        cardinal: "south",
        menu: "main",
        mirrorlandAligned: false,
        source: "core"
      }),
      room({
        id: "gauges-main",
        title: "Gauges",
        publicLabel: "The Lab",
        estateRoom: "The Lab",
        estateSection: "Main House",
        publicSummary: "Check route truth, readiness, and audit signals.",
        path: "/gauges/",
        cardinal: "south",
        menu: "main",
        mirrorlandAligned: false,
        source: "core"
      }),
      room({
        id: "gauges-h-earth",
        title: "H-Earth Gauges",
        publicLabel: "H-Earth Lab Bench",
        estateRoom: "The Lab",
        estateSection: "Main House",
        publicSummary: "Open the dedicated H-Earth test bench.",
        path: "/gauges/h-earth/",
        cardinal: "south",
        menu: "main",
        mirrorlandAligned: false,
        source: "core"
      }),
      room({
        id: "products",
        title: "Products",
        publicLabel: "The Product Gallery",
        estateRoom: "The Product Gallery",
        estateSection: "Main House",
        publicSummary: "View usable objects, offers, and public-facing extensions.",
        path: "/products/",
        cardinal: "west",
        menu: "main",
        mirrorlandAligned: false,
        source: "core"
      }),
      room({
        id: "meet-sean",
        title: "Meet Sean Mansfield",
        publicLabel: "Meet Sean",
        estateRoom: "The Host Portrait",
        estateSection: "Main House",
        publicSummary: "Meet the human origin, mission, and public voice behind the estate.",
        path: "/about-this-underdog/",
        cardinal: "west",
        menu: "main",
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
      const publicLabel = String(item.publicLabel || item.publicShortLabel || defaultEstateFromPath(item.path || item.href || "/", title));
      const path = normalizePath(item.path || item.href || "/");
      const group = String(item.group || item.family || "");
      const cardinal = item.cardinal
        ? String(item.cardinal).toLowerCase()
        : classifyCardinalFromPathAndTitle(path, publicLabel, group);
      const mirrorlandAligned = item.mirrorlandAligned != null
        ? Boolean(item.mirrorlandAligned)
        : inferMirrorlandAligned(path, title, group);
      const menu = item.menu || (item.mirrorlandDoor || mirrorlandAligned ? "mirrorland" : "main");

      return room({
        id: String(item.id || item.routeId || item.key || `registry-${slug(publicLabel)}-${index}`),
        title,
        publicLabel,
        publicShortLabel: String(item.publicShortLabel || publicLabel),
        estateRoom: String(item.estateRoom || publicLabel),
        estateSection: String(item.estateSection || defaultEstateSection(path, mirrorlandAligned)),
        publicSummary: String(item.publicSummary || item.body || item.description || defaultSummary(path, publicLabel)),
        enterLabel: String(item.enterLabel || "Enter"),
        builderPathNote: String(item.builderPathNote || ""),
        path,
        file: String(item.file || item.target || path.replace(/\/$/, "/index.html")),
        cardinal: CARDINAL_LABELS[cardinal] ? cardinal : classifyCardinalFromPathAndTitle(path, publicLabel, group),
        wing: String(item.wing || item.estateSection || defaultEstateSection(path, mirrorlandAligned)),
        role: String(item.role || "estate-room"),
        menu,
        body: String(item.publicSummary || item.body || item.description || defaultSummary(path, publicLabel)),
        mirrorlandAligned,
        source: "registry"
      });
    });
  }

  function dedupeRooms(rooms) {
    const seen = new Set();
    const output = [];

    rooms.forEach((item) => {
      const key = item.menu + "::" + normalizePath(item.path);
      if (seen.has(key)) return;
      seen.add(key);
      output.push(item);
    });

    return output;
  }

  function mirrorlandRooms() {
    const registryMirrorland = registryRooms()
      .filter((item) => item.mirrorlandAligned && !isRegularWebsitePath(item.path))
      .map((item) => room({ ...item, menu: "mirrorland" }));

    return dedupeRooms(registryMirrorland.concat(mirrorlandCoreRooms()));
  }

  function mainMenuRooms() {
    const registryMain = registryRooms()
      .filter((item) => {
        if (item.mirrorlandAligned) return false;
        if (isMirrorlandCategoryPath(item.path)) return false;
        return true;
      })
      .map((item) => room({ ...item, menu: "main", mirrorlandAligned: false }));

    return dedupeRooms(registryMain.concat(mainCoreRooms()));
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
              title: "Estate Room Language",
              body: "The public map uses room names and real-world estate context. Route paths and file names stay in builder receipts."
            },
            {
              title: "Path Is Not Identity",
              body: "A route address is only where a page is served. It is not automatically the room’s public identity."
            },
            {
              title: "ZIONTS",
              body: "ZIONTS is pronounced Zience. It may be served through the Earth route, but the map presents the public world-door identity."
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
    if (state.activeLens === "main") return "Main Menu";
    if (state.activeLens === "instructions") return "Instructions";
    return "Mirrorland Doors";
  }

  function lensSubtitle() {
    if (state.activeLens === "main") {
      return "Ordinary estate rooms: Compass, Front Door, Hearth, Product Gallery, Law Library, Council Room, Lab, Guide Desk, and Meet Sean.";
    }

    if (state.activeLens === "instructions") {
      return "This map uses estate-room names for visitors. Route paths and file names stay hidden for builders.";
    }

    if (frontierActive()) {
      return "You are near Frontier Workshop Yard, the outdoor testing grounds for Audralia’s future systems.";
    }

    return "Choose an immersive room: The Atrium, The Atlas Study, ZIONTS, Audralia, The Control Room, Frontier Workshop Yard, or story rooms.";
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
    bubble.setAttribute("data-estate-room-language-active", "true");
    bubble.setAttribute("data-main-menu-website-options-only", "true");
    bubble.setAttribute("data-mirrorland-doors-category-only", "true");
    bubble.setAttribute("data-support-does-not-equal-ownership", "true");
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
    overlay.setAttribute("data-estate-room-language-active", "true");
    overlay.setAttribute("data-main-menu-website-options-only", "true");
    overlay.setAttribute("data-mirrorland-doors-category-only", "true");
    overlay.setAttribute("data-support-does-not-equal-ownership", "true");
    overlay.setAttribute("data-mirrorland-portal", "true");
    overlay.setAttribute("data-cardinal-room-map", "true");
    overlay.setAttribute("data-frontier-mirrorland-aligned", "true");
    overlay.setAttribute("aria-label", "Mirrorland estate room map");

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
        data-estate-room="${escapeHtml(item.estateRoom)}"
        data-estate-section="${escapeHtml(item.estateSection)}"
        data-menu="${escapeHtml(item.menu)}"
        data-current="${item.current ? "true" : "false"}"
        data-mirrorland-aligned="${item.mirrorlandAligned ? "true" : "false"}"
        data-path="${escapeHtml(item.path)}"
        data-file="${escapeHtml(item.file)}"
        data-builder-path-note="${escapeHtml(item.builderPathNote)}"
      >
        <span class="dgb-bp-room-door" aria-hidden="true"></span>
        <span class="dgb-bp-room-meta">
          <span class="dgb-bp-room-estate">${escapeHtml(item.estateSection)}</span>
          <strong class="dgb-bp-room-title">${escapeHtml(item.publicLabel)}</strong>
          <span class="dgb-bp-room-summary">${escapeHtml(item.publicSummary)}</span>
          <span class="dgb-bp-room-enter">${escapeHtml(item.enterLabel)}</span>
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
                <span class="dgb-bp-room-estate">${escapeHtml(label.title)}</span>
                <strong class="dgb-bp-room-title">Room Held</strong>
                <span class="dgb-bp-room-summary">No room is assigned here yet.</span>
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
        data-estate-room-language-active="true"
        data-current-room-id="${escapeHtml(summary.currentRoom?.id || "")}"
        data-current-room-label="${escapeHtml(summary.currentRoom?.publicLabel || "")}"
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
    const frontier = frontierActive();

    const locationLabel = mode === "main"
      ? "Main House"
      : frontier
        ? "Mirrorland Grounds"
        : entered
          ? "Inside Mirrorland"
          : "Estate Map Open";

    return `
      <aside class="dgb-bp-panel">
        <div class="dgb-bp-panel-head">
          <b>${mode === "main" ? "Current Room" : "Mirrorland Map"}</b>
          <h3>${escapeHtml(current?.publicLabel || (mode === "main" ? "Main Menu" : "Mirrorland Doors"))}</h3>
          <p>${escapeHtml(current?.publicSummary || (mode === "main" ? "Choose a regular estate room." : "Choose a room inside Mirrorland."))}</p>
        </div>

        <div class="dgb-bp-you-are-here">
          <div class="dgb-bp-location-card">
            <b>${escapeHtml(locationLabel)}</b>
            <strong>${escapeHtml(current?.estateRoom || current?.publicLabel || "Choose a room")}</strong>
            <span>${escapeHtml(current?.estateSection || (mode === "main" ? "Main House" : "Mirrorland Estate"))}</span>
          </div>

          <div class="dgb-bp-chain">
            ${mode === "main" ? `
              <span>Main House</span>
              <span class="dgb-bp-chain-separator">→</span>
              <span>${escapeHtml(current?.publicLabel || "Choose Room")}</span>
            ` : `
              <span>Map Portal</span>
              <span class="dgb-bp-chain-separator">→</span>
              <span>Mirrorland Doors</span>
              <span class="dgb-bp-chain-separator">→</span>
              <span>${escapeHtml(current?.publicLabel || "Choose Room")}</span>
            `}
          </div>

          <div class="dgb-bp-guide-link" aria-label="${mode === "main" ? "Main menu context" : "Mirrorland room context"}">
            ${mode === "main" ? "Website rooms" : "Estate rooms"}
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
            <h3>Choose a room inside the estate</h3>
            <p>The public map uses room names. File paths stay hidden underneath for builders.</p>
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
            <b>Main Menu</b>
            <h3>Regular estate rooms</h3>
            <p>Compass, Front Door, Hearth, Product Gallery, Law Library, Council Room, Lab, Guide Desk, and Meet Sean stay here.</p>
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
    const frontier = frontierActive();

    overlay.innerHTML = `
      <div class="dgb-bp-topbar">
        <div class="dgb-bp-titleblock">
          <div class="dgb-bp-kicker">${state.activeLens === "main" ? "Main House" : state.activeLens === "instructions" ? "Portal Instructions" : "Mirrorland Estate"}</div>
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
          <div class="dgb-bp-current-pill">${state.activeLens === "main" ? "Main House" : frontier ? "Frontier Workshop Yard" : entered ? "Inside Mirrorland" : "Estate Map"}</div>
        </div>

        <div class="dgb-bp-content" data-cardinal-room-map="true" data-map-blip-single-entryway="true" data-estate-room-language-active="true">
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
      mirrorlandClassificationNarrowed: true,
      mainMenuWebsiteOptionsOnly: true,
      mirrorlandDoorsCategoryOnly: true,
      supportDoesNotEqualOwnership: true,
      gaugesMirrorlandAligned: false,
      lawsMirrorlandAligned: false,
      governanceMirrorlandAligned: false,
      productsMirrorlandAligned: false,
      compassSeparated: true,
      pageBodyDirectory: false,

      showroomMirrorland: true,
      planetaryPagesMirrorland: true,
      cockpitPagesMirrorland: true,
      frontierMirrorlandAligned: true,
      frontierBelongsToMirrorland: true,
      frontierCardinalDisposition: "west",
      frontierRoom: "Frontier Workshop Yard",
      narrativePagesMirrorland: true,
      charactersMirrorland: true,
      nineSummitsMirrorland: true,

      mirrorlandPortalActive: true,
      roomMapActive: true,
      cardinalRoomMap: true,
      floatingNodesReplaced: true,
      blueprintRoomsClickable: true,
      cardinalDispositionActive: true,

      mirrorlandEntered: mirrorlandEntered(),
      mirrorlandMenuDefault: true,
      mirrorlandMenuAvailable: true,
      mirrorlandMenuLabel: "Mirrorland Doors",
      mainMenuAvailable: true,
      websiteOptionsSeparated: true,
      instructionsAvailable: true,
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
      currentPublicLabel: current?.publicLabel || "",
      currentEstateRoom: current?.estateRoom || "",
      currentEstateSection: current?.estateSection || "",
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

      document.documentElement.dataset.manorBlueprintEstateRoomLanguageActive = "true";
      document.documentElement.dataset.manorBlueprintPublicLabelsBound = "true";
      document.documentElement.dataset.manorBlueprintRoutePathHiddenFromPublicCards = "true";
      document.documentElement.dataset.manorBlueprintBuilderMetadataHidden = "true";
      document.documentElement.dataset.manorBlueprintZiontsPublicIdentityBound = "true";
      document.documentElement.dataset.manorBlueprintZiontsPronunciation = "Zience";
      document.documentElement.dataset.manorBlueprintLabPublicLabelBound = "true";
      document.documentElement.dataset.manorBlueprintFrontierWorkshopYardBound = "true";

      document.documentElement.dataset.manorBlueprintMapBlipSingleEntryway = "true";
      document.documentElement.dataset.manorBlueprintMirrorlandEntryway = "map-portal-blip";
      document.documentElement.dataset.manorBlueprintMainMenuWebsiteOptionsOnly = "true";
      document.documentElement.dataset.manorBlueprintMirrorlandDoorsCategoryOnly = "true";
      document.documentElement.dataset.manorBlueprintSupportDoesNotEqualOwnership = "true";
      document.documentElement.dataset.manorBlueprintGaugesMirrorlandAligned = "false";
      document.documentElement.dataset.manorBlueprintFrontierMirrorlandAligned = "true";
      document.documentElement.dataset.manorBlueprintNarrativePagesMirrorland = "true";
      document.documentElement.dataset.manorBlueprintCompassSeparated = "true";
      document.documentElement.dataset.manorBlueprintPageBodyDirectory = "false";

      document.documentElement.dataset.manorBlueprintMirrorlandPortalActive = "true";
      document.documentElement.dataset.manorBlueprintRoomMapActive = "true";
      document.documentElement.dataset.manorBlueprintCardinalRoomMap = "true";
      document.documentElement.dataset.manorBlueprintFloatingNodesReplaced = "true";
      document.documentElement.dataset.manorBlueprintRoomsClickable = "true";
      document.documentElement.dataset.manorBlueprintCardinalDispositionActive = "true";

      document.documentElement.dataset.manorBlueprintMirrorlandMenuLabel = "Mirrorland Doors";
      document.documentElement.dataset.manorBlueprintWebsiteOptionsSeparated = "true";
      document.documentElement.dataset.manorBlueprintDualMenuActive = "true";

      document.documentElement.dataset.manorBlueprintJoystickScrollForceProfile = JOYSTICK_SCROLL_FORCE_PROFILE;
      document.documentElement.dataset.manorBlueprintJoystickMinScrollSpeed = String(MIN_SCROLL_SPEED);
      document.documentElement.dataset.manorBlueprintJoystickMaxScrollSpeed = String(MAX_SCROLL_SPEED);
      document.documentElement.dataset.manorBlueprintJoystickScrollForceMultiplier = String(JOYSTICK_SCROLL_FORCE_MULTIPLIER);

      document.documentElement.dataset.manorBlueprintActiveLens = state.activeLens;
      document.documentElement.dataset.manorBlueprintCurrentRoom = payload.currentRoomId;
      document.documentElement.dataset.manorBlueprintCurrentPublicLabel = payload.currentPublicLabel;
      document.documentElement.dataset.manorBlueprintCurrentEstateRoom = payload.currentEstateRoom;
      document.documentElement.dataset.manorBlueprintCurrentEstateSection = payload.currentEstateSection;
      document.documentElement.dataset.manorBlueprintCurrentRoomCardinal = payload.currentRoomCardinal;
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
      mainMenuWebsiteOptionsOnly: true,
      mirrorlandDoorsCategoryOnly: true,
      supportDoesNotEqualOwnership: true,
      gaugesMirrorlandAligned: false,
      frontierMirrorlandAligned: true,
      narrativePagesMirrorland: true,
      compassSeparated: true,

      mirrorlandPortalActive: true,
      roomMapActive: true,
      cardinalRoomMap: true,
      floatingNodesReplaced: true,
      blueprintRoomsClickable: true,
      cardinalDispositionActive: true,

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

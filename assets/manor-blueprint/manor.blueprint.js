// TARGET FILE: /assets/manor-blueprint/manor.blueprint.js
// TNT FULL-FILE REPLACEMENT
// MANOR_BLUEPRINT_FIXED_DRAGGABLE_BUBBLE_FULLSCREEN_MAP_INSTRUCTIONS_TOGGLE_JS_TNT_v1
//
// Manor Blueprint HUD behavior.
// Owns fixed draggable bubble, full-screen overlay, Map / Instructions toggle,
// current-route rendering, drag/click separation, localStorage position memory,
// viewport clamping, accessibility behavior, API/status publication.
//
// Does not own route truth, CSS design, page content, page layout rewrites,
// planet canvas files, Gauges logic, image generation, GraphicBox, WebGL,
// canvas map engine, or per-page custom code.

(() => {
  "use strict";

  if (typeof window === "undefined" || typeof document === "undefined") return;

  const CONTRACT = "MANOR_BLUEPRINT_FIXED_DRAGGABLE_BUBBLE_FULLSCREEN_MAP_INSTRUCTIONS_TOGGLE_JS_TNT_v1";
  const REGISTRY_CONTRACT = "MANOR_BLUEPRINT_ROUTE_REGISTRY_TNT_v1";
  const CSS_CONTRACT = "MANOR_BLUEPRINT_FIXED_BUBBLE_FULLSCREEN_OVERLAY_CSS_TNT_v1";

  const API_GLOBAL = "DGB_MANOR_BLUEPRINT_API";
  const STATUS_GLOBAL = "DGB_MANOR_BLUEPRINT_STATUS";
  const RECEIPT_GLOBAL = "DGB_MANOR_BLUEPRINT_RECEIPT";
  const CONTROLLER_GLOBAL = "__DGB_MANOR_BLUEPRINT_CONTROLLER__";

  const STORAGE_KEY = "DGB_MANOR_BLUEPRINT_BUBBLE_POSITION_v1";
  const DEFAULT_LENS_KEY = "DGB_MANOR_BLUEPRINT_ACTIVE_LENS_v1";
  const DRAG_THRESHOLD = 8;
  const SAFE_OFFSET = 16;

  if (
    window[API_GLOBAL] &&
    window[API_GLOBAL].contract === CONTRACT &&
    typeof window[API_GLOBAL].refresh === "function"
  ) {
    try {
      window[API_GLOBAL].refresh();
    } catch (_error) {}
    return;
  }

  if (
    window[CONTROLLER_GLOBAL] &&
    typeof window[CONTROLLER_GLOBAL].stop === "function"
  ) {
    try {
      window[CONTROLLER_GLOBAL].stop();
    } catch (_error) {}
  }

  const fallbackRoutes = Object.freeze([
    Object.freeze({
      routeId: "compass",
      path: "/",
      title: "Compass",
      shortTitle: "Compass",
      group: "Core Manor",
      wing: "Entry Field",
      type: "root",
      parent: "",
      children: ["/showroom/", "/laws/", "/gauges/"],
      nearby: ["/showroom/", "/laws/", "/gauges/"],
      description: "The main orientation point for the Manor and Estate.",
      keywords: ["compass", "home", "root", "navigation"],
      mapX: 50,
      mapY: 14,
      status: "active",
      priority: 100,
      showInBlueprint: true
    }),
    Object.freeze({
      routeId: "showroom",
      path: "/showroom/",
      title: "Showroom",
      shortTitle: "Showroom",
      group: "Showroom",
      wing: "Showroom Hall",
      type: "showroom-hub",
      parent: "/",
      children: ["/showroom/globe/"],
      nearby: ["/", "/showroom/globe/", "/gauges/"],
      description: "The display wing for major visual and interactive systems.",
      keywords: ["showroom", "display", "gallery"],
      mapX: 68,
      mapY: 34,
      status: "active",
      priority: 94,
      showInBlueprint: true
    }),
    Object.freeze({
      routeId: "globe-showcase",
      path: "/showroom/globe/",
      title: "Globe Showcase",
      shortTitle: "Globe",
      group: "Showroom Globe",
      wing: "Planet Hall",
      type: "globe-hub",
      parent: "/showroom/",
      children: ["/showroom/globe/audralia/"],
      nearby: ["/showroom/", "/showroom/globe/audralia/", "/gauges/"],
      description: "Gateway into the planet and globe inspection routes.",
      keywords: ["globe", "planet", "showcase"],
      mapX: 70,
      mapY: 44,
      status: "active",
      priority: 93,
      showInBlueprint: true
    }),
    Object.freeze({
      routeId: "audralia",
      path: "/showroom/globe/audralia/",
      title: "Audralia",
      shortTitle: "Audralia",
      group: "Showroom Globe",
      wing: "Audralia Wing",
      type: "planet-hub",
      parent: "/showroom/globe/",
      children: ["/showroom/globe/audralia/planet/", "/showroom/globe/audralia/disposition/"],
      nearby: ["/showroom/globe/", "/showroom/globe/audralia/planet/", "/gauges/"],
      description: "Audralia planet hub and Mirrorland world route.",
      keywords: ["audralia", "mirrorland", "planet"],
      mapX: 70,
      mapY: 54,
      status: "active",
      priority: 98,
      showInBlueprint: true
    }),
    Object.freeze({
      routeId: "audralia-planet",
      path: "/showroom/globe/audralia/planet/",
      title: "Audralia Planet",
      shortTitle: "Planet",
      group: "Showroom Globe",
      wing: "Audralia Wing",
      type: "planet-screen",
      parent: "/showroom/globe/audralia/",
      children: [],
      nearby: ["/showroom/globe/audralia/", "/showroom/globe/audralia/disposition/", "/showroom/globe/", "/gauges/"],
      description: "Audralia future-body screen and planet inspection route.",
      keywords: ["audralia", "planet", "future body", "renderplex"],
      mapX: 78,
      mapY: 58,
      status: "active",
      priority: 99,
      showInBlueprint: true
    }),
    Object.freeze({
      routeId: "gauges",
      path: "/gauges/",
      title: "Gauges / Triple G",
      shortTitle: "Gauges",
      group: "Audit Wing",
      wing: "Triple G",
      type: "audit-hub",
      parent: "/",
      children: [],
      nearby: ["/", "/showroom/globe/", "/laws/"],
      description: "Audit and proof surface for route status and readiness signals.",
      keywords: ["gauges", "triple g", "audit", "proof"],
      mapX: 48,
      mapY: 78,
      status: "active",
      priority: 95,
      showInBlueprint: true
    })
  ]);

  const fallbackTerms = Object.freeze([
    Object.freeze({
      termId: "floating-bubble",
      title: "Floating Bubble",
      shortTitle: "Bubble",
      description: "The bubble stays on screen as you scroll. Drag it out of the way if it covers text. Tap it to open the Manor Blueprint."
    }),
    Object.freeze({
      termId: "you-are-here",
      title: "You Are Here",
      shortTitle: "You Are Here",
      description: "Shows the current route and where it sits inside the Manor / Estate structure."
    }),
    Object.freeze({
      termId: "return-to-orbit",
      title: "Return to Orbit",
      shortTitle: "Return",
      description: "Return to Orbit sends you back to the parent inspection field or route hub for the section you are reading."
    }),
    Object.freeze({
      termId: "route-map",
      title: "Route Map",
      shortTitle: "Route Map",
      description: "The Route Map is the page-level movement menu."
    }),
    Object.freeze({
      termId: "gems",
      title: "Gems",
      shortTitle: "Gems",
      description: "Gems are visual route instruments. They may open rooms, chambers, routes, or inspection areas."
    }),
    Object.freeze({
      termId: "inspection-chambers",
      title: "Inspection Chambers",
      shortTitle: "Chambers",
      description: "Chambers are expandable sections that organize deeper page content."
    }),
    Object.freeze({
      termId: "platform-engineering",
      title: "Platform / Engineering Lens",
      shortTitle: "Lenses",
      description: "Platform language explains the idea for general visitors. Engineering language explains the same structure in system, route, runtime, or proof terms."
    }),
    Object.freeze({
      termId: "gauges-triple-g",
      title: "Gauges / Triple G",
      shortTitle: "Gauges",
      description: "Gauges are proof and audit surfaces. They show route status, checks, and readiness signals."
    }),
    Object.freeze({
      termId: "receipt-dock",
      title: "Receipt Dock",
      shortTitle: "Receipt",
      description: "Receipt Dock shows status, contract, and no-false-claim proof."
    }),
    Object.freeze({
      termId: "blueprint-map",
      title: "Blueprint Map",
      shortTitle: "Blueprint",
      description: "The Blueprint Map lets you move across the Manor without needing to understand every route name first."
    })
  ]);

  const state = {
    registry: null,
    registryAvailable: false,
    bubble: null,
    overlay: null,
    closeButton: null,
    mapTab: null,
    instructionsTab: null,
    mapLens: null,
    instructionsLens: null,
    searchInput: null,
    previousFocus: null,

    overlayOpen: false,
    activeLens: readStoredLens(),
    currentPath: normalizePath(window.location.pathname || "/"),
    currentRoute: null,
    currentSummary: null,

    dragging: false,
    pointerActive: false,
    pointerId: null,
    startPointerX: 0,
    startPointerY: 0,
    startBubbleX: 0,
    startBubbleY: 0,
    currentBubbleX: 0,
    currentBubbleY: 0,
    movedDistance: 0,

    bubbleMounted: false,
    overlayMounted: false,
    stopped: false,
    lastAction: "boot",
    errors: [],
    listeners: []
  };

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

  function safeText(value) {
    return String(value == null ? "" : value);
  }

  function esc(value) {
    return safeText(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function setDataset(key, value) {
    try {
      document.documentElement.dataset[key] = String(value);
    } catch (_error) {}
  }

  function addListener(target, type, handler, options) {
    if (!target || typeof target.addEventListener !== "function") return;
    target.addEventListener(type, handler, options);
    state.listeners.push({ target, type, handler, options });
  }

  function removeAllListeners() {
    for (const item of state.listeners) {
      try {
        item.target.removeEventListener(item.type, item.handler, item.options);
      } catch (_error) {}
    }
    state.listeners = [];
  }

  function recordError(scope, error) {
    const message = error && error.message ? error.message : String(error || "unknown");
    state.errors.push({
      scope,
      message,
      time: new Date().toISOString()
    });
    state.lastAction = "error:" + scope;
    publishStatus();
  }

  function readStoredLens() {
    try {
      const stored = window.localStorage.getItem(DEFAULT_LENS_KEY);
      return stored === "instructions" ? "instructions" : "map";
    } catch (_error) {
      return "map";
    }
  }

  function storeLens(lens) {
    try {
      window.localStorage.setItem(DEFAULT_LENS_KEY, lens);
    } catch (_error) {}
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

      return {
        x,
        y,
        viewportWidth: Number(parsed.viewportWidth) || window.innerWidth,
        viewportHeight: Number(parsed.viewportHeight) || window.innerHeight,
        timestamp: parsed.timestamp || ""
      };
    } catch (_error) {
      return null;
    }
  }

  function storePosition(x, y) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        x: Math.round(x),
        y: Math.round(y),
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        timestamp: new Date().toISOString()
      }));
    } catch (_error) {}
  }

  function clampPosition(x, y) {
    const bubble = state.bubble;
    const rect = bubble ? bubble.getBoundingClientRect() : { width: 72, height: 72 };
    const width = rect.width || 72;
    const height = rect.height || 72;
    const maxX = Math.max(SAFE_OFFSET, window.innerWidth - width - SAFE_OFFSET);
    const maxY = Math.max(SAFE_OFFSET, window.innerHeight - height - SAFE_OFFSET);

    return {
      x: Math.max(SAFE_OFFSET, Math.min(maxX, Number(x) || SAFE_OFFSET)),
      y: Math.max(SAFE_OFFSET, Math.min(maxY, Number(y) || SAFE_OFFSET))
    };
  }

  function applyBubblePosition(x, y, save = false) {
    if (!state.bubble) return;

    const clamped = clampPosition(x, y);
    state.currentBubbleX = clamped.x;
    state.currentBubbleY = clamped.y;

    state.bubble.style.left = clamped.x + "px";
    state.bubble.style.top = clamped.y + "px";
    state.bubble.style.right = "auto";
    state.bubble.style.bottom = "auto";

    if (save) storePosition(clamped.x, clamped.y);
    publishStatus();
  }

  function resetBubblePosition() {
    if (!state.bubble) return status();

    const rect = state.bubble.getBoundingClientRect();
    const x = window.innerWidth - (rect.width || 72) - SAFE_OFFSET;
    const y = window.innerHeight - (rect.height || 72) - SAFE_OFFSET;

    applyBubblePosition(x, y, true);
    state.lastAction = "reset-bubble-position";
    publishStatus();
    return status();
  }

  function resolveRegistry() {
    const registry = window.DGB_MANOR_BLUEPRINT_REGISTRY;

    if (registry && typeof registry === "object" && Array.isArray(registry.routes)) {
      state.registry = registry;
      state.registryAvailable = true;
      return registry;
    }

    state.registryAvailable = false;

    const fallbackApi = {
      contract: "MANOR_BLUEPRINT_FALLBACK_REGISTRY_v1",
      routes: fallbackRoutes,
      navigationTerms: fallbackTerms,
      normalizePath,
      currentRoute() {
        return nearestRouteFallback(window.location.pathname || "/");
      },
      routeSummary(path) {
        return routeSummaryFallback(path);
      },
      routesByGroup() {
        return routesByGroupFallback();
      },
      searchRoutes(query) {
        return searchRoutesFallback(query);
      }
    };

    state.registry = fallbackApi;
    return fallbackApi;
  }

  function routes() {
    const registry = state.registry || resolveRegistry();
    return Array.isArray(registry.routes) ? registry.routes : fallbackRoutes;
  }

  function terms() {
    const registry = state.registry || resolveRegistry();

    if (Array.isArray(registry.navigationTerms)) return registry.navigationTerms;
    if (Array.isArray(window.DGB_MANOR_BLUEPRINT_NAVIGATION_TERMS)) {
      return window.DGB_MANOR_BLUEPRINT_NAVIGATION_TERMS;
    }

    return fallbackTerms;
  }

  function routeByPathFallback(path) {
    const normalized = normalizePath(path);
    return routes().find((item) => normalizePath(item.path) === normalized) || null;
  }

  function nearestRouteFallback(path) {
    const normalized = normalizePath(path);
    const exact = routeByPathFallback(normalized);
    if (exact) return exact;

    const candidates = routes()
      .filter((item) => normalizePath(item.path) !== "/" && normalized.startsWith(normalizePath(item.path)))
      .sort((a, b) => normalizePath(b.path).length - normalizePath(a.path).length || (b.priority || 0) - (a.priority || 0));

    return candidates[0] || routeByPathFallback("/") || routes()[0] || null;
  }

  function childrenOfFallback(path) {
    const route = nearestRouteFallback(path);
    if (!route) return [];

    return (route.children || [])
      .map(routeByPathFallback)
      .filter(Boolean)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0) || safeText(a.title).localeCompare(safeText(b.title)));
  }

  function nearbyForFallback(path) {
    const route = nearestRouteFallback(path);
    if (!route) return [];

    const parent = route.parent ? routeByPathFallback(route.parent) : null;
    const children = childrenOfFallback(route.path);
    const nearby = (route.nearby || []).map(routeByPathFallback).filter(Boolean);

    const seen = new Set();
    return [parent, ...children, ...nearby]
      .filter(Boolean)
      .filter((item) => {
        const key = normalizePath(item.path);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => (b.priority || 0) - (a.priority || 0) || safeText(a.title).localeCompare(safeText(b.title)));
  }

  function parentChainFallback(path) {
    const chain = [];
    let current = nearestRouteFallback(path);
    const seen = new Set();

    while (current && current.parent && !seen.has(normalizePath(current.path))) {
      seen.add(normalizePath(current.path));
      const parent = routeByPathFallback(current.parent);
      if (!parent) break;
      chain.unshift(parent);
      current = parent;
    }

    const route = nearestRouteFallback(path);
    if (route && !chain.some((item) => normalizePath(item.path) === normalizePath(route.path))) {
      chain.push(route);
    }

    return chain;
  }

  function routeSummaryFallback(path) {
    const route = nearestRouteFallback(path);

    return {
      found: Boolean(route),
      route,
      chain: route ? parentChainFallback(route.path) : [],
      children: route ? childrenOfFallback(route.path) : [],
      nearby: route ? nearbyForFallback(route.path) : []
    };
  }

  function routesByGroupFallback() {
    const groups = {};

    for (const item of routes()) {
      if (item.showInBlueprint === false) continue;
      const group = item.group || "Other";
      if (!groups[group]) groups[group] = [];
      groups[group].push(item);
    }

    for (const key of Object.keys(groups)) {
      groups[key] = groups[key].sort((a, b) => (b.priority || 0) - (a.priority || 0) || safeText(a.title).localeCompare(safeText(b.title)));
    }

    return groups;
  }

  function searchRoutesFallback(query) {
    const q = safeText(query).trim().toLowerCase();

    if (!q) {
      return routes()
        .filter((item) => item.showInBlueprint !== false)
        .sort((a, b) => (b.priority || 0) - (a.priority || 0));
    }

    return routes()
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
      .sort((a, b) => (b.priority || 0) - (a.priority || 0) || safeText(a.title).localeCompare(safeText(b.title)));
  }

  function getRouteSummary(path) {
    const registry = state.registry || resolveRegistry();

    try {
      if (registry && typeof registry.routeSummary === "function") {
        const summary = registry.routeSummary(path);
        if (summary && summary.route) return summary;
      }
    } catch (_error) {}

    return routeSummaryFallback(path);
  }

  function getRoutesByGroup() {
    const registry = state.registry || resolveRegistry();

    try {
      if (registry && typeof registry.routesByGroup === "function") {
        const groups = registry.routesByGroup();
        if (groups && typeof groups === "object") return groups;
      }
    } catch (_error) {}

    return routesByGroupFallback();
  }

  function searchRoutes(query) {
    const registry = state.registry || resolveRegistry();

    try {
      if (registry && typeof registry.searchRoutes === "function") {
        const result = registry.searchRoutes(query);
        if (Array.isArray(result)) return result;
      }
    } catch (_error) {}

    return searchRoutesFallback(query);
  }

  function updateCurrentRoute() {
    state.currentPath = normalizePath(window.location.pathname || "/");
    state.currentSummary = getRouteSummary(state.currentPath);
    state.currentRoute = state.currentSummary.route || nearestRouteFallback(state.currentPath);

    setDataset("manorBlueprintCurrentRoute", state.currentRoute ? state.currentRoute.routeId : "");
    return state.currentRoute;
  }

  function routeHref(path) {
    return normalizePath(path || "/");
  }

  function markerText(route) {
    const title = safeText(route.shortTitle || route.title || "?");
    const words = title.split(/\s+/).filter(Boolean);
    if (!words.length) return "?";
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  function routeCard(route, currentPath) {
    if (!route) return "";

    const isCurrent = normalizePath(route.path) === normalizePath(currentPath);

    return `
      <a class="dgb-bp-route-card" href="${esc(routeHref(route.path))}" data-current="${isCurrent ? "true" : "false"}">
        <span class="dgb-bp-route-marker" aria-hidden="true">${esc(markerText(route))}</span>
        <span class="dgb-bp-route-copy">
          <strong>${esc(route.title || route.shortTitle || route.path)}</strong>
          <span>${esc(route.description || route.group || "")}</span>
          <code>${esc(route.path || "")}</code>
        </span>
        <span class="dgb-bp-route-badge">${esc(route.wing || route.group || route.type || "Route")}</span>
      </a>
    `;
  }

  function mapNode(route, currentPath) {
    if (!route || route.showInBlueprint === false) return "";

    const x = Number.isFinite(Number(route.mapX)) ? Number(route.mapX) : 50;
    const y = Number.isFinite(Number(route.mapY)) ? Number(route.mapY) : 50;
    const isCurrent = normalizePath(route.path) === normalizePath(currentPath);

    return `
      <a
        class="dgb-bp-map-node"
        href="${esc(routeHref(route.path))}"
        data-current="${isCurrent ? "true" : "false"}"
        style="--bp-x:${esc(x)};--bp-y:${esc(y)}"
      >
        <b>${esc(route.group || "Route")}</b>
        <strong>${esc(route.shortTitle || route.title || route.path)}</strong>
        <span>${esc(route.wing || route.type || "")}</span>
      </a>
    `;
  }

  function chainMarkup(chain) {
    if (!Array.isArray(chain) || !chain.length) {
      return `<span>Unknown Route</span>`;
    }

    return chain.map((route, index) => {
      const item = `<a href="${esc(routeHref(route.path))}">${esc(route.shortTitle || route.title || route.path)}</a>`;
      if (index === chain.length - 1) return item;
      return item + `<span class="dgb-bp-chain-separator" aria-hidden="true">→</span>`;
    }).join("");
  }

  function routeSection(title, routesList, currentPath) {
    const items = Array.isArray(routesList) ? routesList.filter(Boolean) : [];

    return `
      <section class="dgb-bp-route-section">
        <div class="dgb-bp-section-title">
          <span>${esc(title)}</span>
          <span>${items.length}</span>
        </div>
        <div class="dgb-bp-route-list">
          ${items.length ? items.map((item) => routeCard(item, currentPath)).join("") : `<div class="dgb-bp-empty">No routes listed here yet.</div>`}
        </div>
      </section>
    `;
  }

  function renderMapLens(query = "") {
    updateCurrentRoute();

    if (!state.mapLens) return;

    const summary = state.currentSummary || getRouteSummary(state.currentPath);
    const route = summary.route || state.currentRoute;
    const chain = summary.chain || [];
    const children = summary.children || [];
    const nearby = summary.nearby || [];
    const grouped = getRoutesByGroup();
    const searched = searchRoutes(query);
    const currentPath = route ? route.path : state.currentPath;

    const groupsMarkup = query
      ? routeSection("Search Results", searched, currentPath)
      : Object.keys(grouped).map((groupName) => routeSection(groupName, grouped[groupName], currentPath)).join("");

    state.mapLens.innerHTML = `
      <div class="dgb-bp-map-grid">
        <aside class="dgb-bp-panel">
          <div class="dgb-bp-panel-head">
            <b>You Are Here</b>
            <h3>${esc(route ? route.title : "Unknown Route")}</h3>
            <p>${esc(route ? route.description : "This route is not registered yet. The Blueprint is using fallback orientation.")}</p>
          </div>

          <div class="dgb-bp-you-are-here">
            <div class="dgb-bp-location-card">
              <b>Current Location</b>
              <strong>${esc(route ? route.shortTitle || route.title : "Unknown")}</strong>
              <code>${esc(state.currentPath)}</code>
              <span>${esc(route ? `${route.group || "Route"} · ${route.wing || route.type || "Manor"}` : "Fallback location")}</span>
            </div>

            <div>
              <div class="dgb-bp-section-title"><span>Route Path</span></div>
              <div class="dgb-bp-chain">${chainMarkup(chain)}</div>
            </div>

            ${routeSection("Nearby / Related", nearby, currentPath)}
            ${routeSection("Child Routes", children, currentPath)}
          </div>
        </aside>

        <section class="dgb-bp-panel">
          <div class="dgb-bp-panel-head">
            <b>Manor Blueprint</b>
            <h3>Map and Room List</h3>
            <p>The map shows the current route, nearby rooms, and the broader Manor structure.</p>
          </div>

          <div class="dgb-bp-route-tools">
            <label class="dgb-bp-sr-only" for="dgb-blueprint-search">Search rooms and routes</label>
            <input
              id="dgb-blueprint-search"
              class="dgb-bp-search"
              type="search"
              placeholder="Search rooms, routes, wings, or tools..."
              value="${esc(query)}"
              data-dgb-blueprint-search
            >

            <div class="dgb-bp-blueprint-field" aria-label="Blueprint route field">
              ${routes().filter((item) => item.showInBlueprint !== false).map((item) => mapNode(item, currentPath)).join("")}
            </div>

            ${groupsMarkup}
          </div>
        </section>
      </div>
    `;

    state.searchInput = state.mapLens.querySelector("[data-dgb-blueprint-search]");

    if (state.searchInput) {
      addListener(state.searchInput, "input", () => {
        renderMapLens(state.searchInput.value || "");
        setTimeout(() => {
          const nextSearch = state.mapLens && state.mapLens.querySelector("[data-dgb-blueprint-search]");
          if (nextSearch) {
            nextSearch.focus();
            const length = nextSearch.value.length;
            try {
              nextSearch.setSelectionRange(length, length);
            } catch (_error) {}
          }
        }, 0);
      });
    }
  }

  function renderInstructionsLens() {
    if (!state.instructionsLens) return;

    const instructionCards = terms().map((term, index) => `
      <article class="dgb-bp-instruction-card">
        <b>${esc(String(index + 1).padStart(2, "0"))}</b>
        <h3>${esc(term.title || term.shortTitle || "Navigation Term")}</h3>
        <p>${esc(term.description || "")}</p>
      </article>
    `).join("");

    state.instructionsLens.innerHTML = `
      <div class="dgb-bp-panel">
        <div class="dgb-bp-panel-head">
          <b>Instructions</b>
          <h3>How to Navigate the Manor</h3>
          <p>This lens explains the site controls, route grammar, and proof surfaces without leaving the current page.</p>
        </div>

        <div class="dgb-bp-route-tools">
          <div class="dgb-bp-instructions-grid">
            ${instructionCards}
          </div>

          <a class="dgb-bp-guide-link" href="/site-guide/">
            Open Full Site Guide
          </a>
        </div>
      </div>
    `;
  }

  function renderOverlayShell() {
    if (!state.overlay) return;

    state.overlay.innerHTML = `
      <div class="dgb-bp-topbar">
        <div class="dgb-bp-titleblock">
          <span class="dgb-bp-kicker">Manor Blueprint HUD</span>
          <h2 id="dgb-blueprint-title" class="dgb-bp-title">Map and Instructions</h2>
          <p class="dgb-bp-subtitle">Open the Manor map, locate your route, and learn the site’s navigation controls.</p>
        </div>

        <button class="dgb-bp-close" type="button" aria-label="Close Manor Blueprint" data-dgb-blueprint-close>×</button>
      </div>

      <div class="dgb-bp-main">
        <div class="dgb-bp-tabs">
          <div class="dgb-bp-tablist" role="tablist" aria-label="Blueprint lenses">
            <button class="dgb-bp-tab" type="button" role="tab" aria-selected="true" data-dgb-blueprint-lens-tab="map">Map</button>
            <button class="dgb-bp-tab" type="button" role="tab" aria-selected="false" data-dgb-blueprint-lens-tab="instructions">Instructions</button>
          </div>

          <div class="dgb-bp-current-pill" data-dgb-blueprint-current-pill>
            You Are Here
          </div>
        </div>

        <div class="dgb-bp-content">
          <section class="dgb-bp-lens" role="tabpanel" data-dgb-blueprint-lens="map"></section>
          <section class="dgb-bp-lens" role="tabpanel" data-dgb-blueprint-lens="instructions" hidden></section>
        </div>
      </div>
    `;

    state.closeButton = state.overlay.querySelector("[data-dgb-blueprint-close]");
    state.mapTab = state.overlay.querySelector('[data-dgb-blueprint-lens-tab="map"]');
    state.instructionsTab = state.overlay.querySelector('[data-dgb-blueprint-lens-tab="instructions"]');
    state.mapLens = state.overlay.querySelector('[data-dgb-blueprint-lens="map"]');
    state.instructionsLens = state.overlay.querySelector('[data-dgb-blueprint-lens="instructions"]');

    if (state.closeButton) {
      addListener(state.closeButton, "click", close);
    }

    if (state.mapTab) {
      addListener(state.mapTab, "click", () => setLens("map"));
    }

    if (state.instructionsTab) {
      addListener(state.instructionsTab, "click", () => setLens("instructions"));
    }

    renderMapLens("");
    renderInstructionsLens();
    setLens(state.activeLens, false);
  }

  function updateCurrentPill() {
    const pill = state.overlay && state.overlay.querySelector("[data-dgb-blueprint-current-pill]");
    if (!pill) return;

    const route = state.currentRoute || updateCurrentRoute();

    pill.textContent = route
      ? `You Are Here · ${route.shortTitle || route.title}`
      : "You Are Here";
  }

  function setLens(lens, save = true) {
    const next = lens === "instructions" ? "instructions" : "map";
    state.activeLens = next;

    if (state.mapLens) state.mapLens.hidden = next !== "map";
    if (state.instructionsLens) state.instructionsLens.hidden = next !== "instructions";

    if (state.mapTab) {
      state.mapTab.setAttribute("aria-selected", next === "map" ? "true" : "false");
      state.mapTab.dataset.active = next === "map" ? "true" : "false";
    }

    if (state.instructionsTab) {
      state.instructionsTab.setAttribute("aria-selected", next === "instructions" ? "true" : "false");
      state.instructionsTab.dataset.active = next === "instructions" ? "true" : "false";
    }

    if (save) storeLens(next);

    setDataset("manorBlueprintLens", next);
    state.lastAction = "set-lens:" + next;
    publishStatus();

    return status();
  }

  function createBubble() {
    let bubble = document.querySelector("[data-dgb-blueprint-bubble]");

    if (!bubble) {
      bubble = document.createElement("button");
      bubble.type = "button";
      bubble.className = "dgb-blueprint-bubble";
      bubble.setAttribute("aria-label", "Open Manor Blueprint");
      bubble.setAttribute("data-dgb-blueprint-bubble", "");
      bubble.setAttribute("data-contract", CONTRACT);
      bubble.innerHTML = `
        <span class="dgb-blueprint-bubble-label">
          <strong>Map</strong>
          <span>HUD</span>
        </span>
      `;
      document.body.appendChild(bubble);
    } else {
      bubble.setAttribute("data-contract", CONTRACT);
      bubble.setAttribute("aria-label", "Open Manor Blueprint");
    }

    state.bubble = bubble;
    state.bubbleMounted = true;

    bindBubblePointer();

    setTimeout(() => {
      const saved = readStoredPosition();
      if (saved) {
        applyBubblePosition(saved.x, saved.y, false);
      } else {
        resetBubblePosition();
      }
    }, 0);
  }

  function createOverlay() {
    let overlay = document.querySelector("[data-dgb-blueprint-overlay]");

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "dgb-blueprint-overlay";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.setAttribute("aria-labelledby", "dgb-blueprint-title");
      overlay.setAttribute("data-dgb-blueprint-overlay", "");
      overlay.setAttribute("data-contract", CONTRACT);
      overlay.setAttribute("data-open", "false");
      overlay.hidden = true;
      document.body.appendChild(overlay);
    } else {
      overlay.className = "dgb-blueprint-overlay";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.setAttribute("aria-labelledby", "dgb-blueprint-title");
      overlay.setAttribute("data-contract", CONTRACT);
    }

    state.overlay = overlay;
    state.overlayMounted = true;

    renderOverlayShell();
  }

  function bindBubblePointer() {
    if (!state.bubble) return;

    addListener(state.bubble, "pointerdown", (event) => {
      if (state.stopped) return;

      state.pointerActive = true;
      state.dragging = false;
      state.pointerId = event.pointerId;
      state.startPointerX = event.clientX;
      state.startPointerY = event.clientY;
      state.movedDistance = 0;

      const rect = state.bubble.getBoundingClientRect();
      state.startBubbleX = rect.left;
      state.startBubbleY = rect.top;
      state.currentBubbleX = rect.left;
      state.currentBubbleY = rect.top;

      state.bubble.dataset.dragging = "false";

      try {
        state.bubble.setPointerCapture(event.pointerId);
      } catch (_error) {}

      event.preventDefault();
    }, { passive: false });

    addListener(state.bubble, "pointermove", (event) => {
      if (!state.pointerActive || state.pointerId !== event.pointerId) return;

      const dx = event.clientX - state.startPointerX;
      const dy = event.clientY - state.startPointerY;
      state.movedDistance = Math.sqrt(dx * dx + dy * dy);

      if (state.movedDistance > DRAG_THRESHOLD) {
        state.dragging = true;
        state.bubble.dataset.dragging = "true";
      }

      if (state.dragging) {
        applyBubblePosition(state.startBubbleX + dx, state.startBubbleY + dy, false);
      }

      event.preventDefault();
    }, { passive: false });

    const release = (event) => {
      if (!state.pointerActive || state.pointerId !== event.pointerId) return;

      const wasDragging = state.dragging;

      try {
        state.bubble.releasePointerCapture(event.pointerId);
      } catch (_error) {}

      state.pointerActive = false;
      state.pointerId = null;
      state.bubble.dataset.dragging = "false";

      if (wasDragging) {
        applyBubblePosition(state.currentBubbleX, state.currentBubbleY, true);
        state.lastAction = "bubble-drag-save";
        publishStatus();
      } else {
        open();
      }

      setTimeout(() => {
        state.dragging = false;
      }, 0);

      event.preventDefault();
    };

    addListener(state.bubble, "pointerup", release, { passive: false });
    addListener(state.bubble, "pointercancel", (event) => {
      state.pointerActive = false;
      state.pointerId = null;
      state.dragging = false;
      if (state.bubble) state.bubble.dataset.dragging = "false";
      event.preventDefault();
    }, { passive: false });

    addListener(state.bubble, "keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
  }

  function open() {
    if (!state.overlay) createOverlay();

    updateCurrentRoute();
    renderMapLens("");
    renderInstructionsLens();
    updateCurrentPill();
    setLens(state.activeLens || "map", false);

    state.previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : state.bubble;

    state.overlay.hidden = false;
    state.overlay.dataset.open = "true";
    document.body.classList.add("dgb-blueprint-body-lock");

    state.overlayOpen = true;
    state.lastAction = "open";

    setDataset("manorBlueprintOverlayOpen", "true");
    publishStatus();

    setTimeout(() => {
      const focusTarget = state.closeButton || state.mapTab || state.overlay;
      try {
        focusTarget.focus();
      } catch (_error) {}
    }, 0);

    return status();
  }

  function close() {
    if (!state.overlay) return status();

    state.overlay.hidden = true;
    state.overlay.dataset.open = "false";
    document.body.classList.remove("dgb-blueprint-body-lock");

    state.overlayOpen = false;
    state.lastAction = "close";

    setDataset("manorBlueprintOverlayOpen", "false");
    publishStatus();

    const focusTarget = state.previousFocus || state.bubble;
    if (focusTarget && typeof focusTarget.focus === "function") {
      setTimeout(() => {
        try {
          focusTarget.focus();
        } catch (_error) {}
      }, 0);
    }

    return status();
  }

  function toggle() {
    return state.overlayOpen ? close() : open();
  }

  function refresh() {
    resolveRegistry();
    updateCurrentRoute();

    if (!state.bubble) createBubble();
    if (!state.overlay) createOverlay();

    renderMapLens("");
    renderInstructionsLens();
    updateCurrentPill();

    if (state.bubble) {
      const rect = state.bubble.getBoundingClientRect();
      applyBubblePosition(rect.left, rect.top, false);
    }

    state.lastAction = "refresh";
    publishStatus();
    return status();
  }

  function bindGlobalKeys() {
    addListener(document, "keydown", (event) => {
      if (event.key === "Escape" && state.overlayOpen) {
        event.preventDefault();
        close();
      }
    });

    addListener(window, "resize", () => {
      if (!state.bubble) return;
      const rect = state.bubble.getBoundingClientRect();
      applyBubblePosition(rect.left, rect.top, true);
      state.lastAction = "viewport-reclamp";
      publishStatus();
    }, { passive: true });

    addListener(window, "orientationchange", () => {
      setTimeout(() => {
        if (!state.bubble) return;
        const rect = state.bubble.getBoundingClientRect();
        applyBubblePosition(rect.left, rect.top, true);
        state.lastAction = "orientation-reclamp";
        publishStatus();
      }, 150);
    }, { passive: true });

    addListener(window, "popstate", () => {
      refresh();
    });
  }

  function status() {
    const route = state.currentRoute || updateCurrentRoute();
    const bubblePosition = {
      x: Math.round(state.currentBubbleX || 0),
      y: Math.round(state.currentBubbleY || 0)
    };

    return Object.freeze({
      contract: CONTRACT,
      registryContract: REGISTRY_CONTRACT,
      cssContract: CSS_CONTRACT,
      active: true,

      bubbleMounted: Boolean(state.bubbleMounted),
      overlayMounted: Boolean(state.overlayMounted),
      overlayOpen: Boolean(state.overlayOpen),
      activeLens: state.activeLens,

      currentPath: state.currentPath,
      currentRouteId: route ? route.routeId : "",
      currentRouteTitle: route ? route.title : "",
      registryAvailable: Boolean(state.registryAvailable),
      routeCount: routes().length,
      instructionCount: terms().length,

      bubblePosition,
      dragging: Boolean(state.dragging),
      lastAction: state.lastAction,
      localStorageKey: STORAGE_KEY,

      fixedBubble: true,
      fullScreenOverlay: true,
      mapInstructionsToggle: true,
      imageGeneration: false,
      graphicBox: false,
      heavyRuntime: false,
      perPageCustomCode: false,

      errors: state.errors.slice()
    });
  }

  function publishStatus() {
    const payload = status();

    window[STATUS_GLOBAL] = payload;
    window[RECEIPT_GLOBAL] = payload;

    setDataset("manorBlueprintActive", "true");
    setDataset("manorBlueprintContract", CONTRACT);
    setDataset("manorBlueprintOverlayOpen", state.overlayOpen ? "true" : "false");
    setDataset("manorBlueprintLens", state.activeLens);
    setDataset("manorBlueprintCurrentRoute", payload.currentRouteId || "");
    setDataset("manorBlueprintFixedBubble", "true");
    setDataset("manorBlueprintFullscreenOverlay", "true");

    return payload;
  }

  function exposeApi() {
    window[API_GLOBAL] = Object.freeze({
      contract: CONTRACT,
      open,
      close,
      toggle,
      setLens,
      resetBubblePosition,
      status,
      refresh
    });
  }

  function stop() {
    state.stopped = true;
    removeAllListeners();

    try {
      document.body.classList.remove("dgb-blueprint-body-lock");
    } catch (_error) {}
  }

  function init() {
    try {
      resolveRegistry();
      updateCurrentRoute();
      createBubble();
      createOverlay();
      bindGlobalKeys();
      exposeApi();

      state.lastAction = "init-complete";
      publishStatus();
    } catch (error) {
      recordError("init", error);
      exposeApi();
      publishStatus();
    }
  }

  window[CONTROLLER_GLOBAL] = {
    contract: CONTRACT,
    stop,
    status,
    refresh
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

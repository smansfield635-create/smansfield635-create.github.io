// TARGET FILE: /assets/manor-blueprint/manor.blueprint.js
// TNT FULL-FILE REPLACEMENT
// MANOR_BLUEPRINT_MOBILE_SAFE_BUBBLE_POSITION_RENEWAL_TNT_v1
//
// Purpose:
// Renew the Manor Blueprint fixed draggable bubble so it remains visible,
// reachable, and safely clamped on mobile browsers while preserving the
// existing global bootstrap contract, map/instructions overlay, route registry,
// drag behavior, and no-per-page-code architecture.
//
// Bootstrap compatibility:
// /assets/site.bootstrap.js currently detects the HUD API by the prior public
// API contract. This file preserves API.contract for bootstrap compatibility
// while publishing the new implementation contract in status/receipt fields.
//
// Owns:
// - Blueprint bubble creation
// - Blueprint overlay creation
// - fixed draggable bubble behavior
// - mobile-safe bubble positioning
// - viewport/safe-area clamping
// - localStorage position repair
// - Map / Instructions overlay toggle
// - runtime status and receipt publication
//
// Does not own:
// - HTML page shell
// - site bootstrap loading
// - registry source truth
// - Audralia canvas/renderplex
// - Audralia UI
// - water/hydration/final visual state
// - image generation
// - GraphicBox
// - heavy runtime

(() => {
  "use strict";

  if (typeof window === "undefined" || typeof document === "undefined") return;

  const IMPLEMENTATION_CONTRACT = "MANOR_BLUEPRINT_MOBILE_SAFE_BUBBLE_POSITION_RENEWAL_TNT_v1";
  const PREVIOUS_CONTRACT = "MANOR_BLUEPRINT_FIXED_DRAGGABLE_BUBBLE_FULLSCREEN_MAP_INSTRUCTIONS_TOGGLE_JS_TNT_v1";
  const BOOTSTRAP_COMPAT_API_CONTRACT = "MANOR_BLUEPRINT_FIXED_DRAGGABLE_BUBBLE_FULLSCREEN_MAP_INSTRUCTIONS_TOGGLE_JS_TNT_v1";
  const REGISTRY_CONTRACT = "MANOR_BLUEPRINT_ROUTE_REGISTRY_TNT_v1";
  const CSS_CONTRACT = "MANOR_BLUEPRINT_FIXED_BUBBLE_FULLSCREEN_OVERLAY_CSS_TNT_v1";

  const STATUS_GLOBAL = "DGB_MANOR_BLUEPRINT_STATUS";
  const RECEIPT_GLOBAL = "DGB_MANOR_BLUEPRINT_RECEIPT";
  const API_GLOBAL = "DGB_MANOR_BLUEPRINT_API";
  const CONTROLLER_GLOBAL = "__DGB_MANOR_BLUEPRINT_MOBILE_SAFE_CONTROLLER__";

  const BUBBLE_SELECTOR = "[data-dgb-blueprint-bubble]";
  const OVERLAY_SELECTOR = "[data-dgb-blueprint-overlay]";
  const STORAGE_KEY = "DGB_MANOR_BLUEPRINT_BUBBLE_POSITION_v1";

  const MOBILE_WIDTH_MAX = 760;
  const DRAG_THRESHOLD_PX = 6;

  const state = {
    contract: IMPLEMENTATION_CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    bootstrapCompatApiContract: BOOTSTRAP_COMPAT_API_CONTRACT,
    registryContract: REGISTRY_CONTRACT,
    cssContract: CSS_CONTRACT,

    active: true,
    bubbleMounted: false,
    overlayMounted: false,
    overlayOpen: false,
    activeLens: "map",

    currentPath: normalizePath(window.location.pathname || "/"),
    currentRouteId: "",
    currentRouteTitle: "",
    registryAvailable: false,
    routeCount: 0,
    instructionCount: 0,

    bubblePosition: { x: 0, y: 0 },
    dragging: false,
    lastAction: "boot",
    localStorageKey: STORAGE_KEY,

    fixedBubble: true,
    fullScreenOverlay: true,
    mapInstructionsToggle: true,

    mobileSafePosition: true,
    viewportWidth: 0,
    viewportHeight: 0,
    visualViewportUsed: false,
    safeMargins: null,
    bubbleRect: null,
    positionWasClamped: false,
    positionSource: "boot",

    imageGeneration: false,
    graphicBox: false,
    heavyRuntime: false,
    perPageCustomCode: false,

    errors: []
  };

  let bubbleEl = null;
  let overlayEl = null;
  let currentRoute = null;
  let routeRegistry = null;

  let dragState = null;
  let suppressClickUntil = 0;
  let resizeTimer = 0;

  function nowIso() {
    return new Date().toISOString();
  }

  function recordError(scope, error) {
    const message = error && error.message ? error.message : String(error || "unknown");

    state.errors.push({
      scope,
      message,
      time: nowIso()
    });

    state.lastAction = "error:" + scope;
    publishStatus();
  }

  function normalizePath(path) {
    const raw = String(path || "/").split("?")[0].split("#")[0].trim();

    if (!raw || raw === "/") return "/";

    const withLead = raw.startsWith("/") ? raw : "/" + raw;
    const collapsed = withLead.replace(/\/{2,}/g, "/");

    return collapsed.endsWith("/") ? collapsed : collapsed + "/";
  }

  function setDataset(key, value) {
    try {
      document.documentElement.dataset[key] = String(value);
    } catch (_error) {}
  }

  function finiteNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  function clampNumber(value, min, max) {
    if (!Number.isFinite(value)) return min;
    if (max < min) return min;
    return Math.min(max, Math.max(min, value));
  }

  function isMobileViewport(viewportBox) {
    return Number(viewportBox.width || 0) <= MOBILE_WIDTH_MAX;
  }

  function getViewportBox() {
    const vv = window.visualViewport;

    if (vv && Number.isFinite(vv.width) && Number.isFinite(vv.height)) {
      return {
        width: vv.width,
        height: vv.height,
        offsetLeft: Number.isFinite(vv.offsetLeft) ? vv.offsetLeft : 0,
        offsetTop: Number.isFinite(vv.offsetTop) ? vv.offsetTop : 0,
        visualViewportUsed: true
      };
    }

    return {
      width: window.innerWidth || document.documentElement.clientWidth || 320,
      height: window.innerHeight || document.documentElement.clientHeight || 640,
      offsetLeft: 0,
      offsetTop: 0,
      visualViewportUsed: false
    };
  }

  function getSafeMargins(viewportBox) {
    if (isMobileViewport(viewportBox)) {
      return {
        left: 16,
        right: 16,
        top: 18,
        bottom: 96,
        mode: "mobile"
      };
    }

    return {
      left: 16,
      right: 16,
      top: 16,
      bottom: 16,
      mode: "desktop"
    };
  }

  function getBubbleSize() {
    if (bubbleEl) {
      const rect = bubbleEl.getBoundingClientRect();

      if (rect && rect.width > 0 && rect.height > 0) {
        return {
          width: rect.width,
          height: rect.height
        };
      }
    }

    return {
      width: 72,
      height: 72
    };
  }

  function getDefaultBubblePosition(positionSource = "default") {
    const viewportBox = getViewportBox();
    const margins = getSafeMargins(viewportBox);
    const size = getBubbleSize();

    const x = viewportBox.offsetLeft + viewportBox.width - size.width - margins.right;
    const y = viewportBox.offsetTop + viewportBox.height - size.height - margins.bottom;

    return clampBubblePosition({ x, y }, {
      positionSource,
      forceClampedFlag: false
    });
  }

  function clampBubblePosition(position, options = {}) {
    const viewportBox = getViewportBox();
    const margins = getSafeMargins(viewportBox);
    const size = getBubbleSize();

    const minX = viewportBox.offsetLeft + margins.left;
    const maxX = viewportBox.offsetLeft + viewportBox.width - size.width - margins.right;

    const minY = viewportBox.offsetTop + margins.top;
    const maxY = viewportBox.offsetTop + viewportBox.height - size.height - margins.bottom;

    const originalX = Number(position && position.x);
    const originalY = Number(position && position.y);

    const safeX = clampNumber(originalX, minX, maxX);
    const safeY = clampNumber(originalY, minY, maxY);

    const wasClamped =
      options.forceClampedFlag === true ||
      !Number.isFinite(originalX) ||
      !Number.isFinite(originalY) ||
      Math.abs(safeX - originalX) > 0.5 ||
      Math.abs(safeY - originalY) > 0.5;

    state.viewportWidth = Math.round(viewportBox.width);
    state.viewportHeight = Math.round(viewportBox.height);
    state.visualViewportUsed = Boolean(viewportBox.visualViewportUsed);
    state.safeMargins = { ...margins };
    state.positionWasClamped = wasClamped;
    state.positionSource = options.positionSource || state.positionSource || "unknown";

    return {
      x: safeX,
      y: safeY,
      wasClamped,
      viewportBox,
      safeMargins: margins,
      bubbleSize: size
    };
  }

  function readStoredPosition() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw);

      if (!parsed || !finiteNumber(parsed.x) || !finiteNumber(parsed.y)) {
        return null;
      }

      return {
        x: parsed.x,
        y: parsed.y
      };
    } catch (error) {
      recordError("read-stored-position", error);
      return null;
    }
  }

  function saveStoredPosition(position) {
    try {
      if (!position || !finiteNumber(position.x) || !finiteNumber(position.y)) return;

      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          x: position.x,
          y: position.y,
          contract: IMPLEMENTATION_CONTRACT,
          savedAt: nowIso()
        })
      );
    } catch (error) {
      recordError("save-stored-position", error);
    }
  }

  function positionLeavesEnoughBubbleVisible(position) {
    const viewportBox = getViewportBox();
    const size = getBubbleSize();

    const visibleLeft = Math.max(position.x, viewportBox.offsetLeft);
    const visibleTop = Math.max(position.y, viewportBox.offsetTop);
    const visibleRight = Math.min(position.x + size.width, viewportBox.offsetLeft + viewportBox.width);
    const visibleBottom = Math.min(position.y + size.height, viewportBox.offsetTop + viewportBox.height);

    const visibleWidth = Math.max(0, visibleRight - visibleLeft);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);

    return visibleWidth >= size.width * 0.5 && visibleHeight >= size.height * 0.5;
  }

  function resolveInitialPosition() {
    const stored = readStoredPosition();

    if (!stored) {
      return getDefaultBubblePosition("default");
    }

    const clamped = clampBubblePosition(stored, {
      positionSource: "stored"
    });

    if (!positionLeavesEnoughBubbleVisible(clamped)) {
      return getDefaultBubblePosition("repair");
    }

    if (clamped.wasClamped) {
      saveStoredPosition(clamped);
      state.positionSource = "repair";
    }

    return clamped;
  }

  function applyBubblePosition(position, options = {}) {
    if (!bubbleEl) return;

    const clamped = clampBubblePosition(position, {
      positionSource: options.positionSource || "apply",
      forceClampedFlag: options.forceClampedFlag
    });

    bubbleEl.style.position = "fixed";
    bubbleEl.style.left = `${Math.round(clamped.x)}px`;
    bubbleEl.style.top = `${Math.round(clamped.y)}px`;
    bubbleEl.style.right = "auto";
    bubbleEl.style.bottom = "auto";
    bubbleEl.style.zIndex = "99990";
    bubbleEl.style.pointerEvents = "auto";
    bubbleEl.style.display = "grid";
    bubbleEl.style.visibility = "visible";
    bubbleEl.style.opacity = "1";

    state.bubblePosition = {
      x: Math.round(clamped.x),
      y: Math.round(clamped.y)
    };

    refreshBubbleRect();

    if (options.save === true) {
      saveStoredPosition(state.bubblePosition);
    }

    publishStatus();
  }

  function repairBubblePositionIfNeeded(positionSource = "repair") {
    if (!bubbleEl) return;

    const current = state.bubblePosition && finiteNumber(state.bubblePosition.x) && finiteNumber(state.bubblePosition.y)
      ? state.bubblePosition
      : resolveInitialPosition();

    const clamped = clampBubblePosition(current, {
      positionSource
    });

    const shouldRepair =
      clamped.wasClamped ||
      !positionLeavesEnoughBubbleVisible(clamped);

    if (shouldRepair) {
      applyBubblePosition(clamped, {
        save: true,
        positionSource
      });
    } else {
      applyBubblePosition(clamped, {
        save: false,
        positionSource
      });
    }
  }

  function refreshBubbleRect() {
    if (!bubbleEl) {
      state.bubbleRect = null;
      return;
    }

    const rect = bubbleEl.getBoundingClientRect();

    state.bubbleRect = {
      x: Math.round(rect.x),
      y: Math.round(rect.y),
      top: Math.round(rect.top),
      left: Math.round(rect.left),
      right: Math.round(rect.right),
      bottom: Math.round(rect.bottom),
      width: Math.round(rect.width),
      height: Math.round(rect.height)
    };
  }

  function fallbackRoutes() {
    return [
      { id: "compass", title: "Compass", path: "/", group: "Manor", chain: ["Manor", "Compass"] },
      { id: "showroom", title: "Showroom", path: "/showroom/", group: "Showroom", chain: ["Manor", "Showroom"] },
      { id: "globe", title: "Globe Showcase", path: "/showroom/globe/", group: "Showroom", chain: ["Manor", "Showroom", "Globe"] },
      { id: "audralia", title: "Audralia", path: "/showroom/globe/audralia/", group: "Audralia", chain: ["Manor", "Showroom", "Globe", "Audralia"] },
      { id: "audralia-planet", title: "Audralia Planet", path: "/showroom/globe/audralia/planet/", group: "Audralia", chain: ["Manor", "Showroom", "Globe", "Audralia", "Planet"] },
      { id: "audralia-cockpit", title: "Audralia Cockpit", path: "/showroom/globe/audralia/disposition/", group: "Audralia", chain: ["Manor", "Showroom", "Globe", "Audralia", "Cockpit"] },
      { id: "gauges", title: "Gauges", path: "/gauges/", group: "Proof", chain: ["Manor", "Gauges"] },
      { id: "laws", title: "Laws", path: "/laws/", group: "Proof", chain: ["Manor", "Laws"] }
    ];
  }

  function fallbackInstructions() {
    return [
      {
        title: "Blueprint Bubble",
        body: "The floating bubble opens the Manor Blueprint: a site-wide map and instruction layer."
      },
      {
        title: "Return to Orbit",
        body: "Return to Orbit moves you back to the page’s primary navigation field or main inspection stage."
      },
      {
        title: "Map Lens",
        body: "The Map lens identifies where you are and shows nearby rooms, chambers, and routes."
      },
      {
        title: "Instructions Lens",
        body: "The Instructions lens explains recurring navigation patterns, route gems, chambers, receipts, and proof lanes."
      },
      {
        title: "Gauges / Triple G",
        body: "Gauges are proof rooms. They help inspect whether a route, render, or contract is behaving as expected."
      }
    ];
  }

  function getRawRegistry() {
    return window.DGB_MANOR_BLUEPRINT_REGISTRY || window.DGB_MANOR_BLUEPRINT_ROUTE_REGISTRY || null;
  }

  function normalizeRoute(rawRoute, index) {
    const path = normalizePath(rawRoute.path || rawRoute.href || rawRoute.url || rawRoute.route || "/");
    const title = rawRoute.title || rawRoute.label || rawRoute.name || rawRoute.id || `Route ${index + 1}`;
    const id = rawRoute.id || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `route-${index + 1}`;

    let chain = rawRoute.chain || rawRoute.breadcrumbs || rawRoute.pathChain;

    if (!Array.isArray(chain) || chain.length === 0) {
      chain = path === "/"
        ? ["Manor", "Compass"]
        : ["Manor"].concat(path.split("/").filter(Boolean).map((part) => part.replace(/-/g, " ")));
    }

    return {
      ...rawRoute,
      id,
      title,
      path,
      group: rawRoute.group || rawRoute.house || rawRoute.zone || "Manor",
      description: rawRoute.description || rawRoute.summary || "",
      chain
    };
  }

  function loadRegistry() {
    const raw = getRawRegistry();

    const routes = raw && Array.isArray(raw.routes)
      ? raw.routes.map(normalizeRoute)
      : fallbackRoutes().map(normalizeRoute);

    const instructions = raw && Array.isArray(raw.instructions)
      ? raw.instructions
      : fallbackInstructions();

    routeRegistry = {
      raw,
      routes,
      instructions,
      contract: raw && raw.contract ? raw.contract : REGISTRY_CONTRACT
    };

    state.registryAvailable = Boolean(raw);
    state.routeCount = routes.length;
    state.instructionCount = instructions.length;

    currentRoute = resolveCurrentRoute(routes);
    state.currentRouteId = currentRoute.id;
    state.currentRouteTitle = currentRoute.title;
  }

  function resolveCurrentRoute(routes) {
    const currentPath = normalizePath(window.location.pathname || "/");

    const exact = routes.find((route) => normalizePath(route.path) === currentPath);
    if (exact) return exact;

    const partial = routes
      .filter((route) => {
        const routePath = normalizePath(route.path);
        return routePath !== "/" && currentPath.startsWith(routePath);
      })
      .sort((a, b) => normalizePath(b.path).length - normalizePath(a.path).length)[0];

    if (partial) return partial;

    return routes.find((route) => normalizePath(route.path) === "/") || {
      id: "current",
      title: document.title || "Current Page",
      path: currentPath,
      group: "Current",
      chain: ["Manor", "Current Page"],
      description: ""
    };
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function renderRouteCards() {
    const routes = routeRegistry && Array.isArray(routeRegistry.routes)
      ? routeRegistry.routes
      : fallbackRoutes();

    return routes
      .map((route) => {
        const isCurrent = route.id === state.currentRouteId;
        const description = route.description || route.group || "";

        return `
          <a class="dgb-bp-route-card" href="${escapeHtml(route.path)}" ${isCurrent ? 'data-current-route="true"' : ""}>
            <span class="dgb-bp-route-card__kicker">${isCurrent ? "You Are Here" : escapeHtml(route.group || "Route")}</span>
            <strong>${escapeHtml(route.title)}</strong>
            <small>${escapeHtml(description)}</small>
          </a>
        `;
      })
      .join("");
  }

  function renderInstructionCards() {
    const instructions = routeRegistry && Array.isArray(routeRegistry.instructions)
      ? routeRegistry.instructions
      : fallbackInstructions();

    return instructions
      .map((item, index) => {
        const title = item.title || item.label || `Instruction ${index + 1}`;
        const body = item.body || item.description || item.text || "";

        return `
          <article class="dgb-bp-instruction-card">
            <b>${escapeHtml(title)}</b>
            <p>${escapeHtml(body)}</p>
          </article>
        `;
      })
      .join("");
  }

  function renderOverlay() {
    if (!overlayEl) return;

    const chain = currentRoute && Array.isArray(currentRoute.chain)
      ? currentRoute.chain
      : ["Manor", state.currentRouteTitle || "Current Page"];

    overlayEl.innerHTML = `
      <div class="dgb-bp-shell" role="document">
        <header class="dgb-bp-header">
          <div>
            <span class="dgb-bp-kicker">Manor Blueprint</span>
            <h2>Map / Instructions</h2>
            <p>Use the Blueprint to see where you are, move through the Manor, and understand route controls.</p>
          </div>
          <button class="dgb-bp-close" type="button" data-dgb-blueprint-close aria-label="Close Manor Blueprint">×</button>
        </header>

        <nav class="dgb-bp-tabs" aria-label="Blueprint lenses">
          <button type="button" data-dgb-blueprint-lens="map" aria-pressed="${state.activeLens === "map"}">Map</button>
          <button type="button" data-dgb-blueprint-lens="instructions" aria-pressed="${state.activeLens === "instructions"}">Instructions</button>
        </nav>

        <section class="dgb-bp-lens" data-dgb-blueprint-panel="map" ${state.activeLens === "map" ? "" : "hidden"}>
          <div class="dgb-bp-you-are-here">
            <span>You Are Here</span>
            <strong>${escapeHtml(state.currentRouteTitle || "Current Page")}</strong>
            <p>${chain.map(escapeHtml).join(" → ")}</p>
          </div>
          <div class="dgb-bp-route-grid">
            ${renderRouteCards()}
          </div>
        </section>

        <section class="dgb-bp-lens" data-dgb-blueprint-panel="instructions" ${state.activeLens === "instructions" ? "" : "hidden"}>
          <div class="dgb-bp-instruction-grid">
            ${renderInstructionCards()}
          </div>
        </section>
      </div>
    `;

    bindOverlayEvents();
  }

  function bindOverlayEvents() {
    if (!overlayEl || overlayEl.dataset.dgbBlueprintEventsBound === "true") return;

    overlayEl.dataset.dgbBlueprintEventsBound = "true";

    overlayEl.addEventListener("click", (event) => {
      const closeButton = event.target.closest("[data-dgb-blueprint-close]");
      if (closeButton) {
        event.preventDefault();
        closeOverlay();
        return;
      }

      const lensButton = event.target.closest("[data-dgb-blueprint-lens]");
      if (lensButton) {
        event.preventDefault();
        setLens(lensButton.getAttribute("data-dgb-blueprint-lens") || "map");
        return;
      }

      if (event.target === overlayEl) {
        closeOverlay();
      }
    });

    overlayEl.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeOverlay();
      }
    });
  }

  function createOrGetBubble() {
    const existing = document.querySelector(BUBBLE_SELECTOR);

    if (existing) {
      bubbleEl = existing;
    } else {
      bubbleEl = document.createElement("button");
      bubbleEl.type = "button";
      bubbleEl.className = "dgb-blueprint-bubble";
      bubbleEl.setAttribute("data-dgb-blueprint-bubble", "true");
      bubbleEl.setAttribute("aria-label", "Open Manor Blueprint Map");
      bubbleEl.setAttribute("title", "Open Manor Blueprint Map");
      bubbleEl.innerHTML = `
        <span class="dgb-blueprint-bubble__gem" aria-hidden="true"></span>
        <span class="dgb-blueprint-bubble__label">MAP</span>
      `;
      document.body.appendChild(bubbleEl);
    }

    bubbleEl.setAttribute("data-contract", IMPLEMENTATION_CONTRACT);
    bubbleEl.setAttribute("data-bootstrap-compat-contract", BOOTSTRAP_COMPAT_API_CONTRACT);
    bubbleEl.setAttribute("data-mobile-safe-position", "true");

    state.bubbleMounted = true;
  }

  function createOrGetOverlay() {
    const existing = document.querySelector(OVERLAY_SELECTOR);

    if (existing) {
      overlayEl = existing;
    } else {
      overlayEl = document.createElement("aside");
      overlayEl.className = "dgb-blueprint-overlay";
      overlayEl.setAttribute("data-dgb-blueprint-overlay", "true");
      overlayEl.setAttribute("role", "dialog");
      overlayEl.setAttribute("aria-modal", "true");
      overlayEl.setAttribute("aria-label", "Manor Blueprint Map and Instructions");
      overlayEl.hidden = true;
      document.body.appendChild(overlayEl);
    }

    overlayEl.setAttribute("data-contract", IMPLEMENTATION_CONTRACT);
    overlayEl.setAttribute("data-open", state.overlayOpen ? "true" : "false");

    state.overlayMounted = true;

    renderOverlay();
  }

  function openOverlay() {
    if (!overlayEl) return;

    state.overlayOpen = true;
    state.lastAction = "open-overlay";

    overlayEl.hidden = false;
    overlayEl.setAttribute("data-open", "true");
    renderOverlay();
    publishStatus();

    const closeButton = overlayEl.querySelector("[data-dgb-blueprint-close]");
    if (closeButton && typeof closeButton.focus === "function") {
      window.setTimeout(() => closeButton.focus({ preventScroll: true }), 0);
    }
  }

  function closeOverlay() {
    if (!overlayEl) return;

    state.overlayOpen = false;
    state.lastAction = "close-overlay";

    overlayEl.hidden = true;
    overlayEl.setAttribute("data-open", "false");
    publishStatus();

    if (bubbleEl && typeof bubbleEl.focus === "function") {
      window.setTimeout(() => bubbleEl.focus({ preventScroll: true }), 0);
    }
  }

  function setLens(lens) {
    state.activeLens = lens === "instructions" ? "instructions" : "map";
    state.lastAction = "set-lens";

    setDataset("manorBlueprintLens", state.activeLens);
    renderOverlay();
    publishStatus();
  }

  function bindBubbleEvents() {
    if (!bubbleEl || bubbleEl.dataset.dgbBlueprintEventsBound === "true") return;

    bubbleEl.dataset.dgbBlueprintEventsBound = "true";

    bubbleEl.addEventListener("pointerdown", (event) => {
      if (event.button !== undefined && event.button !== 0) return;

      const startPosition = {
        x: state.bubblePosition.x,
        y: state.bubblePosition.y
      };

      dragState = {
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startPosition,
        moved: false
      };

      state.dragging = false;
      state.lastAction = "pointer-down";

      try {
        bubbleEl.setPointerCapture(event.pointerId);
      } catch (_error) {}

      publishStatus();
    });

    bubbleEl.addEventListener("pointermove", (event) => {
      if (!dragState || dragState.pointerId !== event.pointerId) return;

      const dx = event.clientX - dragState.startClientX;
      const dy = event.clientY - dragState.startClientY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < DRAG_THRESHOLD_PX && !dragState.moved) return;

      event.preventDefault();

      dragState.moved = true;
      state.dragging = true;
      state.lastAction = "drag";

      applyBubblePosition({
        x: dragState.startPosition.x + dx,
        y: dragState.startPosition.y + dy
      }, {
        save: false,
        positionSource: "drag"
      });
    });

    bubbleEl.addEventListener("pointerup", (event) => {
      if (!dragState || dragState.pointerId !== event.pointerId) return;

      event.preventDefault();

      try {
        bubbleEl.releasePointerCapture(event.pointerId);
      } catch (_error) {}

      const wasDrag = Boolean(dragState.moved);
      dragState = null;

      if (wasDrag) {
        state.dragging = false;
        state.lastAction = "drag-save";
        suppressClickUntil = Date.now() + 450;

        applyBubblePosition(state.bubblePosition, {
          save: true,
          positionSource: "drag"
        });

        publishStatus();
        return;
      }

      state.dragging = false;
      state.lastAction = "tap-open";
      openOverlay();
    });

    bubbleEl.addEventListener("pointercancel", (event) => {
      if (!dragState || dragState.pointerId !== event.pointerId) return;

      try {
        bubbleEl.releasePointerCapture(event.pointerId);
      } catch (_error) {}

      dragState = null;
      state.dragging = false;
      state.lastAction = "pointer-cancel";
      repairBubblePositionIfNeeded("repair");
      publishStatus();
    });

    bubbleEl.addEventListener("click", (event) => {
      if (Date.now() < suppressClickUntil) {
        event.preventDefault();
        event.stopPropagation();
      }
    });

    bubbleEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openOverlay();
      }
    });
  }

  function bindViewportEvents() {
    if (window.__DGB_MANOR_BLUEPRINT_VIEWPORT_EVENTS_BOUND__ === IMPLEMENTATION_CONTRACT) return;

    window.__DGB_MANOR_BLUEPRINT_VIEWPORT_EVENTS_BOUND__ = IMPLEMENTATION_CONTRACT;

    const scheduleRepair = (source) => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        state.lastAction = source;
        repairBubblePositionIfNeeded(source);
      }, 80);
    };

    window.addEventListener("resize", () => scheduleRepair("resize"), { passive: true });
    window.addEventListener("orientationchange", () => scheduleRepair("orientationchange"), { passive: true });

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", () => scheduleRepair("visual-viewport-resize"), { passive: true });
      window.visualViewport.addEventListener("scroll", () => scheduleRepair("visual-viewport-scroll"), { passive: true });
    }
  }

  function resetBubblePosition() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      recordError("reset-remove-storage", error);
    }

    const next = getDefaultBubblePosition("reset");

    state.lastAction = "reset-bubble-position";
    applyBubblePosition(next, {
      save: true,
      positionSource: "reset",
      forceClampedFlag: next.wasClamped
    });

    return status();
  }

  function refresh() {
    loadRegistry();

    if (!bubbleEl) createOrGetBubble();
    if (!overlayEl) createOrGetOverlay();

    repairBubblePositionIfNeeded("refresh");
    renderOverlay();

    state.lastAction = "refresh";
    publishStatus();

    return status();
  }

  function status() {
    refreshBubbleRect();

    return Object.freeze({
      contract: IMPLEMENTATION_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      bootstrapCompatApiContract: BOOTSTRAP_COMPAT_API_CONTRACT,
      registryContract: REGISTRY_CONTRACT,
      cssContract: CSS_CONTRACT,

      active: state.active,
      bubbleMounted: state.bubbleMounted,
      overlayMounted: state.overlayMounted,
      overlayOpen: state.overlayOpen,
      activeLens: state.activeLens,

      currentPath: state.currentPath,
      currentRouteId: state.currentRouteId,
      currentRouteTitle: state.currentRouteTitle,
      registryAvailable: state.registryAvailable,
      routeCount: state.routeCount,
      instructionCount: state.instructionCount,

      bubblePosition: { ...state.bubblePosition },
      dragging: state.dragging,
      lastAction: state.lastAction,
      localStorageKey: state.localStorageKey,

      fixedBubble: true,
      fullScreenOverlay: true,
      mapInstructionsToggle: true,

      mobileSafePosition: true,
      viewportWidth: state.viewportWidth,
      viewportHeight: state.viewportHeight,
      visualViewportUsed: state.visualViewportUsed,
      safeMargins: state.safeMargins ? { ...state.safeMargins } : null,
      bubbleRect: state.bubbleRect ? { ...state.bubbleRect } : null,
      positionWasClamped: state.positionWasClamped,
      positionSource: state.positionSource,

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

    setDataset("manorBlueprintCurrentRoute", state.currentRouteId || "unknown");
    setDataset("manorBlueprintLens", state.activeLens);
    setDataset("manorBlueprintActive", "true");
    setDataset("manorBlueprintContract", IMPLEMENTATION_CONTRACT);
    setDataset("manorBlueprintPreviousContract", PREVIOUS_CONTRACT);
    setDataset("manorBlueprintBootstrapCompatApiContract", BOOTSTRAP_COMPAT_API_CONTRACT);
    setDataset("manorBlueprintOverlayOpen", state.overlayOpen ? "true" : "false");
    setDataset("manorBlueprintFixedBubble", "true");
    setDataset("manorBlueprintFullscreenOverlay", "true");
    setDataset("manorBlueprintMobileSafePosition", "true");
    setDataset("manorBlueprintViewportWidth", String(state.viewportWidth || ""));
    setDataset("manorBlueprintViewportHeight", String(state.viewportHeight || ""));
    setDataset("manorBlueprintPositionSource", state.positionSource || "");
    setDataset("manorBlueprintPositionWasClamped", state.positionWasClamped ? "true" : "false");

    return payload;
  }

  function exposeApi() {
    window[API_GLOBAL] = Object.freeze({
      contract: BOOTSTRAP_COMPAT_API_CONTRACT,
      implementationContract: IMPLEMENTATION_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      registryContract: REGISTRY_CONTRACT,
      cssContract: CSS_CONTRACT,

      open: openOverlay,
      close: closeOverlay,
      toggle: () => {
        if (state.overlayOpen) {
          closeOverlay();
        } else {
          openOverlay();
        }

        return status();
      },
      setLens,
      refresh,
      status,
      resetBubblePosition
    });

    window[CONTROLLER_GLOBAL] = Object.freeze({
      contract: BOOTSTRAP_COMPAT_API_CONTRACT,
      implementationContract: IMPLEMENTATION_CONTRACT,
      refresh,
      status,
      resetBubblePosition
    });
  }

  function mount() {
    try {
      loadRegistry();
      createOrGetBubble();
      createOrGetOverlay();
      bindBubbleEvents();
      bindOverlayEvents();
      bindViewportEvents();

      const initialPosition = resolveInitialPosition();

      applyBubblePosition(initialPosition, {
        save: initialPosition.wasClamped,
        positionSource: state.positionSource || "default",
        forceClampedFlag: initialPosition.wasClamped
      });

      state.lastAction = "mount-complete";
      exposeApi();
      publishStatus();

      window.setTimeout(() => repairBubblePositionIfNeeded("repair"), 80);
      window.setTimeout(() => repairBubblePositionIfNeeded("repair"), 700);
    } catch (error) {
      recordError("mount", error);
      exposeApi();
      publishStatus();
    }
  }

  function init() {
    const existingController = window[CONTROLLER_GLOBAL];

    if (
      existingController &&
      existingController.implementationContract === IMPLEMENTATION_CONTRACT &&
      typeof existingController.refresh === "function"
    ) {
      existingController.refresh();
      return;
    }

    exposeApi();

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", mount, { once: true });
    } else {
      mount();
    }
  }

  init();
})();

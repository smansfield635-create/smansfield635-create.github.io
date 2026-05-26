// TARGET FILE: /assets/manor-blueprint/manor.blueprint.js
// TNT FULL-FILE REPLACEMENT
// MANOR_BLUEPRINT_GLOBAL_JOYSTICK_SCROLL_SITEWIDE_JS_TNT_v1
//
// Purpose:
// Renew the global Manor Blueprint HUD so the map bubble is sitewide,
// draggable through the full visible viewport, and usable as a mobile
// joystick-scroll control.
//
// Compatibility API contract preserved:
// MANOR_BLUEPRINT_FIXED_DRAGGABLE_BUBBLE_FULLSCREEN_MAP_INSTRUCTIONS_TOGGLE_JS_TNT_v1
//
// Previous behavior contract:
// MANOR_BLUEPRINT_MOBILE_SAFE_BUBBLE_POSITION_RENEWAL_TNT_v1
//
// Owns:
// - global map bubble
// - full-screen overlay
// - map/instructions lens
// - registry consumption
// - full-viewport drag
// - joystick scroll while dragging
// - position persistence and repair
// - status / receipt globals
//
// Does not own:
// - page content
// - page-specific installs
// - Audralia runtime
// - planet routes
// - CSS source truth
// - registry source truth

(() => {
  "use strict";

  if (typeof window === "undefined" || typeof document === "undefined") return;

  const CONTRACT = "MANOR_BLUEPRINT_GLOBAL_JOYSTICK_SCROLL_SITEWIDE_JS_TNT_v1";
  const API_CONTRACT = "MANOR_BLUEPRINT_FIXED_DRAGGABLE_BUBBLE_FULLSCREEN_MAP_INSTRUCTIONS_TOGGLE_JS_TNT_v1";
  const PREVIOUS_CONTRACT = "MANOR_BLUEPRINT_MOBILE_SAFE_BUBBLE_POSITION_RENEWAL_TNT_v1";

  const STATUS_GLOBAL = "DGB_MANOR_BLUEPRINT_STATUS";
  const RECEIPT_GLOBAL = "DGB_MANOR_BLUEPRINT_RECEIPT";
  const API_GLOBAL = "DGB_MANOR_BLUEPRINT_API";
  const CONTROLLER_GLOBAL = "__DGB_MANOR_BLUEPRINT_MOBILE_SAFE_CONTROLLER__";

  const STORAGE_KEY = "DGB_MANOR_BLUEPRINT_BUBBLE_POSITION_v1";
  const BUBBLE_SELECTOR = "[data-dgb-blueprint-bubble]";
  const OVERLAY_SELECTOR = "[data-dgb-blueprint-overlay]";

  const TAP_MOVE_THRESHOLD = 6;
  const MIN_SCROLL_SPEED = 4;
  const MAX_SCROLL_SPEED = 32;
  const MOBILE_BREAKPOINT = 760;

  let bubble = null;
  let overlay = null;
  let joystickRaf = 0;

  const state = {
    activeLens: "map",
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

    return {
      x,
      y,
      clamped: x !== sourceX || y !== sourceY
    };
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
        contract: String(parsed.contract || "")
      };
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
    if (stored.contract !== CONTRACT) return false;

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
        fullViewportDrag: true,
        joystickScrollActive: true,
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

  function fallbackRoutes() {
    return [
      { id: "compass", title: "Compass", path: "/", group: "North", body: "Return to the origin compass.", x: 50, y: 10 },
      { id: "door", title: "Door", path: "/door/", group: "North", body: "Cross the threshold.", x: 50, y: 24 },
      { id: "home", title: "Home", path: "/home/", group: "North", body: "Return home.", x: 50, y: 38 },
      { id: "showroom", title: "Showroom", path: "/showroom/", group: "East", body: "Enter the showroom.", x: 78, y: 42 },
      { id: "globe", title: "Globe Showcase", path: "/showroom/globe/", group: "East", body: "Open the globe route.", x: 84, y: 56 },
      { id: "audralia", title: "Audralia", path: "/showroom/globe/audralia/", group: "East", body: "Open Mirrorland and Audralia.", x: 76, y: 70 },
      { id: "products", title: "Products", path: "/products/", group: "South", body: "Open product routes.", x: 50, y: 82 },
      { id: "gauges", title: "Gauges", path: "/gauges/", group: "South", body: "Open audit gauges.", x: 36, y: 76 },
      { id: "laws", title: "Laws", path: "/laws/", group: "West", body: "Open law routes.", x: 20, y: 54 },
      { id: "frontier", title: "Frontier", path: "/frontier/", group: "West", body: "Open frontier routes.", x: 24, y: 68 }
    ];
  }

  function routes() {
    const reg = registry();
    const source = Array.isArray(reg?.routes) ? reg.routes : fallbackRoutes();

    return source.map((item, index) => ({
      id: String(item.id || item.key || `route-${index}`),
      title: String(item.title || item.label || item.name || "Route"),
      path: normalizePath(item.path || item.href || "/"),
      group: String(item.group || item.family || "Route"),
      body: String(item.body || item.description || "Open this route."),
      x: Number.isFinite(Number(item.x)) ? Number(item.x) : 12 + ((index * 17) % 76),
      y: Number.isFinite(Number(item.y)) ? Number(item.y) : 12 + ((index * 23) % 76)
    }));
  }

  function instructions() {
    const reg = registry();
    const source = Array.isArray(reg?.instructions) ? reg.instructions : [
      { title: "Tap", body: "Tap the bubble to open or close the Manor Blueprint route map." },
      { title: "Drag", body: "Drag the bubble anywhere inside the visible screen." },
      { title: "Joystick Scroll", body: "While dragging, pull near the bottom edge to scroll down or near the top edge to scroll up." },
      { title: "Reset", body: "Use Reset Bubble to restore the upper-right safe anchor." },
      { title: "Global HUD", body: "The bubble is loaded globally through the site bootstrap chain." }
    ];

    return source.map((item, index) => ({
      title: String(item.title || `Instruction ${index + 1}`),
      body: String(item.body || item.text || "Read this instruction.")
    }));
  }

  function currentRoute(routeList) {
    const path = normalizePath(window.location.pathname || "/");
    return routeList.find((route) => route.path === path) ||
      routeList.find((route) => path.startsWith(route.path) && route.path !== "/") ||
      routeList[0] ||
      null;
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
    bubble.setAttribute("aria-label", "Open Manor Blueprint map and instructions");
    bubble.setAttribute("data-dgb-blueprint-bubble", "true");
    bubble.setAttribute("data-manor-blueprint-contract", CONTRACT);
    bubble.setAttribute("data-api-contract", API_CONTRACT);
    bubble.setAttribute("data-full-viewport-drag", "true");
    bubble.setAttribute("data-joystick-scroll", "true");
    bubble.innerHTML = `
      <span class="dgb-blueprint-bubble-label dgb-blueprint-bubble__label">
        <strong>Map</strong>
        <span>Site</span>
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
    overlay.setAttribute("aria-label", "Manor Blueprint map and instructions");

    document.body.appendChild(overlay);
    return overlay;
  }

  function renderMapLens(routeList, current) {
    const groups = routeList.reduce((acc, route) => {
      const key = route.group || "Route";
      if (!acc[key]) acc[key] = [];
      acc[key].push(route);
      return acc;
    }, {});

    const groupMarkup = Object.keys(groups).map((group) => `
      <section class="dgb-bp-route-section">
        <div class="dgb-bp-section-title">
          <span>${escapeHtml(group)}</span>
          <span>${groups[group].length}</span>
        </div>
        <div class="dgb-bp-route-list">
          ${groups[group].map((route) => `
            <a class="dgb-bp-route-card" href="${escapeHtml(route.path)}" data-current="${current && current.id === route.id ? "true" : "false"}">
              <span class="dgb-bp-route-marker">${escapeHtml(route.title.slice(0, 2).toUpperCase())}</span>
              <span class="dgb-bp-route-copy">
                <strong>${escapeHtml(route.title)}</strong>
                <span>${escapeHtml(route.body)}</span>
                <code>${escapeHtml(route.path)}</code>
              </span>
              <span class="dgb-bp-route-badge">${current && current.id === route.id ? "Here" : "Open"}</span>
            </a>
          `).join("")}
        </div>
      </section>
    `).join("");

    const nodes = routeList.map((route) => `
      <a
        class="dgb-bp-map-node"
        href="${escapeHtml(route.path)}"
        data-current="${current && current.id === route.id ? "true" : "false"}"
        style="--bp-x:${Math.max(5, Math.min(95, route.x))};--bp-y:${Math.max(5, Math.min(95, route.y))};"
      >
        <b>${escapeHtml(route.group)}</b>
        <strong>${escapeHtml(route.title)}</strong>
        <span>${escapeHtml(route.path)}</span>
      </a>
    `).join("");

    return `
      <div class="dgb-bp-map-grid">
        <aside class="dgb-bp-panel">
          <div class="dgb-bp-panel-head">
            <b>You Are Here</b>
            <h3>${escapeHtml(current?.title || "Current Route")}</h3>
            <p>${escapeHtml(current?.body || "Current page detected from the site path.")}</p>
          </div>
          <div class="dgb-bp-you-are-here">
            <div class="dgb-bp-location-card">
              <b>Current Path</b>
              <strong>${escapeHtml(current?.title || "Unknown")}</strong>
              <code>${escapeHtml(normalizePath(window.location.pathname || "/"))}</code>
            </div>
            <div class="dgb-bp-chain">
              <a href="/">Compass</a>
              <span class="dgb-bp-chain-separator">→</span>
              <a href="/door/">Door</a>
              <span class="dgb-bp-chain-separator">→</span>
              <span>${escapeHtml(current?.title || "Here")}</span>
            </div>
          </div>
        </aside>

        <section class="dgb-bp-panel">
          <div class="dgb-bp-panel-head">
            <b>Route List</b>
            <h3>Site routes</h3>
            <p>Open a route or use the field map.</p>
          </div>
          <div class="dgb-bp-route-tools">
            ${groupMarkup || `<div class="dgb-bp-empty">No routes were found in the registry.</div>`}
          </div>
        </section>
      </div>

      <div class="dgb-bp-blueprint-field" aria-label="Blueprint field map">
        ${nodes}
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

    return `
      <div class="dgb-bp-instructions-grid">
        ${cards}
      </div>
    `;
  }

  function renderOverlay() {
    if (!overlay) return;

    const routeList = routes();
    const current = currentRoute(routeList);

    overlay.innerHTML = `
      <div class="dgb-bp-topbar">
        <div class="dgb-bp-titleblock">
          <div class="dgb-bp-kicker">Manor Blueprint · Global HUD</div>
          <h2 class="dgb-bp-title">${state.activeLens === "map" ? "Route Map" : "Instructions"}</h2>
          <p class="dgb-bp-subtitle">
            The map bubble is now a full-viewport drag control with mobile joystick-scroll behavior.
          </p>
        </div>
        <button class="dgb-bp-close" type="button" data-dgb-close aria-label="Close Manor Blueprint">×</button>
      </div>

      <div class="dgb-bp-main">
        <div class="dgb-bp-tabs">
          <div class="dgb-bp-tablist" role="tablist" aria-label="Manor Blueprint lenses">
            <button class="dgb-bp-tab" type="button" data-dgb-lens="map" aria-selected="${state.activeLens === "map"}" data-active="${state.activeLens === "map"}">Map</button>
            <button class="dgb-bp-tab" type="button" data-dgb-lens="instructions" aria-selected="${state.activeLens === "instructions"}" data-active="${state.activeLens === "instructions"}">Instructions</button>
          </div>
          <div class="dgb-bp-current-pill">${escapeHtml(current?.title || "Current Route")}</div>
        </div>

        <div class="dgb-bp-content">
          <section class="dgb-bp-lens" data-lens-panel="map" ${state.activeLens === "map" ? "" : "hidden"}>
            ${renderMapLens(routeList, current)}
          </section>
          <section class="dgb-bp-lens" data-lens-panel="instructions" ${state.activeLens === "instructions" ? "" : "hidden"}>
            ${renderInstructionsLens()}
          </section>
        </div>
      </div>
    `;

    overlay.querySelector("[data-dgb-close]")?.addEventListener("click", close);

    overlay.querySelectorAll("[data-dgb-lens]").forEach((button) => {
      button.addEventListener("click", () => setLens(button.getAttribute("data-dgb-lens") || "map"));
    });
  }

  function open() {
    if (!overlay) return;

    stopJoystickScroll();

    state.overlayOpen = true;
    state.lastAction = "open";

    renderOverlay();

    overlay.hidden = false;
    overlay.setAttribute("data-open", "true");

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
    state.activeLens = lens === "instructions" ? "instructions" : "map";
    state.lastAction = "set-lens:" + state.activeLens;
    renderOverlay();
    publishStatus();
  }

  function resetPosition() {
    clearStoredPosition();
    state.localStorageRepaired = true;
    applyPosition(defaultPosition(), "reset", true);
  }

  function joystickMetrics(clientY) {
    const v = viewport();
    const topZone = Math.max(96, Math.floor(v.height * 0.18));
    const bottomZone = Math.max(120, Math.floor(v.height * 0.22));
    const y = clientY - v.offsetTop;

    if (y < topZone) {
      const pressure = Math.max(0, Math.min(1, (topZone - y) / topZone));
      return {
        direction: "up",
        speed: MIN_SCROLL_SPEED + (MAX_SCROLL_SPEED - MIN_SCROLL_SPEED) * pressure
      };
    }

    if (y > v.height - bottomZone) {
      const pressure = Math.max(0, Math.min(1, (y - (v.height - bottomZone)) / bottomZone));
      return {
        direction: "down",
        speed: MIN_SCROLL_SPEED + (MAX_SCROLL_SPEED - MIN_SCROLL_SPEED) * pressure
      };
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

  function publishStatus() {
    const v = viewport();
    const m = safeMargins();
    const rect = bubble ? bubble.getBoundingClientRect() : null;
    const routeList = routes();
    const current = currentRoute(routeList);

    const payload = {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      apiContract: API_CONTRACT,

      active: true,
      siteWideBootstrap: true,
      perPageCustomCode: false,

      bubbleMounted: Boolean(bubble && document.body.contains(bubble)),
      overlayMounted: Boolean(overlay && document.body.contains(overlay)),
      overlayOpen: state.overlayOpen,

      fullViewportDrag: true,
      joystickScrollActive: true,
      joystickScrolling: state.joystickActive,
      joystickDirection: state.joystickDirection,
      joystickSpeed: Math.round(state.joystickSpeed * 100) / 100,

      activeLens: state.activeLens,
      currentPath: normalizePath(window.location.pathname || "/"),
      currentRouteId: current?.id || "",
      currentRouteTitle: current?.title || "",

      registryAvailable: Boolean(registry()),
      routeCount: routeList.length,

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
      document.documentElement.dataset.manorBlueprintFullViewportDrag = "true";
      document.documentElement.dataset.manorBlueprintJoystickScroll = "true";
      document.documentElement.dataset.manorBlueprintCurrentRoute = payload.currentRouteId;
      document.documentElement.dataset.manorBlueprintLens = state.activeLens;
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

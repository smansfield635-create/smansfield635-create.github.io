// TARGET FILE: /assets/manor-blueprint/manor.blueprint.js
// TNT FULL-FILE REPLACEMENT
// MANOR_BLUEPRINT_HUD_JS_SYNTAX_STABILIZATION_TNT_v2
//
// Purpose:
// Stabilize the Manor Blueprint HUD runtime so the fixed draggable bubble mounts
// before map/instruction rendering, avoids fragile multiline quoted strings,
// repairs stale mobile positions, and preserves global bootstrap compatibility.
//
// Public API compatibility contract:
// MANOR_BLUEPRINT_FIXED_DRAGGABLE_BUBBLE_FULLSCREEN_MAP_INSTRUCTIONS_TOGGLE_JS_TNT_v1
//
// Public implementation compatibility contract intentionally preserved for
// /assets/site.bootstrap.js freshness detection:
// MANOR_BLUEPRINT_MOBILE_SAFE_BUBBLE_POSITION_RENEWAL_TNT_v1
//
// Stabilization contract:
// MANOR_BLUEPRINT_HUD_JS_SYNTAX_STABILIZATION_TNT_v2
//
// Owns:
// - fixed draggable bubble
// - fullscreen map/instructions overlay
// - route registry consumption
// - fallback route/instruction data
// - mobile-safe position clamp / repair
// - status and receipt globals
//
// Does not own:
// - route HTML
// - site.bootstrap.js
// - CSS file contract
// - registry file contract
// - Audralia canvas/UI
// - water/hydration/final visual pass

(() => {
  "use strict";

  if (typeof window === "undefined" || typeof document === "undefined") return;

  const API_COMPAT_CONTRACT = "MANOR_BLUEPRINT_FIXED_DRAGGABLE_BUBBLE_FULLSCREEN_MAP_INSTRUCTIONS_TOGGLE_JS_TNT_v1";
  const PUBLIC_IMPLEMENTATION_CONTRACT = "MANOR_BLUEPRINT_MOBILE_SAFE_BUBBLE_POSITION_RENEWAL_TNT_v1";
  const STABILIZATION_CONTRACT = "MANOR_BLUEPRINT_HUD_JS_SYNTAX_STABILIZATION_TNT_v2";
  const PREVIOUS_IMPLEMENTATION_CONTRACT = "MANOR_BLUEPRINT_MOBILE_SAFE_BUBBLE_POSITION_RENEWAL_TNT_v1";

  const CONTROLLER_GLOBAL = "__DGB_MANOR_BLUEPRINT_MOBILE_SAFE_CONTROLLER__";
  const API_GLOBAL = "DGB_MANOR_BLUEPRINT_API";
  const STATUS_GLOBAL = "DGB_MANOR_BLUEPRINT_STATUS";
  const RECEIPT_GLOBAL = "DGB_MANOR_BLUEPRINT_RECEIPT";

  const REGISTRY_GLOBALS = [
    "DGB_MANOR_BLUEPRINT_REGISTRY",
    "DGB_MANOR_BLUEPRINT_ROUTE_REGISTRY"
  ];

  const BUBBLE_SELECTOR = "[data-dgb-blueprint-bubble]";
  const OVERLAY_SELECTOR = "[data-dgb-blueprint-overlay]";
  const STORAGE_KEY = "DGB_MANOR_BLUEPRINT_BUBBLE_POSITION_v1";

  const MOBILE_BREAKPOINT = 760;
  const MOBILE_SAFE_BOTTOM = 96;
  const DESKTOP_SAFE_BOTTOM = 20;

  const state = {
    active: true,
    mounted: false,
    overlayOpen: false,
    activeLens: "map",
    dragging: false,
    dragMoved: false,
    position: { x: 0, y: 0 },
    positionSource: "default",
    positionWasClamped: false,
    safeMargins: null,
    currentPath: normalizePath(window.location.pathname || "/"),
    currentRouteId: "unknown",
    currentRouteTitle: "Current Page",
    routeCount: 0,
    instructionCount: 0,
    errors: [],
    lastAction: "boot",
    startedAt: new Date().toISOString(),
    updatedAt: ""
  };

  let bubbleEl = null;
  let overlayEl = null;
  let styleEl = null;

  function nowIso() {
    return new Date().toISOString();
  }

  function recordError(scope, error) {
    state.errors.push({
      scope,
      message: error && error.message ? error.message : String(error || "unknown"),
      time: nowIso()
    });
    state.lastAction = "error:" + scope;
    publishStatus();
  }

  function normalizePath(path) {
    const raw = String(path || "/").split("?")[0].split("#")[0].trim() || "/";
    if (raw === "/") return "/";
    return raw.endsWith("/") ? raw : raw + "/";
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function getRegistry() {
    for (const key of REGISTRY_GLOBALS) {
      if (window[key] && typeof window[key] === "object") return window[key];
    }
    return null;
  }

  function fallbackRoutes() {
    return [
      { id: "compass", title: "Compass", path: "/", group: "Core", body: "Return to the main compass and entry field." },
      { id: "door", title: "Door", path: "/door/", group: "Core", body: "Enter through the threshold route." },
      { id: "home", title: "Home", path: "/home/", group: "Core", body: "Return to the home route." },
      { id: "showroom", title: "Showroom", path: "/showroom/", group: "Manor", body: "Enter the Manor showroom." },
      { id: "globe", title: "Globe Showcase", path: "/showroom/globe/", group: "Showroom", body: "Inspect the globe selector route." },
      { id: "audralia", title: "Audralia", path: "/showroom/globe/audralia/", group: "Audralia", body: "Open the Audralia route." },
      { id: "audralia-planet", title: "Audralia Planet", path: "/showroom/globe/audralia/planet/", group: "Audralia", body: "Inspect the Audralia future-body screen." },
      { id: "audralia-cockpit", title: "Audralia Cockpit", path: "/showroom/globe/audralia/disposition/", group: "Audralia", body: "Open the Audralia cockpit instruments." },
      { id: "products", title: "Products", path: "/products/", group: "Manor", body: "Review product-facing rooms." },
      { id: "gauges", title: "Gauges", path: "/gauges/", group: "Proof", body: "Open the route proof and audit rooms." },
      { id: "laws", title: "Laws", path: "/laws/", group: "Proof", body: "Open the law framework route." },
      { id: "frontier", title: "Frontier", path: "/frontier/", group: "Frontier", body: "Open the frontier hub." }
    ];
  }

  function fallbackInstructions() {
    return [
      { title: "Map", body: "Use Map to see the current route, nearby rooms, and available navigation paths." },
      { title: "Instructions", body: "Use Instructions to learn the site controls and the purpose of unique interface features." },
      { title: "Return to Orbit", body: "Return to Orbit brings you back to the main orbit or inspection section of the current page." },
      { title: "Floating Bubble", body: "The bubble stays fixed while you scroll and can be dragged away from text or buttons." },
      { title: "Drag", body: "Press and drag the bubble to move it. The position is saved and repaired if it becomes unsafe." },
      { title: "Mobile Safe Zone", body: "On phones, the bubble is clamped above browser controls and inside the visible viewport." },
      { title: "Fullscreen Overlay", body: "Opening the bubble displays a fullscreen overlay with Map and Instructions views." },
      { title: "You Are Here", body: "The active route is marked so visitors understand where they are inside the site." },
      { title: "Gauges", body: "Gauges are proof rooms that inspect whether a route, render, or contract is behaving as expected." },
      { title: "No Page-by-Page Code", body: "The Blueprint HUD is loaded globally through the site bootstrap instead of being hand-coded into every page." }
    ];
  }

  function getRoutes() {
    const registry = getRegistry();
    const rawRoutes = Array.isArray(registry && registry.routes) ? registry.routes : fallbackRoutes();

    const routes = rawRoutes.map((route, index) => {
      const path = normalizePath(route.path || route.href || route.url || "/");
      return {
        id: String(route.id || route.key || "route-" + index),
        title: String(route.title || route.label || route.name || path),
        path,
        group: String(route.group || route.family || "Route"),
        body: String(route.body || route.description || route.summary || "Open this route.")
      };
    });

    state.routeCount = routes.length;
    return routes;
  }

  function getInstructions() {
    const registry = getRegistry();
    const raw = Array.isArray(registry && registry.instructions) ? registry.instructions : fallbackInstructions();

    const instructions = raw.map((item, index) => ({
      title: String(item.title || item.label || "Instruction " + (index + 1)),
      body: String(item.body || item.text || item.description || "Read this instruction.")
    }));

    state.instructionCount = instructions.length;
    return instructions;
  }

  function findCurrentRoute(routes) {
    const exact = routes.find((route) => normalizePath(route.path) === state.currentPath);
    const fallback = exact || routes.find((route) => state.currentPath.startsWith(normalizePath(route.path)) && route.path !== "/") || routes[0];

    state.currentRouteId = fallback ? fallback.id : "unknown";
    state.currentRouteTitle = fallback ? fallback.title : document.title || "Current Page";
    return fallback;
  }

  function getViewport() {
    const visual = window.visualViewport || null;
    return {
      width: Math.max(320, Math.floor(visual ? visual.width : window.innerWidth || document.documentElement.clientWidth || 320)),
      height: Math.max(320, Math.floor(visual ? visual.height : window.innerHeight || document.documentElement.clientHeight || 640)),
      offsetLeft: Math.floor(visual ? visual.offsetLeft : 0),
      offsetTop: Math.floor(visual ? visual.offsetTop : 0),
      scale: visual ? visual.scale : 1
    };
  }

  function getSafeMargins() {
    const viewport = getViewport();
    const mobile = viewport.width <= MOBILE_BREAKPOINT;
    return {
      left: mobile ? 16 : 20,
      right: mobile ? 16 : 20,
      top: mobile ? 18 : 20,
      bottom: mobile ? MOBILE_SAFE_BOTTOM : DESKTOP_SAFE_BOTTOM,
      mode: mobile ? "mobile" : "desktop"
    };
  }

  function getBubbleSize() {
    if (!bubbleEl) return { width: 72, height: 72 };
    const rect = bubbleEl.getBoundingClientRect();
    return {
      width: rect.width > 10 ? rect.width : 72,
      height: rect.height > 10 ? rect.height : 72
    };
  }

  function clampPosition(position) {
    const viewport = getViewport();
    const margins = getSafeMargins();
    const size = getBubbleSize();

    const minX = margins.left + viewport.offsetLeft;
    const minY = margins.top + viewport.offsetTop;
    const maxX = viewport.offsetLeft + viewport.width - size.width - margins.right;
    const maxY = viewport.offsetTop + viewport.height - size.height - margins.bottom;

    const safeMaxX = Math.max(minX, maxX);
    const safeMaxY = Math.max(minY, maxY);

    const x = Math.min(Math.max(Number(position.x) || 0, minX), safeMaxX);
    const y = Math.min(Math.max(Number(position.y) || 0, minY), safeMaxY);

    return {
      x,
      y,
      clamped: x !== Number(position.x) || y !== Number(position.y),
      margins
    };
  }

  function defaultPosition() {
    const viewport = getViewport();
    const margins = getSafeMargins();
    const size = getBubbleSize();

    return {
      x: viewport.offsetLeft + viewport.width - size.width - margins.right,
      y: viewport.offsetTop + viewport.height - size.height - margins.bottom
    };
  }

  function readStoredPosition() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return null;
      if (!Number.isFinite(Number(parsed.x)) || !Number.isFinite(Number(parsed.y))) return null;
      return { x: Number(parsed.x), y: Number(parsed.y) };
    } catch (_error) {
      return null;
    }
  }

  function storePosition(position) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        x: Math.round(position.x),
        y: Math.round(position.y),
        contract: STABILIZATION_CONTRACT,
        time: nowIso()
      }));
    } catch (_error) {}
  }

  function applyBubblePosition(position, source) {
    if (!bubbleEl) return;

    const clamped = clampPosition(position);
    state.position = { x: clamped.x, y: clamped.y };
    state.positionSource = source || (clamped.clamped ? "repair" : "default");
    state.positionWasClamped = Boolean(clamped.clamped);
    state.safeMargins = clamped.margins;

    bubbleEl.style.setProperty("left", Math.round(clamped.x) + "px", "important");
    bubbleEl.style.setProperty("top", Math.round(clamped.y) + "px", "important");
    bubbleEl.style.setProperty("right", "auto", "important");
    bubbleEl.style.setProperty("bottom", "auto", "important");
    bubbleEl.style.setProperty("display", "grid", "important");
    bubbleEl.style.setProperty("visibility", "visible", "important");
    bubbleEl.style.setProperty("opacity", "1", "important");
    bubbleEl.style.setProperty("pointer-events", "auto", "important");

    if (clamped.clamped || source === "drag" || source === "reset") {
      storePosition(state.position);
    }

    publishStatus();
  }

  function initializePosition() {
    const stored = readStoredPosition();
    const source = stored ? "stored" : "default";
    const initial = stored || defaultPosition();
    const clamped = clampPosition(initial);
    const finalSource = clamped.clamped && stored ? "repair" : source;
    applyBubblePosition(initial, finalSource);
  }

  function injectStyle() {
    if (document.getElementById("dgb-manor-blueprint-hud-style")) return;

    styleEl = document.createElement("style");
    styleEl.id = "dgb-manor-blueprint-hud-style";
    styleEl.setAttribute("data-manor-blueprint-contract", STABILIZATION_CONTRACT);
    styleEl.textContent = `
      .dgb-blueprint-bubble{
        width:72px!important;
        height:72px!important;
        border-radius:999px!important;
        border:1px solid rgba(243,200,111,.72)!important;
        background:radial-gradient(circle at 30% 20%,rgba(255,255,255,.42),transparent 28%),linear-gradient(135deg,#fff2a8,#f3c86f)!important;
        color:#060811!important;
        box-shadow:0 18px 40px rgba(0,0,0,.42),0 0 26px rgba(243,200,111,.26)!important;
        place-items:center!important;
        font:900 11px/1 Inter,system-ui,sans-serif!important;
        letter-spacing:.08em!important;
        text-transform:uppercase!important;
        touch-action:none!important;
        user-select:none!important;
        -webkit-user-select:none!important;
      }
      .dgb-blueprint-bubble span{pointer-events:none!important;display:grid!important;gap:2px!important;text-align:center!important}
      .dgb-blueprint-bubble b{font-size:16px!important;line-height:1!important}
      .dgb-blueprint-bubble small{font-size:8px!important;letter-spacing:.12em!important}
      .dgb-blueprint-overlay{
        position:fixed!important;
        inset:0!important;
        z-index:99980!important;
        background:rgba(1,4,12,.94)!important;
        color:#fff4d8!important;
        overflow:auto!important;
        -webkit-overflow-scrolling:touch!important;
        padding:18px!important;
      }
      .dgb-blueprint-panel{
        width:min(1120px,100%)!important;
        margin:0 auto!important;
        border:1px solid rgba(243,200,111,.26)!important;
        border-radius:24px!important;
        background:linear-gradient(180deg,rgba(12,18,36,.96),rgba(4,8,18,.98))!important;
        box-shadow:0 30px 90px rgba(0,0,0,.55)!important;
        padding:18px!important;
      }
      .dgb-blueprint-top{
        display:flex!important;
        align-items:flex-start!important;
        justify-content:space-between!important;
        gap:14px!important;
        flex-wrap:wrap!important;
        margin-bottom:14px!important;
      }
      .dgb-blueprint-title{display:grid!important;gap:4px!important}
      .dgb-blueprint-title b{font-size:13px!important;letter-spacing:.14em!important;text-transform:uppercase!important;color:#f3c86f!important}
      .dgb-blueprint-title h2{margin:0!important;font-size:clamp(26px,6vw,48px)!important;line-height:.95!important;letter-spacing:-.05em!important;color:#fff4d8!important}
      .dgb-blueprint-actions{display:flex!important;gap:8px!important;flex-wrap:wrap!important}
      .dgb-blueprint-actions button,
      .dgb-blueprint-card a{
        border:1px solid rgba(243,200,111,.36)!important;
        border-radius:999px!important;
        min-height:38px!important;
        padding:8px 12px!important;
        background:rgba(255,255,255,.06)!important;
        color:#fff4d8!important;
        font:900 11px/1 Inter,system-ui,sans-serif!important;
        letter-spacing:.08em!important;
        text-transform:uppercase!important;
        cursor:pointer!important;
        text-decoration:none!important;
      }
      .dgb-blueprint-actions button[data-active="true"]{
        background:linear-gradient(135deg,#fff2a8,#f3c86f)!important;
        color:#05070d!important;
      }
      .dgb-blueprint-grid{
        display:grid!important;
        grid-template-columns:repeat(auto-fit,minmax(220px,1fr))!important;
        gap:10px!important;
      }
      .dgb-blueprint-card{
        border:1px solid rgba(184,205,255,.15)!important;
        border-radius:18px!important;
        padding:13px!important;
        background:rgba(255,255,255,.045)!important;
        display:grid!important;
        gap:8px!important;
      }
      .dgb-blueprint-card[data-current="true"]{
        border-color:rgba(243,200,111,.72)!important;
        box-shadow:0 0 0 1px rgba(243,200,111,.18),0 0 28px rgba(243,200,111,.10)!important;
      }
      .dgb-blueprint-card b{color:#f3c86f!important;font-size:11px!important;letter-spacing:.12em!important;text-transform:uppercase!important}
      .dgb-blueprint-card h3{margin:0!important;color:#fff4d8!important;font-size:18px!important;line-height:1.08!important}
      .dgb-blueprint-card p{margin:0!important;color:rgba(230,238,255,.80)!important;font-size:14px!important;line-height:1.42!important}
      @media(max-width:760px){
        .dgb-blueprint-bubble{width:68px!important;height:68px!important}
        .dgb-blueprint-overlay{padding:12px!important}
        .dgb-blueprint-panel{border-radius:18px!important;padding:14px!important}
      }
    `;

    (document.head || document.documentElement).appendChild(styleEl);
  }

  function createOrGetBubble() {
    const existing = document.querySelector(BUBBLE_SELECTOR);
    if (existing) {
      bubbleEl = existing;
      return bubbleEl;
    }

    bubbleEl = document.createElement("button");
    bubbleEl.type = "button";
    bubbleEl.className = "dgb-blueprint-bubble";
    bubbleEl.setAttribute("aria-label", "Open Manor Blueprint map and instructions");
    bubbleEl.setAttribute("data-dgb-blueprint-bubble", "true");
    bubbleEl.setAttribute("data-manor-blueprint-contract", STABILIZATION_CONTRACT);
    bubbleEl.innerHTML = "<span><b>◇</b><small>Map</small></span>";

    bubbleEl.style.cssText = [
      "position:fixed!important",
      "z-index:99990!important",
      "display:grid!important",
      "visibility:visible!important",
      "opacity:1!important",
      "pointer-events:auto!important",
      "overflow:visible!important",
      "left:0!important",
      "top:0!important"
    ].join(";");

    document.body.appendChild(bubbleEl);
    return bubbleEl;
  }

  function createOrGetOverlay() {
    const existing = document.querySelector(OVERLAY_SELECTOR);
    if (existing) {
      overlayEl = existing;
      return overlayEl;
    }

    overlayEl = document.createElement("section");
    overlayEl.className = "dgb-blueprint-overlay";
    overlayEl.setAttribute("data-dgb-blueprint-overlay", "true");
    overlayEl.setAttribute("data-manor-blueprint-contract", STABILIZATION_CONTRACT);
    overlayEl.setAttribute("aria-label", "Manor Blueprint map and instructions");
    overlayEl.style.setProperty("display", "none", "important");

    document.body.appendChild(overlayEl);
    return overlayEl;
  }

  function renderOverlay() {
    if (!overlayEl) return;

    const routes = getRoutes();
    const instructions = getInstructions();
    const current = findCurrentRoute(routes);

    const mapCards = routes.map((route) => {
      const isCurrent = current && route.id === current.id;
      return `
        <article class="dgb-blueprint-card" data-current="${isCurrent ? "true" : "false"}">
          <b>${escapeHtml(route.group)}${isCurrent ? " · You Are Here" : ""}</b>
          <h3>${escapeHtml(route.title)}</h3>
          <p>${escapeHtml(route.body)}</p>
          <a href="${escapeHtml(route.path)}">${isCurrent ? "Stay Here" : "Open Route"}</a>
        </article>
      `;
    }).join("");

    const instructionCards = instructions.map((item) => `
      <article class="dgb-blueprint-card">
        <b>Instruction</b>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.body)}</p>
      </article>
    `).join("");

    overlayEl.innerHTML = `
      <div class="dgb-blueprint-panel">
        <div class="dgb-blueprint-top">
          <div class="dgb-blueprint-title">
            <b>Manor Blueprint · ${escapeHtml(state.activeLens)}</b>
            <h2>${state.activeLens === "map" ? "Site Map" : "Instructions"}</h2>
            <p style="margin:0;color:rgba(230,238,255,.78);font:700 14px/1.45 Inter,system-ui,sans-serif;">
              Current route: ${escapeHtml(state.currentRouteTitle)}
            </p>
          </div>
          <div class="dgb-blueprint-actions">
            <button type="button" data-dgb-blueprint-lens="map" data-active="${state.activeLens === "map" ? "true" : "false"}">Map</button>
            <button type="button" data-dgb-blueprint-lens="instructions" data-active="${state.activeLens === "instructions" ? "true" : "false"}">Instructions</button>
            <button type="button" data-dgb-blueprint-reset>Reset Bubble</button>
            <button type="button" data-dgb-blueprint-close>Close</button>
          </div>
        </div>
        <div class="dgb-blueprint-grid">
          ${state.activeLens === "map" ? mapCards : instructionCards}
        </div>
      </div>
    `;

    overlayEl.querySelectorAll("[data-dgb-blueprint-lens]").forEach((button) => {
      button.addEventListener("click", () => setLens(button.getAttribute("data-dgb-blueprint-lens") || "map"));
    });

    const close = overlayEl.querySelector("[data-dgb-blueprint-close]");
    if (close) close.addEventListener("click", closeOverlay);

    const reset = overlayEl.querySelector("[data-dgb-blueprint-reset]");
    if (reset) reset.addEventListener("click", resetPosition);
  }

  function openOverlay() {
    createOrGetOverlay();
    state.overlayOpen = true;
    state.lastAction = "open";
    renderOverlay();
    overlayEl.style.setProperty("display", "block", "important");
    overlayEl.setAttribute("data-open", "true");
    publishStatus();
  }

  function closeOverlay() {
    if (!overlayEl) return;
    state.overlayOpen = false;
    state.lastAction = "close";
    overlayEl.style.setProperty("display", "none", "important");
    overlayEl.setAttribute("data-open", "false");
    publishStatus();
  }

  function toggleOverlay() {
    if (state.overlayOpen) closeOverlay();
    else openOverlay();
  }

  function setLens(lens) {
    state.activeLens = lens === "instructions" ? "instructions" : "map";
    state.lastAction = "set-lens:" + state.activeLens;
    renderOverlay();
    publishStatus();
  }

  function resetPosition() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (_error) {}
    applyBubblePosition(defaultPosition(), "reset");
  }

  function attachBubbleEvents() {
    if (!bubbleEl || bubbleEl.__dgbBlueprintEventsAttached) return;
    bubbleEl.__dgbBlueprintEventsAttached = true;

    let startX = 0;
    let startY = 0;
    let baseX = 0;
    let baseY = 0;
    let pointerId = null;

    bubbleEl.addEventListener("pointerdown", (event) => {
      state.dragging = true;
      state.dragMoved = false;
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      baseX = state.position.x;
      baseY = state.position.y;

      try {
        bubbleEl.setPointerCapture(pointerId);
      } catch (_error) {}

      state.lastAction = "drag-start";
      publishStatus();
    });

    bubbleEl.addEventListener("pointermove", (event) => {
      if (!state.dragging) return;

      const dx = event.clientX - startX;
      const dy = event.clientY - startY;

      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) state.dragMoved = true;

      applyBubblePosition({ x: baseX + dx, y: baseY + dy }, "drag");
      event.preventDefault();
    }, { passive: false });

    bubbleEl.addEventListener("pointerup", () => {
      if (!state.dragging) return;

      try {
        if (pointerId !== null) bubbleEl.releasePointerCapture(pointerId);
      } catch (_error) {}

      state.dragging = false;
      state.lastAction = state.dragMoved ? "drag-end" : "tap";

      if (!state.dragMoved) toggleOverlay();
      else storePosition(state.position);

      publishStatus();
    });

    bubbleEl.addEventListener("pointercancel", () => {
      state.dragging = false;
      state.lastAction = "drag-cancel";
      publishStatus();
    });
  }

  function getBubbleRect() {
    if (!bubbleEl) return null;
    const rect = bubbleEl.getBoundingClientRect();
    return {
      x: rect.x,
      y: rect.y,
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height
    };
  }

  function isMobileSafe(rect, margins, viewport) {
    if (!rect || !margins || margins.mode !== "mobile") return margins && margins.mode === "desktop";
    return (
      rect.left >= margins.left - 1 &&
      rect.top >= margins.top - 1 &&
      rect.right <= viewport.width - margins.right + 1 &&
      rect.bottom <= viewport.height - Math.min(80, margins.bottom) + 1
    );
  }

  function publishStatus() {
    const viewport = getViewport();
    const rect = getBubbleRect();
    const margins = state.safeMargins || getSafeMargins();

    const payload = {
      contract: STABILIZATION_CONTRACT,
      apiContract: API_COMPAT_CONTRACT,
      implementationContract: PUBLIC_IMPLEMENTATION_CONTRACT,
      stabilizationContract: STABILIZATION_CONTRACT,
      previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
      active: true,
      bubbleMounted: Boolean(bubbleEl && document.body.contains(bubbleEl)),
      overlayMounted: Boolean(overlayEl && document.body.contains(overlayEl)),
      overlayOpen: state.overlayOpen,
      activeLens: state.activeLens,
      currentPath: state.currentPath,
      currentRouteId: state.currentRouteId,
      currentRouteTitle: state.currentRouteTitle,
      registryAvailable: Boolean(getRegistry()),
      routeCount: state.routeCount,
      instructionCount: state.instructionCount,
      fixedBubble: true,
      fullScreenOverlay: true,
      mapInstructionsToggle: true,
      draggable: true,
      mobileSafePosition: Boolean(isMobileSafe(rect, margins, viewport)),
      safeMargins: margins,
      positionSource: state.positionSource,
      positionWasClamped: state.positionWasClamped,
      bubblePosition: { ...state.position },
      bubbleRect: rect,
      viewportWidth: viewport.width,
      viewportHeight: viewport.height,
      visualViewportUsed: Boolean(window.visualViewport),
      localStorageKey: STORAGE_KEY,
      imageGeneration: false,
      graphicBox: false,
      heavyRuntime: false,
      webGL: false,
      canvasMapEngine: false,
      perPageCustomCode: false,
      errors: state.errors.slice(),
      lastAction: state.lastAction,
      startedAt: state.startedAt,
      updatedAt: nowIso()
    };

    window[STATUS_GLOBAL] = payload;
    window[RECEIPT_GLOBAL] = payload;

    try {
      document.documentElement.dataset.manorBlueprintActive = "true";
      document.documentElement.dataset.manorBlueprintContract = STABILIZATION_CONTRACT;
      document.documentElement.dataset.manorBlueprintImplementationContract = PUBLIC_IMPLEMENTATION_CONTRACT;
      document.documentElement.dataset.manorBlueprintStabilizationContract = STABILIZATION_CONTRACT;
      document.documentElement.dataset.manorBlueprintOverlayOpen = state.overlayOpen ? "true" : "false";
      document.documentElement.dataset.manorBlueprintFixedBubble = "true";
      document.documentElement.dataset.manorBlueprintFullscreenOverlay = "true";
      document.documentElement.dataset.manorBlueprintMobileSafePosition = payload.mobileSafePosition ? "true" : "false";
    } catch (_error) {}

    return payload;
  }

  function status() {
    return publishStatus();
  }

  function refresh() {
    try {
      createOrGetBubble();
      createOrGetOverlay();
      attachBubbleEvents();
      renderOverlay();
      applyBubblePosition(state.position || defaultPosition(), "repair");
      state.lastAction = "refresh";
      return publishStatus();
    } catch (error) {
      recordError("refresh", error);
      return publishStatus();
    }
  }

  function exposeApi() {
    const api = {
      contract: API_COMPAT_CONTRACT,
      implementationContract: PUBLIC_IMPLEMENTATION_CONTRACT,
      stabilizationContract: STABILIZATION_CONTRACT,
      previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
      refresh,
      open: openOverlay,
      close: closeOverlay,
      toggle: toggleOverlay,
      setLens,
      resetPosition,
      status
    };

    window[API_GLOBAL] = api;
    window[CONTROLLER_GLOBAL] = api;
  }

  function mount() {
    try {
      injectStyle();
      createOrGetBubble();
      createOrGetOverlay();
      exposeApi();

      state.mounted = true;
      state.lastAction = "mounted";

      attachBubbleEvents();
      renderOverlay();
      initializePosition();

      window.addEventListener("resize", () => applyBubblePosition(state.position, "repair"), { passive: true });
      window.addEventListener("orientationchange", () => {
        window.setTimeout(() => applyBubblePosition(state.position, "repair"), 250);
      }, { passive: true });

      if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", () => applyBubblePosition(state.position, "repair"), { passive: true });
        window.visualViewport.addEventListener("scroll", () => applyBubblePosition(state.position, "repair"), { passive: true });
      }

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeOverlay();
      });

      publishStatus();
    } catch (error) {
      recordError("mount", error);
    }
  }

  if (
    window[CONTROLLER_GLOBAL] &&
    window[CONTROLLER_GLOBAL].stabilizationContract === STABILIZATION_CONTRACT &&
    typeof window[CONTROLLER_GLOBAL].refresh === "function"
  ) {
    try {
      window[CONTROLLER_GLOBAL].refresh();
    } catch (_error) {}
    return;
  }

  exposeApi();
  publishStatus();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();

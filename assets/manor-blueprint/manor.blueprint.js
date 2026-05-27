// TARGET FILE: /assets/manor-blueprint/manor.blueprint.js
// TNT FULL-FILE REPLACEMENT
// MANOR_BLUEPRINT_VALUE_CATEGORY_ESTATE_LANGUAGE_RUNTIME_TNT_v1
//
// Purpose:
// Render the Manor Blueprint Portal as a value-category estate map instead
// of a route/path/cardinal file directory.
//
// Previous runtime contract:
// MANOR_BLUEPRINT_MENU_CATEGORY_OWNERSHIP_RUNTIME_TNT_v1
//
// Compatibility API contract preserved:
// MANOR_BLUEPRINT_FIXED_DRAGGABLE_BUBBLE_FULLSCREEN_MAP_INSTRUCTIONS_TOGGLE_JS_TNT_v1
//
// Owns:
// - Map / Portal blip
// - Mirrorland Doors / Main Menu / Instructions lenses
// - value-category estate room rendering
// - current-room detection
// - visitor-facing room labels
// - hidden builder path / visible room identity separation
// - full-viewport drag
// - strong-visible joystick scroll
// - status / receipt globals
//
// Does not own:
// - registry source truth
// - CSS source truth
// - page content
// - planet renderers
// - Frontier node animation
// - Gauges logic
// - generated images
// - GraphicBox

(() => {
  "use strict";

  if (typeof window === "undefined" || typeof document === "undefined") return;

  const CONTRACT = "MANOR_BLUEPRINT_VALUE_CATEGORY_ESTATE_LANGUAGE_RUNTIME_TNT_v1";
  const PREVIOUS_CONTRACT = "MANOR_BLUEPRINT_MENU_CATEGORY_OWNERSHIP_RUNTIME_TNT_v1";
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
  const JOYSTICK_SCROLL_FORCE_PROFILE = "strong-visible";
  const MOBILE_BREAKPOINT = 760;

  const FALLBACK_CATEGORIES = Object.freeze([
    { key: "arrival", label: "Arrival", shortLabel: "Arrival", purpose: "Orient, enter, and cross the public threshold.", order: 10 },
    { key: "world-study", label: "World Study", shortLabel: "Worlds", purpose: "Study worlds, maps, planetary rooms, and living environments.", order: 20 },
    { key: "control-instruments", label: "Control / Instruments", shortLabel: "Controls", purpose: "Operate cockpits, instruments, labs, inspections, and readiness surfaces.", order: 30 },
    { key: "workshop-frontier", label: "Workshop / Frontier Systems", shortLabel: "Workshop", purpose: "Pressure-test applied systems before they become living-world infrastructure.", order: 40 },
    { key: "law-governance-proof", label: "Law / Governance / Proof", shortLabel: "Proof", purpose: "Study rules, boundaries, governance, proof, and accountability.", order: 50 },
    { key: "public-product-value", label: "Public / Product Value", shortLabel: "Products", purpose: "Open usable offers, public identity, tools, and visitor-facing value.", order: 60 },
    { key: "story-cast-universe", label: "Story / Cast / Universe", shortLabel: "Story", purpose: "Enter characters, story rooms, universe context, and narrative immersion.", order: 70 }
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
    pointerClientY: 0,
    baseX: 0,
    baseY: 0,
    position: { x: 0, y: 0 },
    positionSource: "boot",
    positionWasClamped: false,
    joystickActive: false,
    joystickDirection: "none",
    joystickSpeed: 0,
    lastAction: "boot",
    errors: []
  };

  if (window[CONTROLLER_GLOBAL] && typeof window[CONTROLLER_GLOBAL].stop === "function") {
    try { window[CONTROLLER_GLOBAL].stop(); } catch (_error) {}
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function normalizePath(path) {
    let clean = String(path || "/").split("?")[0].split("#")[0] || "/";
    if (!clean.startsWith("/")) clean = "/" + clean;
    clean = clean.replace(/\/{2,}/g, "/");
    return clean === "/" ? "/" : clean.replace(/\/?$/, "/");
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function registryApi() {
    return window.DGB_MANOR_BLUEPRINT_REGISTRY || null;
  }

  function registryRoutes() {
    const api = registryApi();

    if (Array.isArray(api?.routes)) return api.routes;
    if (Array.isArray(window.DGB_MANOR_BLUEPRINT_ROUTE_REGISTRY)) return window.DGB_MANOR_BLUEPRINT_ROUTE_REGISTRY;

    return [];
  }

  function categories() {
    const api = registryApi();
    const source = Array.isArray(api?.valueCategories) ? api.valueCategories : FALLBACK_CATEGORIES;
    return source.slice().sort((a, b) => Number(a.order || 999) - Number(b.order || 999));
  }

  function instructions() {
    const api = registryApi();
    const source = Array.isArray(api?.instructions)
      ? api.instructions
      : Array.isArray(window.DGB_MANOR_BLUEPRINT_INSTRUCTIONS)
        ? window.DGB_MANOR_BLUEPRINT_INSTRUCTIONS
        : [];

    if (source.length) return source;

    return [
      {
        title: "File Name Is Not Room Identity",
        body: "Builder paths stay hidden. The visitor sees the estate-room identity."
      },
      {
        title: "Value Category First",
        body: "Rooms are grouped by the value they give the visitor."
      },
      {
        title: "ZIONTS / Zience",
        body: "The route under Earth displays as ZIONTS, pronounced Zience."
      }
    ];
  }

  function routeFromRaw(input) {
    const path = normalizePath(input.path || input.href || "/");
    const publicRoomName = String(input.publicRoomName || input.title || input.shortTitle || "Estate Room");
    const valueCategory = String(input.valueCategory || "arrival");

    return Object.freeze({
      routeId: String(input.routeId || input.id || publicRoomName.toLowerCase().replace(/[^a-z0-9]+/g, "-")),
      path,
      href: path,
      builderPathHidden: String(input.builderPathHidden || path),
      technicalLabelHidden: String(input.technicalLabelHidden || input.title || path),

      title: String(input.title || publicRoomName),
      shortTitle: String(input.shortTitle || publicRoomName),
      publicRoomName,
      estateLocation: String(input.estateLocation || input.wing || "Estate Room"),
      valueCategory,
      valueCategoryLabel: String(input.valueCategoryLabel || categoryLabel(valueCategory)),
      valueCategoryShortLabel: String(input.valueCategoryShortLabel || categoryShortLabel(valueCategory)),
      visitorPurpose: String(input.visitorPurpose || input.description || "Open this estate room."),
      visitorAction: String(input.visitorAction || "Enter Room"),
      shortContext: String(input.shortContext || input.visitorPurpose || input.description || "Open this estate room."),
      deepContext: String(input.deepContext || input.body || input.shortContext || input.visitorPurpose || "This room has a visitor-facing purpose."),
      estateMeaning: String(input.estateMeaning || input.deepContext || input.shortContext || input.visitorPurpose || "This room has a visitor-facing purpose."),

      menu: String(input.menu || (input.mirrorlandDoor || input.mirrorlandAligned ? "mirrorland" : "main")),
      group: String(input.group || (input.menu === "main" ? "Main Menu / Website Options" : "Mirrorland Doors")),
      parent: input.parent ? normalizePath(input.parent) : "",
      priority: Number.isFinite(Number(input.priority)) ? Number(input.priority) : 50,
      showInBlueprint: input.showInBlueprint !== false,
      mirrorlandAligned: Boolean(input.mirrorlandAligned || input.mirrorlandDoor),
      mirrorlandDoor: Boolean(input.mirrorlandDoor),
      websiteOption: Boolean(input.websiteOption)
    });
  }

  function categoryLabel(key) {
    return categories().find((item) => item.key === key)?.label || "Arrival";
  }

  function categoryShortLabel(key) {
    return categories().find((item) => item.key === key)?.shortLabel || "Arrival";
  }

  function allRoutes() {
    return registryRoutes().map(routeFromRaw).filter((item) => item.showInBlueprint);
  }

  function routesForLens(lens) {
    const menu = lens === "main" ? "main" : "mirrorland";

    return allRoutes()
      .filter((item) => item.menu === menu)
      .sort((a, b) => b.priority - a.priority || a.publicRoomName.localeCompare(b.publicRoomName));
  }

  function currentRoute(routes) {
    const path = normalizePath(window.location.pathname || "/");
    const source = routes && routes.length ? routes : allRoutes();

    return source.find((item) => item.path === path) ||
      source
        .filter((item) => item.path !== "/" && path.startsWith(item.path))
        .sort((a, b) => b.path.length - a.path.length || b.priority - a.priority)[0] ||
      source.find((item) => item.path === "/") ||
      source[0] ||
      null;
  }

  function groupedByValueCategory(routes) {
    const grouped = new Map();

    for (const category of categories()) grouped.set(category.key, []);

    for (const route of routes) {
      if (!grouped.has(route.valueCategory)) grouped.set(route.valueCategory, []);
      grouped.get(route.valueCategory).push(route);
    }

    for (const [key, list] of grouped.entries()) {
      grouped.set(key, list.sort((a, b) => b.priority - a.priority || a.publicRoomName.localeCompare(b.publicRoomName)));
    }

    return grouped;
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
      ? { left: 14, right: 14, top: 14, bottom: 14 }
      : { left: 16, right: 16, top: 16, bottom: 16 };
  }

  function bubbleSize() {
    if (!bubble) return { width: 68, height: 68 };
    const rect = bubble.getBoundingClientRect();
    return { width: rect.width > 10 ? rect.width : 68, height: rect.height > 10 ? rect.height : 68 };
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
      const x = Number(parsed?.x);
      const y = Number(parsed?.y);
      if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
      return { x, y };
    } catch (_error) {
      return null;
    }
  }

  function savePosition(pos) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        x: Math.round(pos.x),
        y: Math.round(pos.y),
        contract: CONTRACT,
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

  function initializePosition() {
    const stored = readStoredPosition();
    applyPosition(stored || defaultPosition(), stored ? "stored" : "upper-right-safe-anchor", Boolean(!stored));
  }

  function enforceSingleElement(selector) {
    const nodes = Array.from(document.querySelectorAll(selector));
    const keeper = nodes[0] || null;

    nodes.slice(1).forEach((node) => {
      try { node.remove(); } catch (_error) {}
    });

    return keeper;
  }

  function createBubble() {
    bubble = enforceSingleElement(BUBBLE_SELECTOR);
    if (bubble) return bubble;

    bubble = document.createElement("button");
    bubble.type = "button";
    bubble.className = "dgb-blueprint-bubble";
    bubble.setAttribute("aria-label", "Open Mirrorland Map Portal");
    bubble.setAttribute("data-dgb-blueprint-bubble", "true");
    bubble.setAttribute("data-manor-blueprint-contract", CONTRACT);
    bubble.setAttribute("data-value-category-estate-language", "true");
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
    overlay.setAttribute("data-value-category-estate-language", "true");
    overlay.setAttribute("aria-label", "Mirrorland estate map portal");

    document.body.appendChild(overlay);
    return overlay;
  }

  function lensTitle() {
    if (state.activeLens === "main") return "Main Menu";
    if (state.activeLens === "instructions") return "Instructions";
    return "Mirrorland Doors";
  }

  function lensSubtitle() {
    if (state.activeLens === "main") {
      return "Regular website rooms. These support the estate without becoming Mirrorland doors.";
    }

    if (state.activeLens === "instructions") {
      return "The public map uses estate-room identity. Builder file paths stay hidden unless inspected by code.";
    }

    return "Choose rooms by visitor value: arrival, worlds, instruments, workshop systems, proof, products, and story.";
  }

  function renderCurrentPanel(routes, mode) {
    const current = currentRoute(routes);
    const label = mode === "main" ? "Website Position" : "Estate Position";

    return `
      <aside class="dgb-bp-current-card" data-current-room="${escapeHtml(current?.routeId || "")}">
        <span class="dgb-bp-chip">${escapeHtml(label)}</span>
        <h3>${escapeHtml(current?.publicRoomName || lensTitle())}</h3>
        <p>${escapeHtml(current?.shortContext || "Choose a room from the estate map.")}</p>
        <div class="dgb-bp-location-strip">
          <span>${escapeHtml(current?.valueCategoryLabel || "Arrival")}</span>
          <span>${escapeHtml(current?.estateLocation || "Estate")}</span>
        </div>
      </aside>
    `;
  }

  function renderRoomCard(item) {
    const isCurrent = normalizePath(window.location.pathname || "/") === item.path;

    return `
      <article
        class="dgb-bp-value-card${isCurrent ? " dgb-bp-value-card-current" : ""}"
        data-route-id="${escapeHtml(item.routeId)}"
        data-value-category="${escapeHtml(item.valueCategory)}"
        data-current="${isCurrent ? "true" : "false"}"
        data-builder-path="${escapeHtml(item.builderPathHidden)}"
        data-technical-label="${escapeHtml(item.technicalLabelHidden)}"
      >
        <div class="dgb-bp-value-card-top">
          <span class="dgb-bp-value-badge">${escapeHtml(item.valueCategoryShortLabel)}</span>
          <span class="dgb-bp-estate-location">${escapeHtml(item.estateLocation)}</span>
        </div>

        <h4>${escapeHtml(item.publicRoomName)}</h4>
        <p>${escapeHtml(item.visitorPurpose)}</p>

        <details class="dgb-bp-room-details">
          <summary>Read room</summary>
          <div class="dgb-bp-room-details-body">
            <b>What this room is</b>
            <p>${escapeHtml(item.shortContext)}</p>
            <b>Why it matters</b>
            <p>${escapeHtml(item.deepContext)}</p>
            <b>Where it sits</b>
            <p>${escapeHtml(item.estateLocation)} · ${escapeHtml(item.valueCategoryLabel)}</p>
          </div>
        </details>

        <a class="dgb-bp-room-action" href="${escapeHtml(item.href)}">
          ${escapeHtml(item.visitorAction)}
        </a>
      </article>
    `;
  }

  function renderCategorySection(category, routes) {
    if (!routes.length) return "";

    return `
      <section class="dgb-bp-value-section" data-value-category="${escapeHtml(category.key)}">
        <header class="dgb-bp-value-section-head">
          <span>${escapeHtml(category.shortLabel || category.label)}</span>
          <h3>${escapeHtml(category.label)}</h3>
          <p>${escapeHtml(category.purpose || "Choose a room.")}</p>
        </header>
        <div class="dgb-bp-value-grid">
          ${routes.map(renderRoomCard).join("")}
        </div>
      </section>
    `;
  }

  function renderEstateMap(mode) {
    const routes = routesForLens(mode);
    const grouped = groupedByValueCategory(routes);

    return `
      <div class="dgb-bp-estate-layout">
        ${renderCurrentPanel(routes, mode)}
        <div class="dgb-bp-estate-map" data-estate-map="value-category">
          ${categories().map((category) => renderCategorySection(category, grouped.get(category.key) || [])).join("")}
        </div>
      </div>
    `;
  }

  function renderInstructionsLens() {
    return `
      <div class="dgb-bp-instructions-grid">
        ${instructions().map((item, index) => `
          <article class="dgb-bp-instruction-card">
            <b>Instruction ${index + 1}</b>
            <h3>${escapeHtml(item.title || "Instruction")}</h3>
            <p>${escapeHtml(item.body || item.description || "Read this instruction.")}</p>
          </article>
        `).join("")}
      </div>
    `;
  }

  function renderActiveLens() {
    if (state.activeLens === "main") return renderEstateMap("main");
    if (state.activeLens === "instructions") return renderInstructionsLens();
    return renderEstateMap("mirrorland");
  }

  function renderOverlay() {
    if (!overlay) return;

    overlay.innerHTML = `
      <div class="dgb-bp-topbar">
        <div class="dgb-bp-titleblock">
          <div class="dgb-bp-kicker">Mirrorland House Blueprint</div>
          <h2 class="dgb-bp-title">${escapeHtml(lensTitle())}</h2>
          <p class="dgb-bp-subtitle">${escapeHtml(lensSubtitle())}</p>
        </div>
        <button class="dgb-bp-close" type="button" data-dgb-close aria-label="Close Map Portal">×</button>
      </div>

      <div class="dgb-bp-main">
        <div class="dgb-bp-tabs">
          <div class="dgb-bp-tablist" role="tablist" aria-label="Map Portal lenses">
            <button class="dgb-bp-tab" type="button" data-dgb-lens="mirrorland" aria-selected="${state.activeLens === "mirrorland"}" data-active="${state.activeLens === "mirrorland"}">Mirrorland Doors</button>
            <button class="dgb-bp-tab" type="button" data-dgb-lens="main" aria-selected="${state.activeLens === "main"}" data-active="${state.activeLens === "main"}">Main Menu</button>
            <button class="dgb-bp-tab" type="button" data-dgb-lens="instructions" aria-selected="${state.activeLens === "instructions"}" data-active="${state.activeLens === "instructions"}">Instructions</button>
          </div>
          <div class="dgb-bp-current-pill">${state.activeLens === "main" ? "Website Rooms" : state.activeLens === "instructions" ? "How To Read" : "Estate Rooms"}</div>
        </div>

        <div class="dgb-bp-content" data-value-category-estate-language="true">
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
    const clean = lens === "main" || lens === "instructions" ? lens : "mirrorland";
    state.activeLens = clean;
    state.lastAction = "set-lens:" + clean;

    if (overlay) overlay.setAttribute("data-active-lens", clean);

    renderOverlay();
    publishStatus();
  }

  function resetPosition() {
    try { window.localStorage.removeItem(STORAGE_KEY); } catch (_error) {}
    applyPosition(defaultPosition(), "reset", true);
  }

  function joystickSpeedFromPressure(pressure) {
    const cleanPressure = Math.max(0, Math.min(1, Number(pressure) || 0));
    return (MIN_SCROLL_SPEED + (MAX_SCROLL_SPEED - MIN_SCROLL_SPEED) * cleanPressure) * JOYSTICK_SCROLL_FORCE_MULTIPLIER;
  }

  function joystickMetrics(clientY) {
    const v = viewport();
    const topZone = Math.max(96, Math.floor(v.height * 0.18));
    const bottomZone = Math.max(120, Math.floor(v.height * 0.22));
    const y = clientY - v.offsetTop;

    if (y < topZone) {
      return { direction: "up", speed: joystickSpeedFromPressure((topZone - y) / topZone) };
    }

    if (y > v.height - bottomZone) {
      return { direction: "down", speed: joystickSpeedFromPressure((y - (v.height - bottomZone)) / bottomZone) };
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
      try { window.cancelAnimationFrame(joystickRaf); } catch (_error) {}
    }

    joystickRaf = 0;
    state.joystickActive = false;
    state.joystickDirection = "none";
    state.joystickSpeed = 0;
  }

  function attachDrag() {
    if (!bubble || bubble.__dgbValueCategoryDragAttached) return;
    bubble.__dgbValueCategoryDragAttached = true;

    bubble.addEventListener("pointerdown", (event) => {
      if (state.overlayOpen) return;

      state.dragging = true;
      state.dragMoved = false;
      state.pointerId = event.pointerId;
      state.pointerStartX = event.clientX;
      state.pointerStartY = event.clientY;
      state.pointerClientY = event.clientY;
      state.baseX = state.position.x;
      state.baseY = state.position.y;
      state.lastAction = "pointerdown";

      bubble.setAttribute("data-dragging", "true");

      try { bubble.setPointerCapture(event.pointerId); } catch (_error) {}

      startJoystickScroll();
      publishStatus();
      event.preventDefault();
    }, { passive: false });

    bubble.addEventListener("pointermove", (event) => {
      if (!state.dragging) return;

      state.pointerClientY = event.clientY;

      const dx = event.clientX - state.pointerStartX;
      const dy = event.clientY - state.pointerStartY;
      const distance = Math.hypot(dx, dy);

      if (distance > TAP_MOVE_THRESHOLD) state.dragMoved = true;

      applyPosition({ x: state.baseX + dx, y: state.baseY + dy }, state.dragMoved ? "drag-full-viewport" : "tap-pending", false);

      startJoystickScroll();
      event.preventDefault();
    }, { passive: false });

    function release(event) {
      if (!state.dragging) return;

      state.dragging = false;
      state.pointerId = null;
      bubble.removeAttribute("data-dragging");

      stopJoystickScroll();

      try { bubble.releasePointerCapture(event.pointerId); } catch (_error) {}

      if (state.dragMoved) {
        state.lastAction = "drag-release";
        savePosition(state.position);
        publishStatus();
      } else {
        state.lastAction = "tap-toggle";
        toggle();
      }

      try { event.preventDefault(); } catch (_error2) {}
    }

    bubble.addEventListener("pointerup", release, { passive: false });
    bubble.addEventListener("pointercancel", release, { passive: false });
    bubble.addEventListener("lostpointercapture", release, { passive: false });
  }

  function publishStatus() {
    const v = viewport();
    const rect = bubble ? bubble.getBoundingClientRect() : null;
    const activeRoutes = state.activeLens === "main" ? routesForLens("main") : routesForLens("mirrorland");
    const current = currentRoute(activeRoutes) || currentRoute(allRoutes());

    const payload = {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      apiContract: API_CONTRACT,
      active: true,

      valueCategoryEstateLanguageActive: true,
      builderPathHiddenFromVisitorCards: true,
      fileNameIsNotRoomIdentity: true,
      ziontsVisibleIdentity: true,
      ziontsSpelling: "ZIONTS",
      ziontsPronunciation: "Zience",
      earthRouteDisplayedAsZionts: true,
      gaugesDisplayedAsTheLab: true,
      frontierWorkshopYardLabelActive: true,

      mapBlipSingleEntryway: true,
      mirrorlandEntryway: "map_portal_blip",
      mainMenuWebsiteOptionsOnly: true,
      mirrorlandDoorsCategoryOnly: true,
      supportDoesNotEqualOwnership: true,

      bubbleMounted: Boolean(bubble && document.body.contains(bubble)),
      overlayMounted: Boolean(overlay && document.body.contains(overlay)),
      overlayOpen: state.overlayOpen,

      activeLens: state.activeLens,
      currentPath: normalizePath(window.location.pathname || "/"),
      currentRouteId: current?.routeId || "",
      currentPublicRoomName: current?.publicRoomName || "",
      currentEstateLocation: current?.estateLocation || "",
      currentValueCategory: current?.valueCategory || "",

      routeCount: allRoutes().length,
      mirrorlandRoomCount: routesForLens("mirrorland").length,
      mainMenuRoomCount: routesForLens("main").length,
      valueCategoryCount: categories().length,
      registryAvailable: Boolean(registryApi()),

      fullViewportDrag: true,
      joystickScrollActive: true,
      joystickScrolling: state.joystickActive,
      joystickDirection: state.joystickDirection,
      joystickSpeed: Math.round(state.joystickSpeed * 100) / 100,
      joystickScrollForceProfile: JOYSTICK_SCROLL_FORCE_PROFILE,

      fixedBubble: true,
      fullScreenOverlay: true,
      mobileSafePosition: Boolean(
        rect &&
        rect.left >= v.offsetLeft - 1 &&
        rect.top >= v.offsetTop - 1 &&
        rect.right <= v.offsetLeft + v.width + 1 &&
        rect.bottom <= v.offsetTop + v.height + 1
      ),

      positionSource: state.positionSource,
      positionWasClamped: state.positionWasClamped,
      bubblePosition: { ...state.position },

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
      document.documentElement.dataset.manorBlueprintValueCategoryEstateLanguage = "true";
      document.documentElement.dataset.manorBlueprintBuilderPathHidden = "true";
      document.documentElement.dataset.manorBlueprintFileNameIsNotRoomIdentity = "true";
      document.documentElement.dataset.manorBlueprintZiontsVisibleIdentity = "true";
      document.documentElement.dataset.manorBlueprintGaugesDisplayedAsTheLab = "true";
      document.documentElement.dataset.manorBlueprintFrontierWorkshopYard = "true";
      document.documentElement.dataset.manorBlueprintActiveLens = state.activeLens;
      document.documentElement.dataset.manorBlueprintCurrentRoom = payload.currentRouteId;
      document.documentElement.dataset.manorBlueprintCurrentPublicRoomName = payload.currentPublicRoomName;
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
      try { bubble.remove(); } catch (_error) {}
    }

    if (overlay) {
      try { overlay.remove(); } catch (_error2) {}
    }

    bubble = null;
    overlay = null;
  }

  function exposeApi() {
    const api = {
      contract: API_CONTRACT,
      implementationContract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,

      valueCategoryEstateLanguageActive: true,
      builderPathHiddenFromVisitorCards: true,
      fileNameIsNotRoomIdentity: true,
      ziontsVisibleIdentity: true,
      gaugesDisplayedAsTheLab: true,
      frontierWorkshopYardLabelActive: true,

      mapBlipSingleEntryway: true,
      mirrorlandEntryway: "map_portal_blip",
      mainMenuWebsiteOptionsOnly: true,
      mirrorlandDoorsCategoryOnly: true,
      supportDoesNotEqualOwnership: true,

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

      window.addEventListener("resize", () => applyPosition(state.position, "resize-reclamp", true), { passive: true });

      window.addEventListener("orientationchange", () => {
        window.setTimeout(() => applyPosition(state.position, "orientation-reclamp", true), 250);
      }, { passive: true });

      if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", () => applyPosition(state.position, "visual-viewport-reclamp", true), { passive: true });
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
      state.errors.push({ scope: "mount", message: error?.message || String(error), time: nowIso() });
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

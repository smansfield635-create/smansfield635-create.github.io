// TARGET FILE: /assets/manor-blueprint/manor.blueprint.js
// TNT FULL-FILE REPLACEMENT
// MANOR_BLUEPRINT_PHYSICAL_PHONE_TOP_VISIBLE_ANCHOR_TNT_v3
//
// Purpose:
// Preserve the global Manor Blueprint HUD while forcing the mobile bubble into a
// physical-phone-visible upper-right anchor instead of the lower-right browser
// danger zone.
//
// Public API compatibility contract:
// MANOR_BLUEPRINT_FIXED_DRAGGABLE_BUBBLE_FULLSCREEN_MAP_INSTRUCTIONS_TOGGLE_JS_TNT_v1
//
// Bootstrap-facing implementation contract intentionally preserved:
// MANOR_BLUEPRINT_MOBILE_SAFE_BUBBLE_POSITION_RENEWAL_TNT_v1
//
// Physical phone anchor contract:
// MANOR_BLUEPRINT_PHYSICAL_PHONE_TOP_VISIBLE_ANCHOR_TNT_v3

(() => {
  "use strict";

  if (typeof window === "undefined" || typeof document === "undefined") return;

  const API_CONTRACT = "MANOR_BLUEPRINT_FIXED_DRAGGABLE_BUBBLE_FULLSCREEN_MAP_INSTRUCTIONS_TOGGLE_JS_TNT_v1";
  const IMPLEMENTATION_CONTRACT = "MANOR_BLUEPRINT_MOBILE_SAFE_BUBBLE_POSITION_RENEWAL_TNT_v1";
  const PHYSICAL_PHONE_CONTRACT = "MANOR_BLUEPRINT_PHYSICAL_PHONE_TOP_VISIBLE_ANCHOR_TNT_v3";

  const STATUS_GLOBAL = "DGB_MANOR_BLUEPRINT_STATUS";
  const RECEIPT_GLOBAL = "DGB_MANOR_BLUEPRINT_RECEIPT";
  const API_GLOBAL = "DGB_MANOR_BLUEPRINT_API";
  const CONTROLLER_GLOBAL = "__DGB_MANOR_BLUEPRINT_MOBILE_SAFE_CONTROLLER__";

  const STORAGE_KEY = "DGB_MANOR_BLUEPRINT_BUBBLE_POSITION_v1";
  const BUBBLE_SELECTOR = "[data-dgb-blueprint-bubble]";
  const OVERLAY_SELECTOR = "[data-dgb-blueprint-overlay]";

  const MOBILE_BREAKPOINT = 760;
  const MOBILE_TOP_ANCHOR_Y = 96;
  const MOBILE_SAFE_BOTTOM = 96;
  const MOBILE_MAX_FIRST_LOAD_RATIO = 0.55;

  let bubble = null;
  let overlay = null;

  const state = {
    activeLens: "map",
    overlayOpen: false,
    dragging: false,
    dragMoved: false,
    position: { x: 0, y: 0 },
    positionSource: "boot",
    positionWasClamped: false,
    localStorageRepaired: false,
    lastAction: "boot",
    errors: []
  };

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
      scale: visual ? visual.scale : 1
    };
  }

  function isMobile() {
    return viewport().width <= MOBILE_BREAKPOINT;
  }

  function queryForcesTop() {
    const params = new URLSearchParams(window.location.search || "");
    return params.get("dgbBlueprintReset") === "1" || params.get("dgbBlueprintTop") === "1";
  }

  function safeMargins() {
    return isMobile()
      ? { left: 16, right: 16, top: 96, bottom: 96, mode: "mobile" }
      : { left: 16, right: 16, top: 16, bottom: 16, mode: "desktop" };
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

    if (isMobile()) {
      return {
        x: v.offsetLeft + v.width - s.width - m.right,
        y: v.offsetTop + MOBILE_TOP_ANCHOR_Y
      };
    }

    return {
      x: v.offsetLeft + v.width - s.width - m.right,
      y: v.offsetTop + v.height - s.height - m.bottom
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
        contract: String(parsed.contract || ""),
        physicalPhoneAnchorContract: String(parsed.physicalPhoneAnchorContract || "")
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

  function storedIsUnsafeForPhone(stored) {
    if (!stored || !isMobile()) return false;
    const v = viewport();

    if (queryForcesTop()) return true;
    if (stored.physicalPhoneAnchorContract !== PHYSICAL_PHONE_CONTRACT) return true;
    if (stored.y > v.height * MOBILE_MAX_FIRST_LOAD_RATIO) return true;
    if (stored.y < 0 || stored.x < 0) return true;
    if (stored.x > v.width - 24) return true;

    return false;
  }

  function clampPosition(pos) {
    const v = viewport();
    const m = safeMargins();
    const s = bubbleSize();

    const minX = v.offsetLeft + m.left;
    const maxX = Math.max(minX, v.offsetLeft + v.width - s.width - m.right);

    const minY = v.offsetTop + (isMobile() ? m.top : m.top);
    const maxY = isMobile()
      ? Math.max(minY, v.offsetTop + Math.floor(v.height * MOBILE_MAX_FIRST_LOAD_RATIO) - s.height)
      : Math.max(minY, v.offsetTop + v.height - s.height - m.bottom);

    const rawX = Number(pos.x) || 0;
    const rawY = Number(pos.y) || 0;

    const x = Math.min(Math.max(rawX, minX), maxX);
    const y = Math.min(Math.max(rawY, minY), maxY);

    return { x, y, clamped: x !== rawX || y !== rawY };
  }

  function savePosition(pos) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        x: Math.round(pos.x),
        y: Math.round(pos.y),
        contract: IMPLEMENTATION_CONTRACT,
        physicalPhoneAnchorContract: PHYSICAL_PHONE_CONTRACT,
        time: nowIso()
      }));
    } catch (_error) {}
  }

  function applyPosition(pos, source, shouldSave) {
    if (!bubble) return;

    const clamped = clampPosition(pos);
    state.position = { x: clamped.x, y: clamped.y };
    state.positionWasClamped = clamped.clamped;
    state.positionSource = source || (isMobile() ? "physical-phone-top-anchor" : "default");

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
    if (queryForcesTop()) {
      clearStoredPosition();
      state.localStorageRepaired = true;
      applyPosition(defaultPosition(), "physical-phone-top-anchor", true);
      return;
    }

    const stored = readStoredPosition();

    if (storedIsUnsafeForPhone(stored)) {
      clearStoredPosition();
      state.localStorageRepaired = true;
      applyPosition(defaultPosition(), "physical-phone-top-anchor", true);
      return;
    }

    if (stored) {
      applyPosition(stored, "stored", false);
      return;
    }

    applyPosition(defaultPosition(), isMobile() ? "physical-phone-top-anchor" : "default", true);
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
    return window.DGB_MANOR_BLUEPRINT_REGISTRY || window.DGB_MANOR_BLUEPRINT_ROUTE_REGISTRY || null;
  }

  function routes() {
    const reg = registry();
    const source = Array.isArray(reg?.routes) ? reg.routes : [
      { id: "compass", title: "Compass", path: "/", group: "Core", body: "Return to the main compass." },
      { id: "showroom", title: "Showroom", path: "/showroom/", group: "Manor", body: "Enter the showroom." },
      { id: "globe", title: "Globe Showcase", path: "/showroom/globe/", group: "Showroom", body: "Open the globe route." },
      { id: "audralia-planet", title: "Audralia Planet", path: "/showroom/globe/audralia/planet/", group: "Audralia", body: "Inspect the Audralia future-body screen." },
      { id: "gauges", title: "Gauges", path: "/gauges/", group: "Proof", body: "Open route proof and audit rooms." }
    ];

    return source.map((item, index) => ({
      id: String(item.id || item.key || `route-${index}`),
      title: String(item.title || item.label || item.name || "Route"),
      path: normalizePath(item.path || item.href || "/"),
      group: String(item.group || item.family || "Route"),
      body: String(item.body || item.description || "Open this route.")
    }));
  }

  function instructions() {
    const reg = registry();
    const source = Array.isArray(reg?.instructions) ? reg.instructions : [
      { title: "Map", body: "Use Map to see the current route and available navigation paths." },
      { title: "Instructions", body: "Use Instructions to read site controls." },
      { title: "Floating Bubble", body: "The bubble stays fixed while you scroll and can be dragged." },
      { title: "Phone Anchor", body: "On phones, the bubble starts near the top-right so it remains visible." },
      { title: "Reset", body: "Use reset to repair the bubble position if the phone browser stores an unsafe location." }
    ];

    return source.map((item, index) => ({
      title: String(item.title || `Instruction ${index + 1}`),
      body: String(item.body || item.text || "Read this instruction.")
    }));
  }

  function currentRoute(routeList) {
    const path = normalizePath(window.location.pathname || "/");
    return routeList.find((route) => route.path === path) || routeList[0] || null;
  }

  function injectStyle() {
    if (document.getElementById("dgb-manor-blueprint-physical-phone-style")) return;

    const style = document.createElement("style");
    style.id = "dgb-manor-blueprint-physical-phone-style";
    style.textContent = `
      .dgb-blueprint-bubble{
        width:68px!important;height:68px!important;border-radius:999px!important;
        border:1px solid rgba(243,200,111,.78)!important;
        background:radial-gradient(circle at 30% 20%,rgba(255,255,255,.45),transparent 28%),linear-gradient(135deg,#fff2a8,#f3c86f)!important;
        color:#060811!important;box-shadow:0 18px 40px rgba(0,0,0,.42),0 0 26px rgba(243,200,111,.30)!important;
        place-items:center!important;font:900 10px/1 Inter,system-ui,sans-serif!important;
        letter-spacing:.08em!important;text-transform:uppercase!important;touch-action:none!important;
        user-select:none!important;-webkit-user-select:none!important;
      }
      .dgb-blueprint-bubble__label{pointer-events:none!important;display:grid!important;gap:2px!important;text-align:center!important}
      .dgb-blueprint-bubble__label b{font-size:17px!important;line-height:1!important}
      .dgb-blueprint-bubble__label small{font-size:8px!important;letter-spacing:.12em!important}
      .dgb-blueprint-overlay{
        position:fixed!important;inset:0!important;z-index:99980!important;display:none;
        background:rgba(1,4,12,.94)!important;color:#fff4d8!important;overflow:auto!important;
        -webkit-overflow-scrolling:touch!important;padding:14px!important;
      }
      .dgb-blueprint-panel{
        width:min(1120px,100%)!important;margin:0 auto!important;border:1px solid rgba(243,200,111,.28)!important;
        border-radius:22px!important;background:linear-gradient(180deg,rgba(12,18,36,.97),rgba(4,8,18,.98))!important;
        padding:16px!important;box-shadow:0 30px 90px rgba(0,0,0,.55)!important;
      }
      .dgb-blueprint-top{display:flex!important;justify-content:space-between!important;gap:12px!important;flex-wrap:wrap!important;margin-bottom:14px!important}
      .dgb-blueprint-title b{display:block!important;color:#f3c86f!important;font-size:11px!important;letter-spacing:.14em!important;text-transform:uppercase!important}
      .dgb-blueprint-title h2{margin:4px 0 0!important;color:#fff4d8!important;font-size:clamp(26px,6vw,46px)!important;line-height:.95!important;letter-spacing:-.05em!important}
      .dgb-blueprint-actions{display:flex!important;gap:8px!important;flex-wrap:wrap!important}
      .dgb-blueprint-actions button,.dgb-blueprint-card a{
        border:1px solid rgba(243,200,111,.38)!important;border-radius:999px!important;min-height:38px!important;
        padding:8px 12px!important;background:rgba(255,255,255,.06)!important;color:#fff4d8!important;
        font:900 11px/1 Inter,system-ui,sans-serif!important;letter-spacing:.08em!important;text-transform:uppercase!important;
        cursor:pointer!important;text-decoration:none!important;
      }
      .dgb-blueprint-actions button[data-active="true"]{background:linear-gradient(135deg,#fff2a8,#f3c86f)!important;color:#05070d!important}
      .dgb-blueprint-grid{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))!important;gap:10px!important}
      .dgb-blueprint-card{border:1px solid rgba(184,205,255,.15)!important;border-radius:18px!important;padding:13px!important;background:rgba(255,255,255,.045)!important;display:grid!important;gap:8px!important}
      .dgb-blueprint-card[data-current="true"]{border-color:rgba(243,200,111,.75)!important;box-shadow:0 0 28px rgba(243,200,111,.12)!important}
      .dgb-blueprint-card b{color:#f3c86f!important;font-size:11px!important;letter-spacing:.12em!important;text-transform:uppercase!important}
      .dgb-blueprint-card h3{margin:0!important;color:#fff4d8!important;font-size:18px!important;line-height:1.08!important}
      .dgb-blueprint-card p{margin:0!important;color:rgba(230,238,255,.80)!important;font-size:14px!important;line-height:1.42!important}
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  function createBubble() {
    bubble = document.querySelector(BUBBLE_SELECTOR);
    if (bubble) return bubble;

    bubble = document.createElement("button");
    bubble.type = "button";
    bubble.className = "dgb-blueprint-bubble";
    bubble.setAttribute("aria-label", "Open Manor Blueprint map and instructions");
    bubble.setAttribute("data-dgb-blueprint-bubble", "true");
    bubble.setAttribute("data-manor-blueprint-contract", IMPLEMENTATION_CONTRACT);
    bubble.setAttribute("data-physical-phone-anchor-contract", PHYSICAL_PHONE_CONTRACT);
    bubble.innerHTML = `<span class="dgb-blueprint-bubble__label"><b>◇</b><small>Map</small></span>`;
    bubble.style.cssText = "position:fixed!important;z-index:99990!important;display:grid!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;left:0!important;top:0!important;right:auto!important;bottom:auto!important;overflow:visible!important;";
    document.body.appendChild(bubble);

    return bubble;
  }

  function createOverlay() {
    overlay = document.querySelector(OVERLAY_SELECTOR);
    if (overlay) return overlay;

    overlay = document.createElement("section");
    overlay.className = "dgb-blueprint-overlay";
    overlay.setAttribute("data-dgb-blueprint-overlay", "true");
    overlay.setAttribute("data-manor-blueprint-contract", IMPLEMENTATION_CONTRACT);
    overlay.setAttribute("data-physical-phone-anchor-contract", PHYSICAL_PHONE_CONTRACT);
    overlay.setAttribute("aria-label", "Manor Blueprint map and instructions");
    document.body.appendChild(overlay);

    return overlay;
  }

  function renderOverlay() {
    if (!overlay) return;

    const routeList = routes();
    const instructionList = instructions();
    const current = currentRoute(routeList);

    const cards = state.activeLens === "map"
      ? routeList.map((route) => `
          <article class="dgb-blueprint-card" data-current="${current && current.id === route.id ? "true" : "false"}">
            <b>${escapeHtml(route.group)}${current && current.id === route.id ? " · You Are Here" : ""}</b>
            <h3>${escapeHtml(route.title)}</h3>
            <p>${escapeHtml(route.body)}</p>
            <a href="${escapeHtml(route.path)}">${current && current.id === route.id ? "Stay Here" : "Open Route"}</a>
          </article>
        `).join("")
      : instructionList.map((item) => `
          <article class="dgb-blueprint-card">
            <b>Instruction</b>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.body)}</p>
          </article>
        `).join("");

    overlay.innerHTML = `
      <div class="dgb-blueprint-panel">
        <div class="dgb-blueprint-top">
          <div class="dgb-blueprint-title">
            <b>Manor Blueprint · ${escapeHtml(state.activeLens)}</b>
            <h2>${state.activeLens === "map" ? "Site Map" : "Instructions"}</h2>
          </div>
          <div class="dgb-blueprint-actions">
            <button type="button" data-dgb-lens="map" data-active="${state.activeLens === "map"}">Map</button>
            <button type="button" data-dgb-lens="instructions" data-active="${state.activeLens === "instructions"}">Instructions</button>
            <button type="button" data-dgb-reset>Reset Bubble</button>
            <button type="button" data-dgb-close>Close</button>
          </div>
        </div>
        <div class="dgb-blueprint-grid">${cards}</div>
      </div>
    `;

    overlay.querySelectorAll("[data-dgb-lens]").forEach((button) => {
      button.addEventListener("click", () => setLens(button.getAttribute("data-dgb-lens") || "map"));
    });

    overlay.querySelector("[data-dgb-close]")?.addEventListener("click", close);
    overlay.querySelector("[data-dgb-reset]")?.addEventListener("click", resetPosition);
  }

  function open() {
    state.overlayOpen = true;
    state.lastAction = "open";
    renderOverlay();
    overlay.style.setProperty("display", "block", "important");
    publishStatus();
  }

  function close() {
    state.overlayOpen = false;
    state.lastAction = "close";
    overlay.style.setProperty("display", "none", "important");
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
    applyPosition(defaultPosition(), isMobile() ? "physical-phone-top-anchor" : "reset", true);
  }

  function attachDrag() {
    if (!bubble || bubble.__dgbDragAttached) return;
    bubble.__dgbDragAttached = true;

    let startX = 0;
    let startY = 0;
    let baseX = 0;
    let baseY = 0;

    bubble.addEventListener("pointerdown", (event) => {
      state.dragging = true;
      state.dragMoved = false;
      startX = event.clientX;
      startY = event.clientY;
      baseX = state.position.x;
      baseY = state.position.y;
      try { bubble.setPointerCapture(event.pointerId); } catch (_error) {}
      publishStatus();
    });

    bubble.addEventListener("pointermove", (event) => {
      if (!state.dragging) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) state.dragMoved = true;
      applyPosition({ x: baseX + dx, y: baseY + dy }, "drag", true);
      event.preventDefault();
    }, { passive: false });

    bubble.addEventListener("pointerup", () => {
      if (!state.dragging) return;
      state.dragging = false;
      if (!state.dragMoved) toggle();
      else savePosition(state.position);
      publishStatus();
    });

    bubble.addEventListener("pointercancel", () => {
      state.dragging = false;
      publishStatus();
    });
  }

  function bubbleRect() {
    if (!bubble) return null;
    const rect = bubble.getBoundingClientRect();
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

  function publishStatus() {
    const v = viewport();
    const m = safeMargins();
    const rect = bubbleRect();
    const mobile = isMobile();

    const payload = {
      contract: IMPLEMENTATION_CONTRACT,
      apiContract: API_CONTRACT,
      implementationContract: IMPLEMENTATION_CONTRACT,
      physicalPhoneAnchorContract: PHYSICAL_PHONE_CONTRACT,
      active: true,
      bubbleMounted: Boolean(bubble && document.body.contains(bubble)),
      overlayMounted: Boolean(overlay && document.body.contains(overlay)),
      overlayOpen: state.overlayOpen,
      activeLens: state.activeLens,
      currentPath: normalizePath(window.location.pathname || "/"),
      fixedBubble: true,
      fullScreenOverlay: true,
      mapInstructionsToggle: true,
      draggable: true,
      physicalPhoneAnchor: mobile,
      phoneVisibleAnchor: mobile ? Boolean(rect && rect.top <= v.height * MOBILE_MAX_FIRST_LOAD_RATIO) : true,
      mobileAnchorMode: mobile ? "top-visible" : "desktop-corner",
      mobileSafePosition: Boolean(rect && rect.left >= 0 && rect.top >= 0 && rect.right <= v.width + 2 && rect.bottom <= v.height + 2),
      safeMargins: m,
      positionSource: state.positionSource,
      positionWasClamped: state.positionWasClamped,
      localStorageRepaired: state.localStorageRepaired,
      bubblePosition: { ...state.position },
      bubbleRect: rect,
      viewportWidth: v.width,
      viewportHeight: v.height,
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
      updatedAt: nowIso()
    };

    window[STATUS_GLOBAL] = payload;
    window[RECEIPT_GLOBAL] = payload;

    try {
      document.documentElement.dataset.manorBlueprintActive = "true";
      document.documentElement.dataset.manorBlueprintContract = IMPLEMENTATION_CONTRACT;
      document.documentElement.dataset.manorBlueprintPhysicalPhoneAnchorContract = PHYSICAL_PHONE_CONTRACT;
      document.documentElement.dataset.manorBlueprintMobileAnchorMode = payload.mobileAnchorMode;
      document.documentElement.dataset.manorBlueprintPhoneVisibleAnchor = payload.phoneVisibleAnchor ? "true" : "false";
      document.documentElement.dataset.manorBlueprintPositionSource = payload.positionSource;
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

  function exposeApi() {
    const api = {
      contract: API_CONTRACT,
      implementationContract: IMPLEMENTATION_CONTRACT,
      physicalPhoneAnchorContract: PHYSICAL_PHONE_CONTRACT,
      refresh,
      open,
      close,
      toggle,
      setLens,
      resetPosition,
      status: publishStatus
    };

    window[API_GLOBAL] = api;
    window[CONTROLLER_GLOBAL] = api;
  }

  function mount() {
    try {
      injectStyle();
      createBubble();
      createOverlay();
      exposeApi();
      renderOverlay();
      attachDrag();
      initializePosition();

      window.addEventListener("resize", () => applyPosition(isMobile() ? defaultPosition() : state.position, isMobile() ? "physical-phone-top-anchor" : "repair", true), { passive: true });
      window.addEventListener("orientationchange", () => window.setTimeout(resetPosition, 250), { passive: true });

      if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", () => applyPosition(isMobile() ? defaultPosition() : state.position, isMobile() ? "physical-phone-top-anchor" : "repair", true), { passive: true });
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
  publishStatus();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();

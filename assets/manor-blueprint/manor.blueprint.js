// TARGET FILE: /assets/manor-blueprint/manor.blueprint.js
// TNT FULL-FILE REPLACEMENT
// MANOR_BLUEPRINT_MIRRORLAND_PORTAL_DUAL_MENU_JS_TNT_v1
//
// Purpose:
// Renew the Manor Blueprint map bubble into the Mirrorland portal.
// The bubble opens a dual-menu overlay: Mirrorland Menu first, Main Menu /
// Website Options second, Instructions third. The Compass remains separated
// as the main-site orientation layer.
//
// Compatibility API contract preserved:
// MANOR_BLUEPRINT_FIXED_DRAGGABLE_BUBBLE_FULLSCREEN_MAP_INSTRUCTIONS_TOGGLE_JS_TNT_v1
//
// Previous runtime contract:
// MANOR_BLUEPRINT_JOYSTICK_SCROLL_FORCE_40_PERCENT_INCREASE_JS_TNT_v1
//
// Prior runtime contract:
// MANOR_BLUEPRINT_GLOBAL_JOYSTICK_SCROLL_SITEWIDE_JS_TNT_v1
//
// Legacy behavior contract:
// MANOR_BLUEPRINT_MOBILE_SAFE_BUBBLE_POSITION_RENEWAL_TNT_v1
//
// Owns:
// - Mirrorland portal map bubble
// - full-screen overlay
// - Mirrorland Menu / Main Menu / Instructions lenses
// - registry consumption for main-site supplemental routes
// - full-viewport drag
// - joystick scroll while dragging
// - joystick scroll force multiplier
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
// - Compass page authority

(() => {
  "use strict";

  if (typeof window === "undefined" || typeof document === "undefined") return;

  const CONTRACT = "MANOR_BLUEPRINT_MIRRORLAND_PORTAL_DUAL_MENU_JS_TNT_v1";
  const API_CONTRACT = "MANOR_BLUEPRINT_FIXED_DRAGGABLE_BUBBLE_FULLSCREEN_MAP_INSTRUCTIONS_TOGGLE_JS_TNT_v1";
  const PREVIOUS_CONTRACT = "MANOR_BLUEPRINT_JOYSTICK_SCROLL_FORCE_40_PERCENT_INCREASE_JS_TNT_v1";
  const PRIOR_CONTRACT = "MANOR_BLUEPRINT_GLOBAL_JOYSTICK_SCROLL_SITEWIDE_JS_TNT_v1";
  const LEGACY_CONTRACT = "MANOR_BLUEPRINT_MOBILE_SAFE_BUBBLE_POSITION_RENEWAL_TNT_v1";

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
  const JOYSTICK_SCROLL_FORCE_MULTIPLIER = 1.4;
  const JOYSTICK_SCROLL_FORCE_INCREASE_PERCENT = 40;
  const MOBILE_BREAKPOINT = 760;

  const MIRRORLAND_PRIMARY_PATHS = Object.freeze([
    "/showroom/",
    "/showroom/globe/",
    "/showroom/globe/audralia/",
    "/showroom/globe/audralia/planet/",
    "/showroom/globe/audralia/disposition/",
    "/showroom/globe/h-earth/",
    "/characters/"
  ]);

  const MIRRORLAND_SUPPORT_PATHS = Object.freeze([
    "/gauges/"
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
        mirrorlandPortalActive: true,
        dualMenuActive: true,
        fullViewportDrag: true,
        joystickScrollActive: true,
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

  function route(id, title, path, group, body, x, y, role) {
    return Object.freeze({
      id,
      title,
      path: normalizePath(path),
      group,
      body,
      x,
      y,
      role: role || "route"
    });
  }

  function mirrorlandRoutes() {
    return [
      route(
        "enter-mirrorland",
        "Enter Mirrorland",
        "/showroom/globe/",
        "Portal",
        "Cross from the Door into the Mirrorland route field.",
        50,
        12,
        "primary-entry"
      ),
      route(
        "mirrorland-door",
        "Door / Threshold",
        "/showroom/",
        "Threshold",
        "Return to the Diamond Door where Mirrorland entry begins.",
        35,
        26,
        "threshold"
      ),
      route(
        "audralia",
        "Audralia",
        "/showroom/globe/audralia/",
        "Planetary Path",
        "Open the first living planetary doorway.",
        62,
        34,
        "planetary-path"
      ),
      route(
        "audralia-planet",
        "Audralia Planet",
        "/showroom/globe/audralia/planet/",
        "Planetary Path",
        "Inspect Audralia as the future-body planetary template.",
        72,
        48,
        "planet"
      ),
      route(
        "audralia-cockpit",
        "Audralia Cockpit",
        "/showroom/globe/audralia/disposition/",
        "Instruments",
        "Open the cockpit and disposition instruments.",
        66,
        63,
        "instrument"
      ),
      route(
        "characters",
        "Characters",
        "/characters/",
        "People",
        "Meet the first faces waiting beyond the Door.",
        41,
        68,
        "characters"
      ),
      route(
        "h-earth",
        "H-Earth",
        "/showroom/globe/h-earth/",
        "World Path",
        "Open the H-Earth world path.",
        27,
        52,
        "world"
      ),
      route(
        "gauges-proof",
        "Gauges / Proof",
        "/gauges/",
        "Proof",
        "Measure what is present, routed, and holding shape.",
        50,
        84,
        "support"
      )
    ];
  }

  function baseMainRoutes() {
    return [
      route("compass", "Compass", "/", "Main Menu", "Return to the main website compass.", 50, 10, "main"),
      route("door", "Door", "/door/", "Main Menu", "Cross the ordinary site threshold.", 50, 24, "main"),
      route("home", "Home", "/home/", "Main Menu", "Return home.", 50, 38, "main"),
      route("showroom-main", "Showroom", "/showroom/", "Website", "Open the Showroom Door page.", 76, 42, "main"),
      route("products", "Products", "/products/", "Website", "Open product routes.", 50, 82, "main"),
      route("laws", "Laws", "/laws/", "Website", "Open the law and proof layer.", 20, 54, "main"),
      route("gauges-main", "Gauges", "/gauges/", "Website", "Open route proof and measurement.", 36, 76, "main"),
      route("frontier", "Frontier", "/frontier/", "Website", "Open frontier routes.", 24, 68, "main")
    ];
  }

  function registryRoutes() {
    const reg = registry();
    const source = Array.isArray(reg?.routes) ? reg.routes : [];

    return source.map((item, index) => route(
      String(item.id || item.key || `registry-route-${index}`),
      String(item.title || item.label || item.name || "Route"),
      String(item.path || item.href || "/"),
      String(item.group || item.family || "Website"),
      String(item.body || item.description || "Open this route."),
      Number.isFinite(Number(item.x)) ? Number(item.x) : 12 + ((index * 17) % 76),
      Number.isFinite(Number(item.y)) ? Number(item.y) : 12 + ((index * 23) % 76),
      "registry"
    ));
  }

  function mergeRoutes(primary, supplemental) {
    const seen = new Set();
    const merged = [];

    primary.concat(supplemental || []).forEach((item) => {
      const key = normalizePath(item.path);
      if (seen.has(key)) return;
      seen.add(key);
      merged.push(item);
    });

    return merged;
  }

  function mainMenuRoutes() {
    const base = baseMainRoutes();
    const registrySupplement = registryRoutes().filter((item) => {
      const path = normalizePath(item.path);
      const baseDuplicate = base.some((routeItem) => normalizePath(routeItem.path) === path);
      const mirrorlandOnly = isMirrorlandPrimaryPath(path) && path !== "/showroom/";
      return !baseDuplicate && !mirrorlandOnly;
    });

    return mergeRoutes(base, registrySupplement);
  }

  function allKnownRoutes() {
    return mergeRoutes(mirrorlandRoutes(), mainMenuRoutes());
  }

  function instructions() {
    const reg = registry();
    const source = Array.isArray(reg?.instructions) ? reg.instructions : [
      {
        title: "Portal",
        body: "Tap the map bubble to open the Mirrorland Portal."
      },
      {
        title: "Mirrorland Menu",
        body: "Use Mirrorland Menu to enter or navigate inside Mirrorland."
      },
      {
        title: "Main Menu / Website Options",
        body: "Use Main Menu for ordinary website routes. Compass remains separated from the Mirrorland portal."
      },
      {
        title: "Drag",
        body: "Drag the bubble anywhere inside the visible screen."
      },
      {
        title: "Joystick Scroll",
        body: "While dragging, pull near the bottom edge to scroll down or near the top edge to scroll up. Scroll force remains increased by 40%."
      }
    ];

    return source.map((item, index) => ({
      title: String(item.title || `Instruction ${index + 1}`),
      body: String(item.body || item.text || "Read this instruction.")
    }));
  }

  function pathStartsWith(path, prefix) {
    const cleanPath = normalizePath(path);
    const cleanPrefix = normalizePath(prefix);

    if (cleanPrefix === "/") return cleanPath === "/";
    return cleanPath === cleanPrefix || cleanPath.startsWith(cleanPrefix);
  }

  function isMirrorlandPrimaryPath(path) {
    const clean = normalizePath(path);

    return MIRRORLAND_PRIMARY_PATHS.some((prefix) => {
      if (prefix === "/showroom/") return clean === "/showroom/";
      return pathStartsWith(clean, prefix);
    });
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

  function currentRoute(routeList) {
    const path = normalizePath(window.location.pathname || "/");

    return routeList.find((routeItem) => normalizePath(routeItem.path) === path) ||
      routeList.find((routeItem) => normalizePath(routeItem.path) !== "/" && pathStartsWith(path, routeItem.path)) ||
      routeList[0] ||
      null;
  }

  function normalizeLens(lens) {
    if (lens === "main" || lens === "website" || lens === "site") return "main";
    if (lens === "instructions") return "instructions";
    if (lens === "map") return "mirrorland";
    return "mirrorland";
  }

  function lensTitle() {
    if (state.activeLens === "main") return "Main Menu / Website Options";
    if (state.activeLens === "instructions") return "Instructions";
    return "Mirrorland Portal";
  }

  function lensSubtitle() {
    if (state.activeLens === "main") {
      return "Ordinary website options remain separate from the Mirrorland portal. Compass remains the main-site orientation layer.";
    }

    if (state.activeLens === "instructions") {
      return "Operate the portal, drag the bubble, and use joystick-scroll when moving through long pages.";
    }

    return mirrorlandEntered()
      ? "You are inside Mirrorland. Use this portal to move through the Mirrorland route field."
      : "Entry available. Use this portal to enter Mirrorland directly.";
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
    bubble.setAttribute("aria-label", "Open Mirrorland Portal map and menu");
    bubble.setAttribute("data-dgb-blueprint-bubble", "true");
    bubble.setAttribute("data-manor-blueprint-contract", CONTRACT);
    bubble.setAttribute("data-api-contract", API_CONTRACT);
    bubble.setAttribute("data-full-viewport-drag", "true");
    bubble.setAttribute("data-joystick-scroll", "true");
    bubble.setAttribute("data-mirrorland-portal", "true");
    bubble.setAttribute("data-dual-menu", "true");
    bubble.setAttribute("data-joystick-scroll-force-multiplier", String(JOYSTICK_SCROLL_FORCE_MULTIPLIER));
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
    overlay.setAttribute("data-mirrorland-portal", "true");
    overlay.setAttribute("aria-label", "Mirrorland Portal map and menus");

    document.body.appendChild(overlay);
    return overlay;
  }

  function groupRoutes(routeList) {
    return routeList.reduce((acc, item) => {
      const key = item.group || "Route";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }

  function renderRouteSections(routeList, current, badgeMode) {
    const groups = groupRoutes(routeList);

    return Object.keys(groups).map((group) => `
      <section class="dgb-bp-route-section">
        <div class="dgb-bp-section-title">
          <span>${escapeHtml(group)}</span>
          <span>${groups[group].length}</span>
        </div>
        <div class="dgb-bp-route-list">
          ${groups[group].map((item) => {
            const isCurrent = Boolean(current && normalizePath(current.path) === normalizePath(item.path));
            const badge = isCurrent ? "Here" : badgeMode || "Open";

            return `
              <a class="dgb-bp-route-card" href="${escapeHtml(item.path)}" data-current="${isCurrent ? "true" : "false"}" data-route-role="${escapeHtml(item.role || "route")}">
                <span class="dgb-bp-route-marker">${escapeHtml(item.title.slice(0, 2).toUpperCase())}</span>
                <span class="dgb-bp-route-copy">
                  <strong>${escapeHtml(item.title)}</strong>
                  <span>${escapeHtml(item.body)}</span>
                  <code>${escapeHtml(item.path)}</code>
                </span>
                <span class="dgb-bp-route-badge">${escapeHtml(badge)}</span>
              </a>
            `;
          }).join("")}
        </div>
      </section>
    `).join("");
  }

  function renderRouteField(routeList, current) {
    const nodes = routeList.map((item) => {
      const isCurrent = Boolean(current && normalizePath(current.path) === normalizePath(item.path));

      return `
        <a
          class="dgb-bp-map-node"
          href="${escapeHtml(item.path)}"
          data-current="${isCurrent ? "true" : "false"}"
          data-route-role="${escapeHtml(item.role || "route")}"
          style="--bp-x:${Math.max(5, Math.min(95, item.x))};--bp-y:${Math.max(5, Math.min(95, item.y))};"
        >
          <b>${escapeHtml(item.group)}</b>
          <strong>${escapeHtml(item.title)}</strong>
          <span>${escapeHtml(item.path)}</span>
        </a>
      `;
    }).join("");

    return `
      <div class="dgb-bp-blueprint-field" aria-label="Portal field map">
        ${nodes}
      </div>
    `;
  }

  function renderMirrorlandLens() {
    const routeList = mirrorlandRoutes();
    const current = currentRoute(routeList);
    const entered = mirrorlandEntered();
    const support = mirrorlandSupportActive();

    return `
      <div class="dgb-bp-map-grid">
        <aside class="dgb-bp-panel">
          <div class="dgb-bp-panel-head">
            <b>Mirrorland Portal</b>
            <h3>${entered ? "Inside Mirrorland" : support ? "Proof Route Active" : "Entry Available"}</h3>
            <p>${entered
              ? "The map is now your Mirrorland navigation system."
              : support
                ? "You are on a proof/support route connected to Mirrorland."
                : "Use Enter Mirrorland to cross directly into the Mirrorland route field."}</p>
          </div>

          <div class="dgb-bp-you-are-here">
            <div class="dgb-bp-location-card">
              <b>${entered ? "Current Mirrorland Route" : "Portal Status"}</b>
              <strong>${escapeHtml(current?.title || "Enter Mirrorland")}</strong>
              <code>${escapeHtml(normalizePath(window.location.pathname || "/"))}</code>
            </div>

            <div class="dgb-bp-chain">
              <a href="/showroom/">Door</a>
              <span class="dgb-bp-chain-separator">→</span>
              <a href="/showroom/globe/">Mirrorland</a>
              <span class="dgb-bp-chain-separator">→</span>
              <a href="/showroom/globe/audralia/">Audralia</a>
            </div>

            <a class="dgb-bp-guide-link" href="/showroom/globe/">
              ${entered ? "Return to Mirrorland Gate" : "Enter Mirrorland"}
            </a>
          </div>
        </aside>

        <section class="dgb-bp-panel">
          <div class="dgb-bp-panel-head">
            <b>Mirrorland Menu</b>
            <h3>Portal routes</h3>
            <p>These routes belong to the Mirrorland entry and world-path field.</p>
          </div>
          <div class="dgb-bp-route-tools">
            ${renderRouteSections(routeList, current, "Portal")}
          </div>
        </section>
      </div>

      ${renderRouteField(routeList, current)}
    `;
  }

  function renderMainLens() {
    const routeList = mainMenuRoutes();
    const current = currentRoute(routeList);

    return `
      <div class="dgb-bp-map-grid">
        <aside class="dgb-bp-panel">
          <div class="dgb-bp-panel-head">
            <b>Main Menu / Website Options</b>
            <h3>Compass separated</h3>
            <p>The Compass remains the main website orientation system. It is not the Mirrorland portal.</p>
          </div>

          <div class="dgb-bp-you-are-here">
            <div class="dgb-bp-location-card">
              <b>Current Website Path</b>
              <strong>${escapeHtml(current?.title || "Current Route")}</strong>
              <code>${escapeHtml(normalizePath(window.location.pathname || "/"))}</code>
            </div>

            <div class="dgb-bp-chain">
              <a href="/">Compass</a>
              <span class="dgb-bp-chain-separator">→</span>
              <a href="/door/">Door</a>
              <span class="dgb-bp-chain-separator">→</span>
              <a href="/showroom/">Showroom</a>
            </div>
          </div>
        </aside>

        <section class="dgb-bp-panel">
          <div class="dgb-bp-panel-head">
            <b>Website Options</b>
            <h3>Main routes</h3>
            <p>Use this lens for ordinary website navigation outside the Mirrorland portal layer.</p>
          </div>
          <div class="dgb-bp-route-tools">
            ${renderRouteSections(routeList, current, "Open")}
          </div>
        </section>
      </div>

      ${renderRouteField(routeList, current)}
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

  function renderActiveLens() {
    if (state.activeLens === "main") return renderMainLens();
    if (state.activeLens === "instructions") return renderInstructionsLens();
    return renderMirrorlandLens();
  }

  function renderOverlay() {
    if (!overlay) return;

    const entered = mirrorlandEntered();
    const support = mirrorlandSupportActive();

    overlay.innerHTML = `
      <div class="dgb-bp-topbar">
        <div class="dgb-bp-titleblock">
          <div class="dgb-bp-kicker">${state.activeLens === "main" ? "Website Options" : state.activeLens === "instructions" ? "Portal Instructions" : "Mirrorland Portal"}</div>
          <h2 class="dgb-bp-title">${escapeHtml(lensTitle())}</h2>
          <p class="dgb-bp-subtitle">
            ${escapeHtml(lensSubtitle())}
          </p>
        </div>
        <button class="dgb-bp-close" type="button" data-dgb-close aria-label="Close Mirrorland Portal">×</button>
      </div>

      <div class="dgb-bp-main">
        <div class="dgb-bp-tabs">
          <div class="dgb-bp-tablist" role="tablist" aria-label="Mirrorland Portal lenses">
            <button class="dgb-bp-tab" type="button" data-dgb-lens="mirrorland" aria-selected="${state.activeLens === "mirrorland"}" data-active="${state.activeLens === "mirrorland"}">Mirrorland Menu</button>
            <button class="dgb-bp-tab" type="button" data-dgb-lens="main" aria-selected="${state.activeLens === "main"}" data-active="${state.activeLens === "main"}">Main Menu</button>
            <button class="dgb-bp-tab" type="button" data-dgb-lens="instructions" aria-selected="${state.activeLens === "instructions"}" data-active="${state.activeLens === "instructions"}">Instructions</button>
          </div>
          <div class="dgb-bp-current-pill">${entered ? "Inside Mirrorland" : support ? "Mirrorland Proof Route" : "Mirrorland Entry Available"}</div>
        </div>

        <div class="dgb-bp-content">
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
      return {
        direction: "up",
        speed: joystickSpeedFromPressure(pressure)
      };
    }

    if (y > v.height - bottomZone) {
      const pressure = Math.max(0, Math.min(1, (y - (v.height - bottomZone)) / bottomZone));
      return {
        direction: "down",
        speed: joystickSpeedFromPressure(pressure)
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

  function round2(value) {
    return Math.round(Number(value || 0) * 100) / 100;
  }

  function publishStatus() {
    const v = viewport();
    const m = safeMargins();
    const rect = bubble ? bubble.getBoundingClientRect() : null;
    const entered = mirrorlandEntered();
    const support = mirrorlandSupportActive();
    const mirrorlandList = mirrorlandRoutes();
    const mainList = mainMenuRoutes();
    const currentAny = currentRoute(allKnownRoutes());

    const payload = {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      priorContract: PRIOR_CONTRACT,
      legacyContract: LEGACY_CONTRACT,
      apiContract: API_CONTRACT,

      active: true,
      mirrorlandPortalActive: true,
      mirrorlandEntered: entered,
      mirrorlandSupportActive: support,
      mirrorlandMenuDefault: true,
      mirrorlandMenuAvailable: true,
      mainMenuAvailable: true,
      compassSeparated: true,
      dualMenuActive: true,

      siteWideBootstrap: false,
      perPageCustomCode: false,

      bubbleMounted: Boolean(bubble && document.body.contains(bubble)),
      overlayMounted: Boolean(overlay && document.body.contains(overlay)),
      overlayOpen: state.overlayOpen,

      fullViewportDrag: true,
      joystickScrollActive: true,
      joystickScrolling: state.joystickActive,
      joystickDirection: state.joystickDirection,
      joystickSpeed: round2(state.joystickSpeed),
      joystickScrollForceMultiplier: JOYSTICK_SCROLL_FORCE_MULTIPLIER,
      joystickScrollForceIncreasePercent: JOYSTICK_SCROLL_FORCE_INCREASE_PERCENT,
      joystickMinScrollSpeed: MIN_SCROLL_SPEED,
      joystickMaxScrollSpeed: MAX_SCROLL_SPEED,
      joystickEffectiveMinScrollSpeed: round2(MIN_SCROLL_SPEED * JOYSTICK_SCROLL_FORCE_MULTIPLIER),
      joystickEffectiveMaxScrollSpeed: round2(MAX_SCROLL_SPEED * JOYSTICK_SCROLL_FORCE_MULTIPLIER),

      activeLens: state.activeLens,
      currentPath: normalizePath(window.location.pathname || "/"),
      currentRouteId: currentAny?.id || "",
      currentRouteTitle: currentAny?.title || "",

      registryAvailable: Boolean(registry()),
      mirrorlandRouteCount: mirrorlandList.length,
      mainMenuRouteCount: mainList.length,
      routeCount: mirrorlandList.length + mainList.length,

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

      document.documentElement.dataset.manorBlueprintMirrorlandPortalActive = "true";
      document.documentElement.dataset.manorBlueprintMirrorlandEntered = String(entered);
      document.documentElement.dataset.manorBlueprintMirrorlandSupportActive = String(support);
      document.documentElement.dataset.manorBlueprintMirrorlandMenuDefault = "true";
      document.documentElement.dataset.manorBlueprintMirrorlandMenuAvailable = "true";
      document.documentElement.dataset.manorBlueprintMainMenuAvailable = "true";
      document.documentElement.dataset.manorBlueprintCompassSeparated = "true";
      document.documentElement.dataset.manorBlueprintDualMenuActive = "true";

      document.documentElement.dataset.manorBlueprintFullViewportDrag = "true";
      document.documentElement.dataset.manorBlueprintJoystickScroll = "true";
      document.documentElement.dataset.manorBlueprintJoystickScrollForceMultiplier = String(JOYSTICK_SCROLL_FORCE_MULTIPLIER);
      document.documentElement.dataset.manorBlueprintJoystickScrollForceIncreasePercent = String(JOYSTICK_SCROLL_FORCE_INCREASE_PERCENT);

      document.documentElement.dataset.manorBlueprintCurrentRoute = payload.currentRouteId;
      document.documentElement.dataset.manorBlueprintLens = state.activeLens;
      document.documentElement.dataset.manorBlueprintActiveLens = state.activeLens;
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
      mirrorlandPortalActive: true,
      dualMenuActive: true,
      compassSeparated: true,
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

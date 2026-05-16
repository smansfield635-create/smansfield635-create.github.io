// /showroom/globe/audralia/index.js
// AUDRALIA_TOUCH_SCOPE_BOXED_GLOBE_LOADER_TNT_v11
// Renewal only.
// Purpose: preserve the existing Audralia globe, keep it boxed, remove the top update bar, and scope finger drag to the box only.
// No procedural substitute. No fake globe. No physical redesign.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_TOUCH_SCOPE_BOXED_GLOBE_LOADER_TNT_v11";
  const ROUTE = "/showroom/globe/audralia/";

  if (window.__DGB_AUDRALIA_ACTIVE_LOADER__) {
    try {
      window.__DGB_AUDRALIA_ACTIVE_LOADER__.stop();
    } catch {}
  }

  const ASSET_SCRIPTS = Object.freeze([
    "/assets/audralia/audralia.kernel.js",
    "/assets/audralia/audralia.lattice256.js",
    "/assets/audralia/audralia.landmap.js",
    "/assets/audralia/audralia.topology.js",
    "/assets/audralia/audralia.terrain.js",
    "/assets/audralia/audralia.hydration.js",
    "/assets/audralia/audralia.climate.js",
    "/assets/audralia/audralia.surface.js",
    "/assets/audralia/audralia.land-surface.js",
    "/assets/audralia/audralia.hex.surface.js",
    "/assets/audralia/audralia.runtime.js",
    "/assets/audralia/audralia.controls.js",
    "/assets/audralia/audralia.canvas.js",
    "/assets/audralia/audralia.render.js",
    "/assets/audralia/audralia.planet.render.js",
    "/assets/audralia.planet.render.js",
    "/assets/audrelia.planet.render.js"
  ]);

  const API_NAMES = Object.freeze([
    "mountAudraliaGlobe",
    "bootAudraliaGlobe",
    "initAudraliaGlobe",
    "attachAudraliaGlobe",
    "mountAudraliaSatelliteGlobe",
    "bootAudraliaSatelliteGlobe",
    "mountAudraliaSatelliteView",
    "bootAudraliaSatelliteView",
    "mountAudraliaCanvas",
    "bootAudraliaCanvas",
    "initAudraliaCanvas",
    "attachAudraliaCanvas",
    "DGBAudraliaGlobe",
    "DGBAudraliaSatelliteGlobe",
    "DGBAudraliaSatellite",
    "DGBAudraliaCanvas",
    "DGBAudralia",
    "AudraliaGlobe",
    "AudraliaSatellite",
    "AudraliaCanvas",
    "AUDRALIA_GLOBE",
    "AUDRALIA_CANVAS"
  ]);

  const state = {
    stopped: false,
    booted: false,
    mounted: false,
    mountedBy: "",
    adoptedCount: 0,
    scriptsLoaded: [],
    scriptsFailed: [],
    timers: [],
    observer: null,
    touchInsideBox: false
  };

  window.__DGB_AUDRALIA_ACTIVE_LOADER__ = {
    contract: CONTRACT,
    stop
  };

  const $ = (selector, root = document) => {
    try {
      return root.querySelector(selector);
    } catch {
      return null;
    }
  };

  const $$ = (selector, root = document) => {
    try {
      return Array.from(root.querySelectorAll(selector));
    } catch {
      return [];
    }
  };

  function stop() {
    state.stopped = true;

    for (const timer of state.timers) {
      try {
        clearTimeout(timer);
      } catch {}
    }

    state.timers.length = 0;

    if (state.observer) {
      try {
        state.observer.disconnect();
      } catch {}
      state.observer = null;
    }
  }

  function later(fn, ms) {
    const timer = setTimeout(() => {
      if (!state.stopped) fn();
    }, ms);

    state.timers.push(timer);
    return timer;
  }

  function routeIsValid() {
    return document.documentElement.getAttribute("data-route") === ROUTE;
  }

  function getStage() {
    return $("#audralia-stage") || $("[data-audralia-stage='true']");
  }

  function getMount() {
    return $("#audraliaCanvasMount") || $("[data-audralia-canvas-mount='true']");
  }

  function getNotice() {
    return $("#audraliaRouteLoaderNotice") || $("[data-audralia-route-loader-notice='true']");
  }

  function getStatus() {
    return $("#audraliaRouteStatus") || $("[data-audralia-route-status='true']");
  }

  function getFallback() {
    return $("[data-stage-fallback='true']");
  }

  function setText(node, text) {
    if (node) node.textContent = text;
  }

  function cacheUrl(path) {
    const joiner = path.includes("?") ? "&" : "?";
    return `${path}${joiner}v=${encodeURIComponent(CONTRACT)}`;
  }

  function injectContainmentStyle() {
    if ($("#audraliaTouchScopeContainmentStyle")) return;

    const style = document.createElement("style");
    style.id = "audraliaTouchScopeContainmentStyle";
    style.textContent = `
      html,
      body {
        touch-action: pan-y !important;
      }

      #audralia-stage,
      [data-audralia-stage="true"] {
        position: relative !important;
        overflow: hidden !important;
        contain: layout paint size !important;
        isolation: isolate !important;
        touch-action: none !important;
        overscroll-behavior: contain !important;
      }

      #audraliaCanvasMount,
      [data-audralia-canvas-mount="true"] {
        position: absolute !important;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
        max-width: 100% !important;
        max-height: 100% !important;
        overflow: hidden !important;
        contain: layout paint size !important;
        transform: none !important;
        transform-origin: center center !important;
        border-radius: inherit !important;
        z-index: 2 !important;
        touch-action: none !important;
        overscroll-behavior: contain !important;
      }

      #audraliaCanvasMount > *,
      [data-audralia-canvas-mount="true"] > * {
        max-width: 100% !important;
        max-height: 100% !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
      }

      #audraliaCanvasMount canvas,
      #audraliaCanvasMount svg,
      #audraliaCanvasMount video,
      [data-audralia-canvas-mount="true"] canvas,
      [data-audralia-canvas-mount="true"] svg,
      [data-audralia-canvas-mount="true"] video {
        position: absolute !important;
        left: 50% !important;
        top: 50% !important;
        width: 100% !important;
        height: 100% !important;
        max-width: 100% !important;
        max-height: 100% !important;
        min-width: 0 !important;
        min-height: 0 !important;
        margin: 0 !important;
        display: block !important;
        object-fit: contain !important;
        transform: translate(-50%, -50%) scale(.92) !important;
        transform-origin: center center !important;
        touch-action: none !important;
      }

      body > canvas[data-audralia-visible-canvas],
      body > canvas[data-audralia-globe],
      body > canvas[data-audralia-satellite],
      body > [data-audralia-mounted="true"] {
        display: none !important;
        pointer-events: none !important;
      }

      [data-audralia-update-bar],
      [data-audralia-visible-update],
      [data-audralia-route-status-bar],
      [data-audralia-loader-notice-bar],
      .audralia-update-bar,
      .audralia-visible-update,
      .audralia-route-status-bar {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        width: 0 !important;
        height: 0 !important;
        max-width: 0 !important;
        max-height: 0 !important;
        overflow: hidden !important;
        position: absolute !important;
        inset: auto !important;
        clip-path: inset(50%) !important;
      }

      @media (max-width: 720px) {
        #audraliaCanvasMount canvas,
        #audraliaCanvasMount svg,
        #audraliaCanvasMount video,
        [data-audralia-canvas-mount="true"] canvas,
        [data-audralia-canvas-mount="true"] svg,
        [data-audralia-canvas-mount="true"] video {
          transform: translate(-50%, -50%) scale(.86) !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function forceBox(stage, mount) {
    if (stage) {
      stage.style.position = "relative";
      stage.style.overflow = "hidden";
      stage.style.contain = "layout paint size";
      stage.style.isolation = "isolate";
      stage.style.touchAction = "none";
      stage.style.overscrollBehavior = "contain";
    }

    if (mount) {
      mount.style.position = "absolute";
      mount.style.inset = "0";
      mount.style.width = "100%";
      mount.style.height = "100%";
      mount.style.maxWidth = "100%";
      mount.style.maxHeight = "100%";
      mount.style.overflow = "hidden";
      mount.style.contain = "layout paint size";
      mount.style.transform = "none";
      mount.style.transformOrigin = "center center";
      mount.style.zIndex = "2";
      mount.style.borderRadius = "inherit";
      mount.style.touchAction = "none";
      mount.style.overscrollBehavior = "contain";
    }
  }

  function forceVisual(node) {
    if (!node || node.nodeType !== 1) return;

    const tag = String(node.tagName || "").toLowerCase();
    const isVisual = tag === "canvas" || tag === "svg" || tag === "video";

    node.setAttribute("data-audralia-box-contained", "true");
    node.style.maxWidth = "100%";
    node.style.maxHeight = "100%";
    node.style.overflow = "hidden";
    node.style.boxSizing = "border-box";

    if (!isVisual) return;

    node.style.position = "absolute";
    node.style.left = "50%";
    node.style.top = "50%";
    node.style.width = "100%";
    node.style.height = "100%";
    node.style.minWidth = "0";
    node.style.minHeight = "0";
    node.style.margin = "0";
    node.style.display = "block";
    node.style.objectFit = "contain";
    node.style.transformOrigin = "center center";
    node.style.transform = window.matchMedia("(max-width: 720px)").matches
      ? "translate(-50%, -50%) scale(.86)"
      : "translate(-50%, -50%) scale(.92)";
    node.style.touchAction = "none";
  }

  function suppressUpdateBars() {
    const known = $$([
      "[data-audralia-update-bar]",
      "[data-audralia-visible-update]",
      "[data-audralia-route-status-bar]",
      "[data-audralia-loader-notice-bar]",
      ".audralia-update-bar",
      ".audralia-visible-update",
      ".audralia-route-status-bar"
    ].join(","));

    for (const node of known) hideNode(node);

    const bodyChildren = Array.from(document.body ? document.body.children : []);

    for (const node of bodyChildren) {
      if (!node || node.id === "audralia-stage" || node.id === "audraliaCanvasMount") continue;

      const text = String(node.textContent || "").trim().toLowerCase();
      const rect = node.getBoundingClientRect();

      const looksLikeTopUpdate =
        text.includes("audralia v") &&
        text.includes("update active") &&
        rect.top >= 0 &&
        rect.top < 120 &&
        rect.height <= 120;

      if (looksLikeTopUpdate) hideNode(node);
    }
  }

  function hideNode(node) {
    if (!node || node.nodeType !== 1) return;

    node.setAttribute("data-audralia-hidden-update-bar", "true");
    node.style.display = "none";
    node.style.visibility = "hidden";
    node.style.opacity = "0";
    node.style.pointerEvents = "none";
    node.style.width = "0";
    node.style.height = "0";
    node.style.maxWidth = "0";
    node.style.maxHeight = "0";
    node.style.overflow = "hidden";
    node.style.position = "absolute";
    node.style.inset = "auto";
  }

  function looksAudraliaRelated(node, stage) {
    if (!node || node.nodeType !== 1) return false;
    if (stage && stage.contains(node)) return false;

    const tag = String(node.tagName || "").toLowerCase();
    const id = String(node.id || "").toLowerCase();
    const className = String(node.className || "").toLowerCase();
    const data = Object.keys(node.dataset || {}).join(" ").toLowerCase();

    if (id.includes("audralia") || className.includes("audralia") || data.includes("audralia")) return true;

    if (tag === "canvas") {
      const rect = node.getBoundingClientRect();
      const bodyChild = node.parentElement === document.body;
      const large = rect.width > 240 || rect.height > 240;
      return bodyChild || large;
    }

    return false;
  }

  function hasMountedVisual() {
    const mount = getMount();

    if (!mount) return false;

    return !!mount.querySelector(
      "canvas,svg,video,[data-audralia-visible-canvas],[data-audralia-mounted='true'],[data-audralia-globe='true'],[data-audralia-satellite='true']"
    );
  }

  function adoptVisuals() {
    if (state.stopped) return false;

    const stage = getStage();
    const mount = getMount();

    if (!stage || !mount) return false;

    forceBox(stage, mount);
    suppressUpdateBars();

    let adopted = false;

    const candidates = $$([
      "canvas",
      "svg",
      "video",
      "[data-audralia-visible-canvas]",
      "[data-audralia-mounted='true']",
      "[data-audralia-globe='true']",
      "[data-audralia-satellite='true']",
      "[data-audralia-canvas='true']"
    ].join(","));

    for (const node of candidates) {
      if (!node || node === stage || node === mount) continue;

      if (mount.contains(node)) {
        forceVisual(node);
        continue;
      }

      if (!looksAudraliaRelated(node, stage)) continue;

      try {
        mount.appendChild(node);
        forceVisual(node);
        state.adoptedCount += 1;
        adopted = true;
      } catch {}
    }

    Array.from(mount.children).forEach(forceVisual);

    if (hasMountedVisual()) {
      stage.setAttribute("data-loader-state", "mounted");
      stage.setAttribute("data-loader-contract", CONTRACT);

      setText(getNotice(), "Existing globe boxed");
      setText(getStatus(), "Audralia globe contained");

      const fallback = getFallback();
      if (fallback) {
        fallback.style.opacity = "0";
        fallback.style.visibility = "hidden";
      }

      state.mounted = true;
      stopObservationOnly();
    }

    return adopted;
  }

  function stopObservationOnly() {
    if (state.observer) {
      try {
        state.observer.disconnect();
      } catch {}
      state.observer = null;
    }
  }

  function callableFromObject(name, value) {
    if (typeof value === "function") return { name, fn: value };

    if (!value || typeof value !== "object") return null;

    for (const method of ["mount", "boot", "init", "attach", "start", "render"]) {
      if (typeof value[method] === "function") {
        return { name: `${name}.${method}`, fn: value[method].bind(value) };
      }
    }

    return null;
  }

  function findCallable() {
    for (const name of API_NAMES) {
      const callable = callableFromObject(name, window[name]);
      if (callable) return callable;
    }

    return null;
  }

  function buildContext() {
    const stage = getStage();
    const mount = getMount();

    const context = {
      route: ROUTE,
      page: "audralia-satellite-globe-access",
      world: "Audralia",
      contract: CONTRACT,
      canvasContract: "AUDRALIA_EXISTING_GLOBE_BOXED_ASSET_CONSUMER_TNT_v11",
      mode: "touch-scoped-satellite-globe-contained",
      requestedView: "satellite-orbital-existing-globe-contained",
      stage,
      mount,
      canvasMount: mount,
      document,
      window,
      consumerOnly: true,
      assetAccessOnly: true,
      existingGlobeRequired: true,
      containmentRequired: true,
      touchScope: "box-only",
      hideUpdateBar: true,
      mayAuthorPlanet: false,
      mayPaintProceduralLandscape: false,
      mayGenerateFallbackTerrain: false
    };

    window.DGB_AUDRALIA_ROUTE_CONTEXT = context;
    window.DGB_AUDRALIA_STAGE = stage;
    window.DGB_AUDRALIA_CANVAS_MOUNT = mount;
    window.DGB_AUDRALIA_REQUESTED_VIEW = "satellite-orbital-existing-globe-contained";
    window.DGB_AUDRALIA_RESTORE_EXISTING_GLOBE = true;
    window.DGB_AUDRALIA_BOX_CONTAINMENT = true;
    window.DGB_AUDRALIA_NO_PROCEDURAL_FALLBACK = true;
    window.DGB_AUDRALIA_REFRESH_EXIT_SAFE = true;
    window.DGB_AUDRALIA_TOUCH_SCOPE = "box-only";
    window.DGB_AUDRALIA_HIDE_UPDATE_BAR = true;

    return context;
  }

  async function callExistingAPI() {
    const callable = findCallable();

    if (!callable || state.stopped) return false;

    try {
      const result = await callable.fn(buildContext());
      adoptVisuals();

      if (result === false) return false;

      state.mountedBy = callable.name;
      return hasMountedVisual() || result !== false;
    } catch {
      return false;
    }
  }

  function dispatchMountEvents() {
    const detail = { context: buildContext(), contract: CONTRACT };

    for (const name of [
      "DGB:AUDRALIA:RESTORE_EXISTING_GLOBE",
      "DGB:AUDRALIA:BOX_EXISTING_GLOBE",
      "DGB:AUDRALIA:SATELLITE_GLOBE_REQUEST",
      "DGB:AUDRALIA:TOUCH_SCOPE_BOX_ONLY",
      "DGB:AUDRALIA:HIDE_UPDATE_BAR",
      "audralia:restore-existing-globe",
      "audralia:box-existing-globe",
      "audralia:satellite-globe-request",
      "audralia:touch-scope-box-only",
      "audralia:hide-update-bar",
      "audralia:mount"
    ]) {
      try {
        window.dispatchEvent(new CustomEvent(name, { detail }));
        document.dispatchEvent(new CustomEvent(name, { detail }));
      } catch {}
    }
  }

  function loadClassic(path, timeoutMs = 650) {
    return new Promise((resolve) => {
      const existing = document.querySelector(`script[data-audralia-asset-src="${path}"]`);

      if (existing) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      let settled = false;

      const finish = (ok) => {
        if (settled) return;
        settled = true;

        if (ok) state.scriptsLoaded.push(path);
        else state.scriptsFailed.push(path);

        resolve(ok);
      };

      script.src = cacheUrl(path);
      script.async = true;
      script.defer = true;
      script.dataset.audraliaAssetSrc = path;
      script.dataset.audraliaAssetContract = CONTRACT;

      script.onload = () => finish(true);
      script.onerror = () => finish(false);

      document.head.appendChild(script);

      later(() => finish(false), timeoutMs);
    });
  }

  async function loadAssetsBounded() {
    const started = performance.now();
    const maxMs = 4500;

    setText(getNotice(), "Loading existing globe assets");
    setText(getStatus(), "Containing satellite globe");

    for (const path of ASSET_SCRIPTS) {
      if (state.stopped) return false;
      if (performance.now() - started > maxMs) break;

      await loadClassic(path);
      dispatchMountEvents();
      await callExistingAPI();
      adoptVisuals();

      if (hasMountedVisual()) {
        state.mountedBy = state.mountedBy || path;
        return true;
      }
    }

    return false;
  }

  function bindTouchScope() {
    const stage = getStage();
    if (!stage || stage.dataset.audraliaTouchScopeBound === "true") return;

    stage.dataset.audraliaTouchScopeBound = "true";

    stage.addEventListener("pointerdown", () => {
      state.touchInsideBox = true;
    }, { passive:true });

    stage.addEventListener("pointerup", () => {
      state.touchInsideBox = false;
    }, { passive:true });

    stage.addEventListener("pointercancel", () => {
      state.touchInsideBox = false;
    }, { passive:true });

    document.addEventListener("pointerdown", (event) => {
      state.touchInsideBox = !!stage.contains(event.target);
    }, { passive:true });

    document.addEventListener("pointerup", () => {
      state.touchInsideBox = false;
    }, { passive:true });

    document.addEventListener("touchmove", (event) => {
      if (!state.touchInsideBox) return;
      if (!stage.contains(event.target)) return;
      event.preventDefault();
    }, { passive:false });
  }

  function startBoundedObservation() {
    const started = performance.now();
    const maxMs = 3200;

    state.observer = new MutationObserver(() => {
      if (state.stopped) return;

      suppressUpdateBars();
      adoptVisuals();

      if (state.mounted || performance.now() - started > maxMs) {
        stopObservationOnly();
      }
    });

    try {
      state.observer.observe(document.body, { childList:true, subtree:true });
    } catch {}

    later(suppressUpdateBars, 40);
    later(adoptVisuals, 80);
    later(suppressUpdateBars, 180);
    later(adoptVisuals, 220);
    later(adoptVisuals, 520);
    later(suppressUpdateBars, 800);
    later(adoptVisuals, 1100);
    later(adoptVisuals, 2100);
    later(stopObservationOnly, maxMs + 250);
  }

  function expose() {
    window.DGBAudraliaRoute = {
      getStatus() {
        return {
          booted: state.booted,
          mounted: state.mounted,
          mountedBy: state.mountedBy,
          adoptedCount: state.adoptedCount,
          contract: CONTRACT,
          scriptsLoaded: state.scriptsLoaded.slice(),
          scriptsFailed: state.scriptsFailed.slice(),
          noProceduralSubstitute: true,
          boxedContainment: true,
          refreshExitSafe: true,
          touchScope: "box-only",
          hideUpdateBar: true
        };
      }
    };
  }

  async function boot() {
    if (!routeIsValid()) return;

    state.stopped = false;
    state.booted = true;

    injectContainmentStyle();
    suppressUpdateBars();

    const stage = getStage();
    const mount = getMount();

    if (!stage || !mount) {
      setText(getNotice(), "Audralia mount missing");
      setText(getStatus(), "Canvas mount unavailable");
      expose();
      return;
    }

    forceBox(stage, mount);
    bindTouchScope();
    startBoundedObservation();
    expose();

    stage.setAttribute("data-loader-state", "connecting");
    stage.setAttribute("data-loader-contract", CONTRACT);

    const loaded = await loadAssetsBounded();

    suppressUpdateBars();
    adoptVisuals();

    if (!loaded && !hasMountedVisual()) {
      stage.setAttribute("data-loader-state", "fallback");
      setText(getNotice(), "Existing globe not mounted");
      setText(getStatus(), "No substitute painted");

      const fallback = getFallback();
      if (fallback) {
        fallback.textContent = "The existing Audralia globe did not mount. No procedural substitute was painted.";
      }
    }

    stopObservationOnly();
    suppressUpdateBars();
    expose();
  }

  window.addEventListener("pagehide", stop, { once:false });

  window.addEventListener("beforeunload", stop, { once:false });

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      state.stopped = false;
      suppressUpdateBars();
      adoptVisuals();
      expose();
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once:true });
  } else {
    boot();
  }
})();

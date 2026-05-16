// /showroom/globe/audralia/index.js
// AUDRALIA_REFRESH_SAFE_BOXED_GLOBE_LOADER_TNT_v9
// Renewal only.
// Purpose: preserve the existing Audralia globe, keep it boxed, and prevent refresh refusal.
// No procedural substitute. No fake globe. No physical redesign.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_REFRESH_SAFE_BOXED_GLOBE_LOADER_TNT_v9";
  const ROUTE = "/showroom/globe/audralia/";

  if (window.__DGB_AUDRALIA_LOADER_ACTIVE__ === CONTRACT) return;
  window.__DGB_AUDRALIA_LOADER_ACTIVE__ = CONTRACT;

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
    booted: false,
    mounted: false,
    mountedBy: "",
    adoptedCount: 0,
    containmentRuns: 0,
    scriptsLoaded: [],
    scriptsFailed: [],
    stopped: false
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
    if ($("#audraliaRefreshSafeContainmentStyle")) return;

    const style = document.createElement("style");
    style.id = "audraliaRefreshSafeContainmentStyle";
    style.textContent = `
      #audralia-stage,
      [data-audralia-stage="true"] {
        position: relative !important;
        overflow: hidden !important;
        contain: layout paint size !important;
        isolation: isolate !important;
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
    const stage = getStage();
    const mount = getMount();
    if (!stage || !mount || state.stopped) return false;

    forceBox(stage, mount);

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
      } catch {
        // Do not block refresh if an asset refuses adoption.
      }
    }

    Array.from(mount.children).forEach(forceVisual);

    if (hasMountedVisual()) {
      stage.setAttribute("data-loader-state", "mounted");
      stage.setAttribute("data-loader-contract", CONTRACT);
      setText(getNotice(), "Existing globe boxed");
      setText(getStatus(), "Audralia globe contained");

      const fb = getFallback();
      if (fb) {
        fb.style.opacity = "0";
        fb.style.visibility = "hidden";
      }

      state.mounted = true;
    }

    return adopted;
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
      canvasContract: "AUDRALIA_EXISTING_GLOBE_BOXED_ASSET_CONSUMER_TNT_v7",
      mode: "refresh-safe-satellite-globe-contained",
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

    return context;
  }

  async function callExistingAPI() {
    const callable = findCallable();
    if (!callable) return false;

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
      "audralia:restore-existing-globe",
      "audralia:box-existing-globe",
      "audralia:satellite-globe-request",
      "audralia:mount"
    ]) {
      try {
        window.dispatchEvent(new CustomEvent(name, { detail }));
        document.dispatchEvent(new CustomEvent(name, { detail }));
      } catch {
        // Event dispatch is optional.
      }
    }
  }

  function loadClassic(path) {
    return new Promise((resolve) => {
      const existing = document.querySelector(`script[data-audralia-asset-src="${path}"]`);
      if (existing) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = cacheUrl(path);
      script.async = false;
      script.defer = false;
      script.dataset.audraliaAssetSrc = path;
      script.dataset.audraliaAssetContract = CONTRACT;

      script.onload = () => {
        state.scriptsLoaded.push(path);
        resolve(true);
      };

      script.onerror = () => {
        state.scriptsFailed.push(path);
        resolve(false);
      };

      document.head.appendChild(script);
    });
  }

  async function loadAssetsOnce() {
    setText(getNotice(), "Loading existing globe assets");
    setText(getStatus(), "Containing satellite globe");

    for (const path of ASSET_SCRIPTS) {
      if (state.stopped) return false;

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

  function startShortContainmentWindow() {
    const started = performance.now();
    const limitMs = 2500;

    const run = () => {
      if (state.stopped) return;

      state.containmentRuns += 1;
      adoptVisuals();

      const elapsed = performance.now() - started;

      if (!state.mounted && elapsed < limitMs) {
        window.requestAnimationFrame(run);
      }
    };

    run();

    const observer = new MutationObserver(() => {
      if (!state.stopped) adoptVisuals();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.setTimeout(() => {
      observer.disconnect();
    }, limitMs + 500);

    window.addEventListener("resize", adoptVisuals, { passive: true });
  }

  function expose() {
    window.DGBAudraliaRoute = {
      getStatus() {
        return {
          booted: state.booted,
          mounted: state.mounted,
          mountedBy: state.mountedBy,
          adoptedCount: state.adoptedCount,
          containmentRuns: state.containmentRuns,
          contract: CONTRACT,
          scriptsLoaded: state.scriptsLoaded.slice(),
          scriptsFailed: state.scriptsFailed.slice(),
          noProceduralSubstitute: true,
          boxedContainment: true,
          refreshSafe: true
        };
      }
    };
  }

  async function boot() {
    if (!routeIsValid()) return;

    state.booted = true;
    state.stopped = false;

    injectContainmentStyle();

    const stage = getStage();
    const mount = getMount();

    if (!stage || !mount) {
      setText(getNotice(), "Audralia mount missing");
      setText(getStatus(), "Canvas mount unavailable");
      expose();
      return;
    }

    forceBox(stage, mount);
    startShortContainmentWindow();
    expose();

    stage.setAttribute("data-loader-state", "connecting");
    stage.setAttribute("data-loader-contract", CONTRACT);

    const loaded = await loadAssetsOnce();

    adoptVisuals();

    if (!loaded && !hasMountedVisual()) {
      stage.setAttribute("data-loader-state", "fallback");
      setText(getNotice(), "Existing globe not mounted");
      setText(getStatus(), "No substitute painted");

      const fb = getFallback();
      if (fb) {
        fb.textContent = "The existing Audralia globe did not mount. No procedural substitute was painted.";
      }
    }

    expose();
  }

  window.addEventListener("pagehide", () => {
    state.stopped = true;
  });

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      state.stopped = false;
      adoptVisuals();
      expose();
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();

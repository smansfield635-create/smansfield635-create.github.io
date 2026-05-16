// /showroom/globe/audralia/index.js
// AUDRALIA_EXISTING_GLOBE_BOX_CONTAINMENT_LOADER_TNT_v7
// Renewal-only containment repair.
// Purpose: restore the existing Audralia globe and force it inside #audralia-stage.
// This file does not paint a substitute planet, landscape, sky, water, or fallback world.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_EXISTING_GLOBE_BOX_CONTAINMENT_LOADER_TNT_v7";
  const ROUTE = "/showroom/globe/audralia/";

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
    scriptsLoaded: [],
    scriptsFailed: [],
    adoptedCount: 0,
    containmentRuns: 0
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

  function stage() {
    return $("#audralia-stage") || $("[data-audralia-stage='true']");
  }

  function mount() {
    return $("#audraliaCanvasMount") || $("[data-audralia-canvas-mount='true']");
  }

  function notice() {
    return $("#audraliaRouteLoaderNotice") || $("[data-audralia-route-loader-notice='true']");
  }

  function status() {
    return $("#audraliaRouteStatus") || $("[data-audralia-route-status='true']");
  }

  function fallback() {
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
    if ($("#audraliaBoxContainmentStyle")) return;

    const style = document.createElement("style");
    style.id = "audraliaBoxContainmentStyle";
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

  function forceStageBox(s, m) {
    if (s) {
      s.style.position = "relative";
      s.style.overflow = "hidden";
      s.style.contain = "layout paint size";
      s.style.isolation = "isolate";
    }

    if (m) {
      m.style.position = "absolute";
      m.style.inset = "0";
      m.style.width = "100%";
      m.style.height = "100%";
      m.style.maxWidth = "100%";
      m.style.maxHeight = "100%";
      m.style.overflow = "hidden";
      m.style.contain = "layout paint size";
      m.style.transform = "none";
      m.style.transformOrigin = "center center";
      m.style.zIndex = "2";
      m.style.borderRadius = "inherit";
    }
  }

  function forceContainedVisual(node) {
    if (!node || node.nodeType !== 1) return;

    node.setAttribute("data-audralia-box-contained", "true");

    const tag = String(node.tagName || "").toLowerCase();
    const isPrimaryVisual = tag === "canvas" || tag === "svg" || tag === "video";

    node.style.maxWidth = "100%";
    node.style.maxHeight = "100%";
    node.style.overflow = "hidden";
    node.style.boxSizing = "border-box";

    if (isPrimaryVisual) {
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
  }

  function looksAudraliaRelated(node, s) {
    if (!node || node.nodeType !== 1) return false;
    if (s && s.contains(node)) return false;

    const tag = String(node.tagName || "").toLowerCase();
    const id = String(node.id || "").toLowerCase();
    const className = String(node.className || "").toLowerCase();
    const data = Object.keys(node.dataset || {}).join(" ").toLowerCase();

    if (id.includes("audralia") || className.includes("audralia") || data.includes("audralia")) return true;

    if (tag === "canvas") {
      const parentIsBody = node.parentElement === document.body;
      const rect = node.getBoundingClientRect();
      const large = rect.width > 240 || rect.height > 240;
      return parentIsBody || large;
    }

    return false;
  }

  function adoptVisuals() {
    const s = stage();
    const m = mount();
    if (!s || !m) return false;

    let adopted = false;

    forceStageBox(s, m);

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
      if (!node || node === s || node === m) continue;

      if (m.contains(node)) {
        forceContainedVisual(node);
        continue;
      }

      if (!looksAudraliaRelated(node, s)) continue;

      try {
        m.appendChild(node);
        forceContainedVisual(node);
        adopted = true;
        state.adoptedCount += 1;
      } catch {
        // Leave the existing asset alone if the browser refuses the move.
      }
    }

    Array.from(m.children).forEach(forceContainedVisual);

    if (hasMountedVisual()) {
      s.setAttribute("data-loader-state", "mounted");
      s.setAttribute("data-loader-contract", CONTRACT);
      setText(notice(), "Existing globe boxed");
      setText(status(), "Audralia globe contained");
      const fb = fallback();
      if (fb) {
        fb.style.opacity = "0";
        fb.style.visibility = "hidden";
      }
      state.mounted = true;
    }

    return adopted;
  }

  function hasMountedVisual() {
    const m = mount();
    if (!m) return false;
    return !!m.querySelector("canvas,svg,video,[data-audralia-visible-canvas],[data-audralia-mounted='true'],[data-audralia-globe='true'],[data-audralia-satellite='true']");
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

  function context() {
    const s = stage();
    const m = mount();

    const ctx = {
      route: ROUTE,
      page: "audralia-satellite-globe-access",
      world: "Audralia",
      contract: CONTRACT,
      canvasContract: "AUDRALIA_EXISTING_GLOBE_BOXED_ASSET_CONSUMER_TNT_v7",
      mode: "satellite-globe-contained",
      requestedView: "satellite-orbital-existing-globe-contained",
      stage: s,
      mount: m,
      canvasMount: m,
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

    window.DGB_AUDRALIA_ROUTE_CONTEXT = ctx;
    window.DGB_AUDRALIA_STAGE = s;
    window.DGB_AUDRALIA_CANVAS_MOUNT = m;
    window.DGB_AUDRALIA_REQUESTED_VIEW = "satellite-orbital-existing-globe-contained";
    window.DGB_AUDRALIA_RESTORE_EXISTING_GLOBE = true;
    window.DGB_AUDRALIA_BOX_CONTAINMENT = true;
    window.DGB_AUDRALIA_NO_PROCEDURAL_FALLBACK = true;

    return ctx;
  }

  async function callExistingAPI() {
    const callable = findCallable();
    if (!callable) return false;

    try {
      const result = await callable.fn(context());
      adoptVisuals();

      if (result === false) return false;

      state.mountedBy = callable.name;
      return hasMountedVisual() || result !== false;
    } catch {
      return false;
    }
  }

  function dispatchMountEvents() {
    const detail = { context: context(), contract: CONTRACT };

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
        // Event dispatch is opportunistic.
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

  async function loadAssets() {
    setText(notice(), "Loading existing globe assets");
    setText(status(), "Containing satellite globe");

    for (const path of ASSET_SCRIPTS) {
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

  function startContainmentLoop() {
    const run = () => {
      state.containmentRuns += 1;
      adoptVisuals();

      if (state.containmentRuns < 360) {
        window.requestAnimationFrame(run);
      }
    };

    run();

    const observer = new MutationObserver(() => adoptVisuals());
    observer.observe(document.body, { childList: true, subtree: true });

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
          boxedContainment: true
        };
      }
    };
  }

  async function boot() {
    if (!routeIsValid()) return;

    state.booted = true;

    injectContainmentStyle();

    const s = stage();
    const m = mount();

    if (!s || !m) {
      setText(notice(), "Audralia mount missing");
      setText(status(), "Canvas mount unavailable");
      expose();
      return;
    }

    forceStageBox(s, m);
    startContainmentLoop();
    expose();

    s.setAttribute("data-loader-state", "connecting");
    s.setAttribute("data-loader-contract", CONTRACT);

    const loaded = await loadAssets();

    adoptVisuals();

    if (!loaded && !hasMountedVisual()) {
      s.setAttribute("data-loader-state", "fallback");
      setText(notice(), "Existing globe not mounted");
      setText(status(), "No substitute painted");
      const fb = fallback();
      if (fb) {
        fb.textContent = "The existing Audralia globe did not mount. No procedural substitute was painted.";
      }
    }

    expose();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();

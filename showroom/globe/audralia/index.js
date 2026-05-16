// /showroom/globe/audralia/index.js
// AUDRALIA_EXISTING_GLOBE_BOX_CONTAINMENT_LOADER_TNT_v7
// Renewal only.
// Purpose: restore the existing Audralia satellite/globe asset path and keep it inside #audralia-stage.
// Forbidden: procedural replacement landscape, generated fallback world, fake globe, image generation, GraphicBox.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_EXISTING_GLOBE_BOX_CONTAINMENT_LOADER_TNT_v7";

  const META = Object.freeze({
    route: "/showroom/globe/audralia/",
    page: "audralia-satellite-globe-access",
    world: "Audralia",
    contract: CONTRACT,
    canvasContract: "AUDRALIA_EXISTING_GLOBE_BOXED_ASSET_CONSUMER_TNT_v7",
    publicPath: "possibility",
    viewModel: "satellite-orbital-existing-globe-access-contained",
    generatedImage: false,
    graphicBox: false,
    proceduralWorldFallback: false,
    streaming: false,
    visualPassClaimed: false
  });

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
    "/assets/audralia/audralia.canvas.js"
  ]);

  const MODULE_SCRIPTS = Object.freeze([
    "/assets/audralia/audralia.canvas.js",
    "/assets/audralia/audralia.runtime.js",
    "/assets/audralia/audralia.controls.js",
    "/assets/audralia/audralia.surface.js",
    "/assets/audralia/audralia.hex.surface.js"
  ]);

  const API_CANDIDATES = Object.freeze([
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

  const EXPORT_CANDIDATES = Object.freeze([
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
    "createAudraliaGlobe",
    "createAudraliaCanvas",
    "mount",
    "boot",
    "init",
    "attach",
    "default"
  ]);

  const state = {
    booted: false,
    mounted: false,
    mountedBy: "",
    containmentActive: false,
    attemptedScripts: [],
    attemptedModules: [],
    loadedScripts: [],
    loadedModules: [],
    errors: []
  };

  function $(selector, root = document) {
    try {
      return root.querySelector(selector);
    } catch {
      return null;
    }
  }

  function setText(node, text) {
    if (node) node.textContent = text;
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

  function validRoute() {
    return document.documentElement.getAttribute("data-route") === META.route;
  }

  function cacheUrl(path) {
    const joiner = path.includes("?") ? "&" : "?";
    return `${path}${joiner}v=${encodeURIComponent(CONTRACT)}`;
  }

  function forceBoxStyles(stage, mount) {
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
    }

    state.containmentActive = true;
  }

  function forceContainedElement(element) {
    if (!element || !(element instanceof HTMLElement || element instanceof SVGElement)) return;

    element.dataset.audraliaBoxContained = "true";

    const style = element.style;
    style.position = "absolute";
    style.inset = "0";
    style.left = "0";
    style.top = "0";
    style.right = "0";
    style.bottom = "0";
    style.width = "100%";
    style.height = "100%";
    style.maxWidth = "100%";
    style.maxHeight = "100%";
    style.minWidth = "0";
    style.minHeight = "0";
    style.margin = "0";
    style.display = "block";
    style.overflow = "hidden";
    style.boxSizing = "border-box";
    style.transformOrigin = "center center";

    if ("objectFit" in style) {
      style.objectFit = "contain";
    }

    if (element.tagName && element.tagName.toLowerCase() === "canvas") {
      element.setAttribute("data-audralia-contained-canvas", "true");
      element.style.touchAction = "none";
    }
  }

  function isLikelyAudraliaCanvas(element, stage) {
    if (!element || element.nodeType !== 1) return false;
    if (stage && stage.contains(element)) return false;

    const tag = element.tagName ? element.tagName.toLowerCase() : "";
    const id = String(element.id || "").toLowerCase();
    const className = String(element.className || "").toLowerCase();
    const data = Object.keys(element.dataset || {}).join(" ").toLowerCase();

    if (id.includes("audralia") || className.includes("audralia") || data.includes("audralia")) return true;

    if (tag === "canvas") {
      const rect = element.getBoundingClientRect();
      const bodyChild = element.parentElement === document.body;
      const large = rect.width > window.innerWidth * 0.35 || rect.height > window.innerHeight * 0.35;
      return bodyChild || large;
    }

    return false;
  }

  function adoptExistingGlobeNodes(stage, mount) {
    if (!stage || !mount) return false;

    let adopted = false;

    const candidates = Array.from(document.querySelectorAll(
      [
        "canvas",
        "svg[data-audralia-visible-canvas]",
        "svg[data-audralia-globe]",
        "video[data-audralia-visible-canvas]",
        "[data-audralia-visible-canvas]",
        "[data-audralia-mounted='true']",
        "[data-audralia-globe='true']",
        "[data-audralia-satellite='true']",
        "[data-audralia-canvas='true']"
      ].join(",")
    ));

    for (const node of candidates) {
      if (!node || node === mount || node === stage) continue;
      if (mount.contains(node)) {
        forceContainedElement(node);
        continue;
      }

      if (!isLikelyAudraliaCanvas(node, stage)) continue;

      try {
        mount.appendChild(node);
        forceContainedElement(node);
        adopted = true;
      } catch (error) {
        state.errors.push(`adopt node: ${error && error.message ? error.message : String(error)}`);
      }
    }

    Array.from(mount.children).forEach(forceContainedElement);

    return adopted;
  }

  function startContainmentObserver(stage, mount) {
    if (!stage || !mount || window.DGB_AUDRALIA_BOX_OBSERVER_ACTIVE) return;

    window.DGB_AUDRALIA_BOX_OBSERVER_ACTIVE = true;

    const contain = () => {
      forceBoxStyles(stage, mount);
      adoptExistingGlobeNodes(stage, mount);
      Array.from(mount.children).forEach(forceContainedElement);
    };

    const observer = new MutationObserver(contain);

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    window.addEventListener("resize", contain, { passive: true });

    contain();
    setTimeout(contain, 100);
    setTimeout(contain, 450);
    setTimeout(contain, 1200);
  }

  function mountHasLiveContent(mount) {
    if (!mount) return false;

    if (mount.querySelector("canvas,svg,video,[data-audralia-visible-canvas],[data-audralia-mounted='true'],[data-audralia-globe='true'],[data-audralia-satellite='true']")) {
      return true;
    }

    return mount.children.length > 0 && String(mount.textContent || "").trim().length === 0;
  }

  function buildContext(stage, mount) {
    const context = Object.freeze({
      route: META.route,
      page: META.page,
      world: META.world,
      contract: META.contract,
      canvasContract: META.canvasContract,
      publicPath: META.publicPath,
      viewModel: META.viewModel,
      mode: "satellite-globe-restore-contained",
      requestedView: "satellite-orbital-existing-globe-contained",
      mount,
      stage,
      document,
      window,
      generatedImage: false,
      graphicBox: false,
      proceduralWorldFallback: false,
      visualPassClaimed: false,
      consumerOnly: true,
      assetAccessOnly: true,
      existingGlobeRequired: true,
      containmentRequired: true,
      mayAuthorPlanet: false,
      mayGenerateFallbackTerrain: false,
      mayPaintProceduralLandscape: false
    });

    window.DGB_AUDRALIA_ROUTE_CONTEXT = context;
    window.DGB_AUDRALIA_CANVAS_MOUNT = mount;
    window.DGB_AUDRALIA_STAGE = stage;
    window.DGB_AUDRALIA_REQUESTED_VIEW = "satellite-orbital-existing-globe-contained";
    window.DGB_AUDRALIA_RESTORE_EXISTING_GLOBE = true;
    window.DGB_AUDRALIA_BOX_CONTAINMENT = true;
    window.DGB_AUDRALIA_NO_PROCEDURAL_FALLBACK = true;

    return context;
  }

  function markMounted(stage, mount, notice, status, mountedBy) {
    state.mounted = true;
    state.mountedBy = mountedBy || "existing_asset_chain_boxed";

    forceBoxStyles(stage, mount);
    adoptExistingGlobeNodes(stage, mount);

    if (stage) {
      stage.setAttribute("data-loader-state", "mounted");
      stage.setAttribute("data-loader-contract", CONTRACT);
      stage.setAttribute("data-mounted-by", state.mountedBy);
    }

    setText(notice, "Existing globe boxed");
    setText(status, "Audralia globe contained");
  }

  function markFallback(stage, notice, status, fallback) {
    if (stage) {
      stage.setAttribute("data-loader-state", "fallback");
      stage.setAttribute("data-loader-contract", CONTRACT);
    }

    setText(notice, "Existing globe asset chain unavailable");
    setText(status, "No replacement landscape painted");

    if (fallback) {
      fallback.textContent =
        "The existing Audralia globe asset chain did not mount. No procedural substitute was painted.";
    }
  }

  function loadClassicScript(path) {
    return new Promise((resolve) => {
      const src = cacheUrl(path);
      state.attemptedScripts.push(src);

      if (document.querySelector(`script[data-audralia-restored-src="${path}"]`)) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.defer = false;
      script.async = false;
      script.dataset.audraliaRestoredSrc = path;
      script.dataset.audraliaRestoreContract = CONTRACT;

      script.onload = () => {
        state.loadedScripts.push(path);
        resolve(true);
      };

      script.onerror = () => {
        state.errors.push(`${path}: classic script unavailable`);
        resolve(false);
      };

      document.head.appendChild(script);
    });
  }

  async function tryModule(path) {
    const src = cacheUrl(path);
    state.attemptedModules.push(src);

    try {
      const module = await import(src);
      state.loadedModules.push(path);
      return module;
    } catch (error) {
      state.errors.push(`${path}: ${error && error.message ? error.message : String(error)}`);
      return null;
    }
  }

  function callableFromObject(sourceName, value) {
    if (typeof value === "function") return { name: sourceName, fn: value };

    if (!value || typeof value !== "object") return null;

    for (const method of ["mount", "boot", "init", "attach", "start", "render"]) {
      if (typeof value[method] === "function") {
        return { name: `${sourceName}.${method}`, fn: value[method].bind(value) };
      }
    }

    return null;
  }

  function getGlobalCallable() {
    for (const key of API_CANDIDATES) {
      const callable = callableFromObject(`global:${key}`, window[key]);
      if (callable) return callable;
    }

    return null;
  }

  function getExportCallable(module) {
    if (!module) return null;

    for (const key of EXPORT_CANDIDATES) {
      const callable = callableFromObject(`export:${key}`, module[key]);
      if (callable) return callable;
    }

    return null;
  }

  async function callMount(callable, context) {
    if (!callable || typeof callable.fn !== "function") return false;

    try {
      const result = await callable.fn(context);
      if (result === false) return false;
      return true;
    } catch (error) {
      state.errors.push(`${callable.name}: ${error && error.message ? error.message : String(error)}`);
      return false;
    }
  }

  function dispatchRestoreEvents(context) {
    const detail = { context, meta: META };

    for (const eventName of [
      "DGB:AUDRALIA:RESTORE_EXISTING_GLOBE",
      "DGB:AUDRALIA:BOX_EXISTING_GLOBE",
      "DGB:AUDRALIA:SATELLITE_GLOBE_REQUEST",
      "audralia:restore-existing-globe",
      "audralia:box-existing-globe",
      "audralia:satellite-globe-request",
      "audralia:mount"
    ]) {
      try {
        window.dispatchEvent(new CustomEvent(eventName, { detail }));
        document.dispatchEvent(new CustomEvent(eventName, { detail }));
      } catch (error) {
        state.errors.push(`${eventName}: ${error && error.message ? error.message : String(error)}`);
      }
    }
  }

  async function connectExistingGlobe(stage, mount, notice, status) {
    const context = buildContext(stage, mount);

    forceBoxStyles(stage, mount);
    startContainmentObserver(stage, mount);

    setText(notice, "Restoring boxed globe bridge");
    setText(status, "Loading Audralia asset chain");

    for (const path of ASSET_SCRIPTS) {
      await loadClassicScript(path);

      dispatchRestoreEvents(context);
      adoptExistingGlobeNodes(stage, mount);

      const globalCallable = getGlobalCallable();
      if (globalCallable) {
        const ok = await callMount(globalCallable, context);
        adoptExistingGlobeNodes(stage, mount);

        if (ok || mountHasLiveContent(mount)) {
          markMounted(stage, mount, notice, status, `${path}:${globalCallable.name}`);
          return true;
        }
      }

      if (mountHasLiveContent(mount)) {
        markMounted(stage, mount, notice, status, `${path}:side_effect_mount`);
        return true;
      }
    }

    for (const path of MODULE_SCRIPTS) {
      const module = await tryModule(path);

      const exportCallable = getExportCallable(module);
      if (exportCallable) {
        const ok = await callMount(exportCallable, context);
        adoptExistingGlobeNodes(stage, mount);

        if (ok || mountHasLiveContent(mount)) {
          markMounted(stage, mount, notice, status, `${path}:${exportCallable.name}`);
          return true;
        }
      }

      dispatchRestoreEvents(context);
      adoptExistingGlobeNodes(stage, mount);

      const globalCallable = getGlobalCallable();
      if (globalCallable) {
        const ok = await callMount(globalCallable, context);
        adoptExistingGlobeNodes(stage, mount);

        if (ok || mountHasLiveContent(mount)) {
          markMounted(stage, mount, notice, status, `${path}:${globalCallable.name}`);
          return true;
        }
      }

      if (mountHasLiveContent(mount)) {
        markMounted(stage, mount, notice, status, `${path}:module_side_effect_mount`);
        return true;
      }
    }

    dispatchRestoreEvents(context);
    adoptExistingGlobeNodes(stage, mount);

    const finalGlobal = getGlobalCallable();
    if (finalGlobal) {
      const ok = await callMount(finalGlobal, context);
      adoptExistingGlobeNodes(stage, mount);

      if (ok || mountHasLiveContent(mount)) {
        markMounted(stage, mount, notice, status, finalGlobal.name);
        return true;
      }
    }

    return false;
  }

  function exposeStatus() {
    window.DGBAudraliaRoute = Object.freeze({
      meta: META,
      getStatus() {
        return Object.freeze({
          booted: state.booted,
          mounted: state.mounted,
          mountedBy: state.mountedBy,
          containmentActive: state.containmentActive,
          route: META.route,
          contract: META.contract,
          canvasContract: META.canvasContract,
          publicPath: META.publicPath,
          viewModel: META.viewModel,
          generatedImage: false,
          graphicBox: false,
          proceduralWorldFallback: false,
          streaming: false,
          visualPassClaimed: false,
          existingGlobeRequired: true,
          assetAccessOnly: true,
          consumerOnlyCanvas: true,
          boxedContainment: true,
          attemptedScripts: state.attemptedScripts.slice(),
          attemptedModules: state.attemptedModules.slice(),
          loadedScripts: state.loadedScripts.slice(),
          loadedModules: state.loadedModules.slice(),
          errors: state.errors.slice()
        });
      }
    });
  }

  async function boot() {
    if (!validRoute()) return;

    const stage = getStage();
    const mount = getMount();
    const notice = getNotice();
    const status = getStatus();
    const fallback = getFallback();

    state.booted = true;
    exposeStatus();

    if (!stage || !mount) {
      setText(notice, "Audralia mount missing");
      setText(status, "Satellite globe canvas mount unavailable");
      return;
    }

    forceBoxStyles(stage, mount);
    startContainmentObserver(stage, mount);

    stage.setAttribute("data-loader-state", "connecting");
    stage.setAttribute("data-loader-contract", CONTRACT);

    const connected = await connectExistingGlobe(stage, mount, notice, status);

    if (!connected) {
      markFallback(stage, notice, status, fallback);
    }

    adoptExistingGlobeNodes(stage, mount);
    exposeStatus();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();

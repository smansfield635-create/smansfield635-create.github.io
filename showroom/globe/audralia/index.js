// /showroom/globe/audralia/index.js
// AUDRALIA_SATELLITE_ASSET_ACCESS_LOADER_TNT_v5
// Renewal only.
// Authority: route loader + satellite/orbital asset bridge.
// This file must consume developed Audralia assets. It must not generate a replacement world.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_SATELLITE_ASSET_ACCESS_LOADER_TNT_v5";

  const META = Object.freeze({
    route: "/showroom/globe/audralia/",
    page: "audralia-satellite-access",
    world: "Audralia",
    contract: CONTRACT,
    canvasContract: "AUDRALIA_CANVAS_ASSET_CONSUMER_SATELLITE_VIEW_TNT_v5",
    publicPath: "possibility",
    viewModel: "satellite-orbital-asset-access",
    generatedImage: false,
    graphicBox: false,
    proceduralWorldFallback: false,
    streaming: false,
    visualPassClaimed: false,
    owns: Object.freeze([
      "route_loader",
      "canvas_mount",
      "asset_bridge",
      "satellite_access_context",
      "public_status"
    ]),
    doesNotOwn: Object.freeze([
      "land_footprint_authority",
      "climate_authority",
      "surface_truth",
      "gauges_logic",
      "planet_generation",
      "procedural_replacement_world"
    ])
  });

  const ASSET_ENTRYPOINTS = Object.freeze([
    "/assets/audralia/audralia.canvas.js",
    "/assets/audralia/audralia.surface.js",
    "/assets/audralia/audralia.land-surface.js",
    "/assets/audralia/audralia.hex.surface.js",
    "/assets/audralia/audralia.runtime.js",
    "/assets/audralia/audralia.controls.js"
  ]);

  const GLOBAL_CANDIDATES = Object.freeze([
    "mountAudraliaSatelliteView",
    "bootAudraliaSatelliteView",
    "mountAudraliaCanvas",
    "bootAudraliaCanvas",
    "initAudraliaCanvas",
    "DGBAudraliaSatellite",
    "DGBAudraliaCanvas",
    "DGBAudralia",
    "AudraliaSatellite",
    "AudraliaCanvas",
    "AUDRALIA_CANVAS"
  ]);

  const EXPORT_CANDIDATES = Object.freeze([
    "mountAudraliaSatelliteView",
    "bootAudraliaSatelliteView",
    "mountAudraliaCanvas",
    "bootAudraliaCanvas",
    "initAudraliaCanvas",
    "attachAudraliaCanvas",
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
    attempted: [],
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
    const html = document.documentElement;
    return !!html && html.getAttribute("data-route") === META.route;
  }

  function cacheUrl(path) {
    const joiner = path.includes("?") ? "&" : "?";
    return `${path}${joiner}v=${encodeURIComponent(CONTRACT)}`;
  }

  function buildContext(stage, mount) {
    return Object.freeze({
      route: META.route,
      page: META.page,
      world: META.world,
      contract: META.contract,
      canvasContract: META.canvasContract,
      publicPath: META.publicPath,
      viewModel: META.viewModel,
      mode: "satellite",
      requestedView: "satellite-orbital",
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
      mayAuthorPlanet: false,
      mayGenerateFallbackTerrain: false
    });
  }

  function markMounted(stage, notice, status, mountedBy) {
    state.mounted = true;
    state.mountedBy = mountedBy || "asset_chain";

    if (stage) {
      stage.setAttribute("data-loader-state", "mounted");
      stage.setAttribute("data-loader-contract", CONTRACT);
      stage.setAttribute("data-mounted-by", state.mountedBy);
    }

    setText(notice, "Satellite asset view active");
    setText(status, "Audralia asset chain mounted");
  }

  function markFallback(stage, notice, status, fallback) {
    if (stage) {
      stage.setAttribute("data-loader-state", "fallback");
      stage.setAttribute("data-loader-contract", CONTRACT);
    }

    setText(notice, "Asset chain unavailable");
    setText(status, "No procedural substitute painted");

    if (fallback) {
      fallback.textContent =
        "Audralia satellite assets did not mount. No replacement world was generated.";
    }
  }

  function mountHasLiveContent(mount) {
    if (!mount) return false;
    if (mount.querySelector("canvas,svg,video,[data-audralia-visible-canvas],[data-audralia-mounted='true']")) {
      return true;
    }
    return mount.children.length > 0 && String(mount.textContent || "").trim().length === 0;
  }

  async function tryDynamicImport(path) {
    const url = cacheUrl(path);
    state.attempted.push(url);

    try {
      const module = await import(url);
      state.loadedModules.push(path);
      return module;
    } catch (error) {
      state.errors.push(`${path}: ${error && error.message ? error.message : String(error)}`);
      return null;
    }
  }

  function getCallableFromExport(module) {
    if (!module) return null;

    for (const key of EXPORT_CANDIDATES) {
      const value = module[key];

      if (typeof value === "function") {
        return {
          name: `export:${key}`,
          fn: value
        };
      }

      if (value && typeof value.mount === "function") {
        return {
          name: `export:${key}.mount`,
          fn: value.mount.bind(value)
        };
      }

      if (value && typeof value.boot === "function") {
        return {
          name: `export:${key}.boot`,
          fn: value.boot.bind(value)
        };
      }

      if (value && typeof value.init === "function") {
        return {
          name: `export:${key}.init`,
          fn: value.init.bind(value)
        };
      }
    }

    return null;
  }

  function getCallableFromGlobal() {
    for (const key of GLOBAL_CANDIDATES) {
      const value = window[key];

      if (typeof value === "function") {
        return {
          name: `global:${key}`,
          fn: value
        };
      }

      if (value && typeof value.mount === "function") {
        return {
          name: `global:${key}.mount`,
          fn: value.mount.bind(value)
        };
      }

      if (value && typeof value.boot === "function") {
        return {
          name: `global:${key}.boot`,
          fn: value.boot.bind(value)
        };
      }

      if (value && typeof value.init === "function") {
        return {
          name: `global:${key}.init`,
          fn: value.init.bind(value)
        };
      }
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

  async function connectAssets(stage, mount, notice, status) {
    const context = buildContext(stage, mount);

    for (const path of ASSET_ENTRYPOINTS) {
      setText(notice, "Connecting satellite asset bridge");
      setText(status, `Checking ${path.split("/").pop()}`);

      const module = await tryDynamicImport(path);

      const exported = getCallableFromExport(module);
      if (exported) {
        const ok = await callMount(exported, context);

        if (ok || mountHasLiveContent(mount)) {
          markMounted(stage, notice, status, `${path}:${exported.name}`);
          return true;
        }
      }

      const global = getCallableFromGlobal();
      if (global) {
        const ok = await callMount(global, context);

        if (ok || mountHasLiveContent(mount)) {
          markMounted(stage, notice, status, `${path}:${global.name}`);
          return true;
        }
      }

      if (mountHasLiveContent(mount)) {
        markMounted(stage, notice, status, `${path}:side_effect_mount`);
        return true;
      }
    }

    const global = getCallableFromGlobal();
    if (global) {
      const ok = await callMount(global, context);

      if (ok || mountHasLiveContent(mount)) {
        markMounted(stage, notice, status, global.name);
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
          assetAccessOnly: true,
          consumerOnlyCanvas: true,
          attempted: state.attempted.slice(),
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
      setText(status, "Satellite canvas mount unavailable");
      return;
    }

    stage.setAttribute("data-loader-state", "connecting");
    stage.setAttribute("data-loader-contract", CONTRACT);

    setText(notice, "Satellite bridge connecting");
    setText(status, "Looking for developed Audralia assets");

    const connected = await connectAssets(stage, mount, notice, status);

    if (!connected) {
      markFallback(stage, notice, status, fallback);
    }

    exposeStatus();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();

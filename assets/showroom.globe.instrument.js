/*
  SHOWROOM_GLOBE_INSTRUMENT_PLANET_ONE_V16_TERRAIN_FIRST_OPTIMUM_PAIR_TNT_v1
  OWNER=SEAN
  TARGET=/assets/showroom.globe.instrument.js

  PURPOSE=
  LOAD_PLANET_1_TERRAIN_RENDER_BEFORE_PLANET_1_MAIN_RENDERER
  FORCE_OPTIMUM_EXPRESSION_TO_USE_DEDICATED_TERRAIN_MODULE
  PRESERVE_NO_DEMO_PLANET_RETURN
  PRESERVE_NO_PUBLIC_PASS_OPTIONS
  PRESERVE_NO_DUPLICATE_RENDER_LOOP

  PRIMARY_RENDER_AUTHORITY=
  /world/render/planet-one.render.js

  TERRAIN_RENDER_AUTHORITY=
  /world/render/planet-one.terrain.render.js

  PAIRED_MAIN_RENDERER=
  PLANET_ONE_RENDER_V15_OPTIMUM_EXPRESSION_ONLY_TNT_v1

  PAIRED_TERRAIN_RENDERER=
  PLANET_ONE_TERRAIN_RENDER_V2_ANCIENT_39B_CRUST_ENGINE_TNT_v1

  HARD RULES=
  NO_DEMO_PLANET_DRAWING
  NO_OWN_SVG_GLOBE
  NO_OWN_LANDMASSES
  NO_OWN_TOPOLOGY
  NO_OWN_TERRAIN
  NO_OWN_AXIS
  NO_PUBLIC_PASS_BUTTONS
  NO_LEGACY_AUTOBOOT_RETRIES
  NO_TIMEOUT_RENDER_RETRIES
  NO_DUPLICATE_RENDER_LOOP
  NO_COMPETING_GLOBE_SURFACE
*/

(function attachShowroomGlobeInstrument(global) {
  "use strict";

  const VERSION = "SHOWROOM_GLOBE_INSTRUMENT_PLANET_ONE_V16_TERRAIN_FIRST_OPTIMUM_PAIR_TNT_v1";

  const PREVIOUS_PAIR = "SHOWROOM_GLOBE_INSTRUMENT_PLANET_ONE_V13_PASS_FILTER_PAIR_TNT_v1";
  const SUPPORT_CONTRACT = "SHOWROOM_GLOBE_INSTRUMENT_PLANET_ONE_SUPPORT_CONTRACT_TNT_v2";
  const LEGACY_VERSION = "SHOWROOM_GLOBE_INSTRUMENT_DEMO_PLANET_VISIBLE_TNT_v2";
  const SHARED_CONTRACT = "PLANET_ONE_RENDER_AND_ASSET_INSTRUMENT_SHARED_CONTRACT_v1";

  const PAIRED_MAIN_RENDERER_VERSION = "PLANET_ONE_RENDER_V15_OPTIMUM_EXPRESSION_ONLY_TNT_v1";
  const PAIRED_TERRAIN_RENDERER_VERSION = "PLANET_ONE_TERRAIN_RENDER_V2_ANCIENT_39B_CRUST_ENGINE_TNT_v1";

  const EXPECTED_GLOBAL = "window.DGBShowroomGlobeInstrument";
  const EXPECTED_API = "renderGlobe";

  const SHOWROOM_ROUTE = "/showroom/";
  const SHOWROOM_GLOBE_ROUTE = "/showroom/globe/";

  const TERRAIN_RENDERER = "/world/render/planet-one.terrain.render.js";
  const PLANET_ONE_RENDERER = "/world/render/planet-one.render.js";

  let terrainPromise = null;
  let rendererPromise = null;
  let lastMount = null;
  let lastHandle = null;
  let autoBooted = false;

  const receipts = [];

  function now() {
    return new Date().toISOString();
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function routePath() {
    const raw = global.location && global.location.pathname ? global.location.pathname : "/";
    return raw.endsWith("/") ? raw : raw + "/";
  }

  function hasTerrainApi() {
    return Boolean(
      global.DGBPlanetOneTerrainRender &&
        typeof global.DGBPlanetOneTerrainRender.createTerrainLayer === "function"
    );
  }

  function hasRendererApi() {
    return Boolean(
      global.DGBPlanetOneRenderTeam &&
        typeof global.DGBPlanetOneRenderTeam.renderPlanetOne === "function"
    );
  }

  function terrainStatus() {
    if (!hasTerrainApi() || typeof global.DGBPlanetOneTerrainRender.getStatus !== "function") {
      return null;
    }

    try {
      return global.DGBPlanetOneTerrainRender.getStatus();
    } catch (error) {
      return {
        error: error && error.message ? error.message : "terrain-status-error"
      };
    }
  }

  function rendererStatus() {
    if (!hasRendererApi() || typeof global.DGBPlanetOneRenderTeam.getStatus !== "function") {
      return null;
    }

    try {
      return global.DGBPlanetOneRenderTeam.getStatus();
    } catch (error) {
      return {
        error: error && error.message ? error.message : "renderer-status-error"
      };
    }
  }

  function markDocument() {
    const root = document.documentElement;

    root.dataset.showroomGlobeInstrument = VERSION;
    root.dataset.showroomGlobeInstrumentPreviousPair = PREVIOUS_PAIR;
    root.dataset.showroomGlobeInstrumentSupportContract = SUPPORT_CONTRACT;
    root.dataset.showroomGlobeInstrumentLegacyRetired = LEGACY_VERSION;
    root.dataset.sharedPlanetOneRenderContract = SHARED_CONTRACT;

    root.dataset.pairedPlanetOneRenderer = PAIRED_MAIN_RENDERER_VERSION;
    root.dataset.pairedPlanetOneTerrainRenderer = PAIRED_TERRAIN_RENDERER_VERSION;

    root.dataset.dgbShowroomGlobeInstrument = "terrain-first-delegation-support-only";
    root.dataset.demoPlanetVisualContract = "retired";
    root.dataset.demoPlanetStatus = "retired";
    root.dataset.visualObject = "planet-1";

    root.dataset.terrainRenderer = TERRAIN_RENDERER;
    root.dataset.planetOneRenderer = PLANET_ONE_RENDERER;
    root.dataset.terrainFirstLoadOrder = "true";
    root.dataset.optimumExpressionOnly = "true";

    root.dataset.assetInstrument = "/assets/showroom.globe.instrument.js";
    root.dataset.assetRole = "terrain-first-delegation-support-only";
    root.dataset.renderAuthority = PLANET_ONE_RENDERER;
    root.dataset.terrainAuthority = TERRAIN_RENDERER;

    root.dataset.singlePlanetAuthority = "true";
    root.dataset.noCompetingGlobeSurface = "true";
    root.dataset.noLegacyDemoPlanetReturn = "true";
    root.dataset.noPublicPassButtons = "true";
    root.dataset.noLegacyAutobootRetries = "true";
    root.dataset.noTimeoutRenderRetries = "true";
    root.dataset.drawsOwnPlanet = "false";
  }

  function publish(type, payload) {
    const detail = {
      type,
      version: VERSION,
      previousPair: PREVIOUS_PAIR,
      supportContract: SUPPORT_CONTRACT,
      legacyRetired: LEGACY_VERSION,
      sharedContract: SHARED_CONTRACT,
      pairedMainRendererVersion: PAIRED_MAIN_RENDERER_VERSION,
      pairedTerrainRendererVersion: PAIRED_TERRAIN_RENDERER_VERSION,
      expectedGlobal: EXPECTED_GLOBAL,
      expectedApi: EXPECTED_API,
      terrainRenderer: TERRAIN_RENDERER,
      planetOneRenderer: PLANET_ONE_RENDERER,
      assetRole: "terrain-first-delegation-support-only",
      payload: payload || {},
      timestamp: now()
    };

    receipts.push(detail);

    if (receipts.length > 80) {
      receipts.splice(0, receipts.length - 80);
    }

    global.dispatchEvent(
      new CustomEvent("showroom:globe-instrument", {
        detail: clone(detail)
      })
    );

    return clone(detail);
  }

  function normalizeMount(mount) {
    if (typeof mount === "string") return document.querySelector(mount);
    return mount || null;
  }

  function findScript(pathname) {
    return Array.from(document.scripts).find(function findExisting(script) {
      if (!script.src) return false;
      return new URL(script.src, global.location.origin).pathname === pathname;
    });
  }

  function appendScript(pathname, globalCheck, dataset) {
    if (globalCheck()) {
      return Promise.resolve(true);
    }

    const existing = findScript(pathname);

    if (existing) {
      if (globalCheck()) {
        return Promise.resolve(true);
      }

      return new Promise(function waitForExisting(resolve, reject) {
        existing.addEventListener(
          "load",
          function loadedExisting() {
            if (globalCheck()) {
              resolve(true);
              return;
            }

            reject(new Error(pathname + " loaded, but expected API is unavailable."));
          },
          { once: true }
        );

        existing.addEventListener(
          "error",
          function failedExisting() {
            reject(new Error(pathname + " failed to load."));
          },
          { once: true }
        );
      });
    }

    return new Promise(function loadNewScript(resolve, reject) {
      const script = document.createElement("script");
      script.src = pathname;
      script.async = false;
      script.dataset.loadedBy = VERSION;

      Object.keys(dataset || {}).forEach(function applyDataset(key) {
        script.dataset[key] = dataset[key];
      });

      script.onload = function onLoad() {
        if (globalCheck()) {
          resolve(true);
          return;
        }

        reject(new Error(pathname + " loaded, but expected API is unavailable."));
      };

      script.onerror = function onError() {
        reject(new Error(pathname + " failed to load."));
      };

      document.body.appendChild(script);
    });
  }

  function loadTerrainRenderer() {
    if (hasTerrainApi()) {
      return Promise.resolve(global.DGBPlanetOneTerrainRender);
    }

    if (terrainPromise) {
      return terrainPromise;
    }

    terrainPromise = appendScript(TERRAIN_RENDERER, hasTerrainApi, {
      terrainAuthority: TERRAIN_RENDERER,
      pairedTerrainRenderer: PAIRED_TERRAIN_RENDERER_VERSION,
      terrainFirstLoadOrder: "true",
      planet: "Planet 1"
    }).then(function terrainReady() {
      publish("terrain_renderer_ready", {
        terrainRenderer: TERRAIN_RENDERER,
        pairedTerrainRendererVersion: PAIRED_TERRAIN_RENDERER_VERSION,
        terrainStatus: terrainStatus()
      });

      return global.DGBPlanetOneTerrainRender;
    });

    return terrainPromise;
  }

  function loadMainRendererAfterTerrain() {
    if (hasRendererApi()) {
      return Promise.resolve(global.DGBPlanetOneRenderTeam);
    }

    if (rendererPromise) {
      return rendererPromise;
    }

    rendererPromise = loadTerrainRenderer()
      .then(function terrainLoadedFirst() {
        return appendScript(PLANET_ONE_RENDERER, hasRendererApi, {
          renderAuthority: PLANET_ONE_RENDERER,
          terrainAuthority: TERRAIN_RENDERER,
          pairedMainRenderer: PAIRED_MAIN_RENDERER_VERSION,
          pairedTerrainRenderer: PAIRED_TERRAIN_RENDERER_VERSION,
          terrainFirstLoadOrder: "true",
          optimumExpressionOnly: "true",
          noCompetingGlobeSurface: "true"
        });
      })
      .then(function rendererReady() {
        publish("main_renderer_ready_after_terrain", {
          planetOneRenderer: PLANET_ONE_RENDERER,
          terrainRenderer: TERRAIN_RENDERER,
          pairedMainRendererVersion: PAIRED_MAIN_RENDERER_VERSION,
          terrainStatus: terrainStatus(),
          rendererStatus: rendererStatus()
        });

        return global.DGBPlanetOneRenderTeam;
      });

    return rendererPromise;
  }

  function hideLegacyFallback() {
    const fallback = document.getElementById("demo-planet-fallback");
    if (!fallback) return false;

    fallback.dataset.active = "false";
    fallback.dataset.reason = "demo-planet-retired-planet-one-terrain-first-optimum-active";
    fallback.hidden = true;
    fallback.setAttribute("aria-hidden", "true");
    fallback.style.display = "none";
    fallback.style.visibility = "hidden";
    fallback.style.opacity = "0";

    return true;
  }

  function renderWaiting(mount, message) {
    if (!mount) return;

    mount.innerHTML =
      '<div style="' +
      [
        "border:1px solid rgba(242,199,111,.36)",
        "border-radius:22px",
        "padding:16px",
        "background:rgba(242,199,111,.055)",
        "color:rgba(228,234,246,.78)",
        "font:800 0.95rem/1.45 system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif",
        "text-align:center"
      ].join(";") +
      '">' +
      String(message || "Planet 1 optimum renderer is preparing.") +
      "</div>";
  }

  function stopExistingRender(api) {
    let stopped = false;

    if (lastHandle && typeof lastHandle.destroy === "function") {
      lastHandle.destroy();
      stopped = true;
    } else if (lastHandle && typeof lastHandle.stop === "function") {
      lastHandle.stop();
      stopped = true;
    }

    if (api && typeof api.destroyAll === "function") {
      api.destroyAll();
      stopped = true;
    } else if (api && typeof api.stopAll === "function") {
      api.stopAll();
      stopped = true;
    }

    return stopped;
  }

  function renderGlobe(mount, options) {
    const target = normalizeMount(mount);
    const config = options || {};

    markDocument();
    hideLegacyFallback();

    if (!target) {
      const error = new Error("renderGlobe requires a valid mount element.");

      publish("render_globe_failed", {
        reason: error.message,
        assetRole: "terrain-first-delegation-support-only"
      });

      throw error;
    }

    target.dataset.showroomGlobeInstrument = VERSION;
    target.dataset.sharedContract = SHARED_CONTRACT;
    target.dataset.pairedMainRendererVersion = PAIRED_MAIN_RENDERER_VERSION;
    target.dataset.pairedTerrainRendererVersion = PAIRED_TERRAIN_RENDERER_VERSION;
    target.dataset.legacyDemoPlanetRetired = "true";
    target.dataset.demoPlanetStatus = "retired";
    target.dataset.visualObject = "planet-1";

    target.dataset.terrainRenderer = TERRAIN_RENDERER;
    target.dataset.planetOneRenderer = PLANET_ONE_RENDERER;
    target.dataset.terrainFirstLoadOrder = "true";
    target.dataset.renderAuthority = PLANET_ONE_RENDERER;
    target.dataset.terrainAuthority = TERRAIN_RENDERER;
    target.dataset.renderDelegation = "planet-one-render-team";
    target.dataset.renderGlobeApiPreserved = "true";
    target.dataset.assetRole = "terrain-first-delegation-support-only";
    target.dataset.singlePlanetAuthority = "true";
    target.dataset.noCompetingGlobeSurface = "true";
    target.dataset.noLegacyDemoPlanetReturn = "true";
    target.dataset.noPublicPassButtons = "true";
    target.dataset.optimumExpressionOnly = "true";
    target.dataset.drawsOwnPlanet = "false";

    renderWaiting(target, "Planet 1 terrain-first optimum expression is preparing.");

    return loadTerrainRenderer()
      .then(function terrainReady() {
        return loadMainRendererAfterTerrain();
      })
      .then(function renderAfterTerrain(api) {
        if (config.stopExisting !== false) {
          stopExistingRender(api);
        }

        lastMount = target;
        lastHandle = api.renderPlanetOne(target, {
          caption:
            config.caption ||
            "Planet 1 · Nine Summits Universe · optimum expression",
          expression: "optimum"
        });

        target.dataset.renderStatus = "mounted";
        target.dataset.instrumentVersion = VERSION;
        target.dataset.planetOneRenderActive = "true";
        target.dataset.planetOneTerrainRenderActive = hasTerrainApi() ? "true" : "false";
        target.dataset.terrainIntegratedBeforeRender = hasTerrainApi() ? "true" : "false";
        target.dataset.ancient39bCrustEngineActive =
          hasTerrainApi() && terrainStatus() ? "true" : "false";
        target.dataset.optimumExpressionOnly = "true";
        target.dataset.assetCoordinated = "true";

        publish("render_globe_delegated_to_planet_one_v16_terrain_first_optimum", {
          mountId: target.id || null,
          terrainRenderer: TERRAIN_RENDERER,
          planetOneRenderer: PLANET_ONE_RENDERER,
          pairedMainRendererVersion: PAIRED_MAIN_RENDERER_VERSION,
          pairedTerrainRendererVersion: PAIRED_TERRAIN_RENDERER_VERSION,
          visualObject: "Planet 1",
          expression: "optimum",
          demoPlanetStatus: "retired",
          terrainIntegratedBeforeRender: hasTerrainApi(),
          noCompetingGlobeSurface: true,
          terrainStatus: terrainStatus(),
          rendererStatus: rendererStatus()
        });

        return {
          ok: true,
          version: VERSION,
          previousPair: PREVIOUS_PAIR,
          supportContract: SUPPORT_CONTRACT,
          legacyRetired: LEGACY_VERSION,
          sharedContract: SHARED_CONTRACT,
          pairedMainRendererVersion: PAIRED_MAIN_RENDERER_VERSION,
          pairedTerrainRendererVersion: PAIRED_TERRAIN_RENDERER_VERSION,
          renderGlobe: true,
          delegated: true,
          visualObject: "Planet 1",
          expression: "optimum",
          demoPlanetStatus: "retired",
          assetRole: "terrain-first-delegation-support-only",
          terrainRenderer: TERRAIN_RENDERER,
          planetOneRenderer: PLANET_ONE_RENDERER,
          terrainIntegratedBeforeRender: hasTerrainApi(),
          handle: lastHandle,
          terrainStatus: terrainStatus(),
          rendererStatus: rendererStatus()
        };
      })
      .catch(function renderFailed(error) {
        target.dataset.renderStatus = "error";
        target.dataset.renderError = error && error.message ? error.message : "unknown";

        renderWaiting(
          target,
          "Planet 1 terrain-first renderer could not load. Check /world/render/planet-one.terrain.render.js and /world/render/planet-one.render.js."
        );

        publish("render_globe_delegate_failed", {
          error: error && error.message ? error.message : "unknown",
          terrainRenderer: TERRAIN_RENDERER,
          planetOneRenderer: PLANET_ONE_RENDERER,
          sharedContract: SHARED_CONTRACT,
          pairedMainRendererVersion: PAIRED_MAIN_RENDERER_VERSION,
          pairedTerrainRendererVersion: PAIRED_TERRAIN_RENDERER_VERSION
        });

        return {
          ok: false,
          version: VERSION,
          delegated: false,
          error: error && error.message ? error.message : "unknown"
        };
      });
  }

  function routeAllowsAutoboot() {
    const path = routePath();
    const hash = global.location && global.location.hash ? global.location.hash : "";

    if (path === SHOWROOM_GLOBE_ROUTE) return true;

    if (
      path === SHOWROOM_ROUTE &&
      (hash === "#planet-one-render" || hash === "#globe-main" || hash === "#planet-one")
    ) {
      return true;
    }

    return false;
  }

  function findAutoMount() {
    return (
      document.querySelector("[data-planet-one-autoboot='true']") ||
      document.getElementById("planet-one-render") ||
      document.getElementById("demo-planet-mount")
    );
  }

  function autoBoot(options) {
    const cfg = options || {};
    const target = normalizeMount(cfg.mount) || findAutoMount();

    markDocument();

    const allowedByForce = cfg.force === true;
    const allowedByData =
      document.documentElement.dataset.allowShowroomGlobeInstrumentAutoboot === "true" ||
      Boolean(target && target.dataset && target.dataset.planetOneAutoboot === "true");

    if (!target) {
      publish("autoboot_blocked_mount_missing", {
        route: routePath()
      });

      return {
        ok: false,
        version: VERSION,
        autoBoot: false,
        reason: "mount-missing"
      };
    }

    if (!allowedByForce && !allowedByData && !routeAllowsAutoboot()) {
      publish("autoboot_blocked", {
        route: routePath(),
        reason: "route-not-authorized-for-terrain-first-autoboot",
        noTimeoutRenderRetries: true
      });

      return {
        ok: true,
        version: VERSION,
        autoBoot: false,
        blocked: true,
        reason: "route-not-authorized-for-terrain-first-autoboot"
      };
    }

    if (autoBooted && cfg.force !== true) {
      publish("autoboot_blocked_already_ran", {
        route: routePath(),
        mountId: target.id || null
      });

      return {
        ok: true,
        version: VERSION,
        autoBoot: false,
        blocked: true,
        reason: "already-ran"
      };
    }

    autoBooted = true;

    return renderGlobe(target, {
      caption:
        cfg.caption ||
        "Planet 1 · Nine Summits Universe · optimum expression",
      stopExisting: cfg.stopExisting
    });
  }

  function start() {
    if (lastHandle && typeof lastHandle.start === "function") {
      lastHandle.start();
    } else if (hasRendererApi() && typeof global.DGBPlanetOneRenderTeam.startAll === "function") {
      global.DGBPlanetOneRenderTeam.startAll();
    }

    publish("delegated_render_started", {
      mountId: lastMount && lastMount.id ? lastMount.id : null
    });

    return true;
  }

  function stop() {
    if (lastHandle && typeof lastHandle.stop === "function") {
      lastHandle.stop();
    } else if (hasRendererApi() && typeof global.DGBPlanetOneRenderTeam.stopAll === "function") {
      global.DGBPlanetOneRenderTeam.stopAll();
    }

    publish("delegated_render_stopped", {
      mountId: lastMount && lastMount.id ? lastMount.id : null
    });

    return true;
  }

  function destroy() {
    if (lastHandle && typeof lastHandle.destroy === "function") {
      lastHandle.destroy();
    } else if (hasRendererApi() && typeof global.DGBPlanetOneRenderTeam.destroyAll === "function") {
      global.DGBPlanetOneRenderTeam.destroyAll();
    }

    lastHandle = null;
    lastMount = null;

    publish("delegated_render_destroyed", {
      sharedContract: SHARED_CONTRACT,
      pairedMainRendererVersion: PAIRED_MAIN_RENDERER_VERSION,
      pairedTerrainRendererVersion: PAIRED_TERRAIN_RENDERER_VERSION
    });

    return true;
  }

  function getStatus() {
    return {
      version: VERSION,
      previousPair: PREVIOUS_PAIR,
      supportContract: SUPPORT_CONTRACT,
      legacyRetired: LEGACY_VERSION,
      sharedContract: SHARED_CONTRACT,
      pairedMainRendererVersion: PAIRED_MAIN_RENDERER_VERSION,
      pairedTerrainRendererVersion: PAIRED_TERRAIN_RENDERER_VERSION,
      expectedGlobal: EXPECTED_GLOBAL,
      expectedApi: EXPECTED_API,
      visualObject: "Planet 1",
      expression: "optimum",
      demoPlanetStatus: "retired",
      terrainRenderer: TERRAIN_RENDERER,
      planetOneRenderer: PLANET_ONE_RENDERER,
      renderAuthority: PLANET_ONE_RENDERER,
      terrainAuthority: TERRAIN_RENDERER,
      assetInstrument: "/assets/showroom.globe.instrument.js",
      assetRole: "terrain-first-delegation-support-only",
      terrainFirstLoadOrder: true,
      terrainIntegrated: hasTerrainApi(),
      mainRendererAvailable: hasRendererApi(),
      singlePlanetAuthority: true,
      noCompetingGlobeSurface: true,
      noLegacyDemoPlanetReturn: true,
      noPublicPassButtons: true,
      autoBooted,
      timeoutRetries: false,
      drawsOwnPlanet: false,
      lastMountId: lastMount && lastMount.id ? lastMount.id : null,
      terrainStatus: terrainStatus(),
      rendererStatus: rendererStatus(),
      receipts: clone(receipts)
    };
  }

  const api = Object.freeze({
    version: VERSION,
    VERSION,
    PREVIOUS_PAIR,
    SUPPORT_CONTRACT,
    LEGACY_VERSION,
    SHARED_CONTRACT,
    PAIRED_MAIN_RENDERER_VERSION,
    PAIRED_TERRAIN_RENDERER_VERSION,
    TERRAIN_RENDERER,
    PLANET_ONE_RENDERER,
    renderGlobe,
    autoBoot,
    start,
    stop,
    destroy,
    loadTerrainRenderer,
    loadMainRendererAfterTerrain,
    getStatus
  });

  markDocument();

  global.DGBShowroomGlobeInstrument = api;

  if (typeof window !== "undefined") {
    window.DGBShowroomGlobeInstrument = api;
  }

  publish("showroom_globe_instrument_v16_terrain_first_optimum_ready", {
    expectedGlobal: EXPECTED_GLOBAL,
    expectedApi: EXPECTED_API,
    sharedContract: SHARED_CONTRACT,
    pairedMainRendererVersion: PAIRED_MAIN_RENDERER_VERSION,
    pairedTerrainRendererVersion: PAIRED_TERRAIN_RENDERER_VERSION,
    demoPlanetStatus: "retired",
    terrainRenderer: TERRAIN_RENDERER,
    planetOneRenderer: PLANET_ONE_RENDERER,
    assetRole: "terrain-first-delegation-support-only",
    noLegacyAutobootRetries: true,
    noTimeoutRenderRetries: true,
    noCompetingGlobeSurface: true,
    drawsOwnPlanet: false,
    optimumExpressionOnly: true
  });

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      function bootWhenReady() {
        autoBoot();
      },
      { once: true }
    );
  } else {
    autoBoot();
  }
})(window);

/*
  SHOWROOM_GLOBE_INSTRUMENT_PLANET_ONE_V11_PAIR_TNT_v1
  SHOWROOM_GLOBE_INSTRUMENT_PLANET_ONE_SUPPORT_CONTRACT_TNT_v2
  PLANET_ONE_RENDER_AND_ASSET_INSTRUMENT_SHARED_CONTRACT_v1

  OWNER=SEAN
  TARGET=/assets/showroom.globe.instrument.js

  PAIRED_RENDERER=
  PLANET_ONE_RENDER_V11_RENDER_ASSET_COORDINATION_TNT_v1

  EXPECTED_GLOBAL=
  window.DGBShowroomGlobeInstrument

  EXPECTED_API=
  renderGlobe

  ROLE=
  ASSET_INSTRUMENT_SUPPORT_ONLY
  DELEGATION_SUPPORT_ONLY

  PRIMARY_RENDER_AUTHORITY=
  /world/render/planet-one.render.js

  HARD RULES=
  NO_DEMO_PLANET_DRAWING
  NO_OWN_SVG_GLOBE
  NO_OWN_LANDMASSES
  NO_OWN_TOPOLOGY
  NO_OWN_AXIS
  NO_LEGACY_AUTOBOOT
  NO_TIMEOUT_RENDER_RETRIES
  NO_DUPLICATE_RENDER_LOOP
  NO_COMPETING_GLOBE_SURFACE
*/

(function attachShowroomGlobeInstrument(global) {
  "use strict";

  const VERSION = "SHOWROOM_GLOBE_INSTRUMENT_PLANET_ONE_V11_PAIR_TNT_v1";
  const SUPPORT_CONTRACT = "SHOWROOM_GLOBE_INSTRUMENT_PLANET_ONE_SUPPORT_CONTRACT_TNT_v2";
  const PREVIOUS_DELEGATE = "SHOWROOM_GLOBE_INSTRUMENT_DEMO_RETIRE_AND_PLANET_ONE_DELEGATE_TNT_v1";
  const LEGACY_VERSION = "SHOWROOM_GLOBE_INSTRUMENT_DEMO_PLANET_VISIBLE_TNT_v2";
  const SHARED_CONTRACT = "PLANET_ONE_RENDER_AND_ASSET_INSTRUMENT_SHARED_CONTRACT_v1";
  const PAIRED_RENDERER_VERSION = "PLANET_ONE_RENDER_V11_RENDER_ASSET_COORDINATION_TNT_v1";

  const EXPECTED_GLOBAL = "window.DGBShowroomGlobeInstrument";
  const EXPECTED_API = "renderGlobe";
  const ROUTE_OWNER = "/showroom/globe/";
  const PLANET_ONE_RENDERER = "/world/render/planet-one.render.js";

  let rendererPromise = null;
  let lastMount = null;
  let lastHandle = null;
  const receipts = [];

  function now() {
    return new Date().toISOString();
  }

  function routePath() {
    const raw = global.location && global.location.pathname ? global.location.pathname : "/";
    return raw.endsWith("/") ? raw : raw + "/";
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function markDocument() {
    const root = document.documentElement;

    root.dataset.showroomGlobeInstrument = VERSION;
    root.dataset.showroomGlobeInstrumentSupportContract = SUPPORT_CONTRACT;
    root.dataset.dgbShowroomGlobeInstrument = "delegation-support-only";
    root.dataset.showroomGlobeInstrumentPreviousDelegate = PREVIOUS_DELEGATE;
    root.dataset.showroomGlobeInstrumentLegacyRetired = LEGACY_VERSION;
    root.dataset.sharedPlanetOneRenderContract = SHARED_CONTRACT;
    root.dataset.pairedPlanetOneRenderer = PAIRED_RENDERER_VERSION;

    root.dataset.demoPlanetVisualContract = "retired";
    root.dataset.demoPlanetStatus = "retired";
    root.dataset.visualObject = "planet-1";
    root.dataset.planetOneRenderer = PLANET_ONE_RENDERER;
    root.dataset.planetOneDelegateActive = "true";

    root.dataset.assetInstrument = "/assets/showroom.globe.instrument.js";
    root.dataset.assetRole = "delegation-support-only";
    root.dataset.renderAuthority = PLANET_ONE_RENDERER;
    root.dataset.singlePlanetAuthority = "true";
    root.dataset.noCompetingGlobeSurface = "true";
    root.dataset.noLegacyDemoPlanetReturn = "true";
    root.dataset.noLegacyAutoboot = "true";
    root.dataset.noTimeoutRenderRetries = "true";
    root.dataset.drawsOwnPlanet = "false";
  }

  function publish(type, payload) {
    const detail = {
      type,
      version: VERSION,
      supportContract: SUPPORT_CONTRACT,
      previousDelegate: PREVIOUS_DELEGATE,
      legacyRetired: LEGACY_VERSION,
      sharedContract: SHARED_CONTRACT,
      pairedRendererVersion: PAIRED_RENDERER_VERSION,
      expectedGlobal: EXPECTED_GLOBAL,
      expectedApi: EXPECTED_API,
      routeOwner: ROUTE_OWNER,
      planetOneRenderer: PLANET_ONE_RENDERER,
      assetRole: "delegation-support-only",
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

  function rendererApiReady() {
    return Boolean(
      global.DGBPlanetOneRenderTeam &&
        typeof global.DGBPlanetOneRenderTeam.renderPlanetOne === "function"
    );
  }

  function rendererStatus() {
    if (!rendererApiReady() || typeof global.DGBPlanetOneRenderTeam.getStatus !== "function") {
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

  function hideLegacyFallback() {
    const fallback = document.getElementById("demo-planet-fallback");
    if (!fallback) return false;

    fallback.dataset.active = "false";
    fallback.dataset.reason = "demo-planet-retired-planet-one-v11-delegation-active";
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
      String(message || "Planet 1 renderer is preparing.") +
      "</div>";
  }

  function findExistingRendererScript() {
    return Array.from(document.scripts).find(function findScript(script) {
      if (!script.src) return false;
      return new URL(script.src, global.location.origin).pathname === PLANET_ONE_RENDERER;
    });
  }

  function loadPlanetOneRenderer() {
    if (rendererApiReady()) {
      return Promise.resolve(global.DGBPlanetOneRenderTeam);
    }

    if (rendererPromise) {
      return rendererPromise;
    }

    rendererPromise = new Promise(function loadRenderer(resolve, reject) {
      const existing = findExistingRendererScript();

      if (existing) {
        Promise.resolve().then(function checkExistingGlobal() {
          if (rendererApiReady()) {
            resolve(global.DGBPlanetOneRenderTeam);
            return;
          }

          existing.addEventListener(
            "load",
            function loadedExisting() {
              if (rendererApiReady()) {
                resolve(global.DGBPlanetOneRenderTeam);
                return;
              }

              reject(new Error("Planet One renderer script loaded, but API is unavailable."));
            },
            { once: true }
          );

          existing.addEventListener(
            "error",
            function existingFailed() {
              reject(new Error("Existing Planet One renderer script failed."));
            },
            { once: true }
          );

          if (
            existing.dataset &&
            existing.dataset.assetInstrumentLoadChecked === VERSION &&
            !rendererApiReady()
          ) {
            reject(new Error("Existing Planet One renderer script is present, but API is unavailable."));
          }

          existing.dataset.assetInstrumentLoadChecked = VERSION;
        });

        return;
      }

      const script = document.createElement("script");
      script.src = PLANET_ONE_RENDERER;
      script.async = true;
      script.dataset.loadedBy = VERSION;
      script.dataset.assetRole = "delegation-support-only";
      script.dataset.sharedContract = SHARED_CONTRACT;
      script.dataset.pairedRenderer = PAIRED_RENDERER_VERSION;
      script.dataset.noCompetingGlobeSurface = "true";

      script.onload = function onLoad() {
        if (rendererApiReady()) {
          publish("planet_one_renderer_loaded", {
            renderer: PLANET_ONE_RENDERER,
            loadedBy: VERSION,
            pairedRendererVersion: PAIRED_RENDERER_VERSION,
            sharedContract: SHARED_CONTRACT
          });

          resolve(global.DGBPlanetOneRenderTeam);
          return;
        }

        reject(new Error("Planet One renderer script loaded, but API is unavailable."));
      };

      script.onerror = function onError() {
        reject(new Error("Planet One renderer failed to load."));
      };

      document.body.appendChild(script);
    });

    return rendererPromise;
  }

  function stopExistingRender(api) {
    let stopped = false;

    if (lastHandle && typeof lastHandle.stop === "function") {
      lastHandle.stop();
      stopped = true;
    } else if (
      lastHandle &&
      lastHandle.handle &&
      typeof lastHandle.handle.stop === "function"
    ) {
      lastHandle.handle.stop();
      stopped = true;
    }

    if (api && typeof api.stopAll === "function") {
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
        assetRole: "delegation-support-only"
      });

      throw error;
    }

    target.dataset.showroomGlobeInstrument = VERSION;
    target.dataset.showroomGlobeInstrumentSupportContract = SUPPORT_CONTRACT;
    target.dataset.sharedContract = SHARED_CONTRACT;
    target.dataset.pairedRendererVersion = PAIRED_RENDERER_VERSION;
    target.dataset.legacyDemoPlanetRetired = "true";
    target.dataset.demoPlanetStatus = "retired";
    target.dataset.visualObject = "planet-1";
    target.dataset.planetOneRenderer = PLANET_ONE_RENDERER;
    target.dataset.renderAuthority = PLANET_ONE_RENDERER;
    target.dataset.renderDelegation = "planet-one-render-team";
    target.dataset.renderGlobeApiPreserved = "true";
    target.dataset.assetRole = "delegation-support-only";
    target.dataset.singlePlanetAuthority = "true";
    target.dataset.noCompetingGlobeSurface = "true";
    target.dataset.noLegacyDemoPlanetReturn = "true";
    target.dataset.drawsOwnPlanet = "false";

    renderWaiting(target, "Planet 1 renderer is preparing.");

    return loadPlanetOneRenderer()
      .then(function delegateToPlanetOne(api) {
        if (config.stopExisting !== false) {
          stopExistingRender(api);
        }

        lastMount = target;
        lastHandle = api.renderPlanetOne(target, {
          caption:
            config.caption ||
            "Planet 1 · Nine Summits Universe · V11 delegated render lane"
        });

        target.dataset.renderStatus = "mounted";
        target.dataset.instrumentVersion = VERSION;
        target.dataset.planetOneRenderActive = "true";
        target.dataset.opaqueGlobeActive = "true";
        target.dataset.sunReflectionActive = "true";
        target.dataset.moonReflectionActive = "true";
        target.dataset.topologySeparationActive = "true";
        target.dataset.visualSoupCorrection = "true";
        target.dataset.assetCoordinated = "true";

        publish("render_globe_delegated_to_planet_one_v11", {
          mountId: target.id || null,
          renderer: PLANET_ONE_RENDERER,
          pairedRendererVersion: PAIRED_RENDERER_VERSION,
          visualObject: "Planet 1",
          demoPlanetStatus: "retired",
          sharedContract: SHARED_CONTRACT,
          noCompetingGlobeSurface: true,
          rendererStatus: rendererStatus()
        });

        return {
          ok: true,
          version: VERSION,
          supportContract: SUPPORT_CONTRACT,
          previousDelegate: PREVIOUS_DELEGATE,
          legacyRetired: LEGACY_VERSION,
          sharedContract: SHARED_CONTRACT,
          pairedRendererVersion: PAIRED_RENDERER_VERSION,
          renderGlobe: true,
          delegated: true,
          visualObject: "Planet 1",
          demoPlanetStatus: "retired",
          assetRole: "delegation-support-only",
          renderer: PLANET_ONE_RENDERER,
          handle: lastHandle,
          rendererStatus: rendererStatus()
        };
      })
      .catch(function renderFailed(error) {
        target.dataset.renderStatus = "error";
        target.dataset.renderError = error && error.message ? error.message : "unknown";

        renderWaiting(
          target,
          "Planet 1 renderer could not load. Check /world/render/planet-one.render.js."
        );

        publish("render_globe_delegate_failed", {
          error: error && error.message ? error.message : "unknown",
          renderer: PLANET_ONE_RENDERER,
          sharedContract: SHARED_CONTRACT,
          pairedRendererVersion: PAIRED_RENDERER_VERSION
        });

        return {
          ok: false,
          version: VERSION,
          delegated: false,
          error: error && error.message ? error.message : "unknown"
        };
      });
  }

  function autoBoot(options) {
    const cfg = options || {};
    const path = routePath();

    const allowedByForce = cfg.force === true;
    const allowedByData =
      document.documentElement.dataset.allowShowroomGlobeInstrumentAutoboot === "true";

    const allowedRoute = path === ROUTE_OWNER;

    if (!allowedRoute || (!allowedByForce && !allowedByData)) {
      markDocument();

      publish("legacy_autoboot_blocked", {
        route: path,
        routeOwner: ROUTE_OWNER,
        reason: "asset-instrument-delegation-only",
        force: Boolean(cfg.force),
        allowedByData,
        noTimeoutRenderRetries: true
      });

      return {
        ok: true,
        version: VERSION,
        autoBoot: false,
        blocked: true,
        reason: "asset-instrument-delegation-only",
        route: path,
        routeOwner: ROUTE_OWNER
      };
    }

    const target =
      normalizeMount(cfg.mount) ||
      document.getElementById("planet-one-render") ||
      document.getElementById("demo-planet-mount");

    if (!target) {
      publish("autoboot_allowed_but_mount_missing", {
        route: path
      });

      return {
        ok: false,
        version: VERSION,
        autoBoot: true,
        reason: "mount-missing"
      };
    }

    return renderGlobe(target, {
      caption:
        cfg.caption ||
        "Planet 1 · Nine Summits Universe · V11 delegated inspection render lane",
      stopExisting: cfg.stopExisting
    });
  }

  function start() {
    if (lastHandle && typeof lastHandle.start === "function") {
      lastHandle.start();
    } else if (
      lastHandle &&
      lastHandle.handle &&
      typeof lastHandle.handle.start === "function"
    ) {
      lastHandle.handle.start();
    } else if (
      rendererApiReady() &&
      typeof global.DGBPlanetOneRenderTeam.startAll === "function"
    ) {
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
    } else if (
      lastHandle &&
      lastHandle.handle &&
      typeof lastHandle.handle.stop === "function"
    ) {
      lastHandle.handle.stop();
    } else if (
      rendererApiReady() &&
      typeof global.DGBPlanetOneRenderTeam.stopAll === "function"
    ) {
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
    } else if (
      rendererApiReady() &&
      typeof global.DGBPlanetOneRenderTeam.destroyAll === "function"
    ) {
      global.DGBPlanetOneRenderTeam.destroyAll();
    }

    lastHandle = null;
    lastMount = null;

    publish("delegated_render_destroyed", {
      sharedContract: SHARED_CONTRACT,
      pairedRendererVersion: PAIRED_RENDERER_VERSION
    });

    return true;
  }

  function getStatus() {
    return {
      version: VERSION,
      supportContract: SUPPORT_CONTRACT,
      previousDelegate: PREVIOUS_DELEGATE,
      legacyRetired: LEGACY_VERSION,
      sharedContract: SHARED_CONTRACT,
      pairedRendererVersion: PAIRED_RENDERER_VERSION,
      expectedGlobal: EXPECTED_GLOBAL,
      expectedApi: EXPECTED_API,
      routeOwner: ROUTE_OWNER,
      visualObject: "Planet 1",
      demoPlanetStatus: "retired",
      renderer: PLANET_ONE_RENDERER,
      renderAuthority: PLANET_ONE_RENDERER,
      assetInstrument: "/assets/showroom.globe.instrument.js",
      assetRole: "delegation-support-only",
      singlePlanetAuthority: true,
      noCompetingGlobeSurface: true,
      noLegacyDemoPlanetReturn: true,
      autoBootDefault: false,
      timeoutRetries: false,
      drawsOwnPlanet: false,
      lastMountId: lastMount && lastMount.id ? lastMount.id : null,
      hasPlanetOneRenderer: rendererApiReady(),
      rendererStatus: rendererStatus(),
      receipts: clone(receipts)
    };
  }

  const api = Object.freeze({
    version: VERSION,
    VERSION,
    SUPPORT_CONTRACT,
    PREVIOUS_DELEGATE,
    LEGACY_VERSION,
    SHARED_CONTRACT,
    PAIRED_RENDERER_VERSION,
    ROUTE_OWNER,
    PLANET_ONE_RENDERER,
    renderGlobe,
    autoBoot,
    start,
    stop,
    destroy,
    getStatus
  });

  markDocument();

  global.DGBShowroomGlobeInstrument = api;

  if (typeof window !== "undefined") {
    window.DGBShowroomGlobeInstrument = api;
  }

  publish("showroom_globe_instrument_v11_pair_ready", {
    expectedGlobal: EXPECTED_GLOBAL,
    expectedApi: EXPECTED_API,
    sharedContract: SHARED_CONTRACT,
    pairedRendererVersion: PAIRED_RENDERER_VERSION,
    demoPlanetStatus: "retired",
    renderer: PLANET_ONE_RENDERER,
    assetRole: "delegation-support-only",
    noLegacyAutoboot: true,
    noTimeoutRenderRetries: true,
    noCompetingGlobeSurface: true,
    drawsOwnPlanet: false
  });
})(window);

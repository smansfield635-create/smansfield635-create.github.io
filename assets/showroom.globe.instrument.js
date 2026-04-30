/*
  SHOWROOM_GLOBE_INSTRUMENT_DEMO_RETIRE_AND_PLANET_ONE_DELEGATE_TNT_v1
  OWNER=SEAN
  TARGET=/assets/showroom.globe.instrument.js

  PURPOSE=
  RETIRE_LEGACY_DEMO_PLANET_RENDERING
  PRESERVE_BACKWARD_COMPATIBILITY_FOR window.DGBShowroomGlobeInstrument
  PRESERVE EXPECTED_API=renderGlobe
  DELEGATE ANY EXPLICIT GLOBE_RENDER_REQUEST TO /world/render/planet-one.render.js
  PREVENT_LEGACY_AUTOBOOT_TIMEOUTS_FROM_CREATING_LAG

  LEGACY_RETIRED=
  SHOWROOM_GLOBE_INSTRUMENT_DEMO_PLANET_VISIBLE_TNT_v2

  CURRENT_AUTHORITY=
  /world/render/planet-one.render.js

  ROUTE_OWNER=
  /showroom/globe/

  VISUAL_OBJECT=
  PLANET_1

  DEMO_PLANET_STATUS=
  RETIRED

  TREE_STATUS=
  DEMO_MODE

  HARD_RULES=
  NO_AUTOBOOT_ON_PARENT_SHOWROOM
  NO_TIMEOUT_RENDER_RETRIES
  NO_DEMO_PLANET_DRAWING
  NO_DUPLICATE_RENDER_LOOP
  NO_PUBLIC_RECEIPT_TEXT
*/

(function attachShowroomGlobeInstrument(global) {
  "use strict";

  const VERSION = "SHOWROOM_GLOBE_INSTRUMENT_DEMO_RETIRE_AND_PLANET_ONE_DELEGATE_TNT_v1";
  const LEGACY_VERSION = "SHOWROOM_GLOBE_INSTRUMENT_DEMO_PLANET_VISIBLE_TNT_v2";
  const EXPECTED_GLOBAL = "window.DGBShowroomGlobeInstrument";
  const EXPECTED_API = "renderGlobe";
  const ROUTE_OWNER = "/showroom/globe/";
  const PLANET_ONE_RENDERER = "/world/render/planet-one.render.js";

  let rendererPromise = null;
  let lastMount = null;
  let lastHandle = null;

  function now() {
    return new Date().toISOString();
  }

  function routePath() {
    const raw = global.location && global.location.pathname ? global.location.pathname : "/";
    return raw.endsWith("/") ? raw : raw + "/";
  }

  function markDocument() {
    const root = document.documentElement;

    root.dataset.showroomGlobeInstrument = VERSION;
    root.dataset.dgbShowroomGlobeInstrument = "delegation-only";
    root.dataset.showroomGlobeInstrumentLegacyRetired = LEGACY_VERSION;
    root.dataset.demoPlanetVisualContract = "retired";
    root.dataset.demoPlanetStatus = "retired";
    root.dataset.visualObject = "planet-1";
    root.dataset.planetOneRenderer = PLANET_ONE_RENDERER;
    root.dataset.planetOneDelegateActive = "true";
    root.dataset.noLegacyAutoboot = "true";
    root.dataset.noTimeoutRenderRetries = "true";
  }

  function publish(type, payload) {
    const detail = {
      type,
      version: VERSION,
      legacyRetired: LEGACY_VERSION,
      expectedGlobal: EXPECTED_GLOBAL,
      expectedApi: EXPECTED_API,
      routeOwner: ROUTE_OWNER,
      planetOneRenderer: PLANET_ONE_RENDERER,
      payload: payload || {},
      timestamp: now()
    };

    global.dispatchEvent(
      new CustomEvent("showroom:globe-instrument", {
        detail
      })
    );

    return detail;
  }

  function normalizeMount(mount) {
    if (typeof mount === "string") {
      return document.querySelector(mount);
    }

    return mount || null;
  }

  function hideLegacyFallback() {
    const fallback = document.getElementById("demo-planet-fallback");

    if (!fallback) return false;

    fallback.dataset.active = "false";
    fallback.dataset.reason = "demo-planet-retired-planet-one-delegation-active";
    fallback.hidden = true;
    fallback.setAttribute("aria-hidden", "true");
    fallback.style.display = "none";
    fallback.style.visibility = "hidden";
    fallback.style.opacity = "0";

    return true;
  }

  function loadPlanetOneRenderer() {
    if (
      global.DGBPlanetOneRenderTeam &&
      typeof global.DGBPlanetOneRenderTeam.renderPlanetOne === "function"
    ) {
      return Promise.resolve(global.DGBPlanetOneRenderTeam);
    }

    if (rendererPromise) {
      return rendererPromise;
    }

    rendererPromise = new Promise(function loadRenderer(resolve, reject) {
      const existing = Array.from(document.scripts).find(function findScript(script) {
        if (!script.src) return false;
        return new URL(script.src, global.location.origin).pathname === PLANET_ONE_RENDERER;
      });

      if (existing) {
        existing.addEventListener(
          "load",
          function loadedExisting() {
            if (
              global.DGBPlanetOneRenderTeam &&
              typeof global.DGBPlanetOneRenderTeam.renderPlanetOne === "function"
            ) {
              resolve(global.DGBPlanetOneRenderTeam);
              return;
            }

            reject(new Error("Planet One renderer loaded, but API is unavailable."));
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
          global.DGBPlanetOneRenderTeam &&
          typeof global.DGBPlanetOneRenderTeam.renderPlanetOne === "function"
        ) {
          resolve(global.DGBPlanetOneRenderTeam);
        }

        return;
      }

      const script = document.createElement("script");
      script.src = PLANET_ONE_RENDERER;
      script.async = true;
      script.dataset.loadedBy = VERSION;

      script.onload = function onLoad() {
        if (
          global.DGBPlanetOneRenderTeam &&
          typeof global.DGBPlanetOneRenderTeam.renderPlanetOne === "function"
        ) {
          publish("planet_one_renderer_loaded", {
            renderer: PLANET_ONE_RENDERER,
            loadedBy: VERSION
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
      String(message || "Planet 1 renderer is loading.") +
      "</div>";
  }

  function renderGlobe(mount, options) {
    const target = normalizeMount(mount);
    const config = options || {};

    markDocument();
    hideLegacyFallback();

    if (!target) {
      const error = new Error("renderGlobe requires a valid mount element.");
      publish("render_globe_failed", {
        reason: error.message
      });
      throw error;
    }

    target.dataset.showroomGlobeInstrument = VERSION;
    target.dataset.legacyDemoPlanetRetired = "true";
    target.dataset.demoPlanetStatus = "retired";
    target.dataset.visualObject = "planet-1";
    target.dataset.planetOneRenderer = PLANET_ONE_RENDERER;
    target.dataset.renderDelegation = "planet-one-render-team";
    target.dataset.renderGlobeApiPreserved = "true";

    renderWaiting(target, "Planet 1 renderer is preparing.");

    return loadPlanetOneRenderer()
      .then(function delegateToPlanetOne(api) {
        if (config.stopExisting !== false && typeof api.stopAll === "function") {
          api.stopAll();
        }

        lastMount = target;
        lastHandle = api.renderPlanetOne(target, {
          caption:
            config.caption ||
            "Planet 1 · Nine Summits Universe · delegated globe render lane"
        });

        target.dataset.renderStatus = "mounted";
        target.dataset.instrumentVersion = VERSION;
        target.dataset.planetOneRenderActive = "true";
        target.dataset.opaqueGlobeActive = "true";
        target.dataset.sunReflectionActive = "true";
        target.dataset.moonReflectionActive = "true";

        publish("render_globe_delegated_to_planet_one", {
          mountId: target.id || null,
          renderer: PLANET_ONE_RENDERER,
          visualObject: "Planet 1",
          demoPlanetStatus: "retired"
        });

        return {
          ok: true,
          version: VERSION,
          legacyRetired: LEGACY_VERSION,
          renderGlobe: true,
          delegated: true,
          visualObject: "Planet 1",
          demoPlanetStatus: "retired",
          renderer: PLANET_ONE_RENDERER,
          handle: lastHandle
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
          renderer: PLANET_ONE_RENDERER
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
    const allowedByOption = cfg.force === true;
    const allowedByData =
      document.documentElement.dataset.allowShowroomGlobeInstrumentAutoboot === "true";

    const allowedRoute = path === ROUTE_OWNER;

    if (!allowedRoute || (!allowedByOption && !allowedByData)) {
      markDocument();

      publish("legacy_autoboot_blocked", {
        route: path,
        routeOwner: ROUTE_OWNER,
        reason: "legacy-demo-autoboot-retired",
        force: Boolean(cfg.force),
        allowedByData
      });

      return {
        ok: true,
        version: VERSION,
        autoBoot: false,
        blocked: true,
        reason: "legacy-demo-autoboot-retired",
        route: path,
        routeOwner: ROUTE_OWNER
      };
    }

    const mount =
      normalizeMount(cfg.mount) ||
      document.getElementById("planet-one-render") ||
      document.getElementById("demo-planet-mount");

    if (!mount) {
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

    return renderGlobe(mount, {
      caption:
        cfg.caption ||
        "Planet 1 · Nine Summits Universe · delegated inspection render lane",
      stopExisting: cfg.stopExisting
    });
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
      global.DGBPlanetOneRenderTeam &&
      typeof global.DGBPlanetOneRenderTeam.stopAll === "function"
    ) {
      global.DGBPlanetOneRenderTeam.stopAll();
    }

    publish("delegated_render_stopped", {
      mountId: lastMount && lastMount.id ? lastMount.id : null
    });

    return true;
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
      global.DGBPlanetOneRenderTeam &&
      typeof global.DGBPlanetOneRenderTeam.startAll === "function"
    ) {
      global.DGBPlanetOneRenderTeam.startAll();
    }

    publish("delegated_render_started", {
      mountId: lastMount && lastMount.id ? lastMount.id : null
    });

    return true;
  }

  function getStatus() {
    return {
      version: VERSION,
      legacyRetired: LEGACY_VERSION,
      expectedGlobal: EXPECTED_GLOBAL,
      expectedApi: EXPECTED_API,
      routeOwner: ROUTE_OWNER,
      visualObject: "Planet 1",
      demoPlanetStatus: "retired",
      renderer: PLANET_ONE_RENDERER,
      autoBootDefault: false,
      timeoutRetries: false,
      lastMountId: lastMount && lastMount.id ? lastMount.id : null,
      hasPlanetOneRenderer: Boolean(
        global.DGBPlanetOneRenderTeam &&
          typeof global.DGBPlanetOneRenderTeam.renderPlanetOne === "function"
      )
    };
  }

  const api = Object.freeze({
    version: VERSION,
    VERSION,
    LEGACY_VERSION,
    ROUTE_OWNER,
    PLANET_ONE_RENDERER,
    renderGlobe,
    autoBoot,
    start,
    stop,
    getStatus
  });

  markDocument();

  global.DGBShowroomGlobeInstrument = api;

  if (typeof window !== "undefined") {
    window.DGBShowroomGlobeInstrument = api;
  }

  publish("showroom_globe_instrument_delegation_ready", {
    expectedGlobal: EXPECTED_GLOBAL,
    expectedApi: EXPECTED_API,
    demoPlanetStatus: "retired",
    renderer: PLANET_ONE_RENDERER,
    noLegacyAutoboot: true
  });
})(window);

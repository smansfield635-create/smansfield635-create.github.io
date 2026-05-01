/*
  SHOWROOM_GLOBE_INSTRUMENT_V20_HYDRATION_FIRST_DELEGATOR_TNT_v1
  TARGET=/assets/showroom.globe.instrument.js

  PRESERVED COMPATIBILITY MARKER:
  SHOWROOM_GLOBE_INSTRUMENT_PLANET_ONE_V16_TERRAIN_FIRST_OPTIMUM_PAIR_TNT_v1

  REQUIRED V19 EXPANSION MARKERS:
  /world/render/planet-one.hydration.render.js
  loadHydrationRenderer
  hydrationFirstLoadOrder
  hydroTerrainMarriage

  REQUIRED EXISTING MARKERS:
  window.DGBShowroomGlobeInstrument
  renderGlobe
  loadTerrainRenderer
  loadMainRendererAfterTerrain
  terrainFirstLoadOrder
  optimumExpressionOnly

  ROLE:
  Asset instrument is now a hydration-first delegator only.
  It loads hydration, then terrain, then main renderer.
  It does not draw its own planet.
  It does not draw fallback terrain.
  It does not draw a demo globe.
*/

(function attachShowroomGlobeInstrument(global) {
  "use strict";

  const VERSION = "SHOWROOM_GLOBE_INSTRUMENT_V20_HYDRATION_FIRST_DELEGATOR_TNT_v1";
  const PREVIOUS_V16 = "SHOWROOM_GLOBE_INSTRUMENT_PLANET_ONE_V16_TERRAIN_FIRST_OPTIMUM_PAIR_TNT_v1";

  const HYDRATION_RENDERER = "/world/render/planet-one.hydration.render.js";
  const TERRAIN_RENDERER = "/world/render/planet-one.terrain.render.js";
  const MAIN_RENDERER = "/world/render/planet-one.render.js";
  const AUTHORITY = "/assets/showroom.globe.instrument.js";

  const CONTRACT = Object.freeze({
    version: VERSION,
    previousV16: PREVIOUS_V16,
    authority: AUTHORITY,

    hydrationRenderer: HYDRATION_RENDERER,
    terrainRenderer: TERRAIN_RENDERER,
    mainRenderer: MAIN_RENDERER,

    hydrationFirstLoadOrder: true,
    terrainFirstLoadOrder: true,
    hydroTerrainMarriage: true,
    optimumExpressionOnly: true,

    loadHydrationRenderer: true,
    loadTerrainRenderer: true,
    loadMainRendererAfterTerrain: true,

    noCompetingGlobeSurface: true,
    drawsOwnPlanet: false,
    noOwnPlanetDrawing: true,
    noDemoPlanet: true,
    noFallbackPlanet: true,
    noFallbackTerrainExpression: true,
    delegationOnly: true
  });

  let currentHandle = null;
  const loadedScripts = new Map();

  function markDocument(state) {
    const root = document.documentElement;

    root.dataset.showroomGlobeInstrument = VERSION;
    root.dataset.showroomGlobeInstrumentPrevious = PREVIOUS_V16;
    root.dataset.showroomGlobeInstrumentAuthority = AUTHORITY;

    root.dataset.hydrationRenderer = HYDRATION_RENDERER;
    root.dataset.terrainRenderer = TERRAIN_RENDERER;
    root.dataset.mainRenderer = MAIN_RENDERER;

    root.dataset.hydrationFirstLoadOrder = "true";
    root.dataset.terrainFirstLoadOrder = "true";
    root.dataset.hydroTerrainMarriage = "true";
    root.dataset.optimumExpressionOnly = "true";

    root.dataset.noCompetingGlobeSurface = "true";
    root.dataset.drawsOwnPlanet = "false";
    root.dataset.noOwnPlanetDrawing = "true";
    root.dataset.noDemoPlanet = "true";
    root.dataset.noFallbackPlanet = "true";
    root.dataset.noFallbackTerrainExpression = "true";

    if (state) root.dataset.showroomGlobeInstrumentState = state;
  }

  function cacheKey(src) {
    return String(src || "").split("?")[0];
  }

  function hasScript(src) {
    const key = cacheKey(src);
    return Array.from(document.scripts).some(function find(script) {
      return cacheKey(script.getAttribute("src") || "") === key;
    });
  }

  function loadScript(src, globalCheck, label) {
    if (typeof globalCheck === "function" && globalCheck()) {
      return Promise.resolve({
        ok: true,
        src,
        label,
        alreadyAvailable: true
      });
    }

    if (loadedScripts.has(src)) {
      return loadedScripts.get(src).then(function done(result) {
        if (typeof globalCheck === "function" && globalCheck()) return result;

        throw new Error(label + " loaded but expected global is unavailable.");
      });
    }

    const promise = new Promise(function load(resolve, reject) {
      const existing = hasScript(src);

      if (existing && typeof globalCheck === "function" && globalCheck()) {
        resolve({
          ok: true,
          src,
          label,
          alreadyPresent: true
        });
        return;
      }

      const script = existing
        ? Array.from(document.scripts).find(function find(existingScript) {
            return cacheKey(existingScript.getAttribute("src") || "") === cacheKey(src);
          })
        : document.createElement("script");

      let settled = false;

      function finish() {
        if (settled) return;
        settled = true;

        if (typeof globalCheck === "function" && !globalCheck()) {
          reject(new Error(label + " script served, but expected API is missing."));
          return;
        }

        resolve({
          ok: true,
          src,
          label
        });
      }

      function fail() {
        if (settled) return;
        settled = true;
        reject(new Error(label + " failed to load at " + src));
      }

      script.addEventListener("load", finish, { once: true });
      script.addEventListener("error", fail, { once: true });

      if (!existing) {
        script.src = src;
        script.defer = true;
        script.dataset.showroomGlobeInstrumentLoaded = VERSION;
        document.head.appendChild(script);
      }

      global.setTimeout(function timeoutCheck() {
        if (settled) return;
        if (typeof globalCheck === "function" && globalCheck()) finish();
      }, 120);
    });

    loadedScripts.set(src, promise);
    return promise;
  }

  function loadHydrationRenderer() {
    markDocument("loading-hydration");

    return loadScript(
      HYDRATION_RENDERER,
      function checkHydration() {
        return Boolean(
          global.DGBPlanetOneHydrationRender &&
            typeof global.DGBPlanetOneHydrationRender.createHydrationLayer === "function"
        );
      },
      "Planet 1 hydration renderer"
    );
  }

  function loadTerrainRenderer() {
    markDocument("loading-terrain");

    return loadScript(
      TERRAIN_RENDERER,
      function checkTerrain() {
        return Boolean(
          global.DGBPlanetOneTerrainRender &&
            typeof global.DGBPlanetOneTerrainRender.createTerrainLayer === "function"
        );
      },
      "Planet 1 terrain renderer"
    );
  }

  function loadMainRendererAfterTerrain() {
    markDocument("loading-main-renderer");

    return loadScript(
      MAIN_RENDERER,
      function checkMainRenderer() {
        return Boolean(
          global.DGBPlanetOneRenderTeam &&
            typeof global.DGBPlanetOneRenderTeam.renderPlanetOne === "function"
        );
      },
      "Planet 1 main renderer"
    );
  }

  function loadHydroTerrainChain() {
    return loadHydrationRenderer()
      .then(function afterHydration() {
        return loadTerrainRenderer();
      })
      .then(function afterTerrain() {
        return loadMainRendererAfterTerrain();
      });
  }

  function writeMountDiagnostic(mount, message) {
    if (!mount) return;

    mount.dataset.renderStatus = "diagnostic-hold";
    mount.dataset.showroomGlobeInstrument = VERSION;
    mount.dataset.hydrationFirstLoadOrder = "true";
    mount.dataset.hydroTerrainMarriage = "true";
    mount.dataset.noFallbackPlanet = "true";
    mount.dataset.noFallbackTerrainExpression = "true";

    mount.innerHTML = [
      '<section style="',
      "width:min(680px,100%);",
      "margin:0 auto;",
      "border:1px solid rgba(242,199,111,.42);",
      "border-radius:28px;",
      "padding:22px;",
      "background:rgba(242,199,111,.055);",
      "color:rgba(255,244,211,.92);",
      "font:800 15px/1.5 system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;",
      "text-align:center;",
      '">',
      "<strong>Planet 1 diagnostic hold.</strong><br>",
      String(message || "Hydration-first chain is not ready."),
      "<br><code>",
      HYDRATION_RENDERER,
      " → ",
      TERRAIN_RENDERER,
      " → ",
      MAIN_RENDERER,
      "</code>",
      "</section>"
    ].join("");
  }

  function stopExistingHandle() {
    if (currentHandle && typeof currentHandle.stop === "function") {
      currentHandle.stop();
    }

    if (currentHandle && typeof currentHandle.destroy === "function") {
      currentHandle.destroy();
    }

    currentHandle = null;
  }

  function renderGlobe(target, options) {
    const mount = typeof target === "string" ? document.querySelector(target) : target;
    const opts = options || {};

    if (!mount) {
      return Promise.reject(new Error("renderGlobe requires a mount element."));
    }

    markDocument("boot-started");

    mount.dataset.showroomGlobeInstrument = VERSION;
    mount.dataset.showroomGlobeInstrumentPrevious = PREVIOUS_V16;
    mount.dataset.assetAuthority = AUTHORITY;

    mount.dataset.hydrationRenderer = HYDRATION_RENDERER;
    mount.dataset.terrainRenderer = TERRAIN_RENDERER;
    mount.dataset.mainRenderer = MAIN_RENDERER;

    mount.dataset.hydrationFirstLoadOrder = "true";
    mount.dataset.terrainFirstLoadOrder = "true";
    mount.dataset.hydroTerrainMarriage = "true";
    mount.dataset.optimumExpressionOnly = "true";

    mount.dataset.noCompetingGlobeSurface = "true";
    mount.dataset.drawsOwnPlanet = "false";
    mount.dataset.noOwnPlanetDrawing = "true";
    mount.dataset.noFallbackPlanet = "true";
    mount.dataset.noFallbackTerrainExpression = "true";
    mount.dataset.renderStatus = "loading-hydration-first-chain";

    if (opts.stopExisting !== false) {
      stopExistingHandle();
    }

    return loadHydroTerrainChain()
      .then(function chainReady() {
        markDocument("chain-ready");

        if (
          !global.DGBPlanetOneRenderTeam ||
          typeof global.DGBPlanetOneRenderTeam.renderPlanetOne !== "function"
        ) {
          throw new Error("Main renderer API is unavailable after hydration-first boot.");
        }

        mount.dataset.renderStatus = "delegating-to-main-renderer";
        mount.dataset.hydrationModuleIntegrated = "true";
        mount.dataset.terrainModuleIntegrated = "true";
        mount.dataset.hydroTerrainMarriage = "true";

        const handle = global.DGBPlanetOneRenderTeam.renderPlanetOne(mount, {
          caption: opts.caption || "Planet 1 · Nine Summits Universe · Optimum expression",
          expression: "optimum",
          bootAuthority: AUTHORITY,
          hydrationRenderer: HYDRATION_RENDERER,
          terrainRenderer: TERRAIN_RENDERER,
          mainRenderer: MAIN_RENDERER,
          hydrationFirstLoadOrder: true,
          hydroTerrainMarriage: true
        });

        currentHandle = handle;

        mount.dataset.renderStatus = "mounted";
        mount.dataset.planetOneRenderLoaded = "true";
        mount.dataset.optimumExpressionOnly = "true";

        return {
          ok: true,
          version: VERSION,
          previousV16: PREVIOUS_V16,
          handle,
          mount,
          hydrationRenderer: HYDRATION_RENDERER,
          terrainRenderer: TERRAIN_RENDERER,
          mainRenderer: MAIN_RENDERER,
          hydrationFirstLoadOrder: true,
          terrainFirstLoadOrder: true,
          hydroTerrainMarriage: true,
          optimumExpressionOnly: true,
          noFallbackPlanet: true,
          noOwnPlanetDrawing: true
        };
      })
      .catch(function failed(error) {
        const message = error && error.message ? error.message : "unknown hydration-first boot failure";

        markDocument("diagnostic-hold");
        writeMountDiagnostic(mount, message);

        return {
          ok: false,
          version: VERSION,
          error: message,
          diagnosticHold: true,
          hydrationFirstLoadOrder: true,
          hydroTerrainMarriage: true,
          noFallbackPlanet: true,
          noOwnPlanetDrawing: true
        };
      });
  }

  function start() {
    if (currentHandle && typeof currentHandle.start === "function") {
      return currentHandle.start();
    }

    if (currentHandle && typeof currentHandle.resume === "function") {
      return currentHandle.resume();
    }

    return false;
  }

  function stop() {
    if (currentHandle && typeof currentHandle.stop === "function") {
      return currentHandle.stop();
    }

    if (currentHandle && typeof currentHandle.pause === "function") {
      return currentHandle.pause();
    }

    return false;
  }

  function destroy() {
    if (currentHandle && typeof currentHandle.destroy === "function") {
      currentHandle.destroy();
    }

    currentHandle = null;
    return true;
  }

  function autoBoot() {
    const mount =
      document.getElementById("planet-one-render") ||
      document.getElementById("demo-planet-mount");

    if (!mount) return Promise.resolve(null);

    if (mount.dataset.renderStatus === "mounted" && mount.dataset.showroomGlobeInstrument === VERSION) {
      return Promise.resolve({
        ok: true,
        alreadyMounted: true,
        version: VERSION
      });
    }

    return renderGlobe(mount, {
      context: "auto",
      caption: "Planet 1 · Nine Summits Universe · Optimum expression",
      stopExisting: true
    });
  }

  function getStatus() {
    return {
      version: VERSION,
      previousV16: PREVIOUS_V16,
      authority: AUTHORITY,
      hydrationRenderer: HYDRATION_RENDERER,
      terrainRenderer: TERRAIN_RENDERER,
      mainRenderer: MAIN_RENDERER,
      hydrationFirstLoadOrder: true,
      terrainFirstLoadOrder: true,
      hydroTerrainMarriage: true,
      optimumExpressionOnly: true,
      loadHydrationRenderer: true,
      loadTerrainRenderer: true,
      loadMainRendererAfterTerrain: true,
      noCompetingGlobeSurface: true,
      drawsOwnPlanet: false,
      noOwnPlanetDrawing: true,
      noDemoPlanet: true,
      noFallbackPlanet: true,
      noFallbackTerrainExpression: true,
      delegationOnly: true,
      hasHydration: Boolean(global.DGBPlanetOneHydrationRender),
      hasTerrain: Boolean(global.DGBPlanetOneTerrainRender),
      hasMainRenderer: Boolean(global.DGBPlanetOneRenderTeam),
      currentHandle: Boolean(currentHandle)
    };
  }

  const api = Object.freeze({
    VERSION,
    PREVIOUS_V16,
    AUTHORITY,
    HYDRATION_RENDERER,
    TERRAIN_RENDERER,
    MAIN_RENDERER,
    CONTRACT,
    renderGlobe,
    autoBoot,
    loadHydrationRenderer,
    loadTerrainRenderer,
    loadMainRendererAfterTerrain,
    loadHydroTerrainChain,
    start,
    stop,
    destroy,
    getStatus
  });

  global.DGBShowroomGlobeInstrument = api;

  if (typeof window !== "undefined") {
    window.DGBShowroomGlobeInstrument = api;
  }

  markDocument("ready");

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoBoot, { once: true });
  } else {
    autoBoot();
  }
})(window);

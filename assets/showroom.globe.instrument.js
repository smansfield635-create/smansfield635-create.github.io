/* G1 PLANET 1 RUNTIME ASSET BRIDGE CHAIN REPAIR
   FILE: /assets/showroom.globe.instrument.js
   VERSION: G1_PLANET_1_RUNTIME_ASSET_BRIDGE_CHAIN_REPAIR_TNT_v1

   PURPOSE:
   - Bridge Showroom route to the active Planet 1 renderer.
   - Do not own terrain.
   - Do not create a duplicate fake globe.
   - Normalize renderer call shape.
   - Force public satellite mode unless debug is explicitly requested.
   - Repaint after renderer/hexgrid readiness.
   - Preserve visual HOLD.
*/

(function attachShowroomGlobeInstrument(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_RUNTIME_ASSET_BRIDGE_CHAIN_REPAIR_TNT_v1";
  var RENDER_PAIR = "G1_PLANET_1_TERRAIN_DEPTH_NORMAL_RELIEF_TRANSLATION_PAIR_TNT_v1";
  var DEFAULT_MOUNT_SELECTOR = "[data-planet-one-mount='true'],#planet-one-render,.planet-one-render";

  var state = {
    version: VERSION,
    mounted: false,
    started: false,
    mountSelector: DEFAULT_MOUNT_SELECTOR,
    mountElement: null,
    lastRender: null,
    lastRendererStatus: null,
    lastHexgridStatus: null,
    lastOptions: null,
    renderCount: 0,
    rendererDetected: false,
    hexgridDetected: false,
    rendererResultMounted: false,
    rendererConsumesHexgrid: false,
    publicHoneycombBlocked: true,
    publicSampleDotsSuppressed: true,
    noDuplicateFakeGlobe: true,
    noTerrainOwnership: true,
    visualPassClaimed: false,
    lastError: null
  };

  function now() {
    return new Date().toISOString();
  }

  function safeJson(value) {
    try {
      return JSON.stringify(value, null, 2);
    } catch (error) {
      return String(value);
    }
  }

  function writeReceipt(id, value) {
    var el = global.document && global.document.getElementById(id);
    if (el) el.textContent = safeJson(value);
  }

  function resolveMount(target) {
    if (target && target.nodeType === 1) return target;

    if (typeof target === "string" && global.document) {
      return global.document.querySelector(target);
    }

    if (!global.document) return null;

    return global.document.querySelector(DEFAULT_MOUNT_SELECTOR);
  }

  function getRenderer() {
    return global.DGBPlanetOneRenderTeam ||
      global.DGBPlanetOneRenderer ||
      global.DGBPlanetOneRender ||
      null;
  }

  function getHexgrid() {
    return global.DGBPlanetOneHexgridRender || null;
  }

  function getRendererStatus(renderer) {
    if (!renderer) return null;

    try {
      if (typeof renderer.getStatus === "function") return renderer.getStatus();
      if (typeof renderer.status === "function") return renderer.status();
    } catch (error) {
      state.lastError = String(error && error.message ? error.message : error);
    }

    return null;
  }

  function getHexgridStatus(hexgrid) {
    if (!hexgrid) return null;

    try {
      if (typeof hexgrid.getHexgridStatus === "function") return hexgrid.getHexgridStatus();
      if (typeof hexgrid.status === "function") return hexgrid.status();
    } catch (error) {
      state.lastError = String(error && error.message ? error.message : error);
    }

    return null;
  }

  function normalizeOptions(options) {
    options = options || {};

    return {
      renderMode: options.renderMode === "cell-debug" ? "cell-debug" : "satellite",
      viewLon: Number(options.viewLon == null ? -28 : options.viewLon),
      viewLat: Number(options.viewLat == null ? 0 : options.viewLat),
      showAxis: options.showAxis === true,
      compositorScale: Number(options.compositorScale || 0.64),
      surfaceAlpha: Number(options.surfaceAlpha == null ? 0.94 : options.surfaceAlpha),
      clearMount: options.clearMount === true,
      width: options.width,
      height: options.height,
      seed: Number(options.seed || 256451),
      source: "showroom-globe-instrument",
      version: VERSION,
      visualPassClaimed: false
    };
  }

  function callRenderer(renderer, mount, options) {
    var methods = [
      "renderPlanetOne",
      "mountPlanetOne",
      "renderGlobe",
      "createPlanetOneRender",
      "createPlanetOneScene",
      "mount",
      "render",
      "create"
    ];

    var i;
    var method;

    for (i = 0; i < methods.length; i += 1) {
      method = methods[i];

      if (typeof renderer[method] === "function") {
        return renderer[method](mount, options);
      }
    }

    throw new Error("NO_COMPATIBLE_RENDERER_METHOD");
  }

  function render(target, options) {
    var mount = resolveMount(target) || state.mountElement;
    var renderer = getRenderer();
    var hexgrid = getHexgrid();
    var normalized = normalizeOptions(options);

    if (!mount) {
      state.lastError = "NO_PLANET_MOUNT";
      return getStatus();
    }

    if (!renderer) {
      state.lastError = "NO_PLANET_RENDERER";
      return getStatus();
    }

    state.mountElement = mount;
    state.mountSelector = "#" + (mount.id || "planet-one-render");
    state.rendererDetected = true;
    state.hexgridDetected = Boolean(hexgrid);
    state.lastHexgridStatus = getHexgridStatus(hexgrid);
    state.lastOptions = normalized;

    try {
      state.lastRender = callRenderer(renderer, mount, normalized);
      state.renderCount += 1;
      state.lastRendererStatus = getRendererStatus(renderer);
      state.rendererResultMounted = Boolean(
        state.lastRender && (state.lastRender.mounted || state.lastRender.ok)
      );
      state.rendererConsumesHexgrid = Boolean(
        state.lastRendererStatus && state.lastRendererStatus.rendererConsumesHexgrid
      ) || Boolean(
        state.lastRender && state.lastRender.rendererConsumesHexgrid
      );
      state.publicHoneycombBlocked = normalized.renderMode !== "cell-debug";
      state.publicSampleDotsSuppressed = normalized.renderMode !== "cell-debug";
      state.mounted = true;
      state.lastError = null;
    } catch (error) {
      state.lastError = String(error && error.message ? error.message : error);
    }

    writeReceipt("planet-one-bridge-receipt", getStatus());

    try {
      global.dispatchEvent(new CustomEvent("dgb:showroom-globe:instrument-render", {
        detail: getStatus()
      }));
    } catch (error2) {}

    return getStatus();
  }

  function waitForChain(callback, timeoutMs) {
    var started = Date.now();
    var timeout = Number(timeoutMs || 2400);

    function tick() {
      var renderer = getRenderer();
      var hexgrid = getHexgrid();

      if (renderer && hexgrid) {
        callback(true);
        return;
      }

      if (Date.now() - started > timeout) {
        callback(false);
        return;
      }

      global.setTimeout(tick, 45);
    }

    tick();
  }

  function start(target, options) {
    var mount = resolveMount(target);
    state.started = true;

    render(mount, options);

    waitForChain(function () {
      render(mount, options);
    }, 2400);

    global.addEventListener("dgb:planet-one:hexgrid-ready", function () {
      render(mount, options);
    });

    global.addEventListener("dgb:planet-one:renderer-ready", function () {
      render(mount, options);
    });

    return getStatus();
  }

  function getStatus() {
    var renderer = getRenderer();
    var hexgrid = getHexgrid();

    state.rendererDetected = Boolean(renderer);
    state.hexgridDetected = Boolean(hexgrid);
    state.lastRendererStatus = getRendererStatus(renderer);
    state.lastHexgridStatus = getHexgridStatus(hexgrid);

    return {
      version: VERSION,
      renderPair: RENDER_PAIR,
      mounted: state.mounted,
      started: state.started,
      mountSelector: state.mountSelector,
      rendererDetected: state.rendererDetected,
      hexgridDetected: state.hexgridDetected,
      assetCalledRenderer: state.renderCount > 0,
      rendererResultMounted: state.rendererResultMounted,
      mountComplete: Boolean(state.mounted && state.mountElement),
      assetModuleAwareConsumption: true,
      noDuplicateFakeGlobe: true,
      noTerrainOwnership: true,
      rendererConsumesHexgrid: Boolean(
        state.rendererConsumesHexgrid ||
        (state.lastRendererStatus && state.lastRendererStatus.rendererConsumesHexgrid)
      ),
      publicHoneycombBlocked: state.publicHoneycombBlocked,
      publicSampleDotsSuppressed: state.publicSampleDotsSuppressed,
      publicMode: state.lastOptions ? state.lastOptions.renderMode : "satellite",
      renderCount: state.renderCount,
      lastOptions: state.lastOptions,
      renderer: state.lastRendererStatus,
      hexgrid: state.lastHexgridStatus,
      lastError: state.lastError,
      visualPassClaimed: false,
      timestamp: now()
    };
  }

  function status() {
    return getStatus();
  }

  var api = {
    VERSION: VERSION,
    version: VERSION,
    renderPair: RENDER_PAIR,
    start: start,
    render: render,
    mount: render,
    getStatus: getStatus,
    status: status
  };

  global.DGBShowroomGlobeInstrument = api;

  try {
    global.dispatchEvent(new CustomEvent("dgb:showroom-globe:instrument-ready", {
      detail: getStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);

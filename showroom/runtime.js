/* G1 PLANET 1 SHOWROOM RUNTIME BRIDGE FRAME BUDGET
   FILE: /showroom/runtime.js
   VERSION: G1_PLANET_1_SHOWROOM_RUNTIME_FRAME_BUDGET_BRIDGE_TNT_v1

   LAW:
   Showroom runtime is a bridge only.
   It must not create an independent planet physics loop.
   It delegates motion timing to /world/runtime.js.
   It does not own terrain, hydration, hexgrid, renderer, water, land, air, or visual pass.
*/

(function attachShowroomRuntimeFrameBudgetBridge(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_SHOWROOM_RUNTIME_FRAME_BUDGET_BRIDGE_TNT_v1";
  var WORLD_RUNTIME_VERSION = "G1_PLANET_1_RUNTIME_FRAME_BUDGET_AND_RENDER_THROTTLE_TNT_v1";
  var BASELINE = "PLANET_1_GENERATION_1_CLEAN_SLATE_LOCK_IN_v1";

  var state = {
    active: true,
    booted: false,
    mountSelector: "#planet-one-render",
    delegatedToWorldRuntime: false,
    fallbackSingleRenderUsed: false,
    bootCount: 0,
    commandCount: 0,
    lastCommand: null,
    lastError: null,
    lastReceipt: null
  };

  function getWorldRuntime() {
    return global.DGBWorldRuntime || global.DGBPlanetOneRuntime || null;
  }

  function getRenderer() {
    return global.DGBPlanetOneRenderTeam ||
      global.DGBPlanetOneRenderer ||
      global.DGBPlanetOneRender ||
      null;
  }

  function getRenderFunction(renderer) {
    if (!renderer) return null;

    return renderer.renderPlanetOne ||
      renderer.mountPlanetOne ||
      renderer.mount ||
      renderer.render ||
      renderer.renderGlobe ||
      renderer.createPlanetOneRender ||
      renderer.createPlanetOneScene ||
      renderer.create ||
      null;
  }

  function getMount() {
    if (!global.document) return null;

    return global.document.querySelector(state.mountSelector) ||
      global.document.getElementById("planet-one-render") ||
      global.document.querySelector("[data-planet-one-mount='true']");
  }

  function makeReceipt(extra) {
    var runtime = getWorldRuntime();
    var renderer = getRenderer();
    var runtimeStatus = runtime && runtime.status ? runtime.status() :
      runtime && runtime.getStatus ? runtime.getStatus() :
      null;

    var rendererStatus = renderer && renderer.status ? renderer.status() :
      renderer && renderer.getStatus ? renderer.getStatus() :
      null;

    state.lastReceipt = {
      showroomRuntimeVersion: VERSION,
      worldRuntimeExpectedVersion: WORLD_RUNTIME_VERSION,
      baseline: BASELINE,
      timestamp: new Date().toISOString(),

      showroomRuntimeBridgeActive: true,
      delegatedToWorldRuntime: state.delegatedToWorldRuntime,
      noIndependentPlanetPhysics: true,
      noIndependentRenderLoop: true,
      duplicateLoopBlocked: true,
      runtimeOwnsTimingOnly: true,
      showroomDoesNotOwnTerrain: true,
      showroomDoesNotOwnTriDomainModel: true,
      visualPassClaimed: false,

      booted: state.booted,
      bootCount: state.bootCount,
      commandCount: state.commandCount,
      lastCommand: state.lastCommand,
      mountDetected: Boolean(getMount()),
      worldRuntimeDetected: Boolean(runtime),
      rendererDetected: Boolean(renderer),
      runtimeStatus: runtimeStatus,
      rendererStatus: rendererStatus,
      lastError: state.lastError,
      extra: extra || null
    };

    global.DGBShowroomRuntimeFrameBudgetReceipt = state.lastReceipt;
    return state.lastReceipt;
  }

  function fallbackSingleRender(reason) {
    var renderer = getRenderer();
    var renderFn = getRenderFunction(renderer);
    var mount = getMount();
    var result = null;

    if (!renderer || typeof renderFn !== "function" || !mount) {
      state.lastError = "FALLBACK_RENDER_UNAVAILABLE";
      return makeReceipt({ reason: reason, fallbackAttempted: true, fallbackRendered: false });
    }

    try {
      result = renderFn.call(renderer, mount, {
        renderMode: "satellite",
        viewLon: -28,
        viewLat: 0,
        showAxis: false,
        compositorScale: 0.72,
        surfaceAlpha: 0.99,
        clearMount: false,
        seed: 256451,
        source: "showroom-runtime-single-render-fallback",
        version: VERSION,
        visualPassClaimed: false
      });

      state.fallbackSingleRenderUsed = true;
      state.lastError = null;

      return makeReceipt({
        reason: reason,
        fallbackAttempted: true,
        fallbackRendered: true,
        renderResult: result
      });
    } catch (error) {
      state.lastError = String(error && error.message ? error.message : error);
      return makeReceipt({ reason: reason, fallbackAttempted: true, fallbackRendered: false });
    }
  }

  function boot() {
    var runtime = getWorldRuntime();

    state.booted = true;
    state.bootCount += 1;

    if (runtime && typeof runtime.start === "function") {
      state.delegatedToWorldRuntime = true;
      runtime.start(state.mountSelector, {
        source: "showroom-runtime-frame-budget-bridge",
        viewLon: -28,
        viewLat: 0,
        speedDegreesPerSecond: 2.4,
        showAxis: false,
        seed: 256451
      });
      return makeReceipt({ bootDelegated: true });
    }

    state.delegatedToWorldRuntime = false;
    return fallbackSingleRender("NO_WORLD_RUNTIME_AT_BOOT");
  }

  function delegate(command, value) {
    var runtime = getWorldRuntime();
    var result = null;

    state.commandCount += 1;
    state.lastCommand = command;

    if (!runtime) {
      state.lastError = "NO_WORLD_RUNTIME_FOR_COMMAND:" + command;
      return makeReceipt({ command: command, delegated: false });
    }

    try {
      if (command === "start" && typeof runtime.start === "function") {
        result = runtime.start(state.mountSelector, { source: "showroom-runtime-command-start" });
      } else if (command === "pause" && typeof runtime.pause === "function") {
        result = runtime.pause();
      } else if (command === "resume" && typeof runtime.resume === "function") {
        result = runtime.resume();
      } else if (command === "reset" && typeof runtime.reset === "function") {
        result = runtime.reset();
      } else if (command === "reverse" && typeof runtime.reverse === "function") {
        result = runtime.reverse();
      } else if (command === "setSpeed" && typeof runtime.setSpeed === "function") {
        result = runtime.setSpeed(value);
      } else if (command === "slow" && typeof runtime.setSpeed === "function") {
        result = runtime.setSpeed(0.8);
      } else if (command === "normal" && typeof runtime.setSpeed === "function") {
        result = runtime.setSpeed(2.4);
      } else if (command === "fast" && typeof runtime.setSpeed === "function") {
        result = runtime.setSpeed(6.0);
      } else if (command === "setView" && typeof runtime.setView === "function") {
        result = runtime.setView(value || {});
      } else {
        state.lastError = "UNSUPPORTED_RUNTIME_COMMAND:" + command;
        return makeReceipt({ command: command, delegated: false });
      }

      state.delegatedToWorldRuntime = true;
      state.lastError = null;
      return makeReceipt({ command: command, delegated: true, result: result });
    } catch (error) {
      state.lastError = String(error && error.message ? error.message : error);
      return makeReceipt({ command: command, delegated: false });
    }
  }

  function start() { return delegate("start"); }
  function pause() { return delegate("pause"); }
  function resume() { return delegate("resume"); }
  function reset() { return delegate("reset"); }
  function reverse() { return delegate("reverse"); }
  function setSpeed(value) { return delegate("setSpeed", value); }
  function setView(value) { return delegate("setView", value); }

  function getStatus() {
    return makeReceipt({ statusRead: true });
  }

  function status() {
    return getStatus();
  }

  var api = {
    VERSION: VERSION,
    version: VERSION,
    WORLD_RUNTIME_VERSION: WORLD_RUNTIME_VERSION,
    worldRuntimeVersion: WORLD_RUNTIME_VERSION,
    BASELINE: BASELINE,
    baseline: BASELINE,

    boot: boot,
    start: start,
    pause: pause,
    resume: resume,
    reset: reset,
    reverse: reverse,
    setSpeed: setSpeed,
    setView: setView,

    getStatus: getStatus,
    status: status,
    getReceipt: getStatus
  };

  global.DGBShowroomGlobeRuntime = api;
  global.DGBPlanetOneRuntimeBridge = api;

  function bootWhenReady() {
    global.setTimeout(function () {
      boot();
    }, 40);
  }

  if (global.document && global.document.readyState === "loading") {
    global.document.addEventListener("DOMContentLoaded", bootWhenReady);
  } else {
    bootWhenReady();
  }

  try {
    global.dispatchEvent(new CustomEvent("dgb:showroom-runtime-frame-budget-bridge-ready", {
      detail: getStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);

/* SHOWROOM RUNTIME GLOBE BRIDGE
   FILE: /showroom/runtime.js
   VERSION: SHOWROOM_GLOBE_RUNTIME_BRIDGE_TNT_v1

   PURPOSE:
   - Boot the Showroom route into the existing Planet 1 renderer/runtime/control system.
   - Use /assets/showroom.globe.instrument.js as the adapter.
   - Do not own independent planet physics or terrain.
   - Do not create a second fake globe.
   - Keep visual pass on HOLD.
*/

(function attachShowroomRuntime(global) {
  "use strict";

  var VERSION = "SHOWROOM_GLOBE_RUNTIME_BRIDGE_TNT_v1";

  var CONTRACT_MARKERS = [
    VERSION,
    "SHOWROOM_RUNTIME_ACTIVE",
    "SHOWROOM_GLOBE_BOOT_ACTIVE",
    "SHOWROOM_USES_PLANET_ONE_RUNTIME",
    "SHOWROOM_USES_PLANET_ONE_RENDERER",
    "NO_INDEPENDENT_PLANET_PHYSICS",
    "NO_DUPLICATE_FAKE_GLOBE",
    "VISUAL_PASS_NOT_CLAIMED"
  ];

  var state = {
    active: true,
    booted: false,
    bootAttempted: false,
    mountNode: null,
    controlNode: null,
    statusNode: null,
    lastBoot: null,
    lastError: null,
    visualPassClaimed: false
  };

  function now() {
    return new Date().toISOString();
  }

  function safeCall(fn, fallback) {
    try {
      return fn();
    } catch (error) {
      state.lastError = String(error && error.message ? error.message : error);
      return fallback;
    }
  }

  function getInstrument() {
    return global.DGBShowroomGlobeInstrument ||
      global.DGBShowroomGlobe ||
      null;
  }

  function resolveNode(selectors) {
    var i;
    var node;

    if (!global.document) return null;

    for (i = 0; i < selectors.length; i += 1) {
      node = global.document.querySelector(selectors[i]);
      if (node) return node;
    }

    return null;
  }

  function resolveMount() {
    var node = resolveNode([
      "#planet-one-render",
      "#showroom-globe-render",
      "[data-planet-one-mount='true']",
      "[data-showroom-globe-mount='true']",
      ".planet-one-render",
      ".showroom-globe-render"
    ]);

    if (node) return node;

    if (!global.document) return null;

    node = global.document.createElement("div");
    node.id = "planet-one-render";
    node.setAttribute("data-planet-one-mount", "true");
    node.setAttribute("data-showroom-globe-mount", "true");

    (global.document.body || global.document.documentElement).appendChild(node);
    return node;
  }

  function resolveControl() {
    return resolveNode([
      "#planet-one-controls",
      "#showroom-globe-controls",
      "[data-planet-one-controls='true']",
      "[data-showroom-globe-controls='true']"
    ]);
  }

  function resolveStatus() {
    return resolveNode([
      "#showroom-globe-status",
      "#planet-one-status",
      "[data-showroom-globe-status='true']",
      "[data-planet-one-status='true']"
    ]);
  }

  function writeStatus() {
    var instrument = getInstrument();
    var instrumentStatus = instrument && typeof instrument.getStatus === "function"
      ? safeCall(function () { return instrument.getStatus(); }, null)
      : null;

    if (state.statusNode && "textContent" in state.statusNode) {
      state.statusNode.textContent = JSON.stringify({
        showroomRuntimeVersion: VERSION,
        showroomRuntimeActive: true,
        booted: state.booted,
        instrumentDetected: Boolean(instrument),
        showroomUsesPlanetOneRuntime: Boolean(instrumentStatus && instrumentStatus.planetOneRuntimeDetected),
        showroomUsesPlanetOneRenderer: Boolean(instrumentStatus && instrumentStatus.planetOneRendererDetected),
        noDuplicateFakeGlobe: true,
        noIndependentPlanetPhysics: true,
        instrument: instrumentStatus ? {
          mounted: instrumentStatus.mounted,
          started: instrumentStatus.started,
          runtime: instrumentStatus.runtimeSummary,
          renderer: instrumentStatus.rendererSummary
        } : null,
        visualPassClaimed: false
      }, null, 2);
    }

    return getStatus();
  }

  function boot(options) {
    var instrument;

    options = options || {};
    state.bootAttempted = true;

    state.mountNode = resolveMount();
    state.controlNode = resolveControl();
    state.statusNode = resolveStatus();

    if (state.mountNode && state.mountNode.setAttribute) {
      state.mountNode.setAttribute("data-planet-one-mount", "true");
      state.mountNode.setAttribute("data-showroom-globe-mount", "true");
      state.mountNode.setAttribute("data-showroom-runtime", VERSION);
    }

    instrument = getInstrument();

    if (!instrument) {
      state.lastError = "SHOWROOM_GLOBE_INSTRUMENT_NOT_AVAILABLE";
      writeStatus();
      return getStatus();
    }

    if (typeof instrument.mount === "function") {
      safeCall(function () {
        instrument.mount(state.mountNode, {
          controlTarget: state.controlNode,
          statusTarget: state.statusNode,
          viewLon: options.viewLon == null ? -28 : options.viewLon,
          viewLat: options.viewLat == null ? 0 : options.viewLat,
          axisTilt: options.axisTilt == null ? -0.28 : options.axisTilt,
          showAxis: options.showAxis == null ? true : Boolean(options.showAxis),
          speedDegreesPerSecond: options.speedDegreesPerSecond == null ? 2.4 : Number(options.speedDegreesPerSecond)
        });
      }, null);
    }

    if (typeof instrument.start === "function") {
      safeCall(function () {
        instrument.start(state.mountNode, {
          controlTarget: state.controlNode,
          statusTarget: state.statusNode,
          viewLon: options.viewLon == null ? -28 : options.viewLon,
          viewLat: options.viewLat == null ? 0 : options.viewLat,
          axisTilt: options.axisTilt == null ? -0.28 : options.axisTilt,
          showAxis: options.showAxis == null ? true : Boolean(options.showAxis),
          speedDegreesPerSecond: options.speedDegreesPerSecond == null ? 2.4 : Number(options.speedDegreesPerSecond)
        });
      }, null);
    }

    state.booted = true;
    state.lastBoot = {
      at: now(),
      mountDetected: Boolean(state.mountNode),
      controlDetected: Boolean(state.controlNode),
      statusDetected: Boolean(state.statusNode),
      instrumentDetected: Boolean(instrument)
    };

    writeStatus();

    try {
      if (global.dispatchEvent && typeof global.CustomEvent === "function") {
        global.dispatchEvent(new global.CustomEvent("dgb:showroom-runtime-booted", {
          detail: getStatus()
        }));
      }
    } catch (error) {
      state.lastError = String(error && error.message ? error.message : error);
    }

    return getStatus();
  }

  function refreshStatus() {
    return writeStatus();
  }

  function getStatus() {
    var instrument = getInstrument();
    var instrumentStatus = instrument && typeof instrument.getStatus === "function"
      ? safeCall(function () { return instrument.getStatus(); }, null)
      : null;

    return {
      ok: true,
      active: true,
      VERSION: VERSION,
      version: VERSION,
      CONTRACT_MARKERS: CONTRACT_MARKERS.slice(),

      showroomRuntimeActive: true,
      showroomGlobeBootActive: true,
      showroomUsesPlanetOneRuntime: Boolean(instrumentStatus && instrumentStatus.planetOneRuntimeDetected),
      showroomUsesPlanetOneRenderer: Boolean(instrumentStatus && instrumentStatus.planetOneRendererDetected),
      noIndependentPlanetPhysics: true,
      noDuplicateFakeGlobe: true,

      bootAttempted: state.bootAttempted,
      booted: state.booted,
      mountDetected: Boolean(state.mountNode),
      controlDetected: Boolean(state.controlNode),
      statusDetected: Boolean(state.statusNode),
      instrumentDetected: Boolean(instrument),

      lastBoot: state.lastBoot,
      lastError: state.lastError,
      statusAt: now(),
      visualPassClaimed: false
    };
  }

  function status() {
    return getStatus();
  }

  var api = {
    VERSION: VERSION,
    version: VERSION,
    CONTRACT_MARKERS: CONTRACT_MARKERS,
    boot: boot,
    refreshStatus: refreshStatus,
    getStatus: getStatus,
    status: status
  };

  global.DGBShowroomRuntime = api;

  try {
    if (global.dispatchEvent && typeof global.CustomEvent === "function") {
      global.dispatchEvent(new global.CustomEvent("dgb:showroom-runtime-ready", {
        detail: getStatus()
      }));
    }
  } catch (error) {
    state.lastError = String(error && error.message ? error.message : error);
  }

  if (global.document && global.document.readyState === "loading") {
    global.document.addEventListener("DOMContentLoaded", function () {
      boot();
    }, { once: true });
  } else {
    boot();
  }
})(typeof window !== "undefined" ? window : globalThis);

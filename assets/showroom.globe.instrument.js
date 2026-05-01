/* SHOWROOM GLOBE ASSET RUNTIME BRIDGE
   FILE: /assets/showroom.globe.instrument.js
   VERSION: SHOWROOM_GLOBE_ASSET_RUNTIME_BRIDGE_TNT_v1

   PURPOSE:
   - Bridge the public Showroom globe lane to the existing Planet 1 renderer/runtime.
   - Do not create a duplicate globe.
   - Do not own terrain, surface fields, land, shelf, axis physics, or animation loop.
   - Expose a stable Showroom-safe API for mount/start/pause/resume/reset/status.
   - Keep visual pass on HOLD.
*/

(function attachShowroomGlobeInstrument(global) {
  "use strict";

  var VERSION = "SHOWROOM_GLOBE_ASSET_RUNTIME_BRIDGE_TNT_v1";

  var CONTRACT_MARKERS = [
    VERSION,
    "SHOWROOM_GLOBE_INSTRUMENT_ACTIVE",
    "PLANET_ONE_RUNTIME_BRIDGE_ACTIVE",
    "PLANET_ONE_RENDERER_BRIDGE_ACTIVE",
    "NO_DUPLICATE_FAKE_GLOBE",
    "NO_TERRAIN_OWNERSHIP",
    "NO_GRAPHICBOX",
    "VISUAL_PASS_NOT_CLAIMED"
  ];

  var state = {
    active: true,
    mounted: false,
    started: false,
    mountNode: null,
    controlNode: null,
    statusNode: null,
    lastAction: null,
    lastStatusWrite: null,
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

  function getRenderer() {
    return global.DGBPlanetOneRender ||
      global.DGBPlanetOneRenderer ||
      global.DGBPlanetOneRenderTeam ||
      null;
  }

  function getRuntime() {
    return global.DGBPlanetOneRuntime ||
      global.DGBWorldRuntime ||
      null;
  }

  function getControl() {
    return global.DGBPlanetOneControl ||
      global.DGBWorldControl ||
      null;
  }

  function resolveElement(target, fallbackSelectors) {
    var i;
    var node;

    if (target && typeof target !== "string") return target;
    if (!global.document) return null;

    if (typeof target === "string") {
      node = global.document.querySelector(target);
      if (node) return node;
    }

    for (i = 0; i < fallbackSelectors.length; i += 1) {
      node = global.document.querySelector(fallbackSelectors[i]);
      if (node) return node;
    }

    return null;
  }

  function resolveMount(target) {
    var node = resolveElement(target, [
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
    node.style.width = "100%";
    node.style.maxWidth = "760px";
    node.style.margin = "0 auto";

    (global.document.body || global.document.documentElement).appendChild(node);
    return node;
  }

  function resolveControl(target) {
    return resolveElement(target, [
      "#planet-one-controls",
      "#showroom-globe-controls",
      "[data-planet-one-controls='true']",
      "[data-showroom-globe-controls='true']",
      ".planet-one-controls",
      ".showroom-globe-controls"
    ]);
  }

  function resolveStatus(target) {
    return resolveElement(target, [
      "#showroom-globe-status",
      "#planet-one-status",
      "[data-showroom-globe-status='true']",
      "[data-planet-one-status='true']",
      ".showroom-globe-status",
      ".planet-one-status"
    ]);
  }

  function markMount(node) {
    if (!node || !node.setAttribute) return;

    node.setAttribute("data-planet-one-mount", "true");
    node.setAttribute("data-showroom-globe-mount", "true");
    node.setAttribute("data-showroom-globe-instrument", VERSION);
  }

  function writeStatus(statusNode) {
    var node = statusNode || state.statusNode;
    var status = getStatus();

    if (!node) return status;

    if ("textContent" in node) {
      node.textContent = JSON.stringify({
        version: VERSION,
        showroomGlobeInstrumentActive: true,
        planetOneRendererDetected: status.planetOneRendererDetected,
        planetOneRuntimeDetected: status.planetOneRuntimeDetected,
        planetOneControlDetected: status.planetOneControlDetected,
        mounted: status.mounted,
        started: status.started,
        runtime: status.runtimeSummary,
        renderer: status.rendererSummary,
        visualPassClaimed: false
      }, null, 2);
    }

    state.lastStatusWrite = now();
    return status;
  }

  function mount(target, options) {
    var renderer;
    var runtime;
    var control;
    var mountNode;
    var controlNode;
    var statusNode;
    var renderResult = null;

    options = options || {};

    mountNode = resolveMount(target || options.mount || options.target);
    controlNode = resolveControl(options.controlTarget);
    statusNode = resolveStatus(options.statusTarget);

    state.mountNode = mountNode;
    state.controlNode = controlNode;
    state.statusNode = statusNode;

    if (!mountNode) {
      state.lastError = "SHOWROOM_GLOBE_MOUNT_NOT_AVAILABLE";
      return getStatus();
    }

    markMount(mountNode);

    renderer = getRenderer();
    runtime = getRuntime();
    control = getControl();

    if (renderer && typeof renderer.renderPlanetOne === "function") {
      renderResult = safeCall(function () {
        return renderer.renderPlanetOne(mountNode, {
          renderMode: "satellite",
          viewLon: options.viewLon == null ? -28 : options.viewLon,
          viewLat: options.viewLat == null ? 0 : options.viewLat,
          axisTilt: options.axisTilt == null ? -0.28 : options.axisTilt,
          showAxis: options.showAxis == null ? true : Boolean(options.showAxis),
          clearMount: false
        });
      }, null);
    }

    if (runtime && typeof runtime.mount === "function") {
      safeCall(function () {
        runtime.mount(mountNode, {
          viewLon: options.viewLon == null ? -28 : options.viewLon,
          viewLat: options.viewLat == null ? 0 : options.viewLat,
          axisTilt: options.axisTilt == null ? -0.28 : options.axisTilt,
          axisVisible: options.showAxis == null ? true : Boolean(options.showAxis),
          speedDegreesPerSecond: options.speedDegreesPerSecond == null ? 2.4 : Number(options.speedDegreesPerSecond)
        });
      }, null);
    }

    if (control && controlNode && typeof control.mountPanel === "function") {
      safeCall(function () {
        control.mountPanel(controlNode);
      }, null);
    }

    state.mounted = true;
    state.lastAction = {
      name: "mount",
      at: now(),
      rendererDetected: Boolean(renderer),
      runtimeDetected: Boolean(runtime),
      controlDetected: Boolean(control),
      renderResult: renderResult
    };

    writeStatus(statusNode);

    return getStatus();
  }

  function start(target, options) {
    var runtime;

    options = options || {};

    if (!state.mounted || target) {
      mount(target, options);
    }

    runtime = getRuntime();

    if (runtime && typeof runtime.start === "function") {
      safeCall(function () {
        runtime.start(state.mountNode, {
          viewLon: options.viewLon == null ? undefined : options.viewLon,
          viewLat: options.viewLat == null ? undefined : options.viewLat,
          axisTilt: options.axisTilt == null ? undefined : options.axisTilt,
          axisVisible: options.showAxis == null ? undefined : Boolean(options.showAxis),
          speedDegreesPerSecond: options.speedDegreesPerSecond == null ? undefined : Number(options.speedDegreesPerSecond)
        });
      }, null);
    }

    state.started = true;
    state.lastAction = {
      name: "start",
      at: now()
    };

    writeStatus();
    return getStatus();
  }

  function pause() {
    var runtime = getRuntime();

    if (runtime && typeof runtime.pause === "function") {
      safeCall(function () {
        runtime.pause();
      }, null);
    }

    state.lastAction = {
      name: "pause",
      at: now()
    };

    writeStatus();
    return getStatus();
  }

  function resume() {
    var runtime = getRuntime();

    if (runtime && typeof runtime.resume === "function") {
      safeCall(function () {
        runtime.resume();
      }, null);
    }

    state.lastAction = {
      name: "resume",
      at: now()
    };

    writeStatus();
    return getStatus();
  }

  function reset() {
    var runtime = getRuntime();

    if (runtime && typeof runtime.reset === "function") {
      safeCall(function () {
        runtime.reset();
      }, null);
    }

    state.lastAction = {
      name: "reset",
      at: now()
    };

    writeStatus();
    return getStatus();
  }

  function setSpeed(value) {
    var runtime = getRuntime();

    if (runtime && typeof runtime.setSpeed === "function") {
      safeCall(function () {
        runtime.setSpeed(Number(value));
      }, null);
    }

    state.lastAction = {
      name: "setSpeed",
      value: Number(value),
      at: now()
    };

    writeStatus();
    return getStatus();
  }

  function setAxisVisible(value) {
    var runtime = getRuntime();

    if (runtime && typeof runtime.setAxisVisible === "function") {
      safeCall(function () {
        runtime.setAxisVisible(Boolean(value));
      }, null);
    }

    state.lastAction = {
      name: "setAxisVisible",
      value: Boolean(value),
      at: now()
    };

    writeStatus();
    return getStatus();
  }

  function nudge(value) {
    var runtime = getRuntime();

    if (runtime && typeof runtime.nudge === "function") {
      safeCall(function () {
        runtime.nudge(Number(value || 0));
      }, null);
    }

    state.lastAction = {
      name: "nudge",
      value: Number(value || 0),
      at: now()
    };

    writeStatus();
    return getStatus();
  }

  function summarizeRuntime(runtimeStatus) {
    if (!runtimeStatus) return null;

    return {
      running: Boolean(runtimeStatus.running),
      paused: Boolean(runtimeStatus.paused),
      viewLon: runtimeStatus.viewLon,
      viewLat: runtimeStatus.viewLat,
      axisVisible: runtimeStatus.axisVisible,
      speedDegreesPerSecond: runtimeStatus.speedDegreesPerSecond,
      frameCount: runtimeStatus.frameCount
    };
  }

  function summarizeRenderer(rendererStatus) {
    if (!rendererStatus) return null;

    return {
      activeCanvas: Boolean(rendererStatus.activeCanvas),
      mountComplete: Boolean(rendererStatus.mountComplete),
      viewLon: rendererStatus.viewLon,
      viewLat: rendererStatus.viewLat,
      axisVisible: rendererStatus.axisVisible,
      rendererConsumesHexgrid: Boolean(rendererStatus.rendererConsumesHexgrid),
      publicHoneycombBlocked: Boolean(rendererStatus.publicHoneycombBlocked)
    };
  }

  function getStatus() {
    var renderer = getRenderer();
    var runtime = getRuntime();
    var control = getControl();

    var rendererStatus = renderer && typeof renderer.getStatus === "function"
      ? safeCall(function () { return renderer.getStatus(); }, null)
      : null;

    var runtimeStatus = runtime && typeof runtime.getStatus === "function"
      ? safeCall(function () { return runtime.getStatus(); }, null)
      : null;

    return {
      ok: true,
      active: true,
      VERSION: VERSION,
      version: VERSION,
      CONTRACT_MARKERS: CONTRACT_MARKERS.slice(),

      showroomGlobeInstrumentActive: true,
      showroomUsesExistingPlanetOneSystem: true,
      noDuplicateFakeGlobe: true,
      noTerrainOwnership: true,

      mounted: state.mounted,
      started: state.started,
      mountDetected: Boolean(state.mountNode),
      controlMountDetected: Boolean(state.controlNode),
      statusMountDetected: Boolean(state.statusNode),

      planetOneRendererDetected: Boolean(renderer),
      planetOneRuntimeDetected: Boolean(runtime),
      planetOneControlDetected: Boolean(control),

      rendererSummary: summarizeRenderer(rendererStatus),
      runtimeSummary: summarizeRuntime(runtimeStatus),

      lastAction: state.lastAction,
      lastStatusWrite: state.lastStatusWrite,
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
    mount: mount,
    start: start,
    pause: pause,
    resume: resume,
    reset: reset,
    setSpeed: setSpeed,
    setAxisVisible: setAxisVisible,
    nudge: nudge,
    writeStatus: writeStatus,
    getStatus: getStatus,
    status: status
  };

  global.DGBShowroomGlobeInstrument = api;
  global.DGBShowroomGlobe = api;

  try {
    if (global.dispatchEvent && typeof global.CustomEvent === "function") {
      global.dispatchEvent(new global.CustomEvent("dgb:showroom-globe-instrument-ready", {
        detail: getStatus()
      }));
    }
  } catch (error) {
    state.lastError = String(error && error.message ? error.message : error);
  }
})(typeof window !== "undefined" ? window : globalThis);

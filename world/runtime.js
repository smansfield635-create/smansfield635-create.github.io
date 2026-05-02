/* G1 PLANET 1 GENERATION 2 SEVEN FILE SYSTEMIC DYNAMIC REWRITE
   FILE: /world/runtime.js
   VERSION: G1_PLANET_1_GENERATION_2_SEVEN_FILE_SYSTEMIC_DYNAMIC_REWRITE_TNT_v1

   COMPATIBILITY MARKER:
   G1_PLANET_1_RUNTIME_FRAME_BUDGET_AND_RENDER_THROTTLE_TNT_v1

   ROLE:
   World runtime owns cadence only.
   It does not own terrain truth, canvas creation, route remount, or visual pass.
*/

(function attachPlanetOneWorldRuntimeGeneration2(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_GENERATION_2_SEVEN_FILE_SYSTEMIC_DYNAMIC_REWRITE_TNT_v1";
  var COMPAT_VERSION = "G1_PLANET_1_RUNTIME_FRAME_BUDGET_AND_RENDER_THROTTLE_TNT_v1";

  var state = {
    active: true,
    running: false,
    paused: true,
    mount: null,
    options: {
      viewLon: -28,
      viewLat: 0,
      speed: 0.18,
      direction: 1,
      showAxis: true,
      fps: 10
    },
    rafId: 0,
    lastFrameAt: 0,
    frameCount: 0,
    lastTickReceipt: null
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function normalizeLon(lon) {
    var x = ((Number(lon) + 180) % 360 + 360) % 360 - 180;
    return x === -180 ? 180 : x;
  }

  function getRenderer() {
    return global.DGBPlanetOneRenderer ||
      global.DGBPlanetOneRender ||
      global.DGBPlanetOneRenderTeam ||
      null;
  }

  function resolveMount(target) {
    if (typeof target === "string" && global.document) return global.document.querySelector(target);
    if (target) return target;

    if (state.mount) return state.mount;

    if (global.document) {
      return global.document.getElementById("planet-one-render") ||
        global.document.querySelector("[data-planet-one-mount='true']") ||
        null;
    }

    return null;
  }

  function registerMount(target, options) {
    state.mount = resolveMount(target);
    if (options) state.options = Object.assign({}, state.options, options);

    return {
      ok: Boolean(state.mount),
      version: VERSION,
      cadenceOnly: true,
      noCanvasCreation: true,
      noRouteRemount: true,
      visualPassClaimed: false
    };
  }

  function renderCurrent() {
    var renderer = getRenderer();
    var mount = resolveMount();

    if (!renderer || !mount) {
      state.lastTickReceipt = {
        ok: false,
        reason: !renderer ? "NO_RENDERER" : "NO_MOUNT",
        version: VERSION,
        visualPassClaimed: false
      };
      return state.lastTickReceipt;
    }

    var receipt;
    if (typeof renderer.renderPlanetOne === "function") {
      receipt = renderer.renderPlanetOne(mount, state.options);
    } else if (typeof renderer.render === "function") {
      receipt = renderer.render(mount, state.options);
    } else if (typeof renderer.mount === "function") {
      receipt = renderer.mount(mount, state.options);
    } else {
      receipt = { ok: false, reason: "NO_RENDER_METHOD", visualPassClaimed: false };
    }

    state.frameCount += 1;
    state.lastTickReceipt = {
      ok: Boolean(receipt && receipt.ok !== false),
      version: VERSION,
      compatibilityVersion: COMPAT_VERSION,
      cadenceOnly: true,
      noCanvasCreation: true,
      noRouteRemount: true,
      frameCount: state.frameCount,
      rendererReceipt: receipt || null,
      visualPassClaimed: false,
      tickedAt: new Date().toISOString()
    };

    return state.lastTickReceipt;
  }

  function tick(timestamp) {
    var minInterval = 1000 / clamp(state.options.fps || 10, 1, 30);

    if (!state.running || state.paused) return;

    if (!state.lastFrameAt || timestamp - state.lastFrameAt >= minInterval) {
      state.options.viewLon = normalizeLon((state.options.viewLon || 0) + (state.options.speed || 0) * (state.options.direction || 1));
      renderCurrent();
      state.lastFrameAt = timestamp;
    }

    state.rafId = global.requestAnimationFrame(tick);
  }

  function start(target, options) {
    registerMount(target, options);
    state.running = true;
    state.paused = false;

    if (state.rafId) global.cancelAnimationFrame(state.rafId);
    renderCurrent();
    state.rafId = global.requestAnimationFrame(tick);

    return {
      ok: true,
      started: true,
      version: VERSION,
      cadenceOnly: true,
      visualPassClaimed: false
    };
  }

  function stop() {
    state.running = false;
    state.paused = true;
    if (state.rafId) global.cancelAnimationFrame(state.rafId);
    state.rafId = 0;

    return {
      ok: true,
      stopped: true,
      version: VERSION,
      visualPassClaimed: false
    };
  }

  function pause() {
    state.paused = true;
    return { ok: true, paused: true, version: VERSION, visualPassClaimed: false };
  }

  function resume() {
    if (!state.running) state.running = true;
    state.paused = false;
    if (!state.rafId) state.rafId = global.requestAnimationFrame(tick);

    return { ok: true, paused: false, version: VERSION, visualPassClaimed: false };
  }

  function reset() {
    state.options.viewLon = -28;
    return renderCurrent();
  }

  function setSpeed(value) {
    state.options.speed = clamp(Number(value), 0, 4);
    return { ok: true, speed: state.options.speed, version: VERSION, visualPassClaimed: false };
  }

  function setDirection(value) {
    state.options.direction = value === -1 || value === "reverse" ? -1 : 1;
    return { ok: true, direction: state.options.direction, version: VERSION, visualPassClaimed: false };
  }

  function setAxis(value) {
    state.options.showAxis = Boolean(value);
    return renderCurrent();
  }

  function tickOnce(target, options) {
    registerMount(target, options);
    return renderCurrent();
  }

  function getStatus() {
    return {
      ok: true,
      active: true,
      VERSION: VERSION,
      version: VERSION,
      compatibilityVersion: COMPAT_VERSION,
      role: "CADENCE_ONLY",
      systemicDynamicStandardActive: true,
      ownsFrameCadence: true,
      ownsCanvasCreation: false,
      ownsRouteRemount: false,
      ownsTerrainTruth: false,
      ownsControlState: false,
      running: state.running,
      paused: state.paused,
      frameCount: state.frameCount,
      options: Object.assign({}, state.options),
      lastTickReceipt: state.lastTickReceipt,
      visualPassClaimed: false
    };
  }

  var api = {
    VERSION: VERSION,
    version: VERSION,
    COMPAT_VERSION: COMPAT_VERSION,
    compatibilityVersion: COMPAT_VERSION,

    registerMount: registerMount,
    start: start,
    stop: stop,
    pause: pause,
    resume: resume,
    reset: reset,
    setSpeed: setSpeed,
    setDirection: setDirection,
    setAxis: setAxis,
    tickOnce: tickOnce,
    renderCurrent: renderCurrent,
    getStatus: getStatus,
    status: getStatus,

    visualPassClaimed: false
  };

  global.DGBWorldRuntime = api;
  global.DGBPlanetOneRuntime = api;

  try {
    global.dispatchEvent(new CustomEvent("dgb:planet-one:world-runtime:generation-2-ready", {
      detail: getStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);

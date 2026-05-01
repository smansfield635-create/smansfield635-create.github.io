/* G1 PLANET 1 AXIS ROTATION RUNTIME
   FILE: /world/runtime.js
   VERSION: G1_PLANET_1_AXIS_ROTATION_RUNTIME_TNT_v1

   PURPOSE:
   - Own animation loop and rotation state.
   - Advance Planet 1 viewLon over time.
   - Keep renderer passive.
   - Expose runtime controls for /world/control.js.
   - Preserve visual HOLD.
*/

(function attachWorldRuntime(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_AXIS_ROTATION_RUNTIME_TNT_v1";
  var DEFAULT_MOUNT_SELECTORS = [
    "#planet-one-render",
    "[data-planet-one-mount='true']",
    ".planet-one-render"
  ];

  var CONTRACT_MARKERS = [
    VERSION,
    "WORLD_RUNTIME_ACTIVE",
    "PLANET_ONE_ROTATION_RUNTIME_ACTIVE",
    "VIEWLON_PROGRESS_OWNS_ROTATION",
    "RENDERER_PASSIVE_RUNTIME_ACTIVE",
    "CONTROL_PANEL_COMMANDS_ACCEPTED",
    "VISUAL_PASS_NOT_CLAIMED"
  ];

  var state = {
    active: true,
    mounted: false,
    running: false,
    paused: false,
    animationFrame: null,
    mount: null,
    viewLon: -28,
    viewLat: 0,
    axisTilt: -0.28,
    axisVisible: true,
    speedDegreesPerSecond: 2.4,
    lastTimestamp: null,
    lastRender: null,
    lastError: null,
    frameCount: 0,
    visualPassClaimed: false
  };

  function now() {
    return new Date().toISOString();
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function wrapLon(value) {
    var lon = value;
    while (lon <= -180) lon += 360;
    while (lon > 180) lon -= 360;
    return lon;
  }

  function resolveMount(target) {
    var i;
    var found;

    if (target && typeof target !== "string") return target;

    if (!global.document) return null;

    if (typeof target === "string") {
      found = global.document.querySelector(target);
      if (found) return found;
    }

    for (i = 0; i < DEFAULT_MOUNT_SELECTORS.length; i += 1) {
      found = global.document.querySelector(DEFAULT_MOUNT_SELECTORS[i]);
      if (found) return found;
    }

    found = global.document.createElement("div");
    found.id = "planet-one-render";
    found.setAttribute("data-planet-one-mount", "true");
    found.style.width = "100%";
    found.style.maxWidth = "720px";
    found.style.margin = "0 auto";

    (global.document.body || global.document.documentElement).appendChild(found);
    return found;
  }

  function getRenderer() {
    return global.DGBPlanetOneRender ||
      global.DGBPlanetOneRenderer ||
      global.DGBPlanetOneRenderTeam ||
      null;
  }

  function renderFrame() {
    var renderer = getRenderer();

    if (!renderer || typeof renderer.renderPlanetOne !== "function") {
      state.lastError = "PLANET_ONE_RENDERER_NOT_AVAILABLE";
      return null;
    }

    state.lastRender = renderer.renderPlanetOne(state.mount, {
      renderMode: "satellite",
      viewLon: state.viewLon,
      viewLat: state.viewLat,
      axisTilt: state.axisTilt,
      showAxis: state.axisVisible,
      clearMount: false
    });

    return state.lastRender;
  }

  function tick(timestamp) {
    var deltaSeconds;

    if (!state.running) return;

    if (state.paused) {
      state.lastTimestamp = timestamp;
      state.animationFrame = global.requestAnimationFrame(tick);
      return;
    }

    if (state.lastTimestamp == null) state.lastTimestamp = timestamp;
    deltaSeconds = Math.max(0, Math.min(0.08, (timestamp - state.lastTimestamp) / 1000));
    state.lastTimestamp = timestamp;

    state.viewLon = wrapLon(state.viewLon + state.speedDegreesPerSecond * deltaSeconds);
    state.frameCount += 1;

    renderFrame();

    state.animationFrame = global.requestAnimationFrame(tick);
  }

  function mount(target, options) {
    options = options || {};

    state.mount = resolveMount(target || options.target || options.mount);
    if (!state.mount) {
      state.lastError = "NO_PLANET_ONE_MOUNT";
      return {
        ok: false,
        reason: "NO_PLANET_ONE_MOUNT",
        version: VERSION,
        visualPassClaimed: false
      };
    }

    if (options.viewLon != null) state.viewLon = Number(options.viewLon);
    if (options.viewLat != null) state.viewLat = Number(options.viewLat);
    if (options.axisTilt != null) state.axisTilt = Number(options.axisTilt);
    if (options.axisVisible != null) state.axisVisible = Boolean(options.axisVisible);
    if (options.speedDegreesPerSecond != null) {
      state.speedDegreesPerSecond = clamp(Number(options.speedDegreesPerSecond), -18, 18);
    }

    state.mounted = true;
    renderFrame();

    return getStatus();
  }

  function start(target, options) {
    mount(target, options || {});

    if (state.running) return getStatus();

    state.running = true;
    state.paused = false;
    state.lastTimestamp = null;

    if (typeof global.requestAnimationFrame === "function") {
      state.animationFrame = global.requestAnimationFrame(tick);
    } else {
      state.lastError = "REQUEST_ANIMATION_FRAME_NOT_AVAILABLE";
    }

    return getStatus();
  }

  function pause() {
    state.paused = true;
    return getStatus();
  }

  function resume() {
    state.paused = false;

    if (!state.running) {
      return start(state.mount);
    }

    return getStatus();
  }

  function stop() {
    state.running = false;
    state.paused = false;

    if (state.animationFrame && typeof global.cancelAnimationFrame === "function") {
      global.cancelAnimationFrame(state.animationFrame);
    }

    state.animationFrame = null;
    state.lastTimestamp = null;

    return getStatus();
  }

  function reset() {
    state.viewLon = -28;
    state.viewLat = 0;
    state.axisTilt = -0.28;
    renderFrame();
    return getStatus();
  }

  function setSpeed(value) {
    state.speedDegreesPerSecond = clamp(Number(value), -18, 18);
    return getStatus();
  }

  function setView(lon, lat) {
    if (lon != null) state.viewLon = wrapLon(Number(lon));
    if (lat != null) state.viewLat = clamp(Number(lat), -55, 55);
    renderFrame();
    return getStatus();
  }

  function setAxisVisible(value) {
    state.axisVisible = Boolean(value);
    renderFrame();
    return getStatus();
  }

  function setAxisTilt(value) {
    state.axisTilt = clamp(Number(value), -0.9, 0.9);
    renderFrame();
    return getStatus();
  }

  function nudge(deltaLon) {
    state.viewLon = wrapLon(state.viewLon + Number(deltaLon || 0));
    renderFrame();
    return getStatus();
  }

  function getStatus() {
    return {
      ok: true,
      active: true,
      VERSION: VERSION,
      version: VERSION,
      CONTRACT_MARKERS: CONTRACT_MARKERS.slice(),
      worldRuntimeActive: true,
      planetOneRotationRuntimeActive: true,
      mounted: state.mounted,
      running: state.running,
      paused: state.paused,
      viewLon: state.viewLon,
      viewLat: state.viewLat,
      axisTilt: state.axisTilt,
      axisVisible: state.axisVisible,
      speedDegreesPerSecond: state.speedDegreesPerSecond,
      frameCount: state.frameCount,
      mountDetected: Boolean(state.mount),
      rendererDetected: Boolean(getRenderer()),
      lastRender: state.lastRender,
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
    stop: stop,
    reset: reset,
    setSpeed: setSpeed,
    setView: setView,
    setAxisVisible: setAxisVisible,
    setAxisTilt: setAxisTilt,
    nudge: nudge,
    getStatus: getStatus,
    status: status
  };

  global.DGBWorldRuntime = api;
  global.DGBPlanetOneRuntime = api;

  function autostart() {
    var mountNode = resolveMount();

    if (mountNode) {
      start(mountNode, {
        viewLon: state.viewLon,
        viewLat: state.viewLat,
        axisTilt: state.axisTilt,
        axisVisible: state.axisVisible
      });
    }
  }

  try {
    global.dispatchEvent(new CustomEvent("dgb:world-runtime-ready", {
      detail: getStatus()
    }));
  } catch (error) {}

  if (global.document && global.document.readyState === "loading") {
    global.document.addEventListener("DOMContentLoaded", autostart, { once: true });
  } else {
    global.setTimeout(autostart, 60);
  }
})(typeof window !== "undefined" ? window : globalThis);

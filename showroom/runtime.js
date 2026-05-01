/* G1 PLANET 1 SHOWROOM RUNTIME / ASSET BRIDGE REPAIR
   FILE: /showroom/runtime.js
   VERSION: G1_PLANET_1_RUNTIME_ASSET_BRIDGE_CHAIN_REPAIR_TNT_v1

   PURPOSE:
   - Boot the Showroom Planet 1 bridge after route, renderer, hexgrid, and asset instrument are loaded.
   - Repaint the active renderer after hexgrid/renderer readiness.
   - Keep Showroom as adapter only.
   - Do not own terrain.
   - Do not create duplicate fake globe.
   - Default public mode to satellite.
   - Keep visual pass held.
*/

(function attachShowroomGlobeRuntime(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_RUNTIME_ASSET_BRIDGE_CHAIN_REPAIR_TNT_v1";
  var RENDER_PAIR = "G1_PLANET_1_TERRAIN_DEPTH_NORMAL_RELIEF_TRANSLATION_PAIR_TNT_v1";
  var DEFAULT_VIEW_LON = -28;
  var DEFAULT_VIEW_LAT = 0;
  var DEFAULT_SPEED = 2.4;
  var MAX_FPS = 10;

  var state = {
    version: VERSION,
    showroomRuntimeActive: true,
    booted: false,
    running: true,
    paused: false,
    direction: 1,
    viewLon: DEFAULT_VIEW_LON,
    viewLat: DEFAULT_VIEW_LAT,
    speedDegreesPerSecond: DEFAULT_SPEED,
    axisVisible: false,
    frameCount: 0,
    renderCount: 0,
    lastFrameTime: 0,
    lastRenderTime: 0,
    instrumentDetected: false,
    showroomUsesPlanetOneRuntime: true,
    showroomUsesPlanetOneRenderer: true,
    noDuplicateFakeGlobe: true,
    noIndependentPlanetPhysics: true,
    visualPassClaimed: false,
    lastInstrumentStatus: null,
    lastError: null
  };

  function now() {
    return new Date().toISOString();
  }

  function wrapLon(lon) {
    var x = ((lon + 180) % 360 + 360) % 360 - 180;
    return x === -180 ? 180 : x;
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

  function getMount() {
    if (!global.document) return null;
    return global.document.querySelector("[data-planet-one-mount='true']") ||
      global.document.getElementById("planet-one-render");
  }

  function getInstrument() {
    return global.DGBShowroomGlobeInstrument || null;
  }

  function render(reason) {
    var instrument = getInstrument();
    var mount = getMount();

    state.instrumentDetected = Boolean(instrument);

    if (!instrument || typeof instrument.render !== "function") {
      state.lastError = "INSTRUMENT_NOT_READY";
      return getStatus();
    }

    if (!mount) {
      state.lastError = "PLANET_MOUNT_NOT_FOUND";
      return getStatus();
    }

    try {
      state.lastInstrumentStatus = instrument.render(mount, {
        renderMode: "satellite",
        viewLon: state.viewLon,
        viewLat: state.viewLat,
        showAxis: state.axisVisible,
        compositorScale: 0.64,
        surfaceAlpha: 0.94,
        clearMount: state.renderCount === 0,
        source: reason || "showroom-runtime"
      });

      state.renderCount += 1;
      state.lastError = null;
    } catch (error) {
      state.lastError = String(error && error.message ? error.message : error);
    }

    writeReceipts();

    try {
      global.dispatchEvent(new CustomEvent("dgb:showroom-globe:runtime-render", {
        detail: getStatus()
      }));
    } catch (error2) {}

    return getStatus();
  }

  function tick(timestamp) {
    var dt;
    var renderInterval = 1000 / MAX_FPS;

    if (!state.booted) {
      global.requestAnimationFrame(tick);
      return;
    }

    if (!state.lastFrameTime) state.lastFrameTime = timestamp;

    dt = timestamp - state.lastFrameTime;
    state.lastFrameTime = timestamp;

    if (state.running && !state.paused) {
      state.viewLon = wrapLon(
        state.viewLon + state.direction * state.speedDegreesPerSecond * (dt / 1000)
      );
    }

    if (timestamp - state.lastRenderTime >= renderInterval) {
      state.frameCount += 1;
      state.lastRenderTime = timestamp;
      render("runtime-loop");
    }

    global.requestAnimationFrame(tick);
  }

  function writeReceipts() {
    writeReceipt("planet-one-runtime-receipt", getStatus());

    if (state.lastInstrumentStatus) {
      writeReceipt("planet-one-bridge-receipt", state.lastInstrumentStatus);
    }
  }

  function bindControls() {
    if (!global.document) return;

    global.document.querySelectorAll("[data-planet-action]").forEach(function (button) {
      button.addEventListener("click", function () {
        var action = button.getAttribute("data-planet-action");

        if (action === "start") start();
        if (action === "pause") pause();
        if (action === "resume") resume();
        if (action === "reset") reset();
        if (action === "reverse") reverse();

        render("control-" + action);
      });
    });

    global.document.querySelectorAll("[data-planet-speed]").forEach(function (button) {
      button.addEventListener("click", function () {
        var value = button.getAttribute("data-planet-speed");

        if (value === "slow") slow();
        if (value === "normal") normal();
        if (value === "fast") fast();

        global.document.querySelectorAll("[data-planet-speed]").forEach(function (item) {
          item.setAttribute("data-active", "false");
        });

        button.setAttribute("data-active", "true");
        render("control-speed-" + value);
      });
    });

    global.document.querySelectorAll("[data-planet-speed-select]").forEach(function (select) {
      select.addEventListener("change", function () {
        state.speedDegreesPerSecond = Number(select.value || DEFAULT_SPEED);
        render("control-speed-select");
      });
    });

    global.document.querySelectorAll("[data-planet-axis-toggle]").forEach(function (checkbox) {
      checkbox.addEventListener("change", function () {
        state.axisVisible = checkbox.checked === true;
        render("control-axis-toggle");
      });
    });
  }

  function boot() {
    var instrument = getInstrument();

    state.instrumentDetected = Boolean(instrument);
    state.booted = true;

    bindControls();

    if (instrument && typeof instrument.start === "function") {
      try {
        state.lastInstrumentStatus = instrument.start(getMount(), {
          renderMode: "satellite",
          viewLon: state.viewLon,
          viewLat: state.viewLat,
          showAxis: state.axisVisible,
          compositorScale: 0.64,
          surfaceAlpha: 0.94,
          clearMount: true,
          source: "showroom-runtime-boot"
        });
      } catch (error) {
        state.lastError = String(error && error.message ? error.message : error);
      }
    }

    render("boot");
    writeReceipts();

    try {
      global.dispatchEvent(new CustomEvent("dgb:showroom-globe:runtime-ready", {
        detail: getStatus()
      }));
    } catch (error2) {}

    global.requestAnimationFrame(tick);
  }

  function waitForInstrument(timeoutMs) {
    var started = Date.now();
    var timeout = Number(timeoutMs || 2600);

    function check() {
      if (getInstrument()) {
        boot();
        return;
      }

      if (Date.now() - started > timeout) {
        boot();
        return;
      }

      global.setTimeout(check, 45);
    }

    check();
  }

  function start() {
    state.running = true;
    state.paused = false;
    return getStatus();
  }

  function pause() {
    state.paused = true;
    return getStatus();
  }

  function resume() {
    state.running = true;
    state.paused = false;
    return getStatus();
  }

  function reset() {
    state.viewLon = DEFAULT_VIEW_LON;
    state.viewLat = DEFAULT_VIEW_LAT;
    state.direction = 1;
    state.paused = false;
    return getStatus();
  }

  function reverse() {
    state.direction = state.direction * -1;
    return getStatus();
  }

  function slow() {
    state.speedDegreesPerSecond = 0.8;
    return getStatus();
  }

  function normal() {
    state.speedDegreesPerSecond = 2.4;
    return getStatus();
  }

  function fast() {
    state.speedDegreesPerSecond = 5.2;
    return getStatus();
  }

  function setView(viewLon, viewLat) {
    state.viewLon = wrapLon(Number(viewLon == null ? state.viewLon : viewLon));
    state.viewLat = Number(viewLat == null ? state.viewLat : viewLat);
    render("set-view");
    return getStatus();
  }

  function setAxisVisible(value) {
    state.axisVisible = value === true;
    render("set-axis-visible");
    return getStatus();
  }

  function getStatus() {
    return {
      showroomRuntimeVersion: VERSION,
      renderPair: RENDER_PAIR,
      showroomRuntimeActive: true,
      booted: state.booted,
      instrumentDetected: Boolean(getInstrument()),
      showroomUsesPlanetOneRuntime: true,
      showroomUsesPlanetOneRenderer: true,
      noDuplicateFakeGlobe: true,
      noIndependentPlanetPhysics: true,
      running: state.running,
      paused: state.paused,
      viewLon: Number(state.viewLon.toFixed(4)),
      viewLat: Number(state.viewLat.toFixed(4)),
      speedDegreesPerSecond: state.speedDegreesPerSecond,
      axisVisible: state.axisVisible,
      frameCount: state.frameCount,
      renderCount: state.renderCount,
      instrument: state.lastInstrumentStatus,
      lastError: state.lastError,
      timestamp: now(),
      visualPassClaimed: false
    };
  }

  function status() {
    return getStatus();
  }

  var api = {
    VERSION: VERSION,
    version: VERSION,
    start: start,
    pause: pause,
    resume: resume,
    reset: reset,
    reverse: reverse,
    slow: slow,
    normal: normal,
    fast: fast,
    render: render,
    setView: setView,
    setAxisVisible: setAxisVisible,
    getStatus: getStatus,
    status: status
  };

  global.DGBShowroomGlobeRuntime = api;
  global.DGBPlanetOneRuntimeBridge = api;

  global.addEventListener("dgb:planet-one:hexgrid-ready", function () {
    render("hexgrid-ready");
  });

  global.addEventListener("dgb:planet-one:renderer-ready", function () {
    render("renderer-ready");
  });

  global.addEventListener("dgb:showroom-globe:instrument-ready", function () {
    render("instrument-ready");
  });

  if (global.document && global.document.readyState === "loading") {
    global.document.addEventListener("DOMContentLoaded", function () {
      waitForInstrument(2600);
    }, { once: true });
  } else {
    waitForInstrument(2600);
  }
})(typeof window !== "undefined" ? window : globalThis);

/* G1 PLANET 1 GENERATION 2 SEVEN FILE SYSTEMIC DYNAMIC REWRITE
   FILE: /world/control.js
   VERSION: G1_PLANET_1_GENERATION_2_SEVEN_FILE_SYSTEMIC_DYNAMIC_REWRITE_TNT_v1

   COMPATIBILITY MARKER:
   G1_PLANET_1_AXIS_ROTATION_CONTROL_PANEL_TNT_v1

   ROLE:
   World control owns user input only.
   It does not own surface truth, renderer replacement, hidden remount, or visual pass.
*/

(function attachPlanetOneControlGeneration2(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_GENERATION_2_SEVEN_FILE_SYSTEMIC_DYNAMIC_REWRITE_TNT_v1";
  var COMPAT_VERSION = "G1_PLANET_1_AXIS_ROTATION_CONTROL_PANEL_TNT_v1";

  var state = {
    bound: false,
    bindCount: 0,
    lastAction: null,
    speed: 0.18,
    direction: 1,
    showAxis: true
  };

  function byId(id) {
    return global.document ? global.document.getElementById(id) : null;
  }

  function getRuntime() {
    return global.DGBPlanetOneRuntime || global.DGBWorldRuntime || null;
  }

  function mountElement() {
    if (!global.document) return null;
    return byId("planet-one-render") ||
      global.document.querySelector("[data-planet-one-mount='true']") ||
      null;
  }

  function callRuntime(method, arg) {
    var runtime = getRuntime();
    var mount = mountElement();

    if (!runtime || typeof runtime[method] !== "function") {
      state.lastAction = {
        ok: false,
        method: method,
        reason: "NO_RUNTIME_METHOD",
        version: VERSION,
        visualPassClaimed: false
      };
      return state.lastAction;
    }

    state.lastAction = runtime[method](arg === undefined ? mount : arg, {
      speed: state.speed,
      direction: state.direction,
      showAxis: state.showAxis
    });

    return state.lastAction;
  }

  function setActiveButton(button) {
    if (!global.document || !button) return;

    Array.prototype.forEach.call(global.document.querySelectorAll("[data-control-action]"), function (item) {
      item.removeAttribute("data-active");
    });

    button.setAttribute("data-active", "true");
  }

  function action(name, button) {
    var runtime = getRuntime();

    setActiveButton(button);

    if (name === "start") return callRuntime("start");
    if (name === "pause") return callRuntime("pause");
    if (name === "resume") return callRuntime("resume");
    if (name === "reset") return callRuntime("reset");

    if (name === "reverse") {
      state.direction = state.direction === 1 ? -1 : 1;
      if (runtime && typeof runtime.setDirection === "function") runtime.setDirection(state.direction);
      return callRuntime("tickOnce");
    }

    if (name === "slow") {
      state.speed = 0.08;
      if (runtime && typeof runtime.setSpeed === "function") runtime.setSpeed(state.speed);
      return callRuntime("tickOnce");
    }

    if (name === "normal") {
      state.speed = 0.18;
      if (runtime && typeof runtime.setSpeed === "function") runtime.setSpeed(state.speed);
      return callRuntime("tickOnce");
    }

    if (name === "fast") {
      state.speed = 0.44;
      if (runtime && typeof runtime.setSpeed === "function") runtime.setSpeed(state.speed);
      return callRuntime("tickOnce");
    }

    return {
      ok: false,
      reason: "UNKNOWN_ACTION",
      action: name,
      version: VERSION,
      visualPassClaimed: false
    };
  }

  function bindControls(root) {
    var scope = root || global.document;
    var buttons;
    var speed;
    var axis;

    if (!scope || state.bound) {
      return {
        ok: true,
        alreadyBound: state.bound,
        bindCount: state.bindCount,
        version: VERSION,
        visualPassClaimed: false
      };
    }

    buttons = Array.prototype.slice.call(scope.querySelectorAll("[data-control-action], [data-planet-one-control]"));

    buttons.forEach(function (button) {
      var name = button.getAttribute("data-control-action") ||
        button.getAttribute("data-planet-one-control") ||
        "";

      button.addEventListener("click", function () {
        action(name, button);
      });
    });

    speed = byId("planet-one-speed") || scope.querySelector("[data-planet-one-speed='true']");
    if (speed) {
      speed.addEventListener("input", function () {
        var runtime = getRuntime();
        state.speed = Math.max(0, Math.min(4, Number(speed.value || 0) / 100));
        if (runtime && typeof runtime.setSpeed === "function") runtime.setSpeed(state.speed);
      });
    }

    axis = byId("planet-one-show-axis") || scope.querySelector("[data-planet-one-axis='true']");
    if (axis) {
      axis.addEventListener("change", function () {
        var runtime = getRuntime();
        state.showAxis = Boolean(axis.checked);
        if (runtime && typeof runtime.setAxis === "function") runtime.setAxis(state.showAxis);
      });
    }

    state.bound = true;
    state.bindCount = buttons.length;

    return {
      ok: true,
      bound: true,
      bindCount: state.bindCount,
      version: VERSION,
      inputOnly: true,
      noSurfaceTruth: true,
      noHiddenRemount: true,
      visualPassClaimed: false
    };
  }

  function getStatus() {
    return {
      ok: true,
      active: true,
      VERSION: VERSION,
      version: VERSION,
      compatibilityVersion: COMPAT_VERSION,
      role: "INPUT_ONLY",
      systemicDynamicStandardActive: true,
      ownsInputOnly: true,
      ownsSurfaceTruth: false,
      ownsRendererReplacement: false,
      ownsHiddenRemount: false,
      bound: state.bound,
      bindCount: state.bindCount,
      speed: state.speed,
      direction: state.direction,
      showAxis: state.showAxis,
      lastAction: state.lastAction,
      visualPassClaimed: false
    };
  }

  var api = {
    VERSION: VERSION,
    version: VERSION,
    COMPAT_VERSION: COMPAT_VERSION,
    compatibilityVersion: COMPAT_VERSION,

    bindControls: bindControls,
    action: action,
    getStatus: getStatus,
    status: getStatus,

    visualPassClaimed: false
  };

  global.DGBPlanetOneControl = api;
  global.DGBWorldControl = api;

  function boot() {
    bindControls(global.document);
  }

  if (global.document) {
    if (global.document.readyState === "loading") {
      global.document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
      boot();
    }
  }

  try {
    global.dispatchEvent(new CustomEvent("dgb:planet-one:control:generation-2-ready", {
      detail: getStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);

/* G1 PLANET 1 AXIS ROTATION CONTROL PANEL
   FILE: /world/control.js
   VERSION: G1_PLANET_1_AXIS_ROTATION_CONTROL_PANEL_TNT_v1

   PURPOSE:
   - Provide Planet 1 runtime controls.
   - Start, pause, resume, reset, slow, fast, reverse, and axis toggle.
   - Keep runtime as motion owner.
   - Keep renderer as passive draw target.
   - Keep visual pass on HOLD.
*/

(function attachWorldControlPanel(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_AXIS_ROTATION_CONTROL_PANEL_TNT_v1";

  var CONTRACT_MARKERS = [
    VERSION,
    "WORLD_CONTROL_PANEL_ACTIVE",
    "PLANET_ONE_ROTATION_CONTROLS_ACTIVE",
    "RUNTIME_COMMAND_LAYER_ACTIVE",
    "NO_TERRAIN_OWNERSHIP",
    "VISUAL_PASS_NOT_CLAIMED"
  ];

  var state = {
    active: true,
    panelMounted: false,
    lastAction: null,
    lastError: null,
    visualPassClaimed: false
  };

  function now() {
    return new Date().toISOString();
  }

  function getRuntime() {
    return global.DGBPlanetOneRuntime || global.DGBWorldRuntime || null;
  }

  function runtimeAction(name, value) {
    var runtime = getRuntime();

    state.lastAction = {
      name: name,
      value: value,
      at: now()
    };

    if (!runtime) {
      state.lastError = "PLANET_ONE_RUNTIME_NOT_AVAILABLE";
      return null;
    }

    if (name === "start" && typeof runtime.start === "function") return runtime.start();
    if (name === "pause" && typeof runtime.pause === "function") return runtime.pause();
    if (name === "resume" && typeof runtime.resume === "function") return runtime.resume();
    if (name === "stop" && typeof runtime.stop === "function") return runtime.stop();
    if (name === "reset" && typeof runtime.reset === "function") return runtime.reset();
    if (name === "speed" && typeof runtime.setSpeed === "function") return runtime.setSpeed(value);
    if (name === "axis" && typeof runtime.setAxisVisible === "function") return runtime.setAxisVisible(value);
    if (name === "tilt" && typeof runtime.setAxisTilt === "function") return runtime.setAxisTilt(value);
    if (name === "nudge" && typeof runtime.nudge === "function") return runtime.nudge(value);

    state.lastError = "RUNTIME_ACTION_NOT_SUPPORTED:" + name;
    return null;
  }

  function resolvePanelMount(target) {
    var mount;

    if (target && typeof target !== "string") return target;

    if (!global.document) return null;

    if (typeof target === "string") {
      mount = global.document.querySelector(target);
      if (mount) return mount;
    }

    mount = global.document.querySelector("[data-planet-one-controls='true']") ||
      global.document.getElementById("planet-one-controls") ||
      global.document.querySelector(".planet-one-controls");

    if (mount) return mount;

    mount = global.document.createElement("div");
    mount.id = "planet-one-controls";
    mount.setAttribute("data-planet-one-controls", "true");

    mount.style.maxWidth = "720px";
    mount.style.margin = "12px auto";
    mount.style.padding = "12px";
    mount.style.border = "1px solid rgba(242,199,111,.26)";
    mount.style.borderRadius = "18px";
    mount.style.background = "rgba(5,10,22,.72)";
    mount.style.color = "#f2d99b";
    mount.style.fontFamily = "inherit";

    var renderMount = global.document.getElementById("planet-one-render") ||
      global.document.querySelector("[data-planet-one-mount='true']") ||
      global.document.querySelector(".planet-one-render");

    if (renderMount && renderMount.parentNode) {
      renderMount.parentNode.insertBefore(mount, renderMount.nextSibling);
    } else {
      (global.document.body || global.document.documentElement).appendChild(mount);
    }

    return mount;
  }

  function makeButton(label, action) {
    var button = global.document.createElement("button");

    button.type = "button";
    button.textContent = label;
    button.setAttribute("data-planet-one-control-button", label.toLowerCase().replace(/\s+/g, "-"));

    button.style.margin = "4px";
    button.style.padding = "8px 10px";
    button.style.border = "1px solid rgba(242,199,111,.32)";
    button.style.borderRadius = "999px";
    button.style.background = "rgba(12,24,46,.86)";
    button.style.color = "#f2d99b";
    button.style.cursor = "pointer";
    button.style.font = "inherit";

    button.addEventListener("click", action);

    return button;
  }

  function mountPanel(target) {
    var mount;
    var title;
    var rowOne;
    var rowTwo;
    var speedLabel;
    var speed;
    var axisLabel;
    var axisToggle;
    var status;

    if (!global.document) {
      state.lastError = "DOCUMENT_NOT_AVAILABLE";
      return getStatus();
    }

    mount = resolvePanelMount(target);
    if (!mount) {
      state.lastError = "CONTROL_PANEL_MOUNT_NOT_AVAILABLE";
      return getStatus();
    }

    mount.innerHTML = "";

    title = global.document.createElement("div");
    title.textContent = "Planet 1 Motion Control";
    title.style.fontWeight = "700";
    title.style.marginBottom = "8px";
    title.style.letterSpacing = ".02em";

    rowOne = global.document.createElement("div");
    rowOne.style.display = "flex";
    rowOne.style.flexWrap = "wrap";
    rowOne.style.gap = "4px";
    rowOne.style.alignItems = "center";

    rowOne.appendChild(makeButton("Start", function () { runtimeAction("start"); updateStatus(status); }));
    rowOne.appendChild(makeButton("Pause", function () { runtimeAction("pause"); updateStatus(status); }));
    rowOne.appendChild(makeButton("Resume", function () { runtimeAction("resume"); updateStatus(status); }));
    rowOne.appendChild(makeButton("Reset", function () { runtimeAction("reset"); updateStatus(status); }));
    rowOne.appendChild(makeButton("Reverse", function () { runtimeAction("speed", -2.4); updateStatus(status); }));
    rowOne.appendChild(makeButton("Slow", function () { runtimeAction("speed", 1.2); updateStatus(status); }));
    rowOne.appendChild(makeButton("Normal", function () { runtimeAction("speed", 2.4); updateStatus(status); }));
    rowOne.appendChild(makeButton("Fast", function () { runtimeAction("speed", 5.6); updateStatus(status); }));

    rowTwo = global.document.createElement("div");
    rowTwo.style.display = "grid";
    rowTwo.style.gridTemplateColumns = "1fr";
    rowTwo.style.gap = "8px";
    rowTwo.style.marginTop = "10px";

    speedLabel = global.document.createElement("label");
    speedLabel.textContent = "Rotation speed";
    speedLabel.style.display = "grid";
    speedLabel.style.gap = "4px";

    speed = global.document.createElement("input");
    speed.type = "range";
    speed.min = "-8";
    speed.max = "8";
    speed.step = "0.2";
    speed.value = "2.4";
    speed.addEventListener("input", function () {
      runtimeAction("speed", Number(speed.value));
      updateStatus(status);
    });

    speedLabel.appendChild(speed);

    axisLabel = global.document.createElement("label");
    axisLabel.style.display = "flex";
    axisLabel.style.alignItems = "center";
    axisLabel.style.gap = "8px";

    axisToggle = global.document.createElement("input");
    axisToggle.type = "checkbox";
    axisToggle.checked = true;
    axisToggle.addEventListener("change", function () {
      runtimeAction("axis", axisToggle.checked);
      updateStatus(status);
    });

    axisLabel.appendChild(axisToggle);
    axisLabel.appendChild(global.document.createTextNode("Show soft axis"));

    status = global.document.createElement("pre");
    status.setAttribute("data-planet-one-control-status", "true");
    status.style.whiteSpace = "pre-wrap";
    status.style.fontSize = "12px";
    status.style.opacity = ".78";
    status.style.margin = "10px 0 0";
    status.style.color = "#d8e6ff";

    rowTwo.appendChild(speedLabel);
    rowTwo.appendChild(axisLabel);

    mount.appendChild(title);
    mount.appendChild(rowOne);
    mount.appendChild(rowTwo);
    mount.appendChild(status);

    state.panelMounted = true;

    runtimeAction("start");
    updateStatus(status);

    return getStatus();
  }

  function updateStatus(node) {
    var runtime = getRuntime();
    var runtimeStatus = runtime && typeof runtime.getStatus === "function" ? runtime.getStatus() : null;

    if (!node) return;

    node.textContent = JSON.stringify({
      controlVersion: VERSION,
      runtimeDetected: Boolean(runtime),
      running: runtimeStatus ? runtimeStatus.running : false,
      paused: runtimeStatus ? runtimeStatus.paused : false,
      viewLon: runtimeStatus ? Math.round(runtimeStatus.viewLon * 100) / 100 : null,
      viewLat: runtimeStatus ? runtimeStatus.viewLat : null,
      speed: runtimeStatus ? runtimeStatus.speedDegreesPerSecond : null,
      axisVisible: runtimeStatus ? runtimeStatus.axisVisible : null,
      visualPassClaimed: false
    }, null, 2);
  }

  function getStatus() {
    var runtime = getRuntime();
    var runtimeStatus = runtime && typeof runtime.getStatus === "function" ? runtime.getStatus() : null;

    return {
      ok: true,
      active: true,
      VERSION: VERSION,
      version: VERSION,
      CONTRACT_MARKERS: CONTRACT_MARKERS.slice(),
      worldControlPanelActive: true,
      planetOneRotationControlsActive: true,
      panelMounted: state.panelMounted,
      runtimeDetected: Boolean(runtime),
      runtimeStatus: runtimeStatus,
      lastAction: state.lastAction,
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
    mountPanel: mountPanel,
    start: function () { return runtimeAction("start"); },
    pause: function () { return runtimeAction("pause"); },
    resume: function () { return runtimeAction("resume"); },
    reset: function () { return runtimeAction("reset"); },
    setSpeed: function (value) { return runtimeAction("speed", value); },
    setAxisVisible: function (value) { return runtimeAction("axis", value); },
    nudge: function (value) { return runtimeAction("nudge", value); },
    getStatus: getStatus,
    status: status
  };

  global.DGBWorldControl = api;
  global.DGBPlanetOneControl = api;

  function autoMount() {
    mountPanel();
  }

  try {
    global.dispatchEvent(new CustomEvent("dgb:world-control-ready", {
      detail: getStatus()
    }));
  } catch (error) {}

  if (global.document && global.document.readyState === "loading") {
    global.document.addEventListener("DOMContentLoaded", autoMount, { once: true });
  } else {
    global.setTimeout(autoMount, 120);
  }
})(typeof window !== "undefined" ? window : globalThis);

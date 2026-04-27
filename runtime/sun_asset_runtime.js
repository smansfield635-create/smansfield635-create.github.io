/* TNT RENEWAL — /runtime/sun_asset_runtime.js
   SUN ASSET RUNTIME · B7 · STELLAR PLASMA MOUNT

   CONTRACT:
     - Runtime mounts the Sun canvas.
     - Runtime does not draw the Sun through CSS.
     - Canvas owns stellar plasma rendering.
     - Runtime optionally creates controls only when requested.
*/

(function () {
  "use strict";

  var VERSION = "sun-asset-runtime-b7-stellar-plasma";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  function make(tag, className, attrs) {
    var node = document.createElement(tag);

    if (className) node.className = className;

    Object.keys(attrs || {}).forEach(function (key) {
      node.setAttribute(key, attrs[key]);
    });

    return node;
  }

  function numberAttr(node, name, fallback) {
    var value = Number(node.getAttribute(name));
    return Number.isFinite(value) ? value : fallback;
  }

  function boolAttr(node, name, fallback) {
    var value = node.getAttribute(name);

    if (value === "true") return true;
    if (value === "false") return false;

    return fallback;
  }

  function createCanvas(mount) {
    var existing = mount.querySelector("[data-dgb-sun-canvas]");
    var canvas;

    if (existing) return existing;

    mount.textContent = "";
    mount.setAttribute("data-sun-runtime-version", VERSION);
    mount.setAttribute("data-sun-runtime-status", "booting");

    canvas = make("canvas", "", {
      "data-dgb-sun-canvas": "true",
      "aria-label": "Rendered Sun"
    });

    mount.appendChild(canvas);
    return canvas;
  }

  function makeButton(label, action) {
    var button = make("button", "dgb-sun-control-button", {
      type: "button",
      "data-dgb-sun-action": action
    });

    button.textContent = label;
    return button;
  }

  function createControls(mount, instance, config) {
    var existing = mount.parentNode && mount.parentNode.querySelector("[data-dgb-sun-controls]");
    var panel;
    var pause;
    var lower;
    var raise;
    var reset;
    var readout;
    var intensity = config.intensity;

    if (existing) existing.parentNode.removeChild(existing);

    panel = make("div", "dgb-sun-control-panel", {
      "data-dgb-sun-controls": "true"
    });

    pause = makeButton("Pause Sun", "pause");
    lower = makeButton("Lower Heat", "lower");
    raise = makeButton("Raise Heat", "raise");
    reset = makeButton("Reset Sun", "reset");

    readout = make("div", "dgb-sun-control-readout", {
      "data-dgb-sun-readout": "true",
      role: "status",
      "aria-live": "polite"
    });

    function refresh() {
      var state = instance && instance.getState ? instance.getState() : {};
      readout.textContent = "Heat " + Math.round((state.intensity || intensity) * 100) + "%";
      pause.textContent = state.animate === false ? "Resume Sun" : "Pause Sun";
      mount.setAttribute("data-sun-intensity", String(state.intensity || intensity));
    }

    pause.addEventListener("click", function () {
      var state = instance.getState();
      instance.update({ animate: !state.animate });
      refresh();
    });

    lower.addEventListener("click", function () {
      intensity = Math.max(0.55, intensity - 0.07);
      instance.update({ intensity: intensity });
      refresh();
    });

    raise.addEventListener("click", function () {
      intensity = Math.min(1, intensity + 0.07);
      instance.update({ intensity: intensity });
      refresh();
    });

    reset.addEventListener("click", function () {
      intensity = config.intensity;
      instance.update({
        seed: config.seed,
        intensity: intensity,
        animate: config.animate,
        frameRate: config.frameRate
      });
      refresh();
    });

    panel.appendChild(pause);
    panel.appendChild(lower);
    panel.appendChild(raise);
    panel.appendChild(reset);
    panel.appendChild(readout);

    if (mount.parentNode) {
      mount.parentNode.insertBefore(panel, mount.nextSibling);
    } else {
      mount.appendChild(panel);
    }

    refresh();

    return {
      panel: panel,
      refresh: refresh
    };
  }

  function bootMount(mount) {
    var canvas;
    var cssSize;
    var config;
    var instance;
    var controls;

    if (!mount || mount.getAttribute("data-sun-runtime-bound") === VERSION) {
      return null;
    }

    mount.setAttribute("data-sun-runtime-bound", VERSION);
    mount.setAttribute("data-sun-runtime-status", "initializing");

    canvas = createCanvas(mount);

    if (!window.DGBSunCanvas || typeof window.DGBSunCanvas.createCanvasSun !== "function") {
      mount.setAttribute("data-sun-runtime-status", "waiting-for-sun-canvas");

      window.setTimeout(function () {
        mount.removeAttribute("data-sun-runtime-bound");
        bootMount(mount);
      }, 80);

      return null;
    }

    cssSize = numberAttr(mount, "data-sun-size", Math.min(700, Math.max(330, mount.clientWidth || 520)));

    config = {
      seed: Math.floor(numberAttr(mount, "data-sun-seed", 4217)),
      size: cssSize,
      animate: boolAttr(mount, "data-sun-animate", true),
      intensity: Math.max(0.55, Math.min(1, numberAttr(mount, "data-sun-intensity", 0.96))),
      frameRate: Math.max(6, Math.min(14, numberAttr(mount, "data-sun-frame-rate", 10)))
    };

    instance = window.DGBSunCanvas.createCanvasSun(canvas, config);

    mount.setAttribute("data-sun-runtime-status", "strong");
    mount.setAttribute("data-sun-asset-id", "sun-asset-spine-b7-stellar-plasma");
    mount.setAttribute("data-sun-profile", "stellar-plasma-b7");

    if (mount.getAttribute("data-dgb-sun-controls") === "true") {
      controls = createControls(mount, instance, config);
    }

    return {
      mount: mount,
      canvas: canvas,
      instance: instance,
      controls: controls || null
    };
  }

  function bootAll() {
    var mounts = Array.prototype.slice.call(document.querySelectorAll("[data-dgb-sun-mount]"));
    var instances = mounts.map(bootMount).filter(Boolean);

    window.DGBSunAsset.instances = instances;
    return instances;
  }

  window.DGBSunAsset = {
    version: VERSION,
    boot: bootAll,
    bootMount: bootMount,
    instances: []
  };

  ready(bootAll);
})();

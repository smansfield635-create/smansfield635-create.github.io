/* DGB SUN ASSET RUNTIME — SATELLITE OBSERVATIONAL B9
   FILE: /runtime/sun_asset_runtime.js
   PURPOSE:
   - Boot /assets/sun/sun_canvas.js into every [data-dgb-sun-mount].
   - Bind satellite-observational-solar-disc-b9.
   - Avoid old stellar-plasma labels.
   - Keep controls optional and off by default.
*/

(function () {
  "use strict";

  var VERSION = "sun-asset-runtime-b9-satellite-observational-disc";
  var PROFILE = "satellite-observational-solar-disc-b9";

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
    mount.setAttribute("data-sun-profile", PROFILE);
    mount.setAttribute("data-sun-asset-id", "sun-asset-spine-b9-satellite-observational-disc");
    mount.setAttribute("data-cheesecake-slices", "false");
    mount.setAttribute("data-conic-wedges", "false");

    canvas = make("canvas", "", {
      "data-dgb-sun-canvas": "true",
      "data-satellite-sun-canvas": "true",
      "aria-label": "Satellite-style rendered solar disc"
    });

    mount.appendChild(canvas);
    return canvas;
  }

  function removeControls(mount) {
    var existing = mount.parentNode && mount.parentNode.querySelector("[data-dgb-sun-controls]");
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }
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
    var panel;
    var pause;
    var lower;
    var raise;
    var reset;
    var readout;
    var intensity = config.intensity;

    removeControls(mount);

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
      readout.textContent = "Satellite Sun · Heat " + Math.round((state.intensity || intensity) * 100) + "%";
      pause.textContent = state.animate === false ? "Resume Sun" : "Pause Sun";
      mount.setAttribute("data-sun-intensity", String(state.intensity || intensity));
      mount.setAttribute("data-sun-profile", PROFILE);
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

    return { panel: panel, refresh: refresh };
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
    mount.setAttribute("data-sun-profile", PROFILE);
    mount.setAttribute("data-sun-asset-id", "sun-asset-spine-b9-satellite-observational-disc");
    mount.setAttribute("data-visual-target", "satellite observational solar disc");
    mount.setAttribute("data-cheesecake-slices", "false");
    mount.setAttribute("data-conic-wedges", "false");

    canvas = createCanvas(mount);

    if (!window.DGBSunCanvas || typeof window.DGBSunCanvas.createCanvasSun !== "function") {
      mount.setAttribute("data-sun-runtime-status", "waiting-for-sun-canvas");

      window.setTimeout(function () {
        mount.removeAttribute("data-sun-runtime-bound");
        bootMount(mount);
      }, 80);

      return null;
    }

    cssSize = numberAttr(
      mount,
      "data-sun-size",
      Math.min(720, Math.max(340, mount.clientWidth || 560))
    );

    config = {
      seed: Math.floor(numberAttr(mount, "data-sun-seed", 4217)),
      size: cssSize,
      animate: boolAttr(mount, "data-sun-animate", true),
      intensity: Math.max(0.55, Math.min(1, numberAttr(mount, "data-sun-intensity", 0.9))),
      frameRate: Math.max(4, Math.min(12, numberAttr(mount, "data-sun-frame-rate", 8)))
    };

    instance = window.DGBSunCanvas.createCanvasSun(canvas, config);

    mount.setAttribute("data-sun-runtime-status", "strong");
    mount.setAttribute("data-sun-renderer-version", window.DGBSunCanvas.version || "unknown");
    mount.setAttribute("data-sun-profile", PROFILE);

    removeControls(mount);

    if (mount.getAttribute("data-dgb-sun-controls") === "true") {
      controls = createControls(mount, instance, config);
    }

    return {
      mount: mount,
      canvas: canvas,
      instance: instance,
      controls: controls || null,
      profile: PROFILE,
      version: VERSION
    };
  }

  function bootAll() {
    var mounts = Array.prototype.slice.call(document.querySelectorAll("[data-dgb-sun-mount]"));
    var instances = mounts.map(bootMount).filter(Boolean);

    window.DGBSunAsset.instances = instances;
    window.DGBSunAsset.profile = PROFILE;

    return instances;
  }

  window.DGBSunAsset = {
    version: VERSION,
    profile: PROFILE,
    boot: bootAll,
    bootMount: bootMount,
    instances: []
  };

  ready(bootAll);
})();

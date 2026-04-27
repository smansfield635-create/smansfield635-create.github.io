/* TNT RENEWAL — /runtime/earth_asset_runtime.js
   EARTH ASSET RUNTIME · B17 · MINIMAL DOM / NO RING INJECTION

   CONTRACT:
     - Runtime creates only the required Earth canvas shell and controls.
     - Runtime does not inject axis nodes.
     - Runtime does not inject atmosphere nodes.
     - Runtime does not inject diagnostic rings.
     - Runtime preserves DGBEarthAsset global.
     - Runtime preserves Zoom Out / Zoom In / Reset Earth / Pause Spin.
*/

(function () {
  "use strict";

  var VERSION = "earth-asset-runtime-b17-quad-no-rings";

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

  function removeRingNodes(scope) {
    Array.prototype.slice.call(
      scope.querySelectorAll(
        ".dgb-earth-axis,.dgb-earth-atmosphere,[data-dgb-earth-axis],[data-dgb-earth-atmosphere],[data-dgb-earth-ring],[data-dgb-earth-orbit]"
      )
    ).forEach(function (node) {
      if (node && node.parentNode) node.parentNode.removeChild(node);
    });
  }

  function createShell(mount) {
    var existingCanvas = mount.querySelector("[data-dgb-earth-canvas]");
    var stage;
    var tilt;
    var sphere;
    var canvas;

    removeRingNodes(mount);

    if (existingCanvas) return existingCanvas;

    mount.textContent = "";
    mount.setAttribute("data-earth-runtime-status", "booting");
    mount.setAttribute("data-earth-runtime-version", VERSION);
    mount.setAttribute("data-earth-shell", "minimal-no-rings");

    stage = make("div", "dgb-earth-stage", {
      "data-dgb-earth-stage": "minimal-no-rings"
    });

    tilt = make("div", "dgb-earth-tilt", {
      "data-dgb-earth-tilt": "true"
    });

    sphere = make("div", "dgb-earth-sphere", {
      "data-dgb-earth-sphere": "true"
    });

    canvas = make("canvas", "", {
      "data-dgb-earth-canvas": "true",
      "aria-label": "Rendered Earth"
    });

    sphere.appendChild(canvas);
    tilt.appendChild(sphere);
    stage.appendChild(tilt);
    mount.appendChild(stage);

    return canvas;
  }

  function makeButton(label, action) {
    var button = make("button", "dgb-earth-control-button", {
      type: "button",
      "data-dgb-earth-action": action
    });

    button.textContent = label;
    return button;
  }

  function createControls(mount, renderer) {
    var existing = mount.parentNode && mount.parentNode.querySelector("[data-dgb-earth-controls]");
    var panel;
    var zoomOut;
    var zoomIn;
    var reset;
    var pause;
    var readout;

    if (existing) existing.parentNode.removeChild(existing);

    panel = make("div", "dgb-earth-control-panel", {
      "data-dgb-earth-controls": "true"
    });

    zoomOut = makeButton("Zoom Out", "zoom-out");
    zoomIn = makeButton("Zoom In", "zoom-in");
    reset = makeButton("Reset Earth", "reset");
    pause = makeButton("Pause Spin", "pause");

    readout = make("div", "dgb-earth-control-readout", {
      "data-dgb-earth-readout": "true",
      role: "status",
      "aria-live": "polite"
    });

    function refresh() {
      var status = renderer && renderer.getStatus ? renderer.getStatus() : {};
      var zoom = Number(status.zoom || 1);

      readout.textContent = "Zoom " + Math.round(zoom * 100) + "%";
      mount.setAttribute("data-earth-zoom", zoom.toFixed(2));
      pause.textContent = status.paused ? "Resume Spin" : "Pause Spin";
    }

    zoomOut.addEventListener("click", function () {
      if (renderer && renderer.zoomOut) renderer.zoomOut();
      refresh();
    });

    zoomIn.addEventListener("click", function () {
      if (renderer && renderer.zoomIn) renderer.zoomIn();
      refresh();
    });

    reset.addEventListener("click", function () {
      if (renderer && renderer.resetView) renderer.resetView();
      refresh();
    });

    pause.addEventListener("click", function () {
      if (renderer && renderer.toggleSpin) renderer.toggleSpin();
      refresh();
    });

    panel.appendChild(zoomOut);
    panel.appendChild(zoomIn);
    panel.appendChild(reset);
    panel.appendChild(pause);
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
    var renderer;
    var controls;

    if (!mount || mount.getAttribute("data-earth-runtime-bound") === VERSION) {
      return null;
    }

    mount.setAttribute("data-earth-runtime-bound", VERSION);
    mount.setAttribute("data-earth-runtime-status", "initializing");

    canvas = createShell(mount);

    if (!window.DGBEarthCanvas || typeof window.DGBEarthCanvas.create !== "function") {
      mount.setAttribute("data-earth-runtime-status", "waiting-for-canvas-runtime");

      window.setTimeout(function () {
        mount.removeAttribute("data-earth-runtime-bound");
        bootMount(mount);
      }, 80);

      return null;
    }

    renderer = window.DGBEarthCanvas.create({
      mount: mount,
      canvas: canvas,
      assetId: "earth-asset-b5-quad-no-rings",
      surface: "/assets/earth/earth_surface_2048.jpg",
      clouds: "/assets/earth/earth_clouds_2048.jpg",
      targetFrameMs: 42,
      defaultZoom: 1,
      minZoom: 0.72,
      maxZoom: 1.38,
      zoomStep: 0.08,
      cloudAlpha: 0
    });

    if (!renderer) {
      mount.setAttribute("data-earth-runtime-status", "renderer-unavailable");
      return null;
    }

    controls = createControls(mount, renderer);

    mount.setAttribute("data-earth-runtime-status", "strong");
    mount.setAttribute("data-earth-asset-id", "earth-asset-b5-quad-no-rings");
    mount.setAttribute("data-earth-shell", "minimal-no-rings");

    return {
      mount: mount,
      canvas: canvas,
      renderer: renderer,
      controls: controls
    };
  }

  function bootAll() {
    var mounts = Array.prototype.slice.call(document.querySelectorAll("[data-dgb-earth-mount]"));
    var instances = mounts.map(bootMount).filter(Boolean);

    window.DGBEarthAsset.instances = instances;
    return instances;
  }

  window.DGBEarthAsset = {
    version: VERSION,
    boot: bootAll,
    bootMount: bootMount,
    instances: []
  };

  ready(bootAll);
})();

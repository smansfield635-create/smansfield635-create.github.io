/* TNT RENEWAL — /runtime/earth_asset_runtime.js
   EARTH ASSET SPINE · RUNTIME B3

   Owns mounting and controls only:
   - reads manifest
   - finds [data-dgb-earth-mount]
   - creates required Earth shell
   - calls DGBEarthCanvas.create()
   - injects Earth control panel
   - exposes window.DGBEarthAsset
*/

(function () {
  "use strict";

  var VERSION = "earth-asset-runtime-b3";
  var MANIFEST_PATH = "/assets/earth/earth_manifest.json?v=earth-asset-b1";
  var DEFAULT_MANIFEST = {
    asset_id: "earth-asset-b1",
    paths: {
      surface: "/assets/earth/earth_surface_2048.jpg",
      clouds: "/assets/earth/earth_clouds_2048.png",
      fallback_svg: "/assets/earth/earth.svg"
    },
    renderer: {
      render_budget: {
        target_frame_ms: 42,
        slice_count: 220,
        mobile_dpr_cap: 1.5,
        desktop_dpr_cap: 2
      }
    }
  };

  function fetchManifest() {
    return fetch(MANIFEST_PATH, { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) throw new Error("manifest unavailable");
        return response.json();
      })
      .catch(function () {
        return DEFAULT_MANIFEST;
      });
  }

  function ensureShell(mount) {
    var axis;
    var tilt;
    var sphere;
    var canvas;
    var atmosphere;

    if (!mount.querySelector(".dgb-earth-axis")) {
      axis = document.createElement("span");
      axis.className = "dgb-earth-axis";
      axis.setAttribute("aria-hidden", "true");
      mount.appendChild(axis);
    }

    tilt = mount.querySelector(".dgb-earth-tilt");
    if (!tilt) {
      tilt = document.createElement("div");
      tilt.className = "dgb-earth-tilt";
      mount.appendChild(tilt);
    }

    sphere = tilt.querySelector(".dgb-earth-sphere");
    if (!sphere) {
      sphere = document.createElement("div");
      sphere.className = "dgb-earth-sphere";
      sphere.setAttribute("aria-hidden", "true");
      tilt.appendChild(sphere);
    }

    canvas = sphere.querySelector("[data-dgb-earth-canvas]");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.setAttribute("data-dgb-earth-canvas", "");
      canvas.className = "dgb-earth-canvas";
      sphere.appendChild(canvas);
    }

    atmosphere = sphere.querySelector(".dgb-earth-atmosphere");
    if (!atmosphere) {
      atmosphere = document.createElement("div");
      atmosphere.className = "dgb-earth-atmosphere";
      sphere.appendChild(atmosphere);
    }

    return canvas;
  }

  function createButton(label, action) {
    var node = document.createElement("button");
    node.type = "button";
    node.className = "dgb-earth-control-button";
    node.setAttribute("data-earth-control", action);
    node.textContent = label;
    return node;
  }

  function ensureControlPanel(mount, renderer) {
    var host = mount.parentElement || mount;
    var existing = host.querySelector("[data-dgb-earth-controls]");
    var panel = existing || document.createElement("div");
    var zoomOut = createButton("Zoom Out", "zoom-out");
    var zoomIn = createButton("Zoom In", "zoom-in");
    var reset = createButton("Reset Earth", "reset");
    var pause = createButton("Pause Spin", "toggle-spin");
    var readout = document.createElement("span");

    panel.className = "dgb-earth-control-panel";
    panel.setAttribute("data-dgb-earth-controls", "");

    readout.className = "dgb-earth-control-readout";
    readout.setAttribute("data-earth-control-readout", "");
    readout.textContent = "Zoom 100%";

    panel.textContent = "";
    panel.appendChild(zoomOut);
    panel.appendChild(zoomIn);
    panel.appendChild(reset);
    panel.appendChild(pause);
    panel.appendChild(readout);

    function updateReadout() {
      var status = renderer && renderer.getStatus ? renderer.getStatus() : {};
      var zoom = Number.isFinite(status.zoom) ? status.zoom : 1;
      var paused = status.paused === true;

      readout.textContent = "Zoom " + Math.round(zoom * 100) + "%";
      pause.textContent = paused ? "Resume Spin" : "Pause Spin";
    }

    panel.addEventListener("click", function (event) {
      var target = event.target;
      var action;

      if (!target || !target.getAttribute) return;

      action = target.getAttribute("data-earth-control");
      if (!action) return;

      if (action === "zoom-out" && renderer.zoomOut) {
        renderer.zoomOut();
      }

      if (action === "zoom-in" && renderer.zoomIn) {
        renderer.zoomIn();
      }

      if (action === "reset" && renderer.resetView) {
        renderer.resetView();
      }

      if (action === "toggle-spin" && renderer.toggleSpin) {
        renderer.toggleSpin();
      }

      updateReadout();
    });

    if (!existing) {
      host.insertBefore(panel, mount.nextSibling);
    }

    window.setInterval(updateReadout, 500);
    updateReadout();

    return panel;
  }

  function budgetValue(manifest, key, fallback) {
    var budget = manifest &&
      manifest.renderer &&
      manifest.renderer.render_budget &&
      typeof manifest.renderer.render_budget === "object"
      ? manifest.renderer.render_budget
      : {};

    return Number.isFinite(Number(budget[key])) ? Number(budget[key]) : fallback;
  }

  function mountEarth(mount, manifest) {
    var canvas;
    var renderer;

    mount.setAttribute("data-earth-runtime-status", "mounting");
    mount.setAttribute("data-earth-asset-id", manifest.asset_id || "earth-asset-b1");

    canvas = ensureShell(mount);

    if (!window.DGBEarthCanvas || typeof window.DGBEarthCanvas.create !== "function") {
      mount.setAttribute("data-earth-runtime-status", "earth-canvas-loader-missing");
      return null;
    }

    renderer = window.DGBEarthCanvas.create({
      assetId: manifest.asset_id || "earth-asset-b1",
      mount: mount,
      canvas: canvas,
      surface: manifest.paths && manifest.paths.surface ? manifest.paths.surface : DEFAULT_MANIFEST.paths.surface,
      clouds: manifest.paths && manifest.paths.clouds ? manifest.paths.clouds : DEFAULT_MANIFEST.paths.clouds,
      fallback: manifest.paths && manifest.paths.fallback_svg ? manifest.paths.fallback_svg : DEFAULT_MANIFEST.paths.fallback_svg,
      targetFrameMs: budgetValue(manifest, "target_frame_ms", 42),
      sliceCount: budgetValue(manifest, "slice_count", 220),
      mobileDprCap: budgetValue(manifest, "mobile_dpr_cap", 1.5),
      desktopDprCap: budgetValue(manifest, "desktop_dpr_cap", 2)
    });

    if (renderer) {
      ensureControlPanel(mount, renderer);
    }

    return renderer;
  }

  function boot() {
    var mounts = Array.prototype.slice.call(document.querySelectorAll("[data-dgb-earth-mount]"));

    window.DGBEarthAsset = {
      version: VERSION,
      manifest: null,
      renderers: [],
      status: "booting"
    };

    if (!mounts.length) {
      window.DGBEarthAsset.status = "no-earth-mount";
      return;
    }

    fetchManifest().then(function (manifest) {
      window.DGBEarthAsset.manifest = manifest;

      mounts.forEach(function (mount) {
        var renderer = mountEarth(mount, manifest);
        if (renderer) {
          window.DGBEarthAsset.renderers.push(renderer);
        }
      });

      window.DGBEarthAsset.status = window.DGBEarthAsset.renderers.length ? "strong" : "no-renderer";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();

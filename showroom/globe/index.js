(function () {
  "use strict";

  const EARTH_SURFACE = "/assets/earth/earth_surface_2048.jpg";
  const EARTH_CLOUDS = "/assets/earth/earth_clouds_2048.jpg";
  const EARTH_CANVAS_SPINE = "/assets/earth/earth_canvas.js";
  const EARTH_MATERIAL = "/assets/earth/earth_material.css";
  const MOUNT_ID = "showroom-globe-mount";

  const state = {
    api: null,
    spinPaused: false
  };

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function create(tag, attrs, children) {
    const node = document.createElement(tag);

    Object.entries(attrs || {}).forEach(([key, value]) => {
      if (value === null || value === undefined || value === false) return;
      if (key === "className") node.className = value;
      else if (key === "text") node.textContent = value;
      else node.setAttribute(key, String(value));
    });

    (children || []).forEach((child) => {
      if (typeof child === "string") node.appendChild(document.createTextNode(child));
      else if (child) node.appendChild(child);
    });

    return node;
  }

  function renderFailure(root, title, message) {
    root.replaceChildren(
      create("article", {
        className: "fallback-card",
        "data-earth-canvas-spine-failure": "true"
      }, [
        create("p", { className: "kicker", text: "Earth canvas spine failure" }),
        create("h2", { text: title }),
        create("p", { text: message })
      ])
    );

    root.dataset.renderStatus = "error";
  }

  function makeEarthMount() {
    const canvas = create("canvas", {
      "data-dgb-earth-canvas": "true",
      "aria-label": "Centered satellite Earth canvas"
    });

    const earthMount = create("section", {
      "data-dgb-earth-mount": "true",
      "data-earth-canvas-spine": EARTH_CANVAS_SPINE,
      "data-earth-material": EARTH_MATERIAL,
      "data-earth-surface": EARTH_SURFACE,
      "data-earth-clouds": EARTH_CLOUDS,
      "data-earth-standard": "centered-satellite-earth-no-external-rings",
      "data-earth-controller": "/showroom/globe/index.js",
      "aria-label": "Centered satellite Earth"
    }, [
      create("div", { className: "dgb-earth-stage" }, [
        create("div", { className: "dgb-earth-tilt" }, [
          create("div", { className: "dgb-earth-sphere" }, [canvas])
        ])
      ])
    ]);

    const controls = create("div", {
      className: "dgb-earth-control-panel",
      "data-dgb-earth-controls": "true"
    }, [
      create("button", {
        className: "dgb-earth-control-button",
        type: "button",
        "data-earth-action": "zoom-out",
        text: "Zoom Out"
      }),
      create("button", {
        className: "dgb-earth-control-button",
        type: "button",
        "data-earth-action": "zoom-in",
        text: "Zoom In"
      }),
      create("button", {
        className: "dgb-earth-control-button",
        type: "button",
        "data-earth-action": "reset",
        text: "Reset Earth"
      }),
      create("button", {
        className: "dgb-earth-control-button",
        type: "button",
        "data-earth-action": "pause",
        text: "Pause Spin"
      }),
      create("span", {
        className: "dgb-earth-control-readout",
        "data-earth-readout": "true",
        text: "Zoom 100%"
      })
    ]);

    const caption = create("p", {
      className: "dgb-earth-caption",
      text: "EARTH STANDARD · CENTERED SATELLITE EARTH · CANVAS SPHERICAL WRAP"
    });

    const shell = create("section", {
      className: "showroom-earth-canvas-shell",
      "data-showroom-earth-canvas-shell": "true"
    }, [
      earthMount,
      controls,
      caption
    ]);

    return {
      shell,
      earthMount,
      canvas,
      controls
    };
  }

  function syncReadout(root) {
    const readout = qs("[data-earth-readout]", root);
    const pauseButton = qs('[data-earth-action="pause"]', root);

    if (!state.api || typeof state.api.getStatus !== "function") return;

    const status = state.api.getStatus();

    if (readout) {
      readout.textContent = "Zoom " + Math.round(Number(status.zoom || 1) * 100) + "%";
    }

    if (pauseButton) {
      pauseButton.textContent = status.paused ? "Resume Spin" : "Pause Spin";
    }

    root.dataset.renderStatus = status.runtimeStatus || "mounted";
    root.dataset.earthRuntimeStatus = status.runtimeStatus || "mounted";
    root.dataset.earthProjection = status.projection || "full-globe-inverse-orthographic";
    root.dataset.earthCameraMode = status.cameraMode || "full-globe-orbital";
    root.dataset.earthLatticeScope = String(status.latticeScope || 256);
  }

  function bindControls(root) {
    root.querySelectorAll("[data-earth-action]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!state.api) return;

        const action = button.dataset.earthAction;

        if (action === "zoom-in" && typeof state.api.zoomIn === "function") state.api.zoomIn();
        if (action === "zoom-out" && typeof state.api.zoomOut === "function") state.api.zoomOut();
        if (action === "reset" && typeof state.api.resetView === "function") state.api.resetView();
        if (action === "pause" && typeof state.api.toggleSpin === "function") state.api.toggleSpin();

        syncReadout(root);
      });
    });
  }

  function mountEarthCanvas(root) {
    const parts = makeEarthMount();

    root.replaceChildren(parts.shell);
    root.dataset.renderStatus = "mounting";
    root.dataset.renderController = "/showroom/globe/index.js";
    root.dataset.earthCanvasSpine = EARTH_CANVAS_SPINE;
    root.dataset.earthMaterial = EARTH_MATERIAL;
    root.dataset.earthSurface = EARTH_SURFACE;
    root.dataset.earthClouds = EARTH_CLOUDS;
    root.dataset.earthStandard = "centered-satellite-earth-no-external-rings";

    if (!window.DGBEarthCanvas || typeof window.DGBEarthCanvas.create !== "function") {
      renderFailure(
        root,
        "Earth canvas spine is unavailable.",
        "Expected window.DGBEarthCanvas.create from /assets/earth/earth_canvas.js."
      );
      return;
    }

    state.api = window.DGBEarthCanvas.create({
      mount: parts.earthMount,
      canvas: parts.canvas,
      surface: EARTH_SURFACE,
      clouds: EARTH_CLOUDS
    });

    if (!state.api) {
      renderFailure(
        root,
        "Earth canvas did not initialize.",
        "The renderer returned no API object. Check the Earth canvas spine and canvas mount."
      );
      return;
    }

    bindControls(root);
    syncReadout(root);

    window.setTimeout(() => syncReadout(root), 300);
    window.setTimeout(() => syncReadout(root), 1200);

    root.dataset.renderStatus = "complete";
  }

  function init() {
    const root = document.getElementById(MOUNT_ID);
    if (!root) return;

    mountEarthCanvas(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.DGBShowroomGlobe = Object.freeze({
    init,
    state,
    earthSurface: EARTH_SURFACE,
    earthClouds: EARTH_CLOUDS,
    earthCanvasSpine: EARTH_CANVAS_SPINE,
    earthMaterial: EARTH_MATERIAL
  });
})();

(function () {
  "use strict";

  const EARTH_SURFACE = "/assets/earth/earth_surface_2048.jpg";
  const EARTH_CLOUDS = "/assets/earth/earth_clouds_2048.jpg";
  const EARTH_CANVAS_SPINE = "/assets/earth/earth_canvas.js";
  const EARTH_MATERIAL = "/assets/earth/earth_material.css";
  const MOUNT_ID = "showroom-globe-mount";
  const VERSION = "showroom-globe-stack-rebalance-v1";

  const state = {
    api: null,
    bootAttempts: 0,
    maxBootAttempts: 30
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

  function injectStackStyle() {
    if (document.getElementById("showroom-globe-stack-rebalance-style")) return;

    const style = create("style", {
      id: "showroom-globe-stack-rebalance-style",
      text: `
        #${MOUNT_ID} {
          position: relative;
          min-height: 760px;
          display: block;
          padding: 0 18px 22px;
          isolation: isolate;
        }

        .showroom-earth-canvas-shell {
          position: relative;
          width: min(900px, 100%);
          margin: 0 auto;
          display: grid;
          justify-items: center;
          gap: 18px;
        }

        .showroom-earth-clearance {
          height: clamp(318px, 40vh, 390px);
          pointer-events: none;
        }

        .showroom-earth-visual-stack {
          width: 100%;
          display: grid;
          justify-items: center;
          gap: 18px;
          transform: translateY(-22px);
        }

        .showroom-earth-canvas-shell [data-dgb-earth-mount] {
          width: min(760px, 96vw);
          margin: 0 auto;
        }

        .showroom-earth-canvas-shell .dgb-earth-stage {
          width: min(760px, 96vw);
          margin: 0 auto;
        }

        .showroom-earth-canvas-shell .dgb-earth-tilt,
        .showroom-earth-canvas-shell .dgb-earth-sphere {
          margin: 0 auto;
        }

        .showroom-earth-canvas-shell .dgb-earth-sphere {
          transform: translateY(0);
        }

        .showroom-earth-canvas-shell [data-dgb-earth-canvas] {
          display: block;
          max-width: 100%;
        }

        .dgb-earth-control-panel {
          width: min(820px, 100%);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin: 10px auto 0;
        }

        .dgb-earth-control-button,
        .dgb-earth-control-readout {
          min-height: 76px;
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: rgba(0, 3, 9, .64);
          color: rgba(255,255,255,.92);
          font-size: clamp(1.08rem, 3.5vw, 1.76rem);
          font-weight: 850;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.035);
        }

        .dgb-earth-control-button {
          cursor: pointer;
        }

        .dgb-earth-control-button:hover {
          border-color: rgba(242,199,111,.52);
          background: rgba(242,199,111,.13);
        }

        .dgb-earth-control-readout {
          grid-column: 1 / -1;
          color: rgba(211, 215, 238, .86);
          letter-spacing: .03em;
        }

        .dgb-earth-caption {
          width: min(820px, 100%);
          margin: 0 auto;
          color: rgba(255,255,255,.92);
          font-size: clamp(.82rem, 2.6vw, 1.18rem);
          font-weight: 900;
          letter-spacing: .13em;
          line-height: 1.35;
          text-align: center;
          text-transform: uppercase;
        }

        .fallback-card[data-earth-canvas-spine-failure="true"] {
          width: min(760px, 92vw);
          margin: clamp(330px, 42vh, 410px) auto 0;
        }

        @media (max-width: 760px) {
          #${MOUNT_ID} {
            min-height: 720px;
            padding-left: 0;
            padding-right: 0;
            padding-bottom: 16px;
          }

          .showroom-earth-clearance {
            height: 318px;
          }

          .showroom-earth-visual-stack {
            gap: 16px;
            transform: translateY(-18px);
          }

          .showroom-earth-canvas-shell [data-dgb-earth-mount],
          .showroom-earth-canvas-shell .dgb-earth-stage {
            width: min(660px, 100vw);
          }

          .dgb-earth-control-panel {
            width: calc(100vw - 22px);
            gap: 14px;
          }

          .dgb-earth-control-button,
          .dgb-earth-control-readout {
            min-height: 74px;
          }

          .dgb-earth-caption {
            width: calc(100vw - 22px);
          }
        }
      `
    });

    document.head.appendChild(style);
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
      "data-earth-stack": "rebalanced-below-copy",
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

    const visualStack = create("div", {
      className: "showroom-earth-visual-stack",
      "data-showroom-earth-visual-stack": "true"
    }, [
      earthMount,
      controls,
      caption
    ]);

    const shell = create("section", {
      className: "showroom-earth-canvas-shell",
      "data-showroom-earth-canvas-shell": "true",
      "data-showroom-globe-stack": "rebalanced-below-copy",
      "data-showroom-globe-controller-version": VERSION
    }, [
      create("div", {
        className: "showroom-earth-clearance",
        "data-showroom-earth-clearance": "copy-card-clearance",
        "aria-hidden": "true"
      }),
      visualStack
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
    root.dataset.showroomGlobeStack = "rebalanced-below-copy";
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
    injectStackStyle();

    const parts = makeEarthMount();

    root.replaceChildren(parts.shell);
    root.dataset.renderStatus = "mounting";
    root.dataset.renderController = "/showroom/globe/index.js";
    root.dataset.earthCanvasSpine = EARTH_CANVAS_SPINE;
    root.dataset.earthMaterial = EARTH_MATERIAL;
    root.dataset.earthSurface = EARTH_SURFACE;
    root.dataset.earthClouds = EARTH_CLOUDS;
    root.dataset.earthStandard = "centered-satellite-earth-no-external-rings";
    root.dataset.showroomGlobeStack = "rebalanced-below-copy";

    if (!window.DGBEarthCanvas || typeof window.DGBEarthCanvas.create !== "function") {
      if (state.bootAttempts < state.maxBootAttempts) {
        state.bootAttempts += 1;
        window.setTimeout(() => mountEarthCanvas(root), 100);
        return;
      }

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
    earthMaterial: EARTH_MATERIAL,
    version: VERSION
  });
})();

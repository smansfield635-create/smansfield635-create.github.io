(function () {
  "use strict";

  const EARTH_SURFACE = "/assets/earth/earth_surface_2048.jpg";
  const EARTH_CLOUDS = "/assets/earth/earth_clouds_2048.jpg";
  const EARTH_CANVAS_SPINE = "/assets/earth/earth_canvas.js";
  const EARTH_MATERIAL = "/assets/earth/earth_material.css";
  const MOUNT_ID = "showroom-globe-mount";
  const VERSION = "showroom-globe-earth-canvas-generation-3-v1";

  const state = {
    api: null,
    bootAttempts: 0,
    maxBootAttempts: 30,
    bootToken: 0,
    readoutTimer: null
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

  function injectControlStyle() {
    if (document.getElementById("showroom-earth-canvas-controls-style")) return;

    const style = create("style", {
      id: "showroom-earth-canvas-controls-style",
      text: `
        .showroom-earth-canvas-shell {
          position: relative;
          width: min(900px, 100%);
          margin: 0 auto;
          display: grid;
          justify-items: center;
          gap: 14px;
        }

        .showroom-earth-canvas-shell [data-dgb-earth-mount] {
          width: min(760px, 94vw);
          margin: 0 auto;
        }

        .showroom-earth-canvas-shell .dgb-earth-stage {
          width: min(760px, 94vw);
          margin: 0 auto;
        }

        .showroom-earth-canvas-shell .dgb-earth-tilt,
        .showroom-earth-canvas-shell .dgb-earth-sphere {
          margin: 0 auto;
        }

        .showroom-earth-canvas-shell [data-dgb-earth-canvas] {
          display: block;
          max-width: 100%;
          margin: 0 auto;
        }

        .dgb-earth-control-panel {
          width: min(820px, 100%);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin: 10px auto 0;
        }

        .dgb-earth-control-button,
        .dgb-earth-control-readout {
          min-height: 70px;
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: rgba(0, 3, 9, .64);
          color: rgba(255,255,255,.92);
          font-family: inherit;
          font-size: clamp(1rem, 3.2vw, 1.56rem);
          font-weight: 850;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.035);
        }

        .dgb-earth-control-button {
          cursor: pointer;
        }

        .dgb-earth-control-button:hover,
        .dgb-earth-control-button:focus-visible {
          border-color: rgba(242,199,111,.52);
          background: rgba(242,199,111,.13);
          outline: none;
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
          font-size: clamp(.78rem, 2.4vw, 1.06rem);
          font-weight: 900;
          letter-spacing: .12em;
          line-height: 1.35;
          text-align: center;
          text-transform: uppercase;
        }

        .fallback-card[data-earth-canvas-spine-failure="true"] {
          width: min(760px, 92vw);
          margin: 0 auto;
        }

        @media (max-width: 760px) {
          .showroom-earth-canvas-shell [data-dgb-earth-mount],
          .showroom-earth-canvas-shell .dgb-earth-stage {
            width: min(660px, 100vw);
          }

          .dgb-earth-control-panel {
            width: calc(100vw - 22px);
            gap: 12px;
          }

          .dgb-earth-control-button,
          .dgb-earth-control-readout {
            min-height: 66px;
          }

          .dgb-earth-caption {
            width: calc(100vw - 22px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .showroom-earth-canvas-shell *,
          .showroom-earth-canvas-shell *::before,
          .showroom-earth-canvas-shell *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
        }
      `
    });

    document.head.appendChild(style);
  }

  function ensureStylesheet(href) {
    const existing = document.querySelector(`link[href="${href}"]`);
    if (existing) return Promise.resolve(existing);

    return new Promise((resolve) => {
      const link = create("link", {
        rel: "stylesheet",
        href,
        "data-showroom-globe-required-asset": "earth-material"
      });

      link.addEventListener("load", () => resolve(link), { once: true });
      link.addEventListener("error", () => resolve(link), { once: true });

      document.head.appendChild(link);
    });
  }

  function ensureScript(src) {
    if (window.DGBEarthCanvas && typeof window.DGBEarthCanvas.create === "function") {
      return Promise.resolve(window.DGBEarthCanvas);
    }

    const existing = document.querySelector(`script[src="${src}"]`);

    return new Promise((resolve, reject) => {
      if (existing) {
        if (existing.dataset.loaded === "true") {
          resolve(window.DGBEarthCanvas);
          return;
        }

        existing.addEventListener("load", () => resolve(window.DGBEarthCanvas), { once: true });
        existing.addEventListener("error", () => reject(new Error("Failed to load " + src)), { once: true });

        window.setTimeout(() => {
          if (window.DGBEarthCanvas && typeof window.DGBEarthCanvas.create === "function") {
            resolve(window.DGBEarthCanvas);
          }
        }, 0);

        return;
      }

      const script = create("script", {
        src,
        defer: "defer",
        "data-showroom-globe-required-asset": "earth-canvas-spine"
      });

      script.addEventListener(
        "load",
        () => {
          script.dataset.loaded = "true";
          resolve(window.DGBEarthCanvas);
        },
        { once: true }
      );

      script.addEventListener("error", () => reject(new Error("Failed to load " + src)), { once: true });

      document.head.appendChild(script);
    });
  }

  function waitForEarthCanvas() {
    if (window.DGBEarthCanvas && typeof window.DGBEarthCanvas.create === "function") {
      return Promise.resolve(window.DGBEarthCanvas);
    }

    if (state.bootAttempts >= state.maxBootAttempts) {
      return Promise.reject(
        new Error("Expected window.DGBEarthCanvas.create from /assets/earth/earth_canvas.js.")
      );
    }

    state.bootAttempts += 1;

    return new Promise((resolve) => {
      window.setTimeout(resolve, 100);
    }).then(waitForEarthCanvas);
  }

  function clearRuntime() {
    if (state.readoutTimer) {
      window.clearInterval(state.readoutTimer);
      state.readoutTimer = null;
    }

    if (state.api && typeof state.api.destroy === "function") {
      try {
        state.api.destroy();
      } catch (error) {
        console.warn("[Showroom globe destroy failed]", error);
      }
    }

    state.api = null;
  }

  function renderFailure(root, title, message) {
    clearRuntime();

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
    root.dataset.earthRuntimeStatus = "error";
    root.dataset.showroomGlobeControllerVersion = VERSION;
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
      "data-showroom-globe-placement": "generation-3-centered-lift",
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
      "data-showroom-earth-canvas-shell": "true",
      "data-showroom-globe-controller-version": VERSION,
      "data-showroom-globe-placement": "generation-3-centered-lift"
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
    root.dataset.showroomGlobePlacement = "generation-3-centered-lift";
    root.dataset.showroomGlobeControllerVersion = VERSION;
  }

  function bindControls(root) {
    const controls = qs("[data-dgb-earth-controls]", root);
    if (!controls) return;

    controls.addEventListener("click", (event) => {
      const button = event.target.closest("[data-earth-action]");
      if (!button || !state.api) return;

      const action = button.dataset.earthAction;

      if (action === "zoom-in" && typeof state.api.zoomIn === "function") state.api.zoomIn();
      if (action === "zoom-out" && typeof state.api.zoomOut === "function") state.api.zoomOut();
      if (action === "reset" && typeof state.api.resetView === "function") state.api.resetView();
      if (action === "pause" && typeof state.api.toggleSpin === "function") state.api.toggleSpin();

      syncReadout(root);
    });
  }

  async function mountEarthCanvas(root) {
    const token = state.bootToken + 1;
    state.bootToken = token;
    state.bootAttempts = 0;

    clearRuntime();
    injectControlStyle();

    const parts = makeEarthMount();

    root.replaceChildren(parts.shell);
    root.dataset.renderStatus = "loading-assets";
    root.dataset.renderController = "/showroom/globe/index.js";
    root.dataset.earthCanvasSpine = EARTH_CANVAS_SPINE;
    root.dataset.earthMaterial = EARTH_MATERIAL;
    root.dataset.earthSurface = EARTH_SURFACE;
    root.dataset.earthClouds = EARTH_CLOUDS;
    root.dataset.earthStandard = "centered-satellite-earth-no-external-rings";
    root.dataset.showroomGlobePlacement = "generation-3-centered-lift";
    root.dataset.showroomGlobeControllerVersion = VERSION;

    try {
      await ensureStylesheet(EARTH_MATERIAL);
      await ensureScript(EARTH_CANVAS_SPINE);
      await waitForEarthCanvas();

      if (token !== state.bootToken) return;

      state.api = window.DGBEarthCanvas.create({
        mount: parts.earthMount,
        canvas: parts.canvas,
        surface: EARTH_SURFACE,
        clouds: EARTH_CLOUDS
      });

      if (!state.api) {
        throw new Error("The Earth canvas renderer returned no API object.");
      }

      bindControls(root);
      syncReadout(root);

      state.readoutTimer = window.setInterval(() => syncReadout(root), 1000);

      window.setTimeout(() => syncReadout(root), 300);
      window.setTimeout(() => syncReadout(root), 1200);

      root.dataset.renderStatus = "complete";
      root.dataset.earthRuntimeStatus = "complete";
    } catch (error) {
      if (token !== state.bootToken) return;

      renderFailure(
        root,
        "Earth canvas did not initialize.",
        error && error.message
          ? error.message
          : "Check the Earth canvas spine, material stylesheet, canvas mount, and asset paths."
      );
    }
  }

  function init() {
    const root = document.getElementById(MOUNT_ID);
    if (!root) return false;

    mountEarthCanvas(root);
    return true;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
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

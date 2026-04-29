// /showroom/index.js
(function () {
  "use strict";

  const VERSION = "showroom-index-globe-restoration-v1";

  const EARTH_CANVAS_SPINE = "/assets/earth/earth_canvas.js";
  const EARTH_MATERIAL = "/assets/earth/earth_material.css";
  const SHOWROOM_GLOBE_CONTROLLER = "/showroom/globe/index.js";

  const ROOT_ID = "showroom-root";
  const MAIN_ID = "showroom-main";
  const CANVAS_ID = "showroom-canvas";
  const GLOBE_MOUNT_ID = "showroom-globe-mount";

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function create(tag, attrs, children) {
    const node = document.createElement(tag);

    Object.entries(attrs || {}).forEach(([key, value]) => {
      if (value === null || value === undefined || value === false) return;

      if (key === "className") {
        node.className = value;
      } else if (key === "text") {
        node.textContent = value;
      } else {
        node.setAttribute(key, String(value));
      }
    });

    (children || []).forEach((child) => {
      if (typeof child === "string") {
        node.appendChild(document.createTextNode(child));
      } else if (child) {
        node.appendChild(child);
      }
    });

    return node;
  }

  function writeReceipts(status) {
    const root = document.getElementById(ROOT_ID);
    const mount = document.getElementById(GLOBE_MOUNT_ID);

    if (root) {
      root.dataset.showroomIndexVersion = VERSION;
      root.dataset.showroomGlobeRestoration = status;
      root.dataset.showroomCardGlobeHandoff = "active";
      root.dataset.demoUniverseCardPreview = "active";
      root.dataset.showroomCardEarthSync = "active";
      root.dataset.showroomCardEarthColor = "synced";
      root.dataset.showroomCardVisualTruth = "pending";
    }

    if (mount) {
      mount.dataset.showroomIndexVersion = VERSION;
      mount.dataset.showroomGlobeRestoration = status;
      mount.dataset.showroomGlobeController = SHOWROOM_GLOBE_CONTROLLER;
      mount.dataset.earthCanvasSpine = EARTH_CANVAS_SPINE;
      mount.dataset.earthMaterial = EARTH_MATERIAL;
      mount.dataset.showroomCardGlobeHandoff = "active";
    }
  }

  function ensureGlobeMount() {
    const existing = document.getElementById(GLOBE_MOUNT_ID);
    if (existing) return existing;

    const visualPanel = qs(".visual-panel") || qs(".showroom-globe");
    const main = document.getElementById(MAIN_ID);

    const mount = create("div", {
      id: GLOBE_MOUNT_ID,
      className: "showroom-globe-mount showroom-globe showroom-earth-color showroom-earth-clouds showroom-earth-atmosphere",
      "data-showroom-globe-mount": "true",
      "data-showroom-globe-placement": "generation-3-centered-lift",
      "data-showroom-card-globe-handoff": "active",
      "data-showroom-card-earth-color": "synced",
      "data-demo-universe-card-preview": "active",
      "aria-label": "Showroom Earth canvas mount"
    });

    if (visualPanel) {
      visualPanel.appendChild(mount);
      return mount;
    }

    if (main) {
      main.prepend(mount);
      return mount;
    }

    document.body.appendChild(mount);
    return mount;
  }

  function ensureStylesheet(href, id) {
    const existing = document.querySelector(`link[href="${href}"]`);
    if (existing) return Promise.resolve(existing);

    return new Promise((resolve) => {
      const link = create("link", {
        id,
        rel: "stylesheet",
        href,
        "data-showroom-restoration-asset": "earth-material"
      });

      link.addEventListener("load", () => resolve(link), { once: true });
      link.addEventListener("error", () => resolve(link), { once: true });

      document.head.appendChild(link);
    });
  }

  function loadClassicScript(src, id, globalReadyCheck) {
    if (typeof globalReadyCheck === "function" && globalReadyCheck()) {
      return Promise.resolve(null);
    }

    const existing = document.querySelector(`script[src="${src}"]`);

    return new Promise((resolve, reject) => {
      if (existing) {
        if (existing.dataset.loaded === "true" || (typeof globalReadyCheck === "function" && globalReadyCheck())) {
          resolve(existing);
          return;
        }

        existing.addEventListener("load", () => resolve(existing), { once: true });
        existing.addEventListener(
          "error",
          () => reject(new Error("Failed to load script: " + src)),
          { once: true }
        );

        window.setTimeout(() => {
          if (typeof globalReadyCheck === "function" && globalReadyCheck()) {
            resolve(existing);
          }
        }, 0);

        return;
      }

      const script = create("script", {
        id,
        src,
        "data-showroom-restoration-script": "true"
      });

      script.async = false;

      script.addEventListener(
        "load",
        () => {
          script.dataset.loaded = "true";
          resolve(script);
        },
        { once: true }
      );

      script.addEventListener(
        "error",
        () => reject(new Error("Failed to load script: " + src)),
        { once: true }
      );

      document.body.appendChild(script);
    });
  }

  function renderRestorationFailure(error) {
    const mount = ensureGlobeMount();

    mount.replaceChildren(
      create("article", {
        className: "fallback-card showroom-fallback",
        "data-showroom-globe-restoration-failure": "true"
      }, [
        create("p", { className: "kicker", text: "Showroom globe restoration failure" }),
        create("h2", { text: "Existing globe subsystem did not mount." }),
        create("p", {
          text: String(
            error && error.message
              ? error.message
              : "Check /assets/earth/earth_canvas.js and /showroom/globe/index.js."
          )
        }),
        create("p", {}, [
          create("a", {
            href: "/showroom/globe/",
            text: "Open Demo Universe Earth"
          })
        ])
      ])
    );

    mount.dataset.renderStatus = "error";
    writeReceipts("failed");
  }

  function drawBackgroundCanvas() {
    const canvas = document.getElementById(CANVAS_ID);
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    const width = Math.max(320, Math.floor(rect.width || canvas.clientWidth || 900));
    const height = Math.max(320, Math.floor(rect.height || canvas.clientHeight || 560));

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);

    const gradient = context.createRadialGradient(
      width * 0.5,
      height * 0.5,
      width * 0.1,
      width * 0.5,
      height * 0.5,
      width * 0.7
    );

    gradient.addColorStop(0, "rgba(116, 184, 255, 0.16)");
    gradient.addColorStop(0.48, "rgba(8, 20, 38, 0.34)");
    gradient.addColorStop(1, "rgba(2, 5, 12, 0.98)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  }

  async function restoreGlobe() {
    try {
      const mount = ensureGlobeMount();

      mount.dataset.renderStatus = "restoring";
      mount.dataset.showroomGlobeRestoration = "active";
      mount.dataset.showroomGlobeController = SHOWROOM_GLOBE_CONTROLLER;

      writeReceipts("restoring");
      drawBackgroundCanvas();

      await ensureStylesheet(EARTH_MATERIAL, "showroom-earth-material-css");

      await loadClassicScript(
        EARTH_CANVAS_SPINE,
        "showroom-earth-canvas-spine-js",
        () => window.DGBEarthCanvas && typeof window.DGBEarthCanvas.create === "function"
      );

      await loadClassicScript(
        SHOWROOM_GLOBE_CONTROLLER,
        "showroom-globe-controller-js",
        () => window.DGBShowroomGlobe && typeof window.DGBShowroomGlobe.init === "function"
      );

      if (!window.DGBShowroomGlobe || typeof window.DGBShowroomGlobe.init !== "function") {
        throw new Error("Expected window.DGBShowroomGlobe.init from /showroom/globe/index.js.");
      }

      window.DGBShowroomGlobe.init();

      mount.dataset.renderStatus = "restored";
      writeReceipts("restored");
    } catch (error) {
      console.error("[Showroom globe restoration failure]", error);
      renderRestorationFailure(error);
    }
  }

  function init() {
    restoreGlobe();

    window.addEventListener("resize", () => {
      window.requestAnimationFrame(drawBackgroundCanvas);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  window.DGBShowroomIndex = Object.freeze({
    version: VERSION,
    restoreGlobe,
    earthCanvasSpine: EARTH_CANVAS_SPINE,
    earthMaterial: EARTH_MATERIAL,
    showroomGlobeController: SHOWROOM_GLOBE_CONTROLLER
  });
})();

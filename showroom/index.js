// /showroom/index.js
(function () {
  "use strict";

  const VERSION = "showroom-generation-2-active-globe-restoration-v1";

  const ROOT_ID = "showroom-root";
  const MAIN_ID = "showroom-main";
  const CANVAS_ID = "showroom-canvas";
  const GLOBE_MOUNT_ID = "showroom-globe-mount";

  const EARTH_CANVAS_SPINE = "/assets/earth/earth_canvas.js";
  const EARTH_MATERIAL = "/assets/earth/earth_material.css";
  const SHOWROOM_GLOBE_CONTROLLER = "/showroom/globe/index.js";
  const SHOWROOM_GLOBE_ROUTE = "/showroom/globe/";

  let fallbackTimer = null;

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

  function setDataset(node, values) {
    if (!node) return;

    Object.entries(values).forEach(([key, value]) => {
      node.dataset[key] = String(value);
    });
  }

  function writeGeneration2Receipts(status) {
    const root = document.getElementById(ROOT_ID);
    const main = document.getElementById(MAIN_ID);
    const mount = document.getElementById(GLOBE_MOUNT_ID);

    const receipts = {
      showroomIndexVersion: VERSION,
      showroomGeneration: "generation-2-active-globe",
      generation2ActiveGlobe: status,
      generation3BlockedUntilG2Pass: "true",
      showroomCardEarthSync: "active",
      showroomCardEarthColor: "synced",
      showroomCardGlobeHandoff: "active",
      showroomCardVisualTruth: "pending",
      demoUniverseCardPreview: "active",
      showroomMobileLayoutHardened: "true"
    };

    setDataset(root, receipts);
    setDataset(main, receipts);
    setDataset(mount, {
      ...receipts,
      showroomGlobeController: SHOWROOM_GLOBE_CONTROLLER,
      earthCanvasSpine: EARTH_CANVAS_SPINE,
      earthMaterial: EARTH_MATERIAL,
      showroomGlobeRoute: SHOWROOM_GLOBE_ROUTE
    });
  }

  function ensureGlobeMount() {
    const existing = document.getElementById(GLOBE_MOUNT_ID);
    if (existing) return existing;

    const visualPanel =
      qs(".visual-panel") ||
      qs(".showroom-globe") ||
      qs("[data-showroom-globe='active']");

    const main = document.getElementById(MAIN_ID);

    const mount = create("div", {
      id: GLOBE_MOUNT_ID,
      className:
        "showroom-globe-mount showroom-globe showroom-earth-color showroom-earth-clouds showroom-earth-atmosphere",
      "data-showroom-globe-mount": "true",
      "data-showroom-globe-placement": "generation-2-active-globe",
      "data-showroom-card-globe-handoff": "active",
      "data-showroom-card-earth-color": "synced",
      "data-demo-universe-card-preview": "active",
      "aria-label": "Showroom active Earth globe mount"
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
        "data-showroom-generation-2-asset": "earth-material"
      });

      link.addEventListener("load", () => resolve(link), { once: true });
      link.addEventListener("error", () => resolve(link), { once: true });

      document.head.appendChild(link);
    });
  }

  function loadClassicScript(src, id, readyCheck) {
    if (typeof readyCheck === "function" && readyCheck()) {
      return Promise.resolve(null);
    }

    const existing = document.querySelector(`script[src="${src}"]`);

    return new Promise((resolve, reject) => {
      if (existing) {
        if (existing.dataset.loaded === "true" || (typeof readyCheck === "function" && readyCheck())) {
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
          if (typeof readyCheck === "function" && readyCheck()) {
            resolve(existing);
          }
        }, 0);

        return;
      }

      const script = create("script", {
        id,
        src,
        "data-showroom-generation-2-script": "true"
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

  function drawSupportCanvas() {
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
      height * 0.48,
      width * 0.1,
      width * 0.5,
      height * 0.48,
      width * 0.72
    );

    gradient.addColorStop(0, "rgba(116, 184, 255, 0.16)");
    gradient.addColorStop(0.5, "rgba(8, 20, 38, 0.34)");
    gradient.addColorStop(1, "rgba(2, 5, 12, 0.98)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  }

  function mountHasVisibleGlobeContent(mount) {
    if (!mount) return false;

    const canvas = mount.querySelector("[data-dgb-earth-canvas], canvas");
    const earthStage = mount.querySelector("[data-dgb-earth-mount], .dgb-earth-stage, .dgb-earth-sphere");
    const iframe = mount.querySelector("iframe[data-showroom-generation-2-globe-frame='true']");

    return Boolean(canvas || earthStage || iframe);
  }

  function renderActiveRouteFrameFallback(reason) {
    const mount = ensureGlobeMount();

    if (fallbackTimer) {
      window.clearTimeout(fallbackTimer);
      fallbackTimer = null;
    }

    mount.replaceChildren(
      create("section", {
        className: "showroom-generation-2-globe-frame-shell",
        "data-showroom-generation-2-frame-shell": "true",
        "data-showroom-globe-restoration-fallback": "active"
      }, [
        create("iframe", {
          src: SHOWROOM_GLOBE_ROUTE,
          title: "Demo Universe Earth active globe",
          loading: "eager",
          "data-showroom-generation-2-globe-frame": "true",
          "aria-label": "Demo Universe Earth active globe"
        }),
        create("p", {
          className: "dgb-earth-caption",
          text: "GENERATION 2 · ACTIVE GLOBE · DEMO UNIVERSE EARTH"
        }),
        create("p", {
          className: "showroom-generation-2-fallback-note",
          text:
            "The parent Showroom is displaying the live Demo Universe Earth route inside the Showroom panel."
        }),
        create("p", {}, [
          create("a", {
            href: SHOWROOM_GLOBE_ROUTE,
            text: "Open Demo Universe Earth"
          })
        ])
      ])
    );

    mount.dataset.renderStatus = "generation-2-frame-restored";
    mount.dataset.generation2ActiveGlobe = "frame-restored";
    mount.dataset.restorationReason = String(reason || "direct globe mount did not visibly paint");

    writeGeneration2Receipts("frame-restored");
  }

  function injectFrameFallbackStyle() {
    if (document.getElementById("showroom-generation-2-frame-style")) return;

    const style = create("style", {
      id: "showroom-generation-2-frame-style",
      text: `
        .showroom-generation-2-globe-frame-shell {
          position: relative;
          z-index: 10;
          width: min(820px, 100%);
          margin: 0 auto;
          display: grid;
          justify-items: center;
          gap: 12px;
        }

        .showroom-generation-2-globe-frame-shell iframe {
          width: min(760px, 94vw);
          height: clamp(360px, 64vw, 620px);
          border: 1px solid rgba(245, 199, 107, 0.34);
          border-radius: 28px;
          background: #02050c;
          box-shadow: 0 28px 80px rgba(0, 0, 0, 0.42);
        }

        .showroom-generation-2-fallback-note {
          width: min(760px, 94vw);
          margin: 0 auto;
          color: rgba(246, 239, 224, 0.76);
          font-size: 0.92rem;
          line-height: 1.45;
          text-align: center;
        }

        .showroom-generation-2-globe-frame-shell a {
          display: inline-flex;
          border: 1px solid rgba(245, 199, 107, 0.42);
          border-radius: 999px;
          padding: 0.62rem 0.9rem;
          color: inherit;
          background: rgba(255, 255, 255, 0.055);
          text-decoration: none;
          font-weight: 800;
        }

        .showroom-generation-2-globe-frame-shell a:hover,
        .showroom-generation-2-globe-frame-shell a:focus-visible {
          color: #080d18;
          background: #f5c76b;
          outline: none;
        }

        @media (max-width: 620px) {
          .showroom-generation-2-globe-frame-shell iframe {
            width: calc(100vw - 40px);
            height: 520px;
          }
        }
      `
    });

    document.head.appendChild(style);
  }

  function renderFailure(error) {
    const mount = ensureGlobeMount();

    mount.replaceChildren(
      create("article", {
        className: "fallback-card showroom-fallback",
        "data-showroom-generation-2-restoration-failure": "true"
      }, [
        create("p", { className: "kicker", text: "Generation 2 active globe restoration failure" }),
        create("h2", { text: "Active globe did not mount." }),
        create("p", {
          text: String(
            error && error.message
              ? error.message
              : "Check the parent Showroom mount and the Demo Universe Earth route."
          )
        }),
        create("p", {}, [
          create("a", {
            href: SHOWROOM_GLOBE_ROUTE,
            text: "Open Demo Universe Earth"
          })
        ])
      ])
    );

    mount.dataset.renderStatus = "generation-2-failed";
    writeGeneration2Receipts("failed");
  }

  async function attemptDirectGlobeMount() {
    const mount = ensureGlobeMount();

    mount.dataset.renderStatus = "generation-2-restoring";
    mount.dataset.generation2ActiveGlobe = "restoring";

    writeGeneration2Receipts("restoring");

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

    fallbackTimer = window.setTimeout(() => {
      const currentMount = ensureGlobeMount();

      if (!mountHasVisibleGlobeContent(currentMount)) {
        renderActiveRouteFrameFallback("direct globe mount produced no visible globe content");
        return;
      }

      currentMount.dataset.renderStatus = "generation-2-direct-restored";
      currentMount.dataset.generation2ActiveGlobe = "direct-restored";
      writeGeneration2Receipts("direct-restored");
    }, 1600);
  }

  async function restoreGeneration2ActiveGlobe() {
    injectFrameFallbackStyle();
    drawSupportCanvas();

    try {
      await attemptDirectGlobeMount();
    } catch (error) {
      console.warn("[Generation 2 direct globe mount failed]", error);
      renderActiveRouteFrameFallback(error.message || "direct globe mount failed");
    }
  }

  function bindResize() {
    let resizeFrame = 0;

    window.addEventListener("resize", () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(drawSupportCanvas);
    });
  }

  function init() {
    restoreGeneration2ActiveGlobe();
    bindResize();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  window.DGBShowroomIndex = Object.freeze({
    version: VERSION,
    restoreGeneration2ActiveGlobe,
    target: "/showroom/index.js",
    generation1: "layout-established",
    generation2: "active-globe",
    generation3: "shadow-detail-blocked-until-generation-2",
    earthCanvasSpine: EARTH_CANVAS_SPINE,
    earthMaterial: EARTH_MATERIAL,
    showroomGlobeController: SHOWROOM_GLOBE_CONTROLLER,
    showroomGlobeRoute: SHOWROOM_GLOBE_ROUTE
  });
})();

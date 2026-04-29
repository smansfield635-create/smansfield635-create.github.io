/*
  /showroom/index.js
  SHOWROOM_GENERATION_2_ACTIVE_GLOBE_INDEX_JS_EXECUTION_REPAIR_TNT_v1

  Purpose:
  Restore an executable parent Showroom controller and render Generation 2:
  an active visible globe on /showroom/.

  Scope:
  - Touches /showroom/index.js only.
  - Does not rewrite /showroom/globe/index.js.
  - Does not rewrite /assets/earth/*.
  - Does not rewrite /gauges/.
  - Does not claim Generation 3.
*/

(function () {
  "use strict";

  const VERSION = "showroom-generation-2-active-globe-index-js-execution-repair-v1";

  const ROOT_ID = "showroom-root";
  const MAIN_ID = "showroom-main";
  const CANVAS_ID = "showroom-canvas";
  const GLOBE_MOUNT_ID = "showroom-globe-mount";

  const EARTH_SURFACE = "/assets/earth/earth_surface_2048.jpg";
  const EARTH_CLOUDS = "/assets/earth/earth_clouds_2048.jpg";
  const SHOWROOM_GLOBE_ROUTE = "/showroom/globe/";

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

  function ensureStyle() {
    if (document.getElementById("showroom-generation-2-active-globe-style")) return;

    const style = create("style", {
      id: "showroom-generation-2-active-globe-style",
      text: `
        #showroom-globe-mount {
          position: relative !important;
          z-index: 30 !important;
          width: min(820px, 100%) !important;
          min-height: clamp(430px, 62vw, 680px) !important;
          margin: 0 auto !important;
          display: grid !important;
          place-items: center !important;
          overflow: visible !important;
          transform: none !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        .showroom-generation-2-shell {
          position: relative;
          width: 100%;
          min-height: clamp(430px, 62vw, 680px);
          display: grid;
          place-items: center;
          gap: 14px;
          padding: clamp(18px, 3vw, 34px);
        }

        .showroom-generation-2-orbit {
          position: absolute;
          left: 50%;
          top: 48%;
          width: min(690px, 96vw);
          height: min(180px, 28vw);
          border: 1px solid rgba(116, 184, 255, 0.28);
          border-radius: 50%;
          transform: translate(-50%, -50%) rotate(-10deg);
          pointer-events: none;
        }

        .showroom-generation-2-active-globe {
          position: relative;
          width: min(520px, 82vw);
          aspect-ratio: 1;
          border-radius: 50%;
          overflow: hidden;
          background: #0a2a50;
          box-shadow:
            inset -42px -28px 64px rgba(0, 0, 0, 0.46),
            inset 18px 12px 28px rgba(255, 255, 255, 0.10),
            0 0 44px rgba(116, 184, 255, 0.30),
            0 0 110px rgba(245, 199, 107, 0.11);
          isolation: isolate;
        }

        .showroom-generation-2-active-globe img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          user-select: none;
          pointer-events: none;
        }

        .showroom-generation-2-earth-surface {
          z-index: 1;
          transform: scale(1.04);
          filter: saturate(1.12) contrast(1.05);
        }

        .showroom-generation-2-earth-clouds {
          z-index: 2;
          opacity: 0.36;
          mix-blend-mode: screen;
          transform: scale(1.05);
        }

        .showroom-generation-2-light {
          position: absolute;
          inset: 0;
          z-index: 3;
          border-radius: 50%;
          background:
            radial-gradient(circle at 33% 24%, rgba(255,255,255,.26), transparent 0 14%, transparent 28%),
            linear-gradient(115deg, rgba(255,255,255,.14), transparent 34%, rgba(0,0,0,.24) 68%, rgba(0,0,0,.50));
          pointer-events: none;
        }

        .showroom-generation-2-rim {
          position: absolute;
          inset: -1px;
          z-index: 4;
          border-radius: 50%;
          border: 1px solid rgba(246, 239, 224, 0.24);
          box-shadow:
            inset 0 0 28px rgba(116, 184, 255, 0.20),
            0 0 22px rgba(116, 184, 255, 0.22);
          pointer-events: none;
        }

        .showroom-generation-2-caption {
          margin: 0;
          color: rgba(255,255,255,.90);
          font-size: clamp(.78rem, 2.4vw, 1.05rem);
          font-weight: 900;
          letter-spacing: .12em;
          line-height: 1.35;
          text-align: center;
          text-transform: uppercase;
        }

        .showroom-generation-2-link {
          display: inline-flex;
          border: 1px solid rgba(245,199,107,.42);
          border-radius: 999px;
          padding: .62rem .9rem;
          color: inherit;
          background: rgba(255,255,255,.055);
          text-decoration: none;
          font-weight: 800;
        }

        .showroom-generation-2-link:hover,
        .showroom-generation-2-link:focus-visible {
          color: #080d18;
          background: #f5c76b;
          outline: none;
        }

        @media (prefers-reduced-motion: no-preference) {
          .showroom-generation-2-earth-surface {
            animation: showroomG2EarthSpin 34s linear infinite;
          }

          .showroom-generation-2-earth-clouds {
            animation: showroomG2CloudSpin 52s linear infinite;
          }
        }

        @keyframes showroomG2EarthSpin {
          from { transform: scale(1.04) translateX(0); }
          50% { transform: scale(1.04) translateX(-3.5%); }
          to { transform: scale(1.04) translateX(0); }
        }

        @keyframes showroomG2CloudSpin {
          from { transform: scale(1.05) translateX(0); }
          50% { transform: scale(1.05) translateX(4%); }
          to { transform: scale(1.05) translateX(0); }
        }

        @media (max-width: 620px) {
          #showroom-globe-mount {
            min-height: 430px !important;
          }

          .showroom-generation-2-shell {
            min-height: 430px;
            padding: 16px;
          }

          .showroom-generation-2-active-globe {
            width: min(390px, 84vw);
          }

          .showroom-generation-2-orbit {
            width: min(470px, 94vw);
            height: 110px;
          }
        }
      `
    });

    document.head.appendChild(style);
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
      "aria-label": "Showroom Generation 2 active Earth globe"
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

  function writeGenerationReceipts(status) {
    const root = document.getElementById(ROOT_ID);
    const main = document.getElementById(MAIN_ID);
    const mount = document.getElementById(GLOBE_MOUNT_ID);

    const receipts = {
      showroomIndexVersion: VERSION,
      generation1LayoutEstablished: "true",
      showroomGeneration: "generation-2-active-globe",
      generation2ActiveGlobe: status,
      generation3: "shadow-detail-blocked-until-generation-2-pass",
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
      earthSurface: EARTH_SURFACE,
      earthClouds: EARTH_CLOUDS,
      showroomGlobeRoute: SHOWROOM_GLOBE_ROUTE
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

  function renderGeneration2Globe() {
    ensureStyle();

    const mount = ensureGlobeMount();

    mount.replaceChildren(
      create("section", {
        className: "showroom-generation-2-shell",
        "data-showroom-generation-2-shell": "true",
        "data-generation-2-active-globe": "visible"
      }, [
        create("div", {
          className: "showroom-generation-2-orbit",
          "aria-hidden": "true"
        }),
        create("div", {
          className: "showroom-generation-2-active-globe",
          role: "img",
          "aria-label": "Active visible Earth globe restored for Showroom Generation 2"
        }, [
          create("img", {
            className: "showroom-generation-2-earth-surface",
            src: EARTH_SURFACE,
            alt: "",
            decoding: "async",
            loading: "eager",
            "aria-hidden": "true"
          }),
          create("img", {
            className: "showroom-generation-2-earth-clouds",
            src: EARTH_CLOUDS,
            alt: "",
            decoding: "async",
            loading: "eager",
            "aria-hidden": "true"
          }),
          create("span", {
            className: "showroom-generation-2-light",
            "aria-hidden": "true"
          }),
          create("span", {
            className: "showroom-generation-2-rim",
            "aria-hidden": "true"
          })
        ]),
        create("p", {
          className: "showroom-generation-2-caption",
          text: "GENERATION 2 · ACTIVE GLOBE · EARTH SURFACE RESTORED"
        }),
        create("a", {
          className: "showroom-generation-2-link",
          href: SHOWROOM_GLOBE_ROUTE,
          text: "Open Demo Universe Earth"
        })
      ])
    );

    mount.dataset.renderStatus = "generation-2-active-globe-visible";
    mount.dataset.generation2ActiveGlobe = "visible";

    writeGenerationReceipts("visible");
    drawSupportCanvas();
  }

  function bindResize() {
    let resizeFrame = 0;

    window.addEventListener("resize", () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(drawSupportCanvas);
    });
  }

  function init() {
    renderGeneration2Globe();
    bindResize();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  window.DGBShowroomIndex = Object.freeze({
    version: VERSION,
    generation1: "layout-established",
    generation2: "active-globe",
    generation3: "shadow-detail-blocked",
    restoreGeneration2Globe: renderGeneration2Globe,
    earthSurface: EARTH_SURFACE,
    earthClouds: EARTH_CLOUDS,
    showroomGlobeRoute: SHOWROOM_GLOBE_ROUTE
  });
})();

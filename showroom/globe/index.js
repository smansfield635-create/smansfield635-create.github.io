(function () {
  "use strict";

  const REQUIRED_EARTH_ASSET = "/assets/earth/showroom-earth.png";
  const MOUNT_ID = "showroom-globe-mount";

  const state = {
    zoom: 1,
    spinPaused: false,
    dragActive: false,
    dragStartX: 0,
    dragStartY: 0,
    rotateX: -10,
    rotateY: 0
  };

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
      if (typeof child === "string") node.appendChild(document.createTextNode(child));
      else if (child) node.appendChild(child);
    });

    return node;
  }

  function injectStyle() {
    if (document.getElementById("showroom-orbital-earth-required-style")) return;

    const style = create("style", {
      id: "showroom-orbital-earth-required-style",
      text: `
        #${MOUNT_ID} {
          position: relative;
          min-height: 900px;
          display: grid;
          place-items: center;
          padding: 210px 18px 42px;
          isolation: isolate;
        }

        .dgb-orbital-earth {
          position: relative;
          width: min(860px, 92vw);
          display: grid;
          justify-items: center;
          gap: 22px;
          perspective: 1200px;
        }

        .dgb-orbital-field {
          position: relative;
          width: min(720px, 88vw);
          aspect-ratio: 1 / 1;
          display: grid;
          place-items: center;
          isolation: isolate;
        }

        .dgb-orbital-field::before {
          content: "";
          position: absolute;
          inset: 5%;
          z-index: -3;
          border-radius: 999px;
          background:
            radial-gradient(circle at 40% 32%, rgba(255,255,255,.20), transparent 18%),
            radial-gradient(circle at 50% 52%, rgba(72,126,255,.28), transparent 58%);
          filter: blur(28px);
          opacity: .82;
        }

        .dgb-orbital-field::after {
          content: "";
          position: absolute;
          inset: -8%;
          z-index: -4;
          background:
            radial-gradient(circle at 88% 3%, rgba(176,79,45,.35), transparent 12%),
            radial-gradient(circle at 50% 50%, rgba(52,108,205,.14), transparent 55%);
          pointer-events: none;
        }

        .dgb-background-mars {
          position: absolute;
          right: -12%;
          top: -48%;
          width: 255px;
          aspect-ratio: 1;
          border-radius: 999px;
          background:
            radial-gradient(circle at 34% 28%, rgba(255,221,162,.34), transparent 15%),
            radial-gradient(circle at 44% 44%, rgba(148,69,42,.72), rgba(68,28,30,.36) 62%, transparent 74%);
          opacity: .48;
          filter: blur(.2px);
        }

        .dgb-earth-shell {
          position: relative;
          width: calc(100% * var(--earth-zoom, 1));
          aspect-ratio: 1 / 1;
          border-radius: 999px;
          overflow: hidden;
          cursor: grab;
          transform-style: preserve-3d;
          transform:
            rotateX(var(--earth-rotate-x, -10deg))
            rotateY(var(--earth-rotate-y, 0deg));
          filter:
            drop-shadow(0 38px 36px rgba(0,0,0,.58))
            drop-shadow(0 0 44px rgba(100,156,255,.25));
          background: #02050a;
        }

        .dgb-earth-shell:active {
          cursor: grabbing;
        }

        .dgb-earth-shell::before {
          content: "";
          position: absolute;
          inset: -2%;
          z-index: 3;
          border-radius: inherit;
          pointer-events: none;
          background:
            radial-gradient(circle at 31% 23%, rgba(255,255,255,.32), transparent 18%),
            radial-gradient(circle at 73% 50%, transparent 36%, rgba(0,0,0,.66) 78%),
            linear-gradient(100deg, rgba(255,255,255,.10), transparent 28%, rgba(0,0,0,.20) 70%);
          mix-blend-mode: screen;
          opacity: .78;
        }

        .dgb-earth-shell::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 4;
          border-radius: inherit;
          pointer-events: none;
          box-shadow:
            inset -42px -18px 72px rgba(0,0,0,.72),
            inset 18px 12px 38px rgba(255,255,255,.12),
            inset 0 0 0 1px rgba(255,255,255,.08);
        }

        .dgb-earth-texture {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          border-radius: inherit;
          user-select: none;
          -webkit-user-drag: none;
          transform-origin: center;
        }

        .dgb-earth-spin-active .dgb-earth-texture {
          animation: dgbEarthTextureSpin 52s linear infinite;
        }

        .dgb-earth-spin-paused .dgb-earth-texture {
          animation-play-state: paused;
        }

        @keyframes dgbEarthTextureSpin {
          from { transform: rotate(0deg) scale(1.025); }
          to { transform: rotate(360deg) scale(1.025); }
        }

        .dgb-earth-controls {
          width: min(780px, 100%);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .dgb-earth-button,
        .dgb-earth-readout {
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 999px;
          min-height: 76px;
          display: grid;
          place-items: center;
          background: rgba(0, 3, 9, .64);
          color: rgba(255,255,255,.92);
          font-size: clamp(1.08rem, 3.5vw, 1.76rem);
          font-weight: 850;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.035);
        }

        .dgb-earth-button {
          cursor: pointer;
        }

        .dgb-earth-button:hover {
          border-color: rgba(242,199,111,.52);
          background: rgba(242,199,111,.13);
        }

        .dgb-earth-readout {
          grid-column: 1 / -1;
          color: rgba(211, 215, 238, .86);
          letter-spacing: .03em;
        }

        .dgb-earth-footer {
          color: rgba(255,255,255,.92);
          font-size: clamp(.92rem, 2.8vw, 1.32rem);
          font-weight: 900;
          letter-spacing: .14em;
          line-height: 1.35;
          text-align: center;
          text-transform: uppercase;
        }

        .dgb-earth-missing {
          width: min(760px, 92vw);
          border: 1px solid rgba(255, 140, 140, .42);
          border-radius: 28px;
          padding: 24px;
          background: rgba(18, 4, 6, .72);
          color: rgba(255,247,228,.92);
          box-shadow: 0 24px 80px rgba(0,0,0,.42);
        }

        .dgb-earth-missing .kicker {
          margin: 0 0 10px;
          color: #ff9d9d;
          font-size: .74rem;
          letter-spacing: .15em;
          text-transform: uppercase;
        }

        .dgb-earth-missing h2 {
          margin: 0 0 10px;
          font-size: clamp(1.8rem, 4vw, 3rem);
          letter-spacing: -.04em;
        }

        .dgb-earth-missing p {
          margin: 0;
          color: rgba(255,247,228,.74);
          line-height: 1.45;
        }

        .dgb-earth-missing code {
          color: #f2c76f;
          overflow-wrap: anywhere;
        }

        @media (max-width: 760px) {
          #${MOUNT_ID} {
            min-height: 900px;
            padding-top: 270px;
          }

          .dgb-orbital-field {
            width: min(610px, 92vw);
          }

          .dgb-background-mars {
            width: 190px;
            top: -32%;
            right: -18%;
          }

          .dgb-earth-button,
          .dgb-earth-readout {
            min-height: 72px;
          }
        }
      `
    });

    document.head.appendChild(style);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function syncScene(root) {
    const scene = qs(".dgb-orbital-earth", root);
    const shell = qs(".dgb-earth-shell", root);
    const readout = qs("[data-earth-readout]", root);
    const pauseButton = qs('[data-earth-action="pause"]', root);

    if (!scene || !shell) return;

    scene.style.setProperty("--earth-zoom", String(state.zoom));
    shell.style.setProperty("--earth-rotate-x", state.rotateX + "deg");
    shell.style.setProperty("--earth-rotate-y", state.rotateY + "deg");

    scene.classList.toggle("dgb-earth-spin-active", !state.spinPaused);
    scene.classList.toggle("dgb-earth-spin-paused", state.spinPaused);
    scene.dataset.spinState = state.spinPaused ? "paused" : "active";
    scene.dataset.zoom = String(state.zoom);

    if (readout) readout.textContent = "Zoom  " + Math.round(state.zoom * 100) + "%";
    if (pauseButton) pauseButton.textContent = state.spinPaused ? "Resume Spin" : "Pause Spin";
  }

  function renderMissingAsset(root) {
    root.replaceChildren(
      create("article", {
        className: "dgb-earth-missing",
        "data-earth-asset-missing": "true"
      }, [
        create("p", { className: "kicker", text: "Required Earth asset missing" }),
        create("h2", { text: "Orbital Earth cannot use a cartoon fallback." }),
        create("p", {}, [
          "Upload the real Earth image to ",
          create("code", { text: REQUIRED_EARTH_ASSET }),
          ". The Showroom render is intentionally blocked until that asset exists."
        ])
      ])
    );

    root.dataset.renderStatus = "asset-missing";
    root.dataset.requiredEarthAsset = REQUIRED_EARTH_ASSET;
  }

  function buildControls() {
    return create("div", { className: "dgb-earth-controls", "data-earth-controls": "active" }, [
      create("button", {
        className: "dgb-earth-button",
        type: "button",
        "data-earth-action": "zoom-out",
        text: "Zoom Out"
      }),
      create("button", {
        className: "dgb-earth-button",
        type: "button",
        "data-earth-action": "zoom-in",
        text: "Zoom In"
      }),
      create("button", {
        className: "dgb-earth-button",
        type: "button",
        "data-earth-action": "reset",
        text: "Reset Earth"
      }),
      create("button", {
        className: "dgb-earth-button",
        type: "button",
        "data-earth-action": "pause",
        text: "Pause Spin"
      }),
      create("div", {
        className: "dgb-earth-readout",
        "data-earth-readout": "true",
        text: "Zoom 100%"
      })
    ]);
  }

  function bindControls(root) {
    root.querySelectorAll("[data-earth-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.earthAction;

        if (action === "zoom-in") state.zoom = clamp(state.zoom + 0.12, 0.7, 1.84);
        if (action === "zoom-out") state.zoom = clamp(state.zoom - 0.12, 0.7, 1.84);
        if (action === "reset") {
          state.zoom = 1;
          state.spinPaused = false;
          state.rotateX = -10;
          state.rotateY = 0;
        }
        if (action === "pause") state.spinPaused = !state.spinPaused;

        syncScene(root);
      });
    });
  }

  function bindDrag(root) {
    const shell = qs(".dgb-earth-shell", root);
    if (!shell) return;

    shell.addEventListener("pointerdown", (event) => {
      state.dragActive = true;
      state.dragStartX = event.clientX;
      state.dragStartY = event.clientY;
      state.spinPaused = true;
      shell.setPointerCapture(event.pointerId);
      syncScene(root);
    });

    shell.addEventListener("pointermove", (event) => {
      if (!state.dragActive) return;

      const dx = event.clientX - state.dragStartX;
      const dy = event.clientY - state.dragStartY;

      state.dragStartX = event.clientX;
      state.dragStartY = event.clientY;

      state.rotateY = state.rotateY + dx * 0.35;
      state.rotateX = clamp(state.rotateX - dy * 0.22, -28, 22);

      syncScene(root);
    });

    shell.addEventListener("pointerup", (event) => {
      state.dragActive = false;
      try {
        shell.releasePointerCapture(event.pointerId);
      } catch (error) {
        /* no-op */
      }
    });

    shell.addEventListener("pointercancel", () => {
      state.dragActive = false;
    });
  }

  function renderEarth(root) {
    const image = create("img", {
      className: "dgb-earth-texture",
      alt: "Actual Earth orbital texture",
      src: REQUIRED_EARTH_ASSET,
      decoding: "async",
      loading: "eager",
      draggable: "false"
    });

    image.addEventListener("error", () => {
      renderMissingAsset(root);
    });

    image.addEventListener("load", () => {
      root.dataset.renderStatus = "complete";
      root.dataset.earthAssetLoaded = REQUIRED_EARTH_ASSET;
    });

    const scene = create("section", {
      className: "dgb-orbital-earth dgb-earth-spin-active",
      "aria-label": "Actual Earth orbital showroom",
      "data-showroom-globe-controller": "/showroom/globe/index.js",
      "data-earth-standard": "actual-earth-texture-required",
      "data-earth-asset": REQUIRED_EARTH_ASSET,
      "data-demo-universe": "globe-only",
      "data-estate-land-placement": "mirror-universe-only"
    }, [
      create("div", { className: "dgb-orbital-field" }, [
        create("div", { className: "dgb-background-mars", "aria-hidden": "true" }),
        create("div", { className: "dgb-earth-shell" }, [image])
      ]),
      buildControls(),
      create("div", {
        className: "dgb-earth-footer",
        text: "EARTH STANDARD · ACTUAL EARTH TEXTURE · CENTERED · AUTO + MANUAL SPIN"
      })
    ]);

    root.replaceChildren(scene);
    root.dataset.renderStatus = "rendering";
    root.dataset.renderController = "/showroom/globe/index.js";
    root.dataset.requiredEarthAsset = REQUIRED_EARTH_ASSET;
    root.dataset.earthStandard = "actual-earth-texture-required";

    bindControls(root);
    bindDrag(root);
    syncScene(root);
  }

  function init() {
    injectStyle();

    const root = document.getElementById(MOUNT_ID);
    if (!root) return;

    renderEarth(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.DGBShowroomGlobe = Object.freeze({
    init,
    state,
    requiredEarthAsset: REQUIRED_EARTH_ASSET
  });
})();

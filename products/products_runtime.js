(() => {
  "use strict";

  const GLOBAL_KEY = "ProductsPlanetRuntime";
  const STYLE_ID = "products-four-season-molecule-runtime-v1-style";
  const CONTRACT = "PRODUCTS_RUNTIME_FOUR_SEASON_MOLECULAR_FLOWER_V1";
  const RECEIPT_KEY = "productsRuntimeMounted";

  const seasons = [
    {
      key: "winter",
      label: "Winter",
      squad: "North Squad",
      axis: "Winter / Spring diagonal",
      duty: "Boundary, high ground, stillness, and structural map stability.",
      points: ["W01", "W02", "W03", "W04", "W05", "W06", "W07", "W08"]
    },
    {
      key: "spring",
      label: "Spring",
      squad: "South Squad",
      axis: "Winter / Spring diagonal",
      duty: "Restoration, ecology, growth return, and living continuity.",
      points: ["SP01", "SP02", "SP03", "SP04", "SP05", "SP06", "SP07", "SP08"]
    },
    {
      key: "summer",
      label: "Summer",
      squad: "East Squad",
      axis: "Summer / Fall diagonal",
      duty: "Movement, signal formation, traversal, and active expansion.",
      points: ["SU01", "SU02", "SU03", "SU04", "SU05", "SU06", "SU07", "SU08"]
    },
    {
      key: "fall",
      label: "Fall",
      squad: "West Squad",
      axis: "Summer / Fall diagonal",
      duty: "Pressure, friction, edge testing, and false-close detection.",
      points: ["F01", "F02", "F03", "F04", "F05", "F06", "F07", "F08"]
    }
  ];

  function getRuntimeMount() {
    return (
      document.getElementById("productsRuntimeMount") ||
      document.querySelector("[data-products-runtime-mount]") ||
      document.getElementById("productsPage") ||
      document.getElementById("productsGrid") ||
      document.body
    );
  }

  function writeReceipt(receipts, level, text) {
    if (receipts && typeof receipts.write === "function") {
      receipts.write(level, text);
    }
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      :root {
        --products-bg: #030712;
        --products-panel: rgba(8, 15, 31, 0.86);
        --products-panel-strong: rgba(11, 21, 43, 0.94);
        --products-line: rgba(177, 199, 255, 0.2);
        --products-line-strong: rgba(225, 235, 255, 0.42);
        --products-text: #eef4ff;
        --products-muted: #a8b7d8;
        --products-gold: #f0d59b;
        --products-winter: #cfe7ff;
        --products-spring: #93efbd;
        --products-summer: #91c9ff;
        --products-fall: #f1a45b;
        --products-shadow: 0 26px 90px rgba(0, 0, 0, 0.5);
      }

      [data-products-runtime-root] {
        width: min(1180px, calc(100vw - 24px));
        margin: 0 auto;
        color: var(--products-text);
        font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      .products-runtime-shell {
        display: grid;
        gap: 18px;
      }

      .products-runtime-hero,
      .products-runtime-window,
      .products-runtime-panel,
      .products-runtime-card {
        border: 1px solid var(--products-line);
        background:
          radial-gradient(circle at 50% 0%, rgba(145, 201, 255, 0.14), transparent 34%),
          linear-gradient(180deg, var(--products-panel-strong), var(--products-panel));
        box-shadow: var(--products-shadow);
      }

      .products-runtime-hero {
        border-radius: 34px;
        padding: clamp(20px, 3vw, 34px);
        overflow: hidden;
      }

      .products-runtime-eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        margin: 0 0 14px;
        padding: 8px 12px;
        border: 1px solid var(--products-line);
        border-radius: 999px;
        color: #dce7ff;
        background: rgba(255, 255, 255, 0.04);
        text-transform: uppercase;
        letter-spacing: 0.14em;
        font-size: 0.72rem;
        font-weight: 850;
      }

      .products-runtime-eyebrow::before {
        content: "";
        width: 9px;
        height: 9px;
        border-radius: 2px;
        transform: rotate(45deg);
        background: var(--products-gold);
        box-shadow: 0 0 20px rgba(240, 213, 155, 0.55);
      }

      .products-runtime-hero h2 {
        margin: 0 0 14px;
        max-width: 13ch;
        font-size: clamp(2.3rem, 6vw, 5.4rem);
        line-height: 0.92;
        letter-spacing: -0.065em;
      }

      .products-runtime-hero h2 span {
        color: var(--products-gold);
      }

      .products-runtime-hero p,
      .products-runtime-panel p,
      .products-runtime-card p {
        margin: 0;
        color: var(--products-muted);
        line-height: 1.62;
      }

      .products-runtime-window {
        border-radius: 34px;
        padding: clamp(16px, 2vw, 24px);
        overflow: hidden;
      }

      .products-molecule-stage {
        position: relative;
        min-height: clamp(620px, 72vw, 820px);
        border-radius: 30px;
        overflow: hidden;
        isolation: isolate;
        border: 1px solid rgba(177, 199, 255, 0.18);
        background:
          radial-gradient(circle at 50% 50%, rgba(240, 213, 155, 0.13), transparent 22%),
          radial-gradient(circle at 30% 30%, rgba(207, 231, 255, 0.12), transparent 24%),
          radial-gradient(circle at 70% 70%, rgba(147, 239, 189, 0.1), transparent 26%),
          linear-gradient(180deg, #050b18, #02050d);
      }

      .products-molecule-stage::before {
        content: "";
        position: absolute;
        inset: 18px;
        z-index: 6;
        border-radius: 26px;
        border: 1px solid rgba(255, 255, 255, 0.11);
        box-shadow: inset 0 0 36px rgba(145, 201, 255, 0.13);
        pointer-events: none;
      }

      .products-orbit {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 66%;
        height: 42%;
        border: 5px solid rgba(220, 235, 255, 0.18);
        border-radius: 50%;
        transform-origin: center;
        z-index: 2;
        filter: drop-shadow(0 0 20px rgba(145, 201, 255, 0.16));
      }

      .products-orbit.winter-spring {
        transform: translate(-50%, -50%) rotate(45deg);
        animation: productsOrbitA 9s ease-in-out infinite;
      }

      .products-orbit.summer-fall {
        transform: translate(-50%, -50%) rotate(-45deg);
        animation: productsOrbitB 9s ease-in-out infinite;
      }

      .products-center-throat {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 132px;
        height: 132px;
        transform: translate(-50%, -50%);
        z-index: 5;
        border-radius: 50%;
        background:
          radial-gradient(circle, #ffffff 0 8%, rgba(240, 213, 155, 0.82) 12%, rgba(145, 201, 255, 0.28) 34%, transparent 72%);
        filter: drop-shadow(0 0 34px rgba(255, 255, 255, 0.48));
        animation: productsCenterPulse 4.4s ease-in-out infinite;
      }

      .products-season-lobe {
        position: absolute;
        z-index: 4;
        width: min(230px, 31vw);
        min-height: 124px;
        padding: 18px;
        border: 1px solid var(--products-line);
        border-radius: 28px;
        background: rgba(5, 12, 26, 0.84);
        backdrop-filter: blur(12px);
      }

      .products-season-lobe strong {
        display: block;
        margin-bottom: 8px;
        color: #ffffff;
        font-size: 1.12rem;
      }

      .products-season-lobe small {
        display: block;
        margin-bottom: 8px;
        color: var(--products-muted);
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-weight: 850;
      }

      .products-season-lobe p {
        margin: 0;
        color: var(--products-muted);
        font-size: 0.9rem;
        line-height: 1.45;
      }

      .products-season-lobe.winter {
        left: 12%;
        top: 15%;
        border-color: rgba(207, 231, 255, 0.42);
      }

      .products-season-lobe.spring {
        right: 12%;
        bottom: 13%;
        border-color: rgba(147, 239, 189, 0.42);
      }

      .products-season-lobe.summer {
        right: 12%;
        top: 15%;
        border-color: rgba(145, 201, 255, 0.42);
      }

      .products-season-lobe.fall {
        left: 12%;
        bottom: 13%;
        border-color: rgba(241, 164, 91, 0.42);
      }

      .products-point {
        position: absolute;
        left: calc(var(--x) * 1%);
        top: calc(var(--y) * 1%);
        z-index: 3;
        width: 14px;
        height: 14px;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background: var(--point-color);
        box-shadow: 0 0 16px var(--point-color), 0 0 34px rgba(255, 255, 255, 0.2);
        animation: productsPointFloat 5.2s ease-in-out infinite;
        animation-delay: var(--delay);
      }

      .products-point::after {
        content: attr(data-point);
        position: absolute;
        left: 50%;
        top: 19px;
        transform: translateX(-50%);
        color: rgba(238, 244, 255, 0.7);
        font-size: 0.62rem;
        font-weight: 800;
        letter-spacing: 0.06em;
      }

      .products-point.winter { --point-color: var(--products-winter); }
      .products-point.spring { --point-color: var(--products-spring); }
      .products-point.summer { --point-color: var(--products-summer); }
      .products-point.fall { --point-color: var(--products-fall); }

      .products-stage-title {
        position: absolute;
        left: 50%;
        top: 5%;
        z-index: 7;
        width: min(620px, 84%);
        transform: translateX(-50%);
        padding: 16px 18px;
        border: 1px solid var(--products-line);
        border-radius: 999px;
        background: rgba(5, 12, 26, 0.86);
        text-align: center;
        color: #e8f0ff;
        text-transform: uppercase;
        letter-spacing: 0.13em;
        line-height: 1.45;
        font-size: 0.78rem;
        font-weight: 850;
        backdrop-filter: blur(12px);
      }

      .products-stage-footer {
        position: absolute;
        left: 50%;
        bottom: 5%;
        z-index: 7;
        width: min(820px, 88%);
        transform: translateX(-50%);
        padding: 16px 18px;
        border: 1px solid var(--products-line);
        border-radius: 999px;
        background: rgba(5, 12, 26, 0.86);
        text-align: center;
        color: #dce7ff;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        line-height: 1.45;
        font-size: 0.72rem;
        font-weight: 850;
        backdrop-filter: blur(12px);
      }

      .products-runtime-panel {
        border-radius: 30px;
        padding: clamp(18px, 2.4vw, 26px);
      }

      .products-runtime-panel h3 {
        margin: 0 0 10px;
        color: #ffffff;
        font-size: clamp(1.55rem, 3vw, 2.55rem);
        line-height: 1;
        letter-spacing: -0.04em;
      }

      .products-runtime-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        margin-top: 18px;
      }

      .products-runtime-card {
        border-radius: 22px;
        padding: 16px;
        min-height: 160px;
      }

      .products-runtime-card small {
        display: block;
        margin-bottom: 8px;
        color: #91a6cf;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 0.7rem;
        font-weight: 850;
      }

      .products-runtime-card strong {
        display: block;
        margin-bottom: 10px;
        color: #ffffff;
        font-size: 1.18rem;
        line-height: 1.1;
      }

      .products-runtime-receipt {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 10px;
        margin-top: 18px;
      }

      .products-runtime-receipt span {
        border: 1px solid rgba(177, 199, 255, 0.15);
        border-radius: 18px;
        padding: 12px;
        color: #dce7ff;
        background: rgba(255, 255, 255, 0.035);
        font-size: 0.82rem;
        font-weight: 800;
        text-align: center;
      }

      @keyframes productsOrbitA {
        0%, 100% { transform: translate(-50%, -50%) rotate(45deg) scaleX(1); opacity: 0.58; }
        50% { transform: translate(-50%, -50%) rotate(48deg) scaleX(1.06); opacity: 0.82; }
      }

      @keyframes productsOrbitB {
        0%, 100% { transform: translate(-50%, -50%) rotate(-45deg) scaleX(1); opacity: 0.58; }
        50% { transform: translate(-50%, -50%) rotate(-48deg) scaleX(1.06); opacity: 0.82; }
      }

      @keyframes productsCenterPulse {
        0%, 100% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.74; }
        50% { transform: translate(-50%, -50%) scale(1.08); opacity: 1; }
      }

      @keyframes productsPointFloat {
        0%, 100% { transform: translate(-50%, -50%) translateY(0) scale(0.94); }
        50% { transform: translate(-50%, -50%) translateY(-18px) scale(1.08); }
      }

      @media (max-width: 900px) {
        .products-runtime-grid,
        .products-runtime-receipt {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .products-season-lobe {
          width: min(210px, 36vw);
          padding: 14px;
        }

        .products-season-lobe.winter { left: 7%; top: 16%; }
        .products-season-lobe.summer { right: 7%; top: 16%; }
        .products-season-lobe.fall { left: 7%; bottom: 13%; }
        .products-season-lobe.spring { right: 7%; bottom: 13%; }
      }

      @media (max-width: 640px) {
        [data-products-runtime-root] {
          width: min(100vw - 16px, 1180px);
        }

        .products-molecule-stage {
          min-height: 740px;
        }

        .products-runtime-grid,
        .products-runtime-receipt {
          grid-template-columns: 1fr;
        }

        .products-stage-title,
        .products-stage-footer {
          border-radius: 24px;
          font-size: 0.62rem;
        }

        .products-season-lobe {
          width: min(170px, 43vw);
          min-height: 112px;
          padding: 12px;
        }

        .products-season-lobe strong {
          font-size: 0.98rem;
        }

        .products-season-lobe p {
          font-size: 0.78rem;
        }

        .products-point::after {
          display: none;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        [data-products-runtime-root] *,
        [data-products-runtime-root] *::before,
        [data-products-runtime-root] *::after {
          animation: none !important;
          scroll-behavior: auto !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function pointCoordinates() {
    return [
      { season: "winter", x: 32, y: 28 }, { season: "winter", x: 37, y: 24 },
      { season: "winter", x: 43, y: 27 }, { season: "winter", x: 39, y: 34 },
      { season: "winter", x: 34, y: 39 }, { season: "winter", x: 45, y: 41 },
      { season: "winter", x: 48, y: 47 }, { season: "winter", x: 50, y: 50 },

      { season: "spring", x: 50, y: 50 }, { season: "spring", x: 53, y: 56 },
      { season: "spring", x: 60, y: 61 }, { season: "spring", x: 66, y: 66 },
      { season: "spring", x: 62, y: 73 }, { season: "spring", x: 68, y: 77 },
      { season: "spring", x: 73, y: 72 }, { season: "spring", x: 69, y: 62 },

      { season: "summer", x: 68, y: 28 }, { season: "summer", x: 63, y: 24 },
      { season: "summer", x: 57, y: 27 }, { season: "summer", x: 61, y: 34 },
      { season: "summer", x: 66, y: 39 }, { season: "summer", x: 55, y: 41 },
      { season: "summer", x: 52, y: 47 }, { season: "summer", x: 50, y: 50 },

      { season: "fall", x: 50, y: 50 }, { season: "fall", x: 47, y: 56 },
      { season: "fall", x: 40, y: 61 }, { season: "fall", x: 34, y: 66 },
      { season: "fall", x: 38, y: 73 }, { season: "fall", x: 32, y: 77 },
      { season: "fall", x: 27, y: 72 }, { season: "fall", x: 31, y: 62 }
    ];
  }

  function buildMoleculePoints() {
    const counts = {};
    return pointCoordinates().map((point, index) => {
      counts[point.season] = (counts[point.season] || 0) + 1;
      const label = `${point.season.slice(0, 2).toUpperCase()}${String(counts[point.season]).padStart(2, "0")}`;
      return `<span class="products-point ${point.season}" data-point="${label}" style="--x:${point.x};--y:${point.y};--delay:${index * -0.13}s"></span>`;
    }).join("");
  }

  function buildSeasonLobes() {
    return seasons.map((season) => `
      <article class="products-season-lobe ${season.key}">
        <small>${season.squad}</small>
        <strong>${season.label}</strong>
        <p>${season.duty}</p>
      </article>
    `).join("");
  }

  function buildSeasonCards() {
    return seasons.map((season) => `
      <article class="products-runtime-card">
        <small>${season.axis}</small>
        <strong>${season.label} · ${season.squad}</strong>
        <p>${season.duty}</p>
      </article>
    `).join("");
  }

  function buildHTML() {
    return `
      <section class="products-runtime-shell" data-products-runtime-root="true" data-runtime-contract="${CONTRACT}" data-runtime-owner="products_runtime.js">
        <header class="products-runtime-hero">
          <p class="products-runtime-eyebrow">Runtime mounted · four-season molecular flower</p>
          <h2>Seasonal <span>molecule</span> online.</h2>
          <p>
            The Products chamber now resolves through one stained-glass vessel: Winter and Spring form one diagonal figure-eight, Summer and Fall form the opposing figure-eight, and both loops cross through a shared center throat.
          </p>
        </header>

        <section class="products-runtime-window" aria-label="Four-season molecular flower runtime window">
          <div class="products-molecule-stage">
            <div class="products-stage-title">Products runtime · four seasons · thirty-two points · two crossing figure-eights</div>
            <div class="products-orbit winter-spring" aria-hidden="true"></div>
            <div class="products-orbit summer-fall" aria-hidden="true"></div>
            <div class="products-center-throat" aria-hidden="true"></div>
            ${buildMoleculePoints()}
            ${buildSeasonLobes()}
            <div class="products-stage-footer">
              Runtime receipt active: bridge file loaded, runtime file mounted, molecule root detected.
            </div>
          </div>
        </section>

        <section class="products-runtime-panel">
          <h3>Runtime contract</h3>
          <p>
            This file owns the visible Products runtime surface. It supplies the mount receipt required by the bridge and renders the seasonal molecule without depending on visual-only fallback text.
          </p>

          <div class="products-runtime-grid">
            ${buildSeasonCards()}
          </div>

          <div class="products-runtime-receipt" aria-label="Runtime proof chain">
            <span>HTML shell loaded</span>
            <span>Bridge requested runtime</span>
            <span>Runtime root mounted</span>
            <span>Visible molecule rendered</span>
          </div>
        </section>
      </section>
    `;
  }

  class ProductsPlanetRuntime {
    constructor(options = {}) {
      this.mount = options.mount || options.stage || null;
      this.stage = options.stage || options.mount || null;
      this.host = options.host || null;
      this.receipts = options.receipts || null;
      this.reducedMotion = !!options.reducedMotion;
      this.contract = CONTRACT;
      this.status = "IDLE";
    }

    write(level, text) {
      writeReceipt(this.receipts, level, text);
    }

    resolveTarget() {
      return this.mount || this.stage || getRuntimeMount();
    }

    destroy() {
      const target = this.resolveTarget();
      if (target && target instanceof HTMLElement) {
        target.innerHTML = "";
        target.removeAttribute("data-runtime-status");
        target.removeAttribute("data-runtime-contract");
        target.removeAttribute("data-runtime-owner");
      }

      window[RECEIPT_KEY] = false;
      this.status = "DESTROYED";
    }

    async mountRuntime() {
      injectStyle();

      const target = this.resolveTarget();
      if (!target || !(target instanceof HTMLElement)) {
        this.status = "FAILED_NO_TARGET";
        this.write("error", "products runtime could not find a mount target");
        return { status: this.status, contract: this.contract, owner: "products_runtime.js" };
      }

      target.setAttribute("data-runtime-status", "mounted");
      target.setAttribute("data-runtime-contract", this.contract);
      target.setAttribute("data-runtime-owner", "products_runtime.js");
      target.innerHTML = buildHTML();

      window[RECEIPT_KEY] = true;
      this.status = "MOUNTED";
      this.write("info", "products four-season molecular flower mounted by products_runtime.js");

      window.dispatchEvent(new CustomEvent("products-runtime-mounted", {
        detail: {
          status: this.status,
          contract: this.contract,
          owner: "products_runtime.js"
        }
      }));

      return { status: this.status, contract: this.contract, owner: "products_runtime.js" };
    }
  }

  function autoMountIfNeeded() {
    const target = getRuntimeMount();
    if (!target || !(target instanceof HTMLElement)) return;

    const alreadyMounted = Boolean(
      target.querySelector("[data-products-runtime-root]") ||
      document.querySelector("[data-products-runtime-root]") ||
      window[RECEIPT_KEY] === true
    );

    if (alreadyMounted) {
      window[RECEIPT_KEY] = true;
      return;
    }

    const runtime = new ProductsPlanetRuntime({ mount: target });
    runtime.mountRuntime();
  }

  window[GLOBAL_KEY] = ProductsPlanetRuntime;
  window.ProductsPlanetRuntime = ProductsPlanetRuntime;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoMountIfNeeded, { once: true });
  } else {
    autoMountIfNeeded();
  }
})();

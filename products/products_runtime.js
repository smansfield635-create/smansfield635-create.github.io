(() => {
  "use strict";

  const GLOBAL_KEY = "ProductsPlanetRuntime";
  const RECEIPT_KEY = "productsRuntimeMounted";
  const STYLE_ID = "products-visual-first-runtime-v3-style";
  const CONTRACT = "PRODUCTS_RUNTIME_VISUAL_FIRST_CHAMBER_v3";
  const SHARED_EARTH_SRC = "/shared/earth_globe.js";
  const SHARED_EARTH_VERSION = "shared-earth-globe-axis-spin-v2";

  const seasons = [
    { key: "winter", label: "Winter", squad: "North", short: "Boundary" },
    { key: "spring", label: "Spring", squad: "South", short: "Continuity" },
    { key: "summer", label: "Summer", squad: "East", short: "Signal" },
    { key: "fall", label: "Fall", squad: "West", short: "Pressure" }
  ];

  const productLines = [
    ["North", "Boundary Instruments"],
    ["South", "Continuity Instruments"],
    ["East", "Signal Instruments"],
    ["West", "Pressure Instruments"]
  ];

  function getRuntimeMount() {
    return (
      document.getElementById("productsRuntimeMount") ||
      document.querySelector("[data-products-runtime-mount]") ||
      document.getElementById("productsPage") ||
      document.body
    );
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      :root {
        --products-panel:rgba(8,15,31,.88);
        --products-panel-strong:rgba(11,21,43,.95);
        --products-line:rgba(177,199,255,.20);
        --products-text:#eef4ff;
        --products-muted:#a8b7d8;
        --products-gold:#f0d59b;
        --products-winter:#cfe7ff;
        --products-spring:#93efbd;
        --products-summer:#91c9ff;
        --products-fall:#f1a45b;
        --products-shadow:0 26px 90px rgba(0,0,0,.50);
      }

      [data-products-runtime-root] {
        width:100%;
        color:var(--products-text);
        font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
      }

      .products-runtime-shell {
        display:grid;
        gap:14px;
      }

      .products-runtime-window,
      .products-runtime-panel,
      .products-chip {
        border:1px solid var(--products-line);
        background:
          radial-gradient(circle at 50% 0%,rgba(145,201,255,.12),transparent 34%),
          linear-gradient(180deg,var(--products-panel-strong),var(--products-panel));
        box-shadow:var(--products-shadow);
      }

      .products-runtime-window {
        border-radius:32px;
        padding:clamp(12px,2vw,20px);
        overflow:hidden;
      }

      .products-molecule-stage {
        position:relative;
        min-height:clamp(620px,72vw,790px);
        border-radius:28px;
        overflow:hidden;
        isolation:isolate;
        border:1px solid rgba(177,199,255,.18);
        background:
          radial-gradient(circle at 50% 50%,rgba(240,213,155,.13),transparent 22%),
          radial-gradient(circle at 30% 30%,rgba(207,231,255,.11),transparent 24%),
          radial-gradient(circle at 70% 70%,rgba(147,239,189,.10),transparent 26%),
          linear-gradient(180deg,#050b18,#02050d);
      }

      .products-molecule-stage::before {
        content:"";
        position:absolute;
        inset:18px;
        z-index:9;
        border-radius:26px;
        border:1px solid rgba(255,255,255,.10);
        box-shadow:inset 0 0 36px rgba(145,201,255,.12);
        pointer-events:none;
      }

      .products-molecule-stage::after {
        content:"";
        position:absolute;
        inset:-20%;
        z-index:1;
        opacity:.18;
        background:
          linear-gradient(90deg,rgba(145,201,255,.10) 1px,transparent 1px),
          linear-gradient(180deg,rgba(145,201,255,.06) 1px,transparent 1px);
        background-size:48px 48px;
        transform:rotate(-7deg);
        pointer-events:none;
      }

      .products-stage-title {
        position:absolute;
        left:50%;
        top:5%;
        z-index:12;
        width:min(360px,70%);
        transform:translateX(-50%);
        padding:10px 13px;
        border:1px solid var(--products-line);
        border-radius:999px;
        background:rgba(5,12,26,.78);
        text-align:center;
        color:#e8f0ff;
        text-transform:uppercase;
        letter-spacing:.12em;
        line-height:1.25;
        font-size:.58rem;
        font-weight:850;
        backdrop-filter:blur(12px);
      }

      .products-stage-footer {
        position:absolute;
        left:50%;
        bottom:5%;
        z-index:12;
        width:min(430px,76%);
        transform:translateX(-50%);
        padding:10px 13px;
        border:1px solid var(--products-line);
        border-radius:999px;
        background:rgba(5,12,26,.78);
        text-align:center;
        color:#dce7ff;
        text-transform:uppercase;
        letter-spacing:.11em;
        line-height:1.25;
        font-size:.56rem;
        font-weight:850;
        backdrop-filter:blur(12px);
      }

      .products-orbit {
        position:absolute;
        left:50%;
        top:50%;
        width:72%;
        height:42%;
        border:5px solid rgba(220,235,255,.16);
        border-radius:50%;
        transform-origin:center;
        z-index:3;
        filter:drop-shadow(0 0 20px rgba(145,201,255,.14));
      }

      .products-orbit.winter-spring {
        transform:translate(-50%,-50%) rotate(45deg);
        animation:productsOrbitA 9s ease-in-out infinite;
      }

      .products-orbit.summer-fall {
        transform:translate(-50%,-50%) rotate(-45deg);
        animation:productsOrbitB 9s ease-in-out infinite;
      }

      .products-earth-throat {
        position:absolute;
        left:50%;
        top:50%;
        z-index:8;
        width:215px;
        height:215px;
        transform:translate(-50%,-50%);
        display:grid;
        place-items:center;
        border-radius:50%;
        filter:drop-shadow(0 0 34px rgba(255,255,255,.20));
      }

      .products-earth-throat::before {
        content:"";
        position:absolute;
        inset:-25px;
        border-radius:50%;
        background:
          radial-gradient(circle at 50% 50%,rgba(240,213,155,.26),transparent 56%),
          radial-gradient(circle at 50% 50%,rgba(145,201,255,.20),transparent 70%);
        filter:blur(10px);
        z-index:-1;
      }

      .products-season-lobe {
        position:absolute;
        z-index:10;
        width:min(150px,25vw);
        min-height:74px;
        padding:11px 12px;
        border:1px solid var(--products-line);
        border-radius:22px;
        background:rgba(5,12,26,.74);
        backdrop-filter:blur(12px);
        display:grid;
        align-content:center;
        gap:3px;
      }

      .products-season-lobe small {
        display:block;
        margin:0;
        color:var(--products-muted);
        text-transform:uppercase;
        letter-spacing:.12em;
        font-size:.54rem;
        font-weight:850;
        line-height:1.15;
      }

      .products-season-lobe strong {
        display:block;
        margin:0;
        color:#fff;
        font-size:.98rem;
        line-height:1.05;
      }

      .products-season-lobe p {
        margin:0;
        color:var(--products-muted);
        font-size:.66rem;
        line-height:1.18;
        text-transform:uppercase;
        letter-spacing:.08em;
        font-weight:800;
      }

      .products-season-lobe.winter {
        left:8%;
        top:18%;
        border-color:rgba(207,231,255,.38);
      }

      .products-season-lobe.spring {
        right:8%;
        bottom:16%;
        border-color:rgba(147,239,189,.38);
      }

      .products-season-lobe.summer {
        right:8%;
        top:18%;
        border-color:rgba(145,201,255,.38);
      }

      .products-season-lobe.fall {
        left:8%;
        bottom:16%;
        border-color:rgba(241,164,91,.38);
      }

      .products-point {
        position:absolute;
        left:calc(var(--x) * 1%);
        top:calc(var(--y) * 1%);
        z-index:6;
        width:12px;
        height:12px;
        transform:translate(-50%,-50%);
        border-radius:50%;
        background:var(--point-color);
        box-shadow:0 0 14px var(--point-color),0 0 30px rgba(255,255,255,.16);
        animation:productsPointFloat 5.2s ease-in-out infinite;
        animation-delay:var(--delay);
      }

      .products-point.winter { --point-color:var(--products-winter); }
      .products-point.spring { --point-color:var(--products-spring); }
      .products-point.summer { --point-color:var(--products-summer); }
      .products-point.fall { --point-color:var(--products-fall); }

      .products-runtime-panel {
        border-radius:28px;
        padding:clamp(16px,2vw,22px);
      }

      .products-runtime-panel h3 {
        margin:0 0 8px;
        color:#fff;
        font-size:clamp(1.4rem,3vw,2.15rem);
        line-height:1;
        letter-spacing:-.04em;
      }

      .products-runtime-panel p {
        margin:0;
        max-width:72ch;
        color:var(--products-muted);
        line-height:1.52;
      }

      .products-chip-grid {
        display:grid;
        grid-template-columns:repeat(4,minmax(0,1fr));
        gap:10px;
        margin-top:14px;
      }

      .products-chip {
        min-height:94px;
        border-radius:20px;
        padding:14px;
      }

      .products-chip small {
        display:block;
        margin-bottom:7px;
        color:#91a6cf;
        text-transform:uppercase;
        letter-spacing:.12em;
        font-size:.66rem;
        font-weight:850;
      }

      .products-chip strong {
        display:block;
        color:#fff;
        font-size:1rem;
        line-height:1.15;
      }

      .products-receipt-row {
        display:flex;
        flex-wrap:wrap;
        gap:8px;
        margin-top:14px;
      }

      .products-receipt-row span {
        border:1px solid rgba(177,199,255,.15);
        border-radius:999px;
        padding:9px 11px;
        color:#dce7ff;
        background:rgba(255,255,255,.035);
        font-size:.72rem;
        font-weight:800;
      }

      @keyframes productsOrbitA {
        0%,100% {
          transform:translate(-50%,-50%) rotate(45deg) scaleX(1);
          opacity:.56;
        }
        50% {
          transform:translate(-50%,-50%) rotate(48deg) scaleX(1.06);
          opacity:.80;
        }
      }

      @keyframes productsOrbitB {
        0%,100% {
          transform:translate(-50%,-50%) rotate(-45deg) scaleX(1);
          opacity:.56;
        }
        50% {
          transform:translate(-50%,-50%) rotate(-48deg) scaleX(1.06);
          opacity:.80;
        }
      }

      @keyframes productsPointFloat {
        0%,100% {
          transform:translate(-50%,-50%) translateY(0) scale(.94);
        }
        50% {
          transform:translate(-50%,-50%) translateY(-16px) scale(1.08);
        }
      }

      @media (max-width:900px) {
        .products-chip-grid {
          grid-template-columns:repeat(2,minmax(0,1fr));
        }

        .products-season-lobe {
          width:min(136px,31vw);
          min-height:66px;
          padding:10px;
        }

        .products-season-lobe.winter { left:5%; top:17%; }
        .products-season-lobe.summer { right:5%; top:17%; }
        .products-season-lobe.fall { left:5%; bottom:15%; }
        .products-season-lobe.spring { right:5%; bottom:15%; }
      }

      @media (max-width:640px) {
        .products-molecule-stage {
          min-height:680px;
        }

        .products-stage-title,
        .products-stage-footer {
          border-radius:22px;
          font-size:.50rem;
          width:min(360px,72%);
        }

        .products-earth-throat {
          width:178px;
          height:178px;
        }

        .products-season-lobe {
          width:min(118px,34vw);
          min-height:58px;
          padding:9px;
          border-radius:18px;
        }

        .products-season-lobe small {
          font-size:.46rem;
        }

        .products-season-lobe strong {
          font-size:.78rem;
        }

        .products-season-lobe p {
          font-size:.52rem;
        }

        .products-chip-grid {
          grid-template-columns:1fr;
        }
      }

      @media (prefers-reduced-motion:reduce) {
        [data-products-runtime-root] *,
        [data-products-runtime-root] *::before,
        [data-products-runtime-root] *::after {
          animation:none !important;
          scroll-behavior:auto !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function pointCoordinates() {
    return [
      { season: "winter", x: 31, y: 29 }, { season: "winter", x: 37, y: 24 },
      { season: "winter", x: 43, y: 27 }, { season: "winter", x: 39, y: 35 },
      { season: "winter", x: 34, y: 41 }, { season: "winter", x: 45, y: 43 },
      { season: "winter", x: 48, y: 48 }, { season: "winter", x: 50, y: 50 },

      { season: "spring", x: 50, y: 50 }, { season: "spring", x: 53, y: 56 },
      { season: "spring", x: 60, y: 61 }, { season: "spring", x: 66, y: 66 },
      { season: "spring", x: 62, y: 73 }, { season: "spring", x: 68, y: 77 },
      { season: "spring", x: 73, y: 72 }, { season: "spring", x: 69, y: 62 },

      { season: "summer", x: 69, y: 29 }, { season: "summer", x: 63, y: 24 },
      { season: "summer", x: 57, y: 27 }, { season: "summer", x: 61, y: 35 },
      { season: "summer", x: 66, y: 41 }, { season: "summer", x: 55, y: 43 },
      { season: "summer", x: 52, y: 48 }, { season: "summer", x: 50, y: 50 },

      { season: "fall", x: 50, y: 50 }, { season: "fall", x: 47, y: 56 },
      { season: "fall", x: 40, y: 61 }, { season: "fall", x: 34, y: 66 },
      { season: "fall", x: 38, y: 73 }, { season: "fall", x: 32, y: 77 },
      { season: "fall", x: 27, y: 72 }, { season: "fall", x: 31, y: 62 }
    ];
  }

  function buildMoleculePoints() {
    return pointCoordinates()
      .map((point, index) => `
        <span
          class="products-point ${point.season}"
          style="--x:${point.x};--y:${point.y};--delay:${(index % 8) * -0.22}s"
          aria-hidden="true"
        ></span>
      `)
      .join("");
  }

  function buildSeasonLobes() {
    return seasons
      .map((season) => `
        <article class="products-season-lobe ${season.key}">
          <small>${season.squad}</small>
          <strong>${season.label}</strong>
          <p>${season.short}</p>
        </article>
      `)
      .join("");
  }

  function buildProductChips() {
    return productLines
      .map(([code, title]) => `
        <article class="products-chip">
          <small>${code}</small>
          <strong>${title}</strong>
        </article>
      `)
      .join("");
  }

  function buildHTML() {
    return `
      <section class="products-runtime-shell" data-products-runtime-root="true">
        <section class="products-runtime-window" aria-label="Four-season molecular product chamber">
          <div class="products-molecule-stage">
            <div class="products-stage-title">Four seasons · one product engine</div>

            <span class="products-orbit winter-spring" aria-hidden="true"></span>
            <span class="products-orbit summer-fall" aria-hidden="true"></span>

            <div
              id="productsEarthThroat"
              class="products-earth-throat"
              data-products-earth-throat="pending"
              aria-label="Shared Earth throat"
            ></div>

            ${buildMoleculePoints()}
            ${buildSeasonLobes()}

            <div class="products-stage-footer">Two loops · one center · four families</div>
          </div>
        </section>

        <section class="products-runtime-panel">
          <h3>Product families.</h3>
          <p>
            Product detail expands from the four directional families without crowding the chamber.
          </p>

          <div class="products-chip-grid">
            ${buildProductChips()}
          </div>

          <div class="products-receipt-row" aria-label="Runtime receipts">
            <span>Bridge loaded</span>
            <span>Runtime mounted</span>
            <span>Shared Earth online</span>
            <span>Products ready</span>
          </div>
        </section>
      </section>
    `;
  }

  function loadScriptOnce(src, globalCheck) {
    return new Promise((resolve, reject) => {
      if (typeof globalCheck === "function" && globalCheck()) {
        resolve();
        return;
      }

      const existing = Array.from(document.scripts).find((script) =>
        script.src.includes(src)
      );

      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });

        window.setTimeout(() => {
          if (typeof globalCheck === "function" && globalCheck()) resolve();
        }, 60);

        return;
      }

      const script = document.createElement("script");
      script.src = `${src}?v=${encodeURIComponent(SHARED_EARTH_VERSION)}`;
      script.defer = true;
      script.dataset.productsSharedEarth = "true";

      script.addEventListener("load", () => resolve(), { once: true });
      script.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });

      document.head.appendChild(script);
    });
  }

  async function mountSharedEarth() {
    const throat = document.getElementById("productsEarthThroat");
    if (!throat) return false;

    try {
      await loadScriptOnce(SHARED_EARTH_SRC, () => Boolean(window.DGBEarthGlobe));

      if (!window.DGBEarthGlobe || typeof window.DGBEarthGlobe.mount !== "function") {
        throat.dataset.productsEarthThroat = "shared-earth-unavailable";
        return false;
      }

      window.DGBEarthGlobe.mount(throat, {
        mode: "hero",
        textureDuration: "52s",
        cloudDuration: "76s",
        texturePositionX: "58%",
        texturePositionY: "46%"
      });

      throat.dataset.productsEarthThroat = "mounted";
      throat.dataset.productsEarthSource = SHARED_EARTH_SRC;
      throat.dataset.productsEarthVersion = window.DGBEarthGlobe.version || SHARED_EARTH_VERSION;

      return true;
    } catch (error) {
      throat.dataset.productsEarthThroat = "failed";
      throat.dataset.productsEarthError = String(error && error.message ? error.message : error);
      return false;
    }
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

        return {
          status: this.status,
          contract: this.contract,
          owner: "products_runtime.js"
        };
      }

      target.setAttribute("data-runtime-status", "mounting");
      target.setAttribute("data-runtime-contract", this.contract);
      target.setAttribute("data-runtime-owner", "products_runtime.js");
      target.setAttribute("data-products-runtime-version", "products-visual-first-runtime-v3");

      target.innerHTML = buildHTML();

      const sharedEarthMounted = await mountSharedEarth();

      target.setAttribute("data-runtime-status", "mounted");
      target.setAttribute("data-products-shared-earth", sharedEarthMounted ? "mounted" : "unavailable");

      window[RECEIPT_KEY] = true;
      this.status = "MOUNTED";

      window.dispatchEvent(
        new CustomEvent("products-runtime-mounted", {
          detail: {
            status: this.status,
            contract: this.contract,
            owner: "products_runtime.js",
            sharedEarthMounted
          }
        })
      );

      return {
        status: this.status,
        contract: this.contract,
        owner: "products_runtime.js",
        sharedEarthMounted
      };
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

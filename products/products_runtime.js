(() => {
  "use strict";

  const GLOBAL_KEY = "ProductsPlanetRuntime";
  const RECEIPT_KEY = "productsRuntimeMounted";
  const STYLE_ID = "products-second-generation-runtime-v2-style";
  const CONTRACT = "PRODUCTS_RUNTIME_SECOND_GENERATION_MOLECULAR_EARTH_CHAMBER_v2";
  const SHARED_EARTH_SRC = "/shared/earth_globe.js";
  const SHARED_EARTH_VERSION = "shared-earth-globe-axis-spin-v2";

  const seasons = [
    {
      key: "winter",
      label: "Winter",
      squad: "North Squad",
      axis: "Winter / Spring diagonal",
      duty: "Boundary, high ground, stillness, structural map stability.",
      line: "The containment season. It holds shape before expansion."
    },
    {
      key: "spring",
      label: "Spring",
      squad: "South Squad",
      axis: "Winter / Spring diagonal",
      duty: "Restoration, ecology, growth return, living continuity.",
      line: "The renewal season. It turns stability into living return."
    },
    {
      key: "summer",
      label: "Summer",
      squad: "East Squad",
      axis: "Summer / Fall diagonal",
      duty: "Movement, signal formation, traversal, active expansion.",
      line: "The motion season. It carries signal outward."
    },
    {
      key: "fall",
      label: "Fall",
      squad: "West Squad",
      axis: "Summer / Fall diagonal",
      duty: "Pressure, friction, edge testing, false-close detection.",
      line: "The harvest season. It tests what remains true under pressure."
    }
  ];

  const productLines = [
    {
      code: "NORTH",
      title: "Boundary Instruments",
      body: "Structural tools for maps, thresholds, containment, and admissible next motion."
    },
    {
      code: "SOUTH",
      title: "Continuity Instruments",
      body: "Restoration tools for sequence, care, pattern repair, and living-system stability."
    },
    {
      code: "EAST",
      title: "Signal Instruments",
      body: "Motion tools for launch paths, learning loops, formation, and public-facing expression."
    },
    {
      code: "WEST",
      title: "Pressure Instruments",
      body: "Audit tools for contradiction, friction, false close, and edge-case survival."
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
        --products-bg:#030712;
        --products-panel:rgba(8,15,31,.88);
        --products-panel-strong:rgba(11,21,43,.95);
        --products-line:rgba(177,199,255,.20);
        --products-line-strong:rgba(225,235,255,.42);
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
        width:min(1180px,calc(100vw - 24px));
        margin:0 auto;
        color:var(--products-text);
        font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
      }

      .products-runtime-shell {
        display:grid;
        gap:18px;
      }

      .products-runtime-hero,
      .products-runtime-window,
      .products-runtime-panel,
      .products-runtime-card,
      .products-season-lobe,
      .products-product-card {
        border:1px solid var(--products-line);
        background:
          radial-gradient(circle at 50% 0%,rgba(145,201,255,.14),transparent 34%),
          linear-gradient(180deg,var(--products-panel-strong),var(--products-panel));
        box-shadow:var(--products-shadow);
      }

      .products-runtime-hero {
        border-radius:34px;
        padding:clamp(20px,3vw,34px);
        overflow:hidden;
        display:grid;
        gap:16px;
      }

      .products-runtime-eyebrow {
        display:inline-flex;
        width:fit-content;
        align-items:center;
        gap:10px;
        margin:0 0 14px;
        padding:8px 12px;
        border:1px solid var(--products-line);
        border-radius:999px;
        color:#dce7ff;
        background:rgba(255,255,255,.04);
        text-transform:uppercase;
        letter-spacing:.14em;
        font-size:.72rem;
        font-weight:850;
      }

      .products-runtime-eyebrow::before {
        content:"";
        width:9px;
        height:9px;
        border-radius:2px;
        transform:rotate(45deg);
        background:var(--products-gold);
        box-shadow:0 0 20px rgba(240,213,155,.55);
      }

      .products-runtime-hero h2 {
        margin:0 0 14px;
        max-width:13ch;
        color:#fff;
        font-size:clamp(2.3rem,6vw,5.4rem);
        line-height:.92;
        letter-spacing:-.065em;
      }

      .products-runtime-hero h2 span {
        color:var(--products-gold);
      }

      .products-runtime-hero p,
      .products-runtime-panel p,
      .products-runtime-card p,
      .products-product-card p {
        margin:0;
        color:var(--products-muted);
        line-height:1.62;
      }

      .products-runtime-window {
        border-radius:34px;
        padding:clamp(16px,2vw,24px);
        overflow:hidden;
      }

      .products-molecule-stage {
        position:relative;
        min-height:clamp(680px,76vw,860px);
        border-radius:30px;
        overflow:hidden;
        isolation:isolate;
        border:1px solid rgba(177,199,255,.18);
        background:
          radial-gradient(circle at 50% 50%,rgba(240,213,155,.13),transparent 22%),
          radial-gradient(circle at 30% 30%,rgba(207,231,255,.12),transparent 24%),
          radial-gradient(circle at 70% 70%,rgba(147,239,189,.10),transparent 26%),
          linear-gradient(180deg,#050b18,#02050d);
      }

      .products-molecule-stage::before {
        content:"";
        position:absolute;
        inset:18px;
        z-index:9;
        border-radius:26px;
        border:1px solid rgba(255,255,255,.11);
        box-shadow:inset 0 0 36px rgba(145,201,255,.13);
        pointer-events:none;
      }

      .products-molecule-stage::after {
        content:"";
        position:absolute;
        inset:-20%;
        z-index:1;
        opacity:.22;
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
        width:min(680px,84%);
        transform:translateX(-50%);
        padding:16px 18px;
        border:1px solid var(--products-line);
        border-radius:999px;
        background:rgba(5,12,26,.86);
        text-align:center;
        color:#e8f0ff;
        text-transform:uppercase;
        letter-spacing:.13em;
        line-height:1.45;
        font-size:.78rem;
        font-weight:850;
        backdrop-filter:blur(12px);
      }

      .products-stage-footer {
        position:absolute;
        left:50%;
        bottom:5%;
        z-index:12;
        width:min(860px,88%);
        transform:translateX(-50%);
        padding:16px 18px;
        border:1px solid var(--products-line);
        border-radius:999px;
        background:rgba(5,12,26,.86);
        text-align:center;
        color:#dce7ff;
        text-transform:uppercase;
        letter-spacing:.12em;
        line-height:1.45;
        font-size:.72rem;
        font-weight:850;
        backdrop-filter:blur(12px);
      }

      .products-orbit {
        position:absolute;
        left:50%;
        top:50%;
        width:72%;
        height:42%;
        border:5px solid rgba(220,235,255,.18);
        border-radius:50%;
        transform-origin:center;
        z-index:3;
        filter:drop-shadow(0 0 20px rgba(145,201,255,.16));
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
        width:220px;
        height:220px;
        transform:translate(-50%,-50%);
        display:grid;
        place-items:center;
        border-radius:50%;
        filter:drop-shadow(0 0 34px rgba(255,255,255,.22));
      }

      .products-earth-throat::before {
        content:"";
        position:absolute;
        inset:-28px;
        border-radius:50%;
        background:
          radial-gradient(circle at 50% 50%,rgba(240,213,155,.30),transparent 56%),
          radial-gradient(circle at 50% 50%,rgba(145,201,255,.22),transparent 70%);
        filter:blur(10px);
        z-index:-1;
      }

      .products-season-lobe {
        position:absolute;
        z-index:10;
        width:min(238px,31vw);
        min-height:132px;
        padding:18px;
        border-radius:28px;
        background:rgba(5,12,26,.84);
        backdrop-filter:blur(12px);
      }

      .products-season-lobe strong {
        display:block;
        margin-bottom:8px;
        color:#ffffff;
        font-size:1.12rem;
      }

      .products-season-lobe small {
        display:block;
        margin-bottom:8px;
        color:var(--products-muted);
        text-transform:uppercase;
        letter-spacing:.12em;
        font-weight:850;
      }

      .products-season-lobe p {
        margin:0;
        color:var(--products-muted);
        font-size:.9rem;
        line-height:1.45;
      }

      .products-season-lobe.winter {
        left:9%;
        top:17%;
        border-color:rgba(207,231,255,.42);
      }

      .products-season-lobe.spring {
        right:9%;
        bottom:15%;
        border-color:rgba(147,239,189,.42);
      }

      .products-season-lobe.summer {
        right:9%;
        top:17%;
        border-color:rgba(145,201,255,.42);
      }

      .products-season-lobe.fall {
        left:9%;
        bottom:15%;
        border-color:rgba(241,164,91,.42);
      }

      .products-point {
        position:absolute;
        left:calc(var(--x) * 1%);
        top:calc(var(--y) * 1%);
        z-index:6;
        width:14px;
        height:14px;
        transform:translate(-50%,-50%);
        border-radius:50%;
        background:var(--point-color);
        box-shadow:0 0 16px var(--point-color),0 0 34px rgba(255,255,255,.20);
        animation:productsPointFloat 5.2s ease-in-out infinite;
        animation-delay:var(--delay);
      }

      .products-point::after {
        content:attr(data-point);
        position:absolute;
        left:50%;
        top:19px;
        transform:translateX(-50%);
        color:rgba(238,244,255,.70);
        font-size:.62rem;
        font-weight:800;
        letter-spacing:.06em;
      }

      .products-point.winter { --point-color:var(--products-winter); }
      .products-point.spring { --point-color:var(--products-spring); }
      .products-point.summer { --point-color:var(--products-summer); }
      .products-point.fall { --point-color:var(--products-fall); }

      .products-runtime-panel {
        border-radius:30px;
        padding:clamp(18px,2.4vw,26px);
      }

      .products-runtime-panel h3 {
        margin:0 0 10px;
        color:#ffffff;
        font-size:clamp(1.55rem,3vw,2.55rem);
        line-height:1;
        letter-spacing:-.04em;
      }

      .products-runtime-grid,
      .products-product-grid {
        display:grid;
        grid-template-columns:repeat(4,minmax(0,1fr));
        gap:12px;
        margin-top:18px;
      }

      .products-runtime-card,
      .products-product-card {
        border-radius:22px;
        padding:16px;
        min-height:160px;
      }

      .products-runtime-card small,
      .products-product-card small {
        display:block;
        margin-bottom:8px;
        color:#91a6cf;
        text-transform:uppercase;
        letter-spacing:.12em;
        font-size:.7rem;
        font-weight:850;
      }

      .products-runtime-card strong,
      .products-product-card strong {
        display:block;
        margin-bottom:10px;
        color:#ffffff;
        font-size:1.18rem;
        line-height:1.1;
      }

      .products-runtime-receipt {
        display:grid;
        grid-template-columns:repeat(4,minmax(0,1fr));
        gap:10px;
        margin-top:18px;
      }

      .products-runtime-receipt span {
        border:1px solid rgba(177,199,255,.15);
        border-radius:18px;
        padding:12px;
        color:#dce7ff;
        background:rgba(255,255,255,.035);
        font-size:.82rem;
        font-weight:800;
        text-align:center;
      }

      @keyframes productsOrbitA {
        0%,100% {
          transform:translate(-50%,-50%) rotate(45deg) scaleX(1);
          opacity:.58;
        }
        50% {
          transform:translate(-50%,-50%) rotate(48deg) scaleX(1.06);
          opacity:.82;
        }
      }

      @keyframes productsOrbitB {
        0%,100% {
          transform:translate(-50%,-50%) rotate(-45deg) scaleX(1);
          opacity:.58;
        }
        50% {
          transform:translate(-50%,-50%) rotate(-48deg) scaleX(1.06);
          opacity:.82;
        }
      }

      @keyframes productsPointFloat {
        0%,100% {
          transform:translate(-50%,-50%) translateY(0) scale(.94);
        }
        50% {
          transform:translate(-50%,-50%) translateY(-18px) scale(1.08);
        }
      }

      @media (max-width:900px) {
        .products-runtime-grid,
        .products-product-grid,
        .products-runtime-receipt {
          grid-template-columns:repeat(2,minmax(0,1fr));
        }

        .products-season-lobe {
          width:min(210px,36vw);
          padding:14px;
        }

        .products-season-lobe.winter { left:6%; top:16%; }
        .products-season-lobe.summer { right:6%; top:16%; }
        .products-season-lobe.fall { left:6%; bottom:13%; }
        .products-season-lobe.spring { right:6%; bottom:13%; }
      }

      @media (max-width:640px) {
        [data-products-runtime-root] {
          width:min(100vw - 16px,1180px);
        }

        .products-molecule-stage {
          min-height:760px;
        }

        .products-runtime-grid,
        .products-product-grid,
        .products-runtime-receipt {
          grid-template-columns:1fr;
        }

        .products-stage-title,
        .products-stage-footer {
          border-radius:24px;
          font-size:.62rem;
        }

        .products-earth-throat {
          width:180px;
          height:180px;
        }

        .products-season-lobe {
          width:min(170px,43vw);
          min-height:112px;
          padding:12px;
        }

        .products-season-lobe strong {
          font-size:.98rem;
        }

        .products-season-lobe p {
          font-size:.78rem;
        }

        .products-point::after {
          display:none;
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
      { season: "winter", x: 31, y: 29 },
      { season: "winter", x: 37, y: 24 },
      { season: "winter", x: 43, y: 27 },
      { season: "winter", x: 39, y: 35 },
      { season: "winter", x: 34, y: 41 },
      { season: "winter", x: 45, y: 43 },
      { season: "winter", x: 48, y: 48 },
      { season: "winter", x: 50, y: 50 },

      { season: "spring", x: 50, y: 50 },
      { season: "spring", x: 53, y: 56 },
      { season: "spring", x: 60, y: 61 },
      { season: "spring", x: 66, y: 66 },
      { season: "spring", x: 62, y: 73 },
      { season: "spring", x: 68, y: 77 },
      { season: "spring", x: 73, y: 72 },
      { season: "spring", x: 69, y: 62 },

      { season: "summer", x: 69, y: 29 },
      { season: "summer", x: 63, y: 24 },
      { season: "summer", x: 57, y: 27 },
      { season: "summer", x: 61, y: 35 },
      { season: "summer", x: 66, y: 41 },
      { season: "summer", x: 55, y: 43 },
      { season: "summer", x: 52, y: 48 },
      { season: "summer", x: 50, y: 50 },

      { season: "fall", x: 50, y: 50 },
      { season: "fall", x: 47, y: 56 },
      { season: "fall", x: 40, y: 61 },
      { season: "fall", x: 34, y: 66 },
      { season: "fall", x: 38, y: 73 },
      { season: "fall", x: 32, y: 77 },
      { season: "fall", x: 27, y: 72 },
      { season: "fall", x: 31, y: 62 }
    ];
  }

  function buildMoleculePoints() {
    const counts = {};

    return pointCoordinates()
      .map((point, index) => {
        counts[point.season] = (counts[point.season] || 0) + 1;
        const label = `${point.season.slice(0, 2).toUpperCase()}${String(counts[point.season]).padStart(2, "0")}`;

        return `
          <span
            class="products-point ${point.season}"
            data-point="${label}"
            style="--x:${point.x};--y:${point.y};--delay:${(index % 8) * -0.22}s"
            aria-hidden="true"
          ></span>
        `;
      })
      .join("");
  }

  function buildSeasonLobes() {
    return seasons
      .map(
        (season) => `
          <article class="products-season-lobe ${season.key}">
            <small>${season.squad} · ${season.axis}</small>
            <strong>${season.label}</strong>
            <p>${season.line}</p>
          </article>
        `
      )
      .join("");
  }

  function buildSeasonCards() {
    return seasons
      .map(
        (season) => `
          <article class="products-runtime-card">
            <small>${season.axis}</small>
            <strong>${season.label} · ${season.squad}</strong>
            <p>${season.duty}</p>
          </article>
        `
      )
      .join("");
  }

  function buildProductCards() {
    return productLines
      .map(
        (product) => `
          <article class="products-product-card">
            <small>${product.code}</small>
            <strong>${product.title}</strong>
            <p>${product.body}</p>
          </article>
        `
      )
      .join("");
  }

  function buildHTML() {
    return `
      <section class="products-runtime-shell" data-products-runtime-root="true">
        <article class="products-runtime-hero">
          <div>
            <span class="products-runtime-eyebrow">Products · Second Generation Runtime</span>
            <h2>Four-season <span>product engine</span>.</h2>
            <p>
              The Products chamber now resolves as a second-generation runtime surface:
              four seasonal product families orbit one shared Earth throat, preserving
              the existing molecular-flower contract while binding it to the same shared
              globe standard used by the Door and Gauges.
            </p>
          </div>
        </article>

        <section class="products-runtime-window" aria-label="Four-season molecular product chamber">
          <div class="products-molecule-stage">
            <div class="products-stage-title">
              Four seasons · Thirty-two points · Two crossing figure-eights · Shared Earth throat
            </div>

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

            <div class="products-stage-footer">
              Winter + Spring form one diagonal loop · Summer + Fall form the opposing loop · Products emerge from the shared center
            </div>
          </div>
        </section>

        <section class="products-runtime-panel">
          <h3>Runtime contract.</h3>
          <p>
            This file owns the visible Products runtime surface. The bridge loads this
            runtime, the runtime mounts the chamber, and the shared Earth connector supplies
            the globe standard instead of duplicating globe logic.
          </p>

          <div class="products-runtime-receipt" aria-label="Runtime receipts">
            <span>Bridge loaded</span>
            <span>Runtime mounted</span>
            <span>Shared Earth requested</span>
            <span>Products chamber online</span>
          </div>
        </section>

        <section class="products-runtime-panel">
          <h3>Seasonal product lines.</h3>
          <p>
            The chamber is now ready for product-line expansion without changing the root,
            Gauges, or shared globe contract.
          </p>

          <div class="products-product-grid">
            ${buildProductCards()}
          </div>
        </section>

        <section class="products-runtime-panel">
          <h3>Seasonal molecule online.</h3>
          <p>
            The Products chamber resolves through one stained-glass vessel: Winter and
            Spring form one diagonal figure-eight, Summer and Fall form the opposing
            figure-eight, and both loops cross through a shared center throat.
          </p>

          <div class="products-runtime-grid">
            ${buildSeasonCards()}
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

        return {
          status: this.status,
          contract: this.contract,
          owner: "products_runtime.js"
        };
      }

      target.setAttribute("data-runtime-status", "mounting");
      target.setAttribute("data-runtime-contract", this.contract);
      target.setAttribute("data-runtime-owner", "products_runtime.js");
      target.setAttribute("data-products-runtime-version", "products-runtime-second-generation-v2");

      target.innerHTML = buildHTML();

      const sharedEarthMounted = await mountSharedEarth();

      target.setAttribute("data-runtime-status", "mounted");
      target.setAttribute("data-products-shared-earth", sharedEarthMounted ? "mounted" : "unavailable");

      window[RECEIPT_KEY] = true;
      this.status = "MOUNTED";

      this.write("info", "products second-generation molecular Earth chamber mounted by products_runtime.js");

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

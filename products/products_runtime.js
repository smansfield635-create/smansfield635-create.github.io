(() => {
  "use strict";

  const GLOBAL_KEY = "ProductsPlanetRuntime";
  const RECEIPT_KEY = "productsRuntimeMounted";
  const STYLE_ID = "products-gen2-product-first-runtime-v2-style";
  const CONTRACT = "PRODUCTS_GENERATION_2_PRODUCT_FIRST_CONTROL_SECOND_v2";
  const SHARED_EARTH_SRC = "/shared/earth_globe.js";
  const SHARED_EARTH_VERSION = "shared-earth-globe-axis-spin-v2";

  const seasons = [
    { key: "winter", label: "Winter", squad: "North", short: "Boundary" },
    { key: "spring", label: "Spring", squad: "South", short: "Continuity" },
    { key: "summer", label: "Summer", squad: "East", short: "Signal" },
    { key: "fall", label: "Fall", squad: "West", short: "Pressure" }
  ];

  const products = [
    {
      key: "winter",
      code: "NORTH",
      title: "Boundary Instruments",
      line: "Map, threshold, containment, and admissible-motion products."
    },
    {
      key: "spring",
      code: "SOUTH",
      title: "Continuity Instruments",
      line: "Repair, sequence, restoration, and living-system stability products."
    },
    {
      key: "summer",
      code: "EAST",
      title: "Signal Instruments",
      line: "Launch, learning, motion, traversal, and public-expression products."
    },
    {
      key: "fall",
      code: "WEST",
      title: "Pressure Instruments",
      line: "Audit, contradiction, friction, edge-case, and false-close products."
    }
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

      .products-gen2-shell {
        display:grid;
        gap:14px;
      }

      .products-product-first,
      .products-gen2-stage,
      .products-gen2-controls,
      .products-gen2-card,
      .products-product-tile {
        border:1px solid var(--products-line);
        background:
          radial-gradient(circle at 50% 0%,rgba(145,201,255,.12),transparent 34%),
          linear-gradient(180deg,var(--products-panel-strong),var(--products-panel));
        box-shadow:var(--products-shadow);
      }

      .products-product-first {
        border-radius:30px;
        padding:clamp(16px,2.5vw,24px);
        display:grid;
        gap:14px;
      }

      .products-product-head {
        display:flex;
        flex-wrap:wrap;
        align-items:end;
        justify-content:space-between;
        gap:10px;
      }

      .products-product-head h3 {
        margin:0;
        color:#fff;
        font-size:clamp(1.6rem,4vw,2.8rem);
        line-height:.95;
        letter-spacing:-.05em;
      }

      .products-product-head span {
        color:var(--products-muted);
        text-transform:uppercase;
        letter-spacing:.12em;
        font-size:.66rem;
        font-weight:850;
      }

      .products-product-grid {
        display:grid;
        grid-template-columns:repeat(4,minmax(0,1fr));
        gap:10px;
      }

      .products-product-tile {
        min-height:142px;
        border-radius:22px;
        padding:15px;
        display:grid;
        align-content:space-between;
        gap:10px;
        cursor:pointer;
        transition:
          transform .22s ease,
          border-color .22s ease,
          box-shadow .22s ease,
          opacity .22s ease;
      }

      .products-product-tile:hover,
      .products-product-tile.active {
        transform:translateY(-3px);
        border-color:rgba(240,213,155,.42);
        box-shadow:0 24px 72px rgba(0,0,0,.45),0 0 28px rgba(240,213,155,.12);
      }

      .products-product-tile small {
        display:block;
        color:#91a6cf;
        text-transform:uppercase;
        letter-spacing:.13em;
        font-size:.64rem;
        font-weight:850;
      }

      .products-product-tile strong {
        display:block;
        color:#fff;
        font-size:1.08rem;
        line-height:1.05;
      }

      .products-product-tile p {
        margin:0;
        color:var(--products-muted);
        font-size:.82rem;
        line-height:1.36;
      }

      .products-gen2-stage {
        position:relative;
        min-height:clamp(620px,72vw,790px);
        border-radius:32px;
        overflow:hidden;
        isolation:isolate;
        background:
          radial-gradient(circle at 50% 50%,rgba(240,213,155,.13),transparent 22%),
          radial-gradient(circle at 30% 30%,rgba(207,231,255,.11),transparent 24%),
          radial-gradient(circle at 70% 70%,rgba(147,239,189,.10),transparent 26%),
          linear-gradient(180deg,#050b18,#02050d);
      }

      .products-gen2-stage::before {
        content:"";
        position:absolute;
        inset:18px;
        z-index:9;
        border-radius:26px;
        border:1px solid rgba(255,255,255,.10);
        box-shadow:inset 0 0 36px rgba(145,201,255,.12);
        pointer-events:none;
      }

      .products-gen2-stage::after {
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

      .products-gen2-title {
        position:absolute;
        left:50%;
        top:5%;
        z-index:12;
        width:min(420px,78%);
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

      .products-gen2-orbit {
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

      .products-gen2-orbit.winter-spring {
        transform:translate(-50%,-50%) rotate(45deg);
        animation:productsOrbitA 9s ease-in-out infinite;
      }

      .products-gen2-orbit.summer-fall {
        transform:translate(-50%,-50%) rotate(-45deg);
        animation:productsOrbitB 9s ease-in-out infinite;
      }

      .products-gen2-earth {
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
        filter:drop-shadow(0 0 34px rgba(255,255,255,.20));
      }

      .products-gen2-earth::before {
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

      .products-season-node {
        position:absolute;
        z-index:10;
        width:min(142px,25vw);
        min-height:68px;
        padding:10px 11px;
        border:1px solid var(--products-line);
        border-radius:22px;
        background:rgba(5,12,26,.74);
        backdrop-filter:blur(12px);
        display:grid;
        align-content:center;
        gap:3px;
        transition:
          opacity .22s ease,
          transform .22s ease,
          border-color .22s ease,
          box-shadow .22s ease;
      }

      .products-season-node small {
        display:block;
        margin:0;
        color:var(--products-muted);
        text-transform:uppercase;
        letter-spacing:.12em;
        font-size:.50rem;
        font-weight:850;
        line-height:1.15;
      }

      .products-season-node strong {
        display:block;
        margin:0;
        color:#fff;
        font-size:.92rem;
        line-height:1.05;
      }

      .products-season-node p {
        margin:0;
        color:var(--products-muted);
        font-size:.56rem;
        line-height:1.15;
        text-transform:uppercase;
        letter-spacing:.08em;
        font-weight:800;
      }

      .products-season-node.winter {
        left:8%;
        top:18%;
        border-color:rgba(207,231,255,.38);
      }

      .products-season-node.spring {
        right:8%;
        bottom:16%;
        border-color:rgba(147,239,189,.38);
      }

      .products-season-node.summer {
        right:8%;
        top:18%;
        border-color:rgba(145,201,255,.38);
      }

      .products-season-node.fall {
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
        transition:opacity .22s ease, transform .22s ease;
      }

      .products-point.winter { --point-color:var(--products-winter); }
      .products-point.spring { --point-color:var(--products-spring); }
      .products-point.summer { --point-color:var(--products-summer); }
      .products-point.fall { --point-color:var(--products-fall); }

      .products-gen2-stage[data-focus="winter"] .products-season-node:not(.winter),
      .products-gen2-stage[data-focus="spring"] .products-season-node:not(.spring),
      .products-gen2-stage[data-focus="summer"] .products-season-node:not(.summer),
      .products-gen2-stage[data-focus="fall"] .products-season-node:not(.fall),
      .products-gen2-stage[data-focus="winter"] .products-point:not(.winter),
      .products-gen2-stage[data-focus="spring"] .products-point:not(.spring),
      .products-gen2-stage[data-focus="summer"] .products-point:not(.summer),
      .products-gen2-stage[data-focus="fall"] .products-point:not(.fall) {
        opacity:.18;
      }

      .products-gen2-stage[data-focus="winter"] .products-season-node.winter,
      .products-gen2-stage[data-focus="spring"] .products-season-node.spring,
      .products-gen2-stage[data-focus="summer"] .products-season-node.summer,
      .products-gen2-stage[data-focus="fall"] .products-season-node.fall {
        transform:scale(1.06);
        box-shadow:0 0 28px rgba(255,255,255,.14);
      }

      .products-gen2-stage[data-density="clean"] .products-season-node p {
        display:none;
      }

      .products-gen2-stage[data-density="detail"] .products-season-node p {
        display:block;
      }

      .products-gen2-stage[data-spin="paused"] .products-gen2-orbit,
      .products-gen2-stage[data-spin="paused"] .products-point {
        animation-play-state:paused;
      }

      .products-gen2-controls {
        border-radius:28px;
        padding:clamp(14px,2vw,20px);
        display:grid;
        gap:14px;
      }

      .products-control-head {
        display:flex;
        flex-wrap:wrap;
        align-items:center;
        justify-content:space-between;
        gap:10px;
      }

      .products-control-head h3 {
        margin:0;
        color:#fff;
        font-size:clamp(1.35rem,3vw,2.05rem);
        line-height:1;
        letter-spacing:-.04em;
      }

      .products-control-head span {
        color:var(--products-muted);
        text-transform:uppercase;
        letter-spacing:.12em;
        font-size:.64rem;
        font-weight:850;
      }

      .products-control-grid {
        display:grid;
        grid-template-columns:repeat(4,minmax(0,1fr));
        gap:10px;
      }

      .products-control-group {
        display:grid;
        gap:8px;
        padding:12px;
        border:1px solid rgba(177,199,255,.15);
        border-radius:20px;
        background:rgba(255,255,255,.035);
      }

      .products-control-group small {
        color:#91a6cf;
        text-transform:uppercase;
        letter-spacing:.12em;
        font-size:.62rem;
        font-weight:850;
      }

      .products-control-group button {
        min-height:36px;
        border:1px solid rgba(177,199,255,.18);
        border-radius:999px;
        background:rgba(255,255,255,.04);
        color:#dce7ff;
        font:inherit;
        font-size:.78rem;
        font-weight:850;
        cursor:pointer;
      }

      .products-control-group button[aria-pressed="true"],
      .products-control-group button.active {
        border-color:rgba(240,213,155,.42);
        background:rgba(240,213,155,.14);
        color:#fff8ea;
      }

      .products-bubble-row {
        display:flex;
        flex-wrap:wrap;
        gap:8px;
      }

      .products-bubble-row span {
        border:1px solid rgba(177,199,255,.15);
        border-radius:999px;
        padding:8px 10px;
        color:#dce7ff;
        background:rgba(255,255,255,.035);
        font-size:.68rem;
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
        .products-product-grid,
        .products-control-grid {
          grid-template-columns:repeat(2,minmax(0,1fr));
        }

        .products-season-node {
          width:min(132px,31vw);
          min-height:62px;
        }

        .products-season-node.winter { left:5%; top:17%; }
        .products-season-node.summer { right:5%; top:17%; }
        .products-season-node.fall { left:5%; bottom:15%; }
        .products-season-node.spring { right:5%; bottom:15%; }
      }

      @media (max-width:640px) {
        .products-product-grid,
        .products-control-grid {
          grid-template-columns:1fr;
        }

        .products-gen2-stage {
          min-height:680px;
        }

        .products-gen2-title {
          border-radius:22px;
          font-size:.50rem;
          width:min(330px,72%);
        }

        .products-gen2-earth {
          width:176px;
          height:176px;
        }

        .products-season-node {
          width:min(112px,34vw);
          min-height:54px;
          padding:8px;
          border-radius:18px;
        }

        .products-season-node small {
          font-size:.44rem;
        }

        .products-season-node strong {
          font-size:.76rem;
        }

        .products-season-node p {
          font-size:.50rem;
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

  function buildProducts() {
    return products
      .map((product) => `
        <button
          class="products-product-tile"
          type="button"
          data-product-focus="${product.key}"
          aria-label="Focus ${product.title}"
        >
          <small>${product.code}</small>
          <strong>${product.title}</strong>
          <p>${product.line}</p>
        </button>
      `)
      .join("");
  }

  function buildMoleculePoints() {
    return pointCoordinates()
      .map((point, index) => `
        <span
          class="products-point ${point.season}"
          data-season="${point.season}"
          style="--x:${point.x};--y:${point.y};--delay:${(index % 8) * -0.22}s"
          aria-hidden="true"
        ></span>
      `)
      .join("");
  }

  function buildSeasonNodes() {
    return seasons
      .map((season) => `
        <article class="products-season-node ${season.key}" data-season="${season.key}">
          <small>${season.squad}</small>
          <strong>${season.label}</strong>
          <p>${season.short}</p>
        </article>
      `)
      .join("");
  }

  function buildHTML() {
    return `
      <section
        class="products-gen2-shell"
        data-products-runtime-root="true"
        data-products-generation="2"
        data-products-product-first="true"
        data-products-control-surface="true"
      >
        <section class="products-product-first" aria-label="Products first">
          <div class="products-product-head">
            <h3>Products.</h3>
            <span>Generation 2 · product first</span>
          </div>

          <div class="products-product-grid">
            ${buildProducts()}
          </div>
        </section>

        <section
          id="productsGen2Stage"
          class="products-gen2-stage"
          data-focus="all"
          data-density="clean"
          data-spin="playing"
          data-speed="normal"
          aria-label="Products Generation 2 globe surface"
        >
          <div class="products-gen2-title">Products G2 · shared Earth chamber</div>

          <span class="products-gen2-orbit winter-spring" aria-hidden="true"></span>
          <span class="products-gen2-orbit summer-fall" aria-hidden="true"></span>

          <div
            id="productsEarthThroat"
            class="products-gen2-earth"
            data-products-earth-throat="pending"
            aria-label="Shared Earth throat"
          ></div>

          ${buildMoleculePoints()}
          ${buildSeasonNodes()}
        </section>

        <section class="products-gen2-controls" aria-label="Products operator controls">
          <div class="products-control-head">
            <h3>Controls.</h3>
            <span id="productsControlReceipt">Spin: playing · Speed: normal · Focus: all · Density: clean</span>
          </div>

          <div class="products-control-grid">
            <div class="products-control-group">
              <small>Spin</small>
              <button type="button" data-control="spin" data-value="playing" aria-pressed="true">Play</button>
              <button type="button" data-control="spin" data-value="paused" aria-pressed="false">Pause</button>
            </div>

            <div class="products-control-group">
              <small>Speed</small>
              <button type="button" data-control="speed" data-value="slow" aria-pressed="false">Slow</button>
              <button type="button" data-control="speed" data-value="normal" aria-pressed="true">Normal</button>
              <button type="button" data-control="speed" data-value="fast" aria-pressed="false">Fast</button>
            </div>

            <div class="products-control-group">
              <small>Focus</small>
              <button type="button" data-control="focus" data-value="all" aria-pressed="true">All</button>
              <button type="button" data-control="focus" data-value="winter" aria-pressed="false">Winter</button>
              <button type="button" data-control="focus" data-value="spring" aria-pressed="false">Spring</button>
              <button type="button" data-control="focus" data-value="summer" aria-pressed="false">Summer</button>
              <button type="button" data-control="focus" data-value="fall" aria-pressed="false">Fall</button>
            </div>

            <div class="products-control-group">
              <small>Density</small>
              <button type="button" data-control="density" data-value="clean" aria-pressed="true">Clean</button>
              <button type="button" data-control="density" data-value="detail" aria-pressed="false">Detail</button>
            </div>
          </div>

          <div class="products-bubble-row" aria-label="Runtime receipts">
            <span>G2 active</span>
            <span>Products first</span>
            <span>Globe online</span>
            <span>Controls below</span>
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

  function setSharedEarthSpeed(speed) {
    const globe = document.querySelector("#productsEarthThroat .dgb-earth-globe");
    if (!globe) return;

    const durations = {
      slow: ["68s", "96s"],
      normal: ["52s", "76s"],
      fast: ["30s", "48s"]
    };

    const [textureDuration, cloudDuration] = durations[speed] || durations.normal;

    globe.style.setProperty("--earth-texture-duration", textureDuration);
    globe.style.setProperty("--earth-cloud-duration", cloudDuration);
  }

  function setSharedEarthSpin(spin) {
    const throat = document.getElementById("productsEarthThroat");
    if (!throat) return;

    throat.dataset.spin = spin;

    const globe = throat.querySelector(".dgb-earth-globe");
    if (!globe) return;

    globe.querySelectorAll(".dgb-earth-globe__texture, .dgb-earth-globe__cloud-layer").forEach((node) => {
      node.style.animationPlayState = spin === "paused" ? "paused" : "running";
    });
  }

  function updatePressedStates(control, value) {
    document.querySelectorAll(`[data-control="${control}"]`).forEach((button) => {
      const active = button.dataset.value === value;
      button.setAttribute("aria-pressed", active ? "true" : "false");
      button.classList.toggle("active", active);
    });
  }

  function updateProductTiles(value) {
    document.querySelectorAll("[data-product-focus]").forEach((tile) => {
      tile.classList.toggle("active", tile.dataset.productFocus === value);
    });
  }

  function updateReceipt(stage) {
    const receipt = document.getElementById("productsControlReceipt");
    if (!receipt || !stage) return;

    receipt.textContent =
      `Spin: ${stage.dataset.spin} · Speed: ${stage.dataset.speed} · Focus: ${stage.dataset.focus} · Density: ${stage.dataset.density}`;
  }

  function setFocus(value) {
    const stage = document.getElementById("productsGen2Stage");
    if (!stage) return;

    stage.dataset.focus = value;
    updatePressedStates("focus", value);
    updateProductTiles(value);
    updateReceipt(stage);

    if (value !== "all") {
      stage.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function bindProductTiles() {
    document.querySelectorAll("[data-product-focus]").forEach((tile) => {
      tile.addEventListener("click", () => {
        const value = tile.dataset.productFocus;
        if (!value) return;
        setFocus(value);
      });
    });
  }

  function bindControls() {
    const stage = document.getElementById("productsGen2Stage");
    if (!stage) return;

    document.querySelectorAll("[data-control]").forEach((button) => {
      button.addEventListener("click", () => {
        const control = button.dataset.control;
        const value = button.dataset.value;

        if (!control || !value) return;

        stage.dataset[control] = value;
        updatePressedStates(control, value);

        if (control === "speed") setSharedEarthSpeed(value);
        if (control === "spin") setSharedEarthSpin(value);
        if (control === "focus") updateProductTiles(value);

        updateReceipt(stage);
      });
    });

    updateReceipt(stage);
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
      target.setAttribute("data-products-runtime-version", "products-gen2-product-first-v2");

      target.innerHTML = buildHTML();

      const sharedEarthMounted = await mountSharedEarth();

      bindProductTiles();
      bindControls();
      setSharedEarthSpeed("normal");
      setSharedEarthSpin("playing");

      target.setAttribute("data-runtime-status", "mounted");
      target.setAttribute("data-products-shared-earth", sharedEarthMounted ? "mounted" : "unavailable");
      target.setAttribute("data-products-gen2-controls", "active");
      target.setAttribute("data-products-order", "product-first-control-second");

      window[RECEIPT_KEY] = true;
      this.status = "MOUNTED";

      window.dispatchEvent(
        new CustomEvent("products-runtime-mounted", {
          detail: {
            status: this.status,
            contract: this.contract,
            owner: "products_runtime.js",
            sharedEarthMounted,
            controls: "active",
            order: "product-first-control-second"
          }
        })
      );

      return {
        status: this.status,
        contract: this.contract,
        owner: "products_runtime.js",
        sharedEarthMounted,
        controls: "active"
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

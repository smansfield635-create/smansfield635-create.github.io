(() => {
  "use strict";

  const GLOBAL_KEY = "ProductsPlanetRuntime";
  const STYLE_ID = "products-monarch-fairy-runtime-v1-style";
  const ASSET_URL = "/assets/seasonal-monarch-butterfly.svg?v=7";

  const seasons = [
    { key: "winter", label: "Winter" },
    { key: "summer", label: "Summer" },
    { key: "fall", label: "Fall" },
    { key: "spring", label: "Spring" }
  ];

  const fairies = [
    { type: "green", path: "nw", x: 35, y: 29, d: "0s" },
    { type: "green", path: "nw", x: 29, y: 38, d: "-1.1s" },
    { type: "green", path: "nw", x: 38, y: 50, d: "-2.2s" },

    { type: "blue", path: "ne", x: 65, y: 29, d: "-.35s" },
    { type: "blue", path: "ne", x: 71, y: 38, d: "-1.45s" },
    { type: "blue", path: "ne", x: 62, y: 50, d: "-2.55s" },

    { type: "blue", path: "sw", x: 34, y: 67, d: "-.7s" },
    { type: "blue", path: "sw", x: 42, y: 76, d: "-1.8s" },
    { type: "blue", path: "sw", x: 30, y: 82, d: "-2.9s" },

    { type: "green", path: "se", x: 66, y: 67, d: "-.95s" },
    { type: "green", path: "se", x: 58, y: 76, d: "-2.05s" },
    { type: "green", path: "se", x: 70, y: 82, d: "-3.15s" },

    { type: "green", path: "center-a", x: 49, y: 51, d: "-.2s" },
    { type: "blue", path: "center-b", x: 51, y: 51, d: "-1.3s" },
    { type: "blue", path: "center-a", x: 50, y: 57, d: "-2.4s" },
    { type: "green", path: "center-b", x: 50, y: 45, d: "-3.5s" }
  ];

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
        --products-line: rgba(164,188,255,.18);
        --products-line-strong: rgba(210,223,255,.36);
        --products-text: #eef4ff;
        --products-muted: #9aabd0;
        --products-gold: #efd29a;
        --products-blue: #8ec5ff;
        --products-green: #92e7ba;
        --products-shadow: 0 24px 80px rgba(0,0,0,.52);
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        color: var(--products-text);
        font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background:
          radial-gradient(circle at 50% 8%, rgba(112,151,255,.22), transparent 22%),
          radial-gradient(circle at 18% 34%, rgba(239,210,154,.10), transparent 24%),
          linear-gradient(180deg, #020610 0%, #071225 48%, #020610 100%);
      }

      body::before {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        opacity: .22;
        background:
          linear-gradient(90deg, rgba(164,188,255,.08) 1px, transparent 1px),
          linear-gradient(180deg, rgba(164,188,255,.045) 1px, transparent 1px);
        background-size: 52px 52px;
        mask-image: radial-gradient(circle at 50% 32%, black, transparent 78%);
      }

      .products-page {
        width: min(1180px, calc(100vw - 24px));
        margin: 0 auto;
        padding: 18px 0 44px;
        position: relative;
        z-index: 1;
      }

      .products-topbar,
      .products-hero,
      .products-window,
      .products-panel,
      .products-card {
        border: 1px solid var(--products-line);
        background: linear-gradient(180deg, rgba(9,17,33,.92), rgba(6,12,24,.86));
        box-shadow: var(--products-shadow);
      }

      .products-topbar {
        border-radius: 22px;
        padding: 14px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        margin-bottom: 16px;
      }

      .products-brand {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .products-mark {
        width: 46px;
        height: 46px;
        border-radius: 16px;
        display: grid;
        place-items: center;
        border: 1px solid var(--products-line);
        background:
          radial-gradient(circle at 50% 28%, rgba(239,210,154,.22), transparent 42%),
          linear-gradient(180deg, rgba(26,43,78,.9), rgba(10,18,32,.97));
        font-weight: 900;
        letter-spacing: .08em;
      }

      .products-kicker {
        margin: 0 0 4px;
        color: #c8d7ff;
        font-size: .72rem;
        text-transform: uppercase;
        letter-spacing: .16em;
      }

      .products-title {
        margin: 0;
        font-weight: 850;
        font-size: 1.05rem;
      }

      .products-nav {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 10px;
      }

      .products-nav a,
      .products-button {
        min-height: 42px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0 15px;
        border: 1px solid var(--products-line);
        border-radius: 999px;
        color: var(--products-text);
        background: rgba(255,255,255,.035);
        text-decoration: none;
        font-weight: 800;
      }

      .products-hero {
        border-radius: 34px;
        padding: 24px 20px;
        margin-bottom: 18px;
      }

      .products-hero-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(320px, .95fr);
        gap: 20px;
        align-items: center;
      }

      .products-pill {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        border-radius: 999px;
        border: 1px solid var(--products-line);
        background: rgba(255,255,255,.035);
        color: #d8e3ff;
        text-transform: uppercase;
        letter-spacing: .14em;
        font-size: .72rem;
        margin-bottom: 14px;
      }

      .products-pill::before {
        content: "";
        width: 9px;
        height: 9px;
        border-radius: 2px;
        transform: rotate(45deg);
        background: var(--products-gold);
        box-shadow: 0 0 18px rgba(239,210,154,.50);
      }

      .products-hero h1 {
        margin: 0 0 12px;
        max-width: 12ch;
        font-size: clamp(2.35rem, 5vw, 5rem);
        line-height: .95;
        letter-spacing: -.06em;
      }

      .products-hero h1 span {
        color: var(--products-gold);
      }

      .products-hero p {
        margin: 0;
        max-width: 68ch;
        color: var(--products-muted);
        line-height: 1.62;
        font-size: clamp(1rem, 1.45vw, 1.14rem);
      }

      .products-actions {
        margin-top: 20px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .products-button {
        border-radius: 18px;
        min-height: 48px;
        padding: 0 18px;
      }

      .products-button.primary {
        border-color: rgba(239,210,154,.34);
        background:
          linear-gradient(180deg, rgba(239,210,154,.20), rgba(239,210,154,.06)),
          rgba(255,255,255,.035);
        color: #fff8ea;
      }

      .products-window {
        border-radius: 34px;
        padding: 22px;
        overflow: hidden;
      }

      .molecule-stage {
        position: relative;
        min-height: 760px;
        border-radius: 30px;
        overflow: hidden;
        border: 1px solid rgba(170,198,255,.18);
        background:
          radial-gradient(circle at 50% 50%, rgba(239,210,154,.10), transparent 26%),
          linear-gradient(180deg, rgba(5,12,26,.98), rgba(2,7,16,.99));
        isolation: isolate;
      }

      .molecule-stage::before {
        content: "";
        position: absolute;
        inset: 18px;
        border-radius: 26px;
        border: 1px solid rgba(255,255,255,.10);
        box-shadow: inset 0 0 30px rgba(126,164,255,.12);
        z-index: 4;
        pointer-events: none;
      }

      .season-grid {
        position: absolute;
        inset: 6%;
        z-index: 1;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        border-radius: 28px;
        overflow: hidden;
        opacity: .58;
      }

      .season-cell {
        border: 1px solid rgba(255,255,255,.10);
        background: rgba(255,255,255,.02);
      }

      .season-cell.winter {
        background: linear-gradient(135deg, rgba(230,240,255,.20), rgba(88,118,165,.05));
      }

      .season-cell.summer {
        background: linear-gradient(135deg, rgba(91,190,255,.16), rgba(20,66,110,.05));
      }

      .season-cell.fall {
        background: linear-gradient(135deg, rgba(239,178,84,.18), rgba(95,49,18,.06));
      }

      .season-cell.spring {
        background: linear-gradient(135deg, rgba(105,229,162,.18), rgba(20,92,66,.06));
      }

      .butterfly-layer {
        position: absolute;
        inset: 0;
        z-index: 2;
        display: grid;
        place-items: center;
        pointer-events: none;
      }

      .butterfly-layer object,
      .butterfly-layer img {
        width: 112%;
        height: 112%;
        display: block;
        border: 0;
        object-fit: cover;
        opacity: .92;
        filter:
          drop-shadow(0 0 26px rgba(239,210,154,.16))
          drop-shadow(0 0 48px rgba(112,151,255,.10));
      }

      .transversal-layer {
        position: absolute;
        inset: 0;
        z-index: 5;
        pointer-events: none;
      }

      .transversal-path {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 62%;
        height: 62%;
        border-radius: 50%;
        border: 6px solid rgba(210,238,255,.16);
        filter: blur(.1px) drop-shadow(0 0 18px rgba(190,230,255,.12));
        transform-origin: center;
        opacity: .58;
      }

      .transversal-path.one {
        transform: translate(-50%, -50%) rotate(45deg) scaleX(.42);
        animation: orbitBreathA 6s ease-in-out infinite;
      }

      .transversal-path.two {
        transform: translate(-50%, -50%) rotate(-45deg) scaleX(.42);
        animation: orbitBreathB 6s ease-in-out infinite;
      }

      .fairy {
        position: absolute;
        left: calc(var(--x) * 1%);
        top: calc(var(--y) * 1%);
        width: 38px;
        height: 42px;
        transform: translate(-50%, -50%);
        animation: fairyTravel 5.8s ease-in-out infinite;
        animation-delay: var(--delay);
        filter:
          drop-shadow(0 0 10px var(--fairy-color))
          drop-shadow(0 0 26px rgba(210,240,255,.26));
      }

      .fairy::before,
      .fairy::after {
        content: "";
        position: absolute;
        top: 5px;
        width: 18px;
        height: 27px;
        border-radius: 80% 20% 80% 20%;
        background:
          radial-gradient(circle at 42% 42%, rgba(255,255,255,.92), rgba(255,255,255,.34) 26%, var(--fairy-color) 56%, rgba(255,255,255,0) 82%);
        border: 1px solid rgba(255,255,255,.62);
        opacity: .88;
        transform-origin: 50% 80%;
        animation: wingFlutter .62s ease-in-out infinite;
      }

      .fairy::before {
        left: 1px;
        transform: rotate(-28deg);
      }

      .fairy::after {
        right: 1px;
        transform: scaleX(-1) rotate(-28deg);
        animation-delay: -.31s;
      }

      .fairy-core {
        position: absolute;
        left: 50%;
        top: 48%;
        width: 14px;
        height: 22px;
        transform: translate(-50%, -50%);
        border-radius: 999px;
        background:
          radial-gradient(circle at 50% 28%, #fff, var(--fairy-color) 50%, rgba(4,10,22,.88) 100%);
        border: 1px solid rgba(255,255,255,.72);
        box-shadow:
          0 0 18px var(--fairy-color),
          0 0 42px rgba(210,240,255,.25);
      }

      .fairy-trail {
        position: absolute;
        left: 50%;
        top: 52%;
        width: 2px;
        height: 58px;
        transform: translate(-50%, 0);
        border-radius: 999px;
        background: linear-gradient(180deg, var(--fairy-color), rgba(255,255,255,0));
        opacity: .38;
      }

      .fairy.green {
        --fairy-color: #92e7ba;
      }

      .fairy.blue {
        --fairy-color: #8ec5ff;
      }

      .fairy.nw,
      .fairy.se {
        animation-name: fairyFigureEightA;
      }

      .fairy.ne,
      .fairy.sw {
        animation-name: fairyFigureEightB;
      }

      .fairy.center-a {
        animation-name: fairyCenterA;
      }

      .fairy.center-b {
        animation-name: fairyCenterB;
      }

      .molecule-center {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 104px;
        height: 104px;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        z-index: 6;
        background: radial-gradient(circle, #fff 0 8%, rgba(236,247,255,.72) 12%, rgba(127,197,255,.22) 38%, transparent 72%);
        filter: drop-shadow(0 0 28px rgba(255,255,255,.42));
        animation: centerPulse 4.2s ease-in-out infinite;
      }

      .season-label {
        position: absolute;
        z-index: 7;
        min-width: 132px;
        min-height: 46px;
        display: grid;
        place-items: center;
        border-radius: 999px;
        border: 1px solid rgba(164,188,255,.24);
        background: rgba(5,12,26,.82);
        color: #fff;
        font-size: .78rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: .16em;
        backdrop-filter: blur(10px);
      }

      .season-label.winter {
        left: 22%;
        top: 26%;
      }

      .season-label.summer {
        right: 22%;
        top: 26%;
      }

      .season-label.fall {
        left: 22%;
        bottom: 17%;
      }

      .season-label.spring {
        right: 22%;
        bottom: 17%;
      }

      .stage-badge {
        position: absolute;
        left: 50%;
        top: 5%;
        transform: translateX(-50%);
        z-index: 8;
        width: min(430px, 80%);
        padding: 18px;
        border-radius: 999px;
        text-align: center;
        border: 1px solid rgba(164,188,255,.24);
        background: rgba(5,12,26,.84);
        color: #dce7ff;
        text-transform: uppercase;
        letter-spacing: .16em;
        line-height: 1.5;
        font-weight: 800;
        backdrop-filter: blur(10px);
      }

      .stage-footer {
        position: absolute;
        left: 50%;
        bottom: 5%;
        transform: translateX(-50%);
        z-index: 8;
        width: min(760px, 84%);
        padding: 16px 18px;
        border-radius: 999px;
        text-align: center;
        border: 1px solid rgba(164,188,255,.24);
        background: rgba(5,12,26,.84);
        color: #dce7ff;
        text-transform: uppercase;
        letter-spacing: .14em;
        line-height: 1.45;
        font-weight: 800;
        backdrop-filter: blur(10px);
      }

      .stage-footer strong {
        color: #fff;
      }

      .products-panel {
        margin-top: 18px;
        border-radius: 30px;
        padding: 22px 20px;
      }

      .products-panel h2 {
        margin: 0 0 10px;
        font-size: clamp(1.7rem, 3vw, 2.7rem);
        line-height: 1;
        letter-spacing: -.04em;
      }

      .products-panel p {
        margin: 0;
        color: var(--products-muted);
        line-height: 1.6;
      }

      .products-card-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        margin-top: 18px;
      }

      .products-card {
        border-radius: 22px;
        padding: 16px;
        min-height: 140px;
        border-color: rgba(164,188,255,.14);
      }

      .products-card small {
        display: block;
        color: #90a3ce;
        text-transform: uppercase;
        letter-spacing: .12em;
        margin-bottom: 8px;
        font-weight: 800;
        font-size: .72rem;
      }

      .products-card strong {
        display: block;
        color: #f4f7ff;
        font-size: 1.2rem;
        line-height: 1.08;
        margin-bottom: 10px;
      }

      .products-card p {
        font-size: .92rem;
      }

      .products-footer {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        color: var(--products-muted);
        padding: 14px 4px 0;
      }

      .products-footer a {
        color: var(--products-muted);
        text-decoration: none;
        margin-left: 12px;
      }

      @keyframes fairyFigureEightA {
        0%, 100% {
          transform: translate(-50%, -50%) translate(0, 0) rotate(-8deg) scale(.96);
        }
        25% {
          transform: translate(-50%, -50%) translate(22px, -18px) rotate(10deg) scale(1.05);
        }
        50% {
          transform: translate(-50%, -50%) translate(0, -34px) rotate(0deg) scale(1.1);
        }
        75% {
          transform: translate(-50%, -50%) translate(-22px, -18px) rotate(-10deg) scale(1.05);
        }
      }

      @keyframes fairyFigureEightB {
        0%, 100% {
          transform: translate(-50%, -50%) translate(0, 0) rotate(8deg) scale(.96);
        }
        25% {
          transform: translate(-50%, -50%) translate(-22px, -18px) rotate(-10deg) scale(1.05);
        }
        50% {
          transform: translate(-50%, -50%) translate(0, -34px) rotate(0deg) scale(1.1);
        }
        75% {
          transform: translate(-50%, -50%) translate(22px, -18px) rotate(10deg) scale(1.05);
        }
      }

      @keyframes fairyCenterA {
        0%, 100% {
          transform: translate(-50%, -50%) translate(-8px, 0) scale(.92);
        }
        50% {
          transform: translate(-50%, -50%) translate(8px, -18px) scale(1.08);
        }
      }

      @keyframes fairyCenterB {
        0%, 100% {
          transform: translate(-50%, -50%) translate(8px, 0) scale(.92);
        }
        50% {
          transform: translate(-50%, -50%) translate(-8px, -18px) scale(1.08);
        }
      }

      @keyframes wingFlutter {
        0%, 100% {
          opacity: .74;
          transform: rotate(-28deg) scaleY(.88);
        }
        50% {
          opacity: 1;
          transform: rotate(-42deg) scaleY(1.12);
        }
      }

      @keyframes centerPulse {
        0%, 100% {
          opacity: .72;
          transform: translate(-50%, -50%) scale(.95);
        }
        50% {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1.08);
        }
      }

      @keyframes orbitBreathA {
        0%, 100% {
          transform: translate(-50%, -50%) rotate(45deg) scaleX(.42);
          opacity: .50;
        }
        50% {
          transform: translate(-50%, -50%) rotate(48deg) scaleX(.48);
          opacity: .74;
        }
      }

      @keyframes orbitBreathB {
        0%, 100% {
          transform: translate(-50%, -50%) rotate(-45deg) scaleX(.42);
          opacity: .50;
        }
        50% {
          transform: translate(-50%, -50%) rotate(-48deg) scaleX(.48);
          opacity: .74;
        }
      }

      @media (max-width: 900px) {
        .products-hero-grid {
          grid-template-columns: 1fr;
        }

        .products-card-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 720px) {
        .products-page {
          width: min(100vw - 16px, 1180px);
          padding: 14px 0 32px;
        }

        .products-topbar {
          flex-wrap: wrap;
        }

        .products-nav {
          width: 100%;
          justify-content: flex-start;
        }

        .products-hero,
        .products-window,
        .products-panel {
          padding: 18px 16px;
        }

        .products-hero h1 {
          font-size: clamp(2rem, 11vw, 3.4rem);
        }

        .molecule-stage {
          min-height: 720px;
        }

        .fairy {
          width: 32px;
          height: 36px;
        }

        .fairy::before,
        .fairy::after {
          width: 15px;
          height: 23px;
        }

        .fairy-core {
          width: 12px;
          height: 19px;
        }

        .season-label {
          min-width: 108px;
          font-size: .68rem;
        }

        .season-label.winter {
          left: 21%;
          top: 27%;
        }

        .season-label.summer {
          right: 21%;
          top: 27%;
        }

        .season-label.fall {
          left: 21%;
          bottom: 17%;
        }

        .season-label.spring {
          right: 21%;
          bottom: 17%;
        }

        .stage-badge {
          font-size: .70rem;
          width: 76%;
          top: 5%;
        }

        .stage-footer {
          font-size: .66rem;
          width: 82%;
          bottom: 5%;
        }

        .products-card-grid {
          grid-template-columns: 1fr;
        }

        .products-footer {
          display: grid;
        }

        .products-footer a {
          margin-left: 0;
          margin-right: 12px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        * {
          animation: none !important;
          scroll-behavior: auto !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function html() {
    return `
      <main class="products-page">
        <header class="products-topbar">
          <div class="products-brand">
            <div class="products-mark">DG</div>
            <div>
              <p class="products-kicker">Products</p>
              <p class="products-title">Seasonal Monarch Fairies</p>
            </div>
          </div>

          <nav class="products-nav" aria-label="Products navigation">
            <a href="/">Home</a>
            <a href="/about/">About</a>
            <a href="/gauges/">Gauges</a>
            <a href="/laws/">Laws</a>
          </nav>
        </header>

        <section class="products-hero">
          <div class="products-hero-grid">
            <div>
              <span class="products-pill">2 figure-eights · 4 seasons · fairy paths</span>
              <h1>A monarch vessel with <span>fairies in motion.</span></h1>
              <p>
                The butterfly holds the seasonal field. The fairies move in front of it, crossing the bilateral and quadrilateral paths of the two figure-eights.
              </p>

              <div class="products-actions">
                <a class="products-button primary" href="#molecule">Open molecule</a>
                <a class="products-button" href="/gauges/">Gauges</a>
                <a class="products-button" href="/">Back to door</a>
              </div>
            </div>

            <section class="products-window" id="molecule" aria-label="Floating seasonal monarch fairy chamber">
              <div class="molecule-stage">
                <div class="season-grid" aria-hidden="true">
                  <div class="season-cell winter"></div>
                  <div class="season-cell summer"></div>
                  <div class="season-cell fall"></div>
                  <div class="season-cell spring"></div>
                </div>

                <div class="butterfly-layer" aria-hidden="true">
                  <object type="image/svg+xml" data="${ASSET_URL}">
                    <img src="${ASSET_URL}" alt="" />
                  </object>
                </div>

                <div class="transversal-layer" aria-hidden="true">
                  <div class="transversal-path one"></div>
                  <div class="transversal-path two"></div>
                  <div class="molecule-center"></div>

                  ${fairies.map((fairy) => `
                    <span
                      class="fairy ${fairy.type} ${fairy.path}"
                      style="--x:${fairy.x};--y:${fairy.y};--delay:${fairy.d}"
                    >
                      <span class="fairy-trail"></span>
                      <span class="fairy-core"></span>
                    </span>
                  `).join("")}
                </div>

                ${seasons.map((season) => `
                  <div class="season-label ${season.key}">${season.label}</div>
                `).join("")}

                <div class="stage-badge">Floating seasonal fairies · monarch stained glass</div>
                <div class="stage-footer"><strong>Fairies in front</strong> · stained glass behind them, motion crossing through the center</div>
              </div>
            </section>
          </div>
        </section>

        <section class="products-panel">
          <p class="products-kicker">Generation 4 visual logic</p>
          <h2>The bubbles become fairies.</h2>
          <p>
            The seasonal molecule now reads as a living monarch field. The fairies carry the motion, crossing the bilateral and quadrilateral paths while the butterfly remains the vessel behind them.
          </p>

          <div class="products-card-grid">
            <article class="products-card">
              <small>Vessel</small>
              <strong>Monarch butterfly</strong>
              <p>The background gives the seasonal field an emotional body.</p>
            </article>

            <article class="products-card">
              <small>Motion</small>
              <strong>Fairy paths</strong>
              <p>The former globes now move as winged fairies.</p>
            </article>

            <article class="products-card">
              <small>Pattern</small>
              <strong>Two figure-eights</strong>
              <p>The motion still crosses the center through mirrored loops.</p>
            </article>

            <article class="products-card">
              <small>Read</small>
              <strong>Glass behind, fairies in front</strong>
              <p>The vessel, path, and motion are now visually separate.</p>
            </article>
          </div>
        </section>

        <footer class="products-footer">
          <span>Products · seasonal monarch fairies</span>
          <span>
            <a href="/">Home</a>
            <a href="/gauges/">Gauges</a>
            <a href="/laws/">Laws</a>
          </span>
        </footer>
      </main>
    `;
  }

  class ProductsPlanetRuntime {
    constructor(options = {}) {
      this.stage = options.stage || options.mount || null;
      this.mount = options.mount || options.stage || null;
      this.host = options.host || null;
      this.receipts = options.receipts || null;
      this.reducedMotion = !!options.reducedMotion;
      this.contract = "PRODUCTS_RUNTIME_MONARCH_FAIRY_GENERATION_4";
      this.status = "IDLE";
    }

    write(level, text) {
      writeReceipt(this.receipts, level, text);
    }

    resolveTarget() {
      return (
        document.getElementById("productsPage") ||
        document.getElementById("productsGrid") ||
        this.mount ||
        this.stage ||
        document.body
      );
    }

    destroy() {
      const target = this.resolveTarget();

      if (target && target instanceof HTMLElement) {
        target.removeAttribute("data-runtime");
        target.removeAttribute("data-runtime-contract");
        target.removeAttribute("data-runtime-owner");
      }

      this.status = "DESTROYED";
    }

    async mountRuntime() {
      injectStyle();

      const target = this.resolveTarget();

      if (target && target instanceof HTMLElement) {
        target.setAttribute("data-runtime", "products-monarch-fairy-generation-4");
        target.setAttribute("data-runtime-contract", this.contract);
        target.setAttribute("data-runtime-owner", "products_runtime.js");
        target.innerHTML = html();
      }

      this.status = "MOUNTED";
      this.write("info", "products monarch fairy generation 4 mounted by products_runtime.js");

      return {
        status: this.status,
        contract: this.contract,
        owner: "products_runtime.js"
      };
    }
  }

  function autoMountIfNeeded() {
    const root = document.getElementById("productsPage") || document.getElementById("productsGrid");

    if (!root) return;

    const alreadyMounted = root.getAttribute("data-runtime") === "products-monarch-fairy-generation-4";

    if (alreadyMounted) return;

    const runtime = new ProductsPlanetRuntime({ mount: root });
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

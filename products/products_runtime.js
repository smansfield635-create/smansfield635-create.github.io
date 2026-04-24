(() => {
  "use strict";

  const GLOBAL_KEY = "ProductsPlanetRuntime";
  const STYLE_ID = "products-micro-world-runtime-v1-style";
  const ASSET_URL = "/assets/seasonal-monarch-butterfly.svg?v=8";

  const seasons = [
    { key: "winter", label: "Winter", squad: "North" },
    { key: "summer", label: "Summer", squad: "East" },
    { key: "fall", label: "Fall", squad: "West" },
    { key: "spring", label: "Spring", squad: "South" }
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

  const squads = [
    {
      key: "north",
      label: "North Squad",
      duty: "Terrain, mountains, boundary, high ground, map stability."
    },
    {
      key: "south",
      label: "South Squad",
      duty: "Grass, vines, fruit, ecology, restoration, local life systems."
    },
    {
      key: "east",
      label: "East Squad",
      duty: "Motion, insects, fairies, traversal paths, growth movement."
    },
    {
      key: "west",
      label: "West Squad",
      duty: "Friction, shadow, breaks, edge conditions, pressure testing."
    }
  ];

  function writeReceipt(receipts, level, text) {
    if (receipts && typeof receipts.write === "function") receipts.write(level, text);
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      :root {
        --line: rgba(164,188,255,.18);
        --line-strong: rgba(210,223,255,.36);
        --text: #eef4ff;
        --muted: #9aabd0;
        --gold: #efd29a;
        --blue: #8ec5ff;
        --green: #92e7ba;
        --amber: #f4a340;
        --shadow: 0 24px 80px rgba(0,0,0,.52);
      }

      * { box-sizing: border-box; }

      body {
        margin: 0;
        color: var(--text);
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

      .topbar,
      .hero,
      .window,
      .panel,
      .card,
      .command-card {
        border: 1px solid var(--line);
        background: linear-gradient(180deg, rgba(9,17,33,.92), rgba(6,12,24,.86));
        box-shadow: var(--shadow);
      }

      .topbar {
        border-radius: 22px;
        padding: 14px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        margin-bottom: 16px;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .mark {
        width: 46px;
        height: 46px;
        border-radius: 16px;
        display: grid;
        place-items: center;
        border: 1px solid var(--line);
        background:
          radial-gradient(circle at 50% 28%, rgba(239,210,154,.22), transparent 42%),
          linear-gradient(180deg, rgba(26,43,78,.9), rgba(10,18,32,.97));
        font-weight: 900;
        letter-spacing: .08em;
      }

      .kicker {
        margin: 0 0 4px;
        color: #c8d7ff;
        font-size: .72rem;
        text-transform: uppercase;
        letter-spacing: .16em;
      }

      .brand-title {
        margin: 0;
        font-weight: 850;
        font-size: 1.05rem;
      }

      .nav,
      .actions,
      .footer-links {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 10px;
      }

      .nav a,
      .button {
        min-height: 42px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0 15px;
        border: 1px solid var(--line);
        border-radius: 999px;
        color: var(--text);
        background: rgba(255,255,255,.035);
        text-decoration: none;
        font-weight: 800;
      }

      .nav a:hover,
      .nav a:focus-visible,
      .button:hover,
      .button:focus-visible {
        border-color: var(--line-strong);
        transform: translateY(-1px);
        outline: none;
      }

      .hero {
        border-radius: 34px;
        padding: 24px 20px;
        margin-bottom: 18px;
        overflow: hidden;
      }

      .hero-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(320px, .95fr);
        gap: 20px;
        align-items: center;
      }

      .pill {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        border-radius: 999px;
        border: 1px solid var(--line);
        background: rgba(255,255,255,.035);
        color: #d8e3ff;
        text-transform: uppercase;
        letter-spacing: .14em;
        font-size: .72rem;
        margin-bottom: 14px;
      }

      .pill::before {
        content: "";
        width: 9px;
        height: 9px;
        border-radius: 2px;
        transform: rotate(45deg);
        background: var(--gold);
        box-shadow: 0 0 18px rgba(239,210,154,.50);
      }

      h1 {
        margin: 0 0 12px;
        max-width: 12ch;
        font-size: clamp(2.35rem, 5vw, 5rem);
        line-height: .95;
        letter-spacing: -.06em;
      }

      h1 span { color: var(--gold); }

      p {
        margin: 0;
        color: var(--muted);
        line-height: 1.62;
      }

      .lead {
        max-width: 68ch;
        font-size: clamp(1rem, 1.45vw, 1.14rem);
      }

      .actions {
        margin-top: 20px;
        justify-content: flex-start;
      }

      .button {
        border-radius: 18px;
        min-height: 48px;
        padding: 0 18px;
      }

      .button.primary {
        border-color: rgba(239,210,154,.34);
        background:
          linear-gradient(180deg, rgba(239,210,154,.20), rgba(239,210,154,.06)),
          rgba(255,255,255,.035);
        color: #fff8ea;
      }

      .window {
        border-radius: 34px;
        padding: 22px;
        overflow: hidden;
      }

      .micro-stage {
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

      .micro-stage::before {
        content: "";
        position: absolute;
        inset: 18px;
        border-radius: 26px;
        border: 1px solid rgba(255,255,255,.10);
        box-shadow: inset 0 0 30px rgba(126,164,255,.12);
        z-index: 4;
        pointer-events: none;
      }

      .terrain-grid {
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

      .terrain-cell {
        border: 1px solid rgba(255,255,255,.10);
        background: rgba(255,255,255,.02);
      }

      .terrain-cell.north {
        background:
          radial-gradient(circle at 20% 20%, rgba(235,245,255,.18), transparent 30%),
          linear-gradient(135deg, rgba(230,240,255,.20), rgba(88,118,165,.05));
      }

      .terrain-cell.east {
        background:
          radial-gradient(circle at 80% 24%, rgba(142,197,255,.18), transparent 30%),
          linear-gradient(135deg, rgba(91,190,255,.16), rgba(20,66,110,.05));
      }

      .terrain-cell.west {
        background:
          radial-gradient(circle at 28% 82%, rgba(244,163,64,.16), transparent 30%),
          linear-gradient(135deg, rgba(239,178,84,.18), rgba(95,49,18,.06));
      }

      .terrain-cell.south {
        background:
          radial-gradient(circle at 76% 82%, rgba(146,231,186,.18), transparent 30%),
          linear-gradient(135deg, rgba(105,229,162,.18), rgba(20,92,66,.06));
      }

      .landscape-layer {
        position: absolute;
        inset: 0;
        z-index: 2;
        display: grid;
        place-items: center;
        pointer-events: none;
      }

      .landscape-layer object,
      .landscape-layer img {
        width: 112%;
        height: 112%;
        display: block;
        border: 0;
        object-fit: cover;
        opacity: .90;
        filter:
          drop-shadow(0 0 26px rgba(239,210,154,.16))
          drop-shadow(0 0 48px rgba(112,151,255,.10));
      }

      .field-layer {
        position: absolute;
        inset: 0;
        z-index: 5;
        pointer-events: none;
      }

      .traverse-path {
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

      .traverse-path.one {
        transform: translate(-50%, -50%) rotate(45deg) scaleX(.42);
        animation: orbitBreathA 6s ease-in-out infinite;
      }

      .traverse-path.two {
        transform: translate(-50%, -50%) rotate(-45deg) scaleX(.42);
        animation: orbitBreathB 6s ease-in-out infinite;
      }

      .field-unit {
        position: absolute;
        left: calc(var(--x) * 1%);
        top: calc(var(--y) * 1%);
        width: 38px;
        height: 42px;
        transform: translate(-50%, -50%);
        animation: fieldUnitA 5.8s ease-in-out infinite;
        animation-delay: var(--delay);
        filter:
          drop-shadow(0 0 10px var(--unit-color))
          drop-shadow(0 0 26px rgba(210,240,255,.26));
      }

      .field-unit::before,
      .field-unit::after {
        content: "";
        position: absolute;
        top: 5px;
        width: 18px;
        height: 27px;
        border-radius: 80% 20% 80% 20%;
        background:
          radial-gradient(circle at 42% 42%, rgba(255,255,255,.92), rgba(255,255,255,.34) 26%, var(--unit-color) 56%, rgba(255,255,255,0) 82%);
        border: 1px solid rgba(255,255,255,.62);
        opacity: .88;
        transform-origin: 50% 80%;
        animation: wingFlutter .62s ease-in-out infinite;
      }

      .field-unit::before {
        left: 1px;
        transform: rotate(-28deg);
      }

      .field-unit::after {
        right: 1px;
        transform: scaleX(-1) rotate(-28deg);
        animation-delay: -.31s;
      }

      .unit-core {
        position: absolute;
        left: 50%;
        top: 48%;
        width: 14px;
        height: 22px;
        transform: translate(-50%, -50%);
        border-radius: 999px;
        background:
          radial-gradient(circle at 50% 28%, #fff, var(--unit-color) 50%, rgba(4,10,22,.88) 100%);
        border: 1px solid rgba(255,255,255,.72);
        box-shadow:
          0 0 18px var(--unit-color),
          0 0 42px rgba(210,240,255,.25);
      }

      .unit-trail {
        position: absolute;
        left: 50%;
        top: 52%;
        width: 2px;
        height: 58px;
        transform: translate(-50%, 0);
        border-radius: 999px;
        background: linear-gradient(180deg, var(--unit-color), rgba(255,255,255,0));
        opacity: .38;
      }

      .field-unit.green { --unit-color: var(--green); }
      .field-unit.blue { --unit-color: var(--blue); }

      .field-unit.nw,
      .field-unit.se { animation-name: fieldUnitA; }

      .field-unit.ne,
      .field-unit.sw { animation-name: fieldUnitB; }

      .field-unit.center-a { animation-name: centerUnitA; }
      .field-unit.center-b { animation-name: centerUnitB; }

      .center-node {
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

      .region-label {
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
        font-size: .74rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: .14em;
        backdrop-filter: blur(10px);
      }

      .region-label.winter { left: 20%; top: 26%; }
      .region-label.summer { right: 20%; top: 26%; }
      .region-label.fall { left: 20%; bottom: 17%; }
      .region-label.spring { right: 20%; bottom: 17%; }

      .stage-badge {
        position: absolute;
        left: 50%;
        top: 5%;
        transform: translateX(-50%);
        z-index: 8;
        width: min(470px, 82%);
        padding: 18px;
        border-radius: 999px;
        text-align: center;
        border: 1px solid rgba(164,188,255,.24);
        background: rgba(5,12,26,.84);
        color: #dce7ff;
        text-transform: uppercase;
        letter-spacing: .14em;
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
        width: min(820px, 86%);
        padding: 16px 18px;
        border-radius: 999px;
        text-align: center;
        border: 1px solid rgba(164,188,255,.24);
        background: rgba(5,12,26,.84);
        color: #dce7ff;
        text-transform: uppercase;
        letter-spacing: .12em;
        line-height: 1.45;
        font-weight: 800;
        backdrop-filter: blur(10px);
      }

      .stage-footer strong { color: #fff; }

      .panel {
        margin-top: 18px;
        border-radius: 30px;
        padding: 22px 20px;
      }

      .panel h2 {
        margin: 0 0 10px;
        font-size: clamp(1.7rem, 3vw, 2.7rem);
        line-height: 1;
        letter-spacing: -.04em;
      }

      .panel p {
        margin: 0;
        color: var(--muted);
        line-height: 1.6;
      }

      .card-grid,
      .command-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        margin-top: 18px;
      }

      .card,
      .command-card {
        border-radius: 22px;
        padding: 16px;
        min-height: 140px;
        border-color: rgba(164,188,255,.14);
      }

      .card small,
      .command-card small {
        display: block;
        color: #90a3ce;
        text-transform: uppercase;
        letter-spacing: .12em;
        margin-bottom: 8px;
        font-weight: 800;
        font-size: .72rem;
      }

      .card strong,
      .command-card strong {
        display: block;
        color: #f4f7ff;
        font-size: 1.2rem;
        line-height: 1.08;
        margin-bottom: 10px;
      }

      .card p,
      .command-card p {
        font-size: .92rem;
      }

      .chain {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 10px;
        margin-top: 18px;
      }

      .chain-node {
        border: 1px solid rgba(164,188,255,.14);
        border-radius: 20px;
        padding: 14px;
        background: rgba(255,255,255,.03);
        text-align: center;
      }

      .chain-node small {
        display: block;
        color: #90a3ce;
        text-transform: uppercase;
        letter-spacing: .12em;
        margin-bottom: 8px;
        font-weight: 800;
        font-size: .68rem;
      }

      .chain-node strong {
        display: block;
        color: #fff;
      }

      .footer {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        color: var(--muted);
        padding: 14px 4px 0;
      }

      .footer a {
        color: var(--muted);
        text-decoration: none;
        margin-left: 12px;
      }

      @keyframes fieldUnitA {
        0%, 100% { transform: translate(-50%, -50%) translate(0, 0) rotate(-8deg) scale(.96); }
        25% { transform: translate(-50%, -50%) translate(22px, -18px) rotate(10deg) scale(1.05); }
        50% { transform: translate(-50%, -50%) translate(0, -34px) rotate(0deg) scale(1.1); }
        75% { transform: translate(-50%, -50%) translate(-22px, -18px) rotate(-10deg) scale(1.05); }
      }

      @keyframes fieldUnitB {
        0%, 100% { transform: translate(-50%, -50%) translate(0, 0) rotate(8deg) scale(.96); }
        25% { transform: translate(-50%, -50%) translate(-22px, -18px) rotate(-10deg) scale(1.05); }
        50% { transform: translate(-50%, -50%) translate(0, -34px) rotate(0deg) scale(1.1); }
        75% { transform: translate(-50%, -50%) translate(22px, -18px) rotate(10deg) scale(1.05); }
      }

      @keyframes centerUnitA {
        0%, 100% { transform: translate(-50%, -50%) translate(-8px, 0) scale(.92); }
        50% { transform: translate(-50%, -50%) translate(8px, -18px) scale(1.08); }
      }

      @keyframes centerUnitB {
        0%, 100% { transform: translate(-50%, -50%) translate(8px, 0) scale(.92); }
        50% { transform: translate(-50%, -50%) translate(-8px, -18px) scale(1.08); }
      }

      @keyframes wingFlutter {
        0%, 100% { opacity: .74; transform: rotate(-28deg) scaleY(.88); }
        50% { opacity: 1; transform: rotate(-42deg) scaleY(1.12); }
      }

      @keyframes centerPulse {
        0%, 100% { opacity: .72; transform: translate(-50%, -50%) scale(.95); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1.08); }
      }

      @keyframes orbitBreathA {
        0%, 100% { transform: translate(-50%, -50%) rotate(45deg) scaleX(.42); opacity: .50; }
        50% { transform: translate(-50%, -50%) rotate(48deg) scaleX(.48); opacity: .74; }
      }

      @keyframes orbitBreathB {
        0%, 100% { transform: translate(-50%, -50%) rotate(-45deg) scaleX(.42); opacity: .50; }
        50% { transform: translate(-50%, -50%) rotate(-48deg) scaleX(.48); opacity: .74; }
      }

      @media (max-width: 980px) {
        .hero-grid { grid-template-columns: 1fr; }
        .card-grid,
        .command-grid,
        .chain { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }

      @media (max-width: 720px) {
        .products-page {
          width: min(100vw - 16px, 1180px);
          padding: 14px 0 32px;
        }

        .topbar { flex-wrap: wrap; }
        .nav { width: 100%; justify-content: flex-start; }
        .hero,
        .window,
        .panel { padding: 18px 16px; }

        h1 { font-size: clamp(2rem, 11vw, 3.4rem); }
        .micro-stage { min-height: 720px; }

        .field-unit {
          width: 32px;
          height: 36px;
        }

        .field-unit::before,
        .field-unit::after {
          width: 15px;
          height: 23px;
        }

        .unit-core {
          width: 12px;
          height: 19px;
        }

        .region-label {
          min-width: 110px;
          font-size: .62rem;
        }

        .region-label.winter { left: 19%; top: 27%; }
        .region-label.summer { right: 19%; top: 27%; }
        .region-label.fall { left: 19%; bottom: 17%; }
        .region-label.spring { right: 19%; bottom: 17%; }

        .stage-badge {
          font-size: .68rem;
          width: 78%;
          top: 5%;
        }

        .stage-footer {
          font-size: .62rem;
          width: 86%;
          bottom: 5%;
        }

        .card-grid,
        .command-grid,
        .chain { grid-template-columns: 1fr; }

        .footer { display: grid; }

        .footer a {
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
        <header class="topbar">
          <div class="brand">
            <div class="mark">DG</div>
            <div>
              <p class="kicker">Products</p>
              <p class="brand-title">Micro-World Ground Map</p>
            </div>
          </div>

          <nav class="nav" aria-label="Products navigation">
            <a href="/">Home</a>
            <a href="/gauges/">Gauges</a>
            <a href="/laws/">Laws</a>
            <a href="/about/">About</a>
          </nav>
        </header>

        <section class="hero">
          <div class="hero-grid">
            <div>
              <span class="pill">2D baseline · local ecology · squad-mapped terrain</span>
              <h1>The first ground-level <span>world map.</span></h1>
              <p class="lead">
                This is the plain baseline of the micro-world: trees, fruit, insects, grass, bushes, mountains, fairy paths, seasonal regions, and the center crossing where movement meets.
              </p>

              <div class="actions">
                <a class="button primary" href="#groundMap">Open ground map</a>
                <a class="button" href="#squads">Squad mapping</a>
                <a class="button" href="/gauges/">Gauges</a>
              </div>
            </div>

            <section class="window" id="groundMap" aria-label="Micro-world ground map">
              <div class="micro-stage">
                <div class="terrain-grid" aria-hidden="true">
                  <div class="terrain-cell north"></div>
                  <div class="terrain-cell east"></div>
                  <div class="terrain-cell west"></div>
                  <div class="terrain-cell south"></div>
                </div>

                <div class="landscape-layer" aria-hidden="true">
                  <object type="image/svg+xml" data="${ASSET_URL}">
                    <img src="${ASSET_URL}" alt="" />
                  </object>
                </div>

                <div class="field-layer" aria-hidden="true">
                  <div class="traverse-path one"></div>
                  <div class="traverse-path two"></div>
                  <div class="center-node"></div>

                  ${fairies.map((unit) => `
                    <span
                      class="field-unit ${unit.type} ${unit.path}"
                      style="--x:${unit.x};--y:${unit.y};--delay:${unit.d}"
                    >
                      <span class="unit-trail"></span>
                      <span class="unit-core"></span>
                    </span>
                  `).join("")}
                </div>

                ${seasons.map((season) => `
                  <div class="region-label ${season.key}">${season.squad} · ${season.label}</div>
                `).join("")}

                <div class="stage-badge">Micro-world baseline · local landscape field</div>
                <div class="stage-footer"><strong>2D ground map</strong> · terrain behind, field units in front, motion crossing through the center</div>
              </div>
            </section>
          </div>
        </section>

        <section class="panel">
          <p class="kicker">Command hierarchy</p>
          <h2>Sean directs. The House contains. The Lab operates.</h2>
          <p>
            The micro-world is mapped from command down to field squads. The visual is not decoration; it is the first readable ground-level ecology map.
          </p>

          <div class="chain">
            <div class="chain-node">
              <small>Command</small>
              <strong>Sean</strong>
            </div>
            <div class="chain-node">
              <small>Headquarters</small>
              <strong>House</strong>
            </div>
            <div class="chain-node">
              <small>Operations</small>
              <strong>Lab</strong>
            </div>
            <div class="chain-node">
              <small>Command staff</small>
              <strong>Sheldon + Dexter</strong>
            </div>
            <div class="chain-node">
              <small>Field layer</small>
              <strong>Four Squads</strong>
            </div>
          </div>
        </section>

        <section class="panel" id="squads">
          <p class="kicker">Field squads</p>
          <h2>Four squads map the ground.</h2>
          <p>
            Each squad owns a different layer of the micro-world. Together they turn the 2D baseline into a full terrain grammar.
          </p>

          <div class="command-grid">
            ${squads.map((squad) => `
              <article class="command-card">
                <small>${squad.key}</small>
                <strong>${squad.label}</strong>
                <p>${squad.duty}</p>
              </article>
            `).join("")}
          </div>
        </section>

        <section class="panel">
          <p class="kicker">Baseline read</p>
          <h2>This is as regular as the world gets.</h2>
          <p>
            The later version can become 3D, interactive, and explorable. This layer defines the ordinary ground: fruit, vines, insects, grass, bushes, mountains, seasons, paths, and center crossing.
          </p>

          <div class="card-grid">
            <article class="card">
              <small>Terrain</small>
              <strong>Ground and mountains</strong>
              <p>The stable base of the local field.</p>
            </article>

            <article class="card">
              <small>Ecology</small>
              <strong>Fruit, vines, grass</strong>
              <p>The living material of the micro-world.</p>
            </article>

            <article class="card">
              <small>Movement</small>
              <strong>Fairies and insects</strong>
              <p>The active units crossing the field.</p>
            </article>

            <article class="card">
              <small>Path</small>
              <strong>Dual figure-eight</strong>
              <p>The traversal pattern through the shared center.</p>
            </article>
          </div>
        </section>

        <footer class="footer">
          <span>Products · Micro-World Ground Map</span>
          <span class="footer-links">
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
      this.contract = "PRODUCTS_RUNTIME_MICRO_WORLD_GROUND_MAP_V1";
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
        target.setAttribute("data-runtime", "products-micro-world-ground-map");
        target.setAttribute("data-runtime-contract", this.contract);
        target.setAttribute("data-runtime-owner", "products_runtime.js");
        target.innerHTML = html();
      }

      this.status = "MOUNTED";
      this.write("info", "products micro-world ground map mounted by products_runtime.js");

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

    const alreadyMounted = root.getAttribute("data-runtime") === "products-micro-world-ground-map";
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

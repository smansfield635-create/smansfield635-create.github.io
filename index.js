(() => {
  "use strict";

  const STYLE_ID = "dgb-home-coming-attractions-v1";

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      :root {
        --line: rgba(164,188,255,.18);
        --strong: rgba(210,223,255,.36);
        --text: #eef4ff;
        --muted: #9aabd0;
        --gold: #efd29a;
        --pink: #ff9fd6;
        --blue: #8ec5ff;
        --green: #92e7ba;
        --shadow: 0 24px 80px rgba(0,0,0,.52);
        --max: 1180px;
      }

      * {
        box-sizing: border-box;
      }

      html {
        min-height: 100%;
        scroll-behavior: smooth;
      }

      body {
        min-height: 100%;
        margin: 0;
        color: var(--text);
        font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background:
          radial-gradient(circle at 50% 7%, rgba(112,151,255,.22), transparent 22%),
          radial-gradient(circle at 18% 28%, rgba(255,159,214,.10), transparent 24%),
          radial-gradient(circle at 82% 34%, rgba(239,210,154,.10), transparent 24%),
          linear-gradient(180deg, #020610 0%, #071225 52%, #020610 100%);
        overflow-x: hidden;
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

      .home-page {
        width: min(var(--max), calc(100vw - 24px));
        margin: 0 auto;
        padding: 18px 0 44px;
        position: relative;
        z-index: 1;
      }

      .home-topbar,
      .home-hero,
      .home-section,
      .feature-card,
      .attraction-row,
      .support-grid a,
      .home-attraction-window {
        border: 1px solid var(--line);
        background: linear-gradient(180deg, rgba(9,17,33,.92), rgba(6,12,24,.86));
        box-shadow: var(--shadow);
      }

      .home-topbar {
        border-radius: 22px;
        padding: 14px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        margin-bottom: 16px;
      }

      .home-brand {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .home-mark {
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

      .home-kicker {
        margin: 0 0 4px;
        color: #c8d7ff;
        font-size: .72rem;
        text-transform: uppercase;
        letter-spacing: .16em;
      }

      .home-title {
        margin: 0;
        font-weight: 850;
        font-size: 1.05rem;
      }

      .home-nav,
      .home-actions,
      .home-footer span:last-child {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 10px;
      }

      .home-nav a,
      .home-button {
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

      .home-nav a:hover,
      .home-nav a:focus-visible,
      .home-button:hover,
      .home-button:focus-visible,
      .feature-card:hover,
      .feature-card:focus-visible,
      .support-grid a:hover,
      .support-grid a:focus-visible,
      .attraction-row a:hover,
      .attraction-row a:focus-visible {
        border-color: var(--strong);
        transform: translateY(-1px);
        outline: none;
      }

      .home-hero {
        border-radius: 34px;
        padding: 24px 20px;
        margin-bottom: 18px;
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(320px, .85fr);
        gap: 20px;
        align-items: center;
        overflow: hidden;
      }

      .home-pill {
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

      .home-pill::before {
        content: "";
        width: 9px;
        height: 9px;
        border-radius: 2px;
        transform: rotate(45deg);
        background: var(--gold);
        box-shadow: 0 0 18px rgba(239,210,154,.50);
      }

      h1 {
        margin: 0;
        max-width: 11ch;
        font-size: clamp(2.6rem, 6vw, 5.7rem);
        line-height: .9;
        letter-spacing: -.07em;
        color: #fff;
      }

      h2 {
        margin: 12px 0;
        color: var(--gold);
        font-size: clamp(1.6rem, 3.2vw, 3rem);
        line-height: .96;
        letter-spacing: -.04em;
      }

      .home-section h2 {
        margin: 0 0 10px;
        color: var(--text);
      }

      p {
        margin: 0;
        color: var(--muted);
        line-height: 1.62;
      }

      .home-copy p {
        max-width: 68ch;
        font-size: clamp(1rem, 1.45vw, 1.14rem);
      }

      .home-actions {
        justify-content: flex-start;
        margin-top: 20px;
      }

      .home-button {
        border-radius: 18px;
        min-height: 48px;
        padding: 0 18px;
      }

      .home-button.primary {
        border-color: rgba(239,210,154,.34);
        background:
          linear-gradient(180deg, rgba(239,210,154,.22), rgba(239,210,154,.07)),
          rgba(255,255,255,.035);
        color: #fff8ea;
      }

      .home-attraction-window {
        border-radius: 30px;
        padding: 20px;
      }

      .home-door {
        min-height: 430px;
        position: relative;
        border-radius: 30px;
        border: 1px solid rgba(170,198,255,.18);
        background:
          radial-gradient(circle at 50% 45%, rgba(239,210,154,.16), transparent 24%),
          radial-gradient(circle at 50% 54%, rgba(142,197,255,.16), transparent 34%),
          linear-gradient(180deg, rgba(7,17,36,.98), rgba(2,7,16,.99));
        overflow: hidden;
        display: grid;
        place-items: center;
        isolation: isolate;
      }

      .home-door::before {
        content: "";
        position: absolute;
        inset: 10%;
        border-radius: 999px 999px 32px 32px;
        border: 1px solid rgba(210,223,255,.18);
        box-shadow: inset 0 0 42px rgba(126,164,255,.12);
      }

      .home-orbit {
        position: absolute;
        width: 58%;
        height: 58%;
        border-radius: 50%;
        border: 1px solid rgba(239,210,154,.20);
        opacity: .7;
      }

      .home-orbit.one {
        transform: rotate(45deg) scaleX(.45);
        animation: orbitOne 12s linear infinite;
      }

      .home-orbit.two {
        transform: rotate(-45deg) scaleX(.45);
        animation: orbitTwo 14s linear infinite reverse;
      }

      .home-core {
        position: relative;
        z-index: 3;
        width: 142px;
        height: 142px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        overflow: hidden;
        border: 1px solid rgba(226,240,255,.50);
        color: transparent;
        font-size: 0;
        letter-spacing: 0;
        background:
          radial-gradient(circle at 34% 25%, rgba(255,255,255,.62), transparent 10%),
          radial-gradient(circle at 42% 38%, rgba(184,220,255,.28), transparent 28%),
          radial-gradient(circle at 62% 66%, rgba(239,210,154,.16), transparent 30%),
          linear-gradient(135deg, #0d4b86 0%, #0b2c68 42%, #050d24 100%);
        box-shadow:
          inset -24px -22px 36px rgba(0,0,0,.50),
          inset 14px 10px 24px rgba(255,255,255,.20),
          0 0 38px rgba(142,197,255,.38),
          0 0 108px rgba(239,210,154,.18);
        animation: demoUniverseFloat 7s ease-in-out infinite;
      }

      .home-core::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background:
          radial-gradient(ellipse at 34% 34%, rgba(110,212,159,.82) 0 13%, transparent 14%),
          radial-gradient(ellipse at 63% 34%, rgba(239,210,154,.72) 0 12%, transparent 13%),
          radial-gradient(ellipse at 42% 62%, rgba(110,212,159,.80) 0 14%, transparent 15%),
          radial-gradient(ellipse at 66% 64%, rgba(239,210,154,.68) 0 13%, transparent 14%),
          radial-gradient(ellipse at 72% 82%, rgba(110,212,159,.78) 0 7%, transparent 8%),
          radial-gradient(circle at 50% 50%, rgba(255,255,255,.08), transparent 34%),
          linear-gradient(90deg, rgba(255,255,255,.16), transparent 38%, rgba(0,0,0,.32) 100%);
        filter: drop-shadow(0 1px 2px rgba(0,0,0,.32));
        pointer-events: none;
      }

      .home-core::after {
        content: "";
        position: absolute;
        inset: -2px;
        border-radius: inherit;
        background:
          radial-gradient(ellipse at 30% 48%, rgba(255,255,255,.56) 0 7%, transparent 8%),
          radial-gradient(ellipse at 56% 26%, rgba(255,255,255,.42) 0 8%, transparent 9%),
          radial-gradient(ellipse at 67% 48%, rgba(255,255,255,.32) 0 7%, transparent 8%),
          radial-gradient(ellipse at 50% 72%, rgba(255,255,255,.26) 0 10%, transparent 11%),
          radial-gradient(circle at 30% 25%, rgba(255,255,255,.34), transparent 18%);
        mix-blend-mode: screen;
        opacity: .70;
        pointer-events: none;
      }

      .home-core .demo-universe-ring {
        position: absolute;
        inset: 16%;
        border-radius: 50%;
        border: 1px solid rgba(255,255,255,.18);
        box-shadow:
          inset 0 0 18px rgba(142,197,255,.18),
          0 0 18px rgba(239,210,154,.10);
        pointer-events: none;
      }

      .home-caption {
        position: absolute;
        left: 50%;
        bottom: 24px;
        transform: translateX(-50%);
        z-index: 4;
        width: min(92%, 620px);
        padding: 14px 16px;
        border-radius: 999px;
        border: 1px solid rgba(164,188,255,.24);
        background: rgba(5,12,26,.84);
        text-align: center;
        color: #dce7ff;
        text-transform: uppercase;
        letter-spacing: .10em;
        font-size: .68rem;
        line-height: 1.45;
        backdrop-filter: blur(10px);
      }

      .home-caption strong {
        display: block;
        color: #fff;
        margin-bottom: 4px;
      }

      .home-section {
        margin-top: 18px;
        border-radius: 30px;
        padding: 22px 20px;
        overflow: hidden;
      }

      .feature-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        margin-top: 18px;
      }

      .feature-card {
        display: block;
        min-height: 230px;
        border-radius: 22px;
        padding: 18px;
        color: var(--text);
        text-decoration: none;
        border-color: rgba(164,188,255,.14);
        transition: transform 160ms ease, border-color 160ms ease;
      }

      .feature-card.summit {
        border-color: rgba(239,210,154,.30);
        background:
          radial-gradient(circle at 100% 100%, rgba(239,210,154,.14), transparent 44%),
          linear-gradient(180deg, rgba(9,17,33,.92), rgba(6,12,24,.86));
      }

      .feature-card.love {
        border-color: rgba(255,159,214,.30);
        background:
          radial-gradient(circle at 100% 100%, rgba(255,159,214,.14), transparent 44%),
          linear-gradient(180deg, rgba(9,17,33,.92), rgba(6,12,24,.86));
      }

      .feature-card.metaverse {
        border-color: rgba(142,197,255,.30);
        background:
          radial-gradient(circle at 100% 100%, rgba(142,197,255,.14), transparent 44%),
          linear-gradient(180deg, rgba(9,17,33,.92), rgba(6,12,24,.86));
      }

      .feature-card.show {
        border-color: rgba(146,231,186,.30);
        background:
          radial-gradient(circle at 100% 100%, rgba(146,231,186,.12), transparent 44%),
          linear-gradient(180deg, rgba(9,17,33,.92), rgba(6,12,24,.86));
      }

      .feature-card small,
      .support-grid a small {
        display: block;
        color: #90a3ce;
        text-transform: uppercase;
        letter-spacing: .12em;
        margin-bottom: 8px;
        font-weight: 800;
        font-size: .72rem;
      }

      .feature-card strong {
        display: block;
        color: #f4f7ff;
        font-size: 1.36rem;
        line-height: 1.08;
        margin-bottom: 10px;
      }

      .feature-card p {
        font-size: .94rem;
      }

      .attraction-list {
        display: grid;
        gap: 12px;
        margin-top: 18px;
      }

      .attraction-row {
        border-radius: 24px;
        padding: 16px;
        display: grid;
        grid-template-columns: 58px minmax(0, 1fr) auto;
        gap: 14px;
        align-items: center;
        border-color: rgba(164,188,255,.14);
      }

      .attraction-row > span {
        width: 46px;
        height: 46px;
        border-radius: 16px;
        display: grid;
        place-items: center;
        color: var(--gold);
        background: rgba(239,210,154,.08);
        border: 1px solid rgba(239,210,154,.18);
        font-weight: 900;
      }

      .attraction-row strong {
        color: #fff;
        display: block;
        font-size: 1.14rem;
        margin-bottom: 4px;
      }

      .attraction-row a {
        color: #fff8ea;
        text-decoration: none;
        font-weight: 900;
        border: 1px solid rgba(239,210,154,.24);
        border-radius: 999px;
        padding: 10px 14px;
        background: rgba(239,210,154,.08);
      }

      .support-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        margin-top: 18px;
      }

      .support-grid a {
        display: block;
        color: var(--text);
        text-decoration: none;
        border-radius: 22px;
        padding: 16px;
        min-height: 128px;
        border-color: rgba(164,188,255,.14);
      }

      .support-grid a strong {
        color: #fff;
        display: block;
        line-height: 1.15;
      }

      .home-footer {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        color: var(--muted);
        padding: 14px 4px 0;
      }

      .home-footer a {
        color: var(--muted);
        text-decoration: none;
      }

      @keyframes orbitOne {
        from { transform: rotate(45deg) scaleX(.45); }
        to { transform: rotate(405deg) scaleX(.45); }
      }

      @keyframes orbitTwo {
        from { transform: rotate(-45deg) scaleX(.45); }
        to { transform: rotate(315deg) scaleX(.45); }
      }

      @keyframes demoUniverseFloat {
        0%, 100% { transform: translateY(0) scale(.98); }
        50% { transform: translateY(-6px) scale(1.03); }
      }

      @media (max-width: 980px) {
        .home-hero {
          grid-template-columns: 1fr;
        }

        .feature-grid,
        .support-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 720px) {
        .home-page {
          width: min(100vw - 16px, var(--max));
          padding: 14px 0 32px;
        }

        .home-topbar {
          flex-wrap: wrap;
        }

        .home-nav {
          width: 100%;
          justify-content: flex-start;
        }

        .home-hero,
        .home-section {
          padding: 18px 16px;
        }

        h1 {
          font-size: clamp(2.3rem, 13vw, 4rem);
        }

        h2 {
          font-size: clamp(1.55rem, 8vw, 2.4rem);
        }

        .home-door {
          min-height: 390px;
        }

        .home-core {
          width: 132px;
          height: 132px;
        }

        .feature-grid,
        .support-grid {
          grid-template-columns: 1fr;
        }

        .attraction-row {
          grid-template-columns: 48px minmax(0, 1fr);
        }

        .attraction-row a {
          grid-column: 1 / -1;
          justify-content: center;
          text-align: center;
        }

        .home-footer {
          display: grid;
        }

        .home-footer span:last-child {
          justify-content: flex-start;
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

  function normalizeDemoUniverseCore(root) {
    const core = root.querySelector(".home-core");
    if (!core) return;

    core.textContent = "";
    core.setAttribute("role", "img");
    core.setAttribute("aria-label", "Demo universe globe");
    core.setAttribute("data-home-demo-universe-core", "true");

    if (!core.querySelector(".demo-universe-ring")) {
      const ring = document.createElement("span");
      ring.className = "demo-universe-ring";
      ring.setAttribute("aria-hidden", "true");
      core.appendChild(ring);
    }
  }

  function mount() {
    injectStyle();

    const root = document.getElementById("homePage");
    if (!root) return;

    root.setAttribute("data-home-state", "coming-attractions");
    root.setAttribute("data-home-priority", "nine-summits-love-metaverse-show");
    root.setAttribute("data-home-js-owner", "index.js");
    root.setAttribute("data-home-demo-universe-runtime", "mounted");

    normalizeDemoUniverseCore(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();

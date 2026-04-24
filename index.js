(() => {
  "use strict";

  const STYLE_ID = "dgb-root-public-priority-v1";

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

      .root-portal {
        width: min(var(--max), calc(100vw - 24px));
        margin: 0 auto;
        padding: 18px 0 44px;
        position: relative;
        z-index: 1;
      }

      .root-topbar,
      .root-hero,
      .root-priority,
      .root-section,
      .root-card,
      .priority-card,
      .root-door-card {
        border: 1px solid var(--line);
        background: linear-gradient(180deg, rgba(9,17,33,.92), rgba(6,12,24,.86));
        box-shadow: var(--shadow);
      }

      .root-topbar {
        border-radius: 22px;
        padding: 14px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        margin-bottom: 16px;
      }

      .root-brand {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .root-mark {
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

      .root-kicker {
        margin: 0 0 4px;
        color: #c8d7ff;
        font-size: .72rem;
        text-transform: uppercase;
        letter-spacing: .16em;
      }

      .root-title {
        margin: 0;
        font-weight: 850;
        font-size: 1.05rem;
      }

      .root-nav,
      .root-actions,
      .root-footer span:last-child {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 10px;
      }

      .root-nav a,
      .root-button {
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

      .root-nav a:hover,
      .root-nav a:focus-visible,
      .root-button:hover,
      .root-button:focus-visible,
      .root-card:hover,
      .root-card:focus-visible,
      .priority-card:hover,
      .priority-card:focus-visible {
        border-color: var(--strong);
        transform: translateY(-1px);
        outline: none;
      }

      .root-hero {
        border-radius: 34px;
        padding: 24px 20px;
        margin-bottom: 18px;
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(320px, .85fr);
        gap: 20px;
        align-items: center;
        overflow: hidden;
      }

      .root-pill {
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

      .root-pill::before {
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
        max-width: 13ch;
        font-size: clamp(2.35rem, 5vw, 5rem);
        line-height: .95;
        letter-spacing: -.06em;
      }

      h1 span {
        color: var(--gold);
      }

      h2 {
        margin: 0 0 10px;
        font-size: clamp(1.7rem, 3vw, 2.7rem);
        line-height: 1;
        letter-spacing: -.04em;
      }

      p {
        margin: 0;
        color: var(--muted);
        line-height: 1.62;
      }

      .root-hero-copy p {
        max-width: 68ch;
        font-size: clamp(1rem, 1.45vw, 1.14rem);
      }

      .root-actions {
        justify-content: flex-start;
        margin-top: 20px;
      }

      .root-button {
        border-radius: 18px;
        min-height: 48px;
        padding: 0 18px;
      }

      .root-button.primary {
        border-color: rgba(239,210,154,.34);
        background:
          linear-gradient(180deg, rgba(239,210,154,.22), rgba(239,210,154,.07)),
          rgba(255,255,255,.035);
        color: #fff8ea;
      }

      .root-button.summit {
        border-color: rgba(255,159,214,.34);
        background:
          linear-gradient(180deg, rgba(255,159,214,.18), rgba(255,159,214,.06)),
          rgba(255,255,255,.035);
        color: #fff5fb;
      }

      .root-door-card {
        border-radius: 30px;
        padding: 20px;
      }

      .root-door-arch {
        min-height: 430px;
        position: relative;
        border-radius: 30px 30px 22px 22px;
        border: 1px solid rgba(170,198,255,.18);
        background:
          radial-gradient(circle at 50% 45%, rgba(142,197,255,.18), transparent 28%),
          linear-gradient(180deg, rgba(7,17,36,.98), rgba(2,7,16,.99));
        overflow: hidden;
        display: grid;
        place-items: center;
        isolation: isolate;
      }

      .root-door-arch::before {
        content: "";
        position: absolute;
        inset: 10% 10% 8%;
        border-radius: 999px 999px 32px 32px;
        border: 1px solid rgba(210,223,255,.18);
        box-shadow: inset 0 0 42px rgba(126,164,255,.12);
      }

      .root-door-arch::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 13%;
        width: 1px;
        height: 74%;
        background: linear-gradient(180deg, transparent, rgba(225,240,255,.44), transparent);
        opacity: .54;
      }

      .root-door-core {
        position: relative;
        z-index: 3;
        border: 1px solid rgba(210,223,255,.22);
        border-radius: 24px;
        min-width: 142px;
        min-height: 92px;
        background:
          radial-gradient(circle at 50% 40%, rgba(255,255,255,.26), transparent 32%),
          linear-gradient(180deg, rgba(18,35,62,.94), rgba(4,9,18,.98));
        color: #fff;
        font-weight: 900;
        letter-spacing: .24em;
        box-shadow:
          0 0 24px rgba(142,197,255,.22),
          0 0 72px rgba(142,197,255,.14);
        cursor: pointer;
        transition: transform 160ms ease, filter 160ms ease, box-shadow 160ms ease;
      }

      .root-door-card.is-lit .root-door-core,
      .root-door-core:hover,
      .root-door-core:focus-visible {
        transform: scale(.98);
        filter: brightness(1.22);
        box-shadow:
          0 0 28px rgba(255,255,255,.34),
          0 0 88px rgba(142,197,255,.30),
          0 0 132px rgba(239,210,154,.18);
        outline: none;
      }

      .root-door-gem {
        position: absolute;
        left: 50%;
        width: 82px;
        height: 82px;
        border-radius: 18px;
        transform: translateX(-50%) rotate(45deg);
        background:
          radial-gradient(circle at 36% 28%, rgba(255,255,255,.82), transparent 12%),
          linear-gradient(135deg, rgba(142,197,255,.96), rgba(18,69,146,.78));
        border: 1px solid rgba(210,223,255,.22);
        box-shadow: 0 0 30px rgba(142,197,255,.28);
        z-index: 2;
      }

      .root-door-gem.top {
        top: 11%;
      }

      .root-door-gem.bottom {
        bottom: 10%;
      }

      .root-door-caption {
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
        letter-spacing: .12em;
        font-size: .72rem;
        line-height: 1.4;
        backdrop-filter: blur(10px);
      }

      .root-door-caption strong {
        color: #fff;
      }

      .root-priority,
      .root-section {
        margin-top: 18px;
        border-radius: 30px;
        padding: 22px 20px;
        overflow: hidden;
      }

      .root-priority-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
        margin-top: 18px;
      }

      .root-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        margin-top: 18px;
      }

      .priority-card,
      .root-card {
        display: block;
        color: var(--text);
        text-decoration: none;
        border-radius: 22px;
        padding: 18px;
        min-height: 164px;
        border-color: rgba(164,188,255,.14);
        transition: transform 160ms ease, border-color 160ms ease;
      }

      .priority-card.feature {
        min-height: 230px;
        border-color: rgba(239,210,154,.24);
        background:
          radial-gradient(circle at 100% 100%, rgba(239,210,154,.12), transparent 44%),
          linear-gradient(180deg, rgba(9,17,33,.92), rgba(6,12,24,.86));
      }

      .priority-card:nth-child(2).feature {
        border-color: rgba(255,159,214,.24);
        background:
          radial-gradient(circle at 100% 100%, rgba(255,159,214,.12), transparent 44%),
          linear-gradient(180deg, rgba(9,17,33,.92), rgba(6,12,24,.86));
      }

      .priority-card small,
      .root-card small {
        display: block;
        color: #90a3ce;
        text-transform: uppercase;
        letter-spacing: .12em;
        margin-bottom: 8px;
        font-weight: 800;
        font-size: .72rem;
      }

      .priority-card strong,
      .root-card strong {
        display: block;
        color: #f4f7ff;
        font-size: 1.35rem;
        line-height: 1.08;
        margin-bottom: 10px;
      }

      .priority-card p,
      .root-card p {
        font-size: .94rem;
      }

      .root-chain {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 10px;
        margin-top: 18px;
      }

      .root-chain div {
        border: 1px solid rgba(164,188,255,.14);
        border-radius: 20px;
        padding: 14px;
        background: rgba(255,255,255,.03);
        text-align: center;
      }

      .root-chain small {
        display: block;
        color: #90a3ce;
        text-transform: uppercase;
        letter-spacing: .12em;
        margin-bottom: 8px;
        font-weight: 800;
        font-size: .68rem;
      }

      .root-chain strong {
        display: block;
        color: #fff;
      }

      .root-footer {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        color: var(--muted);
        padding: 14px 4px 0;
      }

      .root-footer a {
        color: var(--muted);
        text-decoration: none;
      }

      @media (max-width: 980px) {
        .root-hero {
          grid-template-columns: 1fr;
        }

        .root-grid,
        .root-chain {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 720px) {
        .root-portal {
          width: min(100vw - 16px, var(--max));
          padding: 14px 0 32px;
        }

        .root-topbar {
          flex-wrap: wrap;
        }

        .root-nav {
          width: 100%;
          justify-content: flex-start;
        }

        .root-hero,
        .root-priority,
        .root-section {
          padding: 18px 16px;
        }

        h1 {
          font-size: clamp(2rem, 11vw, 3.4rem);
        }

        .root-priority-grid,
        .root-grid,
        .root-chain {
          grid-template-columns: 1fr;
        }

        .root-door-arch {
          min-height: 390px;
        }

        .root-footer {
          display: grid;
        }

        .root-footer span:last-child {
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

  function wireDoor() {
    const card = document.querySelector("[data-root-door]");
    const core = document.querySelector("[data-door-core]");

    if (!card || !core) return;

    const light = () => {
      card.classList.add("is-lit");
      window.clearTimeout(card.__lightTimer);
      card.__lightTimer = window.setTimeout(() => {
        card.classList.remove("is-lit");
      }, 900);
    };

    core.addEventListener("pointerdown", light);
    core.addEventListener("click", light);
    core.addEventListener("focus", () => card.classList.add("is-lit"));
    core.addEventListener("blur", () => card.classList.remove("is-lit"));

    core.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") light();
    });
  }

  function mount() {
    injectStyle();
    wireDoor();

    const root = document.getElementById("rootPortal");
    if (root) {
      root.setAttribute("data-root-state", "public-priority");
      root.setAttribute("data-root-priority", "upper-room-nine-summits-laws-micro-world");
      root.setAttribute("data-root-js-owner", "index.js");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();

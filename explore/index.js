/* ==========================================================================
   Explore · Generation 2 Diamond Card Motion Instrument
   TARGET=/explore/index.js
   PURPOSE=turn Explore route bubbles themselves into diamond route surfaces
   ========================================================================== */

(() => {
  "use strict";

  const STATE = {
    page: "explore",
    instrument: "diamond-card-motion",
    generation: "second-generation-renewal",
    mounted: false
  };

  const CSS_ID = "explore-diamond-card-motion-css";
  const CARD_SELECTOR = ".route-grid .route-card";

  const css = `
    :root {
      --explore-diamond-spin: 18s;
      --explore-diamond-float: 7s;
      --explore-diamond-glow: rgba(142,197,255,.22);
      --explore-diamond-purple: rgba(200,156,255,.28);
      --explore-diamond-gold: rgba(239,210,154,.18);
    }

    .route-grid[data-diamond-motion-grid="explore-routes"],
    .route-grid {
      perspective: 1000px;
      align-items: center;
      justify-items: center;
    }

    .route-grid .route-card {
      position: relative;
      isolation: isolate;
      overflow: visible;
      width: min(100%, 220px);
      aspect-ratio: 1 / 1;
      min-height: 0 !important;
      padding: 0 !important;
      border: 0 !important;
      border-radius: 0 !important;
      display: grid !important;
      place-items: center !important;
      text-align: center !important;
      background: transparent !important;
      box-shadow: none !important;
      transform-style: preserve-3d;
      transition:
        transform 420ms ease,
        filter 420ms ease;
      will-change: transform, filter;
    }

    .route-grid .route-card::before {
      content: "";
      position: absolute;
      inset: 10%;
      clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
      border: 1px solid rgba(170,198,255,.24);
      background:
        radial-gradient(circle at 50% 50%, var(--explore-diamond-purple), transparent 34%),
        radial-gradient(circle at 50% 72%, var(--explore-diamond-gold), transparent 34%),
        linear-gradient(135deg, rgba(255,255,255,.085), rgba(255,255,255,.018)),
        linear-gradient(180deg, rgba(10,20,42,.96), rgba(7,14,28,.92));
      box-shadow:
        0 0 34px var(--explore-diamond-glow),
        inset 0 0 30px rgba(255,255,255,.035);
      z-index: 0;
      animation:
        exploreDiamondFloat var(--explore-diamond-float) ease-in-out infinite,
        exploreDiamondPulse 5.8s ease-in-out infinite;
      pointer-events: none;
    }

    .route-grid .route-card::after {
      content: "";
      position: absolute;
      inset: 21%;
      clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
      border: 1px solid rgba(255,255,255,.08);
      background:
        radial-gradient(circle at 38% 28%, rgba(255,255,255,.13), transparent 24%),
        linear-gradient(135deg, rgba(255,255,255,.04), rgba(255,255,255,0));
      opacity: .72;
      z-index: 1;
      transform: rotate(0deg);
      animation: exploreInnerDiamondSpin var(--explore-diamond-spin) linear infinite;
      pointer-events: none;
    }

    .route-grid .route-card small,
    .route-grid .route-card strong {
      position: relative;
      z-index: 3;
      display: block;
      max-width: 68%;
      margin-left: auto;
      margin-right: auto;
      text-align: center;
      text-wrap: balance;
    }

    .route-grid .route-card small {
      margin-bottom: 8px;
      color: #a8bbeb;
      font-size: .56rem;
      line-height: 1.12;
      letter-spacing: .12em;
      text-transform: uppercase;
      font-weight: 900;
    }

    .route-grid .route-card strong {
      color: #fff;
      font-size: clamp(.90rem, 2.6vw, 1.1rem);
      line-height: 1.02;
      font-weight: 900;
      letter-spacing: -.025em;
    }

    .route-grid .route-card.is-diamond-motion:hover,
    .route-grid .route-card.is-diamond-motion:focus-visible,
    .route-grid .route-card.is-diamond-active {
      transform: translateY(-6px) rotateX(4deg) rotateY(-4deg) scale(1.035);
      filter: brightness(1.12);
    }

    .route-grid .route-card.is-diamond-motion:hover::before,
    .route-grid .route-card.is-diamond-motion:focus-visible::before,
    .route-grid .route-card.is-diamond-active::before {
      border-color: rgba(239,210,154,.42);
      box-shadow:
        0 0 42px rgba(239,210,154,.22),
        0 0 76px rgba(142,197,255,.18),
        inset 0 0 32px rgba(255,255,255,.055);
    }

    .route-grid .route-card.frontier::before {
      --explore-diamond-purple: rgba(200,156,255,.36);
      --explore-diamond-glow: rgba(200,156,255,.26);
    }

    .route-grid .route-card.product::before {
      --explore-diamond-purple: rgba(147,239,189,.27);
      --explore-diamond-glow: rgba(147,239,189,.20);
    }

    .route-grid .route-card.metaverse::before {
      --explore-diamond-purple: rgba(142,197,255,.34);
      --explore-diamond-glow: rgba(142,197,255,.24);
    }

    .route-grid .route-card.show::before {
      --explore-diamond-purple: rgba(255,154,184,.27);
      --explore-diamond-glow: rgba(255,154,184,.18);
    }

    .route-grid .route-card.door::before,
    .route-grid .route-card.gauge::before {
      --explore-diamond-purple: rgba(239,210,154,.26);
      --explore-diamond-glow: rgba(239,210,154,.18);
    }

    @keyframes exploreDiamondFloat {
      0%, 100% {
        transform: translateY(0) rotate(0deg);
      }
      50% {
        transform: translateY(-5px) rotate(1.5deg);
      }
    }

    @keyframes exploreDiamondPulse {
      0%, 100% {
        opacity: .96;
        filter: brightness(1);
      }
      50% {
        opacity: 1;
        filter: brightness(1.14);
      }
    }

    @keyframes exploreInnerDiamondSpin {
      0% {
        transform: rotate(0deg) scale(.96);
      }
      100% {
        transform: rotate(360deg) scale(.96);
      }
    }

    @media (min-width: 820px) {
      .route-grid {
        gap: 18px !important;
      }

      .route-grid .route-card {
        width: min(100%, 214px);
      }
    }

    @media (max-width: 640px) {
      .route-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 10px !important;
      }

      .route-grid .route-card {
        width: min(100%, 158px);
        aspect-ratio: 1 / 1;
      }

      .route-grid .route-card small {
        max-width: 70%;
        font-size: .48rem;
        margin-bottom: 5px;
      }

      .route-grid .route-card strong {
        max-width: 70%;
        font-size: .78rem;
      }

      .route-grid .route-card.is-diamond-motion:hover,
      .route-grid .route-card.is-diamond-motion:focus-visible,
      .route-grid .route-card.is-diamond-active {
        transform: translateY(-3px) scale(1.02);
      }
    }

    @media (max-width: 380px) {
      .route-grid .route-card {
        width: min(100%, 142px);
      }

      .route-grid .route-card small {
        font-size: .43rem;
      }

      .route-grid .route-card strong {
        font-size: .72rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .route-grid .route-card,
      .route-grid .route-card::before,
      .route-grid .route-card::after {
        animation: none !important;
        transition: none !important;
      }
    }
  `;

  function installCSS() {
    if (document.getElementById(CSS_ID)) return;

    const style = document.createElement("style");
    style.id = CSS_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function activateCards() {
    const cards = Array.from(document.querySelectorAll(CARD_SELECTOR));

    cards.forEach((card, index) => {
      card.classList.add("is-diamond-motion");
      card.style.setProperty("--explore-diamond-spin", `${18 + index * 1.15}s`);
      card.style.setProperty("--explore-diamond-float", `${6.5 + (index % 4) * 0.55}s`);

      card.addEventListener("pointerenter", () => {
        card.classList.add("is-diamond-active");
      });

      card.addEventListener("pointerleave", () => {
        card.classList.remove("is-diamond-active");
      });

      card.addEventListener("focus", () => {
        card.classList.add("is-diamond-active");
      });

      card.addEventListener("blur", () => {
        card.classList.remove("is-diamond-active");
      });
    });

    return cards.length;
  }

  function mount() {
    if (STATE.mounted) return;

    installCSS();
    const count = activateCards();

    STATE.mounted = true;
    document.documentElement.dataset.exploreDiamondMotion = "active";
    document.documentElement.dataset.exploreDiamondCards = String(count);
    document.documentElement.dataset.exploreDiamondMode = "cards-are-diamonds";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();

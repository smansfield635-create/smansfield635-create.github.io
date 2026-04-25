/* ==========================================================================
   Explore · Generation 2 Diamond Motion Instrument
   TARGET=/explore/index.js
   PURPOSE=turn Explore route cards into responsive diamond-motion surfaces
   ========================================================================== */

(() => {
  "use strict";

  const STATE = {
    page: "explore",
    instrument: "diamond-route-motion",
    generation: "second-generation-renewal",
    mounted: false
  };

  const CSS_ID = "explore-diamond-motion-instrument-css";
  const CARD_SELECTOR = ".route-grid .route-card";

  const css = `
    :root {
      --explore-diamond-size: 0.82;
      --explore-diamond-spin: 18s;
      --explore-diamond-float: 7s;
      --explore-diamond-glow: rgba(142,197,255,.22);
      --explore-diamond-purple: rgba(200,156,255,.28);
      --explore-diamond-gold: rgba(239,210,154,.18);
    }

    .route-grid {
      perspective: 900px;
    }

    .route-grid .route-card {
      position: relative;
      isolation: isolate;
      overflow: hidden;
      transform-style: preserve-3d;
      transition:
        transform 420ms ease,
        border-color 420ms ease,
        box-shadow 420ms ease,
        background 420ms ease;
      will-change: transform;
    }

    .route-grid .route-card::before {
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      width: min(86px, 32vw);
      height: min(86px, 32vw);
      transform: translate(-50%, -50%) rotate(45deg) scale(var(--explore-diamond-size));
      border: 1px solid rgba(170,198,255,.20);
      border-radius: 18px;
      background:
        radial-gradient(circle at 50% 50%, var(--explore-diamond-purple), transparent 38%),
        linear-gradient(135deg, rgba(255,255,255,.08), rgba(255,255,255,.015));
      box-shadow:
        0 0 34px var(--explore-diamond-glow),
        inset 0 0 28px rgba(255,255,255,.035);
      opacity: .34;
      z-index: -1;
      animation:
        exploreDiamondSpin var(--explore-diamond-spin) linear infinite,
        exploreDiamondFloat var(--explore-diamond-float) ease-in-out infinite;
      pointer-events: none;
    }

    .route-grid .route-card::after {
      content: "";
      position: absolute;
      inset: 12px;
      border-radius: 16px;
      background:
        radial-gradient(circle at 18% 18%, rgba(255,255,255,.10), transparent 20%),
        radial-gradient(circle at 82% 82%, var(--explore-diamond-gold), transparent 24%);
      opacity: .22;
      z-index: -2;
      pointer-events: none;
    }

    .route-grid .route-card strong,
    .route-grid .route-card small {
      position: relative;
      z-index: 2;
    }

    .route-grid .route-card.is-diamond-motion {
      min-height: 112px;
    }

    .route-grid .route-card.is-diamond-motion:hover,
    .route-grid .route-card.is-diamond-motion:focus-visible,
    .route-grid .route-card.is-diamond-active {
      transform: translateY(-4px) rotateX(3deg) rotateY(-3deg);
      border-color: rgba(239,210,154,.42);
      box-shadow:
        0 28px 90px rgba(0,0,0,.58),
        0 0 34px rgba(142,197,255,.10);
    }

    .route-grid .route-card.is-diamond-motion:hover::before,
    .route-grid .route-card.is-diamond-motion:focus-visible::before,
    .route-grid .route-card.is-diamond-active::before {
      opacity: .56;
      border-color: rgba(239,210,154,.36);
      box-shadow:
        0 0 42px rgba(239,210,154,.20),
        0 0 70px rgba(142,197,255,.16),
        inset 0 0 30px rgba(255,255,255,.045);
      animation-duration: 10s, 5s;
    }

    .route-grid .route-card.frontier::before {
      --explore-diamond-purple: rgba(200,156,255,.34);
      --explore-diamond-glow: rgba(200,156,255,.24);
    }

    .route-grid .route-card.product::before {
      --explore-diamond-purple: rgba(147,239,189,.24);
      --explore-diamond-glow: rgba(147,239,189,.18);
    }

    .route-grid .route-card.metaverse::before {
      --explore-diamond-purple: rgba(142,197,255,.30);
      --explore-diamond-glow: rgba(142,197,255,.22);
    }

    .route-grid .route-card.show::before {
      --explore-diamond-purple: rgba(255,154,184,.24);
      --explore-diamond-glow: rgba(255,154,184,.16);
    }

    .route-grid .route-card.door::before,
    .route-grid .route-card.gauge::before {
      --explore-diamond-purple: rgba(239,210,154,.22);
      --explore-diamond-glow: rgba(239,210,154,.16);
    }

    @keyframes exploreDiamondSpin {
      0% {
        transform: translate(-50%, -50%) rotate(45deg) scale(var(--explore-diamond-size));
      }
      100% {
        transform: translate(-50%, -50%) rotate(405deg) scale(var(--explore-diamond-size));
      }
    }

    @keyframes exploreDiamondFloat {
      0%, 100% {
        margin-top: 0;
        filter: brightness(1);
      }
      50% {
        margin-top: -6px;
        filter: brightness(1.12);
      }
    }

    @media (max-width: 640px) {
      .route-grid .route-card.is-diamond-motion {
        min-height: 76px;
      }

      .route-grid .route-card::before {
        width: 58px;
        height: 58px;
        border-radius: 14px;
        opacity: .28;
      }

      .route-grid .route-card.is-diamond-motion:hover,
      .route-grid .route-card.is-diamond-motion:focus-visible,
      .route-grid .route-card.is-diamond-active {
        transform: translateY(-2px);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .route-grid .route-card::before {
        animation: none !important;
      }

      .route-grid .route-card {
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
      card.style.setProperty("--explore-diamond-spin", `${16 + index * 1.25}s`);
      card.style.setProperty("--explore-diamond-float", `${6 + (index % 4) * 0.6}s`);

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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();

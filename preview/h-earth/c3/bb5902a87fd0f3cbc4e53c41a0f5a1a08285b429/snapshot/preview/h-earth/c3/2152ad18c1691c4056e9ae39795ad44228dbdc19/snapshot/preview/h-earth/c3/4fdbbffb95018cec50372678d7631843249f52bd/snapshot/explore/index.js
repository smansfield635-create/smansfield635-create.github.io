/* /explore/index.js
   EXPLORE_DIAMOND_CARD_MOTION_INTERPLANETARY_TNT_v2
   Full-file replacement.
   Purpose:
   - Pair with /explore/index.html.
   - Promote Explore route cards into diamond route surfaces.
   - Preserve Explore as a route-map room.
   - Detect shared interplanetary background.
   - Publish a route receipt for inspection.
   - Does not create canvas.
   - Does not use GraphicBox.
   - Does not use image generation.
   - Does not claim visual pass.
*/

(() => {
  "use strict";

  const CONTRACT = "EXPLORE_DIAMOND_CARD_MOTION_INTERPLANETARY_TNT_v2";
  const PREVIOUS_CONTRACT = "EXPLORE_DIAMOND_CARD_MOTION_TNT_v1";
  const PAGE_CONTRACT = "EXPLORE_INTERPLANETARY_PURPLE_MANOR_ROUTE_MAP_PAIR_TNT_v2";
  const BACKGROUND_CONTRACT = "DGB_INTERPLANETARY_AXIS_FLOATING_FIGURES_BACKGROUND_JS_TNT_v1";

  const STATE = {
    route: "/explore/",
    page: "explore",
    room: "explore",
    instrument: "diamond-card-motion",
    generation: "second-generation-renewal",
    mounted: false,
    cardCount: 0,
    backgroundDetected: false,
    warnings: [],
    errors: []
  };

  const CSS_ID = "explore-diamond-card-motion-css";
  const CARD_SELECTOR = ".route-card";

  const css = `
    :root {
      --explore-diamond-spin: 18s;
      --explore-diamond-float: 7s;
      --explore-diamond-glow: rgba(181,140,255,.24);
      --explore-diamond-purple: rgba(181,140,255,.30);
      --explore-diamond-gold: rgba(243,200,111,.18);
      --explore-diamond-line: rgba(243,200,111,.28);
    }

    .route-grid[data-diamond-motion-grid="explore-routes"] {
      perspective: 1000px;
      align-items: center;
      justify-items: center;
    }

    .route-card {
      position: relative;
      isolation: isolate;
      overflow: visible;
      width: min(100%, 214px);
      aspect-ratio: 1 / 1;
      min-height: 0 !important;
      padding: 0 !important;
      border: 0 !important;
      border-radius: 0 !important;
      display: grid !important;
      place-items: center !important;
      align-content: center !important;
      justify-content: center !important;
      gap: .24rem !important;
      text-align: center !important;
      background: transparent !important;
      box-shadow: none !important;
      transform-style: preserve-3d;
      transition:
        transform 420ms ease,
        filter 420ms ease;
      will-change: transform, filter;
    }

    .route-card::before {
      content: "";
      position: absolute;
      inset: 10%;
      clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
      border: 1px solid var(--explore-diamond-line);
      background:
        radial-gradient(circle at 50% 50%, var(--explore-diamond-purple), transparent 34%),
        radial-gradient(circle at 50% 72%, var(--explore-diamond-gold), transparent 34%),
        linear-gradient(135deg, rgba(255,255,255,.085), rgba(255,255,255,.018)),
        linear-gradient(180deg, rgba(22,8,48,.96), rgba(7,2,18,.94));
      box-shadow:
        0 0 34px var(--explore-diamond-glow),
        0 0 42px rgba(243,200,111,.08),
        inset 0 0 30px rgba(255,255,255,.035);
      z-index: 0;
      animation:
        exploreDiamondFloat var(--explore-diamond-float) ease-in-out infinite,
        exploreDiamondPulse 5.8s ease-in-out infinite;
      pointer-events: none;
    }

    .route-card::after {
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

    .route-card small,
    .route-card strong,
    .route-card span {
      position: relative;
      z-index: 3;
      display: block;
      max-width: 68%;
      margin-left: auto;
      margin-right: auto;
      text-align: center;
      text-wrap: balance;
    }

    .route-card small {
      color: rgba(255,232,168,.88);
      font-size: .56rem;
      line-height: 1.12;
      letter-spacing: .12em;
      text-transform: uppercase;
      font-weight: 950;
    }

    .route-card strong {
      color: #fff4f9;
      font-size: clamp(.90rem, 2.6vw, 1.1rem);
      line-height: 1.02;
      font-weight: 950;
      letter-spacing: -.025em;
      text-shadow: 0 2px 12px rgba(0,0,0,.82);
    }

    .route-card span {
      color: rgba(237,226,255,.78);
      font-size: .62rem;
      line-height: 1.1;
      font-weight: 850;
      letter-spacing: .05em;
      text-transform: uppercase;
    }

    .route-card.is-diamond-motion:hover,
    .route-card.is-diamond-motion:focus-visible,
    .route-card.is-diamond-active {
      transform: translateY(-6px) rotateX(4deg) rotateY(-4deg) scale(1.035);
      filter: brightness(1.12);
      outline: none;
    }

    .route-card.is-diamond-motion:hover::before,
    .route-card.is-diamond-motion:focus-visible::before,
    .route-card.is-diamond-active::before {
      border-color: rgba(243,200,111,.58);
      box-shadow:
        0 0 42px rgba(243,200,111,.22),
        0 0 76px rgba(181,140,255,.22),
        inset 0 0 32px rgba(255,255,255,.055);
    }

    .route-card.frontier::before {
      --explore-diamond-purple: rgba(200,156,255,.38);
      --explore-diamond-glow: rgba(200,156,255,.28);
    }

    .route-card.product::before {
      --explore-diamond-purple: rgba(147,239,189,.24);
      --explore-diamond-glow: rgba(147,239,189,.18);
    }

    .route-card.metaverse::before {
      --explore-diamond-purple: rgba(142,197,255,.28);
      --explore-diamond-glow: rgba(142,197,255,.22);
    }

    .route-card.show::before {
      --explore-diamond-purple: rgba(255,154,184,.24);
      --explore-diamond-glow: rgba(255,154,184,.18);
    }

    .route-card.door::before,
    .route-card.gauge::before {
      --explore-diamond-purple: rgba(243,200,111,.24);
      --explore-diamond-glow: rgba(243,200,111,.18);
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
      .route-grid[data-diamond-motion-grid="explore-routes"] {
        gap: 18px !important;
      }
    }

    @media (max-width: 640px) {
      .route-grid[data-diamond-motion-grid="explore-routes"] {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 10px !important;
      }

      .route-card {
        width: min(100%, 158px);
      }

      .route-card small {
        max-width: 70%;
        font-size: .48rem;
      }

      .route-card strong {
        max-width: 70%;
        font-size: .78rem;
      }

      .route-card span {
        max-width: 70%;
        font-size: .52rem;
      }

      .route-card.is-diamond-motion:hover,
      .route-card.is-diamond-motion:focus-visible,
      .route-card.is-diamond-active {
        transform: translateY(-3px) scale(1.02);
      }
    }

    @media (max-width: 380px) {
      .route-card {
        width: min(100%, 142px);
      }

      .route-card small {
        font-size: .43rem;
      }

      .route-card strong {
        font-size: .72rem;
      }

      .route-card span {
        font-size: .48rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .route-card,
      .route-card::before,
      .route-card::after {
        animation: none !important;
        transition: none !important;
      }
    }
  `;

  function recordWarning(message) {
    if (!STATE.warnings.includes(message)) STATE.warnings.push(message);
  }

  function recordError(message) {
    if (!STATE.errors.includes(message)) STATE.errors.push(message);
  }

  function installCSS() {
    if (document.getElementById(CSS_ID)) return;

    const style = document.createElement("style");
    style.id = CSS_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function detectBackground() {
    STATE.backgroundDetected = Boolean(
      window.DGB_INTERPLANETARY_BACKGROUND_RECEIPT ||
      document.querySelector("[data-dgb-interplanetary-background-field='true']") ||
      document.documentElement.dataset.dgbInterplanetaryBackground === "true"
    );

    document.documentElement.dataset.exploreInterplanetaryBackgroundDetected = String(STATE.backgroundDetected);

    if (!STATE.backgroundDetected) {
      recordWarning("interplanetary_background_not_detected_yet");
    }
  }

  function activateCards() {
    const cards = Array.from(document.querySelectorAll(CARD_SELECTOR));

    if (!cards.length) {
      recordError("no_explore_route_cards_found");
      return 0;
    }

    cards.forEach((card, index) => {
      card.classList.add("is-diamond-motion");
      card.dataset.exploreDiamondMotion = CONTRACT;
      card.dataset.exploreDiamondIndex = String(index + 1);
      card.style.setProperty("--explore-diamond-spin", `${18 + index * 1.15}s`);
      card.style.setProperty("--explore-diamond-float", `${6.5 + (index % 4) * 0.55}s`);

      card.addEventListener("pointerenter", () => {
        card.classList.add("is-diamond-active");
        document.documentElement.dataset.exploreActiveDiamondRoute = card.getAttribute("href") || "";
      });

      card.addEventListener("pointerleave", () => {
        card.classList.remove("is-diamond-active");
      });

      card.addEventListener("focus", () => {
        card.classList.add("is-diamond-active");
        document.documentElement.dataset.exploreActiveDiamondRoute = card.getAttribute("href") || "";
      });

      card.addEventListener("blur", () => {
        card.classList.remove("is-diamond-active");
      });
    });

    return cards.length;
  }

  function tagRoot(count) {
    document.documentElement.dataset.exploreDiamondMotion = "active";
    document.documentElement.dataset.exploreDiamondMotionContract = CONTRACT;
    document.documentElement.dataset.exploreDiamondMotionPrevious = PREVIOUS_CONTRACT;
    document.documentElement.dataset.explorePageContract = PAGE_CONTRACT;
    document.documentElement.dataset.exploreDiamondCards = String(count);
    document.documentElement.dataset.exploreDiamondMode = "cards-are-diamonds";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";

    if (document.body) {
      document.body.dataset.exploreDiamondMotion = "active";
      document.body.dataset.exploreDiamondMotionContract = CONTRACT;
      document.body.dataset.generatedImage = "false";
      document.body.dataset.graphicBox = "false";
      document.body.dataset.visualPassClaimed = "false";
    }
  }

  function publish(count) {
    window.DGB_EXPLORE_DIAMOND_CARD_MOTION_RECEIPT = {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      pageContract: PAGE_CONTRACT,
      backgroundContract: BACKGROUND_CONTRACT,
      route: "/explore/",
      room: "explore",
      instrument: "diamond-card-motion",
      generation: "second-generation-renewal",
      mounted: STATE.mounted,
      cardCount: count,
      backgroundDetected: STATE.backgroundDetected,
      owns: [
        "route_card_diamond_motion",
        "route_card_hover_focus_activation",
        "diamond_surface_css_injection",
        "explore_motion_receipt"
      ],
      doesNotOwn: [
        "planet_rendering",
        "canvas_creation",
        "Gauges_logic",
        "GraphicBox",
        "image_generation",
        "visual_pass_claim"
      ],
      warnings: STATE.warnings.slice(),
      errors: STATE.errors.slice(),
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      timestamp: new Date().toISOString()
    };

    try {
      window.dispatchEvent(new CustomEvent("dgb:explore:diamond-card-motion", {
        detail: window.DGB_EXPLORE_DIAMOND_CARD_MOTION_RECEIPT
      }));
    } catch (error) {
      /* Event dispatch is optional. */
    }
  }

  function mount() {
    if (STATE.mounted) return;

    installCSS();
    detectBackground();

    const count = activateCards();

    STATE.cardCount = count;
    STATE.mounted = true;

    tagRoot(count);
    publish(count);

    [250, 800, 1600].forEach((delay) => {
      window.setTimeout(() => {
        detectBackground();
        publish(STATE.cardCount);
      }, delay);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();

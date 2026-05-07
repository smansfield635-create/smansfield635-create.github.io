// /nine-summits/universe/universe.motion.js
// NINE_SUMMITS_UNIVERSE_VIOLET_GOLD_INLAY_LAB_INSTRUMENTS_TNT_v5
// Full-file replacement.
// Purpose:
// - Renews the Universe motion contract from black/gold dominant to violet/purple primary with gold borders, gold glow, and black-gold inlay.
// - Emits mathematical lab instruments and cognitive delivery methods.
// - Drives violet/gold inlay motion with lightweight DOM/CSS variables.
// - Does not render Audralia.
// - Does not touch Gauges logic.
// - Does not create canvas.
// - Does not use image generation.
// - Does not use GraphicBox.
// - Does not claim visual pass.

(() => {
  "use strict";

  const CONTRACT = "NINE_SUMMITS_UNIVERSE_VIOLET_GOLD_INLAY_LAB_INSTRUMENTS_TNT_v5";
  const PREVIOUS_CONTRACT = "NINE_SUMMITS_UNIVERSE_BLACK_GOLD_INLAY_LAB_INSTRUMENTS_TNT_v4";
  const RECEIPT = "NINE_SUMMITS_UNIVERSE_VIOLET_GOLD_LAB_INSTRUMENT_MOTION_JS_RECEIPT_v5";

  const ROOT = document.documentElement;
  const REDUCED_MOTION = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const GOLDEN_RATIO = 1.618;
  const FULL_CIRCLE = 360;
  const LATTICE_SCOPE = 256;

  const cognitiveStatus = document.querySelector("[data-cognitive-status]");
  const options = Array.from(document.querySelectorAll("[data-world-option]"));
  const motionField = document.querySelector(".motion-field");

  const instrumentRatio = document.querySelector("[data-instrument-ratio]");
  const instrumentAxis = document.querySelector("[data-instrument-axis]");
  const instrumentPhase = document.querySelector("[data-instrument-phase]");
  const instrumentLattice = document.querySelector("[data-instrument-lattice]");
  const instrumentCadence = document.querySelector("[data-instrument-cadence]");

  const cues = [
    {
      key: "Audralia",
      axis: "N",
      phase: 0,
      cadence: "1/4",
      color: "violet",
      text: "North locks the home-world body. Audralia is visible downstream; this Universe route names it without becoming the planet renderer."
    },
    {
      key: "Book Spine",
      axis: "E",
      phase: 90,
      cadence: "2/4",
      color: "purple",
      text: "East locks the human climb. The Book Spine converts world-setting into meaning, ascent, and readable direction."
    },
    {
      key: "Showroom",
      axis: "S",
      phase: 180,
      cadence: "3/4",
      color: "gold",
      text: "South locks proof delivery. Showroom displays and demonstrates without taking ownership of the Universe route."
    },
    {
      key: "Frontier",
      axis: "W",
      phase: 270,
      cadence: "4/4",
      color: "deep-violet",
      text: "West locks expansion. Frontier keeps the edge open without making unfinished territory look complete."
    }
  ];

  let cueIndex = 0;
  let cycleTimer = null;
  let rafId = null;
  let startTime = performance.now();

  function setReceipt() {
    ROOT.dataset.motionReceipt = RECEIPT;
    ROOT.dataset.motionContract = CONTRACT;
    ROOT.dataset.previousMotionContract = PREVIOUS_CONTRACT;
    ROOT.dataset.motionLoaded = "true";
    ROOT.dataset.labInstruments = "active";
    ROOT.dataset.universeTheme = "violet-purple-gold-black-inlay";
    ROOT.dataset.generatedImage = "false";
    ROOT.dataset.graphicBox = "false";
    ROOT.dataset.visualPassClaimed = "false";
    ROOT.dataset.heavyRuntimeLoaded = "false";

    window.DGB_NINE_SUMMITS_UNIVERSE_LAB_RECEIPT = {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      receipt: RECEIPT,
      route: "/nine-summits/universe/",
      theme: "violet_purple_primary_gold_border_black_gold_inlay",
      owns: [
        "violet_purple_primary_motion",
        "golden_glow_button_support",
        "gold_border_system",
        "black_gold_inlay_line_system",
        "mathematical_instrument_panel",
        "cardinal_cognitive_delivery",
        "orbit_phase_display",
        "lattice_scope_display"
      ],
      doesNotOwn: [
        "Audralia_renderer",
        "planet_surface",
        "moon_surface",
        "sun_surface",
        "Gauges_logic",
        "instrument_state_authority",
        "heavy_runtime",
        "canvas",
        "image_generation",
        "GraphicBox"
      ],
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      heavyRuntimeLoaded: false,
      timestamp: new Date().toISOString()
    };
  }

  function setText(node, value) {
    if (node) node.textContent = value;
  }

  function setCue(index, source = "cycle") {
    if (!cues.length) return;

    cueIndex = ((index % cues.length) + cues.length) % cues.length;
    const cue = cues[cueIndex];

    if (cognitiveStatus) {
      cognitiveStatus.textContent = cue.text;
    }

    ROOT.dataset.activeUniverseOption = cue.key;
    ROOT.dataset.activeUniverseAxis = cue.axis;
    ROOT.dataset.activeUniversePhase = String(cue.phase);
    ROOT.dataset.activeUniverseCueColor = cue.color;
    ROOT.dataset.cognitiveCueSource = source;

    setText(instrumentRatio, GOLDEN_RATIO.toFixed(3));
    setText(instrumentAxis, cue.axis);
    setText(instrumentPhase, `${cue.phase}°`);
    setText(instrumentLattice, String(LATTICE_SCOPE));
    setText(instrumentCadence, cue.cadence);

    options.forEach((option) => {
      const isActive = option.dataset.worldOption === cue.key;
      option.dataset.activeOption = isActive ? "true" : "false";
      option.setAttribute("aria-current", isActive ? "true" : "false");
    });

    emitActiveStyle();
  }

  function bindOptionEvents() {
    options.forEach((option, index) => {
      option.addEventListener("mouseenter", () => {
        setCue(index, "hover");
      });

      option.addEventListener("focus", () => {
        setCue(index, "focus");
      });

      option.addEventListener("click", () => {
        setCue(index, "click");
      });
    });
  }

  function startCueCycle() {
    if (REDUCED_MOTION || !cues.length) return;

    stopCueCycle();

    cycleTimer = window.setInterval(() => {
      setCue(cueIndex + 1, "cycle");
    }, 5200);
  }

  function stopCueCycle() {
    if (cycleTimer) {
      window.clearInterval(cycleTimer);
      cycleTimer = null;
    }
  }

  function emitVioletGoldMotes() {
    if (!motionField || REDUCED_MOTION || motionField.dataset.violetGoldMotes === "true") return;

    motionField.dataset.violetGoldMotes = "true";

    const motes = [
      { label: "1", tone: "gold" },
      { label: "4", tone: "violet" },
      { label: "16", tone: "purple" },
      { label: "256", tone: "gold" },
      { label: "N", tone: "violet" },
      { label: "E", tone: "purple" },
      { label: "S", tone: "gold" },
      { label: "W", tone: "deep-violet" },
      { label: "φ", tone: "violet" },
      { label: "90°", tone: "purple" },
      { label: "360°", tone: "gold" },
      { label: "AUD", tone: "deep-violet" }
    ];

    motes.forEach((mote, index) => {
      const node = document.createElement("span");
      const left = 6 + ((index * 11) % 88);
      const top = 10 + ((index * 17) % 78);
      const duration = 18 + (index % 5) * 3;

      node.className = `universe-mote universe-mote-${mote.tone}`;
      node.textContent = mote.label;
      node.setAttribute("aria-hidden", "true");
      node.style.position = "absolute";
      node.style.left = `${left}%`;
      node.style.top = `${top}%`;
      node.style.width = "2.2rem";
      node.style.height = "2.2rem";
      node.style.display = "grid";
      node.style.placeItems = "center";
      node.style.borderRadius = "999px";
      node.style.font = "900 0.66rem/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
      node.style.letterSpacing = "0.08em";
      node.style.animation = `universeMoteDrift ${duration}s ease-in-out ${index * -1.5}s infinite`;

      motionField.appendChild(node);
    });
  }

  function emitActiveStyle() {
    if (document.getElementById("universe-violet-gold-lab-instrument-style")) return;

    const style = document.createElement("style");
    style.id = "universe-violet-gold-lab-instrument-style";
    style.textContent = `
      :root {
        --universe-violet: #8b5cf6;
        --universe-violet-2: #a78bfa;
        --universe-purple: #6d28d9;
        --universe-purple-2: #c4b5fd;
        --universe-gold: #f4c95d;
        --universe-gold-2: #ffe8a8;
        --universe-black: #030205;
        --universe-black-2: #08050d;
        --universe-inlay: rgba(244, 201, 93, 0.28);
        --universe-violet-glow: rgba(139, 92, 246, 0.34);
        --universe-gold-glow: rgba(244, 201, 93, 0.42);
      }

      html[data-universe-theme="violet-purple-gold-black-inlay"],
      html[data-universe-theme="violet-purple-gold-black-inlay"] body {
        background:
          radial-gradient(circle at 50% 7%, rgba(139,92,246,0.24), transparent 25rem),
          radial-gradient(circle at 18% 34%, rgba(109,40,217,0.20), transparent 31rem),
          radial-gradient(circle at 82% 44%, rgba(244,201,93,0.14), transparent 34rem),
          radial-gradient(circle at 50% 100%, rgba(167,139,250,0.12), transparent 36rem),
          linear-gradient(180deg, #09050d, #030205 64%, #000);
      }

      html[data-universe-theme="violet-purple-gold-black-inlay"] body::before {
        background-image:
          radial-gradient(circle at 12% 20%, rgba(196,181,253,0.22) 0, rgba(196,181,253,0) 1.2px),
          radial-gradient(circle at 72% 16%, rgba(255,232,168,0.16) 0, rgba(255,232,168,0) 1.1px),
          radial-gradient(circle at 84% 58%, rgba(139,92,246,0.15) 0, rgba(139,92,246,0) 1px),
          radial-gradient(circle at 24% 72%, rgba(244,201,93,0.13) 0, rgba(244,201,93,0) 1.2px);
        background-size: 180px 220px, 240px 260px, 210px 250px, 260px 300px;
        opacity: 0.44;
      }

      html[data-universe-theme="violet-purple-gold-black-inlay"] .motion-field::before {
        background:
          conic-gradient(
            from var(--phase) at 50% 50%,
            transparent 0deg,
            rgba(139,92,246,0.22) 42deg,
            transparent 82deg,
            rgba(244,201,93,0.12) 128deg,
            transparent 184deg,
            rgba(167,139,250,0.20) 238deg,
            transparent 292deg,
            rgba(255,232,168,0.10) 336deg,
            transparent 360deg
          );
        opacity: 0.52;
      }

      html[data-universe-theme="violet-purple-gold-black-inlay"] .motion-core {
        background:
          radial-gradient(circle at 42% 42%, rgba(196,181,253,0.26), transparent 34%),
          radial-gradient(circle at 58% 56%, rgba(244,201,93,0.16), transparent 52%),
          radial-gradient(circle at 50% 50%, rgba(139,92,246,0.16), transparent 64%);
        box-shadow:
          0 0 3.4rem rgba(139,92,246,0.24),
          0 0 4.2rem rgba(244,201,93,0.12),
          inset 0 0 2.8rem rgba(255,232,168,0.06);
      }

      html[data-universe-theme="violet-purple-gold-black-inlay"] .motion-orbit {
        border-color: rgba(196,181,253,0.18);
        box-shadow:
          0 0 2rem rgba(139,92,246,0.10),
          inset 0 0 1.5rem rgba(244,201,93,0.04);
      }

      html[data-universe-theme="violet-purple-gold-black-inlay"] .motion-orbit.two {
        border-color: rgba(255,232,168,0.18);
        box-shadow:
          0 0 2rem rgba(244,201,93,0.10),
          inset 0 0 1.5rem rgba(139,92,246,0.04);
      }

      html[data-universe-theme="violet-purple-gold-black-inlay"] .motion-shape {
        border-color: rgba(196,181,253,0.40);
        background:
          linear-gradient(135deg, rgba(255,255,255,0.14), transparent 28%),
          radial-gradient(circle at 68% 28%, rgba(196,181,253,0.30), transparent 34%),
          linear-gradient(145deg, rgba(139,92,246,0.20), rgba(3,3,3,0.22) 58%, rgba(244,201,93,0.10));
        box-shadow:
          0 0 1.4rem rgba(139,92,246,0.22),
          0 0 2.2rem rgba(244,201,93,0.12),
          inset 0 0 1.2rem rgba(255,232,168,0.08);
      }

      html[data-universe-theme="violet-purple-gold-black-inlay"] .motion-shape::after {
        color: rgba(255,248,232,0.76);
        text-shadow:
          0 0 0.7rem rgba(139,92,246,0.42),
          0 0 1rem rgba(244,201,93,0.24);
      }

      html[data-universe-theme="violet-purple-gold-black-inlay"] .nav a,
      html[data-universe-theme="violet-purple-gold-black-inlay"] .route-link {
        border-color: rgba(196,181,253,0.24);
        background:
          linear-gradient(180deg, rgba(139,92,246,0.08), rgba(244,201,93,0.025)),
          rgba(0,0,0,0.38);
        box-shadow:
          inset 0 0 0 1px rgba(244,201,93,0.04),
          0 0 1.2rem rgba(139,92,246,0.08);
      }

      html[data-universe-theme="violet-purple-gold-black-inlay"] .nav a[aria-current="page"] {
        border-color: rgba(255,232,168,0.96);
        color: #080604;
        background:
          radial-gradient(circle at 50% 0%, rgba(255,255,255,0.52), transparent 38%),
          linear-gradient(135deg, #fff3c4, #f4c95d 42%, #a78bfa 74%, #6d28d9);
        box-shadow:
          0 0 0.9rem rgba(244,201,93,0.44),
          0 0 2rem rgba(139,92,246,0.26),
          0 0.65rem 1.8rem rgba(244,201,93,0.20);
      }

      html[data-universe-theme="violet-purple-gold-black-inlay"] .button {
        border-color: rgba(255,232,168,0.98);
        background:
          radial-gradient(circle at 50% 0%, rgba(255,255,255,0.62), transparent 38%),
          linear-gradient(135deg, #fff3c4, #f4c95d 44%, #a78bfa 78%, #6d28d9);
        box-shadow:
          0 0 0.9rem rgba(255,232,168,0.62),
          0 0 2.5rem rgba(244,201,93,0.34),
          0 0 3.4rem rgba(139,92,246,0.20),
          0 1rem 2.5rem rgba(244,201,93,0.18);
      }

      html[data-universe-theme="violet-purple-gold-black-inlay"] .button.secondary {
        border-color: rgba(255,232,168,0.46);
        color: #fff8e8;
        background:
          radial-gradient(circle at 50% 0%, rgba(139,92,246,0.20), transparent 42%),
          linear-gradient(180deg, rgba(139,92,246,0.12), rgba(244,201,93,0.035)),
          rgba(0,0,0,0.76);
        box-shadow:
          0 0 0.75rem rgba(139,92,246,0.26),
          0 0 1.9rem rgba(244,201,93,0.15);
      }

      html[data-universe-theme="violet-purple-gold-black-inlay"] .button:hover,
      html[data-universe-theme="violet-purple-gold-black-inlay"] .button:focus-visible {
        box-shadow:
          0 0 1.2rem rgba(255,232,168,0.72),
          0 0 3.1rem rgba(244,201,93,0.44),
          0 0 4.2rem rgba(139,92,246,0.30),
          0 1.2rem 3rem rgba(244,201,93,0.24);
      }

      html[data-universe-theme="violet-purple-gold-black-inlay"] .universe-stage,
      html[data-universe-theme="violet-purple-gold-black-inlay"] .lab-panel,
      html[data-universe-theme="violet-purple-gold-black-inlay"] .route-panel,
      html[data-universe-theme="violet-purple-gold-black-inlay"] .receipt {
        border-color: rgba(255,232,168,0.24);
        background:
          radial-gradient(circle at 50% 0%, rgba(139,92,246,0.10), transparent 34%),
          linear-gradient(180deg, rgba(139,92,246,0.055), rgba(244,201,93,0.018)),
          rgba(0,0,0,0.78);
        box-shadow:
          0 0 2rem rgba(139,92,246,0.10),
          0 0 2.8rem rgba(244,201,93,0.07),
          inset 0 1px 0 rgba(255,232,168,0.09);
      }

      html[data-universe-theme="violet-purple-gold-black-inlay"] .universe-stage::before,
      html[data-universe-theme="violet-purple-gold-black-inlay"] .universe-stage::after {
        background:
          linear-gradient(
            180deg,
            transparent,
            rgba(196,181,253,0.48),
            rgba(244,201,93,0.28),
            transparent
          );
      }

      html[data-universe-theme="violet-purple-gold-black-inlay"] .universe-stage::after {
        background:
          linear-gradient(
            90deg,
            transparent,
            rgba(196,181,253,0.42),
            rgba(244,201,93,0.28),
            transparent
          );
      }

      html[data-universe-theme="violet-purple-gold-black-inlay"] .diamond-shell {
        border-color: rgba(255,232,168,0.82);
        background:
          linear-gradient(135deg, rgba(255,255,255,0.15), transparent 24%),
          linear-gradient(45deg, transparent 0 42%, rgba(244,201,93,0.18) 43% 45%, transparent 46% 100%),
          radial-gradient(circle at 68% 32%, rgba(196,181,253,0.28), transparent 32%),
          radial-gradient(circle at 30% 72%, rgba(244,201,93,0.20), transparent 38%),
          linear-gradient(145deg, rgba(10,6,15,0.94), rgba(0,0,0,0.88) 58%, rgba(109,40,217,0.26));
        box-shadow:
          0 1.4rem 3.5rem rgba(0,0,0,0.46),
          0 0 2.1rem rgba(139,92,246,0.18),
          0 0 2.4rem rgba(244,201,93,0.13),
          inset 0 0 0 1px rgba(255,232,168,0.16),
          inset 0 0 2rem rgba(255,232,168,0.07);
      }

      html[data-universe-theme="violet-purple-gold-black-inlay"] .diamond-lines::before {
        background:
          linear-gradient(90deg, transparent 49.5%, rgba(255,232,168,0.42) 50%, transparent 50.5%),
          linear-gradient(0deg, transparent 49.5%, rgba(196,181,253,0.36) 50%, transparent 50.5%),
          linear-gradient(45deg, transparent 49.5%, rgba(244,201,93,0.24) 50%, transparent 50.5%),
          linear-gradient(-45deg, transparent 49.5%, rgba(196,181,253,0.24) 50%, transparent 50.5%);
        opacity: 0.90;
      }

      html[data-universe-theme="violet-purple-gold-black-inlay"] [data-active-option="true"] .diamond-shell {
        border-color: rgba(255,248,232,0.98);
        box-shadow:
          0 1.4rem 3.5rem rgba(0,0,0,0.46),
          0 0 1.3rem rgba(255,232,168,0.52),
          0 0 3.5rem rgba(244,201,93,0.30),
          0 0 4.2rem rgba(139,92,246,0.32),
          inset 0 0 0 1px rgba(255,232,168,0.24),
          inset 0 0 2rem rgba(196,181,253,0.14);
      }

      html[data-universe-theme="violet-purple-gold-black-inlay"] [data-active-option="true"] .diamond-content strong {
        color: #fff8e8;
        text-shadow:
          0 0 0.75rem rgba(244,201,93,0.42),
          0 0 1.1rem rgba(139,92,246,0.44),
          0 2px 0 rgba(0,0,0,0.22);
      }

      html[data-universe-theme="violet-purple-gold-black-inlay"] .instrument {
        border-color: rgba(255,232,168,0.20);
        background:
          radial-gradient(circle at 50% 0%, rgba(139,92,246,0.14), transparent 42%),
          linear-gradient(180deg, rgba(244,201,93,0.045), rgba(0,0,0,0.18)),
          rgba(0,0,0,0.30);
        box-shadow:
          inset 0 0 0 1px rgba(244,201,93,0.035),
          0 0 1rem rgba(139,92,246,0.08);
        transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
      }

      html[data-universe-theme="violet-purple-gold-black-inlay"] .instrument:hover {
        border-color: rgba(255,232,168,0.48);
        box-shadow:
          0 0 1.4rem rgba(244,201,93,0.16),
          0 0 2.2rem rgba(139,92,246,0.18);
        transform: translateY(-1px);
      }

      @keyframes universeMoteDrift {
        0%, 100% {
          transform: translate3d(0, 0, 0) scale(1);
          opacity: 0.26;
        }
        50% {
          transform: translate3d(0.8rem, -1.1rem, 0) scale(1.08);
          opacity: 0.62;
        }
      }

      .universe-mote {
        background: rgba(0,0,0,0.24);
      }

      .universe-mote-gold {
        border: 1px solid rgba(255,232,168,0.22);
        color: rgba(255,248,232,0.52);
        box-shadow:
          0 0 1.2rem rgba(244,201,93,0.18),
          0 0 1.8rem rgba(139,92,246,0.06);
      }

      .universe-mote-violet,
      .universe-mote-purple,
      .universe-mote-deep-violet {
        border: 1px solid rgba(196,181,253,0.22);
        color: rgba(196,181,253,0.56);
        box-shadow:
          0 0 1.2rem rgba(139,92,246,0.18),
          0 0 1.8rem rgba(244,201,93,0.07);
      }

      .universe-mote-deep-violet {
        color: rgba(216,180,254,0.58);
      }

      @media (prefers-reduced-motion: reduce) {
        .universe-mote {
          animation: none !important;
        }

        .instrument {
          transition: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function startPhaseLoop() {
    if (REDUCED_MOTION) return;

    const tick = (now) => {
      const elapsed = now - startTime;
      const phase = Math.round((elapsed / 1000 * GOLDEN_RATIO * 6) % FULL_CIRCLE);
      const violetPhase = Math.round((elapsed / 1000 * GOLDEN_RATIO * 4) % FULL_CIRCLE);
      const tilt = -12 + Math.sin(elapsed / 4200) * 4;
      const glow = 0.28 + (Math.sin(elapsed / 1900) + 1) * 0.12;
      const violetGlow = 0.32 + (Math.cos(elapsed / 2300) + 1) * 0.13;

      ROOT.style.setProperty("--phase", `${phase}deg`);
      ROOT.style.setProperty("--violet-phase", `${violetPhase}deg`);
      ROOT.style.setProperty("--tilt", `${tilt.toFixed(2)}deg`);
      ROOT.style.setProperty("--glow-live", glow.toFixed(3));
      ROOT.style.setProperty("--violet-glow-live", violetGlow.toFixed(3));

      if (instrumentPhase && ROOT.dataset.cognitiveCueSource === "phase") {
        instrumentPhase.textContent = `${phase}°`;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
  }

  function stopPhaseLoop() {
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function bindKeyboardDelivery() {
    const keyToIndex = {
      ArrowUp: 0,
      ArrowRight: 1,
      ArrowDown: 2,
      ArrowLeft: 3
    };

    document.addEventListener("keydown", (event) => {
      if (!Object.prototype.hasOwnProperty.call(keyToIndex, event.key)) return;

      const activeElement = document.activeElement;
      const inside =
        activeElement &&
        (
          activeElement.closest(".diamond-compass") ||
          activeElement.closest(".lab-panel")
        );

      if (!inside) return;

      event.preventDefault();
      setCue(keyToIndex[event.key], "keyboard");
    });
  }

  function init() {
    setReceipt();
    emitActiveStyle();
    emitVioletGoldMotes();
    bindOptionEvents();
    bindKeyboardDelivery();
    setCue(0, "init");
    startCueCycle();
    startPhaseLoop();

    window.addEventListener("pagehide", () => {
      stopCueCycle();
      stopPhaseLoop();
    }, { once: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

// /nine-summits/universe/universe.motion.js
// NINE_SUMMITS_UNIVERSE_BLACK_GOLD_INLAY_LAB_INSTRUMENTS_TNT_v4
// Full-file replacement.
// Purpose:
// - Emits mathematical lab instruments and cognitive delivery methods.
// - Drives black/gold inlay motion with lightweight DOM/CSS variables.
// - Does not render Audralia.
// - Does not touch Gauges logic.
// - Does not create canvas.
// - Does not use image generation.
// - Does not use GraphicBox.

(() => {
  "use strict";

  const CONTRACT = "NINE_SUMMITS_UNIVERSE_BLACK_GOLD_INLAY_LAB_INSTRUMENTS_TNT_v4";
  const RECEIPT = "NINE_SUMMITS_UNIVERSE_LAB_INSTRUMENT_MOTION_JS_RECEIPT_v4";
  const ROOT = document.documentElement;
  const REDUCED_MOTION = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const GOLDEN_RATIO = 1.618;
  const FULL_CIRCLE = 360;
  const CARDINAL_STEP = 90;
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
      text: "North locks the home-world body. Audralia is visible downstream; this Universe route names it without becoming the planet renderer."
    },
    {
      key: "Book Spine",
      axis: "E",
      phase: 90,
      cadence: "2/4",
      text: "East locks the human climb. The Book Spine converts world-setting into meaning, ascent, and readable direction."
    },
    {
      key: "Showroom",
      axis: "S",
      phase: 180,
      cadence: "3/4",
      text: "South locks proof delivery. Showroom displays and demonstrates without taking ownership of the Universe route."
    },
    {
      key: "Frontier",
      axis: "W",
      phase: 270,
      cadence: "4/4",
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
    ROOT.dataset.motionLoaded = "true";
    ROOT.dataset.labInstruments = "active";
    ROOT.dataset.generatedImage = "false";
    ROOT.dataset.graphicBox = "false";
    ROOT.dataset.visualPassClaimed = "false";
    ROOT.dataset.heavyRuntimeLoaded = "false";

    window.DGB_NINE_SUMMITS_UNIVERSE_LAB_RECEIPT = {
      contract: CONTRACT,
      receipt: RECEIPT,
      route: "/nine-summits/universe/",
      owns: [
        "black_gold_inlay_motion",
        "golden_glow_button_support",
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

  function emitGoldMotes() {
    if (!motionField || REDUCED_MOTION) return;

    const labels = ["1", "4", "16", "256", "N", "E", "S", "W", "φ", "90°", "360°", "AUD"];

    labels.forEach((label, index) => {
      const mote = document.createElement("span");
      const left = 6 + ((index * 11) % 88);
      const top = 10 + ((index * 17) % 78);
      const duration = 18 + (index % 5) * 3;

      mote.className = "universe-mote";
      mote.textContent = label;
      mote.setAttribute("aria-hidden", "true");
      mote.style.position = "absolute";
      mote.style.left = `${left}%`;
      mote.style.top = `${top}%`;
      mote.style.width = "2.2rem";
      mote.style.height = "2.2rem";
      mote.style.display = "grid";
      mote.style.placeItems = "center";
      mote.style.border = "1px solid rgba(255,232,168,0.18)";
      mote.style.borderRadius = "999px";
      mote.style.color = "rgba(255,248,232,0.42)";
      mote.style.background = "rgba(0,0,0,0.22)";
      mote.style.font = "900 0.66rem/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
      mote.style.letterSpacing = "0.08em";
      mote.style.boxShadow = "0 0 1.2rem rgba(244,201,93,0.12)";
      mote.style.animation = `universeMoteDrift ${duration}s ease-in-out ${index * -1.5}s infinite`;

      motionField.appendChild(mote);
    });
  }

  function emitActiveStyle() {
    if (document.getElementById("universe-lab-instrument-style")) return;

    const style = document.createElement("style");
    style.id = "universe-lab-instrument-style";
    style.textContent = `
      @keyframes universeMoteDrift {
        0%, 100% {
          transform: translate3d(0, 0, 0) scale(1);
          opacity: 0.26;
        }
        50% {
          transform: translate3d(0.8rem, -1.1rem, 0) scale(1.08);
          opacity: 0.58;
        }
      }

      [data-active-option="true"] .diamond-shell {
        border-color: rgba(255,248,232,0.98);
        box-shadow:
          0 1.4rem 3.5rem rgba(0,0,0,0.46),
          0 0 1.2rem rgba(255,232,168,0.46),
          0 0 3.4rem rgba(244,201,93,0.28),
          inset 0 0 0 1px rgba(255,232,168,0.24),
          inset 0 0 2rem rgba(255,232,168,0.11);
      }

      [data-active-option="true"] .diamond-content strong {
        color: #fff8e8;
        text-shadow:
          0 0 0.75rem rgba(244,201,93,0.36),
          0 2px 0 rgba(0,0,0,0.22);
      }

      .instrument {
        transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
      }

      .instrument:hover {
        border-color: rgba(255,232,168,0.40);
        box-shadow: 0 0 1.4rem rgba(244,201,93,0.12);
        transform: translateY(-1px);
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
      const tilt = -12 + Math.sin(elapsed / 4200) * 4;
      const glow = 0.28 + (Math.sin(elapsed / 1900) + 1) * 0.12;

      ROOT.style.setProperty("--phase", `${phase}deg`);
      ROOT.style.setProperty("--tilt", `${tilt.toFixed(2)}deg`);
      ROOT.style.setProperty("--glow-live", glow.toFixed(3));

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
    emitGoldMotes();
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

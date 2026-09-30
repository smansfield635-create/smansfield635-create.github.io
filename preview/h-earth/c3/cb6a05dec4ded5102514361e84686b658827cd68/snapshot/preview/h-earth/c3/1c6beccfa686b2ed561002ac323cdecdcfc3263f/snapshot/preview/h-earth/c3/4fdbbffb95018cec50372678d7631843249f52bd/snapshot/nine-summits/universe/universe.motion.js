// /nine-summits/universe/universe.motion.js
// NINE_SUMMITS_UNIVERSE_WORLD_SETTING_MOTION_RENEWAL_TNT_v6
// Full-file replacement.
// Purpose:
// - Preserves the violet / purple / black / gold-inlay splendor of the legacy Universe field.
// - Renews public language from lab-instrument framing into world-setting motion.
// - Drives lightweight lane cues, world instruments, motes, orbit phase, and hover/focus response.
// - Keeps Audralia as living canvas language without becoming the Audralia renderer.
// - Does not render planets.
// - Does not touch Gauges logic.
// - Does not create canvas.
// - Does not use image generation.
// - Does not use GraphicBox.
// - Does not claim visual pass.

(() => {
  "use strict";

  const CONTRACT = "NINE_SUMMITS_UNIVERSE_WORLD_SETTING_MOTION_RENEWAL_TNT_v6";
  const PREVIOUS_CONTRACT = "NINE_SUMMITS_UNIVERSE_VIOLET_GOLD_LAB_INSTRUMENT_MOTION_JS_RECEIPT_v5";
  const RECEIPT = "NINE_SUMMITS_UNIVERSE_WORLD_SETTING_MOTION_RECEIPT_v6";

  const ROOT = document.documentElement;
  const REDUCED_MOTION =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const GOLDEN_RATIO = 1.618;
  const FULL_CIRCLE = 360;
  const SCOPE = 256;

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
      axis: "Canvas",
      phase: 0,
      cadence: "1/4",
      color: "violet",
      text:
        "Audralia opens the untouched living path: a living canvas where visitors can watch possibility develop before their eyes."
    },
    {
      key: "Book",
      axis: "Climb",
      phase: 90,
      cadence: "2/4",
      color: "purple",
      text:
        "The Book carries the human climb: meaning, ascent, pressure, free will, and the long-form structure behind the world."
    },
    {
      key: "Showroom",
      axis: "Proof",
      phase: 180,
      cadence: "3/4",
      color: "gold",
      text:
        "Showroom gives the proof atrium: visible expression, demonstration, inspection, and public-facing clarity."
    },
    {
      key: "Frontier",
      axis: "Edge",
      phase: 270,
      cadence: "4/4",
      color: "deep-violet",
      text:
        "Frontier keeps the expansion edge open: future stories, media paths, experiences, and unfinished territory without false completion."
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
    ROOT.dataset.worldInstruments = "active";
    ROOT.dataset.universeTheme = "violet-field-gold-inlay";
    ROOT.dataset.generatedImage = "false";
    ROOT.dataset.graphicBox = "false";
    ROOT.dataset.visualPassClaimed = "false";
    ROOT.dataset.heavyRuntimeLoaded = "false";

    window.DGB_NINE_SUMMITS_UNIVERSE_WORLD_SETTING_RECEIPT = Object.freeze({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      receipt: RECEIPT,
      route: "/nine-summits/universe/",
      theme: "violet_field_gold_inlay",
      owns: [
        "violet_gold_inlay_motion",
        "world_setting_lane_cues",
        "golden_glow_button_support",
        "black_gold_inlay_line_system",
        "world_instrument_panel",
        "orbit_phase_display",
        "scope_display",
        "lightweight_motes"
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
    });
  }

  function setText(node, value) {
    if (node) node.textContent = value;
  }

  function setCue(index, source = "cycle") {
    if (!cues.length) return;

    cueIndex = ((index % cues.length) + cues.length) % cues.length;
    const cue = cues[cueIndex];

    setText(cognitiveStatus, cue.text);

    ROOT.dataset.activeUniverseOption = cue.key;
    ROOT.dataset.activeUniverseAxis = cue.axis;
    ROOT.dataset.activeUniversePhase = String(cue.phase);
    ROOT.dataset.activeUniverseCueColor = cue.color;
    ROOT.dataset.cognitiveCueSource = source;

    setText(instrumentRatio, GOLDEN_RATIO.toFixed(3));
    setText(instrumentAxis, cue.axis);
    setText(instrumentPhase, `${cue.phase}°`);
    setText(instrumentLattice, String(SCOPE));
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
      option.addEventListener("mouseenter", () => setCue(index, "hover"));
      option.addEventListener("focus", () => setCue(index, "focus"));
      option.addEventListener("click", () => setCue(index, "click"));
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
    if (!cycleTimer) return;
    window.clearInterval(cycleTimer);
    cycleTimer = null;
  }

  function emitMotes() {
    if (!motionField || REDUCED_MOTION || motionField.dataset.worldSettingMotes === "true") return;

    motionField.dataset.worldSettingMotes = "true";

    const motes = [
      { label: "1", tone: "gold" },
      { label: "4", tone: "violet" },
      { label: "16", tone: "purple" },
      { label: "256", tone: "gold" },
      { label: "LIVE", tone: "violet" },
      { label: "BOOK", tone: "purple" },
      { label: "PROOF", tone: "gold" },
      { label: "EDGE", tone: "deep-violet" },
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
      node.style.font =
        "900 0.66rem/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
      node.style.letterSpacing = "0.08em";
      node.style.animation = `universeMoteDrift ${duration}s ease-in-out ${index * -1.5}s infinite`;

      motionField.appendChild(node);
    });
  }

  function emitActiveStyle() {
    if (document.getElementById("universe-world-setting-motion-style")) return;

    const style = document.createElement("style");
    style.id = "universe-world-setting-motion-style";
    style.textContent = `
      html[data-universe-theme="violet-field-gold-inlay"] [data-active-option="true"] .diamond-shell {
        border-color: rgba(255,248,232,0.98);
        box-shadow:
          0 1.4rem 3.5rem rgba(0,0,0,0.46),
          0 0 1.3rem rgba(255,232,168,0.52),
          0 0 3.5rem rgba(244,201,93,0.30),
          0 0 4.2rem rgba(139,92,246,0.32),
          inset 0 0 0 1px rgba(255,232,168,0.24),
          inset 0 0 2rem rgba(196,181,253,0.14);
      }

      html[data-universe-theme="violet-field-gold-inlay"] [data-active-option="true"] .diamond-content strong {
        color: #fff8e8;
        text-shadow:
          0 0 0.75rem rgba(244,201,93,0.42),
          0 0 1.1rem rgba(139,92,246,0.44),
          0 2px 0 rgba(0,0,0,0.22);
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
        pointer-events: none;
        user-select: none;
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
      const phase = Math.round(((elapsed / 1000) * GOLDEN_RATIO * 6) % FULL_CIRCLE);
      const violetPhase = Math.round(((elapsed / 1000) * GOLDEN_RATIO * 4) % FULL_CIRCLE);
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
    if (!rafId) return;
    window.cancelAnimationFrame(rafId);
    rafId = null;
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
        (activeElement.closest(".diamond-compass") ||
          activeElement.closest(".instrument-panel"));

      if (!inside) return;

      event.preventDefault();
      setCue(keyToIndex[event.key], "keyboard");
    });
  }

  function init() {
    setReceipt();
    emitActiveStyle();
    emitMotes();
    bindOptionEvents();
    bindKeyboardDelivery();
    setCue(0, "init");
    startCueCycle();
    startPhaseLoop();

    window.addEventListener(
      "pagehide",
      () => {
        stopCueCycle();
        stopPhaseLoop();
      },
      { once: true }
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

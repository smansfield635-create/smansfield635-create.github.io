/* /assets/compass/compass.cosmos.js
   Diamond Gate Bridge Compass — context/decorative companion.

   Emergency continuity rule:
   - In CONSTELLATION, this companion may present global/cardinal context.
   - In CLUSTER_OPEN or ROOM_SELECTED, the foreground room state published by
     the controller owns the context panel. This file must not overwrite it.
   - Room navigation authority remains with the controller/index interaction.
   - Fibonacci/golden-angle page-night decoration remains non-authoritative.
*/
(() => {
  "use strict";

  const GLOBAL_KEY = "DGB_COMPASS_RECONSTRUCTION_V4";
  if (globalThis[GLOBAL_KEY]?.initialized) return;

  const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
  const FIELD_SEED = 0x44474243;
  const COLORS = Object.freeze([
    "255,248,224",
    "154,217,225",
    "234,208,131",
    "170,155,224"
  ]);

  const CARDINALS = Object.freeze({
    north: Object.freeze({
      eyebrow: "North · Orientation",
      title: "Find your bearings before you choose a destination.",
      purpose: "Orientation is the estate's context-facing direction: products, entry points, human origin, guidance, and philosophy.",
      relationship: "Bring North forward when the question is still becoming clear. Open the star when you are ready to see its rooms."
    }),
    east: Object.freeze({
      eyebrow: "East · Worlds",
      title: "Sometimes a system becomes clearer when you can stand inside it.",
      purpose: "Worlds turns comparison, environment, history, civilization, and consequence into places you can explore.",
      relationship: "Bring East forward when place, contrast, or an alternate world can reveal relationships ordinary explanation leaves hidden."
    }),
    south: Object.freeze({
      eyebrow: "South · Instruments",
      title: "Measure, govern, and inspect without mistaking the instrument for the whole truth.",
      purpose: "Instruments gathers the Lab, Laws, Governance, and operational control surfaces.",
      relationship: "Bring South forward when the next responsibility is to measure, verify, govern, or decide what may happen next."
    }),
    west: Object.freeze({
      eyebrow: "West · Frontier",
      title: "When understanding is no longer enough, build the next thing.",
      purpose: "Frontier is the estate's construction-facing direction: prototypes, energy, water, infrastructure, and long-range design.",
      relationship: "Bring West forward when the next question is what should be made, tested, repaired, or carried forward."
    })
  });

  const GLOBAL_CONTEXT = Object.freeze({
    eyebrow: "The Compass · Signature interaction",
    title: "Rotate the estate. Bring a direction forward.",
    purpose: "Drag with a mouse or swipe with a finger. As a cardinal direction comes forward, the context beneath the Compass changes with it.",
    relationship: "Open a direction to see its room stars. Inside a cluster, the room nearest you owns this same context surface."
  });

  const state = {
    root: null,
    panel: null,
    eyebrow: null,
    title: null,
    purpose: null,
    relationship: null,
    interacted: false,
    signature: "",
    night: null,
    resizeTimer: 0,
    sparkleTimer: 0,
    reducedMotion: false
  };

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function randomFactory(seed) {
    let value = seed >>> 0;
    return () => {
      value += 0x6d2b79f5;
      let result = value;
      result = Math.imul(result ^ (result >>> 15), result | 1);
      result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
      return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
    };
  }

  function installFibonacciNight() {
    const mount = document.createElement("div");
    mount.dataset.compassFibonacciNight = "";
    mount.setAttribute("aria-hidden", "true");

    const base = document.createElement("canvas");
    const sparkle = document.createElement("canvas");
    base.dataset.layer = "base";
    sparkle.dataset.layer = "sparkle";
    mount.append(base, sparkle);
    document.body.prepend(mount);

    const baseContext = base.getContext("2d", {alpha: true, desynchronized: true});
    const sparkleContext = sparkle.getContext("2d", {alpha: true, desynchronized: true});
    if (!baseContext || !sparkleContext) return;

    state.night = {
      mount,
      base,
      sparkle,
      baseContext,
      sparkleContext,
      width: 0,
      height: 0,
      dpr: 1,
      stars: [],
      rogue: []
    };

    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      state.reducedMotion = Boolean(motion.matches || state.root?.dataset?.reducedMotion === "true");
      if (state.reducedMotion) sparkleContext.clearRect(0, 0, state.night.width, state.night.height);
    };
    syncMotion();
    motion.addEventListener?.("change", syncMotion);

    const generate = () => {
      const {width, height} = state.night;
      const count = clamp(Math.round(width * height / 7200), 96, 210);
      const random = randomFactory(FIELD_SEED ^ width ^ (height << 7));
      const stars = [];

      for (let i = 0; i < count; i += 1) {
        const radius = Math.sqrt((i + 0.5) / count);
        const angle = i * GOLDEN_ANGLE + (random() - 0.5) * 0.12;
        const x = clamp(0.5 + Math.cos(angle) * radius * 0.71 + (random() - 0.5) * 0.026, 0.012, 0.988);
        const y = clamp(0.46 + Math.sin(angle) * radius * 0.60 + (random() - 0.5) * 0.026, 0.012, 0.988);
        const rogue = random() < 0.13;
        stars.push({
          x: x * width,
          y: y * height,
          radius: 0.45 + random() * 1.35,
          alpha: 0.23 + random() * 0.56,
          color: COLORS[Math.floor(random() * COLORS.length)],
          rogue
        });
      }

      state.night.stars = stars;
      state.night.rogue = stars.filter(star => star.rogue);
    };

    const drawStar = (context, star, alpha = star.alpha, scale = 1) => {
      context.beginPath();
      context.arc(star.x, star.y, star.radius * scale, 0, Math.PI * 2);
      context.fillStyle = `rgba(${star.color},${alpha})`;
      context.shadowColor = `rgba(${star.color},${alpha * 0.65})`;
      context.shadowBlur = star.radius * scale * 4;
      context.fill();
      context.shadowBlur = 0;
    };

    const draw = () => {
      baseContext.clearRect(0, 0, state.night.width, state.night.height);
      state.night.stars.forEach(star => drawStar(baseContext, star));
    };

    const resize = () => {
      const width = Math.max(320, innerWidth || document.documentElement.clientWidth || 320);
      const height = Math.max(480, innerHeight || document.documentElement.clientHeight || 480);
      const dpr = Math.min(devicePixelRatio || 1, width <= 820 ? 1 : 1.25);
      Object.assign(state.night, {width, height, dpr});

      for (const canvas of [base, sparkle]) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }

      baseContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      sparkleContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      generate();
      draw();
    };

    const sparkleBurst = () => {
      clearTimeout(state.sparkleTimer);
      if (state.reducedMotion || document.hidden || !state.night?.rogue.length) return;
      sparkleContext.clearRect(0, 0, state.night.width, state.night.height);
      const random = randomFactory(FIELD_SEED ^ Date.now());
      const pool = [...state.night.rogue]
        .sort(() => random() - 0.5)
        .slice(0, 3 + Math.floor(random() * 4));
      pool.forEach(star => drawStar(sparkleContext, star, Math.min(0.92, star.alpha + 0.2), 1.8));
      state.sparkleTimer = setTimeout(() => {
        sparkleContext.clearRect(0, 0, state.night.width, state.night.height);
      }, 320);
    };

    resize();
    addEventListener("resize", () => {
      clearTimeout(state.resizeTimer);
      state.resizeTimer = setTimeout(resize, 120);
    }, {passive: true});
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) sparkleBurst();
    });
    if (!state.reducedMotion) setInterval(sparkleBurst, 2600);
  }

  function setText(node, value) {
    if (!node) return;
    const next = String(value ?? "");
    if (node.textContent !== next) node.textContent = next;
  }

  function showContext(context, signature) {
    if (!context || state.signature === signature) return;
    state.signature = signature;
    setText(state.eyebrow, context.eyebrow);
    setText(state.title, context.title);
    setText(state.purpose, context.purpose);
    setText(state.relationship, context.relationship);
  }

  function clusterOwnsPanel() {
    const mode = String(state.root?.dataset?.compassMode || "");
    return mode === "CLUSTER_OPEN" || mode === "ROOM_SELECTED";
  }

  function mirrorlandOwnsPanel() {
    const mode = String(state.root?.dataset?.compassMode || "");
    return mode === "MIRRORLAND_REVEALING" ||
      mode === "MIRRORLAND_FOCUSED" ||
      mode === "MIRRORLAND_WITHDRAWING";
  }

  function syncContext() {
    if (!state.root || !state.panel) return;

    // Critical ownership boundary: while a room cluster is open, the controller's
    // foreground-room state and the index bridge own this panel. Do not rewrite it.
    if (clusterOwnsPanel() || mirrorlandOwnsPanel()) {
      state.signature = "";
      return;
    }

    const focus = String(state.root.dataset.orbitPreviewFocus || state.root.dataset.orbitFocus || "north");
    if (state.interacted && CARDINALS[focus]) {
      showContext(CARDINALS[focus], `cardinal:${focus}`);
      return;
    }

    showContext(GLOBAL_CONTEXT, "global");
  }

  function init() {
    state.root = document.querySelector("[data-compass-root]");
    state.panel = document.querySelector("[data-compass-panel]");
    if (!state.root || !state.panel) return;

    state.eyebrow = state.panel.querySelector("[data-compass-panel-eyebrow]");
    state.title = state.panel.querySelector("[data-compass-panel-title]");
    state.purpose = state.panel.querySelector("[data-compass-panel-purpose]");
    state.relationship = state.panel.querySelector("[data-compass-panel-relationship]");

    const scene = document.querySelector("[data-compass-scene]");
    scene?.addEventListener("pointerdown", () => {
      state.interacted = true;
    }, {passive: true});
    scene?.addEventListener("touchstart", () => {
      state.interacted = true;
    }, {passive: true});
    scene?.addEventListener("click", () => {
      state.interacted = true;
      queueMicrotask(syncContext);
    }, {passive: true});

    new MutationObserver(() => queueMicrotask(syncContext)).observe(state.root, {
      attributes: true,
      attributeFilter: [
        "data-compass-mode",
        "data-orbit-focus",
        "data-orbit-preview-focus",
        "data-selected-cardinal",
        "data-selected-room",
        "data-cluster-primary-room",
        "data-cluster-preview-primary-room",
        "data-mirrorland-window-state"
      ]
    });

    installFibonacciNight();
    syncContext();

    globalThis[GLOBAL_KEY] = Object.freeze({
      initialized: true,
      contract: "DGB_COMPASS_CONTEXT_OWNERSHIP_CONTINUITY_v5",
      roomPreviewPanelOwnership: true,
      fibonacciNight: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {once: true});
  } else {
    init();
  }
})();

/* Editorial carousel bootstrap. The runtime itself remains isolated from Compass navigation authority. */
(()=>{const css='/assets/compass/compass.carousel.css?v=1&cb=08977675f07cac99',js='/assets/compass/compass.carousel.js?v=1&cb=511655fb4e44b7e3';if(!document.querySelector('link[href^="/assets/compass/compass.carousel.css?cb=08977675f07cac99"]')){const l=document.createElement('link');l.rel='stylesheet';l.href=css;document.head.append(l)}if(!document.querySelector('script[src^="/assets/compass/compass.carousel.js?cb=511655fb4e44b7e3"]')){const s=document.createElement('script');s.src=js;s.defer=true;document.head.append(s)}})();

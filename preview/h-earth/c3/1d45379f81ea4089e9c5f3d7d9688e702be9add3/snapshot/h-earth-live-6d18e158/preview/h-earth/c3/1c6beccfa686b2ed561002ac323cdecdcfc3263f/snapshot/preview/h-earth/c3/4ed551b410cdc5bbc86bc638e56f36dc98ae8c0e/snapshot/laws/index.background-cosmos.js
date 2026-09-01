/*
 * Laws full-viewport background cosmos.
 * Presentation-only companion to the scene-contained Laws cosmos.
 * No navigation, controller, route, evidence, record, claim, or world-geometry authority.
 */

(() => {
  "use strict";

  const GLOBAL_KEY = "DGB_LAWS_BACKGROUND_COSMOS";
  const RECEIPT_KEY = "DGB_LAWS_BACKGROUND_COSMOS_RECEIPT";
  const CONTRACT = "LAWS_BACKGROUND_COSMOS_STELLAR_CONTINUITY_v1";
  const LAYER_ID = "laws-background-cosmos-layer";
  const CANVAS_ATTRIBUTE = "data-laws-background-cosmos-canvas";
  const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
  const FIELD_SEED = 0x4c415742;

  if (globalThis[GLOBAL_KEY]?.initialized) {
    return;
  }

  const PALETTES = Object.freeze({
    idle: Object.freeze([
      "224, 234, 255",
      "135, 201, 255",
      "197, 169, 255",
      "255, 226, 166"
    ]),
    flow: Object.freeze([
      "213, 249, 255",
      "119, 220, 255",
      "119, 255, 210",
      "235, 247, 255"
    ]),
    integrity: Object.freeze([
      "255, 244, 204",
      "255, 212, 119",
      "255, 240, 180",
      "224, 234, 255"
    ]),
    reality: Object.freeze([
      "237, 226, 255",
      "198, 160, 255",
      "134, 183, 255",
      "224, 234, 255"
    ]),
    structure: Object.freeze([
      "222, 255, 239",
      "127, 255, 192",
      "142, 233, 255",
      "224, 234, 255"
    ]),
    test: Object.freeze([
      "255, 233, 221",
      "255, 155, 130",
      "255, 210, 127",
      "224, 234, 255"
    ]),
    research: Object.freeze([
      "230, 235, 255",
      "145, 170, 255",
      "225, 169, 255",
      "224, 234, 255"
    ])
  });

  const state = {
    initialized: false,
    destroyed: false,
    failed: false,
    layer: null,
    canvas: null,
    context: null,
    width: 0,
    height: 0,
    pixelRatio: 1,
    direction: "idle",
    stars: [],
    resizeFrame: 0,
    mutationObserver: null,
    onResize: null,
    onCorrespondence: null
  };

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  function hash32(value) {
    let x = value >>> 0;
    x ^= x >>> 16;
    x = Math.imul(x, 0x7feb352d);
    x ^= x >>> 15;
    x = Math.imul(x, 0x846ca68b);
    x ^= x >>> 16;
    return x >>> 0;
  }

  function createRandom(seed) {
    let value = seed >>> 0;
    return () => {
      value += 0x6d2b79f5;
      let result = value;
      result = Math.imul(result ^ (result >>> 15), result | 1);
      result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
      return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
    };
  }

  function normalizeDirection(value) {
    const direction = String(value || "").trim().toLowerCase();
    return Object.prototype.hasOwnProperty.call(PALETTES, direction)
      ? direction
      : "idle";
  }

  function currentPalette() {
    return PALETTES[state.direction] || PALETTES.idle;
  }

  function buildReceipt(extra = {}) {
    return {
      contract: CONTRACT,
      module: GLOBAL_KEY,
      renderingModel: "single-pass-static-full-viewport",
      geometryModel: "golden-angle-square-root-jitter-with-rogue-depth-stars",
      sourceRelationship: "scene-cosmos-stellar-language-companion",
      initialized: state.initialized,
      destroyed: state.destroyed,
      failed: state.failed,
      width: state.width,
      height: state.height,
      pixelRatio: state.pixelRatio,
      direction: state.direction,
      starCount: state.stars.length,
      fullViewportLayer: true,
      sceneContained: false,
      ownsNavigation: false,
      ownsControllerState: false,
      ownsRoutes: false,
      ownsEvidence: false,
      ownsRecords: false,
      ownsClaims: false,
      ownsWorldGeometry: false,
      continuousAnimation: false,
      requestAnimationFrameUsedForResizeOnly: true,
      ...extra
    };
  }

  function publish(extra = {}) {
    const receipt = Object.freeze(buildReceipt(extra));
    globalThis[RECEIPT_KEY] = receipt;
    document.documentElement.dataset.lawsBackgroundCosmosStatus = state.failed
      ? "failed"
      : state.initialized
        ? "available"
        : "pending";
    document.documentElement.dataset.lawsBackgroundCosmosContract = CONTRACT;
    document.documentElement.dataset.lawsBackgroundCosmosAuthority = "presentation-only";
    return receipt;
  }

  function createLayer() {
    const existing = document.getElementById(LAYER_ID);
    if (existing) {
      existing.remove();
    }

    const layer = document.createElement("div");
    layer.id = LAYER_ID;
    layer.setAttribute("aria-hidden", "true");
    layer.dataset.lawsBackgroundCosmos = "true";
    layer.dataset.navigationAuthority = "false";
    layer.dataset.controllerAuthority = "false";
    layer.dataset.evidenceAuthority = "false";

    const canvas = document.createElement("canvas");
    canvas.setAttribute(CANVAS_ATTRIBUTE, "true");
    canvas.setAttribute("aria-hidden", "true");
    canvas.setAttribute("role", "presentation");

    layer.append(canvas);
    document.body.prepend(layer);

    state.layer = layer;
    state.canvas = canvas;
    state.context = canvas.getContext("2d", { alpha: true });

    if (!state.context) {
      throw new Error("LAWS_BACKGROUND_COSMOS_2D_CONTEXT_UNAVAILABLE");
    }
  }

  function generateStars() {
    const area = Math.max(1, state.width * state.height);
    const count = clamp(Math.round(area / 12500), 72, 190);
    const random = createRandom(hash32(FIELD_SEED ^ state.width ^ (state.height << 1)));
    const stars = [];

    for (let index = 0; index < count; index += 1) {
      const radial = Math.sqrt((index + 0.5) / count);
      const angle = index * GOLDEN_ANGLE + (random() - 0.5) * 0.22;
      const warpX = 0.53;
      const warpY = 0.49;
      const x = 0.5 + Math.cos(angle) * radial * warpX + (random() - 0.5) * 0.035;
      const y = 0.5 + Math.sin(angle) * radial * warpY + (random() - 0.5) * 0.035;
      const rogue = index % 11 === 0;

      stars.push({
        x: clamp(x, 0.01, 0.99),
        y: clamp(y, 0.01, 0.99),
        radius: rogue
          ? 0.9 + random() * 1.35
          : 0.28 + random() * 0.72,
        alpha: rogue
          ? 0.34 + random() * 0.34
          : 0.13 + random() * 0.34,
        glow: rogue ? 4.5 + random() * 7 : 0,
        colorIndex: Math.floor(random() * PALETTES.idle.length)
      });
    }

    state.stars = stars;
  }

  function draw() {
    const context = state.context;
    if (!context) {
      return;
    }

    context.setTransform(state.pixelRatio, 0, 0, state.pixelRatio, 0, 0);
    context.clearRect(0, 0, state.width, state.height);

    const palette = currentPalette();

    for (const star of state.stars) {
      const x = star.x * state.width;
      const y = star.y * state.height;
      const color = palette[star.colorIndex % palette.length];

      if (star.glow > 0) {
        const gradient = context.createRadialGradient(x, y, 0, x, y, star.glow);
        gradient.addColorStop(0, `rgba(${color}, ${star.alpha * 0.34})`);
        gradient.addColorStop(1, `rgba(${color}, 0)`);
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(x, y, star.glow, 0, Math.PI * 2);
        context.fill();
      }

      context.fillStyle = `rgba(${color}, ${star.alpha})`;
      context.beginPath();
      context.arc(x, y, star.radius, 0, Math.PI * 2);
      context.fill();
    }
  }

  function resize() {
    if (!state.canvas || !state.context) {
      return;
    }

    state.width = Math.max(1, globalThis.innerWidth || document.documentElement.clientWidth || 1);
    state.height = Math.max(1, globalThis.innerHeight || document.documentElement.clientHeight || 1);
    state.pixelRatio = Math.min(globalThis.devicePixelRatio || 1, state.width <= 820 ? 1 : 1.25);

    const pixelWidth = Math.max(1, Math.floor(state.width * state.pixelRatio));
    const pixelHeight = Math.max(1, Math.floor(state.height * state.pixelRatio));

    if (state.canvas.width !== pixelWidth || state.canvas.height !== pixelHeight) {
      state.canvas.width = pixelWidth;
      state.canvas.height = pixelHeight;
    }

    generateStars();
    draw();
    publish({ lastAction: "resize-and-draw" });
  }

  function scheduleResize() {
    if (state.resizeFrame) {
      cancelAnimationFrame(state.resizeFrame);
    }
    state.resizeFrame = requestAnimationFrame(() => {
      state.resizeFrame = 0;
      resize();
    });
  }

  function setDirection(value) {
    const next = normalizeDirection(value);
    if (next === state.direction) {
      return;
    }
    state.direction = next;
    draw();
    publish({ lastAction: "direction-redraw" });
  }

  function observeDirection() {
    state.mutationObserver = new MutationObserver(() => {
      setDirection(document.documentElement.dataset.lawsExperienceDirection);
    });

    state.mutationObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-laws-experience-direction"]
    });

    state.onCorrespondence = event => {
      setDirection(event?.detail?.direction);
    };

    globalThis.addEventListener("LAWS_EXPERIENCE_CORRESPONDENCE", state.onCorrespondence);
  }

  function destroy() {
    if (state.destroyed) {
      return true;
    }

    state.destroyed = true;
    state.initialized = false;

    if (state.resizeFrame) {
      cancelAnimationFrame(state.resizeFrame);
      state.resizeFrame = 0;
    }

    if (state.onResize) {
      globalThis.removeEventListener("resize", state.onResize);
    }

    if (state.onCorrespondence) {
      globalThis.removeEventListener("LAWS_EXPERIENCE_CORRESPONDENCE", state.onCorrespondence);
    }

    state.mutationObserver?.disconnect();
    state.layer?.remove();
    publish({ lastAction: "destroy" });
    return true;
  }

  function initialize() {
    try {
      createLayer();
      state.direction = normalizeDirection(document.documentElement.dataset.lawsExperienceDirection);
      state.onResize = scheduleResize;
      globalThis.addEventListener("resize", state.onResize, { passive: true });
      observeDirection();
      resize();
      state.initialized = true;
      publish({ lastAction: "initialize" });
    } catch (error) {
      state.failed = true;
      publish({
        lastAction: "failure",
        lastFailure: error instanceof Error ? error.message : String(error)
      });
    }
  }

  const api = Object.freeze({
    contract: CONTRACT,
    initialized: true,
    resize,
    setDirection,
    receipt: () => publish(),
    destroy,
    navigationAuthority: false,
    controllerAuthority: false,
    routeAuthority: false,
    evidenceAuthority: false,
    recordAuthority: false,
    claimAuthority: false
  });

  globalThis[GLOBAL_KEY] = api;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();

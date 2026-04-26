(function () {
  "use strict";

  var RUNTIME_NAME = "DGBCosmicBackgroundRuntime";
  var VERSION = "near-solar-background-runtime-b1";
  var ROOT_BOOT_ID = "root-sun-asset-b1";
  var CANOPY_VERSION = "spine-canopy-parachute-b1";
  var CANVAS_ID = "dgb-cosmic-background-canvas";
  var STYLE_ID = "dgb-cosmic-background-runtime-style";

  var state = {
    version: VERSION,
    rootBootId: ROOT_BOOT_ID,
    canopyVersion: CANOPY_VERSION,
    loaded: false,
    mounted: false,
    running: false,
    reducedMotion: false,
    frameCount: 0,
    width: 0,
    height: 0,
    pixelRatio: 1,
    lastFrameAt: 0,
    warnings: []
  };

  var canvas = null;
  var context = null;
  var sky = null;
  var animationFrame = 0;
  var stars = [];
  var dust = [];
  var nebula = [];
  var lane = [];
  var seed = 781256;

  function now() {
    return new Date().toISOString();
  }

  function warn(code, message, payload) {
    var warning = {
      code: String(code || "COSMIC_BACKGROUND_WARNING"),
      message: String(message || ""),
      payload: payload || {},
      time: now()
    };

    state.warnings.push(warning);
    while (state.warnings.length > 24) state.warnings.shift();

    if (window.DGBSpineCanopy && typeof window.DGBSpineCanopy.addWarning === "function") {
      window.DGBSpineCanopy.addWarning(code, message, payload || {});
    }

    return warning;
  }

  function record(type, payload) {
    if (window.DGBSpineCanopy && typeof window.DGBSpineCanopy.record === "function") {
      window.DGBSpineCanopy.record(type, Object.assign({
        runtime: RUNTIME_NAME,
        version: VERSION
      }, payload || {}));
    }
  }

  function registerWithCanopy() {
    if (!window.DGBSpineCanopy) return;

    if (typeof window.DGBSpineCanopy.registerSource === "function") {
      window.DGBSpineCanopy.registerSource("cosmicBackgroundRuntime", {
        path: "/runtime/cosmic_background_runtime.js",
        version: VERSION,
        role: "near-solar-background-enhancement",
        owner: "/index.html",
        protectedFrom: "sun-asset-spine"
      });
    }

    if (typeof window.DGBSpineCanopy.registerVisual === "function") {
      window.DGBSpineCanopy.registerVisual("cosmicBackground", {
        runtime: RUNTIME_NAME,
        version: VERSION,
        mounted: state.mounted,
        running: state.running,
        owner: "/runtime/cosmic_background_runtime.js",
        backgroundOnly: true,
        sunMutationAllowed: false
      });
    }
  }

  function random() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  }

  function between(min, max) {
    return min + (max - min) * random();
  }

  function getSky() {
    return document.querySelector(".universe-sky");
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent =
      ".universe-sky{isolation:isolate;}" +
      ".universe-sky>#" + CANVAS_ID + "{" +
      "position:absolute;" +
      "inset:0;" +
      "z-index:0;" +
      "width:100%;" +
      "height:100%;" +
      "pointer-events:none;" +
      "opacity:.58;" +
      "mix-blend-mode:screen;" +
      "}" +
      ".universe-sky>:not(#" + CANVAS_ID + "){" +
      "z-index:1;" +
      "}" +
      "@media (prefers-reduced-motion: reduce){" +
      ".universe-sky>#" + CANVAS_ID + "{opacity:.46;}" +
      "}";

    document.head.appendChild(style);
  }

  function createCanvas() {
    sky = getSky();

    if (!sky) {
      warn("COSMIC_BACKGROUND_SKY_MISSING", "The .universe-sky host was not found.", {
        version: VERSION
      });
      return false;
    }

    canvas = document.getElementById(CANVAS_ID);

    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = CANVAS_ID;
      canvas.setAttribute("aria-hidden", "true");
      canvas.setAttribute("data-cosmic-background-runtime", VERSION);
      canvas.setAttribute("data-background-owner", "/runtime/cosmic_background_runtime.js");
      sky.insertBefore(canvas, sky.firstChild || null);
    }

    context = canvas.getContext("2d", { alpha: true });

    if (!context) {
      warn("COSMIC_BACKGROUND_CONTEXT_MISSING", "Canvas 2D context was not available.", {
        version: VERSION
      });
      return false;
    }

    state.mounted = true;
    record("COSMIC_BACKGROUND_CANVAS_MOUNTED", {
      canvasId: CANVAS_ID,
      version: VERSION
    });

    return true;
  }

  function buildField() {
    var i;

    stars = [];
    dust = [];
    nebula = [];
    lane = [];

    for (i = 0; i < 72; i += 1) {
      stars.push({
        x: random(),
        y: random(),
        r: between(0.35, 1.25),
        a: between(0.10, 0.56),
        warmth: random(),
        drift: between(0.02, 0.12)
      });
    }

    for (i = 0; i < 46; i += 1) {
      dust.push({
        x: random(),
        y: random(),
        r: between(0.25, 0.95),
        a: between(0.035, 0.18),
        drift: between(0.03, 0.16)
      });
    }

    nebula = [
      { x: 0.14, y: 0.22, rx: 0.34, ry: 0.22, a: 0.17, hue: "blue", drift: 0.08 },
      { x: 0.78, y: 0.20, rx: 0.30, ry: 0.20, a: 0.12, hue: "violet", drift: -0.05 },
      { x: 0.45, y: 0.84, rx: 0.42, ry: 0.22, a: 0.10, hue: "cyan", drift: 0.06 },
      { x: 0.54, y: 0.46, rx: 0.38, ry: 0.24, a: 0.07, hue: "gold", drift: -0.03 }
    ];

    for (i = 0; i < 130; i += 1) {
      lane.push({
        t: random(),
        offset: between(-0.11, 0.11),
        r: between(0.35, 1.35),
        a: between(0.025, 0.15),
        warmth: random()
      });
    }
  }

  function resize() {
    var rect;
    var ratio;

    if (!canvas || !sky) return;

    rect = sky.getBoundingClientRect();
    ratio = Math.min(window.devicePixelRatio || 1, 1.5);

    state.width = Math.max(1, Math.round(rect.width));
    state.height = Math.max(1, Math.round(rect.height));
    state.pixelRatio = ratio;

    canvas.width = Math.round(state.width * ratio);
    canvas.height = Math.round(state.height * ratio);
    canvas.style.width = state.width + "px";
    canvas.style.height = state.height + "px";

    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function clear() {
    context.clearRect(0, 0, state.width, state.height);
  }

  function colorForNebula(hue, alpha) {
    if (hue === "blue") return "rgba(92,124,255," + alpha + ")";
    if (hue === "violet") return "rgba(190,96,255," + alpha + ")";
    if (hue === "cyan") return "rgba(52,178,214," + alpha + ")";
    return "rgba(255,213,138," + alpha + ")";
  }

  function drawNebula(time) {
    nebula.forEach(function (blob) {
      var pulse = Math.sin(time * 0.00008 + blob.x * 9) * 0.018;
      var x = (blob.x + Math.sin(time * 0.000018 + blob.drift) * 0.012) * state.width;
      var y = (blob.y + Math.cos(time * 0.000015 + blob.drift) * 0.010) * state.height;
      var rx = blob.rx * state.width;
      var gradient = context.createRadialGradient(x, y, 0, x, y, rx);

      gradient.addColorStop(0, colorForNebula(blob.hue, Math.max(0, blob.a + pulse)));
      gradient.addColorStop(0.44, colorForNebula(blob.hue, Math.max(0, (blob.a + pulse) * 0.34)));
      gradient.addColorStop(1, "rgba(0,0,0,0)");

      context.save();
      context.globalCompositeOperation = "screen";
      context.scale(1, blob.ry / blob.rx);
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(x, y / (blob.ry / blob.rx), rx, 0, Math.PI * 2);
      context.fill();
      context.restore();
    });
  }

  function drawMilkyWay(time) {
    var cx = state.width * 0.50;
    var cy = state.height * 0.52;
    var angle = -0.54;
    var length = Math.max(state.width, state.height) * 1.62;
    var width = Math.min(state.width, state.height) * 0.24;
    var i;

    context.save();
    context.translate(cx, cy);
    context.rotate(angle);
    context.globalCompositeOperation = "screen";

    var band = context.createLinearGradient(-length / 2, 0, length / 2, 0);
    band.addColorStop(0, "rgba(255,255,255,0)");
    band.addColorStop(0.28, "rgba(255,255,255,0.018)");
    band.addColorStop(0.45, "rgba(142,176,255,0.040)");
    band.addColorStop(0.52, "rgba(255,228,184,0.030)");
    band.addColorStop(0.62, "rgba(132,166,255,0.035)");
    band.addColorStop(0.76, "rgba(255,255,255,0.014)");
    band.addColorStop(1, "rgba(255,255,255,0)");

    context.fillStyle = band;
    context.beginPath();
    context.ellipse(0, 0, length / 2, width / 2, 0, 0, Math.PI * 2);
    context.fill();

    for (i = 0; i < lane.length; i += 1) {
      var p = lane[i];
      var wave = Math.sin(time * 0.00006 + p.t * 12) * 0.014;
      var px = (p.t - 0.5) * length;
      var py = (p.offset + wave) * width;
      var alpha = p.a * (p.warmth > 0.66 ? 0.75 : 1);
      context.fillStyle = p.warmth > 0.68
        ? "rgba(255,226,175," + alpha + ")"
        : "rgba(184,207,255," + alpha + ")";
      context.beginPath();
      context.arc(px, py, p.r, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  function drawStars(time) {
    var i;

    context.save();
    context.globalCompositeOperation = "screen";

    for (i = 0; i < stars.length; i += 1) {
      var s = stars[i];
      var twinkle = 0.72 + Math.sin(time * 0.0012 * s.drift + i) * 0.28;
      var x = ((s.x + Math.sin(time * 0.000006 * s.drift) * 0.006) % 1) * state.width;
      var y = ((s.y + Math.cos(time * 0.000005 * s.drift) * 0.005) % 1) * state.height;

      context.fillStyle = s.warmth > 0.76
        ? "rgba(255,228,180," + (s.a * twinkle) + ")"
        : "rgba(220,232,255," + (s.a * twinkle) + ")";
      context.beginPath();
      context.arc(x, y, s.r, 0, Math.PI * 2);
      context.fill();
    }

    for (i = 0; i < dust.length; i += 1) {
      var d = dust[i];
      var dx = ((d.x + Math.sin(time * 0.00001 * d.drift) * 0.012) % 1) * state.width;
      var dy = ((d.y + Math.cos(time * 0.000007 * d.drift) * 0.010) % 1) * state.height;

      context.fillStyle = "rgba(210,226,255," + d.a + ")";
      context.beginPath();
      context.arc(dx, dy, d.r, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  function drawSolarWind(time) {
    var gradient;
    var shear = Math.sin(time * 0.000028) * state.width * 0.025;

    context.save();
    context.globalCompositeOperation = "screen";
    context.translate(state.width * 0.5 + shear, state.height * 0.51);
    context.rotate(-0.19);

    gradient = context.createLinearGradient(-state.width * 0.7, 0, state.width * 0.7, 0);
    gradient.addColorStop(0, "rgba(255,255,255,0)");
    gradient.addColorStop(0.26, "rgba(255,255,255,0.014)");
    gradient.addColorStop(0.42, "rgba(130,166,255,0.024)");
    gradient.addColorStop(0.60, "rgba(255,208,134,0.016)");
    gradient.addColorStop(0.82, "rgba(255,255,255,0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.ellipse(0, 0, state.width * 0.92, state.height * 0.13, 0, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  function drawFrame(time) {
    if (!context || !canvas) return;

    clear();
    drawNebula(time || 0);
    drawMilkyWay(time || 0);
    drawSolarWind(time || 0);
    drawStars(time || 0);

    state.frameCount += 1;
    state.lastFrameAt = time || 0;
  }

  function loop(time) {
    if (!state.running) return;

    if (!state.lastFrameAt || time - state.lastFrameAt >= 83) {
      drawFrame(time);
    }

    animationFrame = window.requestAnimationFrame(loop);
  }

  function start() {
    if (!canvas || !context) return false;

    state.reducedMotion = Boolean(
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );

    state.running = true;
    drawFrame(0);

    if (!state.reducedMotion) {
      animationFrame = window.requestAnimationFrame(loop);
    }

    registerWithCanopy();

    record("COSMIC_BACKGROUND_RUNTIME_STARTED", {
      version: VERSION,
      reducedMotion: state.reducedMotion,
      backgroundOnly: true,
      sunMutationAllowed: false
    });

    return true;
  }

  function stop() {
    state.running = false;

    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }

    record("COSMIC_BACKGROUND_RUNTIME_STOPPED", {
      version: VERSION
    });
  }

  function boot() {
    state.loaded = true;
    injectStyle();

    if (!createCanvas()) return;

    buildField();
    resize();
    start();

    window.addEventListener("resize", function () {
      resize();
      drawFrame(performance.now ? performance.now() : Date.now());
    }, { passive: true });

    window.setTimeout(registerWithCanopy, 400);
    window.setTimeout(registerWithCanopy, 1400);
  }

  function getPublicState() {
    return {
      runtime: RUNTIME_NAME,
      version: VERSION,
      rootBootId: ROOT_BOOT_ID,
      canopyVersion: CANOPY_VERSION,
      loaded: state.loaded,
      mounted: state.mounted,
      running: state.running,
      reducedMotion: state.reducedMotion,
      frameCount: state.frameCount,
      width: state.width,
      height: state.height,
      pixelRatio: state.pixelRatio,
      backgroundOnly: true,
      sunMutationAllowed: false,
      warnings: state.warnings.slice()
    };
  }

  window[RUNTIME_NAME] = Object.freeze({
    name: RUNTIME_NAME,
    version: VERSION,
    rootBootId: ROOT_BOOT_ID,
    start: start,
    stop: stop,
    resize: resize,
    getPublicState: getPublicState
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();

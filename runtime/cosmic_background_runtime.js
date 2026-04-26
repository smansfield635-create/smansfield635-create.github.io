(function () {
  "use strict";

  var RUNTIME_NAME = "DGBCosmicControlRuntime";
  var VERSION = "cosmic-control-plane-b1";
  var ROOT_BOOT_ID = "root-sun-asset-b1";
  var CANOPY_VERSION = "spine-canopy-parachute-b1";
  var CANVAS_ID = "dgb-cosmic-control-canvas";
  var STYLE_ID = "dgb-cosmic-control-runtime-style";

  var VIEWS = ["cinematic", "wide", "axis", "paths", "galaxy", "control"];

  var bodies = [
    { id: "mercury", label: "Mercury", orbitX: 0.16, orbitY: 0.065, radius: 1.6, speed: 0.018, phase: 0.20, depth: 0.82, alpha: 0.42 },
    { id: "venus", label: "Venus", orbitX: 0.22, orbitY: 0.090, radius: 2.0, speed: 0.014, phase: 1.10, depth: 0.72, alpha: 0.44 },
    { id: "earth", label: "Earth", orbitX: 0.29, orbitY: 0.118, radius: 2.1, speed: 0.011, phase: 2.10, depth: 0.66, alpha: 0.46 },
    { id: "mars", label: "Mars", orbitX: 0.37, orbitY: 0.151, radius: 1.8, speed: 0.009, phase: 2.90, depth: 0.58, alpha: 0.40 },
    { id: "jupiter", label: "Jupiter", orbitX: 0.54, orbitY: 0.220, radius: 3.4, speed: 0.005, phase: 3.80, depth: 0.45, alpha: 0.34 },
    { id: "saturn", label: "Saturn", orbitX: 0.66, orbitY: 0.270, radius: 3.0, speed: 0.004, phase: 4.55, depth: 0.36, alpha: 0.31 },
    { id: "uranus", label: "Uranus", orbitX: 0.78, orbitY: 0.315, radius: 2.3, speed: 0.003, phase: 5.20, depth: 0.27, alpha: 0.26 },
    { id: "neptune", label: "Neptune", orbitX: 0.88, orbitY: 0.355, radius: 2.2, speed: 0.0024, phase: 5.85, depth: 0.22, alpha: 0.24 }
  ];

  var state = {
    version: VERSION,
    rootBootId: ROOT_BOOT_ID,
    canopyVersion: CANOPY_VERSION,
    loaded: false,
    mounted: false,
    running: false,
    reducedMotion: false,
    view: "cinematic",
    frameCount: 0,
    width: 0,
    height: 0,
    pixelRatio: 1,
    toggles: {
      planets: true,
      paths: false,
      axes: false,
      nebula: true,
      milkyWay: true,
      solarWind: true,
      scale: true
    },
    warnings: []
  };

  var canvas = null;
  var context = null;
  var sky = null;
  var animationFrame = 0;
  var lastDrawAt = 0;

  function now() {
    return new Date().toISOString();
  }

  function warn(code, message, payload) {
    var warning = {
      code: String(code || "COSMIC_CONTROL_WARNING"),
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
      window.DGBSpineCanopy.registerSource("cosmicControlRuntime", {
        path: "/runtime/cosmic_control_runtime.js",
        version: VERSION,
        role: "euclidean-view-control-plane",
        owner: "/index.html",
        backgroundOnly: true,
        sunMutationAllowed: false
      });
    }

    if (typeof window.DGBSpineCanopy.registerVisual === "function") {
      window.DGBSpineCanopy.registerVisual("cosmicControl", {
        runtime: RUNTIME_NAME,
        version: VERSION,
        mounted: state.mounted,
        running: state.running,
        view: state.view,
        bodies: bodies.length,
        backgroundOnly: true,
        sunMutationAllowed: false
      });
    }
  }

  function query(selector, root) {
    return (root || document).querySelector(selector);
  }

  function queryAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent =
      ".universe-sky>#" + CANVAS_ID + "{" +
      "position:absolute;" +
      "inset:0;" +
      "z-index:2;" +
      "width:100%;" +
      "height:100%;" +
      "pointer-events:none;" +
      "opacity:.48;" +
      "mix-blend-mode:screen;" +
      "}" +
      "html[data-cosmic-nebula='off'] .nebula-plane{opacity:0!important;}" +
      "html[data-cosmic-milky-way='off'] .milky-way-plane{opacity:0!important;}" +
      "html[data-cosmic-solar-wind='off'] .solar-pressure-haze," +
      "html[data-cosmic-solar-wind='off'] .solar-wind-sheer{opacity:0!important;}" +
      "html[data-cosmic-planets='off'] .planet-depth{opacity:0!important;}" +
      ".cosmic-control-panel button[data-active='true']{" +
      "border-color:rgba(255,217,138,.56)!important;" +
      "color:#fff8e7!important;" +
      "box-shadow:0 0 22px rgba(255,217,138,.12)!important;" +
      "background:rgba(255,217,138,.105)!important;" +
      "}" +
      ".cosmic-control-panel button[aria-pressed='true']{" +
      "border-color:rgba(128,240,182,.42)!important;" +
      "}" +
      "@media (prefers-reduced-motion: reduce){" +
      ".universe-sky>#" + CANVAS_ID + "{opacity:.36;}" +
      "}";

    document.head.appendChild(style);
  }

  function getSky() {
    return document.querySelector(".universe-sky");
  }

  function createCanvas() {
    sky = getSky();

    if (!sky) {
      warn("COSMIC_CONTROL_SKY_MISSING", "The .universe-sky host was not found.", {
        version: VERSION
      });
      return false;
    }

    canvas = document.getElementById(CANVAS_ID);

    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = CANVAS_ID;
      canvas.setAttribute("aria-hidden", "true");
      canvas.setAttribute("data-cosmic-control-runtime", VERSION);
      canvas.setAttribute("data-control-plane", "euclidean");
      sky.appendChild(canvas);
    }

    context = canvas.getContext("2d", { alpha: true });

    if (!context) {
      warn("COSMIC_CONTROL_CONTEXT_MISSING", "Canvas 2D context was not available.", {
        version: VERSION
      });
      return false;
    }

    state.mounted = true;
    record("COSMIC_CONTROL_CANVAS_MOUNTED", {
      canvasId: CANVAS_ID,
      version: VERSION
    });

    return true;
  }

  function resize() {
    var rect;
    var ratio;

    if (!canvas || !sky || !context) return;

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

  function getSunCenter() {
    var mount = document.querySelector("[data-dgb-sun-mount]");
    var skyRect = sky ? sky.getBoundingClientRect() : { left: 0, top: 0 };
    var rect;

    if (!mount || typeof mount.getBoundingClientRect !== "function") {
      return {
        x: state.width * 0.58,
        y: state.height * 0.50
      };
    }

    rect = mount.getBoundingClientRect();

    return {
      x: rect.left - skyRect.left + rect.width / 2,
      y: rect.top - skyRect.top + rect.height / 2
    };
  }

  function getCamera() {
    if (state.view === "wide") {
      return { zoom: 0.72, axis: false, paths: true, labels: true, alpha: 0.54 };
    }

    if (state.view === "axis") {
      return { zoom: 0.92, axis: true, paths: true, labels: true, alpha: 0.66 };
    }

    if (state.view === "paths") {
      return { zoom: 0.86, axis: false, paths: true, labels: true, alpha: 0.62 };
    }

    if (state.view === "galaxy") {
      return { zoom: 0.78, axis: false, paths: false, labels: false, alpha: 0.28 };
    }

    if (state.view === "control") {
      return { zoom: 0.88, axis: true, paths: true, labels: true, alpha: 0.72 };
    }

    return { zoom: 1.0, axis: false, paths: false, labels: false, alpha: 0.30 };
  }

  function clear() {
    if (!context) return;
    context.clearRect(0, 0, state.width, state.height);
  }

  function drawAxes(center, camera) {
    if (!state.toggles.axes && !camera.axis) return;

    context.save();
    context.globalCompositeOperation = "screen";
    context.strokeStyle = "rgba(255,248,231,0.12)";
    context.lineWidth = 1;

    context.beginPath();
    context.moveTo(0, center.y);
    context.lineTo(state.width, center.y);
    context.moveTo(center.x, 0);
    context.lineTo(center.x, state.height);
    context.stroke();

    context.fillStyle = "rgba(255,248,231,0.42)";
    context.font = "10px system-ui, sans-serif";
    context.fillText("X-axis", Math.min(state.width - 54, center.x + 14), center.y - 10);
    context.fillText("Y-axis", center.x + 12, Math.max(18, center.y - 72));

    context.restore();
  }

  function drawScale(center) {
    if (!state.toggles.scale) return;

    context.save();
    context.globalCompositeOperation = "screen";
    context.strokeStyle = "rgba(255,217,138,0.10)";
    context.fillStyle = "rgba(255,248,231,0.32)";
    context.lineWidth = 1;
    context.font = "10px system-ui, sans-serif";

    context.beginPath();
    context.moveTo(center.x - 72, center.y + 96);
    context.lineTo(center.x + 72, center.y + 96);
    context.stroke();

    context.fillText("Euclidean field axis", center.x - 54, center.y + 112);
    context.restore();
  }

  function drawOrbit(center, body, camera) {
    var base = Math.min(state.width, state.height);
    var rx = base * body.orbitX * camera.zoom;
    var ry = base * body.orbitY * camera.zoom;

    context.save();
    context.globalCompositeOperation = "screen";
    context.strokeStyle = "rgba(175,204,255," + (0.052 + body.depth * 0.03) + ")";
    context.lineWidth = 1;

    context.beginPath();
    context.ellipse(center.x, center.y, rx, ry, -0.18, 0, Math.PI * 2);
    context.stroke();

    context.restore();
  }

  function getBodyPosition(center, body, camera, time) {
    var base = Math.min(state.width, state.height);
    var angle = body.phase + time * body.speed;
    var rx = base * body.orbitX * camera.zoom;
    var ry = base * body.orbitY * camera.zoom;
    var tilt = -0.18;
    var localX = Math.cos(angle) * rx;
    var localY = Math.sin(angle) * ry;
    var cos = Math.cos(tilt);
    var sin = Math.sin(tilt);

    return {
      x: center.x + localX * cos - localY * sin,
      y: center.y + localX * sin + localY * cos,
      angle: angle
    };
  }

  function drawBody(center, body, camera, time) {
    var position = getBodyPosition(center, body, camera, time);
    var radius = body.radius * (state.view === "wide" ? 0.85 : 1);
    var alpha = body.alpha * camera.alpha;

    context.save();
    context.globalCompositeOperation = "screen";

    context.fillStyle = "rgba(180,207,255," + alpha + ")";
    context.beginPath();
    context.arc(position.x, position.y, radius, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "rgba(255,231,184," + (alpha * 0.54) + ")";
    context.beginPath();
    context.arc(position.x - radius * 0.28, position.y - radius * 0.26, Math.max(0.65, radius * 0.34), 0, Math.PI * 2);
    context.fill();

    if (camera.labels) {
      context.fillStyle = "rgba(255,248,231," + Math.min(0.62, alpha + 0.18) + ")";
      context.font = "10px system-ui, sans-serif";
      context.fillText(body.label, position.x + radius + 5, position.y + 3);
    }

    context.restore();
  }

  function drawFrame(time) {
    var camera;
    var center;
    var t;

    if (!context || !canvas) return;

    clear();

    camera = getCamera();
    center = getSunCenter();
    t = (time || 0) / 1000;

    drawAxes(center, camera);

    if (state.toggles.paths || camera.paths) {
      bodies.forEach(function (body) {
        drawOrbit(center, body, camera);
      });
    }

    if (state.toggles.planets) {
      bodies.forEach(function (body) {
        drawBody(center, body, camera, t);
      });
    }

    drawScale(center);

    state.frameCount += 1;
    lastDrawAt = time || 0;
  }

  function loop(time) {
    if (!state.running) return;

    if (!lastDrawAt || time - lastDrawAt >= 83) {
      drawFrame(time);
    }

    animationFrame = window.requestAnimationFrame(loop);
  }

  function applyAttributes() {
    document.documentElement.setAttribute("data-cosmic-view", state.view);
    document.documentElement.setAttribute("data-cosmic-planets", state.toggles.planets ? "on" : "off");
    document.documentElement.setAttribute("data-cosmic-paths", state.toggles.paths ? "on" : "off");
    document.documentElement.setAttribute("data-cosmic-axes", state.toggles.axes ? "on" : "off");
    document.documentElement.setAttribute("data-cosmic-nebula", state.toggles.nebula ? "on" : "off");
    document.documentElement.setAttribute("data-cosmic-milky-way", state.toggles.milkyWay ? "on" : "off");
    document.documentElement.setAttribute("data-cosmic-solar-wind", state.toggles.solarWind ? "on" : "off");
    document.documentElement.setAttribute("data-cosmic-scale", state.toggles.scale ? "on" : "off");
  }

  function renderControls() {
    queryAll("[data-cosmic-view-button]").forEach(function (button) {
      var active = button.getAttribute("data-cosmic-view-button") === state.view;
      button.setAttribute("data-active", active ? "true" : "false");
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });

    queryAll("[data-cosmic-toggle]").forEach(function (button) {
      var key = button.getAttribute("data-cosmic-toggle");
      var active = Boolean(state.toggles[key]);
      button.setAttribute("aria-pressed", active ? "true" : "false");
      button.setAttribute("data-active", active ? "true" : "false");
    });

    queryAll("[data-cosmic-control-view]").forEach(function (node) {
      node.textContent = state.view;
    });

    queryAll("[data-cosmic-control-status]").forEach(function (node) {
      node.textContent = "Cosmic Control Plane B1 · " + state.view + " view · Euclidean paths bound";
    });
  }

  function setView(view) {
    if (VIEWS.indexOf(view) === -1) view = "cinematic";

    state.view = view;

    if (view === "axis") {
      state.toggles.axes = true;
      state.toggles.paths = true;
    }

    if (view === "paths") {
      state.toggles.paths = true;
    }

    if (view === "control") {
      state.toggles.axes = true;
      state.toggles.paths = true;
      state.toggles.planets = true;
    }

    if (view === "galaxy") {
      state.toggles.nebula = true;
      state.toggles.milkyWay = true;
    }

    applyAttributes();
    renderControls();
    drawFrame(performance.now ? performance.now() : Date.now());

    record("COSMIC_CONTROL_VIEW_SET", {
      view: state.view,
      version: VERSION
    });

    registerWithCanopy();

    return state.view;
  }

  function toggle(key) {
    if (!Object.prototype.hasOwnProperty.call(state.toggles, key)) return false;

    state.toggles[key] = !state.toggles[key];

    applyAttributes();
    renderControls();
    drawFrame(performance.now ? performance.now() : Date.now());

    record("COSMIC_CONTROL_TOGGLE_SET", {
      key: key,
      value: state.toggles[key],
      version: VERSION
    });

    registerWithCanopy();

    return state.toggles[key];
  }

  function bindControls() {
    queryAll("[data-cosmic-view-button]").forEach(function (button) {
      button.addEventListener("click", function () {
        setView(button.getAttribute("data-cosmic-view-button"));
      });
    });

    queryAll("[data-cosmic-toggle]").forEach(function (button) {
      button.addEventListener("click", function () {
        toggle(button.getAttribute("data-cosmic-toggle"));
      });
    });
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

    record("COSMIC_CONTROL_RUNTIME_STARTED", {
      version: VERSION,
      view: state.view,
      bodies: bodies.length,
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

    record("COSMIC_CONTROL_RUNTIME_STOPPED", {
      version: VERSION
    });
  }

  function boot() {
    state.loaded = true;

    injectStyle();
    applyAttributes();

    if (!createCanvas()) return;

    resize();
    bindControls();
    renderControls();
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
      view: state.view,
      frameCount: state.frameCount,
      width: state.width,
      height: state.height,
      pixelRatio: state.pixelRatio,
      bodies: bodies.map(function (body) {
        return {
          id: body.id,
          label: body.label,
          orbitX: body.orbitX,
          orbitY: body.orbitY,
          radius: body.radius,
          speed: body.speed,
          phase: body.phase,
          depth: body.depth,
          alpha: body.alpha
        };
      }),
      toggles: Object.assign({}, state.toggles),
      backgroundOnly: true,
      sunMutationAllowed: false,
      warnings: state.warnings.slice()
    };
  }

  window[RUNTIME_NAME] = Object.freeze({
    name: RUNTIME_NAME,
    version: VERSION,
    rootBootId: ROOT_BOOT_ID,
    setView: setView,
    toggle: toggle,
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

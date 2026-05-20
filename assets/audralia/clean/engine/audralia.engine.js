// /assets/audralia/clean/audralia.engine.js
// AUDRALIA_G2_5_PARENT_CONTRACT_ALIGNMENT_TNT_v1
// Full-file replacement.
// Purpose: align the Audralia clean-canvas parent engine contract to the current three-child architecture.
// Parent owns: mount, composition surface, child dependency loading, bridge compatibility, receipt/status publication.
// Children own:
//   /assets/audralia/clean/engine/continents.js — continent law, sea-level exposure, shelves, terrain pressure, Nine-Summits pressure.
//   /assets/audralia/clean/engine/motion.js     — axis tilt, rotation, drag, pitch bounds, redraw triggers.
//   /assets/audralia/clean/engine/sky.js        — rim glow, haze, clouds/weather, lighting tint.
// Does not own: parent Globe route, Audralia HTML, Audralia route bridge JS, Characters, Gauges, Showroom, generated image, GraphicBox, or visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_5_PARENT_CONTRACT_ALIGNMENT_TNT_v1";
  const FAMILY = "AUDRALIA_G2_5_SIMPLE_ENGINE_CHILD_SPLIT_TNT_v1";
  const ROUTE = "/showroom/globe/audralia/";
  const TARGET = "/assets/audralia/clean/audralia.engine.js";

  const CHILDREN = Object.freeze({
    continents: {
      path: "/assets/audralia/clean/engine/continents.js",
      owns: "five-continent law, four main continents, one North Polar continent, South Pole ice-only rule, non-blob shaping, sea-level exposure, shelves, terrain pressure, Nine-Summits pressure",
      globals: [
        "AUDRALIA_CLEAN_CONTINENTS_ENGINE",
        "AUDRALIA_CONTINENTS_ENGINE",
        "AUDRALIA_CLEAN_CANVAS_CONTINENTS",
        "AudraliaContinentsEngine",
        "AudraliaContinents",
        "audraliaContinents"
      ]
    },
    motion: {
      path: "/assets/audralia/clean/engine/motion.js",
      owns: "Earth-like axis tilt, longitude rotation, auto rotation, finger drag, pitch bounds, redraw triggers",
      globals: [
        "AUDRALIA_CLEAN_MOTION_ENGINE",
        "AUDRALIA_MOTION_ENGINE",
        "AUDRALIA_CLEAN_CANVAS_MOTION",
        "AudraliaMotionEngine",
        "AudraliaMotion",
        "audraliaMotion"
      ]
    },
    sky: {
      path: "/assets/audralia/clean/engine/sky.js",
      owns: "rim glow, haze, clouds/weather, lighting tint, future weather inheritance toward H-Earth",
      globals: [
        "AUDRALIA_CLEAN_SKY_ENGINE",
        "AUDRALIA_SKY_ENGINE",
        "AUDRALIA_CLEAN_CANVAS_SKY",
        "AudraliaSkyEngine",
        "AudraliaSky",
        "audraliaSky"
      ]
    }
  });

  const RECEIPT = Object.freeze({
    contract: CONTRACT,
    family: FAMILY,
    target: TARGET,
    route: ROUTE,
    mode: "parent_contract_alignment_only",
    childContractRenewal: false,
    htmlChange: false,
    routeBridgeChange: false,
    visualPassClaim: false,
    generatedImage: false,
    graphicBox: false,
    preserves: [
      "AUDRALIA_ENGINE",
      "AUDRALIA_CLEAN_CANVAS_ENGINE",
      "AUDRALIA_CLEAN_CANVAS_AUTHORITY",
      "mount()",
      "render()",
      "start()",
      "boot()",
      "init()",
      "create()",
      "FORM_VISIBLE route-bridge compatibility"
    ],
    children: CHILDREN
  });

  const state = {
    contract: CONTRACT,
    family: FAMILY,
    mounted: false,
    ready: false,
    formVisible: false,
    renderRequested: true,
    frame: 0,
    time: 0,
    rotation: 0,
    pitch: 0,
    axisTilt: (23.44 * Math.PI) / 180,
    dragActive: false,
    errors: [],
    children: {
      continents: "pending",
      motion: "pending",
      sky: "pending"
    }
  };

  const env = {
    mount: null,
    canvas: null,
    ctx: null,
    dpr: 1,
    width: 0,
    height: 0,
    radius: 0,
    cx: 0,
    cy: 0,
    raf: 0,
    bootPromise: null,
    childEngines: {
      continents: null,
      motion: null,
      sky: null
    }
  };

  function isElement(value) {
    return Boolean(value && value.nodeType === 1);
  }

  function resolveMount(input) {
    if (isElement(input)) return input;

    if (typeof input === "string") {
      return document.querySelector(input);
    }

    if (input && isElement(input.mount)) return input.mount;
    if (input && isElement(input.element)) return input.element;
    if (input && isElement(input.el)) return input.el;

    if (input && typeof input.mount === "string") {
      return document.querySelector(input.mount);
    }

    if (input && typeof input.selector === "string") {
      return document.querySelector(input.selector);
    }

    return (
      document.querySelector("#audraliaCanvasMount") ||
      document.querySelector("[data-audralia-canvas-mount]") ||
      document.querySelector("[data-audralia-clean-canvas-mount]") ||
      document.querySelector("#audraliaMount") ||
      document.body
    );
  }

  function ensureCanvas(mount, options = {}) {
    let canvas = null;

    if (options.canvas && isElement(options.canvas)) {
      canvas = options.canvas;
    } else {
      canvas =
        mount.querySelector("canvas[data-audralia-clean-canvas='true']") ||
        mount.querySelector("canvas");
    }

    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.setAttribute("data-audralia-clean-canvas", "true");
      canvas.setAttribute("data-contract", CONTRACT);
      canvas.setAttribute("aria-label", "Audralia clean canvas planet form");
      canvas.style.display = "block";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.minHeight = "320px";
      canvas.style.touchAction = "none";
      canvas.style.userSelect = "none";

      if (mount !== document.body) {
        mount.textContent = "";
      }

      mount.appendChild(canvas);
    }

    return canvas;
  }

  function resize() {
    if (!env.canvas || !env.mount) return;

    const rect = env.mount.getBoundingClientRect();
    const cssWidth = Math.max(320, Math.floor(rect.width || env.mount.clientWidth || 720));
    const cssHeight = Math.max(320, Math.floor(rect.height || env.mount.clientHeight || 520));
    const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));

    env.dpr = dpr;
    env.width = Math.floor(cssWidth * dpr);
    env.height = Math.floor(cssHeight * dpr);
    env.cx = env.width / 2;
    env.cy = env.height / 2;
    env.radius = Math.floor(Math.min(env.width, env.height) * 0.39);

    if (env.canvas.width !== env.width) env.canvas.width = env.width;
    if (env.canvas.height !== env.height) env.canvas.height = env.height;

    env.canvas.style.width = `${cssWidth}px`;
    env.canvas.style.height = `${cssHeight}px`;

    state.renderRequested = true;
  }

  function publishReceipt() {
    const payload = {
      ...RECEIPT,
      status: getStatus()
    };

    window.AUDRALIA_CLEAN_CANVAS_RECEIPT = payload;
    window.AUDRALIA_ENGINE_RECEIPT = payload;

    if (document.documentElement) {
      document.documentElement.setAttribute("data-audralia-engine-contract", CONTRACT);
      document.documentElement.setAttribute("data-audralia-engine-family", FAMILY);
      document.documentElement.setAttribute("data-audralia-parent-contract-aligned", "true");
    }

    try {
      window.dispatchEvent(
        new CustomEvent("audralia:engine:receipt", {
          detail: payload
        })
      );
    } catch (_error) {
      window.dispatchEvent(new Event("audralia:engine:receipt"));
    }
  }

  function publishFormVisible() {
    state.formVisible = true;
    window.AUDRALIA_FORM_VISIBLE = true;
    window.AUDRALIA_CLEAN_CANVAS_FORM_VISIBLE = true;

    if (env.mount) {
      env.mount.setAttribute("data-audralia-form-visible", "true");
      env.mount.setAttribute("data-audralia-engine-contract", CONTRACT);
    }

    if (document.documentElement) {
      document.documentElement.setAttribute("data-audralia-form-visible", "true");
    }
  }

  function recordError(scope, error) {
    const message = error && error.message ? error.message : String(error);
    state.errors.push({
      scope,
      message,
      time: new Date().toISOString()
    });
  }

  function scriptAlreadyLoaded(src) {
    return Array.from(document.scripts).some((script) => {
      const raw = script.getAttribute("src") || "";
      return raw === src || raw.endsWith(src);
    });
  }

  function loadScriptOnce(src) {
    return new Promise((resolve) => {
      if (scriptAlreadyLoaded(src)) {
        resolve({ src, loaded: true, reused: true });
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      script.defer = false;
      script.setAttribute("data-audralia-child-loader", CONTRACT);

      script.onload = () => resolve({ src, loaded: true, reused: false });
      script.onerror = () => resolve({ src, loaded: false, reused: false });

      document.head.appendChild(script);
    });
  }

  function readGlobal(keys) {
    for (const key of keys) {
      if (window[key]) return window[key];
    }
    return null;
  }

  function normalizeChild(name, raw) {
    if (!raw) return null;

    if (typeof raw === "function") {
      try {
        const created = raw(createChildPayload(name));
        return created || raw;
      } catch (_error) {
        return raw;
      }
    }

    return raw;
  }

  async function loadChildren() {
    const entries = Object.entries(CHILDREN);

    for (const [name, child] of entries) {
      state.children[name] = "loading";
      const result = await loadScriptOnce(child.path);

      if (!result.loaded) {
        state.children[name] = "missing";
        recordError(name, `Unable to load child file: ${child.path}`);
        continue;
      }

      const raw = readGlobal(child.globals);
      const normalized = normalizeChild(name, raw);

      if (!normalized) {
        state.children[name] = "loaded_no_global";
        recordError(name, `Child loaded but did not publish a recognized global: ${child.path}`);
        continue;
      }

      env.childEngines[name] = normalized;
      state.children[name] = "active";
    }
  }

  function invoke(engine, methodNames, payload) {
    if (!engine) return false;

    for (const methodName of methodNames) {
      const method = engine[methodName];

      if (typeof method !== "function") continue;

      try {
        if (method.length >= 2) {
          method.call(engine, payload.ctx, payload);
        } else {
          method.call(engine, payload);
        }
        return true;
      } catch (error) {
        recordError(methodName, error);
        return false;
      }
    }

    return false;
  }

  function initChildren() {
    const payload = createChildPayload("init");

    invoke(env.childEngines.continents, ["mount", "init", "setup", "boot", "create"], payload);
    invoke(env.childEngines.sky, ["mount", "init", "setup", "boot", "create"], payload);
    invoke(env.childEngines.motion, ["mount", "bind", "init", "setup", "boot", "create"], payload);
  }

  function createChildPayload(scope) {
    return {
      scope,
      contract: CONTRACT,
      family: FAMILY,
      receipt: RECEIPT,
      canvas: env.canvas,
      ctx: env.ctx,
      mount: env.mount,
      state,
      geometry: getGeometry(),
      project,
      requestRender,
      updateState,
      getStatus,
      api
    };
  }

  function getGeometry() {
    return {
      width: env.width,
      height: env.height,
      dpr: env.dpr,
      cx: env.cx,
      cy: env.cy,
      radius: env.radius,
      left: env.cx - env.radius,
      right: env.cx + env.radius,
      top: env.cy - env.radius,
      bottom: env.cy + env.radius
    };
  }

  function requestRender() {
    state.renderRequested = true;
  }

  function updateState(next = {}) {
    Object.assign(state, next);
    state.renderRequested = true;
  }

  function project(lon, lat, elevation = 0) {
    const lambda = typeof lon === "number" ? lon : 0;
    const phi = typeof lat === "number" ? lat : 0;
    const r = env.radius * (1 + elevation);

    const yaw = state.rotation || 0;
    const pitch = (state.pitch || 0) + (state.axisTilt || 0);

    const cosPhi = Math.cos(phi);
    let x = cosPhi * Math.sin(lambda + yaw);
    let y = Math.sin(phi);
    let z = cosPhi * Math.cos(lambda + yaw);

    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);

    const y2 = y * cp - z * sp;
    const z2 = y * sp + z * cp;

    return {
      x: env.cx + x * r,
      y: env.cy - y2 * r,
      z: z2,
      visible: z2 > -0.02,
      scale: Math.max(0, z2)
    };
  }

  function drawBasePlanet() {
    const ctx = env.ctx;
    const g = getGeometry();

    ctx.save();

    ctx.beginPath();
    ctx.arc(g.cx, g.cy, g.radius, 0, Math.PI * 2);
    ctx.clip();

    const ocean = ctx.createRadialGradient(
      g.cx - g.radius * 0.34,
      g.cy - g.radius * 0.42,
      g.radius * 0.1,
      g.cx,
      g.cy,
      g.radius
    );

    ocean.addColorStop(0, "rgba(104, 220, 255, 0.98)");
    ocean.addColorStop(0.24, "rgba(30, 143, 190, 0.98)");
    ocean.addColorStop(0.62, "rgba(13, 65, 114, 0.98)");
    ocean.addColorStop(1, "rgba(4, 14, 38, 1)");

    ctx.fillStyle = ocean;
    ctx.fillRect(g.left, g.top, g.radius * 2, g.radius * 2);

    const shade = ctx.createRadialGradient(
      g.cx - g.radius * 0.32,
      g.cy - g.radius * 0.34,
      g.radius * 0.2,
      g.cx + g.radius * 0.25,
      g.cy + g.radius * 0.16,
      g.radius * 1.18
    );

    shade.addColorStop(0, "rgba(255,255,255,0.16)");
    shade.addColorStop(0.54, "rgba(255,255,255,0.00)");
    shade.addColorStop(1, "rgba(0,0,0,0.48)");

    ctx.fillStyle = shade;
    ctx.fillRect(g.left, g.top, g.radius * 2, g.radius * 2);

    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(g.cx, g.cy, g.radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(180, 235, 255, 0.34)";
    ctx.lineWidth = Math.max(1, env.dpr * 1.2);
    ctx.stroke();
    ctx.restore();
  }

  function clearCanvas() {
    if (!env.ctx) return;
    env.ctx.clearRect(0, 0, env.width, env.height);
  }

  function render() {
    if (!env.ctx || !env.canvas) return api;

    resize();
    clearCanvas();

    state.frame += 1;
    state.time = performance.now();

    const payload = createChildPayload("render");

    invoke(env.childEngines.motion, ["frame", "tick", "update", "step"], payload);

    invoke(env.childEngines.sky, [
      "drawBackground",
      "renderBackground",
      "paintBackground",
      "drawSkyBackground"
    ], payload);

    drawBasePlanet();

    invoke(env.childEngines.continents, [
      "draw",
      "render",
      "paint",
      "drawContinents",
      "renderContinents",
      "paintContinents"
    ], payload);

    invoke(env.childEngines.sky, [
      "draw",
      "render",
      "paint",
      "drawAtmosphere",
      "renderAtmosphere",
      "paintAtmosphere",
      "drawOverlay"
    ], payload);

    publishFormVisible();
    state.renderRequested = false;

    return api;
  }

  function loop() {
    env.raf = window.requestAnimationFrame(loop);

    if (state.renderRequested || state.children.motion === "active") {
      render();
    }
  }

  async function boot(input, options = {}) {
    const mount = resolveMount(input || options.mount || options.selector);
    if (!mount) {
      recordError("mount", "No valid Audralia mount target was found.");
      publishReceipt();
      return api;
    }

    env.mount = mount;
    env.canvas = ensureCanvas(mount, options);
    env.ctx = env.canvas.getContext("2d", { alpha: true, desynchronized: true });

    if (!env.ctx) {
      recordError("canvas", "2D canvas context unavailable.");
      publishReceipt();
      return api;
    }

    state.mounted = true;

    window.addEventListener("resize", requestRender, { passive: true });

    resize();
    render();

    if (!env.bootPromise) {
      env.bootPromise = loadChildren()
        .then(() => {
          initChildren();
          state.ready = true;
          state.renderRequested = true;
          render();

          if (!env.raf) {
            loop();
          }

          publishReceipt();
          return api;
        })
        .catch((error) => {
          recordError("boot", error);
          publishReceipt();
          return api;
        });
    }

    publishReceipt();
    return env.bootPromise;
  }

  function mount(input, options = {}) {
    boot(input, options);
    return api;
  }

  function start(input, options = {}) {
    return mount(input, options);
  }

  function init(input, options = {}) {
    return mount(input, options);
  }

  function create(input, options = {}) {
    return mount(input, options);
  }

  function destroy() {
    if (env.raf) {
      window.cancelAnimationFrame(env.raf);
      env.raf = 0;
    }

    window.removeEventListener("resize", requestRender);

    state.ready = false;
    state.mounted = false;

    return api;
  }

  function getStatus() {
    return {
      contract: CONTRACT,
      family: FAMILY,
      route: ROUTE,
      target: TARGET,
      mounted: state.mounted,
      ready: state.ready,
      formVisible: state.formVisible,
      childContractRenewal: false,
      htmlChange: false,
      routeBridgeChange: false,
      visualPassClaim: false,
      children: { ...state.children },
      childPaths: {
        continents: CHILDREN.continents.path,
        motion: CHILDREN.motion.path,
        sky: CHILDREN.sky.path
      },
      preserves: RECEIPT.preserves.slice(),
      errors: state.errors.slice()
    };
  }

  const api = {
    CONTRACT,
    FAMILY,
    ROUTE,
    TARGET,
    RECEIPT,
    CHILDREN,
    mount,
    render,
    start,
    boot,
    init,
    create,
    destroy,
    requestRender,
    updateState,
    getStatus,
    status: getStatus,
    project
  };

  window.AUDRALIA_ENGINE = api;
  window.AUDRALIA_CLEAN_CANVAS_ENGINE = api;
  window.AUDRALIA_CLEAN_CANVAS_AUTHORITY = api;
  window.AUDRALIA_CLEAN_ENGINE_PARENT = api;

  publishReceipt();

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        const autoMount = document.querySelector("#audraliaCanvasMount");
        if (autoMount) mount(autoMount);
      },
      { once: true }
    );
  } else {
    const autoMount = document.querySelector("#audraliaCanvasMount");
    if (autoMount) mount(autoMount);
  }
})();

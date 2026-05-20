// /assets/audralia/clean/engine/audralia.engine.js
// AUDRALIA_G2_6_NINE_SUMMITS_256_FIBONACCI_CONTINENT_BASELINE_TNT_v1
// Full-file replacement.
// Purpose: fresh G2.6 parent render baseline for Audralia’s Nine Summits / 256 / Fibonacci continent model.
// Parent owns: mount, visible inspection frame, fixed globe geometry, ocean body, projection, drag-only longitude rotation, child loading, FORM_VISIBLE confirmation.
// Parent does not own: continent model, motion, sky, route bridge, runtime path, HTML, generated image, GraphicBox, or visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_6_NINE_SUMMITS_256_FIBONACCI_CONTINENT_BASELINE_TNT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_G2_5_SEA_LEVEL_CONTINENTS_LIMB_OCCLUSION_4K_SURFACE_TNT_v1";
  const FAMILY = "AUDRALIA_G2_6_NINE_SUMMITS_256_FIBONACCI_CONTINENT_BASELINE_TNT_v1";

  const TARGET = "/assets/audralia/clean/engine/audralia.engine.js";
  const ROUTE = "/showroom/globe/audralia/";

  const PHI = 1.61803398875;
  const PHI_INVERSE = 0.61803398875;
  const PHI_INVERSE_2 = 0.38196601125;
  const PHI_INVERSE_3 = 0.2360679775;
  const PHI_INVERSE_4 = 0.14589803375;
  const PHI_INVERSE_5 = 0.09016994375;

  const SAFE_RADIUS_FACTOR = PHI_INVERSE / 2;
  const MOBILE_RADIUS_FACTOR = SAFE_RADIUS_FACTOR - 0.01803398874;
  const CENTER_X_BIAS_FACTOR = -(PHI_INVERSE_3 - PHI_INVERSE_5 / 4);
  const DRAG_ROTATION_SENSITIVITY = 0.00618033989;

  const CHILDREN = Object.freeze({
    continents: {
      enabled: true,
      path: "/assets/audralia/clean/engine/audralia/engine/continents.js",
      globals: [
        "AUDRALIA_NINE_SUMMITS_CONTINENTS_ENGINE",
        "AUDRALIA_CLEAN_CONTINENTS_ENGINE",
        "AUDRALIA_CONTINENTS_ENGINE",
        "AUDRALIA_CLEAN_CANVAS_CONTINENTS",
        "AudraliaContinentsEngine",
        "AudraliaContinents",
        "audraliaContinents"
      ]
    },
    motion: {
      enabled: false,
      heldReason: "motion_neutralized_for_stationary_inspection",
      path: "/assets/audralia/clean/engine/audralia/engine/motion.js",
      globals: []
    },
    sky: {
      enabled: false,
      heldReason: "sky_held_until_surface_baseline_accepted",
      path: "/assets/audralia/clean/engine/audralia/engine/sky.js",
      globals: []
    }
  });

  const state = {
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    family: FAMILY,
    target: TARGET,
    route: ROUTE,
    g26CleanSurfaceInspectionBaseline: true,
    nineSummits256FibonacciModel: true,
    parentGlobalPublished: false,
    mountCalled: false,
    mounted: false,
    ready: false,
    formVisible: false,
    renderCount: 0,
    delegatedBy: "none",
    childLoadStarted: false,
    childLoadComplete: false,
    children: {
      continents: "pending",
      motion: "held",
      sky: "held"
    },
    errors: []
  };

  const env = {
    mount: null,
    canvas: null,
    ctx: null,
    dpr: 1,
    width: 0,
    height: 0,
    cssWidth: 0,
    cssHeight: 0,
    cx: 0,
    cy: 0,
    radius: 0,
    rotation: 0,
    dragging: false,
    lastPointer: null,
    childEngines: {
      continents: null,
      motion: null,
      sky: null
    },
    childPromise: null
  };

  function hasWindow() {
    return typeof window !== "undefined";
  }

  function hasDocument() {
    return typeof document !== "undefined";
  }

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function isElement(value) {
    return Boolean(value && value.nodeType === 1);
  }

  function recordError(scope, error) {
    const message = error && error.message ? error.message : String(error);
    state.errors.push({ scope, message, time: nowIso() });
    publishReceipt(scope);
  }

  function resolveMountTarget(input) {
    if (!hasDocument()) return input || null;

    if (isElement(input)) return input;
    if (typeof input === "string") return document.querySelector(input);

    if (input && isElement(input.mount)) return input.mount;
    if (input && isElement(input.element)) return input.element;
    if (input && isElement(input.el)) return input.el;

    if (input && typeof input.mount === "string") return document.querySelector(input.mount);
    if (input && typeof input.selector === "string") return document.querySelector(input.selector);

    return (
      document.querySelector("#audraliaCanvasMount") ||
      document.querySelector("[data-audralia-canvas-mount]") ||
      document.querySelector("[data-audralia-clean-canvas-mount]") ||
      document.querySelector("#audraliaMount") ||
      null
    );
  }

  function lockMountFrame(target) {
    if (!isElement(target)) return;

    target.style.position = "relative";
    target.style.overflow = "hidden";
    target.style.display = "block";
    target.style.contain = "layout paint";
    target.style.touchAction = "none";
    if (!target.style.minHeight) target.style.minHeight = "420px";

    target.setAttribute("data-audralia-visible-box-frame", "true");
    target.setAttribute("data-audralia-parent-contract", CONTRACT);
    target.setAttribute("data-audralia-nine-summits-256-fibonacci-model", "true");
  }

  function lockCanvas(canvas) {
    if (!isElement(canvas)) return;

    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.minWidth = "0";
    canvas.style.minHeight = "0";
    canvas.style.maxWidth = "100%";
    canvas.style.maxHeight = "100%";
    canvas.style.borderRadius = "24px";
    canvas.style.touchAction = "none";
    canvas.style.userSelect = "none";
    canvas.style.webkitUserSelect = "none";

    canvas.setAttribute("data-audralia-clean-parent-canvas", "true");
    canvas.setAttribute("data-audralia-clean-canvas", "true");
    canvas.setAttribute("data-contract", CONTRACT);
    canvas.setAttribute("aria-label", "Audralia Nine Summits Fibonacci inspection planet");
  }

  function ensureCanvas(target) {
    if (!hasDocument() || !isElement(target)) return null;

    lockMountFrame(target);

    let canvas =
      target.querySelector("canvas[data-audralia-clean-parent-canvas='true']") ||
      target.querySelector("canvas[data-audralia-clean-canvas='true']") ||
      target.querySelector("canvas");

    if (!canvas) {
      target.innerHTML = "";
      canvas = document.createElement("canvas");
      target.appendChild(canvas);
    }

    lockCanvas(canvas);

    return canvas;
  }

  function resize() {
    if (!env.canvas || !env.mount) return;

    lockMountFrame(env.mount);
    lockCanvas(env.canvas);

    const rect = env.mount.getBoundingClientRect();

    const visibleWidth = Math.max(
      320,
      Math.floor(env.mount.clientWidth || rect.width || 760)
    );

    const visibleHeight = Math.max(
      420,
      Math.floor(env.mount.clientHeight || rect.height || 540)
    );

    const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));

    env.dpr = dpr;
    env.cssWidth = visibleWidth;
    env.cssHeight = visibleHeight;
    env.width = Math.floor(visibleWidth * dpr);
    env.height = Math.floor(visibleHeight * dpr);

    env.cx = env.width / 2 + env.width * CENTER_X_BIAS_FACTOR;
    env.cy = env.height / 2;

    const mobileTight = visibleWidth <= 520;
    const factor = mobileTight ? MOBILE_RADIUS_FACTOR : SAFE_RADIUS_FACTOR;
    env.radius = Math.floor(Math.min(env.width, env.height) * factor);

    if (env.canvas.width !== env.width) env.canvas.width = env.width;
    if (env.canvas.height !== env.height) env.canvas.height = env.height;

    env.canvas.style.width = "100%";
    env.canvas.style.height = "100%";
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

  function clearCanvas(ctx, g) {
    ctx.clearRect(0, 0, g.width, g.height);
  }

  function drawSpace(ctx, g) {
    const bg = ctx.createLinearGradient(0, 0, 0, g.height);
    bg.addColorStop(0, "rgba(4, 12, 28, 1)");
    bg.addColorStop(0.62, "rgba(2, 7, 20, 1)");
    bg.addColorStop(1, "rgba(1, 3, 12, 1)");

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, g.width, g.height);

    ctx.save();
    ctx.globalAlpha = 0.26;

    for (let i = 0; i < 89; i += 1) {
      const x = (i * 131 + 37) % Math.max(1, g.width);
      const y = (i * 197 + 53) % Math.max(1, g.height);
      const r = ((i % 3) + 0.55) * g.dpr * 0.36;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(220, 246, 255, 0.64)";
      ctx.fill();
    }

    ctx.restore();
  }

  function clipToPlanet(ctx, g) {
    ctx.beginPath();
    ctx.arc(g.cx, g.cy, g.radius, 0, Math.PI * 2);
    ctx.clip();
  }

  function drawOceanBase(ctx, g) {
    const cx = g.cx;
    const cy = g.cy;
    const r = g.radius;

    ctx.save();

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    const ocean = ctx.createRadialGradient(cx - r * 0.32, cy - r * 0.34, r * 0.08, cx, cy, r);
    ocean.addColorStop(0, "rgba(126, 232, 255, 0.98)");
    ocean.addColorStop(0.24, "rgba(42, 158, 205, 0.98)");
    ocean.addColorStop(0.6, "rgba(9, 69, 132, 1)");
    ocean.addColorStop(1, "rgba(1, 14, 46, 1)");
    ctx.fillStyle = ocean;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    const depth = ctx.createRadialGradient(cx + r * 0.22, cy + r * 0.24, r * 0.1, cx, cy, r * 1.15);
    depth.addColorStop(0, "rgba(5, 38, 86, 0)");
    depth.addColorStop(0.55, "rgba(1, 18, 58, 0.12)");
    depth.addColorStop(1, "rgba(0, 4, 20, 0.58)");
    ctx.fillStyle = depth;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    const light = ctx.createRadialGradient(cx - r * 0.4, cy - r * 0.38, r * 0.1, cx + r * 0.18, cy + r * 0.18, r * 1.16);
    light.addColorStop(0, "rgba(255,255,255,0.22)");
    light.addColorStop(0.42, "rgba(255,255,255,0)");
    light.addColorStop(1, "rgba(0,0,0,0.54)");
    ctx.fillStyle = light;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.restore();
  }

  function drawAtmosphericRim(ctx, g) {
    const cx = g.cx;
    const cy = g.cy;
    const r = g.radius;

    ctx.save();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.998, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(190, 240, 255, 0.32)";
    ctx.lineWidth = Math.max(1, g.dpr * 1.18);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.012, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(86, 205, 255, 0.08)";
    ctx.lineWidth = Math.max(1, g.dpr * 1.2);
    ctx.stroke();

    ctx.restore();
  }

  function project(lon, lat, elevation = 0) {
    const g = getGeometry();
    const lambda = typeof lon === "number" ? lon : 0;
    const phi = typeof lat === "number" ? lat : 0;
    const r = g.radius * (1 + elevation);
    const yaw = env.rotation;

    const cosPhi = Math.cos(phi);
    const x = cosPhi * Math.sin(lambda + yaw);
    const y = Math.sin(phi);
    const z = cosPhi * Math.cos(lambda + yaw);

    return {
      x: g.cx + x * r,
      y: g.cy - y * r,
      z,
      visible: z > -0.06,
      scale: Math.max(0, z)
    };
  }

  function makePayload(scope) {
    return {
      scope,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      family: FAMILY,
      target: TARGET,
      route: ROUTE,
      state,
      mount: env.mount,
      canvas: env.canvas,
      ctx: env.ctx,
      geometry: getGeometry(),
      requestRender,
      render,
      getStatus,
      api,
      project
    };
  }

  function invokeChild(name, methodNames, payload) {
    const child = env.childEngines[name];
    if (!child) return false;

    for (const methodName of methodNames) {
      const method = child[methodName];
      if (typeof method !== "function") continue;

      try {
        if (method.length >= 2) method.call(child, payload.ctx, payload);
        else method.call(child, payload);
        return true;
      } catch (error) {
        recordError(`${name}.${methodName}`, error);
        return false;
      }
    }

    return false;
  }

  function render() {
    if (!env.canvas || !env.ctx) return api;

    resize();

    const ctx = env.ctx;
    const g = getGeometry();

    state.renderCount += 1;

    clearCanvas(ctx, g);
    drawSpace(ctx, g);
    drawOceanBase(ctx, g);

    ctx.save();
    clipToPlanet(ctx, g);

    const payload = makePayload("render");

    invokeChild("continents", [
      "draw",
      "render",
      "paint",
      "drawContinents",
      "renderContinents",
      "paintContinents"
    ], payload);

    ctx.restore();

    drawAtmosphericRim(ctx, g);

    publishFormVisible("render-visible");

    return api;
  }

  function requestRender() {
    render();
    return api;
  }

  function bindPointerControls() {
    if (!env.canvas || env.canvas.__audraliaCleanParentControlsBound) return;

    env.canvas.__audraliaCleanParentControlsBound = true;

    env.canvas.addEventListener(
      "pointerdown",
      (event) => {
        event.preventDefault();
        env.dragging = true;
        env.lastPointer = { x: event.clientX, y: event.clientY };
        env.canvas.setPointerCapture?.(event.pointerId);
      },
      { passive: false }
    );

    env.canvas.addEventListener(
      "pointermove",
      (event) => {
        if (!env.dragging || !env.lastPointer) return;

        event.preventDefault();

        const dx = event.clientX - env.lastPointer.x;
        env.rotation += dx * DRAG_ROTATION_SENSITIVITY;
        env.lastPointer = { x: event.clientX, y: event.clientY };

        requestRender();
      },
      { passive: false }
    );

    env.canvas.addEventListener(
      "pointerup",
      (event) => {
        event.preventDefault();
        env.dragging = false;
        env.lastPointer = null;
        env.canvas.releasePointerCapture?.(event.pointerId);
        requestRender();
      },
      { passive: false }
    );

    env.canvas.addEventListener(
      "pointercancel",
      (event) => {
        event.preventDefault();
        env.dragging = false;
        env.lastPointer = null;
        requestRender();
      },
      { passive: false }
    );
  }

  function scriptAlreadyLoadedCurrent(src) {
    if (!hasDocument()) return false;

    const wanted = `${src}?v=${encodeURIComponent(CONTRACT)}`;

    return Array.from(document.scripts).some((script) => {
      const raw = script.getAttribute("src") || "";
      return raw === wanted;
    });
  }

  function loadScriptOnce(src) {
    return new Promise((resolve) => {
      if (!hasDocument()) {
        resolve({ src, loaded: false, reason: "document-unavailable" });
        return;
      }

      if (scriptAlreadyLoadedCurrent(src)) {
        resolve({ src, loaded: true, reused: true });
        return;
      }

      const script = document.createElement("script");
      script.src = `${src}?v=${encodeURIComponent(CONTRACT)}`;
      script.async = false;
      script.defer = false;
      script.setAttribute("data-audralia-clean-parent-child-loader", CONTRACT);
      script.setAttribute("data-audralia-g26-nine-summits-child-cache", "true");

      script.onload = () => resolve({ src, loaded: true, reused: false });
      script.onerror = () => resolve({ src, loaded: false, reused: false });

      document.head.appendChild(script);
    });
  }

  function readChildGlobal(keys) {
    if (!hasWindow()) return null;

    for (const key of keys) {
      if (window[key]) return window[key];
    }

    return null;
  }

  function normalizeChild(name, raw) {
    if (!raw) return null;

    if (typeof raw === "function") {
      try {
        return raw(makePayload(name)) || raw;
      } catch (_error) {
        return raw;
      }
    }

    return raw;
  }

  async function loadChildren() {
    if (state.childLoadStarted) return env.childPromise;

    state.childLoadStarted = true;
    publishReceipt("children-load-start");

    env.childPromise = (async () => {
      for (const [name, child] of Object.entries(CHILDREN)) {
        if (!child.enabled) {
          state.children[name] = "held";
          publishReceipt(`child-${name}-held`);
          continue;
        }

        state.children[name] = "loading";
        publishReceipt(`child-${name}-loading`);

        const result = await loadScriptOnce(child.path);

        if (!result.loaded) {
          state.children[name] = "missing";
          recordError(`child.${name}`, `Unable to load child file: ${child.path}`);
          continue;
        }

        const raw = readChildGlobal(child.globals);
        const normalized = normalizeChild(name, raw);

        if (!normalized) {
          state.children[name] = "loaded_no_global";
          recordError(`child.${name}`, `Child loaded but no recognized global was published: ${child.path}`);
          continue;
        }

        env.childEngines[name] = normalized;
        state.children[name] = "active";

        invokeChild(name, ["mount", "init", "setup", "boot", "create"], makePayload(`child-${name}-init`));
        publishReceipt(`child-${name}-active`);
      }

      state.childLoadComplete = true;
      publishReceipt("children-load-complete");
      requestRender();

      return getStatus();
    })();

    return env.childPromise;
  }

  function publishGlobals(scope = "publish-globals") {
    if (!hasWindow()) return api;

    window.AUDRALIA_ENGINE = api;
    window.AUDRALIA_CLEAN_CANVAS_ENGINE = api;
    window.AUDRALIA_CLEAN_CANVAS_AUTHORITY = api;
    window.AUDRALIA_CLEAN_ENGINE_PARENT = api;

    window.AUDRALIA_CLEAN_PARENT_ENGINE_GLOBAL_PUBLISHED = true;
    window.AUDRALIA_CLEAN_PARENT_ENGINE_CONTRACT = CONTRACT;
    window.AUDRALIA_G26_NINE_SUMMITS_256_FIBONACCI_PARENT_ACTIVE = true;

    state.parentGlobalPublished = true;

    if (hasDocument() && document.documentElement) {
      document.documentElement.setAttribute("data-audralia-clean-parent-contract", CONTRACT);
      document.documentElement.setAttribute("data-audralia-clean-parent-target", TARGET);
      document.documentElement.setAttribute("data-audralia-g26-nine-summits-256-fibonacci-parent-active", "true");
      document.documentElement.setAttribute("data-audralia-clean-parent-mounted", state.mounted ? "true" : "false");
      document.documentElement.setAttribute("data-audralia-clean-parent-form-visible", state.formVisible ? "true" : "false");
    }

    publishReceipt(scope);

    return api;
  }

  function publishFormVisible(scope = "form-visible") {
    state.formVisible = true;
    state.ready = true;

    if (hasWindow()) {
      window.AUDRALIA_FORM_VISIBLE = true;
      window.AUDRALIA_CLEAN_CANVAS_FORM_VISIBLE = true;
      window.AUDRALIA_CLEAN_PARENT_FORM_VISIBLE = true;
      window.AUDRALIA_CLEAN_PARENT_ENGINE_READY = true;
    }

    if (env.mount) {
      env.mount.setAttribute("data-audralia-form-visible", "true");
      env.mount.setAttribute("data-audralia-clean-parent-form-visible", "true");
      env.mount.setAttribute("data-audralia-clean-parent-contract", CONTRACT);
    }

    if (env.canvas) {
      env.canvas.setAttribute("data-audralia-form-visible", "true");
      env.canvas.setAttribute("data-audralia-clean-parent-form-visible", "true");
    }

    publishReceipt(scope);
  }

  function publishReceipt(scope = "publish") {
    if (!hasWindow()) return;

    const receipt = {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      family: FAMILY,
      target: TARGET,
      route: ROUTE,
      mode: "g26_nine_summits_256_fibonacci_parent_baseline",
      scope,
      g26CleanSurfaceInspectionBaseline: true,
      nineSummits256FibonacciModel: true,
      phi: PHI,
      phiInverse: PHI_INVERSE,
      phiInverse2: PHI_INVERSE_2,
      phiInverse3: PHI_INVERSE_3,
      phiInverse4: PHI_INVERSE_4,
      phiInverse5: PHI_INVERSE_5,
      safeRadiusFactor: SAFE_RADIUS_FACTOR,
      mobileRadiusFactor: MOBILE_RADIUS_FACTOR,
      centerXBiasFactor: CENTER_X_BIAS_FACTOR,
      dragRotationSensitivity: DRAG_ROTATION_SENSITIVITY,
      centerLocked: true,
      fixedRadius: true,
      fixedCameraDepth: true,
      dragRotationOnly: true,
      noAutoOrbit: true,
      motionChildDisabled: true,
      skyChildHeld: true,
      parentGlobalPublished: state.parentGlobalPublished,
      mountCalled: state.mountCalled,
      mounted: state.mounted,
      ready: state.ready,
      formVisible: state.formVisible,
      delegatedBy: state.delegatedBy,
      renderCount: state.renderCount,
      geometry: {
        cssWidth: env.cssWidth,
        cssHeight: env.cssHeight,
        width: env.width,
        height: env.height,
        cx: env.cx,
        cy: env.cy,
        radius: env.radius
      },
      rotation: env.rotation,
      children: { ...state.children },
      childPaths: {
        continents: CHILDREN.continents.path,
        motion: CHILDREN.motion.path,
        sky: CHILDREN.sky.path
      },
      childLoadStarted: state.childLoadStarted,
      childLoadComplete: state.childLoadComplete,
      errors: state.errors.slice(),
      htmlChange: false,
      routeBridgeChange: false,
      runtimeRewrite: false,
      parentRewrite: true,
      childContractRenewal: false,
      visualPassClaim: false,
      generatedImage: false,
      graphicBox: false
    };

    window.AUDRALIA_CLEAN_CANVAS_RECEIPT = receipt;
    window.AUDRALIA_ENGINE_RECEIPT = receipt;
    window.AUDRALIA_CLEAN_PARENT_ENGINE_RECEIPT = receipt;

    try {
      window.dispatchEvent(new CustomEvent("audralia:clean-parent:receipt", { detail: receipt }));
    } catch (_error) {
      try {
        window.dispatchEvent(new Event("audralia:clean-parent:receipt"));
      } catch (_ignored) {}
    }
  }

  function mount(input, options = {}) {
    state.mountCalled = true;
    state.mounted = true;
    state.delegatedBy = options && options.delegatedBy ? String(options.delegatedBy) : "direct";

    const target = resolveMountTarget(input);

    if (!target) {
      recordError("mount", "No Audralia clean parent mount target was found.");
      publishReceipt("mount-no-target");
      return api;
    }

    env.mount = target;
    lockMountFrame(env.mount);

    env.canvas = ensureCanvas(target);
    env.ctx = env.canvas ? env.canvas.getContext("2d", { alpha: true, desynchronized: true }) : null;

    if (!env.canvas || !env.ctx) {
      recordError("mount", "Unable to create or acquire 2D canvas context.");
      publishReceipt("mount-no-canvas");
      return api;
    }

    resize();
    bindPointerControls();
    render();

    loadChildren().catch((error) => recordError("loadChildren", error));

    publishFormVisible("mount-complete");

    return api;
  }

  function boot(input, options = {}) {
    return mount(input, options);
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

  function updateState(next = {}) {
    if (next && typeof next === "object") {
      if (typeof next.rotation === "number") env.rotation = next.rotation;
    }

    render();
    return api;
  }

  function destroy() {
    state.mounted = false;
    state.ready = false;
    state.formVisible = false;
    env.dragging = false;
    env.lastPointer = null;

    publishReceipt("destroy");

    return api;
  }

  function getStatus() {
    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      family: FAMILY,
      target: TARGET,
      route: ROUTE,
      mode: "g26_nine_summits_256_fibonacci_parent_baseline",
      g26CleanSurfaceInspectionBaseline: true,
      nineSummits256FibonacciModel: true,
      centerLocked: true,
      fixedRadius: true,
      fixedCameraDepth: true,
      dragRotationOnly: true,
      noAutoOrbit: true,
      motionChildDisabled: true,
      skyChildHeld: true,
      parentGlobalPublished: state.parentGlobalPublished,
      mountCalled: state.mountCalled,
      mounted: state.mounted,
      ready: state.ready,
      formVisible: state.formVisible,
      delegatedBy: state.delegatedBy,
      renderCount: state.renderCount,
      geometry: {
        cssWidth: env.cssWidth,
        cssHeight: env.cssHeight,
        width: env.width,
        height: env.height,
        cx: env.cx,
        cy: env.cy,
        radius: env.radius
      },
      rotation: env.rotation,
      children: { ...state.children },
      childLoadStarted: state.childLoadStarted,
      childLoadComplete: state.childLoadComplete,
      htmlChange: false,
      routeBridgeChange: false,
      runtimeRewrite: false,
      parentRewrite: true,
      childContractRenewal: false,
      visualPassClaim: false,
      generatedImage: false,
      graphicBox: false,
      errors: state.errors.slice()
    };
  }

  const api = {
    CONTRACT,
    PREVIOUS_CONTRACT,
    FAMILY,
    TARGET,
    ROUTE,
    CHILDREN,
    mount,
    boot,
    start,
    init,
    create,
    render,
    requestRender,
    updateState,
    destroy,
    getStatus,
    status: getStatus,
    project
  };

  publishGlobals("module-load");

  if (hasDocument()) {
    window.addEventListener(
      "resize",
      () => {
        if (state.mounted) requestRender();
      },
      { passive: true }
    );

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => publishGlobals("dom-ready"), { once: true });
    } else {
      publishGlobals("dom-ready");
    }
  }
})();

// /assets/audralia/clean/engine/audralia.engine.js
// AUDRALIA_G2_5_EXISTING_ARCHITECTURE_PATH_ALIGNMENT_PARENT_TNT_v1
// Full-file replacement.
// Purpose: align the clean parent engine to the repository’s existing architecture and publish parent globals immediately.
// Parent file: /assets/audralia/clean/engine/audralia.engine.js
// Child files:
//   /assets/audralia/clean/engine/audralia/engine/continents.js
//   /assets/audralia/clean/engine/audralia/engine/motion.js
//   /assets/audralia/clean/engine/audralia/engine/sky.js
// Does not own: route HTML, route bridge, versioned runtime, clean runtime, parent Globe, Characters, Gauges, Showroom, generated image, GraphicBox, or visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_5_EXISTING_ARCHITECTURE_PATH_ALIGNMENT_PARENT_TNT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_G2_5_CLEAN_PARENT_ENGINE_GLOBAL_PUBLICATION_AND_MOUNT_CONFIRMATION_TNT_v1";
  const FAMILY = "AUDRALIA_G2_5_EXISTING_ARCHITECTURE_PATH_ALIGNMENT_TNT_v1";

  const TARGET = "/assets/audralia/clean/engine/audralia.engine.js";
  const ROUTE = "/showroom/globe/audralia/";

  const CHILDREN = Object.freeze({
    continents: {
      path: "/assets/audralia/clean/engine/audralia/engine/continents.js",
      owns: "continent law, five-continent exposure, submerged shelves, terrain pressure, Nine-Summits pressure",
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
      path: "/assets/audralia/clean/engine/audralia/engine/motion.js",
      owns: "axis tilt, rotation, drag, pitch bounds, redraw triggers",
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
      path: "/assets/audralia/clean/engine/audralia/engine/sky.js",
      owns: "rim glow, haze, clouds, lighting tint, weather inheritance toward H-Earth",
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

  const state = {
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    family: FAMILY,
    target: TARGET,
    route: ROUTE,
    existingArchitecturePathAligned: true,
    parentGlobalPublished: false,
    mountCalled: false,
    mounted: false,
    ready: false,
    formVisible: false,
    renderCount: 0,
    lastScope: "module-load",
    delegatedBy: "none",
    childLoadStarted: false,
    childLoadComplete: false,
    children: {
      continents: "pending",
      motion: "pending",
      sky: "pending"
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
    cx: 0,
    cy: 0,
    radius: 0,
    raf: 0,
    childEngines: {
      continents: null,
      motion: null,
      sky: null
    },
    childPromise: null,
    rotation: 0,
    pitch: -0.08,
    dragging: false,
    lastPointer: null
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

  function recordError(scope, error) {
    const message = error && error.message ? error.message : String(error);
    state.errors.push({ scope, message, time: nowIso() });
    publishReceipt(scope);
  }

  function isElement(value) {
    return Boolean(value && value.nodeType === 1);
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

  function ensureCanvas(target) {
    if (!hasDocument() || !isElement(target)) return null;

    let canvas =
      target.querySelector("canvas[data-audralia-clean-parent-canvas='true']") ||
      target.querySelector("canvas[data-audralia-clean-canvas='true']") ||
      target.querySelector("canvas");

    if (!canvas) {
      target.innerHTML = "";

      canvas = document.createElement("canvas");
      canvas.setAttribute("data-audralia-clean-parent-canvas", "true");
      canvas.setAttribute("data-audralia-clean-canvas", "true");
      canvas.setAttribute("data-contract", CONTRACT);
      canvas.setAttribute("aria-label", "Audralia clean parent engine planet render");
      canvas.style.display = "block";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.minHeight = "360px";
      canvas.style.borderRadius = "24px";
      canvas.style.touchAction = "none";
      canvas.style.userSelect = "none";

      target.appendChild(canvas);
    } else {
      canvas.setAttribute("data-audralia-clean-parent-canvas", "true");
      canvas.setAttribute("data-audralia-clean-canvas", "true");
      canvas.setAttribute("data-contract", CONTRACT);
      canvas.style.display = "block";
      canvas.style.width = canvas.style.width || "100%";
      canvas.style.height = canvas.style.height || "100%";
      canvas.style.minHeight = canvas.style.minHeight || "360px";
      canvas.style.touchAction = "none";
      canvas.style.userSelect = "none";
    }

    return canvas;
  }

  function resize() {
    if (!env.canvas || !env.mount) return;

    const rect = env.mount.getBoundingClientRect();
    const cssWidth = Math.max(320, Math.floor(rect.width || env.mount.clientWidth || 760));
    const cssHeight = Math.max(360, Math.floor(rect.height || env.mount.clientHeight || 520));
    const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));

    env.dpr = dpr;
    env.width = Math.floor(cssWidth * dpr);
    env.height = Math.floor(cssHeight * dpr);
    env.cx = env.width / 2;
    env.cy = env.height / 2;
    env.radius = Math.floor(Math.min(env.width, env.height) * 0.36);

    if (env.canvas.width !== env.width) env.canvas.width = env.width;
    if (env.canvas.height !== env.height) env.canvas.height = env.height;

    env.canvas.style.width = `${cssWidth}px`;
    env.canvas.style.height = `${cssHeight}px`;
  }

  function publishGlobals(scope = "publish-globals") {
    if (!hasWindow()) return api;

    window.AUDRALIA_ENGINE = api;
    window.AUDRALIA_CLEAN_CANVAS_ENGINE = api;
    window.AUDRALIA_CLEAN_CANVAS_AUTHORITY = api;
    window.AUDRALIA_CLEAN_ENGINE_PARENT = api;

    window.AUDRALIA_CLEAN_PARENT_ENGINE_GLOBAL_PUBLISHED = true;
    window.AUDRALIA_CLEAN_PARENT_ENGINE_CONTRACT = CONTRACT;
    window.AUDRALIA_EXISTING_ARCHITECTURE_PARENT_ALIGNED = true;

    state.parentGlobalPublished = true;

    if (hasDocument() && document.documentElement) {
      document.documentElement.setAttribute("data-audralia-clean-parent-contract", CONTRACT);
      document.documentElement.setAttribute("data-audralia-clean-parent-target", TARGET);
      document.documentElement.setAttribute("data-audralia-existing-architecture-parent-aligned", "true");
      document.documentElement.setAttribute("data-audralia-clean-parent-global-published", "true");
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

    if (hasDocument() && document.documentElement) {
      document.documentElement.setAttribute("data-audralia-form-visible", "true");
      document.documentElement.setAttribute("data-audralia-clean-parent-form-visible", "true");
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
      mode: "existing_architecture_path_alignment_parent_engine",
      scope,
      existingArchitecturePathAligned: true,
      parentGlobalPublished: state.parentGlobalPublished,
      mountCalled: state.mountCalled,
      mounted: state.mounted,
      ready: state.ready,
      formVisible: state.formVisible,
      delegatedBy: state.delegatedBy,
      renderCount: state.renderCount,
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
      cleanRuntimeRewrite: false,
      parentRewrite: true,
      childContractRenewal: false,
      visualPassClaim: false,
      generatedImage: false,
      graphicBox: false,
      preserves: [
        "AUDRALIA_ENGINE",
        "AUDRALIA_CLEAN_CANVAS_ENGINE",
        "AUDRALIA_CLEAN_CANVAS_AUTHORITY",
        "AUDRALIA_CLEAN_ENGINE_PARENT",
        "mount()",
        "boot()",
        "start()",
        "init()",
        "create()",
        "render()",
        "requestRender()",
        "getStatus()",
        "FORM_VISIBLE parent confirmation"
      ]
    };

    window.AUDRALIA_CLEAN_CANVAS_RECEIPT = receipt;
    window.AUDRALIA_ENGINE_RECEIPT = receipt;
    window.AUDRALIA_CLEAN_PARENT_ENGINE_RECEIPT = receipt;

    try {
      window.dispatchEvent(
        new CustomEvent("audralia:clean-parent:receipt", { detail: receipt })
      );
    } catch (_error) {
      try {
        window.dispatchEvent(new Event("audralia:clean-parent:receipt"));
      } catch (_ignored) {}
    }
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

  function drawSpace(ctx, g) {
    const bg = ctx.createRadialGradient(g.cx, g.cy, g.radius * 0.2, g.cx, g.cy, g.radius * 2.3);
    bg.addColorStop(0, "rgba(13, 44, 72, 0.96)");
    bg.addColorStop(0.48, "rgba(5, 17, 41, 1)");
    bg.addColorStop(1, "rgba(1, 4, 16, 1)");

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, g.width, g.height);

    ctx.save();
    ctx.globalAlpha = 0.42;

    for (let i = 0; i < 90; i += 1) {
      const x = (i * 131) % Math.max(1, g.width);
      const y = (i * 197) % Math.max(1, g.height);
      const r = ((i % 3) + 0.6) * g.dpr * 0.42;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(220, 246, 255, 0.72)";
      ctx.fill();
    }

    ctx.restore();
  }

  function drawLandmass(ctx, cx, cy, r, nx, ny, sx, sy, rot, fill) {
    ctx.save();
    ctx.translate(cx + nx * r, cy + ny * r);
    ctx.rotate(rot);
    ctx.beginPath();

    const points = 18;

    for (let i = 0; i <= points; i += 1) {
      const t = (Math.PI * 2 * i) / points;
      const noise =
        1 +
        Math.sin(t * 3.1 + nx * 4.7) * 0.1 +
        Math.cos(t * 5.2 + ny * 3.3) * 0.07 +
        Math.sin(t * 8.0) * 0.035;

      const x = Math.cos(t) * r * sx * noise;
      const y = Math.sin(t) * r * sy * noise;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();

    ctx.strokeStyle = "rgba(225, 244, 212, 0.18)";
    ctx.lineWidth = Math.max(1, r * 0.006);
    ctx.stroke();

    ctx.restore();
  }

  function drawParentPlanet(ctx, g) {
    const cx = g.cx;
    const cy = g.cy;
    const r = g.radius;
    const yaw = env.rotation;
    const tilt = Math.sin(yaw * 0.7) * 0.06 + env.pitch;

    ctx.save();

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    const ocean = ctx.createRadialGradient(cx - r * 0.34, cy - r * 0.36, r * 0.08, cx, cy, r);
    ocean.addColorStop(0, "rgba(112, 232, 255, 0.98)");
    ocean.addColorStop(0.22, "rgba(39, 154, 199, 0.98)");
    ocean.addColorStop(0.58, "rgba(11, 70, 132, 1)");
    ocean.addColorStop(1, "rgba(2, 16, 48, 1)");
    ctx.fillStyle = ocean;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    drawLandmass(ctx, cx, cy, r, -0.34 + Math.sin(yaw) * 0.08, -0.05 + tilt, 0.32, 0.56, -0.34, "rgba(78, 154, 103, 0.78)");
    drawLandmass(ctx, cx, cy, r, 0.28 + Math.cos(yaw * 0.8) * 0.07, 0.06 - tilt * 0.5, 0.24, 0.42, 0.46, "rgba(165, 130, 82, 0.64)");
    drawLandmass(ctx, cx, cy, r, 0.06 + Math.sin(yaw * 1.2) * 0.05, -0.47, 0.2, 0.22, -0.12, "rgba(108, 178, 118, 0.6)");
    drawLandmass(ctx, cx, cy, r, -0.08 + Math.cos(yaw) * 0.03, 0.38, 0.18, 0.24, 0.18, "rgba(144, 116, 82, 0.52)");

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.26;

    for (let i = 0; i < 9; i += 1) {
      const bandY = cy - r * 0.58 + i * r * 0.14 + Math.sin(yaw + i) * r * 0.015;
      ctx.beginPath();
      ctx.ellipse(cx, bandY, r * (0.74 + (i % 3) * 0.04), r * 0.022, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(230, 248, 255, 0.18)";
      ctx.fill();
    }

    ctx.restore();

    const shade = ctx.createRadialGradient(
      cx - r * 0.38,
      cy - r * 0.38,
      r * 0.16,
      cx + r * 0.28,
      cy + r * 0.18,
      r * 1.2
    );

    shade.addColorStop(0, "rgba(255,255,255,0.18)");
    shade.addColorStop(0.5, "rgba(255,255,255,0)");
    shade.addColorStop(1, "rgba(0,0,0,0.58)");

    ctx.fillStyle = shade;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(190, 240, 255, 0.44)";
    ctx.lineWidth = Math.max(1, g.dpr * 1.35);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.025, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(118, 224, 255, 0.2)";
    ctx.lineWidth = Math.max(1, g.dpr * 2.2);
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
      visible: z > -0.05,
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
    state.lastScope = "render";

    drawSpace(ctx, g);
    drawParentPlanet(ctx, g);

    const payload = makePayload("render");

    invokeChild("motion", ["frame", "tick", "update", "step"], payload);

    invokeChild("continents", [
      "draw",
      "render",
      "paint",
      "drawContinents",
      "renderContinents",
      "paintContinents"
    ], payload);

    invokeChild("sky", [
      "draw",
      "render",
      "paint",
      "drawAtmosphere",
      "renderAtmosphere",
      "paintAtmosphere",
      "drawOverlay"
    ], payload);

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
        env.dragging = true;
        env.lastPointer = { x: event.clientX, y: event.clientY };
        env.canvas.setPointerCapture?.(event.pointerId);
      },
      { passive: true }
    );

    env.canvas.addEventListener(
      "pointermove",
      (event) => {
        if (!env.dragging || !env.lastPointer) return;

        const dx = event.clientX - env.lastPointer.x;
        const dy = event.clientY - env.lastPointer.y;

        env.rotation += dx * 0.006;
        env.pitch = Math.max(-0.42, Math.min(0.42, env.pitch + dy * 0.003));

        env.lastPointer = { x: event.clientX, y: event.clientY };

        requestRender();
      },
      { passive: true }
    );

    env.canvas.addEventListener(
      "pointerup",
      (event) => {
        env.dragging = false;
        env.lastPointer = null;
        env.canvas.releasePointerCapture?.(event.pointerId);
      },
      { passive: true }
    );

    env.canvas.addEventListener(
      "pointercancel",
      () => {
        env.dragging = false;
        env.lastPointer = null;
      },
      { passive: true }
    );
  }

  function startLoop() {
    if (env.raf) return;

    const tick = () => {
      env.raf = window.requestAnimationFrame(tick);

      if (!env.dragging) {
        env.rotation += 0.0024;
        render();
      }
    };

    env.raf = window.requestAnimationFrame(tick);
  }

  function scriptAlreadyLoaded(src) {
    if (!hasDocument()) return false;

    return Array.from(document.scripts).some((script) => {
      const raw = script.getAttribute("src") || "";
      return raw === src || raw.startsWith(`${src}?`) || raw.endsWith(src);
    });
  }

  function loadScriptOnce(src) {
    return new Promise((resolve) => {
      if (!hasDocument()) {
        resolve({ src, loaded: false, reason: "document-unavailable" });
        return;
      }

      if (scriptAlreadyLoaded(src)) {
        resolve({ src, loaded: true, reused: true });
        return;
      }

      const script = document.createElement("script");
      script.src = `${src}?v=${encodeURIComponent(CONTRACT)}`;
      script.async = false;
      script.defer = false;
      script.setAttribute("data-audralia-clean-parent-child-loader", CONTRACT);

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

  function mount(input, options = {}) {
    state.mountCalled = true;
    state.mounted = true;
    state.delegatedBy = options && options.delegatedBy ? String(options.delegatedBy) : "direct";
    state.lastScope = "mount";

    const target = resolveMountTarget(input);

    if (!target) {
      recordError("mount", "No Audralia clean parent mount target was found.");
      publishReceipt("mount-no-target");
      return api;
    }

    env.mount = target;
    env.mount.setAttribute("data-audralia-clean-parent-mounted", "true");
    env.mount.setAttribute("data-audralia-clean-parent-contract", CONTRACT);

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
    startLoop();
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
      if (typeof next.pitch === "number") env.pitch = next.pitch;
    }

    render();
    return api;
  }

  function destroy() {
    if (env.raf) {
      window.cancelAnimationFrame(env.raf);
      env.raf = 0;
    }

    state.mounted = false;
    state.ready = false;
    state.formVisible = false;

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
      mode: "existing_architecture_path_alignment_parent_engine",
      existingArchitecturePathAligned: true,
      parentGlobalPublished: state.parentGlobalPublished,
      mountCalled: state.mountCalled,
      mounted: state.mounted,
      ready: state.ready,
      formVisible: state.formVisible,
      delegatedBy: state.delegatedBy,
      renderCount: state.renderCount,
      children: { ...state.children },
      childPaths: {
        continents: CHILDREN.continents.path,
        motion: CHILDREN.motion.path,
        sky: CHILDREN.sky.path
      },
      childLoadStarted: state.childLoadStarted,
      childLoadComplete: state.childLoadComplete,
      htmlChange: false,
      routeBridgeChange: false,
      runtimeRewrite: false,
      cleanRuntimeRewrite: false,
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
      document.addEventListener(
        "DOMContentLoaded",
        () => {
          publishGlobals("dom-ready");
        },
        { once: true }
      );
    } else {
      publishGlobals("dom-ready");
    }
  }
})();

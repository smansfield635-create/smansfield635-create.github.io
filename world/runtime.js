/* G1 PLANET 1 RUNTIME FRAME BUDGET AND RENDER THROTTLE
   FILE: /world/runtime.js
   VERSION: G1_PLANET_1_RUNTIME_FRAME_BUDGET_AND_RENDER_THROTTLE_TNT_v1

   LAW:
   Runtime owns timing only.
   Runtime does not own terrain, water, land, air, hydration, hexgrid, renderer model, or visual pass.
   Runtime may not force full tri-domain redraw every animation frame.
   Runtime must throttle, skip duplicate loops, respect visibility, and reduce mobile/iframe pressure.
*/

(function attachPlanetOneRuntimeFrameBudget(global) {
  "use strict";

  var VERSION = "G1_PLANET_1_RUNTIME_FRAME_BUDGET_AND_RENDER_THROTTLE_TNT_v1";
  var BASELINE = "PLANET_1_GENERATION_1_CLEAN_SLATE_LOCK_IN_v1";
  var SINGLETON_KEY = "__DGB_PLANET_ONE_RUNTIME_FRAME_BUDGET_SINGLETON__";

  if (global[SINGLETON_KEY] && typeof global[SINGLETON_KEY].destroy === "function") {
    try {
      global[SINGLETON_KEY].destroy("SUPERSEDED_BY_" + VERSION);
    } catch (error) {}
  }

  var state = {
    id: "planet-one-runtime-" + Date.now(),
    active: true,
    destroyed: false,
    running: false,
    paused: false,

    mountTarget: "#planet-one-render",
    seed: 256451,
    source: "world-runtime-frame-budget",

    viewLon: -28,
    viewLat: 0,
    axisTilt: -0.28,
    axisVisible: false,
    speedDegreesPerSecond: 2.4,

    rafId: null,
    rafPending: false,
    lastTickTime: 0,
    lastRenderTime: 0,
    lastRenderViewLon: null,
    lastRenderViewLat: null,
    lastRenderWidth: null,
    lastRenderHeight: null,
    forceNextRender: true,

    frameCount: 0,
    renderCount: 0,
    skippedFrameCount: 0,
    duplicateStartCount: 0,
    hiddenSkipCount: 0,
    dirtySkipCount: 0,
    throttleSkipCount: 0,

    lastRender: null,
    lastError: null,
    lastBudget: null,
    lastReason: null
  };

  function now() {
    return (global.performance && typeof global.performance.now === "function")
      ? global.performance.now()
      : Date.now();
  }

  function normalizeLon(lon) {
    var x = ((Number(lon) + 180) % 360 + 360) % 360 - 180;
    return x === -180 ? 180 : x;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function isMobile() {
    if (!global.navigator) return false;
    return /Android|iPhone|iPad|iPod|Mobile/i.test(global.navigator.userAgent || "");
  }

  function isFramed() {
    try {
      return global.self !== global.top;
    } catch (error) {
      return true;
    }
  }

  function isHidden() {
    return Boolean(global.document && global.document.visibilityState === "hidden");
  }

  function getMountElement() {
    if (!global.document) return null;

    if (state.mountTarget && typeof state.mountTarget !== "string") return state.mountTarget;

    return global.document.querySelector(state.mountTarget || "#planet-one-render") ||
      global.document.getElementById("planet-one-render") ||
      global.document.querySelector("[data-planet-one-mount='true']");
  }

  function getRenderer() {
    return global.DGBPlanetOneRenderTeam ||
      global.DGBPlanetOneRenderer ||
      global.DGBPlanetOneRender ||
      null;
  }

  function getRenderFunction(renderer) {
    if (!renderer) return null;

    return renderer.renderPlanetOne ||
      renderer.mountPlanetOne ||
      renderer.mount ||
      renderer.render ||
      renderer.renderGlobe ||
      renderer.createPlanetOneRender ||
      renderer.createPlanetOneScene ||
      renderer.create ||
      null;
  }

  function getFrameBudget() {
    var mobile = isMobile();
    var framed = isFramed();
    var hidden = isHidden();

    var fps = 20;
    var reason = "desktop-visible";

    if (hidden) {
      fps = 0;
      reason = "hidden-tab";
    } else if (framed) {
      fps = mobile ? 1 : 2;
      reason = "diagnostic-or-iframe-throttle";
    } else if (mobile) {
      fps = 10;
      reason = "mobile-visible";
    }

    if (state.paused || !state.running) {
      fps = 0;
      reason = state.paused ? "paused" : "stopped";
    }

    return {
      fps: fps,
      minIntervalMs: fps > 0 ? 1000 / fps : Infinity,
      mobile: mobile,
      framed: framed,
      hidden: hidden,
      reason: reason
    };
  }

  function getCanvasSize() {
    var mount = getMountElement();
    var canvas = mount && mount.querySelector
      ? mount.querySelector("canvas[data-planet-one-render-canvas='true']")
      : null;

    return {
      width: canvas ? canvas.width : mount ? mount.clientWidth : 0,
      height: canvas ? canvas.height : mount ? mount.clientHeight : 0
    };
  }

  function isDirty() {
    var size = getCanvasSize();
    var mobile = isMobile();
    var lonThreshold = mobile ? 0.18 : 0.08;
    var latThreshold = mobile ? 0.10 : 0.04;

    if (state.forceNextRender) return true;
    if (state.lastRenderViewLon == null || state.lastRenderViewLat == null) return true;

    if (Math.abs(normalizeLon(state.viewLon - state.lastRenderViewLon)) >= lonThreshold) return true;
    if (Math.abs(state.viewLat - state.lastRenderViewLat) >= latThreshold) return true;

    if (size.width !== state.lastRenderWidth || size.height !== state.lastRenderHeight) return true;

    return false;
  }

  function renderOnce(reason) {
    var mount = getMountElement();
    var renderer = getRenderer();
    var renderFn = getRenderFunction(renderer);
    var budget = getFrameBudget();
    var result;

    if (!mount) {
      state.lastError = "NO_PLANET_ONE_MOUNT";
      return null;
    }

    if (!renderer || typeof renderFn !== "function") {
      state.lastError = "NO_RENDERER_FUNCTION";
      return null;
    }

    try {
      result = renderFn.call(renderer, mount, {
        renderMode: "satellite",
        viewLon: state.viewLon,
        viewLat: state.viewLat,
        showAxis: state.axisVisible,
        axisTilt: state.axisTilt,
        compositorScale: budget.mobile ? 0.66 : 0.78,
        surfaceAlpha: 0.99,
        clearMount: false,
        seed: state.seed,
        source: state.source,
        runtimeVersion: VERSION,
        visualPassClaimed: false
      });

      state.renderCount += 1;
      state.lastRenderTime = now();
      state.lastRenderViewLon = state.viewLon;
      state.lastRenderViewLat = state.viewLat;

      var size = getCanvasSize();
      state.lastRenderWidth = size.width;
      state.lastRenderHeight = size.height;

      state.forceNextRender = false;
      state.lastRender = result || null;
      state.lastError = null;
      state.lastReason = reason || "render";
      state.lastBudget = budget;

      return result;
    } catch (error) {
      state.lastError = String(error && error.message ? error.message : error);
      return null;
    }
  }

  function tick(timestamp) {
    var t = Number(timestamp || now());
    var budget;
    var deltaSeconds;
    var due;
    var dirty;

    state.rafPending = false;

    if (state.destroyed || !state.running) return;

    if (!state.lastTickTime) state.lastTickTime = t;
    deltaSeconds = Math.max(0, Math.min(0.25, (t - state.lastTickTime) / 1000));
    state.lastTickTime = t;
    state.frameCount += 1;

    if (!state.paused) {
      state.viewLon = normalizeLon(state.viewLon + state.speedDegreesPerSecond * deltaSeconds);
    }

    budget = getFrameBudget();
    state.lastBudget = budget;

    if (budget.fps <= 0) {
      if (budget.hidden) state.hiddenSkipCount += 1;
      schedule(250);
      return;
    }

    due = t - state.lastRenderTime >= budget.minIntervalMs;
    dirty = isDirty();

    if (due && dirty) {
      renderOnce("budgeted-runtime-frame");
    } else {
      state.skippedFrameCount += 1;
      if (!due) state.throttleSkipCount += 1;
      if (!dirty) state.dirtySkipCount += 1;
    }

    schedule();
  }

  function schedule(delay) {
    if (state.destroyed || !state.running || state.rafPending) return;

    state.rafPending = true;

    if (delay && delay > 0) {
      global.setTimeout(function () {
        if (state.destroyed || !state.running) {
          state.rafPending = false;
          return;
        }

        if (typeof global.requestAnimationFrame === "function") {
          state.rafId = global.requestAnimationFrame(tick);
        } else {
          tick(now());
        }
      }, delay);
      return;
    }

    if (typeof global.requestAnimationFrame === "function") {
      state.rafId = global.requestAnimationFrame(tick);
    } else {
      global.setTimeout(function () { tick(now()); }, 50);
    }
  }

  function start(target, options) {
    options = options || {};

    if (target) state.mountTarget = target;
    if (options.mountTarget) state.mountTarget = options.mountTarget;
    if (options.seed != null) state.seed = Number(options.seed);
    if (options.viewLon != null) state.viewLon = normalizeLon(options.viewLon);
    if (options.viewLat != null) state.viewLat = clamp(options.viewLat, -85, 85);
    if (options.speedDegreesPerSecond != null) state.speedDegreesPerSecond = Number(options.speedDegreesPerSecond);
    if (options.speed != null) state.speedDegreesPerSecond = Number(options.speed);
    if (options.showAxis != null) state.axisVisible = Boolean(options.showAxis);
    if (options.axisVisible != null) state.axisVisible = Boolean(options.axisVisible);
    if (options.source) state.source = String(options.source);

    if (state.running && !state.destroyed) {
      state.duplicateStartCount += 1;
      state.forceNextRender = true;
      renderOnce("duplicate-start-single-render");
      return getStatus();
    }

    state.running = true;
    state.paused = false;
    state.destroyed = false;
    state.lastTickTime = now();
    state.forceNextRender = true;

    renderOnce("runtime-start");
    schedule();

    return getStatus();
  }

  function pause() {
    state.paused = true;
    state.forceNextRender = false;
    return getStatus();
  }

  function resume() {
    state.paused = false;
    state.running = true;
    state.forceNextRender = true;
    state.lastTickTime = now();
    renderOnce("runtime-resume");
    schedule();
    return getStatus();
  }

  function stop(reason) {
    state.running = false;
    state.paused = true;
    state.lastReason = reason || "runtime-stop";

    if (state.rafId && typeof global.cancelAnimationFrame === "function") {
      try { global.cancelAnimationFrame(state.rafId); } catch (error) {}
    }

    state.rafId = null;
    state.rafPending = false;

    return getStatus();
  }

  function destroy(reason) {
    stop(reason || "runtime-destroy");
    state.destroyed = true;
    state.active = false;
    return getStatus();
  }

  function reset() {
    state.viewLon = -28;
    state.viewLat = 0;
    state.axisVisible = false;
    state.speedDegreesPerSecond = Math.abs(state.speedDegreesPerSecond || 2.4);
    state.forceNextRender = true;
    renderOnce("runtime-reset");
    return getStatus();
  }

  function reverse() {
    state.speedDegreesPerSecond = -1 * (state.speedDegreesPerSecond || 2.4);
    state.forceNextRender = true;
    return getStatus();
  }

  function setSpeed(value) {
    state.speedDegreesPerSecond = Number(value) || 0;
    state.forceNextRender = true;
    return getStatus();
  }

  function setView(next) {
    next = next || {};
    if (next.viewLon != null) state.viewLon = normalizeLon(next.viewLon);
    if (next.viewLat != null) state.viewLat = clamp(next.viewLat, -85, 85);
    if (next.axisVisible != null) state.axisVisible = Boolean(next.axisVisible);
    state.forceNextRender = true;
    renderOnce("runtime-set-view");
    return getStatus();
  }

  function getStatus() {
    var renderer = getRenderer();
    var budget = getFrameBudget();

    return {
      ok: true,
      active: state.active,
      VERSION: VERSION,
      version: VERSION,
      baseline: BASELINE,

      runtimeFrameBudgetActive: true,
      renderThrottleActive: true,
      mobileThrottleActive: true,
      dirtyStateGateActive: true,
      duplicateLoopBlocked: true,
      visibilityPauseActive: true,
      gaugeIframeThrottleActive: true,
      runtimeOwnsTimingOnly: true,
      runtimeDoesNotOwnTerrain: true,
      runtimeDoesNotOwnTriDomainModel: true,

      mounted: Boolean(getMountElement()),
      rendererDetected: Boolean(renderer),
      running: state.running,
      paused: state.paused,
      destroyed: state.destroyed,

      viewLon: state.viewLon,
      viewLat: state.viewLat,
      axisTilt: state.axisTilt,
      axisVisible: state.axisVisible,
      speedDegreesPerSecond: state.speedDegreesPerSecond,

      frameCount: state.frameCount,
      renderCount: state.renderCount,
      skippedFrameCount: state.skippedFrameCount,
      duplicateStartCount: state.duplicateStartCount,
      hiddenSkipCount: state.hiddenSkipCount,
      dirtySkipCount: state.dirtySkipCount,
      throttleSkipCount: state.throttleSkipCount,

      currentFrameBudget: budget,
      maxFps: budget.fps,
      minRenderIntervalMs: budget.minIntervalMs,

      lastRender: state.lastRender,
      lastError: state.lastError,
      lastReason: state.lastReason,
      statusAt: new Date().toISOString(),
      visualPassClaimed: false
    };
  }

  function status() {
    return getStatus();
  }

  var api = {
    VERSION: VERSION,
    version: VERSION,
    BASELINE: BASELINE,
    baseline: BASELINE,

    start: start,
    pause: pause,
    resume: resume,
    stop: stop,
    destroy: destroy,
    reset: reset,
    reverse: reverse,
    setSpeed: setSpeed,
    setView: setView,
    renderOnce: renderOnce,

    getStatus: getStatus,
    status: status
  };

  global[SINGLETON_KEY] = api;
  global.DGBWorldRuntime = api;
  global.DGBPlanetOneRuntime = api;

  if (global.document) {
    global.document.addEventListener("visibilitychange", function () {
      state.forceNextRender = true;
      if (!isHidden() && state.running && !state.paused) {
        renderOnce("visibility-return");
        schedule();
      }
    });
  }

  try {
    global.dispatchEvent(new CustomEvent("dgb:planet-one:runtime-frame-budget-ready", {
      detail: getStatus()
    }));
  } catch (error) {}
})(typeof window !== "undefined" ? window : globalThis);

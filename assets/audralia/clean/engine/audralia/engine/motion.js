// /assets/audralia/clean/engine/audralia/engine/motion.js
// AUDRALIA_G2_5_MOTION_CHILD_INSPECTION_SAFE_NOOP_TNT_v1
// Full-file replacement.
// Purpose: neutralize the motion child so it cannot move, scale, zoom, drift, orbit, resize, or reposition Audralia during inspection.
// Classic script. No imports. No exports.
// Does not own: parent geometry, drag controls, canvas sizing, render loop, route bridge, runtime, HTML, continents, sky, generated image, GraphicBox, or visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_5_MOTION_CHILD_INSPECTION_SAFE_NOOP_TNT_v1";
  const FAMILY = "AUDRALIA_G2_5_EXISTING_ARCHITECTURE_PATH_ALIGNMENT_TNT_v1";
  const TARGET = "/assets/audralia/clean/engine/audralia/engine/motion.js";
  const ROUTE = "/showroom/globe/audralia/";

  const state = {
    contract: CONTRACT,
    family: FAMILY,
    target: TARGET,
    route: ROUTE,
    active: true,
    classicScript: true,
    inspectionSafeNoop: true,
    noAutoMotion: true,
    noZoom: true,
    noScale: true,
    noCenterMutation: true,
    noGeometryMutation: true,
    noLoop: true,
    noPointerHandlers: true,
    noCanvasMutation: true,
    noMountMutation: true,
    noTransformMutation: true,
    globalPublished: false,
    mountCalled: false,
    initCalled: false,
    frameCalls: 0,
    updateCalls: 0,
    drawCalls: 0,
    lastScope: "module-load",
    errors: []
  };

  function hasWindow() {
    return typeof window !== "undefined";
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

  function safeScope(scope) {
    state.lastScope = scope;
    publishReceipt(scope);
    return api;
  }

  function mount() {
    state.mountCalled = true;
    return safeScope("mount-noop");
  }

  function init() {
    state.initCalled = true;
    return safeScope("init-noop");
  }

  function setup() {
    return safeScope("setup-noop");
  }

  function boot() {
    return safeScope("boot-noop");
  }

  function create() {
    return safeScope("create-noop");
  }

  function frame() {
    state.frameCalls += 1;
    return safeScope("frame-noop");
  }

  function tick() {
    state.frameCalls += 1;
    return safeScope("tick-noop");
  }

  function step() {
    state.frameCalls += 1;
    return safeScope("step-noop");
  }

  function update() {
    state.updateCalls += 1;
    return safeScope("update-noop");
  }

  function draw() {
    state.drawCalls += 1;
    return safeScope("draw-noop");
  }

  function render() {
    state.drawCalls += 1;
    return safeScope("render-noop");
  }

  function paint() {
    state.drawCalls += 1;
    return safeScope("paint-noop");
  }

  function requestRender() {
    return safeScope("requestRender-noop");
  }

  function destroy() {
    return safeScope("destroy-noop");
  }

  function getStatus() {
    return {
      contract: CONTRACT,
      family: FAMILY,
      target: TARGET,
      route: ROUTE,
      active: true,
      classicScript: true,
      inspectionSafeNoop: true,
      noAutoMotion: true,
      noZoom: true,
      noScale: true,
      noCenterMutation: true,
      noGeometryMutation: true,
      noLoop: true,
      noPointerHandlers: true,
      noCanvasMutation: true,
      noMountMutation: true,
      noTransformMutation: true,
      globalPublished: state.globalPublished,
      mountCalled: state.mountCalled,
      initCalled: state.initCalled,
      frameCalls: state.frameCalls,
      updateCalls: state.updateCalls,
      drawCalls: state.drawCalls,
      owns: [
        "safe no-op receipt",
        "future motion placeholder only"
      ],
      doesNotOwn: [
        "cx",
        "cy",
        "radius",
        "scale",
        "zoom",
        "depth",
        "camera distance",
        "canvas width",
        "canvas height",
        "canvas style",
        "mount style",
        "pointer handlers",
        "animation loops",
        "parent render loop",
        "parent projection",
        "parent geometry",
        "parent requestRender",
        "drag controls"
      ],
      visualPassClaim: false,
      errors: state.errors.slice()
    };
  }

  function publishReceipt(scope = "publish") {
    if (!hasWindow()) return;

    const receipt = {
      contract: CONTRACT,
      family: FAMILY,
      target: TARGET,
      route: ROUTE,
      mode: "motion_child_inspection_safe_noop",
      scope,
      active: true,
      classicScript: true,
      inspectionSafeNoop: true,
      noAutoMotion: true,
      noZoom: true,
      noScale: true,
      noCenterMutation: true,
      noGeometryMutation: true,
      noLoop: true,
      noPointerHandlers: true,
      noCanvasMutation: true,
      noMountMutation: true,
      noTransformMutation: true,
      formVisibleClaim: false,
      visualPassClaim: false,
      generatedImage: false,
      graphicBox: false,
      globalPublished: state.globalPublished,
      mountCalled: state.mountCalled,
      initCalled: state.initCalled,
      frameCalls: state.frameCalls,
      updateCalls: state.updateCalls,
      drawCalls: state.drawCalls,
      errors: state.errors.slice()
    };

    window.AUDRALIA_MOTION_RECEIPT = receipt;
    window.AUDRALIA_CLEAN_MOTION_RECEIPT = receipt;
    window.AUDRALIA_CLEAN_CANVAS_MOTION_RECEIPT = receipt;

    try {
      window.dispatchEvent(
        new CustomEvent("audralia:motion:receipt", { detail: receipt })
      );
    } catch (_error) {
      try {
        window.dispatchEvent(new Event("audralia:motion:receipt"));
      } catch (_ignored) {}
    }
  }

  const api = {
    CONTRACT,
    FAMILY,
    TARGET,
    ROUTE,
    mount,
    init,
    setup,
    boot,
    create,
    frame,
    tick,
    step,
    update,
    draw,
    render,
    paint,
    requestRender,
    destroy,
    getStatus,
    status: getStatus
  };

  if (hasWindow()) {
    window.AUDRALIA_CLEAN_MOTION_ENGINE = api;
    window.AUDRALIA_MOTION_ENGINE = api;
    window.AUDRALIA_CLEAN_CANVAS_MOTION = api;

    window.AudraliaMotionEngine = api;
    window.AudraliaMotion = api;
    window.audraliaMotion = api;

    window.AUDRALIA_MOTION_INSPECTION_SAFE_NOOP_ACTIVE = true;
    window.AUDRALIA_MOTION_NO_AUTO_MOTION = true;
    window.AUDRALIA_MOTION_NO_ZOOM = true;
    window.AUDRALIA_MOTION_NO_SCALE = true;
    window.AUDRALIA_MOTION_NO_CENTER_MUTATION = true;
    window.AUDRALIA_MOTION_NO_GEOMETRY_MUTATION = true;
    window.AUDRALIA_MOTION_NO_LOOP = true;

    state.globalPublished = true;
    publishReceipt("module-load");
  }
})();

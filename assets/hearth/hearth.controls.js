// /assets/hearth/hearth.controls.js
// HEARTH_G4_DRAG_SPIN_FINGER_SENSITIVITY_CONTROLS_TNT_v1
// Full-file replacement / new file.
// Controls own input only: drag sensor, spin sensor, finger sensitivity,
// pointer capture, touch binding, wheel input, and flick velocity.
// Controls feed runtime. Controls do not draw. Controls do not hold truth.
// No GraphicBox. No generated image. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G4_DRAG_SPIN_FINGER_SENSITIVITY_CONTROLS_TNT_v1";
  const RECEIPT = "HEARTH_G4_CONTROLS_INPUT_FEED_RECEIPT";
  const VERSION = "2026-05-09.hearth-g4-controls-drag-spin-finger-sensitivity-v1";
  const TAU = Math.PI * 2;

  const bindings = new WeakMap();

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function isElement(value) {
    return typeof Element !== "undefined" && value instanceof Element;
  }

  function resolveRuntime(runtime) {
    return runtime || window.HEARTH_RUNTIME || null;
  }

  function getWidth(element) {
    const rect = element && element.getBoundingClientRect ? element.getBoundingClientRect() : null;
    return Math.max(1, rect && rect.width ? rect.width : element.clientWidth || window.innerWidth || 1);
  }

  function styleInteractive(element) {
    if (!element || !element.style) return;

    element.style.pointerEvents = "auto";
    element.style.touchAction = "none";
    element.style.userSelect = "none";
    element.style.webkitUserSelect = "none";
    element.style.webkitTouchCallout = "none";

    element.dataset.hearthControlsPointerEvents = "auto";
    element.dataset.hearthControlsTouchAction = "none";
  }

  function bind(canvas, runtimeArg, options = {}) {
    const runtime = resolveRuntime(runtimeArg);

    if (!isElement(canvas)) {
      throw new Error(`${CONTRACT}: bind requires a canvas or element target.`);
    }

    if (!runtime || typeof runtime.dragStart !== "function") {
      throw new Error(`${CONTRACT}: runtime motion authority missing.`);
    }

    if (bindings.has(canvas)) {
      return bindings.get(canvas).api;
    }

    const eventTarget = isElement(options.mount) ? options.mount : canvas;
    const dragRadiansPerScreen = Number.isFinite(options.dragRadiansPerScreen)
      ? options.dragRadiansPerScreen
      : TAU * 1.95;
    const wheelSensitivity = Number.isFinite(options.wheelSensitivity)
      ? options.wheelSensitivity
      : 0.0025;
    const maxSpinVelocity = Number.isFinite(options.maxSpinVelocity)
      ? options.maxSpinVelocity
      : 10;

    const state = {
      active: false,
      pointerId: null,
      lastX: 0,
      lastY: 0,
      lastTime: 0,
      velocity: 0
    };

    styleInteractive(canvas);
    styleInteractive(eventTarget);

    function stamp(status) {
      document.documentElement.dataset.hearthControlsLoaded = "true";
      document.documentElement.dataset.hearthControlsContract = CONTRACT;
      document.documentElement.dataset.hearthControlsReceipt = RECEIPT;
      document.documentElement.dataset.hearthControlsVersion = VERSION;
      document.documentElement.dataset.hearthControlsStatus = status;
      document.documentElement.dataset.hearthControlsAuthority = "drag-spin-finger-sensitivity-input-feed";
      document.documentElement.dataset.hearthControlsFeedsRuntime = "true";
      document.documentElement.dataset.hearthControlsDraws = "false";
      document.documentElement.dataset.hearthControlsHoldsTruth = "false";

      canvas.dataset.hearthControlsBound = "true";
      canvas.dataset.hearthDragSensor = "true";
      canvas.dataset.hearthSpinSensor = "true";
      canvas.dataset.hearthFingerSensitivity = String(dragRadiansPerScreen);
      canvas.dataset.hearthTouchAction = "none";
      canvas.dataset.hearthPointerEvents = "auto";

      window.HEARTH_CONTROLS_RECEIPT = Object.freeze({
        contract: CONTRACT,
        receipt: RECEIPT,
        version: VERSION,
        authority: "drag-spin-finger-sensitivity-input-feed",
        feedsRuntime: true,
        draws: false,
        holdsTruth: false,
        generatedImage: false,
        graphicBox: false,
        visualPassClaimed: false,
        status
      });
    }

    function pointerDown(event) {
      event.preventDefault();

      state.active = true;
      state.pointerId = event.pointerId;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      state.lastTime = performance.now();
      state.velocity = 0;

      runtime.dragStart();

      try {
        eventTarget.setPointerCapture(event.pointerId);
      } catch (_) {}

      canvas.dataset.hearthControlState = "drag-active";
      stamp("drag-active");
    }

    function pointerMove(event) {
      if (!state.active || event.pointerId !== state.pointerId) return;
      event.preventDefault();

      const now = performance.now();
      const dx = event.clientX - state.lastX;
      const dt = Math.max(8, now - state.lastTime);
      const width = getWidth(eventTarget);
      const deltaRadians = (dx / width) * dragRadiansPerScreen;
      const velocity = clamp(deltaRadians / (dt / 1000), -maxSpinVelocity, maxSpinVelocity);

      state.lastX = event.clientX;
      state.lastY = event.clientY;
      state.lastTime = now;
      state.velocity = velocity;

      runtime.dragMove(deltaRadians, velocity);

      canvas.dataset.hearthControlState = "drag-moving";
      canvas.dataset.hearthDragDeltaRadians = deltaRadians.toFixed(5);
      canvas.dataset.hearthSpinVelocity = velocity.toFixed(5);
    }

    function pointerUp(event) {
      if (!state.active || event.pointerId !== state.pointerId) return;
      event.preventDefault();

      state.active = false;
      state.pointerId = null;

      runtime.setSpinVelocity(state.velocity);
      runtime.dragEnd();

      try {
        eventTarget.releasePointerCapture(event.pointerId);
      } catch (_) {}

      canvas.dataset.hearthControlState = "spin-inertia";
      canvas.dataset.hearthSpinVelocity = state.velocity.toFixed(5);
      stamp("spin-inertia");
    }

    function wheel(event) {
      event.preventDefault();

      const delta = clamp(event.deltaY || 0, -160, 160);
      const velocity = clamp(-delta * wheelSensitivity, -maxSpinVelocity, maxSpinVelocity);

      runtime.addSpin(velocity);

      canvas.dataset.hearthControlState = "wheel-spin";
      canvas.dataset.hearthWheelSpinVelocity = velocity.toFixed(5);
      stamp("wheel-spin");
    }

    function dispose() {
      eventTarget.removeEventListener("pointerdown", pointerDown);
      eventTarget.removeEventListener("pointermove", pointerMove);
      eventTarget.removeEventListener("pointerup", pointerUp);
      eventTarget.removeEventListener("pointercancel", pointerUp);
      eventTarget.removeEventListener("wheel", wheel);
      bindings.delete(canvas);
      stamp("disposed");
    }

    eventTarget.addEventListener("pointerdown", pointerDown, { passive: false });
    eventTarget.addEventListener("pointermove", pointerMove, { passive: false });
    eventTarget.addEventListener("pointerup", pointerUp, { passive: false });
    eventTarget.addEventListener("pointercancel", pointerUp, { passive: false });
    eventTarget.addEventListener("wheel", wheel, { passive: false });

    const api = Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      canvas,
      eventTarget,
      dispose
    });

    bindings.set(canvas, { api, dispose });

    window.__HEARTH_CONTROLS_DISPOSE__ = dispose;

    stamp("bound");
    return api;
  }

  function disposeAll() {
    window.__HEARTH_CONTROLS_DISPOSE__ && window.__HEARTH_CONTROLS_DISPOSE__();
  }

  window.HEARTH_CONTROLS = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    bind,
    disposeAll
  });

  document.documentElement.dataset.hearthControlsLoaded = "true";
  document.documentElement.dataset.hearthControlsContract = CONTRACT;
  document.documentElement.dataset.hearthControlsReceipt = RECEIPT;
  document.documentElement.dataset.hearthControlsVersion = VERSION;
})();

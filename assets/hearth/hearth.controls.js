// /assets/hearth/hearth.controls.js
// HEARTH_G4_DRAG_SPIN_FINGER_SENSITIVITY_CONTROLS_TNT_v2

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G4_DRAG_SPIN_FINGER_SENSITIVITY_CONTROLS_TNT_v2";
  const RECEIPT = "HEARTH_G4_CONTROLS_INPUT_FEED_RECEIPT";
  const TAU = Math.PI * 2;

  const bindings = new WeakMap();

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function widthOf(element) {
    const rect = element.getBoundingClientRect();
    return Math.max(1, rect.width || element.clientWidth || window.innerWidth || 1);
  }

  function applyTouchSurface(element) {
    element.style.pointerEvents = "auto";
    element.style.touchAction = "none";
    element.style.userSelect = "none";
    element.style.webkitUserSelect = "none";
    element.style.webkitTouchCallout = "none";
    element.dataset.hearthPointerEvents = "auto";
    element.dataset.hearthTouchAction = "none";
  }

  function bind(canvas, runtime, options = {}) {
    if (!canvas || !runtime) {
      throw new Error(`${CONTRACT}: canvas and runtime are required.`);
    }

    if (bindings.has(canvas)) {
      return bindings.get(canvas).api;
    }

    const target = options.mount || canvas;
    const dragRadiansPerScreen = Number.isFinite(options.dragRadiansPerScreen)
      ? options.dragRadiansPerScreen
      : TAU * 2.0;
    const maxSpinVelocity = Number.isFinite(options.maxSpinVelocity)
      ? options.maxSpinVelocity
      : 11;
    const wheelSensitivity = Number.isFinite(options.wheelSensitivity)
      ? options.wheelSensitivity
      : 0.003;

    const local = {
      active: false,
      pointerId: null,
      lastX: 0,
      lastY: 0,
      lastTime: 0,
      velocity: 0
    };

    applyTouchSurface(target);
    applyTouchSurface(canvas);

    function stamp(status) {
      document.documentElement.dataset.hearthControlsLoaded = "true";
      document.documentElement.dataset.hearthControlsContract = CONTRACT;
      document.documentElement.dataset.hearthControlsReceipt = RECEIPT;
      document.documentElement.dataset.hearthControlsStatus = status;
      document.documentElement.dataset.hearthControlsAuthority = "drag-spin-finger-sensitivity";
      document.documentElement.dataset.hearthControlsFeedsRuntime = "true";
      document.documentElement.dataset.hearthControlsDraws = "false";
      document.documentElement.dataset.hearthControlsHoldsTruth = "false";

      canvas.dataset.hearthControlsBound = "true";
      canvas.dataset.hearthDragSensor = "true";
      canvas.dataset.hearthSpinSensor = "true";
      canvas.dataset.hearthFingerSensitivity = String(dragRadiansPerScreen);

      window.HEARTH_CONTROLS_RECEIPT = Object.freeze({
        contract: CONTRACT,
        receipt: RECEIPT,
        authority: "drag-spin-finger-sensitivity",
        feedsRuntime: true,
        draws: false,
        holdsTruth: false,
        generatedImage: false,
        graphicBox: false,
        visualPassClaimed: false,
        status
      });
    }

    function down(event) {
      event.preventDefault();

      local.active = true;
      local.pointerId = event.pointerId;
      local.lastX = event.clientX;
      local.lastY = event.clientY;
      local.lastTime = performance.now();
      local.velocity = 0;

      runtime.dragStart();

      try { target.setPointerCapture(event.pointerId); } catch (_) {}

      canvas.dataset.hearthControlState = "drag-active";
      stamp("drag-active");
    }

    function move(event) {
      if (!local.active || event.pointerId !== local.pointerId) return;
      event.preventDefault();

      const now = performance.now();
      const dx = event.clientX - local.lastX;
      const dt = Math.max(8, now - local.lastTime);
      const deltaRadians = (dx / widthOf(target)) * dragRadiansPerScreen;
      const velocity = clamp(deltaRadians / (dt / 1000), -maxSpinVelocity, maxSpinVelocity);

      local.lastX = event.clientX;
      local.lastY = event.clientY;
      local.lastTime = now;
      local.velocity = velocity;

      runtime.dragMove(deltaRadians, velocity);

      canvas.dataset.hearthControlState = "drag-moving";
      canvas.dataset.hearthSpinVelocity = velocity.toFixed(5);
    }

    function up(event) {
      if (!local.active || event.pointerId !== local.pointerId) return;
      event.preventDefault();

      local.active = false;
      local.pointerId = null;

      runtime.setSpinVelocity(local.velocity);
      runtime.dragEnd();

      try { target.releasePointerCapture(event.pointerId); } catch (_) {}

      canvas.dataset.hearthControlState = "spin-inertia";
      canvas.dataset.hearthSpinVelocity = local.velocity.toFixed(5);
      stamp("spin-inertia");
    }

    function wheel(event) {
      event.preventDefault();

      const delta = clamp(event.deltaY || 0, -180, 180);
      const velocity = clamp(-delta * wheelSensitivity, -maxSpinVelocity, maxSpinVelocity);

      runtime.addSpin(velocity);

      canvas.dataset.hearthControlState = "wheel-spin";
      canvas.dataset.hearthWheelVelocity = velocity.toFixed(5);
      stamp("wheel-spin");
    }

    function dispose() {
      target.removeEventListener("pointerdown", down);
      target.removeEventListener("pointermove", move);
      target.removeEventListener("pointerup", up);
      target.removeEventListener("pointercancel", up);
      target.removeEventListener("wheel", wheel);
      bindings.delete(canvas);
      stamp("disposed");
    }

    target.addEventListener("pointerdown", down, { passive: false });
    target.addEventListener("pointermove", move, { passive: false });
    target.addEventListener("pointerup", up, { passive: false });
    target.addEventListener("pointercancel", up, { passive: false });
    target.addEventListener("wheel", wheel, { passive: false });

    const api = Object.freeze({ contract: CONTRACT, receipt: RECEIPT, dispose });
    bindings.set(canvas, { api, dispose });

    window.__HEARTH_CONTROLS_DISPOSE__ = dispose;

    stamp("bound");
    return api;
  }

  window.HEARTH_CONTROLS = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    bind
  });

  document.documentElement.dataset.hearthControlsLoaded = "true";
  document.documentElement.dataset.hearthControlsContract = CONTRACT;
  document.documentElement.dataset.hearthControlsReceipt = RECEIPT;
})();

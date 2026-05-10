// /assets/hearth/hearth.controls.js
// HEARTH_G2_FREE_DRAG_POLE_SWIVEL_PRESERVATION_CONTROLS_TNT_v2
// Full-file replacement.
// Controls authority only.
// Adds north/south pole swivel by consuming dy.
// Preserves horizontal drag/spin.
// Runtime remains motion authority.
// No GraphicBox. No generated image. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G2_FREE_DRAG_POLE_SWIVEL_PRESERVATION_CONTROLS_TNT_v2";
  const RECEIPT = "HEARTH_G2_FREE_DRAG_POLE_SWIVEL_PRESERVATION_CONTROLS_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "HEARTH_G4_DRAG_SPIN_FINGER_SENSITIVITY_CONTROLS_TNT_v2";

  const TAU = Math.PI * 2;
  const PHYSICAL_AXIS_DEG = 23.44;
  const PHYSICAL_AXIS_RAD = (PHYSICAL_AXIS_DEG * Math.PI) / 180;
  const MAX_POLE_SWIVEL_RAD = (78 * Math.PI) / 180;
  const bindings = new WeakMap();

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function now() {
    return typeof performance !== "undefined" ? performance.now() : Date.now();
  }

  function sizeOf(element, axis) {
    const rect = element.getBoundingClientRect();
    const value = axis === "x" ? rect.width || element.clientWidth : rect.height || element.clientHeight;
    return Math.max(1, value || window.innerWidth || 1);
  }

  function publish(detail) {
    const motion = Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      physicalAxisRadians: PHYSICAL_AXIS_RAD,
      physicalAxisDeg: PHYSICAL_AXIS_DEG,
      controlsAuthority: true,
      runtimeMotionOnly: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      ...detail
    });

    window.__HEARTH_INSPECTION_MOTION__ = motion;

    try {
      window.dispatchEvent(new CustomEvent("hearth:control-motion", { detail: motion }));
    } catch (_) {}
  }

  function bind(canvas, runtime, options = {}) {
    if (!canvas || !runtime) throw new Error(`${CONTRACT}: canvas and runtime are required.`);

    if (bindings.has(canvas)) return bindings.get(canvas).api;

    const target = options.mount || canvas;
    const dragRadiansPerScreen = Number.isFinite(options.dragRadiansPerScreen) ? options.dragRadiansPerScreen : TAU * 2.45;
    const poleRadiansPerScreen = Number.isFinite(options.poleRadiansPerScreen) ? options.poleRadiansPerScreen : Math.PI * 1.18;
    const maxSpinVelocity = Number.isFinite(options.maxSpinVelocity) ? options.maxSpinVelocity : 13;
    const wheelSensitivity = Number.isFinite(options.wheelSensitivity) ? options.wheelSensitivity : 0.003;
    const lockDelayMs = Number.isFinite(options.lockDelayMs) ? options.lockDelayMs : 2400;
    const poleReturnStrength = Number.isFinite(options.poleReturnStrength) ? options.poleReturnStrength : 0.06;

    const local = {
      active: false,
      pointerId: null,
      lastX: 0,
      lastY: 0,
      lastTime: 0,
      velocity: 0,
      poleSwivel: 0,
      poleVelocity: 0,
      releaseTime: 0,
      returnRaf: 0,
      disposed: false
    };

    [target, canvas].forEach((el) => {
      el.style.pointerEvents = "auto";
      el.style.touchAction = "none";
      el.style.userSelect = "none";
      el.style.webkitUserSelect = "none";
      el.style.webkitTouchCallout = "none";
    });

    function stamp(status) {
      document.documentElement.dataset.hearthControlsLoaded = "true";
      document.documentElement.dataset.hearthControlsContract = CONTRACT;
      document.documentElement.dataset.hearthControlsReceipt = RECEIPT;
      document.documentElement.dataset.hearthControlsPreviousContract = PREVIOUS_CONTRACT;
      document.documentElement.dataset.hearthPoleSwivel = "true";
      canvas.dataset.hearthControlsBound = "true";
      canvas.dataset.hearthPoleSwivel = "true";
      canvas.dataset.hearthInspectionTiltRadians = local.poleSwivel.toFixed(5);
      window.HEARTH_CONTROLS_RECEIPT = Object.freeze({
        contract: CONTRACT,
        receipt: RECEIPT,
        previousContract: PREVIOUS_CONTRACT,
        status,
        poleSwivel: true,
        generatedImage: false,
        graphicBox: false,
        visualPassClaimed: false
      });
    }

    function stopReturn() {
      if (local.returnRaf) cancelAnimationFrame(local.returnRaf);
      local.returnRaf = 0;
    }

    function emit(status) {
      canvas.dataset.hearthControlState = status;
      canvas.dataset.hearthInspectionTiltRadians = local.poleSwivel.toFixed(5);
      publish({
        status,
        pointerActive: local.active,
        inspectionTiltRadians: local.poleSwivel,
        poleSwivelRadians: local.poleSwivel,
        poleVelocity: local.poleVelocity,
        poleInspectionActive: Math.abs(local.poleSwivel) > 0.01
      });
      stamp(status);
    }

    function returnAxis() {
      if (local.disposed || local.active) return;

      if (now() - local.releaseTime < lockDelayMs) {
        local.returnRaf = requestAnimationFrame(returnAxis);
        return;
      }

      local.poleSwivel *= 1 - poleReturnStrength;

      if (Math.abs(local.poleSwivel) < 0.002) {
        local.poleSwivel = 0;
        local.poleVelocity = 0;
        emit("axis-returned");
        return;
      }

      local.poleVelocity = -local.poleSwivel * poleReturnStrength;
      emit("soft-axis-return");
      local.returnRaf = requestAnimationFrame(returnAxis);
    }

    function down(event) {
      event.preventDefault();
      stopReturn();

      local.active = true;
      local.pointerId = event.pointerId;
      local.lastX = event.clientX;
      local.lastY = event.clientY;
      local.lastTime = now();
      local.velocity = 0;
      local.poleVelocity = 0;

      if (typeof runtime.dragStart === "function") runtime.dragStart();

      try {
        target.setPointerCapture(event.pointerId);
      } catch (_) {}

      emit("drag-active");
    }

    function move(event) {
      if (!local.active || event.pointerId !== local.pointerId) return;
      event.preventDefault();

      const current = now();
      const dx = event.clientX - local.lastX;
      const dy = event.clientY - local.lastY;
      const dt = Math.max(8, current - local.lastTime);

      const deltaRadians = (dx / sizeOf(target, "x")) * dragRadiansPerScreen;
      const velocity = clamp(deltaRadians / (dt / 1000), -maxSpinVelocity, maxSpinVelocity);
      const poleDelta = (dy / sizeOf(target, "y")) * poleRadiansPerScreen;
      const poleVelocity = clamp(poleDelta / (dt / 1000), -10, 10);

      local.lastX = event.clientX;
      local.lastY = event.clientY;
      local.lastTime = current;
      local.velocity = velocity;
      local.poleSwivel = clamp(local.poleSwivel + poleDelta, -MAX_POLE_SWIVEL_RAD, MAX_POLE_SWIVEL_RAD);
      local.poleVelocity = poleVelocity;

      if (typeof runtime.dragMove === "function") runtime.dragMove(deltaRadians, velocity);

      canvas.dataset.hearthSpinVelocity = velocity.toFixed(5);
      emit("drag-moving");
    }

    function up(event) {
      if (!local.active || event.pointerId !== local.pointerId) return;
      event.preventDefault();

      local.active = false;
      local.pointerId = null;
      local.releaseTime = now();

      if (typeof runtime.setSpinVelocity === "function") runtime.setSpinVelocity(local.velocity);
      if (typeof runtime.dragEnd === "function") runtime.dragEnd();

      try {
        target.releasePointerCapture(event.pointerId);
      } catch (_) {}

      emit("spin-inertia-pole-hold");
      stopReturn();
      local.returnRaf = requestAnimationFrame(returnAxis);
    }

    function wheel(event) {
      event.preventDefault();
      const velocity = clamp(-(event.deltaY || 0) * wheelSensitivity, -maxSpinVelocity, maxSpinVelocity);
      if (typeof runtime.addSpin === "function") runtime.addSpin(velocity);
      emit("wheel-spin");
    }

    function dispose() {
      local.disposed = true;
      stopReturn();
      target.removeEventListener("pointerdown", down);
      target.removeEventListener("pointermove", move);
      target.removeEventListener("pointerup", up);
      target.removeEventListener("pointercancel", up);
      target.removeEventListener("pointerleave", up);
      target.removeEventListener("wheel", wheel);
      bindings.delete(canvas);
      emit("disposed");
    }

    target.addEventListener("pointerdown", down, { passive: false });
    target.addEventListener("pointermove", move, { passive: false });
    target.addEventListener("pointerup", up, { passive: false });
    target.addEventListener("pointercancel", up, { passive: false });
    target.addEventListener("pointerleave", up, { passive: false });
    target.addEventListener("wheel", wheel, { passive: false });

    const api = Object.freeze({ contract: CONTRACT, receipt: RECEIPT, dispose });
    bindings.set(canvas, { api, dispose });
    window.__HEARTH_CONTROLS_DISPOSE__ = dispose;

    emit("bound");
    return api;
  }

  window.HEARTH_CONTROLS = Object.freeze({ contract: CONTRACT, receipt: RECEIPT, previousContract: PREVIOUS_CONTRACT, bind });
  document.documentElement.dataset.hearthControlsLoaded = "true";
  document.documentElement.dataset.hearthControlsContract = CONTRACT;
  document.documentElement.dataset.hearthControlsReceipt = RECEIPT;
})();

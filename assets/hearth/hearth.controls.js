// /assets/hearth/hearth.controls.js
// HEARTH_G2_FREE_DRAG_POLE_SWIVEL_PRESERVATION_CONTROLS_TNT_v1
// Full-file replacement.
// Controls authority only.
// Preserves Hearth's current working drag/spin behavior.
// Adds north/south pole swivel inspection without changing runtime, assets, route, or HTML.
// Runtime remains motion authority.
// Controls feed drag, spin, finger sensitivity, inspection tilt, and soft axis return.
// No GraphicBox. No generated image. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G2_FREE_DRAG_POLE_SWIVEL_PRESERVATION_CONTROLS_TNT_v1";
  const RECEIPT = "HEARTH_G2_FREE_DRAG_POLE_SWIVEL_PRESERVATION_CONTROLS_RECEIPT";
  const PREVIOUS_CONTRACT = "HEARTH_G4_DRAG_SPIN_FINGER_SENSITIVITY_CONTROLS_TNT_v2";

  const TAU = Math.PI * 2;
  const PHYSICAL_AXIS_DEG = 23.44;
  const PHYSICAL_AXIS_RAD = PHYSICAL_AXIS_DEG * Math.PI / 180;
  const MAX_POLE_SWIVEL_RAD = 78 * Math.PI / 180;

  const bindings = new WeakMap();

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function now() {
    return typeof performance !== "undefined" ? performance.now() : Date.now();
  }

  function widthOf(element) {
    const rect = element.getBoundingClientRect();
    return Math.max(1, rect.width || element.clientWidth || window.innerWidth || 1);
  }

  function heightOf(element) {
    const rect = element.getBoundingClientRect();
    return Math.max(1, rect.height || element.clientHeight || window.innerHeight || 1);
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

  function dispatchMotion(detail) {
    window.__HEARTH_INSPECTION_MOTION__ = Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      ...detail,
      physicalAxisRadians: PHYSICAL_AXIS_RAD,
      physicalAxisDeg: PHYSICAL_AXIS_DEG,
      runtimeMotionOnly: true,
      controlsAuthority: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });

    try {
      window.dispatchEvent(new CustomEvent("hearth:control-motion", {
        detail: window.__HEARTH_INSPECTION_MOTION__
      }));
    } catch (_) {}
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
      : TAU * 2.35;

    const poleRadiansPerScreen = Number.isFinite(options.poleRadiansPerScreen)
      ? options.poleRadiansPerScreen
      : Math.PI * 1.12;

    const maxSpinVelocity = Number.isFinite(options.maxSpinVelocity)
      ? options.maxSpinVelocity
      : 12.5;

    const wheelSensitivity = Number.isFinite(options.wheelSensitivity)
      ? options.wheelSensitivity
      : 0.003;

    const lockDelayMs = Number.isFinite(options.lockDelayMs)
      ? options.lockDelayMs
      : 2300;

    const poleReturnStrength = Number.isFinite(options.poleReturnStrength)
      ? options.poleReturnStrength
      : 0.075;

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

    applyTouchSurface(target);
    applyTouchSurface(canvas);

    function stamp(status) {
      document.documentElement.dataset.hearthControlsLoaded = "true";
      document.documentElement.dataset.hearthControlsContract = CONTRACT;
      document.documentElement.dataset.hearthControlsReceipt = RECEIPT;
      document.documentElement.dataset.hearthControlsPreviousContract = PREVIOUS_CONTRACT;
      document.documentElement.dataset.hearthControlsStatus = status;
      document.documentElement.dataset.hearthControlsAuthority = "drag-spin-finger-sensitivity-pole-swivel";
      document.documentElement.dataset.hearthControlsFeedsRuntime = "true";
      document.documentElement.dataset.hearthPoleSwivel = "true";
      document.documentElement.dataset.hearthPhysicalAxisDeg = String(PHYSICAL_AXIS_DEG);
      document.documentElement.dataset.hearthControlsDraws = "false";
      document.documentElement.dataset.hearthControlsHoldsTruth = "false";

      canvas.dataset.hearthControlsBound = "true";
      canvas.dataset.hearthDragSensor = "true";
      canvas.dataset.hearthSpinSensor = "true";
      canvas.dataset.hearthPoleSwivel = "true";
      canvas.dataset.hearthFingerSensitivity = String(dragRadiansPerScreen);
      canvas.dataset.hearthPoleSensitivity = String(poleRadiansPerScreen);
      canvas.dataset.hearthInspectionTiltRadians = local.poleSwivel.toFixed(5);

      window.HEARTH_CONTROLS_RECEIPT = Object.freeze({
        contract: CONTRACT,
        receipt: RECEIPT,
        previousContract: PREVIOUS_CONTRACT,
        authority: "drag-spin-finger-sensitivity-pole-swivel",
        feedsRuntime: true,
        draws: false,
        holdsTruth: false,
        physicalAxisDeg: PHYSICAL_AXIS_DEG,
        maxPoleSwivelDeg: 78,
        generatedImage: false,
        graphicBox: false,
        visualPassClaimed: false,
        status
      });
    }

    function stopReturn() {
      if (local.returnRaf) {
        cancelAnimationFrame(local.returnRaf);
        local.returnRaf = 0;
      }
    }

    function publish(status) {
      canvas.dataset.hearthControlState = status;
      canvas.dataset.hearthInspectionTiltRadians = local.poleSwivel.toFixed(5);
      canvas.dataset.hearthPoleVelocity = local.poleVelocity.toFixed(5);

      dispatchMotion({
        status,
        pointerActive: local.active,
        inspectionTiltRadians: local.poleSwivel,
        poleSwivelRadians: local.poleSwivel,
        poleVelocity: local.poleVelocity,
        poleInspectionActive: Math.abs(local.poleSwivel) > 0.01,
        physicalAxisRadians: PHYSICAL_AXIS_RAD
      });
    }

    function returnTowardAxis() {
      if (local.disposed || local.active) return;

      const elapsedSinceRelease = now() - local.releaseTime;
      if (elapsedSinceRelease < lockDelayMs) {
        local.returnRaf = requestAnimationFrame(returnTowardAxis);
        return;
      }

      local.poleSwivel *= 1 - poleReturnStrength;

      if (Math.abs(local.poleSwivel) < 0.002) {
        local.poleSwivel = 0;
        local.poleVelocity = 0;
        publish("axis-returned");
        stamp("axis-returned");
        local.returnRaf = 0;
        return;
      }

      local.poleVelocity = -local.poleSwivel * poleReturnStrength;
      publish("soft-axis-return");
      local.returnRaf = requestAnimationFrame(returnTowardAxis);
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

      if (typeof runtime.dragStart === "function") {
        runtime.dragStart();
      }

      try {
        target.setPointerCapture(event.pointerId);
      } catch (_) {}

      publish("drag-active");
      stamp("drag-active");
    }

    function move(event) {
      if (!local.active || event.pointerId !== local.pointerId) return;

      event.preventDefault();

      const current = now();
      const dx = event.clientX - local.lastX;
      const dy = event.clientY - local.lastY;
      const dt = Math.max(8, current - local.lastTime);

      const deltaRadians = (dx / widthOf(target)) * dragRadiansPerScreen;
      const velocity = clamp(deltaRadians / (dt / 1000), -maxSpinVelocity, maxSpinVelocity);

      const poleDelta = (dy / heightOf(target)) * poleRadiansPerScreen;
      const poleVelocity = clamp(poleDelta / (dt / 1000), -10, 10);

      local.lastX = event.clientX;
      local.lastY = event.clientY;
      local.lastTime = current;
      local.velocity = velocity;

      local.poleSwivel = clamp(local.poleSwivel + poleDelta, -MAX_POLE_SWIVEL_RAD, MAX_POLE_SWIVEL_RAD);
      local.poleVelocity = poleVelocity;

      if (typeof runtime.dragMove === "function") {
        runtime.dragMove(deltaRadians, velocity);
      }

      publish("drag-moving");
      canvas.dataset.hearthSpinVelocity = velocity.toFixed(5);
      stamp("drag-moving");
    }

    function up(event) {
      if (!local.active || event.pointerId !== local.pointerId) return;

      event.preventDefault();

      local.active = false;
      local.pointerId = null;
      local.releaseTime = now();

      if (typeof runtime.setSpinVelocity === "function") {
        runtime.setSpinVelocity(local.velocity);
      }

      if (typeof runtime.dragEnd === "function") {
        runtime.dragEnd();
      }

      try {
        target.releasePointerCapture(event.pointerId);
      } catch (_) {}

      publish("spin-inertia-pole-hold");
      canvas.dataset.hearthSpinVelocity = local.velocity.toFixed(5);
      stamp("spin-inertia-pole-hold");

      stopReturn();
      local.returnRaf = requestAnimationFrame(returnTowardAxis);
    }

    function wheel(event) {
      event.preventDefault();

      const delta = clamp(event.deltaY || 0, -180, 180);
      const velocity = clamp(-delta * wheelSensitivity, -maxSpinVelocity, maxSpinVelocity);

      if (typeof runtime.addSpin === "function") {
        runtime.addSpin(velocity);
      }

      publish("wheel-spin");
      canvas.dataset.hearthWheelVelocity = velocity.toFixed(5);
      stamp("wheel-spin");
    }

    function holdPoleInspection() {
      stopReturn();
      local.releaseTime = now();
      publish("pole-inspection-held");
      stamp("pole-inspection-held");
    }

    function resetView() {
      stopReturn();
      local.poleSwivel = 0;
      local.poleVelocity = 0;
      publish("view-reset");
      stamp("view-reset");
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
      publish("disposed");
      stamp("disposed");
    }

    target.addEventListener("pointerdown", down, { passive: false });
    target.addEventListener("pointermove", move, { passive: false });
    target.addEventListener("pointerup", up, { passive: false });
    target.addEventListener("pointercancel", up, { passive: false });
    target.addEventListener("pointerleave", up, { passive: false });
    target.addEventListener("wheel", wheel, { passive: false });

    const api = Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      holdPoleInspection,
      resetView,
      dispose
    });

    bindings.set(canvas, { api, dispose });
    window.__HEARTH_CONTROLS_DISPOSE__ = dispose;

    publish("bound");
    stamp("bound");

    return api;
  }

  window.HEARTH_CONTROLS = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    bind
  });

  document.documentElement.dataset.hearthControlsLoaded = "true";
  document.documentElement.dataset.hearthControlsContract = CONTRACT;
  document.documentElement.dataset.hearthControlsReceipt = RECEIPT;
})();

// /assets/audralia/audralia.controls.js
// AUDRALIA_G2_5_FREE_DRAG_AND_POLE_SWIVEL_CONTROL_TNT_v1
// Controls authority only.
// Owns finger drag, spin sensitivity, pole swivel, inspection hold, and soft axis return.
// Runtime remains motion-only.
// Canvas consumes the controlled motion state.
// No terrain, material, runtime, or asset authority.

const CONTRACT = "AUDRALIA_G2_5_FREE_DRAG_AND_POLE_SWIVEL_CONTROL_TNT_v1";
const RECEIPT = "AUDRALIA_G2_5_FREE_DRAG_AND_POLE_SWIVEL_CONTROL_RECEIPT";
const VERSION = "2026-05-10.audralia-free-drag-pole-swivel-controls";

const PHYSICAL_AXIS_DEG = 23.44;
const PHYSICAL_AXIS_RAD = PHYSICAL_AXIS_DEG * Math.PI / 180;
const MAX_POLE_SWIVEL_RAD = 82 * Math.PI / 180;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function nowMs() {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

function readBaseMotion(runtime) {
  const direct =
    runtime?.sampleMotionState?.() ||
    runtime?.sampleRuntimeMotion?.() ||
    runtime?.sampleRuntimeState?.() ||
    runtime?.sampleAudraliaRuntime?.() ||
    runtime?.getStatus?.()?.motion ||
    runtime?.getStatus?.() ||
    {};

  const elapsedMs = Number.isFinite(direct.elapsedMs) ? direct.elapsedMs : nowMs();
  const elapsedSeconds = Number.isFinite(direct.elapsedSeconds) ? direct.elapsedSeconds : elapsedMs / 1000;

  return {
    ok: true,
    receipt: direct.receipt || direct.contract || "AUDRALIA_BASE_RUNTIME_MOTION",
    elapsedMs,
    elapsedSeconds,
    rotationRadians:
      Number.isFinite(direct.rotationRadians) ? direct.rotationRadians :
      Number.isFinite(direct.rotationRad) ? direct.rotationRad :
      elapsedSeconds * 0.05,
    axisTiltRadians:
      Number.isFinite(direct.axisTiltRadians) ? direct.axisTiltRadians :
      Number.isFinite(direct.axialTiltRad) ? direct.axialTiltRad :
      PHYSICAL_AXIS_RAD,
    waterPhase:
      Number.isFinite(direct.waterPhase) ? direct.waterPhase :
      Number.isFinite(direct.oceanPhaseRad) ? direct.oceanPhaseRad :
      elapsedSeconds * 0.16,
    atmospherePhase:
      Number.isFinite(direct.atmospherePhase) ? direct.atmospherePhase :
      Number.isFinite(direct.atmosphericPhaseRad) ? direct.atmosphericPhaseRad :
      elapsedSeconds * 0.09,
    frame: Number.isFinite(direct.frame) ? direct.frame : Math.floor(elapsedSeconds * 60)
  };
}

function createAudraliaControls(options = {}) {
  const runtime = options.runtime || null;

  const state = {
    yawOffset: 0,
    yawVelocity: 0,
    poleSwivel: 0,
    poleVelocity: 0,
    active: false,
    lastX: 0,
    lastY: 0,
    lastT: nowMs(),
    releaseT: 0,
    lockDelayMs: Number.isFinite(options.lockDelayMs) ? options.lockDelayMs : 2200,
    rotateSensitivity: Number.isFinite(options.rotateSensitivity) ? options.rotateSensitivity : 0.0105,
    poleSensitivity: Number.isFinite(options.poleSensitivity) ? options.poleSensitivity : 0.0085,
    yawDamping: Number.isFinite(options.yawDamping) ? options.yawDamping : 2.1,
    poleDamping: Number.isFinite(options.poleDamping) ? options.poleDamping : 3.2,
    poleReturn: Number.isFinite(options.poleReturn) ? options.poleReturn : 5.6,
    bound: false,
    canvas: null,
    mount: null
  };

  function step() {
    const t = nowMs();
    const dt = clamp((t - state.lastT) / 1000, 0, 0.05);
    state.lastT = t;

    if (!state.active) {
      state.yawOffset += state.yawVelocity * dt;
      state.yawVelocity *= Math.exp(-state.yawDamping * dt);

      if (t - state.releaseT > state.lockDelayMs) {
        state.poleVelocity += (0 - state.poleSwivel) * state.poleReturn * dt;
      }

      state.poleSwivel += state.poleVelocity * dt;
      state.poleSwivel = clamp(state.poleSwivel, -MAX_POLE_SWIVEL_RAD, MAX_POLE_SWIVEL_RAD);
      state.poleVelocity *= Math.exp(-state.poleDamping * dt);
    }
  }

  function sampleMotionState() {
    step();

    const base = readBaseMotion(runtime);
    const rotationRadians = base.rotationRadians + state.yawOffset;

    return Object.freeze({
      ...base,
      contract: CONTRACT,
      receipt: RECEIPT,
      source: "audralia-controls-free-drag-pole-swivel",
      rotationRadians,
      rotationRad: rotationRadians,
      axisTiltRadians: PHYSICAL_AXIS_RAD,
      axialTiltRad: PHYSICAL_AXIS_RAD,
      inspectionTiltRadians: state.poleSwivel,
      poleSwivelRadians: state.poleSwivel,
      pointerActive: state.active,
      dragControlActive: true,
      poleInspectionActive: Math.abs(state.poleSwivel) > 0.01,
      physicalAxisDeg: PHYSICAL_AXIS_DEG,
      runtimeMotionOnly: true,
      controlsAuthority: true,
      visualSovereignty: false,
      terrainAuthority: false,
      materialAuthority: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function getStatus() {
    const motion = sampleMotionState();

    return Object.freeze({
      ok: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      authority: "controls-drag-spin-pole-swivel",
      runtimeMotionOnly: true,
      controlsAuthority: true,
      active: state.active,
      bound: state.bound,
      yawOffset: state.yawOffset,
      yawVelocity: state.yawVelocity,
      poleSwivel: state.poleSwivel,
      poleVelocity: state.poleVelocity,
      physicalAxisDeg: PHYSICAL_AXIS_DEG,
      maxPoleSwivelDeg: 82,
      lockDelayMs: state.lockDelayMs,
      motion,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function bind(target, bindOptions = {}) {
    const canvas = target instanceof Element ? target : document.querySelector(target);
    if (!canvas) return getStatus();

    const mount = bindOptions.mount || canvas.parentElement || canvas;

    state.canvas = canvas;
    state.mount = mount;
    state.bound = true;

    const surface = mount || canvas;
    surface.style.touchAction = "none";
    surface.style.userSelect = "none";
    canvas.style.touchAction = "none";
    canvas.style.userSelect = "none";

    function pointerDown(event) {
      state.active = true;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      state.lastT = nowMs();
      state.poleVelocity = 0;

      try { surface.setPointerCapture(event.pointerId); } catch (_) {}
      if (event.cancelable) event.preventDefault();
    }

    function pointerMove(event) {
      if (!state.active) return;

      const t = nowMs();
      const dt = clamp((t - state.lastT) / 1000, 0.001, 0.05);
      const dx = event.clientX - state.lastX;
      const dy = event.clientY - state.lastY;

      state.lastX = event.clientX;
      state.lastY = event.clientY;
      state.lastT = t;

      state.yawOffset += dx * state.rotateSensitivity;
      state.yawVelocity = dx * state.rotateSensitivity / dt;

      state.poleSwivel += dy * state.poleSensitivity;
      state.poleSwivel = clamp(state.poleSwivel, -MAX_POLE_SWIVEL_RAD, MAX_POLE_SWIVEL_RAD);
      state.poleVelocity = dy * state.poleSensitivity / dt;

      if (event.cancelable) event.preventDefault();
    }

    function pointerEnd(event) {
      state.active = false;
      state.releaseT = nowMs();

      try { surface.releasePointerCapture(event.pointerId); } catch (_) {}
      if (event.cancelable) event.preventDefault();
    }

    surface.addEventListener("pointerdown", pointerDown, { passive: false });
    surface.addEventListener("pointermove", pointerMove, { passive: false });
    surface.addEventListener("pointerup", pointerEnd, { passive: false });
    surface.addEventListener("pointercancel", pointerEnd, { passive: false });
    surface.addEventListener("pointerleave", pointerEnd, { passive: false });

    const dispose = () => {
      surface.removeEventListener("pointerdown", pointerDown);
      surface.removeEventListener("pointermove", pointerMove);
      surface.removeEventListener("pointerup", pointerEnd);
      surface.removeEventListener("pointercancel", pointerEnd);
      surface.removeEventListener("pointerleave", pointerEnd);
      state.bound = false;
    };

    window.__AUDRALIA_CONTROLS_DISPOSE__ = dispose;

    return getStatus();
  }

  function releasePoleLock() {
    state.releaseT = 0;
    return getStatus();
  }

  function holdPoleInspection() {
    state.releaseT = nowMs();
    return getStatus();
  }

  function resetView() {
    state.yawOffset = 0;
    state.yawVelocity = 0;
    state.poleSwivel = 0;
    state.poleVelocity = 0;
    return getStatus();
  }

  const api = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    bind,
    sampleMotionState,
    sampleRuntimeMotion: sampleMotionState,
    sampleRuntimeState: sampleMotionState,
    sampleAudraliaRuntime: sampleMotionState,
    getStatus,
    getMotionState: sampleMotionState,
    releasePoleLock,
    holdPoleInspection,
    resetView
  });

  return api;
}

function getAudraliaControlsStatus() {
  return Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    authority: "controls-drag-spin-pole-swivel",
    runtimeMotionOnly: true,
    physicalAxisDeg: PHYSICAL_AXIS_DEG,
    maxPoleSwivelDeg: 82,
    generatedImage: false,
    graphicBox: false,
    visualPassClaimed: false
  });
}

const AUDRALIA_CONTROLS_STATUS = getAudraliaControlsStatus();
const AUDRALIA_CONTROLS_RECEIPT_VALUE = RECEIPT;

if (typeof window !== "undefined") {
  window.AUDRALIA_CONTROLS = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    createAudraliaControls,
    createControls: createAudraliaControls,
    getStatus: getAudraliaControlsStatus
  });

  window.__AUDRALIA_CONTROLS_STATUS__ = AUDRALIA_CONTROLS_STATUS;
  window.__AUDRALIA_CONTROLS_RECEIPT__ = RECEIPT;

  document.documentElement.dataset.audraliaControlsLoaded = "true";
  document.documentElement.dataset.audraliaControlsContract = CONTRACT;
  document.documentElement.dataset.audraliaControlsReceipt = RECEIPT;
  document.documentElement.dataset.audraliaFreeDrag = "true";
  document.documentElement.dataset.audraliaPoleSwivel = "true";
  document.documentElement.dataset.audraliaRuntimeMotionOnly = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
}

export {
  CONTRACT,
  RECEIPT,
  VERSION,
  AUDRALIA_CONTROLS_STATUS,
  AUDRALIA_CONTROLS_RECEIPT_VALUE,
  createAudraliaControls,
  getAudraliaControlsStatus
};

export default Object.freeze({
  contract: CONTRACT,
  receipt: RECEIPT,
  createAudraliaControls,
  createControls: createAudraliaControls,
  getStatus: getAudraliaControlsStatus
});

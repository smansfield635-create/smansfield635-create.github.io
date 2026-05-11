// /assets/h-earth/h-earth.controls.js
// H_EARTH_G1_CONTROLS_MOTION_INPUT_TNT_v1
// Full-file replacement.
// Controls motion/input authority only.

export const CONTRACT = "H_EARTH_G1_CONTROLS_MOTION_INPUT_TNT_v1";
export const REQUIRED_PARENT = "canvas";
export const REQUIRED_CANVAS_CONTRACT = "H_EARTH_G1_CANVAS_VISIBLE_COMPOSITION_TNT_v1";
export const SEED_PACKET = "H_EARTH_G1_PARENT_CORE_CHAIN_SEED_PACKET_v1";
export const VERSION = "2026-05-11.h-earth.g1.controls-motion-input-stable-export-v1";

export const DEFAULTS = Object.freeze({
  rotationRadians: -0.3141592654,
  tiltRadians: -0.1396263402,
  zoom: 1,
  minZoom: 0.86,
  maxZoom: 1.42,
  dragSensitivity: 0.0068,
  tiltSensitivity: 0.0034,
  wheelSensitivity: 0.0012,
  inertiaDecay: 0.925,
  minVelocity: 0.00008
});

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round(value, places = 6) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function safeNumber(value, fallback) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function freezePlain(value) {
  if (!value || typeof value !== "object") return value;
  return Object.freeze(value);
}

function validateCanvas(canvasAuthority) {
  const failures = [];

  if (!canvasAuthority) failures.push("canvas-authority-missing");

  if (canvasAuthority && canvasAuthority.contract !== REQUIRED_CANVAS_CONTRACT) {
    failures.push(`canvas-contract-mismatch:${canvasAuthority.contract || "missing"}`);
  }

  if (canvasAuthority && typeof canvasAuthority.paintFrame !== "function") {
    failures.push("canvas-paintFrame-missing");
  }

  if (canvasAuthority && typeof canvasAuthority.getCanvasReceipt !== "function") {
    failures.push("canvas-receipt-reader-missing");
  }

  const receipt =
    canvasAuthority && typeof canvasAuthority.getCanvasReceipt === "function"
      ? canvasAuthority.getCanvasReceipt()
      : canvasAuthority?.receipts?.canvas || null;

  if (!receipt || receipt.contract !== REQUIRED_CANVAS_CONTRACT) {
    failures.push(`canvas-receipt-mismatch:${receipt?.contract || "missing"}`);
  }

  return freezePlain({
    passed: failures.length === 0,
    failures,
    parentContract: canvasAuthority?.contract || "missing",
    parentReceipt: receipt || null
  });
}

function getDocument(context) {
  return context.document || globalThis.document || null;
}

function getWindow(context) {
  return context.window || globalThis.window || null;
}

function resolveElement(target, context) {
  if (!target) return null;
  if (typeof target !== "string") return target;

  const doc = getDocument(context);
  return doc ? doc.querySelector(target) : null;
}

function findCanvasElement(canvasAuthority, mount) {
  return canvasAuthority?.state?.canvas || mount?.querySelector?.("canvas") || null;
}

export function createHEarthControls(context = {}) {
  const canvasAuthority = context.canvasAuthority || context.canvas || null;
  const canvasValidation = validateCanvas(canvasAuthority);

  const state = {
    bound: false,
    active: false,
    disposed: false,
    dragging: false,
    dragEnabled: true,
    zoomEnabled: true,
    inertiaEnabled: true,
    pointerId: null,
    lastX: 0,
    lastY: 0,
    rotationRadians: safeNumber(context.rotationRadians, DEFAULTS.rotationRadians),
    tiltRadians: safeNumber(context.tiltRadians, DEFAULTS.tiltRadians),
    zoom: safeNumber(context.zoom, DEFAULTS.zoom),
    velocityX: 0,
    velocityY: 0,
    frameId: 0,
    mount: null,
    canvasElement: null,
    errors: []
  };

  function createReceipt() {
    return freezePlain({
      contract: CONTRACT,
      seedPacket: SEED_PACKET,
      requiredParent: REQUIRED_PARENT,
      requiredCanvasContract: REQUIRED_CANVAS_CONTRACT,
      parentCanvasContract: canvasValidation.parentContract,
      controlsBound: state.bound,
      controlsActive: state.active,
      dragEnabled: state.dragEnabled,
      zoomEnabled: state.zoomEnabled,
      inertiaEnabled: state.inertiaEnabled,
      rotationRadians: round(state.rotationRadians),
      tiltRadians: round(state.tiltRadians),
      zoom: round(state.zoom),
      canvasPaintSovereignty: false,
      planetTruthOwned: false,
      surfaceTruthOwned: false,
      terrainTruthOwned: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      groundModeAuthorized: false,
      estateModeAuthorized: false
    });
  }

  function applyZoom() {
    if (!state.canvasElement) return;

    state.canvasElement.style.transformOrigin = "50% 50%";
    state.canvasElement.style.transform = `scale(${state.zoom})`;
    state.canvasElement.dataset.hEarthZoom = String(round(state.zoom));
  }

  function paint(reason = "controls-motion") {
    if (!canvasValidation.passed) {
      return freezePlain({
        painted: false,
        reason: "canvas-parent-not-ready",
        failures: canvasValidation.failures,
        controlsReceipt: createReceipt()
      });
    }

    const result = canvasAuthority.paintFrame({
      rotationRadians: state.rotationRadians,
      tiltRadians: state.tiltRadians,
      reason
    });

    applyZoom();

    return freezePlain({
      painted: Boolean(result?.painted),
      reason,
      canvasResult: result,
      controlsReceipt: createReceipt()
    });
  }

  function tick() {
    state.frameId = 0;

    if (state.disposed || !state.active) return;

    const moving =
      Math.abs(state.velocityX) > DEFAULTS.minVelocity ||
      Math.abs(state.velocityY) > DEFAULTS.minVelocity;

    if (!state.dragging && moving) {
      state.rotationRadians += state.velocityX;
      state.tiltRadians = clamp(state.tiltRadians + state.velocityY, -0.78, 0.78);

      state.velocityX *= DEFAULTS.inertiaDecay;
      state.velocityY *= DEFAULTS.inertiaDecay;

      paint("controls-inertia");
      requestFrame();
    }
  }

  function requestFrame() {
    if (state.frameId || state.disposed) return;

    const win = getWindow(context);
    const raf = win?.requestAnimationFrame || globalThis.requestAnimationFrame;

    if (typeof raf === "function") {
      state.frameId = raf(tick);
    }
  }

  function cancelFrame() {
    if (!state.frameId) return;

    const win = getWindow(context);
    const caf = win?.cancelAnimationFrame || globalThis.cancelAnimationFrame;

    if (typeof caf === "function") caf(state.frameId);
    state.frameId = 0;
  }

  function onPointerDown(event) {
    if (!state.dragEnabled || state.disposed) return;

    state.dragging = true;
    state.pointerId = event.pointerId;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.velocityX = 0;
    state.velocityY = 0;

    if (state.canvasElement?.setPointerCapture) {
      state.canvasElement.setPointerCapture(event.pointerId);
    }

    if (state.canvasElement) state.canvasElement.style.cursor = "grabbing";

    event.preventDefault();
  }

  function onPointerMove(event) {
    if (!state.dragging || state.pointerId !== event.pointerId || state.disposed) return;

    const dx = event.clientX - state.lastX;
    const dy = event.clientY - state.lastY;

    state.lastX = event.clientX;
    state.lastY = event.clientY;

    const vx = dx * DEFAULTS.dragSensitivity;
    const vy = -dy * DEFAULTS.tiltSensitivity;

    state.rotationRadians += vx;
    state.tiltRadians = clamp(state.tiltRadians + vy, -0.78, 0.78);
    state.velocityX = vx;
    state.velocityY = vy;

    paint("controls-drag");
    event.preventDefault();
  }

  function endDrag(event) {
    if (!state.dragging || state.pointerId !== event.pointerId) return;

    state.dragging = false;
    state.pointerId = null;

    if (state.canvasElement) state.canvasElement.style.cursor = "grab";

    requestFrame();
    event.preventDefault();
  }

  function onWheel(event) {
    if (!state.zoomEnabled || state.disposed) return;

    const nextZoom = clamp(
      state.zoom - event.deltaY * DEFAULTS.wheelSensitivity,
      DEFAULTS.minZoom,
      DEFAULTS.maxZoom
    );

    if (Math.abs(nextZoom - state.zoom) < 0.0001) return;

    state.zoom = nextZoom;
    applyZoom();

    event.preventDefault();
  }

  function bindTo(target, options = {}) {
    const mount = resolveElement(target, { ...context, ...options });

    if (!mount) {
      state.errors.push("mount-missing");
      return freezePlain({
        bound: false,
        reason: "mount-missing",
        receipt: createReceipt()
      });
    }

    if (!canvasValidation.passed) {
      return freezePlain({
        bound: false,
        reason: "canvas-parent-not-ready",
        failures: canvasValidation.failures,
        receipt: createReceipt()
      });
    }

    const canvasElement = findCanvasElement(canvasAuthority, mount);

    if (!canvasElement) {
      state.errors.push("canvas-element-missing");
      return freezePlain({
        bound: false,
        reason: "canvas-element-missing",
        receipt: createReceipt()
      });
    }

    state.mount = mount;
    state.canvasElement = canvasElement;
    state.bound = true;
    state.active = true;
    state.disposed = false;

    mount.dataset.hEarthControlsStatus = "bound";
    mount.dataset.hEarthControlsContract = CONTRACT;
    mount.dataset.controlsAuthority = "motion-input-only";
    mount.dataset.canvasAuthority = "visible-composition";
    mount.dataset.visualPassClaimed = "false";

    canvasElement.dataset.hEarthControls = "bound";
    canvasElement.dataset.hEarthControlsContract = CONTRACT;
    canvasElement.style.cursor = "grab";
    canvasElement.style.touchAction = "none";

    canvasElement.addEventListener("pointerdown", onPointerDown, { passive: false });
    canvasElement.addEventListener("pointermove", onPointerMove, { passive: false });
    canvasElement.addEventListener("pointerup", endDrag, { passive: false });
    canvasElement.addEventListener("pointercancel", endDrag, { passive: false });
    canvasElement.addEventListener("wheel", onWheel, { passive: false });

    applyZoom();
    paint("controls-bind-initial");

    return freezePlain({
      bound: true,
      contract: CONTRACT,
      receipt: createReceipt()
    });
  }

  function dispose() {
    cancelFrame();

    if (state.canvasElement) {
      state.canvasElement.removeEventListener("pointerdown", onPointerDown);
      state.canvasElement.removeEventListener("pointermove", onPointerMove);
      state.canvasElement.removeEventListener("pointerup", endDrag);
      state.canvasElement.removeEventListener("pointercancel", endDrag);
      state.canvasElement.removeEventListener("wheel", onWheel);
      state.canvasElement.style.cursor = "";
      state.canvasElement.style.touchAction = "";
      delete state.canvasElement.dataset.hEarthControls;
      delete state.canvasElement.dataset.hEarthControlsContract;
    }

    if (state.mount) {
      state.mount.dataset.hEarthControlsStatus = "disposed";
    }

    state.active = false;
    state.bound = false;
    state.disposed = true;

    return freezePlain({
      disposed: true,
      receipt: createReceipt()
    });
  }

  function setRotation(rotationRadians, tiltRadians = state.tiltRadians) {
    state.rotationRadians = safeNumber(rotationRadians, state.rotationRadians);
    state.tiltRadians = clamp(safeNumber(tiltRadians, state.tiltRadians), -0.78, 0.78);
    return paint("controls-set-rotation");
  }

  function setZoom(zoom) {
    state.zoom = clamp(safeNumber(zoom, state.zoom), DEFAULTS.minZoom, DEFAULTS.maxZoom);
    applyZoom();

    return freezePlain({
      zoom: state.zoom,
      receipt: createReceipt()
    });
  }

  function getControlsReceipt() {
    return createReceipt();
  }

  return {
    contract: CONTRACT,
    requiredParent: REQUIRED_PARENT,
    requiredCanvasContract: REQUIRED_CANVAS_CONTRACT,
    seedPacket: SEED_PACKET,
    version: VERSION,
    planet: "H-Earth",
    generation: "G1",
    parentReceipt: canvasValidation.parentReceipt,
    owns: [
      "motion",
      "drag",
      "rotation-request",
      "zoom-presentation",
      "inertia",
      "input-handling",
      "interaction-receipts"
    ],
    doesNotOwn: [
      "planet-truth",
      "land-water-classification",
      "terrain",
      "surface-color",
      "canvas-paint-sovereignty",
      "route-boot",
      "weather",
      "atmosphere",
      "life-systems"
    ],
    canvasValidation,
    state,
    bindTo,
    dispose,
    setRotation,
    setZoom,
    paint,
    getControlsReceipt
  };
}

export default createHEarthControls;

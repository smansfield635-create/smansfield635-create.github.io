// /assets/h-earth/h-earth.controls.js
// H_EARTH_G1_INTERACTIVE_CONTROLS_REFINEMENT_TNT_v2
// Full-file replacement.
// Controls authority only.
//
// Purpose:
// - Refine H-Earth controls into interactive motion/input authority.
// - Add drag rotation, touch rotation, wheel zoom, button zoom, reset, and gentle inertia.
// - Transform the visible canvas layer only.
// - Preserve parent truth immutability.
// - Preserve route compatibility with status: active-motion-input-authority.
// - Expose interactiveStatus: interactive-motion-input-authority-active.
//
// Owns:
// - pointer input
// - touch input
// - wheel input
// - zoom buttons
// - reset button
// - visible canvas transform
// - live yaw/pitch/zoom receipt
//
// Does not own:
// - kernel truth
// - lattice truth
// - landmap truth
// - terrain truth
// - surface truth
// - canvas pixel truth
// - material assignment
// - parent mutation
// - Earth mutation
// - Hearth mutation
// - Audralia mutation

const H_EARTH_CONTROLS_CONTRACT = "H_EARTH_G1_INTERACTIVE_CONTROLS_REFINEMENT_TNT_v2";
const H_EARTH_CONTROLS_PREVIOUS_CONTRACT = "H_EARTH_G1_CONTROLS_MOTION_INPUT_AUTHORITY_TNT_v1";
const H_EARTH_EXPECTED_CANVAS = "H_EARTH_G1_CANVAS_CONTROLS_RECEIPT_ALIGNMENT_TNT_v3";

const CONTROL_LIMITS = Object.freeze({
  minZoom: 0.72,
  maxZoom: 2.2,
  zoomStep: 0.12,
  pitchMin: -58,
  pitchMax: 58,
  yawVelocityLimit: 7.5,
  pitchVelocityLimit: 4.5,
  dragSensitivity: 0.28,
  inertiaDecay: 0.91,
  inertiaStopThreshold: 0.015
});

const state = {
  contract: H_EARTH_CONTROLS_CONTRACT,
  previousContract: H_EARTH_CONTROLS_PREVIOUS_CONTRACT,
  expectedCanvas: H_EARTH_EXPECTED_CANVAS,

  status: "active-motion-input-authority",
  interactiveStatus: "interactive-motion-input-authority-active",

  controlsAuthorized: true,
  motionAuthorized: true,
  inputAuthorized: true,
  dragAuthorized: true,
  touchAuthorized: true,
  zoomAuthorized: true,
  inertiaAuthorized: true,
  parentMutationAuthorized: false,
  visualPassClaim: false,

  canvasReceipt: "pending",
  canvasRenderStatus: "pending",
  canvasProofPassed: false,

  yaw: 0,
  pitch: 0,
  zoom: 1,
  velocityYaw: 0,
  velocityPitch: 0,

  isDragging: false,
  activePointerId: null,
  lastX: 0,
  lastY: 0,

  rafId: null,
  mounted: false,
  bootedAt: null,
  updatedAt: null,

  errors: []
};

let controlsApi = null;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round(value, places = 2) {
  const factor = Math.pow(10, places);
  return Math.round(value * factor) / factor;
}

function safeError(error) {
  if (!error) return "unknown error";
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  return String(error);
}

function recordError(label, error) {
  state.errors.push({
    label,
    message: safeError(error),
    at: new Date().toISOString()
  });
}

function findControlsMount() {
  return (
    document.querySelector("[data-h-earth-controls-mount]") ||
    document.getElementById("hEarthControlsMount") ||
    document.getElementById("h-earth-main") ||
    document.querySelector("main") ||
    document.body
  );
}

function findCanvasElement() {
  return (
    document.querySelector("[data-h-earth-canvas]") ||
    document.querySelector("#hEarthCanvasCompositionMount canvas") ||
    document.querySelector("[data-h-earth-canvas-mount] canvas") ||
    document.querySelector("canvas[aria-label*='H-Earth']") ||
    document.querySelector("canvas")
  );
}

function findCanvasStage(canvas) {
  if (!canvas) return null;

  return (
    canvas.closest("[data-h-earth-canvas-stage]") ||
    canvas.closest("[data-h-earth-canvas-panel]") ||
    canvas.parentElement
  );
}

function ensureStyle() {
  if (document.getElementById("h-earth-interactive-controls-style-v2")) return;

  const style = document.createElement("style");
  style.id = "h-earth-interactive-controls-style-v2";
  style.textContent = `
    [data-h-earth-controls-panel] {
      box-sizing: border-box;
      width: 100%;
      margin: 0;
      padding: 1rem;
      border: 1px solid rgba(244, 191, 96, 0.32);
      border-radius: 1.25rem;
      background:
        radial-gradient(circle at 16% 0%, rgba(244, 191, 96, 0.11), transparent 28rem),
        linear-gradient(180deg, rgba(8, 16, 34, 0.94), rgba(4, 8, 18, 0.98));
      color: #f6ead2;
      box-shadow: 0 22px 70px rgba(0, 0, 0, 0.34);
    }

    [data-h-earth-controls-title] {
      margin: 0 0 0.35rem;
      color: #f6d37b;
      font-size: clamp(1.15rem, 3.6vw, 1.7rem);
      line-height: 1.1;
      letter-spacing: 0.02em;
    }

    [data-h-earth-controls-copy] {
      margin: 0 0 0.9rem;
      max-width: 78ch;
      color: rgba(246, 234, 210, 0.78);
      line-height: 1.55;
    }

    [data-h-earth-controls-actions] {
      display: flex;
      flex-wrap: wrap;
      gap: 0.55rem;
      margin: 0.9rem 0;
    }

    [data-h-earth-controls-actions] button {
      appearance: none;
      border: 1px solid rgba(244, 191, 96, 0.34);
      border-radius: 999px;
      background: rgba(244, 191, 96, 0.10);
      color: #f6ead2;
      padding: 0.68rem 0.9rem;
      font: 800 0.88rem system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      letter-spacing: 0.02em;
      cursor: pointer;
    }

    [data-h-earth-controls-actions] button:hover {
      background: rgba(244, 191, 96, 0.16);
    }

    [data-h-earth-controls-actions] button:focus-visible {
      outline: 2px solid #f4bf60;
      outline-offset: 3px;
    }

    [data-h-earth-controls-readout] {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 0.6rem;
      margin-top: 0.9rem;
    }

    [data-h-earth-controls-readout] span {
      display: block;
      padding: 0.65rem 0.75rem;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 0.78rem;
      background: rgba(255, 255, 255, 0.052);
      color: rgba(246, 234, 210, 0.86);
      font-size: 0.9rem;
      line-height: 1.35;
      overflow-wrap: anywhere;
    }

    [data-h-earth-controls-readout] strong {
      display: block;
      margin-bottom: 0.15rem;
      color: #8ff0c3;
      font-size: 0.74rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    [data-h-earth-canvas],
    [data-h-earth-canvas-stage] {
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
    }

    [data-h-earth-canvas] {
      will-change: transform;
      transform-origin: center center;
      transition: filter 120ms ease;
      cursor: grab;
    }

    [data-h-earth-canvas][data-h-earth-dragging="true"] {
      cursor: grabbing;
      filter: saturate(1.08) brightness(1.04);
    }
  `;

  document.head.appendChild(style);
}

function ensurePanel() {
  ensureStyle();

  let panel = document.querySelector("[data-h-earth-controls-panel]");
  if (panel) return panel;

  panel = document.createElement("section");
  panel.setAttribute("data-h-earth-controls-panel", "true");
  panel.setAttribute("aria-label", "H-Earth interactive controls");

  panel.innerHTML = `
    <h2 data-h-earth-controls-title>H-Earth Interactive Controls</h2>
    <p data-h-earth-controls-copy>
      Controls are active as downstream motion/input authority only. Drag or touch the H-Earth canvas to rotate the visible layer. Use wheel or buttons to zoom. Parent truth remains immutable.
    </p>
    <div data-h-earth-controls-actions aria-label="H-Earth control actions">
      <button type="button" data-h-earth-control="zoom-in">Zoom In</button>
      <button type="button" data-h-earth-control="zoom-out">Zoom Out</button>
      <button type="button" data-h-earth-control="reset">Reset</button>
    </div>
    <div data-h-earth-controls-readout aria-live="polite"></div>
  `;

  findControlsMount().replaceChildren(panel);
  return panel;
}

function readoutTarget() {
  return document.querySelector("[data-h-earth-controls-readout]");
}

function readCanvasStatus(context = {}) {
  const provided = context.canvasStatus || null;
  const api = window.DGBHEarthCanvas || window.HEarthCanvas || window.H_EARTH_CANVAS || null;

  let status = provided;

  if (!status && api) {
    if (typeof api.getHEarthCanvasStatus === "function") status = api.getHEarthCanvasStatus();
    else if (typeof api.getStatus === "function") status = api.getStatus();
    else if (typeof api.status === "function") status = api.status();
  }

  state.canvasReceipt =
    status?.contract ||
    status?.receipt ||
    window.H_EARTH_CANVAS_RECEIPT ||
    "pending";

  state.canvasRenderStatus = status?.renderStatus || "pending";

  state.canvasProofPassed =
    state.canvasReceipt === H_EARTH_EXPECTED_CANVAS &&
    status?.parentSurfaceReady === true &&
    status?.downstreamCanvasMayReadSurface === true &&
    Number(status?.cellsResolved) === 256 &&
    Number(status?.cellsPainted) > 0 &&
    Number(status?.nonBlankPixelRatio) > 0;

  return status;
}

function publishReadout() {
  const target = readoutTarget();
  if (!target) return;

  target.innerHTML = `
    <span><strong>Contract</strong>${state.contract}</span>
    <span><strong>Previous</strong>${state.previousContract}</span>
    <span><strong>Status</strong>${state.interactiveStatus}</span>
    <span><strong>Route status</strong>${state.status}</span>
    <span><strong>Canvas</strong>${state.canvasReceipt}</span>
    <span><strong>Canvas proof</strong>${String(state.canvasProofPassed)}</span>
    <span><strong>Drag</strong>${String(state.dragAuthorized)}</span>
    <span><strong>Touch</strong>${String(state.touchAuthorized)}</span>
    <span><strong>Zoom</strong>${String(state.zoomAuthorized)}</span>
    <span><strong>Inertia</strong>${String(state.inertiaAuthorized)}</span>
    <span><strong>Yaw</strong>${round(state.yaw, 2)}</span>
    <span><strong>Pitch</strong>${round(state.pitch, 2)}</span>
    <span><strong>Zoom</strong>${round(state.zoom, 2)}</span>
    <span><strong>Parent mutation</strong>forbidden</span>
  `;
}

function applyTransform() {
  const canvas = findCanvasElement();
  if (!canvas) return;

  canvas.dataset.hEarthDragging = String(state.isDragging);
  canvas.dataset.hEarthYaw = String(round(state.yaw, 2));
  canvas.dataset.hEarthPitch = String(round(state.pitch, 2));
  canvas.dataset.hEarthZoom = String(round(state.zoom, 3));
  canvas.dataset.hEarthControlsReceipt = H_EARTH_CONTROLS_CONTRACT;
  canvas.dataset.hEarthInteractiveStatus = state.interactiveStatus;
  canvas.dataset.hEarthParentMutationAuthorized = "false";

  const rotateY = clamp(state.yaw * 0.24, -42, 42);
  const rotateX = clamp(-state.pitch * 0.22, -24, 24);
  const rotateZ = clamp(state.yaw * 0.018, -7, 7);

  canvas.style.transform = [
    "translate3d(0, 0, 0)",
    `scale(${state.zoom})`,
    `perspective(900px)`,
    `rotateX(${rotateX}deg)`,
    `rotateY(${rotateY}deg)`,
    `rotateZ(${rotateZ}deg)`
  ].join(" ");

  state.updatedAt = new Date().toISOString();
  publishReadout();
  stampDocument();
}

function cancelInertia() {
  if (state.rafId !== null) {
    cancelAnimationFrame(state.rafId);
    state.rafId = null;
  }
}

function inertiaTick() {
  state.yaw += state.velocityYaw;
  state.pitch = clamp(
    state.pitch + state.velocityPitch,
    CONTROL_LIMITS.pitchMin,
    CONTROL_LIMITS.pitchMax
  );

  state.velocityYaw *= CONTROL_LIMITS.inertiaDecay;
  state.velocityPitch *= CONTROL_LIMITS.inertiaDecay;

  applyTransform();

  const stillMoving =
    Math.abs(state.velocityYaw) > CONTROL_LIMITS.inertiaStopThreshold ||
    Math.abs(state.velocityPitch) > CONTROL_LIMITS.inertiaStopThreshold;

  if (stillMoving && !state.isDragging) {
    state.rafId = requestAnimationFrame(inertiaTick);
  } else {
    state.velocityYaw = 0;
    state.velocityPitch = 0;
    state.rafId = null;
    applyTransform();
  }
}

function startInertia() {
  if (!state.inertiaAuthorized) return;

  cancelInertia();

  const moving =
    Math.abs(state.velocityYaw) > CONTROL_LIMITS.inertiaStopThreshold ||
    Math.abs(state.velocityPitch) > CONTROL_LIMITS.inertiaStopThreshold;

  if (moving) {
    state.rafId = requestAnimationFrame(inertiaTick);
  }
}

function setZoom(nextZoom) {
  state.zoom = clamp(nextZoom, CONTROL_LIMITS.minZoom, CONTROL_LIMITS.maxZoom);
  applyTransform();
}

function resetView() {
  cancelInertia();

  state.yaw = 0;
  state.pitch = 0;
  state.zoom = 1;
  state.velocityYaw = 0;
  state.velocityPitch = 0;
  state.isDragging = false;
  state.activePointerId = null;

  applyTransform();
}

function onPointerDown(event) {
  const canvas = findCanvasElement();
  if (!canvas || !state.inputAuthorized) return;

  cancelInertia();

  state.isDragging = true;
  state.activePointerId = event.pointerId;
  state.lastX = event.clientX;
  state.lastY = event.clientY;
  state.velocityYaw = 0;
  state.velocityPitch = 0;

  try {
    canvas.setPointerCapture(event.pointerId);
  } catch (error) {
    recordError("pointer-capture", error);
  }

  event.preventDefault();
  applyTransform();
}

function onPointerMove(event) {
  if (!state.isDragging || event.pointerId !== state.activePointerId) return;

  const dx = event.clientX - state.lastX;
  const dy = event.clientY - state.lastY;

  state.lastX = event.clientX;
  state.lastY = event.clientY;

  const yawDelta = dx * CONTROL_LIMITS.dragSensitivity;
  const pitchDelta = -dy * CONTROL_LIMITS.dragSensitivity;

  state.yaw += yawDelta;
  state.pitch = clamp(
    state.pitch + pitchDelta,
    CONTROL_LIMITS.pitchMin,
    CONTROL_LIMITS.pitchMax
  );

  state.velocityYaw = clamp(
    yawDelta * 0.18,
    -CONTROL_LIMITS.yawVelocityLimit,
    CONTROL_LIMITS.yawVelocityLimit
  );

  state.velocityPitch = clamp(
    pitchDelta * 0.16,
    -CONTROL_LIMITS.pitchVelocityLimit,
    CONTROL_LIMITS.pitchVelocityLimit
  );

  event.preventDefault();
  applyTransform();
}

function onPointerUp(event) {
  if (event.pointerId !== state.activePointerId) return;

  const canvas = findCanvasElement();

  if (canvas) {
    try {
      canvas.releasePointerCapture(event.pointerId);
    } catch (error) {
      recordError("pointer-release", error);
    }
  }

  state.isDragging = false;
  state.activePointerId = null;

  event.preventDefault();
  applyTransform();
  startInertia();
}

function onWheel(event) {
  if (!state.zoomAuthorized) return;

  const direction = event.deltaY > 0 ? -1 : 1;
  const nextZoom = state.zoom + direction * CONTROL_LIMITS.zoomStep;

  event.preventDefault();
  setZoom(nextZoom);
}

function bindCanvasInput() {
  const canvas = findCanvasElement();
  const stage = findCanvasStage(canvas);

  if (!canvas) {
    recordError("bind-canvas-input", "no H-Earth canvas found");
    return false;
  }

  const inputTarget = stage || canvas;

  canvas.dataset.hEarthInteractiveControlsBound = H_EARTH_CONTROLS_CONTRACT;
  inputTarget.dataset.hEarthInteractiveControlsBound = H_EARTH_CONTROLS_CONTRACT;

  canvas.addEventListener("pointerdown", onPointerDown, { passive: false });
  canvas.addEventListener("pointermove", onPointerMove, { passive: false });
  canvas.addEventListener("pointerup", onPointerUp, { passive: false });
  canvas.addEventListener("pointercancel", onPointerUp, { passive: false });
  canvas.addEventListener("lostpointercapture", () => {
    state.isDragging = false;
    state.activePointerId = null;
    applyTransform();
  });

  inputTarget.addEventListener("wheel", onWheel, { passive: false });

  return true;
}

function bindButtons() {
  const panel = ensurePanel();

  const zoomIn = panel.querySelector('[data-h-earth-control="zoom-in"]');
  const zoomOut = panel.querySelector('[data-h-earth-control="zoom-out"]');
  const reset = panel.querySelector('[data-h-earth-control="reset"]');

  if (zoomIn) {
    zoomIn.addEventListener("click", () => {
      cancelInertia();
      setZoom(state.zoom + CONTROL_LIMITS.zoomStep);
    });
  }

  if (zoomOut) {
    zoomOut.addEventListener("click", () => {
      cancelInertia();
      setZoom(state.zoom - CONTROL_LIMITS.zoomStep);
    });
  }

  if (reset) {
    reset.addEventListener("click", resetView);
  }
}

function stampDocument() {
  const root = document.documentElement;

  root.dataset.hEarthControlsReceipt = H_EARTH_CONTROLS_CONTRACT;
  root.dataset.hEarthControlsPreviousReceipt = H_EARTH_CONTROLS_PREVIOUS_CONTRACT;
  root.dataset.hEarthControlsStatus = state.status;
  root.dataset.hEarthInteractiveControlsStatus = state.interactiveStatus;
  root.dataset.hEarthDragAuthorized = String(state.dragAuthorized);
  root.dataset.hEarthTouchAuthorized = String(state.touchAuthorized);
  root.dataset.hEarthZoomAuthorized = String(state.zoomAuthorized);
  root.dataset.hEarthInertiaAuthorized = String(state.inertiaAuthorized);
  root.dataset.hEarthControlsAuthorized = String(state.controlsAuthorized);
  root.dataset.hEarthMotionAuthorized = String(state.motionAuthorized);
  root.dataset.hEarthInputAuthorized = String(state.inputAuthorized);
  root.dataset.hEarthParentMutationAuthorized = "false";
  root.dataset.hEarthVisualPassClaim = "false";
  root.dataset.hEarthYaw = String(round(state.yaw, 2));
  root.dataset.hEarthPitch = String(round(state.pitch, 2));
  root.dataset.hEarthZoom = String(round(state.zoom, 3));
}

function exposeControlsApi() {
  controlsApi = {
    contract: H_EARTH_CONTROLS_CONTRACT,
    receipt: H_EARTH_CONTROLS_CONTRACT,
    previousContract: H_EARTH_CONTROLS_PREVIOUS_CONTRACT,
    status: getHEarthControlsStatus,
    getStatus: getHEarthControlsStatus,
    getHEarthControlsStatus,
    boot: bootHEarthControls,
    bootHEarthControls,
    reset: resetView,
    resetView,
    setZoom,
    getYaw: () => state.yaw,
    getPitch: () => state.pitch,
    getZoom: () => state.zoom
  };

  window.DGBHEarthControls = controlsApi;
  window.HEarthControls = controlsApi;
  window.H_EARTH_CONTROLS = controlsApi;
  window.H_EARTH_CONTROLS_RECEIPT = H_EARTH_CONTROLS_CONTRACT;

  stampDocument();
}

async function bootHEarthControls(context = {}) {
  state.bootedAt = state.bootedAt || new Date().toISOString();

  exposeControlsApi();
  ensurePanel();
  readCanvasStatus(context);

  const inputBound = bindCanvasInput();

  bindButtons();

  state.controlsAuthorized = true;
  state.motionAuthorized = true;
  state.inputAuthorized = true;
  state.dragAuthorized = true;
  state.touchAuthorized = true;
  state.zoomAuthorized = true;
  state.inertiaAuthorized = true;
  state.parentMutationAuthorized = false;
  state.visualPassClaim = false;

  if (!inputBound) {
    state.status = "active-motion-input-authority";
    state.interactiveStatus = "interactive-motion-input-authority-active-no-canvas-target";
  } else {
    state.status = "active-motion-input-authority";
    state.interactiveStatus = "interactive-motion-input-authority-active";
  }

  applyTransform();
  publishReadout();
  exposeControlsApi();

  return getHEarthControlsStatus();
}

function getHEarthControlsStatus() {
  readCanvasStatus();

  return {
    contract: H_EARTH_CONTROLS_CONTRACT,
    receipt: H_EARTH_CONTROLS_CONTRACT,
    previousContract: H_EARTH_CONTROLS_PREVIOUS_CONTRACT,

    // Route-compatible status retained so existing v10B route/canvas gates continue to pass.
    status: "active-motion-input-authority",

    // Interactive refinement status.
    interactiveStatus: state.interactiveStatus,

    controlsAuthorized: true,
    motionAuthorized: true,
    inputAuthorized: true,
    dragAuthorized: state.dragAuthorized,
    touchAuthorized: state.touchAuthorized,
    zoomAuthorized: state.zoomAuthorized,
    inertiaAuthorized: state.inertiaAuthorized,

    yaw: round(state.yaw, 3),
    pitch: round(state.pitch, 3),
    zoom: round(state.zoom, 3),
    velocityYaw: round(state.velocityYaw, 4),
    velocityPitch: round(state.velocityPitch, 4),
    isDragging: state.isDragging,

    canvasReceipt: state.canvasReceipt,
    canvasProofPassed: state.canvasProofPassed,
    canvasRenderStatus: state.canvasRenderStatus,

    parentMutationAuthorized: false,
    visualPassClaim: false,
    earthMutationAuthorized: false,
    hearthMutationAuthorized: false,
    audraliaMutationAuthorized: false,

    bootedAt: state.bootedAt,
    updatedAt: state.updatedAt,
    errors: [...state.errors]
  };
}

exposeControlsApi();

export {
  H_EARTH_CONTROLS_CONTRACT,
  H_EARTH_CONTROLS_PREVIOUS_CONTRACT,
  H_EARTH_EXPECTED_CANVAS,
  bootHEarthControls,
  getHEarthControlsStatus
};

export default {
  contract: H_EARTH_CONTROLS_CONTRACT,
  receipt: H_EARTH_CONTROLS_CONTRACT,
  previousContract: H_EARTH_CONTROLS_PREVIOUS_CONTRACT,
  boot: bootHEarthControls,
  bootHEarthControls,
  status: getHEarthControlsStatus,
  getStatus: getHEarthControlsStatus,
  getHEarthControlsStatus
};

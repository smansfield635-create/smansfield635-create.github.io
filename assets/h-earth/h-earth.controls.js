// /assets/h-earth/h-earth.controls.js
// H_EARTH_G1_CONTROLS_MOTION_INPUT_AUTHORITY_TNT_v1
// Full-file replacement.
// Controls authority only.
//
// Purpose:
// - Activate first H-Earth controls layer after canvas visible-composition proof.
// - Own motion/input only.
// - Read canvas proof from H_EARTH_G1_CANVAS_PARENT_INSTANCE_CONSUMER_TNT_v2.
// - Apply non-mutating motion state to the existing visible canvas.
// - Keep parent truth immutable.
//
// Owns:
// - control receipt
// - drag input
// - zoom input
// - reset input
// - motion/input status
//
// Does not own:
// - kernel truth
// - lattice truth
// - landmap truth
// - terrain truth
// - surface truth
// - canvas material truth
// - Earth mutation
// - Hearth mutation
// - Audralia mutation

const H_EARTH_CONTROLS_CONTRACT = "H_EARTH_G1_CONTROLS_MOTION_INPUT_AUTHORITY_TNT_v1";
const H_EARTH_CONTROLS_PREVIOUS = "H_EARTH_G1_CANVAS_PARENT_INSTANCE_CONSUMER_TNT_v2";
const H_EARTH_EXPECTED_CANVAS = "H_EARTH_G1_CANVAS_PARENT_INSTANCE_CONSUMER_TNT_v2";

const controlsState = {
  contract: H_EARTH_CONTROLS_CONTRACT,
  previous: H_EARTH_CONTROLS_PREVIOUS,
  expectedCanvas: H_EARTH_EXPECTED_CANVAS,
  status: "not-started",
  controlsAuthorized: false,
  motionAuthorized: false,
  inputAuthorized: false,
  parentMutationAuthorized: false,
  yaw: 0,
  pitch: 0,
  zoom: 1,
  dragging: false,
  dragStartX: 0,
  dragStartY: 0,
  dragStartYaw: 0,
  dragStartPitch: 0,
  canvasStatus: null,
  bootedAt: null,
  updatedAt: null,
  errors: []
};

let bootPromise = null;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function safeError(error) {
  if (!error) return "unknown error";
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  return String(error);
}

function recordError(label, error) {
  controlsState.errors.push({
    label,
    message: safeError(error)
  });
}

function getCanvasApi() {
  return window.DGBHEarthCanvas || window.HEarthCanvas || window.H_EARTH_CANVAS || null;
}

function readCanvasStatus() {
  const api = getCanvasApi();

  if (!api) return null;

  if (typeof api.getHEarthCanvasStatus === "function") {
    return api.getHEarthCanvasStatus();
  }

  if (typeof api.getStatus === "function") {
    return api.getStatus();
  }

  if (typeof api.status === "function") {
    return api.status();
  }

  return null;
}

function canvasProofPasses(status) {
  if (!status) return false;

  return (
    status.contract === H_EARTH_EXPECTED_CANVAS &&
    status.parentSurfaceReady === true &&
    status.downstreamCanvasMayReadSurface === true &&
    status.cellsResolved === 256 &&
    Number(status.cellsPainted) > 0 &&
    status.renderStatus === "visible-composition-painted-from-surface-instance" &&
    Number(status.nonBlankPixelRatio) > 0
  );
}

function findCanvas() {
  return document.querySelector("[data-h-earth-canvas]");
}

function findStage() {
  return (
    document.querySelector("[data-h-earth-canvas-stage]") ||
    document.querySelector("[data-h-earth-canvas-panel]") ||
    document.getElementById("hEarthCanvasCompositionMount") ||
    findCanvas()?.parentElement ||
    null
  );
}

function findControlsHost() {
  return (
    document.querySelector("[data-h-earth-controls-mount]") ||
    document.getElementById("hEarthControlsMount") ||
    document.getElementById("hEarthCanvasCompositionMount") ||
    document.querySelector("[data-h-earth-canvas-panel]") ||
    document.getElementById("h-earth-main") ||
    document.body
  );
}

function ensureStyle() {
  if (document.getElementById("h-earth-controls-style-v1")) return;

  const style = document.createElement("style");
  style.id = "h-earth-controls-style-v1";
  style.textContent = `
    [data-h-earth-controls-panel] {
      box-sizing: border-box;
      margin-top: 1rem;
      padding: 1rem;
      border: 1px solid rgba(244, 191, 96, 0.28);
      border-radius: 1rem;
      background:
        radial-gradient(circle at 20% 10%, rgba(244, 191, 96, 0.10), transparent 18rem),
        rgba(8, 14, 28, 0.86);
      color: #f6ead2;
    }

    [data-h-earth-controls-panel] h2 {
      margin: 0 0 0.4rem;
      color: #f4bf60;
      font-size: 1rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    [data-h-earth-controls-panel] p {
      margin: 0 0 0.75rem;
      color: rgba(246, 234, 210, 0.72);
      line-height: 1.45;
    }

    [data-h-earth-controls-actions] {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin: 0.8rem 0;
    }

    [data-h-earth-controls-actions] button {
      appearance: none;
      border: 1px solid rgba(244, 191, 96, 0.38);
      border-radius: 999px;
      padding: 0.7rem 0.9rem;
      background: rgba(244, 191, 96, 0.10);
      color: #f6ead2;
      font: 800 0.9rem Inter, system-ui, sans-serif;
      cursor: pointer;
    }

    [data-h-earth-controls-actions] button:focus-visible {
      outline: 2px solid #f4bf60;
      outline-offset: 3px;
    }

    [data-h-earth-controls-status] {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 0.5rem;
      margin-top: 0.8rem;
    }

    [data-h-earth-controls-status] span {
      display: block;
      padding: 0.65rem 0.75rem;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 0.75rem;
      background: rgba(255,255,255,0.045);
      color: rgba(246, 234, 210, 0.84);
      overflow-wrap: anywhere;
      line-height: 1.35;
    }

    [data-h-earth-controls-status] strong {
      display: block;
      margin-bottom: 0.15rem;
      color: #f4bf60;
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    [data-h-earth-canvas][data-controls-bound="true"] {
      cursor: grab;
      will-change: transform;
      transform-origin: center center;
    }

    [data-h-earth-canvas][data-controls-dragging="true"] {
      cursor: grabbing;
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
  panel.setAttribute("aria-label", "H-Earth controls motion input authority");

  panel.innerHTML = `
    <h2>H-Earth Controls</h2>
    <p>
      Controls are active as motion/input authority only. They move the visible canvas layer and do not mutate parent truth.
    </p>
    <div data-h-earth-controls-actions>
      <button type="button" data-h-earth-control="zoom-in">Zoom In</button>
      <button type="button" data-h-earth-control="zoom-out">Zoom Out</button>
      <button type="button" data-h-earth-control="reset">Reset</button>
    </div>
    <div data-h-earth-controls-status aria-live="polite"></div>
  `;

  findControlsHost().appendChild(panel);
  return panel;
}

function publishStatus() {
  const panel = ensurePanel();
  const target = panel.querySelector("[data-h-earth-controls-status]");
  if (!target) return;

  target.innerHTML = `
    <span><strong>Contract</strong>${controlsState.contract}</span>
    <span><strong>Canvas</strong>${controlsState.canvasStatus?.contract || "pending"}</span>
    <span><strong>Status</strong>${controlsState.status}</span>
    <span><strong>Motion</strong>${controlsState.motionAuthorized ? "authorized" : "held"}</span>
    <span><strong>Input</strong>${controlsState.inputAuthorized ? "authorized" : "held"}</span>
    <span><strong>Yaw</strong>${controlsState.yaw.toFixed(2)}</span>
    <span><strong>Pitch</strong>${controlsState.pitch.toFixed(2)}</span>
    <span><strong>Zoom</strong>${controlsState.zoom.toFixed(2)}</span>
    <span><strong>Parent mutation</strong>forbidden</span>
  `;

  document.documentElement.dataset.hEarthControlsReceipt = H_EARTH_CONTROLS_CONTRACT;
  document.documentElement.dataset.hEarthControls = controlsState.status;
  document.documentElement.dataset.hEarthControlsAuthorized = String(controlsState.controlsAuthorized);
  document.documentElement.dataset.hEarthMotionAuthorized = String(controlsState.motionAuthorized);
  document.documentElement.dataset.hEarthInputAuthorized = String(controlsState.inputAuthorized);
  document.documentElement.dataset.hEarthParentMutationAuthorized = "false";
}

function applyMotion() {
  const canvas = findCanvas();
  if (!canvas) return;

  canvas.dataset.controlsBound = "true";
  canvas.dataset.controlsDragging = String(controlsState.dragging);
  canvas.dataset.hEarthYaw = String(controlsState.yaw);
  canvas.dataset.hEarthPitch = String(controlsState.pitch);
  canvas.dataset.hEarthZoom = String(controlsState.zoom);

  canvas.style.transform = [
    "perspective(1100px)",
    `rotateX(${(-controlsState.pitch * 0.18).toFixed(2)}deg)`,
    `rotateY(${(controlsState.yaw * 0.18).toFixed(2)}deg)`,
    `scale(${controlsState.zoom.toFixed(3)})`
  ].join(" ");

  canvas.style.transition = controlsState.dragging ? "none" : "transform 160ms ease";
  controlsState.updatedAt = new Date().toISOString();
  publishStatus();
}

function resetControls() {
  controlsState.yaw = 0;
  controlsState.pitch = 0;
  controlsState.zoom = 1;
  applyMotion();
}

function bindButtons() {
  const panel = ensurePanel();

  panel.querySelectorAll("[data-h-earth-control]").forEach((button) => {
    if (button.dataset.bound === "true") return;
    button.dataset.bound = "true";

    button.addEventListener("click", () => {
      const action = button.dataset.hEarthControl;

      if (action === "zoom-in") {
        controlsState.zoom = clamp(controlsState.zoom + 0.08, 0.74, 1.42);
      }

      if (action === "zoom-out") {
        controlsState.zoom = clamp(controlsState.zoom - 0.08, 0.74, 1.42);
      }

      if (action === "reset") {
        resetControls();
        return;
      }

      applyMotion();
    });
  });
}

function bindPointerInput() {
  const canvas = findCanvas();
  if (!canvas) return false;
  if (canvas.dataset.hEarthControlsPointerBound === "true") return true;

  canvas.dataset.hEarthControlsPointerBound = "true";
  canvas.dataset.controlsBound = "true";

  canvas.addEventListener("pointerdown", (event) => {
    controlsState.dragging = true;
    controlsState.dragStartX = event.clientX;
    controlsState.dragStartY = event.clientY;
    controlsState.dragStartYaw = controlsState.yaw;
    controlsState.dragStartPitch = controlsState.pitch;

    try {
      canvas.setPointerCapture(event.pointerId);
    } catch (error) {
      recordError("pointer-capture", error);
    }

    applyMotion();
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!controlsState.dragging) return;

    const dx = event.clientX - controlsState.dragStartX;
    const dy = event.clientY - controlsState.dragStartY;

    controlsState.yaw = controlsState.dragStartYaw + dx * 0.35;
    controlsState.pitch = clamp(controlsState.dragStartPitch + dy * 0.22, -42, 42);

    applyMotion();
  });

  const endDrag = (event) => {
    if (!controlsState.dragging) return;
    controlsState.dragging = false;

    try {
      canvas.releasePointerCapture(event.pointerId);
    } catch (error) {
      // harmless
    }

    applyMotion();
  };

  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);
  canvas.addEventListener("lostpointercapture", () => {
    controlsState.dragging = false;
    applyMotion();
  });

  return true;
}

async function bootHEarthControls(context = {}) {
  if (bootPromise) return bootPromise;

  bootPromise = (async () => {
    controlsState.bootedAt = new Date().toISOString();
    controlsState.status = "booting";

    ensurePanel();

    const canvasStatus = context.canvasStatus || readCanvasStatus();
    controlsState.canvasStatus = canvasStatus;

    const proofPassed = canvasProofPasses(canvasStatus);
    const canvas = findCanvas();

    if (!proofPassed) {
      controlsState.status = "held-canvas-proof-incomplete";
      controlsState.controlsAuthorized = false;
      controlsState.motionAuthorized = false;
      controlsState.inputAuthorized = false;
      publishStatus();
      return getHEarthControlsStatus();
    }

    if (!canvas) {
      controlsState.status = "held-canvas-element-missing";
      controlsState.controlsAuthorized = false;
      controlsState.motionAuthorized = false;
      controlsState.inputAuthorized = false;
      publishStatus();
      return getHEarthControlsStatus();
    }

    controlsState.status = "active-motion-input-authority";
    controlsState.controlsAuthorized = true;
    controlsState.motionAuthorized = true;
    controlsState.inputAuthorized = true;
    controlsState.parentMutationAuthorized = false;

    bindButtons();
    bindPointerInput();
    applyMotion();
    publishStatus();

    return getHEarthControlsStatus();
  })();

  return bootPromise;
}

function getHEarthControlsStatus() {
  return {
    contract: H_EARTH_CONTROLS_CONTRACT,
    receipt: H_EARTH_CONTROLS_CONTRACT,
    previous: H_EARTH_CONTROLS_PREVIOUS,
    expectedCanvas: H_EARTH_EXPECTED_CANVAS,
    status: controlsState.status,
    controlsAuthorized: controlsState.controlsAuthorized,
    motionAuthorized: controlsState.motionAuthorized,
    inputAuthorized: controlsState.inputAuthorized,
    parentMutationAuthorized: false,
    yaw: controlsState.yaw,
    pitch: controlsState.pitch,
    zoom: controlsState.zoom,
    canvasContract: controlsState.canvasStatus?.contract || null,
    canvasProofPassed: canvasProofPasses(controlsState.canvasStatus),
    bootedAt: controlsState.bootedAt,
    updatedAt: controlsState.updatedAt,
    errors: [...controlsState.errors]
  };
}

function exposeControlsApi() {
  const api = {
    contract: H_EARTH_CONTROLS_CONTRACT,
    receipt: H_EARTH_CONTROLS_CONTRACT,
    boot: bootHEarthControls,
    bootHEarthControls,
    status: getHEarthControlsStatus,
    getStatus: getHEarthControlsStatus,
    getHEarthControlsStatus,
    reset: resetControls,
    controlsAuthorized: () => controlsState.controlsAuthorized,
    motionAuthorized: () => controlsState.motionAuthorized,
    inputAuthorized: () => controlsState.inputAuthorized
  };

  window.DGBHEarthControls = api;
  window.HEarthControls = api;
  window.H_EARTH_CONTROLS = api;
  window.H_EARTH_CONTROLS_RECEIPT = H_EARTH_CONTROLS_CONTRACT;
}

exposeControlsApi();

export {
  H_EARTH_CONTROLS_CONTRACT,
  H_EARTH_CONTROLS_PREVIOUS,
  H_EARTH_EXPECTED_CANVAS,
  bootHEarthControls,
  getHEarthControlsStatus
};

export default {
  contract: H_EARTH_CONTROLS_CONTRACT,
  receipt: H_EARTH_CONTROLS_CONTRACT,
  previous: H_EARTH_CONTROLS_PREVIOUS,
  boot: bootHEarthControls,
  bootHEarthControls,
  status: getHEarthControlsStatus,
  getStatus: getHEarthControlsStatus,
  getHEarthControlsStatus
};

// /assets/h-earth/h-earth.canvas.alignment.v3.js
// H_EARTH_G1_CANVAS_CONTROLS_RECEIPT_ALIGNMENT_TNT_v3
// Full-file replacement. 
// Renewed canvas asset path.
// Canvas child authority only.
//
// Purpose:
// - Break stale same-path canvas serving.
// - Preserve existing visible-composition behavior from the parent-instance consumer.
// - Expose the renewed canvas receipt expected by route v10.
// - Align canvas panel with controls state after controls activate.
// - Keep parent truth immutable.

const H_EARTH_CANVAS_CONTRACT = "H_EARTH_G1_CANVAS_CONTROLS_RECEIPT_ALIGNMENT_TNT_v3";
const H_EARTH_CANVAS_PREVIOUS_CONTRACT = "H_EARTH_G1_CANVAS_PARENT_INSTANCE_CONSUMER_TNT_v2";
const H_EARTH_LEGACY_CANVAS_PATH = "/assets/h-earth/h-earth.canvas.js";
const H_EARTH_EXPECTED_CONTROLS = "H_EARTH_G1_CONTROLS_MOTION_INPUT_AUTHORITY_TNT_v1";

let legacyCanvasModule = null;
let bootPromise = null;

const alignmentState = {
  contract: H_EARTH_CANVAS_CONTRACT,
  previousContract: H_EARTH_CANVAS_PREVIOUS_CONTRACT,
  legacyCanvasPath: H_EARTH_LEGACY_CANVAS_PATH,
  status: "not-started",
  legacyStatus: null,
  alignedStatus: null,
  controlsReceipt: "pending",
  controlsStatus: "pending",
  controlsAuthorized: false,
  motionAuthorized: false,
  inputAuthorized: false,
  canvasControlsReceiptAligned: false,
  parentMutationAuthorized: false,
  bootedAt: null,
  alignedAt: null,
  errors: []
};

function safeError(error) {
  if (!error) return "unknown error";
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  return String(error);
}

function recordError(label, error) {
  alignmentState.errors.push({
    label,
    message: safeError(error)
  });
}

function legacyUrl() {
  return `${H_EARTH_LEGACY_CANVAS_PATH}?v=${encodeURIComponent(H_EARTH_CANVAS_CONTRACT)}-${Date.now()}`;
}

async function loadLegacyCanvas() {
  if (legacyCanvasModule) return legacyCanvasModule;

  legacyCanvasModule = await import(legacyUrl());

  if (!legacyCanvasModule || typeof legacyCanvasModule.bootHEarthCanvas !== "function") {
    throw new Error("legacy canvas export missing: bootHEarthCanvas");
  }

  return legacyCanvasModule;
}

function readControlsStatus(providedStatus = null) {
  const api =
    window.DGBHEarthControls ||
    window.HEarthControls ||
    window.H_EARTH_CONTROLS ||
    null;

  let status = providedStatus || null;

  if (!status && api) {
    if (typeof api.getHEarthControlsStatus === "function") status = api.getHEarthControlsStatus();
    else if (typeof api.getStatus === "function") status = api.getStatus();
    else if (typeof api.status === "function") status = api.status();
  }

  const receipt =
    status?.contract ||
    status?.receipt ||
    window.H_EARTH_CONTROLS_RECEIPT ||
    "pending";

  const active =
    receipt === H_EARTH_EXPECTED_CONTROLS &&
    status?.status === "active-motion-input-authority" &&
    status?.controlsAuthorized === true &&
    status?.motionAuthorized === true &&
    status?.inputAuthorized === true &&
    status?.parentMutationAuthorized === false;

  alignmentState.controlsReceipt = receipt;
  alignmentState.controlsStatus = status?.status || (api ? "loaded-held" : "pending");
  alignmentState.controlsAuthorized = active;
  alignmentState.motionAuthorized = active;
  alignmentState.inputAuthorized = active;
  alignmentState.parentMutationAuthorized = false;
  alignmentState.canvasControlsReceiptAligned = active;

  if (active) alignmentState.alignedAt = new Date().toISOString();

  return status;
}

function alignStatus(legacyStatus = null, controlsStatus = null) {
  const base = legacyStatus || alignmentState.legacyStatus || {};
  readControlsStatus(controlsStatus);

  const aligned = {
    ...base,
    contract: H_EARTH_CANVAS_CONTRACT,
    receipt: H_EARTH_CANVAS_CONTRACT,
    previousContract: H_EARTH_CANVAS_PREVIOUS_CONTRACT,
    legacyContract: base.contract || base.receipt || H_EARTH_CANVAS_PREVIOUS_CONTRACT,
    legacyCanvasPath: H_EARTH_LEGACY_CANVAS_PATH,
    renewedCanvasAssetPath: "/assets/h-earth/h-earth.canvas.alignment.v3.js",
    expectedControls: H_EARTH_EXPECTED_CONTROLS,
    controlsReceipt: alignmentState.controlsReceipt,
    controlsStatus: alignmentState.controlsStatus,
    controlsAuthorized: alignmentState.controlsAuthorized,
    motionAuthorized: alignmentState.motionAuthorized,
    inputAuthorized: alignmentState.inputAuthorized,
    canvasControlsReceiptAligned: alignmentState.canvasControlsReceiptAligned,
    parentMutationAuthorized: false,
    earthMutationAuthorized: false,
    hearthMutationAuthorized: false,
    audraliaMutationAuthorized: false,
    alignedAt: alignmentState.alignedAt,
    errors: [
      ...(Array.isArray(base.errors) ? base.errors : []),
      ...alignmentState.errors
    ]
  };

  alignmentState.alignedStatus = aligned;
  alignmentState.status = aligned.canvasControlsReceiptAligned
    ? "controls-receipt-aligned"
    : "canvas-visible-composition-active-controls-pending";

  return aligned;
}

function findCanvasPanel() {
  return document.querySelector("[data-h-earth-canvas-panel]");
}

function ensureCanvasPanelStatusTarget() {
  const panel = findCanvasPanel();
  if (!panel) return null;

  let target = panel.querySelector("[data-h-earth-canvas-status]");
  if (!target) {
    target = document.createElement("div");
    target.setAttribute("data-h-earth-canvas-status", "");
    target.setAttribute("aria-live", "polite");
    panel.appendChild(target);
  }

  return target;
}

function updateCanvasPanelCopy() {
  const panel = findCanvasPanel();
  if (!panel) return;

  const title = panel.querySelector("[data-h-earth-canvas-title]");
  if (title) {
    title.textContent = "H-Earth Canvas Controls Receipt Alignment";
  }

  const copy = panel.querySelector("[data-h-earth-canvas-copy]");
  if (copy) {
    copy.textContent =
      "Canvas is active as a downstream visible-composition child. It consumes read-only parent truth and aligns with controls when motion/input authority activates. Parent truth remains immutable.";
  }
}

function renderStatusCards(status) {
  const target = ensureCanvasPanelStatusTarget();
  if (!target) return;

  target.innerHTML = `
    <span><strong>Contract</strong>${status.contract}</span>
    <span><strong>Previous</strong>${status.previousContract}</span>
    <span><strong>Legacy canvas</strong>${status.legacyContract || "pending"}</span>
    <span><strong>Asset path</strong>${status.renewedCanvasAssetPath}</span>
    <span><strong>Consumption mode</strong>${status.parentConsumptionMode || "pending"}</span>
    <span><strong>Parent surface ready</strong>${String(status.parentSurfaceReady === true)}</span>
    <span><strong>Canvas may read surface</strong>${String(status.downstreamCanvasMayReadSurface === true)}</span>
    <span><strong>Cells resolved</strong>${status.cellsResolved ?? "pending"}/256</span>
    <span><strong>Cells painted</strong>${status.cellsPainted ?? "pending"}/256</span>
    <span><strong>Material classes</strong>${status.surfaceMaterialClasses ?? "pending"}</span>
    <span><strong>Land / ocean cells</strong>${status.landCells ?? "pending"} / ${status.oceanCells ?? "pending"}</span>
    <span><strong>Nonblank pixel proof</strong>${Number(status.nonBlankPixelRatio || 0).toFixed(4)}</span>
    <span><strong>Render status</strong>${status.renderStatus || "pending"}</span>
    <span><strong>Controls receipt</strong>${status.controlsReceipt}</span>
    <span><strong>Controls status</strong>${status.controlsStatus}</span>
    <span><strong>Controls aligned</strong>${String(status.canvasControlsReceiptAligned === true)}</span>
    <span><strong>Parent mutation</strong>forbidden</span>
  `;
}

function exposeCanvasApi() {
  const api = {
    contract: H_EARTH_CANVAS_CONTRACT,
    receipt: H_EARTH_CANVAS_CONTRACT,
    previousContract: H_EARTH_CANVAS_PREVIOUS_CONTRACT,
    legacyCanvasPath: H_EARTH_LEGACY_CANVAS_PATH,
    boot: bootHEarthCanvas,
    bootHEarthCanvas,
    status: getHEarthCanvasStatus,
    getStatus: getHEarthCanvasStatus,
    getHEarthCanvasStatus,
    refreshControlsStatus: refreshHEarthCanvasControlsStatus,
    refreshHEarthCanvasControlsStatus,
    controlsAuthorized: () => alignmentState.controlsAuthorized,
    motionAuthorized: () => alignmentState.motionAuthorized,
    inputAuthorized: () => alignmentState.inputAuthorized
  };

  window.DGBHEarthCanvas = api;
  window.HEarthCanvas = api;
  window.H_EARTH_CANVAS = api;
  window.H_EARTH_CANVAS_RECEIPT = H_EARTH_CANVAS_CONTRACT;

  document.documentElement.dataset.hEarthCanvasReceipt = H_EARTH_CANVAS_CONTRACT;
  document.documentElement.dataset.hEarthCanvasPreviousReceipt = H_EARTH_CANVAS_PREVIOUS_CONTRACT;
  document.documentElement.dataset.hEarthCanvasAssetPath = "/assets/h-earth/h-earth.canvas.alignment.v3.js";
  document.documentElement.dataset.hEarthCanvasControlsReceiptAligned = String(alignmentState.canvasControlsReceiptAligned);
  document.documentElement.dataset.hEarthCanvasControlsStatus = alignmentState.controlsStatus;
  document.documentElement.dataset.hEarthCanvasControlsAuthorized = String(alignmentState.controlsAuthorized);
  document.documentElement.dataset.hEarthParentMutationAuthorized = "false";
}

async function bootHEarthCanvas(context = {}) {
  if (bootPromise) return bootPromise;

  bootPromise = (async () => {
    alignmentState.bootedAt = new Date().toISOString();
    alignmentState.status = "booting-renewed-canvas-asset-path";

    try {
      const legacy = await loadLegacyCanvas();
      const legacyStatus = await legacy.bootHEarthCanvas(context);

      alignmentState.legacyStatus = legacyStatus || null;

      const aligned = alignStatus(legacyStatus);
      updateCanvasPanelCopy();
      renderStatusCards(aligned);
      exposeCanvasApi();

      return aligned;
    } catch (error) {
      recordError("boot-renewed-canvas-asset-path", error);

      const failed = alignStatus({
        contract: H_EARTH_CANVAS_PREVIOUS_CONTRACT,
        receipt: H_EARTH_CANVAS_PREVIOUS_CONTRACT,
        renderStatus: "failed-renewed-canvas-asset-path",
        cellsResolved: 0,
        cellsPainted: 0,
        nonBlankPixelRatio: 0,
        parentSurfaceReady: false,
        downstreamCanvasMayReadSurface: false
      });

      renderStatusCards(failed);
      exposeCanvasApi();

      return failed;
    }
  })();

  return bootPromise;
}

function refreshHEarthCanvasControlsStatus(controlsStatus = null) {
  const aligned = alignStatus(alignmentState.legacyStatus, controlsStatus);

  updateCanvasPanelCopy();
  renderStatusCards(aligned);
  exposeCanvasApi();

  return aligned;
}

function getHEarthCanvasStatus() {
  const aligned = alignStatus(alignmentState.legacyStatus);

  updateCanvasPanelCopy();
  renderStatusCards(aligned);
  exposeCanvasApi();

  return aligned;
}

exposeCanvasApi();

export {
  H_EARTH_CANVAS_CONTRACT,
  H_EARTH_CANVAS_PREVIOUS_CONTRACT,
  H_EARTH_EXPECTED_CONTROLS,
  bootHEarthCanvas,
  getHEarthCanvasStatus,
  refreshHEarthCanvasControlsStatus
};

export default {
  contract: H_EARTH_CANVAS_CONTRACT,
  receipt: H_EARTH_CANVAS_CONTRACT,
  previousContract: H_EARTH_CANVAS_PREVIOUS_CONTRACT,
  legacyCanvasPath: H_EARTH_LEGACY_CANVAS_PATH,
  boot: bootHEarthCanvas,
  bootHEarthCanvas,
  status: getHEarthCanvasStatus,
  getStatus: getHEarthCanvasStatus,
  getHEarthCanvasStatus,
  refreshControlsStatus: refreshHEarthCanvasControlsStatus,
  refreshHEarthCanvasControlsStatus
};

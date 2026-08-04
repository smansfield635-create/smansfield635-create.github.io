import { loadCanonicalCatalog } from "./catalog-source.mjs";
import { buildSpatialRegistry } from "./descriptor-registry.mjs";
import { assertSpatialRegistry } from "./descriptor-schema.mjs";
import { resolveSceneState, createReturnSnapshot } from "./resolver.mjs";
import { MethodsNativeBridge } from "./native-bridge.mjs";
import { MethodsSpatialRenderer } from "./renderer.mjs";

const stage = document.querySelector("[data-spatial-stage]");
const iframe = document.querySelector("[data-native-methods-frame]");
const inspection = document.querySelector("[data-spatial-inspection]");
const inspectionClose = document.querySelector("[data-spatial-inspection-close]");
const inspectionTitle = document.querySelector("[data-spatial-inspection-title]");
const inspectionEquation = document.querySelector("[data-spatial-inspection-equation]");
const inspectionBody = document.querySelector("[data-spatial-inspection-body]");
const cameraButtons = Array.from(document.querySelectorAll("[data-camera-mode]"));

let catalog;
let registry;
let bridge;
let renderer;
let nativeState;
let currentResolved;
let cameraMode = "overview";
let inspectionOpen = false;
let returnSnapshot = null;
let inputMode = matchMedia("(pointer: coarse)").matches ? "touch" : "pointer";
let renderQueue = Promise.resolve();
let lastNativeSignature = "";

function viewport() {
  return Object.freeze({ width: innerWidth, height: innerHeight });
}

function modelById(modelId) {
  for (const family of catalog) {
    const model = family.models.find(candidate => candidate.id === modelId);
    if (model) return Object.freeze({ ...model, family });
  }
  return null;
}

function nativeSignature(detail) {
  return [detail?.z?.familyId, detail?.x?.modelId, detail?.y?.lens, detail?.display].join("|");
}

function updateCameraControls() {
  cameraButtons.forEach(button => {
    const active = button.dataset.cameraMode === cameraMode;
    button.setAttribute("aria-pressed", String(active));
    button.dataset.active = String(active);
  });
}

function resolveCurrent() {
  if (!nativeState) return null;
  currentResolved = resolveSceneState({
    registry,
    nativeState,
    cameraMode,
    inspectionOpen,
    viewport: viewport()
  });
  return currentResolved;
}

function scheduleRender(reason, options = {}) {
  renderQueue = renderQueue.then(async () => {
    const resolved = resolveCurrent();
    if (!resolved) return null;
    const receipt = await renderer.update(resolved, { reason, animate: options.animate !== false });
    document.documentElement.dataset.methodsSpatialOperational = "true";
    return receipt;
  }).catch(error => {
    document.documentElement.dataset.methodsSpatialOperational = "error";
    document.querySelector("[data-spatial-status]").textContent = error.message;
    console.error(error);
    throw error;
  });
  return renderQueue;
}

function openInspectionView() {
  const model = modelById(nativeState.x.modelId);
  if (!model) throw new Error(`METHODS_INSPECTION_MODEL_UNRESOLVED:${nativeState.x.modelId}`);
  inspectionTitle.textContent = model.title;
  inspectionEquation.innerHTML = model.equation;
  const lensId = nativeState.y.lens || "practical";
  inspectionBody.textContent = model[lensId] || model.statement;
  inspection.hidden = false;
  inspection.dataset.open = "true";
  inspectionClose.focus({ preventScroll: true });
}

function closeInspectionView() {
  inspection.hidden = true;
  inspection.dataset.open = "false";
}

function captureSnapshot() {
  const activeElement = document.activeElement;
  returnSnapshot = createReturnSnapshot({
    resolvedScene: currentResolved,
    cameraMode,
    scrollPosition: Object.freeze({ x: scrollX, y: scrollY }),
    focusTarget: activeElement?.id || activeElement?.dataset?.control || activeElement?.tagName || "BODY",
    inputMode,
    viewport: viewport()
  });
  returnSnapshot = Object.freeze({ ...returnSnapshot });
  globalThis.__METHODS_SPATIAL_RETURN_SNAPSHOT = returnSnapshot;
}

function emitReturnReceipt(reached) {
  const currentFocus = document.activeElement?.id || document.activeElement?.dataset?.control || document.activeElement?.tagName || "BODY";
  const receipt = Object.freeze({
    contract: "METHODS_MODELS_RENDERER_EXACT_RETURN_RECEIPT_v1",
    snapshot: returnSnapshot,
    reached: Object.freeze({
      nativeFamily: reached.native.familyId,
      nativeModel: reached.native.modelId,
      nativeLens: reached.native.lensId,
      displayState: reached.native.displayState,
      cameraPreset: reached.camera.preset,
      cameraTarget: Object.freeze([...reached.camera.target]),
      centeredRenderTarget: reached.activeDescriptor.modelId,
      visibleCluster: Object.freeze([...reached.visibleCluster]),
      scrollPosition: Object.freeze({ x: scrollX, y: scrollY }),
      focusTarget: currentFocus,
      inputMode,
      viewportClass: reached.viewportClass
    }),
    exactNativeReturn: reached.native.familyId === returnSnapshot.nativeFamily && reached.native.modelId === returnSnapshot.nativeModel && reached.native.lensId === returnSnapshot.nativeLens,
    exactCameraRoleReturn: cameraMode === returnSnapshot.requestedCameraMode,
    exactCenteredTargetReturn: reached.activeDescriptor.modelId === returnSnapshot.centeredRenderTarget,
    exactVisibleClusterReturn: JSON.stringify(reached.visibleCluster) === JSON.stringify(returnSnapshot.visibleCluster),
    productAcceptanceGranted: false
  });
  globalThis.__METHODS_SPATIAL_RETURN_RECEIPT = receipt;
  globalThis.dispatchEvent(new CustomEvent("METHODS_MODELS_RENDERER_EXACT_RETURN_RECEIPT", { detail: receipt }));
  return receipt;
}

async function handleInspectionChange(event) {
  if (event.detail.open) {
    if (!returnSnapshot) captureSnapshot();
    inspectionOpen = true;
    openInspectionView();
    await scheduleRender("inspection-entry");
    return;
  }

  if (!inspectionOpen) return;
  inspectionOpen = false;
  closeInspectionView();
  cameraMode = returnSnapshot.requestedCameraMode;
  updateCameraControls();
  await scheduleRender("inspection-exact-return");
  scrollTo({ left: returnSnapshot.scrollPosition.x, top: returnSnapshot.scrollPosition.y, behavior: "auto" });
  const focusCandidate = document.getElementById(returnSnapshot.focusTarget) || document.querySelector(`[data-control="${CSS.escape(returnSnapshot.focusTarget)}"]`) || renderer.activeNode();
  focusCandidate?.focus({ preventScroll: true });
  emitReturnReceipt(currentResolved);
  returnSnapshot = null;
}

function bindControls() {
  document.querySelector("[data-control='model-previous']").addEventListener("click", () => bridge.moveModel(-1));
  document.querySelector("[data-control='model-next']").addEventListener("click", () => bridge.moveModel(1));
  document.querySelector("[data-control='family-previous']").addEventListener("click", () => bridge.moveFamily(-1));
  document.querySelector("[data-control='family-next']").addEventListener("click", () => bridge.moveFamily(1));
  document.querySelector("[data-control='lens-previous']").addEventListener("click", () => bridge.moveLens(-1));
  document.querySelector("[data-control='lens-next']").addEventListener("click", () => bridge.moveLens(1));
  document.querySelector("[data-control='inspect']").addEventListener("click", () => {
    captureSnapshot();
    bridge.openInspection();
  });
  inspectionClose.addEventListener("click", () => bridge.closeInspection());
  cameraButtons.forEach(button => button.addEventListener("click", () => {
    cameraMode = button.dataset.cameraMode;
    updateCameraControls();
    scheduleRender(`camera-${cameraMode}`);
  }));

  addEventListener("keydown", event => {
    inputMode = "keyboard";
    if (inspectionOpen) return;
    if (event.key === "ArrowLeft") bridge.moveModel(-1);
    else if (event.key === "ArrowRight") bridge.moveModel(1);
    else if (event.key === "ArrowUp") bridge.moveLens(-1);
    else if (event.key === "ArrowDown") bridge.moveLens(1);
    else if (event.key === "[") bridge.moveFamily(-1);
    else if (event.key === "]") bridge.moveFamily(1);
  });
  addEventListener("pointerdown", event => { inputMode = event.pointerType || "pointer"; }, { passive: true });
  addEventListener("resize", () => scheduleRender("viewport-resolve", { animate: false }));
}

async function initialize() {
  catalog = await loadCanonicalCatalog();
  registry = assertSpatialRegistry(buildSpatialRegistry(catalog));
  renderer = new MethodsSpatialRenderer({ stage, registry, catalog });
  bridge = new MethodsNativeBridge(iframe);
  bridge.addEventListener("statechange", event => {
    const next = event.detail.detail;
    const signature = nativeSignature(next);
    if (signature === lastNativeSignature && nativeState) return;
    lastNativeSignature = signature;
    nativeState = next;
    scheduleRender(`native-${event.detail.source}`);
  });
  bridge.addEventListener("inspectionchange", handleInspectionChange);
  bindControls();
  updateCameraControls();
  await bridge.start();
  await renderQueue;

  globalThis.__METHODS_SPATIAL_APP = Object.freeze({
    contract: "METHODS_MODELS_CATEGORICAL_SPATIAL_TEMPLATE_VERTICAL_SLICE_v1",
    registry,
    get nativeState() { return nativeState; },
    get resolvedScene() { return currentResolved; },
    get cameraMode() { return cameraMode; },
    get inspectionOpen() { return inspectionOpen; },
    get receipts() { return renderer.receipts; },
    setCameraMode(mode) {
      if (!new Set(["overview", "browse"]).has(mode)) throw new Error(`METHODS_CAMERA_MODE_INVALID:${mode}`);
      cameraMode = mode;
      updateCameraControls();
      return scheduleRender(`api-camera-${mode}`);
    },
    moveModel: delta => bridge.moveModel(delta),
    moveFamily: delta => bridge.moveFamily(delta),
    moveLens: delta => bridge.moveLens(delta),
    inspect: () => {
      captureSnapshot();
      bridge.openInspection();
    },
    closeInspection: () => bridge.closeInspection(),
    whenStable: () => renderQueue
  });
  document.documentElement.dataset.methodsSpatialReady = "true";
  dispatchEvent(new CustomEvent("METHODS_MODELS_SPATIAL_TEMPLATE_READY", { detail: { registryCount: registry.modelCount } }));
}

initialize().catch(error => {
  document.documentElement.dataset.methodsSpatialReady = "error";
  document.querySelector("[data-spatial-status]").textContent = error.message;
  console.error(error);
});

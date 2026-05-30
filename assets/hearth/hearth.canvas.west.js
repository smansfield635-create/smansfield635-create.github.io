// /assets/hearth/hearth.canvas.west.js
// HEARTH_CANVAS_WEST_INVALIDATION_INSPECTION_MACHINE_TNT_v1
// Full-file replacement.
// Canvas West / inspection, drag, zoom, and invalidation only.
// Purpose:
// - Own drag inspection and zoom mechanics.
// - Own invalidation signal policy.
// - Preserve cached texture repaint behavior without rebuilding atlas on every interaction.
// - Keep visual interaction separate from source truth and rendering.
// Does not own:
// - material truth
// - atlas formation
// - sphere drawing
// - visible proof
// - F21
// - route readiness
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_WEST_INVALIDATION_INSPECTION_MACHINE_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_WEST_INVALIDATION_INSPECTION_MACHINE_RECEIPT_v1";
  const VERSION = "2026-05-30.hearth-canvas-west-invalidation-inspection-machine-v1";
  const FILE = "/assets/hearth/hearth.canvas.west.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const ZOOM_MIN = 0.82;
  const ZOOM_MAX = 2.8;
  const ZOOM_DEFAULT = 1;

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    file: FILE,
    role: "canvas-west-invalidation-inspection-machine",

    dragInspectionBound: false,
    zoomInspectionBound: false,
    interactiveRotationActive: true,
    pointerInspectionActive: false,
    pointerInspectionPainted: false,
    pointerDragCount: 0,
    interactiveFrameCount: 0,
    lastInteractionAt: "",
    lastPointerDeltaX: 0,
    lastPointerDeltaY: 0,

    rotationYaw: -0.18,
    rotationPitch: 0.05,
    rotationVelocityYaw: 0,
    rotationVelocityPitch: 0,
    inertiaActive: false,
    inertiaFrame: 0,

    zoomEnabled: true,
    zoomLevel: ZOOM_DEFAULT,
    zoomMin: ZOOM_MIN,
    zoomMax: ZOOM_MAX,
    zoomLodPrepared: true,
    zoomLodLevel: 1,
    zoomUsesCachedTexture: true,
    zoomDoesNotOwnPlanetTruth: true,
    zoomDoesNotTriggerAtlasRebuild: true,
    zoomInteractionCount: 0,
    lastZoomAt: "",
    lastZoomSource: "",

    invalidationActive: true,
    invalidated: false,
    invalidationCount: 0,
    invalidationReason: "",
    staleSourceMaskProtectionActive: true,

    boundCanvas: null,
    onChange: null,
    onInvalidate: null,
    errors: [],
    updatedAt: nowIso(),

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  function nowIso() {
    try { return new Date().toISOString(); } catch (_error) { return ""; }
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function clamp(value, min, max) {
    const n = safeNumber(value, min);
    return Math.max(min, Math.min(max, n));
  }

  function recordError(code, error) {
    const item = {
      at: nowIso(),
      code,
      message: error && error.message ? error.message : String(error || "")
    };
    state.errors.push(item);
    if (state.errors.length > 80) state.errors.splice(0, state.errors.length - 80);
    state.updatedAt = item.at;
    return item;
  }

  function zoomLodFor(value) {
    const z = clamp(value, ZOOM_MIN, ZOOM_MAX);
    if (z >= 2.35) return 4;
    if (z >= 1.85) return 3;
    if (z >= 1.28) return 2;
    return 1;
  }

  function publishCanvasDataset() {
    if (!state.boundCanvas) return;

    state.boundCanvas.dataset.hearthCanvasWestContract = CONTRACT;
    state.boundCanvas.dataset.hearthInspectDragging = String(state.pointerInspectionActive);
    state.boundCanvas.dataset.hearthZoomLevel = String(Number(state.zoomLevel.toFixed(3)));
    state.boundCanvas.dataset.hearthZoomLodLevel = String(state.zoomLodLevel);
    state.boundCanvas.dataset.hearthRotationYaw = String(Number(state.rotationYaw.toFixed(4)));
    state.boundCanvas.dataset.hearthRotationPitch = String(Number(state.rotationPitch.toFixed(4)));
    state.boundCanvas.dataset.hearthInspectDeltaX = String(state.lastPointerDeltaX);
    state.boundCanvas.dataset.hearthInspectDeltaY = String(state.lastPointerDeltaY);
    state.boundCanvas.dataset.visualPassClaimed = "false";
  }

  function notifyChange() {
    state.updatedAt = nowIso();
    publishCanvasDataset();

    if (isFunction(state.onChange)) {
      try { state.onChange(getViewState(), getReceipt()); }
      catch (error) { recordError("WEST_ON_CHANGE_FAILED", error); }
    }
  }

  function invalidate(reason = "manual-west-invalidation") {
    state.invalidated = true;
    state.invalidationCount += 1;
    state.invalidationReason = String(reason || "manual-west-invalidation");
    state.updatedAt = nowIso();

    if (isFunction(state.onInvalidate)) {
      try { state.onInvalidate(state.invalidationReason, getReceipt()); }
      catch (error) { recordError("WEST_ON_INVALIDATE_FAILED", error); }
    }

    return getReceipt();
  }

  function consumeInvalidation() {
    const wasInvalidated = state.invalidated;
    const reason = state.invalidationReason;
    state.invalidated = false;
    state.invalidationReason = "";
    state.updatedAt = nowIso();
    return { wasInvalidated, reason };
  }

  function setZoom(value = ZOOM_DEFAULT, options = {}) {
    const next = clamp(safeNumber(value, state.zoomLevel), ZOOM_MIN, ZOOM_MAX);
    const changed = Math.abs(next - state.zoomLevel) > 0.0001;

    state.zoomLevel = next;
    state.zoomLodLevel = zoomLodFor(next);
    state.zoomInteractionCount += changed ? 1 : 0;
    state.lastZoomAt = nowIso();
    state.lastZoomSource = options.source || "api";
    state.zoomUsesCachedTexture = true;
    state.zoomDoesNotTriggerAtlasRebuild = true;

    notifyChange();
    return getReceipt();
  }

  function zoomIn(step = 0.18) {
    return setZoom(state.zoomLevel + Math.abs(safeNumber(step, 0.18)), { source: "zoomIn" });
  }

  function zoomOut(step = 0.18) {
    return setZoom(state.zoomLevel - Math.abs(safeNumber(step, 0.18)), { source: "zoomOut" });
  }

  function resetZoom() {
    return setZoom(ZOOM_DEFAULT, { source: "resetZoom" });
  }

  function setRotation(yaw = 0, pitch = 0) {
    state.rotationYaw = safeNumber(yaw, state.rotationYaw);
    state.rotationPitch = clamp(safeNumber(pitch, state.rotationPitch), -1.05, 1.05);
    state.rotationVelocityYaw = 0;
    state.rotationVelocityPitch = 0;
    notifyChange();
    return getReceipt();
  }

  function resetRotation() {
    state.rotationYaw = -0.18;
    state.rotationPitch = 0.05;
    state.rotationVelocityYaw = 0;
    state.rotationVelocityPitch = 0;
    notifyChange();
    return getReceipt();
  }

  function startInertia() {
    if (state.inertiaActive) return;

    const minVelocity = 0.0005;
    state.inertiaActive = true;

    const step = () => {
      if (!state.inertiaActive) return;

      state.rotationVelocityYaw *= 0.92;
      state.rotationVelocityPitch *= 0.86;

      if (Math.abs(state.rotationVelocityYaw) < minVelocity && Math.abs(state.rotationVelocityPitch) < minVelocity) {
        state.inertiaActive = false;
        return;
      }

      state.rotationYaw += state.rotationVelocityYaw;
      state.rotationPitch = clamp(state.rotationPitch + state.rotationVelocityPitch, -1.05, 1.05);
      state.inertiaFrame += 1;

      notifyChange();

      if (typeof root.requestAnimationFrame === "function") root.requestAnimationFrame(step);
      else root.setTimeout(step, 16);
    };

    if (typeof root.requestAnimationFrame === "function") root.requestAnimationFrame(step);
    else root.setTimeout(step, 16);
  }

  function bindInspection(options = {}) {
    const canvas = options.canvas;
    if (!canvas || canvas.nodeType !== 1) throw new Error("Canvas West bindInspection requires a canvas element.");

    state.boundCanvas = canvas;
    state.onChange = isFunction(options.onChange) ? options.onChange : state.onChange;
    state.onInvalidate = isFunction(options.onInvalidate) ? options.onInvalidate : state.onInvalidate;

    if (canvas.dataset.hearthCanvasWestBound === "true") {
      state.dragInspectionBound = true;
      state.zoomInspectionBound = true;
      publishCanvasDataset();
      return getReceipt();
    }

    const pointers = new Map();
    let dragging = false;
    let pointerId = null;
    let lastX = 0;
    let lastY = 0;
    let pinchStartDistance = 0;
    let pinchStartZoom = state.zoomLevel;

    const distanceBetweenPointers = () => {
      const values = Array.from(pointers.values());
      if (values.length < 2) return 0;
      const a = values[0];
      const b = values[1];
      return Math.hypot(a.x - b.x, a.y - b.y);
    };

    const onDown = (event) => {
      pointers.set(event.pointerId, { x: event.clientX || 0, y: event.clientY || 0 });

      if (pointers.size >= 2) {
        dragging = false;
        pointerId = null;
        pinchStartDistance = distanceBetweenPointers() || 1;
        pinchStartZoom = state.zoomLevel;
        state.pointerInspectionActive = true;
        canvas.dataset.hearthInspectDragging = "pinch";
      } else {
        dragging = true;
        pointerId = event.pointerId;
        lastX = event.clientX || 0;
        lastY = event.clientY || 0;
        state.pointerInspectionActive = true;
        canvas.dataset.hearthInspectDragging = "true";
      }

      canvas.style.cursor = "grabbing";

      if (isFunction(canvas.setPointerCapture)) {
        try { canvas.setPointerCapture(event.pointerId); } catch (_error) {}
      }

      if (isFunction(event.preventDefault)) event.preventDefault();
      notifyChange();
    };

    const onMove = (event) => {
      if (pointers.has(event.pointerId)) {
        pointers.set(event.pointerId, { x: event.clientX || 0, y: event.clientY || 0 });
      }

      if (pointers.size >= 2) {
        const distance = distanceBetweenPointers() || pinchStartDistance || 1;
        setZoom(pinchStartZoom * (distance / Math.max(1, pinchStartDistance)), { source: "pinch" });
        if (isFunction(event.preventDefault)) event.preventDefault();
        return;
      }

      if (!dragging || event.pointerId !== pointerId) return;

      const x = event.clientX || 0;
      const y = event.clientY || 0;
      const dx = x - lastX;
      const dy = y - lastY;

      lastX = x;
      lastY = y;

      state.pointerDragCount += 1;
      state.pointerInspectionPainted = true;
      state.interactiveFrameCount += 1;
      state.lastPointerDeltaX = Math.round(dx);
      state.lastPointerDeltaY = Math.round(dy);

      state.rotationYaw += dx * 0.0085;
      state.rotationPitch = clamp(state.rotationPitch + dy * 0.0065, -1.05, 1.05);
      state.rotationVelocityYaw = dx * 0.0045;
      state.rotationVelocityPitch = dy * 0.0030;
      state.lastInteractionAt = nowIso();

      notifyChange();

      if (isFunction(event.preventDefault)) event.preventDefault();
    };

    const onUp = (event) => {
      pointers.delete(event.pointerId);

      if (pointers.size >= 2) {
        pinchStartDistance = distanceBetweenPointers() || 1;
        pinchStartZoom = state.zoomLevel;
      }

      if (pointers.size === 1) {
        const remaining = Array.from(pointers.entries())[0];
        pointerId = remaining[0];
        lastX = remaining[1].x;
        lastY = remaining[1].y;
        dragging = true;
      }

      if (pointers.size === 0) {
        dragging = false;
        pointerId = null;
        state.pointerInspectionActive = false;
        canvas.dataset.hearthInspectDragging = "false";
        canvas.style.cursor = "grab";
        startInertia();
      }

      if (isFunction(event.preventDefault)) event.preventDefault();
      notifyChange();
    };

    const onWheel = (event) => {
      const delta = safeNumber(event.deltaY, 0);
      setZoom(state.zoomLevel * (delta < 0 ? 1.12 : 0.88), { source: "wheel" });
      if (isFunction(event.preventDefault)) event.preventDefault();
    };

    const onDblClick = (event) => {
      setZoom(state.zoomLevel < 1.45 ? 1.65 : ZOOM_DEFAULT, { source: "doubleclick" });
      if (isFunction(event.preventDefault)) event.preventDefault();
    };

    canvas.addEventListener("pointerdown", onDown, { passive: false });
    canvas.addEventListener("pointermove", onMove, { passive: false });
    canvas.addEventListener("pointerup", onUp, { passive: false });
    canvas.addEventListener("pointercancel", onUp, { passive: false });
    canvas.addEventListener("lostpointercapture", onUp, { passive: false });
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("dblclick", onDblClick, { passive: false });

    canvas.dataset.hearthCanvasWestBound = "true";
    canvas.style.touchAction = "none";
    canvas.style.cursor = "grab";

    state.dragInspectionBound = true;
    state.zoomInspectionBound = true;
    state.updatedAt = nowIso();

    publishCanvasDataset();
    updateDataset();
    return getReceipt();
  }

  function getViewState() {
    return {
      yaw: state.rotationYaw,
      pitch: state.rotationPitch,
      rotationYaw: state.rotationYaw,
      rotationPitch: state.rotationPitch,
      zoomLevel: state.zoomLevel,
      zoomLodLevel: state.zoomLodLevel,
      interactive: state.pointerInspectionActive || state.inertiaActive,
      dpr: root.devicePixelRatio || 1
    };
  }

  function updateDataset() {
    if (!doc || !doc.documentElement) return;
    const dataset = doc.documentElement.dataset;

    dataset.hearthCanvasWestLoaded = "true";
    dataset.hearthCanvasWestContract = CONTRACT;
    dataset.hearthCanvasWestReceipt = RECEIPT;
    dataset.hearthCanvasWestFile = FILE;
    dataset.hearthCanvasDragInspectionBound = String(state.dragInspectionBound);
    dataset.hearthCanvasZoomInspectionBound = String(state.zoomInspectionBound);
    dataset.hearthCanvasZoomLevel = String(Number(state.zoomLevel.toFixed(3)));
    dataset.hearthCanvasZoomLodLevel = String(state.zoomLodLevel);
    dataset.hearthCanvasWestInvalidated = String(state.invalidated);
    dataset.hearthCanvasWestInvalidationCount = String(state.invalidationCount);
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      role: state.role,

      dragInspectionBound: state.dragInspectionBound,
      zoomInspectionBound: state.zoomInspectionBound,
      interactiveRotationActive: state.interactiveRotationActive,
      pointerInspectionActive: state.pointerInspectionActive,
      pointerInspectionPainted: state.pointerInspectionPainted,
      pointerDragCount: state.pointerDragCount,
      interactiveFrameCount: state.interactiveFrameCount,
      lastInteractionAt: state.lastInteractionAt,
      lastPointerDeltaX: state.lastPointerDeltaX,
      lastPointerDeltaY: state.lastPointerDeltaY,

      rotationYaw: Number(state.rotationYaw.toFixed(4)),
      rotationPitch: Number(state.rotationPitch.toFixed(4)),
      inertiaActive: state.inertiaActive,
      inertiaFrame: state.inertiaFrame,

      zoomEnabled: true,
      zoomLevel: Number(state.zoomLevel.toFixed(3)),
      zoomMin: ZOOM_MIN,
      zoomMax: ZOOM_MAX,
      zoomLodPrepared: true,
      zoomLodLevel: state.zoomLodLevel,
      zoomUsesCachedTexture: true,
      zoomDoesNotOwnPlanetTruth: true,
      zoomDoesNotTriggerAtlasRebuild: true,
      zoomInteractionCount: state.zoomInteractionCount,
      lastZoomAt: state.lastZoomAt,
      lastZoomSource: state.lastZoomSource,

      invalidationActive: true,
      invalidated: state.invalidated,
      invalidationCount: state.invalidationCount,
      invalidationReason: state.invalidationReason,
      staleSourceMaskProtectionActive: true,

      ownsInteraction: true,
      ownsInvalidationSignal: true,
      ownsAtlasFormation: false,
      ownsCanvasDrawing: false,
      ownsVisibleProof: false,
      ownsF21: false,

      errors: state.errors.slice(),
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: state.updatedAt
    };
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    file: FILE,

    bindInspection,
    setZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    setRotation,
    resetRotation,
    invalidate,
    consumeInvalidation,
    getViewState,
    getReceipt,

    canvasWestActive: true,
    ownsInteraction: true,
    ownsInvalidationSignal: true,
    ownsAtlasFormation: false,
    ownsCanvasDrawing: false,
    ownsVisibleProof: false,
    ownsF21: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.canvasWest = api;
  root.HEARTH_CANVAS_WEST = api;

  root.DEXTER_LAB = root.DEXTER_LAB || {};
  root.DEXTER_LAB.hearthCanvasWest = api;

  updateDataset();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

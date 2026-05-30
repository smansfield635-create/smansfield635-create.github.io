// /assets/hearth/hearth.canvas.west.js
// HEARTH_CANVAS_WEST_INSPECTION_INVALIDATION_CONTROL_TNT_v1
// Full-file replacement.
// Canvas West / inspection, drag, zoom, and invalidation control only.
// Purpose:
// - Serve the Canvas North split parent under /assets/hearth/hearth.canvas.js.
// - Own view-state control for drag inspection, rotation, zoom, and invalidation signaling.
// - Preserve public methods required by Canvas North:
//   bindInspection, getViewState, setRotation, resetRotation, setZoom, getReceipt.
// - Keep zoom/drag as cached-texture inspection only.
// - Do not trigger atlas rebuild from ordinary zoom or drag.
// - Provide explicit invalidation hooks only when requested.
// - Preserve NEWS/Fibonacci F13 synchronization.
// Does not own:
// - planet truth
// - material truth
// - hydrology truth
// - atlas formation
// - texture composition
// - sphere rendering
// - visible proof
// - Runtime Table governance
// - route readiness
// - F21
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_WEST_INSPECTION_INVALIDATION_CONTROL_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_WEST_INSPECTION_INVALIDATION_CONTROL_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_CARDINAL_SPLIT_NORTH_PARENT_TNT_v2";
  const BASELINE_CONTRACT = "HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION_TNT_v1";
  const VERSION = "2026-05-30.hearth-canvas-west-inspection-invalidation-control-v1";
  const FILE = "/assets/hearth/hearth.canvas.west.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const DEFAULT_YAW = -0.18;
  const DEFAULT_PITCH = 0.05;
  const DEFAULT_ZOOM = 1;
  const ZOOM_MIN = 0.82;
  const ZOOM_MAX = 2.8;
  const PITCH_MIN = -1.18;
  const PITCH_MAX = 1.18;

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    role: "canvas-west-inspection-invalidation-control",

    newsProtocolSynchronized: true,
    fibonacciAlignmentSynchronized: true,
    activeFibonacciGate: "F13",
    futureFibonacciGate: "F21",
    oneActiveGearAtATime: true,
    cycleOrder: "EAST_WEST_NORTH_SOUTH_CHECKPOINT_EAST",

    canvasWestActive: true,
    canvasWestReady: true,
    splitAdapterRole: "WEST",
    splitAdapterTransistorMode: true,
    admissibilityControlActive: true,

    bound: false,
    bindAttempted: false,
    bindCount: 0,
    unbindCount: 0,
    canvasPresent: false,
    canvasNonZeroSize: false,
    canvasTagAccepted: false,
    canvasDatasetStamped: false,

    dragInspectionBound: false,
    zoomInspectionBound: false,
    pointerInspectionActive: false,
    pointerInspectionPainted: false,
    interactiveRotationActive: true,

    yaw: DEFAULT_YAW,
    pitch: DEFAULT_PITCH,
    rotationYaw: DEFAULT_YAW,
    rotationPitch: DEFAULT_PITCH,
    defaultYaw: DEFAULT_YAW,
    defaultPitch: DEFAULT_PITCH,

    zoomEnabled: true,
    zoomLevel: DEFAULT_ZOOM,
    zoomMin: ZOOM_MIN,
    zoomMax: ZOOM_MAX,
    zoomLodPrepared: true,
    zoomLodLevel: 1,
    zoomUsesCachedTexture: true,
    zoomDoesNotOwnPlanetTruth: true,
    zoomDoesNotTriggerAtlasRebuild: true,

    pointerDragCount: 0,
    pointerDownCount: 0,
    pointerMoveCount: 0,
    pointerUpCount: 0,
    pointerCancelCount: 0,
    pointerActiveCount: 0,
    wheelZoomCount: 0,
    keyboardControlCount: 0,
    zoomInteractionCount: 0,
    interactionCount: 0,
    invalidationSignalCount: 0,

    activePointerId: null,
    activePointers: 0,
    lastPointerX: 0,
    lastPointerY: 0,
    pointerStartX: 0,
    pointerStartY: 0,
    dragStartedAt: "",
    lastInteractionAt: "",
    lastZoomAt: "",
    lastZoomSource: "",
    lastInvalidationAt: "",
    lastInvalidationReason: "",

    pinchActive: false,
    pinchStartDistance: 0,
    pinchStartZoom: DEFAULT_ZOOM,

    canvasWidth: 0,
    canvasHeight: 0,
    dpr: 1,

    onChangeAvailable: false,
    onInvalidateAvailable: false,
    onChangeError: "",
    onInvalidateError: "",

    ownsInvalidationControl: true,
    ownsDragInspection: true,
    ownsZoomInspection: true,
    ownsViewState: true,
    ownsAtlasFormation: false,
    ownsTextureComposition: false,
    ownsSphereRendering: false,
    ownsVisibleProof: false,
    ownsPlanetTruth: false,
    ownsMaterialTruth: false,
    ownsHydrologyTruth: false,
    ownsRuntimeTableGovernance: false,
    ownsRouteReadiness: false,
    ownsF21: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    localEvents: [],
    errors: [],
    updatedAt: nowIso()
  };

  const runtime = {
    canvas: null,
    callbacks: {
      onChange: null,
      onInvalidate: null
    },
    cleanup: [],
    activePointers: new Map()
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object");
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

  function clampZoom(value) {
    return clamp(value, state.zoomMin, state.zoomMax);
  }

  function clonePlain(value) {
    if (!isObject(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : { ...value };
    }
  }

  function recordLocal(event, detail = {}) {
    const item = {
      at: nowIso(),
      event,
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);

    if (state.localEvents.length > 120) {
      state.localEvents.splice(0, state.localEvents.length - 120);
    }

    state.updatedAt = item.at;
    updateDataset();

    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code,
      event: code,
      message: error && error.message ? error.message : String(error || ""),
      detail: clonePlain(detail)
    };

    state.errors.push(item);

    if (state.errors.length > 80) {
      state.errors.splice(0, state.errors.length - 80);
    }

    state.updatedAt = item.at;
    updateDataset();

    return item;
  }

  function eventPoint(event) {
    return {
      id: event.pointerId !== undefined ? event.pointerId : "mouse",
      x: safeNumber(event.clientX, 0),
      y: safeNumber(event.clientY, 0)
    };
  }

  function measureCanvas(canvas) {
    if (!canvas) return { width: 0, height: 0, dpr: 1 };

    let width = safeNumber(canvas.width, 0);
    let height = safeNumber(canvas.height, 0);

    if (canvas.getBoundingClientRect) {
      const rect = canvas.getBoundingClientRect();
      width = width || safeNumber(rect.width, 0);
      height = height || safeNumber(rect.height, 0);
    }

    const dpr = clamp(root.devicePixelRatio || 1, 1, 3);

    state.canvasWidth = width;
    state.canvasHeight = height;
    state.dpr = dpr;
    state.canvasNonZeroSize = width > 0 && height > 0;

    return { width, height, dpr };
  }

  function stampCanvas(canvas) {
    if (!canvas || !canvas.dataset) return;

    canvas.dataset.hearthCanvasWestBound = "true";
    canvas.dataset.hearthCanvasWestContract = CONTRACT;
    canvas.dataset.hearthCanvasWestReceipt = RECEIPT;
    canvas.dataset.hearthCanvasWestRole = state.role;
    canvas.dataset.hearthCanvasWestDragInspectionBound = String(state.dragInspectionBound);
    canvas.dataset.hearthCanvasWestZoomInspectionBound = String(state.zoomInspectionBound);
    canvas.dataset.hearthCanvasWestZoomDoesNotTriggerAtlasRebuild = "true";
    canvas.dataset.hearthCanvasWestOwnsPlanetTruth = "false";
    canvas.dataset.hearthCanvasWestOwnsVisibleProof = "false";
    canvas.dataset.hearthCanvasWestOwnsF21 = "false";
    canvas.dataset.visualPassClaimed = "false";

    state.canvasDatasetStamped = true;
  }

  function updateDataset() {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthCanvasWestLoaded = "true";
    dataset.hearthCanvasWestContract = CONTRACT;
    dataset.hearthCanvasWestReceipt = RECEIPT;
    dataset.hearthCanvasWestPreviousContract = PREVIOUS_CONTRACT;
    dataset.hearthCanvasWestBaselineContract = BASELINE_CONTRACT;
    dataset.hearthCanvasWestVersion = VERSION;
    dataset.hearthCanvasWestFile = FILE;
    dataset.hearthCanvasWestRole = state.role;

    dataset.hearthCanvasWestNewsProtocolSynchronized = "true";
    dataset.hearthCanvasWestFibonacciAlignmentSynchronized = "true";
    dataset.hearthCanvasWestActiveFibonacciGate = "F13";
    dataset.hearthCanvasWestFutureFibonacciGate = "F21";
    dataset.hearthCanvasWestOneActiveGearAtATime = "true";

    dataset.hearthCanvasWestActive = "true";
    dataset.hearthCanvasWestReady = "true";
    dataset.hearthCanvasWestBound = String(state.bound);
    dataset.hearthCanvasWestDragInspectionBound = String(state.dragInspectionBound);
    dataset.hearthCanvasWestZoomInspectionBound = String(state.zoomInspectionBound);
    dataset.hearthCanvasWestPointerInspectionActive = String(state.pointerInspectionActive);
    dataset.hearthCanvasWestPointerInspectionPainted = String(state.pointerInspectionPainted);

    dataset.hearthCanvasWestYaw = String(state.yaw);
    dataset.hearthCanvasWestPitch = String(state.pitch);
    dataset.hearthCanvasWestZoomLevel = String(state.zoomLevel);
    dataset.hearthCanvasWestZoomMin = String(state.zoomMin);
    dataset.hearthCanvasWestZoomMax = String(state.zoomMax);
    dataset.hearthCanvasWestZoomUsesCachedTexture = "true";
    dataset.hearthCanvasWestZoomDoesNotTriggerAtlasRebuild = "true";

    dataset.hearthCanvasWestOwnsInvalidationControl = "true";
    dataset.hearthCanvasWestOwnsDragInspection = "true";
    dataset.hearthCanvasWestOwnsZoomInspection = "true";
    dataset.hearthCanvasWestOwnsViewState = "true";
    dataset.hearthCanvasWestOwnsAtlasFormation = "false";
    dataset.hearthCanvasWestOwnsTextureComposition = "false";
    dataset.hearthCanvasWestOwnsSphereRendering = "false";
    dataset.hearthCanvasWestOwnsVisibleProof = "false";
    dataset.hearthCanvasWestOwnsPlanetTruth = "false";
    dataset.hearthCanvasWestOwnsRuntimeTableGovernance = "false";
    dataset.hearthCanvasWestOwnsRouteReadiness = "false";
    dataset.hearthCanvasWestOwnsF21 = "false";

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";

    if (runtime.canvas) {
      stampCanvas(runtime.canvas);
    }
  }

  function addEvent(target, type, handler, options) {
    if (!target || !isFunction(target.addEventListener)) return;

    target.addEventListener(type, handler, options);
    runtime.cleanup.push(() => {
      try {
        target.removeEventListener(type, handler, options);
      } catch (_error) {}
    });
  }

  function cleanupListeners() {
    runtime.cleanup.splice(0).forEach((cleanup) => {
      try {
        cleanup();
      } catch (_error) {}
    });

    runtime.activePointers.clear();
    state.activePointers = 0;
    state.pointerActiveCount = 0;
    state.activePointerId = null;
    state.pointerInspectionActive = false;
    state.pinchActive = false;
  }

  function notifyChange(source = "west-change", detail = {}) {
    state.interactionCount += 1;
    state.lastInteractionAt = nowIso();

    const payload = {
      source,
      contract: CONTRACT,
      receipt: RECEIPT,
      view: getViewState(),
      detail: clonePlain(detail),
      visualPassClaimed: false,
      f21ClaimedByCanvasWest: false
    };

    if (isFunction(runtime.callbacks.onChange)) {
      try {
        runtime.callbacks.onChange(payload);
        state.onChangeError = "";
      } catch (error) {
        state.onChangeError = error && error.message ? error.message : String(error);
        recordError("WEST_ON_CHANGE_FAILED", error, { source });
      }
    }

    if (root.dispatchEvent && root.CustomEvent) {
      try {
        root.dispatchEvent(new root.CustomEvent("hearth:canvas-west-change", {
          detail: payload
        }));
      } catch (_error) {}
    }

    updateDataset();
    return payload;
  }

  function notifyInvalidation(reason = "west-explicit-invalidation", detail = {}) {
    state.invalidationSignalCount += 1;
    state.lastInvalidationAt = nowIso();
    state.lastInvalidationReason = String(reason || "west-explicit-invalidation");

    const payload = {
      source: "hearth.canvas.west",
      reason: state.lastInvalidationReason,
      contract: CONTRACT,
      receipt: RECEIPT,
      view: getViewState(),
      detail: clonePlain(detail),
      zoomDoesNotTriggerAtlasRebuild: true,
      visualPassClaimed: false,
      f21ClaimedByCanvasWest: false
    };

    if (isFunction(runtime.callbacks.onInvalidate)) {
      try {
        runtime.callbacks.onInvalidate(state.lastInvalidationReason, payload);
        state.onInvalidateError = "";
      } catch (error) {
        state.onInvalidateError = error && error.message ? error.message : String(error);
        recordError("WEST_ON_INVALIDATE_FAILED", error, { reason });
      }
    }

    if (root.dispatchEvent && root.CustomEvent) {
      try {
        root.dispatchEvent(new root.CustomEvent("hearth:canvas-west-invalidate", {
          detail: payload
        }));
      } catch (_error) {}
    }

    updateDataset();
    return payload;
  }

  function setCursor(canvas, value) {
    if (!canvas || !canvas.style) return;
    canvas.style.cursor = value;
  }

  function getPointerDistance() {
    const points = Array.from(runtime.activePointers.values());

    if (points.length < 2) return 0;

    const a = points[0];
    const b = points[1];
    const dx = b.x - a.x;
    const dy = b.y - a.y;

    return Math.hypot(dx, dy);
  }

  function handlePointerDown(event) {
    if (!runtime.canvas) return;

    const point = eventPoint(event);

    runtime.activePointers.set(point.id, point);
    state.activePointers = runtime.activePointers.size;
    state.pointerActiveCount = runtime.activePointers.size;
    state.pointerDownCount += 1;
    state.pointerInspectionActive = true;
    state.activePointerId = point.id;
    state.pointerStartX = point.x;
    state.pointerStartY = point.y;
    state.lastPointerX = point.x;
    state.lastPointerY = point.y;
    state.dragStartedAt = nowIso();

    try {
      if (runtime.canvas.setPointerCapture && event.pointerId !== undefined) {
        runtime.canvas.setPointerCapture(event.pointerId);
      }
    } catch (_error) {}

    if (runtime.activePointers.size >= 2) {
      state.pinchActive = true;
      state.pinchStartDistance = getPointerDistance();
      state.pinchStartZoom = state.zoomLevel;
    }

    setCursor(runtime.canvas, "grabbing");
    updateDataset();

    if (event.cancelable) event.preventDefault();
  }

  function handlePointerMove(event) {
    if (!runtime.canvas) return;

    const point = eventPoint(event);

    if (!runtime.activePointers.has(point.id)) return;

    runtime.activePointers.set(point.id, point);

    state.pointerMoveCount += 1;
    state.pointerActiveCount = runtime.activePointers.size;
    state.activePointers = runtime.activePointers.size;

    const size = measureCanvas(runtime.canvas);
    const width = Math.max(1, size.width);
    const height = Math.max(1, size.height);

    if (state.pinchActive && runtime.activePointers.size >= 2) {
      const distance = getPointerDistance();

      if (state.pinchStartDistance > 0 && distance > 0) {
        const factor = distance / state.pinchStartDistance;
        setZoom(state.pinchStartZoom * factor, {
          source: "pinch",
          notify: true,
          invalidate: false
        });
      }

      if (event.cancelable) event.preventDefault();
      return;
    }

    if (state.activePointerId !== point.id) return;

    const dx = point.x - state.lastPointerX;
    const dy = point.y - state.lastPointerY;

    state.lastPointerX = point.x;
    state.lastPointerY = point.y;

    const sensitivity = 1 / Math.max(0.65, state.zoomLevel);
    const yawDelta = (dx / width) * Math.PI * 1.38 * sensitivity;
    const pitchDelta = (dy / height) * Math.PI * 1.05 * sensitivity;

    state.yaw += yawDelta;
    state.pitch = clamp(state.pitch + pitchDelta, PITCH_MIN, PITCH_MAX);
    state.rotationYaw = state.yaw;
    state.rotationPitch = state.pitch;

    state.pointerDragCount += 1;
    state.pointerInspectionPainted = true;

    notifyChange("pointer-drag", {
      dx,
      dy,
      yawDelta,
      pitchDelta,
      zoomLevel: state.zoomLevel
    });

    if (event.cancelable) event.preventDefault();
  }

  function handlePointerUp(event) {
    if (!runtime.canvas) return;

    const point = eventPoint(event);

    runtime.activePointers.delete(point.id);

    state.pointerUpCount += 1;
    state.pointerActiveCount = runtime.activePointers.size;
    state.activePointers = runtime.activePointers.size;

    if (state.activePointerId === point.id) {
      state.activePointerId = runtime.activePointers.size
        ? Array.from(runtime.activePointers.keys())[0]
        : null;
    }

    if (runtime.activePointers.size < 2) {
      state.pinchActive = false;
      state.pinchStartDistance = 0;
      state.pinchStartZoom = state.zoomLevel;
    }

    if (runtime.activePointers.size === 0) {
      state.pointerInspectionActive = false;
      setCursor(runtime.canvas, "grab");
    }

    try {
      if (runtime.canvas.releasePointerCapture && event.pointerId !== undefined) {
        runtime.canvas.releasePointerCapture(event.pointerId);
      }
    } catch (_error) {}

    updateDataset();

    if (event.cancelable) event.preventDefault();
  }

  function handlePointerCancel(event) {
    const point = eventPoint(event);

    runtime.activePointers.delete(point.id);

    state.pointerCancelCount += 1;
    state.pointerActiveCount = runtime.activePointers.size;
    state.activePointers = runtime.activePointers.size;

    if (runtime.activePointers.size === 0) {
      state.pointerInspectionActive = false;
      state.pinchActive = false;
      state.activePointerId = null;
      setCursor(runtime.canvas, "grab");
    }

    updateDataset();
  }

  function handleWheel(event) {
    if (!state.zoomEnabled) return;

    const delta = safeNumber(event.deltaY, 0);
    const factor = Math.exp(-delta * 0.0015);
    const nextZoom = state.zoomLevel * factor;

    setZoom(nextZoom, {
      source: "wheel",
      notify: true,
      invalidate: false
    });

    state.wheelZoomCount += 1;

    if (event.cancelable) event.preventDefault();
  }

  function handleKeyDown(event) {
    const key = String(event.key || "");
    const step = event.shiftKey ? 0.16 : 0.08;

    let handled = false;

    if (key === "ArrowLeft") {
      state.yaw -= step;
      handled = true;
    } else if (key === "ArrowRight") {
      state.yaw += step;
      handled = true;
    } else if (key === "ArrowUp") {
      state.pitch = clamp(state.pitch - step, PITCH_MIN, PITCH_MAX);
      handled = true;
    } else if (key === "ArrowDown") {
      state.pitch = clamp(state.pitch + step, PITCH_MIN, PITCH_MAX);
      handled = true;
    } else if (key === "+" || key === "=") {
      setZoom(state.zoomLevel + 0.12, {
        source: "keyboard-plus",
        notify: true,
        invalidate: false
      });
      handled = true;
    } else if (key === "-" || key === "_") {
      setZoom(state.zoomLevel - 0.12, {
        source: "keyboard-minus",
        notify: true,
        invalidate: false
      });
      handled = true;
    } else if (key === "0") {
      resetZoom({ source: "keyboard-reset-zoom" });
      handled = true;
    } else if (key.toLowerCase() === "r") {
      resetRotation({ source: "keyboard-reset-rotation" });
      handled = true;
    }

    if (!handled) return;

    state.rotationYaw = state.yaw;
    state.rotationPitch = state.pitch;
    state.keyboardControlCount += 1;

    notifyChange("keyboard-control", { key });

    if (event.cancelable) event.preventDefault();
  }

  function bindInspection(options = {}) {
    state.bindAttempted = true;
    state.bindCount += 1;

    const canvas = options.canvas || options.target || options.element || runtime.canvas;

    if (!canvas || !isFunction(canvas.addEventListener)) {
      const error = new Error("Canvas West bindInspection requires a canvas element.");
      recordError("WEST_BIND_CANVAS_MISSING", error);
      return getReceipt();
    }

    cleanupListeners();

    runtime.canvas = canvas;
    runtime.callbacks.onChange = isFunction(options.onChange) ? options.onChange : null;
    runtime.callbacks.onInvalidate = isFunction(options.onInvalidate) ? options.onInvalidate : null;

    state.onChangeAvailable = Boolean(runtime.callbacks.onChange);
    state.onInvalidateAvailable = Boolean(runtime.callbacks.onInvalidate);

    if (Number.isFinite(Number(options.yaw))) {
      state.yaw = Number(options.yaw);
    }

    if (Number.isFinite(Number(options.pitch))) {
      state.pitch = clamp(Number(options.pitch), PITCH_MIN, PITCH_MAX);
    }

    if (Number.isFinite(Number(options.zoomLevel)) || Number.isFinite(Number(options.zoom))) {
      state.zoomLevel = clampZoom(Number(options.zoomLevel !== undefined ? options.zoomLevel : options.zoom));
    }

    state.rotationYaw = state.yaw;
    state.rotationPitch = state.pitch;

    measureCanvas(canvas);

    state.canvasPresent = true;
    state.canvasTagAccepted = String(canvas.tagName || "").toLowerCase() === "canvas";
    state.bound = true;
    state.dragInspectionBound = true;
    state.zoomInspectionBound = true;
    state.pointerInspectionPainted = false;
    state.pointerInspectionActive = false;

    if (canvas.style) {
      canvas.style.touchAction = "none";
      canvas.style.cursor = "grab";
      canvas.style.userSelect = "none";
    }

    if (!canvas.hasAttribute || !canvas.hasAttribute("tabindex")) {
      try {
        canvas.setAttribute("tabindex", "0");
      } catch (_error) {}
    }

    stampCanvas(canvas);

    addEvent(canvas, "pointerdown", handlePointerDown, { passive: false });
    addEvent(canvas, "pointermove", handlePointerMove, { passive: false });
    addEvent(canvas, "pointerup", handlePointerUp, { passive: false });
    addEvent(canvas, "pointercancel", handlePointerCancel, { passive: false });
    addEvent(canvas, "lostpointercapture", handlePointerCancel, { passive: false });
    addEvent(canvas, "wheel", handleWheel, { passive: false });
    addEvent(canvas, "keydown", handleKeyDown, { passive: false });

    if (root && isFunction(root.addEventListener)) {
      addEvent(root, "resize", () => {
        measureCanvas(canvas);
        notifyChange("resize", { width: state.canvasWidth, height: state.canvasHeight });
      }, { passive: true });
    }

    recordLocal("WEST_BIND_INSPECTION_COMPLETE", {
      canvasPresent: true,
      onChangeAvailable: state.onChangeAvailable,
      onInvalidateAvailable: state.onInvalidateAvailable,
      zoomLevel: state.zoomLevel
    });

    updateDataset();

    return getReceipt();
  }

  function unbindInspection() {
    cleanupListeners();

    state.unbindCount += 1;
    state.bound = false;
    state.dragInspectionBound = false;
    state.zoomInspectionBound = false;
    state.pointerInspectionActive = false;
    state.pinchActive = false;

    if (runtime.canvas && runtime.canvas.dataset) {
      runtime.canvas.dataset.hearthCanvasWestBound = "false";
    }

    runtime.canvas = null;
    runtime.callbacks.onChange = null;
    runtime.callbacks.onInvalidate = null;

    recordLocal("WEST_UNBIND_INSPECTION_COMPLETE");

    updateDataset();

    return getReceipt();
  }

  function getViewState() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      source: "hearth.canvas.west",
      role: state.role,

      yaw: state.yaw,
      pitch: state.pitch,
      rotationYaw: state.yaw,
      rotationPitch: state.pitch,

      zoom: state.zoomLevel,
      zoomLevel: state.zoomLevel,
      zoomMin: state.zoomMin,
      zoomMax: state.zoomMax,
      zoomEnabled: state.zoomEnabled,
      zoomLodPrepared: true,
      zoomLodLevel: state.zoomLodLevel,
      zoomUsesCachedTexture: true,
      zoomDoesNotOwnPlanetTruth: true,
      zoomDoesNotTriggerAtlasRebuild: true,

      pointerInspectionActive: state.pointerInspectionActive,
      pointerInspectionPainted: state.pointerInspectionPainted,
      dragInspectionBound: state.dragInspectionBound,
      zoomInspectionBound: state.zoomInspectionBound,
      interactiveRotationActive: true,

      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      dpr: state.dpr,

      updatedAt: state.updatedAt,
      f21ClaimedByCanvasWest: false,
      visualPassClaimed: false
    };
  }

  function setRotation(yaw = state.yaw, pitch = state.pitch, options = {}) {
    state.yaw = safeNumber(yaw, state.yaw);
    state.pitch = clamp(pitch, PITCH_MIN, PITCH_MAX);
    state.rotationYaw = state.yaw;
    state.rotationPitch = state.pitch;
    state.pointerInspectionPainted = true;

    recordLocal("WEST_SET_ROTATION", {
      yaw: state.yaw,
      pitch: state.pitch,
      source: options.source || "setRotation"
    });

    if (options.notify !== false) {
      notifyChange(options.source || "setRotation", {
        yaw: state.yaw,
        pitch: state.pitch
      });
    }

    updateDataset();

    return getReceipt();
  }

  function resetRotation(options = {}) {
    return setRotation(
      Number.isFinite(Number(options.yaw)) ? Number(options.yaw) : state.defaultYaw,
      Number.isFinite(Number(options.pitch)) ? Number(options.pitch) : state.defaultPitch,
      {
        ...options,
        source: options.source || "resetRotation"
      }
    );
  }

  function setZoom(value = DEFAULT_ZOOM, options = {}) {
    const previousZoom = state.zoomLevel;
    const nextZoom = clampZoom(value);

    state.zoomLevel = nextZoom;
    state.zoomLodLevel = nextZoom >= 2.1 ? 3 : nextZoom >= 1.35 ? 2 : 1;
    state.lastZoomAt = nowIso();
    state.lastZoomSource = String(options.source || "setZoom");
    state.zoomInteractionCount += previousZoom !== nextZoom ? 1 : 0;

    recordLocal("WEST_SET_ZOOM", {
      previousZoom,
      zoomLevel: state.zoomLevel,
      zoomLodLevel: state.zoomLodLevel,
      source: state.lastZoomSource,
      zoomDoesNotTriggerAtlasRebuild: true
    });

    if (options.invalidate === true) {
      notifyInvalidation(options.reason || "explicit-west-zoom-invalidation", {
        previousZoom,
        zoomLevel: state.zoomLevel,
        source: state.lastZoomSource
      });
    }

    if (options.notify !== false) {
      notifyChange(state.lastZoomSource, {
        previousZoom,
        zoomLevel: state.zoomLevel,
        zoomLodLevel: state.zoomLodLevel,
        zoomDoesNotTriggerAtlasRebuild: true
      });
    }

    updateDataset();

    return getReceipt();
  }

  function zoomIn(step = 0.18, options = {}) {
    return setZoom(state.zoomLevel + Math.abs(safeNumber(step, 0.18)), {
      ...options,
      source: options.source || "zoomIn",
      invalidate: false
    });
  }

  function zoomOut(step = 0.18, options = {}) {
    return setZoom(state.zoomLevel - Math.abs(safeNumber(step, 0.18)), {
      ...options,
      source: options.source || "zoomOut",
      invalidate: false
    });
  }

  function resetZoom(options = {}) {
    return setZoom(DEFAULT_ZOOM, {
      ...options,
      source: options.source || "resetZoom",
      invalidate: false
    });
  }

  function requestInvalidation(reason = "west-explicit-invalidation", detail = {}) {
    return notifyInvalidation(reason, detail);
  }

  function invalidate(reason = "west-explicit-invalidation", detail = {}) {
    return requestInvalidation(reason, detail);
  }

  function getReceipt() {
    measureCanvas(runtime.canvas);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,
      role: state.role,

      newsProtocolSynchronized: true,
      fibonacciAlignmentSynchronized: true,
      activeFibonacciGate: "F13",
      futureFibonacciGate: "F21",
      oneActiveGearAtATime: true,
      cycleOrder: state.cycleOrder,

      canvasWestActive: true,
      canvasWestReady: true,
      splitAdapterRole: "WEST",
      splitAdapterTransistorMode: true,
      admissibilityControlActive: true,

      bound: state.bound,
      bindAttempted: state.bindAttempted,
      bindCount: state.bindCount,
      unbindCount: state.unbindCount,
      canvasPresent: Boolean(runtime.canvas),
      canvasNonZeroSize: state.canvasNonZeroSize,
      canvasTagAccepted: state.canvasTagAccepted,
      canvasDatasetStamped: state.canvasDatasetStamped,

      dragInspectionBound: state.dragInspectionBound,
      zoomInspectionBound: state.zoomInspectionBound,
      pointerInspectionActive: state.pointerInspectionActive,
      pointerInspectionPainted: state.pointerInspectionPainted,
      interactiveRotationActive: true,

      yaw: state.yaw,
      pitch: state.pitch,
      rotationYaw: state.yaw,
      rotationPitch: state.pitch,
      defaultYaw: state.defaultYaw,
      defaultPitch: state.defaultPitch,

      zoomEnabled: state.zoomEnabled,
      zoomLevel: state.zoomLevel,
      zoomMin: state.zoomMin,
      zoomMax: state.zoomMax,
      zoomLodPrepared: true,
      zoomLodLevel: state.zoomLodLevel,
      zoomUsesCachedTexture: true,
      zoomDoesNotOwnPlanetTruth: true,
      zoomDoesNotTriggerAtlasRebuild: true,

      pointerDragCount: state.pointerDragCount,
      pointerDownCount: state.pointerDownCount,
      pointerMoveCount: state.pointerMoveCount,
      pointerUpCount: state.pointerUpCount,
      pointerCancelCount: state.pointerCancelCount,
      pointerActiveCount: state.pointerActiveCount,
      wheelZoomCount: state.wheelZoomCount,
      keyboardControlCount: state.keyboardControlCount,
      zoomInteractionCount: state.zoomInteractionCount,
      interactionCount: state.interactionCount,
      invalidationSignalCount: state.invalidationSignalCount,

      activePointerId: state.activePointerId,
      activePointers: state.activePointers,
      dragStartedAt: state.dragStartedAt,
      lastInteractionAt: state.lastInteractionAt,
      lastZoomAt: state.lastZoomAt,
      lastZoomSource: state.lastZoomSource,
      lastInvalidationAt: state.lastInvalidationAt,
      lastInvalidationReason: state.lastInvalidationReason,

      pinchActive: state.pinchActive,
      pinchStartDistance: state.pinchStartDistance,
      pinchStartZoom: state.pinchStartZoom,

      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      dpr: state.dpr,

      onChangeAvailable: state.onChangeAvailable,
      onInvalidateAvailable: state.onInvalidateAvailable,
      onChangeError: state.onChangeError,
      onInvalidateError: state.onInvalidateError,

      viewState: getViewState(),

      ownsInvalidationControl: true,
      ownsDragInspection: true,
      ownsZoomInspection: true,
      ownsViewState: true,
      ownsAtlasFormation: false,
      ownsTextureComposition: false,
      ownsSphereRendering: false,
      ownsVisibleProof: false,
      ownsPlanetTruth: false,
      ownsMaterialTruth: false,
      ownsHydrologyTruth: false,
      ownsRuntimeTableGovernance: false,
      ownsRouteReadiness: false,
      ownsF21: false,

      designRules: [
        "west owns inspection control only",
        "drag changes view state only",
        "zoom changes cached-texture inspection only",
        "ordinary zoom does not trigger atlas rebuild",
        "ordinary drag does not trigger atlas rebuild",
        "explicit invalidation may be signaled through requestInvalidation",
        "west does not render visible proof",
        "west does not compose texture",
        "west does not form atlas",
        "west does not claim F21",
        "west does not claim final visual pass"
      ],

      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: state.updatedAt
    };
  }

  function getReceiptText() {
    const r = getReceipt();

    const errors = r.errors.length
      ? r.errors.map((item) => `- ${item.at} :: ${item.code} :: ${item.message}`).join("\n")
      : "- none";

    return [
      "HEARTH_CANVAS_WEST_INSPECTION_INVALIDATION_CONTROL_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `role=${r.role}`,
      "",
      `newsProtocolSynchronized=${r.newsProtocolSynchronized}`,
      `fibonacciAlignmentSynchronized=${r.fibonacciAlignmentSynchronized}`,
      `activeFibonacciGate=${r.activeFibonacciGate}`,
      `futureFibonacciGate=${r.futureFibonacciGate}`,
      `oneActiveGearAtATime=${r.oneActiveGearAtATime}`,
      `cycleOrder=${r.cycleOrder}`,
      "",
      `canvasWestActive=${r.canvasWestActive}`,
      `canvasWestReady=${r.canvasWestReady}`,
      `splitAdapterRole=${r.splitAdapterRole}`,
      `splitAdapterTransistorMode=${r.splitAdapterTransistorMode}`,
      `admissibilityControlActive=${r.admissibilityControlActive}`,
      "",
      `bound=${r.bound}`,
      `bindAttempted=${r.bindAttempted}`,
      `bindCount=${r.bindCount}`,
      `canvasPresent=${r.canvasPresent}`,
      `canvasNonZeroSize=${r.canvasNonZeroSize}`,
      `dragInspectionBound=${r.dragInspectionBound}`,
      `zoomInspectionBound=${r.zoomInspectionBound}`,
      `pointerInspectionActive=${r.pointerInspectionActive}`,
      `pointerInspectionPainted=${r.pointerInspectionPainted}`,
      "",
      `yaw=${r.yaw}`,
      `pitch=${r.pitch}`,
      `zoomLevel=${r.zoomLevel}`,
      `zoomMin=${r.zoomMin}`,
      `zoomMax=${r.zoomMax}`,
      `zoomLodPrepared=${r.zoomLodPrepared}`,
      `zoomLodLevel=${r.zoomLodLevel}`,
      `zoomUsesCachedTexture=${r.zoomUsesCachedTexture}`,
      `zoomDoesNotTriggerAtlasRebuild=${r.zoomDoesNotTriggerAtlasRebuild}`,
      "",
      `pointerDragCount=${r.pointerDragCount}`,
      `wheelZoomCount=${r.wheelZoomCount}`,
      `keyboardControlCount=${r.keyboardControlCount}`,
      `zoomInteractionCount=${r.zoomInteractionCount}`,
      `interactionCount=${r.interactionCount}`,
      `invalidationSignalCount=${r.invalidationSignalCount}`,
      "",
      `ownsInvalidationControl=${r.ownsInvalidationControl}`,
      `ownsDragInspection=${r.ownsDragInspection}`,
      `ownsZoomInspection=${r.ownsZoomInspection}`,
      `ownsViewState=${r.ownsViewState}`,
      `ownsAtlasFormation=${r.ownsAtlasFormation}`,
      `ownsTextureComposition=${r.ownsTextureComposition}`,
      `ownsSphereRendering=${r.ownsSphereRendering}`,
      `ownsVisibleProof=${r.ownsVisibleProof}`,
      `ownsPlanetTruth=${r.ownsPlanetTruth}`,
      `ownsF21=${r.ownsF21}`,
      "",
      "ERRORS",
      errors,
      "",
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      "",
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,

    bindInspection,
    unbindInspection,
    getViewState,
    setRotation,
    resetRotation,
    setZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    requestInvalidation,
    invalidate,
    getReceipt,
    getReceiptText,

    canvasWestActive: true,
    canvasWestReady: true,
    splitAdapterRole: "WEST",
    splitAdapterTransistorMode: true,

    newsProtocolSynchronized: true,
    fibonacciAlignmentSynchronized: true,
    activeFibonacciGate: "F13",
    futureFibonacciGate: "F21",
    oneActiveGearAtATime: true,

    ownsInvalidationControl: true,
    ownsDragInspection: true,
    ownsZoomInspection: true,
    ownsViewState: true,
    ownsAtlasFormation: false,
    ownsTextureComposition: false,
    ownsSphereRendering: false,
    ownsVisibleProof: false,
    ownsPlanetTruth: false,
    ownsRuntimeTableGovernance: false,
    ownsRouteReadiness: false,
    ownsF21: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.canvasWest = api;
  root.HEARTH.canvasWestInspectionInvalidationControl = api;

  root.HEARTH_CANVAS_WEST = api;
  root.HEARTH_CANVAS_WEST_INSPECTION_INVALIDATION_CONTROL = api;

  root.DEXTER_LAB = root.DEXTER_LAB || {};
  root.DEXTER_LAB.hearthCanvasWest = api;
  root.DEXTER_LAB.hearthCanvasWestInspectionInvalidationControl = api;

  updateDataset();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

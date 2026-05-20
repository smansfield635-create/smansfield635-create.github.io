// /assets/audralia/clean/audralia.controls.js
// AUDRALIA_CLEAN_CANVAS_CONTROLS_TNT_v1
// Full-file replacement.
// File 14 of 16.
// Planet Audralia controls / inspection-only authority.
// Purpose:
// - Establishes Audralia-specific drag/touch inspection authority.
// - Owns pointer capture, drag gesture reading, touch gesture reading, interaction state, sensitivity, gesture safety, and runtime handoff.
// - Sends inspection deltas to Audralia runtime without owning runtime motion.
// - Does not create land/ocean footprint.
// - Does not create water behavior.
// - Does not create elevation.
// - Does not create climate fields.
// - Does not create biome categories.
// - Does not synthesize surface material.
// - Does not create atmosphere/weather.
// - Does not render canvas.
// - Does not own runtime motion, canvas composition, route bridge, or HTML shell.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_CLEAN_CANVAS_CONTROLS_TNT_v1";
  const RECEIPT = "AUDRALIA_CLEAN_CANVAS_CONTROLS_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_CLEAN_CANVAS_RUNTIME_TNT_v1";
  const VERSION = "2026-05-20.audralia-clean-canvas-controls-v1";

  const FILE_NUMBER = 14;
  const PRIMARY_NODE = 14;
  const SUBNODE_RANGE = Object.freeze([209, 224]);

  const UNIVERSAL_ANCHOR = "/showroom/globe/";
  const AUDRALIA_ROUTE = "/showroom/globe/audralia/";
  const H_EARTH_ROUTE = "/showroom/globe/h-earth/";

  const CONTROL_TARGETS = Object.freeze({
    pointerCapture: true,
    dragInspection: true,
    touchInspection: true,
    gestureSafety: true,
    sensitivity: true,
    runtimeHandoff: true,
    ownsInspectionOnly: true,
    ownsRuntimeMotion: false,
    ownsCanvas: false,
    ownsRoute: false,
    ownsHtml: false
  });

  const DEFAULTS = Object.freeze({
    rotationSensitivity: 0.0068,
    tiltSensitivity: 0.0046,
    maxDeltaPx: 42,
    tapMoveTolerancePx: 5,
    dragDeadzonePx: 1.8,
    allowPointerCapture: true,
    preventDefault: true,
    touchAction: "none",
    cursorActive: "grabbing",
    cursorIdle: "grab",
    autoPauseWhileDragging: true,
    releaseInteractionDelayMs: 120
  });

  function M() {
    return window.DGB_PLANET_FAMILY_MATH || window.AUDRALIA_CLEAN_CANVAS_MATH || null;
  }

  function R() {
    return window.AUDRALIA_RUNTIME || window.AUDRALIA_CLEAN_CANVAS_RUNTIME || null;
  }

  function finite(value, fallback = 0) {
    const helper = M();
    if (helper?.finite) return helper.finite(value, fallback);
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    const helper = M();
    if (helper?.clamp) return helper.clamp(value, min, max);
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function clamp01(value) {
    const helper = M();
    if (helper?.clamp01) return helper.clamp01(value);
    return clamp(value, 0, 1);
  }

  function nowMs() {
    if (typeof performance !== "undefined" && typeof performance.now === "function") {
      return performance.now();
    }

    return Date.now();
  }

  function normalizeOptions(options = {}) {
    return Object.freeze({
      rotationSensitivity: finite(options.rotationSensitivity, DEFAULTS.rotationSensitivity),
      tiltSensitivity: finite(options.tiltSensitivity, DEFAULTS.tiltSensitivity),
      maxDeltaPx: Math.max(4, finite(options.maxDeltaPx, DEFAULTS.maxDeltaPx)),
      tapMoveTolerancePx: Math.max(0, finite(options.tapMoveTolerancePx, DEFAULTS.tapMoveTolerancePx)),
      dragDeadzonePx: Math.max(0, finite(options.dragDeadzonePx, DEFAULTS.dragDeadzonePx)),
      allowPointerCapture: Boolean(options.allowPointerCapture ?? DEFAULTS.allowPointerCapture),
      preventDefault: Boolean(options.preventDefault ?? DEFAULTS.preventDefault),
      touchAction: String(options.touchAction || DEFAULTS.touchAction),
      cursorActive: String(options.cursorActive || DEFAULTS.cursorActive),
      cursorIdle: String(options.cursorIdle || DEFAULTS.cursorIdle),
      autoPauseWhileDragging: Boolean(options.autoPauseWhileDragging ?? DEFAULTS.autoPauseWhileDragging),
      releaseInteractionDelayMs: Math.max(0, finite(options.releaseInteractionDelayMs, DEFAULTS.releaseInteractionDelayMs))
    });
  }

  function safePreventDefault(event, enabled) {
    if (!enabled || !event) return;

    try {
      if (event.cancelable) event.preventDefault();
    } catch {
      // Control safety: ignore browser-specific preventDefault failures.
    }
  }

  function readPoint(event) {
    if (!event) {
      return Object.freeze({
        x: 0,
        y: 0,
        pointerId: null,
        pointerType: "unknown"
      });
    }

    if (event.touches && event.touches.length) {
      return Object.freeze({
        x: finite(event.touches[0].clientX, 0),
        y: finite(event.touches[0].clientY, 0),
        pointerId: "touch",
        pointerType: "touch"
      });
    }

    if (event.changedTouches && event.changedTouches.length) {
      return Object.freeze({
        x: finite(event.changedTouches[0].clientX, 0),
        y: finite(event.changedTouches[0].clientY, 0),
        pointerId: "touch",
        pointerType: "touch"
      });
    }

    return Object.freeze({
      x: finite(event.clientX, 0),
      y: finite(event.clientY, 0),
      pointerId: event.pointerId ?? "mouse",
      pointerType: event.pointerType || "mouse"
    });
  }

  function cloneState(state) {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "audralia-inspection-only-controls",
      fileNumber: FILE_NUMBER,
      primaryNode: PRIMARY_NODE,
      subnodes: SUBNODE_RANGE,

      attached: state.attached,
      active: state.active,
      enabled: state.enabled,
      pointerId: state.pointerId,
      pointerType: state.pointerType,
      startX: state.startX,
      startY: state.startY,
      lastX: state.lastX,
      lastY: state.lastY,
      totalX: state.totalX,
      totalY: state.totalY,
      lastDx: state.lastDx,
      lastDy: state.lastDy,
      velocityX: state.velocityX,
      velocityY: state.velocityY,
      dragDistance: state.dragDistance,
      dragging: state.dragging,
      lastInteractionTime: state.lastInteractionTime,
      interactionCount: state.interactionCount,

      rotationSensitivity: state.options.rotationSensitivity,
      tiltSensitivity: state.options.tiltSensitivity,
      maxDeltaPx: state.options.maxDeltaPx,
      preventDefault: state.options.preventDefault,
      touchAction: state.options.touchAction,

      runtimeBound: Boolean(state.runtime),
      elementBound: Boolean(state.element),

      ownsControls: true,
      ownsInspectionOnly: true,
      ownsRuntimeMotion: false,
      ownsCanvas: false,
      ownsRoute: false,
      ownsHtml: false,
      ownsFootprint: false,
      ownsHydrology: false,
      ownsElevation: false,
      ownsClimate: false,
      ownsBiome: false,
      ownsSurface: false,
      ownsAtmosphere: false,

      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function applyElementAffordance(element, options, active) {
    if (!element || !element.style) return;

    try {
      element.style.touchAction = options.touchAction;
      element.style.cursor = active ? options.cursorActive : options.cursorIdle;
      element.style.userSelect = "none";
      element.style.webkitUserSelect = "none";
      element.style.webkitTouchCallout = "none";
    } catch {
      // Style affordance is non-authoritative. Ignore failure.
    }
  }

  function clearElementAffordance(element) {
    if (!element || !element.style) return;

    try {
      element.style.cursor = "";
    } catch {
      // Style cleanup is non-authoritative. Ignore failure.
    }
  }

  function callRuntime(runtime, method, ...args) {
    if (!runtime || typeof runtime[method] !== "function") return null;

    try {
      return runtime[method](...args);
    } catch (error) {
      if (typeof document !== "undefined" && document.documentElement?.dataset) {
        document.documentElement.dataset.audraliaControlsRuntimeHandoffError = "true";
        document.documentElement.dataset.audraliaControlsRuntimeHandoffErrorMessage =
          error instanceof Error ? error.message : String(error);
      }
      return null;
    }
  }

  function createControls(options = {}) {
    const opts = normalizeOptions(options);

    const state = {
      element: options.element || null,
      runtime: options.runtime || null,

      attached: false,
      active: false,
      enabled: true,
      pointerId: null,
      pointerType: "none",

      startX: 0,
      startY: 0,
      lastX: 0,
      lastY: 0,
      totalX: 0,
      totalY: 0,
      lastDx: 0,
      lastDy: 0,
      velocityX: 0,
      velocityY: 0,
      dragDistance: 0,
      dragging: false,
      lastTime: 0,
      lastInteractionTime: 0,
      interactionCount: 0,
      releaseTimer: null,

      options: opts
    };

    function setRuntime(runtime) {
      state.runtime = runtime || null;
      return cloneState(state);
    }

    function setEnabled(value) {
      state.enabled = Boolean(value);

      if (!state.enabled && state.active) {
        endInteraction(null, "controls_disabled");
      }

      return cloneState(state);
    }

    function resetGesture() {
      state.active = false;
      state.pointerId = null;
      state.pointerType = "none";
      state.startX = 0;
      state.startY = 0;
      state.lastX = 0;
      state.lastY = 0;
      state.totalX = 0;
      state.totalY = 0;
      state.lastDx = 0;
      state.lastDy = 0;
      state.velocityX = 0;
      state.velocityY = 0;
      state.dragDistance = 0;
      state.dragging = false;
      state.lastTime = 0;
      return cloneState(state);
    }

    function beginInteraction(event) {
      if (!state.enabled || !state.element) return cloneState(state);

      const point = readPoint(event);
      const time = nowMs();

      safePreventDefault(event, state.options.preventDefault);

      if (state.releaseTimer) {
        clearTimeout(state.releaseTimer);
        state.releaseTimer = null;
      }

      state.active = true;
      state.pointerId = point.pointerId;
      state.pointerType = point.pointerType;
      state.startX = point.x;
      state.startY = point.y;
      state.lastX = point.x;
      state.lastY = point.y;
      state.totalX = 0;
      state.totalY = 0;
      state.lastDx = 0;
      state.lastDy = 0;
      state.velocityX = 0;
      state.velocityY = 0;
      state.dragDistance = 0;
      state.dragging = false;
      state.lastTime = time;
      state.lastInteractionTime = time;
      state.interactionCount += 1;

      applyElementAffordance(state.element, state.options, true);

      if (
        state.options.allowPointerCapture &&
        event?.pointerId !== undefined &&
        state.element?.setPointerCapture
      ) {
        try {
          state.element.setPointerCapture(event.pointerId);
        } catch {
          // Pointer capture can fail on some browsers. Gesture still proceeds.
        }
      }

      if (state.options.autoPauseWhileDragging) {
        callRuntime(state.runtime, "setInteracting", true);
      }

      return cloneState(state);
    }

    function moveInteraction(event) {
      if (!state.enabled || !state.active) return cloneState(state);

      const point = readPoint(event);

      if (
        state.pointerId !== null &&
        point.pointerId !== null &&
        point.pointerId !== state.pointerId &&
        state.pointerId !== "touch"
      ) {
        return cloneState(state);
      }

      safePreventDefault(event, state.options.preventDefault);

      const time = nowMs();
      const dt = Math.max(1, time - state.lastTime);
      const rawDx = point.x - state.lastX;
      const rawDy = point.y - state.lastY;
      const dx = clamp(rawDx, -state.options.maxDeltaPx, state.options.maxDeltaPx);
      const dy = clamp(rawDy, -state.options.maxDeltaPx, state.options.maxDeltaPx);

      state.lastX = point.x;
      state.lastY = point.y;
      state.totalX += dx;
      state.totalY += dy;
      state.lastDx = dx;
      state.lastDy = dy;
      state.velocityX = dx / dt;
      state.velocityY = dy / dt;
      state.dragDistance = Math.hypot(state.totalX, state.totalY);
      state.lastTime = time;
      state.lastInteractionTime = time;

      if (state.dragDistance >= state.options.dragDeadzonePx) {
        state.dragging = true;
      }

      if (state.dragging) {
        const rotationDelta = -dx * state.options.rotationSensitivity;
        const tiltDelta = dy * state.options.tiltSensitivity;

        callRuntime(state.runtime, "nudgeTarget", rotationDelta, tiltDelta);
        callRuntime(state.runtime, "markDirty");
      }

      return cloneState(state);
    }

    function endInteraction(event, reason = "interaction_end") {
      if (!state.active && reason !== "controls_disabled") return cloneState(state);

      if (event) {
        safePreventDefault(event, state.options.preventDefault);

        if (
          state.options.allowPointerCapture &&
          event.pointerId !== undefined &&
          state.element?.releasePointerCapture
        ) {
          try {
            state.element.releasePointerCapture(event.pointerId);
          } catch {
            // Pointer capture may already be released. Ignore.
          }
        }
      }

      const wasDragging = state.dragging;
      const time = nowMs();

      state.active = false;
      state.pointerId = null;
      state.pointerType = "none";
      state.lastInteractionTime = time;

      applyElementAffordance(state.element, state.options, false);

      if (state.options.autoPauseWhileDragging) {
        if (state.releaseTimer) clearTimeout(state.releaseTimer);

        state.releaseTimer = setTimeout(() => {
          callRuntime(state.runtime, "setInteracting", false);
          callRuntime(state.runtime, "markDirty");
          state.releaseTimer = null;
        }, state.options.releaseInteractionDelayMs);
      }

      callRuntime(state.runtime, "markDirty");

      if (typeof document !== "undefined" && document.documentElement?.dataset) {
        document.documentElement.dataset.audraliaControlsLastEndReason = reason;
        document.documentElement.dataset.audraliaControlsLastGestureWasDrag = wasDragging ? "true" : "false";
      }

      return cloneState(state);
    }

    function cancelInteraction(event) {
      return endInteraction(event, "interaction_cancelled");
    }

    function attach(element = state.element) {
      if (!element || typeof element.addEventListener !== "function") {
        return Object.freeze({
          attached: false,
          reason: "controls_attach_failed_missing_element",
          state: cloneState(state)
        });
      }

      if (state.attached && state.element === element) {
        return Object.freeze({
          attached: true,
          reason: "controls_already_attached",
          state: cloneState(state)
        });
      }

      if (state.attached) detach();

      state.element = element;

      element.addEventListener("pointerdown", beginInteraction, { passive: false });
      element.addEventListener("pointermove", moveInteraction, { passive: false });
      element.addEventListener("pointerup", endInteraction, { passive: false });
      element.addEventListener("pointercancel", cancelInteraction, { passive: false });
      element.addEventListener("lostpointercapture", cancelInteraction, { passive: false });

      element.addEventListener("touchstart", beginInteraction, { passive: false });
      element.addEventListener("touchmove", moveInteraction, { passive: false });
      element.addEventListener("touchend", endInteraction, { passive: false });
      element.addEventListener("touchcancel", cancelInteraction, { passive: false });

      state.attached = true;
      applyElementAffordance(state.element, state.options, false);

      if (typeof document !== "undefined" && document.documentElement?.dataset) {
        document.documentElement.dataset.audraliaControlsAttached = "true";
        document.documentElement.dataset.audraliaControlsContract = CONTRACT;
      }

      return Object.freeze({
        attached: true,
        reason: "controls_attached",
        state: cloneState(state)
      });
    }

    function detach() {
      if (!state.element || !state.attached) {
        return Object.freeze({
          detached: true,
          reason: "controls_not_attached",
          state: cloneState(state)
        });
      }

      const element = state.element;

      element.removeEventListener("pointerdown", beginInteraction);
      element.removeEventListener("pointermove", moveInteraction);
      element.removeEventListener("pointerup", endInteraction);
      element.removeEventListener("pointercancel", cancelInteraction);
      element.removeEventListener("lostpointercapture", cancelInteraction);

      element.removeEventListener("touchstart", beginInteraction);
      element.removeEventListener("touchmove", moveInteraction);
      element.removeEventListener("touchend", endInteraction);
      element.removeEventListener("touchcancel", cancelInteraction);

      if (state.releaseTimer) {
        clearTimeout(state.releaseTimer);
        state.releaseTimer = null;
      }

      callRuntime(state.runtime, "setInteracting", false);
      clearElementAffordance(element);
      resetGesture();

      state.attached = false;
      state.element = null;

      if (typeof document !== "undefined" && document.documentElement?.dataset) {
        document.documentElement.dataset.audraliaControlsAttached = "false";
      }

      return Object.freeze({
        detached: true,
        reason: "controls_detached",
        state: cloneState(state)
      });
    }

    function getState() {
      return cloneState(state);
    }

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "audralia-inspection-only-controls-instance",

      attach,
      detach,
      setRuntime,
      setEnabled,
      resetGesture,
      beginInteraction,
      moveInteraction,
      endInteraction,
      cancelInteraction,
      getState
    });
  }

  function validateManifestRegistration() {
    try {
      const manifest = window.DGB_PLANET_FAMILY_MANIFEST || window.AUDRALIA_CLEAN_CANVAS_MANIFEST;
      if (!manifest || typeof manifest.validatePrimaryFile !== "function") {
        return Object.freeze({
          manifestAvailable: false,
          valid: true,
          reason: "manifest_not_loaded_yet_controls_can_still_register"
        });
      }

      return manifest.validatePrimaryFile({
        path: "/assets/audralia/clean/audralia.controls.js",
        contract: CONTRACT
      });
    } catch (error) {
      return Object.freeze({
        manifestAvailable: true,
        valid: false,
        reason: error instanceof Error ? error.message : String(error)
      });
    }
  }

  function validatePriorAuthorities() {
    const runtime = R();
    const math = M();

    return Object.freeze({
      math: Object.freeze({
        available: Boolean(math),
        expectedContract: "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_MATH_TNT_v1",
        actualContract: math?.contract || null,
        valid: !math || math.contract === "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_MATH_TNT_v1"
      }),
      runtime: Object.freeze({
        available: Boolean(runtime),
        expectedContract: "AUDRALIA_CLEAN_CANVAS_RUNTIME_TNT_v1",
        actualContract: runtime?.contract || null,
        valid: !runtime || runtime.contract === "AUDRALIA_CLEAN_CANVAS_RUNTIME_TNT_v1"
      })
    });
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-inspection-only-controls",
      fileNumber: FILE_NUMBER,
      primaryNode: PRIMARY_NODE,
      subnodes: SUBNODE_RANGE,
      parentAnchor: "/showroom/globe/audralia/index.js",
      universalParent: UNIVERSAL_ANCHOR,
      downstreamGroundView: H_EARTH_ROUTE,
      targets: CONTROL_TARGETS,
      defaults: DEFAULTS,
      owns: Object.freeze([
        "pointer capture",
        "drag gesture reading",
        "touch gesture reading",
        "inspection state",
        "gesture safety",
        "sensitivity",
        "runtime handoff"
      ]),
      doesNotOwn: Object.freeze([
        "universal manifest law",
        "math primitives",
        "lattice authority",
        "palette constants",
        "Audralia identity",
        "land/ocean footprint",
        "continent creation",
        "water behavior",
        "hydrology authority",
        "elevation depth",
        "climate fields",
        "biome categories",
        "surface material synthesis",
        "atmosphere behavior",
        "weather behavior",
        "runtime motion",
        "canvas rendering",
        "canvas composition",
        "route bridge",
        "HTML expression"
      ]),
      manifestRegistration: validateManifestRegistration(),
      priorAuthorities: validatePriorAuthorities(),
      ownsControls: true,
      ownsInspectionOnly: true,
      runtimeMotionForbidden: true,
      canvasRenderingForbidden: true,
      routeBridgeForbidden: true,
      htmlExpressionForbidden: true,
      fibonacciChronology: true,
      primaryStructure16: true,
      nodalConstruct256: true,
      oneFileOneJob: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  const API = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,

    FILE_NUMBER,
    PRIMARY_NODE,
    SUBNODE_RANGE,
    UNIVERSAL_ANCHOR,
    AUDRALIA_ROUTE,
    H_EARTH_ROUTE,
    DEFAULTS,
    CONTROL_TARGETS,

    createControls,
    validateManifestRegistration,
    validatePriorAuthorities,
    getStatus
  });

  window.AUDRALIA_CONTROLS = API;
  window.AUDRALIA_CONTROLS_RECEIPT = getStatus();

  window.AUDRALIA_CLEAN_CANVAS_CONTROLS = API;
  window.AUDRALIA_CLEAN_CANVAS_CONTROLS_RECEIPT = getStatus();

  if (typeof document !== "undefined" && document.documentElement?.dataset) {
    document.documentElement.dataset.audraliaControlsLoaded = "true";
    document.documentElement.dataset.audraliaControlsContract = CONTRACT;
    document.documentElement.dataset.audraliaControlsReceipt = RECEIPT;
    document.documentElement.dataset.audraliaControlsVersion = VERSION;
    document.documentElement.dataset.audraliaCleanCanvasControlsLoaded = "true";
    document.documentElement.dataset.audraliaCleanCanvasControlsContract = CONTRACT;
    document.documentElement.dataset.audraliaCleanCanvasControlsReceipt = RECEIPT;
    document.documentElement.dataset.audraliaCleanCanvasControlsNode = String(PRIMARY_NODE);
    document.documentElement.dataset.audraliaCleanCanvasControlsSubnodes = "209-224";
    document.documentElement.dataset.audraliaControlsOwnsInspectionOnly = "true";
    document.documentElement.dataset.audraliaControlsOwnsRuntimeMotion = "false";
    document.documentElement.dataset.audraliaControlsOwnsCanvas = "false";
    document.documentElement.dataset.audraliaControlsOwnsRoute = "false";
    document.documentElement.dataset.audraliaControlsOwnsHtml = "false";
    document.documentElement.dataset.audraliaControlsDragInspection = "true";
    document.documentElement.dataset.audraliaControlsTouchInspection = "true";
    document.documentElement.dataset.audraliaControlsGestureSafety = "true";
    document.documentElement.dataset.audraliaControlsRuntimeHandoff = "true";
    document.documentElement.dataset.hEarthMayUseAudraliaInspectionControlPattern = "true";
    document.documentElement.dataset.audraliaCleanCanvasFibonacciChronology = "true";
    document.documentElement.dataset.audraliaCleanCanvasPrimaryStructure16 = "true";
    document.documentElement.dataset.audraliaCleanCanvasNodalConstruct256 = "true";
    document.documentElement.dataset.audraliaCleanCanvasOneFileOneJob = "true";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }
})();

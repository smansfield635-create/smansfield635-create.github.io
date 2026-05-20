// /assets/audralia/clean/engine/audralia/engine/motion.js
// AUDRALIA_G2_6_MOTION_SPHERICAL_INSPECTION_NO_STRETCH_TNT_v1
// Full-file replacement.
// Purpose: enforce spherical inspection motion so finger drag updates rotation/pitch state instead of stretching, skewing, translating, or scaling the rendered frame.
// Motion owns: drag state, rotation state, pitch state, inertial glide, auto-rotation, redraw requests, and no-stretch input restraints.
// Motion does not own: drawing, canvas creation, topology, hydrology, surface material, terrain, elevation, ocean, sky, route bridge, HTML shell, generated image, GraphicBox, or visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_6_MOTION_SPHERICAL_INSPECTION_NO_STRETCH_TNT_v1";
  const RECEIPT = "AUDRALIA_G2_6_MOTION_SPHERICAL_INSPECTION_NO_STRETCH_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_G2_5_SIMPLE_ENGINE_CHILD_SPLIT_TNT_v1";
  const TARGET = "/assets/audralia/clean/engine/audralia/engine/motion.js";
  const ROUTE = "/showroom/globe/audralia/";

  const TAU = Math.PI * 2;

  const DEFAULTS = Object.freeze({
    initialRotation: -0.92,
    initialPitch: -0.11,
    axialTilt: -0.11,

    minPitch: -0.72,
    maxPitch: 0.62,

    dragRadiansPerPixel: 0.0105,
    pitchRadiansPerPixel: 0.0048,

    smoothing: 0.17,
    pitchSmoothing: 0.16,

    inertiaDecay: 0.925,
    inertiaMin: 0.000012,
    maxInertiaVelocity: 0.038,

    autoRotate: true,
    autoRotateSpeed: 0.000052,
    autoRotateDuringDrag: false,

    requestRenderThrottleMs: 0,
    noStretchWatch: true,
    pointerCapture: true
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    target: TARGET,
    route: ROUTE,

    mounted: false,
    enabled: true,
    disposed: false,

    dragMode: "spherical-state",
    canvasTransformForbidden: true,
    cssTransformForbidden: true,
    bitmapStretchForbidden: true,
    screenPlaneDragForbidden: true,

    rotationStateActive: true,
    pitchStateActive: true,
    inertiaStateActive: true,
    requestRenderOnDrag: true,

    rotation: DEFAULTS.initialRotation,
    targetRotation: DEFAULTS.initialRotation,
    longitudeRotation: DEFAULTS.initialRotation,
    yaw: DEFAULTS.initialRotation,

    pitch: DEFAULTS.initialPitch,
    targetPitch: DEFAULTS.initialPitch,
    tilt: DEFAULTS.initialPitch,
    axialTilt: DEFAULTS.axialTilt,

    velocity: 0,
    pitchVelocity: 0,

    dragging: false,
    pointerId: null,
    lastX: 0,
    lastY: 0,
    lastPointerTime: 0,

    frameId: 0,
    lastFrameTime: 0,
    lastRenderRequestTime: 0,
    renderRequestCount: 0,
    updateCount: 0,

    reducedMotion: false,
    parent: null,
    targetElement: null,
    options: { ...DEFAULTS },

    lastDeltaX: 0,
    lastDeltaY: 0,
    lastMotionReason: "module-load",
    lastError: "",
    lastTransformSuppressionCount: 0,

    ownsDrawing: false,
    ownsTopology: false,
    ownsHydrology: false,
    ownsSurface: false,
    ownsTerrain: false,
    ownsElevation: false,
    ownsOcean: false,
    ownsSky: false,
    ownsRoute: false,
    visualPassClaim: false,
    generatedImage: false,
    graphicBox: false
  };

  const publicState = {
    contract: CONTRACT,
    receipt: RECEIPT,
    dragMode: "spherical-state",

    rotation: state.rotation,
    targetRotation: state.targetRotation,
    longitudeRotation: state.longitudeRotation,
    longitudeRotationRadians: state.longitudeRotation,
    yaw: state.yaw,
    yawRadians: state.yaw,

    pitch: state.pitch,
    targetPitch: state.targetPitch,
    pitchRadians: state.pitch,
    tilt: state.tilt,
    axialTilt: state.axialTilt,

    velocity: state.velocity,
    pitchVelocity: state.pitchVelocity,
    dragging: state.dragging,

    canvasTransformForbidden: true,
    cssTransformForbidden: true,
    bitmapStretchForbidden: true,
    screenPlaneDragForbidden: true,

    ownsDrawing: false,
    visualPassClaim: false
  };

  function hasWindow() {
    return typeof window !== "undefined";
  }

  function hasDocument() {
    return typeof document !== "undefined";
  }

  function now() {
    if (hasWindow() && window.performance && typeof window.performance.now === "function") {
      return window.performance.now();
    }
    return Date.now();
  }

  function finite(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function wrapRadians(value) {
    let out = finite(value, 0);
    while (out <= -Math.PI) out += TAU;
    while (out > Math.PI) out -= TAU;
    return out;
  }

  function mergeOptions(options = {}) {
    const merged = { ...DEFAULTS, ...options };

    merged.initialRotation = finite(merged.initialRotation, DEFAULTS.initialRotation);
    merged.initialPitch = clamp(finite(merged.initialPitch, DEFAULTS.initialPitch), merged.minPitch, merged.maxPitch);
    merged.axialTilt = finite(merged.axialTilt, DEFAULTS.axialTilt);

    merged.minPitch = finite(merged.minPitch, DEFAULTS.minPitch);
    merged.maxPitch = finite(merged.maxPitch, DEFAULTS.maxPitch);

    merged.dragRadiansPerPixel = clamp(finite(merged.dragRadiansPerPixel, DEFAULTS.dragRadiansPerPixel), 0.001, 0.04);
    merged.pitchRadiansPerPixel = clamp(finite(merged.pitchRadiansPerPixel, DEFAULTS.pitchRadiansPerPixel), 0.001, 0.02);

    merged.smoothing = clamp(finite(merged.smoothing, DEFAULTS.smoothing), 0.04, 0.46);
    merged.pitchSmoothing = clamp(finite(merged.pitchSmoothing, DEFAULTS.pitchSmoothing), 0.04, 0.46);

    merged.inertiaDecay = clamp(finite(merged.inertiaDecay, DEFAULTS.inertiaDecay), 0.72, 0.985);
    merged.inertiaMin = clamp(finite(merged.inertiaMin, DEFAULTS.inertiaMin), 0.000001, 0.002);
    merged.maxInertiaVelocity = clamp(finite(merged.maxInertiaVelocity, DEFAULTS.maxInertiaVelocity), 0.004, 0.09);

    merged.autoRotateSpeed = clamp(finite(merged.autoRotateSpeed, DEFAULTS.autoRotateSpeed), 0, 0.001);
    merged.requestRenderThrottleMs = clamp(finite(merged.requestRenderThrottleMs, DEFAULTS.requestRenderThrottleMs), 0, 120);

    return merged;
  }

  function detectReducedMotion() {
    try {
      return Boolean(hasWindow() && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    } catch (_error) {
      return false;
    }
  }

  function setError(scope, error) {
    state.lastError = `${scope}: ${error && error.message ? error.message : String(error)}`;
    publishReceipt(scope);
  }

  function updatePublicState(reason = "update") {
    state.rotation = wrapRadians(state.rotation);
    state.targetRotation = wrapRadians(state.targetRotation);
    state.longitudeRotation = state.rotation;
    state.yaw = state.rotation;

    state.pitch = clamp(state.pitch, state.options.minPitch, state.options.maxPitch);
    state.targetPitch = clamp(state.targetPitch, state.options.minPitch, state.options.maxPitch);
    state.tilt = state.pitch;

    publicState.contract = CONTRACT;
    publicState.receipt = RECEIPT;
    publicState.dragMode = "spherical-state";

    publicState.rotation = state.rotation;
    publicState.targetRotation = state.targetRotation;
    publicState.longitudeRotation = state.longitudeRotation;
    publicState.longitudeRotationRadians = state.longitudeRotation;
    publicState.yaw = state.yaw;
    publicState.yawRadians = state.yaw;

    publicState.pitch = state.pitch;
    publicState.targetPitch = state.targetPitch;
    publicState.pitchRadians = state.pitch;
    publicState.tilt = state.tilt;
    publicState.axialTilt = state.axialTilt;

    publicState.velocity = state.velocity;
    publicState.pitchVelocity = state.pitchVelocity;
    publicState.dragging = state.dragging;

    publicState.updateCount = state.updateCount;
    publicState.renderRequestCount = state.renderRequestCount;
    publicState.lastMotionReason = reason;

    if (hasWindow()) {
      window.AUDRALIA_MOTION_STATE = publicState;
      window.AUDRALIA_CLEAN_CANVAS_MOTION_STATE = publicState;
      window.AUDRALIA_ROTATION = state.rotation;
      window.AUDRALIA_LONGITUDE_ROTATION = state.longitudeRotation;
      window.AUDRALIA_PITCH = state.pitch;
      window.AUDRALIA_TILT = state.tilt;
    }

    return publicState;
  }

  function getStatus() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      target: TARGET,
      route: ROUTE,

      mounted: state.mounted,
      enabled: state.enabled,
      disposed: state.disposed,

      dragMode: "spherical-state",
      canvasTransformForbidden: true,
      cssTransformForbidden: true,
      bitmapStretchForbidden: true,
      screenPlaneDragForbidden: true,

      rotationStateActive: true,
      pitchStateActive: true,
      inertiaStateActive: true,
      requestRenderOnDrag: true,

      rotation: state.rotation,
      targetRotation: state.targetRotation,
      longitudeRotation: state.longitudeRotation,
      yaw: state.yaw,

      pitch: state.pitch,
      targetPitch: state.targetPitch,
      tilt: state.tilt,
      axialTilt: state.axialTilt,

      velocity: state.velocity,
      pitchVelocity: state.pitchVelocity,
      dragging: state.dragging,

      minPitch: state.options.minPitch,
      maxPitch: state.options.maxPitch,
      autoRotate: state.options.autoRotate,
      autoRotateSpeed: state.options.autoRotateSpeed,
      reducedMotion: state.reducedMotion,

      updateCount: state.updateCount,
      renderRequestCount: state.renderRequestCount,
      lastMotionReason: state.lastMotionReason,
      lastError: state.lastError,
      lastTransformSuppressionCount: state.lastTransformSuppressionCount,

      owns: [
        "drag state",
        "rotation state",
        "pitch state",
        "inertial glide",
        "auto-rotation",
        "redraw requests",
        "no-stretch input restraints"
      ],

      doesNotOwn: [
        "drawing",
        "canvas creation",
        "topology",
        "hydrology",
        "surface material",
        "terrain",
        "elevation",
        "ocean",
        "sky",
        "route bridge",
        "HTML shell"
      ],

      ownsDrawing: false,
      ownsTopology: false,
      ownsHydrology: false,
      ownsSurface: false,
      ownsTerrain: false,
      ownsElevation: false,
      ownsOcean: false,
      ownsSky: false,
      ownsRoute: false,

      generatedImage: false,
      graphicBox: false,
      visualPassClaim: false
    };
  }

  function publishReceipt(scope = "publish") {
    updatePublicState(scope);

    if (!hasWindow()) return getStatus();

    const receipt = getStatus();

    window.AUDRALIA_MOTION_RECEIPT = receipt;
    window.AUDRALIA_CLEAN_MOTION_RECEIPT = receipt;
    window.AUDRALIA_CLEAN_CANVAS_MOTION_RECEIPT = receipt;
    window.AUDRALIA_G2_6_MOTION_SPHERICAL_INSPECTION_NO_STRETCH_RECEIPT = receipt;

    window.AUDRALIA_G2_6_MOTION_SPHERICAL_INSPECTION_NO_STRETCH_ACTIVE = true;
    window.AUDRALIA_MOTION_DRAG_MODE = "spherical-state";
    window.AUDRALIA_MOTION_NO_STRETCH = true;

    if (hasDocument() && document.documentElement) {
      const root = document.documentElement;
      root.dataset.audraliaMotionLoaded = "true";
      root.dataset.audraliaMotionContract = CONTRACT;
      root.dataset.audraliaMotionReceipt = RECEIPT;
      root.dataset.audraliaMotionDragMode = "spherical-state";
      root.dataset.audraliaMotionCanvasTransformForbidden = "true";
      root.dataset.audraliaMotionCssTransformForbidden = "true";
      root.dataset.audraliaMotionBitmapStretchForbidden = "true";
      root.dataset.audraliaMotionScreenPlaneDragForbidden = "true";
      root.dataset.audraliaMotionRotationStateActive = "true";
      root.dataset.audraliaMotionPitchStateActive = "true";
      root.dataset.audraliaMotionInertiaStateActive = "true";
      root.dataset.audraliaMotionRequestRenderOnDrag = "true";
      root.dataset.audraliaMotionOwnsDrawing = "false";
      root.dataset.audraliaMotionOwnsTopology = "false";
      root.dataset.audraliaMotionOwnsHydrology = "false";
      root.dataset.audraliaMotionOwnsSurface = "false";
      root.dataset.audraliaMotionVisualPassClaim = "false";
      root.dataset.generatedImage = "false";
      root.dataset.graphicBox = "false";
      root.dataset.visualPassClaimed = "false";
      root.dataset.audraliaMotionLastScope = scope;
    }

    try {
      window.dispatchEvent(new CustomEvent("audralia:motion:receipt", { detail: receipt }));
    } catch (_error) {
      try {
        window.dispatchEvent(new Event("audralia:motion:receipt"));
      } catch (_ignored) {}
    }

    return receipt;
  }

  function suppressElementTransform(element) {
    if (!element || !element.style) return 0;

    let count = 0;

    const style = element.style;

    if (style.transform && style.transform !== "none") {
      style.transform = "none";
      count += 1;
    }

    if (style.translate && style.translate !== "none") {
      style.translate = "none";
      count += 1;
    }

    if (style.scale && style.scale !== "none") {
      style.scale = "none";
      count += 1;
    }

    if (style.rotate && style.rotate !== "none") {
      style.rotate = "none";
      count += 1;
    }

    if (style.transformOrigin && style.transformOrigin !== "50% 50%") {
      style.transformOrigin = "50% 50%";
      count += 1;
    }

    return count;
  }

  function suppressScreenPlaneTransforms() {
    if (!state.options.noStretchWatch || !hasDocument()) return 0;

    let count = 0;
    const target = state.targetElement;

    if (target) {
      count += suppressElementTransform(target);
    }

    try {
      const nodes = [];

      if (target && typeof target.querySelectorAll === "function") {
        target
          .querySelectorAll(
            "canvas,[data-audralia-visible-canvas='true'],[data-audralia-parent-chain-canvas='true'],[data-audralia-stage='true']"
          )
          .forEach((node) => nodes.push(node));
      }

      document
        .querySelectorAll(
          "canvas[data-audralia-visible-canvas='true'],canvas[data-audralia-parent-chain-canvas='true'],[data-audralia-motion-no-stretch='true']"
        )
        .forEach((node) => nodes.push(node));

      const seen = new Set();

      nodes.forEach((node) => {
        if (!node || seen.has(node)) return;
        seen.add(node);

        count += suppressElementTransform(node);

        if (node.style) {
          node.style.touchAction = "none";
          node.style.userSelect = "none";
          node.style.WebkitUserSelect = "none";
        }
      });
    } catch (error) {
      setError("suppressScreenPlaneTransforms", error);
    }

    state.lastTransformSuppressionCount = count;
    return count;
  }

  function resolveParent(candidate = null) {
    if (candidate) return candidate;

    if (!hasWindow()) return null;

    return (
      window.AUDRALIA_CLEAN_CANVAS_AUTHORITY ||
      window.AUDRALIA_CLEAN_CANVAS_ENGINE ||
      window.AUDRALIA_CLEAN_ENGINE_PARENT ||
      window.AUDRALIA_ENGINE ||
      window.AUDRALIA_CLEAN_PARENT_ENGINE ||
      null
    );
  }

  function requestRender(reason = "motion") {
    const t = now();

    if (
      state.options.requestRenderThrottleMs > 0 &&
      t - state.lastRenderRequestTime < state.options.requestRenderThrottleMs
    ) {
      return false;
    }

    state.lastRenderRequestTime = t;
    state.renderRequestCount += 1;
    state.lastMotionReason = reason;

    updatePublicState(reason);
    suppressScreenPlaneTransforms();

    const parent = resolveParent(state.parent);

    try {
      if (parent && typeof parent.requestRender === "function") {
        parent.requestRender(publicState);
      } else if (parent && typeof parent.render === "function") {
        parent.render(publicState);
      } else if (parent && typeof parent.redraw === "function") {
        parent.redraw(publicState);
      }
    } catch (error) {
      setError("requestRender.parent", error);
    }

    if (hasWindow()) {
      try {
        window.dispatchEvent(
          new CustomEvent("audralia:motion:update", {
            detail: {
              reason,
              state: { ...publicState }
            }
          })
        );
      } catch (_error) {
        try {
          window.dispatchEvent(new Event("audralia:motion:update"));
        } catch (_ignored) {}
      }
    }

    return true;
  }

  function update(dtMs = 16.667, reason = "update") {
    if (!state.enabled || state.disposed) return publicState;

    const dt = clamp(dtMs, 0, 80);
    const options = state.options;

    if (!state.dragging && options.autoRotate && !state.reducedMotion) {
      state.targetRotation += options.autoRotateSpeed * dt;
    }

    if (!state.dragging && Math.abs(state.velocity) > options.inertiaMin) {
      state.targetRotation += state.velocity * dt;
      state.velocity *= options.inertiaDecay;
    } else if (!state.dragging) {
      state.velocity = 0;
    }

    if (!state.dragging && Math.abs(state.pitchVelocity) > options.inertiaMin) {
      state.targetPitch = clamp(state.targetPitch + state.pitchVelocity * dt, options.minPitch, options.maxPitch);
      state.pitchVelocity *= options.inertiaDecay;
    } else if (!state.dragging) {
      state.pitchVelocity = 0;
    }

    state.targetRotation = wrapRadians(state.targetRotation);
    state.targetPitch = clamp(state.targetPitch, options.minPitch, options.maxPitch);

    const nextRotation = state.rotation + wrapRadians(state.targetRotation - state.rotation) * options.smoothing;
    const nextPitch = state.pitch + (state.targetPitch - state.pitch) * options.pitchSmoothing;

    const moved =
      Math.abs(wrapRadians(nextRotation - state.rotation)) > 0.000001 ||
      Math.abs(nextPitch - state.pitch) > 0.000001 ||
      Math.abs(state.velocity) > options.inertiaMin ||
      Math.abs(state.pitchVelocity) > options.inertiaMin ||
      (!state.dragging && options.autoRotate && !state.reducedMotion);

    state.rotation = wrapRadians(nextRotation);
    state.pitch = clamp(nextPitch, options.minPitch, options.maxPitch);
    state.longitudeRotation = state.rotation;
    state.yaw = state.rotation;
    state.tilt = state.pitch;

    state.updateCount += 1;

    updatePublicState(reason);

    if (moved) requestRender(reason);

    return publicState;
  }

  function frame(t) {
    if (state.disposed) return;

    const time = Number.isFinite(Number(t)) ? Number(t) : now();
    const last = state.lastFrameTime || time;
    const dt = clamp(time - last, 0, 80);

    state.lastFrameTime = time;

    update(dt, state.dragging ? "drag-frame" : "motion-frame");

    if (!state.disposed) {
      state.frameId = window.requestAnimationFrame(frame);
    }
  }

  function startLoop() {
    if (!hasWindow() || state.frameId) return;

    state.lastFrameTime = now();
    state.frameId = window.requestAnimationFrame(frame);
  }

  function stopLoop() {
    if (!hasWindow() || !state.frameId) return;

    window.cancelAnimationFrame(state.frameId);
    state.frameId = 0;
  }

  function pointerDown(event) {
    if (!state.enabled || state.disposed) return;

    state.dragging = true;
    state.pointerId = event.pointerId === undefined ? "mouse" : event.pointerId;
    state.lastX = finite(event.clientX, 0);
    state.lastY = finite(event.clientY, 0);
    state.lastPointerTime = now();
    state.velocity = 0;
    state.pitchVelocity = 0;
    state.lastDeltaX = 0;
    state.lastDeltaY = 0;
    state.lastMotionReason = "pointer-down";

    suppressScreenPlaneTransforms();

    if (state.options.pointerCapture && event.currentTarget && typeof event.currentTarget.setPointerCapture === "function") {
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch (_error) {}
    }

    if (event.currentTarget && event.currentTarget.style) {
      event.currentTarget.style.cursor = "grabbing";
    }

    try {
      event.preventDefault();
    } catch (_error) {}

    updatePublicState("pointer-down");
    requestRender("pointer-down");
  }

  function pointerMove(event) {
    if (!state.enabled || state.disposed || !state.dragging) return;

    const x = finite(event.clientX, state.lastX);
    const y = finite(event.clientY, state.lastY);
    const t = now();

    const dx = x - state.lastX;
    const dy = y - state.lastY;
    const dt = Math.max(1, t - (state.lastPointerTime || t));

    state.lastX = x;
    state.lastY = y;
    state.lastPointerTime = t;
    state.lastDeltaX = dx;
    state.lastDeltaY = dy;

    const options = state.options;

    const rotationDelta = dx * options.dragRadiansPerPixel;
    const pitchDelta = dy * options.pitchRadiansPerPixel;

    state.targetRotation = wrapRadians(state.targetRotation + rotationDelta);
    state.targetPitch = clamp(state.targetPitch + pitchDelta, options.minPitch, options.maxPitch);

    state.velocity = clamp(rotationDelta / dt, -options.maxInertiaVelocity, options.maxInertiaVelocity);
    state.pitchVelocity = clamp(pitchDelta / dt, -options.maxInertiaVelocity, options.maxInertiaVelocity);

    state.rotation = wrapRadians(state.rotation + rotationDelta * 0.82);
    state.pitch = clamp(state.pitch + pitchDelta * 0.82, options.minPitch, options.maxPitch);
    state.longitudeRotation = state.rotation;
    state.yaw = state.rotation;
    state.tilt = state.pitch;

    suppressScreenPlaneTransforms();

    try {
      event.preventDefault();
    } catch (_error) {}

    updatePublicState("pointer-move");
    requestRender("pointer-move");
  }

  function pointerUp(event) {
    if (!state.dragging) return;

    state.dragging = false;
    state.pointerId = null;
    state.lastMotionReason = "pointer-up";

    if (event && event.currentTarget && event.currentTarget.style) {
      event.currentTarget.style.cursor = "grab";
    }

    if (
      state.options.pointerCapture &&
      event &&
      event.currentTarget &&
      typeof event.currentTarget.releasePointerCapture === "function" &&
      event.pointerId !== undefined
    ) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch (_error) {}
    }

    suppressScreenPlaneTransforms();

    try {
      if (event && typeof event.preventDefault === "function") event.preventDefault();
    } catch (_error) {}

    updatePublicState("pointer-up");
    requestRender("pointer-up");
  }

  function wheel(event) {
    if (!state.enabled || state.disposed) return;

    const delta = clamp(finite(event.deltaY, 0), -120, 120);
    state.targetPitch = clamp(
      state.targetPitch + delta * 0.0009,
      state.options.minPitch,
      state.options.maxPitch
    );

    try {
      event.preventDefault();
    } catch (_error) {}

    updatePublicState("wheel-pitch");
    requestRender("wheel-pitch");
  }

  function removeListeners(element) {
    if (!element || !element.removeEventListener) return;

    element.removeEventListener("pointerdown", pointerDown);
    element.removeEventListener("pointermove", pointerMove);
    element.removeEventListener("pointerup", pointerUp);
    element.removeEventListener("pointercancel", pointerUp);
    element.removeEventListener("lostpointercapture", pointerUp);
    element.removeEventListener("wheel", wheel);
  }

  function addListeners(element) {
    if (!element || !element.addEventListener) return;

    element.addEventListener("pointerdown", pointerDown, { passive: false });
    element.addEventListener("pointermove", pointerMove, { passive: false });
    element.addEventListener("pointerup", pointerUp, { passive: false });
    element.addEventListener("pointercancel", pointerUp, { passive: false });
    element.addEventListener("lostpointercapture", pointerUp, { passive: false });
    element.addEventListener("wheel", wheel, { passive: false });
  }

  function prepareTarget(element) {
    if (!element || !element.style) return;

    element.dataset.audraliaMotionNoStretch = "true";
    element.dataset.audraliaMotionContract = CONTRACT;
    element.dataset.audraliaMotionDragMode = "spherical-state";

    element.style.touchAction = "none";
    element.style.userSelect = "none";
    element.style.WebkitUserSelect = "none";
    element.style.cursor = "grab";

    suppressElementTransform(element);
  }

  function resolveTarget(target) {
    if (target && target.nodeType === 1) return target;

    if (!hasDocument()) return null;

    return (
      document.querySelector("[data-audralia-stage='true']") ||
      document.querySelector("[data-audralia-mount='true']") ||
      document.querySelector("#audralia-form-mount") ||
      document.querySelector("#audralia-stage") ||
      document.querySelector("canvas[data-audralia-visible-canvas='true']") ||
      document.querySelector("canvas") ||
      document.body
    );
  }

  function bind(target, options = {}) {
    const element = resolveTarget(target);

    state.options = mergeOptions(options);
    state.reducedMotion = detectReducedMotion();

    if (state.targetElement && state.targetElement !== element) {
      removeListeners(state.targetElement);
    }

    state.targetElement = element;
    state.parent = resolveParent(options.parent || options.engine || null);

    if (element) {
      prepareTarget(element);
      addListeners(element);
    }

    state.mounted = true;
    state.disposed = false;
    state.enabled = true;

    suppressScreenPlaneTransforms();
    publishReceipt("bind");
    startLoop();
    requestRender("bind");

    return api;
  }

  function mount(target, options = {}) {
    return bind(target, options);
  }

  function attach(target, options = {}) {
    return bind(target, options);
  }

  function bindControls(target, options = {}) {
    return bind(target, options);
  }

  function unbind() {
    if (state.targetElement) {
      removeListeners(state.targetElement);
    }

    state.targetElement = null;
    state.parent = null;
    state.dragging = false;
    state.pointerId = null;
    state.mounted = false;

    publishReceipt("unbind");

    return api;
  }

  function dispose() {
    unbind();
    stopLoop();
    state.disposed = true;
    state.enabled = false;

    publishReceipt("dispose");

    return api;
  }

  function reset(next = {}) {
    const options = state.options;

    state.rotation = wrapRadians(
      next.rotation !== undefined ? next.rotation : options.initialRotation
    );
    state.targetRotation = state.rotation;
    state.longitudeRotation = state.rotation;
    state.yaw = state.rotation;

    state.pitch = clamp(
      next.pitch !== undefined ? next.pitch : options.initialPitch,
      options.minPitch,
      options.maxPitch
    );
    state.targetPitch = state.pitch;
    state.tilt = state.pitch;

    state.velocity = 0;
    state.pitchVelocity = 0;
    state.dragging = false;
    state.lastMotionReason = "reset";

    updatePublicState("reset");
    requestRender("reset");

    return api;
  }

  function setRotation(value) {
    state.targetRotation = wrapRadians(value);
    state.rotation = wrapRadians(value);
    state.longitudeRotation = state.rotation;
    state.yaw = state.rotation;

    updatePublicState("setRotation");
    requestRender("setRotation");

    return api;
  }

  function setPitch(value) {
    state.targetPitch = clamp(value, state.options.minPitch, state.options.maxPitch);
    state.pitch = state.targetPitch;
    state.tilt = state.pitch;

    updatePublicState("setPitch");
    requestRender("setPitch");

    return api;
  }

  function nudge(deltaRotation = 0, deltaPitch = 0) {
    state.targetRotation = wrapRadians(state.targetRotation + finite(deltaRotation, 0));
    state.targetPitch = clamp(
      state.targetPitch + finite(deltaPitch, 0),
      state.options.minPitch,
      state.options.maxPitch
    );

    updatePublicState("nudge");
    requestRender("nudge");

    return api;
  }

  function enable() {
    state.enabled = true;
    publishReceipt("enable");
    startLoop();
    return api;
  }

  function disable() {
    state.enabled = false;
    state.dragging = false;
    publishReceipt("disable");
    return api;
  }

  function setAutoRotate(value) {
    state.options.autoRotate = Boolean(value);
    publishReceipt("setAutoRotate");
    return api;
  }

  function getState() {
    return { ...updatePublicState("getState") };
  }

  function read() {
    return getState();
  }

  function getProjectionState() {
    return {
      rotation: state.rotation,
      longitudeRotation: state.longitudeRotation,
      longitudeRotationRadians: state.longitudeRotation,
      yaw: state.yaw,
      yawRadians: state.yaw,
      pitch: state.pitch,
      pitchRadians: state.pitch,
      tilt: state.tilt,
      axialTilt: state.axialTilt,
      dragging: state.dragging,
      velocity: state.velocity,
      pitchVelocity: state.pitchVelocity,
      dragMode: "spherical-state"
    };
  }

  function applyToPayload(payload = {}) {
    return {
      ...payload,
      motion: getProjectionState(),
      rotation: state.rotation,
      pitch: state.pitch,
      tilt: state.tilt,
      dragMode: "spherical-state"
    };
  }

  function init(target, options = {}) {
    return bind(target, options);
  }

  function boot(target, options = {}) {
    return bind(target, options);
  }

  function create(target, options = {}) {
    return bind(target, options);
  }

  function start(target, options = {}) {
    return bind(target, options);
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    target: TARGET,
    route: ROUTE,

    state: publicState,

    mount,
    bind,
    attach,
    bindControls,
    unbind,
    dispose,

    init,
    boot,
    create,
    start,

    update,
    step: update,
    tick: update,
    requestRender,

    reset,
    setRotation,
    setPitch,
    nudge,
    enable,
    disable,
    setAutoRotate,

    getState,
    read,
    getProjectionState,
    applyToPayload,

    getStatus,
    status: getStatus,
    publishReceipt
  };

  if (hasWindow()) {
    updatePublicState("module-load");

    window.AUDRALIA_MOTION = api;
    window.AUDRALIA_CLEAN_MOTION = api;
    window.AUDRALIA_CLEAN_CANVAS_MOTION = api;
    window.AUDRALIA_CLEAN_CANVAS_MOTION_ENGINE = api;
    window.AUDRALIA_MOTION_ENGINE = api;
    window.AudraliaMotion = api;
    window.audraliaMotion = api;

    publishReceipt("module-load");

    if (hasDocument()) {
      if (document.readyState === "loading") {
        document.addEventListener(
          "DOMContentLoaded",
          () => {
            if (!state.mounted) bind(null, {});
          },
          { once: true }
        );
      } else {
        setTimeout(() => {
          if (!state.mounted) bind(null, {});
        }, 0);
      }
    }
  }
})();

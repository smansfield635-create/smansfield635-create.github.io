// /assets/audralia/clean/engine/motion.js
// AUDRALIA_G2_5_MOTION_CHILD_ENGINE_TNT_v1
// Child engine for Audralia clean-canvas stack.
// Owns: Earth-like axis tilt, longitude rotation, auto rotation, finger drag, pitch bounds, pointer/touch input, redraw triggers.
// Does not own: mount, canvas creation, continents, sea level, sky, route bridge, HTML, or parent Globe.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_5_MOTION_CHILD_ENGINE_TNT_v1";
  const RECEIPT = "AUDRALIA_G2_5_MOTION_CHILD_ENGINE_RECEIPT_v1";
  const ROUTE = "/showroom/globe/audralia/";
  const VERSION = "2026-05-20.audralia-g2-5-motion-child-engine-v1";

  const DEFAULTS = Object.freeze({
    axisTiltDegrees: 23.5,
    autoRotationEnabled: true,
    autoRotationStep: 0.018,
    autoRotationFrameMs: 100,
    dragRotationScale: 0.0085,
    dragPitchScale: 0.0045,
    maxViewPitch: 0.62,
    initialRotationLon: 0,
    initialViewPitch: 0.10,
    redrawThrottleMs: 16
  });

  const registry = new WeakMap();

  const globalState = {
    createdCount: 0,
    activeCount: 0,
    lastCreatedAt: null,
    lastInteractionAt: null,
    lastStatus: null
  };

  function win() {
    return typeof window !== "undefined" ? window : {};
  }

  function now() {
    return new Date().toISOString();
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function normalizeAngle(angle) {
    const full = Math.PI * 2;
    let value = angle % full;
    if (value < 0) value += full;
    return value;
  }

  function normalize3(v) {
    const x = Number(v?.x || 0);
    const y = Number(v?.y || 0);
    const z = Number(v?.z || 0);
    const m = Math.hypot(x, y, z) || 1;
    return { x: x / m, y: y / m, z: z / m };
  }

  function rotateX(v, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return {
      x: v.x,
      y: v.y * c - v.z * s,
      z: v.y * s + v.z * c
    };
  }

  function rotateY(v, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return {
      x: v.x * c + v.z * s,
      y: v.y,
      z: -v.x * s + v.z * c
    };
  }

  function axisTiltRad(motionState) {
    const degrees = Number(motionState?.axisTiltDegrees ?? DEFAULTS.axisTiltDegrees);
    return (degrees * Math.PI) / 180;
  }

  function getPointerXY(event) {
    if (event?.touches?.length) {
      return {
        x: Number(event.touches[0].clientX || 0),
        y: Number(event.touches[0].clientY || 0)
      };
    }

    if (event?.changedTouches?.length) {
      return {
        x: Number(event.changedTouches[0].clientX || 0),
        y: Number(event.changedTouches[0].clientY || 0)
      };
    }

    return {
      x: Number(event?.clientX || 0),
      y: Number(event?.clientY || 0)
    };
  }

  function safeRedraw(motionState, immediate = false) {
    if (!motionState || typeof motionState.redraw !== "function") return;

    const timestamp = Date.now();

    if (!immediate && timestamp - motionState.lastRedrawAt < motionState.redrawThrottleMs) {
      if (!motionState.pendingRedraw) {
        motionState.pendingRedraw = true;

        const delay = Math.max(0, motionState.redrawThrottleMs - (timestamp - motionState.lastRedrawAt));

        win().setTimeout?.(() => {
          motionState.pendingRedraw = false;
          safeRedraw(motionState, true);
        }, delay);
      }

      return;
    }

    motionState.lastRedrawAt = timestamp;

    try {
      motionState.redraw(motionState);
    } catch (error) {
      motionState.lastError = error?.message || String(error);
    }
  }

  function projectViewToWorld(viewNormal, motionState) {
    const state = motionState || DEFAULTS;

    let v = normalize3(viewNormal);

    v = rotateX(v, Number(state.viewPitch || 0));
    v = rotateX(v, axisTiltRad(state));
    v = rotateY(v, Number(state.rotationLon || 0));

    return normalize3(v);
  }

  function projectWorldToView(worldNormal, motionState) {
    const state = motionState || DEFAULTS;

    let v = normalize3(worldNormal);

    v = rotateY(v, -Number(state.rotationLon || 0));
    v = rotateX(v, -axisTiltRad(state));
    v = rotateX(v, -Number(state.viewPitch || 0));

    return normalize3(v);
  }

  function startAutoRotation(motionState) {
    if (!motionState || motionState.autoLoopActive) return;

    motionState.autoLoopActive = true;

    const loop = (timestamp) => {
      if (!motionState.autoLoopActive) return;

      const time = Number(timestamp || Date.now());

      if (
        motionState.autoRotationEnabled &&
        !motionState.dragging &&
        !motionState.paused &&
        time - motionState.lastAutoFrameAt >= motionState.autoRotationFrameMs
      ) {
        motionState.rotationLon = normalizeAngle(motionState.rotationLon + motionState.autoRotationStep);
        motionState.lastAutoFrameAt = time;
        safeRedraw(motionState);
      }

      if (typeof win().requestAnimationFrame === "function") {
        motionState.animationFrame = win().requestAnimationFrame(loop);
      } else {
        motionState.animationFrame = win().setTimeout?.(() => loop(Date.now()), motionState.autoRotationFrameMs);
      }
    };

    loop(Date.now());
  }

  function stopAutoRotation(motionState) {
    if (!motionState) return;

    motionState.autoLoopActive = false;

    if (motionState.animationFrame && typeof win().cancelAnimationFrame === "function") {
      win().cancelAnimationFrame(motionState.animationFrame);
    }

    if (motionState.animationFrame && typeof win().clearTimeout === "function") {
      win().clearTimeout(motionState.animationFrame);
    }

    motionState.animationFrame = 0;
  }

  function bindPointerEvents(canvas, motionState) {
    if (!canvas || !motionState || motionState.pointerBound) return;

    motionState.pointerBound = true;

    const onDown = (event) => {
      const point = getPointerXY(event);

      motionState.dragging = true;
      motionState.lastPointerX = point.x;
      motionState.lastPointerY = point.y;
      motionState.lastInteractionAt = now();
      globalState.lastInteractionAt = motionState.lastInteractionAt;

      canvas.style.cursor = "grabbing";
      canvas.setPointerCapture?.(event.pointerId);

      safeRedraw(motionState, true);
      event.preventDefault?.();
    };

    const onMove = (event) => {
      if (!motionState.dragging) return;

      const point = getPointerXY(event);
      const dx = point.x - motionState.lastPointerX;
      const dy = point.y - motionState.lastPointerY;

      motionState.lastPointerX = point.x;
      motionState.lastPointerY = point.y;

      motionState.rotationLon = normalizeAngle(
        motionState.rotationLon + dx * motionState.dragRotationScale
      );

      motionState.viewPitch = clamp(
        motionState.viewPitch + dy * motionState.dragPitchScale,
        -motionState.maxViewPitch,
        motionState.maxViewPitch
      );

      motionState.lastInteractionAt = now();
      globalState.lastInteractionAt = motionState.lastInteractionAt;

      safeRedraw(motionState, true);
      event.preventDefault?.();
    };

    const onUp = (event) => {
      motionState.dragging = false;
      canvas.style.cursor = "grab";
      canvas.releasePointerCapture?.(event.pointerId);
      motionState.lastInteractionAt = now();
      globalState.lastInteractionAt = motionState.lastInteractionAt;

      safeRedraw(motionState, true);
      event.preventDefault?.();
    };

    const onWheel = (event) => {
      const delta = Math.sign(Number(event.deltaY || 0));

      motionState.viewPitch = clamp(
        motionState.viewPitch + delta * motionState.dragPitchScale * 8,
        -motionState.maxViewPitch,
        motionState.maxViewPitch
      );

      motionState.lastInteractionAt = now();
      globalState.lastInteractionAt = motionState.lastInteractionAt;

      safeRedraw(motionState, true);
      event.preventDefault?.();
    };

    canvas.addEventListener("pointerdown", onDown, { passive: false });
    canvas.addEventListener("pointermove", onMove, { passive: false });
    canvas.addEventListener("pointerup", onUp, { passive: false });
    canvas.addEventListener("pointercancel", onUp, { passive: false });
    canvas.addEventListener("lostpointercapture", () => {
      motionState.dragging = false;
      canvas.style.cursor = "grab";
    });

    canvas.addEventListener("wheel", onWheel, { passive: false });

    motionState.unbind = () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("wheel", onWheel);
      motionState.pointerBound = false;
    };
  }

  function createMotionState(canvas, redraw, options = {}) {
    const existing = canvas ? registry.get(canvas) : null;

    if (existing) {
      existing.redraw = typeof redraw === "function" ? redraw : existing.redraw;
      return existing;
    }

    const motionState = {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      route: ROUTE,

      canvas: canvas || null,
      redraw: typeof redraw === "function" ? redraw : null,

      axisTiltDegrees: Number(options.axisTiltDegrees ?? DEFAULTS.axisTiltDegrees),
      autoRotationEnabled: options.autoRotationEnabled ?? DEFAULTS.autoRotationEnabled,
      autoRotationStep: Number(options.autoRotationStep ?? DEFAULTS.autoRotationStep),
      autoRotationFrameMs: Number(options.autoRotationFrameMs ?? DEFAULTS.autoRotationFrameMs),
      dragRotationScale: Number(options.dragRotationScale ?? DEFAULTS.dragRotationScale),
      dragPitchScale: Number(options.dragPitchScale ?? DEFAULTS.dragPitchScale),
      maxViewPitch: Number(options.maxViewPitch ?? DEFAULTS.maxViewPitch),
      redrawThrottleMs: Number(options.redrawThrottleMs ?? DEFAULTS.redrawThrottleMs),

      rotationLon: Number(options.initialRotationLon ?? DEFAULTS.initialRotationLon),
      viewPitch: Number(options.initialViewPitch ?? DEFAULTS.initialViewPitch),

      dragging: false,
      paused: false,
      pointerBound: false,
      autoLoopActive: false,
      animationFrame: 0,

      lastPointerX: 0,
      lastPointerY: 0,
      lastRedrawAt: 0,
      lastAutoFrameAt: 0,
      lastInteractionAt: null,
      lastError: null,
      pendingRedraw: false,

      createdAt: now(),

      projectViewToWorld(viewNormal) {
        return projectViewToWorld(viewNormal, motionState);
      },

      projectWorldToView(worldNormal) {
        return projectWorldToView(worldNormal, motionState);
      },

      redrawNow() {
        safeRedraw(motionState, true);
      },

      pause() {
        motionState.paused = true;
      },

      resume() {
        motionState.paused = false;
        safeRedraw(motionState, true);
      },

      stop() {
        stopAutoRotation(motionState);
        if (typeof motionState.unbind === "function") {
          motionState.unbind();
        }
      },

      getStatus() {
        return getMotionStatus(motionState);
      }
    };

    if (canvas) {
      canvas.dataset.audraliaMotionEngine = CONTRACT;
      canvas.dataset.audraliaAxisTiltDegrees = String(motionState.axisTiltDegrees);
      canvas.dataset.audraliaFingerDrag = "true";
      canvas.dataset.audraliaAutoRotation = motionState.autoRotationEnabled ? "true" : "false";
      canvas.style.cursor = "grab";

      registry.set(canvas, motionState);
      bindPointerEvents(canvas, motionState);
    }

    globalState.createdCount += 1;
    globalState.activeCount += 1;
    globalState.lastCreatedAt = motionState.createdAt;

    startAutoRotation(motionState);
    safeRedraw(motionState, true);

    return motionState;
  }

  function getMotionStatus(motionState = null) {
    const status = Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      route: ROUTE,
      createdCount: globalState.createdCount,
      activeCount: globalState.activeCount,
      lastCreatedAt: globalState.lastCreatedAt,
      lastInteractionAt: globalState.lastInteractionAt,
      axisTiltDegrees: Number(motionState?.axisTiltDegrees ?? DEFAULTS.axisTiltDegrees),
      rotationLon: Number(motionState?.rotationLon ?? 0),
      viewPitch: Number(motionState?.viewPitch ?? 0),
      dragging: Boolean(motionState?.dragging),
      paused: Boolean(motionState?.paused),
      autoRotationEnabled: Boolean(motionState?.autoRotationEnabled ?? DEFAULTS.autoRotationEnabled),
      fingerDrag: true,
      earthLikeAxis: true,
      redrawTriggers: true,
      lastError: motionState?.lastError || null,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });

    globalState.lastStatus = status;

    return status;
  }

  const AUDRALIA_MOTION_ENGINE = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    route: ROUTE,
    defaults: DEFAULTS,
    createMotionState,
    projectViewToWorld,
    projectWorldToView,
    startAutoRotation,
    stopAutoRotation,
    getMotionStatus,
    getStatus: getMotionStatus
  });

  const global = win();

  global.AUDRALIA_MOTION_ENGINE = AUDRALIA_MOTION_ENGINE;
  global.AudraliaMotionEngine = AUDRALIA_MOTION_ENGINE;
  global.audraliaMotionEngine = AUDRALIA_MOTION_ENGINE;
})();

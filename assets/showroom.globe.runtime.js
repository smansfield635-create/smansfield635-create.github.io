// /assets/showroom.globe.runtime.js
// TNT FULL-FILE REPLACEMENT
// SHOWROOM_GLOBE_FIBONACCI_RUNTIME_GLIDE_TNT_v1
// Owns: Fibonacci-paced drag, glide, inertia, damping, auto-spin, frame pacing.
// Does not own: planet material, geography, water, mountains, private engines.

export const GLOBE_RUNTIME_VERSION = "showroom-globe-fibonacci-runtime-glide-v1";

const FIB = Object.freeze([13, 21, 34, 55, 89, 144, 233]);

const DEFAULTS = Object.freeze({
  yaw: -0.74,
  pitch: -0.2,
  minPitch: -1.04,
  maxPitch: 0.74,
  reducedMotion: false,
  mobile: false,
  autoSpin: true,
  detail: "stable",
  glide: "soft"
});

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function nowMs() {
  return performance.now();
}

function getFrameInterval({ mobile, detail, dragging, settling, booting }) {
  if (booting) return FIB[1];
  if (dragging) return mobile ? FIB[1] : FIB[0];
  if (settling) return mobile ? FIB[2] : FIB[1];
  if (detail === "high") return mobile ? FIB[4] : FIB[2];
  return mobile ? FIB[5] : FIB[3];
}

function getGlideProfile(glide) {
  if (glide === "firm") {
    return {
      follow: 0.56,
      directFinger: 0.92,
      velocityRetainYaw: 0.82,
      velocityRetainPitch: 0.78,
      yawMultiplier: 0.0128,
      pitchMultiplier: 0.0094,
      velocityScaleYaw: 23,
      velocityScalePitch: 18
    };
  }

  return {
    follow: 0.42,
    directFinger: 0.76,
    velocityRetainYaw: 0.88,
    velocityRetainPitch: 0.84,
    yawMultiplier: 0.0104,
    pitchMultiplier: 0.0078,
    velocityScaleYaw: 20,
    velocityScalePitch: 15
  };
}

export function createGlobeRuntime(options = {}) {
  const config = { ...DEFAULTS, ...options };
  const bootUntil = nowMs() + FIB[6];

  const state = {
    yaw: config.yaw,
    pitch: config.pitch,
    targetYaw: config.yaw,
    targetPitch: config.pitch,
    velocityYaw: 0,
    velocityPitch: 0,

    autoSpin: config.autoSpin,
    detail: config.detail,
    glide: config.glide,

    dragging: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    lastPointerTime: 0,
    tapStartTime: 0,
    lastTapAt: 0,

    interacted: false,
    lastMotionAt: 0,
    lastRenderAt: 0,
    forceRender: true
  };

  function setConfig(next = {}) {
    if (typeof next.autoSpin === "boolean") state.autoSpin = next.autoSpin;
    if (next.detail === "stable" || next.detail === "high") state.detail = next.detail;
    if (next.glide === "soft" || next.glide === "firm") state.glide = next.glide;
    state.forceRender = true;
  }

  function reset() {
    state.targetYaw = config.yaw;
    state.targetPitch = config.pitch;
    state.yaw = config.yaw;
    state.pitch = config.pitch;
    state.velocityYaw = 0;
    state.velocityPitch = 0;
    state.interacted = false;
    state.lastMotionAt = nowMs();
    state.forceRender = true;
  }

  function markMotion() {
    state.lastMotionAt = nowMs();
    state.forceRender = true;
  }

  function isBooting(time = nowMs()) {
    return time < bootUntil;
  }

  function isSettling(time = nowMs()) {
    return time - state.lastMotionAt < FIB[5] * 7 ||
      Math.abs(state.velocityYaw) > 0.00006 ||
      Math.abs(state.velocityPitch) > 0.00006;
  }

  function getQuality(time = nowMs()) {
    if (isBooting(time)) return "motion";
    if (state.dragging) return "motion";
    if (isSettling(time)) return "settling";
    return "settled";
  }

  function update(time = nowMs()) {
    const profile = getGlideProfile(state.glide);

    if (!state.dragging) {
      if (state.autoSpin && !config.reducedMotion) {
        state.targetYaw += state.detail === "high" ? 0.00055 : 0.00034;
      }

      state.targetYaw += state.velocityYaw;
      state.targetPitch = clamp(state.targetPitch + state.velocityPitch, config.minPitch, config.maxPitch);

      state.velocityYaw *= profile.velocityRetainYaw;
      state.velocityPitch *= profile.velocityRetainPitch;

      if (Math.abs(state.velocityYaw) < 0.00004) state.velocityYaw = 0;
      if (Math.abs(state.velocityPitch) < 0.00004) state.velocityPitch = 0;
    }

    const priorYaw = state.yaw;
    const priorPitch = state.pitch;

    state.yaw += (state.targetYaw - state.yaw) * profile.follow;
    state.pitch += (state.targetPitch - state.pitch) * profile.follow;
    state.pitch = clamp(state.pitch, config.minPitch, config.maxPitch);

    const moved =
      Math.abs(state.yaw - priorYaw) > 0.000012 ||
      Math.abs(state.pitch - priorPitch) > 0.000012;

    if (moved) state.lastMotionAt = time;

    return {
      yaw: state.yaw,
      pitch: state.pitch,
      quality: getQuality(time),
      detail: state.detail,
      glide: state.glide,
      dragging: state.dragging,
      settling: isSettling(time),
      booting: isBooting(time),
      moved
    };
  }

  function shouldRender(time = nowMs()) {
    if (state.forceRender) {
      state.forceRender = false;
      state.lastRenderAt = time;
      return true;
    }

    const interval = getFrameInterval({
      mobile: config.mobile,
      detail: state.detail,
      dragging: state.dragging,
      settling: isSettling(time),
      booting: isBooting(time)
    });

    if (time - state.lastRenderAt >= interval) {
      state.lastRenderAt = time;
      return true;
    }

    return false;
  }

  function getState() {
    const time = nowMs();

    return {
      yaw: state.yaw,
      pitch: state.pitch,
      targetYaw: state.targetYaw,
      targetPitch: state.targetPitch,
      autoSpin: state.autoSpin,
      detail: state.detail,
      glide: state.glide,
      dragging: state.dragging,
      settling: isSettling(time),
      booting: isBooting(time),
      quality: getQuality(time),
      fibonacciPacing: true
    };
  }

  function bindCanvas(canvas) {
    if (!canvas) return;

    canvas.style.touchAction = "none";

    canvas.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });

    canvas.addEventListener("pointerdown", (event) => {
      state.dragging = true;
      state.pointerId = event.pointerId;
      state.startX = event.clientX;
      state.startY = event.clientY;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      state.lastPointerTime = nowMs();
      state.tapStartTime = nowMs();
      state.velocityYaw = 0;
      state.velocityPitch = 0;
      state.interacted = true;
      state.forceRender = true;

      markMotion();
      canvas.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    }, { passive: false });

    canvas.addEventListener("pointermove", (event) => {
      if (!state.dragging || event.pointerId !== state.pointerId) return;

      const profile = getGlideProfile(state.glide);
      const time = nowMs();
      const dt = Math.max(FIB[0], time - state.lastPointerTime);
      const dx = event.clientX - state.lastX;
      const dy = event.clientY - state.lastY;

      const yawDelta = dx * profile.yawMultiplier;
      const pitchDelta = dy * profile.pitchMultiplier;

      state.targetYaw += yawDelta;
      state.targetPitch = clamp(state.targetPitch + pitchDelta, config.minPitch, config.maxPitch);

      state.yaw += yawDelta * profile.directFinger;
      state.pitch = clamp(state.pitch + pitchDelta * profile.directFinger, config.minPitch, config.maxPitch);

      state.velocityYaw = clamp((yawDelta / dt) * profile.velocityScaleYaw, -0.052, 0.052);
      state.velocityPitch = clamp((pitchDelta / dt) * profile.velocityScalePitch, -0.036, 0.036);

      state.lastX = event.clientX;
      state.lastY = event.clientY;
      state.lastPointerTime = time;

      markMotion();
      event.preventDefault();
    }, { passive: false });

    canvas.addEventListener("pointerup", (event) => {
      if (event.pointerId !== state.pointerId) return;

      const time = nowMs();
      const travel = Math.hypot(event.clientX - state.startX, event.clientY - state.startY);
      const tapDuration = time - state.tapStartTime;
      const isTap = travel < 10 && tapDuration < 260;
      const isDoubleTap = isTap && time - state.lastTapAt < 340;

      if (isDoubleTap) {
        reset();
        state.lastTapAt = 0;
      } else if (isTap) {
        state.lastTapAt = time;
      }

      state.dragging = false;
      state.pointerId = null;
      markMotion();

      canvas.releasePointerCapture?.(event.pointerId);
      event.preventDefault();
    }, { passive: false });

    canvas.addEventListener("pointercancel", (event) => {
      state.dragging = false;
      state.pointerId = null;
      markMotion();
      canvas.releasePointerCapture?.(event.pointerId);
      event.preventDefault();
    }, { passive: false });

    canvas.addEventListener("keydown", (event) => {
      const step = event.shiftKey ? 0.16 : 0.075;

      if (event.key === "ArrowLeft") {
        state.targetYaw -= step;
        state.yaw -= step * 0.7;
        state.interacted = true;
        markMotion();
        event.preventDefault();
      } else if (event.key === "ArrowRight") {
        state.targetYaw += step;
        state.yaw += step * 0.7;
        state.interacted = true;
        markMotion();
        event.preventDefault();
      } else if (event.key === "ArrowUp") {
        state.targetPitch = clamp(state.targetPitch + step, config.minPitch, config.maxPitch);
        state.pitch = clamp(state.pitch + step * 0.7, config.minPitch, config.maxPitch);
        state.interacted = true;
        markMotion();
        event.preventDefault();
      } else if (event.key === "ArrowDown") {
        state.targetPitch = clamp(state.targetPitch - step, config.minPitch, config.maxPitch);
        state.pitch = clamp(state.pitch - step * 0.7, config.minPitch, config.maxPitch);
        state.interacted = true;
        markMotion();
        event.preventDefault();
      } else if (event.key === "Home" || event.key === "0") {
        reset();
        event.preventDefault();
      }
    });
  }

  return {
    version: GLOBE_RUNTIME_VERSION,
    fibonacci: FIB,
    bindCanvas,
    update,
    shouldRender,
    setConfig,
    reset,
    getState,
    forceRender() {
      state.forceRender = true;
    }
  };
}

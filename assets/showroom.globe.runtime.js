// /assets/showroom.globe.runtime.js
// TNT NEW FILE
// SHOWROOM_GLOBE_RUNTIME_GLIDE_CONTROL_TNT_v1
// Owns: drag, glide, inertia, damping, auto-spin, frame pacing, motion/settled state.
// Does not own: planet material, geography, water, mountains, private engines.

export const GLOBE_RUNTIME_VERSION = "showroom-globe-runtime-glide-control-v1";

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

function getFrameInterval({ mobile, detail, dragging, settling }) {
  if (detail === "high") {
    if (dragging || settling) return mobile ? 42 : 33;
    return mobile ? 72 : 58;
  }

  if (dragging || settling) return mobile ? 58 : 48;
  return mobile ? 110 : 86;
}

function getGlideProfile(glide) {
  if (glide === "firm") {
    return {
      follow: 0.30,
      velocityRetainYaw: 0.88,
      velocityRetainPitch: 0.84,
      yawMultiplier: 0.0094,
      pitchMultiplier: 0.0072,
      velocityScaleYaw: 19,
      velocityScalePitch: 15
    };
  }

  return {
    follow: 0.20,
    velocityRetainYaw: 0.935,
    velocityRetainPitch: 0.91,
    yawMultiplier: 0.0077,
    pitchMultiplier: 0.0059,
    velocityScaleYaw: 16,
    velocityScalePitch: 12
  };
}

export function createGlobeRuntime(options = {}) {
  const config = {
    ...DEFAULTS,
    ...options
  };

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

  function isSettling(time = nowMs()) {
    return time - state.lastMotionAt < 900 || Math.abs(state.velocityYaw) > 0.00008 || Math.abs(state.velocityPitch) > 0.00008;
  }

  function getQuality(time = nowMs()) {
    if (state.dragging) return "motion";
    if (isSettling(time)) return "settling";
    return "settled";
  }

  function update(time = nowMs()) {
    const profile = getGlideProfile(state.glide);

    if (!state.dragging) {
      if (state.autoSpin && !config.reducedMotion) {
        state.targetYaw += state.detail === "high" ? 0.00062 : 0.00048;
      }

      state.targetYaw += state.velocityYaw;
      state.targetPitch = clamp(
        state.targetPitch + state.velocityPitch,
        config.minPitch,
        config.maxPitch
      );

      state.velocityYaw *= profile.velocityRetainYaw;
      state.velocityPitch *= profile.velocityRetainPitch;

      if (Math.abs(state.velocityYaw) < 0.000055) state.velocityYaw = 0;
      if (Math.abs(state.velocityPitch) < 0.000055) state.velocityPitch = 0;
    }

    const priorYaw = state.yaw;
    const priorPitch = state.pitch;

    state.yaw += (state.targetYaw - state.yaw) * profile.follow;
    state.pitch += (state.targetPitch - state.pitch) * profile.follow;
    state.pitch = clamp(state.pitch, config.minPitch, config.maxPitch);

    const moved = Math.abs(state.yaw - priorYaw) > 0.00002 || Math.abs(state.pitch - priorPitch) > 0.00002;
    if (moved) state.lastMotionAt = time;

    return {
      yaw: state.yaw,
      pitch: state.pitch,
      quality: getQuality(time),
      dragging: state.dragging,
      settling: isSettling(time),
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
      settling: isSettling(time)
    });

    if (time - state.lastRenderAt >= interval) {
      state.lastRenderAt = time;
      return true;
    }

    return false;
  }

  function getState() {
    return {
      yaw: state.yaw,
      pitch: state.pitch,
      targetYaw: state.targetYaw,
      targetPitch: state.targetPitch,
      autoSpin: state.autoSpin,
      detail: state.detail,
      glide: state.glide,
      dragging: state.dragging,
      settling: isSettling(),
      quality: getQuality()
    };
  }

  function bindCanvas(canvas) {
    if (!canvas) return;

    canvas.style.touchAction = "none";

    canvas.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });

    canvas.addEventListener("pointerdown", (event) => {
      const profile = getGlideProfile(state.glide);

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

      void profile;
      markMotion();
      canvas.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    }, { passive: false });

    canvas.addEventListener("pointermove", (event) => {
      if (!state.dragging || event.pointerId !== state.pointerId) return;

      const profile = getGlideProfile(state.glide);
      const time = nowMs();
      const dt = Math.max(12, time - state.lastPointerTime);
      const dx = event.clientX - state.lastX;
      const dy = event.clientY - state.lastY;

      const yawDelta = dx * profile.yawMultiplier;
      const pitchDelta = dy * profile.pitchMultiplier;

      state.targetYaw += yawDelta;
      state.targetPitch = clamp(
        state.targetPitch + pitchDelta,
        config.minPitch,
        config.maxPitch
      );

      state.velocityYaw = clamp((yawDelta / dt) * profile.velocityScaleYaw, -0.046, 0.046);
      state.velocityPitch = clamp((pitchDelta / dt) * profile.velocityScalePitch, -0.032, 0.032);

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
        state.interacted = true;
        markMotion();
        event.preventDefault();
      } else if (event.key === "ArrowRight") {
        state.targetYaw += step;
        state.interacted = true;
        markMotion();
        event.preventDefault();
      } else if (event.key === "ArrowUp") {
        state.targetPitch = clamp(state.targetPitch + step, config.minPitch, config.maxPitch);
        state.interacted = true;
        markMotion();
        event.preventDefault();
      } else if (event.key === "ArrowDown") {
        state.targetPitch = clamp(state.targetPitch - step, config.minPitch, config.maxPitch);
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

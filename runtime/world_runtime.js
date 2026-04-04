import { createWorldKernel } from "../world/world_kernel.js";

export function createWorldRuntime() {
  const kernel = createWorldKernel({
    seed: 25645161,
    regionRadius: 100,
    waterRadius: 136
  });

  const state = {
    startedAtMs: 0,
    viewportWidth: 1280,
    viewportHeight: 720,
    driftAngle: 0,
    camera: {
      centerX: 0,
      centerY: 0,
      scale: 2.55,
      pitch: 0.72,
      yaw: 0
    }
  };

  function setViewport(width, height) {
    state.viewportWidth = width;
    state.viewportHeight = height;
    const base = Math.min(width, height);
    state.camera.scale = Math.max(1.7, base / 320);
    state.camera.pitch = 0.72;
  }

  function step(nowMs) {
    if (state.startedAtMs === 0) {
      state.startedAtMs = nowMs;
    }

    const elapsed = (nowMs - state.startedAtMs) / 1000;
    state.driftAngle = elapsed * 0.035;
    state.camera.yaw = state.driftAngle;
    state.camera.centerX = Math.cos(elapsed * 0.22) * 1.4;
    state.camera.centerY = Math.sin(elapsed * 0.16) * 1.1;

    return {
      world: kernel.getWorld(),
      camera: { ...state.camera }
    };
  }

  function getWorld() {
    return kernel.getWorld();
  }

  return {
    setViewport,
    step,
    getWorld
  };
}

(function () {
  "use strict";

  const PRESETS = Object.freeze({
    fixed_harbor: {
      horizon: 0.66,
      cubeScale: 0.118,
      cubeYOffset: 0.33,
      pathAlpha: 1.0,
      labelAlpha: 0.78,
      perspectiveBias: 0,
    },
    travel_projection: {
      horizon: 0.62,
      cubeScale: 0.1,
      cubeYOffset: 0.29,
      pathAlpha: 1.0,
      labelAlpha: 0.72,
      perspectiveBias: 80,
    },
    aerial_one: {
      horizon: 0.57,
      cubeScale: 0.092,
      cubeYOffset: 0.23,
      pathAlpha: 0.9,
      labelAlpha: 0.62,
      perspectiveBias: 120,
    },
    aerial_two: {
      horizon: 0.52,
      cubeScale: 0.084,
      cubeYOffset: 0.18,
      pathAlpha: 0.78,
      labelAlpha: 0.54,
      perspectiveBias: 160,
    },
  });

  const CAMERA_ORDER = Object.freeze([
    "fixed_harbor",
    "travel_projection",
    "aerial_one",
    "aerial_two",
  ]);

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function isValidMode(mode) {
    return Object.prototype.hasOwnProperty.call(PRESETS, mode);
  }

  function createState(initialMode) {
    const mode = isValidMode(initialMode) ? initialMode : "fixed_harbor";
    return {
      mode,
      requested: mode,
      transition: 0,
    };
  }

  function blendTo(state, target) {
    if (!state || !isValidMode(target)) return state;
    state.requested = target;
    return state;
  }

  function cycle(state) {
    if (!state) return state;
    const index = CAMERA_ORDER.indexOf(state.requested);
    const next = CAMERA_ORDER[(index + 1) % CAMERA_ORDER.length];
    state.requested = next;
    return state;
  }

  function update(state, step) {
    if (!state) return state;
    const dt = typeof step === "number" && isFinite(step) ? step : 0.06;

    if (state.mode !== state.requested) {
      state.transition = clamp(state.transition + dt, 0, 1);
      if (state.transition >= 1) {
        state.mode = state.requested;
        state.transition = 0;
      }
    } else {
      state.transition = 0;
    }

    return state;
  }

  function getPreset(mode) {
    return PRESETS[mode] || PRESETS.fixed_harbor;
  }

  function getBlendedPreset(state) {
    if (!state) return PRESETS.fixed_harbor;

    const current = getPreset(state.mode);
    const target = getPreset(state.requested);
    const t = state.transition || 0;

    if (!target || state.mode === state.requested) {
      return current;
    }

    return {
      horizon: lerp(current.horizon, target.horizon, t),
      cubeScale: lerp(current.cubeScale, target.cubeScale, t),
      cubeYOffset: lerp(current.cubeYOffset, target.cubeYOffset, t),
      pathAlpha: lerp(current.pathAlpha, target.pathAlpha, t),
      labelAlpha: lerp(current.labelAlpha, target.labelAlpha, t),
      perspectiveBias: lerp(current.perspectiveBias, target.perspectiveBias, t),
    };
  }

  window.OPENWORLD_CAMERA = Object.freeze({
    version: "OPENWORLD_CAMERA_v1",
    PRESETS,
    CAMERA_ORDER,
    createState,
    blendTo,
    cycle,
    update,
    getPreset,
    getBlendedPreset,
  });
})();

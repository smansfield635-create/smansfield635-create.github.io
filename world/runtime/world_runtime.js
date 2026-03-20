// ===== FORCE CONTINUOUS RUNTIME EMISSION (FIX) =====

const RUNTIME_STORAGE_KEY = "cte_runtime_v3";

function emitRuntimeReceiptContinuous(state, extra = {}) {
  const payload = {
    page: "/index.html",
    phase: state.runtimeReady ? "RUNNING" : "BOOT",
    mode: state.currentMode,
    timestamp: new Date().toISOString(),

    fps: state._lastFps || 0,
    dtMs: state._lastDt || 0,

    control: {
      motionState: typeof state.control?.getMotionState === "function"
        ? state.control.getMotionState()
        : {},
      orbitalState: typeof state.control?.getOrbitalState === "function"
        ? state.control.getOrbitalState()
        : {}
    },

    instrument: state._lastInstrument || {},

    renderAudit: state.lastRenderReceipt?.audit || {},

    emissionReceipt: state.lastEmissionReceipt || {},
    placementReceipt: state.lastPlacementReceipt || {},

    verification: {
      pass: state.runtimeReady === true
    },

    failure: {
      message: state.runtimeErrorMessage || ""
    },

    ...extra
  };

  try {
    localStorage.setItem(RUNTIME_STORAGE_KEY, JSON.stringify(payload));
  } catch {}
}

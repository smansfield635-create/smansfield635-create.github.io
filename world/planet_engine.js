// /world/planet_engine.js
// MODE: CONTRACT EXECUTION
// STATUS: TRUE_ESM_ENGINE_FACTORY | SINGLE-FILE_RECONCILIATION | NON-DRIFT

const VERSION = "PLANET_ENGINE_BASELINE_v1";
const ENGINE_ID = "PLANET_ENGINE";

const STATUS = Object.freeze({
  UNINITIALIZED: "UNINITIALIZED",
  BOOTSTRAPPING: "BOOTSTRAPPING",
  READY: "READY",
  CHECKPOINT_1_REACHED: "CHECKPOINT_1_REACHED",
  GAUGES_DEFERRED: "GAUGES_DEFERRED",
  ERROR: "ERROR"
});

function assert(condition, message) {
  if (!condition) {
    throw new Error(`[PLANET_ENGINE] ${message}`);
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function freezeCopy(value) {
  return Object.freeze(clone(value));
}

function nowIso() {
  return new Date().toISOString();
}

function getKernel() {
  const kernel = globalThis.LiveRuntimeKernel;
  assert(kernel, "LiveRuntimeKernel is required before planet_engine boots");
  return kernel;
}

function createInitialState() {
  return {
    version: VERSION,
    engineId: ENGINE_ID,
    status: STATUS.UNINITIALIZED,
    baselineEstablished: false,
    kernelAttached: false,
    checkpoint1Reached: false,
    gaugesDeferred: true,
    liveTargets: {
      kernelFile: "/runtime/live_runtime_kernel.js",
      planetEngineFile: "/world/planet_engine.js",
      liveGaugesTarget: "/runtime/live_gauges_surface.js",
      runtimeReceiptTarget: "/world/planet_engine.js"
    },
    routeMap: {
      kernel: "/runtime/live_runtime_kernel.js",
      engine: "/world/planet_engine.js",
      gauges: "/runtime/live_gauges_surface.js"
    },
    parentStack: {
      status: "READY_FOR_LATER_BIND",
      filesCount: 0
    },
    runtimeBridge: {
      status: "READY"
    },
    runtimeState: {
      status: "READY"
    },
    lastError: null,
    events: [],
    lastUpdatedAt: null
  };
}

export function createPlanetEngine() {
  const subscribers = new Set();
  let state = createInitialState();

  function emit(type, payload) {
    state.events.push({
      type,
      at: nowIso(),
      payload: clone(payload || {})
    });
    state.lastUpdatedAt = nowIso();

    const snapshot = api.getState();
    subscribers.forEach((listener) => {
      try {
        listener(snapshot, type);
      } catch (_) {}
    });
  }

  function setStatus(nextStatus) {
    state.status = nextStatus;
    state.lastUpdatedAt = nowIso();
  }

  function withGuard(fn) {
    try {
      return fn();
    } catch (error) {
      state.lastError = error && error.message ? error.message : String(error);
      setStatus(STATUS.ERROR);
      emit("PLANET_ENGINE_ERROR", { message: state.lastError });
      throw error;
    }
  }

  const api = {
    version: VERSION,

    getState() {
      return freezeCopy(state);
    },

    subscribe(listener) {
      assert(typeof listener === "function", "subscribe requires a function");
      subscribers.add(listener);
      return function unsubscribe() {
        subscribers.delete(listener);
      };
    },

    establishBaseline(config) {
      return withGuard(function () {
        const input = config || {};
        const kernel = getKernel();

        setStatus(STATUS.BOOTSTRAPPING);

        state.liveTargets.kernelFile = input.kernelFile || state.liveTargets.kernelFile;
        state.liveTargets.planetEngineFile =
          input.planetEngineFile || state.liveTargets.planetEngineFile;
        state.liveTargets.liveGaugesTarget =
          input.liveGaugesTarget || state.liveTargets.liveGaugesTarget;
        state.liveTargets.runtimeReceiptTarget =
          input.runtimeReceiptTarget || state.liveTargets.runtimeReceiptTarget;

        state.routeMap = {
          kernel: state.liveTargets.kernelFile,
          engine: state.liveTargets.planetEngineFile,
          gauges: state.liveTargets.liveGaugesTarget
        };

        const kernelState = kernel.getState ? kernel.getState() : null;
        const kernelAlreadyInitialized =
          kernelState && kernelState.kernel && kernelState.kernel.initialized;

        if (!kernelAlreadyInitialized) {
          kernel.initializeKernel({
            kernelId: "LIVE_RUNTIME_KERNEL",
            scope: "planet-engine-line"
          });
        }

        kernel.bindTargets({
          liveGaugesTarget: state.liveTargets.liveGaugesTarget,
          runtimeReceiptTarget: state.liveTargets.runtimeReceiptTarget,
          routeMap: state.routeMap
        });

        kernel.attachRuntime({
          receiptTarget: state.liveTargets.runtimeReceiptTarget,
          runtimeReceiptTarget: state.liveTargets.runtimeReceiptTarget,
          routeMap: state.routeMap,
          bridgeStatus: "READY",
          liveState: "READY"
        });

        kernel.setParentStackStatus(
          input.parentStackStatus || "READY_FOR_LATER_BIND",
          typeof input.parentFilesCount === "number" ? input.parentFilesCount : 0
        );

        kernel.setRuntimeBridgeStatus(input.runtimeBridgeStatus || "READY");
        kernel.setLiveRuntimeState(input.runtimeState || "READY");

        kernel.confirmCheckpoint1({
          source: ENGINE_ID,
          reason: "PLANET_ENGINE_BASELINE_ESTABLISHED"
        });

        state.kernelAttached = true;
        state.checkpoint1Reached = true;
        state.baselineEstablished = true;
        state.gaugesDeferred = true;
        state.parentStack.status = input.parentStackStatus || "READY_FOR_LATER_BIND";
        state.parentStack.filesCount =
          typeof input.parentFilesCount === "number" ? input.parentFilesCount : 0;
        state.runtimeBridge.status = input.runtimeBridgeStatus || "READY";
        state.runtimeState.status = input.runtimeState || "READY";

        setStatus(STATUS.CHECKPOINT_1_REACHED);

        emit("PLANET_ENGINE_BASELINE_ESTABLISHED", {
          checkpoint1: true,
          gaugesDeferred: true,
          routeMap: state.routeMap
        });

        emit("GAUGES_DEFERRED_UNTIL_EXPLICIT_ACTIVATION", {
          liveGaugesTarget: state.liveTargets.liveGaugesTarget
        });

        setStatus(STATUS.GAUGES_DEFERRED);

        return api.getState();
      });
    },

    activateGauges(config) {
      return withGuard(function () {
        const input = config || {};
        const kernel = getKernel();

        assert(state.baselineEstablished, "establish baseline before activating gauges");
        assert(state.checkpoint1Reached, "checkpoint 1 must be reached before gauges activate");
        assert(
          typeof kernel.canActivateGauges === "function" && kernel.canActivateGauges(),
          "kernel does not allow gauge activation yet"
        );

        kernel.activateGauges({
          gaugesTarget: input.gaugesTarget || state.liveTargets.liveGaugesTarget
        });

        state.gaugesDeferred = false;
        state.liveTargets.liveGaugesTarget =
          input.gaugesTarget || state.liveTargets.liveGaugesTarget;

        setStatus(STATUS.READY);

        emit("GAUGES_ACTIVATED_FROM_PLANET_ENGINE", {
          gaugesTarget: state.liveTargets.liveGaugesTarget
        });

        return api.getState();
      });
    },

    getCheckpointRead() {
      return freezeCopy({
        version: VERSION,
        engineId: ENGINE_ID,
        baselineEstablished: state.baselineEstablished,
        kernelAttached: state.kernelAttached,
        checkpoint1Reached: state.checkpoint1Reached,
        gaugesDeferred: state.gaugesDeferred,
        status: state.status
      });
    },

    getRuntimeRead() {
      const kernel = getKernel();
      const kernelState = kernel.getState ? kernel.getState() : {};
      const gaugeSnapshot =
        typeof kernel.getGaugeSnapshot === "function" ? kernel.getGaugeSnapshot() : null;

      return freezeCopy({
        planetEngine: api.getState(),
        kernel: kernelState,
        gauges: gaugeSnapshot
      });
    },

    reset() {
      const kernel = getKernel();
      if (typeof kernel.resetForNewRun === "function") {
        kernel.resetForNewRun();
      }
      state = createInitialState();
      emit("PLANET_ENGINE_RESET", {});
      return api.getState();
    }
  };

  return Object.freeze(api);
}

const DEFAULT_PLANET_ENGINE = createPlanetEngine();

export default DEFAULT_PLANET_ENGINE;

(function (global) {
  "use strict";

  const VERSION = "LIVE_RUNTIME_KERNEL_v1";
  const CHECKPOINTS = Object.freeze({
    CP0: "KERNEL_READY",
    CP1: "CHECKPOINT_1_REACHED",
  });

  const PHASES = Object.freeze({
    UNINITIALIZED: "UNINITIALIZED",
    KERNEL_READY: "KERNEL_READY",
    RUNTIME_ATTACHED: "RUNTIME_ATTACHED",
    CHECKPOINT_1_REACHED: "CHECKPOINT_1_REACHED",
    GAUGES_ACTIVE: "GAUGES_ACTIVE",
  });

  const STATUS = Object.freeze({
    UNKNOWN: "UNKNOWN",
    INACTIVE: "INACTIVE",
    ACTIVE: "ACTIVE",
    BLOCKED: "BLOCKED",
    READY: "READY",
  });

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function freezeCopy(value) {
    return Object.freeze(clone(value));
  }

  function assert(condition, message) {
    if (!condition) {
      throw new Error("[LIVE_RUNTIME_KERNEL] " + message);
    }
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function createInitialState() {
    return {
      version: VERSION,
      lineClass: "KERNEL_FIRST_RUNTIME_LINE",
      legacyBaselineRequired: false,
      gaugesAreDownstreamOnly: true,
      phase: PHASES.UNINITIALIZED,
      checkpoints: {
        [CHECKPOINTS.CP0]: false,
        [CHECKPOINTS.CP1]: false,
      },
      kernel: {
        initialized: false,
        kernelId: "LIVE_RUNTIME_KERNEL",
        scope: "runtime-line",
        initializedAt: null,
      },
      runtime: {
        attached: false,
        attachedAt: null,
        receiptTarget: null,
        bridgeStatus: STATUS.INACTIVE,
        liveState: STATUS.INACTIVE,
      },
      parentStack: {
        status: STATUS.UNKNOWN,
        filesCount: 0,
      },
      gauges: {
        allowed: false,
        active: false,
        activatedAt: null,
        target: null,
      },
      targets: {
        liveGaugesTarget: null,
        runtimeReceiptTarget: null,
      },
      routeMap: {},
      notes: {
        currentRule: "KERNEL_FIRST_GAUGES_LATER",
        completion: "OPEN",
      },
      events: [],
      lastUpdatedAt: null,
    };
  }

  function createKernel() {
    let state = createInitialState();
    const subscribers = new Set();

    function emit(type, payload) {
      state.events.push({
        type,
        at: nowIso(),
        payload: clone(payload || {}),
      });
      state.lastUpdatedAt = nowIso();
      const snapshot = api.getState();
      subscribers.forEach((listener) => {
        try {
          listener(snapshot, type);
        } catch (_) {}
      });
    }

    function transitionPhase(nextPhase) {
      state.phase = nextPhase;
      state.lastUpdatedAt = nowIso();
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

      initializeKernel(config) {
        const input = config || {};
        assert(!state.kernel.initialized, "kernel already initialized");

        state.kernel.initialized = true;
        state.kernel.kernelId = input.kernelId || "LIVE_RUNTIME_KERNEL";
        state.kernel.scope = input.scope || "runtime-line";
        state.kernel.initializedAt = nowIso();
        state.checkpoints[CHECKPOINTS.CP0] = true;
        transitionPhase(PHASES.KERNEL_READY);

        emit("KERNEL_INITIALIZED", {
          kernelId: state.kernel.kernelId,
          scope: state.kernel.scope,
        });

        return api.getState();
      },

      attachRuntime(config) {
        const input = config || {};
        assert(state.kernel.initialized, "initialize kernel before attaching runtime");

        state.runtime.attached = true;
        state.runtime.attachedAt = nowIso();
        state.runtime.receiptTarget = input.receiptTarget || state.runtime.receiptTarget;
        state.runtime.bridgeStatus = input.bridgeStatus || STATUS.READY;
        state.runtime.liveState = input.liveState || STATUS.READY;

        if (input.runtimeReceiptTarget) {
          state.targets.runtimeReceiptTarget = input.runtimeReceiptTarget;
        }
        if (input.routeMap && typeof input.routeMap === "object") {
          state.routeMap = clone(input.routeMap);
        }

        transitionPhase(PHASES.RUNTIME_ATTACHED);

        emit("RUNTIME_ATTACHED", {
          runtimeReceiptTarget: state.targets.runtimeReceiptTarget,
          bridgeStatus: state.runtime.bridgeStatus,
        });

        return api.getState();
      },

      bindTargets(config) {
        const input = config || {};
        assert(state.kernel.initialized, "initialize kernel before binding targets");

        if (input.liveGaugesTarget) {
          state.targets.liveGaugesTarget = input.liveGaugesTarget;
        }
        if (input.runtimeReceiptTarget) {
          state.targets.runtimeReceiptTarget = input.runtimeReceiptTarget;
        }
        if (input.routeMap && typeof input.routeMap === "object") {
          state.routeMap = clone(input.routeMap);
        }

        emit("TARGETS_BOUND", {
          liveGaugesTarget: state.targets.liveGaugesTarget,
          runtimeReceiptTarget: state.targets.runtimeReceiptTarget,
        });

        return api.getState();
      },

      confirmCheckpoint1(details) {
        assert(state.kernel.initialized, "initialize kernel before checkpoint 1");
        assert(state.runtime.attached, "attach runtime before checkpoint 1");

        state.checkpoints[CHECKPOINTS.CP1] = true;
        state.gauges.allowed = true;
        transitionPhase(PHASES.CHECKPOINT_1_REACHED);

        emit("CHECKPOINT_1_CONFIRMED", details || {});
        return api.getState();
      },

      canActivateGauges() {
        return !!(
          state.kernel.initialized &&
          state.runtime.attached &&
          state.checkpoints[CHECKPOINTS.CP1] &&
          state.gauges.allowed
        );
      },

      activateGauges(config) {
        const input = config || {};
        assert(api.canActivateGauges(), "gauges may activate only after checkpoint 1");

        state.gauges.active = true;
        state.gauges.activatedAt = nowIso();
        state.gauges.target = input.gaugesTarget || state.targets.liveGaugesTarget || null;

        transitionPhase(PHASES.GAUGES_ACTIVE);

        emit("GAUGES_ACTIVATED", {
          gaugesTarget: state.gauges.target,
        });

        return api.getState();
      },

      setParentStackStatus(status, filesCount) {
        state.parentStack.status = status || state.parentStack.status;
        if (typeof filesCount === "number" && Number.isFinite(filesCount)) {
          state.parentStack.filesCount = filesCount;
        }

        emit("PARENT_STACK_UPDATED", {
          status: state.parentStack.status,
          filesCount: state.parentStack.filesCount,
        });

        return api.getState();
      },

      setRuntimeBridgeStatus(status) {
        state.runtime.bridgeStatus = status || state.runtime.bridgeStatus;

        emit("RUNTIME_BRIDGE_UPDATED", {
          bridgeStatus: state.runtime.bridgeStatus,
        });

        return api.getState();
      },

      setLiveRuntimeState(status) {
        state.runtime.liveState = status || state.runtime.liveState;

        emit("LIVE_RUNTIME_STATE_UPDATED", {
          liveState: state.runtime.liveState,
        });

        return api.getState();
      },

      getGaugeSnapshot() {
        return freezeCopy({
          visible: !!state.gauges.active,
          parentStackStatus: state.parentStack.status,
          parentFilesCount: state.parentStack.filesCount,
          runtimeBridgeStatus: state.runtime.bridgeStatus,
          liveRuntimeState: state.runtime.liveState,
          gaugesTarget: state.gauges.target,
          phase: state.phase,
        });
      },

      resetForNewRun() {
        state = createInitialState();
        emit("KERNEL_RESET", {});
        return api.getState();
      },
    };

    return Object.freeze(api);
  }

  const kernel = createKernel();

  global.LiveRuntimeKernel = kernel;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = kernel;
  }
})(typeof globalThis !== "undefined" ? globalThis : window);

Destination: /runtime/live_runtime_kernel.js

(() => {
  "use strict";

  const NOOP = () => {};
  const RETURN_FALSE = () => false;
  const clone = (value) => JSON.parse(JSON.stringify(value));

  if (typeof window !== "undefined" && typeof window.__COMPASS_BASELINE_RAF__ === "number") {
    cancelAnimationFrame(window.__COMPASS_BASELINE_RAF__);
    window.__COMPASS_BASELINE_RAF__ = null;
  }

  const state = {
    kernel: {
      initialized: false,
      kernelId: null,
      scope: null
    },
    active: false,
    authority: "COMPASS_BASELINE_KERNEL",
    targets: {
      liveGaugesTarget: null,
      runtimeReceiptTarget: null,
      routeMap: null
    },
    runtime: {
      receiptTarget: null,
      runtimeReceiptTarget: null,
      routeMap: null,
      bridgeStatus: "UNSET",
      liveState: "UNSET"
    },
    parentStack: {
      status: "UNSET",
      filesCount: 0
    },
    runtimeBridge: {
      status: "UNSET"
    },
    liveRuntimeState: {
      status: "UNSET"
    },
    checkpoint1: {
      reached: false,
      source: null,
      reason: null
    },
    gauges: {
      active: false,
      target: null
    }
  };

  function snapshot() {
    return clone(state);
  }

  function initializeKernel(config = {}) {
    state.kernel.initialized = true;
    state.kernel.kernelId = typeof config.kernelId === "string" ? config.kernelId : "LIVE_RUNTIME_KERNEL";
    state.kernel.scope = typeof config.scope === "string" ? config.scope : "DEFAULT_SCOPE";
    state.active = true;
  }

  function bindTargets(config = {}) {
    state.targets.liveGaugesTarget =
      typeof config.liveGaugesTarget === "string" ? config.liveGaugesTarget : state.targets.liveGaugesTarget;
    state.targets.runtimeReceiptTarget =
      typeof config.runtimeReceiptTarget === "string" ? config.runtimeReceiptTarget : state.targets.runtimeReceiptTarget;
    state.targets.routeMap = config.routeMap && typeof config.routeMap === "object" ? clone(config.routeMap) : state.targets.routeMap;
  }

  function attachRuntime(config = {}) {
    state.runtime.receiptTarget =
      typeof config.receiptTarget === "string" ? config.receiptTarget : state.runtime.receiptTarget;
    state.runtime.runtimeReceiptTarget =
      typeof config.runtimeReceiptTarget === "string"
        ? config.runtimeReceiptTarget
        : state.runtime.runtimeReceiptTarget;
    state.runtime.routeMap =
      config.routeMap && typeof config.routeMap === "object" ? clone(config.routeMap) : state.runtime.routeMap;
    state.runtime.bridgeStatus =
      typeof config.bridgeStatus === "string" ? config.bridgeStatus : state.runtime.bridgeStatus;
    state.runtime.liveState =
      typeof config.liveState === "string" ? config.liveState : state.runtime.liveState;
  }

  function setParentStackStatus(status = "UNSET", filesCount = 0) {
    state.parentStack.status = typeof status === "string" ? status : state.parentStack.status;
    state.parentStack.filesCount = Number.isFinite(filesCount) ? Math.trunc(filesCount) : state.parentStack.filesCount;
  }

  function setRuntimeBridgeStatus(status = "UNSET") {
    state.runtimeBridge.status = typeof status === "string" ? status : state.runtimeBridge.status;
  }

  function setLiveRuntimeState(status = "UNSET") {
    state.liveRuntimeState.status = typeof status === "string" ? status : state.liveRuntimeState.status;
  }

  function confirmCheckpoint1(config = {}) {
    state.checkpoint1.reached = true;
    state.checkpoint1.source = typeof config.source === "string" ? config.source : null;
    state.checkpoint1.reason = typeof config.reason === "string" ? config.reason : null;
  }

  function canActivateGauges() {
    return state.kernel.initialized === true && state.checkpoint1.reached === true;
  }

  function activateGauges(config = {}) {
    state.gauges.active = true;
    state.gauges.target =
      typeof config.gaugesTarget === "string" ? config.gaugesTarget : state.gauges.target;
  }

  function getGaugeSnapshot() {
    return clone(state.gauges);
  }

  function resetForNewRun() {
    state.kernel.initialized = false;
    state.kernel.kernelId = null;
    state.kernel.scope = null;
    state.active = false;
    state.targets.liveGaugesTarget = null;
    state.targets.runtimeReceiptTarget = null;
    state.targets.routeMap = null;
    state.runtime.receiptTarget = null;
    state.runtime.runtimeReceiptTarget = null;
    state.runtime.routeMap = null;
    state.runtime.bridgeStatus = "UNSET";
    state.runtime.liveState = "UNSET";
    state.parentStack.status = "UNSET";
    state.parentStack.filesCount = 0;
    state.runtimeBridge.status = "UNSET";
    state.liveRuntimeState.status = "UNSET";
    state.checkpoint1.reached = false;
    state.checkpoint1.source = null;
    state.checkpoint1.reason = null;
    state.gauges.active = false;
    state.gauges.target = null;
  }

  const liveRuntimeKernel = {
    __type: "LIVE_RUNTIME_KERNEL",
    __active: true,
    __authority: "COMPASS_BASELINE_KERNEL",

    init: NOOP,
    boot: NOOP,
    start: NOOP,
    stop: NOOP,
    destroy: NOOP,
    mount: NOOP,
    unmount: NOOP,
    render: NOOP,
    tick: NOOP,
    resize: NOOP,
    attach: NOOP,
    detach: NOOP,
    clear: NOOP,

    initializeKernel,
    bindTargets,
    attachRuntime,
    setParentStackStatus,
    setRuntimeBridgeStatus,
    setLiveRuntimeState,
    confirmCheckpoint1,
    canActivateGauges,
    activateGauges,
    getGaugeSnapshot,
    resetForNewRun,

    getKernel() {
      return {
        initialized: state.kernel.initialized,
        kernelId: state.kernel.kernelId,
        scope: state.kernel.scope
      };
    },

    getRuntime() {
      return clone(state.runtime);
    },

    getState() {
      return snapshot();
    },

    isActive() {
      return state.active === true;
    }
  };

  if (typeof window !== "undefined") {
    window.liveRuntimeKernel = liveRuntimeKernel;
    window.LiveRuntimeKernel = liveRuntimeKernel;
    window.__LIVE_RUNTIME_KERNEL_DISABLED__ = false;
  }
})();

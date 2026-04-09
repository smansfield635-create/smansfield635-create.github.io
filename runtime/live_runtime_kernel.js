(() => {
  "use strict";

  const clone = (value) => JSON.parse(JSON.stringify(value));

  function createInitialState() {
    return {
      kernel: {
        initialized: false,
        kernelId: null,
        scope: null
      },
      active: false,
      authority: "G1_EXTERNAL_RUNTIME_KERNEL",
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
      },
      sessions: {}
    };
  }

  const state = createInitialState();

  function snapshot() {
    return clone(state);
  }

  function initializeKernel(config = {}) {
    state.kernel.initialized = true;
    state.kernel.kernelId =
      typeof config.kernelId === "string" ? config.kernelId : "LIVE_RUNTIME_KERNEL_G1";
    state.kernel.scope =
      typeof config.scope === "string" ? config.scope : "EXTERNAL_EXPRESSION";
    state.active = true;
  }

  function bindTargets(config = {}) {
    state.targets.liveGaugesTarget =
      typeof config.liveGaugesTarget === "string"
        ? config.liveGaugesTarget
        : state.targets.liveGaugesTarget;

    state.targets.runtimeReceiptTarget =
      typeof config.runtimeReceiptTarget === "string"
        ? config.runtimeReceiptTarget
        : state.targets.runtimeReceiptTarget;

    state.targets.routeMap =
      config.routeMap && typeof config.routeMap === "object"
        ? clone(config.routeMap)
        : state.targets.routeMap;
  }

  function attachRuntime(config = {}) {
    state.runtime.receiptTarget =
      typeof config.receiptTarget === "string"
        ? config.receiptTarget
        : state.runtime.receiptTarget;

    state.runtime.runtimeReceiptTarget =
      typeof config.runtimeReceiptTarget === "string"
        ? config.runtimeReceiptTarget
        : state.runtime.runtimeReceiptTarget;

    state.runtime.routeMap =
      config.routeMap && typeof config.routeMap === "object"
        ? clone(config.routeMap)
        : state.runtime.routeMap;

    state.runtime.bridgeStatus =
      typeof config.bridgeStatus === "string"
        ? config.bridgeStatus
        : state.runtime.bridgeStatus;

    state.runtime.liveState =
      typeof config.liveState === "string"
        ? config.liveState
        : state.runtime.liveState;
  }

  function setParentStackStatus(status = "UNSET", filesCount = 0) {
    state.parentStack.status =
      typeof status === "string" ? status : state.parentStack.status;
    state.parentStack.filesCount =
      Number.isFinite(filesCount) ? Math.trunc(filesCount) : state.parentStack.filesCount;
  }

  function setRuntimeBridgeStatus(status = "UNSET") {
    state.runtimeBridge.status =
      typeof status === "string" ? status : state.runtimeBridge.status;
  }

  function setLiveRuntimeState(status = "UNSET") {
    state.liveRuntimeState.status =
      typeof status === "string" ? status : state.liveRuntimeState.status;
  }

  function confirmCheckpoint1(config = {}) {
    state.checkpoint1.reached = true;
    state.checkpoint1.source =
      typeof config.source === "string" ? config.source : null;
    state.checkpoint1.reason =
      typeof config.reason === "string" ? config.reason : null;
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

  function registerSession(sessionId, meta = {}) {
    if (typeof sessionId !== "string" || !sessionId) return;
    state.sessions[sessionId] = {
      status: "REGISTERED",
      meta: clone(meta),
      frameCount: 0,
      startedAt: null,
      stoppedAt: null,
      lastTickAt: null
    };
  }

  function markSessionStarted(sessionId, timestamp = Date.now()) {
    if (!state.sessions[sessionId]) registerSession(sessionId);
    state.sessions[sessionId].status = "RUNNING";
    state.sessions[sessionId].startedAt = timestamp;
  }

  function markSessionTick(sessionId, timestamp = Date.now()) {
    if (!state.sessions[sessionId]) registerSession(sessionId);
    state.sessions[sessionId].frameCount += 1;
    state.sessions[sessionId].lastTickAt = timestamp;
  }

  function markSessionStopped(sessionId, timestamp = Date.now()) {
    if (!state.sessions[sessionId]) registerSession(sessionId);
    state.sessions[sessionId].status = "STOPPED";
    state.sessions[sessionId].stoppedAt = timestamp;
  }

  function unregisterSession(sessionId) {
    delete state.sessions[sessionId];
  }

  function resetForNewRun() {
    const next = createInitialState();
    Object.keys(state).forEach((key) => {
      delete state[key];
    });
    Object.assign(state, next);
  }

  const liveRuntimeKernel = {
    __type: "LIVE_RUNTIME_KERNEL",
    __active: true,
    __authority: "G1_EXTERNAL_RUNTIME_KERNEL",

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
    registerSession,
    markSessionStarted,
    markSessionTick,
    markSessionStopped,
    unregisterSession,
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

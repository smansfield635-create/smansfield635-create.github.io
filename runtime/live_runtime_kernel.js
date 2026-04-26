/* TNT RENEWAL — /runtime/live_runtime_kernel.js
   LIVE RUNTIME KERNEL · GENERATION 2 PASSIVE TELEMETRY BASELINE B1

   VERSION = "G2_PASSIVE_LIVE_RUNTIME_KERNEL_B1"

   PURPOSE:
     - Keep this file as a passive telemetry/session kernel.
     - Do not mutate DOM.
     - Do not bind controls.
     - Do not own cockpit state.
     - Do not own canopy truth.
     - Do not own render CSS.
     - Do not start timers.
     - Do not create observers.
     - Do not activate gauges unless explicitly called.
     - Preserve backward globals:
       window.liveRuntimeKernel
       window.LiveRuntimeKernel
*/

(() => {
  "use strict";

  const META = Object.freeze({
    name: "LIVE_RUNTIME_KERNEL",
    version: "G2_PASSIVE_LIVE_RUNTIME_KERNEL_B1",
    role: "passive_runtime_telemetry_kernel",
    contract: "LIVE_RUNTIME_KERNEL_NON_OVERLAP_CONTRACT_G2",
    status: "ACTIVE_PASSIVE",
    deterministic: true
  });

  function safeClone(value) {
    if (value === undefined) return undefined;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (error) {
      return null;
    }
  }

  function toStringOrNull(value) {
    return typeof value === "string" && value.length ? value : null;
  }

  function toObjectOrNull(value) {
    return value && typeof value === "object" && !Array.isArray(value) ? safeClone(value) : null;
  }

  function toInteger(value, fallback = 0) {
    return Number.isFinite(Number(value)) ? Math.trunc(Number(value)) : fallback;
  }

  function createInitialState() {
    return {
      meta: safeClone(META),

      kernel: {
        initialized: false,
        kernelId: null,
        scope: null,
        version: META.version
      },

      active: false,
      authority: "G2_PASSIVE_LIVE_RUNTIME_KERNEL",

      ownership: {
        writesDom: false,
        bindsControls: false,
        ownsCockpitState: false,
        ownsCanopyTruth: false,
        ownsRenderCss: false,
        ownsControlPanelDom: false,
        ownsInstrumentPanelDom: false,
        ownsWorldLaw: false,
        ownsTelemetryState: true
      },

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

      sessions: {},

      updatedAt: null
    };
  }

  const state = createInitialState();

  function touch() {
    state.updatedAt = new Date().toISOString();
  }

  function snapshot() {
    return safeClone(state);
  }

  function initializeKernel(config = {}) {
    state.kernel.initialized = true;
    state.kernel.kernelId = toStringOrNull(config.kernelId) || "LIVE_RUNTIME_KERNEL_G2_PASSIVE";
    state.kernel.scope = toStringOrNull(config.scope) || "PASSIVE_TELEMETRY";
    state.kernel.version = META.version;
    state.active = true;
    touch();

    return snapshot();
  }

  function bindTargets(config = {}) {
    const liveGaugesTarget = toStringOrNull(config.liveGaugesTarget);
    const runtimeReceiptTarget = toStringOrNull(config.runtimeReceiptTarget);
    const routeMap = toObjectOrNull(config.routeMap);

    if (liveGaugesTarget) state.targets.liveGaugesTarget = liveGaugesTarget;
    if (runtimeReceiptTarget) state.targets.runtimeReceiptTarget = runtimeReceiptTarget;
    if (routeMap) state.targets.routeMap = routeMap;

    touch();
    return snapshot();
  }

  function attachRuntime(config = {}) {
    const receiptTarget = toStringOrNull(config.receiptTarget);
    const runtimeReceiptTarget = toStringOrNull(config.runtimeReceiptTarget);
    const routeMap = toObjectOrNull(config.routeMap);
    const bridgeStatus = toStringOrNull(config.bridgeStatus);
    const liveState = toStringOrNull(config.liveState);

    if (receiptTarget) state.runtime.receiptTarget = receiptTarget;
    if (runtimeReceiptTarget) state.runtime.runtimeReceiptTarget = runtimeReceiptTarget;
    if (routeMap) state.runtime.routeMap = routeMap;
    if (bridgeStatus) state.runtime.bridgeStatus = bridgeStatus;
    if (liveState) state.runtime.liveState = liveState;

    touch();
    return snapshot();
  }

  function setParentStackStatus(status = "UNSET", filesCount = 0) {
    const nextStatus = toStringOrNull(status);

    if (nextStatus) state.parentStack.status = nextStatus;
    state.parentStack.filesCount = Math.max(0, toInteger(filesCount, state.parentStack.filesCount));

    touch();
    return snapshot();
  }

  function setRuntimeBridgeStatus(status = "UNSET") {
    const nextStatus = toStringOrNull(status);

    if (nextStatus) state.runtimeBridge.status = nextStatus;

    touch();
    return snapshot();
  }

  function setLiveRuntimeState(status = "UNSET") {
    const nextStatus = toStringOrNull(status);

    if (nextStatus) state.liveRuntimeState.status = nextStatus;

    touch();
    return snapshot();
  }

  function confirmCheckpoint1(config = {}) {
    state.checkpoint1.reached = true;
    state.checkpoint1.source = toStringOrNull(config.source);
    state.checkpoint1.reason = toStringOrNull(config.reason);

    touch();
    return snapshot();
  }

  function canActivateGauges() {
    return state.kernel.initialized === true && state.checkpoint1.reached === true;
  }

  function activateGauges(config = {}) {
    if (!canActivateGauges()) {
      touch();
      return {
        activated: false,
        reason: "KERNEL_NOT_INITIALIZED_OR_CHECKPOINT_NOT_REACHED",
        gauges: getGaugeSnapshot()
      };
    }

    state.gauges.active = true;
    state.gauges.target = toStringOrNull(config.gaugesTarget) || state.gauges.target;

    touch();

    return {
      activated: true,
      reason: "GAUGES_ACTIVATED_BY_EXPLICIT_CALL",
      gauges: getGaugeSnapshot()
    };
  }

  function deactivateGauges(reason = "EXPLICIT_DEACTIVATION") {
    state.gauges.active = false;

    touch();

    return {
      activated: false,
      reason: toStringOrNull(reason) || "EXPLICIT_DEACTIVATION",
      gauges: getGaugeSnapshot()
    };
  }

  function getGaugeSnapshot() {
    return safeClone(state.gauges);
  }

  function registerSession(sessionId, meta = {}) {
    const id = toStringOrNull(sessionId);

    if (!id) return snapshot();

    state.sessions[id] = {
      status: "REGISTERED",
      meta: safeClone(meta) || {},
      frameCount: 0,
      startedAt: null,
      stoppedAt: null,
      lastTickAt: null
    };

    touch();
    return snapshot();
  }

  function markSessionStarted(sessionId, timestamp = Date.now()) {
    const id = toStringOrNull(sessionId);

    if (!id) return snapshot();

    if (!state.sessions[id]) registerSession(id);

    state.sessions[id].status = "RUNNING";
    state.sessions[id].startedAt = Number.isFinite(Number(timestamp)) ? Number(timestamp) : Date.now();

    touch();
    return snapshot();
  }

  function markSessionTick(sessionId, timestamp = Date.now()) {
    const id = toStringOrNull(sessionId);

    if (!id) return snapshot();

    if (!state.sessions[id]) registerSession(id);

    state.sessions[id].frameCount += 1;
    state.sessions[id].lastTickAt = Number.isFinite(Number(timestamp)) ? Number(timestamp) : Date.now();

    touch();
    return snapshot();
  }

  function markSessionStopped(sessionId, timestamp = Date.now()) {
    const id = toStringOrNull(sessionId);

    if (!id) return snapshot();

    if (!state.sessions[id]) registerSession(id);

    state.sessions[id].status = "STOPPED";
    state.sessions[id].stoppedAt = Number.isFinite(Number(timestamp)) ? Number(timestamp) : Date.now();

    touch();
    return snapshot();
  }

  function unregisterSession(sessionId) {
    const id = toStringOrNull(sessionId);

    if (!id) return snapshot();

    delete state.sessions[id];

    touch();
    return snapshot();
  }

  function resetForNewRun() {
    const next = createInitialState();

    Object.keys(state).forEach((key) => {
      delete state[key];
    });

    Object.assign(state, next);
    touch();

    return snapshot();
  }

  function getKernel() {
    return safeClone(state.kernel);
  }

  function getRuntime() {
    return safeClone(state.runtime);
  }

  function getState() {
    return snapshot();
  }

  function isActive() {
    return state.active === true;
  }

  function getPublicState() {
    return snapshot();
  }

  const liveRuntimeKernel = Object.freeze({
    __type: "LIVE_RUNTIME_KERNEL",
    __version: META.version,
    __active: true,
    __authority: "G2_PASSIVE_LIVE_RUNTIME_KERNEL",

    meta: META,

    initializeKernel,
    bindTargets,
    attachRuntime,
    setParentStackStatus,
    setRuntimeBridgeStatus,
    setLiveRuntimeState,
    confirmCheckpoint1,
    canActivateGauges,
    activateGauges,
    deactivateGauges,
    getGaugeSnapshot,
    registerSession,
    markSessionStarted,
    markSessionTick,
    markSessionStopped,
    unregisterSession,
    resetForNewRun,
    getKernel,
    getRuntime,
    getState,
    getPublicState,
    isActive
  });

  if (typeof window !== "undefined") {
    window.liveRuntimeKernel = liveRuntimeKernel;
    window.LiveRuntimeKernel = liveRuntimeKernel;
    window.__LIVE_RUNTIME_KERNEL_DISABLED__ = false;
    window.__LIVE_RUNTIME_KERNEL_VERSION__ = META.version;
  }
})();

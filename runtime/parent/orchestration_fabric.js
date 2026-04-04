(function (global) {
  "use strict";

  const VERSION = "ORCHESTRATION_FABRIC_BASELINE_v1";
  const FABRIC_ID = "ORCHESTRATION_FABRIC";

  const STATUS = Object.freeze({
    UNINITIALIZED: "UNINITIALIZED",
    ATTACHING: "ATTACHING",
    READY: "READY",
    ERROR: "ERROR",
  });

  function assert(condition, message) {
    if (!condition) {
      throw new Error("[ORCHESTRATION_FABRIC] " + message);
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
    const kernel = global.LiveRuntimeKernel;
    assert(kernel, "LiveRuntimeKernel is required");
    return kernel;
  }

  function getInstrumentFactory() {
    const instrumentFactory = global.InstrumentFactory;
    assert(instrumentFactory, "InstrumentFactory is required");
    return instrumentFactory;
  }

  function createInitialState() {
    return {
      version: VERSION,
      fabricId: FABRIC_ID,
      status: STATUS.UNINITIALIZED,
      ready: false,
      attached: false,
      gaugesDeferred: true,
      routeMap: {
        instrumentFactory: "/runtime/parent/instrument_factory.js",
        orchestrationFabric: "/runtime/parent/orchestration_fabric.js",
      },
      parentStack: {
        status: "UNBOUND",
        filesCount: 0,
      },
      bridge: {
        status: "UNINITIALIZED",
      },
      events: [],
      lastError: null,
      lastUpdatedAt: null,
    };
  }

  function createFabric() {
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
      subscribers.forEach(function (listener) {
        try {
          listener(snapshot, type);
        } catch (_) {}
      });
    }

    function setStatus(nextStatus) {
      state.status = nextStatus;
      state.lastUpdatedAt = nowIso();
    }

    const api = {
      version: VERSION,

      getState: function () {
        return freezeCopy(state);
      },

      subscribe: function (listener) {
        assert(typeof listener === "function", "subscribe requires a function");
        subscribers.add(listener);
        return function unsubscribe() {
          subscribers.delete(listener);
        };
      },

      establishBaseline: function () {
        const kernel = getKernel();
        const instrumentFactory = getInstrumentFactory();
        const instrumentState = instrumentFactory.getState();

        if (!instrumentState.ready && typeof instrumentFactory.boot === "function") {
          instrumentFactory.boot();
        }

        assert(instrumentFactory.getState().ready, "InstrumentFactory must be ready");

        setStatus(STATUS.ATTACHING);

        state.attached = true;
        state.ready = true;
        state.parentStack.status = "ORCHESTRATION_FABRIC_READY";
        state.parentStack.filesCount = 7;
        state.bridge.status = "ORCHESTRATION_FABRIC_READY";

        kernel.setParentStackStatus("ORCHESTRATION_FABRIC_READY", 7);
        kernel.setRuntimeBridgeStatus("ORCHESTRATION_FABRIC_READY");
        kernel.setLiveRuntimeState("ORCHESTRATION_FABRIC_LAYER_READY");

        setStatus(STATUS.READY);

        emit("ORCHESTRATION_FABRIC_READY", {
          parentStackStatus: state.parentStack.status,
          parentFilesCount: state.parentStack.filesCount,
        });

        return api.getState();
      },

      boot: function () {
        try {
          const current = api.getState();
          if (current.ready) {
            return current;
          }
          return api.establishBaseline();
        } catch (error) {
          state.lastError = error && error.message ? error.message : String(error);
          setStatus(STATUS.ERROR);
          emit("ORCHESTRATION_FABRIC_ERROR", { message: state.lastError });
          if (typeof console !== "undefined" && console.error) {
            console.error(error);
          }
          return api.getState();
        }
      },
    };

    return Object.freeze(api);
  }

  const OrchestrationFabric = createFabric();
  global.OrchestrationFabric = OrchestrationFabric;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = OrchestrationFabric;
  }

  OrchestrationFabric.boot();
})(typeof globalThis !== "undefined" ? globalThis : window);

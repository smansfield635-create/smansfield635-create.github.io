(function (global) {
  "use strict";

  const VERSION = "INSTRUMENT_FACTORY_BASELINE_v1";
  const FACTORY_ID = "INSTRUMENT_FACTORY";

  const STATUS = Object.freeze({
    UNINITIALIZED: "UNINITIALIZED",
    ATTACHING: "ATTACHING",
    READY: "READY",
    ERROR: "ERROR",
  });

  function assert(condition, message) {
    if (!condition) {
      throw new Error("[INSTRUMENT_FACTORY] " + message);
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

  function getUniverseFactory() {
    const universeFactory = global.UniverseEngineFactory;
    assert(universeFactory, "UniverseEngineFactory is required");
    return universeFactory;
  }

  function createInitialState() {
    return {
      version: VERSION,
      factoryId: FACTORY_ID,
      status: STATUS.UNINITIALIZED,
      ready: false,
      attached: false,
      gaugesDeferred: true,
      routeMap: {
        universeFactory: "/runtime/parent/universe_engine_factory.js",
        instrumentFactory: "/runtime/parent/instrument_factory.js",
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

  function createFactory() {
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
        const universeFactory = getUniverseFactory();
        const universeState = universeFactory.getState();

        if (!universeState.ready && typeof universeFactory.boot === "function") {
          universeFactory.boot();
        }

        assert(universeFactory.getState().ready, "UniverseEngineFactory must be ready");

        setStatus(STATUS.ATTACHING);

        state.attached = true;
        state.ready = true;
        state.parentStack.status = "INSTRUMENT_FACTORY_READY";
        state.parentStack.filesCount = 6;
        state.bridge.status = "INSTRUMENT_FACTORY_READY";

        kernel.setParentStackStatus("INSTRUMENT_FACTORY_READY", 6);
        kernel.setRuntimeBridgeStatus("INSTRUMENT_FACTORY_READY");
        kernel.setLiveRuntimeState("INSTRUMENT_FACTORY_LAYER_READY");

        setStatus(STATUS.READY);

        emit("INSTRUMENT_FACTORY_READY", {
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
          emit("INSTRUMENT_FACTORY_ERROR", { message: state.lastError });
          if (typeof console !== "undefined" && console.error) {
            console.error(error);
          }
          return api.getState();
        }
      },
    };

    return Object.freeze(api);
  }

  const InstrumentFactory = createFactory();
  global.InstrumentFactory = InstrumentFactory;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = InstrumentFactory;
  }

  InstrumentFactory.boot();
})(typeof globalThis !== "undefined" ? globalThis : window);

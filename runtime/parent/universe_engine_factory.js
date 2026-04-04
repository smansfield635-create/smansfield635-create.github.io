(function (global) {
  "use strict";

  const VERSION = "UNIVERSE_ENGINE_FACTORY_BASELINE_v1";
  const FACTORY_ID = "UNIVERSE_ENGINE_FACTORY";

  const STATUS = Object.freeze({
    UNINITIALIZED: "UNINITIALIZED",
    ATTACHING: "ATTACHING",
    READY: "READY",
    ERROR: "ERROR",
  });

  function assert(condition, message) {
    if (!condition) {
      throw new Error("[UNIVERSE_ENGINE_FACTORY] " + message);
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

  function getPlanetEngine() {
    const engine = global.PlanetEngine;
    assert(engine, "PlanetEngine is required");
    return engine;
  }

  function getAdapter() {
    const adapter = global.ParentKernelAdapter;
    assert(adapter, "ParentKernelAdapter is required");
    return adapter;
  }

  function getSpine() {
    const spine = global.DiamondInterfaceSpine;
    assert(spine, "DiamondInterfaceSpine is required");
    return spine;
  }

  function getParentFactory() {
    const parentFactory = global.ParentFactoryEngine;
    assert(parentFactory, "ParentFactoryEngine is required");
    return parentFactory;
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
        kernel: "/runtime/live_runtime_kernel.js",
        planetEngine: "/world/planet_engine.js",
        adapter: "/runtime/parent/kernel_adapter.js",
        spine: "/runtime/parent/diamond_interface_spine.js",
        parentFactory: "/runtime/parent/parent_factory_engine.js",
        universeFactory: "/runtime/parent/universe_engine_factory.js",
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

    function ensureChainReady() {
      const planetEngine = getPlanetEngine();
      const adapter = getAdapter();
      const spine = getSpine();
      const parentFactory = getParentFactory();

      const planetState = planetEngine.getState();
      if (!planetState.baselineEstablished) {
        planetEngine.establishBaseline();
      }

      const adapterState = adapter.getState();
      if (!adapterState.ready) {
        adapter.establishBaseline();
      }

      const spineState = spine.getState();
      if (!spineState.ready) {
        spine.establishBaseline();
      }

      const parentFactoryState = parentFactory.getState();
      if (!parentFactoryState.ready) {
        parentFactory.establishBaseline();
      }
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

        ensureChainReady();

        setStatus(STATUS.ATTACHING);

        state.attached = true;
        state.ready = true;
        state.parentStack.status = "UNIVERSE_FACTORY_READY";
        state.parentStack.filesCount = 5;
        state.bridge.status = "UNIVERSE_FACTORY_READY";

        kernel.setParentStackStatus("UNIVERSE_FACTORY_READY", 5);
        kernel.setRuntimeBridgeStatus("UNIVERSE_FACTORY_READY");
        kernel.setLiveRuntimeState("UNIVERSE_FACTORY_LAYER_READY");

        setStatus(STATUS.READY);

        emit("UNIVERSE_ENGINE_FACTORY_READY", {
          parentStackStatus: state.parentStack.status,
          parentFilesCount: state.parentStack.filesCount,
          gaugesDeferred: state.gaugesDeferred,
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
          emit("UNIVERSE_ENGINE_FACTORY_ERROR", { message: state.lastError });
          if (typeof console !== "undefined" && console.error) {
            console.error(error);
          }
          return api.getState();
        }
      },
    };

    return Object.freeze(api);
  }

  const UniverseEngineFactory = createFactory();
  global.UniverseEngineFactory = UniverseEngineFactory;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = UniverseEngineFactory;
  }

  UniverseEngineFactory.boot();
})(typeof globalThis !== "undefined" ? globalThis : window);

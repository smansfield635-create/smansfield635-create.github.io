(function (global) {
  "use strict";

  const VERSION = "PARENT_FACTORY_ENGINE_BASELINE_v1";
  const FACTORY_ID = "PARENT_FACTORY_ENGINE";

  const STATUS = Object.freeze({
    UNINITIALIZED: "UNINITIALIZED",
    ATTACHING: "ATTACHING",
    ATTACHED: "ATTACHED",
    READY: "READY",
    ERROR: "ERROR",
  });

  function assert(condition, message) {
    if (!condition) {
      throw new Error("[PARENT_FACTORY_ENGINE] " + message);
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
    assert(kernel, "LiveRuntimeKernel is required before parent_factory_engine boots");
    return kernel;
  }

  function getPlanetEngine() {
    const engine = global.PlanetEngine;
    assert(engine, "PlanetEngine is required before parent_factory_engine boots");
    return engine;
  }

  function getKernelAdapter() {
    const adapter = global.ParentKernelAdapter;
    assert(adapter, "ParentKernelAdapter is required before parent_factory_engine boots");
    return adapter;
  }

  function getDiamondInterfaceSpine() {
    const spine = global.DiamondInterfaceSpine;
    assert(spine, "DiamondInterfaceSpine is required before parent_factory_engine boots");
    return spine;
  }

  function createInitialState() {
    return {
      version: VERSION,
      factoryId: FACTORY_ID,
      status: STATUS.UNINITIALIZED,
      attached: false,
      ready: false,
      kernelAttached: false,
      planetEngineAttached: false,
      adapterAttached: false,
      spineAttached: false,
      gaugesDeferred: true,
      targets: {
        kernelFile: "/runtime/live_runtime_kernel.js",
        planetEngineFile: "/world/planet_engine.js",
        kernelAdapterFile: "/runtime/parent/kernel_adapter.js",
        diamondInterfaceSpineFile: "/runtime/parent/diamond_interface_spine.js",
        parentFactoryEngineFile: "/runtime/parent/parent_factory_engine.js",
      },
      routeMap: {
        kernel: "/runtime/live_runtime_kernel.js",
        planetEngine: "/world/planet_engine.js",
        adapter: "/runtime/parent/kernel_adapter.js",
        spine: "/runtime/parent/diamond_interface_spine.js",
        factory: "/runtime/parent/parent_factory_engine.js",
      },
      parentFactory: {
        status: "UNBOUND",
        stage: "NONE",
        attachments: [],
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

  function createFactoryEngine() {
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
        emit("PARENT_FACTORY_ENGINE_ERROR", { message: state.lastError });
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
          const planetEngine = getPlanetEngine();
          const adapter = getKernelAdapter();
          const spine = getDiamondInterfaceSpine();

          const engineState = planetEngine.getState ? planetEngine.getState() : null;
          const adapterState = adapter.getState ? adapter.getState() : null;
          const spineState = spine.getState ? spine.getState() : null;

          assert(
            engineState && engineState.baselineEstablished,
            "PlanetEngine baseline must be established before parent_factory_engine boots"
          );
          assert(
            adapterState && adapterState.ready,
            "ParentKernelAdapter must be ready before parent_factory_engine boots"
          );
          assert(
            spineState && spineState.ready,
            "DiamondInterfaceSpine must be ready before parent_factory_engine boots"
          );

          setStatus(STATUS.ATTACHING);

          state.targets.kernelFile = input.kernelFile || state.targets.kernelFile;
          state.targets.planetEngineFile =
            input.planetEngineFile || state.targets.planetEngineFile;
          state.targets.kernelAdapterFile =
            input.kernelAdapterFile || state.targets.kernelAdapterFile;
          state.targets.diamondInterfaceSpineFile =
            input.diamondInterfaceSpineFile || state.targets.diamondInterfaceSpineFile;
          state.targets.parentFactoryEngineFile =
            input.parentFactoryEngineFile || state.targets.parentFactoryEngineFile;

          state.routeMap = {
            kernel: state.targets.kernelFile,
            planetEngine: state.targets.planetEngineFile,
            adapter: state.targets.kernelAdapterFile,
            spine: state.targets.diamondInterfaceSpineFile,
            factory: state.targets.parentFactoryEngineFile,
          };

          state.kernelAttached = true;
          state.planetEngineAttached = true;
          state.adapterAttached = true;
          state.spineAttached = true;
          state.attached = true;
          state.gaugesDeferred = true;
          state.parentFactory.status = "READY";
          state.parentFactory.stage = "FOUNDATION_ESTABLISHED";
          state.parentFactory.attachments = [
            state.targets.kernelFile,
            state.targets.planetEngineFile,
            state.targets.kernelAdapterFile,
            state.targets.diamondInterfaceSpineFile,
            state.targets.parentFactoryEngineFile,
          ];
          state.parentStack.status = "PARENT_FACTORY_READY";
          state.parentStack.filesCount = 4;
          state.bridge.status = "PARENT_FACTORY_READY";

          kernel.setParentStackStatus("PARENT_FACTORY_READY", 4);
          kernel.setRuntimeBridgeStatus("PARENT_FACTORY_READY");
          kernel.setLiveRuntimeState("PARENT_FACTORY_LAYER_READY");

          setStatus(STATUS.ATTACHED);

          emit("PARENT_FACTORY_ENGINE_ATTACHED", {
            routeMap: state.routeMap,
            parentFactory: state.parentFactory,
          });

          state.ready = true;
          setStatus(STATUS.READY);

          emit("PARENT_FACTORY_ENGINE_READY", {
            parentStackStatus: state.parentStack.status,
            parentFilesCount: state.parentStack.filesCount,
          });

          return api.getState();
        });
      },

      getFactoryRead() {
        return freezeCopy({
          version: VERSION,
          factoryId: FACTORY_ID,
          attached: state.attached,
          ready: state.ready,
          gaugesDeferred: state.gaugesDeferred,
          parentFactory: state.parentFactory,
          parentStack: state.parentStack,
          bridge: state.bridge,
          routeMap: state.routeMap,
          status: state.status,
        });
      },

      reset() {
        state = createInitialState();
        emit("PARENT_FACTORY_ENGINE_RESET", {});
        return api.getState();
      },
    };

    return Object.freeze(api);
  }

  const ParentFactoryEngine = createFactoryEngine();

  global.ParentFactoryEngine = ParentFactoryEngine;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = ParentFactoryEngine;
  }
})(typeof globalThis !== "undefined" ? globalThis : window);

(function (global) {
  "use strict";

  const VERSION = "KERNEL_ADAPTER_BASELINE_v1";
  const ADAPTER_ID = "PARENT_KERNEL_ADAPTER";

  const STATUS = Object.freeze({
    UNINITIALIZED: "UNINITIALIZED",
    ATTACHING: "ATTACHING",
    ATTACHED: "ATTACHED",
    READY: "READY",
    ERROR: "ERROR",
  });

  function assert(condition, message) {
    if (!condition) {
      throw new Error("[KERNEL_ADAPTER] " + message);
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
    assert(kernel, "LiveRuntimeKernel is required before kernel_adapter boots");
    return kernel;
  }

  function getPlanetEngine() {
    const engine = global.PlanetEngine;
    assert(engine, "PlanetEngine is required before kernel_adapter boots");
    return engine;
  }

  function createInitialState() {
    return {
      version: VERSION,
      adapterId: ADAPTER_ID,
      status: STATUS.UNINITIALIZED,
      attached: false,
      ready: false,
      kernelAttached: false,
      planetEngineAttached: false,
      parentLayerBound: false,
      gaugesDeferred: true,
      targets: {
        kernelFile: "/runtime/live_runtime_kernel.js",
        planetEngineFile: "/world/planet_engine.js",
        kernelAdapterFile: "/runtime/parent/kernel_adapter.js",
        diamondInterfaceSpineFile: "/runtime/parent/diamond_interface_spine.js",
      },
      routeMap: {
        kernel: "/runtime/live_runtime_kernel.js",
        planetEngine: "/world/planet_engine.js",
        adapter: "/runtime/parent/kernel_adapter.js",
        spine: "/runtime/parent/diamond_interface_spine.js",
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

  function createAdapter() {
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
        emit("KERNEL_ADAPTER_ERROR", { message: state.lastError });
        throw error;
      }
    }

    function syncKernelAndEngine(kernel, planetEngine) {
      const engineState = planetEngine.getState ? planetEngine.getState() : null;

      assert(
        engineState && engineState.baselineEstablished,
        "PlanetEngine baseline must be established before attaching kernel_adapter"
      );

      kernel.setParentStackStatus("ADAPTER_ATTACHED", 2);
      kernel.setRuntimeBridgeStatus("PARENT_ADAPTER_ATTACHED");
      kernel.setLiveRuntimeState("PARENT_LAYER_READY");

      state.kernelAttached = true;
      state.planetEngineAttached = true;
      state.parentLayerBound = true;
      state.parentStack.status = "ADAPTER_ATTACHED";
      state.parentStack.filesCount = 2;
      state.bridge.status = "PARENT_ADAPTER_ATTACHED";
      state.gaugesDeferred = true;

      emit("KERNEL_AND_ENGINE_SYNCHRONIZED", {
        parentStackStatus: state.parentStack.status,
        parentFilesCount: state.parentStack.filesCount,
      });
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

          setStatus(STATUS.ATTACHING);

          state.targets.kernelFile = input.kernelFile || state.targets.kernelFile;
          state.targets.planetEngineFile =
            input.planetEngineFile || state.targets.planetEngineFile;
          state.targets.kernelAdapterFile =
            input.kernelAdapterFile || state.targets.kernelAdapterFile;
          state.targets.diamondInterfaceSpineFile =
            input.diamondInterfaceSpineFile || state.targets.diamondInterfaceSpineFile;

          state.routeMap = {
            kernel: state.targets.kernelFile,
            planetEngine: state.targets.planetEngineFile,
            adapter: state.targets.kernelAdapterFile,
            spine: state.targets.diamondInterfaceSpineFile,
          };

          syncKernelAndEngine(kernel, planetEngine);

          state.attached = true;
          setStatus(STATUS.ATTACHED);

          emit("KERNEL_ADAPTER_BASELINE_ESTABLISHED", {
            routeMap: state.routeMap,
            gaugesDeferred: state.gaugesDeferred,
          });

          state.ready = true;
          setStatus(STATUS.READY);

          emit("KERNEL_ADAPTER_READY", {
            ready: true,
            nextLayer: state.targets.diamondInterfaceSpineFile,
          });

          return api.getState();
        });
      },

      bindParentLayer(details) {
        return withGuard(function () {
          const input = details || {};
          const kernel = getKernel();
          const planetEngine = getPlanetEngine();

          syncKernelAndEngine(kernel, planetEngine);

          if (typeof input.parentFilesCount === "number" && Number.isFinite(input.parentFilesCount)) {
            state.parentStack.filesCount = input.parentFilesCount;
            kernel.setParentStackStatus(state.parentStack.status, state.parentStack.filesCount);
          }

          emit("PARENT_LAYER_BOUND", {
            parentStackStatus: state.parentStack.status,
            parentFilesCount: state.parentStack.filesCount,
          });

          return api.getState();
        });
      },

      getCheckpointRead() {
        return freezeCopy({
          version: VERSION,
          adapterId: ADAPTER_ID,
          attached: state.attached,
          ready: state.ready,
          parentLayerBound: state.parentLayerBound,
          gaugesDeferred: state.gaugesDeferred,
          status: state.status,
        });
      },

      getRouteRead() {
        return freezeCopy({
          version: VERSION,
          adapterId: ADAPTER_ID,
          targets: state.targets,
          routeMap: state.routeMap,
          parentStack: state.parentStack,
          bridge: state.bridge,
          status: state.status,
        });
      },

      reset() {
        state = createInitialState();
        emit("KERNEL_ADAPTER_RESET", {});
        return api.getState();
      },
    };

    return Object.freeze(api);
  }

  const ParentKernelAdapter = createAdapter();

  global.ParentKernelAdapter = ParentKernelAdapter;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = ParentKernelAdapter;
  }
})(typeof globalThis !== "undefined" ? globalThis : window);

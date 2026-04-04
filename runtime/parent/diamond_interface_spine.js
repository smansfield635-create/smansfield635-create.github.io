(function (global) {
  "use strict";

  const VERSION = "DIAMOND_INTERFACE_SPINE_BASELINE_v1";
  const SPINE_ID = "DIAMOND_INTERFACE_SPINE";

  const STATUS = Object.freeze({
    UNINITIALIZED: "UNINITIALIZED",
    ATTACHING: "ATTACHING",
    ATTACHED: "ATTACHED",
    READY: "READY",
    ERROR: "ERROR",
  });

  function assert(condition, message) {
    if (!condition) {
      throw new Error("[DIAMOND_INTERFACE_SPINE] " + message);
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
    assert(kernel, "LiveRuntimeKernel is required before diamond_interface_spine boots");
    return kernel;
  }

  function getPlanetEngine() {
    const engine = global.PlanetEngine;
    assert(engine, "PlanetEngine is required before diamond_interface_spine boots");
    return engine;
  }

  function getKernelAdapter() {
    const adapter = global.ParentKernelAdapter;
    assert(adapter, "ParentKernelAdapter is required before diamond_interface_spine boots");
    return adapter;
  }

  function createInitialState() {
    return {
      version: VERSION,
      spineId: SPINE_ID,
      status: STATUS.UNINITIALIZED,
      attached: false,
      ready: false,
      kernelAttached: false,
      planetEngineAttached: false,
      adapterAttached: false,
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
      topology: {
        nodes: ["NORTH", "EAST", "SOUTH", "WEST", "CENTER"],
        edges: [
          ["NORTH", "CENTER"],
          ["EAST", "CENTER"],
          ["SOUTH", "CENTER"],
          ["WEST", "CENTER"],
        ],
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

  function createSpine() {
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
        emit("DIAMOND_INTERFACE_SPINE_ERROR", { message: state.lastError });
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

          const engineState = planetEngine.getState ? planetEngine.getState() : null;
          const adapterState = adapter.getState ? adapter.getState() : null;

          assert(
            engineState && engineState.baselineEstablished,
            "PlanetEngine baseline must be established before diamond_interface_spine boots"
          );
          assert(
            adapterState && adapterState.ready,
            "ParentKernelAdapter must be ready before diamond_interface_spine boots"
          );

          setStatus(STATUS.ATTACHING);

          state.targets.kernelFile = input.kernelFile || state.targets.kernelFile;
          state.targets.planetEngineFile =
            input.planetEngineFile || state.targets.planetEngineFile;
          state.targets.kernelAdapterFile =
            input.kernelAdapterFile || state.targets.kernelAdapterFile;
          state.targets.diamondInterfaceSpineFile =
            input.diamondInterfaceSpineFile || state.targets.diamondInterfaceSpineFile;

          if (Array.isArray(input.nodes) && input.nodes.length > 0) {
            state.topology.nodes = clone(input.nodes);
          }
          if (Array.isArray(input.edges) && input.edges.length > 0) {
            state.topology.edges = clone(input.edges);
          }

          state.routeMap = {
            kernel: state.targets.kernelFile,
            planetEngine: state.targets.planetEngineFile,
            adapter: state.targets.kernelAdapterFile,
            spine: state.targets.diamondInterfaceSpineFile,
          };

          kernel.setParentStackStatus("SPINE_ATTACHED", 3);
          kernel.setRuntimeBridgeStatus("SPINE_READY");
          kernel.setLiveRuntimeState("SPINE_LAYER_READY");

          state.kernelAttached = true;
          state.planetEngineAttached = true;
          state.adapterAttached = true;
          state.attached = true;
          state.parentStack.status = "SPINE_ATTACHED";
          state.parentStack.filesCount = 3;
          state.bridge.status = "SPINE_READY";
          state.gaugesDeferred = true;

          setStatus(STATUS.ATTACHED);

          emit("DIAMOND_INTERFACE_SPINE_ATTACHED", {
            routeMap: state.routeMap,
            topology: state.topology,
          });

          state.ready = true;
          setStatus(STATUS.READY);

          emit("DIAMOND_INTERFACE_SPINE_READY", {
            parentStackStatus: state.parentStack.status,
            parentFilesCount: state.parentStack.filesCount,
          });

          return api.getState();
        });
      },

      getDiamondRead() {
        return freezeCopy({
          version: VERSION,
          spineId: SPINE_ID,
          attached: state.attached,
          ready: state.ready,
          gaugesDeferred: state.gaugesDeferred,
          topology: state.topology,
          parentStack: state.parentStack,
          bridge: state.bridge,
          routeMap: state.routeMap,
          status: state.status,
        });
      },

      reset() {
        state = createInitialState();
        emit("DIAMOND_INTERFACE_SPINE_RESET", {});
        return api.getState();
      },
    };

    return Object.freeze(api);
  }

  const DiamondInterfaceSpine = createSpine();

  global.DiamondInterfaceSpine = DiamondInterfaceSpine;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = DiamondInterfaceSpine;
  }
})(typeof globalThis !== "undefined" ? globalThis : window);

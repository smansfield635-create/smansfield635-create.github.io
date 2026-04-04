(function (global) {
  "use strict";

  const VERSION = "PARENT_STACK_SMOKE_TEST_BASELINE_v1";
  const TEST_ID = "PARENT_STACK_SMOKE_TEST";

  const STATUS = Object.freeze({
    UNINITIALIZED: "UNINITIALIZED",
    RUNNING: "RUNNING",
    READY: "READY",
    PENDING: "PENDING",
    ERROR: "ERROR",
  });

  function assert(condition, message) {
    if (!condition) {
      throw new Error("[PARENT_STACK_SMOKE_TEST] " + message);
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

  function publishEvent(name, detail) {
    if (typeof global.dispatchEvent === "function" && typeof global.CustomEvent === "function") {
      try {
        global.dispatchEvent(new CustomEvent(name, { detail: detail }));
      } catch (_) {}
    }
  }

  function getKernel() {
    const kernel = global.LiveRuntimeKernel;
    assert(kernel, "LiveRuntimeKernel is required");
    return kernel;
  }

  function getPlanetEngine() {
    const planetEngine = global.PlanetEngine;
    assert(planetEngine, "PlanetEngine is required");
    return planetEngine;
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

  function getUniverseFactory() {
    const universeFactory = global.UniverseEngineFactory;
    assert(universeFactory, "UniverseEngineFactory is required");
    return universeFactory;
  }

  function getInstrumentFactory() {
    const instrumentFactory = global.InstrumentFactory;
    assert(instrumentFactory, "InstrumentFactory is required");
    return instrumentFactory;
  }

  function getOrchestrationFabric() {
    const orchestrationFabric = global.OrchestrationFabric;
    assert(orchestrationFabric, "OrchestrationFabric is required");
    return orchestrationFabric;
  }

  function createInitialState() {
    return {
      version: VERSION,
      testId: TEST_ID,
      status: STATUS.UNINITIALIZED,
      passed: false,
      checks: [],
      result: null,
      receipt: null,
      lastError: null,
      events: [],
      lastUpdatedAt: null,
    };
  }

  function createSmokeTest() {
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

    function setAliases(result, receipt) {
      global.__PARENT_STACK_SMOKE_RESULT__ = result;
      global.ParentStackSmokeResult = result;
      global.parentStackSmokeResult = result;
      global.parentStackSmokeReady = !!result.passed;

      global.__RUNTIME_BRIDGE_RECEIPT__ = receipt;
      global.RuntimeBridgeReceipt = receipt;
      global.runtimeBridgeReceipt = receipt;
      global.runtimeBridgeReady = receipt.status === "READY";
    }

    function buildChecks() {
      const planetState = getPlanetEngine().getState();
      const adapterState = getAdapter().getState();
      const spineState = getSpine().getState();
      const parentFactoryState = getParentFactory().getState();
      const universeState = getUniverseFactory().getState();
      const instrumentState = getInstrumentFactory().getState();
      const fabricState = getOrchestrationFabric().getState();

      return [
        { name: "PlanetEngine", ready: !!planetState.baselineEstablished },
        { name: "ParentKernelAdapter", ready: !!adapterState.ready },
        { name: "DiamondInterfaceSpine", ready: !!spineState.ready },
        { name: "ParentFactoryEngine", ready: !!parentFactoryState.ready },
        { name: "UniverseEngineFactory", ready: !!universeState.ready },
        { name: "InstrumentFactory", ready: !!instrumentState.ready },
        { name: "OrchestrationFabric", ready: !!fabricState.ready },
      ];
    }

    function ensureChainReady() {
      const planetEngine = getPlanetEngine();
      if (!planetEngine.getState().baselineEstablished) {
        planetEngine.establishBaseline();
      }

      const adapter = getAdapter();
      if (!adapter.getState().ready) {
        adapter.establishBaseline();
      }

      const spine = getSpine();
      if (!spine.getState().ready) {
        spine.establishBaseline();
      }

      const parentFactory = getParentFactory();
      if (!parentFactory.getState().ready) {
        parentFactory.establishBaseline();
      }

      const universeFactory = getUniverseFactory();
      if (!universeFactory.getState().ready && typeof universeFactory.boot === "function") {
        universeFactory.boot();
      }

      const instrumentFactory = getInstrumentFactory();
      if (!instrumentFactory.getState().ready && typeof instrumentFactory.boot === "function") {
        instrumentFactory.boot();
      }

      const orchestrationFabric = getOrchestrationFabric();
      if (!orchestrationFabric.getState().ready && typeof orchestrationFabric.boot === "function") {
        orchestrationFabric.boot();
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

      run: function () {
        const kernel = getKernel();

        try {
          setStatus(STATUS.RUNNING);
          ensureChainReady();

          const checks = buildChecks();
          const passed = checks.every(function (check) {
            return !!check.ready;
          });

          const result = {
            version: VERSION,
            testId: TEST_ID,
            passed: passed,
            checks: checks,
            at: nowIso(),
          };

          const receipt = {
            version: VERSION,
            receiptId: "RUNTIME_BRIDGE_RECEIPT_v1",
            status: passed ? "READY" : "PENDING",
            bridgeStatus: passed ? "RUNTIME_BRIDGE_RECEIPT_READY" : "RUNTIME_BRIDGE_RECEIPT_PENDING",
            at: nowIso(),
          };

          state.checks = checks;
          state.passed = passed;
          state.result = result;
          state.receipt = receipt;

          kernel.setParentStackStatus(passed ? "PARENT_STACK_SMOKE_READY" : "PARENT_STACK_SMOKE_PENDING", 8);
          kernel.setRuntimeBridgeStatus(receipt.bridgeStatus);
          kernel.setLiveRuntimeState(
            passed ? "BASELINE_STRETCH_READY_FOR_GAUGES_GATE" : "BASELINE_STRETCH_PENDING"
          );

          setAliases(result, receipt);

          publishEvent("parent-stack-smoke-ready", result);
          publishEvent("runtime-bridge-receipt-ready", receipt);

          emit("PARENT_STACK_SMOKE_TEST_COMPLETED", {
            passed: passed,
            receiptStatus: receipt.status,
          });

          setStatus(passed ? STATUS.READY : STATUS.PENDING);
          return api.getState();
        } catch (error) {
          state.lastError = error && error.message ? error.message : String(error);
          setStatus(STATUS.ERROR);

          const result = {
            version: VERSION,
            testId: TEST_ID,
            passed: false,
            checks: state.checks,
            error: state.lastError,
            at: nowIso(),
          };

          const receipt = {
            version: VERSION,
            receiptId: "RUNTIME_BRIDGE_RECEIPT_v1",
            status: "PENDING",
            bridgeStatus: "RUNTIME_BRIDGE_RECEIPT_PENDING",
            error: state.lastError,
            at: nowIso(),
          };

          state.result = result;
          state.receipt = receipt;

          setAliases(result, receipt);

          publishEvent("parent-stack-smoke-ready", result);
          publishEvent("runtime-bridge-receipt-ready", receipt);

          emit("PARENT_STACK_SMOKE_TEST_ERROR", { message: state.lastError });

          if (typeof console !== "undefined" && console.error) {
            console.error(error);
          }

          return api.getState();
        }
      },

      boot: function () {
        return api.run();
      },
    };

    return Object.freeze(api);
  }

  const ParentStackSmokeTest = createSmokeTest();
  global.ParentStackSmokeTest = ParentStackSmokeTest;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = ParentStackSmokeTest;
  }

  ParentStackSmokeTest.boot();
})(typeof globalThis !== "undefined" ? globalThis : window);

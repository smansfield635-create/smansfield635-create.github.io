// /showroom/globe/audralia/diagnostic/index.control.bridge.js
// AUDRALIA_DIAGNOSTIC_RELATIONAL_CONTROL_COMPATIBILITY_BRIDGE_TNT_v10
// Full-file replacement.
// Builds from v9 and adds bounded engine / diagnostic-track compatibility awareness.
// Quiet-load. Alias installation only. Explicit verification only.

(function installAudraliaRelationalControlBridgeV10(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);
  var doc = root && root.document ? root.document : null;
  if (!doc) return;

  var CONTRACT = "AUDRALIA_DIAGNOSTIC_RELATIONAL_CONTROL_COMPATIBILITY_BRIDGE_TNT_v10";
  var PREVIOUS_CONTRACT = "AUDRALIA_DIAGNOSTIC_RELATIONAL_CONTROL_COMPATIBILITY_BRIDGE_TNT_v9";
  var VERSION = "10.0.0";
  var FILE = "/showroom/globe/audralia/diagnostic/index.control.bridge.js";
  var SCOPE = "AUDRALIA_DIAGNOSTIC_CONTROL_FAMILY";

  var GLOBAL_API = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_CONTROL_BRIDGE";
  var GLOBAL_STATE = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_CONTROL_BRIDGE_STATE";
  var GLOBAL_RECEIPT = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_CONTROL_BRIDGE_RECEIPT";

  var STATUS = Object.freeze({
    READY: "READY",
    HELD: "HELD",
    ERROR: "ERROR",
    PENDING: "PENDING",
    UNAVAILABLE: "UNAVAILABLE"
  });

  var PHASE = Object.freeze({
    INSTALLING: "INSTALLING",
    RELATIONAL_PENDING: "RELATIONAL_PENDING",
    RELATIONAL_VERIFYING: "RELATIONAL_VERIFYING",
    RELATIONAL_COMPLETE: "RELATIONAL_COMPLETE",
    ERROR: "ERROR"
  });

  var REQUIRED_RUNTIME_ORDER = Object.freeze([
    "index.control.bridge.js",
    "index.inspection.lane.js",
    "index.js",
    "index.controls.js"
  ]);

  var CONTROL_REQUIREMENTS_GLOBAL = "AUDRALIA_DIAGNOSTIC_CONTROLS_REQUIREMENTS";

  var CONTROL_API_PATHS = Object.freeze([
    "AUDRALIA_DROP_WITH_READ_CONTROL_PANEL",
    "AUDRALIA.dropWithReadControlPanel"
  ]);

  var INSPECTION_API_PATHS = Object.freeze([
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE",
    "AUDRALIA.diagnosticInspectionLane"
  ]);

  var INTERPRETER_API_PATHS = Object.freeze([
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE",
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY",
    "AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER",
    "AUDRALIA.diagnosticEngine",
    "AUDRALIA.dropWithReadDiagnosticObservatory",
    "AUDRALIA.diagnosticRouteController"
  ]);

  var ENGINE_COMPATIBILITY = Object.freeze([
    Object.freeze({
      key: "runtimeTableNorth",
      file: "/assets/lab/runtime-table.js",
      paths: Object.freeze(["LAB_RUNTIME_TABLE", "LAB_RUNTIME_TABLE_NORTH", "RUNTIME_TABLE"])
    }),
    Object.freeze({
      key: "runtimeTableEast",
      file: "/assets/lab/runtime-table.east.js",
      paths: Object.freeze(["LAB_RUNTIME_TABLE_EAST", "LAB_RUNTIME_TABLE_EAST_F3", "RUNTIME_TABLE_EAST"])
    }),
    Object.freeze({
      key: "runtimeTableWest",
      file: "/assets/lab/runtime-table.west.js",
      paths: Object.freeze(["LAB_RUNTIME_TABLE_WEST", "LAB_RUNTIME_TABLE_WEST_F5", "RUNTIME_TABLE_WEST"])
    }),
    Object.freeze({
      key: "runtimeTableSouth",
      file: "/assets/lab/runtime-table.south.js",
      paths: Object.freeze(["LAB_RUNTIME_TABLE_SOUTH", "LAB_RUNTIME_TABLE_SOUTH_F8", "RUNTIME_TABLE_SOUTH"])
    }),
    Object.freeze({
      key: "productEngineF34",
      file: "/assets/lab/product-engine.js",
      paths: Object.freeze(["LAB_PRODUCT_ENGINE", "LAB_PRODUCT_ENGINE_F34", "PRODUCT_ENGINE_F34"])
    }),
    Object.freeze({
      key: "ue5ExpressionF55",
      file: "/assets/lab/product-engine.ue5-expression.js",
      paths: Object.freeze(["LAB_PRODUCT_ENGINE_UE5_EXPRESSION", "LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55"])
    }),
    Object.freeze({
      key: "registryF89",
      file: "/assets/lab/product-engine.registry.js",
      paths: Object.freeze(["LAB_PRODUCT_ENGINE_REGISTRY", "LAB_PRODUCT_ENGINE_REGISTRY_F89"])
    }),
    Object.freeze({
      key: "marketF144",
      file: "/assets/lab/product-engine.market.js",
      paths: Object.freeze(["LAB_PRODUCT_ENGINE_MARKET", "LAB_PRODUCT_ENGINE_MARKET_F144"])
    }),
    Object.freeze({
      key: "diagnosticRailF89",
      file: "/assets/audralia/audralia.diagnostic.rail.js",
      paths: Object.freeze(["AUDRALIA_DIAGNOSTIC_RAIL", "AUDRALIA.diagnosticRail"])
    })
  ]);

  var state = null;
  var runSequence = 0;

  function nowIso() {
    try { return new Date().toISOString(); } catch (_error) { return null; }
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function clone(value, seen) {
    var memory = seen || [];
    if (value === null || value === undefined) return value;
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
    if (typeof value === "function") return { type: "Function", name: value.name || "anonymous" };
    if (typeof value !== "object") return String(value);
    if (memory.indexOf(value) !== -1) return "[Circular]";
    memory.push(value);
    if (Array.isArray(value)) return value.map(function (entry) { return clone(entry, memory); });
    var out = {};
    Object.keys(value).forEach(function (key) {
      try { out[key] = clone(value[key], memory); } catch (_error) { out[key] = null; }
    });
    return out;
  }

  function freeze(value) {
    if (!value || typeof value !== "object") return value;
    Object.keys(value).forEach(function (key) { freeze(value[key]); });
    try { return Object.freeze(value); } catch (_error) { return value; }
  }

  function readPath(path) {
    var parts = String(path || "").split(".").filter(Boolean);
    var cursor = root;
    for (var i = 0; i < parts.length; i += 1) {
      if (!cursor) return null;
      cursor = cursor[parts[i]];
    }
    return cursor || null;
  }

  function resolveFirst(paths) {
    for (var i = 0; i < paths.length; i += 1) {
      var value = readPath(paths[i]);
      if (value) return { path: paths[i], value: value };
    }
    return null;
  }

  function readContract(value) {
    try { return value && (value.CONTRACT || value.contract) || null; } catch (_error) { return null; }
  }

  function createMetric(reason) {
    return {
      status: STATUS.PENDING,
      complete: false,
      reason: reason || "NOT_EVALUATED",
      evidence: null
    };
  }

  function createState(mode) {
    return {
      schema: "AUDRALIA_DIAGNOSTIC_RELATIONAL_CONTROL_BRIDGE_STATE_v3",
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      scope: SCOPE,
      mode: mode,
      sequence: ++runSequence,
      phase: PHASE.INSTALLING,
      installationStatus: STATUS.PENDING,
      relationalStatus: STATUS.PENDING,
      engineCompatibilityStatus: STATUS.PENDING,
      familySynchronizationStatus: STATUS.PENDING,
      overallStatus: STATUS.PENDING,
      relationalVerificationRun: false,
      relationalVerificationCount: 0,
      controlsRequirements: createMetric("CONTROLS_REQUIREMENTS_NOT_EVALUATED"),
      controlsApi: createMetric("CONTROLS_API_NOT_EVALUATED"),
      inspectionEvidence: createMetric("INSPECTION_NOT_EVALUATED"),
      interpreterEvidence: createMetric("INTERPRETER_NOT_EVALUATED"),
      runtimeOrder: createMetric("RUNTIME_ORDER_NOT_EVALUATED"),
      engineCompatibility: createMetric("ENGINE_COMPATIBILITY_NOT_EVALUATED"),
      familySynchronization: createMetric("FAMILY_SYNCHRONIZATION_NOT_EVALUATED"),
      mandatoryCategories: [],
      passedMandatoryCategories: [],
      heldMandatoryCategories: [],
      unavailableMandatoryCategories: [],
      failedMandatoryCategories: [],
      observations: [],
      conflicts: [],
      errors: [],
      startedAt: nowIso(),
      completedAt: null,
      noClaims: {
        exactNineClaimed: false,
        stationExecutionClaimed: false,
        engineReadinessClaimed: false,
        productionMutationAuthority: false,
        repairAuthorizationAuthority: false,
        rendererAuthority: false,
        routeMutationAuthority: false,
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        webGPU: false,
        visualPassClaimed: false,
        finalVisualPassClaimed: false
      }
    };
  }

  function observeAuthority(paths) {
    var resolved = resolveFirst(paths);
    return {
      observed: Boolean(resolved && resolved.value),
      path: resolved ? resolved.path : null,
      contract: resolved ? readContract(resolved.value) : null,
      hasReceipt: Boolean(resolved && resolved.value && (isFunction(resolved.value.getReceipt) || isFunction(resolved.value.getReceiptLight)))
    };
  }

  function observeControlsRequirements(target) {
    var req = root[CONTROL_REQUIREMENTS_GLOBAL] || null;
    target.controlsRequirements = {
      status: req ? STATUS.READY : STATUS.UNAVAILABLE,
      complete: Boolean(req),
      reason: req ? "CONTROLS_REQUIREMENTS_OBSERVED" : "CONTROLS_REQUIREMENTS_UNAVAILABLE",
      evidence: req ? clone({
        schema: req.schema || null,
        controlsContract: req.controlsContract || null,
        expectedEngineContract: req.expectedEngineContract || null,
        expectedInspectionLaneContract: req.expectedInspectionLaneContract || null,
        requiredCycleTargetIds: req.requiredCycleTargetIds || [],
        requiredStationPositions: req.requiredStationPositions || []
      }) : null
    };
    return req;
  }

  function evaluateControlsApi(target, req) {
    var observed = observeAuthority(CONTROL_API_PATHS);
    var expected = req && req.controlsContract || null;
    var ok = Boolean(observed.observed && (!expected || observed.contract === expected));

    target.controlsApi = {
      status: ok ? STATUS.READY : observed.observed ? STATUS.HELD : STATUS.UNAVAILABLE,
      complete: ok,
      reason: ok ? "CONTROLS_API_CORRESPONDS" : observed.observed ? "CONTROLS_API_CONTRACT_HELD" : "CONTROLS_API_UNAVAILABLE",
      evidence: {
        observed: observed,
        expectedContract: expected
      }
    };
  }

  function evaluateInspectionEvidence(target, req) {
    var observed = observeAuthority(INSPECTION_API_PATHS);
    var expected = req && req.expectedInspectionLaneContract || null;
    var ok = Boolean(observed.observed && (!expected || observed.contract === expected));

    target.inspectionEvidence = {
      status: ok ? STATUS.READY : observed.observed ? STATUS.HELD : STATUS.UNAVAILABLE,
      complete: ok,
      reason: ok ? "INSPECTION_LANE_CORRESPONDS" : observed.observed ? "INSPECTION_LANE_CONTRACT_HELD" : "INSPECTION_LANE_UNAVAILABLE",
      evidence: {
        observed: observed,
        expectedContract: expected
      }
    };
  }

  function evaluateInterpreterEvidence(target, req) {
    var observed = observeAuthority(INTERPRETER_API_PATHS);
    var expected = req && req.expectedEngineContract || null;
    var ok = Boolean(observed.observed && (!expected || observed.contract === expected));

    target.interpreterEvidence = {
      status: ok ? STATUS.READY : observed.observed ? STATUS.HELD : STATUS.UNAVAILABLE,
      complete: ok,
      reason: ok ? "INTERPRETER_CORRESPONDS" : observed.observed ? "INTERPRETER_CONTRACT_HELD" : "INTERPRETER_UNAVAILABLE",
      evidence: {
        observed: observed,
        expectedContract: expected
      }
    };
  }

  function scriptName(script) {
    var src = script.getAttribute("src") || "";
    src = src.split("?")[0].split("#")[0];
    return src.substring(src.lastIndexOf("/") + 1);
  }

  function evaluateRuntimeOrder(target) {
    var observed = Array.prototype.slice.call(doc.querySelectorAll("script[src]"))
      .map(scriptName)
      .filter(Boolean);

    var cursor = -1;
    var complete = REQUIRED_RUNTIME_ORDER.every(function (name) {
      var index = observed.indexOf(name, cursor + 1);
      if (index < 0) return false;
      cursor = index;
      return true;
    });

    target.runtimeOrder = {
      status: complete ? STATUS.READY : observed.length ? STATUS.HELD : STATUS.UNAVAILABLE,
      complete: complete,
      reason: complete ? "PHYSICAL_RUNTIME_ORDER_CORRESPONDS" : "PHYSICAL_RUNTIME_ORDER_HELD_OR_UNAVAILABLE",
      evidence: {
        expectedRuntimeOrder: REQUIRED_RUNTIME_ORDER.slice(),
        observedPhysicalOrder: observed
      }
    };
  }

  function evaluateEngineCompatibility(target) {
    var entries = ENGINE_COMPATIBILITY.map(function (entry) {
      var observed = observeAuthority(entry.paths);
      return {
        key: entry.key,
        file: entry.file,
        observed: observed.observed,
        path: observed.path,
        contract: observed.contract,
        hasReceiptMethod: observed.hasReceipt
      };
    });

    var observedCount = entries.filter(function (entry) { return entry.observed; }).length;
    var complete = observedCount === entries.length;
    var partial = observedCount > 0;

    target.engineCompatibility = {
      status: complete ? STATUS.READY : partial ? STATUS.HELD : STATUS.UNAVAILABLE,
      complete: complete,
      reason: complete ? "ENGINE_AND_DIAGNOSTIC_TRACK_COMPATIBILITY_OBSERVED" : partial ? "ENGINE_AND_DIAGNOSTIC_TRACK_PARTIAL" : "ENGINE_AND_DIAGNOSTIC_TRACK_UNAVAILABLE",
      evidence: {
        expectedCount: entries.length,
        observedCount: observedCount,
        entries: entries,
        nonExecutingInspectionOnly: true,
        receiptsNotExecuted: true,
        readinessNotClaimed: true
      }
    };

    target.engineCompatibilityStatus = target.engineCompatibility.status;
  }

  function classify(target, name, metric) {
    target.mandatoryCategories.push(name);
    if (metric && metric.status === STATUS.READY && metric.complete === true) {
      target.passedMandatoryCategories.push(name);
    } else if (metric && metric.status === STATUS.ERROR) {
      target.failedMandatoryCategories.push(name);
    } else if (metric && metric.status === STATUS.UNAVAILABLE) {
      target.unavailableMandatoryCategories.push(name);
    } else {
      target.heldMandatoryCategories.push(name);
    }
  }

  function evaluateFamilySynchronization(target) {
    target.mandatoryCategories = [];
    target.passedMandatoryCategories = [];
    target.heldMandatoryCategories = [];
    target.unavailableMandatoryCategories = [];
    target.failedMandatoryCategories = [];

    classify(target, "controlsRequirements", target.controlsRequirements);
    classify(target, "controlsApi", target.controlsApi);
    classify(target, "inspectionEvidence", target.inspectionEvidence);
    classify(target, "interpreterEvidence", target.interpreterEvidence);
    classify(target, "runtimeOrder", target.runtimeOrder);
    classify(target, "engineCompatibility", target.engineCompatibility);

    var complete = (
      target.failedMandatoryCategories.length === 0 &&
      target.heldMandatoryCategories.length === 0 &&
      target.unavailableMandatoryCategories.length === 0
    );

    target.familySynchronization = {
      status: complete ? STATUS.READY : target.failedMandatoryCategories.length ? STATUS.ERROR : STATUS.HELD,
      complete: complete,
      reason: complete ? "DIAGNOSTIC_CONTROL_FAMILY_SYNCHRONIZED" : "MANDATORY_RELATIONAL_CATEGORY_NOT_COMPLETE",
      evidence: {
        mandatoryCategories: target.mandatoryCategories.slice(),
        passedMandatoryCategories: target.passedMandatoryCategories.slice(),
        heldMandatoryCategories: target.heldMandatoryCategories.slice(),
        unavailableMandatoryCategories: target.unavailableMandatoryCategories.slice(),
        failedMandatoryCategories: target.failedMandatoryCategories.slice(),
        familySynchronizationCertified: complete
      }
    };

    target.familySynchronizationStatus = target.familySynchronization.status;
    target.relationalStatus = target.familySynchronization.status;
    target.overallStatus = complete ? STATUS.READY : STATUS.HELD;
  }

  function publishState(next) {
    state = next;
    root[GLOBAL_STATE] = freeze(clone(next));
    if (doc.documentElement) {
      doc.documentElement.setAttribute("data-control-bridge-ready", next.overallStatus === STATUS.READY ? "true" : "false");
      doc.documentElement.setAttribute("data-control-bridge-status", next.overallStatus);
      doc.documentElement.setAttribute("data-control-bridge-phase", next.phase);
      doc.documentElement.setAttribute("data-control-bridge-scope", SCOPE);
      doc.documentElement.setAttribute("data-control-bridge-contract", CONTRACT);
    }
  }

  function buildReceipt(next) {
    return freeze(clone({
      schema: "AUDRALIA_DIAGNOSTIC_RELATIONAL_CONTROL_BRIDGE_RECEIPT_v6",
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      scope: SCOPE,
      phase: next.phase,
      status: next.overallStatus,
      installationStatus: next.installationStatus,
      relationalStatus: next.relationalStatus,
      engineCompatibilityStatus: next.engineCompatibilityStatus,
      familySynchronizationStatus: next.familySynchronizationStatus,
      relationalVerificationRun: next.relationalVerificationRun,
      relationalVerificationCount: next.relationalVerificationCount,
      controlsRequirements: next.controlsRequirements,
      controlsApi: next.controlsApi,
      inspectionEvidence: next.inspectionEvidence,
      interpreterEvidence: next.interpreterEvidence,
      runtimeOrder: next.runtimeOrder,
      engineCompatibility: next.engineCompatibility,
      familySynchronization: next.familySynchronization,
      mandatoryCategories: next.mandatoryCategories,
      passedMandatoryCategories: next.passedMandatoryCategories,
      heldMandatoryCategories: next.heldMandatoryCategories,
      unavailableMandatoryCategories: next.unavailableMandatoryCategories,
      failedMandatoryCategories: next.failedMandatoryCategories,
      conflicts: next.conflicts,
      errors: next.errors,
      observations: next.observations,
      noClaims: next.noClaims,
      generatedAt: nowIso()
    }));
  }

  function verifyRelationships() {
    var next = createState("VERIFY");
    next.phase = PHASE.RELATIONAL_VERIFYING;
    next.installationStatus = state ? state.installationStatus : STATUS.READY;
    next.relationalVerificationRun = true;
    next.relationalVerificationCount = state ? Number(state.relationalVerificationCount || 0) + 1 : 1;

    publishState(next);

    try {
      var req = observeControlsRequirements(next);
      evaluateControlsApi(next, req);
      evaluateInspectionEvidence(next, req);
      evaluateInterpreterEvidence(next, req);
      evaluateRuntimeOrder(next);
      evaluateEngineCompatibility(next);
      evaluateFamilySynchronization(next);
      next.phase = PHASE.RELATIONAL_COMPLETE;
      next.completedAt = nowIso();
    } catch (error) {
      next.phase = PHASE.ERROR;
      next.overallStatus = STATUS.ERROR;
      next.relationalStatus = STATUS.ERROR;
      next.errors.push({
        code: "RELATIONAL_VERIFICATION_FAILURE",
        message: error && error.message ? error.message : String(error),
        occurredAt: nowIso()
      });
    }

    publishState(next);
    root[GLOBAL_RECEIPT] = buildReceipt(next);
    return freeze(clone(next));
  }

  function getState() {
    return freeze(clone(state));
  }

  function getReceipt() {
    return freeze(clone(root[GLOBAL_RECEIPT] || null));
  }

  function getRelationalVerdict() {
    return freeze(clone({
      phase: state.phase,
      status: state.overallStatus,
      relationalVerificationRun: state.relationalVerificationRun,
      relationalVerificationCount: state.relationalVerificationCount,
      familySynchronizationCertified: Boolean(state.familySynchronization && state.familySynchronization.complete),
      engineCompatibilityStatus: state.engineCompatibilityStatus,
      heldMandatoryCategories: state.heldMandatoryCategories,
      unavailableMandatoryCategories: state.unavailableMandatoryCategories,
      failedMandatoryCategories: state.failedMandatoryCategories
    }));
  }

  function createApi() {
    return Object.freeze({
      CONTRACT: CONTRACT,
      contract: CONTRACT,
      PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      VERSION: VERSION,
      version: VERSION,
      FILE: FILE,
      file: FILE,
      SCOPE: SCOPE,
      scope: SCOPE,
      ENGINE_COMPATIBILITY: ENGINE_COMPATIBILITY,
      getState: getState,
      getReceipt: getReceipt,
      getRelationalVerdict: getRelationalVerdict,
      verifyRelationships: verifyRelationships,
      verifyAliases: function verifyAliases() { return getState(); },
      get phase() { return state.phase; },
      get status() { return state.overallStatus; },
      get STATUS() { return state.overallStatus; },
      get relationalPending() { return state.phase === PHASE.RELATIONAL_PENDING; },
      get familySynchronizationCertified() { return Boolean(state.familySynchronization && state.familySynchronization.complete); }
    });
  }

  function publishApi(api) {
    root[GLOBAL_API] = api;
    root.AUDRALIA = root.AUDRALIA && typeof root.AUDRALIA === "object" ? root.AUDRALIA : {};
    root.AUDRALIA.diagnosticControlBridge = api;
    root.__AUDRALIA_DIAGNOSTIC_CONTROL_BRIDGE_LOADED__ = true;
    root.__AUDRALIA_DIAGNOSTIC_CONTROL_BRIDGE_CONTRACT__ = CONTRACT;
    root.__AUDRALIA_DIAGNOSTIC_CONTROL_BRIDGE_VERSION__ = VERSION;
  }

  function installOnly() {
    var next = createState("INSTALL");
    next.phase = PHASE.RELATIONAL_PENDING;
    next.installationStatus = STATUS.READY;
    next.relationalStatus = STATUS.PENDING;
    next.engineCompatibilityStatus = STATUS.PENDING;
    next.familySynchronizationStatus = STATUS.PENDING;
    next.overallStatus = STATUS.PENDING;
    next.completedAt = nowIso();
    next.observations.push({
      code: "CONTROL_BRIDGE_V10_INSTALLED_ALIAS_ONLY",
      detail: {
        downstreamVerificationNotExecuted: true,
        engineReceiptsNotExecuted: true,
        diagnosticReadinessNotClaimed: true
      },
      observedAt: nowIso()
    });
    publishState(next);
  }

  var existing = root[GLOBAL_API];
  if (existing && (existing.CONTRACT === CONTRACT || existing.contract === CONTRACT)) return;

  installOnly();
  publishApi(createApi());

  if (typeof module !== "undefined" && module.exports) {
    module.exports = root[GLOBAL_API];
  }
})(typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : this);

// /showroom/globe/audralia/diagnostic/index.inspection.authority.js
// AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_AUTHORITY_RENEWED_FAMILY_ALIGNMENT_TNT_v2
// Full-file replacement.
// Quiet-load diagnostic authority.
// Read-only. No production mutation. No runtime repair. No readiness claim.

(function installAudraliaDiagnosticAuthority(root) {
  "use strict";

  var FILE = "/showroom/globe/audralia/diagnostic/index.inspection.authority.js";
  var CONTRACT = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_AUTHORITY_RENEWED_FAMILY_ALIGNMENT_TNT_v2";
  var PREVIOUS_CONTRACT = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_AUTHORITY_CHILD_TNT_v1";
  var VERSION = "2.0.0";
  var OPERATION = "AUDRALIA_DIAGNOSTIC_AUTHORITY_RENEWED_FAMILY_ALIGNMENT_INSTALL";

  var API_SYMBOL = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_AUTHORITY";
  var STATE_SYMBOL = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_AUTHORITY_STATE";
  var RECEIPT_SYMBOL = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_AUTHORITY_RECEIPT";
  var LOADED_FLAG = "__AUDRALIA_DIAGNOSTIC_AUTHORITY_LOADED__";

  var OBSOLETE_LOADED_FLAG = "AUDRALIA_DIAGNOSTIC_AUTHORITY_LOADED";
  var PROHIBITED_EVIDENCE_SYMBOL = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_AUTHORITY_EVIDENCE";

  var STATE_SCHEMA = "AUDRALIA_DIAGNOSTIC_AUTHORITY_STATE_v2";
  var RECEIPT_SCHEMA = "AUDRALIA_DIAGNOSTIC_AUTHORITY_RECEIPT_v2";

  var REQUIRED_GLOBALS = Object.freeze([
    "DGB_ENGINE_CONTRACT",
    "DGB_ENGINE",
    "DGB_ENGINE_SUBJECT_REGISTRY",
    "AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR",
    "AUDRALIA_DIAGNOSTIC_PROBE_NORTH",
    "AUDRALIA_DIAGNOSTIC_PROBE_EAST",
    "AUDRALIA_DIAGNOSTIC_EAST",
    "AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
    "AUDRALIA_DIAGNOSTIC_PROBE_WEST",
    "AUDRALIA_DIAGNOSTIC_WEST",
    "AUDRALIA_DIAGNOSTIC_PROBE_SOUTH",
    "AUDRALIA_DIAGNOSTIC_SOUTH",
    "AUDRALIA_DIAGNOSTIC_SOUTH_SURFACE_POINTER",
    "AUDRALIA_DIAGNOSTIC_RAIL",
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE",
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_ENGINE",
    "AUDRALIA_DROP_WITH_READ_CONTROL_PANEL"
  ]);

  var EXPECTED_CONTRACTS = Object.freeze({
    DGB_ENGINE_CONTRACT: "DGB_INTERACTIVE_RUNTIME_ENGINE_CONTRACT_NEWS_FIBONACCI_SPEC_OPS_TNT_v1",
    DGB_ENGINE: "DGB_INTERACTIVE_RUNTIME_ENGINE_CORE_NEWS_FIBONACCI_SPEC_OPS_TNT_v1",
    DGB_ENGINE_SUBJECT_REGISTRY: "DGB_ENGINE_AND_AUTHORITY_REGISTRY_SIX_SLOT_RUNTIME_BINDING_TNT_v2",
    AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR: "AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_NINE_CYCLE_TERMINAL_LEDGER_TRANSPORT_3D_TNT_v4",
    AUDRALIA_DIAGNOSTIC_PROBE_NORTH: "AUDRALIA_DIAGNOSTIC_NORTH_PROBE_INTAKE_STATION_F1_EVIDENCE_AUTHORITY_TNT_v3",
    AUDRALIA_DIAGNOSTIC_PROBE_EAST: "AUDRALIA_DIAGNOSTIC_PROBE_EAST_SOURCE_F3_3D_TNT_v3",
    AUDRALIA_DIAGNOSTIC_EAST: "AUDRALIA_DIAGNOSTIC_EAST_CONSTRUCTION_INTERPRETATION_F5_3D_TNT_v3",
    AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH: "AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_F8_3D_TNT_v5",
    AUDRALIA_DIAGNOSTIC_PROBE_WEST: "AUDRALIA_DIAGNOSTIC_PROBE_WEST_RUNTIME_F13_3D_TNT_v3",
    AUDRALIA_DIAGNOSTIC_WEST: "AUDRALIA_DIAGNOSTIC_WEST_RUNTIME_INTERPRETATION_F21_3D_TNT_v2",
    AUDRALIA_DIAGNOSTIC_PROBE_SOUTH: "AUDRALIA_DIAGNOSTIC_PROBE_SOUTH_HANDOFF_F34_3D_TNT_v2",
    AUDRALIA_DIAGNOSTIC_SOUTH: "AUDRALIA_DIAGNOSTIC_SOUTH_RESTITUTION_INTERPRETATION_F55_3D_TNT_v2",
    AUDRALIA_DIAGNOSTIC_SOUTH_SURFACE_POINTER: "AUDRALIA_DIAGNOSTIC_SOUTH_SURFACE_POINTER_AUXILIARY_3D_TNT_v2",
    AUDRALIA_DIAGNOSTIC_RAIL: "AUDRALIA_DIAGNOSTIC_RAIL_TERMINAL_SYNTHESIS_F89_3D_TNT_v3",
    AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE: "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE_TNT_v1",
    AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_ENGINE: "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE_TNT_v2",
    AUDRALIA_DROP_WITH_READ_CONTROL_PANEL: "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_DISTRIBUTED_CONTROL_PANEL_TNT_v7"
  });

  var NO_CLAIMS = Object.freeze({
    engineAuthority: false,
    productionMutationAuthority: false,
    contractRewriteAuthority: false,
    routeMutationAuthority: false,
    rendererAuthority: false,
    runtimeAuthority: false,
    repairAuthorizationAuthority: false,
    fileAuthorizationAuthority: false,
    finalProductionVerdictAuthority: false,
    systemReadinessClaimed: false,
    runtimeReadinessClaimed: false,
    visualPassClaimed: false,
    cyclePassClaimed: false,
    familySynchronizationClaimed: false,
    f21Claimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webGPU: false
  });

  function nowIso() {
    try { return new Date().toISOString(); } catch (_error) { return null; }
  }

  function isObject(value) {
    return value !== null && (typeof value === "object" || typeof value === "function");
  }

  function isPlainObject(value) {
    if (!value || Object.prototype.toString.call(value) !== "[object Object]") return false;
    var proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
  }

  function freezeOwned(value, seen) {
    if (!isObject(value)) return value;
    var memory = seen || [];
    if (memory.indexOf(value) !== -1) return value;
    memory.push(value);
    try {
      Object.getOwnPropertyNames(value).forEach(function each(key) {
        freezeOwned(value[key], memory);
      });
      Object.freeze(value);
    } catch (_error) {}
    return value;
  }

  function clonePlain(value, seen) {
    if (value === null || typeof value === "string" || typeof value === "boolean") return value;
    if (typeof value === "number") return Number.isFinite(value) ? value : null;
    if (!isObject(value)) return null;

    var memory = seen || [];
    if (memory.indexOf(value) !== -1) return null;
    memory.push(value);

    if (Array.isArray(value)) {
      return value.slice(0, 377).map(function map(entry) {
        return clonePlain(entry, memory.slice());
      });
    }

    if (!isPlainObject(value)) return null;

    var out = {};
    Object.keys(value).slice(0, 233).forEach(function each(key) {
      try { out[String(key).slice(0, 12000)] = clonePlain(value[key], memory.slice()); }
      catch (_error) { out[String(key).slice(0, 12000)] = null; }
    });
    return out;
  }

  function stableStringify(value) {
    if (value === null) return "null";
    if (typeof value === "string") return JSON.stringify(value);
    if (typeof value === "boolean") return value ? "true" : "false";
    if (typeof value === "number") return Number.isFinite(value) ? String(value) : "null";
    if (Array.isArray(value)) return "[" + value.map(stableStringify).join(",") + "]";
    if (isPlainObject(value)) {
      return "{" + Object.keys(value).sort().map(function encode(key) {
        return JSON.stringify(key) + ":" + stableStringify(value[key]);
      }).join(",") + "}";
    }
    return "null";
  }

  function hash(value) {
    var text = stableStringify(clonePlain(value, []));
    var h = 0x811c9dc5;
    for (var i = 0; i < text.length; i += 1) {
      h ^= text.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
      h >>>= 0;
    }
    return "fnv1a32:" + ("00000000" + h.toString(16)).slice(-8);
  }

  function readGlobal(name) {
    try {
      return root && Object.prototype.hasOwnProperty.call(root, name)
        ? root[name]
        : null;
    } catch (_error) {
      return null;
    }
  }

  function safeCall(api, method) {
    try {
      if (api && typeof api[method] === "function") return api[method]();
    } catch (error) {
      return {
        error: error && error.message ? error.message : String(error)
      };
    }
    return null;
  }

  function readContract(api) {
    if (!api) return null;
    return api.CONTRACT || api.contract || null;
  }

  function readVersion(api) {
    if (!api) return null;
    return api.VERSION || api.version || null;
  }

  function readFile(api) {
    if (!api) return null;
    return api.FILE || api.file || null;
  }

  function inspectFamily() {
    var records = REQUIRED_GLOBALS.map(function map(name) {
      var api = readGlobal(name);
      var expected = EXPECTED_CONTRACTS[name] || null;
      var contract = readContract(api);
      var definition = safeCall(api, "getDefinitionReceipt") || safeCall(api, "getReceipt") || safeCall(api, "getStatus");

      var present = Boolean(api);
      var contractMatched = Boolean(present && expected && contract === expected);
      var callable = Boolean(
        api &&
        (
          typeof api.getDefinitionReceipt === "function" ||
          typeof api.getReceipt === "function" ||
          typeof api.getStatus === "function" ||
          typeof api.executeCycleStation === "function" ||
          typeof api.runNineCycle === "function" ||
          typeof api.createReport === "function"
        )
      );

      return freezeOwned({
        symbol: name,
        present: present,
        expectedContract: expected,
        observedContract: contract,
        contractMatched: contractMatched,
        version: readVersion(api),
        file: readFile(api),
        callable: callable,
        definitionObserved: Boolean(definition),
        definitionHash: definition ? hash(definition) : null,
        status: !present ? "ABSENT" : contractMatched || !expected ? "PRESENT" : "CONTRACT_MISMATCH"
      });
    });

    var presentCount = records.filter(function count(record) { return record.present; }).length;
    var absentCount = records.filter(function count(record) { return !record.present; }).length;
    var mismatchCount = records.filter(function count(record) {
      return record.present && record.expectedContract && !record.contractMatched;
    }).length;
    var callableCount = records.filter(function count(record) { return record.callable; }).length;

    var status = "AVAILABLE";
    if (absentCount) status = "HELD_MISSING_AUTHORITIES";
    if (mismatchCount) status = "HELD_CONTRACT_MISMATCH";

    return freezeOwned({
      records: freezeOwned(records),
      requiredCount: REQUIRED_GLOBALS.length,
      presentCount: presentCount,
      absentCount: absentCount,
      mismatchCount: mismatchCount,
      callableCount: callableCount,
      status: status,
      familySynchronizationClaimed: false,
      runtimeReadinessClaimed: false,
      visualPassClaimed: false
    });
  }

  function buildState(family) {
    return freezeOwned({
      schema: STATE_SCHEMA,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      operation: OPERATION,
      fileStatus: "LOADED",
      installationStatus: "INSTALLED",
      validationStatus: family.mismatchCount === 0 ? "VALID" : "HELD",
      correspondenceStatus: family.status,
      readinessStatus: "HELD",
      releaseStatus: "NOT_RELEASED",
      publicationStatus: "CONFIRMED",
      loaded: true,
      installed: true,
      ready: false,
      released: false,
      publicationConfirmed: true,
      manualReviewRequired: family.absentCount > 0 || family.mismatchCount > 0,
      familySummary: family,
      noClaims: NO_CLAIMS,
      generatedAt: nowIso()
    });
  }

  function buildReceipt(state) {
    var receipt = {
      schema: RECEIPT_SCHEMA,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      operation: OPERATION,
      result: state.manualReviewRequired
        ? "INSTALLED_WITH_FAMILY_ALIGNMENT_HELD"
        : "INSTALLED_WITH_RENEWED_FAMILY_OBSERVED",
      committed: true,
      publicSymbols: freezeOwned([
        API_SYMBOL,
        STATE_SYMBOL,
        RECEIPT_SYMBOL,
        LOADED_FLAG
      ]),
      familySummary: state.familySummary,
      publicationStatus: "CONFIRMED",
      publicationConfirmed: true,
      readinessStatus: "HELD",
      releaseStatus: "NOT_RELEASED",
      evidenceSummary: freezeOwned({
        requiredGlobalCount: state.familySummary.requiredCount,
        presentGlobalCount: state.familySummary.presentCount,
        absentGlobalCount: state.familySummary.absentCount,
        contractMismatchCount: state.familySummary.mismatchCount,
        callableGlobalCount: state.familySummary.callableCount,
        authorityLoaded: true,
        systemReadinessClaimed: false,
        runtimeReadinessClaimed: false,
        visualPassClaimed: false,
        familySynchronizationClaimed: false
      }),
      noClaims: NO_CLAIMS,
      generatedAt: nowIso(),
      receiptHash: null
    };

    receipt.receiptHash = hash(receipt);
    return freezeOwned(receipt);
  }

  var committedApi = null;
  var committedState = null;
  var committedReceipt = null;

  function getState() {
    return committedState;
  }

  function getReceipt() {
    return committedReceipt;
  }

  function getStatus() {
    return freezeOwned({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      operation: OPERATION,
      loaded: Boolean(root && root[LOADED_FLAG] === true),
      installed: Boolean(committedState && committedState.installed === true),
      ready: false,
      released: false,
      readinessStatus: committedState ? committedState.readinessStatus : "HELD",
      releaseStatus: committedState ? committedState.releaseStatus : "NOT_RELEASED",
      familyStatus: committedState ? committedState.familySummary.status : "UNKNOWN",
      familySynchronizationClaimed: false,
      runtimeReadinessClaimed: false,
      visualPassClaimed: false,
      noClaims: NO_CLAIMS
    });
  }

  function inspect() {
    var family = inspectFamily();
    return freezeOwned({
      schema: "AUDRALIA_DIAGNOSTIC_AUTHORITY_INSPECTION_RESULT_v2",
      contract: CONTRACT,
      version: VERSION,
      file: FILE,
      familySummary: family,
      noClaims: NO_CLAIMS,
      generatedAt: nowIso(),
      inspectionHash: hash(family)
    });
  }

  function installAuthorityChild() {
    var family = inspectFamily();
    var state = buildState(family);
    var receipt = buildReceipt(state);

    committedState = state;
    committedReceipt = receipt;

    return freezeOwned({
      schema: "AUDRALIA_DIAGNOSTIC_AUTHORITY_INSTALL_RESULT_SCHEMA_v2",
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      operation: OPERATION,
      result: receipt.result,
      ok: true,
      installed: true,
      committed: true,
      held: state.manualReviewRequired,
      ready: false,
      released: false,
      state: state,
      receipt: receipt,
      noClaims: NO_CLAIMS
    });
  }

  function buildApi() {
    return freezeOwned({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      operation: OPERATION,
      installAuthorityChild: installAuthorityChild,
      inspect: inspect,
      getState: getState,
      getReceipt: getReceipt,
      getStatus: getStatus,
      hash: hash,
      noClaims: NO_CLAIMS
    });
  }

  function define(symbol, value) {
    Object.defineProperty(root, symbol, {
      value: value,
      enumerable: false,
      writable: false,
      configurable: true
    });
  }

  function removeProhibited() {
    try { delete root[OBSOLETE_LOADED_FLAG]; } catch (_error) {}
    try { delete root[PROHIBITED_EVIDENCE_SYMBOL]; } catch (_error2) {}
  }

  function publish() {
    if (!root || typeof root !== "object") return;

    removeProhibited();

    committedApi = buildApi();
    installAuthorityChild();

    define(API_SYMBOL, committedApi);
    define(STATE_SYMBOL, committedState);
    define(RECEIPT_SYMBOL, committedReceipt);
    define(LOADED_FLAG, true);
  }

  try {
    publish();
  } catch (_quietLoadError) {
    committedApi = committedApi || buildApi();
    committedState = committedState || buildState(inspectFamily());
    committedReceipt = committedReceipt || buildReceipt(committedState);
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = committedApi || buildApi();
  }
})(
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof window !== "undefined"
      ? window
      : typeof self !== "undefined"
        ? self
        : this
);

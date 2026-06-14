// /assets/audralia/audralia.diagnostic.rail.js
// AUDRALIA_DIAGNOSTIC_RAIL_TERMINAL_SYNTHESIS_F89_3D_TNT_v1
// Full-file replacement.
// Quiet-load, dependency-free, 3D-native terminal diagnostic rail.
// Implements Position 9 for the Audralia nine-cycle diagnostic conductor.
// NORTH_RETURN terminal synthesis.
// Consumes complete or interrupted cycle ledger.
// Owns final diagnostic synthesis, READ classification, first-held/failed/conflict/error reporting,
// restitution summary, and next-action recommendation.
// Does not mutate, repair, authorize production, validate engine readiness, or claim visual pass.

(function audraliaDiagnosticRailTerminalSynthesisF893D(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);

  var CONTRACT = "AUDRALIA_DIAGNOSTIC_RAIL_TERMINAL_SYNTHESIS_F89_3D_TNT_v1";
  var RECEIPT = "AUDRALIA_DIAGNOSTIC_RAIL_TERMINAL_SYNTHESIS_F89_3D_RECEIPT_v1";
  var VERSION = "1.0.0";
  var VERSION_LABEL =
    "2026-06-14.audralia-diagnostic-rail-terminal-synthesis-f89-3d-v1";
  var FILE = "/assets/audralia/audralia.diagnostic.rail.js";

  var STATION_ID = "RAIL_TERMINAL_SYNTHESIS";
  var CYCLE_POSITION = 9;
  var FIBONACCI = "F89";
  var NEWS = "NORTH_RETURN";

  var REQUEST_SCHEMA = "AUDRALIA_DIAGNOSTIC_STATION_EXECUTION_REQUEST_v1";
  var RECEIPT_SCHEMA = "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_STATION_RECEIPT_v1";

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
    diagnosticPassProvesReady: false,
    railSynthesisProvesReadiness: false,
    railSynthesisAuthorizesRepair: false,
    readyClaimed: false,
    verifiedClaimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webGPU: false
  });

  var LIMITS = Object.freeze({
    maxStringLength: 12000,
    maxArrayLength: 377,
    maxObjectKeys: 233,
    maxDepth: 13,
    maxIssues: 89
  });

  function nowIso() {
    try { return new Date().toISOString(); } catch (_error) { return null; }
  }

  function isFiniteNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  function isPlainObject(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    var proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
  }

  function deepFreeze(value, seen) {
    if (!value || typeof value !== "object") return value;
    var memory = seen || [];
    if (memory.indexOf(value) !== -1) return value;
    memory.push(value);
    try {
      Object.keys(value).forEach(function each(key) {
        deepFreeze(value[key], memory);
      });
      Object.freeze(value);
    } catch (_error) {}
    return value;
  }

  function issue(code, path, detail) {
    return {
      code: String(code || "ISSUE"),
      path: String(path || "$"),
      detail: String(detail || code || "ISSUE").slice(0, 512)
    };
  }

  function clonePlain(value, seen) {
    if (value === null || typeof value === "string" || typeof value === "boolean") return value;
    if (isFiniteNumber(value)) return value;
    if (
      value === undefined ||
      typeof value === "number" ||
      typeof value === "function" ||
      typeof value === "symbol" ||
      typeof value === "bigint"
    ) return null;

    if (!value || typeof value !== "object") return null;
    if (!Array.isArray(value) && !isPlainObject(value)) return null;

    var memory = seen || [];
    if (memory.indexOf(value) !== -1) return null;
    memory.push(value);

    if (Array.isArray(value)) {
      return value.slice(0, LIMITS.maxArrayLength).map(function map(entry) {
        return clonePlain(entry, memory);
      });
    }

    var output = {};
    Object.keys(value).slice(0, LIMITS.maxObjectKeys).forEach(function each(key) {
      var safeKey = String(key).slice(0, LIMITS.maxStringLength);
      try { output[safeKey] = clonePlain(value[key], memory); }
      catch (_error) { output[safeKey] = null; }
    });

    return output;
  }

  function stableStringify(value) {
    if (value === null) return "null";
    if (typeof value === "string") return JSON.stringify(value);
    if (typeof value === "boolean") return value ? "true" : "false";
    if (isFiniteNumber(value)) return String(value);
    if (Array.isArray(value)) return "[" + value.map(stableStringify).join(",") + "]";
    if (isPlainObject(value)) {
      return "{" + Object.keys(value).sort().map(function encodeKey(key) {
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

  function safeString(value, fallback) {
    if (fallback === undefined) fallback = null;
    if (typeof value !== "string") return fallback;
    return value.slice(0, LIMITS.maxStringLength);
  }

  function validatePlainData(value) {
    var issues = [];

    function walk(item, path, depth, seen) {
      if (issues.length >= LIMITS.maxIssues) return;

      if (depth > LIMITS.maxDepth) {
        issues.push(issue("DEPTH_LIMIT_EXCEEDED", path));
        return;
      }

      if (item === null || typeof item === "string" || typeof item === "boolean" || isFiniteNumber(item)) return;

      if (
        item === undefined ||
        typeof item === "function" ||
        typeof item === "symbol" ||
        typeof item === "bigint"
      ) {
        issues.push(issue("NON_PLAIN_VALUE_FORBIDDEN", path));
        return;
      }

      if (typeof item === "number") {
        issues.push(issue("NONFINITE_NUMBER_FORBIDDEN", path));
        return;
      }

      if (!item || typeof item !== "object") {
        issues.push(issue("NON_PLAIN_VALUE_FORBIDDEN", path));
        return;
      }

      if (!Array.isArray(item) && !isPlainObject(item)) {
        issues.push(issue("NON_PLAIN_OBJECT_FORBIDDEN", path));
        return;
      }

      if (seen.indexOf(item) !== -1) {
        issues.push(issue("CYCLIC_OBJECT_FORBIDDEN", path));
        return;
      }

      seen.push(item);

      if (Array.isArray(item)) {
        if (item.length > LIMITS.maxArrayLength) {
          issues.push(issue("ARRAY_LIMIT_EXCEEDED", path));
          return;
        }

        item.forEach(function eachArray(entry, index) {
          walk(entry, path + "[" + index + "]", depth + 1, seen);
        });
        return;
      }

      Object.keys(item).forEach(function eachKey(key) {
        var descriptor;
        try { descriptor = Object.getOwnPropertyDescriptor(item, key); }
        catch (_error) {
          issues.push(issue("PROPERTY_DESCRIPTOR_UNREADABLE", path + "." + key));
          return;
        }

        if (!descriptor || descriptor.get || descriptor.set) {
          issues.push(issue("ACCESSOR_PROPERTY_FORBIDDEN", path + "." + key));
          return;
        }

        walk(item[key], path + "." + key, depth + 1, seen);
      });
    }

    walk(value, "$", 0, []);

    return deepFreeze({
      passed: issues.length === 0,
      issues: deepFreeze(issues)
    });
  }

  function validateStationRequest(request) {
    var issues = [];
    var plain = validatePlainData(request);

    if (!plain.passed) issues = issues.concat(plain.issues);

    if (!isPlainObject(request)) {
      issues.push(issue("REQUEST_OBJECT_REQUIRED", "$"));
      return deepFreeze({ passed: false, issues: deepFreeze(issues) });
    }

    if (request.schema !== REQUEST_SCHEMA) issues.push(issue("REQUEST_SCHEMA_MISMATCH", "$.schema"));
    if (request.position !== CYCLE_POSITION) issues.push(issue("REQUEST_POSITION_MISMATCH", "$.position"));
    if (request.stationId !== STATION_ID) issues.push(issue("REQUEST_STATION_ID_MISMATCH", "$.stationId"));
    if (!safeString(request.cycleId, "")) issues.push(issue("REQUEST_CYCLE_ID_REQUIRED", "$.cycleId"));
    if (!Array.isArray(request.priorStationReceipts)) {
      issues.push(issue("PRIOR_STATION_RECEIPTS_ARRAY_REQUIRED", "$.priorStationReceipts"));
    }

    return deepFreeze({
      passed: issues.length === 0,
      issues: deepFreeze(issues)
    });
  }

  function expectedStations() {
    return [
      "NORTH_PROBE_INTAKE",
      "EAST_PROBE_SOURCE",
      "EAST_CONSTRUCTION_INTERPRETATION",
      "CANVAS_SURFACE_TRUTH",
      "WEST_PROBE_RUNTIME",
      "WEST_RUNTIME_INTERPRETATION",
      "SOUTH_PROBE_HANDOFF",
      "SOUTH_RESTITUTION_INTERPRETATION"
    ];
  }

  function findReceipt(request, stationId) {
    var receipts = Array.isArray(request.priorStationReceipts)
      ? request.priorStationReceipts
      : [];

    for (var i = receipts.length - 1; i >= 0; i -= 1) {
      if (isPlainObject(receipts[i]) && receipts[i].stationId === stationId) return receipts[i];
    }

    return null;
  }

  function firstByStatus(receipts, status) {
    for (var i = 0; i < receipts.length; i += 1) {
      if (isPlainObject(receipts[i]) && receipts[i].status === status) return receipts[i];
    }
    return null;
  }

  function summarizeReceipts(request) {
    var receipts = Array.isArray(request.priorStationReceipts)
      ? request.priorStationReceipts.filter(isPlainObject)
      : [];

    var missing = [];
    expectedStations().forEach(function each(stationId) {
      if (!findReceipt(request, stationId)) missing.push(stationId);
    });

    var passCount = receipts.filter(function count(r) { return r.status === "PASS"; }).length;
    var holdCount = receipts.filter(function count(r) { return r.status === "HOLD"; }).length;
    var failCount = receipts.filter(function count(r) { return r.status === "FAIL"; }).length;
    var conflictCount = receipts.filter(function count(r) { return r.status === "CONFLICT"; }).length;
    var errorCount = receipts.filter(function count(r) { return r.status === "ERROR"; }).length;

    var firstHeld = firstByStatus(receipts, "HOLD");
    var firstFailed = firstByStatus(receipts, "FAIL");
    var firstConflict = firstByStatus(receipts, "CONFLICT");
    var firstError = firstByStatus(receipts, "ERROR");

    var terminalClass = "COMPLETE_DIAGNOSTIC_PATH";
    if (errorCount) terminalClass = "ERROR_INTERRUPTED_DIAGNOSTIC_PATH";
    else if (conflictCount) terminalClass = "CONFLICT_INTERRUPTED_DIAGNOSTIC_PATH";
    else if (failCount) terminalClass = "FAILED_DIAGNOSTIC_PATH";
    else if (holdCount) terminalClass = "HELD_DIAGNOSTIC_PATH";
    else if (missing.length) terminalClass = "INCOMPLETE_DIAGNOSTIC_PATH";

    var reportability = "REPORTABLE_LIMITED_DIAGNOSTIC";
    if (terminalClass === "COMPLETE_DIAGNOSTIC_PATH") reportability = "REPORTABLE_COMPLETE_DIAGNOSTIC";
    if (terminalClass === "INCOMPLETE_DIAGNOSTIC_PATH") reportability = "REPORTABLE_INCOMPLETE_DIAGNOSTIC";
    if (terminalClass.indexOf("ERROR") === 0) reportability = "REPORTABLE_ERROR_DIAGNOSTIC";

    return deepFreeze({
      receipts: clonePlain(receipts, []),
      receiptCount: receipts.length,
      missingStations: missing,
      passCount: passCount,
      holdCount: holdCount,
      failCount: failCount,
      conflictCount: conflictCount,
      errorCount: errorCount,
      firstHeld: clonePlain(firstHeld, []),
      firstFailed: clonePlain(firstFailed, []),
      firstConflict: clonePlain(firstConflict, []),
      firstError: clonePlain(firstError, []),
      terminalClass: terminalClass,
      reportability: reportability
    });
  }

  function recommendedAction(summary) {
    if (summary.firstError) return "INSPECT_ERROR_SOURCE";
    if (summary.firstConflict) return "RECONCILE_CONFLICT_SOURCE";
    if (summary.firstFailed) return "REPAIR_OR_RENEW_FAILED_OWNER_AFTER_SEPARATE_AUTHORIZATION";
    if (summary.firstHeld) return "PROVIDE_REQUIRED_EVIDENCE_OR_OWNER";
    if (summary.missingStations.length) return "COMPLETE_MISSING_DIAGNOSTIC_STATIONS";
    return "DIAGNOSTIC_PATH_COMPLETE_PROCEED_TO_SEPARATE_ENGINE_REVIEW";
  }

  function ownerFromReceipt(receipt) {
    if (isPlainObject(receipt) && isPlainObject(receipt.recommendedOwner)) {
      return clonePlain(receipt.recommendedOwner, []);
    }

    return {
      ownerType: "UNKNOWN",
      subjectId: null,
      contract: null,
      file: null,
      component: null
    };
  }

  function executeCycleStation(request) {
    var validation = validateStationRequest(request);
    var summary = summarizeReceipts(request || {});

    var primaryStop =
      summary.firstError ||
      summary.firstConflict ||
      summary.firstFailed ||
      summary.firstHeld ||
      null;

    var status = "PASS";
    var completed = true;
    var handoffEligible = true;
    var textSummary = "RAIL_TERMINAL_SYNTHESIS_COMPLETE";

    if (!validation.passed) {
      status = "HOLD";
      completed = false;
      handoffEligible = false;
      textSummary = "RAIL_TERMINAL_SYNTHESIS_HELD_REQUEST_INVALID";
    } else if (summary.errorCount) {
      status = "ERROR";
      completed = false;
      handoffEligible = false;
      textSummary = "RAIL_TERMINAL_SYNTHESIS_ERROR_REPORTED";
    } else if (summary.conflictCount) {
      status = "CONFLICT";
      completed = false;
      handoffEligible = false;
      textSummary = "RAIL_TERMINAL_SYNTHESIS_CONFLICT_REPORTED";
    } else if (summary.failCount) {
      status = "FAIL";
      completed = false;
      handoffEligible = false;
      textSummary = "RAIL_TERMINAL_SYNTHESIS_FAILURE_REPORTED";
    } else if (summary.holdCount || summary.missingStations.length) {
      status = "HOLD";
      completed = false;
      handoffEligible = false;
      textSummary = "RAIL_TERMINAL_SYNTHESIS_HELD_OR_INCOMPLETE";
    }

    var owner = ownerFromReceipt(primaryStop);

    var observations = [
      {
        id: "RAIL_RECEIPT_LEDGER_SUMMARY",
        kind: "DERIVED",
        receiptCount: summary.receiptCount,
        passCount: summary.passCount,
        holdCount: summary.holdCount,
        failCount: summary.failCount,
        conflictCount: summary.conflictCount,
        errorCount: summary.errorCount,
        missingStations: summary.missingStations
      },
      {
        id: "RAIL_READ_CLASSIFICATION",
        kind: "DERIVED",
        reportability: summary.reportability,
        evidenceStatus:
          status === "PASS" ? "ADMITTED_COMPLETE" : "LIMITED_OR_INTERRUPTED",
        admissionStatus:
          status === "PASS" ? "ADMITTED" : "HELD_OR_REJECTED",
        diagnosticStatus: status,
        diagnosticPassProvesReady: false,
        railSynthesisProvesReadiness: false
      },
      {
        id: "RAIL_RESTITUTION_SUMMARY",
        kind: "DERIVED",
        terminalClass: summary.terminalClass,
        recommendedAction: recommendedAction(summary),
        recommendedOwner: owner
      }
    ];

    var receipt = {
      schema: RECEIPT_SCHEMA,
      cycleId: safeString(request && request.cycleId, "UNKNOWN"),
      position: CYCLE_POSITION,
      stationId: STATION_ID,

      contract: CONTRACT,
      version: VERSION,
      file: FILE,

      status: status,
      completed: completed,
      handoffEligible: handoffEligible,

      summary: textSummary,

      observations: observations,

      evidence: [
        {
          id: "RAIL_REQUEST_HASH",
          kind: "DERIVED",
          hash: hash(request || {})
        },
        {
          id: "RAIL_LEDGER_HASH",
          kind: "DERIVED",
          hash: hash(summary.receipts)
        },
        {
          id: "RAIL_SYNTHESIS_HASH",
          kind: "DERIVED",
          hash: hash(observations)
        },
        {
          id: "RAIL_VALIDATION",
          kind: "DERIVED",
          passed: validation.passed,
          issueCount: validation.issues.length
        }
      ],

      issues: validation.issues,

      firstHeldCoordinate:
        status === "HOLD"
          ? (
              primaryStop &&
              primaryStop.firstHeldCoordinate
                ? primaryStop.firstHeldCoordinate
                : "F89:RAIL_TERMINAL_SYNTHESIS"
            )
          : null,

      firstFailedCoordinate:
        status === "FAIL"
          ? (
              primaryStop &&
              primaryStop.firstFailedCoordinate
                ? primaryStop.firstFailedCoordinate
                : "F89:RAIL_TERMINAL_SYNTHESIS"
            )
          : null,

      firstConflictCoordinate:
        status === "CONFLICT"
          ? (
              primaryStop &&
              primaryStop.firstConflictCoordinate
                ? primaryStop.firstConflictCoordinate
                : "F89:RAIL_TERMINAL_SYNTHESIS"
            )
          : null,

      recommendedOwner: owner,

      generatedAt: nowIso(),
      receiptHash: null,

      terminalSynthesis: {
        newsReturn: true,
        northReturn: true,
        fibonacci: FIBONACCI,
        terminalClass: summary.terminalClass,
        reportability: summary.reportability,
        recommendedAction: recommendedAction(summary),
        missingStations: summary.missingStations
      },

      noClaims: NO_CLAIMS
    };

    receipt.receiptHash = hash(receipt);
    return deepFreeze(receipt);
  }

  function getDefinitionReceipt() {
    var definition = {
      receipt: RECEIPT,
      contract: CONTRACT,
      version: VERSION,
      versionLabel: VERSION_LABEL,
      file: FILE,
      stationId: STATION_ID,
      cyclePosition: CYCLE_POSITION,
      fibonacci: FIBONACCI,
      news: NEWS,
      requestSchema: REQUEST_SCHEMA,
      receiptSchema: RECEIPT_SCHEMA,
      exactInterface: [
        "CONTRACT",
        "VERSION",
        "FILE",
        "STATION_ID",
        "CYCLE_POSITION",
        "getDefinitionReceipt",
        "executeCycleStation"
      ],
      role:
        "Position 9 terminal rail synthesis. NORTH_RETURN. READ classification, first-held/failed/conflict/error reporting, restitution summary, and next-action recommendation.",
      quietLoad: true,
      threeDimensionalNative: true,
      northReturn: true,
      railSynthesisProvesReadiness: false,
      railSynthesisAuthorizesRepair: false,
      noClaims: NO_CLAIMS
    };

    definition.definitionHash = hash(definition);
    definition.generatedAt = nowIso();

    return deepFreeze(definition);
  }

  function getStatus() {
    return deepFreeze({
      contract: CONTRACT,
      version: VERSION,
      file: FILE,
      stationId: STATION_ID,
      cyclePosition: CYCLE_POSITION,
      fibonacci: FIBONACCI,
      news: NEWS,
      northReturn: true,
      loaded: true,
      readyForExplicitRegistration: true,
      threeDimensionalNative: true,
      noClaims: NO_CLAIMS
    });
  }

  function buildApi() {
    return deepFreeze({
      CONTRACT: CONTRACT,
      RECEIPT: RECEIPT,
      VERSION: VERSION,
      VERSION_LABEL: VERSION_LABEL,
      FILE: FILE,
      STATION_ID: STATION_ID,
      CYCLE_POSITION: CYCLE_POSITION,
      FIBONACCI: FIBONACCI,
      NEWS: NEWS,

      getDefinitionReceipt: getDefinitionReceipt,
      executeCycleStation: executeCycleStation,
      getStatus: getStatus,

      validateStationRequest: validateStationRequest,
      clone: function exposedClone(value) {
        return deepFreeze(clonePlain(value, []));
      },
      hash: hash,

      noClaims: NO_CLAIMS
    });
  }

  function ensureNamespace(name) {
    if (!root || typeof root !== "object") return null;
    if (!root[name] || typeof root[name] !== "object") root[name] = {};
    return root[name];
  }

  function publish(api) {
    if (!root || typeof root !== "object") return api;

    var existing = root.AUDRALIA_DIAGNOSTIC_RAIL;

    if (existing && existing.CONTRACT !== CONTRACT) {
      root.AUDRALIA_DIAGNOSTIC_RAIL_INSTALLATION_CONFLICT =
        deepFreeze({
          contract: CONTRACT,
          file: FILE,
          status: "CONFLICT",
          reason: "PRIMARY_GLOBAL_OCCUPIED_BY_INCOMPATIBLE_AUTHORITY",
          generatedAt: nowIso()
        });
      return api;
    }

    root.AUDRALIA_DIAGNOSTIC_RAIL = api;

    var namespace = ensureNamespace("AUDRALIA");
    if (namespace) namespace.diagnosticRail = api;

    root.AUDRALIA_DIAGNOSTIC_RAIL_RECEIPT = getDefinitionReceipt();

    root.__AUDRALIA_DIAGNOSTIC_RAIL_LOADED__ = true;
    root.__AUDRALIA_DIAGNOSTIC_RAIL_STATION_ID__ = STATION_ID;
    root.__AUDRALIA_DIAGNOSTIC_RAIL_VERSION__ = VERSION;

    return api;
  }

  var API = buildApi();
  publish(API);

  if (typeof module !== "undefined" && module.exports) {
    module.exports = API;
  }
})(
  typeof window !== "undefined"
    ? window
    : typeof globalThis !== "undefined"
      ? globalThis
      : this
);

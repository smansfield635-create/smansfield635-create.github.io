// /assets/audralia/audralia.diagnostic.rail.js
// AUDRALIA_DIAGNOSTIC_RAIL_ENGINE_BRIDGE_TERMINAL_SYNTHESIS_F89_3D_TNT_v3
// Full-file replacement.
// Quiet-load, dependency-free, 3D-native diagnostic rail.
// Position 9 terminal synthesis + engine bridge.
// Bridges /assets/audralia diagnostic track with runtime/product/DGB engine receipts.
// Does not mutate, repair, authorize production, validate readiness, render, or claim visual pass.

(function audraliaDiagnosticRailEngineBridgeTerminalSynthesisF893DV3(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);

  var CONTRACT = "AUDRALIA_DIAGNOSTIC_RAIL_ENGINE_BRIDGE_TERMINAL_SYNTHESIS_F89_3D_TNT_v3";
  var RECEIPT = "AUDRALIA_DIAGNOSTIC_RAIL_ENGINE_BRIDGE_TERMINAL_SYNTHESIS_F89_3D_RECEIPT_v3";
  var PREVIOUS_CONTRACT = "AUDRALIA_DIAGNOSTIC_RAIL_ENGINE_BRIDGE_TERMINAL_SYNTHESIS_F89_3D_TNT_v2";
  var LEGACY_CONTRACT = "AUDRALIA_DIAGNOSTIC_RAIL_TERMINAL_SYNTHESIS_F89_3D_TNT_v1";

  var VERSION = "3.0.0";
  var VERSION_LABEL = "2026-06-22.audralia-diagnostic-rail-engine-bridge-terminal-synthesis-f89-3d-v3";
  var FILE = "/assets/audralia/audralia.diagnostic.rail.js";

  var STATION_ID = "RAIL_TERMINAL_SYNTHESIS";
  var CYCLE_POSITION = 9;
  var FIBONACCI = "F89";
  var NEWS = "TERMINAL_RAIL";
  var RETURN_DIRECTION = "NORTH_RETURN";

  var REQUEST_SCHEMA = "AUDRALIA_DIAGNOSTIC_STATION_EXECUTION_REQUEST_v1";
  var RECEIPT_SCHEMA = "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_STATION_RECEIPT_v1";

  var AUDRALIA_FILES = Object.freeze({
    northConductor: "/assets/audralia/audralia.diagnostic.north.conductor.js",
    probeNorth: "/assets/audralia/audralia.diagnostic.probe.north.js",
    probeEast: "/assets/audralia/audralia.diagnostic.probe.east.js",
    east: "/assets/audralia/audralia.diagnostic.east.js",
    probeCanvas: "/assets/audralia/audralia.diagnostic.probe.canvas.surface.truth.js",
    probeWest: "/assets/audralia/audralia.diagnostic.probe.west.js",
    west: "/assets/audralia/audralia.diagnostic.west.js",
    probeSouth: "/assets/audralia/audralia.diagnostic.probe.south.js",
    south: "/assets/audralia/audralia.diagnostic.south.js",
    southSurfacePointer: "/assets/audralia/audralia.diagnostic.south.surface.pointer.js",
    rail: FILE,
    planet: "/assets/audralia/audralia.planet.js"
  });

  var ENGINE_FILES = Object.freeze({
    dgbContract: "/assets/engine/dgb.engine.contract.js",
    dgbEngine: "/assets/engine/dgb.engine.js",
    dgbSubjects: "/assets/engine/dgb.engine.subjects.js",
    worldEngine: "/assets/engine/diamond-gate-world-engine.js",
    browserRender: "/assets/engine/diamond-gate-browser-render.js",
    runtimeNorth: "/assets/lab/runtime-table.js",
    runtimeEast: "/assets/lab/runtime-table.east.js",
    runtimeWest: "/assets/lab/runtime-table.west.js",
    runtimeSouth: "/assets/lab/runtime-table.south.js",
    productF34: "/assets/lab/product-engine.js",
    expressionF55: "/assets/lab/product-engine.ue5-expression.js",
    registryF89: "/assets/lab/product-engine.registry.js",
    marketF144: "/assets/lab/product-engine.market.js"
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
    diagnosticPassProvesReady: false,
    railSynthesisProvesReadiness: false,
    railSynthesisAuthorizesRepair: false,
    targetReadyProvesRuntimeReady: false,
    bridgeObservedEnginesProveReadiness: false,
    readyClaimed: false,
    verifiedClaimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webGPU: false,
    publicSuperiorityClaim: false,
    publicComparisonClaimAllowed: false
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

  function isFunction(value) {
    return typeof value === "function";
  }

  function safeString(value, fallback) {
    if (fallback === undefined) fallback = null;
    if (value === undefined || value === null) return fallback;
    return String(value).slice(0, LIMITS.maxStringLength);
  }

  function safeBool(value, fallback) {
    if (fallback === undefined) fallback = false;
    if (typeof value === "boolean") return value;
    if (value === "true" || value === "1" || value === 1) return true;
    if (value === "false" || value === "0" || value === 0) return false;
    return fallback;
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

  function clonePlain(value, seen, depth) {
    if (depth === undefined) depth = 0;
    if (depth > LIMITS.maxDepth) return null;
    if (value === null || typeof value === "string" || typeof value === "boolean") return value;
    if (isFiniteNumber(value)) return value;

    if (
      value === undefined ||
      typeof value === "function" ||
      typeof value === "symbol" ||
      typeof value === "bigint" ||
      typeof value === "number"
    ) {
      return null;
    }

    if (!value || typeof value !== "object") return null;
    if (!Array.isArray(value) && !isPlainObject(value)) return null;

    var memory = seen || [];
    if (memory.indexOf(value) !== -1) return null;
    memory.push(value);

    if (Array.isArray(value)) {
      return value.slice(0, LIMITS.maxArrayLength).map(function map(entry) {
        return clonePlain(entry, memory, depth + 1);
      });
    }

    var output = {};
    Object.keys(value).slice(0, LIMITS.maxObjectKeys).forEach(function each(key) {
      try {
        output[String(key).slice(0, LIMITS.maxStringLength)] =
          clonePlain(value[key], memory, depth + 1);
      } catch (_error) {
        output[String(key)] = null;
      }
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
    var text = stableStringify(clonePlain(value, [], 0));
    var h = 0x811c9dc5;
    for (var i = 0; i < text.length; i += 1) {
      h ^= text.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
      h >>>= 0;
    }
    return "fnv1a32:" + ("00000000" + h.toString(16)).slice(-8);
  }

  function issue(code, path, detail) {
    return {
      code: safeString(code || "ISSUE", "ISSUE"),
      path: safeString(path || "$", "$"),
      detail: safeString(detail || code || "ISSUE", "ISSUE").slice(0, 512)
    };
  }

  function readPath(path) {
    var parts = String(path || "").split(".").filter(Boolean);
    var cursor = root;

    for (var i = 0; i < parts.length; i += 1) {
      if (!cursor || cursor[parts[i]] === undefined || cursor[parts[i]] === null) return null;
      try { cursor = cursor[parts[i]]; } catch (_error) { return null; }
    }

    return cursor || null;
  }

  function firstGlobal(names) {
    for (var i = 0; i < names.length; i += 1) {
      var found = readPath(names[i]);
      if (found) return found;
    }
    return null;
  }

  function readReceipt(authority) {
    if (!authority || typeof authority !== "object") return {};

    try {
      if (isFunction(authority.getReceiptLight)) {
        var light = authority.getReceiptLight();
        if (light && typeof light === "object") return clonePlain(light, [], 0) || {};
      }

      if (isFunction(authority.getReceipt)) {
        var full = authority.getReceipt();
        if (full && typeof full === "object") return clonePlain(full, [], 0) || {};
      }

      if (isFunction(authority.getStatus)) {
        var status = authority.getStatus();
        if (status && typeof status === "object") return clonePlain(status, [], 0) || {};
      }
    } catch (error) {
      return {
        status: "ERROR",
        error: error && error.message ? String(error.message) : String(error)
      };
    }

    if (authority.receipt || authority.RECEIPT || authority.contract || authority.CONTRACT || authority.version || authority.VERSION || authority.file || authority.FILE) {
      return clonePlain(authority, [], 0) || {};
    }

    return {};
  }

  function detectForbiddenClaim(packet) {
    var text;
    try { text = JSON.stringify(packet || {}); }
    catch (_error) { text = String(packet || ""); }

    return Boolean(
      safeBool(packet && packet.generatedImage, false) ||
      safeBool(packet && packet.graphicBox, false) ||
      safeBool(packet && packet.webGL, false) ||
      safeBool(packet && packet.webGPU, false) ||
      safeBool(packet && packet.visualPassClaimed, false) ||
      safeBool(packet && packet.finalVisualPassClaimed, false) ||
      safeBool(packet && packet.publicSuperiorityClaim, false) ||
      safeBool(packet && packet.publicComparisonClaimAllowed, false) ||
      text.indexOf('"generatedImage":true') !== -1 ||
      text.indexOf('"graphicBox":true') !== -1 ||
      text.indexOf('"webGL":true') !== -1 ||
      text.indexOf('"webGPU":true') !== -1 ||
      text.indexOf('"visualPassClaimed":true') !== -1 ||
      text.indexOf('"finalVisualPassClaimed":true') !== -1 ||
      text.indexOf('"publicSuperiorityClaim":true') !== -1
    );
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
        typeof item === "bigint" ||
        typeof item === "number"
      ) {
        issues.push(issue("NON_PLAIN_VALUE_FORBIDDEN", path));
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
          walk(entry, path + "[" + index + "]", depth + 1, seen.slice());
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

        walk(item[key], path + "." + key, depth + 1, seen.slice());
      });
    }

    walk(value, "$", 0, []);

    return deepFreeze({
      passed: issues.length === 0,
      issues: deepFreeze(issues)
    });
  }

  function validateStationRequest(request) {
    var plain = validatePlainData(request);
    var issues = plain.issues.slice();

    if (!isPlainObject(request)) {
      issues.push(issue("REQUEST_OBJECT_REQUIRED", "$"));
      return deepFreeze({ passed: false, issues: deepFreeze(issues) });
    }

    if (request.schema !== REQUEST_SCHEMA) issues.push(issue("REQUEST_SCHEMA_MISMATCH", "$.schema"));
    if (request.position !== CYCLE_POSITION) issues.push(issue("REQUEST_POSITION_MISMATCH", "$.position"));
    if (request.stationId !== STATION_ID) issues.push(issue("REQUEST_STATION_ID_MISMATCH", "$.stationId"));
    if (!safeString(request.cycleId, "")) issues.push(issue("REQUEST_CYCLE_ID_REQUIRED", "$.cycleId"));
    if (!Array.isArray(request.priorStationReceipts)) issues.push(issue("PRIOR_STATION_RECEIPTS_ARRAY_REQUIRED", "$.priorStationReceipts"));

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
    var receipts = Array.isArray(request && request.priorStationReceipts)
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
    var receipts = Array.isArray(request && request.priorStationReceipts)
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
      receipts: clonePlain(receipts, [], 0),
      receiptCount: receipts.length,
      missingStations: missing,
      passCount: passCount,
      holdCount: holdCount,
      failCount: failCount,
      conflictCount: conflictCount,
      errorCount: errorCount,
      firstHeld: clonePlain(firstByStatus(receipts, "HOLD"), [], 0),
      firstFailed: clonePlain(firstByStatus(receipts, "FAIL"), [], 0),
      firstConflict: clonePlain(firstByStatus(receipts, "CONFLICT"), [], 0),
      firstError: clonePlain(firstByStatus(receipts, "ERROR"), [], 0),
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
      return clonePlain(receipt.recommendedOwner, [], 0);
    }

    if (isPlainObject(receipt)) {
      return {
        ownerType: safeString(receipt.ownerType, "UNKNOWN"),
        subjectId: safeString(receipt.stationId || receipt.subjectId, null),
        contract: safeString(receipt.contract, null),
        file: safeString(receipt.file, null),
        component: safeString(receipt.component, null)
      };
    }

    return {
      ownerType: "UNKNOWN",
      subjectId: null,
      contract: null,
      file: null,
      component: null
    };
  }

  function engineAuthorities() {
    return [
      {
        id: "DGB_CONTRACT",
        file: ENGINE_FILES.dgbContract,
        names: [
          "DGB_ENGINE_CONTRACT",
          "DIAMOND_GATE_ENGINE_CONTRACT",
          "DGB_INTERACTIVE_RUNTIME_ENGINE_CONTRACT",
          "AUDRALIA_DGB_ENGINE_CONTRACT",
          "DEXTER_LAB.dgbEngineContract",
          "HEARTH.dgbEngineContract"
        ]
      },
      {
        id: "DGB_ENGINE",
        file: ENGINE_FILES.dgbEngine,
        names: [
          "DGB_ENGINE",
          "DIAMOND_GATE_BRIDGE_ENGINE",
          "DGB_INTERACTIVE_RUNTIME_ENGINE",
          "AUDRALIA_DGB_ENGINE",
          "DEXTER_LAB.dgbEngine",
          "HEARTH.dgbEngine"
        ]
      },
      {
        id: "DGB_SUBJECTS",
        file: ENGINE_FILES.dgbSubjects,
        names: [
          "DGB_ENGINE_SUBJECTS",
          "DIAMOND_GATE_ENGINE_SUBJECTS",
          "DGB_ENGINE_AND_AUTHORITY_REGISTRY",
          "AUDRALIA_DGB_ENGINE_SUBJECTS",
          "DEXTER_LAB.dgbEngineSubjects",
          "HEARTH.dgbEngineSubjects"
        ]
      },
      {
        id: "WORLD_ENGINE",
        file: ENGINE_FILES.worldEngine,
        names: [
          "DIAMOND_GATE_WORLD_ENGINE",
          "DGB_WORLD_ENGINE",
          "DEXTER_LAB.worldEngine",
          "HEARTH.worldEngine"
        ]
      },
      {
        id: "BROWSER_RENDER",
        file: ENGINE_FILES.browserRender,
        names: [
          "DIAMOND_GATE_BROWSER_RENDER",
          "DGB_BROWSER_RENDER",
          "DEXTER_LAB.browserRender",
          "HEARTH.browserRender"
        ]
      },
      {
        id: "RUNTIME_NORTH",
        file: ENGINE_FILES.runtimeNorth,
        names: [
          "LAB_RUNTIME_TABLE",
          "LAB_RUNTIME_TABLE_NORTH",
          "RUNTIME_TABLE",
          "DEXTER_LAB.runtimeTable",
          "HEARTH.runtimeTable"
        ]
      },
      {
        id: "RUNTIME_EAST_F3",
        file: ENGINE_FILES.runtimeEast,
        names: [
          "LAB_RUNTIME_TABLE_EAST",
          "LAB_RUNTIME_TABLE_EAST_F3",
          "RUNTIME_TABLE_EAST",
          "EAST_INTAKE_VALVE",
          "DEXTER_LAB.runtimeTableEast",
          "HEARTH.runtimeTableEast"
        ]
      },
      {
        id: "RUNTIME_WEST_F5",
        file: ENGINE_FILES.runtimeWest,
        names: [
          "LAB_RUNTIME_TABLE_WEST",
          "LAB_RUNTIME_TABLE_WEST_F5",
          "RUNTIME_TABLE_WEST",
          "WEST_PRESSURE_VALVE",
          "DEXTER_LAB.runtimeTableWest",
          "HEARTH.runtimeTableWest"
        ]
      },
      {
        id: "RUNTIME_SOUTH_F8",
        file: ENGINE_FILES.runtimeSouth,
        names: [
          "LAB_RUNTIME_TABLE_SOUTH",
          "LAB_RUNTIME_TABLE_SOUTH_F8",
          "RUNTIME_TABLE_SOUTH",
          "SOUTH_PROOF_RETURN",
          "DEXTER_LAB.runtimeTableSouth",
          "HEARTH.runtimeTableSouth"
        ]
      },
      {
        id: "PRODUCT_F34",
        file: ENGINE_FILES.productF34,
        names: [
          "LAB_PRODUCT_ENGINE",
          "LAB_PRODUCT_ENGINE_F34",
          "PRODUCT_ENGINE",
          "PRODUCT_ENGINE_F34",
          "DEXTER_LAB.productEngine",
          "HEARTH.productEngine"
        ]
      },
      {
        id: "EXPRESSION_F55",
        file: ENGINE_FILES.expressionF55,
        names: [
          "LAB_PRODUCT_ENGINE_UE5_EXPRESSION",
          "LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55",
          "PRODUCT_ENGINE_UE5_EXPRESSION",
          "DEXTER_LAB.productEngineUE5Expression",
          "HEARTH.productEngineUE5Expression"
        ]
      },
      {
        id: "REGISTRY_F89",
        file: ENGINE_FILES.registryF89,
        names: [
          "LAB_PRODUCT_ENGINE_REGISTRY",
          "LAB_PRODUCT_ENGINE_REGISTRY_F89",
          "PRODUCT_ENGINE_REGISTRY",
          "PROJECT_REGISTRY_CONDUCTOR",
          "DEXTER_LAB.productEngineRegistry",
          "HEARTH.productEngineRegistry"
        ]
      },
      {
        id: "MARKET_F144",
        file: ENGINE_FILES.marketF144,
        names: [
          "LAB_PRODUCT_ENGINE_MARKET",
          "LAB_PRODUCT_ENGINE_MARKET_F144",
          "PRODUCT_ENGINE_MARKET",
          "MARKET_F144_READINESS_CONDUCTOR",
          "DEXTER_LAB.productEngineMarket",
          "HEARTH.productEngineMarket"
        ]
      }
    ];
  }

  function discoverEngineReceipts() {
    var records = engineAuthorities().map(function map(def) {
      var authority = firstGlobal(def.names);
      var receipt = readReceipt(authority);
      var present = Boolean(authority);
      var forbidden = detectForbiddenClaim(receipt);

      return {
        id: def.id,
        file: def.file,
        present: present,
        receiptObserved: Boolean(receipt && Object.keys(receipt).length),
        contract: safeString(receipt.contract || receipt.CONTRACT || "", ""),
        receipt: safeString(receipt.receipt || receipt.RECEIPT || "", ""),
        version: safeString(receipt.version || receipt.VERSION || "", ""),
        statusToken: safeString(receipt.status || receipt.STATUS || "", ""),
        activeFibonacci: safeString(receipt.activeFibonacci || receipt.fibonacci || "", ""),
        status: forbidden ? "FORBIDDEN_CLAIM" : present ? "OBSERVED" : "NOT_LOADED",
        forbiddenClaimDetected: forbidden,
        receiptHash: hash(receipt || {})
      };
    });

    var presentCount = records.filter(function count(item) { return item.present; }).length;
    var forbiddenCount = records.filter(function count(item) { return item.forbiddenClaimDetected; }).length;

    return deepFreeze({
      records: deepFreeze(records),
      engineRecordCount: records.length,
      enginePresentCount: presentCount,
      engineMissingCount: records.length - presentCount,
      forbiddenClaimCount: forbiddenCount,
      bridgeStatus: forbiddenCount
        ? "BLOCKED_FORBIDDEN_CLAIM"
        : presentCount
          ? "OBSERVED_PARTIAL_OR_COMPLETE"
          : "NO_ENGINE_GLOBALS_OBSERVED",
      readinessClaimed: false,
      bridgeObservedEnginesProveReadiness: false,
      hash: hash(records)
    });
  }

  function buildBridgeReceipt(extra) {
    var discovered = discoverEngineReceipts();

    var receipt = {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      legacyContract: LEGACY_CONTRACT,
      version: VERSION,
      versionLabel: VERSION_LABEL,
      file: FILE,
      bridgeType: "AUDRALIA_DIAGNOSTIC_TRACK_TO_RUNTIME_PRODUCT_AND_DGB_ENGINE_BRIDGE",
      stationId: STATION_ID,
      cyclePosition: CYCLE_POSITION,
      fibonacci: FIBONACCI,
      news: NEWS,
      returnDirection: RETURN_DIRECTION,
      audraliaFiles: AUDRALIA_FILES,
      engineFiles: ENGINE_FILES,
      discoveredEngines: discovered,
      bridgeReadsOnly: true,
      bridgeMutatesEngines: false,
      bridgeAuthorizesReadiness: false,
      bridgeAuthorizesProduction: false,
      detail: clonePlain(extra || {}, [], 0),
      noClaims: NO_CLAIMS,
      generatedAt: nowIso()
    };

    receipt.bridgeHash = hash(receipt);
    return deepFreeze(receipt);
  }

  function executeCycleStation(request) {
    var validation = validateStationRequest(request);
    var summary = summarizeReceipts(request || {});
    var engineBridge = discoverEngineReceipts();

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
        evidenceStatus: status === "PASS" ? "ADMITTED_COMPLETE" : "LIMITED_OR_INTERRUPTED",
        admissionStatus: status === "PASS" ? "ADMITTED" : "HELD_OR_REJECTED",
        diagnosticStatus: status,
        diagnosticPassProvesReady: false,
        railSynthesisProvesReadiness: false
      },
      {
        id: "RAIL_ENGINE_BRIDGE_SUMMARY",
        kind: "DERIVED",
        bridgeStatus: engineBridge.bridgeStatus,
        engineRecordCount: engineBridge.engineRecordCount,
        enginePresentCount: engineBridge.enginePresentCount,
        engineMissingCount: engineBridge.engineMissingCount,
        forbiddenClaimCount: engineBridge.forbiddenClaimCount,
        engineBridgeProvesReadiness: false
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
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      legacyContract: LEGACY_CONTRACT,
      version: VERSION,
      file: FILE,

      status: status,
      completed: completed,
      handoffEligible: handoffEligible,
      summary: textSummary,

      observations: observations,
      engineBridge: engineBridge,

      evidence: [
        { id: "RAIL_REQUEST_HASH", kind: "DERIVED", hash: hash(request || {}) },
        { id: "RAIL_LEDGER_HASH", kind: "DERIVED", hash: hash(summary.receipts) },
        { id: "RAIL_SYNTHESIS_HASH", kind: "DERIVED", hash: hash(observations) },
        { id: "RAIL_ENGINE_BRIDGE_HASH", kind: "DERIVED", hash: engineBridge.hash },
        { id: "RAIL_VALIDATION", kind: "DERIVED", passed: validation.passed, issueCount: validation.issues.length }
      ],

      issues: validation.issues,

      firstHeldCoordinate:
        status === "HOLD"
          ? primaryStop && primaryStop.firstHeldCoordinate
            ? primaryStop.firstHeldCoordinate
            : "F89:RAIL_TERMINAL_SYNTHESIS"
          : null,

      firstFailedCoordinate:
        status === "FAIL"
          ? primaryStop && primaryStop.firstFailedCoordinate
            ? primaryStop.firstFailedCoordinate
            : "F89:RAIL_TERMINAL_SYNTHESIS"
          : null,

      firstConflictCoordinate:
        status === "CONFLICT"
          ? primaryStop && primaryStop.firstConflictCoordinate
            ? primaryStop.firstConflictCoordinate
            : "F89:RAIL_TERMINAL_SYNTHESIS"
          : null,

      recommendedOwner: owner,

      terminalSynthesis: {
        news: NEWS,
        returnDirection: RETURN_DIRECTION,
        northReturn: true,
        fibonacci: FIBONACCI,
        terminalClass: summary.terminalClass,
        reportability: summary.reportability,
        recommendedAction: recommendedAction(summary),
        missingStations: summary.missingStations
      },

      noClaims: NO_CLAIMS,
      generatedAt: nowIso(),
      receiptHash: null
    };

    receipt.receiptHash = hash(receipt);
    return deepFreeze(receipt);
  }

  function getDefinitionReceipt() {
    var definition = {
      receipt: RECEIPT,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      legacyContract: LEGACY_CONTRACT,
      version: VERSION,
      versionLabel: VERSION_LABEL,
      file: FILE,
      stationId: STATION_ID,
      cyclePosition: CYCLE_POSITION,
      fibonacci: FIBONACCI,
      news: NEWS,
      returnDirection: RETURN_DIRECTION,
      requestSchema: REQUEST_SCHEMA,
      receiptSchema: RECEIPT_SCHEMA,
      role: "Position 9 terminal rail synthesis plus bridge between /assets/audralia diagnostic track and runtime/product/DGB engine receipts.",
      quietLoad: true,
      threeDimensionalNative: true,
      terminalRail: true,
      northReturn: true,
      engineBridge: true,
      audraliaFiles: AUDRALIA_FILES,
      engineFiles: ENGINE_FILES,
      exactInterface: [
        "CONTRACT",
        "RECEIPT",
        "VERSION",
        "FILE",
        "STATION_ID",
        "CYCLE_POSITION",
        "FIBONACCI",
        "NEWS",
        "RETURN_DIRECTION",
        "getDefinitionReceipt",
        "executeCycleStation",
        "discoverEngineReceipts",
        "buildBridgeReceipt",
        "getStatus"
      ],
      railSynthesisProvesReadiness: false,
      railSynthesisAuthorizesRepair: false,
      noClaims: NO_CLAIMS,
      generatedAt: nowIso()
    };

    definition.definitionHash = hash(definition);
    return deepFreeze(definition);
  }

  function getStatus() {
    return deepFreeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      legacyContract: LEGACY_CONTRACT,
      version: VERSION,
      file: FILE,
      stationId: STATION_ID,
      cyclePosition: CYCLE_POSITION,
      fibonacci: FIBONACCI,
      news: NEWS,
      returnDirection: RETURN_DIRECTION,
      terminalRail: true,
      northReturn: true,
      loaded: true,
      readyForExplicitRegistration: true,
      threeDimensionalNative: true,
      engineBridge: true,
      noClaims: NO_CLAIMS
    });
  }

  function ensureNamespace(name) {
    if (!root || typeof root !== "object") return null;
    if (!root[name] || typeof root[name] !== "object") root[name] = {};
    return root[name];
  }

  function buildApi() {
    return deepFreeze({
      CONTRACT: CONTRACT,
      RECEIPT: RECEIPT,
      PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
      LEGACY_CONTRACT: LEGACY_CONTRACT,
      VERSION: VERSION,
      VERSION_LABEL: VERSION_LABEL,
      FILE: FILE,
      STATION_ID: STATION_ID,
      CYCLE_POSITION: CYCLE_POSITION,
      FIBONACCI: FIBONACCI,
      NEWS: NEWS,
      RETURN_DIRECTION: RETURN_DIRECTION,
      AUDRALIA_FILES: AUDRALIA_FILES,
      ENGINE_FILES: ENGINE_FILES,

      getDefinitionReceipt: getDefinitionReceipt,
      executeCycleStation: executeCycleStation,
      getStatus: getStatus,

      validateStationRequest: validateStationRequest,
      discoverEngineReceipts: discoverEngineReceipts,
      buildBridgeReceipt: buildBridgeReceipt,

      clone: function exposedClone(value) {
        return deepFreeze(clonePlain(value, [], 0));
      },
      hash: hash,

      noClaims: NO_CLAIMS
    });
  }

  function publish(api) {
    if (!root || typeof root !== "object") return api;

    var existing = root.AUDRALIA_DIAGNOSTIC_RAIL;

    if (
      existing &&
      existing.CONTRACT &&
      existing.CONTRACT !== CONTRACT &&
      existing.CONTRACT !== PREVIOUS_CONTRACT &&
      existing.CONTRACT !== LEGACY_CONTRACT
    ) {
      root.AUDRALIA_DIAGNOSTIC_RAIL_INSTALLATION_CONFLICT = deepFreeze({
        contract: CONTRACT,
        previousContract: PREVIOUS_CONTRACT,
        legacyContract: LEGACY_CONTRACT,
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
    root.AUDRALIA_DIAGNOSTIC_RAIL_ENGINE_BRIDGE_RECEIPT = buildBridgeReceipt();

    root.__AUDRALIA_DIAGNOSTIC_RAIL_LOADED__ = true;
    root.__AUDRALIA_DIAGNOSTIC_RAIL_STATION_ID__ = STATION_ID;
    root.__AUDRALIA_DIAGNOSTIC_RAIL_VERSION__ = VERSION;
    root.__AUDRALIA_DIAGNOSTIC_RAIL_NEWS__ = NEWS;
    root.__AUDRALIA_DIAGNOSTIC_RAIL_RETURN_DIRECTION__ = RETURN_DIRECTION;
    root.__AUDRALIA_DIAGNOSTIC_RAIL_ENGINE_BRIDGE__ = true;
    root.__AUDRALIA_DIAGNOSTIC_RAIL_VISUAL_PASS_CLAIMED__ = false;
    root.__AUDRALIA_DIAGNOSTIC_RAIL_WEBGL__ = false;
    root.__AUDRALIA_DIAGNOSTIC_RAIL_PUBLIC_SUPERIORITY_CLAIM__ = false;

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

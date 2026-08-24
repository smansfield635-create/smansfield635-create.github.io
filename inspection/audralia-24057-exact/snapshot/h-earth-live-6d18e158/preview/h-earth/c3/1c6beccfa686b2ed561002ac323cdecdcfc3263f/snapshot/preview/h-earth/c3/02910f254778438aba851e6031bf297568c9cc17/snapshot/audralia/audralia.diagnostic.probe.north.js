// /assets/audralia/audralia.diagnostic.probe.north.js
// AUDRALIA_DIAGNOSTIC_PROBE_NORTH_INTAKE_F1_3D_TNT_v1
// Full-file replacement.
// Quiet-load, dependency-free, 3D-native North intake probe.
// Implements Position 1 for the Audralia nine-cycle diagnostic conductor.
// Owns subject, engine, construct, route, mode, and provenance intake.
// Does not inspect DOM, render, mutate production, repair files, or claim readiness.

(function audraliaDiagnosticProbeNorthIntakeF13D(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);

  var CONTRACT = "AUDRALIA_DIAGNOSTIC_PROBE_NORTH_INTAKE_F1_3D_TNT_v1";
  var RECEIPT = "AUDRALIA_DIAGNOSTIC_PROBE_NORTH_INTAKE_F1_3D_RECEIPT_v1";
  var VERSION = "1.0.0";
  var VERSION_LABEL = "2026-06-14.audralia-diagnostic-probe-north-intake-f1-3d-v1";
  var FILE = "/assets/audralia/audralia.diagnostic.probe.north.js";

  var STATION_ID = "NORTH_PROBE_INTAKE";
  var CYCLE_POSITION = 1;
  var FIBONACCI = "F1";
  var NEWS = "NORTH";

  var REQUEST_SCHEMA = "AUDRALIA_DIAGNOSTIC_STATION_EXECUTION_REQUEST_v1";
  var RECEIPT_SCHEMA = "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_STATION_RECEIPT_v1";

  var LIMITS = Object.freeze({
    maxStringLength: 12000,
    maxArrayLength: 377,
    maxObjectKeys: 233,
    maxDepth: 13,
    maxIssues: 89
  });

  var NO_CLAIMS = Object.freeze({
    engineAuthority: false,
    productionMutationAuthority: false,
    contractRewriteAuthority: false,
    routeMutationAuthority: false,
    rendererAuthority: false,
    canvasAuthority: false,
    webGLAuthority: false,
    webGPUAuthority: false,
    repairAuthorizationAuthority: false,
    fileAuthorizationAuthority: false,
    finalProductionVerdictAuthority: false,
    readyClaimed: false,
    verifiedClaimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webGPU: false
  });

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return null;
    }
  }

  function isFunction(value) {
    return typeof value === "function";
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
    if (value === null || typeof value === "string" || typeof value === "boolean") {
      return value;
    }

    if (isFiniteNumber(value)) return value;

    if (
      value === undefined ||
      typeof value === "number" ||
      typeof value === "function" ||
      typeof value === "symbol" ||
      typeof value === "bigint"
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
        return clonePlain(entry, memory);
      });
    }

    var output = {};
    var keys = [];

    try {
      keys = Object.keys(value).slice(0, LIMITS.maxObjectKeys);
    } catch (_error) {
      return null;
    }

    keys.forEach(function each(key) {
      try {
        output[String(key).slice(0, LIMITS.maxStringLength)] =
          clonePlain(value[key], memory);
      } catch (_error2) {
        output[String(key).slice(0, LIMITS.maxStringLength)] = null;
      }
    });

    return output;
  }

  function stableStringify(value) {
    if (value === null) return "null";
    if (typeof value === "string") return JSON.stringify(value);
    if (typeof value === "boolean") return value ? "true" : "false";
    if (isFiniteNumber(value)) return String(value);

    if (Array.isArray(value)) {
      return "[" + value.map(stableStringify).join(",") + "]";
    }

    if (isPlainObject(value)) {
      return "{" + Object.keys(value).sort().map(function keyLine(key) {
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

  function safeObject(value) {
    return isPlainObject(value) ? clonePlain(value, []) : {};
  }

  function validatePlainData(value) {
    var issues = [];

    function walk(item, path, depth, seen) {
      if (issues.length >= LIMITS.maxIssues) return;

      if (depth > LIMITS.maxDepth) {
        issues.push(issue("DEPTH_LIMIT_EXCEEDED", path));
        return;
      }

      if (
        item === null ||
        typeof item === "string" ||
        typeof item === "boolean" ||
        isFiniteNumber(item)
      ) {
        if (typeof item === "string" && item.length > LIMITS.maxStringLength) {
          issues.push(issue("STRING_LIMIT_EXCEEDED", path));
        }
        return;
      }

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

      var keys = Object.keys(item);

      if (keys.length > LIMITS.maxObjectKeys) {
        issues.push(issue("OBJECT_KEY_LIMIT_EXCEEDED", path));
        return;
      }

      keys.forEach(function eachKey(key) {
        var descriptor;

        try {
          descriptor = Object.getOwnPropertyDescriptor(item, key);
        } catch (_error) {
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

    if (!plain.passed) {
      issues = issues.concat(plain.issues);
    }

    if (!isPlainObject(request)) {
      issues.push(issue("REQUEST_OBJECT_REQUIRED", "$"));
      return deepFreeze({ passed: false, issues: deepFreeze(issues) });
    }

    if (request.schema !== REQUEST_SCHEMA) {
      issues.push(issue("REQUEST_SCHEMA_MISMATCH", "$.schema"));
    }

    if (request.position !== CYCLE_POSITION) {
      issues.push(issue("REQUEST_POSITION_MISMATCH", "$.position"));
    }

    if (request.stationId !== STATION_ID) {
      issues.push(issue("REQUEST_STATION_ID_MISMATCH", "$.stationId"));
    }

    if (!safeString(request.cycleId, "")) {
      issues.push(issue("REQUEST_CYCLE_ID_REQUIRED", "$.cycleId"));
    }

    if (!isPlainObject(request.subject)) {
      issues.push(issue("REQUEST_SUBJECT_OBJECT_REQUIRED", "$.subject"));
    }

    if (!isPlainObject(request.engine)) {
      issues.push(issue("REQUEST_ENGINE_OBJECT_REQUIRED", "$.engine"));
    }

    if (!isPlainObject(request.construct)) {
      issues.push(issue("REQUEST_CONSTRUCT_OBJECT_REQUIRED", "$.construct"));
    }

    return deepFreeze({
      passed: issues.length === 0,
      issues: deepFreeze(issues)
    });
  }

  function normalizeMode(value) {
    if (
      value === "CONSTRUCTION" ||
      value === "CALIBRATION" ||
      value === "RESTITUTION" ||
      value === "AUDIT"
    ) {
      return value;
    }

    return "AUDIT";
  }

  function classifyIntake(request, validation) {
    var observations = [];
    var issues = [];

    var subject = safeObject(request.subject);
    var engine = safeObject(request.engine);
    var construct = safeObject(request.construct);

    var subjectId = safeString(subject.subjectId, null);
    var subjectType = safeString(subject.subjectType, null);
    var constructId = safeString(construct.constructId, null);
    var route = safeString(construct.route, null);
    var engineFile = safeString(engine.file, null);
    var engineContract = safeString(engine.contract, null);

    observations.push({
      id: "NORTH_INTAKE_MODE",
      kind: "DECLARED",
      value: normalizeMode(request.mode)
    });

    observations.push({
      id: "NORTH_INTAKE_SUBJECT",
      kind: "DECLARED",
      subjectId: subjectId,
      subjectType: subjectType,
      contract: safeString(subject.contract, null),
      version: safeString(subject.version, null),
      file: safeString(subject.file, null)
    });

    observations.push({
      id: "NORTH_INTAKE_ENGINE",
      kind: "DECLARED",
      contract: engineContract,
      version: safeString(engine.version, null),
      file: engineFile
    });

    observations.push({
      id: "NORTH_INTAKE_CONSTRUCT",
      kind: "DECLARED",
      constructId: constructId,
      contract: safeString(construct.contract, null),
      version: safeString(construct.version, null),
      route: route,
      rootFile: safeString(construct.rootFile, null)
    });

    observations.push({
      id: "NORTH_INTAKE_PROVENANCE",
      kind: "DERIVED",
      cycleId: safeString(request.cycleId, null),
      priorLedgerHash: safeString(request.priorLedgerHash, null),
      parentHandoffPresent: isPlainObject(request.parentHandoff),
      terminalSynthesisMode: request.terminalSynthesisMode === true
    });

    if (!validation.passed) {
      issues = issues.concat(validation.issues);
    }

    if (!subjectId) {
      issues.push(issue("SUBJECT_ID_REQUIRED", "$.subject.subjectId"));
    }

    if (!constructId) {
      issues.push(issue("CONSTRUCT_ID_REQUIRED", "$.construct.constructId"));
    }

    if (route && route.indexOf("/showroom/globe/audralia") !== 0) {
      issues.push(issue("AUDRALIA_ROUTE_SCOPE_WARNING", "$.construct.route"));
    }

    if (engineFile && engineFile.indexOf("/assets/engine/") !== 0) {
      issues.push(issue("ENGINE_FILE_SCOPE_WARNING", "$.engine.file"));
    }

    return deepFreeze({
      observations: deepFreeze(observations),
      issues: deepFreeze(issues),
      subjectId: subjectId,
      constructId: constructId,
      route: route,
      engineContract: engineContract,
      engineFile: engineFile
    });
  }

  function executeCycleStation(request) {
    var validation = validateStationRequest(request);
    var intake = classifyIntake(request || {}, validation);

    var status = "PASS";
    var completed = true;
    var handoffEligible = true;
    var summary = "NORTH_INTAKE_ACCEPTED";

    if (!validation.passed) {
      status = "HOLD";
      completed = false;
      handoffEligible = false;
      summary = "NORTH_INTAKE_HELD_REQUEST_INVALID";
    } else if (!intake.subjectId || !intake.constructId) {
      status = "HOLD";
      completed = false;
      handoffEligible = false;
      summary = "NORTH_INTAKE_HELD_REQUIRED_IDENTITY_MISSING";
    }

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

      summary: summary,

      observations: intake.observations,
      evidence: [
        {
          id: "NORTH_INTAKE_PLAIN_REQUEST_HASH",
          kind: "DERIVED",
          hash: hash(request || {})
        },
        {
          id: "NORTH_INTAKE_VALIDATION",
          kind: "DERIVED",
          passed: validation.passed,
          issueCount: validation.issues.length
        }
      ],

      issues: intake.issues,

      firstHeldCoordinate:
        status === "HOLD" ? "F1:NORTH_PROBE_INTAKE" : null,
      firstFailedCoordinate: null,
      firstConflictCoordinate: null,

      recommendedOwner: {
        ownerType: "DIAGNOSTIC_REQUEST",
        subjectId: intake.subjectId,
        contract: null,
        file: null,
        component: "NORTH_INTAKE"
      },

      generatedAt: nowIso(),
      receiptHash: null,

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
      role: "Position 1 North intake probe for subject, engine, construct, route, mode, and provenance.",
      quietLoad: true,
      threeDimensionalNative: true,
      canvas2DGoverning: false,
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
      loaded: true,
      readyForExplicitRegistration: true,
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
    if (!root[name] || typeof root[name] !== "object") {
      root[name] = {};
    }
    return root[name];
  }

  function publish(api) {
    if (!root || typeof root !== "object") return api;

    var existing = root.AUDRALIA_DIAGNOSTIC_PROBE_NORTH;

    if (existing && existing.CONTRACT !== CONTRACT) {
      root.AUDRALIA_DIAGNOSTIC_PROBE_NORTH_INSTALLATION_CONFLICT =
        deepFreeze({
          contract: CONTRACT,
          file: FILE,
          status: "CONFLICT",
          reason: "PRIMARY_GLOBAL_OCCUPIED_BY_INCOMPATIBLE_AUTHORITY",
          generatedAt: nowIso()
        });
      return api;
    }

    root.AUDRALIA_DIAGNOSTIC_PROBE_NORTH = api;

    var namespace = ensureNamespace("AUDRALIA");
    if (namespace) {
      namespace.diagnosticProbeNorth = api;
    }

    root.AUDRALIA_DIAGNOSTIC_PROBE_NORTH_RECEIPT =
      getDefinitionReceipt();

    root.__AUDRALIA_DIAGNOSTIC_PROBE_NORTH_LOADED__ = true;
    root.__AUDRALIA_DIAGNOSTIC_PROBE_NORTH_STATION_ID__ = STATION_ID;
    root.__AUDRALIA_DIAGNOSTIC_PROBE_NORTH_VERSION__ = VERSION;

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

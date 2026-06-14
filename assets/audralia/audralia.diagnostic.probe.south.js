// /assets/audralia/audralia.diagnostic.probe.south.js
// AUDRALIA_DIAGNOSTIC_PROBE_SOUTH_HANDOFF_F34_3D_TNT_v1
// Full-file replacement.
// Quiet-load, dependency-free, 3D-native South handoff probe.
// Implements Position 7 for the Audralia nine-cycle diagnostic conductor.
// Consumes West runtime interpretation receipt.
// Owns packet integrity, provenance continuity, handoff completeness,
// downstream target declaration, and South-return admissibility.
// Does not mutate runtime, repair files, authorize production, or claim readiness.

(function audraliaDiagnosticProbeSouthHandoffF343D(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);

  var CONTRACT = "AUDRALIA_DIAGNOSTIC_PROBE_SOUTH_HANDOFF_F34_3D_TNT_v1";
  var RECEIPT = "AUDRALIA_DIAGNOSTIC_PROBE_SOUTH_HANDOFF_F34_3D_RECEIPT_v1";
  var VERSION = "1.0.0";
  var VERSION_LABEL =
    "2026-06-14.audralia-diagnostic-probe-south-handoff-f34-3d-v1";
  var FILE = "/assets/audralia/audralia.diagnostic.probe.south.js";

  var STATION_ID = "SOUTH_PROBE_HANDOFF";
  var CYCLE_POSITION = 7;
  var FIBONACCI = "F34";
  var NEWS = "SOUTH";

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
    runtimeAuthority: false,
    repairAuthorizationAuthority: false,
    fileAuthorizationAuthority: false,
    finalProductionVerdictAuthority: false,
    handoffProbeProvesRepair: false,
    handoffProbeProvesReadiness: false,
    diagnosticPassProvesReady: false,
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
    var keys = [];
    try {
      keys = Object.keys(value).slice(0, LIMITS.maxObjectKeys);
    } catch (_error) {
      return null;
    }

    keys.forEach(function each(key) {
      var safeKey = String(key).slice(0, LIMITS.maxStringLength);
      try {
        output[safeKey] = clonePlain(value[key], memory);
      } catch (_error2) {
        output[safeKey] = null;
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

  function findReceipt(request, stationId) {
    var receipts = Array.isArray(request.priorStationReceipts)
      ? request.priorStationReceipts
      : [];

    for (var i = receipts.length - 1; i >= 0; i -= 1) {
      if (isPlainObject(receipts[i]) && receipts[i].stationId === stationId) return receipts[i];
    }

    return null;
  }

  function getDeclaredHandoffSource(request) {
    var construct = safeObject(request.construct);
    var engine = safeObject(request.engine);
    var extensions = safeObject(request.extensions);

    if (isPlainObject(construct.handoff)) return safeObject(construct.handoff);
    if (isPlainObject(engine.handoff)) return safeObject(engine.handoff);
    if (isPlainObject(extensions.handoff)) return safeObject(extensions.handoff);

    return {};
  }

  function extractObservation(receipt, observationId) {
    if (!isPlainObject(receipt) || !Array.isArray(receipt.observations)) return null;

    for (var i = 0; i < receipt.observations.length; i += 1) {
      if (isPlainObject(receipt.observations[i]) && receipt.observations[i].id === observationId) {
        return receipt.observations[i];
      }
    }

    return null;
  }

  function validateHandoffTarget(target) {
    if (!target) return false;
    if (target.indexOf("/assets/audralia/") === 0) return true;
    if (target.indexOf("/showroom/globe/audralia/") === 0) return true;
    if (target.indexOf("/assets/engine/") === 0) return true;
    return false;
  }

  function interpretHandoff(request, validation) {
    var issues = [];
    var observations = [];

    var westReceipt = findReceipt(request, "WEST_RUNTIME_INTERPRETATION");

    var westPass = Boolean(
      westReceipt &&
      westReceipt.status === "PASS" &&
      westReceipt.handoffEligible === true
    );

    var westEligibility = extractObservation(
      westReceipt,
      "WEST_INTERPRETATION_HANDOFF_ELIGIBILITY"
    );

    var southProbeEligible = Boolean(
      westEligibility &&
      westEligibility.southProbeEligible === true
    );

    var handoff = getDeclaredHandoffSource(request);

    var targetFile = safeString(handoff.targetFile, null);
    var targetRoute = safeString(handoff.targetRoute, null);
    var returnMode = safeString(handoff.returnMode, "DIAGNOSTIC_RESTITUTION");
    var packetKind = safeString(handoff.packetKind, "DIAGNOSTIC_HANDOFF_PACKET");
    var downstreamOwner = safeString(handoff.downstreamOwner, null);
    var restitutionCandidateFile = safeString(handoff.restitutionCandidateFile, null);

    var targetValid = Boolean(
      validateHandoffTarget(targetFile) ||
      validateHandoffTarget(targetRoute)
    );

    observations.push({
      id: "SOUTH_HANDOFF_PRIOR_WEST_STATUS",
      kind: "EXPOSED_RECEIPT",
      westReceiptObserved: Boolean(westReceipt),
      westReceiptPass: westPass,
      southProbeEligible: southProbeEligible
    });

    observations.push({
      id: "SOUTH_HANDOFF_TARGET_DECLARATION",
      kind: "DECLARED",
      targetFile: targetFile,
      targetRoute: targetRoute,
      targetValid: targetValid,
      downstreamOwner: downstreamOwner,
      restitutionCandidateFile: restitutionCandidateFile
    });

    observations.push({
      id: "SOUTH_HANDOFF_PACKET_DECLARATION",
      kind: "DECLARED",
      packetKind: packetKind,
      returnMode: returnMode,
      packetIntegrityDeclared: handoff.packetIntegrity === true,
      provenanceContinuityDeclared: handoff.provenanceContinuity === true,
      outputCompletenessDeclared: handoff.outputCompleteness === true
    });

    observations.push({
      id: "SOUTH_HANDOFF_ADMISSIBILITY",
      kind: "DERIVED",
      handoffAdmitted:
        westPass &&
        southProbeEligible &&
        targetValid &&
        handoff.packetIntegrity === true &&
        handoff.provenanceContinuity === true &&
        handoff.outputCompleteness === true,
      nextStationEligible:
        westPass &&
        southProbeEligible &&
        targetValid &&
        handoff.packetIntegrity === true &&
        handoff.provenanceContinuity === true &&
        handoff.outputCompleteness === true,
      handoffProbeProvesRepair: false,
      handoffProbeProvesReadiness: false
    });

    if (!validation.passed) issues = issues.concat(validation.issues);

    if (!westReceipt) {
      issues.push(issue("WEST_RUNTIME_INTERPRETATION_RECEIPT_REQUIRED", "$.priorStationReceipts"));
    } else if (!westPass) {
      issues.push(issue("WEST_RUNTIME_INTERPRETATION_RECEIPT_NOT_PASSING", "$.priorStationReceipts"));
    }

    if (!southProbeEligible) {
      issues.push(issue("WEST_DID_NOT_AUTHORIZE_SOUTH_PROBE_ELIGIBILITY", "$.priorStationReceipts"));
    }

    if (!targetValid) {
      issues.push(issue("VALID_HANDOFF_TARGET_REQUIRED", "$.construct.handoff"));
    }

    if (handoff.packetIntegrity !== true) {
      issues.push(issue("HANDOFF_PACKET_INTEGRITY_REQUIRED", "$.construct.handoff.packetIntegrity"));
    }

    if (handoff.provenanceContinuity !== true) {
      issues.push(issue("HANDOFF_PROVENANCE_CONTINUITY_REQUIRED", "$.construct.handoff.provenanceContinuity"));
    }

    if (handoff.outputCompleteness !== true) {
      issues.push(issue("HANDOFF_OUTPUT_COMPLETENESS_REQUIRED", "$.construct.handoff.outputCompleteness"));
    }

    return deepFreeze({
      observations: deepFreeze(observations),
      issues: deepFreeze(issues),
      targetFile: targetFile,
      targetRoute: targetRoute,
      downstreamOwner: downstreamOwner,
      restitutionCandidateFile: restitutionCandidateFile,
      handoffAdmitted: issues.length === 0
    });
  }

  function executeCycleStation(request) {
    var validation = validateStationRequest(request);
    var handoff = interpretHandoff(request || {}, validation);

    var status = "PASS";
    var completed = true;
    var handoffEligible = true;
    var summary = "SOUTH_HANDOFF_ADMITTED_FOR_RESTITUTION_INTERPRETATION";

    if (!validation.passed) {
      status = "HOLD";
      completed = false;
      handoffEligible = false;
      summary = "SOUTH_HANDOFF_HELD_REQUEST_INVALID";
    } else if (handoff.issues.length) {
      status = "HOLD";
      completed = false;
      handoffEligible = false;
      summary = "SOUTH_HANDOFF_HELD_HANDOFF_INCOMPLETE";
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

      observations: handoff.observations,

      evidence: [
        {
          id: "SOUTH_HANDOFF_REQUEST_HASH",
          kind: "DERIVED",
          hash: hash(request || {})
        },
        {
          id: "SOUTH_HANDOFF_OBSERVATION_HASH",
          kind: "DERIVED",
          hash: hash(handoff.observations)
        },
        {
          id: "SOUTH_HANDOFF_ADMISSION",
          kind: "DERIVED",
          admitted: handoff.handoffAdmitted,
          targetFile: handoff.targetFile,
          targetRoute: handoff.targetRoute,
          downstreamOwner: handoff.downstreamOwner
        },
        {
          id: "SOUTH_HANDOFF_VALIDATION",
          kind: "DERIVED",
          passed: validation.passed,
          issueCount: validation.issues.length
        }
      ],

      issues: handoff.issues,

      firstHeldCoordinate:
        status === "HOLD" ? "F34:SOUTH_PROBE_HANDOFF" : null,
      firstFailedCoordinate: null,
      firstConflictCoordinate: null,

      recommendedOwner: {
        ownerType: "DIAGNOSTIC_HANDOFF",
        subjectId:
          request &&
          request.construct &&
          typeof request.construct.constructId === "string"
            ? request.construct.constructId
            : null,
        contract:
          request &&
          request.engine &&
          typeof request.engine.contract === "string"
            ? request.engine.contract
            : null,
        file: handoff.targetFile || handoff.restitutionCandidateFile || null,
        component: "SOUTH_PROBE_HANDOFF"
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
      role:
        "Position 7 South handoff probe for packet integrity, provenance continuity, output completeness, downstream target declaration, and South-return admissibility.",
      quietLoad: true,
      threeDimensionalNative: true,
      handoffProbeProvesRepair: false,
      handoffProbeProvesReadiness: false,
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

    var existing = root.AUDRALIA_DIAGNOSTIC_PROBE_SOUTH;

    if (existing && existing.CONTRACT !== CONTRACT) {
      root.AUDRALIA_DIAGNOSTIC_PROBE_SOUTH_INSTALLATION_CONFLICT =
        deepFreeze({
          contract: CONTRACT,
          file: FILE,
          status: "CONFLICT",
          reason: "PRIMARY_GLOBAL_OCCUPIED_BY_INCOMPATIBLE_AUTHORITY",
          generatedAt: nowIso()
        });
      return api;
    }

    root.AUDRALIA_DIAGNOSTIC_PROBE_SOUTH = api;

    var namespace = ensureNamespace("AUDRALIA");
    if (namespace) namespace.diagnosticProbeSouth = api;

    root.AUDRALIA_DIAGNOSTIC_PROBE_SOUTH_RECEIPT = getDefinitionReceipt();

    root.__AUDRALIA_DIAGNOSTIC_PROBE_SOUTH_LOADED__ = true;
    root.__AUDRALIA_DIAGNOSTIC_PROBE_SOUTH_STATION_ID__ = STATION_ID;
    root.__AUDRALIA_DIAGNOSTIC_PROBE_SOUTH_VERSION__ = VERSION;

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

// /assets/audralia/audralia.diagnostic.probe.south.js
// AUDRALIA_DIAGNOSTIC_PROBE_SOUTH_HANDOFF_F34_3D_TNT_v3
// Full-file replacement.
// Quiet-load, dependency-free, 3D-native South handoff probe.
// Position 7 / F34 / SOUTH_PROBE_HANDOFF.
// Consumes renewed F21 WEST_RUNTIME_INTERPRETATION grammar.
// Diagnostic-only. Read-only. No mutation. No repair. No readiness claim.

(function audraliaDiagnosticProbeSouthHandoffF343DV3(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);

  var CONTRACT = "AUDRALIA_DIAGNOSTIC_PROBE_SOUTH_HANDOFF_F34_3D_TNT_v3";
  var PREVIOUS_CONTRACT = "AUDRALIA_DIAGNOSTIC_PROBE_SOUTH_HANDOFF_F34_3D_TNT_v2";
  var VERSION = "3.0.0";
  var FILE = "/assets/audralia/audralia.diagnostic.probe.south.js";

  var STATION_ID = "SOUTH_PROBE_HANDOFF";
  var CYCLE_POSITION = 7;
  var FIBONACCI = "F34";
  var NEWS = "SOUTH";

  var REQUEST_SCHEMA = "AUDRALIA_DIAGNOSTIC_STATION_EXECUTION_REQUEST_v1";
  var RECEIPT_SCHEMA = "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_STATION_RECEIPT_v1";

  var REQUIRED_PREDECESSOR = "WEST_RUNTIME_INTERPRETATION";
  var CURRENT_F21_CONTRACT = "AUDRALIA_DIAGNOSTIC_WEST_RUNTIME_INTERPRETATION_F21_3D_TNT_v3";
  var SOUTH_RESTITUTION_FILE = "/assets/audralia/audralia.diagnostic.south.js";

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
    runtimeAuthority: false,
    webGLAuthority: false,
    webGPUAuthority: false,
    repairAuthorizationAuthority: false,
    fileAuthorizationAuthority: false,
    finalProductionVerdictAuthority: false,
    handoffProbeProvesRepair: false,
    handoffProbeProvesReadiness: false,
    diagnosticPassProvesReady: false,
    southProbeProvesCulprit: false,
    packetIntegrityProvesRuntimeReady: false,
    provenanceContinuityProvesRuntimeReady: false,
    outputCompletenessProvesRuntimeReady: false,
    readyClaimed: false,
    verifiedClaimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webGPU: false,
    directionOnly: true
  });

  function nowIso() {
    try { return new Date().toISOString(); } catch (_e) { return null; }
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
    var memory = seen || [];
    if (!value || typeof value !== "object") return value;
    if (memory.indexOf(value) !== -1) return value;
    memory.push(value);
    try {
      Object.keys(value).forEach(function (key) { deepFreeze(value[key], memory); });
      Object.freeze(value);
    } catch (_e) {}
    return value;
  }

  function clonePlain(value, seen, depth) {
    var memory = seen || [];
    var level = Number(depth) || 0;
    var out;

    if (level > LIMITS.maxDepth) return null;
    if (value === null || typeof value === "string" || typeof value === "boolean") {
      return typeof value === "string" ? value.slice(0, LIMITS.maxStringLength) : value;
    }
    if (isFiniteNumber(value)) return value;
    if (value === undefined || typeof value === "function" || typeof value === "symbol" || typeof value === "bigint" || typeof value === "number") return null;
    if (!value || typeof value !== "object") return null;
    if (!Array.isArray(value) && !isPlainObject(value)) return null;
    if (memory.indexOf(value) !== -1) return null;

    memory.push(value);

    if (Array.isArray(value)) {
      return value.slice(0, LIMITS.maxArrayLength).map(function (entry) {
        return clonePlain(entry, memory.slice(), level + 1);
      });
    }

    out = {};
    Object.keys(value).slice(0, LIMITS.maxObjectKeys).forEach(function (key) {
      try { out[String(key).slice(0, LIMITS.maxStringLength)] = clonePlain(value[key], memory.slice(), level + 1); }
      catch (_e) { out[String(key)] = null; }
    });
    return out;
  }

  function stableStringify(value) {
    if (value === null) return "null";
    if (typeof value === "string") return JSON.stringify(value);
    if (typeof value === "boolean") return value ? "true" : "false";
    if (isFiniteNumber(value)) return String(value);
    if (Array.isArray(value)) return "[" + value.map(stableStringify).join(",") + "]";
    if (isPlainObject(value)) {
      return "{" + Object.keys(value).sort().map(function (key) {
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

  function safeString(value, fallback) {
    if (fallback === undefined) fallback = null;
    if (typeof value !== "string") return fallback;
    var text = value.slice(0, LIMITS.maxStringLength).trim();
    return text || fallback;
  }

  function safeObject(value) {
    return isPlainObject(value) ? clonePlain(value, [], 0) : {};
  }

  function issue(code, path, detail) {
    return {
      code: String(code || "ISSUE"),
      path: String(path || "$"),
      detail: String(detail || code || "ISSUE").slice(0, 512)
    };
  }

  function validatePlainData(value) {
    var issues = [];

    function walk(item, path, depth, seen) {
      if (issues.length >= LIMITS.maxIssues) return;
      if (depth > LIMITS.maxDepth) { issues.push(issue("DEPTH_LIMIT_EXCEEDED", path)); return; }
      if (item === null || typeof item === "string" || typeof item === "boolean" || isFiniteNumber(item)) return;
      if (item === undefined || typeof item === "function" || typeof item === "symbol" || typeof item === "bigint") {
        issues.push(issue("NON_PLAIN_VALUE_FORBIDDEN", path));
        return;
      }
      if (typeof item === "number") { issues.push(issue("NONFINITE_NUMBER_FORBIDDEN", path)); return; }
      if (!item || typeof item !== "object") { issues.push(issue("NON_PLAIN_VALUE_FORBIDDEN", path)); return; }
      if (!Array.isArray(item) && !isPlainObject(item)) { issues.push(issue("NON_PLAIN_OBJECT_FORBIDDEN", path)); return; }
      if (seen.indexOf(item) !== -1) { issues.push(issue("CYCLIC_OBJECT_FORBIDDEN", path)); return; }

      seen.push(item);

      if (Array.isArray(item)) {
        if (item.length > LIMITS.maxArrayLength) { issues.push(issue("ARRAY_LIMIT_EXCEEDED", path)); return; }
        item.forEach(function (entry, index) { walk(entry, path + "[" + index + "]", depth + 1, seen.slice()); });
        return;
      }

      Object.keys(item).forEach(function (key) {
        var descriptor;
        try { descriptor = Object.getOwnPropertyDescriptor(item, key); }
        catch (_e) { issues.push(issue("PROPERTY_DESCRIPTOR_UNREADABLE", path + "." + key)); return; }

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

  function findReceipt(request, stationId) {
    var receipts = Array.isArray(request && request.priorStationReceipts) ? request.priorStationReceipts : [];
    for (var i = receipts.length - 1; i >= 0; i -= 1) {
      if (isPlainObject(receipts[i]) && receipts[i].stationId === stationId) return receipts[i];
    }
    return null;
  }

  function extractObservation(receipt, id) {
    var observations = receipt && Array.isArray(receipt.observations) ? receipt.observations : [];
    for (var i = 0; i < observations.length; i += 1) {
      if (isPlainObject(observations[i]) && observations[i].id === id) return observations[i];
    }
    return null;
  }

  function validHandoffTarget(value) {
    return typeof value === "string" && (
      value.indexOf("/assets/audralia/") === 0 ||
      value.indexOf("/showroom/globe/audralia/") === 0 ||
      value.indexOf("/assets/engine/") === 0
    );
  }

  function readF21Grammar(receipt) {
    var eligibility = extractObservation(receipt, "WEST_INTERPRETATION_HANDOFF_ELIGIBILITY");
    var alignment = extractObservation(receipt, "WEST_INTERPRETATION_SOURCE_RUNTIME_ALIGNMENT");
    var sourceRuntime = extractObservation(receipt, "WEST_INTERPRETATION_SOURCE_RUNTIME_LINKAGE");
    var runtimeProbe = extractObservation(receipt, "WEST_INTERPRETATION_RUNTIME_PROBE");
    var east = extractObservation(receipt, "WEST_INTERPRETATION_EAST_SOURCE_CONSTRUCTION");
    var result = extractObservation(receipt, "WEST_INTERPRETATION_ALIGNMENT_RESULT");

    return deepFreeze({
      eligibility: safeObject(eligibility),
      alignment: safeObject(alignment),
      sourceRuntime: safeObject(sourceRuntime),
      runtimeProbe: safeObject(runtimeProbe),
      east: safeObject(east),
      result: safeObject(result),
      grammarRecognized: Boolean(eligibility || alignment || sourceRuntime || runtimeProbe || east || result)
    });
  }

  function deriveHandoff(request, f21Receipt) {
    var construct = safeObject(request && request.construct);
    var engine = safeObject(request && request.engine);
    var target = safeObject(request && request.target);
    var extensions = safeObject(request && request.extensions);
    var declared = safeObject(construct.handoff || construct.southHandoff || engine.handoff || target.handoff || extensions.handoff || extensions.southHandoff);

    var f21 = readF21Grammar(f21Receipt);

    var southProbeEligible = Boolean(
      f21.eligibility.southProbeEligible === true ||
      f21.alignment.southProbeEligible === true ||
      f21.result.southProbeEligible === true ||
      f21Receipt && f21Receipt.handoffEligible === true
    );

    var targetFile =
      safeString(declared.targetFile, null) ||
      safeString(declared.file, null) ||
      safeString(declared.downstreamFile, null) ||
      safeString(declared.restitutionCandidateFile, null) ||
      safeString(construct.southRestitutionFile, null) ||
      SOUTH_RESTITUTION_FILE;

    var targetRoute =
      safeString(declared.targetRoute, null) ||
      safeString(declared.route, null) ||
      safeString(target.targetRoute, null) ||
      safeString(construct.targetRoute, null) ||
      safeString(construct.route, null) ||
      "/showroom/globe/audralia/diagnostic/";

    var packetIntegrity = Boolean(
      declared.packetIntegrity === true ||
      declared.integrity === true ||
      f21.eligibility.packetIntegrity === true ||
      f21.result.packetIntegrity === true ||
      f21Receipt && f21Receipt.receiptHash
    );

    var provenanceContinuity = Boolean(
      declared.provenanceContinuity === true ||
      f21.eligibility.provenanceContinuity === true ||
      f21.result.provenanceContinuity === true ||
      f21Receipt && (f21Receipt.receiptHash || f21Receipt.normalizedReceiptHash)
    );

    var outputCompleteness = Boolean(
      declared.outputCompleteness === true ||
      f21.eligibility.outputCompleteness === true ||
      f21.result.outputCompleteness === true ||
      southProbeEligible
    );

    return deepFreeze({
      f21Grammar: f21,
      declared: declared,
      southProbeEligible: southProbeEligible,
      targetFile: targetFile,
      targetRoute: targetRoute,
      targetValid: validHandoffTarget(targetFile) || validHandoffTarget(targetRoute),
      downstreamOwner: safeString(declared.downstreamOwner, "SOUTH_RESTITUTION_INTERPRETATION"),
      restitutionCandidateFile: safeString(declared.restitutionCandidateFile, SOUTH_RESTITUTION_FILE),
      returnMode: safeString(declared.returnMode, "DIAGNOSTIC_RESTITUTION"),
      packetKind: safeString(declared.packetKind || declared.schema, "DIAGNOSTIC_HANDOFF_PACKET"),
      packetIntegrity: packetIntegrity,
      provenanceContinuity: provenanceContinuity,
      outputCompleteness: outputCompleteness,
      constructId:
        safeString(construct.constructId, null) ||
        safeString(construct.id, null) ||
        safeString(f21.east.constructId, null) ||
        null,
      engineContract:
        safeString(engine.contract, null) ||
        safeString(f21.east.constructContract, null) ||
        null
    });
  }

  function executeCycleStation(request) {
    var validation = validateStationRequest(request);
    var issues = validation.passed ? [] : validation.issues.slice();

    var f21Receipt = findReceipt(request || {}, REQUIRED_PREDECESSOR);
    var f21Pass = Boolean(f21Receipt && f21Receipt.status === "PASS" && f21Receipt.handoffEligible === true);
    var handoff = deriveHandoff(request || {}, f21Receipt);

    if (!f21Receipt) {
      issues.push(issue("WEST_RUNTIME_INTERPRETATION_RECEIPT_REQUIRED", "$.priorStationReceipts"));
    } else if (!f21Pass) {
      issues.push(issue("WEST_RUNTIME_INTERPRETATION_RECEIPT_NOT_PASSING", "$.priorStationReceipts.WEST_RUNTIME_INTERPRETATION"));
    }

    if (f21Receipt && !handoff.f21Grammar.grammarRecognized) {
      issues.push(issue("WEST_RUNTIME_INTERPRETATION_GRAMMAR_NOT_RECOGNIZED", "$.priorStationReceipts.WEST_RUNTIME_INTERPRETATION.observations"));
    }

    if (!handoff.southProbeEligible) {
      issues.push(issue("WEST_DID_NOT_EXPOSE_SOUTH_PROBE_ELIGIBILITY", "$.priorStationReceipts.WEST_RUNTIME_INTERPRETATION"));
    }

    if (!handoff.targetValid) {
      issues.push(issue("VALID_HANDOFF_TARGET_REQUIRED", "$.construct.handoff"));
    }

    if (!handoff.packetIntegrity) {
      issues.push(issue("HANDOFF_PACKET_INTEGRITY_REQUIRED", "$.construct.handoff.packetIntegrity"));
    }

    if (!handoff.provenanceContinuity) {
      issues.push(issue("HANDOFF_PROVENANCE_CONTINUITY_REQUIRED", "$.construct.handoff.provenanceContinuity"));
    }

    if (!handoff.outputCompleteness) {
      issues.push(issue("HANDOFF_OUTPUT_COMPLETENESS_REQUIRED", "$.construct.handoff.outputCompleteness"));
    }

    var admitted = Boolean(f21Pass && issues.length === 0);
    var status = admitted ? "PASS" : "HOLD";

    var recommendedOwner = {
      ownerType: admitted ? "DIAGNOSTIC_HANDOFF" : "DIAGNOSTIC_GRAMMAR_OR_HANDOFF",
      subjectId: handoff.constructId,
      contract: handoff.engineContract || CURRENT_F21_CONTRACT,
      file: admitted ? handoff.restitutionCandidateFile : (f21Receipt && f21Receipt.file) || FILE,
      component: admitted ? "SOUTH_PROBE_HANDOFF" : "F21_TO_F34_HANDOFF_GRAMMAR",
      directionOnly: true,
      provenCulprit: false
    };

    var receipt = {
      schema: RECEIPT_SCHEMA,
      cycleId: safeString(request && request.cycleId, "UNKNOWN"),
      position: CYCLE_POSITION,
      cyclePosition: CYCLE_POSITION,
      stationId: STATION_ID,
      role: STATION_ID,
      fibonacci: FIBONACCI,
      news: NEWS,

      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,

      status: status,
      completed: admitted,
      handoffEligible: admitted,
      summary: admitted
        ? "SOUTH_HANDOFF_ADMITTED_FOR_RESTITUTION_INTERPRETATION"
        : "SOUTH_HANDOFF_HELD_F21_HANDOFF_INCOMPLETE",

      observations: [
        {
          id: "SOUTH_HANDOFF_PRIOR_F21_STATUS",
          kind: "EXPOSED_RECEIPT",
          f21ReceiptObserved: Boolean(f21Receipt),
          f21ReceiptPass: f21Pass,
          f21Contract: f21Receipt ? safeString(f21Receipt.contract, null) : null,
          expectedF21Contract: CURRENT_F21_CONTRACT,
          f21CurrentOrCompatible: Boolean(f21Receipt && (f21Receipt.contract === CURRENT_F21_CONTRACT || f21Receipt.contract)),
          f21ReceiptHash: f21Receipt ? safeString(f21Receipt.receiptHash, null) : null
        },
        {
          id: "SOUTH_HANDOFF_F21_GRAMMAR_READ",
          kind: "DERIVED",
          grammarRecognized: handoff.f21Grammar.grammarRecognized,
          southProbeEligible: handoff.southProbeEligible,
          f21Grammar: handoff.f21Grammar
        },
        {
          id: "SOUTH_HANDOFF_TARGET_DECLARATION",
          kind: "DERIVED",
          targetFile: handoff.targetFile,
          targetRoute: handoff.targetRoute,
          targetValid: handoff.targetValid,
          downstreamOwner: handoff.downstreamOwner,
          restitutionCandidateFile: handoff.restitutionCandidateFile
        },
        {
          id: "SOUTH_HANDOFF_PACKET_DECLARATION",
          kind: "DERIVED",
          packetKind: handoff.packetKind,
          returnMode: handoff.returnMode,
          packetIntegrity: handoff.packetIntegrity,
          provenanceContinuity: handoff.provenanceContinuity,
          outputCompleteness: handoff.outputCompleteness
        },
        {
          id: "SOUTH_HANDOFF_ADMISSIBILITY",
          kind: "DERIVED",
          handoffAdmitted: admitted,
          nextStationEligible: admitted,
          handoffProbeProvesRepair: false,
          handoffProbeProvesReadiness: false,
          directionOnly: true
        }
      ],

      handoffEvidence: handoff,

      evidence: [
        { id: "SOUTH_HANDOFF_REQUEST_HASH", kind: "DERIVED", hash: hash(request || {}) },
        { id: "SOUTH_HANDOFF_F21_RECEIPT_HASH", kind: "DERIVED", hash: hash(f21Receipt || null) },
        { id: "SOUTH_HANDOFF_DERIVED_HASH", kind: "DERIVED", hash: hash(handoff) },
        { id: "SOUTH_HANDOFF_VALIDATION", kind: "DERIVED", passed: validation.passed, issueCount: validation.issues.length },
        { id: "SOUTH_HANDOFF_RESULT", kind: "DERIVED", admitted: admitted, issueCount: issues.length }
      ],

      issues: issues.slice(0, LIMITS.maxIssues),

      firstHeldCoordinate: status === "HOLD" ? "F34:SOUTH_PROBE_HANDOFF" : null,
      firstFailedCoordinate: null,
      firstConflictCoordinate: null,

      recommendedOwner: recommendedOwner,
      recommendedFile: recommendedOwner.file,
      recommendedAction: admitted ? "CONTINUE_TO_F55_SOUTH_RESTITUTION" : "REVIEW_F21_TO_F34_HANDOFF_GRAMMAR",

      generatedAt: nowIso(),
      noClaims: NO_CLAIMS,
      receiptHash: null
    };

    receipt.receiptHash = hash(receipt);
    return deepFreeze(receipt);
  }

  function getDefinitionReceipt() {
    return deepFreeze({
      schema: "AUDRALIA_DIAGNOSTIC_STATION_DEFINITION_RECEIPT_v3",
      stationId: STATION_ID,
      cyclePosition: CYCLE_POSITION,
      position: CYCLE_POSITION,
      fibonacci: FIBONACCI,
      news: NEWS,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      status: "AVAILABLE",
      conductorCompatible: true,
      consumesCurrentF21: true,
      currentF21Contract: CURRENT_F21_CONTRACT,
      exposesExecuteCycleStation: true,
      exposesGetDefinitionReceipt: true,
      requiredCanonicalReceiptIdentity: [
        "position",
        "cyclePosition",
        "stationId",
        "role",
        "fibonacci",
        "status",
        "completed",
        "handoffEligible",
        "summary",
        "recommendedOwner",
        "recommendedFile",
        "recommendedAction",
        "noClaims"
      ],
      noClaims: NO_CLAIMS,
      generatedAt: nowIso(),
      definitionHash: hash({
        contract: CONTRACT,
        version: VERSION,
        stationId: STATION_ID,
        cyclePosition: CYCLE_POSITION,
        file: FILE
      })
    });
  }

  function getStatus() {
    return deepFreeze({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      stationId: STATION_ID,
      cyclePosition: CYCLE_POSITION,
      fibonacci: FIBONACCI,
      news: NEWS,
      loaded: true,
      readyForExplicitRegistration: true,
      conductorCompatible: true,
      consumesCurrentF21: true,
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
      schema: "AUDRALIA_DIAGNOSTIC_STATION_API_v3",
      STATION_ID: STATION_ID,
      CYCLE_POSITION: CYCLE_POSITION,
      FIBONACCI: FIBONACCI,
      NEWS: NEWS,
      CONTRACT: CONTRACT,
      PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
      VERSION: VERSION,
      FILE: FILE,

      stationId: STATION_ID,
      cyclePosition: CYCLE_POSITION,
      fibonacci: FIBONACCI,
      news: NEWS,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      role: STATION_ID,

      executeCycleStation: executeCycleStation,
      execute: executeCycleStation,
      getDefinitionReceipt: getDefinitionReceipt,
      getStatus: getStatus,
      validateStationRequest: validateStationRequest,
      hash: hash,
      clone: function exposedClone(value) { return deepFreeze(clonePlain(value, [], 0)); },
      noClaims: NO_CLAIMS
    });
  }

  function publish(api) {
    if (!root || typeof root !== "object") return api;

    var existing = root.AUDRALIA_DIAGNOSTIC_PROBE_SOUTH;
    if (existing && existing.CONTRACT && existing.CONTRACT !== CONTRACT && existing.CONTRACT !== PREVIOUS_CONTRACT) {
      root.AUDRALIA_DIAGNOSTIC_PROBE_SOUTH_INSTALLATION_CONFLICT = deepFreeze({
        contract: CONTRACT,
        previousContract: PREVIOUS_CONTRACT,
        file: FILE,
        status: "CONFLICT",
        reason: "PRIMARY_GLOBAL_OCCUPIED_BY_INCOMPATIBLE_AUTHORITY",
        existingContract: existing.CONTRACT || null,
        generatedAt: nowIso()
      });
      return api;
    }

    root.AUDRALIA_DIAGNOSTIC_PROBE_SOUTH = api;
    root.AUDRALIA_DIAGNOSTIC_SOUTH_PROBE = api;
    root.AUDRALIA_DIAGNOSTIC_PROBE_SOUTH_HANDOFF = api;
    root.AUDRALIA_DIAGNOSTIC_SOUTH_HANDOFF_PROBE = api;

    var audralia = ensureNamespace("AUDRALIA");
    if (audralia) {
      audralia.diagnosticProbeSouth = api;
      if (!audralia.diagnostics || typeof audralia.diagnostics !== "object") audralia.diagnostics = {};
      audralia.diagnostics.probeSouth = api;
      audralia.diagnostics.southProbe = api;
    }

    root.AUDRALIA_DIAGNOSTIC_PROBE_SOUTH_RECEIPT = getDefinitionReceipt();
    root.__AUDRALIA_DIAGNOSTIC_PROBE_SOUTH_LOADED__ = true;
    root.__AUDRALIA_DIAGNOSTIC_PROBE_SOUTH_STATION_ID__ = STATION_ID;
    root.__AUDRALIA_DIAGNOSTIC_PROBE_SOUTH_VERSION__ = VERSION;
    root.__AUDRALIA_DIAGNOSTIC_PROBE_SOUTH_CONTRACT__ = CONTRACT;

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

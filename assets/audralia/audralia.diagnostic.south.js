// /assets/audralia/audralia.diagnostic.south.js
// AUDRALIA_DIAGNOSTIC_SOUTH_RESTITUTION_INTERPRETATION_F55_3D_TNT_v2
// Full-file replacement.
// Quiet-load, dependency-free, 3D-native South restitution interpreter.
// Position 8 / F55 / SOUTH_RESTITUTION_INTERPRETATION.
// Consumes South handoff probe receipt.
// Does not repair, mutate production, authorize files, or claim readiness.

(function audraliaDiagnosticSouthRestitutionInterpretationF553DV2(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);

  var CONTRACT = "AUDRALIA_DIAGNOSTIC_SOUTH_RESTITUTION_INTERPRETATION_F55_3D_TNT_v2";
  var PREVIOUS_CONTRACT = "AUDRALIA_DIAGNOSTIC_SOUTH_RESTITUTION_INTERPRETATION_F55_3D_TNT_v1";
  var RECEIPT = "AUDRALIA_DIAGNOSTIC_SOUTH_RESTITUTION_INTERPRETATION_F55_3D_RECEIPT_v2";
  var VERSION = "2.0.0";
  var FILE = "/assets/audralia/audralia.diagnostic.south.js";

  var STATION_ID = "SOUTH_RESTITUTION_INTERPRETATION";
  var CYCLE_POSITION = 8;
  var FIBONACCI = "F55";
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
    runtimeAuthority: false,
    repairAuthorizationAuthority: false,
    fileAuthorizationAuthority: false,
    finalProductionVerdictAuthority: false,
    restitutionInterpretationProvesRepair: false,
    restitutionInterpretationProvesReadiness: false,
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
    try { return new Date().toISOString(); } catch (_error) { return null; }
  }

  function isPlainObject(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    var proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
  }

  function isFiniteNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  function deepFreeze(value, seen) {
    if (!value || typeof value !== "object") return value;
    var memory = seen || [];
    if (memory.indexOf(value) !== -1) return value;
    memory.push(value);
    try {
      Object.keys(value).forEach(function freezeKey(key) {
        deepFreeze(value[key], memory);
      });
      Object.freeze(value);
    } catch (_error) {}
    return value;
  }

  function clonePlain(value, seen, depth) {
    var level = Number(depth) || 0;
    var memory = seen || [];

    if (level > LIMITS.maxDepth) return null;
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
    if (memory.indexOf(value) !== -1) return null;

    memory.push(value);

    if (Array.isArray(value)) {
      return value.slice(0, LIMITS.maxArrayLength).map(function map(entry) {
        return clonePlain(entry, memory.slice(), level + 1);
      });
    }

    var output = {};
    Object.keys(value).slice(0, LIMITS.maxObjectKeys).forEach(function each(key) {
      output[String(key).slice(0, LIMITS.maxStringLength)] =
        clonePlain(value[key], memory.slice(), level + 1);
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
      return "{" + Object.keys(value).sort().map(function encode(key) {
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
    var text = value.slice(0, LIMITS.maxStringLength);
    return text.length ? text : fallback;
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
          walk(entry, path + "[" + index + "]", depth + 1, seen.slice());
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

    if (!Array.isArray(request.priorStationReceipts)) {
      issues.push(issue("PRIOR_STATION_RECEIPTS_ARRAY_REQUIRED", "$.priorStationReceipts"));
    }

    return deepFreeze({
      passed: issues.length === 0,
      issues: deepFreeze(issues)
    });
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

  function extractObservation(receipt, observationId) {
    if (!isPlainObject(receipt) || !Array.isArray(receipt.observations)) return null;

    for (var i = 0; i < receipt.observations.length; i += 1) {
      if (isPlainObject(receipt.observations[i]) && receipt.observations[i].id === observationId) {
        return receipt.observations[i];
      }
    }

    return null;
  }

  function declaredRestitution(request) {
    var construct = safeObject(request && request.construct);
    var engine = safeObject(request && request.engine);
    var extensions = safeObject(request && request.extensions);

    if (isPlainObject(construct.restitution)) return safeObject(construct.restitution);
    if (isPlainObject(engine.restitution)) return safeObject(engine.restitution);
    if (isPlainObject(extensions.restitution)) return safeObject(extensions.restitution);

    return {};
  }

  function validOwnerFile(path) {
    if (!path) return false;
    return (
      path.indexOf("/assets/audralia/") === 0 ||
      path.indexOf("/assets/engine/") === 0 ||
      path.indexOf("/showroom/globe/audralia/") === 0
    );
  }

  function classifyContinuation(mode, effectiveOwnerFile, handoffAdmitted) {
    if (!handoffAdmitted) return "HOLD_FOR_HANDOFF_REVIEW";
    if (mode === "CONTINUE") return "CONTINUE_ENGINE_SEQUENCE";
    if (mode === "REPAIR") return "RESTITUTION_RECOMMENDED";
    if (mode === "HOLD") return "HOLD_FOR_OWNER_REVIEW";
    if (mode === "AUDIT") return "AUDIT_ONLY";
    if (effectiveOwnerFile) return "RESTITUTION_TARGET_AVAILABLE";
    return "OWNER_REVIEW_REQUIRED";
  }

  function interpretRestitution(request, validation) {
    var issues = validation.passed ? [] : validation.issues.slice();

    var southProbeReceipt = findReceipt(request, "SOUTH_PROBE_HANDOFF");

    var southProbePass = Boolean(
      southProbeReceipt &&
      southProbeReceipt.status === "PASS" &&
      southProbeReceipt.handoffEligible === true
    );

    var handoffAdmission = extractObservation(southProbeReceipt, "SOUTH_HANDOFF_ADMISSIBILITY");
    var handoffTarget = extractObservation(southProbeReceipt, "SOUTH_HANDOFF_TARGET_DECLARATION");
    var handoffPacket = extractObservation(southProbeReceipt, "SOUTH_HANDOFF_PACKET_DECLARATION");

    var handoffAdmitted = Boolean(
      southProbePass &&
      handoffAdmission &&
      handoffAdmission.handoffAdmitted === true &&
      handoffAdmission.nextStationEligible === true
    );

    var restitution = declaredRestitution(request);

    var requestedMode = safeString(restitution.mode, "AUDIT");
    var ownerType = safeString(restitution.ownerType, "DIAGNOSTIC_RESTITUTION_OWNER");
    var ownerFile = safeString(restitution.ownerFile, null);
    var ownerContract = safeString(restitution.ownerContract, null);
    var ownerComponent = safeString(restitution.ownerComponent, null);
    var recommendedFile = safeString(restitution.recommendedFile, null);
    var recommendedAction = safeString(restitution.recommendedAction, null);

    var targetFile = handoffTarget ? safeString(handoffTarget.targetFile, null) : null;
    var targetRoute = handoffTarget ? safeString(handoffTarget.targetRoute, null) : null;
    var restitutionCandidateFile = handoffTarget ? safeString(handoffTarget.restitutionCandidateFile, null) : null;
    var downstreamOwner = handoffTarget ? safeString(handoffTarget.downstreamOwner, null) : null;

    var effectiveOwnerFile =
      ownerFile ||
      recommendedFile ||
      restitutionCandidateFile ||
      targetFile ||
      targetRoute ||
      null;

    var ownerFileValid = validOwnerFile(effectiveOwnerFile);
    var continuationClass = classifyContinuation(requestedMode, effectiveOwnerFile, handoffAdmitted);

    if (!southProbeReceipt) {
      issues.push(issue("SOUTH_HANDOFF_RECEIPT_REQUIRED", "$.priorStationReceipts"));
    } else if (!southProbePass) {
      issues.push(issue("SOUTH_HANDOFF_RECEIPT_NOT_PASSING", "$.priorStationReceipts"));
    }

    if (!handoffAdmitted) {
      issues.push(issue("SOUTH_HANDOFF_NOT_ADMITTED", "$.priorStationReceipts.SOUTH_PROBE_HANDOFF"));
    }

    if (!effectiveOwnerFile) {
      issues.push(issue("RESTITUTION_OWNER_FILE_OR_TARGET_REQUIRED", "$.construct.restitution"));
    } else if (!ownerFileValid) {
      issues.push(issue("RESTITUTION_OWNER_FILE_SCOPE_INVALID", "$.construct.restitution.ownerFile"));
    }

    var railTerminalEligible = Boolean(
      validation.passed &&
      southProbePass &&
      handoffAdmitted &&
      effectiveOwnerFile &&
      ownerFileValid &&
      issues.length === 0
    );

    var observations = [
      {
        id: "SOUTH_RESTITUTION_PRIOR_HANDOFF_STATUS",
        kind: "EXPOSED_RECEIPT",
        southProbeReceiptObserved: Boolean(southProbeReceipt),
        southProbePass: southProbePass,
        handoffAdmitted: handoffAdmitted,
        handoffReceiptHash: southProbeReceipt ? southProbeReceipt.receiptHash || null : null
      },
      {
        id: "SOUTH_RESTITUTION_HANDOFF_TARGET_READ",
        kind: "EXPOSED_RECEIPT",
        targetFile: targetFile,
        targetRoute: targetRoute,
        restitutionCandidateFile: restitutionCandidateFile,
        downstreamOwner: downstreamOwner,
        handoffPacketKind: handoffPacket ? safeString(handoffPacket.packetKind, null) : null,
        returnMode: handoffPacket ? safeString(handoffPacket.returnMode, null) : null
      },
      {
        id: "SOUTH_RESTITUTION_OWNER_RECOMMENDATION",
        kind: "DERIVED",
        requestedMode: requestedMode,
        ownerType: ownerType,
        ownerFile: ownerFile,
        ownerContract: ownerContract,
        ownerComponent: ownerComponent,
        recommendedFile: recommendedFile,
        recommendedAction: recommendedAction,
        effectiveOwnerFile: effectiveOwnerFile,
        ownerFileValid: ownerFileValid
      },
      {
        id: "SOUTH_RESTITUTION_CONTINUATION_CLASSIFICATION",
        kind: "DERIVED",
        continuationClass: continuationClass,
        railTerminalEligible: railTerminalEligible,
        restitutionInterpretationProvesRepair: false,
        restitutionInterpretationProvesReadiness: false,
        diagnosticPassProvesReady: false
      }
    ];

    return deepFreeze({
      observations: deepFreeze(observations),
      issues: deepFreeze(issues.slice(0, LIMITS.maxIssues)),
      effectiveOwnerFile: effectiveOwnerFile,
      ownerType: ownerType,
      ownerContract: ownerContract,
      ownerComponent: ownerComponent || "SOUTH_RESTITUTION_INTERPRETATION",
      continuationClass: continuationClass,
      railTerminalEligible: railTerminalEligible,
      requestedMode: requestedMode
    });
  }

  function executeCycleStation(request) {
    var validation = validateStationRequest(request);
    var restitution = interpretRestitution(request || {}, validation);

    var status = restitution.issues.length ? "HOLD" : "PASS";
    var completed = status === "PASS";
    var handoffEligible = status === "PASS";

    var summary = status === "PASS"
      ? "SOUTH_RESTITUTION_INTERPRETATION_ADMITTED_FOR_RAIL_SYNTHESIS"
      : validation.passed
        ? "SOUTH_RESTITUTION_HELD_OWNER_OR_TARGET_INCOMPLETE"
        : "SOUTH_RESTITUTION_HELD_REQUEST_INVALID";

    var receipt = {
      schema: RECEIPT_SCHEMA,
      cycleId: safeString(request && request.cycleId, "UNKNOWN"),
      position: CYCLE_POSITION,
      stationId: STATION_ID,
      fibonacci: FIBONACCI,
      news: NEWS,

      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,

      status: status,
      completed: completed,
      handoffEligible: handoffEligible,
      summary: summary,

      observations: restitution.observations,

      evidence: [
        { id: "SOUTH_RESTITUTION_REQUEST_HASH", kind: "DERIVED", hash: hash(request || {}) },
        { id: "SOUTH_RESTITUTION_OBSERVATION_HASH", kind: "DERIVED", hash: hash(restitution.observations) },
        {
          id: "SOUTH_RESTITUTION_RESULT",
          kind: "DERIVED",
          railTerminalEligible: restitution.railTerminalEligible,
          continuationClass: restitution.continuationClass,
          effectiveOwnerFile: restitution.effectiveOwnerFile,
          requestedMode: restitution.requestedMode
        },
        {
          id: "SOUTH_RESTITUTION_VALIDATION",
          kind: "DERIVED",
          passed: validation.passed,
          issueCount: validation.issues.length
        }
      ],

      issues: restitution.issues,

      firstHeldCoordinate: status === "HOLD" ? "F55:SOUTH_RESTITUTION_INTERPRETATION" : null,
      firstFailedCoordinate: null,
      firstConflictCoordinate: null,

      recommendedOwner: {
        ownerType: restitution.ownerType,
        subjectId:
          request &&
          request.construct &&
          typeof request.construct.constructId === "string"
            ? request.construct.constructId
            : null,
        contract: restitution.ownerContract,
        file: restitution.effectiveOwnerFile,
        component: restitution.ownerComponent,
        directionOnly: true,
        recommendedOwnerProvesDefect: false
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
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
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
        "Position 8 South restitution interpreter for continuation classification, owner recommendation, and return-path preparation.",
      quietLoad: true,
      threeDimensionalNative: true,
      consumesSouthHandoffProbeReceipt: true,
      explicitRestitutionPacketRequired: false,
      canDeriveOwnerFromHandoffTarget: true,
      restitutionInterpretationProvesRepair: false,
      restitutionInterpretationProvesReadiness: false,
      noClaims: NO_CLAIMS,
      generatedAt: nowIso()
    };

    definition.definitionHash = hash(definition);
    return deepFreeze(definition);
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
      threeDimensionalNative: true,
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
      PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
      RECEIPT: RECEIPT,
      VERSION: VERSION,
      FILE: FILE,
      STATION_ID: STATION_ID,
      CYCLE_POSITION: CYCLE_POSITION,
      FIBONACCI: FIBONACCI,
      NEWS: NEWS,

      getDefinitionReceipt: getDefinitionReceipt,
      executeCycleStation: executeCycleStation,
      getStatus: getStatus,

      validateStationRequest: validateStationRequest,
      interpretRestitution: interpretRestitution,
      clone: function exposedClone(value) {
        return deepFreeze(clonePlain(value, [], 0));
      },
      hash: hash,
      noClaims: NO_CLAIMS
    });
  }

  function publish(api) {
    if (!root || typeof root !== "object") return api;

    var existing = root.AUDRALIA_DIAGNOSTIC_SOUTH;

    if (
      existing &&
      existing.CONTRACT &&
      existing.CONTRACT !== CONTRACT &&
      existing.CONTRACT !== PREVIOUS_CONTRACT
    ) {
      root.AUDRALIA_DIAGNOSTIC_SOUTH_INSTALLATION_CONFLICT = deepFreeze({
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

    root.AUDRALIA_DIAGNOSTIC_SOUTH = api;
    root.AUDRALIA_DIAGNOSTIC_SOUTH_RESTITUTION = api;
    root.AUDRALIA_DIAGNOSTIC_SOUTH_INTERPRETATION = api;

    var namespace = ensureNamespace("AUDRALIA");

    if (namespace) {
      namespace.diagnosticSouth = api;

      if (!namespace.diagnostics || typeof namespace.diagnostics !== "object") {
        namespace.diagnostics = {};
      }

      namespace.diagnostics.south = api;
      namespace.diagnostics.southInterpretation = api;
    }

    root.AUDRALIA_DIAGNOSTIC_SOUTH_RECEIPT = getDefinitionReceipt();

    root.__AUDRALIA_DIAGNOSTIC_SOUTH_LOADED__ = true;
    root.__AUDRALIA_DIAGNOSTIC_SOUTH_STATION_ID__ = STATION_ID;
    root.__AUDRALIA_DIAGNOSTIC_SOUTH_VERSION__ = VERSION;
    root.__AUDRALIA_DIAGNOSTIC_SOUTH_CONTRACT__ = CONTRACT;

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

// /assets/audralia/audralia.diagnostic.south.js
// AUDRALIA_DIAGNOSTIC_SOUTH_RESTITUTION_INTERPRETATION_F55_3D_TNT_v3
// Full-file replacement.
// Quiet-load, dependency-free, 3D-native South restitution interpreter.
// Position 8 / F55 / SOUTH_RESTITUTION_INTERPRETATION.
// Consumes renewed F34 South handoff probe receipt.
// Does not repair, mutate production, authorize files, or claim readiness.

(function audraliaDiagnosticSouthRestitutionInterpretationF553DV3(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);

  var CONTRACT = "AUDRALIA_DIAGNOSTIC_SOUTH_RESTITUTION_INTERPRETATION_F55_3D_TNT_v3";
  var PREVIOUS_CONTRACT = "AUDRALIA_DIAGNOSTIC_SOUTH_RESTITUTION_INTERPRETATION_F55_3D_TNT_v2";
  var LEGACY_CONTRACT = "AUDRALIA_DIAGNOSTIC_SOUTH_RESTITUTION_INTERPRETATION_F55_3D_TNT_v1";
  var RECEIPT = "AUDRALIA_DIAGNOSTIC_SOUTH_RESTITUTION_INTERPRETATION_F55_3D_RECEIPT_v3";
  var VERSION = "3.0.0";
  var VERSION_LABEL = "2026-06-23.audralia-diagnostic-south-restitution-interpretation-f55-3d-v3";
  var FILE = "/assets/audralia/audralia.diagnostic.south.js";

  var STATION_ID = "SOUTH_RESTITUTION_INTERPRETATION";
  var CYCLE_POSITION = 8;
  var FIBONACCI = "F55";
  var NEWS = "SOUTH";

  var REQUEST_SCHEMA = "AUDRALIA_DIAGNOSTIC_STATION_EXECUTION_REQUEST_v1";
  var RECEIPT_SCHEMA = "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_STATION_RECEIPT_v1";

  var REQUIRED_PREDECESSOR = "SOUTH_PROBE_HANDOFF";
  var CURRENT_F34_CONTRACT = "AUDRALIA_DIAGNOSTIC_PROBE_SOUTH_HANDOFF_F34_3D_TNT_v3";
  var CURRENT_F34_FILE = "/assets/audralia/audralia.diagnostic.probe.south.js";
  var RAIL_FILE = "/assets/audralia/audralia.diagnostic.rail.js";

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
    restitutionOwnerProvesDefect: false,
    diagnosticPassProvesReady: false,
    railTerminalEligibilityProvesReadiness: false,
    readyClaimed: false,
    verifiedClaimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    f21Claimed: false,
    f89Claimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webGPU: false,
    directionOnly: true
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
      try {
        output[String(key).slice(0, LIMITS.maxStringLength)] =
          clonePlain(value[key], memory.slice(), level + 1);
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

  function hashReceipt(receipt) {
    var copy = clonePlain(receipt, [], 0);
    if (isPlainObject(copy)) copy.receiptHash = null;
    return hash(copy);
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

  function firstString() {
    for (var i = 0; i < arguments.length; i += 1) {
      if (typeof arguments[i] === "string" && arguments[i].trim()) {
        return arguments[i].slice(0, LIMITS.maxStringLength).trim();
      }
    }
    return null;
  }

  function firstObject() {
    for (var i = 0; i < arguments.length; i += 1) {
      if (isPlainObject(arguments[i])) return clonePlain(arguments[i], [], 0);
    }
    return null;
  }

  function firstBoolean() {
    for (var i = 0; i < arguments.length; i += 1) {
      if (typeof arguments[i] === "boolean") return arguments[i];
    }
    return null;
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
    var target = safeObject(request && request.target);
    var extensions = safeObject(request && request.extensions);

    return firstObject(
      construct.restitution,
      construct.southRestitution,
      construct.returnPath,
      engine.restitution,
      target.restitution,
      extensions.restitution,
      extensions.southRestitution,
      {}
    );
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
    var m = String(mode || "AUDIT").toUpperCase();

    if (!handoffAdmitted) return "HOLD_FOR_HANDOFF_REVIEW";
    if (m === "CONTINUE") return "CONTINUE_TO_RAIL_SYNTHESIS";
    if (m === "REPAIR") return "RESTITUTION_RECOMMENDED_DIRECTION_ONLY";
    if (m === "HOLD") return "HOLD_FOR_OWNER_REVIEW";
    if (m === "AUDIT") return "AUDIT_ONLY_RAIL_ELIGIBLE";
    if (effectiveOwnerFile) return "RESTITUTION_TARGET_AVAILABLE";
    return "OWNER_REVIEW_REQUIRED";
  }

  function readF34Handoff(request) {
    var receipt = findReceipt(request, REQUIRED_PREDECESSOR);

    var admission = extractObservation(receipt, "SOUTH_HANDOFF_ADMISSIBILITY");
    var target = extractObservation(receipt, "SOUTH_HANDOFF_TARGET_DECLARATION");
    var packetIntegrity = extractObservation(receipt, "SOUTH_HANDOFF_PACKET_INTEGRITY");
    var legacyPacket = extractObservation(receipt, "SOUTH_HANDOFF_PACKET_DECLARATION");
    var admissionEvidence = extractObservation(receipt, "SOUTH_HANDOFF_ADMISSION");

    var receiptPass = Boolean(receipt && receipt.status === "PASS" && receipt.handoffEligible === true);

    var handoffAdmitted = Boolean(
      receiptPass &&
      (
        (admission && admission.handoffAdmitted === true) ||
        (admissionEvidence && admissionEvidence.admitted === true)
      ) &&
      (
        (admission && admission.nextStationEligible === true) ||
        (admissionEvidence && admissionEvidence.admitted === true)
      )
    );

    var packetIntegrityValue = firstBoolean(
      packetIntegrity && packetIntegrity.packetIntegrity,
      admissionEvidence && admissionEvidence.packetIntegrity
    );

    var provenanceContinuityValue = firstBoolean(
      packetIntegrity && packetIntegrity.provenanceContinuity,
      admissionEvidence && admissionEvidence.provenanceContinuity
    );

    var outputCompletenessValue = firstBoolean(
      packetIntegrity && packetIntegrity.outputCompleteness,
      admissionEvidence && admissionEvidence.outputCompleteness
    );

    return deepFreeze({
      receiptObserved: Boolean(receipt),
      receipt: receipt ? clonePlain(receipt, [], 0) : null,
      receiptPass: receiptPass,
      receiptContract: receipt ? safeString(receipt.contract, null) : null,
      receiptHash: receipt ? safeString(receipt.receiptHash, null) : null,
      currentContractObserved: Boolean(receipt && receipt.contract === CURRENT_F34_CONTRACT),
      admission: admission ? clonePlain(admission, [], 0) : null,
      target: target ? clonePlain(target, [], 0) : null,
      packetIntegrityObservation: packetIntegrity ? clonePlain(packetIntegrity, [], 0) : null,
      legacyPacketObservation: legacyPacket ? clonePlain(legacyPacket, [], 0) : null,
      admissionEvidence: admissionEvidence ? clonePlain(admissionEvidence, [], 0) : null,
      handoffAdmitted: handoffAdmitted,
      nextStationEligible: handoffAdmitted,
      targetFile: firstString(
        target && target.targetFile,
        admissionEvidence && admissionEvidence.targetFile
      ),
      targetRoute: firstString(
        target && target.targetRoute,
        admissionEvidence && admissionEvidence.targetRoute
      ),
      restitutionCandidateFile: firstString(
        target && target.restitutionCandidateFile,
        target && target.southRestitutionFile
      ),
      downstreamOwner: firstString(
        target && target.downstreamOwner,
        "SOUTH_RESTITUTION_INTERPRETATION"
      ),
      packetKind: firstString(
        packetIntegrity && packetIntegrity.packetKind,
        legacyPacket && legacyPacket.packetKind,
        "DIAGNOSTIC_HANDOFF_PACKET"
      ),
      returnMode: firstString(
        packetIntegrity && packetIntegrity.returnMode,
        legacyPacket && legacyPacket.returnMode,
        "DIAGNOSTIC_RESTITUTION"
      ),
      packetIntegrity: packetIntegrityValue === true,
      provenanceContinuity: provenanceContinuityValue === true,
      outputCompleteness: outputCompletenessValue === true,
      recognizedCurrentGrammar: Boolean(admission || target || packetIntegrity || admissionEvidence)
    });
  }

  function interpretRestitution(request, validation) {
    var issues = validation.passed ? [] : validation.issues.slice();
    var f34 = readF34Handoff(request || {});
    var restitution = declaredRestitution(request || {});

    var requestedMode = firstString(restitution.mode, f34.returnMode, "AUDIT");
    var ownerType = firstString(restitution.ownerType, "DIAGNOSTIC_RESTITUTION_OWNER");
    var ownerContract = firstString(restitution.ownerContract, request && request.engine && request.engine.contract, null);
    var ownerComponent = firstString(restitution.ownerComponent, "SOUTH_RESTITUTION_INTERPRETATION");

    var recommendedFile = firstString(
      restitution.recommendedFile,
      restitution.ownerFile,
      f34.restitutionCandidateFile,
      f34.targetFile,
      f34.targetRoute,
      RAIL_FILE
    );

    var recommendedAction = firstString(
      restitution.recommendedAction,
      f34.handoffAdmitted ? "RAIL_TERMINAL_SYNTHESIS_REVIEW" : null,
      "REVIEW_SOUTH_HANDOFF_RESTITUTION"
    );

    var effectiveOwnerFile = recommendedFile;
    var ownerFileValid = validOwnerFile(effectiveOwnerFile);

    if (!f34.receiptObserved) {
      issues.push(issue("SOUTH_HANDOFF_RECEIPT_REQUIRED", "$.priorStationReceipts.SOUTH_PROBE_HANDOFF"));
    } else if (!f34.receiptPass) {
      issues.push(issue("SOUTH_HANDOFF_RECEIPT_NOT_PASSING", "$.priorStationReceipts.SOUTH_PROBE_HANDOFF"));
    }

    if (!f34.recognizedCurrentGrammar) {
      issues.push(issue("SOUTH_HANDOFF_GRAMMAR_NOT_RECOGNIZED", "$.priorStationReceipts.SOUTH_PROBE_HANDOFF.observations"));
    }

    if (!f34.handoffAdmitted) {
      issues.push(issue("SOUTH_HANDOFF_NOT_ADMITTED", "$.priorStationReceipts.SOUTH_PROBE_HANDOFF"));
    }

    if (!f34.packetIntegrity) {
      issues.push(issue("SOUTH_HANDOFF_PACKET_INTEGRITY_REQUIRED", "$.priorStationReceipts.SOUTH_PROBE_HANDOFF.SOUTH_HANDOFF_PACKET_INTEGRITY"));
    }

    if (!f34.provenanceContinuity) {
      issues.push(issue("SOUTH_HANDOFF_PROVENANCE_CONTINUITY_REQUIRED", "$.priorStationReceipts.SOUTH_PROBE_HANDOFF.SOUTH_HANDOFF_PACKET_INTEGRITY"));
    }

    if (!f34.outputCompleteness) {
      issues.push(issue("SOUTH_HANDOFF_OUTPUT_COMPLETENESS_REQUIRED", "$.priorStationReceipts.SOUTH_PROBE_HANDOFF.SOUTH_HANDOFF_PACKET_INTEGRITY"));
    }

    if (!effectiveOwnerFile) {
      issues.push(issue("RECOMMENDED_FILE_REQUIRED", "$.recommendedFile"));
    } else if (!ownerFileValid) {
      issues.push(issue("RECOMMENDED_FILE_SCOPE_INVALID", "$.recommendedFile"));
    }

    var railTerminalEligible = Boolean(
      validation.passed &&
      f34.receiptPass &&
      f34.handoffAdmitted &&
      f34.packetIntegrity &&
      f34.provenanceContinuity &&
      f34.outputCompleteness &&
      effectiveOwnerFile &&
      ownerFileValid &&
      issues.length === 0
    );

    var continuationClass = classifyContinuation(requestedMode, effectiveOwnerFile, f34.handoffAdmitted);

    var observations = [
      {
        id: "SOUTH_RESTITUTION_PRIOR_HANDOFF_STATUS",
        kind: "EXPOSED_RECEIPT",
        southProbeReceiptObserved: f34.receiptObserved,
        southProbeReceiptPass: f34.receiptPass,
        southProbeReceiptContract: f34.receiptContract,
        expectedSouthProbeContract: CURRENT_F34_CONTRACT,
        southProbeContractCurrent: f34.currentContractObserved,
        handoffAdmitted: f34.handoffAdmitted,
        nextStationEligible: f34.nextStationEligible,
        receiptHash: f34.receiptHash
      },
      {
        id: "SOUTH_RESTITUTION_F34_GRAMMAR_READ",
        kind: "DERIVED",
        recognizedCurrentGrammar: f34.recognizedCurrentGrammar,
        admissionObserved: Boolean(f34.admission),
        targetObserved: Boolean(f34.target),
        packetIntegrityObserved: Boolean(f34.packetIntegrityObservation),
        legacyPacketObserved: Boolean(f34.legacyPacketObservation),
        admissionEvidenceObserved: Boolean(f34.admissionEvidence)
      },
      {
        id: "SOUTH_RESTITUTION_HANDOFF_TARGET_READ",
        kind: "EXPOSED_RECEIPT",
        targetFile: f34.targetFile,
        targetRoute: f34.targetRoute,
        restitutionCandidateFile: f34.restitutionCandidateFile,
        downstreamOwner: f34.downstreamOwner,
        packetKind: f34.packetKind,
        returnMode: f34.returnMode
      },
      {
        id: "SOUTH_RESTITUTION_PACKET_CONTINUITY_READ",
        kind: "DERIVED",
        packetIntegrity: f34.packetIntegrity,
        provenanceContinuity: f34.provenanceContinuity,
        outputCompleteness: f34.outputCompleteness,
        packetIntegrityProvesRuntimeReady: false,
        provenanceContinuityProvesRuntimeReady: false,
        outputCompletenessProvesRuntimeReady: false
      },
      {
        id: "SOUTH_RESTITUTION_OWNER_RECOMMENDATION",
        kind: "DERIVED",
        requestedMode: requestedMode,
        ownerType: ownerType,
        ownerContract: ownerContract,
        ownerComponent: ownerComponent,
        recommendedFile: recommendedFile,
        recommendedAction: recommendedAction,
        ownerFileValid: ownerFileValid,
        directionOnly: true,
        restitutionOwnerProvesDefect: false
      },
      {
        id: "SOUTH_RESTITUTION_CONTINUATION_CLASSIFICATION",
        kind: "DERIVED",
        continuationClass: continuationClass,
        railTerminalEligible: railTerminalEligible,
        restitutionInterpretationProvesRepair: false,
        restitutionInterpretationProvesReadiness: false,
        diagnosticPassProvesReady: false,
        f89Claimed: false
      }
    ];

    return deepFreeze({
      f34: f34,
      observations: deepFreeze(observations),
      issues: deepFreeze(issues.slice(0, LIMITS.maxIssues)),
      ownerType: ownerType,
      ownerContract: ownerContract,
      ownerComponent: ownerComponent,
      recommendedFile: recommendedFile,
      recommendedAction: recommendedAction,
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
        ? "SOUTH_RESTITUTION_HELD_HANDOFF_OR_OWNER_INCOMPLETE"
        : "SOUTH_RESTITUTION_HELD_REQUEST_INVALID";

    var recommendedOwner = {
      ownerType: restitution.ownerType,
      subjectId:
        request &&
        request.construct &&
        typeof request.construct.constructId === "string"
          ? request.construct.constructId
          : STATION_ID,
      contract: restitution.ownerContract,
      file: restitution.recommendedFile,
      component: restitution.ownerComponent,
      directionOnly: true,
      recommendedOwnerProvesDefect: false
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
      legacyContract: LEGACY_CONTRACT,
      version: VERSION,
      versionLabel: VERSION_LABEL,
      file: FILE,

      status: status,
      completed: completed,
      handoffEligible: handoffEligible,
      summary: summary,

      observations: restitution.observations,
      restitutionInterpretation: {
        requestedMode: restitution.requestedMode,
        continuationClass: restitution.continuationClass,
        railTerminalEligible: restitution.railTerminalEligible,
        recommendedFile: restitution.recommendedFile,
        recommendedAction: restitution.recommendedAction,
        f34ReceiptHash: restitution.f34.receiptHash || null
      },

      evidence: [
        { id: "SOUTH_RESTITUTION_REQUEST_HASH", kind: "DERIVED", hash: hash(request || {}) },
        { id: "SOUTH_RESTITUTION_F34_HASH", kind: "DERIVED", hash: hash(restitution.f34) },
        { id: "SOUTH_RESTITUTION_OBSERVATION_HASH", kind: "DERIVED", hash: hash(restitution.observations) },
        {
          id: "SOUTH_RESTITUTION_RESULT",
          kind: "DERIVED",
          railTerminalEligible: restitution.railTerminalEligible,
          continuationClass: restitution.continuationClass,
          recommendedFile: restitution.recommendedFile,
          recommendedAction: restitution.recommendedAction,
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

      recommendedOwner: recommendedOwner,
      recommendedFile: restitution.recommendedFile,
      recommendedAction: restitution.recommendedAction,

      generatedAt: nowIso(),
      receiptHash: null,
      noClaims: clonePlain(NO_CLAIMS, [], 0)
    };

    receipt.receiptHash = hashReceipt(receipt);
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
      position: CYCLE_POSITION,
      fibonacci: FIBONACCI,
      news: NEWS,
      requestSchema: REQUEST_SCHEMA,
      receiptSchema: RECEIPT_SCHEMA,
      currentF34Contract: CURRENT_F34_CONTRACT,
      currentF34File: CURRENT_F34_FILE,
      railFile: RAIL_FILE,
      exactInterface: [
        "CONTRACT",
        "PREVIOUS_CONTRACT",
        "VERSION",
        "FILE",
        "STATION_ID",
        "CYCLE_POSITION",
        "FIBONACCI",
        "getDefinitionReceipt",
        "executeCycleStation",
        "getStatus"
      ],
      role:
        "Position 8 South restitution interpreter for F34 handoff grammar, packet continuity, owner recommendation, rail-terminal eligibility, and return-path preparation.",
      quietLoad: true,
      threeDimensionalNative: true,
      consumesCurrentF34: true,
      recognizesSouthHandoffPacketIntegrity: true,
      returnsCanonicalReceiptIdentity: true,
      returnsRecommendedFile: true,
      returnsRecommendedAction: true,
      explicitRestitutionPacketRequired: false,
      canDeriveOwnerFromHandoffTarget: true,
      restitutionInterpretationProvesRepair: false,
      restitutionInterpretationProvesReadiness: false,
      noClaims: clonePlain(NO_CLAIMS, [], 0),
      generatedAt: nowIso()
    };

    definition.definitionHash = hash(definition);
    return deepFreeze(definition);
  }

  function getStatus() {
    return deepFreeze({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      legacyContract: LEGACY_CONTRACT,
      version: VERSION,
      versionLabel: VERSION_LABEL,
      file: FILE,
      stationId: STATION_ID,
      cyclePosition: CYCLE_POSITION,
      position: CYCLE_POSITION,
      fibonacci: FIBONACCI,
      news: NEWS,
      loaded: true,
      readyForExplicitRegistration: true,
      conductorCompatible: true,
      threeDimensionalNative: true,
      consumesCurrentF34: true,
      returnsCanonicalReceiptIdentity: true,
      noClaims: clonePlain(NO_CLAIMS, [], 0)
    });
  }

  function ensureNamespace(name) {
    if (!root || typeof root !== "object") return null;
    if (!root[name] || typeof root[name] !== "object") root[name] = {};
    return root[name];
  }

  function buildApi() {
    return deepFreeze({
      schema: "AUDRALIA_DIAGNOSTIC_STATION_API_v2",

      CONTRACT: CONTRACT,
      PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
      LEGACY_CONTRACT: LEGACY_CONTRACT,
      RECEIPT: RECEIPT,
      VERSION: VERSION,
      VERSION_LABEL: VERSION_LABEL,
      FILE: FILE,
      STATION_ID: STATION_ID,
      CYCLE_POSITION: CYCLE_POSITION,
      FIBONACCI: FIBONACCI,
      NEWS: NEWS,
      CURRENT_F34_CONTRACT: CURRENT_F34_CONTRACT,
      RAIL_FILE: RAIL_FILE,

      stationId: STATION_ID,
      role: STATION_ID,
      cyclePosition: CYCLE_POSITION,
      position: CYCLE_POSITION,
      fibonacci: FIBONACCI,
      news: NEWS,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,

      getDefinitionReceipt: getDefinitionReceipt,
      executeCycleStation: executeCycleStation,
      execute: executeCycleStation,
      getStatus: getStatus,

      validateStationRequest: validateStationRequest,
      interpretRestitution: interpretRestitution,
      readF34Handoff: readF34Handoff,
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
      existing.CONTRACT !== PREVIOUS_CONTRACT &&
      existing.CONTRACT !== LEGACY_CONTRACT
    ) {
      root.AUDRALIA_DIAGNOSTIC_SOUTH_INSTALLATION_CONFLICT = deepFreeze({
        contract: CONTRACT,
        previousContract: PREVIOUS_CONTRACT,
        legacyContract: LEGACY_CONTRACT,
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
    root.AUDRALIA_DIAGNOSTIC_SOUTH_RESTITUTION_INTERPRETATION = api;

    var namespace = ensureNamespace("AUDRALIA");

    if (namespace) {
      namespace.diagnosticSouth = api;

      if (!namespace.diagnostics || typeof namespace.diagnostics !== "object") {
        namespace.diagnostics = {};
      }

      namespace.diagnostics.south = api;
      namespace.diagnostics.southInterpretation = api;
      namespace.diagnostics.southRestitution = api;
    }

    root.AUDRALIA_DIAGNOSTIC_SOUTH_RECEIPT = getDefinitionReceipt();
    root.AUDRALIA_DIAGNOSTIC_SOUTH_RESTITUTION_RECEIPT = getDefinitionReceipt();

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

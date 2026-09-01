// /assets/audralia/audralia.diagnostic.west.js
// AUDRALIA_DIAGNOSTIC_WEST_RUNTIME_INTERPRETATION_F21_3D_TNT_v3
// Full-file replacement.
// Quiet-load, dependency-free, 3D-native West runtime interpreter.
// Position 6 / F21 / WEST_RUNTIME_INTERPRETATION.
// Renewed to consume current F13 v4 runtime-evidence grammar.
// Diagnostic-only. Read-only. No mutation. No repair authority. No readiness claim.

(function audraliaDiagnosticWestRuntimeInterpretationF213DV3(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);

  var CONTRACT = "AUDRALIA_DIAGNOSTIC_WEST_RUNTIME_INTERPRETATION_F21_3D_TNT_v3";
  var PREVIOUS_CONTRACT = "AUDRALIA_DIAGNOSTIC_WEST_RUNTIME_INTERPRETATION_F21_3D_TNT_v2";
  var LEGACY_CONTRACT = "AUDRALIA_DIAGNOSTIC_WEST_RUNTIME_INTERPRETATION_F21_3D_TNT_v1";
  var VERSION = "3.0.0";
  var VERSION_LABEL = "2026-06-22.audralia-diagnostic-west-runtime-interpretation-f21-3d-v3";
  var FILE = "/assets/audralia/audralia.diagnostic.west.js";

  var STATION_ID = "WEST_RUNTIME_INTERPRETATION";
  var CYCLE_POSITION = 6;
  var FIBONACCI = "F21";
  var NEWS = "WEST";

  var REQUEST_SCHEMA = "AUDRALIA_DIAGNOSTIC_STATION_EXECUTION_REQUEST_v1";
  var RECEIPT_SCHEMA = "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_STATION_RECEIPT_v1";
  var API_SCHEMA = "AUDRALIA_DIAGNOSTIC_STATION_API_v2";
  var DEFINITION_RECEIPT_SCHEMA = "AUDRALIA_DIAGNOSTIC_STATION_DEFINITION_RECEIPT_v3";

  var REQUIRED_RECEIPTS = Object.freeze([
    "EAST_CONSTRUCTION_INTERPRETATION",
    "CANVAS_SURFACE_TRUTH",
    "WEST_PROBE_RUNTIME"
  ]);

  var CURRENT_F13_CONTRACT = "AUDRALIA_DIAGNOSTIC_PROBE_WEST_RUNTIME_F13_3D_TNT_v4";
  var CURRENT_F13_FILE = "/assets/audralia/audralia.diagnostic.probe.west.js";
  var NEXT_STATION_FILE = "/assets/audralia/audralia.diagnostic.probe.south.js";

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
    gpuResourceCreationAuthority: false,
    repairAuthorizationAuthority: false,
    fileAuthorizationAuthority: false,
    finalProductionVerdictAuthority: false,
    diagnosticPassProvesReady: false,
    runtimeMatchProvesCompletion: false,
    sourceRuntimeAgreementProvesVisualPass: false,
    presentationEvidenceProvesReadiness: false,
    sourcePresenceProvesRuntime: false,
    recommendedOwnerProvesDefect: false,
    directionProvesCulprit: false,
    readyClaimed: false,
    verifiedClaimed: false,
    f21Claimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
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
    var memory = seen || [];
    if (!value || typeof value !== "object") return value;
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
    var memory = seen || [];
    var level = Number(depth) || 0;

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
      return value.slice(0, LIMITS.maxArrayLength).map(function mapItem(item) {
        return clonePlain(item, memory.slice(), level + 1);
      });
    }

    var output = {};
    Object.keys(value).slice(0, LIMITS.maxObjectKeys).forEach(function eachKey(key) {
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
      return "{" + Object.keys(value).sort().map(function encodeKey(key) {
        return JSON.stringify(key) + ":" + stableStringify(value[key]);
      }).join(",") + "}";
    }
    return "null";
  }

  function hash(value) {
    var text = stableStringify(clonePlain(value, [], 0));
    var h = 0x811c9dc5;

    for (var index = 0; index < text.length; index += 1) {
      h ^= text.charCodeAt(index);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
      h >>>= 0;
    }

    return "fnv1a32:" + ("00000000" + h.toString(16)).slice(-8);
  }

  function issue(code, path, detail) {
    return {
      code: String(code || "ISSUE"),
      path: String(path || "$"),
      detail: String(detail || code || "ISSUE").slice(0, 512)
    };
  }

  function safeString(value, fallback) {
    if (fallback === undefined) fallback = null;
    if (typeof value !== "string") return fallback;
    var text = value.slice(0, LIMITS.maxStringLength).trim();
    return text || fallback;
  }

  function bool(value) {
    return typeof value === "boolean" ? value : null;
  }

  function stringFrom() {
    for (var index = 0; index < arguments.length; index += 1) {
      var resolved = safeString(arguments[index], null);
      if (resolved) return resolved;
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

        item.forEach(function eachArray(entry, arrayIndex) {
          walk(entry, path + "[" + arrayIndex + "]", depth + 1, seen.slice());
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
    if (!Array.isArray(request.priorStationReceipts)) issues.push(issue("PRIOR_STATION_RECEIPTS_ARRAY_REQUIRED", "$.priorStationReceipts"));

    return deepFreeze({
      passed: issues.length === 0,
      issues: deepFreeze(issues)
    });
  }

  function findReceipt(request, stationId) {
    var receipts = Array.isArray(request && request.priorStationReceipts)
      ? request.priorStationReceipts
      : [];

    for (var index = receipts.length - 1; index >= 0; index -= 1) {
      if (isPlainObject(receipts[index]) && receipts[index].stationId === stationId) {
        return receipts[index];
      }
    }

    return null;
  }

  function extractObservation(receipt, observationId) {
    if (!isPlainObject(receipt) || !Array.isArray(receipt.observations)) return null;

    for (var index = 0; index < receipt.observations.length; index += 1) {
      if (isPlainObject(receipt.observations[index]) && receipt.observations[index].id === observationId) {
        return receipt.observations[index];
      }
    }

    return null;
  }

  function collectReceipts(request) {
    var map = {};
    var status = {};

    REQUIRED_RECEIPTS.forEach(function each(stationId) {
      var receipt = findReceipt(request, stationId);

      map[stationId] = receipt ? clonePlain(receipt, [], 0) : null;

      status[stationId] = {
        observed: Boolean(receipt),
        status: receipt ? safeString(receipt.status, "UNKNOWN") : "MISSING",
        completed: receipt ? receipt.completed === true : false,
        handoffEligible: receipt ? receipt.handoffEligible === true : false,
        pass: Boolean(receipt && receipt.status === "PASS" && receipt.handoffEligible === true),
        receiptHash: receipt ? safeString(receipt.receiptHash, null) : null,
        normalizedReceiptHash: receipt ? safeString(receipt.normalizedReceiptHash, null) : null
      };
    });

    return {
      receipts: map,
      status: status
    };
  }

  function readEast(receipt) {
    var sourceEvidence = extractObservation(receipt, "EAST_INTERPRETATION_SOURCE_EVIDENCE");
    var packetConstruct = extractObservation(receipt, "EAST_INTERPRETATION_PACKET_CONSTRUCT");
    var predecessor = extractObservation(receipt, "EAST_INTERPRETATION_PREDECESSOR_RECEIPT");

    return deepFreeze({
      predecessorObserved: predecessor ? predecessor.observed === true : null,
      predecessorStatus: predecessor ? safeString(predecessor.status, null) : null,
      sourceFile: sourceEvidence ? safeString(sourceEvidence.sourceFile, null) : null,
      engineFile: sourceEvidence ? safeString(sourceEvidence.engineFile, null) : null,
      constructRootFile: sourceEvidence ? safeString(sourceEvidence.constructRootFile, null) : null,
      constructRoute: sourceEvidence ? safeString(sourceEvidence.constructRoute, null) : null,
      constructId: stringFrom(packetConstruct && packetConstruct.constructId, receipt && receipt.recommendedOwner && receipt.recommendedOwner.subjectId),
      constructContract: stringFrom(packetConstruct && packetConstruct.contract, receipt && receipt.recommendedOwner && receipt.recommendedOwner.contract),
      controllerContract: packetConstruct ? safeString(packetConstruct.controllerContract, null) : null,
      targetRoute: packetConstruct ? safeString(packetConstruct.targetRoute, null) : null,
      grammarRecognized: Boolean(sourceEvidence || packetConstruct)
    });
  }

  function readSurface(receipt) {
    var classification = extractObservation(receipt, "CANVAS_SURFACE_TRUTH_CLASSIFICATION");
    var runtimeStatus = extractObservation(receipt, "CANVAS_SURFACE_RUNTIME_STATUS");
    var targetFrame = extractObservation(receipt, "CANVAS_SURFACE_TARGET_FRAME");
    var targetBinding = extractObservation(receipt, "CANVAS_SURFACE_TARGET_BINDING");

    return deepFreeze({
      lifecycleClass: classification ? safeString(classification.lifecycleClass, null) : null,
      primaryVisible: classification ? bool(classification.primaryVisible) : null,
      fallbackVisible: classification ? bool(classification.fallbackVisible) : null,
      runtimeLifecyclePending: classification ? bool(classification.runtimeLifecyclePending) : null,
      surfaceTruthAdmitted: classification ? bool(classification.surfaceTruthAdmitted) : null,

      runtimeEvidenceAvailable: runtimeStatus ? bool(runtimeStatus.runtimeEvidenceAvailable) : null,
      backend: stringFrom(runtimeStatus && runtimeStatus.backend, runtimeStatus && runtimeStatus.mode),
      mounted: runtimeStatus ? bool(runtimeStatus.mounted) : null,
      running: runtimeStatus ? bool(runtimeStatus.running) : null,
      stageRectNonzero: runtimeStatus ? bool(runtimeStatus.stageRectNonzero) : null,
      geometryReady: runtimeStatus ? bool(runtimeStatus.geometryReady) : null,
      firstFrameDrawn: runtimeStatus ? bool(runtimeStatus.firstFrameDrawn) : null,
      visiblePixelObserved: runtimeStatus ? bool(runtimeStatus.visiblePixelObserved) : null,
      webGL: runtimeStatus ? bool(runtimeStatus.webGL) : null,

      runtimeGlobalPresent: targetFrame ? bool(targetFrame.runtimeGlobalPresent) : null,
      runtimeGlobalName: targetFrame ? safeString(targetFrame.runtimeGlobalName, null) : null,
      routeMatched: targetBinding ? bool(targetBinding.routeMatched) : null,
      documentLoaded: targetBinding ? bool(targetBinding.documentLoaded) : null,

      grammarRecognized: Boolean(classification || runtimeStatus || targetFrame || targetBinding)
    });
  }

  function readWestProbe(receipt) {
    var handoff = extractObservation(receipt, "WEST_RUNTIME_F8_HANDOFF");
    var source = extractObservation(receipt, "WEST_RUNTIME_EVIDENCE_SOURCE");
    var ledgerObservation = extractObservation(receipt, "WEST_RUNTIME_FIELD_LEDGER");
    var classification = extractObservation(receipt, "WEST_RUNTIME_CLASSIFICATION");

    var runtimePacket = isPlainObject(receipt && receipt.runtimeProbePacket)
      ? receipt.runtimeProbePacket
      : {};

    var fieldLedger = isPlainObject(ledgerObservation && ledgerObservation.fields)
      ? ledgerObservation.fields
      : isPlainObject(runtimePacket.fieldLedger)
        ? runtimePacket.fieldLedger
        : {};

    function ledgerValue(field) {
      return fieldLedger[field] && Object.prototype.hasOwnProperty.call(fieldLedger[field], "value")
        ? fieldLedger[field].value
        : null;
    }

    return deepFreeze({
      f8ReceiptObserved: handoff ? bool(handoff.receiptObserved) : null,
      f8ReceiptPass: handoff ? bool(handoff.receiptPass) : null,
      f8AdmissionRecognized: handoff ? bool(handoff.admissionRecognized) : null,
      f8AdmissionClass: handoff ? safeString(handoff.admissionClass, null) : null,
      f8ContractCurrent: handoff ? bool(handoff.f8ContractCurrent) : null,
      expectedF8Contract: handoff ? safeString(handoff.expectedF8Contract, null) : null,

      evidenceSource: source ? safeString(source.source, null) : safeString(runtimePacket.source, null),
      canonicalPresent: source ? bool(source.canonicalPresent) : null,
      legacyPresent: source ? bool(source.legacyPresent) : null,
      framePresent: source ? bool(source.framePresent) : null,

      classification: classification ? safeString(classification.classification, null) : safeString(runtimePacket.classification, null),
      runtimeEvidenceAdmitted: classification ? bool(classification.runtimeEvidenceAdmitted) : bool(runtimePacket.runtimeEvidenceAdmitted),
      nextStationEligible: classification ? bool(classification.nextStationEligible) : bool(runtimePacket.nextStationEligible),
      runtimeEvidenceTransported: classification ? bool(classification.runtimeEvidenceTransported) : true,
      westPassMeansEvidenceTransportOnly: classification ? bool(classification.westPassMeansEvidenceTransportOnly) : null,

      runtimeGlobalPresent: ledgerValue("runtimeGlobalPresent"),
      runtimeGlobalName: ledgerValue("runtimeGlobalName"),
      mounted: ledgerValue("mounted"),
      running: ledgerValue("running"),
      stageRectNonzero: ledgerValue("stageRectNonzero"),
      geometryReady: ledgerValue("geometryReady"),
      firstFrameDrawn: ledgerValue("firstFrameDrawn"),
      visiblePixelObserved: ledgerValue("visiblePixelObserved"),
      contextLost: ledgerValue("contextLost"),
      errorCount: ledgerValue("errorCount"),
      backend: ledgerValue("mode"),

      fieldLedger: clonePlain(fieldLedger, [], 0),
      runtimePacket: clonePlain(runtimePacket, [], 0),
      grammarRecognized: Boolean(handoff || source || ledgerObservation || classification || Object.keys(runtimePacket).length)
    });
  }

  function compatibleBackend(surfaceBackend, runtimeBackend) {
    var left = safeString(surfaceBackend, "");
    var right = safeString(runtimeBackend, "");

    if (!left || !right) return null;

    left = left.toLowerCase();
    right = right.toLowerCase();

    if (left === right) return true;
    if ((left === "webgl" && right === "webgl2") || (left === "webgl2" && right === "webgl")) return true;

    return false;
  }

  function buildInterpretation(request, validation) {
    var collected = collectReceipts(request || {});

    var eastReceipt = collected.receipts.EAST_CONSTRUCTION_INTERPRETATION;
    var surfaceReceipt = collected.receipts.CANVAS_SURFACE_TRUTH;
    var westProbeReceipt = collected.receipts.WEST_PROBE_RUNTIME;

    var east = readEast(eastReceipt);
    var surface = readSurface(surfaceReceipt);
    var west = readWestProbe(westProbeReceipt);

    var backendCompatible = compatibleBackend(surface.backend, west.backend);

    var sourceRuntimeIdentityLinked = Boolean(
      east.constructId &&
      (
        west.runtimeGlobalName ||
        west.backend ||
        west.runtimeGlobalPresent === true ||
        west.runtimeEvidenceTransported === true
      )
    );

    var runtimeAdmissionRecognized = Boolean(
      west.runtimeEvidenceAdmitted === true &&
      west.nextStationEligible === true
    );

    var sourceRuntimeAgreement = Boolean(
      collected.status.EAST_CONSTRUCTION_INTERPRETATION.pass &&
      collected.status.CANVAS_SURFACE_TRUTH.pass &&
      collected.status.WEST_PROBE_RUNTIME.pass &&
      east.grammarRecognized &&
      surface.grammarRecognized &&
      west.grammarRecognized &&
      surface.surfaceTruthAdmitted === true &&
      runtimeAdmissionRecognized &&
      (backendCompatible === true || backendCompatible === null) &&
      sourceRuntimeIdentityLinked
    );

    var issues = [];

    if (!validation.passed) issues = issues.concat(validation.issues);

    REQUIRED_RECEIPTS.forEach(function requireReceipt(stationId) {
      var state = collected.status[stationId];

      if (!state.observed) {
        issues.push(issue(stationId + "_RECEIPT_REQUIRED", "$.priorStationReceipts", stationId + " predecessor receipt was not available."));
      } else if (!state.pass) {
        issues.push(issue(stationId + "_RECEIPT_NOT_PASSING", "$.priorStationReceipts", stationId + " predecessor receipt was present but did not pass with handoff eligibility."));
      }
    });

    if (eastReceipt && !east.grammarRecognized) {
      issues.push(issue("EAST_INTERPRETATION_GRAMMAR_NOT_RECOGNIZED", "$.priorStationReceipts.EAST_CONSTRUCTION_INTERPRETATION.observations", "F21 could not recognize current F5 source-construction grammar."));
    }

    if (surfaceReceipt && !surface.grammarRecognized) {
      issues.push(issue("SURFACE_TRUTH_GRAMMAR_NOT_RECOGNIZED", "$.priorStationReceipts.CANVAS_SURFACE_TRUTH.observations", "F21 could not recognize current F8 surface-truth grammar."));
    }

    if (westProbeReceipt && !west.grammarRecognized) {
      issues.push(issue("WEST_RUNTIME_PROBE_GRAMMAR_NOT_RECOGNIZED", "$.priorStationReceipts.WEST_PROBE_RUNTIME.observations", "F21 could not recognize current F13 v4 runtime-probe grammar."));
    }

    if (surfaceReceipt && surface.surfaceTruthAdmitted !== true) {
      issues.push(issue("SURFACE_TRUTH_NOT_ADMITTED", "$.priorStationReceipts.CANVAS_SURFACE_TRUTH", "F8 did not expose admitted surface truth."));
    }

    if (westProbeReceipt && !runtimeAdmissionRecognized) {
      issues.push(issue("WEST_RUNTIME_EVIDENCE_NOT_ADMITTED", "$.priorStationReceipts.WEST_PROBE_RUNTIME", "F13 did not admit runtime evidence for F21 interpretation."));
    }

    if (backendCompatible === false) {
      issues.push(issue("SURFACE_RUNTIME_BACKEND_MISMATCH", "$.priorStationReceipts", "Surface backend and runtime backend were both present but incompatible."));
    }

    if (!sourceRuntimeIdentityLinked) {
      issues.push(issue("SOURCE_RUNTIME_IDENTITY_LINK_INCOMPLETE", "$.priorStationReceipts", "F21 could not link declared construct identity to observed runtime evidence."));
    }

    var classification = issues.length
      ? "WEST_RUNTIME_INTERPRETATION_HELD_ALIGNMENT_INCOMPLETE"
      : "WEST_RUNTIME_INTERPRETATION_ADMITTED_FOR_SOUTH_HANDOFF_PROBE";

    return deepFreeze({
      receiptStatus: collected.status,
      east: east,
      surface: surface,
      west: west,
      backendCompatible: backendCompatible,
      sourceRuntimeIdentityLinked: sourceRuntimeIdentityLinked,
      runtimeAdmissionRecognized: runtimeAdmissionRecognized,
      sourceRuntimeAgreement: sourceRuntimeAgreement,
      southProbeEligible: issues.length === 0,
      classification: classification,
      issues: deepFreeze(issues.slice(0, LIMITS.maxIssues))
    });
  }

  function buildObservations(interpretation) {
    return deepFreeze([
      {
        id: "WEST_INTERPRETATION_PRIOR_RECEIPT_STATUS",
        kind: "EXPOSED_RECEIPT",
        receipts: interpretation.receiptStatus
      },
      {
        id: "WEST_INTERPRETATION_EAST_SOURCE_CONSTRUCTION",
        kind: "DERIVED",
        grammarRecognized: interpretation.east.grammarRecognized,
        constructId: interpretation.east.constructId,
        constructContract: interpretation.east.constructContract,
        controllerContract: interpretation.east.controllerContract,
        sourceFile: interpretation.east.sourceFile,
        engineFile: interpretation.east.engineFile,
        constructRootFile: interpretation.east.constructRootFile,
        constructRoute: interpretation.east.constructRoute,
        targetRoute: interpretation.east.targetRoute
      },
      {
        id: "WEST_INTERPRETATION_SURFACE_TRUTH",
        kind: "DERIVED",
        grammarRecognized: interpretation.surface.grammarRecognized,
        lifecycleClass: interpretation.surface.lifecycleClass,
        surfaceTruthAdmitted: interpretation.surface.surfaceTruthAdmitted,
        primaryVisible: interpretation.surface.primaryVisible,
        fallbackVisible: interpretation.surface.fallbackVisible,
        runtimeLifecyclePending: interpretation.surface.runtimeLifecyclePending,
        runtimeEvidenceAvailable: interpretation.surface.runtimeEvidenceAvailable,
        backend: interpretation.surface.backend,
        runtimeGlobalPresent: interpretation.surface.runtimeGlobalPresent,
        runtimeGlobalName: interpretation.surface.runtimeGlobalName,
        routeMatched: interpretation.surface.routeMatched,
        documentLoaded: interpretation.surface.documentLoaded
      },
      {
        id: "WEST_INTERPRETATION_RUNTIME_PROBE",
        kind: "DERIVED",
        grammarRecognized: interpretation.west.grammarRecognized,
        currentF13Contract: CURRENT_F13_CONTRACT,
        f8ContractCurrent: interpretation.west.f8ContractCurrent,
        runtimeEvidenceSource: interpretation.west.evidenceSource,
        runtimeAdmissionClassification: interpretation.west.classification,
        runtimeEvidenceAdmitted: interpretation.west.runtimeEvidenceAdmitted,
        nextStationEligible: interpretation.west.nextStationEligible,
        runtimeEvidenceTransported: interpretation.west.runtimeEvidenceTransported,
        runtimeGlobalPresent: interpretation.west.runtimeGlobalPresent,
        runtimeGlobalName: interpretation.west.runtimeGlobalName,
        backend: interpretation.west.backend,
        contextLost: interpretation.west.contextLost,
        errorCount: interpretation.west.errorCount
      },
      {
        id: "WEST_INTERPRETATION_SOURCE_RUNTIME_ALIGNMENT",
        kind: "DERIVED",
        backendCompatible: interpretation.backendCompatible,
        sourceRuntimeIdentityLinked: interpretation.sourceRuntimeIdentityLinked,
        runtimeAdmissionRecognized: interpretation.runtimeAdmissionRecognized,
        sourceRuntimeAgreement: interpretation.sourceRuntimeAgreement,
        southProbeEligible: interpretation.southProbeEligible,
        classification: interpretation.classification
      },
      {
        id: "WEST_INTERPRETATION_HANDOFF_ELIGIBILITY",
        kind: "DERIVED",
        southProbeEligible: interpretation.southProbeEligible,
        nextStationFile: NEXT_STATION_FILE,
        nextStationId: "SOUTH_PROBE_HANDOFF",
        packetIntegrity: interpretation.southProbeEligible,
        provenanceContinuity: interpretation.southProbeEligible,
        outputCompleteness: interpretation.southProbeEligible,
        directionOnly: true
      },
      {
        id: "WEST_INTERPRETATION_BOUNDARY",
        kind: "DERIVED",
        sourceRuntimeAgreementProvesVisualPass: false,
        runtimeMatchProvesCompletion: false,
        presentationEvidenceProvesReadiness: false,
        diagnosticPassProvesReady: false,
        recommendedOwnerProvesDefect: false,
        directionProvesCulprit: false
      }
    ]);
  }

  function executeCycleStation(request) {
    var validation = validateStationRequest(request);
    var interpretation = buildInterpretation(request || {}, validation);

    var status = interpretation.issues.length ? "HOLD" : "PASS";
    var completed = status === "PASS";
    var handoffEligible = status === "PASS";

    var observations = buildObservations(interpretation);

    var recommendedOwner = {
      ownerType: status === "PASS" ? "DIAGNOSTIC_HANDOFF_NEXT_STATION" : "SOURCE_RUNTIME_ALIGNMENT",
      subjectId: interpretation.east.constructId || STATION_ID,
      contract: status === "PASS" ? null : interpretation.east.constructContract || CURRENT_F13_CONTRACT,
      file: status === "PASS"
        ? NEXT_STATION_FILE
        : interpretation.west.runtimePacket && interpretation.west.runtimePacket.nextStationFile
          ? interpretation.west.runtimePacket.nextStationFile
          : CURRENT_F13_FILE,
      component: status === "PASS" ? "SOUTH_PROBE_HANDOFF" : "F21_ALIGNMENT_REVIEW",
      classification: interpretation.classification,
      reason: status === "PASS" ? "HANDOFF_ELIGIBLE" : "ALIGNMENT_INCOMPLETE",
      provenCulprit: false,
      directionOnly: true
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
      summary: interpretation.classification,

      observations: observations,
      sourceRuntimeInterpretation: interpretation,

      evidence: [
        { id: "WEST_INTERPRETATION_REQUEST_HASH", kind: "DERIVED", hash: hash(request || {}) },
        { id: "WEST_INTERPRETATION_RECEIPT_STATUS_HASH", kind: "DERIVED", hash: hash(interpretation.receiptStatus) },
        {
          id: "WEST_INTERPRETATION_SOURCE_RUNTIME_HASH",
          kind: "DERIVED",
          hash: hash({
            east: interpretation.east,
            surface: interpretation.surface,
            west: interpretation.west
          })
        },
        {
          id: "WEST_INTERPRETATION_ALIGNMENT_RESULT",
          kind: "DERIVED",
          southProbeEligible: interpretation.southProbeEligible,
          backendCompatible: interpretation.backendCompatible,
          sourceRuntimeIdentityLinked: interpretation.sourceRuntimeIdentityLinked,
          runtimeAdmissionRecognized: interpretation.runtimeAdmissionRecognized,
          sourceRuntimeAgreement: interpretation.sourceRuntimeAgreement
        },
        {
          id: "WEST_INTERPRETATION_VALIDATION",
          kind: "DERIVED",
          passed: validation.passed,
          issueCount: validation.issues.length
        }
      ],

      issues: interpretation.issues,

      firstHeldCoordinate: status === "HOLD" ? "F21:WEST_RUNTIME_INTERPRETATION" : null,
      firstFailedCoordinate: null,
      firstConflictCoordinate: null,

      recommendedOwner: recommendedOwner,
      recommendedFile: recommendedOwner.file,
      recommendedAction: status === "PASS"
        ? "HANDOFF_TO_F34_SOUTH_PROBE"
        : "REVIEW_F13_RUNTIME_EVIDENCE_AND_SOURCE_RUNTIME_ALIGNMENT",

      generatedAt: nowIso(),
      receiptHash: null,
      noClaims: NO_CLAIMS
    };

    receipt.receiptHash = hash(receipt);

    return deepFreeze(receipt);
  }

  function getDefinitionReceipt() {
    var definition = {
      schema: DEFINITION_RECEIPT_SCHEMA,
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
      requiredReceipts: REQUIRED_RECEIPTS.slice(),
      currentF13Contract: CURRENT_F13_CONTRACT,
      currentF13File: CURRENT_F13_FILE,
      nextStationFile: NEXT_STATION_FILE,

      canonicalReceiptIdentityComplete: true,
      consumesCurrentF13V4Grammar: true,
      currentF5GrammarRecognized: true,
      currentF8GrammarRecognized: true,
      currentF13GrammarRecognized: true,
      sourceRuntimeAlignmentPublished: true,
      southProbeEligibilityPublished: true,

      exactInterface: [
        "CONTRACT",
        "PREVIOUS_CONTRACT",
        "VERSION",
        "FILE",
        "STATION_ID",
        "CYCLE_POSITION",
        "getDefinitionReceipt",
        "executeCycleStation",
        "getStatus"
      ],

      role:
        "Position 6 West runtime interpreter for current F5 source-construction evidence, current F8 surface truth, current F13 v4 runtime probe admission, source-runtime alignment, and South handoff eligibility.",

      quietLoad: true,
      threeDimensionalNative: true,
      createsRuntimeEvidence: false,
      createsGPUResources: false,
      liveRuntimeMutation: false,
      runtimeMatchProvesCompletion: false,
      sourceRuntimeAgreementProvesVisualPass: false,
      presentationEvidenceProvesReadiness: false,
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
      legacyContract: LEGACY_CONTRACT,
      version: VERSION,
      versionLabel: VERSION_LABEL,
      file: FILE,
      stationId: STATION_ID,
      cyclePosition: CYCLE_POSITION,
      fibonacci: FIBONACCI,
      news: NEWS,
      loaded: true,
      readyForExplicitRegistration: true,
      currentF5GrammarRecognized: true,
      currentF8GrammarRecognized: true,
      currentF13GrammarRecognized: true,
      consumesCurrentF13V4Grammar: true,
      threeDimensionalNative: true,
      noClaims: NO_CLAIMS
    });
  }

  function buildApi() {
    return deepFreeze({
      schema: API_SCHEMA,

      CONTRACT: CONTRACT,
      PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
      LEGACY_CONTRACT: LEGACY_CONTRACT,
      VERSION: VERSION,
      VERSION_LABEL: VERSION_LABEL,
      FILE: FILE,

      STATION_ID: STATION_ID,
      CYCLE_POSITION: CYCLE_POSITION,
      FIBONACCI: FIBONACCI,
      NEWS: NEWS,
      REQUIRED_RECEIPTS: REQUIRED_RECEIPTS,

      stationId: STATION_ID,
      cyclePosition: CYCLE_POSITION,
      fibonacci: FIBONACCI,
      news: NEWS,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      legacyContract: LEGACY_CONTRACT,
      version: VERSION,
      versionLabel: VERSION_LABEL,
      file: FILE,
      role: STATION_ID,

      getDefinitionReceipt: getDefinitionReceipt,
      executeCycleStation: executeCycleStation,
      execute: executeCycleStation,
      getStatus: getStatus,
      validateStationRequest: validateStationRequest,

      clone: function exposedClone(value) {
        return deepFreeze(clonePlain(value, [], 0));
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

    var existing = root.AUDRALIA_DIAGNOSTIC_WEST;

    if (
      existing &&
      existing.CONTRACT &&
      existing.CONTRACT !== CONTRACT &&
      existing.CONTRACT !== PREVIOUS_CONTRACT &&
      existing.CONTRACT !== LEGACY_CONTRACT
    ) {
      root.AUDRALIA_DIAGNOSTIC_WEST_INSTALLATION_CONFLICT = deepFreeze({
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

    root.AUDRALIA_DIAGNOSTIC_WEST = api;
    root.AUDRALIA_DIAGNOSTIC_WEST_RUNTIME_INTERPRETATION = api;

    var namespace = ensureNamespace("AUDRALIA");

    if (namespace) {
      namespace.diagnosticWest = api;

      if (!namespace.diagnostics || typeof namespace.diagnostics !== "object") {
        namespace.diagnostics = {};
      }

      namespace.diagnostics.west = api;
      namespace.diagnostics.westInterpretation = api;
    }

    root.AUDRALIA_DIAGNOSTIC_WEST_RECEIPT = getDefinitionReceipt();

    root.__AUDRALIA_DIAGNOSTIC_WEST_LOADED__ = true;
    root.__AUDRALIA_DIAGNOSTIC_WEST_STATION_ID__ = STATION_ID;
    root.__AUDRALIA_DIAGNOSTIC_WEST_VERSION__ = VERSION;
    root.__AUDRALIA_DIAGNOSTIC_WEST_CONTRACT__ = CONTRACT;

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

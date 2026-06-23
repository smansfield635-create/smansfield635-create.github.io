// /assets/audralia/audralia.diagnostic.probe.south.js
// AUDRALIA_DIAGNOSTIC_PROBE_SOUTH_HANDOFF_F34_3D_TNT_v2
// Full-file replacement.
// Quiet-load, dependency-free, 3D-native South handoff probe.
// Implements Position 7 / F34 / SOUTH_PROBE_HANDOFF.
// Consumes the renewed F21 West runtime interpretation receipt.
// Produces bounded packet-integrity, provenance-continuity, output-completeness,
// downstream-target, restitution-candidate, and South-return admissibility evidence.
// Does not mutate runtime, repair files, authorize production, or claim readiness.

(function audraliaDiagnosticProbeSouthHandoffF343DV2(global) {
  "use strict";

  var root =
    global ||
    (
      typeof window !== "undefined"
        ? window
        : typeof globalThis !== "undefined"
          ? globalThis
          : this
    );

  var CONTRACT =
    "AUDRALIA_DIAGNOSTIC_PROBE_SOUTH_HANDOFF_F34_3D_TNT_v2";

  var PREVIOUS_CONTRACT =
    "AUDRALIA_DIAGNOSTIC_PROBE_SOUTH_HANDOFF_F34_3D_TNT_v1";

  var RECEIPT =
    "AUDRALIA_DIAGNOSTIC_PROBE_SOUTH_HANDOFF_F34_3D_RECEIPT_v2";

  var VERSION =
    "2.0.0";

  var VERSION_LABEL =
    "2026-06-22.audralia-diagnostic-probe-south-handoff-f34-3d-v2";

  var FILE =
    "/assets/audralia/audralia.diagnostic.probe.south.js";

  var STATION_ID =
    "SOUTH_PROBE_HANDOFF";

  var CYCLE_POSITION =
    7;

  var FIBONACCI =
    "F34";

  var NEWS =
    "SOUTH";

  var REQUEST_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_STATION_EXECUTION_REQUEST_v1";

  var RECEIPT_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_STATION_RECEIPT_v1";

  var CURRENT_F21_CONTRACT =
    "AUDRALIA_DIAGNOSTIC_WEST_RUNTIME_INTERPRETATION_F21_3D_TNT_v2";

  var CURRENT_F21_FILE =
    "/assets/audralia/audralia.diagnostic.west.js";

  var SOUTH_RESTITUTION_FILE =
    "/assets/audralia/audralia.diagnostic.south.js";

  var SOUTH_SURFACE_POINTER_FILE =
    "/assets/audralia/audralia.diagnostic.south.surface.pointer.js";

  var LIMITS =
    Object.freeze({
      maxStringLength: 12000,
      maxArrayLength: 377,
      maxObjectKeys: 233,
      maxDepth: 13,
      maxIssues: 89
    });

  var NO_CLAIMS =
    Object.freeze({
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
    try {
      return new Date().toISOString();
    } catch (_error) {
      return null;
    }
  }

  function isFiniteNumber(value) {
    return (
      typeof value === "number" &&
      Number.isFinite(value)
    );
  }

  function isPlainObject(value) {
    if (
      !value ||
      typeof value !== "object" ||
      Array.isArray(value)
    ) {
      return false;
    }

    var proto =
      Object.getPrototypeOf(value);

    return (
      proto === Object.prototype ||
      proto === null
    );
  }

  function deepFreeze(value, seen) {
    if (
      !value ||
      typeof value !== "object"
    ) {
      return value;
    }

    var memory =
      seen || [];

    if (
      memory.indexOf(value) !== -1
    ) {
      return value;
    }

    memory.push(value);

    try {
      Object.keys(value)
        .forEach(function freezeKey(key) {
          deepFreeze(
            value[key],
            memory
          );
        });

      Object.freeze(value);
    } catch (_error) {}

    return value;
  }

  function issue(code, path, detail) {
    return {
      code:
        String(code || "ISSUE"),

      path:
        String(path || "$"),

      detail:
        String(detail || code || "ISSUE")
          .slice(0, 512)
    };
  }

  function clonePlain(value, seen, depth) {
    var memory =
      seen || [];

    var level =
      Number(depth) || 0;

    if (
      level >
      LIMITS.maxDepth
    ) {
      return null;
    }

    if (
      value === null ||
      typeof value === "string" ||
      typeof value === "boolean"
    ) {
      return value;
    }

    if (isFiniteNumber(value)) {
      return value;
    }

    if (
      value === undefined ||
      typeof value === "number" ||
      typeof value === "function" ||
      typeof value === "symbol" ||
      typeof value === "bigint"
    ) {
      return null;
    }

    if (
      !value ||
      typeof value !== "object"
    ) {
      return null;
    }

    if (
      !Array.isArray(value) &&
      !isPlainObject(value)
    ) {
      return null;
    }

    if (
      memory.indexOf(value) !== -1
    ) {
      return null;
    }

    memory.push(value);

    if (Array.isArray(value)) {
      return value
        .slice(0, LIMITS.maxArrayLength)
        .map(function mapItem(item) {
          return clonePlain(
            item,
            memory.slice(),
            level + 1
          );
        });
    }

    var output = {};
    var keys = [];

    try {
      keys =
        Object.keys(value)
          .slice(0, LIMITS.maxObjectKeys);
    } catch (_error) {
      return null;
    }

    keys.forEach(function eachKey(key) {
      var safeKey =
        String(key)
          .slice(0, LIMITS.maxStringLength);

      try {
        output[safeKey] =
          clonePlain(
            value[key],
            memory.slice(),
            level + 1
          );
      } catch (_error2) {
        output[safeKey] = null;
      }
    });

    return output;
  }

  function stableStringify(value) {
    if (value === null) {
      return "null";
    }

    if (typeof value === "string") {
      return JSON.stringify(value);
    }

    if (typeof value === "boolean") {
      return value ? "true" : "false";
    }

    if (isFiniteNumber(value)) {
      return String(value);
    }

    if (Array.isArray(value)) {
      return (
        "[" +
        value.map(stableStringify).join(",") +
        "]"
      );
    }

    if (isPlainObject(value)) {
      return (
        "{" +
        Object.keys(value)
          .sort()
          .map(function encodeKey(key) {
            return (
              JSON.stringify(key) +
              ":" +
              stableStringify(value[key])
            );
          })
          .join(",") +
        "}"
      );
    }

    return "null";
  }

  function hash(value) {
    var text =
      stableStringify(
        clonePlain(value, [], 0)
      );

    var h =
      0x811c9dc5;

    for (
      var i = 0;
      i < text.length;
      i += 1
    ) {
      h ^= text.charCodeAt(i);

      h +=
        (h << 1) +
        (h << 4) +
        (h << 7) +
        (h << 8) +
        (h << 24);

      h >>>= 0;
    }

    return (
      "fnv1a32:" +
      (
        "00000000" +
        h.toString(16)
      ).slice(-8)
    );
  }

  function safeString(value, fallback) {
    if (fallback === undefined) {
      fallback = null;
    }

    if (typeof value !== "string") {
      return fallback;
    }

    var normalized =
      value
        .slice(0, LIMITS.maxStringLength)
        .trim();

    return normalized || fallback;
  }

  function safeObject(value) {
    return isPlainObject(value)
      ? clonePlain(value, [], 0)
      : {};
  }

  function safeArray(value) {
    return Array.isArray(value)
      ? clonePlain(value, [], 0)
      : [];
  }

  function firstString() {
    for (
      var i = 0;
      i < arguments.length;
      i += 1
    ) {
      if (
        typeof arguments[i] === "string" &&
        arguments[i].length
      ) {
        return arguments[i]
          .slice(0, LIMITS.maxStringLength);
      }
    }

    return null;
  }

  function firstObject() {
    for (
      var i = 0;
      i < arguments.length;
      i += 1
    ) {
      if (isPlainObject(arguments[i])) {
        return clonePlain(arguments[i], [], 0);
      }
    }

    return null;
  }

  function validatePlainData(value) {
    var issues = [];

    function walk(item, path, depth, seen) {
      if (
        issues.length >=
        LIMITS.maxIssues
      ) {
        return;
      }

      if (
        depth >
        LIMITS.maxDepth
      ) {
        issues.push(
          issue(
            "DEPTH_LIMIT_EXCEEDED",
            path
          )
        );

        return;
      }

      if (
        item === null ||
        typeof item === "string" ||
        typeof item === "boolean" ||
        isFiniteNumber(item)
      ) {
        return;
      }

      if (
        item === undefined ||
        typeof item === "function" ||
        typeof item === "symbol" ||
        typeof item === "bigint"
      ) {
        issues.push(
          issue(
            "NON_PLAIN_VALUE_FORBIDDEN",
            path
          )
        );

        return;
      }

      if (typeof item === "number") {
        issues.push(
          issue(
            "NONFINITE_NUMBER_FORBIDDEN",
            path
          )
        );

        return;
      }

      if (
        !item ||
        typeof item !== "object"
      ) {
        issues.push(
          issue(
            "NON_PLAIN_VALUE_FORBIDDEN",
            path
          )
        );

        return;
      }

      if (
        !Array.isArray(item) &&
        !isPlainObject(item)
      ) {
        issues.push(
          issue(
            "NON_PLAIN_OBJECT_FORBIDDEN",
            path
          )
        );

        return;
      }

      if (
        seen.indexOf(item) !== -1
      ) {
        issues.push(
          issue(
            "CYCLIC_OBJECT_FORBIDDEN",
            path
          )
        );

        return;
      }

      seen.push(item);

      if (Array.isArray(item)) {
        if (
          item.length >
          LIMITS.maxArrayLength
        ) {
          issues.push(
            issue(
              "ARRAY_LIMIT_EXCEEDED",
              path
            )
          );

          return;
        }

        item.forEach(function eachArray(entry, index) {
          walk(
            entry,
            path + "[" + index + "]",
            depth + 1,
            seen.slice()
          );
        });

        return;
      }

      var keys =
        Object.keys(item);

      if (
        keys.length >
        LIMITS.maxObjectKeys
      ) {
        issues.push(
          issue(
            "OBJECT_KEY_LIMIT_EXCEEDED",
            path
          )
        );

        return;
      }

      keys.forEach(function eachKey(key) {
        var descriptor;

        try {
          descriptor =
            Object.getOwnPropertyDescriptor(
              item,
              key
            );
        } catch (_error) {
          issues.push(
            issue(
              "PROPERTY_DESCRIPTOR_UNREADABLE",
              path + "." + key
            )
          );

          return;
        }

        if (
          !descriptor ||
          descriptor.get ||
          descriptor.set
        ) {
          issues.push(
            issue(
              "ACCESSOR_PROPERTY_FORBIDDEN",
              path + "." + key
            )
          );

          return;
        }

        walk(
          item[key],
          path + "." + key,
          depth + 1,
          seen.slice()
        );
      });
    }

    walk(value, "$", 0, []);

    return deepFreeze({
      passed:
        issues.length === 0,

      issues:
        deepFreeze(issues)
    });
  }

  function validateStationRequest(request) {
    var issues = [];
    var plain =
      validatePlainData(request);

    if (!plain.passed) {
      issues =
        issues.concat(plain.issues);
    }

    if (!isPlainObject(request)) {
      issues.push(
        issue(
          "REQUEST_OBJECT_REQUIRED",
          "$"
        )
      );

      return deepFreeze({
        passed: false,
        issues: deepFreeze(issues)
      });
    }

    if (
      request.schema !==
      REQUEST_SCHEMA
    ) {
      issues.push(
        issue(
          "REQUEST_SCHEMA_MISMATCH",
          "$.schema"
        )
      );
    }

    if (
      request.position !==
      CYCLE_POSITION
    ) {
      issues.push(
        issue(
          "REQUEST_POSITION_MISMATCH",
          "$.position"
        )
      );
    }

    if (
      request.stationId !==
      STATION_ID
    ) {
      issues.push(
        issue(
          "REQUEST_STATION_ID_MISMATCH",
          "$.stationId"
        )
      );
    }

    if (
      !safeString(
        request.cycleId,
        ""
      )
    ) {
      issues.push(
        issue(
          "REQUEST_CYCLE_ID_REQUIRED",
          "$.cycleId"
        )
      );
    }

    if (
      !Array.isArray(
        request.priorStationReceipts
      )
    ) {
      issues.push(
        issue(
          "PRIOR_STATION_RECEIPTS_ARRAY_REQUIRED",
          "$.priorStationReceipts"
        )
      );
    }

    return deepFreeze({
      passed:
        issues.length === 0,

      issues:
        deepFreeze(issues)
    });
  }

  function findReceipt(request, stationId) {
    var receipts =
      Array.isArray(
        request &&
        request.priorStationReceipts
      )
        ? request.priorStationReceipts
        : [];

    for (
      var i = receipts.length - 1;
      i >= 0;
      i -= 1
    ) {
      if (
        isPlainObject(receipts[i]) &&
        receipts[i].stationId === stationId
      ) {
        return receipts[i];
      }
    }

    return null;
  }

  function extractObservation(receipt, observationId) {
    if (
      !isPlainObject(receipt) ||
      !Array.isArray(receipt.observations)
    ) {
      return null;
    }

    for (
      var i = 0;
      i < receipt.observations.length;
      i += 1
    ) {
      if (
        isPlainObject(receipt.observations[i]) &&
        receipt.observations[i].id === observationId
      ) {
        return receipt.observations[i];
      }
    }

    return null;
  }

  function validateHandoffTarget(value) {
    if (
      typeof value !== "string" ||
      !value.length
    ) {
      return false;
    }

    return (
      value.indexOf("/assets/audralia/") === 0 ||
      value.indexOf("/showroom/globe/audralia/") === 0 ||
      value.indexOf("/assets/engine/") === 0
    );
  }

  function getDeclaredHandoffSource(request) {
    var construct =
      safeObject(request && request.construct);

    var engine =
      safeObject(request && request.engine);

    var target =
      safeObject(request && request.target);

    var extensions =
      safeObject(request && request.extensions);

    return firstObject(
      construct.handoff,
      construct.southHandoff,
      construct.outputHandoff,
      engine.handoff,
      target.handoff,
      extensions.handoff,
      extensions.southHandoff,
      {}
    );
  }

  function deriveHandoffFromReceipts(request, westReceipt) {
    var westEligibility =
      extractObservation(
        westReceipt,
        "WEST_INTERPRETATION_HANDOFF_ELIGIBILITY"
      );

    var westAlignment =
      extractObservation(
        westReceipt,
        "WEST_INTERPRETATION_ALIGNMENT_RESULT"
      );

    var westSourceRuntime =
      extractObservation(
        westReceipt,
        "WEST_INTERPRETATION_SOURCE_TO_RUNTIME_IDENTITY"
      );

    var westAdmission =
      extractObservation(
        westReceipt,
        "WEST_INTERPRETATION_RUNTIME_EVIDENCE_ADMISSION"
      );

    var construct =
      safeObject(request && request.construct);

    var engine =
      safeObject(request && request.engine);

    var target =
      safeObject(request && request.target);

    var declared =
      getDeclaredHandoffSource(request);

    var targetFile =
      firstString(
        declared.targetFile,
        declared.file,
        declared.downstreamFile,
        declared.restitutionCandidateFile,
        SOUTH_RESTITUTION_FILE
      );

    var targetRoute =
      firstString(
        declared.targetRoute,
        declared.route,
        target.targetRoute,
        construct.targetRoute,
        construct.route,
        "/showroom/globe/audralia/diagnostic/"
      );

    var returnMode =
      firstString(
        declared.returnMode,
        declared.mode,
        "DIAGNOSTIC_RESTITUTION"
      );

    var packetKind =
      firstString(
        declared.packetKind,
        declared.schema,
        "DIAGNOSTIC_HANDOFF_PACKET"
      );

    var downstreamOwner =
      firstString(
        declared.downstreamOwner,
        declared.owner,
        "SOUTH_RESTITUTION_INTERPRETATION"
      );

    var restitutionCandidateFile =
      firstString(
        declared.restitutionCandidateFile,
        declared.southFile,
        SOUTH_RESTITUTION_FILE
      );

    var outputPacketReference =
      firstObject(
        declared.outputPacketReference,
        westReceipt && westReceipt.outputPacketReference,
        westReceipt && westReceipt.southHandoffPacket,
        null
      );

    var packetIntegrity =
      declared.packetIntegrity === true ||
      Boolean(outputPacketReference) ||
      Boolean(westAlignment && westAlignment.southProbeEligible === true) ||
      Boolean(westEligibility && westEligibility.southProbeEligible === true);

    var provenanceContinuity =
      declared.provenanceContinuity === true ||
      Boolean(westReceipt && westReceipt.receiptHash) ||
      Boolean(westReceipt && westReceipt.normalizedReceiptHash);

    var outputCompleteness =
      declared.outputCompleteness === true ||
      Boolean(westAdmission && westAdmission.runtimeEvidenceAdmitted === true) ||
      Boolean(westEligibility && westEligibility.southProbeEligible === true);

    return deepFreeze({
      declared:
        safeObject(declared),

      targetFile:
        targetFile,

      targetRoute:
        targetRoute,

      returnMode:
        returnMode,

      packetKind:
        packetKind,

      downstreamOwner:
        downstreamOwner,

      restitutionCandidateFile:
        restitutionCandidateFile,

      outputPacketReference:
        outputPacketReference,

      packetIntegrity:
        packetIntegrity,

      provenanceContinuity:
        provenanceContinuity,

      outputCompleteness:
        outputCompleteness,

      westEligibility:
        westEligibility
          ? safeObject(westEligibility)
          : null,

      westAlignment:
        westAlignment
          ? safeObject(westAlignment)
          : null,

      westSourceRuntime:
        westSourceRuntime
          ? safeObject(westSourceRuntime)
          : null,

      westAdmission:
        westAdmission
          ? safeObject(westAdmission)
          : null,

      engineContract:
        firstString(
          engine.contract,
          westSourceRuntime &&
          westSourceRuntime.declaredEngineContract,
          null
        ),

      constructId:
        firstString(
          construct.constructId,
          construct.id,
          westSourceRuntime &&
          westSourceRuntime.declaredConstructId,
          null
        )
    });
  }

  function interpretHandoff(request, validation) {
    var issues = [];

    var westReceipt =
      findReceipt(
        request,
        "WEST_RUNTIME_INTERPRETATION"
      );

    var westPass =
      Boolean(
        westReceipt &&
        westReceipt.status === "PASS" &&
        westReceipt.handoffEligible === true
      );

    var derived =
      deriveHandoffFromReceipts(
        request || {},
        westReceipt
      );

    var southProbeEligible =
      Boolean(
        derived.westEligibility &&
        derived.westEligibility.southProbeEligible === true
      );

    var targetValid =
      Boolean(
        validateHandoffTarget(
          derived.targetFile
        ) ||
        validateHandoffTarget(
          derived.targetRoute
        )
      );

    var packetIntegrity =
      derived.packetIntegrity === true;

    var provenanceContinuity =
      derived.provenanceContinuity === true;

    var outputCompleteness =
      derived.outputCompleteness === true;

    var handoffAdmitted =
      Boolean(
        westPass &&
        southProbeEligible &&
        targetValid &&
        packetIntegrity &&
        provenanceContinuity &&
        outputCompleteness
      );

    var observations = [
      {
        id:
          "SOUTH_HANDOFF_PRIOR_WEST_STATUS",

        kind:
          "EXPOSED_RECEIPT",

        westReceiptObserved:
          Boolean(westReceipt),

        westReceiptPass:
          westPass,

        westReceiptContract:
          westReceipt
            ? safeString(
                westReceipt.contract,
                null
              )
            : null,

        expectedWestContract:
          CURRENT_F21_CONTRACT,

        westContractCurrent:
          Boolean(
            westReceipt &&
            westReceipt.contract ===
              CURRENT_F21_CONTRACT
          ),

        southProbeEligible:
          southProbeEligible,

        westReceiptHash:
          westReceipt
            ? safeString(
                westReceipt.receiptHash,
                null
              )
            : null
      },

      {
        id:
          "SOUTH_HANDOFF_TARGET_DECLARATION",

        kind:
          "DERIVED",

        targetFile:
          derived.targetFile,

        targetRoute:
          derived.targetRoute,

        targetValid:
          targetValid,

        downstreamOwner:
          derived.downstreamOwner,

        restitutionCandidateFile:
          derived.restitutionCandidateFile,

        southRestitutionFile:
          SOUTH_RESTITUTION_FILE,

        southSurfacePointerFile:
          SOUTH_SURFACE_POINTER_FILE
      },

      {
        id:
          "SOUTH_HANDOFF_PACKET_INTEGRITY",

        kind:
          "DERIVED",

        packetKind:
          derived.packetKind,

        returnMode:
          derived.returnMode,

        packetIntegrity:
          packetIntegrity,

        provenanceContinuity:
          provenanceContinuity,

        outputCompleteness:
          outputCompleteness,

        outputPacketReferencePresent:
          Boolean(
            derived.outputPacketReference
          ),

        outputPacketReference:
          derived.outputPacketReference
      },

      {
        id:
          "SOUTH_HANDOFF_ADMISSIBILITY",

        kind:
          "DERIVED",

        handoffAdmitted:
          handoffAdmitted,

        nextStationEligible:
          handoffAdmitted,

        handoffProbeProvesRepair:
          false,

        handoffProbeProvesReadiness:
          false,

        packetIntegrityProvesRuntimeReady:
          false,

        provenanceContinuityProvesRuntimeReady:
          false,

        outputCompletenessProvesRuntimeReady:
          false,

        directionOnly:
          true
      }
    ];

    if (!validation.passed) {
      issues =
        issues.concat(validation.issues);
    }

    if (!westReceipt) {
      issues.push(
        issue(
          "WEST_RUNTIME_INTERPRETATION_RECEIPT_REQUIRED",
          "$.priorStationReceipts",
          "The F21 West runtime interpretation receipt was not available."
        )
      );
    } else if (!westPass) {
      issues.push(
        issue(
          "WEST_RUNTIME_INTERPRETATION_RECEIPT_NOT_PASSING",
          "$.priorStationReceipts",
          "The F21 West runtime interpretation receipt was present but did not pass with handoff eligibility."
        )
      );
    }

    if (!southProbeEligible) {
      issues.push(
        issue(
          "WEST_DID_NOT_AUTHORIZE_SOUTH_PROBE_ELIGIBILITY",
          "$.priorStationReceipts.WEST_RUNTIME_INTERPRETATION",
          "F21 did not expose southProbeEligible=true."
        )
      );
    }

    if (!targetValid) {
      issues.push(
        issue(
          "VALID_HANDOFF_TARGET_REQUIRED",
          "$.construct.handoff",
          "A valid Audralia, diagnostic, or engine handoff target file or route is required."
        )
      );
    }

    if (!packetIntegrity) {
      issues.push(
        issue(
          "HANDOFF_PACKET_INTEGRITY_REQUIRED",
          "$.construct.handoff.packetIntegrity",
          "The handoff packet did not establish packet integrity through declaration or derived output reference."
        )
      );
    }

    if (!provenanceContinuity) {
      issues.push(
        issue(
          "HANDOFF_PROVENANCE_CONTINUITY_REQUIRED",
          "$.construct.handoff.provenanceContinuity",
          "The handoff packet did not establish provenance continuity."
        )
      );
    }

    if (!outputCompleteness) {
      issues.push(
        issue(
          "HANDOFF_OUTPUT_COMPLETENESS_REQUIRED",
          "$.construct.handoff.outputCompleteness",
          "The handoff packet did not establish output completeness."
        )
      );
    }

    return deepFreeze({
      observations:
        deepFreeze(observations),

      issues:
        deepFreeze(
          issues.slice(0, LIMITS.maxIssues)
        ),

      derived:
        derived,

      westReceiptObserved:
        Boolean(westReceipt),

      westReceiptPass:
        westPass,

      southProbeEligible:
        southProbeEligible,

      targetValid:
        targetValid,

      packetIntegrity:
        packetIntegrity,

      provenanceContinuity:
        provenanceContinuity,

      outputCompleteness:
        outputCompleteness,

      handoffAdmitted:
        handoffAdmitted && issues.length === 0
    });
  }

  function executeCycleStation(request) {
    var validation =
      validateStationRequest(request);

    var handoff =
      interpretHandoff(
        request || {},
        validation
      );

    var status =
      "PASS";

    var completed =
      true;

    var handoffEligible =
      true;

    var summary =
      "SOUTH_HANDOFF_ADMITTED_FOR_RESTITUTION_INTERPRETATION";

    if (!validation.passed) {
      status =
        "HOLD";

      completed =
        false;

      handoffEligible =
        false;

      summary =
        "SOUTH_HANDOFF_HELD_REQUEST_INVALID";
    } else if (
      handoff.issues.length
    ) {
      status =
        "HOLD";

      completed =
        false;

      handoffEligible =
        false;

      summary =
        "SOUTH_HANDOFF_HELD_HANDOFF_INCOMPLETE";
    }

    var recommendedOwner = {
      ownerType:
        "DIAGNOSTIC_HANDOFF",

      subjectId:
        handoff.derived.constructId ||
        (
          request &&
          request.construct &&
          typeof request.construct.constructId === "string"
            ? request.construct.constructId
            : null
        ),

      contract:
        handoff.derived.engineContract ||
        (
          request &&
          request.engine &&
          typeof request.engine.contract === "string"
            ? request.engine.contract
            : null
        ),

      file:
        handoff.derived.targetFile ||
        handoff.derived.restitutionCandidateFile ||
        SOUTH_RESTITUTION_FILE,

      component:
        "SOUTH_PROBE_HANDOFF",

      directionOnly:
        true,

      provenCulprit:
        false
    };

    var receipt = {
      schema:
        RECEIPT_SCHEMA,

      cycleId:
        safeString(
          request &&
          request.cycleId,
          "UNKNOWN"
        ),

      position:
        CYCLE_POSITION,

      stationId:
        STATION_ID,

      fibonacci:
        FIBONACCI,

      news:
        NEWS,

      contract:
        CONTRACT,

      previousContract:
        PREVIOUS_CONTRACT,

      version:
        VERSION,

      versionLabel:
        VERSION_LABEL,

      file:
        FILE,

      status:
        status,

      completed:
        completed,

      handoffEligible:
        handoffEligible,

      summary:
        summary,

      observations:
        handoff.observations,

      handoffEvidence:
        handoff.derived,

      evidence: [
        {
          id:
            "SOUTH_HANDOFF_REQUEST_HASH",

          kind:
            "DERIVED",

          hash:
            hash(request || {})
        },

        {
          id:
            "SOUTH_HANDOFF_OBSERVATION_HASH",

          kind:
            "DERIVED",

          hash:
            hash(handoff.observations)
        },

        {
          id:
            "SOUTH_HANDOFF_DERIVED_PACKET_HASH",

          kind:
            "DERIVED",

          hash:
            hash(handoff.derived)
        },

        {
          id:
            "SOUTH_HANDOFF_ADMISSION",

          kind:
            "DERIVED",

          admitted:
            handoff.handoffAdmitted,

          westReceiptPass:
            handoff.westReceiptPass,

          southProbeEligible:
            handoff.southProbeEligible,

          targetValid:
            handoff.targetValid,

          packetIntegrity:
            handoff.packetIntegrity,

          provenanceContinuity:
            handoff.provenanceContinuity,

          outputCompleteness:
            handoff.outputCompleteness,

          targetFile:
            handoff.derived.targetFile,

          targetRoute:
            handoff.derived.targetRoute,

          downstreamOwner:
            handoff.derived.downstreamOwner
        },

        {
          id:
            "SOUTH_HANDOFF_VALIDATION",

          kind:
            "DERIVED",

          passed:
            validation.passed,

          issueCount:
            validation.issues.length
        }
      ],

      issues:
        handoff.issues,

      firstHeldCoordinate:
        status === "HOLD"
          ? "F34:SOUTH_PROBE_HANDOFF"
          : null,

      firstFailedCoordinate:
        null,

      firstConflictCoordinate:
        null,

      recommendedOwner:
        recommendedOwner,

      generatedAt:
        nowIso(),

      receiptHash:
        null,

      noClaims:
        NO_CLAIMS
    };

    receipt.receiptHash =
      hash(receipt);

    return deepFreeze(receipt);
  }

  function getDefinitionReceipt() {
    var definition = {
      receipt:
        RECEIPT,

      contract:
        CONTRACT,

      previousContract:
        PREVIOUS_CONTRACT,

      version:
        VERSION,

      versionLabel:
        VERSION_LABEL,

      file:
        FILE,

      stationId:
        STATION_ID,

      cyclePosition:
        CYCLE_POSITION,

      fibonacci:
        FIBONACCI,

      news:
        NEWS,

      requestSchema:
        REQUEST_SCHEMA,

      receiptSchema:
        RECEIPT_SCHEMA,

      currentF21Contract:
        CURRENT_F21_CONTRACT,

      currentF21File:
        CURRENT_F21_FILE,

      southRestitutionFile:
        SOUTH_RESTITUTION_FILE,

      southSurfacePointerFile:
        SOUTH_SURFACE_POINTER_FILE,

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
        "Position 7 South handoff probe for packet integrity, provenance continuity, output completeness, downstream target declaration, restitution candidate declaration, and South-return admissibility.",

      quietLoad:
        true,

      threeDimensionalNative:
        true,

      consumesCurrentF21:
        true,

      derivesHandoffFromF21:
        true,

      targetValidation:
        true,

      packetIntegrityEvidence:
        true,

      provenanceContinuityEvidence:
        true,

      outputCompletenessEvidence:
        true,

      handoffProbeProvesRepair:
        false,

      handoffProbeProvesReadiness:
        false,

      directionOnly:
        true,

      noClaims:
        NO_CLAIMS
    };

    definition.definitionHash =
      hash(definition);

    definition.generatedAt =
      nowIso();

    return deepFreeze(definition);
  }

  function getStatus() {
    return deepFreeze({
      contract:
        CONTRACT,

      previousContract:
        PREVIOUS_CONTRACT,

      version:
        VERSION,

      versionLabel:
        VERSION_LABEL,

      file:
        FILE,

      stationId:
        STATION_ID,

      cyclePosition:
        CYCLE_POSITION,

      fibonacci:
        FIBONACCI,

      news:
        NEWS,

      loaded:
        true,

      readyForExplicitRegistration:
        true,

      threeDimensionalNative:
        true,

      consumesCurrentF21:
        true,

      derivesHandoffFromF21:
        true,

      noClaims:
        NO_CLAIMS
    });
  }

  function buildApi() {
    return deepFreeze({
      CONTRACT:
        CONTRACT,

      PREVIOUS_CONTRACT:
        PREVIOUS_CONTRACT,

      RECEIPT:
        RECEIPT,

      VERSION:
        VERSION,

      VERSION_LABEL:
        VERSION_LABEL,

      FILE:
        FILE,

      STATION_ID:
        STATION_ID,

      CYCLE_POSITION:
        CYCLE_POSITION,

      FIBONACCI:
        FIBONACCI,

      NEWS:
        NEWS,

      CURRENT_F21_CONTRACT:
        CURRENT_F21_CONTRACT,

      SOUTH_RESTITUTION_FILE:
        SOUTH_RESTITUTION_FILE,

      getDefinitionReceipt:
        getDefinitionReceipt,

      executeCycleStation:
        executeCycleStation,

      getStatus:
        getStatus,

      validateStationRequest:
        validateStationRequest,

      clone:
        function exposedClone(value) {
          return deepFreeze(
            clonePlain(value, [], 0)
          );
        },

      hash:
        hash,

      noClaims:
        NO_CLAIMS
    });
  }

  function ensureNamespace(name) {
    if (
      !root ||
      typeof root !== "object"
    ) {
      return null;
    }

    if (
      !root[name] ||
      typeof root[name] !== "object"
    ) {
      root[name] = {};
    }

    return root[name];
  }

  function publish(api) {
    if (
      !root ||
      typeof root !== "object"
    ) {
      return api;
    }

    var existing =
      root.AUDRALIA_DIAGNOSTIC_PROBE_SOUTH;

    if (
      existing &&
      existing.CONTRACT &&
      existing.CONTRACT !== CONTRACT &&
      existing.CONTRACT !== PREVIOUS_CONTRACT
    ) {
      root.AUDRALIA_DIAGNOSTIC_PROBE_SOUTH_INSTALLATION_CONFLICT =
        deepFreeze({
          contract:
            CONTRACT,

          previousContract:
            PREVIOUS_CONTRACT,

          file:
            FILE,

          status:
            "CONFLICT",

          reason:
            "PRIMARY_GLOBAL_OCCUPIED_BY_INCOMPATIBLE_AUTHORITY",

          existingContract:
            existing.CONTRACT || null,

          generatedAt:
            nowIso()
        });

      return api;
    }

    root.AUDRALIA_DIAGNOSTIC_PROBE_SOUTH =
      api;

    var namespace =
      ensureNamespace("AUDRALIA");

    if (namespace) {
      namespace.diagnosticProbeSouth =
        api;

      if (
        !namespace.diagnostics ||
        typeof namespace.diagnostics !== "object"
      ) {
        namespace.diagnostics = {};
      }

      namespace.diagnostics.probeSouth =
        api;
    }

    root.AUDRALIA_DIAGNOSTIC_PROBE_SOUTH_RECEIPT =
      getDefinitionReceipt();

    root.__AUDRALIA_DIAGNOSTIC_PROBE_SOUTH_LOADED__ =
      true;

    root.__AUDRALIA_DIAGNOSTIC_PROBE_SOUTH_STATION_ID__ =
      STATION_ID;

    root.__AUDRALIA_DIAGNOSTIC_PROBE_SOUTH_VERSION__ =
      VERSION;

    root.__AUDRALIA_DIAGNOSTIC_PROBE_SOUTH_CONTRACT__ =
      CONTRACT;

    return api;
  }

  var API =
    buildApi();

  publish(API);

  if (
    typeof module !== "undefined" &&
    module.exports
  ) {
    module.exports =
      API;
  }
})(
  typeof window !== "undefined"
    ? window
    : typeof globalThis !== "undefined"
      ? globalThis
      : this
);

// /assets/audralia/audralia.diagnostic.probe.west.js
// AUDRALIA_DIAGNOSTIC_PROBE_WEST_RUNTIME_F13_3D_TNT_v2
// Full-file replacement.
// Quiet-load, dependency-free, 3D-native West runtime evidence probe.
//
// Previous contract:
// - AUDRALIA_DIAGNOSTIC_PROBE_WEST_RUNTIME_F13_3D_TNT_v1
//
// Implements:
// - Position 5
// - F13
// - WEST_PROBE_RUNTIME
//
// Purpose:
// - Renew West around the current Audralia diagnostic evidence family.
// - Read current F8 Surface Truth observations before pointing elsewhere.
// - Read canonical target-runtime evidence carried by the diagnostic engine.
// - Preserve legacy construct.runtime, engine.runtime, and extensions.runtime
//   compatibility.
// - Preserve unavailable, explicitly false, explicitly true, and conflicting
//   evidence as materially distinct states.
// - Produce a field-by-field source ledger capable of proving whether:
//   1. West failed to read available evidence;
//   2. the canonical request failed to carry available evidence;
//   3. the public runtime evidence contract did not expose required evidence;
//   4. multiple evidence authorities conflicted.
//
// Owns:
// - bounded plain-data runtime-evidence intake;
// - current and legacy runtime-evidence grammar recognition;
// - F8 predecessor handoff interpretation;
// - three-state and conflict-aware field normalization;
// - field provenance;
// - runtime-evidence admission classification;
// - diagnostic ownership direction based on observed evidence.
//
// Does not own:
// - public runtime creation;
// - scene, camera, geometry, material, shader, or pipeline creation;
// - rendering;
// - command submission;
// - canvas creation or mutation;
// - WebGL or WebGPU mutation;
// - diagnostic-engine request construction;
// - production repair;
// - readiness claims;
// - final production verdicts.
//
// Functional law:
// - A diagnostic probe direction is evidence direction, not an automatic
//   defect assignment.
// - Missing evidence is UNAVAILABLE, not automatically false.
// - Explicit false evidence remains distinct from missing evidence.
// - Conflicting evidence remains visible and cannot be silently resolved.
// - F8 PASS alone does not establish runtime completeness.
// - First-frame or visible-pixel evidence may support only the exact runtime
//   facts explicitly mapped below.
// - No synthetic scene, camera, material, shader, pipeline, or command evidence.
// - No file is named as the proven culprit unless the receipt establishes
//   the evidentiary path supporting that conclusion.

(function audraliaDiagnosticProbeWestRuntimeF133DV2(global) {
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
    "AUDRALIA_DIAGNOSTIC_PROBE_WEST_RUNTIME_F13_3D_TNT_v2";

  var PREVIOUS_CONTRACT =
    "AUDRALIA_DIAGNOSTIC_PROBE_WEST_RUNTIME_F13_3D_TNT_v1";

  var RECEIPT =
    "AUDRALIA_DIAGNOSTIC_PROBE_WEST_RUNTIME_F13_3D_RECEIPT_v2";

  var VERSION =
    "2.0.0";

  var VERSION_LABEL =
    "2026-06-16.audralia-diagnostic-probe-west-runtime-f13-3d-v2";

  var FILE =
    "/assets/audralia/audralia.diagnostic.probe.west.js";

  var STATION_ID =
    "WEST_PROBE_RUNTIME";

  var CYCLE_POSITION =
    5;

  var FIBONACCI =
    "F13";

  var NEWS =
    "WEST";

  var REQUEST_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_STATION_EXECUTION_REQUEST_v1";

  var RECEIPT_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_STATION_RECEIPT_v1";

  var CURRENT_F8_CONTRACT =
    "AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_F8_3D_TNT_v4";

  var CURRENT_F8_FILE =
    "/assets/audralia/audralia.diagnostic.probe.canvas.surface.truth.js";

  var DIAGNOSTIC_ENGINE_FILE =
    "/showroom/globe/audralia/diagnostic/index.js";

  var PUBLIC_RUNTIME_FILE =
    "/showroom/globe/audralia/index.js";

  var PUBLIC_RUNTIME_ALIAS =
    "DGBAudraliaPlanetRuntime";

  var LIMITS =
    Object.freeze({
      maxStringLength: 12000,
      maxArrayLength: 377,
      maxObjectKeys: 233,
      maxDepth: 13,
      maxIssues: 89,
      maxCandidatesPerField: 89
    });

  var EVIDENCE_STATE =
    Object.freeze({
      TRUE: "OBSERVED_TRUE",
      FALSE: "OBSERVED_FALSE",
      UNAVAILABLE: "UNAVAILABLE",
      CONFLICT: "CONFLICT",
      VALUE: "OBSERVED_VALUE"
    });

  var SOURCE_PRIORITY =
    Object.freeze([
      "F8_CANVAS_SURFACE_RUNTIME_STATUS",
      "F8_CANVAS_SURFACE_TARGET_FRAME",
      "REQUEST_TARGET_RUNTIME_STATUS",
      "REQUEST_TARGET_RUNTIME_RECEIPT",
      "REQUEST_CONSTRUCT_RUNTIME",
      "REQUEST_ENGINE_RUNTIME",
      "REQUEST_EXTENSIONS_RUNTIME"
    ]);

  var REQUIRED_BOOLEAN_FIELDS =
    Object.freeze([
      "runtimeDeclared",
      "runtimeActive",
      "scenePresent",
      "cameraPresent",
      "geometryPresent",
      "materialPresent",
      "shaderOrPipelinePresent",
      "renderPassObserved",
      "commandSubmitted",
      "presentationObserved"
    ]);

  var OPTIONAL_FIELDS =
    Object.freeze([
      "runtimeId",
      "rendererKind",
      "backend",
      "interactionObserved"
    ]);

  var ALL_RUNTIME_FIELDS =
    Object.freeze([
      "runtimeId",
      "rendererKind",
      "backend",
      "runtimeDeclared",
      "runtimeActive",
      "scenePresent",
      "cameraPresent",
      "geometryPresent",
      "materialPresent",
      "shaderOrPipelinePresent",
      "renderPassObserved",
      "commandSubmitted",
      "presentationObserved",
      "interactionObserved"
    ]);

  var NO_CLAIMS =
    Object.freeze({
      engineAuthority: false,
      productionMutationAuthority: false,
      contractRewriteAuthority: false,
      routeMutationAuthority: false,
      rendererAuthority: false,
      canvasAuthority: false,
      canvas2DAuthority: false,
      canvasDrawingAuthority: false,
      canvasCreationAuthority: false,
      webGLAuthority: false,
      webGPUAuthority: false,
      runtimeAuthority: false,
      gpuResourceCreationAuthority: false,
      repairAuthorizationAuthority: false,
      fileAuthorizationAuthority: false,
      finalProductionVerdictAuthority: false,
      runtimePresenceProvesVisualPass: false,
      renderPassDeclarationProvesPresentation: false,
      firstFrameProvesCommandSubmission: false,
      firstFrameProvesScenePresence: false,
      firstFrameProvesCameraPresence: false,
      firstFrameProvesMaterialPresence: false,
      firstFrameProvesShaderPresence: false,
      presentationEvidenceProvesReadiness: false,
      interactionEvidenceProvesCompletion: false,
      probeCreatedRuntimeEvidence: false,
      probeSynthesizedRequiredEvidence: false,
      recommendedOwnerProvesDefect: false,
      directionProvesCulprit: false,
      readyClaimed: false,
      verifiedClaimed: false,
      f13Claimed: false,
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

  function hasOwn(target, key) {
    return Boolean(
      target &&
      Object.prototype.hasOwnProperty.call(
        target,
        key
      )
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
        .forEach(
          function freezeKey(key) {
            deepFreeze(
              value[key],
              memory
            );
          }
        );

      Object.freeze(value);
    } catch (_error) {}

    return value;
  }

  function issue(code, path, detail) {
    return {
      code:
        String(
          code ||
          "ISSUE"
        ),

      path:
        String(
          path ||
          "$"
        ),

      detail:
        String(
          detail ||
          code ||
          "ISSUE"
        ).slice(0, 512)
    };
  }

  function clonePlain(value, seen) {
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

    var memory =
      seen || [];

    if (
      memory.indexOf(value) !== -1
    ) {
      return null;
    }

    memory.push(value);

    if (Array.isArray(value)) {
      return value
        .slice(
          0,
          LIMITS.maxArrayLength
        )
        .map(
          function map(entry) {
            return clonePlain(
              entry,
              memory
            );
          }
        );
    }

    var output = {};
    var keys = [];

    try {
      keys =
        Object.keys(value)
          .slice(
            0,
            LIMITS.maxObjectKeys
          );
    } catch (_error) {
      return null;
    }

    keys.forEach(
      function each(key) {
        var safeKey =
          String(key)
            .slice(
              0,
              LIMITS.maxStringLength
            );

        try {
          output[safeKey] =
            clonePlain(
              value[key],
              memory
            );
        } catch (_error2) {
          output[safeKey] =
            null;
        }
      }
    );

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
      return value
        ? "true"
        : "false";
    }

    if (isFiniteNumber(value)) {
      return String(value);
    }

    if (Array.isArray(value)) {
      return (
        "[" +
        value
          .map(stableStringify)
          .join(",") +
        "]"
      );
    }

    if (isPlainObject(value)) {
      return (
        "{" +
        Object.keys(value)
          .sort()
          .map(
            function encodeKey(key) {
              return (
                JSON.stringify(key) +
                ":" +
                stableStringify(
                  value[key]
                )
              );
            }
          )
          .join(",") +
        "}"
      );
    }

    return "null";
  }

  function hash(value) {
    var text =
      stableStringify(
        clonePlain(
          value,
          []
        )
      );

    var h =
      0x811c9dc5;

    for (
      var index = 0;
      index < text.length;
      index += 1
    ) {
      h ^=
        text.charCodeAt(index);

      h +=
        (h << 1) +
        (h << 4) +
        (h << 7) +
        (h << 8) +
        (h << 24);

      h >>>=
        0;
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
    var resolvedFallback =
      fallback === undefined
        ? null
        : fallback;

    if (typeof value !== "string") {
      return resolvedFallback;
    }

    var normalized =
      value
        .slice(
          0,
          LIMITS.maxStringLength
        )
        .trim();

    return normalized
      ? normalized
      : resolvedFallback;
  }

  function normalizeBooleanValue(value) {
    if (typeof value === "boolean") {
      return {
        available: true,
        value: value
      };
    }

    if (
      value === "true" ||
      value === "1" ||
      value === 1
    ) {
      return {
        available: true,
        value: true
      };
    }

    if (
      value === "false" ||
      value === "0" ||
      value === 0
    ) {
      return {
        available: true,
        value: false
      };
    }

    return {
      available: false,
      value: null
    };
  }

  function safeObject(value) {
    return isPlainObject(value)
      ? clonePlain(
          value,
          []
        )
      : {};
  }

  function validatePlainData(value) {
    var issues = [];

    function walk(
      item,
      path,
      depth,
      seen
    ) {
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
        if (
          typeof item === "string" &&
          item.length >
            LIMITS.maxStringLength
        ) {
          issues.push(
            issue(
              "STRING_LIMIT_EXCEEDED",
              path
            )
          );
        }

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

      if (
        typeof item === "number"
      ) {
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

        item.forEach(
          function eachArray(
            entry,
            arrayIndex
          ) {
            walk(
              entry,
              path +
                "[" +
                arrayIndex +
                "]",
              depth + 1,
              seen
            );
          }
        );

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

      keys.forEach(
        function eachKey(key) {
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
                path +
                  "." +
                  key
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
                path +
                  "." +
                  key
              )
            );

            return;
          }

          walk(
            item[key],
            path +
              "." +
              key,
            depth + 1,
            seen
          );
        }
      );
    }

    walk(
      value,
      "$",
      0,
      []
    );

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
        issues.concat(
          plain.issues
        );
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
        issues:
          deepFreeze(issues)
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

  function findReceipt(
    request,
    stationId
  ) {
    var receipts =
      Array.isArray(
        request &&
        request.priorStationReceipts
      )
        ? request.priorStationReceipts
        : [];

    for (
      var index =
        receipts.length - 1;
      index >= 0;
      index -= 1
    ) {
      if (
        isPlainObject(
          receipts[index]
        ) &&
        receipts[index].stationId ===
          stationId
      ) {
        return receipts[index];
      }
    }

    return null;
  }

  function extractObservation(
    receipt,
    observationId
  ) {
    if (
      !isPlainObject(receipt) ||
      !Array.isArray(
        receipt.observations
      )
    ) {
      return null;
    }

    for (
      var index = 0;
      index <
        receipt.observations.length;
      index += 1
    ) {
      var observation =
        receipt.observations[index];

      if (
        isPlainObject(observation) &&
        observation.id ===
          observationId
      ) {
        return observation;
      }
    }

    return null;
  }

  function normalizeEvidenceKind(value) {
    if (
      value === "DIRECT" ||
      value === "OBSERVED" ||
      value === "EXPOSED_RECEIPT" ||
      value === "DERIVED" ||
      value === "DECLARED"
    ) {
      return value;
    }

    return "DECLARED";
  }

  function sourceRecord(
    sourceId,
    sourcePath,
    evidenceKind,
    data,
    present
  ) {
    var normalizedData =
      isPlainObject(data)
        ? safeObject(data)
        : {};

    return deepFreeze({
      sourceId:
        sourceId,

      sourcePath:
        sourcePath,

      evidenceKind:
        normalizeEvidenceKind(
          evidenceKind
        ),

      present:
        Boolean(present),

      fieldCount:
        Object.keys(
          normalizedData
        ).length,

      data:
        normalizedData
    });
  }

  function buildSurfaceEvidence(request) {
    var surfaceReceipt =
      findReceipt(
        request,
        "CANVAS_SURFACE_TRUTH"
      );

    var surfaceReceiptObserved =
      Boolean(surfaceReceipt);

    var surfaceReceiptPass =
      Boolean(
        surfaceReceipt &&
        surfaceReceipt.status ===
          "PASS" &&
        surfaceReceipt.handoffEligible ===
          true
      );

    var legacyAdmission =
      extractObservation(
        surfaceReceipt,
        "SURFACE_HOST_ADMISSIBILITY"
      );

    var currentClassification =
      extractObservation(
        surfaceReceipt,
        "CANVAS_SURFACE_TRUTH_CLASSIFICATION"
      );

    var currentRuntimeStatus =
      extractObservation(
        surfaceReceipt,
        "CANVAS_SURFACE_RUNTIME_STATUS"
      );

    var currentTargetFrame =
      extractObservation(
        surfaceReceipt,
        "CANVAS_SURFACE_TARGET_FRAME"
      );

    var legacyRecognized =
      Boolean(
        legacyAdmission &&
        legacyAdmission
          .surfaceHostAdmitted ===
          true &&
        legacyAdmission
          .nextStationEligible ===
          true
      );

    var currentRecognized =
      Boolean(
        currentClassification &&
        currentClassification
          .surfaceTruthAdmitted ===
          true &&
        currentClassification
          .primaryVisible ===
          true &&
        currentClassification
          .runtimeLifecyclePending !==
          true
      );

    var admissionRecognized =
      Boolean(
        surfaceReceiptPass &&
        (
          legacyRecognized ||
          currentRecognized
        )
      );

    var admissionSource =
      legacyRecognized
        ? "F8.SURFACE_HOST_ADMISSIBILITY"
        : currentRecognized
          ? "F8.CANVAS_SURFACE_TRUTH_CLASSIFICATION"
          : null;

    return deepFreeze({
      surfaceReceipt:
        surfaceReceipt
          ? safeObject(
              surfaceReceipt
            )
          : null,

      surfaceReceiptObserved:
        surfaceReceiptObserved,

      surfaceReceiptPass:
        surfaceReceiptPass,

      legacyAdmissionPresent:
        Boolean(
          legacyAdmission
        ),

      legacyAdmissionRecognized:
        legacyRecognized,

      currentClassificationPresent:
        Boolean(
          currentClassification
        ),

      currentClassificationRecognized:
        currentRecognized,

      admissionRecognized:
        admissionRecognized,

      admissionSource:
        admissionSource,

      currentRuntimeStatusPresent:
        Boolean(
          currentRuntimeStatus
        ),

      currentTargetFramePresent:
        Boolean(
          currentTargetFrame
        ),

      legacyAdmission:
        legacyAdmission
          ? safeObject(
              legacyAdmission
            )
          : null,

      currentClassification:
        currentClassification
          ? safeObject(
              currentClassification
            )
          : null,

      currentRuntimeStatus:
        currentRuntimeStatus
          ? safeObject(
              currentRuntimeStatus
            )
          : null,

      currentTargetFrame:
        currentTargetFrame
          ? safeObject(
              currentTargetFrame
            )
          : null
    });
  }

  function getNestedRuntimeSource(
    request,
    parentName
  ) {
    var parent =
      request &&
      isPlainObject(
        request[parentName]
      )
        ? request[parentName]
        : {};

    return isPlainObject(
      parent.runtime
    )
      ? parent.runtime
      : null;
  }

  function buildRuntimeSources(
    request,
    surface
  ) {
    var target =
      request &&
      isPlainObject(
        request.target
      )
        ? request.target
        : {};

    var targetRuntimeStatus =
      isPlainObject(
        target.runtimeStatus
      )
        ? target.runtimeStatus
        : null;

    var targetRuntimeReceipt =
      isPlainObject(
        target.runtimeReceipt
      )
        ? target.runtimeReceipt
        : null;

    var constructRuntime =
      getNestedRuntimeSource(
        request,
        "construct"
      );

    var engineRuntime =
      getNestedRuntimeSource(
        request,
        "engine"
      );

    var extensionsRuntime =
      getNestedRuntimeSource(
        request,
        "extensions"
      );

    return deepFreeze([
      sourceRecord(
        "F8_CANVAS_SURFACE_RUNTIME_STATUS",
        "$.priorStationReceipts[CANVAS_SURFACE_TRUTH].observations[CANVAS_SURFACE_RUNTIME_STATUS]",
        "EXPOSED_RECEIPT",
        surface.currentRuntimeStatus,
        surface.currentRuntimeStatusPresent
      ),

      sourceRecord(
        "F8_CANVAS_SURFACE_TARGET_FRAME",
        "$.priorStationReceipts[CANVAS_SURFACE_TRUTH].observations[CANVAS_SURFACE_TARGET_FRAME]",
        "EXPOSED_RECEIPT",
        surface.currentTargetFrame,
        surface.currentTargetFramePresent
      ),

      sourceRecord(
        "REQUEST_TARGET_RUNTIME_STATUS",
        "$.target.runtimeStatus",
        "OBSERVED",
        targetRuntimeStatus,
        Boolean(targetRuntimeStatus)
      ),

      sourceRecord(
        "REQUEST_TARGET_RUNTIME_RECEIPT",
        "$.target.runtimeReceipt",
        "EXPOSED_RECEIPT",
        targetRuntimeReceipt,
        Boolean(targetRuntimeReceipt)
      ),

      sourceRecord(
        "REQUEST_CONSTRUCT_RUNTIME",
        "$.construct.runtime",
        "DECLARED",
        constructRuntime,
        Boolean(constructRuntime)
      ),

      sourceRecord(
        "REQUEST_ENGINE_RUNTIME",
        "$.engine.runtime",
        "DECLARED",
        engineRuntime,
        Boolean(engineRuntime)
      ),

      sourceRecord(
        "REQUEST_EXTENSIONS_RUNTIME",
        "$.extensions.runtime",
        "DECLARED",
        extensionsRuntime,
        Boolean(extensionsRuntime)
      )
    ]);
  }

  function sourceById(
    sources,
    sourceId
  ) {
    for (
      var index = 0;
      index < sources.length;
      index += 1
    ) {
      if (
        sources[index].sourceId ===
        sourceId
      ) {
        return sources[index];
      }
    }

    return null;
  }

  function pushCandidate(
    candidates,
    field,
    source,
    sourceField,
    value,
    evidenceKind,
    derivation
  ) {
    if (
      candidates.length >=
      LIMITS.maxCandidatesPerField
    ) {
      return;
    }

    candidates.push({
      field:
        field,

      sourceId:
        source.sourceId,

      sourcePath:
        source.sourcePath,

      sourceField:
        sourceField,

      evidenceKind:
        normalizeEvidenceKind(
          evidenceKind ||
          source.evidenceKind
        ),

      value:
        value,

      derivation:
        derivation ||
        null
    });
  }

  function readBooleanAlias(
    candidates,
    field,
    source,
    aliases
  ) {
    if (
      !source ||
      !source.present
    ) {
      return;
    }

    for (
      var index = 0;
      index < aliases.length;
      index += 1
    ) {
      var key =
        aliases[index];

      if (
        hasOwn(
          source.data,
          key
        )
      ) {
        var normalized =
          normalizeBooleanValue(
            source.data[key]
          );

        if (normalized.available) {
          pushCandidate(
            candidates,
            field,
            source,
            key,
            normalized.value,
            source.evidenceKind,
            null
          );
        }
      }
    }
  }

  function readStringAlias(
    candidates,
    field,
    source,
    aliases
  ) {
    if (
      !source ||
      !source.present
    ) {
      return;
    }

    for (
      var index = 0;
      index < aliases.length;
      index += 1
    ) {
      var key =
        aliases[index];

      if (
        hasOwn(
          source.data,
          key
        )
      ) {
        var normalized =
          safeString(
            source.data[key],
            null
          );

        if (normalized) {
          pushCandidate(
            candidates,
            field,
            source,
            key,
            normalized,
            source.evidenceKind,
            null
          );
        }
      }
    }
  }

  function collectFieldCandidates(
    field,
    sources
  ) {
    var candidates = [];

    sources.forEach(
      function collect(source) {
        switch (field) {
          case "runtimeId":
            readStringAlias(
              candidates,
              field,
              source,
              [
                "runtimeId",
                "runtimeGlobalName",
                "runtimeAlias",
                "id",
                "modelId"
              ]
            );
            break;

          case "rendererKind":
            readStringAlias(
              candidates,
              field,
              source,
              [
                "rendererKind",
                "rendererType",
                "renderer",
                "renderBackendType"
              ]
            );
            break;

          case "backend":
            readStringAlias(
              candidates,
              field,
              source,
              [
                "backend",
                "mode",
                "graphicsBackend"
              ]
            );

            if (
              hasOwn(
                source.data,
                "webGL"
              )
            ) {
              var webgl =
                normalizeBooleanValue(
                  source.data.webGL
                );

              if (
                webgl.available &&
                webgl.value === true
              ) {
                pushCandidate(
                  candidates,
                  field,
                  source,
                  "webGL",
                  "webgl",
                  "DERIVED",
                  "webGL=true maps to backend=webgl"
                );
              }
            }

            break;

          case "runtimeDeclared":
            readBooleanAlias(
              candidates,
              field,
              source,
              [
                "runtimeDeclared",
                "runtimeGlobalPresent",
                "runtimeApiAvailable"
              ]
            );

            if (
              hasOwn(
                source.data,
                "runtimeGlobalName"
              ) &&
              safeString(
                source.data
                  .runtimeGlobalName,
                null
              )
            ) {
              pushCandidate(
                candidates,
                field,
                source,
                "runtimeGlobalName",
                true,
                "DERIVED",
                "A named exposed runtime global supports runtimeDeclared=true"
              );
            }

            break;

          case "runtimeActive":
            readBooleanAlias(
              candidates,
              field,
              source,
              [
                "runtimeActive",
                "running",
                "active"
              ]
            );

            break;

          case "scenePresent":
            readBooleanAlias(
              candidates,
              field,
              source,
              [
                "scenePresent",
                "sceneReady",
                "sceneAvailable"
              ]
            );
            break;

          case "cameraPresent":
            readBooleanAlias(
              candidates,
              field,
              source,
              [
                "cameraPresent",
                "cameraReady",
                "cameraAvailable"
              ]
            );
            break;

          case "geometryPresent":
            readBooleanAlias(
              candidates,
              field,
              source,
              [
                "geometryPresent",
                "geometryReady",
                "geometryAvailable"
              ]
            );
            break;

          case "materialPresent":
            readBooleanAlias(
              candidates,
              field,
              source,
              [
                "materialPresent",
                "materialsPresent",
                "materialReady",
                "materialsReady"
              ]
            );
            break;

          case "shaderOrPipelinePresent":
            readBooleanAlias(
              candidates,
              field,
              source,
              [
                "shaderOrPipelinePresent",
                "shaderPresent",
                "pipelinePresent",
                "shaderReady",
                "pipelineReady"
              ]
            );
            break;

          case "renderPassObserved":
            readBooleanAlias(
              candidates,
              field,
              source,
              [
                "renderPassObserved",
                "renderPassCompleted",
                "frameRendered"
              ]
            );

            if (
              hasOwn(
                source.data,
                "firstFrameDrawn"
              )
            ) {
              var firstFrame =
                normalizeBooleanValue(
                  source.data
                    .firstFrameDrawn
                );

              if (firstFrame.available) {
                pushCandidate(
                  candidates,
                  field,
                  source,
                  "firstFrameDrawn",
                  firstFrame.value,
                  "DERIVED",
                  "firstFrameDrawn maps only to renderPassObserved"
                );
              }
            }

            break;

          case "commandSubmitted":
            readBooleanAlias(
              candidates,
              field,
              source,
              [
                "commandSubmitted",
                "commandsSubmitted",
                "drawCommandSubmitted",
                "renderCommandSubmitted"
              ]
            );
            break;

          case "presentationObserved":
            readBooleanAlias(
              candidates,
              field,
              source,
              [
                "presentationObserved",
                "visiblePixelObserved",
                "firstVisiblePixelObserved",
                "presented"
              ]
            );
            break;

          case "interactionObserved":
            readBooleanAlias(
              candidates,
              field,
              source,
              [
                "interactionObserved",
                "inputObserved",
                "controlInteractionObserved"
              ]
            );
            break;

          default:
            break;
        }
      }
    );

    return candidates;
  }

  function valuesEquivalent(
    left,
    right
  ) {
    return (
      typeof left ===
        typeof right &&
      left === right
    );
  }

  function normalizeFieldLedger(
    field,
    sources
  ) {
    var candidates =
      collectFieldCandidates(
        field,
        sources
      );

    if (!candidates.length) {
      return deepFreeze({
        field:
          field,

        value:
          null,

        state:
          EVIDENCE_STATE
            .UNAVAILABLE,

        selectedSource:
          null,

        selectedSourcePath:
          null,

        selectedSourceField:
          null,

        evidenceKind:
          "ABSENT",

        derivation:
          null,

        candidateCount:
          0,

        candidates:
          [],

        conflictCount:
          0,

        conflicts:
          []
      });
    }

    var selected =
      candidates[0];

    var conflicts =
      candidates
        .slice(1)
        .filter(
          function conflicting(
            candidate
          ) {
            return !valuesEquivalent(
              candidate.value,
              selected.value
            );
          }
        );

    var state;

    if (conflicts.length) {
      state =
        EVIDENCE_STATE
          .CONFLICT;
    } else if (
      typeof selected.value ===
      "boolean"
    ) {
      state =
        selected.value
          ? EVIDENCE_STATE.TRUE
          : EVIDENCE_STATE.FALSE;
    } else {
      state =
        EVIDENCE_STATE.VALUE;
    }

    return deepFreeze({
      field:
        field,

      value:
        selected.value,

      state:
        state,

      selectedSource:
        selected.sourceId,

      selectedSourcePath:
        selected.sourcePath,

      selectedSourceField:
        selected.sourceField,

      evidenceKind:
        selected.evidenceKind,

      derivation:
        selected.derivation,

      candidateCount:
        candidates.length,

      candidates:
        deepFreeze(
          candidates.map(
            function mapCandidate(
              candidate
            ) {
              return {
                sourceId:
                  candidate.sourceId,

                sourcePath:
                  candidate.sourcePath,

                sourceField:
                  candidate.sourceField,

                evidenceKind:
                  candidate.evidenceKind,

                value:
                  candidate.value,

                derivation:
                  candidate.derivation
              };
            }
          )
        ),

      conflictCount:
        conflicts.length,

      conflicts:
        deepFreeze(
          conflicts.map(
            function mapConflict(
              candidate
            ) {
              return {
                selectedValue:
                  selected.value,

                selectedSource:
                  selected.sourceId,

                conflictingValue:
                  candidate.value,

                conflictingSource:
                  candidate.sourceId,

                conflictingSourceField:
                  candidate.sourceField
              };
            }
          )
        )
    });
  }

  function buildRuntimeFieldLedger(
    sources
  ) {
    var ledger = {};

    ALL_RUNTIME_FIELDS
      .forEach(
        function buildField(field) {
          ledger[field] =
            normalizeFieldLedger(
              field,
              sources
            );
        }
      );

    return deepFreeze(ledger);
  }

  function ledgerBoolean(
    ledger,
    field
  ) {
    var entry =
      ledger[field];

    if (
      !entry ||
      entry.state ===
        EVIDENCE_STATE
          .UNAVAILABLE ||
      entry.state ===
        EVIDENCE_STATE
          .CONFLICT
    ) {
      return null;
    }

    return typeof entry.value ===
      "boolean"
      ? entry.value
      : null;
  }

  function fieldNamesByState(
    ledger,
    state
  ) {
    return ALL_RUNTIME_FIELDS
      .filter(
        function matchingField(
          field
        ) {
          return (
            ledger[field] &&
            ledger[field].state ===
              state
          );
        }
      );
  }

  function requiredFieldNamesByState(
    ledger,
    state
  ) {
    return REQUIRED_BOOLEAN_FIELDS
      .filter(
        function matchingField(
          field
        ) {
          return (
            ledger[field] &&
            ledger[field].state ===
              state
          );
        }
      );
  }

  function allRequiredTrue(
    ledger,
    fields
  ) {
    return fields.every(
      function fieldTrue(field) {
        return (
          ledgerBoolean(
            ledger,
            field
          ) === true
        );
      }
    );
  }

  function buildAdmission(
    surface,
    ledger
  ) {
    var unavailableRequiredFields =
      requiredFieldNamesByState(
        ledger,
        EVIDENCE_STATE
          .UNAVAILABLE
      );

    var explicitlyFalseRequiredFields =
      requiredFieldNamesByState(
        ledger,
        EVIDENCE_STATE
          .FALSE
      );

    var conflictingRequiredFields =
      requiredFieldNamesByState(
        ledger,
        EVIDENCE_STATE
          .CONFLICT
      );

    var runtimeIdentityAdmitted =
      allRequiredTrue(
        ledger,
        [
          "runtimeDeclared",
          "runtimeActive"
        ]
      );

    var runtimeSceneCameraAdmitted =
      allRequiredTrue(
        ledger,
        [
          "scenePresent",
          "cameraPresent"
        ]
      );

    var runtimeResourcesAdmitted =
      allRequiredTrue(
        ledger,
        [
          "geometryPresent",
          "materialPresent",
          "shaderOrPipelinePresent"
        ]
      );

    var runtimeExecutionAdmitted =
      allRequiredTrue(
        ledger,
        [
          "renderPassObserved",
          "commandSubmitted"
        ]
      );

    var runtimePresentationAdmitted =
      allRequiredTrue(
        ledger,
        [
          "presentationObserved"
        ]
      );

    var runtimeEvidenceAdmitted =
      Boolean(
        surface.admissionRecognized &&
        unavailableRequiredFields
          .length === 0 &&
        explicitlyFalseRequiredFields
          .length === 0 &&
        conflictingRequiredFields
          .length === 0 &&
        runtimeIdentityAdmitted &&
        runtimeSceneCameraAdmitted &&
        runtimeResourcesAdmitted &&
        runtimeExecutionAdmitted &&
        runtimePresentationAdmitted
      );

    var classification;

    if (
      !surface
        .admissionRecognized
    ) {
      classification =
        "WEST_RUNTIME_HELD_SURFACE_HANDOFF_UNAVAILABLE";
    } else if (
      conflictingRequiredFields
        .length
    ) {
      classification =
        "WEST_RUNTIME_HELD_EVIDENCE_CONFLICT";
    } else if (
      explicitlyFalseRequiredFields
        .length
    ) {
      classification =
        "WEST_RUNTIME_HELD_EXPLICIT_NEGATIVE_EVIDENCE";
    } else if (
      unavailableRequiredFields
        .length
    ) {
      classification =
        "WEST_RUNTIME_HELD_REQUIRED_EVIDENCE_UNAVAILABLE";
    } else if (
      runtimeEvidenceAdmitted
    ) {
      classification =
        "WEST_RUNTIME_EVIDENCE_ADMITTED";
    } else {
      classification =
        "WEST_RUNTIME_HELD_RUNTIME_EVIDENCE_INCOMPLETE";
    }

    return deepFreeze({
      classification:
        classification,

      surfaceHandoffAdmitted:
        surface
          .admissionRecognized,

      runtimeIdentityAdmitted:
        runtimeIdentityAdmitted,

      runtimeSceneCameraAdmitted:
        runtimeSceneCameraAdmitted,

      runtimeResourcesAdmitted:
        runtimeResourcesAdmitted,

      runtimeExecutionAdmitted:
        runtimeExecutionAdmitted,

      runtimePresentationAdmitted:
        runtimePresentationAdmitted,

      runtimeEvidenceAdmitted:
        runtimeEvidenceAdmitted,

      nextStationEligible:
        runtimeEvidenceAdmitted,

      unavailableRequiredFields:
        deepFreeze(
          unavailableRequiredFields
        ),

      explicitlyFalseRequiredFields:
        deepFreeze(
          explicitlyFalseRequiredFields
        ),

      conflictingRequiredFields:
        deepFreeze(
          conflictingRequiredFields
        ),

      allUnavailableFields:
        deepFreeze(
          fieldNamesByState(
            ledger,
            EVIDENCE_STATE
              .UNAVAILABLE
          )
        ),

      allExplicitlyFalseFields:
        deepFreeze(
          fieldNamesByState(
            ledger,
            EVIDENCE_STATE
              .FALSE
          )
        ),

      allConflictingFields:
        deepFreeze(
          fieldNamesByState(
            ledger,
            EVIDENCE_STATE
              .CONFLICT
          )
        )
    });
  }

  function buildSourcePresence(
    sources
  ) {
    var presence = {};

    SOURCE_PRIORITY
      .forEach(
        function mapSource(
          sourceId
        ) {
          var source =
            sourceById(
              sources,
              sourceId
            );

          presence[sourceId] =
            source
              ? {
                  present:
                    source.present,

                  fieldCount:
                    source.fieldCount,

                  sourcePath:
                    source.sourcePath,

                  evidenceKind:
                    source.evidenceKind
                }
              : {
                  present: false,
                  fieldCount: 0,
                  sourcePath: null,
                  evidenceKind:
                    "ABSENT"
                };
        }
      );

    return deepFreeze(presence);
  }

  function deriveOwnershipAssessment(
    request,
    surface,
    sources,
    admission
  ) {
    var targetStatus =
      sourceById(
        sources,
        "REQUEST_TARGET_RUNTIME_STATUS"
      );

    var targetReceipt =
      sourceById(
        sources,
        "REQUEST_TARGET_RUNTIME_RECEIPT"
      );

    var constructRuntime =
      sourceById(
        sources,
        "REQUEST_CONSTRUCT_RUNTIME"
      );

    var engineRuntime =
      sourceById(
        sources,
        "REQUEST_ENGINE_RUNTIME"
      );

    var extensionsRuntime =
      sourceById(
        sources,
        "REQUEST_EXTENSIONS_RUNTIME"
      );

    var targetEvidencePresent =
      Boolean(
        (
          targetStatus &&
          targetStatus.present
        ) ||
        (
          targetReceipt &&
          targetReceipt.present
        )
      );

    var legacyEvidencePresent =
      Boolean(
        (
          constructRuntime &&
          constructRuntime.present
        ) ||
        (
          engineRuntime &&
          engineRuntime.present
        ) ||
        (
          extensionsRuntime &&
          extensionsRuntime.present
        )
      );

    var engineFile =
      request &&
      request.construct &&
      typeof request.construct
        .diagnosticEngineFile ===
        "string"
        ? request.construct
            .diagnosticEngineFile
        : DIAGNOSTIC_ENGINE_FILE;

    var publicRuntimeFile =
      request &&
      request.engine &&
      typeof request.engine.file ===
        "string"
        ? request.engine.file
        : PUBLIC_RUNTIME_FILE;

    var classification;
    var provenCulprit =
      false;
    var ownerType;
    var file;
    var component;
    var reason;

    if (
      !surface
        .admissionRecognized
    ) {
      classification =
        "PROBE_PREDECESSOR_GRAMMAR_OR_F8_HANDOFF_REQUIRES_REVIEW";

      ownerType =
        "DIAGNOSTIC_SURFACE_HANDOFF";

      file =
        surface.surfaceReceipt &&
        typeof surface
          .surfaceReceipt.file ===
          "string"
          ? surface
              .surfaceReceipt.file
          : CURRENT_F8_FILE;

      component =
        "CANVAS_SURFACE_TRUTH_HANDOFF";

      reason =
        "The F8 receipt was absent, non-passing, or did not expose a recognized surface-admission observation.";
    } else if (
      admission
        .conflictingRequiredFields
        .length
    ) {
      classification =
        "WEST_NORMALIZATION_CONFLICT_REQUIRES_REVIEW";

      ownerType =
        "DIAGNOSTIC_RUNTIME_EVIDENCE_NORMALIZATION";

      file =
        FILE;

      component =
        "WEST_RUNTIME_FIELD_LEDGER";

      reason =
        "Required runtime evidence reached West through conflicting sources. No external file is proven defective.";
    } else if (
      admission
        .unavailableRequiredFields
        .length &&
      !targetEvidencePresent &&
      !legacyEvidencePresent
    ) {
      classification =
        "CANONICAL_REQUEST_RUNTIME_CHANNELS_ABSENT";

      ownerType =
        "DIAGNOSTIC_CANONICAL_REQUEST_BUILDER";

      file =
        engineFile;

      component =
        "CANONICAL_RUNTIME_EVIDENCE_HANDOFF";

      reason =
        "No current or legacy runtime-evidence channel reached F13. This establishes an absent handoff, not yet the underlying source of the missing evidence.";
    } else if (
      admission
        .unavailableRequiredFields
        .length &&
      targetEvidencePresent
    ) {
      classification =
        "PUBLIC_RUNTIME_EVIDENCE_CONTRACT_OR_CANONICAL_TRANSLATION_INCOMPLETE";

      ownerType =
        "THREE_D_RUNTIME_EVIDENCE_CONTRACT";

      file =
        publicRuntimeFile;

      component =
        "RUNTIME_STATUS_AND_RECEIPT_EVIDENCE";

      reason =
        "Current target-runtime evidence reached F13, but one or more required fields were unavailable. The receipt does not yet prove whether the public runtime omitted them or the diagnostic engine failed to carry richer fields.";
    } else if (
      admission
        .unavailableRequiredFields
        .length &&
      legacyEvidencePresent
    ) {
      classification =
        "LEGACY_RUNTIME_PACKET_INCOMPLETE";

      ownerType =
        "DIAGNOSTIC_RUNTIME_DECLARATION";

      file =
        engineFile;

      component =
        "LEGACY_RUNTIME_PACKET";

      reason =
        "A legacy runtime packet reached F13 but did not contain all required evidence.";
    } else if (
      admission
        .explicitlyFalseRequiredFields
        .length
    ) {
      classification =
        "EXPLICIT_NEGATIVE_RUNTIME_EVIDENCE_OBSERVED";

      ownerType =
        "THREE_D_RUNTIME_EVIDENCE_OWNER";

      file =
        publicRuntimeFile;

      component =
        "RUNTIME_EVIDENCE";

      reason =
        "One or more required runtime fields were explicitly observed as false. This is stronger than missing evidence but does not independently authorize repair.";
    } else if (
      admission
        .runtimeEvidenceAdmitted
    ) {
      classification =
        "WEST_V2_READER_ADMITTED_CURRENT_RUNTIME_EVIDENCE";

      ownerType =
        "DIAGNOSTIC_PROBE";

      file =
        FILE;

      component =
        "WEST_RUNTIME_READER";

      reason =
        "The renewed West probe recognized the current evidence family and admitted the required runtime evidence.";
    } else {
      classification =
        "RUNTIME_EVIDENCE_REMAINS_INCOMPLETE";

      ownerType =
        "DIAGNOSTIC_EVIDENCE_REVIEW";

      file =
        FILE;

      component =
        "WEST_RUNTIME_READER";

      reason =
        "The evidence remained incomplete after current and legacy channels were read.";
    }

    return deepFreeze({
      classification:
        classification,

      provenCulprit:
        provenCulprit,

      ownerType:
        ownerType,

      file:
        file,

      component:
        component,

      reason:
        reason,

      targetEvidencePresent:
        targetEvidencePresent,

      legacyEvidencePresent:
        legacyEvidencePresent,

      diagnosticEngineFile:
        engineFile,

      publicRuntimeFile:
        publicRuntimeFile,

      westProbeFile:
        FILE,

      directionOnly:
        true,

      recommendedOwnerProvesDefect:
        false
    });
  }

  function buildIssues(
    validation,
    surface,
    admission
  ) {
    var issues = [];

    if (!validation.passed) {
      issues =
        issues.concat(
          validation.issues
        );
    }

    if (
      !surface
        .surfaceReceiptObserved
    ) {
      issues.push(
        issue(
          "SURFACE_TRUTH_RECEIPT_REQUIRED",
          "$.priorStationReceipts",
          "The CANVAS_SURFACE_TRUTH predecessor receipt was not available."
        )
      );
    } else if (
      !surface
        .surfaceReceiptPass
    ) {
      issues.push(
        issue(
          "SURFACE_TRUTH_RECEIPT_NOT_PASSING",
          "$.priorStationReceipts",
          "The CANVAS_SURFACE_TRUTH predecessor receipt was present but did not pass with handoff eligibility."
        )
      );
    }

    if (
      surface
        .surfaceReceiptPass &&
      !surface
        .admissionRecognized
    ) {
      issues.push(
        issue(
          "SURFACE_HANDOFF_GRAMMAR_NOT_RECOGNIZED",
          "$.priorStationReceipts",
          "F8 passed, but neither the legacy nor current surface-admission grammar established a lawful handoff."
        )
      );
    }

    admission
      .unavailableRequiredFields
      .forEach(
        function unavailable(
          field
        ) {
          issues.push(
            issue(
              "REQUIRED_RUNTIME_EVIDENCE_UNAVAILABLE",
              "$.runtimeFieldLedger." +
                field,
              field +
                " was unavailable across all recognized runtime-evidence sources."
            )
          );
        }
      );

    admission
      .explicitlyFalseRequiredFields
      .forEach(
        function explicitFalse(
          field
        ) {
          issues.push(
            issue(
              "REQUIRED_RUNTIME_EVIDENCE_EXPLICITLY_FALSE",
              "$.runtimeFieldLedger." +
                field,
              field +
                " was explicitly observed as false."
            )
          );
        }
      );

    admission
      .conflictingRequiredFields
      .forEach(
        function conflicting(
          field
        ) {
          issues.push(
            issue(
              "REQUIRED_RUNTIME_EVIDENCE_CONFLICT",
              "$.runtimeFieldLedger." +
                field,
              field +
                " had conflicting values across recognized sources."
            )
          );
        }
      );

    return deepFreeze(
      issues.slice(
        0,
        LIMITS.maxIssues
      )
    );
  }

  function interpretRuntime(
    request,
    validation
  ) {
    var surface =
      buildSurfaceEvidence(
        request
      );

    var sources =
      buildRuntimeSources(
        request,
        surface
      );

    var ledger =
      buildRuntimeFieldLedger(
        sources
      );

    var admission =
      buildAdmission(
        surface,
        ledger
      );

    var sourcePresence =
      buildSourcePresence(
        sources
      );

    var ownership =
      deriveOwnershipAssessment(
        request,
        surface,
        sources,
        admission
      );

    var issues =
      buildIssues(
        validation,
        surface,
        admission
      );

    return deepFreeze({
      surface:
        surface,

      sources:
        sources,

      sourcePresence:
        sourcePresence,

      ledger:
        ledger,

      admission:
        admission,

      ownership:
        ownership,

      issues:
        issues,

      runtimeId:
        ledger.runtimeId
          .value,

      rendererKind:
        ledger.rendererKind
          .value,

      backend:
        ledger.backend
          .value,

      runtimeEvidenceAdmitted:
        admission
          .runtimeEvidenceAdmitted
    });
  }

  function buildObservations(runtime) {
    return deepFreeze([
      {
        id:
          "WEST_RUNTIME_PRIOR_SURFACE_STATUS",

        kind:
          "EXPOSED_RECEIPT",

        surfaceReceiptObserved:
          runtime.surface
            .surfaceReceiptObserved,

        surfaceReceiptPass:
          runtime.surface
            .surfaceReceiptPass,

        legacyAdmissionPresent:
          runtime.surface
            .legacyAdmissionPresent,

        legacyAdmissionRecognized:
          runtime.surface
            .legacyAdmissionRecognized,

        currentClassificationPresent:
          runtime.surface
            .currentClassificationPresent,

        currentClassificationRecognized:
          runtime.surface
            .currentClassificationRecognized,

        surfaceAdmissionRecognized:
          runtime.surface
            .admissionRecognized,

        surfaceAdmissionSource:
          runtime.surface
            .admissionSource
      },

      {
        id:
          "WEST_RUNTIME_SOURCE_PRESENCE",

        kind:
          "DERIVED",

        f8RuntimeStatusPresent:
          runtime.sourcePresence
            .F8_CANVAS_SURFACE_RUNTIME_STATUS
            .present,

        f8TargetFramePresent:
          runtime.sourcePresence
            .F8_CANVAS_SURFACE_TARGET_FRAME
            .present,

        targetRuntimeStatusPresent:
          runtime.sourcePresence
            .REQUEST_TARGET_RUNTIME_STATUS
            .present,

        targetRuntimeReceiptPresent:
          runtime.sourcePresence
            .REQUEST_TARGET_RUNTIME_RECEIPT
            .present,

        constructRuntimePresent:
          runtime.sourcePresence
            .REQUEST_CONSTRUCT_RUNTIME
            .present,

        engineRuntimePresent:
          runtime.sourcePresence
            .REQUEST_ENGINE_RUNTIME
            .present,

        extensionsRuntimePresent:
          runtime.sourcePresence
            .REQUEST_EXTENSIONS_RUNTIME
            .present
      },

      {
        id:
          "WEST_RUNTIME_IDENTITY",

        kind:
          "DERIVED",

        runtimeId:
          runtime.ledger
            .runtimeId.value,

        runtimeIdState:
          runtime.ledger
            .runtimeId.state,

        runtimeIdSource:
          runtime.ledger
            .runtimeId
            .selectedSource,

        rendererKind:
          runtime.ledger
            .rendererKind.value,

        rendererKindState:
          runtime.ledger
            .rendererKind.state,

        rendererKindSource:
          runtime.ledger
            .rendererKind
            .selectedSource,

        backend:
          runtime.ledger
            .backend.value,

        backendState:
          runtime.ledger
            .backend.state,

        backendSource:
          runtime.ledger
            .backend
            .selectedSource,

        runtimeDeclared:
          runtime.ledger
            .runtimeDeclared.value,

        runtimeDeclaredState:
          runtime.ledger
            .runtimeDeclared.state,

        runtimeDeclaredSource:
          runtime.ledger
            .runtimeDeclared
            .selectedSource,

        runtimeActive:
          runtime.ledger
            .runtimeActive.value,

        runtimeActiveState:
          runtime.ledger
            .runtimeActive.state,

        runtimeActiveSource:
          runtime.ledger
            .runtimeActive
            .selectedSource
      },

      {
        id:
          "WEST_RUNTIME_SCENE_CAMERA",

        kind:
          "DERIVED",

        scenePresent:
          runtime.ledger
            .scenePresent.value,

        scenePresentState:
          runtime.ledger
            .scenePresent.state,

        scenePresentSource:
          runtime.ledger
            .scenePresent
            .selectedSource,

        cameraPresent:
          runtime.ledger
            .cameraPresent.value,

        cameraPresentState:
          runtime.ledger
            .cameraPresent.state,

        cameraPresentSource:
          runtime.ledger
            .cameraPresent
            .selectedSource
      },

      {
        id:
          "WEST_RUNTIME_RESOURCES",

        kind:
          "DERIVED",

        geometryPresent:
          runtime.ledger
            .geometryPresent.value,

        geometryPresentState:
          runtime.ledger
            .geometryPresent.state,

        geometryPresentSource:
          runtime.ledger
            .geometryPresent
            .selectedSource,

        materialPresent:
          runtime.ledger
            .materialPresent.value,

        materialPresentState:
          runtime.ledger
            .materialPresent.state,

        materialPresentSource:
          runtime.ledger
            .materialPresent
            .selectedSource,

        shaderOrPipelinePresent:
          runtime.ledger
            .shaderOrPipelinePresent
            .value,

        shaderOrPipelinePresentState:
          runtime.ledger
            .shaderOrPipelinePresent
            .state,

        shaderOrPipelinePresentSource:
          runtime.ledger
            .shaderOrPipelinePresent
            .selectedSource
      },

      {
        id:
          "WEST_RUNTIME_EXECUTION",

        kind:
          "DERIVED",

        renderPassObserved:
          runtime.ledger
            .renderPassObserved
            .value,

        renderPassObservedState:
          runtime.ledger
            .renderPassObserved
            .state,

        renderPassObservedSource:
          runtime.ledger
            .renderPassObserved
            .selectedSource,

        commandSubmitted:
          runtime.ledger
            .commandSubmitted
            .value,

        commandSubmittedState:
          runtime.ledger
            .commandSubmitted
            .state,

        commandSubmittedSource:
          runtime.ledger
            .commandSubmitted
            .selectedSource,

        presentationObserved:
          runtime.ledger
            .presentationObserved
            .value,

        presentationObservedState:
          runtime.ledger
            .presentationObserved
            .state,

        presentationObservedSource:
          runtime.ledger
            .presentationObserved
            .selectedSource,

        interactionObserved:
          runtime.ledger
            .interactionObserved
            .value,

        interactionObservedState:
          runtime.ledger
            .interactionObserved
            .state,

        interactionObservedSource:
          runtime.ledger
            .interactionObserved
            .selectedSource
      },

      {
        id:
          "WEST_RUNTIME_ADMISSIBILITY",

        kind:
          "DERIVED",

        classification:
          runtime.admission
            .classification,

        surfaceHandoffAdmitted:
          runtime.admission
            .surfaceHandoffAdmitted,

        runtimeIdentityAdmitted:
          runtime.admission
            .runtimeIdentityAdmitted,

        runtimeSceneCameraAdmitted:
          runtime.admission
            .runtimeSceneCameraAdmitted,

        runtimeResourcesAdmitted:
          runtime.admission
            .runtimeResourcesAdmitted,

        runtimeExecutionAdmitted:
          runtime.admission
            .runtimeExecutionAdmitted,

        runtimePresentationAdmitted:
          runtime.admission
            .runtimePresentationAdmitted,

        runtimeEvidenceAdmitted:
          runtime.admission
            .runtimeEvidenceAdmitted,

        nextStationEligible:
          runtime.admission
            .nextStationEligible,

        unavailableRequiredFields:
          runtime.admission
            .unavailableRequiredFields,

        explicitlyFalseRequiredFields:
          runtime.admission
            .explicitlyFalseRequiredFields,

        conflictingRequiredFields:
          runtime.admission
            .conflictingRequiredFields
      },

      {
        id:
          "WEST_RUNTIME_OWNERSHIP_ASSESSMENT",

        kind:
          "DERIVED",

        classification:
          runtime.ownership
            .classification,

        provenCulprit:
          runtime.ownership
            .provenCulprit,

        ownerType:
          runtime.ownership
            .ownerType,

        file:
          runtime.ownership
            .file,

        component:
          runtime.ownership
            .component,

        reason:
          runtime.ownership
            .reason,

        targetEvidencePresent:
          runtime.ownership
            .targetEvidencePresent,

        legacyEvidencePresent:
          runtime.ownership
            .legacyEvidencePresent,

        directionOnly:
          runtime.ownership
            .directionOnly,

        recommendedOwnerProvesDefect:
          runtime.ownership
            .recommendedOwnerProvesDefect
      },

      {
        id:
          "WEST_RUNTIME_BOUNDARY",

        kind:
          "DERIVED",

        runtimePresenceProvesVisualPass:
          false,

        renderPassDeclarationProvesPresentation:
          false,

        firstFrameProvesCommandSubmission:
          false,

        firstFrameProvesScenePresence:
          false,

        firstFrameProvesCameraPresence:
          false,

        firstFrameProvesMaterialPresence:
          false,

        firstFrameProvesShaderPresence:
          false,

        presentationEvidenceProvesReadiness:
          false,

        interactionEvidenceProvesCompletion:
          false,

        probeCreatedRuntimeEvidence:
          false,

        probeSynthesizedRequiredEvidence:
          false,

        gpuResourceCreationAuthority:
          false,

        recommendedOwnerProvesDefect:
          false
      }
    ]);
  }

  function executeCycleStation(request) {
    var validation =
      validateStationRequest(
        request
      );

    var runtime =
      interpretRuntime(
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
      "WEST_RUNTIME_EVIDENCE_ADMITTED_FOR_RUNTIME_INTERPRETATION";

    if (!validation.passed) {
      status =
        "HOLD";

      completed =
        false;

      handoffEligible =
        false;

      summary =
        "WEST_RUNTIME_HELD_REQUEST_INVALID";
    } else if (
      !runtime.surface
        .admissionRecognized
    ) {
      status =
        "HOLD";

      completed =
        false;

      handoffEligible =
        false;

      summary =
        "WEST_RUNTIME_HELD_SURFACE_HANDOFF_UNAVAILABLE";
    } else if (
      runtime.admission
        .conflictingRequiredFields
        .length
    ) {
      status =
        "HOLD";

      completed =
        false;

      handoffEligible =
        false;

      summary =
        "WEST_RUNTIME_HELD_EVIDENCE_CONFLICT";
    } else if (
      runtime.admission
        .explicitlyFalseRequiredFields
        .length
    ) {
      status =
        "HOLD";

      completed =
        false;

      handoffEligible =
        false;

      summary =
        "WEST_RUNTIME_HELD_EXPLICIT_NEGATIVE_EVIDENCE";
    } else if (
      runtime.admission
        .unavailableRequiredFields
        .length
    ) {
      status =
        "HOLD";

      completed =
        false;

      handoffEligible =
        false;

      summary =
        "WEST_RUNTIME_HELD_REQUIRED_EVIDENCE_UNAVAILABLE";
    } else if (
      !runtime
        .runtimeEvidenceAdmitted
    ) {
      status =
        "HOLD";

      completed =
        false;

      handoffEligible =
        false;

      summary =
        "WEST_RUNTIME_HELD_RUNTIME_EVIDENCE_INCOMPLETE";
    }

    var observations =
      buildObservations(
        runtime
      );

    var recommendedOwner = {
      ownerType:
        runtime.ownership
          .ownerType,

      subjectId:
        request &&
        request.construct &&
        typeof request.construct
          .constructId ===
          "string"
          ? request.construct
              .constructId
          : null,

      contract:
        request &&
        request.engine &&
        typeof request.engine
          .contract ===
          "string"
          ? request.engine
              .contract
          : null,

      file:
        runtime.ownership
          .file,

      component:
        runtime.ownership
          .component,

      classification:
        runtime.ownership
          .classification,

      reason:
        runtime.ownership
          .reason,

      provenCulprit:
        false,

      directionOnly:
        true
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
        observations,

      runtimeEvidenceSources:
        runtime.sources,

      runtimeSourcePresence:
        runtime.sourcePresence,

      runtimeFieldLedger:
        runtime.ledger,

      runtimeAdmission:
        runtime.admission,

      ownershipAssessment:
        runtime.ownership,

      evidence: [
        {
          id:
            "WEST_RUNTIME_REQUEST_HASH",

          kind:
            "DERIVED",

          hash:
            hash(
              request || {}
            )
        },

        {
          id:
            "WEST_RUNTIME_SURFACE_HANDOFF_HASH",

          kind:
            "DERIVED",

          hash:
            hash(
              runtime.surface
            )
        },

        {
          id:
            "WEST_RUNTIME_SOURCE_PRESENCE_HASH",

          kind:
            "DERIVED",

          hash:
            hash(
              runtime.sourcePresence
            )
        },

        {
          id:
            "WEST_RUNTIME_FIELD_LEDGER_HASH",

          kind:
            "DERIVED",

          hash:
            hash(
              runtime.ledger
            )
        },

        {
          id:
            "WEST_RUNTIME_ADMISSION",

          kind:
            "DERIVED",

          admitted:
            runtime
              .runtimeEvidenceAdmitted,

          classification:
            runtime.admission
              .classification,

          runtimeId:
            runtime.runtimeId,

          rendererKind:
            runtime.rendererKind,

          backend:
            runtime.backend,

          unavailableRequiredFieldCount:
            runtime.admission
              .unavailableRequiredFields
              .length,

          explicitlyFalseRequiredFieldCount:
            runtime.admission
              .explicitlyFalseRequiredFields
              .length,

          conflictingRequiredFieldCount:
            runtime.admission
              .conflictingRequiredFields
              .length
        },

        {
          id:
            "WEST_RUNTIME_OWNERSHIP_DIRECTION",

          kind:
            "DERIVED",

          classification:
            runtime.ownership
              .classification,

          ownerType:
            runtime.ownership
              .ownerType,

          file:
            runtime.ownership
              .file,

          component:
            runtime.ownership
              .component,

          provenCulprit:
            false,

          directionOnly:
            true
        },

        {
          id:
            "WEST_RUNTIME_VALIDATION",

          kind:
            "DERIVED",

          passed:
            validation.passed,

          issueCount:
            validation.issues
              .length
        }
      ],

      issues:
        runtime.issues,

      firstHeldCoordinate:
        status === "HOLD"
          ? "F13:WEST_PROBE_RUNTIME"
          : null,

      firstFailedCoordinate:
        null,

      firstConflictCoordinate:
        runtime.admission
          .conflictingRequiredFields
          .length
          ? "F13:WEST_PROBE_RUNTIME"
          : null,

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

      currentF8Contract:
        CURRENT_F8_CONTRACT,

      currentF8File:
        CURRENT_F8_FILE,

      publicRuntimeAlias:
        PUBLIC_RUNTIME_ALIAS,

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
        "Position 5 West runtime evidence probe for current F8 Surface Truth, canonical target-runtime evidence, legacy runtime declarations, field provenance, conflict detection, and bounded ownership direction.",

      sourcePriority:
        SOURCE_PRIORITY.slice(),

      requiredBooleanFields:
        REQUIRED_BOOLEAN_FIELDS
          .slice(),

      optionalFields:
        OPTIONAL_FIELDS
          .slice(),

      evidenceStates: {
        observedTrue:
          EVIDENCE_STATE.TRUE,

        observedFalse:
          EVIDENCE_STATE.FALSE,

        unavailable:
          EVIDENCE_STATE
            .UNAVAILABLE,

        conflict:
          EVIDENCE_STATE
            .CONFLICT,

        observedValue:
          EVIDENCE_STATE
            .VALUE
      },

      currentF8GrammarRecognized:
        true,

      legacyF8GrammarRecognized:
        true,

      currentTargetRuntimeGrammarRecognized:
        true,

      legacyRuntimeGrammarRecognized:
        true,

      fieldSourceLedgerPublished:
        true,

      sourcePresencePublished:
        true,

      ownershipAssessmentPublished:
        true,

      threeStateEvidence:
        true,

      conflictAware:
        true,

      quietLoad:
        true,

      threeDimensionalNative:
        true,

      createsRuntimeEvidence:
        false,

      createsGPUResources:
        false,

      liveRuntimeMutation:
        false,

      runtimePresenceProvesVisualPass:
        false,

      presentationEvidenceProvesReadiness:
        false,

      recommendedOwnerProvesDefect:
        false,

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

      currentF8GrammarRecognized:
        true,

      legacyF8GrammarRecognized:
        true,

      currentTargetRuntimeGrammarRecognized:
        true,

      legacyRuntimeGrammarRecognized:
        true,

      threeStateEvidence:
        true,

      fieldSourceLedgerPublished:
        true,

      conflictAware:
        true,

      threeDimensionalNative:
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

      SOURCE_PRIORITY:
        SOURCE_PRIORITY,

      REQUIRED_BOOLEAN_FIELDS:
        REQUIRED_BOOLEAN_FIELDS,

      EVIDENCE_STATE:
        EVIDENCE_STATE,

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
            clonePlain(
              value,
              []
            )
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
      typeof root[name] !==
        "object"
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
      root
        .AUDRALIA_DIAGNOSTIC_PROBE_WEST;

    if (
      existing &&
      existing.CONTRACT !==
        CONTRACT &&
      existing.CONTRACT !==
        PREVIOUS_CONTRACT
    ) {
      root
        .AUDRALIA_DIAGNOSTIC_PROBE_WEST_INSTALLATION_CONFLICT =
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
            existing.CONTRACT ||
            null,

          generatedAt:
            nowIso()
        });

      return api;
    }

    root
      .AUDRALIA_DIAGNOSTIC_PROBE_WEST =
      api;

    var namespace =
      ensureNamespace(
        "AUDRALIA"
      );

    if (namespace) {
      namespace
        .diagnosticProbeWest =
        api;
    }

    root
      .AUDRALIA_DIAGNOSTIC_PROBE_WEST_RECEIPT =
      getDefinitionReceipt();

    root
      .__AUDRALIA_DIAGNOSTIC_PROBE_WEST_LOADED__ =
      true;

    root
      .__AUDRALIA_DIAGNOSTIC_PROBE_WEST_STATION_ID__ =
      STATION_ID;

    root
      .__AUDRALIA_DIAGNOSTIC_PROBE_WEST_VERSION__ =
      VERSION;

    root
      .__AUDRALIA_DIAGNOSTIC_PROBE_WEST_CONTRACT__ =
      CONTRACT;

    return api;
  }

  var API =
    buildApi();

  publish(API);

  if (
    typeof module !==
      "undefined" &&
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

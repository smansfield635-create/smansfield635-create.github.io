// /assets/audralia/audralia.diagnostic.probe.north.js
// AUDRALIA_DIAGNOSTIC_NORTH_PROBE_INTAKE_STATION_F1_EVIDENCE_AUTHORITY_TNT_v3
// Full-file replacement.
// Diagnostic-only.
// Read-only.
// Conductor-compatible Station 1 API.
// Renews v2 to shared diagnostic-station standard.
// Does not mutate, repair, authorize production, certify readiness, or claim visual pass.

(function registerAudraliaDiagnosticProbeNorth(global) {
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
    "AUDRALIA_DIAGNOSTIC_NORTH_PROBE_INTAKE_STATION_F1_EVIDENCE_AUTHORITY_TNT_v3";

  var PREVIOUS_CONTRACT =
    "AUDRALIA_DIAGNOSTIC_NORTH_PROBE_INTAKE_STATION_F1_EVIDENCE_AUTHORITY_TNT_v2";

  var LEGACY_CONTRACT =
    "AUDRALIA_DIAGNOSTIC_NORTH_PROBE_INTAKE_STATION_F1_EVIDENCE_AUTHORITY_TNT_v1";

  var VERSION =
    "3.0.0";

  var VERSION_LABEL =
    "2026-06-22.audralia-diagnostic-north-probe-intake-station-f1-evidence-authority-v3";

  var FILE =
    "/assets/audralia/audralia.diagnostic.probe.north.js";

  var STATION_ID =
    "NORTH_PROBE_INTAKE";

  var CYCLE_POSITION =
    1;

  var FIBONACCI =
    "F1";

  var NEWS =
    "NORTH";

  var REQUEST_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_STATION_EXECUTION_REQUEST_v1";

  var STATION_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_STATION_RECEIPT_v1";

  var DEFINITION_RECEIPT_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_STATION_DEFINITION_RECEIPT_v2";

  var INSTALLATION_RECEIPT_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_STATION_INSTALLATION_RECEIPT_v1";

  var NO_CLAIMS =
    deepFreeze({
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
      stationEvidenceInterpretationAuthority: true,
      terminalSynthesisAuthority: false,
      readyClaimed: false,
      verifiedClaimed: false,
      f13Claimed: false,
      f21Claimed: false,
      visualPassClaimed: false,
      finalVisualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      webGPU: false,
      diagnosticPassProvesReady: false,
      directionOnly: true
    });

  var LIMITS =
    deepFreeze({
      maxStringLength: 12000,
      maxArrayLength: 377,
      maxObjectKeys: 233,
      maxDepth: 13,
      maxIssues: 89
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
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return false;
    }

    var proto =
      Object.getPrototypeOf(value);

    return proto === Object.prototype || proto === null;
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function deepFreeze(value, seen) {
    if (!value || typeof value !== "object") {
      return value;
    }

    var memory =
      seen || [];

    if (memory.indexOf(value) !== -1) {
      return value;
    }

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
    var memory =
      seen || [];

    var level =
      Number(depth) || 0;

    if (level > LIMITS.maxDepth) {
      return null;
    }

    if (
      value === null ||
      typeof value === "boolean"
    ) {
      return value;
    }

    if (typeof value === "string") {
      return value.slice(0, LIMITS.maxStringLength);
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

    if (!value || typeof value !== "object") {
      return null;
    }

    if (!Array.isArray(value) && !isPlainObject(value)) {
      return null;
    }

    if (memory.indexOf(value) !== -1) {
      return null;
    }

    memory.push(value);

    if (Array.isArray(value)) {
      return value
        .slice(0, LIMITS.maxArrayLength)
        .map(function cloneArrayItem(item) {
          return clonePlain(item, memory.slice(), level + 1);
        });
    }

    var output = {};

    Object.keys(value)
      .slice(0, LIMITS.maxObjectKeys)
      .forEach(function cloneKey(key) {
        try {
          output[String(key).slice(0, LIMITS.maxStringLength)] =
            clonePlain(value[key], memory.slice(), level + 1);
        } catch (_error) {
          output[String(key)] = null;
        }
      });

    return output;
  }

  function clone(value) {
    return clonePlain(value, [], 0);
  }

  function stableEncode(value) {
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
      return "[" + value.map(stableEncode).join(",") + "]";
    }

    if (isPlainObject(value)) {
      return (
        "{" +
        Object.keys(value)
          .sort()
          .map(function encodeKey(key) {
            return JSON.stringify(key) + ":" + stableEncode(value[key]);
          })
          .join(",") +
        "}"
      );
    }

    return "null";
  }

  function hash(value) {
    var text =
      stableEncode(clone(value));

    var h =
      0x811c9dc5;

    for (var index = 0; index < text.length; index += 1) {
      h ^= text.charCodeAt(index);

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
      ("00000000" + h.toString(16)).slice(-8)
    );
  }

  function hashReceipt(receipt) {
    var payload =
      clone(receipt);

    if (isPlainObject(payload)) {
      payload.receiptHash = null;
    }

    return hash(payload);
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

  function observation(id, value, kind) {
    return {
      id:
        String(id),

      kind:
        kind || "OBSERVED",

      value:
        clone(value)
    };
  }

  function validatePlainData(value) {
    var issues = [];

    function walk(item, path, depth, seen) {
      if (issues.length >= LIMITS.maxIssues) {
        return;
      }

      if (depth > LIMITS.maxDepth) {
        issues.push(issue("PLAIN_DATA_DEPTH_EXCEEDED", path));
        return;
      }

      if (
        item === null ||
        typeof item === "boolean" ||
        typeof item === "string" ||
        isFiniteNumber(item)
      ) {
        return;
      }

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

        item.forEach(function eachArray(entry, arrayIndex) {
          walk(entry, path + "[" + arrayIndex + "]", depth + 1, seen.slice());
        });

        return;
      }

      var keys =
        Object.keys(item);

      if (keys.length > LIMITS.maxObjectKeys) {
        issues.push(issue("OBJECT_KEY_LIMIT_EXCEEDED", path));
        return;
      }

      keys.forEach(function eachKey(key) {
        var descriptor;

        try {
          descriptor =
            Object.getOwnPropertyDescriptor(item, key);
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
      passed:
        issues.length === 0,

      issues:
        deepFreeze(issues)
    });
  }

  function safeObject(value) {
    return isPlainObject(value)
      ? clone(value)
      : null;
  }

  function readRequest(packet) {
    var source =
      isPlainObject(packet)
        ? packet
        : {};

    var construct =
      safeObject(source.construct);

    var target =
      safeObject(source.target) ||
      (
        construct && isPlainObject(construct.target)
          ? clone(construct.target)
          : null
      );

    var route =
      safeObject(source.route) ||
      (
        construct && typeof construct.route === "string"
          ? { route: construct.route }
          : null
      );

    return deepFreeze({
      rawRequest:
        clone(source),

      schema:
        typeof source.schema === "string"
          ? source.schema
          : null,

      cycleId:
        typeof source.cycleId === "string" && source.cycleId
          ? source.cycleId
          : null,

      mode:
        typeof source.mode === "string" && source.mode
          ? source.mode
          : "AUDIT",

      position:
        Number(source.position) || null,

      stationId:
        typeof source.stationId === "string"
          ? source.stationId
          : null,

      subject:
        safeObject(source.subject),

      engine:
        safeObject(source.engine),

      construct:
        construct,

      target:
        target,

      route:
        route,

      engineFamily:
        safeObject(source.engineFamily),

      evidencePolicy:
        safeObject(source.evidencePolicy),

      canonicalCycleRequest:
        safeObject(source.canonicalCycleRequest),

      requestValidation:
        safeObject(source.requestValidation),

      requestCompatibility:
        safeObject(source.requestCompatibility),

      priorLedgerHash:
        typeof source.priorLedgerHash === "string"
          ? source.priorLedgerHash
          : null,

      priorStationReceipts:
        Array.isArray(source.priorStationReceipts)
          ? clone(source.priorStationReceipts)
          : [],

      noClaims:
        safeObject(source.noClaims)
    });
  }

  function deriveTargetRoute(request) {
    var target =
      request.target || {};

    var route =
      request.route || {};

    var construct =
      request.construct || {};

    return (
      target.targetRoute ||
      target.expectedRoute ||
      target.route ||
      route.targetRoute ||
      route.expectedRoute ||
      route.route ||
      construct.targetRoute ||
      construct.route ||
      null
    );
  }

  function validateStationRequest(request) {
    var issues = [];

    var plain =
      validatePlainData(request.rawRequest || {});

    if (!plain.passed) {
      issues =
        issues.concat(plain.issues);
    }

    if (request.schema && request.schema !== REQUEST_SCHEMA) {
      issues.push(
        issue(
          "REQUEST_SCHEMA_UNRECOGNIZED",
          "$.schema",
          "Station 1 received a noncanonical station request schema but preserved the request for diagnostic evidence."
        )
      );
    }

    if (request.position !== null && request.position !== CYCLE_POSITION) {
      issues.push(issue("REQUEST_POSITION_MISMATCH", "$.position"));
    }

    if (request.stationId && request.stationId !== STATION_ID) {
      issues.push(issue("REQUEST_STATION_ID_MISMATCH", "$.stationId"));
    }

    if (!request.cycleId) {
      issues.push(issue("CYCLE_ID_MISSING", "$.cycleId"));
    }

    if (!isPlainObject(request.subject)) {
      issues.push(issue("SUBJECT_PACKET_MISSING", "$.subject"));
    }

    if (!isPlainObject(request.construct)) {
      issues.push(issue("CONSTRUCT_PACKET_MISSING", "$.construct"));
    }

    return deepFreeze({
      passed:
        issues.filter(function fatal(entry) {
          return (
            entry.code === "CYCLE_ID_MISSING" ||
            entry.code === "SUBJECT_PACKET_MISSING" ||
            entry.code === "CONSTRUCT_PACKET_MISSING"
          );
        }).length === 0,

      issueCount:
        issues.length,

      issues:
        deepFreeze(issues)
    });
  }

  function makeReceipt(status, completed, handoffEligible, summary, request, observations, evidence, issues) {
    var receipt = {
      schema:
        STATION_SCHEMA,

      cycleId:
        request.cycleId || null,

      position:
        CYCLE_POSITION,

      cyclePosition:
        CYCLE_POSITION,

      stationId:
        STATION_ID,

      role:
        STATION_ID,

      news:
        NEWS,

      fibonacci:
        FIBONACCI,

      contract:
        CONTRACT,

      previousContract:
        PREVIOUS_CONTRACT,

      legacyContract:
        LEGACY_CONTRACT,

      version:
        VERSION,

      versionLabel:
        VERSION_LABEL,

      file:
        FILE,

      status:
        status,

      completed:
        completed === true,

      handoffEligible:
        handoffEligible === true,

      summary:
        summary,

      observations:
        Array.isArray(observations)
          ? clone(observations)
          : [],

      evidence:
        Array.isArray(evidence)
          ? clone(evidence)
          : [],

      issues:
        Array.isArray(issues)
          ? clone(issues)
          : [],

      firstHeldCoordinate:
        status === "HOLD"
          ? "F1:NORTH_PROBE_INTAKE"
          : null,

      firstFailedCoordinate:
        status === "FAIL"
          ? "F1:NORTH_PROBE_INTAKE"
          : null,

      firstConflictCoordinate:
        status === "CONFLICT"
          ? "F1:NORTH_PROBE_INTAKE"
          : null,

      recommendedOwner: {
        ownerType:
          "DIAGNOSTIC_STATION",

        subjectId:
          STATION_ID,

        contract:
          CONTRACT,

        file:
          FILE,

        component:
          STATION_ID
      },

      generatedAt:
        nowIso(),

      noClaims:
        clone(NO_CLAIMS),

      receiptHash:
        null
    };

    receipt.receiptHash =
      hashReceipt(receipt);

    return deepFreeze(receipt);
  }

  function executeCycleStation(packet) {
    var request =
      readRequest(packet);

    var validation =
      validateStationRequest(request);

    var targetRoute =
      deriveTargetRoute(request);

    var target =
      request.target || {};

    var framePresent =
      target.framePresent === true;

    var documentLoaded =
      target.documentLoaded === true;

    var sameOriginAccessible =
      target.sameOriginAccessible === true;

    var routeMatched =
      target.routeMatched === true;

    var observations = [
      observation("REQUEST_SCHEMA", request.schema),
      observation("CYCLE_ID_PRESENT", Boolean(request.cycleId)),
      observation("SUBJECT_PRESENT", isPlainObject(request.subject)),
      observation("ENGINE_PRESENT", isPlainObject(request.engine)),
      observation("CONSTRUCT_PRESENT", isPlainObject(request.construct)),
      observation("TARGET_PRESENT", isPlainObject(request.target)),
      observation("ROUTE_PRESENT", isPlainObject(request.route)),
      observation("TARGET_ROUTE", targetRoute),
      observation("TARGET_FRAME_PRESENT", framePresent),
      observation("TARGET_DOCUMENT_LOADED", documentLoaded),
      observation("TARGET_SAME_ORIGIN_ACCESSIBLE", sameOriginAccessible),
      observation("TARGET_ROUTE_MATCHED", routeMatched),
      observation("PRIOR_LEDGER_HASH_PRESENT", Boolean(request.priorLedgerHash))
    ];

    var evidence = [
      {
        id:
          "NORTH_INTAKE_REQUEST_BOUNDARY",

        kind:
          "OBSERVED",

        cycleId:
          request.cycleId,

        mode:
          request.mode,

        subjectPresent:
          isPlainObject(request.subject),

        enginePresent:
          isPlainObject(request.engine),

        constructPresent:
          isPlainObject(request.construct),

        targetPresent:
          isPlainObject(request.target),

        routePresent:
          isPlainObject(request.route),

        targetRoute:
          targetRoute,

        framePresent:
          framePresent,

        documentLoaded:
          documentLoaded,

        sameOriginAccessible:
          sameOriginAccessible,

        routeMatched:
          routeMatched,

        priorLedgerHash:
          request.priorLedgerHash,

        requestHash:
          hash(request.rawRequest || {})
      },
      {
        id:
          "NORTH_INTAKE_VALIDATION",

        kind:
          "DERIVED",

        passed:
          validation.passed,

        issueCount:
          validation.issueCount,

        issues:
          clone(validation.issues)
      }
    ];

    if (!validation.passed) {
      return makeReceipt(
        "HOLD",
        false,
        false,
        "NORTH_PROBE_INTAKE_HELD_REQUEST_INCOMPLETE",
        request,
        observations,
        evidence,
        validation.issues
      );
    }

    return makeReceipt(
      "PASS",
      true,
      true,
      "NORTH_PROBE_INTAKE_ADMITTED",
      request,
      observations,
      evidence,
      []
    );
  }

  function getDefinitionValidation() {
    var issues = [];

    if (STATION_ID !== "NORTH_PROBE_INTAKE") {
      issues.push(issue("STATION_ID_MISMATCH", "$.STATION_ID"));
    }

    if (CYCLE_POSITION !== 1) {
      issues.push(issue("CYCLE_POSITION_MISMATCH", "$.CYCLE_POSITION"));
    }

    if (FIBONACCI !== "F1") {
      issues.push(issue("FIBONACCI_MISMATCH", "$.FIBONACCI"));
    }

    if (!isFunction(executeCycleStation)) {
      issues.push(issue("EXECUTE_CYCLE_STATION_MISSING", "$.executeCycleStation"));
    }

    return deepFreeze({
      schema:
        "AUDRALIA_DIAGNOSTIC_NORTH_PROBE_DEFINITION_VALIDATION_v3",

      passed:
        issues.length === 0,

      issueCount:
        issues.length,

      issues:
        deepFreeze(issues),

      generatedAt:
        nowIso()
    });
  }

  function getDefinitionReceipt() {
    var validation =
      getDefinitionValidation();

    var receipt = {
      schema:
        DEFINITION_RECEIPT_SCHEMA,

      receipt:
        "AUDRALIA_DIAGNOSTIC_NORTH_PROBE_DEFINITION_RECEIPT_v3",

      stationId:
        STATION_ID,

      cyclePosition:
        CYCLE_POSITION,

      fibonacci:
        FIBONACCI,

      news:
        NEWS,

      contract:
        CONTRACT,

      previousContract:
        PREVIOUS_CONTRACT,

      legacyContract:
        LEGACY_CONTRACT,

      version:
        VERSION,

      versionLabel:
        VERSION_LABEL,

      file:
        FILE,

      status:
        validation.passed
          ? "AVAILABLE"
          : "HELD",

      conductorCompatible:
        true,

      stationRequestSchema:
        REQUEST_SCHEMA,

      stationReceiptSchema:
        STATION_SCHEMA,

      exposesUppercaseIdentity:
        true,

      exposesExecuteCycleStation:
        true,

      exposesGetDefinitionReceipt:
        true,

      validation:
        validation,

      noClaims:
        clone(NO_CLAIMS),

      generatedAt:
        nowIso(),

      definitionHash:
        null
    };

    receipt.definitionHash =
      hash(receipt);

    return deepFreeze(receipt);
  }

  var INSTALLATION = {
    decision:
      "LOCAL_ONLY_NO_ROOT",

    reason:
      "ROOT_UNAVAILABLE",

    published:
      [],

    warnings:
      [],

    errors:
      [],

    installedAt:
      nowIso()
  };

  function getInstallationReceipt() {
    return deepFreeze({
      schema:
        INSTALLATION_RECEIPT_SCHEMA,

      receipt:
        "AUDRALIA_DIAGNOSTIC_NORTH_PROBE_INSTALLATION_RECEIPT_v3",

      contract:
        CONTRACT,

      previousContract:
        PREVIOUS_CONTRACT,

      legacyContract:
        LEGACY_CONTRACT,

      version:
        VERSION,

      file:
        FILE,

      decision:
        INSTALLATION.decision,

      reason:
        INSTALLATION.reason,

      published:
        clone(INSTALLATION.published),

      warnings:
        clone(INSTALLATION.warnings),

      errors:
        clone(INSTALLATION.errors),

      installedAt:
        INSTALLATION.installedAt,

      noClaims:
        clone(NO_CLAIMS)
    });
  }

  function getStatus() {
    return deepFreeze({
      contract:
        CONTRACT,

      previousContract:
        PREVIOUS_CONTRACT,

      version:
        VERSION,

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

      conductorCompatible:
        true,

      noClaims:
        clone(NO_CLAIMS)
    });
  }

  function ensureNamespace(name) {
    if (!root || typeof root !== "object") {
      return null;
    }

    if (!root[name] || typeof root[name] !== "object") {
      root[name] = {};
    }

    return root[name];
  }

  function buildApi() {
    return deepFreeze({
      SCHEMA:
        "AUDRALIA_DIAGNOSTIC_STATION_API_v2",

      STATION_ID:
        STATION_ID,

      CYCLE_POSITION:
        CYCLE_POSITION,

      FIBONACCI:
        FIBONACCI,

      NEWS:
        NEWS,

      CONTRACT:
        CONTRACT,

      PREVIOUS_CONTRACT:
        PREVIOUS_CONTRACT,

      LEGACY_CONTRACT:
        LEGACY_CONTRACT,

      VERSION:
        VERSION,

      VERSION_LABEL:
        VERSION_LABEL,

      FILE:
        FILE,

      REQUEST_SCHEMA:
        REQUEST_SCHEMA,

      STATION_SCHEMA:
        STATION_SCHEMA,

      NO_CLAIMS:
        NO_CLAIMS,

      clone:
        function exposedClone(value) {
          return deepFreeze(clone(value));
        },

      hash:
        hash,

      validatePlainData:
        validatePlainData,

      validateStationRequest:
        function exposedValidateStationRequest(packet) {
          return validateStationRequest(readRequest(packet));
        },

      getDefinitionValidation:
        getDefinitionValidation,

      getDefinitionReceipt:
        getDefinitionReceipt,

      getInstallationReceipt:
        getInstallationReceipt,

      getStatus:
        getStatus,

      executeCycleStation:
        executeCycleStation,

      execute:
        executeCycleStation,

      stationId:
        STATION_ID,

      cyclePosition:
        CYCLE_POSITION,

      fibonacci:
        FIBONACCI,

      contract:
        CONTRACT,

      version:
        VERSION,

      file:
        FILE
    });
  }

  function publish(api) {
    if (!root || typeof root !== "object") {
      return api;
    }

    var existing =
      root.AUDRALIA_DIAGNOSTIC_PROBE_NORTH;

    if (
      existing &&
      existing.CONTRACT &&
      existing.CONTRACT !== CONTRACT &&
      existing.CONTRACT !== PREVIOUS_CONTRACT &&
      existing.CONTRACT !== LEGACY_CONTRACT
    ) {
      INSTALLATION.decision =
        "CONFLICT";

      INSTALLATION.reason =
        "PRIMARY_GLOBAL_OCCUPIED_BY_INCOMPATIBLE_AUTHORITY";

      INSTALLATION.errors.push(
        "PRIMARY_GLOBAL_CONFLICT"
      );

      root.AUDRALIA_DIAGNOSTIC_PROBE_NORTH_INSTALLATION_CONFLICT =
        getInstallationReceipt();

      return api;
    }

    root.AUDRALIA_DIAGNOSTIC_PROBE_NORTH =
      api;

    INSTALLATION.published.push(
      "AUDRALIA_DIAGNOSTIC_PROBE_NORTH"
    );

    root.AUDRALIA_DIAGNOSTIC_NORTH_PROBE =
      api;

    INSTALLATION.published.push(
      "AUDRALIA_DIAGNOSTIC_NORTH_PROBE"
    );

    root.AUDRALIA_DIAGNOSTIC_PROBE_NORTH_INTAKE =
      api;

    INSTALLATION.published.push(
      "AUDRALIA_DIAGNOSTIC_PROBE_NORTH_INTAKE"
    );

    root.AUDRALIA_DIAGNOSTIC_NORTH_INTAKE =
      api;

    INSTALLATION.published.push(
      "AUDRALIA_DIAGNOSTIC_NORTH_INTAKE"
    );

    var namespace =
      ensureNamespace("AUDRALIA");

    if (namespace) {
      namespace.diagnosticProbeNorth =
        api;

      INSTALLATION.published.push(
        "AUDRALIA.diagnosticProbeNorth"
      );

      if (!namespace.diagnostics || typeof namespace.diagnostics !== "object") {
        namespace.diagnostics = {};
      }

      namespace.diagnostics.probeNorth =
        api;

      namespace.diagnostics.northProbe =
        api;

      INSTALLATION.published.push(
        "AUDRALIA.diagnostics.probeNorth"
      );

      INSTALLATION.published.push(
        "AUDRALIA.diagnostics.northProbe"
      );
    }

    root.AUDRALIA_DIAGNOSTIC_PROBE_NORTH_RECEIPT =
      getDefinitionReceipt();

    INSTALLATION.published.push(
      "AUDRALIA_DIAGNOSTIC_PROBE_NORTH_RECEIPT"
    );

    root.AUDRALIA_DIAGNOSTIC_NORTH_PROBE_INSTALLATION_RECEIPT =
      getInstallationReceipt();

    INSTALLATION.published.push(
      "AUDRALIA_DIAGNOSTIC_NORTH_PROBE_INSTALLATION_RECEIPT"
    );

    root.__AUDRALIA_DIAGNOSTIC_PROBE_NORTH_LOADED__ =
      true;

    root.__AUDRALIA_DIAGNOSTIC_PROBE_NORTH_VERSION__ =
      VERSION;

    root.__AUDRALIA_DIAGNOSTIC_PROBE_NORTH_CONTRACT__ =
      CONTRACT;

    root.__AUDRALIA_DIAGNOSTIC_NORTH_PROBE_READY_FOR_REGISTRATION__ =
      true;

    INSTALLATION.published.push(
      "__AUDRALIA_DIAGNOSTIC_PROBE_NORTH_LOADED__"
    );

    INSTALLATION.published.push(
      "__AUDRALIA_DIAGNOSTIC_PROBE_NORTH_VERSION__"
    );

    INSTALLATION.published.push(
      "__AUDRALIA_DIAGNOSTIC_PROBE_NORTH_CONTRACT__"
    );

    INSTALLATION.published.push(
      "__AUDRALIA_DIAGNOSTIC_NORTH_PROBE_READY_FOR_REGISTRATION__"
    );

    INSTALLATION.decision =
      existing
        ? "COMPATIBLE_REPLACEMENT_OR_UPGRADE"
        : "NEW_INSTALLATION";

    INSTALLATION.reason =
      "PUBLISHED";

    return api;
  }

  var API =
    buildApi();

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

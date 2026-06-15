// /assets/audralia/audralia.diagnostic.north.conductor.js
// AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_NINE_CYCLE_AUTHORITY_3D_TNT_v2
// Full-file replacement.
// Quiet-load, dependency-free, 3D-native diagnostic conductor.
// Owns nine-cycle diagnostic sequence, station registration, handoff authority,
// route-compatible cycle execution, interrupted-cycle terminal rail synthesis,
// station discovery, and restitution-coordinate reporting.
// Does not own engine execution, rendering, production mutation, repair authorization,
// route mutation, contract rewrite, WebGL/WebGPU initialization, or final production readiness.

(function audraliaDiagnosticNorthConductorNineCycleAuthority3D(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);

  var CONTRACT =
    "AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_NINE_CYCLE_AUTHORITY_3D_TNT_v2";
  var PREVIOUS_CONTRACT =
    "AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_NINE_CYCLE_AUTHORITY_3D_TNT_v1";
  var VERSION = "2.0.0";
  var VERSION_LABEL =
    "2026-06-15.audralia-diagnostic-north-conductor-nine-cycle-authority-3d-v2";
  var FILE = "/assets/audralia/audralia.diagnostic.north.conductor.js";

  var DEFINITION_RECEIPT =
    "AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_DEFINITION_RECEIPT_v2";
  var INSTALLATION_RECEIPT =
    "AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_INSTALLATION_RECEIPT_v2";

  var CYCLE_SCHEMA = "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_PACKET_v1";
  var REQUEST_SCHEMA = "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_REQUEST_v1";
  var ROUTE_REQUEST_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_CONDUCTOR_REQUEST_v2";
  var STATION_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_STATION_RECEIPT_v1";
  var HANDOFF_SCHEMA = "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_HANDOFF_v1";
  var RESTITUTION_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_RESTITUTION_COORDINATE_v1";
  var HASH_LABEL = "AUDRALIA_DIAGNOSTIC_HASH_v1";

  var STATUSES = Object.freeze({
    PASS: "PASS",
    HOLD: "HOLD",
    FAIL: "FAIL",
    CONFLICT: "CONFLICT",
    NOT_APPLICABLE: "NOT_APPLICABLE",
    ERROR: "ERROR"
  });

  var CYCLE_STATUSES = Object.freeze({
    EMPTY: "EMPTY",
    OPEN: "OPEN",
    SEALED: "SEALED",
    RUNNING: "RUNNING",
    COMPLETE: "COMPLETE",
    HELD: "HELD",
    FAILED: "FAILED",
    CONFLICTING: "CONFLICTING",
    ERROR: "ERROR",
    DISPOSED: "DISPOSED"
  });

  var MODES = Object.freeze({
    CONSTRUCTION: "CONSTRUCTION",
    CALIBRATION: "CALIBRATION",
    RESTITUTION: "RESTITUTION",
    AUDIT: "AUDIT"
  });

  var REGISTRATION_STATUSES = Object.freeze({
    REGISTERED: "REGISTERED",
    DUPLICATE_IDENTICAL: "DUPLICATE_IDENTICAL",
    CONFLICT: "CONFLICT",
    REJECTED: "REJECTED"
  });

  var LIMITS = Object.freeze({
    stationCount: 9,
    maxAuxiliariesPerStation: 9,
    maxStationIssues: 89,
    maxStationEvidenceItems: 233,
    maxCycleIssues: 377,
    maxStringLength: 12000,
    maxArrayLength: 377,
    maxObjectKeys: 233,
    maxTraversalDepth: 13
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
    f13Claimed: false,
    f21Claimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webGPU: false
  });

  var CAPABILITIES = Object.freeze({
    diagnosticSequenceAuthority: true,
    stationRegistrationAuthority: true,
    handoffAuthority: true,
    cycleInterruptionAuthority: true,
    terminalRailInvocationAuthority: true,
    restitutionCoordinateAuthority: true,
    routeCompatibleExecutionAuthority: true,
    stationDiscoveryAuthority: true,
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
    finalProductionVerdictAuthority: false
  });

  var POSITIONS = deepFreeze([
    {
      position: 1,
      fibonacci: "F1",
      news: "NORTH",
      stationId: "NORTH_PROBE_INTAKE",
      file: "/assets/audralia/audralia.diagnostic.probe.north.js",
      globalNames: [
        "AUDRALIA_DIAGNOSTIC_PROBE_NORTH",
        "AUDRALIA_DIAGNOSTIC_NORTH_PROBE",
        "AUDRALIA_DIAGNOSTIC_PROBE_NORTH_INTAKE",
        "AUDRALIA_DIAGNOSTIC_NORTH_INTAKE",
        "AUDRALIA.diagnosticProbeNorth",
        "AUDRALIA.diagnostics.probeNorth",
        "AUDRALIA.diagnostics.northProbe"
      ],
      role: "Establish cycle subject identity, engine identity, construct identity, route identity, mode, and provenance."
    },
    {
      position: 2,
      fibonacci: "F3",
      news: "EAST",
      stationId: "EAST_PROBE_SOURCE",
      file: "/assets/audralia/audralia.diagnostic.probe.east.js",
      globalNames: [
        "AUDRALIA_DIAGNOSTIC_PROBE_EAST",
        "AUDRALIA_DIAGNOSTIC_EAST_PROBE",
        "AUDRALIA_DIAGNOSTIC_PROBE_EAST_SOURCE",
        "AUDRALIA_DIAGNOSTIC_EAST_SOURCE",
        "AUDRALIA.diagnosticProbeEast",
        "AUDRALIA.diagnostics.probeEast",
        "AUDRALIA.diagnostics.eastProbe"
      ],
      role: "Observe source-side declarations, construction inputs, file identities, contract identities, model declarations, and declared dependencies."
    },
    {
      position: 3,
      fibonacci: "F5",
      news: "EAST",
      stationId: "EAST_CONSTRUCTION_INTERPRETATION",
      file: "/assets/audralia/audralia.diagnostic.east.js",
      globalNames: [
        "AUDRALIA_DIAGNOSTIC_EAST",
        "AUDRALIA_DIAGNOSTIC_EAST_CONSTRUCTION",
        "AUDRALIA_DIAGNOSTIC_EAST_INTERPRETATION",
        "AUDRALIA.diagnosticEast",
        "AUDRALIA.diagnostics.east",
        "AUDRALIA.diagnostics.eastInterpretation"
      ],
      role: "Interpret source-side composition and construction admissibility."
    },
    {
      position: 4,
      fibonacci: "F8",
      news: "SURFACE",
      stationId: "CANVAS_SURFACE_TRUTH",
      file: "/assets/audralia/audralia.diagnostic.probe.canvas.surface.truth.js",
      globalNames: [
        "AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
        "AUDRALIA_DIAGNOSTIC_CANVAS_SURFACE_TRUTH",
        "AUDRALIA_DIAGNOSTIC_SURFACE_TRUTH",
        "AUDRALIA.diagnosticCanvasSurfaceTruth",
        "AUDRALIA.diagnosticSurfaceTruth",
        "AUDRALIA.diagnostics.canvasSurfaceTruth",
        "AUDRALIA.diagnostics.surfaceTruth"
      ],
      role: "Observe the 3D host and presentation surface. Canvas filename is retained for navigation; Canvas2D is not governing."
    },
    {
      position: 5,
      fibonacci: "F13",
      news: "WEST",
      stationId: "WEST_PROBE_RUNTIME",
      file: "/assets/audralia/audralia.diagnostic.probe.west.js",
      globalNames: [
        "AUDRALIA_DIAGNOSTIC_PROBE_WEST",
        "AUDRALIA_DIAGNOSTIC_WEST_PROBE",
        "AUDRALIA_DIAGNOSTIC_PROBE_WEST_RUNTIME",
        "AUDRALIA_DIAGNOSTIC_WEST_RUNTIME_PROBE",
        "AUDRALIA.diagnosticProbeWest",
        "AUDRALIA.diagnostics.probeWest",
        "AUDRALIA.diagnostics.westProbe"
      ],
      role: "Observe live 3D runtime, scene, camera, geometry, material, shader, pipeline, render pass, submission, presentation, and interaction evidence."
    },
    {
      position: 6,
      fibonacci: "F21",
      news: "WEST",
      stationId: "WEST_RUNTIME_INTERPRETATION",
      file: "/assets/audralia/audralia.diagnostic.west.js",
      globalNames: [
        "AUDRALIA_DIAGNOSTIC_WEST",
        "AUDRALIA_DIAGNOSTIC_WEST_RUNTIME",
        "AUDRALIA_DIAGNOSTIC_WEST_INTERPRETATION",
        "AUDRALIA.diagnosticWest",
        "AUDRALIA.diagnostics.west",
        "AUDRALIA.diagnostics.westInterpretation"
      ],
      role: "Compare source-side construction claims with live runtime evidence."
    },
    {
      position: 7,
      fibonacci: "F34",
      news: "SOUTH",
      stationId: "SOUTH_PROBE_HANDOFF",
      file: "/assets/audralia/audralia.diagnostic.probe.south.js",
      globalNames: [
        "AUDRALIA_DIAGNOSTIC_PROBE_SOUTH",
        "AUDRALIA_DIAGNOSTIC_SOUTH_PROBE",
        "AUDRALIA_DIAGNOSTIC_PROBE_SOUTH_HANDOFF",
        "AUDRALIA_DIAGNOSTIC_SOUTH_HANDOFF_PROBE",
        "AUDRALIA.diagnosticProbeSouth",
        "AUDRALIA.diagnostics.probeSouth",
        "AUDRALIA.diagnostics.southProbe"
      ],
      role: "Inspect packet integrity, provenance continuity, output completeness, and downstream handoff readiness."
    },
    {
      position: 8,
      fibonacci: "F55",
      news: "SOUTH",
      stationId: "SOUTH_RESTITUTION_INTERPRETATION",
      file: "/assets/audralia/audralia.diagnostic.south.js",
      globalNames: [
        "AUDRALIA_DIAGNOSTIC_SOUTH",
        "AUDRALIA_DIAGNOSTIC_SOUTH_RESTITUTION",
        "AUDRALIA_DIAGNOSTIC_SOUTH_INTERPRETATION",
        "AUDRALIA.diagnosticSouth",
        "AUDRALIA.diagnostics.south",
        "AUDRALIA.diagnostics.southInterpretation"
      ],
      role: "Interpret construction continuation, restitution location, ownership, and return path."
    },
    {
      position: 9,
      fibonacci: "F89",
      news: "NORTH_RETURN",
      stationId: "RAIL_TERMINAL_SYNTHESIS",
      file: "/assets/audralia/audralia.diagnostic.rail.js",
      globalNames: [
        "AUDRALIA_DIAGNOSTIC_RAIL",
        "AUDRALIA_DIAGNOSTIC_RAIL_TERMINAL",
        "AUDRALIA_DIAGNOSTIC_RAIL_TERMINAL_SYNTHESIS",
        "AUDRALIA_DIAGNOSTIC_TERMINAL_RAIL",
        "AUDRALIA.diagnosticRail",
        "AUDRALIA.diagnostics.rail",
        "AUDRALIA.diagnostics.railTerminal"
      ],
      role: "Receive the full or interrupted ledger and produce terminal diagnostic synthesis."
    }
  ]);

  var AUXILIARY_DEFINITIONS = deepFreeze([
    {
      parentPosition: 8,
      role: "SOUTH_SURFACE_POINTER",
      file: "/assets/audralia/audralia.diagnostic.south.surface.pointer.js",
      globalNames: [
        "AUDRALIA_DIAGNOSTIC_SOUTH_SURFACE_POINTER",
        "AUDRALIA.diagnosticSouthSurfacePointer",
        "AUDRALIA.diagnostics.southSurfacePointer"
      ],
      createsCyclePosition: false
    }
  ]);

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return null;
    }
  }

  function isPlainObject(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    var proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
  }

  function isFunction(value) {
    return typeof value === "function";
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

  function clone(value) {
    return clonePlain(value, []);
  }

  function clonePlain(value, seen) {
    if (
      value === null ||
      typeof value === "string" ||
      typeof value === "boolean"
    ) {
      return value;
    }

    if (isFiniteNumber(value)) return value;
    if (typeof value === "number") return null;
    if (typeof value === "undefined") return null;
    if (typeof value === "bigint") return null;
    if (typeof value === "symbol") return null;
    if (isFunction(value)) return null;
    if (!value || typeof value !== "object") return null;
    if (!isPlainObject(value) && !Array.isArray(value)) return null;

    if (seen.indexOf(value) !== -1) return null;
    seen.push(value);

    if (Array.isArray(value)) {
      return value.slice(0, LIMITS.maxArrayLength).map(function mapItem(item) {
        return clonePlain(item, seen.slice());
      });
    }

    var output = {};
    var keys = [];

    try {
      keys = Object.keys(value).slice(0, LIMITS.maxObjectKeys);
    } catch (_error) {
      return null;
    }

    keys.forEach(function eachKey(key) {
      var safeKey = String(key).slice(0, LIMITS.maxStringLength);
      try {
        output[safeKey] = clonePlain(value[key], seen.slice());
      } catch (_error2) {
        output[safeKey] = null;
      }
    });

    return output;
  }

  function stableStringify(value) {
    return stableEncode(value);
  }

  function stableEncode(value) {
    if (value === null) return "null";
    if (typeof value === "string") return JSON.stringify(value);
    if (typeof value === "boolean") return value ? "true" : "false";
    if (isFiniteNumber(value)) return String(value);

    if (Array.isArray(value)) {
      return "[" + value.map(stableEncode).join(",") + "]";
    }

    if (isPlainObject(value)) {
      return "{" + Object.keys(value).sort().map(function encodeKey(key) {
        return JSON.stringify(key) + ":" + stableEncode(value[key]);
      }).join(",") + "}";
    }

    return "null";
  }

  function hash(value) {
    var text = stableStringify(clonePlain(value, []));
    var h = 0x811c9dc5;

    for (var i = 0; i < text.length; i += 1) {
      h ^= text.charCodeAt(i);
      h +=
        (h << 1) +
        (h << 4) +
        (h << 7) +
        (h << 8) +
        (h << 24);
      h >>>= 0;
    }

    return "fnv1a32:" + ("00000000" + h.toString(16)).slice(-8);
  }

  function plain(value) {
    return validatePlainData(value).passed;
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
      if (issues.length >= LIMITS.maxCycleIssues) return;

      if (depth > LIMITS.maxTraversalDepth) {
        issues.push(issue("PLAIN_DATA_DEPTH_EXCEEDED", path));
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

      if (typeof item === "undefined") {
        issues.push(issue("UNDEFINED_FORBIDDEN", path));
        return;
      }

      if (typeof item === "number") {
        issues.push(issue("NONFINITE_NUMBER_FORBIDDEN", path));
        return;
      }

      if (
        typeof item === "function" ||
        typeof item === "symbol" ||
        typeof item === "bigint"
      ) {
        issues.push(issue("NON_PLAIN_VALUE_FORBIDDEN", path));
        return;
      }

      if (!item || typeof item !== "object") {
        issues.push(issue("NON_PLAIN_VALUE_FORBIDDEN", path));
        return;
      }

      if (!isPlainObject(item) && !Array.isArray(item)) {
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

      var keys = Object.keys(item);
      if (keys.length > LIMITS.maxObjectKeys) {
        issues.push(issue("OBJECT_KEY_LIMIT_EXCEEDED", path));
        return;
      }

      keys.forEach(function eachObjectKey(key) {
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

  function normalizeString(value, fallback) {
    if (typeof value === "string") {
      return value.slice(0, LIMITS.maxStringLength);
    }
    return fallback === undefined ? null : fallback;
  }

  function normalizeMode(value) {
    if (value === MODES.CONSTRUCTION) return value;
    if (value === MODES.CALIBRATION) return value;
    if (value === MODES.RESTITUTION) return value;
    if (value === MODES.AUDIT) return value;
    if (value === "READ_REPORTABILITY_EVIDENCE_ADMISSION_DIAGNOSTIC") {
      return MODES.AUDIT;
    }
    return MODES.AUDIT;
  }

  function readPath(path) {
    var parts = String(path || "").split(".").filter(Boolean);
    var cursor = root;

    for (var i = 0; i < parts.length; i += 1) {
      if (
        cursor === null ||
        cursor === undefined ||
        cursor[parts[i]] === null ||
        cursor[parts[i]] === undefined
      ) {
        return null;
      }

      cursor = cursor[parts[i]];
    }

    return cursor;
  }

  function getPositionDefinition(position) {
    for (var i = 0; i < POSITIONS.length; i += 1) {
      if (POSITIONS[i].position === Number(position)) return POSITIONS[i];
    }
    return null;
  }

  function getPositionByStationId(stationId) {
    for (var i = 0; i < POSITIONS.length; i += 1) {
      if (POSITIONS[i].stationId === stationId) return POSITIONS[i];
    }
    return null;
  }

  function validateCycleRequest(raw) {
    var issues = [];
    var plainResult = validatePlainData(raw);

    if (!plainResult.passed) {
      issues = issues.concat(plainResult.issues);
    }

    var source = isPlainObject(raw) ? raw : {};
    var normalized = {
      schema: REQUEST_SCHEMA,
      cycleId: normalizeString(source.cycleId, null),
      mode: normalizeMode(source.mode),
      subject: isPlainObject(source.subject) ? clone(source.subject) : {},
      engine: isPlainObject(source.engine) ? clone(source.engine) : {},
      construct: isPlainObject(source.construct) ? clone(source.construct) : {},
      requestedStartPosition: Number(source.requestedStartPosition) || 1,
      generatedAtEnabled: source.generatedAtEnabled !== false,
      route: isPlainObject(source.route) ? clone(source.route) : {},
      engineFamily: isPlainObject(source.engineFamily) ? clone(source.engineFamily) : {},
      target: isPlainObject(source.target) ? clone(source.target) : {},
      evidencePolicy: isPlainObject(source.evidencePolicy)
        ? clone(source.evidencePolicy)
        : {},
      extensions: isPlainObject(source.extensions) ? clone(source.extensions) : {}
    };

    if (
      source.schema &&
      source.schema !== REQUEST_SCHEMA &&
      source.schema !== ROUTE_REQUEST_SCHEMA
    ) {
      issues.push(issue("REQUEST_SCHEMA_MISMATCH", "$.schema"));
    }

    if (!isPlainObject(source.subject)) {
      issues.push(issue("REQUEST_SUBJECT_REQUIRED", "$.subject"));
    }

    if (!isPlainObject(source.construct)) {
      issues.push(issue("REQUEST_CONSTRUCT_REQUIRED", "$.construct"));
    }

    if (
      normalized.requestedStartPosition < 1 ||
      normalized.requestedStartPosition > 9
    ) {
      issues.push(
        issue("REQUESTED_START_POSITION_OUT_OF_RANGE", "$.requestedStartPosition")
      );
      normalized.requestedStartPosition = 1;
    }

    return deepFreeze({
      passed: issues.length === 0,
      normalized: deepFreeze(normalized),
      issues: deepFreeze(issues)
    });
  }

  function validateStationDefinition(position, stationApi) {
    var issues = [];
    var def = getPositionDefinition(position);

    if (!def) {
      issues.push(issue("UNKNOWN_POSITION", "$.position"));
      return deepFreeze({ passed: false, issues: deepFreeze(issues) });
    }

    if (!stationApi || typeof stationApi !== "object") {
      issues.push(issue("STATION_API_REQUIRED", "$"));
      return deepFreeze({ passed: false, issues: deepFreeze(issues) });
    }

    if (stationApi.STATION_ID !== def.stationId) {
      issues.push(issue("STATION_ID_MISMATCH", "$.STATION_ID"));
    }

    if (Number(stationApi.CYCLE_POSITION) !== position) {
      issues.push(issue("STATION_POSITION_MISMATCH", "$.CYCLE_POSITION"));
    }

    if (stationApi.FILE !== def.file) {
      issues.push(issue("STATION_FILE_MISMATCH", "$.FILE"));
    }

    if (!normalizeString(stationApi.CONTRACT, "")) {
      issues.push(issue("STATION_CONTRACT_REQUIRED", "$.CONTRACT"));
    }

    if (!normalizeString(stationApi.VERSION, "")) {
      issues.push(issue("STATION_VERSION_REQUIRED", "$.VERSION"));
    }

    if (!isFunction(stationApi.getDefinitionReceipt)) {
      issues.push(
        issue("STATION_DEFINITION_RECEIPT_METHOD_REQUIRED", "$.getDefinitionReceipt")
      );
    }

    if (!isFunction(stationApi.executeCycleStation)) {
      issues.push(issue("STATION_EXECUTION_METHOD_REQUIRED", "$.executeCycleStation"));
    }

    return deepFreeze({
      passed: issues.length === 0,
      issues: deepFreeze(issues)
    });
  }

  function validateStationReceipt(receipt, expectedPosition, expectedStationId) {
    var issues = [];
    var plainResult = validatePlainData(receipt);

    if (!plainResult.passed) {
      issues = issues.concat(plainResult.issues);
    }

    if (!isPlainObject(receipt)) {
      issues.push(issue("STATION_RECEIPT_OBJECT_REQUIRED", "$"));
      return deepFreeze({ passed: false, issues: deepFreeze(issues) });
    }

    if (receipt.schema !== STATION_SCHEMA) {
      issues.push(issue("STATION_RECEIPT_SCHEMA_MISMATCH", "$.schema"));
    }

    if (Number(receipt.position) !== expectedPosition) {
      issues.push(issue("STATION_RECEIPT_POSITION_MISMATCH", "$.position"));
    }

    if (receipt.stationId !== expectedStationId) {
      issues.push(issue("STATION_RECEIPT_ID_MISMATCH", "$.stationId"));
    }

    if (!STATUSES[receipt.status]) {
      issues.push(issue("STATION_RECEIPT_STATUS_INVALID", "$.status"));
    }

    if (receipt.status === STATUSES.PASS && receipt.handoffEligible !== true) {
      issues.push(issue("PASS_REQUIRES_HANDOFF_ELIGIBLE", "$.handoffEligible"));
    }

    if (
      (
        receipt.status === STATUSES.HOLD ||
        receipt.status === STATUSES.FAIL ||
        receipt.status === STATUSES.CONFLICT ||
        receipt.status === STATUSES.ERROR
      ) &&
      receipt.handoffEligible === true
    ) {
      issues.push(issue("STOP_STATUS_CANNOT_HANDOFF", "$.handoffEligible"));
    }

    return deepFreeze({
      passed: issues.length === 0,
      issues: deepFreeze(issues)
    });
  }

  function normalizeStationReceipt(receipt, def, fallbackStatus, fallbackSummary) {
    var source = isPlainObject(receipt) ? clone(receipt) : {};
    var output = {
      schema: source.schema || STATION_SCHEMA,
      cycleId: source.cycleId || null,
      position: Number(source.position) || def.position,
      stationId: source.stationId || def.stationId,
      fibonacci: source.fibonacci || def.fibonacci,
      contract: source.contract || "UNKNOWN_STATION_CONTRACT",
      version: source.version || "UNKNOWN",
      file: source.file || def.file,
      status: source.status || fallbackStatus || STATUSES.HOLD,
      completed: source.completed === true,
      handoffEligible: source.handoffEligible === true,
      summary: normalizeString(
        source.summary,
        fallbackSummary || "No station summary was supplied."
      ),
      observations: Array.isArray(source.observations) ? clone(source.observations) : [],
      evidence: Array.isArray(source.evidence) ? clone(source.evidence) : [],
      issues: Array.isArray(source.issues) ? clone(source.issues) : [],
      firstHeldCoordinate: source.firstHeldCoordinate || null,
      firstFailedCoordinate: source.firstFailedCoordinate || null,
      firstConflictCoordinate: source.firstConflictCoordinate || null,
      recommendedOwner: isPlainObject(source.recommendedOwner)
        ? clone(source.recommendedOwner)
        : null,
      generatedAt: source.generatedAt || nowIso(),
      noClaims: isPlainObject(source.noClaims) ? clone(source.noClaims) : clone(NO_CLAIMS),
      receiptHash: source.receiptHash || null
    };

    if (!output.receiptHash) {
      output.receiptHash = hash(output);
    }

    return deepFreeze(output);
  }

  function makeSyntheticReceipt(sessionRef, def, status, summary, issues) {
    var r = {
      schema: STATION_SCHEMA,
      cycleId: sessionRef.cycleId,
      position: def.position,
      stationId: def.stationId,
      fibonacci: def.fibonacci || null,
      contract: CONTRACT,
      version: VERSION,
      file: def.file || FILE,
      status: status,
      completed: false,
      handoffEligible: false,
      summary: summary,
      observations: [],
      evidence: [],
      issues: issues || [],
      firstHeldCoordinate: status === STATUSES.HOLD ? def.stationId : null,
      firstFailedCoordinate: status === STATUSES.FAIL ? def.stationId : null,
      firstConflictCoordinate:
        status === STATUSES.CONFLICT ? def.stationId : null,
      recommendedOwner: {
        ownerType: "DIAGNOSTIC_STATION",
        subjectId: def.stationId,
        contract: null,
        file: def.file || null,
        component: def.stationId
      },
      generatedAt: nowIso(),
      noClaims: clone(NO_CLAIMS),
      receiptHash: null
    };

    r.receiptHash = hash(r);
    return deepFreeze(r);
  }

  function composeStationRequest(session, position, terminal) {
    var def = getPositionDefinition(position);

    return deepFreeze({
      schema: "AUDRALIA_DIAGNOSTIC_STATION_EXECUTION_REQUEST_v1",
      cycleId: session.cycleId,
      mode: session.request.mode,
      position: position,
      stationId: def ? def.stationId : "UNKNOWN",
      subject: clone(session.request.subject),
      engine: clone(session.request.engine),
      construct: clone(session.request.construct),
      route: clone(session.request.route),
      engineFamily: clone(session.request.engineFamily),
      target: clone(session.request.target),
      evidencePolicy: clone(session.request.evidencePolicy),
      priorLedgerHash: hash(session.ledger),
      priorStationReceipts: clone(session.ledger.stationReceipts),
      parentHandoff: session.ledger.handoffs.length
        ? clone(session.ledger.handoffs[session.ledger.handoffs.length - 1])
        : null,
      auxiliaryEvidence: clone(session.ledger.auxiliaryReceipts),
      terminalSynthesisMode: Boolean(terminal),
      limits: clone(LIMITS),
      noClaims: clone(NO_CLAIMS)
    });
  }

  function composeHandoff(session, fromDef, toDef, sourceReceipt) {
    return deepFreeze({
      schema: HANDOFF_SCHEMA,
      cycleId: session.cycleId,
      fromPosition: fromDef.position,
      fromStationId: fromDef.stationId,
      toPosition: toDef.position,
      toStationId: toDef.stationId,
      sourceReceiptHash: sourceReceipt.receiptHash || hash(sourceReceipt),
      ledgerHash: hash(session.ledger),
      authorizedByConductor: true,
      status: "AUTHORIZED",
      reasonCode: "PREDECESSOR_PASS",
      generatedAt: nowIso()
    });
  }

  function deniedHandoff(session, fromDef, toDef, reasonCode) {
    return deepFreeze({
      schema: HANDOFF_SCHEMA,
      cycleId: session.cycleId,
      fromPosition: fromDef ? fromDef.position : null,
      fromStationId: fromDef ? fromDef.stationId : null,
      toPosition: toDef ? toDef.position : null,
      toStationId: toDef ? toDef.stationId : null,
      sourceReceiptHash: null,
      ledgerHash: hash(session.ledger),
      authorizedByConductor: false,
      status: "DENIED",
      reasonCode: reasonCode || "HANDOFF_DENIED",
      generatedAt: nowIso()
    });
  }

  function composeRestitutionCoordinate(session, receipt) {
    if (!receipt) return null;

    var condition =
      receipt.status === STATUSES.HOLD
        ? "HOLD"
        : receipt.status === STATUSES.FAIL
          ? "FAIL"
          : receipt.status === STATUSES.CONFLICT
            ? "CONFLICT"
            : receipt.status === STATUSES.ERROR
              ? "ERROR"
              : null;

    if (!condition) return null;

    var owner = isPlainObject(receipt.recommendedOwner)
      ? receipt.recommendedOwner
      : {};

    return deepFreeze({
      schema: RESTITUTION_SCHEMA,
      cycleId: session.cycleId,
      position: Number(receipt.position) || null,
      stationId: normalizeString(receipt.stationId, null),
      condition: condition,
      ownerType: normalizeString(owner.ownerType, "UNKNOWN"),
      ownerContract: normalizeString(owner.contract, null),
      ownerFile: normalizeString(owner.file, null),
      ownerComponent: normalizeString(owner.component, null),
      evidenceRequired: [],
      issueIds: Array.isArray(receipt.issues)
        ? receipt.issues.map(function mapIssue(entry) {
            return entry && entry.code ? entry.code : "ISSUE";
          })
        : [],
      recommendedAction:
        condition === "CONFLICT"
          ? "RECONCILE_CONFLICT"
          : condition === "ERROR"
            ? "INSPECT_CONDUCTOR_OR_STATION"
            : "RESTORE_EVIDENCE",
      authorized: false
    });
  }

  function statusFromReceiptStatus(status) {
    if (status === STATUSES.PASS || status === STATUSES.NOT_APPLICABLE) {
      return null;
    }
    if (status === STATUSES.HOLD) return CYCLE_STATUSES.HELD;
    if (status === STATUSES.FAIL) return CYCLE_STATUSES.FAILED;
    if (status === STATUSES.CONFLICT) return CYCLE_STATUSES.CONFLICTING;
    return CYCLE_STATUSES.ERROR;
  }

  function markFirst(sessionRef, receipt) {
    if (receipt.status === STATUSES.HOLD && sessionRef.ledger.firstHeldPosition === null) {
      sessionRef.ledger.firstHeldPosition = receipt.position;
    }
    if (receipt.status === STATUSES.FAIL && sessionRef.ledger.firstFailedPosition === null) {
      sessionRef.ledger.firstFailedPosition = receipt.position;
    }
    if (
      receipt.status === STATUSES.CONFLICT &&
      sessionRef.ledger.firstConflictPosition === null
    ) {
      sessionRef.ledger.firstConflictPosition = receipt.position;
    }
    if (receipt.status === STATUSES.ERROR && sessionRef.ledger.firstErrorPosition === null) {
      sessionRef.ledger.firstErrorPosition = receipt.position;
    }
  }

  function createCycle(rawRequest) {
    var validation = validateCycleRequest(rawRequest || {});
    var normalized = clone(validation.normalized);
    var cycleId =
      normalized.cycleId ||
      "audralia-nine-cycle-" + hash(normalized).replace("fnv1a32:", "");

    normalized.cycleId = cycleId;

    var session = {
      cycleId: cycleId,
      request: deepFreeze(normalized),
      state: validation.passed ? CYCLE_STATUSES.OPEN : CYCLE_STATUSES.ERROR,
      sealed: false,
      disposed: false,
      runOnce: false,
      registry: {},
      auxiliaries: {},
      registrationLog: [],
      startedAt: null,
      completedAt: null,
      ledger: {
        request: clone(normalized),
        requestValidation: clone(validation),
        stationDefinitions: clone(POSITIONS),
        registrationOutcomes: [],
        auxiliaryRegistrations: [],
        stationReceipts: [],
        handoffs: [],
        deniedHandoffs: [],
        auxiliaryReceipts: [],
        skippedPositions: [],
        issues: validation.issues ? clone(validation.issues) : [],
        terminalRailReceipt: null,
        restitutionCoordinate: null,
        firstHeldPosition: null,
        firstFailedPosition: null,
        firstConflictPosition: null,
        firstErrorPosition: null
      }
    };

    function registerStation(position, stationApi) {
      if (session.disposed || session.sealed || session.runOnce) {
        return freezeRegistration(position, "REJECTED", "SESSION_NOT_OPEN");
      }

      var def = getPositionDefinition(position);
      var validationResult = validateStationDefinition(position, stationApi);

      if (!validationResult.passed) {
        return freezeRegistration(
          position,
          "REJECTED",
          "STATION_INVALID",
          validationResult.issues,
          def
        );
      }

      if (session.registry[position]) {
        if (session.registry[position] === stationApi) {
          return freezeRegistration(
            position,
            "DUPLICATE_IDENTICAL",
            "STATION_ALREADY_REGISTERED",
            [],
            def
          );
        }

        return freezeRegistration(
          position,
          "CONFLICT",
          "STATION_POSITION_OCCUPIED",
          [],
          def
        );
      }

      session.registry[position] = stationApi;

      return freezeRegistration(position, "REGISTERED", "STATION_REGISTERED", [], def);
    }

    function freezeRegistration(position, status, reason, issues, def) {
      var safeDef = def || getPositionDefinition(position);
      var outcome = deepFreeze({
        position: Number(position) || null,
        stationId: safeDef ? safeDef.stationId : null,
        status: status,
        reason: reason,
        issues: deepFreeze(issues || []),
        generatedAt: nowIso()
      });

      session.registrationLog.push(outcome);
      session.ledger.registrationOutcomes.push(outcome);

      return outcome;
    }

    function registerAuxiliary(parentPosition, descriptor) {
      if (session.disposed || session.sealed || session.runOnce) {
        return deepFreeze({
          parentPosition: parentPosition,
          status: "REJECTED",
          reason: "SESSION_NOT_OPEN"
        });
      }

      if (!getPositionDefinition(parentPosition)) {
        return deepFreeze({
          parentPosition: parentPosition,
          status: "REJECTED",
          reason: "PARENT_POSITION_UNKNOWN"
        });
      }

      var list = session.auxiliaries[parentPosition] || [];
      if (list.length >= LIMITS.maxAuxiliariesPerStation) {
        return deepFreeze({
          parentPosition: parentPosition,
          status: "REJECTED",
          reason: "AUXILIARY_LIMIT_REACHED"
        });
      }

      var safeDescriptor = clone(descriptor || {});
      var record = deepFreeze({
        parentPosition: parentPosition,
        descriptor: safeDescriptor,
        status: "REGISTERED",
        createsCyclePosition: false,
        generatedAt: nowIso()
      });

      list.push(record);
      session.auxiliaries[parentPosition] = list;
      session.ledger.auxiliaryRegistrations.push(record);

      return record;
    }

    function seal() {
      if (session.disposed) return getReceipt();
      if (session.sealed) return getReceipt();

      session.sealed = true;
      session.state =
        session.state === CYCLE_STATUSES.ERROR
          ? CYCLE_STATUSES.ERROR
          : CYCLE_STATUSES.SEALED;

      return getReceipt();
    }

    function executeStation(position, terminalMode) {
      var def = getPositionDefinition(position);
      var api = session.registry[position];

      if (!def || !api) {
        var missing = makeSyntheticReceipt(
          session,
          def || {
            position: position,
            stationId: "UNKNOWN",
            fibonacci: null,
            file: null
          },
          STATUSES.HOLD,
          "Station is not registered with the North conductor.",
          [
            issue(
              "STATION_NOT_REGISTERED",
              def ? def.stationId : "UNKNOWN",
              "No compatible station API was discovered or registered for this cycle position."
            )
          ]
        );

        session.ledger.stationReceipts.push(missing);
        markFirst(session, missing);
        return missing;
      }

      try {
        var request = composeStationRequest(session, position, terminalMode);
        var receipt = api.executeCycleStation(request);
        var validationResult =
          validateStationReceipt(receipt, position, def.stationId);

        if (!validationResult.passed) {
          receipt = makeSyntheticReceipt(
            session,
            def,
            STATUSES.ERROR,
            "Station returned an invalid receipt.",
            validationResult.issues
          );
        } else {
          receipt = normalizeStationReceipt(
            receipt,
            def,
            STATUSES.HOLD,
            "Station receipt normalized by North conductor."
          );

          if (!receipt.cycleId) {
            receipt = normalizeStationReceipt(
              Object.assign({}, clone(receipt), { cycleId: session.cycleId }),
              def,
              receipt.status,
              receipt.summary
            );
          }
        }

        session.ledger.stationReceipts.push(receipt);
        markFirst(session, receipt);
        return receipt;
      } catch (error) {
        var synthetic = makeSyntheticReceipt(
          session,
          def,
          STATUSES.ERROR,
          "Station threw during diagnostic execution.",
          [
            issue(
              "STATION_EXECUTION_THROW",
              def.stationId,
              error && error.message ? error.message : error
            )
          ]
        );

        session.ledger.stationReceipts.push(synthetic);
        markFirst(session, synthetic);
        return synthetic;
      }
    }

    function run() {
      if (session.disposed) return getReceipt();
      if (session.runOnce) return getReceipt();
      if (!session.sealed) seal();

      session.runOnce = true;
      session.startedAt = nowIso();
      session.state = CYCLE_STATUSES.RUNNING;

      var stopped = false;

      for (
        var position = session.request.requestedStartPosition;
        position <= 8;
        position += 1
      ) {
        if (stopped) {
          session.ledger.skippedPositions.push(getPositionDefinition(position));
          continue;
        }

        var receipt = executeStation(position, false);
        var def = getPositionDefinition(position);
        var nextDef = getPositionDefinition(position + 1);

        if (
          receipt.status === STATUSES.PASS ||
          receipt.status === STATUSES.NOT_APPLICABLE
        ) {
          if (nextDef) {
            session.ledger.handoffs.push(
              composeHandoff(session, def, nextDef, receipt)
            );
          }
        } else {
          stopped = true;
          session.state = statusFromReceiptStatus(receipt.status);
          session.ledger.restitutionCoordinate =
            composeRestitutionCoordinate(session, receipt);

          if (nextDef) {
            session.ledger.deniedHandoffs.push(
              deniedHandoff(session, def, nextDef, receipt.status)
            );
          }
        }
      }

      var railReceipt = executeStation(9, stopped);
      session.ledger.terminalRailReceipt = clone(railReceipt);

      if (!stopped) {
        if (railReceipt.status === STATUSES.PASS) {
          session.state = CYCLE_STATUSES.COMPLETE;
        } else {
          session.state = statusFromReceiptStatus(railReceipt.status);
          session.ledger.restitutionCoordinate =
            composeRestitutionCoordinate(session, railReceipt);
        }
      }

      session.completedAt = nowIso();
      return getReceipt();
    }

    function getLedger() {
      var ledger = clone(session.ledger);
      ledger.ledgerHash = hash(ledger);
      return deepFreeze(ledger);
    }

    function getSummary() {
      var receipt = getReceipt();

      return deepFreeze({
        cycleId: receipt.cycleId,
        mode: receipt.mode,
        status: receipt.status,
        executedStationCount: receipt.executedStationCount,
        firstHeldPosition: receipt.firstHeldPosition,
        firstFailedPosition: receipt.firstFailedPosition,
        firstConflictPosition: receipt.firstConflictPosition,
        firstErrorPosition: receipt.firstErrorPosition,
        terminalRailInvoked: receipt.terminalRailInvoked,
        restitutionCoordinate: clone(receipt.restitutionCoordinate),
        noClaims: clone(NO_CLAIMS)
      });
    }

    function getReceipt() {
      var stationReceipts = session.ledger.stationReceipts || [];
      var packet = {
        schema: CYCLE_SCHEMA,
        contract: CONTRACT,
        previousContract: PREVIOUS_CONTRACT,
        version: VERSION,
        file: FILE,
        cycleId: session.cycleId,
        mode: session.request.mode,
        status: session.state,
        startedAt: session.startedAt,
        completedAt: session.completedAt,
        requestedStartPosition: session.request.requestedStartPosition,
        actualStartPosition: session.request.requestedStartPosition,
        stationCount: 9,
        registeredStationCount: Object.keys(session.registry).length,
        executedStationCount: stationReceipts.length,
        passedStationCount: stationReceipts.filter(function count(r) {
          return r.status === STATUSES.PASS;
        }).length,
        heldStationCount: stationReceipts.filter(function count(r) {
          return r.status === STATUSES.HOLD;
        }).length,
        failedStationCount: stationReceipts.filter(function count(r) {
          return r.status === STATUSES.FAIL;
        }).length,
        conflictStationCount: stationReceipts.filter(function count(r) {
          return r.status === STATUSES.CONFLICT;
        }).length,
        errorStationCount: stationReceipts.filter(function count(r) {
          return r.status === STATUSES.ERROR;
        }).length,
        skippedStationCount: session.ledger.skippedPositions.length,
        stationReceipts: clone(stationReceipts),
        receipts: clone(stationReceipts),
        handoffs: clone(session.ledger.handoffs),
        deniedHandoffs: clone(session.ledger.deniedHandoffs),
        auxiliaryReceipts: clone(session.ledger.auxiliaryReceipts),
        registrationOutcomes: clone(session.ledger.registrationOutcomes),
        auxiliaryRegistrations: clone(session.ledger.auxiliaryRegistrations),
        firstHeldPosition: session.ledger.firstHeldPosition,
        firstFailedPosition: session.ledger.firstFailedPosition,
        firstConflictPosition: session.ledger.firstConflictPosition,
        firstErrorPosition: session.ledger.firstErrorPosition,
        terminalRailInvoked: stationReceipts.some(function find(r) {
          return r.position === 9;
        }),
        terminalRailReceipt: clone(session.ledger.terminalRailReceipt),
        restitutionCoordinate: clone(session.ledger.restitutionCoordinate),
        inputHash: hash(session.request),
        ledgerHash: hash(session.ledger),
        cycleHash: null,
        noClaims: clone(NO_CLAIMS)
      };

      packet.cycleHash = hash({
        schema: packet.schema,
        contract: packet.contract,
        version: packet.version,
        file: packet.file,
        cycleId: packet.cycleId,
        mode: packet.mode,
        status: packet.status,
        stationCount: packet.stationCount,
        stationReceipts: packet.stationReceipts,
        handoffs: packet.handoffs,
        deniedHandoffs: packet.deniedHandoffs,
        restitutionCoordinate: packet.restitutionCoordinate
      });

      return deepFreeze(packet);
    }

    function getState() {
      return deepFreeze({
        cycleId: session.cycleId,
        state: session.state,
        sealed: session.sealed,
        disposed: session.disposed,
        runOnce: session.runOnce,
        registeredStationCount: Object.keys(session.registry).length,
        startedAt: session.startedAt,
        completedAt: session.completedAt
      });
    }

    function dispose() {
      session.registry = {};
      session.auxiliaries = {};
      session.disposed = true;
      session.state = CYCLE_STATUSES.DISPOSED;
      return getState();
    }

    return deepFreeze({
      registerStation: registerStation,
      registerAuxiliary: registerAuxiliary,
      seal: seal,
      run: run,
      getReceipt: getReceipt,
      getSummary: getSummary,
      getLedger: getLedger,
      getState: getState,
      dispose: dispose
    });
  }

  function resolveStationCandidate(def) {
    if (!def || !Array.isArray(def.globalNames)) return null;

    for (var i = 0; i < def.globalNames.length; i += 1) {
      var candidate = readPath(def.globalNames[i]);
      if (
        candidate &&
        typeof candidate === "object" &&
        isFunction(candidate.executeCycleStation)
      ) {
        return {
          api: candidate,
          globalName: def.globalNames[i],
          discovered: true
        };
      }
    }

    return null;
  }

  function discoverStations() {
    return deepFreeze(
      POSITIONS.map(function mapPosition(def) {
        var found = resolveStationCandidate(def);

        return {
          position: def.position,
          stationId: def.stationId,
          file: def.file,
          discovered: Boolean(found),
          globalName: found ? found.globalName : null,
          api: found ? found.api : null
        };
      })
    );
  }

  function discoverAuxiliaries() {
    return deepFreeze(
      AUXILIARY_DEFINITIONS.map(function mapAux(def) {
        var found = null;

        if (Array.isArray(def.globalNames)) {
          for (var i = 0; i < def.globalNames.length; i += 1) {
            var candidate = readPath(def.globalNames[i]);
            if (candidate && typeof candidate === "object") {
              found = {
                api: candidate,
                globalName: def.globalNames[i]
              };
              break;
            }
          }
        }

        return {
          parentPosition: def.parentPosition,
          role: def.role,
          file: def.file,
          createsCyclePosition: false,
          discovered: Boolean(found),
          globalName: found ? found.globalName : null,
          api: found ? found.api : null
        };
      })
    );
  }

  function runRegisteredCycle(rawRequest, options) {
    var settings = isPlainObject(options) ? options : {};
    var cycle = createCycle(rawRequest || {});
    var stationDiscovery = discoverStations();
    var auxiliaryDiscovery = discoverAuxiliaries();

    stationDiscovery.forEach(function eachStation(record) {
      if (record.discovered && record.api) {
        cycle.registerStation(record.position, record.api);
      }
    });

    auxiliaryDiscovery.forEach(function eachAux(record) {
      if (record.discovered && record.api) {
        cycle.registerAuxiliary(record.parentPosition, {
          role: record.role,
          file: record.file,
          globalName: record.globalName,
          apiContract: record.api.CONTRACT || null,
          apiVersion: record.api.VERSION || null
        });
      }
    });

    if (Array.isArray(settings.extraStations)) {
      settings.extraStations.forEach(function eachExtra(entry) {
        if (entry && entry.position && entry.api) {
          cycle.registerStation(Number(entry.position), entry.api);
        }
      });
    }

    if (Array.isArray(settings.extraAuxiliaries)) {
      settings.extraAuxiliaries.forEach(function eachExtraAux(entry) {
        if (entry && entry.parentPosition) {
          cycle.registerAuxiliary(Number(entry.parentPosition), entry.descriptor || entry);
        }
      });
    }

    cycle.seal();
    var packet = cycle.run();
    var ledger = cycle.getLedger();
    var summary = cycle.getSummary();

    return deepFreeze({
      schema: "AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_ROUTE_RESULT_v2",
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      cycleId: packet.cycleId,
      status: packet.status,
      packet: clone(packet),
      ledger: clone(ledger),
      summary: clone(summary),
      stationDiscovery: clone(
        stationDiscovery.map(function stripApi(entry) {
          return {
            position: entry.position,
            stationId: entry.stationId,
            file: entry.file,
            discovered: entry.discovered,
            globalName: entry.globalName
          };
        })
      ),
      auxiliaryDiscovery: clone(
        auxiliaryDiscovery.map(function stripAuxApi(entry) {
          return {
            parentPosition: entry.parentPosition,
            role: entry.role,
            file: entry.file,
            discovered: entry.discovered,
            globalName: entry.globalName,
            createsCyclePosition: false
          };
        })
      ),
      receipts: clone(packet.stationReceipts || []),
      stationReceipts: clone(packet.stationReceipts || []),
      terminalRailReceipt: clone(packet.terminalRailReceipt),
      restitutionCoordinate: clone(packet.restitutionCoordinate),
      noClaims: clone(NO_CLAIMS),
      generatedAt: nowIso(),
      resultHash: hash(packet)
    });
  }

  function executeCycle(request) {
    return runRegisteredCycle(request || {});
  }

  function executeDiagnosticCycle(request) {
    return runRegisteredCycle(request || {});
  }

  function executeNineCycle(request) {
    return runRegisteredCycle(request || {});
  }

  function runNineCycle(request) {
    return runRegisteredCycle(request || {});
  }

  function conduct(request) {
    return runRegisteredCycle(request || {});
  }

  function run(request) {
    return runRegisteredCycle(request || {});
  }

  function validateCyclePacket(packet) {
    var issues = [];
    var plainResult = validatePlainData(packet);

    if (!plainResult.passed) issues = issues.concat(plainResult.issues);

    if (!isPlainObject(packet)) {
      issues.push(issue("CYCLE_PACKET_OBJECT_REQUIRED", "$"));
    } else {
      if (packet.schema !== CYCLE_SCHEMA) {
        issues.push(issue("CYCLE_SCHEMA_MISMATCH", "$.schema"));
      }
      if (packet.contract !== CONTRACT && packet.contract !== PREVIOUS_CONTRACT) {
        issues.push(issue("CYCLE_CONTRACT_MISMATCH", "$.contract"));
      }
      if (packet.stationCount !== 9) {
        issues.push(issue("CYCLE_STATION_COUNT_MISMATCH", "$.stationCount"));
      }
    }

    return deepFreeze({
      passed: issues.length === 0,
      issues: deepFreeze(issues)
    });
  }

  function getContractDefinition() {
    return deepFreeze({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      versionLabel: VERSION_LABEL,
      file: FILE,
      definitionReceipt: DEFINITION_RECEIPT,
      installationReceipt: INSTALLATION_RECEIPT,
      cycleSchema: CYCLE_SCHEMA,
      requestSchema: REQUEST_SCHEMA,
      routeRequestSchema: ROUTE_REQUEST_SCHEMA,
      stationSchema: STATION_SCHEMA,
      handoffSchema: HANDOFF_SCHEMA,
      restitutionSchema: RESTITUTION_SCHEMA,
      hashLabel: HASH_LABEL,
      newsSequence: ["NORTH", "EAST", "SURFACE", "WEST", "SOUTH", "NORTH_RETURN"],
      railTerminalSynthesisIsNorthReturn: true,
      fibonacciMapIsDiagnosticSequenceOnly: true,
      fibonacciMapIsNotEngineReadiness: true,
      fibonacciMapIsNotContractAuthority: true,
      fibonacciMapDoesNotCreateNewFScale: true,
      routeCompatibleExecutionMethods: [
        "executeNineCycle",
        "runNineCycle",
        "executeDiagnosticCycle",
        "executeCycle",
        "conduct",
        "run"
      ],
      positions: POSITIONS,
      auxiliaryDefinitions: AUXILIARY_DEFINITIONS,
      limits: LIMITS,
      capabilities: CAPABILITIES,
      noClaims: NO_CLAIMS
    });
  }

  function getDefinitionValidation() {
    var issues = [];

    if (POSITIONS.length !== 9) {
      issues.push(issue("POSITION_COUNT_NOT_NINE", "$.POSITIONS"));
    }

    var seenPositions = {};
    var seenStations = {};

    POSITIONS.forEach(function eachPosition(position) {
      if (seenPositions[position.position]) {
        issues.push(issue("DUPLICATE_POSITION", "$.POSITIONS"));
      }

      if (seenStations[position.stationId]) {
        issues.push(issue("DUPLICATE_STATION", "$.POSITIONS"));
      }

      if (!Array.isArray(position.globalNames) || !position.globalNames.length) {
        issues.push(issue("POSITION_GLOBAL_DISCOVERY_NAMES_MISSING", position.stationId));
      }

      seenPositions[position.position] = true;
      seenStations[position.stationId] = true;
    });

    if (POSITIONS[8].news !== "NORTH_RETURN") {
      issues.push(issue("POSITION_9_NOT_NORTH_RETURN", "$.POSITIONS[8]"));
    }

    return deepFreeze({
      schema: "AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_DEFINITION_VALIDATION_v2",
      passed: issues.length === 0,
      issueCount: issues.length,
      issues: deepFreeze(issues),
      checkCount: 8,
      generatedAt: nowIso()
    });
  }

  function getDefinitionReceipt() {
    var validation = getDefinitionValidation();

    return deepFreeze({
      receipt: DEFINITION_RECEIPT,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      validationPassed: validation.passed,
      stationCount: POSITIONS.length,
      nineCycleAuthority: true,
      diagnosticSequenceAuthority: true,
      routeCompatibleExecutionAuthority: true,
      stationDiscoveryAuthority: true,
      engineAuthority: false,
      productionMutationAuthority: false,
      railTerminalSynthesisIsNorthReturn: true,
      generatedAt: nowIso(),
      validation: validation,
      definitionHash: hash(getContractDefinition()),
      noClaims: NO_CLAIMS
    });
  }

  var INSTALLATION = {
    decision: "LOCAL_ONLY_NO_ROOT",
    reason: "ROOT_UNAVAILABLE",
    published: [],
    warnings: [],
    errors: [],
    rollbackComplete: true,
    installedAt: nowIso()
  };

  function getInstallationReceipt() {
    return deepFreeze({
      receipt: INSTALLATION_RECEIPT,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      decision: INSTALLATION.decision,
      reason: INSTALLATION.reason,
      published: clone(INSTALLATION.published),
      warnings: clone(INSTALLATION.warnings),
      errors: clone(INSTALLATION.errors),
      rollbackComplete: INSTALLATION.rollbackComplete,
      installedAt: INSTALLATION.installedAt,
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

  function buildApi() {
    return deepFreeze({
      CONTRACT: CONTRACT,
      PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
      VERSION: VERSION,
      VERSION_LABEL: VERSION_LABEL,
      FILE: FILE,
      CYCLE_SCHEMA: CYCLE_SCHEMA,
      REQUEST_SCHEMA: REQUEST_SCHEMA,
      ROUTE_REQUEST_SCHEMA: ROUTE_REQUEST_SCHEMA,
      STATION_SCHEMA: STATION_SCHEMA,
      HANDOFF_SCHEMA: HANDOFF_SCHEMA,
      RESTITUTION_SCHEMA: RESTITUTION_SCHEMA,
      POSITIONS: POSITIONS,
      ENUMS: {
        STATUSES: STATUSES,
        CYCLE_STATUSES: CYCLE_STATUSES,
        MODES: MODES,
        REGISTRATION_STATUSES: REGISTRATION_STATUSES
      },
      LIMITS: LIMITS,
      CAPABILITIES: CAPABILITIES,
      NO_CLAIMS: NO_CLAIMS,

      clone: clone,
      plain: plain,
      deepFreeze: deepFreeze,
      stableStringify: stableStringify,
      hash: hash,

      validateCycleRequest: validateCycleRequest,
      validateStationDefinition: validateStationDefinition,
      validateStationReceipt: validateStationReceipt,
      validateCyclePacket: validateCyclePacket,

      discoverStations: discoverStations,
      discoverAuxiliaries: discoverAuxiliaries,
      createCycle: createCycle,

      executeCycle: executeCycle,
      executeDiagnosticCycle: executeDiagnosticCycle,
      executeNineCycle: executeNineCycle,
      runNineCycle: runNineCycle,
      conduct: conduct,
      run: run,

      getContractDefinition: getContractDefinition,
      getDefinitionValidation: getDefinitionValidation,
      getDefinitionReceipt: getDefinitionReceipt,
      getInstallationReceipt: getInstallationReceipt
    });
  }

  function rollback() {
    var names = INSTALLATION.published.slice().reverse();

    names.forEach(function remove(name) {
      try {
        if (name === "AUDRALIA.diagnosticNorthConductor") {
          if (root.AUDRALIA) delete root.AUDRALIA.diagnosticNorthConductor;
        } else if (name === "AUDRALIA.diagnostics.northConductor") {
          if (root.AUDRALIA && root.AUDRALIA.diagnostics) {
            delete root.AUDRALIA.diagnostics.northConductor;
          }
        } else {
          delete root[name];
        }
      } catch (_error) {}
    });

    INSTALLATION.rollbackComplete = true;
  }

  function publish() {
    if (!root || typeof root !== "object") return;

    var existing = root.AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR;

    if (
      existing &&
      existing.CONTRACT &&
      existing.CONTRACT !== CONTRACT &&
      existing.CONTRACT !== PREVIOUS_CONTRACT
    ) {
      INSTALLATION.decision = "CONFLICT";
      INSTALLATION.reason = "PRIMARY_GLOBAL_OCCUPIED_BY_INCOMPATIBLE_AUTHORITY";
      INSTALLATION.errors.push("PRIMARY_GLOBAL_CONFLICT");
      return;
    }

    var api = buildApi();

    try {
      root.AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR = api;
      INSTALLATION.published.push("AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR");

      var namespace = ensureNamespace("AUDRALIA");
      if (namespace) {
        namespace.diagnosticNorthConductor = api;
        INSTALLATION.published.push("AUDRALIA.diagnosticNorthConductor");

        if (!namespace.diagnostics || typeof namespace.diagnostics !== "object") {
          namespace.diagnostics = {};
        }

        namespace.diagnostics.northConductor = api;
        INSTALLATION.published.push("AUDRALIA.diagnostics.northConductor");
      }

      root.AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_RECEIPT =
        getDefinitionReceipt();
      INSTALLATION.published.push("AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_RECEIPT");

      root.__AUDRALIA_DIAGNOSTIC_NINE_CYCLE_VERSION__ = VERSION;
      INSTALLATION.published.push("__AUDRALIA_DIAGNOSTIC_NINE_CYCLE_VERSION__");

      root.__AUDRALIA_DIAGNOSTIC_NINE_CYCLE_SCHEMA__ = CYCLE_SCHEMA;
      INSTALLATION.published.push("__AUDRALIA_DIAGNOSTIC_NINE_CYCLE_SCHEMA__");

      root.__AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_LOADED__ = true;
      INSTALLATION.published.push("__AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_LOADED__");

      INSTALLATION.decision = existing
        ? "COMPATIBLE_REPLACEMENT_OR_UPGRADE"
        : "NEW_INSTALLATION";
      INSTALLATION.reason = "PUBLISHED";
      INSTALLATION.rollbackComplete = true;
    } catch (error) {
      INSTALLATION.decision = "CONFLICT";
      INSTALLATION.reason = "PUBLICATION_FAILED";
      INSTALLATION.errors.push(error && error.message ? error.message : String(error));
      rollback();
    }
  }

  publish();

  if (typeof module !== "undefined" && module.exports) {
    module.exports =
      root && root.AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR
        ? root.AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR
        : buildApi();
  }
})(
  typeof window !== "undefined"
    ? window
    : typeof globalThis !== "undefined"
      ? globalThis
      : this
);

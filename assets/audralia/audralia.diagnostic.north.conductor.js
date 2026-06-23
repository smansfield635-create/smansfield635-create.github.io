// /assets/audralia/audralia.diagnostic.north.conductor.js
// AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_ROUTE_TOLERANT_TERMINAL_LEDGER_TRANSPORT_3D_TNT_v3_3
// Full-file replacement.
// Quiet-load, dependency-free, 3D-native diagnostic conductor.
//
// Previous contract:
// - AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_NINE_CYCLE_TERMINAL_LEDGER_TRANSPORT_3D_TNT_v3_2_1
//
// Corrective purpose:
// - Preserve the accepted conductor-to-F89 terminal-ledger architecture.
// - Preserve external normalized-hash verification.
// - Preserve lossless station receipt transport.
// - Add route-tolerant request normalization for control-panel initiated cycles.
// - Prevent generic control-panel requests from becoming structurally fatal
//   merely because they omit subject/construct envelopes.
// - Keep F89 as the terminal synthesis owner.
// - Keep the North conductor outside the nine Fibonacci station sequence.

(function audraliaDiagnosticNorthConductorRouteTolerantTerminalLedgerTransport3D(global) {
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
    "AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_ROUTE_TOLERANT_TERMINAL_LEDGER_TRANSPORT_3D_TNT_v3_3";

  var PREVIOUS_CONTRACT =
    "AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_NINE_CYCLE_TERMINAL_LEDGER_TRANSPORT_3D_TNT_v3_2_1";

  var PRIOR_CONTRACT =
    "AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_NINE_CYCLE_TERMINAL_LEDGER_TRANSPORT_3D_TNT_v3_2";

  var LEGACY_CONTRACT =
    "AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_NINE_CYCLE_AUTHORITY_3D_TNT_v1";

  var VERSION =
    "3.3.0";

  var VERSION_LABEL =
    "2026-06-22.audralia-diagnostic-north-conductor-route-tolerant-terminal-ledger-transport-3d-v3-3";

  var FILE =
    "/assets/audralia/audralia.diagnostic.north.conductor.js";

  var CYCLE_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_PACKET_v1";

  var REQUEST_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_REQUEST_v1";

  var ROUTE_REQUEST_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_CONDUCTOR_REQUEST_v2";

  var CANONICAL_REQUEST_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_CANONICAL_NINE_CYCLE_REQUEST_v1";

  var STATION_REQUEST_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_STATION_EXECUTION_REQUEST_v1";

  var STATION_RECEIPT_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_STATION_RECEIPT_v1";

  var TERMINAL_LEDGER_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_TERMINAL_LEDGER_PACKET_v1";

  var HANDOFF_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_HANDOFF_v1";

  var INSTALLATION_RECEIPT =
    "AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_INSTALLATION_RECEIPT_v3_3";

  var DEFINITION_RECEIPT =
    "AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_DEFINITION_RECEIPT_v3_3";

  var STATUSES =
    Object.freeze({
      PASS: "PASS",
      HOLD: "HOLD",
      FAIL: "FAIL",
      CONFLICT: "CONFLICT",
      ERROR: "ERROR",
      NOT_APPLICABLE: "NOT_APPLICABLE"
    });

  var CYCLE_STATUSES =
    Object.freeze({
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

  var LIMITS =
    Object.freeze({
      stationCount: 9,
      maxStringLength: 12000,
      maxArrayLength: 377,
      maxObjectKeys: 233,
      maxTraversalDepth: 13,
      maxIssues: 377
    });

  var NO_CLAIMS =
    Object.freeze({
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
      terminalSynthesisAuthority: false,
      stationEvidenceInterpretationAuthority: false,
      readyClaimed: false,
      verifiedClaimed: false,
      visualPassClaimed: false,
      finalVisualPassClaimed: false,
      diagnosticPassProvesReady: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      webGPU: false,
      directionOnly: true
    });

  var POSITIONS =
    deepFreeze([
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
        ]
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
        ]
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
        ]
      },
      {
        position: 4,
        fibonacci: "F8",
        news: "CENTER",
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
      }
    ]);

  var AUXILIARY_DEFINITIONS =
    deepFreeze([
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

  var INSTALLATION =
    {
      decision: "LOCAL_ONLY_NO_ROOT",
      reason: "ROOT_UNAVAILABLE",
      published: [],
      warnings: [],
      errors: [],
      rollbackComplete: true,
      installedAt: nowIso()
    };

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
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return false;
    }

    var proto =
      Object.getPrototypeOf(value);

    return proto === Object.prototype || proto === null;
  }

  function deepFreeze(value, seen) {
    var memory =
      seen || [];

    if (!value || typeof value !== "object") {
      return value;
    }

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

  function clone(value, seen, depth) {
    var memory =
      seen || [];

    var level =
      Number(depth) || 0;

    if (level > LIMITS.maxTraversalDepth) {
      return null;
    }

    if (
      value === null ||
      typeof value === "boolean" ||
      isFiniteNumber(value)
    ) {
      return value;
    }

    if (typeof value === "string") {
      return value.slice(0, LIMITS.maxStringLength);
    }

    if (
      value === undefined ||
      typeof value === "function" ||
      typeof value === "symbol" ||
      typeof value === "bigint" ||
      typeof value === "number"
    ) {
      return null;
    }

    if (!value || typeof value !== "object") {
      return null;
    }

    if (
      !Array.isArray(value) &&
      !isPlainObject(value)
    ) {
      return null;
    }

    if (memory.indexOf(value) !== -1) {
      return null;
    }

    memory.push(value);

    if (Array.isArray(value)) {
      return value
        .slice(0, LIMITS.maxArrayLength)
        .map(function cloneEntry(entry) {
          return clone(entry, memory.slice(), level + 1);
        });
    }

    var output = {};

    Object.keys(value)
      .slice(0, LIMITS.maxObjectKeys)
      .forEach(function cloneKey(key) {
        try {
          output[String(key).slice(0, LIMITS.maxStringLength)] =
            clone(value[key], memory.slice(), level + 1);
        } catch (_error) {
          output[key] = null;
        }
      });

    return output;
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
      stableEncode(clone(value, [], 0));

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

    return "fnv1a32:" + ("00000000" + h.toString(16)).slice(-8);
  }

  function issue(code, path, detail) {
    return {
      code: String(code || "ISSUE"),
      path: String(path || "$"),
      detail: String(detail || code || "ISSUE").slice(0, 512)
    };
  }

  function readPath(path) {
    var parts =
      String(path || "")
        .split(".")
        .filter(Boolean);

    var cursor =
      root;

    for (var index = 0; index < parts.length; index += 1) {
      if (
        cursor === null ||
        cursor === undefined ||
        cursor[parts[index]] === null ||
        cursor[parts[index]] === undefined
      ) {
        return null;
      }

      cursor =
        cursor[parts[index]];
    }

    return cursor;
  }

  function safeObject(value) {
    return isPlainObject(value) ? clone(value) : {};
  }

  function safeArray(value) {
    return Array.isArray(value) ? clone(value) : [];
  }

  function getPositionDefinition(position) {
    var target =
      Number(position);

    for (var index = 0; index < POSITIONS.length; index += 1) {
      if (POSITIONS[index].position === target) {
        return POSITIONS[index];
      }
    }

    return null;
  }

  function normalizeStatus(value, fallback) {
    var status =
      String(value || fallback || STATUSES.HOLD)
        .trim()
        .toUpperCase();

    return STATUSES[status] ? status : STATUSES.HOLD;
  }

  function validatePlainData(value) {
    var issues = [];

    function walk(item, path, depth, seen) {
      if (issues.length >= LIMITS.maxIssues) {
        return;
      }

      if (depth > LIMITS.maxTraversalDepth) {
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

      if (
        !Array.isArray(item) &&
        !isPlainObject(item)
      ) {
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

        item.forEach(function eachArray(entry, entryIndex) {
          walk(entry, path + "[" + entryIndex + "]", depth + 1, seen.slice());
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
      passed: issues.length === 0,
      issues: deepFreeze(issues)
    });
  }

  function normalizeControlRouteRequest(raw) {
    var source =
      isPlainObject(raw)
        ? clone(raw)
        : {};

    var category =
      source.category ||
      source.selectedCategory ||
      null;

    var audit =
      source.audit ||
      source.selectedAudit ||
      null;

    var participant =
      source.participant ||
      source.selectedParticipant ||
      null;

    var targetLifecycle =
      safeObject(
        source.targetLifecycle ||
        source.target ||
        {}
      );

    return {
      schema:
        CANONICAL_REQUEST_SCHEMA,

      cycleId:
        source.cycleId || null,

      mode:
        source.mode || "AUDIT",

      source:
        source.source || "CONTROL_PANEL",

      requestedAt:
        source.requestedAt || nowIso(),

      requestedStartPosition:
        Number(source.requestedStartPosition) || 1,

      subject:
        isPlainObject(source.subject)
          ? source.subject
          : {
              subjectId: "AUDRALIA_DIAGNOSTIC_ROUTE",
              category: category,
              audit: audit,
              participant: participant
            },

      engine:
        isPlainObject(source.engine)
          ? source.engine
          : {
              engineId: "AUDRALIA_DIAGNOSTIC_ENGINE",
              routeCompatibleRequest: true
            },

      construct:
        isPlainObject(source.construct)
          ? source.construct
          : {
              constructId: "AUDRALIA_DREAMSCAPE_DIAGNOSTIC_CHAMBER",
              file: FILE,
              controlPanelSource: source.source || "CONTROL_PANEL"
            },

      route:
        isPlainObject(source.route)
          ? source.route
          : {
              diagnosticRoute: "/showroom/globe/audralia/diagnostic/",
              targetRoute: "/showroom/globe/audralia/"
            },

      engineFamily:
        isPlainObject(source.engineFamily)
          ? source.engineFamily
          : {},

      target:
        targetLifecycle,

      evidencePolicy:
        isPlainObject(source.evidencePolicy)
          ? source.evidencePolicy
          : {
              diagnosticOnly: true,
              mutationAuthorized: false,
              visualPassClaimed: false
            },

      extensions:
        isPlainObject(source.extensions)
          ? source.extensions
          : {
              originalRequest: source
            }
    };
  }

  function validateCycleRequest(raw) {
    var normalized =
      normalizeControlRouteRequest(raw || {});

    var issues = [];
    var plain =
      validatePlainData(normalized);

    if (!plain.passed) {
      issues =
        issues.concat(plain.issues);
    }

    if (!isPlainObject(normalized.subject)) {
      issues.push(issue("REQUEST_SUBJECT_UNAVAILABLE_AFTER_NORMALIZATION", "$.subject"));
    }

    if (!isPlainObject(normalized.construct)) {
      issues.push(issue("REQUEST_CONSTRUCT_UNAVAILABLE_AFTER_NORMALIZATION", "$.construct"));
    }

    if (
      normalized.requestedStartPosition < 1 ||
      normalized.requestedStartPosition > 9
    ) {
      issues.push(issue("REQUESTED_START_POSITION_OUT_OF_RANGE", "$.requestedStartPosition"));
      normalized.requestedStartPosition = 1;
    }

    return deepFreeze({
      passed: issues.length === 0,
      fatal: false,
      recognizedSchema:
        normalized.schema === REQUEST_SCHEMA ||
        normalized.schema === ROUTE_REQUEST_SCHEMA ||
        normalized.schema === CANONICAL_REQUEST_SCHEMA,
      sourceSchema:
        raw && raw.schema ? String(raw.schema) : null,
      compatibilityClass:
        issues.length ? "REQUEST_ROUTE_NORMALIZED_WITH_LIMITED_FINDINGS" : "REQUEST_ROUTE_COMPATIBLE",
      canonicalRequest:
        deepFreeze(normalized),
      normalized:
        deepFreeze(clone(normalized)),
      issues:
        deepFreeze(issues),
      fatalIssues:
        deepFreeze([]),
      compatibilityFindings:
        deepFreeze(issues)
    });
  }

  function resolveStationCandidate(def) {
    if (!def || !Array.isArray(def.globalNames)) {
      return null;
    }

    for (var index = 0; index < def.globalNames.length; index += 1) {
      var candidate =
        readPath(def.globalNames[index]);

      if (
        candidate &&
        typeof candidate === "object" &&
        isFunction(candidate.executeCycleStation)
      ) {
        return {
          api: candidate,
          globalName: def.globalNames[index],
          discovered: true
        };
      }
    }

    return null;
  }

  function discoverStations() {
    return deepFreeze(
      POSITIONS.map(function mapPosition(def) {
        var found =
          resolveStationCandidate(def);

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

        for (var index = 0; index < def.globalNames.length; index += 1) {
          var candidate =
            readPath(def.globalNames[index]);

          if (candidate && typeof candidate === "object") {
            found = {
              api: candidate,
              globalName: def.globalNames[index]
            };
            break;
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

  function validateStationDefinition(position, stationApi) {
    var issues = [];
    var def =
      getPositionDefinition(position);

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

    if (Number(stationApi.CYCLE_POSITION) !== Number(position)) {
      issues.push(issue("STATION_POSITION_MISMATCH", "$.CYCLE_POSITION"));
    }

    if (!isFunction(stationApi.executeCycleStation)) {
      issues.push(issue("STATION_EXECUTION_METHOD_REQUIRED", "$.executeCycleStation"));
    }

    return deepFreeze({
      passed: issues.length === 0,
      issues: deepFreeze(issues)
    });
  }

  function hashNormalizedReceipt(receipt) {
    var payload =
      clone(receipt);

    if (isPlainObject(payload)) {
      payload.normalizedReceiptHash = null;

      if (isPlainObject(payload.conductorTransport)) {
        payload.conductorTransport.normalizedReceiptHash = null;
      }
    }

    return hash(payload);
  }

  function verifyNormalizedReceiptHash(receipt) {
    return Boolean(
      isPlainObject(receipt) &&
      typeof receipt.normalizedReceiptHash === "string" &&
      hashNormalizedReceipt(receipt) === receipt.normalizedReceiptHash
    );
  }

  function hashTerminalLedger(ledger) {
    var payload =
      clone(ledger);

    if (isPlainObject(payload)) {
      payload.terminalLedgerHash = null;
    }

    return hash(payload);
  }

  function verifyTerminalLedgerHash(ledger) {
    return Boolean(
      isPlainObject(ledger) &&
      typeof ledger.terminalLedgerHash === "string" &&
      hashTerminalLedger(ledger) === ledger.terminalLedgerHash
    );
  }

  function normalizeStationReceipt(receipt, def, fallbackStatus, fallbackSummary) {
    var source =
      isPlainObject(receipt)
        ? clone(receipt)
        : {};

    var output =
      {};

    output.schema =
      source.schema || STATION_RECEIPT_SCHEMA;

    output.cycleId =
      source.cycleId || null;

    output.position =
      Number(source.position) || def.position;

    output.cyclePosition =
      Number(source.cyclePosition) || output.position;

    output.stationId =
      source.stationId || def.stationId;

    output.role =
      source.role || output.stationId;

    output.news =
      source.news || def.news || null;

    output.fibonacci =
      source.fibonacci || def.fibonacci || null;

    output.contract =
      source.contract || "UNKNOWN_STATION_CONTRACT";

    output.version =
      source.version || "UNKNOWN";

    output.file =
      source.file || def.file;

    output.status =
      normalizeStatus(source.status, fallbackStatus || STATUSES.HOLD);

    output.completed =
      source.completed === true;

    output.handoffEligible =
      source.handoffEligible === true;

    if (
      output.status === STATUSES.PASS ||
      output.status === STATUSES.NOT_APPLICABLE
    ) {
      output.handoffEligible =
        true;
    } else {
      output.handoffEligible =
        false;
    }

    output.summary =
      source.summary || fallbackSummary || "Station receipt normalized by North conductor.";

    output.observations =
      safeArray(source.observations);

    output.evidence =
      safeArray(source.evidence);

    output.issues =
      safeArray(source.issues);

    output.firstHeldCoordinate =
      source.firstHeldCoordinate || null;

    output.firstFailedCoordinate =
      source.firstFailedCoordinate || null;

    output.firstConflictCoordinate =
      source.firstConflictCoordinate || null;

    output.recommendedOwner =
      isPlainObject(source.recommendedOwner)
        ? clone(source.recommendedOwner)
        : null;

    output.rawStationReceipt =
      clone(source);

    output.sourceReceiptHash =
      source.receiptHash || hash(source);

    output.receiptHash =
      output.sourceReceiptHash;

    output.generatedAt =
      source.generatedAt || nowIso();

    output.noClaims =
      isPlainObject(source.noClaims)
        ? clone(source.noClaims)
        : clone(NO_CLAIMS);

    output.normalizedReceiptHash =
      null;

    output.conductorTransport =
      {
        schema: "AUDRALIA_DIAGNOSTIC_CONDUCTOR_STATION_TRANSPORT_v1",
        sourceReceiptPreserved: true,
        sourceReceiptHash: output.sourceReceiptHash,
        normalizedReceiptHash: null,
        normalizedHashVerificationStoredInReceipt: false,
        normalizedHashVerificationAuthority: "EXTERNAL_VERIFIER",
        stationMeaningInterpreted: false,
        directionOnly: true,
        postHashMutationAuthorized: false,
        transportedAt: nowIso()
      };

    var normalizedHash =
      hashNormalizedReceipt(output);

    output.normalizedReceiptHash =
      normalizedHash;

    output.conductorTransport.normalizedReceiptHash =
      normalizedHash;

    return deepFreeze(output);
  }

  function makeSyntheticReceipt(session, def, status, summary, issues) {
    var safeDef =
      def ||
      {
        position: null,
        stationId: "UNKNOWN",
        news: null,
        fibonacci: null,
        file: null
      };

    return normalizeStationReceipt(
      {
        schema: STATION_RECEIPT_SCHEMA,
        cycleId: session.cycleId,
        position: safeDef.position,
        cyclePosition: safeDef.position,
        stationId: safeDef.stationId,
        role: safeDef.stationId,
        news: safeDef.news,
        fibonacci: safeDef.fibonacci,
        contract: CONTRACT,
        version: VERSION,
        file: safeDef.file,
        status: status,
        completed: false,
        handoffEligible: false,
        summary: summary,
        observations: [],
        evidence: [],
        issues: issues || [],
        recommendedOwner: {
          ownerType: "DIAGNOSTIC_STATION",
          subjectId: safeDef.stationId,
          contract: null,
          file: safeDef.file,
          component: safeDef.stationId
        },
        noClaims: clone(NO_CLAIMS),
        generatedAt: nowIso()
      },
      safeDef,
      status,
      summary
    );
  }

  function statusFromStationStatus(status) {
    if (status === STATUSES.HOLD) {
      return CYCLE_STATUSES.HELD;
    }

    if (status === STATUSES.FAIL) {
      return CYCLE_STATUSES.FAILED;
    }

    if (status === STATUSES.CONFLICT) {
      return CYCLE_STATUSES.CONFLICTING;
    }

    if (status === STATUSES.ERROR) {
      return CYCLE_STATUSES.ERROR;
    }

    return null;
  }

  function markFirst(session, receipt) {
    if (receipt.status === STATUSES.HOLD && session.ledger.firstHeldPosition === null) {
      session.ledger.firstHeldPosition = receipt.position;
    }

    if (receipt.status === STATUSES.FAIL && session.ledger.firstFailedPosition === null) {
      session.ledger.firstFailedPosition = receipt.position;
    }

    if (receipt.status === STATUSES.CONFLICT && session.ledger.firstConflictPosition === null) {
      session.ledger.firstConflictPosition = receipt.position;
    }

    if (receipt.status === STATUSES.ERROR && session.ledger.firstErrorPosition === null) {
      session.ledger.firstErrorPosition = receipt.position;
    }
  }

  function composeHandoff(session, fromDef, toDef, receipt) {
    return deepFreeze({
      schema: HANDOFF_SCHEMA,
      cycleId: session.cycleId,
      fromPosition: fromDef.position,
      fromStationId: fromDef.stationId,
      toPosition: toDef.position,
      toStationId: toDef.stationId,
      sourceReceiptHash: receipt.sourceReceiptHash || receipt.receiptHash || null,
      normalizedReceiptHash: receipt.normalizedReceiptHash || null,
      normalizedReceiptHashVerified: verifyNormalizedReceiptHash(receipt),
      authorizedByConductor: true,
      status: "AUTHORIZED",
      reasonCode: "PREDECESSOR_PASS",
      stationMeaningInterpreted: false,
      directionOnly: true,
      generatedAt: nowIso()
    });
  }

  function composeDeniedHandoff(session, fromDef, toDef, receipt) {
    return deepFreeze({
      schema: HANDOFF_SCHEMA,
      cycleId: session.cycleId,
      fromPosition: fromDef ? fromDef.position : null,
      fromStationId: fromDef ? fromDef.stationId : null,
      toPosition: toDef ? toDef.position : null,
      toStationId: toDef ? toDef.stationId : null,
      sourceReceiptHash: receipt ? receipt.sourceReceiptHash || receipt.receiptHash || null : null,
      normalizedReceiptHash: receipt ? receipt.normalizedReceiptHash || null : null,
      normalizedReceiptHashVerified: receipt ? verifyNormalizedReceiptHash(receipt) : false,
      authorizedByConductor: false,
      status: "DENIED",
      reasonCode: receipt ? receipt.status : "HANDOFF_DENIED",
      stationMeaningInterpreted: false,
      directionOnly: true,
      generatedAt: nowIso()
    });
  }

  function buildTerminalLedger(session, interrupted) {
    var ledger =
      {
        schema: TERMINAL_LEDGER_SCHEMA,
        cycleId: session.cycleId,
        canonicalCycleRequest: clone(session.request),
        requestValidation: clone(session.requestValidation),
        requestCompatibility: clone(session.requestCompatibility),
        stationDefinitions: clone(POSITIONS),
        stationReceipts: clone(session.ledger.stationReceipts),
        rawStationReceipts: clone(session.ledger.rawStationReceipts),
        handoffs: clone(session.ledger.handoffs),
        deniedHandoffs: clone(session.ledger.deniedHandoffs),
        auxiliaryRegistrations: clone(session.ledger.auxiliaryRegistrations),
        firstHeldPosition: session.ledger.firstHeldPosition,
        firstFailedPosition: session.ledger.firstFailedPosition,
        firstConflictPosition: session.ledger.firstConflictPosition,
        firstErrorPosition: session.ledger.firstErrorPosition,
        terminalInvocation: {
          position: 9,
          stationId: "RAIL_TERMINAL_SYNTHESIS",
          fibonacci: "F89",
          news: "NORTH_RETURN",
          interrupted: Boolean(interrupted),
          invokedByConductor: true
        },
        noClaims: clone(NO_CLAIMS),
        generatedAt: nowIso(),
        terminalLedgerHash: null
      };

    ledger.terminalLedgerHash =
      hashTerminalLedger(ledger);

    return deepFreeze(ledger);
  }

  function composeStationRequest(session, position, terminalLedger) {
    var def =
      getPositionDefinition(position);

    var request =
      {
        schema: STATION_REQUEST_SCHEMA,
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
        canonicalCycleRequest: clone(session.request),
        requestValidation: clone(session.requestValidation),
        requestCompatibility: clone(session.requestCompatibility),
        priorStationReceipts: clone(session.ledger.stationReceipts),
        priorRawStationReceipts: clone(session.ledger.rawStationReceipts),
        terminalSynthesisMode: position === 9,
        transportPolicy: {
          terminalLedgerInterpretationOwnedByF89: true,
          conductorTerminalInterpretationAuthority: false,
          stationMeaningInterpretedByConductor: false,
          normalizedHashVerificationExternal: true
        },
        noClaims: clone(NO_CLAIMS)
      };

    if (position === 9 && terminalLedger) {
      request.terminalLedger =
        clone(terminalLedger);

      request.terminalLedgerHash =
        terminalLedger.terminalLedgerHash;

      request.terminalLedgerHashVerifiedByConductor =
        verifyTerminalLedgerHash(terminalLedger);
    }

    return deepFreeze(request);
  }

  function createCycle(rawRequest) {
    var validation =
      validateCycleRequest(rawRequest || {});

    var canonicalRequest =
      clone(validation.canonicalRequest);

    var cycleId =
      canonicalRequest.cycleId ||
      (
        "audralia-nine-cycle-" +
        hash(canonicalRequest).replace("fnv1a32:", "")
      );

    canonicalRequest.cycleId =
      cycleId;

    var session =
      {
        cycleId: cycleId,
        request: deepFreeze(canonicalRequest),
        requestValidation: deepFreeze({
          passed: validation.passed,
          fatal: false,
          recognizedSchema: validation.recognizedSchema,
          sourceSchema: validation.sourceSchema,
          issues: clone(validation.issues),
          fatalIssues: [],
          compatibilityFindings: clone(validation.compatibilityFindings)
        }),
        requestCompatibility: deepFreeze({
          class: validation.compatibilityClass,
          routeTolerantNormalizationApplied: true,
          terminalInterpretationDeferredToF89: true
        }),
        state: CYCLE_STATUSES.OPEN,
        sealed: false,
        disposed: false,
        runOnce: false,
        registry: {},
        startedAt: null,
        completedAt: null,
        terminalLedger: null,
        ledger: {
          stationReceipts: [],
          rawStationReceipts: [],
          handoffs: [],
          deniedHandoffs: [],
          auxiliaryRegistrations: [],
          skippedPositions: [],
          terminalRailReceipt: null,
          terminalRailRawReceipt: null,
          terminalLedgerHash: null,
          firstHeldPosition: null,
          firstFailedPosition: null,
          firstConflictPosition: null,
          firstErrorPosition: null
        }
      };

    function registerStation(position, stationApi) {
      var def =
        getPositionDefinition(position);

      var validationResult =
        validateStationDefinition(position, stationApi);

      var outcome =
        {
          position: Number(position),
          stationId: def ? def.stationId : null,
          status: validationResult.passed ? "REGISTERED" : "REJECTED",
          reason: validationResult.passed ? "STATION_REGISTERED" : "STATION_INVALID",
          issues: clone(validationResult.issues),
          generatedAt: nowIso()
        };

      if (validationResult.passed) {
        session.registry[position] =
          stationApi;
      }

      session.ledger.auxiliaryRegistrations.push(
        deepFreeze(outcome)
      );

      return deepFreeze(outcome);
    }

    function seal() {
      if (!session.sealed) {
        session.sealed = true;
        session.state = CYCLE_STATUSES.SEALED;
      }

      return getReceipt();
    }

    function executeStation(position, terminalLedger) {
      var def =
        getPositionDefinition(position);

      var api =
        session.registry[position];

      if (!def || !api) {
        var missing =
          makeSyntheticReceipt(
            session,
            def,
            STATUSES.HOLD,
            "Station is not registered with the North conductor.",
            [
              issue(
                "STATION_NOT_REGISTERED",
                def ? def.stationId : "UNKNOWN",
                "No compatible station API was discovered or registered."
              )
            ]
          );

        session.ledger.stationReceipts.push(missing);
        session.ledger.rawStationReceipts.push(clone(missing.rawStationReceipt));
        markFirst(session, missing);

        return missing;
      }

      try {
        var sourceReceipt =
          api.executeCycleStation(
            composeStationRequest(session, position, terminalLedger || null)
          );

        var normalized =
          normalizeStationReceipt(
            sourceReceipt,
            def,
            STATUSES.HOLD,
            "Station receipt normalized by North conductor."
          );

        session.ledger.stationReceipts.push(normalized);
        session.ledger.rawStationReceipts.push(clone(normalized.rawStationReceipt));
        markFirst(session, normalized);

        return normalized;
      } catch (error) {
        var thrown =
          makeSyntheticReceipt(
            session,
            def,
            STATUSES.ERROR,
            "Station threw during diagnostic execution.",
            [
              issue(
                "STATION_EXECUTION_THROW",
                def.stationId,
                error && error.message ? error.message : String(error)
              )
            ]
          );

        session.ledger.stationReceipts.push(thrown);
        session.ledger.rawStationReceipts.push(clone(thrown.rawStationReceipt));
        markFirst(session, thrown);

        return thrown;
      }
    }

    function run() {
      if (session.disposed || session.runOnce) {
        return getReceipt();
      }

      seal();

      session.runOnce =
        true;

      session.startedAt =
        nowIso();

      session.state =
        CYCLE_STATUSES.RUNNING;

      var stopped =
        false;

      for (var position = session.request.requestedStartPosition; position <= 8; position += 1) {
        if (stopped) {
          session.ledger.skippedPositions.push(
            clone(getPositionDefinition(position))
          );
          continue;
        }

        var receipt =
          executeStation(position, null);

        var def =
          getPositionDefinition(position);

        var nextDef =
          getPositionDefinition(position + 1);

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
          stopped =
            true;

          session.state =
            statusFromStationStatus(receipt.status) || CYCLE_STATUSES.HELD;

          if (nextDef) {
            session.ledger.deniedHandoffs.push(
              composeDeniedHandoff(session, def, nextDef, receipt)
            );
          }
        }
      }

      session.terminalLedger =
        buildTerminalLedger(session, stopped);

      session.ledger.terminalLedgerHash =
        session.terminalLedger.terminalLedgerHash;

      var railReceipt =
        executeStation(9, session.terminalLedger);

      session.ledger.terminalRailReceipt =
        clone(railReceipt);

      session.ledger.terminalRailRawReceipt =
        clone(railReceipt.rawStationReceipt || railReceipt);

      if (!stopped) {
        session.state =
          railReceipt.status === STATUSES.PASS
            ? CYCLE_STATUSES.COMPLETE
            : statusFromStationStatus(railReceipt.status) || CYCLE_STATUSES.HELD;
      }

      session.completedAt =
        nowIso();

      return getReceipt();
    }

    function getReceipt() {
      var stationReceipts =
        session.ledger.stationReceipts;

      var packet =
        {
          schema: CYCLE_SCHEMA,
          contract: CONTRACT,
          previousContract: PREVIOUS_CONTRACT,
          priorContract: PRIOR_CONTRACT,
          legacyContract: LEGACY_CONTRACT,
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
          passedStationCount: stationReceipts.filter(function count(receipt) { return receipt.status === STATUSES.PASS; }).length,
          heldStationCount: stationReceipts.filter(function count(receipt) { return receipt.status === STATUSES.HOLD; }).length,
          failedStationCount: stationReceipts.filter(function count(receipt) { return receipt.status === STATUSES.FAIL; }).length,
          conflictStationCount: stationReceipts.filter(function count(receipt) { return receipt.status === STATUSES.CONFLICT; }).length,
          errorStationCount: stationReceipts.filter(function count(receipt) { return receipt.status === STATUSES.ERROR; }).length,
          skippedStationCount: session.ledger.skippedPositions.length,
          canonicalCycleRequest: clone(session.request),
          requestValidation: clone(session.requestValidation),
          requestCompatibility: clone(session.requestCompatibility),
          stationReceipts: clone(stationReceipts),
          receipts: clone(stationReceipts),
          rawStationReceipts: clone(session.ledger.rawStationReceipts),
          handoffs: clone(session.ledger.handoffs),
          deniedHandoffs: clone(session.ledger.deniedHandoffs),
          auxiliaryRegistrations: clone(session.ledger.auxiliaryRegistrations),
          skippedPositions: clone(session.ledger.skippedPositions),
          firstHeldPosition: session.ledger.firstHeldPosition,
          firstFailedPosition: session.ledger.firstFailedPosition,
          firstConflictPosition: session.ledger.firstConflictPosition,
          firstErrorPosition: session.ledger.firstErrorPosition,
          terminalRailInvoked: stationReceipts.some(function find(receipt) { return receipt.position === 9; }),
          terminalRailReceipt: clone(session.ledger.terminalRailReceipt),
          terminalRailRawReceipt: clone(session.ledger.terminalRailRawReceipt),
          terminalLedgerSchema: TERMINAL_LEDGER_SCHEMA,
          terminalLedgerHash: session.terminalLedger ? session.terminalLedger.terminalLedgerHash : null,
          terminalLedgerHashVerified: session.terminalLedger ? verifyTerminalLedgerHash(session.terminalLedger) : false,
          normalizedReceiptHashesVerifiedExternally: stationReceipts.every(verifyNormalizedReceiptHash),
          inputHash: hash(session.request),
          ledgerHash: hash(session.ledger),
          cycleHash: null,
          transportSummary: {
            schema: "AUDRALIA_DIAGNOSTIC_CONDUCTOR_TERMINAL_LEDGER_TRANSPORT_SUMMARY_v1",
            routeTolerantRequestNormalization: true,
            losslessStationReceiptTransport: true,
            rawStationReceiptCustody: true,
            normalizedHashVerificationStoredInReceipt: false,
            normalizedHashVerificationExternal: true,
            noPostHashReceiptMutation: true,
            terminalLedgerConstructedForF89: Boolean(session.terminalLedger),
            terminalLedgerInterpretationOwnedByF89: true,
            conductorTerminalInterpretationAuthority: false,
            conductorOccupiesFibonacciPosition: false,
            conductorCreatesTenthStation: false
          },
          noClaims: clone(NO_CLAIMS)
        };

      packet.cycleHash =
        hash({
          schema: packet.schema,
          contract: packet.contract,
          version: packet.version,
          cycleId: packet.cycleId,
          status: packet.status,
          stationReceipts: packet.stationReceipts,
          terminalLedgerHash: packet.terminalLedgerHash,
          terminalRailReceipt: packet.terminalRailReceipt
        });

      return deepFreeze(packet);
    }

    function getLedger() {
      var ledger =
        clone(session.ledger);

      ledger.ledgerHash =
        hash(ledger);

      return deepFreeze(ledger);
    }

    function getSummary() {
      var receipt =
        getReceipt();

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
        terminalLedgerHash: receipt.terminalLedgerHash,
        terminalLedgerHashVerified: receipt.terminalLedgerHashVerified,
        normalizedReceiptHashesVerifiedExternally: receipt.normalizedReceiptHashesVerifiedExternally,
        noClaims: clone(NO_CLAIMS)
      });
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
        completedAt: session.completedAt,
        terminalLedgerConstructed: Boolean(session.terminalLedger),
        terminalLedgerHash: session.terminalLedger ? session.terminalLedger.terminalLedgerHash : null,
        normalizedReceiptHashVerificationMode: "EXTERNAL"
      });
    }

    function dispose() {
      session.registry = {};
      session.disposed = true;
      session.state = CYCLE_STATUSES.DISPOSED;
      return getState();
    }

    return deepFreeze({
      registerStation: registerStation,
      seal: seal,
      run: run,
      getReceipt: getReceipt,
      getLedger: getLedger,
      getSummary: getSummary,
      getState: getState,
      dispose: dispose
    });
  }

  function runRegisteredCycle(rawRequest) {
    var cycle =
      createCycle(rawRequest || {});

    discoverStations().forEach(function registerFound(record) {
      if (record.discovered && record.api) {
        cycle.registerStation(record.position, record.api);
      }
    });

    cycle.seal();

    var packet =
      cycle.run();

    return deepFreeze({
      schema: "AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_ROUTE_RESULT_v3_3",
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      cycleId: packet.cycleId,
      status: packet.status,
      packet: clone(packet),
      ledger: clone(cycle.getLedger()),
      summary: clone(cycle.getSummary()),
      stationDiscovery: clone(
        discoverStations().map(function stripApi(entry) {
          return {
            position: entry.position,
            stationId: entry.stationId,
            file: entry.file,
            discovered: entry.discovered,
            globalName: entry.globalName
          };
        })
      ),
      receipts: clone(packet.stationReceipts || []),
      stationReceipts: clone(packet.stationReceipts || []),
      rawStationReceipts: clone(packet.rawStationReceipts || []),
      terminalRailReceipt: clone(packet.terminalRailReceipt),
      terminalRailRawReceipt: clone(packet.terminalRailRawReceipt),
      terminalLedgerHash: packet.terminalLedgerHash,
      terminalLedgerHashVerified: packet.terminalLedgerHashVerified,
      normalizedReceiptHashesVerifiedExternally: packet.normalizedReceiptHashesVerifiedExternally,
      transportSummary: clone(packet.transportSummary),
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

    if (!isPlainObject(packet)) {
      issues.push(issue("CYCLE_PACKET_OBJECT_REQUIRED", "$"));
    } else {
      if (packet.schema !== CYCLE_SCHEMA) {
        issues.push(issue("CYCLE_SCHEMA_MISMATCH", "$.schema"));
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

  function getDefinitionReceipt() {
    return deepFreeze({
      receipt: DEFINITION_RECEIPT,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      priorContract: PRIOR_CONTRACT,
      legacyContract: LEGACY_CONTRACT,
      version: VERSION,
      versionLabel: VERSION_LABEL,
      file: FILE,
      cycleSchema: CYCLE_SCHEMA,
      requestSchema: REQUEST_SCHEMA,
      routeRequestSchema: ROUTE_REQUEST_SCHEMA,
      canonicalRequestSchema: CANONICAL_REQUEST_SCHEMA,
      stationRequestSchema: STATION_REQUEST_SCHEMA,
      stationReceiptSchema: STATION_RECEIPT_SCHEMA,
      terminalLedgerSchema: TERMINAL_LEDGER_SCHEMA,
      stationCount: POSITIONS.length,
      conductorOccupiesCyclePosition: false,
      conductorCreatesTenthStation: false,
      routeTolerantRequestNormalization: true,
      terminalLedgerConstructedOnlyForF89: true,
      terminalLedgerInterpretationOwnedByF89: true,
      terminalSynthesisAuthority: false,
      normalizedHashVerificationStoredInReceipt: false,
      normalizedHashVerificationExternal: true,
      noPostHashReceiptMutation: true,
      positions: POSITIONS,
      auxiliaryDefinitions: AUXILIARY_DEFINITIONS,
      noClaims: NO_CLAIMS,
      generatedAt: nowIso(),
      definitionHash: hash({
        contract: CONTRACT,
        version: VERSION,
        positions: POSITIONS,
        routeTolerantRequestNormalization: true
      })
    });
  }

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
      CONTRACT: CONTRACT,
      PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
      PRIOR_CONTRACT: PRIOR_CONTRACT,
      LEGACY_CONTRACT: LEGACY_CONTRACT,
      VERSION: VERSION,
      VERSION_LABEL: VERSION_LABEL,
      FILE: FILE,
      CYCLE_SCHEMA: CYCLE_SCHEMA,
      REQUEST_SCHEMA: REQUEST_SCHEMA,
      ROUTE_REQUEST_SCHEMA: ROUTE_REQUEST_SCHEMA,
      CANONICAL_REQUEST_SCHEMA: CANONICAL_REQUEST_SCHEMA,
      STATION_REQUEST_SCHEMA: STATION_REQUEST_SCHEMA,
      STATION_SCHEMA: STATION_RECEIPT_SCHEMA,
      TERMINAL_LEDGER_SCHEMA: TERMINAL_LEDGER_SCHEMA,
      POSITIONS: POSITIONS,
      AUXILIARY_DEFINITIONS: AUXILIARY_DEFINITIONS,
      LIMITS: LIMITS,
      NO_CLAIMS: NO_CLAIMS,
      clone: clone,
      deepFreeze: deepFreeze,
      hash: hash,
      hashNormalizedReceipt: hashNormalizedReceipt,
      verifyNormalizedReceiptHash: verifyNormalizedReceiptHash,
      hashTerminalLedger: hashTerminalLedger,
      verifyTerminalLedgerHash: verifyTerminalLedgerHash,
      validatePlainData: validatePlainData,
      validateCycleRequest: validateCycleRequest,
      validateStationDefinition: validateStationDefinition,
      validateCyclePacket: validateCyclePacket,
      normalizeStationReceipt: normalizeStationReceipt,
      discoverStations: discoverStations,
      discoverAuxiliaries: discoverAuxiliaries,
      createCycle: createCycle,
      executeCycle: executeCycle,
      executeDiagnosticCycle: executeDiagnosticCycle,
      executeNineCycle: executeNineCycle,
      runNineCycle: runNineCycle,
      conduct: conduct,
      run: run,
      getDefinitionReceipt: getDefinitionReceipt,
      getInstallationReceipt: getInstallationReceipt
    });
  }

  function publish() {
    if (!root || typeof root !== "object") {
      return buildApi();
    }

    var existing =
      root.AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR;

    if (
      existing &&
      existing.CONTRACT &&
      existing.CONTRACT !== CONTRACT &&
      existing.CONTRACT !== PREVIOUS_CONTRACT &&
      existing.CONTRACT !== PRIOR_CONTRACT &&
      existing.CONTRACT !== LEGACY_CONTRACT
    ) {
      INSTALLATION.decision =
        "CONFLICT";

      INSTALLATION.reason =
        "PRIMARY_GLOBAL_OCCUPIED_BY_INCOMPATIBLE_AUTHORITY";

      INSTALLATION.errors.push(
        "PRIMARY_GLOBAL_CONFLICT"
      );

      return buildApi();
    }

    var api =
      buildApi();

    try {
      root.AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR =
        api;

      INSTALLATION.published.push(
        "AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR"
      );

      var namespace =
        ensureNamespace("AUDRALIA");

      if (namespace) {
        namespace.diagnosticNorthConductor =
          api;

        INSTALLATION.published.push(
          "AUDRALIA.diagnosticNorthConductor"
        );

        if (!namespace.diagnostics || typeof namespace.diagnostics !== "object") {
          namespace.diagnostics = {};
        }

        namespace.diagnostics.northConductor =
          api;

        INSTALLATION.published.push(
          "AUDRALIA.diagnostics.northConductor"
        );
      }

      root.AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_RECEIPT =
        getDefinitionReceipt();

      INSTALLATION.published.push(
        "AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_RECEIPT"
      );

      root.__AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_LOADED__ =
        true;

      root.__AUDRALIA_DIAGNOSTIC_NINE_CYCLE_VERSION__ =
        VERSION;

      root.__AUDRALIA_DIAGNOSTIC_NINE_CYCLE_SCHEMA__ =
        CYCLE_SCHEMA;

      root.__AUDRALIA_DIAGNOSTIC_TERMINAL_LEDGER_SCHEMA__ =
        TERMINAL_LEDGER_SCHEMA;

      root.__AUDRALIA_DIAGNOSTIC_TERMINAL_LEDGER_TRANSPORT_ACTIVE__ =
        true;

      root.__AUDRALIA_DIAGNOSTIC_NORMALIZED_HASH_EXTERNAL_VERIFICATION__ =
        true;

      root.__AUDRALIA_DIAGNOSTIC_ROUTE_TOLERANT_CONDUCTOR__ =
        true;

      INSTALLATION.decision =
        existing
          ? "COMPATIBLE_REPLACEMENT_OR_UPGRADE"
          : "NEW_INSTALLATION";

      INSTALLATION.reason =
        "PUBLISHED";

      INSTALLATION.rollbackComplete =
        true;
    } catch (error) {
      INSTALLATION.decision =
        "CONFLICT";

      INSTALLATION.reason =
        "PUBLICATION_FAILED";

      INSTALLATION.errors.push(
        error && error.message ? error.message : String(error)
      );
    }

    return api;
  }

  var API =
    publish();

  if (typeof module !== "undefined" && module.exports) {
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

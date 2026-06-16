// /assets/audralia/audralia.diagnostic.north.conductor.js
// AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_NINE_CYCLE_TERMINAL_LEDGER_TRANSPORT_3D_TNT_v3_2_1
// Full-file replacement.
// Quiet-load, dependency-free, 3D-native diagnostic conductor.
//
// Previous contract:
// - AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_NINE_CYCLE_TERMINAL_LEDGER_TRANSPORT_3D_TNT_v3_2
//
// Corrective purpose:
// - Preserve the accepted v3_2 paired conductor-to-F89 terminal-ledger architecture.
// - Remove the post-hash mutation caused by storing normalizedReceiptHashVerified
//   after the normalized receipt hash had already been finalized.
// - Keep normalized-receipt verification external to the hashed receipt.
// - Preserve all N.E.W.S., Fibonacci, station, request, transport, terminal-ledger,
//   public API, installation, and no-claims contracts.
//
// Governing authority:
// - AUDRALIA_CONDUCTOR_TO_F89_TERMINAL_LEDGER_PAIRED_CANONICAL_TEN_STEP_PRECRAFT_AUDIT_v1
// - AUDRALIA_NORTH_CONDUCTOR_CANONICAL_TEN_STEP_PRECRAFT_AUDIT_v1
// - AUDRALIA_NORTH_CONDUCTOR_CANONICAL_TEN_STEP_CORRECTIVE_PRECRAFT_AUDIT_v1
// - AUDRALIA_DIAGNOSTIC_SHARED_EVIDENCE_AND_HANDOFF_SCHEMA_GOVERNING_BLUEPRINT_v1
//
// Canonical hash law:
// - Finalize all normalized receipt metadata.
// - Neutralize only the two self-referential normalized hash fields.
// - Compute the normalized receipt hash.
// - Assign the same hash to both normalized hash locations.
// - Perform no mutation after hash assignment.
// - Verify normalized hashes externally through verifyNormalizedReceiptHash().
//
// Canonical terminal boundary:
// - The conductor collects and transports.
// - F89 validates and synthesizes.
// - The terminal ledger is supplied only to F89.
// - The terminal ledger is not recursively embedded in station receipts.
// - F89 remains Position 9 / F89 / NORTH_RETURN.
// - The conductor remains outside the Fibonacci station sequence.

(function audraliaDiagnosticNorthConductorNineCycleTerminalLedgerTransport3D(global) {
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
    "AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_NINE_CYCLE_TERMINAL_LEDGER_TRANSPORT_3D_TNT_v3_2_1";

  var PREVIOUS_CONTRACT =
    "AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_NINE_CYCLE_TERMINAL_LEDGER_TRANSPORT_3D_TNT_v3_2";

  var PRIOR_CONTRACT =
    "AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_NINE_CYCLE_SHARED_SCHEMA_TRANSPORT_3D_TNT_v3_1";

  var EARLIER_CONTRACT =
    "AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_NINE_CYCLE_SHARED_SCHEMA_TRANSPORT_3D_TNT_v3";

  var LEGACY_CONTRACT =
    "AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_NINE_CYCLE_AUTHORITY_3D_TNT_v2";

  var VERSION = "3.2.1";

  var VERSION_LABEL =
    "2026-06-16.audralia-diagnostic-north-conductor-nine-cycle-terminal-ledger-transport-3d-v3-2-1";

  var FILE =
    "/assets/audralia/audralia.diagnostic.north.conductor.js";

  var DEFINITION_RECEIPT =
    "AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_DEFINITION_RECEIPT_v3_2_1";

  var INSTALLATION_RECEIPT =
    "AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_INSTALLATION_RECEIPT_v3_2_1";

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

  var STATION_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_STATION_RECEIPT_v1";

  var HANDOFF_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_HANDOFF_v1";

  var RESTITUTION_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_RESTITUTION_COORDINATE_v1";

  var TERMINAL_LEDGER_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_TERMINAL_LEDGER_PACKET_v1";

  var TRANSPORT_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_CONDUCTOR_STATION_TRANSPORT_v1";

  var SHARED_HANDOFF_ENVELOPE_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_SHARED_HANDOFF_ENVELOPE_v1";

  var RUNTIME_EVIDENCE_PACKET_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_RUNTIME_EVIDENCE_PACKET_F13_v1";

  var RUNTIME_INTERPRETATION_PACKET_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_RUNTIME_INTERPRETATION_PACKET_F21_v1";

  var SOUTH_HANDOFF_PACKET_SCHEMA =
    "AUDRALIA_DIAGNOSTIC_SOUTH_HANDOFF_PACKET_F34_v1";

  var HASH_LABEL =
    "AUDRALIA_DIAGNOSTIC_HASH_v1";

  var STATUSES =
    Object.freeze({
      PASS: "PASS",
      HOLD: "HOLD",
      FAIL: "FAIL",
      CONFLICT: "CONFLICT",
      NOT_APPLICABLE: "NOT_APPLICABLE",
      ERROR: "ERROR"
    });

  var CYCLE_STATUSES =
    Object.freeze({
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

  var MODES =
    Object.freeze({
      CONSTRUCTION: "CONSTRUCTION",
      CALIBRATION: "CALIBRATION",
      RESTITUTION: "RESTITUTION",
      AUDIT: "AUDIT"
    });

  var REGISTRATION_STATUSES =
    Object.freeze({
      REGISTERED: "REGISTERED",
      DUPLICATE_IDENTICAL: "DUPLICATE_IDENTICAL",
      CONFLICT: "CONFLICT",
      REJECTED: "REJECTED"
    });

  var LIMITS =
    Object.freeze({
      stationCount: 9,
      predecessorStationCount: 8,
      maxAuxiliariesPerStation: 9,
      maxStationIssues: 89,
      maxStationEvidenceItems: 233,
      maxCycleIssues: 377,
      maxStringLength: 12000,
      maxArrayLength: 377,
      maxObjectKeys: 233,
      maxTraversalDepth: 13
    });

  var SHARED_TRANSPORT_FIELDS =
    Object.freeze([
      "sharedHandoffEnvelope",
      "outputPacketReference",
      "runtimeEvidencePacket",
      "runtimeInterpretationPacket",
      "southHandoffPacket",
      "deferredEvidence",
      "nonfatalFindings",
      "recognizedGrammars",
      "unrecognizedGrammars",
      "evidenceStateCounts"
    ]);

  var OUTER_RECEIPT_FIELDS =
    Object.freeze([
      "schema",
      "cycleId",
      "position",
      "cyclePosition",
      "stationId",
      "role",
      "news",
      "fibonacci",
      "contract",
      "version",
      "file",
      "status",
      "completed",
      "handoffEligible",
      "summary",
      "observations",
      "evidence",
      "issues",
      "firstHeldCoordinate",
      "firstFailedCoordinate",
      "firstConflictCoordinate",
      "recommendedOwner",
      "generatedAt",
      "noClaims",
      "receiptHash"
    ]);

  var CONDUCTOR_OWNED_RECEIPT_FIELDS =
    Object.freeze([
      "rawStationReceipt",
      "conductorTransport",
      "sourceReceiptHash",
      "normalizedReceiptHash"
    ]);

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
      stationEvidenceInterpretationAuthority: false,
      terminalSynthesisAuthority: false,
      readClassificationAuthority: false,
      southContinuityTruthAuthority: false,
      southRestitutionMeaningAuthority: false,
      culpritDeterminationAuthority: false,
      readyClaimed: false,
      verifiedClaimed: false,
      visualPassClaimed: false,
      finalVisualPassClaimed: false,
      diagnosticPassProvesReady: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      webGPU: false,
      provenCulprit: false,
      recommendedOwnerProvesDefect: false,
      directionProvesCulprit: false,
      directionOnly: true
    });

  var CAPABILITIES =
    Object.freeze({
      diagnosticSequenceAuthority: true,
      stationRegistrationAuthority: true,
      stationDiscoveryAuthority: true,
      handoffAuthority: true,
      cycleInterruptionAuthority: true,
      terminalRailInvocationAuthority: true,
      terminalLedgerConstructionAuthority: true,
      sequenceCoordinateReportingAuthority: true,
      routeCompatibleExecutionAuthority: true,
      losslessReceiptTransportAuthority: true,
      sourceReceiptCustodyAuthority: true,
      transportHashCustodyAuthority: true,

      terminalLedgerInterpretationAuthority: false,
      terminalSynthesisAuthority: false,
      readClassificationAuthority: false,
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
      stationEvidenceInterpretationAuthority: false,
      southContinuityTruthAuthority: false,
      southRestitutionMeaningAuthority: false,
      culpritDeterminationAuthority: false
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
        ],
        role:
          "Establish cycle subject identity, engine identity, construct identity, route identity, mode, and provenance."
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
        role:
          "Observe source-side declarations, construction inputs, file identities, contract identities, model declarations, and declared dependencies."
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
        role:
          "Interpret source-side composition and construction admissibility."
      },
      {
        position: 4,
        fibonacci: "F8",
        news: "SURFACE",
        stationId: "CANVAS_SURFACE_TRUTH",
        file:
          "/assets/audralia/audralia.diagnostic.probe.canvas.surface.truth.js",
        globalNames: [
          "AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
          "AUDRALIA_DIAGNOSTIC_CANVAS_SURFACE_TRUTH",
          "AUDRALIA_DIAGNOSTIC_SURFACE_TRUTH",
          "AUDRALIA.diagnosticCanvasSurfaceTruth",
          "AUDRALIA.diagnosticSurfaceTruth",
          "AUDRALIA.diagnostics.canvasSurfaceTruth",
          "AUDRALIA.diagnostics.surfaceTruth"
        ],
        role:
          "Observe the 3D host and presentation surface. Canvas filename is retained for navigation; Canvas2D is not governing."
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
        role:
          "Observe live 3D runtime, scene, camera, geometry, material, shader, pipeline, render pass, submission, presentation, and interaction evidence."
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
        role:
          "Compare source-side construction claims with live runtime evidence."
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
        role:
          "Inspect packet integrity, provenance continuity, output completeness, and downstream handoff readiness."
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
        role:
          "Interpret construction continuation, restitution location, ownership, and return path."
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
        role:
          "Receive the complete or interrupted terminal ledger and produce NORTH_RETURN terminal diagnostic synthesis."
      }
    ]);

  var AUXILIARY_DEFINITIONS =
    deepFreeze([
      {
        parentPosition: 8,
        role: "SOUTH_SURFACE_POINTER",
        file:
          "/assets/audralia/audralia.diagnostic.south.surface.pointer.js",
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

    var proto = Object.getPrototypeOf(value);

    return proto === Object.prototype || proto === null;
  }

  function hasOwn(owner, key) {
    return Boolean(
      owner &&
      Object.prototype.hasOwnProperty.call(
        owner,
        key
      )
    );
  }

  function deepFreeze(value, seen) {
    if (!value || typeof value !== "object") {
      return value;
    }

    var memory = seen || [];

    if (memory.indexOf(value) !== -1) {
      return value;
    }

    memory.push(value);

    try {
      Object.keys(value).forEach(function freezeKey(key) {
        deepFreeze(
          value[key],
          memory
        );
      });

      Object.freeze(value);
    } catch (_error) {}

    return value;
  }

  function clone(value) {
    return clonePlain(
      value,
      [],
      0
    );
  }

  function clonePlain(value, seen, depth) {
    var memory = seen || [];
    var level = Number(depth) || 0;

    if (level > LIMITS.maxTraversalDepth) {
      return null;
    }

    if (
      value === null ||
      typeof value === "boolean"
    ) {
      return value;
    }

    if (typeof value === "string") {
      return value.slice(
        0,
        LIMITS.maxStringLength
      );
    }

    if (isFiniteNumber(value)) {
      return value;
    }

    if (
      typeof value === "number" ||
      typeof value === "undefined" ||
      typeof value === "function" ||
      typeof value === "symbol" ||
      typeof value === "bigint"
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
        .slice(
          0,
          LIMITS.maxArrayLength
        )
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
          .slice(
            0,
            LIMITS.maxObjectKeys
          );
    } catch (_error) {
      return null;
    }

    keys.forEach(function eachKey(key) {
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
    return stableEncode(value);
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
      return (
        "[" +
        value.map(stableEncode).join(",") +
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
              stableEncode(value[key])
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
        clonePlain(
          value,
          [],
          0
        )
      );

    var h = 0x811c9dc5;

    for (
      var index = 0;
      index < text.length;
      index += 1
    ) {
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
      (
        "00000000" +
        h.toString(16)
      ).slice(-8)
    );
  }

  function hashExcludingFields(value, fields) {
    var copy = clone(value);
    var excluded = Array.isArray(fields) ? fields : [];

    if (isPlainObject(copy)) {
      excluded.forEach(function neutralize(field) {
        if (hasOwn(copy, field)) {
          copy[field] = null;
        }
      });
    }

    return hash(copy);
  }

  function hashStationSourceReceipt(receipt) {
    return hashExcludingFields(
      receipt,
      [
        "receiptHash",
        "sourceReceiptHash",
        "normalizedReceiptHash",
        "conductorTransport",
        "rawStationReceipt"
      ]
    );
  }

  function normalizedReceiptHashPayload(receipt) {
    var payload = clone(receipt);

    if (!isPlainObject(payload)) {
      return payload;
    }

    payload.normalizedReceiptHash = null;

    if (isPlainObject(payload.conductorTransport)) {
      payload.conductorTransport.normalizedReceiptHash = null;
    }

    return payload;
  }

  function hashNormalizedReceipt(receipt) {
    return hash(
      normalizedReceiptHashPayload(
        receipt
      )
    );
  }

  function verifyNormalizedReceiptHash(receipt) {
    if (
      !isPlainObject(receipt) ||
      typeof receipt.normalizedReceiptHash !== "string"
    ) {
      return false;
    }

    return (
      hashNormalizedReceipt(receipt) ===
      receipt.normalizedReceiptHash
    );
  }

  function terminalLedgerHashPayload(ledger) {
    var payload = clone(ledger);

    if (isPlainObject(payload)) {
      payload.terminalLedgerHash = null;
    }

    return payload;
  }

  function hashTerminalLedger(ledger) {
    return hash(
      terminalLedgerHashPayload(
        ledger
      )
    );
  }

  function verifyTerminalLedgerHash(ledger) {
    if (
      !isPlainObject(ledger) ||
      typeof ledger.terminalLedgerHash !== "string"
    ) {
      return false;
    }

    return (
      hashTerminalLedger(ledger) ===
      ledger.terminalLedgerHash
    );
  }

  function issue(code, path, detail) {
    return {
      code: String(code || "ISSUE"),
      path: String(path || "$"),
      detail:
        String(
          detail ||
          code ||
          "ISSUE"
        ).slice(
          0,
          512
        )
    };
  }

  function validatePlainData(value) {
    var issues = [];

    function walk(item, path, depth, seen) {
      if (
        issues.length >=
        LIMITS.maxCycleIssues
      ) {
        return;
      }

      if (
        depth >
        LIMITS.maxTraversalDepth
      ) {
        issues.push(
          issue(
            "PLAIN_DATA_DEPTH_EXCEEDED",
            path
          )
        );

        return;
      }

      if (
        item === null ||
        typeof item === "boolean" ||
        isFiniteNumber(item)
      ) {
        return;
      }

      if (typeof item === "string") {
        if (
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
        typeof item === "undefined" ||
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

      if (!item || typeof item !== "object") {
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

      if (seen.indexOf(item) !== -1) {
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

        item.forEach(function eachArray(entry, arrayIndex) {
          walk(
            entry,
            path +
              "[" +
              arrayIndex +
              "]",
            depth + 1,
            seen.slice()
          );
        });

        return;
      }

      var keys = Object.keys(item);

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

    walk(
      value,
      "$",
      0,
      []
    );

    return deepFreeze({
      passed: issues.length === 0,
      issues: deepFreeze(issues)
    });
  }

  function normalizeString(value, fallback) {
    if (typeof value === "string") {
      return value.slice(
        0,
        LIMITS.maxStringLength
      );
    }

    return fallback === undefined ? null : fallback;
  }

  function normalizeMode(value) {
    if (
      value === MODES.CONSTRUCTION ||
      value === MODES.CALIBRATION ||
      value === MODES.RESTITUTION ||
      value === MODES.AUDIT
    ) {
      return value;
    }

    if (
      value ===
      "READ_REPORTABILITY_EVIDENCE_ADMISSION_DIAGNOSTIC"
    ) {
      return MODES.AUDIT;
    }

    return MODES.AUDIT;
  }

  function readPath(path) {
    var parts =
      String(path || "")
        .split(".")
        .filter(Boolean);

    var cursor = root;

    for (
      var index = 0;
      index < parts.length;
      index += 1
    ) {
      if (
        cursor === null ||
        cursor === undefined ||
        cursor[parts[index]] === null ||
        cursor[parts[index]] === undefined
      ) {
        return null;
      }

      cursor = cursor[parts[index]];
    }

    return cursor;
  }

  function getPositionDefinition(position) {
    for (
      var index = 0;
      index < POSITIONS.length;
      index += 1
    ) {
      if (
        POSITIONS[index].position ===
        Number(position)
      ) {
        return POSITIONS[index];
      }
    }

    return null;
  }

  function isAcceptedRequestSchema(schema) {
    return (
      schema === REQUEST_SCHEMA ||
      schema === ROUTE_REQUEST_SCHEMA ||
      schema === CANONICAL_REQUEST_SCHEMA
    );
  }

  function validateCycleRequest(raw) {
    var issues = [];
    var fatalIssues = [];
    var compatibilityFindings = [];

    var plainValidation =
      validatePlainData(raw);

    if (!plainValidation.passed) {
      fatalIssues =
        fatalIssues.concat(
          plainValidation.issues
        );
    }

    var source =
      isPlainObject(raw)
        ? raw
        : {};

    if (!isPlainObject(raw)) {
      fatalIssues.push(
        issue(
          "REQUEST_OBJECT_REQUIRED",
          "$"
        )
      );
    }

    if (
      source.schema &&
      !isAcceptedRequestSchema(
        source.schema
      )
    ) {
      compatibilityFindings.push(
        issue(
          "REQUEST_SCHEMA_UNRECOGNIZED",
          "$.schema",
          "The request schema is not one of the conductor's recognized request schemas. The request is preserved for F89 terminal compatibility classification."
        )
      );
    }

    if (!isPlainObject(source.subject)) {
      fatalIssues.push(
        issue(
          "REQUEST_SUBJECT_REQUIRED",
          "$.subject"
        )
      );
    }

    if (!isPlainObject(source.construct)) {
      fatalIssues.push(
        issue(
          "REQUEST_CONSTRUCT_REQUIRED",
          "$.construct"
        )
      );
    }

    var requestedStartPosition =
      Number(
        source.requestedStartPosition
      ) || 1;

    if (
      requestedStartPosition < 1 ||
      requestedStartPosition > 9
    ) {
      fatalIssues.push(
        issue(
          "REQUESTED_START_POSITION_OUT_OF_RANGE",
          "$.requestedStartPosition"
        )
      );

      requestedStartPosition = 1;
    }

    var canonicalRequest =
      clone(source) || {};

    canonicalRequest.schema =
      normalizeString(
        source.schema,
        REQUEST_SCHEMA
      );

    canonicalRequest.cycleId =
      normalizeString(
        source.cycleId,
        null
      );

    canonicalRequest.mode =
      normalizeMode(
        source.mode
      );

    canonicalRequest.subject =
      isPlainObject(source.subject)
        ? clone(source.subject)
        : {};

    canonicalRequest.engine =
      isPlainObject(source.engine)
        ? clone(source.engine)
        : {};

    canonicalRequest.construct =
      isPlainObject(source.construct)
        ? clone(source.construct)
        : {};

    canonicalRequest.route =
      isPlainObject(source.route)
        ? clone(source.route)
        : {};

    canonicalRequest.engineFamily =
      isPlainObject(source.engineFamily)
        ? clone(source.engineFamily)
        : {};

    canonicalRequest.target =
      isPlainObject(source.target)
        ? clone(source.target)
        : {};

    canonicalRequest.evidencePolicy =
      isPlainObject(source.evidencePolicy)
        ? clone(source.evidencePolicy)
        : {};

    canonicalRequest.extensions =
      isPlainObject(source.extensions)
        ? clone(source.extensions)
        : {};

    canonicalRequest.requestedStartPosition =
      requestedStartPosition;

    canonicalRequest.generatedAtEnabled =
      source.generatedAtEnabled !== false;

    issues =
      fatalIssues.concat(
        compatibilityFindings
      );

    var compatibilityClass =
      fatalIssues.length
        ? "REQUEST_STRUCTURALLY_INVALID"
        : compatibilityFindings.length
          ? "REQUEST_COMPATIBILITY_LIMITED"
          : "REQUEST_COMPATIBLE";

    return deepFreeze({
      passed: fatalIssues.length === 0,
      fatal: fatalIssues.length > 0,
      recognizedSchema:
        isAcceptedRequestSchema(
          source.schema
        ),
      sourceSchema:
        normalizeString(
          source.schema,
          null
        ),
      compatibilityClass: compatibilityClass,
      canonicalRequest:
        deepFreeze(
          canonicalRequest
        ),
      normalized:
        deepFreeze(
          clone(canonicalRequest)
        ),
      issues:
        deepFreeze(issues),
      fatalIssues:
        deepFreeze(fatalIssues),
      compatibilityFindings:
        deepFreeze(
          compatibilityFindings
        )
    });
  }

  function validateStationDefinition(position, stationApi) {
    var issues = [];
    var def =
      getPositionDefinition(
        position
      );

    if (!def) {
      issues.push(
        issue(
          "UNKNOWN_POSITION",
          "$.position"
        )
      );

      return deepFreeze({
        passed: false,
        issues: deepFreeze(issues)
      });
    }

    if (
      !stationApi ||
      typeof stationApi !== "object"
    ) {
      issues.push(
        issue(
          "STATION_API_REQUIRED",
          "$"
        )
      );

      return deepFreeze({
        passed: false,
        issues: deepFreeze(issues)
      });
    }

    if (
      stationApi.STATION_ID !==
      def.stationId
    ) {
      issues.push(
        issue(
          "STATION_ID_MISMATCH",
          "$.STATION_ID"
        )
      );
    }

    if (
      Number(
        stationApi.CYCLE_POSITION
      ) !==
      Number(position)
    ) {
      issues.push(
        issue(
          "STATION_POSITION_MISMATCH",
          "$.CYCLE_POSITION"
        )
      );
    }

    if (stationApi.FILE !== def.file) {
      issues.push(
        issue(
          "STATION_FILE_MISMATCH",
          "$.FILE"
        )
      );
    }

    if (
      !normalizeString(
        stationApi.CONTRACT,
        ""
      )
    ) {
      issues.push(
        issue(
          "STATION_CONTRACT_REQUIRED",
          "$.CONTRACT"
        )
      );
    }

    if (
      !normalizeString(
        stationApi.VERSION,
        ""
      )
    ) {
      issues.push(
        issue(
          "STATION_VERSION_REQUIRED",
          "$.VERSION"
        )
      );
    }

    if (
      !isFunction(
        stationApi.getDefinitionReceipt
      )
    ) {
      issues.push(
        issue(
          "STATION_DEFINITION_RECEIPT_METHOD_REQUIRED",
          "$.getDefinitionReceipt"
        )
      );
    }

    if (
      !isFunction(
        stationApi.executeCycleStation
      )
    ) {
      issues.push(
        issue(
          "STATION_EXECUTION_METHOD_REQUIRED",
          "$.executeCycleStation"
        )
      );
    }

    return deepFreeze({
      passed: issues.length === 0,
      issues: deepFreeze(issues)
    });
  }

  function validateStationReceipt(
    receipt,
    expectedPosition,
    expectedStationId
  ) {
    var issues = [];
    var plainValidation =
      validatePlainData(receipt);

    if (!plainValidation.passed) {
      issues =
        issues.concat(
          plainValidation.issues
        );
    }

    if (!isPlainObject(receipt)) {
      issues.push(
        issue(
          "STATION_RECEIPT_OBJECT_REQUIRED",
          "$"
        )
      );

      return deepFreeze({
        passed: false,
        issues: deepFreeze(issues)
      });
    }

    if (
      receipt.schema !==
      STATION_SCHEMA
    ) {
      issues.push(
        issue(
          "STATION_RECEIPT_SCHEMA_MISMATCH",
          "$.schema"
        )
      );
    }

    if (
      Number(receipt.position) !==
      Number(expectedPosition)
    ) {
      issues.push(
        issue(
          "STATION_RECEIPT_POSITION_MISMATCH",
          "$.position"
        )
      );
    }

    if (
      receipt.stationId !==
      expectedStationId
    ) {
      issues.push(
        issue(
          "STATION_RECEIPT_ID_MISMATCH",
          "$.stationId"
        )
      );
    }

    if (!STATUSES[receipt.status]) {
      issues.push(
        issue(
          "STATION_RECEIPT_STATUS_INVALID",
          "$.status"
        )
      );
    }

    if (
      receipt.status ===
        STATUSES.PASS &&
      receipt.handoffEligible !== true
    ) {
      issues.push(
        issue(
          "PASS_REQUIRES_HANDOFF_ELIGIBLE",
          "$.handoffEligible"
        )
      );
    }

    if (
      (
        receipt.status ===
          STATUSES.HOLD ||
        receipt.status ===
          STATUSES.FAIL ||
        receipt.status ===
          STATUSES.CONFLICT ||
        receipt.status ===
          STATUSES.ERROR
      ) &&
      receipt.handoffEligible === true
    ) {
      issues.push(
        issue(
          "STOP_STATUS_CANNOT_HANDOFF",
          "$.handoffEligible"
        )
      );
    }

    return deepFreeze({
      passed: issues.length === 0,
      issues: deepFreeze(issues)
    });
  }

  function getExtensionFieldNames(source) {
    if (!isPlainObject(source)) {
      return [];
    }

    return Object.keys(source)
      .filter(function keepExtension(key) {
        return (
          OUTER_RECEIPT_FIELDS.indexOf(key) === -1 &&
          CONDUCTOR_OWNED_RECEIPT_FIELDS.indexOf(key) === -1
        );
      })
      .slice(
        0,
        LIMITS.maxObjectKeys
      );
  }

  function normalizeArrayField(source, field) {
    return Array.isArray(source[field])
      ? clone(source[field])
      : [];
  }

  function normalizeOptionalObject(source, field) {
    return isPlainObject(source[field])
      ? clone(source[field])
      : null;
  }

  function normalizeOptionalArray(source, field) {
    return Array.isArray(source[field])
      ? clone(source[field])
      : [];
  }

  function buildOutputPacketReference(source) {
    if (
      isPlainObject(
        source.outputPacketReference
      )
    ) {
      return clone(
        source.outputPacketReference
      );
    }

    var packet = null;
    var packetType = null;

    if (
      isPlainObject(
        source.runtimeEvidencePacket
      )
    ) {
      packet =
        source.runtimeEvidencePacket;

      packetType =
        RUNTIME_EVIDENCE_PACKET_SCHEMA;
    } else if (
      isPlainObject(
        source.runtimeInterpretationPacket
      )
    ) {
      packet =
        source.runtimeInterpretationPacket;

      packetType =
        RUNTIME_INTERPRETATION_PACKET_SCHEMA;
    } else if (
      isPlainObject(
        source.southHandoffPacket
      )
    ) {
      packet =
        source.southHandoffPacket;

      packetType =
        SOUTH_HANDOFF_PACKET_SCHEMA;
    }

    if (!packet) {
      return null;
    }

    return {
      schema:
        "AUDRALIA_DIAGNOSTIC_OUTPUT_PACKET_REFERENCE_v1",

      packetType:
        normalizeString(
          packet.schema,
          packetType
        ),

      packetHash:
        normalizeString(
          packet.packetHash,
          null
        ) ||
        normalizeString(
          packet.interpretationHash,
          null
        ) ||
        normalizeString(
          packet.handoffHash,
          null
        ) ||
        hash(packet)
    };
  }

  function normalizeStationReceipt(
    receipt,
    def,
    fallbackStatus,
    fallbackSummary
  ) {
    var source =
      isPlainObject(receipt)
        ? clone(receipt)
        : {};

    var rawStationReceipt =
      clone(source);

    var output =
      clone(source) || {};

    var extensionFieldNames =
      getExtensionFieldNames(source);

    var sourcePlainValidation =
      validatePlainData(
        rawStationReceipt
      );

    output.schema =
      source.schema ||
      STATION_SCHEMA;

    output.cycleId =
      source.cycleId ||
      null;

    output.position =
      Number(source.position) ||
      def.position;

    output.cyclePosition =
      Number(source.cyclePosition) ||
      output.position;

    output.stationId =
      source.stationId ||
      def.stationId;

    output.role =
      source.role ||
      output.stationId;

    output.news =
      source.news ||
      def.news ||
      null;

    output.fibonacci =
      source.fibonacci ||
      def.fibonacci ||
      null;

    output.contract =
      source.contract ||
      "UNKNOWN_STATION_CONTRACT";

    output.version =
      source.version ||
      "UNKNOWN";

    output.file =
      source.file ||
      def.file;

    output.status =
      source.status ||
      fallbackStatus ||
      STATUSES.HOLD;

    output.completed =
      source.completed === true;

    output.handoffEligible =
      source.handoffEligible === true;

    output.summary =
      normalizeString(
        source.summary,
        fallbackSummary ||
        "No station summary was supplied."
      );

    output.observations =
      normalizeArrayField(
        source,
        "observations"
      );

    output.evidence =
      normalizeArrayField(
        source,
        "evidence"
      );

    output.issues =
      normalizeArrayField(
        source,
        "issues"
      );

    output.deferredEvidence =
      normalizeOptionalArray(
        source,
        "deferredEvidence"
      );

    output.nonfatalFindings =
      normalizeOptionalArray(
        source,
        "nonfatalFindings"
      );

    output.recognizedGrammars =
      normalizeOptionalArray(
        source,
        "recognizedGrammars"
      );

    output.unrecognizedGrammars =
      normalizeOptionalArray(
        source,
        "unrecognizedGrammars"
      );

    output.evidenceStateCounts =
      normalizeOptionalObject(
        source,
        "evidenceStateCounts"
      );

    output.sharedHandoffEnvelope =
      normalizeOptionalObject(
        source,
        "sharedHandoffEnvelope"
      );

    output.outputPacketReference =
      buildOutputPacketReference(source);

    output.runtimeEvidencePacket =
      normalizeOptionalObject(
        source,
        "runtimeEvidencePacket"
      );

    output.runtimeInterpretationPacket =
      normalizeOptionalObject(
        source,
        "runtimeInterpretationPacket"
      );

    output.southHandoffPacket =
      normalizeOptionalObject(
        source,
        "southHandoffPacket"
      );

    output.firstHeldCoordinate =
      source.firstHeldCoordinate ||
      null;

    output.firstFailedCoordinate =
      source.firstFailedCoordinate ||
      null;

    output.firstConflictCoordinate =
      source.firstConflictCoordinate ||
      null;

    output.recommendedOwner =
      isPlainObject(
        source.recommendedOwner
      )
        ? clone(
            source.recommendedOwner
          )
        : null;

    output.generatedAt =
      source.generatedAt ||
      nowIso();

    output.noClaims =
      isPlainObject(source.noClaims)
        ? clone(source.noClaims)
        : clone(NO_CLAIMS);

    if (
      output.noClaims &&
      typeof output.noClaims === "object"
    ) {
      output.noClaims.provenCulprit =
        false;

      output.noClaims.recommendedOwnerProvesDefect =
        false;

      output.noClaims.directionProvesCulprit =
        false;

      output.noClaims.directionOnly =
        true;

      output.noClaims.diagnosticPassProvesReady =
        false;
    }

    var stationSuppliedReceiptHash =
      normalizeString(
        source.receiptHash,
        null
      );

    var conductorDerivedSourceHash =
      hashStationSourceReceipt(
        rawStationReceipt
      );

    var sourceReceiptHashVerified =
      stationSuppliedReceiptHash
        ? (
            stationSuppliedReceiptHash ===
            conductorDerivedSourceHash
          )
        : null;

    var sourceReceiptHashConflict =
      stationSuppliedReceiptHash
        ? !sourceReceiptHashVerified
        : false;

    output.receiptHash =
      stationSuppliedReceiptHash ||
      conductorDerivedSourceHash;

    output.sourceReceiptHash =
      output.receiptHash;

    output.rawStationReceipt =
      rawStationReceipt;

    output.normalizedReceiptHash =
      null;

    output.conductorTransport = {
      schema:
        TRANSPORT_SCHEMA,

      sourceReceiptPreserved:
        true,

      stationSuppliedReceiptHashPresent:
        Boolean(
          stationSuppliedReceiptHash
        ),

      stationSuppliedReceiptHash:
        stationSuppliedReceiptHash,

      conductorDerivedSourceHash:
        conductorDerivedSourceHash,

      sourceReceiptHash:
        output.sourceReceiptHash,

      sourceReceiptHashVerified:
        sourceReceiptHashVerified,

      sourceReceiptHashConflict:
        sourceReceiptHashConflict,

      normalizedReceiptHash:
        null,

      extensionFieldsPreserved:
        extensionFieldNames.slice(),

      extensionFieldCount:
        extensionFieldNames.length,

      sharedTransportFieldsPresent:
        SHARED_TRANSPORT_FIELDS
          .filter(function fieldPresent(field) {
            return (
              source[field] !==
                undefined &&
              source[field] !==
                null
            );
          }),

      sourceReceiptKeyCount:
        isPlainObject(
          rawStationReceipt
        )
          ? Object.keys(
              rawStationReceipt
            ).length
          : 0,

      normalizedReceiptKeyCount:
        0,

      sourceReceiptPlainDataValid:
        sourcePlainValidation.passed,

      normalizedReceiptPlainDataValid:
        null,

      normalizationApplied:
        true,

      normalizationClass:
        "BOUNDED_OUTER_RECEIPT_REGULARIZATION_WITH_LOSSLESS_EXTENSION_PRESERVATION",

      stationMeaningPreserved:
        true,

      stationMeaningInterpreted:
        false,

      normalizedHashVerificationStoredInReceipt:
        false,

      normalizedHashVerificationAuthority:
        "EXTERNAL_VERIFIER",

      directionOnly:
        true,

      provenCulprit:
        false,

      recommendedOwnerProvesDefect:
        false,

      postHashMutationAuthorized:
        false,

      transportedAt:
        nowIso()
    };

    output.conductorTransport.normalizedReceiptKeyCount =
      Object.keys(output).length;

    output.conductorTransport.normalizedReceiptPlainDataValid =
      validatePlainData(
        output
      ).passed;

    var normalizedReceiptHash =
      hashNormalizedReceipt(
        output
      );

    output.normalizedReceiptHash =
      normalizedReceiptHash;

    output.conductorTransport.normalizedReceiptHash =
      normalizedReceiptHash;

    return deepFreeze(output);
  }

  function makeSyntheticReceipt(
    session,
    def,
    status,
    summary,
    issues
  ) {
    var source = {
      schema:
        STATION_SCHEMA,

      cycleId:
        session.cycleId,

      position:
        def.position,

      cyclePosition:
        def.position,

      stationId:
        def.stationId,

      role:
        def.stationId,

      news:
        def.news ||
        null,

      fibonacci:
        def.fibonacci ||
        null,

      contract:
        CONTRACT,

      version:
        VERSION,

      file:
        def.file ||
        FILE,

      status:
        status,

      completed:
        false,

      handoffEligible:
        false,

      summary:
        summary,

      observations:
        [],

      evidence:
        [],

      issues:
        issues || [],

      deferredEvidence:
        [],

      nonfatalFindings:
        [],

      recognizedGrammars:
        [],

      unrecognizedGrammars:
        [],

      evidenceStateCounts:
        null,

      sharedHandoffEnvelope:
        null,

      outputPacketReference:
        null,

      runtimeEvidencePacket:
        null,

      runtimeInterpretationPacket:
        null,

      southHandoffPacket:
        null,

      firstHeldCoordinate:
        status === STATUSES.HOLD
          ? def.stationId
          : null,

      firstFailedCoordinate:
        status === STATUSES.FAIL
          ? def.stationId
          : null,

      firstConflictCoordinate:
        status === STATUSES.CONFLICT
          ? def.stationId
          : null,

      recommendedOwner: {
        ownerType:
          "DIAGNOSTIC_STATION",

        subjectId:
          def.stationId,

        contract:
          null,

        file:
          def.file ||
          null,

        component:
          def.stationId
      },

      generatedAt:
        nowIso(),

      receiptHash:
        null,

      noClaims:
        clone(NO_CLAIMS)
    };

    source.receiptHash =
      hashStationSourceReceipt(
        source
      );

    return normalizeStationReceipt(
      source,
      def,
      status,
      summary
    );
  }

  function extractRawStationReceipts(receipts) {
    return (
      Array.isArray(receipts)
        ? receipts
        : []
    ).map(function mapReceipt(receipt) {
      return (
        isPlainObject(receipt) &&
        isPlainObject(
          receipt.rawStationReceipt
        )
      )
        ? clone(
            receipt.rawStationReceipt
          )
        : clone(receipt);
    });
  }

  function composeHandoff(
    session,
    fromDef,
    toDef,
    sourceReceipt
  ) {
    return deepFreeze({
      schema:
        HANDOFF_SCHEMA,

      cycleId:
        session.cycleId,

      fromPosition:
        fromDef.position,

      fromStationId:
        fromDef.stationId,

      toPosition:
        toDef.position,

      toStationId:
        toDef.stationId,

      sourceReceiptHash:
        sourceReceipt.sourceReceiptHash ||
        sourceReceipt.receiptHash ||
        null,

      stationReceiptHash:
        sourceReceipt.receiptHash ||
        null,

      conductorDerivedSourceHash:
        sourceReceipt.conductorTransport
          ? sourceReceipt.conductorTransport.conductorDerivedSourceHash
          : null,

      sourceReceiptHashVerified:
        sourceReceipt.conductorTransport
          ? sourceReceipt.conductorTransport.sourceReceiptHashVerified
          : null,

      sourceReceiptHashConflict:
        sourceReceipt.conductorTransport
          ? sourceReceipt.conductorTransport.sourceReceiptHashConflict
          : null,

      normalizedReceiptHash:
        sourceReceipt.normalizedReceiptHash ||
        null,

      normalizedReceiptHashVerified:
        verifyNormalizedReceiptHash(
          sourceReceipt
        ),

      sourceEnvelopeHash:
        sourceReceipt.sharedHandoffEnvelope
          ? normalizeString(
              sourceReceipt.sharedHandoffEnvelope.envelopeHash,
              null
            )
          : null,

      outputPacketHash:
        sourceReceipt.outputPacketReference
          ? normalizeString(
              sourceReceipt.outputPacketReference.packetHash,
              null
            )
          : null,

      ledgerHash:
        hash(
          session.ledger
        ),

      authorizedByConductor:
        true,

      status:
        "AUTHORIZED",

      reasonCode:
        "PREDECESSOR_PASS",

      stationMeaningInterpreted:
        false,

      directionOnly:
        true,

      provenCulprit:
        false,

      generatedAt:
        nowIso()
    });
  }

  function deniedHandoff(
    session,
    fromDef,
    toDef,
    reasonCode,
    sourceReceipt
  ) {
    return deepFreeze({
      schema:
        HANDOFF_SCHEMA,

      cycleId:
        session.cycleId,

      fromPosition:
        fromDef
          ? fromDef.position
          : null,

      fromStationId:
        fromDef
          ? fromDef.stationId
          : null,

      toPosition:
        toDef
          ? toDef.position
          : null,

      toStationId:
        toDef
          ? toDef.stationId
          : null,

      sourceReceiptHash:
        sourceReceipt
          ? (
              sourceReceipt.sourceReceiptHash ||
              sourceReceipt.receiptHash ||
              null
            )
          : null,

      stationReceiptHash:
        sourceReceipt
          ? sourceReceipt.receiptHash || null
          : null,

      conductorDerivedSourceHash:
        sourceReceipt &&
        sourceReceipt.conductorTransport
          ? sourceReceipt.conductorTransport.conductorDerivedSourceHash
          : null,

      sourceReceiptHashVerified:
        sourceReceipt &&
        sourceReceipt.conductorTransport
          ? sourceReceipt.conductorTransport.sourceReceiptHashVerified
          : null,

      sourceReceiptHashConflict:
        sourceReceipt &&
        sourceReceipt.conductorTransport
          ? sourceReceipt.conductorTransport.sourceReceiptHashConflict
          : null,

      normalizedReceiptHash:
        sourceReceipt
          ? sourceReceipt.normalizedReceiptHash || null
          : null,

      normalizedReceiptHashVerified:
        sourceReceipt
          ? verifyNormalizedReceiptHash(
              sourceReceipt
            )
          : false,

      sourceEnvelopeHash:
        sourceReceipt &&
        sourceReceipt.sharedHandoffEnvelope
          ? normalizeString(
              sourceReceipt.sharedHandoffEnvelope.envelopeHash,
              null
            )
          : null,

      outputPacketHash:
        sourceReceipt &&
        sourceReceipt.outputPacketReference
          ? normalizeString(
              sourceReceipt.outputPacketReference.packetHash,
              null
            )
          : null,

      ledgerHash:
        hash(
          session.ledger
        ),

      authorizedByConductor:
        false,

      status:
        "DENIED",

      reasonCode:
        reasonCode ||
        "HANDOFF_DENIED",

      stationMeaningInterpreted:
        false,

      directionOnly:
        true,

      provenCulprit:
        false,

      generatedAt:
        nowIso()
    });
  }

  function composeRestitutionCoordinate(
    session,
    receipt
  ) {
    if (!receipt) {
      return null;
    }

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

    if (!condition) {
      return null;
    }

    var owner =
      isPlainObject(
        receipt.recommendedOwner
      )
        ? receipt.recommendedOwner
        : {};

    return deepFreeze({
      schema:
        RESTITUTION_SCHEMA,

      cycleId:
        session.cycleId,

      position:
        Number(receipt.position) ||
        null,

      stationId:
        normalizeString(
          receipt.stationId,
          null
        ),

      fibonacci:
        normalizeString(
          receipt.fibonacci,
          null
        ),

      news:
        normalizeString(
          receipt.news,
          null
        ),

      condition:
        condition,

      ownerType:
        normalizeString(
          owner.ownerType,
          "UNKNOWN"
        ),

      ownerContract:
        normalizeString(
          owner.contract,
          null
        ),

      ownerFile:
        normalizeString(
          owner.file,
          null
        ),

      ownerComponent:
        normalizeString(
          owner.component,
          null
        ),

      issueIds:
        Array.isArray(receipt.issues)
          ? receipt.issues.map(function mapIssue(entry) {
              return (
                entry &&
                entry.code
              )
                ? entry.code
                : "ISSUE";
            })
          : [],

      sourceReceiptHash:
        receipt.sourceReceiptHash ||
        receipt.receiptHash ||
        null,

      normalizedReceiptHash:
        receipt.normalizedReceiptHash ||
        null,

      authorityClass:
        "SEQUENCE_COORDINATE_REPORTING_ONLY",

      southRestitutionInterpretationDeferredTo:
        "SOUTH_RESTITUTION_INTERPRETATION",

      authorized:
        false,

      directionOnly:
        true,

      provenCulprit:
        false,

      recommendedOwnerProvesDefect:
        false
    });
  }

  function statusFromReceiptStatus(status) {
    if (
      status === STATUSES.PASS ||
      status === STATUSES.NOT_APPLICABLE
    ) {
      return null;
    }

    if (status === STATUSES.HOLD) {
      return CYCLE_STATUSES.HELD;
    }

    if (status === STATUSES.FAIL) {
      return CYCLE_STATUSES.FAILED;
    }

    if (status === STATUSES.CONFLICT) {
      return CYCLE_STATUSES.CONFLICTING;
    }

    return CYCLE_STATUSES.ERROR;
  }

  function markFirst(session, receipt) {
    if (
      receipt.status === STATUSES.HOLD &&
      session.ledger.firstHeldPosition === null
    ) {
      session.ledger.firstHeldPosition =
        receipt.position;
    }

    if (
      receipt.status === STATUSES.FAIL &&
      session.ledger.firstFailedPosition === null
    ) {
      session.ledger.firstFailedPosition =
        receipt.position;
    }

    if (
      receipt.status === STATUSES.CONFLICT &&
      session.ledger.firstConflictPosition === null
    ) {
      session.ledger.firstConflictPosition =
        receipt.position;
    }

    if (
      receipt.status === STATUSES.ERROR &&
      session.ledger.firstErrorPosition === null
    ) {
      session.ledger.firstErrorPosition =
        receipt.position;
    }
  }

  function buildTerminalLedger(
    session,
    interrupted
  ) {
    var terminalDef =
      getPositionDefinition(9);

    var packet = {
      schema:
        TERMINAL_LEDGER_SCHEMA,

      cycleId:
        session.cycleId,

      mode:
        session.request.mode,

      requestedStartPosition:
        session.request.requestedStartPosition,

      actualStartPosition:
        session.request.requestedStartPosition,

      canonicalCycleRequest:
        clone(
          session.request
        ),

      canonicalCycleRequestHash:
        hash(
          session.request
        ),

      requestValidation:
        clone(
          session.requestValidation
        ),

      requestCompatibility:
        clone(
          session.requestCompatibility
        ),

      stationDefinitions:
        clone(POSITIONS),

      registrationOutcomes:
        clone(
          session.ledger.registrationOutcomes
        ),

      auxiliaryRegistrations:
        clone(
          session.ledger.auxiliaryRegistrations
        ),

      stationReceipts:
        clone(
          session.ledger.stationReceipts
        ),

      rawStationReceipts:
        clone(
          session.ledger.rawStationReceipts
        ),

      handoffs:
        clone(
          session.ledger.handoffs
        ),

      deniedHandoffs:
        clone(
          session.ledger.deniedHandoffs
        ),

      auxiliaryReceipts:
        clone(
          session.ledger.auxiliaryReceipts
        ),

      skippedPositions:
        clone(
          session.ledger.skippedPositions
        ),

      firstHeldPosition:
        session.ledger.firstHeldPosition,

      firstFailedPosition:
        session.ledger.firstFailedPosition,

      firstConflictPosition:
        session.ledger.firstConflictPosition,

      firstErrorPosition:
        session.ledger.firstErrorPosition,

      conductorStateBeforeRail: {
        state:
          session.state,

        sealed:
          session.sealed,

        disposed:
          session.disposed,

        runOnce:
          session.runOnce,

        registeredStationCount:
          Object.keys(
            session.registry
          ).length,

        startedAt:
          session.startedAt,

        completedAt:
          session.completedAt
      },

      restitutionCoordinate:
        clone(
          session.ledger.restitutionCoordinate
        ),

      terminalInvocation: {
        position:
          terminalDef.position,

        stationId:
          terminalDef.stationId,

        fibonacci:
          terminalDef.fibonacci,

        news:
          terminalDef.news,

        interrupted:
          Boolean(interrupted),

        invokedByConductor:
          true
      },

      terminalLedgerHash:
        null
    };

    packet.terminalLedgerHash =
      hashTerminalLedger(packet);

    return deepFreeze(packet);
  }

  function composeStationRequest(
    session,
    position,
    terminalMode,
    terminalLedger
  ) {
    var def =
      getPositionDefinition(
        position
      );

    var request = {
      schema:
        STATION_REQUEST_SCHEMA,

      cycleId:
        session.cycleId,

      mode:
        session.request.mode,

      position:
        position,

      stationId:
        def
          ? def.stationId
          : "UNKNOWN",

      subject:
        clone(
          session.request.subject
        ),

      engine:
        clone(
          session.request.engine
        ),

      construct:
        clone(
          session.request.construct
        ),

      route:
        clone(
          session.request.route
        ),

      engineFamily:
        clone(
          session.request.engineFamily
        ),

      target:
        clone(
          session.request.target
        ),

      evidencePolicy:
        clone(
          session.request.evidencePolicy
        ),

      canonicalCycleRequest:
        clone(
          session.request
        ),

      requestValidation:
        clone(
          session.requestValidation
        ),

      requestCompatibility:
        clone(
          session.requestCompatibility
        ),

      priorLedgerHash:
        hash(
          session.ledger
        ),

      priorStationReceipts:
        clone(
          session.ledger.stationReceipts
        ),

      priorRawStationReceipts:
        extractRawStationReceipts(
          session.ledger.stationReceipts
        ),

      parentHandoff:
        session.ledger.handoffs.length
          ? clone(
              session.ledger.handoffs[
                session.ledger.handoffs.length - 1
              ]
            )
          : null,

      auxiliaryEvidence:
        clone(
          session.ledger.auxiliaryReceipts
        ),

      terminalSynthesisMode:
        Boolean(terminalMode),

      limits:
        clone(LIMITS),

      transportPolicy: {
        schema:
          "AUDRALIA_DIAGNOSTIC_CONDUCTOR_TRANSPORT_POLICY_v1",

        outerStationReceiptSchema:
          STATION_SCHEMA,

        terminalLedgerSchema:
          TERMINAL_LEDGER_SCHEMA,

        preserveUnknownPlainExtensions:
          true,

        preserveCanonicalCycleRequest:
          true,

        rawStationReceiptAvailable:
          true,

        sourceAndNormalizedHashesSeparated:
          true,

        normalizedHashVerificationStoredInReceipt:
          false,

        normalizedHashVerificationExternal:
          true,

        terminalLedgerInterpretationOwnedByF89:
          true,

        conductorTerminalInterpretationAuthority:
          false,

        deferredEvidenceControlsContinuation:
          false,

        nonfatalFindingsControlContinuation:
          false,

        stationMeaningInterpretedByConductor:
          false
      },

      noClaims:
        clone(NO_CLAIMS)
    };

    if (
      terminalMode &&
      isPlainObject(terminalLedger)
    ) {
      request.terminalLedger =
        clone(terminalLedger);

      request.terminalLedgerHash =
        terminalLedger.terminalLedgerHash;

      request.terminalLedgerHashVerifiedByConductor =
        verifyTerminalLedgerHash(
          terminalLedger
        );
    }

    return deepFreeze(request);
  }

  function createCycle(rawRequest) {
    var validation =
      validateCycleRequest(
        rawRequest || {}
      );

    var canonicalRequest =
      clone(
        validation.canonicalRequest
      );

    var cycleId =
      canonicalRequest.cycleId ||
      (
        "audralia-nine-cycle-" +
        hash(
          canonicalRequest
        ).replace(
          "fnv1a32:",
          ""
        )
      );

    canonicalRequest.cycleId =
      cycleId;

    var session = {
      cycleId:
        cycleId,

      request:
        deepFreeze(
          canonicalRequest
        ),

      requestValidation:
        deepFreeze({
          passed:
            validation.passed,

          fatal:
            validation.fatal,

          recognizedSchema:
            validation.recognizedSchema,

          sourceSchema:
            validation.sourceSchema,

          issues:
            clone(
              validation.issues
            ),

          fatalIssues:
            clone(
              validation.fatalIssues
            ),

          compatibilityFindings:
            clone(
              validation.compatibilityFindings
            )
        }),

      requestCompatibility:
        deepFreeze({
          class:
            validation.compatibilityClass,

          recognizedSchema:
            validation.recognizedSchema,

          sourceSchema:
            validation.sourceSchema,

          canonicalRequestPreserved:
            true,

          terminalInterpretationDeferredToF89:
            true
        }),

      state:
        validation.fatal
          ? CYCLE_STATUSES.ERROR
          : CYCLE_STATUSES.OPEN,

      initialRequestFatal:
        validation.fatal,

      sealed:
        false,

      disposed:
        false,

      runOnce:
        false,

      registry:
        {},

      auxiliaries:
        {},

      registrationLog:
        [],

      startedAt:
        null,

      completedAt:
        null,

      terminalLedger:
        null,

      ledger: {
        request:
          clone(
            canonicalRequest
          ),

        requestValidation:
          clone(
            validation
          ),

        stationDefinitions:
          clone(POSITIONS),

        registrationOutcomes:
          [],

        auxiliaryRegistrations:
          [],

        stationReceipts:
          [],

        rawStationReceipts:
          [],

        handoffs:
          [],

        deniedHandoffs:
          [],

        auxiliaryReceipts:
          [],

        skippedPositions:
          [],

        issues:
          clone(
            validation.issues
          ),

        terminalRailReceipt:
          null,

        terminalRailRawReceipt:
          null,

        terminalLedgerHash:
          null,

        restitutionCoordinate:
          null,

        firstHeldPosition:
          null,

        firstFailedPosition:
          null,

        firstConflictPosition:
          null,

        firstErrorPosition:
          null
      }
    };

    function freezeRegistration(
      position,
      status,
      reason,
      registrationIssues,
      def
    ) {
      var safeDef =
        def ||
        getPositionDefinition(
          position
        );

      var outcome =
        deepFreeze({
          position:
            Number(position) ||
            null,

          stationId:
            safeDef
              ? safeDef.stationId
              : null,

          status:
            status,

          reason:
            reason,

          issues:
            deepFreeze(
              registrationIssues || []
            ),

          generatedAt:
            nowIso()
        });

      session.registrationLog.push(
        outcome
      );

      session.ledger.registrationOutcomes.push(
        outcome
      );

      return outcome;
    }

    function registerStation(position, stationApi) {
      if (
        session.disposed ||
        session.sealed ||
        session.runOnce
      ) {
        return freezeRegistration(
          position,
          "REJECTED",
          "SESSION_NOT_OPEN"
        );
      }

      var def =
        getPositionDefinition(
          position
        );

      var validationResult =
        validateStationDefinition(
          position,
          stationApi
        );

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
        if (
          session.registry[position] ===
          stationApi
        ) {
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

      session.registry[position] =
        stationApi;

      return freezeRegistration(
        position,
        "REGISTERED",
        "STATION_REGISTERED",
        [],
        def
      );
    }

    function registerAuxiliary(
      parentPosition,
      descriptor
    ) {
      if (
        session.disposed ||
        session.sealed ||
        session.runOnce
      ) {
        return deepFreeze({
          parentPosition:
            parentPosition,

          status:
            "REJECTED",

          reason:
            "SESSION_NOT_OPEN"
        });
      }

      if (
        !getPositionDefinition(
          parentPosition
        )
      ) {
        return deepFreeze({
          parentPosition:
            parentPosition,

          status:
            "REJECTED",

          reason:
            "PARENT_POSITION_UNKNOWN"
        });
      }

      var list =
        session.auxiliaries[
          parentPosition
        ] || [];

      if (
        list.length >=
        LIMITS.maxAuxiliariesPerStation
      ) {
        return deepFreeze({
          parentPosition:
            parentPosition,

          status:
            "REJECTED",

          reason:
            "AUXILIARY_LIMIT_REACHED"
        });
      }

      var record =
        deepFreeze({
          parentPosition:
            parentPosition,

          descriptor:
            clone(
              descriptor || {}
            ),

          status:
            "REGISTERED",

          createsCyclePosition:
            false,

          generatedAt:
            nowIso()
        });

      list.push(record);

      session.auxiliaries[parentPosition] =
        list;

      session.ledger.auxiliaryRegistrations.push(
        record
      );

      return record;
    }

    function seal() {
      if (
        session.disposed ||
        session.sealed
      ) {
        return getReceipt();
      }

      session.sealed = true;

      session.state =
        session.initialRequestFatal
          ? CYCLE_STATUSES.ERROR
          : CYCLE_STATUSES.SEALED;

      return getReceipt();
    }

    function executeStation(
      position,
      terminalMode,
      terminalLedger
    ) {
      var def =
        getPositionDefinition(
          position
        );

      var api =
        session.registry[position];

      if (!def || !api) {
        var missing =
          makeSyntheticReceipt(
            session,
            def || {
              position:
                position,

              stationId:
                "UNKNOWN",

              fibonacci:
                null,

              news:
                null,

              file:
                null
            },
            STATUSES.HOLD,
            "Station is not registered with the North conductor.",
            [
              issue(
                "STATION_NOT_REGISTERED",
                def
                  ? def.stationId
                  : "UNKNOWN",
                "No compatible station API was discovered or registered for this cycle position."
              )
            ]
          );

        session.ledger.stationReceipts.push(
          missing
        );

        session.ledger.rawStationReceipts.push(
          clone(
            missing.rawStationReceipt
          )
        );

        markFirst(
          session,
          missing
        );

        return missing;
      }

      try {
        var stationRequest =
          composeStationRequest(
            session,
            position,
            terminalMode,
            terminalLedger
          );

        var sourceReceipt =
          api.executeCycleStation(
            stationRequest
          );

        var receiptValidation =
          validateStationReceipt(
            sourceReceipt,
            position,
            def.stationId
          );

        var normalizedReceipt;

        if (!receiptValidation.passed) {
          normalizedReceipt =
            makeSyntheticReceipt(
              session,
              def,
              STATUSES.ERROR,
              "Station returned an invalid receipt.",
              receiptValidation.issues
            );
        } else {
          var cycleBoundSource =
            clone(sourceReceipt);

          if (!cycleBoundSource.cycleId) {
            cycleBoundSource.cycleId =
              session.cycleId;
          }

          normalizedReceipt =
            normalizeStationReceipt(
              cycleBoundSource,
              def,
              STATUSES.HOLD,
              "Station receipt normalized by North conductor."
            );
        }

        session.ledger.stationReceipts.push(
          normalizedReceipt
        );

        session.ledger.rawStationReceipts.push(
          clone(
            normalizedReceipt.rawStationReceipt
          )
        );

        markFirst(
          session,
          normalizedReceipt
        );

        return normalizedReceipt;
      } catch (error) {
        var synthetic =
          makeSyntheticReceipt(
            session,
            def,
            STATUSES.ERROR,
            "Station threw during diagnostic execution.",
            [
              issue(
                "STATION_EXECUTION_THROW",
                def.stationId,
                error &&
                error.message
                  ? error.message
                  : String(error)
              )
            ]
          );

        session.ledger.stationReceipts.push(
          synthetic
        );

        session.ledger.rawStationReceipts.push(
          clone(
            synthetic.rawStationReceipt
          )
        );

        markFirst(
          session,
          synthetic
        );

        return synthetic;
      }
    }

    function run() {
      if (
        session.disposed ||
        session.runOnce
      ) {
        return getReceipt();
      }

      if (!session.sealed) {
        seal();
      }

      session.runOnce = true;
      session.startedAt = nowIso();

      var stopped =
        Boolean(
          session.initialRequestFatal
        );

      if (!stopped) {
        session.state =
          CYCLE_STATUSES.RUNNING;
      }

      for (
        var position =
          session.request.requestedStartPosition;
        position <= 8;
        position += 1
      ) {
        if (stopped) {
          session.ledger.skippedPositions.push(
            getPositionDefinition(
              position
            )
          );

          continue;
        }

        var receipt =
          executeStation(
            position,
            false,
            null
          );

        var def =
          getPositionDefinition(
            position
          );

        var nextDef =
          getPositionDefinition(
            position + 1
          );

        if (
          receipt.status ===
            STATUSES.PASS ||
          receipt.status ===
            STATUSES.NOT_APPLICABLE
        ) {
          if (nextDef) {
            session.ledger.handoffs.push(
              composeHandoff(
                session,
                def,
                nextDef,
                receipt
              )
            );
          }
        } else {
          stopped = true;

          session.state =
            statusFromReceiptStatus(
              receipt.status
            );

          session.ledger.restitutionCoordinate =
            composeRestitutionCoordinate(
              session,
              receipt
            );

          if (nextDef) {
            session.ledger.deniedHandoffs.push(
              deniedHandoff(
                session,
                def,
                nextDef,
                receipt.status,
                receipt
              )
            );
          }
        }
      }

      session.terminalLedger =
        buildTerminalLedger(
          session,
          stopped
        );

      session.ledger.terminalLedgerHash =
        session.terminalLedger.terminalLedgerHash;

      var railReceipt =
        executeStation(
          9,
          true,
          session.terminalLedger
        );

      session.ledger.terminalRailReceipt =
        clone(railReceipt);

      session.ledger.terminalRailRawReceipt =
        clone(
          railReceipt.rawStationReceipt ||
          railReceipt
        );

      if (!stopped) {
        if (
          railReceipt.status ===
          STATUSES.PASS
        ) {
          session.state =
            CYCLE_STATUSES.COMPLETE;
        } else {
          session.state =
            statusFromReceiptStatus(
              railReceipt.status
            );

          session.ledger.restitutionCoordinate =
            composeRestitutionCoordinate(
              session,
              railReceipt
            );
        }
      }

      session.completedAt =
        nowIso();

      return getReceipt();
    }

    function getLedger() {
      var ledger =
        clone(
          session.ledger
        );

      ledger.ledgerHash = null;

      ledger.ledgerHash =
        hashExcludingFields(
          ledger,
          [
            "ledgerHash"
          ]
        );

      return deepFreeze(ledger);
    }

    function getSummary() {
      var receipt =
        getReceipt();

      return deepFreeze({
        cycleId:
          receipt.cycleId,

        mode:
          receipt.mode,

        status:
          receipt.status,

        executedStationCount:
          receipt.executedStationCount,

        firstHeldPosition:
          receipt.firstHeldPosition,

        firstFailedPosition:
          receipt.firstFailedPosition,

        firstConflictPosition:
          receipt.firstConflictPosition,

        firstErrorPosition:
          receipt.firstErrorPosition,

        terminalRailInvoked:
          receipt.terminalRailInvoked,

        terminalLedgerConstructed:
          Boolean(
            receipt.terminalLedgerHash
          ),

        terminalLedgerHash:
          receipt.terminalLedgerHash,

        terminalLedgerHashVerified:
          session.terminalLedger
            ? verifyTerminalLedgerHash(
                session.terminalLedger
              )
            : false,

        normalizedReceiptHashesVerifiedExternally:
          receipt.stationReceipts.every(
            function verifyReceipt(entry) {
              return verifyNormalizedReceiptHash(
                entry
              );
            }
          ),

        restitutionCoordinate:
          clone(
            receipt.restitutionCoordinate
          ),

        noClaims:
          clone(NO_CLAIMS)
      });
    }

    function getReceipt() {
      var stationReceipts =
        session.ledger.stationReceipts || [];

      var rawStationReceipts =
        session.ledger.rawStationReceipts || [];

      var packet = {
        schema:
          CYCLE_SCHEMA,

        contract:
          CONTRACT,

        previousContract:
          PREVIOUS_CONTRACT,

        priorContract:
          PRIOR_CONTRACT,

        earlierContract:
          EARLIER_CONTRACT,

        legacyContract:
          LEGACY_CONTRACT,

        version:
          VERSION,

        file:
          FILE,

        cycleId:
          session.cycleId,

        mode:
          session.request.mode,

        status:
          session.state,

        startedAt:
          session.startedAt,

        completedAt:
          session.completedAt,

        requestedStartPosition:
          session.request.requestedStartPosition,

        actualStartPosition:
          session.request.requestedStartPosition,

        stationCount:
          9,

        registeredStationCount:
          Object.keys(
            session.registry
          ).length,

        executedStationCount:
          stationReceipts.length,

        passedStationCount:
          stationReceipts.filter(function count(receipt) {
            return receipt.status === STATUSES.PASS;
          }).length,

        heldStationCount:
          stationReceipts.filter(function count(receipt) {
            return receipt.status === STATUSES.HOLD;
          }).length,

        failedStationCount:
          stationReceipts.filter(function count(receipt) {
            return receipt.status === STATUSES.FAIL;
          }).length,

        conflictStationCount:
          stationReceipts.filter(function count(receipt) {
            return receipt.status === STATUSES.CONFLICT;
          }).length,

        errorStationCount:
          stationReceipts.filter(function count(receipt) {
            return receipt.status === STATUSES.ERROR;
          }).length,

        skippedStationCount:
          session.ledger.skippedPositions.length,

        canonicalCycleRequest:
          clone(
            session.request
          ),

        requestValidation:
          clone(
            session.requestValidation
          ),

        requestCompatibility:
          clone(
            session.requestCompatibility
          ),

        stationReceipts:
          clone(
            stationReceipts
          ),

        receipts:
          clone(
            stationReceipts
          ),

        rawStationReceipts:
          clone(
            rawStationReceipts
          ),

        handoffs:
          clone(
            session.ledger.handoffs
          ),

        deniedHandoffs:
          clone(
            session.ledger.deniedHandoffs
          ),

        auxiliaryReceipts:
          clone(
            session.ledger.auxiliaryReceipts
          ),

        registrationOutcomes:
          clone(
            session.ledger.registrationOutcomes
          ),

        auxiliaryRegistrations:
          clone(
            session.ledger.auxiliaryRegistrations
          ),

        skippedPositions:
          clone(
            session.ledger.skippedPositions
          ),

        firstHeldPosition:
          session.ledger.firstHeldPosition,

        firstFailedPosition:
          session.ledger.firstFailedPosition,

        firstConflictPosition:
          session.ledger.firstConflictPosition,

        firstErrorPosition:
          session.ledger.firstErrorPosition,

        terminalRailInvoked:
          stationReceipts.some(function find(receipt) {
            return receipt.position === 9;
          }),

        terminalRailReceipt:
          clone(
            session.ledger.terminalRailReceipt
          ),

        terminalRailRawReceipt:
          clone(
            session.ledger.terminalRailRawReceipt
          ),

        terminalLedgerSchema:
          TERMINAL_LEDGER_SCHEMA,

        terminalLedgerHash:
          session.terminalLedger
            ? session.terminalLedger.terminalLedgerHash
            : null,

        terminalLedgerHashVerified:
          session.terminalLedger
            ? verifyTerminalLedgerHash(
                session.terminalLedger
              )
            : false,

        normalizedReceiptHashesVerifiedExternally:
          stationReceipts.every(
            function verifyReceipt(entry) {
              return verifyNormalizedReceiptHash(
                entry
              );
            }
          ),

        restitutionCoordinate:
          clone(
            session.ledger.restitutionCoordinate
          ),

        inputHash:
          hash(
            session.request
          ),

        ledgerHash:
          hash(
            session.ledger
          ),

        cycleHash:
          null,

        transportSummary: {
          schema:
            "AUDRALIA_DIAGNOSTIC_CONDUCTOR_TERMINAL_LEDGER_TRANSPORT_SUMMARY_v1",

          canonicalRequestPreserved:
            true,

          requestValidationPreserved:
            true,

          requestCompatibilityPreserved:
            true,

          losslessStationReceiptTransport:
            true,

          rawStationReceiptCustody:
            true,

          sourceAndNormalizedHashesSeparated:
            true,

          sourceHashComparisonPublished:
            true,

          normalizedHashVerificationStoredInReceipt:
            false,

          normalizedHashVerificationExternal:
            true,

          noPostHashReceiptMutation:
            true,

          terminalLedgerConstructedForF89:
            Boolean(
              session.terminalLedger
            ),

          terminalLedgerEmbeddedInF89Request:
            Boolean(
              session.terminalLedger
            ),

          terminalLedgerEmbeddedInF89Receipt:
            false,

          terminalLedgerInterpretationOwnedByF89:
            true,

          conductorTerminalInterpretationAuthority:
            false,

          conductorOccupiesFibonacciPosition:
            false,

          conductorCreatesTenthStation:
            false,

          newsAuthority:
            "AUXILIARY_NORTH_SEQUENCE_AUTHORITY"
        },

        noClaims:
          clone(NO_CLAIMS)
      };

      packet.cycleHash =
        hashExcludingFields(
          {
            schema:
              packet.schema,

            contract:
              packet.contract,

            version:
              packet.version,

            cycleId:
              packet.cycleId,

            mode:
              packet.mode,

            status:
              packet.status,

            stationCount:
              packet.stationCount,

            stationReceipts:
              packet.stationReceipts,

            handoffs:
              packet.handoffs,

            deniedHandoffs:
              packet.deniedHandoffs,

            terminalLedgerHash:
              packet.terminalLedgerHash,

            terminalRailReceipt:
              packet.terminalRailReceipt,

            restitutionCoordinate:
              packet.restitutionCoordinate,

            cycleHash:
              null
          },
          [
            "cycleHash"
          ]
        );

      return deepFreeze(packet);
    }

    function getState() {
      return deepFreeze({
        cycleId:
          session.cycleId,

        state:
          session.state,

        sealed:
          session.sealed,

        disposed:
          session.disposed,

        runOnce:
          session.runOnce,

        registeredStationCount:
          Object.keys(
            session.registry
          ).length,

        startedAt:
          session.startedAt,

        completedAt:
          session.completedAt,

        terminalLedgerConstructed:
          Boolean(
            session.terminalLedger
          ),

        terminalLedgerHash:
          session.terminalLedger
            ? session.terminalLedger.terminalLedgerHash
            : null,

        terminalLedgerHashVerified:
          session.terminalLedger
            ? verifyTerminalLedgerHash(
                session.terminalLedger
              )
            : false,

        normalizedReceiptHashVerificationMode:
          "EXTERNAL"
      });
    }

    function dispose() {
      session.registry = {};
      session.auxiliaries = {};
      session.terminalLedger = null;
      session.disposed = true;
      session.state =
        CYCLE_STATUSES.DISPOSED;

      return getState();
    }

    return deepFreeze({
      registerStation:
        registerStation,

      registerAuxiliary:
        registerAuxiliary,

      seal:
        seal,

      run:
        run,

      getReceipt:
        getReceipt,

      getSummary:
        getSummary,

      getLedger:
        getLedger,

      getState:
        getState,

      dispose:
        dispose
    });
  }

  function resolveStationCandidate(def) {
    if (
      !def ||
      !Array.isArray(def.globalNames)
    ) {
      return null;
    }

    for (
      var index = 0;
      index < def.globalNames.length;
      index += 1
    ) {
      var candidate =
        readPath(
          def.globalNames[index]
        );

      if (
        candidate &&
        typeof candidate === "object" &&
        isFunction(
          candidate.executeCycleStation
        )
      ) {
        return {
          api:
            candidate,

          globalName:
            def.globalNames[index],

          discovered:
            true
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
          position:
            def.position,

          stationId:
            def.stationId,

          file:
            def.file,

          discovered:
            Boolean(found),

          globalName:
            found
              ? found.globalName
              : null,

          api:
            found
              ? found.api
              : null
        };
      })
    );
  }

  function discoverAuxiliaries() {
    return deepFreeze(
      AUXILIARY_DEFINITIONS.map(function mapAuxiliary(def) {
        var found = null;

        if (Array.isArray(def.globalNames)) {
          for (
            var index = 0;
            index < def.globalNames.length;
            index += 1
          ) {
            var candidate =
              readPath(
                def.globalNames[index]
              );

            if (
              candidate &&
              typeof candidate === "object"
            ) {
              found = {
                api:
                  candidate,

                globalName:
                  def.globalNames[index]
              };

              break;
            }
          }
        }

        return {
          parentPosition:
            def.parentPosition,

          role:
            def.role,

          file:
            def.file,

          createsCyclePosition:
            false,

          discovered:
            Boolean(found),

          globalName:
            found
              ? found.globalName
              : null,

          api:
            found
              ? found.api
              : null
        };
      })
    );
  }

  function runRegisteredCycle(
    rawRequest,
    options
  ) {
    var settings =
      isPlainObject(options)
        ? options
        : {};

    var cycle =
      createCycle(
        rawRequest || {}
      );

    var stationDiscovery =
      discoverStations();

    var auxiliaryDiscovery =
      discoverAuxiliaries();

    stationDiscovery.forEach(function registerDiscovered(record) {
      if (
        record.discovered &&
        record.api
      ) {
        cycle.registerStation(
          record.position,
          record.api
        );
      }
    });

    auxiliaryDiscovery.forEach(function registerDiscoveredAuxiliary(record) {
      if (
        record.discovered &&
        record.api
      ) {
        cycle.registerAuxiliary(
          record.parentPosition,
          {
            role:
              record.role,

            file:
              record.file,

            globalName:
              record.globalName,

            apiContract:
              record.api.CONTRACT ||
              null,

            apiVersion:
              record.api.VERSION ||
              null
          }
        );
      }
    });

    if (
      Array.isArray(
        settings.extraStations
      )
    ) {
      settings.extraStations.forEach(function registerExtra(entry) {
        if (
          entry &&
          entry.position &&
          entry.api
        ) {
          cycle.registerStation(
            Number(entry.position),
            entry.api
          );
        }
      });
    }

    if (
      Array.isArray(
        settings.extraAuxiliaries
      )
    ) {
      settings.extraAuxiliaries.forEach(function registerExtraAuxiliary(entry) {
        if (
          entry &&
          entry.parentPosition
        ) {
          cycle.registerAuxiliary(
            Number(
              entry.parentPosition
            ),
            entry.descriptor ||
            entry
          );
        }
      });
    }

    cycle.seal();

    var packet =
      cycle.run();

    var ledger =
      cycle.getLedger();

    var summary =
      cycle.getSummary();

    return deepFreeze({
      schema:
        "AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_ROUTE_RESULT_v3_2_1",

      contract:
        CONTRACT,

      previousContract:
        PREVIOUS_CONTRACT,

      priorContract:
        PRIOR_CONTRACT,

      earlierContract:
        EARLIER_CONTRACT,

      legacyContract:
        LEGACY_CONTRACT,

      version:
        VERSION,

      file:
        FILE,

      cycleId:
        packet.cycleId,

      status:
        packet.status,

      packet:
        clone(packet),

      ledger:
        clone(ledger),

      summary:
        clone(summary),

      stationDiscovery:
        clone(
          stationDiscovery.map(function stripApi(entry) {
            return {
              position:
                entry.position,

              stationId:
                entry.stationId,

              file:
                entry.file,

              discovered:
                entry.discovered,

              globalName:
                entry.globalName
            };
          })
        ),

      auxiliaryDiscovery:
        clone(
          auxiliaryDiscovery.map(function stripApi(entry) {
            return {
              parentPosition:
                entry.parentPosition,

              role:
                entry.role,

              file:
                entry.file,

              discovered:
                entry.discovered,

              globalName:
                entry.globalName,

              createsCyclePosition:
                false
            };
          })
        ),

      receipts:
        clone(
          packet.stationReceipts ||
          []
        ),

      stationReceipts:
        clone(
          packet.stationReceipts ||
          []
        ),

      rawStationReceipts:
        clone(
          packet.rawStationReceipts ||
          []
        ),

      terminalRailReceipt:
        clone(
          packet.terminalRailReceipt
        ),

      terminalRailRawReceipt:
        clone(
          packet.terminalRailRawReceipt
        ),

      terminalLedgerHash:
        packet.terminalLedgerHash,

      terminalLedgerHashVerified:
        packet.terminalLedgerHashVerified,

      normalizedReceiptHashesVerifiedExternally:
        packet.normalizedReceiptHashesVerifiedExternally,

      restitutionCoordinate:
        clone(
          packet.restitutionCoordinate
        ),

      transportSummary:
        clone(
          packet.transportSummary
        ),

      noClaims:
        clone(NO_CLAIMS),

      generatedAt:
        nowIso(),

      resultHash:
        hash(packet)
    });
  }

  function executeCycle(request) {
    return runRegisteredCycle(
      request || {}
    );
  }

  function executeDiagnosticCycle(request) {
    return runRegisteredCycle(
      request || {}
    );
  }

  function executeNineCycle(request) {
    return runRegisteredCycle(
      request || {}
    );
  }

  function runNineCycle(request) {
    return runRegisteredCycle(
      request || {}
    );
  }

  function conduct(request) {
    return runRegisteredCycle(
      request || {}
    );
  }

  function run(request) {
    return runRegisteredCycle(
      request || {}
    );
  }

  function validateCyclePacket(packet) {
    var issues = [];
    var plainValidation =
      validatePlainData(packet);

    if (!plainValidation.passed) {
      issues =
        issues.concat(
          plainValidation.issues
        );
    }

    if (!isPlainObject(packet)) {
      issues.push(
        issue(
          "CYCLE_PACKET_OBJECT_REQUIRED",
          "$"
        )
      );
    } else {
      if (
        packet.schema !==
        CYCLE_SCHEMA
      ) {
        issues.push(
          issue(
            "CYCLE_SCHEMA_MISMATCH",
            "$.schema"
          )
        );
      }

      if (
        packet.contract !== CONTRACT &&
        packet.contract !== PREVIOUS_CONTRACT &&
        packet.contract !== PRIOR_CONTRACT &&
        packet.contract !== EARLIER_CONTRACT &&
        packet.contract !== LEGACY_CONTRACT
      ) {
        issues.push(
          issue(
            "CYCLE_CONTRACT_MISMATCH",
            "$.contract"
          )
        );
      }

      if (
        packet.stationCount !==
        9
      ) {
        issues.push(
          issue(
            "CYCLE_STATION_COUNT_MISMATCH",
            "$.stationCount"
          )
        );
      }
    }

    return deepFreeze({
      passed:
        issues.length === 0,

      issues:
        deepFreeze(issues)
    });
  }

  function getContractDefinition() {
    return deepFreeze({
      contract:
        CONTRACT,

      previousContract:
        PREVIOUS_CONTRACT,

      priorContract:
        PRIOR_CONTRACT,

      earlierContract:
        EARLIER_CONTRACT,

      legacyContract:
        LEGACY_CONTRACT,

      version:
        VERSION,

      versionLabel:
        VERSION_LABEL,

      file:
        FILE,

      definitionReceipt:
        DEFINITION_RECEIPT,

      installationReceipt:
        INSTALLATION_RECEIPT,

      cycleSchema:
        CYCLE_SCHEMA,

      requestSchema:
        REQUEST_SCHEMA,

      routeRequestSchema:
        ROUTE_REQUEST_SCHEMA,

      canonicalRequestSchema:
        CANONICAL_REQUEST_SCHEMA,

      stationRequestSchema:
        STATION_REQUEST_SCHEMA,

      stationSchema:
        STATION_SCHEMA,

      handoffSchema:
        HANDOFF_SCHEMA,

      restitutionSchema:
        RESTITUTION_SCHEMA,

      terminalLedgerSchema:
        TERMINAL_LEDGER_SCHEMA,

      transportSchema:
        TRANSPORT_SCHEMA,

      sharedHandoffEnvelopeSchema:
        SHARED_HANDOFF_ENVELOPE_SCHEMA,

      runtimeEvidencePacketSchema:
        RUNTIME_EVIDENCE_PACKET_SCHEMA,

      runtimeInterpretationPacketSchema:
        RUNTIME_INTERPRETATION_PACKET_SCHEMA,

      southHandoffPacketSchema:
        SOUTH_HANDOFF_PACKET_SCHEMA,

      hashLabel:
        HASH_LABEL,

      newsSequence: [
        "NORTH",
        "EAST",
        "SURFACE",
        "WEST",
        "SOUTH",
        "NORTH_RETURN"
      ],

      conductorNewsAuthority:
        "AUXILIARY_NORTH_SEQUENCE_AUTHORITY",

      conductorOccupiesCyclePosition:
        false,

      conductorCreatesTenthStation:
        false,

      railTerminalSynthesisIsNorthReturn:
        true,

      terminalLedgerConstructedOnlyForF89:
        true,

      terminalLedgerInterpretationOwnedByF89:
        true,

      conductorTerminalInterpretationAuthority:
        false,

      canonicalRequestPreserved:
        true,

      requestValidationPreserved:
        true,

      requestCompatibilityPreserved:
        true,

      sourceHashComparisonPublished:
        true,

      normalizedHashVerificationStoredInReceipt:
        false,

      normalizedHashVerificationExternal:
        true,

      noPostHashReceiptMutation:
        true,

      fibonacciMapIsDiagnosticSequenceOnly:
        true,

      fibonacciMapIsNotEngineReadiness:
        true,

      fibonacciMapIsNotContractAuthority:
        true,

      fibonacciMapDoesNotCreateNewFScale:
        true,

      stationReceiptOuterSchemaRemainsCanonical:
        true,

      sharedSchemasAreNestedPayloads:
        true,

      unknownPlainExtensionFieldsPreserved:
        true,

      rawStationReceiptCustody:
        true,

      sourceAndNormalizedHashesSeparated:
        true,

      routeCompatibleExecutionMethods: [
        "executeNineCycle",
        "runNineCycle",
        "executeDiagnosticCycle",
        "executeCycle",
        "conduct",
        "run"
      ],

      positions:
        POSITIONS,

      auxiliaryDefinitions:
        AUXILIARY_DEFINITIONS,

      sharedTransportFields:
        SHARED_TRANSPORT_FIELDS,

      limits:
        LIMITS,

      capabilities:
        CAPABILITIES,

      noClaims:
        NO_CLAIMS
    });
  }

  function getDefinitionValidation() {
    var issues = [];
    var seenPositions = {};
    var seenStations = {};

    if (POSITIONS.length !== 9) {
      issues.push(
        issue(
          "POSITION_COUNT_NOT_NINE",
          "$.POSITIONS"
        )
      );
    }

    POSITIONS.forEach(function eachPosition(position) {
      if (
        seenPositions[position.position]
      ) {
        issues.push(
          issue(
            "DUPLICATE_POSITION",
            "$.POSITIONS"
          )
        );
      }

      if (
        seenStations[position.stationId]
      ) {
        issues.push(
          issue(
            "DUPLICATE_STATION",
            "$.POSITIONS"
          )
        );
      }

      if (
        !Array.isArray(position.globalNames) ||
        !position.globalNames.length
      ) {
        issues.push(
          issue(
            "POSITION_GLOBAL_DISCOVERY_NAMES_MISSING",
            position.stationId
          )
        );
      }

      seenPositions[position.position] =
        true;

      seenStations[position.stationId] =
        true;
    });

    if (
      POSITIONS[8].position !== 9 ||
      POSITIONS[8].fibonacci !== "F89" ||
      POSITIONS[8].news !== "NORTH_RETURN" ||
      POSITIONS[8].stationId !== "RAIL_TERMINAL_SYNTHESIS"
    ) {
      issues.push(
        issue(
          "POSITION_9_TERMINAL_RAIL_IDENTITY_MISMATCH",
          "$.POSITIONS[8]"
        )
      );
    }

    return deepFreeze({
      schema:
        "AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_DEFINITION_VALIDATION_v3_2_1",

      passed:
        issues.length === 0,

      issueCount:
        issues.length,

      issues:
        deepFreeze(issues),

      checkCount:
        18,

      generatedAt:
        nowIso()
    });
  }

  function getDefinitionReceipt() {
    var validation =
      getDefinitionValidation();

    return deepFreeze({
      receipt:
        DEFINITION_RECEIPT,

      contract:
        CONTRACT,

      previousContract:
        PREVIOUS_CONTRACT,

      priorContract:
        PRIOR_CONTRACT,

      earlierContract:
        EARLIER_CONTRACT,

      legacyContract:
        LEGACY_CONTRACT,

      version:
        VERSION,

      file:
        FILE,

      validationPassed:
        validation.passed,

      stationCount:
        POSITIONS.length,

      nineCycleAuthority:
        true,

      diagnosticSequenceAuthority:
        true,

      routeCompatibleExecutionAuthority:
        true,

      stationDiscoveryAuthority:
        true,

      losslessReceiptTransportAuthority:
        true,

      sourceReceiptCustodyAuthority:
        true,

      transportHashCustodyAuthority:
        true,

      terminalLedgerConstructionAuthority:
        true,

      terminalLedgerInterpretationAuthority:
        false,

      terminalSynthesisAuthority:
        false,

      f89TerminalSynthesisAuthorityPreserved:
        true,

      canonicalRequestPreserved:
        true,

      requestValidationPreserved:
        true,

      requestCompatibilityPreserved:
        true,

      sourceHashComparisonPublished:
        true,

      normalizedHashVerificationStoredInReceipt:
        false,

      normalizedHashVerificationExternal:
        true,

      noPostHashReceiptMutation:
        true,

      terminalLedgerConstructedOnlyForF89:
        true,

      terminalLedgerExcludedFromStationReceipts:
        true,

      conductorOccupiesCyclePosition:
        false,

      conductorCreatesTenthStation:
        false,

      railTerminalSynthesisIsNorthReturn:
        true,

      outerStationReceiptSchemaPreserved:
        true,

      sharedSchemasNested:
        true,

      legacyStationReceiptCompatible:
        true,

      generatedAt:
        nowIso(),

      validation:
        validation,

      definitionHash:
        hash(
          getContractDefinition()
        ),

      noClaims:
        NO_CLAIMS
    });
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

    rollbackComplete:
      true,

    installedAt:
      nowIso()
  };

  function getInstallationReceipt() {
    return deepFreeze({
      receipt:
        INSTALLATION_RECEIPT,

      contract:
        CONTRACT,

      previousContract:
        PREVIOUS_CONTRACT,

      priorContract:
        PRIOR_CONTRACT,

      earlierContract:
        EARLIER_CONTRACT,

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
        clone(
          INSTALLATION.published
        ),

      warnings:
        clone(
          INSTALLATION.warnings
        ),

      errors:
        clone(
          INSTALLATION.errors
        ),

      rollbackComplete:
        INSTALLATION.rollbackComplete,

      terminalLedgerTransportInstalled:
        INSTALLATION.decision ===
          "NEW_INSTALLATION" ||
        INSTALLATION.decision ===
          "COMPATIBLE_REPLACEMENT_OR_UPGRADE",

      normalizedHashFinalityInstalled:
        INSTALLATION.decision ===
          "NEW_INSTALLATION" ||
        INSTALLATION.decision ===
          "COMPATIBLE_REPLACEMENT_OR_UPGRADE",

      installedAt:
        INSTALLATION.installedAt,

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

  function buildApi() {
    return deepFreeze({
      CONTRACT:
        CONTRACT,

      PREVIOUS_CONTRACT:
        PREVIOUS_CONTRACT,

      PRIOR_CONTRACT:
        PRIOR_CONTRACT,

      EARLIER_CONTRACT:
        EARLIER_CONTRACT,

      LEGACY_CONTRACT:
        LEGACY_CONTRACT,

      VERSION:
        VERSION,

      VERSION_LABEL:
        VERSION_LABEL,

      FILE:
        FILE,

      CYCLE_SCHEMA:
        CYCLE_SCHEMA,

      REQUEST_SCHEMA:
        REQUEST_SCHEMA,

      ROUTE_REQUEST_SCHEMA:
        ROUTE_REQUEST_SCHEMA,

      CANONICAL_REQUEST_SCHEMA:
        CANONICAL_REQUEST_SCHEMA,

      STATION_REQUEST_SCHEMA:
        STATION_REQUEST_SCHEMA,

      STATION_SCHEMA:
        STATION_SCHEMA,

      HANDOFF_SCHEMA:
        HANDOFF_SCHEMA,

      RESTITUTION_SCHEMA:
        RESTITUTION_SCHEMA,

      TERMINAL_LEDGER_SCHEMA:
        TERMINAL_LEDGER_SCHEMA,

      TRANSPORT_SCHEMA:
        TRANSPORT_SCHEMA,

      POSITIONS:
        POSITIONS,

      SHARED_TRANSPORT_FIELDS:
        SHARED_TRANSPORT_FIELDS,

      ENUMS: {
        STATUSES:
          STATUSES,

        CYCLE_STATUSES:
          CYCLE_STATUSES,

        MODES:
          MODES,

        REGISTRATION_STATUSES:
          REGISTRATION_STATUSES
      },

      LIMITS:
        LIMITS,

      CAPABILITIES:
        CAPABILITIES,

      NO_CLAIMS:
        NO_CLAIMS,

      clone:
        clone,

      plain:
        function plain(value) {
          return validatePlainData(value).passed;
        },

      deepFreeze:
        deepFreeze,

      stableStringify:
        stableStringify,

      hash:
        hash,

      hashExcludingFields:
        hashExcludingFields,

      hashStationSourceReceipt:
        hashStationSourceReceipt,

      hashNormalizedReceipt:
        hashNormalizedReceipt,

      verifyNormalizedReceiptHash:
        verifyNormalizedReceiptHash,

      hashTerminalLedger:
        hashTerminalLedger,

      verifyTerminalLedgerHash:
        verifyTerminalLedgerHash,

      validateCycleRequest:
        validateCycleRequest,

      validateStationDefinition:
        validateStationDefinition,

      validateStationReceipt:
        validateStationReceipt,

      validateCyclePacket:
        validateCyclePacket,

      normalizeStationReceipt:
        normalizeStationReceipt,

      discoverStations:
        discoverStations,

      discoverAuxiliaries:
        discoverAuxiliaries,

      createCycle:
        createCycle,

      executeCycle:
        executeCycle,

      executeDiagnosticCycle:
        executeDiagnosticCycle,

      executeNineCycle:
        executeNineCycle,

      runNineCycle:
        runNineCycle,

      conduct:
        conduct,

      run:
        run,

      getContractDefinition:
        getContractDefinition,

      getDefinitionValidation:
        getDefinitionValidation,

      getDefinitionReceipt:
        getDefinitionReceipt,

      getInstallationReceipt:
        getInstallationReceipt
    });
  }

  function rollback() {
    var names =
      INSTALLATION.published
        .slice()
        .reverse();

    names.forEach(function remove(name) {
      try {
        if (
          name ===
          "AUDRALIA.diagnosticNorthConductor"
        ) {
          if (root.AUDRALIA) {
            delete root.AUDRALIA.diagnosticNorthConductor;
          }
        } else if (
          name ===
          "AUDRALIA.diagnostics.northConductor"
        ) {
          if (
            root.AUDRALIA &&
            root.AUDRALIA.diagnostics
          ) {
            delete root.AUDRALIA.diagnostics.northConductor;
          }
        } else {
          delete root[name];
        }
      } catch (_error) {}
    });

    INSTALLATION.rollbackComplete =
      true;
  }

  function publish() {
    if (
      !root ||
      typeof root !== "object"
    ) {
      return;
    }

    var existing =
      root.AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR;

    if (
      existing &&
      existing.CONTRACT &&
      existing.CONTRACT !== CONTRACT &&
      existing.CONTRACT !== PREVIOUS_CONTRACT &&
      existing.CONTRACT !== PRIOR_CONTRACT &&
      existing.CONTRACT !== EARLIER_CONTRACT &&
      existing.CONTRACT !== LEGACY_CONTRACT
    ) {
      INSTALLATION.decision =
        "CONFLICT";

      INSTALLATION.reason =
        "PRIMARY_GLOBAL_OCCUPIED_BY_INCOMPATIBLE_AUTHORITY";

      INSTALLATION.errors.push(
        "PRIMARY_GLOBAL_CONFLICT"
      );

      return;
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
        ensureNamespace(
          "AUDRALIA"
        );

      if (namespace) {
        namespace.diagnosticNorthConductor =
          api;

        INSTALLATION.published.push(
          "AUDRALIA.diagnosticNorthConductor"
        );

        if (
          !namespace.diagnostics ||
          typeof namespace.diagnostics !== "object"
        ) {
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

      root.__AUDRALIA_DIAGNOSTIC_NINE_CYCLE_VERSION__ =
        VERSION;

      INSTALLATION.published.push(
        "__AUDRALIA_DIAGNOSTIC_NINE_CYCLE_VERSION__"
      );

      root.__AUDRALIA_DIAGNOSTIC_NINE_CYCLE_SCHEMA__ =
        CYCLE_SCHEMA;

      INSTALLATION.published.push(
        "__AUDRALIA_DIAGNOSTIC_NINE_CYCLE_SCHEMA__"
      );

      root.__AUDRALIA_DIAGNOSTIC_TERMINAL_LEDGER_SCHEMA__ =
        TERMINAL_LEDGER_SCHEMA;

      INSTALLATION.published.push(
        "__AUDRALIA_DIAGNOSTIC_TERMINAL_LEDGER_SCHEMA__"
      );

      root.__AUDRALIA_DIAGNOSTIC_TERMINAL_LEDGER_TRANSPORT_ACTIVE__ =
        true;

      INSTALLATION.published.push(
        "__AUDRALIA_DIAGNOSTIC_TERMINAL_LEDGER_TRANSPORT_ACTIVE__"
      );

      root.__AUDRALIA_DIAGNOSTIC_NORMALIZED_HASH_EXTERNAL_VERIFICATION__ =
        true;

      INSTALLATION.published.push(
        "__AUDRALIA_DIAGNOSTIC_NORMALIZED_HASH_EXTERNAL_VERIFICATION__"
      );

      root.__AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_LOADED__ =
        true;

      INSTALLATION.published.push(
        "__AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_LOADED__"
      );

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
        error &&
        error.message
          ? error.message
          : String(error)
      );

      rollback();
    }
  }

  publish();

  if (
    typeof module !== "undefined" &&
    module.exports
  ) {
    module.exports =
      root &&
      root.AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR
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

// /assets/audralia/audralia.diagnostic.probe.west.js
// AUDRALIA_DIAGNOSTIC_PROBE_WEST_RUNTIME_F13_3D_TNT_v4
// Full-file replacement.
// Quiet-load, dependency-free, 3D-native West runtime evidence probe.
// Diagnostic-only. Read-only. No mutation. No repair. No readiness claim.
// Renews F13 v3 to canonical station receipt identity:
// position, cyclePosition, stationId, role, fibonacci, status, completed,
// handoffEligible, summary, recommendedOwner, recommendedFile,
// recommendedAction, noClaims.

(function audraliaDiagnosticProbeWestRuntimeF133DV4(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);

  var CONTRACT = "AUDRALIA_DIAGNOSTIC_PROBE_WEST_RUNTIME_F13_3D_TNT_v4";
  var PREVIOUS_CONTRACT = "AUDRALIA_DIAGNOSTIC_PROBE_WEST_RUNTIME_F13_3D_TNT_v3";
  var LEGACY_CONTRACT = "AUDRALIA_DIAGNOSTIC_PROBE_WEST_RUNTIME_F13_3D_TNT_v2";
  var VERSION = "4.0.0";
  var FILE = "/assets/audralia/audralia.diagnostic.probe.west.js";

  var STATION_ID = "WEST_PROBE_RUNTIME";
  var CYCLE_POSITION = 5;
  var FIBONACCI = "F13";
  var NEWS = "WEST";

  var REQUEST_SCHEMA = "AUDRALIA_DIAGNOSTIC_STATION_EXECUTION_REQUEST_v1";
  var RECEIPT_SCHEMA = "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_STATION_RECEIPT_v1";
  var API_SCHEMA = "AUDRALIA_DIAGNOSTIC_STATION_API_v2";
  var REGISTRATION_RECEIPT_SCHEMA = "AUDRALIA_DIAGNOSTIC_STATION_REGISTRATION_RECEIPT_v2";

  var REQUIRED_PREDECESSOR = "CANVAS_SURFACE_TRUTH";
  var CURRENT_F8_CONTRACT = "AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_F8_3D_TNT_v5";
  var CURRENT_F8_FILE = "/assets/audralia/audralia.diagnostic.probe.canvas.surface.truth.js";
  var PUBLIC_RUNTIME_FILE = "/showroom/globe/audralia/index.js";
  var DIAGNOSTIC_ENGINE_FILE = "/showroom/globe/audralia/diagnostic/index.js";
  var NEXT_STATION_FILE = "/assets/audralia/audralia.diagnostic.west.js";

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
    repairAuthorizationAuthority: false,
    fileAuthorizationAuthority: false,
    finalProductionVerdictAuthority: false,
    runtimeEvidenceProbePassProvesRuntimeHealthy: false,
    runtimePresenceProvesVisualPass: false,
    presentationEvidenceProvesReadiness: false,
    recommendedOwnerProvesDefect: false,
    directionProvesCulprit: false,
    readyClaimed: false,
    verifiedClaimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webGPU: false,
    f21Claimed: false,
    directionOnly: true
  });

  var RUNTIME_FIELDS = Object.freeze([
    "runtimeGlobalPresent",
    "runtimeGlobalName",
    "runtimeEvidenceAvailable",
    "mounted",
    "running",
    "stageRectNonzero",
    "geometryReady",
    "webGL",
    "fallbackActive",
    "contextLost",
    "firstFrameDrawn",
    "visiblePixelObserved",
    "canvasPresent",
    "runtimeCanvasPresent",
    "fallbackCanvasPresent",
    "mode",
    "width",
    "height",
    "pixelWidth",
    "pixelHeight",
    "errorCount"
  ]);

  function nowISO() {
    try { return new Date().toISOString(); } catch (_error) { return null; }
  }

  function isObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  function clone(value) {
    try { return JSON.parse(JSON.stringify(value)); } catch (_error) { return null; }
  }

  function stableStringify(value) {
    if (value === null) return "null";
    if (typeof value === "string") return JSON.stringify(value);
    if (typeof value === "number") return Number.isFinite(value) ? String(value) : "null";
    if (typeof value === "boolean") return value ? "true" : "false";
    if (Array.isArray(value)) return "[" + value.map(stableStringify).join(",") + "]";
    if (isObject(value)) {
      return "{" + Object.keys(value).sort().map(function encode(key) {
        return JSON.stringify(key) + ":" + stableStringify(value[key]);
      }).join(",") + "}";
    }
    return "null";
  }

  function hash(value) {
    var text = stableStringify(value);
    var h = 0x811c9dc5;
    for (var i = 0; i < text.length; i += 1) {
      h ^= text.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
      h >>>= 0;
    }
    return "fnv1a32:" + ("00000000" + h.toString(16)).slice(-8);
  }

  function deepFreeze(value, seen) {
    var memory = seen || [];
    if (!value || typeof value !== "object") return value;
    if (memory.indexOf(value) !== -1) return value;
    memory.push(value);
    try {
      Object.keys(value).forEach(function each(key) { deepFreeze(value[key], memory); });
      Object.freeze(value);
    } catch (_error) {}
    return value;
  }

  function issue(code, path, detail) {
    return {
      code: String(code || "ISSUE"),
      path: String(path || "$"),
      detail: String(detail || code || "ISSUE").slice(0, 512)
    };
  }

  function observation(id, kind, payload) {
    var out = { id: id, kind: kind };
    Object.keys(payload || {}).forEach(function each(key) { out[key] = clone(payload[key]); });
    return out;
  }

  function collectPriorReceipts(packet) {
    if (Array.isArray(packet.priorStationReceipts)) return packet.priorStationReceipts;
    if (Array.isArray(packet.stationReceipts)) return packet.stationReceipts;
    if (Array.isArray(packet.receipts)) return packet.receipts;
    return [];
  }

  function findReceipt(packet, stationId) {
    var receipts = collectPriorReceipts(packet || {});
    for (var i = receipts.length - 1; i >= 0; i -= 1) {
      if (receipts[i] && receipts[i].stationId === stationId) return receipts[i];
    }
    return null;
  }

  function findObservation(receipt, id) {
    var observations = receipt && Array.isArray(receipt.observations) ? receipt.observations : [];
    for (var i = 0; i < observations.length; i += 1) {
      if (observations[i] && observations[i].id === id) return observations[i];
    }
    return null;
  }

  function firstObject() {
    for (var i = 0; i < arguments.length; i += 1) {
      if (isObject(arguments[i])) return arguments[i];
    }
    return null;
  }

  function firstValue() {
    for (var i = 0; i < arguments.length; i += 1) {
      if (arguments[i] !== undefined && arguments[i] !== null) return arguments[i];
    }
    return null;
  }

  function readSurface(packet) {
    var receipt = findReceipt(packet, REQUIRED_PREDECESSOR);
    var classification = findObservation(receipt, "CANVAS_SURFACE_TRUTH_CLASSIFICATION");
    var runtimeStatus = findObservation(receipt, "CANVAS_SURFACE_RUNTIME_STATUS");
    var targetFrame = findObservation(receipt, "CANVAS_SURFACE_TARGET_FRAME");
    var binding = findObservation(receipt, "CANVAS_SURFACE_TARGET_BINDING");

    var pass = Boolean(receipt && receipt.status === "PASS" && receipt.handoffEligible === true);
    var admitted = Boolean(pass && classification && classification.surfaceTruthAdmitted === true);

    return {
      receiptObserved: Boolean(receipt),
      receiptPass: pass,
      admissionRecognized: admitted,
      admissionClass: classification ? classification.lifecycleClass || null : null,
      classification: clone(classification),
      runtimeStatus: clone(runtimeStatus),
      targetFrame: clone(targetFrame),
      binding: clone(binding),
      receiptHash: receipt ? receipt.receiptHash || null : null,
      receiptFile: receipt ? receipt.file || null : null,
      receiptContract: receipt ? receipt.contract || null : null
    };
  }

  function extractRuntimeEvidence(packet, surface) {
    var target = isObject(packet.target) ? packet.target : {};
    var construct = isObject(packet.construct) ? packet.construct : {};
    var engine = isObject(packet.engine) ? packet.engine : {};
    var extensions = isObject(packet.extensions) ? packet.extensions : {};

    var canonical = firstObject(
      surface.runtimeStatus,
      target.runtimeStatus,
      target.runtimeReceipt,
      packet.targetRuntimeStatus,
      packet.runtimeStatus
    );

    var legacy = firstObject(
      construct.runtime,
      engine.runtime,
      extensions.runtime
    );

    var frame = firstObject(surface.targetFrame, target.targetFrame);
    var source = canonical ? "CANONICAL_TARGET_RUNTIME" : legacy ? "LEGACY_RUNTIME_PACKET" : "NO_RUNTIME_PACKET";

    var merged = {};
    [frame, canonical, legacy].forEach(function copy(src) {
      if (!isObject(src)) return;
      Object.keys(src).forEach(function each(key) {
        if (merged[key] === undefined || merged[key] === null) merged[key] = src[key];
      });
    });

    return {
      source: source,
      canonicalPresent: Boolean(canonical),
      legacyPresent: Boolean(legacy),
      framePresent: Boolean(frame),
      data: merged
    };
  }

  function fieldLedger(runtimeEvidence) {
    var data = runtimeEvidence.data || {};
    var ledger = {};

    RUNTIME_FIELDS.forEach(function each(field) {
      var value = firstValue(data[field], null);
      ledger[field] = {
        field: field,
        state: value === null ? "UNAVAILABLE" : typeof value === "boolean" ? (value ? "OBSERVED_TRUE" : "OBSERVED_FALSE") : "OBSERVED_VALUE",
        value: value,
        source: runtimeEvidence.source
      };
    });

    return ledger;
  }

  function classify(surface, runtimeEvidence, ledger) {
    if (!surface.receiptObserved) return "WEST_RUNTIME_HELD_F8_RECEIPT_MISSING";
    if (!surface.receiptPass) return "WEST_RUNTIME_HELD_F8_NOT_PASSING";
    if (!surface.admissionRecognized) return "WEST_RUNTIME_HELD_F8_SURFACE_ADMISSION_NOT_RECOGNIZED";

    if (!runtimeEvidence.canonicalPresent && !runtimeEvidence.legacyPresent && !runtimeEvidence.framePresent) {
      return "WEST_RUNTIME_PASS_SURFACE_ADMITTED_RUNTIME_DETAILS_UNAVAILABLE";
    }

    if (ledger.contextLost && ledger.contextLost.value === true) {
      return "WEST_RUNTIME_PASS_CONTEXT_LOSS_OBSERVED_FOR_F21_INTERPRETATION";
    }

    if (ledger.errorCount && typeof ledger.errorCount.value === "number" && ledger.errorCount.value > 0) {
      return "WEST_RUNTIME_PASS_RUNTIME_ERRORS_OBSERVED_FOR_F21_INTERPRETATION";
    }

    return "WEST_RUNTIME_EVIDENCE_COLLECTED_FOR_F21_INTERPRETATION";
  }

  function createReceipt(status, completed, handoffEligible, summary, packet, observations, evidence, issues, owner, runtime) {
    var finalOwner = owner || {
      ownerType: "DIAGNOSTIC_PROBE",
      subjectId: STATION_ID,
      contract: CONTRACT,
      file: FILE,
      component: "WEST_RUNTIME_EVIDENCE_PROBE",
      directionOnly: true,
      provenCulprit: false
    };

    var recommendedFile = finalOwner.file || (status === "PASS" ? NEXT_STATION_FILE : CURRENT_F8_FILE);
    var recommendedAction = status === "PASS"
      ? "HANDOFF_TO_F21_RUNTIME_INTERPRETATION"
      : "RESOLVE_F8_SURFACE_TRUTH_HANDOFF_BEFORE_F13";

    var receipt = {
      schema: RECEIPT_SCHEMA,
      cycleId: packet && packet.cycleId ? packet.cycleId : null,

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
      file: FILE,

      status: status,
      completed: completed === true,
      handoffEligible: handoffEligible === true,
      summary: summary,

      observations: observations || [],
      evidence: evidence || [],
      issues: issues || [],
      runtimeProbePacket: runtime || null,

      firstHeldCoordinate: status === "HOLD" ? "F13:WEST_PROBE_RUNTIME" : null,
      firstFailedCoordinate: status === "FAIL" ? "F13:WEST_PROBE_RUNTIME" : null,
      firstConflictCoordinate: status === "CONFLICT" ? "F13:WEST_PROBE_RUNTIME" : null,

      recommendedOwner: finalOwner,
      recommendedFile: recommendedFile,
      recommendedAction: recommendedAction,

      generatedAt: nowISO(),
      noClaims: clone(NO_CLAIMS),
      receiptHash: null
    };

    receipt.receiptHash = hash(receipt);
    return deepFreeze(receipt);
  }

  function executeCycleStation(packet) {
    packet = packet || {};

    var issues = [];

    if (packet.schema !== REQUEST_SCHEMA) {
      issues.push(issue("REQUEST_SCHEMA_MISMATCH", "$.schema", "Station request schema did not match the conductor station-execution schema."));
    }

    if (packet.position !== CYCLE_POSITION) {
      issues.push(issue("REQUEST_POSITION_MISMATCH", "$.position", "Station request position did not match F13."));
    }

    if (packet.stationId !== STATION_ID) {
      issues.push(issue("REQUEST_STATION_ID_MISMATCH", "$.stationId", "Station request id did not match WEST_PROBE_RUNTIME."));
    }

    var surface = readSurface(packet);
    var runtimeEvidence = extractRuntimeEvidence(packet, surface);
    var ledger = fieldLedger(runtimeEvidence);
    var classification = classify(surface, runtimeEvidence, ledger);

    if (!surface.receiptObserved) {
      issues.push(issue("F8_SURFACE_TRUTH_RECEIPT_REQUIRED", "$.priorStationReceipts", "West requires the F8 CANVAS_SURFACE_TRUTH predecessor receipt."));
    } else if (!surface.receiptPass) {
      issues.push(issue("F8_SURFACE_TRUTH_RECEIPT_NOT_PASSING", "$.priorStationReceipts.CANVAS_SURFACE_TRUTH", "F8 was present but did not pass with handoff eligibility."));
    } else if (!surface.admissionRecognized) {
      issues.push(issue("F8_SURFACE_ADMISSION_NOT_RECOGNIZED", "$.priorStationReceipts.CANVAS_SURFACE_TRUTH.observations", "F8 passed, but no current surfaceTruthAdmitted=true classification was found."));
    }

    var hold = issues.length > 0;

    var observations = [
      observation("WEST_RUNTIME_F8_HANDOFF", "EXPOSED_RECEIPT", {
        receiptObserved: surface.receiptObserved,
        receiptPass: surface.receiptPass,
        admissionRecognized: surface.admissionRecognized,
        admissionClass: surface.admissionClass,
        receiptHash: surface.receiptHash,
        receiptContract: surface.receiptContract,
        expectedF8Contract: CURRENT_F8_CONTRACT,
        f8ContractCurrent: surface.receiptContract === CURRENT_F8_CONTRACT
      }),
      observation("WEST_RUNTIME_EVIDENCE_SOURCE", "DERIVED", {
        source: runtimeEvidence.source,
        canonicalPresent: runtimeEvidence.canonicalPresent,
        legacyPresent: runtimeEvidence.legacyPresent,
        framePresent: runtimeEvidence.framePresent
      }),
      observation("WEST_RUNTIME_FIELD_LEDGER", "DERIVED", {
        fields: clone(ledger)
      }),
      observation("WEST_RUNTIME_CLASSIFICATION", "DERIVED", {
        classification: classification,
        westPassMeansEvidenceTransportOnly: true,
        runtimeHealthClaimed: false,
        readinessClaimed: false,
        nextStationEligible: !hold,
        runtimeEvidenceAdmitted: !hold,
        runtimeEvidenceTransported: true
      })
    ];

    var runtimePacket = {
      schema: "AUDRALIA_DIAGNOSTIC_RUNTIME_EVIDENCE_PACKET_F13_v2",
      contract: CONTRACT,
      source: runtimeEvidence.source,
      classification: classification,
      surface: clone(surface),
      runtimeEvidence: clone(runtimeEvidence.data),
      fieldLedger: clone(ledger),
      publicRuntimeFile: PUBLIC_RUNTIME_FILE,
      diagnosticEngineFile: DIAGNOSTIC_ENGINE_FILE,
      nextStationFile: NEXT_STATION_FILE,
      runtimeEvidenceAdmitted: !hold,
      nextStationEligible: !hold,
      generatedAt: nowISO(),
      packetHash: null,
      noClaims: clone(NO_CLAIMS)
    };

    runtimePacket.packetHash = hash(runtimePacket);

    var evidence = [
      { id: "WEST_RUNTIME_REQUEST_HASH", kind: "DERIVED", hash: hash(packet) },
      { id: "WEST_RUNTIME_SURFACE_HASH", kind: "DERIVED", hash: hash(surface) },
      { id: "WEST_RUNTIME_EVIDENCE_HASH", kind: "DERIVED", hash: hash(runtimeEvidence) },
      { id: "WEST_RUNTIME_FIELD_LEDGER_HASH", kind: "DERIVED", hash: hash(ledger) },
      { id: "WEST_RUNTIME_PACKET_HASH", kind: "DERIVED", hash: runtimePacket.packetHash }
    ];

    var owner = hold
      ? {
          ownerType: "DIAGNOSTIC_SURFACE_HANDOFF",
          subjectId: REQUIRED_PREDECESSOR,
          contract: CURRENT_F8_CONTRACT,
          file: surface.receiptFile || CURRENT_F8_FILE,
          component: "F8_TO_F13_HANDOFF",
          directionOnly: true,
          provenCulprit: false
        }
      : {
          ownerType: "DIAGNOSTIC_INTERPRETATION_NEXT_STATION",
          subjectId: "WEST_RUNTIME_INTERPRETATION",
          contract: null,
          file: NEXT_STATION_FILE,
          component: "F21_RUNTIME_INTERPRETATION",
          directionOnly: true,
          provenCulprit: false
        };

    return createReceipt(
      hold ? "HOLD" : "PASS",
      !hold,
      !hold,
      hold ? "WEST_RUNTIME_HELD_F8_HANDOFF_UNAVAILABLE" : classification,
      packet,
      observations,
      evidence,
      issues,
      owner,
      runtimePacket
    );
  }

  function getDefinitionReceipt() {
    return deepFreeze({
      schema: REGISTRATION_RECEIPT_SCHEMA,
      stationId: STATION_ID,
      cyclePosition: CYCLE_POSITION,
      position: CYCLE_POSITION,
      fibonacci: FIBONACCI,
      news: NEWS,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      legacyContract: LEGACY_CONTRACT,
      version: VERSION,
      file: FILE,
      globalPath: "AUDRALIA_DIAGNOSTIC_PROBE_WEST",
      status: "AVAILABLE",
      conductorCompatible: true,
      requiresPredecessor: REQUIRED_PREDECESSOR,
      currentF8Contract: CURRENT_F8_CONTRACT,
      currentF8File: CURRENT_F8_FILE,
      canonicalReceiptIdentityComplete: true,
      requiredReceiptFields: [
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
      probePassMeansEvidenceTransportOnly: true,
      interpretationDeferredToF21: true,
      noClaims: clone(NO_CLAIMS),
      generatedAt: nowISO(),
      definitionHash: hash({
        contract: CONTRACT,
        version: VERSION,
        file: FILE,
        stationId: STATION_ID,
        cyclePosition: CYCLE_POSITION,
        fields: RUNTIME_FIELDS
      })
    });
  }

  var API = deepFreeze({
    schema: API_SCHEMA,
    STATION_ID: STATION_ID,
    CYCLE_POSITION: CYCLE_POSITION,
    FIBONACCI: FIBONACCI,
    NEWS: NEWS,
    CONTRACT: CONTRACT,
    PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
    LEGACY_CONTRACT: LEGACY_CONTRACT,
    VERSION: VERSION,
    FILE: FILE,

    stationId: STATION_ID,
    cyclePosition: CYCLE_POSITION,
    fibonacci: FIBONACCI,
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    legacyContract: LEGACY_CONTRACT,
    version: VERSION,
    file: FILE,
    role: STATION_ID,

    executeCycleStation: executeCycleStation,
    execute: executeCycleStation,
    getDefinitionReceipt: getDefinitionReceipt,
    hash: hash,
    noClaims: NO_CLAIMS
  });

  root.AUDRALIA_DIAGNOSTIC_PROBE_WEST = API;
  root.AUDRALIA_DIAGNOSTIC_WEST_PROBE = API;
  root.AUDRALIA_DIAGNOSTIC_PROBE_WEST_RUNTIME = API;
  root.AUDRALIA_DIAGNOSTIC_WEST_RUNTIME_PROBE = API;

  if (!root.AUDRALIA || typeof root.AUDRALIA !== "object") root.AUDRALIA = {};
  root.AUDRALIA.diagnosticProbeWest = API;

  if (!root.AUDRALIA.diagnostics || typeof root.AUDRALIA.diagnostics !== "object") {
    root.AUDRALIA.diagnostics = {};
  }

  root.AUDRALIA.diagnostics.probeWest = API;
  root.AUDRALIA.diagnostics.westProbe = API;

  root.AUDRALIA_DIAGNOSTIC_PROBE_WEST_RECEIPT = getDefinitionReceipt();

  root.__AUDRALIA_DIAGNOSTIC_PROBE_WEST_LOADED__ = true;
  root.__AUDRALIA_DIAGNOSTIC_PROBE_WEST_VERSION__ = VERSION;
  root.__AUDRALIA_DIAGNOSTIC_PROBE_WEST_CONTRACT__ = CONTRACT;

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

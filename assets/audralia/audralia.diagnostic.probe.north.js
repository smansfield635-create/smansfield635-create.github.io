// /assets/audralia/audralia.diagnostic.probe.north.js
// AUDRALIA_DIAGNOSTIC_NORTH_PROBE_INTAKE_STATION_F1_EVIDENCE_AUTHORITY_TNT_v2
// Full-file replacement.
// Diagnostic-only.
// Read-only.
// Conductor-compatible Station 1 API.

(function registerAudraliaDiagnosticProbeNorth(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);

  var CONTRACT =
    "AUDRALIA_DIAGNOSTIC_NORTH_PROBE_INTAKE_STATION_F1_EVIDENCE_AUTHORITY_TNT_v2";
  var PREVIOUS_CONTRACT =
    "AUDRALIA_DIAGNOSTIC_NORTH_PROBE_INTAKE_STATION_F1_EVIDENCE_AUTHORITY_TNT_v1";
  var VERSION = "2.0.0";
  var FILE = "/assets/audralia/audralia.diagnostic.probe.north.js";

  var STATION_ID = "NORTH_PROBE_INTAKE";
  var CYCLE_POSITION = 1;
  var FIBONACCI = "F1";
  var STATION_SCHEMA = "AUDRALIA_DIAGNOSTIC_NINE_CYCLE_STATION_RECEIPT_v1";

  var NO_CLAIMS = {
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
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return null;
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function clone(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return null;
    }
  }

  function deepFreeze(value) {
    if (!value || typeof value !== "object") return value;

    Object.keys(value).forEach(function freezeKey(key) {
      deepFreeze(value[key]);
    });

    try {
      Object.freeze(value);
    } catch (_error) {}

    return value;
  }

  function hash(value) {
    var text;

    try {
      text = JSON.stringify(value || {});
    } catch (_error) {
      text = String(value || "");
    }

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

  function issue(code, detail) {
    return {
      code: String(code || "ISSUE"),
      path: STATION_ID,
      detail: String(detail || code || "ISSUE")
    };
  }

  function observation(id, value) {
    return {
      id: String(id),
      kind: "OBSERVED",
      value: value
    };
  }

  function readRequest(packet) {
    var source = isObject(packet) ? packet : {};

    return {
      cycleId: source.cycleId || null,
      mode: source.mode || "AUDIT",
      subject: isObject(source.subject) ? source.subject : {},
      engine: isObject(source.engine) ? source.engine : {},
      construct: isObject(source.construct) ? source.construct : {},
      target: isObject(source.target)
        ? source.target
        : isObject(source.construct) && isObject(source.construct.target)
          ? source.construct.target
          : {},
      route: isObject(source.route)
        ? source.route
        : isObject(source.construct) && source.construct.route
          ? { route: source.construct.route }
          : {},
      priorLedgerHash: source.priorLedgerHash || null
    };
  }

  function makeReceipt(status, completed, handoffEligible, summary, request, observations, evidence, issues) {
    var receipt = {
      schema: STATION_SCHEMA,
      cycleId: request.cycleId,
      position: CYCLE_POSITION,
      stationId: STATION_ID,
      fibonacci: FIBONACCI,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      status: status,
      completed: completed === true,
      handoffEligible: handoffEligible === true,
      summary: summary,
      observations: observations || [],
      evidence: evidence || [],
      issues: issues || [],
      firstHeldCoordinate: status === "HOLD" ? STATION_ID : null,
      firstFailedCoordinate: status === "FAIL" ? STATION_ID : null,
      firstConflictCoordinate: status === "CONFLICT" ? STATION_ID : null,
      recommendedOwner: {
        ownerType: "DIAGNOSTIC_STATION",
        subjectId: STATION_ID,
        contract: CONTRACT,
        file: FILE,
        component: STATION_ID
      },
      generatedAt: nowIso(),
      noClaims: clone(NO_CLAIMS),
      receiptHash: null
    };

    receipt.receiptHash = hash(receipt);

    return deepFreeze(receipt);
  }

  function executeCycleStation(packet) {
    var request = readRequest(packet);

    var observations = [
      observation("CYCLE_ID_PRESENT", Boolean(request.cycleId)),
      observation("SUBJECT_PRESENT", isObject(request.subject)),
      observation("ENGINE_PRESENT", isObject(request.engine)),
      observation("CONSTRUCT_PRESENT", isObject(request.construct)),
      observation("TARGET_PRESENT", isObject(request.target)),
      observation("PRIOR_LEDGER_HASH_PRESENT", Boolean(request.priorLedgerHash))
    ];

    var targetRoute =
      request.target.targetRoute ||
      request.route.targetRoute ||
      request.construct.targetRoute ||
      null;

    var framePresent = request.target.framePresent === true;
    var documentLoaded = request.target.documentLoaded === true;
    var sameOriginAccessible = request.target.sameOriginAccessible === true;

    var evidence = [
      {
        id: "NORTH_INTAKE_PACKET",
        kind: "OBSERVED",
        cycleId: request.cycleId,
        mode: request.mode,
        targetRoute: targetRoute,
        framePresent: framePresent,
        documentLoaded: documentLoaded,
        sameOriginAccessible: sameOriginAccessible,
        priorLedgerHash: request.priorLedgerHash
      }
    ];

    if (!request.cycleId) {
      return makeReceipt(
        "HOLD",
        false,
        false,
        "NORTH_PROBE_INTAKE_HELD_CYCLE_ID_MISSING",
        request,
        observations,
        evidence,
        [issue("CYCLE_ID_MISSING", "No cycleId was supplied to Station 1.")]
      );
    }

    if (!isObject(request.subject)) {
      return makeReceipt(
        "HOLD",
        false,
        false,
        "NORTH_PROBE_INTAKE_HELD_SUBJECT_MISSING",
        request,
        observations,
        evidence,
        [issue("SUBJECT_MISSING", "No subject packet was supplied to Station 1.")]
      );
    }

    if (!isObject(request.construct)) {
      return makeReceipt(
        "HOLD",
        false,
        false,
        "NORTH_PROBE_INTAKE_HELD_CONSTRUCT_MISSING",
        request,
        observations,
        evidence,
        [issue("CONSTRUCT_MISSING", "No construct packet was supplied to Station 1.")]
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

  function getDefinitionReceipt() {
    return deepFreeze({
      schema: "AUDRALIA_DIAGNOSTIC_STATION_DEFINITION_RECEIPT_v1",
      stationId: STATION_ID,
      cyclePosition: CYCLE_POSITION,
      fibonacci: FIBONACCI,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      status: "AVAILABLE",
      conductorCompatible: true,
      exposesUppercaseIdentity: true,
      exposesExecuteCycleStation: true,
      exposesGetDefinitionReceipt: true,
      generatedAt: nowIso(),
      noClaims: clone(NO_CLAIMS)
    });
  }

  var API = deepFreeze({
    SCHEMA: "AUDRALIA_DIAGNOSTIC_STATION_API_v1",
    STATION_ID: STATION_ID,
    CYCLE_POSITION: CYCLE_POSITION,
    FIBONACCI: FIBONACCI,
    CONTRACT: CONTRACT,
    PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
    VERSION: VERSION,
    FILE: FILE,

    getDefinitionReceipt: getDefinitionReceipt,
    executeCycleStation: executeCycleStation,

    stationId: STATION_ID,
    cyclePosition: CYCLE_POSITION,
    fibonacci: FIBONACCI,
    contract: CONTRACT,
    version: VERSION,
    file: FILE,
    execute: executeCycleStation
  });

  root.AUDRALIA_DIAGNOSTIC_PROBE_NORTH = API;

  if (!root.AUDRALIA || typeof root.AUDRALIA !== "object") {
    root.AUDRALIA = {};
  }

  if (!root.AUDRALIA.diagnostics || typeof root.AUDRALIA.diagnostics !== "object") {
    root.AUDRALIA.diagnostics = {};
  }

  root.AUDRALIA.diagnostics.probeNorth = API;

  root.AUDRALIA_DIAGNOSTIC_PROBE_NORTH_RECEIPT = getDefinitionReceipt();

  root.__AUDRALIA_DIAGNOSTIC_PROBE_NORTH_LOADED__ = true;
  root.__AUDRALIA_DIAGNOSTIC_PROBE_NORTH_VERSION__ = VERSION;
  root.__AUDRALIA_DIAGNOSTIC_PROBE_NORTH_CONTRACT__ = CONTRACT;

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

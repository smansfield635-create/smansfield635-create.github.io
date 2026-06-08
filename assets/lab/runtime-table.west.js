// /assets/lab/runtime-table.west.js
// LAB_RUNTIME_TABLE_CARDINAL_WEST_CANVAS_V12_3_POINTER_SURFACE_BISHOP_RELEASE_BRIDGE_TNT_v4_9
// Internal controlled renewal:
// LAB_RUNTIME_TABLE_CARDINAL_WEST_NORTH_CURRENT_AUTHORITY_RECHECK_TNT_v5_4
// Full-file replacement.
// Cardinal West / current-authority recheck / stale North quarantine / explicit-run admissibility.
//
// Preserves public West v4_9 identity.
// Preserves v5_3 compatibility.
// Adds v5_4 current-authority recheck.
// West is an admissibility and derivative-release authority only.
// West does not mutate production, Canvas, controls, route conductor, North, East, South, or Surface Truth.
// West does not draw Canvas, repair Canvas, claim F13/F21, claim ready text, or claim final visual pass.

(function () {
  "use strict";

  var ROOT = typeof window !== "undefined" ? window : globalThis;

  var PUBLIC_CONTRACT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_CANVAS_V12_3_POINTER_SURFACE_BISHOP_RELEASE_BRIDGE_TNT_v4_9";
  var PUBLIC_RECEIPT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_CANVAS_V12_3_POINTER_SURFACE_BISHOP_RELEASE_BRIDGE_RECEIPT_v4_9";

  var INTERNAL_RENEWAL_CONTRACT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_NORTH_CURRENT_AUTHORITY_RECHECK_TNT_v5_4";
  var INTERNAL_RENEWAL_RECEIPT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_NORTH_CURRENT_AUTHORITY_RECHECK_RECEIPT_v5_4";

  var COMPAT_INTERNAL_RENEWAL_CONTRACT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_NORTH_STANDARD_DERIVATIVE_RELEASE_TNT_v5_3";
  var COMPAT_INTERNAL_RENEWAL_RECEIPT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_NORTH_STANDARD_DERIVATIVE_RELEASE_RECEIPT_v5_3";

  var PREVIOUS_INTERNAL_RENEWAL_CONTRACT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_CANVAS_CHAPEL_DUAL_CHAPEL_METRIC_BINDING_TNT_v5_2";
  var PREVIOUS_INTERNAL_RENEWAL_RECEIPT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_CANVAS_CHAPEL_DUAL_CHAPEL_METRIC_BINDING_RECEIPT_v5_2";

  var VERSION =
    "2026-06-08.lab-runtime-table-west-north-current-authority-recheck-v5-4";

  var FILE = "/assets/lab/runtime-table.west.js";
  var ROUTE = "/showroom/globe/hearth/";
  var DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  var LAB_NORTH_FILE = "/assets/lab/runtime-table.js";
  var LAB_WEST_FILE = "/assets/lab/runtime-table.west.js";
  var NORTH_RAIL_FILE = "/assets/hearth/hearth.diagnostic.rail.js";
  var SURFACE_TRUTH_FILE =
    "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js";
  var EAST_PROBE_FILE = "/assets/hearth/hearth.diagnostic.probe.east.js";
  var SOUTH_RAIL_FILE = "/assets/hearth/hearth.diagnostic.south.js";

  var ACTIVE_STAGE_ID =
    "WEST_NORTH_CURRENT_AUTHORITY_RECHECK_STALE_PACKET_QUARANTINE";
  var ACTIVE_CARDINAL = "WEST";
  var ACTIVE_FIBONACCI = "F21W";
  var ACTIVE_NEWS_GATE = "WEST";
  var ACTIVE_CYCLE_NUMBER = 2;
  var ACTIVE_CYCLE_ROUTE = "NORTH_EAST_SOUTH_WEST_CANVAS";

  var TRUST_STATE = Object.freeze({
    CURRENT: "CURRENT",
    STALE_PRE_NORTH: "STALE_PRE_NORTH",
    PROFILE_ONLY: "PROFILE_ONLY",
    NOT_RUN: "NOT_RUN",
    NO_SOURCE_CONTEXT: "NO_SOURCE_CONTEXT",
    UNKNOWN: "UNKNOWN"
  });

  var WEST_DECISION = Object.freeze({
    HOLD: "HOLD",
    RELEASE_TO_CANVAS_RETURN_RECEIPT: "RELEASE_TO_CANVAS_RETURN_RECEIPT"
  });

  var WEST_GAP_CLASS = Object.freeze({
    NONE: "NONE",
    NORTH_STANDARD_MISSING: "NORTH_STANDARD_MISSING",
    NORTH_DIAGNOSTIC_RAIL_MISSING: "NORTH_DIAGNOSTIC_RAIL_MISSING",
    NORTH_RAIL_VERDICT_UNAVAILABLE: "NORTH_RAIL_VERDICT_UNAVAILABLE",
    SURFACE_TRUTH_UNMEASURED: "SURFACE_TRUTH_UNMEASURED",
    SURFACE_TRUTH_FAILURE: "SURFACE_TRUTH_FAILURE",
    STALE_PRE_NORTH_PACKET_QUARANTINED:
      "STALE_PRE_NORTH_PACKET_QUARANTINED",
    NO_SOURCE_CONTEXT_QUARANTINED: "NO_SOURCE_CONTEXT_QUARANTINED",
    DIAGNOSTIC_MALPRACTICE_GUARD_HELD:
      "DIAGNOSTIC_MALPRACTICE_GUARD_HELD",
    STRUCTURAL_BLOCK: "STRUCTURAL_BLOCK"
  });

  var ACCEPTED_LAB_NORTH_CONTRACTS = [
    "LAB_RUNTIME_TABLE_MULTI_FUNCTION_ANIMATION_STANDARD_TNT_v1",
    "LAB_RUNTIME_TABLE_NORTH_KING_QUEEN_DUAL_CHAPEL_DUTY_LOAD_MALPRACTICE_GUARD_SCHEMA_ANCHOR_TNT_v1_1",
    "LAB_RUNTIME_TABLE_NORTH_CENTRAL_TRAIN_STATION_PRODUCT_ENGINE_CONDUCTOR_TNT_v3",
    "LAB_RUNTIME_TABLE_NORTH_NON_BLOCKING_PHASE_SCHEDULER_TWO_CYCLE_DISTRIBUTOR_TNT_v2"
  ];

  var ACCEPTED_NORTH_RAIL_CONTRACTS = [
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_REANCHOR_DIAGNOSTIC_TRACK_RUNTIME_MAP_INTEGRITY_TNT_v11_6",
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_LABWEST_CONSTRUCT_ANCHORED_SURFACE_TRUTH_CONSUMER_TNT_v12",
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_TNT_v11",
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_TNT_v10"
  ];

  var ACCEPTED_SURFACE_TRUTH_CONTRACTS = [
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PRODUCTION_SURFACE_LENS_ALIGNMENT_TNT_v3",
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CYCLE_BOUND_CONTRACT_DEFINITION_ALIGNMENT_TNT_v2",
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TNT_v1"
  ];

  var LAB_NORTH_ALIASES = [
    "LAB_RUNTIME_TABLE",
    "LAB_RUNTIME_TABLE_NORTH",
    "LAB_RUNTIME_TABLE_MULTI_FUNCTION_ANIMATION_STANDARD",
    "DEXTER_LAB.runtimeTable",
    "DEXTER_LAB.runtimeTableNorth",
    "DEXTER_LAB.northRuntimeTable",
    "HEARTH.labRuntimeTable",
    "HEARTH.labRuntimeTableNorth",
    "HEARTH.LAB_RUNTIME_TABLE_NORTH"
  ];

  var NORTH_RAIL_ALIASES = [
    "JUDGE_NORTH",
    "HEARTH_DIAGNOSTIC_RAIL_NORTH",
    "HEARTH_DIAGNOSTIC_RAIL",
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_REANCHOR_DIAGNOSTIC_TRACK_RUNTIME_MAP_INTEGRITY",
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_LABWEST_CONSTRUCT_ANCHORED_SURFACE_TRUTH_CONSUMER",
    "HEARTH.diagnosticRail",
    "HEARTH.diagnosticNorth",
    "HEARTH.diagnosticNorthRail",
    "HEARTH.JUDGE_NORTH_DIAGNOSTIC_RAIL",
    "DEXTER_LAB.hearthDiagnosticRail",
    "DEXTER_LAB.hearthDiagnosticNorth",
    "DEXTER_LAB.hearthDiagnosticNorthRail"
  ];

  var SURFACE_TRUTH_ALIASES = [
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
    "HEARTH_CANVAS_SURFACE_TRUTH_PROBE",
    "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE",
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PRODUCTION_SURFACE_LENS_ALIGNMENT",
    "HEARTH.diagnosticProbeCanvasSurfaceTruth",
    "HEARTH.canvasSurfaceTruthProbe",
    "HEARTH.CANVAS_SURFACE_TRUTH_PROBE",
    "HEARTH.DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
    "HEARTH.diagnosticProbeCanvasSurfaceTruthProductionSurfaceLensAlignment",
    "DEXTER_LAB.canvasSurfaceTruthProbe",
    "DEXTER_LAB.diagnosticProbeCanvasSurfaceTruth",
    "DEXTER_LAB.canvasSurfaceTruthProductionSurfaceLensAlignment"
  ];

  var WEST_ALIAS_PATHS = [
    "LAB_RUNTIME_TABLE_WEST",
    "RUNTIME_TABLE_WEST",
    "LAB_CARDINAL_RUNTIME_TABLE_WEST",
    "LAB_RUNTIME_TABLE_CARDINAL_WEST",
    "HEARTH_RUNTIME_TABLE_WEST",
    "HEARTH_WEST_ADMISSIBILITY",
    "HEARTH_MACRO_WEST_AUTHORITY",

    "LAB_RUNTIME_TABLE_WEST_CANVAS_V12_3_POINTER_SURFACE_BISHOP_RELEASE_BRIDGE",
    "HEARTH_WEST_CANVAS_V12_3_POINTER_SURFACE_BISHOP_RELEASE_BRIDGE",

    "LAB_RUNTIME_TABLE_CARDINAL_WEST_POINTER_SURFACE_BISHOP_CHAIN_MAP",
    "HEARTH_WEST_POINTER_SURFACE_BISHOP_CHAIN_MAP",

    "LAB_RUNTIME_TABLE_CARDINAL_WEST_CANVAS_CHAPEL_DUAL_CHAPEL_METRIC_BINDING",
    "HEARTH_WEST_CANVAS_CHAPEL_DUAL_CHAPEL_METRIC_BINDING",

    "LAB_RUNTIME_TABLE_CARDINAL_WEST_NORTH_STANDARD_DERIVATIVE_RELEASE",
    "HEARTH_WEST_NORTH_STANDARD_DERIVATIVE_RELEASE",

    "LAB_RUNTIME_TABLE_CARDINAL_WEST_NORTH_CURRENT_AUTHORITY_RECHECK",
    "HEARTH_WEST_NORTH_CURRENT_AUTHORITY_RECHECK",

    "HEARTH.runtimeTableWest",
    "HEARTH.westRuntimeTable",
    "HEARTH.westAdmissibility",
    "HEARTH.macroWestAuthority",
    "HEARTH.westCanvasV123PointerSurfaceBishopReleaseBridge",
    "HEARTH.westPointerSurfaceBishopChainMap",
    "HEARTH.westCanvasChapelDualChapelMetricBinding",
    "HEARTH.westNorthStandardDerivativeRelease",
    "HEARTH.westNorthCurrentAuthorityRecheck",

    "DEXTER_LAB.runtimeTableWest",
    "DEXTER_LAB.cardinalRuntimeTableWest",
    "DEXTER_LAB.hearthRuntimeTableWest",
    "DEXTER_LAB.westAdmissibility",
    "DEXTER_LAB.hearthWestCanvasChapelDualChapelMetricBinding",
    "DEXTER_LAB.hearthWestNorthStandardDerivativeRelease",
    "DEXTER_LAB.hearthWestNorthCurrentAuthorityRecheck"
  ];

  var WEST_RECEIPT_ALIAS_PATHS = [
    "LAB_RUNTIME_TABLE_WEST_RECEIPT",
    "RUNTIME_TABLE_WEST_RECEIPT",
    "LAB_CARDINAL_RUNTIME_TABLE_WEST_RECEIPT",
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_RECEIPT",
    "HEARTH_RUNTIME_TABLE_WEST_RECEIPT",
    "HEARTH_WEST_ADMISSIBILITY_RECEIPT",
    "HEARTH_WEST_NORTH_STANDARD_DERIVATIVE_RELEASE_RECEIPT",
    "HEARTH_WEST_NORTH_CURRENT_AUTHORITY_RECHECK_RECEIPT",
    "HEARTH.westRuntimeTableReceipt",
    "HEARTH.westAdmissibilityReceipt",
    "HEARTH.westNorthStandardDerivativeReleaseReceipt",
    "HEARTH.westNorthCurrentAuthorityRecheckReceipt",
    "DEXTER_LAB.runtimeTableWestReceipt",
    "DEXTER_LAB.hearthWestNorthStandardDerivativeReleaseReceipt",
    "DEXTER_LAB.hearthWestNorthCurrentAuthorityRecheckReceipt"
  ];

  var state = createInitialState();
  var api = {};

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function stringValue(value, fallback) {
    if (value === undefined || value === null) return fallback || "";
    try {
      return String(value);
    } catch (_error) {
      return fallback || "";
    }
  }

  function clean(value, limit) {
    var text = stringValue(value, "");
    text = text.replace(/\s+/g, " ").trim();
    if (limit && text.length > limit) return text.slice(0, limit);
    return text;
  }

  function boolValue(value) {
    if (value === true || value === 1) return true;
    if (value === false || value === 0) return false;

    var text = clean(value).toLowerCase();
    if (
      text === "true" ||
      text === "yes" ||
      text === "present" ||
      text === "available" ||
      text === "active" ||
      text === "ready" ||
      text === "pass" ||
      text === "complete" ||
      text === "loaded_and_available" ||
      text === "strict_runtime_endpoint_confirmed"
    ) {
      return true;
    }

    if (
      text === "false" ||
      text === "no" ||
      text === "missing" ||
      text === "unavailable" ||
      text === "blocked" ||
      text === "failed" ||
      text === "not_observed" ||
      text === "script_not_observed_global_not_found"
    ) {
      return false;
    }

    return null;
  }

  function timeMs(value) {
    var text = clean(value);
    if (!text) return 0;
    var ms = Date.parse(text);
    return isNaN(ms) ? 0 : ms;
  }

  function safeJson(value, depth, seen) {
    if (value === undefined || value === null) return value;
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return value;
    if (typeof value === "function") {
      return "[Function " + (value.name || "anonymous") + "]";
    }

    depth = depth || 0;
    seen = seen || [];

    if (depth > 5) return "[DepthLimit]";

    if (typeof Node !== "undefined" && value instanceof Node) {
      return "[DOM " + value.nodeName + "]";
    }

    if (typeof Window !== "undefined" && value instanceof Window) {
      return "[Window]";
    }

    if (seen.indexOf(value) >= 0) return "[Circular]";
    seen.push(value);

    if (Array.isArray(value)) {
      return value.slice(0, 80).map(function (item) {
        return safeJson(item, depth + 1, seen);
      });
    }

    if (isObject(value)) {
      var out = {};
      Object.keys(value)
        .slice(0, 180)
        .forEach(function (key) {
          if (
            /element|node|context|canvas|document|window/i.test(key) &&
            typeof value[key] === "object"
          ) {
            out[key] = "[Object suppressed]";
            return;
          }
          out[key] = safeJson(value[key], depth + 1, seen);
        });
      return out;
    }

    return stringValue(value, "");
  }

  function getPath(path) {
    try {
      var parts = stringValue(path, "").replace(/^window\./, "").split(".");
      var cursor = ROOT;

      for (var i = 0; i < parts.length; i += 1) {
        var part = parts[i];
        if (!part) continue;
        if (!cursor || cursor[part] === undefined || cursor[part] === null) {
          return null;
        }
        cursor = cursor[part];
      }

      return cursor || null;
    } catch (_error) {
      return null;
    }
  }

  function setPath(path, value) {
    try {
      var parts = stringValue(path, "").replace(/^window\./, "").split(".");
      var cursor = ROOT;

      for (var i = 0; i < parts.length - 1; i += 1) {
        var part = parts[i];
        if (!part) continue;
        if (!cursor[part] || typeof cursor[part] !== "object") {
          cursor[part] = {};
        }
        cursor = cursor[part];
      }

      cursor[parts[parts.length - 1]] = value;
      return true;
    } catch (_error) {
      return false;
    }
  }

  function parseKvText(text) {
    var out = {};
    stringValue(text, "")
      .split(/\r?\n/)
      .forEach(function (line) {
        var idx = line.indexOf("=");
        if (idx <= 0) return;
        var key = line.slice(0, idx).trim();
        var value = line.slice(idx + 1).trim();
        if (key) out[key] = value;
      });
    return out;
  }

  function deepGet(source, keys, maxDepth) {
    var targetKeys = (keys || []).map(function (key) {
      return stringValue(key, "").toLowerCase();
    });
    var seen = [];

    function visit(value, depth) {
      if (!value || depth > (maxDepth || 6)) return undefined;
      if (!isObject(value) && !Array.isArray(value)) return undefined;
      if (seen.indexOf(value) >= 0) return undefined;
      seen.push(value);

      if (isObject(value)) {
        var objectKeys = Object.keys(value);

        for (var i = 0; i < objectKeys.length; i += 1) {
          var key = objectKeys[i];
          if (targetKeys.indexOf(key.toLowerCase()) >= 0) {
            var found = value[key];
            if (found !== undefined && found !== null && found !== "") {
              return found;
            }
          }
        }

        for (var j = 0; j < objectKeys.length; j += 1) {
          var nestedKey = objectKeys[j];
          var nested = visit(value[nestedKey], depth + 1);
          if (nested !== undefined && nested !== null && nested !== "") {
            return nested;
          }
        }
      }

      if (Array.isArray(value)) {
        for (var k = 0; k < value.length; k += 1) {
          var foundInArray = visit(value[k], depth + 1);
          if (
            foundInArray !== undefined &&
            foundInArray !== null &&
            foundInArray !== ""
          ) {
            return foundInArray;
          }
        }
      }

      return undefined;
    }

    return visit(source, 0);
  }

  function firstField(sources, keys, fallback) {
    var list = Array.isArray(sources) ? sources : [sources];

    for (var i = 0; i < list.length; i += 1) {
      var found = deepGet(list[i], keys);
      if (found !== undefined && found !== null && found !== "") {
        return clean(found, 1200);
      }
    }

    return fallback === undefined ? "" : fallback;
  }

  function findAuthority(paths) {
    for (var i = 0; i < paths.length; i += 1) {
      var path = paths[i];
      var authority = getPath(path);
      if (authority) {
        return {
          path: path,
          authority: authority,
          authorityPresent: true
        };
      }
    }

    return {
      path: "NONE",
      authority: null,
      authorityPresent: false
    };
  }

  function acceptedContract(contract, accepted) {
    var text = clean(contract);
    if (!text) return false;

    for (var i = 0; i < accepted.length; i += 1) {
      if (text === accepted[i]) return true;
    }

    return false;
  }

  function readAuthorityPacket(authority, options) {
    options = options || {};
    if (!authority) return {};

    var methods = [];

    if (options.invoke === true) {
      methods = methods.concat([
        "runDiagnostic",
        "run",
        "inspect",
        "probe",
        "measure"
      ]);
    }

    methods = methods.concat([
      "getReport",
      "getReceiptLight",
      "getReceipt",
      "getStatus",
      "getStatusText",
      "getState"
    ]);

    for (var i = 0; i < methods.length; i += 1) {
      var method = methods[i];

      if (!isFunction(authority[method])) continue;

      try {
        var result;

        if (method === "getReceiptLight") {
          result = authority[method](false);
        } else {
          result = authority[method](options.callOptions || {});
        }

        if (isObject(result) || Array.isArray(result)) return safeJson(result);
        if (typeof result === "string" && result.trim()) {
          return parseKvText(result);
        }
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return safeJson(authority.receipt);
    if (isObject(authority.state)) return safeJson(authority.state);
    if (isObject(authority.evidence)) return safeJson(authority.evidence);

    return safeJson(authority);
  }

  function createInitialState() {
    var now = nowIso();

    return {
      timestamp: now,
      publishedAt: now,
      lastRunAt: "",
      runCount: 0,
      aliasPublishCount: 0,
      receiptPublishCount: 0,
      datasetPublishCount: 0,
      errorCount: 0,
      errors: [],

      trustState: TRUST_STATE.NOT_RUN,
      adjudicationRunState: "PUBLISHED_LIGHT_RECEIPT_ONLY",
      autoFinalizedOnLoad: false,
      explicitRunRequired: true,

      northStandardStatus: "PUBLISHED_NOT_RUN",
      northCompatibilityBridgeStatus: "UNKNOWN",

      northRailStatus: "PUBLISHED_NOT_RUN_CURRENT_AUTHORITY_RECHECK_REQUIRED",
      northRailVerdictAvailable: false,
      northRailAuthorityPath: "UNKNOWN",
      northRailTrustState: TRUST_STATE.NOT_RUN,

      surfaceTruthStatus: "PUBLISHED_NOT_RUN",
      surfaceTruthFailureClass: "UNKNOWN",
      surfaceTruthFirstFailedCoordinate: "UNKNOWN",
      surfaceTruthTrustState: TRUST_STATE.NOT_RUN,

      stalePacketQuarantineActive: true,
      stalePreNorthPacketQuarantined: false,
      noSourcePacketQuarantined: false,
      currentAuthorityOutranksStoredState: true,

      cycleClosed: false,
      outerCycleClosed: false,
      cycleClosureStatus: "WEST_PUBLISHED_AWAITING_EXPLICIT_RUN",

      westDecision: WEST_DECISION.HOLD,
      westGapClass: WEST_GAP_CLASS.STRUCTURAL_BLOCK,
      westForwardAllowed: false,
      canvasReleaseAuthorized: false,
      canvasReleasePacketReady: false,
      releaseToCanvas: false,
      releasePacket: null,

      constructionReadinessStatus:
        "WEST_PUBLISHED_AWAITING_EXPLICIT_CURRENT_AUTHORITY_RECHECK",

      firstOpenDutyCoordinate: "WEST_EXPLICIT_RUN",
      firstOpenDutyClass: "NOT_RUN",
      firstOpenDutyReason:
        "West published a light receipt only. Full admissibility requires explicit run.",
      firstOpenDutyFile: FILE,
      firstOpenDutyOwner: "WEST",

      recommendedNextFile: FILE,
      recommendedNextAction: "RUN_WEST_CURRENT_AUTHORITY_RECHECK",

      f13Claimed: false,
      f13EligibleForCanvas: false,
      f13ClaimedByWest: false,
      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21EligibilitySubmittedToNorth: false,
      f21Claimed: false,
      f21ClaimedByWest: false,
      readyTextPermissionGranted: false,
      readyTextAllowed: false,
      readyTextClaimed: false,
      completionLatched: false,
      finalCompletionLatched: false,
      degradedCompletionLatched: false,
      visualPassClaimed: false,
      finalVisualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      webgl: false,
      productionMutationAuthorized: false,
      canvasMutationAuthorized: false,
      canvasDrawingAuthorized: false,
      canvasRepairAuthorized: false,
      canvasBuildAuthorityClaimed: false,
      routeRepairAuthorized: false,
      controlsRepairAuthorized: false,
      runtimeRestartAuthorized: false,

      lastNorthStandardPacket: null,
      lastNorthRailPacket: null,
      lastSurfaceTruthPacket: null,
      lastReceipt: null
    };
  }

  function readNorthStandardPacket() {
    var found = findAuthority(LAB_NORTH_ALIASES);
    var authority = found.authority;
    var packet = readAuthorityPacket(authority, { invoke: false });

    var contract =
      firstField([packet, authority], ["CONTRACT", "contract"], "") || "";
    var accepted = acceptedContract(contract, ACCEPTED_LAB_NORTH_CONTRACTS);

    var compatibilityBridgeActive =
      accepted &&
      contract !== "LAB_RUNTIME_TABLE_MULTI_FUNCTION_ANIMATION_STANDARD_TNT_v1";

    return {
      sourceAlias: found.path,
      authorityPresent: found.authorityPresent,
      contract: contract || "UNKNOWN",
      contractAccepted: accepted,
      northStandardAccepted: Boolean(found.authorityPresent && accepted),
      compatibilityBridgeActive: compatibilityBridgeActive,
      status:
        found.authorityPresent && accepted
          ? "NORTH_STANDARD_ACCEPTED"
          : "NORTH_STANDARD_MISSING_OR_UNRECOGNIZED",
      packet: packet
    };
  }

  function readCurrentNorth(options) {
    options = options || {};

    var found = findAuthority(NORTH_RAIL_ALIASES);
    var authority = found.authority;

    var packet = readAuthorityPacket(authority, {
      invoke: options.invokeNorthDiagnostic === true,
      callOptions: {
        calledBy: "LAB_RUNTIME_TABLE_WEST_CURRENT_AUTHORITY_RECHECK",
        mutationAuthorized: false,
        canvasBuildAuthorized: false
      }
    });

    var contract = firstField(
      [packet, authority],
      ["CONTRACT", "contract", "internalRenewalContract", "INTERNAL_RENEWAL_CONTRACT"],
      ""
    );

    var northVerdictAvailableRaw = firstField(
      [authority, packet],
      [
        "NORTH_VERDICT_AVAILABLE",
        "northVerdictAvailable",
        "northRailVerdictAvailable"
      ],
      ""
    );

    var northVerdictStatus = firstField(
      [packet, authority],
      ["NORTH_VERDICT_STATUS", "northVerdictStatus", "verdictStatus"],
      ""
    );

    var northVerdictClass = firstField(
      [packet, authority],
      ["NORTH_VERDICT_CLASS", "northVerdictClass", "verdictClass"],
      ""
    );

    var directAuthorityAvailable =
      boolValue(firstField([authority], ["NORTH_VERDICT_AVAILABLE"], "")) ===
      true;

    var packetVerdictAvailable =
      boolValue(northVerdictAvailableRaw) === true ||
      clean(northVerdictStatus).indexOf("NORTH_DIAGNOSTIC_TRACK_PACKET_RETURNED") >=
        0 ||
      clean(northVerdictClass).indexOf("NORTH_RAIL_RESTORED") >= 0;

    var northVerdictAvailable = Boolean(
      found.authorityPresent &&
        (directAuthorityAvailable || packetVerdictAvailable)
    );

    var accepted = acceptedContract(contract, ACCEPTED_NORTH_RAIL_CONTRACTS);

    var publishedAt = firstField(
      [authority, packet],
      ["publishedAt", "PUBLISHED_AT", "lastReceiptAt", "GENERATED_AT", "timestamp"],
      ""
    );

    var trustState = found.authorityPresent
      ? TRUST_STATE.CURRENT
      : TRUST_STATE.NOT_RUN;

    var status;
    if (!found.authorityPresent) {
      status = "NORTH_DIAGNOSTIC_RAIL_AUTHORITY_NOT_FOUND";
    } else if (!accepted && contract) {
      status = "NORTH_DIAGNOSTIC_RAIL_CONTRACT_NOT_RECOGNIZED";
    } else if (northVerdictAvailable) {
      status = "NORTH_CURRENT_VERDICT_AVAILABLE";
    } else {
      status = "NORTH_CURRENT_VERDICT_UNAVAILABLE";
    }

    return {
      sourceAlias: found.path,
      authorityPresent: found.authorityPresent,
      contract: contract || "UNKNOWN",
      contractAccepted: accepted,
      packet: packet,
      publishedAt: publishedAt,
      northVerdictAvailable: northVerdictAvailable,
      northVerdictStatus: northVerdictStatus || "UNKNOWN",
      northVerdictClass: northVerdictClass || "UNKNOWN",
      status: status,
      trustState: trustState,
      directAuthorityOutrankedStoredState: northVerdictAvailable
    };
  }

  function readSurfaceTruthDirect(options) {
    options = options || {};

    var found = findAuthority(SURFACE_TRUTH_ALIASES);
    var authority = found.authority;

    var packet = readAuthorityPacket(authority, {
      invoke: options.invokeSurfaceTruth === true,
      callOptions: {
        calledBy: "LAB_RUNTIME_TABLE_WEST_CURRENT_AUTHORITY_RECHECK",
        mutationAuthorized: false,
        canvasBuildAuthorized: false
      }
    });

    var contract = firstField(
      [packet, authority],
      ["CONTRACT", "contract"],
      ""
    );

    var status = firstField(
      [packet, authority],
      [
        "CANVAS_SURFACE_TRUTH_STATUS",
        "SURFACE_TRUTH_STATUS",
        "surfaceTruthStatus",
        "status"
      ],
      ""
    );

    var failureClass = firstField(
      [packet, authority],
      [
        "CANVAS_SURFACE_TRUTH_FAILURE_CLASS",
        "SURFACE_TRUTH_FAILURE_CLASS",
        "surfaceTruthFailureClass",
        "failureClass"
      ],
      "UNKNOWN"
    );

    var firstFailedCoordinate = firstField(
      [packet, authority],
      [
        "CANVAS_TRUTH_FIRST_FAILED_COORDINATE",
        "SURFACE_TRUTH_FIRST_FAILED_COORDINATE",
        "surfaceTruthFirstFailedCoordinate",
        "firstFailedCoordinate"
      ],
      "UNKNOWN"
    );

    var accepted = acceptedContract(contract, ACCEPTED_SURFACE_TRUTH_CONTRACTS);

    var statusText = clean(status).toUpperCase();
    var hasMeasurement =
      statusText.indexOf("COMPLETE") >= 0 ||
      statusText.indexOf("PASS") >= 0 ||
      statusText.indexOf("FAILED") >= 0 ||
      statusText.indexOf("MEASURED") >= 0;

    var failed =
      statusText.indexOf("FAILED") >= 0 ||
      failureClass === "SURFACE_CONTRACT_MEASUREMENT_FAILED";

    var trustState;
    if (!found.authorityPresent) {
      trustState = TRUST_STATE.NOT_RUN;
    } else if (!hasMeasurement) {
      trustState = TRUST_STATE.PROFILE_ONLY;
    } else {
      trustState = TRUST_STATE.CURRENT;
    }

    if (found.authorityPresent && !status) {
      status = "PROFILE_PRESENT_MEASUREMENT_NOT_RUN";
    }

    return {
      sourceAlias: found.path,
      authorityPresent: found.authorityPresent,
      contract: contract || "UNKNOWN",
      contractAccepted: accepted,
      packet: packet,
      status: status || "SURFACE_TRUTH_NOT_RUN",
      failureClass: failureClass,
      firstFailedCoordinate: firstFailedCoordinate,
      hasMeasurement: hasMeasurement,
      failed: failed,
      trustState: trustState
    };
  }

  function classifyPacketTrust(packet, currentNorth) {
    if (!packet) return TRUST_STATE.UNKNOWN;

    var source = firstField([packet], ["SOURCE", "source"], "");
    if (source === "NONE") return TRUST_STATE.NO_SOURCE_CONTEXT;

    var statusText = clean(
      firstField(
        [packet],
        [
          "PROBE_EAST_RUN_STATUS",
          "probeEastRunStatus",
          "SURFACE_TRUTH_STATUS",
          "CANVAS_SURFACE_TRUTH_STATUS",
          "status"
        ],
        ""
      )
    ).toUpperCase();

    if (
      statusText.indexOf("WAITING_RUN") >= 0 ||
      statusText.indexOf("NOT_RUN") >= 0 ||
      statusText.indexOf("PROFILE_PRESENT") >= 0
    ) {
      return TRUST_STATE.NOT_RUN;
    }

    var packetTime = timeMs(
      firstField([packet], ["GENERATED_AT", "timestamp", "updatedAt"], "")
    );
    var northTime = timeMs(currentNorth && currentNorth.publishedAt);

    if (packetTime && northTime && packetTime < northTime) {
      return TRUST_STATE.STALE_PRE_NORTH;
    }

    return TRUST_STATE.CURRENT;
  }

  function selfMeasureWestDuty() {
    return {
      DIAGNOSTIC_FILE: FILE,
      ASSIGNED_ROLE: "WEST_ADMISSIBILITY_DERIVATIVE_RELEASE",
      ALLOWED_DUTIES: [
        "READ_LAB_NORTH_STANDARD",
        "REREAD_CURRENT_NORTH_AUTHORITY",
        "CONSUME_SURFACE_TRUTH_AS_EVIDENCE",
        "QUARANTINE_STALE_PRE_NORTH_PACKETS",
        "RETURN_WEST_ADMISSIBILITY_PACKET",
        "PUBLISH_CANVAS_RELEASE_PACKET_ONLY_WHEN_ADMISSIBLE"
      ],
      FORBIDDEN_DUTIES: [
        "PRODUCTION_MUTATION",
        "CANVAS_DRAWING",
        "CANVAS_REPAIR_AUTHORIZATION",
        "ROUTE_REPAIR_AUTHORIZATION",
        "CONTROLS_REPAIR_AUTHORIZATION",
        "RUNTIME_RESTART_AUTHORIZATION",
        "NORTH_GRAMMAR_REPLACEMENT",
        "NORTH_RAIL_REPLACEMENT",
        "SURFACE_TRUTH_PROBE_REPLACEMENT",
        "FINAL_VISUAL_PASS_CLAIM"
      ],
      PRIMARY_DUTY_COUNT: 2,
      SECONDARY_DUTY_COUNT: 4,
      MUTATION_AUTHORITY_COUNT: 0,
      WRITE_AUTHORITY_COUNT: 0,
      DUTY_LOAD_STATUS: "DUTY_LOAD_SAFE",
      DIAGNOSTIC_MALPRACTICE_DETECTED: false,
      DIAGNOSTIC_CONTAINER_COLLAPSE_DETECTED: false,
      SELF_MEASUREMENT_STATUS: "DIAGNOSTIC_SELF_DUTY_CLEAN"
    };
  }

  function resolveFailure(labNorth, currentNorth, surfaceTruth, selfMeasurement) {
    if (
      selfMeasurement &&
      selfMeasurement.DIAGNOSTIC_MALPRACTICE_DETECTED === true
    ) {
      return {
        gapClass: WEST_GAP_CLASS.DIAGNOSTIC_MALPRACTICE_GUARD_HELD,
        coordinate: "WEST_SELF_MEASUREMENT",
        owner: "WEST",
        file: FILE,
        reason: "West self-measurement detected diagnostic duty malpractice.",
        nextAction: "RENEW_WEST_DUTY_BOUNDARY_BEFORE_CANVAS_RELEASE"
      };
    }

    if (!labNorth || !labNorth.northStandardAccepted) {
      return {
        gapClass: WEST_GAP_CLASS.NORTH_STANDARD_MISSING,
        coordinate: "LAB_NORTH_STANDARD",
        owner: "LAB_NORTH",
        file: LAB_NORTH_FILE,
        reason: "LabNorth standard is missing or not recognized.",
        nextAction: "RESTORE_LAB_NORTH_STANDARD_BEFORE_WEST_ADMISSIBILITY"
      };
    }

    if (!currentNorth || !currentNorth.authorityPresent) {
      return {
        gapClass: WEST_GAP_CLASS.NORTH_DIAGNOSTIC_RAIL_MISSING,
        coordinate: "NORTH_DIAGNOSTIC_RAIL",
        owner: "JUDGE_NORTH",
        file: NORTH_RAIL_FILE,
        reason: "Current North authority could not be found through any accepted alias.",
        nextAction: "RESTORE_NORTH_DIAGNOSTIC_RAIL_ALIAS_PUBLICATION"
      };
    }

    if (!currentNorth.northVerdictAvailable) {
      return {
        gapClass: WEST_GAP_CLASS.NORTH_RAIL_VERDICT_UNAVAILABLE,
        coordinate: "NORTH_DIAGNOSTIC_RAIL",
        owner: "JUDGE_NORTH",
        file: NORTH_RAIL_FILE,
        reason:
          "Current North authority is present but did not expose a readable North verdict.",
        nextAction: "RUN_OR_RENEW_NORTH_DIAGNOSTIC_RAIL_RECEIPT_RETURN"
      };
    }

    if (!surfaceTruth || !surfaceTruth.authorityPresent) {
      return {
        gapClass: WEST_GAP_CLASS.SURFACE_TRUTH_UNMEASURED,
        coordinate: "SURFACE_TRUTH_PROBE",
        owner: "SURFACE_TRUTH_PROBE",
        file: SURFACE_TRUTH_FILE,
        reason: "Surface Truth authority is missing from the current diagnostic field.",
        nextAction: "RESTORE_SURFACE_TRUTH_PROBE_BEFORE_CANVAS_BUILD"
      };
    }

    if (surfaceTruth.failed) {
      return {
        gapClass: WEST_GAP_CLASS.SURFACE_TRUTH_FAILURE,
        coordinate: "SURFACE_TRUTH_ALIGNMENT",
        owner: "SURFACE_TRUTH_PROBE",
        file: SURFACE_TRUTH_FILE,
        reason:
          "Surface Truth measurement failed before Canvas build could be admitted.",
        nextAction: "ALIGN_SURFACE_TRUTH_CONTRACT_DEFINITION_BEFORE_CANVAS_BUILD"
      };
    }

    if (!surfaceTruth.hasMeasurement) {
      return {
        gapClass: WEST_GAP_CLASS.SURFACE_TRUTH_UNMEASURED,
        coordinate: "SURFACE_TRUTH_ALIGNMENT",
        owner: "SURFACE_TRUTH_PROBE",
        file: SURFACE_TRUTH_FILE,
        reason:
          "Surface Truth v3 is present, but only profile evidence is available. Measurement has not run.",
        nextAction: "RUN_SURFACE_TRUTH_MEASUREMENT_BEFORE_CANVAS_BUILD"
      };
    }

    return null;
  }

  function applyHold(failure) {
    state.cycleClosed = false;
    state.outerCycleClosed = false;
    state.cycleClosureStatus =
      "CYCLE_OPEN_HELD_BY_" + clean(failure.gapClass);
    state.westDecision = WEST_DECISION.HOLD;
    state.westGapClass = failure.gapClass;
    state.westForwardAllowed = false;
    state.canvasReleaseAuthorized = false;
    state.canvasReleasePacketReady = false;
    state.releaseToCanvas = false;
    state.releasePacket = null;
    state.constructionReadinessStatus =
      "CONSTRUCTION_HELD_" + clean(failure.gapClass);
    state.firstOpenDutyCoordinate = failure.coordinate;
    state.firstOpenDutyClass = failure.gapClass;
    state.firstOpenDutyReason = failure.reason;
    state.firstOpenDutyFile = failure.file;
    state.firstOpenDutyOwner = failure.owner;
    state.recommendedNextFile = failure.file;
    state.recommendedNextAction = failure.nextAction;
  }

  function composeReleasePacket(context) {
    return {
      PACKET_NAME:
        "LAB_RUNTIME_TABLE_WEST_CANVAS_RETURN_RECEIPT_RELEASE_PACKET_v5_4",
      CONTRACT: PUBLIC_CONTRACT,
      RECEIPT: PUBLIC_RECEIPT,
      INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
      COMPAT_INTERNAL_RENEWAL_CONTRACT: COMPAT_INTERNAL_RENEWAL_CONTRACT,
      VERSION: VERSION,
      FILE: FILE,
      ROUTE: ROUTE,
      DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,
      GENERATED_AT: nowIso(),
      WEST_DECISION: WEST_DECISION.RELEASE_TO_CANVAS_RETURN_RECEIPT,
      WEST_GAP_CLASS: WEST_GAP_CLASS.NONE,
      NORTH_CURRENT_AUTHORITY_RECHECK_STATUS: "PASS",
      NORTH_VERDICT_AVAILABLE: true,
      SURFACE_TRUTH_STATUS: context.surfaceTruth.status,
      SURFACE_TRUTH_FAILURE_CLASS: context.surfaceTruth.failureClass,
      CANVAS_RELEASE_AUTHORIZED: true,
      CANVAS_BUILD_AUTHORIZED: false,
      CANVAS_REPAIR_AUTHORIZED: false,
      PRODUCTION_MUTATION_AUTHORIZED: false,
      F13_CLAIMED: false,
      F21_CLAIMED: false,
      READY_TEXT_CLAIMED: false,
      VISUAL_PASS_CLAIMED: false,
      GENERATED_IMAGE: false,
      GRAPHIC_BOX: false,
      WEBGL: false,
      NEXT_PROCESS: "RETURN_CANVAS_RECEIPT_FOR_CANVAS_BOUNDARY_REVIEW",
      NEXT_FILE: "/assets/hearth/hearth.canvas.js"
    };
  }

  function applyRelease(context) {
    state.cycleClosed = true;
    state.outerCycleClosed = true;
    state.cycleClosureStatus = "CYCLE_CLOSED_BY_CURRENT_AUTHORITY_RECHECK";
    state.westDecision = WEST_DECISION.RELEASE_TO_CANVAS_RETURN_RECEIPT;
    state.westGapClass = WEST_GAP_CLASS.NONE;
    state.westForwardAllowed = true;
    state.canvasReleaseAuthorized = true;
    state.canvasReleasePacketReady = true;
    state.releaseToCanvas = true;
    state.releasePacket = composeReleasePacket(context);
    state.constructionReadinessStatus =
      "CONSTRUCTION_READY_FOR_CANVAS_RETURN_RECEIPT_RELEASE";
    state.firstOpenDutyCoordinate = "NONE";
    state.firstOpenDutyClass = "NONE";
    state.firstOpenDutyReason = "No West blocker detected.";
    state.firstOpenDutyFile = "NONE";
    state.firstOpenDutyOwner = "NONE";
    state.recommendedNextFile = "/assets/hearth/hearth.canvas.js";
    state.recommendedNextAction =
      "REVIEW_CANVAS_BOUNDARY_WITH_WEST_RELEASE_PACKET";
  }

  function runNorthStandardDerivativeReleaseAudit(options) {
    options = options || {};

    state.timestamp = nowIso();
    state.lastRunAt = state.timestamp;
    state.runCount += 1;
    state.trustState = TRUST_STATE.CURRENT;
    state.adjudicationRunState = "EXPLICIT_RUN_COMPLETE";
    state.autoFinalizedOnLoad = false;

    var selfMeasurement = selfMeasureWestDuty();
    var labNorth = readNorthStandardPacket();

    var currentNorth = readCurrentNorth({
      invokeNorthDiagnostic: options.invokeNorthDiagnostic !== false
    });

    var surfaceTruth = readSurfaceTruthDirect({
      invokeSurfaceTruth: options.invokeSurfaceTruth === true
    });

    var staleTrust = classifyPacketTrust(state.lastReceipt, currentNorth);
    state.stalePreNorthPacketQuarantined =
      staleTrust === TRUST_STATE.STALE_PRE_NORTH;
    state.noSourcePacketQuarantined =
      staleTrust === TRUST_STATE.NO_SOURCE_CONTEXT;

    state.northStandardStatus = labNorth.status;
    state.northCompatibilityBridgeStatus = labNorth.compatibilityBridgeActive
      ? "COMPATIBILITY_BRIDGE_ACTIVE"
      : "DIRECT_STANDARD_ACCEPTED";

    state.northRailStatus = currentNorth.status;
    state.northRailVerdictAvailable = currentNorth.northVerdictAvailable;
    state.northRailAuthorityPath = currentNorth.sourceAlias;
    state.northRailTrustState = currentNorth.trustState;

    state.surfaceTruthStatus = surfaceTruth.status;
    state.surfaceTruthFailureClass = surfaceTruth.failureClass;
    state.surfaceTruthFirstFailedCoordinate =
      surfaceTruth.firstFailedCoordinate;
    state.surfaceTruthTrustState = surfaceTruth.trustState;

    state.lastNorthStandardPacket = labNorth;
    state.lastNorthRailPacket = currentNorth;
    state.lastSurfaceTruthPacket = surfaceTruth;

    var failure = resolveFailure(
      labNorth,
      currentNorth,
      surfaceTruth,
      selfMeasurement
    );

    if (failure) {
      applyHold(failure);
    } else {
      applyRelease({
        labNorth: labNorth,
        currentNorth: currentNorth,
        surfaceTruth: surfaceTruth,
        selfMeasurement: selfMeasurement
      });
    }

    state.lastReceipt = composeReceipt("WEST_CURRENT_AUTHORITY_RECHECK_RECEIPT");
    publishReceiptAliases();
    updateDataset();

    return state.lastReceipt;
  }

  function noOpLifecycle() {
    state.timestamp = nowIso();
    state.adjudicationRunState =
      "LIFECYCLE_NO_OP_LIGHT_RECEIPT_ONLY_EXPLICIT_RUN_REQUIRED";
    state.autoFinalizedOnLoad = false;
    state.explicitRunRequired = true;
    state.lastReceipt = composeReceipt("WEST_LIGHT_RECEIPT");
    publishReceiptAliases();
    updateDataset();
    return state.lastReceipt;
  }

  function inspectAuthority() {
    return {
      PACKET_NAME: "LAB_RUNTIME_TABLE_WEST_AUTHORITY_INSPECTION_PACKET_v5_4",
      CONTRACT: PUBLIC_CONTRACT,
      RECEIPT: PUBLIC_RECEIPT,
      INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      VERSION: VERSION,
      FILE: FILE,
      GENERATED_AT: nowIso(),
      WEST_ALIAS_COUNT: WEST_ALIAS_PATHS.length,
      WEST_RECEIPT_ALIAS_COUNT: WEST_RECEIPT_ALIAS_PATHS.length,
      CURRENT_AUTHORITY_RECHECK_ACTIVE: true,
      AUTO_FINALIZE_ON_LOAD: false,
      EXPLICIT_RUN_REQUIRED: true,
      PUBLIC_CONTRACT_PRESERVED: true,
      V5_3_COMPATIBILITY_PRESERVED: true,
      NO_PRODUCTION_MUTATION: true,
      NO_CANVAS_DRAWING: true,
      NO_CANVAS_REPAIR: true,
      NO_RUNTIME_RESTART: true
    };
  }

  function inspectCoreNodes() {
    return {
      PACKET_NAME: "LAB_RUNTIME_TABLE_WEST_CORE_NODE_INSPECTION_PACKET_v5_4",
      CONTRACT: PUBLIC_CONTRACT,
      INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      GENERATED_AT: nowIso(),
      LAB_NORTH: readNorthStandardPacket(),
      NORTH_RAIL: readCurrentNorth({ invokeNorthDiagnostic: false }),
      SURFACE_TRUTH: readSurfaceTruthDirect({ invokeSurfaceTruth: false })
    };
  }

  function inspectJudgeNodes() {
    return {
      PACKET_NAME: "LAB_RUNTIME_TABLE_WEST_JUDGE_NODE_INSPECTION_PACKET_v5_4",
      CONTRACT: PUBLIC_CONTRACT,
      INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      GENERATED_AT: nowIso(),
      JUDGE_NORTH: readCurrentNorth({ invokeNorthDiagnostic: false }),
      SURFACE_TRUTH_PROBE: readSurfaceTruthDirect({ invokeSurfaceTruth: false }),
      WEST_SELF: selfMeasureWestDuty()
    };
  }

  function inspectRelationships() {
    return {
      PACKET_NAME: "LAB_RUNTIME_TABLE_WEST_RELATIONSHIP_PACKET_v5_4",
      CONTRACT: PUBLIC_CONTRACT,
      INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      GENERATED_AT: nowIso(),
      RELATIONSHIP_1:
        "LAB_NORTH_STANDARD -> NORTH_DIAGNOSTIC_RAIL -> WEST_ADMISSIBILITY",
      RELATIONSHIP_2:
        "SURFACE_TRUTH_PROBE -> WEST_ADMISSIBILITY -> CANVAS_BOUNDARY_REVIEW",
      RELATIONSHIP_3:
        "CURRENT_AUTHORITY_RECHECK_OUTRANKS_STALE_STORED_STATE",
      RELATIONSHIP_4:
        "STALE_PRE_NORTH_OR_NO_SOURCE_PACKETS_ARE_QUARANTINED",
      RELATIONSHIP_5:
        "WEST_DOES_NOT_MUTATE_PRODUCTION_OR_REPAIR_CANVAS"
    };
  }

  function getHierarchyRegistry() {
    return {
      LAB_NORTH_FILE: LAB_NORTH_FILE,
      LAB_WEST_FILE: LAB_WEST_FILE,
      NORTH_RAIL_FILE: NORTH_RAIL_FILE,
      SURFACE_TRUTH_FILE: SURFACE_TRUTH_FILE,
      EAST_PROBE_FILE: EAST_PROBE_FILE,
      SOUTH_RAIL_FILE: SOUTH_RAIL_FILE,
      ACTIVE_STAGE_ID: ACTIVE_STAGE_ID,
      ACTIVE_CARDINAL: ACTIVE_CARDINAL,
      ACTIVE_FIBONACCI: ACTIVE_FIBONACCI,
      ACTIVE_NEWS_GATE: ACTIVE_NEWS_GATE,
      ACTIVE_CYCLE_NUMBER: ACTIVE_CYCLE_NUMBER,
      ACTIVE_CYCLE_ROUTE: ACTIVE_CYCLE_ROUTE
    };
  }

  function getHierarchySurface() {
    return {
      PACKET_NAME: "LAB_RUNTIME_TABLE_WEST_HIERARCHY_SURFACE_v5_4",
      CONTRACT: PUBLIC_CONTRACT,
      INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      GENERATED_AT: nowIso(),
      REGISTRY: getHierarchyRegistry(),
      WEST_ROLE:
        "ADMISSIBILITY_DERIVATIVE_RELEASE_CURRENT_AUTHORITY_RECHECK",
      WEST_BOUNDARY:
        "NO_PRODUCTION_MUTATION_NO_CANVAS_DRAWING_NO_CANVAS_REPAIR_NO_FINAL_VISUAL_PASS"
    };
  }

  function getBishopChord() {
    return {
      PACKET_NAME: "LAB_RUNTIME_TABLE_WEST_BISHOP_CHORD_PACKET_v5_4",
      CONTRACT: PUBLIC_CONTRACT,
      INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      GENERATED_AT: nowIso(),
      CHORD:
        "NORTH_CURRENT_AUTHORITY -> SURFACE_TRUTH_EVIDENCE -> WEST_ADMISSIBILITY -> CANVAS_BOUNDARY_REVIEW",
      BISHOP_RECEIPT_TRUST_ACTIVE: true,
      STALE_PACKET_QUARANTINE_ACTIVE: true
    };
  }

  function getJudgeMetrics() {
    return {
      PACKET_NAME: "LAB_RUNTIME_TABLE_WEST_JUDGE_METRICS_PACKET_v5_4",
      CONTRACT: PUBLIC_CONTRACT,
      INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      GENERATED_AT: nowIso(),
      NORTH_RAIL_STATUS: state.northRailStatus,
      NORTH_VERDICT_AVAILABLE: state.northRailVerdictAvailable,
      SURFACE_TRUTH_STATUS: state.surfaceTruthStatus,
      WEST_DECISION: state.westDecision,
      WEST_GAP_CLASS: state.westGapClass,
      CONSTRUCTION_READINESS_STATUS: state.constructionReadinessStatus
    };
  }

  function getState() {
    return safeJson(state);
  }

  function getCanvasReleasePacket() {
    return state.releasePacket || null;
  }

  function clearReleasePacket() {
    state.releasePacket = null;
    state.canvasReleasePacketReady = false;
    state.canvasReleaseAuthorized = false;
    state.releaseToCanvas = false;
    publishReceiptAliases();
    return getReceiptLight(false);
  }

  function publishReleasePacket() {
    if (!state.releasePacket) return null;

    setPath("HEARTH_CANVAS_RELEASE_PACKET", state.releasePacket);
    setPath("HEARTH_WEST_CANVAS_RELEASE_PACKET", state.releasePacket);
    setPath("LAB_RUNTIME_TABLE_WEST_CANVAS_RELEASE_PACKET", state.releasePacket);
    setPath("HEARTH.canvasReleasePacket", state.releasePacket);
    setPath("HEARTH.westCanvasReleasePacket", state.releasePacket);
    setPath("DEXTER_LAB.hearthWestCanvasReleasePacket", state.releasePacket);

    return state.releasePacket;
  }

  function composeReceipt(packetName) {
    return {
      PACKET_NAME:
        packetName ||
        "LAB_RUNTIME_TABLE_WEST_CURRENT_AUTHORITY_RECHECK_RECEIPT_v5_4",
      CONTRACT: PUBLIC_CONTRACT,
      RECEIPT: PUBLIC_RECEIPT,
      INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
      COMPAT_INTERNAL_RENEWAL_CONTRACT: COMPAT_INTERNAL_RENEWAL_CONTRACT,
      COMPAT_INTERNAL_RENEWAL_RECEIPT: COMPAT_INTERNAL_RENEWAL_RECEIPT,
      PREVIOUS_INTERNAL_RENEWAL_CONTRACT:
        PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      PREVIOUS_INTERNAL_RENEWAL_RECEIPT: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      VERSION: VERSION,
      FILE: FILE,
      ROUTE: ROUTE,
      DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,
      GENERATED_AT: nowIso(),

      ACTIVE_STAGE_ID: ACTIVE_STAGE_ID,
      ACTIVE_CARDINAL: ACTIVE_CARDINAL,
      ACTIVE_FIBONACCI: ACTIVE_FIBONACCI,
      ACTIVE_NEWS_GATE: ACTIVE_NEWS_GATE,
      ACTIVE_CYCLE_NUMBER: ACTIVE_CYCLE_NUMBER,
      ACTIVE_CYCLE_ROUTE: ACTIVE_CYCLE_ROUTE,

      PUBLIC_CONTRACT_PRESERVED: true,
      V5_3_COMPATIBILITY_PRESERVED: true,
      V5_4_CURRENT_AUTHORITY_RECHECK_ACTIVE: true,
      AUTO_FINALIZE_ON_LOAD: false,
      LIGHT_RECEIPT_ON_LOAD: true,
      EXPLICIT_RUN_REQUIRED_FOR_ADJUDICATION: true,
      CURRENT_AUTHORITY_OUTRANKS_STORED_STALE_PACKET:
        state.currentAuthorityOutranksStoredState,
      STALE_PRE_NORTH_PACKET_QUARANTINE_ACTIVE:
        state.stalePacketQuarantineActive,

      TRUST_STATE: state.trustState,
      ADJUDICATION_RUN_STATE: state.adjudicationRunState,
      NORTH_STANDARD_STATUS: state.northStandardStatus,
      NORTH_COMPATIBILITY_BRIDGE_STATUS:
        state.northCompatibilityBridgeStatus,

      NORTH_RAIL_STATUS: state.northRailStatus,
      NORTH_RAIL_AUTHORITY_PATH: state.northRailAuthorityPath,
      NORTH_RAIL_VERDICT_AVAILABLE: state.northRailVerdictAvailable,
      NORTH_RAIL_TRUST_STATE: state.northRailTrustState,

      SURFACE_TRUTH_STATUS: state.surfaceTruthStatus,
      SURFACE_TRUTH_FAILURE_CLASS: state.surfaceTruthFailureClass,
      SURFACE_TRUTH_FIRST_FAILED_COORDINATE:
        state.surfaceTruthFirstFailedCoordinate,
      SURFACE_TRUTH_TRUST_STATE: state.surfaceTruthTrustState,

      STALE_PRE_NORTH_PACKET_QUARANTINED:
        state.stalePreNorthPacketQuarantined,
      NO_SOURCE_PACKET_QUARANTINED: state.noSourcePacketQuarantined,

      CYCLE_CLOSED: state.cycleClosed,
      OUTER_CYCLE_CLOSED: state.outerCycleClosed,
      CYCLE_CLOSURE_STATUS: state.cycleClosureStatus,
      CONSTRUCTION_READINESS_STATUS: state.constructionReadinessStatus,
      WEST_DECISION: state.westDecision,
      WEST_GAP_CLASS: state.westGapClass,
      WEST_FORWARD_ALLOWED: state.westForwardAllowed,
      CANVAS_RELEASE_AUTHORIZED: state.canvasReleaseAuthorized,
      CANVAS_RELEASE_PACKET_READY: state.canvasReleasePacketReady,
      RELEASE_TO_CANVAS: state.releaseToCanvas,

      FIRST_OPEN_DUTY_COORDINATE: state.firstOpenDutyCoordinate,
      FIRST_OPEN_DUTY_CLASS: state.firstOpenDutyClass,
      FIRST_OPEN_DUTY_REASON: state.firstOpenDutyReason,
      FIRST_OPEN_DUTY_FILE: state.firstOpenDutyFile,
      FIRST_OPEN_DUTY_OWNER: state.firstOpenDutyOwner,
      RECOMMENDED_NEXT_FILE: state.recommendedNextFile,
      RECOMMENDED_NEXT_ACTION: state.recommendedNextAction,

      RUN_COUNT: state.runCount,
      ALIAS_PUBLISH_COUNT: state.aliasPublishCount,
      RECEIPT_PUBLISH_COUNT: state.receiptPublishCount,
      DATASET_PUBLISH_COUNT: state.datasetPublishCount,
      ERROR_COUNT: state.errorCount,

      OWNS_WEST_ADMISSIBILITY: true,
      OWNS_DERIVATIVE_RELEASE: true,
      OWNS_CANVAS_RELEASE_PACKET: true,
      OWNS_CANVAS_DRAWING: false,
      OWNS_CANVAS_LIFECYCLE: false,
      OWNS_CONTROLS_BEHAVIOR: false,
      OWNS_ROUTE_CONDUCTOR_HANDSHAKE_TRUTH: false,
      OWNS_NORTH_GRAMMAR_TRUTH: false,
      OWNS_NORTH_RAIL_MUTATION: false,
      OWNS_SURFACE_TRUTH_PROBE_MUTATION: false,
      OWNS_PRODUCTION_FILE_REDEFINITION: false,
      OWNS_F21_LATCH: false,
      OWNS_READY_TEXT: false,
      OWNS_COMPLETION_LATCH: false,
      OWNS_FINAL_VISUAL_PASS_CLAIM: false,

      F13_CLAIMED: false,
      F13_ELIGIBLE_FOR_CANVAS: false,
      F13_CLAIMED_BY_WEST: false,
      F21_ELIGIBLE_FOR_NORTH: false,
      F21_SUBMITTED_TO_NORTH: false,
      F21_ELIGIBILITY_SUBMITTED_TO_NORTH: false,
      F21_CLAIMED: false,
      F21_CLAIMED_BY_WEST: false,
      READY_TEXT_PERMISSION_GRANTED: false,
      READY_TEXT_ALLOWED: false,
      READY_TEXT_CLAIMED: false,
      COMPLETION_LATCHED: false,
      FINAL_COMPLETION_LATCHED: false,
      DEGRADED_COMPLETION_LATCHED: false,
      VISUAL_PASS_CLAIMED: false,
      FINAL_VISUAL_PASS_CLAIMED: false,
      GENERATED_IMAGE: false,
      GRAPHIC_BOX: false,
      WEBGL: false,
      PRODUCTION_MUTATION_AUTHORIZED: false,
      CANVAS_MUTATION_AUTHORIZED: false,
      CANVAS_DRAWING_AUTHORIZED: false,
      CANVAS_REPAIR_AUTHORIZED: false,
      CANVAS_BUILD_AUTHORITY_CLAIMED: false,
      ROUTE_REPAIR_AUTHORIZED: false,
      CONTROLS_REPAIR_AUTHORIZED: false,
      RUNTIME_RESTART_AUTHORIZED: false
    };
  }

  function getReceipt() {
    state.lastReceipt = composeReceipt(
      "LAB_RUNTIME_TABLE_WEST_CURRENT_AUTHORITY_RECHECK_RECEIPT_v5_4"
    );
    publishReceiptAliases();
    return state.lastReceipt;
  }

  function getReceiptLight() {
    return {
      PACKET_NAME: "LAB_RUNTIME_TABLE_WEST_LIGHT_RECEIPT_v5_4",
      CONTRACT: PUBLIC_CONTRACT,
      RECEIPT: PUBLIC_RECEIPT,
      INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
      COMPAT_INTERNAL_RENEWAL_CONTRACT: COMPAT_INTERNAL_RENEWAL_CONTRACT,
      VERSION: VERSION,
      FILE: FILE,
      GENERATED_AT: nowIso(),
      ACTIVE_STAGE_ID: ACTIVE_STAGE_ID,
      ACTIVE_CARDINAL: ACTIVE_CARDINAL,
      ACTIVE_FIBONACCI: ACTIVE_FIBONACCI,
      CURRENT_AUTHORITY_RECHECK_ACTIVE: true,
      AUTO_FINALIZE_ON_LOAD: false,
      EXPLICIT_RUN_REQUIRED: true,
      TRUST_STATE: state.trustState,
      ADJUDICATION_RUN_STATE: state.adjudicationRunState,
      NORTH_RAIL_STATUS: state.northRailStatus,
      NORTH_RAIL_VERDICT_AVAILABLE: state.northRailVerdictAvailable,
      SURFACE_TRUTH_STATUS: state.surfaceTruthStatus,
      CONSTRUCTION_READINESS_STATUS: state.constructionReadinessStatus,
      WEST_DECISION: state.westDecision,
      WEST_GAP_CLASS: state.westGapClass,
      CANVAS_RELEASE_AUTHORIZED: state.canvasReleaseAuthorized,
      F13_CLAIMED: false,
      F21_CLAIMED: false,
      READY_TEXT_CLAIMED: false,
      VISUAL_PASS_CLAIMED: false,
      GENERATED_IMAGE: false,
      GRAPHIC_BOX: false,
      WEBGL: false
    };
  }

  function kv(key, value) {
    var output =
      value === undefined || value === null || value === "" ? "UNKNOWN" : value;
    return key + "=" + output;
  }

  function getReceiptText() {
    var receipt = getReceipt();
    return Object.keys(receipt)
      .map(function (key) {
        return kv(key, receipt[key]);
      })
      .join("\n");
  }

  function getStatusText() {
    return [
      kv("CONTRACT", PUBLIC_CONTRACT),
      kv("INTERNAL_RENEWAL_CONTRACT", INTERNAL_RENEWAL_CONTRACT),
      kv("VERSION", VERSION),
      kv("ACTIVE_STAGE_ID", ACTIVE_STAGE_ID),
      kv("AUTO_FINALIZE_ON_LOAD", false),
      kv("EXPLICIT_RUN_REQUIRED", true),
      kv("TRUST_STATE", state.trustState),
      kv("ADJUDICATION_RUN_STATE", state.adjudicationRunState),
      kv("NORTH_STANDARD_STATUS", state.northStandardStatus),
      kv("NORTH_RAIL_STATUS", state.northRailStatus),
      kv("NORTH_RAIL_AUTHORITY_PATH", state.northRailAuthorityPath),
      kv("NORTH_RAIL_VERDICT_AVAILABLE", state.northRailVerdictAvailable),
      kv("SURFACE_TRUTH_STATUS", state.surfaceTruthStatus),
      kv("SURFACE_TRUTH_FAILURE_CLASS", state.surfaceTruthFailureClass),
      kv(
        "SURFACE_TRUTH_FIRST_FAILED_COORDINATE",
        state.surfaceTruthFirstFailedCoordinate
      ),
      kv("CONSTRUCTION_READINESS_STATUS", state.constructionReadinessStatus),
      kv("WEST_DECISION", state.westDecision),
      kv("WEST_GAP_CLASS", state.westGapClass),
      kv("CANVAS_RELEASE_AUTHORIZED", state.canvasReleaseAuthorized),
      kv("FIRST_OPEN_DUTY_COORDINATE", state.firstOpenDutyCoordinate),
      kv("FIRST_OPEN_DUTY_CLASS", state.firstOpenDutyClass),
      kv("FIRST_OPEN_DUTY_REASON", state.firstOpenDutyReason),
      kv("RECOMMENDED_NEXT_FILE", state.recommendedNextFile),
      kv("RECOMMENDED_NEXT_ACTION", state.recommendedNextAction),
      kv("STALE_PRE_NORTH_PACKET_QUARANTINED", state.stalePreNorthPacketQuarantined),
      kv("NO_SOURCE_PACKET_QUARANTINED", state.noSourcePacketQuarantined),
      kv("PRODUCTION_MUTATION_AUTHORIZED", false),
      kv("CANVAS_REPAIR_AUTHORIZED", false),
      kv("CANVAS_DRAWING_AUTHORIZED", false),
      kv("RUNTIME_RESTART_AUTHORIZED", false),
      kv("F13_CLAIMED", false),
      kv("F21_CLAIMED", false),
      kv("READY_TEXT_CLAIMED", false),
      kv("VISUAL_PASS_CLAIMED", false),
      kv("GENERATED_IMAGE", false),
      kv("GRAPHIC_BOX", false),
      kv("WEBGL", false)
    ].join("\n");
  }

  function getCompactSummary() {
    return getStatusText();
  }

  function updateDataset() {
    try {
      if (!ROOT.document || !ROOT.document.documentElement) return false;

      var ds = ROOT.document.documentElement.dataset;
      ds.labRuntimeTableWestContract = PUBLIC_CONTRACT;
      ds.labRuntimeTableWestInternalRenewal = INTERNAL_RENEWAL_CONTRACT;
      ds.labRuntimeTableWestVersion = VERSION;
      ds.labRuntimeTableWestStage = ACTIVE_STAGE_ID;
      ds.labRuntimeTableWestTrustState = state.trustState;
      ds.labRuntimeTableWestNorthRailStatus = state.northRailStatus;
      ds.labRuntimeTableWestNorthVerdictAvailable = String(
        state.northRailVerdictAvailable
      );
      ds.labRuntimeTableWestSurfaceTruthStatus = state.surfaceTruthStatus;
      ds.labRuntimeTableWestDecision = state.westDecision;
      ds.labRuntimeTableWestGapClass = state.westGapClass;
      ds.labRuntimeTableWestConstructionReadiness =
        state.constructionReadinessStatus;
      ds.labRuntimeTableWestCanvasReleaseAuthorized = String(
        state.canvasReleaseAuthorized
      );
      ds.labRuntimeTableWestAutoFinalizeOnLoad = "false";
      ds.labRuntimeTableWestExplicitRunRequired = "true";

      state.datasetPublishCount += 1;
      return true;
    } catch (error) {
      state.errorCount += 1;
      state.errors.push({
        at: nowIso(),
        where: "updateDataset",
        error: clean(error && error.message ? error.message : error, 600)
      });
      return false;
    }
  }

  function publishGlobals() {
    WEST_ALIAS_PATHS.forEach(function (path) {
      setPath(path, api);
    });

    state.aliasPublishCount += 1;
    return true;
  }

  function publishReceiptAliases() {
    var receipt = getReceiptLight(false);

    WEST_RECEIPT_ALIAS_PATHS.forEach(function (path) {
      setPath(path, receipt);
    });

    state.receiptPublishCount += 1;
    return receipt;
  }

  function scheduleRepublish() {
    try {
      ROOT.setTimeout(function () {
        publishGlobals();
        publishReceiptAliases();
        updateDataset();
      }, 0);

      ROOT.setTimeout(function () {
        publishGlobals();
        publishReceiptAliases();
        updateDataset();
      }, 180);
    } catch (_error) {}
  }

  api = {
    CONTRACT: PUBLIC_CONTRACT,
    RECEIPT: PUBLIC_RECEIPT,
    contract: PUBLIC_CONTRACT,
    receipt: PUBLIC_RECEIPT,

    INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
    INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,

    COMPAT_INTERNAL_RENEWAL_CONTRACT: COMPAT_INTERNAL_RENEWAL_CONTRACT,
    COMPAT_INTERNAL_RENEWAL_RECEIPT: COMPAT_INTERNAL_RENEWAL_RECEIPT,
    compatInternalRenewalContract: COMPAT_INTERNAL_RENEWAL_CONTRACT,
    compatInternalRenewalReceipt: COMPAT_INTERNAL_RENEWAL_RECEIPT,

    PREVIOUS_INTERNAL_RENEWAL_CONTRACT: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
    PREVIOUS_INTERNAL_RENEWAL_RECEIPT: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,

    VERSION: VERSION,
    FILE: FILE,
    ROUTE: ROUTE,
    DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,

    LAB_NORTH_FILE: LAB_NORTH_FILE,
    LAB_WEST_FILE: LAB_WEST_FILE,
    NORTH_RAIL_FILE: NORTH_RAIL_FILE,
    SURFACE_TRUTH_FILE: SURFACE_TRUTH_FILE,
    EAST_PROBE_FILE: EAST_PROBE_FILE,
    SOUTH_RAIL_FILE: SOUTH_RAIL_FILE,

    ACTIVE_STAGE_ID: ACTIVE_STAGE_ID,
    ACTIVE_CARDINAL: ACTIVE_CARDINAL,
    ACTIVE_FIBONACCI: ACTIVE_FIBONACCI,
    ACTIVE_NEWS_GATE: ACTIVE_NEWS_GATE,
    ACTIVE_CYCLE_NUMBER: ACTIVE_CYCLE_NUMBER,
    ACTIVE_CYCLE_ROUTE: ACTIVE_CYCLE_ROUTE,

    TRUST_STATE: TRUST_STATE,
    WEST_DECISION: WEST_DECISION,
    WEST_GAP_CLASS: WEST_GAP_CLASS,

    // Core explicit-run methods
    runNorthStandardDerivativeReleaseAudit:
      runNorthStandardDerivativeReleaseAudit,
    runCycleClosureAudit: runNorthStandardDerivativeReleaseAudit,
    classifyWestAdmissibility: runNorthStandardDerivativeReleaseAudit,
    classifyCyclePacket: runNorthStandardDerivativeReleaseAudit,
    createWestCycleReceipt: runNorthStandardDerivativeReleaseAudit,
    createGapReceipt: runNorthStandardDerivativeReleaseAudit,
    classifyGap: runNorthStandardDerivativeReleaseAudit,
    classifyTransmissionGap: runNorthStandardDerivativeReleaseAudit,
    assess: runNorthStandardDerivativeReleaseAudit,
    inspect: runNorthStandardDerivativeReleaseAudit,
    run: runNorthStandardDerivativeReleaseAudit,

    // Lifecycle methods are intentionally no-op under v5_4.
    boot: noOpLifecycle,
    init: noOpLifecycle,
    start: noOpLifecycle,
    mount: noOpLifecycle,

    inspectAuthority: inspectAuthority,
    inspectCoreNodes: inspectCoreNodes,
    inspectJudgeNodes: inspectJudgeNodes,
    inspectRelationships: inspectRelationships,

    readNorthStandardPacket: readNorthStandardPacket,
    readNorthRailPacket: readCurrentNorth,
    readCurrentNorth: readCurrentNorth,
    readSurfaceTruthDirect: readSurfaceTruthDirect,
    classifyPacketTrust: classifyPacketTrust,
    selfMeasureWestDuty: selfMeasureWestDuty,

    composeHierarchyRegistry: getHierarchyRegistry,
    getHierarchyRegistry: getHierarchyRegistry,
    getHierarchySurface: getHierarchySurface,
    getBishopChord: getBishopChord,
    getJudgeMetrics: getJudgeMetrics,

    getReceipt: getReceipt,
    getReceiptLight: getReceiptLight,
    getReceiptText: getReceiptText,
    getPacketText: getReceiptText,
    getStatus: getReceiptLight,
    getStatusText: getStatusText,
    getCompactSummary: getCompactSummary,
    getState: getState,

    getCanvasReleasePacket: getCanvasReleasePacket,
    getReleasePacket: getCanvasReleasePacket,
    getCanvasHandoffPacket: getCanvasReleasePacket,
    getHandoffPacket: getCanvasReleasePacket,
    composeReleasePacket: composeReleasePacket,
    clearReleasePacket: clearReleasePacket,
    publishReleasePacket: publishReleasePacket,

    updateDataset: updateDataset,
    publishGlobals: publishGlobals,
    publishAliasPaths: publishGlobals,
    publishReceiptAliases: publishReceiptAliases,

    // Authority declarations
    ownsWestAdmissibility: true,
    ownsDerivativeRelease: true,
    ownsCycleClosureReceiptAudit: true,
    ownsCanvasReleasePacket: true,
    ownsBishopReceiptTrust: true,
    northStandardAnchored: true,
    northRailRequired: true,
    surfaceTruthIsEvidenceOnly: true,
    aliasIsLabel: true,
    aliasIsEndpointProof: false,
    strictFileContractFamilyMatchRequired: true,
    borrowedAuthorityContractTextRejected: true,
    currentAuthorityOutranksStoredState: true,
    stalePacketQuarantineActive: true,

    ownsUpstreamTruth: false,
    ownsNorthGrammarTruth: false,
    ownsNorthRailMutation: false,
    ownsSurfaceTruthProbeMutation: false,
    ownsEastSourceTruth: false,
    ownsSouthOutputTruth: false,
    ownsControlsBehavior: false,
    ownsRouteConductorHandshakeTruth: false,
    ownsCanvasDrawing: false,
    ownsCanvasLifecycle: false,
    ownsCanvasChildInternals: false,
    ownsHexTruth: false,
    ownsChapelTruth: false,
    ownsProductionFileRedefinition: false,
    ownsF21Latch: false,
    ownsReadyText: false,
    ownsCompletionLatch: false,
    ownsFinalVisualPassClaim: false,

    f13Claimed: false,
    f13EligibleForCanvas: false,
    f13ClaimedByWest: false,
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21EligibilitySubmittedToNorth: false,
    f21Claimed: false,
    f21ClaimedByWest: false,
    readyTextPermissionGranted: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false,
    productionMutationAuthorized: false,
    canvasMutationAuthorized: false,
    canvasDrawingAuthorized: false,
    canvasRepairAuthorized: false,
    canvasBuildAuthorityClaimed: false,
    routeRepairAuthorized: false,
    controlsRepairAuthorized: false,
    runtimeRestartAuthorized: false,

    state: state
  };

  // Publish authority immediately.
  // Do not run full adjudication on load.
  // Load publishes light receipt only.
  publishGlobals();
  publishReceiptAliases();
  updateDataset();
  scheduleRepublish();
})();

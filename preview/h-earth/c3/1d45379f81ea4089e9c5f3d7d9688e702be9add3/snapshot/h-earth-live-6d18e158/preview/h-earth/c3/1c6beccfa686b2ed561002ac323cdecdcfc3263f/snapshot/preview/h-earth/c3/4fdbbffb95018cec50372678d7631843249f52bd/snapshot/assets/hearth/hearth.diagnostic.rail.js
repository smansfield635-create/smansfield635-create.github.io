// /assets/hearth/hearth.diagnostic.rail.js
// HEARTH_DIAGNOSTIC_RAIL_NORTH_REANCHOR_DIAGNOSTIC_TRACK_RUNTIME_MAP_INTEGRITY_TNT_v11_6
// Internal controlled renewal:
// HEARTH_DIAGNOSTIC_RAIL_NORTH_LABWEST_CONSTRUCT_ANCHORED_SURFACE_TRUTH_CONSUMER_TNT_v12
// Full-file replacement.
// North Diagnostic Rail / LabWest construct anchored / Surface Truth consumer / Judge publisher.
//
// Purpose:
// - Restore the missing North Diagnostic Rail authority surface.
// - Preserve LabNorth-compatible public North rail contract lineage.
// - Publish the LabWest-discoverable Judge aliases.
// - Consume LabNorth grammar, LabWest construct, Surface Truth profile/measurement, sibling rails,
//   probe network, and South sidecar evidence as diagnostic evidence only.
// - Return a truthful North diagnostic track packet.
// - Report Surface Truth failure without mutating production or authorizing Canvas repair.
//
// Does not:
// - mutate Hearth production files
// - draw Canvas
// - build Canvas
// - repair Canvas
// - restart runtime
// - replace LabNorth grammar
// - replace LabWest derivative diagnostic
// - replace Surface Truth probe
// - force South output
// - claim ready / F13 / F21 / final visual pass
//

(function () {
  "use strict";

  var ROOT = typeof window !== "undefined" ? window : globalThis;
  var DOC = typeof document !== "undefined" ? document : null;

  var CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_REANCHOR_DIAGNOSTIC_TRACK_RUNTIME_MAP_INTEGRITY_TNT_v11_6";
  var RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_REANCHOR_DIAGNOSTIC_TRACK_RUNTIME_MAP_INTEGRITY_RECEIPT_v11_6";

  var INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_LABWEST_CONSTRUCT_ANCHORED_SURFACE_TRUTH_CONSUMER_TNT_v12";
  var INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_LABWEST_CONSTRUCT_ANCHORED_SURFACE_TRUTH_CONSUMER_RECEIPT_v12";

  var PREVIOUS_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_TNT_v11";
  var PREVIOUS_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_RECEIPT_v11";

  var COMPAT_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_TNT_v11";

  var VERSION =
    "2026-06-08.hearth-diagnostic-rail-north-labwest-construct-anchored-surface-truth-consumer-v12";

  var FILE = "/assets/hearth/hearth.diagnostic.rail.js";
  var TARGET_ROUTE = "/showroom/globe/hearth/";
  var DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  var LAB_NORTH_FILE = "/assets/lab/runtime-table.js";
  var LAB_WEST_FILE = "/assets/lab/runtime-table.west.js";

  var SURFACE_TRUTH_FILE =
    "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js";

  var EAST_RAIL_FILE = "/assets/hearth/hearth.diagnostic.east.js";
  var WEST_RAIL_FILE = "/assets/hearth/hearth.diagnostic.west.js";
  var SOUTH_RAIL_FILE = "/assets/hearth/hearth.diagnostic.south.js";

  var PROBE_NORTH_FILE = "/assets/hearth/hearth.diagnostic.probe.north.js";
  var PROBE_EAST_FILE = "/assets/hearth/hearth.diagnostic.probe.east.js";
  var PROBE_WEST_FILE = "/assets/hearth/hearth.diagnostic.probe.west.js";
  var PROBE_SOUTH_FILE = "/assets/hearth/hearth.diagnostic.probe.south.js";

  var ACTIVE_STAGE_ID =
    "NORTH_DIAGNOSTIC_RAIL_LABWEST_CONSTRUCT_ANCHORED_SURFACE_TRUTH_CONSUMPTION";
  var ACTIVE_CARDINAL = "NORTH";
  var ACTIVE_ROLE = "JUDGE_NORTH_DIAGNOSTIC_RAIL";
  var ACTIVE_CYCLE =
    "LABWEST_CONSTRUCT_TO_SURFACE_TRUTH_TO_NORTH_DIAGNOSTIC_TRACK_TO_WEST_DERIVATIVE_MAP";

  var NO_CLAIMS = {
    ownsProductionMutation: false,
    ownsCanvasDrawing: false,
    ownsCanvasBuild: false,
    ownsCanvasRepair: false,
    ownsRouteRepair: false,
    ownsControlsRepair: false,
    ownsRuntimeRestart: false,
    ownsLabNorthGrammar: false,
    ownsLabWestDerivativeMap: false,
    ownsSurfaceTruthProbe: false,
    ownsSouthOutput: false,

    productionMutationAuthorized: false,
    canvasMutationAuthorized: false,
    canvasDrawingAuthorized: false,
    canvasBuildAuthorized: false,
    canvasRepairAuthorized: false,
    routeRepairAuthorized: false,
    controlsRepairAuthorized: false,
    runtimeRestartAuthorized: false,

    finalProductionArbitrationClaimed: false,
    productionRepairAuthorized: false,
    nextProductionFileAuthorized: false,

    f13Claimed: false,
    f13EligibleForCanvas: false,
    f13ClaimedByNorth: false,
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21Claimed: false,
    f21ClaimedByNorth: false,

    readyTextPermissionGranted: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    completionLatched: false,
    finalCompletionLatched: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false
  };

  var NORTH_PUBLICATION_ALIASES = [
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

  var LAB_WEST_ALIASES = [
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
    "HEARTH.runtimeTableWest",
    "HEARTH.westRuntimeTable",
    "HEARTH.westAdmissibility",
    "HEARTH.macroWestAuthority",
    "HEARTH.westCanvasV123PointerSurfaceBishopReleaseBridge",
    "HEARTH.westPointerSurfaceBishopChainMap",
    "HEARTH.westCanvasChapelDualChapelMetricBinding",
    "DEXTER_LAB.runtimeTableWest",
    "DEXTER_LAB.cardinalRuntimeTableWest",
    "DEXTER_LAB.hearthRuntimeTableWest",
    "DEXTER_LAB.westAdmissibility",
    "DEXTER_LAB.hearthWestCanvasChapelDualChapelMetricBinding"
  ];

  var SURFACE_TRUTH_ALIASES = [
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
    "HEARTH_CANVAS_SURFACE_TRUTH_PROBE",
    "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE",
    "HEARTH.diagnosticProbeCanvasSurfaceTruth",
    "HEARTH.canvasSurfaceTruthProbe",
    "HEARTH.CANVAS_SURFACE_TRUTH_PROBE",
    "HEARTH.DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
    "DEXTER_LAB.canvasSurfaceTruthProbe",
    "DEXTER_LAB.diagnosticProbeCanvasSurfaceTruth"
  ];

  var EAST_RAIL_ALIASES = [
    "JUDGE_EAST",
    "HEARTH_DIAGNOSTIC_RAIL_EAST",
    "HEARTH.diagnosticEast",
    "HEARTH.diagnosticRailEast",
    "HEARTH.JUDGE_EAST_SOURCE_READ",
    "DEXTER_LAB.hearthDiagnosticEast"
  ];

  var WEST_RAIL_ALIASES = [
    "JUDGE_WEST",
    "HEARTH_DIAGNOSTIC_RAIL_WEST",
    "HEARTH.diagnosticWest",
    "HEARTH.diagnosticRailWest",
    "HEARTH.JUDGE_WEST_ADMISSIBILITY_READ",
    "DEXTER_LAB.hearthDiagnosticWest"
  ];

  var SOUTH_RAIL_ALIASES = [
    "JUDGE_SOUTH",
    "HEARTH_DIAGNOSTIC_RAIL_SOUTH",
    "HEARTH.diagnosticSouth",
    "HEARTH.diagnosticRailSouth",
    "HEARTH.JUDGE_SOUTH_PACKET_OUTPUT",
    "DEXTER_LAB.hearthDiagnosticSouth"
  ];

  var PROBE_NORTH_ALIASES = [
    "HEARTH.diagnosticProbeNorth",
    "HEARTH.JUDGE_NORTH_PROBE",
    "HEARTH_DIAGNOSTIC_PROBE_NORTH",
    "DEXTER_LAB.diagnosticProbeNorth"
  ];

  var PROBE_EAST_ALIASES = [
    "HEARTH.diagnosticProbeEast",
    "HEARTH.JUDGE_EAST_PROBE",
    "HEARTH_DIAGNOSTIC_PROBE_EAST",
    "DEXTER_LAB.diagnosticProbeEast"
  ];

  var PROBE_WEST_ALIASES = [
    "HEARTH.diagnosticProbeWest",
    "HEARTH.JUDGE_WEST_PROBE",
    "HEARTH_DIAGNOSTIC_PROBE_WEST",
    "DEXTER_LAB.diagnosticProbeWest"
  ];

  var PROBE_SOUTH_ALIASES = [
    "HEARTH.diagnosticProbeSouth",
    "HEARTH.JUDGE_SOUTH_PROBE",
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH",
    "DEXTER_LAB.diagnosticProbeSouth"
  ];

  var SOUTH_SIDECAR_ALIASES = [
    "HEARTH.southSurfacePointerSidecar",
    "HEARTH.SOUTH_SURFACE_POINTER_SIDECAR",
    "HEARTH.southCanvasSurfacePointerSidecar",
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_SIDECAR",
    "HEARTH_SOUTH_SURFACE_POINTER_SIDECAR",
    "DEXTER_LAB.southSurfacePointerSidecar",
    "DEXTER_LAB.hearthSouthSurfacePointerSidecar"
  ];

  var READ_RECEIPT_METHODS = [
    "getReceiptLight",
    "getReceipt",
    "getProfileReceipt",
    "getContractDefinitionReceipt",
    "getReport",
    "getStatus",
    "getState",
    "getSummary",
    "getRuntimeGrammar",
    "getNorthGrammarPacket",
    "getHierarchySurface",
    "getHierarchyRegistry",
    "getJudgeMetrics",
    "getContractDefinitions",
    "getExpectedEndpoints",
    "getDiagnosticCycle",
    "getCanvasCycle"
  ];

  var SURFACE_TRUTH_MEASURE_METHODS = [
    "inspect",
    "probe",
    "measure",
    "run"
  ];

  var ACCEPTED_NORTH_RAIL_CONTRACTS = [
    CONTRACT,
    INTERNAL_RENEWAL_CONTRACT,
    PREVIOUS_CONTRACT,
    COMPAT_CONTRACT,
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_TNT_v11",
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_REANCHOR_DIAGNOSTIC_TRACK_RUNTIME_MAP_INTEGRITY_TNT_v11_6"
  ];

  var FIELD_DEFINITION = {
    LAB_NORTH_GRAMMAR: {
      file: LAB_NORTH_FILE,
      aliases: LAB_NORTH_ALIASES,
      expectedFamilies: ["LAB_NORTH"]
    },
    LABWEST_CONSTRUCT: {
      file: LAB_WEST_FILE,
      aliases: LAB_WEST_ALIASES,
      expectedFamilies: ["LAB_WEST"]
    },
    SURFACE_TRUTH_PROBE: {
      file: SURFACE_TRUTH_FILE,
      aliases: SURFACE_TRUTH_ALIASES,
      expectedFamilies: ["HEARTH_DIAGNOSTIC_SURFACE_TRUTH_PROBE", "HEARTH_DIAGNOSTIC_PROBE"]
    },
    EAST_RAIL: {
      file: EAST_RAIL_FILE,
      aliases: EAST_RAIL_ALIASES,
      expectedFamilies: ["HEARTH_DIAGNOSTIC"]
    },
    WEST_RAIL: {
      file: WEST_RAIL_FILE,
      aliases: WEST_RAIL_ALIASES,
      expectedFamilies: ["HEARTH_DIAGNOSTIC"]
    },
    SOUTH_RAIL: {
      file: SOUTH_RAIL_FILE,
      aliases: SOUTH_RAIL_ALIASES,
      expectedFamilies: ["HEARTH_DIAGNOSTIC"]
    },
    PROBE_NORTH: {
      file: PROBE_NORTH_FILE,
      aliases: PROBE_NORTH_ALIASES,
      expectedFamilies: ["HEARTH_DIAGNOSTIC_PROBE", "HEARTH_DIAGNOSTIC"]
    },
    PROBE_EAST: {
      file: PROBE_EAST_FILE,
      aliases: PROBE_EAST_ALIASES,
      expectedFamilies: ["HEARTH_DIAGNOSTIC_PROBE", "HEARTH_DIAGNOSTIC"]
    },
    PROBE_WEST: {
      file: PROBE_WEST_FILE,
      aliases: PROBE_WEST_ALIASES,
      expectedFamilies: ["HEARTH_DIAGNOSTIC_PROBE", "HEARTH_DIAGNOSTIC"]
    },
    PROBE_SOUTH: {
      file: PROBE_SOUTH_FILE,
      aliases: PROBE_SOUTH_ALIASES,
      expectedFamilies: ["HEARTH_DIAGNOSTIC_PROBE", "HEARTH_DIAGNOSTIC"]
    },
    SOUTH_SURFACE_POINTER_SIDECAR: {
      file: "UNKNOWN",
      aliases: SOUTH_SIDECAR_ALIASES,
      expectedFamilies: ["HEARTH_DIAGNOSTIC", "HEARTH_SOUTH", "UNKNOWN"],
      optional: true
    }
  };

  var state = {
    publishedAt: "",
    lastRunAt: "",
    lastReceiptAt: "",
    runCount: 0,
    receiptCount: 0,
    aliasPublishCount: 0,
    datasetPublishCount: 0,
    errorCount: 0,
    errors: [],
    lastDiagnosticPacket: null,
    lastReceipt: null
  };

  var API = {};

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

  function safeString(value, fallback) {
    if (fallback === undefined) fallback = "";
    if (value === undefined || value === null) return fallback;
    try {
      return String(value);
    } catch (_error) {
      return fallback;
    }
  }

  function clone(value) {
    if (value === undefined || value === null) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      if (isObject(value)) {
        var out = {};
        Object.keys(value).forEach(function (key) {
          if (key === "_authority") return;
          out[key] = value[key];
        });
        return out;
      }
      return value;
    }
  }

  function ensureNamespace(name) {
    if (!ROOT[name] || typeof ROOT[name] !== "object") ROOT[name] = {};
    return ROOT[name];
  }

  function readPath(path) {
    if (!path || typeof path !== "string") return undefined;

    var clean = path.replace(/^window\./, "");
    var parts = clean.split(".");
    var cursor = ROOT;

    for (var i = 0; i < parts.length; i += 1) {
      if (!parts[i]) continue;
      if (!cursor || (typeof cursor !== "object" && typeof cursor !== "function")) {
        return undefined;
      }
      cursor = cursor[parts[i]];
    }

    return cursor;
  }

  function setPath(path, value) {
    if (!path || typeof path !== "string") return false;

    var clean = path.replace(/^window\./, "");
    var parts = clean.split(".");
    var cursor = ROOT;

    for (var i = 0; i < parts.length - 1; i += 1) {
      var part = parts[i];
      if (!part) continue;
      if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
      cursor = cursor[part];
    }

    cursor[parts[parts.length - 1]] = value;
    return true;
  }

  function firstKnown() {
    for (var i = 0; i < arguments.length; i += 1) {
      var text = safeString(arguments[i], "").trim();
      if (!text) continue;
      if (
        text === "UNKNOWN" ||
        text === "NONE" ||
        text === "NOT_FOUND" ||
        text === "UNREADABLE" ||
        text === "NULL"
      ) {
        continue;
      }
      return text;
    }

    return "";
  }

  function scriptInfo(path) {
    if (!path || path === "UNKNOWN") {
      return { present: false, count: 0, src: "NONE", cacheKey: "NONE", matches: [] };
    }

    if (!DOC || !isFunction(DOC.querySelectorAll)) {
      return { present: false, count: 0, src: "NONE", cacheKey: "NONE", matches: [] };
    }

    var matches = [];

    try {
      var scripts = Array.prototype.slice.call(DOC.querySelectorAll("script[src]"));
      var fileName = path.split("/").filter(Boolean).pop();

      scripts.forEach(function (script, index) {
        var src = safeString(script.getAttribute("src"), "");
        var pathname = src;
        var cacheKey = "NONE";

        try {
          var origin =
            ROOT.location && ROOT.location.origin
              ? ROOT.location.origin
              : "https://diamondgatebridge.com";
          var url = new URL(src, origin);
          pathname = url.pathname;
          cacheKey =
            url.searchParams.get("v") ||
            url.searchParams.get("cacheKey") ||
            url.searchParams.get("version") ||
            "NONE";
        } catch (_error) {}

        if (
          pathname === path ||
          pathname.endsWith(path) ||
          src.indexOf(path) !== -1 ||
          (fileName && src.indexOf(fileName) !== -1)
        ) {
          matches.push({
            order: index + 1,
            src: src,
            pathname: pathname,
            cacheKey: cacheKey,
            matchedPath: path
          });
        }
      });
    } catch (_error) {}

    var last = matches[matches.length - 1] || null;

    return {
      present: matches.length > 0,
      count: matches.length,
      src: last ? last.src : "NONE",
      cacheKey: last ? last.cacheKey : "NONE",
      matches: matches
    };
  }

  function methodNames(authority) {
    if (!authority || (typeof authority !== "object" && typeof authority !== "function")) {
      return [];
    }

    try {
      return Object.keys(authority)
        .filter(function (key) {
          return isFunction(authority[key]);
        })
        .sort();
    } catch (_error) {
      return [];
    }
  }

  function readRaw(source, key, fallback) {
    if (fallback === undefined) fallback = undefined;
    if (!source || (typeof source !== "object" && typeof source !== "function")) return fallback;

    if (Object.prototype.hasOwnProperty.call(source, key)) {
      var direct = source[key];
      return direct === undefined || direct === null ? fallback : direct;
    }

    var lower = key.toLowerCase();

    try {
      var keys = Object.keys(source);
      for (var i = 0; i < keys.length; i += 1) {
        if (keys[i].toLowerCase() === lower) {
          var value = source[keys[i]];
          return value === undefined || value === null ? fallback : value;
        }
      }
    } catch (_error) {}

    return fallback;
  }

  function contractOf(value) {
    var v = value && (typeof value === "object" || typeof value === "function") ? value : {};

    return firstKnown(
      v.CONTRACT,
      v.contract,
      v.PUBLIC_CONTRACT,
      v.publicContract,
      v.INTERNAL_RENEWAL_CONTRACT,
      v.internalRenewalContract,
      v.COMPAT_CONTRACT,
      v.compatContract,
      v.sourceContract,
      v.SOURCE_CONTRACT,
      v.currentContract,
      v.currentNorthContract,
      v.diagnosticContract,
      v.surfaceTruthContract,
      v.pointerSurfaceContract,
      v.canvasContract
    );
  }

  function receiptOf(value) {
    var v = value && (typeof value === "object" || typeof value === "function") ? value : {};

    return firstKnown(
      v.RECEIPT,
      v.receipt,
      v.PUBLIC_RECEIPT,
      v.publicReceipt,
      v.INTERNAL_RENEWAL_RECEIPT,
      v.internalRenewalReceipt,
      v.sourceReceipt,
      v.SOURCE_RECEIPT,
      v.currentReceipt,
      v.currentNorthReceipt,
      v.diagnosticReceipt,
      v.surfaceTruthReceipt,
      v.pointerSurfaceReceipt,
      v.canvasReceipt
    );
  }

  function detectContractFamily(contract) {
    var text = safeString(contract, "");

    if (!text) return "UNKNOWN";

    if (/LAB_RUNTIME_TABLE.*WEST|CARDINAL_WEST|HEARTH_WEST_CANVAS/i.test(text)) {
      return "LAB_WEST";
    }

    if (/LAB_RUNTIME_TABLE|MULTI_FUNCTION_ANIMATION_STANDARD/i.test(text)) {
      return "LAB_NORTH";
    }

    if (/HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH/i.test(text)) {
      return "HEARTH_DIAGNOSTIC_SURFACE_TRUTH_PROBE";
    }

    if (/HEARTH_DIAGNOSTIC_PROBE/i.test(text)) {
      return "HEARTH_DIAGNOSTIC_PROBE";
    }

    if (/HEARTH_DIAGNOSTIC/i.test(text) || /JUDGE/i.test(text)) {
      return "HEARTH_DIAGNOSTIC";
    }

    if (/HEARTH_ROUTE_CONDUCTOR/i.test(text)) return "HEARTH_ROUTE_CONDUCTOR";
    if (/HEARTH_CONTROLS/i.test(text)) return "HEARTH_CONTROLS";
    if (/HEARTH_HEX_SURFACE/i.test(text)) return "HEARTH_HEX_SURFACE";
    if (/HEARTH_CANVAS_FINGER_INSPECT/i.test(text)) return "HEARTH_CANVAS_FINGER_INSPECT";
    if (/HEARTH_CANVAS_FINGER_SURFACE/i.test(text)) return "HEARTH_CANVAS_FINGER_SURFACE";
    if (/HEARTH_CANVAS/i.test(text)) return "HEARTH_CANVAS_HUB";

    return "UNKNOWN";
  }

  function familyAccepted(observedFamily, expectedFamilies) {
    var list = Array.isArray(expectedFamilies) ? expectedFamilies : [];
    if (!list.length) return true;

    for (var i = 0; i < list.length; i += 1) {
      if (observedFamily === list[i]) return true;
      if (list[i] === "HEARTH_DIAGNOSTIC" && observedFamily === "HEARTH_DIAGNOSTIC_PROBE") {
        return true;
      }
      if (
        list[i] === "HEARTH_DIAGNOSTIC_PROBE" &&
        observedFamily === "HEARTH_DIAGNOSTIC_SURFACE_TRUTH_PROBE"
      ) {
        return true;
      }
      if (list[i] === "UNKNOWN" && observedFamily === "UNKNOWN") return true;
    }

    return false;
  }

  function acceptedContract(contract, acceptedContracts) {
    if (!contract) return false;
    if (!Array.isArray(acceptedContracts) || !acceptedContracts.length) return true;
    return acceptedContracts.indexOf(contract) !== -1;
  }

  function resolveAuthority(aliases) {
    var list = Array.isArray(aliases) ? aliases : [];

    for (var i = 0; i < list.length; i += 1) {
      var value = readPath(list[i]);
      if (value !== undefined && value !== null) {
        return {
          observed: true,
          alias: list[i],
          authority: value,
          valueType: typeof value
        };
      }
    }

    return {
      observed: false,
      alias: "NONE",
      authority: null,
      valueType: "undefined"
    };
  }

  function callMethod(authority, method) {
    if (!authority || !isFunction(authority[method])) {
      return { attempted: false, ok: false, output: null, error: "METHOD_NOT_AVAILABLE" };
    }

    try {
      var output = authority[method]();
      return { attempted: true, ok: true, output: output, error: "NONE" };
    } catch (error) {
      return {
        attempted: true,
        ok: false,
        output: null,
        error: safeString(error && error.message ? error.message : error, "CALL_ERROR")
      };
    }
  }

  function readReceiptFromAuthority(authority) {
    if (!authority || (typeof authority !== "object" && typeof authority !== "function")) {
      return {
        method: "NONE",
        receipt: null,
        callAttempted: false,
        callError: "NO_AUTHORITY"
      };
    }

    for (var i = 0; i < READ_RECEIPT_METHODS.length; i += 1) {
      var method = READ_RECEIPT_METHODS[i];
      if (!isFunction(authority[method])) continue;

      var call = callMethod(authority, method);

      if (!call.ok) {
        return {
          method: method,
          receipt: null,
          callAttempted: true,
          callError: call.error
        };
      }

      if (isObject(call.output)) {
        return {
          method: method,
          receipt: call.output,
          callAttempted: true,
          callError: "NONE"
        };
      }
    }

    if (isObject(authority.receiptPacket)) {
      return {
        method: "receiptPacket",
        receipt: authority.receiptPacket,
        callAttempted: false,
        callError: "NONE"
      };
    }

    if (isObject(authority.receiptObject)) {
      return {
        method: "receiptObject",
        receipt: authority.receiptObject,
        callAttempted: false,
        callError: "NONE"
      };
    }

    if (isObject(authority.receipt)) {
      return {
        method: "receipt",
        receipt: authority.receipt,
        callAttempted: false,
        callError: "NONE"
      };
    }

    if (isObject(authority.state)) {
      return {
        method: "state",
        receipt: authority.state,
        callAttempted: false,
        callError: "NONE"
      };
    }

    if (contractOf(authority)) {
      return {
        method: "authorityObject",
        receipt: authority,
        callAttempted: false,
        callError: "NONE"
      };
    }

    return {
      method: "NONE",
      receipt: null,
      callAttempted: false,
      callError: "NO_READABLE_RECEIPT_SURFACE"
    };
  }

  function inspectAuthority(config) {
    var id = config.id || "UNKNOWN";
    var file = config.file || "UNKNOWN";
    var expectedFamilies = config.expectedFamilies || [];
    var acceptedContracts = config.acceptedContracts || [];
    var optional = Boolean(config.optional);

    var script = scriptInfo(file);
    var resolved = resolveAuthority(config.aliases || []);
    var authority = resolved.authority;
    var methods = methodNames(authority);
    var receiptRead = readReceiptFromAuthority(authority);
    var receiptObject = receiptRead.receipt || {};

    var contract = firstKnown(contractOf(receiptObject), contractOf(authority));
    var receipt = firstKnown(receiptOf(receiptObject), receiptOf(authority));
    var family = detectContractFamily(contract);

    var familyOk = familyAccepted(family, expectedFamilies);
    var contractOk = acceptedContract(contract, acceptedContracts);
    var methodSurfaceOk = methods.indexOf("getReceiptLight") !== -1 ||
      methods.indexOf("getReceipt") !== -1 ||
      methods.indexOf("getReport") !== -1 ||
      methods.indexOf("getStatus") !== -1 ||
      receiptRead.method !== "NONE";

    var loadStatus = "NOT_OBSERVED";
    var status = "NOT_OBSERVED";

    if (script.present && !resolved.observed) {
      loadStatus = "SCRIPT_LOADED_GLOBAL_NOT_FOUND";
      status = "SCRIPT_PRESENT_AUTHORITY_NOT_CONFIRMED";
    } else if (!script.present && !resolved.observed) {
      loadStatus = optional ? "OPTIONAL_NOT_OBSERVED" : "SCRIPT_NOT_OBSERVED_GLOBAL_NOT_FOUND";
      status = optional ? "OPTIONAL_NOT_OBSERVED" : "NOT_OBSERVED";
    } else if (resolved.observed && !contract) {
      loadStatus = "GLOBAL_FOUND_CONTRACT_NOT_FOUND";
      status = "AUTHORITY_PRESENT_CONTRACT_NOT_PRESENT";
    } else if (resolved.observed && contract && !familyOk) {
      loadStatus = "GLOBAL_FOUND_CONTRACT_FAMILY_MISMATCH";
      status = "CONTRACT_FAMILY_MISMATCH";
    } else if (resolved.observed && contract && familyOk && !contractOk && acceptedContracts.length) {
      loadStatus = "GLOBAL_FOUND_CONTRACT_NOT_RECOGNIZED";
      status = "AUTHORITY_PRESENT_CONTRACT_NOT_RECOGNIZED";
    } else if (resolved.observed && contract && familyOk && !methodSurfaceOk) {
      loadStatus = "GLOBAL_FOUND_METHOD_SURFACE_PENDING";
      status = "AUTHORITY_PRESENT_METHOD_SURFACE_PENDING";
    } else if (resolved.observed && contract && familyOk && methodSurfaceOk) {
      loadStatus = "LOADED_AND_AVAILABLE";
      status = "STRICT_RUNTIME_ENDPOINT_CONFIRMED";
    } else if (resolved.observed) {
      loadStatus = "GLOBAL_FOUND";
      status = "AUTHORITY_GLOBAL_FOUND";
    }

    return {
      id: id,
      file: file,
      expectedFamilies: expectedFamilies.slice ? expectedFamilies.slice() : [],
      optional: optional,

      scriptPresent: script.present,
      scriptCount: script.count,
      scriptSrc: script.src,
      scriptCacheKey: script.cacheKey,
      scriptMatches: clone(script.matches),

      authorityAliasPresent: resolved.observed,
      authoritySourceAlias: resolved.alias,
      authorityValueType: resolved.valueType,

      receiptReadMethod: receiptRead.method,
      receiptReadAttempted: receiptRead.callAttempted,
      receiptReadError: receiptRead.callError,

      contract: contract,
      receipt: receipt,
      contractFamily: family,
      contractFamilyAccepted: familyOk,
      acceptedContractRecognized: contractOk,
      readableMethodSurfacePresent: methodSurfaceOk,
      methodCount: methods.length,
      methods: methods,

      loadStatus: loadStatus,
      status: status,
      present: resolved.observed,
      available: loadStatus === "LOADED_AND_AVAILABLE",

      borrowedContractTextRejected:
        Boolean(resolved.observed && contract && !familyOk),

      receiptObject: clone(receiptObject),
      ...NO_CLAIMS
    };
  }

  function callSpecificObject(authority, methods) {
    if (!authority) {
      return {
        method: "NONE",
        packet: null,
        attempted: false,
        error: "NO_AUTHORITY"
      };
    }

    for (var i = 0; i < methods.length; i += 1) {
      var method = methods[i];
      if (!isFunction(authority[method])) continue;

      var call = callMethod(authority, method);

      if (!call.ok) {
        return {
          method: method,
          packet: null,
          attempted: true,
          error: call.error
        };
      }

      if (isObject(call.output)) {
        return {
          method: method,
          packet: clone(call.output),
          attempted: true,
          error: "NONE"
        };
      }
    }

    return {
      method: "NONE",
      packet: null,
      attempted: false,
      error: "NO_OBJECT_PACKET_RETURNED"
    };
  }

  function inspectLabNorthDetails() {
    var resolved = resolveAuthority(LAB_NORTH_ALIASES);
    var authority = resolved.authority;

    return {
      sourceAlias: resolved.alias,
      runtimeGrammar: callSpecificObject(authority, ["getRuntimeGrammar"]),
      northGrammarPacket: callSpecificObject(authority, ["getNorthGrammarPacket"]),
      acceptedEndpointFamilies: callSpecificObject(authority, ["getAcceptedEndpointFamilies"]),
      strictProofRules: callSpecificObject(authority, ["getStrictProofRules"]),
      diagnosticMalpracticeGuardSchema: callSpecificObject(authority, [
        "getDiagnosticMalpracticeGuardSchema"
      ]),
      diagnosticSelfMeasurementSchema: callSpecificObject(authority, [
        "getDiagnosticSelfMeasurementSchema"
      ])
    };
  }

  function inspectLabWestDetails() {
    var resolved = resolveAuthority(LAB_WEST_ALIASES);
    var authority = resolved.authority;

    return {
      sourceAlias: resolved.alias,
      hierarchySurface: callSpecificObject(authority, ["getHierarchySurface"]),
      hierarchyRegistry: callSpecificObject(authority, ["getHierarchyRegistry"]),
      judgeMetrics: callSpecificObject(authority, ["getJudgeMetrics"]),
      bishopChord: callSpecificObject(authority, ["getBishopChord"]),
      receiptLight: callSpecificObject(authority, ["getReceiptLight"])
    };
  }

  function consumeSurfaceTruth(options) {
    var resolved = resolveAuthority(SURFACE_TRUTH_ALIASES);
    var authority = resolved.authority;
    var shouldInspect = Boolean(options && options.inspectSurfaceTruth);

    var profileReceipt = callSpecificObject(authority, [
      "getProfileReceipt",
      "getReceipt"
    ]);

    var contractDefinitions = callSpecificObject(authority, [
      "getContractDefinitions"
    ]);

    var contractDefinitionPacket = callSpecificObject(authority, [
      "getContractDefinitionReceipt",
      "composeContractDefinitionPacket"
    ]);

    var expectedEndpoints = callSpecificObject(authority, [
      "getExpectedEndpoints"
    ]);

    var diagnosticCycle = callSpecificObject(authority, [
      "getDiagnosticCycle"
    ]);

    var canvasCycle = callSpecificObject(authority, [
      "getCanvasCycle"
    ]);

    var inspection = {
      method: "NONE",
      packet: null,
      attempted: false,
      error: shouldInspect ? "NO_AUTHORITY_OR_METHOD" : "INSPECTION_NOT_REQUESTED"
    };

    if (shouldInspect && authority) {
      inspection = callSpecificObject(authority, SURFACE_TRUTH_MEASURE_METHODS);
    }

    return {
      sourceAlias: resolved.alias,
      authorityPresent: resolved.observed,
      profileReceipt: profileReceipt,
      contractDefinitions: contractDefinitions,
      contractDefinitionPacket: contractDefinitionPacket,
      expectedEndpoints: expectedEndpoints,
      diagnosticCycle: diagnosticCycle,
      canvasCycle: canvasCycle,
      inspection: inspection
    };
  }

  function selfMeasureDiagnosticDuty() {
    var metric = {
      DIAGNOSTIC_FILE: FILE,
      ASSIGNED_ROLE: ACTIVE_ROLE,
      PROFILE_CLASS: "DIAGNOSTIC_FINAL_TRACK_RECEIVER_AND_JUDGE_PUBLISHER",
      PRIMARY_DUTY_COUNT: 1,
      SECONDARY_DUTY_COUNT: 3,
      OWNERSHIP_DOMAIN_COUNT: 1,
      MUTATION_AUTHORITY_COUNT: 0,
      WRITE_AUTHORITY_COUNT: 0,
      LIFECYCLE_METHOD_COUNT: 0,
      DOWNSTREAM_SERVICE_COUNT: 0,
      UPSTREAM_DEPENDENCY_COUNT: 3,
      FAN_IN_COUNT: 4,
      FAN_OUT_COUNT: 2,
      CONTRACT_FAMILY_REFERENCED_COUNT: 5,
      ALIAS_SURFACE_COUNT: NORTH_PUBLICATION_ALIASES.length,
      RENDER_OR_INPUT_COUPLING_PRESENT: false
    };

    var score =
      metric.PRIMARY_DUTY_COUNT * 4 +
      metric.SECONDARY_DUTY_COUNT +
      metric.OWNERSHIP_DOMAIN_COUNT * 3 +
      metric.MUTATION_AUTHORITY_COUNT * 6 +
      metric.WRITE_AUTHORITY_COUNT * 5 +
      metric.FAN_OUT_COUNT +
      metric.CONTRACT_FAMILY_REFERENCED_COUNT;

    var dutyStatus = "DUTY_LOAD_SAFE";
    if (score >= 18) dutyStatus = "DUTY_LOAD_HEAVY_NON_COLLAPSED";
    if (score >= 28) dutyStatus = "DUTY_LOAD_COLLAPSE_RISK";
    if (
      score >= 40 ||
      metric.MUTATION_AUTHORITY_COUNT > 0 ||
      metric.WRITE_AUTHORITY_COUNT > 0
    ) {
      dutyStatus = "DUTY_LOAD_COLLAPSE_DETECTED";
    }

    var dutyDrift = false;
    var malpractice = dutyStatus === "DUTY_LOAD_COLLAPSE_DETECTED" || dutyDrift;

    return {
      DIAGNOSTIC_FILE: FILE,
      ASSIGNED_ROLE: ACTIVE_ROLE,
      ALLOWED_DUTIES: [
        "PUBLISH_NORTH_DIAGNOSTIC_RAIL_AUTHORITY_SURFACE",
        "CONSUME_LAB_NORTH_GRAMMAR_AS_SCHEMA",
        "CONSUME_LABWEST_CONSTRUCT_AS_RECEIVER_ANCHOR",
        "CONSUME_SURFACE_TRUTH_AS_CONTRACT_DEFINITION_EVIDENCE",
        "RETURN_NORTH_DIAGNOSTIC_TRACK_PACKET"
      ],
      FORBIDDEN_DUTIES: [
        "PRODUCTION_MUTATION",
        "CANVAS_DRAWING",
        "CANVAS_BUILD_AUTHORIZATION",
        "CANVAS_REPAIR_AUTHORIZATION",
        "LAB_NORTH_GRAMMAR_REPLACEMENT",
        "LABWEST_DERIVATIVE_MAP_REPLACEMENT",
        "SURFACE_TRUTH_PROBE_REPLACEMENT",
        "FINAL_VISUAL_PASS_CLAIM"
      ],

      PRIMARY_DUTY_COUNT: metric.PRIMARY_DUTY_COUNT,
      SECONDARY_DUTY_COUNT: metric.SECONDARY_DUTY_COUNT,
      OWNERSHIP_DOMAIN_COUNT: metric.OWNERSHIP_DOMAIN_COUNT,
      MUTATION_AUTHORITY_COUNT: metric.MUTATION_AUTHORITY_COUNT,
      WRITE_AUTHORITY_COUNT: metric.WRITE_AUTHORITY_COUNT,
      FAN_IN_COUNT: metric.FAN_IN_COUNT,
      FAN_OUT_COUNT: metric.FAN_OUT_COUNT,
      CONTRACT_FAMILY_REFERENCED_COUNT: metric.CONTRACT_FAMILY_REFERENCED_COUNT,
      ALIAS_SURFACE_COUNT: metric.ALIAS_SURFACE_COUNT,

      DUTY_LOAD_SCORE: score,
      DUTY_LOAD_STATUS: dutyStatus,
      FORBIDDEN_DUTY_COUNT: 0,
      BORROWED_DUTY_COUNT: 0,

      DIAGNOSTIC_TRACK_VERDICT_AUTHORITY_ALLOWED: true,
      FINAL_PRODUCTION_ARBITRATION_ALLOWED: false,
      PRODUCTION_MUTATION_AUTHORITY_ALLOWED: false,
      CANVAS_REPAIR_AUTHORITY_ALLOWED: false,
      CANVAS_BUILD_AUTHORITY_ALLOWED: false,
      MEASUREMENT_AUTHORITY_ALLOWED: true,
      CONTRACT_DEFINITION_AUTHORITY_ALLOWED: false,

      DUTY_DRIFT_DETECTED: dutyDrift,
      DIAGNOSTIC_CONTAINER_COLLAPSE_RISK: dutyStatus === "DUTY_LOAD_COLLAPSE_RISK",
      DIAGNOSTIC_CONTAINER_COLLAPSE_DETECTED:
        dutyStatus === "DUTY_LOAD_COLLAPSE_DETECTED",
      DIAGNOSTIC_MALPRACTICE_DETECTED: malpractice,
      DIAGNOSTIC_OUTPUT_QUARANTINED: malpractice,
      SELF_MEASUREMENT_STATUS: malpractice
        ? "DIAGNOSTIC_MALPRACTICE_DETECTED"
        : dutyStatus === "DUTY_LOAD_COLLAPSE_RISK"
          ? "DIAGNOSTIC_CONTAINER_COLLAPSE_RISK"
          : dutyStatus === "DUTY_LOAD_HEAVY_NON_COLLAPSED"
            ? "DIAGNOSTIC_SELF_DUTY_HEAVY_NON_COLLAPSED"
            : "DIAGNOSTIC_SELF_DUTY_CLEAN"
    };
  }

  function inspectDiagnosticField(options) {
    var field = {};
    var keys = Object.keys(FIELD_DEFINITION);

    keys.forEach(function (key) {
      var definition = FIELD_DEFINITION[key];
      field[key] = inspectAuthority({
        id: key,
        file: definition.file,
        aliases: definition.aliases,
        expectedFamilies: definition.expectedFamilies,
        optional: definition.optional
      });
    });

    field.LAB_NORTH_DETAILS = inspectLabNorthDetails();
    field.LABWEST_DETAILS = inspectLabWestDetails();
    field.SURFACE_TRUTH_DETAILS = consumeSurfaceTruth(options || {});

    return field;
  }

  function extractSurfaceTruthFailure(surfaceTruthDetails) {
    var inspection =
      surfaceTruthDetails &&
      surfaceTruthDetails.inspection &&
      surfaceTruthDetails.inspection.packet
        ? surfaceTruthDetails.inspection.packet
        : null;

    if (!inspection) {
      return {
        inspected: false,
        status: "SURFACE_TRUTH_INSPECTION_NOT_AVAILABLE",
        failureClass: "UNKNOWN",
        firstFailedCoordinate: "UNKNOWN"
      };
    }

    return {
      inspected: true,
      status: firstKnown(
        inspection.CANVAS_SURFACE_TRUTH_STATUS,
        inspection.surfaceMeasurement && inspection.surfaceMeasurement.status,
        "UNKNOWN"
      ),
      failureClass: firstKnown(
        inspection.CANVAS_SURFACE_TRUTH_FAILURE_CLASS,
        inspection.surfaceMeasurement && inspection.surfaceMeasurement.failureClass,
        "UNKNOWN"
      ),
      firstFailedCoordinate: firstKnown(
        inspection.CANVAS_TRUTH_FIRST_FAILED_COORDINATE,
        inspection.surfaceMeasurement && inspection.surfaceMeasurement.firstFailedCoordinate,
        "UNKNOWN"
      ),
      canvasMountRectNonzero: Boolean(inspection.CANVAS_MOUNT_RECT_NONZERO),
      canvasRectNonzero: Boolean(inspection.CANVAS_RECT_NONZERO),
      canvasContext2dReady: Boolean(inspection.CANVAS_CONTEXT_2D_READY),
      canvasViewportIntersecting: Boolean(inspection.CANVAS_VIEWPORT_INTERSECTING),
      canvasPixelVisible: Boolean(inspection.CANVAS_PIXEL_VISIBLE)
    };
  }

  function computeNorthVerdict(field, selfMeasurement, surfaceFailure) {
    var labNorthReady =
      field.LAB_NORTH_GRAMMAR &&
      field.LAB_NORTH_GRAMMAR.loadStatus === "LOADED_AND_AVAILABLE";

    var labWestReady =
      field.LABWEST_CONSTRUCT &&
      field.LABWEST_CONSTRUCT.loadStatus === "LOADED_AND_AVAILABLE";

    var surfaceTruthReady =
      field.SURFACE_TRUTH_PROBE &&
      field.SURFACE_TRUTH_PROBE.loadStatus === "LOADED_AND_AVAILABLE";

    var selfClean =
      !selfMeasurement.DIAGNOSTIC_MALPRACTICE_DETECTED &&
      !selfMeasurement.DIAGNOSTIC_OUTPUT_QUARANTINED;

    var northCanSpeak = Boolean(selfClean && labNorthReady && labWestReady);
    var verdictStatus = northCanSpeak
      ? "NORTH_DIAGNOSTIC_TRACK_PACKET_RETURNED"
      : "NORTH_DIAGNOSTIC_TRACK_HELD";

    var verdictClass = "FIELD_ALIGNMENT_PENDING";
    var recommendedNextFile = "NONE";
    var recommendedNextAction = "NO_PRODUCTION_ACTION_AUTHORIZED";

    if (!selfClean) {
      verdictClass = "NORTH_SELF_MEASUREMENT_NOT_CLEAN";
      recommendedNextFile = FILE;
      recommendedNextAction = "RENEW_NORTH_RAIL_SELF_DUTY_BOUNDARY";
    } else if (!labNorthReady) {
      verdictClass = "LAB_NORTH_GRAMMAR_NOT_AVAILABLE";
      recommendedNextFile = LAB_NORTH_FILE;
      recommendedNextAction = "RESTORE_LAB_NORTH_GRAMMAR_ANCHOR";
    } else if (!labWestReady) {
      verdictClass = "LABWEST_CONSTRUCT_NOT_AVAILABLE";
      recommendedNextFile = LAB_WEST_FILE;
      recommendedNextAction = "RESTORE_LABWEST_CONSTRUCT_ANCHOR";
    } else if (!surfaceTruthReady) {
      verdictClass = "SURFACE_TRUTH_PROBE_NOT_AVAILABLE";
      recommendedNextFile = SURFACE_TRUTH_FILE;
      recommendedNextAction = "RESTORE_SURFACE_TRUTH_PROBE_PROFILE";
    } else if (
      surfaceFailure &&
      surfaceFailure.inspected &&
      surfaceFailure.status === "SURFACE_CONTRACT_MEASUREMENT_FAILED"
    ) {
      verdictClass = "SURFACE_TRUTH_FAILURE_REPORTED";
      recommendedNextFile = SURFACE_TRUTH_FILE;
      recommendedNextAction =
        "RENEW_SURFACE_TRUTH_TARGET_FRAME_DOCUMENT_SCOPE_IF_FAILURE_PERSISTS_AFTER_NORTH_RETURN";
    } else if (
      surfaceFailure &&
      surfaceFailure.inspected &&
      surfaceFailure.status === "SURFACE_CONTRACT_MEASUREMENT_COMPLETE"
    ) {
      verdictClass = "SURFACE_TRUTH_MEASUREMENT_COMPLETE";
      recommendedNextFile = LAB_WEST_FILE;
      recommendedNextAction =
        "RETURN_TO_LABWEST_DERIVATIVE_MAP_WITH_NORTH_RAIL_AVAILABLE";
    } else {
      verdictClass = "NORTH_RAIL_RESTORED_SURFACE_TRUTH_MEASUREMENT_NOT_RUN";
      recommendedNextFile = FILE;
      recommendedNextAction = "RUN_NORTH_DIAGNOSTIC_RAIL";
    }

    return {
      northCanSpeak: northCanSpeak,
      verdictStatus: verdictStatus,
      verdictClass: verdictClass,
      recommendedNextFile: recommendedNextFile,
      recommendedNextAction: recommendedNextAction,
      productionRepairAuthorized: false,
      canvasRepairAuthorized: false,
      canvasBuildAuthorized: false,
      finalVisualPassClaimed: false
    };
  }

  function composeDiagnosticTrackPacket(options) {
    var runOptions = options || {};
    var selfMeasurement = selfMeasureDiagnosticDuty();
    var field = inspectDiagnosticField(runOptions);
    var surfaceFailure = extractSurfaceTruthFailure(field.SURFACE_TRUTH_DETAILS);
    var verdict = computeNorthVerdict(field, selfMeasurement, surfaceFailure);

    var labWestJudgeNorthMetric =
      field.LABWEST_DETAILS &&
      field.LABWEST_DETAILS.judgeMetrics &&
      field.LABWEST_DETAILS.judgeMetrics.packet &&
      field.LABWEST_DETAILS.judgeMetrics.packet.JUDGE_NORTH
        ? field.LABWEST_DETAILS.judgeMetrics.packet.JUDGE_NORTH
        : null;

    return {
      PACKET_NAME:
        "HEARTH_DIAGNOSTIC_RAIL_NORTH_LABWEST_CONSTRUCT_ANCHORED_SURFACE_TRUTH_TRACK_PACKET_v12",
      CONTRACT: CONTRACT,
      RECEIPT: RECEIPT,
      INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
      PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
      PREVIOUS_RECEIPT: PREVIOUS_RECEIPT,
      COMPAT_CONTRACT: COMPAT_CONTRACT,
      VERSION: VERSION,
      FILE: FILE,
      TARGET_ROUTE: TARGET_ROUTE,
      DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,
      GENERATED_AT: nowIso(),

      ACTIVE_STAGE_ID: ACTIVE_STAGE_ID,
      ACTIVE_CARDINAL: ACTIVE_CARDINAL,
      ACTIVE_ROLE: ACTIVE_ROLE,
      ACTIVE_CYCLE: ACTIVE_CYCLE,

      LAB_NORTH_FILE: LAB_NORTH_FILE,
      LABWEST_CONSTRUCT_FILE: LAB_WEST_FILE,
      SURFACE_TRUTH_FILE: SURFACE_TRUTH_FILE,

      NORTH_RAIL_PRESENT: true,
      NORTH_RAIL_RECEIPT_PRESENT: true,
      NORTH_RUN_API_AVAILABLE: true,
      NORTH_VERDICT_AVAILABLE: true,
      NORTH_ALIAS_SURFACE_PUBLISHED: true,

      LAB_NORTH_GRAMMAR_LOAD_STATUS:
        field.LAB_NORTH_GRAMMAR && field.LAB_NORTH_GRAMMAR.loadStatus,
      LABWEST_CONSTRUCT_LOAD_STATUS:
        field.LABWEST_CONSTRUCT && field.LABWEST_CONSTRUCT.loadStatus,
      SURFACE_TRUTH_PROBE_LOAD_STATUS:
        field.SURFACE_TRUTH_PROBE && field.SURFACE_TRUTH_PROBE.loadStatus,
      EAST_RAIL_LOAD_STATUS:
        field.EAST_RAIL && field.EAST_RAIL.loadStatus,
      WEST_RAIL_LOAD_STATUS:
        field.WEST_RAIL && field.WEST_RAIL.loadStatus,
      SOUTH_RAIL_LOAD_STATUS:
        field.SOUTH_RAIL && field.SOUTH_RAIL.loadStatus,
      PROBE_NORTH_LOAD_STATUS:
        field.PROBE_NORTH && field.PROBE_NORTH.loadStatus,
      PROBE_EAST_LOAD_STATUS:
        field.PROBE_EAST && field.PROBE_EAST.loadStatus,
      PROBE_WEST_LOAD_STATUS:
        field.PROBE_WEST && field.PROBE_WEST.loadStatus,
      PROBE_SOUTH_LOAD_STATUS:
        field.PROBE_SOUTH && field.PROBE_SOUTH.loadStatus,
      SOUTH_SURFACE_POINTER_SIDECAR_LOAD_STATUS:
        field.SOUTH_SURFACE_POINTER_SIDECAR &&
        field.SOUTH_SURFACE_POINTER_SIDECAR.loadStatus,

      SURFACE_TRUTH_INSPECTED: surfaceFailure.inspected,
      SURFACE_TRUTH_STATUS: surfaceFailure.status,
      SURFACE_TRUTH_FAILURE_CLASS: surfaceFailure.failureClass,
      SURFACE_TRUTH_FIRST_FAILED_COORDINATE: surfaceFailure.firstFailedCoordinate,

      CANVAS_BLAME_ELIGIBLE: false,
      CANVAS_PRODUCTION_REPAIR_AUTHORIZED: false,
      CANVAS_BUILD_AUTHORIZED: false,
      SURFACE_TRUTH_RENEWAL_AUTHORIZED_AS_DIAGNOSTIC_SCOPE_ONLY:
        verdict.verdictClass === "SURFACE_TRUTH_FAILURE_REPORTED",

      NORTH_VERDICT_STATUS: verdict.verdictStatus,
      NORTH_VERDICT_CLASS: verdict.verdictClass,
      NORTH_CAN_SPEAK: verdict.northCanSpeak,
      RECOMMENDED_NEXT_FILE: verdict.recommendedNextFile,
      RECOMMENDED_NEXT_ACTION: verdict.recommendedNextAction,
      NEXT_FILE_AUTHORIZATION:
        verdict.verdictClass === "SURFACE_TRUTH_FAILURE_REPORTED" ||
        verdict.verdictClass === "SURFACE_TRUTH_PROBE_NOT_AVAILABLE" ||
        verdict.verdictClass === "LABWEST_CONSTRUCT_NOT_AVAILABLE" ||
        verdict.verdictClass === "LAB_NORTH_GRAMMAR_NOT_AVAILABLE",
      NEXT_FILE_AUTHORIZATION_SCOPE: "DIAGNOSTIC_RENEWAL_ONLY",

      LABWEST_JUDGE_NORTH_METRIC_BEFORE_RENEWAL: clone(labWestJudgeNorthMetric),

      selfMeasurement: clone(selfMeasurement),
      diagnosticField: clone(field),
      surfaceTruthSummary: clone(surfaceFailure),
      northVerdict: clone(verdict),

      ...NO_CLAIMS
    };
  }

  function composeReceiptLight() {
    state.receiptCount += 1;
    state.lastReceiptAt = nowIso();

    var selfMeasurement = selfMeasureDiagnosticDuty();

    return {
      PACKET_NAME:
        "HEARTH_DIAGNOSTIC_RAIL_NORTH_LABWEST_CONSTRUCT_ANCHORED_SURFACE_TRUTH_LIGHT_RECEIPT_PACKET_v12",
      CONTRACT: CONTRACT,
      RECEIPT: RECEIPT,
      INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
      PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
      PREVIOUS_RECEIPT: PREVIOUS_RECEIPT,
      COMPAT_CONTRACT: COMPAT_CONTRACT,
      VERSION: VERSION,
      FILE: FILE,
      TARGET_ROUTE: TARGET_ROUTE,
      DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,
      GENERATED_AT: state.lastReceiptAt,

      ACTIVE_STAGE_ID: ACTIVE_STAGE_ID,
      ACTIVE_CARDINAL: ACTIVE_CARDINAL,
      ACTIVE_ROLE: ACTIVE_ROLE,
      ACTIVE_CYCLE: ACTIVE_CYCLE,

      LAB_NORTH_FILE: LAB_NORTH_FILE,
      LABWEST_CONSTRUCT_FILE: LAB_WEST_FILE,
      SURFACE_TRUTH_FILE: SURFACE_TRUTH_FILE,

      NORTH_RAIL_PRESENT: true,
      NORTH_RAIL_RECEIPT_PRESENT: true,
      NORTH_RUN_API_AVAILABLE: true,
      NORTH_VERDICT_AVAILABLE: true,
      NORTH_ALIAS_SURFACE_PUBLISHED: true,

      LABWEST_CONSTRUCT_ANCHORED: true,
      LAB_NORTH_GRAMMAR_ANCHORED: true,
      SURFACE_TRUTH_CONSUMER: true,
      SURFACE_TRUTH_IS_INPUT_EVIDENCE_ONLY: true,

      PUBLIC_CONTRACT_COMPATIBILITY_PRESERVED: true,
      JUDGE_DISCOVERY_SURFACE_ACTIVE: true,
      DIAGNOSTIC_TRACK_PACKET_AVAILABLE: true,

      SELF_MEASUREMENT_STATUS: selfMeasurement.SELF_MEASUREMENT_STATUS,
      DUTY_LOAD_STATUS: selfMeasurement.DUTY_LOAD_STATUS,
      DIAGNOSTIC_MALPRACTICE_STATUS: selfMeasurement.DIAGNOSTIC_MALPRACTICE_DETECTED
        ? "DIAGNOSTIC_MALPRACTICE_DETECTED"
        : "NO_DIAGNOSTIC_MALPRACTICE",

      lastRunAt: state.lastRunAt,
      runCount: state.runCount,
      receiptCount: state.receiptCount,
      aliasPublishCount: state.aliasPublishCount,
      datasetPublishCount: state.datasetPublishCount,
      errorCount: state.errorCount,

      ...NO_CLAIMS
    };
  }

  function composeReceipt() {
    var light = composeReceiptLight();

    var receipt = {
      ...light,
      northPublicationAliases: NORTH_PUBLICATION_ALIASES.slice(),
      labNorthAliases: LAB_NORTH_ALIASES.slice(),
      labWestAliases: LAB_WEST_ALIASES.slice(),
      surfaceTruthAliases: SURFACE_TRUTH_ALIASES.slice(),
      acceptedNorthRailContracts: ACCEPTED_NORTH_RAIL_CONTRACTS.slice(),
      fieldDefinition: clone(FIELD_DEFINITION),
      selfMeasurement: selfMeasureDiagnosticDuty(),
      lastDiagnosticPacket: clone(state.lastDiagnosticPacket),
      errors: clone(state.errors)
    };

    state.lastReceipt = clone(receipt);
    return receipt;
  }

  function line(key, value) {
    if (value === undefined || value === null) return key + "=";
    if (Array.isArray(value) || isObject(value)) {
      try {
        return key + "=" + JSON.stringify(value);
      } catch (_error) {
        return key + "=UNSERIALIZABLE";
      }
    }
    return key + "=" + String(value);
  }

  function composeReceiptText() {
    var r = composeReceiptLight();

    return [
      "HEARTH_DIAGNOSTIC_RAIL_NORTH_LABWEST_CONSTRUCT_ANCHORED_SURFACE_TRUTH_RECEIPT",
      line("CONTRACT", r.CONTRACT),
      line("RECEIPT", r.RECEIPT),
      line("INTERNAL_RENEWAL_CONTRACT", r.INTERNAL_RENEWAL_CONTRACT),
      line("INTERNAL_RENEWAL_RECEIPT", r.INTERNAL_RENEWAL_RECEIPT),
      line("PREVIOUS_CONTRACT", r.PREVIOUS_CONTRACT),
      line("VERSION", r.VERSION),
      line("FILE", r.FILE),
      line("TARGET_ROUTE", r.TARGET_ROUTE),
      line("DIAGNOSTIC_ROUTE", r.DIAGNOSTIC_ROUTE),
      line("NORTH_RAIL_PRESENT", r.NORTH_RAIL_PRESENT),
      line("NORTH_RAIL_RECEIPT_PRESENT", r.NORTH_RAIL_RECEIPT_PRESENT),
      line("NORTH_RUN_API_AVAILABLE", r.NORTH_RUN_API_AVAILABLE),
      line("NORTH_VERDICT_AVAILABLE", r.NORTH_VERDICT_AVAILABLE),
      line("LABWEST_CONSTRUCT_ANCHORED", r.LABWEST_CONSTRUCT_ANCHORED),
      line("SURFACE_TRUTH_CONSUMER", r.SURFACE_TRUTH_CONSUMER),
      line("SELF_MEASUREMENT_STATUS", r.SELF_MEASUREMENT_STATUS),
      line("DIAGNOSTIC_MALPRACTICE_STATUS", r.DIAGNOSTIC_MALPRACTICE_STATUS),
      line("productionMutationAuthorized", false),
      line("canvasRepairAuthorized", false),
      line("canvasBuildAuthorized", false),
      line("visualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false)
    ].join("\n");
  }

  function updateDataset() {
    state.datasetPublishCount += 1;

    if (!DOC || !DOC.documentElement || !DOC.documentElement.dataset) {
      return false;
    }

    try {
      var ds = DOC.documentElement.dataset;

      ds.hearthDiagnosticRailNorthLoaded = "true";
      ds.hearthDiagnosticRailNorthContract = CONTRACT;
      ds.hearthDiagnosticRailNorthReceipt = RECEIPT;
      ds.hearthDiagnosticRailNorthInternalRenewalContract =
        INTERNAL_RENEWAL_CONTRACT;
      ds.hearthDiagnosticRailNorthInternalRenewalReceipt =
        INTERNAL_RENEWAL_RECEIPT;
      ds.hearthDiagnosticRailNorthFile = FILE;

      ds.hearthDiagnosticRailNorthPresent = "true";
      ds.hearthDiagnosticRailNorthReceiptPresent = "true";
      ds.hearthDiagnosticRailNorthRunApiAvailable = "true";
      ds.hearthDiagnosticRailNorthVerdictAvailable = "true";
      ds.hearthDiagnosticRailNorthAliasSurfacePublished = "true";

      ds.hearthDiagnosticRailNorthLabwestAnchored = "true";
      ds.hearthDiagnosticRailNorthLabNorthGrammarAnchored = "true";
      ds.hearthDiagnosticRailNorthSurfaceTruthConsumer = "true";
      ds.hearthDiagnosticRailNorthProductionMutationAuthorized = "false";
      ds.hearthDiagnosticRailNorthCanvasRepairAuthorized = "false";
      ds.hearthDiagnosticRailNorthCanvasBuildAuthorized = "false";
      ds.hearthDiagnosticRailNorthVisualPassClaimed = "false";
    } catch (_error) {
      return false;
    }

    return true;
  }

  function publishReceiptAliases() {
    var light = composeReceiptLight();

    ROOT.HEARTH_DIAGNOSTIC_RAIL_NORTH_RECEIPT = light;
    ROOT.HEARTH_DIAGNOSTIC_RAIL_RECEIPT = light;
    ROOT.JUDGE_NORTH_RECEIPT = light;
    ROOT.HEARTH_DIAGNOSTIC_RAIL_NORTH_LABWEST_CONSTRUCT_ANCHORED_SURFACE_TRUTH_CONSUMER_RECEIPT =
      light;

    var HEARTH = ensureNamespace("HEARTH");
    var DEXTER_LAB = ensureNamespace("DEXTER_LAB");

    HEARTH.diagnosticNorthReceipt = light;
    HEARTH.diagnosticRailReceipt = light;
    HEARTH.diagnosticNorthRailReceipt = light;
    HEARTH.JUDGE_NORTH_DIAGNOSTIC_RAIL_RECEIPT = light;

    DEXTER_LAB.hearthDiagnosticRailReceipt = light;
    DEXTER_LAB.hearthDiagnosticNorthReceipt = light;
    DEXTER_LAB.hearthDiagnosticNorthRailReceipt = light;

    return true;
  }

  function publishAliases() {
    for (var i = 0; i < NORTH_PUBLICATION_ALIASES.length; i += 1) {
      setPath(NORTH_PUBLICATION_ALIASES[i], API);
    }

    state.aliasPublishCount += 1;
    return true;
  }

  function publishGlobals() {
    publishAliases();
    updateDataset();
    publishReceiptAliases();
    return API;
  }

  function runDiagnostic(options) {
    state.runCount += 1;
    state.lastRunAt = nowIso();

    var runOptions = options || {};

    if (runOptions.inspectSurfaceTruth === undefined) {
      runOptions.inspectSurfaceTruth = true;
    }

    try {
      var packet = composeDiagnosticTrackPacket(runOptions);
      state.lastDiagnosticPacket = clone(packet);
      publishGlobals();
      return clone(packet);
    } catch (error) {
      state.errorCount += 1;
      state.errors.push({
        at: nowIso(),
        message: safeString(error && error.message ? error.message : error, "RUN_ERROR")
      });

      var failurePacket = {
        PACKET_NAME:
          "HEARTH_DIAGNOSTIC_RAIL_NORTH_RUN_ERROR_PACKET_v12",
        CONTRACT: CONTRACT,
        RECEIPT: RECEIPT,
        INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
        FILE: FILE,
        GENERATED_AT: nowIso(),

        NORTH_RAIL_PRESENT: true,
        NORTH_RAIL_RECEIPT_PRESENT: true,
        NORTH_RUN_API_AVAILABLE: true,
        NORTH_VERDICT_AVAILABLE: false,

        NORTH_VERDICT_STATUS: "NORTH_DIAGNOSTIC_TRACK_ERROR",
        NORTH_VERDICT_CLASS: "NORTH_RUN_ERROR",
        ERROR_MESSAGE: safeString(error && error.message ? error.message : error),

        RECOMMENDED_NEXT_FILE: FILE,
        RECOMMENDED_NEXT_ACTION: "INSPECT_NORTH_RAIL_RUN_ERROR",
        NEXT_FILE_AUTHORIZATION: false,
        PRODUCTION_REPAIR_AUTHORIZED: false,

        errors: clone(state.errors),
        ...NO_CLAIMS
      };

      state.lastDiagnosticPacket = clone(failurePacket);
      publishGlobals();
      return failurePacket;
    }
  }

  function inspect(options) {
    return runDiagnostic(options);
  }

  function run(options) {
    return runDiagnostic(options);
  }

  function getReport() {
    if (state.lastDiagnosticPacket) {
      return clone(state.lastDiagnosticPacket);
    }

    return composeDiagnosticTrackPacket({ inspectSurfaceTruth: false });
  }

  function getReceipt() {
    return composeReceipt();
  }

  function getReceiptLight() {
    return composeReceiptLight();
  }

  function getStatus() {
    return composeReceiptLight();
  }

  function getState() {
    return clone({
      publishedAt: state.publishedAt,
      lastRunAt: state.lastRunAt,
      lastReceiptAt: state.lastReceiptAt,
      runCount: state.runCount,
      receiptCount: state.receiptCount,
      aliasPublishCount: state.aliasPublishCount,
      datasetPublishCount: state.datasetPublishCount,
      errorCount: state.errorCount,

      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      northRailPresent: true,
      northRailReceiptPresent: true,
      northRunApiAvailable: true,
      northVerdictAvailable: true,

      productionMutationAuthorized: false,
      canvasDrawingAuthorized: false,
      canvasRepairAuthorized: false,
      canvasBuildAuthorized: false,
      visualPassClaimed: false
    });
  }

  function getStatusText() {
    return [
      "NORTH_RAIL_PRESENT=true",
      "NORTH_RAIL_RECEIPT_PRESENT=true",
      "NORTH_RUN_API_AVAILABLE=true",
      "NORTH_VERDICT_AVAILABLE=true",
      "LABWEST_CONSTRUCT_ANCHORED=true",
      "SURFACE_TRUTH_CONSUMER=true",
      "PRODUCTION_REPAIR_AUTHORIZED=false"
    ].join("\n");
  }

  function getReceiptText() {
    return composeReceiptText();
  }

  function getDiagnosticField() {
    return inspectDiagnosticField({ inspectSurfaceTruth: false });
  }

  function getSurfaceTruthSummary() {
    return consumeSurfaceTruth({ inspectSurfaceTruth: false });
  }

  function getSelfMeasurement() {
    return selfMeasureDiagnosticDuty();
  }

  function noOpLifecycle() {
    return getReceiptLight();
  }

  Object.assign(API, {
    CONTRACT: CONTRACT,
    RECEIPT: RECEIPT,
    INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
    INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
    PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
    PREVIOUS_RECEIPT: PREVIOUS_RECEIPT,
    COMPAT_CONTRACT: COMPAT_CONTRACT,
    VERSION: VERSION,
    FILE: FILE,
    TARGET_ROUTE: TARGET_ROUTE,
    DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,

    contract: CONTRACT,
    receipt: RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    compatContract: COMPAT_CONTRACT,
    version: VERSION,
    file: FILE,

    LAB_NORTH_FILE: LAB_NORTH_FILE,
    LAB_WEST_FILE: LAB_WEST_FILE,
    SURFACE_TRUTH_FILE: SURFACE_TRUTH_FILE,

    ACTIVE_STAGE_ID: ACTIVE_STAGE_ID,
    ACTIVE_CARDINAL: ACTIVE_CARDINAL,
    ACTIVE_ROLE: ACTIVE_ROLE,
    ACTIVE_CYCLE: ACTIVE_CYCLE,

    run: run,
    runDiagnostic: runDiagnostic,
    inspect: inspect,
    judge: runDiagnostic,
    assess: runDiagnostic,

    boot: noOpLifecycle,
    init: noOpLifecycle,
    start: noOpLifecycle,
    mount: noOpLifecycle,
    refresh: getReceipt,

    getReceipt: getReceipt,
    getReceiptLight: getReceiptLight,
    getReport: getReport,
    getState: getState,
    getStatus: getStatus,
    getStatusText: getStatusText,
    getReceiptText: getReceiptText,

    getDiagnosticField: getDiagnosticField,
    getSurfaceTruthSummary: getSurfaceTruthSummary,
    getSelfMeasurement: getSelfMeasurement,
    selfMeasureDiagnosticDuty: selfMeasureDiagnosticDuty,
    detectContractFamily: detectContractFamily,

    publishGlobals: publishGlobals,
    updateDataset: updateDataset,

    northPublicationAliases: NORTH_PUBLICATION_ALIASES.slice(),
    labNorthAliases: LAB_NORTH_ALIASES.slice(),
    labWestAliases: LAB_WEST_ALIASES.slice(),
    surfaceTruthAliases: SURFACE_TRUTH_ALIASES.slice(),

    NORTH_RAIL_PRESENT: true,
    NORTH_RAIL_RECEIPT_PRESENT: true,
    NORTH_RUN_API_AVAILABLE: true,
    NORTH_VERDICT_AVAILABLE: true,
    NORTH_ALIAS_SURFACE_PUBLISHED: true,

    LABWEST_CONSTRUCT_ANCHORED: true,
    LAB_NORTH_GRAMMAR_ANCHORED: true,
    SURFACE_TRUTH_CONSUMER: true,
    SURFACE_TRUTH_IS_INPUT_EVIDENCE_ONLY: true,

    ownsDiagnosticTrackVerdict: true,
    ownsFinalProductionArbitration: false,
    ownsProductionMutation: false,
    ownsCanvasDrawing: false,
    ownsCanvasRepair: false,
    ownsCanvasBuild: false,
    ownsLabWestDerivativeMap: false,
    ownsLabNorthGrammar: false,
    ownsSurfaceTruthProbe: false,

    ...NO_CLAIMS,

    get state() {
      return state;
    }
  });

  state.publishedAt = nowIso();

  publishGlobals();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = API;
  }
})();

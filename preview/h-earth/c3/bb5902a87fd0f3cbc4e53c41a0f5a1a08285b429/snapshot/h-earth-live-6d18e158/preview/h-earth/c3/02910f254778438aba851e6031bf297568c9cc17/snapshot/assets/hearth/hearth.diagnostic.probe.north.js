// /assets/hearth/hearth.diagnostic.probe.north.js
// HEARTH_DIAGNOSTIC_PROBE_NORTH_FILE_COMPOSITION_ZONE_COORDINATOR_TNT_v1
// Full-file addition/replacement.
// Diagnostic Probe NORTH only.
// Purpose:
// - Add the missing under-hood diagnostic instrument layer without renewing the origin diagnostic rail.
// - Preserve /assets/hearth/hearth.diagnostic.rail.js as the visible NORTH diagnostic rail parent.
// - Consume already-published rail outputs, probe outputs, and production authority globals.
// - Compose the eight-way diagnostic bridge map:
//   rail.north, rail.east, rail.south, rail.west,
//   probe.north, probe.east, probe.south, probe.west.
// - Map file duties, authority boundaries, bridge readiness, and zone-of-infliction candidates.
// - Distinguish diagnostic-instrument incompleteness from production failure.
// - Recommend the next probe file while preserving the production suspect zone.
// Does not own:
// - diagnostic rail parent renewal
// - dynamic script loading
// - diagnostic UI
// - production mutation
// - Hearth repair
// - runtime restart
// - Canvas release
// - Macro West release
// - Lab runtime authority
// - route-conductor implementation
// - control-file implementation
// - canvas drawing
// - finger implementation
// - terrain/material/hydrology truth
// - motion/touch/drag execution
// - F13 claim
// - F21 claim
// - ready text
// - visual pass
// - generated image
// - GraphicBox
// - WebGL

(() => {
  "use strict";

  const CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_NORTH_FILE_COMPOSITION_ZONE_COORDINATOR_TNT_v1";
  const RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_NORTH_FILE_COMPOSITION_ZONE_COORDINATOR_RECEIPT_v1";

  const VERSION =
    "2026-06-05.hearth-diagnostic-probe-north-file-composition-zone-coordinator-v1";

  const FILE = "/assets/hearth/hearth.diagnostic.probe.north.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const RAIL_NORTH_FILE = "/assets/hearth/hearth.diagnostic.rail.js";
  const RAIL_EAST_FILE = "/assets/hearth/hearth.diagnostic.east.js";
  const RAIL_SOUTH_FILE = "/assets/hearth/hearth.diagnostic.south.js";
  const RAIL_WEST_FILE = "/assets/hearth/hearth.diagnostic.west.js";

  const PROBE_NORTH_FILE = FILE;
  const PROBE_EAST_FILE = "/assets/hearth/hearth.diagnostic.probe.east.js";
  const PROBE_SOUTH_FILE = "/assets/hearth/hearth.diagnostic.probe.south.js";
  const PROBE_WEST_FILE = "/assets/hearth/hearth.diagnostic.probe.west.js";

  const HTML_FILE = "/showroom/globe/hearth/index.html";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const LAB_NORTH_FILE = "/assets/lab/runtime-table.js";
  const LAB_EAST_FILE = "/assets/lab/runtime-table.east.js";
  const LAB_SOUTH_FILE = "/assets/lab/runtime-table.south.js";
  const LAB_WEST_FILE = "/assets/lab/runtime-table.west.js";

  const CURRENT_RAIL_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_EXPRESSION_WEST_STANDARD_ORCHESTRATOR_TNT_v8";
  const CURRENT_ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9";
  const CURRENT_INDEX_CONTRACT =
    "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";
  const CURRENT_CONTROL_CONTRACT =
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";
  const CURRENT_CANVAS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";

  const BRIDGE_MODE = "PROBE_CHILD_GLOBALS_READ_EXISTING_RAIL_AND_RUNTIME";
  const DYNAMIC_LOADING_OWNED = false;
  const PRODUCTION_MUTATION_AUTHORIZED = false;

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f21EligibleForNorth: false,
    f21ClaimedByProbe: false,
    f21ClaimedByDiagnosticRail: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    canvasReleaseAuthorized: false,
    macroWestReleaseAuthorized: false,
    runtimeRestartAuthorized: false,
    productionMutationAuthorized: false
  });

  const ZONES = Object.freeze({
    DIAGNOSTIC_RAIL_OPAQUE: "DIAGNOSTIC_RAIL_OPAQUE",
    PROBE_EAST_REQUIRED: "PROBE_EAST_REQUIRED",
    PROBE_WEST_REQUIRED: "PROBE_WEST_REQUIRED",
    PROBE_SOUTH_REQUIRED: "PROBE_SOUTH_REQUIRED",
    LAB_WEST_BRIDGE: "LAB_WEST_BRIDGE",
    ROUTE_CONDUCTOR_HANDOFF: "ROUTE_CONDUCTOR_HANDOFF",
    CONTROL_QUEEN_HANDSHAKE: "CONTROL_QUEEN_HANDSHAKE",
    CANVAS_PARENT_RECOGNITION: "CANVAS_PARENT_RECOGNITION",
    CANVAS_EXPRESSION_CARRIER: "CANVAS_EXPRESSION_CARRIER",
    FINGER_EXPRESSION_CHAIN: "FINGER_EXPRESSION_CHAIN",
    NO_ZONE_SELECTED: "NO_ZONE_SELECTED"
  });

  const FILE_DUTIES = Object.freeze({
    railNorth: {
      key: "rail.north",
      file: RAIL_NORTH_FILE,
      duty: "visible diagnostic parent, final diagnostic rail verdict, North adjudication",
      owns: "diagnostic verdict only",
      mayMutateProduction: false
    },
    railEast: {
      key: "rail.east",
      file: RAIL_EAST_FILE,
      duty: "served-source evidence, current spread recognition, CASE_5 lane",
      owns: "served-source diagnostic evidence only",
      mayMutateProduction: false
    },
    railSouth: {
      key: "rail.south",
      file: RAIL_SOUTH_FILE,
      duty: "packet output and meaning preservation",
      owns: "diagnostic packet formatting only",
      mayMutateProduction: false
    },
    railWest: {
      key: "rail.west",
      file: RAIL_WEST_FILE,
      duty: "rendered-target observation and Canvas-expression proof range",
      owns: "rendered diagnostic evidence only",
      mayMutateProduction: false
    },
    probeNorth: {
      key: "probe.north",
      file: PROBE_NORTH_FILE,
      duty: "file composition map, authority map, bridge map, zone-of-infliction coordinator",
      owns: "diagnostic probe coordination only",
      mayMutateProduction: false
    },
    probeEast: {
      key: "probe.east",
      file: PROBE_EAST_FILE,
      duty: "served-source under-hood path probe and source-side bridge proof",
      owns: "source-side probe evidence only",
      mayMutateProduction: false
    },
    probeSouth: {
      key: "probe.south",
      file: PROBE_SOUTH_FILE,
      duty: "report-output under-hood packet conformance and meaning-preservation probe",
      owns: "output-side probe evidence only",
      mayMutateProduction: false
    },
    probeWest: {
      key: "probe.west",
      file: PROBE_WEST_FILE,
      duty: "rendered-target under-hood runtime/canvas path probe",
      owns: "rendered-side probe evidence only",
      mayMutateProduction: false
    }
  });

  const PRODUCTION_DUTIES = Object.freeze({
    html: {
      key: "production.html",
      file: HTML_FILE,
      duty: "route shell and script inclusion surface",
      owns: "HTML shell only"
    },
    index: {
      key: "production.index",
      file: INDEX_FILE,
      duty: "front-end button authority and route handoff priest",
      owns: "button binding and route handoff only"
    },
    routeConductor: {
      key: "production.routeConductor",
      file: ROUTE_CONDUCTOR_FILE,
      duty: "route North Bishop recognition funnel, Queen admission, Canvas receiver release packet",
      owns: "route-conductor funnel only"
    },
    controls: {
      key: "production.controls",
      file: CONTROL_FILE,
      duty: "Queen view-input authority, touch, drag, motion handshake",
      owns: "input runtime only"
    },
    canvas: {
      key: "production.canvas",
      file: CANVAS_FILE,
      duty: "Canvas receiver/output carrier and visible expression surface",
      owns: "canvas reception/projection/paint only"
    },
    labNorth: {
      key: "production.labNorth",
      file: LAB_NORTH_FILE,
      duty: "lab North checkpoint/runtime table",
      owns: "lab checkpoint authority"
    },
    labEast: {
      key: "production.labEast",
      file: LAB_EAST_FILE,
      duty: "lab East ignition/source authority",
      owns: "lab East source authority"
    },
    labSouth: {
      key: "production.labSouth",
      file: LAB_SOUTH_FILE,
      duty: "lab South output/proof authority",
      owns: "lab South output authority"
    },
    labWest: {
      key: "production.labWest",
      file: LAB_WEST_FILE,
      duty: "lab West admissibility/release bridge",
      owns: "lab West admissibility truth"
    }
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  const api = {};

  let lastState = null;
  let lastReport = null;
  let lastReceipt = null;
  let lastPacketText = "";
  let lastCompactSummary = "";

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

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function safeBool(value, fallback = false) {
    if (value === true || value === 1 || value === "1") return true;
    if (value === false || value === 0 || value === "0") return false;

    const text = safeString(value).toLowerCase();
    if (text === "true" || text === "yes" || text === "ready" || text === "active") return true;
    if (text === "false" || text === "no" || text === "missing" || text === "unknown") return false;

    return fallback;
  }

  function clonePlain(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      if (isObject(value)) return Object.assign({}, value);
      return value;
    }
  }

  function bounded(value, limit = 8000) {
    return safeString(value)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, limit);
  }

  function packetValue(value, fallback = "UNKNOWN") {
    if (value === undefined || value === null || value === "") return fallback;

    if (Array.isArray(value)) {
      const joined = value.map((entry) => bounded(entry, 1200)).filter(Boolean).join(" | ");
      return joined || fallback;
    }

    if (isObject(value)) {
      try {
        return bounded(JSON.stringify(value), 20000) || fallback;
      } catch (_error) {
        return bounded(value, 4000) || fallback;
      }
    }

    return bounded(value, 4000) || fallback;
  }

  function line(key, value) {
    return `${key}=${packetValue(value)}`;
  }

  function readPath(path) {
    const parts = safeString(path).split(".");
    let cursor = root;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function firstGlobal(paths) {
    for (const path of paths) {
      const value = readPath(path);
      if (value) return { path, value };
    }

    return { path: "NONE", value: null };
  }

  function readField(source, keys, fallback = "") {
    const s = isObject(source) ? source : {};

    for (const key of keys) {
      if (s[key] !== undefined && s[key] !== null && s[key] !== "") return s[key];

      const lower = key.toLowerCase();
      for (const candidate of Object.keys(s)) {
        if (candidate.toLowerCase() === lower) {
          const value = s[candidate];
          if (value !== undefined && value !== null && value !== "") return value;
        }
      }
    }

    return fallback;
  }

  function firstNonEmpty(...values) {
    for (const value of values) {
      const text = safeString(value).trim();
      if (text) return text;
    }

    return "";
  }

  function unique(values) {
    const out = [];
    const seen = new Set();

    for (const value of values) {
      const clean = bounded(value, 1600);
      if (!clean || seen.has(clean)) continue;
      seen.add(clean);
      out.push(clean);
    }

    return out;
  }

  function normalizeNotes(...sources) {
    const notes = [];

    for (const source of sources) {
      if (!source) continue;

      if (Array.isArray(source)) {
        for (const item of source) notes.push(item);
        continue;
      }

      if (isObject(source)) {
        if (Array.isArray(source.notes)) notes.push(...source.notes);
        if (Array.isArray(source.secondaryEvidenceNotes)) notes.push(...source.secondaryEvidenceNotes);
        if (source.SECONDARY_EVIDENCE_NOTES) notes.push(...safeString(source.SECONDARY_EVIDENCE_NOTES).split("|"));
        if (source.NORTH_SECONDARY_EVIDENCE_NOTES) notes.push(...safeString(source.NORTH_SECONDARY_EVIDENCE_NOTES).split("|"));
        continue;
      }

      notes.push(...safeString(source).split("|"));
    }

    return unique(notes);
  }

  function getAuthorityReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getReport",
      "getState",
      "getStatus",
      "getNorthVerdict",
      "getEastReceipt",
      "getWestReceipt",
      "getSouthReceipt",
      "getProbeNorthReceipt",
      "getProbeReceipt",
      "getControlReceipt",
      "getControlHandshakeReceipt",
      "getRoutePrimaryGateReceipt",
      "getRouteCycleReceipt",
      "getCanvasStationSummary",
      "getCanvasStationReceipt",
      "getCanvasStationReceiptLight",
      "getExpressionHubSummary",
      "getExpressionHubReceipt",
      "getVisiblePlanetReceipt"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const output = authority[method]();
        if (isObject(output)) return output;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.report)) return authority.report;
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT) return authority;

    return null;
  }

  function makeState() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      bridgeMode: BRIDGE_MODE,
      dynamicLoadingOwned: DYNAMIC_LOADING_OWNED,
      productionMutationAuthorized: PRODUCTION_MUTATION_AUTHORIZED,

      timestamp: nowIso(),
      status: "PROBE_NORTH_READY",

      northRailReportObserved: false,
      northRailVerdictObserved: false,
      northRailSource: "NONE",

      eightWayBridgeReady: false,
      firstMissingProbeKey: "probe.east",
      firstMissingProbeFile: PROBE_EAST_FILE,
      bridgeCompletionStatus: "PROBE_EAST_REQUIRED",

      diagnosticInstrumentStatus: "UNDER_HOOD_PROBE_LAYER_INCOMPLETE",
      diagnosticRailOpaque: false,

      primaryZoneOfInfliction: ZONES.PROBE_EAST_REQUIRED,
      productionZoneCandidate: ZONES.NO_ZONE_SELECTED,
      productionZoneConfidence: "LOW",
      zoneReason: "PROBE_EAST_NOT_YET_OBSERVED",
      zoneCandidates: [],

      recommendedNextFile: PROBE_EAST_FILE,
      recommendedNextAction: "CRAFT_PROBE_EAST_TO_READ_SOURCE_SIDE_FILE_COMPOSITION_AND_BRIDGE_SURFACES",
      productionRecommendedNextFile: "HOLD_UNTIL_PROBE_PAIR_OR_BRIDGE_EVIDENCE_CONFIRMS",
      productionRecommendedNextAction: "DO_NOT_RENEW_PRODUCTION_FILE_FROM_PROBE_NORTH_ALONE",

      railObservations: {},
      probeObservations: {},
      productionObservations: {},
      bridgeMap: {},
      fileCompositionMap: {},
      authorityMap: {},
      northReportSnapshot: null,
      northVerdictSnapshot: null,

      notes: [],
      packetText: "",
      compactSummary: "",

      ...NO_CLAIMS
    };
  }

  function observeAuthority(label, paths, expectedContracts = []) {
    const found = firstGlobal(paths);
    const receipt = getAuthorityReceipt(found.value) || {};
    const contract = firstNonEmpty(
      readField(receipt, ["contract", "CONTRACT", `${label}Contract`]),
      found.value && found.value.contract,
      found.value && found.value.CONTRACT
    );
    const receiptName = firstNonEmpty(
      readField(receipt, ["receipt", "RECEIPT", `${label}Receipt`]),
      found.value && found.value.receipt,
      found.value && found.value.RECEIPT
    );

    const observed = Boolean(found.value || contract || receiptName);
    const contractAccepted = Boolean(
      !expectedContracts.length ||
      !contract ||
      expectedContracts.includes(contract) ||
      expectedContracts.some((item) => safeString(contract).includes(item))
    );

    return {
      label,
      observed,
      source: found.path,
      contract: contract || "UNKNOWN",
      receipt: receiptName || "UNKNOWN",
      contractAccepted,
      apiObserved: Boolean(found.value && isObject(found.value)),
      receiptObserved: Boolean(receipt && Object.keys(receipt).length),
      rawReceipt: clonePlain(receipt)
    };
  }

  function readNorthRailReport() {
    const reportPaths = [
      "HEARTH_DIAGNOSTIC_RAIL_REPORT",
      "HEARTH_PARALLEL_DIAGNOSTIC_RAIL_REPORT",
      "HEARTH_DIAGNOSTIC_NORTH_REPORT",
      "HEARTH_DIAGNOSTIC_NORTH_CANVAS_EXPRESSION_WEST_STANDARD_REPORT"
    ];

    for (const path of reportPaths) {
      const value = readPath(path);
      if (isObject(value)) return { source: path, report: value };
    }

    const apiPaths = [
      "HEARTH.diagnosticRail",
      "HEARTH.parallelDiagnosticRail",
      "HEARTH.diagnosticNorth",
      "HEARTH.diagnosticRailNorth",
      "HEARTH_DIAGNOSTIC_RAIL",
      "HEARTH_PARALLEL_DIAGNOSTIC_RAIL",
      "HEARTH_DIAGNOSTIC_NORTH",
      "DEXTER_LAB.hearthDiagnosticRail",
      "DEXTER_LAB.hearthDiagnosticNorth"
    ];

    for (const path of apiPaths) {
      const authority = readPath(path);
      if (!authority || !isObject(authority)) continue;

      try {
        if (isFunction(authority.getReport)) {
          const report = authority.getReport();
          if (isObject(report)) return { source: `${path}.getReport`, report };
        }
      } catch (_error) {}

      try {
        if (isFunction(authority.getReceipt)) {
          const receipt = authority.getReceipt();
          if (isObject(receipt) && isObject(receipt.reportObject)) {
            return { source: `${path}.getReceipt.reportObject`, report: receipt.reportObject };
          }
        }
      } catch (_error) {}
    }

    return { source: "NONE", report: null };
  }

  function readNorthVerdict() {
    const verdictPaths = [
      "HEARTH_DIAGNOSTIC_RAIL_VERDICT",
      "HEARTH_PARALLEL_DIAGNOSTIC_RAIL_VERDICT",
      "HEARTH_DIAGNOSTIC_NORTH_VERDICT",
      "HEARTH_DIAGNOSTIC_NORTH_CANVAS_EXPRESSION_WEST_STANDARD_VERDICT"
    ];

    for (const path of verdictPaths) {
      const value = readPath(path);
      if (isObject(value)) return { source: path, verdict: value };
    }

    const apiPaths = [
      "HEARTH.diagnosticRail",
      "HEARTH.parallelDiagnosticRail",
      "HEARTH.diagnosticNorth",
      "HEARTH.diagnosticRailNorth",
      "HEARTH_DIAGNOSTIC_RAIL",
      "HEARTH_PARALLEL_DIAGNOSTIC_RAIL",
      "HEARTH_DIAGNOSTIC_NORTH",
      "DEXTER_LAB.hearthDiagnosticRail",
      "DEXTER_LAB.hearthDiagnosticNorth"
    ];

    for (const path of apiPaths) {
      const authority = readPath(path);
      if (!authority || !isObject(authority)) continue;

      try {
        if (isFunction(authority.getNorthVerdict)) {
          const verdict = authority.getNorthVerdict();
          if (isObject(verdict)) return { source: `${path}.getNorthVerdict`, verdict };
        }
      } catch (_error) {}
    }

    return { source: "NONE", verdict: null };
  }

  function observeRailFiles() {
    return {
      railNorth: observeAuthority("railNorth", [
        "HEARTH.diagnosticRail",
        "HEARTH.parallelDiagnosticRail",
        "HEARTH.diagnosticNorth",
        "HEARTH.diagnosticRailNorth",
        "HEARTH_DIAGNOSTIC_RAIL",
        "HEARTH_PARALLEL_DIAGNOSTIC_RAIL",
        "HEARTH_DIAGNOSTIC_NORTH",
        "DEXTER_LAB.hearthDiagnosticRail",
        "DEXTER_LAB.hearthDiagnosticNorth"
      ], [CURRENT_RAIL_NORTH_CONTRACT]),

      railEast: observeAuthority("railEast", [
        "HEARTH.diagnosticEast",
        "HEARTH.diagnosticRailEast",
        "HEARTH_DIAGNOSTIC_EAST",
        "HEARTH_DIAGNOSTIC_RAIL_EAST",
        "DEXTER_LAB.hearthDiagnosticEast",
        "DEXTER_LAB.hearthDiagnosticRailEast"
      ], ["HEARTH_DIAGNOSTIC_EAST"]),

      railSouth: observeAuthority("railSouth", [
        "HEARTH.diagnosticSouth",
        "HEARTH.diagnosticRailSouth",
        "HEARTH_DIAGNOSTIC_SOUTH",
        "HEARTH_DIAGNOSTIC_RAIL_SOUTH",
        "DEXTER_LAB.hearthDiagnosticSouth",
        "DEXTER_LAB.hearthDiagnosticRailSouth"
      ], ["HEARTH_DIAGNOSTIC_SOUTH"]),

      railWest: observeAuthority("railWest", [
        "HEARTH.diagnosticWest",
        "HEARTH.diagnosticRailWest",
        "HEARTH_DIAGNOSTIC_WEST",
        "HEARTH_DIAGNOSTIC_RAIL_WEST",
        "DEXTER_LAB.hearthDiagnosticWest",
        "DEXTER_LAB.hearthDiagnosticRailWest"
      ], ["HEARTH_DIAGNOSTIC_WEST"])
    };
  }

  function observeProbeFiles() {
    return {
      probeNorth: observeAuthority("probeNorth", [
        "HEARTH.diagnosticProbeNorth",
        "HEARTH.diagnosticRailProbeNorth",
        "HEARTH_DIAGNOSTIC_PROBE_NORTH",
        "HEARTH_DIAGNOSTIC_RAIL_PROBE_NORTH",
        "DEXTER_LAB.hearthDiagnosticProbeNorth"
      ], [CONTRACT]),

      probeEast: observeAuthority("probeEast", [
        "HEARTH.diagnosticProbeEast",
        "HEARTH.diagnosticRailProbeEast",
        "HEARTH_DIAGNOSTIC_PROBE_EAST",
        "HEARTH_DIAGNOSTIC_RAIL_PROBE_EAST",
        "DEXTER_LAB.hearthDiagnosticProbeEast"
      ], ["HEARTH_DIAGNOSTIC_PROBE_EAST"]),

      probeSouth: observeAuthority("probeSouth", [
        "HEARTH.diagnosticProbeSouth",
        "HEARTH.diagnosticRailProbeSouth",
        "HEARTH_DIAGNOSTIC_PROBE_SOUTH",
        "HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH",
        "DEXTER_LAB.hearthDiagnosticProbeSouth"
      ], ["HEARTH_DIAGNOSTIC_PROBE_SOUTH"]),

      probeWest: observeAuthority("probeWest", [
        "HEARTH.diagnosticProbeWest",
        "HEARTH.diagnosticRailProbeWest",
        "HEARTH_DIAGNOSTIC_PROBE_WEST",
        "HEARTH_DIAGNOSTIC_RAIL_PROBE_WEST",
        "DEXTER_LAB.hearthDiagnosticProbeWest"
      ], ["HEARTH_DIAGNOSTIC_PROBE_WEST"])
    };
  }

  function observeProductionFiles() {
    return {
      index: observeAuthority("index", [
        "HEARTH_INDEX_JS",
        "HEARTH_INDEX_BRIDGE",
        "HEARTH.indexJs",
        "HEARTH.indexBridge",
        "HEARTH.frontendButtonAuthorityReset",
        "DEXTER_LAB.hearthIndexJs",
        "DEXTER_LAB.hearthIndexBridge"
      ], [CURRENT_INDEX_CONTRACT]),

      routeConductor: observeAuthority("routeConductor", [
        "HEARTH_ROUTE_CONDUCTOR",
        "HEARTH_ROUTE_NORTH_BISHOP",
        "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL",
        "HEARTH.routeConductor",
        "HEARTH.routeNorthBishop",
        "HEARTH.routeConductorBishopQueenCanvasRecognitionFunnel",
        "DEXTER_LAB.hearthRouteConductor",
        "DEXTER_LAB.hearthRouteNorthBishop"
      ], [CURRENT_ROUTE_CONDUCTOR_CONTRACT]),

      controls: observeAuthority("controls", [
        "HEARTH_CONTROLS_QUEEN",
        "HEARTH_QUEEN_CONTROLS",
        "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE",
        "HEARTH_CONTROLS",
        "HEARTH.controlsQueen",
        "HEARTH.queenControls",
        "HEARTH.controls",
        "HEARTH.planetaryControls",
        "DEXTER_LAB.hearthQueenControls",
        "DEXTER_LAB.hearthControls"
      ], [CURRENT_CONTROL_CONTRACT]),

      canvas: observeAuthority("canvas", [
        "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
        "HEARTH_CANVAS_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
        "HEARTH_CANVAS_HUB",
        "HEARTH_CANVAS",
        "HEARTH_CANVAS_EXPRESSION_HUB",
        "HEARTH_CANVAS_LOCAL_STATION",
        "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
        "HEARTH.canvasCompositeFirstFastViewDeferredHexReceiver",
        "HEARTH.canvasHub",
        "HEARTH.canvas",
        "HEARTH.canvasExpressionHub",
        "HEARTH.canvasLocalStation",
        "DEXTER_LAB.hearthCanvasHub",
        "DEXTER_LAB.hearthCanvas",
        "DEXTER_LAB.hearthCanvasExpressionHub"
      ], [CURRENT_CANVAS_CONTRACT, "HEARTH_CANVAS"]),

      labNorth: observeAuthority("labNorth", [
        "LAB_RUNTIME_TABLE_NORTH",
        "LAB_RUNTIME_TABLE",
        "HEARTH_NORTH_COMMAND_RUNTIME_TABLE",
        "HEARTH.northCentralTrainStation",
        "HEARTH.northCommandRuntimeTable",
        "DEXTER_LAB.runtimeTable",
        "DEXTER_LAB.cardinalRuntimeTableNorth"
      ], ["LAB_RUNTIME_TABLE"]),

      labWest: observeAuthority("labWest", [
        "LAB_RUNTIME_TABLE_WEST",
        "RUNTIME_TABLE_WEST",
        "LAB_CYCLE_AWARE_ADMISSIBILITY_CLUTCH_WEST",
        "HEARTH_WEST_CYCLE_AWARE_ADMISSIBILITY_CLUTCH",
        "HEARTH_RUNTIME_TABLE_WEST",
        "HEARTH_WEST_ADMISSIBILITY",
        "HEARTH.runtimeTableWest",
        "HEARTH.westRuntimeTable",
        "HEARTH.westAdmissibility",
        "DEXTER_LAB.runtimeTableWest",
        "DEXTER_LAB.cardinalRuntimeTableWest",
        "DEXTER_LAB.hearthRuntimeTableWest",
        "DEXTER_LAB.westAdmissibility"
      ], ["LAB_RUNTIME_TABLE", "WEST"])
    };
  }

  function buildFileCompositionMap(rail, probe, production) {
    return {
      eightWayDiagnosticBridge: {
        railNorth: { ...FILE_DUTIES.railNorth, observed: rail.railNorth.observed, contract: rail.railNorth.contract },
        railEast: { ...FILE_DUTIES.railEast, observed: rail.railEast.observed, contract: rail.railEast.contract },
        railSouth: { ...FILE_DUTIES.railSouth, observed: rail.railSouth.observed, contract: rail.railSouth.contract },
        railWest: { ...FILE_DUTIES.railWest, observed: rail.railWest.observed, contract: rail.railWest.contract },
        probeNorth: { ...FILE_DUTIES.probeNorth, observed: true, contract: CONTRACT },
        probeEast: { ...FILE_DUTIES.probeEast, observed: probe.probeEast.observed, contract: probe.probeEast.contract },
        probeSouth: { ...FILE_DUTIES.probeSouth, observed: probe.probeSouth.observed, contract: probe.probeSouth.contract },
        probeWest: { ...FILE_DUTIES.probeWest, observed: probe.probeWest.observed, contract: probe.probeWest.contract }
      },
      productionBridge: {
        index: { ...PRODUCTION_DUTIES.index, observed: production.index.observed, contract: production.index.contract },
        routeConductor: { ...PRODUCTION_DUTIES.routeConductor, observed: production.routeConductor.observed, contract: production.routeConductor.contract },
        controls: { ...PRODUCTION_DUTIES.controls, observed: production.controls.observed, contract: production.controls.contract },
        canvas: { ...PRODUCTION_DUTIES.canvas, observed: production.canvas.observed, contract: production.canvas.contract },
        labNorth: { ...PRODUCTION_DUTIES.labNorth, observed: production.labNorth.observed, contract: production.labNorth.contract },
        labWest: { ...PRODUCTION_DUTIES.labWest, observed: production.labWest.observed, contract: production.labWest.contract }
      }
    };
  }

  function buildAuthorityMap(rail, probe, production, report) {
    return {
      diagnosticAuthorities: {
        northRailOwnsFinalDiagnosticVerdict: true,
        probeNorthOwnsFileCompositionZoneCoordination: true,
        railEastOwnsServedSourceEvidence: rail.railEast.observed,
        railWestOwnsRenderedTargetEvidence: rail.railWest.observed,
        railSouthOwnsPacketOutput: rail.railSouth.observed,
        probeEastOwnsSourceSideUnderHoodProbe: probe.probeEast.observed,
        probeWestOwnsRenderedSideUnderHoodProbe: probe.probeWest.observed,
        probeSouthOwnsOutputSideUnderHoodProbe: probe.probeSouth.observed
      },
      productionAuthorities: {
        indexOwnsButtonBindingOnly: production.index.observed,
        routeConductorOwnsControlAdmissionAndHandoff: production.routeConductor.observed,
        controlsOwnInputRuntime: production.controls.observed,
        canvasOwnsReceiverOutputCarrier: production.canvas.observed,
        labWestOwnsAdmissibilityTruth: production.labWest.observed,
        labNorthOwnsF21OrFinalLatch: production.labNorth.observed
      },
      prohibitedAuthorities: {
        probeNorthMayMutateProduction: false,
        probeNorthMayRestartRuntime: false,
        probeNorthMayReleaseCanvas: false,
        probeNorthMayClaimVisualPass: false,
        probeNorthMayClaimF13: false,
        probeNorthMayClaimF21: false
      },
      northReportAuthoritySnapshot: {
        primaryCase: readField(report, ["PRIMARY_CASE", "primaryCase"], "UNKNOWN"),
        calibrationStatus: readField(report, ["CALIBRATION_STATUS", "calibrationStatus"], "UNKNOWN"),
        recommendedNextFile: readField(report, ["RECOMMENDED_NEXT_FILE", "recommendedNextFile"], "UNKNOWN"),
        recommendedNextOwner: readField(report, ["RECOMMENDED_NEXT_OWNER", "recommendedNextOwner"], "UNKNOWN")
      }
    };
  }

  function hasValue(value) {
    const text = safeString(value).trim();
    return Boolean(text && text !== "UNKNOWN" && text !== "NONE" && text !== "NOT_FOUND");
  }

  function textIncludes(source, needle) {
    return safeString(source).toUpperCase().includes(safeString(needle).toUpperCase());
  }

  function getReportText(report) {
    if (!isObject(report)) return "";
    try {
      return JSON.stringify(report);
    } catch (_error) {
      return safeString(report);
    }
  }

  function selectProductionZone(report, rail, production) {
    const text = getReportText(report);
    const candidates = [];

    const currentCanvasParentContract = readField(report, [
      "CURRENT_CANVAS_PARENT_CONTRACT",
      "currentCanvasParentContract"
    ], "UNKNOWN");

    const currentCanvasParentRecognized = readField(report, [
      "CURRENT_CANVAS_PARENT_RECOGNIZED",
      "currentCanvasParentRecognized"
    ], "UNKNOWN");

    const canvasLocalStationObserved = readField(report, [
      "CANVAS_LOCAL_STATION_OBSERVED",
      "canvasLocalStationObserved"
    ], "UNKNOWN");

    const macroWestObserved = readField(report, [
      "MACRO_WEST_OBSERVED",
      "macroWestObserved"
    ], "UNKNOWN");

    const controlHandshakeStatus = readField(report, [
      "CONTROL_HANDSHAKE_STATUS",
      "QUEEN_HANDSHAKE_STATUS",
      "controlHandshakeStatus"
    ], "UNKNOWN");

    const canvasExpressionProofStatus = readField(report, [
      "CANVAS_EXPRESSION_PROOF_STATUS",
      "canvasExpressionProofStatus"
    ], "UNKNOWN");

    const canvasExpressionBottleneckClass = readField(report, [
      "CANVAS_EXPRESSION_BOTTLENECK_CLASS",
      "canvasExpressionBottleneckClass"
    ], "UNKNOWN");

    const canvasFingerExpressionStatus = readField(report, [
      "CANVAS_FINGER_EXPRESSION_STATUS",
      "canvasFingerExpressionStatus"
    ], "UNKNOWN");

    const fourWayCanvasHandoffStatus = readField(report, [
      "FOUR_WAY_CANVAS_HANDOFF_STATUS",
      "fourWayCanvasHandoffStatus"
    ], "UNKNOWN");

    const runtimeReleaseState = readField(report, [
      "RUNTIME_RELEASE_STATE",
      "runtimeReleaseState"
    ], "UNKNOWN");

    if (
      safeBool(macroWestObserved, false) === false &&
      !production.labWest.observed &&
      textIncludes(text, "MACRO_WEST")
    ) {
      candidates.push({
        zone: ZONES.LAB_WEST_BRIDGE,
        confidence: "MEDIUM",
        reason: "MACRO_WEST_BRIDGE_NOT_OBSERVED_OR_OPAQUE"
      });
    }

    if (
      currentCanvasParentRecognized === "false" ||
      currentCanvasParentContract === "UNKNOWN" ||
      safeBool(canvasLocalStationObserved, false) === false ||
      !production.canvas.observed
    ) {
      candidates.push({
        zone: ZONES.CANVAS_PARENT_RECOGNITION,
        confidence: "HIGH",
        reason: "CURRENT_CANVAS_PARENT_NOT_RECOGNIZED_OR_CANVAS_LOCAL_STATION_NOT_OBSERVED"
      });
    }

    if (
      textIncludes(canvasExpressionProofStatus, "HANDSHAKE_PENDING") ||
      textIncludes(canvasExpressionProofStatus, "ACTIVE_DEGRADED") ||
      textIncludes(canvasExpressionBottleneckClass, "STAGE_AND_MOUNT_PRESENT_EXPRESSION_SURFACE_NOT_PROVEN") ||
      textIncludes(text, "CANVAS_EXPRESSION_BOTTLENECK")
    ) {
      candidates.push({
        zone: ZONES.CANVAS_EXPRESSION_CARRIER,
        confidence: "HIGH",
        reason: `CANVAS_EXPRESSION_PROOF_STATUS=${canvasExpressionProofStatus};BOTTLENECK=${canvasExpressionBottleneckClass}`
      });
    }

    if (
      textIncludes(canvasFingerExpressionStatus, "EXPECTED_NOT_YET_WIRED") ||
      textIncludes(text, "CANVAS_FINGER_EXPRESSION_PROOF_NOT_YET_WIRED") ||
      textIncludes(text, "FINGER_EXPRESSION")
    ) {
      candidates.push({
        zone: ZONES.FINGER_EXPRESSION_CHAIN,
        confidence: "MEDIUM",
        reason: `CANVAS_FINGER_EXPRESSION_STATUS=${canvasFingerExpressionStatus}`
      });
    }

    if (
      textIncludes(fourWayCanvasHandoffStatus, "HANDSHAKE_PENDING") ||
      textIncludes(runtimeReleaseState, "WAITING_CARDINAL_WEST_BISHOP_AUTHORITY") ||
      textIncludes(runtimeReleaseState, "WAITING_CANVAS_RECEIVER_BISHOP")
    ) {
      candidates.push({
        zone: ZONES.ROUTE_CONDUCTOR_HANDOFF,
        confidence: "MEDIUM",
        reason: `FOUR_WAY_CANVAS_HANDOFF_STATUS=${fourWayCanvasHandoffStatus};RUNTIME_RELEASE_STATE=${runtimeReleaseState}`
      });
    }

    if (
      textIncludes(controlHandshakeStatus, "WAITING") ||
      textIncludes(controlHandshakeStatus, "PENDING") ||
      (!production.controls.observed && textIncludes(text, "CONTROL"))
    ) {
      candidates.push({
        zone: ZONES.CONTROL_QUEEN_HANDSHAKE,
        confidence: "LOW",
        reason: `CONTROL_HANDSHAKE_STATUS=${controlHandshakeStatus}`
      });
    }

    if (!candidates.length && rail.railNorth.observed && !isObject(report)) {
      candidates.push({
        zone: ZONES.DIAGNOSTIC_RAIL_OPAQUE,
        confidence: "HIGH",
        reason: "NORTH_RAIL_PRESENT_BUT_REPORT_NOT_READABLE"
      });
    }

    const priority = [
      ZONES.DIAGNOSTIC_RAIL_OPAQUE,
      ZONES.CANVAS_PARENT_RECOGNITION,
      ZONES.CANVAS_EXPRESSION_CARRIER,
      ZONES.FINGER_EXPRESSION_CHAIN,
      ZONES.ROUTE_CONDUCTOR_HANDOFF,
      ZONES.LAB_WEST_BRIDGE,
      ZONES.CONTROL_QUEEN_HANDSHAKE
    ];

    const selected = priority
      .map((zone) => candidates.find((candidate) => candidate.zone === zone))
      .find(Boolean) || {
        zone: ZONES.NO_ZONE_SELECTED,
        confidence: "LOW",
        reason: "NO_PRODUCTION_ZONE_CONFIRMED_FROM_AVAILABLE_PROBE_NORTH_EVIDENCE"
      };

    return {
      selected,
      candidates
    };
  }

  function selectDiagnosticBridgeZone(probe) {
    if (!probe.probeEast.observed) {
      return {
        zone: ZONES.PROBE_EAST_REQUIRED,
        nextFile: PROBE_EAST_FILE,
        nextAction: "CRAFT_PROBE_EAST_TO_READ_SOURCE_SIDE_FILE_COMPOSITION_AND_BRIDGE_SURFACES",
        reason: "PROBE_EAST_NOT_YET_OBSERVED"
      };
    }

    if (!probe.probeWest.observed) {
      return {
        zone: ZONES.PROBE_WEST_REQUIRED,
        nextFile: PROBE_WEST_FILE,
        nextAction: "CRAFT_PROBE_WEST_TO_READ_RENDERED_RUNTIME_CANVAS_AND_BRIDGE_SURFACES",
        reason: "PROBE_WEST_NOT_YET_OBSERVED"
      };
    }

    if (!probe.probeSouth.observed) {
      return {
        zone: ZONES.PROBE_SOUTH_REQUIRED,
        nextFile: PROBE_SOUTH_FILE,
        nextAction: "CRAFT_PROBE_SOUTH_TO_RECONCILE_PROBE_OUTPUT_WITH_NORTH_ZONE_COORDINATION",
        reason: "PROBE_SOUTH_NOT_YET_OBSERVED"
      };
    }

    return {
      zone: ZONES.NO_ZONE_SELECTED,
      nextFile: "NONE",
      nextAction: "EIGHT_WAY_PROBE_BRIDGE_PRESENT_OBSERVE_PRODUCTION_ZONE_CANDIDATE",
      reason: "ALL_PROBE_FILES_OBSERVED"
    };
  }

  function buildBridgeMap(rail, probe, production, report) {
    const railReady =
      rail.railNorth.observed &&
      rail.railEast.observed &&
      rail.railSouth.observed &&
      rail.railWest.observed;

    const probeReady =
      true &&
      probe.probeEast.observed &&
      probe.probeSouth.observed &&
      probe.probeWest.observed;

    return {
      mode: BRIDGE_MODE,
      dynamicLoadingOwned: false,
      productionMutationAuthorized: false,
      railBridge: {
        north: rail.railNorth.observed,
        east: rail.railEast.observed,
        south: rail.railSouth.observed,
        west: rail.railWest.observed,
        ready: railReady
      },
      probeBridge: {
        north: true,
        east: probe.probeEast.observed,
        south: probe.probeSouth.observed,
        west: probe.probeWest.observed,
        ready: probeReady
      },
      productionBridge: {
        index: production.index.observed,
        routeConductor: production.routeConductor.observed,
        controls: production.controls.observed,
        canvas: production.canvas.observed,
        labNorth: production.labNorth.observed,
        labWest: production.labWest.observed
      },
      reportBridge: {
        northRailReportObserved: isObject(report),
        primaryCase: readField(report, ["PRIMARY_CASE", "primaryCase"], "UNKNOWN"),
        calibrationStatus: readField(report, ["CALIBRATION_STATUS", "calibrationStatus"], "UNKNOWN"),
        canvasExpressionProofStatus: readField(report, ["CANVAS_EXPRESSION_PROOF_STATUS", "canvasExpressionProofStatus"], "UNKNOWN"),
        currentCanvasParentContract: readField(report, ["CURRENT_CANVAS_PARENT_CONTRACT", "currentCanvasParentContract"], "UNKNOWN")
      },
      eightWayBridgeReady: railReady && probeReady
    };
  }

  function composeReport(state) {
    return {
      PACKET_NAME: "HEARTH_DIAGNOSTIC_PROBE_NORTH_FILE_COMPOSITION_ZONE_PACKET_v1",
      CONTRACT,
      RECEIPT,
      VERSION,
      FILE,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,

      BRIDGE_MODE,
      DYNAMIC_LOADING_OWNED,
      PRODUCTION_MUTATION_AUTHORIZED,

      RAIL_NORTH_FILE,
      RAIL_EAST_FILE,
      RAIL_SOUTH_FILE,
      RAIL_WEST_FILE,
      PROBE_NORTH_FILE,
      PROBE_EAST_FILE,
      PROBE_SOUTH_FILE,
      PROBE_WEST_FILE,

      NORTH_RAIL_REPORT_OBSERVED: state.northRailReportObserved,
      NORTH_RAIL_VERDICT_OBSERVED: state.northRailVerdictObserved,
      NORTH_RAIL_SOURCE: state.northRailSource,

      EIGHT_WAY_BRIDGE_READY: state.eightWayBridgeReady,
      FIRST_MISSING_PROBE_KEY: state.firstMissingProbeKey,
      FIRST_MISSING_PROBE_FILE: state.firstMissingProbeFile,
      BRIDGE_COMPLETION_STATUS: state.bridgeCompletionStatus,

      DIAGNOSTIC_INSTRUMENT_STATUS: state.diagnosticInstrumentStatus,
      DIAGNOSTIC_RAIL_OPAQUE: state.diagnosticRailOpaque,

      PRIMARY_ZONE_OF_INFLICTION: state.primaryZoneOfInfliction,
      PRODUCTION_ZONE_CANDIDATE: state.productionZoneCandidate,
      PRODUCTION_ZONE_CONFIDENCE: state.productionZoneConfidence,
      ZONE_REASON: state.zoneReason,
      ZONE_CANDIDATES: clonePlain(state.zoneCandidates),

      RECOMMENDED_NEXT_FILE: state.recommendedNextFile,
      RECOMMENDED_NEXT_ACTION: state.recommendedNextAction,
      PRODUCTION_RECOMMENDED_NEXT_FILE: state.productionRecommendedNextFile,
      PRODUCTION_RECOMMENDED_NEXT_ACTION: state.productionRecommendedNextAction,

      FILE_COMPOSITION_MAP: clonePlain(state.fileCompositionMap),
      AUTHORITY_MAP: clonePlain(state.authorityMap),
      BRIDGE_MAP: clonePlain(state.bridgeMap),

      RAIL_OBSERVATIONS: clonePlain(state.railObservations),
      PROBE_OBSERVATIONS: clonePlain(state.probeObservations),
      PRODUCTION_OBSERVATIONS: clonePlain(state.productionObservations),

      NORTH_REPORT_SNAPSHOT: clonePlain(state.northReportSnapshot),
      NORTH_VERDICT_SNAPSHOT: clonePlain(state.northVerdictSnapshot),

      NOTES: state.notes.slice(),

      ...NO_CLAIMS
    };
  }

  function composePacketText(report) {
    const fields = [
      "PACKET_NAME",
      "CONTRACT",
      "RECEIPT",
      "VERSION",
      "FILE",
      "TARGET_ROUTE",
      "DIAGNOSTIC_ROUTE",
      "BRIDGE_MODE",
      "DYNAMIC_LOADING_OWNED",
      "PRODUCTION_MUTATION_AUTHORIZED",
      "RAIL_NORTH_FILE",
      "RAIL_EAST_FILE",
      "RAIL_SOUTH_FILE",
      "RAIL_WEST_FILE",
      "PROBE_NORTH_FILE",
      "PROBE_EAST_FILE",
      "PROBE_SOUTH_FILE",
      "PROBE_WEST_FILE",
      "NORTH_RAIL_REPORT_OBSERVED",
      "NORTH_RAIL_VERDICT_OBSERVED",
      "NORTH_RAIL_SOURCE",
      "EIGHT_WAY_BRIDGE_READY",
      "FIRST_MISSING_PROBE_KEY",
      "FIRST_MISSING_PROBE_FILE",
      "BRIDGE_COMPLETION_STATUS",
      "DIAGNOSTIC_INSTRUMENT_STATUS",
      "DIAGNOSTIC_RAIL_OPAQUE",
      "PRIMARY_ZONE_OF_INFLICTION",
      "PRODUCTION_ZONE_CANDIDATE",
      "PRODUCTION_ZONE_CONFIDENCE",
      "ZONE_REASON",
      "ZONE_CANDIDATES",
      "RECOMMENDED_NEXT_FILE",
      "RECOMMENDED_NEXT_ACTION",
      "PRODUCTION_RECOMMENDED_NEXT_FILE",
      "PRODUCTION_RECOMMENDED_NEXT_ACTION",
      "NOTES",
      "f13Claimed",
      "f21EligibleForNorth",
      "f21ClaimedByProbe",
      "readyTextAllowed",
      "readyTextClaimed",
      "visualPassClaimed",
      "generatedImage",
      "graphicBox",
      "webGL"
    ];

    return fields.map((field) => line(field, report[field])).join("\n");
  }

  function composeCompactSummary(report) {
    return [
      line("CONTRACT", report.CONTRACT),
      line("EIGHT_WAY_BRIDGE_READY", report.EIGHT_WAY_BRIDGE_READY),
      line("BRIDGE_COMPLETION_STATUS", report.BRIDGE_COMPLETION_STATUS),
      line("PRIMARY_ZONE_OF_INFLICTION", report.PRIMARY_ZONE_OF_INFLICTION),
      line("PRODUCTION_ZONE_CANDIDATE", report.PRODUCTION_ZONE_CANDIDATE),
      line("PRODUCTION_ZONE_CONFIDENCE", report.PRODUCTION_ZONE_CONFIDENCE),
      line("ZONE_REASON", report.ZONE_REASON),
      line("RECOMMENDED_NEXT_FILE", report.RECOMMENDED_NEXT_FILE),
      line("RECOMMENDED_NEXT_ACTION", report.RECOMMENDED_NEXT_ACTION),
      line("PRODUCTION_RECOMMENDED_NEXT_FILE", report.PRODUCTION_RECOMMENDED_NEXT_FILE),
      line("PRODUCTION_RECOMMENDED_NEXT_ACTION", report.PRODUCTION_RECOMMENDED_NEXT_ACTION)
    ].join("\n");
  }

  function runProbeNorth(input = {}, options = {}) {
    const state = makeState();

    const rail = observeRailFiles();
    const probe = observeProbeFiles();
    const production = observeProductionFiles();

    const suppliedReport = isObject(input.report) ? input.report : null;
    const suppliedVerdict = isObject(input.verdict) ? input.verdict : null;

    const northReport = suppliedReport ? { source: "SUPPLIED_REPORT", report: suppliedReport } : readNorthRailReport();
    const northVerdict = suppliedVerdict ? { source: "SUPPLIED_VERDICT", verdict: suppliedVerdict } : readNorthVerdict();

    state.railObservations = rail;
    state.probeObservations = probe;
    state.productionObservations = production;

    state.northRailReportObserved = isObject(northReport.report);
    state.northRailVerdictObserved = isObject(northVerdict.verdict);
    state.northRailSource = northReport.source !== "NONE" ? northReport.source : northVerdict.source;

    state.northReportSnapshot = clonePlain(northReport.report || {});
    state.northVerdictSnapshot = clonePlain(northVerdict.verdict || {});

    state.fileCompositionMap = buildFileCompositionMap(rail, probe, production);
    state.authorityMap = buildAuthorityMap(rail, probe, production, northReport.report || {});
    state.bridgeMap = buildBridgeMap(rail, probe, production, northReport.report || {});

    const diagnosticBridge = selectDiagnosticBridgeZone(probe);
    const productionZone = selectProductionZone(northReport.report || {}, rail, production);

    state.eightWayBridgeReady = state.bridgeMap.eightWayBridgeReady === true;
    state.primaryZoneOfInfliction = diagnosticBridge.zone !== ZONES.NO_ZONE_SELECTED
      ? diagnosticBridge.zone
      : productionZone.selected.zone;

    state.productionZoneCandidate = productionZone.selected.zone;
    state.productionZoneConfidence = productionZone.selected.confidence;
    state.zoneReason = diagnosticBridge.zone !== ZONES.NO_ZONE_SELECTED
      ? diagnosticBridge.reason
      : productionZone.selected.reason;
    state.zoneCandidates = productionZone.candidates;

    state.bridgeCompletionStatus = diagnosticBridge.zone;
    state.firstMissingProbeKey =
      diagnosticBridge.zone === ZONES.PROBE_EAST_REQUIRED ? "probe.east" :
      diagnosticBridge.zone === ZONES.PROBE_WEST_REQUIRED ? "probe.west" :
      diagnosticBridge.zone === ZONES.PROBE_SOUTH_REQUIRED ? "probe.south" :
      "NONE";
    state.firstMissingProbeFile = diagnosticBridge.nextFile;

    state.recommendedNextFile = diagnosticBridge.nextFile;
    state.recommendedNextAction = diagnosticBridge.nextAction;

    if (productionZone.selected.zone === ZONES.CANVAS_PARENT_RECOGNITION) {
      state.productionRecommendedNextFile = CANVAS_FILE;
      state.productionRecommendedNextAction =
        "REVIEW_CANVAS_PARENT_RECOGNITION_AND_CANVAS_LOCAL_STATION_PUBLICATION_AFTER_PROBE_EAST_PROBE_WEST_CONFIRMATION";
    } else if (productionZone.selected.zone === ZONES.CANVAS_EXPRESSION_CARRIER) {
      state.productionRecommendedNextFile = CANVAS_FILE;
      state.productionRecommendedNextAction =
        "REVIEW_CANVAS_EXPRESSION_SURFACE_AND_HANDSHAKE_CARRIER_AFTER_PROBE_EAST_PROBE_WEST_CONFIRMATION";
    } else if (productionZone.selected.zone === ZONES.FINGER_EXPRESSION_CHAIN) {
      state.productionRecommendedNextFile = CANVAS_FILE;
      state.productionRecommendedNextAction =
        "REVIEW_CANVAS_FINGER_EXPRESSION_CHAIN_AFTER_PROBE_WEST_CONFIRMS_WIRING_GAP";
    } else if (productionZone.selected.zone === ZONES.LAB_WEST_BRIDGE) {
      state.productionRecommendedNextFile = LAB_WEST_FILE;
      state.productionRecommendedNextAction =
        "REVIEW_LAB_WEST_BRIDGE_ONLY_AFTER_PROBE_WEST_CONFIRMS_ADMISSIBILITY_VISIBILITY_GAP";
    } else if (productionZone.selected.zone === ZONES.ROUTE_CONDUCTOR_HANDOFF) {
      state.productionRecommendedNextFile = ROUTE_CONDUCTOR_FILE;
      state.productionRecommendedNextAction =
        "REVIEW_ROUTE_CONDUCTOR_HANDOFF_ONLY_AFTER_PROBE_EAST_AND_PROBE_WEST_CONFIRM_HANDOFF_GAP";
    } else if (productionZone.selected.zone === ZONES.CONTROL_QUEEN_HANDSHAKE) {
      state.productionRecommendedNextFile = CONTROL_FILE;
      state.productionRecommendedNextAction =
        "REVIEW_CONTROL_QUEEN_HANDSHAKE_ONLY_AFTER_PROBE_EAST_AND_PROBE_WEST_CONFIRM_INPUT_GAP";
    } else {
      state.productionRecommendedNextFile = "HOLD_UNTIL_PROBE_PAIR_OR_BRIDGE_EVIDENCE_CONFIRMS";
      state.productionRecommendedNextAction = "DO_NOT_RENEW_PRODUCTION_FILE_FROM_PROBE_NORTH_ALONE";
    }

    state.diagnosticRailOpaque = Boolean(!state.northRailReportObserved && rail.railNorth.observed);
    state.diagnosticInstrumentStatus = state.eightWayBridgeReady
      ? "EIGHT_WAY_PROBE_BRIDGE_PRESENT"
      : "UNDER_HOOD_PROBE_LAYER_INCOMPLETE";

    state.notes = normalizeNotes(
      state.northReportSnapshot,
      state.northVerdictSnapshot,
      [
        "PROBE_NORTH_FILE_COMPOSITION_MAP_ACTIVE",
        "PROBE_NORTH_ZONE_COORDINATOR_ACTIVE",
        "PROBE_NORTH_DOES_NOT_MUTATE_PRODUCTION",
        "PROBE_NORTH_DOES_NOT_RENEW_ORIGIN_DIAGNOSTIC_RAIL",
        `PROBE_NORTH_SELECTED_DIAGNOSTIC_ZONE:${state.primaryZoneOfInfliction}`,
        `PROBE_NORTH_SELECTED_PRODUCTION_ZONE:${state.productionZoneCandidate}`,
        `PROBE_NORTH_NEXT_FILE:${state.recommendedNextFile}`
      ],
      options.notes || []
    );

    const report = composeReport(state);
    state.packetText = composePacketText(report);
    state.compactSummary = composeCompactSummary(report);
    state.status = "PROBE_NORTH_COMPLETE";

    publish(state, report);
    return {
      ok: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      report: clonePlain(lastReport),
      receiptObject: clonePlain(lastReceipt),
      packetText: lastPacketText,
      compactSummary: lastCompactSummary,
      state: clonePlain(lastState)
    };
  }

  function publish(state, report) {
    lastState = clonePlain(state);
    lastReport = clonePlain(report || composeReport(state));
    lastPacketText = state.packetText || composePacketText(lastReport);
    lastCompactSummary = state.compactSummary || composeCompactSummary(lastReport);
    lastReceipt = {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      bridgeMode: BRIDGE_MODE,

      northRailReportObserved: lastReport.NORTH_RAIL_REPORT_OBSERVED === true,
      eightWayBridgeReady: lastReport.EIGHT_WAY_BRIDGE_READY === true,
      primaryZoneOfInfliction: lastReport.PRIMARY_ZONE_OF_INFLICTION,
      productionZoneCandidate: lastReport.PRODUCTION_ZONE_CANDIDATE,
      productionZoneConfidence: lastReport.PRODUCTION_ZONE_CONFIDENCE,
      recommendedNextFile: lastReport.RECOMMENDED_NEXT_FILE,
      recommendedNextAction: lastReport.RECOMMENDED_NEXT_ACTION,
      productionRecommendedNextFile: lastReport.PRODUCTION_RECOMMENDED_NEXT_FILE,
      productionRecommendedNextAction: lastReport.PRODUCTION_RECOMMENDED_NEXT_ACTION,

      fileCompositionMapAvailable: true,
      authorityMapAvailable: true,
      bridgeMapAvailable: true,
      packetTextAvailable: true,

      diagnosticProbeNorthActive: true,
      originDiagnosticRailRenewalRequired: false,
      dynamicLoadingOwned: false,
      productionMutationAuthorized: false,

      ...NO_CLAIMS,
      updatedAt: nowIso()
    };

    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.diagnosticProbeNorth = api;
    root.HEARTH.diagnosticRailProbeNorth = api;
    root.HEARTH.diagnosticProbeFileCompositionNorth = api;
    root.HEARTH.diagnosticProbeZoneCoordinatorNorth = api;

    root.DEXTER_LAB.hearthDiagnosticProbeNorth = api;
    root.DEXTER_LAB.hearthDiagnosticRailProbeNorth = api;
    root.DEXTER_LAB.hearthDiagnosticProbeFileCompositionNorth = api;
    root.DEXTER_LAB.hearthDiagnosticProbeZoneCoordinatorNorth = api;

    root.HEARTH_DIAGNOSTIC_PROBE_NORTH = api;
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_NORTH = api;
    root.HEARTH_DIAGNOSTIC_PROBE_FILE_COMPOSITION_NORTH = api;
    root.HEARTH_DIAGNOSTIC_PROBE_ZONE_COORDINATOR_NORTH = api;

    root.HEARTH_DIAGNOSTIC_PROBE_NORTH_RECEIPT = clonePlain(lastReceipt);
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_NORTH_RECEIPT = clonePlain(lastReceipt);
    root.HEARTH_DIAGNOSTIC_PROBE_NORTH_REPORT = clonePlain(lastReport);
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_NORTH_REPORT = clonePlain(lastReport);
    root.HEARTH_DIAGNOSTIC_PROBE_NORTH_PACKET_TEXT = lastPacketText;
    root.HEARTH_DIAGNOSTIC_PROBE_NORTH_COMPACT_SUMMARY = lastCompactSummary;
  }

  function getReport() {
    if (!lastReport) runProbeNorth({}, { passive: true });
    return clonePlain(lastReport);
  }

  function getState() {
    if (!lastState) runProbeNorth({}, { passive: true });
    return clonePlain(lastState);
  }

  function getReceiptLight() {
    if (!lastReceipt) runProbeNorth({}, { passive: true });
    return clonePlain(lastReceipt);
  }

  function getReceipt() {
    if (!lastReceipt) runProbeNorth({}, { passive: true });

    return {
      ...clonePlain(lastReceipt),
      fullReport: clonePlain(lastReport),
      fileDuties: clonePlain(FILE_DUTIES),
      productionDuties: clonePlain(PRODUCTION_DUTIES),
      zones: clonePlain(ZONES),
      noClaims: clonePlain(NO_CLAIMS),
      APIs: {
        runProbeNorth: true,
        ingestNorthPacket: true,
        getReport: true,
        getState: true,
        getReceipt: true,
        getReceiptLight: true,
        getPacketText: true,
        getCompactSummary: true,
        getFileCompositionMap: true,
        getAuthorityMap: true,
        getBridgeMap: true,
        getZoneMap: true
      }
    };
  }

  function getPacketText() {
    if (!lastPacketText) runProbeNorth({}, { passive: true });
    return lastPacketText;
  }

  function getCompactSummary() {
    if (!lastCompactSummary) runProbeNorth({}, { passive: true });
    return lastCompactSummary;
  }

  function getFileCompositionMap() {
    if (!lastState) runProbeNorth({}, { passive: true });
    return clonePlain(lastState.fileCompositionMap);
  }

  function getAuthorityMap() {
    if (!lastState) runProbeNorth({}, { passive: true });
    return clonePlain(lastState.authorityMap);
  }

  function getBridgeMap() {
    if (!lastState) runProbeNorth({}, { passive: true });
    return clonePlain(lastState.bridgeMap);
  }

  function getZoneMap() {
    if (!lastState) runProbeNorth({}, { passive: true });

    return {
      primaryZoneOfInfliction: lastState.primaryZoneOfInfliction,
      productionZoneCandidate: lastState.productionZoneCandidate,
      productionZoneConfidence: lastState.productionZoneConfidence,
      zoneReason: lastState.zoneReason,
      zoneCandidates: clonePlain(lastState.zoneCandidates),
      recommendedNextFile: lastState.recommendedNextFile,
      recommendedNextAction: lastState.recommendedNextAction,
      productionRecommendedNextFile: lastState.productionRecommendedNextFile,
      productionRecommendedNextAction: lastState.productionRecommendedNextAction,
      ...NO_CLAIMS
    };
  }

  function ingestNorthPacket(packet, options = {}) {
    const report = isObject(packet && packet.report) ? packet.report : packet;
    const verdict = isObject(packet && packet.verdict) ? packet.verdict : null;
    return runProbeNorth({ report, verdict }, options);
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    bridgeMode: BRIDGE_MODE,
    dynamicLoadingOwned: DYNAMIC_LOADING_OWNED,
    productionMutationAuthorized: PRODUCTION_MUTATION_AUTHORIZED,

    railNorthFile: RAIL_NORTH_FILE,
    railEastFile: RAIL_EAST_FILE,
    railSouthFile: RAIL_SOUTH_FILE,
    railWestFile: RAIL_WEST_FILE,
    probeNorthFile: PROBE_NORTH_FILE,
    probeEastFile: PROBE_EAST_FILE,
    probeSouthFile: PROBE_SOUTH_FILE,
    probeWestFile: PROBE_WEST_FILE,

    htmlFile: HTML_FILE,
    indexFile: INDEX_FILE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    controlFile: CONTROL_FILE,
    canvasFile: CANVAS_FILE,
    labNorthFile: LAB_NORTH_FILE,
    labEastFile: LAB_EAST_FILE,
    labSouthFile: LAB_SOUTH_FILE,
    labWestFile: LAB_WEST_FILE,

    currentRailNorthContract: CURRENT_RAIL_NORTH_CONTRACT,
    currentRouteConductorContract: CURRENT_ROUTE_CONDUCTOR_CONTRACT,
    currentIndexContract: CURRENT_INDEX_CONTRACT,
    currentControlContract: CURRENT_CONTROL_CONTRACT,
    currentCanvasContract: CURRENT_CANVAS_CONTRACT,

    FILE_DUTIES,
    PRODUCTION_DUTIES,
    ZONES,
    NO_CLAIMS,

    runProbeNorth,
    runNorthProbe: runProbeNorth,
    run: runProbeNorth,
    inspect: runProbeNorth,
    ingestNorthPacket,
    receiveNorthPacket: ingestNorthPacket,
    consumeNorthPacket: ingestNorthPacket,

    getReport,
    getProbeNorthReport: getReport,
    getState,
    getProbeNorthState: getState,
    getReceipt,
    getProbeNorthReceipt: getReceipt,
    getReceiptLight,
    getProbeNorthReceiptLight: getReceiptLight,
    getPacketText,
    getProbeNorthPacketText: getPacketText,
    getCompactSummary,
    getProbeNorthCompactSummary: getCompactSummary,
    getFileCompositionMap,
    getAuthorityMap,
    getBridgeMap,
    getZoneMap,

    supportsEightWayBridgeMap: true,
    supportsFileCompositionMap: true,
    supportsAuthorityMap: true,
    supportsBridgeReadinessMap: true,
    supportsZoneOfInflictionSelection: true,
    supportsProductionZoneCandidatePreservation: true,
    supportsDiagnosticInstrumentCompletionTracking: true,
    supportsOriginRailNoRenewalIntegration: true,

    ownsProbeNorthCoordination: true,
    ownsDiagnosticFileCompositionMap: true,
    ownsZoneCoordination: true,

    ownsDiagnosticRailParent: false,
    ownsRailEast: false,
    ownsRailSouth: false,
    ownsRailWest: false,
    ownsProbeEast: false,
    ownsProbeSouth: false,
    ownsProbeWest: false,
    ownsProductionRepair: false,
    ownsRuntimeRestart: false,
    ownsCanvasRelease: false,
    ownsMacroWestRelease: false,
    ownsControlRuntime: false,
    ownsCanvasDrawing: false,
    ownsFingerImplementation: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsMaterialTruth: false,

    ...NO_CLAIMS
  });

  publish(makeState(), composeReport(makeState()));
  runProbeNorth({}, { passive: true });

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

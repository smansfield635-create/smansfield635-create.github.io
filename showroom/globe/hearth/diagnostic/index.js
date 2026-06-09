// /showroom/globe/hearth/diagnostic/index.js
// HEARTH_DIAGNOSTIC_ROUTE_SINGLE_AUDIT_WORKBENCH_BUTTON_CONTROLLER_TNT_v9_4_6_FIX_1
// Full-file replacement.
// Restores full button/dropdown functionality.
// Adds Return to Hearth + Manifest awareness.
// No production/canvas/controls/runtime-route/target-renderer mutation.

(function hearthDiagnosticWorkbenchButtonController(global) {
  "use strict";

  var root = global || window;
  var doc = root.document;

  var CONTRACT = "HEARTH_DIAGNOSTIC_ROUTE_PLANET_PRODUCTION_FACILITY_INSTRUMENT_CHAMBER_TNT_v8";
  var RECEIPT = "HEARTH_DIAGNOSTIC_ROUTE_PLANET_PRODUCTION_FACILITY_INSTRUMENT_CHAMBER_RECEIPT_v8";

  var INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_ROUTE_SINGLE_AUDIT_WORKBENCH_BUTTON_CONTROLLER_TNT_v9_4_6_FIX_1";
  var INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_ROUTE_SINGLE_AUDIT_WORKBENCH_BUTTON_CONTROLLER_RECEIPT_v9_4_6_FIX_1";

  var PREVIOUS_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_ROUTE_SINGLE_AUDIT_WORKBENCH_BUTTON_CONTROLLER_TNT_v9_4_5";

  var HTML_SHELL_CONTRACT =
    "HEARTH_DIAGNOSTIC_ROUTE_SINGLE_AUDIT_WORKBENCH_STATIC_SHELL_TNT_v9_4_6";
  var CSS_CONTRACT =
    "HEARTH_DIAGNOSTIC_ROUTE_SINGLE_AUDIT_WORKBENCH_STYLE_TNT_v9_4_6";

  var VERSION = "2026-06-09.hearth-diagnostic-workbench-v9-4-6-fix-1";

  var TARGET_ROUTE = "/showroom/globe/hearth/";
  var DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  var NO_CLAIMS = {
    productionMutationAuthorized: false,
    canvasRepairAuthorized: false,
    canvasBuildAuthorized: false,
    canvasReleaseAuthorized: false,
    controlsRepairAuthorized: false,
    runtimeRestartAuthorized: false,
    routeRepairAuthorized: false,
    targetRouteRendererMutationAuthorized: false,
    readyTextClaimed: false,
    f13Claimed: false,
    f21Claimed: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false
  };

  var PARTICIPANTS = [
    { group: "LAB_NORTH", role: "LAB_NORTH", path: "/assets/lab/runtime-table.js", required: true },
    { group: "LAB_CARDINAL_BRANCHES", role: "LAB_EAST", path: "/assets/lab/runtime-table.east.js", required: true },
    { group: "LAB_CARDINAL_BRANCHES", role: "LAB_SOUTH", path: "/assets/lab/runtime-table.south.js", required: true },
    { group: "LAB_CARDINAL_BRANCHES", role: "LABWEST", path: "/assets/lab/runtime-table.west.js", required: true },
    { group: "HEARTH_DIAGNOSTIC_PARTICIPANTS", role: "NORTH", path: "/assets/hearth/hearth.diagnostic.rail.js", required: true },
    { group: "HEARTH_DIAGNOSTIC_PARTICIPANTS", role: "SURFACE_TRUTH", path: "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js", required: true },
    { group: "HEARTH_DIAGNOSTIC_PARTICIPANTS", role: "EAST", path: "/assets/hearth/hearth.diagnostic.east.js", required: true },
    { group: "HEARTH_DIAGNOSTIC_PARTICIPANTS", role: "EAST_PROBE", path: "/assets/hearth/hearth.diagnostic.probe.east.js", required: false },
    { group: "HEARTH_DIAGNOSTIC_PARTICIPANTS", role: "SOUTH", path: "/assets/hearth/hearth.diagnostic.south.js", required: true },
    { group: "HEARTH_DIAGNOSTIC_PARTICIPANTS", role: "SOUTH_SURFACE_POINTER", path: "/assets/hearth/hearth.diagnostic.south.surface.pointer.js", required: false },
    { group: "HEARTH_DIAGNOSTIC_PARTICIPANTS", role: "WEST_DIAGNOSTIC", path: "/assets/hearth/hearth.diagnostic.west.js", required: true }
  ];

  var ALIASES = {
    NORTH: ["JUDGE_NORTH", "HEARTH_DIAGNOSTIC_RAIL", "HEARTH.diagnosticRail", "DEXTER_LAB.hearthDiagnosticRail"],
    EAST: ["JUDGE_EAST", "HEARTH_DIAGNOSTIC_RAIL_EAST", "HEARTH.diagnosticEast", "DEXTER_LAB.hearthDiagnosticEast"],
    SURFACE_TRUTH: [
      "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
      "HEARTH_CANVAS_SURFACE_TRUTH_PROBE",
      "HEARTH.diagnosticProbeCanvasSurfaceTruth",
      "HEARTH.canvasSurfaceTruthProbe",
      "DEXTER_LAB.canvasSurfaceTruthProbe"
    ],
    SOUTH: ["JUDGE_SOUTH", "HEARTH_DIAGNOSTIC_RAIL_SOUTH", "HEARTH.diagnosticSouth", "DEXTER_LAB.hearthDiagnosticSouth"],
    SOUTH_SURFACE_POINTER: ["HEARTH.diagnosticSouthSurfacePointer", "HEARTH.southSurfacePointerSidecar", "DEXTER_LAB.southSurfacePointerSidecar"],
    LABWEST: ["LAB_RUNTIME_TABLE_WEST", "RUNTIME_TABLE_WEST", "DEXTER_LAB.runtimeTableWest", "HEARTH.runtimeTableWest"],
    WEST_DIAGNOSTIC: ["HEARTH.diagnosticWest", "HEARTH_DIAGNOSTIC_WEST", "DEXTER_LAB.hearthDiagnosticWest"],
    LAB_NORTH: ["LAB_RUNTIME_TABLE", "RUNTIME_TABLE", "DEXTER_LAB.runtimeTable", "HEARTH.runtimeTable"],
    LAB_EAST: ["LAB_RUNTIME_TABLE_EAST", "RUNTIME_TABLE_EAST", "DEXTER_LAB.runtimeTableEast", "HEARTH.runtimeTableEast"],
    LAB_SOUTH: ["LAB_RUNTIME_TABLE_SOUTH", "RUNTIME_TABLE_SOUTH", "DEXTER_LAB.runtimeTableSouth", "HEARTH.runtimeTableSouth"]
  };

  var PRODUCTION_MANIFEST = [
    { key: "HTML_SHELL", path: "/showroom/globe/hearth/index.html", kind: "route-shell", required: true },
    { key: "ROUTE_CONTROLLER", path: "/showroom/globe/hearth/index.js", kind: "route-controller", required: true },
    { key: "CANVAS_BISHOP", path: "/assets/hearth/hearth.canvas.js", kind: "chapel-one-bishop", required: true },
    { key: "HAND_GEOMETRY", path: "/assets/hearth/hearth.canvas.hand.geometry.js", kind: "chapel-one-hand", required: false },
    { key: "HAND_CONTEXT", path: "/assets/hearth/hearth.canvas.hand.context.js", kind: "chapel-one-hand", required: false },
    { key: "HAND_PAINT", path: "/assets/hearth/hearth.canvas.hand.paint.js", kind: "chapel-one-hand", required: false },
    { key: "HAND_VIEW", path: "/assets/hearth/hearth.canvas.hand.view.js", kind: "chapel-one-hand", required: false },
    { key: "HAND_INSPECT", path: "/assets/hearth/hearth.canvas.hand.inspect.js", kind: "chapel-one-hand", required: false },
    { key: "HEX_AUTHORITY_BRIDGE", path: "/assets/hearth/hearth.hex.four-pair.authority.js", kind: "congressional-bridge", required: false },
    { key: "HEX_SURFACE_BRIDGE", path: "/assets/hearth/hearth.hex.surface.js", kind: "congressional-bridge", required: false },
    { key: "FINGER_SURFACE", path: "/assets/hearth/hearth.canvas.finger.surface.js", kind: "chapel-two-finger", required: false },
    { key: "FINGER_BOUNDARY", path: "/assets/hearth/hearth.canvas.finger.boundary.js", kind: "chapel-two-finger", required: false },
    { key: "FINGER_INSPECT", path: "/assets/hearth/hearth.canvas.finger.inspect.js", kind: "chapel-two-finger", required: false },
    { key: "FINGER_LIGHT", path: "/assets/hearth/hearth.canvas.finger.light.js", kind: "chapel-two-finger", required: false }
  ];

  var SECTIONS = [
    { id: "chamberReceiver", label: "Chamber / Receiver", hint: "Receiver and chamber condition", audits: ["chamberIndex", "receiverHealth", "targetAccess", "loadSequence", "aliasMap"] },
    { id: "cardinalLab", label: "Cardinal / Lab", hint: "North, East, South, West calibration", audits: ["northSignal", "eastSource", "southLens", "southSurfacePointer", "labWestGate", "westDiagnostic"] },
    { id: "sourceSurface", label: "Source / Surface", hint: "Source and surface access", audits: ["eastSourceDetail", "surfaceTruthDetail", "targetSurfaceAccess", "canvasBoundary"] },
    { id: "directExecution", label: "Direct Execution", hint: "Explicit direct checks only", audits: ["northDirect", "eastDirect", "surfaceTruthDirect", "southDirect", "westDirect"] },
    { id: "boundaryArchive", label: "Boundary / Archive", hint: "No-touch proof and archive", audits: ["noTouchBoundary", "nextMove", "productionManifest", "deepArchive"] }
  ];

  var AUDITS = {
    chamberIndex: { seq: "00", section: "chamberReceiver", label: "Chamber Index", type: "safe", summary: "Creates a complete chamber index with current target, section, load, and audit availability." },
    receiverHealth: { seq: "01", section: "chamberReceiver", label: "Receiver Health", type: "safe", summary: "Checks required participant loading, optional loading, receiver readiness, and chamber health." },
    targetAccess: { seq: "02", section: "chamberReceiver", label: "Target Access", type: "safe", summary: "Checks diagnostic target-frame access without mutating the target." },
    loadSequence: { seq: "03", section: "chamberReceiver", label: "Load Sequence", type: "safe", summary: "Reports participant script load order, status, required flags, and timing." },
    aliasMap: { seq: "04", section: "chamberReceiver", label: "Alias Map", type: "safe", summary: "Reports authority aliases and receiver alignment." },

    northSignal: { seq: "05", section: "cardinalLab", label: "North Signal", type: "safe", summary: "Reports North diagnostic authority presence." },
    eastSource: { seq: "06", section: "cardinalLab", label: "East Source", type: "safe", summary: "Reports East source authority presence." },
    southLens: { seq: "07", section: "cardinalLab", label: "South Lens", type: "safe", summary: "Reports South authority and proof-return status." },
    southSurfacePointer: { seq: "08A", section: "cardinalLab", label: "South Surface Pointer", type: "safe", summary: "Reports South surface pointer sidecar presence." },
    labWestGate: { seq: "09A", section: "cardinalLab", label: "LabWest Gate", type: "safe", summary: "Reports LabWest admissibility gate presence." },
    westDiagnostic: { seq: "10A", section: "cardinalLab", label: "West Diagnostic", type: "safe", summary: "Reports West diagnostic participant presence." },

    eastSourceDetail: { seq: "11", section: "sourceSurface", label: "East Source Detail", type: "safe", summary: "Creates a detailed East source report." },
    surfaceTruthDetail: { seq: "12", section: "sourceSurface", label: "Surface Truth Detail", type: "safe", summary: "Creates a detailed Surface Truth report." },
    targetSurfaceAccess: { seq: "13A", section: "sourceSurface", label: "Target Surface Access", type: "safe", summary: "Reports target iframe access and surface observation boundary." },
    canvasBoundary: { seq: "14A", section: "sourceSurface", label: "Canvas Boundary", type: "safe", summary: "Reports no-touch canvas boundary." },

    northDirect: { seq: "15", section: "directExecution", label: "North Direct", type: "direct", component: "NORTH", aliases: ALIASES.NORTH, summary: "Creates a direct-check preview for North." },
    eastDirect: { seq: "16", section: "directExecution", label: "East Direct", type: "direct", component: "EAST", aliases: ALIASES.EAST, summary: "Creates a direct-check preview for East." },
    surfaceTruthDirect: { seq: "17", section: "directExecution", label: "Surface Truth Direct", type: "direct", component: "SURFACE_TRUTH", aliases: ALIASES.SURFACE_TRUTH, summary: "Creates a direct-check preview for Surface Truth." },
    southDirect: { seq: "18", section: "directExecution", label: "South Direct", type: "direct", component: "SOUTH", aliases: ALIASES.SOUTH, summary: "Creates a direct-check preview for South." },
    westDirect: { seq: "19", section: "directExecution", label: "West Diagnostic Direct", type: "direct", component: "WEST_DIAGNOSTIC", aliases: ALIASES.WEST_DIAGNOSTIC, summary: "Creates a direct-check preview for West Diagnostic." },

    noTouchBoundary: { seq: "20", section: "boundaryArchive", label: "No-Touch Boundary", type: "safe", summary: "Reports production/canvas/controls/runtime no-touch boundary." },
    nextMove: { seq: "21", section: "boundaryArchive", label: "Next Move", type: "safe", summary: "Synthesizes the next lawful diagnostic move." },
    productionManifest: { seq: "22", section: "boundaryArchive", label: "Production Manifest", type: "safe", summary: "Reports read-only awareness of Hearth production file surface." },
    deepArchive: { seq: "99", section: "boundaryArchive", label: "Deep Archive", type: "safe", summary: "Creates the full diagnostic archive." }
  };

  var state = {
    initializedAt: nowIso(),
    updatedAt: nowIso(),
    activeSection: readSession("activeSection", "chamberReceiver"),
    activeAudit: readSession("activeAudit", "chamberIndex"),
    targetVisible: readSession("targetVisible", "false") === "true",
    manifestVisible: readSession("manifestVisible", "false") === "true",
    participantLoad: [],
    loadStarted: false,
    loadComplete: false,
    aliases: {},
    directResults: {},
    generatedText: "",
    rawText: ""
  };

  function $(id) { return doc.getElementById(id); }

  function nowIso() {
    try { return new Date().toISOString(); } catch (_e) { return ""; }
  }

  function safeString(value, fallback) {
    if (fallback === undefined) fallback = "";
    if (value === undefined || value === null) return fallback;
    try { return String(value); } catch (_e) { return fallback; }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function readSession(key, fallback) {
    try { return root.sessionStorage.getItem("hearthDiagnostic.v946." + key) || fallback; }
    catch (_e) { return fallback; }
  }

  function writeSession(key, value) {
    try { root.sessionStorage.setItem("hearthDiagnostic.v946." + key, safeString(value)); }
    catch (_e) {}
  }

  function escapeHtml(value) {
    return safeString(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function readPath(path, win) {
    var cursor = win || root;
    var parts = safeString(path).replace(/^window\./, "").split(".").filter(Boolean);
    for (var i = 0; i < parts.length; i += 1) {
      if (!cursor || cursor[parts[i]] === undefined || cursor[parts[i]] === null) return null;
      cursor = cursor[parts[i]];
    }
    return cursor;
  }

  function methodKeys(value) {
    if (!isObject(value) && !isFunction(value)) return [];
    try { return Object.keys(value).filter(function (key) { return isFunction(value[key]); }); }
    catch (_e) { return []; }
  }

  function sectionById(id) {
    return SECTIONS.find(function (section) { return section.id === id; }) || SECTIONS[0];
  }

  function auditById(id) {
    return AUDITS[id] || AUDITS.chamberIndex;
  }

  function firstAudit(sectionId) {
    return sectionById(sectionId).audits[0] || "chamberIndex";
  }

  function normalizeState() {
    if (!sectionById(state.activeSection)) state.activeSection = "chamberReceiver";
    if (!AUDITS[state.activeAudit] || AUDITS[state.activeAudit].section !== state.activeSection) {
      state.activeAudit = firstAudit(state.activeSection);
    }
  }

  function persistState() {
    normalizeState();
    writeSession("activeSection", state.activeSection);
    writeSession("activeAudit", state.activeAudit);
    writeSession("targetVisible", state.targetVisible ? "true" : "false");
    writeSession("manifestVisible", state.manifestVisible ? "true" : "false");
  }

  function setText(id, value) {
    var node = $(id);
    if (node) node.textContent = safeString(value);
  }

  function normalizePath(src) {
    try { return new URL(src, root.location.origin).pathname; }
    catch (_e) { return safeString(src); }
  }

  function findScript(path) {
    var scripts = Array.prototype.slice.call(doc.querySelectorAll("script[src]"));
    return scripts.find(function (script) {
      var src = script.getAttribute("src") || script.src || "";
      return normalizePath(src) === path || src.indexOf(path) !== -1;
    }) || null;
  }

  function loadParticipant(entry) {
    return new Promise(function (resolve) {
      if (findScript(entry.path)) {
        resolve(recordLoad(entry, "loaded", true));
        return;
      }

      var script = doc.createElement("script");
      var done = false;

      function finish(status) {
        if (done) return;
        done = true;
        resolve(recordLoad(entry, status, false));
      }

      script.src = entry.path;
      script.defer = true;
      script.dataset.hearthDiagnosticParticipant = "true";
      script.onload = function () { finish("loaded"); };
      script.onerror = function () { finish(entry.required ? "error_required" : "error_optional"); };

      root.setTimeout(function () {
        finish(entry.required ? "timeout_required" : "timeout_optional");
      }, 4500);

      doc.head.appendChild(script);
    });
  }

  function recordLoad(entry, status, reused) {
    var result = {
      group: entry.group,
      role: entry.role,
      path: entry.path,
      required: Boolean(entry.required),
      status: status,
      reused: Boolean(reused),
      settledAt: nowIso()
    };

    var existing = state.participantLoad.find(function (item) { return item.path === entry.path; });
    if (existing) Object.assign(existing, result);
    else state.participantLoad.push(result);

    renderStatus();
    return result;
  }

  function loadParticipants() {
    state.loadStarted = true;
    state.loadComplete = false;
    renderStatus();

    return PARTICIPANTS.reduce(function (chain, entry) {
      return chain.then(function () { return loadParticipant(entry); });
    }, Promise.resolve()).then(function () {
      state.loadComplete = true;
      probeAliases();
      renderStatus();
      publishApi();
    });
  }

  function probeAlias(alias) {
    var value = readPath(alias);
    var methods = methodKeys(value);

    return {
      alias: alias,
      found: Boolean(value),
      valueType: value ? typeof value : "undefined",
      methodCount: methods.length,
      methodKeys: methods.join(","),
      contract: value && isObject(value) ? safeString(value.CONTRACT || value.contract || "UNKNOWN") : "UNKNOWN",
      receipt: value && isObject(value) ? safeString(value.RECEIPT || value.receipt || "UNKNOWN") : "UNKNOWN",
      internalRenewalContract: value && isObject(value)
        ? safeString(value.INTERNAL_RENEWAL_CONTRACT || value.internalRenewalContract || "UNKNOWN")
        : "UNKNOWN"
    };
  }

  function probeAliases() {
    var output = {};
    Object.keys(ALIASES).forEach(function (key) {
      var probes = ALIASES[key].map(probeAlias);
      var first = probes.find(function (item) { return item.found; });

      output[key] = {
        label: key,
        present: Boolean(first),
        authorityPath: first ? first.alias : "NONE",
        valueType: first ? first.valueType : "undefined",
        methodCount: first ? first.methodCount : 0,
        methodKeys: first ? first.methodKeys : "",
        probe: probes
      };
    });
    state.aliases = output;
    return output;
  }

  function loadSummary() {
    var required = state.participantLoad.filter(function (item) { return item.required; });
    var requiredBad = required.filter(function (item) { return item.status !== "loaded"; });
    var optionalBad = state.participantLoad.filter(function (item) { return !item.required && item.status !== "loaded"; });

    return {
      requiredCount: required.length,
      requiredBadCount: requiredBad.length,
      optionalBadCount: optionalBad.length,
      allRequiredLoaded: state.loadComplete && requiredBad.length === 0,
      allLoaded: state.participantLoad.length > 0 && state.participantLoad.every(function (item) { return item.status === "loaded"; })
    };
  }

  function getTargetAccess() {
    var frame = $("hearthDiagnosticTargetFrame");
    var frameDoc = null;
    var path = "UNKNOWN";
    var title = "UNKNOWN";
    var error = "NONE";

    try {
      frameDoc = frame && (frame.contentDocument || (frame.contentWindow && frame.contentWindow.document));
      if (frameDoc && frameDoc.location) path = frameDoc.location.pathname || "UNKNOWN";
      if (frameDoc && frameDoc.title) title = frameDoc.title || "UNKNOWN";
    } catch (caught) {
      error = caught && caught.message ? caught.message : "TARGET_FRAME_ACCESS_ERROR";
    }

    return {
      status: frameDoc ? "TARGET_ACCESS_CONFIRMED" : "TARGET_ACCESS_NOT_CONFIRMED",
      routeConfirmed: path === TARGET_ROUTE || path === TARGET_ROUTE.replace(/\/$/, ""),
      framePresent: Boolean(frame),
      frameAccessible: Boolean(frameDoc),
      error: error,
      targetPath: path,
      targetTitle: title
    };
  }

  function readReceipt(value) {
    if (!value || (!isObject(value) && !isFunction(value))) return {};
    var methods = ["getReceiptLight", "getReceipt", "getStatus", "getState", "getReport"];
    for (var i = 0; i < methods.length; i += 1) {
      try {
        if (isFunction(value[methods[i]])) {
          var out = value[methods[i]]();
          if (isObject(out)) return out;
        }
      } catch (_e) {}
    }
    return isObject(value) ? value : {};
  }

  function manifestAliases(key) {
    var map = {
      CANVAS_BISHOP: ["HEARTH_CANVAS_BISHOP", "HEARTH.canvasBishop", "HEARTH.canvas", "DEXTER_LAB.hearthCanvasBishop"],
      HAND_GEOMETRY: ["HEARTH_CANVAS_HAND_GEOMETRY", "HEARTH.canvasHandGeometry", "DEXTER_LAB.hearthCanvasHandGeometry"],
      HAND_CONTEXT: ["HEARTH_CANVAS_HAND_CONTEXT", "HEARTH.canvasHandContext", "DEXTER_LAB.hearthCanvasHandContext"],
      HAND_PAINT: ["HEARTH_CANVAS_HAND_PAINT", "HEARTH.canvasHandPaint", "DEXTER_LAB.hearthCanvasHandPaint"],
      HAND_VIEW: ["HEARTH_CANVAS_HAND_VIEW", "HEARTH.canvasHandView", "DEXTER_LAB.hearthCanvasHandView"],
      HAND_INSPECT: ["HEARTH_CANVAS_HAND_INSPECT", "HEARTH.canvasHandInspect", "DEXTER_LAB.hearthCanvasHandInspect"],
      HEX_AUTHORITY_BRIDGE: ["HEARTH_HEX_FOUR_PAIR_AUTHORITY", "HEARTH.hexFourPairAuthority", "HEARTH.hexAuthority"],
      HEX_SURFACE_BRIDGE: ["HEARTH_HEX_SURFACE", "HEARTH.hexSurface", "HEARTH_HEX_SURFACE_RENDERER"],
      FINGER_SURFACE: ["HEARTH_CANVAS_FINGER_SURFACE", "HEARTH.canvasFingerSurface"],
      FINGER_BOUNDARY: ["HEARTH_CANVAS_FINGER_BOUNDARY", "HEARTH.canvasFingerBoundary"],
      FINGER_INSPECT: ["HEARTH_CANVAS_FINGER_INSPECT", "HEARTH.canvasFingerInspect"],
      FINGER_LIGHT: ["HEARTH_CANVAS_FINGER_LIGHT", "HEARTH.canvasFingerLight"]
    };
    return map[key] || [];
  }

  function inspectProductionManifest() {
    var frame = $("hearthDiagnosticTargetFrame");
    var frameDoc = null;
    var frameWin = null;

    try {
      frameDoc = frame && (frame.contentDocument || (frame.contentWindow && frame.contentWindow.document));
      frameWin = frame && frame.contentWindow ? frame.contentWindow : null;
    } catch (_e) {}

    return PRODUCTION_MANIFEST.map(function (item) {
      var scriptInTarget = false;

      if (frameDoc) {
        try {
          scriptInTarget = Boolean(Array.prototype.slice.call(frameDoc.querySelectorAll("script[src]")).find(function (script) {
            var src = script.getAttribute("src") || script.src || "";
            return normalizePath(src) === item.path || src.indexOf(item.path) !== -1;
          }));
        } catch (_e) {}
      }

      var observed = null;
      var observedAlias = "NONE";
      var aliases = manifestAliases(item.key);

      for (var i = 0; i < aliases.length; i += 1) {
        observed = readPath(aliases[i]) || (frameWin ? readPath(aliases[i], frameWin) : null);
        if (observed) {
          observedAlias = aliases[i];
          break;
        }
      }

      var receipt = readReceipt(observed);
      var methods = methodKeys(observed);

      return {
        key: item.key,
        path: item.path,
        kind: item.kind,
        required: item.required,
        scriptInTarget: scriptInTarget,
        authorityObserved: Boolean(observed),
        authorityAlias: observedAlias,
        methodCount: methods.length,
        methodKeys: methods.join(","),
        contract: safeString(receipt.CONTRACT || receipt.contract || "UNKNOWN"),
        receipt: safeString(receipt.RECEIPT || receipt.receipt || "UNKNOWN"),
        componentStatus: safeString(receipt.componentStatus || receipt.status || "UNKNOWN")
      };
    });
  }

  function basePacket(seq, label, component, extra) {
    var audit = auditById(state.activeAudit);
    var section = sectionById(state.activeSection);

    var packet = {
      PACKET: "HEARTH_DIAGNOSTIC_WORKBENCH_REPORT_" + safeString(seq).replace(/[^A-Z0-9]/gi, "_") + "_v9_4_6_FIX_1",
      RECEIPT_LEVEL: "2_SINGLE_AUDIT_WORKBENCH_REPORT",
      AUDIT_SEQUENCE: seq,
      AUDIT_LABEL: label,
      COMPONENT: component,

      CONTRACT: CONTRACT,
      RECEIPT: RECEIPT,
      CSS_CONTRACT: CSS_CONTRACT,
      HTML_SHELL_CONTRACT: HTML_SHELL_CONTRACT,
      INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
      PREVIOUS_INTERNAL_RENEWAL_CONTRACT: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,

      TARGET_ROUTE: TARGET_ROUTE,
      DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,
      WORKBENCH_MODEL: "CATEGORY_BUBBLE_FILTERS_AUDIT_BUBBLE_LOCAL_REPORT_ACTIONS_RETURN_AND_MANIFEST_AWARENESS",
      REPORT_SOURCE_OF_TRUTH: "BUTTON_CONTROLLER_STATE",

      SELECTED_CATEGORY_ID: state.activeSection,
      SELECTED_CATEGORY_LABEL: section.label,
      SELECTED_AUDIT_ID: state.activeAudit,
      SELECTED_AUDIT_LABEL: audit.label,
      SELECTED_AUDIT_SEQUENCE: audit.seq,
      RESOLVED_FROM: "BUTTON_CONTROLLER_STATE",

      BUTTON_CONTROLLER_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      BUTTON_CONTROLLER_BOOTED: true,
      DROPDOWN_BINDINGS_INSTALLED: true,
      RETURN_TO_HEARTH_ACTIVE: true,
      PRODUCTION_MANIFEST_AWARENESS_ACTIVE: true,

      RUN_STATE: "REPORT_CREATED",
      TRUST_STATE: "CURRENT",
      BLOCKING: false,
      UPDATED_AT: nowIso()
    };

    Object.assign(packet, extra || {});
    Object.assign(packet, NO_CLAIMS);
    return packet;
  }

  function lineValue(value) {
    if (value === undefined || value === null || value === "") return "UNKNOWN";
    if (Array.isArray(value) || isObject(value)) {
      try { return JSON.stringify(value); } catch (_e) { return "[object]"; }
    }
    return safeString(value);
  }

  function packetText(packet) {
    return Object.keys(packet || {}).map(function (key) {
      return key + "=" + lineValue(packet[key]);
    }).join("\n");
  }

  function rawJson(packet) {
    try { return JSON.stringify(packet, null, 2); }
    catch (_e) { return packetText(packet); }
  }

  function buildReport(auditId) {
    var audit = auditById(auditId);
    var aliases = probeAliases();
    var summary = loadSummary();

    if (audit.type === "direct") return directPreview(auditId);

    if (auditId === "chamberIndex") {
      return basePacket(audit.seq, audit.label, "CHAMBER", {
        RECEIPT_LEVEL: "1_CHAMBER_INDEX",
        VERSION: VERSION,
        LOAD_STARTED: state.loadStarted,
        LOAD_COMPLETE: state.loadComplete,
        ALL_REQUIRED_PARTICIPANTS_LOADED: summary.allRequiredLoaded,
        PARTICIPANT_LOAD_COUNT: state.participantLoad.length,
        SECTION_COUNT: SECTIONS.length,
        AUDIT_COUNT: Object.keys(AUDITS).length,
        NEXT_ACTION: "CHOOSE_AUDIT_AND_CREATE_REPORT"
      });
    }

    if (auditId === "receiverHealth") {
      return basePacket(audit.seq, audit.label, "RECEIVER", {
        LOAD_STARTED: state.loadStarted,
        LOAD_COMPLETE: state.loadComplete,
        REQUIRED_COUNT: summary.requiredCount,
        REQUIRED_BAD_COUNT: summary.requiredBadCount,
        OPTIONAL_BAD_COUNT: summary.optionalBadCount,
        RECEIVER_STATUS: summary.allRequiredLoaded ? "RECEIVER_READY" : "RECEIVER_LOAD_INCOMPLETE"
      });
    }

    if (auditId === "targetAccess") {
      return basePacket(audit.seq, audit.label, "TARGET_ACCESS", getTargetAccess());
    }

    if (auditId === "loadSequence") {
      return basePacket(audit.seq, audit.label, "PARTICIPANT_LOAD_SEQUENCE", {
        PARTICIPANT_LOAD: state.participantLoad,
        LOAD_SUMMARY: summary
      });
    }

    if (auditId === "aliasMap") {
      return basePacket(audit.seq, audit.label, "ALIAS_MAP", { ALIASES: aliases });
    }

    if (auditId === "productionManifest") {
      var manifest = inspectProductionManifest();
      return basePacket(audit.seq, audit.label, "PRODUCTION_MANIFEST", {
        RECEIPT_LEVEL: "4_PRODUCTION_AWARENESS_REPORT",
        PRODUCTION_MANIFEST_COUNT: manifest.length,
        PRODUCTION_MANIFEST_OBSERVED_COUNT: manifest.filter(function (item) {
          return item.scriptInTarget || item.authorityObserved;
        }).length,
        PRODUCTION_MANIFEST: manifest,
        DO_NOT_TOUCH: "PRODUCTION,CANVAS,CONTROLS,RUNTIME_ROUTE,TARGET_RENDERER"
      });
    }

    if (auditId === "deepArchive") {
      return {
        PACKET: "HEARTH_DIAGNOSTIC_WORKBENCH_DEEP_ARCHIVE_99_v9_4_6_FIX_1",
        RECEIPT_LEVEL: "5_DEEP_ARCHIVE",
        AUDIT_SEQUENCE: "99",
        AUDIT_LABEL: "Deep Archive",
        CONTRACT: CONTRACT,
        RECEIPT: RECEIPT,
        CSS_CONTRACT: CSS_CONTRACT,
        HTML_SHELL_CONTRACT: HTML_SHELL_CONTRACT,
        INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
        INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
        TARGET_ROUTE: TARGET_ROUTE,
        DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,
        STATE: state,
        ALIASES: aliases,
        TARGET_ACCESS: getTargetAccess(),
        PRODUCTION_MANIFEST: inspectProductionManifest(),
        NO_CLAIMS: NO_CLAIMS,
        UPDATED_AT: nowIso()
      };
    }

    if (auditId === "nextMove") {
      return basePacket(audit.seq, audit.label, "NEXT_LAWFUL_MOVE", {
        RECEIPT_LEVEL: "4_SYNTHESIS",
        FIRST_BLOCKING_COMPONENT: summary.allRequiredLoaded ? "NONE" : "REQUIRED_PARTICIPANT_LOAD",
        NEXT_FILE: summary.allRequiredLoaded ? "/assets/hearth/hearth.canvas.js" : DIAGNOSTIC_ROUTE,
        NEXT_ACTION: summary.allRequiredLoaded ? "MEASURE_CANVAS_BISHOP_AND_MANIFEST" : "INSPECT_LOAD_SEQUENCE"
      });
    }

    if (auditId === "canvasBoundary" || auditId === "noTouchBoundary") {
      return basePacket(audit.seq, audit.label, auditId === "canvasBoundary" ? "CANVAS_BOUNDARY" : "NO_TOUCH_BOUNDARY", {
        PRODUCTION_MUTATION_AUTHORIZED: false,
        CANVAS_REPAIR_AUTHORIZED: false,
        CANVAS_BUILD_AUTHORIZED: false,
        CANVAS_RELEASE_AUTHORIZED: false,
        BOUNDARY_REASON: "DIAGNOSTIC_REPORT_ONLY_NO_PRODUCTION_ACTION_AUTHORIZED"
      });
    }

    var componentMap = {
      northSignal: ["NORTH_SIGNAL", ["NORTH", "LAB_NORTH"]],
      eastSource: ["EAST_SOURCE", ["EAST", "LAB_EAST"]],
      southLens: ["SOUTH_LENS", ["SOUTH", "LAB_SOUTH"]],
      southSurfacePointer: ["SOUTH_SURFACE_POINTER", ["SOUTH_SURFACE_POINTER"]],
      labWestGate: ["LABWEST_GATE", ["LABWEST"]],
      westDiagnostic: ["WEST_DIAGNOSTIC", ["WEST_DIAGNOSTIC", "LABWEST"]],
      eastSourceDetail: ["EAST_SOURCE_DETAIL", ["EAST", "LAB_EAST"]],
      surfaceTruthDetail: ["SURFACE_TRUTH_DETAIL", ["SURFACE_TRUTH"]],
      targetSurfaceAccess: ["TARGET_SURFACE_ACCESS", ["SURFACE_TRUTH"]]
    };

    if (componentMap[auditId]) {
      var spec = componentMap[auditId];
      var payload = { GROUPS_TESTED: spec[1].join(",") };
      spec[1].forEach(function (key) {
        var item = aliases[key] || {};
        payload[key + "_PRESENT"] = Boolean(item.present);
        payload[key + "_AUTHORITY_PATH"] = item.authorityPath || "NONE";
        payload[key + "_METHOD_COUNT"] = item.methodCount || 0;
        payload[key + "_METHOD_KEYS"] = item.methodKeys || "";
        payload[key + "_PROBE"] = item.probe || [];
      });
      return basePacket(audit.seq, audit.label, spec[0], payload);
    }

    return basePacket(audit.seq, audit.label, "UNKNOWN", {
      RUN_STATE: "AUDIT_BUILDER_NOT_DEFINED"
    });
  }

  function resolveAuthority(audit) {
    var aliases = audit.aliases || [];
    var candidates = aliases.map(function (alias) {
      var value = readPath(alias);
      var methods = methodKeys(value);
      return {
        alias: alias,
        value: value,
        found: Boolean(value),
        methodCount: methods.length,
        methodKeys: methods.join(","),
        score: Boolean(value) ? methods.length + 100 : 0
      };
    }).filter(function (item) { return item.found; });

    candidates.sort(function (a, b) { return b.score - a.score; });
    return candidates[0] || null;
  }

  function directPreview(auditId) {
    var audit = auditById(auditId);
    var resolved = resolveAuthority(audit);
    var methods = resolved ? methodKeys(resolved.value) : [];

    return basePacket(audit.seq, audit.label, audit.component || auditId, {
      RECEIPT_LEVEL: "3_DIRECT_PREVIEW",
      AUDIT_TYPE: "DIRECT_PREVIEW",
      RUN_STATE: "DIRECT_PREVIEW_NOT_EXECUTED",
      EXECUTION_REQUIRED: true,
      RUN_EXECUTED: false,
      DIRECT_AUTHORITY_PATH: resolved ? resolved.alias : "NONE",
      AUTHORITY_METHOD_COUNT: methods.length,
      AUTHORITY_METHOD_KEYS: methods.join(","),
      NEXT_ACTION: "CLICK_RUN_DIRECT_CHECK_TO_EXECUTE"
    });
  }

  function runDirectCheck(auditId) {
    var audit = auditById(auditId);
    var resolved = resolveAuthority(audit);
    var packet = null;
    var method = "NONE";
    var error = "NONE";

    if (resolved && resolved.value) {
      var methods = ["run", "runDiagnostic", "inspect", "measure", "getReport", "getReceipt"];
      for (var i = 0; i < methods.length; i += 1) {
        if (isFunction(resolved.value[methods[i]])) {
          try {
            method = methods[i];
            packet = resolved.value[methods[i]]();
            break;
          } catch (caught) {
            error = caught && caught.message ? caught.message : String(caught);
            break;
          }
        }
      }
    }

    var out = basePacket(audit.seq, audit.label, audit.component || auditId, {
      RECEIPT_LEVEL: "3_DIRECT_EXECUTION",
      AUDIT_TYPE: "DIRECT",
      RUN_STATE: packet ? "DIRECT_RUN_EXECUTED" : resolved ? "AUTHORITY_FOUND_NOT_RUN" : "AUTHORITY_NOT_FOUND",
      TRUST_STATE: resolved ? "AUTHORITY_FOUND" : "AUTHORITY_NOT_FOUND",
      RUN_EXECUTED: Boolean(packet),
      DIRECT_AUTHORITY_PATH: resolved ? resolved.alias : "NONE",
      DIRECT_METHOD: method,
      DIRECT_ERROR: error,
      DIRECT_PACKET_KEYS: packet && isObject(packet) ? Object.keys(packet).join(",") : "",
      DIRECT_PACKET: packet && isObject(packet) ? packet : {},
      NEXT_ACTION: packet ? "COPY_REPORT_OR_RUN_NEXT_AUDIT" : "INSPECT_AUTHORITY_AND_METHOD_SURFACE"
    });

    state.directResults[auditId] = out;
    return out;
  }

  function renderDropdowns() {
    normalizeState();

    var section = sectionById(state.activeSection);
    var audit = auditById(state.activeAudit);

    setText("categoryDropdownLabel", section.label);
    setText("categoryDropdownMeta", section.hint);
    setText("auditDropdownLabel", audit.seq + " · " + audit.label);
    setText("auditDropdownMeta", (audit.type === "direct" ? "Direct" : "Safe") + " · " + audit.summary);

    setText("selectedAuditMeta", audit.seq + " · " + audit.type.toUpperCase());
    setText("selectedSectionLabel", section.label);
    setText("selectedAuditTitle", audit.label);
    setText("selectedAuditSummary", audit.summary);

    var runDirect = $("runDirectReport");
    if (runDirect) {
      runDirect.hidden = audit.type !== "direct";
      runDirect.disabled = audit.type !== "direct";
    }

    renderCategoryMenu();
    renderAuditMenu();
  }

  function renderCategoryMenu() {
    var menu = $("categoryDropdownMenu");
    if (!menu) return;

    menu.innerHTML = SECTIONS.map(function (section) {
      return '<button class="dropdown-option' +
        (section.id === state.activeSection ? " is-active" : "") +
        '" type="button" data-category-id="' + escapeHtml(section.id) + '">' +
        '<span>' + escapeHtml(section.label) + '</span>' +
        '<small>' + escapeHtml(section.hint) + '</small></button>';
    }).join("");
  }

  function renderAuditMenu() {
    var menu = $("auditDropdownMenu");
    if (!menu) return;

    var section = sectionById(state.activeSection);
    menu.innerHTML = section.audits.map(function (auditId) {
      var audit = auditById(auditId);
      return '<button class="dropdown-option' +
        (auditId === state.activeAudit ? " is-active" : "") +
        '" type="button" data-audit-id="' + escapeHtml(auditId) + '">' +
        '<span>' + escapeHtml(audit.seq + " · " + audit.label) + '</span>' +
        '<small>' + escapeHtml((audit.type === "direct" ? "Direct" : "Safe") + " · " + audit.summary) + '</small></button>';
    }).join("");
  }

  function closeAllMenus() {
    ["categoryDropdownMenu", "auditDropdownMenu"].forEach(function (id) {
      var menu = $(id);
      if (menu) menu.classList.remove("is-open");
    });
    ["categoryDropdownButton", "auditDropdownButton"].forEach(function (id) {
      var button = $(id);
      if (button) button.setAttribute("aria-expanded", "false");
    });
  }

  function toggleMenu(menuId, buttonId) {
    var menu = $(menuId);
    var button = $(buttonId);
    if (!menu || !button) return;

    var open = menu.classList.contains("is-open");
    closeAllMenus();

    if (!open) {
      menu.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
    }
  }

  function createReport() {
    var packet = buildReport(state.activeAudit);
    renderReport(packet, auditById(state.activeAudit).type === "direct" ? "DIRECT_PREVIEW_CREATED" : "REPORT_CREATED");
    showToast("Report created");
    return packet;
  }

  function runSelectedDirectCheck() {
    var audit = auditById(state.activeAudit);
    if (audit.type !== "direct") {
      showToast("Selected audit is not direct");
      return null;
    }
    var packet = runDirectCheck(state.activeAudit);
    renderReport(packet, "DIRECT_CHECK_EXECUTED");
    showToast("Direct check complete");
    return packet;
  }

  function renderReport(packet, meta) {
    state.generatedText = packetText(packet);
    state.rawText = rawJson(packet);

    setText("reportTitle", packet.AUDIT_LABEL || "Report");
    setText("reportMeta", meta || "REPORT_CREATED");
    setText("generatedReport", state.generatedText);
    setText("rawReport", state.rawText);

    var output = $("reportOutput");
    if (output) output.hidden = false;

    ["copyReport", "copyRaw"].forEach(function (id) {
      var button = $(id);
      if (button) button.disabled = false;
    });
  }

  function clearReport() {
    state.generatedText = "";
    state.rawText = "";
    setText("reportTitle", "No Report Created");
    setText("reportMeta", "WAITING");
    setText("generatedReport", "Choose a category, choose an audit, then create a report.");
    setText("rawReport", "");
    ["copyReport", "copyRaw"].forEach(function (id) {
      var button = $(id);
      if (button) button.disabled = true;
    });
    showToast("Report reset");
  }

  function copyText(text, label) {
    var value = safeString(text);
    if (root.navigator && root.navigator.clipboard && root.navigator.clipboard.writeText) {
      root.navigator.clipboard.writeText(value).then(function () { showToast(label || "Copied"); });
      return;
    }
    var area = doc.createElement("textarea");
    area.value = value;
    area.style.position = "fixed";
    area.style.left = "-9999px";
    doc.body.appendChild(area);
    area.select();
    try { doc.execCommand("copy"); showToast(label || "Copied"); }
    catch (_e) { showToast("Copy unavailable"); }
    doc.body.removeChild(area);
  }

  function renderStatus() {
    var holder = $("statusStrip");
    if (!holder) return;

    var aliases = state.aliases && Object.keys(state.aliases).length ? state.aliases : probeAliases();
    var summary = loadSummary();
    var target = getTargetAccess();
    var manifestObserved = inspectProductionManifest().filter(function (item) {
      return item.scriptInTarget || item.authorityObserved;
    }).length;

    var items = [
      ["Load", summary.allRequiredLoaded],
      ["Target", target.frameAccessible && target.routeConfirmed],
      ["North", aliases.NORTH && aliases.NORTH.present],
      ["East", aliases.EAST && aliases.EAST.present],
      ["Surface", aliases.SURFACE_TRUTH && aliases.SURFACE_TRUTH.present],
      ["South", aliases.SOUTH && aliases.SOUTH.present],
      ["Pointer", aliases.SOUTH_SURFACE_POINTER && aliases.SOUTH_SURFACE_POINTER.present],
      ["LabWest", aliases.LABWEST && aliases.LABWEST.present],
      ["West", aliases.WEST_DIAGNOSTIC && aliases.WEST_DIAGNOSTIC.present],
      ["Manifest", manifestObserved > 0]
    ];

    holder.innerHTML = items.map(function (item) {
      var cls = item[1] ? "good" : "warn";
      return '<div class="status-chip-mini ' + cls + '"><b>' +
        escapeHtml(item[0]) + '</b><span>' + (item[1] ? "FOUND" : "HELD") + '</span></div>';
    }).join("");
  }

  function renderManifestPanel() {
    var grid = $("manifestGrid");
    if (!grid) return;

    var manifest = inspectProductionManifest();
    grid.innerHTML = manifest.map(function (item) {
      var found = item.scriptInTarget || item.authorityObserved;
      var cls = found ? "good" : item.required ? "bad" : "warn";
      return '<div class="manifest-card ' + cls + '">' +
        '<b>' + escapeHtml(item.key) + '</b>' +
        '<span>' + (found ? "OBSERVED" : "HELD") + '</span></div>';
    }).join("");
  }

  function toggleTarget() {
    state.targetVisible = !state.targetVisible;
    persistState();
    var panel = $("targetPanel");
    if (panel) panel.hidden = !state.targetVisible;
    renderStatus();
  }

  function toggleManifest() {
    state.manifestVisible = !state.manifestVisible;
    persistState();
    var panel = $("manifestPanel");
    if (panel) panel.hidden = !state.manifestVisible;
    if (state.manifestVisible) renderManifestPanel();
    renderStatus();
  }

  function toggleRaw() {
    var raw = $("rawOutput");
    if (raw) raw.hidden = !raw.hidden;
  }

  function showToast(message) {
    var toast = $("toast");
    if (!toast) return;
    toast.textContent = safeString(message, "Done");
    toast.classList.add("show");
    root.setTimeout(function () { toast.classList.remove("show"); }, 1200);
  }

  function bind(id, eventName, handler) {
    var node = $(id);
    if (node) node.addEventListener(eventName, handler);
  }

  function installActions() {
    bind("categoryDropdownButton", "click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      toggleMenu("categoryDropdownMenu", "categoryDropdownButton");
    });

    bind("auditDropdownButton", "click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      toggleMenu("auditDropdownMenu", "auditDropdownButton");
    });

    bind("categoryDropdownMenu", "click", function (event) {
      var button = event.target.closest("[data-category-id]");
      if (!button) return;
      state.activeSection = button.dataset.categoryId;
      state.activeAudit = firstAudit(state.activeSection);
      persistState();
      closeAllMenus();
      renderDropdowns();
      clearReportSilent();
    });

    bind("auditDropdownMenu", "click", function (event) {
      var button = event.target.closest("[data-audit-id]");
      if (!button) return;
      state.activeAudit = button.dataset.auditId;
      state.activeSection = auditById(state.activeAudit).section;
      persistState();
      closeAllMenus();
      renderDropdowns();
      clearReportSilent();
    });

    doc.addEventListener("click", function (event) {
      var category = $("categoryDropdown");
      var audit = $("auditDropdown");
      if (category && category.contains(event.target)) return;
      if (audit && audit.contains(event.target)) return;
      closeAllMenus();
    });

    bind("createReport", "click", createReport);
    bind("runDirectReport", "click", runSelectedDirectCheck);
    bind("copyReport", "click", function () { if (!state.generatedText) createReport(); copyText(state.generatedText, "Report copied"); });
    bind("copyRaw", "click", function () { if (!state.rawText) createReport(); copyText(state.rawText, "Raw copied"); });
    bind("copyArchive", "click", function () {
      state.activeSection = "boundaryArchive";
      state.activeAudit = "deepArchive";
      persistState();
      renderDropdowns();
      var packet = buildReport("deepArchive");
      renderReport(packet, "DEEP_ARCHIVE_CREATED");
      copyText(rawJson(packet), "Deep archive copied");
    });
    bind("resetReport", "click", clearReport);
    bind("toggleRaw", "click", toggleRaw);
    bind("toggleTarget", "click", toggleTarget);
    bind("toggleManifest", "click", toggleManifest);
    bind("createManifestReport", "click", function () {
      state.activeSection = "boundaryArchive";
      state.activeAudit = "productionManifest";
      persistState();
      renderDropdowns();
      renderReport(buildReport("productionManifest"), "MANIFEST_REPORT_CREATED");
    });
    bind("returnToHearth", "click", function () { root.location.href = TARGET_ROUTE; });
    bind("reloadChamber", "click", function () { root.location.reload(); });
    bind("hearthDiagnosticTargetFrame", "load", function () {
      renderManifestPanel();
      renderStatus();
    });
  }

  function clearReportSilent() {
    state.generatedText = "";
    state.rawText = "";
    setText("reportTitle", "No Report Created");
    setText("reportMeta", "WAITING");
    setText("generatedReport", "Choose a category, choose an audit, then create a report.");
    setText("rawReport", "");
    ["copyReport", "copyRaw"].forEach(function (id) {
      var button = $(id);
      if (button) button.disabled = true;
    });
  }

  function publishApi() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    var api = {
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      version: VERSION,
      state: state,
      sections: SECTIONS,
      audits: AUDITS,
      productionManifest: PRODUCTION_MANIFEST,
      createReport: createReport,
      runSelectedDirectCheck: runSelectedDirectCheck,
      buildReport: buildReport,
      probeAliases: probeAliases,
      getTargetAccess: getTargetAccess,
      inspectProductionManifest: inspectProductionManifest,
      loadParticipants: loadParticipants,
      goToHearth: function () { root.location.href = TARGET_ROUTE; }
    };

    root.HEARTH_DIAGNOSTIC_CHAMBER = api;
    root.HEARTH.diagnosticChamber = api;
    root.DEXTER_LAB.hearthDiagnosticChamber = api;

    root.__HEARTH_DIAGNOSTIC_CHAMBER_LOADED__ = true;
    root.__HEARTH_DIAGNOSTIC_CHAMBER_INTERNAL_RENEWAL_CONTRACT__ = INTERNAL_RENEWAL_CONTRACT;
    root.__HEARTH_DIAGNOSTIC_RETURN_TO_HEARTH_ACTIVE__ = true;
    root.__HEARTH_DIAGNOSTIC_PRODUCTION_MANIFEST_AWARENESS_ACTIVE__ = true;
    root.__HEARTH_DIAGNOSTIC_CHAMBER_PRODUCTION_MUTATION_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_CHAMBER_CANVAS_BUILD_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_CHAMBER_CANVAS_RELEASE_AUTHORIZED__ = false;
  }

  function boot() {
    normalizeState();
    persistState();

    setText("controllerContract", INTERNAL_RENEWAL_CONTRACT);

    installActions();
    renderDropdowns();
    clearReportSilent();
    renderStatus();
    publishApi();

    var targetPanel = $("targetPanel");
    if (targetPanel) targetPanel.hidden = !state.targetVisible;

    var manifestPanel = $("manifestPanel");
    if (manifestPanel) manifestPanel.hidden = !state.manifestVisible;

    if (state.manifestVisible) renderManifestPanel();

    loadParticipants().then(function () {
      renderStatus();
      renderManifestPanel();
      publishApi();
    });
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(typeof window !== "undefined" ? window : globalThis);

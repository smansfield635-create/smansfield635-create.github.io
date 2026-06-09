// /showroom/globe/hearth/diagnostic/index.js
// HEARTH_DIAGNOSTIC_ROUTE_MIRRORLAND_ORBIT_WORKBENCH_BUTTON_CONTROLLER_TNT_v9_4_6
// Full-file replacement.
// JS only.
// Owns: dropdown behavior, audit state, reports, copy controls, participant loading,
// alias probing, target access, direct checks, status strip, return-to-orbit shell action.
// No production, canvas, controls, runtime-route, target-renderer, WebGL, GraphicBox,
// generated-image, or visual-pass authorization.

(function hearthDiagnosticMirrorlandOrbitWorkbench(global) {
  "use strict";

  var root = global || window;
  var doc = root.document;
  if (!doc) return;

  var CONTRACT = "HEARTH_DIAGNOSTIC_ROUTE_PLANET_PRODUCTION_FACILITY_INSTRUMENT_CHAMBER_TNT_v8";
  var RECEIPT = "HEARTH_DIAGNOSTIC_ROUTE_PLANET_PRODUCTION_FACILITY_INSTRUMENT_CHAMBER_RECEIPT_v8";

  var INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_ROUTE_MIRRORLAND_ORBIT_WORKBENCH_BUTTON_CONTROLLER_TNT_v9_4_6";
  var INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_ROUTE_MIRRORLAND_ORBIT_WORKBENCH_BUTTON_CONTROLLER_RECEIPT_v9_4_6";

  var HTML_SHELL_CONTRACT =
    "HEARTH_DIAGNOSTIC_ROUTE_MIRRORLAND_ORBIT_WORKBENCH_STATIC_SHELL_TNT_v9_4_6";
  var CSS_CONTRACT =
    "HEARTH_DIAGNOSTIC_ROUTE_SINGLE_AUDIT_WORKBENCH_STYLE_TNT_v9_4_6";

  var PREVIOUS_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_ROUTE_SINGLE_AUDIT_WORKBENCH_BUTTON_CONTROLLER_TNT_v9_4_5";

  var VERSION =
    "2026-06-09.hearth-diagnostic-route-mirrorland-orbit-workbench-button-controller-v9-4-6";

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
    LAB_NORTH: ["LAB_RUNTIME_TABLE", "RUNTIME_TABLE", "LAB_RUNTIME_TABLE_NORTH", "HEARTH_NORTH_COMMAND_RUNTIME_TABLE", "DEXTER_LAB.runtimeTable", "HEARTH.runtimeTable"],
    LAB_EAST: ["LAB_RUNTIME_TABLE_EAST", "LAB_RUNTIME_TABLE_EAST_F3", "RUNTIME_TABLE_EAST", "EAST_INTAKE_VALVE", "EAST_SUPREME_JUDGE", "DEXTER_LAB.runtimeTableEast", "HEARTH.runtimeTableEast"],
    LAB_SOUTH: ["LAB_RUNTIME_TABLE_SOUTH", "LAB_RUNTIME_TABLE_SOUTH_F8", "RUNTIME_TABLE_SOUTH", "SOUTH_PROOF_RETURN", "SOUTH_SUPREME_JUDGE", "DEXTER_LAB.runtimeTableSouth", "HEARTH.runtimeTableSouth"],
    LABWEST: ["LAB_RUNTIME_TABLE_WEST", "LAB_RUNTIME_TABLE_WEST_F5", "RUNTIME_TABLE_WEST", "WEST_PRESSURE_ADMISSIBILITY", "WEST_SUPREME_JUDGE", "DEXTER_LAB.runtimeTableWest", "HEARTH.runtimeTableWest"],
    NORTH: ["JUDGE_NORTH", "HEARTH_DIAGNOSTIC_RAIL_NORTH", "HEARTH_DIAGNOSTIC_RAIL", "HEARTH.diagnosticRail", "HEARTH.diagnosticNorth", "DEXTER_LAB.hearthDiagnosticRail"],
    EAST: ["JUDGE_EAST", "HEARTH_DIAGNOSTIC_RAIL_EAST", "HEARTH.diagnosticEast", "HEARTH.diagnosticRailEast", "DEXTER_LAB.hearthDiagnosticEast"],
    EAST_PROBE: ["HEARTH_DIAGNOSTIC_PROBE_EAST", "HEARTH.diagnosticProbeEast", "DEXTER_LAB.diagnosticProbeEast"],
    SURFACE_TRUTH: ["HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH", "HEARTH_CANVAS_SURFACE_TRUTH_PROBE", "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE", "HEARTH.diagnosticProbeCanvasSurfaceTruth", "HEARTH.canvasSurfaceTruthProbe", "DEXTER_LAB.canvasSurfaceTruthProbe"],
    SOUTH: ["JUDGE_SOUTH", "HEARTH_DIAGNOSTIC_RAIL_SOUTH", "HEARTH.diagnosticSouth", "HEARTH.diagnosticRailSouth", "DEXTER_LAB.hearthDiagnosticSouth"],
    SOUTH_SURFACE_POINTER: ["HEARTH.southSurfacePointerSidecar", "HEARTH.SOUTH_SURFACE_POINTER_SIDECAR", "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_SIDECAR", "DEXTER_LAB.southSurfacePointerSidecar"],
    WEST_DIAGNOSTIC: ["HEARTH.diagnosticWest", "HEARTH.diagnosticRailWest", "DEXTER_LAB.hearthDiagnosticWest", "HEARTH_DIAGNOSTIC_WEST", "HEARTH_DIAGNOSTIC_RAIL_WEST"]
  };

  var AUDIT_SECTIONS = [
    { id: "chamberReceiver", label: "Chamber / Receiver", hint: "Receiver and chamber condition", audits: ["chamberIndex", "receiverHealth", "targetAccess", "loadSequence", "aliasMap"] },
    { id: "cardinalLab", label: "Cardinal / Lab", hint: "North, East, South, West calibration", audits: ["northSignal", "eastSource", "southLens", "southSurfacePointer", "labWestGate", "westDiagnostic"] },
    { id: "sourceSurface", label: "Source / Surface", hint: "Source and surface access", audits: ["eastSourceDetail", "surfaceTruthDetail", "targetSurfaceAccess", "canvasBoundary"] },
    { id: "directExecution", label: "Direct Execution", hint: "Explicit direct checks only", audits: ["northDirect", "eastDirect", "surfaceTruthDirect", "southDirect", "westDirect"] },
    { id: "boundaryArchive", label: "Boundary / Archive", hint: "No-touch proof and archive", audits: ["noTouchBoundary", "nextMove", "deepArchive"] }
  ];

  var AUDITS = {
    chamberIndex: { seq: "00", section: "chamberReceiver", label: "Chamber Index", type: "safe", summary: "Creates a complete chamber index with current target, section, load, and audit availability." },
    receiverHealth: { seq: "01", section: "chamberReceiver", label: "Receiver Health", type: "safe", summary: "Checks participant loading, receiver readiness, and chamber health." },
    targetAccess: { seq: "02", section: "chamberReceiver", label: "Target Access", type: "safe", summary: "Checks the target frame and route access without mutation." },
    loadSequence: { seq: "03", section: "chamberReceiver", label: "Load Sequence", type: "safe", summary: "Reports participant script load order, status, required flags, and timing." },
    aliasMap: { seq: "04", section: "chamberReceiver", label: "Alias Map / Receiver Alignment", type: "safe", summary: "Reports authority aliases and receiver alignment." },

    northSignal: { seq: "05", section: "cardinalLab", label: "North Signal", type: "safe", summary: "Reports North diagnostic authority presence." },
    eastSource: { seq: "06", section: "cardinalLab", label: "East Source", type: "safe", summary: "Reports East rail, East probe, and Lab East intake state." },
    southLens: { seq: "07", section: "cardinalLab", label: "South Lens", type: "safe", summary: "Reports South diagnostic authority and South proof-return status." },
    southSurfacePointer: { seq: "08A", section: "cardinalLab", label: "South Surface Pointer", type: "safe", summary: "Reports South surface pointer sidecar presence." },
    labWestGate: { seq: "09A", section: "cardinalLab", label: "LabWest Gate", type: "safe", summary: "Reports LabWest admissibility gate presence." },
    westDiagnostic: { seq: "10A", section: "cardinalLab", label: "West Diagnostic", type: "safe", summary: "Reports West diagnostic participant presence." },

    eastSourceDetail: { seq: "11", section: "sourceSurface", label: "East Source Detail", type: "safe", summary: "Creates a detailed East source report." },
    surfaceTruthDetail: { seq: "12", section: "sourceSurface", label: "Surface Truth Detail", type: "safe", summary: "Creates a detailed Surface Truth report without canvas mutation." },
    targetSurfaceAccess: { seq: "13A", section: "sourceSurface", label: "Target Surface Access", type: "safe", summary: "Reports target iframe access and surface-observation boundary." },
    canvasBoundary: { seq: "14A", section: "sourceSurface", label: "Canvas Boundary", type: "safe", summary: "Reports the no-touch canvas boundary." },

    northDirect: { seq: "15", section: "directExecution", label: "North Direct + Alias Probe", type: "direct", directKey: "northDirect", summary: "Creates a direct-check preview for North." },
    eastDirect: { seq: "16", section: "directExecution", label: "East Direct", type: "direct", directKey: "eastDirect", summary: "Creates a direct-check preview for East." },
    surfaceTruthDirect: { seq: "17", section: "directExecution", label: "Surface Truth Direct", type: "direct", directKey: "surfaceTruthDirect", summary: "Creates a direct-check preview for Surface Truth." },
    southDirect: { seq: "18", section: "directExecution", label: "South Direct", type: "direct", directKey: "southDirect", summary: "Creates a direct-check preview for South." },
    westDirect: { seq: "19", section: "directExecution", label: "West Diagnostic Direct", type: "direct", directKey: "westDirect", summary: "Creates a direct-check preview for West." },

    noTouchBoundary: { seq: "20", section: "boundaryArchive", label: "No-Touch Boundary", type: "safe", summary: "Reports the production, canvas, controls, runtime-route, and renderer no-touch boundary." },
    nextMove: { seq: "21", section: "boundaryArchive", label: "Next Move", type: "safe", summary: "Creates the next lawful move synthesis." },
    deepArchive: { seq: "99", section: "boundaryArchive", label: "Deep Archive", type: "safe", summary: "Creates the full diagnostic archive for copying and transfer." }
  };

  var DIRECT_CONFIG = {
    northDirect: { directSeq: "08", role: "NORTH_DIRECT_CHECK_ALIAS_PROBE", component: "NORTH", authorityPath: "JUDGE_NORTH", aliases: ALIASES.NORTH, methods: ["run", "runDiagnostic", "runNorthDiagnostic", "inspect", "getReport", "getReceipt"] },
    eastDirect: { directSeq: "09", role: "EAST_DIRECT_CHECK", component: "EAST", authorityPath: "JUDGE_EAST", aliases: ALIASES.EAST, methods: ["run", "runDiagnostic", "runEastSourceRead", "inspect", "getReport", "getReceipt"] },
    surfaceTruthDirect: { directSeq: "10", role: "SURFACE_TRUTH_DIRECT_CHECK", component: "SURFACE_TRUTH", authorityPath: "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH", aliases: ALIASES.SURFACE_TRUTH, methods: ["run", "runDiagnostic", "runSurfaceTruth", "runCanvasSurfaceTruth", "runProbe", "measure", "inspect", "getReport", "getReceipt"] },
    southDirect: { directSeq: "11", role: "SOUTH_DIRECT_CHECK", component: "SOUTH", authorityPath: "HEARTH_DIAGNOSTIC_RAIL_SOUTH", aliases: ALIASES.SOUTH, methods: ["run", "runDiagnostic", "runSouth", "runSouthDiagnostic", "runPacketOutput", "inspect", "getReport", "getReceipt"] },
    westDirect: { directSeq: "12", role: "WEST_DIAGNOSTIC_DIRECT_CHECK", component: "WEST_DIAGNOSTIC", authorityPath: "HEARTH.diagnosticWest", aliases: ALIASES.WEST_DIAGNOSTIC, methods: ["run", "runDiagnostic", "runWestDiagnostic", "inspect", "getReport", "getReceipt"] }
  };

  var state = {
    initializedAt: nowIso(),
    updatedAt: nowIso(),
    activeSection: readSession("activeSection", "chamberReceiver"),
    activeAudit: readSession("activeAudit", "chamberIndex"),
    participantLoad: [],
    loadStarted: false,
    loadComplete: false,
    aliases: {},
    directResults: {},
    generatedPacket: null,
    generatedText: "",
    rawText: "",
    generatedAuditId: "",
    targetVisible: readSession("targetVisible", "false") === "true"
  };

  function $(id) { return doc.getElementById(id); }
  function nowIso() { try { return new Date().toISOString(); } catch (_e) { return ""; } }
  function isObject(v) { return Boolean(v && typeof v === "object" && !Array.isArray(v)); }
  function isFunction(v) { return typeof v === "function"; }
  function safeString(v, f) { if (f === undefined) f = ""; return v === undefined || v === null ? f : String(v); }
  function compact(v, limit) { return safeString(v).replace(/\s+/g, " ").trim().slice(0, limit || 28000); }

  function readSession(key, fallback) {
    try { return root.sessionStorage.getItem("hearthDiagnostic.v946." + key) || fallback; }
    catch (_e) { return fallback; }
  }

  function writeSession(key, value) {
    try { root.sessionStorage.setItem("hearthDiagnostic.v946." + key, safeString(value)); }
    catch (_e) {}
  }

  function readPath(path) {
    var parts = safeString(path).replace(/^window\./, "").split(".").filter(Boolean);
    var cursor = root;
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

  function sectionExists(id) { return AUDIT_SECTIONS.some(function (s) { return s.id === id; }); }
  function auditExists(id) { return Boolean(AUDITS[id]); }
  function getSection(id) { return AUDIT_SECTIONS.find(function (s) { return s.id === id; }) || AUDIT_SECTIONS[0]; }
  function firstAuditForSection(id) { return getSection(id).audits[0] || "chamberIndex"; }

  function normalizeState() {
    if (!sectionExists(state.activeSection)) state.activeSection = "chamberReceiver";
    if (!auditExists(state.activeAudit) || AUDITS[state.activeAudit].section !== state.activeSection) {
      state.activeAudit = firstAuditForSection(state.activeSection);
    }
  }

  function persistState() {
    normalizeState();
    writeSession("activeSection", state.activeSection);
    writeSession("activeAudit", state.activeAudit);
    writeSession("targetVisible", state.targetVisible ? "true" : "false");
  }

  function escapeHtml(value) {
    return safeString(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setText(id, value) {
    var node = $(id);
    if (node) node.textContent = safeString(value);
  }

  function probeAlias(alias) {
    var value = readPath(alias);
    var found = value !== null && value !== undefined;
    var methods = methodKeys(value);
    return {
      alias: alias,
      found: found,
      valueType: found ? typeof value : "undefined",
      methodCount: methods.length,
      methodKeys: methods.join(","),
      contract: found && isObject(value) ? safeString(value.CONTRACT || value.contract || "UNKNOWN") : "UNKNOWN",
      receipt: found && isObject(value) ? safeString(value.RECEIPT || value.receipt || "UNKNOWN") : "UNKNOWN",
      internalRenewalContract: found && isObject(value) ? safeString(value.INTERNAL_RENEWAL_CONTRACT || value.internalRenewalContract || "UNKNOWN") : "UNKNOWN"
    };
  }

  function probeAliases() {
    var output = {};
    Object.keys(ALIASES).forEach(function (group) {
      var probes = ALIASES[group].map(probeAlias);
      var first = probes.find(function (p) { return p.found; });
      output[group] = {
        label: group,
        present: Boolean(first),
        authorityPath: first ? first.alias : "NONE",
        valueType: first ? first.valueType : "undefined",
        methodCount: first ? first.methodCount : 0,
        methodKeys: first ? first.methodKeys : "",
        probe: probes
      };
    });
    state.aliases = output;
    state.updatedAt = nowIso();
    return output;
  }

  function findScript(path) {
    var scripts = Array.prototype.slice.call(doc.querySelectorAll("script[src]"));
    return scripts.find(function (script) {
      var src = script.getAttribute("src") || script.src || "";
      return src.indexOf(path) !== -1;
    }) || null;
  }

  function recordParticipant(result) {
    var existing = state.participantLoad.find(function (item) { return item.path === result.path; });
    if (existing) Object.assign(existing, result);
    else state.participantLoad.push(result);
    state.updatedAt = nowIso();
    renderStatus();
  }

  function loadParticipant(entry) {
    return new Promise(function (resolve) {
      var existing = findScript(entry.path);
      if (existing) {
        var reused = Object.assign({}, entry, {
          status: "loaded",
          src: existing.getAttribute("src") || existing.src || entry.path,
          reused: true,
          settledAt: nowIso()
        });
        recordParticipant(reused);
        resolve(reused);
        return;
      }

      var script = doc.createElement("script");
      var finished = false;

      function finish(status) {
        if (finished) return;
        finished = true;
        var result = Object.assign({}, entry, {
          status: status,
          src: entry.path,
          reused: false,
          settledAt: nowIso()
        });
        recordParticipant(result);
        resolve(result);
      }

      script.src = entry.path;
      script.defer = true;
      script.dataset.hearthDiagnosticParticipant = "true";
      script.dataset.hearthDiagnosticParticipantRole = entry.role;
      script.dataset.hearthDiagnosticRequired = entry.required ? "true" : "false";
      script.dataset.hearthDiagnosticController = INTERNAL_RENEWAL_CONTRACT;

      script.onload = function () { finish("loaded"); };
      script.onerror = function () { finish(entry.required ? "error_required" : "error_optional"); };

      root.setTimeout(function () {
        finish(entry.required ? "timeout_required" : "timeout_optional");
      }, 4500);

      doc.head.appendChild(script);
    });
  }

  function loadParticipants() {
    state.loadStarted = true;
    state.loadComplete = false;
    renderStatus();

    var chain = Promise.resolve();
    PARTICIPANTS.forEach(function (entry) {
      chain = chain.then(function () { return loadParticipant(entry); });
    });

    return chain.then(function () {
      state.loadComplete = true;
      state.updatedAt = nowIso();
      probeAliases();
      renderStatus();
      publishApi();
      return state.participantLoad;
    });
  }

  function loadSummary() {
    var required = state.participantLoad.filter(function (p) { return p.required; });
    var requiredBad = required.filter(function (p) { return p.status !== "loaded"; });
    var optionalBad = state.participantLoad.filter(function (p) { return !p.required && p.status !== "loaded"; });

    return {
      requiredCount: required.length,
      requiredBadCount: requiredBad.length,
      optionalBadCount: optionalBad.length,
      allRequiredLoaded: state.loadComplete && requiredBad.length === 0,
      allLoaded: state.participantLoad.length > 0 && state.participantLoad.every(function (p) { return p.status === "loaded"; })
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

  function getSelectedContext() {
    normalizeState();
    var audit = AUDITS[state.activeAudit];
    var section = getSection(audit.section);
    return {
      ok: true,
      resolvedFrom: "BUTTON_CONTROLLER_STATE",
      selectedSectionId: section.id,
      selectedSectionLabel: section.label,
      selectedAuditId: state.activeAudit,
      selectedAuditLabel: audit.label,
      selectedAuditSequence: audit.seq,
      selectedAuditType: audit.type,
      audit: audit,
      section: section
    };
  }

  function lineValue(value) {
    if (value === undefined || value === null || value === "") return "UNKNOWN";
    if (isFunction(value)) return "[function]";
    if (Array.isArray(value) || isObject(value)) {
      try { return compact(JSON.stringify(value, function (_k, item) { return isFunction(item) ? "[function]" : item; })); }
      catch (_e) { return "[object]"; }
    }
    return safeString(value);
  }

  function packetText(packet) {
    return Object.keys(packet || {}).map(function (key) {
      return key + "=" + lineValue(packet[key]);
    }).join("\n");
  }

  function rawJson(packet) {
    try {
      return JSON.stringify(packet, function (_key, value) {
        return isFunction(value) ? "[function]" : value;
      }, 2);
    } catch (_e) {
      return packetText(packet);
    }
  }

  function basePacket(seq, label, component, extra) {
    var ctx = getSelectedContext();
    var packet = {
      PACKET: "HEARTH_DIAGNOSTIC_WORKBENCH_REPORT_" + safeString(seq).replace(/[^A-Z0-9]/gi, "_") + "_v9_4_6",
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
      WORKBENCH_MODEL: "MIRRORLAND_CATEGORY_GEM_AUDIT_GEM_LOCAL_REPORT_ACTIONS",
      REPORT_SOURCE_OF_TRUTH: "BUTTON_CONTROLLER_STATE",
      SELECTED_CATEGORY_ID: ctx.selectedSectionId,
      SELECTED_CATEGORY_LABEL: ctx.selectedSectionLabel,
      SELECTED_AUDIT_ID: ctx.selectedAuditId,
      SELECTED_AUDIT_LABEL: ctx.selectedAuditLabel,
      SELECTED_AUDIT_SEQUENCE: ctx.selectedAuditSequence,
      RESOLVED_FROM: ctx.resolvedFrom,
      BUTTON_CONTROLLER_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      BUTTON_CONTROLLER_BOOTED: true,
      DROPDOWN_BINDINGS_INSTALLED: true,
      RETURN_TO_ORBIT_BINDING_INSTALLED: true,
      RUN_STATE: "REPORT_CREATED",
      TRUST_STATE: "CURRENT",
      BLOCKING: false,
      UPDATED_AT: nowIso()
    };

    Object.assign(packet, extra || {});
    Object.assign(packet, NO_CLAIMS);
    return packet;
  }

  function aliasReport(audit, auditId, component, groups, extra) {
    var aliases = probeAliases();
    var payload = {
      AUDIT_ID: auditId,
      COMPONENT_SCOPE: component,
      GROUPS_TESTED: groups.join(",")
    };

    groups.forEach(function (group) {
      var item = aliases[group] || {};
      payload[group + "_PRESENT"] = Boolean(item.present);
      payload[group + "_AUTHORITY_PATH"] = item.authorityPath || "NONE";
      payload[group + "_VALUE_TYPE"] = item.valueType || "undefined";
      payload[group + "_METHOD_COUNT"] = item.methodCount || 0;
      payload[group + "_METHOD_KEYS"] = item.methodKeys || "";
      payload[group + "_PROBE"] = item.probe || [];
    });

    Object.assign(payload, extra || {});
    return basePacket(audit.seq, audit.label, component, payload);
  }

  function boundaryReport(audit, auditId, component) {
    return basePacket(audit.seq, audit.label, component, {
      AUDIT_ID: auditId,
      PRODUCTION_MUTATION_AUTHORIZED: false,
      CANVAS_REPAIR_AUTHORIZED: false,
      CANVAS_BUILD_AUTHORIZED: false,
      CANVAS_RELEASE_AUTHORIZED: false,
      CONTROLS_REPAIR_AUTHORIZED: false,
      RUNTIME_RESTART_AUTHORIZED: false,
      ROUTE_REPAIR_AUTHORIZED: false,
      TARGET_ROUTE_RENDERER_MUTATION_AUTHORIZED: false,
      F13_CLAIMED: false,
      F21_CLAIMED: false,
      VISUAL_PASS_CLAIMED: false,
      BOUNDARY_REASON: "DIAGNOSTIC_REPORT_ONLY_NO_PRODUCTION_ACTION_AUTHORIZED",
      NEXT_ACTION: "COPY_BOUNDARY_REPORT_OR_CREATE_NEXT_MOVE"
    });
  }

  function resolveAuthority(config) {
    var candidates = [];
    (config.aliases || []).forEach(function (alias) {
      var value = readPath(alias);
      var probe = probeAlias(alias);
      if (!probe.found) return;

      var score = 0;
      if (alias === config.authorityPath) score += 20;
      if (isObject(value)) score += 10;
      if (isFunction(value)) score += 5;
      if (methodKeys(value).length) score += 30;
      (config.methods || []).forEach(function (method) {
        if (value && isFunction(value[method])) score += 100;
      });

      candidates.push({ alias: alias, value: value, probe: probe, score: score });
    });

    candidates.sort(function (a, b) { return b.score - a.score; });

    return {
      authority: candidates[0] ? candidates[0].value : null,
      authorityPath: candidates[0] ? candidates[0].alias : config.authorityPath,
      present: Boolean(candidates[0]),
      candidates: candidates.map(function (c) {
        return {
          alias: c.alias,
          score: c.score,
          valueType: c.probe.valueType,
          methodCount: c.probe.methodCount,
          methodKeys: c.probe.methodKeys,
          contract: c.probe.contract,
          receipt: c.probe.receipt,
          internalRenewalContract: c.probe.internalRenewalContract
        };
      }),
      probes: (config.aliases || []).map(probeAlias)
    };
  }

  function getReadableReceipt(authority) {
    if (!authority || !isObject(authority)) return {};
    var methods = ["getReceiptLight", "getCallableReceiptLight", "getReport", "getReceipt", "getStatus", "getState"];
    for (var i = 0; i < methods.length; i += 1) {
      if (!isFunction(authority[methods[i]])) continue;
      try {
        var out = authority[methods[i]]();
        if (isObject(out)) return out;
      } catch (_e) {}
    }
    return authority;
  }

  function runDirectCheck(key) {
    var config = DIRECT_CONFIG[key];
    var audit = AUDITS[key];
    if (!config || !audit) return basePacket("ERR", "Direct Config Missing", "ERROR", { AUDIT_ID: key || "UNKNOWN", BLOCKING: true });

    var resolved = resolveAuthority(config);
    var authority = resolved.authority;
    var directPacket = null;
    var runExecuted = false;
    var directMethod = "NONE";
    var directError = "NONE";

    if (authority) {
      for (var i = 0; i < config.methods.length; i += 1) {
        var method = config.methods[i];
        if (isObject(authority) && isFunction(authority[method])) {
          try {
            directMethod = method;
            directPacket = authority[method]();
            runExecuted = true;
            break;
          } catch (caught) {
            directMethod = method;
            directError = caught && caught.message ? caught.message : String(caught);
            break;
          }
        }
      }
      if (!directPacket || !isObject(directPacket)) directPacket = getReadableReceipt(authority);
    }

    var packet = basePacket(audit.seq, audit.label, config.component, {
      RECEIPT_LEVEL: "3_DIRECT_EXECUTION",
      AUDIT_ID: key,
      AUDIT_SECTION: audit.section,
      AUDIT_TYPE: "DIRECT",
      DIRECT_RECEIPT_SEQUENCE: config.directSeq,
      ROLE: config.role,
      SCOPE: "ONE_COMPONENT_DIRECT_EXECUTION",
      RUN_STATE: runExecuted ? "DIRECT_RUN_EXECUTED" : resolved.present ? "AUTHORITY_FOUND_NOT_RUN" : "AUTHORITY_NOT_FOUND",
      TRUST_STATE: resolved.present ? "AUTHORITY_FOUND" : "AUTHORITY_NOT_FOUND",
      RUN_EXECUTED: runExecuted,
      DIRECT_AUTHORITY_PATH: resolved.authorityPath,
      DIRECT_STATUS: runExecuted ? "DIRECT_RUN_EXECUTED" : resolved.present ? "AUTHORITY_FOUND_NOT_RUN" : "AUTHORITY_NOT_FOUND",
      DIRECT_METHOD: directMethod,
      DIRECT_ERROR: directError,
      AUTHORITY_METHOD_COUNT: methodKeys(authority).length,
      AUTHORITY_METHOD_KEYS: methodKeys(authority).join(","),
      RESOLVER_CANDIDATES: resolved.candidates,
      DIRECT_PACKET_KEYS: directPacket && isObject(directPacket) ? Object.keys(directPacket).join(",") : "",
      DIRECT_PACKET: directPacket && isObject(directPacket) ? directPacket : {},
      ALIAS_PROBE: resolved.probes,
      NEXT_ACTION: runExecuted ? "COPY_REPORT_OR_RUN_NEXT_AUDIT" : "INSPECT_AUTHORITY_AND_METHOD_SURFACE"
    });

    state.directResults[key] = packet;
    return packet;
  }

  function directPreview(key) {
    var config = DIRECT_CONFIG[key];
    var audit = AUDITS[key];
    var resolved = resolveAuthority(config);

    return basePacket(audit.seq, audit.label, config.component, {
      RECEIPT_LEVEL: "3_DIRECT_PREVIEW",
      AUDIT_ID: key,
      AUDIT_SECTION: audit.section,
      AUDIT_TYPE: "DIRECT_PREVIEW",
      DIRECT_RECEIPT_SEQUENCE: config.directSeq,
      ROLE: config.role,
      RUN_STATE: "DIRECT_PREVIEW_NOT_EXECUTED",
      TRUST_STATE: resolved.present ? "AUTHORITY_FOUND" : "AUTHORITY_NOT_FOUND",
      EXECUTION_REQUIRED: true,
      RUN_EXECUTED: false,
      DIRECT_AUTHORITY_PATH: resolved.authorityPath,
      AUTHORITY_METHOD_COUNT: methodKeys(resolved.authority).length,
      AUTHORITY_METHOD_KEYS: methodKeys(resolved.authority).join(","),
      RESOLVER_CANDIDATES: resolved.candidates,
      ALIAS_PROBE: resolved.probes,
      NEXT_ACTION: "CLICK_RUN_DIRECT_CHECK_TO_EXECUTE"
    });
  }

  function buildReport(auditId) {
    var audit = AUDITS[auditId];
    if (!audit) return basePacket("ERR", "Invalid Audit", "ERROR", { AUDIT_ID: auditId, BLOCKING: true });

    if (audit.type === "direct") return directPreview(audit.directKey);

    var aliases = probeAliases();
    var summary = loadSummary();
    var target = getTargetAccess();

    if (auditId === "chamberIndex") {
      return basePacket(audit.seq, audit.label, "CHAMBER", {
        RECEIPT_LEVEL: "1_CHAMBER_INDEX",
        AUDIT_ID: auditId,
        VERSION: VERSION,
        USER_FLOW: "CHOOSE_CATEGORY_GEM_CHOOSE_AUDIT_GEM_CREATE_REPORT_COPY_REPORT",
        LOAD_STARTED: state.loadStarted,
        LOAD_COMPLETE: state.loadComplete,
        ALL_REQUIRED_PARTICIPANTS_LOADED: summary.allRequiredLoaded,
        PARTICIPANT_LOAD_COUNT: state.participantLoad.length,
        SECTION_COUNT: AUDIT_SECTIONS.length,
        AUDIT_COUNT: Object.keys(AUDITS).length,
        NEXT_ACTION: "CHOOSE_AUDIT_AND_CREATE_REPORT"
      });
    }

    if (auditId === "receiverHealth") {
      return basePacket(audit.seq, audit.label, "RECEIVER", {
        AUDIT_ID: auditId,
        LOAD_STARTED: state.loadStarted,
        LOAD_COMPLETE: state.loadComplete,
        ALL_REQUIRED_PARTICIPANTS_LOADED: summary.allRequiredLoaded,
        REQUIRED_COUNT: summary.requiredCount,
        REQUIRED_BAD_COUNT: summary.requiredBadCount,
        OPTIONAL_BAD_COUNT: summary.optionalBadCount,
        NORTH_FOUND: aliases.NORTH.present,
        EAST_FOUND: aliases.EAST.present,
        SURFACE_TRUTH_FOUND: aliases.SURFACE_TRUTH.present,
        SOUTH_FOUND: aliases.SOUTH.present,
        LABWEST_FOUND: aliases.LABWEST.present,
        WEST_DIAGNOSTIC_FOUND: aliases.WEST_DIAGNOSTIC.present,
        RECEIVER_STATUS: summary.allRequiredLoaded ? "RECEIVER_READY" : "RECEIVER_LOAD_INCOMPLETE"
      });
    }

    if (auditId === "targetAccess") return basePacket(audit.seq, audit.label, "TARGET_ACCESS", Object.assign({ AUDIT_ID: auditId }, target));
    if (auditId === "loadSequence") return basePacket(audit.seq, audit.label, "PARTICIPANT_LOAD_SEQUENCE", { AUDIT_ID: auditId, PARTICIPANT_LOAD: state.participantLoad, LOAD_SUMMARY: summary });
    if (auditId === "aliasMap") return basePacket(audit.seq, audit.label, "ALIAS_MAP", { AUDIT_ID: auditId, ALIASES: aliases });

    if (auditId === "northSignal") return aliasReport(audit, auditId, "NORTH_SIGNAL", ["NORTH", "LAB_NORTH"]);
    if (auditId === "eastSource") return aliasReport(audit, auditId, "EAST_SOURCE", ["EAST", "EAST_PROBE", "LAB_EAST"]);
    if (auditId === "southLens") return aliasReport(audit, auditId, "SOUTH_LENS", ["SOUTH", "LAB_SOUTH"]);
    if (auditId === "southSurfacePointer") return aliasReport(audit, auditId, "SOUTH_SURFACE_POINTER", ["SOUTH_SURFACE_POINTER"]);
    if (auditId === "labWestGate") return aliasReport(audit, auditId, "LABWEST_GATE", ["LABWEST"]);
    if (auditId === "westDiagnostic") return aliasReport(audit, auditId, "WEST_DIAGNOSTIC", ["WEST_DIAGNOSTIC", "LABWEST"]);

    if (auditId === "eastSourceDetail") return aliasReport(audit, auditId, "EAST_SOURCE_DETAIL", ["EAST", "EAST_PROBE", "LAB_EAST"]);
    if (auditId === "surfaceTruthDetail") return aliasReport(audit, auditId, "SURFACE_TRUTH_DETAIL", ["SURFACE_TRUTH"], { CANVAS_MUTATION_AUTHORIZED: false, VISUAL_PASS_CLAIMED: false });
    if (auditId === "targetSurfaceAccess") return basePacket(audit.seq, audit.label, "TARGET_SURFACE_ACCESS", { AUDIT_ID: auditId, TARGET_ACCESS: target, SURFACE_TRUTH_PRESENT: aliases.SURFACE_TRUTH.present });
    if (auditId === "canvasBoundary") return boundaryReport(audit, auditId, "CANVAS_BOUNDARY");
    if (auditId === "noTouchBoundary") return boundaryReport(audit, auditId, "NO_TOUCH_BOUNDARY");

    if (auditId === "nextMove") {
      var directRun = Object.keys(state.directResults).filter(function (key) {
        return state.directResults[key] && state.directResults[key].RUN_EXECUTED;
      });

      return basePacket(audit.seq, audit.label, "NEXT_LAWFUL_MOVE", {
        RECEIPT_LEVEL: "4_SYNTHESIS",
        AUDIT_ID: auditId,
        DIRECT_CHECKS_RUN: directRun.length ? directRun.join(",") : "NONE",
        TARGET_ROUTE_RENDERER_MUTATION_AUTHORIZED: false,
        NEXT_FILE: "/showroom/globe/hearth/diagnostic/index.js",
        NEXT_ACTION: "CONTINUE_DIAGNOSTIC_EVIDENCE_BRIDGING_WITHOUT_PRODUCTION_MUTATION"
      });
    }

    if (auditId === "deepArchive") {
      return {
        PACKET: "HEARTH_DIAGNOSTIC_WORKBENCH_DEEP_ARCHIVE_99_v9_4_6",
        RECEIPT_LEVEL: "5_DEEP_ARCHIVE",
        AUDIT_SEQUENCE: audit.seq,
        AUDIT_LABEL: audit.label,
        AUDIT_ID: auditId,
        CONTRACT: CONTRACT,
        RECEIPT: RECEIPT,
        CSS_CONTRACT: CSS_CONTRACT,
        HTML_SHELL_CONTRACT: HTML_SHELL_CONTRACT,
        INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
        INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
        TARGET_ROUTE: TARGET_ROUTE,
        DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,
        WORKBENCH_MODEL: "MIRRORLAND_CATEGORY_GEM_AUDIT_GEM_LOCAL_REPORT_ACTIONS",
        STATE: {
          initializedAt: state.initializedAt,
          updatedAt: nowIso(),
          activeSection: state.activeSection,
          activeAudit: state.activeAudit,
          participantLoad: state.participantLoad,
          loadSummary: loadSummary(),
          targetAccess: getTargetAccess(),
          aliases: aliases,
          directResults: state.directResults,
          auditSections: AUDIT_SECTIONS,
          audits: AUDITS
        },
        NO_CLAIMS: NO_CLAIMS,
        UPDATED_AT: nowIso()
      };
    }

    return basePacket(audit.seq, audit.label, "UNKNOWN", { AUDIT_ID: auditId });
  }

  function renderCategoryDropdown() {
    var section = getSection(state.activeSection);
    var button = $("categoryDropdownButton");
    var menu = $("categoryDropdownMenu");

    setText("categoryDropdownLabel", section.label);
    setText("categoryDropdownMeta", section.hint);

    if (button) {
      button.dataset.value = section.id;
      button.setAttribute("aria-expanded", "false");
    }

    if (menu) {
      menu.classList.remove("is-open");
      menu.innerHTML = AUDIT_SECTIONS.map(function (item) {
        return '<button class="dropdown-option' + (item.id === state.activeSection ? " is-active" : "") +
          '" type="button" data-category-id="' + escapeHtml(item.id) + '">' +
          '<span>' + escapeHtml(item.label) + '</span><small>' + escapeHtml(item.hint) + '</small></button>';
      }).join("");
    }
  }

  function renderAuditDropdown() {
    var section = getSection(state.activeSection);
    var audit = AUDITS[state.activeAudit] || AUDITS[firstAuditForSection(section.id)];
    var button = $("auditDropdownButton");
    var menu = $("auditDropdownMenu");

    setText("auditDropdownLabel", audit.seq + " · " + audit.label);
    setText("auditDropdownMeta", (audit.type === "direct" ? "Direct" : "Safe") + " · " + audit.summary);

    if (button) {
      button.dataset.value = state.activeAudit;
      button.setAttribute("aria-expanded", "false");
    }

    if (menu) {
      menu.classList.remove("is-open");
      menu.innerHTML = section.audits.map(function (id) {
        var item = AUDITS[id];
        return '<button class="dropdown-option' + (id === state.activeAudit ? " is-active" : "") +
          '" type="button" data-audit-id="' + escapeHtml(id) + '">' +
          '<span>' + escapeHtml(item.seq + " · " + item.label) + '</span><small>' +
          escapeHtml((item.type === "direct" ? "Direct" : "Safe") + " · " + item.summary) +
          '</small></button>';
      }).join("");
    }
  }

  function renderSelectedAudit() {
    var ctx = getSelectedContext();
    setText("selectedAuditMeta", ctx.selectedAuditSequence + " · " + ctx.selectedAuditType.toUpperCase());
    setText("selectedSectionLabel", ctx.selectedSectionLabel);
    setText("selectedAuditTitle", ctx.selectedAuditLabel);
    setText("selectedAuditSummary", ctx.audit.summary);

    var runDirect = $("runDirectReport");
    if (runDirect) {
      runDirect.disabled = ctx.audit.type !== "direct";
      runDirect.hidden = ctx.audit.type !== "direct";
    }
  }

  function renderDropdowns() {
    normalizeState();
    renderCategoryDropdown();
    renderAuditDropdown();
    renderSelectedAudit();
  }

  function renderStatus() {
    var holder = $("statusStrip");
    if (!holder) return;

    var aliases = state.aliases && Object.keys(state.aliases).length ? state.aliases : probeAliases();
    var summary = loadSummary();
    var target = getTargetAccess();

    var items = [
      ["Load", summary.allRequiredLoaded],
      ["Target", target.frameAccessible && target.routeConfirmed],
      ["North", aliases.NORTH.present],
      ["East", aliases.EAST.present],
      ["Surface", aliases.SURFACE_TRUTH.present],
      ["South", aliases.SOUTH.present],
      ["Pointer", aliases.SOUTH_SURFACE_POINTER.present],
      ["LabWest", aliases.LABWEST.present],
      ["West", aliases.WEST_DIAGNOSTIC.present]
    ];

    holder.innerHTML = items.map(function (item) {
      var cls = item[1] ? "good" : "warn";
      return '<div class="status-chip-mini ' + cls + '"><b>' + escapeHtml(item[0]) +
        '</b><span>' + (item[1] ? "FOUND" : "HELD") + '</span></div>';
    }).join("");
  }

  function closeAllMenus() {
    ["categoryDropdownMenu", "auditDropdownMenu"].forEach(function (id) {
      var menu = $(id);
      if (menu) menu.classList.remove("is-open");
    });
    ["categoryDropdownButton", "auditDropdownButton"].forEach(function (id) {
      var btn = $(id);
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  }

  function toggleMenu(menuId, buttonId) {
    var menu = $(menuId);
    var open = menu && menu.classList.contains("is-open");
    closeAllMenus();
    if (!open && menu) {
      menu.classList.add("is-open");
      var button = $(buttonId);
      if (button) button.setAttribute("aria-expanded", "true");
    }
  }

  function clearReport() {
    state.generatedPacket = null;
    state.generatedText = "";
    state.rawText = "";
    state.generatedAuditId = "";
    setText("reportTitle", "No Report Created");
    setText("reportMeta", "WAITING");
    setText("generatedReport", "Choose a category, choose an audit, then create a report.");
    setText("rawReport", "");
    var copyReport = $("copyReport");
    var copyRaw = $("copyRaw");
    if (copyReport) copyReport.disabled = true;
    if (copyRaw) copyRaw.disabled = true;
    var rawOutput = $("rawOutput");
    if (rawOutput) rawOutput.hidden = true;
  }

  function renderReport(packet, mode, auditId) {
    var audit = AUDITS[auditId] || AUDITS[state.activeAudit];
    state.generatedPacket = packet;
    state.generatedAuditId = auditId || state.activeAudit;
    state.generatedText = packetText(packet);
    state.rawText = rawJson(packet);
    state.updatedAt = nowIso();

    setText("reportTitle", audit ? audit.label : "Workbench Report");
    setText("reportMeta", mode || "REPORT_CREATED");
    setText("generatedReport", state.generatedText);
    setText("rawReport", state.rawText);

    var output = $("reportOutput");
    var copyReport = $("copyReport");
    var copyRaw = $("copyRaw");
    if (output) output.hidden = false;
    if (copyReport) copyReport.disabled = false;
    if (copyRaw) copyRaw.disabled = false;
  }

  function createReport() {
    var ctx = getSelectedContext();
    var packet = buildReport(ctx.selectedAuditId);
    renderReport(packet, ctx.audit.type === "direct" ? "DIRECT_PREVIEW_CREATED" : "REPORT_CREATED", ctx.selectedAuditId);
    showToast("Report created");
    return packet;
  }

  function runSelectedDirectCheck() {
    var ctx = getSelectedContext();
    if (ctx.audit.type !== "direct") {
      showToast("Selected audit is not direct");
      return null;
    }
    var packet = runDirectCheck(ctx.audit.directKey);
    renderReport(packet, "DIRECT_CHECK_EXECUTED", ctx.selectedAuditId);
    showToast("Direct check complete");
    return packet;
  }

  function copyText(text, label) {
    var value = safeString(text);
    if (root.navigator && root.navigator.clipboard && root.navigator.clipboard.writeText) {
      root.navigator.clipboard.writeText(value).then(function () { showToast(label || "Copied"); })
        .catch(function () { fallbackCopy(value, label); });
    } else {
      fallbackCopy(value, label);
    }
  }

  function fallbackCopy(text, label) {
    var area = doc.createElement("textarea");
    area.value = safeString(text);
    area.setAttribute("readonly", "readonly");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    doc.body.appendChild(area);
    area.select();
    try { doc.execCommand("copy"); showToast(label || "Copied"); }
    catch (_e) { showToast("Copy unavailable"); }
    doc.body.removeChild(area);
  }

  function showToast(message) {
    var toast = $("toast");
    if (!toast) return;
    toast.textContent = safeString(message, "Done");
    toast.classList.add("show");
    root.setTimeout(function () { toast.classList.remove("show"); }, 1200);
  }

  function selectCategory(id) {
    if (!sectionExists(id)) return;
    state.activeSection = id;
    state.activeAudit = firstAuditForSection(id);
    persistState();
    closeAllMenus();
    clearReport();
    renderDropdowns();
  }

  function selectAudit(id) {
    if (!auditExists(id)) return;
    state.activeAudit = id;
    state.activeSection = AUDITS[id].section;
    persistState();
    closeAllMenus();
    clearReport();
    renderDropdowns();
  }

  function toggleTarget() {
    state.targetVisible = !state.targetVisible;
    persistState();
    var panel = $("targetPanel");
    if (panel) panel.hidden = !state.targetVisible;
    renderStatus();
  }

  function returnToOrbit(event) {
    if (event) event.preventDefault();
    root.location.href = TARGET_ROUTE;
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
      if (button) selectCategory(button.dataset.categoryId);
    });

    bind("auditDropdownMenu", "click", function (event) {
      var button = event.target.closest("[data-audit-id]");
      if (button) selectAudit(button.dataset.auditId);
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
      renderReport(packet, "DEEP_ARCHIVE_CREATED", "deepArchive");
      copyText(rawJson(packet), "Deep archive copied");
    });
    bind("toggleRaw", "click", function () {
      if (!state.rawText) createReport();
      var raw = $("rawOutput");
      if (raw) raw.hidden = !raw.hidden;
    });
    bind("resetReport", "click", function () { clearReport(); showToast("Report reset"); });
    bind("toggleTarget", "click", toggleTarget);
    bind("reloadChamber", "click", function () { root.location.reload(); });
    bind("hearthDiagnosticTargetFrame", "load", renderStatus);

    doc.addEventListener("click", function (event) {
      var orbit = event.target.closest("[data-return-to-orbit]");
      if (orbit) returnToOrbit(event);

      var category = $("categoryDropdown");
      var audit = $("auditDropdown");
      if (category && category.contains(event.target)) return;
      if (audit && audit.contains(event.target)) return;
      closeAllMenus();
    });

    doc.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeAllMenus();
    });
  }

  function publishApi() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    var api = {
      contract: CONTRACT,
      receipt: RECEIPT,
      cssContract: CSS_CONTRACT,
      htmlShellContract: HTML_SHELL_CONTRACT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      version: VERSION,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      state: state,
      auditSections: AUDIT_SECTIONS,
      audits: AUDITS,
      aliases: ALIASES,
      directConfig: DIRECT_CONFIG,
      chooseSection: selectCategory,
      chooseAudit: selectAudit,
      createReport: createReport,
      runSelectedDirectCheck: runSelectedDirectCheck,
      buildReport: buildReport,
      runDirectCheck: runDirectCheck,
      probeAliases: probeAliases,
      getTargetAccess: getTargetAccess,
      loadParticipants: loadParticipants,
      returnToOrbit: returnToOrbit
    };

    root.HEARTH_DIAGNOSTIC_CHAMBER = api;
    root.HEARTH.diagnosticChamber = api;
    root.DEXTER_LAB.hearthDiagnosticChamber = api;

    root.__HEARTH_DIAGNOSTIC_CHAMBER_LOADED__ = true;
    root.__HEARTH_DIAGNOSTIC_CHAMBER_CONTRACT__ = CONTRACT;
    root.__HEARTH_DIAGNOSTIC_CHAMBER_HTML_SHELL_CONTRACT__ = HTML_SHELL_CONTRACT;
    root.__HEARTH_DIAGNOSTIC_CHAMBER_INTERNAL_RENEWAL_CONTRACT__ = INTERNAL_RENEWAL_CONTRACT;
    root.__HEARTH_DIAGNOSTIC_SINGLE_AUDIT_WORKBENCH_ACTIVE__ = true;
    root.__HEARTH_DIAGNOSTIC_RETURN_TO_ORBIT_ACTIVE__ = true;
    root.__HEARTH_DIAGNOSTIC_CHAMBER_PRODUCTION_MUTATION_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_CHAMBER_CANVAS_BUILD_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_CHAMBER_CANVAS_RELEASE_AUTHORIZED__ = false;
    root.__HEARTH_DIAGNOSTIC_CHAMBER_RUNTIME_RESTART_AUTHORIZED__ = false;
  }

  function boot() {
    normalizeState();
    persistState();

    setText("controllerContract", INTERNAL_RENEWAL_CONTRACT);

    installActions();
    renderDropdowns();
    renderStatus();
    clearReport();
    closeAllMenus();
    publishApi();

    var targetPanel = $("targetPanel");
    if (targetPanel) targetPanel.hidden = !state.targetVisible;

    loadParticipants().then(function () {
      renderStatus();
      publishApi();
    });
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})(typeof window !== "undefined" ? window : globalThis);

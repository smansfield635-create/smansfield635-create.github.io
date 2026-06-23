// /showroom/globe/audralia/diagnostic/index.controls.js
// AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_DISTRIBUTED_CONTROL_PANEL_TNT_v9
// Full-file replacement. Controls own UI binding. Diagnostic observatory engine owns report/cycle production.

(function installAudraliaDistributedDiagnosticControlsV9(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);
  var doc = root && root.document ? root.document : null;
  if (!doc) return;

  var CONTRACT = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_DISTRIBUTED_CONTROL_PANEL_TNT_v9";
  var PREVIOUS_CONTRACT = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_DISTRIBUTED_CONTROL_PANEL_TNT_v8";
  var VERSION = "9.0.0";
  var FILE = "/showroom/globe/audralia/diagnostic/index.controls.js";

  var DIAGNOSTIC_ENGINE_CONTRACT = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE_TNT_v4";
  var DGB_ENGINE_CONTRACT = "DGB_INTERACTIVE_RUNTIME_ENGINE_CORE_NEWS_FIBONACCI_SPEC_OPS_TNT_v1";
  var DGB_ENGINE_CONTRACT_AUTHORITY = "DGB_INTERACTIVE_RUNTIME_ENGINE_CONTRACT_NEWS_FIBONACCI_SPEC_OPS_TNT_v1";
  var INSPECTION_CONTRACT = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE_TNT_v2";

  var CONTROL_RECEIPT_SCHEMA = "AUDRALIA_DROP_WITH_READ_DISTRIBUTED_CONTROL_PANEL_RECEIPT_v9";
  var CONTROL_REQUIREMENTS_SCHEMA = "AUDRALIA_DIAGNOSTIC_CONTROLS_REQUIREMENTS_MANIFEST_v5";
  var FALLBACK_REPORT_SCHEMA = "AUDRALIA_DROP_WITH_READ_CONTROL_FALLBACK_REPORT_v6";
  var FALLBACK_RECEIPT_SCHEMA = "AUDRALIA_DROP_WITH_READ_CONTROL_FALLBACK_REPORT_RECEIPT_v6";

  var TARGET_ROUTE = "/showroom/globe/audralia/";
  var TARGET_FRAME_ID = "audraliaDiagnosticTargetFrame";
  var MAX_PRESENTATION_JSON_CHARS = 18000;

  var DIAGNOSTIC_ENGINE_PATHS = Object.freeze([
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE",
    "AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER",
    "AUDRALIA.diagnosticEngine",
    "AUDRALIA.dropWithReadDiagnosticObservatory",
    "AUDRALIA.diagnosticRouteController",
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY"
  ]);

  var DGB_EVIDENCE_PATHS = Object.freeze([
    "DGB_ENGINE",
    "DGBEngine",
    "AUDRALIA.dgbEngine",
    "AUDRALIA.runtimeEngine",
    "AUDRALIA.diagnosticRuntimeEngine",
    "AUDRALIA_DROP_WITH_READ_DGB_ENGINE",
    "AUDRALIA_DROP_WITH_READ_RUNTIME_ENGINE"
  ]);

  var INSPECTION_PATHS = Object.freeze([
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE",
    "AUDRALIA.diagnosticInspectionLane"
  ]);

  var CONTROL_IDS = Object.freeze([
    "createReport", "runDirectCheck", "runNineCycle",
    "copyReadableReport", "copyPacketReport", "copyRawReport",
    "addReportToArchive", "resetCurrentReport", "resetWorkbench",
    "toggleObservationTarget", "expandTargetWindow", "reloadTargetFrame",
    "cycleStatus", "cycleChamber", "cycleMap", "cycleLedgerOutput",
    "cycleReceiptList"
  ]);

  var CYCLE_TARGET_IDS = Object.freeze([
    "cycleStatus", "cycleChamber", "cyclePreviewSummary",
    "cycleRegistrationSummary", "cyclePreflightSummary",
    "cycleExecutionSummary", "cycleMap", "cycleLedgerOutput",
    "cycleReceiptList"
  ]);

  var STATIONS = Object.freeze([
    Object.freeze({ position: 1, fibonacci: "F1", role: "NORTH_PROBE_INTAKE", direction: "NORTH" }),
    Object.freeze({ position: 2, fibonacci: "F3", role: "EAST_PROBE_SOURCE", direction: "EAST" }),
    Object.freeze({ position: 3, fibonacci: "F5", role: "EAST_CONSTRUCTION_INTERPRETATION", direction: "EAST" }),
    Object.freeze({ position: 4, fibonacci: "F8", role: "CANVAS_SURFACE_TRUTH", direction: "CENTER" }),
    Object.freeze({ position: 5, fibonacci: "F13", role: "WEST_PROBE_RUNTIME", direction: "WEST" }),
    Object.freeze({ position: 6, fibonacci: "F21", role: "WEST_RUNTIME_INTERPRETATION", direction: "WEST" }),
    Object.freeze({ position: 7, fibonacci: "F34", role: "SOUTH_PROBE_HANDOFF", direction: "SOUTH" }),
    Object.freeze({ position: 8, fibonacci: "F55", role: "SOUTH_RESTITUTION_INTERPRETATION", direction: "SOUTH" }),
    Object.freeze({ position: 9, fibonacci: "F89", role: "RAIL_TERMINAL_SYNTHESIS", direction: "RAIL" })
  ]);

  var NO_CLAIMS = Object.freeze({
    productionMutationAuthorized: false,
    runtimeRestartAuthorized: false,
    rendererMutationAuthorized: false,
    canvasRepairAuthorized: false,
    controlsRepairAuthorized: false,
    routeRepairAuthorized: false,
    publicRuntimeMountAuthorized: false,
    publicRuntimeMutationAuthorized: false,
    readinessClaimed: false,
    visualPassClaimed: false,
    cyclePassClaimed: false,
    exactNineIndependentlyClaimed: false,
    restitutionIndependentlyClaimed: false,
    bridgeCompatibilityClaimed: false,
    runtimeOrderClaimed: false,
    familySynchronizationClaimed: false,
    targetReadyProvesRuntimeReady: false,
    targetRouteMatchProvesRuntimeReady: false,
    targetLoadProvesRuntimeReady: false,
    f21Claimed: false,
    f89Claimed: false
  });

  function nowIso() {
    try { return new Date().toISOString(); } catch (_e) { return null; }
  }

  function isFn(value) { return typeof value === "function"; }
  function isObj(value) { return Boolean(value && typeof value === "object" && !Array.isArray(value)); }
  function byId(id) { return doc.getElementById(id); }

  function clone(value, seen) {
    var memory = seen || [];
    var out;

    if (value === null || value === undefined || typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
    if (typeof value === "bigint") return String(value);
    if (typeof value === "function") return { type: "Function", name: value.name || "anonymous" };
    if (memory.indexOf(value) !== -1) return "[Circular]";

    memory = memory.concat([value]);

    if (Array.isArray(value)) return value.slice(0, 89).map(function (entry) { return clone(entry, memory); });

    out = {};
    try {
      Object.keys(value).slice(0, 233).forEach(function (key) {
        try { out[key] = clone(value[key], memory); } catch (_e) { out[key] = "[Unreadable]"; }
      });
    } catch (_e2) {
      return { unreadable: true };
    }

    return out;
  }

  function deepFreeze(value, seen) {
    var memory = seen || [];
    if (!value || (typeof value !== "object" && typeof value !== "function")) return value;
    if (memory.indexOf(value) !== -1) return value;
    memory.push(value);
    try {
      Object.keys(value).forEach(function (key) { deepFreeze(value[key], memory); });
      Object.freeze(value);
    } catch (_e) {}
    return value;
  }

  function frozenClone(value) { return deepFreeze(clone(value)); }

  function safeJson(value) {
    try { return JSON.stringify(clone(value), null, 2); } catch (_e) { return String(value); }
  }

  function boundedJson(value) {
    var text = safeJson(value);
    if (text.length <= MAX_PRESENTATION_JSON_CHARS) return text;
    return text.slice(0, MAX_PRESENTATION_JSON_CHARS) +
      "\n\n/* AUDRALIA_BOUNDED_PRESENTATION_TRUNCATED: full receipt retained in runtime state; pasted user-facing output bounded. */";
  }

  function escapeHtml(value) {
    return String(value === null || value === undefined ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function token(value) {
    return String(value === null || value === undefined ? "" : value).trim().toUpperCase().replace(/[\s\-]+/g, "_");
  }

  function readPath(path) {
    var parts = String(path || "").split(".").filter(Boolean);
    var cursor = root;
    for (var i = 0; i < parts.length; i += 1) {
      if (cursor === null || cursor === undefined) return null;
      try { cursor = cursor[parts[i]]; } catch (_e) { return null; }
    }
    return cursor === undefined ? null : cursor;
  }

  function resolveFirst(paths) {
    for (var i = 0; i < paths.length; i += 1) {
      var value = readPath(paths[i]);
      if (value) return { path: paths[i], value: value };
    }
    return null;
  }

  function readContract(value) {
    if (!value) return null;
    try { return value.CONTRACT || value.contract || null; } catch (_e) { return null; }
  }

  function setText(id, value) {
    var node = byId(id);
    if (!node) return false;
    node.textContent = value === null || value === undefined ? "" : String(value);
    return true;
  }

  function setHtml(id, value) {
    var node = byId(id);
    if (!node) return false;
    node.innerHTML = String(value || "");
    return true;
  }

  function setStatus(id, status) {
    var node = byId(id);
    if (!node) return false;
    node.setAttribute("data-status", token(status || "UNKNOWN"));
    return true;
  }

  function setDisabled(id, disabled) {
    var node = byId(id);
    if (!node) return false;
    node.disabled = Boolean(disabled);
    node.setAttribute("aria-disabled", disabled ? "true" : "false");
    return true;
  }

  function normalizeRoutePath(value) {
    var raw = String(value === null || value === undefined ? "" : value).trim();
    if (!raw) return null;
    if (raw === "about:blank") return "/blank/";
    try {
      var parsed = new root.URL(raw, root.location && root.location.href ? root.location.href : "https://diamondgatebridge.com/");
      var path = parsed.pathname || "/";
      if (path.charAt(0) !== "/") path = "/" + path;
      if (path.length > 1 && path.charAt(path.length - 1) !== "/") path += "/";
      return path;
    } catch (_e) {
      if (raw.charAt(0) !== "/") raw = "/" + raw;
      if (raw.length > 1 && raw.charAt(raw.length - 1) !== "/") raw += "/";
      return raw;
    }
  }

  function emptyEngine(reason) {
    return {
      resolved: false,
      compatible: false,
      ready: false,
      path: null,
      contract: null,
      status: null,
      reason: reason || "ENGINE_NOT_RESOLVED",
      reportInterfacePresent: false,
      cycleInterfacePresent: false,
      receiptPresent: false
    };
  }

  function emptyDgbEvidence(reason) {
    return {
      resolved: false,
      compatible: false,
      ready: false,
      path: null,
      contract: null,
      status: null,
      reason: reason || "DGB_EVIDENCE_NOT_RESOLVED",
      runtimeReceiptPresent: false,
      authorityReceiptPresent: false,
      dgbRuntimeCompatible: false
    };
  }

  function emptyInspection() {
    return { resolved: false, path: null, contract: null, receiptPresent: false, errorPresent: false };
  }

  function emptyTarget() {
    return {
      framePresent: false,
      frameId: TARGET_FRAME_ID,
      expectedRoute: TARGET_ROUTE,
      expectedRouteNormalized: normalizeRoutePath(TARGET_ROUTE),
      declaredSrc: null,
      declaredSrcNormalized: null,
      observedRoute: null,
      observedRouteNormalized: null,
      routeMatched: false,
      declaredRouteMatched: false,
      observedBlankWithDeclaredTarget: false,
      documentLoaded: false,
      documentReadyState: null,
      navigationPending: false,
      loadCount: 0,
      firstObservedHref: null,
      lifecycleClass: "TARGET_UNBOUND",
      lastInspectedAt: null,
      preparationReceipt: null
    };
  }

  var REQUIREMENTS = deepFreeze({
    schema: CONTROL_REQUIREMENTS_SCHEMA,
    controlsContract: CONTRACT,
    previousControlsContract: PREVIOUS_CONTRACT,
    expectedDiagnosticEngineContract: DIAGNOSTIC_ENGINE_CONTRACT,
    expectedEngineContract: DGB_ENGINE_CONTRACT,
    expectedEngineContractAuthority: DGB_ENGINE_CONTRACT_AUTHORITY,
    expectedInspectionLaneContract: INSPECTION_CONTRACT,
    expectedTargetRoute: TARGET_ROUTE,
    targetFrameId: TARGET_FRAME_ID,
    requiredCycleTargetIds: CYCLE_TARGET_IDS.slice(),
    requiredStationPositions: STATIONS.map(function (s) { return s.position; }),
    presentationStationMap: STATIONS,
    reportProducerOwner: "DIAGNOSTIC_OBSERVATORY_ENGINE_INDEX_JS",
    cycleProducerOwner: "DIAGNOSTIC_OBSERVATORY_ENGINE_INDEX_JS",
    dgbCoreRole: "EVIDENCE_RUNTIME_REGISTRY_ONLY",
    targetPreparationOwner: "INDEX_CONTROLS",
    certificationOwner: "INDEX_CONTROL_BRIDGE",
    controlsCertificationScope: "CONTROLS_LOCAL_OBSERVATION_AND_UPDATE_EVIDENCE_ONLY",
    targetLifecycleRequiredBeforeCycle: true,
    publicApiRequirements: [
      "createReport", "runDirectCheck", "runNineCycle", "viewCurrentReport",
      "copyReadableReport", "copyPacketReport", "copyRawReport",
      "executeDistributedReportCommand", "applyCommandContext",
      "openReceiptChamber", "openArchiveChamber", "addReportToArchive",
      "createDeepArchive", "resetCurrentReport", "resetWorkbench",
      "setTargetVisible", "setTargetExpanded", "inspectTargetFrame",
      "ensureTargetReady", "reloadTargetFrame", "applyReceiptFilter",
      "selectReceipt", "inspectControls", "inspectDistributedCommands",
      "inspectInspectionLane", "collectReceiptFamilies", "refreshReceiptInventory",
      "resolveDiagnosticEngine", "resolveDgbEvidence", "closeAllSelectors",
      "renderCycleChamber", "refreshCycleChamber", "getState", "getCurrentReport",
      "getCurrentReportReceipt", "getCurrentCycleReceipt",
      "getCycleRenderingState", "getTargetLifecycleState",
      "getNormalizedReceipts", "getRequirements", "getReceipt"
    ],
    noClaims: NO_CLAIMS
  });

  var state = {
    initialized: false,
    initializedAt: null,
    engine: emptyEngine("DIAGNOSTIC_ENGINE_NOT_RESOLVED"),
    dgbEvidence: emptyDgbEvidence("DGB_EVIDENCE_NOT_RESOLVED"),
    inspectionLane: emptyInspection(),
    target: emptyTarget(),
    controls: {
      manifestCount: CONTROL_IDS.length,
      discoveredCount: 0,
      missingCount: 0,
      missing: [],
      delegatedEventsActive: false,
      distributedDeclarationCount: 0,
      distributedDeclarations: []
    },
    ui: {
      targetVisible: false,
      targetExpanded: false,
      receiptFilter: "all",
      selectedReceiptIndex: null,
      selectedCategory: "observatoryReceiver",
      selectedAudit: "observatoryIndex",
      selectedParticipant: "ALL",
      reportMode: "read",
      instrumentChamber: "cycle",
      observationLens: "target",
      leftOrbitView: "audits",
      lastReportCommand: null,
      lastReportCommandSource: null
    },
    report: { current: null, receipt: null, source: null, fallbackHistory: [] },
    cycle: { running: false, requested: false, executed: false, rawReceipt: null, rendering: null, renderingReceipt: null, localDomEvidence: null, renderedAt: null },
    normalizedReceipts: [],
    visibleReceipts: [],
    actionCount: 0,
    clickCount: 0,
    errorCount: 0,
    lastAction: null,
    lastError: null
  };

  function recordAction(action, detail) {
    state.actionCount += 1;
    state.lastAction = deepFreeze({
      action: action,
      detail: clone(detail || {}),
      actionNumber: state.actionCount,
      occurredAt: nowIso()
    });
    publishReceipt();
  }

  function recordError(action, error, detail) {
    state.errorCount += 1;
    state.lastError = deepFreeze({
      action: action,
      message: String(error && error.message ? error.message : error),
      detail: clone(detail || {}),
      errorNumber: state.errorCount,
      occurredAt: nowIso()
    });
    setText("controllerState", "CONTROL ERROR");
    setStatus("controllerState", "ERROR");
    publishReceipt();
    return frozenClone(state.lastError);
  }

  function inspectInspectionLane() {
    var resolved = resolveFirst(INSPECTION_PATHS);
    state.inspectionLane = {
      resolved: Boolean(resolved),
      path: resolved ? resolved.path : null,
      contract: resolved ? readContract(resolved.value) : null,
      receiptPresent: Boolean(root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE_RECEIPT),
      errorPresent: Boolean(root.__AUDRALIA_DIAGNOSTIC_INSPECTION_LANE_ERROR__)
    };
    publishReceipt();
    return frozenClone(state.inspectionLane);
  }

  function deriveStatus(api, receipt) {
    var candidates = [
      api && api.STATUS,
      api && api.status,
      receipt && receipt.status,
      receipt && receipt.apiStatus,
      receipt && receipt.reportStatus
    ];
    for (var i = 0; i < candidates.length; i += 1) {
      if (typeof candidates[i] === "string" && candidates[i].trim()) return token(candidates[i]);
    }
    return "UNKNOWN";
  }

  function resolveDiagnosticEngine() {
    var resolved = resolveFirst(DIAGNOSTIC_ENGINE_PATHS);
    var api = resolved ? resolved.value : null;
    var receipt = null;
    var contract = api ? readContract(api) : null;
    var status;

    state.engine = emptyEngine("DIAGNOSTIC_ENGINE_NOT_FOUND");

    if (!api) {
      publishReceipt();
      return null;
    }

    try {
      if (isFn(api.getEngineReceipt)) receipt = api.getEngineReceipt();
      else if (isFn(api.getReceipt)) receipt = api.getReceipt();
    } catch (_e) {}

    status = deriveStatus(api, receipt);

    state.engine = {
      resolved: true,
      compatible: contract === DIAGNOSTIC_ENGINE_CONTRACT || Boolean(isFn(api.createReport) || isFn(api.runNineCycle)),
      ready: status === "API_READY" || status === "READY" || status === "AVAILABLE",
      path: resolved.path,
      contract: contract,
      status: status,
      reason: "DIAGNOSTIC_ENGINE_INDEX_JS_OBSERVED",
      reportInterfacePresent: isFn(api.createReport),
      cycleInterfacePresent: isFn(api.runNineCycle),
      receiptPresent: Boolean(receipt),
      receipt: frozenClone(receipt)
    };

    publishReceipt();
    return api;
  }

  function resolveDgbEvidence() {
    var resolved = resolveFirst(DGB_EVIDENCE_PATHS);
    var api = resolved ? resolved.value : null;
    var receipt = null;
    var authorityReceipt = null;
    var contract = api ? readContract(api) : null;
    var status;

    state.dgbEvidence = emptyDgbEvidence("DGB_EVIDENCE_NOT_FOUND");

    if (!api) {
      publishReceipt();
      return null;
    }

    try { receipt = isFn(api.getRuntimeReceipt) ? api.getRuntimeReceipt() : isFn(api.getReceipt) ? api.getReceipt() : null; } catch (_e1) {}
    try { authorityReceipt = isFn(api.getAuthorityReceipt) ? api.getAuthorityReceipt() : null; } catch (_e2) {}

    status = deriveStatus(api, receipt || authorityReceipt);

    state.dgbEvidence = {
      resolved: true,
      compatible: contract === DGB_ENGINE_CONTRACT,
      ready: status === "READY",
      path: resolved.path,
      contract: contract,
      status: status,
      reason: "DGB_EVIDENCE_ONLY_NOT_REPORT_OR_CYCLE_AUTHORITY",
      runtimeReceiptPresent: Boolean(receipt),
      authorityReceiptPresent: Boolean(authorityReceipt),
      dgbRuntimeCompatible: contract === DGB_ENGINE_CONTRACT,
      runtimeReceipt: frozenClone(receipt),
      authorityReceipt: frozenClone(authorityReceipt)
    };

    publishReceipt();
    return api;
  }

  function createFallbackReport(context) {
    var reason = context && context.reason ? context.reason : state.engine.reason || "DIAGNOSTIC_ENGINE_UNAVAILABLE";
    var createdAt = nowIso();
    var report = {
      schema: FALLBACK_REPORT_SCHEMA,
      reportId: "AUDRALIA_CONTROL_FALLBACK_" + Date.now(),
      status: "HELD",
      classification: "CONTROL_FALLBACK_REPORT",
      createdAt: createdAt,
      READ: {
        Result: "The report command was received, but the diagnostic observatory engine did not expose an available report producer.",
        Evidence: [
          "The distributed control panel received the command.",
          "The renewed controls resolved the diagnostic observatory engine before DGB evidence/runtime paths.",
          state.engine.resolved ? "A diagnostic engine path was observed." : "No diagnostic engine path was observed.",
          state.inspectionLane.resolved ? "The bounded inspection lane was present." : "The bounded inspection lane was unavailable."
        ],
        Absence: [
          reason,
          "DGB core remains evidence/runtime/registry only and was not used as report producer.",
          "No readiness, visual pass, cycle pass, exact-nine pass, or family synchronization is claimed by this fallback report."
        ],
        Direction: [
          "Inspect AUDRALIA_DROP_WITH_READ_CONTROL_PANEL_RECEIPT.",
          "Inspect AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_ENGINE_RECEIPT.",
          "Inspect AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE.createReport."
        ]
      },
      diagnosticEngineResolution: frozenClone(state.engine),
      dgbEvidence: frozenClone(state.dgbEvidence),
      inspectionLane: frozenClone(state.inspectionLane),
      noClaims: NO_CLAIMS
    };

    var receipt = {
      schema: FALLBACK_RECEIPT_SCHEMA,
      receiptId: "AUDRALIA_CONTROL_FALLBACK_RECEIPT_" + Date.now(),
      reportId: report.reportId,
      status: "HELD",
      reason: reason,
      type: "error",
      groups: ["observation", "error"],
      createdAt: createdAt,
      noClaims: NO_CLAIMS
    };

    state.report.fallbackHistory.push(deepFreeze(clone(report)));
    commitReport(report, receipt, "CONTROL_FALLBACK");
    recordAction("createFallbackReport", { reason: reason, reportId: report.reportId });
    return frozenClone(report);
  }

  function normalizeRead(report) {
    var read = report && (report.READ || report.read) || {};
    return {
      Result: read.Result !== undefined ? read.Result : read.result !== undefined ? read.result : "Diagnostic report available.",
      Evidence: Array.isArray(read.Evidence) ? read.Evidence : Array.isArray(read.evidence) ? read.evidence : [],
      Absence: Array.isArray(read.Absence) ? read.Absence : Array.isArray(read.absence) ? read.absence : [],
      Direction: Array.isArray(read.Direction) ? read.Direction : Array.isArray(read.direction) ? read.direction : []
    };
  }

  function renderReadRegion(id, letter, label, headline, entries) {
    var values = Array.isArray(entries) ? entries : [entries];
    setHtml(id,
      "<header><span>" + escapeHtml(letter) + "</span><div><p>" +
      escapeHtml(label) + "</p><strong>" + escapeHtml(headline) +
      "</strong></div></header>" +
      (values.length > 1
        ? "<ul>" + values.slice(0, 21).map(function (entry) { return "<li>" + escapeHtml(entry) + "</li>"; }).join("") + "</ul>"
        : "<p>" + escapeHtml(values[0] || "") + "</p>")
    );
  }

  function commitReport(report, receipt, source) {
    var read = normalizeRead(report);
    var status = token(report && report.status || "AVAILABLE");

    state.report.current = deepFreeze(clone(report));
    state.report.receipt = receipt ? deepFreeze(clone(receipt)) : null;
    state.report.source = source;

    renderReadRegion("readResult", "R", "Result", "Diagnostic report", read.Result);
    renderReadRegion("readEvidence", "E", "Evidence", "Bounded evidence", read.Evidence.length ? read.Evidence : ["No evidence entries returned."]);
    renderReadRegion("readAbsence", "A", "Absence", "Bounded absence", read.Absence.length ? read.Absence : ["No absence entries returned."]);
    renderReadRegion("readDirection", "D", "Direction", "Next diagnostic direction", read.Direction.length ? read.Direction : ["Inspect the report receipt."]);

    setText("reportStatus", status);
    setStatus("reportStatus", status);
    setText("reportTitle", "Diagnostic Report");
    setText("reportCreatedAt", report.createdAt || nowIso());
    setText("reportMeta", [report.reportId || "REPORT", receipt && receipt.receiptId ? receipt.receiptId : "RECEIPT UNAVAILABLE"].join(" · "));
    setText("packetOutput", boundedJson({ report: report, receipt: receipt }));
    setText("rawOutput", boundedJson({
      schema: "AUDRALIA_BOUNDED_USER_FACING_RAW_REPORT_VIEW_v1",
      reportId: report.reportId || null,
      reportStatus: report.status || null,
      receiptId: receipt && receipt.receiptId ? receipt.receiptId : null,
      receiptStatus: receipt && receipt.status ? receipt.status : null,
      receiptTerminalClass: receipt && receipt.terminalClass ? receipt.terminalClass : null,
      targetLifecycle: receipt && receipt.targetLifecycle ? receipt.targetLifecycle : null,
      stationReceiptCount: receipt && Array.isArray(receipt.stationReceipts) ? receipt.stationReceipts.length : 0,
      report: report,
      receipt: receipt
    }));
    setDisabled("copyReadableReport", false);
    setDisabled("copyPacketReport", false);
    setDisabled("copyRawReport", false);
    setDisabled("addReportToArchive", source === "CONTROL_FALLBACK");

    setText("controllerState", source === "CONTROL_FALLBACK" ? "ENGINE HELD" : "REPORT READY");
    setStatus("controllerState", source === "CONTROL_FALLBACK" ? "HELD" : "READY");

    refreshReceiptInventory({ publish: false, render: true });
    publishReceipt();
    return frozenClone(state.report.current);
  }

  function createReport(options) {
    var settings = options || {};
    var engine = resolveDiagnosticEngine();
    resolveDgbEvidence();

    settings.category = settings.category || state.ui.selectedCategory;
    settings.audit = settings.audit || state.ui.selectedAudit;
    settings.participant = settings.participant || state.ui.selectedParticipant;

    recordAction("createReport.begin", {
      source: settings.source || "CONTROL_PANEL",
      command: settings.command || "create",
      diagnosticEnginePath: state.engine.path,
      diagnosticEngineContract: state.engine.contract
    });

    if (engine && isFn(engine.setSelection)) {
      try {
        engine.setSelection({
          category: settings.category,
          audit: settings.audit,
          participant: settings.participant
        });
      } catch (_e0) {}
    }

    if (engine && isFn(engine.createReport)) {
      try {
        return Promise.resolve(engine.createReport(settings)).then(function (report) {
          if (!isObj(report)) return createFallbackReport({ reason: "DIAGNOSTIC_ENGINE_REPORT_RESULT_INVALID" });
          var receipt = null;
          try { receipt = isFn(engine.getReportReceipt) ? engine.getReportReceipt() : null; } catch (_e1) {}
          return commitReport(report, receipt, "DIAGNOSTIC_ENGINE");
        }, function (error) {
          return createFallbackReport({ reason: "DIAGNOSTIC_ENGINE_REPORT_REJECTED", error: error });
        });
      } catch (error) {
        return Promise.resolve(createFallbackReport({ reason: "DIAGNOSTIC_ENGINE_REPORT_THROW", error: error }));
      }
    }

    return Promise.resolve(createFallbackReport({ reason: state.engine.reason || "DIAGNOSTIC_ENGINE_REPORT_INTERFACE_UNAVAILABLE" }));
  }

  function compactTargetLifecycle(target) {
    var t = target || state.target || emptyTarget();
    var observed = t.observedRoute || t.declaredSrc || null;

    return {
      loaded: Boolean(t.documentLoaded),
      routeExpected: t.expectedRoute || TARGET_ROUTE,
      routeObserved: t.observedRoute || null,
      routeMatched: Boolean(t.routeMatched),
      firstObservedHref: t.firstObservedHref || observed,
      lifecycleClass: t.lifecycleClass || "TARGET_UNKNOWN",
      documentReadyState: t.documentReadyState || null,
      navigationPending: Boolean(t.navigationPending),
      loadCount: Number(t.loadCount || 0),
      recommendedOwner: "CONTROL_PANEL",
      recommendedFile: "index.controls.js",
      recommendedAction: t.routeMatched && t.documentLoaded
        ? "Proceed with diagnostic cycle."
        : "Delay diagnostic cycle until target frame is loaded and route-matched."
    };
  }

  function createCycleHeldReceipt(reason) {
    return {
      schema: "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_CYCLE_RECEIPT_v4",
      receiptId: "AUDRALIA_CONTROL_CYCLE_HELD_" + Date.now(),
      status: "HELD",
      terminalClass: "CONTROL_INTERFACE_HELD",
      reason: reason || "DIAGNOSTIC_ENGINE_DOES_NOT_EXPOSE_NINE_CYCLE",
      stationReceipts: [],
      receipts: [],
      normalizedReceipts: [],
      source: "CONTROL_PANEL",
      targetLifecycle: compactTargetLifecycle(state.target),
      noClaims: NO_CLAIMS,
      createdAt: nowIso()
    };
  }

  function createTargetNotReadyCycleReceipt(targetLifecycle) {
    return {
      schema: "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_CYCLE_RECEIPT_v4",
      receiptId: "AUDRALIA_CONTROL_CYCLE_HELD_" + Date.now(),
      status: "HELD",
      terminalClass: "TARGET_NOT_READY",
      reason: "CONTROL_PANEL_HELD_CYCLE_BECAUSE_TARGET_FRAME_WAS_NOT_LOADED_AND_ROUTE_MATCHED",
      stationReceipts: [],
      receipts: [],
      normalizedReceipts: [],
      source: "CONTROL_PANEL",
      targetLifecycle: frozenClone(targetLifecycle),
      recommendedOwner: "CONTROL_PANEL",
      recommendedFile: "index.controls.js",
      recommendedAction: "Do not invoke F8 until controls observe target loaded and route-matched.",
      noClaims: NO_CLAIMS,
      createdAt: nowIso()
    };
  }

  function extractStationReceipts(receipt) {
    if (!receipt || typeof receipt !== "object") return [];
    if (Array.isArray(receipt.stationReceipts)) return receipt.stationReceipts;
    if (Array.isArray(receipt.normalizedReceipts)) return receipt.normalizedReceipts;
    if (Array.isArray(receipt.receipts)) return receipt.receipts;
    return [];
  }

  function normalizeReturnedReceipt(entry, index) {
    var raw = isObj(entry) ? entry : {};
    var station = STATIONS[index] || null;
    var position = Number(raw.position || raw.cyclePosition || (station && station.position));
    var role = raw.role || raw.stationId || (station && station.role) || null;
    var fibonacci = raw.fibonacci || (station && station.fibonacci) || null;
    var status = token(raw.status || (raw.completed ? "COMPLETE" : "AVAILABLE"));
    return {
      raw: frozenClone(raw),
      position: Number.isFinite(position) ? position : null,
      role: role,
      stationId: role,
      fibonacci: fibonacci,
      status: status,
      summary: raw.summary || raw.reason || raw.terminalClass || null
    };
  }

  function buildCycleRenderingState(receipt) {
    var returned = extractStationReceipts(receipt).slice(0, 9).map(normalizeReturnedReceipt);
    var rows = {};
    var mapped = [];
    var unmapped = [];

    STATIONS.forEach(function (station) {
      rows[station.position] = {
        station: station,
        receipts: [],
        presentationStatus: state.cycle.executed ? "NOT_REACHED" : "UNKNOWN"
      };
    });

    returned.forEach(function (entry) {
      if (rows[entry.position]) {
        rows[entry.position].receipts.push(entry);
        rows[entry.position].presentationStatus = entry.status || "AVAILABLE";
        mapped.push(entry);
      } else {
        unmapped.push(entry);
      }
    });

    return {
      schema: "AUDRALIA_DROP_WITH_READ_CYCLE_RENDERING_STATE_v9",
      engineCycleStatus: token(receipt && receipt.status || "UNKNOWN"),
      engineCycleTerminalClass: receipt && receipt.terminalClass || null,
      stationReceipts: frozenClone(returned),
      rows: rows,
      mappedReceiptCount: mapped.length,
      unmappedReceiptCount: unmapped.length,
      duplicateCoordinateCount: 0,
      coordinateConflictCount: 0,
      unresolvedDeclarationCount: 0,
      renderedPositions: mapped.map(function (entry) { return entry.position; }),
      notReachedPositions: STATIONS.filter(function (station) { return !rows[station.position].receipts.length; }).map(function (station) { return station.position; }),
      returnedReceiptMappingComplete: mapped.length === 9,
      logicalMappingComplete: mapped.length === 9,
      logicalMappingScope: "RETURNED_RECEIPTS_ONLY",
      targetLifecycle: compactTargetLifecycle(state.target),
      createdAt: nowIso()
    };
  }

  function renderCycleRow(position, rowState) {
    var row = doc.querySelector('#cycleMap [data-position="' + position + '"], #cycleChamber [data-position="' + position + '"]');
    if (!row) return { position: position, found: false, updated: false };

    row.setAttribute("data-status", rowState.presentationStatus);
    row.setAttribute("data-position", String(position));
    row.setAttribute("data-fibonacci", rowState.station.fibonacci);
    row.setAttribute("data-role", rowState.station.role);

    var statusNode = row.querySelector("[data-station-status]") || row.querySelector("[data-status-value]") || row.querySelector("b");
    var summaryNode = row.querySelector("[data-station-summary]") || row.querySelector("p") || row.querySelector("small");

    if (statusNode) statusNode.textContent = rowState.receipts.length ? rowState.station.role : rowState.presentationStatus;
    if (summaryNode) {
      summaryNode.textContent = rowState.receipts.length
        ? (rowState.receipts[0].summary || rowState.presentationStatus)
        : rowState.presentationStatus === "NOT_REACHED" ? "No station receipt returned." : "Cycle not executed.";
    }

    return { position: position, found: true, updated: true };
  }

  function renderCommittedCycleChamber() {
    var receipt = state.cycle.rawReceipt || createCycleHeldReceipt("NOT_RUN");
    var rendering = buildCycleRenderingState(receipt);
    var rowResults = STATIONS.map(function (station) { return renderCycleRow(station.position, rendering.rows[station.position]); });
    var missingTargets = [];

    CYCLE_TARGET_IDS.forEach(function (id) { if (!byId(id)) missingTargets.push(id); });

    setText("cycleStatus", state.cycle.executed ? "Cycle · " + rendering.engineCycleStatus : "Cycle · Not Run");
    setStatus("cycleStatus", state.cycle.executed ? rendering.engineCycleStatus : "NOT_RUN");
    setText("cycleLedgerOutput", boundedJson(rendering));
    setHtml("cycleReceiptList", rendering.stationReceipts.length
      ? rendering.stationReceipts.map(function (entry) {
          return '<article><h4>' + escapeHtml((entry.fibonacci || "") + " · " + (entry.role || "Station")) +
            '</h4><p>' + escapeHtml(entry.status || "UNKNOWN") +
            '</p><small>' + escapeHtml(entry.summary || "Receipt returned.") + '</small></article>';
        }).join("")
      : '<article class="empty-state"><h4>No engine cycle receipts</h4><p>The diagnostic observatory engine did not return station receipts.</p></article>');

    state.cycle.rendering = deepFreeze(clone(rendering));
    state.cycle.localDomEvidence = deepFreeze({
      schema: "AUDRALIA_DROP_WITH_READ_CYCLE_LOCAL_DOM_EVIDENCE_v9",
      evidenceScope: "CONTROLS_LOCAL_OBSERVATION_AND_UPDATE_ONLY",
      localDomUpdateComplete: missingTargets.length === 0 && rowResults.every(function (r) { return r.found && r.updated; }),
      missingTargetIds: missingTargets,
      missingStationPositions: rowResults.filter(function (r) { return !r.found; }).map(function (r) { return r.position; }),
      noClaims: NO_CLAIMS,
      observedAt: nowIso()
    });
    state.cycle.renderingReceipt = deepFreeze({
      schema: "AUDRALIA_DROP_WITH_READ_CYCLE_RENDERING_RECEIPT_v9",
      receiptId: "AUDRALIA_CYCLE_RENDERING_RECEIPT_" + Date.now(),
      controlsContract: CONTRACT,
      evidenceScope: "CONTROLS_LOCAL_PRESENTATION_ONLY",
      localDomUpdateComplete: state.cycle.localDomEvidence.localDomUpdateComplete,
      familySynchronizationCertified: false,
      noClaims: NO_CLAIMS,
      renderedAt: nowIso()
    });
    state.cycle.renderedAt = state.cycle.renderingReceipt.renderedAt;

    publishReceipt();
    return frozenClone({
      rendering: state.cycle.rendering,
      localDomEvidence: state.cycle.localDomEvidence,
      renderingReceipt: state.cycle.renderingReceipt
    });
  }

  function runNineCycle() {
    var engine = resolveDiagnosticEngine();
    resolveDgbEvidence();

    state.cycle.requested = true;
    state.cycle.running = true;
    setText("controllerState", "TARGET CHECK");
    setStatus("controllerState", "RUNNING");

    recordAction("runNineCycle.begin", {
      diagnosticEnginePath: state.engine.path,
      diagnosticEngineContract: state.engine.contract
    });

    return ensureTargetReady().then(function (targetReady) {
      var lifecycle = targetReady.targetLifecycle;

      if (!targetReady.ready) {
        var held = createTargetNotReadyCycleReceipt(lifecycle);
        state.cycle.running = false;
        state.cycle.executed = true;
        state.cycle.rawReceipt = deepFreeze(clone(held));
        renderCommittedCycleChamber();
        recordAction("runNineCycle.held.targetNotReady", {
          terminalClass: held.terminalClass,
          targetLifecycle: lifecycle
        });
        return frozenClone(held);
      }

      if (engine && isFn(engine.runNineCycle)) {
        try {
          return Promise.resolve(engine.runNineCycle({
            source: "CONTROL_PANEL",
            requestedAt: nowIso(),
            category: state.ui.selectedCategory,
            audit: state.ui.selectedAudit,
            participant: state.ui.selectedParticipant,
            targetLifecycle: lifecycle
          })).then(function (receipt) {
            state.cycle.running = false;
            state.cycle.executed = true;
            state.cycle.rawReceipt = deepFreeze(clone(receipt || createCycleHeldReceipt("DIAGNOSTIC_ENGINE_EMPTY_CYCLE_RECEIPT")));
            renderCommittedCycleChamber();
            recordAction("runNineCycle.complete", {
              status: state.cycle.rawReceipt.status || null,
              terminalClass: state.cycle.rawReceipt.terminalClass || null,
              targetLifecycle: lifecycle
            });
            return frozenClone(state.cycle.rawReceipt);
          }, function (error) {
            return holdCycle("DIAGNOSTIC_ENGINE_CYCLE_REJECTED", error);
          });
        } catch (error) {
          return Promise.resolve(holdCycle("DIAGNOSTIC_ENGINE_CYCLE_THROW", error));
        }
      }

      return Promise.resolve(holdCycle("DIAGNOSTIC_ENGINE_DOES_NOT_EXPOSE_NINE_CYCLE"));
    });
  }

  function holdCycle(reason, error) {
    var receipt = createCycleHeldReceipt(reason);
    if (error) receipt.error = String(error && error.message ? error.message : error);
    state.cycle.running = false;
    state.cycle.executed = true;
    state.cycle.rawReceipt = deepFreeze(clone(receipt));
    renderCommittedCycleChamber();
    recordAction("runNineCycle.held", { reason: reason, targetLifecycle: compactTargetLifecycle(state.target) });
    return frozenClone(receipt);
  }

  function runDirectCheck() {
    recordAction("runDirectCheck.held", { reason: "DIRECT_CHECK_NOT_EXPOSED_BY_CONTROLS" });
    setText("controllerState", "DIRECT HELD");
    setStatus("controllerState", "HELD");
    return Promise.resolve(null);
  }

  function inspectTargetFrame(options) {
    var settings = options || {};
    var frame = byId(TARGET_FRAME_ID);
    var observedRoute = null;
    var readyState = null;
    var declaredSrcNormalized = null;
    var observedIsBlank = false;
    var declaredMatchesTarget = false;

    state.target.framePresent = Boolean(frame);
    state.target.declaredSrc = frame ? frame.getAttribute("src") : null;
    state.target.lastInspectedAt = nowIso();

    if (!frame) {
      state.target.declaredSrcNormalized = null;
      state.target.observedRoute = null;
      state.target.observedRouteNormalized = null;
      state.target.routeMatched = false;
      state.target.declaredRouteMatched = false;
      state.target.observedBlankWithDeclaredTarget = false;
      state.target.documentLoaded = false;
      state.target.documentReadyState = null;
      state.target.lifecycleClass = "TARGET_FRAME_MISSING";
      publishReceipt();
      return frozenClone(state.target);
    }

    declaredSrcNormalized = normalizeRoutePath(state.target.declaredSrc);
    declaredMatchesTarget = declaredSrcNormalized === state.target.expectedRouteNormalized;

    try {
      observedRoute = frame.contentWindow && frame.contentWindow.location ? frame.contentWindow.location.href : frame.src;
      readyState = frame.contentDocument ? frame.contentDocument.readyState : null;
    } catch (_e) {
      observedRoute = frame.src || frame.getAttribute("src");
    }

    observedIsBlank = String(observedRoute || "").trim() === "about:blank";

    if (!state.target.firstObservedHref && observedRoute) state.target.firstObservedHref = observedRoute;

    state.target.declaredSrcNormalized = declaredSrcNormalized;
    state.target.observedRoute = observedRoute;
    state.target.observedRouteNormalized = normalizeRoutePath(observedRoute);
    state.target.routeMatched = state.target.observedRouteNormalized === state.target.expectedRouteNormalized;
    state.target.declaredRouteMatched = declaredMatchesTarget;
    state.target.observedBlankWithDeclaredTarget = observedIsBlank && declaredMatchesTarget;
    state.target.documentReadyState = readyState;
    state.target.documentLoaded = readyState === "interactive" || readyState === "complete";

    if (state.target.routeMatched && state.target.documentLoaded) {
      state.target.lifecycleClass = "TARGET_READY";
      state.target.navigationPending = false;
    } else if (state.target.routeMatched) {
      state.target.lifecycleClass = "TARGET_LOADING";
    } else if (observedIsBlank && declaredMatchesTarget) {
      state.target.lifecycleClass = state.target.navigationPending || settings.navigationPending === true
        ? "TARGET_NAVIGATION_PENDING"
        : "TARGET_LOADING";
    } else {
      state.target.lifecycleClass = "TARGET_ROUTE_MISMATCH";
    }

    state.target.preparationReceipt = deepFreeze({
      schema: "AUDRALIA_DIAGNOSTIC_TARGET_PREPARATION_RECEIPT_v4",
      receiptId: "AUDRALIA_TARGET_PREPARATION_RECEIPT_" + Date.now(),
      controlsContract: CONTRACT,
      targetLifecycle: state.target.lifecycleClass,
      loaded: Boolean(state.target.documentLoaded),
      routeExpected: state.target.expectedRoute,
      routeObserved: state.target.observedRoute,
      routeMatched: state.target.routeMatched,
      firstObservedHref: state.target.firstObservedHref,
      declaredRouteMatched: state.target.declaredRouteMatched,
      observedBlankWithDeclaredTarget: state.target.observedBlankWithDeclaredTarget,
      documentLoaded: state.target.documentLoaded,
      documentReadyState: state.target.documentReadyState,
      declaredSrc: state.target.declaredSrc,
      declaredSrcNormalized: state.target.declaredSrcNormalized,
      observedRoute: state.target.observedRoute,
      observedRouteNormalized: state.target.observedRouteNormalized,
      navigationPending: state.target.navigationPending,
      recommendedOwner: "CONTROL_PANEL",
      recommendedFile: "index.controls.js",
      recommendedAction: state.target.routeMatched && state.target.documentLoaded
        ? "Proceed with diagnostic cycle."
        : "Delay diagnostic cycle until target frame is loaded and route-matched.",
      noClaims: NO_CLAIMS,
      generatedAt: nowIso()
    });

    publishReceipt();
    return frozenClone(state.target);
  }

  function ensureTargetReady() {
    var first = inspectTargetFrame({ source: "ensureTargetReady.first" });
    var compact = compactTargetLifecycle(first);

    return Promise.resolve({
      ready: compact.loaded === true && compact.routeMatched === true,
      pending: first.lifecycleClass === "TARGET_LOADING" || first.lifecycleClass === "TARGET_NAVIGATION_PENDING",
      target: first,
      targetLifecycle: compact
    });
  }

  function setTargetVisible(visible) {
    state.ui.targetVisible = Boolean(visible);
    var button = byId("toggleObservationTarget");
    var targetWindow = byId("targetWindow");
    if (button) button.setAttribute("aria-expanded", state.ui.targetVisible ? "true" : "false");
    if (targetWindow) targetWindow.hidden = !state.ui.targetVisible;
    publishReceipt();
    if (state.ui.targetVisible) inspectTargetFrame();
  }

  function setTargetExpanded(expanded) {
    state.ui.targetExpanded = Boolean(expanded);
    var button = byId("expandTargetWindow");
    var windowNode = byId("targetWindow");
    if (windowNode) windowNode.classList.toggle("is-expanded", state.ui.targetExpanded);
    if (button) button.setAttribute("aria-pressed", state.ui.targetExpanded ? "true" : "false");
    publishReceipt();
  }

  function reloadTargetFrame() {
    var frame = byId(TARGET_FRAME_ID);
    if (!frame) return false;
    state.target.navigationPending = true;
    state.target.firstObservedHref = null;
    frame.src = TARGET_ROUTE + "?diagnosticReload=" + Date.now();
    inspectTargetFrame({ navigationPending: true, source: "reloadTargetFrame" });
    recordAction("reloadTargetFrame");
    return true;
  }

  function viewCurrentReport() { return Boolean(state.report.current); }

  function currentReadableText() {
    if (!state.report.current) return "";
    var read = normalizeRead(state.report.current);
    return [
      "AUDRALIA DROP WITH READ DIAGNOSTIC REPORT",
      "REPORT_ID=" + String(state.report.current.reportId || "UNKNOWN"),
      "STATUS=" + String(state.report.current.status || "UNKNOWN"),
      "",
      "RESULT", String(read.Result),
      "",
      "EVIDENCE", read.Evidence.slice(0, 21).map(function (e) { return "- " + e; }).join("\n"),
      "",
      "ABSENCE", read.Absence.slice(0, 21).map(function (e) { return "- " + e; }).join("\n"),
      "",
      "DIRECTION", read.Direction.slice(0, 21).map(function (e) { return "- " + e; }).join("\n")
    ].join("\n");
  }

  function copyText(text) {
    if (!text) return Promise.resolve(false);
    if (root.navigator && root.navigator.clipboard && isFn(root.navigator.clipboard.writeText)) {
      return root.navigator.clipboard.writeText(text).then(function () { return true; }, function () { return false; });
    }
    return Promise.resolve(false);
  }

  function copyReadableReport() { return copyText(currentReadableText()); }
  function copyPacketReport() { return copyText(byId("packetOutput") ? byId("packetOutput").textContent : ""); }
  function copyRawReport() { return copyText(byId("rawOutput") ? byId("rawOutput").textContent : ""); }

  function addReportToArchive() {
    recordAction("addReportToArchive.held", { reason: "CONTROL_PANEL_DOES_NOT_MUTATE_ENGINE_ARCHIVE" });
    return false;
  }

  function createDeepArchive() {
    var archive = collectReceiptFamilies();
    setText("archiveSessionCount", archive.length);
    setText("archiveRawOutput", boundedJson(archive));
    recordAction("createDeepArchive", { receiptCount: archive.length });
    return frozenClone(archive);
  }

  function resetCurrentReport() {
    state.report.current = null;
    state.report.receipt = null;
    state.report.source = null;
    setText("reportStatus", "READY");
    setStatus("reportStatus", "READY");
    setText("reportTitle", "No report created");
    setText("reportCreatedAt", "—");
    setText("reportMeta", "Choose a category and audit, then create a report. Report availability does not certify runtime or family readiness.");
    setText("packetOutput", "No report packet has been created.");
    setText("rawOutput", "No raw report has been created.");
    setDisabled("copyReadableReport", true);
    setDisabled("copyPacketReport", true);
    setDisabled("copyRawReport", true);
    setDisabled("addReportToArchive", true);
    publishReceipt();
  }

  function resetWorkbench() {
    resetCurrentReport();
    state.cycle.running = false;
    state.cycle.requested = false;
    state.cycle.executed = false;
    state.cycle.rawReceipt = null;
    renderCommittedCycleChamber();
    recordAction("resetWorkbench");
  }

  function openReceiptChamber() {
    activateInstrumentChamber("receipts");
    refreshReceiptInventory({ publish: true, render: true });
  }

  function openArchiveChamber() {
    activateInstrumentChamber("archive");
    createDeepArchive();
  }

  function applyCommandContext(node) {
    if (!node) return;
    state.ui.lastReportCommandSource = node.getAttribute("data-report-source") || node.id || "DISTRIBUTED_CONTROL";
    publishReceipt();
  }

  function executeDistributedReportCommand(target, command) {
    var cmd = String(command || target && target.getAttribute("data-report-command") || "").trim().toLowerCase();
    if (!cmd) return false;

    state.ui.lastReportCommand = cmd;
    applyCommandContext(target);

    if (cmd === "create") { createReport({ source: state.ui.lastReportCommandSource, command: cmd }); return true; }
    if (cmd === "view") return viewCurrentReport();
    if (cmd === "copy-readable") { copyReadableReport(); return true; }
    if (cmd === "copy-packet") { copyPacketReport(); return true; }
    if (cmd === "copy-raw") { copyRawReport(); return true; }
    if (cmd === "open-receipts") { openReceiptChamber(); return true; }
    if (cmd === "open-archive") { openArchiveChamber(); return true; }
    if (cmd === "reset") { resetCurrentReport(); return true; }

    return false;
  }

  function normalizeReceipt(record, source, path) {
    return {
      type: token(record && (record.type || record.status || record.reportStatus || "observation")).toLowerCase(),
      sourceAuthority: source || "UNKNOWN",
      label: record && (record.label || record.title || record.schema || record.contract) || source || "Receipt",
      record: frozenClone(record),
      receiptId: record && (record.receiptId || record.id || record.reportId || record.cycleId) || null,
      path: path || null,
      groups: ["observation"].concat(record && /held|error|fail|missing/i.test(safeJson(record)) ? ["error"] : [])
    };
  }

  function collectReceiptFamilies() {
    var output = [];
    var engine = resolveDiagnosticEngine();
    var dgb = resolveDgbEvidence();
    var inspection = resolveFirst(INSPECTION_PATHS);
    var inspectionApi = inspection ? inspection.value : null;

    function add(record, source, path) {
      if (!record || typeof record !== "object") return;
      output.push(normalizeReceipt(record, source, path));
    }

    add(root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE_RECEIPT, "INSPECTION_LANE", "global.inspectionReceipt");
    add(inspectionApi && isFn(inspectionApi.getReceipt) ? inspectionApi.getReceipt() : null, "INSPECTION_LANE", "inspection.getReceipt");
    add(engine && isFn(engine.getEngineReceipt) ? engine.getEngineReceipt() : engine && isFn(engine.getReceipt) ? engine.getReceipt() : null, "DIAGNOSTIC_ENGINE", "diagnosticEngine.getReceipt");
    add(engine && isFn(engine.getReportReceipt) ? engine.getReportReceipt() : null, "DIAGNOSTIC_ENGINE", "diagnosticEngine.getReportReceipt");
    add(engine && isFn(engine.getCycleReceipt) ? engine.getCycleReceipt() : null, "DIAGNOSTIC_ENGINE", "diagnosticEngine.getCycleReceipt");
    add(dgb && isFn(dgb.getRuntimeReceipt) ? dgb.getRuntimeReceipt() : null, "DGB_EVIDENCE_ONLY", "dgb.getRuntimeReceipt");
    add(dgb && isFn(dgb.getAuthorityStatus) ? dgb.getAuthorityStatus() : null, "DGB_EVIDENCE_ONLY", "dgb.getAuthorityStatus");
    add(state.report.receipt, state.report.source || "CONTROL_PANEL", "state.report.receipt");
    add(state.target.preparationReceipt, "CONTROL_TARGET_PREPARATION", "state.target.preparationReceipt");
    add(state.cycle.rawReceipt, "CONTROL_CYCLE", "state.cycle.rawReceipt");
    add(state.cycle.renderingReceipt, "CONTROL_CYCLE_RENDERING", "state.cycle.renderingReceipt");
    add(state.lastError, "CONTROL_PANEL", "state.lastError");

    return output.slice(0, 34);
  }

  function receiptMatchesFilter(entry, filter) {
    var f = String(filter || "all").toLowerCase();
    var text = safeJson(entry).toLowerCase();
    if (f === "all") return true;
    if (f === "participant") return /participant|station|f1|f3|f5|f8|f13|f21|f34|f55|f89|north|east|west|south|rail/.test(text);
    if (f === "observation") return /observation|inspection|target|runtime|engine|dgb/.test(text);
    if (f === "cycle") return /cycle|nine|station|receiptcount|normalized/.test(text);
    if (f === "error") return /error|held|fail|missing/.test(text);
    return true;
  }

  function refreshReceiptInventory(options) {
    var settings = options || {};
    state.normalizedReceipts = collectReceiptFamilies();
    state.visibleReceipts = state.normalizedReceipts.filter(function (entry) {
      return receiptMatchesFilter(entry, state.ui.receiptFilter);
    });

    if (settings.render !== false) {
      setHtml("receiptList", state.visibleReceipts.length
        ? state.visibleReceipts.map(function (entry, index) {
            return '<article tabindex="0" role="button" data-receipt-index="' + index + '">' +
              "<h4>" + escapeHtml(entry.label) + "</h4><p>" + escapeHtml(entry.sourceAuthority) + "</p>" +
              (entry.receiptId ? "<small>" + escapeHtml(entry.receiptId) + "</small>" : "") +
              "</article>";
          }).join("")
        : '<article class="empty-state"><h4>No receipts</h4><p>No receipts are currently available for this filter.</p></article>');
    }

    if (settings.publish !== false) publishReceipt();
    return frozenClone(state.normalizedReceipts);
  }

  function applyReceiptFilter(filter) {
    state.ui.receiptFilter = String(filter || "all").toLowerCase();

    Array.prototype.slice.call(doc.querySelectorAll("[data-receipt-filter]")).forEach(function (node) {
      node.setAttribute("aria-pressed", node.getAttribute("data-receipt-filter") === state.ui.receiptFilter ? "true" : "false");
    });

    refreshReceiptInventory({ publish: true, render: true });
  }

  function selectReceipt(index) {
    var entry = state.visibleReceipts[Number(index)] || null;
    state.ui.selectedReceiptIndex = entry ? Number(index) : null;
    setHtml("selectedReceiptDetail", entry
      ? "<h4>" + escapeHtml(entry.label) + "</h4><pre>" + escapeHtml(boundedJson(entry.record)) + "</pre>"
      : "<h4>Receipt unavailable</h4>");
    publishReceipt();
  }

  function closeAllSelectors(except) {
    Array.prototype.slice.call(doc.querySelectorAll(".selector-menu")).forEach(function (menu) {
      if (except && menu === except) return;
      menu.hidden = true;
    });
    Array.prototype.slice.call(doc.querySelectorAll(".custom-selector > button[aria-expanded]")).forEach(function (button) {
      var controls = button.getAttribute("aria-controls");
      if (except && controls && byId(controls) === except) return;
      button.setAttribute("aria-expanded", "false");
    });
  }

  function toggleSelector(selectorId) {
    var selector = byId(selectorId);
    if (!selector) return false;
    var button = selector.querySelector("button[aria-controls]");
    var menu = button ? byId(button.getAttribute("aria-controls")) : null;
    if (!button || !menu) return false;
    var willOpen = menu.hidden;
    closeAllSelectors(menu);
    menu.hidden = !willOpen;
    button.setAttribute("aria-expanded", willOpen ? "true" : "false");
    return true;
  }

  function setEngineSelection() {
    var engine = resolveDiagnosticEngine();
    if (engine && isFn(engine.setSelection)) {
      try {
        engine.setSelection({
          category: state.ui.selectedCategory,
          audit: state.ui.selectedAudit,
          participant: state.ui.selectedParticipant
        });
      } catch (_e) {}
    }
  }

  function selectCategory(categoryId, label) {
    state.ui.selectedCategory = categoryId || state.ui.selectedCategory;
    setText("categorySelectorLabel", label || state.ui.selectedCategory);
    Array.prototype.slice.call(doc.querySelectorAll("[data-category-id]")).forEach(function (node) {
      node.setAttribute("aria-selected", node.getAttribute("data-category-id") === state.ui.selectedCategory ? "true" : "false");
    });
    setEngineSelection();
    closeAllSelectors();
    publishReceipt();
  }

  function selectAudit(auditId, label) {
    state.ui.selectedAudit = auditId || state.ui.selectedAudit;
    setText("auditSelectorLabel", label || state.ui.selectedAudit);
    Array.prototype.slice.call(doc.querySelectorAll("[data-audit-id]")).forEach(function (node) {
      node.setAttribute("aria-selected", node.getAttribute("data-audit-id") === state.ui.selectedAudit ? "true" : "false");
    });
    setEngineSelection();
    closeAllSelectors();
    publishReceipt();
  }

  function activatePanel(buttonSelector, panelAttribute, value, stateKey) {
    var buttons = Array.prototype.slice.call(doc.querySelectorAll(buttonSelector));
    buttons.forEach(function (button) {
      var selected = button.getAttribute(panelAttribute) === value;
      button.setAttribute("aria-selected", selected ? "true" : "false");
      var panel = byId(button.getAttribute("aria-controls"));
      if (panel) panel.hidden = !selected;
    });
    state.ui[stateKey] = value;
    publishReceipt();
  }

  function activateLeftOrbit(view) {
    activatePanel("[data-left-orbit-view]", "data-left-orbit-view", view || "audits", "leftOrbitView");
  }

  function activateObservationLens(lens) {
    activatePanel("[data-observation-lens]", "data-observation-lens", lens || "target", "observationLens");
    if (lens === "window") setTargetVisible(true);
  }

  function activateInstrumentChamber(chamber) {
    activatePanel("[data-instrument-chamber]", "data-instrument-chamber", chamber || "cycle", "instrumentChamber");
  }

  function activateReportMode(mode) {
    activatePanel("[data-report-mode]", "data-report-mode", mode || "read", "reportMode");
  }

  function inspectDistributedCommands() {
    var nodes = Array.prototype.slice.call(doc.querySelectorAll("[data-report-command]"));
    state.controls.distributedDeclarationCount = nodes.length;
    state.controls.distributedDeclarations = nodes.map(function (node) {
      return { id: node.id || null, command: node.getAttribute("data-report-command"), source: node.getAttribute("data-report-source") };
    });
    publishReceipt();
    return frozenClone(state.controls.distributedDeclarations);
  }

  function inspectControls() {
    var missing = [];
    CONTROL_IDS.forEach(function (id) { if (!byId(id)) missing.push(id); });
    state.controls.discoveredCount = CONTROL_IDS.length - missing.length;
    state.controls.missingCount = missing.length;
    state.controls.missing = missing;
    inspectDistributedCommands();
    publishReceipt();
    return frozenClone(state.controls);
  }

  function handleParticipantSelection(target) {
    var node = target && isFn(target.closest) ? target.closest("[data-participant-role]") : null;
    if (!node) return false;

    state.ui.selectedParticipant = node.getAttribute("data-participant-role") || "ALL";

    Array.prototype.slice.call(doc.querySelectorAll("[data-participant-role]")).forEach(function (entry) {
      entry.setAttribute("aria-selected", entry === node ? "true" : "false");
    });

    setHtml("participantDetail",
      "<h3>" + escapeHtml(state.ui.selectedParticipant) + "</h3>" +
      "<p>Selected for direct-execution context only. Selection does not certify availability or execute the participant.</p>"
    );

    setEngineSelection();
    publishReceipt();
    return true;
  }

  function handleClick(event) {
    var target = event.target && isFn(event.target.closest)
      ? event.target.closest("button, a[href], summary, [role='button'], [role='tab'], [role='option'], [data-participant-role]")
      : null;
    var id;
    var cmd;

    if (!target) return;

    state.clickCount += 1;

    if (handleParticipantSelection(target)) {
      event.preventDefault();
      return;
    }

    id = target.id || "";
    cmd = target.getAttribute("data-report-command");

    if (target.getAttribute("data-left-orbit-view")) {
      event.preventDefault();
      activateLeftOrbit(target.getAttribute("data-left-orbit-view"));
      return;
    }

    if (target.getAttribute("data-observation-lens")) {
      event.preventDefault();
      activateObservationLens(target.getAttribute("data-observation-lens"));
      return;
    }

    if (target.getAttribute("data-instrument-chamber")) {
      event.preventDefault();
      activateInstrumentChamber(target.getAttribute("data-instrument-chamber"));
      if (cmd) executeDistributedReportCommand(target, cmd);
      return;
    }

    if (target.getAttribute("data-report-mode")) {
      event.preventDefault();
      activateReportMode(target.getAttribute("data-report-mode"));
      return;
    }

    if (target.getAttribute("data-receipt-filter")) {
      event.preventDefault();
      applyReceiptFilter(target.getAttribute("data-receipt-filter"));
      return;
    }

    if (target.getAttribute("data-category-id")) {
      event.preventDefault();
      selectCategory(target.getAttribute("data-category-id"), target.querySelector("strong") ? target.querySelector("strong").textContent : null);
      return;
    }

    if (target.getAttribute("data-audit-id")) {
      event.preventDefault();
      selectAudit(target.getAttribute("data-audit-id"), target.querySelector("strong") ? target.querySelector("strong").textContent : null);
      return;
    }

    if (id === "categorySelectorButton") { event.preventDefault(); toggleSelector("categorySelector"); return; }
    if (id === "auditSelectorButton") { event.preventDefault(); toggleSelector("auditSelector"); return; }

    if (cmd) {
      event.preventDefault();
      executeDistributedReportCommand(target, cmd);
      return;
    }

    if (id === "createReport") { event.preventDefault(); createReport({ source: "CANONICAL_CREATE_REPORT_BUTTON" }); return; }
    if (id === "runDirectCheck") { event.preventDefault(); runDirectCheck(); return; }
    if (id === "runNineCycle") { event.preventDefault(); runNineCycle(); return; }
    if (id === "copyReadableReport") { event.preventDefault(); copyReadableReport(); return; }
    if (id === "copyPacketReport") { event.preventDefault(); copyPacketReport(); return; }
    if (id === "copyRawReport") { event.preventDefault(); copyRawReport(); return; }
    if (id === "addReportToArchive") { event.preventDefault(); addReportToArchive(); return; }
    if (id === "resetCurrentReport") { event.preventDefault(); resetCurrentReport(); return; }
    if (id === "resetWorkbench") { event.preventDefault(); resetWorkbench(); return; }
    if (id === "createDeepArchive") { event.preventDefault(); createDeepArchive(); return; }
    if (id === "toggleObservationTarget") { event.preventDefault(); setTargetVisible(!state.ui.targetVisible); return; }
    if (id === "expandTargetWindow") { event.preventDefault(); setTargetExpanded(!state.ui.targetExpanded); return; }
    if (id === "reloadTargetFrame") { event.preventDefault(); reloadTargetFrame(); return; }
    if (id === "reloadObservatory") { event.preventDefault(); root.location.reload(); return; }
    if (target.hasAttribute("data-receipt-index")) { event.preventDefault(); selectReceipt(target.getAttribute("data-receipt-index")); }
  }

  function handleDocumentClick(event) {
    var insideSelector = event.target && isFn(event.target.closest) ? event.target.closest(".custom-selector") : null;
    if (!insideSelector) closeAllSelectors();
  }

  function bindEvents() {
    doc.addEventListener("click", handleClick);
    doc.addEventListener("click", handleDocumentClick);
    var frame = byId(TARGET_FRAME_ID);
    if (frame) frame.addEventListener("load", function () {
      state.target.navigationPending = false;
      state.target.loadCount += 1;
      inspectTargetFrame({ source: "targetFrame.load" });
    });
    state.controls.delegatedEventsActive = true;
  }

  function publishReceipt() {
    root.AUDRALIA_DROP_WITH_READ_CONTROL_PANEL_RECEIPT = deepFreeze({
      schema: CONTROL_RECEIPT_SCHEMA,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      initialized: state.initialized,
      initializedAt: state.initializedAt,
      delegatedEventsActive: state.controls.delegatedEventsActive,
      diagnosticEngineLookupPaths: DIAGNOSTIC_ENGINE_PATHS.slice(),
      dgbEvidenceLookupPaths: DGB_EVIDENCE_PATHS.slice(),
      engine: frozenClone(state.engine),
      dgbEvidence: frozenClone(state.dgbEvidence),
      inspectionLane: frozenClone(state.inspectionLane),
      targetLifecycle: compactTargetLifecycle(state.target),
      targetLifecycleFull: frozenClone(state.target),
      controlManifestCount: CONTROL_IDS.length,
      discoveredControlCount: state.controls.discoveredCount,
      missingControlCount: state.controls.missingCount,
      missingControls: state.controls.missing.slice(),
      distributedDeclarationCount: state.controls.distributedDeclarationCount,
      distributedDeclarations: frozenClone(state.controls.distributedDeclarations),
      currentReportId: state.report.current ? state.report.current.reportId || null : null,
      currentReportSource: state.report.source,
      reportAvailable: Boolean(state.report.current),
      fallbackReportCount: state.report.fallbackHistory.length,
      cycleReceiptPresent: Boolean(state.cycle.rawReceipt),
      cycleRunning: state.cycle.running,
      cycleRequested: state.cycle.requested,
      cycleExecuted: state.cycle.executed,
      engineCycleStatus: state.cycle.rendering ? state.cycle.rendering.engineCycleStatus : null,
      returnedReceiptMappingComplete: state.cycle.rendering ? state.cycle.rendering.returnedReceiptMappingComplete : false,
      logicalMappingComplete: state.cycle.rendering ? state.cycle.rendering.logicalMappingComplete : false,
      localDomUpdateComplete: state.cycle.localDomEvidence ? state.cycle.localDomEvidence.localDomUpdateComplete : false,
      familySynchronizationCertified: false,
      cycleRenderingReceipt: frozenClone(state.cycle.renderingReceipt),
      normalizedReceiptCount: state.normalizedReceipts.length,
      visibleReceiptCount: state.visibleReceipts.length,
      actionCount: state.actionCount,
      clickCount: state.clickCount,
      errorCount: state.errorCount,
      lastAction: frozenClone(state.lastAction),
      lastError: frozenClone(state.lastError),
      presentationStationMap: STATIONS,
      requirements: REQUIREMENTS,
      reportProducerOwner: "DIAGNOSTIC_OBSERVATORY_ENGINE_INDEX_JS",
      cycleProducerOwner: "DIAGNOSTIC_OBSERVATORY_ENGINE_INDEX_JS",
      dgbCoreRole: "EVIDENCE_RUNTIME_REGISTRY_ONLY",
      relationalCertificationOwner: "INDEX_CONTROL_BRIDGE",
      noClaims: NO_CLAIMS,
      generatedAt: nowIso()
    });
  }

  function getPublicState() {
    return frozenClone({
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      initialized: state.initialized,
      engine: state.engine,
      dgbEvidence: state.dgbEvidence,
      inspectionLane: state.inspectionLane,
      target: state.target,
      targetLifecycle: compactTargetLifecycle(state.target),
      controls: state.controls,
      ui: state.ui,
      report: state.report,
      cycle: state.cycle,
      normalizedReceipts: state.normalizedReceipts,
      requirements: REQUIREMENTS
    });
  }

  function publishApi() {
    var api = Object.freeze({
      CONTRACT: CONTRACT,
      contract: CONTRACT,
      PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      VERSION: VERSION,
      version: VERSION,
      FILE: FILE,
      file: FILE,
      STATUS: "READY",
      status: "READY",
      createReport: createReport,
      runDirectCheck: runDirectCheck,
      runNineCycle: runNineCycle,
      viewCurrentReport: viewCurrentReport,
      copyReadableReport: copyReadableReport,
      copyPacketReport: copyPacketReport,
      copyRawReport: copyRawReport,
      executeDistributedReportCommand: executeDistributedReportCommand,
      applyCommandContext: applyCommandContext,
      openReceiptChamber: openReceiptChamber,
      openArchiveChamber: openArchiveChamber,
      addReportToArchive: addReportToArchive,
      createDeepArchive: createDeepArchive,
      resetCurrentReport: resetCurrentReport,
      resetWorkbench: resetWorkbench,
      setTargetVisible: setTargetVisible,
      setTargetExpanded: setTargetExpanded,
      inspectTargetFrame: inspectTargetFrame,
      ensureTargetReady: ensureTargetReady,
      reloadTargetFrame: reloadTargetFrame,
      applyReceiptFilter: applyReceiptFilter,
      selectReceipt: selectReceipt,
      inspectControls: inspectControls,
      inspectDistributedCommands: inspectDistributedCommands,
      inspectInspectionLane: inspectInspectionLane,
      collectReceiptFamilies: function () { return frozenClone(collectReceiptFamilies()); },
      refreshReceiptInventory: refreshReceiptInventory,
      resolveDiagnosticEngine: resolveDiagnosticEngine,
      resolveDgbEvidence: resolveDgbEvidence,
      resolveEngine: resolveDiagnosticEngine,
      closeAllSelectors: closeAllSelectors,
      renderCycleChamber: renderCommittedCycleChamber,
      refreshCycleChamber: renderCommittedCycleChamber,
      getState: getPublicState,
      getCurrentReport: function () { return frozenClone(state.report.current); },
      getCurrentReportReceipt: function () { return frozenClone(state.report.receipt); },
      getCurrentCycleReceipt: function () { return frozenClone(state.cycle.rawReceipt); },
      getCycleRenderingState: function () { return frozenClone(state.cycle.rendering); },
      getTargetLifecycleState: function () { return frozenClone(state.target); },
      getBoundedTargetLifecycle: function () { return frozenClone(compactTargetLifecycle(state.target)); },
      getNormalizedReceipts: function () { return frozenClone(state.normalizedReceipts); },
      getRequirements: function () { return frozenClone(REQUIREMENTS); },
      getReceipt: function () { return frozenClone(root.AUDRALIA_DROP_WITH_READ_CONTROL_PANEL_RECEIPT || null); },
      NO_CLAIMS: NO_CLAIMS,
      noClaims: NO_CLAIMS
    });

    root.AUDRALIA_DROP_WITH_READ_CONTROL_PANEL = api;

    if (!root.AUDRALIA || typeof root.AUDRALIA !== "object") root.AUDRALIA = {};
    root.AUDRALIA.dropWithReadControlPanel = api;

    root.AUDRALIA_DIAGNOSTIC_CONTROLS_REQUIREMENTS = REQUIREMENTS;

    root.__AUDRALIA_DROP_WITH_READ_CONTROL_PANEL_LOADED__ = true;
    root.__AUDRALIA_DROP_WITH_READ_CONTROL_PANEL_CONTRACT__ = CONTRACT;
    root.__AUDRALIA_DROP_WITH_READ_CONTROL_PANEL_VERSION__ = VERSION;

    return api;
  }

  function initializeUiState() {
    activateLeftOrbit(state.ui.leftOrbitView);
    activateObservationLens(state.ui.observationLens);
    activateInstrumentChamber(state.ui.instrumentChamber);
    activateReportMode(state.ui.reportMode);
    applyReceiptFilter(state.ui.receiptFilter);
    setTargetVisible(false);
    setTargetExpanded(false);
  }

  function init() {
    if (state.initialized) return;

    state.initialized = true;
    state.initializedAt = nowIso();

    publishApi();
    bindEvents();
    inspectInspectionLane();
    inspectTargetFrame({ source: "init" });
    inspectControls();
    resolveDiagnosticEngine();
    resolveDgbEvidence();
    renderCommittedCycleChamber();
    initializeUiState();
    refreshReceiptInventory({ publish: false, render: true });
    publishReceipt();

    setText("controllerContract", CONTRACT);
    setText("controllerState", state.engine.resolved ? "DIAGNOSTIC ENGINE OBSERVED" : "ENGINE HELD");
    setStatus("controllerState", state.engine.resolved ? "READY" : "HELD");

    recordAction("initialize", {
      diagnosticEngineResolved: state.engine.resolved,
      diagnosticEngineCompatible: state.engine.compatible,
      diagnosticEngineReady: state.engine.ready,
      dgbEvidenceResolved: state.dgbEvidence.resolved,
      inspectionLaneResolved: state.inspectionLane.resolved,
      missingControls: state.controls.missing
    });
  }

  var existing = root.AUDRALIA_DROP_WITH_READ_CONTROL_PANEL;
  if (existing && (existing.CONTRACT === CONTRACT || existing.contract === CONTRACT)) return;

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})(
  typeof window !== "undefined"
    ? window
    : typeof globalThis !== "undefined"
      ? globalThis
      : this
);

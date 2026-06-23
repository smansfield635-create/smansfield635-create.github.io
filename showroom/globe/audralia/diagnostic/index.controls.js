// /showroom/globe/audralia/diagnostic/index.controls.js
// AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_DISTRIBUTED_CONTROL_PANEL_TNT_v8
// Full-file replacement. Diagnostic-control panel renewed for current DGB engine family.

(function installAudraliaDistributedDiagnosticControlsV8(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);
  var doc = root && root.document ? root.document : null;
  if (!doc) return;

  var CONTRACT = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_DISTRIBUTED_CONTROL_PANEL_TNT_v8";
  var PREVIOUS_CONTRACT = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_DISTRIBUTED_CONTROL_PANEL_TNT_v7";
  var VERSION = "8.0.0";
  var FILE = "/showroom/globe/audralia/diagnostic/index.controls.js";

  var DGB_ENGINE_CONTRACT = "DGB_INTERACTIVE_RUNTIME_ENGINE_CORE_NEWS_FIBONACCI_SPEC_OPS_TNT_v1";
  var DGB_ENGINE_CONTRACT_AUTHORITY = "DGB_INTERACTIVE_RUNTIME_ENGINE_CONTRACT_NEWS_FIBONACCI_SPEC_OPS_TNT_v1";
  var INSPECTION_CONTRACT = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE_TNT_v2";

  var CONTROL_RECEIPT_SCHEMA = "AUDRALIA_DROP_WITH_READ_DISTRIBUTED_CONTROL_PANEL_RECEIPT_v8";
  var CONTROL_REQUIREMENTS_SCHEMA = "AUDRALIA_DIAGNOSTIC_CONTROLS_REQUIREMENTS_MANIFEST_v4";
  var FALLBACK_REPORT_SCHEMA = "AUDRALIA_DROP_WITH_READ_CONTROL_FALLBACK_REPORT_v5";
  var FALLBACK_RECEIPT_SCHEMA = "AUDRALIA_DROP_WITH_READ_CONTROL_FALLBACK_REPORT_RECEIPT_v5";

  var TARGET_ROUTE = "/showroom/globe/audralia/";
  var TARGET_FRAME_ID = "audraliaDiagnosticTargetFrame";

  var ENGINE_PATHS = Object.freeze([
    "DGB_ENGINE",
    "DGBEngine",
    "AUDRALIA.dgbEngine",
    "AUDRALIA.runtimeEngine",
    "AUDRALIA.diagnosticRuntimeEngine",
    "AUDRALIA_DROP_WITH_READ_DGB_ENGINE",
    "AUDRALIA_DROP_WITH_READ_RUNTIME_ENGINE",
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE",
    "AUDRALIA.diagnosticEngine",
    "AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER",
    "AUDRALIA.diagnosticRouteController"
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

    if (Array.isArray(value)) return value.map(function (entry) { return clone(entry, memory); });

    out = {};
    try {
      Object.keys(value).slice(0, 377).forEach(function (key) {
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
      runtimeReceiptPresent: false,
      authorityReceiptPresent: false,
      dgbRuntimeCompatible: false,
      reportInterfacePresent: false,
      cycleInterfacePresent: false
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
      observedRoute: null,
      observedRouteNormalized: null,
      routeMatched: false,
      documentLoaded: false,
      documentReadyState: null,
      navigationPending: false,
      loadCount: 0,
      lifecycleClass: "TARGET_UNBOUND",
      lastInspectedAt: null,
      preparationReceipt: null
    };
  }

  var REQUIREMENTS = deepFreeze({
    schema: CONTROL_REQUIREMENTS_SCHEMA,
    controlsContract: CONTRACT,
    previousControlsContract: PREVIOUS_CONTRACT,
    expectedEngineContract: DGB_ENGINE_CONTRACT,
    expectedEngineContractAuthority: DGB_ENGINE_CONTRACT_AUTHORITY,
    expectedInspectionLaneContract: INSPECTION_CONTRACT,
    expectedTargetRoute: TARGET_ROUTE,
    targetFrameId: TARGET_FRAME_ID,
    requiredCycleTargetIds: CYCLE_TARGET_IDS.slice(),
    requiredStationPositions: STATIONS.map(function (s) { return s.position; }),
    presentationStationMap: STATIONS,
    targetPreparationOwner: "INDEX_CONTROLS",
    certificationOwner: "INDEX_CONTROL_BRIDGE",
    controlsCertificationScope: "CONTROLS_LOCAL_OBSERVATION_AND_UPDATE_EVIDENCE_ONLY",
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
      "resolveEngine", "closeAllSelectors", "renderCycleChamber",
      "refreshCycleChamber", "getState", "getCurrentReport",
      "getCurrentReportReceipt", "getCurrentCycleReceipt",
      "getCycleRenderingState", "getTargetLifecycleState",
      "getNormalizedReceipts", "getRequirements", "getReceipt"
    ],
    noClaims: NO_CLAIMS
  });

  var state = {
    initialized: false,
    initializedAt: null,
    engine: emptyEngine("ENGINE_NOT_RESOLVED"),
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

  function deriveEngineStatus(engine, receipt, authority) {
    var candidates = [
      engine && engine.STATUS,
      engine && engine.status,
      receipt && receipt.status,
      authority && authority.status
    ];

    for (var i = 0; i < candidates.length; i += 1) {
      if (typeof candidates[i] === "string" && candidates[i].trim()) return token(candidates[i]);
    }

    if (receipt && receipt.authorityMatched === true) return "READY";
    return "UNKNOWN";
  }

  function resolveEngine() {
    var best = null;

    state.engine = emptyEngine("ENGINE_NOT_FOUND");

    for (var i = 0; i < ENGINE_PATHS.length; i += 1) {
      var path = ENGINE_PATHS[i];
      var candidate = readPath(path);
      var contract;
      var runtimeReceipt = null;
      var authorityReceipt = null;
      var status;

      if (!candidate || typeof candidate !== "object") continue;

      contract = readContract(candidate);

      if (!best) {
        best = { path: path, value: candidate, contract: contract };
      }

      if (contract !== DGB_ENGINE_CONTRACT) continue;

      try { runtimeReceipt = isFn(candidate.getRuntimeReceipt) ? candidate.getRuntimeReceipt() : isFn(candidate.getReceipt) ? candidate.getReceipt() : null; } catch (_e1) {}
      try { authorityReceipt = isFn(candidate.getAuthorityReceipt) ? candidate.getAuthorityReceipt() : null; } catch (_e2) {}

      status = deriveEngineStatus(candidate, runtimeReceipt, authorityReceipt);

      state.engine = {
        resolved: true,
        compatible: true,
        ready: status === "READY",
        path: path,
        contract: contract,
        status: status,
        reason: status === "READY" ? "DGB_ENGINE_READY" : "DGB_ENGINE_OBSERVED_NOT_READY",
        runtimeReceiptPresent: Boolean(runtimeReceipt),
        authorityReceiptPresent: Boolean(authorityReceipt),
        dgbRuntimeCompatible: true,
        reportInterfacePresent: isFn(candidate.createReport),
        cycleInterfacePresent: isFn(candidate.runNineCycle),
        runtimeReceipt: frozenClone(runtimeReceipt),
        authorityReceipt: frozenClone(authorityReceipt)
      };

      publishReceipt();
      return candidate;
    }

    if (best) {
      state.engine = emptyEngine("ENGINE_CONTRACT_MISMATCH");
      state.engine.resolved = true;
      state.engine.path = best.path;
      state.engine.contract = best.contract;
    }

    publishReceipt();
    return null;
  }

  function getCompatibleEngine() {
    return resolveEngine();
  }

  function createFallbackReport(context) {
    var reason = context && context.reason ? context.reason : state.engine.reason || "ENGINE_UNAVAILABLE";
    var createdAt = nowIso();
    var report = {
      schema: FALLBACK_REPORT_SCHEMA,
      reportId: "AUDRALIA_CONTROL_FALLBACK_" + Date.now(),
      status: "HELD",
      classification: "CONTROL_FALLBACK_REPORT",
      createdAt: createdAt,
      READ: {
        Result: "The report command was received, but the current DGB runtime did not expose an engine-backed diagnostic report producer.",
        Evidence: [
          "The distributed control panel received the command.",
          "The renewed controls resolved the current DGB engine family before legacy observatory paths.",
          state.engine.compatible ? "The DGB engine contract matched." : "The DGB engine contract did not match or was unavailable.",
          state.inspectionLane.resolved ? "The bounded inspection lane was present." : "The bounded inspection lane was unavailable."
        ],
        Absence: [
          reason,
          "No readiness, visual pass, cycle pass, exact-nine pass, or family synchronization is claimed by this fallback report.",
          "Engine-backed report construction remains unavailable until a report adapter or diagnostic engine facade is provided."
        ],
        Direction: [
          "Inspect AUDRALIA_DROP_WITH_READ_CONTROL_PANEL_RECEIPT.",
          "Inspect DGB_ENGINE.getRuntimeReceipt().",
          "Inspect DGB_ENGINE.getAuthorityStatus().",
          "If report production is required, provide a diagnostic report adapter/facade over the DGB runtime."
        ]
      },
      engineResolution: frozenClone(state.engine),
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
        ? "<ul>" + values.map(function (entry) { return "<li>" + escapeHtml(entry) + "</li>"; }).join("") + "</ul>"
        : "<p>" + escapeHtml(values[0] || "") + "</p>")
    );
  }

  function commitReport(report, receipt, source) {
    var read = normalizeRead(report);
    var status = token(report.status || "AVAILABLE");

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
    setText("packetOutput", safeJson({ report: report, receipt: receipt }));
    setText("rawOutput", safeJson({ report: report, receipt: receipt }));
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
    var engine = resolveEngine();

    recordAction("createReport.begin", {
      source: settings.source || "CONTROL_PANEL",
      command: settings.command || "create",
      enginePath: state.engine.path,
      engineContract: state.engine.contract
    });

    if (engine && isFn(engine.createReport)) {
      try {
        return Promise.resolve(engine.createReport(settings)).then(function (report) {
          if (!isObj(report)) return createFallbackReport({ reason: "ENGINE_REPORT_RESULT_INVALID" });
          var receipt = isFn(engine.getReportReceipt) ? engine.getReportReceipt() : null;
          return commitReport(report, receipt, "ENGINE");
        }, function (error) {
          return createFallbackReport({ reason: "ENGINE_REPORT_REJECTED", error: error });
        });
      } catch (error) {
        return Promise.resolve(createFallbackReport({ reason: "ENGINE_REPORT_THROW", error: error }));
      }
    }

    return Promise.resolve(createFallbackReport({ reason: state.engine.reason || "ENGINE_REPORT_INTERFACE_UNAVAILABLE" }));
  }

  function createCycleHeldReceipt(reason) {
    return {
      schema: "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_CYCLE_RECEIPT_v3",
      receiptId: "AUDRALIA_CONTROL_CYCLE_HELD_" + Date.now(),
      status: "HELD",
      terminalClass: "CONTROL_INTERFACE_HELD",
      reason: reason || "DGB_ENGINE_DOES_NOT_EXPOSE_NINE_CYCLE",
      stationReceipts: [],
      source: "CONTROL_PANEL",
      targetLifecycle: frozenClone(state.target),
      noClaims: NO_CLAIMS,
      createdAt: nowIso()
    };
  }

  function buildCycleRenderingState(receipt) {
    var rows = {};
    STATIONS.forEach(function (station) {
      rows[station.position] = {
        station: station,
        receipts: [],
        presentationStatus: state.cycle.executed ? "NOT_REACHED" : "UNKNOWN"
      };
    });

    return {
      schema: "AUDRALIA_DROP_WITH_READ_CYCLE_RENDERING_STATE_v8",
      engineCycleStatus: token(receipt && receipt.status || "UNKNOWN"),
      engineCycleTerminalClass: receipt && receipt.terminalClass || null,
      stationReceipts: [],
      rows: rows,
      mappedReceiptCount: 0,
      unmappedReceiptCount: 0,
      duplicateCoordinateCount: 0,
      coordinateConflictCount: 0,
      unresolvedDeclarationCount: 0,
      renderedPositions: [],
      notReachedPositions: STATIONS.map(function (station) { return station.position; }),
      returnedReceiptMappingComplete: false,
      logicalMappingComplete: false,
      logicalMappingScope: "RETURNED_RECEIPTS_ONLY",
      targetLifecycle: frozenClone(state.target),
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
    var summaryNode = row.querySelector("[data-station-summary]") || row.querySelector("small");

    if (statusNode) statusNode.textContent = rowState.presentationStatus;
    if (summaryNode) summaryNode.textContent = rowState.presentationStatus === "NOT_REACHED" ? "No station receipt returned." : "Cycle not executed.";

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
    setText("cycleLedgerOutput", safeJson(rendering));
    setHtml("cycleReceiptList", '<article class="empty-state"><h4>No engine cycle receipts</h4><p>The current DGB runtime does not independently expose a Nine-Cycle receipt producer.</p></article>');

    state.cycle.rendering = deepFreeze(clone(rendering));
    state.cycle.localDomEvidence = deepFreeze({
      schema: "AUDRALIA_DROP_WITH_READ_CYCLE_LOCAL_DOM_EVIDENCE_v8",
      evidenceScope: "CONTROLS_LOCAL_OBSERVATION_AND_UPDATE_ONLY",
      localDomUpdateComplete: missingTargets.length === 0 && rowResults.every(function (r) { return r.found && r.updated; }),
      missingTargetIds: missingTargets,
      missingStationPositions: rowResults.filter(function (r) { return !r.found; }).map(function (r) { return r.position; }),
      noClaims: NO_CLAIMS,
      observedAt: nowIso()
    });
    state.cycle.renderingReceipt = deepFreeze({
      schema: "AUDRALIA_DROP_WITH_READ_CYCLE_RENDERING_RECEIPT_v8",
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
    var engine = resolveEngine();

    state.cycle.requested = true;
    state.cycle.running = true;
    setText("controllerState", "NINE-CYCLE");
    setStatus("controllerState", "RUNNING");

    recordAction("runNineCycle.begin", { enginePath: state.engine.path, engineContract: state.engine.contract });

    if (engine && isFn(engine.runNineCycle)) {
      try {
        return Promise.resolve(engine.runNineCycle({ source: "CONTROL_PANEL", requestedAt: nowIso() })).then(function (receipt) {
          state.cycle.running = false;
          state.cycle.executed = true;
          state.cycle.rawReceipt = deepFreeze(clone(receipt || createCycleHeldReceipt("ENGINE_EMPTY_CYCLE_RECEIPT")));
          renderCommittedCycleChamber();
          recordAction("runNineCycle.complete", { status: state.cycle.rawReceipt.status || null });
          return frozenClone(state.cycle.rawReceipt);
        }, function (error) {
          return holdCycle("ENGINE_CYCLE_REJECTED", error);
        });
      } catch (error) {
        return Promise.resolve(holdCycle("ENGINE_CYCLE_THROW", error));
      }
    }

    return Promise.resolve(holdCycle("DGB_ENGINE_DOES_NOT_EXPOSE_NINE_CYCLE"));
  }

  function holdCycle(reason, error) {
    var receipt = createCycleHeldReceipt(reason);
    if (error) receipt.error = String(error && error.message ? error.message : error);
    state.cycle.running = false;
    state.cycle.executed = true;
    state.cycle.rawReceipt = deepFreeze(clone(receipt));
    renderCommittedCycleChamber();
    recordAction("runNineCycle.held", { reason: reason });
    return frozenClone(receipt);
  }

  function runDirectCheck() {
    recordAction("runDirectCheck.held", { reason: "DIRECT_CHECK_NOT_EXPOSED_BY_DGB_RUNTIME" });
    setText("controllerState", "DIRECT HELD");
    setStatus("controllerState", "HELD");
    return Promise.resolve(null);
  }

  function inspectTargetFrame() {
    var frame = byId(TARGET_FRAME_ID);
    var observedRoute = null;
    var readyState = null;

    state.target.framePresent = Boolean(frame);
    state.target.declaredSrc = frame ? frame.getAttribute("src") : null;
    state.target.lastInspectedAt = nowIso();

    if (!frame) {
      state.target.lifecycleClass = "TARGET_FRAME_MISSING";
      publishReceipt();
      return frozenClone(state.target);
    }

    try {
      observedRoute = frame.contentWindow && frame.contentWindow.location ? frame.contentWindow.location.href : frame.src;
      readyState = frame.contentDocument ? frame.contentDocument.readyState : null;
    } catch (_e) {
      observedRoute = frame.src || frame.getAttribute("src");
    }

    state.target.observedRoute = observedRoute;
    state.target.observedRouteNormalized = normalizeRoutePath(observedRoute);
    state.target.routeMatched = state.target.observedRouteNormalized === state.target.expectedRouteNormalized;
    state.target.documentReadyState = readyState;
    state.target.documentLoaded = readyState === "interactive" || readyState === "complete";
    state.target.lifecycleClass = state.target.routeMatched && state.target.documentLoaded ? "TARGET_READY" : state.target.routeMatched ? "TARGET_LOADING" : "TARGET_ROUTE_MISMATCH";
    state.target.preparationReceipt = deepFreeze({
      schema: "AUDRALIA_DIAGNOSTIC_TARGET_PREPARATION_RECEIPT_v3",
      receiptId: "AUDRALIA_TARGET_PREPARATION_RECEIPT_" + Date.now(),
      controlsContract: CONTRACT,
      targetLifecycle: state.target.lifecycleClass,
      routeMatched: state.target.routeMatched,
      documentLoaded: state.target.documentLoaded,
      noClaims: NO_CLAIMS,
      generatedAt: nowIso()
    });

    publishReceipt();
    return frozenClone(state.target);
  }

  function ensureTargetReady() {
    var target = inspectTargetFrame();
    return { ready: target.lifecycleClass === "TARGET_READY", pending: target.lifecycleClass === "TARGET_LOADING", target: target };
  }

  function setTargetVisible(visible) {
    state.ui.targetVisible = Boolean(visible);
    var button = byId("toggleObservationTarget");
    if (button) button.setAttribute("aria-expanded", state.ui.targetVisible ? "true" : "false");
    publishReceipt();
    if (state.ui.targetVisible) inspectTargetFrame();
  }

  function setTargetExpanded(expanded) {
    state.ui.targetExpanded = Boolean(expanded);
    var windowNode = byId("targetWindow");
    if (windowNode) windowNode.classList.toggle("is-expanded", state.ui.targetExpanded);
    publishReceipt();
  }

  function reloadTargetFrame() {
    var frame = byId(TARGET_FRAME_ID);
    if (!frame) return false;
    state.target.navigationPending = true;
    frame.src = TARGET_ROUTE + "?diagnosticReload=" + Date.now();
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
      "EVIDENCE", read.Evidence.map(function (e) { return "- " + e; }).join("\n"),
      "",
      "ABSENCE", read.Absence.map(function (e) { return "- " + e; }).join("\n"),
      "",
      "DIRECTION", read.Direction.map(function (e) { return "- " + e; }).join("\n")
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
    setText("archiveRawOutput", safeJson(archive));
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
    setText("packetOutput", "No report packet has been created.");
    setText("rawOutput", "No raw report has been created.");
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

  function openReceiptChamber() { refreshReceiptInventory({ publish: true, render: true }); }
  function openArchiveChamber() { createDeepArchive(); }

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
      type: token(record && (record.type || record.status || "observation")).toLowerCase(),
      sourceAuthority: source || "UNKNOWN",
      label: record && (record.label || record.title || record.schema || record.contract) || source || "Receipt",
      record: frozenClone(record),
      receiptId: record && (record.receiptId || record.id || record.reportId) || null,
      path: path || null,
      groups: ["observation"].concat(record && /held|error|fail|missing/i.test(safeJson(record)) ? ["error"] : [])
    };
  }

  function collectReceiptFamilies() {
    var output = [];
    var engine = getCompatibleEngine();
    var inspection = resolveFirst(INSPECTION_PATHS);
    var inspectionApi = inspection ? inspection.value : null;

    function add(record, source, path) {
      if (!record || typeof record !== "object") return;
      output.push(normalizeReceipt(record, source, path));
    }

    add(root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE_RECEIPT, "INSPECTION_LANE", "global.inspectionReceipt");
    add(inspectionApi && isFn(inspectionApi.getReceipt) ? inspectionApi.getReceipt() : null, "INSPECTION_LANE", "inspection.getReceipt");
    add(engine && isFn(engine.getRuntimeReceipt) ? engine.getRuntimeReceipt() : null, "DGB_ENGINE", "engine.getRuntimeReceipt");
    add(engine && isFn(engine.getAuthorityStatus) ? engine.getAuthorityStatus() : null, "DGB_ENGINE", "engine.getAuthorityStatus");
    add(state.report.receipt, state.report.source || "CONTROL_PANEL", "state.report.receipt");
    add(state.target.preparationReceipt, "CONTROL_TARGET_PREPARATION", "state.target.preparationReceipt");
    add(state.cycle.rawReceipt, "CONTROL_CYCLE", "state.cycle.rawReceipt");
    add(state.cycle.renderingReceipt, "CONTROL_CYCLE_RENDERING", "state.cycle.renderingReceipt");
    add(state.lastError, "CONTROL_PANEL", "state.lastError");

    return output;
  }

  function refreshReceiptInventory(options) {
    var settings = options || {};
    state.normalizedReceipts = collectReceiptFamilies();
    state.visibleReceipts = state.normalizedReceipts;

    if (settings.render !== false) {
      setHtml("receiptList", state.visibleReceipts.length
        ? state.visibleReceipts.map(function (entry, index) {
            return '<article tabindex="0" role="button" data-receipt-index="' + index + '">' +
              "<h4>" + escapeHtml(entry.label) + "</h4><p>" + escapeHtml(entry.sourceAuthority) + "</p>" +
              (entry.receiptId ? "<small>" + escapeHtml(entry.receiptId) + "</small>" : "") +
              "</article>";
          }).join("")
        : '<article class="empty-state"><h4>No receipts</h4><p>No receipts are currently available.</p></article>');
    }

    if (settings.publish !== false) publishReceipt();
    return frozenClone(state.normalizedReceipts);
  }

  function applyReceiptFilter(filter) {
    state.ui.receiptFilter = String(filter || "all").toLowerCase();
    refreshReceiptInventory({ publish: true, render: true });
  }

  function selectReceipt(index) {
    var entry = state.visibleReceipts[Number(index)] || null;
    state.ui.selectedReceiptIndex = entry ? Number(index) : null;
    setHtml("selectedReceiptDetail", entry
      ? "<h4>" + escapeHtml(entry.label) + "</h4><pre>" + escapeHtml(safeJson(entry.record)) + "</pre>"
      : "<h4>Receipt unavailable</h4>");
    publishReceipt();
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

  function closeAllSelectors() {}

  function handleClick(event) {
    var target = event.target && isFn(event.target.closest)
      ? event.target.closest("button, a[href], [role='button'], [role='tab'], [role='option']")
      : null;
    var id;
    var cmd;

    if (!target) return;

    state.clickCount += 1;
    id = target.id || "";
    cmd = target.getAttribute("data-report-command");

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
    if (target.hasAttribute("data-receipt-index")) { event.preventDefault(); selectReceipt(target.getAttribute("data-receipt-index")); }
  }

  function bindEvents() {
    doc.addEventListener("click", handleClick);
    var frame = byId(TARGET_FRAME_ID);
    if (frame) frame.addEventListener("load", function () {
      state.target.navigationPending = false;
      state.target.loadCount += 1;
      inspectTargetFrame();
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
      engineLookupPaths: ENGINE_PATHS.slice(),
      engine: frozenClone(state.engine),
      inspectionLane: frozenClone(state.inspectionLane),
      targetLifecycle: frozenClone(state.target),
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
      inspectionLane: state.inspectionLane,
      target: state.target,
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
      resolveEngine: resolveEngine,
      closeAllSelectors: closeAllSelectors,
      renderCycleChamber: renderCommittedCycleChamber,
      refreshCycleChamber: renderCommittedCycleChamber,
      getState: getPublicState,
      getCurrentReport: function () { return frozenClone(state.report.current); },
      getCurrentReportReceipt: function () { return frozenClone(state.report.receipt); },
      getCurrentCycleReceipt: function () { return frozenClone(state.cycle.rawReceipt); },
      getCycleRenderingState: function () { return frozenClone(state.cycle.rendering); },
      getTargetLifecycleState: function () { return frozenClone(state.target); },
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

  function init() {
    if (state.initialized) return;

    state.initialized = true;
    state.initializedAt = nowIso();

    publishApi();
    bindEvents();
    inspectInspectionLane();
    inspectTargetFrame();
    inspectControls();
    resolveEngine();
    renderCommittedCycleChamber();
    refreshReceiptInventory({ publish: false, render: true });
    publishReceipt();

    setText("controllerContract", CONTRACT);
    setText("controllerState", state.engine.compatible ? "DGB ENGINE OBSERVED" : "ENGINE HELD");
    setStatus("controllerState", state.engine.compatible ? "READY" : "HELD");

    recordAction("initialize", {
      engineResolved: state.engine.resolved,
      engineCompatible: state.engine.compatible,
      engineReady: state.engine.ready,
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

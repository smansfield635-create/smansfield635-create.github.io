// /showroom/globe/audralia/diagnostic/index.controls.js
// AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_DISTRIBUTED_CONTROL_PANEL_TNT_v7
// Full-file replacement. Diagnostic-only.

(function installAudraliaDistributedDiagnosticControls(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);
  var doc = root && root.document ? root.document : null;
  if (!doc) return;

  var CONTRACT = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_DISTRIBUTED_CONTROL_PANEL_TNT_v7";
  var PREVIOUS_CONTRACT = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_DISTRIBUTED_CONTROL_PANEL_TNT_v6";
  var VERSION = "7.0.0";
  var FILE = "/showroom/globe/audralia/diagnostic/index.controls.js";
  var AUTHORITY = "F34_SOUTH_PROBE_HANDOFF_F55_SOUTH_RESTITUTION_INTERPRETATION";

  var ENGINE_CONTRACT = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE_TNT_v2";
  var INSPECTION_CONTRACT = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE_TNT_v1";
  var ENGINE_CYCLE_RECEIPT_SCHEMA = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_CYCLE_RECEIPT_v2";
  var CONTROL_RECEIPT_SCHEMA = "AUDRALIA_DROP_WITH_READ_DISTRIBUTED_CONTROL_PANEL_RECEIPT_v6";
  var CYCLE_RENDERING_RECEIPT_SCHEMA = "AUDRALIA_DROP_WITH_READ_CYCLE_RENDERING_RECEIPT_v6";
  var CONTROL_REQUIREMENTS_SCHEMA = "AUDRALIA_DIAGNOSTIC_CONTROLS_REQUIREMENTS_MANIFEST_v2";
  var TARGET_LIFECYCLE_SCHEMA = "AUDRALIA_DIAGNOSTIC_TARGET_LIFECYCLE_STATE_v2";
  var TARGET_PREPARATION_RECEIPT_SCHEMA = "AUDRALIA_DIAGNOSTIC_TARGET_PREPARATION_RECEIPT_v2";
  var FALLBACK_REPORT_SCHEMA = "AUDRALIA_DROP_WITH_READ_CONTROL_FALLBACK_REPORT_v4";
  var FALLBACK_RECEIPT_SCHEMA = "AUDRALIA_DROP_WITH_READ_CONTROL_FALLBACK_REPORT_RECEIPT_v4";

  var TARGET_ROUTE = "/showroom/globe/audralia/";
  var TARGET_FRAME_ID = "audraliaDiagnosticTargetFrame";

  var ENGINE_PATHS = Object.freeze([
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE",
    "AUDRALIA.diagnosticEngine",
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY",
    "AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER",
    "AUDRALIA.dropWithReadDiagnosticObservatory",
    "AUDRALIA.diagnosticRouteController"
  ]);

  var INSPECTION_PATHS = Object.freeze([
    "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE",
    "AUDRALIA.diagnosticInspectionLane"
  ]);

  var COMMANDS = Object.freeze([
    "create",
    "view",
    "copy-readable",
    "copy-packet",
    "copy-raw",
    "open-receipts",
    "open-archive",
    "reset"
  ]);

  var RECEIPT_FILTERS = Object.freeze([
    "all",
    "participant",
    "observation",
    "cycle",
    "error"
  ]);

  var CONTROL_IDS = Object.freeze([
    "returnToAudralia",
    "toggleObservationTarget",
    "reloadObservatory",
    "createDeepArchive",
    "resetWorkbench",
    "auditOrbitButton",
    "participantConstellationButton",
    "categorySelectorButton",
    "auditSelectorButton",
    "createReport",
    "runDirectCheck",
    "runNineCycle",
    "copyReadableReport",
    "copyPacketReport",
    "copyRawReport",
    "addReportToArchive",
    "resetCurrentReport",
    "reportReadButton",
    "reportPacketButton",
    "reportRawButton",
    "reportEvidenceButton",
    "targetLensButton",
    "runtimeLensButton",
    "surfaceLensButton",
    "targetWindowButton",
    "expandTargetWindow",
    "reloadTargetFrame",
    "cycleChamberButton",
    "registryChamberButton",
    "receiptChamberButton",
    "archiveChamberButton",
    "boundaryChamberButton"
  ]);

  var CYCLE_TARGET_IDS = Object.freeze([
    "cycleStatus",
    "cycleChamber",
    "cyclePreviewSummary",
    "cycleRegistrationSummary",
    "cyclePreflightSummary",
    "cycleExecutionSummary",
    "cycleMap",
    "cycleLedgerOutput",
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

  var REQUIREMENTS = deepFreeze({
    schema: CONTROL_REQUIREMENTS_SCHEMA,
    controlsContract: CONTRACT,
    previousControlsContract: PREVIOUS_CONTRACT,
    expectedEngineContract: ENGINE_CONTRACT,
    expectedInspectionLaneContract: INSPECTION_CONTRACT,
    expectedEngineCycleReceiptSchema: ENGINE_CYCLE_RECEIPT_SCHEMA,
    expectedTargetRoute: TARGET_ROUTE,
    targetFrameId: TARGET_FRAME_ID,
    requiredCycleTargetIds: CYCLE_TARGET_IDS.slice(),
    requiredStationPositions: STATIONS.map(function (s) { return s.position; }),
    presentationStationMap: STATIONS,
    targetPreparationOwner: "INDEX_CONTROLS",
    certificationOwner: "INDEX_CONTROL_BRIDGE",
    controlsCertificationScope: "CONTROLS_LOCAL_OBSERVATION_AND_UPDATE_EVIDENCE_ONLY",
    publicApiRequirements: [
      "createReport",
      "runDirectCheck",
      "runNineCycle",
      "viewCurrentReport",
      "copyReadableReport",
      "copyPacketReport",
      "copyRawReport",
      "executeDistributedReportCommand",
      "applyCommandContext",
      "openReceiptChamber",
      "openArchiveChamber",
      "addReportToArchive",
      "createDeepArchive",
      "resetCurrentReport",
      "resetWorkbench",
      "selectCategory",
      "selectAudit",
      "selectParticipant",
      "selectReportMode",
      "selectObservationLens",
      "selectInstrumentChamber",
      "setTargetVisible",
      "setTargetExpanded",
      "inspectTargetFrame",
      "ensureTargetReady",
      "reloadTargetFrame",
      "applyReceiptFilter",
      "selectReceipt",
      "inspectControls",
      "inspectDistributedCommands",
      "inspectInspectionLane",
      "collectReceiptFamilies",
      "refreshReceiptInventory",
      "resolveEngine",
      "closeAllSelectors",
      "renderCycleChamber",
      "refreshCycleChamber",
      "getState",
      "getCurrentReport",
      "getCurrentReportReceipt",
      "getCurrentCycleReceipt",
      "getCycleRenderingState",
      "getTargetLifecycleState",
      "getNormalizedReceipts",
      "getRequirements",
      "getReceipt"
    ],
    noClaims: NO_CLAIMS
  });

  var state = {
    initialized: false,
    initializedAt: null,
    engine: emptyEngine("ENGINE_NOT_RESOLVED"),
    inspectionLane: emptyInspection(),
    controls: {
      manifestCount: CONTROL_IDS.length,
      discoveredCount: 0,
      missingCount: 0,
      missing: [],
      createReportPresent: false,
      delegatedEventsActive: false,
      distributedDeclarationCount: 0,
      distributedDeclarations: []
    },
    ui: {
      leftOrbit: "audits",
      reportMode: "read",
      observationLens: "target",
      instrumentChamber: "cycle",
      categoryMenuOpen: false,
      auditMenuOpen: false,
      targetVisible: false,
      targetExpanded: false,
      receiptFilter: "all",
      selectedReceiptIndex: null,
      selectedCategory: "observatoryReceiver",
      selectedAudit: "observatoryIndex",
      selectedParticipant: "ALL",
      lastReportCommand: null,
      lastReportCommandSource: null
    },
    target: emptyTarget(),
    report: {
      current: null,
      receipt: null,
      source: null,
      fallbackHistory: []
    },
    directReceipts: [],
    cycle: {
      running: false,
      requested: false,
      executed: false,
      rawReceipt: null,
      rendering: null,
      renderingReceipt: null,
      localDomEvidence: null,
      renderedAt: null
    },
    normalizedReceipts: [],
    visibleReceipts: [],
    actionCount: 0,
    clickCount: 0,
    createReportClickCount: 0,
    distributedExecutionCount: 0,
    errorCount: 0,
    lastAction: null,
    lastError: null
  };

  var activeCycle = {
    promise: null,
    resolve: null,
    settled: false,
    createdAt: null
  };

  function nowIso() {
    try { return new Date().toISOString(); } catch (_e) { return null; }
  }

  function byId(id) {
    return doc.getElementById(id);
  }

  function isFn(v) {
    return typeof v === "function";
  }

  function isObj(v) {
    return Boolean(v && typeof v === "object" && !Array.isArray(v));
  }

  function hasOwn(o, k) {
    return Boolean(o && Object.prototype.hasOwnProperty.call(o, k));
  }

  function clone(v, seen) {
    var memory = seen || [];
    var out, keys;

    if (v === null || v === undefined || typeof v === "string" || typeof v === "number" || typeof v === "boolean") return v;
    if (typeof v === "bigint") return v.toString();
    if (typeof v === "function") return { type: "Function", name: v.name || "anonymous" };
    if (memory.indexOf(v) !== -1) return "[Circular]";

    memory.push(v);

    if (Array.isArray(v)) {
      return v.map(function (x) { return clone(x, memory.slice()); });
    }

    out = {};
    try { keys = Object.keys(v); } catch (_e) { return { unreadable: true }; }

    keys.forEach(function (k) {
      try { out[k] = clone(v[k], memory.slice()); } catch (_e) { out[k] = "[Unreadable]"; }
    });

    return out;
  }

  function deepFreeze(v, seen) {
    var memory = seen || [];
    if (!v || (typeof v !== "object" && typeof v !== "function")) return v;
    if (memory.indexOf(v) !== -1) return v;
    memory.push(v);
    try {
      Object.keys(v).forEach(function (k) { deepFreeze(v[k], memory); });
      Object.freeze(v);
    } catch (_e) {}
    return v;
  }

  function frozenClone(v) {
    return deepFreeze(clone(v));
  }

  function safeJson(v) {
    try { return JSON.stringify(clone(v), null, 2); } catch (_e) { return String(v); }
  }

  function escapeHtml(v) {
    return String(v === null || v === undefined ? "" : v)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function cssEscape(v) {
    if (root.CSS && isFn(root.CSS.escape)) return root.CSS.escape(String(v));
    return String(v).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  }

  function token(v) {
    return String(v === null || v === undefined ? "" : v)
      .trim()
      .toUpperCase()
      .replace(/[\s\-]+/g, "_");
  }

  function fib(v) {
    var t = token(v);
    if (!t) return "";
    if (/^\d+$/.test(t)) return "F" + t;
    return t.charAt(0) === "F" ? t : "F" + t;
  }

  function normalizeRoutePath(v) {
    var raw = String(v === null || v === undefined ? "" : v).trim();
    if (!raw) return null;
    if (raw === "about:blank") return "/blank/";
    try {
      var parsed = new root.URL(raw, root.location && root.location.href ? root.location.href : "https://diamondgatebridge.com/");
      var path = parsed.pathname || "/";
      if (path.charAt(0) !== "/") path = "/" + path;
      if (path.length > 1 && path.charAt(path.length - 1) !== "/") path += "/";
      return path;
    } catch (_e) {
      var clean = raw.split("#")[0].split("?")[0];
      if (clean.charAt(0) !== "/") clean = "/" + clean;
      if (clean.length > 1 && clean.charAt(clean.length - 1) !== "/") clean += "/";
      return clean;
    }
  }

  function readPath(path) {
    var parts = String(path || "").split(".").filter(Boolean);
    var cursor = root;
    var i;

    for (i = 0; i < parts.length; i += 1) {
      if (cursor === null || cursor === undefined) return null;
      try { cursor = cursor[parts[i]]; } catch (_e) { return null; }
    }

    return cursor === undefined ? null : cursor;
  }

  function resolveFirst(paths) {
    var i, value;
    for (i = 0; i < paths.length; i += 1) {
      value = readPath(paths[i]);
      if (value) return { path: paths[i], value: value };
    }
    return null;
  }

  function setText(id, value) {
    var n = byId(id);
    if (!n) return false;
    n.textContent = value === null || value === undefined ? "" : String(value);
    return true;
  }

  function setHtml(id, value) {
    var n = byId(id);
    if (!n) return false;
    n.innerHTML = String(value || "");
    return true;
  }

  function setHidden(id, hidden) {
    var n = byId(id);
    if (!n) return false;
    n.hidden = Boolean(hidden);
    return true;
  }

  function setDisabled(id, disabled) {
    var n = byId(id);
    if (!n) return false;
    n.disabled = Boolean(disabled);
    n.setAttribute("aria-disabled", disabled ? "true" : "false");
    return true;
  }

  function setStatus(idOrNode, status) {
    var n = typeof idOrNode === "string" ? byId(idOrNode) : idOrNode;
    if (!n) return false;
    n.setAttribute("data-status", token(status || "UNKNOWN"));
    return true;
  }

  function toast(message, status) {
    var n = byId("toast");
    if (!n) return;
    n.textContent = String(message || "");
    n.setAttribute("data-status", token(status || "READY"));
    n.classList.add("show");
    n.classList.add("visible");
    n.setAttribute("data-visible", "true");
    if (toast._timer && root.clearTimeout) root.clearTimeout(toast._timer);
    toast._timer = root.setTimeout(function () {
      n.classList.remove("show");
      n.classList.remove("visible");
      n.setAttribute("data-visible", "false");
    }, 2800);
  }

  function emptyEngine(reason) {
    return {
      resolved: false,
      compatible: false,
      ready: false,
      path: null,
      contract: null,
      status: null,
      reason: reason || "ENGINE_NOT_RESOLVED"
    };
  }

  function emptyInspection() {
    return {
      resolved: false,
      path: null,
      contract: null,
      receiptPresent: false,
      errorPresent: false
    };
  }

  function emptyTarget() {
    return {
      schema: TARGET_LIFECYCLE_SCHEMA,
      lifecycleClass: "TARGET_UNBOUND",
      framePresent: false,
      frameId: TARGET_FRAME_ID,
      expectedRoute: TARGET_ROUTE,
      expectedRouteNormalized: normalizeRoutePath(TARGET_ROUTE),
      declaredSrc: null,
      observedRoute: null,
      observedRouteNormalized: null,
      routeObserved: false,
      routeMatched: false,
      sameOriginAccessible: null,
      documentLoaded: false,
      documentReadyState: null,
      navigationPending: false,
      loadObserved: false,
      loadCount: 0,
      navigationCount: 0,
      pendingNineCycle: false,
      pendingNineCycleRequestedAt: null,
      deferredCycleReleaseCount: 0,
      lastVisibilityReason: null,
      lastVisibilityChangedAt: null,
      lastNavigationReason: null,
      lastNavigationStartedAt: null,
      lastLoadObservedAt: null,
      lastInspectedAt: null,
      lastTargetError: null,
      preparationReceipt: null
    };
  }

  function recordAction(action, detail) {
    state.actionCount += 1;
    state.lastAction = deepFreeze({
      action: action,
      detail: clone(detail || null),
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
      detail: clone(detail || null),
      errorNumber: state.errorCount,
      occurredAt: nowIso()
    });
    setText("controllerState", "CONTROL ERROR");
    setStatus("controllerState", "ERROR");
    toast(state.lastError.message, "ERROR");
    publishReceipt();
    return frozenClone(state.lastError);
  }

  function inspectInspectionLane() {
    var r = resolveFirst(INSPECTION_PATHS);
    state.inspectionLane = {
      resolved: Boolean(r),
      path: r ? r.path : null,
      contract: r && r.value ? (r.value.CONTRACT || r.value.contract || null) : null,
      receiptPresent: Boolean(root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE_RECEIPT),
      errorPresent: Boolean(root.__AUDRALIA_DIAGNOSTIC_INSPECTION_LANE_ERROR__)
    };
    publishReceipt();
    return frozenClone(state.inspectionLane);
  }

  function deriveEngineStatus(engine, publicState) {
    var candidates = [
      engine && engine.STATUS,
      engine && engine.status,
      publicState && publicState.status,
      publicState && publicState.engineStatus,
      publicState && publicState.reportStatus
    ];
    var i;
    for (i = 0; i < candidates.length; i += 1) {
      if (typeof candidates[i] === "string" && candidates[i].trim()) return token(candidates[i]);
    }
    if (publicState && publicState.initialized === true) return "READY";
    return "UNKNOWN";
  }

  function resolveEngine() {
    var i, candidate, path, contract, publicState, status;

    state.engine = emptyEngine("ENGINE_NOT_FOUND");

    for (i = 0; i < ENGINE_PATHS.length; i += 1) {
      path = ENGINE_PATHS[i];
      candidate = readPath(path);

      if (!candidate || typeof candidate !== "object") continue;

      contract = typeof candidate.CONTRACT === "string" ? candidate.CONTRACT : typeof candidate.contract === "string" ? candidate.contract : null;

      state.engine.resolved = true;
      state.engine.path = path;
      state.engine.contract = contract;

      if (contract !== ENGINE_CONTRACT) {
        state.engine.reason = "ENGINE_CONTRACT_MISMATCH";
        continue;
      }

      state.engine.compatible = true;

      try { publicState = isFn(candidate.getState) ? candidate.getState() : null; } catch (_e) { publicState = null; }

      status = deriveEngineStatus(candidate, publicState);
      state.engine.status = status;
      state.engine.ready = ["READY", "AVAILABLE", "ACTIVE"].indexOf(status) !== -1 && isFn(candidate.createReport);
      state.engine.reason = state.engine.ready ? "ENGINE_READY" : isFn(candidate.createReport) ? "ENGINE_NOT_READY" : "ENGINE_CREATE_REPORT_MISSING";

      if (state.engine.ready) {
        publishReceipt();
        return candidate;
      }
    }

    publishReceipt();
    return null;
  }

  function getCompatibleEngine() {
    var engine = resolveEngine();
    var i, c;
    if (engine) return engine;
    for (i = 0; i < ENGINE_PATHS.length; i += 1) {
      c = readPath(ENGINE_PATHS[i]);
      if (c && typeof c === "object" && (c.CONTRACT || c.contract) === ENGINE_CONTRACT) return c;
    }
    return null;
  }

  function invokeEngine(methodName, args, options) {
    var settings = options || {};
    var engine = resolveEngine();
    var result;

    if (!engine || !isFn(engine[methodName])) {
      if (isFn(settings.fallback)) {
        return Promise.resolve(settings.fallback({
          reason: !engine ? state.engine.reason : "ENGINE_METHOD_MISSING",
          methodName: methodName
        }));
      }
      return Promise.resolve(recordError(methodName, new Error(!engine ? state.engine.reason : "ENGINE_METHOD_MISSING:" + methodName)));
    }

    recordAction("invokeEngine." + methodName, {
      enginePath: state.engine.path,
      engineContract: state.engine.contract
    });

    try {
      result = engine[methodName].apply(engine, Array.isArray(args) ? args : []);
    } catch (error) {
      if (isFn(settings.fallback)) {
        return Promise.resolve(settings.fallback({
          reason: "ENGINE_METHOD_THROW",
          methodName: methodName,
          error: error
        }));
      }
      return Promise.resolve(recordError(methodName, error));
    }

    return Promise.resolve(result).then(function (value) {
      if (isFn(settings.validate) && !settings.validate(value)) {
        if (isFn(settings.fallback)) {
          return settings.fallback({
            reason: "ENGINE_RESULT_INVALID",
            methodName: methodName,
            result: clone(value)
          });
        }
        return recordError(methodName, new Error("ENGINE_RESULT_INVALID:" + methodName));
      }
      return value;
    }, function (error) {
      if (isFn(settings.fallback)) {
        return settings.fallback({
          reason: "ENGINE_METHOD_REJECTED",
          methodName: methodName,
          error: error
        });
      }
      return recordError(methodName, error);
    });
  }

  function createTargetPreparationReceipt(reason) {
    var t = state.target;
    var receipt = {
      schema: TARGET_PREPARATION_RECEIPT_SCHEMA,
      receiptId: "AUDRALIA_TARGET_PREPARATION_RECEIPT_" + Date.now(),
      controlsContract: CONTRACT,
      ownerType: "DIAGNOSTIC_OBSERVATORY_TARGET_BINDING",
      subjectId: "AUDRALIA_DIAGNOSTIC_TARGET_FRAME",
      file: FILE,
      component: "TARGET_ROUTE_BINDING",
      reason: reason || null,
      lifecycleClass: t.lifecycleClass,
      framePresent: t.framePresent,
      frameId: t.frameId,
      expectedRoute: t.expectedRoute,
      expectedRouteNormalized: t.expectedRouteNormalized,
      declaredSrc: t.declaredSrc,
      observedRoute: t.observedRoute,
      observedRouteNormalized: t.observedRouteNormalized,
      routeObserved: t.routeObserved,
      routeMatched: t.routeMatched,
      sameOriginAccessible: t.sameOriginAccessible,
      documentLoaded: t.documentLoaded,
      documentReadyState: t.documentReadyState,
      navigationPending: t.navigationPending,
      loadObserved: t.loadObserved,
      pendingNineCycle: t.pendingNineCycle,
      targetVisible: state.ui.targetVisible,
      observationLens: state.ui.observationLens,
      lastVisibilityReason: t.lastVisibilityReason,
      lastVisibilityChangedAt: t.lastVisibilityChangedAt,
      lastTargetError: t.lastTargetError,
      status: t.lifecycleClass === "TARGET_READY" ? "AVAILABLE" : "HELD",
      noClaims: NO_CLAIMS,
      generatedAt: nowIso()
    };
    state.target.preparationReceipt = deepFreeze(clone(receipt));
    return frozenClone(receipt);
  }

  function inspectTargetFrame(options) {
    var settings = options || {};
    var frame = byId(TARGET_FRAME_ID);
    var observedRoute = null;
    var observedNormalized = null;
    var sameOrigin = null;
    var loaded = false;
    var readyState = null;
    var readError = null;

    state.target.framePresent = Boolean(frame);
    state.target.declaredSrc = frame ? frame.getAttribute("src") : null;
    state.target.lastInspectedAt = nowIso();

    if (!frame) {
      state.target.lifecycleClass = "TARGET_FRAME_MISSING";
      state.target.routeObserved = false;
      state.target.routeMatched = false;
      state.target.sameOriginAccessible = null;
      state.target.documentLoaded = false;
      state.target.documentReadyState = null;
      state.target.lastTargetError = "TARGET_FRAME_NOT_FOUND";
      createTargetPreparationReceipt(settings.reason || "TARGET_FRAME_NOT_FOUND");
      publishReceipt();
      return frozenClone(state.target);
    }

    try {
      if (frame.contentWindow && frame.contentWindow.location) {
        observedRoute = frame.contentWindow.location.href || null;
        sameOrigin = true;
      }
      if (frame.contentDocument) {
        readyState = frame.contentDocument.readyState || null;
        loaded = readyState === "interactive" || readyState === "complete";
      }
    } catch (error) {
      sameOrigin = false;
      readError = String(error && error.message ? error.message : error);
    }

    if (!observedRoute) {
      try { observedRoute = frame.src || frame.getAttribute("src") || null; } catch (_e) { observedRoute = frame.getAttribute("src") || null; }
    }

    observedNormalized = normalizeRoutePath(observedRoute);

    state.target.observedRoute = observedRoute;
    state.target.observedRouteNormalized = observedNormalized;
    state.target.routeObserved = Boolean(observedRoute);
    state.target.routeMatched = Boolean(observedNormalized && observedNormalized === state.target.expectedRouteNormalized);
    state.target.sameOriginAccessible = sameOrigin;
    state.target.documentLoaded = loaded;
    state.target.documentReadyState = readyState;
    state.target.lastTargetError = readError;

    if (state.target.navigationPending && !state.target.routeMatched) {
      state.target.lifecycleClass = "TARGET_LOADING";
    } else if (sameOrigin === false) {
      state.target.lifecycleClass = "TARGET_INACCESSIBLE";
    } else if (!observedRoute || observedRoute === "about:blank" || observedNormalized === "/blank/") {
      state.target.lifecycleClass = "TARGET_UNBOUND";
    } else if (!state.target.routeMatched) {
      state.target.lifecycleClass = "TARGET_ROUTE_MISMATCH";
    } else if (!loaded) {
      state.target.lifecycleClass = "TARGET_LOADING";
    } else {
      state.target.lifecycleClass = "TARGET_READY";
    }

    createTargetPreparationReceipt(settings.reason || "TARGET_INSPECTED");
    publishReceipt();
    return frozenClone(state.target);
  }

  function beginTargetNavigation(reason, forceReload) {
    var frame = byId(TARGET_FRAME_ID);

    if (!frame) {
      state.target.framePresent = false;
      state.target.lifecycleClass = "TARGET_FRAME_MISSING";
      state.target.lastTargetError = "TARGET_FRAME_NOT_FOUND";
      createTargetPreparationReceipt(reason || "TARGET_FRAME_NOT_FOUND");
      publishReceipt();
      return false;
    }

    if (state.target.navigationPending && forceReload !== true) return true;

    state.target.framePresent = true;
    state.target.navigationPending = true;
    state.target.loadObserved = false;
    state.target.documentLoaded = false;
    state.target.documentReadyState = null;
    state.target.routeMatched = false;
    state.target.lifecycleClass = "TARGET_LOADING";
    state.target.lastTargetError = null;
    state.target.lastNavigationReason = reason || "TARGET_NAVIGATION";
    state.target.lastNavigationStartedAt = nowIso();
    state.target.navigationCount += 1;

    try {
      frame.src = TARGET_ROUTE + "?diagnosticReload=" + Date.now();
      createTargetPreparationReceipt(reason || "TARGET_NAVIGATION_STARTED");
      recordAction("targetNavigation.begin", {
        reason: reason || null,
        navigationCount: state.target.navigationCount,
        expectedRoute: TARGET_ROUTE,
        targetVisible: state.ui.targetVisible,
        observationLens: state.ui.observationLens
      });
      publishReceipt();
      return true;
    } catch (error) {
      state.target.navigationPending = false;
      state.target.lifecycleClass = "TARGET_INACCESSIBLE";
      state.target.lastTargetError = String(error && error.message ? error.message : error);
      createTargetPreparationReceipt("TARGET_NAVIGATION_THROW");
      recordError("beginTargetNavigation", error, { reason: reason || null });
      return false;
    }
  }

  function ensureTargetReady(options) {
    var settings = options || {};
    var inspected = inspectTargetFrame({ reason: settings.reason || "ENSURE_TARGET_READY" });
    var started;

    if (inspected.lifecycleClass === "TARGET_READY") {
      return { ready: true, pending: false, startedNavigation: false, target: inspected };
    }

    if (inspected.lifecycleClass === "TARGET_LOADING" && state.target.navigationPending) {
      return { ready: false, pending: true, startedNavigation: false, target: inspected };
    }

    if (inspected.lifecycleClass === "TARGET_FRAME_MISSING") {
      return { ready: false, pending: false, startedNavigation: false, target: inspected };
    }

    started = beginTargetNavigation(settings.reason || "ENSURE_TARGET_READY", settings.forceReload === true);
    return { ready: false, pending: Boolean(started), startedNavigation: Boolean(started), target: frozenClone(state.target) };
  }

  function validateReport(report) {
    return Boolean(isObj(report) && (report.reportId || report.schema || report.READ || report.read));
  }

  function normalizeRead(report) {
    var r = report && report.READ ? report.READ : report && report.read ? report.read : null;
    return {
      Result: r && r.Result !== undefined ? r.Result : r && r.result !== undefined ? r.result : "A diagnostic report was created.",
      Evidence: r && Array.isArray(r.Evidence) ? r.Evidence : r && Array.isArray(r.evidence) ? r.evidence : [],
      Absence: r && Array.isArray(r.Absence) ? r.Absence : r && Array.isArray(r.absence) ? r.absence : [],
      Direction: r && Array.isArray(r.Direction) ? r.Direction : r && Array.isArray(r.direction) ? r.direction : []
    };
  }

  function renderReadRegion(id, letter, label, headline, entries) {
    var values = Array.isArray(entries) ? entries : [entries];
    setHtml(id,
      "<header><span>" + escapeHtml(letter) + "</span><div><p>" +
      escapeHtml(label) + "</p><strong>" + escapeHtml(headline) +
      "</strong></div></header>" +
      (values.length > 1
        ? "<ul>" + values.map(function (e) { return "<li>" + escapeHtml(e) + "</li>"; }).join("") + "</ul>"
        : "<p>" + escapeHtml(values[0] || "") + "</p>")
    );
  }

  function deriveReadableReport(report, receipt) {
    var r = normalizeRead(report);
    return [
      "AUDRALIA DROP WITH READ DIAGNOSTIC REPORT",
      "REPORT_ID=" + String(report.reportId || "UNKNOWN"),
      "STATUS=" + String(report.status || "AVAILABLE"),
      "CREATED_AT=" + String(report.createdAt || "UNKNOWN"),
      receipt ? "RECEIPT_ID=" + String(receipt.receiptId || "UNKNOWN") : "RECEIPT_ID=UNAVAILABLE",
      "",
      "RESULT",
      String(r.Result),
      "",
      "EVIDENCE",
      r.Evidence.length ? r.Evidence.map(function (e) { return "- " + e; }).join("\n") : "- No evidence entries were returned.",
      "",
      "ABSENCE",
      r.Absence.length ? r.Absence.map(function (e) { return "- " + e; }).join("\n") : "- No absence entries were returned.",
      "",
      "DIRECTION",
      r.Direction.length ? r.Direction.map(function (e) { return "- " + e; }).join("\n") : "- Inspect the report receipt."
    ].join("\n");
  }

  function commitReport(report, receipt, source) {
    var r = normalizeRead(report);
    var status = token(report.status || "AVAILABLE");

    state.report.current = deepFreeze(clone(report));
    state.report.receipt = receipt ? deepFreeze(clone(receipt)) : null;
    state.report.source = source;

    renderReadRegion("readResult", "R", "Result", "Diagnostic report", r.Result);
    renderReadRegion("readEvidence", "E", "Evidence", "Bounded evidence", r.Evidence.length ? r.Evidence : ["No evidence entries were returned."]);
    renderReadRegion("readAbsence", "A", "Absence", "Bounded absence", r.Absence.length ? r.Absence : ["No absence entries were returned."]);
    renderReadRegion("readDirection", "D", "Direction", "Next diagnostic direction", r.Direction.length ? r.Direction : ["Inspect the report receipt."]);

    setText("reportStatus", status);
    setStatus("reportStatus", status);
    setText("reportTitle", "Diagnostic Report");
    setText("reportCreatedAt", report.createdAt || nowIso());
    setText("reportMeta", [report.reportId || "REPORT", receipt && receipt.receiptId ? receipt.receiptId : "RECEIPT UNAVAILABLE"].join(" · "));
    setText("packetOutput", safeJson({ schema: report.schema || null, reportId: report.reportId || null, status: report.status || null, createdAt: report.createdAt || null, READ: r, receipt: receipt || null }));
    setText("rawOutput", safeJson({ report: report, receipt: receipt }));
    setHtml("evidenceOutput", r.Evidence.length
      ? r.Evidence.map(function (e) { return "<article><h3>Diagnostic Evidence</h3><p>" + escapeHtml(e) + "</p></article>"; }).join("")
      : '<article class="empty-state"><h3>No evidence entries</h3><p>The report did not include an evidence list.</p></article>');

    setDisabled("copyReadableReport", false);
    setDisabled("copyPacketReport", false);
    setDisabled("copyRawReport", false);
    setDisabled("addReportToArchive", source === "CONTROL_FALLBACK");

    setText("dropReportState", status);
    setStatus("dropReportCell", status);
    setText("dropReportAvailableCount", "1");
    setText("dropReportHeldCount", status === "HELD" ? "1" : "0");
    setText("dropReportLastAction", "Report created at " + String(report.createdAt || nowIso()));
    setText("controllerState", source === "CONTROL_FALLBACK" ? "ENGINE HELD" : "REPORT READY");
    setStatus("controllerState", source === "CONTROL_FALLBACK" ? "HELD" : "READY");

    selectReportModeLocal("read");
    updateDistributedCommandAvailability();
    refreshReceiptInventory({ publish: false });
    publishReceipt();

    return frozenClone(state.report.current);
  }

  function createFallbackReport(context) {
    var reason = context && context.reason ? context.reason : "ENGINE_UNAVAILABLE";
    var createdAt = nowIso();
    var report = {
      schema: FALLBACK_REPORT_SCHEMA,
      reportId: "AUDRALIA_CONTROL_FALLBACK_" + Date.now(),
      status: "HELD",
      classification: "CONTROL_FALLBACK_REPORT",
      createdAt: createdAt,
      READ: {
        Result: "The report command was received, but the authoritative diagnostic engine could not produce a healthy report.",
        Evidence: [
          "A report command was received by the distributed control panel.",
          "Delegated command handling remained active.",
          "The control fallback READ path remained available.",
          state.inspectionLane.resolved ? "The bounded inspection lane was present." : "The bounded inspection lane was not present."
        ],
        Absence: [
          reason,
          context && context.error && context.error.message ? context.error.message : "No additional engine exception message was supplied.",
          "Healthy engine-backed report construction was unavailable."
        ],
        Direction: [
          "Inspect the distributed control-panel receipt.",
          "Inspect the diagnostic-engine receipt.",
          "Inspect the bounded inspection-lane receipt.",
          "Verify the current engine global and contract."
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
      reportStatus: "HELD",
      status: "HELD",
      type: "error",
      groups: ["observation", "error"],
      reason: reason,
      createdAt: createdAt
    };
    state.report.fallbackHistory.push(deepFreeze(clone(report)));
    commitReport(report, receipt, "CONTROL_FALLBACK");
    recordAction("createFallbackReport", { reportId: report.reportId, receiptId: receipt.receiptId, reason: reason });
    toast("Fallback READ report created.", "HELD");
    return frozenClone(report);
  }

  function createReport(options) {
    var settings = options || {};
    setText("controllerState", "CREATING REPORT");
    setStatus("controllerState", "RUNNING");
    setText("reportStatus", "CREATING");
    setStatus("reportStatus", "RUNNING");

    recordAction("createReport.begin", {
      category: state.ui.selectedCategory,
      audit: state.ui.selectedAudit,
      participant: state.ui.selectedParticipant,
      source: settings.source || "CANONICAL_CONTROL",
      command: settings.command || "create"
    });

    return invokeEngine("createReport", [{
      category: state.ui.selectedCategory,
      audit: state.ui.selectedAudit,
      participant: state.ui.selectedParticipant,
      controlSource: settings.source || "CANONICAL_CONTROL",
      controlCommand: settings.command || "create"
    }], {
      validate: validateReport,
      fallback: createFallbackReport
    }).then(function (result) {
      var engine, report, receipt;
      if (result && result.schema === FALLBACK_REPORT_SCHEMA) return result;

      engine = getCompatibleEngine();
      report = validateReport(result) ? result : safeCall(engine, "getReport");

      if (!validateReport(report)) {
        return createFallbackReport({ reason: "ENGINE_REPORT_UNAVAILABLE_AFTER_CREATE" });
      }

      receipt = safeCall(engine, "getReportReceipt") || root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REPORT_RECEIPT || null;
      commitReport(report, receipt, "ENGINE");

      recordAction("createReport.complete", {
        reportId: report.reportId || null,
        receiptId: receipt && receipt.receiptId ? receipt.receiptId : null,
        source: settings.source || "CANONICAL_CONTROL"
      });

      toast("Diagnostic report created.", "READY");

      if (settings.viewAfterCreate !== false) {
        viewCurrentReport({ mode: settings.mode || "read", behavior: settings.scrollBehavior || "smooth" });
      }

      return frozenClone(report);
    });
  }

  function runDirectCheck() {
    var role = state.ui.selectedParticipant;

    if (!role || role === "ALL") {
      setText("controllerState", "DIRECT HELD");
      setStatus("controllerState", "HELD");
      toast("Select a participant before direct execution.", "HELD");
      return Promise.resolve(null);
    }

    setText("controllerState", "DIRECT CHECK");
    setStatus("controllerState", "RUNNING");

    return invokeEngine("runDirect", [role, { source: "CONTROL_PANEL", requestedAt: nowIso() }], {
      validate: function (v) { return Boolean(v); },
      fallback: function (context) {
        setText("controllerState", "DIRECT HELD");
        setStatus("controllerState", "HELD");
        setText("dropDirectState", "HELD");
        setStatus("dropDirectCell", "HELD");
        setText("dropDirectHeldCount", "1");
        setText("dropDirectLastAction", "Direct execution unavailable: " + context.reason);
        return null;
      }
    }).then(function (receipt) {
      if (!receipt) return null;

      state.directReceipts.push(deepFreeze(clone(receipt)));

      setText("dropDirectState", receipt.status || "AVAILABLE");
      setStatus("dropDirectCell", receipt.status || "AVAILABLE");
      setText("dropDirectAvailableCount", receipt.status === "ERROR" ? "0" : "1");
      setText("dropDirectHeldCount", receipt.status === "HELD" || receipt.status === "MISSING" ? "1" : "0");
      setText("dropDirectLastAction", "Direct receipt created for " + role);
      setText("controllerState", "DIRECT COMPLETE");
      setStatus("controllerState", receipt.status || "AVAILABLE");

      recordAction("runDirect.complete", { role: role, status: receipt.status || null });
      refreshReceiptInventory({ publish: true });

      return frozenClone(receipt);
    });
  }

  function stationByPosition(v) {
    var p = Number(v);
    return Number.isInteger(p) && p >= 1 && p <= 9 ? STATIONS[p - 1] : null;
  }

  function stationByRole(v) {
    var t = token(v);
    var i;
    for (i = 0; i < STATIONS.length; i += 1) if (STATIONS[i].role === t) return STATIONS[i];
    return null;
  }

  function stationByFibonacci(v) {
    var f = fib(v);
    var i;
    for (i = 0; i < STATIONS.length; i += 1) if (STATIONS[i].fibonacci === f) return STATIONS[i];
    return null;
  }

  function declarationSupplied(v) {
    return !(v === null || v === undefined || String(v).trim() === "");
  }

  function resolveReceiptCoordinate(receipt) {
    var r = isObj(receipt) ? receipt : {};
    var declarations = [];
    var positions = [];
    var selected = null;

    [
      { family: "position", keys: ["cyclePosition", "position"], resolver: stationByPosition },
      { family: "station", keys: ["stationId", "role"], resolver: stationByRole },
      { family: "fibonacci", keys: ["fibonacci"], resolver: stationByFibonacci }
    ].forEach(function (family) {
      family.keys.forEach(function (key) {
        var value, station;
        if (!hasOwn(r, key) || !declarationSupplied(r[key])) return;
        value = r[key];
        station = family.resolver(value);
        declarations.push({
          family: family.family,
          key: key,
          value: value,
          resolved: Boolean(station),
          station: station,
          resolvedPosition: station ? station.position : null
        });
        if (station && positions.indexOf(station.position) === -1) positions.push(station.position);
        if (!selected && station) selected = station;
      });
    });

    return {
      selectedStation: selected,
      selectedPosition: selected ? selected.position : null,
      declarations: declarations,
      declarationCount: declarations.length,
      unresolvedDeclarations: declarations.filter(function (d) { return !d.resolved; }),
      unresolvedDeclarationCount: declarations.filter(function (d) { return !d.resolved; }).length,
      resolvedPositions: positions,
      crossFamilyConflict: positions.length > 1,
      noResolvableCoordinate: !selected,
      coordinateConflict: positions.length > 1 || !selected || declarations.some(function (d) { return !d.resolved; })
    };
  }

  function extractCycleStationReceipts(receipt) {
    var candidates = [
      receipt && receipt.stationReceipts,
      receipt && receipt.receipts,
      receipt && receipt.cycleReceipts,
      receipt && receipt.normalizedReceipts,
      receipt && receipt.stations,
      receipt && receipt.ledger,
      receipt && receipt.entries
    ];
    var i;
    for (i = 0; i < candidates.length; i += 1) {
      if (Array.isArray(candidates[i])) return candidates[i].slice();
    }
    return [];
  }

  function exactNineTriState(receipt) {
    if (!receipt) return null;
    if (typeof receipt.exactNineValidated === "boolean") return receipt.exactNineValidated;
    if (typeof receipt.exactNine === "boolean") return receipt.exactNine;
    if (receipt.validation && typeof receipt.validation.exactNineValidated === "boolean") return receipt.validation.exactNineValidated;
    return null;
  }

  function normalizeCycleReceipt(receipt, index) {
    var coord = resolveReceiptCoordinate(receipt);
    var station = coord.selectedStation;
    return {
      sourceIndex: index,
      rawReceipt: frozenClone(receipt),
      receiptId: receipt && (receipt.receiptId || receipt.stationReceiptId || receipt.id) || null,
      status: token(receipt && (receipt.status || receipt.result || receipt.state) || "UNKNOWN"),
      role: receipt && (receipt.role || receipt.stationId) || (station ? station.role : null),
      fibonacci: receipt && receipt.fibonacci || (station ? station.fibonacci : null),
      position: station ? station.position : null,
      direction: receipt && receipt.direction || (station ? station.direction : null),
      summary: receipt && (receipt.summary || receipt.message || receipt.result) || null,
      coordinates: coord
    };
  }

  function buildCycleRenderingState(rawReceipt) {
    var stationReceipts = extractCycleStationReceipts(rawReceipt);
    var normalized = stationReceipts.map(normalizeCycleReceipt);
    var rows = {};
    var unmapped = [];
    var duplicates = [];
    var conflicts = [];
    var unresolved = [];
    var mappedCount = 0;

    STATIONS.forEach(function (s) {
      rows[s.position] = {
        station: s,
        receipts: [],
        presentationStatus: state.cycle.executed ? "NOT_REACHED" : "UNKNOWN",
        coordinateConflict: false,
        duplicate: false
      };
    });

    normalized.forEach(function (entry) {
      if (entry.coordinates.coordinateConflict) conflicts.push(entry);
      unresolved = unresolved.concat(entry.coordinates.unresolvedDeclarations.map(function (d) {
        return { sourceIndex: entry.sourceIndex, receiptId: entry.receiptId, family: d.family, key: d.key, value: d.value };
      }));
      if (!entry.position) {
        unmapped.push(entry);
        return;
      }
      rows[entry.position].receipts.push(entry);
      mappedCount += 1;
    });

    Object.keys(rows).forEach(function (k) {
      var row = rows[k];
      if (!row.receipts.length) return;
      row.coordinateConflict = row.receipts.some(function (e) { return e.coordinates.coordinateConflict; });
      row.duplicate = row.receipts.length > 1;
      if (row.duplicate) duplicates.push({ position: row.station.position, receiptCount: row.receipts.length, receipts: row.receipts });
      row.presentationStatus = row.duplicate || row.coordinateConflict ? "CONFLICT" : row.receipts[0].status || "AVAILABLE";
    });

    return {
      schema: "AUDRALIA_DROP_WITH_READ_CYCLE_RENDERING_STATE_v6",
      engineCycleStatus: token(rawReceipt && rawReceipt.status ? rawReceipt.status : "UNKNOWN"),
      engineCycleTerminalClass: rawReceipt && (rawReceipt.terminalClass || rawReceipt.classification || null),
      engineExactNineValidated: exactNineTriState(rawReceipt),
      engineReceiptCount: rawReceipt && Number.isFinite(Number(rawReceipt.receiptCount)) ? Number(rawReceipt.receiptCount) : normalized.length,
      stationReceipts: normalized,
      rows: rows,
      mappedReceiptCount: mappedCount,
      unmappedReceiptCount: unmapped.length,
      unmappedReceipts: unmapped,
      duplicateCoordinateCount: duplicates.length,
      duplicateCoordinates: duplicates,
      coordinateConflictCount: conflicts.length,
      coordinateConflicts: conflicts,
      unresolvedDeclarationCount: unresolved.length,
      unresolvedDeclarations: unresolved,
      renderedPositions: Object.keys(rows).map(Number).filter(function (p) { return rows[p].receipts.length > 0; }),
      notReachedPositions: Object.keys(rows).map(Number).filter(function (p) { return rows[p].presentationStatus === "NOT_REACHED"; }),
      returnedReceiptMappingComplete: Boolean(state.cycle.executed && unmapped.length === 0 && duplicates.length === 0 && conflicts.length === 0 && unresolved.length === 0),
      logicalMappingComplete: Boolean(state.cycle.executed && unmapped.length === 0 && duplicates.length === 0 && conflicts.length === 0 && unresolved.length === 0),
      logicalMappingScope: "RETURNED_RECEIPTS_ONLY",
      targetLifecycle: frozenClone(state.target),
      createdAt: nowIso()
    };
  }

  function setCycleRunning(running) {
    state.cycle.running = Boolean(running);
    setDisabled("runNineCycle", state.cycle.running || state.target.navigationPending);
    var b = byId("runNineCycle");
    if (b) {
      b.setAttribute("aria-busy", state.cycle.running ? "true" : "false");
      b.setAttribute("data-cycle-running", state.cycle.running ? "true" : "false");
      b.setAttribute("data-target-navigation-pending", state.target.navigationPending ? "true" : "false");
    }
    publishReceipt();
  }

  function cycleRow(position) {
    return doc.querySelector('#cycleMap [data-position="' + String(position) + '"]') ||
      doc.querySelector('#cycleChamber [data-position="' + String(position) + '"]');
  }

  function renderCycleRow(position, rowState) {
    var row = cycleRow(position);
    var status, statusNode, summaryNode, roleNode, fibNode;
    var result = { position: position, found: Boolean(row), updated: false };

    if (!row) return result;

    status = rowState.presentationStatus || "UNKNOWN";

    row.setAttribute("data-status", status);
    row.setAttribute("data-position", String(position));
    row.setAttribute("data-fibonacci", rowState.station.fibonacci);
    row.setAttribute("data-role", rowState.station.role);
    row.setAttribute("data-coordinate-conflict", rowState.coordinateConflict ? "true" : "false");
    row.setAttribute("data-duplicate-coordinate", rowState.duplicate ? "true" : "false");

    statusNode = row.querySelector("[data-station-status]") || row.querySelector("[data-status-value]") || row.querySelector("b");
    summaryNode = row.querySelector("[data-station-summary]") || row.querySelector("small");
    roleNode = row.querySelector("[data-station-role]");
    fibNode = row.querySelector("[data-station-fibonacci]");

    if (statusNode) {
      statusNode.textContent = status;
      statusNode.setAttribute("data-status", status);
    }
    if (roleNode) roleNode.textContent = rowState.station.role;
    if (fibNode) fibNode.textContent = rowState.station.fibonacci;

    if (summaryNode) {
      summaryNode.textContent = !rowState.receipts.length
        ? status === "NOT_REACHED" ? "No station receipt returned after cycle execution." : "Cycle not yet executed."
        : rowState.duplicate
          ? String(rowState.receipts.length) + " receipts declared this position; all are preserved."
          : rowState.coordinateConflict
            ? "Receipt mapped with unresolved or contradictory coordinate evidence."
            : rowState.receipts[0].summary || rowState.receipts[0].receiptId || "Station receipt available.";
    }

    result.updated = true;
    return result;
  }

  function renderCycleReceiptList(rs) {
    return setHtml("cycleReceiptList", rs.stationReceipts.length
      ? rs.stationReceipts.map(function (e) {
          return '<article data-cycle-receipt-position="' +
            escapeHtml(e.position === null ? "UNMAPPED" : e.position) +
            '" data-status="' + escapeHtml(e.coordinates.coordinateConflict ? "CONFLICT" : e.status) + '">' +
            "<h4>" + escapeHtml(e.fibonacci || "UNMAPPED") + " · " + escapeHtml(e.role || "UNRESOLVED STATION") + "</h4>" +
            "<p>" + escapeHtml(e.coordinates.coordinateConflict ? "Coordinate conflict retained." : e.status) + "</p>" +
            (e.receiptId ? "<small>" + escapeHtml(e.receiptId) + "</small>" : "") +
            "<pre>" + escapeHtml(safeJson({ receipt: e.rawReceipt, coordinateEvidence: e.coordinates })) + "</pre>" +
            "</article>";
        }).join("")
      : '<article class="empty-state"><h4>No cycle receipts</h4><p>Run the Nine-Cycle to populate this chamber.</p></article>');
  }

  function observeAndUpdateCycleDom(rs) {
    var found = [];
    var updated = [];
    var missing = [];
    var rowResults;
    var summaries;
    var localComplete;

    CYCLE_TARGET_IDS.forEach(function (id) { byId(id) ? found.push(id) : missing.push(id); });

    if (setText("cycleStatus", state.cycle.running ? "Cycle · Running" : state.target.navigationPending ? "Cycle · Target Loading" : state.cycle.executed ? "Cycle · " + rs.engineCycleStatus : "Cycle · Not Run")) {
      setStatus("cycleStatus", state.cycle.running ? "RUNNING" : state.target.navigationPending ? "HELD" : state.cycle.executed ? rs.engineCycleStatus : "NOT_RUN");
      updated.push("cycleStatus");
    }

    if (byId("cycleChamber")) {
      setStatus("cycleChamber", state.cycle.running ? "RUNNING" : state.target.navigationPending ? "HELD" : state.cycle.executed ? rs.engineCycleStatus : "NOT_RUN");
      byId("cycleChamber").setAttribute("data-cycle-executed", state.cycle.executed ? "true" : "false");
      byId("cycleChamber").setAttribute("data-target-lifecycle", state.target.lifecycleClass);
      byId("cycleChamber").setAttribute("data-target-route-matched", state.target.routeMatched ? "true" : "false");
      updated.push("cycleChamber");
    }

    summaries = {
      cyclePreviewSummary: state.cycle.executed ? "Engine cycle status: " + rs.engineCycleStatus + "." : state.target.navigationPending ? "Target navigation is pending before Nine-Cycle execution." : "Nine-Cycle has not been executed.",
      cycleRegistrationSummary: [rs.mappedReceiptCount, "mapped", rs.unmappedReceiptCount, "unmapped"].join(" "),
      cyclePreflightSummary: [rs.coordinateConflictCount, "coordinate conflicts;", rs.unresolvedDeclarationCount, "unresolved declarations;", state.target.lifecycleClass].join(" "),
      cycleExecutionSummary: [rs.renderedPositions.length, "stations reached;", rs.notReachedPositions.length, "not reached"].join(" ")
    };

    Object.keys(summaries).forEach(function (id) { if (setText(id, summaries[id])) updated.push(id); });

    rowResults = STATIONS.map(function (s) { return renderCycleRow(s.position, rs.rows[s.position]); });

    if (byId("cycleMap") && rowResults.some(function (r) { return r.updated; })) updated.push("cycleMap");
    if (setText("cycleLedgerOutput", safeJson({ engineCycleStatus: rs.engineCycleStatus, engineCycleTerminalClass: rs.engineCycleTerminalClass, engineExactNineValidated: rs.engineExactNineValidated, mappedReceiptCount: rs.mappedReceiptCount, unmappedReceiptCount: rs.unmappedReceiptCount, duplicateCoordinateCount: rs.duplicateCoordinateCount, coordinateConflictCount: rs.coordinateConflictCount, unresolvedDeclarationCount: rs.unresolvedDeclarationCount, renderedPositions: rs.renderedPositions, notReachedPositions: rs.notReachedPositions, returnedReceiptMappingComplete: rs.returnedReceiptMappingComplete, targetLifecycle: frozenClone(state.target), receipts: rs.stationReceipts }))) updated.push("cycleLedgerOutput");
    if (renderCycleReceiptList(rs)) updated.push("cycleReceiptList");

    updated = updated.filter(function (v, i, a) { return a.indexOf(v) === i; });

    localComplete = Boolean(
      found.length === CYCLE_TARGET_IDS.length &&
      updated.length === CYCLE_TARGET_IDS.length &&
      rowResults.filter(function (r) { return r.found; }).length === STATIONS.length &&
      rowResults.filter(function (r) { return r.updated; }).length === STATIONS.length
    );

    return {
      schema: "AUDRALIA_DROP_WITH_READ_CYCLE_LOCAL_DOM_EVIDENCE_v6",
      evidenceScope: "CONTROLS_LOCAL_OBSERVATION_AND_UPDATE_ONLY",
      certificationOwner: "INDEX_CONTROL_BRIDGE",
      targetLifecycle: frozenClone(state.target),
      requiredTargetCount: CYCLE_TARGET_IDS.length,
      foundTargetCount: found.length,
      updatedTargetCount: updated.length,
      foundTargetIds: found,
      updatedTargetIds: updated,
      missingTargetIds: missing,
      requiredStationRowCount: STATIONS.length,
      foundStationRowCount: rowResults.filter(function (r) { return r.found; }).length,
      updatedStationRowCount: rowResults.filter(function (r) { return r.updated; }).length,
      missingStationPositions: rowResults.filter(function (r) { return !r.found; }).map(function (r) { return r.position; }),
      localDomUpdateComplete: localComplete,
      domSynchronizationComplete: localComplete,
      familySynchronizationCertified: false,
      observedAt: nowIso()
    };
  }

  function createCycleRenderingReceipt(rs, local) {
    return deepFreeze({
      schema: CYCLE_RENDERING_RECEIPT_SCHEMA,
      receiptId: "AUDRALIA_CYCLE_RENDERING_RECEIPT_" + Date.now(),
      controlsContract: CONTRACT,
      evidenceScope: "CONTROLS_LOCAL_PRESENTATION_ONLY",
      certificationOwner: "INDEX_CONTROL_BRIDGE",
      engineCycleReceiptSchema: state.cycle.rawReceipt ? state.cycle.rawReceipt.schema || null : null,
      engineCycleStatus: rs.engineCycleStatus,
      engineCycleTerminalClass: rs.engineCycleTerminalClass,
      engineExactNineValidated: rs.engineExactNineValidated,
      targetLifecycle: frozenClone(state.target),
      returnedReceiptMappingComplete: rs.returnedReceiptMappingComplete,
      logicalMappingComplete: rs.logicalMappingComplete,
      logicalMappingScope: rs.logicalMappingScope,
      localDomUpdateComplete: Boolean(local && local.localDomUpdateComplete),
      domSynchronizationComplete: Boolean(local && local.localDomUpdateComplete),
      cycleChamberSynchronized: null,
      cycleChamberSynchronizationOwner: "INDEX_CONTROL_BRIDGE",
      familySynchronizationCertified: false,
      mappedReceiptCount: rs.mappedReceiptCount,
      unmappedReceiptCount: rs.unmappedReceiptCount,
      duplicateCoordinateCount: rs.duplicateCoordinateCount,
      coordinateConflictCount: rs.coordinateConflictCount,
      unresolvedDeclarationCount: rs.unresolvedDeclarationCount,
      renderedPositions: rs.renderedPositions.slice(),
      notReachedPositions: rs.notReachedPositions.slice(),
      missingCycleTargets: local ? local.missingTargetIds.slice() : CYCLE_TARGET_IDS.slice(),
      missingStationPositions: local ? local.missingStationPositions.slice() : STATIONS.map(function (s) { return s.position; }),
      cycleButtonLockReleased: state.cycle.running === false && state.target.navigationPending === false,
      renderedAt: nowIso(),
      requirements: REQUIREMENTS,
      noClaims: NO_CLAIMS
    });
  }

  function renderCommittedCycleChamber() {
    var receipt = state.cycle.rawReceipt || { schema: ENGINE_CYCLE_RECEIPT_SCHEMA, status: "NOT_RUN", stationReceipts: [] };
    var rs = buildCycleRenderingState(receipt);
    var local = observeAndUpdateCycleDom(rs);

    state.cycle.rendering = deepFreeze(clone(rs));
    state.cycle.localDomEvidence = deepFreeze(clone(local));
    state.cycle.renderingReceipt = createCycleRenderingReceipt(rs, local);
    state.cycle.renderedAt = state.cycle.renderingReceipt.renderedAt;

    refreshReceiptInventory({ publish: false, render: false });
    publishReceipt();

    return frozenClone({
      rendering: state.cycle.rendering,
      localDomEvidence: state.cycle.localDomEvidence,
      renderingReceipt: state.cycle.renderingReceipt
    });
  }

  function validateCycleReceipt(v) {
    var schema, status, evidence;
    if (!isObj(v)) return false;
    schema = v.schema || v.receiptSchema || null;
    status = token(v.status || v.state || v.result || "");
    if (schema) return schema === ENGINE_CYCLE_RECEIPT_SCHEMA;
    evidence = Boolean(Array.isArray(v.stationReceipts) || Array.isArray(v.cycleReceipts) || v.cycleReceiptId || v.exactNineValidated !== undefined || v.exactNine !== undefined || v.terminalClass);
    return Boolean(["COMMITTED", "HELD", "ERROR"].indexOf(status) !== -1 && evidence);
  }

  function createCycleHeldReceipt(context) {
    return {
      schema: ENGINE_CYCLE_RECEIPT_SCHEMA,
      receiptId: "AUDRALIA_CONTROL_CYCLE_HELD_" + Date.now(),
      status: "HELD",
      terminalClass: "CONTROL_INTERFACE_HELD",
      reason: context && context.reason ? context.reason : "ENGINE_CYCLE_UNAVAILABLE",
      requestedAt: nowIso(),
      targetLifecycle: frozenClone(state.target),
      stationReceipts: [],
      source: "CONTROL_PANEL",
      noClaims: NO_CLAIMS
    };
  }

  function hasActiveCycle() {
    return Boolean(activeCycle.promise && activeCycle.settled === false);
  }

  function createActiveCycle() {
    if (hasActiveCycle()) return activeCycle.promise;
    activeCycle.settled = false;
    activeCycle.createdAt = nowIso();
    activeCycle.promise = new Promise(function (resolve) { activeCycle.resolve = resolve; });
    return activeCycle.promise;
  }

  function clearActiveCycle() {
    activeCycle.promise = null;
    activeCycle.resolve = null;
    activeCycle.settled = false;
    activeCycle.createdAt = null;
  }

  function settleActiveCycle(receipt) {
    var resolver;
    if (!hasActiveCycle() || !isFn(activeCycle.resolve)) return false;
    resolver = activeCycle.resolve;
    activeCycle.settled = true;
    activeCycle.resolve = null;
    resolver(frozenClone(receipt));
    clearActiveCycle();
    return true;
  }

  function commitCycleReceipt(receipt) {
    state.cycle.executed = true;
    state.cycle.rawReceipt = deepFreeze(clone(receipt));
    return renderCommittedCycleChamber();
  }

  function finalizeCycleExecution() {
    state.cycle.requested = false;
    state.target.pendingNineCycle = false;
    state.target.pendingNineCycleRequestedAt = null;
    setCycleRunning(false);
    if (state.cycle.rendering && state.cycle.localDomEvidence) {
      state.cycle.renderingReceipt = createCycleRenderingReceipt(state.cycle.rendering, state.cycle.localDomEvidence);
    }
    refreshReceiptInventory({ publish: false });
    publishReceipt();
  }

  function holdActiveCycle(reason) {
    var held = createCycleHeldReceipt({ reason: reason });
    state.target.pendingNineCycle = false;
    state.target.pendingNineCycleRequestedAt = null;
    state.cycle.requested = false;
    state.cycle.running = false;
    commitCycleReceipt(held);
    setCycleRunning(false);
    settleActiveCycle(held);
    refreshReceiptInventory({ publish: true });
    return frozenClone(held);
  }

  function executeNineCycle() {
    var execution;

    if (state.cycle.running) return activeCycle.promise || Promise.resolve(frozenClone(state.cycle.rawReceipt));
    if (!hasActiveCycle()) createActiveCycle();

    state.target.pendingNineCycle = false;
    state.target.pendingNineCycleRequestedAt = null;
    state.cycle.requested = true;

    setCycleRunning(true);
    setText("controllerState", "NINE-CYCLE");
    setStatus("controllerState", "RUNNING");
    setText("cycleStatus", "Cycle · Running");
    setStatus("cycleStatus", "RUNNING");

    recordAction("executeNineCycle.begin", {
      category: state.ui.selectedCategory,
      audit: state.ui.selectedAudit,
      participant: state.ui.selectedParticipant,
      targetLifecycle: state.target.lifecycleClass,
      targetRouteMatched: state.target.routeMatched
    });

    execution = invokeEngine("runNineCycle", [{
      source: "CONTROL_PANEL",
      requestedAt: nowIso(),
      category: state.ui.selectedCategory,
      audit: state.ui.selectedAudit,
      participant: state.ui.selectedParticipant,
      targetLifecycle: frozenClone(state.target)
    }], {
      validate: validateCycleReceipt,
      fallback: createCycleHeldReceipt
    }).then(function (receipt) {
      var committed = validateCycleReceipt(receipt) ? receipt : createCycleHeldReceipt({ reason: "ENGINE_CYCLE_RESULT_INVALID" });

      try {
        commitCycleReceipt(committed);
      } catch (error) {
        recordError("commitCycleReceipt", error);
        committed = createCycleHeldReceipt({ reason: "CONTROL_CYCLE_RENDERING_FAILURE" });
        state.cycle.executed = true;
        state.cycle.rawReceipt = deepFreeze(clone(committed));
      }

      setText("controllerState", token(committed.status) === "COMMITTED" ? "CYCLE COMMITTED" : "CYCLE COMPLETE");
      setStatus("controllerState", committed.status || "AVAILABLE");
      setText("cycleStatus", "Cycle · " + String(committed.status || "Available"));
      setStatus("cycleStatus", committed.status || "AVAILABLE");

      recordAction("executeNineCycle.complete", {
        status: committed.status || null,
        receiptCount: committed.receiptCount || extractCycleStationReceipts(committed).length,
        returnedReceiptMappingComplete: state.cycle.rendering ? state.cycle.rendering.returnedReceiptMappingComplete : false,
        localDomUpdateComplete: state.cycle.localDomEvidence ? state.cycle.localDomEvidence.localDomUpdateComplete : false
      });

      toast("Nine-Cycle receipt committed.", committed.status || "AVAILABLE");
      settleActiveCycle(committed);

      return frozenClone(committed);
    }).catch(function (error) {
      var held = createCycleHeldReceipt({ reason: "CONTROL_CYCLE_UNHANDLED_REJECTION" });
      state.cycle.executed = true;
      state.cycle.rawReceipt = deepFreeze(clone(held));
      try { renderCommittedCycleChamber(); } catch (renderError) { recordError("renderCommittedCycleChamber", renderError); }
      recordError("executeNineCycle", error);
      settleActiveCycle(held);
      return frozenClone(held);
    }).then(function (value) {
      finalizeCycleExecution();
      return value;
    }, function (error) {
      finalizeCycleExecution();
      throw error;
    });

    return activeCycle.promise || execution;
  }

  function applyTargetVisibilityState(visible, reason) {
    var v = Boolean(visible);
    var changed = state.ui.targetVisible !== v;
    var button;

    state.ui.targetVisible = v;
    state.target.lastVisibilityReason = reason || "TARGET_VISIBILITY_STATE";
    state.target.lastVisibilityChangedAt = nowIso();

    button = byId("toggleObservationTarget");
    if (button) {
      button.setAttribute("aria-expanded", v ? "true" : "false");
      button.textContent = v ? "Hide Target" : "Show Target";
    }

    selectObservationLensLocal(v ? "window" : "target");

    if (changed) {
      recordAction("targetVisibility.apply", { visible: v, reason: reason || null, observationLens: state.ui.observationLens });
    } else {
      publishReceipt();
    }

    return { visible: v, changed: changed, observationLens: state.ui.observationLens };
  }

  function runNineCycle() {
    var promise, readiness;

    if (hasActiveCycle()) {
      toast("Nine-Cycle execution is already active.", "HELD");
      return activeCycle.promise;
    }

    promise = createActiveCycle();
    state.cycle.requested = true;

    if (!state.ui.targetVisible || state.ui.observationLens !== "window") {
      applyTargetVisibilityState(true, "NINE_CYCLE_TARGET_PREPARATION");
    }

    readiness = ensureTargetReady({ reason: "NINE_CYCLE_REQUEST" });

    recordAction("runNineCycle.request", {
      readiness: readiness.ready,
      pending: readiness.pending,
      startedNavigation: readiness.startedNavigation,
      lifecycleClass: state.target.lifecycleClass,
      targetVisible: state.ui.targetVisible,
      observationLens: state.ui.observationLens
    });

    if (readiness.ready) {
      executeNineCycle();
      return promise;
    }

    if (readiness.pending) {
      state.target.pendingNineCycle = true;
      state.target.pendingNineCycleRequestedAt = nowIso();

      setText("controllerState", "TARGET LOADING");
      setStatus("controllerState", "HELD");
      setText("cycleStatus", "Cycle · Target Loading");
      setStatus("cycleStatus", "HELD");

      setCycleRunning(false);
      renderCommittedCycleChamber();
      createTargetPreparationReceipt("NINE_CYCLE_DEFERRED_TARGET_LOADING");

      toast("Target loading. Nine-Cycle will continue after route confirmation.", "HELD");
      return promise;
    }

    holdActiveCycle("TARGET_PREPARATION_UNAVAILABLE");
    setText("controllerState", "TARGET HELD");
    setStatus("controllerState", "HELD");
    toast("Target preparation is held.", "HELD");

    return promise;
  }

  function safeCall(owner, methodName) {
    if (!owner || !isFn(owner[methodName])) return null;
    try { return owner[methodName](); } catch (error) { recordError("safeCall." + methodName, error); return null; }
  }

  function resetCurrentReportLocal(options) {
    var settings = options || {};

    state.report.current = null;
    state.report.receipt = null;
    state.report.source = null;

    setText("reportStatus", "READY");
    setStatus("reportStatus", "READY");
    setText("reportTitle", "No report created");
    setText("reportCreatedAt", "—");
    setText("reportMeta", "Choose an audit and create a report.");

    renderReadRegion("readResult", "R", "Result", "Observatory available", "Create a report to evaluate the selected audit.");
    renderReadRegion("readEvidence", "E", "Evidence", "Control panel available", "The distributed control panel is bound.");
    renderReadRegion("readAbsence", "A", "Absence", "No report yet", "No current report is displayed.");
    renderReadRegion("readDirection", "D", "Direction", "Create the first report", "Use any Create Report command to inspect the current diagnostic state.");

    setText("packetOutput", "No report packet has been created.");
    setText("rawOutput", "No raw report has been created.");
    setHtml("evidenceOutput", '<article class="empty-state"><h3>No evidence report yet</h3><p>Create a report to collect current evidence.</p></article>');

    setDisabled("copyReadableReport", true);
    setDisabled("copyPacketReport", true);
    setDisabled("copyRawReport", true);
    setDisabled("addReportToArchive", true);

    setText("dropReportState", "READY");
    setStatus("dropReportCell", "READY");
    setText("dropReportAvailableCount", "1");
    setText("dropReportHeldCount", "0");
    setText("dropReportLastAction", "Create Report is available immediately.");

    selectReportModeLocal("read");
    updateDistributedCommandAvailability();
    refreshReceiptInventory({ publish: false });

    if (settings.record !== false) recordAction("resetCurrentReport");
    if (settings.notify !== false) toast("Current report reset.", "READY");
  }

  function resetCyclePresentation() {
    if (hasActiveCycle()) settleActiveCycle(createCycleHeldReceipt({ reason: "CONTROL_CYCLE_RESET_BEFORE_EXECUTION" }));
    else clearActiveCycle();

    state.cycle.running = false;
    state.cycle.requested = false;
    state.cycle.executed = false;
    state.cycle.rawReceipt = null;
    state.cycle.rendering = null;
    state.cycle.renderingReceipt = null;
    state.cycle.localDomEvidence = null;
    state.cycle.renderedAt = null;
    state.target.pendingNineCycle = false;
    state.target.pendingNineCycleRequestedAt = null;

    setCycleRunning(false);
    renderCommittedCycleChamber();
  }

  function resetWorkbench() {
    var engine = getCompatibleEngine();

    if (engine && isFn(engine.resetWorkbench)) {
      try { engine.resetWorkbench(); } catch (error) { recordError("resetWorkbench", error); }
    }

    resetCurrentReportLocal({ record: false, notify: false });
    state.target = emptyTarget();
    resetCyclePresentation();
    closeAllSelectors();
    selectLeftOrbitLocal("audits");
    selectObservationLensLocal("target");
    selectInstrumentChamberLocal("cycle");
    applyTargetVisibilityState(false, "RESET_WORKBENCH");
    setTargetExpanded(false);
    state.ui.receiptFilter = "all";
    state.ui.selectedReceiptIndex = null;
    refreshReceiptInventory({ publish: false });
    recordAction("resetWorkbench");
    toast("Diagnostic workbench reset.", "READY");
  }

  function createDeepArchive() {
    var engine = getCompatibleEngine();
    var archive = safeCall(engine, "getArchive");
    var merged;
    if (!Array.isArray(archive)) archive = [];
    merged = archive.concat(state.report.fallbackHistory.slice());
    setText("archiveSessionCount", merged.length);
    setText("archiveRawOutput", safeJson(merged));
    selectInstrumentChamberLocal("archive");
    recordAction("createDeepArchive", { engineRecordCount: archive.length, fallbackRecordCount: state.report.fallbackHistory.length });
    refreshReceiptInventory({ publish: true });
    return frozenClone(merged);
  }

  function openReceiptChamber() {
    selectInstrumentChamberLocal("receipts");
    refreshReceiptInventory({ publish: true });
    scrollToId("instrumentDeck");
    recordAction("openReceiptChamber");
  }

  function openArchiveChamber() {
    selectInstrumentChamberLocal("archive");
    createDeepArchive();
    scrollToId("instrumentDeck");
    recordAction("openArchiveChamber");
  }

  function scrollToId(id) {
    var n = byId(id);
    if (!n) return false;
    try { n.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (_e) {}
    return true;
  }

  function viewCurrentReport(options) {
    var settings = options || {};
    var chamber = byId("reportChamber");
    selectReportModeLocal(settings.mode || "read");

    if (!chamber) {
      recordError("viewCurrentReport", new Error("REPORT_CHAMBER_NOT_FOUND"));
      return false;
    }

    chamber.setAttribute("tabindex", "-1");
    try { chamber.scrollIntoView({ behavior: settings.behavior === "auto" ? "auto" : "smooth", block: "start", inline: "nearest" }); }
    catch (_e) { root.location.hash = "reportChamber"; }

    root.setTimeout(function () {
      try { chamber.focus({ preventScroll: true }); } catch (_e) {}
    }, 220);

    recordAction("viewCurrentReport", { reportPresent: Boolean(state.report.current), mode: state.ui.reportMode });

    if (!state.report.current) toast("Report chamber opened. Create a report to populate it.", "HELD");
    return true;
  }

  function addReportToArchive() {
    if (!state.report.current) {
      toast("No current report is available.", "HELD");
      return;
    }
    if (state.report.source === "CONTROL_FALLBACK") {
      toast("Fallback reports are not committed to the engine archive.", "HELD");
      return;
    }
    toast("The current engine report is available in the diagnostic archive.", "READY");
    recordAction("confirmReportArchived", { reportId: state.report.current.reportId || null });
  }

  function currentReadableText() {
    return state.report.current ? deriveReadableReport(state.report.current, state.report.receipt) : "";
  }

  function copyText(text, successMessage) {
    var area, copied;
    if (!text) {
      toast("No current report is available to copy.", "HELD");
      return Promise.resolve(false);
    }

    if (root.navigator && root.navigator.clipboard && isFn(root.navigator.clipboard.writeText)) {
      return root.navigator.clipboard.writeText(text).then(function () {
        toast(successMessage || "Copied.", "READY");
        return true;
      }, function () {
        return fallbackCopy(text, successMessage);
      });
    }

    return Promise.resolve(fallbackCopy(text, successMessage));

    function fallbackCopy(t, msg) {
      area = doc.createElement("textarea");
      area.value = t;
      area.setAttribute("readonly", "true");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      doc.body.appendChild(area);
      area.select();
      copied = false;
      try { copied = doc.execCommand("copy"); } catch (_e) { copied = false; }
      doc.body.removeChild(area);
      toast(copied ? msg || "Copied." : "Copy unavailable.", copied ? "READY" : "HELD");
      return copied;
    }
  }

  function copyReadableReport() {
    recordAction("copyReadableReport");
    return copyText(currentReadableText(), "Readable report copied.");
  }

  function copyPacketReport() {
    recordAction("copyPacketReport");
    return copyText(byId("packetOutput") ? byId("packetOutput").textContent : "", "Report packet copied.");
  }

  function copyRawReport() {
    recordAction("copyRawReport");
    return copyText(byId("rawOutput") ? byId("rawOutput").textContent : "", "Raw report copied.");
  }

  function setTargetVisible(visible) {
    var p = applyTargetVisibilityState(visible, visible ? "SHOW_TARGET" : "HIDE_TARGET");
    var readiness;
    if (p.visible) {
      readiness = ensureTargetReady({ reason: "SHOW_TARGET" });
      toast(readiness.ready ? "Target route available." : readiness.pending ? "Target frame loading." : "Target frame unavailable.", readiness.ready ? "READY" : readiness.pending ? "RUNNING" : "HELD");
    }
    publishReceipt();
  }

  function setTargetExpanded(expanded) {
    var w = byId("targetWindow");
    var b = byId("expandTargetWindow");
    state.ui.targetExpanded = Boolean(expanded);
    if (w) w.classList.toggle("is-expanded", state.ui.targetExpanded);
    if (b) {
      b.setAttribute("aria-pressed", state.ui.targetExpanded ? "true" : "false");
      b.textContent = state.ui.targetExpanded ? "Collapse" : "Expand";
    }
  }

  function reloadTargetFrame() {
    var started;
    if (!state.ui.targetVisible) applyTargetVisibilityState(true, "EXPLICIT_TARGET_RELOAD");
    started = beginTargetNavigation("EXPLICIT_TARGET_RELOAD", true);
    if (!started) {
      if (hasActiveCycle()) holdActiveCycle("TARGET_RELOAD_UNAVAILABLE");
      return;
    }
    recordAction("reloadTargetFrame");
    setCycleRunning(false);
    toast("Target frame reloading.", "RUNNING");
  }

  function forwardSelection(key, value) {
    var engine = getCompatibleEngine();
    var selection = {};
    selection[key] = value;
    if (engine && isFn(engine.setSelection)) {
      try { engine.setSelection(selection); } catch (error) { recordError("setSelection." + key, error, selection); }
    }
    recordAction("setSelection." + key, selection);
  }

  function closeAllSelectors() {
    [
      ["categorySelectorButton", "categorySelectorMenu", "categoryMenuOpen"],
      ["auditSelectorButton", "auditSelectorMenu", "auditMenuOpen"]
    ].forEach(function (x) {
      if (byId(x[0])) byId(x[0]).setAttribute("aria-expanded", "false");
      if (byId(x[1])) byId(x[1]).hidden = true;
      state.ui[x[2]] = false;
    });
  }

  function toggleSelector(buttonId, menuId, key) {
    var b = byId(buttonId);
    var m = byId(menuId);
    var open;
    if (!b || !m) {
      recordError("toggleSelector", new Error("SELECTOR_CONTROL_MISSING"), { buttonId: buttonId, menuId: menuId });
      return;
    }
    open = m.hidden;
    closeAllSelectors();
    m.hidden = !open;
    b.setAttribute("aria-expanded", open ? "true" : "false");
    state.ui[key] = open;
  }

  function selectCategory(id) {
    var option;
    if (!id) return false;
    option = doc.querySelector('[data-category-id="' + cssEscape(id) + '"]');
    if (!option) {
      recordError("selectCategory", new Error("UNSUPPORTED_CATEGORY:" + id));
      return false;
    }
    state.ui.selectedCategory = id;
    closeAllSelectors();
    Array.prototype.slice.call(doc.querySelectorAll("[data-category-id]")).forEach(function (n) { n.setAttribute("aria-selected", n === option ? "true" : "false"); });
    setText("categorySelectorLabel", option.querySelector("strong") ? option.querySelector("strong").textContent : id);
    setText("selectedCategoryLabel", option.querySelector("strong") ? option.querySelector("strong").textContent : id);
    forwardSelection("category", id);
    return true;
  }

  function selectAudit(id) {
    var option, title, summary;
    if (!id) return false;
    option = doc.querySelector('[data-audit-id="' + cssEscape(id) + '"]');
    if (!option) {
      recordError("selectAudit", new Error("UNSUPPORTED_AUDIT:" + id));
      return false;
    }
    state.ui.selectedAudit = id;
    closeAllSelectors();
    Array.prototype.slice.call(doc.querySelectorAll("[data-audit-id]")).forEach(function (n) { n.setAttribute("aria-selected", n === option ? "true" : "false"); });
    title = option.querySelector("strong");
    summary = option.querySelector("span");
    setText("auditSelectorLabel", title ? title.textContent : id);
    setText("selectedAuditTitle", title ? title.textContent : id);
    setText("selectedAuditSummary", summary ? summary.textContent : "Selected audit.");
    forwardSelection("audit", id);
    return true;
  }

  function selectParticipant(role) {
    var node;
    if (!role) return false;
    node = doc.querySelector('[data-participant-role="' + cssEscape(role) + '"][role="button"]');
    if (!node) {
      recordError("selectParticipant", new Error("UNSUPPORTED_PARTICIPANT:" + role));
      return false;
    }
    state.ui.selectedParticipant = role;
    Array.prototype.slice.call(doc.querySelectorAll('[data-participant-role][role="button"]')).forEach(function (n) { n.setAttribute("aria-selected", n === node ? "true" : "false"); });
    setHtml("participantDetail", "<h3>" + escapeHtml(node.querySelector("strong") ? node.querySelector("strong").textContent : role) + "</h3><p>Participant selected for report context and explicit diagnostic handoff.</p>");
    forwardSelection("participant", role);
    return true;
  }

  function selectLeftOrbitLocal(view) {
    var v = view === "participants" ? "participants" : "audits";
    state.ui.leftOrbit = v;
    setHidden("auditOrbit", v !== "audits");
    setHidden("participantConstellation", v !== "participants");
    Array.prototype.slice.call(doc.querySelectorAll("[data-left-orbit-view]")).forEach(function (b) {
      b.setAttribute("aria-selected", b.getAttribute("data-left-orbit-view") === v ? "true" : "false");
    });
  }

  function selectReportModeLocal(mode) {
    var v = ["read", "packet", "raw", "evidence"].indexOf(mode) !== -1 ? mode : "read";
    state.ui.reportMode = v;
    ["read", "packet", "raw", "evidence"].forEach(function (m) {
      var c = m.charAt(0).toUpperCase() + m.slice(1);
      if (byId("report" + c + "Button")) byId("report" + c + "Button").setAttribute("aria-selected", m === v ? "true" : "false");
      if (byId("report" + c + "Panel")) byId("report" + c + "Panel").hidden = m !== v;
    });
  }

  function selectObservationLensLocal(lens) {
    var v = ["target", "runtime", "surface", "window"].indexOf(lens) !== -1 ? lens : "target";
    var map = { target: "targetLens", runtime: "runtimeLens", surface: "surfaceLens", window: "targetWindow" };
    state.ui.observationLens = v;
    Object.keys(map).forEach(function (k) {
      var b = doc.querySelector('[data-observation-lens="' + k + '"]');
      var p = byId(map[k]);
      if (b) b.setAttribute("aria-selected", k === v ? "true" : "false");
      if (p) p.hidden = k !== v;
    });
  }

  function selectInstrumentChamberLocal(chamber) {
    var v = chamber === "receipt" ? "receipts" : chamber;
    var map = { cycle: "cycleChamber", registry: "registryChamber", receipts: "receiptChamber", archive: "archiveChamber", boundary: "boundaryChamber" };
    if (!map[v]) v = "cycle";
    state.ui.instrumentChamber = v;
    Object.keys(map).forEach(function (k) {
      var b = doc.querySelector('[data-instrument-chamber="' + k + '"]');
      var p = byId(map[k]);
      if (b) b.setAttribute("aria-selected", k === v ? "true" : "false");
      if (p) p.hidden = k !== v;
    });
  }

  function applyCommandContext(node) {
    var r, applied;
    if (!node) return;

    r = {
      category: node.getAttribute("data-report-category"),
      audit: node.getAttribute("data-report-audit"),
      participant: node.getAttribute("data-report-participant"),
      chamber: node.getAttribute("data-report-chamber"),
      mode: node.getAttribute("data-report-mode")
    };

    applied = {
      category: r.category ? selectCategory(r.category) : false,
      audit: r.audit ? selectAudit(r.audit) : false,
      participant: r.participant ? selectParticipant(r.participant) : false,
      chamber: false,
      mode: false
    };

    if (r.chamber) {
      selectInstrumentChamberLocal(r.chamber);
      applied.chamber = true;
    }

    if (r.mode) {
      selectReportModeLocal(r.mode);
      applied.mode = true;
    }

    recordAction("applyCommandContext", { requested: r, applied: applied });
  }

  function executeDistributedReportCommand(target, command) {
    if (!command) return false;

    state.distributedExecutionCount += 1;
    state.ui.lastReportCommand = command;
    state.ui.lastReportCommandSource = target.getAttribute("data-report-source") || target.id || target.getAttribute("data-report-chamber") || "DISTRIBUTED_CONTROL";

    applyCommandContext(target);
    recordAction("distributedReportCommand", { command: command, source: state.ui.lastReportCommandSource, commandNumber: state.distributedExecutionCount });

    if (command === "create") {
      createReport({
        source: state.ui.lastReportCommandSource,
        command: command,
        mode: target.getAttribute("data-report-mode") || "read",
        viewAfterCreate: target.getAttribute("data-report-view-after-create") !== "false"
      });
      return true;
    }

    if (command === "view") return viewCurrentReport({ mode: target.getAttribute("data-report-mode") || "read" });
    if (command === "copy-readable") return Boolean(copyReadableReport());
    if (command === "copy-packet") return Boolean(copyPacketReport());
    if (command === "copy-raw") return Boolean(copyRawReport());
    if (command === "open-receipts") { openReceiptChamber(); return true; }
    if (command === "open-archive") { openArchiveChamber(); return true; }
    if (command === "reset") { resetCurrentReportLocal({ record: true, notify: true }); return true; }

    return false;
  }

  function normalizeDistributedCommand(target) {
    var c = String(target.getAttribute("data-report-command") || "").trim().toLowerCase();
    return COMMANDS.indexOf(c) !== -1 ? c : null;
  }

  function collectReceiptFamilies() {
    var output = [];
    var engine = getCompatibleEngine();
    var inspection = resolveFirst(INSPECTION_PATHS);
    var inspectionApi = inspection ? inspection.value : null;

    addReceipt(output, root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE_RECEIPT || safeCall(inspectionApi, "getReceipt"), "INSPECTION_LANE", "inspection.receipt");
    addReceipt(output, safeCall(engine, "getEngineReceipt"), "DIAGNOSTIC_ENGINE", "engine.receipt");
    addReceipt(output, safeCall(engine, "getReportReceipt"), "DIAGNOSTIC_ENGINE", "engine.reportReceipt");
    addReceipt(output, state.report.receipt, state.report.source === "CONTROL_FALLBACK" ? "CONTROL_FALLBACK" : "CONTROL_PANEL", "state.report.receipt");
    addReceipt(output, state.target.preparationReceipt, "CONTROL_TARGET_PREPARATION", "state.target.preparationReceipt");
    addReceipt(output, state.cycle.rawReceipt, "CONTROL_CYCLE_ENGINE_RECEIPT", "state.cycle.rawReceipt");
    addReceipt(output, state.cycle.renderingReceipt, "CONTROL_CYCLE_RENDERING_RECEIPT", "state.cycle.renderingReceipt");
    state.directReceipts.forEach(function (r, i) { addReceipt(output, r, "CONTROL_DIRECT", "state.directReceipts[" + i + "]"); });
    if (state.lastError) addReceipt(output, state.lastError, "CONTROL_PANEL", "state.lastError");

    return dedupe(output);
  }

  function addReceipt(out, record, source, path) {
    if (!record) return;
    if (Array.isArray(record)) {
      record.forEach(function (r, i) { addReceipt(out, r, source, path + "[" + i + "]"); });
      return;
    }
    if (typeof record !== "object") return;
    out.push(normalizeReceipt(record, source, path));
  }

  function normalizeReceipt(record, source, path) {
    var type = receiptType(record, source, path);
    var entry = {
      type: type,
      sourceAuthority: source || "UNKNOWN",
      label: record.label || record.title || record.schema || [source || "Diagnostic", type, path || ""].filter(Boolean).join(" · "),
      record: frozenClone(record),
      groups: receiptGroups(record, type, source, path),
      participantRole: record.participantRole || record.role || record.participant || null,
      station: record.station || record.stationId || record.cycleStation || record.fibonacci || null,
      reportId: record.reportId || (record.report && record.report.reportId) || null,
      receiptId: record.receiptId || record.id || record.reportReceiptId || record.cycleReceiptId || record.stationReceiptId || null,
      path: path || null
    };
    entry.stableKey = entry.receiptId ? "receipt:" + entry.receiptId : [entry.sourceAuthority, entry.type, entry.participantRole || "", entry.station || "", entry.reportId || "", entry.label, safeJson(entry.record).slice(0, 240)].join("|");
    return entry;
  }

  function receiptType(record, source, path) {
    var text = [source, path, record.type, record.kind, record.schema, record.contract, record.role, record.station, record.status].filter(Boolean).join(" ").toLowerCase();
    if (/error|failed|failure|exception/.test(text)) return "error";
    if (/cycle|station|conductor|f1|f3|f5|f8|f13|f21|f34|f55|f89/.test(text)) return "cycle";
    if (/participant|direct|north|east|west|south|rail/.test(text)) return "participant";
    return "observation";
  }

  function receiptGroups(record, type, source, path) {
    var text = [type, source, path, record.type, record.kind, record.schema, record.contract, record.role, record.station, record.status, record.error, record.message].filter(Boolean).join(" ").toLowerCase();
    var groups = [];
    if (type === "participant" || /participant|direct|north|east|west|south|rail/.test(text)) groups.push("participant");
    if (type === "cycle" || /cycle|station|conductor|f1|f3|f5|f8|f13|f21|f34|f55|f89/.test(text)) groups.push("cycle");
    if (type === "observation" || /inspection|observation|surface|runtime|registry|engine|report|control|target/.test(text)) groups.push("observation");
    if (type === "error" || /error|failed|failure|exception|held|missing/.test(text)) groups.push("error");
    if (!groups.length) groups.push("observation");
    return groups.filter(function (v, i, a) { return RECEIPT_FILTERS.indexOf(v) !== -1 && v !== "all" && a.indexOf(v) === i; });
  }

  function dedupe(entries) {
    var seen = Object.create(null);
    var out = [];
    entries.forEach(function (e) {
      if (!e || !e.stableKey || seen[e.stableKey]) return;
      seen[e.stableKey] = true;
      out.push(e);
    });
    return out;
  }

  function refreshReceiptInventory(options) {
    var settings = options || {};
    state.normalizedReceipts = collectReceiptFamilies();
    if (settings.render !== false) renderReceiptList();
    if (settings.publish !== false) publishReceipt();
    return frozenClone(state.normalizedReceipts);
  }

  function renderReceiptList() {
    var filter = state.ui.receiptFilter;
    var visible = filter === "all" ? state.normalizedReceipts : state.normalizedReceipts.filter(function (e) { return e.groups.indexOf(filter) !== -1; });
    state.visibleReceipts = visible;

    setHtml("receiptList", visible.length
      ? visible.map(function (e, i) {
          return '<article tabindex="0" role="button" data-receipt-index="' + i + '" data-receipt-type="' + escapeHtml(e.type) + '">' +
            "<h4>" + escapeHtml(e.label) + "</h4><p>" + escapeHtml(e.sourceAuthority) + " · " + escapeHtml(e.groups.join(", ")) + "</p>" +
            (e.receiptId ? "<small>" + escapeHtml(e.receiptId) + "</small>" : "") + "</article>";
        }).join("")
      : '<article class="empty-state"><h4>No matching receipts</h4><p>No receipts match the selected filter.</p></article>');
  }

  function applyReceiptFilter(filter) {
    var f = String(filter || "all").trim().toLowerCase();
    if (RECEIPT_FILTERS.indexOf(f) === -1) f = "all";
    state.ui.receiptFilter = f;
    Array.prototype.slice.call(doc.querySelectorAll("[data-receipt-filter]")).forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-receipt-filter") === f ? "true" : "false");
    });
    renderReceiptList();
    recordAction("applyReceiptFilter", { filter: f });
  }

  function selectReceipt(index) {
    var entry = state.visibleReceipts[index] || null;
    state.ui.selectedReceiptIndex = entry ? index : null;
    if (!entry) {
      setHtml("selectedReceiptDetail", "<h4>Receipt unavailable</h4><p>The selected receipt could not be resolved.</p>");
      return;
    }
    setHtml("selectedReceiptDetail", "<h4>" + escapeHtml(entry.label) + "</h4><p>" + escapeHtml(entry.sourceAuthority) + "</p><pre>" + escapeHtml(safeJson(entry.record)) + "</pre>");
    recordAction("selectReceipt", { index: index, type: entry.type, label: entry.label, receiptId: entry.receiptId });
  }

  function inspectDistributedCommands() {
    var nodes = Array.prototype.slice.call(doc.querySelectorAll("[data-report-command]"));
    state.controls.distributedDeclarationCount = nodes.length;
    state.controls.distributedDeclarations = nodes.map(function (n) {
      return {
        id: n.id || null,
        command: n.getAttribute("data-report-command"),
        source: n.getAttribute("data-report-source"),
        category: n.getAttribute("data-report-category"),
        audit: n.getAttribute("data-report-audit"),
        participant: n.getAttribute("data-report-participant"),
        chamber: n.getAttribute("data-report-chamber"),
        mode: n.getAttribute("data-report-mode")
      };
    });
    publishReceipt();
    return frozenClone(state.controls.distributedDeclarations);
  }

  function updateDistributedCommandAvailability() {
    var present = Boolean(state.report.current);
    Array.prototype.slice.call(doc.querySelectorAll('[data-report-command="copy-readable"],[data-report-command="copy-packet"],[data-report-command="copy-raw"]')).forEach(function (n) {
      n.disabled = !present;
      n.setAttribute("aria-disabled", present ? "false" : "true");
      n.setAttribute("data-report-available", present ? "true" : "false");
    });
    Array.prototype.slice.call(doc.querySelectorAll('[data-report-command="view"]')).forEach(function (n) {
      n.setAttribute("data-report-available", present ? "true" : "false");
    });
  }

  function inspectControls() {
    var missing = [];
    CONTROL_IDS.forEach(function (id) { if (!byId(id)) missing.push(id); });
    state.controls.discoveredCount = CONTROL_IDS.length - missing.length;
    state.controls.missing = missing;
    state.controls.missingCount = missing.length;
    state.controls.createReportPresent = Boolean(byId("createReport"));
    inspectDistributedCommands();
    updateDistributedCommandAvailability();
    publishReceipt();
    return frozenClone(state.controls);
  }

  function renderEngineState() {
    inspectInspectionLane();
    if (resolveEngine()) {
      setText("controllerState", "REPORT READY");
      setStatus("controllerState", "READY");
      setText("controllerContract", CONTRACT);
      setText("dropReportState", "READY");
      setStatus("dropReportCell", "READY");
      setText("dropReportLastAction", state.inspectionLane.resolved ? "Distributed controls bound; inspection lane and engine available." : "Distributed controls bound; engine available; inspection lane absent.");
      return;
    }
    setText("controllerState", "ENGINE HELD");
    setStatus("controllerState", "HELD");
    setText("controllerContract", CONTRACT);
    setText("dropReportState", "READY");
    setStatus("dropReportCell", "READY");
    setText("dropReportLastAction", "Fallback READ report path available.");
  }

  function handleClick(event) {
    var raw = event.target;
    var target, id, cmd;
    if (!raw || !isFn(raw.closest)) return;

    target = raw.closest("button, a[href], [role='button'], [role='tab'], [role='option']");
    if (!target) {
      if (!raw.closest(".custom-selector")) closeAllSelectors();
      return;
    }

    state.clickCount += 1;
    id = target.id || "";
    cmd = normalizeDistributedCommand(target);

    if (cmd) {
      event.preventDefault();
      executeDistributedReportCommand(target, cmd);
      return;
    }

    if (id === "createReport") { event.preventDefault(); state.createReportClickCount += 1; recordAction("createReportClickObserved", { clickNumber: state.createReportClickCount }); createReport({ source: "CANONICAL_CREATE_REPORT_BUTTON", command: "create", viewAfterCreate: false }); return; }
    if (id === "runDirectCheck") { event.preventDefault(); runDirectCheck(); return; }
    if (id === "runNineCycle") { event.preventDefault(); runNineCycle(); return; }
    if (id === "copyReadableReport") { event.preventDefault(); copyReadableReport(); return; }
    if (id === "copyPacketReport") { event.preventDefault(); copyPacketReport(); return; }
    if (id === "copyRawReport") { event.preventDefault(); copyRawReport(); return; }
    if (id === "addReportToArchive") { event.preventDefault(); addReportToArchive(); return; }
    if (id === "resetCurrentReport") { event.preventDefault(); resetCurrentReportLocal({ record: true, notify: true }); return; }
    if (id === "resetWorkbench") { event.preventDefault(); resetWorkbench(); return; }
    if (id === "createDeepArchive") { event.preventDefault(); createDeepArchive(); return; }
    if (id === "reloadObservatory") { event.preventDefault(); recordAction("reloadObservatory"); root.location.reload(); return; }
    if (id === "toggleObservationTarget") { event.preventDefault(); setTargetVisible(!state.ui.targetVisible); return; }
    if (id === "expandTargetWindow") { event.preventDefault(); setTargetExpanded(!state.ui.targetExpanded); return; }
    if (id === "reloadTargetFrame") { event.preventDefault(); reloadTargetFrame(); return; }
    if (id === "categorySelectorButton") { event.preventDefault(); toggleSelector("categorySelectorButton", "categorySelectorMenu", "categoryMenuOpen"); return; }
    if (id === "auditSelectorButton") { event.preventDefault(); toggleSelector("auditSelectorButton", "auditSelectorMenu", "auditMenuOpen"); return; }

    if (target.hasAttribute("data-category-id")) { event.preventDefault(); selectCategory(target.getAttribute("data-category-id")); return; }
    if (target.hasAttribute("data-audit-id")) { event.preventDefault(); selectAudit(target.getAttribute("data-audit-id")); return; }
    if (target.hasAttribute("data-participant-role") && target.getAttribute("role") === "button") { event.preventDefault(); selectParticipant(target.getAttribute("data-participant-role")); return; }
    if (target.hasAttribute("data-left-orbit-view")) { event.preventDefault(); selectLeftOrbitLocal(target.getAttribute("data-left-orbit-view")); return; }
    if (target.hasAttribute("data-report-mode")) { event.preventDefault(); selectReportModeLocal(target.getAttribute("data-report-mode")); return; }
    if (target.hasAttribute("data-observation-lens")) { event.preventDefault(); selectObservationLensLocal(target.getAttribute("data-observation-lens")); return; }
    if (target.hasAttribute("data-instrument-chamber")) { event.preventDefault(); selectInstrumentChamberLocal(target.getAttribute("data-instrument-chamber")); return; }
    if (target.hasAttribute("data-receipt-filter")) { event.preventDefault(); applyReceiptFilter(target.getAttribute("data-receipt-filter")); return; }
    if (target.hasAttribute("data-receipt-index")) { event.preventDefault(); selectReceipt(Number(target.getAttribute("data-receipt-index"))); return; }

    if (!target.closest(".custom-selector")) closeAllSelectors();
  }

  function handleKeydown(event) {
    var raw = event.target;
    var target;
    if (!raw || !isFn(raw.closest)) return;
    target = raw.closest("[role='button'], [role='option'], [role='tab']");
    if (target && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      target.click();
      return;
    }
    if (event.key === "Escape") {
      closeAllSelectors();
      if (state.ui.targetExpanded) setTargetExpanded(false);
    }
  }

  function handleTargetFrameLoad() {
    var inspected;
    state.target.loadObserved = true;
    state.target.loadCount += 1;
    state.target.lastLoadObservedAt = nowIso();
    state.target.navigationPending = false;

    inspected = inspectTargetFrame({ reason: "TARGET_FRAME_LOAD" });

    recordAction("targetFrameLoad", {
      loadCount: state.target.loadCount,
      lifecycleClass: inspected.lifecycleClass,
      observedRoute: inspected.observedRoute,
      routeMatched: inspected.routeMatched,
      pendingNineCycle: state.target.pendingNineCycle
    });

    setCycleRunning(false);

    if (state.target.pendingNineCycle && inspected.lifecycleClass === "TARGET_READY") {
      state.target.deferredCycleReleaseCount += 1;
      recordAction("targetFrameLoad.releaseDeferredNineCycle", { releaseCount: state.target.deferredCycleReleaseCount });
      executeNineCycle();
      return;
    }

    if (state.target.pendingNineCycle && inspected.lifecycleClass !== "TARGET_READY") {
      holdActiveCycle("TARGET_LOAD_DID_NOT_CONFIRM_EXPECTED_ROUTE");
      setText("controllerState", "TARGET HELD");
      setStatus("controllerState", "HELD");
      toast("Target route was not confirmed.", "HELD");
      return;
    }

    toast(inspected.lifecycleClass === "TARGET_READY" ? "Target route available." : "Target load observed without route readiness.", inspected.lifecycleClass === "TARGET_READY" ? "READY" : "HELD");
  }

  function bindEvents() {
    doc.addEventListener("click", handleClick);
    doc.addEventListener("keydown", handleKeydown);
    if (byId(TARGET_FRAME_ID)) byId(TARGET_FRAME_ID).addEventListener("load", handleTargetFrameLoad);
    state.controls.delegatedEventsActive = true;
  }

  function publishReceipt() {
    var rendering = state.cycle.rendering;
    var local = state.cycle.localDomEvidence;

    root.AUDRALIA_DROP_WITH_READ_CONTROL_PANEL_RECEIPT = deepFreeze({
      schema: CONTROL_RECEIPT_SCHEMA,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      authority: AUTHORITY,
      initialized: state.initialized,
      initializedAt: state.initializedAt,
      delegatedEventsActive: state.controls.delegatedEventsActive,
      engineLookupPaths: ENGINE_PATHS.slice(),
      engine: frozenClone(state.engine),
      inspectionLane: frozenClone(state.inspectionLane),
      inspectionLaneExpectedContract: INSPECTION_CONTRACT,
      targetLifecycle: frozenClone(state.target),
      targetPreparationReceipt: frozenClone(state.target.preparationReceipt),
      targetVisible: state.ui.targetVisible,
      observationLens: state.ui.observationLens,
      activeCycleRequestPresent: hasActiveCycle(),
      activeCycleRequestCreatedAt: activeCycle.createdAt,
      controlManifestCount: state.controls.manifestCount,
      discoveredControlCount: state.controls.discoveredCount,
      missingControlCount: state.controls.missingCount,
      missingControls: state.controls.missing.slice(),
      createReportControlPresent: state.controls.createReportPresent,
      distributedDeclarationCount: state.controls.distributedDeclarationCount,
      distributedDeclarations: frozenClone(state.controls.distributedDeclarations),
      distributedExecutionCount: state.distributedExecutionCount,
      lastReportCommand: state.ui.lastReportCommand,
      lastReportCommandSource: state.ui.lastReportCommandSource,
      currentSelection: {
        category: state.ui.selectedCategory,
        audit: state.ui.selectedAudit,
        participant: state.ui.selectedParticipant,
        chamber: state.ui.instrumentChamber,
        reportMode: state.ui.reportMode
      },
      currentReportId: state.report.current ? state.report.current.reportId || null : null,
      currentReportReceiptId: state.report.receipt ? state.report.receipt.receiptId || null : null,
      currentReportSource: state.report.source,
      reportAvailable: Boolean(state.report.current),
      copyAvailable: Boolean(state.report.current),
      fallbackReportCount: state.report.fallbackHistory.length,
      directReceiptCount: state.directReceipts.length,
      cycleReceiptPresent: Boolean(state.cycle.rawReceipt),
      engineCycleReceiptPresent: Boolean(state.cycle.rawReceipt),
      cycleRunning: state.cycle.running,
      cycleRequested: state.cycle.requested,
      cycleExecuted: state.cycle.executed,
      engineCycleStatus: rendering ? rendering.engineCycleStatus : null,
      engineCycleTerminalClass: rendering ? rendering.engineCycleTerminalClass : null,
      engineExactNineValidated: rendering ? rendering.engineExactNineValidated : null,
      returnedReceiptMappingComplete: rendering ? rendering.returnedReceiptMappingComplete : false,
      logicalMappingComplete: rendering ? rendering.logicalMappingComplete : false,
      logicalMappingScope: rendering ? rendering.logicalMappingScope : "RETURNED_RECEIPTS_ONLY",
      localDomUpdateComplete: local ? local.localDomUpdateComplete : false,
      domSynchronizationComplete: local ? local.localDomUpdateComplete : false,
      domSynchronizationScope: "CONTROLS_LOCAL_OBSERVATION_AND_UPDATE_ONLY",
      cycleChamberSynchronized: null,
      cycleChamberSynchronizationOwner: "INDEX_CONTROL_BRIDGE",
      familySynchronizationCertified: false,
      mappedReceiptCount: rendering ? rendering.mappedReceiptCount : 0,
      unmappedReceiptCount: rendering ? rendering.unmappedReceiptCount : 0,
      duplicateCoordinateCount: rendering ? rendering.duplicateCoordinateCount : 0,
      coordinateConflictCount: rendering ? rendering.coordinateConflictCount : 0,
      unresolvedDeclarationCount: rendering ? rendering.unresolvedDeclarationCount : 0,
      renderedPositions: rendering ? rendering.renderedPositions.slice() : [],
      notReachedPositions: rendering ? rendering.notReachedPositions.slice() : [],
      missingCycleTargets: local ? local.missingTargetIds.slice() : CYCLE_TARGET_IDS.slice(),
      missingStationPositions: local ? local.missingStationPositions.slice() : STATIONS.map(function (s) { return s.position; }),
      cycleButtonLockReleased: state.cycle.running === false && state.target.navigationPending === false,
      cycleRenderedAt: state.cycle.renderedAt,
      cycleRenderingReceipt: frozenClone(state.cycle.renderingReceipt),
      normalizedReceiptCount: state.normalizedReceipts.length,
      visibleReceiptCount: state.visibleReceipts.length,
      receiptFilter: state.ui.receiptFilter,
      actionCount: state.actionCount,
      clickCount: state.clickCount,
      createReportClickCount: state.createReportClickCount,
      errorCount: state.errorCount,
      lastAction: frozenClone(state.lastAction),
      lastError: frozenClone(state.lastError),
      commandLifecycle: ["OBSERVE", "CONTEXT", "EXPOSE_TARGET", "PREPARE_TARGET", "VERIFY_TARGET", "INVOKE", "RECEIVE", "COMMIT", "RENDER", "ENABLE", "RECEIPT"],
      newsAuthority: { direction: "SOUTH", commandHandoff: "F34", restitution: "F55" },
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
      authority: AUTHORITY,
      initialized: state.initialized,
      initializedAt: state.initializedAt,
      engine: state.engine,
      inspectionLane: state.inspectionLane,
      controls: state.controls,
      ui: state.ui,
      target: state.target,
      report: state.report,
      directReceipts: state.directReceipts,
      cycleReceipt: state.cycle.rawReceipt,
      cycle: state.cycle,
      activeCycleRequest: { present: hasActiveCycle(), createdAt: activeCycle.createdAt },
      normalizedReceipts: state.normalizedReceipts,
      actionCount: state.actionCount,
      clickCount: state.clickCount,
      createReportClickCount: state.createReportClickCount,
      distributedExecutionCount: state.distributedExecutionCount,
      errorCount: state.errorCount,
      lastAction: state.lastAction,
      lastError: state.lastError,
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
      AUTHORITY: AUTHORITY,
      authority: AUTHORITY,
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
      resetCurrentReport: function () { return resetCurrentReportLocal({ record: true, notify: true }); },
      resetWorkbench: resetWorkbench,
      selectCategory: selectCategory,
      selectAudit: selectAudit,
      selectParticipant: selectParticipant,
      selectReportMode: selectReportModeLocal,
      selectObservationLens: selectObservationLensLocal,
      selectInstrumentChamber: selectInstrumentChamberLocal,
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
      getReceipt: function () { return frozenClone(root.AUDRALIA_DROP_WITH_READ_CONTROL_PANEL_RECEIPT || null); }
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

  function initializeLocalUiState() {
    selectLeftOrbitLocal("audits");
    selectReportModeLocal("read");
    selectObservationLensLocal("target");
    selectInstrumentChamberLocal("cycle");

    state.ui.targetVisible = false;
    state.ui.targetExpanded = false;

    if (byId("toggleObservationTarget")) {
      byId("toggleObservationTarget").setAttribute("aria-expanded", "false");
      byId("toggleObservationTarget").textContent = "Show Target";
    }

    setTargetExpanded(false);
    state.ui.receiptFilter = "all";

    inspectTargetFrame({ reason: "INITIAL_TARGET_INSPECTION" });
    renderCommittedCycleChamber();
  }

  function init() {
    if (state.initialized) return;

    state.initialized = true;
    state.initializedAt = nowIso();

    bindEvents();
    publishApi();
    initializeLocalUiState();
    inspectInspectionLane();
    inspectControls();
    renderEngineState();
    refreshReceiptInventory({ publish: false });
    updateDistributedCommandAvailability();
    publishReceipt();

    recordAction("initialize", {
      delegatedEventsActive: state.controls.delegatedEventsActive,
      createReportControlPresent: state.controls.createReportPresent,
      distributedDeclarationCount: state.controls.distributedDeclarationCount,
      inspectionLanePresent: state.inspectionLane.resolved,
      engineReady: state.engine.ready,
      normalizedReceiptCount: state.normalizedReceipts.length,
      targetLifecycle: state.target.lifecycleClass,
      targetFramePresent: state.target.framePresent,
      targetRouteMatched: state.target.routeMatched,
      targetVisible: state.ui.targetVisible,
      observationLens: state.ui.observationLens,
      localCycleTargetsMissing: state.cycle.localDomEvidence ? state.cycle.localDomEvidence.missingTargetIds : CYCLE_TARGET_IDS.slice(),
      localCycleStationRowsMissing: state.cycle.localDomEvidence ? state.cycle.localDomEvidence.missingStationPositions : STATIONS.map(function (s) { return s.position; }),
      relationalCertificationOwner: "INDEX_CONTROL_BRIDGE"
    });

    toast(state.engine.ready ? "Audralia distributed control panel bound." : "Control panel bound; fallback READ path active.", state.engine.ready ? "READY" : "HELD");
  }

  var existing = root.AUDRALIA_DROP_WITH_READ_CONTROL_PANEL;

  if (existing && (existing.CONTRACT === CONTRACT || existing.contract === CONTRACT)) return;

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})(
  typeof window !== "undefined"
    ? window
    : typeof globalThis !== "undefined"
      ? globalThis
      : this
);

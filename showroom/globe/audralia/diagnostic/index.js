// /showroom/globe/audralia/diagnostic/index.js
// AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE_TNT_v5
// Full-file replacement.
// Diagnostic observatory interpreter only.
// Controls owns the UI/router anchor.
// Passive inspection integration. Explicit conductor-only Nine-Cycle handoff.
// Direct Check accepts runDirect(role, payload) and routes to matching participant when available.
// No DOM event ownership. No production mutation. No repair authorization.
// API availability is not runtime readiness, visual readiness, cycle pass, WebGL, WebGPU, F21, or F89 claim.

(function installAudraliaDiagnosticEngineV5(global) {
  "use strict";

  var root = global || (typeof window !== "undefined" ? window : globalThis);
  var doc = root && root.document ? root.document : null;

  var CONTRACT = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE_TNT_v5";
  var PREVIOUS_CONTRACT = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE_TNT_v4";
  var VERSION = "5.0.0";
  var FILE = "/showroom/globe/audralia/diagnostic/index.js";
  var AUTHORITY = "AUDRALIA_DIAGNOSTIC_NEWS_FIBONACCI_AUTHORITY_ASSIGNMENT_v1";

  var REPORT_SCHEMA = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REPORT_v5";
  var REPORT_RECEIPT_SCHEMA = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REPORT_RECEIPT_v5";
  var ENGINE_RECEIPT_SCHEMA = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_ENGINE_RECEIPT_v5";
  var CYCLE_RECEIPT_SCHEMA = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_CYCLE_RECEIPT_v5";
  var DIRECT_RECEIPT_SCHEMA = "AUDRALIA_DIAGNOSTIC_DIRECT_EXECUTION_RECEIPT_v5";
  var ARCHIVE_SCHEMA = "AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_ARCHIVE_v5";
  var CYCLE_REQUEST_SCHEMA = "AUDRALIA_DIAGNOSTIC_CANONICAL_NINE_CYCLE_REQUEST_v4";
  var STATION_REQUEST_SCHEMA = "AUDRALIA_DIAGNOSTIC_STATION_EXECUTION_REQUEST_v3";
  var LANE_SCHEMA = "AUDRALIA_BOUNDED_DIAGNOSTIC_EVIDENCE_LANE_v3";

  var TARGET_ROUTE = "/showroom/globe/audralia/";
  var TARGET_FRAME_ID = "audraliaDiagnosticTargetFrame";
  var DIAGNOSTIC_ROUTE = "/showroom/globe/audralia/diagnostic/";
  var DIAGNOSTIC_HTML_FILE = "/showroom/globe/audralia/diagnostic/index.html";

  var PUBLIC_RUNTIME_ALIAS = "DGBAudraliaPlanetRuntime";
  var PUBLIC_RUNTIME_CONTRACT = "AUDRALIA_G1_PUBLIC_3D_PLANET_RUNTIME_TNT_v1";
  var PUBLIC_RUNTIME_VERSION = "1.0.0";
  var PUBLIC_RUNTIME_FILE = "/showroom/globe/audralia/index.js";
  var PUBLIC_SUBJECT_ID = "AUDRALIA_PUBLIC_3D_PLANET";
  var PUBLIC_SUBJECT_TYPE = "THREE_D_PLANET_ROUTE";
  var DIAGNOSTIC_CONSTRUCT_ID = "AUDRALIA_DIAGNOSTIC_ROUTE_READER_FIRST_ENGINE_REGISTRY_NINE_CYCLE_READ_3D";

  var LIMITS = Object.freeze({
    maxArchive: 89,
    maxEvidence: 144,
    maxText: 12000,
    maxList: 377,
    maxObjectKeys: 233,
    maxDepth: 13
  });

  var READ_KEYS = Object.freeze(["Result", "Evidence", "Absence", "Direction"]);

  var NO_CLAIMS = Object.freeze({
    productionMutationAuthorized: false,
    runtimeRepairAuthorized: false,
    rendererRepairAuthorized: false,
    canvasRepairAuthorized: false,
    routeRepairAuthorized: false,
    participantExecutionAuthorizedByInterpreter: false,
    internalStationExecutionAuthorized: false,
    sequentialFallbackAuthorized: false,
    readinessClaimed: false,
    verifiedClaimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    runtimePassClaimed: false,
    rendererPassClaimed: false,
    cyclePassClaimed: false,
    f21Claimed: false,
    f89Claimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webGPU: false
  });

  var STATIONS = Object.freeze([
    Object.freeze({ position: 1, fibonacci: "F1", stationId: "NORTH_PROBE_INTAKE", direction: "NORTH", aliases: ["AUDRALIA_DIAGNOSTIC_NORTH", "AUDRALIA.diagnosticNorth"], methods: ["executeCycleStation", "runDirect", "probe", "inspect", "run"] }),
    Object.freeze({ position: 2, fibonacci: "F3", stationId: "EAST_PROBE_SOURCE", direction: "EAST", aliases: ["AUDRALIA_DIAGNOSTIC_PROBE_EAST", "AUDRALIA.diagnosticProbeEast"], methods: ["executeCycleStation", "runDirect", "probe", "inspect", "run"] }),
    Object.freeze({ position: 3, fibonacci: "F5", stationId: "EAST_CONSTRUCTION_INTERPRETATION", direction: "EAST", aliases: ["AUDRALIA_DIAGNOSTIC_EAST", "AUDRALIA.diagnosticEast"], methods: ["executeCycleStation", "runDirect", "interpret", "construct", "run"] }),
    Object.freeze({ position: 4, fibonacci: "F8", stationId: "CANVAS_SURFACE_TRUTH", direction: "CENTER", aliases: ["CANVAS_SURFACE_TRUTH", "AUDRALIA_CANVAS_SURFACE_TRUTH", "AUDRALIA.canvasSurfaceTruth"], methods: ["executeCycleStation", "runDirect", "inspect", "probe", "run"] }),
    Object.freeze({ position: 5, fibonacci: "F13", stationId: "WEST_PROBE_RUNTIME", direction: "WEST", aliases: ["AUDRALIA_DIAGNOSTIC_PROBE_WEST", "AUDRALIA.diagnosticProbeWest"], methods: ["executeCycleStation", "runDirect", "probe", "inspect", "run"] }),
    Object.freeze({ position: 6, fibonacci: "F21", stationId: "WEST_RUNTIME_INTERPRETATION", direction: "WEST", aliases: ["AUDRALIA_DIAGNOSTIC_WEST", "AUDRALIA.diagnosticWest"], methods: ["executeCycleStation", "runDirect", "interpret", "run"] }),
    Object.freeze({ position: 7, fibonacci: "F34", stationId: "SOUTH_PROBE_HANDOFF", direction: "SOUTH", aliases: ["AUDRALIA_DIAGNOSTIC_PROBE_SOUTH", "AUDRALIA.diagnosticProbeSouth"], methods: ["executeCycleStation", "runDirect", "probe", "inspect", "run"] }),
    Object.freeze({ position: 8, fibonacci: "F55", stationId: "SOUTH_RESTITUTION_INTERPRETATION", direction: "SOUTH", aliases: ["AUDRALIA_DIAGNOSTIC_SOUTH", "AUDRALIA.diagnosticSouth"], methods: ["executeCycleStation", "runDirect", "interpret", "restore", "run"] }),
    Object.freeze({ position: 9, fibonacci: "F89", stationId: "RAIL_TERMINAL_SYNTHESIS", direction: "RAIL", aliases: ["AUDRALIA_DIAGNOSTIC_RAIL", "AUDRALIA.diagnosticRail"], methods: ["executeCycleStation", "runDirect", "synthesize", "run"] })
  ]);

  var CONDUCTOR_ALIASES = Object.freeze([
    "AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR",
    "AUDRALIA.diagnosticNorthConductor"
  ]);

  var PRODUCT_CHAIN_ALIASES = Object.freeze([
    "LAB_PRODUCT_ENGINE_F34",
    "LAB_PRODUCT_ENGINE_UE5_EXPRESSION_F55",
    "LAB_PRODUCT_ENGINE_REGISTRY_F89",
    "LAB_PRODUCT_ENGINE_MARKET_F144",
    "PRODUCT_ENGINE_F34",
    "PRODUCT_ENGINE_UE5_EXPRESSION",
    "PRODUCT_ENGINE_REGISTRY",
    "PRODUCT_ENGINE_MARKET",
    "DEXTER_LAB.productEngineF34",
    "DEXTER_LAB.productEngineUE5ExpressionF55",
    "DEXTER_LAB.productEngineRegistryF89",
    "DEXTER_LAB.productEngineMarketF144"
  ]);

  var state = {
    initialized: false,
    initializedAt: null,
    apiStatus: "INITIALIZING",
    reportStatus: "READY",
    currentReport: null,
    currentReceipt: null,
    currentDirectReceipt: null,
    currentCycleRequest: null,
    currentCycleReceipt: null,
    reportsCreated: 0,
    directExecutions: 0,
    directCompletions: 0,
    cycleExecutions: 0,
    cycleCommits: 0,
    archive: [],
    selectedCategory: "ALL",
    selectedAudit: "READ",
    selectedParticipant: "ALL",
    identityConflicts: [],
    identityAbsence: [],
    lastError: null,
    lastAction: null
  };

  function nowIso() {
    try { return new Date().toISOString(); } catch (_error) { return null; }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function isFn(value) {
    return typeof value === "function";
  }

  function safeText(value, fallback) {
    if (value === undefined || value === null) return fallback || null;
    var text = String(value).trim();
    if (!text) return fallback || null;
    return text.length > LIMITS.maxText ? text.slice(0, LIMITS.maxText) : text;
  }

  function bool(value) {
    if (typeof value === "boolean") return value;
    if (value === "true" || value === 1 || value === "1") return true;
    if (value === "false" || value === 0 || value === "0") return false;
    return null;
  }

  function clone(value, seen, depth) {
    var memory = seen || [];
    var level = depth || 0;
    var out;

    if (level > LIMITS.maxDepth) return "[DepthLimit]";
    if (value === null || value === undefined || typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
    if (typeof value === "bigint") return String(value);
    if (typeof value === "function") return { type: "Function", name: value.name || "anonymous" };
    if (memory.indexOf(value) !== -1) return "[Circular]";

    memory.push(value);

    if (Array.isArray(value)) {
      return value.slice(0, LIMITS.maxList).map(function map(item) {
        return clone(item, memory.slice(), level + 1);
      });
    }

    out = {};
    try {
      Object.keys(value).slice(0, LIMITS.maxObjectKeys).forEach(function each(key) {
        try { out[key] = clone(value[key], memory.slice(), level + 1); }
        catch (error) { out[key] = { unreadable: true, message: safeText(error && error.message ? error.message : error) }; }
      });
    } catch (_error) {
      return { unreadable: true };
    }

    return out;
  }

  function freeze(value, seen) {
    var memory = seen || [];
    if (!value || (typeof value !== "object" && typeof value !== "function")) return value;
    if (memory.indexOf(value) !== -1) return value;
    memory.push(value);
    try {
      Object.keys(value).forEach(function each(key) { freeze(value[key], memory); });
      Object.freeze(value);
    } catch (_error) {}
    return value;
  }

  function frozenClone(value) {
    return freeze(clone(value));
  }

  function hashString(value) {
    var input = String(value === undefined ? "" : value);
    var h = 0x811c9dc5;
    for (var i = 0; i < input.length; i += 1) {
      h ^= input.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return "fnv1a32:" + (h >>> 0).toString(16).padStart(8, "0");
  }

  function hashValue(value) {
    try { return hashString(JSON.stringify(clone(value))); }
    catch (_error) { return hashString(String(value)); }
  }

  function normalizeError(error, action) {
    return freeze({
      action: action || "UNKNOWN",
      message: safeText(error && error.message ? error.message : error || "UNKNOWN_ERROR", "UNKNOWN_ERROR"),
      stack: error && error.stack ? String(error.stack).slice(0, 8192) : null,
      occurredAt: nowIso()
    });
  }

  function readPath(path, base) {
    var cursor = base || root;
    var parts = String(path || "").split(".").filter(Boolean);
    for (var i = 0; i < parts.length; i += 1) {
      try {
        if (cursor === null || cursor === undefined) return null;
        cursor = cursor[parts[i]];
      } catch (_error) {
        return null;
      }
    }
    return cursor === undefined ? null : cursor;
  }

  function firstGlobal(paths) {
    for (var i = 0; i < paths.length; i += 1) {
      var value = readPath(paths[i], root);
      if (value) return { path: paths[i], value: value };
    }
    return null;
  }

  function firstValue(values) {
    for (var i = 0; i < values.length; i += 1) {
      if (values[i] !== undefined && values[i] !== null && values[i] !== "") return values[i];
    }
    return null;
  }

  function readReceipt(authority) {
    if (!authority) return null;
    try {
      if (isFn(authority.getReceiptLight)) return authority.getReceiptLight();
      if (isFn(authority.getReceipt)) return authority.getReceipt();
      if (isFn(authority.getEngineReceipt)) return authority.getEngineReceipt();
      if (authority.RECEIPT || authority.receipt || authority.contract || authority.CONTRACT) return authority;
    } catch (_error) {}
    return null;
  }

  function recordAction(action, detail) {
    state.lastAction = freeze({ action: action, detail: clone(detail || null), occurredAt: nowIso() });
    publishEngineReceipt();
  }

  function archive(record) {
    state.archive.push(freeze(clone(record)));
    while (state.archive.length > LIMITS.maxArchive) state.archive.shift();
  }

  function getInspectionLane() {
    var lane = root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_INSPECTION_LANE || (root.AUDRALIA && root.AUDRALIA.diagnosticInspectionLane) || null;
    return lane && isFn(lane.runLane) ? lane : null;
  }

  function getTargetFrame() {
    if (!doc) return null;
    try { return doc.getElementById(TARGET_FRAME_ID); } catch (_error) { return null; }
  }

  function normalizeControlsTargetLifecycle(payload) {
    var explicit = payload && payload.targetLifecycle && isObject(payload.targetLifecycle)
      ? payload.targetLifecycle
      : null;

    if (!explicit) return null;

    return freeze({
      source: "CONTROL_PANEL",
      loaded: Boolean(explicit.loaded),
      routeExpected: safeText(explicit.routeExpected, TARGET_ROUTE),
      routeObserved: safeText(explicit.routeObserved, null),
      routeMatched: Boolean(explicit.routeMatched),
      firstObservedHref: safeText(explicit.firstObservedHref, null),
      lifecycleClass: safeText(explicit.lifecycleClass, "TARGET_UNKNOWN"),
      documentReadyState: safeText(explicit.documentReadyState, null),
      navigationPending: Boolean(explicit.navigationPending),
      loadCount: Number(explicit.loadCount || 0),
      recommendedOwner: safeText(explicit.recommendedOwner, null),
      recommendedFile: safeText(explicit.recommendedFile, null),
      recommendedAction: safeText(explicit.recommendedAction, null)
    });
  }

  function inspectTargetAccess() {
    var frame = getTargetFrame();
    var out = {
      frameId: TARGET_FRAME_ID,
      framePresent: Boolean(frame),
      targetRoute: TARGET_ROUTE,
      sameOriginAccessible: false,
      documentLoaded: false,
      documentReadyState: null,
      documentPath: null,
      documentHref: null,
      documentTitle: null,
      targetWindow: null,
      error: null
    };

    if (!frame) return freeze(out);

    try {
      var win = frame.contentWindow || null;
      var targetDoc = frame.contentDocument || (win ? win.document : null);
      out.targetWindow = win;
      out.sameOriginAccessible = Boolean(win && targetDoc);
      out.documentReadyState = targetDoc && targetDoc.readyState ? String(targetDoc.readyState) : null;
      out.documentLoaded = out.documentReadyState === "complete" || out.documentReadyState === "interactive";
      out.documentPath = win && win.location ? String(win.location.pathname || "") : null;
      out.documentHref = win && win.location ? String(win.location.href || "") : null;
      out.documentTitle = targetDoc && targetDoc.title ? String(targetDoc.title) : null;
    } catch (error) {
      out.error = normalizeError(error, "inspectTargetAccess");
    }

    return freeze(out);
  }

  function getRuntimeCandidate(targetAccess) {
    var candidates = [];

    if (targetAccess && targetAccess.targetWindow) {
      ["DGBAudraliaPlanetRuntime", "DGBAudraliaPlanetRenderer", "DGBAudraliaPlanetRoute"].forEach(function each(alias) {
        try { candidates.push({ alias: alias, source: "TARGET_WINDOW", value: targetAccess.targetWindow[alias] }); } catch (_error) {}
      });
    }

    try { candidates.push({ alias: PUBLIC_RUNTIME_ALIAS, source: "CURRENT_WINDOW", value: root[PUBLIC_RUNTIME_ALIAS] }); } catch (_error2) {}

    for (var i = 0; i < candidates.length; i += 1) {
      if (candidates[i].value && (typeof candidates[i].value === "object" || typeof candidates[i].value === "function")) return candidates[i];
    }

    return null;
  }

  function getRuntimeReceipt(runtimeCandidate, targetAccess) {
    var api = runtimeCandidate ? runtimeCandidate.value : null;

    try {
      if (api && isFn(api.getReceiptLight)) return { source: "RUNTIME_API", method: "getReceiptLight", value: api.getReceiptLight() };
      if (api && isFn(api.getReceipt)) return { source: "RUNTIME_API", method: "getReceipt", value: api.getReceipt() };
    } catch (_error) {}

    try {
      if (targetAccess && targetAccess.targetWindow) {
        var v = targetAccess.targetWindow.AUDRALIA_PLANET_RUNTIME_RECEIPT || targetAccess.targetWindow.AUDRALIA_PLANET_ROUTE_RECEIPT;
        if (v) return { source: "TARGET_WINDOW", method: "published-global", value: v };
      }
    } catch (_error2) {}

    var local = root.AUDRALIA_PLANET_RUNTIME_RECEIPT || root.AUDRALIA_PLANET_ROUTE_RECEIPT || null;
    return local ? { source: "CURRENT_WINDOW", method: "published-global", value: local } : null;
  }

  function getRuntimeStatus(runtimeCandidate) {
    var api = runtimeCandidate ? runtimeCandidate.value : null;
    try {
      if (api && isFn(api.getStatus)) return { source: "RUNTIME_API", method: "getStatus", value: api.getStatus() };
      if (api && isFn(api.status)) return { source: "RUNTIME_API", method: "status", value: api.status() };
    } catch (_error) {}
    return null;
  }

  function collectProductChainEvidence() {
    var records = [];

    PRODUCT_CHAIN_ALIASES.forEach(function each(path) {
      var found = readPath(path, root);
      if (!found) return;

      var receipt = readReceipt(found);
      records.push({
        alias: path,
        contract: found.CONTRACT || found.contract || (receipt && (receipt.contract || receipt.CONTRACT)) || null,
        version: found.VERSION || found.version || (receipt && (receipt.version || receipt.VERSION)) || null,
        file: found.FILE || found.file || (receipt && (receipt.file || receipt.FILE)) || null,
        status: found.STATUS || found.status || (receipt && (receipt.status || receipt.f34ActivationStatus || receipt.f55ActivationStatus || receipt.f89ActivationStatus || receipt.f144ActivationStatus)) || null,
        passiveReceiptAvailable: Boolean(receipt),
        receiptLight: receipt ? clone(receipt) : null
      });
    });

    return freeze({
      schema: "AUDRALIA_DIAGNOSTIC_PRODUCT_ENGINE_CHAIN_PASSIVE_EVIDENCE_v3",
      recordCount: records.length,
      records: records,
      observedAt: nowIso(),
      noClaims: NO_CLAIMS
    });
  }

  function htmlDeclarations() {
    var html = doc && doc.documentElement ? doc.documentElement : null;
    var ds = html && html.dataset ? html.dataset : {};
    return freeze({
      diagnosticRoute: safeText(ds.diagnosticRoute, DIAGNOSTIC_ROUTE),
      targetRoute: safeText(ds.targetRoute, TARGET_ROUTE),
      diagnosticEngineContract: safeText(ds.diagnosticEngineContract, CONTRACT),
      inspectionLaneContract: safeText(ds.inspectionLaneContract, null),
      controlPanelContract: safeText(ds.controlPanelContract, null),
      bridgeContract: safeText(ds.controlBridgeContract, null)
    });
  }

  function candidate(value, source) {
    return value === null || value === undefined || value === "" ? null : { value: value, source: source };
  }

  function identityRecord(field, candidates) {
    var usable = (candidates || []).filter(function keep(x) {
      return x && x.value !== null && x.value !== undefined && x.value !== "";
    });

    var selected = usable[0] || null;
    var conflicts = [];

    if (selected) {
      usable.slice(1).forEach(function compare(item) {
        if (String(item.value) !== String(selected.value)) conflicts.push({ field: field, selected: clone(selected), conflicting: clone(item) });
      });
    }

    if (conflicts.length) state.identityConflicts = state.identityConflicts.concat(conflicts).slice(-64);
    if (!selected) state.identityAbsence = state.identityAbsence.concat([{ field: field, observedAt: nowIso() }]).slice(-64);

    return freeze({
      field: field,
      value: selected ? String(selected.value) : null,
      status: selected ? conflicts.length ? "CONFLICT" : "AVAILABLE" : "UNAVAILABLE",
      source: selected ? selected.source : "UNAVAILABLE",
      conflicts: conflicts
    });
  }

  function buildIdentity(payload, targetAccess, runtimeCandidate, receiptCandidate, statusCandidate) {
    var explicitSubject = isObject(payload.subject) ? payload.subject : {};
    var explicitEngine = isObject(payload.engine) ? payload.engine : {};
    var api = runtimeCandidate ? runtimeCandidate.value : null;
    var receipt = receiptCandidate ? receiptCandidate.value : null;
    var status = statusCandidate ? statusCandidate.value : null;

    var runtimeContract = firstValue([api && (api.contract || api.CONTRACT), receipt && receipt.contract, status && status.contract, PUBLIC_RUNTIME_CONTRACT]);
    var runtimeVersion = firstValue([api && (api.version || api.VERSION), receipt && receipt.version, status && status.version, PUBLIC_RUNTIME_VERSION]);
    var runtimeFile = firstValue([api && (api.file || api.FILE), receipt && receipt.file, status && status.file, PUBLIC_RUNTIME_FILE]);
    var runtimeModelId = firstValue([api && api.modelId, receipt && receipt.modelId, status && status.modelId, PUBLIC_SUBJECT_ID]);

    var records = {
      subjectId: identityRecord("subject.subjectId", [candidate(explicitSubject.subjectId, "EXPLICIT_PAYLOAD"), candidate(runtimeModelId, "RUNTIME"), candidate(PUBLIC_SUBJECT_ID, "CANONICAL")]),
      subjectType: identityRecord("subject.subjectType", [candidate(explicitSubject.subjectType, "EXPLICIT_PAYLOAD"), candidate(PUBLIC_SUBJECT_TYPE, "CANONICAL")]),
      subjectContract: identityRecord("subject.contract", [candidate(explicitSubject.contract, "EXPLICIT_PAYLOAD"), candidate(runtimeContract, "RUNTIME")]),
      subjectVersion: identityRecord("subject.version", [candidate(explicitSubject.version, "EXPLICIT_PAYLOAD"), candidate(runtimeVersion, "RUNTIME")]),
      subjectFile: identityRecord("subject.file", [candidate(explicitSubject.file, "EXPLICIT_PAYLOAD"), candidate(runtimeFile, "RUNTIME")]),
      engineContract: identityRecord("engine.contract", [candidate(explicitEngine.contract, "EXPLICIT_PAYLOAD"), candidate(runtimeContract, "RUNTIME")]),
      engineVersion: identityRecord("engine.version", [candidate(explicitEngine.version, "EXPLICIT_PAYLOAD"), candidate(runtimeVersion, "RUNTIME")]),
      engineFile: identityRecord("engine.file", [candidate(explicitEngine.file, "EXPLICIT_PAYLOAD"), candidate(runtimeFile, "RUNTIME")]),
      engineSource: identityRecord("engine.source", [candidate(explicitEngine.source, "EXPLICIT_PAYLOAD"), candidate(runtimeCandidate && runtimeCandidate.alias, "RUNTIME"), candidate(PUBLIC_RUNTIME_ALIAS, "CANONICAL")])
    };

    var all = Object.keys(records).map(function map(key) { return records[key]; });
    var conflictCount = all.reduce(function sum(total, r) { return total + (r.conflicts ? r.conflicts.length : 0); }, 0);
    var absenceFields = all.filter(function absent(r) { return !r.value; }).map(function map(r) { return r.field; });

    return freeze({
      schema: "AUDRALIA_DIAGNOSTIC_BOUNDED_IDENTITY_PACKET_v4",
      subject: {
        subjectId: records.subjectId.value,
        subjectType: records.subjectType.value,
        contract: records.subjectContract.value,
        version: records.subjectVersion.value,
        file: records.subjectFile.value
      },
      engine: {
        contract: records.engineContract.value,
        version: records.engineVersion.value,
        file: records.engineFile.value,
        source: records.engineSource.value
      },
      records: records,
      targetAccess: {
        framePresent: Boolean(targetAccess && targetAccess.framePresent),
        documentLoaded: Boolean(targetAccess && targetAccess.documentLoaded),
        sameOriginAccessible: Boolean(targetAccess && targetAccess.sameOriginAccessible)
      },
      conflictCount: conflictCount,
      absenceFields: absenceFields,
      status: absenceFields.length ? "HELD" : conflictCount ? "CONFLICT" : "AVAILABLE",
      syntheticIdentityCreated: false,
      normalizedAt: nowIso()
    });
  }

  function buildTargetPacket(payload, targetAccess, runtimeCandidate, receiptCandidate, statusCandidate) {
    var explicit = isObject(payload.target) ? payload.target : {};
    var controlsLifecycle = normalizeControlsTargetLifecycle(payload);
    var receipt = receiptCandidate ? receiptCandidate.value : null;
    var status = statusCandidate ? statusCandidate.value : null;

    var routeFromAccess = targetAccess && targetAccess.documentPath ? targetAccess.documentPath : null;
    var routeObserved = controlsLifecycle && controlsLifecycle.routeObserved ? controlsLifecycle.routeObserved : routeFromAccess;

    return freeze({
      route: safeText(explicit.route, routeFromAccess || TARGET_ROUTE),
      frameId: safeText(explicit.frameId, TARGET_FRAME_ID),
      framePresent: firstValue([bool(explicit.framePresent), targetAccess ? targetAccess.framePresent : null, false]),
      documentLoaded: firstValue([bool(explicit.documentLoaded), controlsLifecycle ? controlsLifecycle.loaded : null, targetAccess ? targetAccess.documentLoaded : null, false]),
      sameOriginAccessible: firstValue([bool(explicit.sameOriginAccessible), targetAccess ? targetAccess.sameOriginAccessible : null, false]),
      documentReadyState: firstValue([explicit.documentReadyState, controlsLifecycle ? controlsLifecycle.documentReadyState : null, targetAccess ? targetAccess.documentReadyState : null]),
      documentPath: routeFromAccess,
      documentHref: targetAccess ? targetAccess.documentHref : null,
      documentTitle: targetAccess ? targetAccess.documentTitle : null,
      controlsTargetLifecycle: frozenClone(controlsLifecycle),
      controlsRouteExpected: controlsLifecycle ? controlsLifecycle.routeExpected : TARGET_ROUTE,
      controlsRouteObserved: controlsLifecycle ? controlsLifecycle.routeObserved : null,
      controlsRouteMatched: controlsLifecycle ? controlsLifecycle.routeMatched : false,
      controlsLifecycleClass: controlsLifecycle ? controlsLifecycle.lifecycleClass : "NOT_PROVIDED",
      routeObserved: routeObserved,
      targetReadyForCycle: Boolean(controlsLifecycle && controlsLifecycle.loaded && controlsLifecycle.routeMatched),
      runtimeAlias: runtimeCandidate ? runtimeCandidate.alias : null,
      runtimeApiAvailable: Boolean(runtimeCandidate),
      runtimeReceipt: frozenClone(receipt),
      runtimeStatus: frozenClone(status),
      mounted: bool(firstValue([explicit.mounted, receipt && receipt.mounted, status && status.mounted])),
      stageRectNonzero: bool(firstValue([explicit.stageRectNonzero, receipt && receipt.stageRectNonzero, status && status.stageRectNonzero])),
      canvasPresent: bool(firstValue([explicit.canvasPresent, receipt && receipt.canvasPresent, status && status.canvasPresent])),
      firstFrameDrawn: bool(firstValue([explicit.firstFrameDrawn, receipt && receipt.firstFrameDrawn, status && status.firstFrameDrawn])),
      firstVisiblePixelObserved: bool(firstValue([explicit.firstVisiblePixelObserved, receipt && receipt.firstVisiblePixelObserved, status && status.firstVisiblePixelObserved])),
      fallbackActive: bool(firstValue([explicit.fallbackActive, receipt && receipt.fallbackActive, status && status.fallbackActive])),
      contextLost: bool(firstValue([explicit.contextLost, receipt && receipt.contextLost, status && status.contextLost])),
      frameError: targetAccess ? frozenClone(targetAccess.error) : null,
      repairAuthorization: false,
      visualPassClaimed: false,
      webGLClaimed: false
    });
  }

  function buildCanonicalCycleRequest(payload) {
    var explicit = isObject(payload) ? clone(payload) : {};
    var targetAccess = inspectTargetAccess();
    var runtimeCandidate = getRuntimeCandidate(targetAccess);
    var receiptCandidate = getRuntimeReceipt(runtimeCandidate, targetAccess);
    var statusCandidate = getRuntimeStatus(runtimeCandidate);
    var identity = buildIdentity(explicit, targetAccess, runtimeCandidate, receiptCandidate, statusCandidate);
    var declarations = htmlDeclarations();
    var productChain = collectProductChainEvidence();
    var controlsLifecycle = normalizeControlsTargetLifecycle(explicit);

    var request = {
      schema: CYCLE_REQUEST_SCHEMA,
      cycleId: safeText(explicit.cycleId || (explicit.cycle && explicit.cycle.cycleId), "audralia-nine-cycle-" + Math.random().toString(16).slice(2, 10)),
      mode: safeText(explicit.mode, "AUDIT"),
      source: safeText(explicit.source, "DIAGNOSTIC_ENGINE"),
      requestedAt: safeText(explicit.requestedAt, nowIso()),
      subject: identity.subject,
      engine: identity.engine,
      construct: {
        constructId: safeText(explicit.construct && explicit.construct.constructId, DIAGNOSTIC_CONSTRUCT_ID),
        contract: safeText(explicit.construct && explicit.construct.contract, CONTRACT),
        version: safeText(explicit.construct && explicit.construct.version, VERSION),
        route: safeText(explicit.construct && explicit.construct.route, DIAGNOSTIC_ROUTE),
        rootFile: safeText(explicit.construct && explicit.construct.rootFile, DIAGNOSTIC_HTML_FILE),
        diagnosticEngineContract: CONTRACT,
        diagnosticEngineVersion: VERSION,
        diagnosticEngineFile: FILE
      },
      target: buildTargetPacket(explicit, targetAccess, runtimeCandidate, receiptCandidate, statusCandidate),
      controlsTargetLifecycle: frozenClone(controlsLifecycle),
      identity: identity,
      productEngineEvidence: productChain,
      diagnosticContext: {
        category: safeText(explicit.category, state.selectedCategory),
        audit: safeText(explicit.audit, state.selectedAudit),
        participant: safeText(explicit.participant, state.selectedParticipant),
        reportId: state.currentReport ? state.currentReport.reportId : null,
        reportReceiptId: state.currentReceipt ? state.currentReceipt.receiptId : null
      },
      evidenceProvenance: {
        explicitPayloadPresent: Object.keys(explicit).length > 0,
        controlsTargetLifecyclePresent: Boolean(controlsLifecycle),
        controlsTargetReadyForCycle: Boolean(controlsLifecycle && controlsLifecycle.loaded && controlsLifecycle.routeMatched),
        runtimeAlias: runtimeCandidate ? runtimeCandidate.alias : null,
        runtimeSource: runtimeCandidate ? runtimeCandidate.source : null,
        runtimeReceiptSource: receiptCandidate ? receiptCandidate.source : null,
        runtimeStatusSource: statusCandidate ? statusCandidate.source : null,
        htmlDeclarations: declarations
      },
      requiredStations: frozenClone(STATIONS),
      limits: {
        exactNineRequired: true,
        conductorRequired: true,
        internalStationExecutionAuthorized: false,
        sequentialFallbackAuthorized: false,
        productionMutationAuthorized: false,
        repairAuthorized: false,
        readinessClaimAuthorized: false,
        visualPassClaimAuthorized: false
      },
      createdAt: nowIso()
    };

    request.priorLedgerHash = hashValue({
      reportsCreated: state.reportsCreated,
      directExecutions: state.directExecutions,
      cycleExecutions: state.cycleExecutions,
      archiveCount: state.archive.length
    });

    request.requestHash = hashValue(request);
    return freeze(request);
  }

  function makeLane(laneId, status, summary, evidence, absence, direction, data, errors) {
    return freeze({
      schema: LANE_SCHEMA,
      laneId: laneId,
      status: status,
      summary: summary,
      evidence: Array.isArray(evidence) ? evidence.slice(0, LIMITS.maxEvidence) : [],
      absence: Array.isArray(absence) ? absence.slice(0, LIMITS.maxEvidence) : [],
      direction: Array.isArray(direction) ? direction.slice(0, LIMITS.maxEvidence) : [],
      data: data === undefined ? null : frozenClone(data),
      errors: Array.isArray(errors) ? frozenClone(errors) : [],
      createdAt: nowIso(),
      noClaims: NO_CLAIMS
    });
  }

  function getParticipantManifest() {
    return STATIONS.map(function map(station) {
      return {
        role: station.stationId,
        label: station.stationId,
        required: true,
        cyclePosition: station.position,
        fibonacci: station.fibonacci,
        direction: station.direction,
        aliases: station.aliases.slice(),
        methods: station.methods.slice()
      };
    }).concat([{
      role: "NORTH_CONDUCTOR",
      label: "North Conductor",
      required: true,
      auxiliary: true,
      direction: "NORTH",
      aliases: CONDUCTOR_ALIASES.slice(),
      methods: ["runNineCycle", "getReceipt", "getDefinitionReceipt"]
    }]);
  }

  function collectInspectionLanes() {
    var inspection = getInspectionLane();

    if (!inspection) {
      return [makeLane(
        "inspectionAuthority",
        "MISSING",
        "Inspection authority is unavailable.",
        [],
        ["index.inspection.lane.js is not loaded or did not publish its API."],
        ["Load /showroom/globe/audralia/diagnostic/index.inspection.lane.js before index.js."],
        null,
        []
      )];
    }

    function safeLane(id, fn) {
      try { return inspection.runLane(id, fn); }
      catch (error) {
        return makeLane(
          id,
          "ERROR",
          "Inspection lane execution failed.",
          [],
          [safeText(error && error.message ? error.message : error, "INSPECTION_ERROR")],
          ["Inspect the inspection-lane receipt."],
          null,
          [normalizeError(error, "collectInspectionLanes." + id)]
        );
      }
    }

    return [
      safeLane("participants", function run() { return inspection.inspectParticipants(getParticipantManifest()); }),
      safeLane("targetFrame", function run() { return inspection.inspectTargetFrame(TARGET_FRAME_ID, TARGET_ROUTE); }),
      safeLane("runtimeMetadata", function run() { return inspection.inspectRuntime(null, { allowPixelRead: false }); }),
      safeLane("engineFamily", function run() { return inspection.inspectEngineFamily(null); }),
      safeLane("controlFamily", function run() { return isFn(inspection.inspectControlFamily) ? inspection.inspectControlFamily() : { status: "MISSING" }; }),
      safeLane("productEngineChain", function run() {
        return {
          schema: "AUDRALIA_PRODUCT_ENGINE_CHAIN_INSPECTION_v3",
          status: "AVAILABLE",
          evidence: collectProductChainEvidence(),
          noClaims: NO_CLAIMS
        };
      })
    ];
  }

  function laneList(lanes, field) {
    var out = [];
    (lanes || []).forEach(function each(lane) {
      (Array.isArray(lane && lane[field]) ? lane[field] : []).forEach(function add(item) {
        var text = safeText(item, null);
        if (text && out.indexOf(text) === -1) out.push(text);
      });
    });
    return out.slice(0, LIMITS.maxEvidence);
  }

  function calculateFibonacciSynchronization(lanes) {
    var participantLane = (lanes || []).filter(function find(lane) { return lane && lane.laneId === "participants"; })[0] || null;
    var records = participantLane && participantLane.data && Array.isArray(participantLane.data.records) ? participantLane.data.records : [];

    var stations = STATIONS.map(function map(station) {
      var record = records.filter(function find(candidateRecord) { return candidateRecord && candidateRecord.role === station.stationId; })[0] || null;
      var available = Boolean(record && record.available);
      var callable = Boolean(record && record.callable);
      return {
        cyclePosition: station.position,
        fibonacci: station.fibonacci,
        stationId: station.stationId,
        direction: station.direction,
        status: callable ? "AVAILABLE" : available ? "HELD" : "MISSING",
        available: available,
        callable: callable,
        resolvedAlias: record ? record.resolvedAlias || null : null
      };
    });

    var conductorRecord = records.filter(function find(candidateRecord) { return candidateRecord && candidateRecord.role === "NORTH_CONDUCTOR"; })[0] || null;

    return freeze({
      structuralAligned: stations.length === 9,
      operationalAligned: stations.every(function every(s) { return s.available && s.callable; }),
      stationCount: stations.length,
      availableCount: stations.filter(function keep(s) { return s.available && s.callable; }).length,
      heldCount: stations.filter(function keep(s) { return s.available && !s.callable; }).length,
      missingCount: stations.filter(function keep(s) { return !s.available; }).length,
      stations: stations,
      conductorRequired: true,
      conductorAvailable: Boolean(conductorRecord && conductorRecord.available && conductorRecord.callable),
      conductorResolvedAlias: conductorRecord ? conductorRecord.resolvedAlias || null : null,
      internalStationExecutionAuthorized: false,
      sequentialFallbackAuthorized: false
    });
  }

  function determineReportStatus(lanes) {
    if ((lanes || []).some(function some(lane) { return lane.status === "ERROR"; })) return "AVAILABLE_WITH_ERRORS";
    if ((lanes || []).some(function some(lane) { return lane.status === "HELD"; })) return "HELD";
    if ((lanes || []).some(function some(lane) { return lane.status === "MISSING"; })) return "AVAILABLE_WITH_ABSENCE";
    return "AVAILABLE";
  }

  function buildRead(lanes, fibonacci) {
    var evidence = laneList(lanes, "evidence");
    var absence = laneList(lanes, "absence");
    var direction = laneList(lanes, "direction");

    (lanes || []).forEach(function each(lane) {
      if (lane && lane.summary && (lane.status === "COMPLETE" || lane.status === "AVAILABLE")) {
        evidence.push(lane.laneId + ": " + lane.summary);
      }
    });

    if (!evidence.length) evidence.push("The diagnostic engine produced a bounded report receipt.");
    if (!absence.length) absence.push("No additional absence was declared by the current bounded lanes.");

    if (!direction.length) {
      direction.push(fibonacci.conductorAvailable
        ? "Use the North Conductor for explicit Nine-Cycle execution."
        : "Inspect NORTH_CONDUCTOR and the first missing or held diagnostic station.");
    }

    return freeze({
      Result: fibonacci.operationalAligned && fibonacci.conductorAvailable
        ? "The diagnostic family is structurally aligned and conductor handoff is available."
        : "A diagnostic report was created. Structural, operational, or conductor synchronization remains limited.",
      Evidence: evidence.slice(0, LIMITS.maxEvidence),
      Absence: absence.slice(0, LIMITS.maxEvidence),
      Direction: direction.slice(0, LIMITS.maxEvidence)
    });
  }

  function createReport(options) {
    var config = options || {};
    state.reportStatus = "CREATING";
    state.lastError = null;
    publishEngineReceipt();

    var report;
    var receipt;

    try {
      if (config.category) state.selectedCategory = String(config.category);
      if (config.audit) state.selectedAudit = String(config.audit);
      if (config.participant) state.selectedParticipant = String(config.participant);

      var lanes = collectInspectionLanes();
      var fibonacci = calculateFibonacciSynchronization(lanes);
      var read = buildRead(lanes, fibonacci);

      report = freeze({
        schema: REPORT_SCHEMA,
        reportId: "AUDRALIA_DIAGNOSTIC_REPORT_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
        status: determineReportStatus(lanes),
        category: state.selectedCategory,
        audit: state.selectedAudit,
        participant: state.selectedParticipant,
        READ: read,
        lanes: frozenClone(lanes),
        fibonacci: fibonacci,
        productEngineEvidence: collectProductChainEvidence(),
        execution: {
          directExecutionPerformed: false,
          nineCyclePerformed: false,
          conductorRequired: true,
          internalStationExecutionAuthorized: false,
          sequentialFallbackAuthorized: false
        },
        noClaims: NO_CLAIMS,
        createdAt: nowIso()
      });

      receipt = makeReportReceipt(report);
    } catch (error) {
      state.lastError = normalizeError(error, "createReport");
      report = freeze({
        schema: REPORT_SCHEMA,
        reportId: "AUDRALIA_DIAGNOSTIC_REPORT_" + Date.now(),
        status: "ERROR",
        READ: {
          Result: "The engine could not complete normal report construction.",
          Evidence: ["The engine produced a bounded error report."],
          Absence: [state.lastError.message],
          Direction: ["Inspect the engine receipt and inspection-lane receipt."]
        },
        lanes: [],
        fibonacci: { structuralAligned: false, operationalAligned: false, conductorAvailable: false, stationCount: 9, availableCount: 0, heldCount: 0, missingCount: 9, stations: [] },
        error: state.lastError,
        noClaims: NO_CLAIMS,
        createdAt: nowIso()
      });
      receipt = makeReportReceipt(report);
    }

    state.currentReport = report;
    state.currentReceipt = receipt;
    state.reportStatus = report.status;
    state.reportsCreated += 1;

    archive({ schema: ARCHIVE_SCHEMA, recordType: "REPORT", report: report, receipt: receipt, archivedAt: nowIso() });
    publishPublicReport();
    publishEngineReceipt();
    renderReport(report, receipt);
    recordAction("createReport", { reportId: report.reportId, status: report.status, receiptId: receipt.receiptId });

    return frozenClone(report);
  }

  function makeReportReceipt(report) {
    return freeze({
      schema: REPORT_RECEIPT_SCHEMA,
      receiptId: "AUDRALIA_DIAGNOSTIC_REPORT_RECEIPT_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
      reportId: report.reportId,
      reportStatus: report.status,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      authority: AUTHORITY,
      laneCount: report.lanes ? report.lanes.length : 0,
      readKeys: READ_KEYS.slice(),
      fibonacci: report.fibonacci,
      noClaims: NO_CLAIMS,
      createdAt: report.createdAt
    });
  }

  function normalizeRole(role, payload) {
    if (typeof role === "string" && role.trim()) return role.trim();

    if (isObject(role)) {
      return safeText(role.role || role.participant || role.stationId || role.selectedParticipant, null);
    }

    if (isObject(payload)) {
      return safeText(payload.role || payload.participant || payload.stationId || payload.selectedParticipant, null);
    }

    return null;
  }

  function normalizePayload(role, payload) {
    if (isObject(payload)) return payload;
    if (isObject(role)) return role;
    return {};
  }

  function findStationByRole(role) {
    var normalized = safeText(role, null);
    if (!normalized || normalized === "ALL") return null;

    for (var i = 0; i < STATIONS.length; i += 1) {
      if (STATIONS[i].stationId === normalized || STATIONS[i].fibonacci === normalized || STATIONS[i].direction === normalized) return STATIONS[i];
    }

    return null;
  }

  function findParticipantApi(station) {
    if (!station) return null;
    for (var i = 0; i < station.aliases.length; i += 1) {
      var found = firstGlobal([station.aliases[i]]);
      if (found && found.value) return found;
    }
    return null;
  }

  function callParticipantDirect(station, found, payload) {
    var api = found ? found.value : null;
    if (!api) return null;

    var request = {
      schema: STATION_REQUEST_SCHEMA,
      requestMode: "DIRECT_CHECK",
      cycleId: payload.cycleId || "direct-" + Math.random().toString(16).slice(2, 10),
      position: station.position,
      fibonacci: station.fibonacci,
      stationId: station.stationId,
      role: station.stationId,
      source: "DIAGNOSTIC_ENGINE",
      payload: frozenClone(payload),
      noClaims: NO_CLAIMS,
      requestedAt: nowIso()
    };

    for (var i = 0; i < station.methods.length; i += 1) {
      var method = station.methods[i];
      if (isFn(api[method])) {
        return {
          method: method,
          alias: found.path,
          receipt: api[method](request)
        };
      }
    }

    return null;
  }

  function runDirect(role, payload) {
    var normalizedPayload = normalizePayload(role, payload);
    var selectedRole = normalizeRole(role, normalizedPayload) || state.selectedParticipant || "ALL";
    var station = findStationByRole(selectedRole);

    state.directExecutions += 1;

    if (!station) {
      var allHeld = freeze({
        schema: DIRECT_RECEIPT_SCHEMA,
        status: "HELD",
        terminalClass: "DIRECT_ROLE_UNRESOLVED",
        role: selectedRole,
        reason: selectedRole === "ALL"
          ? "DIRECT_CHECK_REQUIRES_SELECTED_PARTICIPANT_ROLE"
          : "DIRECT_CHECK_ROLE_DID_NOT_MATCH_A_DECLARED_STATION",
        payloadObserved: Boolean(normalizedPayload),
        source: "DIAGNOSTIC_ENGINE",
        recommendedOwner: "CONTROL_PANEL",
        recommendedFile: "index.controls.js",
        recommendedAction: "Pass selected participant role as runDirect(role, payload).",
        noClaims: NO_CLAIMS,
        createdAt: nowIso()
      });

      state.currentDirectReceipt = allHeld;
      archive({ schema: ARCHIVE_SCHEMA, recordType: "DIRECT_EXECUTION_HELD", receipt: allHeld, archivedAt: nowIso() });
      publishPublicReport();
      publishEngineReceipt();
      recordAction("runDirect.held", { role: selectedRole, terminalClass: allHeld.terminalClass });
      return frozenClone(allHeld);
    }

    var found = findParticipantApi(station);
    if (!found) {
      var missing = freeze({
        schema: DIRECT_RECEIPT_SCHEMA,
        status: "HELD",
        terminalClass: "DIRECT_PARTICIPANT_ABSENT",
        role: selectedRole,
        stationId: station.stationId,
        fibonacci: station.fibonacci,
        position: station.position,
        reason: "DIRECT_PARTICIPANT_API_NOT_RESOLVED",
        aliasesChecked: station.aliases.slice(),
        source: "DIAGNOSTIC_ENGINE",
        recommendedOwner: "DIAGNOSTIC_PARTICIPANT",
        recommendedFile: null,
        recommendedAction: "Load or expose the selected participant API before Direct Check.",
        noClaims: NO_CLAIMS,
        createdAt: nowIso()
      });

      state.currentDirectReceipt = missing;
      archive({ schema: ARCHIVE_SCHEMA, recordType: "DIRECT_EXECUTION_HELD", receipt: missing, archivedAt: nowIso() });
      publishPublicReport();
      publishEngineReceipt();
      recordAction("runDirect.held", { role: selectedRole, terminalClass: missing.terminalClass });
      return frozenClone(missing);
    }

    try {
      var called = callParticipantDirect(station, found, normalizedPayload);
      if (!called) {
        var notCallable = freeze({
          schema: DIRECT_RECEIPT_SCHEMA,
          status: "HELD",
          terminalClass: "DIRECT_PARTICIPANT_NOT_CALLABLE",
          role: selectedRole,
          stationId: station.stationId,
          fibonacci: station.fibonacci,
          position: station.position,
          participantAlias: found.path,
          reason: "PARTICIPANT_API_PRESENT_WITHOUT_SUPPORTED_DIRECT_METHOD",
          methodsChecked: station.methods.slice(),
          source: "DIAGNOSTIC_ENGINE",
          recommendedOwner: "DIAGNOSTIC_PARTICIPANT",
          recommendedFile: null,
          recommendedAction: "Expose one supported participant method for direct diagnostic check.",
          noClaims: NO_CLAIMS,
          createdAt: nowIso()
        });

        state.currentDirectReceipt = notCallable;
        archive({ schema: ARCHIVE_SCHEMA, recordType: "DIRECT_EXECUTION_HELD", receipt: notCallable, archivedAt: nowIso() });
        publishPublicReport();
        publishEngineReceipt();
        recordAction("runDirect.held", { role: selectedRole, terminalClass: notCallable.terminalClass });
        return frozenClone(notCallable);
      }

      var complete = freeze({
        schema: DIRECT_RECEIPT_SCHEMA,
        status: "COMPLETE",
        terminalClass: "DIRECT_PARTICIPANT_RETURNED",
        role: selectedRole,
        stationId: station.stationId,
        fibonacci: station.fibonacci,
        position: station.position,
        participantAlias: called.alias,
        method: called.method,
        participantReceipt: frozenClone(called.receipt),
        source: "DIAGNOSTIC_ENGINE",
        noClaims: NO_CLAIMS,
        createdAt: nowIso()
      });

      state.directCompletions += 1;
      state.currentDirectReceipt = complete;
      archive({ schema: ARCHIVE_SCHEMA, recordType: "DIRECT_EXECUTION", receipt: complete, archivedAt: nowIso() });
      publishPublicReport();
      publishEngineReceipt();
      recordAction("runDirect.complete", { role: selectedRole, stationId: station.stationId, method: called.method });
      return frozenClone(complete);
    } catch (error) {
      var failed = freeze({
        schema: DIRECT_RECEIPT_SCHEMA,
        status: "ERROR",
        terminalClass: "DIRECT_PARTICIPANT_ERROR",
        role: selectedRole,
        stationId: station.stationId,
        fibonacci: station.fibonacci,
        position: station.position,
        participantAlias: found.path,
        error: normalizeError(error, "runDirect"),
        source: "DIAGNOSTIC_ENGINE",
        noClaims: NO_CLAIMS,
        createdAt: nowIso()
      });

      state.currentDirectReceipt = failed;
      archive({ schema: ARCHIVE_SCHEMA, recordType: "DIRECT_EXECUTION_ERROR", receipt: failed, archivedAt: nowIso() });
      publishPublicReport();
      publishEngineReceipt();
      recordAction("runDirect.error", { role: selectedRole, stationId: station.stationId });
      return frozenClone(failed);
    }
  }

  function normalizeStationReceipt(rawReceipt, index) {
    var raw = isObject(rawReceipt) ? rawReceipt : {};
    var expected = STATIONS[index] || null;
    var position = Number(firstValue([raw.position, raw.cyclePosition, expected && expected.position]));
    var stationId = safeText(firstValue([raw.stationId, raw.role, expected && expected.stationId]), null);
    var fibonacci = safeText(firstValue([raw.fibonacci, expected && expected.fibonacci]), null);
    var status = safeText(raw.status, "UNKNOWN").toUpperCase();

    return freeze({
      schema: "AUDRALIA_DIAGNOSTIC_NORMALIZED_STATION_RECEIPT_v4",
      position: Number.isFinite(position) ? position : null,
      cyclePosition: Number.isFinite(position) ? position : null,
      stationId: stationId,
      role: stationId,
      fibonacci: fibonacci,
      cycleId: safeText(raw.cycleId, null),
      contract: safeText(raw.contract || raw.CONTRACT, null),
      version: safeText(raw.version || raw.VERSION, null),
      file: safeText(raw.file || raw.FILE, null),
      status: status,
      completed: Boolean(firstValue([bool(raw.completed), status === "PASS" || status === "COMPLETE" || status === "COMMITTED"])),
      handoffEligible: Boolean(firstValue([bool(raw.handoffEligible), status === "PASS" || status === "COMPLETE" || status === "COMMITTED"])),
      summary: safeText(raw.summary, null),
      observations: frozenClone(Array.isArray(raw.observations) ? raw.observations : []),
      evidence: frozenClone(Array.isArray(raw.evidence) ? raw.evidence : []),
      issues: frozenClone(Array.isArray(raw.issues) ? raw.issues : []),
      firstHeldCoordinate: safeText(raw.firstHeldCoordinate, null),
      firstFailedCoordinate: safeText(raw.firstFailedCoordinate, null),
      firstConflictCoordinate: safeText(raw.firstConflictCoordinate, null),
      recommendedOwner: frozenClone(raw.recommendedOwner || null),
      generatedAt: safeText(raw.generatedAt, null),
      receiptHash: safeText(raw.receiptHash, null) || hashValue(raw),
      validation: {
        expectedPosition: expected ? expected.position : null,
        expectedStationId: expected ? expected.stationId : null,
        expectedFibonacci: expected ? expected.fibonacci : null,
        validPosition: Boolean(expected && position === expected.position),
        validStation: Boolean(expected && stationId === expected.stationId),
        validFibonacci: Boolean(expected && fibonacci === expected.fibonacci),
        validCanonicalCoordinate: Boolean(expected && position === expected.position && stationId === expected.stationId && fibonacci === expected.fibonacci)
      },
      raw: frozenClone(raw)
    });
  }

  function normalizeCycleReceipts(rawReceipts) {
    return (Array.isArray(rawReceipts) ? rawReceipts : []).slice(0, 9).map(function map(receipt, index) {
      return normalizeStationReceipt(receipt, index);
    });
  }

  function validateExactNine(receipts) {
    var r = Array.isArray(receipts) ? receipts : [];
    var exactCount = r.length === 9;
    var oneCycleId = exactCount && r.every(function every(x) { return Boolean(x.cycleId); }) && r.map(function map(x) { return x.cycleId; }).filter(function unique(v, i, a) { return a.indexOf(v) === i; }).length === 1;
    var canonicalOrder = exactCount && r.every(function every(x) { return x.validation && x.validation.validCanonicalCoordinate; });
    var completed = exactCount && r.every(function every(x) { return x.completed; });
    var handoffEligible = exactCount && r.every(function every(x) { return x.handoffEligible; });
    var noFailure = exactCount && r.every(function every(x) {
      return ["FAIL", "FAILED", "ERROR", "CONFLICT", "HOLD", "HELD"].indexOf(String(x.status || "").toUpperCase()) === -1;
    });

    return freeze({
      exactCount: exactCount,
      oneCycleId: oneCycleId,
      canonicalOrder: canonicalOrder,
      completed: completed,
      handoffEligible: handoffEligible,
      noFailure: noFailure,
      exactNineValidated: Boolean(exactCount && oneCycleId && canonicalOrder && completed && handoffEligible && noFailure)
    });
  }

  function deriveRestitution(receipts, exact, request) {
    var r = Array.isArray(receipts) ? receipts : [];
    var firstHeld = r.filter(function find(x) { var s = String(x.status || "").toUpperCase(); return x.firstHeldCoordinate || s === "HOLD" || s === "HELD"; })[0] || null;
    var firstFailed = r.filter(function find(x) { var s = String(x.status || "").toUpperCase(); return x.firstFailedCoordinate || s === "FAIL" || s === "FAILED" || s === "ERROR"; })[0] || null;
    var firstConflict = r.filter(function find(x) { var s = String(x.status || "").toUpperCase(); return x.firstConflictCoordinate || s === "CONFLICT"; })[0] || null;
    var present = r.map(function map(x) { return x.stationId; });
    var missing = STATIONS.filter(function find(s) { return present.indexOf(s.stationId) === -1; }).map(function map(s) { return s.stationId; });

    var owner = (firstHeld && firstHeld.recommendedOwner) || (firstFailed && firstFailed.recommendedOwner) || (firstConflict && firstConflict.recommendedOwner) || null;

    if (!owner && request && request.identity && request.identity.absenceFields && request.identity.absenceFields.length) {
      owner = { ownerType: "DIAGNOSTIC_ENGINE", subjectId: DIAGNOSTIC_CONSTRUCT_ID, contract: CONTRACT, file: FILE, component: "CANONICAL_CYCLE_REQUEST_BUILDER" };
    }

    if (!owner && missing.length) {
      owner = { ownerType: "NORTH_CONDUCTOR_OR_PARTICIPANT", component: "NINE_CYCLE_HANDOFF", file: null };
    }

    return freeze({
      firstHeldCoordinate: firstHeld ? firstHeld.firstHeldCoordinate || (firstHeld.fibonacci + ":" + firstHeld.stationId) : null,
      firstFailedCoordinate: firstFailed ? firstFailed.firstFailedCoordinate || (firstFailed.fibonacci + ":" + firstFailed.stationId) : null,
      firstConflictCoordinate: firstConflict ? firstConflict.firstConflictCoordinate || (firstConflict.fibonacci + ":" + firstConflict.stationId) : null,
      missingStations: missing,
      recommendedOwner: frozenClone(owner),
      recommendedFile: owner && owner.file ? owner.file : null,
      recommendedComponent: owner && owner.component ? owner.component : null,
      recommendedAction: owner ? "REVIEW_RECOMMENDED_OWNER" : missing.length ? "PROVIDE_MISSING_STATION_RECEIPTS" : exact.exactNineValidated ? "NONE" : "REVIEW_EXACT_NINE_VALIDATION",
      falseContinuation: false,
      sequentialFallbackAuthorized: false
    });
  }

  function getConductor() {
    return firstGlobal(CONDUCTOR_ALIASES);
  }

  function executeConductor(request) {
    var conductor = getConductor();

    if (conductor && conductor.value && isFn(conductor.value.runNineCycle)) {
      return {
        mode: "NORTH_CONDUCTOR",
        raw: conductor.value.runNineCycle(request),
        conductorAlias: conductor.path
      };
    }

    return {
      mode: "CONDUCTOR_UNAVAILABLE",
      raw: { receipts: [] },
      conductorAlias: null
    };
  }

  function synthesizeRail(request, normalizedReceipts) {
    var rail = firstGlobal(["AUDRALIA_DIAGNOSTIC_RAIL", "AUDRALIA.diagnosticRail"]);

    if (rail && rail.value && isFn(rail.value.executeCycleStation)) {
      try {
        return rail.value.executeCycleStation({
          schema: STATION_REQUEST_SCHEMA,
          cycleId: request.cycleId,
          position: 9,
          stationId: "RAIL_TERMINAL_SYNTHESIS",
          priorStationReceipts: frozenClone(normalizedReceipts),
          canonicalRequest: frozenClone(request),
          noClaims: NO_CLAIMS
        });
      } catch (error) {
        return { status: "ERROR", summary: "RAIL_SYNTHESIS_ERROR", issues: [normalizeError(error, "synthesizeRail")] };
      }
    }

    return null;
  }

  function classifyCycleTerminal(execution, normalized, exact, request) {
    if (execution.mode === "CONDUCTOR_UNAVAILABLE") return "CONDUCTOR_UNAVAILABLE_TERMINAL";
    if (exact.exactNineValidated) return "COMMITTED_EXACT_NINE";
    if (request && request.target && request.target.controlsTargetLifecycle && request.target.controlsTargetLifecycle.loaded === false) return "TARGET_LIFECYCLE_HELD";
    if (normalized.length === 0) return "PARTICIPANT_RECEIPTS_ABSENT";
    if (normalized.length < 9) return "PARTICIPANT_RECEIPTS_INCOMPLETE";
    if (normalized.some(function some(r) { return ["ERROR", "FAIL", "FAILED"].indexOf(String(r.status).toUpperCase()) !== -1; })) return "ERROR_TERMINAL";
    return "REPORTABLE_LIMITED_DIAGNOSTIC";
  }

  function runNineCycle(payload) {
    var request;

    try {
      request = buildCanonicalCycleRequest(payload || {});
    } catch (error) {
      var failure = freeze({
        schema: CYCLE_RECEIPT_SCHEMA,
        status: "ERROR",
        terminalClass: "ERROR_TERMINAL",
        reason: "CANONICAL_CYCLE_REQUEST_ERROR",
        error: normalizeError(error, "buildCanonicalCycleRequest"),
        exactNineValidated: false,
        sequentialFallbackAuthorized: false,
        internalStationExecutionAuthorized: false,
        receipts: [],
        normalizedReceipts: [],
        noClaims: NO_CLAIMS,
        createdAt: nowIso()
      });

      state.currentCycleReceipt = failure;
      archive({ schema: ARCHIVE_SCHEMA, recordType: "NINE_CYCLE_ERROR", request: null, receipt: failure, archivedAt: nowIso() });
      publishPublicReport();
      publishEngineReceipt();
      return frozenClone(failure);
    }

    state.currentCycleRequest = request;

    var execution;
    try { execution = executeConductor(request); }
    catch (error2) { execution = { mode: "EXECUTION_ERROR", raw: { receipts: [], error: normalizeError(error2, "runNineCycle.execution") }, conductorAlias: null }; }

    state.cycleExecutions += 1;

    var rawReceipts = execution.raw && Array.isArray(execution.raw.receipts) ? execution.raw.receipts : Array.isArray(execution.raw) ? execution.raw : [];
    var normalized = normalizeCycleReceipts(rawReceipts);
    var railReceipt = synthesizeRail(request, normalized);
    var exact = validateExactNine(normalized);
    var restitution = deriveRestitution(normalized, exact, request);
    var terminalClass = classifyCycleTerminal(execution, normalized, exact, request);

    var cycleReceipt = freeze({
      schema: CYCLE_RECEIPT_SCHEMA,
      status: exact.exactNineValidated ? "COMMITTED" : terminalClass === "ERROR_TERMINAL" ? "ERROR" : "HELD",
      terminalClass: terminalClass,
      executionMode: execution.mode,
      conductorAlias: execution.conductorAlias || null,
      conductorAvailable: execution.mode === "NORTH_CONDUCTOR",
      cycleId: request.cycleId,
      requestHash: request.requestHash,
      receiptCount: rawReceipts.length,
      normalizedReceiptCount: normalized.length,
      exactNineValidated: exact.exactNineValidated,
      exactNineValidation: exact,
      sequentialFallbackAuthorized: false,
      internalStationExecutionAuthorized: false,
      controlsTargetLifecycle: frozenClone(request.controlsTargetLifecycle),
      canonicalRequest: frozenClone(request),
      receipts: frozenClone(rawReceipts),
      normalizedReceipts: normalized,
      railTerminalSynthesis: frozenClone(railReceipt),
      restitution: restitution,
      readinessClaimed: false,
      visualPassClaimed: false,
      f21Claimed: false,
      f89Claimed: false,
      repairAuthorized: false,
      noClaims: NO_CLAIMS,
      createdAt: nowIso()
    });

    if (exact.exactNineValidated) state.cycleCommits += 1;

    state.currentCycleReceipt = cycleReceipt;
    archive({ schema: ARCHIVE_SCHEMA, recordType: "NINE_CYCLE", request: request, receipt: cycleReceipt, archivedAt: nowIso() });
    publishPublicReport();
    publishEngineReceipt();
    recordAction("runNineCycle", { cycleId: cycleReceipt.cycleId, status: cycleReceipt.status, terminalClass: cycleReceipt.terminalClass, exactNineValidated: cycleReceipt.exactNineValidated });

    return frozenClone(cycleReceipt);
  }

  function renderReport(report, receipt) {
    if (!doc) return false;

    var rootElement = doc.getElementById("diagnosticReport") || doc.querySelector("[data-diagnostic-report]");
    if (!rootElement) return false;

    function q(sel) {
      try { return rootElement.querySelector(sel); } catch (_error) { return null; }
    }

    function list(el, items) {
      if (!el) return;
      el.textContent = "";
      (Array.isArray(items) ? items : []).forEach(function each(x) {
        var li = doc.createElement("li");
        li.textContent = String(x);
        el.appendChild(li);
      });
    }

    var status = q("[data-report-status]");
    var result = q("[data-read-result]");
    var receiptEl = q("[data-report-receipt]");

    if (status) status.textContent = report.status;
    if (result) result.textContent = report.READ.Result;
    list(q("[data-read-evidence]"), report.READ.Evidence);
    list(q("[data-read-absence]"), report.READ.Absence);
    list(q("[data-read-direction]"), report.READ.Direction);
    if (receiptEl) receiptEl.textContent = JSON.stringify(receipt, null, 2);

    rootElement.hidden = false;
    rootElement.setAttribute("data-report-state", String(report.status).toLowerCase());

    return true;
  }

  function publishPublicReport() {
    root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REPORT = state.currentReport;
    root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_REPORT_RECEIPT = state.currentReceipt;
    root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_DIRECT_RECEIPT = state.currentDirectReceipt;
    root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_CYCLE_RECEIPT = state.currentCycleReceipt;
  }

  function publishEngineReceipt() {
    root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_ENGINE_RECEIPT = freeze({
      schema: ENGINE_RECEIPT_SCHEMA,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      authority: AUTHORITY,
      apiStatus: state.apiStatus,
      status: state.apiStatus,
      diagnosticReadinessClaimed: false,
      reportStatus: state.reportStatus,
      reportsCreated: state.reportsCreated,
      directExecutions: state.directExecutions,
      directCompletions: state.directCompletions,
      cycleExecutions: state.cycleExecutions,
      cycleCommits: state.cycleCommits,
      inspectionAuthorityAvailable: Boolean(getInspectionLane()),
      conductorAvailable: Boolean(getConductor()),
      productEngineEvidenceAvailable: collectProductChainEvidence().recordCount > 0,
      currentReportId: state.currentReport ? state.currentReport.reportId : null,
      currentReceiptId: state.currentReceipt ? state.currentReceipt.receiptId : null,
      currentDirectStatus: state.currentDirectReceipt ? state.currentDirectReceipt.status || null : null,
      currentDirectTerminalClass: state.currentDirectReceipt ? state.currentDirectReceipt.terminalClass || null : null,
      currentCycleId: state.currentCycleReceipt ? state.currentCycleReceipt.cycleId || null : null,
      currentCycleStatus: state.currentCycleReceipt ? state.currentCycleReceipt.status || null : null,
      currentCycleTerminalClass: state.currentCycleReceipt ? state.currentCycleReceipt.terminalClass || null : null,
      exactNineValidated: Boolean(state.currentCycleReceipt && state.currentCycleReceipt.exactNineValidated),
      archiveCount: state.archive.length,
      identityConflictCount: state.identityConflicts.length,
      identityAbsenceCount: state.identityAbsence.length,
      lastError: frozenClone(state.lastError),
      lastAction: frozenClone(state.lastAction),
      noClaims: NO_CLAIMS,
      publishedAt: nowIso()
    });
  }

  function getReport() { return frozenClone(state.currentReport); }
  function getReportReceipt() { return frozenClone(state.currentReceipt); }
  function getDirectReceipt() { return frozenClone(state.currentDirectReceipt); }
  function getCycleReceipt() { return frozenClone(state.currentCycleReceipt); }
  function getCycleRequest() { return frozenClone(state.currentCycleRequest); }
  function getEngineReceipt() { return frozenClone(root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_ENGINE_RECEIPT || null); }
  function getReceipt() { return getEngineReceipt(); }
  function getArchive() { return frozenClone(state.archive); }
  function getState() { return frozenClone(state); }

  function setSelection(selection) {
    var s = selection || {};
    if (Object.prototype.hasOwnProperty.call(s, "category")) state.selectedCategory = String(s.category);
    if (Object.prototype.hasOwnProperty.call(s, "audit")) state.selectedAudit = String(s.audit);
    if (Object.prototype.hasOwnProperty.call(s, "participant")) state.selectedParticipant = String(s.participant);
    recordAction("setSelection", { category: state.selectedCategory, audit: state.selectedAudit, participant: state.selectedParticipant });
    return getState();
  }

  function resetWorkbench() {
    state.reportStatus = "READY";
    state.currentReport = null;
    state.currentReceipt = null;
    state.currentDirectReceipt = null;
    state.currentCycleRequest = null;
    state.currentCycleReceipt = null;
    state.lastError = null;
    state.identityConflicts = [];
    state.identityAbsence = [];
    publishPublicReport();
    publishEngineReceipt();
    recordAction("resetWorkbench");
    return getState();
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
      STATUS: "API_READY",
      status: "API_READY",

      createReport: createReport,
      runDirect: runDirect,
      runDirectCheck: function runDirectCheck(payload) {
        var p = isObject(payload) ? payload : {};
        return runDirect(p.role || p.participant || state.selectedParticipant, p);
      },
      directCheck: function directCheck(payload) {
        var p = isObject(payload) ? payload : {};
        return runDirect(p.role || p.participant || state.selectedParticipant, p);
      },
      runNineCycle: runNineCycle,
      buildCanonicalCycleRequest: buildCanonicalCycleRequest,
      normalizeStationReceipt: normalizeStationReceipt,
      normalizeCycleReceipts: normalizeCycleReceipts,
      validateExactNine: validateExactNine,
      collectProductChainEvidence: collectProductChainEvidence,

      setSelection: setSelection,
      resetWorkbench: resetWorkbench,

      getReport: getReport,
      getReportReceipt: getReportReceipt,
      getDirectReceipt: getDirectReceipt,
      getCycleReceipt: getCycleReceipt,
      getCycleRequest: getCycleRequest,
      getEngineReceipt: getEngineReceipt,
      getReceipt: getReceipt,
      getArchive: getArchive,
      getState: getState,
      getParticipantManifest: function getManifest() { return frozenClone(getParticipantManifest()); },
      getFibonacciStations: function getStations() { return frozenClone(STATIONS); },

      noDomEventOwnership: true,
      internalStationExecutionAuthorized: false,
      sequentialFallbackAuthorized: false,
      productionMutationAuthorized: false,
      readinessClaimed: false,
      visualPassClaimed: false,
      f21Claimed: false,
      f89Claimed: false,
      noClaims: NO_CLAIMS
    });

    root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE = api;
    root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY = api;
    root.AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER = api;

    if (!root.AUDRALIA || typeof root.AUDRALIA !== "object") root.AUDRALIA = {};
    root.AUDRALIA.diagnosticEngine = api;
    root.AUDRALIA.dropWithReadDiagnosticObservatory = api;
    root.AUDRALIA.diagnosticRouteController = api;

    root.__AUDRALIA_DIAGNOSTIC_ENGINE_LOADED__ = true;
    root.__AUDRALIA_DIAGNOSTIC_ENGINE_CONTRACT__ = CONTRACT;
    root.__AUDRALIA_DIAGNOSTIC_ENGINE_VERSION__ = VERSION;

    return api;
  }

  function init() {
    publishApi();
    state.initialized = true;
    state.initializedAt = nowIso();
    state.apiStatus = "API_READY";
    publishPublicReport();
    publishEngineReceipt();
    recordAction("initialize", {
      inspectionAuthorityAvailable: Boolean(getInspectionLane()),
      conductorAvailable: Boolean(getConductor()),
      productEngineEvidenceAvailable: collectProductChainEvidence().recordCount > 0,
      fibonacciAuthority: ["F1", "F3", "F5", "F8", "F13", "F21", "F34", "F55", "F89"]
    });
  }

  var existing = root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE;
  if (existing && (existing.CONTRACT === CONTRACT || existing.contract === CONTRACT)) return;

  try {
    init();
  } catch (error) {
    state.lastError = normalizeError(error, "initialize");
    state.apiStatus = "ERROR";
    publishEngineReceipt();
    throw error;
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = root.AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_OBSERVATORY_ENGINE;
  }
})(
  typeof window !== "undefined"
    ? window
    : typeof globalThis !== "undefined"
      ? globalThis
      : this
);

// /showroom/globe/hearth/hearth.js
// HEARTH_ROUTE_CONDUCTOR_COOPERATIVE_CANVAS_HANDOFF_TNT_v1
// Full-file replacement.
// Active Hearth route conductor only.
// Purpose:
// - Hydrate the existing HTML first-paint cockpit.
// - Preserve monotonic Fibonacci stage progression.
// - Prefer /assets/hearth/hearth.canvas.js cooperative boot.
// - Translate canvas cooperative phase events into visible F13 loading progress.
// - Prevent F13 from appearing frozen during long canvas work.
// - Latch F21 only after canvas ready / first-frame / drag proof.
// - Collapse into compact diagnostic dock after readiness.
// Does not own:
// - HTML first paint
// - planet pixel drawing
// - Runtime Table source code
// - tectonic cause
// - elevation truth
// - composition truth
// - hydrology truth
// - source material authority
// - climate route authority
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_ROUTE_CONDUCTOR_COOPERATIVE_CANVAS_HANDOFF_TNT_v1";
  const RECEIPT = "HEARTH_ROUTE_CONDUCTOR_COOPERATIVE_CANVAS_HANDOFF_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_LOAD_LEDGER_MONOTONIC_CONDUCTOR_DOCK_LATCH_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_CANVAS_COOPERATIVE_BOOT_PROGRESS_HANDOFF_FINAL_DRAFT_PREWRITE_v1";
  const VERSION = "2026-05-29.hearth-route-conductor-cooperative-canvas-handoff-v1";

  const ROUTE = "/showroom/globe/hearth/";
  const ACTIVE_ROUTE_FILE = "/showroom/globe/hearth/hearth.js";
  const CANVAS_AUTHORITY_FILE = "/assets/hearth/hearth.canvas.js";
  const RUNTIME_TABLE_FILE = "/assets/lab/runtime-table.js";
  const RETIRED_CLIMATE_ROUTE = "/showroom/globe/hearth/hearth.climate.route.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const FIB = Object.freeze({
    F1A: { id: "F1A", rank: 1, value: 1, label: "HTML shell", progress: 6 },
    F1B: { id: "F1B", rank: 2, value: 1, label: "Load ledger", progress: 12 },
    F2: { id: "F2", rank: 3, value: 2, label: "First-paint cockpit", progress: 22 },
    F3: { id: "F3", rank: 4, value: 3, label: "Script order", progress: 36 },
    F5: { id: "F5", rank: 5, value: 5, label: "Authority availability", progress: 55 },
    F8: { id: "F8", rank: 6, value: 8, label: "Conductor hydration", progress: 72 },
    F13: { id: "F13", rank: 7, value: 13, label: "Canvas and diagnostic", progress: 78 },
    F21: { id: "F21", rank: 8, value: 21, label: "Completion latch", progress: 100 }
  });

  const STATUS_RANK = Object.freeze({
    REQUESTED: 1,
    LOADING: 2,
    LOADED: 3,
    READY: 4,
    DEGRADED: 4,
    HELD: 4,
    HYDRATED: 5,
    MOUNTED: 6,
    BOUND: 7,
    RENDERED: 8,
    COPY_ARMED: 8,
    FINAL_READY: 9,
    LATCHED: 10,
    FAILED: 10,
    ARCHIVED: 0
  });

  const STATUS = Object.freeze({
    REQUESTED: "REQUESTED",
    LOADING: "LOADING",
    LOADED: "LOADED",
    READY: "READY",
    DEGRADED: "DEGRADED",
    HELD: "HELD",
    FAILED: "FAILED",
    HYDRATED: "HYDRATED",
    MOUNTED: "MOUNTED",
    RENDERED: "RENDERED",
    BOUND: "BOUND",
    COPY_ARMED: "COPY_ARMED",
    FINAL_READY: "FINAL_READY",
    LATCHED: "LATCHED",
    ARCHIVED: "ARCHIVED"
  });

  const LANES = Object.freeze([
    { key: "shell", label: "Shell", fib: "F1A" },
    { key: "ledger", label: "Ledger", fib: "F1B" },
    { key: "staticCockpit", label: "Static cockpit", fib: "F2" },
    { key: "scriptOrder", label: "Script order", fib: "F3" },
    { key: "authorityAvailability", label: "Authority availability", fib: "F5" },
    { key: "conductorHydration", label: "Conductor hydration", fib: "F8" },
    { key: "canvasAndDiagnostic", label: "Canvas and diagnostic", fib: "F13" },
    { key: "completionLatch", label: "Completion latch", fib: "F21" }
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    route: ROUTE,

    activeRouteConductor: ACTIVE_ROUTE_FILE,
    retiredClimateRoute: RETIRED_CLIMATE_ROUTE,
    retiredClimateRouteActiveCarrier: false,

    hydratedExistingCockpit: false,
    duplicateCockpitCreated: false,
    fallbackCockpitCreated: false,
    loadLedgerPresent: false,
    monotonicStageGuardActive: false,
    stageRegressionPrevented: 0,
    archivedLateEvents: [],

    fibonacciStage: "F8",
    currentFibonacciStage: "F8",
    highestStageReached: "F8",
    highestStageRank: FIB.F8.rank,

    completionLatched: false,
    visibleLoadingActive: true,
    diagnosticCockpitReady: false,
    latestVisibleEvent: "CONDUCTOR_STARTING",

    cockpitMode: "loading-cockpit",
    dockVisible: false,
    fullCockpitExpanded: true,
    planetObstructionReduced: false,

    mainProgressCap: FIB.F8.progress,
    mainDisplayProgress: FIB.F8.progress,

    runtimeTablePresent: false,
    runtimeTableMode: "RUNTIME_TABLE_PENDING",
    runtimeTablePlanAttempted: false,
    runtimeTablePlanCreated: false,
    runtimeTablePlanError: "",
    runtimeTablePlan: null,
    runtimeTableOptional: true,

    sourceAuthorityHeld: true,

    canvasApiPresent: false,
    cooperativeBootAvailable: false,
    cooperativeBootUsed: false,
    syncBootFallbackUsed: false,

    canvasCarrierRequested: false,
    canvasCarrierMounted: false,
    canvasCarrierHandoffOk: false,
    canvasCarrierHandoffError: "",
    canvasCarrierMethod: "",
    canvasBootStartedAt: "",
    canvasBootCompletedAt: "",
    canvasBootStartedAtMs: 0,
    canvasBootCompletedAtMs: 0,
    canvasBootElapsedMs: 0,
    canvasYieldCount: 0,
    canvasPhaseCount: 0,
    lastCanvasPhase: "",
    lastCanvasProgress: 0,
    loaderRepaintDuringCanvasBoot: false,
    f13ProgressStreamActive: false,

    atlasBuildStarted: false,
    atlasBuildProgress: 0,
    atlasBuildComplete: false,
    textureComposeStarted: false,
    textureComposeProgress: 0,
    textureComposeComplete: false,

    firstFrameRequested: false,
    firstFrameDetected: false,
    dragInspectionBound: false,
    imageRendered: false,
    canvasReady: false,

    partialReceiptAvailable: false,
    copyDiagnosticArmed: false,
    finalReceiptAvailable: false,
    buttonsReachable: false,
    receiptOverlayIndependent: true,

    postgameStatus: "CONDUCTOR_HYDRATING",
    firstFailedCoordinate: "F8_CONDUCTOR_HYDRATION",
    recommendedNextRenewalTarget: "await-cooperative-canvas-receipt",

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    startedAt: "",
    startedAtMs: 0,
    updatedAt: "",
    heartbeatElapsedMs: 0,
    phaseEvents: [],
    events: [],
    errors: []
  };

  const refs = {
    ledger: null,
    mount: null,
    cockpit: null,
    stage: null,
    heartbeat: null,
    latest: null,
    title: null,
    mainFill: null,
    mainPercent: null,
    laneList: null,
    receiptBox: null,
    receiptPre: null,
    copyButton: null,
    receiptToggle: null,
    collapseButton: null
  };

  let heartbeatTimer = 0;
  let enforcementTimer = 0;
  let reconcileTimer = 0;
  let raf = 0;
  let canvasCallAttempted = false;
  let lastLaneMarkup = "";

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function nowMs() {
    return Date.now ? Date.now() : new Date().getTime();
  }

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function bool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === "true") return true;
    if (value === "false") return false;
    return fallback;
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object");
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function clonePlain(value) {
    if (!isObject(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : { ...value };
    }
  }

  function formatElapsed(ms) {
    const total = Math.max(0, Math.floor(Number(ms || 0) / 1000));
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function stageRank(stage) {
    return FIB[stage] ? FIB[stage].rank : 0;
  }

  function statusRank(status) {
    return STATUS_RANK[status] || 0;
  }

  function stageProgress(stage) {
    return FIB[stage] ? FIB[stage].progress : 0;
  }

  function stageLabel(stage) {
    return FIB[stage] ? FIB[stage].label : stage;
  }

  function archiveLateEvent(event, reason = "archive-only") {
    const archived = {
      ...clonePlain(event),
      archived: true,
      archiveReason: reason,
      archivedAt: nowIso()
    };

    state.archivedLateEvents.push(archived);
    state.stageRegressionPrevented += 1;

    if (state.archivedLateEvents.length > 100) {
      state.archivedLateEvents.splice(0, state.archivedLateEvents.length - 100);
    }

    const led = ledgerState();
    if (Array.isArray(led.archivedLateEvents)) {
      led.archivedLateEvents.push(archived);
      if (led.archivedLateEvents.length > 140) {
        led.archivedLateEvents.splice(0, led.archivedLateEvents.length - 140);
      }
    }

    return archived;
  }

  function makeLane(definition, status = STATUS.REQUESTED, message = "") {
    return {
      key: definition.key,
      label: definition.label,
      fibonacci: definition.fib,
      status,
      message: message || definition.label,
      progress: stageProgress(definition.fib),
      elapsedMs: 0,
      startedAt: nowIso(),
      updatedAt: nowIso(),
      latestEvent: "LANE_INITIALIZED",
      watchdog: ""
    };
  }

  function normalizeLedger(existing) {
    const ledger = existing && isObject(existing) ? existing : {};
    const ledgerState = isObject(ledger.state) ? ledger.state : ledger;

    ledger.state = ledgerState;
    ledgerState.contract = ledgerState.contract || "HEARTH_LOAD_LEDGER_MONOTONIC_SHARED_v1";
    ledgerState.route = ledgerState.route || ROUTE;
    ledgerState.startedAt = ledgerState.startedAt || nowIso();
    ledgerState.updatedAt = nowIso();
    ledgerState.currentFibonacciStage = ledgerState.currentFibonacciStage || "F1B";
    ledgerState.highestStageReached = ledgerState.highestStageReached || ledgerState.currentFibonacciStage || "F1B";
    ledgerState.highestStageRank = Math.max(
      Number(ledgerState.highestStageRank || 0),
      stageRank(ledgerState.highestStageReached),
      stageRank(ledgerState.currentFibonacciStage)
    );
    ledgerState.completionLatched = bool(ledgerState.completionLatched, false);
    ledgerState.visibleLoadingActive = ledgerState.visibleLoadingActive !== false;
    ledgerState.diagnosticCockpitReady = bool(ledgerState.diagnosticCockpitReady, false);
    ledgerState.cockpitMode = ledgerState.cockpitMode || "loading-cockpit";
    ledgerState.dockVisible = bool(ledgerState.dockVisible, false);
    ledgerState.fullCockpitExpanded = ledgerState.fullCockpitExpanded !== false;
    ledgerState.planetObstructionReduced = bool(ledgerState.planetObstructionReduced, false);
    ledgerState.partialReceiptAvailable = ledgerState.partialReceiptAvailable !== false;
    ledgerState.finalReceiptAvailable = bool(ledgerState.finalReceiptAvailable, false);
    ledgerState.copyDiagnosticArmed = bool(ledgerState.copyDiagnosticArmed, false);
    ledgerState.visualPassClaimed = false;
    ledgerState.monotonicStageGuardActive = true;
    ledgerState.events = Array.isArray(ledgerState.events) ? ledgerState.events : [];
    ledgerState.archivedLateEvents = Array.isArray(ledgerState.archivedLateEvents) ? ledgerState.archivedLateEvents : [];
    ledgerState.errors = Array.isArray(ledgerState.errors) ? ledgerState.errors : [];
    ledgerState.scripts = isObject(ledgerState.scripts) ? ledgerState.scripts : {};
    ledgerState.lanes = isObject(ledgerState.lanes) ? ledgerState.lanes : {};

    LANES.forEach((lane) => {
      if (!isObject(ledgerState.lanes[lane.key])) {
        ledgerState.lanes[lane.key] = makeLane(lane);
      }
    });

    return ledger;
  }

  function ensureLedger() {
    const existing = root.HEARTH_LOAD_LEDGER;
    const ledger = normalizeLedger(existing);
    const originalGetReceiptText = isFunction(ledger.getReceiptText) ? ledger.getReceiptText.bind(ledger) : null;

    ledger.push = function push(event = {}) {
      const evt = {
        id: event.id || event.event || "LEDGER_EVENT",
        stage: event.stage || ledger.state.currentFibonacciStage || "",
        fibonacci: event.fibonacci || (FIB[event.stage] ? FIB[event.stage].value : ""),
        owner: event.owner || "unknown",
        file: event.file || "",
        lane: event.lane || "",
        status: event.status || "",
        message: event.message || "",
        timestamp: nowIso(),
        elapsedMs: nowMs() - state.startedAtMs,
        detail: clonePlain(event.detail || {}),
        progress: event.progress ?? ""
      };

      const eventRank = stageRank(evt.stage);
      const currentRank = Number(ledger.state.highestStageRank || stageRank(ledger.state.currentFibonacciStage));

      if (
        ledger.state.completionLatched &&
        eventRank > 0 &&
        eventRank < stageRank("F21") &&
        evt.lane !== "receipt" &&
        evt.lane !== "copy" &&
        evt.lane !== "canvasAndDiagnostic"
      ) {
        archiveLateEvent(evt, "post-latch-lower-stage-event");
      }

      ledger.state.events.push(evt);
      ledger.state.updatedAt = evt.timestamp;

      if (eventRank > currentRank && !ledger.state.completionLatched) {
        ledger.setStage(evt.stage, evt.message || evt.id, { fromPush: true });
      }

      if (ledger.state.events.length > 260) {
        ledger.state.events.splice(0, ledger.state.events.length - 260);
      }

      return evt;
    };

    ledger.archiveLateEvent = function ledgerArchiveLateEvent(event = {}) {
      return archiveLateEvent(event, event.archiveReason || "ledger-archive");
    };

    ledger.setStage = function setStage(nextStage, message = "", options = {}) {
      const nextRank = stageRank(nextStage);
      const currentRank = Number(ledger.state.highestStageRank || stageRank(ledger.state.currentFibonacciStage));
      const event = {
        id: `STAGE_${nextStage}`,
        stage: nextStage,
        owner: options.owner || "ledger",
        file: options.file || "",
        lane: "stage",
        status: STATUS.READY,
        message: message || stageLabel(nextStage),
        detail: options.detail || {}
      };

      if (!nextRank) {
        return ledger.push(event);
      }

      if (ledger.state.completionLatched && nextStage !== "F21") {
        return archiveLateEvent(event, "setStage-blocked-after-latch");
      }

      if (nextRank < currentRank) {
        return archiveLateEvent(event, "monotonic-stage-regression-blocked");
      }

      ledger.state.currentFibonacciStage = nextStage;
      ledger.state.highestStageReached = nextStage;
      ledger.state.highestStageRank = nextRank;
      ledger.state.updatedAt = nowIso();

      state.currentFibonacciStage = nextStage;
      state.fibonacciStage = nextStage;
      state.highestStageReached = nextStage;
      state.highestStageRank = nextRank;
      state.mainProgressCap = Math.max(state.mainProgressCap, stageProgress(nextStage));

      if (!options.fromPush) {
        return ledger.push(event);
      }

      return event;
    };

    ledger.promoteStage = ledger.setStage;

    ledger.setLane = function setLane(laneKey, next = {}) {
      const laneDef = LANES.find((item) => item.key === laneKey) || { key: laneKey, label: laneKey, fib: "F1B" };
      const lane = ledger.state.lanes[laneKey] || makeLane(laneDef);
      const nextStage = next.stage || lane.fibonacci || laneDef.fib;
      const nextStatus = next.status || lane.status;
      const nextProgress = Number.isFinite(Number(next.progress)) ? clamp(Number(next.progress), 0, 100) : Number(lane.progress || 0);
      const nextEvent = {
        id: next.event || next.latestEvent || `LANE_${String(laneKey).toUpperCase()}_${nextStatus}`,
        stage: nextStage,
        owner: next.owner || "ledger",
        file: next.file || "",
        lane: laneKey,
        status: nextStatus,
        message: next.message || lane.message || laneDef.label,
        detail: next.detail || {},
        progress: nextProgress
      };

      if (
        ledger.state.completionLatched &&
        laneKey !== "completionLatch" &&
        laneKey !== "canvasAndDiagnostic" &&
        laneKey !== "conductorHydration"
      ) {
        return archiveLateEvent(nextEvent, "post-latch-lane-update-archived");
      }

      if (
        statusRank(lane.status) > statusRank(nextStatus) &&
        lane.status !== STATUS.FAILED &&
        nextStatus !== STATUS.FAILED &&
        nextStatus !== STATUS.FINAL_READY &&
        nextStatus !== STATUS.LATCHED
      ) {
        return archiveLateEvent(nextEvent, "lane-status-regression-blocked");
      }

      lane.status = nextStatus;
      lane.message = next.message || lane.message;
      lane.progress = Math.max(Number(lane.progress || 0), nextProgress);
      lane.latestEvent = next.event || next.latestEvent || lane.latestEvent;
      lane.updatedAt = nowIso();

      if (lane.startedAt) {
        lane.elapsedMs = Math.max(0, new Date(lane.updatedAt).getTime() - new Date(lane.startedAt).getTime());
      }

      ledger.state.lanes[laneKey] = lane;
      ledger.push(nextEvent);
      return lane;
    };

    ledger.setCockpitMode = function setCockpitMode(mode) {
      ledger.state.cockpitMode = mode;
      ledger.state.dockVisible = mode === "diagnostic-dock";
      ledger.state.fullCockpitExpanded = mode !== "diagnostic-dock";
      ledger.state.planetObstructionReduced = mode === "diagnostic-dock";
      return ledger.push({
        id: "COCKPIT_MODE_SET",
        stage: ledger.state.currentFibonacciStage,
        owner: "hearth.js",
        file: ACTIVE_ROUTE_FILE,
        lane: "completionLatch",
        status: STATUS.READY,
        message: mode
      });
    };

    ledger.latchCompletion = function latchCompletion(reason = "completion-latched") {
      ledger.state.completionLatched = true;
      ledger.state.visibleLoadingActive = false;
      ledger.state.diagnosticCockpitReady = true;
      ledger.state.finalReceiptAvailable = true;
      ledger.state.currentFibonacciStage = "F21";
      ledger.state.highestStageReached = "F21";
      ledger.state.highestStageRank = stageRank("F21");
      ledger.state.cockpitMode = "diagnostic-dock";
      ledger.state.dockVisible = true;
      ledger.state.fullCockpitExpanded = false;
      ledger.state.planetObstructionReduced = true;
      ledger.state.updatedAt = nowIso();

      ledger.setLane("completionLatch", {
        status: STATUS.LATCHED,
        progress: 100,
        event: "COMPLETION_LATCHED",
        stage: "F21",
        owner: "hearth.js",
        file: ACTIVE_ROUTE_FILE,
        message: reason
      });

      return ledger.push({
        id: "LOADING_LOOP_SETTLED",
        stage: "F21",
        owner: "hearth.js",
        file: ACTIVE_ROUTE_FILE,
        lane: "completionLatch",
        status: STATUS.LATCHED,
        message: "Visible loader settled into compact diagnostic dock."
      });
    };

    ledger.getReceipt = function getLedgerReceipt() {
      return clonePlain(ledger.state);
    };

    ledger.getReceiptText = function getLedgerReceiptText() {
      if (originalGetReceiptText && !state.completionLatched) {
        try {
          return originalGetReceiptText();
        } catch (_error) {}
      }
      return getReceiptText();
    };

    ledger.copyDiagnostic = function copyLedgerDiagnostic() {
      return copyText(getReceiptText());
    };

    root.HEARTH_LOAD_LEDGER = ledger;
    refs.ledger = ledger;

    state.loadLedgerPresent = true;
    state.monotonicStageGuardActive = true;
    state.currentFibonacciStage = ledger.state.currentFibonacciStage || state.currentFibonacciStage;
    state.highestStageReached = ledger.state.highestStageReached || state.highestStageReached;
    state.highestStageRank = Math.max(stageRank(state.highestStageReached), Number(ledger.state.highestStageRank || 0));

    emitLocal("MONOTONIC_LOAD_LEDGER_ACQUIRED", {
      existingLedger: Boolean(existing),
      currentFibonacciStage: ledger.state.currentFibonacciStage,
      highestStageReached: ledger.state.highestStageReached
    }, false);

    return ledger;
  }

  function ledgerState() {
    return refs.ledger && refs.ledger.state ? refs.ledger.state : {};
  }

  function pushLedger(event) {
    const ledger = refs.ledger || ensureLedger();
    return ledger.push(event);
  }

  function setLedgerStage(stage, message, options = {}) {
    const ledger = refs.ledger || ensureLedger();
    return ledger.setStage(stage, message, options);
  }

  function setLedgerLane(lane, next = {}) {
    const ledger = refs.ledger || ensureLedger();
    return ledger.setLane(lane, next);
  }

  function emitLocal(event, detail = {}, visible = true) {
    const entry = {
      event,
      detail: clonePlain(detail),
      visible,
      at: nowIso()
    };

    state.events.push(entry);
    state.updatedAt = entry.at;

    if (visible && !state.completionLatched) {
      state.latestVisibleEvent = event;
    }

    if (state.events.length > 160) {
      state.events.splice(0, state.events.length - 160);
    }

    return entry;
  }

  function emit(event, detail = {}, options = {}) {
    const visible = options.visible !== false && !state.completionLatched;
    const stage = options.stage || state.currentFibonacciStage || state.fibonacciStage;
    const lane = options.lane || "";
    const status = options.status || "";

    const local = emitLocal(event, detail, visible);

    pushLedger({
      id: event,
      stage,
      owner: options.owner || "hearth.js",
      file: options.file || ACTIVE_ROUTE_FILE,
      lane,
      status,
      message: options.message || event,
      detail,
      progress: options.progress ?? ""
    });

    publishGlobals();
    return local;
  }

  function recordError(code, message, detail = {}) {
    const item = {
      code,
      message,
      detail: clonePlain(detail),
      at: nowIso()
    };

    state.errors.push(item);

    if (state.errors.length > 60) {
      state.errors.splice(0, state.errors.length - 60);
    }

    const led = ledgerState();
    if (Array.isArray(led.errors)) {
      led.errors.push(item);
      if (led.errors.length > 90) {
        led.errors.splice(0, led.errors.length - 90);
      }
    }

    emit("ERROR", item, { visible: false, lane: "errors", status: STATUS.FAILED });
    return item;
  }

  function ensureStyle() {
    if (!doc || doc.getElementById("hearth-cooperative-conductor-dock-style")) return;

    const style = doc.createElement("style");
    style.id = "hearth-cooperative-conductor-dock-style";
    style.textContent = `
      .hearth-ledger-cockpit{
        transition:max-height .22s ease, inset .22s ease, opacity .18s ease, transform .18s ease;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"][data-full-expanded="false"]{
        inset:auto 10px 10px 10px!important;
        max-height:128px!important;
        min-height:0!important;
        overflow:hidden!important;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"][data-full-expanded="false"] .hearth-ledger-head{
        padding:10px 14px 8px!important;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"][data-full-expanded="false"] .hearth-ledger-kicker{
        font-size:.58rem!important;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"][data-full-expanded="false"] .hearth-ledger-title{
        font-size:.96rem!important;
        white-space:nowrap!important;
        overflow:hidden!important;
        text-overflow:ellipsis!important;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"][data-full-expanded="false"] .hearth-ledger-meta{
        display:none!important;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"][data-full-expanded="false"] .hearth-ledger-latest{
        font-size:.64rem!important;
        white-space:nowrap!important;
        overflow:hidden!important;
        text-overflow:ellipsis!important;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"][data-full-expanded="false"] .hearth-ledger-progress{
        display:none!important;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"][data-full-expanded="false"] .hearth-ledger-scroll{
        display:none!important;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"][data-full-expanded="false"] .hearth-ledger-actions{
        padding:7px 10px 10px!important;
        border-bottom:0!important;
        position:relative!important;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"][data-full-expanded="false"] .hearth-ledger-button{
        min-height:28px!important;
        padding:6px 9px!important;
        font-size:.58rem!important;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"][data-full-expanded="true"]{
        inset:auto 10px 10px 10px!important;
        max-height:calc(100% - 20px)!important;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] [data-hearth-main-progress-fill]{
        width:100%!important;
      }

      @media (max-width:760px){
        .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"][data-full-expanded="false"]{
          inset:auto 8px 8px 8px!important;
          max-height:132px!important;
        }

        .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"][data-full-expanded="false"] .hearth-ledger-button{
          flex:1 1 auto!important;
          min-width:30%!important;
        }
      }
    `;
    doc.head.appendChild(style);
  }

  function ensureMount() {
    if (!doc) return null;

    let mount =
      doc.getElementById("hearthCanvasMount") ||
      doc.querySelector("[data-hearth-canvas-mount='true']") ||
      doc.querySelector("[data-hearth-canvas-mount]");

    if (!mount) {
      mount = doc.createElement("section");
      mount.id = "hearthCanvasMount";
      mount.dataset.hearthCanvasMount = "true";
      mount.dataset.hearthCanvasMountCreatedByConductor = "true";

      const parent = doc.getElementById("hearth-main") || doc.body || doc.documentElement;
      parent.appendChild(mount);
    }

    mount.id = mount.id || "hearthCanvasMount";
    mount.dataset.hearthCanvasMount = "true";
    mount.dataset.hearthConductorContract = CONTRACT;
    mount.dataset.hearthConductorReceipt = RECEIPT;
    mount.dataset.hearthReceiptOverlayIndependent = "true";
    mount.style.touchAction = "none";
    mount.style.userSelect = "none";

    refs.mount = mount;
    return mount;
  }

  function findExistingCockpit() {
    if (!doc) return null;

    return (
      doc.querySelector("[data-hearth-load-cockpit='true']") ||
      doc.getElementById("hearthLoadCockpit") ||
      doc.querySelector("[data-hearth-first-paint-cockpit='true']") ||
      null
    );
  }

  function createFallbackCockpit() {
    if (!doc) return null;

    const mount = ensureMount();
    if (!mount) return null;

    const cockpit = doc.createElement("aside");
    cockpit.id = "hearthLoadCockpit";
    cockpit.className = "hearth-ledger-cockpit";
    cockpit.dataset.hearthLoadCockpit = "true";
    cockpit.dataset.hearthFirstPaintCockpit = "fallback-created-by-conductor";
    cockpit.dataset.hearthLedgerOwner = "hearth.js";
    cockpit.dataset.hearthFibonacciStage = "F8";

    cockpit.innerHTML = `
      <div class="hearth-ledger-head">
        <div class="hearth-ledger-kicker">Hearth · Cooperative Load Ledger</div>
        <h2 class="hearth-ledger-title">FORMING HEARTH RUNTIME TABLE</h2>
        <div class="hearth-ledger-meta" data-hearth-stage-label>F8 · Conductor hydration</div>
        <div class="hearth-ledger-meta" data-hearth-heartbeat-text>heartbeat=active · stage=F8 · elapsed=00:00</div>
        <div class="hearth-ledger-latest" data-hearth-latest-event>latest=CONDUCTOR_STARTING</div>
      </div>

      <div class="hearth-ledger-progress">
        <div class="hearth-ledger-track">
          <span class="hearth-ledger-fill" data-hearth-main-progress-fill style="width:72%"></span>
        </div>
        <div class="hearth-ledger-percent" data-hearth-main-progress-percent>72%</div>
      </div>

      <div class="hearth-ledger-actions">
        <button class="hearth-ledger-button primary" type="button" data-hearth-copy-diagnostic>Copy diagnostic</button>
        <button class="hearth-ledger-button" type="button" data-hearth-toggle-receipt>Show receipt</button>
        <button class="hearth-ledger-button" type="button" data-hearth-collapse-cockpit>Collapse cockpit</button>
      </div>

      <div class="hearth-ledger-scroll">
        <div class="hearth-ledger-lanes" data-hearth-lane-list></div>
        <div class="hearth-ledger-receipt" data-hearth-receipt-box data-visible="false">
          <pre data-hearth-receipt-text></pre>
        </div>
      </div>
    `;

    mount.appendChild(cockpit);
    state.fallbackCockpitCreated = true;

    return cockpit;
  }

  function hydrateCockpit() {
    ensureStyle();

    const existing = findExistingCockpit();
    const cockpit = existing || createFallbackCockpit();

    if (!cockpit) return;

    refs.cockpit = cockpit;
    refs.title = cockpit.querySelector(".hearth-ledger-title");
    refs.stage =
      cockpit.querySelector("[data-hearth-stage-label]") ||
      cockpit.querySelector("[data-hearth-fibonacci-stage-label]");
    refs.heartbeat =
      cockpit.querySelector("[data-hearth-heartbeat-text]") ||
      cockpit.querySelector("[data-hearth-ledger-heartbeat]");
    refs.latest =
      cockpit.querySelector("[data-hearth-latest-event]") ||
      cockpit.querySelector("[data-hearth-ledger-latest]");
    refs.mainFill =
      cockpit.querySelector("[data-hearth-main-progress-fill]") ||
      cockpit.querySelector("[data-hearth-ledger-progress-fill]");
    refs.mainPercent =
      cockpit.querySelector("[data-hearth-main-progress-percent]") ||
      cockpit.querySelector("[data-hearth-ledger-progress-percent]");
    refs.laneList =
      cockpit.querySelector("[data-hearth-lane-list]") ||
      cockpit.querySelector("[data-hearth-ledger-lanes]");
    refs.receiptBox =
      cockpit.querySelector("[data-hearth-receipt-box]") ||
      cockpit.querySelector("[data-hearth-ledger-receipt]");
    refs.receiptPre =
      cockpit.querySelector("[data-hearth-receipt-text]") ||
      cockpit.querySelector("[data-hearth-ledger-receipt-text]");
    refs.copyButton =
      cockpit.querySelector("[data-hearth-copy-diagnostic]") ||
      cockpit.querySelector("[data-hearth-ledger-copy]");
    refs.receiptToggle =
      cockpit.querySelector("[data-hearth-toggle-receipt]") ||
      cockpit.querySelector("[data-hearth-ledger-toggle-receipt]");
    refs.collapseButton =
      cockpit.querySelector("[data-hearth-collapse-cockpit]") ||
      cockpit.querySelector("[data-hearth-ledger-collapse]");

    cockpit.dataset.hearthHydratedByConductor = "true";
    cockpit.dataset.hearthConductorContract = CONTRACT;
    cockpit.dataset.hearthConductorReceipt = RECEIPT;
    cockpit.dataset.hearthMonotonicStageGuardActive = "true";
    cockpit.dataset.hearthCooperativeCanvasHandoff = "true";

    state.hydratedExistingCockpit = Boolean(existing);
    state.duplicateCockpitCreated = false;
    state.partialReceiptAvailable = true;
    state.copyDiagnosticArmed = Boolean(refs.copyButton);
    state.buttonsReachable = Boolean(refs.copyButton);

    if (refs.copyButton) {
      refs.copyButton.onclick = copyDiagnostic;
    }

    if (refs.receiptToggle) {
      refs.receiptToggle.onclick = () => {
        if (!refs.receiptBox) return;
        const visible = refs.receiptBox.dataset.visible !== "true";
        refs.receiptBox.dataset.visible = String(visible);
        refs.receiptToggle.textContent = visible ? "Hide receipt" : "Show receipt";
        render();
      };
    }

    if (refs.collapseButton) {
      refs.collapseButton.onclick = () => {
        if (state.completionLatched) {
          const expanded = refs.cockpit.dataset.fullExpanded !== "true";
          setCockpitMode(expanded ? "expanded-cockpit" : "diagnostic-dock");
          return;
        }

        const collapsed = refs.cockpit.dataset.collapsed !== "true";
        refs.cockpit.dataset.collapsed = String(collapsed);
        refs.collapseButton.textContent = collapsed ? "Open cockpit" : "Collapse cockpit";
      };
    }

    setLedgerStage("F8", "Cooperative conductor hydration active", {
      owner: "hearth.js",
      file: ACTIVE_ROUTE_FILE
    });

    setLedgerLane("conductorHydration", {
      status: STATUS.HYDRATED,
      progress: stageProgress("F8"),
      event: "CONDUCTOR_HYDRATED_EXISTING_COCKPIT",
      stage: "F8",
      owner: "hearth.js",
      file: ACTIVE_ROUTE_FILE,
      message: state.hydratedExistingCockpit
        ? "Existing HTML cockpit hydrated."
        : "Fallback cockpit created by conductor."
    });

    emit("CONDUCTOR_HYDRATED_EXISTING_COCKPIT", {
      hydratedExistingCockpit: state.hydratedExistingCockpit,
      duplicateCockpitCreated: false
    }, {
      stage: "F8",
      lane: "conductorHydration",
      status: STATUS.HYDRATED
    });

    render();
  }

  function neutralizeOldLoaders() {
    if (!doc) return;

    const mount = ensureMount();
    if (!mount) return;

    mount.querySelectorAll("[data-hearth-mount-fallback], .mount-fallback").forEach((node) => {
      node.hidden = true;
      node.style.display = "none";
      node.dataset.hearthOldLoaderNeutralized = "true";
    });

    mount.querySelectorAll(".hearth-v2-overlay, .hearth-loading-overlay, [data-hearth-v2-live-diagnostic='true']").forEach((node) => {
      if (refs.cockpit && (node === refs.cockpit || refs.cockpit.contains(node))) return;
      node.remove();
    });

    emit("OLD_LOADER_NEUTRALIZED", {}, {
      stage: "F8",
      lane: "conductorHydration",
      status: STATUS.READY
    });
  }

  function guardRetiredClimateRoute() {
    root.__HEARTH_ACTIVE_ROUTE_FILE__ = ACTIVE_ROUTE_FILE;
    root.__HEARTH_ACTIVE_ROUTE_CONDUCTOR__ = ACTIVE_ROUTE_FILE;
    root.__HEARTH_ACTIVE_ROUTE_CONTRACT__ = CONTRACT;
    root.__HEARTH_RETIRED_CLIMATE_ROUTE__ = RETIRED_CLIMATE_ROUTE;
    root.__HEARTH_RETIRED_CLIMATE_ROUTE_ACTIVE_CARRIER__ = false;

    if (doc && doc.documentElement) {
      const dataset = doc.documentElement.dataset;
      dataset.hearthActiveRouteFile = ACTIVE_ROUTE_FILE;
      dataset.hearthActiveRouteConductor = ACTIVE_ROUTE_FILE;
      dataset.hearthActiveRouteContract = CONTRACT;
      dataset.hearthRetiredClimateRoute = RETIRED_CLIMATE_ROUTE;
      dataset.hearthRetiredClimateRouteActiveCarrier = "false";
      dataset.hearthMonotonicStageGuardActive = "true";
      dataset.hearthCooperativeCanvasHandoff = "true";
    }

    emit("RETIRED_CLIMATE_ROUTE_GUARDED", {
      retiredClimateRoute: RETIRED_CLIMATE_ROUTE,
      retiredClimateRouteActiveCarrier: false
    }, {
      stage: "F8",
      lane: "conductorHydration",
      status: STATUS.READY
    });
  }

  function getRuntimeTableApi() {
    return (
      root.LAB_RUNTIME_TABLE ||
      root.DexterRuntimeTable ||
      root.RUNTIME_TABLE ||
      root.LAB_UNIVERSAL_PLANET_RUNTIME_TABLE ||
      (root.DEXTER_LAB && root.DEXTER_LAB.runtimeTable) ||
      null
    );
  }

  function checkRuntimeTable() {
    const api = getRuntimeTableApi();

    state.runtimeTablePresent = Boolean(api);
    state.runtimeTableOptional = true;

    if (!api) {
      state.runtimeTableMode = "RUNTIME_TABLE_MISSING_ALLOWED";

      setLedgerLane("authorityAvailability", {
        status: STATUS.DEGRADED,
        progress: stageProgress("F5"),
        event: "RUNTIME_TABLE_MISSING_ALLOWED",
        stage: "F5",
        owner: "hearth.js",
        file: RUNTIME_TABLE_FILE,
        message: "Runtime Table missing; visible carrier continues."
      });

      return null;
    }

    state.runtimeTableMode = "RUNTIME_TABLE_READY_OR_DEGRADED";
    state.runtimeTablePlanAttempted = true;

    try {
      let plan = null;

      if (isFunction(api.createHearthVisualCarrierPlan)) {
        plan = api.createHearthVisualCarrierPlan({
          planetId: "hearth",
          planetLabel: "Hearth",
          route: ROUTE,
          samplePoint: { u: 0.5, v: 0.5, lon: 0, lat: 0, x: 0, y: 0, z: 1 },
          renderMetadata: {
            routeMounted: true,
            canvasMounted: Boolean(refs.mount),
            visibleCarrierAllowed: true,
            sphereContainment: true,
            noRectangularTextureSpill: true,
            distributedLoadLedger: true,
            monotonicStageGuard: true,
            cooperativeCanvasBoot: true
          }
        }, {
          profile: "hearth-cooperative-loader-carrier",
          planetId: "hearth",
          planetLabel: "Hearth"
        });
      } else if (isFunction(api.createVisualCarrierPlan)) {
        plan = api.createVisualCarrierPlan({
          planetId: "hearth",
          planetLabel: "Hearth",
          route: ROUTE,
          samplePoint: { u: 0.5, v: 0.5, lon: 0, lat: 0, x: 0, y: 0, z: 1 }
        });
      }

      state.runtimeTablePlan = plan || null;
      state.runtimeTablePlanCreated = Boolean(plan);

      setLedgerLane("authorityAvailability", {
        status: STATUS.READY,
        progress: stageProgress("F5"),
        event: "RUNTIME_TABLE_AVAILABLE",
        stage: "F5",
        owner: "hearth.js",
        file: RUNTIME_TABLE_FILE,
        message: state.runtimeTablePlanCreated
          ? "Runtime Table available and carrier plan created."
          : "Runtime Table available."
      });

      return plan;
    } catch (error) {
      state.runtimeTableMode = "RUNTIME_TABLE_DEGRADED";
      state.runtimeTablePlanError = error && error.message ? error.message : String(error);
      recordError("RUNTIME_TABLE_PLAN_ERROR", state.runtimeTablePlanError);

      setLedgerLane("authorityAvailability", {
        status: STATUS.DEGRADED,
        progress: stageProgress("F5"),
        event: "RUNTIME_TABLE_DEGRADED",
        stage: "F5",
        owner: "hearth.js",
        file: RUNTIME_TABLE_FILE,
        message: state.runtimeTablePlanError
      });

      return null;
    }
  }

  function getCanvasApi() {
    return (
      root.HEARTH_CANVAS ||
      root.HearthCanvas ||
      (root.HEARTH && root.HEARTH.canvas) ||
      null
    );
  }

  function selectCanvasMethod(api) {
    if (api && isFunction(api.bootCooperative)) return "bootCooperative";

    const fallback = [
      "boot",
      "mountVisibleCarrier",
      "bootVisibleCarrier",
      "mount",
      "start",
      "init",
      "render",
      "conduct"
    ].find((name) => isFunction(api && api[name]));

    return fallback || "";
  }

  function handleCanvasPhase(event) {
    const phase = event && (event.phase || event.id || event.event) ? String(event.phase || event.id || event.event) : "CANVAS_PHASE";
    const percent = clamp(Number(event.percent ?? event.progress ?? state.lastCanvasProgress ?? 78), 0, 100);
    const detail = isObject(event.detail) ? event.detail : {};
    const elapsedMs = Number(detail.elapsedMs ?? event.elapsedMs ?? state.canvasBootElapsedMs ?? 0);

    state.canvasPhaseCount += 1;
    state.lastCanvasPhase = phase;
    state.lastCanvasProgress = percent;
    state.canvasBootElapsedMs = Math.max(Number(state.canvasBootElapsedMs || 0), elapsedMs);
    state.canvasYieldCount = Math.max(Number(state.canvasYieldCount || 0), Number(detail.canvasYieldCount || 0));
    state.loaderRepaintDuringCanvasBoot = Boolean(state.loaderRepaintDuringCanvasBoot || detail.loaderRepaintDuringCanvasBoot || state.canvasYieldCount > 0);
    state.f13ProgressStreamActive = true;

    if (phase === "CANVAS_COOPERATIVE_BOOT_STARTED") {
      state.cooperativeBootUsed = true;
      state.canvasBootStartedAt = state.canvasBootStartedAt || nowIso();
      state.canvasBootStartedAtMs = state.canvasBootStartedAtMs || nowMs();
    }

    if (phase === "CANVAS_MOUNT_CREATED") {
      state.canvasCarrierMounted = true;
      state.canvasCarrierHandoffOk = true;
    }

    if (phase === "CANVAS_CONTEXT_READY") {
      state.canvasApiPresent = true;
    }

    if (phase === "ATLAS_BUILD_STARTED") {
      state.atlasBuildStarted = true;
    }

    if (phase === "ATLAS_BUILD_PROGRESS") {
      state.atlasBuildStarted = true;
      state.atlasBuildProgress = Math.max(state.atlasBuildProgress, Number(detail.atlasBuildProgress || 0));
    }

    if (phase === "ATLAS_BUILD_COMPLETE") {
      state.atlasBuildStarted = true;
      state.atlasBuildComplete = true;
      state.atlasBuildProgress = 100;
    }

    if (phase === "TEXTURE_COMPOSE_STARTED") {
      state.textureComposeStarted = true;
    }

    if (phase === "TEXTURE_COMPOSE_PROGRESS") {
      state.textureComposeStarted = true;
      state.textureComposeProgress = Math.max(state.textureComposeProgress, Number(detail.textureComposeProgress || 0));
    }

    if (phase === "TEXTURE_COMPOSE_COMPLETE") {
      state.textureComposeStarted = true;
      state.textureComposeComplete = true;
      state.textureComposeProgress = 100;
    }

    if (phase === "FIRST_FRAME_REQUESTED") {
      state.firstFrameRequested = true;
    }

    if (phase === "FIRST_FRAME_DETECTED") {
      state.firstFrameRequested = true;
      state.firstFrameDetected = true;
      state.imageRendered = true;
    }

    if (phase === "DRAG_INSPECTION_BOUND") {
      state.dragInspectionBound = true;
    }

    if (phase === "CANVAS_READY") {
      state.canvasReady = true;
      state.canvasCarrierMounted = true;
      state.canvasCarrierHandoffOk = true;
      state.firstFrameDetected = true;
      state.imageRendered = true;
      state.dragInspectionBound = true;
      state.canvasBootCompletedAt = state.canvasBootCompletedAt || nowIso();
      state.canvasBootCompletedAtMs = state.canvasBootCompletedAtMs || nowMs();
      state.canvasBootElapsedMs = Number(detail.canvasBootElapsedMs || state.canvasBootElapsedMs || (state.canvasBootCompletedAtMs - state.canvasBootStartedAtMs));
      state.postgameStatus = "CANVAS_READY_DIAGNOSTIC_DOCK_ACTIVE";
      state.firstFailedCoordinate = "NONE_CANVAS_READY";
      state.recommendedNextRenewalTarget = "read-postgame-canvas-or-triple-g-receipt";
    }

    const message = event.message || phaseToMessage(phase, percent, detail);

    state.phaseEvents.push({
      at: nowIso(),
      phase,
      percent,
      message,
      detail: clonePlain(detail)
    });

    if (state.phaseEvents.length > 180) {
      state.phaseEvents.splice(0, state.phaseEvents.length - 180);
    }

    state.latestVisibleEvent = phase;
    state.mainProgressCap = Math.max(state.mainProgressCap, percent);

    setLedgerStage("F13", message, {
      owner: "hearth.js",
      file: CANVAS_AUTHORITY_FILE
    });

    setLedgerLane("canvasAndDiagnostic", {
      status: phase === "CANVAS_READY" ? STATUS.FINAL_READY : phaseStatus(phase),
      progress: percent,
      event: phase,
      stage: "F13",
      owner: "hearth.canvas.js",
      file: CANVAS_AUTHORITY_FILE,
      message,
      detail
    });

    publishGlobals();
    render();

    if (phase === "CANVAS_READY" || (state.canvasCarrierMounted && state.firstFrameDetected && state.imageRendered && state.dragInspectionBound)) {
      state.finalReceiptAvailable = true;
      tryLatchCompletion();
    }

    return event;
  }

  function phaseStatus(phase) {
    if (phase === "CANVAS_MOUNT_CREATED") return STATUS.MOUNTED;
    if (phase === "CANVAS_CONTEXT_READY") return STATUS.READY;
    if (phase === "ATLAS_BUILD_COMPLETE") return STATUS.READY;
    if (phase === "TEXTURE_COMPOSE_COMPLETE") return STATUS.READY;
    if (phase === "FIRST_FRAME_DETECTED") return STATUS.RENDERED;
    if (phase === "DRAG_INSPECTION_BOUND") return STATUS.BOUND;
    if (phase === "CANVAS_READY") return STATUS.FINAL_READY;
    return STATUS.LOADING;
  }

  function phaseToMessage(phase, percent, detail = {}) {
    const elapsed = formatElapsed(detail.elapsedMs || state.canvasBootElapsedMs || 0);

    if (phase === "CANVAS_COOPERATIVE_BOOT_STARTED") return `Canvas cooperative boot started · elapsed ${elapsed}`;
    if (phase === "CANVAS_MOUNT_CREATED") return `Canvas mount created · elapsed ${elapsed}`;
    if (phase === "CANVAS_CONTEXT_READY") return `Canvas context ready · elapsed ${elapsed}`;
    if (phase === "ATLAS_BUILD_STARTED") return `Atlas build started · elapsed ${elapsed}`;
    if (phase === "ATLAS_BUILD_PROGRESS") {
      const chunk = detail.chunkIndex && detail.totalChunks ? `${detail.chunkIndex}/${detail.totalChunks} chunks` : `${detail.atlasBuildProgress || percent}%`;
      return `Atlas build active · ${chunk} · elapsed ${elapsed}`;
    }
    if (phase === "ATLAS_BUILD_COMPLETE") return `Atlas build complete · elapsed ${elapsed}`;
    if (phase === "TEXTURE_COMPOSE_STARTED") return `Texture composition started · elapsed ${elapsed}`;
    if (phase === "TEXTURE_COMPOSE_PROGRESS") {
      return `Texture composition active · ${detail.textureComposeProgress || percent}% · elapsed ${elapsed}`;
    }
    if (phase === "TEXTURE_COMPOSE_COMPLETE") return `Texture composition complete · elapsed ${elapsed}`;
    if (phase === "FIRST_FRAME_REQUESTED") return `First frame requested · elapsed ${elapsed}`;
    if (phase === "FIRST_FRAME_DETECTED") return `First frame detected · elapsed ${elapsed}`;
    if (phase === "DRAG_INSPECTION_BOUND") return `Drag inspection bound · elapsed ${elapsed}`;
    if (phase === "CANVAS_READY") return `Canvas ready · elapsed ${elapsed}`;
    return `${phase} · elapsed ${elapsed}`;
  }

  function getCanvasReceipt() {
    const api = getCanvasApi();

    if (api && isFunction(api.getReceipt)) {
      try {
        const receipt = api.getReceipt("hearth-cooperative-conductor-reconcile");
        if (receipt && isObject(receipt)) return receipt;
      } catch (error) {
        recordError("CANVAS_RECEIPT_READ_FAILED", error && error.message ? error.message : String(error));
      }
    }

    return (
      root.HEARTH_CANVAS_POSTGAME_RECEIPT ||
      root.HEARTH_CANVAS_RECEIPT ||
      root.HEARTH_HEX_BODY_BOUNDARY_CANVAS_RECEIPT_EXPORT ||
      null
    );
  }

  function canvasPayload() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      route: ROUTE,
      mountId: "hearthCanvasMount",
      activeRouteConductor: ACTIVE_ROUTE_FILE,
      retiredClimateRoute: RETIRED_CLIMATE_ROUTE,
      runtimeTablePlan: state.runtimeTablePlan,
      visibleCarrierFirst: true,
      runtimeTableOptional: true,
      runtimeTableMissingDoesNotBlockCarrier: true,
      wideProbeDeferred: true,
      sourceAuthorityHeld: true,
      singleAnchorIsLocalProofOnly: true,
      distributedLoadLedger: true,
      monotonicStageGuard: true,
      cooperativeCanvasBoot: true,
      diagnosticDockAfterLatch: true,
      loadLedger: refs.ledger || null,
      callbacks: {
        onCanvasPhase: handleCanvasPhase,
        onCanvasProgress: handleCanvasPhase,
        onMounted: (receipt) => {
          state.canvasCarrierMounted = true;
          state.canvasCarrierHandoffOk = true;
          handleCanvasReceipt(receipt, "onMounted");
        },
        onFirstFrame: (receipt) => {
          state.firstFrameRequested = true;
          state.firstFrameDetected = true;
          state.imageRendered = true;
          handleCanvasReceipt(receipt, "onFirstFrame");
        },
        onRendered: (receipt) => {
          state.firstFrameRequested = true;
          state.firstFrameDetected = true;
          state.imageRendered = true;
          handleCanvasReceipt(receipt, "onRendered");
        },
        onDragBound: (receipt) => {
          state.dragInspectionBound = true;
          handleCanvasReceipt(receipt, "onDragBound");
        },
        onReady: (receipt) => {
          state.canvasReady = true;
          state.finalReceiptAvailable = true;
          handleCanvasReceipt(receipt, "onReady");
        },
        onError: (receipt) => {
          handleCanvasReceipt(receipt, "onError");
        }
      }
    };
  }

  function updateCanvasWaitMessage() {
    if (!state.canvasCarrierRequested || state.canvasCarrierMounted || state.completionLatched) return;

    state.canvasBootElapsedMs = state.canvasBootStartedAtMs ? nowMs() - state.canvasBootStartedAtMs : 0;
    const elapsed = formatElapsed(state.canvasBootElapsedMs);

    let message = `Canvas cooperative boot pending · elapsed ${elapsed}`;

    if (state.cooperativeBootUsed) {
      message = `Canvas cooperative boot active · ${state.lastCanvasPhase || "starting"} · elapsed ${elapsed}`;
    } else if (state.syncBootFallbackUsed) {
      message = `Synchronous fallback boot active · browser may pause · elapsed ${elapsed}`;
    }

    if (state.canvasBootElapsedMs >= 30000 && state.cooperativeBootUsed) {
      message = `Long cooperative canvas boot · ${state.lastCanvasPhase || "active"} · receipt alive · elapsed ${elapsed}`;
    } else if (state.canvasBootElapsedMs >= 12000 && state.cooperativeBootUsed) {
      message = `Extended cooperative canvas boot · ${state.lastCanvasPhase || "active"} · elapsed ${elapsed}`;
    } else if (state.canvasBootElapsedMs >= 6000 && state.cooperativeBootUsed) {
      message = `Canvas still booting cooperatively · diagnostic alive · elapsed ${elapsed}`;
    }

    setLedgerLane("canvasAndDiagnostic", {
      status: STATUS.LOADING,
      progress: Math.max(78, Number(ledgerState().lanes?.canvasAndDiagnostic?.progress || 0)),
      event: "CANVAS_COOPERATIVE_BOOT_WAIT_VISIBLE",
      stage: "F13",
      owner: "hearth.js",
      file: CANVAS_AUTHORITY_FILE,
      message
    });

    state.latestVisibleEvent = "CANVAS_COOPERATIVE_BOOT_WAIT_VISIBLE";
  }

  function callCanvasCarrier() {
    const api = getCanvasApi();
    state.canvasApiPresent = Boolean(api);

    if (!api) {
      setLedgerStage("F13", "Canvas API pending", {
        owner: "hearth.js",
        file: CANVAS_AUTHORITY_FILE
      });

      setLedgerLane("canvasAndDiagnostic", {
        status: STATUS.LOADING,
        progress: 64,
        event: "CANVAS_API_PENDING",
        stage: "F13",
        owner: "hearth.js",
        file: CANVAS_AUTHORITY_FILE,
        message: "Canvas API pending."
      });

      render();
      return;
    }

    if (canvasCallAttempted) {
      reconcileAll("canvas-call-already-attempted");
      return;
    }

    const method = selectCanvasMethod(api);

    state.cooperativeBootAvailable = Boolean(isFunction(api.bootCooperative));

    if (!method) {
      state.canvasCarrierHandoffError = "Canvas API present but no supported boot/mount method exists.";
      state.finalReceiptAvailable = true;
      state.postgameStatus = "CANVAS_METHOD_MISSING";
      state.firstFailedCoordinate = "F13_CANVAS_METHOD_MISSING";
      state.recommendedNextRenewalTarget = "canvas-export-method-renewal";

      recordError("CANVAS_METHOD_MISSING", state.canvasCarrierHandoffError);

      setLedgerLane("canvasAndDiagnostic", {
        status: STATUS.FAILED,
        progress: 100,
        event: "CANVAS_METHOD_MISSING",
        stage: "F13",
        owner: "hearth.js",
        file: CANVAS_AUTHORITY_FILE,
        message: state.canvasCarrierHandoffError
      });

      render();
      return;
    }

    canvasCallAttempted = true;
    state.canvasCarrierRequested = true;
    state.canvasCarrierMethod = method;
    state.cooperativeBootUsed = method === "bootCooperative";
    state.syncBootFallbackUsed = method !== "bootCooperative";
    state.canvasBootStartedAt = nowIso();
    state.canvasBootStartedAtMs = nowMs();
    state.canvasBootElapsedMs = 0;
    state.lastCanvasPhase = state.cooperativeBootUsed ? "CANVAS_COOPERATIVE_BOOT_SELECTED" : "SYNC_BOOT_FALLBACK_SELECTED";
    state.lastCanvasProgress = state.cooperativeBootUsed ? 78 : 76;
    state.f13ProgressStreamActive = state.cooperativeBootUsed;
    state.postgameStatus = state.cooperativeBootUsed ? "COOPERATIVE_CANVAS_BOOT_STARTED" : "SYNC_BOOT_FALLBACK_USED";
    state.firstFailedCoordinate = state.cooperativeBootUsed ? "F13_CANVAS_COOPERATIVE_BOOT_STARTED" : "F13_SYNC_BOOT_FALLBACK";

    setLedgerStage("F13", state.cooperativeBootUsed ? "Canvas cooperative boot starting" : "Canvas synchronous fallback starting", {
      owner: "hearth.js",
      file: CANVAS_AUTHORITY_FILE
    });

    setLedgerLane("canvasAndDiagnostic", {
      status: STATUS.LOADING,
      progress: state.lastCanvasProgress,
      event: state.lastCanvasPhase,
      stage: "F13",
      owner: "hearth.js",
      file: CANVAS_AUTHORITY_FILE,
      message: state.cooperativeBootUsed
        ? "Canvas cooperative boot selected."
        : "Synchronous canvas fallback selected; loader may pause."
    });

    emit("CANVAS_CARRIER_METHOD_SELECTED", {
      method,
      cooperativeBootAvailable: state.cooperativeBootAvailable,
      cooperativeBootUsed: state.cooperativeBootUsed,
      syncBootFallbackUsed: state.syncBootFallbackUsed
    }, {
      stage: "F13",
      lane: "canvasAndDiagnostic",
      status: STATUS.READY,
      progress: state.lastCanvasProgress
    });

    render();

    root.setTimeout(() => {
      let result;

      try {
        result = api[method](canvasPayload());
      } catch (error) {
        state.canvasCarrierHandoffOk = false;
        state.canvasCarrierHandoffError = error && error.message ? error.message : String(error);
        state.finalReceiptAvailable = true;
        state.postgameStatus = "CANVAS_HANDOFF_ERROR";
        state.firstFailedCoordinate = "F13_CANVAS_HANDOFF_ERROR";
        state.recommendedNextRenewalTarget = "canvas-handoff-method-or-payload-renewal";

        recordError("CANVAS_HANDOFF_ERROR", state.canvasCarrierHandoffError, { method });

        setLedgerLane("canvasAndDiagnostic", {
          status: STATUS.FAILED,
          progress: 100,
          event: "CANVAS_HANDOFF_ERROR",
          stage: "F13",
          owner: "hearth.js",
          file: CANVAS_AUTHORITY_FILE,
          message: state.canvasCarrierHandoffError
        });

        render();
        return;
      }

      state.canvasCarrierHandoffOk = true;

      emit("CANVAS_CARRIER_CALLED", {
        method,
        handoffOk: true,
        cooperativeBootUsed: state.cooperativeBootUsed,
        syncBootFallbackUsed: state.syncBootFallbackUsed
      }, {
        visible: false,
        stage: "F13",
        lane: "canvasAndDiagnostic",
        status: STATUS.LOADING
      });

      if (result && isFunction(result.then)) {
        result
          .then((receipt) => {
            handleCanvasReceipt(receipt, "cooperative-promise-resolved");
          })
          .catch((error) => {
            state.canvasCarrierHandoffOk = false;
            state.canvasCarrierHandoffError = error && error.message ? error.message : String(error);
            state.postgameStatus = "CANVAS_BOOT_PHASE_ERROR";
            state.firstFailedCoordinate = "F13_CANVAS_PROMISE_REJECTED";
            state.finalReceiptAvailable = true;

            recordError("CANVAS_PROMISE_REJECTED", state.canvasCarrierHandoffError);

            setLedgerLane("canvasAndDiagnostic", {
              status: STATUS.FAILED,
              progress: 100,
              event: "CANVAS_PROMISE_REJECTED",
              stage: "F13",
              owner: "hearth.js",
              file: CANVAS_AUTHORITY_FILE,
              message: state.canvasCarrierHandoffError
            });

            render();
          });
        return;
      }

      if (result && isObject(result)) {
        handleCanvasReceipt(result, "canvas-method-returned-receipt");
      } else {
        reconcileAll("canvas-method-returned-no-receipt");
      }
    }, 80);
  }

  function reconcileFromDataset() {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;
    const mount = refs.mount || ensureMount();

    state.canvasApiPresent = Boolean(getCanvasApi());

    state.cooperativeBootAvailable = Boolean(
      state.cooperativeBootAvailable ||
      bool(dataset.hearthCanvasCooperativeBootAvailable) ||
      isFunction(getCanvasApi()?.bootCooperative)
    );

    state.cooperativeBootUsed = Boolean(
      state.cooperativeBootUsed ||
      bool(dataset.hearthCanvasCooperativeBootUsed)
    );

    state.syncBootFallbackUsed = Boolean(
      state.syncBootFallbackUsed ||
      bool(dataset.hearthCanvasSyncBootFallbackUsed)
    );

    state.canvasCarrierMounted = Boolean(
      state.canvasCarrierMounted ||
      bool(dataset.hearthCanvasCarrierMounted) ||
      bool(dataset.hearthVisibleCarrierMounted) ||
      (mount && mount.querySelector("canvas")) ||
      (mount && bool(mount.dataset.hearthCanvasMounted)) ||
      (mount && bool(mount.dataset.hearthVisibleCarrierMounted))
    );

    state.canvasCarrierHandoffOk = Boolean(
      state.canvasCarrierHandoffOk ||
      bool(dataset.hearthCanvasCarrierHandoffOk) ||
      state.canvasCarrierMounted
    );

    state.firstFrameRequested = Boolean(
      state.firstFrameRequested ||
      bool(dataset.hearthFirstFrameRequested)
    );

    state.firstFrameDetected = Boolean(
      state.firstFrameDetected ||
      bool(dataset.hearthFirstFrameDetected) ||
      bool(dataset.hearthImageRendered) ||
      bool(dataset.hearthCanvasImageRendered)
    );

    state.imageRendered = Boolean(
      state.imageRendered ||
      state.firstFrameDetected ||
      bool(dataset.hearthImageRendered) ||
      bool(dataset.hearthCanvasImageRendered)
    );

    state.dragInspectionBound = Boolean(
      state.dragInspectionBound ||
      bool(dataset.hearthDragInspectionBound) ||
      bool(dataset.hearthControlsBound) ||
      (mount && bool(mount.dataset.hearthDragInspectionBound)) ||
      (mount && bool(mount.dataset.hearthControlsBound)) ||
      (mount && mount.style && mount.style.touchAction === "none")
    );

    state.canvasReady = Boolean(
      state.canvasReady ||
      bool(dataset.hearthCanvasReady)
    );

    state.canvasBootElapsedMs = Math.max(
      Number(state.canvasBootElapsedMs || 0),
      Number(dataset.hearthCanvasBootElapsedMs || 0)
    );

    state.canvasYieldCount = Math.max(
      Number(state.canvasYieldCount || 0),
      Number(dataset.hearthCanvasYieldCount || 0)
    );

    state.canvasPhaseCount = Math.max(
      Number(state.canvasPhaseCount || 0),
      Number(dataset.hearthCanvasPhaseCount || 0)
    );

    if (dataset.hearthCanvasLastPhase) state.lastCanvasPhase = dataset.hearthCanvasLastPhase;
    if (Number(dataset.hearthCanvasLastProgress || 0)) {
      state.lastCanvasProgress = Math.max(state.lastCanvasProgress, Number(dataset.hearthCanvasLastProgress || 0));
      state.mainProgressCap = Math.max(state.mainProgressCap, state.lastCanvasProgress);
    }

    state.loaderRepaintDuringCanvasBoot = Boolean(
      state.loaderRepaintDuringCanvasBoot ||
      bool(dataset.hearthLoaderRepaintDuringCanvasBoot) ||
      state.canvasYieldCount > 0
    );

    state.f13ProgressStreamActive = Boolean(
      state.f13ProgressStreamActive ||
      bool(dataset.hearthF13ProgressStreamActive)
    );

    state.atlasBuildStarted = Boolean(state.atlasBuildStarted || bool(dataset.hearthAtlasBuildStarted));
    state.atlasBuildProgress = Math.max(Number(state.atlasBuildProgress || 0), Number(dataset.hearthAtlasBuildProgress || 0));
    state.atlasBuildComplete = Boolean(state.atlasBuildComplete || bool(dataset.hearthAtlasBuildComplete));

    state.textureComposeStarted = Boolean(state.textureComposeStarted || bool(dataset.hearthTextureComposeStarted));
    state.textureComposeProgress = Math.max(Number(state.textureComposeProgress || 0), Number(dataset.hearthTextureComposeProgress || 0));
    state.textureComposeComplete = Boolean(state.textureComposeComplete || bool(dataset.hearthTextureComposeComplete));

    if (state.canvasCarrierMounted && !state.firstFrameDetected && !state.imageRendered) {
      root.requestAnimationFrame(() => {
        if (state.canvasCarrierMounted) {
          state.firstFrameDetected = true;
          state.imageRendered = true;
          reconcileAll("request-animation-frame-first-frame-inferred");
        }
      });
    }
  }

  function handleCanvasReceipt(receipt, reason = "canvas-receipt") {
    const value = receipt && isObject(receipt) ? receipt : getCanvasReceipt();

    if (value && isObject(value)) {
      state.cooperativeBootAvailable = Boolean(state.cooperativeBootAvailable || value.cooperativeBootAvailable);
      state.cooperativeBootUsed = Boolean(state.cooperativeBootUsed || value.cooperativeBootUsed);
      state.syncBootFallbackUsed = Boolean(state.syncBootFallbackUsed || value.syncBootFallbackUsed);

      state.canvasCarrierMounted = Boolean(
        state.canvasCarrierMounted ||
        value.canvasCarrierMounted ||
        value.visibleCarrierMounted ||
        value.mounted ||
        value.canvasMounted
      );

      state.canvasCarrierHandoffOk = Boolean(
        state.canvasCarrierHandoffOk ||
        state.canvasCarrierMounted ||
        value.canvasCarrierHandoffOk ||
        value.handoffOk
      );

      state.firstFrameRequested = Boolean(
        state.firstFrameRequested ||
        value.firstFrameRequested
      );

      state.firstFrameDetected = Boolean(
        state.firstFrameDetected ||
        value.firstFrameDetected ||
        value.imageRendered ||
        Number(value.frames || 0) > 0
      );

      state.imageRendered = Boolean(
        state.imageRendered ||
        state.firstFrameDetected ||
        value.imageRendered ||
        Number(value.frames || 0) > 0
      );

      state.dragInspectionBound = Boolean(
        state.dragInspectionBound ||
        value.dragInspectionBound ||
        value.pointerControlsBound ||
        value.controlsBound
      );

      state.canvasReady = Boolean(state.canvasReady || value.canvasReady);

      state.canvasBootElapsedMs = Math.max(Number(state.canvasBootElapsedMs || 0), Number(value.canvasBootElapsedMs || 0));
      state.canvasYieldCount = Math.max(Number(state.canvasYieldCount || 0), Number(value.canvasYieldCount || 0));
      state.canvasPhaseCount = Math.max(Number(state.canvasPhaseCount || 0), Number(value.canvasPhaseCount || 0));
      state.lastCanvasPhase = value.lastCanvasPhase || state.lastCanvasPhase;
      state.lastCanvasProgress = Math.max(Number(state.lastCanvasProgress || 0), Number(value.lastCanvasProgress || 0));
      state.loaderRepaintDuringCanvasBoot = Boolean(state.loaderRepaintDuringCanvasBoot || value.loaderRepaintDuringCanvasBoot || state.canvasYieldCount > 0);
      state.f13ProgressStreamActive = Boolean(state.f13ProgressStreamActive || value.f13ProgressStreamActive);

      state.atlasBuildStarted = Boolean(state.atlasBuildStarted || value.atlasBuildStarted);
      state.atlasBuildProgress = Math.max(Number(state.atlasBuildProgress || 0), Number(value.atlasBuildProgress || 0));
      state.atlasBuildComplete = Boolean(state.atlasBuildComplete || value.atlasBuildComplete);

      state.textureComposeStarted = Boolean(state.textureComposeStarted || value.textureComposeStarted);
      state.textureComposeProgress = Math.max(Number(state.textureComposeProgress || 0), Number(value.textureComposeProgress || 0));
      state.textureComposeComplete = Boolean(state.textureComposeComplete || value.textureComposeComplete);

      if (Array.isArray(value.phaseEvents)) {
        value.phaseEvents.forEach((event) => {
          if (!event || !event.phase) return;
          if (state.phaseEvents.some((existing) => existing.at === event.at && existing.phase === event.phase)) return;
          state.phaseEvents.push(clonePlain(event));
        });
        if (state.phaseEvents.length > 180) {
          state.phaseEvents.splice(0, state.phaseEvents.length - 180);
        }
      }

      if (value.postgameStatus && value.postgameStatus !== "COOPERATIVE_CANVAS_BOOT_PENDING") {
        state.postgameStatus = value.postgameStatus;
      }

      if (value.firstFailedCoordinate) {
        state.firstFailedCoordinate = value.firstFailedCoordinate;
      }
    }

    reconcileAll(reason);
  }

  function reconcileAll(reason = "manual") {
    reconcileFromDataset();

    const canvasReceipt = getCanvasReceipt();

    if (canvasReceipt && isObject(canvasReceipt)) {
      handleCanvasReceiptLight(canvasReceipt);
    }

    if (state.canvasCarrierMounted) {
      setLedgerLane("canvasAndDiagnostic", {
        status: state.canvasReady ? STATUS.FINAL_READY : (state.imageRendered ? STATUS.RENDERED : STATUS.MOUNTED),
        progress: state.canvasReady ? 100 : Math.max(state.lastCanvasProgress || 0, state.imageRendered ? 98 : 88),
        event: state.canvasReady ? "CANVAS_READY" : (state.imageRendered ? "FIRST_FRAME_DETECTED" : "CANVAS_MOUNT_CONFIRMED"),
        stage: "F13",
        owner: "hearth.js",
        file: CANVAS_AUTHORITY_FILE,
        message: state.canvasReady
          ? "Canvas ready."
          : (state.imageRendered ? "Canvas first frame detected." : "Canvas carrier mounted; first frame proof pending.")
      });
    }

    if (state.canvasReady || (state.canvasCarrierMounted && (state.firstFrameDetected || state.imageRendered) && state.dragInspectionBound)) {
      state.finalReceiptAvailable = true;
      state.postgameStatus = "CANVAS_READY_DIAGNOSTIC_DOCK_ACTIVE";
      state.firstFailedCoordinate = "NONE_CANVAS_READY";
      state.recommendedNextRenewalTarget = "read-postgame-canvas-or-triple-g-receipt";

      setLedgerLane("canvasAndDiagnostic", {
        status: STATUS.FINAL_READY,
        progress: 100,
        event: "CANVAS_READY",
        stage: "F13",
        owner: "hearth.js",
        file: ACTIVE_ROUTE_FILE,
        message: "Canvas ready; final conductor receipt available."
      });

      tryLatchCompletion();
    } else if (!state.completionLatched && state.canvasCarrierRequested) {
      updateCanvasWaitMessage();
    }

    if (!state.completionLatched && reason !== "heartbeat") {
      emit("RECONCILE", { reason }, {
        visible: false,
        stage: state.currentFibonacciStage,
        lane: "conductorHydration"
      });
    }

    publishGlobals();
    render();
  }

  function handleCanvasReceiptLight(value) {
    state.cooperativeBootAvailable = Boolean(state.cooperativeBootAvailable || value.cooperativeBootAvailable);
    state.cooperativeBootUsed = Boolean(state.cooperativeBootUsed || value.cooperativeBootUsed);
    state.syncBootFallbackUsed = Boolean(state.syncBootFallbackUsed || value.syncBootFallbackUsed);

    state.canvasCarrierMounted = Boolean(
      state.canvasCarrierMounted ||
      value.canvasCarrierMounted ||
      value.visibleCarrierMounted ||
      value.mounted ||
      value.canvasMounted
    );

    state.canvasCarrierHandoffOk = Boolean(
      state.canvasCarrierHandoffOk ||
      state.canvasCarrierMounted ||
      value.canvasCarrierHandoffOk ||
      value.handoffOk
    );

    state.firstFrameRequested = Boolean(state.firstFrameRequested || value.firstFrameRequested);

    state.firstFrameDetected = Boolean(
      state.firstFrameDetected ||
      value.firstFrameDetected ||
      value.imageRendered ||
      Number(value.frames || 0) > 0
    );

    state.imageRendered = Boolean(
      state.imageRendered ||
      state.firstFrameDetected ||
      value.imageRendered ||
      Number(value.frames || 0) > 0
    );

    state.dragInspectionBound = Boolean(
      state.dragInspectionBound ||
      value.dragInspectionBound ||
      value.pointerControlsBound ||
      value.controlsBound
    );

    state.canvasReady = Boolean(state.canvasReady || value.canvasReady);
    state.canvasBootElapsedMs = Math.max(Number(state.canvasBootElapsedMs || 0), Number(value.canvasBootElapsedMs || 0));
    state.canvasYieldCount = Math.max(Number(state.canvasYieldCount || 0), Number(value.canvasYieldCount || 0));
    state.canvasPhaseCount = Math.max(Number(state.canvasPhaseCount || 0), Number(value.canvasPhaseCount || 0));
    state.lastCanvasPhase = value.lastCanvasPhase || state.lastCanvasPhase;
    state.lastCanvasProgress = Math.max(Number(state.lastCanvasProgress || 0), Number(value.lastCanvasProgress || 0));
    state.loaderRepaintDuringCanvasBoot = Boolean(state.loaderRepaintDuringCanvasBoot || value.loaderRepaintDuringCanvasBoot || state.canvasYieldCount > 0);
    state.f13ProgressStreamActive = Boolean(state.f13ProgressStreamActive || value.f13ProgressStreamActive);
  }

  function completionReady() {
    return (
      state.hydratedExistingCockpit === true &&
      state.loadLedgerPresent === true &&
      state.canvasApiPresent === true &&
      state.canvasCarrierRequested === true &&
      state.canvasCarrierMounted === true &&
      state.canvasCarrierHandoffOk === true &&
      (state.firstFrameDetected === true || state.imageRendered === true) &&
      state.dragInspectionBound === true &&
      state.copyDiagnosticArmed === true &&
      state.buttonsReachable === true &&
      state.partialReceiptAvailable === true &&
      state.finalReceiptAvailable === true &&
      (state.canvasReady === true || state.postgameStatus === "CANVAS_READY_DIAGNOSTIC_DOCK_ACTIVE")
    );
  }

  function tryLatchCompletion() {
    if (state.completionLatched || !completionReady()) return false;

    state.fibonacciStage = "F21";
    state.currentFibonacciStage = "F21";
    state.highestStageReached = "F21";
    state.highestStageRank = stageRank("F21");
    state.completionLatched = true;
    state.visibleLoadingActive = false;
    state.diagnosticCockpitReady = true;
    state.latestVisibleEvent = "COMPLETION_LATCHED";
    state.mainProgressCap = 100;
    state.mainDisplayProgress = 100;
    state.cockpitMode = "diagnostic-dock";
    state.dockVisible = true;
    state.fullCockpitExpanded = false;
    state.planetObstructionReduced = true;
    state.postgameStatus = "CANVAS_READY_DIAGNOSTIC_DOCK_ACTIVE";
    state.firstFailedCoordinate = "NONE_CANVAS_READY";
    state.recommendedNextRenewalTarget = "read-postgame-canvas-or-triple-g-receipt";

    const led = ledgerState();
    led.completionLatched = true;
    led.visibleLoadingActive = false;
    led.diagnosticCockpitReady = true;
    led.currentFibonacciStage = "F21";
    led.highestStageReached = "F21";
    led.highestStageRank = stageRank("F21");
    led.cockpitMode = "diagnostic-dock";
    led.dockVisible = true;
    led.fullCockpitExpanded = false;
    led.planetObstructionReduced = true;
    led.finalReceiptAvailable = true;
    led.copyDiagnosticArmed = true;
    led.partialReceiptAvailable = true;

    if (refs.ledger && isFunction(refs.ledger.latchCompletion)) {
      refs.ledger.latchCompletion("READY · Planet visible · diagnostic available");
    }

    setLedgerLane("completionLatch", {
      status: STATUS.LATCHED,
      progress: 100,
      event: "COMPLETION_LATCHED",
      stage: "F21",
      owner: "hearth.js",
      file: ACTIVE_ROUTE_FILE,
      message: "READY · Planet visible · diagnostic available"
    });

    emitLocal("COMPLETION_LATCHED", {
      diagnosticCockpitReady: true,
      cockpitMode: "diagnostic-dock",
      planetObstructionReduced: true
    }, true);

    setCockpitMode("diagnostic-dock");
    enforcePostLatchVisibleState();
    render();
    publishGlobals();

    return true;
  }

  function setCockpitMode(mode) {
    if (!refs.cockpit) return;

    const expanded = mode === "expanded-cockpit";

    state.cockpitMode = expanded ? "expanded-cockpit" : "diagnostic-dock";
    state.dockVisible = !expanded;
    state.fullCockpitExpanded = expanded;
    state.planetObstructionReduced = !expanded;

    refs.cockpit.dataset.cockpitMode = expanded ? "expanded-cockpit" : "diagnostic-dock";
    refs.cockpit.dataset.fullExpanded = String(expanded);
    refs.cockpit.dataset.hearthCockpitMode = refs.cockpit.dataset.cockpitMode;
    refs.cockpit.dataset.hearthDockVisible = String(!expanded);
    refs.cockpit.dataset.hearthPlanetObstructionReduced = String(!expanded);
    refs.cockpit.dataset.collapsed = "false";

    if (refs.collapseButton) {
      refs.collapseButton.textContent = expanded ? "Collapse dock" : "Expand cockpit";
    }

    const led = ledgerState();
    led.cockpitMode = state.cockpitMode;
    led.dockVisible = state.dockVisible;
    led.fullCockpitExpanded = state.fullCockpitExpanded;
    led.planetObstructionReduced = state.planetObstructionReduced;
  }

  function enforcePostLatchVisibleState() {
    if (!state.completionLatched) return;

    state.currentFibonacciStage = "F21";
    state.fibonacciStage = "F21";
    state.highestStageReached = "F21";
    state.highestStageRank = stageRank("F21");
    state.mainProgressCap = 100;
    state.mainDisplayProgress = 100;
    state.visibleLoadingActive = false;
    state.diagnosticCockpitReady = true;
    state.latestVisibleEvent = "COMPLETION_LATCHED";

    const led = ledgerState();
    led.currentFibonacciStage = "F21";
    led.highestStageReached = "F21";
    led.highestStageRank = stageRank("F21");
    led.completionLatched = true;
    led.visibleLoadingActive = false;
    led.diagnosticCockpitReady = true;
    led.cockpitMode = state.cockpitMode || "diagnostic-dock";
    led.visualPassClaimed = false;

    if (refs.cockpit) {
      refs.cockpit.dataset.hearthFibonacciStage = "F21";
      refs.cockpit.dataset.hearthCompletionLatched = "true";
      refs.cockpit.dataset.hearthVisibleLoadingActive = "false";
      refs.cockpit.dataset.hearthDiagnosticCockpitReady = "true";
      refs.cockpit.dataset.cockpitMode = state.cockpitMode || "diagnostic-dock";
      refs.cockpit.dataset.fullExpanded = String(state.fullCockpitExpanded);
    }
  }

  function laneMarkup() {
    const led = ledgerState();
    const lanes = led.lanes || {};

    return LANES.map((laneDef) => {
      const lane = lanes[laneDef.key] || makeLane(laneDef);
      const status = lane.status || STATUS.REQUESTED;
      const progress = clamp(lane.progress, 0, 100);
      const fib = lane.fibonacci || laneDef.fib;
      const message = lane.message || laneDef.label;
      const event = lane.latestEvent || "PENDING";

      return `
        <section class="hearth-ledger-lane" data-lane="${escapeHtml(laneDef.key)}" data-status="${escapeHtml(status)}">
          <div class="hearth-ledger-lane-top">
            <span class="hearth-ledger-lane-title">
              <strong>${escapeHtml(laneDef.label)} · ${escapeHtml(fib)}</strong>
              <span>${escapeHtml(message)}</span>
            </span>
            <span class="hearth-ledger-lane-status">${escapeHtml(status)}</span>
          </div>
          <div class="hearth-ledger-lane-track">
            <span class="hearth-ledger-lane-fill" style="width:${progress}%"></span>
          </div>
          <div class="hearth-ledger-lane-title">
            <span>event=${escapeHtml(event)}</span>
          </div>
        </section>
      `;
    }).join("");
  }

  function render() {
    if (!refs.cockpit) return;

    if (state.completionLatched) {
      enforcePostLatchVisibleState();
    }

    const led = ledgerState();
    const stage = state.completionLatched
      ? "F21"
      : (led.currentFibonacciStage || state.currentFibonacciStage || "F8");
    const elapsed = nowMs() - state.startedAtMs;

    let progress = state.completionLatched
      ? 100
      : Math.max(stageProgress(stage), Number(state.mainProgressCap || 0), Number(state.lastCanvasProgress || 0));

    if (!state.completionLatched) {
      if (Math.abs(progress - state.mainDisplayProgress) > 0.08) {
        state.mainDisplayProgress += (progress - state.mainDisplayProgress) * 0.16;
      } else {
        state.mainDisplayProgress = progress;
      }
    } else {
      state.mainDisplayProgress = 100;
    }

    const displayProgress = Math.round(state.mainDisplayProgress);

    refs.cockpit.dataset.hearthFibonacciStage = stage;
    refs.cockpit.dataset.hearthCompletionLatched = String(state.completionLatched);
    refs.cockpit.dataset.hearthDiagnosticCockpitReady = String(state.diagnosticCockpitReady);
    refs.cockpit.dataset.hearthVisibleLoadingActive = String(state.visibleLoadingActive);
    refs.cockpit.dataset.hearthMonotonicStageGuardActive = "true";
    refs.cockpit.dataset.hearthCooperativeCanvasHandoff = "true";
    refs.cockpit.dataset.cockpitMode = state.cockpitMode;
    refs.cockpit.dataset.fullExpanded = String(state.fullCockpitExpanded);

    if (refs.title) {
      refs.title.textContent = state.completionLatched
        ? "READY · PLANET VISIBLE · DIAGNOSTIC AVAILABLE"
        : "FORMING HEARTH RUNTIME TABLE";
    }

    if (refs.stage) {
      refs.stage.textContent = state.completionLatched
        ? "F21 · Completion latch"
        : `${stage} · ${stageLabel(stage)}`;
    }

    if (refs.heartbeat) {
      if (state.completionLatched) {
        refs.heartbeat.textContent = `heartbeat=quiet · latched=true · elapsed=${formatElapsed(elapsed)}`;
      } else if (stage === "F13") {
        const phase = state.lastCanvasPhase || "CANVAS_BOOT_PENDING";
        const canvasElapsed = state.canvasBootStartedAtMs ? nowMs() - state.canvasBootStartedAtMs : state.canvasBootElapsedMs;
        refs.heartbeat.textContent = `cooperative=${state.cooperativeBootUsed} · phase=${phase} · elapsed=${formatElapsed(canvasElapsed)}`;
      } else {
        refs.heartbeat.textContent = `heartbeat=active · stage=${stage} · elapsed=${formatElapsed(elapsed)}`;
      }
    }

    if (refs.latest) {
      refs.latest.textContent = state.completionLatched
        ? "latest=COMPLETION_LATCHED · READY"
        : `latest=${state.latestVisibleEvent}`;
    }

    if (refs.mainFill) {
      refs.mainFill.style.width = `${displayProgress}%`;
    }

    if (refs.mainPercent) {
      refs.mainPercent.textContent = `${displayProgress}%`;
    }

    if (refs.laneList) {
      const next = laneMarkup();
      if (next !== lastLaneMarkup) {
        refs.laneList.innerHTML = next;
        lastLaneMarkup = next;
      }
    }

    if (refs.receiptPre) {
      refs.receiptPre.textContent = getReceiptText();
    }

    publishGlobals();

    if (!state.completionLatched || Math.abs(state.mainDisplayProgress - state.mainProgressCap) > 0.08) {
      if (!raf) raf = root.requestAnimationFrame(render);
    } else {
      raf = 0;
    }
  }

  function startHeartbeat() {
    if (heartbeatTimer) root.clearInterval(heartbeatTimer);

    heartbeatTimer = root.setInterval(() => {
      state.heartbeatElapsedMs = nowMs() - state.startedAtMs;

      if (!state.completionLatched) {
        updateCanvasWaitMessage();
        reconcileAll("heartbeat");
      } else {
        enforcePostLatchVisibleState();
        publishGlobals();
        render();
      }
    }, 1000);
  }

  function startEnforcement() {
    if (enforcementTimer) root.clearInterval(enforcementTimer);

    enforcementTimer = root.setInterval(() => {
      if (!state.completionLatched) return;

      const led = ledgerState();
      const regressed = led.currentFibonacciStage !== "F21" || state.currentFibonacciStage !== "F21";

      if (regressed) {
        archiveLateEvent({
          id: "POST_LATCH_STAGE_REGRESSION_REPAIRED",
          stage: led.currentFibonacciStage || state.currentFibonacciStage,
          owner: "hearth.js",
          lane: "completionLatch",
          status: STATUS.ARCHIVED,
          message: "Visible state was forced back to F21 after post-latch regression."
        }, "post-latch-enforcement");
      }

      enforcePostLatchVisibleState();
      render();
    }, 450);
  }

  async function copyText(text) {
    try {
      if (root.navigator && root.navigator.clipboard && isFunction(root.navigator.clipboard.writeText)) {
        await root.navigator.clipboard.writeText(text);
      } else if (doc) {
        const textarea = doc.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "readonly");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        doc.body.appendChild(textarea);
        textarea.select();
        doc.execCommand("copy");
        textarea.remove();
      }

      return true;
    } catch (_error) {
      return false;
    }
  }

  async function copyDiagnostic() {
    const ok = await copyText(getReceiptText());

    if (refs.copyButton) {
      const original = refs.copyButton.textContent;
      refs.copyButton.textContent = ok ? "Copied" : "Copy failed";
      root.setTimeout(() => {
        refs.copyButton.textContent = original || "Copy diagnostic";
      }, 1200);
    }

    emit("DIAGNOSTIC_RECEIPT_COPIED", {
      ok,
      finalReceiptAvailable: state.finalReceiptAvailable,
      completionLatched: state.completionLatched
    }, {
      visible: false,
      stage: state.currentFibonacciStage,
      lane: "copy"
    });

    return ok;
  }

  function getReceipt() {
    const led = ledgerState();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      route: ROUTE,

      activeRouteConductor: ACTIVE_ROUTE_FILE,
      retiredClimateRoute: RETIRED_CLIMATE_ROUTE,
      retiredClimateRouteActiveCarrier: false,

      hydratedExistingCockpit: state.hydratedExistingCockpit,
      duplicateCockpitCreated: false,
      fallbackCockpitCreated: state.fallbackCockpitCreated,
      loadLedgerPresent: state.loadLedgerPresent,
      monotonicStageGuardActive: state.monotonicStageGuardActive,
      stageRegressionPrevented: state.stageRegressionPrevented,
      archivedLateEvents: clonePlain(state.archivedLateEvents),

      fibonacciStage: state.fibonacciStage,
      currentFibonacciStage: state.currentFibonacciStage,
      highestStageReached: state.highestStageReached,
      highestStageRank: state.highestStageRank,

      completionLatched: state.completionLatched,
      visibleLoadingActive: state.visibleLoadingActive,
      diagnosticCockpitReady: state.diagnosticCockpitReady,
      cockpitMode: state.cockpitMode,
      dockVisible: state.dockVisible,
      fullCockpitExpanded: state.fullCockpitExpanded,
      planetObstructionReduced: state.planetObstructionReduced,

      runtimeTablePresent: state.runtimeTablePresent,
      runtimeTableMode: state.runtimeTableMode,
      runtimeTablePlanAttempted: state.runtimeTablePlanAttempted,
      runtimeTablePlanCreated: state.runtimeTablePlanCreated,
      runtimeTablePlanError: state.runtimeTablePlanError,

      sourceAuthorityHeld: true,

      canvasApiPresent: state.canvasApiPresent,
      cooperativeBootAvailable: state.cooperativeBootAvailable,
      cooperativeBootUsed: state.cooperativeBootUsed,
      syncBootFallbackUsed: state.syncBootFallbackUsed,

      canvasCarrierRequested: state.canvasCarrierRequested,
      canvasCarrierMounted: state.canvasCarrierMounted,
      canvasCarrierHandoffOk: state.canvasCarrierHandoffOk,
      canvasCarrierHandoffError: state.canvasCarrierHandoffError,
      canvasCarrierMethod: state.canvasCarrierMethod,

      canvasBootStartedAt: state.canvasBootStartedAt,
      canvasBootCompletedAt: state.canvasBootCompletedAt,
      canvasBootElapsedMs: state.canvasBootElapsedMs,
      canvasYieldCount: state.canvasYieldCount,
      canvasPhaseCount: state.canvasPhaseCount,
      lastCanvasPhase: state.lastCanvasPhase,
      lastCanvasProgress: state.lastCanvasProgress,
      loaderRepaintDuringCanvasBoot: state.loaderRepaintDuringCanvasBoot,
      f13ProgressStreamActive: state.f13ProgressStreamActive,

      atlasBuildStarted: state.atlasBuildStarted,
      atlasBuildProgress: state.atlasBuildProgress,
      atlasBuildComplete: state.atlasBuildComplete,
      textureComposeStarted: state.textureComposeStarted,
      textureComposeProgress: state.textureComposeProgress,
      textureComposeComplete: state.textureComposeComplete,

      firstFrameRequested: state.firstFrameRequested,
      firstFrameDetected: state.firstFrameDetected,
      imageRendered: state.imageRendered,
      dragInspectionBound: state.dragInspectionBound,
      canvasReady: state.canvasReady,

      partialReceiptAvailable: state.partialReceiptAvailable,
      copyDiagnosticArmed: state.copyDiagnosticArmed,
      finalReceiptAvailable: state.finalReceiptAvailable,
      buttonsReachable: state.buttonsReachable,
      receiptOverlayIndependent: true,

      latestVisibleEvent: state.completionLatched ? "COMPLETION_LATCHED" : state.latestVisibleEvent,
      postgameStatus: state.postgameStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      mainProgressCap: state.mainProgressCap,
      mainDisplayProgress: Math.round(state.mainDisplayProgress),
      heartbeatElapsedMs: state.heartbeatElapsedMs,

      phaseEvents: clonePlain(state.phaseEvents),
      ledger: clonePlain(led),
      events: clonePlain(state.events),
      errors: clonePlain(state.errors),

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      updatedAt: nowIso()
    };
  }

  function getReceiptText() {
    const receipt = getReceipt();

    const lanes = Object.entries((receipt.ledger && receipt.ledger.lanes) || {}).map(([key, lane]) => (
      `- ${key}: status=${lane.status}; fibonacci=${lane.fibonacci}; progress=${lane.progress}; event=${lane.latestEvent}; message=${lane.message}`
    )).join("\n") || "- none";

    const scripts = Object.entries((receipt.ledger && receipt.ledger.scripts) || {}).map(([key, script]) => (
      `- ${key}: status=${script.status}; src=${script.src || ""}; error=${script.error || ""}`
    )).join("\n") || "- none";

    const phases = receipt.phaseEvents.map((event) => (
      `- ${event.at || ""} :: ${event.phase || ""} :: progress=${event.percent || ""} :: ${event.message || ""}`
    )).join("\n") || "- none";

    const archived = receipt.archivedLateEvents.map((event) => (
      `- ${event.archivedAt || ""} :: ${event.id || event.event || "ARCHIVED"} :: stage=${event.stage || ""} :: reason=${event.archiveReason || ""} :: ${event.message || ""}`
    )).join("\n") || "- none";

    const localEvents = receipt.events.map((entry) => (
      `- ${entry.at} :: ${entry.event}`
    )).join("\n") || "- none";

    const errors = receipt.errors.map((entry) => (
      `- ${entry.at} :: ${entry.code} :: ${entry.message}`
    )).join("\n") || "- none";

    return [
      "HEARTH_ROUTE_CONDUCTOR_COOPERATIVE_CANVAS_HANDOFF_RECEIPT",
      "",
      `contract=${receipt.contract}`,
      `receipt=${receipt.receipt}`,
      `previousContract=${receipt.previousContract}`,
      `baselineContract=${receipt.baselineContract}`,
      `version=${receipt.version}`,
      `route=${receipt.route}`,
      "",
      `activeRouteConductor=${receipt.activeRouteConductor}`,
      `retiredClimateRoute=${receipt.retiredClimateRoute}`,
      `retiredClimateRouteActiveCarrier=${receipt.retiredClimateRouteActiveCarrier}`,
      "",
      `hydratedExistingCockpit=${receipt.hydratedExistingCockpit}`,
      `duplicateCockpitCreated=${receipt.duplicateCockpitCreated}`,
      `fallbackCockpitCreated=${receipt.fallbackCockpitCreated}`,
      `loadLedgerPresent=${receipt.loadLedgerPresent}`,
      `monotonicStageGuardActive=${receipt.monotonicStageGuardActive}`,
      `stageRegressionPrevented=${receipt.stageRegressionPrevented}`,
      "",
      `fibonacciStage=${receipt.fibonacciStage}`,
      `currentFibonacciStage=${receipt.currentFibonacciStage}`,
      `highestStageReached=${receipt.highestStageReached}`,
      `highestStageRank=${receipt.highestStageRank}`,
      "",
      `completionLatched=${receipt.completionLatched}`,
      `visibleLoadingActive=${receipt.visibleLoadingActive}`,
      `diagnosticCockpitReady=${receipt.diagnosticCockpitReady}`,
      `cockpitMode=${receipt.cockpitMode}`,
      `dockVisible=${receipt.dockVisible}`,
      `fullCockpitExpanded=${receipt.fullCockpitExpanded}`,
      `planetObstructionReduced=${receipt.planetObstructionReduced}`,
      "",
      `runtimeTablePresent=${receipt.runtimeTablePresent}`,
      `runtimeTableMode=${receipt.runtimeTableMode}`,
      `runtimeTablePlanAttempted=${receipt.runtimeTablePlanAttempted}`,
      `runtimeTablePlanCreated=${receipt.runtimeTablePlanCreated}`,
      `runtimeTablePlanError=${receipt.runtimeTablePlanError}`,
      "",
      `sourceAuthorityHeld=${receipt.sourceAuthorityHeld}`,
      "",
      `canvasApiPresent=${receipt.canvasApiPresent}`,
      `cooperativeBootAvailable=${receipt.cooperativeBootAvailable}`,
      `cooperativeBootUsed=${receipt.cooperativeBootUsed}`,
      `syncBootFallbackUsed=${receipt.syncBootFallbackUsed}`,
      `canvasCarrierRequested=${receipt.canvasCarrierRequested}`,
      `canvasCarrierMounted=${receipt.canvasCarrierMounted}`,
      `canvasCarrierHandoffOk=${receipt.canvasCarrierHandoffOk}`,
      `canvasCarrierHandoffError=${receipt.canvasCarrierHandoffError}`,
      `canvasCarrierMethod=${receipt.canvasCarrierMethod}`,
      "",
      `canvasBootStartedAt=${receipt.canvasBootStartedAt}`,
      `canvasBootCompletedAt=${receipt.canvasBootCompletedAt}`,
      `canvasBootElapsedMs=${receipt.canvasBootElapsedMs}`,
      `canvasYieldCount=${receipt.canvasYieldCount}`,
      `canvasPhaseCount=${receipt.canvasPhaseCount}`,
      `lastCanvasPhase=${receipt.lastCanvasPhase}`,
      `lastCanvasProgress=${receipt.lastCanvasProgress}`,
      `loaderRepaintDuringCanvasBoot=${receipt.loaderRepaintDuringCanvasBoot}`,
      `f13ProgressStreamActive=${receipt.f13ProgressStreamActive}`,
      "",
      `atlasBuildStarted=${receipt.atlasBuildStarted}`,
      `atlasBuildProgress=${receipt.atlasBuildProgress}`,
      `atlasBuildComplete=${receipt.atlasBuildComplete}`,
      `textureComposeStarted=${receipt.textureComposeStarted}`,
      `textureComposeProgress=${receipt.textureComposeProgress}`,
      `textureComposeComplete=${receipt.textureComposeComplete}`,
      "",
      `firstFrameRequested=${receipt.firstFrameRequested}`,
      `firstFrameDetected=${receipt.firstFrameDetected}`,
      `imageRendered=${receipt.imageRendered}`,
      `dragInspectionBound=${receipt.dragInspectionBound}`,
      `canvasReady=${receipt.canvasReady}`,
      "",
      `partialReceiptAvailable=${receipt.partialReceiptAvailable}`,
      `copyDiagnosticArmed=${receipt.copyDiagnosticArmed}`,
      `finalReceiptAvailable=${receipt.finalReceiptAvailable}`,
      `buttonsReachable=${receipt.buttonsReachable}`,
      `receiptOverlayIndependent=${receipt.receiptOverlayIndependent}`,
      "",
      `latestVisibleEvent=${receipt.latestVisibleEvent}`,
      `postgameStatus=${receipt.postgameStatus}`,
      `firstFailedCoordinate=${receipt.firstFailedCoordinate}`,
      `recommendedNextRenewalTarget=${receipt.recommendedNextRenewalTarget}`,
      "",
      `mainProgressCap=${receipt.mainProgressCap}`,
      `mainDisplayProgress=${receipt.mainDisplayProgress}`,
      `heartbeatElapsedMs=${receipt.heartbeatElapsedMs}`,
      "",
      "LEDGER_LANES",
      lanes,
      "",
      "LEDGER_SCRIPTS",
      scripts,
      "",
      "CANVAS_PHASE_EVENTS",
      phases,
      "",
      "ARCHIVED_LATE_EVENTS",
      archived,
      "",
      "LOCAL_EVENTS",
      localEvents,
      "",
      "ERRORS",
      errors,
      "",
      "SOURCE_STACK_HELD",
      "- /assets/hearth/hearth.tectonics.js",
      "- /assets/hearth/hearth.elevation.js",
      "- /assets/hearth/hearth.composition.js",
      "- /assets/hearth/hearth.hydrology.js",
      "- /assets/hearth/hearth.materials.js",
      "- /assets/hearth/hearth.hex.four-pair.authority.js",
      "- /assets/hearth/hearth.hex.surface.js",
      "- /assets/lab/runtime-table.js",
      "",
      `generatedImage=${receipt.generatedImage}`,
      `graphicBox=${receipt.graphicBox}`,
      `webGL=${receipt.webGL}`,
      `visualPassClaimed=${receipt.visualPassClaimed}`,
      "",
      `updatedAt=${receipt.updatedAt}`
    ].join("\n");
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.HEARTH.routeConductor = api;

    root.HEARTH_ROUTE_CONDUCTOR = api;
    root.HearthRouteConductor = api;
    root.HEARTH_ROUTE_CONDUCTOR_CONTRACT = CONTRACT;
    root.HEARTH_ROUTE_CONDUCTOR_RECEIPT = getReceipt();
    root.HEARTH_ROUTE_CONDUCTOR_POSTGAME_RECEIPT = root.HEARTH_ROUTE_CONDUCTOR_RECEIPT;

    root.__HEARTH_ACTIVE_ROUTE_FILE__ = ACTIVE_ROUTE_FILE;
    root.__HEARTH_ACTIVE_ROUTE_CONDUCTOR__ = ACTIVE_ROUTE_FILE;
    root.__HEARTH_ACTIVE_ROUTE_CONTRACT__ = CONTRACT;
    root.__HEARTH_RETIRED_CLIMATE_ROUTE__ = RETIRED_CLIMATE_ROUTE;
    root.__HEARTH_RETIRED_CLIMATE_ROUTE_ACTIVE_CARRIER__ = false;

    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthConductorLoaded = "true";
    dataset.hearthRouteConductorLoaded = "true";
    dataset.hearthJsConductorLoaded = "true";
    dataset.hearthConductorContract = CONTRACT;
    dataset.hearthConductorReceipt = RECEIPT;
    dataset.hearthConductorPreviousContract = PREVIOUS_CONTRACT;
    dataset.hearthConductorBaselineContract = BASELINE_CONTRACT;
    dataset.hearthConductorVersion = VERSION;

    dataset.hearthActiveRouteFile = ACTIVE_ROUTE_FILE;
    dataset.hearthActiveRouteConductor = ACTIVE_ROUTE_FILE;
    dataset.hearthActiveRouteContract = CONTRACT;
    dataset.hearthRetiredClimateRoute = RETIRED_CLIMATE_ROUTE;
    dataset.hearthRetiredClimateRouteActiveCarrier = "false";

    dataset.hearthLoadLedgerPresent = String(state.loadLedgerPresent);
    dataset.hearthHydratedExistingCockpit = String(state.hydratedExistingCockpit);
    dataset.hearthDuplicateCockpitCreated = "false";
    dataset.hearthMonotonicStageGuardActive = String(state.monotonicStageGuardActive);
    dataset.hearthStageRegressionPrevented = String(state.stageRegressionPrevented);

    dataset.hearthFibonacciStage = state.fibonacciStage;
    dataset.hearthCurrentFibonacciStage = state.currentFibonacciStage;
    dataset.hearthHighestStageReached = state.highestStageReached;
    dataset.hearthCompletionLatched = String(state.completionLatched);
    dataset.hearthVisibleLoadingActive = String(state.visibleLoadingActive);
    dataset.hearthDiagnosticCockpitReady = String(state.diagnosticCockpitReady);
    dataset.hearthCockpitMode = state.cockpitMode;
    dataset.hearthDockVisible = String(state.dockVisible);
    dataset.hearthFullCockpitExpanded = String(state.fullCockpitExpanded);
    dataset.hearthPlanetObstructionReduced = String(state.planetObstructionReduced);

    dataset.hearthRuntimeTablePresent = String(state.runtimeTablePresent);
    dataset.hearthRuntimeTableMode = state.runtimeTableMode;
    dataset.hearthSourceAuthorityHeld = "true";

    dataset.hearthCanvasApiPresent = String(state.canvasApiPresent);
    dataset.hearthCanvasCooperativeBootAvailable = String(state.cooperativeBootAvailable);
    dataset.hearthCanvasCooperativeBootUsed = String(state.cooperativeBootUsed);
    dataset.hearthCanvasSyncBootFallbackUsed = String(state.syncBootFallbackUsed);
    dataset.hearthCanvasCarrierRequested = String(state.canvasCarrierRequested);
    dataset.hearthCanvasCarrierMounted = String(state.canvasCarrierMounted);
    dataset.hearthCanvasCarrierHandoffOk = String(state.canvasCarrierHandoffOk);
    dataset.hearthCanvasCarrierMethod = state.canvasCarrierMethod;

    dataset.hearthCanvasBootStartedAt = state.canvasBootStartedAt;
    dataset.hearthCanvasBootCompletedAt = state.canvasBootCompletedAt;
    dataset.hearthCanvasBootElapsedMs = String(state.canvasBootElapsedMs);
    dataset.hearthCanvasYieldCount = String(state.canvasYieldCount);
    dataset.hearthCanvasPhaseCount = String(state.canvasPhaseCount);
    dataset.hearthCanvasLastPhase = state.lastCanvasPhase;
    dataset.hearthCanvasLastProgress = String(state.lastCanvasProgress);
    dataset.hearthLoaderRepaintDuringCanvasBoot = String(state.loaderRepaintDuringCanvasBoot);
    dataset.hearthF13ProgressStreamActive = String(state.f13ProgressStreamActive);

    dataset.hearthAtlasBuildStarted = String(state.atlasBuildStarted);
    dataset.hearthAtlasBuildProgress = String(state.atlasBuildProgress);
    dataset.hearthAtlasBuildComplete = String(state.atlasBuildComplete);
    dataset.hearthTextureComposeStarted = String(state.textureComposeStarted);
    dataset.hearthTextureComposeProgress = String(state.textureComposeProgress);
    dataset.hearthTextureComposeComplete = String(state.textureComposeComplete);

    dataset.hearthFirstFrameRequested = String(state.firstFrameRequested);
    dataset.hearthFirstFrameDetected = String(state.firstFrameDetected);
    dataset.hearthImageRendered = String(state.imageRendered);
    dataset.hearthDragInspectionBound = String(state.dragInspectionBound);
    dataset.hearthCanvasReady = String(state.canvasReady);

    dataset.hearthPartialReceiptAvailable = String(state.partialReceiptAvailable);
    dataset.hearthCopyDiagnosticArmed = String(state.copyDiagnosticArmed);
    dataset.hearthFinalReceiptAvailable = String(state.finalReceiptAvailable);
    dataset.hearthButtonsReachable = String(state.buttonsReachable);
    dataset.hearthReceiptOverlayIndependent = "true";

    dataset.hearthLatestVisibleEvent = state.completionLatched ? "COMPLETION_LATCHED" : state.latestVisibleEvent;
    dataset.hearthPostgameStatus = state.postgameStatus;
    dataset.hearthFirstFailedCoordinate = state.firstFailedCoordinate;
    dataset.hearthRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  function boot() {
    state.startedAt = nowIso();
    state.startedAtMs = nowMs();

    ensureMount();
    ensureLedger();
    guardRetiredClimateRoute();
    hydrateCockpit();
    neutralizeOldLoaders();

    setLedgerLane("ledger", {
      status: STATUS.READY,
      progress: stageProgress("F1B"),
      event: "MONOTONIC_LEDGER_GUARD_ACTIVE",
      stage: "F1B",
      owner: "hearth.js",
      file: ACTIVE_ROUTE_FILE,
      message: "Monotonic stage guard active."
    });

    setLedgerLane("authorityAvailability", {
      status: STATUS.HELD,
      progress: stageProgress("F5"),
      event: "SOURCE_STACK_HELD",
      stage: "F5",
      owner: "hearth.js",
      file: ACTIVE_ROUTE_FILE,
      message: "Source authority stack held during cooperative canvas handoff."
    });

    startHeartbeat();
    startEnforcement();
    checkRuntimeTable();
    callCanvasCarrier();

    reconcileTimer = root.setInterval(() => {
      if (!state.completionLatched) {
        reconcileAll("interval");
      } else {
        enforcePostLatchVisibleState();
        publishGlobals();
      }
    }, 900);

    [120, 360, 900, 1600, 2600, 4200, 7000, 12000].forEach((ms) => {
      root.setTimeout(() => {
        if (!state.completionLatched) reconcileAll(`post-boot-${ms}ms`);
      }, ms);
    });

    render();
  }

  function dispose(reason = "manual-dispose") {
    if (heartbeatTimer) {
      root.clearInterval(heartbeatTimer);
      heartbeatTimer = 0;
    }

    if (enforcementTimer) {
      root.clearInterval(enforcementTimer);
      enforcementTimer = 0;
    }

    if (reconcileTimer) {
      root.clearInterval(reconcileTimer);
      reconcileTimer = 0;
    }

    if (raf) {
      root.cancelAnimationFrame(raf);
      raf = 0;
    }

    emit("CONDUCTOR_DISPOSED", { reason }, {
      visible: false,
      lane: "conductorHydration"
    });
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    route: ROUTE,
    destinationFile: ACTIVE_ROUTE_FILE,

    boot,
    reconcile: reconcileAll,
    tryLatchCompletion,
    setCockpitMode,
    enforcePostLatchVisibleState,
    handleCanvasPhase,
    handleCanvasReceipt,
    getReceipt,
    getReceiptText,
    copyDiagnostic,
    dispose,

    supportsDistributedLoadLedger: true,
    supportsHtmlCockpitHydration: true,
    supportsFibonacciLoadStages: true,
    supportsMonotonicStageGuard: true,
    supportsStrictCompletionLatch: true,
    supportsDiagnosticDockAfterLatch: true,
    supportsPartialReceiptDuringLoading: true,
    supportsCopyDiagnosticDuringLoading: true,
    supportsRuntimeTableOptionalMode: true,
    supportsVisibleCarrierFirst: true,
    supportsCooperativeCanvasHandoff: true,
    supportsF13ProgressStream: true,

    ownsPlanetDrawing: false,
    ownsTectonicCause: false,
    ownsElevationGeneration: false,
    ownsCompositionClassification: false,
    ownsHydrologyTruth: false,
    ownsMaterialPalette: false,
    ownsCanvasPixelRendering: false,
    ownsRuntimeMotion: false,
    ownsFinalVisualPassClaim: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  };

  publishGlobals();

  if (doc && doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

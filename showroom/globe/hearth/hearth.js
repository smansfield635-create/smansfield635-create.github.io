// /showroom/globe/hearth/hearth.js
// HEARTH_LOAD_LEDGER_MONOTONIC_CONDUCTOR_DOCK_LATCH_TNT_v1
// Full-file replacement.
// Active Hearth route conductor only.
// Purpose:
// - Hydrate the existing HTML first-paint cockpit.
// - Enforce monotonic Fibonacci stage progression.
// - Prevent late HTML/script events from visually regressing F21 back to F2/F3.
// - Require first-frame/render proof before completion latch.
// - Convert the blocking cockpit into a compact diagnostic dock after planet visibility.
// - Preserve copyable diagnostics, canvas inspection, and receipt independence.
// Does not own:
// - HTML first paint
// - planet pixel drawing
// - tectonic cause
// - elevation generation
// - composition classification
// - hydrology truth
// - material palette
// - Runtime Table source code
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_LOAD_LEDGER_MONOTONIC_CONDUCTOR_DOCK_LATCH_TNT_v1";
  const RECEIPT = "HEARTH_LOAD_LEDGER_MONOTONIC_CONDUCTOR_DOCK_LATCH_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_DISTRIBUTED_LOAD_LEDGER_CONDUCTOR_HYDRATION_LATCH_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_LOAD_LEDGER_MONOTONIC_STAGE_AND_DIAGNOSTIC_DOCK_PAIR_PRECODE_FINAL_DRAFT_v1";
  const VERSION = "2026-05-29.hearth-load-ledger-monotonic-conductor-dock-latch-v1";

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
    F13: { id: "F13", rank: 7, value: 13, label: "Canvas and diagnostic", progress: 92 },
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
    canvasCarrierRequested: false,
    canvasCarrierMounted: false,
    canvasCarrierHandoffOk: false,
    canvasCarrierHandoffError: "",
    canvasCarrierMethod: "",
    firstFrameDetected: false,
    dragInspectionBound: false,
    imageRendered: false,
    canvasBootStartedAt: 0,
    canvasBootElapsedMs: 0,
    longWaitMessage: "",

    partialReceiptAvailable: false,
    copyDiagnosticArmed: false,
    finalReceiptAvailable: false,
    buttonsReachable: false,
    receiptOverlayIndependent: true,

    postgameStatus: "CONDUCTOR_HYDRATING",
    firstFailedCoordinate: "F8_CONDUCTOR_HYDRATION",
    recommendedNextRenewalTarget: "execute-index-html-monotonic-dock-binding-last",

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    startedAt: "",
    startedAtMs: 0,
    updatedAt: "",
    heartbeatElapsedMs: 0,
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

    if (state.archivedLateEvents.length > 80) {
      state.archivedLateEvents.splice(0, state.archivedLateEvents.length - 80);
    }

    const led = ledgerState();
    if (Array.isArray(led.archivedLateEvents)) {
      led.archivedLateEvents.push(archived);
      if (led.archivedLateEvents.length > 120) {
        led.archivedLateEvents.splice(0, led.archivedLateEvents.length - 120);
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

    const originalPush = isFunction(ledger.push) ? ledger.push.bind(ledger) : null;
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
        detail: clonePlain(event.detail || {})
      };

      const eventRank = stageRank(evt.stage);
      const currentRank = Number(ledger.state.highestStageRank || stageRank(ledger.state.currentFibonacciStage));

      if (
        ledger.state.completionLatched &&
        eventRank > 0 &&
        eventRank < stageRank("F21") &&
        evt.lane !== "receipt" &&
        evt.lane !== "copy"
      ) {
        archiveLateEvent(evt, "post-latch-lower-stage-event");
      }

      ledger.state.events.push(evt);
      ledger.state.updatedAt = evt.timestamp;

      if (eventRank > currentRank && !ledger.state.completionLatched) {
        ledger.setStage(evt.stage, evt.message || evt.id, { fromPush: true });
      }

      if (ledger.state.events.length > 220) {
        ledger.state.events.splice(0, ledger.state.events.length - 220);
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
      const nextEvent = {
        id: next.event || next.latestEvent || `LANE_${String(laneKey).toUpperCase()}_${nextStatus}`,
        stage: nextStage,
        owner: next.owner || "ledger",
        file: next.file || "",
        lane: laneKey,
        status: nextStatus,
        message: next.message || lane.message || laneDef.label,
        detail: next.detail || {}
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
        nextStatus !== STATUS.FAILED
      ) {
        return archiveLateEvent(nextEvent, "lane-status-regression-blocked");
      }

      lane.status = nextStatus;
      lane.message = next.message || lane.message;
      lane.progress = Number.isFinite(Number(next.progress)) ? clamp(Number(next.progress), 0, 100) : lane.progress;
      lane.progress = Math.max(Number(lane.progress || 0), Number(next.progress || 0));
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

    if (state.events.length > 140) {
      state.events.splice(0, state.events.length - 140);
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
      detail
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

    if (state.errors.length > 50) {
      state.errors.splice(0, state.errors.length - 50);
    }

    const led = ledgerState();
    if (Array.isArray(led.errors)) {
      led.errors.push(item);
      if (led.errors.length > 80) {
        led.errors.splice(0, led.errors.length - 80);
      }
    }

    emit("ERROR", item, { visible: false, lane: "errors", status: STATUS.FAILED });
    return item;
  }

  function ensureStyle() {
    if (!doc || doc.getElementById("hearth-monotonic-dock-style")) return;

    const style = doc.createElement("style");
    style.id = "hearth-monotonic-dock-style";
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
        <div class="hearth-ledger-kicker">Hearth · Monotonic Load Ledger</div>
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

    setLedgerStage("F8", "Conductor hydration active", {
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
            monotonicStageGuard: true
          }
        }, {
          profile: "hearth-monotonic-loader-carrier",
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

  function bestCanvasMethod(api) {
    const methods = [
      "boot",
      "mountVisibleCarrier",
      "bootVisibleCarrier",
      "mount",
      "start",
      "init",
      "render",
      "conduct"
    ];

    return methods.find((name) => isFunction(api && api[name])) || "";
  }

  function getCanvasReceipt() {
    const api = getCanvasApi();

    if (api && isFunction(api.getReceipt)) {
      try {
        const receipt = api.getReceipt("hearth-monotonic-conductor-reconcile");
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
      diagnosticDockAfterLatch: true,
      loadLedger: refs.ledger || null,
      callbacks: {
        onMounted: (receipt) => {
          state.canvasCarrierMounted = true;
          state.canvasCarrierHandoffOk = true;
          emit("CANVAS_MOUNT_CONFIRMED", {}, {
            stage: "F13",
            lane: "canvasAndDiagnostic",
            status: STATUS.MOUNTED
          });
          reconcileFromCanvasReceipt(receipt);
        },
        onRendered: (receipt) => {
          state.firstFrameDetected = true;
          state.imageRendered = true;
          emit("FIRST_FRAME_DETECTED", {}, {
            stage: "F13",
            lane: "canvasAndDiagnostic",
            status: STATUS.RENDERED
          });
          reconcileFromCanvasReceipt(receipt);
        },
        onDragBound: (receipt) => {
          state.dragInspectionBound = true;
          emit("DRAG_INSPECTION_READY", {}, {
            stage: "F13",
            lane: "canvasAndDiagnostic",
            status: STATUS.BOUND
          });
          reconcileFromCanvasReceipt(receipt);
        }
      }
    };
  }

  function updateCanvasWaitMessage() {
    if (!state.canvasCarrierRequested || state.canvasCarrierMounted || state.completionLatched) return;

    state.canvasBootElapsedMs = state.canvasBootStartedAt ? nowMs() - state.canvasBootStartedAt : 0;
    const elapsed = formatElapsed(state.canvasBootElapsedMs);

    if (state.canvasBootElapsedMs >= 30000) {
      state.longWaitMessage = `Long canvas boot · planet carrier still active · receipt available · elapsed ${elapsed}`;
    } else if (state.canvasBootElapsedMs >= 12000) {
      state.longWaitMessage = `Extended canvas boot · copy diagnostic available · elapsed ${elapsed}`;
    } else if (state.canvasBootElapsedMs >= 6000) {
      state.longWaitMessage = `Canvas still booting · diagnostic alive · elapsed ${elapsed}`;
    } else if (state.canvasBootElapsedMs >= 2000) {
      state.longWaitMessage = `Canvas carrier booting · elapsed ${elapsed}`;
    } else {
      state.longWaitMessage = `Canvas carrier booting · elapsed ${elapsed}`;
    }

    setLedgerLane("canvasAndDiagnostic", {
      status: STATUS.LOADING,
      progress: Math.max(78, Number(ledgerState().lanes?.canvasAndDiagnostic?.progress || 0)),
      event: "CANVAS_BOOT_WAIT_VISIBLE",
      stage: "F13",
      owner: "hearth.js",
      file: CANVAS_AUTHORITY_FILE,
      message: state.longWaitMessage
    });
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

    const method = bestCanvasMethod(api);

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
    state.canvasBootStartedAt = nowMs();
    state.longWaitMessage = "Canvas carrier booting · elapsed 00:00";

    setLedgerStage("F13", "Canvas carrier booting", {
      owner: "hearth.js",
      file: CANVAS_AUTHORITY_FILE
    });

    setLedgerLane("canvasAndDiagnostic", {
      status: STATUS.LOADING,
      progress: 78,
      event: "CANVAS_CARRIER_BOOTING",
      stage: "F13",
      owner: "hearth.js",
      file: CANVAS_AUTHORITY_FILE,
      message: state.longWaitMessage
    });

    emit("CANVAS_CARRIER_METHOD_SELECTED", { method }, {
      stage: "F13",
      lane: "canvasAndDiagnostic",
      status: STATUS.READY
    });

    render();

    root.setTimeout(() => {
      try {
        const result = api[method](canvasPayload());

        state.canvasCarrierHandoffOk = true;

        emit("CANVAS_CARRIER_CALLED", { method, handoffOk: true }, {
          visible: false,
          stage: "F13",
          lane: "canvasAndDiagnostic",
          status: STATUS.LOADING
        });

        if (result && isObject(result)) {
          reconcileFromCanvasReceipt(result);
        } else {
          reconcileAll("canvas-method-returned");
        }
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
      }
    }, 80);
  }

  function reconcileFromDataset() {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;
    const mount = refs.mount || ensureMount();

    state.canvasApiPresent = Boolean(getCanvasApi());

    state.canvasCarrierMounted = Boolean(
      state.canvasCarrierMounted ||
      bool(dataset.hearthCanvasCarrierMounted) ||
      bool(dataset.hearthVisibleCarrierMounted) ||
      (mount && mount.querySelector("canvas")) ||
      (mount && bool(mount.dataset.hearthCanvasMounted)) ||
      (mount && bool(mount.dataset.hearthVisibleCarrierMounted))
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

  function reconcileFromCanvasReceipt(receipt) {
    const value = receipt && isObject(receipt) ? receipt : getCanvasReceipt();

    if (value && isObject(value)) {
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
    }

    reconcileAll("canvas-receipt-reconciled");
  }

  function reconcileAll(reason = "manual") {
    reconcileFromDataset();

    const canvasReceipt = getCanvasReceipt();

    if (canvasReceipt && isObject(canvasReceipt)) {
      reconcileFromCanvasReceiptLight(canvasReceipt);
    }

    if (state.canvasCarrierMounted) {
      setLedgerLane("canvasAndDiagnostic", {
        status: state.imageRendered ? STATUS.RENDERED : STATUS.MOUNTED,
        progress: state.imageRendered ? 96 : 88,
        event: state.imageRendered ? "FIRST_FRAME_DETECTED" : "CANVAS_MOUNT_CONFIRMED",
        stage: "F13",
        owner: "hearth.js",
        file: CANVAS_AUTHORITY_FILE,
        message: state.imageRendered
          ? "Canvas carrier mounted and first frame/render proof detected."
          : "Canvas carrier mounted; first frame proof pending."
      });
    }

    if (state.canvasCarrierMounted && (state.firstFrameDetected || state.imageRendered)) {
      state.finalReceiptAvailable = true;
      state.postgameStatus = "DIAGNOSTIC_COCKPIT_READY";
      state.firstFailedCoordinate = "NONE_VISIBLE_CARRIER_PRESENT";
      state.recommendedNextRenewalTarget = "read-postgame-canvas-or-triple-g-receipt";

      setLedgerLane("canvasAndDiagnostic", {
        status: STATUS.FINAL_READY,
        progress: 100,
        event: "FINAL_RECEIPT_READY",
        stage: "F13",
        owner: "hearth.js",
        file: ACTIVE_ROUTE_FILE,
        message: "Final conductor receipt available."
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

  function reconcileFromCanvasReceiptLight(value) {
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
      state.postgameStatus === "DIAGNOSTIC_COCKPIT_READY"
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
    state.postgameStatus = "DIAGNOSTIC_COCKPIT_READY";
    state.firstFailedCoordinate = "NONE_VISIBLE_CARRIER_PRESENT";
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
      : Math.max(stageProgress(stage), Number(state.mainProgressCap || 0));

    if (!state.completionLatched) {
      if (Math.abs(progress - state.mainDisplayProgress) > 0.08) {
        state.mainDisplayProgress += (progress - state.mainDisplayProgress) * 0.12;
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
      refs.heartbeat.textContent = state.completionLatched
        ? `heartbeat=quiet · latched=true · elapsed=${formatElapsed(elapsed)}`
        : (state.longWaitMessage || `heartbeat=active · stage=${stage} · elapsed=${formatElapsed(elapsed)}`);
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
      raf = root.requestAnimationFrame(render);
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
      canvasCarrierRequested: state.canvasCarrierRequested,
      canvasCarrierMounted: state.canvasCarrierMounted,
      canvasCarrierHandoffOk: state.canvasCarrierHandoffOk,
      canvasCarrierHandoffError: state.canvasCarrierHandoffError,
      canvasCarrierMethod: state.canvasCarrierMethod,
      firstFrameDetected: state.firstFrameDetected,
      imageRendered: state.imageRendered,
      dragInspectionBound: state.dragInspectionBound,
      canvasBootElapsedMs: state.canvasBootElapsedMs,
      longWaitMessage: state.longWaitMessage,

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
      "HEARTH_LOAD_LEDGER_MONOTONIC_CONDUCTOR_DOCK_LATCH_RECEIPT",
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
      `canvasCarrierRequested=${receipt.canvasCarrierRequested}`,
      `canvasCarrierMounted=${receipt.canvasCarrierMounted}`,
      `canvasCarrierHandoffOk=${receipt.canvasCarrierHandoffOk}`,
      `canvasCarrierHandoffError=${receipt.canvasCarrierHandoffError}`,
      `canvasCarrierMethod=${receipt.canvasCarrierMethod}`,
      `firstFrameDetected=${receipt.firstFrameDetected}`,
      `imageRendered=${receipt.imageRendered}`,
      `dragInspectionBound=${receipt.dragInspectionBound}`,
      `canvasBootElapsedMs=${receipt.canvasBootElapsedMs}`,
      `longWaitMessage=${receipt.longWaitMessage}`,
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
    dataset.hearthCanvasCarrierRequested = String(state.canvasCarrierRequested);
    dataset.hearthCanvasCarrierMounted = String(state.canvasCarrierMounted);
    dataset.hearthCanvasCarrierHandoffOk = String(state.canvasCarrierHandoffOk);
    dataset.hearthCanvasCarrierMethod = state.canvasCarrierMethod;
    dataset.hearthFirstFrameDetected = String(state.firstFrameDetected);
    dataset.hearthImageRendered = String(state.imageRendered);
    dataset.hearthDragInspectionBound = String(state.dragInspectionBound);

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
      message: "Source authority stack held during loader-only renewal."
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

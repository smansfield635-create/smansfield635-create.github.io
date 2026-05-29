// /showroom/globe/hearth/hearth.js
// HEARTH_DISTRIBUTED_LOAD_LEDGER_CONDUCTOR_HYDRATION_LATCH_TNT_v1
// Full-file replacement.
// Active Hearth route conductor only.
// Purpose:
// - Hydrate the HTML first-paint Hearth loading cockpit.
// - Consume / initialize window.HEARTH_LOAD_LEDGER.
// - Coordinate Fibonacci load stages F8, F13, and F21.
// - Call /assets/hearth/hearth.canvas.js without owning drawing.
// - Preserve copyable diagnostics during loading.
// - Latch completion so visible loading does not loop at 100%.
// Does not own:
// - HTML first paint
// - planet drawing
// - tectonic cause
// - elevation generation
// - composition classification
// - hydrology truth
// - material palette
// - canvas pixel rendering
// - runtime motion
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_DISTRIBUTED_LOAD_LEDGER_CONDUCTOR_HYDRATION_LATCH_TNT_v1";
  const RECEIPT = "HEARTH_DISTRIBUTED_LOAD_LEDGER_CONDUCTOR_HYDRATION_LATCH_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_MULTI_BAR_LIVE_LOADING_DIAGNOSTIC_TNT_v2";
  const BASELINE_CONTRACT = "HEARTH_DISTRIBUTED_LOAD_LEDGER_HTML_CONDUCTOR_PAIR_PRECODE_FINAL_DRAFT_v1";
  const VERSION = "2026-05-29.hearth-distributed-load-ledger-conductor-hydration-latch-v1";

  const ROUTE = "/showroom/globe/hearth/";
  const DESTINATION_FILE = "/showroom/globe/hearth/hearth.js";
  const CANVAS_AUTHORITY_FILE = "/assets/hearth/hearth.canvas.js";
  const RUNTIME_TABLE_FILE = "/assets/lab/runtime-table.js";
  const RETIRED_CLIMATE_ROUTE = "/showroom/globe/hearth/hearth.climate.route.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const FIB = Object.freeze({
    F1A: { id: "F1A", value: 1, label: "HTML shell", progress: 6 },
    F1B: { id: "F1B", value: 1, label: "Load ledger", progress: 12 },
    F2: { id: "F2", value: 2, label: "First-paint cockpit", progress: 22 },
    F3: { id: "F3", value: 3, label: "Script order", progress: 36 },
    F5: { id: "F5", value: 5, label: "Authority availability", progress: 55 },
    F8: { id: "F8", value: 8, label: "Conductor hydration", progress: 72 },
    F13: { id: "F13", value: 13, label: "Canvas and diagnostic", progress: 92 },
    F21: { id: "F21", value: 21, label: "Completion latch", progress: 100 }
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
    LATCHED: "LATCHED"
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

    activeRouteConductor: DESTINATION_FILE,
    retiredClimateRoute: RETIRED_CLIMATE_ROUTE,
    retiredClimateRouteActiveCarrier: false,

    loadLedgerPresent: false,
    hydratedExistingCockpit: false,
    duplicateCockpitCreated: false,
    fallbackCockpitCreated: false,

    fibonacciStage: "F8",
    currentFibonacciStage: "F8",
    stageLabel: FIB.F8.label,

    completionLatched: false,
    visibleLoadingActive: true,
    diagnosticCockpitReady: false,
    latestVisibleEvent: "CONDUCTOR_STARTING",

    mainProgressCap: 0,
    mainDisplayProgress: 0,

    runtimeTablePresent: false,
    runtimeTableMode: "RUNTIME_TABLE_PENDING",
    runtimeTablePlanAttempted: false,
    runtimeTablePlanCreated: false,
    runtimeTablePlanError: "",
    runtimeTablePlan: null,
    runtimeTableOptional: true,

    sourceAuthorityHeld: true,

    canvasApiPresent: false,
    canvasScriptRequested: false,
    canvasScriptLoaded: false,
    canvasScriptError: "",
    canvasCarrierRequested: false,
    canvasCarrierMounted: false,
    canvasCarrierHandoffOk: false,
    canvasCarrierHandoffError: "",
    canvasCarrierMethod: "",
    firstFrameDetected: false,
    dragInspectionBound: false,
    imageRendered: false,

    partialReceiptAvailable: false,
    copyDiagnosticArmed: false,
    finalReceiptAvailable: false,
    buttonsReachable: false,
    receiptOverlayIndependent: true,

    postgameStatus: "CONDUCTOR_HYDRATING",
    firstFailedCoordinate: "F8_CONDUCTOR_HYDRATION",
    recommendedNextRenewalTarget: "html-first-paint-loader-bind-last",

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    startedAt: "",
    updatedAt: "",
    heartbeatStartedAt: 0,
    heartbeatElapsedMs: 0,
    quietHeartbeat: false,

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
    mainFill: null,
    mainPercent: null,
    laneList: null,
    receiptBox: null,
    receiptPre: null,
    copyButton: null,
    receiptToggle: null,
    collapseButton: null,
    expandButton: null
  };

  let raf = 0;
  let heartbeatTimer = 0;
  let reconcileTimer = 0;
  let canvasCallAttempted = false;
  let lastRenderedLaneText = "";

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
      if (Array.isArray(value)) return value.slice();
      return { ...value };
    }
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatElapsed(ms) {
    const total = Math.max(0, Math.floor(Number(ms || 0) / 1000));
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function existingLedgerState(ledger) {
    if (!ledger || !isObject(ledger)) return null;
    if (isObject(ledger.state)) return ledger.state;
    return ledger;
  }

  function makeLane(key, label, fib, status = STATUS.REQUESTED, message = "") {
    return {
      key,
      label,
      fibonacci: fib,
      status,
      message: message || label,
      progress: FIB[fib] ? FIB[fib].progress : 0,
      elapsedMs: 0,
      startedAt: nowIso(),
      updatedAt: nowIso(),
      latestEvent: "LANE_INITIALIZED",
      watchdog: ""
    };
  }

  function ensureLedger() {
    const existing = root.HEARTH_LOAD_LEDGER && isObject(root.HEARTH_LOAD_LEDGER)
      ? root.HEARTH_LOAD_LEDGER
      : null;

    const baseState = existingLedgerState(existing) || {};

    const ledger = existing || {};
    const ledgerState = isObject(ledger.state) ? ledger.state : ledger;

    ledgerState.contract = ledgerState.contract || "HEARTH_DISTRIBUTED_LOAD_LEDGER_SHARED_v1";
    ledgerState.route = ledgerState.route || ROUTE;
    ledgerState.startedAt = ledgerState.startedAt || nowIso();
    ledgerState.updatedAt = nowIso();
    ledgerState.currentFibonacciStage = ledgerState.currentFibonacciStage || "F1B";
    ledgerState.completionLatched = bool(ledgerState.completionLatched, false);
    ledgerState.visibleLoadingActive = ledgerState.visibleLoadingActive !== false;
    ledgerState.diagnosticCockpitReady = bool(ledgerState.diagnosticCockpitReady, false);
    ledgerState.partialReceiptAvailable = ledgerState.partialReceiptAvailable !== false;
    ledgerState.finalReceiptAvailable = bool(ledgerState.finalReceiptAvailable, false);
    ledgerState.copyDiagnosticArmed = bool(ledgerState.copyDiagnosticArmed, false);
    ledgerState.visualPassClaimed = false;
    ledgerState.events = Array.isArray(ledgerState.events) ? ledgerState.events : [];
    ledgerState.errors = Array.isArray(ledgerState.errors) ? ledgerState.errors : [];
    ledgerState.scripts = isObject(ledgerState.scripts) ? ledgerState.scripts : {};
    ledgerState.lanes = isObject(ledgerState.lanes) ? ledgerState.lanes : {};

    LANES.forEach((lane) => {
      if (!isObject(ledgerState.lanes[lane.key])) {
        ledgerState.lanes[lane.key] = makeLane(lane.key, lane.label, lane.fib);
      }
    });

    ledger.state = ledgerState;

    ledger.push = ledger.push || function push(event = {}) {
      const evt = {
        id: event.id || event.event || "LEDGER_EVENT",
        stage: event.stage || ledgerState.currentFibonacciStage || "",
        fibonacci: event.fibonacci || (FIB[event.stage] ? FIB[event.stage].value : ""),
        owner: event.owner || "unknown",
        file: event.file || "",
        lane: event.lane || "",
        status: event.status || "",
        message: event.message || "",
        timestamp: nowIso(),
        elapsedMs: root.performance && isFunction(root.performance.now)
          ? Math.round(root.performance.now())
          : 0,
        detail: clonePlain(event.detail || {})
      };

      ledgerState.events.push(evt);
      ledgerState.updatedAt = evt.timestamp;

      if (ledgerState.events.length > 160) {
        ledgerState.events.splice(0, ledgerState.events.length - 160);
      }

      return evt;
    };

    ledger.setLane = ledger.setLane || function setLane(laneKey, next = {}) {
      const laneDef = LANES.find((item) => item.key === laneKey) || { key: laneKey, label: laneKey, fib: "F1B" };
      const lane = ledgerState.lanes[laneKey] || makeLane(laneDef.key, laneDef.label, laneDef.fib);

      lane.status = next.status || lane.status;
      lane.message = next.message || lane.message;
      lane.progress = Number.isFinite(Number(next.progress)) ? clamp(Number(next.progress), 0, 100) : lane.progress;
      lane.latestEvent = next.event || next.latestEvent || lane.latestEvent;
      lane.updatedAt = nowIso();

      if (lane.startedAt) {
        lane.elapsedMs = Math.max(0, new Date(lane.updatedAt).getTime() - new Date(lane.startedAt).getTime());
      }

      ledgerState.lanes[laneKey] = lane;

      ledger.push({
        id: next.event || `LANE_${String(laneKey).toUpperCase()}_${lane.status}`,
        stage: next.stage || lane.fibonacci,
        owner: next.owner || "ledger",
        file: next.file || "",
        lane: laneKey,
        status: lane.status,
        message: lane.message,
        detail: next.detail || {}
      });

      return lane;
    };

    ledger.setStage = ledger.setStage || function setStage(stage, message = "") {
      ledgerState.currentFibonacciStage = stage;
      ledgerState.updatedAt = nowIso();

      return ledger.push({
        id: `STAGE_${stage}`,
        stage,
        owner: "ledger",
        lane: "stage",
        status: STATUS.READY,
        message: message || (FIB[stage] ? FIB[stage].label : stage)
      });
    };

    ledger.latchCompletion = ledger.latchCompletion || function latchCompletion(reason = "completion-latched") {
      ledgerState.completionLatched = true;
      ledgerState.visibleLoadingActive = false;
      ledgerState.diagnosticCockpitReady = true;
      ledgerState.finalReceiptAvailable = true;
      ledgerState.currentFibonacciStage = "F21";
      ledgerState.updatedAt = nowIso();

      ledger.setLane("completionLatch", {
        status: STATUS.LATCHED,
        progress: 100,
        event: "COMPLETION_LATCHED",
        stage: "F21",
        owner: "hearth.js",
        file: DESTINATION_FILE,
        message: reason
      });

      return ledger.push({
        id: "COMPLETION_LATCHED",
        stage: "F21",
        owner: "hearth.js",
        file: DESTINATION_FILE,
        lane: "completionLatch",
        status: STATUS.LATCHED,
        message: reason
      });
    };

    ledger.getReceipt = ledger.getReceipt || function getLedgerReceipt() {
      return clonePlain(ledgerState);
    };

    ledger.getReceiptText = ledger.getReceiptText || function getLedgerReceiptText() {
      const receipt = ledger.getReceipt();
      const lanes = Object.entries(receipt.lanes || {}).map(([key, lane]) => (
        `- ${key}: status=${lane.status}; progress=${lane.progress}; event=${lane.latestEvent}; message=${lane.message}`
      )).join("\n") || "- none";

      const scripts = Object.entries(receipt.scripts || {}).map(([key, script]) => (
        `- ${key}: status=${script.status}; src=${script.src || ""}; error=${script.error || ""}`
      )).join("\n") || "- none";

      const events = (receipt.events || []).map((event) => (
        `- ${event.timestamp} :: ${event.id} :: ${event.status} :: ${event.message}`
      )).join("\n") || "- none";

      return [
        "HEARTH_LOAD_LEDGER_RECEIPT",
        `contract=${receipt.contract}`,
        `route=${receipt.route}`,
        `currentFibonacciStage=${receipt.currentFibonacciStage}`,
        `completionLatched=${receipt.completionLatched}`,
        `visibleLoadingActive=${receipt.visibleLoadingActive}`,
        `diagnosticCockpitReady=${receipt.diagnosticCockpitReady}`,
        `partialReceiptAvailable=${receipt.partialReceiptAvailable}`,
        `finalReceiptAvailable=${receipt.finalReceiptAvailable}`,
        `copyDiagnosticArmed=${receipt.copyDiagnosticArmed}`,
        `visualPassClaimed=${receipt.visualPassClaimed}`,
        "",
        "LANES",
        lanes,
        "",
        "SCRIPTS",
        scripts,
        "",
        "EVENTS",
        events
      ].join("\n");
    };

    ledger.copyDiagnostic = ledger.copyDiagnostic || function copyLedgerDiagnostic() {
      return copyText(ledger.getReceiptText());
    };

    root.HEARTH_LOAD_LEDGER = ledger;
    refs.ledger = ledger;
    state.loadLedgerPresent = true;

    emitLocal("HEARTH_LOAD_LEDGER_ACQUIRED", {
      existed: Boolean(existing),
      currentFibonacciStage: ledgerState.currentFibonacciStage
    });

    return ledger;
  }

  function ledgerState() {
    return refs.ledger && refs.ledger.state ? refs.ledger.state : {};
  }

  function pushLedger(event = {}) {
    const ledger = refs.ledger || ensureLedger();

    if (ledger && isFunction(ledger.push)) {
      return ledger.push(event);
    }

    return null;
  }

  function setLedgerLane(lane, next = {}) {
    const ledger = refs.ledger || ensureLedger();

    if (ledger && isFunction(ledger.setLane)) {
      return ledger.setLane(lane, next);
    }

    return null;
  }

  function setLedgerStage(stage, message = "") {
    const ledger = refs.ledger || ensureLedger();

    if (ledger && isFunction(ledger.setStage)) {
      return ledger.setStage(stage, message);
    }

    return null;
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

    if (state.events.length > 120) {
      state.events.splice(0, state.events.length - 120);
    }

    return entry;
  }

  function emit(event, detail = {}, options = {}) {
    const visible = options.visible !== false && !state.completionLatched;
    const local = emitLocal(event, detail, visible);

    pushLedger({
      id: event,
      stage: options.stage || state.currentFibonacciStage || state.fibonacciStage,
      fibonacci: FIB[options.stage || state.currentFibonacciStage || state.fibonacciStage]
        ? FIB[options.stage || state.currentFibonacciStage || state.fibonacciStage].value
        : "",
      owner: options.owner || "hearth.js",
      file: DESTINATION_FILE,
      lane: options.lane || "",
      status: options.status || "",
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

    if (state.errors.length > 40) {
      state.errors.splice(0, state.errors.length - 40);
    }

    const led = ledgerState();
    if (Array.isArray(led.errors)) {
      led.errors.push(item);
      if (led.errors.length > 60) led.errors.splice(0, led.errors.length - 60);
    }

    emit("ERROR", item, { visible: false, lane: "errors", status: STATUS.FAILED });
    return item;
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
    mount.dataset.hearthConductorHydrationContract = CONTRACT;
    mount.dataset.hearthConductorHydrationReceipt = RECEIPT;
    mount.dataset.hearthReceiptOverlayIndependent = "true";

    mount.style.position = mount.style.position || "relative";
    mount.style.overflow = mount.style.overflow || "hidden";
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

  function ensureFallbackStyle() {
    if (!doc || doc.getElementById("hearth-distributed-conductor-fallback-style")) return;

    const style = doc.createElement("style");
    style.id = "hearth-distributed-conductor-fallback-style";
    style.textContent = `
      .hearth-ledger-cockpit{
        position:absolute;
        inset:auto 10px 10px 10px;
        z-index:28;
        max-height:calc(100% - 20px);
        display:flex;
        flex-direction:column;
        overflow:hidden;
        border:1px solid rgba(231,188,105,.34);
        border-radius:22px;
        color:#eef6ff;
        background:
          radial-gradient(circle at 0% 0%,rgba(231,188,105,.14),transparent 18rem),
          radial-gradient(circle at 100% 14%,rgba(141,216,255,.12),transparent 20rem),
          linear-gradient(180deg,rgba(9,22,41,.97),rgba(2,7,14,.96));
        box-shadow:0 24px 80px rgba(0,0,0,.54),inset 0 1px 0 rgba(255,255,255,.08);
        backdrop-filter:blur(14px);
        font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        pointer-events:auto;
      }

      .hearth-ledger-cockpit[data-collapsed="true"]{
        max-height:58px;
      }

      .hearth-ledger-cockpit[data-collapsed="true"] .hearth-ledger-scroll,
      .hearth-ledger-cockpit[data-collapsed="true"] .hearth-ledger-receipt{
        display:none;
      }

      .hearth-ledger-head{
        display:grid;
        gap:5px;
        padding:12px 14px 10px;
        border-bottom:1px solid rgba(231,188,105,.16);
      }

      .hearth-ledger-kicker{
        color:#e7bc69;
        font-size:.64rem;
        font-weight:950;
        letter-spacing:.16em;
        text-transform:uppercase;
      }

      .hearth-ledger-title{
        margin:0;
        color:rgba(255,244,216,.98);
        font-size:clamp(1rem,3vw,1.42rem);
        line-height:1;
        letter-spacing:-.035em;
        font-weight:950;
      }

      .hearth-ledger-meta,
      .hearth-ledger-latest{
        color:rgba(238,246,255,.70);
        font:760 .68rem/1.34 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
      }

      .hearth-ledger-progress{
        display:grid;
        grid-template-columns:1fr auto;
        gap:10px;
        align-items:center;
        padding:9px 14px;
        border-bottom:1px solid rgba(141,216,255,.10);
      }

      .hearth-ledger-track,
      .hearth-ledger-lane-track{
        position:relative;
        overflow:hidden;
        border:1px solid rgba(141,216,255,.18);
        border-radius:999px;
        background:rgba(1,4,10,.72);
      }

      .hearth-ledger-track{height:12px}
      .hearth-ledger-lane-track{height:7px}

      .hearth-ledger-fill,
      .hearth-ledger-lane-fill{
        position:absolute;
        inset:0 auto 0 0;
        width:0%;
        border-radius:999px;
        background:linear-gradient(90deg,#8dd8ff,#e7bc69,#ffe8a3);
        transition:width .16s ease-out;
      }

      .hearth-ledger-percent{
        min-width:42px;
        color:#ffe8a3;
        text-align:right;
        font:950 .80rem/1 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
      }

      .hearth-ledger-actions{
        display:flex;
        flex-wrap:wrap;
        gap:7px;
        padding:9px 14px;
        border-bottom:1px solid rgba(231,188,105,.14);
        background:linear-gradient(180deg,rgba(7,18,32,.98),rgba(3,9,18,.96));
      }

      .hearth-ledger-button{
        min-height:30px;
        border:1px solid rgba(231,188,105,.25);
        border-radius:999px;
        padding:7px 10px;
        color:rgba(238,246,255,.88);
        background:rgba(255,255,255,.045);
        font:900 .62rem/1 ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        letter-spacing:.08em;
        text-transform:uppercase;
        cursor:pointer;
      }

      .hearth-ledger-button.primary{
        color:#06101e;
        border-color:rgba(231,188,105,.72);
        background:linear-gradient(135deg,#ffe8a3,#e7bc69);
      }

      .hearth-ledger-scroll{
        flex:1 1 auto;
        min-height:0;
        overflow:auto;
      }

      .hearth-ledger-lanes{
        display:grid;
        gap:7px;
        padding:10px 14px;
      }

      .hearth-ledger-lane{
        display:grid;
        gap:6px;
        border:1px solid rgba(255,255,255,.10);
        border-radius:14px;
        padding:9px;
        background:rgba(255,255,255,.035);
      }

      .hearth-ledger-lane[data-status="READY"],
      .hearth-ledger-lane[data-status="HYDRATED"],
      .hearth-ledger-lane[data-status="MOUNTED"],
      .hearth-ledger-lane[data-status="RENDERED"],
      .hearth-ledger-lane[data-status="COPY_ARMED"],
      .hearth-ledger-lane[data-status="FINAL_READY"],
      .hearth-ledger-lane[data-status="LATCHED"]{
        border-color:rgba(139,215,163,.28);
        background:rgba(139,215,163,.06);
      }

      .hearth-ledger-lane[data-status="LOADING"],
      .hearth-ledger-lane[data-status="REQUESTED"],
      .hearth-ledger-lane[data-status="LOADED"]{
        border-color:rgba(141,216,255,.28);
        background:rgba(141,216,255,.06);
      }

      .hearth-ledger-lane[data-status="DEGRADED"],
      .hearth-ledger-lane[data-status="HELD"]{
        border-color:rgba(231,188,105,.30);
        background:rgba(231,188,105,.065);
      }

      .hearth-ledger-lane[data-status="FAILED"]{
        border-color:rgba(255,112,112,.36);
        background:rgba(255,112,112,.07);
      }

      .hearth-ledger-lane-top{
        display:grid;
        grid-template-columns:minmax(0,1fr) auto;
        gap:8px;
        align-items:center;
      }

      .hearth-ledger-lane-title{
        min-width:0;
        display:grid;
        gap:2px;
      }

      .hearth-ledger-lane-title strong{
        color:rgba(255,244,216,.94);
        font-size:.78rem;
        line-height:1.05;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }

      .hearth-ledger-lane-title span{
        color:rgba(238,246,255,.64);
        font:720 .63rem/1.15 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }

      .hearth-ledger-lane-status{
        color:rgba(238,246,255,.72);
        font:900 .60rem/1 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
        letter-spacing:.08em;
      }

      .hearth-ledger-receipt{
        display:none;
        margin:0 14px 14px;
        max-height:230px;
        overflow:auto;
        border:1px solid rgba(141,216,255,.16);
        border-radius:14px;
        background:rgba(1,4,10,.62);
      }

      .hearth-ledger-receipt[data-visible="true"]{display:block}

      .hearth-ledger-receipt pre{
        margin:0;
        padding:11px;
        color:rgba(238,246,255,.66);
        font:700 .61rem/1.42 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
        white-space:pre-wrap;
      }

      @media (max-width:760px){
        .hearth-ledger-cockpit{
          inset:auto 8px 8px 8px;
          border-radius:18px;
          max-height:calc(100% - 16px);
        }

        .hearth-ledger-actions{
          position:sticky;
          top:0;
          z-index:2;
        }

        .hearth-ledger-button{
          flex:1 1 auto;
          min-width:42%;
        }
      }
    `;

    doc.head.appendChild(style);
  }

  function createFallbackCockpit() {
    const mount = ensureMount();
    if (!doc || !mount) return null;

    ensureFallbackStyle();

    const cockpit = doc.createElement("aside");
    cockpit.id = "hearthLoadCockpit";
    cockpit.className = "hearth-ledger-cockpit";
    cockpit.dataset.hearthLoadCockpit = "true";
    cockpit.dataset.hearthFirstPaintCockpit = "fallback-created-by-conductor";
    cockpit.dataset.hearthLedgerOwner = "hearth.js";
    cockpit.dataset.hearthFibonacciStage = "F8";
    cockpit.dataset.hearthHydratedByConductor = "true";

    cockpit.innerHTML = `
      <div class="hearth-ledger-head">
        <div class="hearth-ledger-kicker">Hearth · Distributed Load Ledger</div>
        <h2 class="hearth-ledger-title">FORMING HEARTH RUNTIME TABLE</h2>
        <div class="hearth-ledger-meta" data-hearth-heartbeat-text>heartbeat=starting · stage=F8</div>
        <div class="hearth-ledger-latest" data-hearth-latest-event>latest=CONDUCTOR_STARTING</div>
      </div>

      <div class="hearth-ledger-progress">
        <div class="hearth-ledger-track">
          <span class="hearth-ledger-fill" data-hearth-main-progress-fill></span>
        </div>
        <div class="hearth-ledger-percent" data-hearth-main-progress-percent>0%</div>
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
    state.duplicateCockpitCreated = false;

    emit("FALLBACK_COCKPIT_CREATED_BY_CONDUCTOR", {}, { stage: "F8", lane: "conductorHydration" });

    return cockpit;
  }

  function hydrateCockpit() {
    const existing = findExistingCockpit();
    const cockpit = existing || createFallbackCockpit();

    if (!cockpit) return;

    refs.cockpit = cockpit;
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

    refs.expandButton =
      cockpit.querySelector("[data-hearth-expand-receipt]") ||
      cockpit.querySelector("[data-hearth-ledger-expand]");

    cockpit.dataset.hearthHydratedByConductor = "true";
    cockpit.dataset.hearthConductorContract = CONTRACT;
    cockpit.dataset.hearthConductorReceipt = RECEIPT;
    cockpit.dataset.hearthFibonacciStage = "F8";

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
        emit("RECEIPT_VISIBILITY_TOGGLED", { visible }, { visible: false, lane: "conductorHydration" });
        render();
      };
    }

    if (refs.collapseButton) {
      refs.collapseButton.onclick = () => {
        const collapsed = cockpit.dataset.collapsed !== "true";
        cockpit.dataset.collapsed = String(collapsed);
        refs.collapseButton.textContent = collapsed ? "Open cockpit" : "Collapse cockpit";
        emit("COCKPIT_COLLAPSE_TOGGLED_CANVAS_PRESERVED", { collapsed }, { visible: false, lane: "conductorHydration" });
      };
    }

    if (refs.expandButton) {
      refs.expandButton.onclick = () => {
        if (!refs.receiptBox) return;
        const expanded = refs.receiptBox.dataset.expanded !== "true";
        refs.receiptBox.dataset.expanded = String(expanded);
        emit("RECEIPT_EXPAND_TOGGLED", { expanded }, { visible: false, lane: "conductorHydration" });
      };
    }

    setLedgerStage("F8", "Conductor hydrated existing cockpit");
    setLedgerLane("conductorHydration", {
      status: STATUS.HYDRATED,
      progress: 72,
      event: "CONDUCTOR_HYDRATED_EXISTING_COCKPIT",
      stage: "F8",
      owner: "hearth.js",
      file: DESTINATION_FILE,
      message: state.hydratedExistingCockpit
        ? "Existing HTML cockpit hydrated."
        : "Fallback cockpit created because HTML cockpit was not present."
    });

    setLedgerLane("staticCockpit", {
      status: state.hydratedExistingCockpit ? STATUS.READY : STATUS.DEGRADED,
      progress: FIB.F2.progress,
      event: state.hydratedExistingCockpit ? "HTML_COCKPIT_PRESENT" : "HTML_COCKPIT_MISSING_FALLBACK_USED",
      stage: "F2",
      owner: "hearth.js",
      file: DESTINATION_FILE,
      message: state.hydratedExistingCockpit
        ? "HTML first-paint cockpit was present for hydration."
        : "HTML first-paint cockpit missing; conductor fallback used until index.html is executed."
    });

    setLedgerLane("ledger", {
      status: STATUS.READY,
      progress: FIB.F1B.progress,
      event: "LEDGER_HYDRATED_BY_CONDUCTOR",
      stage: "F1B",
      owner: "hearth.js",
      file: DESTINATION_FILE,
      message: "Shared ledger is present."
    });

    setLedgerLane("authorityAvailability", {
      status: STATUS.HELD,
      progress: FIB.F5.progress,
      event: "SOURCE_STACK_HELD",
      stage: "F5",
      owner: "hearth.js",
      file: DESTINATION_FILE,
      message: "Source stack is held during this pass."
    });

    emit("CONDUCTOR_HYDRATED_EXISTING_COCKPIT", {
      hydratedExistingCockpit: state.hydratedExistingCockpit,
      duplicateCockpitCreated: false,
      fallbackCockpitCreated: state.fallbackCockpitCreated
    }, { stage: "F8", lane: "conductorHydration", status: STATUS.HYDRATED });

    emit("COPY_DIAGNOSTIC_ARMED", {
      copyDiagnosticArmed: state.copyDiagnosticArmed
    }, { stage: "F8", lane: "conductorHydration", status: STATUS.COPY_ARMED });

    render();
  }

  function neutralizeOldLoaders() {
    if (!doc) return;

    const mount = ensureMount();
    let hidden = 0;
    let removed = 0;

    const isCurrentCockpit = (node) => refs.cockpit && node === refs.cockpit;

    if (mount) {
      mount.querySelectorAll("[data-hearth-mount-fallback], .mount-fallback").forEach((node) => {
        node.hidden = true;
        node.style.display = "none";
        node.dataset.hearthOldLoaderNeutralized = "true";
        hidden += 1;
      });

      mount.querySelectorAll(".hearth-v2-overlay, .hearth-loading-overlay, [data-hearth-v2-live-diagnostic='true']").forEach((node) => {
        if (isCurrentCockpit(node) || (refs.cockpit && refs.cockpit.contains(node))) return;
        node.remove();
        removed += 1;
      });
    }

    emit("OLD_LOADER_NEUTRALIZED", {
      hidden,
      removed
    }, { stage: "F8", lane: "conductorHydration", status: STATUS.READY });
  }

  function guardRetiredClimateRoute() {
    root.__HEARTH_ACTIVE_ROUTE_FILE__ = DESTINATION_FILE;
    root.__HEARTH_ACTIVE_ROUTE_CONDUCTOR__ = DESTINATION_FILE;
    root.__HEARTH_ACTIVE_ROUTE_CONTRACT__ = CONTRACT;
    root.__HEARTH_RETIRED_CLIMATE_ROUTE__ = RETIRED_CLIMATE_ROUTE;
    root.__HEARTH_RETIRED_CLIMATE_ROUTE_ACTIVE_CARRIER__ = false;

    if (doc && doc.documentElement) {
      const dataset = doc.documentElement.dataset;
      dataset.hearthActiveRouteFile = DESTINATION_FILE;
      dataset.hearthActiveRouteConductor = DESTINATION_FILE;
      dataset.hearthActiveRouteContract = CONTRACT;
      dataset.hearthRetiredClimateRoute = RETIRED_CLIMATE_ROUTE;
      dataset.hearthRetiredClimateRouteActiveCarrier = "false";
    }

    emit("RETIRED_CLIMATE_ROUTE_GUARDED", {
      retiredClimateRoute: RETIRED_CLIMATE_ROUTE,
      retiredClimateRouteActiveCarrier: false
    }, { stage: "F8", lane: "conductorHydration", status: STATUS.READY });
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
      state.runtimeTablePlanAttempted = false;
      state.runtimeTablePlanCreated = false;

      setLedgerLane("authorityAvailability", {
        status: STATUS.DEGRADED,
        progress: FIB.F5.progress,
        event: "RUNTIME_TABLE_DEGRADED",
        stage: "F5",
        owner: "hearth.js",
        file: DESTINATION_FILE,
        message: "Runtime Table missing; first visible carrier continues."
      });

      emit("RUNTIME_TABLE_OPTIONAL_CONFIRMED", {
        runtimeTablePresent: false,
        runtimeTableMode: state.runtimeTableMode
      }, { stage: "F8", lane: "conductorHydration", status: STATUS.DEGRADED });

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
            fallbackShellAvailable: true,
            visibleCarrierAllowed: true,
            sphereContainment: true,
            outsideSphereTransparent: true,
            noRectangularTextureSpill: true
          }
        }, {
          profile: "hearth-channel-expression",
          planetId: "hearth",
          planetLabel: "Hearth"
        });
      } else if (isFunction(api.createVisualCarrierPlan)) {
        plan = api.createVisualCarrierPlan({
          planetId: "hearth",
          planetLabel: "Hearth",
          route: ROUTE,
          samplePoint: { u: 0.5, v: 0.5, lon: 0, lat: 0, x: 0, y: 0, z: 1 },
          renderMetadata: {
            routeMounted: true,
            canvasMounted: Boolean(refs.mount),
            fallbackShellAvailable: true,
            visibleCarrierAllowed: true,
            sphereContainment: true,
            outsideSphereTransparent: true,
            noRectangularTextureSpill: true
          }
        });
      } else if (isFunction(api.runProceduralPlan)) {
        plan = api.runProceduralPlan({
          planetId: "hearth",
          planetLabel: "Hearth",
          route: ROUTE,
          samplePoint: { u: 0.5, v: 0.5, lon: 0, lat: 0, x: 0, y: 0, z: 1 }
        });
      }

      state.runtimeTablePlan = plan || null;
      state.runtimeTablePlanCreated = Boolean(plan);
      state.runtimeTablePlanError = "";

      setLedgerLane("authorityAvailability", {
        status: STATUS.READY,
        progress: FIB.F5.progress,
        event: "RUNTIME_TABLE_AVAILABLE",
        stage: "F5",
        owner: "hearth.js",
        file: DESTINATION_FILE,
        message: state.runtimeTablePlanCreated
          ? "Runtime Table available and visual carrier plan created."
          : "Runtime Table available; no plan export required."
      });

      emit("RUNTIME_TABLE_OPTIONAL_CONFIRMED", {
        runtimeTablePresent: true,
        runtimeTablePlanCreated: state.runtimeTablePlanCreated
      }, { stage: "F8", lane: "conductorHydration", status: STATUS.READY });

      return plan;
    } catch (error) {
      state.runtimeTableMode = "RUNTIME_TABLE_DEGRADED";
      state.runtimeTablePlanCreated = false;
      state.runtimeTablePlanError = error && error.message ? error.message : String(error);

      recordError("RUNTIME_TABLE_PLAN_ERROR", state.runtimeTablePlanError);

      setLedgerLane("authorityAvailability", {
        status: STATUS.DEGRADED,
        progress: FIB.F5.progress,
        event: "RUNTIME_TABLE_DEGRADED",
        stage: "F5",
        owner: "hearth.js",
        file: DESTINATION_FILE,
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
        const receipt = api.getReceipt("hearth-distributed-conductor-reconcile");
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

  function requestCanvasScriptIfNeeded() {
    if (!doc || state.canvasScriptRequested) return;

    const existing = Array.from(doc.scripts || []).some((script) =>
      script.src && script.src.includes(CANVAS_AUTHORITY_FILE)
    );

    if (existing) {
      state.canvasScriptRequested = true;

      setLedgerLane("canvasAndDiagnostic", {
        status: STATUS.LOADING,
        progress: 35,
        event: "CANVAS_SCRIPT_PRESENT_API_PENDING",
        stage: "F13",
        owner: "hearth.js",
        file: CANVAS_AUTHORITY_FILE,
        message: "Canvas script tag present; waiting for API."
      });

      return;
    }

    state.canvasScriptRequested = true;

    const script = doc.createElement("script");
    script.src = `${CANVAS_AUTHORITY_FILE}?v=${encodeURIComponent(CONTRACT)}`;
    script.defer = true;
    script.dataset.hearthCanvasRequestedByConductor = "true";
    script.dataset.hearthConductorContract = CONTRACT;

    script.onload = () => {
      state.canvasScriptLoaded = true;
      state.canvasScriptError = "";

      emit("CANVAS_SCRIPT_LOADED", { src: script.src }, { stage: "F13", lane: "canvasAndDiagnostic", status: STATUS.LOADED });
      callCanvasCarrier();
    };

    script.onerror = () => {
      state.canvasScriptLoaded = false;
      state.canvasScriptError = "Canvas script failed to load.";
      state.canvasCarrierHandoffError = state.canvasScriptError;
      state.finalReceiptAvailable = true;
      state.postgameStatus = "CANVAS_SCRIPT_LOAD_FAILED";
      state.firstFailedCoordinate = "F13_CANVAS_SCRIPT_LOAD_FAILED";
      state.recommendedNextRenewalTarget = "index-script-order-or-canvas-path";

      recordError("CANVAS_SCRIPT_LOAD_FAILED", state.canvasScriptError, { src: script.src });

      setLedgerLane("canvasAndDiagnostic", {
        status: STATUS.FAILED,
        progress: 100,
        event: "CANVAS_SCRIPT_LOAD_FAILED",
        stage: "F13",
        owner: "hearth.js",
        file: CANVAS_AUTHORITY_FILE,
        message: state.canvasScriptError
      });
    };

    doc.head.appendChild(script);

    setLedgerLane("canvasAndDiagnostic", {
      status: STATUS.REQUESTED,
      progress: 24,
      event: "CANVAS_SCRIPT_REQUESTED",
      stage: "F13",
      owner: "hearth.js",
      file: CANVAS_AUTHORITY_FILE,
      message: "Canvas authority requested by conductor fallback path."
    });
  }

  function canvasPayload() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      route: ROUTE,
      mountId: "hearthCanvasMount",
      activeRouteConductor: DESTINATION_FILE,
      retiredClimateRoute: RETIRED_CLIMATE_ROUTE,
      runtimeTablePlan: state.runtimeTablePlan,
      visibleCarrierFirst: true,
      runtimeTableOptional: true,
      runtimeTableMissingDoesNotBlockCarrier: true,
      wideProbeDeferred: true,
      sourceAuthorityHeld: true,
      singleAnchorIsLocalProofOnly: true,
      distributedLoadLedger: true,
      loadLedger: refs.ledger || null,
      callbacks: {
        onMounted: (receipt) => {
          state.canvasCarrierMounted = true;
          state.canvasCarrierHandoffOk = true;
          state.canvasCarrierHandoffError = "";

          emit("CANVAS_MOUNT_CONFIRMED", {}, { stage: "F13", lane: "canvasAndDiagnostic", status: STATUS.MOUNTED });
          reconcileFromCanvasReceipt(receipt);
        },
        onRendered: (receipt) => {
          state.firstFrameDetected = true;
          state.imageRendered = true;

          emit("FIRST_FRAME_DETECTED", {}, { stage: "F13", lane: "canvasAndDiagnostic", status: STATUS.RENDERED });
          reconcileFromCanvasReceipt(receipt);
        },
        onDragBound: (receipt) => {
          state.dragInspectionBound = true;

          emit("DRAG_INSPECTION_READY", {}, { stage: "F13", lane: "canvasAndDiagnostic", status: STATUS.BOUND });
          reconcileFromCanvasReceipt(receipt);
        }
      }
    };
  }

  function callCanvasCarrier() {
    const canvasApi = getCanvasApi();
    state.canvasApiPresent = Boolean(canvasApi);

    if (!canvasApi) {
      setLedgerStage("F13", "Canvas API pending");
      setLedgerLane("canvasAndDiagnostic", {
        status: STATUS.LOADING,
        progress: 30,
        event: "CANVAS_API_PENDING",
        stage: "F13",
        owner: "hearth.js",
        file: CANVAS_AUTHORITY_FILE,
        message: "Canvas API not yet present."
      });

      requestCanvasScriptIfNeeded();
      render();
      return;
    }

    emit("CANVAS_API_FOUND", {
      canvasApiPresent: true
    }, { stage: "F13", lane: "canvasAndDiagnostic", status: STATUS.READY });

    if (canvasCallAttempted) {
      reconcileAll("canvas-call-already-attempted");
      return;
    }

    const method = bestCanvasMethod(canvasApi);

    if (!method) {
      state.canvasCarrierHandoffError = "Canvas API present but no supported carrier method exists.";
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

      return;
    }

    canvasCallAttempted = true;
    state.canvasCarrierRequested = true;
    state.canvasCarrierMethod = method;
    state.canvasCarrierHandoffError = "";
    state.fibonacciStage = "F13";
    state.currentFibonacciStage = "F13";

    setLedgerStage("F13", "Canvas and diagnostic reconciliation");

    emit("CANVAS_CARRIER_METHOD_SELECTED", {
      method
    }, { stage: "F13", lane: "canvasAndDiagnostic", status: STATUS.READY });

    setLedgerLane("canvasAndDiagnostic", {
      status: STATUS.LOADING,
      progress: 58,
      event: "CANVAS_CARRIER_CALLED",
      stage: "F13",
      owner: "hearth.js",
      file: CANVAS_AUTHORITY_FILE,
      message: `Canvas carrier method called: ${method}`
    });

    try {
      const result = canvasApi[method](canvasPayload());

      state.canvasCarrierHandoffOk = true;

      if (result && isObject(result)) {
        reconcileFromCanvasReceipt(result);
      }

      emit("CANVAS_CARRIER_CALLED", {
        method,
        handoffOk: true
      }, { stage: "F13", lane: "canvasAndDiagnostic", status: STATUS.LOADING });
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
    }

    render();
  }

  function reconcileFromDataset() {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;
    const mount = refs.mount || ensureMount();

    state.canvasApiPresent = Boolean(getCanvasApi());

    state.canvasCarrierMounted = (
      state.canvasCarrierMounted ||
      bool(dataset.hearthCanvasCarrierMounted) ||
      bool(dataset.hearthVisibleCarrierMounted) ||
      Boolean(mount && mount.querySelector("canvas")) ||
      Boolean(mount && bool(mount.dataset.hearthCanvasMounted)) ||
      Boolean(mount && bool(mount.dataset.hearthVisibleCarrierMounted))
    );

    state.firstFrameDetected = (
      state.firstFrameDetected ||
      bool(dataset.hearthFirstFrameDetected) ||
      bool(dataset.hearthImageRendered) ||
      bool(dataset.hearthCanvasImageRendered)
    );

    state.imageRendered = (
      state.imageRendered ||
      state.firstFrameDetected ||
      bool(dataset.hearthImageRendered) ||
      bool(dataset.hearthCanvasImageRendered)
    );

    state.dragInspectionBound = (
      state.dragInspectionBound ||
      bool(dataset.hearthDragInspectionBound) ||
      bool(dataset.hearthControlsBound) ||
      Boolean(mount && bool(mount.dataset.hearthDragInspectionBound)) ||
      Boolean(mount && bool(mount.dataset.hearthControlsBound)) ||
      Boolean(mount && mount.style && mount.style.touchAction === "none")
    );
  }

  function reconcileFromCanvasReceipt(receipt) {
    const value = receipt && isObject(receipt) ? receipt : getCanvasReceipt();

    if (!value || !isObject(value)) {
      reconcileAll("canvas-receipt-empty");
      return;
    }

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

    reconcileAll("canvas-receipt-reconciled");
  }

  function reconcileAll(reason = "manual") {
    reconcileFromDataset();

    const canvasReceipt = getCanvasReceipt();

    if (canvasReceipt && isObject(canvasReceipt)) {
      state.canvasCarrierMounted = Boolean(
        state.canvasCarrierMounted ||
        canvasReceipt.canvasCarrierMounted ||
        canvasReceipt.visibleCarrierMounted ||
        canvasReceipt.mounted ||
        canvasReceipt.canvasMounted
      );

      state.canvasCarrierHandoffOk = Boolean(
        state.canvasCarrierHandoffOk ||
        state.canvasCarrierMounted ||
        canvasReceipt.canvasCarrierHandoffOk ||
        canvasReceipt.handoffOk
      );

      state.firstFrameDetected = Boolean(
        state.firstFrameDetected ||
        canvasReceipt.firstFrameDetected ||
        canvasReceipt.imageRendered ||
        Number(canvasReceipt.frames || 0) > 0
      );

      state.imageRendered = Boolean(
        state.imageRendered ||
        state.firstFrameDetected ||
        canvasReceipt.imageRendered ||
        Number(canvasReceipt.frames || 0) > 0
      );

      state.dragInspectionBound = Boolean(
        state.dragInspectionBound ||
        canvasReceipt.dragInspectionBound ||
        canvasReceipt.pointerControlsBound ||
        canvasReceipt.controlsBound
      );
    }

    if (state.canvasCarrierMounted || state.imageRendered) {
      setLedgerStage("F13", "Canvas and diagnostic reconciled");

      setLedgerLane("canvasAndDiagnostic", {
        status: state.imageRendered ? STATUS.RENDERED : STATUS.MOUNTED,
        progress: state.imageRendered ? 94 : 82,
        event: state.imageRendered ? "FIRST_FRAME_DETECTED" : "CANVAS_MOUNT_CONFIRMED",
        stage: "F13",
        owner: "hearth.js",
        file: CANVAS_AUTHORITY_FILE,
        message: state.imageRendered
          ? "Canvas carrier mounted and first frame/render proof detected."
          : "Canvas carrier mounted; first frame proof pending."
      });

      state.finalReceiptAvailable = true;
      state.postgameStatus = "DIAGNOSTIC_COCKPIT_READY";
      state.firstFailedCoordinate = state.imageRendered ? "NONE_VISIBLE_CARRIER_PRESENT" : "FIRST_FRAME_PENDING";
      state.recommendedNextRenewalTarget = state.imageRendered
        ? "read-postgame-canvas-or-triple-g-receipt"
        : "first-frame-proof-or-canvas-receipt";

      setLedgerLane("canvasAndDiagnostic", {
        status: STATUS.FINAL_READY,
        progress: 100,
        event: "FINAL_RECEIPT_READY",
        stage: "F13",
        owner: "hearth.js",
        file: DESTINATION_FILE,
        message: "Final conductor receipt available."
      });

      if (!state.completionLatched) {
        tryLatchCompletion();
      }
    }

    if (!state.completionLatched && reason !== "heartbeat") {
      emit("RECONCILE", { reason }, { visible: false, stage: state.fibonacciStage, lane: "conductorHydration" });
    }

    publishGlobals();
    render();
  }

  function completionReady() {
    return (
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
    state.stageLabel = FIB.F21.label;
    state.completionLatched = true;
    state.visibleLoadingActive = false;
    state.diagnosticCockpitReady = true;
    state.latestVisibleEvent = "COMPLETION_LATCHED";
    state.mainProgressCap = 100;
    state.postgameStatus = "DIAGNOSTIC_COCKPIT_READY";
    state.firstFailedCoordinate = "NONE_VISIBLE_CARRIER_PRESENT";
    state.recommendedNextRenewalTarget = "read-postgame-canvas-or-triple-g-receipt";

    const led = ledgerState();
    led.copyDiagnosticArmed = true;
    led.partialReceiptAvailable = true;
    led.finalReceiptAvailable = true;

    if (refs.ledger && isFunction(refs.ledger.latchCompletion)) {
      refs.ledger.latchCompletion("Diagnostic cockpit ready; visible loading settled.");
    }

    setLedgerStage("F21", "Completion latched");

    setLedgerLane("completionLatch", {
      status: STATUS.LATCHED,
      progress: 100,
      event: "COMPLETION_LATCHED",
      stage: "F21",
      owner: "hearth.js",
      file: DESTINATION_FILE,
      message: "Loading loop settled. Diagnostic cockpit remains copyable."
    });

    emitLocal("COMPLETION_LATCHED", {
      diagnosticCockpitReady: true,
      visibleLoadingActive: false
    }, true);

    pushLedger({
      id: "LOADING_LOOP_SETTLED",
      stage: "F21",
      owner: "hearth.js",
      file: DESTINATION_FILE,
      lane: "completionLatch",
      status: STATUS.LATCHED,
      message: "Visible loader no longer cycles as unfinished."
    });

    pushLedger({
      id: "NEXT_TARGET_READY",
      stage: "F21",
      owner: "hearth.js",
      file: DESTINATION_FILE,
      lane: "completionLatch",
      status: STATUS.READY,
      message: state.recommendedNextRenewalTarget
    });

    render();
    publishGlobals();

    return true;
  }

  function computeMainProgressCap() {
    const led = ledgerState();
    const stage = state.completionLatched ? "F21" : (led.currentFibonacciStage || state.fibonacciStage || "F8");

    let cap = FIB[stage] ? FIB[stage].progress : FIB.F8.progress;

    if (state.hydratedExistingCockpit || state.fallbackCockpitCreated) cap = Math.max(cap, FIB.F8.progress);
    if (state.canvasCarrierRequested || state.canvasApiPresent) cap = Math.max(cap, 80);
    if (state.canvasCarrierMounted) cap = Math.max(cap, 88);
    if (state.imageRendered) cap = Math.max(cap, 94);
    if (state.finalReceiptAvailable && state.copyDiagnosticArmed) cap = Math.max(cap, 98);
    if (state.completionLatched) cap = 100;

    state.mainProgressCap = clamp(cap, 0, 100);
    return state.mainProgressCap;
  }

  function renderLaneHtml() {
    const led = ledgerState();
    const lanes = led.lanes || {};

    return LANES.map((laneDef) => {
      const lane = lanes[laneDef.key] || makeLane(laneDef.key, laneDef.label, laneDef.fib);
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

    computeMainProgressCap();

    if (Math.abs(state.mainProgressCap - state.mainDisplayProgress) > 0.08) {
      state.mainDisplayProgress += (state.mainProgressCap - state.mainDisplayProgress) * 0.09;
    } else {
      state.mainDisplayProgress = state.mainProgressCap;
    }

    const progress = Math.round(state.mainDisplayProgress);
    const led = ledgerState();
    const stage = state.completionLatched ? "F21" : (led.currentFibonacciStage || state.fibonacciStage || "F8");
    const stageLabel = FIB[stage] ? FIB[stage].label : stage;
    const elapsed = formatElapsed(state.heartbeatElapsedMs);

    refs.cockpit.dataset.hearthFibonacciStage = stage;
    refs.cockpit.dataset.hearthCompletionLatched = String(state.completionLatched);
    refs.cockpit.dataset.hearthDiagnosticCockpitReady = String(state.diagnosticCockpitReady);
    refs.cockpit.dataset.hearthVisibleLoadingActive = String(state.visibleLoadingActive);
    refs.cockpit.dataset.hearthHydratedExistingCockpit = String(state.hydratedExistingCockpit);

    if (refs.stage) {
      refs.stage.textContent = `${stage} · ${stageLabel}`;
    }

    if (refs.heartbeat) {
      refs.heartbeat.textContent = state.completionLatched
        ? `heartbeat=quiet · latched=true · elapsed=${elapsed}`
        : `heartbeat=active · stage=${stage} · elapsed=${elapsed}`;
    }

    if (refs.latest) {
      refs.latest.textContent = `latest=${state.completionLatched ? "COMPLETION_LATCHED" : state.latestVisibleEvent}`;
    }

    if (refs.mainFill) {
      refs.mainFill.style.width = `${progress}%`;
    }

    if (refs.mainPercent) {
      refs.mainPercent.textContent = `${progress}%`;
    }

    if (refs.laneList) {
      const next = renderLaneHtml();
      if (next !== lastRenderedLaneText) {
        refs.laneList.innerHTML = next;
        lastRenderedLaneText = next;
      }
    }

    if (refs.receiptPre) {
      refs.receiptPre.textContent = getReceiptText();
    }

    publishGlobals();

    if (!state.completionLatched || Math.abs(state.mainDisplayProgress - state.mainProgressCap) > 0.08) {
      raf = root.requestAnimationFrame(render);
    }
  }

  function startHeartbeat() {
    if (heartbeatTimer) root.clearInterval(heartbeatTimer);

    state.startedAt = state.startedAt || nowIso();
    state.heartbeatStartedAt = nowMs();

    heartbeatTimer = root.setInterval(() => {
      state.heartbeatElapsedMs = nowMs() - state.heartbeatStartedAt;

      if (!state.completionLatched) {
        const led = ledgerState();
        const activeLanes = Object.values(led.lanes || {}).filter((lane) => (
          ![STATUS.READY, STATUS.HELD, STATUS.DEGRADED, STATUS.FAILED, STATUS.FINAL_READY, STATUS.LATCHED, STATUS.HYDRATED, STATUS.MOUNTED, STATUS.RENDERED, STATUS.BOUND, STATUS.COPY_ARMED].includes(lane.status)
        ));

        activeLanes.forEach((lane) => {
          const elapsed = lane.elapsedMs || 0;

          if (elapsed > 12000 && !lane.watchdogExtended) {
            lane.watchdogExtended = true;
            lane.watchdog = `Extended load · copy diagnostic now available`;
            pushLedger({
              id: "WATCHDOG_EXTENDED_LOAD",
              stage: lane.fibonacci,
              owner: "hearth.js",
              file: DESTINATION_FILE,
              lane: lane.key,
              status: lane.status,
              message: lane.watchdog
            });
          } else if (elapsed > 6000 && !lane.watchdogSlow) {
            lane.watchdogSlow = true;
            lane.watchdog = `${lane.label} still active · diagnostic available`;
            pushLedger({
              id: "WATCHDOG_SLOW_LOAD",
              stage: lane.fibonacci,
              owner: "hearth.js",
              file: DESTINATION_FILE,
              lane: lane.key,
              status: lane.status,
              message: lane.watchdog
            });
          } else if (elapsed > 2000 && !lane.watchdogStill) {
            lane.watchdogStill = true;
            lane.watchdog = `Still loading · waiting on ${lane.label} · elapsed ${formatElapsed(elapsed)}`;
            pushLedger({
              id: "WATCHDOG_STILL_LOADING",
              stage: lane.fibonacci,
              owner: "hearth.js",
              file: DESTINATION_FILE,
              lane: lane.key,
              status: lane.status,
              message: lane.watchdog
            });
          }
        });

        reconcileAll("heartbeat");
      } else {
        state.quietHeartbeat = true;
        publishGlobals();
      }
    }, 1000);
  }

  function startAnimationLoop() {
    if (raf) return;
    raf = root.requestAnimationFrame(render);
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
      partialReceiptAvailable: state.partialReceiptAvailable,
      finalReceiptAvailable: state.finalReceiptAvailable
    }, { visible: false, stage: state.fibonacciStage, lane: "conductorHydration" });

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

      activeRouteConductor: DESTINATION_FILE,
      retiredClimateRoute: RETIRED_CLIMATE_ROUTE,
      retiredClimateRouteActiveCarrier: false,

      hydratedExistingCockpit: state.hydratedExistingCockpit,
      duplicateCockpitCreated: false,
      fallbackCockpitCreated: state.fallbackCockpitCreated,
      loadLedgerPresent: state.loadLedgerPresent,

      fibonacciStage: state.fibonacciStage,
      currentFibonacciStage: led.currentFibonacciStage || state.currentFibonacciStage,
      completionLatched: state.completionLatched,
      visibleLoadingActive: state.visibleLoadingActive,
      diagnosticCockpitReady: state.diagnosticCockpitReady,

      runtimeTablePresent: state.runtimeTablePresent,
      runtimeTableMode: state.runtimeTableMode,
      runtimeTablePlanAttempted: state.runtimeTablePlanAttempted,
      runtimeTablePlanCreated: state.runtimeTablePlanCreated,
      runtimeTablePlanError: state.runtimeTablePlanError,

      sourceAuthorityHeld: true,

      canvasApiPresent: state.canvasApiPresent,
      canvasScriptRequested: state.canvasScriptRequested,
      canvasScriptLoaded: state.canvasScriptLoaded,
      canvasScriptError: state.canvasScriptError,
      canvasCarrierRequested: state.canvasCarrierRequested,
      canvasCarrierMounted: state.canvasCarrierMounted,
      canvasCarrierHandoffOk: state.canvasCarrierHandoffOk,
      canvasCarrierHandoffError: state.canvasCarrierHandoffError,
      canvasCarrierMethod: state.canvasCarrierMethod,
      firstFrameDetected: state.firstFrameDetected,
      dragInspectionBound: state.dragInspectionBound,
      imageRendered: state.imageRendered,

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

    const events = (receipt.ledger && Array.isArray(receipt.ledger.events) ? receipt.ledger.events : []).map((event) => (
      `- ${event.timestamp} :: ${event.id} :: stage=${event.stage} :: lane=${event.lane} :: status=${event.status} :: ${event.message}`
    )).join("\n") || "- none";

    const localEvents = receipt.events.map((entry) => (
      `- ${entry.at} :: ${entry.event}`
    )).join("\n") || "- none";

    const errors = receipt.errors.map((entry) => (
      `- ${entry.at} :: ${entry.code} :: ${entry.message}`
    )).join("\n") || "- none";

    return [
      "HEARTH_DISTRIBUTED_LOAD_LEDGER_CONDUCTOR_HYDRATION_LATCH_RECEIPT",
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
      "",
      `fibonacciStage=${receipt.fibonacciStage}`,
      `currentFibonacciStage=${receipt.currentFibonacciStage}`,
      `completionLatched=${receipt.completionLatched}`,
      `visibleLoadingActive=${receipt.visibleLoadingActive}`,
      `diagnosticCockpitReady=${receipt.diagnosticCockpitReady}`,
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
      `canvasScriptRequested=${receipt.canvasScriptRequested}`,
      `canvasScriptLoaded=${receipt.canvasScriptLoaded}`,
      `canvasScriptError=${receipt.canvasScriptError}`,
      `canvasCarrierRequested=${receipt.canvasCarrierRequested}`,
      `canvasCarrierMounted=${receipt.canvasCarrierMounted}`,
      `canvasCarrierHandoffOk=${receipt.canvasCarrierHandoffOk}`,
      `canvasCarrierHandoffError=${receipt.canvasCarrierHandoffError}`,
      `canvasCarrierMethod=${receipt.canvasCarrierMethod}`,
      `firstFrameDetected=${receipt.firstFrameDetected}`,
      `dragInspectionBound=${receipt.dragInspectionBound}`,
      `imageRendered=${receipt.imageRendered}`,
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
      "LEDGER_EVENTS",
      events,
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

    root.__HEARTH_ACTIVE_ROUTE_FILE__ = DESTINATION_FILE;
    root.__HEARTH_ACTIVE_ROUTE_CONDUCTOR__ = DESTINATION_FILE;
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

    dataset.hearthActiveRouteFile = DESTINATION_FILE;
    dataset.hearthActiveRouteConductor = DESTINATION_FILE;
    dataset.hearthActiveRouteContract = CONTRACT;
    dataset.hearthRetiredClimateRoute = RETIRED_CLIMATE_ROUTE;
    dataset.hearthRetiredClimateRouteActiveCarrier = "false";

    dataset.hearthLoadLedgerPresent = String(state.loadLedgerPresent);
    dataset.hearthHydratedExistingCockpit = String(state.hydratedExistingCockpit);
    dataset.hearthDuplicateCockpitCreated = "false";
    dataset.hearthFallbackCockpitCreated = String(state.fallbackCockpitCreated);

    dataset.hearthFibonacciStage = state.fibonacciStage;
    dataset.hearthCompletionLatched = String(state.completionLatched);
    dataset.hearthVisibleLoadingActive = String(state.visibleLoadingActive);
    dataset.hearthDiagnosticCockpitReady = String(state.diagnosticCockpitReady);

    dataset.hearthRuntimeTablePresent = String(state.runtimeTablePresent);
    dataset.hearthRuntimeTableMode = state.runtimeTableMode;
    dataset.hearthRuntimeTablePlanAttempted = String(state.runtimeTablePlanAttempted);
    dataset.hearthRuntimeTablePlanCreated = String(state.runtimeTablePlanCreated);

    dataset.hearthSourceAuthorityHeld = "true";

    dataset.hearthCanvasApiPresent = String(state.canvasApiPresent);
    dataset.hearthCanvasScriptRequested = String(state.canvasScriptRequested);
    dataset.hearthCanvasScriptLoaded = String(state.canvasScriptLoaded);
    dataset.hearthCanvasCarrierRequested = String(state.canvasCarrierRequested);
    dataset.hearthCanvasCarrierMounted = String(state.canvasCarrierMounted);
    dataset.hearthCanvasCarrierHandoffOk = String(state.canvasCarrierHandoffOk);
    dataset.hearthCanvasCarrierMethod = state.canvasCarrierMethod;
    dataset.hearthFirstFrameDetected = String(state.firstFrameDetected);
    dataset.hearthDragInspectionBound = String(state.dragInspectionBound);
    dataset.hearthImageRendered = String(state.imageRendered);

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
    emitLocal("CONDUCTOR_STARTING", { contract: CONTRACT }, true);

    ensureMount();
    ensureLedger();
    guardRetiredClimateRoute();
    hydrateCockpit();
    neutralizeOldLoaders();

    startHeartbeat();

    checkRuntimeTable();

    emit("SOURCE_STACK_HELD", {
      sourceAuthorityHeld: true
    }, { stage: "F5", lane: "authorityAvailability", status: STATUS.HELD });

    callCanvasCarrier();

    if (reconcileTimer) root.clearInterval(reconcileTimer);
    reconcileTimer = root.setInterval(() => {
      if (!state.completionLatched) {
        reconcileAll("interval");
      } else {
        publishGlobals();
      }
    }, 800);

    [120, 300, 700, 1300, 2400, 4200, 6800, 10000].forEach((ms) => {
      root.setTimeout(() => {
        if (!state.completionLatched) {
          reconcileAll(`post-boot-${ms}ms`);
        }
      }, ms);
    });

    startAnimationLoop();
    render();
  }

  function dispose(reason = "manual-dispose") {
    if (heartbeatTimer) {
      root.clearInterval(heartbeatTimer);
      heartbeatTimer = 0;
    }

    if (reconcileTimer) {
      root.clearInterval(reconcileTimer);
      reconcileTimer = 0;
    }

    if (raf) {
      root.cancelAnimationFrame(raf);
      raf = 0;
    }

    emit("CONDUCTOR_DISPOSED", { reason }, { visible: false, lane: "conductorHydration" });
    publishGlobals();
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    route: ROUTE,
    destinationFile: DESTINATION_FILE,

    boot,
    reconcile: reconcileAll,
    tryLatchCompletion,
    getReceipt,
    getReceiptText,
    copyDiagnostic,
    dispose,

    supportsDistributedLoadLedger: true,
    supportsHtmlCockpitHydration: true,
    supportsFibonacciLoadStages: true,
    supportsCompletionLatch: true,
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

// /showroom/globe/hearth/hearth.js
// HEARTH_ROUTE_CONDUCTOR_MULTI_BAR_LIVE_LOADING_DIAGNOSTIC_TNT_v2
// Full-file replacement.
// Active Hearth route conductor only.
// Purpose:
// - Replace the single-bar loader with a multi-bar live diagnostic cockpit.
// - Keep heartbeat, partial receipt, copy diagnostic, and visible progress available during loading.
// - Keep Runtime Table optional for first visible carrier.
// - Coordinate /assets/hearth/hearth.canvas.js without owning canvas drawing.
// - Neutralize stale shell loader without removing canvas, mount, or controls.
// Does not own:
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

  const CONTRACT = "HEARTH_ROUTE_CONDUCTOR_MULTI_BAR_LIVE_LOADING_DIAGNOSTIC_TNT_v2";
  const RECEIPT = "HEARTH_ROUTE_CONDUCTOR_MULTI_BAR_LIVE_LOADING_DIAGNOSTIC_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_ANIMATED_LOAD_SCREEN_STATE_MACHINE_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_MULTI_BAR_LIVE_LOADING_DIAGNOSTIC_PRECODE_FINAL_DRAFT_v1";
  const VERSION = "2026-05-29.hearth-route-conductor-multi-bar-live-loading-diagnostic-v2";

  const ROUTE = "/showroom/globe/hearth/";
  const DESTINATION_FILE = "/showroom/globe/hearth/hearth.js";
  const CANVAS_AUTHORITY_FILE = "/assets/hearth/hearth.canvas.js";
  const RUNTIME_TABLE_FILE = "/assets/lab/runtime-table.js";
  const RETIRED_CLIMATE_ROUTE = "/showroom/globe/hearth/hearth.climate.route.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const LANE_STATE = Object.freeze({
    STARTED: "STARTED",
    ALIVE: "ALIVE",
    PENDING: "PENDING",
    LOADING: "LOADING",
    CHECKING: "CHECKING",
    READY: "READY",
    DEGRADED: "DEGRADED",
    HELD: "HELD",
    FAILED: "FAILED",
    PARTIAL_READY: "PARTIAL_READY",
    FINAL_PENDING: "FINAL_PENDING",
    FINAL_READY: "FINAL_READY"
  });

  const POSTGAME_STATUS = Object.freeze({
    LIVE_DIAGNOSTIC_LOADING: "LIVE_DIAGNOSTIC_LOADING",
    MULTI_BAR_LOADER_ACTIVE: "MULTI_BAR_LOADER_ACTIVE",
    CANVAS_HANDOFF_IN_PROGRESS: "CANVAS_HANDOFF_IN_PROGRESS",
    VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_READY: "VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_READY",
    VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_DEGRADED: "VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_DEGRADED",
    VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_MISSING: "VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_MISSING",
    DIAGNOSTIC_COCKPIT_READY: "DIAGNOSTIC_COCKPIT_READY",
    BLOCKED_CARRIER_STRUCTURAL_FAILURE: "BLOCKED_CARRIER_STRUCTURAL_FAILURE"
  });

  const LANE_KEYS = Object.freeze({
    SYSTEM: "system",
    CONDUCTOR: "conductor",
    CANVAS: "canvas",
    RECEIPT: "receipt"
  });

  const LANE_DEFINITIONS = Object.freeze([
    {
      key: LANE_KEYS.SYSTEM,
      title: "System alive",
      subtitle: "Heartbeat active",
      startProgress: 12
    },
    {
      key: LANE_KEYS.CONDUCTOR,
      title: "Conductor",
      subtitle: "Route conductor booting",
      startProgress: 22
    },
    {
      key: LANE_KEYS.CANVAS,
      title: "Canvas carrier",
      subtitle: "Carrier handoff pending",
      startProgress: 0
    },
    {
      key: LANE_KEYS.RECEIPT,
      title: "Diagnostic receipt",
      subtitle: "Partial receipt initializing",
      startProgress: 0
    }
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

    systemAlive: false,
    heartbeatStarted: false,
    heartbeatStartedAt: 0,
    heartbeatElapsedMs: 0,
    heartbeatText: "Starting",
    latestEvent: "CONDUCTOR_V2_STARTING",

    multiBarLoaderMounted: false,
    partialReceiptAvailable: false,
    copyDiagnosticAvailable: false,
    copyDiagnosticArmed: false,
    finalReceiptAvailable: false,
    receiptOverlayIndependent: true,

    mainProgress: 0,
    mainDisplayProgress: 0,
    mainProgressCap: 0,
    mainProgressText: "Starting Hearth conductor",

    oldLoaderNeutralized: false,
    oldLoaderNeutralizationMode: "pending",

    runtimeTablePresent: false,
    runtimeTableMode: "RUNTIME_TABLE_PENDING",
    runtimeTablePlanAttempted: false,
    runtimeTablePlanCreated: false,
    runtimeTablePlanError: "",
    runtimeTablePlan: null,
    runtimeTableOptional: true,
    runtimeTableMissingDoesNotBlockCarrier: true,

    sourceAuthorityHeld: true,

    canvasMountPresent: false,
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

    panelMobileSafe: false,
    buttonsReachable: false,
    mapPortalNotBlockingControls: true,
    cockpitCollapsed: false,
    receiptVisible: false,
    receiptExpanded: false,

    coherentExpressionPass: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,

    firstFailedCoordinate: "CONDUCTOR_V2_STARTING",
    recommendedNextRenewalTarget: "multi-bar-loader-observation",
    postgameStatus: POSTGAME_STATUS.LIVE_DIAGNOSTIC_LOADING,

    lanes: {},
    watchdogStates: {},
    events: [],
    errors: [],
    startedAt: "",
    updatedAt: ""
  };

  const nodes = {
    mount: null,
    overlay: null,
    panel: null,
    compact: null,
    title: null,
    subtitle: null,
    latest: null,
    mainBar: null,
    mainPercent: null,
    laneArea: null,
    receiptBox: null,
    receiptPre: null,
    copyButton: null,
    receiptButton: null,
    expandButton: null,
    collapseButton: null
  };

  let progressRaf = 0;
  let heartbeatTimer = 0;
  let reconcileTimer = 0;
  let canvasCallAttempted = false;
  let partialReceiptCreated = false;
  let lastRenderText = "";

  LANE_DEFINITIONS.forEach((lane) => {
    state.lanes[lane.key] = {
      key: lane.key,
      title: lane.title,
      state: LANE_STATE.PENDING,
      progress: 0,
      subtitle: lane.subtitle,
      elapsedMs: 0,
      startedAtMs: 0,
      updatedAt: "",
      lastEvent: "PENDING",
      detail: ""
    };

    state.watchdogStates[lane.key] = {
      stillLoadingIssued: false,
      slowLoadIssued: false,
      extendedLoadIssued: false,
      text: ""
    };
  });

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

  function formatElapsed(ms) {
    const total = Math.max(0, Math.floor(Number(ms || 0) / 1000));
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function emit(event, detail = {}) {
    const entry = {
      event,
      detail: clonePlain(detail),
      at: nowIso()
    };

    state.events.push(entry);
    state.latestEvent = event;
    state.updatedAt = entry.at;

    if (state.events.length > 120) {
      state.events.splice(0, state.events.length - 120);
    }

    publishGlobals();
    return entry;
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

    emit("ERROR", item);
    return item;
  }

  function setLane(key, next = {}) {
    const lane = state.lanes[key];
    if (!lane) return;

    const previousState = lane.state;
    const previousProgress = lane.progress;

    if (!lane.startedAtMs) {
      lane.startedAtMs = nowMs();
    }

    if (next.state) lane.state = next.state;
    if (Number.isFinite(Number(next.progress))) lane.progress = clamp(Number(next.progress), 0, 100);
    if (next.subtitle !== undefined) lane.subtitle = String(next.subtitle || "");
    if (next.detail !== undefined) lane.detail = String(next.detail || "");
    if (next.lastEvent) lane.lastEvent = next.lastEvent;

    lane.elapsedMs = nowMs() - lane.startedAtMs;
    lane.updatedAt = nowIso();

    if (
      previousState !== lane.state ||
      previousProgress !== lane.progress ||
      next.forceEvent
    ) {
      emit(next.event || `LANE_${key.toUpperCase()}_${lane.state}`, {
        key,
        state: lane.state,
        progress: lane.progress,
        subtitle: lane.subtitle,
        detail: lane.detail
      });
    }

    updateMainProgressCap();
    render();
  }

  function markWatchdog(key) {
    const lane = state.lanes[key];
    const watchdog = state.watchdogStates[key];

    if (!lane || !watchdog) return;

    const elapsed = lane.elapsedMs || (lane.startedAtMs ? nowMs() - lane.startedAtMs : 0);
    const active = ![
      LANE_STATE.READY,
      LANE_STATE.HELD,
      LANE_STATE.DEGRADED,
      LANE_STATE.FAILED,
      LANE_STATE.FINAL_READY
    ].includes(lane.state);

    if (!active) return;

    if (elapsed >= 12000 && !watchdog.extendedLoadIssued) {
      watchdog.extendedLoadIssued = true;
      watchdog.text = `Extended load · copy diagnostic now available · elapsed ${formatElapsed(elapsed)}`;
      emit("WATCHDOG_EXTENDED_LOAD", { key, elapsedMs: elapsed, text: watchdog.text });
    } else if (elapsed >= 6000 && !watchdog.slowLoadIssued) {
      watchdog.slowLoadIssued = true;
      watchdog.text = `Slow load · ${lane.title} still active · diagnostic available`;
      emit("WATCHDOG_SLOW_LOAD", { key, elapsedMs: elapsed, text: watchdog.text });
    } else if (elapsed >= 2000 && !watchdog.stillLoadingIssued) {
      watchdog.stillLoadingIssued = true;
      watchdog.text = `Still loading · waiting on ${lane.title} · elapsed ${formatElapsed(elapsed)}`;
      emit("WATCHDOG_STILL_LOADING", { key, elapsedMs: elapsed, text: watchdog.text });
    }

    if (watchdog.text) {
      lane.detail = watchdog.text;
    }
  }

  function updateMainProgressCap() {
    let cap = 0;

    if (state.systemAlive && state.heartbeatStarted) cap = Math.max(cap, 15);
    if (state.multiBarLoaderMounted && state.partialReceiptAvailable) cap = Math.max(cap, 35);

    const runtimeChecked =
      state.runtimeTableMode === "RUNTIME_TABLE_READY_OR_DEGRADED" ||
      state.runtimeTableMode === "RUNTIME_TABLE_MISSING_ALLOWED" ||
      state.runtimeTableMode === "RUNTIME_TABLE_DEGRADED";

    if (runtimeChecked && state.sourceAuthorityHeld) cap = Math.max(cap, 55);
    if (state.canvasApiPresent || state.canvasCarrierRequested || state.canvasScriptRequested) cap = Math.max(cap, 75);
    if (state.canvasCarrierMounted || state.firstFrameDetected || state.imageRendered) cap = Math.max(cap, 90);
    if (state.partialReceiptAvailable && state.copyDiagnosticArmed && state.receiptOverlayIndependent) cap = Math.max(cap, 97);

    const controlsReady =
      state.copyDiagnosticArmed &&
      state.copyDiagnosticAvailable &&
      state.buttonsReachable &&
      state.panelMobileSafe &&
      state.partialReceiptAvailable &&
      state.finalReceiptAvailable &&
      state.receiptOverlayIndependent;

    if (controlsReady) cap = 100;

    state.mainProgressCap = clamp(cap, 0, 100);
    state.mainProgress = state.mainProgressCap;

    if (state.mainProgressCap < 15) state.mainProgressText = "Starting system heartbeat";
    else if (state.mainProgressCap < 35) state.mainProgressText = "Conductor cockpit mounting";
    else if (state.mainProgressCap < 55) state.mainProgressText = "Runtime Table and source hold checking";
    else if (state.mainProgressCap < 75) state.mainProgressText = "Canvas carrier handoff preparing";
    else if (state.mainProgressCap < 90) state.mainProgressText = "Canvas carrier loading";
    else if (state.mainProgressCap < 97) state.mainProgressText = "Visible carrier detected";
    else if (state.mainProgressCap < 100) state.mainProgressText = "Diagnostic controls arming";
    else state.mainProgressText = "Diagnostic cockpit ready";
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

    emit("OLD_ROUTE_GUARDED", {
      activeRouteConductor: DESTINATION_FILE,
      retiredClimateRoute: RETIRED_CLIMATE_ROUTE
    });
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
    mount.dataset.hearthMultiBarLoaderMounted = String(state.multiBarLoaderMounted);
    mount.dataset.hearthVisibleCarrierFirst = "true";
    mount.dataset.hearthReceiptOverlayIndependent = "true";
    mount.dataset.hearthRuntimeTableOptional = "true";
    mount.dataset.hearthRuntimeTableMissingDoesNotBlockCarrier = "true";

    mount.style.position = mount.style.position || "relative";
    mount.style.overflow = mount.style.overflow || "hidden";
    mount.style.touchAction = "none";
    mount.style.userSelect = "none";

    state.canvasMountPresent = true;
    nodes.mount = mount;

    return mount;
  }

  function neutralizeOldLoader() {
    if (!doc) return;

    emit("OLD_LOADER_NEUTRALIZATION_STARTED", {});

    const mount = ensureMount();
    let hiddenCount = 0;
    let removedCount = 0;

    if (mount) {
      mount.querySelectorAll("[data-hearth-mount-fallback], .mount-fallback").forEach((node) => {
        node.dataset.hearthOldLoaderNeutralized = "true";
        node.hidden = true;
        node.style.display = "none";
        node.style.visibility = "hidden";
        node.style.pointerEvents = "none";
        hiddenCount += 1;
      });

      mount.querySelectorAll("[data-hearth-loading-overlay='true'], .hearth-loading-overlay, [data-hearth-v1-loader='true']").forEach((node) => {
        if (node.dataset && node.dataset.hearthV2LiveDiagnostic === "true") return;
        node.remove();
        removedCount += 1;
      });
    }

    doc.querySelectorAll("[data-hearth-old-loader], [data-hearth-shell-loader]").forEach((node) => {
      node.dataset.hearthOldLoaderNeutralized = "true";
      node.hidden = true;
      node.style.display = "none";
      hiddenCount += 1;
    });

    state.oldLoaderNeutralized = true;
    state.oldLoaderNeutralizationMode = `hidden=${hiddenCount};removed=${removedCount}`;

    emit("OLD_LOADER_NEUTRALIZED", {
      hiddenCount,
      removedCount,
      mode: state.oldLoaderNeutralizationMode
    });
  }

  function cssText() {
    return `
      .hearth-v2-overlay{
        position:absolute;
        inset:0;
        z-index:24;
        display:flex;
        align-items:flex-end;
        justify-content:center;
        padding:10px;
        pointer-events:none;
        background:
          radial-gradient(circle at 50% 34%, rgba(141,216,255,.08), transparent 42%),
          linear-gradient(180deg, rgba(1,4,10,.04), rgba(1,4,10,.28));
      }

      .hearth-v2-panel{
        pointer-events:auto;
        display:flex;
        flex-direction:column;
        width:min(100%, 580px);
        max-height:calc(100% - 16px);
        min-height:0;
        overflow:hidden;
        border:1px solid rgba(231,188,105,.34);
        border-radius:22px;
        color:#eef6ff;
        background:
          radial-gradient(circle at 5% 0%, rgba(231,188,105,.14), transparent 18rem),
          radial-gradient(circle at 92% 16%, rgba(141,216,255,.12), transparent 20rem),
          linear-gradient(180deg, rgba(9,22,41,.97), rgba(2,7,14,.96));
        box-shadow:0 24px 80px rgba(0,0,0,.54), inset 0 1px 0 rgba(255,255,255,.08);
        backdrop-filter:blur(14px);
        font-family:Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      .hearth-v2-panel[data-collapsed="true"]{
        display:none;
      }

      .hearth-v2-compact{
        pointer-events:auto;
        display:none;
        align-items:center;
        gap:10px;
        max-width:calc(100% - 12px);
        border:1px solid rgba(231,188,105,.34);
        border-radius:999px;
        padding:10px 12px;
        color:rgba(255,244,216,.94);
        background:rgba(3,9,20,.92);
        box-shadow:0 18px 60px rgba(0,0,0,.46), inset 0 1px 0 rgba(255,255,255,.08);
        backdrop-filter:blur(12px);
        font-weight:950;
        cursor:pointer;
      }

      .hearth-v2-compact[data-visible="true"]{
        display:flex;
      }

      .hearth-v2-pulse{
        width:12px;
        height:12px;
        border-radius:50%;
        background:#8bd7a3;
        box-shadow:0 0 18px rgba(139,215,163,.46);
        animation:hearth-v2-pulse 780ms ease-in-out infinite alternate;
      }

      .hearth-v2-head{
        flex:0 0 auto;
        display:grid;
        gap:6px;
        padding:14px 14px 10px;
        border-bottom:1px solid rgba(231,188,105,.16);
      }

      .hearth-v2-kicker{
        color:#e7bc69;
        font-size:.66rem;
        font-weight:950;
        letter-spacing:.16em;
        text-transform:uppercase;
      }

      .hearth-v2-title{
        margin:0;
        color:rgba(255,244,216,.98);
        font-size:clamp(1rem, 3vw, 1.48rem);
        line-height:1;
        letter-spacing:-.035em;
        font-weight:950;
      }

      .hearth-v2-subtitle,
      .hearth-v2-latest{
        color:rgba(238,246,255,.70);
        font-size:.78rem;
        line-height:1.34;
        font-weight:760;
      }

      .hearth-v2-latest{
        color:rgba(141,216,255,.78);
        font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
        font-size:.68rem;
      }

      .hearth-v2-main-progress{
        flex:0 0 auto;
        display:grid;
        grid-template-columns:1fr auto;
        align-items:center;
        gap:10px;
        padding:10px 14px;
        border-bottom:1px solid rgba(141,216,255,.10);
      }

      .hearth-v2-track,
      .hearth-v2-lane-track{
        position:relative;
        overflow:hidden;
        border:1px solid rgba(141,216,255,.18);
        border-radius:999px;
        background:rgba(1,4,10,.72);
      }

      .hearth-v2-track{
        height:12px;
      }

      .hearth-v2-lane-track{
        height:8px;
      }

      .hearth-v2-track::after,
      .hearth-v2-lane-track::after{
        content:"";
        position:absolute;
        inset:0;
        transform:translateX(-100%);
        background:linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
        animation:hearth-v2-sheen 1.1s linear infinite;
      }

      .hearth-v2-fill,
      .hearth-v2-lane-fill{
        position:absolute;
        inset:0 auto 0 0;
        width:0%;
        border-radius:999px;
        transition:width .18s ease-out;
        background:linear-gradient(90deg, #8dd8ff, #e7bc69, #ffe8a3);
      }

      .hearth-v2-percent{
        min-width:42px;
        text-align:right;
        color:#ffe8a3;
        font:950 .82rem/1 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
      }

      .hearth-v2-actions{
        flex:0 0 auto;
        position:sticky;
        top:0;
        z-index:2;
        display:flex;
        flex-wrap:wrap;
        gap:7px;
        padding:10px 14px;
        border-bottom:1px solid rgba(231,188,105,.14);
        background:linear-gradient(180deg, rgba(7,18,32,.98), rgba(3,9,18,.96));
      }

      .hearth-v2-button{
        min-height:31px;
        border:1px solid rgba(231,188,105,.25);
        border-radius:999px;
        padding:7px 10px;
        color:rgba(238,246,255,.88);
        background:rgba(255,255,255,.045);
        font:900 .64rem/1 ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        letter-spacing:.08em;
        text-transform:uppercase;
        cursor:pointer;
      }

      .hearth-v2-button.primary{
        color:#06101e;
        border-color:rgba(231,188,105,.72);
        background:linear-gradient(135deg, #ffe8a3, #e7bc69);
      }

      .hearth-v2-button:hover{
        border-color:rgba(231,188,105,.52);
        background:rgba(231,188,105,.10);
      }

      .hearth-v2-scroll{
        flex:1 1 auto;
        min-height:0;
        overflow:auto;
        overscroll-behavior:contain;
      }

      .hearth-v2-lanes{
        display:grid;
        gap:8px;
        padding:10px 14px;
      }

      .hearth-v2-lane{
        display:grid;
        gap:7px;
        border:1px solid rgba(255,255,255,.10);
        border-radius:16px;
        padding:10px;
        background:rgba(255,255,255,.035);
      }

      .hearth-v2-lane[data-state="ready"],
      .hearth-v2-lane[data-state="alive"],
      .hearth-v2-lane[data-state="final_ready"],
      .hearth-v2-lane[data-state="partial_ready"]{
        border-color:rgba(139,215,163,.28);
        background:rgba(139,215,163,.06);
      }

      .hearth-v2-lane[data-state="loading"],
      .hearth-v2-lane[data-state="checking"],
      .hearth-v2-lane[data-state="started"]{
        border-color:rgba(141,216,255,.28);
        background:rgba(141,216,255,.06);
      }

      .hearth-v2-lane[data-state="degraded"],
      .hearth-v2-lane[data-state="held"]{
        border-color:rgba(231,188,105,.30);
        background:rgba(231,188,105,.065);
      }

      .hearth-v2-lane[data-state="failed"]{
        border-color:rgba(255,112,112,.36);
        background:rgba(255,112,112,.07);
      }

      .hearth-v2-lane-top{
        display:grid;
        grid-template-columns:18px minmax(0,1fr) auto;
        align-items:center;
        gap:9px;
      }

      .hearth-v2-dot{
        width:12px;
        height:12px;
        border-radius:50%;
        background:#8dd8ff;
        box-shadow:0 0 18px rgba(141,216,255,.28);
      }

      .hearth-v2-lane[data-state="ready"] .hearth-v2-dot,
      .hearth-v2-lane[data-state="alive"] .hearth-v2-dot,
      .hearth-v2-lane[data-state="final_ready"] .hearth-v2-dot,
      .hearth-v2-lane[data-state="partial_ready"] .hearth-v2-dot{
        background:#8bd7a3;
        box-shadow:0 0 18px rgba(139,215,163,.32);
      }

      .hearth-v2-lane[data-state="loading"] .hearth-v2-dot,
      .hearth-v2-lane[data-state="checking"] .hearth-v2-dot,
      .hearth-v2-lane[data-state="started"] .hearth-v2-dot{
        animation:hearth-v2-pulse 780ms ease-in-out infinite alternate;
      }

      .hearth-v2-lane[data-state="degraded"] .hearth-v2-dot,
      .hearth-v2-lane[data-state="held"] .hearth-v2-dot{
        background:#e7bc69;
        box-shadow:0 0 18px rgba(231,188,105,.30);
      }

      .hearth-v2-lane[data-state="failed"] .hearth-v2-dot{
        background:#d85d5d;
        box-shadow:0 0 18px rgba(216,93,93,.30);
      }

      .hearth-v2-lane-title{
        min-width:0;
        display:grid;
        gap:2px;
      }

      .hearth-v2-lane-title strong{
        color:rgba(255,244,216,.94);
        font-size:.80rem;
        line-height:1.05;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }

      .hearth-v2-lane-title span{
        color:rgba(238,246,255,.64);
        font-size:.68rem;
        line-height:1.12;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }

      .hearth-v2-lane-state{
        color:rgba(238,246,255,.72);
        font:900 .62rem/1 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
        letter-spacing:.08em;
        text-transform:uppercase;
      }

      .hearth-v2-lane-meta{
        display:flex;
        flex-wrap:wrap;
        gap:8px;
        color:rgba(238,246,255,.58);
        font:760 .62rem/1.22 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
      }

      .hearth-v2-receipt{
        display:none;
        margin:0 14px 14px;
        max-height:190px;
        overflow:auto;
        border:1px solid rgba(141,216,255,.16);
        border-radius:14px;
        background:rgba(1,4,10,.62);
      }

      .hearth-v2-receipt[data-visible="true"]{
        display:block;
      }

      .hearth-v2-panel[data-receipt-expanded="true"] .hearth-v2-receipt{
        max-height:340px;
      }

      .hearth-v2-receipt pre{
        margin:0;
        padding:11px;
        color:rgba(238,246,255,.66);
        font:700 .62rem/1.42 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
        white-space:pre-wrap;
      }

      @keyframes hearth-v2-sheen{
        from{transform:translateX(-100%)}
        to{transform:translateX(100%)}
      }

      @keyframes hearth-v2-pulse{
        from{transform:scale(.82); opacity:.62}
        to{transform:scale(1); opacity:1}
      }

      @media (max-width:760px){
        .hearth-v2-overlay{
          padding:8px;
          align-items:flex-end;
        }

        .hearth-v2-panel{
          width:100%;
          max-height:calc(100% - 12px);
          border-radius:18px;
        }

        .hearth-v2-head{
          padding:12px 12px 8px;
        }

        .hearth-v2-actions{
          padding:8px 12px;
        }

        .hearth-v2-button{
          flex:1 1 auto;
          min-width:42%;
        }

        .hearth-v2-lanes{
          padding:8px 12px;
        }

        .hearth-v2-lane-top{
          grid-template-columns:16px minmax(0,1fr);
        }

        .hearth-v2-lane-state{
          grid-column:2;
        }

        .hearth-v2-receipt{
          margin:0 12px 12px;
        }
      }
    `;
  }

  function ensureStyle() {
    if (!doc) return;

    const old = doc.getElementById("hearth-conductor-animated-loader-style");
    if (old) old.remove();

    const existing = doc.getElementById("hearth-conductor-v2-live-loader-style");
    if (existing) return;

    const style = doc.createElement("style");
    style.id = "hearth-conductor-v2-live-loader-style";
    style.textContent = cssText();
    doc.head.appendChild(style);
  }

  function mountLoader() {
    if (!doc) return null;

    ensureStyle();

    const mount = ensureMount();
    if (!mount) return null;

    neutralizeOldLoader();

    const existing = mount.querySelector("[data-hearth-v2-live-diagnostic='true']");
    if (existing) existing.remove();

    const overlay = doc.createElement("aside");
    overlay.className = "hearth-v2-overlay";
    overlay.dataset.hearthV2LiveDiagnostic = "true";
    overlay.dataset.hearthLoadingOverlay = "true";
    overlay.dataset.hearthConductorContract = CONTRACT;
    overlay.dataset.receiptOverlayIndependent = "true";

    const compact = doc.createElement("button");
    compact.type = "button";
    compact.className = "hearth-v2-compact";
    compact.dataset.visible = "false";
    compact.innerHTML = `<span class="hearth-v2-pulse" aria-hidden="true"></span><span>Show Hearth diagnostics</span>`;

    const panel = doc.createElement("section");
    panel.className = "hearth-v2-panel";
    panel.dataset.collapsed = "false";
    panel.dataset.receiptExpanded = "false";

    panel.innerHTML = `
      <div class="hearth-v2-head">
        <div class="hearth-v2-kicker">Dexter Lab · Hearth Runtime Table</div>
        <h2 class="hearth-v2-title" data-hearth-v2-title>FORMING HEARTH RUNTIME TABLE</h2>
        <div class="hearth-v2-subtitle" data-hearth-v2-subtitle>Live diagnostic cockpit starting. Copy diagnostic is available during load.</div>
        <div class="hearth-v2-latest" data-hearth-v2-latest>latest=CONDUCTOR_V2_STARTING · elapsed=00:00</div>
      </div>

      <div class="hearth-v2-main-progress">
        <div class="hearth-v2-track" aria-label="Hearth main loading progress">
          <div class="hearth-v2-fill" data-hearth-v2-main-fill></div>
        </div>
        <div class="hearth-v2-percent" data-hearth-v2-main-percent>0%</div>
      </div>

      <div class="hearth-v2-actions" data-hearth-v2-actions>
        <button class="hearth-v2-button primary" type="button" data-hearth-v2-copy>Copy diagnostic</button>
        <button class="hearth-v2-button" type="button" data-hearth-v2-receipt-toggle>Show receipt</button>
        <button class="hearth-v2-button" type="button" data-hearth-v2-expand>Expand receipt</button>
        <button class="hearth-v2-button" type="button" data-hearth-v2-collapse>Collapse cockpit</button>
      </div>

      <div class="hearth-v2-scroll">
        <div class="hearth-v2-lanes" data-hearth-v2-lanes></div>
        <div class="hearth-v2-receipt" data-hearth-v2-receipt data-visible="false">
          <pre data-hearth-v2-receipt-pre></pre>
        </div>
      </div>
    `;

    overlay.appendChild(compact);
    overlay.appendChild(panel);
    mount.appendChild(overlay);

    nodes.mount = mount;
    nodes.overlay = overlay;
    nodes.compact = compact;
    nodes.panel = panel;
    nodes.title = panel.querySelector("[data-hearth-v2-title]");
    nodes.subtitle = panel.querySelector("[data-hearth-v2-subtitle]");
    nodes.latest = panel.querySelector("[data-hearth-v2-latest]");
    nodes.mainBar = panel.querySelector("[data-hearth-v2-main-fill]");
    nodes.mainPercent = panel.querySelector("[data-hearth-v2-main-percent]");
    nodes.laneArea = panel.querySelector("[data-hearth-v2-lanes]");
    nodes.receiptBox = panel.querySelector("[data-hearth-v2-receipt]");
    nodes.receiptPre = panel.querySelector("[data-hearth-v2-receipt-pre]");
    nodes.copyButton = panel.querySelector("[data-hearth-v2-copy]");
    nodes.receiptButton = panel.querySelector("[data-hearth-v2-receipt-toggle]");
    nodes.expandButton = panel.querySelector("[data-hearth-v2-expand]");
    nodes.collapseButton = panel.querySelector("[data-hearth-v2-collapse]");

    if (nodes.copyButton) {
      nodes.copyButton.addEventListener("click", copyDiagnostic);
    }

    if (nodes.receiptButton) {
      nodes.receiptButton.addEventListener("click", () => {
        state.receiptVisible = !state.receiptVisible;
        if (nodes.receiptBox) nodes.receiptBox.dataset.visible = String(state.receiptVisible);
        nodes.receiptButton.textContent = state.receiptVisible ? "Hide receipt" : "Show receipt";
        emit("RECEIPT_VISIBILITY_TOGGLED", { visible: state.receiptVisible });
        render();
      });
    }

    if (nodes.expandButton) {
      nodes.expandButton.addEventListener("click", () => {
        state.receiptExpanded = !state.receiptExpanded;
        if (nodes.panel) nodes.panel.dataset.receiptExpanded = String(state.receiptExpanded);
        nodes.expandButton.textContent = state.receiptExpanded ? "Collapse receipt" : "Expand receipt";
        emit("RECEIPT_EXPAND_TOGGLED", { expanded: state.receiptExpanded });
        render();
      });
    }

    if (nodes.collapseButton) {
      nodes.collapseButton.addEventListener("click", () => {
        state.cockpitCollapsed = true;
        if (nodes.panel) nodes.panel.dataset.collapsed = "true";
        if (nodes.compact) nodes.compact.dataset.visible = "true";
        emit("COCKPIT_COLLAPSED_CANVAS_PRESERVED", {
          canvasCarrierMounted: state.canvasCarrierMounted,
          receiptOverlayIndependent: true
        });
        publishGlobals();
      });
    }

    if (nodes.compact) {
      nodes.compact.addEventListener("click", () => {
        state.cockpitCollapsed = false;
        if (nodes.panel) nodes.panel.dataset.collapsed = "false";
        if (nodes.compact) nodes.compact.dataset.visible = "false";
        emit("COCKPIT_REOPENED", {});
        render();
      });
    }

    state.multiBarLoaderMounted = true;
    state.partialReceiptAvailable = true;
    state.copyDiagnosticAvailable = true;
    state.copyDiagnosticArmed = Boolean(nodes.copyButton);
    state.panelMobileSafe = true;
    state.buttonsReachable = Boolean(nodes.copyButton && nodes.receiptButton && nodes.expandButton && nodes.collapseButton);
    state.postgameStatus = POSTGAME_STATUS.MULTI_BAR_LOADER_ACTIVE;

    mount.dataset.hearthMultiBarLoaderMounted = "true";
    mount.dataset.hearthPartialReceiptAvailable = "true";
    mount.dataset.hearthCopyDiagnosticAvailable = String(state.copyDiagnosticAvailable);
    mount.dataset.hearthReceiptOverlayIndependent = "true";

    emit("PARTIAL_RECEIPT_CREATED", {});
    emit("COPY_DIAGNOSTIC_ARMED", { armed: state.copyDiagnosticArmed });
    emit("MULTI_BAR_LOADER_MOUNTED", { buttonsReachable: state.buttonsReachable });

    setLane(LANE_KEYS.RECEIPT, {
      state: LANE_STATE.PARTIAL_READY,
      progress: 64,
      subtitle: "Partial receipt ready; copy diagnostic armed",
      event: "RECEIPT_LANE_PARTIAL_READY",
      lastEvent: "PARTIAL_RECEIPT_CREATED"
    });

    render();
    return overlay;
  }

  function startHeartbeat() {
    state.systemAlive = true;
    state.heartbeatStarted = true;
    state.heartbeatStartedAt = nowMs();
    state.startedAt = nowIso();
    state.heartbeatText = "System alive";

    setLane(LANE_KEYS.SYSTEM, {
      state: LANE_STATE.ALIVE,
      progress: 35,
      subtitle: "Heartbeat active",
      detail: "System is active; diagnostics are copyable during load.",
      event: "SYSTEM_HEARTBEAT_STARTED",
      lastEvent: "SYSTEM_HEARTBEAT_STARTED",
      forceEvent: true
    });

    if (heartbeatTimer) root.clearInterval(heartbeatTimer);

    heartbeatTimer = root.setInterval(() => {
      state.heartbeatElapsedMs = nowMs() - state.heartbeatStartedAt;
      state.heartbeatText = `System alive · elapsed ${formatElapsed(state.heartbeatElapsedMs)}`;

      const lane = state.lanes[LANE_KEYS.SYSTEM];
      lane.elapsedMs = state.heartbeatElapsedMs;
      lane.progress = Math.max(35, Math.min(96, 35 + ((state.heartbeatElapsedMs / 1000) % 10) * 4));
      lane.subtitle = state.heartbeatText;
      lane.detail = "Heartbeat active. The page has not frozen.";
      lane.lastEvent = state.latestEvent;
      lane.updatedAt = nowIso();

      Object.keys(state.lanes).forEach(markWatchdog);
      reconcileAll("heartbeat");
      render();
    }, 500);

    emit("SYSTEM_HEARTBEAT_STARTED", { heartbeatStarted: true });
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

  function getCanvasApi() {
    return (
      root.HEARTH_CANVAS ||
      root.HearthCanvas ||
      (root.HEARTH && root.HEARTH.canvas) ||
      null
    );
  }

  function getCanvasReceipt() {
    const api = getCanvasApi();

    if (api && isFunction(api.getReceipt)) {
      try {
        const receipt = api.getReceipt("hearth-conductor-v2-reconcile");
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

  function checkRuntimeTable() {
    setLane(LANE_KEYS.CONDUCTOR, {
      state: LANE_STATE.CHECKING,
      progress: 46,
      subtitle: "Runtime Table check started",
      event: "RUNTIME_TABLE_CHECK_STARTED",
      lastEvent: "RUNTIME_TABLE_CHECK_STARTED"
    });

    const api = getRuntimeTableApi();

    state.runtimeTablePresent = Boolean(api);
    state.runtimeTablePlanAttempted = Boolean(api);

    if (!api) {
      state.runtimeTableMode = "RUNTIME_TABLE_MISSING_ALLOWED";
      state.runtimeTablePlanCreated = false;
      state.runtimeTablePlanError = "";

      setLane(LANE_KEYS.CONDUCTOR, {
        state: LANE_STATE.DEGRADED,
        progress: 55,
        subtitle: "Runtime Table missing; first visible carrier continues",
        detail: "Runtime Table absence is degraded diagnostic mode, not blank planet mode.",
        event: "RUNTIME_TABLE_DEGRADED",
        lastEvent: "RUNTIME_TABLE_DEGRADED"
      });

      return null;
    }

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
            canvasMounted: state.canvasMountPresent,
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
            canvasMounted: state.canvasMountPresent,
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

      state.runtimeTableMode = "RUNTIME_TABLE_READY_OR_DEGRADED";
      state.runtimeTablePlanCreated = Boolean(plan);
      state.runtimeTablePlanError = "";
      state.runtimeTablePlan = plan || null;

      setLane(LANE_KEYS.CONDUCTOR, {
        state: LANE_STATE.READY,
        progress: 70,
        subtitle: state.runtimeTablePlanCreated ? "Runtime Table ready; plan created" : "Runtime Table ready; no plan export needed",
        detail: "Source stack held. Canvas handoff may continue.",
        event: "RUNTIME_TABLE_READY",
        lastEvent: "RUNTIME_TABLE_READY"
      });

      emit("SOURCE_STACK_HELD_READY", { sourceAuthorityHeld: true });
      return plan;
    } catch (error) {
      state.runtimeTableMode = "RUNTIME_TABLE_DEGRADED";
      state.runtimeTablePlanCreated = false;
      state.runtimeTablePlanError = error && error.message ? error.message : String(error);

      recordError("RUNTIME_TABLE_PLAN_ERROR", state.runtimeTablePlanError);

      setLane(LANE_KEYS.CONDUCTOR, {
        state: LANE_STATE.DEGRADED,
        progress: 62,
        subtitle: "Runtime Table degraded; carrier continues",
        detail: state.runtimeTablePlanError,
        event: "RUNTIME_TABLE_DEGRADED",
        lastEvent: "RUNTIME_TABLE_DEGRADED"
      });

      emit("SOURCE_STACK_HELD_READY", { sourceAuthorityHeld: true });
      return null;
    }
  }

  function requestCanvasScript() {
    if (!doc || state.canvasScriptRequested) return;

    state.canvasScriptRequested = true;

    const exists = Array.from(doc.scripts || []).some((script) => (
      script.src && script.src.includes(CANVAS_AUTHORITY_FILE)
    ));

    if (exists) {
      setLane(LANE_KEYS.CANVAS, {
        state: LANE_STATE.CHECKING,
        progress: 28,
        subtitle: "Canvas script already present; waiting for API",
        event: "CANVAS_SCRIPT_PRESENT_API_PENDING",
        lastEvent: "CANVAS_SCRIPT_PRESENT_API_PENDING"
      });
      return;
    }

    const script = doc.createElement("script");
    script.src = `${CANVAS_AUTHORITY_FILE}?v=${encodeURIComponent(CONTRACT)}`;
    script.defer = true;
    script.dataset.hearthCanvasRequestedByConductor = "true";
    script.dataset.hearthConductorContract = CONTRACT;

    script.onload = () => {
      state.canvasScriptLoaded = true;
      state.canvasScriptError = "";
      emit("CANVAS_SCRIPT_LOADED", { src: script.src });
      callCanvasCarrier();
    };

    script.onerror = () => {
      state.canvasScriptLoaded = false;
      state.canvasScriptError = "Canvas script failed to load.";
      state.canvasCarrierHandoffError = state.canvasScriptError;
      state.finalReceiptAvailable = true;
      state.postgameStatus = POSTGAME_STATUS.BLOCKED_CARRIER_STRUCTURAL_FAILURE;
      state.firstFailedCoordinate = "CANVAS_SCRIPT_LOAD_FAILED";
      state.recommendedNextRenewalTarget = "canvas-script-path-or-index-script-order";

      recordError("CANVAS_SCRIPT_LOAD_FAILED", state.canvasScriptError, { src: script.src });

      setLane(LANE_KEYS.CANVAS, {
        state: LANE_STATE.FAILED,
        progress: 100,
        subtitle: "Canvas script failed",
        detail: state.canvasScriptError,
        event: "CANVAS_SCRIPT_LOAD_FAILED",
        lastEvent: "CANVAS_SCRIPT_LOAD_FAILED"
      });

      setLane(LANE_KEYS.RECEIPT, {
        state: LANE_STATE.FINAL_READY,
        progress: 100,
        subtitle: "Failure receipt ready",
        event: "FINAL_RECEIPT_READY",
        lastEvent: "FINAL_RECEIPT_READY"
      });
    };

    doc.head.appendChild(script);

    setLane(LANE_KEYS.CANVAS, {
      state: LANE_STATE.LOADING,
      progress: 20,
      subtitle: "Canvas script requested",
      event: "CANVAS_SCRIPT_REQUESTED",
      lastEvent: "CANVAS_SCRIPT_REQUESTED"
    });
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
      loadingScreenMounted: true,
      multiBarLoaderMounted: true,
      receiptOverlayIndependent: true,
      callbacks: {
        onMounted: (receipt) => {
          state.canvasCarrierMounted = true;
          state.canvasCarrierHandoffOk = true;
          state.canvasCarrierHandoffError = "";
          emit("CANVAS_MOUNT_CONFIRMED", { callback: "onMounted" });
          reconcileFromCanvasReceipt(receipt);
        },
        onRendered: (receipt) => {
          state.firstFrameDetected = true;
          state.imageRendered = true;
          emit("FIRST_FRAME_DETECTED", { callback: "onRendered" });
          reconcileFromCanvasReceipt(receipt);
        },
        onDragBound: (receipt) => {
          state.dragInspectionBound = true;
          emit("DRAG_INSPECTION_READY", { callback: "onDragBound" });
          reconcileFromCanvasReceipt(receipt);
        }
      }
    };
  }

  function callCanvasCarrier() {
    const api = getCanvasApi();
    state.canvasApiPresent = Boolean(api);

    setLane(LANE_KEYS.CANVAS, {
      state: LANE_STATE.CHECKING,
      progress: Math.max(state.lanes.canvas.progress, 25),
      subtitle: state.canvasApiPresent ? "Canvas API found" : "Canvas API pending",
      event: state.canvasApiPresent ? "CANVAS_API_FOUND" : "CANVAS_API_PENDING",
      lastEvent: state.canvasApiPresent ? "CANVAS_API_FOUND" : "CANVAS_API_PENDING"
    });

    if (!api) {
      requestCanvasScript();
      return;
    }

    if (canvasCallAttempted) {
      reconcileAll("canvas-call-already-attempted");
      return;
    }

    const method = bestCanvasMethod(api);

    if (!method) {
      state.canvasCarrierHandoffError = "Canvas API present but no supported carrier method exists.";
      state.finalReceiptAvailable = true;
      state.postgameStatus = POSTGAME_STATUS.BLOCKED_CARRIER_STRUCTURAL_FAILURE;
      state.firstFailedCoordinate = "CANVAS_METHOD_MISSING";
      state.recommendedNextRenewalTarget = "canvas-export-method-renewal";

      recordError("CANVAS_METHOD_MISSING", state.canvasCarrierHandoffError);

      setLane(LANE_KEYS.CANVAS, {
        state: LANE_STATE.FAILED,
        progress: 100,
        subtitle: "Canvas method missing",
        detail: state.canvasCarrierHandoffError,
        event: "CANVAS_METHOD_MISSING",
        lastEvent: "CANVAS_METHOD_MISSING"
      });

      return;
    }

    canvasCallAttempted = true;
    state.canvasCarrierRequested = true;
    state.canvasCarrierMethod = method;
    state.canvasCarrierHandoffError = "";
    state.postgameStatus = POSTGAME_STATUS.CANVAS_HANDOFF_IN_PROGRESS;

    setLane(LANE_KEYS.CANVAS, {
      state: LANE_STATE.LOADING,
      progress: 48,
      subtitle: `Canvas carrier method selected: ${method}`,
      detail: "Canvas boot called once. Waiting for mount / first frame.",
      event: "CANVAS_CARRIER_METHOD_SELECTED",
      lastEvent: "CANVAS_CARRIER_METHOD_SELECTED"
    });

    emit("CANVAS_CARRIER_CALLED", { method });

    try {
      const result = api[method](canvasPayload());

      state.canvasCarrierHandoffOk = true;

      setLane(LANE_KEYS.CANVAS, {
        state: LANE_STATE.LOADING,
        progress: 64,
        subtitle: "Canvas boot called; waiting for visible proof",
        event: "CANVAS_BOOT_CALLED",
        lastEvent: "CANVAS_BOOT_CALLED"
      });

      if (result && isObject(result)) {
        reconcileFromCanvasReceipt(result);
      }
    } catch (error) {
      state.canvasCarrierHandoffOk = false;
      state.canvasCarrierHandoffError = error && error.message ? error.message : String(error);
      state.finalReceiptAvailable = true;
      state.postgameStatus = POSTGAME_STATUS.BLOCKED_CARRIER_STRUCTURAL_FAILURE;
      state.firstFailedCoordinate = "CANVAS_HANDOFF_ERROR";
      state.recommendedNextRenewalTarget = "canvas-handoff-method-or-payload-renewal";

      recordError("CANVAS_HANDOFF_ERROR", state.canvasCarrierHandoffError, { method });

      setLane(LANE_KEYS.CANVAS, {
        state: LANE_STATE.FAILED,
        progress: 100,
        subtitle: "Canvas handoff failed",
        detail: state.canvasCarrierHandoffError,
        event: "CANVAS_HANDOFF_ERROR",
        lastEvent: "CANVAS_HANDOFF_ERROR"
      });
    }
  }

  function reconcileFromDataset() {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;
    const mount = nodes.mount || ensureMount();

    state.canvasMountPresent = Boolean(mount);
    state.canvasApiPresent = Boolean(getCanvasApi());
    state.runtimeTablePresent = Boolean(getRuntimeTableApi());

    state.canvasCarrierMounted = (
      state.canvasCarrierMounted ||
      bool(dataset.hearthCanvasCarrierMounted) ||
      bool(dataset.hearthVisibleCarrierMounted) ||
      Boolean(mount && mount.querySelector("canvas"))
    );

    state.dragInspectionBound = (
      state.dragInspectionBound ||
      bool(dataset.hearthDragInspectionBound) ||
      bool(dataset.hearthControlsBound) ||
      Boolean(mount && (bool(mount.dataset.hearthDragInspectionBound) || bool(mount.dataset.hearthControlsBound))) ||
      Boolean(mount && mount.style && mount.style.touchAction === "none")
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

    if (state.canvasCarrierMounted) {
      setLane(LANE_KEYS.CANVAS, {
        state: state.imageRendered ? LANE_STATE.READY : LANE_STATE.LOADING,
        progress: state.imageRendered ? 100 : 86,
        subtitle: state.imageRendered ? "Canvas mounted; first frame detected" : "Canvas mounted; waiting for first frame proof",
        detail: state.dragInspectionBound ? "Drag inspection appears bound." : "Drag inspection pending or inferred from touch-action.",
        event: state.imageRendered ? "FIRST_FRAME_DETECTED" : "CANVAS_MOUNT_CONFIRMED",
        lastEvent: state.imageRendered ? "FIRST_FRAME_DETECTED" : "CANVAS_MOUNT_CONFIRMED"
      });
    }

    if (state.dragInspectionBound) {
      emit("DRAG_INSPECTION_READY", { reason });
    }

    if (state.imageRendered || state.canvasCarrierMounted) {
      state.finalReceiptAvailable = true;

      state.postgameStatus = state.runtimeTablePresent
        ? POSTGAME_STATUS.DIAGNOSTIC_COCKPIT_READY
        : POSTGAME_STATUS.VISIBLE_CARRIER_ACTIVE_RUNTIME_TABLE_MISSING;

      state.firstFailedCoordinate = state.imageRendered
        ? "NONE_VISIBLE_CARRIER_PRESENT"
        : "FIRST_FRAME_PENDING";

      state.recommendedNextRenewalTarget = state.imageRendered
        ? "read-postgame-canvas-or-triple-g-receipt"
        : "first-frame-proof-or-canvas-receipt";

      setLane(LANE_KEYS.RECEIPT, {
        state: LANE_STATE.FINAL_READY,
        progress: 100,
        subtitle: "Final receipt available",
        detail: "Copy diagnostic remains available.",
        event: "FINAL_RECEIPT_READY",
        lastEvent: "FINAL_RECEIPT_READY"
      });

      emit("DIAGNOSTIC_COCKPIT_READY", { reason });
    }

    if (reason !== "heartbeat") {
      emit("RECONCILE", { reason });
    }

    updateMainProgressCap();
    publishGlobals();
    render();
  }

  function startProgressAnimation() {
    if (progressRaf) return;

    const loop = () => {
      const target = state.mainProgressCap;
      const diff = target - state.mainDisplayProgress;

      if (Math.abs(diff) > 0.08) {
        state.mainDisplayProgress += diff * 0.075;
      } else {
        state.mainDisplayProgress = target;
      }

      render();
      progressRaf = root.requestAnimationFrame(loop);
    };

    progressRaf = root.requestAnimationFrame(loop);
  }

  function renderLane(lane) {
    const stateName = String(lane.state || "pending").toLowerCase();
    const watchdog = state.watchdogStates[lane.key] || {};
    const detail = watchdog.text || lane.detail || "active";
    const elapsed = lane.elapsedMs || (lane.startedAtMs ? nowMs() - lane.startedAtMs : 0);

    return `
      <section class="hearth-v2-lane" data-lane="${lane.key}" data-state="${stateName}">
        <div class="hearth-v2-lane-top">
          <span class="hearth-v2-dot" aria-hidden="true"></span>
          <span class="hearth-v2-lane-title">
            <strong>${escapeHtml(lane.title)}</strong>
            <span>${escapeHtml(lane.subtitle || "")}</span>
          </span>
          <span class="hearth-v2-lane-state">${escapeHtml(lane.state)}</span>
        </div>
        <div class="hearth-v2-lane-track">
          <span class="hearth-v2-lane-fill" style="width:${clamp(lane.progress, 0, 100)}%"></span>
        </div>
        <div class="hearth-v2-lane-meta">
          <span>elapsed=${escapeHtml(formatElapsed(elapsed))}</span>
          <span>event=${escapeHtml(lane.lastEvent || "PENDING")}</span>
          <span>${escapeHtml(detail)}</span>
        </div>
      </section>
    `;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function render() {
    if (!nodes.panel) return;

    const progress = Math.round(clamp(state.mainDisplayProgress, 0, 100));
    const receiptText = getReceiptText();

    if (nodes.title) {
      nodes.title.textContent = "FORMING HEARTH RUNTIME TABLE";
    }

    if (nodes.subtitle) {
      const finalText = state.finalReceiptAvailable
        ? "Diagnostic cockpit ready. Copy the receipt before the next renewal."
        : "Live diagnostic cockpit active. Copy diagnostic is available during load.";

      nodes.subtitle.textContent = `${state.mainProgressText}. ${finalText}`;
    }

    if (nodes.latest) {
      nodes.latest.textContent = `latest=${state.latestEvent} · elapsed=${formatElapsed(state.heartbeatElapsedMs)}`;
    }

    if (nodes.mainBar) {
      nodes.mainBar.style.width = `${progress}%`;
    }

    if (nodes.mainPercent) {
      nodes.mainPercent.textContent = `${progress}%`;
    }

    if (nodes.laneArea) {
      const laneHtml = LANE_DEFINITIONS.map((definition) => renderLane(state.lanes[definition.key])).join("");
      if (laneHtml !== lastRenderText) {
        nodes.laneArea.innerHTML = laneHtml;
        lastRenderText = laneHtml;
      } else {
        nodes.laneArea.querySelectorAll(".hearth-v2-lane").forEach((laneNode) => {
          const key = laneNode.dataset.lane;
          const lane = state.lanes[key];
          if (!lane) return;

          laneNode.dataset.state = String(lane.state || "pending").toLowerCase();

          const fill = laneNode.querySelector(".hearth-v2-lane-fill");
          if (fill) fill.style.width = `${clamp(lane.progress, 0, 100)}%`;

          const stateNode = laneNode.querySelector(".hearth-v2-lane-state");
          if (stateNode) stateNode.textContent = lane.state;
        });
      }
    }

    if (nodes.receiptPre) {
      nodes.receiptPre.textContent = receiptText;
    }

    publishGlobals();
  }

  function getReceipt() {
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

      systemAlive: state.systemAlive,
      heartbeatStarted: state.heartbeatStarted,
      heartbeatElapsedMs: state.heartbeatElapsedMs,
      heartbeatText: state.heartbeatText,
      latestEvent: state.latestEvent,

      multiBarLoaderMounted: state.multiBarLoaderMounted,
      partialReceiptAvailable: state.partialReceiptAvailable,
      copyDiagnosticAvailable: state.copyDiagnosticAvailable,
      copyDiagnosticArmed: state.copyDiagnosticArmed,
      finalReceiptAvailable: state.finalReceiptAvailable,
      receiptOverlayIndependent: true,

      mainProgress: Math.round(state.mainDisplayProgress),
      mainProgressCap: state.mainProgressCap,
      mainProgressText: state.mainProgressText,

      lanes: clonePlain(state.lanes),
      laneStates: Object.fromEntries(Object.entries(state.lanes).map(([key, lane]) => [key, lane.state])),
      laneProgress: Object.fromEntries(Object.entries(state.lanes).map(([key, lane]) => [key, lane.progress])),
      laneElapsedMs: Object.fromEntries(Object.entries(state.lanes).map(([key, lane]) => [key, lane.elapsedMs])),
      laneLastEvents: Object.fromEntries(Object.entries(state.lanes).map(([key, lane]) => [key, lane.lastEvent])),
      watchdogStates: clonePlain(state.watchdogStates),

      oldLoaderNeutralized: state.oldLoaderNeutralized,
      oldLoaderNeutralizationMode: state.oldLoaderNeutralizationMode,

      runtimeTablePresent: state.runtimeTablePresent,
      runtimeTableMode: state.runtimeTableMode,
      runtimeTablePlanAttempted: state.runtimeTablePlanAttempted,
      runtimeTablePlanCreated: state.runtimeTablePlanCreated,
      runtimeTablePlanError: state.runtimeTablePlanError,
      runtimeTableOptional: true,
      runtimeTableMissingDoesNotBlockCarrier: true,

      sourceAuthorityHeld: true,

      canvasMountPresent: state.canvasMountPresent,
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

      panelMobileSafe: state.panelMobileSafe,
      buttonsReachable: state.buttonsReachable,
      mapPortalNotBlockingControls: state.mapPortalNotBlockingControls,

      coherentExpressionPass: false,
      visualPassClaimed: false,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,

      generatedImage: false,
      graphicBox: false,
      webGL: false,

      events: clonePlain(state.events),
      errors: clonePlain(state.errors),
      updatedAt: nowIso()
    };
  }

  function getReceiptText() {
    const receipt = getReceipt();

    const lanes = Object.entries(receipt.lanes).map(([key, lane]) => (
      `- ${key}: state=${lane.state}; progress=${lane.progress}; elapsed=${lane.elapsedMs}; lastEvent=${lane.lastEvent}; detail=${lane.detail || ""}`
    )).join("\n");

    const watchdogs = Object.entries(receipt.watchdogStates).map(([key, watchdog]) => (
      `- ${key}: ${watchdog.text || "none"}`
    )).join("\n");

    const events = receipt.events.map((entry) => (
      `- ${entry.at} :: ${entry.event}`
    )).join("\n") || "- none";

    const errors = receipt.errors.map((entry) => (
      `- ${entry.at} :: ${entry.code} :: ${entry.message}`
    )).join("\n") || "- none";

    return [
      "HEARTH_ROUTE_CONDUCTOR_MULTI_BAR_LIVE_LOADING_DIAGNOSTIC_RECEIPT",
      "",
      `contract=${receipt.contract}`,
      `receipt=${receipt.receipt}`,
      `previousContract=${receipt.previousContract}`,
      `baselineContract=${receipt.baselineContract}`,
      `version=${receipt.version}`,
      `route=${receipt.route}`,
      `activeRouteConductor=${receipt.activeRouteConductor}`,
      `retiredClimateRoute=${receipt.retiredClimateRoute}`,
      `retiredClimateRouteActiveCarrier=${receipt.retiredClimateRouteActiveCarrier}`,
      "",
      `systemAlive=${receipt.systemAlive}`,
      `heartbeatStarted=${receipt.heartbeatStarted}`,
      `heartbeatElapsedMs=${receipt.heartbeatElapsedMs}`,
      `heartbeatText=${receipt.heartbeatText}`,
      `latestEvent=${receipt.latestEvent}`,
      "",
      `multiBarLoaderMounted=${receipt.multiBarLoaderMounted}`,
      `partialReceiptAvailable=${receipt.partialReceiptAvailable}`,
      `copyDiagnosticAvailable=${receipt.copyDiagnosticAvailable}`,
      `copyDiagnosticArmed=${receipt.copyDiagnosticArmed}`,
      `finalReceiptAvailable=${receipt.finalReceiptAvailable}`,
      `receiptOverlayIndependent=${receipt.receiptOverlayIndependent}`,
      "",
      `mainProgress=${receipt.mainProgress}`,
      `mainProgressCap=${receipt.mainProgressCap}`,
      `mainProgressText=${receipt.mainProgressText}`,
      "",
      "LANES",
      lanes,
      "",
      "WATCHDOG_STATES",
      watchdogs,
      "",
      `oldLoaderNeutralized=${receipt.oldLoaderNeutralized}`,
      `oldLoaderNeutralizationMode=${receipt.oldLoaderNeutralizationMode}`,
      "",
      `runtimeTablePresent=${receipt.runtimeTablePresent}`,
      `runtimeTableMode=${receipt.runtimeTableMode}`,
      `runtimeTablePlanAttempted=${receipt.runtimeTablePlanAttempted}`,
      `runtimeTablePlanCreated=${receipt.runtimeTablePlanCreated}`,
      `runtimeTablePlanError=${receipt.runtimeTablePlanError}`,
      `runtimeTableOptional=${receipt.runtimeTableOptional}`,
      `runtimeTableMissingDoesNotBlockCarrier=${receipt.runtimeTableMissingDoesNotBlockCarrier}`,
      "",
      `sourceAuthorityHeld=${receipt.sourceAuthorityHeld}`,
      "",
      `canvasMountPresent=${receipt.canvasMountPresent}`,
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
      `panelMobileSafe=${receipt.panelMobileSafe}`,
      `buttonsReachable=${receipt.buttonsReachable}`,
      `mapPortalNotBlockingControls=${receipt.mapPortalNotBlockingControls}`,
      "",
      `coherentExpressionPass=${receipt.coherentExpressionPass}`,
      `visualPassClaimed=${receipt.visualPassClaimed}`,
      `postgameStatus=${receipt.postgameStatus}`,
      `firstFailedCoordinate=${receipt.firstFailedCoordinate}`,
      `recommendedNextRenewalTarget=${receipt.recommendedNextRenewalTarget}`,
      "",
      `generatedImage=${receipt.generatedImage}`,
      `graphicBox=${receipt.graphicBox}`,
      `webGL=${receipt.webGL}`,
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
      `updatedAt=${receipt.updatedAt}`,
      "",
      "EVENTS",
      events,
      "",
      "ERRORS",
      errors
    ].join("\n");
  }

  async function copyDiagnostic() {
    const text = getReceiptText();

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

      if (nodes.copyButton) {
        const original = nodes.copyButton.textContent;
        nodes.copyButton.textContent = "Copied";
        root.setTimeout(() => {
          nodes.copyButton.textContent = original || "Copy diagnostic";
        }, 1100);
      }

      emit("DIAGNOSTIC_RECEIPT_COPIED", {
        partialReceiptAvailable: state.partialReceiptAvailable,
        finalReceiptAvailable: state.finalReceiptAvailable
      });
    } catch (error) {
      recordError("COPY_DIAGNOSTIC_FAILED", error && error.message ? error.message : String(error));
    }
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

    dataset.hearthSystemAlive = String(state.systemAlive);
    dataset.hearthHeartbeatStarted = String(state.heartbeatStarted);
    dataset.hearthHeartbeatElapsedMs = String(state.heartbeatElapsedMs);
    dataset.hearthMultiBarLoaderMounted = String(state.multiBarLoaderMounted);
    dataset.hearthPartialReceiptAvailable = String(state.partialReceiptAvailable);
    dataset.hearthCopyDiagnosticAvailable = String(state.copyDiagnosticAvailable);
    dataset.hearthCopyDiagnosticArmed = String(state.copyDiagnosticArmed);
    dataset.hearthFinalReceiptAvailable = String(state.finalReceiptAvailable);

    dataset.hearthMainProgress = String(Math.round(state.mainDisplayProgress));
    dataset.hearthMainProgressCap = String(state.mainProgressCap);
    dataset.hearthMainProgressText = state.mainProgressText;

    dataset.hearthOldLoaderNeutralized = String(state.oldLoaderNeutralized);
    dataset.hearthOldLoaderNeutralizationMode = state.oldLoaderNeutralizationMode;

    dataset.hearthRuntimeTablePresent = String(state.runtimeTablePresent);
    dataset.hearthRuntimeTableMode = state.runtimeTableMode;
    dataset.hearthRuntimeTablePlanAttempted = String(state.runtimeTablePlanAttempted);
    dataset.hearthRuntimeTablePlanCreated = String(state.runtimeTablePlanCreated);
    dataset.hearthRuntimeTableMissingDoesNotBlockCarrier = "true";

    dataset.hearthSourceAuthorityHeld = "true";

    dataset.hearthCanvasMountPresent = String(state.canvasMountPresent);
    dataset.hearthCanvasApiPresent = String(state.canvasApiPresent);
    dataset.hearthCanvasCarrierRequested = String(state.canvasCarrierRequested);
    dataset.hearthCanvasCarrierMounted = String(state.canvasCarrierMounted);
    dataset.hearthCanvasCarrierHandoffOk = String(state.canvasCarrierHandoffOk);
    dataset.hearthCanvasCarrierMethod = state.canvasCarrierMethod;
    dataset.hearthFirstFrameDetected = String(state.firstFrameDetected);
    dataset.hearthDragInspectionBound = String(state.dragInspectionBound);
    dataset.hearthImageRendered = String(state.imageRendered);

    dataset.hearthPanelMobileSafe = String(state.panelMobileSafe);
    dataset.hearthButtonsReachable = String(state.buttonsReachable);
    dataset.hearthReceiptOverlayIndependent = "true";

    dataset.hearthCoherentExpressionPass = "false";
    dataset.hearthVisualPassClaimed = "false";
    dataset.hearthPostgameStatus = state.postgameStatus;
    dataset.hearthFirstFailedCoordinate = state.firstFailedCoordinate;
    dataset.hearthRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  function boot() {
    emit("CONDUCTOR_V2_STARTED", { contract: CONTRACT });

    guardRetiredClimateRoute();
    ensureMount();
    startHeartbeat();
    mountLoader();

    setLane(LANE_KEYS.CONDUCTOR, {
      state: LANE_STATE.LOADING,
      progress: 28,
      subtitle: "Conductor active; old loader guarded",
      detail: "Live diagnostic and partial receipt are available.",
      event: "CONDUCTOR_LANE_STARTED",
      lastEvent: "CONDUCTOR_LANE_STARTED",
      forceEvent: true
    });

    checkRuntimeTable();

    setLane(LANE_KEYS.CONDUCTOR, {
      state: state.runtimeTablePresent ? LANE_STATE.READY : LANE_STATE.DEGRADED,
      progress: state.runtimeTablePresent ? 100 : 82,
      subtitle: state.runtimeTablePresent ? "Conductor ready" : "Conductor ready; Runtime Table degraded",
      detail: "Source stack held. Canvas lane is separate.",
      event: state.runtimeTablePresent ? "CONDUCTOR_READY" : "CONDUCTOR_READY_DEGRADED",
      lastEvent: state.runtimeTablePresent ? "CONDUCTOR_READY" : "CONDUCTOR_READY_DEGRADED"
    });

    setLane(LANE_KEYS.CANVAS, {
      state: LANE_STATE.CHECKING,
      progress: 18,
      subtitle: "Canvas lane started",
      event: "CANVAS_LANE_STARTED",
      lastEvent: "CANVAS_LANE_STARTED",
      forceEvent: true
    });

    callCanvasCarrier();

    startProgressAnimation();

    if (reconcileTimer) root.clearInterval(reconcileTimer);
    reconcileTimer = root.setInterval(() => reconcileAll("interval"), 800);

    [120, 300, 700, 1300, 2400, 4200, 6800, 10000].forEach((ms) => {
      root.setTimeout(() => reconcileAll(`post-boot-${ms}ms`), ms);
    });

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

    if (progressRaf) {
      root.cancelAnimationFrame(progressRaf);
      progressRaf = 0;
    }

    if (nodes.overlay && nodes.overlay.parentNode) {
      nodes.overlay.parentNode.removeChild(nodes.overlay);
    }

    emit("CONDUCTOR_V2_DISPOSED", { reason });
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
    getReceipt,
    getReceiptText,
    copyDiagnostic,
    dispose,

    supportsMultiBarLiveLoadingDiagnostic: true,
    supportsHeartbeat: true,
    supportsPartialReceiptDuringLoading: true,
    supportsCopyDiagnosticDuringLoading: true,
    supportsWatchdogStatus: true,
    supportsStaleLoaderNeutralization: true,
    supportsMobileSafePanel: true,
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

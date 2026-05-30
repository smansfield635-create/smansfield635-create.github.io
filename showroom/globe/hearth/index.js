// /showroom/globe/hearth/index.js
// HEARTH_EAST_STEP1_IGNITION_FIRST_PAINT_CYCLE_TNT_v1
// Full-file replacement.
// East authority only.
// Purpose:
// - Own Step 1 ignition, first paint, mount certainty, loading cockpit creation, early shared ledger, and script-order visibility.
// - Start the Hearth directional cycle: EAST -> WEST -> NORTH -> SOUTH -> CHECKPOINT -> EAST.
// - Load / confirm the downstream West, North, and South files without taking over their authority.
// - Publish a Step 1 handoff receipt for West.
// - Preserve partial diagnostic, copy receipt, show receipt, inspect reservation, and first-paint progress.
// Does not own:
// - West handoff admissibility / receipt normalization
// - North command runtime table / checkpoint law / NEWS Fibonacci governance
// - South visible completion / canvas coordination / visible proof / F21 latch
// - canvas pixel drawing
// - source-stack truth
// - final diagnostic receipt authority
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_EAST_STEP1_IGNITION_FIRST_PAINT_CYCLE_TNT_v1";
  const RECEIPT = "HEARTH_EAST_STEP1_IGNITION_FIRST_PAINT_CYCLE_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_INDEX_CONSTRAINT_SEMICONDUCTOR_FIRST_PAINT_LEDGER_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_DIRECTIONAL_CYCLICAL_CHECKPOINT_GOVERNANCE_PRECODE_FINAL_DRAFT_v1";
  const VERSION = "2026-05-29.hearth-east-step1-ignition-first-paint-cycle-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const ROUTE = "/showroom/globe/hearth/";
  const EAST_FILE = "/showroom/globe/hearth/index.js";
  const WEST_FILE = "/assets/hearth/hearth.west.index-handoff.table.js";
  const NORTH_FILE = "/assets/hearth/hearth.north.command.runtime-table.js";
  const SOUTH_FILE = "/showroom/globe/hearth/hearth.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const RETIRED_CLIMATE_FILE = "/showroom/globe/hearth/hearth.climate.route.js";

  const MOUNT_ID = "hearthCanvasMount";
  const COCKPIT_ID = "hearthLoadCockpit";
  const STATUS_ID = "hearth-route-status";

  const DOWNSTREAM_FILES = Object.freeze([
    { key: "west", direction: "WEST", file: WEST_FILE, globalNames: ["HEARTH_WEST_INDEX_HANDOFF_TABLE", "HEARTH_WEST_HANDOFF_ADMISSIBILITY", "HEARTH_WEST_CYCLE_HANDOFF"] },
    { key: "north", direction: "NORTH", file: NORTH_FILE, globalNames: ["HEARTH_NORTH_COMMAND_RUNTIME_TABLE", "HEARTH_NORTH_COMMAND_TABLE", "HEARTH_NORTH_COMMAND"] },
    { key: "south", direction: "SOUTH", file: SOUTH_FILE, globalNames: ["HEARTH_SOUTH_VISIBLE_COMPLETION", "HEARTH_SOUTH_VISIBLE_COMPLETION_CYCLE_CONSUMER", "HEARTH_ROUTE_CONDUCTOR", "HearthRouteConductor"] }
  ]);

  const LANES = Object.freeze([
    { key: "eastShell", label: "East shell", fibonacci: "F1A", progress: 6 },
    { key: "eastLedger", label: "East ledger", fibonacci: "F1B", progress: 12 },
    { key: "eastFirstPaint", label: "East first paint", fibonacci: "F2", progress: 22 },
    { key: "eastScriptOrder", label: "East script order", fibonacci: "F3", progress: 36 },
    { key: "westHandoff", label: "West handoff", fibonacci: "F5", progress: 48 },
    { key: "northCommand", label: "North command table", fibonacci: "F8", progress: 62 },
    { key: "southVisible", label: "South visible completion", fibonacci: "F13", progress: 72 },
    { key: "cycleCheckpoint", label: "Cycle checkpoint", fibonacci: "F21", progress: 98 }
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: EAST_FILE,
    route: ROUTE,
    role: "east-step1-ignition-first-paint-cycle",

    pairedSemiconductor: true,
    pairedWith: SOUTH_FILE,
    cycleOrder: "EAST -> WEST -> NORTH -> SOUTH -> CHECKPOINT -> EAST",

    ownsEast: true,
    ownsWest: false,
    ownsNorth: false,
    ownsSouth: false,
    ownsStep1: true,
    ownsFirstPaintSurvival: true,
    ownsMountCertainty: true,
    ownsLoadingScreenCertainty: true,
    ownsEarlyLedger: true,
    ownsScriptOrderVisibility: true,
    ownsStep1HandoffPublication: true,

    ownsWestHandoffAdmissibility: false,
    ownsNorthRuntimeTable: false,
    ownsCheckpointLaw: false,
    ownsNewsFibonacciGovernance: false,
    ownsCanvasCoordination: false,
    ownsCanvasDrawing: false,
    ownsVisiblePlanetProof: false,
    ownsInspectModeTruth: false,
    ownsCompletionLatch: false,
    ownsFinalDiagnosticReceipt: false,
    ownsFinalVisualPassClaim: false,

    eastFile: EAST_FILE,
    westFile: WEST_FILE,
    northFile: NORTH_FILE,
    southFile: SOUTH_FILE,
    canvasFile: CANVAS_FILE,

    mountReady: false,
    mountCreatedByEast: false,
    cockpitReady: false,
    cockpitCreatedByEast: false,
    loadingScreenReady: false,
    firstPaintReady: false,
    visibleProgressStripReady: false,

    sharedLedgerPresent: false,
    sharedLedgerCreatedByEast: false,
    partialReceiptAvailable: false,
    copyPartialDiagnosticReady: false,
    receiptToggleReady: false,
    inspectControlReserved: false,
    showDiagnosticRestoreReserved: false,

    step1Ignited: false,
    step1Ready: false,
    step1HandoffPublished: false,
    step1HandoffAcceptedByWest: false,
    step1HandoffAcceptedAt: "",

    westPresent: false,
    westScriptPresent: false,
    westScriptRequested: false,
    westScriptLoaded: false,
    westContract: "",
    westReceiptPresent: false,
    westReceiptError: "",

    northPresent: false,
    northScriptPresent: false,
    northScriptRequested: false,
    northScriptLoaded: false,
    northContract: "",
    northReceiptPresent: false,
    northReceiptError: "",

    southPresent: false,
    southScriptPresent: false,
    southScriptRequested: false,
    southScriptLoaded: false,
    southContract: "",
    southReceiptPresent: false,
    southReceiptError: "",

    downstreamLoadAttempted: false,
    downstreamLoadComplete: false,
    downstreamLoadErrors: [],

    currentStage: "F1A",
    highestStage: "F1A",
    displayProgress: 6,
    latestEvent: "EAST_STEP1_IGNITION_LOADED",
    postgameStatus: "EAST_LOADED_NOT_BOOTED",
    firstFailedCoordinate: "EAST_STEP1_NOT_STARTED",
    recommendedNextRenewalTarget: EAST_FILE,

    planetCanvasPresent: false,
    planetCanvasNonZeroSize: false,
    visiblePlanetHintPresent: false,
    inspectModeReservedActive: false,
    showDiagnosticTabVisible: false,

    climateRouteRetired: true,
    runtimeTableRequiredForFirstRender: false,
    sourceStackRequiredForFirstRender: false,
    wideProbeDeferred: true,

    eastRuntimeTableMutation: false,
    canvasMutation: false,
    sourceAuthorityHeld: true,

    localEvents: [],
    scriptEvents: [],
    errors: [],

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    startedAt: "",
    updatedAt: ""
  };

  const refs = {
    mount: null,
    cockpit: null,
    title: null,
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
    inspectButton: null,
    expandButton: null,
    showTab: null,
    ledger: null
  };

  let bootStarted = false;
  let renderTimer = 0;
  let heartbeatTimer = 0;
  let watchdogTimer = 0;

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

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
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

  function recordLocal(event, detail = {}) {
    const item = {
      at: nowIso(),
      event,
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    if (state.localEvents.length > 180) {
      state.localEvents.splice(0, state.localEvents.length - 180);
    }

    state.latestEvent = event;
    state.updatedAt = item.at;
    return item;
  }

  function recordScript(event, detail = {}) {
    const item = {
      at: nowIso(),
      event,
      detail: clonePlain(detail)
    };

    state.scriptEvents.push(item);
    if (state.scriptEvents.length > 180) {
      state.scriptEvents.splice(0, state.scriptEvents.length - 180);
    }

    return item;
  }

  function recordError(code, message, detail = {}) {
    const item = {
      at: nowIso(),
      code,
      message: String(message || ""),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    if (state.errors.length > 80) {
      state.errors.splice(0, state.errors.length - 80);
    }

    return item;
  }

  function getGlobalByNames(names) {
    for (const name of names) {
      if (root[name]) return root[name];
    }
    return null;
  }

  function getWestApi() {
    return getGlobalByNames(["HEARTH_WEST_INDEX_HANDOFF_TABLE", "HEARTH_WEST_HANDOFF_ADMISSIBILITY", "HEARTH_WEST_CYCLE_HANDOFF"]);
  }

  function getNorthApi() {
    return getGlobalByNames(["HEARTH_NORTH_COMMAND_RUNTIME_TABLE", "HEARTH_NORTH_COMMAND_TABLE", "HEARTH_NORTH_COMMAND"]);
  }

  function getSouthApi() {
    return getGlobalByNames(["HEARTH_SOUTH_VISIBLE_COMPLETION", "HEARTH_SOUTH_VISIBLE_COMPLETION_CYCLE_CONSUMER", "HEARTH_ROUTE_CONDUCTOR", "HearthRouteConductor"]);
  }

  function getWestReceipt() {
    return (
      root.HEARTH_WEST_HANDOFF_ADMISSIBILITY_RECEIPT ||
      root.HEARTH_WEST_INDEX_HANDOFF_TABLE_RECEIPT ||
      null
    );
  }

  function getNorthReceipt() {
    return (
      root.HEARTH_NORTH_COMMAND_RUNTIME_TABLE_RECEIPT ||
      root.HEARTH_NORTH_CYCLICAL_CHECKPOINT_RECEIPT ||
      null
    );
  }

  function getSouthReceipt() {
    return (
      root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT ||
      root.HEARTH_ROUTE_COHERENCE_SEMICONDUCTOR_RECEIPT ||
      root.HEARTH_ROUTE_CONDUCTOR_RECEIPT ||
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

  function stageProgress(stage) {
    const found = LANES.find((lane) => lane.fibonacci === stage);
    return found ? found.progress : 0;
  }

  function ensureLedger() {
    const existing = root.HEARTH_LOAD_LEDGER;
    const ledger = existing && isObject(existing) ? existing : {};
    const led = isObject(ledger.state) ? ledger.state : ledger;

    ledger.state = led;
    led.contract = led.contract || "HEARTH_DIRECTIONAL_CYCLE_SHARED_LOAD_LEDGER_v1";
    led.createdBy = led.createdBy || CONTRACT;
    led.ownerModel = "directional-cycle";
    led.cycleOrder = state.cycleOrder;
    led.eastFile = EAST_FILE;
    led.westFile = WEST_FILE;
    led.northFile = NORTH_FILE;
    led.southFile = SOUTH_FILE;
    led.route = ROUTE;
    led.startedAt = led.startedAt || nowIso();
    led.updatedAt = nowIso();
    led.currentStage = led.currentStage || "F1A";
    led.highestStage = led.highestStage || "F1A";
    led.eastOwnsStep1 = true;
    led.westOwnsHandoff = true;
    led.northOwnsCheckpointLaw = true;
    led.southOwnsVisibleCompletion = true;
    led.indexOwnsFinalCompletion = false;
    led.visualPassClaimed = false;
    led.events = Array.isArray(led.events) ? led.events : [];
    led.errors = Array.isArray(led.errors) ? led.errors : [];
    led.scripts = isObject(led.scripts) ? led.scripts : {};
    led.lanes = isObject(led.lanes) ? led.lanes : {};
    led.listeners = Array.isArray(led.listeners) ? led.listeners : [];

    LANES.forEach((lane) => {
      if (!isObject(led.lanes[lane.key])) {
        led.lanes[lane.key] = {
          key: lane.key,
          label: lane.label,
          fibonacci: lane.fibonacci,
          status: "PENDING",
          message: `${lane.label} pending.`,
          progress: lane.progress,
          latestEvent: "LANE_INITIALIZED",
          owner: "EAST",
          file: EAST_FILE,
          updatedAt: nowIso()
        };
      }
    });

    ledger.push = function push(event = {}) {
      const evt = {
        id: event.id || event.event || "LEDGER_EVENT",
        stage: event.stage || led.currentStage || state.currentStage,
        lane: event.lane || "",
        status: event.status || "",
        owner: event.owner || "EAST",
        file: event.file || EAST_FILE,
        message: event.message || "",
        detail: clonePlain(event.detail || {}),
        progress: event.progress ?? "",
        timestamp: nowIso()
      };

      led.events.push(evt);
      if (led.events.length > 320) {
        led.events.splice(0, led.events.length - 320);
      }

      led.updatedAt = evt.timestamp;
      notifyLedger();

      return evt;
    };

    ledger.setStage = function setStage(stage, message = "", options = {}) {
      led.currentStage = stage;
      led.highestStage = stage;
      state.currentStage = stage;
      state.highestStage = stage;

      ledger.push({
        id: `STAGE_${stage}`,
        stage,
        lane: options.lane || "eastLedger",
        status: options.status || "READY",
        owner: options.owner || "EAST",
        file: options.file || EAST_FILE,
        message: message || stage,
        progress: stageProgress(stage),
        detail: options.detail || {}
      });

      return stage;
    };

    ledger.setLane = function setLane(key, next = {}) {
      const lane = led.lanes[key] || {
        key,
        label: key,
        fibonacci: next.stage || "F1A",
        status: "PENDING",
        message: "",
        progress: 0,
        latestEvent: "LANE_CREATED",
        owner: "EAST",
        file: EAST_FILE,
        updatedAt: nowIso()
      };

      lane.status = next.status || lane.status;
      lane.message = next.message || lane.message;
      lane.progress = Math.max(Number(lane.progress || 0), Number(next.progress ?? lane.progress ?? 0));
      lane.latestEvent = next.event || next.latestEvent || lane.latestEvent;
      lane.owner = next.owner || lane.owner || "EAST";
      lane.file = next.file || lane.file || EAST_FILE;
      lane.fibonacci = next.stage || lane.fibonacci;
      lane.updatedAt = nowIso();
      led.lanes[key] = lane;

      ledger.push({
        id: lane.latestEvent,
        stage: lane.fibonacci,
        lane: key,
        status: lane.status,
        owner: lane.owner,
        file: lane.file,
        message: lane.message,
        progress: lane.progress,
        detail: next.detail || {}
      });

      return lane;
    };

    ledger.setScript = function setScript(key, next = {}) {
      const script = led.scripts[key] || {
        key,
        src: next.src || "",
        direction: next.direction || "",
        status: "PENDING",
        error: "",
        requestedAt: "",
        loadedAt: "",
        globalPresent: false,
        updatedAt: nowIso()
      };

      script.src = next.src || script.src;
      script.direction = next.direction || script.direction;
      script.status = next.status || script.status;
      script.error = next.error || "";
      script.globalPresent = Boolean(next.globalPresent);
      script.requestedAt = next.requestedAt || script.requestedAt;
      script.loadedAt = next.loadedAt || script.loadedAt;
      script.updatedAt = nowIso();
      led.scripts[key] = script;

      ledger.push({
        id: `SCRIPT_${String(key).toUpperCase()}_${script.status}`,
        stage: "F3",
        lane: "eastScriptOrder",
        status: script.status,
        owner: "EAST",
        file: EAST_FILE,
        message: `${key} ${script.status}`,
        detail: { src: script.src, direction: script.direction, error: script.error, globalPresent: script.globalPresent }
      });

      return script;
    };

    ledger.bindRenderer = function bindRenderer(fn) {
      if (isFunction(fn)) led.listeners.push(fn);
      return led.listeners.length;
    };

    ledger.getReceipt = function getSharedReceipt() {
      return clonePlain(led);
    };

    ledger.getReceiptText = function getSharedReceiptText() {
      return getReceiptText();
    };

    root.HEARTH_LOAD_LEDGER = ledger;
    refs.ledger = ledger;

    state.sharedLedgerPresent = true;
    state.sharedLedgerCreatedByEast = led.createdBy === CONTRACT;

    return ledger;
  }

  function notifyLedger() {
    const led = refs.ledger && refs.ledger.state ? refs.ledger.state : null;
    if (!led || !Array.isArray(led.listeners)) return;

    led.listeners = led.listeners.filter((fn) => {
      try {
        fn(clonePlain(led));
        return true;
      } catch (_error) {
        return false;
      }
    });

    scheduleRender();
  }

  function ensureStyle() {
    if (!doc || doc.getElementById("hearth-east-step1-cycle-style")) return;

    const style = doc.createElement("style");
    style.id = "hearth-east-step1-cycle-style";
    style.textContent = `
      #hearthCanvasMount,
      [data-hearth-canvas-mount="true"]{
        position:relative;
        overflow:hidden;
        touch-action:none;
        user-select:none;
        -webkit-user-select:none;
        -webkit-touch-callout:none;
      }

      .hearth-ledger-cockpit{
        position:absolute;
        inset:10px;
        z-index:30;
        display:flex;
        flex-direction:column;
        max-height:calc(100% - 20px);
        min-height:170px;
        overflow:hidden;
        border:1px solid rgba(231,188,105,.34);
        border-radius:24px;
        background:
          radial-gradient(circle at 12% 0%,rgba(231,188,105,.16),transparent 20rem),
          radial-gradient(circle at 90% 18%,rgba(141,216,255,.12),transparent 22rem),
          linear-gradient(180deg,rgba(7,18,33,.92),rgba(2,8,17,.82));
        color:rgba(238,246,255,.94);
        box-shadow:0 22px 70px rgba(0,0,0,.44), inset 0 1px 0 rgba(255,255,255,.08);
        backdrop-filter:blur(10px);
        font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        transition:max-height .22s ease,opacity .18s ease,visibility .18s ease,transform .22s ease;
      }

      .hearth-ledger-head{
        display:grid;
        gap:6px;
        padding:14px 16px 10px;
        border-bottom:1px solid rgba(231,188,105,.14);
      }

      .hearth-ledger-kicker{
        color:#e7bc69;
        font-weight:950;
        font-size:.64rem;
        letter-spacing:.15em;
        text-transform:uppercase;
      }

      .hearth-ledger-title{
        margin:0;
        color:rgba(255,244,216,.98);
        font-weight:950;
        font-size:clamp(1.08rem,3.4vw,1.65rem);
        line-height:1;
        letter-spacing:-.045em;
      }

      .hearth-ledger-meta,
      .hearth-ledger-latest{
        color:rgba(238,246,255,.68);
        font-size:.72rem;
        font-weight:760;
        line-height:1.28;
      }

      .hearth-ledger-progress{
        display:grid;
        grid-template-columns:1fr auto;
        align-items:center;
        gap:10px;
        padding:10px 16px;
        border-bottom:1px solid rgba(231,188,105,.12);
      }

      .hearth-ledger-track,
      .hearth-ledger-lane-track{
        position:relative;
        height:9px;
        overflow:hidden;
        border:1px solid rgba(141,216,255,.18);
        border-radius:999px;
        background:rgba(255,255,255,.055);
      }

      .hearth-ledger-fill,
      .hearth-ledger-lane-fill{
        position:absolute;
        inset:0 auto 0 0;
        width:0%;
        border-radius:inherit;
        background:linear-gradient(90deg,rgba(141,216,255,.80),rgba(231,188,105,.96));
        box-shadow:0 0 18px rgba(231,188,105,.18);
        transition:width .24s ease;
      }

      .hearth-ledger-percent{
        min-width:44px;
        color:#ffe8a3;
        font-weight:950;
        font-size:.72rem;
        text-align:right;
      }

      .hearth-ledger-actions{
        display:flex;
        flex-wrap:wrap;
        gap:7px;
        padding:10px 16px;
        border-bottom:1px solid rgba(231,188,105,.12);
      }

      .hearth-ledger-button{
        min-height:31px;
        border:1px solid rgba(231,188,105,.26);
        border-radius:999px;
        padding:7px 10px;
        color:rgba(238,246,255,.84);
        background:rgba(255,255,255,.045);
        font:900 .64rem/1 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        letter-spacing:.07em;
        text-transform:uppercase;
        cursor:pointer;
      }

      .hearth-ledger-button.primary{
        color:#06101e;
        border-color:rgba(231,188,105,.86);
        background:linear-gradient(135deg,#ffe8a3,#e7bc69);
      }

      .hearth-ledger-scroll{
        min-height:0;
        overflow:auto;
        padding:10px 16px 14px;
      }

      .hearth-ledger-lanes{
        display:grid;
        gap:7px;
      }

      .hearth-ledger-lane{
        display:grid;
        gap:5px;
        border:1px solid rgba(255,255,255,.08);
        border-radius:13px;
        padding:8px;
        background:rgba(255,255,255,.035);
      }

      .hearth-ledger-lane-top{
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:8px;
      }

      .hearth-ledger-lane-title{
        display:grid;
        gap:2px;
        min-width:0;
        color:rgba(238,246,255,.64);
        font-size:.66rem;
        line-height:1.22;
      }

      .hearth-ledger-lane-title strong{
        color:rgba(255,244,216,.94);
        font-size:.70rem;
      }

      .hearth-ledger-lane-status{
        flex:0 0 auto;
        color:#8dd8ff;
        font-size:.60rem;
        font-weight:950;
        letter-spacing:.09em;
        text-transform:uppercase;
      }

      .hearth-ledger-receipt{
        display:none;
        margin-top:10px;
        border:1px solid rgba(231,188,105,.16);
        border-radius:14px;
        background:rgba(0,0,0,.24);
      }

      .hearth-ledger-receipt[data-visible="true"]{
        display:block;
      }

      .hearth-ledger-receipt pre{
        margin:0;
        max-height:260px;
        overflow:auto;
        padding:10px;
        color:rgba(238,246,255,.72);
        white-space:pre-wrap;
        font:700 .66rem/1.38 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="planet-inspect"]{
        opacity:0!important;
        visibility:hidden!important;
        pointer-events:none!important;
        transform:translateY(24px) scale(.985);
        max-height:0!important;
        min-height:0!important;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"]{
        inset:auto 10px 10px 10px!important;
        min-height:132px!important;
        max-height:186px!important;
        overflow:hidden!important;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-scroll{
        display:none!important;
      }

      [data-hearth-east-show-diagnostic-tab]{
        position:fixed;
        right:max(12px,env(safe-area-inset-right));
        bottom:max(72px,calc(env(safe-area-inset-bottom) + 72px));
        z-index:9999;
        display:none;
        min-height:36px;
        padding:9px 13px;
        border-radius:999px;
        border:1px solid rgba(231,188,105,.65);
        color:#06101e;
        background:linear-gradient(135deg,#ffe8a3,#e7bc69);
        box-shadow:0 14px 40px rgba(0,0,0,.36);
        font:950 .68rem/1 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        letter-spacing:.08em;
        text-transform:uppercase;
        cursor:pointer;
      }

      html[data-hearth-east-inspect-reserved-active="true"] [data-hearth-east-show-diagnostic-tab]{
        display:inline-flex;
      }

      @media (max-width:760px){
        .hearth-ledger-cockpit{
          inset:8px;
          min-height:166px;
          border-radius:20px;
        }

        .hearth-ledger-head{
          padding:12px 12px 8px;
        }

        .hearth-ledger-progress,
        .hearth-ledger-actions,
        .hearth-ledger-scroll{
          padding-left:12px;
          padding-right:12px;
        }

        .hearth-ledger-button{
          flex:1 1 auto;
          min-width:30%;
          font-size:.58rem;
        }
      }
    `;

    doc.head.appendChild(style);
  }

  function ensureMount() {
    if (!doc) return null;

    let mount =
      doc.getElementById(MOUNT_ID) ||
      doc.querySelector("[data-hearth-canvas-mount='true']") ||
      doc.querySelector("[data-hearth-canvas-mount]");

    if (!mount) {
      mount = doc.createElement("section");
      mount.id = MOUNT_ID;
      mount.dataset.hearthCanvasMount = "true";
      mount.dataset.hearthMountCreatedByEast = CONTRACT;

      const parent = doc.getElementById("hearth-main") || doc.body || doc.documentElement;
      parent.appendChild(mount);

      state.mountCreatedByEast = true;
    }

    mount.id = MOUNT_ID;
    mount.dataset.hearthCanvasMount = "true";
    mount.dataset.hearthEastStep1Ignition = CONTRACT;
    mount.dataset.hearthEastReceipt = RECEIPT;
    mount.dataset.hearthCycleEast = "true";
    mount.dataset.hearthCycleOrder = state.cycleOrder;
    mount.dataset.hearthEastFile = EAST_FILE;
    mount.dataset.hearthWestFile = WEST_FILE;
    mount.dataset.hearthNorthFile = NORTH_FILE;
    mount.dataset.hearthSouthFile = SOUTH_FILE;
    mount.dataset.runtimeTableRequiredForFirstRender = "false";
    mount.dataset.sourceStackRequiredForFirstRender = "false";
    mount.dataset.wideProbeDeferred = "true";
    mount.dataset.generatedImage = "false";
    mount.dataset.graphicBox = "false";
    mount.dataset.webgl = "false";
    mount.dataset.visualPassClaimed = "false";

    mount.style.position = mount.style.position || "relative";
    mount.style.overflow = "hidden";
    mount.style.touchAction = "none";
    mount.style.userSelect = "none";
    mount.style.webkitUserSelect = "none";
    mount.style.webkitTouchCallout = "none";

    refs.mount = mount;
    state.mountReady = true;

    return mount;
  }

  function ensureShowTab() {
    if (!doc) return null;

    let tab =
      doc.querySelector("[data-hearth-east-show-diagnostic-tab]") ||
      doc.querySelector("[data-hearth-index-show-diagnostic-tab]") ||
      doc.querySelector("[data-hearth-south-show-diagnostic-tab]");

    if (!tab) {
      tab = doc.createElement("button");
      tab.type = "button";
      tab.dataset.hearthEastShowDiagnosticTab = "true";
      tab.textContent = "Show diagnostic";
      tab.setAttribute("aria-label", "Show Hearth diagnostic");
      doc.body.appendChild(tab);
    }

    tab.dataset.hearthEastShowDiagnosticTab = "true";
    tab.onclick = () => setInspectReserved(false);

    refs.showTab = tab;
    state.showDiagnosticRestoreReserved = true;

    return tab;
  }

  function ensureCockpit() {
    if (!doc) return null;

    const mount = ensureMount();
    if (!mount) return null;

    ensureStyle();
    ensureShowTab();

    let cockpit =
      mount.querySelector("[data-hearth-load-cockpit='true']") ||
      mount.querySelector("[data-hearth-first-paint-cockpit='true']") ||
      doc.getElementById(COCKPIT_ID);

    if (!cockpit) {
      cockpit = doc.createElement("aside");
      cockpit.id = COCKPIT_ID;
      cockpit.className = "hearth-ledger-cockpit";
      cockpit.dataset.hearthLoadCockpit = "true";
      cockpit.dataset.hearthFirstPaintCockpit = "true";
      cockpit.dataset.hearthCreatedByEastStep1Ignition = CONTRACT;
      cockpit.dataset.cockpitMode = "first-paint-loading";
      cockpit.setAttribute("aria-live", "polite");

      cockpit.innerHTML = `
        <div class="hearth-ledger-head">
          <div class="hearth-ledger-kicker">Hearth · East Step 1 Ignition</div>
          <h2 class="hearth-ledger-title">STARTING HEARTH DIRECTIONAL CYCLE</h2>
          <div class="hearth-ledger-meta" data-hearth-stage-label>F1A · East shell rendered</div>
          <div class="hearth-ledger-meta" data-hearth-heartbeat-text>east=true · first paint active</div>
          <div class="hearth-ledger-latest" data-hearth-latest-event>latest=EAST_STEP1_IGNITION_LOADED</div>
        </div>

        <div class="hearth-ledger-progress" data-hearth-index-progress-strip="true">
          <div class="hearth-ledger-track">
            <span class="hearth-ledger-fill" data-hearth-main-progress-fill style="width:6%"></span>
          </div>
          <div class="hearth-ledger-percent" data-hearth-main-progress-percent>6%</div>
        </div>

        <div class="hearth-ledger-actions">
          <button class="hearth-ledger-button primary" type="button" data-hearth-copy-diagnostic>Copy diagnostic</button>
          <button class="hearth-ledger-button" type="button" data-hearth-toggle-receipt>Show receipt</button>
          <button class="hearth-ledger-button" type="button" data-hearth-inspect-planet>Inspect planet</button>
          <button class="hearth-ledger-button" type="button" data-hearth-collapse-cockpit>Expand cockpit</button>
        </div>

        <div class="hearth-ledger-scroll">
          <div class="hearth-ledger-lanes" data-hearth-lane-list></div>
          <div class="hearth-ledger-receipt" data-hearth-receipt-box data-visible="false">
            <pre data-hearth-receipt-text></pre>
          </div>
        </div>
      `;

      mount.appendChild(cockpit);
      state.cockpitCreatedByEast = true;
    }

    cockpit.dataset.hearthEastStep1Ignition = CONTRACT;
    cockpit.dataset.hearthEastReceipt = RECEIPT;
    cockpit.dataset.hearthCycleEast = "true";
    cockpit.dataset.hearthCycleOrder = state.cycleOrder;
    cockpit.dataset.hearthWestFile = WEST_FILE;
    cockpit.dataset.hearthNorthFile = NORTH_FILE;
    cockpit.dataset.hearthSouthFile = SOUTH_FILE;
    cockpit.dataset.generatedImage = "false";
    cockpit.dataset.graphicBox = "false";
    cockpit.dataset.webgl = "false";
    cockpit.dataset.visualPassClaimed = "false";

    refs.cockpit = cockpit;
    refs.title = cockpit.querySelector(".hearth-ledger-title");
    refs.stage = cockpit.querySelector("[data-hearth-stage-label]");
    refs.heartbeat = cockpit.querySelector("[data-hearth-heartbeat-text]");
    refs.latest = cockpit.querySelector("[data-hearth-latest-event]");
    refs.mainFill = cockpit.querySelector("[data-hearth-main-progress-fill]");
    refs.mainPercent = cockpit.querySelector("[data-hearth-main-progress-percent]");
    refs.laneList = cockpit.querySelector("[data-hearth-lane-list]");
    refs.receiptBox = cockpit.querySelector("[data-hearth-receipt-box]");
    refs.receiptPre = cockpit.querySelector("[data-hearth-receipt-text]");
    refs.copyButton = cockpit.querySelector("[data-hearth-copy-diagnostic]");
    refs.receiptToggle = cockpit.querySelector("[data-hearth-toggle-receipt]");
    refs.inspectButton = cockpit.querySelector("[data-hearth-inspect-planet]");
    refs.expandButton = cockpit.querySelector("[data-hearth-collapse-cockpit]");

    if (refs.copyButton) {
      refs.copyButton.onclick = copyDiagnostic;
      state.copyPartialDiagnosticReady = true;
    }

    if (refs.receiptToggle) {
      refs.receiptToggle.onclick = toggleReceipt;
      state.receiptToggleReady = true;
    }

    if (refs.inspectButton) {
      refs.inspectButton.onclick = () => setInspectReserved(!state.inspectModeReservedActive);
      state.inspectControlReserved = true;
    }

    if (refs.expandButton) {
      refs.expandButton.onclick = toggleExpanded;
    }

    mount.querySelectorAll("[data-hearth-mount-fallback], .mount-fallback").forEach((fallback) => {
      fallback.hidden = true;
      fallback.style.display = "none";
      fallback.dataset.hiddenByEastStep1Ignition = CONTRACT;
    });

    state.cockpitReady = true;
    state.loadingScreenReady = true;
    state.firstPaintReady = true;
    state.visibleProgressStripReady = Boolean(refs.mainFill && refs.mainPercent);
    state.partialReceiptAvailable = true;

    return cockpit;
  }

  function toggleReceipt() {
    if (!refs.receiptBox) return;

    const visible = refs.receiptBox.dataset.visible !== "true";
    refs.receiptBox.dataset.visible = String(visible);

    if (refs.receiptToggle) {
      refs.receiptToggle.textContent = visible ? "Hide receipt" : "Show receipt";
    }

    render();
  }

  function toggleExpanded() {
    if (!refs.cockpit) return;

    if (state.inspectModeReservedActive) {
      setInspectReserved(false);
      return;
    }

    const expanded = refs.cockpit.dataset.fullExpanded !== "true";
    refs.cockpit.dataset.fullExpanded = String(expanded);
    refs.cockpit.dataset.cockpitMode = expanded ? "expanded-cockpit" : "first-paint-loading";

    if (refs.expandButton) {
      refs.expandButton.textContent = expanded ? "Collapse dock" : "Expand cockpit";
    }
  }

  function setInspectReserved(active) {
    state.inspectModeReservedActive = Boolean(active);
    state.showDiagnosticTabVisible = Boolean(active);

    if (refs.cockpit) {
      refs.cockpit.dataset.cockpitMode = active ? "planet-inspect" : "first-paint-loading";
      refs.cockpit.dataset.hearthEastInspectReservedActive = String(active);
    }

    if (doc && doc.documentElement) {
      doc.documentElement.dataset.hearthEastInspectReservedActive = String(active);
    }

    if (refs.showTab) {
      refs.showTab.hidden = !active;
      refs.showTab.dataset.visible = String(active);
    }

    if (refs.inspectButton) {
      refs.inspectButton.textContent = active ? "Show diagnostic" : "Inspect planet";
    }

    if (refs.mount) {
      refs.mount.dataset.hearthEastInspectReservedActive = String(active);
    }

    recordLocal(active ? "EAST_INSPECT_RESERVATION_ACTIVE" : "EAST_INSPECT_RESERVATION_RELEASED", {
      reservedOnly: true,
      southOwnsFinalInspectTruth: true
    });

    render();
  }

  function publishEastLedgerLanes() {
    const ledger = refs.ledger || ensureLedger();

    ledger.setLane("eastShell", {
      status: "READY",
      progress: 6,
      event: "EAST_HTML_SHELL_RENDERED",
      stage: "F1A",
      owner: "EAST",
      file: EAST_FILE,
      message: "East confirmed Hearth shell and mount."
    });

    ledger.setLane("eastLedger", {
      status: "READY",
      progress: 12,
      event: "EAST_LOAD_LEDGER_INITIALIZED",
      stage: "F1B",
      owner: "EAST",
      file: EAST_FILE,
      message: "Directional cycle shared ledger initialized."
    });

    ledger.setLane("eastFirstPaint", {
      status: "READY",
      progress: 22,
      event: "EAST_FIRST_PAINT_COCKPIT_VISIBLE",
      stage: "F2",
      owner: "EAST",
      file: EAST_FILE,
      message: "First-paint cockpit visible; user is not blind while downstream files load."
    });

    ledger.setLane("eastScriptOrder", {
      status: "ACTIVE",
      progress: 36,
      event: "EAST_SCRIPT_ORDER_VISIBILITY_ACTIVE",
      stage: "F3",
      owner: "EAST",
      file: EAST_FILE,
      message: "East script-order visibility active."
    });

    ledger.setStage("F3", "East Step 1 ignition complete; downstream cycle loading.", {
      lane: "eastScriptOrder",
      owner: "EAST",
      file: EAST_FILE
    });
  }

  function scriptAlreadyPresent(srcPart) {
    if (!doc) return null;
    return Array.from(doc.scripts || []).find((script) => {
      const src = script.getAttribute("src") || "";
      return src.includes(srcPart);
    }) || null;
  }

  function cacheKey() {
    return `${CONTRACT}-${Date.now()}`;
  }

  function loadDownstreamFile(def) {
    const ledger = refs.ledger || ensureLedger();
    const existingApi = getGlobalByNames(def.globalNames);

    if (existingApi) {
      markDownstreamPresent(def, existingApi, "GLOBAL_PRESENT");
      ledger.setScript(def.key, {
        src: def.file,
        direction: def.direction,
        status: "GLOBAL_PRESENT",
        globalPresent: true,
        loadedAt: nowIso()
      });
      return Promise.resolve(existingApi);
    }

    const existingScript = scriptAlreadyPresent(def.file);

    if (existingScript) {
      markDownstreamScriptRequested(def, "PRESENT_WAITING_GLOBAL");
      ledger.setScript(def.key, {
        src: existingScript.src || def.file,
        direction: def.direction,
        status: "PRESENT_WAITING_GLOBAL",
        globalPresent: false,
        requestedAt: nowIso()
      });

      return waitForGlobal(def, 4200);
    }

    if (!doc || !doc.head) {
      const message = "document.head unavailable";
      recordError("DOCUMENT_HEAD_MISSING", message, { file: def.file, direction: def.direction });
      markDownstreamError(def, message);
      return Promise.resolve(null);
    }

    markDownstreamScriptRequested(def, "REQUESTED");

    ledger.setScript(def.key, {
      src: def.file,
      direction: def.direction,
      status: "REQUESTED",
      globalPresent: false,
      requestedAt: nowIso()
    });

    const script = doc.createElement("script");
    script.src = `${def.file}?v=${encodeURIComponent(cacheKey())}`;
    script.defer = true;
    script.dataset.hearthDirectionalCycle = "true";
    script.dataset.hearthLoadedByEastStep1 = CONTRACT;
    script.dataset.hearthDirection = def.direction;
    script.dataset.hearthScriptKey = def.key;
    script.dataset.generatedImage = "false";
    script.dataset.graphicBox = "false";
    script.dataset.webgl = "false";
    script.dataset.visualPassClaimed = "false";

    return new Promise((resolve) => {
      let settled = false;

      function finish(status, api = null, error = "") {
        if (settled) return;
        settled = true;

        if (api) {
          markDownstreamPresent(def, api, status);
        } else if (error) {
          markDownstreamError(def, error);
        }

        ledger.setScript(def.key, {
          src: script.src,
          direction: def.direction,
          status: api ? "GLOBAL_PRESENT" : status,
          globalPresent: Boolean(api),
          error,
          loadedAt: status === "LOADED" || api ? nowIso() : ""
        });

        resolve(api || null);
      }

      script.onload = () => {
        waitForGlobal(def, 1600).then((api) => {
          finish(api ? "LOADED" : "LOADED_GLOBAL_PENDING", api, api ? "" : "script loaded but global not yet present");
        });
      };

      script.onerror = () => {
        finish("LOAD_FAILED", null, `${def.direction} file failed to load`);
      };

      doc.head.appendChild(script);

      root.setTimeout(() => {
        if (settled) return;
        const api = getGlobalByNames(def.globalNames);
        finish(api ? "TIMEOUT_GLOBAL_PRESENT" : "LOAD_TIMEOUT", api, api ? "" : `${def.direction} load timeout`);
      }, 5200);
    });
  }

  function waitForGlobal(def, timeoutMs) {
    const started = nowMs();

    return new Promise((resolve) => {
      const timer = root.setInterval(() => {
        const api = getGlobalByNames(def.globalNames);

        if (api) {
          root.clearInterval(timer);
          markDownstreamPresent(def, api, "GLOBAL_PRESENT");
          resolve(api);
          return;
        }

        if (nowMs() - started >= timeoutMs) {
          root.clearInterval(timer);
          resolve(null);
        }
      }, 80);
    });
  }

  function markDownstreamScriptRequested(def, status) {
    if (def.key === "west") {
      state.westScriptPresent = status !== "REQUESTED";
      state.westScriptRequested = true;
    }

    if (def.key === "north") {
      state.northScriptPresent = status !== "REQUESTED";
      state.northScriptRequested = true;
    }

    if (def.key === "south") {
      state.southScriptPresent = status !== "REQUESTED";
      state.southScriptRequested = true;
    }

    recordScript(`${def.direction}_${status}`, { file: def.file });
  }

  function markDownstreamPresent(def, api, status) {
    if (def.key === "west") {
      state.westPresent = true;
      state.westScriptPresent = true;
      state.westScriptLoaded = true;
      state.westContract = String(api.contract || "");
    }

    if (def.key === "north") {
      state.northPresent = true;
      state.northScriptPresent = true;
      state.northScriptLoaded = true;
      state.northContract = String(api.contract || "");
    }

    if (def.key === "south") {
      state.southPresent = true;
      state.southScriptPresent = true;
      state.southScriptLoaded = true;
      state.southContract = String(api.contract || "");
    }

    recordScript(`${def.direction}_${status}`, {
      file: def.file,
      contract: String(api.contract || "")
    });
  }

  function markDownstreamError(def, error) {
    const message = String(error || "");

    if (def.key === "west") state.westReceiptError = message;
    if (def.key === "north") state.northReceiptError = message;
    if (def.key === "south") state.southReceiptError = message;

    state.downstreamLoadErrors.push({
      direction: def.direction,
      file: def.file,
      error: message,
      at: nowIso()
    });

    recordError(`${def.direction}_LOAD_ERROR`, message, { file: def.file });
  }

  async function loadDownstreamCycle() {
    if (state.downstreamLoadAttempted) return;

    state.downstreamLoadAttempted = true;
    state.postgameStatus = "EAST_LOADING_DOWNSTREAM_CYCLE";
    recordLocal("EAST_DOWNSTREAM_CYCLE_LOAD_STARTED");

    for (const def of DOWNSTREAM_FILES) {
      await loadDownstreamFile(def);
      reconcileDownstreamReceipts();
      publishStep1Handoff();
      scheduleRender();
    }

    reconcileDownstreamReceipts();
    state.downstreamLoadComplete = Boolean(state.westPresent && state.northPresent && state.southPresent);

    if (state.downstreamLoadComplete) {
      state.postgameStatus = "EAST_STEP1_COMPLETE_DOWNSTREAM_PRESENT";
      state.firstFailedCoordinate = "NONE_EAST_STEP1_COMPLETE";
      state.recommendedNextRenewalTarget = WEST_FILE;
    } else {
      deriveFailureCoordinate();
    }

    publishStep1Handoff();
    publishGlobals();
    render();
  }

  function reconcileDownstreamReceipts() {
    const westApi = getWestApi();
    const northApi = getNorthApi();
    const southApi = getSouthApi();

    if (westApi) markDownstreamPresent(DOWNSTREAM_FILES[0], westApi, "GLOBAL_PRESENT");
    if (northApi) markDownstreamPresent(DOWNSTREAM_FILES[1], northApi, "GLOBAL_PRESENT");
    if (southApi) markDownstreamPresent(DOWNSTREAM_FILES[2], southApi, "GLOBAL_PRESENT");

    const westReceipt = getWestReceipt();
    const northReceipt = getNorthReceipt();
    const southReceipt = getSouthReceipt();

    state.westReceiptPresent = Boolean(westReceipt);
    state.northReceiptPresent = Boolean(northReceipt);
    state.southReceiptPresent = Boolean(southReceipt);

    if (westReceipt && isObject(westReceipt)) {
      state.step1HandoffAcceptedByWest = Boolean(
        westReceipt.step1Accepted ||
        westReceipt.step1HandoffAccepted ||
        westReceipt.handoffAdmissible ||
        westReceipt.westGateReady
      );

      state.step1HandoffAcceptedAt = westReceipt.step1HandoffAcceptedAt || state.step1HandoffAcceptedAt;
    }

    updateLedgerFromDownstream();
    markVisualHints();
  }

  function updateLedgerFromDownstream() {
    const ledger = refs.ledger || ensureLedger();

    ledger.setLane("westHandoff", {
      status: state.westPresent ? state.step1HandoffAcceptedByWest ? "ACCEPTED" : "PRESENT" : "WAITING",
      progress: state.westPresent ? 48 : 36,
      event: state.westPresent ? "WEST_HANDOFF_TABLE_PRESENT" : "WEST_HANDOFF_TABLE_PENDING",
      stage: "F5",
      owner: "EAST",
      file: EAST_FILE,
      message: state.westPresent
        ? "West handoff table is present; West owns admissibility."
        : "East is waiting for West handoff table."
    });

    ledger.setLane("northCommand", {
      status: state.northPresent ? "PRESENT" : "WAITING",
      progress: state.northPresent ? 62 : 36,
      event: state.northPresent ? "NORTH_COMMAND_RUNTIME_TABLE_PRESENT" : "NORTH_COMMAND_RUNTIME_TABLE_PENDING",
      stage: "F8",
      owner: "EAST",
      file: EAST_FILE,
      message: state.northPresent
        ? "North command runtime table is present; North owns checkpoint law."
        : "East is waiting for North command runtime table."
    });

    ledger.setLane("southVisible", {
      status: state.southPresent ? "PRESENT" : "WAITING",
      progress: state.southPresent ? 72 : 36,
      event: state.southPresent ? "SOUTH_VISIBLE_COMPLETION_PRESENT" : "SOUTH_VISIBLE_COMPLETION_PENDING",
      stage: "F13",
      owner: "EAST",
      file: EAST_FILE,
      message: state.southPresent
        ? "South visible completion consumer is present; South owns visible proof and F21 request."
        : "East is waiting for South visible completion consumer."
    });

    ledger.setLane("cycleCheckpoint", {
      status: state.downstreamLoadComplete ? "CYCLE_READY" : "PENDING",
      progress: state.downstreamLoadComplete ? 98 : 36,
      event: state.downstreamLoadComplete ? "EAST_CYCLE_HANDOFF_READY" : "EAST_CYCLE_HANDOFF_PENDING",
      stage: "F21",
      owner: "EAST",
      file: EAST_FILE,
      message: state.downstreamLoadComplete
        ? "East Step 1 is complete and downstream files are present."
        : "Directional cycle is still assembling."
    });
  }

  function publishStep1Handoff() {
    const receipt = getStep1HandoffReceipt();

    root.HEARTH_EAST_STEP1_HANDOFF_RECEIPT = receipt;
    root.HEARTH_INDEX_STEP1_HANDOFF_RECEIPT = receipt;

    state.step1HandoffPublished = true;

    const west = getWestApi();

    if (west && isFunction(west.acceptStep1Handoff)) {
      try {
        const result = west.acceptStep1Handoff(receipt);
        state.step1HandoffAcceptedByWest = Boolean(result !== false);
        state.step1HandoffAcceptedAt = nowIso();
        recordLocal("EAST_STEP1_HANDOFF_ACCEPTED_BY_WEST_METHOD", { result: clonePlain(result) });
      } catch (error) {
        recordError("WEST_ACCEPT_STEP1_HANDOFF_FAILED", error && error.message ? error.message : String(error));
      }
    } else if (west && isFunction(west.receiveEastStep1)) {
      try {
        const result = west.receiveEastStep1(receipt);
        state.step1HandoffAcceptedByWest = Boolean(result !== false);
        state.step1HandoffAcceptedAt = nowIso();
        recordLocal("EAST_STEP1_RECEIVED_BY_WEST_METHOD", { result: clonePlain(result) });
      } catch (error) {
        recordError("WEST_RECEIVE_EAST_STEP1_FAILED", error && error.message ? error.message : String(error));
      }
    }

    publishGlobals();
    return receipt;
  }

  function getStep1HandoffReceipt() {
    return {
      contract: CONTRACT,
      receipt: "HEARTH_EAST_STEP1_HANDOFF_RECEIPT_v1",
      sourceReceipt: RECEIPT,
      version: VERSION,
      owner: "EAST",
      file: EAST_FILE,
      route: ROUTE,
      cycleOrder: state.cycleOrder,

      step: 1,
      stepName: "EAST_STEP1_IGNITION_FIRST_PAINT",
      step1Ignited: state.step1Ignited,
      step1Ready: state.step1Ready,
      firstPaintReady: state.firstPaintReady,
      mountReady: state.mountReady,
      cockpitReady: state.cockpitReady,
      loadingScreenReady: state.loadingScreenReady,
      sharedLedgerPresent: state.sharedLedgerPresent,
      scriptOrderVisible: true,
      partialReceiptAvailable: state.partialReceiptAvailable,

      westFile: WEST_FILE,
      northFile: NORTH_FILE,
      southFile: SOUTH_FILE,

      eastOwnsStep1: true,
      westOwnsHandoffAdmissibility: true,
      northOwnsCheckpointLaw: true,
      southOwnsVisibleCompletion: true,

      runtimeTableRequiredForFirstRender: false,
      sourceStackRequiredForFirstRender: false,
      wideProbeDeferred: true,
      climateRouteRetired: true,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      publishedAt: nowIso()
    };
  }

  function markVisualHints() {
    if (!doc) return;

    const mount = refs.mount || ensureMount();
    const canvas = mount ? mount.querySelector("canvas") : null;
    const rect = canvas && isFunction(canvas.getBoundingClientRect) ? canvas.getBoundingClientRect() : null;
    const canvasApi = getCanvasApi();
    const canvasState = canvasApi && canvasApi.state ? canvasApi.state : null;
    const canvasReceipt =
      root.HEARTH_CANVAS_POSTGAME_RECEIPT ||
      root.HEARTH_CANVAS_RECEIPT ||
      null;

    state.planetCanvasPresent = Boolean(canvas);
    state.planetCanvasNonZeroSize = Boolean(
      canvas &&
      (
        (canvas.width > 0 && canvas.height > 0) ||
        (rect && rect.width > 0 && rect.height > 0)
      )
    );

    state.visiblePlanetHintPresent = Boolean(
      state.planetCanvasPresent &&
      state.planetCanvasNonZeroSize &&
      (
        canvasState?.firstFrameDetected === true ||
        canvasState?.imageRendered === true ||
        canvasState?.canvasReady === true ||
        canvasReceipt?.firstFrameDetected === true ||
        canvasReceipt?.imageRendered === true ||
        canvasReceipt?.canvasReady === true ||
        doc.documentElement.dataset.hearthCanvasReady === "true" ||
        doc.documentElement.dataset.hearthImageRendered === "true"
      )
    );
  }

  function deriveFailureCoordinate() {
    if (!state.step1Ignited) {
      state.firstFailedCoordinate = "WAITING_EAST_STEP1_IGNITION";
      state.recommendedNextRenewalTarget = EAST_FILE;
      return;
    }

    if (!state.mountReady) {
      state.firstFailedCoordinate = "WAITING_EAST_MOUNT_READY";
      state.recommendedNextRenewalTarget = EAST_FILE;
      return;
    }

    if (!state.cockpitReady) {
      state.firstFailedCoordinate = "WAITING_EAST_COCKPIT_READY";
      state.recommendedNextRenewalTarget = EAST_FILE;
      return;
    }

    if (!state.sharedLedgerPresent) {
      state.firstFailedCoordinate = "WAITING_EAST_SHARED_LEDGER";
      state.recommendedNextRenewalTarget = EAST_FILE;
      return;
    }

    if (!state.westPresent) {
      state.firstFailedCoordinate = "WAITING_WEST_HANDOFF_TABLE";
      state.recommendedNextRenewalTarget = WEST_FILE;
      return;
    }

    if (!state.northPresent) {
      state.firstFailedCoordinate = "WAITING_NORTH_COMMAND_RUNTIME_TABLE";
      state.recommendedNextRenewalTarget = NORTH_FILE;
      return;
    }

    if (!state.southPresent) {
      state.firstFailedCoordinate = "WAITING_SOUTH_VISIBLE_COMPLETION";
      state.recommendedNextRenewalTarget = SOUTH_FILE;
      return;
    }

    state.firstFailedCoordinate = "NONE_EAST_STEP1_COMPLETE";
    state.recommendedNextRenewalTarget = WEST_FILE;
  }

  function retireClimateRoute() {
    root.__HEARTH_CLIMATE_ROUTE_RETIRED__ = true;
    root.__HEARTH_RETIRED_ROUTE_FILE__ = RETIRED_CLIMATE_FILE;
    root.__HEARTH_RETIRED_CLIMATE_ROUTE__ = RETIRED_CLIMATE_FILE;
    root.__HEARTH_RETIRED_CLIMATE_ROUTE_ACTIVE_CARRIER__ = false;

    [
      "__HEARTH_VISIBLE_RECOVERY_DISPOSE__",
      "__HEARTH_G4_ROUTE_DISPOSE__",
      "__HEARTH_HABITABLE_FORMING_ROUTE_DISPOSE__"
    ].forEach((name) => {
      try {
        if (typeof root[name] === "function") root[name]();
      } catch (_error) {}

      try {
        root[name] = undefined;
        delete root[name];
      } catch (_error) {}
    });

    if (doc) {
      doc.querySelectorAll("script[src*='hearth.climate.route.js']").forEach((script) => {
        script.dataset.hearthClimateRouteRetired = "true";
        script.dataset.retiredBy = CONTRACT;
      });
    }

    state.climateRouteRetired = true;
  }

  function computeProgress() {
    let progress = 6;

    if (state.mountReady) progress = Math.max(progress, 6);
    if (state.sharedLedgerPresent) progress = Math.max(progress, 12);
    if (state.firstPaintReady) progress = Math.max(progress, 22);
    if (state.downstreamLoadAttempted) progress = Math.max(progress, 36);
    if (state.westPresent) progress = Math.max(progress, 48);
    if (state.northPresent) progress = Math.max(progress, 62);
    if (state.southPresent) progress = Math.max(progress, 72);
    if (state.visiblePlanetHintPresent) progress = Math.max(progress, 88);
    if (state.downstreamLoadComplete) progress = Math.max(progress, 96);

    state.displayProgress = clamp(progress, 0, 96);
    return Math.round(state.displayProgress);
  }

  function laneMarkup() {
    const ledger = refs.ledger || ensureLedger();
    const lanes = ledger.state.lanes || {};

    return LANES.map((def) => {
      const lane = lanes[def.key] || {
        label: def.label,
        fibonacci: def.fibonacci,
        status: "PENDING",
        message: `${def.label} pending.`,
        progress: def.progress,
        latestEvent: "PENDING"
      };

      const status = lane.status || "PENDING";
      const progress = clamp(lane.progress, 0, 100);
      const event = lane.latestEvent || "PENDING";
      const message = lane.message || `${def.label} pending.`;

      return `
        <section class="hearth-ledger-lane" data-lane="${escapeHtml(def.key)}" data-status="${escapeHtml(status)}">
          <div class="hearth-ledger-lane-top">
            <span class="hearth-ledger-lane-title">
              <strong>${escapeHtml(def.label)} · ${escapeHtml(lane.fibonacci || def.fibonacci)}</strong>
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

  function scheduleRender() {
    if (renderTimer) return;

    renderTimer = root.setTimeout(() => {
      renderTimer = 0;
      render();
    }, 80);
  }

  function render() {
    if (!refs.cockpit) return;

    reconcileDownstreamReceipts();
    deriveFailureCoordinate();

    const progress = computeProgress();
    const elapsed = state.startedAt ? nowMs() - new Date(state.startedAt).getTime() : 0;

    const stage =
      state.downstreamLoadComplete ? "F13" :
        state.northPresent ? "F8" :
          state.westPresent ? "F5" :
            state.downstreamLoadAttempted ? "F3" :
              state.firstPaintReady ? "F2" :
                state.sharedLedgerPresent ? "F1B" :
                  "F1A";

    state.currentStage = stage;
    state.highestStage = stage;

    if (refs.title) {
      refs.title.textContent = state.downstreamLoadComplete
        ? "EAST STEP 1 COMPLETE · CYCLE HANDED DOWNSTREAM"
        : "STARTING HEARTH DIRECTIONAL CYCLE";
    }

    if (refs.stage) {
      refs.stage.textContent = `${stage} · East Step 1`;
    }

    if (refs.heartbeat) {
      refs.heartbeat.textContent = `east=true · cycle=${state.cycleOrder} · elapsed=${formatElapsed(elapsed)}`;
    }

    if (refs.latest) {
      refs.latest.textContent = `latest=${state.latestEvent}`;
    }

    if (refs.mainFill) refs.mainFill.style.width = `${progress}%`;
    if (refs.mainPercent) refs.mainPercent.textContent = `${progress}%`;
    if (refs.laneList) refs.laneList.innerHTML = laneMarkup();
    if (refs.receiptPre) refs.receiptPre.textContent = getReceiptText();

    publishStatusNode();
    publishGlobals();
  }

  function publishStatusNode() {
    if (!doc) return;

    const node =
      doc.getElementById(STATUS_ID) ||
      doc.querySelector("[data-hearth-route-status]");

    if (!node) return;

    node.textContent = [
      "Hearth East Step 1 ignition active.",
      `Contract ${CONTRACT}`,
      `Receipt ${RECEIPT}`,
      `File ${EAST_FILE}`,
      `Cycle ${state.cycleOrder}`,
      `Mount ready ${state.mountReady}`,
      `Cockpit ready ${state.cockpitReady}`,
      `Shared ledger present ${state.sharedLedgerPresent}`,
      `Step 1 handoff published ${state.step1HandoffPublished}`,
      `West present ${state.westPresent}`,
      `North present ${state.northPresent}`,
      `South present ${state.southPresent}`,
      `Downstream load complete ${state.downstreamLoadComplete}`,
      `First failed coordinate ${state.firstFailedCoordinate}`,
      `Recommended next renewal target ${state.recommendedNextRenewalTarget}`,
      "Generated image false",
      "GraphicBox false",
      "WebGL false",
      "Visual pass claimed false",
      `Updated ${state.updatedAt || nowIso()}`
    ].join("\n");
  }

  async function copyText(text) {
    try {
      if (root.navigator && root.navigator.clipboard && isFunction(root.navigator.clipboard.writeText)) {
        await root.navigator.clipboard.writeText(text);
        return true;
      }

      if (doc) {
        const textarea = doc.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "readonly");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        doc.body.appendChild(textarea);
        textarea.select();
        doc.execCommand("copy");
        textarea.remove();
        return true;
      }
    } catch (error) {
      recordError("COPY_DIAGNOSTIC_FAILED", error && error.message ? error.message : String(error));
    }

    return false;
  }

  async function copyDiagnostic() {
    const ok = await copyText(getReceiptText());

    if (refs.copyButton) {
      const original = refs.copyButton.textContent;
      refs.copyButton.textContent = ok ? "Copied" : "Copy failed";
      root.setTimeout(() => {
        refs.copyButton.textContent = original || "Copy diagnostic";
      }, 1100);
    }

    recordLocal("EAST_PARTIAL_DIAGNOSTIC_COPIED", { ok });
    return ok;
  }

  function getReceipt() {
    reconcileDownstreamReceipts();
    deriveFailureCoordinate();

    const ledger = refs.ledger || root.HEARTH_LOAD_LEDGER || null;

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: EAST_FILE,
      route: ROUTE,
      role: state.role,
      cycleOrder: state.cycleOrder,

      pairedSemiconductor: true,
      pairedWith: SOUTH_FILE,

      ownsEast: true,
      ownsWest: false,
      ownsNorth: false,
      ownsSouth: false,
      ownsStep1: true,
      ownsFirstPaintSurvival: true,
      ownsMountCertainty: true,
      ownsLoadingScreenCertainty: true,
      ownsEarlyLedger: true,
      ownsScriptOrderVisibility: true,
      ownsStep1HandoffPublication: true,

      ownsWestHandoffAdmissibility: false,
      ownsNorthRuntimeTable: false,
      ownsCheckpointLaw: false,
      ownsNewsFibonacciGovernance: false,
      ownsCanvasCoordination: false,
      ownsCanvasDrawing: false,
      ownsVisiblePlanetProof: false,
      ownsInspectModeTruth: false,
      ownsCompletionLatch: false,
      ownsFinalDiagnosticReceipt: false,
      ownsFinalVisualPassClaim: false,

      eastFile: EAST_FILE,
      westFile: WEST_FILE,
      northFile: NORTH_FILE,
      southFile: SOUTH_FILE,
      canvasFile: CANVAS_FILE,

      mountReady: state.mountReady,
      mountCreatedByEast: state.mountCreatedByEast,
      cockpitReady: state.cockpitReady,
      cockpitCreatedByEast: state.cockpitCreatedByEast,
      loadingScreenReady: state.loadingScreenReady,
      firstPaintReady: state.firstPaintReady,
      visibleProgressStripReady: state.visibleProgressStripReady,

      sharedLedgerPresent: state.sharedLedgerPresent,
      sharedLedgerCreatedByEast: state.sharedLedgerCreatedByEast,
      partialReceiptAvailable: state.partialReceiptAvailable,
      copyPartialDiagnosticReady: state.copyPartialDiagnosticReady,
      receiptToggleReady: state.receiptToggleReady,
      inspectControlReserved: state.inspectControlReserved,
      showDiagnosticRestoreReserved: state.showDiagnosticRestoreReserved,

      step1Ignited: state.step1Ignited,
      step1Ready: state.step1Ready,
      step1HandoffPublished: state.step1HandoffPublished,
      step1HandoffAcceptedByWest: state.step1HandoffAcceptedByWest,
      step1HandoffAcceptedAt: state.step1HandoffAcceptedAt,

      westPresent: state.westPresent,
      westScriptPresent: state.westScriptPresent,
      westScriptRequested: state.westScriptRequested,
      westScriptLoaded: state.westScriptLoaded,
      westContract: state.westContract,
      westReceiptPresent: state.westReceiptPresent,
      westReceiptError: state.westReceiptError,

      northPresent: state.northPresent,
      northScriptPresent: state.northScriptPresent,
      northScriptRequested: state.northScriptRequested,
      northScriptLoaded: state.northScriptLoaded,
      northContract: state.northContract,
      northReceiptPresent: state.northReceiptPresent,
      northReceiptError: state.northReceiptError,

      southPresent: state.southPresent,
      southScriptPresent: state.southScriptPresent,
      southScriptRequested: state.southScriptRequested,
      southScriptLoaded: state.southScriptLoaded,
      southContract: state.southContract,
      southReceiptPresent: state.southReceiptPresent,
      southReceiptError: state.southReceiptError,

      downstreamLoadAttempted: state.downstreamLoadAttempted,
      downstreamLoadComplete: state.downstreamLoadComplete,
      downstreamLoadErrors: clonePlain(state.downstreamLoadErrors),

      currentStage: state.currentStage,
      highestStage: state.highestStage,
      displayProgress: state.displayProgress,
      latestEvent: state.latestEvent,
      postgameStatus: state.postgameStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      planetCanvasPresent: state.planetCanvasPresent,
      planetCanvasNonZeroSize: state.planetCanvasNonZeroSize,
      visiblePlanetHintPresent: state.visiblePlanetHintPresent,
      inspectModeReservedActive: state.inspectModeReservedActive,
      showDiagnosticTabVisible: state.showDiagnosticTabVisible,

      climateRouteRetired: true,
      runtimeTableRequiredForFirstRender: false,
      sourceStackRequiredForFirstRender: false,
      wideProbeDeferred: true,

      eastRuntimeTableMutation: false,
      canvasMutation: false,
      sourceAuthorityHeld: true,

      sharedLedger: ledger && ledger.state ? clonePlain(ledger.state) : null,
      step1HandoffReceipt: getStep1HandoffReceipt(),
      localEvents: clonePlain(state.localEvents),
      scriptEvents: clonePlain(state.scriptEvents),
      errors: clonePlain(state.errors),

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      startedAt: state.startedAt,
      updatedAt: nowIso()
    };
  }

  function getReceiptText() {
    const receipt = getReceipt();
    const ledger = receipt.sharedLedger || {};

    const lanes = Object.entries(ledger.lanes || {}).map(([key, lane]) => (
      `- ${key}: status=${lane.status}; fibonacci=${lane.fibonacci}; progress=${lane.progress}; event=${lane.latestEvent}; owner=${lane.owner}; message=${lane.message}`
    )).join("\n") || "- none";

    const scripts = Object.entries(ledger.scripts || {}).map(([key, script]) => (
      `- ${key}: direction=${script.direction || ""}; status=${script.status}; src=${script.src || ""}; globalPresent=${script.globalPresent === true}; error=${script.error || ""}`
    )).join("\n") || "- none";

    const localEvents = receipt.localEvents.map((event) => (
      `- ${event.at || ""} :: ${event.event || ""} :: ${JSON.stringify(event.detail || {})}`
    )).join("\n") || "- none";

    const scriptEvents = receipt.scriptEvents.map((event) => (
      `- ${event.at || ""} :: ${event.event || ""} :: ${JSON.stringify(event.detail || {})}`
    )).join("\n") || "- none";

    const errors = receipt.errors.map((error) => (
      `- ${error.at || ""} :: ${error.code || ""} :: ${error.message || ""}`
    )).join("\n") || "- none";

    return [
      "HEARTH_EAST_STEP1_IGNITION_FIRST_PAINT_CYCLE_RECEIPT",
      "",
      `contract=${receipt.contract}`,
      `receipt=${receipt.receipt}`,
      `previousContract=${receipt.previousContract}`,
      `baselineContract=${receipt.baselineContract}`,
      `version=${receipt.version}`,
      `file=${receipt.file}`,
      `route=${receipt.route}`,
      `role=${receipt.role}`,
      `cycleOrder=${receipt.cycleOrder}`,
      "",
      `pairedSemiconductor=${receipt.pairedSemiconductor}`,
      `pairedWith=${receipt.pairedWith}`,
      "",
      `ownsEast=${receipt.ownsEast}`,
      `ownsWest=${receipt.ownsWest}`,
      `ownsNorth=${receipt.ownsNorth}`,
      `ownsSouth=${receipt.ownsSouth}`,
      `ownsStep1=${receipt.ownsStep1}`,
      `ownsFirstPaintSurvival=${receipt.ownsFirstPaintSurvival}`,
      `ownsMountCertainty=${receipt.ownsMountCertainty}`,
      `ownsLoadingScreenCertainty=${receipt.ownsLoadingScreenCertainty}`,
      `ownsEarlyLedger=${receipt.ownsEarlyLedger}`,
      `ownsScriptOrderVisibility=${receipt.ownsScriptOrderVisibility}`,
      `ownsStep1HandoffPublication=${receipt.ownsStep1HandoffPublication}`,
      "",
      `ownsWestHandoffAdmissibility=${receipt.ownsWestHandoffAdmissibility}`,
      `ownsNorthRuntimeTable=${receipt.ownsNorthRuntimeTable}`,
      `ownsCheckpointLaw=${receipt.ownsCheckpointLaw}`,
      `ownsNewsFibonacciGovernance=${receipt.ownsNewsFibonacciGovernance}`,
      `ownsCanvasCoordination=${receipt.ownsCanvasCoordination}`,
      `ownsCanvasDrawing=${receipt.ownsCanvasDrawing}`,
      `ownsVisiblePlanetProof=${receipt.ownsVisiblePlanetProof}`,
      `ownsInspectModeTruth=${receipt.ownsInspectModeTruth}`,
      `ownsCompletionLatch=${receipt.ownsCompletionLatch}`,
      `ownsFinalDiagnosticReceipt=${receipt.ownsFinalDiagnosticReceipt}`,
      `ownsFinalVisualPassClaim=${receipt.ownsFinalVisualPassClaim}`,
      "",
      `eastFile=${receipt.eastFile}`,
      `westFile=${receipt.westFile}`,
      `northFile=${receipt.northFile}`,
      `southFile=${receipt.southFile}`,
      `canvasFile=${receipt.canvasFile}`,
      "",
      `mountReady=${receipt.mountReady}`,
      `mountCreatedByEast=${receipt.mountCreatedByEast}`,
      `cockpitReady=${receipt.cockpitReady}`,
      `cockpitCreatedByEast=${receipt.cockpitCreatedByEast}`,
      `loadingScreenReady=${receipt.loadingScreenReady}`,
      `firstPaintReady=${receipt.firstPaintReady}`,
      `visibleProgressStripReady=${receipt.visibleProgressStripReady}`,
      "",
      `sharedLedgerPresent=${receipt.sharedLedgerPresent}`,
      `sharedLedgerCreatedByEast=${receipt.sharedLedgerCreatedByEast}`,
      `partialReceiptAvailable=${receipt.partialReceiptAvailable}`,
      `copyPartialDiagnosticReady=${receipt.copyPartialDiagnosticReady}`,
      `receiptToggleReady=${receipt.receiptToggleReady}`,
      `inspectControlReserved=${receipt.inspectControlReserved}`,
      `showDiagnosticRestoreReserved=${receipt.showDiagnosticRestoreReserved}`,
      "",
      `step1Ignited=${receipt.step1Ignited}`,
      `step1Ready=${receipt.step1Ready}`,
      `step1HandoffPublished=${receipt.step1HandoffPublished}`,
      `step1HandoffAcceptedByWest=${receipt.step1HandoffAcceptedByWest}`,
      `step1HandoffAcceptedAt=${receipt.step1HandoffAcceptedAt}`,
      "",
      `westPresent=${receipt.westPresent}`,
      `westScriptPresent=${receipt.westScriptPresent}`,
      `westScriptRequested=${receipt.westScriptRequested}`,
      `westScriptLoaded=${receipt.westScriptLoaded}`,
      `westContract=${receipt.westContract}`,
      `westReceiptPresent=${receipt.westReceiptPresent}`,
      `westReceiptError=${receipt.westReceiptError}`,
      "",
      `northPresent=${receipt.northPresent}`,
      `northScriptPresent=${receipt.northScriptPresent}`,
      `northScriptRequested=${receipt.northScriptRequested}`,
      `northScriptLoaded=${receipt.northScriptLoaded}`,
      `northContract=${receipt.northContract}`,
      `northReceiptPresent=${receipt.northReceiptPresent}`,
      `northReceiptError=${receipt.northReceiptError}`,
      "",
      `southPresent=${receipt.southPresent}`,
      `southScriptPresent=${receipt.southScriptPresent}`,
      `southScriptRequested=${receipt.southScriptRequested}`,
      `southScriptLoaded=${receipt.southScriptLoaded}`,
      `southContract=${receipt.southContract}`,
      `southReceiptPresent=${receipt.southReceiptPresent}`,
      `southReceiptError=${receipt.southReceiptError}`,
      "",
      `downstreamLoadAttempted=${receipt.downstreamLoadAttempted}`,
      `downstreamLoadComplete=${receipt.downstreamLoadComplete}`,
      "",
      `currentStage=${receipt.currentStage}`,
      `highestStage=${receipt.highestStage}`,
      `displayProgress=${receipt.displayProgress}`,
      `latestEvent=${receipt.latestEvent}`,
      `postgameStatus=${receipt.postgameStatus}`,
      `firstFailedCoordinate=${receipt.firstFailedCoordinate}`,
      `recommendedNextRenewalTarget=${receipt.recommendedNextRenewalTarget}`,
      "",
      `planetCanvasPresent=${receipt.planetCanvasPresent}`,
      `planetCanvasNonZeroSize=${receipt.planetCanvasNonZeroSize}`,
      `visiblePlanetHintPresent=${receipt.visiblePlanetHintPresent}`,
      `inspectModeReservedActive=${receipt.inspectModeReservedActive}`,
      `showDiagnosticTabVisible=${receipt.showDiagnosticTabVisible}`,
      "",
      `climateRouteRetired=${receipt.climateRouteRetired}`,
      `runtimeTableRequiredForFirstRender=${receipt.runtimeTableRequiredForFirstRender}`,
      `sourceStackRequiredForFirstRender=${receipt.sourceStackRequiredForFirstRender}`,
      `wideProbeDeferred=${receipt.wideProbeDeferred}`,
      "",
      `eastRuntimeTableMutation=${receipt.eastRuntimeTableMutation}`,
      `canvasMutation=${receipt.canvasMutation}`,
      `sourceAuthorityHeld=${receipt.sourceAuthorityHeld}`,
      "",
      "LEDGER_LANES",
      lanes,
      "",
      "LEDGER_SCRIPTS",
      scripts,
      "",
      "LOCAL_EVENTS",
      localEvents,
      "",
      "SCRIPT_EVENTS",
      scriptEvents,
      "",
      "ERRORS",
      errors,
      "",
      `generatedImage=${receipt.generatedImage}`,
      `graphicBox=${receipt.graphicBox}`,
      `webGL=${receipt.webGL}`,
      `visualPassClaimed=${receipt.visualPassClaimed}`,
      "",
      `startedAt=${receipt.startedAt}`,
      `updatedAt=${receipt.updatedAt}`
    ].join("\n");
  }

  function publishDataset() {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthEastStep1IgnitionLoaded = "true";
    dataset.hearthEastStep1IgnitionContract = CONTRACT;
    dataset.hearthEastStep1IgnitionReceipt = RECEIPT;
    dataset.hearthEastStep1IgnitionVersion = VERSION;
    dataset.hearthCycleEast = "true";
    dataset.hearthCycleOrder = state.cycleOrder;

    dataset.hearthEastFile = EAST_FILE;
    dataset.hearthWestFile = WEST_FILE;
    dataset.hearthNorthFile = NORTH_FILE;
    dataset.hearthSouthFile = SOUTH_FILE;

    dataset.hearthEastOwnsStep1 = "true";
    dataset.hearthEastOwnsFirstPaintSurvival = "true";
    dataset.hearthEastOwnsMountCertainty = "true";
    dataset.hearthEastOwnsLoadingScreenCertainty = "true";
    dataset.hearthEastOwnsEarlyLedger = "true";
    dataset.hearthEastOwnsScriptOrderVisibility = "true";
    dataset.hearthEastOwnsWest = "false";
    dataset.hearthEastOwnsNorth = "false";
    dataset.hearthEastOwnsSouth = "false";
    dataset.hearthEastOwnsFinalCompletion = "false";
    dataset.hearthEastOwnsCanvasDrawing = "false";
    dataset.hearthEastOwnsVisiblePlanetProof = "false";

    dataset.hearthStep1Ignited = String(state.step1Ignited);
    dataset.hearthStep1Ready = String(state.step1Ready);
    dataset.hearthStep1HandoffPublished = String(state.step1HandoffPublished);
    dataset.hearthMountReady = String(state.mountReady);
    dataset.hearthFirstPaintCockpitReady = String(state.cockpitReady);
    dataset.hearthVisibleProgressStripReady = String(state.visibleProgressStripReady);
    dataset.hearthLoadLedgerPresent = String(state.sharedLedgerPresent);

    dataset.hearthWestPresent = String(state.westPresent);
    dataset.hearthNorthPresent = String(state.northPresent);
    dataset.hearthSouthPresent = String(state.southPresent);
    dataset.hearthDownstreamLoadComplete = String(state.downstreamLoadComplete);

    dataset.hearthPlanetCanvasPresent = String(state.planetCanvasPresent);
    dataset.hearthPlanetCanvasNonZeroSize = String(state.planetCanvasNonZeroSize);
    dataset.hearthVisiblePlanetHintPresent = String(state.visiblePlanetHintPresent);

    dataset.hearthClimateRouteRetired = "true";
    dataset.hearthRetiredClimateRouteFile = RETIRED_CLIMATE_FILE;
    dataset.hearthRuntimeTableRequiredForFirstRender = "false";
    dataset.hearthSourceStackRequiredForFirstRender = "false";
    dataset.hearthWideProbeDeferred = "true";

    dataset.hearthFirstFailedCoordinate = state.firstFailedCoordinate;
    dataset.hearthRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;

    dataset.hearthEastRuntimeTableMutation = "false";
    dataset.hearthCanvasMutation = "false";
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.HEARTH.eastStep1Ignition = api;
    root.HEARTH.indexBridge = api;
    root.HEARTH.indexConstraintSemiconductor = api;

    root.HEARTH_EAST_STEP1_IGNITION = api;
    root.HEARTH_EAST_STEP1_IGNITION_CYCLE = api;
    root.HEARTH_INDEX_CONSTRAINT_SEMICONDUCTOR = api;
    root.HEARTH_INDEX_BRIDGE = api;
    root.HearthIndexBridge = api;
    root.HEARTH_INDEX_JS = api;

    root.HEARTH_EAST_STEP1_IGNITION_RECEIPT = getReceiptLight();
    root.HEARTH_INDEX_CONSTRAINT_SEMICONDUCTOR_RECEIPT = root.HEARTH_EAST_STEP1_IGNITION_RECEIPT;
    root.HEARTH_INDEX_BRIDGE_RECEIPT = root.HEARTH_EAST_STEP1_IGNITION_RECEIPT;
    root.HEARTH_INDEX_JS_RECEIPT = root.HEARTH_EAST_STEP1_IGNITION_RECEIPT;
    root.HEARTH_EAST_STEP1_HANDOFF_RECEIPT = getStep1HandoffReceipt();
    root.HEARTH_INDEX_STEP1_HANDOFF_RECEIPT = root.HEARTH_EAST_STEP1_HANDOFF_RECEIPT;

    root.__HEARTH_EAST_STEP1_FILE__ = EAST_FILE;
    root.__HEARTH_WEST_HANDOFF_FILE__ = WEST_FILE;
    root.__HEARTH_NORTH_COMMAND_FILE__ = NORTH_FILE;
    root.__HEARTH_SOUTH_VISIBLE_COMPLETION_FILE__ = SOUTH_FILE;
    root.__HEARTH_ACTIVE_ROUTE_FILE__ = SOUTH_FILE;
    root.__HEARTH_CLIMATE_ROUTE_RETIRED__ = true;

    publishDataset();
  }

  function getReceiptLight() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: EAST_FILE,
      route: ROUTE,
      role: "east-step1-ignition-first-paint-cycle",
      cycleOrder: state.cycleOrder,
      step1Ignited: state.step1Ignited,
      step1Ready: state.step1Ready,
      firstPaintReady: state.firstPaintReady,
      mountReady: state.mountReady,
      cockpitReady: state.cockpitReady,
      sharedLedgerPresent: state.sharedLedgerPresent,
      step1HandoffPublished: state.step1HandoffPublished,
      westPresent: state.westPresent,
      northPresent: state.northPresent,
      southPresent: state.southPresent,
      downstreamLoadComplete: state.downstreamLoadComplete,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      eastRuntimeTableMutation: false,
      canvasMutation: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function startHeartbeat() {
    if (heartbeatTimer) root.clearInterval(heartbeatTimer);

    heartbeatTimer = root.setInterval(() => {
      reconcileDownstreamReceipts();
      publishStep1Handoff();
      render();
    }, 1000);
  }

  function startWatchdog() {
    if (watchdogTimer) root.clearInterval(watchdogTimer);

    let ticks = 0;

    watchdogTimer = root.setInterval(() => {
      ticks += 1;

      reconcileDownstreamReceipts();
      publishStep1Handoff();
      deriveFailureCoordinate();

      if (ticks >= 80 || state.downstreamLoadComplete) {
        root.clearInterval(watchdogTimer);
        watchdogTimer = 0;
      }

      render();
    }, 350);
  }

  async function boot() {
    if (bootStarted) {
      render();
      return getReceipt();
    }

    bootStarted = true;
    state.startedAt = nowIso();
    state.updatedAt = state.startedAt;
    state.step1Ignited = true;
    state.postgameStatus = "EAST_STEP1_BOOTING";
    state.firstFailedCoordinate = "EAST_STEP1_BOOT_STARTED";
    state.recommendedNextRenewalTarget = WEST_FILE;

    retireClimateRoute();

    ensureMount();
    ensureLedger();
    ensureCockpit();
    publishEastLedgerLanes();

    state.step1Ready = Boolean(
      state.step1Ignited &&
      state.mountReady &&
      state.cockpitReady &&
      state.sharedLedgerPresent &&
      state.firstPaintReady
    );

    publishStep1Handoff();
    publishGlobals();
    render();

    root.setTimeout(() => {
      loadDownstreamCycle();
    }, 80);

    startHeartbeat();
    startWatchdog();

    return getReceipt();
  }

  function dispose(reason = "manual-dispose") {
    if (heartbeatTimer) {
      root.clearInterval(heartbeatTimer);
      heartbeatTimer = 0;
    }

    if (watchdogTimer) {
      root.clearInterval(watchdogTimer);
      watchdogTimer = 0;
    }

    recordLocal("EAST_STEP1_IGNITION_DISPOSED", { reason });
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    route: ROUTE,
    file: EAST_FILE,
    role: "east-step1-ignition-first-paint-cycle",

    boot,
    start: boot,
    init: boot,
    run: boot,
    dispose,

    publishStep1Handoff,
    getStep1HandoffReceipt,
    reconcileDownstreamReceipts,
    loadDownstreamCycle,
    setInspectReserved,
    getReceipt,
    getReceiptText,
    copyDiagnostic,

    supportsDirectionalCycle: true,
    supportsEastStep1Ignition: true,
    supportsFirstPaintSurvival: true,
    supportsMountCertainty: true,
    supportsLoadingScreenCertainty: true,
    supportsEarlyLedger: true,
    supportsScriptOrderVisibility: true,
    supportsStep1HandoffPublication: true,
    supportsPartialDiagnosticBeforeCompletion: true,
    supportsInspectControlReservation: true,
    supportsShowDiagnosticRestoreReservation: true,

    ownsEast: true,
    ownsWest: false,
    ownsNorth: false,
    ownsSouth: false,
    ownsStep1: true,
    ownsFinalCompletion: false,
    ownsCanvasDrawing: false,
    ownsVisiblePlanetProof: false,
    ownsFinalDiagnosticReceipt: false,
    ownsFinalVisualPassClaim: false,

    eastFile: EAST_FILE,
    westFile: WEST_FILE,
    northFile: NORTH_FILE,
    southFile: SOUTH_FILE,
    canvasFile: CANVAS_FILE,

    runtimeTableRequiredForFirstRender: false,
    sourceStackRequiredForFirstRender: false,
    wideProbeDeferred: true,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  };

  publishGlobals();

  if (doc) {
    if (doc.readyState === "loading") {
      doc.addEventListener("DOMContentLoaded", () => {
        boot();
      }, { once: true });
    } else {
      boot();
    }
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

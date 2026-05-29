// /showroom/globe/hearth/index.js
// HEARTH_INDEX_CONSTRAINT_SEMICONDUCTOR_FIRST_PAINT_LEDGER_TNT_v1
// Full-file replacement.
// Constraint-side semiconductor only.
// Purpose:
// - Start the Hearth visible process.
// - Guarantee first-paint loading/ledger visibility.
// - Create shared load ledger for the paired semiconductor system.
// - Track script order and conductor availability.
// - Delegate coherence completion to /showroom/globe/hearth/hearth.js.
// - Preserve partial diagnostic/copy/receipt access before final completion.
// - Reserve Inspect planet / Show diagnostic controls for synchronized handoff.
// Does not own:
// - active route coherence
// - canvas drawing
// - atlas pixel generation
// - texture composition
// - visible planet proof
// - final completion
// - F21 latch
// - final diagnostic receipt authority
// - Runtime Table implementation
// - source-stack truth
// - climate-route rendering
// - visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_INDEX_CONSTRAINT_SEMICONDUCTOR_FIRST_PAINT_LEDGER_TNT_v1";
  const RECEIPT = "HEARTH_INDEX_CONSTRAINT_SEMICONDUCTOR_FIRST_PAINT_LEDGER_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_INDEX_JS_ROUTE_BRIDGE_RECONSTRUCTION_TNT_v1";
  const EXPECTED_COHERENCE_CONDUCTOR = "HEARTH_ROUTE_COHERENCE_SEMICONDUCTOR_VISIBLE_PLANET_COMPLETION_TNT_v1";
  const VERSION = "2026-05-29.hearth-index-constraint-semiconductor-first-paint-ledger-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const COHERENCE_FILE = "/showroom/globe/hearth/hearth.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const RETIRED_CLIMATE_FILE = "/showroom/globe/hearth/hearth.climate.route.js";
  const MOUNT_ID = "hearthCanvasMount";
  const STATUS_ID = "hearth-route-status";

  const FIB = Object.freeze({
    F1A: { id: "F1A", rank: 1, value: 1, label: "HTML shell rendered", progress: 6 },
    F1B: { id: "F1B", rank: 2, value: 1, label: "Load ledger initialized", progress: 12 },
    F2: { id: "F2", rank: 3, value: 2, label: "First-paint cockpit visible", progress: 22 },
    F3: { id: "F3", rank: 4, value: 3, label: "Script order visible", progress: 36 },
    F5: { id: "F5", rank: 5, value: 5, label: "Authority availability", progress: 55 },
    F8: { id: "F8", rank: 6, value: 8, label: "Conductor hydration", progress: 72 },
    F13: { id: "F13", rank: 7, value: 13, label: "Canvas phase stream", progress: 78 },
    F21: { id: "F21", rank: 8, value: 21, label: "Completion latch", progress: 100 }
  });

  const LANES = Object.freeze([
    { key: "shell", label: "Shell", fibonacci: "F1A" },
    { key: "ledger", label: "Ledger", fibonacci: "F1B" },
    { key: "staticCockpit", label: "First-paint cockpit", fibonacci: "F2" },
    { key: "scriptOrder", label: "Script order", fibonacci: "F3" },
    { key: "authorityAvailability", label: "Authority availability", fibonacci: "F5" },
    { key: "conductorHydration", label: "Conductor hydration", fibonacci: "F8" },
    { key: "canvasAndDiagnostic", label: "Canvas and diagnostic", fibonacci: "F13" },
    { key: "visiblePlanetProof", label: "Visible planet proof", fibonacci: "F13" },
    { key: "inspectMode", label: "Inspect mode", fibonacci: "F13" },
    { key: "completionLatch", label: "Completion latch", fibonacci: "F21" }
  ]);

  const SCRIPT_KEYS = Object.freeze([
    { key: "manorRegistry", srcPart: "/assets/manor-blueprint/manor.blueprint.registry.js" },
    { key: "manorBlueprint", srcPart: "/assets/manor-blueprint/manor.blueprint.js" },
    { key: "runtimeTable", srcPart: "/assets/lab/runtime-table.js" },
    { key: "sourceTectonics", srcPart: "/assets/hearth/hearth.tectonics.js" },
    { key: "sourceElevation", srcPart: "/assets/hearth/hearth.elevation.js" },
    { key: "sourceComposition", srcPart: "/assets/hearth/hearth.composition.js" },
    { key: "sourceHydrology", srcPart: "/assets/hearth/hearth.hydrology.js" },
    { key: "sourceMaterials", srcPart: "/assets/hearth/hearth.materials.js" },
    { key: "sourceHexAuthority", srcPart: "/assets/hearth/hearth.hex.four-pair.authority.js" },
    { key: "sourceHexSurface", srcPart: "/assets/hearth/hearth.hex.surface.js" },
    { key: "canvasAuthority", srcPart: "/assets/hearth/hearth.canvas.js" },
    { key: "coherenceConductor", srcPart: "/showroom/globe/hearth/hearth.js" }
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    expectedCoherenceConductor: EXPECTED_COHERENCE_CONDUCTOR,
    version: VERSION,
    file: INDEX_FILE,
    route: "/showroom/globe/hearth/",
    role: "constraint-side-semiconductor",

    pairedSemiconductor: true,
    pairedWith: COHERENCE_FILE,
    indexJsStartsProcess: true,
    hearthJsFinishesProcess: true,
    systematicAndSynchronized: true,
    synchronizedLoading: true,

    ownsFirstPaintSurvival: true,
    ownsMountCertainty: true,
    ownsLoadingScreenCertainty: true,
    ownsEarlyLedger: true,
    ownsScriptOrderVisibility: true,
    ownsActiveRouteConduction: false,
    ownsFinalCompletion: false,
    ownsCanvasDrawing: false,
    ownsVisiblePlanetProof: false,
    ownsFinalDiagnosticReceipt: false,

    firstPaintCockpitReady: false,
    visibleProgressStripReady: false,
    loadLedgerPresent: false,
    copyPartialDiagnosticReady: false,
    receiptToggleReady: false,
    inspectControlReserved: false,
    showDiagnosticRestoreReserved: false,

    newsProtocolInitialized: false,
    fibonacciSequenceInitialized: false,

    mountReady: false,
    mountCreatedByIndex: false,
    loadingScreenReady: false,
    partialReceiptAvailable: false,

    activeRouteConductor: COHERENCE_FILE,
    conductorDelegationReady: false,
    conductorDelegationAccepted: false,
    conductorGlobalPresent: false,
    conductorScriptPresent: false,
    conductorScriptRequested: false,
    conductorScriptLoaded: false,
    conductorScriptError: "",
    conductorContract: "",
    conductorBootMethodPresent: false,
    conductorBootCallSuppressedToPreventDuplicate: true,

    canvasScriptPresent: false,
    canvasGlobalPresent: false,
    canvasFallbackRequested: false,
    canvasFallbackAllowed: false,

    climateRouteRetired: true,
    runtimeTableRequiredForFirstRender: false,
    sourceStackRequiredForFirstRender: false,
    wideProbeDeferred: true,

    currentStage: "F1A",
    highestStage: "F1A",
    displayProgress: 6,
    latestEvent: "INDEX_CONSTRAINT_SEMICONDUCTOR_LOADED",
    status: "LOADED_NOT_BOOTED",
    firstFailedCoordinate: "INDEX_CONSTRAINT_SEMICONDUCTOR_NOT_STARTED",
    recommendedNextRenewalTarget: "boot-index-constraint-semiconductor",

    planetCanvasPresent: false,
    planetCanvasNonZeroSize: false,
    visiblePlanetPossiblyAvailable: false,
    inspectModeReservedActive: false,
    showDiagnosticTabVisible: false,

    errors: [],
    startedAt: "",
    updatedAt: "",
    heartbeatElapsedMs: 0,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
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
  let watchdogTimer = 0;
  let heartbeatTimer = 0;

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

  function stageProgress(stage) {
    return FIB[stage] ? FIB[stage].progress : 0;
  }

  function stageLabel(stage) {
    return FIB[stage] ? FIB[stage].label : stage;
  }

  function formatElapsed(ms) {
    const total = Math.max(0, Math.floor(Number(ms || 0) / 1000));
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function getGlobal(names) {
    for (const name of names) {
      if (root[name]) return root[name];
    }
    return null;
  }

  function recordError(code, message, detail = {}) {
    const item = {
      code,
      message: String(message || ""),
      detail: clonePlain(detail),
      at: nowIso()
    };

    state.errors.push(item);

    if (state.errors.length > 40) {
      state.errors.splice(0, state.errors.length - 40);
    }

    const ledger = refs.ledger || root.HEARTH_LOAD_LEDGER;
    if (ledger && ledger.state && Array.isArray(ledger.state.errors)) {
      ledger.state.errors.push(item);
      if (ledger.state.errors.length > 70) {
        ledger.state.errors.splice(0, ledger.state.errors.length - 70);
      }
    }

    return item;
  }

  function makeLane(def) {
    return {
      key: def.key,
      label: def.label,
      fibonacci: def.fibonacci,
      status: "PENDING",
      message: `${def.label} pending.`,
      progress: stageProgress(def.fibonacci),
      latestEvent: "LANE_INITIALIZED",
      owner: "index.js",
      updatedAt: nowIso()
    };
  }

  function ensureLedger() {
    const existing = root.HEARTH_LOAD_LEDGER;
    const ledger = existing && isObject(existing) ? existing : {};
    const led = isObject(ledger.state) ? ledger.state : ledger;

    ledger.state = led;

    led.contract = led.contract || "HEARTH_PAIRED_SEMICONDUCTOR_SHARED_LOAD_LEDGER_v1";
    led.createdBy = led.createdBy || CONTRACT;
    led.ownerModel = "paired-semiconductor";
    led.constraintSemiconductor = INDEX_FILE;
    led.coherenceSemiconductor = COHERENCE_FILE;
    led.route = "/showroom/globe/hearth/";
    led.newsProtocolActive = true;
    led.fibonacciSequenceActive = true;
    led.synchronizedLoading = true;
    led.startedAt = led.startedAt || nowIso();
    led.updatedAt = nowIso();
    led.currentStage = led.currentStage || "F1A";
    led.highestStage = led.highestStage || "F1A";
    led.currentFibonacciStage = led.currentFibonacciStage || led.currentStage;
    led.highestStageReached = led.highestStageReached || led.highestStage;
    led.completionAuthority = "hearth.js";
    led.indexOwnsFinalCompletion = false;
    led.visualPassClaimed = false;
    led.events = Array.isArray(led.events) ? led.events : [];
    led.errors = Array.isArray(led.errors) ? led.errors : [];
    led.scripts = isObject(led.scripts) ? led.scripts : {};
    led.lanes = isObject(led.lanes) ? led.lanes : {};
    led.listeners = Array.isArray(led.listeners) ? led.listeners : [];

    LANES.forEach((def) => {
      if (!isObject(led.lanes[def.key])) {
        led.lanes[def.key] = makeLane(def);
      }
    });

    ledger.push = function push(event = {}) {
      const evt = {
        id: event.id || event.event || "LEDGER_EVENT",
        stage: event.stage || led.currentStage || "F1A",
        lane: event.lane || "",
        status: event.status || "",
        owner: event.owner || "index.js",
        file: event.file || INDEX_FILE,
        message: event.message || "",
        detail: clonePlain(event.detail || {}),
        progress: event.progress ?? "",
        timestamp: nowIso()
      };

      led.events.push(evt);
      led.updatedAt = evt.timestamp;

      if (led.events.length > 240) {
        led.events.splice(0, led.events.length - 240);
      }

      notifyLedger();
      return evt;
    };

    ledger.setStage = function setStage(stage, message = "", options = {}) {
      const nextRank = stageRank(stage);
      const currentRank = stageRank(led.highestStage || led.currentStage);

      if (nextRank >= currentRank) {
        led.currentStage = stage;
        led.highestStage = stage;
        led.currentFibonacciStage = stage;
        led.highestStageReached = stage;
        state.currentStage = stage;
        state.highestStage = stage;
      }

      if (nextRank < currentRank) {
        ledger.push({
          id: "LOWER_STAGE_OBSERVED",
          stage,
          lane: options.lane || "ledger",
          status: "OBSERVED",
          owner: options.owner || "index.js",
          file: options.file || INDEX_FILE,
          message: message || `${stage} observed after ${led.highestStage}; not treated as index failure.`,
          detail: { currentHighest: led.highestStage }
        });
        return led.currentStage;
      }

      ledger.push({
        id: `STAGE_${stage}`,
        stage,
        lane: options.lane || "ledger",
        status: options.status || "READY",
        owner: options.owner || "index.js",
        file: options.file || INDEX_FILE,
        message: message || stageLabel(stage),
        detail: options.detail || {}
      });

      return stage;
    };

    ledger.setLane = function setLane(key, next = {}) {
      const lane = led.lanes[key] || {
        key,
        label: key,
        fibonacci: next.stage || "F1B",
        status: "PENDING",
        message: "",
        progress: 0,
        latestEvent: "LANE_CREATED",
        owner: "index.js",
        updatedAt: nowIso()
      };

      lane.status = next.status || lane.status;
      lane.message = next.message || lane.message;
      lane.progress = Math.max(Number(lane.progress || 0), Number(next.progress ?? lane.progress ?? 0));
      lane.latestEvent = next.event || next.latestEvent || lane.latestEvent;
      lane.owner = next.owner || lane.owner || "index.js";
      lane.fibonacci = next.stage || lane.fibonacci;
      lane.updatedAt = nowIso();
      led.lanes[key] = lane;

      ledger.push({
        id: lane.latestEvent,
        stage: lane.fibonacci,
        lane: key,
        status: lane.status,
        owner: lane.owner,
        file: next.file || INDEX_FILE,
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
        status: "PENDING",
        error: "",
        requestedAt: "",
        loadedAt: "",
        updatedAt: nowIso()
      };

      script.src = next.src || script.src;
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
        lane: "scriptOrder",
        status: script.status,
        owner: "index.js",
        file: INDEX_FILE,
        message: `${key} ${script.status}`,
        detail: { src: script.src, error: script.error, globalPresent: script.globalPresent }
      });

      return script;
    };

    ledger.getReceipt = function getSharedReceipt() {
      return clonePlain(led);
    };

    ledger.getReceiptText = function getSharedReceiptText() {
      return getReceiptText();
    };

    ledger.copyDiagnostic = function copySharedDiagnostic() {
      return copyText(getReceiptText());
    };

    ledger.bindRenderer = function bindRenderer(fn) {
      if (isFunction(fn)) led.listeners.push(fn);
      return led.listeners.length;
    };

    root.HEARTH_LOAD_LEDGER = ledger;
    refs.ledger = ledger;

    state.loadLedgerPresent = true;
    state.newsProtocolInitialized = true;
    state.fibonacciSequenceInitialized = true;

    ledger.setLane("ledger", {
      status: "READY",
      progress: stageProgress("F1B"),
      event: "LOAD_LEDGER_INITIALIZED",
      stage: "F1B",
      owner: "index.js",
      file: INDEX_FILE,
      message: "Shared paired-semiconductor load ledger initialized."
    });

    ledger.setStage("F1B", "Shared load ledger initialized.", {
      lane: "ledger",
      owner: "index.js",
      file: INDEX_FILE
    });

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
    if (!doc || doc.getElementById("hearth-index-constraint-semiconductor-style")) return;

    const style = doc.createElement("style");
    style.id = "hearth-index-constraint-semiconductor-style";
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

      .hearth-ledger-button[disabled]{
        opacity:.58;
        cursor:not-allowed;
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

      [data-hearth-index-show-diagnostic-tab]{
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

      html[data-hearth-index-inspect-reserved-active="true"] [data-hearth-index-show-diagnostic-tab]{
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
      mount.dataset.hearthMountCreatedByIndexConstraintSemiconductor = "true";

      const parent = doc.getElementById("hearth-main") || doc.body || doc.documentElement;
      parent.appendChild(mount);
      state.mountCreatedByIndex = true;
    }

    mount.id = MOUNT_ID;
    mount.dataset.hearthCanvasMount = "true";
    mount.dataset.hearthIndexConstraintSemiconductor = CONTRACT;
    mount.dataset.hearthIndexReceipt = RECEIPT;
    mount.dataset.hearthPairedSemiconductor = "true";
    mount.dataset.hearthConstraintSemiconductor = INDEX_FILE;
    mount.dataset.hearthCoherenceSemiconductor = COHERENCE_FILE;
    mount.dataset.hearthClimateRouteRetired = "true";
    mount.dataset.hearthVisibleCarrierFirst = "true";
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

    let tab = doc.querySelector("[data-hearth-index-show-diagnostic-tab]");

    if (!tab) {
      tab = doc.createElement("button");
      tab.type = "button";
      tab.dataset.hearthIndexShowDiagnosticTab = "true";
      tab.textContent = "Show diagnostic";
      tab.setAttribute("aria-label", "Show Hearth diagnostic");
      doc.body.appendChild(tab);
    }

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
      doc.getElementById("hearthLoadCockpit");

    if (!cockpit) {
      cockpit = doc.createElement("aside");
      cockpit.id = "hearthLoadCockpit";
      cockpit.className = "hearth-ledger-cockpit";
      cockpit.dataset.hearthLoadCockpit = "true";
      cockpit.dataset.hearthFirstPaintCockpit = "true";
      cockpit.dataset.hearthCreatedByIndexConstraintSemiconductor = CONTRACT;
      cockpit.dataset.cockpitMode = "first-paint-loading";
      cockpit.setAttribute("aria-live", "polite");

      cockpit.innerHTML = `
        <div class="hearth-ledger-head">
          <div class="hearth-ledger-kicker">Hearth · Paired Semiconductor Load Ledger</div>
          <h2 class="hearth-ledger-title">STARTING HEARTH VISIBLE PROCESS</h2>
          <div class="hearth-ledger-meta" data-hearth-stage-label>F1A · HTML shell rendered</div>
          <div class="hearth-ledger-meta" data-hearth-heartbeat-text>heartbeat=active · elapsed=00:00</div>
          <div class="hearth-ledger-latest" data-hearth-latest-event>latest=INDEX_CONSTRAINT_SEMICONDUCTOR_LOADED</div>
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
    }

    cockpit.dataset.hearthPairedSemiconductor = "true";
    cockpit.dataset.hearthConstraintSemiconductor = INDEX_FILE;
    cockpit.dataset.hearthCoherenceSemiconductor = COHERENCE_FILE;
    cockpit.dataset.hearthIndexContract = CONTRACT;
    cockpit.dataset.hearthIndexReceipt = RECEIPT;
    cockpit.dataset.hearthSynchronizedLoading = "true";

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
      refs.inspectButton.onclick = () => setInspectReserved(true);
      state.inspectControlReserved = true;
    }

    if (refs.expandButton) {
      refs.expandButton.onclick = toggleExpanded;
    }

    mount.querySelectorAll("[data-hearth-mount-fallback], .mount-fallback").forEach((fallback) => {
      fallback.hidden = true;
      fallback.style.display = "none";
      fallback.dataset.hiddenByIndexConstraintSemiconductor = CONTRACT;
    });

    state.firstPaintCockpitReady = true;
    state.loadingScreenReady = true;
    state.visibleProgressStripReady = Boolean(refs.mainFill && refs.mainPercent);
    state.partialReceiptAvailable = true;

    const ledger = refs.ledger || ensureLedger();

    ledger.setLane("staticCockpit", {
      status: "READY",
      progress: stageProgress("F2"),
      event: "FIRST_PAINT_COCKPIT_VISIBLE",
      stage: "F2",
      owner: "index.js",
      file: INDEX_FILE,
      message: "First-paint cockpit visible; user is not blind."
    });

    ledger.setStage("F2", "First-paint cockpit visible.", {
      lane: "staticCockpit",
      owner: "index.js",
      file: INDEX_FILE
    });

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

    if (expanded) {
      refs.cockpit.style.maxHeight = "calc(100% - 20px)";
    } else {
      refs.cockpit.style.maxHeight = "";
    }
  }

  function setInspectReserved(active) {
    state.inspectModeReservedActive = Boolean(active);
    state.showDiagnosticTabVisible = Boolean(active);

    if (refs.cockpit) {
      refs.cockpit.dataset.cockpitMode = active ? "planet-inspect" : "first-paint-loading";
      refs.cockpit.dataset.hearthIndexInspectReservedActive = String(active);
    }

    if (doc && doc.documentElement) {
      doc.documentElement.dataset.hearthIndexInspectReservedActive = String(active);
    }

    if (refs.showTab) {
      refs.showTab.hidden = !active;
      refs.showTab.dataset.visible = String(active);
    }

    if (refs.inspectButton) {
      refs.inspectButton.textContent = active ? "Show diagnostic" : "Inspect planet";
      refs.inspectButton.onclick = () => setInspectReserved(!state.inspectModeReservedActive);
    }

    if (refs.mount) {
      refs.mount.dataset.hearthIndexInspectReservedActive = String(active);
    }

    const ledger = refs.ledger || ensureLedger();

    ledger.setLane("inspectMode", {
      status: active ? "RESERVED_ACTIVE" : "RESERVED",
      progress: active ? 84 : 50,
      event: active ? "INDEX_RESERVED_INSPECT_MODE_ACTIVE" : "INDEX_RESERVED_INSPECT_MODE_READY",
      stage: "F13",
      owner: "index.js",
      file: INDEX_FILE,
      message: active
        ? "Index reserved inspect mode active; coherence conductor will own final inspect truth."
        : "Inspect control reserved for coherence conductor."
    });

    render();
  }

  function scanKnownScripts() {
    if (!doc) return;

    const scripts = Array.from(doc.scripts || []);
    const ledger = refs.ledger || ensureLedger();

    SCRIPT_KEYS.forEach((item) => {
      const script = scripts.find((node) => {
        const src = node.getAttribute("src") || "";
        return src.includes(item.srcPart);
      });

      if (script) {
        ledger.setScript(item.key, {
          src: script.src || item.srcPart,
          status: "PRESENT",
          globalPresent: item.key === "coherenceConductor" ? Boolean(getConductorApi()) : false
        });
      }
    });

    state.conductorScriptPresent = Boolean(
      scripts.find((node) => (node.getAttribute("src") || "").includes(COHERENCE_FILE))
    );

    state.canvasScriptPresent = Boolean(
      scripts.find((node) => (node.getAttribute("src") || "").includes(CANVAS_FILE))
    );
  }

  function getConductorApi() {
    return (
      root.HEARTH_ROUTE_CONDUCTOR ||
      root.HearthRouteConductor ||
      root.HEARTH_ACTIVE_ROUTE ||
      (root.HEARTH && root.HEARTH.routeConductor) ||
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

  function conductorBootMethod(api) {
    if (!api) return "";
    if (isFunction(api.boot)) return "boot";
    if (isFunction(api.start)) return "start";
    if (isFunction(api.init)) return "init";
    if (isFunction(api.run)) return "run";
    return "";
  }

  function cacheKey() {
    return `${CONTRACT}-${Date.now()}`;
  }

  function scriptAlreadyPresent(srcPart) {
    if (!doc) return null;
    return Array.from(doc.scripts || []).find((script) => {
      const src = script.getAttribute("src") || "";
      return src.includes(srcPart);
    }) || null;
  }

  function injectConductorScript() {
    const ledger = refs.ledger || ensureLedger();

    const api = getConductorApi();

    if (api) {
      state.conductorGlobalPresent = true;
      state.conductorScriptLoaded = true;
      state.conductorScriptPresent = true;
      state.conductorContract = String(api.contract || "");
      state.conductorBootMethodPresent = Boolean(conductorBootMethod(api));
      state.conductorDelegationAccepted = true;

      ledger.setScript("coherenceConductor", {
        src: COHERENCE_FILE,
        status: "GLOBAL_PRESENT",
        globalPresent: true,
        loadedAt: nowIso()
      });

      acceptConductorIfPossible(api);
      return Promise.resolve(api);
    }

    const existing = scriptAlreadyPresent(COHERENCE_FILE);

    if (existing) {
      state.conductorScriptPresent = true;
      state.conductorScriptRequested = true;

      ledger.setScript("coherenceConductor", {
        src: existing.src || COHERENCE_FILE,
        status: "PRESENT_WAITING_GLOBAL",
        globalPresent: false,
        requestedAt: nowIso()
      });

      return waitForConductorGlobal(4200);
    }

    if (!doc || !doc.head) {
      state.conductorScriptError = "document.head unavailable";
      recordError("DOCUMENT_HEAD_MISSING", state.conductorScriptError);
      return Promise.resolve(null);
    }

    state.conductorScriptRequested = true;
    state.conductorDelegationReady = true;

    ledger.setScript("coherenceConductor", {
      src: COHERENCE_FILE,
      status: "REQUESTED",
      globalPresent: false,
      requestedAt: nowIso()
    });

    const script = doc.createElement("script");
    script.src = `${COHERENCE_FILE}?v=${encodeURIComponent(cacheKey())}`;
    script.defer = true;
    script.dataset.hearthPairedSemiconductor = "true";
    script.dataset.hearthLoadedByConstraintSemiconductor = CONTRACT;
    script.dataset.hearthScriptKey = "coherenceConductor";
    script.dataset.generatedImage = "false";
    script.dataset.graphicBox = "false";
    script.dataset.webgl = "false";
    script.dataset.visualPassClaimed = "false";

    return new Promise((resolve) => {
      let settled = false;

      function finish(status, error = "") {
        if (settled) return;
        settled = true;

        state.conductorScriptPresent = true;
        state.conductorScriptLoaded = status === "LOADED" || Boolean(getConductorApi());
        state.conductorScriptError = error;

        const conductor = getConductorApi();

        if (conductor) {
          state.conductorGlobalPresent = true;
          state.conductorContract = String(conductor.contract || "");
          state.conductorBootMethodPresent = Boolean(conductorBootMethod(conductor));
          state.conductorDelegationAccepted = true;
          acceptConductorIfPossible(conductor);
        }

        ledger.setScript("coherenceConductor", {
          src: script.src,
          status: conductor ? "GLOBAL_PRESENT" : status,
          globalPresent: Boolean(conductor),
          error,
          loadedAt: status === "LOADED" ? nowIso() : ""
        });

        resolve(conductor || null);
      }

      script.onload = () => {
        waitForConductorGlobal(1600).then((api) => {
          finish(api ? "LOADED" : "LOADED_GLOBAL_PENDING", api ? "" : "script loaded but conductor global not yet present");
        });
      };

      script.onerror = () => {
        finish("LOAD_FAILED", "coherence conductor script failed to load");
      };

      doc.head.appendChild(script);

      root.setTimeout(() => {
        if (settled) return;
        const api = getConductorApi();
        finish(api ? "TIMEOUT_GLOBAL_PRESENT" : "LOAD_TIMEOUT", api ? "" : "coherence conductor load timeout");
      }, 5200);
    });
  }

  function waitForConductorGlobal(timeoutMs) {
    const started = nowMs();

    return new Promise((resolve) => {
      const timer = root.setInterval(() => {
        const api = getConductorApi();

        if (api) {
          root.clearInterval(timer);
          state.conductorGlobalPresent = true;
          state.conductorContract = String(api.contract || "");
          state.conductorBootMethodPresent = Boolean(conductorBootMethod(api));
          state.conductorDelegationAccepted = true;
          acceptConductorIfPossible(api);
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

  function acceptConductorIfPossible(api) {
    if (!api) return false;

    const payload = {
      calledBy: CONTRACT,
      constraintSemiconductor: INDEX_FILE,
      coherenceSemiconductor: COHERENCE_FILE,
      pairedSemiconductor: true,
      systematicAndSynchronized: true,
      synchronizedLoading: true,
      sharedLedger: root.HEARTH_LOAD_LEDGER,
      mount: refs.mount || ensureMount(),
      cockpit: refs.cockpit || ensureCockpit(),
      indexReceipt: getReceipt(),
      visibleCarrierFirst: true,
      runtimeTableRequiredForFirstRender: false,
      sourceStackRequiredForFirstRender: false,
      wideProbeDeferred: true,
      climateRouteRetired: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };

    const method =
      isFunction(api.acceptConstraintSemiconductor) ? "acceptConstraintSemiconductor" :
        isFunction(api.hydrateIndexBridge) ? "hydrateIndexBridge" :
          isFunction(api.attachIndexBridge) ? "attachIndexBridge" :
            isFunction(api.receiveIndexBridge) ? "receiveIndexBridge" :
              "";

    if (method) {
      try {
        api[method](payload);
        state.conductorDelegationAccepted = true;
        state.conductorDelegationReady = true;

        refs.ledger.setLane("conductorHydration", {
          status: "ACCEPTED",
          progress: stageProgress("F8"),
          event: "COHERENCE_CONDUCTOR_ACCEPTED_INDEX_SEMICONDUCTOR",
          stage: "F8",
          owner: "index.js",
          file: INDEX_FILE,
          message: `Coherence conductor accepted index semiconductor through ${method}.`
        });

        return true;
      } catch (error) {
        recordError("CONDUCTOR_ACCEPTANCE_METHOD_FAILED", error && error.message ? error.message : String(error), { method });
      }
    }

    state.conductorDelegationAccepted = true;
    state.conductorDelegationReady = true;

    refs.ledger.setLane("conductorHydration", {
      status: "GLOBAL_PRESENT",
      progress: stageProgress("F8"),
      event: "COHERENCE_CONDUCTOR_GLOBAL_PRESENT",
      stage: "F8",
      owner: "index.js",
      file: INDEX_FILE,
      message: "Coherence conductor global present; boot call suppressed to avoid duplicate conductor execution."
    });

    return true;
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

    state.canvasGlobalPresent = Boolean(canvasApi);
    state.planetCanvasPresent = Boolean(canvas);
    state.planetCanvasNonZeroSize = Boolean(
      canvas &&
      (
        (canvas.width > 0 && canvas.height > 0) ||
        (rect && rect.width > 0 && rect.height > 0)
      )
    );

    state.visiblePlanetPossiblyAvailable = Boolean(
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

    if (refs.ledger) {
      refs.ledger.setLane("visiblePlanetProof", {
        status: state.visiblePlanetPossiblyAvailable ? "POSSIBLY_AVAILABLE" : "PENDING_COHERENCE_PROOF",
        progress: state.visiblePlanetPossiblyAvailable ? 88 : 45,
        event: state.visiblePlanetPossiblyAvailable ? "INDEX_VISUAL_HINT_CANVAS_PRESENT" : "INDEX_WAITING_FOR_VISIBLE_PLANET_PROOF",
        stage: "F13",
        owner: "index.js",
        file: INDEX_FILE,
        message: state.visiblePlanetPossiblyAvailable
          ? "Canvas present; coherence conductor must prove visible planet before completion."
          : "Index is waiting for coherence conductor visible-planet proof."
      });
    }
  }

  function scheduleRender() {
    if (renderTimer) return;

    renderTimer = root.setTimeout(() => {
      renderTimer = 0;
      render();
    }, 80);
  }

  function laneMarkup() {
    const ledger = refs.ledger || ensureLedger();
    const lanes = ledger.state.lanes || {};

    return LANES.map((def) => {
      const lane = lanes[def.key] || makeLane(def);
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

  function computeProgress() {
    const ledger = refs.ledger || ensureLedger();
    const lanes = ledger.state.lanes || {};
    let progress = state.displayProgress || 6;

    Object.keys(lanes).forEach((key) => {
      progress = Math.max(progress, Number(lanes[key].progress || 0));
    });

    if (state.conductorGlobalPresent) progress = Math.max(progress, 48);
    if (state.conductorDelegationAccepted) progress = Math.max(progress, 62);
    if (state.canvasGlobalPresent) progress = Math.max(progress, 70);
    if (state.visiblePlanetPossiblyAvailable) progress = Math.max(progress, 88);

    state.displayProgress = clamp(progress, 0, 96);
    return Math.round(state.displayProgress);
  }

  function render() {
    if (!refs.cockpit) return;

    markVisualHints();

    const ledger = refs.ledger || ensureLedger();
    const led = ledger.state;
    const progress = computeProgress();
    const elapsed = state.startedAt ? nowMs() - new Date(state.startedAt).getTime() : 0;

    const stage =
      state.visiblePlanetPossiblyAvailable ? "F13" :
        state.conductorDelegationAccepted ? "F8" :
          state.conductorScriptRequested ? "F3" :
            state.firstPaintCockpitReady ? "F2" :
              "F1A";

    state.currentStage = stage;
    if (stageRank(stage) >= stageRank(state.highestStage)) {
      state.highestStage = stage;
    }

    if (refs.title) {
      refs.title.textContent = state.visiblePlanetPossiblyAvailable
        ? "VISIBLE PLANET PROOF PASSING TO COHERENCE CONDUCTOR"
        : "STARTING HEARTH VISIBLE PROCESS";
    }

    if (refs.stage) {
      refs.stage.textContent = `${stage} · ${stageLabel(stage)}`;
    }

    if (refs.heartbeat) {
      refs.heartbeat.textContent = `constraint-side=true · synchronized=true · elapsed=${formatElapsed(elapsed)}`;
    }

    if (refs.latest) {
      const latest = led.events && led.events.length ? led.events[led.events.length - 1].id : state.latestEvent;
      refs.latest.textContent = `latest=${latest}`;
    }

    if (refs.mainFill) {
      refs.mainFill.style.width = `${progress}%`;
    }

    if (refs.mainPercent) {
      refs.mainPercent.textContent = `${progress}%`;
    }

    if (refs.laneList) {
      refs.laneList.innerHTML = laneMarkup();
    }

    if (refs.receiptPre) {
      refs.receiptPre.textContent = getReceiptText();
    }

    publishDataset();
    publishStatusNode();
  }

  function publishStatusNode() {
    if (!doc) return;

    const node =
      doc.getElementById(STATUS_ID) ||
      doc.querySelector("[data-hearth-route-status]");

    if (!node) return;

    node.textContent = [
      "Hearth index constraint semiconductor active.",
      `Contract ${CONTRACT}`,
      `Receipt ${RECEIPT}`,
      `File ${INDEX_FILE}`,
      `Paired with ${COHERENCE_FILE}`,
      "Index starts process true",
      "Hearth finishes process true",
      `First-paint cockpit ready ${state.firstPaintCockpitReady}`,
      `Visible progress strip ready ${state.visibleProgressStripReady}`,
      `Shared ledger present ${state.loadLedgerPresent}`,
      `Conductor global present ${state.conductorGlobalPresent}`,
      `Conductor delegation accepted ${state.conductorDelegationAccepted}`,
      `Conductor boot call suppressed ${state.conductorBootCallSuppressedToPreventDuplicate}`,
      `Planet canvas present ${state.planetCanvasPresent}`,
      `Planet canvas nonzero size ${state.planetCanvasNonZeroSize}`,
      `Visible planet possibly available ${state.visiblePlanetPossiblyAvailable}`,
      "Final completion owned by hearth.js",
      "Runtime Table required for first render false",
      "Source stack required for first render false",
      "Wide probe deferred true",
      "Generated image false",
      "GraphicBox false",
      "WebGL false",
      "Visual pass claimed false",
      `First failed coordinate ${state.firstFailedCoordinate}`,
      `Recommended next renewal target ${state.recommendedNextRenewalTarget}`,
      `Updated ${state.updatedAt || nowIso()}`
    ].join("\n");
  }

  function publishDataset() {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthIndexConstraintSemiconductorLoaded = "true";
    dataset.hearthIndexConstraintSemiconductorContract = CONTRACT;
    dataset.hearthIndexConstraintSemiconductorReceipt = RECEIPT;
    dataset.hearthIndexConstraintSemiconductorVersion = VERSION;
    dataset.hearthPairedSemiconductor = "true";
    dataset.hearthConstraintSemiconductor = INDEX_FILE;
    dataset.hearthCoherenceSemiconductor = COHERENCE_FILE;
    dataset.hearthIndexJsStartsProcess = "true";
    dataset.hearthJsFinishesProcess = "true";
    dataset.hearthSynchronizedLoading = "true";

    dataset.hearthIndexOwnsFirstPaintSurvival = "true";
    dataset.hearthIndexOwnsMountCertainty = "true";
    dataset.hearthIndexOwnsLoadingScreenCertainty = "true";
    dataset.hearthIndexOwnsEarlyLedger = "true";
    dataset.hearthIndexOwnsScriptOrderVisibility = "true";
    dataset.hearthIndexOwnsActiveRouteConduction = "false";
    dataset.hearthIndexOwnsFinalCompletion = "false";
    dataset.hearthIndexOwnsCanvasDrawing = "false";
    dataset.hearthIndexOwnsVisiblePlanetProof = "false";

    dataset.hearthFirstPaintCockpitReady = String(state.firstPaintCockpitReady);
    dataset.hearthVisibleProgressStripReady = String(state.visibleProgressStripReady);
    dataset.hearthLoadLedgerPresent = String(state.loadLedgerPresent);
    dataset.hearthCopyPartialDiagnosticReady = String(state.copyPartialDiagnosticReady);
    dataset.hearthReceiptToggleReady = String(state.receiptToggleReady);
    dataset.hearthInspectControlReserved = String(state.inspectControlReserved);
    dataset.hearthShowDiagnosticRestoreReserved = String(state.showDiagnosticRestoreReserved);

    dataset.hearthNewsProtocolInitialized = String(state.newsProtocolInitialized);
    dataset.hearthFibonacciSequenceInitialized = String(state.fibonacciSequenceInitialized);

    dataset.hearthActiveRouteFile = COHERENCE_FILE;
    dataset.hearthExpectedCoherenceConductor = EXPECTED_COHERENCE_CONDUCTOR;
    dataset.hearthConductorDelegationReady = String(state.conductorDelegationReady);
    dataset.hearthConductorDelegationAccepted = String(state.conductorDelegationAccepted);
    dataset.hearthConductorGlobalPresent = String(state.conductorGlobalPresent);
    dataset.hearthConductorScriptPresent = String(state.conductorScriptPresent);
    dataset.hearthConductorScriptRequested = String(state.conductorScriptRequested);
    dataset.hearthConductorScriptLoaded = String(state.conductorScriptLoaded);
    dataset.hearthConductorContractObserved = state.conductorContract;
    dataset.hearthConductorBootMethodPresent = String(state.conductorBootMethodPresent);
    dataset.hearthConductorBootCallSuppressedToPreventDuplicate = String(state.conductorBootCallSuppressedToPreventDuplicate);

    dataset.hearthPlanetCanvasPresent = String(state.planetCanvasPresent);
    dataset.hearthPlanetCanvasNonZeroSize = String(state.planetCanvasNonZeroSize);
    dataset.hearthVisiblePlanetPossiblyAvailable = String(state.visiblePlanetPossiblyAvailable);

    dataset.hearthClimateRouteRetired = "true";
    dataset.hearthRetiredClimateRouteFile = RETIRED_CLIMATE_FILE;
    dataset.hearthRuntimeTableRequiredForFirstRender = "false";
    dataset.hearthSourceStackRequiredForFirstRender = "false";
    dataset.hearthWideProbeDeferred = "true";

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";

    root.HEARTH_INDEX_CONSTRAINT_SEMICONDUCTOR_RECEIPT = getReceipt();
    root.HEARTH_INDEX_BRIDGE_RECEIPT = root.HEARTH_INDEX_CONSTRAINT_SEMICONDUCTOR_RECEIPT;
    root.HEARTH_INDEX_JS_RECEIPT = root.HEARTH_INDEX_CONSTRAINT_SEMICONDUCTOR_RECEIPT;
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

    const ledger = refs.ledger || ensureLedger();

    ledger.push({
      id: "INDEX_PARTIAL_DIAGNOSTIC_COPIED",
      stage: state.currentStage || "F2",
      lane: "ledger",
      status: ok ? "COPIED" : "COPY_FAILED",
      owner: "index.js",
      file: INDEX_FILE,
      message: ok ? "Partial diagnostic copied." : "Partial diagnostic copy failed."
    });

    return ok;
  }

  function getReceipt(extra = {}) {
    markVisualHints();

    const ledger = refs.ledger || root.HEARTH_LOAD_LEDGER || null;

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      expectedCoherenceConductor: EXPECTED_COHERENCE_CONDUCTOR,
      version: VERSION,
      authority: "hearth-index-constraint-semiconductor",
      destinationFile: INDEX_FILE,
      file: INDEX_FILE,
      route: "/showroom/globe/hearth/",
      role: "constraint-side-semiconductor",

      pairedSemiconductor: true,
      pairedWith: COHERENCE_FILE,
      indexJsStartsProcess: true,
      hearthJsFinishesProcess: true,
      systematicAndSynchronized: true,
      synchronizedLoading: true,

      ownsFirstPaintSurvival: true,
      ownsMountCertainty: true,
      ownsLoadingScreenCertainty: true,
      ownsEarlyLedger: true,
      ownsScriptOrderVisibility: true,
      ownsActiveRouteConduction: false,
      ownsFinalCompletion: false,
      ownsCanvasDrawing: false,
      ownsVisiblePlanetProof: false,
      ownsFinalDiagnosticReceipt: false,

      firstPaintCockpitReady: state.firstPaintCockpitReady,
      visibleProgressStripReady: state.visibleProgressStripReady,
      loadLedgerPresent: Boolean(root.HEARTH_LOAD_LEDGER),
      copyPartialDiagnosticReady: state.copyPartialDiagnosticReady,
      receiptToggleReady: state.receiptToggleReady,
      inspectControlReserved: state.inspectControlReserved,
      showDiagnosticRestoreReserved: state.showDiagnosticRestoreReserved,

      newsProtocolInitialized: state.newsProtocolInitialized,
      fibonacciSequenceInitialized: state.fibonacciSequenceInitialized,

      mountReady: state.mountReady,
      mountCreatedByIndex: state.mountCreatedByIndex,
      loadingScreenReady: state.loadingScreenReady,
      partialReceiptAvailable: state.partialReceiptAvailable,

      activeRouteConductor: COHERENCE_FILE,
      conductorDelegationReady: state.conductorDelegationReady,
      conductorDelegationAccepted: state.conductorDelegationAccepted,
      conductorGlobalPresent: state.conductorGlobalPresent,
      conductorScriptPresent: state.conductorScriptPresent,
      conductorScriptRequested: state.conductorScriptRequested,
      conductorScriptLoaded: state.conductorScriptLoaded,
      conductorScriptError: state.conductorScriptError,
      conductorContract: state.conductorContract,
      conductorBootMethodPresent: state.conductorBootMethodPresent,
      conductorBootCallSuppressedToPreventDuplicate: state.conductorBootCallSuppressedToPreventDuplicate,

      canvasScriptPresent: state.canvasScriptPresent,
      canvasGlobalPresent: state.canvasGlobalPresent,
      canvasFallbackRequested: false,
      canvasFallbackAllowed: false,

      climateRouteRetired: true,
      retiredClimateRoute: RETIRED_CLIMATE_FILE,
      runtimeTableRequiredForFirstRender: false,
      sourceStackRequiredForFirstRender: false,
      wideProbeDeferred: true,

      currentStage: state.currentStage,
      highestStage: state.highestStage,
      displayProgress: state.displayProgress,
      latestEvent: state.latestEvent,
      status: state.status,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      planetCanvasPresent: state.planetCanvasPresent,
      planetCanvasNonZeroSize: state.planetCanvasNonZeroSize,
      visiblePlanetPossiblyAvailable: state.visiblePlanetPossiblyAvailable,
      inspectModeReservedActive: state.inspectModeReservedActive,
      showDiagnosticTabVisible: state.showDiagnosticTabVisible,

      sharedLedger: ledger && ledger.state ? clonePlain(ledger.state) : null,
      errors: clonePlain(state.errors),

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      updatedAt: nowIso(),
      ...extra
    };
  }

  function getReceiptText() {
    const receipt = getReceipt();

    const ledger = receipt.sharedLedger || {};
    const lanes = Object.entries(ledger.lanes || {}).map(([key, lane]) => (
      `- ${key}: status=${lane.status}; fibonacci=${lane.fibonacci}; progress=${lane.progress}; event=${lane.latestEvent}; message=${lane.message}`
    )).join("\n") || "- none";

    const scripts = Object.entries(ledger.scripts || {}).map(([key, script]) => (
      `- ${key}: status=${script.status}; src=${script.src || ""}; globalPresent=${script.globalPresent === true}; error=${script.error || ""}`
    )).join("\n") || "- none";

    const events = (ledger.events || []).slice(-80).map((event) => (
      `- ${event.timestamp || ""} :: ${event.id || ""} :: stage=${event.stage || ""} :: lane=${event.lane || ""} :: ${event.message || ""}`
    )).join("\n") || "- none";

    const errors = receipt.errors.map((error) => (
      `- ${error.at} :: ${error.code} :: ${error.message}`
    )).join("\n") || "- none";

    return [
      "HEARTH_INDEX_CONSTRAINT_SEMICONDUCTOR_FIRST_PAINT_LEDGER_RECEIPT",
      "",
      `contract=${receipt.contract}`,
      `receipt=${receipt.receipt}`,
      `previousContract=${receipt.previousContract}`,
      `expectedCoherenceConductor=${receipt.expectedCoherenceConductor}`,
      `version=${receipt.version}`,
      `file=${receipt.file}`,
      `route=${receipt.route}`,
      `role=${receipt.role}`,
      "",
      `pairedSemiconductor=${receipt.pairedSemiconductor}`,
      `pairedWith=${receipt.pairedWith}`,
      `indexJsStartsProcess=${receipt.indexJsStartsProcess}`,
      `hearthJsFinishesProcess=${receipt.hearthJsFinishesProcess}`,
      `systematicAndSynchronized=${receipt.systematicAndSynchronized}`,
      `synchronizedLoading=${receipt.synchronizedLoading}`,
      "",
      `ownsFirstPaintSurvival=${receipt.ownsFirstPaintSurvival}`,
      `ownsMountCertainty=${receipt.ownsMountCertainty}`,
      `ownsLoadingScreenCertainty=${receipt.ownsLoadingScreenCertainty}`,
      `ownsEarlyLedger=${receipt.ownsEarlyLedger}`,
      `ownsScriptOrderVisibility=${receipt.ownsScriptOrderVisibility}`,
      `ownsActiveRouteConduction=${receipt.ownsActiveRouteConduction}`,
      `ownsFinalCompletion=${receipt.ownsFinalCompletion}`,
      `ownsCanvasDrawing=${receipt.ownsCanvasDrawing}`,
      `ownsVisiblePlanetProof=${receipt.ownsVisiblePlanetProof}`,
      `ownsFinalDiagnosticReceipt=${receipt.ownsFinalDiagnosticReceipt}`,
      "",
      `firstPaintCockpitReady=${receipt.firstPaintCockpitReady}`,
      `visibleProgressStripReady=${receipt.visibleProgressStripReady}`,
      `loadLedgerPresent=${receipt.loadLedgerPresent}`,
      `copyPartialDiagnosticReady=${receipt.copyPartialDiagnosticReady}`,
      `receiptToggleReady=${receipt.receiptToggleReady}`,
      `inspectControlReserved=${receipt.inspectControlReserved}`,
      `showDiagnosticRestoreReserved=${receipt.showDiagnosticRestoreReserved}`,
      "",
      `newsProtocolInitialized=${receipt.newsProtocolInitialized}`,
      `fibonacciSequenceInitialized=${receipt.fibonacciSequenceInitialized}`,
      "",
      `mountReady=${receipt.mountReady}`,
      `mountCreatedByIndex=${receipt.mountCreatedByIndex}`,
      `loadingScreenReady=${receipt.loadingScreenReady}`,
      `partialReceiptAvailable=${receipt.partialReceiptAvailable}`,
      "",
      `activeRouteConductor=${receipt.activeRouteConductor}`,
      `conductorDelegationReady=${receipt.conductorDelegationReady}`,
      `conductorDelegationAccepted=${receipt.conductorDelegationAccepted}`,
      `conductorGlobalPresent=${receipt.conductorGlobalPresent}`,
      `conductorScriptPresent=${receipt.conductorScriptPresent}`,
      `conductorScriptRequested=${receipt.conductorScriptRequested}`,
      `conductorScriptLoaded=${receipt.conductorScriptLoaded}`,
      `conductorScriptError=${receipt.conductorScriptError}`,
      `conductorContract=${receipt.conductorContract}`,
      `conductorBootMethodPresent=${receipt.conductorBootMethodPresent}`,
      `conductorBootCallSuppressedToPreventDuplicate=${receipt.conductorBootCallSuppressedToPreventDuplicate}`,
      "",
      `canvasScriptPresent=${receipt.canvasScriptPresent}`,
      `canvasGlobalPresent=${receipt.canvasGlobalPresent}`,
      `canvasFallbackRequested=${receipt.canvasFallbackRequested}`,
      `canvasFallbackAllowed=${receipt.canvasFallbackAllowed}`,
      "",
      `climateRouteRetired=${receipt.climateRouteRetired}`,
      `retiredClimateRoute=${receipt.retiredClimateRoute}`,
      `runtimeTableRequiredForFirstRender=${receipt.runtimeTableRequiredForFirstRender}`,
      `sourceStackRequiredForFirstRender=${receipt.sourceStackRequiredForFirstRender}`,
      `wideProbeDeferred=${receipt.wideProbeDeferred}`,
      "",
      `currentStage=${receipt.currentStage}`,
      `highestStage=${receipt.highestStage}`,
      `displayProgress=${receipt.displayProgress}`,
      `latestEvent=${receipt.latestEvent}`,
      `status=${receipt.status}`,
      `firstFailedCoordinate=${receipt.firstFailedCoordinate}`,
      `recommendedNextRenewalTarget=${receipt.recommendedNextRenewalTarget}`,
      "",
      `planetCanvasPresent=${receipt.planetCanvasPresent}`,
      `planetCanvasNonZeroSize=${receipt.planetCanvasNonZeroSize}`,
      `visiblePlanetPossiblyAvailable=${receipt.visiblePlanetPossiblyAvailable}`,
      `inspectModeReservedActive=${receipt.inspectModeReservedActive}`,
      `showDiagnosticTabVisible=${receipt.showDiagnosticTabVisible}`,
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
      "ERRORS",
      errors,
      "",
      `generatedImage=${receipt.generatedImage}`,
      `graphicBox=${receipt.graphicBox}`,
      `webGL=${receipt.webGL}`,
      `visualPassClaimed=${receipt.visualPassClaimed}`,
      "",
      `updatedAt=${receipt.updatedAt}`
    ].join("\n");
  }

  function startHeartbeat() {
    if (heartbeatTimer) root.clearInterval(heartbeatTimer);

    heartbeatTimer = root.setInterval(() => {
      state.heartbeatElapsedMs = state.startedAt ? nowMs() - new Date(state.startedAt).getTime() : 0;
      markVisualHints();
      render();
    }, 1000);
  }

  function startWatchdog() {
    if (watchdogTimer) root.clearInterval(watchdogTimer);

    let ticks = 0;

    watchdogTimer = root.setInterval(() => {
      ticks += 1;

      const conductor = getConductorApi();
      const ledger = refs.ledger || ensureLedger();

      if (conductor && !state.conductorGlobalPresent) {
        state.conductorGlobalPresent = true;
        state.conductorContract = String(conductor.contract || "");
        state.conductorBootMethodPresent = Boolean(conductorBootMethod(conductor));
        state.conductorDelegationAccepted = true;
        acceptConductorIfPossible(conductor);
      }

      markVisualHints();

      if (state.visiblePlanetPossiblyAvailable) {
        state.firstFailedCoordinate = "INDEX_CONSTRAINT_COMPLETE_COHERENCE_RECEIPT_PENDING";
        state.recommendedNextRenewalTarget = COHERENCE_FILE;
        state.status = "VISIBLE_PLANET_HINT_PRESENT_COHERENCE_COMPLETION_PENDING";
      } else if (state.conductorDelegationAccepted) {
        state.firstFailedCoordinate = "COHERENCE_CONDUCTOR_ACCEPTED_VISIBLE_PLANET_PENDING";
        state.recommendedNextRenewalTarget = COHERENCE_FILE;
        state.status = "COHERENCE_CONDUCTOR_ACCEPTED";
      } else if (ticks > 18) {
        state.firstFailedCoordinate = "COHERENCE_CONDUCTOR_NOT_CONFIRMED";
        state.recommendedNextRenewalTarget = COHERENCE_FILE;
        state.status = "COHERENCE_CONDUCTOR_NOT_CONFIRMED";
      }

      if (ticks % 3 === 0) {
        ledger.setLane("scriptOrder", {
          status: state.conductorDelegationAccepted ? "ACCEPTED" : "WATCHING",
          progress: state.conductorDelegationAccepted ? stageProgress("F8") : stageProgress("F3"),
          event: state.conductorDelegationAccepted ? "CONDUCTOR_DELEGATION_ACCEPTED" : "SCRIPT_ORDER_WATCHDOG_ACTIVE",
          stage: state.conductorDelegationAccepted ? "F8" : "F3",
          owner: "index.js",
          file: INDEX_FILE,
          message: state.conductorDelegationAccepted
            ? "Coherence conductor accepted or present."
            : "Constraint semiconductor is watching script order."
        });
      }

      if (ticks >= 80 || state.visiblePlanetPossiblyAvailable) {
        root.clearInterval(watchdogTimer);
        watchdogTimer = 0;
      }

      render();
    }, 300);
  }

  async function boot() {
    if (bootStarted) {
      render();
      return getReceipt({ status: "BOOT_ALREADY_STARTED" });
    }

    bootStarted = true;
    state.startedAt = nowIso();
    state.updatedAt = state.startedAt;
    state.status = "BOOTING";
    state.firstFailedCoordinate = "INDEX_CONSTRAINT_BOOT_STARTED";
    state.recommendedNextRenewalTarget = "shared-ledger-and-coherence-conductor";

    retireClimateRoute();

    ensureMount();
    ensureLedger();
    ensureCockpit();

    const ledger = refs.ledger;

    ledger.setLane("shell", {
      status: "READY",
      progress: stageProgress("F1A"),
      event: "HTML_SHELL_RENDERED",
      stage: "F1A",
      owner: "index.js",
      file: INDEX_FILE,
      message: "HTML shell rendered and mount confirmed by index constraint semiconductor."
    });

    ledger.setStage("F1A", "HTML shell rendered.", {
      lane: "shell",
      owner: "index.js",
      file: INDEX_FILE
    });

    scanKnownScripts();

    ledger.setLane("scriptOrder", {
      status: "ACTIVE",
      progress: stageProgress("F3"),
      event: "SCRIPT_ORDER_VISIBILITY_ACTIVE",
      stage: "F3",
      owner: "index.js",
      file: INDEX_FILE,
      message: "Script-order visibility active."
    });

    ledger.setStage("F3", "Script-order visibility active.", {
      lane: "scriptOrder",
      owner: "index.js",
      file: INDEX_FILE
    });

    publishDataset();
    render();

    const conductor = await injectConductorScript();

    if (conductor) {
      state.conductorDelegationAccepted = true;
      state.firstFailedCoordinate = "COHERENCE_CONDUCTOR_ACCEPTED_VISIBLE_PLANET_PENDING";
      state.recommendedNextRenewalTarget = COHERENCE_FILE;
      state.status = "COHERENCE_CONDUCTOR_ACCEPTED";
    } else {
      state.conductorDelegationAccepted = false;
      state.firstFailedCoordinate = "COHERENCE_CONDUCTOR_UNAVAILABLE";
      state.recommendedNextRenewalTarget = COHERENCE_FILE;
      state.status = "COHERENCE_CONDUCTOR_UNAVAILABLE";
      recordError("COHERENCE_CONDUCTOR_UNAVAILABLE", "index.js did not find or load the coherence conductor.");
    }

    startHeartbeat();
    startWatchdog();

    render();

    return getReceipt({ status: state.status });
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

    const ledger = refs.ledger || root.HEARTH_LOAD_LEDGER;

    if (ledger && isFunction(ledger.push)) {
      ledger.push({
        id: "INDEX_CONSTRAINT_SEMICONDUCTOR_DISPOSED",
        stage: state.currentStage,
        lane: "ledger",
        status: "DISPOSED",
        owner: "index.js",
        file: INDEX_FILE,
        message: reason
      });
    }
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    expectedCoherenceConductor: EXPECTED_COHERENCE_CONDUCTOR,
    version: VERSION,

    boot,
    start: boot,
    init: boot,
    run: boot,
    dispose,
    getReceipt,
    getReceiptText,
    copyDiagnostic,

    indexFile: INDEX_FILE,
    constraintSemiconductor: INDEX_FILE,
    coherenceSemiconductor: COHERENCE_FILE,
    pairedWith: COHERENCE_FILE,

    supportsPairedSemiconductor: true,
    supportsConstraintSideSemiconductor: true,
    supportsFirstPaintSurvival: true,
    supportsMountCertainty: true,
    supportsLoadingScreenCertainty: true,
    supportsEarlyLedger: true,
    supportsScriptOrderVisibility: true,
    supportsSynchronizedLoading: true,
    supportsPartialDiagnosticBeforeCompletion: true,
    supportsInspectControlReservation: true,
    supportsShowDiagnosticRestoreReservation: true,
    supportsClimateRouteRetirement: true,
    supportsVisibleCarrierFirst: true,

    ownsActiveRouteConduction: false,
    ownsFinalCompletion: false,
    ownsCanvasDrawing: false,
    ownsVisiblePlanetProof: false,
    ownsFinalDiagnosticReceipt: false,

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

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.indexConstraintSemiconductor = api;
  root.HEARTH.indexBridge = api;

  root.HEARTH_INDEX_CONSTRAINT_SEMICONDUCTOR = api;
  root.HEARTH_INDEX_BRIDGE = api;
  root.HearthIndexBridge = api;
  root.HEARTH_INDEX_JS = api;
  root.HEARTH_INDEX_CONSTRAINT_SEMICONDUCTOR_CONTRACT = CONTRACT;
  root.HEARTH_INDEX_CONSTRAINT_SEMICONDUCTOR_RECEIPT = getReceipt({ status: "LOADED_NOT_BOOTED" });
  root.__HEARTH_INDEX_BRIDGE_FILE__ = INDEX_FILE;
  root.__HEARTH_CONSTRAINT_SEMICONDUCTOR_FILE__ = INDEX_FILE;
  root.__HEARTH_COHERENCE_SEMICONDUCTOR_FILE__ = COHERENCE_FILE;
  root.__HEARTH_ACTIVE_ROUTE_FILE__ = COHERENCE_FILE;
  root.__HEARTH_CLIMATE_ROUTE_RETIRED__ = true;

  publishDataset();

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

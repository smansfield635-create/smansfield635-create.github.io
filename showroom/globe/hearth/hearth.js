// /showroom/globe/hearth/index.js
// HEARTH_INDEX_ROUTE_SOCKET_FIRST_PAINT_HANDOFF_TNT_v2
// Full-file replacement.
// Route socket / Step 1 authority only.
// Purpose:
// - Own Step 1 only: route socket, mount certainty, first-paint cockpit, early ledger, partial diagnostic access.
// - Publish a clean handoff packet for /showroom/globe/hearth/hearth.js.
// - Preserve Copy diagnostic / Show receipt / Inspect planet / Show diagnostic.
// - Prevent index.js from acting as route brain.
// Does not own:
// - Steps 2 through 11
// - Runtime Table session creation
// - checkpoint governance
// - NEWS route completion
// - Fibonacci F3/F5/F8/F13/F21 authority
// - canvas drawing or canvas phase truth
// - visible planet proof
// - inspect-mode proof
// - completion latch
// - final diagnostic receipt
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_INDEX_ROUTE_SOCKET_FIRST_PAINT_HANDOFF_TNT_v2";
  const RECEIPT = "HEARTH_INDEX_ROUTE_SOCKET_FIRST_PAINT_HANDOFF_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "HEARTH_INDEX_CONSTRAINT_SEMICONDUCTOR_FIRST_PAINT_LEDGER_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_INDEX_ROUTE_SOCKET_FIRST_PAINT_HANDOFF_PRECODE_FINAL_DRAFT_v2";
  const VERSION = "2026-05-29.hearth-index-route-socket-first-paint-handoff-v2";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const ROUTE = "/showroom/globe/hearth/";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const COHERENCE_FILE = "/showroom/globe/hearth/hearth.js";
  const RETIRED_CLIMATE_FILE = "/showroom/globe/hearth/hearth.climate.route.js";

  const MOUNT_ID = "hearthCanvasMount";
  const COCKPIT_ID = "hearthLoadCockpit";
  const STATUS_ID = "hearth-route-status";
  const STYLE_ID = "hearth-index-route-socket-first-paint-handoff-style";

  const INDEX_MAX_FIBONACCI_STAGE = "F2";

  const FIBONACCI_INDEX_SEQUENCE = Object.freeze([
    {
      id: "F1A_HTML_SHELL_RENDERED",
      stage: "F1A",
      rank: 1,
      progress: 6,
      lane: "shell",
      label: "HTML shell rendered",
      event: "HTML_SHELL_RENDERED"
    },
    {
      id: "F1B_LOAD_LEDGER_INITIALIZED",
      stage: "F1B",
      rank: 2,
      progress: 12,
      lane: "ledger",
      label: "Shared ledger seeded",
      event: "LOAD_LEDGER_INITIALIZED"
    },
    {
      id: "F2_FIRST_PAINT_COCKPIT_VISIBLE",
      stage: "F2",
      rank: 3,
      progress: 22,
      lane: "firstPaint",
      label: "First-paint cockpit visible",
      event: "FIRST_PAINT_COCKPIT_VISIBLE"
    }
  ]);

  const FUTURE_STEPS = Object.freeze([
    "Step 2 · Script-order authority intake · hearth.js",
    "Step 3 · Runtime Table session consumption · hearth.js",
    "Step 4 · NEWS checkpoint governance · hearth.js",
    "Step 5 · Fibonacci checkpoint sequencing · hearth.js",
    "Step 6 · Canvas carrier coordination · hearth.js",
    "Step 7 · Atlas / texture / frame receipt consumption · hearth.js",
    "Step 8 · Visible planet proof · hearth.js",
    "Step 9 · Inspect mode truth · hearth.js",
    "Step 10 · Completion latch / F21 · hearth.js",
    "Step 11 · Final diagnostic receipt · hearth.js"
  ]);

  const RECEIVER_METHODS = Object.freeze([
    "acceptIndexHandoff",
    "acceptConstraintSemiconductor",
    "hydrateIndexBridge",
    "attachIndexBridge",
    "receiveIndexBridge"
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: INDEX_FILE,
    route: ROUTE,
    role: "route-socket-step-1",

    pairedSemiconductor: true,
    pairedWith: COHERENCE_FILE,
    indexJsStartsProcess: true,
    hearthJsFinishesProcess: true,
    systematicAndSynchronized: true,
    synchronizedLoading: true,

    ownsStep1: true,
    ownsSteps2Through11: false,
    hearthJsOwnsSteps2Through11: true,

    ownsFirstPaintSurvival: true,
    ownsMountCertainty: true,
    ownsLoadingScreenCertainty: true,
    ownsEarlyLedger: true,
    ownsPartialDiagnosticAccess: true,
    ownsRouteSocket: true,

    ownsActiveRouteConduction: false,
    ownsRuntimeTableSession: false,
    ownsCheckpointGovernor: false,
    ownsCanvasDrawing: false,
    ownsCanvasCoordination: false,
    ownsVisiblePlanetProof: false,
    ownsInspectModeTruth: false,
    ownsFinalCompletion: false,
    ownsFinalDiagnosticReceipt: false,
    ownsVisualPassClaim: false,

    indexMaxFibonacciStage: INDEX_MAX_FIBONACCI_STAGE,
    currentStage: "F1A",
    highestStage: "F1A",
    completedIndexCheckpoints: [],
    displayProgress: 0,

    newsProtocolInitialized: false,
    fibonacciSequenceInitialized: false,
    indexNewsPassed: false,
    northSocketReady: false,
    eastHandoffReady: false,
    westRecoverabilityReady: false,
    southHandoffEmitted: false,

    mountReady: false,
    mountCreatedByIndex: false,
    cockpitReady: false,
    ledgerReady: false,
    partialDiagnosticReady: false,
    receiptToggleReady: false,
    dockHideShowReady: false,
    showDiagnosticReady: false,

    receiptVisible: false,
    dockHiddenForInspection: false,
    cockpitExpanded: false,

    handoffPacketReady: false,
    handoffPublished: false,
    handoffCreatedAt: "",
    handoffDeliveryAttempted: false,
    hearthReceiverAccepted: false,
    hearthReceiverMethod: "",
    hearthReceiverError: "",

    hearthScriptPresent: false,
    hearthScriptInjected: false,
    hearthScriptLoaded: false,
    hearthScriptError: "",
    hearthGlobalPresent: false,

    climateRouteRetired: true,
    runtimeTableMutation: false,
    canvasMutation: false,
    runtimeTableRequiredForFirstRender: false,
    sourceStackRequiredForFirstRender: false,
    wideProbeDeferred: true,

    latestEvent: "INDEX_ROUTE_SOCKET_LOADED",
    status: "LOADED_NOT_BOOTED",
    firstFailedCoordinate: "INDEX_ROUTE_SOCKET_NOT_STARTED",
    recommendedNextRenewalTarget: "boot-index-route-socket",

    errors: [],
    events: [],
    startedAt: "",
    updatedAt: "",

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
    futureList: null,
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

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
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

  function formatElapsed(startIso) {
    if (!startIso) return "00:00";

    const startMs = new Date(startIso).getTime();
    const elapsed = Number.isFinite(startMs) ? Math.max(0, nowMs() - startMs) : 0;
    const total = Math.floor(elapsed / 1000);
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function findIndexCheckpoint(id) {
    return FIBONACCI_INDEX_SEQUENCE.find((checkpoint) => checkpoint.id === id || checkpoint.event === id || checkpoint.stage === id) || null;
  }

  function markEvent(event, detail = {}) {
    const item = {
      event,
      detail: clonePlain(detail),
      at: nowIso()
    };

    state.events.push(item);
    if (state.events.length > 160) {
      state.events.splice(0, state.events.length - 160);
    }

    state.latestEvent = event;
    state.updatedAt = item.at;

    if (refs.ledger && isFunction(refs.ledger.push)) {
      refs.ledger.push({
        id: event,
        stage: state.currentStage,
        lane: detail.lane || "",
        status: detail.status || "OBSERVED",
        owner: "index.js",
        file: INDEX_FILE,
        message: detail.message || event,
        detail
      });
    }

    return item;
  }

  function recordError(code, message, detail = {}) {
    const item = {
      code,
      message: String(message || ""),
      detail: clonePlain(detail),
      at: nowIso()
    };

    state.errors.push(item);
    if (state.errors.length > 60) {
      state.errors.splice(0, state.errors.length - 60);
    }

    state.updatedAt = item.at;

    if (refs.ledger && isFunction(refs.ledger.push)) {
      refs.ledger.push({
        id: "INDEX_ROUTE_SOCKET_ERROR",
        stage: state.currentStage,
        lane: "errors",
        status: "ERROR",
        owner: "index.js",
        file: INDEX_FILE,
        message: `${code}: ${message}`,
        detail: item
      });
    }

    return item;
  }

  function completeIndexCheckpoint(id, detail = {}) {
    const checkpoint = findIndexCheckpoint(id);
    if (!checkpoint) return false;

    if (!state.completedIndexCheckpoints.includes(checkpoint.id)) {
      state.completedIndexCheckpoints.push(checkpoint.id);
    }

    state.currentStage = checkpoint.stage;
    state.highestStage = checkpoint.stage;
    state.displayProgress = Math.max(state.displayProgress, checkpoint.progress);

    markEvent(checkpoint.event, {
      ...detail,
      lane: checkpoint.lane,
      checkpointId: checkpoint.id,
      stage: checkpoint.stage,
      status: "COMPLETE",
      message: checkpoint.label
    });

    if (refs.ledger && isFunction(refs.ledger.setIndexLane)) {
      refs.ledger.setIndexLane(checkpoint.lane, {
        status: "COMPLETE",
        stage: checkpoint.stage,
        progress: checkpoint.progress,
        event: checkpoint.event,
        message: checkpoint.label
      });
    }

    return true;
  }

  function ensureStyle() {
    if (!doc || doc.getElementById(STYLE_ID)) return;

    const style = doc.createElement("style");
    style.id = STYLE_ID;
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
        min-height:168px;
        overflow:hidden;
        border:1px solid rgba(231,188,105,.34);
        border-radius:24px;
        background:
          radial-gradient(circle at 12% 0%,rgba(231,188,105,.16),transparent 20rem),
          radial-gradient(circle at 90% 18%,rgba(141,216,255,.12),transparent 22rem),
          linear-gradient(180deg,rgba(7,18,33,.92),rgba(2,8,17,.84));
        color:rgba(238,246,255,.94);
        box-shadow:0 22px 70px rgba(0,0,0,.44), inset 0 1px 0 rgba(255,255,255,.08);
        backdrop-filter:blur(10px);
        font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        transition:max-height .22s ease,opacity .18s ease,visibility .18s ease,transform .22s ease;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="compact-dock"]{
        inset:auto 10px 10px 10px;
        min-height:128px;
        max-height:182px;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="compact-dock"] .hearth-ledger-scroll{
        display:none;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="expanded-cockpit"]{
        inset:10px;
        max-height:calc(100% - 20px);
        min-height:170px;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="planet-inspect"]{
        opacity:0!important;
        visibility:hidden!important;
        pointer-events:none!important;
        transform:translateY(26px) scale(.985)!important;
        max-height:0!important;
        min-height:0!important;
        overflow:hidden!important;
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

      .hearth-ledger-lanes,
      .hearth-ledger-future{
        display:grid;
        gap:7px;
      }

      .hearth-ledger-future{
        margin-top:10px;
      }

      .hearth-ledger-lane{
        display:grid;
        gap:5px;
        border:1px solid rgba(255,255,255,.08);
        border-radius:13px;
        padding:8px;
        background:rgba(255,255,255,.035);
      }

      .hearth-ledger-lane[data-status="PASSIVE_HANDOFF"]{
        border-color:rgba(141,216,255,.12);
        background:rgba(141,216,255,.035);
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

      [data-hearth-index-show-diagnostic-tab]{
        position:fixed;
        right:max(12px,env(safe-area-inset-right));
        bottom:max(72px,calc(env(safe-area-inset-bottom) + 72px));
        z-index:10000;
        display:none;
        align-items:center;
        justify-content:center;
        min-height:38px;
        padding:10px 14px;
        border-radius:999px;
        border:1px solid rgba(231,188,105,.66);
        color:#06101e;
        background:linear-gradient(135deg,#ffe8a3,#e7bc69);
        box-shadow:0 16px 44px rgba(0,0,0,.40), inset 0 1px 0 rgba(255,255,255,.28);
        font:950 .70rem/1 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        letter-spacing:.08em;
        text-transform:uppercase;
        cursor:pointer;
      }

      html[data-hearth-index-dock-hidden-for-inspection="true"] [data-hearth-index-show-diagnostic-tab]{
        display:inline-flex;
      }

      @media (max-width:760px){
        .hearth-ledger-cockpit{
          inset:8px;
          min-height:166px;
          border-radius:20px;
        }

        .hearth-ledger-cockpit[data-cockpit-mode="compact-dock"]{
          inset:auto 8px 8px 8px;
          max-height:188px;
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

        [data-hearth-index-show-diagnostic-tab]{
          right:max(10px,env(safe-area-inset-right));
          bottom:max(68px,calc(env(safe-area-inset-bottom) + 68px));
          min-height:34px;
          padding:9px 12px;
          font-size:.64rem;
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
      mount.dataset.hearthMountCreatedByIndexRouteSocket = "true";

      const parent = doc.getElementById("hearth-main") || doc.body || doc.documentElement;
      parent.appendChild(mount);

      state.mountCreatedByIndex = true;
    }

    mount.id = MOUNT_ID;
    mount.dataset.hearthCanvasMount = "true";
    mount.dataset.hearthIndexRouteSocket = CONTRACT;
    mount.dataset.hearthIndexRouteSocketReceipt = RECEIPT;
    mount.dataset.hearthIndexStep1Complete = String(state.completedIndexCheckpoints.includes("F2_FIRST_PAINT_COCKPIT_VISIBLE"));
    mount.dataset.hearthIndexMaxFibonacciStage = INDEX_MAX_FIBONACCI_STAGE;
    mount.dataset.hearthJsOwnsSteps2Through11 = "true";
    mount.dataset.hearthPairedSemiconductor = "true";
    mount.dataset.hearthConstraintSemiconductor = INDEX_FILE;
    mount.dataset.hearthCoherenceSemiconductor = COHERENCE_FILE;
    mount.dataset.generatedImage = "false";
    mount.dataset.graphicBox = "false";
    mount.dataset.webgl = "false";
    mount.dataset.visualPassClaimed = "false";

    mount.style.position = mount.style.position || "relative";
    mount.style.overflow = "hidden";
    mount.style.touchAction = "none";

    refs.mount = mount;
    state.mountReady = true;

    return mount;
  }

  function makeIndexLane(def) {
    return {
      key: def.lane,
      checkpointId: def.id,
      stage: def.stage,
      rank: def.rank,
      label: def.label,
      event: def.event,
      status: "PENDING",
      progress: 0,
      message: `${def.label} pending.`,
      owner: INDEX_FILE,
      updatedAt: nowIso()
    };
  }

  function ensureLedger() {
    const ledger = {};
    const led = {
      contract: "HEARTH_STEP1_ROUTE_SOCKET_SHARED_LEDGER_v2",
      createdBy: CONTRACT,
      ownerModel: "paired-semiconductor",
      constraintSemiconductor: INDEX_FILE,
      coherenceSemiconductor: COHERENCE_FILE,
      route: ROUTE,
      indexOwnsStep1: true,
      indexOwnsSteps2Through11: false,
      hearthJsOwnsSteps2Through11: true,
      indexMaxFibonacciStage: INDEX_MAX_FIBONACCI_STAGE,
      currentIndexStage: "F1A",
      highestIndexStage: "F1A",
      completionAuthority: COHERENCE_FILE,
      indexOwnsFinalCompletion: false,
      visualPassClaimed: false,
      newsProtocolInitialized: true,
      fibonacciSequenceInitialized: true,
      lanes: {},
      events: [],
      errors: [],
      startedAt: state.startedAt || nowIso(),
      updatedAt: nowIso()
    };

    FIBONACCI_INDEX_SEQUENCE.forEach((def) => {
      led.lanes[def.lane] = makeIndexLane(def);
    });

    ledger.state = led;

    ledger.push = function push(event = {}) {
      const evt = {
        id: event.id || event.event || "INDEX_LEDGER_EVENT",
        stage: event.stage || state.currentStage || "F1A",
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
      if (led.events.length > 240) {
        led.events.splice(0, led.events.length - 240);
      }

      led.updatedAt = evt.timestamp;
      return evt;
    };

    ledger.setIndexLane = function setIndexLane(key, next = {}) {
      const lane = led.lanes[key] || {
        key,
        checkpointId: "",
        stage: next.stage || "F1A",
        rank: 0,
        label: key,
        event: next.event || "",
        status: "PENDING",
        progress: 0,
        message: "",
        owner: INDEX_FILE,
        updatedAt: nowIso()
      };

      lane.status = next.status || lane.status;
      lane.stage = next.stage || lane.stage;
      lane.progress = Math.max(Number(lane.progress || 0), Number(next.progress || 0));
      lane.event = next.event || lane.event;
      lane.message = next.message || lane.message;
      lane.owner = INDEX_FILE;
      lane.updatedAt = nowIso();

      led.lanes[key] = lane;
      led.currentIndexStage = state.currentStage;
      led.highestIndexStage = state.highestStage;
      led.updatedAt = lane.updatedAt;

      ledger.push({
        id: lane.event,
        stage: lane.stage,
        lane: key,
        status: lane.status,
        owner: "index.js",
        file: INDEX_FILE,
        message: lane.message,
        progress: lane.progress
      });

      return lane;
    };

    ledger.getReceipt = function getReceiptFromLedger() {
      return clonePlain(led);
    };

    ledger.getReceiptText = function getReceiptTextFromLedger() {
      return getReceiptText();
    };

    ledger.copyDiagnostic = function copyDiagnosticFromLedger() {
      return copyDiagnostic();
    };

    root.HEARTH_LOAD_LEDGER = ledger;
    refs.ledger = ledger;

    state.ledgerReady = true;
    state.newsProtocolInitialized = true;
    state.fibonacciSequenceInitialized = true;

    completeIndexCheckpoint("F1B_LOAD_LEDGER_INITIALIZED", {
      message: "Step 1 shared ledger seeded by index route socket."
    });

    return ledger;
  }

  function ensureShowTab() {
    if (!doc) return null;

    let tab =
      doc.querySelector("[data-hearth-index-show-diagnostic-tab]") ||
      doc.querySelector("[data-hearth-coherence-show-diagnostic-tab]");

    if (!tab) {
      tab = doc.createElement("button");
      tab.type = "button";
      tab.dataset.hearthIndexShowDiagnosticTab = "true";
      tab.textContent = "Show diagnostic";
      tab.setAttribute("aria-label", "Show Hearth diagnostic");
      doc.body.appendChild(tab);
    }

    tab.dataset.hearthIndexShowDiagnosticTab = "true";
    tab.onclick = () => setDockHiddenForInspection(false);

    refs.showTab = tab;
    state.showDiagnosticReady = true;
    return tab;
  }

  function ensureCockpit() {
    if (!doc) return null;

    const mount = refs.mount || ensureMount();
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
      cockpit.dataset.hearthIndexRouteSocketCockpit = CONTRACT;
      cockpit.dataset.cockpitMode = "compact-dock";
      cockpit.setAttribute("aria-live", "polite");

      cockpit.innerHTML = `
        <div class="hearth-ledger-head">
          <div class="hearth-ledger-kicker">Hearth · Step 1 Route Socket</div>
          <h2 class="hearth-ledger-title">STARTING HEARTH VISIBLE PROCESS</h2>
          <div class="hearth-ledger-meta" data-hearth-stage-label>F1A · HTML shell rendered</div>
          <div class="hearth-ledger-meta" data-hearth-heartbeat-text>Step 1 only · hearth.js owns Steps 2–11</div>
          <div class="hearth-ledger-latest" data-hearth-latest-event>latest=INDEX_ROUTE_SOCKET_LOADED</div>
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
          <div class="hearth-ledger-future" data-hearth-future-list></div>
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
    cockpit.dataset.hearthIndexRouteSocket = CONTRACT;
    cockpit.dataset.hearthIndexReceipt = RECEIPT;
    cockpit.dataset.hearthIndexOwnsStep1 = "true";
    cockpit.dataset.hearthIndexOwnsSteps2Through11 = "false";
    cockpit.dataset.hearthJsOwnsSteps2Through11 = "true";
    cockpit.dataset.hearthIndexMaxFibonacciStage = INDEX_MAX_FIBONACCI_STAGE;
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
    refs.futureList = cockpit.querySelector("[data-hearth-future-list]");
    refs.receiptBox = cockpit.querySelector("[data-hearth-receipt-box]");
    refs.receiptPre = cockpit.querySelector("[data-hearth-receipt-text]");
    refs.copyButton = cockpit.querySelector("[data-hearth-copy-diagnostic]");
    refs.receiptToggle = cockpit.querySelector("[data-hearth-toggle-receipt]");
    refs.inspectButton = cockpit.querySelector("[data-hearth-inspect-planet]");
    refs.expandButton = cockpit.querySelector("[data-hearth-collapse-cockpit]");

    if (refs.copyButton) {
      refs.copyButton.onclick = copyDiagnostic;
      state.partialDiagnosticReady = true;
    }

    if (refs.receiptToggle) {
      refs.receiptToggle.onclick = toggleReceipt;
      state.receiptToggleReady = true;
    }

    if (refs.inspectButton) {
      refs.inspectButton.onclick = () => setDockHiddenForInspection(!state.dockHiddenForInspection);
      state.dockHideShowReady = true;
    }

    if (refs.expandButton) {
      refs.expandButton.onclick = toggleExpanded;
    }

    mount.querySelectorAll("[data-hearth-mount-fallback], .mount-fallback").forEach((fallback) => {
      fallback.hidden = true;
      fallback.style.display = "none";
      fallback.dataset.hiddenByIndexRouteSocket = CONTRACT;
    });

    state.cockpitReady = true;

    completeIndexCheckpoint("F2_FIRST_PAINT_COCKPIT_VISIBLE", {
      message: "First-paint cockpit visible. Index stops at Step 1."
    });

    return cockpit;
  }

  function toggleReceipt() {
    state.receiptVisible = !state.receiptVisible;

    if (refs.receiptBox) {
      refs.receiptBox.dataset.visible = String(state.receiptVisible);
    }

    if (refs.receiptToggle) {
      refs.receiptToggle.textContent = state.receiptVisible ? "Hide receipt" : "Show receipt";
    }

    markEvent(state.receiptVisible ? "INDEX_RECEIPT_SHOWN" : "INDEX_RECEIPT_HIDDEN", {
      lane: "firstPaint",
      status: "USER_CONTROL",
      message: state.receiptVisible ? "Partial receipt shown." : "Partial receipt hidden."
    });

    render();
  }

  function toggleExpanded() {
    if (!refs.cockpit) return;

    state.cockpitExpanded = !state.cockpitExpanded;
    state.dockHiddenForInspection = false;

    refs.cockpit.dataset.cockpitMode = state.cockpitExpanded ? "expanded-cockpit" : "compact-dock";

    if (refs.expandButton) {
      refs.expandButton.textContent = state.cockpitExpanded ? "Collapse dock" : "Expand cockpit";
    }

    if (refs.inspectButton) {
      refs.inspectButton.textContent = "Inspect planet";
    }

    if (doc && doc.documentElement) {
      doc.documentElement.dataset.hearthIndexDockHiddenForInspection = "false";
    }

    markEvent(state.cockpitExpanded ? "INDEX_COCKPIT_EXPANDED" : "INDEX_COCKPIT_COLLAPSED", {
      lane: "firstPaint",
      status: "USER_CONTROL",
      message: state.cockpitExpanded ? "Cockpit expanded." : "Cockpit collapsed to compact dock."
    });

    render();
  }

  function setDockHiddenForInspection(active) {
    state.dockHiddenForInspection = Boolean(active);

    if (state.dockHiddenForInspection) {
      state.cockpitExpanded = false;
    }

    if (refs.cockpit) {
      refs.cockpit.dataset.cockpitMode = state.dockHiddenForInspection ? "planet-inspect" : "compact-dock";
      refs.cockpit.dataset.hearthIndexDockHiddenForInspection = String(state.dockHiddenForInspection);
    }

    if (refs.mount) {
      refs.mount.dataset.hearthIndexDockHiddenForInspection = String(state.dockHiddenForInspection);
    }

    if (doc && doc.documentElement) {
      doc.documentElement.dataset.hearthIndexDockHiddenForInspection = String(state.dockHiddenForInspection);
    }

    if (refs.showTab) {
      refs.showTab.hidden = !state.dockHiddenForInspection;
      refs.showTab.dataset.visible = String(state.dockHiddenForInspection);
    }

    if (refs.inspectButton) {
      refs.inspectButton.textContent = state.dockHiddenForInspection ? "Show diagnostic" : "Inspect planet";
    }

    markEvent(state.dockHiddenForInspection ? "INDEX_DOCK_HIDDEN_FOR_PLANET_VIEW" : "INDEX_DOCK_RESTORED", {
      lane: "firstPaint",
      status: "USER_CONTROL",
      message: state.dockHiddenForInspection
        ? "Dock hidden so the planet can be viewed."
        : "Diagnostic dock restored."
    });

    render();
  }

  function laneMarkup() {
    const ledger = refs.ledger || root.HEARTH_LOAD_LEDGER || null;
    const lanes = ledger && ledger.state && ledger.state.lanes ? ledger.state.lanes : {};

    return FIBONACCI_INDEX_SEQUENCE.map((checkpoint) => {
      const lane = lanes[checkpoint.lane] || makeIndexLane(checkpoint);
      const complete = state.completedIndexCheckpoints.includes(checkpoint.id);
      const status = complete ? "COMPLETE" : lane.status || "PENDING";
      const progress = complete ? checkpoint.progress : clamp(lane.progress, 0, checkpoint.progress);

      return `
        <section class="hearth-ledger-lane" data-lane="${escapeHtml(checkpoint.lane)}" data-status="${escapeHtml(status)}">
          <div class="hearth-ledger-lane-top">
            <span class="hearth-ledger-lane-title">
              <strong>${escapeHtml(checkpoint.stage)} · ${escapeHtml(checkpoint.label)}</strong>
              <span>Index-owned Step 1 checkpoint.</span>
            </span>
            <span class="hearth-ledger-lane-status">${escapeHtml(status)}</span>
          </div>
          <div class="hearth-ledger-lane-track">
            <span class="hearth-ledger-lane-fill" style="width:${progress}%"></span>
          </div>
          <div class="hearth-ledger-lane-title">
            <span>event=${escapeHtml(checkpoint.event)}</span>
          </div>
        </section>
      `;
    }).join("");
  }

  function futureMarkup() {
    return FUTURE_STEPS.map((item) => {
      return `
        <section class="hearth-ledger-lane" data-status="PASSIVE_HANDOFF">
          <div class="hearth-ledger-lane-top">
            <span class="hearth-ledger-lane-title">
              <strong>${escapeHtml(item)}</strong>
              <span>Not owned by index.js. Await /showroom/globe/hearth/hearth.js.</span>
            </span>
            <span class="hearth-ledger-lane-status">HANDOFF</span>
          </div>
        </section>
      `;
    }).join("");
  }

  function buildHandoffPacket() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: INDEX_FILE,
      route: ROUTE,
      pairedWith: COHERENCE_FILE,
      role: "route-socket-step-1",

      step1Complete: state.completedIndexCheckpoints.includes("F2_FIRST_PAINT_COCKPIT_VISIBLE"),
      indexMaxFibonacciStage: INDEX_MAX_FIBONACCI_STAGE,

      mountReady: state.mountReady,
      mountId: MOUNT_ID,
      cockpitReady: state.cockpitReady,
      cockpitId: COCKPIT_ID,
      ledgerReady: state.ledgerReady,
      partialDiagnosticReady: state.partialDiagnosticReady,
      receiptToggleReady: state.receiptToggleReady,
      dockHideShowReady: state.dockHideShowReady,
      showDiagnosticReady: state.showDiagnosticReady,

      ownsStep1: true,
      ownsSteps2Through11: false,
      hearthJsOwnsSteps2Through11: true,

      ownsRuntimeTableSession: false,
      ownsCheckpointGovernor: false,
      ownsCanvasDrawing: false,
      ownsCanvasCoordination: false,
      ownsVisiblePlanetProof: false,
      ownsInspectModeTruth: false,
      ownsFinalCompletion: false,
      ownsFinalDiagnosticReceipt: false,
      ownsVisualPassClaim: false,

      newsProtocolInitialized: state.newsProtocolInitialized,
      fibonacciSequenceInitialized: state.fibonacciSequenceInitialized,
      northSocketReady: state.northSocketReady,
      eastHandoffReady: state.eastHandoffReady,
      westRecoverabilityReady: state.westRecoverabilityReady,
      southHandoffEmitted: state.southHandoffEmitted,
      indexNewsPassed: state.indexNewsPassed,

      sharedLedger: refs.ledger || root.HEARTH_LOAD_LEDGER || null,
      mount: refs.mount || null,
      cockpit: refs.cockpit || null,

      handoffCreatedAt: state.handoffCreatedAt || nowIso(),

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function publishHandoff() {
    state.handoffCreatedAt = state.handoffCreatedAt || nowIso();
    state.handoffPacketReady = true;

    const packet = buildHandoffPacket();

    root.HEARTH = root.HEARTH || {};
    root.HEARTH.indexRouteSocket = api;
    root.HEARTH.indexConstraintSemiconductor = api;
    root.HEARTH.indexHandoff = packet;

    root.HEARTH_INDEX_ROUTE_SOCKET = api;
    root.HEARTH_INDEX_CONSTRAINT_SEMICONDUCTOR = api;
    root.HEARTH_INDEX_BRIDGE = api;
    root.HearthIndexBridge = api;
    root.HEARTH_INDEX_JS = api;

    root.HEARTH_INDEX_ROUTE_SOCKET_HANDOFF = packet;
    root.HEARTH_INDEX_ROUTE_SOCKET_RECEIPT = buildReceipt();
    root.HEARTH_INDEX_CONSTRAINT_SEMICONDUCTOR_RECEIPT = root.HEARTH_INDEX_ROUTE_SOCKET_RECEIPT;
    root.HEARTH_INDEX_BRIDGE_RECEIPT = root.HEARTH_INDEX_ROUTE_SOCKET_RECEIPT;
    root.HEARTH_INDEX_JS_RECEIPT = root.HEARTH_INDEX_ROUTE_SOCKET_RECEIPT;

    root.__HEARTH_INDEX_ROUTE_SOCKET_FILE__ = INDEX_FILE;
    root.__HEARTH_CONSTRAINT_SEMICONDUCTOR_FILE__ = INDEX_FILE;
    root.__HEARTH_COHERENCE_SEMICONDUCTOR_FILE__ = COHERENCE_FILE;
    root.__HEARTH_ACTIVE_ROUTE_FILE__ = COHERENCE_FILE;
    root.__HEARTH_INDEX_MAX_FIBONACCI_STAGE__ = INDEX_MAX_FIBONACCI_STAGE;
    root.__HEARTH_CLIMATE_ROUTE_RETIRED__ = true;

    state.handoffPublished = true;
    return packet;
  }

  function getCoherenceApi() {
    return (
      root.HEARTH_ROUTE_CONDUCTOR ||
      root.HearthRouteConductor ||
      root.HEARTH_ACTIVE_ROUTE ||
      root.HEARTH_ROUTE_COHERENCE_SEMICONDUCTOR ||
      root.HEARTH_ROUTE_RUNTIME_TABLE_CHECKPOINT_GOVERNOR_CONSUMER ||
      root.HEARTH_ROUTE_CONSUMER_ACTIVE_MATCH_QUEUE_DRAIN ||
      (root.HEARTH && root.HEARTH.routeConductor) ||
      (root.HEARTH && root.HEARTH.coherenceSemiconductor) ||
      null
    );
  }

  function attemptReceiverHandoff(reason = "manual") {
    if (state.hearthReceiverAccepted) return true;

    const apiCandidate = getCoherenceApi();
    state.hearthGlobalPresent = Boolean(apiCandidate);

    if (!apiCandidate) {
      state.handoffDeliveryAttempted = true;
      state.hearthReceiverError = "coherence-api-not-present";
      publishDataset();
      return false;
    }

    const packet = publishHandoff();

    for (const method of RECEIVER_METHODS) {
      if (!isFunction(apiCandidate[method])) continue;

      try {
        apiCandidate[method]({
          ...packet,
          handoffReason: reason
        });

        state.handoffDeliveryAttempted = true;
        state.hearthReceiverAccepted = true;
        state.hearthReceiverMethod = method;
        state.hearthReceiverError = "";

        markEvent("INDEX_HANDOFF_ACCEPTED_BY_HEARTH_JS", {
          lane: "firstPaint",
          status: "HANDOFF_ACCEPTED",
          message: `hearth.js accepted index handoff through ${method}.`,
          method
        });

        publishDataset();
        scheduleRender();
        return true;
      } catch (error) {
        state.handoffDeliveryAttempted = true;
        state.hearthReceiverError = error && error.message ? error.message : String(error);

        recordError("HEARTH_RECEIVER_METHOD_FAILED", state.hearthReceiverError, {
          method,
          reason
        });
      }
    }

    state.handoffDeliveryAttempted = true;
    state.hearthReceiverMethod = "";
    state.hearthReceiverError = "coherence-api-present-without-passive-receiver-method";

    markEvent("INDEX_HANDOFF_PUBLISHED_FOR_HEARTH_JS", {
      lane: "firstPaint",
      status: "HANDOFF_PUBLISHED",
      message: "Handoff published globally. No boot/start/init/run call made by index.js."
    });

    publishDataset();
    scheduleRender();
    return false;
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

  function injectHearthScriptOnce() {
    const existingApi = getCoherenceApi();

    if (existingApi) {
      state.hearthGlobalPresent = true;
      state.hearthScriptPresent = true;
      attemptReceiverHandoff("coherence-global-present-before-injection");
      return;
    }

    const existingScript = scriptAlreadyPresent(COHERENCE_FILE);

    if (existingScript) {
      state.hearthScriptPresent = true;
      state.hearthScriptInjected = false;
      state.hearthScriptLoaded = Boolean(existingScript.dataset.hearthLoaded === "true");
      state.hearthScriptError = "";
      publishDataset();
      return;
    }

    if (!doc || !doc.head) {
      state.hearthScriptError = "document.head unavailable";
      recordError("HEARTH_SCRIPT_INJECTION_SKIPPED", state.hearthScriptError);
      return;
    }

    const script = doc.createElement("script");
    script.src = `${COHERENCE_FILE}?v=${encodeURIComponent(cacheKey())}`;
    script.defer = true;
    script.dataset.hearthLoadedByIndexRouteSocket = CONTRACT;
    script.dataset.hearthScriptRole = "coherence-steps-2-through-11";
    script.dataset.generatedImage = "false";
    script.dataset.graphicBox = "false";
    script.dataset.webgl = "false";
    script.dataset.visualPassClaimed = "false";

    state.hearthScriptPresent = true;
    state.hearthScriptInjected = true;
    state.hearthScriptLoaded = false;
    state.hearthScriptError = "";

    script.onload = () => {
      script.dataset.hearthLoaded = "true";
      state.hearthScriptLoaded = true;
      state.hearthGlobalPresent = Boolean(getCoherenceApi());
      markEvent("HEARTH_JS_SCRIPT_LOADED_BY_INDEX_ROUTE_SOCKET", {
        lane: "firstPaint",
        status: "SCRIPT_LOADED",
        message: "hearth.js loaded. Index does not call boot/start/init/run."
      });
      attemptReceiverHandoff("hearth-script-onload");
      publishDataset();
      scheduleRender();
    };

    script.onerror = () => {
      state.hearthScriptLoaded = false;
      state.hearthScriptError = "hearth.js script failed to load";
      recordError("HEARTH_JS_SCRIPT_LOAD_FAILED", state.hearthScriptError, {
        src: script.src
      });
      publishDataset();
      scheduleRender();
    };

    doc.head.appendChild(script);

    markEvent("HEARTH_JS_SCRIPT_INJECTED_ONCE", {
      lane: "firstPaint",
      status: "SCRIPT_INJECTED",
      message: "hearth.js requested once. No repeated injection and no boot call."
    });

    publishDataset();
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

  function evaluateIndexNews() {
    state.northSocketReady = Boolean(state.mountReady && state.cockpitReady && state.ledgerReady);
    state.eastHandoffReady = Boolean(state.handoffPacketReady && state.handoffPublished);
    state.westRecoverabilityReady = Boolean(
      state.partialDiagnosticReady &&
      state.receiptToggleReady &&
      state.dockHideShowReady &&
      state.showDiagnosticReady
    );
    state.southHandoffEmitted = Boolean(state.handoffPublished);

    state.indexNewsPassed = Boolean(
      state.northSocketReady &&
      state.eastHandoffReady &&
      state.westRecoverabilityReady &&
      state.southHandoffEmitted
    );

    return state.indexNewsPassed;
  }

  function deriveFailureCoordinate() {
    if (!state.mountReady) {
      state.firstFailedCoordinate = "WAITING_INDEX_MOUNT_READY";
      state.recommendedNextRenewalTarget = INDEX_FILE;
      return;
    }

    if (!state.ledgerReady) {
      state.firstFailedCoordinate = "WAITING_INDEX_LEDGER_READY";
      state.recommendedNextRenewalTarget = INDEX_FILE;
      return;
    }

    if (!state.cockpitReady) {
      state.firstFailedCoordinate = "WAITING_INDEX_FIRST_PAINT_COCKPIT";
      state.recommendedNextRenewalTarget = INDEX_FILE;
      return;
    }

    if (!state.handoffPublished) {
      state.firstFailedCoordinate = "WAITING_INDEX_HANDOFF_PUBLISHED";
      state.recommendedNextRenewalTarget = INDEX_FILE;
      return;
    }

    if (!state.westRecoverabilityReady) {
      state.firstFailedCoordinate = "WAITING_INDEX_RECOVERABILITY_CONTROLS";
      state.recommendedNextRenewalTarget = INDEX_FILE;
      return;
    }

    state.firstFailedCoordinate = "STEP1_COMPLETE_WAITING_HEARTH_JS_STEPS_2_THROUGH_11";
    state.recommendedNextRenewalTarget = COHERENCE_FILE;
  }

  function computeProgress() {
    const stepProgress = FIBONACCI_INDEX_SEQUENCE.reduce((max, checkpoint) => {
      return state.completedIndexCheckpoints.includes(checkpoint.id)
        ? Math.max(max, checkpoint.progress)
        : max;
    }, 0);

    state.displayProgress = clamp(Math.max(state.displayProgress, stepProgress), 0, 22);
    return Math.round(state.displayProgress);
  }

  function scheduleRender() {
    if (renderTimer) return;

    renderTimer = root.setTimeout(() => {
      renderTimer = 0;
      render();
    }, 60);
  }

  function render() {
    if (!refs.cockpit) return;

    evaluateIndexNews();
    deriveFailureCoordinate();

    const progress = computeProgress();

    if (refs.title) {
      refs.title.textContent = state.indexNewsPassed
        ? "STEP 1 READY · HANDOFF TO HEARTH.JS"
        : "STARTING HEARTH VISIBLE PROCESS";
    }

    if (refs.stage) {
      refs.stage.textContent = `${state.currentStage} · index max ${INDEX_MAX_FIBONACCI_STAGE} · Step 1 only`;
    }

    if (refs.heartbeat) {
      refs.heartbeat.textContent = `route socket=true · hearth.js owns Steps 2–11 · elapsed=${formatElapsed(state.startedAt)}`;
    }

    if (refs.latest) {
      refs.latest.textContent = `latest=${state.latestEvent}`;
    }

    if (refs.mainFill) refs.mainFill.style.width = `${progress}%`;
    if (refs.mainPercent) refs.mainPercent.textContent = `${progress}%`;
    if (refs.laneList) refs.laneList.innerHTML = laneMarkup();
    if (refs.futureList) refs.futureList.innerHTML = futureMarkup();
    if (refs.receiptPre) refs.receiptPre.textContent = getReceiptText();

    if (refs.cockpit) {
      refs.cockpit.dataset.hearthIndexStep1Complete = String(state.indexNewsPassed);
      refs.cockpit.dataset.hearthIndexMaxFibonacciStage = INDEX_MAX_FIBONACCI_STAGE;
      refs.cockpit.dataset.hearthJsOwnsSteps2Through11 = "true";
      refs.cockpit.dataset.hearthIndexOwnsSteps2Through11 = "false";
      refs.cockpit.dataset.hearthFirstFailedCoordinate = state.firstFailedCoordinate;
      refs.cockpit.dataset.hearthRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;
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
      "Hearth index route socket active.",
      `Contract ${CONTRACT}`,
      `Receipt ${RECEIPT}`,
      `File ${INDEX_FILE}`,
      `Role ${state.role}`,
      `Paired with ${COHERENCE_FILE}`,
      `Index owns Step 1 ${state.ownsStep1}`,
      `Index owns Steps 2 through 11 ${state.ownsSteps2Through11}`,
      `Hearth.js owns Steps 2 through 11 ${state.hearthJsOwnsSteps2Through11}`,
      `Index max Fibonacci stage ${INDEX_MAX_FIBONACCI_STAGE}`,
      `Mount ready ${state.mountReady}`,
      `Cockpit ready ${state.cockpitReady}`,
      `Ledger ready ${state.ledgerReady}`,
      `Partial diagnostic ready ${state.partialDiagnosticReady}`,
      `Receipt toggle ready ${state.receiptToggleReady}`,
      `Dock hide/show ready ${state.dockHideShowReady}`,
      `Handoff packet ready ${state.handoffPacketReady}`,
      `Handoff published ${state.handoffPublished}`,
      `Hearth script present ${state.hearthScriptPresent}`,
      `Hearth script injected ${state.hearthScriptInjected}`,
      `Hearth script loaded ${state.hearthScriptLoaded}`,
      `Hearth receiver accepted ${state.hearthReceiverAccepted}`,
      `Index NEWS passed ${state.indexNewsPassed}`,
      `Runtime Table mutation ${state.runtimeTableMutation}`,
      `Canvas mutation ${state.canvasMutation}`,
      `Generated image ${state.generatedImage}`,
      `GraphicBox ${state.graphicBox}`,
      `WebGL ${state.webGL}`,
      `Visual pass claimed ${state.visualPassClaimed}`,
      `First failed coordinate ${state.firstFailedCoordinate}`,
      `Recommended next renewal target ${state.recommendedNextRenewalTarget}`,
      `Updated ${state.updatedAt || nowIso()}`
    ].join("\n");
  }

  function publishDataset() {
    if (!doc || !doc.documentElement) return;

    evaluateIndexNews();
    deriveFailureCoordinate();

    const dataset = doc.documentElement.dataset;

    dataset.hearthIndexRouteSocketLoaded = "true";
    dataset.hearthIndexRouteSocketContract = CONTRACT;
    dataset.hearthIndexRouteSocketReceipt = RECEIPT;
    dataset.hearthIndexRouteSocketVersion = VERSION;
    dataset.hearthIndexStep1Complete = String(state.indexNewsPassed);
    dataset.hearthIndexMaxFibonacciStage = INDEX_MAX_FIBONACCI_STAGE;

    dataset.hearthPairedSemiconductor = "true";
    dataset.hearthConstraintSemiconductor = INDEX_FILE;
    dataset.hearthCoherenceSemiconductor = COHERENCE_FILE;
    dataset.hearthIndexJsStartsProcess = "true";
    dataset.hearthJsFinishesProcess = "true";
    dataset.hearthSynchronizedLoading = "true";

    dataset.hearthIndexOwnsStep1 = "true";
    dataset.hearthIndexOwnsSteps2Through11 = "false";
    dataset.hearthJsOwnsSteps2Through11 = "true";

    dataset.hearthIndexOwnsFirstPaintSurvival = "true";
    dataset.hearthIndexOwnsMountCertainty = "true";
    dataset.hearthIndexOwnsLoadingScreenCertainty = "true";
    dataset.hearthIndexOwnsEarlyLedger = "true";
    dataset.hearthIndexOwnsPartialDiagnosticAccess = "true";
    dataset.hearthIndexOwnsRuntimeTableSession = "false";
    dataset.hearthIndexOwnsCheckpointGovernor = "false";
    dataset.hearthIndexOwnsCanvasDrawing = "false";
    dataset.hearthIndexOwnsCanvasCoordination = "false";
    dataset.hearthIndexOwnsVisiblePlanetProof = "false";
    dataset.hearthIndexOwnsInspectModeTruth = "false";
    dataset.hearthIndexOwnsFinalCompletion = "false";
    dataset.hearthIndexOwnsFinalDiagnosticReceipt = "false";

    dataset.hearthMountReady = String(state.mountReady);
    dataset.hearthFirstPaintCockpitReady = String(state.cockpitReady);
    dataset.hearthLoadLedgerPresent = String(state.ledgerReady);
    dataset.hearthPartialDiagnosticReady = String(state.partialDiagnosticReady);
    dataset.hearthReceiptToggleReady = String(state.receiptToggleReady);
    dataset.hearthDockHideShowReady = String(state.dockHideShowReady);
    dataset.hearthShowDiagnosticReady = String(state.showDiagnosticReady);

    dataset.hearthIndexNewsProtocolInitialized = String(state.newsProtocolInitialized);
    dataset.hearthIndexFibonacciSequenceInitialized = String(state.fibonacciSequenceInitialized);
    dataset.hearthIndexNewsPassed = String(state.indexNewsPassed);
    dataset.hearthIndexNorthSocketReady = String(state.northSocketReady);
    dataset.hearthIndexEastHandoffReady = String(state.eastHandoffReady);
    dataset.hearthIndexWestRecoverabilityReady = String(state.westRecoverabilityReady);
    dataset.hearthIndexSouthHandoffEmitted = String(state.southHandoffEmitted);

    dataset.hearthIndexHandoffPacketReady = String(state.handoffPacketReady);
    dataset.hearthIndexHandoffPublished = String(state.handoffPublished);
    dataset.hearthIndexHandoffCreatedAt = state.handoffCreatedAt;
    dataset.hearthScriptPresent = String(state.hearthScriptPresent);
    dataset.hearthScriptInjected = String(state.hearthScriptInjected);
    dataset.hearthScriptLoaded = String(state.hearthScriptLoaded);
    dataset.hearthReceiverAccepted = String(state.hearthReceiverAccepted);
    dataset.hearthReceiverMethod = state.hearthReceiverMethod;

    dataset.hearthClimateRouteRetired = "true";
    dataset.hearthRetiredClimateRouteFile = RETIRED_CLIMATE_FILE;
    dataset.hearthRuntimeTableRequiredForFirstRender = "false";
    dataset.hearthSourceStackRequiredForFirstRender = "false";
    dataset.hearthWideProbeDeferred = "true";
    dataset.hearthRuntimeTableMutation = "false";
    dataset.hearthCanvasMutation = "false";

    dataset.hearthIndexDockHiddenForInspection = String(state.dockHiddenForInspection);
    dataset.hearthIndexFirstFailedCoordinate = state.firstFailedCoordinate;
    dataset.hearthIndexRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";

    root.HEARTH_INDEX_ROUTE_SOCKET_RECEIPT = buildReceipt();
    root.HEARTH_INDEX_CONSTRAINT_SEMICONDUCTOR_RECEIPT = root.HEARTH_INDEX_ROUTE_SOCKET_RECEIPT;
    root.HEARTH_INDEX_BRIDGE_RECEIPT = root.HEARTH_INDEX_ROUTE_SOCKET_RECEIPT;
    root.HEARTH_INDEX_JS_RECEIPT = root.HEARTH_INDEX_ROUTE_SOCKET_RECEIPT;
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

    markEvent(ok ? "INDEX_PARTIAL_DIAGNOSTIC_COPIED" : "INDEX_PARTIAL_DIAGNOSTIC_COPY_FAILED", {
      lane: "ledger",
      status: ok ? "COPIED" : "COPY_FAILED",
      message: ok ? "Partial diagnostic copied." : "Partial diagnostic copy failed."
    });

    return ok;
  }

  function buildReceipt() {
    evaluateIndexNews();
    deriveFailureCoordinate();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      authority: "hearth-index-route-socket",
      destinationFile: INDEX_FILE,
      file: INDEX_FILE,
      route: ROUTE,
      role: state.role,

      pairedSemiconductor: true,
      pairedWith: COHERENCE_FILE,
      indexJsStartsProcess: true,
      hearthJsFinishesProcess: true,
      systematicAndSynchronized: true,
      synchronizedLoading: true,

      indexOwnsStep1: state.ownsStep1,
      indexOwnsSteps2Through11: state.ownsSteps2Through11,
      hearthJsOwnsSteps2Through11: state.hearthJsOwnsSteps2Through11,

      ownsFirstPaintSurvival: state.ownsFirstPaintSurvival,
      ownsMountCertainty: state.ownsMountCertainty,
      ownsLoadingScreenCertainty: state.ownsLoadingScreenCertainty,
      ownsEarlyLedger: state.ownsEarlyLedger,
      ownsPartialDiagnosticAccess: state.ownsPartialDiagnosticAccess,
      ownsRouteSocket: state.ownsRouteSocket,

      ownsActiveRouteConduction: false,
      ownsRuntimeTableSession: false,
      ownsCheckpointGovernor: false,
      ownsCanvasDrawing: false,
      ownsCanvasCoordination: false,
      ownsVisiblePlanetProof: false,
      ownsInspectModeTruth: false,
      ownsFinalCompletion: false,
      ownsFinalDiagnosticReceipt: false,
      ownsVisualPassClaim: false,

      indexMaxFibonacciStage: INDEX_MAX_FIBONACCI_STAGE,
      currentStage: state.currentStage,
      highestStage: state.highestStage,
      completedIndexCheckpoints: state.completedIndexCheckpoints.join(","),
      displayProgress: state.displayProgress,

      newsProtocolInitialized: state.newsProtocolInitialized,
      fibonacciSequenceInitialized: state.fibonacciSequenceInitialized,
      indexNewsPassed: state.indexNewsPassed,
      northSocketReady: state.northSocketReady,
      eastHandoffReady: state.eastHandoffReady,
      westRecoverabilityReady: state.westRecoverabilityReady,
      southHandoffEmitted: state.southHandoffEmitted,

      mountReady: state.mountReady,
      mountCreatedByIndex: state.mountCreatedByIndex,
      cockpitReady: state.cockpitReady,
      ledgerReady: state.ledgerReady,
      partialDiagnosticReady: state.partialDiagnosticReady,
      receiptToggleReady: state.receiptToggleReady,
      dockHideShowReady: state.dockHideShowReady,
      showDiagnosticReady: state.showDiagnosticReady,
      receiptVisible: state.receiptVisible,
      dockHiddenForInspection: state.dockHiddenForInspection,
      cockpitExpanded: state.cockpitExpanded,

      handoffPacketReady: state.handoffPacketReady,
      handoffPublished: state.handoffPublished,
      handoffCreatedAt: state.handoffCreatedAt,
      handoffDeliveryAttempted: state.handoffDeliveryAttempted,
      hearthReceiverAccepted: state.hearthReceiverAccepted,
      hearthReceiverMethod: state.hearthReceiverMethod,
      hearthReceiverError: state.hearthReceiverError,

      hearthScriptPresent: state.hearthScriptPresent,
      hearthScriptInjected: state.hearthScriptInjected,
      hearthScriptLoaded: state.hearthScriptLoaded,
      hearthScriptError: state.hearthScriptError,
      hearthGlobalPresent: state.hearthGlobalPresent,

      climateRouteRetired: true,
      retiredClimateRoute: RETIRED_CLIMATE_FILE,
      runtimeTableMutation: false,
      canvasMutation: false,
      runtimeTableRequiredForFirstRender: false,
      sourceStackRequiredForFirstRender: false,
      wideProbeDeferred: true,

      latestEvent: state.latestEvent,
      status: state.status,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      sharedLedger: refs.ledger && refs.ledger.state ? clonePlain(refs.ledger.state) : null,
      events: clonePlain(state.events),
      errors: clonePlain(state.errors),
      futureStepsOwnedByHearthJs: FUTURE_STEPS.slice(),

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      startedAt: state.startedAt,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    return buildReceipt();
  }

  function getReceiptText() {
    const receipt = buildReceipt();

    const lanes = receipt.sharedLedger && receipt.sharedLedger.lanes
      ? Object.entries(receipt.sharedLedger.lanes).map(([key, lane]) => (
        `- ${key}: status=${lane.status}; stage=${lane.stage}; progress=${lane.progress}; event=${lane.event}; message=${lane.message}`
      )).join("\n")
      : "- none";

    const events = receipt.events.map((event) => (
      `- ${event.at || ""} :: ${event.event || ""} :: ${event.detail && event.detail.status ? event.detail.status : ""} :: ${event.detail && event.detail.message ? event.detail.message : ""}`
    )).join("\n") || "- none";

    const errors = receipt.errors.map((error) => (
      `- ${error.at || ""} :: ${error.code || ""} :: ${error.message || ""}`
    )).join("\n") || "- none";

    const future = receipt.futureStepsOwnedByHearthJs.map((item) => `- ${item}`).join("\n");

    return [
      "HEARTH_INDEX_ROUTE_SOCKET_FIRST_PAINT_HANDOFF_RECEIPT",
      "",
      `contract=${receipt.contract}`,
      `receipt=${receipt.receipt}`,
      `previousContract=${receipt.previousContract}`,
      `baselineContract=${receipt.baselineContract}`,
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
      `indexOwnsStep1=${receipt.indexOwnsStep1}`,
      `indexOwnsSteps2Through11=${receipt.indexOwnsSteps2Through11}`,
      `hearthJsOwnsSteps2Through11=${receipt.hearthJsOwnsSteps2Through11}`,
      "",
      `ownsFirstPaintSurvival=${receipt.ownsFirstPaintSurvival}`,
      `ownsMountCertainty=${receipt.ownsMountCertainty}`,
      `ownsLoadingScreenCertainty=${receipt.ownsLoadingScreenCertainty}`,
      `ownsEarlyLedger=${receipt.ownsEarlyLedger}`,
      `ownsPartialDiagnosticAccess=${receipt.ownsPartialDiagnosticAccess}`,
      `ownsRouteSocket=${receipt.ownsRouteSocket}`,
      "",
      `ownsActiveRouteConduction=${receipt.ownsActiveRouteConduction}`,
      `ownsRuntimeTableSession=${receipt.ownsRuntimeTableSession}`,
      `ownsCheckpointGovernor=${receipt.ownsCheckpointGovernor}`,
      `ownsCanvasDrawing=${receipt.ownsCanvasDrawing}`,
      `ownsCanvasCoordination=${receipt.ownsCanvasCoordination}`,
      `ownsVisiblePlanetProof=${receipt.ownsVisiblePlanetProof}`,
      `ownsInspectModeTruth=${receipt.ownsInspectModeTruth}`,
      `ownsFinalCompletion=${receipt.ownsFinalCompletion}`,
      `ownsFinalDiagnosticReceipt=${receipt.ownsFinalDiagnosticReceipt}`,
      `ownsVisualPassClaim=${receipt.ownsVisualPassClaim}`,
      "",
      `indexMaxFibonacciStage=${receipt.indexMaxFibonacciStage}`,
      `currentStage=${receipt.currentStage}`,
      `highestStage=${receipt.highestStage}`,
      `completedIndexCheckpoints=${receipt.completedIndexCheckpoints}`,
      `displayProgress=${receipt.displayProgress}`,
      "",
      `newsProtocolInitialized=${receipt.newsProtocolInitialized}`,
      `fibonacciSequenceInitialized=${receipt.fibonacciSequenceInitialized}`,
      `indexNewsPassed=${receipt.indexNewsPassed}`,
      `northSocketReady=${receipt.northSocketReady}`,
      `eastHandoffReady=${receipt.eastHandoffReady}`,
      `westRecoverabilityReady=${receipt.westRecoverabilityReady}`,
      `southHandoffEmitted=${receipt.southHandoffEmitted}`,
      "",
      `mountReady=${receipt.mountReady}`,
      `mountCreatedByIndex=${receipt.mountCreatedByIndex}`,
      `cockpitReady=${receipt.cockpitReady}`,
      `ledgerReady=${receipt.ledgerReady}`,
      `partialDiagnosticReady=${receipt.partialDiagnosticReady}`,
      `receiptToggleReady=${receipt.receiptToggleReady}`,
      `dockHideShowReady=${receipt.dockHideShowReady}`,
      `showDiagnosticReady=${receipt.showDiagnosticReady}`,
      `receiptVisible=${receipt.receiptVisible}`,
      `dockHiddenForInspection=${receipt.dockHiddenForInspection}`,
      `cockpitExpanded=${receipt.cockpitExpanded}`,
      "",
      `handoffPacketReady=${receipt.handoffPacketReady}`,
      `handoffPublished=${receipt.handoffPublished}`,
      `handoffCreatedAt=${receipt.handoffCreatedAt}`,
      `handoffDeliveryAttempted=${receipt.handoffDeliveryAttempted}`,
      `hearthReceiverAccepted=${receipt.hearthReceiverAccepted}`,
      `hearthReceiverMethod=${receipt.hearthReceiverMethod}`,
      `hearthReceiverError=${receipt.hearthReceiverError}`,
      "",
      `hearthScriptPresent=${receipt.hearthScriptPresent}`,
      `hearthScriptInjected=${receipt.hearthScriptInjected}`,
      `hearthScriptLoaded=${receipt.hearthScriptLoaded}`,
      `hearthScriptError=${receipt.hearthScriptError}`,
      `hearthGlobalPresent=${receipt.hearthGlobalPresent}`,
      "",
      `climateRouteRetired=${receipt.climateRouteRetired}`,
      `retiredClimateRoute=${receipt.retiredClimateRoute}`,
      `runtimeTableMutation=${receipt.runtimeTableMutation}`,
      `canvasMutation=${receipt.canvasMutation}`,
      `runtimeTableRequiredForFirstRender=${receipt.runtimeTableRequiredForFirstRender}`,
      `sourceStackRequiredForFirstRender=${receipt.sourceStackRequiredForFirstRender}`,
      `wideProbeDeferred=${receipt.wideProbeDeferred}`,
      "",
      `latestEvent=${receipt.latestEvent}`,
      `status=${receipt.status}`,
      `firstFailedCoordinate=${receipt.firstFailedCoordinate}`,
      `recommendedNextRenewalTarget=${receipt.recommendedNextRenewalTarget}`,
      "",
      "INDEX_LEDGER_LANES",
      lanes,
      "",
      "FUTURE_STEPS_OWNED_BY_HEARTH_JS",
      future,
      "",
      "INDEX_EVENTS",
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
      `startedAt=${receipt.startedAt}`,
      `updatedAt=${receipt.updatedAt}`
    ].join("\n");
  }

  function boot() {
    if (bootStarted) {
      publishHandoff();
      publishDataset();
      render();
      return buildReceipt();
    }

    bootStarted = true;
    state.startedAt = nowIso();
    state.updatedAt = state.startedAt;
    state.status = "BOOTING";
    state.firstFailedCoordinate = "INDEX_ROUTE_SOCKET_BOOTING";
    state.recommendedNextRenewalTarget = INDEX_FILE;

    retireClimateRoute();
    ensureStyle();
    ensureMount();

    completeIndexCheckpoint("F1A_HTML_SHELL_RENDERED", {
      message: "HTML shell and mount confirmed by index route socket."
    });

    ensureLedger();
    ensureCockpit();

    publishHandoff();
    injectHearthScriptOnce();
    attemptReceiverHandoff("index-boot");

    evaluateIndexNews();
    deriveFailureCoordinate();

    state.status = state.indexNewsPassed
      ? "STEP1_COMPLETE_HANDOFF_PUBLISHED"
      : "STEP1_PARTIAL_HANDOFF_PENDING";

    publishDataset();
    render();

    return buildReceipt();
  }

  function dispose(reason = "manual-dispose") {
    if (renderTimer) {
      root.clearTimeout(renderTimer);
      renderTimer = 0;
    }

    markEvent("INDEX_ROUTE_SOCKET_DISPOSED", {
      lane: "firstPaint",
      status: "DISPOSED",
      message: reason
    });
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: INDEX_FILE,
    route: ROUTE,
    role: "route-socket-step-1",

    boot,
    start: boot,
    init: boot,
    run: boot,
    dispose,

    publishHandoff,
    attemptReceiverHandoff,
    getReceipt,
    getReceiptText,
    copyDiagnostic,
    setDockHiddenForInspection,

    supportsPairedSemiconductor: true,
    supportsConstraintSideSemiconductor: true,
    supportsRouteSocket: true,
    supportsStep1Only: true,
    supportsFirstPaintSurvival: true,
    supportsMountCertainty: true,
    supportsLoadingScreenCertainty: true,
    supportsEarlyLedger: true,
    supportsPartialDiagnosticBeforeCompletion: true,
    supportsReceiptToggle: true,
    supportsDockHideShow: true,
    supportsPassiveHandoff: true,
    supportsClimateRouteRetirement: true,

    ownsStep1: true,
    ownsSteps2Through11: false,
    hearthJsOwnsSteps2Through11: true,

    ownsActiveRouteConduction: false,
    ownsRuntimeTableSession: false,
    ownsCheckpointGovernor: false,
    ownsCanvasDrawing: false,
    ownsCanvasCoordination: false,
    ownsVisiblePlanetProof: false,
    ownsInspectModeTruth: false,
    ownsFinalCompletion: false,
    ownsFinalDiagnosticReceipt: false,
    ownsVisualPassClaim: false,

    indexMaxFibonacciStage: INDEX_MAX_FIBONACCI_STAGE,
    runtimeTableMutation: false,
    canvasMutation: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.indexRouteSocket = api;
  root.HEARTH.indexConstraintSemiconductor = api;

  root.HEARTH_INDEX_ROUTE_SOCKET = api;
  root.HEARTH_INDEX_CONSTRAINT_SEMICONDUCTOR = api;
  root.HEARTH_INDEX_BRIDGE = api;
  root.HearthIndexBridge = api;
  root.HEARTH_INDEX_JS = api;

  root.__HEARTH_INDEX_ROUTE_SOCKET_FILE__ = INDEX_FILE;
  root.__HEARTH_CONSTRAINT_SEMICONDUCTOR_FILE__ = INDEX_FILE;
  root.__HEARTH_COHERENCE_SEMICONDUCTOR_FILE__ = COHERENCE_FILE;
  root.__HEARTH_ACTIVE_ROUTE_FILE__ = COHERENCE_FILE;
  root.__HEARTH_INDEX_MAX_FIBONACCI_STAGE__ = INDEX_MAX_FIBONACCI_STAGE;
  root.__HEARTH_CLIMATE_ROUTE_RETIRED__ = true;

  publishHandoff();

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

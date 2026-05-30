// /showroom/globe/hearth/hearth.js
// HEARTH_SOUTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_GEAR_CYCLE_TNT_v1
// Full-file replacement.
// South route conductor / visible completion authority only.
// Purpose:
// - Restore Hearth route conductor after overwrite.
// - Consume North Runtime Table public facade at /assets/lab/runtime-table.js.
// - Consume East checkpoint motion, West gap classification, South visible-state composer, and Canvas F13 evidence.
// - Preserve NEWS + Fibonacci checkpoint sequencing.
// - Express transmission / gear behavior: one active checkpoint zone at a time.
// - Show the active gear from 0 -> 100, then reset for the next gear.
// - Prevent render -> ledger -> render recursion and freeze loops.
// - Preserve Copy Diagnostic, Show Receipt, Inspect Planet, and diagnostic restore behavior.
// Does not own:
// - North public Runtime Table precedent
// - East checkpoint admission truth
// - West gap classification truth
// - South lab composer truth
// - canvas drawing
// - atlas painting
// - source/channel truth
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_SOUTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_GEAR_CYCLE_TNT_v1";
  const RECEIPT = "HEARTH_SOUTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_GEAR_CYCLE_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_SOUTH_VISIBLE_STATE_COMPOSER_API_HANDSHAKE_RECOVERY_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_SOUTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_GEAR_CYCLE_PRECODE_FINAL_DRAFT_v1";
  const VERSION = "2026-05-29.hearth-south-route-conductor-news-fibonacci-gear-cycle-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const ROUTE = "/showroom/globe/hearth/";
  const FILE = "/showroom/globe/hearth/hearth.js";
  const EAST_FILE = "/showroom/globe/hearth/index.js";
  const NORTH_FILE = "/assets/lab/runtime-table.js";
  const EAST_BRANCH_FILE = "/assets/lab/runtime-table.east.js";
  const WEST_BRANCH_FILE = "/assets/lab/runtime-table.west.js";
  const SOUTH_BRANCH_FILE = "/assets/lab/runtime-table.south.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";

  const MOUNT_ID = "hearthCanvasMount";
  const COCKPIT_ID = "hearthLoadCockpit";
  const STATUS_ID = "hearth-route-status";

  const CYCLE_ORDER = "EAST -> WEST -> NORTH -> SOUTH -> CHECKPOINT -> EAST";

  const CHECKPOINTS = Object.freeze([
    { id: "F1A_HTML_SHELL_RENDERED", event: "HTML_SHELL_RENDERED", rank: 1, fibonacci: "F1A", value: 1, lane: "shell", label: "East shell rendered" },
    { id: "F1B_LOAD_LEDGER_INITIALIZED", event: "LOAD_LEDGER_INITIALIZED", rank: 2, fibonacci: "F1B", value: 1, lane: "ledger", label: "Load ledger initialized" },
    { id: "F2_FIRST_PAINT_COCKPIT_VISIBLE", event: "FIRST_PAINT_COCKPIT_VISIBLE", rank: 3, fibonacci: "F2", value: 2, lane: "firstPaint", label: "First paint cockpit visible" },
    { id: "F3_SCRIPT_ORDER_COMPLETE", event: "SCRIPT_ORDER_COMPLETE", rank: 4, fibonacci: "F3", value: 3, lane: "scriptOrder", label: "Script order complete" },
    { id: "F5_AUTHORITY_AVAILABILITY_READY", event: "AUTHORITY_AVAILABILITY_READY", rank: 5, fibonacci: "F5", value: 5, lane: "authorityAvailability", label: "Authority availability ready" },
    { id: "F8_CONDUCTOR_HYDRATED", event: "CONDUCTOR_HYDRATED", rank: 6, fibonacci: "F8", value: 8, lane: "conductorHydration", label: "Conductor hydrated" },
    { id: "F13A_CANVAS_COOPERATIVE_BOOT_STARTED", event: "CANVAS_COOPERATIVE_BOOT_STARTED", rank: 7, fibonacci: "F13A", value: 13, lane: "canvasAndDiagnostic", label: "Canvas cooperative boot started" },
    { id: "F13B_CANVAS_MOUNT_CREATED", event: "CANVAS_MOUNT_CREATED", rank: 8, fibonacci: "F13B", value: 13, lane: "canvasAndDiagnostic", label: "Canvas mount created" },
    { id: "F13C_CANVAS_CONTEXT_READY", event: "CANVAS_CONTEXT_READY", rank: 9, fibonacci: "F13C", value: 13, lane: "canvasAndDiagnostic", label: "Canvas context ready" },
    { id: "F13D_DRAG_INSPECTION_BOUND", event: "DRAG_INSPECTION_BOUND", rank: 10, fibonacci: "F13D", value: 13, lane: "canvasAndDiagnostic", label: "Drag inspection bound" },
    { id: "F13E_ATLAS_BUILD_STARTED", event: "ATLAS_BUILD_STARTED", rank: 11, fibonacci: "F13E", value: 13, lane: "canvasAndDiagnostic", label: "Atlas build started" },
    { id: "F13F_ATLAS_BUILD_COMPLETE", event: "ATLAS_BUILD_COMPLETE", rank: 12, fibonacci: "F13F", value: 13, lane: "canvasAndDiagnostic", label: "Atlas build complete" },
    { id: "F13G_TEXTURE_COMPOSE_STARTED", event: "TEXTURE_COMPOSE_STARTED", rank: 13, fibonacci: "F13G", value: 13, lane: "canvasAndDiagnostic", label: "Texture compose started" },
    { id: "F13H_TEXTURE_COMPOSE_COMPLETE", event: "TEXTURE_COMPOSE_COMPLETE", rank: 14, fibonacci: "F13H", value: 13, lane: "canvasAndDiagnostic", label: "Texture compose complete" },
    { id: "F13I_FIRST_FRAME_REQUESTED", event: "FIRST_FRAME_REQUESTED", rank: 15, fibonacci: "F13I", value: 13, lane: "canvasAndDiagnostic", label: "First frame requested" },
    { id: "F13J_FIRST_FRAME_DETECTED", event: "FIRST_FRAME_DETECTED", rank: 16, fibonacci: "F13J", value: 13, lane: "canvasAndDiagnostic", label: "First frame detected" },
    { id: "F13K_CANVAS_READY", event: "CANVAS_READY", rank: 17, fibonacci: "F13K", value: 13, lane: "canvasAndDiagnostic", label: "Canvas ready" },
    { id: "F13L_VISIBLE_CONTENT_PROOF_STARTED", event: "VISIBLE_CONTENT_PROOF_STARTED", rank: 18, fibonacci: "F13L", value: 13, lane: "visiblePlanetProof", label: "Visible content proof started" },
    { id: "F13M_VISIBLE_CONTENT_PROOF_PASSED", event: "VISIBLE_CONTENT_PROOF_PASSED", rank: 19, fibonacci: "F13M", value: 13, lane: "visiblePlanetProof", label: "Visible content proof passed" },
    { id: "F13N_INSPECT_MODE_READY", event: "INSPECT_MODE_READY", rank: 20, fibonacci: "F13N", value: 13, lane: "inspectMode", label: "Inspect mode ready" },
    { id: "F21_COMPLETION_LATCHED", event: "COMPLETION_LATCHED", rank: 21, fibonacci: "F21", value: 21, lane: "completionLatch", label: "Completion latched" }
  ]);

  const EVENT_TO_CHECKPOINT = CHECKPOINTS.reduce((map, checkpoint) => {
    map[checkpoint.event] = checkpoint;
    map[checkpoint.id] = checkpoint;
    return map;
  }, {});

  const PROGRESS_ONLY_EVENTS = Object.freeze([
    "ATLAS_BUILD_PROGRESS",
    "TEXTURE_COMPOSE_PROGRESS",
    "WIDE_PROBE_PROGRESS",
    "RECONCILE_PROGRESS",
    "CANVAS_PROGRESS",
    "PHASE_PROGRESS"
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "south-route-conductor-visible-completion",

    ownsSouth: true,
    ownsVisibleComposition: true,
    ownsRouteConductorRuntime: true,
    ownsNorthTruth: false,
    ownsEastAdmissionTruth: false,
    ownsWestGapTruth: false,
    ownsCanvasDrawing: false,
    ownsAtlasPainting: false,
    ownsSourceTruth: false,
    ownsFinalVisualPassClaim: false,

    cycleOrder: CYCLE_ORDER,
    gearCycleMode: true,
    oneActiveGearAtATime: true,
    activeGearProgressResets: true,
    visibleProgressRepresentsCurrentGearOnly: true,

    startedAt: "",
    updatedAt: "",
    booted: false,
    booting: false,
    disposed: false,

    northPresent: false,
    eastBranchPresent: false,
    westBranchPresent: false,
    southBranchPresent: false,
    canvasPresent: false,
    sessionPresent: false,
    sessionCreatedBySouth: false,

    activeCheckpointId: "",
    activeCheckpointRank: 0,
    activeFibonacciStage: "",
    activeGearLabel: "",
    activeGearProgress: 0,
    activeGearPercent: 0,
    activeGearStartedAt: "",
    activeGearCompletedAt: "",

    highestCompletedCheckpointId: "",
    highestCompletedRank: 0,
    completedCheckpoints: [],
    degradedCheckpoints: [],
    queuedEventsCount: 0,
    archivedEventsCount: 0,
    blockedEventsCount: 0,
    admittedEventsCount: 0,

    completionLatched: false,
    degradedCompletionLatched: false,
    readyTextAllowed: false,

    canvasBootRequested: false,
    canvasBootStarted: false,
    canvasBootComplete: false,
    canvasBootError: "",
    imageRendered: false,
    visiblePlanetAvailable: false,
    visibleContentProof: false,
    visibleContentSoftGap: false,
    inspectModeAvailable: false,
    inspectPlanetControlAvailable: false,
    diagnosticCanLeavePlanetFrame: false,

    diagnosticDockHiddenForInspection: false,
    showDiagnosticTabVisible: false,
    diagnosticDockRestorable: true,
    copyDiagnosticPreserved: true,
    receiptToggleReady: true,
    buttonsReachable: true,
    receiptOverlayIndependent: true,

    latestEvent: "SOUTH_ROUTE_CONDUCTOR_LOADED",
    postgameStatus: "SOUTH_LOADED_NOT_BOOTED",
    firstFailedCoordinate: "SOUTH_ROUTE_CONDUCTOR_NOT_BOOTED",
    recommendedNextRenewalTarget: FILE,

    lastRenderedSignature: "",
    renderScheduled: false,
    renderCount: 0,
    ledgerWriteCount: 0,
    maxLedgerWrites: 120,

    localEvents: [],
    submittedEvents: [],
    canvasEvents: [],
    archivedEvents: [],
    blockedEvents: [],
    errors: [],

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
    fill: null,
    percent: null,
    laneList: null,
    receiptBox: null,
    receiptPre: null,
    copyButton: null,
    receiptToggle: null,
    inspectButton: null,
    collapseButton: null,
    showTab: null,
    status: null
  };

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

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === "true") return true;
    if (value === "false") return false;
    if (value === 1 || value === "1") return true;
    if (value === 0 || value === "0") return false;
    return fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, safeNumber(value, min)));
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

  function formatElapsed(startIso) {
    const start = Date.parse(startIso || "");
    if (!Number.isFinite(start)) return "00:00";

    const total = Math.max(0, Math.floor((nowMs() - start) / 1000));
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

  function pushLimited(list, item, max = 160) {
    list.push(item);
    if (list.length > max) list.splice(0, list.length - max);
    return item;
  }

  function recordLocal(event, detail = {}) {
    const item = {
      at: nowIso(),
      event,
      detail: clonePlain(detail)
    };

    pushLimited(state.localEvents, item, 180);
    state.latestEvent = event;
    state.updatedAt = item.at;
    return item;
  }

  function recordError(code, message, detail = {}) {
    const item = {
      at: nowIso(),
      code,
      message: safeString(message),
      detail: clonePlain(detail)
    };

    pushLimited(state.errors, item, 100);
    state.latestEvent = code;
    state.updatedAt = item.at;
    return item;
  }

  function getGlobal(names) {
    for (const name of names) {
      if (root[name]) return root[name];
    }
    return null;
  }

  function getNorth() {
    return getGlobal([
      "LAB_RUNTIME_TABLE",
      "LAB_UNIVERSAL_PLANET_RUNTIME_TABLE",
      "LAB_CARDINAL_RUNTIME_TABLE_NORTH",
      "LAB_RUNTIME_TABLE_NORTH",
      "RUNTIME_TABLE",
      "DexterRuntimeTable"
    ]) || (root.DEXTER_LAB && root.DEXTER_LAB.runtimeTable) || null;
  }

  function getEastBranch() {
    return getGlobal([
      "LAB_RUNTIME_TABLE_EAST",
      "RUNTIME_TABLE_EAST",
      "DEXTER_LAB_RUNTIME_TABLE_EAST",
      "LAB_CARDINAL_RUNTIME_TABLE_EAST",
      "LAB_CHECKPOINT_GOVERNOR_EAST"
    ]) || (root.DEXTER_LAB && root.DEXTER_LAB.runtimeTableEast) || null;
  }

  function getWestBranch() {
    return getGlobal([
      "LAB_RUNTIME_TABLE_WEST",
      "RUNTIME_TABLE_WEST",
      "DEXTER_LAB_RUNTIME_TABLE_WEST",
      "LAB_CARDINAL_RUNTIME_TABLE_WEST",
      "LAB_GAP_CLASSIFIER_WEST"
    ]) || (root.DEXTER_LAB && root.DEXTER_LAB.runtimeTableWest) || null;
  }

  function getSouthComposer() {
    return getGlobal([
      "HEARTH_RUNTIME_TABLE_SOUTH",
      "HEARTH_VISIBLE_STATE_COMPOSER",
      "LAB_RUNTIME_TABLE_SOUTH",
      "LAB_VISIBLE_STATE_COMPOSER_SOUTH"
    ]) || (root.DEXTER_LAB && (root.DEXTER_LAB.runtimeTableSouth || root.DEXTER_LAB.visibleStateComposer)) || null;
  }

  function getCanvas() {
    return getGlobal([
      "HEARTH_CANVAS",
      "HEARTH_CANVAS_AUTHORITY",
      "HEARTH_CANVAS_EVIDENCE",
      "HEARTH_CANVAS_SOFT_GAP_ADAPTER"
    ]) || (root.HEARTH && root.HEARTH.canvas) || (root.DEXTER_LAB && root.DEXTER_LAB.hearthCanvasEvidence) || null;
  }

  function readReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    if (isFunction(authority.getReceipt)) {
      try {
        const receipt = authority.getReceipt();
        if (receipt && isObject(receipt)) return receipt;
      } catch (error) {
        recordError("READ_RECEIPT_FAILED", error && error.message ? error.message : String(error));
      }
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;

    return null;
  }

  function ensureStyle() {
    if (!doc || doc.getElementById("hearth-south-route-conductor-style")) return;

    const style = doc.createElement("style");
    style.id = "hearth-south-route-conductor-style";
    style.textContent = `
      #${MOUNT_ID},
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
        transition:width .20s ease;
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

      .hearth-ledger-lane[data-active="true"]{
        border-color:rgba(231,188,105,.52);
        background:rgba(231,188,105,.065);
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
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-scroll{
        display:none!important;
      }

      [data-hearth-south-show-diagnostic-tab]{
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

      html[data-hearth-south-inspect-active="true"] [data-hearth-south-show-diagnostic-tab]{
        display:inline-flex;
      }

      @media (max-width:760px){
        .hearth-ledger-cockpit{
          inset:8px;
          min-height:166px;
          border-radius:20px;
        }

        .hearth-ledger-head,
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
      doc.querySelector("[data-hearth-canvas-mount]") ||
      doc.querySelector("[data-hearth-planet-mount]") ||
      doc.querySelector("#hearth-planet-frame") ||
      doc.querySelector("[data-planet-frame]");

    if (!mount) {
      mount = doc.createElement("section");
      mount.id = MOUNT_ID;
      mount.dataset.hearthCanvasMount = "true";
      mount.dataset.hearthMountCreatedBySouth = CONTRACT;

      const parent = doc.getElementById("hearth-main") || doc.querySelector("main") || doc.body || doc.documentElement;
      parent.appendChild(mount);
    }

    mount.id = MOUNT_ID;
    mount.dataset.hearthCanvasMount = "true";
    mount.dataset.hearthSouthRouteConductor = CONTRACT;
    mount.dataset.hearthCycleOrder = CYCLE_ORDER;
    mount.dataset.hearthNorthFile = NORTH_FILE;
    mount.dataset.hearthEastBranchFile = EAST_BRANCH_FILE;
    mount.dataset.hearthWestBranchFile = WEST_BRANCH_FILE;
    mount.dataset.hearthSouthBranchFile = SOUTH_BRANCH_FILE;
    mount.dataset.hearthCanvasFile = CANVAS_FILE;
    mount.dataset.generatedImage = "false";
    mount.dataset.graphicBox = "false";
    mount.dataset.webgl = "false";
    mount.dataset.visualPassClaimed = "false";

    refs.mount = mount;
    return mount;
  }

  function ensureShowTab() {
    if (!doc) return null;

    let tab =
      doc.querySelector("[data-hearth-south-show-diagnostic-tab]") ||
      doc.querySelector("[data-hearth-east-show-diagnostic-tab]") ||
      doc.querySelector("[data-hearth-index-show-diagnostic-tab]");

    if (!tab) {
      tab = doc.createElement("button");
      tab.type = "button";
      tab.textContent = "Show diagnostic";
      tab.setAttribute("aria-label", "Show Hearth diagnostic");
      doc.body.appendChild(tab);
    }

    tab.dataset.hearthSouthShowDiagnosticTab = "true";
    tab.onclick = () => setInspectMode(false);

    refs.showTab = tab;
    return tab;
  }

  function ensureCockpit() {
    if (!doc) return null;

    ensureStyle();
    const mount = ensureMount();
    if (!mount) return null;
    ensureShowTab();

    let cockpit =
      doc.getElementById(COCKPIT_ID) ||
      mount.querySelector("[data-hearth-load-cockpit='true']") ||
      mount.querySelector("[data-hearth-first-paint-cockpit='true']");

    if (!cockpit) {
      cockpit = doc.createElement("aside");
      cockpit.id = COCKPIT_ID;
      cockpit.className = "hearth-ledger-cockpit";
      cockpit.dataset.hearthLoadCockpit = "true";
      cockpit.dataset.hearthSouthRouteConductor = CONTRACT;
      cockpit.dataset.cockpitMode = "loading-cockpit";
      cockpit.setAttribute("aria-live", "polite");

      cockpit.innerHTML = `
        <div class="hearth-ledger-head">
          <div class="hearth-ledger-kicker">Hearth · South Visible Completion</div>
          <h2 class="hearth-ledger-title">RUNNING HEARTH GEAR CYCLE</h2>
          <div class="hearth-ledger-meta" data-hearth-stage-label>F1A · Waiting for active gear</div>
          <div class="hearth-ledger-meta" data-hearth-heartbeat-text>cycle=${escapeHtml(CYCLE_ORDER)}</div>
          <div class="hearth-ledger-latest" data-hearth-latest-event>latest=SOUTH_ROUTE_CONDUCTOR_LOADED</div>
        </div>

        <div class="hearth-ledger-progress" data-hearth-current-gear-progress-strip="true">
          <div class="hearth-ledger-track">
            <span class="hearth-ledger-fill" data-hearth-main-progress-fill style="width:0%"></span>
          </div>
          <div class="hearth-ledger-percent" data-hearth-main-progress-percent>0%</div>
        </div>

        <div class="hearth-ledger-actions">
          <button class="hearth-ledger-button primary" type="button" data-hearth-copy-diagnostic>Copy diagnostic</button>
          <button class="hearth-ledger-button" type="button" data-hearth-toggle-receipt>Show receipt</button>
          <button class="hearth-ledger-button" type="button" data-hearth-inspect-planet>Inspect planet</button>
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
    }

    cockpit.dataset.hearthSouthRouteConductor = CONTRACT;
    cockpit.dataset.hearthReceipt = RECEIPT;
    cockpit.dataset.hearthCycleOrder = CYCLE_ORDER;
    cockpit.dataset.generatedImage = "false";
    cockpit.dataset.graphicBox = "false";
    cockpit.dataset.webgl = "false";
    cockpit.dataset.visualPassClaimed = "false";

    refs.cockpit = cockpit;
    refs.title = cockpit.querySelector(".hearth-ledger-title");
    refs.stage = cockpit.querySelector("[data-hearth-stage-label]");
    refs.heartbeat = cockpit.querySelector("[data-hearth-heartbeat-text]");
    refs.latest = cockpit.querySelector("[data-hearth-latest-event]");
    refs.fill = cockpit.querySelector("[data-hearth-main-progress-fill]");
    refs.percent = cockpit.querySelector("[data-hearth-main-progress-percent]");
    refs.laneList = cockpit.querySelector("[data-hearth-lane-list]");
    refs.receiptBox = cockpit.querySelector("[data-hearth-receipt-box]");
    refs.receiptPre = cockpit.querySelector("[data-hearth-receipt-text]");
    refs.copyButton = cockpit.querySelector("[data-hearth-copy-diagnostic]");
    refs.receiptToggle = cockpit.querySelector("[data-hearth-toggle-receipt]");
    refs.inspectButton = cockpit.querySelector("[data-hearth-inspect-planet]");
    refs.collapseButton = cockpit.querySelector("[data-hearth-collapse-cockpit]");

    if (refs.copyButton) refs.copyButton.onclick = copyDiagnostic;
    if (refs.receiptToggle) refs.receiptToggle.onclick = toggleReceipt;
    if (refs.inspectButton) refs.inspectButton.onclick = () => setInspectMode(!state.diagnosticDockHiddenForInspection);
    if (refs.collapseButton) refs.collapseButton.onclick = () => setCockpitCollapsed();

    return cockpit;
  }

  function toggleReceipt() {
    if (!refs.receiptBox) return;

    const visible = refs.receiptBox.dataset.visible !== "true";
    refs.receiptBox.dataset.visible = String(visible);

    if (refs.receiptToggle) {
      refs.receiptToggle.textContent = visible ? "Hide receipt" : "Show receipt";
    }

    scheduleRender();
  }

  function setInspectMode(active) {
    state.diagnosticDockHiddenForInspection = Boolean(active);
    state.showDiagnosticTabVisible = Boolean(active);
    state.inspectModeAvailable = true;
    state.inspectPlanetControlAvailable = true;
    state.diagnosticCanLeavePlanetFrame = true;
    state.buttonsReachable = true;

    if (refs.cockpit) {
      refs.cockpit.dataset.cockpitMode = active ? "planet-inspect" : (state.completionLatched ? "diagnostic-dock" : "loading-cockpit");
    }

    if (doc && doc.documentElement) {
      doc.documentElement.dataset.hearthSouthInspectActive = String(active);
    }

    if (refs.showTab) {
      refs.showTab.hidden = !active;
      refs.showTab.dataset.visible = String(active);
    }

    if (refs.inspectButton) {
      refs.inspectButton.textContent = active ? "Show diagnostic" : "Inspect planet";
    }

    recordLocal(active ? "SOUTH_INSPECT_MODE_ACTIVE" : "SOUTH_INSPECT_MODE_RELEASED");
    updateDataset();
    scheduleRender();
  }

  function setCockpitCollapsed() {
    if (!refs.cockpit) return;

    const collapsed = refs.cockpit.dataset.cockpitMode !== "diagnostic-dock";
    refs.cockpit.dataset.cockpitMode = collapsed ? "diagnostic-dock" : "loading-cockpit";

    if (refs.collapseButton) {
      refs.collapseButton.textContent = collapsed ? "Expand cockpit" : "Collapse cockpit";
    }
  }

  function readSession() {
    const candidates = [
      root.HEARTH_CHECKPOINT_SESSION,
      root.HEARTH_RUNTIME_CHECKPOINT_SESSION,
      root.LAB_HEARTH_CHECKPOINT_SESSION,
      root.LAB_CHECKPOINT_SESSION,
      root.DEXTER_LAB && root.DEXTER_LAB.hearthCheckpointSession,
      root.DEXTER_LAB && root.DEXTER_LAB.checkpointSession
    ].filter(Boolean);

    for (const candidate of candidates) {
      if (candidate && isFunction(candidate.submitEvent) && isFunction(candidate.getReceipt)) return candidate;
      if (candidate && isFunction(candidate.submit) && isFunction(candidate.getReceipt)) return candidate;
    }

    return null;
  }

  function ensureSession() {
    let session = readSession();
    if (session) {
      state.sessionPresent = true;
      return session;
    }

    const north = getNorth();
    const east = getEastBranch();

    const creator =
      (north && isFunction(north.createHearthCheckpointSession) && north.createHearthCheckpointSession) ||
      (east && isFunction(east.createHearthCheckpointSession) && east.createHearthCheckpointSession) ||
      null;

    if (creator) {
      try {
        session = creator({
          id: "hearth-news-fibonacci-gear-session",
          planetId: "hearth",
          planetLabel: "Hearth",
          route: ROUTE,
          coherenceSemiconductor: FILE,
          canvasAuthority: CANVAS_FILE,
          generatedImage: false,
          graphicBox: false,
          webGL: false,
          visualPassClaimed: false
        });

        root.HEARTH_CHECKPOINT_SESSION = session;
        root.HEARTH_RUNTIME_CHECKPOINT_SESSION = session;
        root.LAB_HEARTH_CHECKPOINT_SESSION = session;
        root.DEXTER_LAB = root.DEXTER_LAB || {};
        root.DEXTER_LAB.hearthCheckpointSession = session;

        state.sessionPresent = true;
        state.sessionCreatedBySouth = true;
        recordLocal("SOUTH_CREATED_HEARTH_CHECKPOINT_SESSION", { source: north ? "north" : "east" });
        return session;
      } catch (error) {
        recordError("CREATE_CHECKPOINT_SESSION_FAILED", error && error.message ? error.message : String(error));
      }
    }

    state.sessionPresent = false;
    return null;
  }

  function normalizeEventName(event) {
    if (!event) return "";
    if (typeof event === "string") return event;
    return safeString(event.event || event.phase || event.id || event.checkpointId || "");
  }

  function checkpointForEvent(eventName) {
    return EVENT_TO_CHECKPOINT[eventName] || null;
  }

  function snapshotBase(extra = {}) {
    const canvas = getCanvas();
    const canvasReceipt = readReceipt(canvas) || {};
    const session = readSession();
    const sessionReceipt = readReceipt(session) || {};
    const southState = state;

    return {
      routeMounted: true,
      canvasMounted: true,
      fallbackShellAvailable: true,

      planetCanvasPresent: safeBool(canvasReceipt.planetCanvasPresent, southState.visiblePlanetAvailable),
      planetCanvasNonZeroSize: safeBool(canvasReceipt.planetCanvasNonZeroSize, true),
      canvasCarrierMounted: safeBool(canvasReceipt.canvasCarrierMounted, true),
      canvasCarrierHandoffOk: safeBool(canvasReceipt.canvasCarrierHandoffOk, true),
      canvasCarrierHandoffError: safeString(canvasReceipt.canvasCarrierHandoffError, ""),
      sphereContainment: true,
      outsideSphereTransparent: true,
      noRectangularTextureSpill: true,

      cooperativeBootUsed: safeBool(canvasReceipt.cooperativeBootUsed, true),
      syncBootFallbackUsed: safeBool(canvasReceipt.syncBootFallbackUsed, false),
      canvasCarrierRequested: safeBool(canvasReceipt.canvasCarrierRequested, true),

      canvasReady: safeBool(canvasReceipt.canvasReady, state.canvasBootComplete),
      atlasBuildStarted: safeBool(canvasReceipt.atlasBuildStarted, false),
      atlasBuildComplete: safeBool(canvasReceipt.atlasBuildComplete, false),
      textureComposeStarted: safeBool(canvasReceipt.textureComposeStarted, false),
      textureComposeComplete: safeBool(canvasReceipt.textureComposeComplete, false),
      firstFrameRequested: safeBool(canvasReceipt.firstFrameRequested, false),
      firstFrameDetected: safeBool(canvasReceipt.firstFrameDetected, state.imageRendered),
      imageRendered: safeBool(canvasReceipt.imageRendered, state.imageRendered),
      renderedAfterTexture: safeBool(canvasReceipt.renderedAfterTexture, false),
      dragInspectionBound: safeBool(canvasReceipt.dragInspectionBound, state.inspectPlanetControlAvailable),

      visibleContentProofStarted: safeBool(canvasReceipt.visibleContentProofStarted, state.visibleContentProof),
      visibleContentProof: safeBool(canvasReceipt.visibleContentProof, state.visibleContentProof),
      visibleContentStrictProof: safeBool(canvasReceipt.visibleContentStrictProof, false),
      visibleContentSoftGap: safeBool(canvasReceipt.visibleContentSoftGap, state.visibleContentSoftGap),
      visibleContentHardFail: safeBool(canvasReceipt.visibleContentHardFail, false),
      visibleForwardProgress: safeBool(canvasReceipt.visibleForwardProgress, state.visiblePlanetAvailable),
      visibleContentAdmissible: safeBool(canvasReceipt.visibleContentAdmissible, state.visiblePlanetAvailable),
      visiblePlanetAvailable: safeBool(canvasReceipt.visiblePlanetAvailable, state.visiblePlanetAvailable),
      nonblankPlanetVisible: safeBool(canvasReceipt.nonblankPlanetVisible, state.visiblePlanetAvailable),
      carrierOnlyDetected: safeBool(canvasReceipt.carrierOnlyDetected, false),
      explicitContentReceiptProof: false,

      visibleContentSampleCount: safeNumber(canvasReceipt.visibleContentSampleCount, 0),
      visibleContentVarianceScore: safeNumber(canvasReceipt.visibleContentVarianceScore, 0),
      visibleContentClassCount: safeNumber(canvasReceipt.visibleContentClassCount, 0),
      visibleContentLandSampleCount: safeNumber(canvasReceipt.visibleContentLandSampleCount, 0),
      visibleContentWaterSampleCount: safeNumber(canvasReceipt.visibleContentWaterSampleCount, 0),
      visibleContentOtherSampleCount: safeNumber(canvasReceipt.visibleContentOtherSampleCount, 0),
      visibleContentCarrierSampleCount: safeNumber(canvasReceipt.visibleContentCarrierSampleCount, 0),

      inspectModeAvailable: state.inspectModeAvailable,
      inspectPlanetControlAvailable: state.inspectPlanetControlAvailable,
      diagnosticCanLeavePlanetFrame: state.diagnosticCanLeavePlanetFrame,
      diagnosticDockRestorable: state.diagnosticDockRestorable,
      showDiagnosticTabVisibleWhenHidden: true,
      copyDiagnosticPreserved: state.copyDiagnosticPreserved,
      receiptToggleReady: state.receiptToggleReady,
      buttonsReachable: state.buttonsReachable,
      receiptOverlayIndependent: state.receiptOverlayIndependent,
      partialReceiptAvailable: true,
      finalReceiptAvailable: state.completionLatched,

      completedCheckpoints: state.completedCheckpoints.slice(),
      activeCheckpointId: state.activeCheckpointId,
      activeCheckpointRank: state.activeCheckpointRank,
      activeFibonacciStage: state.activeFibonacciStage,
      completionLatched: state.completionLatched,
      degradedCompletionLatched: state.degradedCompletionLatched,
      f13SubsequenceComplete: state.completedCheckpoints.includes("F13N_INSPECT_MODE_READY"),
      f21Allowed: safeBool(sessionReceipt.f21Allowed, false),
      f21DegradedAllowed: safeBool(sessionReceipt.f21DegradedAllowed, false),

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      ...extra
    };
  }

  function submitToSession(eventName, detail = {}) {
    if (!eventName || PROGRESS_ONLY_EVENTS.includes(eventName)) {
      const archived = {
        at: nowIso(),
        event: eventName,
        reason: "progress-only-or-empty-event-archived",
        detail: clonePlain(detail)
      };

      pushLimited(state.archivedEvents, archived, 220);
      state.archivedEventsCount += 1;
      return null;
    }

    const checkpoint = checkpointForEvent(eventName);
    const session = ensureSession();

    if (!session) {
      recordError("SESSION_NOT_AVAILABLE", "Checkpoint session not available.", { eventName });
      return null;
    }

    const event = {
      event: eventName,
      id: eventName,
      phase: eventName,
      checkpointId: checkpoint ? checkpoint.id : eventName,
      source: "hearth.south.route.conductor",
      contract: CONTRACT,
      receipt: RECEIPT,
      snapshot: snapshotBase(detail.snapshot || {}),
      detail: {
        ...detail,
        contract: CONTRACT,
        receipt: RECEIPT,
        source: "hearth.south.route.conductor"
      }
    };

    try {
      const result = isFunction(session.submitEvent)
        ? session.submitEvent(event)
        : session.submit(event);

      pushLimited(state.submittedEvents, {
        at: nowIso(),
        event: eventName,
        checkpointId: checkpoint ? checkpoint.id : "",
        result: clonePlain(result)
      }, 220);

      state.admittedEventsCount += result && result.action === "ADMIT" ? 1 : 0;
      state.queuedEventsCount += result && result.action === "QUEUE" ? 1 : 0;
      state.archivedEventsCount += result && result.action === "ARCHIVE" ? 1 : 0;
      state.blockedEventsCount += result && result.action === "BLOCK" ? 1 : 0;

      recordLocal(`SOUTH_SUBMITTED_${eventName}`, { result: clonePlain(result) });
      reconcileFromSession();
      return result;
    } catch (error) {
      recordError("SUBMIT_EVENT_FAILED", error && error.message ? error.message : String(error), { eventName });
      return null;
    }
  }

  function reconcileFromSession() {
    const north = getNorth();
    const east = getEastBranch();
    const west = getWestBranch();
    const south = getSouthComposer();
    const canvas = getCanvas();
    const session = ensureSession();

    state.northPresent = Boolean(north);
    state.eastBranchPresent = Boolean(east);
    state.westBranchPresent = Boolean(west);
    state.southBranchPresent = Boolean(south);
    state.canvasPresent = Boolean(canvas);
    state.sessionPresent = Boolean(session);

    const sessionReceipt = readReceipt(session) || {};
    const canvasReceipt = readReceipt(canvas) || {};

    const activeId = safeString(sessionReceipt.activeCheckpointId, state.activeCheckpointId || "F1A_HTML_SHELL_RENDERED");
    const active = EVENT_TO_CHECKPOINT[activeId] || CHECKPOINTS.find((item) => item.id === activeId) || CHECKPOINTS[0];

    const previousActiveId = state.activeCheckpointId;

    state.activeCheckpointId = active.id;
    state.activeCheckpointRank = active.rank;
    state.activeFibonacciStage = active.fibonacci;
    state.activeGearLabel = active.label;

    if (previousActiveId !== state.activeCheckpointId) {
      state.activeGearStartedAt = nowIso();
      state.activeGearCompletedAt = "";
      state.activeGearProgress = 0;
      state.activeGearPercent = 0;
      recordLocal("SOUTH_ACTIVE_GEAR_CHANGED", {
        from: previousActiveId,
        to: state.activeCheckpointId,
        fibonacci: state.activeFibonacciStage
      });
    }

    state.highestCompletedCheckpointId = safeString(sessionReceipt.highestCompletedCheckpointId, state.highestCompletedCheckpointId);
    state.highestCompletedRank = safeNumber(sessionReceipt.highestCompletedRank, state.highestCompletedRank);

    state.completedCheckpoints = Array.isArray(sessionReceipt.completedCheckpoints)
      ? sessionReceipt.completedCheckpoints.slice()
      : state.completedCheckpoints;

    state.degradedCheckpoints = Array.isArray(sessionReceipt.degradedCheckpoints)
      ? sessionReceipt.degradedCheckpoints.slice()
      : state.degradedCheckpoints;

    state.queuedEventsCount = safeNumber(sessionReceipt.queuedEventsCount, state.queuedEventsCount);
    state.archivedEventsCount = safeNumber(sessionReceipt.archivedEventsCount, state.archivedEventsCount);
    state.blockedEventsCount = safeNumber(sessionReceipt.blockedEventsCount, state.blockedEventsCount);
    state.admittedEventsCount = safeNumber(sessionReceipt.admittedEventsCount, state.admittedEventsCount);

    state.completionLatched = safeBool(sessionReceipt.completionLatched, state.completionLatched);
    state.degradedCompletionLatched = safeBool(sessionReceipt.degradedCompletionLatched, state.degradedCompletionLatched);
    state.readyTextAllowed = safeBool(sessionReceipt.readyTextAllowed, state.readyTextAllowed);

    state.imageRendered = safeBool(canvasReceipt.imageRendered, state.imageRendered);
    state.canvasBootComplete = safeBool(canvasReceipt.canvasReady, state.canvasBootComplete);
    state.visiblePlanetAvailable = safeBool(canvasReceipt.visiblePlanetAvailable, state.visiblePlanetAvailable);
    state.visibleContentProof = safeBool(canvasReceipt.visibleContentProof, state.visibleContentProof);
    state.visibleContentSoftGap = safeBool(canvasReceipt.visibleContentSoftGap, state.visibleContentSoftGap);

    state.firstFailedCoordinate = safeString(sessionReceipt.firstFailedCoordinate, state.firstFailedCoordinate);
    state.recommendedNextRenewalTarget = safeString(sessionReceipt.recommendedNextRenewalTarget, state.recommendedNextRenewalTarget);
    state.postgameStatus = safeString(sessionReceipt.postgameStatus, state.postgameStatus);

    if (state.completionLatched) {
      state.activeGearProgress = 100;
      state.activeGearPercent = 100;
      state.postgameStatus = state.degradedCompletionLatched
        ? "READY_DEGRADED_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE"
        : "READY_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE";
      state.firstFailedCoordinate = state.degradedCompletionLatched
        ? "DEGRADED_F21_LATCHED_WITH_GAP_RECEIPT"
        : "NONE_F21_FULL_LATCHED";
      state.recommendedNextRenewalTarget = state.degradedCompletionLatched
        ? FILE
        : "read-postgame-canvas-or-triple-g-receipt";
    } else {
      state.activeGearProgress = deriveCurrentGearProgress(active, sessionReceipt, canvasReceipt);
      state.activeGearPercent = state.activeGearProgress;
    }

    composeSouthVisibleState(sessionReceipt, canvasReceipt);
    updateDataset();
    return getReceiptLight();
  }

  function deriveCurrentGearProgress(active, sessionReceipt, canvasReceipt) {
    if (!active) return 0;

    if (state.completedCheckpoints.includes(active.id)) return 100;

    switch (active.id) {
      case "F1A_HTML_SHELL_RENDERED":
      case "F1B_LOAD_LEDGER_INITIALIZED":
      case "F2_FIRST_PAINT_COCKPIT_VISIBLE":
      case "F3_SCRIPT_ORDER_COMPLETE":
      case "F5_AUTHORITY_AVAILABILITY_READY":
      case "F8_CONDUCTOR_HYDRATED":
        return 20;

      case "F13A_CANVAS_COOPERATIVE_BOOT_STARTED":
        return safeBool(canvasReceipt.cooperativeBootUsed, false) ? 100 : 0;

      case "F13B_CANVAS_MOUNT_CREATED":
        return safeBool(canvasReceipt.canvasCarrierMounted, false) ? 100 : 0;

      case "F13C_CANVAS_CONTEXT_READY":
        return safeBool(canvasReceipt.canvasContextReady, false) ? 100 : 0;

      case "F13D_DRAG_INSPECTION_BOUND":
        return safeBool(canvasReceipt.dragInspectionBound, false) ? 100 : 0;

      case "F13E_ATLAS_BUILD_STARTED":
        return safeBool(canvasReceipt.atlasBuildStarted, false) ? Math.max(25, safeNumber(canvasReceipt.atlasBuildProgress, 0)) : 0;

      case "F13F_ATLAS_BUILD_COMPLETE":
        return safeBool(canvasReceipt.atlasBuildComplete, false) ? 100 : safeNumber(canvasReceipt.atlasBuildProgress, 0);

      case "F13G_TEXTURE_COMPOSE_STARTED":
        return safeBool(canvasReceipt.textureComposeStarted, false) ? Math.max(25, safeNumber(canvasReceipt.textureComposeProgress, 0)) : 0;

      case "F13H_TEXTURE_COMPOSE_COMPLETE":
        return safeBool(canvasReceipt.textureComposeComplete, false) ? 100 : safeNumber(canvasReceipt.textureComposeProgress, 0);

      case "F13I_FIRST_FRAME_REQUESTED":
        return safeBool(canvasReceipt.firstFrameRequested, false) ? 100 : 0;

      case "F13J_FIRST_FRAME_DETECTED":
        return safeBool(canvasReceipt.firstFrameDetected, false) ? 100 : 0;

      case "F13K_CANVAS_READY":
        return safeBool(canvasReceipt.canvasReady, false) ? 100 : 0;

      case "F13L_VISIBLE_CONTENT_PROOF_STARTED":
        return safeBool(canvasReceipt.visibleContentProofStarted, false) ? 100 : 0;

      case "F13M_VISIBLE_CONTENT_PROOF_PASSED":
        return safeBool(canvasReceipt.visibleContentProof, false) || safeBool(canvasReceipt.visibleContentSoftGap, false) ? 100 : 65;

      case "F13N_INSPECT_MODE_READY":
        return state.inspectModeAvailable || state.receiptToggleReady ? 100 : 55;

      case "F21_COMPLETION_LATCHED":
        return safeBool(sessionReceipt.f21Allowed, false) || safeBool(sessionReceipt.f21DegradedAllowed, false) ? 98 : 50;

      default:
        return clamp(safeNumber(sessionReceipt.visibleProgress, 0), 0, 98);
    }
  }

  function composeSouthVisibleState(sessionReceipt = {}, canvasReceipt = {}) {
    const composer = getSouthComposer();

    if (!composer || !isFunction(composer.composeVisibleState)) return null;

    try {
      const packet = composer.composeVisibleState({
        north: sessionReceipt,
        canvas: canvasReceipt,
        south: getReceiptLight(),
        snapshot: snapshotBase()
      });

      if (packet && isObject(packet)) {
        state.postgameStatus = safeString(packet.postgameStatus, state.postgameStatus);
        state.firstFailedCoordinate = safeString(packet.firstFailedCoordinate, state.firstFailedCoordinate);
        state.recommendedNextRenewalTarget = safeString(packet.recommendedNextRenewalTarget, state.recommendedNextRenewalTarget);
        state.visiblePlanetAvailable = safeBool(packet.visiblePlanetAvailable, state.visiblePlanetAvailable);
        state.inspectModeAvailable = safeBool(packet.inspectModeAvailable, state.inspectModeAvailable);
        state.inspectPlanetControlAvailable = safeBool(packet.inspectPlanetControlAvailable, state.inspectPlanetControlAvailable);
        state.diagnosticCanLeavePlanetFrame = safeBool(packet.diagnosticCanLeavePlanetFrame, state.diagnosticCanLeavePlanetFrame);
      }

      return packet;
    } catch (error) {
      recordError("SOUTH_COMPOSE_VISIBLE_STATE_FAILED", error && error.message ? error.message : String(error));
      return null;
    }
  }

  function bootEarlyCheckpoints() {
    submitToSession("HTML_SHELL_RENDERED", { snapshot: snapshotBase() });
    submitToSession("LOAD_LEDGER_INITIALIZED", { snapshot: snapshotBase() });
    submitToSession("FIRST_PAINT_COCKPIT_VISIBLE", { snapshot: snapshotBase() });
    submitToSession("SCRIPT_ORDER_COMPLETE", { snapshot: snapshotBase() });
    submitToSession("AUTHORITY_AVAILABILITY_READY", { snapshot: snapshotBase() });
    submitToSession("CONDUCTOR_HYDRATED", { snapshot: snapshotBase() });
  }

  function handleCanvasPhase(event) {
    const detail = event && event.detail ? event.detail : {};
    const phaseEvent = detail.event || {};
    const eventName = normalizeEventName(phaseEvent);

    if (!eventName) return;

    pushLimited(state.canvasEvents, {
      at: nowIso(),
      event: eventName,
      detail: clonePlain(detail)
    }, 260);

    if (PROGRESS_ONLY_EVENTS.includes(eventName)) {
      pushLimited(state.archivedEvents, {
        at: nowIso(),
        event: eventName,
        reason: "progress-only-event-visible-bar-not-mutated"
      }, 220);
      scheduleRender();
      return;
    }

    if (eventName === "VISIBLE_CONTENT_SOFT_GAP") {
      submitToSession("VISIBLE_CONTENT_PROOF_PASSED", {
        softGapForwardProgressAllowed: true,
        snapshot: snapshotBase({ visibleContentSoftGap: true, visiblePlanetAvailable: true })
      });
    } else if (eventName === "VISIBLE_CONTENT_HARD_FAIL") {
      pushLimited(state.blockedEvents, {
        at: nowIso(),
        event: eventName,
        reason: "canvas-visible-content-hard-fail"
      }, 120);
      state.blockedEventsCount += 1;
    } else {
      submitToSession(eventName, {
        snapshot: snapshotBase()
      });
    }

    reconcileFromSession();
    scheduleRender();
  }

  function startCanvas() {
    if (state.canvasBootRequested) return;

    const canvas = getCanvas();
    if (!canvas) {
      state.canvasBootError = "HEARTH_CANVAS not present yet.";
      recordError("CANVAS_AUTHORITY_MISSING", state.canvasBootError, { file: CANVAS_FILE });
      scheduleRender();
      return;
    }

    state.canvasBootRequested = true;
    state.canvasBootStarted = true;

    const options = {
      mount: refs.mount || ensureMount(),
      onPhase: (_event) => scheduleRender(),
      onStatus: (_event) => scheduleRender(),
      onReady: () => {
        state.canvasBootComplete = true;
        reconcileFromSession();
        maybeSubmitInspectAndCompletion();
        scheduleRender();
      },
      onError: (error) => {
        state.canvasBootError = error && error.message ? error.message : String(error);
        recordError("CANVAS_BOOT_FAILED", state.canvasBootError);
        scheduleRender();
      }
    };

    try {
      const result = isFunction(canvas.bootCooperative)
        ? canvas.bootCooperative(options)
        : isFunction(canvas.boot)
          ? canvas.boot(options)
          : isFunction(canvas.render)
            ? canvas.render(options)
            : null;

      if (result && isFunction(result.then)) {
        result.then(() => {
          state.canvasBootComplete = true;
          reconcileFromSession();
          maybeSubmitInspectAndCompletion();
          scheduleRender();
        }).catch((error) => {
          state.canvasBootError = error && error.message ? error.message : String(error);
          recordError("CANVAS_BOOT_PROMISE_FAILED", state.canvasBootError);
          scheduleRender();
        });
      }
    } catch (error) {
      state.canvasBootError = error && error.message ? error.message : String(error);
      recordError("CANVAS_BOOT_THROWN", state.canvasBootError);
    }
  }

  function maybeSubmitInspectAndCompletion() {
    const canvas = getCanvas();
    const canvasReceipt = readReceipt(canvas) || {};
    const session = ensureSession();
    const sessionReceipt = readReceipt(session) || {};

    if (safeBool(canvasReceipt.visiblePlanetAvailable, false) || safeBool(canvasReceipt.visibleContentSoftGap, false)) {
      state.inspectModeAvailable = true;
      state.inspectPlanetControlAvailable = true;
      state.diagnosticCanLeavePlanetFrame = true;
      state.buttonsReachable = true;

      submitToSession("INSPECT_MODE_READY", {
        snapshot: snapshotBase({
          inspectModeAvailable: true,
          inspectPlanetControlAvailable: true,
          diagnosticCanLeavePlanetFrame: true,
          buttonsReachable: true
        })
      });
    }

    const latestReceipt = readReceipt(session) || sessionReceipt;

    if (
      safeBool(latestReceipt.f21Allowed, false) ||
      safeBool(latestReceipt.f21DegradedAllowed, false) ||
      (
        state.completedCheckpoints.includes("F13N_INSPECT_MODE_READY") &&
        state.visiblePlanetAvailable
      )
    ) {
      submitToSession("COMPLETION_LATCHED", {
        f21Allowed: safeBool(latestReceipt.f21Allowed, false),
        f21DegradedAllowed: safeBool(latestReceipt.f21DegradedAllowed, true),
        snapshot: snapshotBase({
          inspectModeAvailable: true,
          inspectPlanetControlAvailable: true,
          diagnosticCanLeavePlanetFrame: true,
          buttonsReachable: true
        })
      });
    }

    reconcileFromSession();
  }

  function laneMarkup() {
    const activeRank = state.activeCheckpointRank;
    const completed = new Set(state.completedCheckpoints || []);

    return CHECKPOINTS.map((checkpoint) => {
      const active = checkpoint.rank === activeRank && !completed.has(checkpoint.id) && !state.completionLatched;
      const done = completed.has(checkpoint.id) || (state.completionLatched && checkpoint.id === "F21_COMPLETION_LATCHED");
      const held = checkpoint.rank > activeRank && !done;
      const degraded = state.degradedCheckpoints.includes(checkpoint.id);

      let status = "HELD";
      let progress = 0;

      if (done) {
        status = degraded ? "DEGRADED" : "COMPLETE";
        progress = 100;
      } else if (active) {
        status = "ACTIVE";
        progress = state.activeGearProgress;
      } else if (!held) {
        status = "ARCHIVED";
        progress = 100;
      }

      return `
        <section class="hearth-ledger-lane" data-checkpoint="${escapeHtml(checkpoint.id)}" data-active="${active ? "true" : "false"}" data-status="${escapeHtml(status)}">
          <div class="hearth-ledger-lane-top">
            <span class="hearth-ledger-lane-title">
              <strong>${escapeHtml(checkpoint.label)} · ${escapeHtml(checkpoint.fibonacci)}</strong>
              <span>${escapeHtml(checkpoint.event)}</span>
            </span>
            <span class="hearth-ledger-lane-status">${escapeHtml(status)}</span>
          </div>
          <div class="hearth-ledger-lane-track">
            <span class="hearth-ledger-lane-fill" style="width:${clamp(progress, 0, 100)}%"></span>
          </div>
          <div class="hearth-ledger-lane-title">
            <span>gear=${escapeHtml(checkpoint.rank)} · value=${escapeHtml(checkpoint.value)}</span>
          </div>
        </section>
      `;
    }).join("");
  }

  function render() {
    if (!refs.cockpit) return;

    reconcileFromSession();

    const signature = JSON.stringify({
      activeCheckpointId: state.activeCheckpointId,
      activeGearProgress: state.activeGearProgress,
      completionLatched: state.completionLatched,
      postgameStatus: state.postgameStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      diagnosticDockHiddenForInspection: state.diagnosticDockHiddenForInspection,
      visiblePlanetAvailable: state.visiblePlanetAvailable,
      errors: state.errors.length
    });

    if (signature === state.lastRenderedSignature) return;

    state.lastRenderedSignature = signature;
    state.renderCount += 1;

    const progress = state.completionLatched ? 100 : clamp(state.activeGearProgress, 0, 100);

    if (refs.title) {
      refs.title.textContent = state.completionLatched
        ? "HEARTH LOADING CYCLE COMPLETE"
        : "RUNNING HEARTH GEAR CYCLE";
    }

    if (refs.stage) {
      refs.stage.textContent = `${state.activeFibonacciStage || "F1A"} · ${state.activeGearLabel || "Active gear"}`;
    }

    if (refs.heartbeat) {
      refs.heartbeat.textContent = `gear=${state.activeCheckpointRank || 1} · cycle=${CYCLE_ORDER} · elapsed=${formatElapsed(state.startedAt)}`;
    }

    if (refs.latest) {
      refs.latest.textContent = `latest=${state.latestEvent}`;
    }

    if (refs.fill) refs.fill.style.width = `${progress}%`;
    if (refs.percent) refs.percent.textContent = `${Math.round(progress)}%`;
    if (refs.laneList) refs.laneList.innerHTML = laneMarkup();
    if (refs.receiptPre) refs.receiptPre.textContent = getReceiptText();

    if (refs.cockpit && !state.diagnosticDockHiddenForInspection) {
      refs.cockpit.dataset.cockpitMode = state.completionLatched ? "diagnostic-dock" : "loading-cockpit";
    }

    publishStatusNode();
    updateDataset();
  }

  function scheduleRender() {
    if (state.renderScheduled || state.disposed) return;

    state.renderScheduled = true;

    const run = () => {
      state.renderScheduled = false;
      render();
    };

    if (typeof root.requestAnimationFrame === "function") {
      root.requestAnimationFrame(run);
    } else {
      root.setTimeout(run, 50);
    }
  }

  function publishStatusNode() {
    if (!doc) return;

    const node =
      doc.getElementById(STATUS_ID) ||
      doc.querySelector("[data-hearth-route-status]");

    if (!node) return;

    refs.status = node;

    node.textContent = [
      "Hearth South route conductor active.",
      `Contract ${CONTRACT}`,
      `Receipt ${RECEIPT}`,
      `File ${FILE}`,
      `North ${NORTH_FILE}`,
      `Cycle ${CYCLE_ORDER}`,
      `Gear cycle mode ${state.gearCycleMode}`,
      `One active gear at a time ${state.oneActiveGearAtATime}`,
      `Active checkpoint ${state.activeCheckpointId}`,
      `Active stage ${state.activeFibonacciStage}`,
      `Active gear progress ${state.activeGearProgress}`,
      `Completion latched ${state.completionLatched}`,
      `Visible planet available ${state.visiblePlanetAvailable}`,
      `First failed coordinate ${state.firstFailedCoordinate}`,
      `Recommended next renewal target ${state.recommendedNextRenewalTarget}`,
      "Generated image false",
      "GraphicBox false",
      "WebGL false",
      "Visual pass claimed false",
      `Updated ${state.updatedAt || nowIso()}`
    ].join("\n");
  }

  function updateDataset() {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthSouthRouteConductorLoaded = "true";
    dataset.hearthSouthRouteConductorContract = CONTRACT;
    dataset.hearthSouthRouteConductorReceipt = RECEIPT;
    dataset.hearthSouthRouteConductorVersion = VERSION;
    dataset.hearthSouthFile = FILE;
    dataset.hearthNorthFile = NORTH_FILE;
    dataset.hearthEastBranchFile = EAST_BRANCH_FILE;
    dataset.hearthWestBranchFile = WEST_BRANCH_FILE;
    dataset.hearthSouthBranchFile = SOUTH_BRANCH_FILE;
    dataset.hearthCanvasFile = CANVAS_FILE;

    dataset.hearthCycleOrder = CYCLE_ORDER;
    dataset.hearthGearCycleMode = "true";
    dataset.hearthOneActiveGearAtATime = "true";
    dataset.hearthVisibleProgressRepresentsCurrentGearOnly = "true";
    dataset.hearthActiveGearProgressResets = "true";

    dataset.hearthSouthActiveCheckpointId = state.activeCheckpointId;
    dataset.hearthSouthActiveCheckpointRank = String(state.activeCheckpointRank);
    dataset.hearthSouthActiveFibonacciStage = state.activeFibonacciStage;
    dataset.hearthSouthActiveGearProgress = String(state.activeGearProgress);
    dataset.hearthSouthCompletionLatched = String(state.completionLatched);
    dataset.hearthSouthReadyTextAllowed = String(state.readyTextAllowed);

    dataset.hearthSouthNorthPresent = String(state.northPresent);
    dataset.hearthSouthEastBranchPresent = String(state.eastBranchPresent);
    dataset.hearthSouthWestBranchPresent = String(state.westBranchPresent);
    dataset.hearthSouthSouthBranchPresent = String(state.southBranchPresent);
    dataset.hearthSouthCanvasPresent = String(state.canvasPresent);
    dataset.hearthSouthSessionPresent = String(state.sessionPresent);

    dataset.hearthSouthVisiblePlanetAvailable = String(state.visiblePlanetAvailable);
    dataset.hearthSouthVisibleContentProof = String(state.visibleContentProof);
    dataset.hearthSouthVisibleContentSoftGap = String(state.visibleContentSoftGap);

    dataset.hearthSouthInspectModeAvailable = String(state.inspectModeAvailable);
    dataset.hearthSouthInspectPlanetControlAvailable = String(state.inspectPlanetControlAvailable);
    dataset.hearthSouthDiagnosticCanLeavePlanetFrame = String(state.diagnosticCanLeavePlanetFrame);
    dataset.hearthSouthInspectActive = String(state.diagnosticDockHiddenForInspection);

    dataset.hearthSouthFirstFailedCoordinate = state.firstFailedCoordinate;
    dataset.hearthSouthRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  function getReceiptLight() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      role: state.role,

      ownsSouth: true,
      ownsVisibleComposition: true,
      ownsRouteConductorRuntime: true,
      ownsNorthTruth: false,
      ownsEastAdmissionTruth: false,
      ownsWestGapTruth: false,
      ownsCanvasDrawing: false,
      ownsAtlasPainting: false,
      ownsSourceTruth: false,
      ownsFinalVisualPassClaim: false,

      cycleOrder: CYCLE_ORDER,
      gearCycleMode: true,
      oneActiveGearAtATime: true,
      activeGearProgressResets: true,
      visibleProgressRepresentsCurrentGearOnly: true,

      northFile: NORTH_FILE,
      eastBranchFile: EAST_BRANCH_FILE,
      westBranchFile: WEST_BRANCH_FILE,
      southBranchFile: SOUTH_BRANCH_FILE,
      canvasFile: CANVAS_FILE,

      northPresent: state.northPresent,
      eastBranchPresent: state.eastBranchPresent,
      westBranchPresent: state.westBranchPresent,
      southBranchPresent: state.southBranchPresent,
      canvasPresent: state.canvasPresent,
      sessionPresent: state.sessionPresent,
      sessionCreatedBySouth: state.sessionCreatedBySouth,

      activeCheckpointId: state.activeCheckpointId,
      activeCheckpointRank: state.activeCheckpointRank,
      activeFibonacciStage: state.activeFibonacciStage,
      activeGearLabel: state.activeGearLabel,
      activeGearProgress: state.activeGearProgress,
      activeGearPercent: state.activeGearPercent,

      highestCompletedCheckpointId: state.highestCompletedCheckpointId,
      highestCompletedRank: state.highestCompletedRank,
      completedCheckpoints: state.completedCheckpoints.slice(),
      degradedCheckpoints: state.degradedCheckpoints.slice(),

      queuedEventsCount: state.queuedEventsCount,
      archivedEventsCount: state.archivedEventsCount,
      blockedEventsCount: state.blockedEventsCount,
      admittedEventsCount: state.admittedEventsCount,

      completionLatched: state.completionLatched,
      degradedCompletionLatched: state.degradedCompletionLatched,
      readyTextAllowed: state.readyTextAllowed,

      canvasBootRequested: state.canvasBootRequested,
      canvasBootStarted: state.canvasBootStarted,
      canvasBootComplete: state.canvasBootComplete,
      canvasBootError: state.canvasBootError,
      imageRendered: state.imageRendered,
      visiblePlanetAvailable: state.visiblePlanetAvailable,
      visibleContentProof: state.visibleContentProof,
      visibleContentSoftGap: state.visibleContentSoftGap,

      inspectModeAvailable: state.inspectModeAvailable,
      inspectPlanetControlAvailable: state.inspectPlanetControlAvailable,
      diagnosticCanLeavePlanetFrame: state.diagnosticCanLeavePlanetFrame,
      diagnosticDockHiddenForInspection: state.diagnosticDockHiddenForInspection,
      showDiagnosticTabVisible: state.showDiagnosticTabVisible,
      diagnosticDockRestorable: state.diagnosticDockRestorable,
      copyDiagnosticPreserved: state.copyDiagnosticPreserved,
      receiptToggleReady: state.receiptToggleReady,
      buttonsReachable: state.buttonsReachable,
      receiptOverlayIndependent: state.receiptOverlayIndependent,

      latestEvent: state.latestEvent,
      postgameStatus: state.postgameStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      renderCount: state.renderCount,
      ledgerWriteCount: state.ledgerWriteCount,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      startedAt: state.startedAt,
      updatedAt: state.updatedAt || nowIso()
    };
  }

  function getReceipt() {
    reconcileFromSession();

    return {
      ...getReceiptLight(),
      localEvents: clonePlain(state.localEvents),
      submittedEvents: clonePlain(state.submittedEvents),
      canvasEvents: clonePlain(state.canvasEvents),
      archivedEvents: clonePlain(state.archivedEvents),
      blockedEvents: clonePlain(state.blockedEvents),
      errors: clonePlain(state.errors),
      northReceipt: clonePlain(readReceipt(getNorth())),
      sessionReceipt: clonePlain(readReceipt(readSession())),
      canvasReceipt: clonePlain(readReceipt(getCanvas())),
      southComposerReceipt: clonePlain(readReceipt(getSouthComposer()))
    };
  }

  function getReceiptText() {
    const receipt = getReceiptLight();

    const completed = receipt.completedCheckpoints.length
      ? receipt.completedCheckpoints.map((item) => `- ${item}`).join("\n")
      : "- none";

    const degraded = receipt.degradedCheckpoints.length
      ? receipt.degradedCheckpoints.map((item) => `- ${item}`).join("\n")
      : "- none";

    const local = state.localEvents.map((event) => (
      `- ${event.at} :: ${event.event} :: ${JSON.stringify(event.detail || {})}`
    )).join("\n") || "- none";

    const submitted = state.submittedEvents.map((event) => (
      `- ${event.at} :: ${event.event} :: checkpoint=${event.checkpointId || ""} :: ${JSON.stringify(event.result || {})}`
    )).join("\n") || "- none";

    const errors = state.errors.map((error) => (
      `- ${error.at} :: ${error.code} :: ${error.message}`
    )).join("\n") || "- none";

    return [
      "HEARTH_SOUTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_GEAR_CYCLE_RECEIPT",
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
      `cycleOrder=${receipt.cycleOrder}`,
      `gearCycleMode=${receipt.gearCycleMode}`,
      `oneActiveGearAtATime=${receipt.oneActiveGearAtATime}`,
      `activeGearProgressResets=${receipt.activeGearProgressResets}`,
      `visibleProgressRepresentsCurrentGearOnly=${receipt.visibleProgressRepresentsCurrentGearOnly}`,
      "",
      `northFile=${receipt.northFile}`,
      `eastBranchFile=${receipt.eastBranchFile}`,
      `westBranchFile=${receipt.westBranchFile}`,
      `southBranchFile=${receipt.southBranchFile}`,
      `canvasFile=${receipt.canvasFile}`,
      "",
      `northPresent=${receipt.northPresent}`,
      `eastBranchPresent=${receipt.eastBranchPresent}`,
      `westBranchPresent=${receipt.westBranchPresent}`,
      `southBranchPresent=${receipt.southBranchPresent}`,
      `canvasPresent=${receipt.canvasPresent}`,
      `sessionPresent=${receipt.sessionPresent}`,
      `sessionCreatedBySouth=${receipt.sessionCreatedBySouth}`,
      "",
      `activeCheckpointId=${receipt.activeCheckpointId}`,
      `activeCheckpointRank=${receipt.activeCheckpointRank}`,
      `activeFibonacciStage=${receipt.activeFibonacciStage}`,
      `activeGearLabel=${receipt.activeGearLabel}`,
      `activeGearProgress=${receipt.activeGearProgress}`,
      `activeGearPercent=${receipt.activeGearPercent}`,
      "",
      `highestCompletedCheckpointId=${receipt.highestCompletedCheckpointId}`,
      `highestCompletedRank=${receipt.highestCompletedRank}`,
      "",
      "COMPLETED_CHECKPOINTS",
      completed,
      "",
      "DEGRADED_CHECKPOINTS",
      degraded,
      "",
      `queuedEventsCount=${receipt.queuedEventsCount}`,
      `archivedEventsCount=${receipt.archivedEventsCount}`,
      `blockedEventsCount=${receipt.blockedEventsCount}`,
      `admittedEventsCount=${receipt.admittedEventsCount}`,
      "",
      `completionLatched=${receipt.completionLatched}`,
      `degradedCompletionLatched=${receipt.degradedCompletionLatched}`,
      `readyTextAllowed=${receipt.readyTextAllowed}`,
      "",
      `canvasBootRequested=${receipt.canvasBootRequested}`,
      `canvasBootStarted=${receipt.canvasBootStarted}`,
      `canvasBootComplete=${receipt.canvasBootComplete}`,
      `canvasBootError=${receipt.canvasBootError}`,
      `imageRendered=${receipt.imageRendered}`,
      `visiblePlanetAvailable=${receipt.visiblePlanetAvailable}`,
      `visibleContentProof=${receipt.visibleContentProof}`,
      `visibleContentSoftGap=${receipt.visibleContentSoftGap}`,
      "",
      `inspectModeAvailable=${receipt.inspectModeAvailable}`,
      `inspectPlanetControlAvailable=${receipt.inspectPlanetControlAvailable}`,
      `diagnosticCanLeavePlanetFrame=${receipt.diagnosticCanLeavePlanetFrame}`,
      `diagnosticDockHiddenForInspection=${receipt.diagnosticDockHiddenForInspection}`,
      `showDiagnosticTabVisible=${receipt.showDiagnosticTabVisible}`,
      `diagnosticDockRestorable=${receipt.diagnosticDockRestorable}`,
      `copyDiagnosticPreserved=${receipt.copyDiagnosticPreserved}`,
      `receiptToggleReady=${receipt.receiptToggleReady}`,
      `buttonsReachable=${receipt.buttonsReachable}`,
      `receiptOverlayIndependent=${receipt.receiptOverlayIndependent}`,
      "",
      `latestEvent=${receipt.latestEvent}`,
      `postgameStatus=${receipt.postgameStatus}`,
      `firstFailedCoordinate=${receipt.firstFailedCoordinate}`,
      `recommendedNextRenewalTarget=${receipt.recommendedNextRenewalTarget}`,
      "",
      `renderCount=${receipt.renderCount}`,
      `ledgerWriteCount=${receipt.ledgerWriteCount}`,
      "",
      "SUBMITTED_EVENTS",
      submitted,
      "",
      "LOCAL_EVENTS",
      local,
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

    recordLocal("SOUTH_DIAGNOSTIC_COPIED", { ok });
    return ok;
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.HEARTH.southRouteConductor = api;
    root.HEARTH.routeConductor = api;
    root.HEARTH.visibleCompletion = api;

    root.HEARTH_SOUTH_VISIBLE_COMPLETION = api;
    root.HEARTH_SOUTH_VISIBLE_COMPLETION_CYCLE_CONSUMER = api;
    root.HEARTH_ROUTE_CONDUCTOR = api;
    root.HearthRouteConductor = api;
    root.HEARTH_ROUTE_COHERENCE_SEMICONDUCTOR = api;
    root.HEARTH_SOUTH_ROUTE_CONDUCTOR = api;

    root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT = getReceiptLight();
    root.HEARTH_ROUTE_CONDUCTOR_RECEIPT = root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT;
    root.HEARTH_ROUTE_COHERENCE_SEMICONDUCTOR_RECEIPT = root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT;

    root.__HEARTH_ACTIVE_ROUTE_FILE__ = FILE;
    root.__HEARTH_NORTH_RUNTIME_TABLE_FILE__ = NORTH_FILE;
    root.__HEARTH_CANVAS_FILE__ = CANVAS_FILE;

    updateDataset();
  }

  function boot() {
    if (state.booting || state.booted) {
      scheduleRender();
      return getReceipt();
    }

    state.booting = true;
    state.startedAt = nowIso();
    state.updatedAt = state.startedAt;
    state.postgameStatus = "SOUTH_BOOTING";
    state.firstFailedCoordinate = "SOUTH_BOOTING_GEAR_CYCLE";
    state.recommendedNextRenewalTarget = FILE;

    ensureCockpit();
    publishGlobals();
    ensureSession();
    reconcileFromSession();

    bootEarlyCheckpoints();

    if (root.addEventListener) {
      root.addEventListener("hearth:canvas-phase", handleCanvasPhase, { passive: true });
    }

    root.setTimeout(() => {
      startCanvas();
      scheduleRender();
    }, 120);

    root.setTimeout(() => {
      maybeSubmitInspectAndCompletion();
      scheduleRender();
    }, 1200);

    state.booting = false;
    state.booted = true;
    state.postgameStatus = "SOUTH_BOOTED_GEAR_CYCLE_ACTIVE";
    state.latestEvent = "SOUTH_ROUTE_CONDUCTOR_BOOTED";

    recordLocal("SOUTH_ROUTE_CONDUCTOR_BOOTED", {
      northPresent: state.northPresent,
      sessionPresent: state.sessionPresent,
      canvasPresent: state.canvasPresent
    });

    scheduleRender();
    return getReceipt();
  }

  function dispose(reason = "manual-dispose") {
    state.disposed = true;

    if (root.removeEventListener) {
      root.removeEventListener("hearth:canvas-phase", handleCanvasPhase);
    }

    recordLocal("SOUTH_ROUTE_CONDUCTOR_DISPOSED", { reason });
    publishGlobals();
    return getReceipt();
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "south-route-conductor-visible-completion",

    boot,
    start: boot,
    init: boot,
    run: boot,
    dispose,

    ensureSession,
    reconcileFromSession,
    submitToSession,
    startCanvas,
    maybeSubmitInspectAndCompletion,
    setInspectMode,
    scheduleRender,
    render,

    getReceipt,
    getReceiptText,
    copyDiagnostic,

    supportsNewsFibonacciAlignment: true,
    supportsGearCycleMode: true,
    supportsOneActiveGearAtATime: true,
    supportsActiveGearProgressReset: true,
    supportsCurrentGearOnlyVisibleProgress: true,
    supportsSouthVisibleCompletion: true,
    supportsCopyDiagnostic: true,
    supportsInspectMode: true,
    supportsReceiptToggle: true,

    ownsSouth: true,
    ownsVisibleComposition: true,
    ownsRouteConductorRuntime: true,
    ownsNorthTruth: false,
    ownsEastAdmissionTruth: false,
    ownsWestGapTruth: false,
    ownsCanvasDrawing: false,
    ownsAtlasPainting: false,
    ownsSourceTruth: false,
    ownsFinalVisualPassClaim: false,

    northFile: NORTH_FILE,
    eastBranchFile: EAST_BRANCH_FILE,
    westBranchFile: WEST_BRANCH_FILE,
    southBranchFile: SOUTH_BRANCH_FILE,
    canvasFile: CANVAS_FILE,

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
      doc.addEventListener("DOMContentLoaded", () => boot(), { once: true });
    } else {
      boot();
    }
  } else {
    boot();
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

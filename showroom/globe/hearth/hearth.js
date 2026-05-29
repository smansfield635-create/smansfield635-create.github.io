// /showroom/globe/hearth/hearth.js
// HEARTH_ROUTE_CONSUMER_ACTIVE_MATCH_QUEUE_DRAIN_TNT_v6
// Full-file replacement.
// Coherence-side semiconductor only.
// Purpose:
// - Preserve the successful Runtime Table checkpoint-governor consumer from v4/v5.
// - Preserve chronological NEWS + Fibonacci checkpoint sequencing.
// - Preserve one-active-checkpoint-at-a-time behavior governed by North Runtime Table.
// - Preserve Copy diagnostic / Show receipt / Inspect planet / Show diagnostic.
// - Preserve visible-content proof before F21.
// - Preserve F13N inspect-mode gate before F21.
// - Correct v5 stall by preserving queued checkpoint events locally and replaying only the event that matches North's current active checkpoint.
// Does not own:
// - first-paint survival from /showroom/globe/hearth/index.js
// - canvas pixel drawing
// - atlas generation
// - texture generation
// - Runtime Table implementation
// - source-stack truth
// - HTML structure
// - climate-route rendering
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_ROUTE_CONSUMER_ACTIVE_MATCH_QUEUE_DRAIN_TNT_v6";
  const RECEIPT = "HEARTH_ROUTE_CONSUMER_ACTIVE_MATCH_QUEUE_DRAIN_RECEIPT_v6";
  const PREVIOUS_CONTRACT = "HEARTH_ROUTE_RUNTIME_TABLE_CHECKPOINT_GOVERNOR_CONSUMER_POSTGAME_COORDINATE_FIX_TNT_v5";
  const BASELINE_CONTRACT = "HEARTH_ROUTE_CONSUMER_ACTIVE_MATCH_QUEUE_DRAIN_PRECODE_FINAL_DRAFT_v6";
  const VERSION = "2026-05-29.hearth-route-consumer-active-match-queue-drain-v6";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const ROUTE = "/showroom/globe/hearth/";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const COHERENCE_FILE = "/showroom/globe/hearth/hearth.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const RUNTIME_TABLE_FILE = "/assets/lab/runtime-table.js";
  const RETIRED_CLIMATE_FILE = "/showroom/globe/hearth/hearth.climate.route.js";

  const MOUNT_ID = "hearthCanvasMount";
  const COCKPIT_ID = "hearthLoadCockpit";
  const STATUS_ID = "hearth-route-status";

  const SOURCE_STACK_HELD = Object.freeze([
    "/assets/hearth/hearth.tectonics.js",
    "/assets/hearth/hearth.elevation.js",
    "/assets/hearth/hearth.composition.js",
    "/assets/hearth/hearth.hydrology.js",
    "/assets/hearth/hearth.materials.js",
    "/assets/hearth/hearth.hex.four-pair.authority.js",
    "/assets/hearth/hearth.hex.surface.js",
    RUNTIME_TABLE_FILE
  ]);

  const FIBONACCI_CHECKPOINTS = Object.freeze([
    { id: "F1A_HTML_SHELL_RENDERED", event: "HTML_SHELL_RENDERED", rank: 1, fibonacci: "F1A", lane: "shell", progress: 6, label: "HTML shell rendered" },
    { id: "F1B_LOAD_LEDGER_INITIALIZED", event: "LOAD_LEDGER_INITIALIZED", rank: 2, fibonacci: "F1B", lane: "ledger", progress: 12, label: "Load ledger initialized" },
    { id: "F2_FIRST_PAINT_COCKPIT_VISIBLE", event: "FIRST_PAINT_COCKPIT_VISIBLE", rank: 3, fibonacci: "F2", lane: "staticCockpit", progress: 22, label: "First-paint cockpit visible" },
    { id: "F3_SCRIPT_ORDER_COMPLETE", event: "SCRIPT_ORDER_COMPLETE", rank: 4, fibonacci: "F3", lane: "scriptOrder", progress: 36, label: "Script order complete" },
    { id: "F5_AUTHORITY_AVAILABILITY_READY", event: "AUTHORITY_AVAILABILITY_READY", rank: 5, fibonacci: "F5", lane: "authorityAvailability", progress: 55, label: "Authority availability ready" },
    { id: "F8_CONDUCTOR_HYDRATED", event: "CONDUCTOR_HYDRATED", rank: 6, fibonacci: "F8", lane: "conductorHydration", progress: 72, label: "Conductor hydrated" },
    { id: "F13A_CANVAS_COOPERATIVE_BOOT_STARTED", event: "CANVAS_COOPERATIVE_BOOT_STARTED", rank: 7, fibonacci: "F13A", lane: "canvasAndDiagnostic", progress: 78, label: "Canvas cooperative boot started" },
    { id: "F13B_CANVAS_MOUNT_CREATED", event: "CANVAS_MOUNT_CREATED", rank: 8, fibonacci: "F13B", lane: "canvasAndDiagnostic", progress: 81, label: "Canvas mount created" },
    { id: "F13C_CANVAS_CONTEXT_READY", event: "CANVAS_CONTEXT_READY", rank: 9, fibonacci: "F13C", lane: "canvasAndDiagnostic", progress: 84, label: "Canvas context ready" },
    { id: "F13D_DRAG_INSPECTION_BOUND", event: "DRAG_INSPECTION_BOUND", rank: 10, fibonacci: "F13D", lane: "canvasAndDiagnostic", progress: 86, label: "Drag inspection bound" },
    { id: "F13E_ATLAS_BUILD_STARTED", event: "ATLAS_BUILD_STARTED", rank: 11, fibonacci: "F13E", lane: "canvasAndDiagnostic", progress: 88, label: "Atlas build started" },
    { id: "F13F_ATLAS_BUILD_COMPLETE", event: "ATLAS_BUILD_COMPLETE", rank: 12, fibonacci: "F13F", lane: "canvasAndDiagnostic", progress: 91, label: "Atlas build complete" },
    { id: "F13G_TEXTURE_COMPOSE_STARTED", event: "TEXTURE_COMPOSE_STARTED", rank: 13, fibonacci: "F13G", lane: "canvasAndDiagnostic", progress: 93, label: "Texture compose started" },
    { id: "F13H_TEXTURE_COMPOSE_COMPLETE", event: "TEXTURE_COMPOSE_COMPLETE", rank: 14, fibonacci: "F13H", lane: "canvasAndDiagnostic", progress: 96, label: "Texture compose complete" },
    { id: "F13I_FIRST_FRAME_REQUESTED", event: "FIRST_FRAME_REQUESTED", rank: 15, fibonacci: "F13I", lane: "canvasAndDiagnostic", progress: 97, label: "First frame requested" },
    { id: "F13J_FIRST_FRAME_DETECTED", event: "FIRST_FRAME_DETECTED", rank: 16, fibonacci: "F13J", lane: "canvasAndDiagnostic", progress: 98, label: "First frame detected" },
    { id: "F13K_CANVAS_READY", event: "CANVAS_READY", rank: 17, fibonacci: "F13K", lane: "canvasAndDiagnostic", progress: 98, label: "Canvas ready" },
    { id: "F13L_VISIBLE_CONTENT_PROOF_STARTED", event: "VISIBLE_CONTENT_PROOF_STARTED", rank: 18, fibonacci: "F13L", lane: "visiblePlanetProof", progress: 98, label: "Visible content proof started" },
    { id: "F13M_VISIBLE_CONTENT_PROOF_PASSED", event: "VISIBLE_CONTENT_PROOF_PASSED", rank: 19, fibonacci: "F13M", lane: "visiblePlanetProof", progress: 98, label: "Visible content proof passed" },
    { id: "F13N_INSPECT_MODE_READY", event: "INSPECT_MODE_READY", rank: 20, fibonacci: "F13N", lane: "inspectMode", progress: 98, label: "Inspect mode ready" },
    { id: "F21_COMPLETION_LATCHED", event: "COMPLETION_LATCHED", rank: 21, fibonacci: "F21", lane: "completionLatch", progress: 100, label: "Completion latched" }
  ]);

  const CHECKPOINT_EVENT_MAP = Object.freeze(
    FIBONACCI_CHECKPOINTS.reduce((map, checkpoint) => {
      map[checkpoint.event] = checkpoint;
      map[checkpoint.id] = checkpoint;
      return map;
    }, Object.create(null))
  );

  const PROGRESS_ONLY_EVENTS = Object.freeze([
    "ATLAS_BUILD_PROGRESS",
    "TEXTURE_COMPOSE_PROGRESS"
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: COHERENCE_FILE,
    route: ROUTE,
    role: "coherence-side-semiconductor",

    pairedSemiconductor: true,
    pairedWith: INDEX_FILE,
    indexJsStartsProcess: true,
    hearthJsFinishesProcess: true,
    systematicAndSynchronized: true,
    synchronizedLoading: true,

    checkpointGovernorPresent: false,
    checkpointSessionCreated: false,
    checkpointSessionConsumed: false,
    checkpointSessionReceiptAvailable: false,
    checkpointGovernorFallbackUsed: false,
    checkpointSessionError: "",
    checkpointSession: null,

    chronologicalFibonacciAlignment: true,
    newsFibonacciAlignment: true,
    oneActiveCheckpointAtATime: true,
    futureEventsQueued: true,
    completedEventsArchived: true,
    regressiveEventsBlocked: true,
    blockedProgressCap: 98,
    readyTextRequiresCompletionLatch: true,

    activeCheckpointId: "F1A_HTML_SHELL_RENDERED",
    activeCheckpointRank: 1,
    activeFibonacciStage: "F1A",
    highestCompletedCheckpointId: "",
    highestCompletedRank: 0,
    completedCheckpoints: [],
    queuedEventsCount: 0,
    archivedEventsCount: 0,
    blockedEventsCount: 0,
    admittedEventsCount: 0,
    regressionPrevented: 0,

    activeMatchQueueDrainActive: true,
    localQueuedCheckpointEvents: [],
    localQueuedEventsCount: 0,
    queueDrainInProgress: false,
    queueDrainPasses: 0,
    queueDrainReplayedCount: 0,
    queueDrainHeldCount: 0,
    queueDrainArchivedCount: 0,
    queueDrainBlockedCount: 0,
    queueDrainLastReason: "",
    queueDrainLastActiveCheckpointId: "",
    queueDrainLastReplayedCheckpointId: "",
    queueDrainLastAction: "",
    queueDrainGuardLimit: 24,
    stuckAtQueuedActiveCheckpoint: false,
    queuedActiveMatchReplayEnabled: true,
    northCheckpointAuthorityPreserved: true,
    runtimeTableMutation: false,
    canvasMutation: false,

    newsProtocolActive: true,
    northGateReady: false,
    eastGateReady: false,
    westGateReady: false,
    southGateReady: false,
    newsGatePassedBeforeF21: false,

    fibonacciSequenceActive: true,
    f13SubsequenceComplete: false,
    f13LastRequiredEvent: "",
    f21Allowed: false,
    f21AfterF13N: false,
    completionLatched: false,

    visibleContentProof: false,
    visibleContentProofStarted: false,
    visibleContentProofMethod: "",
    visibleContentProofError: "",
    visibleContentSampleCount: 0,
    visibleContentVarianceScore: 0,
    visibleContentClassCount: 0,
    visibleContentClasses: [],
    visibleContentLandSampleCount: 0,
    visibleContentWaterSampleCount: 0,
    visibleContentOtherSampleCount: 0,
    carrierOnlyDetected: true,
    explicitContentReceiptProof: false,
    renderedAfterTexture: false,

    visiblePlanetAvailable: false,
    planetCanvasPresent: false,
    planetCanvasNonZeroSize: false,
    planetFramePainted: false,
    nonblankPlanetVisible: false,
    planetNotObstructed: false,

    inspectModeAvailable: false,
    inspectPlanetControlAvailable: false,
    diagnosticCanLeavePlanetFrame: false,
    diagnosticDockHiddenForInspection: false,
    showDiagnosticTabVisible: false,
    showDiagnosticTabVisibleWhenHidden: false,
    diagnosticDockRestorable: false,
    copyDiagnosticPreserved: false,
    receiptToggleReady: false,
    buttonsReachable: false,
    receiptOverlayIndependent: true,

    canvasReady: false,
    canvasCarrierMounted: false,
    canvasCarrierRequested: false,
    canvasCarrierHandoffOk: false,
    canvasCarrierHandoffError: "",
    canvasCarrierMethod: "",
    cooperativeBootAvailable: false,
    cooperativeBootUsed: false,
    syncBootFallbackUsed: false,
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
    canvasLaneClosed: false,
    postCanvasPhaseBouncePrevented: true,
    ignoredDuplicateCanvasEvents: 0,

    atlasBuildStarted: false,
    atlasBuildProgress: 0,
    atlasBuildComplete: false,
    textureComposeStarted: false,
    textureComposeProgress: 0,
    textureComposeComplete: false,
    firstFrameRequested: false,
    firstFrameDetected: false,
    imageRendered: false,
    dragInspectionBound: false,

    runtimeTablePresent: false,
    runtimeTableMode: "RUNTIME_TABLE_PENDING",
    runtimeTablePlanAttempted: false,
    runtimeTablePlanCreated: false,
    runtimeTablePlanError: "",
    sourceAuthorityHeld: true,

    currentStage: "F1A",
    highestStage: "F1A",
    visibleLoadingActive: true,
    diagnosticCockpitReady: false,
    cockpitMode: "loading-cockpit",
    dockVisible: true,
    fullCockpitExpanded: false,
    planetInspectModeActive: false,

    partialReceiptAvailable: true,
    finalReceiptAvailable: false,
    copyDiagnosticArmed: false,

    postgameStatus: "CHECKPOINT_GOVERNOR_CONSUMER_BOOTING",
    firstFailedCoordinate: "WAITING_HTML_SHELL_RENDERED",
    recommendedNextRenewalTarget: COHERENCE_FILE,
    latestVisibleEvent: "BOOTING",
    mainDisplayProgress: 0,
    mainProgressCap: 98,
    heartbeatElapsedMs: 0,

    phaseEvents: [],
    progressOnlyEvents: [],
    archivedLateEvents: [],
    localEvents: [],
    errors: [],
    phaseSignatures: Object.create(null),

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    startedAt: "",
    startedAtMs: 0,
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
  let canvasBootRequested = false;
  let heartbeatTimer = 0;
  let reconcileTimer = 0;
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

  function bool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === "true") return true;
    if (value === "false") return false;
    return fallback;
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

  function formatElapsed(ms) {
    const total = Math.max(0, Math.floor(Number(ms || 0) / 1000));
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function getCheckpointByEvent(event) {
    return CHECKPOINT_EVENT_MAP[event] || null;
  }

  function getCheckpointById(id) {
    return CHECKPOINT_EVENT_MAP[id] || null;
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
        const receipt = api.getReceipt("hearth-route-v6-active-match-queue-drain");
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

  function makeLane(key, label, fibonacci, progress) {
    return {
      key,
      label,
      fibonacci,
      status: "PENDING",
      message: `${label} pending.`,
      progress,
      latestEvent: "PENDING",
      updatedAt: nowIso()
    };
  }

  function ensureLedger() {
    const existing = root.HEARTH_LOAD_LEDGER;
    const ledger = existing && isObject(existing) ? existing : {};
    const led = isObject(ledger.state) ? ledger.state : ledger;

    ledger.state = led;
    led.contract = led.contract || "HEARTH_PAIRED_SEMICONDUCTOR_SHARED_LOAD_LEDGER_v1";
    led.ownerModel = "paired-semiconductor";
    led.constraintSemiconductor = INDEX_FILE;
    led.coherenceSemiconductor = COHERENCE_FILE;
    led.route = ROUTE;
    led.newsProtocolActive = true;
    led.fibonacciSequenceActive = true;
    led.chronologicalFibonacciAlignment = true;
    led.synchronizedLoading = true;
    led.indexOwnsFinalCompletion = false;
    led.visualPassClaimed = false;
    led.startedAt = led.startedAt || nowIso();
    led.updatedAt = nowIso();
    led.currentStage = led.currentStage || "F1A";
    led.highestStage = led.highestStage || "F1A";
    led.completionLatched = bool(led.completionLatched, false);
    led.events = Array.isArray(led.events) ? led.events : [];
    led.errors = Array.isArray(led.errors) ? led.errors : [];
    led.scripts = isObject(led.scripts) ? led.scripts : {};
    led.lanes = isObject(led.lanes) ? led.lanes : {};

    FIBONACCI_CHECKPOINTS.forEach((checkpoint) => {
      if (!led.lanes[checkpoint.lane]) {
        led.lanes[checkpoint.lane] = makeLane(
          checkpoint.lane,
          checkpoint.label,
          checkpoint.fibonacci,
          checkpoint.progress
        );
      }
    });

    ledger.push = isFunction(ledger.push) ? ledger.push : function push(event = {}) {
      const evt = {
        id: event.id || event.event || "LEDGER_EVENT",
        stage: event.stage || led.currentStage || state.currentStage,
        lane: event.lane || "",
        status: event.status || "",
        owner: event.owner || "hearth.js",
        file: event.file || COHERENCE_FILE,
        message: event.message || "",
        detail: clonePlain(event.detail || {}),
        progress: event.progress ?? "",
        timestamp: nowIso()
      };

      led.events.push(evt);
      if (led.events.length > 420) led.events.splice(0, led.events.length - 420);
      led.updatedAt = evt.timestamp;
      scheduleRender();
      return evt;
    };

    ledger.setLane = isFunction(ledger.setLane) ? ledger.setLane : function setLane(key, next = {}) {
      const lane = led.lanes[key] || makeLane(key, key, next.stage || "", Number(next.progress || 0));
      lane.status = next.status || lane.status;
      lane.message = next.message || lane.message;
      lane.progress = Math.max(Number(lane.progress || 0), Number(next.progress ?? lane.progress ?? 0));
      lane.latestEvent = next.event || next.latestEvent || lane.latestEvent;
      lane.fibonacci = next.stage || lane.fibonacci;
      lane.updatedAt = nowIso();
      led.lanes[key] = lane;

      ledger.push({
        id: lane.latestEvent,
        stage: lane.fibonacci,
        lane: key,
        status: lane.status,
        message: lane.message,
        progress: lane.progress,
        detail: next.detail || {}
      });

      return lane;
    };

    ledger.getReceipt = isFunction(ledger.getReceipt) ? ledger.getReceipt : function getReceiptFromLedger() {
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
    return ledger;
  }

  function ledgerPush(event = {}) {
    const ledger = refs.ledger || ensureLedger();
    return ledger.push({
      owner: "hearth.js",
      file: COHERENCE_FILE,
      ...event
    });
  }

  function setLane(key, next = {}) {
    const ledger = refs.ledger || ensureLedger();
    return ledger.setLane(key, {
      owner: "hearth.js",
      file: COHERENCE_FILE,
      ...next
    });
  }

  function recordError(code, message, detail = {}) {
    const item = {
      code,
      message: String(message || ""),
      detail: clonePlain(detail),
      at: nowIso()
    };

    state.errors.push(item);
    if (state.errors.length > 80) state.errors.splice(0, state.errors.length - 80);

    ledgerPush({
      id: "ERROR",
      stage: state.currentStage,
      lane: "errors",
      status: "FAILED",
      message: `${code}: ${message}`,
      detail: item
    });

    return item;
  }

  function emitLocal(event, detail = {}) {
    const item = {
      at: nowIso(),
      event,
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    if (state.localEvents.length > 320) state.localEvents.splice(0, state.localEvents.length - 320);
    state.updatedAt = item.at;
    return item;
  }

  function archiveLateEvent(event = {}) {
    const item = {
      at: nowIso(),
      event: event.event || event.id || "ARCHIVED_EVENT",
      stage: event.stage || state.currentStage,
      lane: event.lane || "",
      reason: event.reason || "archived",
      message: event.message || "",
      detail: clonePlain(event.detail || {})
    };

    state.archivedLateEvents.push(item);
    if (state.archivedLateEvents.length > 220) state.archivedLateEvents.splice(0, state.archivedLateEvents.length - 220);
    return item;
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
      const parent = doc.getElementById("hearth-main") || doc.body || doc.documentElement;
      parent.appendChild(mount);
    }

    mount.id = MOUNT_ID;
    mount.dataset.hearthCanvasMount = "true";
    mount.dataset.hearthCoherenceSemiconductor = CONTRACT;
    mount.dataset.hearthCoherenceReceipt = RECEIPT;
    mount.dataset.hearthPairedSemiconductor = "true";
    mount.dataset.hearthConstraintSemiconductor = INDEX_FILE;
    mount.dataset.hearthCoherenceSemiconductorFile = COHERENCE_FILE;
    mount.dataset.hearthRuntimeTableCheckpointGovernorConsumer = "true";
    mount.dataset.hearthActiveMatchQueueDrain = "true";
    mount.dataset.generatedImage = "false";
    mount.dataset.graphicBox = "false";
    mount.dataset.webgl = "false";
    mount.dataset.visualPassClaimed = "false";
    mount.style.position = mount.style.position || "relative";
    mount.style.overflow = "hidden";
    mount.style.touchAction = "none";

    refs.mount = mount;
    return mount;
  }

  function ensureStyle() {
    if (!doc || doc.getElementById("hearth-route-v6-active-match-queue-drain-style")) return;

    const style = doc.createElement("style");
    style.id = "hearth-route-v6-active-match-queue-drain-style";
    style.textContent = `
      .hearth-ledger-cockpit{transition:max-height .22s ease,opacity .18s ease,visibility .18s ease,transform .22s ease;}
      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"]{inset:auto 10px 10px 10px!important;min-height:132px!important;max-height:186px!important;overflow:hidden!important;}
      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-head{padding:10px 14px 7px!important;}
      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-kicker{font-size:.58rem!important;}
      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-title{font-size:1rem!important;line-height:1.02!important;}
      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-meta{display:none!important;}
      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-latest{font-size:.63rem!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;}
      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-progress{padding:7px 10px!important;}
      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-scroll{display:none!important;}
      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-actions{padding:7px 10px 10px!important;border-bottom:0!important;}
      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-button{min-height:28px!important;padding:6px 9px!important;font-size:.56rem!important;}
      .hearth-ledger-cockpit[data-cockpit-mode="expanded-cockpit"]{inset:10px!important;max-height:calc(100% - 20px)!important;min-height:170px!important;overflow:hidden!important;}
      .hearth-ledger-cockpit[data-cockpit-mode="planet-inspect"]{opacity:0!important;visibility:hidden!important;pointer-events:none!important;transform:translateY(26px) scale(.985)!important;max-height:0!important;min-height:0!important;overflow:hidden!important;}
      [data-hearth-coherence-show-diagnostic-tab]{position:fixed;right:max(12px,env(safe-area-inset-right));bottom:max(72px,calc(env(safe-area-inset-bottom) + 72px));z-index:10000;display:none;align-items:center;justify-content:center;min-height:38px;padding:10px 14px;border-radius:999px;border:1px solid rgba(231,188,105,.66);color:#06101e;background:linear-gradient(135deg,#ffe8a3,#e7bc69);box-shadow:0 16px 44px rgba(0,0,0,.40), inset 0 1px 0 rgba(255,255,255,.28);font:950 .70rem/1 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;}
      html[data-hearth-planet-inspect="true"] [data-hearth-coherence-show-diagnostic-tab]{display:inline-flex;}
      html[data-hearth-planet-inspect="true"] #hearthCanvasMount,html[data-hearth-planet-inspect="true"] [data-hearth-canvas-mount="true"]{cursor:grab;}
      @media (max-width:760px){.hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"]{inset:auto 8px 8px 8px!important;max-height:190px!important;}.hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-button{flex:1 1 auto!important;min-width:28%!important;}[data-hearth-coherence-show-diagnostic-tab]{right:max(10px,env(safe-area-inset-right));bottom:max(68px,calc(env(safe-area-inset-bottom) + 68px));min-height:34px;padding:9px 12px;font-size:.64rem;}}
    `;

    doc.head.appendChild(style);
  }

  function createFallbackCockpit() {
    if (!doc) return null;

    const mount = refs.mount || ensureMount();
    if (!mount) return null;

    const cockpit = doc.createElement("aside");
    cockpit.id = COCKPIT_ID;
    cockpit.className = "hearth-ledger-cockpit";
    cockpit.dataset.hearthLoadCockpit = "true";
    cockpit.dataset.hearthFirstPaintCockpit = "fallback-created-by-v6";
    cockpit.dataset.cockpitMode = "loading-cockpit";
    cockpit.setAttribute("aria-live", "polite");

    cockpit.innerHTML = `
      <div class="hearth-ledger-head">
        <div class="hearth-ledger-kicker">Hearth · Monotonic Load Ledger</div>
        <h2 class="hearth-ledger-title">FORMING HEARTH RUNTIME TABLE</h2>
        <div class="hearth-ledger-meta" data-hearth-stage-label>F1A · HTML shell rendered</div>
        <div class="hearth-ledger-meta" data-hearth-heartbeat-text>heartbeat=active · elapsed=00:00</div>
        <div class="hearth-ledger-latest" data-hearth-latest-event>latest=BOOTING</div>
      </div>

      <div class="hearth-ledger-progress" data-hearth-index-progress-strip="true">
        <div class="hearth-ledger-track">
          <span class="hearth-ledger-fill" data-hearth-main-progress-fill style="width:0%"></span>
        </div>
        <div class="hearth-ledger-percent" data-hearth-main-progress-percent>0%</div>
      </div>

      <div class="hearth-ledger-actions">
        <button class="hearth-ledger-button primary" type="button" data-hearth-copy-diagnostic>Copy diagnostic</button>
        <button class="hearth-ledger-button" type="button" data-hearth-toggle-receipt>Show receipt</button>
        <button class="hearth-ledger-button" type="button" data-hearth-collapse-cockpit>Collapse cockpit</button>
        <button class="hearth-ledger-button" type="button" data-hearth-inspect-planet>Inspect planet</button>
      </div>

      <div class="hearth-ledger-scroll">
        <div class="hearth-ledger-lanes" data-hearth-lane-list></div>
        <div class="hearth-ledger-receipt" data-hearth-receipt-box data-visible="false">
          <pre data-hearth-receipt-text></pre>
        </div>
      </div>
    `;

    mount.appendChild(cockpit);
    return cockpit;
  }

  function ensureShowTab() {
    if (!doc) return null;

    let tab =
      doc.querySelector("[data-hearth-coherence-show-diagnostic-tab]") ||
      doc.querySelector("[data-hearth-index-show-diagnostic-tab]");

    if (!tab) {
      tab = doc.createElement("button");
      tab.type = "button";
      tab.dataset.hearthCoherenceShowDiagnosticTab = "true";
      tab.textContent = "Show diagnostic";
      tab.setAttribute("aria-label", "Show Hearth diagnostic");
      doc.body.appendChild(tab);
    }

    tab.dataset.hearthCoherenceShowDiagnosticTab = "true";
    tab.onclick = () => setCockpitMode("diagnostic-dock");

    refs.showTab = tab;
    state.diagnosticDockRestorable = true;
    state.showDiagnosticTabVisibleWhenHidden = true;
    return tab;
  }

  function hydrateCockpit() {
    if (!doc) return null;

    ensureStyle();
    ensureShowTab();

    const mount = refs.mount || ensureMount();

    let cockpit =
      doc.getElementById(COCKPIT_ID) ||
      doc.querySelector("[data-hearth-load-cockpit='true']") ||
      doc.querySelector("[data-hearth-first-paint-cockpit='true']");

    if (!cockpit) cockpit = createFallbackCockpit();
    if (!cockpit) return null;

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

    cockpit.dataset.hearthPairedSemiconductor = "true";
    cockpit.dataset.hearthCoherenceSemiconductor = CONTRACT;
    cockpit.dataset.hearthCoherenceReceipt = RECEIPT;
    cockpit.dataset.hearthConstraintSemiconductor = INDEX_FILE;
    cockpit.dataset.hearthRuntimeTableCheckpointGovernorConsumer = "true";
    cockpit.dataset.hearthActiveMatchQueueDrain = "true";
    cockpit.dataset.hearthSynchronizedLoading = "true";
    cockpit.dataset.cockpitMode = cockpit.dataset.cockpitMode || "loading-cockpit";

    if (refs.copyButton) refs.copyButton.onclick = copyDiagnostic;
    if (refs.receiptToggle) refs.receiptToggle.onclick = toggleReceipt;
    if (refs.inspectButton) refs.inspectButton.onclick = () => setCockpitMode(state.planetInspectModeActive ? "diagnostic-dock" : "planet-inspect");
    if (refs.expandButton) refs.expandButton.onclick = toggleExpanded;

    state.copyDiagnosticArmed = Boolean(refs.copyButton);
    state.copyDiagnosticPreserved = Boolean(refs.copyButton);
    state.receiptToggleReady = Boolean(refs.receiptToggle);
    state.inspectModeAvailable = Boolean(refs.inspectButton);
    state.inspectPlanetControlAvailable = Boolean(refs.inspectButton);
    state.diagnosticDockRestorable = Boolean(refs.showTab);
    state.showDiagnosticTabVisibleWhenHidden = Boolean(refs.showTab);
    state.buttonsReachable = Boolean(refs.copyButton && refs.receiptToggle && refs.inspectButton && refs.expandButton);
    state.diagnosticCanLeavePlanetFrame = Boolean(
      state.inspectModeAvailable &&
      state.inspectPlanetControlAvailable &&
      state.diagnosticDockRestorable &&
      state.showDiagnosticTabVisibleWhenHidden &&
      state.copyDiagnosticPreserved &&
      state.receiptToggleReady &&
      state.buttonsReachable
    );

    if (mount) {
      mount.querySelectorAll("[data-hearth-mount-fallback], .mount-fallback").forEach((fallback) => {
        fallback.hidden = true;
        fallback.style.display = "none";
        fallback.dataset.hiddenByV6ActiveMatchQueueDrain = CONTRACT;
      });
    }

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

  function toggleExpanded() {
    if (state.cockpitMode === "expanded-cockpit") {
      setCockpitMode("diagnostic-dock");
    } else {
      setCockpitMode("expanded-cockpit");
    }
  }

  function setCockpitMode(mode) {
    if (!refs.cockpit) return;

    if (mode === "planet-inspect") {
      state.cockpitMode = "planet-inspect";
      state.planetInspectModeActive = true;
      state.diagnosticDockHiddenForInspection = true;
      state.showDiagnosticTabVisible = true;
      state.planetNotObstructed = true;
      state.dockVisible = false;
      state.fullCockpitExpanded = false;
    } else if (mode === "expanded-cockpit") {
      state.cockpitMode = "expanded-cockpit";
      state.planetInspectModeActive = false;
      state.diagnosticDockHiddenForInspection = false;
      state.showDiagnosticTabVisible = false;
      state.planetNotObstructed = false;
      state.dockVisible = true;
      state.fullCockpitExpanded = true;
    } else {
      state.cockpitMode = state.completionLatched || state.canvasReady ? "diagnostic-dock" : "loading-cockpit";
      state.planetInspectModeActive = false;
      state.diagnosticDockHiddenForInspection = false;
      state.showDiagnosticTabVisible = false;
      state.planetNotObstructed = false;
      state.dockVisible = true;
      state.fullCockpitExpanded = false;
    }

    refs.cockpit.dataset.cockpitMode = state.cockpitMode;
    refs.cockpit.dataset.hearthPlanetInspect = String(state.planetInspectModeActive);

    if (refs.mount) refs.mount.dataset.hearthPlanetInspect = String(state.planetInspectModeActive);

    if (doc && doc.documentElement) {
      doc.documentElement.dataset.hearthPlanetInspect = String(state.planetInspectModeActive);
      doc.documentElement.dataset.hearthDiagnosticDockHiddenForInspection = String(state.diagnosticDockHiddenForInspection);
    }

    if (refs.showTab) {
      refs.showTab.hidden = !state.planetInspectModeActive;
      refs.showTab.dataset.visible = String(state.planetInspectModeActive);
    }

    if (refs.inspectButton) refs.inspectButton.textContent = state.planetInspectModeActive ? "Show diagnostic" : "Inspect planet";
    if (refs.expandButton) refs.expandButton.textContent = state.cockpitMode === "expanded-cockpit" ? "Collapse cockpit" : "Collapse cockpit";

    evaluateInspectGate();
    scheduleRender();
    publishGlobals();
  }

  function createFallbackCheckpointSession() {
    const sequence = FIBONACCI_CHECKPOINTS.map((checkpoint) => ({
      ...checkpoint,
      complete: false,
      status: "PENDING"
    }));

    let activeIndex = 0;
    const admittedEvents = [];
    const archivedEvents = [];
    const blockedEvents = [];
    const queuedEvents = [];
    const completed = [];
    let completionLatched = false;

    function active() {
      return sequence[Math.max(0, Math.min(sequence.length - 1, activeIndex))];
    }

    function getReceipt() {
      const current = active();
      const highest = completed.length ? getCheckpointById(completed[completed.length - 1]) : null;

      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        checkpointSessionContract: "HEARTH_LOCAL_FALLBACK_CHRONOLOGICAL_CHECKPOINT_SESSION_v1",
        checkpointSessionReceipt: "HEARTH_LOCAL_FALLBACK_CHRONOLOGICAL_CHECKPOINT_SESSION_RECEIPT_v1",
        checkpointGovernorActive: true,
        checkpointGovernorFallbackUsed: true,
        chronologicalFibonacciAlignment: true,
        newsFibonacciAlignment: true,
        oneActiveCheckpointAtATime: true,
        activeCheckpointId: current ? current.id : "",
        activeCheckpointRank: current ? current.rank : 0,
        activeFibonacciStage: current ? current.fibonacci : "",
        highestCompletedCheckpointId: highest ? highest.id : "",
        highestCompletedRank: highest ? highest.rank : 0,
        completedCheckpoints: completed.slice(),
        queuedEventsCount: queuedEvents.length,
        archivedEventsCount: archivedEvents.length,
        blockedEventsCount: blockedEvents.length,
        admittedEventsCount: admittedEvents.length,
        regressionPrevented: blockedEvents.length,
        completionLatched,
        sequence: clonePlain(sequence),
        admittedEvents: clonePlain(admittedEvents),
        archivedEvents: clonePlain(archivedEvents),
        blockedEvents: clonePlain(blockedEvents),
        queuedEvents: clonePlain(queuedEvents),
        f13Events: completed
          .map((id) => getCheckpointById(id))
          .filter((checkpoint) => checkpoint && checkpoint.fibonacci.indexOf("F13") === 0)
          .map((checkpoint) => checkpoint.event),
        f13SubsequenceComplete: completed.includes("F13N_INSPECT_MODE_READY"),
        f13LastRequiredEvent: completed
          .map((id) => getCheckpointById(id))
          .filter((checkpoint) => checkpoint && checkpoint.fibonacci.indexOf("F13") === 0)
          .map((checkpoint) => checkpoint.event)
          .pop() || "",
        f21Allowed: completed.includes("F13N_INSPECT_MODE_READY") && state.newsGatePassedBeforeF21,
        firstFailedCoordinate: completionLatched ? "NONE_NEWS_FIBONACCI_F21_LATCHED" : state.firstFailedCoordinate,
        recommendedNextRenewalTarget: completionLatched ? "read-postgame-canvas-or-triple-g-receipt" : state.recommendedNextRenewalTarget,
        updatedAt: nowIso()
      };
    }

    function submitEvent(event = {}) {
      const eventName = event.event || event.id || event.phase || "";
      const checkpoint = getCheckpointByEvent(eventName);
      const current = active();

      if (!checkpoint || !current) {
        archivedEvents.push({
          event: clonePlain(event),
          classification: { action: "ARCHIVE", reason: "unknown-checkpoint-event" },
          at: nowIso()
        });
        return { action: "ARCHIVE", reason: "unknown-checkpoint-event" };
      }

      if (completionLatched && checkpoint.id !== "F21_COMPLETION_LATCHED") {
        archivedEvents.push({
          event: clonePlain(event),
          classification: { action: "ARCHIVE", checkpointId: checkpoint.id, reason: "post-f21-event-archived" },
          at: nowIso()
        });
        return { action: "ARCHIVE", checkpointId: checkpoint.id, reason: "post-f21-event-archived" };
      }

      if (checkpoint.rank > current.rank) {
        queuedEvents.push({
          event: clonePlain(event),
          classification: { action: "QUEUE", checkpointId: checkpoint.id, reason: "future-event-queued-until-prior-checkpoint-completes" },
          at: nowIso()
        });
        return { action: "QUEUE", checkpointId: checkpoint.id, reason: "future-event-queued-until-prior-checkpoint-completes" };
      }

      if (checkpoint.rank < current.rank) {
        archivedEvents.push({
          event: clonePlain(event),
          classification: { action: "ARCHIVE", checkpointId: checkpoint.id, reason: "duplicate-or-late-completed-event-archived" },
          at: nowIso()
        });
        return { action: "ARCHIVE", checkpointId: checkpoint.id, reason: "duplicate-or-late-completed-event-archived" };
      }

      if (checkpoint.id === "F21_COMPLETION_LATCHED" && !state.newsGatePassedBeforeF21) {
        blockedEvents.push({
          event: clonePlain(event),
          classification: { action: "BLOCK", checkpointId: checkpoint.id, reason: "f21-blocked-until-news-gates-pass" },
          at: nowIso()
        });
        return { action: "BLOCK", checkpointId: checkpoint.id, reason: "f21-blocked-until-news-gates-pass" };
      }

      admittedEvents.push({
        event: clonePlain(event),
        classification: { action: "ADMIT", checkpointId: checkpoint.id, reason: "event-matches-active-checkpoint" },
        at: nowIso()
      });

      checkpoint.complete = true;
      checkpoint.status = "COMPLETE";

      if (!completed.includes(checkpoint.id)) completed.push(checkpoint.id);

      if (checkpoint.id === "F21_COMPLETION_LATCHED") {
        completionLatched = true;
      } else {
        activeIndex = Math.min(sequence.length - 1, activeIndex + 1);
        if (sequence[activeIndex]) sequence[activeIndex].status = "ACTIVE";
      }

      return {
        action: "ADMIT",
        checkpointId: checkpoint.id,
        activeCheckpoint: clonePlain(active()),
        completionLatched,
        visibleProgress: checkpoint.progress,
        progressCap: completionLatched ? 100 : 98,
        readyTextAllowed: completionLatched,
        firstFailedCoordinate: completionLatched ? "NONE_NEWS_FIBONACCI_F21_LATCHED" : state.firstFailedCoordinate,
        recommendedNextRenewalTarget: completionLatched ? "read-postgame-canvas-or-triple-g-receipt" : state.recommendedNextRenewalTarget
      };
    }

    if (sequence[0]) sequence[0].status = "ACTIVE";

    return {
      submitEvent,
      getReceipt,
      getReceiptText() {
        return JSON.stringify(getReceipt(), null, 2);
      }
    };
  }

  function createCheckpointSession() {
    const runtimeTable = getRuntimeTableApi();

    state.runtimeTablePresent = Boolean(runtimeTable);
    state.checkpointGovernorPresent = Boolean(runtimeTable && isFunction(runtimeTable.createHearthCheckpointSession));

    if (state.checkpointGovernorPresent) {
      try {
        state.checkpointSession = runtimeTable.createHearthCheckpointSession({
          planetId: "hearth",
          planetLabel: "Hearth",
          route: ROUTE,
          constraintSemiconductor: INDEX_FILE,
          coherenceSemiconductor: COHERENCE_FILE,
          canvasAuthority: CANVAS_FILE
        });

        state.checkpointSessionCreated = true;
        state.checkpointGovernorFallbackUsed = false;
        state.checkpointSessionError = "";
        return state.checkpointSession;
      } catch (error) {
        state.checkpointSessionError = error && error.message ? error.message : String(error);
        recordError("CHECKPOINT_SESSION_CREATE_FAILED", state.checkpointSessionError);
      }
    }

    state.checkpointSession = createFallbackCheckpointSession();
    state.checkpointSessionCreated = true;
    state.checkpointGovernorFallbackUsed = true;
    return state.checkpointSession;
  }

  function purgeCompletedLocalQueue() {
    if (!state.localQueuedCheckpointEvents.length) return;

    const before = state.localQueuedCheckpointEvents.length;

    state.localQueuedCheckpointEvents = state.localQueuedCheckpointEvents.filter((packet) => {
      return !state.completedCheckpoints.includes(packet.checkpointId);
    });

    state.localQueuedEventsCount = state.localQueuedCheckpointEvents.length;

    if (before !== state.localQueuedEventsCount) {
      emitLocal("LOCAL_QUEUE_PURGED_COMPLETED", {
        before,
        after: state.localQueuedEventsCount
      });
    }
  }

  function storeLocalQueuedCheckpoint(eventName, checkpoint, detail = {}, result = {}) {
    if (!checkpoint || state.completedCheckpoints.includes(checkpoint.id)) return null;

    const packet = {
      eventName,
      checkpointId: checkpoint.id,
      checkpointRank: checkpoint.rank,
      fibonacci: checkpoint.fibonacci,
      lane: checkpoint.lane,
      detail: clonePlain(detail || {}),
      snapshot: clonePlain(buildCheckpointSnapshot()),
      reason: result.reason || "future-event-queued-until-prior-checkpoint-completes",
      queuedAt: nowIso(),
      replayCount: 0,
      lastReplayAt: "",
      lastAction: "QUEUE"
    };

    const index = state.localQueuedCheckpointEvents.findIndex((item) => {
      return item.checkpointId === packet.checkpointId && item.eventName === packet.eventName;
    });

    if (index >= 0) {
      state.localQueuedCheckpointEvents[index] = {
        ...state.localQueuedCheckpointEvents[index],
        ...packet
      };
    } else {
      state.localQueuedCheckpointEvents.push(packet);
    }

    state.localQueuedCheckpointEvents.sort((a, b) => a.checkpointRank - b.checkpointRank);
    state.localQueuedEventsCount = state.localQueuedCheckpointEvents.length;
    state.stuckAtQueuedActiveCheckpoint = Boolean(
      state.localQueuedCheckpointEvents.some((item) => item.checkpointId === state.activeCheckpointId)
    );

    emitLocal("LOCAL_QUEUE_STORED", {
      checkpointId: packet.checkpointId,
      eventName: packet.eventName,
      localQueuedEventsCount: state.localQueuedEventsCount
    });

    return packet;
  }

  function removeLocalQueuedCheckpoint(checkpointId, eventName = "") {
    const before = state.localQueuedCheckpointEvents.length;

    state.localQueuedCheckpointEvents = state.localQueuedCheckpointEvents.filter((packet) => {
      if (eventName) return !(packet.checkpointId === checkpointId && packet.eventName === eventName);
      return packet.checkpointId !== checkpointId;
    });

    state.localQueuedEventsCount = state.localQueuedCheckpointEvents.length;
    return before !== state.localQueuedEventsCount;
  }

  function findActiveLocalQueuedPacket() {
    return state.localQueuedCheckpointEvents.find((packet) => {
      return packet.checkpointId === state.activeCheckpointId && !state.completedCheckpoints.includes(packet.checkpointId);
    }) || null;
  }

  function drainActiveMatchQueue(reason = "manual") {
    if (!state.activeMatchQueueDrainActive || !state.queuedActiveMatchReplayEnabled) return false;
    if (state.queueDrainInProgress || state.completionLatched) return false;

    if (!state.localQueuedCheckpointEvents.length) {
      state.localQueuedEventsCount = 0;
      state.stuckAtQueuedActiveCheckpoint = false;
      return false;
    }

    state.queueDrainInProgress = true;
    state.queueDrainPasses += 1;
    state.queueDrainLastReason = reason;

    let replayed = false;
    let guard = 0;

    try {
      purgeCompletedLocalQueue();

      while (!state.completionLatched && guard < state.queueDrainGuardLimit) {
        guard += 1;
        state.queueDrainLastActiveCheckpointId = state.activeCheckpointId;

        const packet = findActiveLocalQueuedPacket();

        if (!packet) {
          state.stuckAtQueuedActiveCheckpoint = false;
          break;
        }

        packet.replayCount += 1;
        packet.lastReplayAt = nowIso();

        state.queueDrainLastReplayedCheckpointId = packet.checkpointId;
        replayed = true;

        const result = submitCheckpoint(packet.eventName, {
          ...(packet.detail || {}),
          ...(packet.snapshot || {}),
          replayedFromLocalQueue: true,
          localQueueDrainReason: reason,
          localQueueReplayCount: packet.replayCount
        }, {
          fromQueueDrain: true,
          skipQueueStore: true,
          skipQueueDrain: true
        });

        const action = result && result.action ? result.action : "UNKNOWN";
        packet.lastAction = action;
        state.queueDrainLastAction = action;

        if (action === "ADMIT") {
          state.queueDrainReplayedCount += 1;
          removeLocalQueuedCheckpoint(packet.checkpointId, packet.eventName);
          purgeCompletedLocalQueue();
          continue;
        }

        if (action === "ARCHIVE") {
          state.queueDrainArchivedCount += 1;
          removeLocalQueuedCheckpoint(packet.checkpointId, packet.eventName);
          purgeCompletedLocalQueue();
          continue;
        }

        if (action === "QUEUE") {
          state.queueDrainHeldCount += 1;
          state.stuckAtQueuedActiveCheckpoint = true;
          break;
        }

        if (action === "BLOCK") {
          state.queueDrainBlockedCount += 1;
          state.stuckAtQueuedActiveCheckpoint = true;
          break;
        }

        state.queueDrainHeldCount += 1;
        state.stuckAtQueuedActiveCheckpoint = true;
        break;
      }
    } finally {
      state.queueDrainInProgress = false;
      state.localQueuedEventsCount = state.localQueuedCheckpointEvents.length;

      if (guard >= state.queueDrainGuardLimit) {
        state.stuckAtQueuedActiveCheckpoint = true;
        recordError("QUEUE_DRAIN_GUARD_LIMIT", `Queue drain guard limit reached at ${state.activeCheckpointId}.`, {
          reason,
          guard
        });
      }

      emitLocal("ACTIVE_MATCH_QUEUE_DRAIN", {
        reason,
        replayed,
        guard,
        activeCheckpointId: state.activeCheckpointId,
        localQueuedEventsCount: state.localQueuedEventsCount,
        lastAction: state.queueDrainLastAction
      });
    }

    publishGlobals();
    scheduleRender();
    return replayed;
  }

  function updateFromCheckpointReceipt(receipt, options = {}) {
    if (!receipt || !isObject(receipt)) return;

    const priorActive = state.activeCheckpointId;

    state.checkpointSessionConsumed = true;
    state.checkpointSessionReceiptAvailable = true;

    state.activeCheckpointId = receipt.activeCheckpointId || state.activeCheckpointId;
    state.activeCheckpointRank = Number(receipt.activeCheckpointRank || state.activeCheckpointRank || 0);
    state.activeFibonacciStage = receipt.activeFibonacciStage || state.activeFibonacciStage;
    state.highestCompletedCheckpointId = receipt.highestCompletedCheckpointId || state.highestCompletedCheckpointId;
    state.highestCompletedRank = Number(receipt.highestCompletedRank || state.highestCompletedRank || 0);
    state.completedCheckpoints = Array.isArray(receipt.completedCheckpoints) ? receipt.completedCheckpoints.slice() : state.completedCheckpoints;

    state.queuedEventsCount = Number(receipt.queuedEventsCount || 0);
    state.archivedEventsCount = Number(receipt.archivedEventsCount || 0);
    state.blockedEventsCount = Number(receipt.blockedEventsCount || 0);
    state.admittedEventsCount = Number(receipt.admittedEventsCount || 0);
    state.regressionPrevented = Number(receipt.regressionPrevented || 0);

    state.f13SubsequenceComplete = bool(receipt.f13SubsequenceComplete, state.f13SubsequenceComplete);
    state.f13LastRequiredEvent = receipt.f13LastRequiredEvent || state.f13LastRequiredEvent;
    state.f21Allowed = bool(receipt.f21Allowed, state.f21Allowed);
    state.completionLatched = bool(receipt.completionLatched, state.completionLatched);

    if (receipt.newsGateState) {
      state.northGateReady = bool(receipt.newsGateState.northGateReady, state.northGateReady);
      state.eastGateReady = bool(receipt.newsGateState.eastGateReady, state.eastGateReady);
      state.westGateReady = bool(receipt.newsGateState.westGateReady, state.westGateReady);
      state.southGateReady = bool(receipt.newsGateState.southGateReady, state.southGateReady);
      state.newsGatePassedBeforeF21 = bool(receipt.newsGateState.newsGatePassedBeforeF21, state.newsGatePassedBeforeF21);
    } else {
      state.northGateReady = bool(receipt.northGateReady, state.northGateReady);
      state.eastGateReady = bool(receipt.eastGateReady, state.eastGateReady);
      state.westGateReady = bool(receipt.westGateReady, state.westGateReady);
      state.southGateReady = bool(receipt.southGateReady, state.southGateReady);
      state.newsGatePassedBeforeF21 = bool(receipt.newsGatePassedBeforeF21, state.newsGatePassedBeforeF21);
    }

    purgeCompletedLocalQueue();

    if (state.completionLatched) {
      forcePostgameCoordinateFix();
    } else if (receipt.firstFailedCoordinate) {
      state.firstFailedCoordinate = receipt.firstFailedCoordinate;
    }

    if (!state.completionLatched && receipt.recommendedNextRenewalTarget) {
      state.recommendedNextRenewalTarget = receipt.recommendedNextRenewalTarget;
    }

    if (!options.skipQueueDrain && priorActive !== state.activeCheckpointId) {
      drainActiveMatchQueue("active-checkpoint-changed-after-receipt");
    }
  }

  function submitCheckpoint(eventName, detail = {}, options = {}) {
    const checkpoint = getCheckpointByEvent(eventName);
    if (!checkpoint) return null;

    if (state.completedCheckpoints.includes(checkpoint.id) && checkpoint.id !== "F21_COMPLETION_LATCHED") {
      if (!options.fromQueueDrain) {
        archiveLateEvent({
          event: eventName,
          stage: checkpoint.fibonacci,
          lane: checkpoint.lane,
          reason: "local-completed-checkpoint-duplicate",
          message: checkpoint.label,
          detail
        });
      }

      return {
        action: "ARCHIVE",
        checkpointId: checkpoint.id,
        reason: "local-completed-checkpoint-duplicate"
      };
    }

    const session = state.checkpointSession || createCheckpointSession();
    const snapshot = buildCheckpointSnapshot();

    const event = {
      id: eventName,
      event: eventName,
      phase: eventName,
      checkpointId: checkpoint.id,
      detail: {
        ...snapshot,
        ...detail
      },
      snapshot: {
        ...snapshot,
        ...detail
      }
    };

    let result = null;

    try {
      result = session.submitEvent(event);
      const receipt = isFunction(session.getReceipt) ? session.getReceipt() : null;
      updateFromCheckpointReceipt(receipt, { skipQueueDrain: true });
    } catch (error) {
      recordError("CHECKPOINT_SUBMIT_FAILED", error && error.message ? error.message : String(error), { eventName });
      return null;
    }

    const action = result && result.action ? result.action : "UNKNOWN";

    emitLocal(eventName, {
      action,
      reason: result && result.reason ? result.reason : "",
      checkpointId: checkpoint.id,
      activeCheckpointId: result && result.activeCheckpoint ? result.activeCheckpoint.id : state.activeCheckpointId,
      fromQueueDrain: options.fromQueueDrain === true
    });

    if (action === "ADMIT") {
      removeLocalQueuedCheckpoint(checkpoint.id, eventName);
      state.latestVisibleEvent = eventName;
      state.currentStage = checkpoint.fibonacci;
      state.highestStage = checkpoint.fibonacci;
      state.mainDisplayProgress = Math.max(state.mainDisplayProgress, state.completionLatched ? 100 : Math.min(98, checkpoint.progress));

      setLane(checkpoint.lane, {
        status: checkpoint.id === "F21_COMPLETION_LATCHED" ? "LATCHED" : "READY",
        progress: checkpoint.progress,
        event: eventName,
        stage: checkpoint.fibonacci,
        message: checkpoint.label
      });
    } else if (action === "BLOCK") {
      state.blockedEventsCount += 1;
      state.mainDisplayProgress = Math.min(98, Math.max(state.mainDisplayProgress, 98));
    } else if (action === "QUEUE") {
      state.queuedEventsCount += 1;

      if (!options.skipQueueStore) {
        storeLocalQueuedCheckpoint(eventName, checkpoint, detail, result);
      }
    } else if (action === "ARCHIVE") {
      state.archivedEventsCount += 1;
      removeLocalQueuedCheckpoint(checkpoint.id, eventName);
    }

    purgeCompletedLocalQueue();

    if (state.completionLatched) {
      forcePostgameCoordinateFix();
    } else {
      deriveFailureCoordinate();
    }

    if (!options.skipQueueDrain) {
      drainActiveMatchQueue(`after-submit-${eventName}`);
    }

    publishGlobals();
    scheduleRender();
    return result;
  }

  function buildCheckpointSnapshot() {
    return {
      canvasReady: state.canvasReady,
      canvasCarrierMounted: state.canvasCarrierMounted,
      canvasCarrierRequested: state.canvasCarrierRequested,
      canvasCarrierHandoffOk: state.canvasCarrierHandoffOk,
      cooperativeBootUsed: state.cooperativeBootUsed,
      syncBootFallbackUsed: state.syncBootFallbackUsed,

      atlasBuildComplete: state.atlasBuildComplete,
      textureComposeComplete: state.textureComposeComplete,
      visibleContentProof: state.visibleContentProof,
      visiblePlanetAvailable: state.visiblePlanetAvailable,
      nonblankPlanetVisible: state.nonblankPlanetVisible,
      carrierOnlyDetected: state.carrierOnlyDetected,

      imageRendered: state.imageRendered,
      firstFrameDetected: state.firstFrameDetected,
      dragInspectionBound: state.dragInspectionBound,

      inspectModeAvailable: state.inspectModeAvailable,
      inspectPlanetControlAvailable: state.inspectPlanetControlAvailable,
      diagnosticCanLeavePlanetFrame: state.diagnosticCanLeavePlanetFrame,
      diagnosticDockRestorable: state.diagnosticDockRestorable,
      showDiagnosticTabVisibleWhenHidden: state.showDiagnosticTabVisibleWhenHidden,
      copyDiagnosticPreserved: state.copyDiagnosticPreserved,
      receiptToggleReady: state.receiptToggleReady,
      buttonsReachable: state.buttonsReachable,
      receiptOverlayIndependent: state.receiptOverlayIndependent,

      northGateReady: state.northGateReady,
      eastGateReady: state.eastGateReady,
      westGateReady: state.westGateReady,
      southGateReady: state.southGateReady,
      newsGatePassedBeforeF21: state.newsGatePassedBeforeF21,

      completionLatched: state.completionLatched
    };
  }

  function evaluateNewsGates() {
    state.northGateReady = Boolean(
      state.canvasReady &&
      state.atlasBuildComplete &&
      state.textureComposeComplete &&
      state.visibleContentProof &&
      state.visiblePlanetAvailable
    );

    state.eastGateReady = Boolean(
      state.cooperativeBootUsed &&
      !state.syncBootFallbackUsed &&
      state.canvasCarrierRequested &&
      state.canvasCarrierHandoffOk
    );

    state.westGateReady = Boolean(
      state.copyDiagnosticPreserved &&
      state.receiptToggleReady &&
      state.inspectPlanetControlAvailable &&
      state.diagnosticDockRestorable &&
      state.buttonsReachable &&
      state.receiptOverlayIndependent
    );

    state.southGateReady = Boolean(
      state.imageRendered &&
      state.firstFrameDetected &&
      state.dragInspectionBound &&
      state.visiblePlanetAvailable &&
      state.diagnosticCanLeavePlanetFrame
    );

    state.newsGatePassedBeforeF21 = Boolean(
      state.northGateReady &&
      state.eastGateReady &&
      state.westGateReady &&
      state.southGateReady
    );

    state.f21Allowed = Boolean(state.f13SubsequenceComplete && state.newsGatePassedBeforeF21);
    return state.newsGatePassedBeforeF21;
  }

  function evaluateInspectGate() {
    state.inspectModeAvailable = Boolean(refs.inspectButton);
    state.inspectPlanetControlAvailable = Boolean(refs.inspectButton);
    state.diagnosticDockRestorable = Boolean(refs.showTab);
    state.showDiagnosticTabVisibleWhenHidden = Boolean(refs.showTab);
    state.copyDiagnosticPreserved = Boolean(refs.copyButton);
    state.receiptToggleReady = Boolean(refs.receiptToggle);
    state.buttonsReachable = Boolean(refs.copyButton && refs.receiptToggle && refs.inspectButton && refs.expandButton);
    state.receiptOverlayIndependent = true;

    state.diagnosticCanLeavePlanetFrame = Boolean(
      state.inspectModeAvailable &&
      state.inspectPlanetControlAvailable &&
      state.diagnosticDockRestorable &&
      state.showDiagnosticTabVisibleWhenHidden &&
      state.copyDiagnosticPreserved &&
      state.receiptToggleReady &&
      state.buttonsReachable
    );

    evaluateNewsGates();

    if (state.diagnosticCanLeavePlanetFrame && state.visibleContentProof && !state.completedCheckpoints.includes("F13N_INSPECT_MODE_READY")) {
      submitCheckpoint("INSPECT_MODE_READY", {
        inspectModeAvailable: true,
        inspectPlanetControlAvailable: true,
        diagnosticCanLeavePlanetFrame: true,
        showDiagnosticTabVisibleWhenHidden: true,
        diagnosticDockRestorable: true,
        copyDiagnosticPreserved: true,
        receiptToggleReady: true,
        buttonsReachable: true
      });
    }

    return state.diagnosticCanLeavePlanetFrame;
  }

  function deriveFailureCoordinate() {
    if (state.completionLatched) {
      forcePostgameCoordinateFix();
      return;
    }

    const activePacket = findActiveLocalQueuedPacket();

    if (activePacket) {
      state.stuckAtQueuedActiveCheckpoint = true;
      state.firstFailedCoordinate = `WAITING_ACTIVE_MATCH_QUEUE_DRAIN_${state.activeCheckpointId}`;
      state.recommendedNextRenewalTarget = COHERENCE_FILE;
      return;
    }

    state.stuckAtQueuedActiveCheckpoint = false;

    if (!state.canvasReady) {
      state.firstFailedCoordinate = `WAITING_${state.activeCheckpointId || "CANVAS_READY"}`;
      state.recommendedNextRenewalTarget = state.activeCheckpointRank >= 7 ? CANVAS_FILE : COHERENCE_FILE;
      return;
    }

    if (!state.visibleContentProof) {
      state.firstFailedCoordinate = "WAITING_visibleContentProof";
      state.recommendedNextRenewalTarget = CANVAS_FILE;
      return;
    }

    if (!state.inspectModeAvailable) {
      state.firstFailedCoordinate = "WAITING_inspectModeAvailable";
      state.recommendedNextRenewalTarget = COHERENCE_FILE;
      return;
    }

    if (!state.inspectPlanetControlAvailable) {
      state.firstFailedCoordinate = "WAITING_inspectPlanetControlAvailable";
      state.recommendedNextRenewalTarget = COHERENCE_FILE;
      return;
    }

    if (!state.diagnosticCanLeavePlanetFrame) {
      state.firstFailedCoordinate = "WAITING_diagnosticCanLeavePlanetFrame";
      state.recommendedNextRenewalTarget = COHERENCE_FILE;
      return;
    }

    if (!state.newsGatePassedBeforeF21) {
      if (!state.northGateReady) state.firstFailedCoordinate = "WAITING_northGateReady";
      else if (!state.eastGateReady) state.firstFailedCoordinate = "WAITING_eastGateReady";
      else if (!state.westGateReady) state.firstFailedCoordinate = "WAITING_westGateReady";
      else if (!state.southGateReady) state.firstFailedCoordinate = "WAITING_southGateReady";
      else state.firstFailedCoordinate = "WAITING_newsGatePassedBeforeF21";

      state.recommendedNextRenewalTarget = COHERENCE_FILE;
      return;
    }

    state.firstFailedCoordinate = "WAITING_completionLatch";
    state.recommendedNextRenewalTarget = COHERENCE_FILE;
  }

  function forcePostgameCoordinateFix() {
    state.completionLatched = true;
    state.visibleLoadingActive = false;
    state.diagnosticCockpitReady = true;
    state.currentStage = "F21";
    state.highestStage = "F21";
    state.activeCheckpointId = "F21_COMPLETION_LATCHED";
    state.activeCheckpointRank = 21;
    state.activeFibonacciStage = "F21";
    state.highestCompletedCheckpointId = "F21_COMPLETION_LATCHED";
    state.highestCompletedRank = 21;
    state.f21Allowed = true;
    state.f21AfterF13N = true;
    state.mainDisplayProgress = 100;
    state.mainProgressCap = 100;
    state.postgameStatus = "READY_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE";
    state.firstFailedCoordinate = "NONE_NEWS_FIBONACCI_F21_LATCHED";
    state.recommendedNextRenewalTarget = "read-postgame-canvas-or-triple-g-receipt";
    state.latestVisibleEvent = "COMPLETION_LATCHED";
    state.finalReceiptAvailable = true;
    state.stuckAtQueuedActiveCheckpoint = false;
    state.localQueuedCheckpointEvents = [];
    state.localQueuedEventsCount = 0;

    if (refs.ledger && refs.ledger.state) {
      refs.ledger.state.currentStage = "F21";
      refs.ledger.state.highestStage = "F21";
      refs.ledger.state.completionLatched = true;
      refs.ledger.state.updatedAt = nowIso();
    }
  }

  function maybeFinalize(reason = "manual") {
    hydrateCockpit();
    drainActiveMatchQueue(`maybe-finalize-pre-${reason}`);
    evaluateInspectGate();
    evaluateNewsGates();
    drainActiveMatchQueue(`maybe-finalize-post-gates-${reason}`);

    const ready = Boolean(
      state.canvasReady &&
      state.canvasCarrierMounted &&
      state.firstFrameDetected &&
      state.imageRendered &&
      state.dragInspectionBound &&
      state.atlasBuildComplete &&
      state.textureComposeComplete &&
      state.visibleContentProof &&
      state.visiblePlanetAvailable &&
      state.nonblankPlanetVisible &&
      state.inspectModeAvailable &&
      state.inspectPlanetControlAvailable &&
      state.diagnosticCanLeavePlanetFrame &&
      state.newsGatePassedBeforeF21
    );

    if (!ready) {
      state.visibleLoadingActive = !state.canvasReady || !state.visibleContentProof;
      state.diagnosticCockpitReady = state.canvasReady && state.visibleContentProof;
      state.mainDisplayProgress = Math.min(98, Math.max(state.mainDisplayProgress, state.canvasReady ? 98 : state.mainDisplayProgress));
      state.postgameStatus = state.visibleContentProof ? "INSPECT_OR_NEWS_GATE_PENDING" : "VISIBLE_CONTENT_PROOF_PENDING";
      deriveFailureCoordinate();
      scheduleRender();
      return false;
    }

    if (!state.completedCheckpoints.includes("F13N_INSPECT_MODE_READY")) {
      submitCheckpoint("INSPECT_MODE_READY");
    }

    drainActiveMatchQueue(`maybe-finalize-after-f13n-${reason}`);
    evaluateNewsGates();

    if (!state.newsGatePassedBeforeF21) {
      deriveFailureCoordinate();
      scheduleRender();
      return false;
    }

    const result = submitCheckpoint("COMPLETION_LATCHED", {
      f21Allowed: true,
      completionLatched: true,
      reason
    });

    if (result && result.action === "ADMIT") {
      forcePostgameCoordinateFix();
      if (state.cockpitMode !== "planet-inspect") setCockpitMode("diagnostic-dock");
      scheduleRender();
      publishGlobals();
      return true;
    }

    deriveFailureCoordinate();
    scheduleRender();
    return false;
  }

  function checkRuntimeTable() {
    const api = getRuntimeTableApi();

    state.runtimeTablePresent = Boolean(api);
    state.runtimeTableMode = api ? "RUNTIME_TABLE_READY_OR_DEGRADED" : "RUNTIME_TABLE_MISSING_ALLOWED";
    state.runtimeTablePlanAttempted = Boolean(api);

    if (!api) return null;

    try {
      let plan = null;

      if (isFunction(api.createHearthVisualCarrierPlan)) {
        plan = api.createHearthVisualCarrierPlan({
          planetId: "hearth",
          planetLabel: "Hearth",
          route: ROUTE,
          renderMetadata: {
            pairedSemiconductor: true,
            constraintSemiconductor: INDEX_FILE,
            coherenceSemiconductor: COHERENCE_FILE,
            synchronizedLoading: true,
            checkpointGovernorConsumer: true,
            activeMatchQueueDrainConsumer: true,
            visualPassClaimed: false
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
          route: ROUTE
        });
      }

      state.runtimeTablePlanCreated = Boolean(plan);
      state.runtimeTablePlanError = "";
      return plan;
    } catch (error) {
      state.runtimeTablePlanError = error && error.message ? error.message : String(error);
      recordError("RUNTIME_TABLE_PLAN_ERROR", state.runtimeTablePlanError);
      return null;
    }
  }

  function selectCanvasMethod(api) {
    if (api && isFunction(api.bootCooperative)) return "bootCooperative";
    if (api && isFunction(api.boot)) return "boot";
    if (api && isFunction(api.mountVisibleCarrier)) return "mountVisibleCarrier";
    if (api && isFunction(api.bootVisibleCarrier)) return "bootVisibleCarrier";
    if (api && isFunction(api.mount)) return "mount";
    if (api && isFunction(api.start)) return "start";
    if (api && isFunction(api.init)) return "init";
    if (api && isFunction(api.render)) return "render";
    return "";
  }

  function canvasPayload() {
    return {
      calledBy: CONTRACT,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      route: ROUTE,
      mountId: MOUNT_ID,
      mount: refs.mount || ensureMount(),
      pairedSemiconductor: true,
      constraintSemiconductor: INDEX_FILE,
      coherenceSemiconductor: COHERENCE_FILE,
      systematicAndSynchronized: true,
      synchronizedLoading: true,
      runtimeTableCheckpointGovernorConsumer: true,
      activeMatchQueueDrainConsumer: true,
      visibleContentCompletionGate: true,
      inspectModeGate: true,
      sharedLedger: refs.ledger || ensureLedger(),
      loadLedger: refs.ledger || ensureLedger(),
      visibleCarrierFirst: true,
      runtimeTableOptional: true,
      runtimeTableMissingDoesNotBlockCarrier: true,
      sourceAuthorityHeld: true,
      climateRouteRetired: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      callbacks: {
        onCanvasPhase: handleCanvasPhase,
        onCanvasProgress: handleCanvasPhase,
        onMounted: (receipt) => handleCanvasReceipt(receipt, "onMounted"),
        onFirstFrame: (receipt) => handleCanvasReceipt(receipt, "onFirstFrame"),
        onRendered: (receipt) => handleCanvasReceipt(receipt, "onRendered"),
        onDragBound: (receipt) => handleCanvasReceipt(receipt, "onDragBound"),
        onReady: (receipt) => handleCanvasReceipt(receipt, "onReady"),
        onError: (receipt) => handleCanvasReceipt(receipt, "onError")
      }
    };
  }

  function callCanvasCarrier() {
    if (canvasBootRequested || state.completionLatched) return;

    const api = getCanvasApi();
    state.canvasApiPresent = Boolean(api);

    if (!api) {
      deriveFailureCoordinate();
      scheduleRender();
      return;
    }

    const method = selectCanvasMethod(api);

    if (!method) {
      state.canvasCarrierHandoffError = "Canvas API present but no boot/mount method exists.";
      recordError("CANVAS_METHOD_MISSING", state.canvasCarrierHandoffError);
      deriveFailureCoordinate();
      return;
    }

    canvasBootRequested = true;
    state.canvasCarrierRequested = true;
    state.canvasCarrierMethod = method;
    state.cooperativeBootAvailable = Boolean(isFunction(api.bootCooperative));
    state.cooperativeBootUsed = method === "bootCooperative";
    state.syncBootFallbackUsed = method !== "bootCooperative";
    state.canvasBootStartedAt = nowIso();
    state.canvasBootStartedAtMs = nowMs();

    submitCheckpoint("CANVAS_COOPERATIVE_BOOT_STARTED", {
      cooperativeBootAvailable: state.cooperativeBootAvailable,
      cooperativeBootUsed: state.cooperativeBootUsed,
      syncBootFallbackUsed: state.syncBootFallbackUsed,
      canvasCarrierRequested: true
    });

    try {
      const result = api[method](canvasPayload());
      state.canvasCarrierHandoffOk = true;

      if (result && isFunction(result.then)) {
        result
          .then((receipt) => handleCanvasReceipt(receipt, "canvas-promise-resolved"))
          .catch((error) => {
            state.canvasCarrierHandoffOk = false;
            state.canvasCarrierHandoffError = error && error.message ? error.message : String(error);
            recordError("CANVAS_PROMISE_REJECTED", state.canvasCarrierHandoffError);
          });
      } else if (result && isObject(result)) {
        handleCanvasReceipt(result, "canvas-method-returned-receipt");
      }
    } catch (error) {
      state.canvasCarrierHandoffOk = false;
      state.canvasCarrierHandoffError = error && error.message ? error.message : String(error);
      recordError("CANVAS_HANDOFF_ERROR", state.canvasCarrierHandoffError, { method });
    }
  }

  function phaseSignature(event) {
    const phase = String(event.phase || event.id || event.event || "CANVAS_PHASE");
    const detail = isObject(event.detail) ? event.detail : {};
    const chunk = detail.chunkIndex ?? "";
    const total = detail.totalChunks ?? "";
    const progress = event.percent ?? event.progress ?? detail.progress ?? "";
    return `${phase}|${chunk}|${total}|${progress}`;
  }

  function handleCanvasPhase(event = {}) {
    const phase = String(event.phase || event.id || event.event || "CANVAS_PHASE");
    const detail = isObject(event.detail) ? event.detail : {};
    const signature = phaseSignature(event);
    const current = nowMs();

    if (state.phaseSignatures[signature] && current - state.phaseSignatures[signature] < 1800) {
      state.ignoredDuplicateCanvasEvents += 1;
      return event;
    }

    state.phaseSignatures[signature] = current;

    const percent = clamp(Number(event.percent ?? event.progress ?? detail.progress ?? state.lastCanvasProgress ?? 0), 0, 100);
    const elapsedMs = Number(detail.elapsedMs ?? event.elapsedMs ?? state.canvasBootElapsedMs ?? 0);
    const message = event.message || phaseToMessage(phase, percent, detail);

    if (state.completionLatched) {
      archiveLateEvent({
        event: phase,
        stage: "F13",
        lane: "canvasAndDiagnostic",
        reason: "post-f21-canvas-event-archived",
        message,
        detail
      });
      return event;
    }

    state.canvasPhaseCount += 1;
    state.lastCanvasPhase = phase;
    state.lastCanvasProgress = Math.max(Number(state.lastCanvasProgress || 0), percent);
    state.canvasBootElapsedMs = Math.max(Number(state.canvasBootElapsedMs || 0), elapsedMs);
    state.canvasYieldCount = Math.max(Number(state.canvasYieldCount || 0), Number(detail.canvasYieldCount || 0));
    state.loaderRepaintDuringCanvasBoot = Boolean(state.loaderRepaintDuringCanvasBoot || detail.loaderRepaintDuringCanvasBoot || state.canvasYieldCount > 0);
    state.f13ProgressStreamActive = true;

    applyCanvasPhaseTruth(phase, detail);

    const entry = {
      at: nowIso(),
      phase,
      percent,
      message,
      detail: clonePlain(detail)
    };

    state.phaseEvents.push(entry);
    if (state.phaseEvents.length > 180) state.phaseEvents.splice(0, state.phaseEvents.length - 180);

    if (PROGRESS_ONLY_EVENTS.includes(phase)) {
      state.progressOnlyEvents.push(entry);
      if (state.progressOnlyEvents.length > 160) state.progressOnlyEvents.splice(0, state.progressOnlyEvents.length - 160);
      state.mainDisplayProgress = Math.max(state.mainDisplayProgress, Math.min(98, percent));
      scheduleRender();
      return event;
    }

    if (getCheckpointByEvent(phase)) {
      submitCheckpoint(phase, detail);
    }

    if (phase === "CANVAS_READY") {
      state.canvasLaneClosed = true;
      startVisibleContentProof("canvas-ready");
      root.setTimeout(() => startVisibleContentProof("canvas-ready-post-frame"), 120);
      root.setTimeout(() => startVisibleContentProof("canvas-ready-late-frame"), 360);
    }

    drainActiveMatchQueue(`canvas-phase-${phase}`);
    scheduleRender();
    return event;
  }

  function applyCanvasPhaseTruth(phase, detail = {}) {
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

    if (phase === "DRAG_INSPECTION_BOUND") {
      state.dragInspectionBound = true;
    }

    if (phase === "ATLAS_BUILD_STARTED") {
      state.atlasBuildStarted = true;
    }

    if (phase === "ATLAS_BUILD_PROGRESS") {
      state.atlasBuildStarted = true;
      state.atlasBuildProgress = Math.max(state.atlasBuildProgress, Number(detail.atlasBuildProgress || detail.progress || 0));
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
      state.textureComposeProgress = Math.max(state.textureComposeProgress, Number(detail.textureComposeProgress || detail.progress || 0));
    }

    if (phase === "TEXTURE_COMPOSE_COMPLETE") {
      state.textureComposeStarted = true;
      state.textureComposeComplete = true;
      state.textureComposeProgress = 100;
      state.renderedAfterTexture = true;
    }

    if (phase === "FIRST_FRAME_REQUESTED") {
      state.firstFrameRequested = true;
    }

    if (phase === "FIRST_FRAME_DETECTED") {
      state.firstFrameRequested = true;
      state.firstFrameDetected = true;
      state.imageRendered = true;
    }

    if (phase === "CANVAS_READY") {
      state.canvasReady = true;
      state.canvasCarrierMounted = true;
      state.canvasCarrierHandoffOk = true;
      state.firstFrameRequested = true;
      state.firstFrameDetected = true;
      state.imageRendered = true;
      state.dragInspectionBound = true;
      state.atlasBuildStarted = true;
      state.atlasBuildComplete = true;
      state.atlasBuildProgress = 100;
      state.textureComposeStarted = true;
      state.textureComposeComplete = true;
      state.textureComposeProgress = 100;
      state.renderedAfterTexture = true;
      state.canvasBootCompletedAt = state.canvasBootCompletedAt || nowIso();
      state.canvasBootCompletedAtMs = state.canvasBootCompletedAtMs || nowMs();
      state.canvasBootElapsedMs = Number(detail.canvasBootElapsedMs || state.canvasBootElapsedMs || (state.canvasBootCompletedAtMs - state.canvasBootStartedAtMs));
      state.finalReceiptAvailable = true;
    }

    evaluateNewsGates();
  }

  function phaseToMessage(phase, percent, detail = {}) {
    const elapsed = formatElapsed(detail.elapsedMs || state.canvasBootElapsedMs || 0);

    if (phase === "CANVAS_COOPERATIVE_BOOT_STARTED") return "Canvas cooperative boot started.";
    if (phase === "CANVAS_MOUNT_CREATED") return "Canvas mount created.";
    if (phase === "CANVAS_CONTEXT_READY") return "Canvas context ready.";
    if (phase === "DRAG_INSPECTION_BOUND") return "Drag inspection bound.";
    if (phase === "ATLAS_BUILD_STARTED") return "Atlas build started.";
    if (phase === "ATLAS_BUILD_PROGRESS") {
      const chunk = detail.chunkIndex && detail.totalChunks ? `${detail.chunkIndex}/${detail.totalChunks} chunks` : `${detail.atlasBuildProgress || percent}%`;
      return `Atlas build active · ${chunk} · elapsed ${elapsed}`;
    }
    if (phase === "ATLAS_BUILD_COMPLETE") return "Atlas build complete.";
    if (phase === "TEXTURE_COMPOSE_STARTED") return "Texture composition started.";
    if (phase === "TEXTURE_COMPOSE_PROGRESS") return `Texture composition active · ${detail.textureComposeProgress || percent}% · elapsed ${elapsed}`;
    if (phase === "TEXTURE_COMPOSE_COMPLETE") return "Texture composition complete.";
    if (phase === "FIRST_FRAME_REQUESTED") return "First frame requested.";
    if (phase === "FIRST_FRAME_DETECTED") return "First frame detected.";
    if (phase === "CANVAS_READY") return "Canvas ready.";
    return phase;
  }

  function handleCanvasReceipt(receipt, reason = "canvas-receipt") {
    const value = receipt && isObject(receipt) ? receipt : getCanvasReceipt();

    if (value && isObject(value)) {
      handleCanvasReceiptLight(value);

      if (Array.isArray(value.phaseEvents)) {
        value.phaseEvents.forEach((event) => {
          if (event && event.phase) handleCanvasPhase(event);
        });
      }
    }

    if (state.canvasReady) startVisibleContentProof(`receipt-${reason}`);
    else maybeFinalize(`receipt-${reason}`);
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
    state.firstFrameDetected = Boolean(state.firstFrameDetected || value.firstFrameDetected);
    state.imageRendered = Boolean(state.imageRendered || value.imageRendered);
    state.dragInspectionBound = Boolean(state.dragInspectionBound || value.dragInspectionBound || value.pointerControlsBound || value.controlsBound);
    state.canvasReady = Boolean(state.canvasReady || value.canvasReady);

    state.atlasBuildStarted = Boolean(state.atlasBuildStarted || value.atlasBuildStarted);
    state.atlasBuildProgress = Math.max(Number(state.atlasBuildProgress || 0), Number(value.atlasBuildProgress || 0));
    state.atlasBuildComplete = Boolean(state.atlasBuildComplete || value.atlasBuildComplete);

    state.textureComposeStarted = Boolean(state.textureComposeStarted || value.textureComposeStarted);
    state.textureComposeProgress = Math.max(Number(state.textureComposeProgress || 0), Number(value.textureComposeProgress || 0));
    state.textureComposeComplete = Boolean(state.textureComposeComplete || value.textureComposeComplete);
    state.renderedAfterTexture = Boolean(state.renderedAfterTexture || state.textureComposeComplete || value.renderedAfterTexture);

    state.visiblePlanetAvailable = Boolean(state.visiblePlanetAvailable || value.visiblePlanetAvailable);
    state.planetCanvasPresent = Boolean(state.planetCanvasPresent || value.planetCanvasPresent);
    state.planetCanvasNonZeroSize = Boolean(state.planetCanvasNonZeroSize || value.planetCanvasNonZeroSize);
    state.planetFramePainted = Boolean(state.planetFramePainted || value.planetFramePainted);
    state.nonblankPlanetVisible = Boolean(state.nonblankPlanetVisible || value.nonblankPlanetVisible);

    state.canvasBootElapsedMs = Math.max(Number(state.canvasBootElapsedMs || 0), Number(value.canvasBootElapsedMs || 0));
    state.canvasYieldCount = Math.max(Number(state.canvasYieldCount || 0), Number(value.canvasYieldCount || 0));
    state.canvasPhaseCount = Math.max(Number(state.canvasPhaseCount || 0), Number(value.canvasPhaseCount || 0));
    state.lastCanvasPhase = value.lastCanvasPhase || state.lastCanvasPhase;
    state.lastCanvasProgress = Math.max(Number(state.lastCanvasProgress || 0), Number(value.lastCanvasProgress || 0));
    state.loaderRepaintDuringCanvasBoot = Boolean(state.loaderRepaintDuringCanvasBoot || value.loaderRepaintDuringCanvasBoot || state.canvasYieldCount > 0);
    state.f13ProgressStreamActive = Boolean(state.f13ProgressStreamActive || value.f13ProgressStreamActive);

    if (explicitReceiptContentProof(value)) {
      state.explicitContentReceiptProof = true;
      state.visibleContentProof = true;
      state.visibleContentProofStarted = true;
      state.visibleContentProofMethod = "explicit-canvas-receipt-content-proof";
      state.carrierOnlyDetected = false;
      state.visiblePlanetAvailable = true;
      state.nonblankPlanetVisible = true;
      state.planetFramePainted = true;
    }

    evaluateNewsGates();
  }

  function explicitReceiptContentProof(value) {
    if (!isObject(value)) return false;

    const keys = [
      "atlasPainted",
      "textureApplied",
      "surfaceTextureApplied",
      "planetTexturePainted",
      "visibleContentPainted",
      "visibleContentProof",
      "visibleHearthContentPainted",
      "atlasAppliedToPlanet",
      "textureAppliedToPlanet",
      "surfaceAtlasPainted",
      "landWaterTexturePainted"
    ];

    for (const key of keys) {
      if (value[key] === true || value[key] === "true") return true;
    }

    const nested = [value.state, value.receipt, value.postgame, value.canvasState, value.renderState].filter(isObject);

    for (const item of nested) {
      for (const key of keys) {
        if (item[key] === true || item[key] === "true") return true;
      }
    }

    return false;
  }

  function getPlanetCanvas() {
    if (!doc) return null;
    const mount = refs.mount || ensureMount();
    return mount ? mount.querySelector("canvas") : doc.querySelector("#hearthCanvasMount canvas");
  }

  function startVisibleContentProof(reason = "manual") {
    if (state.completionLatched) return true;

    state.visibleContentProofStarted = true;

    if (!state.completedCheckpoints.includes("F13L_VISIBLE_CONTENT_PROOF_STARTED")) {
      submitCheckpoint("VISIBLE_CONTENT_PROOF_STARTED", {
        visibleContentProofStarted: true,
        reason
      });
    }

    const passed = proveVisibleContent(reason);

    if (passed && !state.completedCheckpoints.includes("F13M_VISIBLE_CONTENT_PROOF_PASSED")) {
      submitCheckpoint("VISIBLE_CONTENT_PROOF_PASSED", {
        visibleContentProof: true,
        visiblePlanetAvailable: true,
        nonblankPlanetVisible: true,
        carrierOnlyDetected: false,
        reason
      });
    }

    drainActiveMatchQueue(`visible-content-${reason}`);
    evaluateInspectGate();
    maybeFinalize(`visible-content-proof-${reason}`);
    return passed;
  }

  function proveVisibleContent(reason = "manual") {
    const receipt = getCanvasReceipt();

    if (explicitReceiptContentProof(receipt)) {
      state.explicitContentReceiptProof = true;
      state.visibleContentProof = true;
      state.visibleContentProofMethod = "explicit-canvas-receipt-content-proof";
      state.visibleContentProofError = "";
      state.carrierOnlyDetected = false;
      state.visiblePlanetAvailable = true;
      state.nonblankPlanetVisible = true;
      state.planetFramePainted = true;
      return true;
    }

    const pixelProof = sampleVisibleContent(reason);

    if (pixelProof.passed) {
      state.visibleContentProof = true;
      state.visibleContentProofMethod = pixelProof.method;
      state.visibleContentProofError = "";
      state.visiblePlanetAvailable = true;
      state.nonblankPlanetVisible = true;
      state.planetFramePainted = true;
      state.carrierOnlyDetected = false;
      return true;
    }

    state.visibleContentProof = false;
    state.visibleContentProofMethod = pixelProof.method || "pending";
    state.visibleContentProofError = pixelProof.error || "";
    state.visiblePlanetAvailable = false;
    state.carrierOnlyDetected = true;
    return false;
  }

  function sampleVisibleContent(reason = "manual") {
    const canvas = getPlanetCanvas();
    state.planetCanvasPresent = Boolean(canvas);

    let rect = null;

    try {
      rect = canvas && isFunction(canvas.getBoundingClientRect) ? canvas.getBoundingClientRect() : null;
    } catch (_error) {
      rect = null;
    }

    state.planetCanvasNonZeroSize = Boolean(
      canvas &&
      (
        (Number(canvas.width || 0) > 0 && Number(canvas.height || 0) > 0) ||
        (rect && rect.width > 0 && rect.height > 0)
      )
    );

    if (!canvas || !state.planetCanvasNonZeroSize) {
      return {
        passed: false,
        method: "canvas-missing-or-zero-size",
        error: "Planet canvas missing or zero size."
      };
    }

    let ctx = null;
    let width = 0;
    let height = 0;

    try {
      ctx = canvas.getContext && canvas.getContext("2d", { willReadFrequently: true });
      width = Math.max(1, Number(canvas.width || Math.floor(rect?.width || 0)));
      height = Math.max(1, Number(canvas.height || Math.floor(rect?.height || 0)));
    } catch (error) {
      return {
        passed: false,
        method: "canvas-pixel-sample-unavailable",
        error: error && error.message ? error.message : String(error)
      };
    }

    if (!ctx || width <= 1 || height <= 1) {
      return {
        passed: false,
        method: "canvas-context-unavailable",
        error: "Canvas 2D context unavailable for content proof."
      };
    }

    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.42;
    const classes = new Set();
    const colors = [];

    let sampleCount = 0;
    let nonblank = 0;
    let land = 0;
    let water = 0;
    let other = 0;
    let carrier = 0;

    const grid = 17;

    try {
      for (let gy = 0; gy < grid; gy += 1) {
        for (let gx = 0; gx < grid; gx += 1) {
          const nx = (gx + 0.5) / grid;
          const ny = (gy + 0.5) / grid;
          const x = Math.floor(width * (0.12 + nx * 0.76));
          const y = Math.floor(height * (0.12 + ny * 0.76));
          const dx = x - cx;
          const dy = y - cy;

          if (Math.sqrt(dx * dx + dy * dy) > radius) continue;

          const data = ctx.getImageData(clamp(x, 0, width - 1), clamp(y, 0, height - 1), 1, 1).data;
          const r = data[0] || 0;
          const g = data[1] || 0;
          const b = data[2] || 0;
          const a = data[3] || 0;
          const lum = (r + g + b) / 3;

          sampleCount += 1;

          if (a < 16 || lum < 16) continue;

          nonblank += 1;
          colors.push([r, g, b]);

          const className = classifyContentColor(r, g, b, a);

          if (className === "land") {
            land += 1;
            classes.add("land");
          } else if (className === "water") {
            water += 1;
            classes.add("water");
          } else if (className === "content-other") {
            other += 1;
            classes.add("content-other");
          } else {
            carrier += 1;
          }
        }
      }
    } catch (error) {
      return {
        passed: false,
        method: "canvas-pixel-sample-failed",
        error: error && error.message ? error.message : String(error)
      };
    }

    const variance = computeColorVariance(colors);
    const classCount = classes.size;

    state.visibleContentSampleCount = sampleCount;
    state.visibleContentVarianceScore = Math.round(variance * 100) / 100;
    state.visibleContentClassCount = classCount;
    state.visibleContentClasses = Array.from(classes);
    state.visibleContentLandSampleCount = land;
    state.visibleContentWaterSampleCount = water;
    state.visibleContentOtherSampleCount = other;
    state.planetFramePainted = Boolean(nonblank > 12 && (state.firstFrameDetected || state.imageRendered || state.canvasReady));
    state.nonblankPlanetVisible = Boolean(nonblank > 12);

    const hasLand = land >= 4;
    const hasWaterOrOther = water >= 6 || other >= 6;
    const enoughVariance = variance >= 12;
    const enoughSamples = sampleCount >= 60 && nonblank >= 28;
    const passed = Boolean(enoughSamples && enoughVariance && hasLand && hasWaterOrOther && state.textureComposeComplete && state.canvasReady);

    state.carrierOnlyDetected = !passed;

    return {
      passed,
      method: passed ? "canvas-pixel-content-sample" : "carrier-only-or-insufficient-content-sample",
      error: passed ? "" : `Visible content sample failed: samples=${sampleCount}, nonblank=${nonblank}, variance=${Math.round(variance * 100) / 100}, classes=${classCount}, land=${land}, water=${water}, other=${other}, carrier=${carrier}, reason=${reason}`
    };
  }

  function classifyContentColor(r, g, b, a) {
    if (a < 16) return "blank";

    const lum = (r + g + b) / 3;
    if (lum < 18) return "carrier";

    const blueDominant = b >= r + 10 && b >= g - 6;
    const mutedBlueCarrier = blueDominant && b < 72 && g < 72 && r < 60;
    if (mutedBlueCarrier) return "carrier";

    const landGreen = g >= 48 && r >= 28 && b <= 118 && g >= b + 8;
    const landBrown = r >= 52 && g >= 42 && b <= 95 && r >= b + 12 && g >= b + 4;
    const landYellow = r >= 70 && g >= 62 && b <= 120 && Math.abs(r - g) <= 52;

    if (landGreen || landBrown || landYellow) return "land";

    const waterBlue = b >= 52 && b >= r + 8 && b >= g - 10 && g >= 28;
    const waterTeal = g >= 46 && b >= 46 && r <= 62 && Math.abs(g - b) <= 45;

    if (waterBlue || waterTeal) return "water";

    if (lum >= 52 && Math.max(r, g, b) - Math.min(r, g, b) >= 20) return "content-other";

    return "carrier";
  }

  function computeColorVariance(colors) {
    if (!colors.length) return 0;

    let r = 0;
    let g = 0;
    let b = 0;

    colors.forEach((color) => {
      r += color[0];
      g += color[1];
      b += color[2];
    });

    r /= colors.length;
    g /= colors.length;
    b /= colors.length;

    let total = 0;

    colors.forEach((color) => {
      total += Math.pow(color[0] - r, 2);
      total += Math.pow(color[1] - g, 2);
      total += Math.pow(color[2] - b, 2);
    });

    return Math.sqrt(total / (colors.length * 3));
  }

  function reconcileFromDataset() {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    state.canvasReady = Boolean(state.canvasReady || bool(dataset.hearthCanvasReady));
    state.canvasCarrierMounted = Boolean(state.canvasCarrierMounted || bool(dataset.hearthCanvasCarrierMounted));
    state.firstFrameDetected = Boolean(state.firstFrameDetected || bool(dataset.hearthFirstFrameDetected));
    state.imageRendered = Boolean(state.imageRendered || bool(dataset.hearthImageRendered) || bool(dataset.hearthCanvasImageRendered));
    state.dragInspectionBound = Boolean(state.dragInspectionBound || bool(dataset.hearthDragInspectionBound) || bool(dataset.hearthControlsBound));

    state.visibleContentProof = Boolean(state.visibleContentProof || bool(dataset.hearthVisibleContentProof));
    state.visiblePlanetAvailable = Boolean(state.visiblePlanetAvailable || bool(dataset.hearthVisiblePlanetAvailable));
    state.planetCanvasPresent = Boolean(state.planetCanvasPresent || bool(dataset.hearthPlanetCanvasPresent));
    state.planetCanvasNonZeroSize = Boolean(state.planetCanvasNonZeroSize || bool(dataset.hearthPlanetCanvasNonZeroSize));
    state.planetFramePainted = Boolean(state.planetFramePainted || bool(dataset.hearthPlanetFramePainted));
    state.nonblankPlanetVisible = Boolean(state.nonblankPlanetVisible || bool(dataset.hearthNonblankPlanetVisible));

    state.inspectModeAvailable = Boolean(state.inspectModeAvailable || bool(dataset.hearthInspectModeAvailable));
    state.inspectPlanetControlAvailable = Boolean(state.inspectPlanetControlAvailable || bool(dataset.hearthInspectPlanetControlAvailable));
    state.diagnosticCanLeavePlanetFrame = Boolean(state.diagnosticCanLeavePlanetFrame || bool(dataset.hearthDiagnosticCanLeavePlanetFrame));
    state.diagnosticDockRestorable = Boolean(state.diagnosticDockRestorable || bool(dataset.hearthDiagnosticDockRestorable));
    state.showDiagnosticTabVisibleWhenHidden = Boolean(state.showDiagnosticTabVisibleWhenHidden || bool(dataset.hearthShowDiagnosticTabVisibleWhenHidden));
    state.copyDiagnosticPreserved = Boolean(state.copyDiagnosticPreserved || bool(dataset.hearthCopyDiagnosticPreserved));

    state.completionLatched = Boolean(state.completionLatched || bool(dataset.hearthCompletionLatched));

    if (state.completionLatched) forcePostgameCoordinateFix();
  }

  function reconcileAll(reason = "manual") {
    reconcileFromDataset();

    const receipt = getCanvasReceipt();
    if (receipt && isObject(receipt)) handleCanvasReceiptLight(receipt);

    drainActiveMatchQueue(`reconcile-pre-proof-${reason}`);

    if (state.canvasReady && !state.visibleContentProof) {
      startVisibleContentProof(`reconcile-${reason}`);
    }

    evaluateInspectGate();
    evaluateNewsGates();
    drainActiveMatchQueue(`reconcile-post-gate-${reason}`);

    if (state.visibleContentProof) maybeFinalize(`reconcile-${reason}`);
    else deriveFailureCoordinate();

    if (state.completionLatched) forcePostgameCoordinateFix();

    publishGlobals();
    scheduleRender();
  }

  function computeProgress() {
    if (state.completionLatched) {
      state.mainDisplayProgress = 100;
      state.mainProgressCap = 100;
      return 100;
    }

    const active = getCheckpointById(state.activeCheckpointId);
    const activeProgress = active ? active.progress : state.mainDisplayProgress;

    state.mainProgressCap = 98;
    state.mainDisplayProgress = Math.min(98, Math.max(state.mainDisplayProgress, activeProgress || 0));

    if (state.canvasReady) state.mainDisplayProgress = Math.max(state.mainDisplayProgress, 98);
    if (state.visibleContentProof) state.mainDisplayProgress = Math.max(state.mainDisplayProgress, 98);

    return Math.round(state.mainDisplayProgress);
  }

  function renderLaneMarkup() {
    return FIBONACCI_CHECKPOINTS.map((checkpoint) => {
      const complete = state.completedCheckpoints.includes(checkpoint.id);
      const active = state.activeCheckpointId === checkpoint.id;
      const queuedLocal = state.localQueuedCheckpointEvents.some((packet) => packet.checkpointId === checkpoint.id);
      const status = complete ? "COMPLETE" : active ? "ACTIVE" : queuedLocal ? "QUEUED" : checkpoint.rank < state.activeCheckpointRank ? "ARCHIVED" : "PENDING";
      const progress = complete ? checkpoint.progress : active ? Math.min(98, checkpoint.progress) : 0;

      return `
        <section class="hearth-ledger-lane" data-lane="${escapeHtml(checkpoint.lane)}" data-status="${escapeHtml(status)}">
          <div class="hearth-ledger-lane-top">
            <span class="hearth-ledger-lane-title">
              <strong>${escapeHtml(checkpoint.label)} · ${escapeHtml(checkpoint.fibonacci)}</strong>
              <span>${escapeHtml(checkpoint.event)}</span>
            </span>
            <span class="hearth-ledger-lane-status">${escapeHtml(status)}</span>
          </div>
          <div class="hearth-ledger-lane-track">
            <span class="hearth-ledger-lane-fill" style="width:${progress}%"></span>
          </div>
          <div class="hearth-ledger-lane-title">
            <span>checkpoint=${escapeHtml(checkpoint.id)}</span>
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

    const progress = computeProgress();
    const elapsed = state.startedAtMs ? nowMs() - state.startedAtMs : 0;

    if (refs.title) {
      refs.title.textContent = state.completionLatched
        ? "READY · PLANET VISIBLE · DIAGNOSTIC AVAILABLE"
        : state.canvasReady && !state.visibleContentProof
          ? "VISIBLE CONTENT PROOF PENDING"
          : "FORMING HEARTH RUNTIME TABLE";
    }

    if (refs.stage) {
      refs.stage.textContent = state.completionLatched
        ? "F21 · Completion latch"
        : `${state.activeFibonacciStage || state.currentStage} · ${activeCheckpointLabel()}`;
    }

    if (refs.heartbeat) {
      refs.heartbeat.textContent = state.completionLatched
        ? `READY gated by F21 · elapsed=${formatElapsed(elapsed)}`
        : `heartbeat=active · stage=${state.activeFibonacciStage || state.currentStage} · elapsed=${formatElapsed(elapsed)}`;
    }

    if (refs.latest) {
      refs.latest.textContent = `latest=${state.completionLatched ? "COMPLETION_LATCHED" : state.latestVisibleEvent}`;
    }

    if (refs.mainFill) refs.mainFill.style.width = `${progress}%`;
    if (refs.mainPercent) refs.mainPercent.textContent = `${progress}%`;
    if (refs.laneList) refs.laneList.innerHTML = renderLaneMarkup();
    if (refs.receiptPre) refs.receiptPre.textContent = getReceiptText();

    refs.cockpit.dataset.cockpitMode = state.cockpitMode;
    refs.cockpit.dataset.hearthCompletionLatched = String(state.completionLatched);
    refs.cockpit.dataset.hearthVisibleContentProof = String(state.visibleContentProof);
    refs.cockpit.dataset.hearthVisiblePlanetAvailable = String(state.visiblePlanetAvailable);
    refs.cockpit.dataset.hearthDiagnosticCanLeavePlanetFrame = String(state.diagnosticCanLeavePlanetFrame);
    refs.cockpit.dataset.hearthActiveMatchQueueDrain = String(state.activeMatchQueueDrainActive);
    refs.cockpit.dataset.hearthLocalQueuedEventsCount = String(state.localQueuedEventsCount);
    refs.cockpit.dataset.hearthFirstFailedCoordinate = state.firstFailedCoordinate;
    refs.cockpit.dataset.hearthRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;

    publishStatusNode();
    publishGlobals();
  }

  function activeCheckpointLabel() {
    const checkpoint = getCheckpointById(state.activeCheckpointId);
    return checkpoint ? checkpoint.label : state.activeCheckpointId || "checkpoint pending";
  }

  function publishStatusNode() {
    if (!doc) return;

    const node =
      doc.getElementById(STATUS_ID) ||
      doc.querySelector("[data-hearth-route-status]");

    if (!node) return;

    node.textContent = [
      "Hearth route Runtime Table checkpoint-governor consumer active.",
      `Contract ${CONTRACT}`,
      `Receipt ${RECEIPT}`,
      `File ${COHERENCE_FILE}`,
      `Runtime Table present ${state.runtimeTablePresent}`,
      `Checkpoint session created ${state.checkpointSessionCreated}`,
      `Checkpoint governor fallback used ${state.checkpointGovernorFallbackUsed}`,
      `Active-match queue drain ${state.activeMatchQueueDrainActive}`,
      `Local queued events ${state.localQueuedEventsCount}`,
      `Chronological Fibonacci alignment ${state.chronologicalFibonacciAlignment}`,
      `NEWS Fibonacci alignment ${state.newsFibonacciAlignment}`,
      `One active checkpoint at a time ${state.oneActiveCheckpointAtATime}`,
      `Active checkpoint ${state.activeCheckpointId}`,
      `Highest completed checkpoint ${state.highestCompletedCheckpointId}`,
      `North gate ${state.northGateReady}`,
      `East gate ${state.eastGateReady}`,
      `West gate ${state.westGateReady}`,
      `South gate ${state.southGateReady}`,
      `NEWS passed before F21 ${state.newsGatePassedBeforeF21}`,
      `F13 subsequence complete ${state.f13SubsequenceComplete}`,
      `F21 allowed ${state.f21Allowed}`,
      `Completion latched ${state.completionLatched}`,
      `First failed coordinate ${state.firstFailedCoordinate}`,
      `Recommended next renewal target ${state.recommendedNextRenewalTarget}`,
      `Generated image false`,
      `GraphicBox false`,
      `WebGL false`,
      `Visual pass claimed false`,
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
      }, 1200);
    }

    ledgerPush({
      id: "CHECKPOINT_GOVERNOR_DIAGNOSTIC_COPIED",
      stage: state.currentStage,
      lane: "ledger",
      status: ok ? "COPIED" : "COPY_FAILED",
      message: ok ? "Checkpoint-governor diagnostic copied." : "Checkpoint-governor diagnostic copy failed."
    });

    return ok;
  }

  function getCheckpointSessionReceipt() {
    if (!state.checkpointSession || !isFunction(state.checkpointSession.getReceipt)) return null;

    try {
      const receipt = state.checkpointSession.getReceipt();
      updateFromCheckpointReceipt(receipt, { skipQueueDrain: true });
      return receipt;
    } catch (error) {
      state.checkpointSessionError = error && error.message ? error.message : String(error);
      recordError("CHECKPOINT_SESSION_RECEIPT_FAILED", state.checkpointSessionError);
      return null;
    }
  }

  function getReceipt() {
    if (state.completionLatched) {
      forcePostgameCoordinateFix();
    } else {
      evaluateInspectGate();
      evaluateNewsGates();
      deriveFailureCoordinate();
    }

    const checkpointReceipt = getCheckpointSessionReceipt();

    if (state.completionLatched) forcePostgameCoordinateFix();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: COHERENCE_FILE,
      route: ROUTE,
      role: state.role,

      pairedSemiconductor: true,
      pairedWith: INDEX_FILE,
      indexJsStartsProcess: true,
      hearthJsFinishesProcess: true,
      systematicAndSynchronized: true,
      synchronizedLoading: true,

      checkpointGovernorPresent: state.checkpointGovernorPresent,
      checkpointSessionCreated: state.checkpointSessionCreated,
      checkpointSessionConsumed: state.checkpointSessionConsumed,
      checkpointSessionReceiptAvailable: state.checkpointSessionReceiptAvailable,
      checkpointGovernorFallbackUsed: state.checkpointGovernorFallbackUsed,
      checkpointSessionError: state.checkpointSessionError,
      chronologicalFibonacciAlignment: true,
      newsFibonacciAlignment: true,
      oneActiveCheckpointAtATime: true,
      futureEventsQueued: true,
      completedEventsArchived: true,
      regressiveEventsBlocked: true,
      blockedProgressCap: 98,
      readyTextRequiresCompletionLatch: true,

      activeMatchQueueDrainActive: state.activeMatchQueueDrainActive,
      queuedActiveMatchReplayEnabled: state.queuedActiveMatchReplayEnabled,
      northCheckpointAuthorityPreserved: state.northCheckpointAuthorityPreserved,
      runtimeTableMutation: state.runtimeTableMutation,
      canvasMutation: state.canvasMutation,
      localQueuedEventsCount: state.localQueuedEventsCount,
      queueDrainInProgress: state.queueDrainInProgress,
      queueDrainPasses: state.queueDrainPasses,
      queueDrainReplayedCount: state.queueDrainReplayedCount,
      queueDrainHeldCount: state.queueDrainHeldCount,
      queueDrainArchivedCount: state.queueDrainArchivedCount,
      queueDrainBlockedCount: state.queueDrainBlockedCount,
      queueDrainLastReason: state.queueDrainLastReason,
      queueDrainLastActiveCheckpointId: state.queueDrainLastActiveCheckpointId,
      queueDrainLastReplayedCheckpointId: state.queueDrainLastReplayedCheckpointId,
      queueDrainLastAction: state.queueDrainLastAction,
      stuckAtQueuedActiveCheckpoint: state.stuckAtQueuedActiveCheckpoint,
      localQueuedCheckpointEvents: clonePlain(state.localQueuedCheckpointEvents),

      activeCheckpointId: state.activeCheckpointId,
      activeCheckpointRank: state.activeCheckpointRank,
      activeFibonacciStage: state.activeFibonacciStage,
      highestCompletedCheckpointId: state.highestCompletedCheckpointId,
      highestCompletedRank: state.highestCompletedRank,
      completedCheckpoints: state.completedCheckpoints.join(","),
      queuedEventsCount: state.queuedEventsCount,
      archivedEventsCount: state.archivedEventsCount,
      blockedEventsCount: state.blockedEventsCount,
      admittedEventsCount: state.admittedEventsCount,
      regressionPrevented: state.regressionPrevented,

      newsProtocolActive: true,
      northGateReady: state.northGateReady,
      eastGateReady: state.eastGateReady,
      westGateReady: state.westGateReady,
      southGateReady: state.southGateReady,
      newsGatePassedBeforeF21: state.newsGatePassedBeforeF21,

      fibonacciSequenceActive: true,
      f13SubsequenceComplete: state.f13SubsequenceComplete,
      f13LastRequiredEvent: state.f13LastRequiredEvent,
      f21Allowed: state.f21Allowed,
      f21AfterF13N: state.f21AfterF13N,
      completionLatched: state.completionLatched,

      visibleContentProof: state.visibleContentProof,
      visibleContentProofStarted: state.visibleContentProofStarted,
      visibleContentProofMethod: state.visibleContentProofMethod,
      visibleContentProofError: state.visibleContentProofError,
      visibleContentSampleCount: state.visibleContentSampleCount,
      visibleContentVarianceScore: state.visibleContentVarianceScore,
      visibleContentClassCount: state.visibleContentClassCount,
      visibleContentClasses: state.visibleContentClasses.join(","),
      visibleContentLandSampleCount: state.visibleContentLandSampleCount,
      visibleContentWaterSampleCount: state.visibleContentWaterSampleCount,
      visibleContentOtherSampleCount: state.visibleContentOtherSampleCount,
      carrierOnlyDetected: state.carrierOnlyDetected,
      explicitContentReceiptProof: state.explicitContentReceiptProof,
      renderedAfterTexture: state.renderedAfterTexture,

      visiblePlanetAvailable: state.visiblePlanetAvailable,
      planetCanvasPresent: state.planetCanvasPresent,
      planetCanvasNonZeroSize: state.planetCanvasNonZeroSize,
      planetFramePainted: state.planetFramePainted,
      nonblankPlanetVisible: state.nonblankPlanetVisible,
      planetNotObstructed: state.planetNotObstructed,

      inspectModeAvailable: state.inspectModeAvailable,
      inspectPlanetControlAvailable: state.inspectPlanetControlAvailable,
      diagnosticCanLeavePlanetFrame: state.diagnosticCanLeavePlanetFrame,
      diagnosticDockHiddenForInspection: state.diagnosticDockHiddenForInspection,
      showDiagnosticTabVisible: state.showDiagnosticTabVisible,
      showDiagnosticTabVisibleWhenHidden: state.showDiagnosticTabVisibleWhenHidden,
      diagnosticDockRestorable: state.diagnosticDockRestorable,
      copyDiagnosticPreserved: state.copyDiagnosticPreserved,
      receiptToggleReady: state.receiptToggleReady,
      buttonsReachable: state.buttonsReachable,
      receiptOverlayIndependent: state.receiptOverlayIndependent,

      canvasReady: state.canvasReady,
      canvasCarrierMounted: state.canvasCarrierMounted,
      canvasCarrierRequested: state.canvasCarrierRequested,
      canvasCarrierHandoffOk: state.canvasCarrierHandoffOk,
      canvasCarrierHandoffError: state.canvasCarrierHandoffError,
      canvasCarrierMethod: state.canvasCarrierMethod,
      cooperativeBootAvailable: state.cooperativeBootAvailable,
      cooperativeBootUsed: state.cooperativeBootUsed,
      syncBootFallbackUsed: state.syncBootFallbackUsed,
      canvasBootStartedAt: state.canvasBootStartedAt,
      canvasBootCompletedAt: state.canvasBootCompletedAt,
      canvasBootElapsedMs: state.canvasBootElapsedMs,
      canvasYieldCount: state.canvasYieldCount,
      canvasPhaseCount: state.canvasPhaseCount,
      lastCanvasPhase: state.lastCanvasPhase,
      lastCanvasProgress: state.lastCanvasProgress,
      loaderRepaintDuringCanvasBoot: state.loaderRepaintDuringCanvasBoot,
      f13ProgressStreamActive: state.f13ProgressStreamActive,
      canvasLaneClosed: state.canvasLaneClosed,
      postCanvasPhaseBouncePrevented: state.postCanvasPhaseBouncePrevented,
      ignoredDuplicateCanvasEvents: state.ignoredDuplicateCanvasEvents,

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

      runtimeTablePresent: state.runtimeTablePresent,
      runtimeTableMode: state.runtimeTableMode,
      runtimeTablePlanAttempted: state.runtimeTablePlanAttempted,
      runtimeTablePlanCreated: state.runtimeTablePlanCreated,
      runtimeTablePlanError: state.runtimeTablePlanError,
      sourceAuthorityHeld: true,

      currentStage: state.currentStage,
      highestStage: state.highestStage,
      visibleLoadingActive: state.visibleLoadingActive,
      diagnosticCockpitReady: state.diagnosticCockpitReady,
      cockpitMode: state.cockpitMode,
      dockVisible: state.dockVisible,
      fullCockpitExpanded: state.fullCockpitExpanded,

      partialReceiptAvailable: state.partialReceiptAvailable,
      finalReceiptAvailable: state.finalReceiptAvailable,
      copyDiagnosticArmed: state.copyDiagnosticArmed,

      postgameStatus: state.postgameStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      latestVisibleEvent: state.latestVisibleEvent,
      mainDisplayProgress: state.mainDisplayProgress,
      mainProgressCap: state.mainProgressCap,
      heartbeatElapsedMs: state.heartbeatElapsedMs,

      checkpointSessionReceipt: checkpointReceipt ? clonePlain(checkpointReceipt) : null,
      checkpointSequence: FIBONACCI_CHECKPOINTS.map(clonePlain),
      phaseEvents: clonePlain(state.phaseEvents),
      progressOnlyEvents: clonePlain(state.progressOnlyEvents),
      archivedLateEvents: clonePlain(state.archivedLateEvents),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),
      sourceStackHeld: SOURCE_STACK_HELD.slice(),

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function getReceiptText() {
    const receipt = getReceipt();

    const sequenceText = receipt.checkpointSequence.map((checkpoint) => {
      const complete = state.completedCheckpoints.includes(checkpoint.id);
      const queuedLocal = state.localQueuedCheckpointEvents.some((packet) => packet.checkpointId === checkpoint.id);
      const status = complete ? "COMPLETE" : state.activeCheckpointId === checkpoint.id ? "ACTIVE" : queuedLocal ? "QUEUED_LOCAL" : "PENDING";

      return `- ${checkpoint.id}: rank=${checkpoint.rank}; fibonacci=${checkpoint.fibonacci}; status=${status}; complete=${complete}; progress=${checkpoint.progress}; event=${checkpoint.event}`;
    }).join("\n");

    const localQueueText = receipt.localQueuedCheckpointEvents.map((packet) => (
      `- ${packet.queuedAt || ""} :: ${packet.checkpointId} :: event=${packet.eventName}; rank=${packet.checkpointRank}; replayCount=${packet.replayCount}; lastAction=${packet.lastAction}; reason=${packet.reason}`
    )).join("\n") || "- none";

    const phaseText = receipt.phaseEvents.map((event) => (
      `- ${event.at || ""} :: ${event.phase || ""} :: progress=${event.percent || ""} :: ${event.message || ""}`
    )).join("\n") || "- none";

    const progressOnlyText = receipt.progressOnlyEvents.map((event) => (
      `- ${event.at || ""} :: ${event.phase || ""} :: progress=${event.percent || ""} :: ${event.message || ""}`
    )).join("\n") || "- none";

    const archivedText = receipt.archivedLateEvents.map((event) => (
      `- ${event.at || ""} :: ${event.event || ""} :: stage=${event.stage || ""} :: reason=${event.reason || ""} :: ${event.message || ""}`
    )).join("\n") || "- none";

    const localText = receipt.localEvents.map((event) => (
      `- ${event.at || ""} :: ${event.event || ""} :: action=${event.detail && event.detail.action ? event.detail.action : ""} :: ${event.detail && event.detail.reason ? event.detail.reason : ""}`
    )).join("\n") || "- none";

    const errorsText = receipt.errors.map((error) => (
      `- ${error.at || ""} :: ${error.code || ""} :: ${error.message || ""}`
    )).join("\n") || "- none";

    const sourceStackText = receipt.sourceStackHeld.map((item) => `- ${item}`).join("\n");

    return [
      "HEARTH_ROUTE_CONSUMER_ACTIVE_MATCH_QUEUE_DRAIN_RECEIPT",
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
      `checkpointGovernorPresent=${receipt.checkpointGovernorPresent}`,
      `checkpointSessionCreated=${receipt.checkpointSessionCreated}`,
      `checkpointSessionConsumed=${receipt.checkpointSessionConsumed}`,
      `checkpointSessionReceiptAvailable=${receipt.checkpointSessionReceiptAvailable}`,
      `checkpointGovernorFallbackUsed=${receipt.checkpointGovernorFallbackUsed}`,
      `checkpointSessionError=${receipt.checkpointSessionError}`,
      `chronologicalFibonacciAlignment=${receipt.chronologicalFibonacciAlignment}`,
      `newsFibonacciAlignment=${receipt.newsFibonacciAlignment}`,
      `oneActiveCheckpointAtATime=${receipt.oneActiveCheckpointAtATime}`,
      `futureEventsQueued=${receipt.futureEventsQueued}`,
      `completedEventsArchived=${receipt.completedEventsArchived}`,
      `regressiveEventsBlocked=${receipt.regressiveEventsBlocked}`,
      `blockedProgressCap=${receipt.blockedProgressCap}`,
      `readyTextRequiresCompletionLatch=${receipt.readyTextRequiresCompletionLatch}`,
      "",
      `activeMatchQueueDrainActive=${receipt.activeMatchQueueDrainActive}`,
      `queuedActiveMatchReplayEnabled=${receipt.queuedActiveMatchReplayEnabled}`,
      `northCheckpointAuthorityPreserved=${receipt.northCheckpointAuthorityPreserved}`,
      `runtimeTableMutation=${receipt.runtimeTableMutation}`,
      `canvasMutation=${receipt.canvasMutation}`,
      `localQueuedEventsCount=${receipt.localQueuedEventsCount}`,
      `queueDrainInProgress=${receipt.queueDrainInProgress}`,
      `queueDrainPasses=${receipt.queueDrainPasses}`,
      `queueDrainReplayedCount=${receipt.queueDrainReplayedCount}`,
      `queueDrainHeldCount=${receipt.queueDrainHeldCount}`,
      `queueDrainArchivedCount=${receipt.queueDrainArchivedCount}`,
      `queueDrainBlockedCount=${receipt.queueDrainBlockedCount}`,
      `queueDrainLastReason=${receipt.queueDrainLastReason}`,
      `queueDrainLastActiveCheckpointId=${receipt.queueDrainLastActiveCheckpointId}`,
      `queueDrainLastReplayedCheckpointId=${receipt.queueDrainLastReplayedCheckpointId}`,
      `queueDrainLastAction=${receipt.queueDrainLastAction}`,
      `stuckAtQueuedActiveCheckpoint=${receipt.stuckAtQueuedActiveCheckpoint}`,
      "",
      `activeCheckpointId=${receipt.activeCheckpointId}`,
      `activeCheckpointRank=${receipt.activeCheckpointRank}`,
      `activeFibonacciStage=${receipt.activeFibonacciStage}`,
      `highestCompletedCheckpointId=${receipt.highestCompletedCheckpointId}`,
      `highestCompletedRank=${receipt.highestCompletedRank}`,
      `completedCheckpoints=${receipt.completedCheckpoints}`,
      `queuedEventsCount=${receipt.queuedEventsCount}`,
      `archivedEventsCount=${receipt.archivedEventsCount}`,
      `blockedEventsCount=${receipt.blockedEventsCount}`,
      `admittedEventsCount=${receipt.admittedEventsCount}`,
      `regressionPrevented=${receipt.regressionPrevented}`,
      "",
      `newsProtocolActive=${receipt.newsProtocolActive}`,
      `northGateReady=${receipt.northGateReady}`,
      `eastGateReady=${receipt.eastGateReady}`,
      `westGateReady=${receipt.westGateReady}`,
      `southGateReady=${receipt.southGateReady}`,
      `newsGatePassedBeforeF21=${receipt.newsGatePassedBeforeF21}`,
      "",
      `fibonacciSequenceActive=${receipt.fibonacciSequenceActive}`,
      `f13SubsequenceComplete=${receipt.f13SubsequenceComplete}`,
      `f13LastRequiredEvent=${receipt.f13LastRequiredEvent}`,
      `f21Allowed=${receipt.f21Allowed}`,
      `f21AfterF13N=${receipt.f21AfterF13N}`,
      `completionLatched=${receipt.completionLatched}`,
      "",
      `visibleContentProof=${receipt.visibleContentProof}`,
      `visibleContentProofStarted=${receipt.visibleContentProofStarted}`,
      `visibleContentProofMethod=${receipt.visibleContentProofMethod}`,
      `visibleContentProofError=${receipt.visibleContentProofError}`,
      `visibleContentSampleCount=${receipt.visibleContentSampleCount}`,
      `visibleContentVarianceScore=${receipt.visibleContentVarianceScore}`,
      `visibleContentClassCount=${receipt.visibleContentClassCount}`,
      `visibleContentClasses=${receipt.visibleContentClasses}`,
      `visibleContentLandSampleCount=${receipt.visibleContentLandSampleCount}`,
      `visibleContentWaterSampleCount=${receipt.visibleContentWaterSampleCount}`,
      `visibleContentOtherSampleCount=${receipt.visibleContentOtherSampleCount}`,
      `carrierOnlyDetected=${receipt.carrierOnlyDetected}`,
      `explicitContentReceiptProof=${receipt.explicitContentReceiptProof}`,
      `renderedAfterTexture=${receipt.renderedAfterTexture}`,
      "",
      `visiblePlanetAvailable=${receipt.visiblePlanetAvailable}`,
      `planetCanvasPresent=${receipt.planetCanvasPresent}`,
      `planetCanvasNonZeroSize=${receipt.planetCanvasNonZeroSize}`,
      `planetFramePainted=${receipt.planetFramePainted}`,
      `nonblankPlanetVisible=${receipt.nonblankPlanetVisible}`,
      `planetNotObstructed=${receipt.planetNotObstructed}`,
      "",
      `inspectModeAvailable=${receipt.inspectModeAvailable}`,
      `inspectPlanetControlAvailable=${receipt.inspectPlanetControlAvailable}`,
      `diagnosticCanLeavePlanetFrame=${receipt.diagnosticCanLeavePlanetFrame}`,
      `diagnosticDockHiddenForInspection=${receipt.diagnosticDockHiddenForInspection}`,
      `showDiagnosticTabVisible=${receipt.showDiagnosticTabVisible}`,
      `showDiagnosticTabVisibleWhenHidden=${receipt.showDiagnosticTabVisibleWhenHidden}`,
      `diagnosticDockRestorable=${receipt.diagnosticDockRestorable}`,
      `copyDiagnosticPreserved=${receipt.copyDiagnosticPreserved}`,
      `receiptToggleReady=${receipt.receiptToggleReady}`,
      `buttonsReachable=${receipt.buttonsReachable}`,
      `receiptOverlayIndependent=${receipt.receiptOverlayIndependent}`,
      "",
      `canvasReady=${receipt.canvasReady}`,
      `canvasCarrierMounted=${receipt.canvasCarrierMounted}`,
      `canvasCarrierRequested=${receipt.canvasCarrierRequested}`,
      `canvasCarrierHandoffOk=${receipt.canvasCarrierHandoffOk}`,
      `canvasCarrierHandoffError=${receipt.canvasCarrierHandoffError}`,
      `canvasCarrierMethod=${receipt.canvasCarrierMethod}`,
      `cooperativeBootAvailable=${receipt.cooperativeBootAvailable}`,
      `cooperativeBootUsed=${receipt.cooperativeBootUsed}`,
      `syncBootFallbackUsed=${receipt.syncBootFallbackUsed}`,
      `canvasBootStartedAt=${receipt.canvasBootStartedAt}`,
      `canvasBootCompletedAt=${receipt.canvasBootCompletedAt}`,
      `canvasBootElapsedMs=${receipt.canvasBootElapsedMs}`,
      `canvasYieldCount=${receipt.canvasYieldCount}`,
      `canvasPhaseCount=${receipt.canvasPhaseCount}`,
      `lastCanvasPhase=${receipt.lastCanvasPhase}`,
      `lastCanvasProgress=${receipt.lastCanvasProgress}`,
      `loaderRepaintDuringCanvasBoot=${receipt.loaderRepaintDuringCanvasBoot}`,
      `f13ProgressStreamActive=${receipt.f13ProgressStreamActive}`,
      `canvasLaneClosed=${receipt.canvasLaneClosed}`,
      `postCanvasPhaseBouncePrevented=${receipt.postCanvasPhaseBouncePrevented}`,
      `ignoredDuplicateCanvasEvents=${receipt.ignoredDuplicateCanvasEvents}`,
      "",
      `atlasBuildStarted=${receipt.atlasBuildStarted}`,
      `atlasBuildProgress=${receipt.atlasBuildProgress}`,
      `atlasBuildComplete=${receipt.atlasBuildComplete}`,
      `textureComposeStarted=${receipt.textureComposeStarted}`,
      `textureComposeProgress=${receipt.textureComposeProgress}`,
      `textureComposeComplete=${receipt.textureComposeComplete}`,
      `firstFrameRequested=${receipt.firstFrameRequested}`,
      `firstFrameDetected=${receipt.firstFrameDetected}`,
      `imageRendered=${receipt.imageRendered}`,
      `dragInspectionBound=${receipt.dragInspectionBound}`,
      "",
      `runtimeTablePresent=${receipt.runtimeTablePresent}`,
      `runtimeTableMode=${receipt.runtimeTableMode}`,
      `runtimeTablePlanAttempted=${receipt.runtimeTablePlanAttempted}`,
      `runtimeTablePlanCreated=${receipt.runtimeTablePlanCreated}`,
      `runtimeTablePlanError=${receipt.runtimeTablePlanError}`,
      `sourceAuthorityHeld=${receipt.sourceAuthorityHeld}`,
      "",
      `currentStage=${receipt.currentStage}`,
      `highestStage=${receipt.highestStage}`,
      `visibleLoadingActive=${receipt.visibleLoadingActive}`,
      `diagnosticCockpitReady=${receipt.diagnosticCockpitReady}`,
      `cockpitMode=${receipt.cockpitMode}`,
      `dockVisible=${receipt.dockVisible}`,
      `fullCockpitExpanded=${receipt.fullCockpitExpanded}`,
      "",
      `partialReceiptAvailable=${receipt.partialReceiptAvailable}`,
      `finalReceiptAvailable=${receipt.finalReceiptAvailable}`,
      `copyDiagnosticArmed=${receipt.copyDiagnosticArmed}`,
      "",
      `postgameStatus=${receipt.postgameStatus}`,
      `firstFailedCoordinate=${receipt.firstFailedCoordinate}`,
      `recommendedNextRenewalTarget=${receipt.recommendedNextRenewalTarget}`,
      `latestVisibleEvent=${receipt.latestVisibleEvent}`,
      `mainDisplayProgress=${receipt.mainDisplayProgress}`,
      `mainProgressCap=${receipt.mainProgressCap}`,
      `heartbeatElapsedMs=${receipt.heartbeatElapsedMs}`,
      "",
      "CHECKPOINT_SEQUENCE",
      sequenceText,
      "",
      "LOCAL_QUEUED_CHECKPOINT_EVENTS",
      localQueueText,
      "",
      "CANVAS_PHASE_EVENTS",
      phaseText,
      "",
      "PROGRESS_ONLY_EVENTS",
      progressOnlyText,
      "",
      "ARCHIVED_LATE_EVENTS",
      archivedText,
      "",
      "LOCAL_EVENTS",
      localText,
      "",
      "ERRORS",
      errorsText,
      "",
      "SOURCE_STACK_HELD",
      sourceStackText,
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
    root.HEARTH.coherenceSemiconductor = api;

    root.HEARTH_ROUTE_CONDUCTOR = api;
    root.HearthRouteConductor = api;
    root.HEARTH_ACTIVE_ROUTE = api;
    root.HEARTH_ROUTE_COHERENCE_SEMICONDUCTOR = api;
    root.HEARTH_ROUTE_RUNTIME_TABLE_CHECKPOINT_GOVERNOR_CONSUMER = api;
    root.HEARTH_ROUTE_CONSUMER_ACTIVE_MATCH_QUEUE_DRAIN = api;
    root.HEARTH_ROUTE_CONDUCTOR_CONTRACT = CONTRACT;

    root.__HEARTH_ACTIVE_ROUTE_FILE__ = COHERENCE_FILE;
    root.__HEARTH_ACTIVE_ROUTE_CONDUCTOR__ = COHERENCE_FILE;
    root.__HEARTH_ACTIVE_ROUTE_CONTRACT__ = CONTRACT;
    root.__HEARTH_CONSTRAINT_SEMICONDUCTOR_FILE__ = INDEX_FILE;
    root.__HEARTH_COHERENCE_SEMICONDUCTOR_FILE__ = COHERENCE_FILE;
    root.__HEARTH_RETIRED_CLIMATE_ROUTE__ = RETIRED_CLIMATE_FILE;
    root.__HEARTH_RETIRED_CLIMATE_ROUTE_ACTIVE_CARRIER__ = false;

    const receipt = getReceiptLight();

    root.HEARTH_ROUTE_COHERENCE_SEMICONDUCTOR_RECEIPT = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_RECEIPT = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_POSTGAME_RECEIPT = receipt;
    root.HEARTH_ROUTE_ACTIVE_MATCH_QUEUE_DRAIN_RECEIPT = receipt;

    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthCoherenceSemiconductorLoaded = "true";
    dataset.hearthCoherenceSemiconductorContract = CONTRACT;
    dataset.hearthCoherenceSemiconductorReceipt = RECEIPT;
    dataset.hearthRuntimeTableCheckpointGovernorConsumer = "true";
    dataset.hearthActiveMatchQueueDrain = String(state.activeMatchQueueDrainActive);
    dataset.hearthQueuedActiveMatchReplayEnabled = String(state.queuedActiveMatchReplayEnabled);
    dataset.hearthNorthCheckpointAuthorityPreserved = String(state.northCheckpointAuthorityPreserved);
    dataset.hearthRuntimeTableMutation = String(state.runtimeTableMutation);
    dataset.hearthCanvasMutation = String(state.canvasMutation);
    dataset.hearthLocalQueuedEventsCount = String(state.localQueuedEventsCount);
    dataset.hearthQueueDrainReplayedCount = String(state.queueDrainReplayedCount);
    dataset.hearthStuckAtQueuedActiveCheckpoint = String(state.stuckAtQueuedActiveCheckpoint);

    dataset.hearthPairedSemiconductor = "true";
    dataset.hearthConstraintSemiconductor = INDEX_FILE;
    dataset.hearthCoherenceSemiconductor = COHERENCE_FILE;
    dataset.hearthSynchronizedLoading = "true";
    dataset.hearthActiveRouteFile = COHERENCE_FILE;
    dataset.hearthActiveRouteContract = CONTRACT;

    dataset.hearthCheckpointGovernorPresent = String(state.checkpointGovernorPresent);
    dataset.hearthCheckpointSessionCreated = String(state.checkpointSessionCreated);
    dataset.hearthChronologicalFibonacciAlignment = "true";
    dataset.hearthNewsFibonacciAlignment = "true";
    dataset.hearthOneActiveCheckpointAtATime = "true";
    dataset.hearthActiveCheckpointId = state.activeCheckpointId;
    dataset.hearthHighestCompletedCheckpointId = state.highestCompletedCheckpointId;

    dataset.hearthNewsProtocolActive = "true";
    dataset.hearthNorthGateReady = String(state.northGateReady);
    dataset.hearthEastGateReady = String(state.eastGateReady);
    dataset.hearthWestGateReady = String(state.westGateReady);
    dataset.hearthSouthGateReady = String(state.southGateReady);
    dataset.hearthNewsGatePassedBeforeF21 = String(state.newsGatePassedBeforeF21);

    dataset.hearthF13SubsequenceComplete = String(state.f13SubsequenceComplete);
    dataset.hearthF13LastRequiredEvent = state.f13LastRequiredEvent;
    dataset.hearthF21Allowed = String(state.f21Allowed);
    dataset.hearthF21AfterF13N = String(state.f21AfterF13N);
    dataset.hearthCompletionLatched = String(state.completionLatched);

    dataset.hearthVisibleContentProof = String(state.visibleContentProof);
    dataset.hearthVisibleContentProofMethod = state.visibleContentProofMethod;
    dataset.hearthVisiblePlanetAvailable = String(state.visiblePlanetAvailable);
    dataset.hearthPlanetCanvasPresent = String(state.planetCanvasPresent);
    dataset.hearthPlanetCanvasNonZeroSize = String(state.planetCanvasNonZeroSize);
    dataset.hearthPlanetFramePainted = String(state.planetFramePainted);
    dataset.hearthNonblankPlanetVisible = String(state.nonblankPlanetVisible);

    dataset.hearthInspectModeAvailable = String(state.inspectModeAvailable);
    dataset.hearthInspectPlanetControlAvailable = String(state.inspectPlanetControlAvailable);
    dataset.hearthDiagnosticCanLeavePlanetFrame = String(state.diagnosticCanLeavePlanetFrame);
    dataset.hearthDiagnosticDockHiddenForInspection = String(state.diagnosticDockHiddenForInspection);
    dataset.hearthShowDiagnosticTabVisible = String(state.showDiagnosticTabVisible);
    dataset.hearthShowDiagnosticTabVisibleWhenHidden = String(state.showDiagnosticTabVisibleWhenHidden);
    dataset.hearthDiagnosticDockRestorable = String(state.diagnosticDockRestorable);
    dataset.hearthCopyDiagnosticPreserved = String(state.copyDiagnosticPreserved);
    dataset.hearthReceiptToggleReady = String(state.receiptToggleReady);
    dataset.hearthButtonsReachable = String(state.buttonsReachable);

    dataset.hearthCanvasReady = String(state.canvasReady);
    dataset.hearthCanvasCarrierMounted = String(state.canvasCarrierMounted);
    dataset.hearthFirstFrameDetected = String(state.firstFrameDetected);
    dataset.hearthImageRendered = String(state.imageRendered);
    dataset.hearthDragInspectionBound = String(state.dragInspectionBound);

    dataset.hearthVisibleLoadingActive = String(state.visibleLoadingActive);
    dataset.hearthDiagnosticCockpitReady = String(state.diagnosticCockpitReady);
    dataset.hearthCockpitMode = state.cockpitMode;
    dataset.hearthPostgameStatus = state.postgameStatus;
    dataset.hearthFirstFailedCoordinate = state.firstFailedCoordinate;
    dataset.hearthRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;

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
      file: COHERENCE_FILE,
      route: ROUTE,
      checkpointGovernorPresent: state.checkpointGovernorPresent,
      checkpointSessionCreated: state.checkpointSessionCreated,
      checkpointSessionConsumed: state.checkpointSessionConsumed,
      chronologicalFibonacciAlignment: true,
      newsFibonacciAlignment: true,
      oneActiveCheckpointAtATime: true,

      activeMatchQueueDrainActive: state.activeMatchQueueDrainActive,
      queuedActiveMatchReplayEnabled: state.queuedActiveMatchReplayEnabled,
      northCheckpointAuthorityPreserved: state.northCheckpointAuthorityPreserved,
      runtimeTableMutation: state.runtimeTableMutation,
      canvasMutation: state.canvasMutation,
      localQueuedEventsCount: state.localQueuedEventsCount,
      queueDrainReplayedCount: state.queueDrainReplayedCount,
      queueDrainLastAction: state.queueDrainLastAction,
      stuckAtQueuedActiveCheckpoint: state.stuckAtQueuedActiveCheckpoint,

      activeCheckpointId: state.activeCheckpointId,
      highestCompletedCheckpointId: state.highestCompletedCheckpointId,
      newsGatePassedBeforeF21: state.newsGatePassedBeforeF21,
      f13SubsequenceComplete: state.f13SubsequenceComplete,
      f13LastRequiredEvent: state.f13LastRequiredEvent,
      f21Allowed: state.f21Allowed,
      f21AfterF13N: state.f21AfterF13N,
      completionLatched: state.completionLatched,
      visibleContentProof: state.visibleContentProof,
      visiblePlanetAvailable: state.visiblePlanetAvailable,
      diagnosticCanLeavePlanetFrame: state.diagnosticCanLeavePlanetFrame,
      postgameStatus: state.postgameStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      mainDisplayProgress: state.mainDisplayProgress,
      mainProgressCap: state.mainProgressCap,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
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
  }

  function startHeartbeat() {
    if (heartbeatTimer) root.clearInterval(heartbeatTimer);

    heartbeatTimer = root.setInterval(() => {
      state.heartbeatElapsedMs = state.startedAtMs ? nowMs() - state.startedAtMs : 0;

      if (!state.completionLatched) {
        reconcileAll("heartbeat");
        drainActiveMatchQueue("heartbeat");
      } else {
        forcePostgameCoordinateFix();
        publishGlobals();
        scheduleRender();
      }
    }, 1000);
  }

  function startReconcileLoop() {
    if (reconcileTimer) root.clearInterval(reconcileTimer);

    reconcileTimer = root.setInterval(() => {
      if (!state.completionLatched) {
        reconcileAll("interval");
        drainActiveMatchQueue("interval");
      } else {
        forcePostgameCoordinateFix();
      }
    }, 1200);
  }

  function boot() {
    if (bootStarted) {
      publishGlobals();
      return getReceipt();
    }

    bootStarted = true;
    state.startedAt = nowIso();
    state.startedAtMs = nowMs();
    state.updatedAt = state.startedAt;

    retireClimateRoute();
    ensureLedger();
    ensureMount();
    hydrateCockpit();
    checkRuntimeTable();
    createCheckpointSession();

    submitCheckpoint("HTML_SHELL_RENDERED");
    submitCheckpoint("LOAD_LEDGER_INITIALIZED");
    submitCheckpoint("FIRST_PAINT_COCKPIT_VISIBLE");
    submitCheckpoint("SCRIPT_ORDER_COMPLETE");
    submitCheckpoint("AUTHORITY_AVAILABILITY_READY");
    submitCheckpoint("CONDUCTOR_HYDRATED");

    drainActiveMatchQueue("boot-initial-checkpoint-burst");

    publishGlobals();
    render();

    root.setTimeout(callCanvasCarrier, 80);
    root.setTimeout(() => reconcileAll("post-boot-220ms"), 220);
    root.setTimeout(() => reconcileAll("post-boot-900ms"), 900);
    root.setTimeout(() => reconcileAll("post-boot-1800ms"), 1800);
    root.setTimeout(() => reconcileAll("post-boot-3600ms"), 3600);

    startHeartbeat();
    startReconcileLoop();

    return getReceipt();
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

    ledgerPush({
      id: "HEARTH_ROUTE_V6_DISPOSED",
      stage: state.currentStage,
      lane: "conductorHydration",
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
    route: ROUTE,
    file: COHERENCE_FILE,
    role: "coherence-side-semiconductor",

    boot,
    start: boot,
    init: boot,
    run: boot,
    dispose,

    handleCanvasPhase,
    handleCanvasReceipt,
    reconcile: reconcileAll,
    tryFinalize: maybeFinalize,
    setCockpitMode,
    proveVisibleContent,
    drainActiveMatchQueue,
    getReceipt,
    getReceiptText,
    copyDiagnostic,

    supportsRuntimeTableCheckpointGovernor: true,
    supportsCheckpointSessionConsumption: true,
    supportsChronologicalFibonacciAlignment: true,
    supportsNewsFibonacciAlignment: true,
    supportsOneActiveCheckpointAtATime: true,
    supportsActiveMatchQueueDrain: true,
    supportsPostgameCoordinateFix: true,
    supportsVisibleContentCompletionGate: true,
    supportsInspectModeCompletionGate: true,
    supportsDiagnosticDockRestore: true,
    supportsCopyDiagnosticPreservation: true,
    supportsShowReceiptPreservation: true,
    supportsCooperativeCanvasHandoff: true,

    ownsFirstPaintSurvival: false,
    ownsCanvasDrawing: false,
    ownsAtlasGeneration: false,
    ownsTextureGeneration: false,
    ownsRuntimeTableImplementation: false,
    ownsRuntimeTableMutation: false,
    ownsCanvasMutation: false,
    ownsSourceStackTruth: false,
    ownsHtmlStructure: false,
    ownsClimateRouteRendering: false,
    ownsFinalVisualPassClaim: false,

    northCheckpointAuthorityPreserved: true,
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

  publishGlobals();

  if (doc && doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", () => {
      boot();
    }, { once: true });
  } else {
    boot();
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

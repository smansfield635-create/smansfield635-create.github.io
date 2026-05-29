// /showroom/globe/hearth/hearth.js
// HEARTH_ROUTE_COHERENCE_SEMICONDUCTOR_VISIBLE_CONTENT_PROOF_LATCH_TNT_v3
// Full-file replacement.
// Coherence-side semiconductor only.
// Purpose:
// - Finish the Hearth visible process started by /showroom/globe/hearth/index.js.
// - Hydrate the shared paired-semiconductor ledger.
// - Preserve systematic chronological Fibonacci alignment.
// - Consume cooperative canvas phase events without allowing post-ready bounce.
// - Treat CANVAS_READY as necessary but not sufficient for F21 completion.
// - Prevent infinite visible-content proof recursion.
// - If canvas carrier is ready but Hearth content is not visible, settle into a stable diagnostic dock instead of freezing.
// - Preserve Copy diagnostic / Show receipt / Inspect planet / Show diagnostic restoration.
// Does not own:
// - first-paint survival from blank page
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

  const CONTRACT = "HEARTH_ROUTE_COHERENCE_SEMICONDUCTOR_VISIBLE_CONTENT_PROOF_LATCH_TNT_v3";
  const RECEIPT = "HEARTH_ROUTE_COHERENCE_SEMICONDUCTOR_VISIBLE_CONTENT_PROOF_LATCH_RECEIPT_v3";
  const PREVIOUS_CONTRACT = "HEARTH_ROUTE_COHERENCE_SEMICONDUCTOR_VISIBLE_CONTENT_PROOF_LATCH_TNT_v2";
  const BASELINE_CONTRACT = "HEARTH_ROUTE_COHERENCE_SEMICONDUCTOR_VISIBLE_CONTENT_PROOF_LATCH_PRECODE_FINAL_DRAFT_v3";
  const VERSION = "2026-05-29.hearth-route-coherence-semiconductor-visible-content-proof-latch-v3";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const ROUTE = "/showroom/globe/hearth/";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const COHERENCE_FILE = "/showroom/globe/hearth/hearth.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const RETIRED_CLIMATE_FILE = "/showroom/globe/hearth/hearth.climate.route.js";

  const MOUNT_ID = "hearthCanvasMount";
  const COCKPIT_ID = "hearthLoadCockpit";
  const STATUS_ID = "hearth-route-status";

  const FIB = Object.freeze({
    F1A: { rank: 1, value: 1, label: "HTML shell rendered", progress: 6 },
    F1B: { rank: 2, value: 1, label: "Load ledger initialized", progress: 12 },
    F2: { rank: 3, value: 2, label: "First-paint cockpit visible", progress: 22 },
    F3: { rank: 4, value: 3, label: "Script order visible", progress: 36 },
    F5: { rank: 5, value: 5, label: "Authority availability", progress: 55 },
    F8: { rank: 6, value: 8, label: "Coherence semiconductor hydrated", progress: 72 },
    F13: { rank: 7, value: 13, label: "Canvas and visible content proof", progress: 78 },
    F21: { rank: 8, value: 21, label: "Completion latch", progress: 100 }
  });

  const LANES = Object.freeze([
    { key: "shell", label: "Shell", fibonacci: "F1A" },
    { key: "ledger", label: "Ledger", fibonacci: "F1B" },
    { key: "staticCockpit", label: "First-paint cockpit", fibonacci: "F2" },
    { key: "scriptOrder", label: "Script order", fibonacci: "F3" },
    { key: "authorityAvailability", label: "Authority availability", fibonacci: "F5" },
    { key: "conductorHydration", label: "Conductor hydration", fibonacci: "F8" },
    { key: "canvasAndDiagnostic", label: "Canvas and diagnostic", fibonacci: "F13" },
    { key: "visiblePlanetProof", label: "Visible content proof", fibonacci: "F13" },
    { key: "inspectMode", label: "Inspect mode", fibonacci: "F13" },
    { key: "completionLatch", label: "Completion latch", fibonacci: "F21" }
  ]);

  const F13_REQUIRED = Object.freeze([
    "CANVAS_COOPERATIVE_BOOT_STARTED",
    "CANVAS_MOUNT_CREATED",
    "CANVAS_CONTEXT_READY",
    "ATLAS_BUILD_STARTED",
    "ATLAS_BUILD_COMPLETE",
    "TEXTURE_COMPOSE_STARTED",
    "TEXTURE_COMPOSE_COMPLETE",
    "FIRST_FRAME_REQUESTED",
    "FIRST_FRAME_DETECTED",
    "DRAG_INSPECTION_BOUND",
    "CANVAS_READY",
    "VISIBLE_CONTENT_PROOF_STARTED",
    "INSPECT_MODE_READY"
  ]);

  const EXPLICIT_CONTENT_FLAGS = Object.freeze([
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
    "landWaterTexturePainted",
    "terrainPainted",
    "landPainted",
    "waterPainted",
    "textureVisible",
    "nonCarrierContentVisible"
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
    chronologicalFibonacciAlignment: true,

    sharedLedgerHydrated: false,
    indexConstraintAccepted: false,
    indexConstraintPresent: false,

    newsProtocolActive: true,
    northGateReady: false,
    eastGateReady: false,
    westGateReady: false,
    southGateReady: false,
    newsGatePassedBeforeF21: false,

    fibonacciSequenceActive: true,
    fibonacciStageAtCanvasReady: "",
    fibonacciStageAtVisibleContentProof: "",
    fibonacciStageAtCompletionLatch: "",
    f13SubsequenceComplete: false,
    f13LastRequiredEvent: "",
    f21AfterF13M: false,

    strictCanvasReadyLatchActive: true,
    visibleContentLatchActive: true,
    canvasReadinessBarrierOpen: false,
    visibleContentBarrierOpen: false,
    prematureLatchPrevented: false,
    falseReadyPrevented: false,
    completionBlockedUntilVisibleContent: true,
    completionReceiptRequiresVisiblePlanet: true,
    completionReceiptRequiresVisibleContent: true,
    completionReceiptRequiresInspectMode: true,
    completionLatchedAfterCanvasReady: false,
    completionLatchedAfterVisibleContent: false,
    completionLatchedAfterInspectModeReady: false,

    stageRegressionPrevented: 0,
    ignoredDuplicateCanvasEvents: 0,

    currentStage: "F8",
    highestStage: "F8",
    completionLatched: false,
    visibleLoadingActive: true,
    diagnosticCockpitReady: false,
    stableDiagnosticDockAfterCanvasReady: false,
    postgameStatus: "COHERENCE_SEMICONDUCTOR_HYDRATING",
    firstFailedCoordinate: "F8_COHERENCE_HYDRATION",
    recommendedNextRenewalTarget: "await-visible-content-proof",
    latestVisibleEvent: "COHERENCE_SEMICONDUCTOR_LOADED",

    cockpitMode: "loading-cockpit",
    priorDiagnosticMode: "diagnostic-dock",
    dockVisible: true,
    fullCockpitExpanded: false,
    planetInspectModeActive: false,
    planetNotObstructed: false,

    runtimeTablePresent: false,
    runtimeTableMode: "RUNTIME_TABLE_PENDING",
    runtimeTablePlanAttempted: false,
    runtimeTablePlanCreated: false,
    runtimeTablePlanError: "",
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
    canvasLaneClosed: false,
    postCanvasPhaseBouncePrevented: false,

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
    canvasReady: false,

    visiblePlanetAvailable: false,
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

    planetCanvasPresent: false,
    planetCanvasNonZeroSize: false,
    planetFramePainted: false,
    nonblankPlanetVisible: false,

    inspectModeAvailable: false,
    inspectPlanetControlAvailable: false,
    diagnosticCanLeavePlanetFrame: false,
    diagnosticDockHiddenForInspection: false,
    showDiagnosticTabVisible: false,
    showDiagnosticTabVisibleWhenHidden: false,
    diagnosticDockRestorable: false,
    copyDiagnosticPreserved: false,
    receiptOverlayIndependent: true,
    copyDiagnosticArmed: false,
    receiptToggleReady: false,
    buttonsReachable: false,
    partialReceiptAvailable: true,
    finalReceiptAvailable: false,

    mainDisplayProgress: 72,
    mainProgressCap: 72,
    heartbeatElapsedMs: 0,

    f13Events: Object.create(null),
    f13EventOrder: [],
    phaseEvents: [],
    phaseSignatures: Object.create(null),
    archivedLateEvents: [],
    localEvents: [],
    errors: [],

    startedAt: "",
    startedAtMs: 0,
    updatedAt: "",

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  const refs = {
    ledger: null,
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
    showTab: null
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

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
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

  function makeLane(def) {
    return {
      key: def.key,
      label: def.label,
      fibonacci: def.fibonacci,
      status: "PENDING",
      message: `${def.label} pending.`,
      progress: stageProgress(def.fibonacci),
      latestEvent: "LANE_INITIALIZED",
      owner: "hearth.js",
      updatedAt: nowIso()
    };
  }

  function archiveLateEvent(event = {}) {
    const item = {
      at: nowIso(),
      event: event.event || event.id || "ARCHIVED_EVENT",
      stage: event.stage || "F13",
      lane: event.lane || "",
      reason: event.reason || "archived",
      message: event.message || "",
      detail: clonePlain(event.detail || {})
    };

    state.archivedLateEvents.push(item);

    if (state.archivedLateEvents.length > 240) {
      state.archivedLateEvents.splice(0, state.archivedLateEvents.length - 240);
    }

    return item;
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
    led.route = ROUTE;
    led.newsProtocolActive = true;
    led.fibonacciSequenceActive = true;
    led.chronologicalFibonacciAlignment = true;
    led.synchronizedLoading = true;
    led.completionAuthority = "hearth.js";
    led.indexOwnsFinalCompletion = false;
    led.visualPassClaimed = false;
    led.startedAt = led.startedAt || nowIso();
    led.updatedAt = nowIso();
    led.currentStage = led.currentStage || "F8";
    led.highestStage = led.highestStage || "F8";
    led.currentFibonacciStage = led.currentFibonacciStage || led.currentStage;
    led.highestStageReached = led.highestStageReached || led.highestStage;
    led.completionLatched = bool(led.completionLatched, false);
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
        stage: event.stage || led.currentStage || "F8",
        lane: event.lane || "",
        status: event.status || "",
        owner: event.owner || "hearth.js",
        file: event.file || COHERENCE_FILE,
        message: event.message || "",
        detail: clonePlain(event.detail || {}),
        progress: event.progress == null ? "" : event.progress,
        timestamp: nowIso()
      };

      led.events.push(evt);
      led.updatedAt = evt.timestamp;

      if (led.events.length > 340) {
        led.events.splice(0, led.events.length - 340);
      }

      notifyLedger();
      return evt;
    };

    ledger.setStage = function setStage(stage, message = "", options = {}) {
      const nextRank = stageRank(stage);
      const currentRank = stageRank(led.highestStage || led.currentStage);

      if (state.completionLatched && stage !== "F21") {
        archiveLateEvent({
          event: `STAGE_${stage}`,
          stage,
          reason: "post-f21-stage-blocked",
          message: message || stageLabel(stage)
        });
        return led.currentStage;
      }

      if (nextRank < currentRank) {
        state.stageRegressionPrevented += 1;
        archiveLateEvent({
          event: `STAGE_${stage}`,
          stage,
          reason: "monotonic-stage-regression-blocked",
          message: message || stageLabel(stage)
        });
        return led.currentStage;
      }

      led.currentStage = stage;
      led.highestStage = stage;
      led.currentFibonacciStage = stage;
      led.highestStageReached = stage;
      state.currentStage = stage;
      state.highestStage = stage;

      ledger.push({
        id: `STAGE_${stage}`,
        stage,
        lane: options.lane || "ledger",
        status: options.status || "READY",
        owner: options.owner || "hearth.js",
        file: options.file || COHERENCE_FILE,
        message: message || stageLabel(stage),
        detail: options.detail || {}
      });

      return stage;
    };

    ledger.setLane = function setLane(key, next = {}) {
      const lane = led.lanes[key] || makeLane({ key, label: key, fibonacci: next.stage || "F8" });

      if (state.completionLatched && key !== "completionLatch" && key !== "inspectMode") {
        archiveLateEvent({
          event: next.event || next.latestEvent || lane.latestEvent || "LANE_UPDATE",
          stage: next.stage || lane.fibonacci || "F13",
          lane: key,
          reason: "post-f21-lane-update-archived",
          message: next.message || lane.message || "Lane update archived after F21."
        });
        return lane;
      }

      if (state.canvasLaneClosed && key === "canvasAndDiagnostic" && next.event !== "CANVAS_READY") {
        state.postCanvasPhaseBouncePrevented = true;
        archiveLateEvent({
          event: next.event || next.latestEvent || "CANVAS_LANE_UPDATE",
          stage: next.stage || "F13",
          lane: key,
          reason: "canvas-lane-closed-after-canvas-ready",
          message: next.message || "Canvas lane update archived after CANVAS_READY."
        });
        return lane;
      }

      lane.status = next.status || lane.status;
      lane.message = next.message || lane.message;
      lane.progress = Math.max(Number(lane.progress || 0), Number(next.progress == null ? lane.progress : next.progress));
      lane.latestEvent = next.event || next.latestEvent || lane.latestEvent;
      lane.owner = next.owner || lane.owner || "hearth.js";
      lane.fibonacci = next.stage || lane.fibonacci;
      lane.updatedAt = nowIso();

      led.lanes[key] = lane;

      ledger.push({
        id: lane.latestEvent,
        stage: lane.fibonacci,
        lane: key,
        status: lane.status,
        owner: lane.owner,
        file: next.file || COHERENCE_FILE,
        message: lane.message,
        progress: lane.progress,
        detail: next.detail || {}
      });

      return lane;
    };

    ledger.getReceipt = function getLedgerReceipt() {
      return clonePlain(led);
    };

    ledger.getReceiptText = function getLedgerReceiptText() {
      return getReceiptText();
    };

    ledger.copyDiagnostic = function copyLedgerDiagnostic() {
      return copyDiagnostic();
    };

    ledger.bindRenderer = function bindRenderer(fn) {
      if (isFunction(fn)) led.listeners.push(fn);
      return led.listeners.length;
    };

    root.HEARTH_LOAD_LEDGER = ledger;
    refs.ledger = ledger;

    state.sharedLedgerHydrated = true;
    state.indexConstraintPresent = Boolean(
      root.HEARTH_INDEX_CONSTRAINT_SEMICONDUCTOR ||
      root.HEARTH_INDEX_BRIDGE ||
      root.HEARTH_INDEX_JS ||
      led.constraintSemiconductor === INDEX_FILE
    );

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

  function setStage(stage, message = "", options = {}) {
    const ledger = refs.ledger || ensureLedger();

    return ledger.setStage(stage, message, {
      owner: "hearth.js",
      file: COHERENCE_FILE,
      ...options
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

  function push(event = {}) {
    const ledger = refs.ledger || ensureLedger();

    return ledger.push({
      owner: "hearth.js",
      file: COHERENCE_FILE,
      ...event
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

    if (state.errors.length > 80) {
      state.errors.splice(0, state.errors.length - 80);
    }

    const ledger = refs.ledger || ensureLedger();

    if (ledger.state && Array.isArray(ledger.state.errors)) {
      ledger.state.errors.push(item);
      if (ledger.state.errors.length > 120) {
        ledger.state.errors.splice(0, ledger.state.errors.length - 120);
      }
    }

    push({
      id: "ERROR",
      stage: state.currentStage,
      lane: "errors",
      status: "FAILED",
      message: `${code}: ${message}`,
      detail: item
    });

    return item;
  }

  function emitLocal(event, detail = {}, visible = true) {
    const item = {
      event,
      detail: clonePlain(detail),
      visible,
      at: nowIso()
    };

    state.localEvents.push(item);

    if (state.localEvents.length > 240) {
      state.localEvents.splice(0, state.localEvents.length - 240);
    }

    if (visible && !state.completionLatched) {
      state.latestVisibleEvent = event;
    }

    state.updatedAt = item.at;
    return item;
  }

  function emit(event, detail = {}, options = {}) {
    emitLocal(event, detail, options.visible !== false);

    push({
      id: event,
      stage: options.stage || state.currentStage,
      lane: options.lane || "",
      status: options.status || "",
      message: options.message || event,
      detail,
      progress: options.progress == null ? "" : options.progress
    });

    publishGlobals();
    scheduleRender();
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
      mount.dataset.hearthMountCreatedByCoherenceSemiconductor = "true";

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
    mount.dataset.hearthClimateRouteRetired = "true";
    mount.dataset.hearthVisibleCarrierFirst = "true";
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
    return mount;
  }

  function ensureStyle() {
    if (!doc || doc.getElementById("hearth-route-visible-content-proof-style-v3")) return;

    const style = doc.createElement("style");
    style.id = "hearth-route-visible-content-proof-style-v3";
    style.textContent = `
      .hearth-ledger-cockpit{
        transition:max-height .24s ease, opacity .18s ease, visibility .18s ease, transform .22s ease;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"]{
        inset:auto 10px 10px 10px!important;
        min-height:132px!important;
        max-height:184px!important;
        overflow:hidden!important;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-head{
        padding:10px 14px 7px!important;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-kicker{
        font-size:.58rem!important;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-title{
        font-size:.98rem!important;
        white-space:nowrap!important;
        overflow:hidden!important;
        text-overflow:ellipsis!important;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-meta{
        display:none!important;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-latest{
        font-size:.63rem!important;
        white-space:nowrap!important;
        overflow:hidden!important;
        text-overflow:ellipsis!important;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-progress{
        padding:7px 10px!important;
        display:grid!important;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-scroll{
        display:none!important;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-actions{
        padding:7px 10px 10px!important;
        border-bottom:0!important;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-button{
        min-height:28px!important;
        padding:6px 9px!important;
        font-size:.56rem!important;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="expanded-cockpit"]{
        inset:10px!important;
        max-height:calc(100% - 20px)!important;
        min-height:170px!important;
        overflow:hidden!important;
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

      [data-hearth-coherence-show-diagnostic-tab]{
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

      html[data-hearth-planet-inspect="true"] [data-hearth-coherence-show-diagnostic-tab]{
        display:inline-flex;
      }

      html[data-hearth-planet-inspect="true"] #hearthCanvasMount,
      html[data-hearth-planet-inspect="true"] [data-hearth-canvas-mount="true"]{
        cursor:grab;
      }

      html[data-hearth-visible-content-proof="false"] .hearth-ledger-cockpit .hearth-ledger-title{
        color:rgba(255,232,163,.98);
      }

      @media (max-width:760px){
        .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"]{
          inset:auto 8px 8px 8px!important;
          max-height:188px!important;
        }

        .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-button{
          flex:1 1 auto!important;
          min-width:28%!important;
        }

        [data-hearth-coherence-show-diagnostic-tab]{
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

    return tab;
  }

  function createFallbackCockpit() {
    if (!doc) return null;

    const mount = refs.mount || ensureMount();
    if (!mount) return null;

    const cockpit = doc.createElement("aside");
    cockpit.id = COCKPIT_ID;
    cockpit.className = "hearth-ledger-cockpit";
    cockpit.dataset.hearthLoadCockpit = "true";
    cockpit.dataset.hearthFirstPaintCockpit = "fallback-created-by-visible-content-proof-semiconductor-v3";
    cockpit.dataset.hearthCoherenceSemiconductorFallbackCockpit = "true";
    cockpit.dataset.cockpitMode = "loading-cockpit";
    cockpit.setAttribute("aria-live", "polite");

    cockpit.innerHTML = `
      <div class="hearth-ledger-head">
        <div class="hearth-ledger-kicker">Hearth · Paired Semiconductor Load Ledger</div>
        <h2 class="hearth-ledger-title">FORMING HEARTH VISIBLE PLANET</h2>
        <div class="hearth-ledger-meta" data-hearth-stage-label>F8 · Coherence semiconductor hydration</div>
        <div class="hearth-ledger-meta" data-hearth-heartbeat-text>heartbeat=active · elapsed=00:00</div>
        <div class="hearth-ledger-latest" data-hearth-latest-event>latest=COHERENCE_SEMICONDUCTOR_LOADED</div>
      </div>

      <div class="hearth-ledger-progress" data-hearth-index-progress-strip="true">
        <div class="hearth-ledger-track">
          <span class="hearth-ledger-fill" data-hearth-main-progress-fill style="width:72%"></span>
        </div>
        <div class="hearth-ledger-percent" data-hearth-main-progress-percent>72%</div>
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
    return cockpit;
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
    cockpit.dataset.hearthSynchronizedLoading = "true";
    cockpit.dataset.hearthVisibleContentProofLatch = "true";
    cockpit.dataset.cockpitMode = cockpit.dataset.cockpitMode || "loading-cockpit";

    state.copyDiagnosticArmed = Boolean(refs.copyButton);
    state.copyDiagnosticPreserved = Boolean(refs.copyButton);
    state.receiptToggleReady = Boolean(refs.receiptToggle);
    state.buttonsReachable = Boolean(refs.copyButton && refs.receiptToggle && refs.inspectButton);
    state.inspectModeAvailable = Boolean(refs.inspectButton);
    state.inspectPlanetControlAvailable = Boolean(refs.inspectButton);
    state.diagnosticDockRestorable = Boolean(refs.showTab);
    state.showDiagnosticTabVisibleWhenHidden = Boolean(refs.showTab);

    if (refs.copyButton) refs.copyButton.onclick = copyDiagnostic;
    if (refs.receiptToggle) refs.receiptToggle.onclick = toggleReceipt;
    if (refs.inspectButton) refs.inspectButton.onclick = () => setCockpitMode("planet-inspect");
    if (refs.expandButton) refs.expandButton.onclick = toggleExpanded;

    if (mount) {
      mount.querySelectorAll("[data-hearth-mount-fallback], .mount-fallback").forEach((fallback) => {
        fallback.hidden = true;
        fallback.style.display = "none";
        fallback.dataset.hiddenByVisibleContentProofSemiconductor = CONTRACT;
      });
    }

    setLane("conductorHydration", {
      status: "HYDRATED",
      progress: stageProgress("F8"),
      event: "COHERENCE_SEMICONDUCTOR_HYDRATED_COCKPIT",
      stage: "F8",
      message: "Coherence semiconductor hydrated shared cockpit."
    });

    setStage("F8", "Coherence semiconductor hydrated shared cockpit.", {
      lane: "conductorHydration",
      status: "HYDRATED"
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

    scheduleRender();
  }

  function toggleExpanded() {
    if (state.planetInspectModeActive) {
      setCockpitMode("diagnostic-dock");
      return;
    }

    if (state.cockpitMode === "expanded-cockpit") {
      setCockpitMode("diagnostic-dock");
    } else {
      setCockpitMode("expanded-cockpit");
    }
  }

  function setCockpitMode(mode) {
    if (!refs.cockpit) return;

    if (mode === "planet-inspect") {
      if (state.cockpitMode !== "planet-inspect") {
        state.priorDiagnosticMode = state.cockpitMode === "expanded-cockpit" ? "expanded-cockpit" : "diagnostic-dock";
      }

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
      state.priorDiagnosticMode = "expanded-cockpit";
    } else {
      state.cockpitMode = state.canvasReady || state.stableDiagnosticDockAfterCanvasReady ? "diagnostic-dock" : "loading-cockpit";
      state.planetInspectModeActive = false;
      state.diagnosticDockHiddenForInspection = false;
      state.showDiagnosticTabVisible = false;
      state.planetNotObstructed = false;
      state.dockVisible = true;
      state.fullCockpitExpanded = false;
      state.priorDiagnosticMode = "diagnostic-dock";
    }

    refs.cockpit.dataset.cockpitMode = state.cockpitMode;
    refs.cockpit.dataset.fullExpanded = String(state.fullCockpitExpanded);
    refs.cockpit.dataset.hearthPlanetInspect = String(state.planetInspectModeActive);
    refs.cockpit.dataset.hearthDiagnosticDockHiddenForInspection = String(state.diagnosticDockHiddenForInspection);

    if (refs.mount) {
      refs.mount.dataset.hearthPlanetInspect = String(state.planetInspectModeActive);
    }

    if (doc && doc.documentElement) {
      doc.documentElement.dataset.hearthPlanetInspect = String(state.planetInspectModeActive);
      doc.documentElement.dataset.hearthDiagnosticDockHiddenForInspection = String(state.diagnosticDockHiddenForInspection);
    }

    if (refs.showTab) {
      refs.showTab.hidden = !state.planetInspectModeActive;
      refs.showTab.dataset.visible = String(state.planetInspectModeActive);
    }

    if (refs.inspectButton) {
      refs.inspectButton.textContent = state.planetInspectModeActive ? "Show diagnostic" : "Inspect planet";
      refs.inspectButton.onclick = () => {
        if (state.planetInspectModeActive) setCockpitMode("diagnostic-dock");
        else setCockpitMode("planet-inspect");
      };
    }

    if (refs.expandButton) {
      if (state.cockpitMode === "expanded-cockpit") refs.expandButton.textContent = "Collapse dock";
      else if (state.cockpitMode === "planet-inspect") refs.expandButton.textContent = "Show diagnostic";
      else refs.expandButton.textContent = "Expand cockpit";
    }

    evaluateInspectGate();
    updateCompletionGates("cockpit-mode-change");

    publishGlobals();
    scheduleRender();
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
    state.runtimeTableMode = api ? "RUNTIME_TABLE_READY_OR_DEGRADED" : "RUNTIME_TABLE_MISSING_ALLOWED";
    state.runtimeTablePlanAttempted = Boolean(api);

    if (!api) {
      setLane("authorityAvailability", {
        status: "DEGRADED_ALLOWED",
        progress: stageProgress("F5"),
        event: "RUNTIME_TABLE_MISSING_ALLOWED",
        stage: "F5",
        message: "Runtime Table missing; first visible process remains alive."
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
          renderMetadata: {
            pairedSemiconductor: true,
            constraintSemiconductor: INDEX_FILE,
            coherenceSemiconductor: COHERENCE_FILE,
            synchronizedLoading: true,
            visibleContentCompletionGate: true,
            inspectModeGate: true,
            visualPassClaimed: false
          }
        }, {
          profile: "hearth-paired-semiconductor-visible-content-proof-latch-v3",
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

      setLane("authorityAvailability", {
        status: "READY",
        progress: stageProgress("F5"),
        event: "RUNTIME_TABLE_AVAILABLE",
        stage: "F5",
        message: state.runtimeTablePlanCreated
          ? "Runtime Table available and carrier plan created."
          : "Runtime Table available."
      });

      return plan;
    } catch (error) {
      state.runtimeTableMode = "RUNTIME_TABLE_DEGRADED";
      state.runtimeTablePlanError = error && error.message ? error.message : String(error);

      recordError("RUNTIME_TABLE_PLAN_ERROR", state.runtimeTablePlanError);

      setLane("authorityAvailability", {
        status: "DEGRADED",
        progress: stageProgress("F5"),
        event: "RUNTIME_TABLE_DEGRADED",
        stage: "F5",
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

  function getCanvasReceipt() {
    const api = getCanvasApi();

    if (api && isFunction(api.getReceipt)) {
      try {
        const receipt = api.getReceipt("hearth-visible-content-proof-latch-v3-reconcile");
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
      chronologicalFibonacciAlignment: true,
      synchronizedLoading: true,
      visibleContentCompletionGate: true,
      inspectModeGate: true,
      sharedLedger: refs.ledger || ensureLedger(),
      loadLedger: refs.ledger || ensureLedger(),
      visibleCarrierFirst: true,
      runtimeTableOptional: true,
      runtimeTableMissingDoesNotBlockCarrier: true,
      sourceAuthorityHeld: true,
      wideProbeDeferred: true,
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
    if (canvasBootRequested) return;

    const api = getCanvasApi();
    state.canvasApiPresent = Boolean(api);

    if (!api) {
      setLane("canvasAndDiagnostic", {
        status: "WAITING",
        progress: 64,
        event: "CANVAS_API_PENDING",
        stage: "F13",
        message: "Canvas API pending; synchronized loader remains active."
      });

      state.postgameStatus = "CANVAS_API_PENDING";
      state.firstFailedCoordinate = "F13_CANVAS_API_PENDING";
      state.recommendedNextRenewalTarget = CANVAS_FILE;
      return;
    }

    const method = selectCanvasMethod(api);

    if (!method) {
      state.canvasCarrierHandoffError = "Canvas API present but no boot/mount method exists.";
      state.postgameStatus = "CANVAS_METHOD_MISSING";
      state.firstFailedCoordinate = "F13_CANVAS_METHOD_MISSING";
      state.recommendedNextRenewalTarget = CANVAS_FILE;
      recordError("CANVAS_METHOD_MISSING", state.canvasCarrierHandoffError);
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
    state.f13ProgressStreamActive = state.cooperativeBootUsed;
    state.lastCanvasPhase = state.cooperativeBootUsed ? "CANVAS_COOPERATIVE_BOOT_STARTED" : "SYNC_BOOT_FALLBACK_SELECTED";
    state.lastCanvasProgress = state.cooperativeBootUsed ? 78 : 76;
    state.mainProgressCap = Math.max(state.mainProgressCap, state.lastCanvasProgress);

    markF13("CANVAS_COOPERATIVE_BOOT_STARTED");

    setStage("F13", "Canvas cooperative boot active.", {
      lane: "canvasAndDiagnostic",
      status: "LOADING"
    });

    setLane("canvasAndDiagnostic", {
      status: "LOADING",
      progress: state.lastCanvasProgress,
      event: state.lastCanvasPhase,
      stage: "F13",
      message: state.cooperativeBootUsed
        ? "Canvas cooperative boot selected; F13 remains active until visible content proof."
        : "Canvas fallback method selected; final completion will be blocked unless visible content proof passes."
    });

    emit("CANVAS_CARRIER_METHOD_SELECTED", {
      method,
      cooperativeBootAvailable: state.cooperativeBootAvailable,
      cooperativeBootUsed: state.cooperativeBootUsed,
      syncBootFallbackUsed: state.syncBootFallbackUsed
    }, {
      stage: "F13",
      lane: "canvasAndDiagnostic",
      status: "READY",
      progress: state.lastCanvasProgress
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
            state.postgameStatus = "CANVAS_BOOT_PHASE_ERROR";
            state.firstFailedCoordinate = "F13_CANVAS_PROMISE_REJECTED";
            recordError("CANVAS_PROMISE_REJECTED", state.canvasCarrierHandoffError);
          });
      } else if (result && isObject(result)) {
        handleCanvasReceipt(result, "canvas-method-returned-receipt");
      }
    } catch (error) {
      state.canvasCarrierHandoffOk = false;
      state.canvasCarrierHandoffError = error && error.message ? error.message : String(error);
      state.postgameStatus = "CANVAS_HANDOFF_ERROR";
      state.firstFailedCoordinate = "F13_CANVAS_HANDOFF_ERROR";
      state.recommendedNextRenewalTarget = CANVAS_FILE;
      recordError("CANVAS_HANDOFF_ERROR", state.canvasCarrierHandoffError, { method });
    }
  }

  function phaseSignature(event) {
    const phase = String(event.phase || event.id || event.event || "CANVAS_PHASE");
    const detail = isObject(event.detail) ? event.detail : {};
    const chunk = detail.chunkIndex == null ? "" : detail.chunkIndex;
    const total = detail.totalChunks == null ? "" : detail.totalChunks;
    const progress = event.percent == null
      ? (event.progress == null ? (detail.progress == null ? "" : detail.progress) : event.progress)
      : event.percent;

    return `${phase}|${chunk}|${total}|${progress}`;
  }

  function markF13(phase) {
    if (!phase) return;

    state.f13Events[phase] = true;

    if (!state.f13EventOrder.includes(phase)) {
      state.f13EventOrder.push(phase);
    }

    state.f13SubsequenceComplete = F13_REQUIRED.every((name) => state.f13Events[name] === true);
    state.f13LastRequiredEvent = state.f13EventOrder[state.f13EventOrder.length - 1] || "";

    if (phase === "CANVAS_READY" && !state.fibonacciStageAtCanvasReady) {
      state.fibonacciStageAtCanvasReady = "F13";
    }

    if (phase === "VISIBLE_CONTENT_PROOF_PASSED" && !state.fibonacciStageAtVisibleContentProof) {
      state.fibonacciStageAtVisibleContentProof = "F13";
    }
  }

  function handleCanvasPhase(event = {}) {
    const phase = String(event.phase || event.id || event.event || "CANVAS_PHASE");
    const signature = phaseSignature(event);
    const current = nowMs();

    if (state.phaseSignatures[signature] && current - state.phaseSignatures[signature] < 1800) {
      state.ignoredDuplicateCanvasEvents += 1;
      return event;
    }

    state.phaseSignatures[signature] = current;

    const detail = isObject(event.detail) ? event.detail : {};
    const percent = clamp(Number(event.percent == null ? (event.progress == null ? (detail.progress == null ? state.lastCanvasProgress || 78 : detail.progress) : event.progress) : event.percent), 0, 100);
    const elapsedMs = Number(detail.elapsedMs == null ? (event.elapsedMs == null ? state.canvasBootElapsedMs || 0 : event.elapsedMs) : detail.elapsedMs);
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

    if (state.canvasLaneClosed && phase !== "CANVAS_READY") {
      state.postCanvasPhaseBouncePrevented = true;
      archiveLateEvent({
        event: phase,
        stage: "F13",
        lane: "canvasAndDiagnostic",
        reason: "canvas-lane-closed-after-canvas-ready",
        message,
        detail
      });
      return event;
    }

    state.canvasPhaseCount += 1;
    state.lastCanvasPhase = phase;
    state.lastCanvasProgress = Math.max(Number(state.lastCanvasProgress || 0), percent);
    state.mainProgressCap = Math.max(state.mainProgressCap, Math.min(percent, 98));
    state.canvasBootElapsedMs = Math.max(Number(state.canvasBootElapsedMs || 0), elapsedMs);
    state.canvasYieldCount = Math.max(Number(state.canvasYieldCount || 0), Number(detail.canvasYieldCount || 0));
    state.loaderRepaintDuringCanvasBoot = Boolean(state.loaderRepaintDuringCanvasBoot || detail.loaderRepaintDuringCanvasBoot || state.canvasYieldCount > 0);
    state.f13ProgressStreamActive = true;
    state.latestVisibleEvent = phase;

    applyPhaseTruth(phase, detail);
    markF13(phase);

    state.phaseEvents.push({
      at: nowIso(),
      phase,
      percent,
      message,
      detail: clonePlain(detail)
    });

    if (state.phaseEvents.length > 190) {
      state.phaseEvents.splice(0, state.phaseEvents.length - 190);
    }

    if (phase === "CANVAS_READY") {
      state.canvasLaneClosed = true;

      setLane("canvasAndDiagnostic", {
        status: "FINAL_READY",
        progress: 100,
        event: "CANVAS_READY",
        stage: "F13",
        message: "Canvas ready. Visible Hearth content proof still required."
      });

      settleAfterCanvasReady("canvas-ready-phase");
    } else {
      setStage("F13", message, {
        lane: "canvasAndDiagnostic",
        status: "LOADING"
      });

      setLane("canvasAndDiagnostic", {
        status: "LOADING",
        progress: percent,
        event: phase,
        stage: "F13",
        message
      });
    }

    reconcileAll(`canvas-phase-${phase}`);

    if (phase === "CANVAS_READY") {
      root.setTimeout(() => settleAfterCanvasReady("canvas-ready-post-frame-check"), 80);
      root.setTimeout(() => settleAfterCanvasReady("canvas-ready-late-visual-check"), 320);
      root.setTimeout(() => settleAfterCanvasReady("canvas-ready-later-content-check"), 900);
    }

    return event;
  }

  function applyPhaseTruth(phase, detail = {}) {
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

    if (phase === "DRAG_INSPECTION_BOUND") {
      state.dragInspectionBound = true;
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
      state.canvasBootCompletedAt = state.canvasBootCompletedAt || nowIso();
      state.canvasBootCompletedAtMs = state.canvasBootCompletedAtMs || nowMs();
      state.canvasBootElapsedMs = Number(detail.canvasBootElapsedMs || state.canvasBootElapsedMs || (state.canvasBootCompletedAtMs - state.canvasBootStartedAtMs));
      state.fibonacciStageAtCanvasReady = "F13";
      state.finalReceiptAvailable = true;
    }
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
    if (phase === "TEXTURE_COMPOSE_PROGRESS") return `Texture composition active · ${detail.textureComposeProgress || percent}% · elapsed ${elapsed}`;
    if (phase === "TEXTURE_COMPOSE_COMPLETE") return `Texture composition complete · elapsed ${elapsed}`;
    if (phase === "FIRST_FRAME_REQUESTED") return `First frame requested · elapsed ${elapsed}`;
    if (phase === "FIRST_FRAME_DETECTED") return `First frame detected · elapsed ${elapsed}`;
    if (phase === "DRAG_INSPECTION_BOUND") return `Drag inspection bound · elapsed ${elapsed}`;
    if (phase === "CANVAS_READY") return `Canvas ready · visible content proof required · elapsed ${elapsed}`;
    return `${phase} · elapsed ${elapsed}`;
  }

  function handleCanvasReceipt(receipt, reason = "canvas-receipt") {
    const value = receipt && isObject(receipt) ? receipt : getCanvasReceipt();

    if (value && isObject(value)) {
      handleCanvasReceiptLight(value);

      if (Array.isArray(value.phaseEvents)) {
        value.phaseEvents.forEach((event) => {
          if (!event || !event.phase) return;
          handleCanvasPhase(event);
        });
      }
    }

    reconcileAll(reason);
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

    if (state.canvasReady) {
      markF13("CANVAS_READY");
      state.canvasLaneClosed = true;
    }

    if (explicitReceiptContentProof(value)) {
      state.explicitContentReceiptProof = true;
      state.visibleContentProof = true;
      state.visibleContentProofMethod = "explicit-canvas-receipt-content-proof";
      state.carrierOnlyDetected = false;
      state.visiblePlanetAvailable = true;
      state.nonblankPlanetVisible = true;
      state.planetFramePainted = true;
      markF13("VISIBLE_CONTENT_PROOF_STARTED");
      markF13("VISIBLE_CONTENT_PROOF_PASSED");
    }
  }

  function reconcileFromDataset() {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    state.canvasApiPresent = Boolean(getCanvasApi());

    state.cooperativeBootAvailable = Boolean(
      state.cooperativeBootAvailable ||
      bool(dataset.hearthCanvasCooperativeBootAvailable) ||
      Boolean(getCanvasApi() && isFunction(getCanvasApi().bootCooperative))
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
      bool(dataset.hearthVisibleCarrierMounted)
    );

    state.canvasCarrierHandoffOk = Boolean(
      state.canvasCarrierHandoffOk ||
      bool(dataset.hearthCanvasCarrierHandoffOk) ||
      state.canvasCarrierMounted
    );

    state.firstFrameRequested = Boolean(state.firstFrameRequested || bool(dataset.hearthFirstFrameRequested));
    state.firstFrameDetected = Boolean(state.firstFrameDetected || bool(dataset.hearthFirstFrameDetected));
    state.imageRendered = Boolean(state.imageRendered || bool(dataset.hearthImageRendered) || bool(dataset.hearthCanvasImageRendered));
    state.dragInspectionBound = Boolean(state.dragInspectionBound || bool(dataset.hearthDragInspectionBound) || bool(dataset.hearthControlsBound));
    state.canvasReady = Boolean(state.canvasReady || bool(dataset.hearthCanvasReady));

    state.atlasBuildStarted = Boolean(state.atlasBuildStarted || bool(dataset.hearthAtlasBuildStarted));
    state.atlasBuildProgress = Math.max(Number(state.atlasBuildProgress || 0), Number(dataset.hearthAtlasBuildProgress || 0));
    state.atlasBuildComplete = Boolean(state.atlasBuildComplete || bool(dataset.hearthAtlasBuildComplete));

    state.textureComposeStarted = Boolean(state.textureComposeStarted || bool(dataset.hearthTextureComposeStarted));
    state.textureComposeProgress = Math.max(Number(state.textureComposeProgress || 0), Number(dataset.hearthTextureComposeProgress || 0));
    state.textureComposeComplete = Boolean(state.textureComposeComplete || bool(dataset.hearthTextureComposeComplete));

    state.visiblePlanetAvailable = Boolean(state.visiblePlanetAvailable || bool(dataset.hearthVisiblePlanetAvailable));
    state.planetCanvasPresent = Boolean(state.planetCanvasPresent || bool(dataset.hearthPlanetCanvasPresent));
    state.planetCanvasNonZeroSize = Boolean(state.planetCanvasNonZeroSize || bool(dataset.hearthPlanetCanvasNonZeroSize));
    state.planetFramePainted = Boolean(state.planetFramePainted || bool(dataset.hearthPlanetFramePainted));
    state.nonblankPlanetVisible = Boolean(state.nonblankPlanetVisible || bool(dataset.hearthNonblankPlanetVisible));

    if (bool(dataset.hearthVisibleContentProof)) {
      state.visibleContentProof = true;
      state.visibleContentProofMethod = state.visibleContentProofMethod || "dataset-visible-content-proof";
      state.carrierOnlyDetected = false;
      markF13("VISIBLE_CONTENT_PROOF_STARTED");
      markF13("VISIBLE_CONTENT_PROOF_PASSED");
    }

    if (dataset.hearthCanvasLastPhase) state.lastCanvasPhase = dataset.hearthCanvasLastPhase;

    if (Number(dataset.hearthCanvasLastProgress || 0)) {
      state.lastCanvasProgress = Math.max(state.lastCanvasProgress, Number(dataset.hearthCanvasLastProgress || 0));
      state.mainProgressCap = Math.max(state.mainProgressCap, Math.min(98, state.lastCanvasProgress));
    }

    if (state.canvasReady) {
      markF13("CANVAS_READY");
      state.canvasLaneClosed = true;
    }
  }

  function explicitReceiptContentProof(value) {
    if (!isObject(value)) return false;

    for (const key of EXPLICIT_CONTENT_FLAGS) {
      if (value[key] === true || value[key] === "true") return true;
    }

    const nested = [value.state, value.receipt, value.postgame, value.canvasState, value.renderState].filter(isObject);

    for (const item of nested) {
      for (const key of EXPLICIT_CONTENT_FLAGS) {
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

  function settleAfterCanvasReady(reason = "canvas-ready") {
    state.stableDiagnosticDockAfterCanvasReady = true;
    state.visibleLoadingActive = false;
    state.diagnosticCockpitReady = true;
    state.finalReceiptAvailable = true;

    startVisibleContentProof(reason);
    evaluateInspectGate();
    updateCompletionGates(reason);

    if (!state.completionLatched && refs.cockpit && state.cockpitMode !== "planet-inspect" && state.cockpitMode !== "expanded-cockpit") {
      setCockpitMode("diagnostic-dock");
    }

    scheduleRender();
  }

  function startVisibleContentProof(reason = "manual") {
    if (state.completionLatched) return state.visibleContentProof;

    state.visibleContentProofStarted = true;
    markF13("VISIBLE_CONTENT_PROOF_STARTED");

    const passed = proveVisibleContent(reason);

    if (passed) {
      markF13("VISIBLE_CONTENT_PROOF_PASSED");

      setLane("visiblePlanetProof", {
        status: "READY",
        progress: 100,
        event: "VISIBLE_CONTENT_PROOF_PASSED",
        stage: "F13",
        message: `Visible Hearth content proof passed via ${state.visibleContentProofMethod}.`
      });
    } else {
      setLane("visiblePlanetProof", {
        status: "PENDING",
        progress: 98,
        event: "VISIBLE_CONTENT_PROOF_PENDING",
        stage: "F13",
        message: "Canvas ready · carrier visible · Hearth content not yet proven."
      });
    }

    updateCompletionGates(`visible-content-proof-${reason}`);
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
      markF13("VISIBLE_CONTENT_PROOF_PASSED");
      return true;
    }

    const api = getCanvasApi();
    const apiState = api && isObject(api.state) ? api.state : null;

    if (explicitReceiptContentProof(apiState)) {
      state.explicitContentReceiptProof = true;
      state.visibleContentProof = true;
      state.visibleContentProofMethod = "explicit-canvas-api-state-content-proof";
      state.visibleContentProofError = "";
      state.carrierOnlyDetected = false;
      state.visiblePlanetAvailable = true;
      state.nonblankPlanetVisible = true;
      state.planetFramePainted = true;
      markF13("VISIBLE_CONTENT_PROOF_PASSED");
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
      markF13("VISIBLE_CONTENT_PROOF_PASSED");
      return true;
    }

    state.visibleContentProof = false;
    state.visibleContentProofMethod = pixelProof.method || "pending";
    state.visibleContentProofError = pixelProof.error || "";
    state.visiblePlanetAvailable = false;
    state.carrierOnlyDetected = true;
    state.falseReadyPrevented = Boolean(state.canvasReady && state.firstFrameDetected && !state.visibleContentProof);
    state.completionBlockedUntilVisibleContent = true;

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
      width = Math.max(1, Number(canvas.width || Math.floor(rect && rect.width ? rect.width : 0)));
      height = Math.max(1, Number(canvas.height || Math.floor(rect && rect.height ? rect.height : 0)));
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

          const px = clamp(x, 0, width - 1);
          const py = clamp(y, 0, height - 1);
          const data = ctx.getImageData(px, py, 1, 1).data;
          const r = data[0] || 0;
          const g = data[1] || 0;
          const b = data[2] || 0;
          const a = data[3] || 0;
          const lum = (r + g + b) / 3;

          sampleCount += 1;

          if (a < 16 || lum < 14) continue;

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

    const hasLand = land >= 3;
    const hasWaterOrOther = water >= 3 || other >= 3;
    const enoughVariance = variance >= 9;
    const enoughSamples = sampleCount >= 60 && nonblank >= 24;
    const passed = Boolean(
      enoughSamples &&
      enoughVariance &&
      hasLand &&
      hasWaterOrOther &&
      state.textureComposeComplete &&
      state.canvasReady
    );

    state.carrierOnlyDetected = !passed;

    return {
      passed,
      method: passed ? "canvas-pixel-content-sample" : "carrier-only-or-insufficient-content-sample",
      error: passed
        ? ""
        : `Visible content sample failed: samples=${sampleCount}, nonblank=${nonblank}, variance=${Math.round(variance * 100) / 100}, classes=${classCount}, land=${land}, water=${water}, other=${other}, carrier=${carrier}, reason=${reason}`
    };
  }

  function classifyContentColor(r, g, b, a) {
    if (a < 16) return "blank";

    const lum = (r + g + b) / 3;
    if (lum < 18) return "carrier";

    const blueDominant = b >= r + 8 && b >= g - 6;
    const mutedBlueCarrier = blueDominant && b < 78 && g < 78 && r < 64;
    if (mutedBlueCarrier) return "carrier";

    const landGreen = g >= 42 && r >= 24 && b <= 130 && g >= b + 5;
    const landBrown = r >= 44 && g >= 34 && b <= 105 && r >= b + 8 && g >= b + 2;
    const landYellow = r >= 58 && g >= 52 && b <= 126 && Math.abs(r - g) <= 58;

    if (landGreen || landBrown || landYellow) return "land";

    const waterBlue = b >= 52 && b >= r + 8 && b >= g - 12 && g >= 24;
    const waterTeal = g >= 42 && b >= 42 && r <= 70 && Math.abs(g - b) <= 50;

    if (waterBlue || waterTeal) return "water";

    if (lum >= 48 && Math.max(r, g, b) - Math.min(r, g, b) >= 18) return "content-other";

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

  function evaluateInspectGate() {
    state.inspectModeAvailable = Boolean(refs.inspectButton);
    state.inspectPlanetControlAvailable = Boolean(refs.inspectButton);
    state.showDiagnosticTabVisibleWhenHidden = Boolean(refs.showTab);
    state.diagnosticDockRestorable = Boolean(refs.showTab);
    state.copyDiagnosticPreserved = Boolean(refs.copyButton);
    state.receiptOverlayIndependent = true;
    state.diagnosticCanLeavePlanetFrame = Boolean(
      state.inspectModeAvailable &&
      state.inspectPlanetControlAvailable &&
      state.showDiagnosticTabVisibleWhenHidden &&
      state.diagnosticDockRestorable &&
      refs.cockpit
    );

    if (state.diagnosticCanLeavePlanetFrame) markF13("INSPECT_MODE_READY");

    setLane("inspectMode", {
      status: state.diagnosticCanLeavePlanetFrame ? "READY" : "PENDING",
      progress: state.diagnosticCanLeavePlanetFrame ? 100 : 60,
      event: state.diagnosticCanLeavePlanetFrame ? "INSPECT_MODE_READY" : "INSPECT_MODE_PENDING",
      stage: "F13",
      message: state.diagnosticCanLeavePlanetFrame
        ? "Inspect planet and Show diagnostic restoration are available."
        : "Inspect mode proof pending."
    });

    return state.diagnosticCanLeavePlanetFrame;
  }

  function evaluateNewsGates() {
    state.northGateReady = Boolean(
      state.canvasReady &&
      state.atlasBuildComplete &&
      state.textureComposeComplete &&
      state.firstFrameDetected &&
      state.dragInspectionBound &&
      state.visibleContentProof &&
      state.visiblePlanetAvailable
    );

    state.eastGateReady = Boolean(
      state.cooperativeBootUsed &&
      !state.syncBootFallbackUsed &&
      state.canvasCarrierMethod === "bootCooperative" &&
      state.canvasCarrierRequested &&
      state.canvasCarrierHandoffOk
    );

    state.westGateReady = Boolean(
      state.copyDiagnosticPreserved &&
      state.receiptOverlayIndependent &&
      state.buttonsReachable &&
      state.finalReceiptAvailable
    );

    state.southGateReady = Boolean(
      state.canvasCarrierMounted &&
      state.imageRendered &&
      state.dragInspectionBound &&
      state.visibleContentProof &&
      state.visiblePlanetAvailable &&
      state.diagnosticCanLeavePlanetFrame
    );

    state.newsGatePassedBeforeF21 = Boolean(
      state.northGateReady &&
      state.eastGateReady &&
      state.westGateReady &&
      state.southGateReady
    );

    state.canvasReadinessBarrierOpen = Boolean(
      state.canvasReady &&
      state.f13Events.CANVAS_READY === true
    );

    state.visibleContentBarrierOpen = Boolean(
      state.visibleContentProof &&
      state.f13Events.VISIBLE_CONTENT_PROOF_PASSED === true
    );

    state.f13SubsequenceComplete = F13_REQUIRED.every((name) => state.f13Events[name] === true);

    return state.newsGatePassedBeforeF21;
  }

  function updateCompletionGates(reason = "manual") {
    evaluateInspectGate();
    evaluateNewsGates();

    const ready = Boolean(
      state.canvasReady &&
      state.canvasCarrierMounted &&
      state.planetCanvasPresent &&
      state.planetCanvasNonZeroSize &&
      state.planetFramePainted &&
      state.visibleContentProof &&
      state.visiblePlanetAvailable &&
      state.nonblankPlanetVisible &&
      state.firstFrameDetected &&
      state.imageRendered &&
      state.dragInspectionBound &&
      state.atlasBuildComplete &&
      state.textureComposeComplete &&
      state.inspectModeAvailable &&
      state.inspectPlanetControlAvailable &&
      state.diagnosticCanLeavePlanetFrame &&
      state.showDiagnosticTabVisibleWhenHidden &&
      state.diagnosticDockRestorable &&
      state.copyDiagnosticPreserved &&
      state.receiptOverlayIndependent &&
      state.newsGatePassedBeforeF21 &&
      state.visibleContentBarrierOpen
    );

    if (ready) {
      tryFinalize(reason);
      return true;
    }

    state.prematureLatchPrevented = true;
    state.falseReadyPrevented = Boolean(state.canvasReady && state.firstFrameDetected && !state.visibleContentProof);
    state.completionBlockedUntilVisibleContent = !state.visibleContentProof;
    state.postgameStatus = derivePendingStatus();
    state.firstFailedCoordinate = state.visibleContentProof ? firstMissingCompletionCoordinate() : "VISIBLE_CONTENT_PROOF_PENDING";
    state.recommendedNextRenewalTarget = !state.visibleContentProof ? CANVAS_FILE : COHERENCE_FILE;

    if (state.canvasReady) {
      state.visibleLoadingActive = false;
      state.diagnosticCockpitReady = true;
      state.stableDiagnosticDockAfterCanvasReady = true;
    }

    setLane("completionLatch", {
      status: "BLOCKED",
      progress: 98,
      event: "F21_BLOCKED_VISIBLE_CONTENT_PROOF_PENDING",
      stage: "F21",
      message: state.visibleContentProof
        ? `Completion blocked: ${state.firstFailedCoordinate}`
        : "Canvas carrier ready · visible Hearth content not proven."
    });

    return false;
  }

  function firstMissingCompletionCoordinate() {
    const checks = [
      ["canvasReady", state.canvasReady],
      ["canvasCarrierMounted", state.canvasCarrierMounted],
      ["planetCanvasPresent", state.planetCanvasPresent],
      ["planetCanvasNonZeroSize", state.planetCanvasNonZeroSize],
      ["planetFramePainted", state.planetFramePainted],
      ["visibleContentProof", state.visibleContentProof],
      ["visiblePlanetAvailable", state.visiblePlanetAvailable],
      ["nonblankPlanetVisible", state.nonblankPlanetVisible],
      ["firstFrameDetected", state.firstFrameDetected],
      ["imageRendered", state.imageRendered],
      ["dragInspectionBound", state.dragInspectionBound],
      ["atlasBuildComplete", state.atlasBuildComplete],
      ["textureComposeComplete", state.textureComposeComplete],
      ["inspectModeAvailable", state.inspectModeAvailable],
      ["inspectPlanetControlAvailable", state.inspectPlanetControlAvailable],
      ["diagnosticCanLeavePlanetFrame", state.diagnosticCanLeavePlanetFrame],
      ["showDiagnosticTabVisibleWhenHidden", state.showDiagnosticTabVisibleWhenHidden],
      ["diagnosticDockRestorable", state.diagnosticDockRestorable],
      ["copyDiagnosticPreserved", state.copyDiagnosticPreserved],
      ["receiptOverlayIndependent", state.receiptOverlayIndependent],
      ["newsGatePassedBeforeF21", state.newsGatePassedBeforeF21],
      ["visibleContentBarrierOpen", state.visibleContentBarrierOpen]
    ];

    const missing = checks.find((entry) => !entry[1]);
    return missing ? `WAITING_${missing[0]}` : "NONE";
  }

  function derivePendingStatus() {
    if (state.canvasReady && !state.visibleContentProof) return "CANVAS_CARRIER_READY_VISIBLE_CONTENT_PENDING";
    if (state.canvasReady && state.visibleContentProof && !state.diagnosticCanLeavePlanetFrame) return "INSPECT_MODE_MISSING";
    if (state.canvasReady && state.visibleContentProof && !state.diagnosticDockRestorable) return "DIAGNOSTIC_RESTORE_MISSING";
    if (state.canvasReady && state.visibleContentProof && !state.copyDiagnosticPreserved) return "COPY_DIAGNOSTIC_LOST";
    if (state.firstFrameDetected && !state.canvasReady) return "CANVAS_READY_PENDING";
    return "VISIBLE_CONTENT_PROOF_PENDING";
  }

  function tryFinalize(reason = "manual") {
    if (state.completionLatched) return true;

    if (
      !state.canvasReady ||
      !state.visibleContentProof ||
      !state.visiblePlanetAvailable ||
      !state.diagnosticCanLeavePlanetFrame ||
      !state.newsGatePassedBeforeF21
    ) {
      return false;
    }

    state.completionLatched = true;
    state.visibleLoadingActive = false;
    state.diagnosticCockpitReady = true;
    state.stableDiagnosticDockAfterCanvasReady = true;
    state.finalReceiptAvailable = true;
    state.currentStage = "F21";
    state.highestStage = "F21";
    state.fibonacciStageAtCompletionLatch = "F21";
    state.f21AfterF13M = true;
    state.completionLatchedAfterCanvasReady = true;
    state.completionLatchedAfterVisibleContent = true;
    state.completionLatchedAfterInspectModeReady = true;
    state.completionBlockedUntilVisibleContent = false;
    state.falseReadyPrevented = true;
    state.postgameStatus = state.planetInspectModeActive ? "PLANET_INSPECT_MODE_ACTIVE" : "READY_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE";
    state.firstFailedCoordinate = "NONE_VISIBLE_CONTENT_AND_INSPECT_READY";
    state.recommendedNextRenewalTarget = "read-postgame-canvas-or-triple-g-receipt";
    state.latestVisibleEvent = "COMPLETION_LATCHED_AFTER_VISIBLE_CONTENT_PROOF";
    state.mainProgressCap = 100;
    state.mainDisplayProgress = 100;

    setStage("F21", "Visible content and inspect-mode proof passed; F21 latch lawful.", {
      lane: "completionLatch",
      status: "LATCHED"
    });

    setLane("completionLatch", {
      status: "LATCHED",
      progress: 100,
      event: "COMPLETION_LATCHED_AFTER_VISIBLE_CONTENT_PROOF",
      stage: "F21",
      message: "READY · PLANET VISIBLE · DIAGNOSTIC AVAILABLE"
    });

    if (state.cockpitMode !== "planet-inspect") {
      setCockpitMode("diagnostic-dock");
    }

    emitLocal("COMPLETION_LATCHED_AFTER_VISIBLE_CONTENT_PROOF", {
      reason,
      visibleContentProof: state.visibleContentProof,
      visiblePlanetAvailable: state.visiblePlanetAvailable,
      diagnosticCanLeavePlanetFrame: state.diagnosticCanLeavePlanetFrame
    }, true);

    publishGlobals();
    scheduleRender();
    return true;
  }

  function reconcileAll(reason = "manual") {
    reconcileFromDataset();

    const receipt = getCanvasReceipt();
    if (receipt && isObject(receipt)) {
      handleCanvasReceiptLight(receipt);
    }

    if (state.canvasReady) {
      startVisibleContentProof(`reconcile-${reason}`);
    }

    updateCompletionGates(`reconcile-${reason}`);
    publishGlobals();
    scheduleRender();
  }

  function renderLaneMarkup() {
    const ledger = refs.ledger || ensureLedger();
    const lanes = ledger.state.lanes || {};

    return LANES.map((def) => {
      const lane = lanes[def.key] || makeLane(def);
      const progress = clamp(lane.progress, 0, 100);
      const status = lane.status || "PENDING";

      return `
        <section class="hearth-ledger-lane" data-lane="${escapeHtml(def.key)}" data-status="${escapeHtml(status)}">
          <div class="hearth-ledger-lane-top">
            <span class="hearth-ledger-lane-title">
              <strong>${escapeHtml(def.label)} · ${escapeHtml(lane.fibonacci || def.fibonacci)}</strong>
              <span>${escapeHtml(lane.message || `${def.label} pending.`)}</span>
            </span>
            <span class="hearth-ledger-lane-status">${escapeHtml(status)}</span>
          </div>
          <div class="hearth-ledger-lane-track">
            <span class="hearth-ledger-lane-fill" style="width:${progress}%"></span>
          </div>
          <div class="hearth-ledger-lane-title">
            <span>event=${escapeHtml(lane.latestEvent || "PENDING")}</span>
          </div>
        </section>
      `;
    }).join("");
  }

  function computeProgress() {
    let progress = state.mainProgressCap || stageProgress(state.currentStage);

    const ledger = refs.ledger || ensureLedger();
    const lanes = ledger.state.lanes || {};

    Object.keys(lanes).forEach((key) => {
      if (key === "completionLatch" && !state.completionLatched) return;
      progress = Math.max(progress, Number(lanes[key].progress || 0));
    });

    if (state.canvasReady) progress = Math.max(progress, 96);
    if (state.canvasReady && !state.visibleContentProof) progress = Math.min(Math.max(progress, 98), 98);
    if (state.visibleContentProof) progress = Math.max(progress, 99);
    if (state.diagnosticCanLeavePlanetFrame && state.visibleContentProof) progress = Math.max(progress, 99);
    if (state.completionLatched) progress = 100;

    state.mainProgressCap = clamp(progress, 0, 100);

    if (state.completionLatched) {
      state.mainDisplayProgress = 100;
    } else {
      state.mainDisplayProgress = Math.max(state.mainDisplayProgress, Math.min(98, state.mainProgressCap));
    }

    return Math.round(state.mainDisplayProgress);
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
    const stage = state.completionLatched ? "F21" : (state.canvasReady ? "F13" : state.currentStage);

    if (refs.title) {
      refs.title.textContent = state.completionLatched
        ? "READY · PLANET VISIBLE · DIAGNOSTIC AVAILABLE"
        : (
          state.canvasReady && !state.visibleContentProof
            ? "CARRIER READY · CONTENT PENDING"
            : (
              state.canvasReady
                ? "VERIFYING VISIBLE CONTENT AND INSPECT MODE"
                : "FORMING HEARTH VISIBLE PLANET"
            )
        );
    }

    if (refs.stage) {
      refs.stage.textContent = state.completionLatched
        ? "F21 · Completion latch"
        : `${stage} · ${stageLabel(stage)}`;
    }

    if (refs.heartbeat) {
      refs.heartbeat.textContent = state.completionLatched
        ? `visibleContent=${state.visibleContentProof} · inspect=${state.diagnosticCanLeavePlanetFrame} · elapsed=${formatElapsed(elapsed)}`
        : (
          state.canvasReady && !state.visibleContentProof
            ? `Canvas carrier ready · Hearth content pending · elapsed=${formatElapsed(elapsed)}`
            : `coherence-side=true · phase=${state.lastCanvasPhase || "pending"} · elapsed=${formatElapsed(elapsed)}`
        );
    }

    if (refs.latest) {
      refs.latest.textContent = `latest=${state.completionLatched ? "COMPLETION_LATCHED_AFTER_VISIBLE_CONTENT_PROOF" : state.latestVisibleEvent}`;
    }

    if (refs.mainFill) {
      refs.mainFill.style.width = `${progress}%`;
    }

    if (refs.mainPercent) {
      refs.mainPercent.textContent = `${progress}%`;
    }

    if (refs.laneList) {
      refs.laneList.innerHTML = renderLaneMarkup();
    }

    if (refs.receiptPre) {
      refs.receiptPre.textContent = getReceiptText();
    }

    if (refs.cockpit) {
      refs.cockpit.dataset.cockpitMode = state.cockpitMode;
      refs.cockpit.dataset.hearthCompletionLatched = String(state.completionLatched);
      refs.cockpit.dataset.hearthVisibleContentProof = String(state.visibleContentProof);
      refs.cockpit.dataset.hearthVisiblePlanetAvailable = String(state.visiblePlanetAvailable);
      refs.cockpit.dataset.hearthCarrierOnlyDetected = String(state.carrierOnlyDetected);
      refs.cockpit.dataset.hearthDiagnosticCanLeavePlanetFrame = String(state.diagnosticCanLeavePlanetFrame);
      refs.cockpit.dataset.hearthCoherenceSemiconductor = CONTRACT;
    }

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
      "Hearth route coherence semiconductor visible-content proof latch active.",
      `Contract ${CONTRACT}`,
      `Receipt ${RECEIPT}`,
      `File ${COHERENCE_FILE}`,
      `Paired with ${INDEX_FILE}`,
      `Shared ledger hydrated ${state.sharedLedgerHydrated}`,
      `Canvas API present ${state.canvasApiPresent}`,
      `Cooperative boot used ${state.cooperativeBootUsed}`,
      `Canvas ready ${state.canvasReady}`,
      `Canvas lane closed ${state.canvasLaneClosed}`,
      `Post-canvas phase bounce prevented ${state.postCanvasPhaseBouncePrevented}`,
      `Stable diagnostic dock after canvas ready ${state.stableDiagnosticDockAfterCanvasReady}`,
      `Visible content proof ${state.visibleContentProof}`,
      `Visible content method ${state.visibleContentProofMethod}`,
      `Carrier only detected ${state.carrierOnlyDetected}`,
      `Visible content sample count ${state.visibleContentSampleCount}`,
      `Visible content variance score ${state.visibleContentVarianceScore}`,
      `Visible content class count ${state.visibleContentClassCount}`,
      `Planet canvas present ${state.planetCanvasPresent}`,
      `Planet canvas nonzero size ${state.planetCanvasNonZeroSize}`,
      `Planet frame painted ${state.planetFramePainted}`,
      `Nonblank planet visible ${state.nonblankPlanetVisible}`,
      `Inspect mode available ${state.inspectModeAvailable}`,
      `Diagnostic can leave planet frame ${state.diagnosticCanLeavePlanetFrame}`,
      `False ready prevented ${state.falseReadyPrevented}`,
      `Completion blocked until visible content ${state.completionBlockedUntilVisibleContent}`,
      `Completion latched ${state.completionLatched}`,
      `Postgame status ${state.postgameStatus}`,
      "Generated image false",
      "GraphicBox false",
      "WebGL false",
      "Visual pass claimed false",
      `First failed coordinate ${state.firstFailedCoordinate}`,
      `Recommended next renewal target ${state.recommendedNextRenewalTarget}`,
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

    push({
      id: "VISIBLE_CONTENT_PROOF_DIAGNOSTIC_COPIED",
      stage: state.currentStage,
      lane: "ledger",
      status: ok ? "COPIED" : "COPY_FAILED",
      message: ok ? "Visible-content proof diagnostic copied." : "Visible-content proof diagnostic copy failed."
    });

    return ok;
  }

  function getReceipt() {
    const ledger = refs.ledger || root.HEARTH_LOAD_LEDGER || null;

    return {
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
      chronologicalFibonacciAlignment: true,
      sharedLedgerHydrated: state.sharedLedgerHydrated,

      newsProtocolActive: true,
      northGateReady: state.northGateReady,
      eastGateReady: state.eastGateReady,
      westGateReady: state.westGateReady,
      southGateReady: state.southGateReady,
      newsGatePassedBeforeF21: state.newsGatePassedBeforeF21,

      fibonacciSequenceActive: true,
      fibonacciStageAtCanvasReady: state.fibonacciStageAtCanvasReady,
      fibonacciStageAtVisibleContentProof: state.fibonacciStageAtVisibleContentProof,
      fibonacciStageAtCompletionLatch: state.fibonacciStageAtCompletionLatch,
      f13SubsequenceComplete: state.f13SubsequenceComplete,
      f13LastRequiredEvent: state.f13LastRequiredEvent,
      f21AfterF13M: state.f21AfterF13M,

      visibleContentLatchActive: true,
      completionReceiptRequiresVisiblePlanet: true,
      completionReceiptRequiresVisibleContent: true,
      completionReceiptRequiresInspectMode: true,
      visibleContentProof: state.visibleContentProof,
      visibleContentProofStarted: state.visibleContentProofStarted,
      visibleContentProofMethod: state.visibleContentProofMethod,
      visibleContentProofError: state.visibleContentProofError,
      visibleContentSampleCount: state.visibleContentSampleCount,
      visibleContentVarianceScore: state.visibleContentVarianceScore,
      visibleContentClassCount: state.visibleContentClassCount,
      visibleContentClasses: clonePlain(state.visibleContentClasses),
      visibleContentLandSampleCount: state.visibleContentLandSampleCount,
      visibleContentWaterSampleCount: state.visibleContentWaterSampleCount,
      visibleContentOtherSampleCount: state.visibleContentOtherSampleCount,
      carrierOnlyDetected: state.carrierOnlyDetected,
      explicitContentReceiptProof: state.explicitContentReceiptProof,
      renderedAfterTexture: state.renderedAfterTexture,
      falseReadyPrevented: state.falseReadyPrevented,
      completionBlockedUntilVisibleContent: state.completionBlockedUntilVisibleContent,
      completionLatchedAfterVisibleContent: state.completionLatchedAfterVisibleContent,

      visiblePlanetAvailable: state.visiblePlanetAvailable,
      planetCanvasPresent: state.planetCanvasPresent,
      planetCanvasNonZeroSize: state.planetCanvasNonZeroSize,
      planetFramePainted: state.planetFramePainted,
      nonblankPlanetVisible: state.nonblankPlanetVisible,
      planetNotObstructed: state.planetNotObstructed,

      canvasReady: state.canvasReady,
      canvasCarrierMounted: state.canvasCarrierMounted,
      firstFrameDetected: state.firstFrameDetected,
      imageRendered: state.imageRendered,
      dragInspectionBound: state.dragInspectionBound,
      atlasBuildComplete: state.atlasBuildComplete,
      textureComposeComplete: state.textureComposeComplete,

      inspectModeAvailable: state.inspectModeAvailable,
      inspectPlanetControlAvailable: state.inspectPlanetControlAvailable,
      diagnosticCanLeavePlanetFrame: state.diagnosticCanLeavePlanetFrame,
      diagnosticDockHiddenForInspection: state.diagnosticDockHiddenForInspection,
      showDiagnosticTabVisible: state.showDiagnosticTabVisible,
      showDiagnosticTabVisibleWhenHidden: state.showDiagnosticTabVisibleWhenHidden,
      diagnosticDockRestorable: state.diagnosticDockRestorable,
      copyDiagnosticPreserved: state.copyDiagnosticPreserved,
      receiptOverlayIndependent: state.receiptOverlayIndependent,

      strictCanvasReadyLatchActive: true,
      canvasReadinessBarrierOpen: state.canvasReadinessBarrierOpen,
      visibleContentBarrierOpen: state.visibleContentBarrierOpen,
      stableDiagnosticDockAfterCanvasReady: state.stableDiagnosticDockAfterCanvasReady,
      postCanvasPhaseBouncePrevented: state.postCanvasPhaseBouncePrevented,
      stageRegressionPrevented: state.stageRegressionPrevented,
      ignoredDuplicateCanvasEvents: state.ignoredDuplicateCanvasEvents,
      completionLatchedAfterCanvasReady: state.completionLatchedAfterCanvasReady,
      completionLatchedAfterInspectModeReady: state.completionLatchedAfterInspectModeReady,

      cooperativeBootAvailable: state.cooperativeBootAvailable,
      cooperativeBootUsed: state.cooperativeBootUsed,
      syncBootFallbackUsed: state.syncBootFallbackUsed,
      canvasCarrierMethod: state.canvasCarrierMethod,
      canvasCarrierRequested: state.canvasCarrierRequested,
      canvasCarrierHandoffOk: state.canvasCarrierHandoffOk,
      canvasCarrierHandoffError: state.canvasCarrierHandoffError,

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

      atlasBuildStarted: state.atlasBuildStarted,
      atlasBuildProgress: state.atlasBuildProgress,
      textureComposeStarted: state.textureComposeStarted,
      textureComposeProgress: state.textureComposeProgress,

      runtimeTablePresent: state.runtimeTablePresent,
      runtimeTableMode: state.runtimeTableMode,
      runtimeTablePlanAttempted: state.runtimeTablePlanAttempted,
      runtimeTablePlanCreated: state.runtimeTablePlanCreated,
      runtimeTablePlanError: state.runtimeTablePlanError,
      sourceAuthorityHeld: true,

      currentStage: state.currentStage,
      highestStage: state.highestStage,
      completionLatched: state.completionLatched,
      visibleLoadingActive: state.visibleLoadingActive,
      diagnosticCockpitReady: state.diagnosticCockpitReady,
      cockpitMode: state.cockpitMode,
      dockVisible: state.dockVisible,
      fullCockpitExpanded: state.fullCockpitExpanded,

      partialReceiptAvailable: state.partialReceiptAvailable,
      finalReceiptAvailable: state.finalReceiptAvailable,
      copyDiagnosticArmed: state.copyDiagnosticArmed,
      receiptToggleReady: state.receiptToggleReady,
      buttonsReachable: state.buttonsReachable,

      postgameStatus: state.postgameStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      latestVisibleEvent: state.latestVisibleEvent,
      mainDisplayProgress: Math.round(state.mainDisplayProgress),
      mainProgressCap: state.mainProgressCap,
      heartbeatElapsedMs: state.heartbeatElapsedMs,

      f13Events: clonePlain(state.f13Events),
      f13EventOrder: clonePlain(state.f13EventOrder),
      phaseEvents: clonePlain(state.phaseEvents),
      archivedLateEvents: clonePlain(state.archivedLateEvents),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),
      sharedLedger: ledger && ledger.state ? clonePlain(ledger.state) : null,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      updatedAt: nowIso()
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

    const f13 = receipt.f13EventOrder.map((event) => `- ${event}`).join("\n") || "- none";

    const phases = receipt.phaseEvents.map((event) => (
      `- ${event.at || ""} :: ${event.phase || ""} :: progress=${event.percent || ""} :: ${event.message || ""}`
    )).join("\n") || "- none";

    const archived = receipt.archivedLateEvents.slice(-140).map((event) => (
      `- ${event.at || ""} :: ${event.event || ""} :: stage=${event.stage || ""} :: reason=${event.reason || ""} :: ${event.message || ""}`
    )).join("\n") || "- none";

    const local = receipt.localEvents.map((event) => (
      `- ${event.at || ""} :: ${event.event || ""}`
    )).join("\n") || "- none";

    const errors = receipt.errors.map((error) => (
      `- ${error.at || ""} :: ${error.code || ""} :: ${error.message || ""}`
    )).join("\n") || "- none";

    return [
      "HEARTH_ROUTE_COHERENCE_SEMICONDUCTOR_VISIBLE_CONTENT_PROOF_LATCH_RECEIPT",
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
      `chronologicalFibonacciAlignment=${receipt.chronologicalFibonacciAlignment}`,
      `sharedLedgerHydrated=${receipt.sharedLedgerHydrated}`,
      "",
      `newsProtocolActive=${receipt.newsProtocolActive}`,
      `northGateReady=${receipt.northGateReady}`,
      `eastGateReady=${receipt.eastGateReady}`,
      `westGateReady=${receipt.westGateReady}`,
      `southGateReady=${receipt.southGateReady}`,
      `newsGatePassedBeforeF21=${receipt.newsGatePassedBeforeF21}`,
      "",
      `fibonacciSequenceActive=${receipt.fibonacciSequenceActive}`,
      `fibonacciStageAtCanvasReady=${receipt.fibonacciStageAtCanvasReady}`,
      `fibonacciStageAtVisibleContentProof=${receipt.fibonacciStageAtVisibleContentProof}`,
      `fibonacciStageAtCompletionLatch=${receipt.fibonacciStageAtCompletionLatch}`,
      `f13SubsequenceComplete=${receipt.f13SubsequenceComplete}`,
      `f13LastRequiredEvent=${receipt.f13LastRequiredEvent}`,
      `f21AfterF13M=${receipt.f21AfterF13M}`,
      "",
      `visibleContentLatchActive=${receipt.visibleContentLatchActive}`,
      `completionReceiptRequiresVisiblePlanet=${receipt.completionReceiptRequiresVisiblePlanet}`,
      `completionReceiptRequiresVisibleContent=${receipt.completionReceiptRequiresVisibleContent}`,
      `completionReceiptRequiresInspectMode=${receipt.completionReceiptRequiresInspectMode}`,
      `visibleContentProof=${receipt.visibleContentProof}`,
      `visibleContentProofStarted=${receipt.visibleContentProofStarted}`,
      `visibleContentProofMethod=${receipt.visibleContentProofMethod}`,
      `visibleContentProofError=${receipt.visibleContentProofError}`,
      `visibleContentSampleCount=${receipt.visibleContentSampleCount}`,
      `visibleContentVarianceScore=${receipt.visibleContentVarianceScore}`,
      `visibleContentClassCount=${receipt.visibleContentClassCount}`,
      `visibleContentClasses=${(receipt.visibleContentClasses || []).join(",")}`,
      `visibleContentLandSampleCount=${receipt.visibleContentLandSampleCount}`,
      `visibleContentWaterSampleCount=${receipt.visibleContentWaterSampleCount}`,
      `visibleContentOtherSampleCount=${receipt.visibleContentOtherSampleCount}`,
      `carrierOnlyDetected=${receipt.carrierOnlyDetected}`,
      `explicitContentReceiptProof=${receipt.explicitContentReceiptProof}`,
      `renderedAfterTexture=${receipt.renderedAfterTexture}`,
      `falseReadyPrevented=${receipt.falseReadyPrevented}`,
      `completionBlockedUntilVisibleContent=${receipt.completionBlockedUntilVisibleContent}`,
      `completionLatchedAfterVisibleContent=${receipt.completionLatchedAfterVisibleContent}`,
      "",
      `visiblePlanetAvailable=${receipt.visiblePlanetAvailable}`,
      `planetCanvasPresent=${receipt.planetCanvasPresent}`,
      `planetCanvasNonZeroSize=${receipt.planetCanvasNonZeroSize}`,
      `planetFramePainted=${receipt.planetFramePainted}`,
      `nonblankPlanetVisible=${receipt.nonblankPlanetVisible}`,
      `planetNotObstructed=${receipt.planetNotObstructed}`,
      "",
      `canvasReady=${receipt.canvasReady}`,
      `canvasCarrierMounted=${receipt.canvasCarrierMounted}`,
      `firstFrameDetected=${receipt.firstFrameDetected}`,
      `imageRendered=${receipt.imageRendered}`,
      `dragInspectionBound=${receipt.dragInspectionBound}`,
      `atlasBuildComplete=${receipt.atlasBuildComplete}`,
      `textureComposeComplete=${receipt.textureComposeComplete}`,
      "",
      `inspectModeAvailable=${receipt.inspectModeAvailable}`,
      `inspectPlanetControlAvailable=${receipt.inspectPlanetControlAvailable}`,
      `diagnosticCanLeavePlanetFrame=${receipt.diagnosticCanLeavePlanetFrame}`,
      `diagnosticDockHiddenForInspection=${receipt.diagnosticDockHiddenForInspection}`,
      `showDiagnosticTabVisible=${receipt.showDiagnosticTabVisible}`,
      `showDiagnosticTabVisibleWhenHidden=${receipt.showDiagnosticTabVisibleWhenHidden}`,
      `diagnosticDockRestorable=${receipt.diagnosticDockRestorable}`,
      `copyDiagnosticPreserved=${receipt.copyDiagnosticPreserved}`,
      `receiptOverlayIndependent=${receipt.receiptOverlayIndependent}`,
      "",
      `strictCanvasReadyLatchActive=${receipt.strictCanvasReadyLatchActive}`,
      `canvasReadinessBarrierOpen=${receipt.canvasReadinessBarrierOpen}`,
      `visibleContentBarrierOpen=${receipt.visibleContentBarrierOpen}`,
      `stableDiagnosticDockAfterCanvasReady=${receipt.stableDiagnosticDockAfterCanvasReady}`,
      `postCanvasPhaseBouncePrevented=${receipt.postCanvasPhaseBouncePrevented}`,
      `stageRegressionPrevented=${receipt.stageRegressionPrevented}`,
      `ignoredDuplicateCanvasEvents=${receipt.ignoredDuplicateCanvasEvents}`,
      `completionLatchedAfterCanvasReady=${receipt.completionLatchedAfterCanvasReady}`,
      `completionLatchedAfterInspectModeReady=${receipt.completionLatchedAfterInspectModeReady}`,
      "",
      `cooperativeBootAvailable=${receipt.cooperativeBootAvailable}`,
      `cooperativeBootUsed=${receipt.cooperativeBootUsed}`,
      `syncBootFallbackUsed=${receipt.syncBootFallbackUsed}`,
      `canvasCarrierMethod=${receipt.canvasCarrierMethod}`,
      `canvasCarrierRequested=${receipt.canvasCarrierRequested}`,
      `canvasCarrierHandoffOk=${receipt.canvasCarrierHandoffOk}`,
      `canvasCarrierHandoffError=${receipt.canvasCarrierHandoffError}`,
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
      `canvasLaneClosed=${receipt.canvasLaneClosed}`,
      "",
      `atlasBuildStarted=${receipt.atlasBuildStarted}`,
      `atlasBuildProgress=${receipt.atlasBuildProgress}`,
      `textureComposeStarted=${receipt.textureComposeStarted}`,
      `textureComposeProgress=${receipt.textureComposeProgress}`,
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
      `completionLatched=${receipt.completionLatched}`,
      `visibleLoadingActive=${receipt.visibleLoadingActive}`,
      `diagnosticCockpitReady=${receipt.diagnosticCockpitReady}`,
      `cockpitMode=${receipt.cockpitMode}`,
      `dockVisible=${receipt.dockVisible}`,
      `fullCockpitExpanded=${receipt.fullCockpitExpanded}`,
      "",
      `partialReceiptAvailable=${receipt.partialReceiptAvailable}`,
      `finalReceiptAvailable=${receipt.finalReceiptAvailable}`,
      `copyDiagnosticArmed=${receipt.copyDiagnosticArmed}`,
      `receiptToggleReady=${receipt.receiptToggleReady}`,
      `buttonsReachable=${receipt.buttonsReachable}`,
      "",
      `postgameStatus=${receipt.postgameStatus}`,
      `firstFailedCoordinate=${receipt.firstFailedCoordinate}`,
      `recommendedNextRenewalTarget=${receipt.recommendedNextRenewalTarget}`,
      `latestVisibleEvent=${receipt.latestVisibleEvent}`,
      `mainDisplayProgress=${receipt.mainDisplayProgress}`,
      `mainProgressCap=${receipt.mainProgressCap}`,
      `heartbeatElapsedMs=${receipt.heartbeatElapsedMs}`,
      "",
      "LEDGER_LANES",
      lanes,
      "",
      "LEDGER_SCRIPTS",
      scripts,
      "",
      "F13_EVENT_ORDER",
      f13,
      "",
      "CANVAS_PHASE_EVENTS",
      phases,
      "",
      "ARCHIVED_LATE_EVENTS",
      archived,
      "",
      "LOCAL_EVENTS",
      local,
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
    root.HEARTH.coherenceSemiconductor = api;

    root.HEARTH_ROUTE_CONDUCTOR = api;
    root.HearthRouteConductor = api;
    root.HEARTH_ACTIVE_ROUTE = api;
    root.HEARTH_ROUTE_COHERENCE_SEMICONDUCTOR = api;
    root.HEARTH_ROUTE_CONDUCTOR_CONTRACT = CONTRACT;
    root.HEARTH_ROUTE_COHERENCE_SEMICONDUCTOR_RECEIPT = getReceipt();
    root.HEARTH_ROUTE_CONDUCTOR_RECEIPT = root.HEARTH_ROUTE_COHERENCE_SEMICONDUCTOR_RECEIPT;
    root.HEARTH_ROUTE_CONDUCTOR_POSTGAME_RECEIPT = root.HEARTH_ROUTE_COHERENCE_SEMICONDUCTOR_RECEIPT;

    root.__HEARTH_ACTIVE_ROUTE_FILE__ = COHERENCE_FILE;
    root.__HEARTH_ACTIVE_ROUTE_CONDUCTOR__ = COHERENCE_FILE;
    root.__HEARTH_ACTIVE_ROUTE_CONTRACT__ = CONTRACT;
    root.__HEARTH_CONSTRAINT_SEMICONDUCTOR_FILE__ = INDEX_FILE;
    root.__HEARTH_COHERENCE_SEMICONDUCTOR_FILE__ = COHERENCE_FILE;
    root.__HEARTH_RETIRED_CLIMATE_ROUTE__ = RETIRED_CLIMATE_FILE;
    root.__HEARTH_RETIRED_CLIMATE_ROUTE_ACTIVE_CARRIER__ = false;

    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthCoherenceSemiconductorLoaded = "true";
    dataset.hearthCoherenceSemiconductorContract = CONTRACT;
    dataset.hearthCoherenceSemiconductorReceipt = RECEIPT;
    dataset.hearthPairedSemiconductor = "true";
    dataset.hearthConstraintSemiconductor = INDEX_FILE;
    dataset.hearthCoherenceSemiconductor = COHERENCE_FILE;
    dataset.hearthIndexJsStartsProcess = "true";
    dataset.hearthJsFinishesProcess = "true";
    dataset.hearthSynchronizedLoading = "true";
    dataset.hearthChronologicalFibonacciAlignment = "true";
    dataset.hearthActiveRouteFile = COHERENCE_FILE;
    dataset.hearthActiveRouteConductor = COHERENCE_FILE;
    dataset.hearthActiveRouteContract = CONTRACT;

    dataset.hearthNewsProtocolActive = "true";
    dataset.hearthNorthGateReady = String(state.northGateReady);
    dataset.hearthEastGateReady = String(state.eastGateReady);
    dataset.hearthWestGateReady = String(state.westGateReady);
    dataset.hearthSouthGateReady = String(state.southGateReady);
    dataset.hearthNewsGatePassedBeforeF21 = String(state.newsGatePassedBeforeF21);

    dataset.hearthFibonacciSequenceActive = "true";
    dataset.hearthFibonacciStageAtCanvasReady = state.fibonacciStageAtCanvasReady;
    dataset.hearthFibonacciStageAtVisibleContentProof = state.fibonacciStageAtVisibleContentProof;
    dataset.hearthFibonacciStageAtCompletionLatch = state.fibonacciStageAtCompletionLatch;
    dataset.hearthF13SubsequenceComplete = String(state.f13SubsequenceComplete);
    dataset.hearthF13LastRequiredEvent = state.f13LastRequiredEvent;
    dataset.hearthF21AfterF13m = String(state.f21AfterF13M);

    dataset.hearthCompletionReceiptRequiresVisiblePlanet = "true";
    dataset.hearthCompletionReceiptRequiresVisibleContent = "true";
    dataset.hearthCompletionReceiptRequiresInspectMode = "true";
    dataset.hearthVisibleContentProof = String(state.visibleContentProof);
    dataset.hearthVisibleContentProofMethod = state.visibleContentProofMethod;
    dataset.hearthVisibleContentSampleCount = String(state.visibleContentSampleCount);
    dataset.hearthVisibleContentVarianceScore = String(state.visibleContentVarianceScore);
    dataset.hearthVisibleContentClassCount = String(state.visibleContentClassCount);
    dataset.hearthCarrierOnlyDetected = String(state.carrierOnlyDetected);
    dataset.hearthFalseReadyPrevented = String(state.falseReadyPrevented);
    dataset.hearthCompletionBlockedUntilVisibleContent = String(state.completionBlockedUntilVisibleContent);
    dataset.hearthCompletionLatchedAfterVisibleContent = String(state.completionLatchedAfterVisibleContent);

    dataset.hearthVisiblePlanetAvailable = String(state.visiblePlanetAvailable);
    dataset.hearthPlanetCanvasPresent = String(state.planetCanvasPresent);
    dataset.hearthPlanetCanvasNonZeroSize = String(state.planetCanvasNonZeroSize);
    dataset.hearthPlanetFramePainted = String(state.planetFramePainted);
    dataset.hearthNonblankPlanetVisible = String(state.nonblankPlanetVisible);
    dataset.hearthPlanetNotObstructed = String(state.planetNotObstructed);

    dataset.hearthCanvasReady = String(state.canvasReady);
    dataset.hearthCanvasCarrierMounted = String(state.canvasCarrierMounted);
    dataset.hearthFirstFrameDetected = String(state.firstFrameDetected);
    dataset.hearthImageRendered = String(state.imageRendered);
    dataset.hearthDragInspectionBound = String(state.dragInspectionBound);

    dataset.hearthInspectModeAvailable = String(state.inspectModeAvailable);
    dataset.hearthInspectPlanetControlAvailable = String(state.inspectPlanetControlAvailable);
    dataset.hearthDiagnosticCanLeavePlanetFrame = String(state.diagnosticCanLeavePlanetFrame);
    dataset.hearthDiagnosticDockHiddenForInspection = String(state.diagnosticDockHiddenForInspection);
    dataset.hearthShowDiagnosticTabVisible = String(state.showDiagnosticTabVisible);
    dataset.hearthShowDiagnosticTabVisibleWhenHidden = String(state.showDiagnosticTabVisibleWhenHidden);
    dataset.hearthDiagnosticDockRestorable = String(state.diagnosticDockRestorable);
    dataset.hearthCopyDiagnosticPreserved = String(state.copyDiagnosticPreserved);

    dataset.hearthStrictCanvasReadyLatchActive = "true";
    dataset.hearthVisibleContentLatchActive = "true";
    dataset.hearthCanvasReadinessBarrierOpen = String(state.canvasReadinessBarrierOpen);
    dataset.hearthVisibleContentBarrierOpen = String(state.visibleContentBarrierOpen);
    dataset.hearthStableDiagnosticDockAfterCanvasReady = String(state.stableDiagnosticDockAfterCanvasReady);
    dataset.hearthPostCanvasPhaseBouncePrevented = String(state.postCanvasPhaseBouncePrevented);
    dataset.hearthCompletionLatchedAfterCanvasReady = String(state.completionLatchedAfterCanvasReady);
    dataset.hearthCompletionLatchedAfterInspectModeReady = String(state.completionLatchedAfterInspectModeReady);

    dataset.hearthCooperativeBootAvailable = String(state.cooperativeBootAvailable);
    dataset.hearthCooperativeBootUsed = String(state.cooperativeBootUsed);
    dataset.hearthSyncBootFallbackUsed = String(state.syncBootFallbackUsed);
    dataset.hearthCanvasCarrierMethod = state.canvasCarrierMethod;
    dataset.hearthCanvasLaneClosed = String(state.canvasLaneClosed);

    dataset.hearthCompletionLatched = String(state.completionLatched);
    dataset.hearthVisibleLoadingActive = String(state.visibleLoadingActive);
    dataset.hearthDiagnosticCockpitReady = String(state.diagnosticCockpitReady);
    dataset.hearthCockpitMode = state.cockpitMode;
    dataset.hearthPostgameStatus = state.postgameStatus;
    dataset.hearthFirstFailedCoordinate = state.firstFailedCoordinate;
    dataset.hearthRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;

    dataset.hearthRetiredClimateRoute = RETIRED_CLIMATE_FILE;
    dataset.hearthRetiredClimateRouteActiveCarrier = "false";
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  function acceptConstraintSemiconductor(payload = {}) {
    state.indexConstraintAccepted = true;
    state.indexConstraintPresent = true;

    if (payload.mount && payload.mount.nodeType === 1) refs.mount = payload.mount;
    if (payload.cockpit && payload.cockpit.nodeType === 1) refs.cockpit = payload.cockpit;
    if (payload.sharedLedger && isObject(payload.sharedLedger)) {
      root.HEARTH_LOAD_LEDGER = payload.sharedLedger;
      refs.ledger = payload.sharedLedger;
    }

    ensureLedger();
    ensureMount();
    hydrateCockpit();

    emit("CONSTRAINT_SEMICONDUCTOR_ACCEPTED", {
      calledBy: payload.calledBy || "",
      constraintSemiconductor: INDEX_FILE,
      coherenceSemiconductor: COHERENCE_FILE
    }, {
      stage: "F8",
      lane: "conductorHydration",
      status: "ACCEPTED"
    });

    return true;
  }

  function hydrateIndexBridge(payload = {}) {
    return acceptConstraintSemiconductor(payload);
  }

  function attachIndexBridge(payload = {}) {
    return acceptConstraintSemiconductor(payload);
  }

  function receiveIndexBridge(payload = {}) {
    return acceptConstraintSemiconductor(payload);
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
      } else {
        publishGlobals();
        scheduleRender();
      }
    }, state.canvasReady && !state.visibleContentProof ? 2500 : 1000);
  }

  function startReconcileLoop() {
    if (reconcileTimer) root.clearInterval(reconcileTimer);

    reconcileTimer = root.setInterval(() => {
      if (!state.completionLatched) {
        reconcileAll("interval");
      }
    }, state.canvasReady && !state.visibleContentProof ? 2600 : 900);
  }

  function boot(payload = {}) {
    if (bootStarted) {
      acceptPayload(payload);
      publishGlobals();
      return getReceipt();
    }

    bootStarted = true;
    state.startedAt = nowIso();
    state.startedAtMs = nowMs();
    state.updatedAt = state.startedAt;

    acceptPayload(payload);
    retireClimateRoute();
    ensureLedger();
    ensureMount();
    hydrateCockpit();

    checkRuntimeTable();

    setLane("conductorHydration", {
      status: "HYDRATED",
      progress: stageProgress("F8"),
      event: "COHERENCE_SEMICONDUCTOR_BOOTED",
      stage: "F8",
      message: "Coherence semiconductor booted and visible-content proof latch is active."
    });

    setStage("F8", "Coherence semiconductor booted.", {
      lane: "conductorHydration",
      status: "HYDRATED"
    });

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

  function acceptPayload(payload = {}) {
    if (!isObject(payload)) return;

    if (payload.mount && payload.mount.nodeType === 1) refs.mount = payload.mount;
    if (payload.cockpit && payload.cockpit.nodeType === 1) refs.cockpit = payload.cockpit;
    if (payload.sharedLedger && isObject(payload.sharedLedger)) {
      root.HEARTH_LOAD_LEDGER = payload.sharedLedger;
      refs.ledger = payload.sharedLedger;
    }
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

    push({
      id: "VISIBLE_CONTENT_PROOF_SEMICONDUCTOR_DISPOSED",
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

    acceptConstraintSemiconductor,
    hydrateIndexBridge,
    attachIndexBridge,
    receiveIndexBridge,

    handleCanvasPhase,
    handleCanvasReceipt,
    reconcile: reconcileAll,
    tryFinalize,
    setCockpitMode,
    proveVisibleContent,
    getReceipt,
    getReceiptText,
    copyDiagnostic,

    supportsPairedSemiconductor: true,
    supportsCoherenceSideSemiconductor: true,
    supportsSynchronizedLoading: true,
    supportsSharedLedgerHydration: true,
    supportsNewsProtocol: true,
    supportsFibonacciSequence: true,
    supportsChronologicalFibonacciAlignment: true,
    supportsF13PhaseIntegration: true,
    supportsVisibleContentCompletionGate: true,
    supportsVisibleContentProofLatch: true,
    supportsFalseReadyPrevention: true,
    supportsPostReadyBouncePrevention: true,
    supportsStableDiagnosticDockAfterCanvasReady: true,
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
    ownsSourceStackTruth: false,
    ownsHtmlStructure: false,
    ownsClimateRouteRendering: false,
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

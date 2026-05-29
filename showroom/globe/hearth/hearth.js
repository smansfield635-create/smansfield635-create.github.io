// /showroom/globe/hearth/hearth.js
// HEARTH_ROUTE_RUNTIME_TABLE_CHECKPOINT_GOVERNOR_CONSUMER_INSPECT_GATE_TNT_v4
// Full-file replacement.
// Coherence-side semiconductor only.
// Purpose:
// - Consume Runtime Table NEWS/Fibonacci chronological checkpoint governor.
// - Enforce one visible active checkpoint at a time.
// - Prevent simultaneous visible loading bars, post-ready canvas bounce, false READY, premature F21, and blocked 100% completion.
// - Preserve/restore Copy diagnostic, Show receipt, Inspect planet, and Show diagnostic.
// - Require visible-content proof + inspect-mode proof + NEWS gates before F21.
// Does not own:
// - first-paint survival from blank page
// - Runtime Table law
// - Triple G diagnostic law
// - planet truth
// - child-channel truth
// - canvas pixel drawing
// - atlas generation
// - texture generation
// - touch/drag physics truth
// - climate-route rendering
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_ROUTE_RUNTIME_TABLE_CHECKPOINT_GOVERNOR_CONSUMER_INSPECT_GATE_TNT_v4";
  const RECEIPT = "HEARTH_ROUTE_RUNTIME_TABLE_CHECKPOINT_GOVERNOR_CONSUMER_INSPECT_GATE_RECEIPT_v4";
  const PREVIOUS_CONTRACT = "HEARTH_ROUTE_COHERENCE_SEMICONDUCTOR_VISIBLE_CONTENT_PROOF_LATCH_TNT_v3";
  const BASELINE_CONTRACT = "HEARTH_ROUTE_CHECKPOINT_GOVERNOR_CONSUMER_AND_INSPECT_GATE_PRECODE_FINAL_DRAFT_v4";
  const VERSION = "2026-05-29.hearth-route-runtime-table-checkpoint-governor-consumer-inspect-gate-v4";

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

  const CHECKPOINT_ACTIONS = Object.freeze({
    ADMIT: "ADMIT",
    QUEUE: "QUEUE",
    ARCHIVE: "ARCHIVE",
    BLOCK: "BLOCK"
  });

  const FALLBACK_CHECKPOINTS = Object.freeze([
    { id: "F1A_HTML_SHELL_RENDERED", event: "HTML_SHELL_RENDERED", rank: 1, fibonacci: "F1A", value: 1, lane: "shell", progress: 6, label: "HTML shell rendered" },
    { id: "F1B_LOAD_LEDGER_INITIALIZED", event: "LOAD_LEDGER_INITIALIZED", aliases: ["HEARTH_LOAD_LEDGER_MONOTONIC_INITIALIZED", "NEWS_FIBONACCI_LEDGER_GUARD_ACTIVE"], rank: 2, fibonacci: "F1B", value: 1, lane: "ledger", progress: 12, label: "Load ledger initialized" },
    { id: "F2_FIRST_PAINT_COCKPIT_VISIBLE", event: "FIRST_PAINT_COCKPIT_VISIBLE", rank: 3, fibonacci: "F2", value: 2, lane: "staticCockpit", progress: 22, label: "First-paint cockpit visible" },
    { id: "F3_SCRIPT_ORDER_COMPLETE", event: "SCRIPT_ORDER_COMPLETE", aliases: ["SCRIPT_LOADED", "SCRIPT_ORDER_VISIBLE"], rank: 4, fibonacci: "F3", value: 3, lane: "scriptOrder", progress: 36, label: "Script order complete" },
    { id: "F5_AUTHORITY_AVAILABILITY_READY", event: "AUTHORITY_AVAILABILITY_READY", aliases: ["RUNTIME_TABLE_AVAILABLE", "AUTHORITY_AVAILABLE"], rank: 5, fibonacci: "F5", value: 5, lane: "authorityAvailability", progress: 55, label: "Authority availability ready" },
    { id: "F8_CONDUCTOR_HYDRATED", event: "CONDUCTOR_HYDRATED", aliases: ["CONDUCTOR_HYDRATED_EXISTING_COCKPIT", "COHERENCE_SEMICONDUCTOR_BOOTED"], rank: 6, fibonacci: "F8", value: 8, lane: "conductorHydration", progress: 72, label: "Conductor hydrated" },
    { id: "F13A_CANVAS_COOPERATIVE_BOOT_STARTED", event: "CANVAS_COOPERATIVE_BOOT_STARTED", rank: 7, fibonacci: "F13A", value: 13, lane: "canvasAndDiagnostic", progress: 78, label: "Canvas cooperative boot started" },
    { id: "F13B_CANVAS_MOUNT_CREATED", event: "CANVAS_MOUNT_CREATED", rank: 8, fibonacci: "F13B", value: 13, lane: "canvasAndDiagnostic", progress: 81, label: "Canvas mount created" },
    { id: "F13C_CANVAS_CONTEXT_READY", event: "CANVAS_CONTEXT_READY", rank: 9, fibonacci: "F13C", value: 13, lane: "canvasAndDiagnostic", progress: 84, label: "Canvas context ready" },
    { id: "F13D_DRAG_INSPECTION_BOUND", event: "DRAG_INSPECTION_BOUND", rank: 10, fibonacci: "F13D", value: 13, lane: "canvasAndDiagnostic", progress: 86, label: "Drag inspection bound" },
    { id: "F13E_ATLAS_BUILD_STARTED", event: "ATLAS_BUILD_STARTED", rank: 11, fibonacci: "F13E", value: 13, lane: "canvasAndDiagnostic", progress: 88, label: "Atlas build started" },
    { id: "F13F_ATLAS_BUILD_COMPLETE", event: "ATLAS_BUILD_COMPLETE", rank: 12, fibonacci: "F13F", value: 13, lane: "canvasAndDiagnostic", progress: 91, label: "Atlas build complete" },
    { id: "F13G_TEXTURE_COMPOSE_STARTED", event: "TEXTURE_COMPOSE_STARTED", rank: 13, fibonacci: "F13G", value: 13, lane: "canvasAndDiagnostic", progress: 93, label: "Texture compose started" },
    { id: "F13H_TEXTURE_COMPOSE_COMPLETE", event: "TEXTURE_COMPOSE_COMPLETE", rank: 14, fibonacci: "F13H", value: 13, lane: "canvasAndDiagnostic", progress: 96, label: "Texture compose complete" },
    { id: "F13I_FIRST_FRAME_REQUESTED", event: "FIRST_FRAME_REQUESTED", rank: 15, fibonacci: "F13I", value: 13, lane: "canvasAndDiagnostic", progress: 97, label: "First frame requested" },
    { id: "F13J_FIRST_FRAME_DETECTED", event: "FIRST_FRAME_DETECTED", rank: 16, fibonacci: "F13J", value: 13, lane: "canvasAndDiagnostic", progress: 98, label: "First frame detected" },
    { id: "F13K_CANVAS_READY", event: "CANVAS_READY", rank: 17, fibonacci: "F13K", value: 13, lane: "canvasAndDiagnostic", progress: 98, label: "Canvas ready" },
    { id: "F13L_VISIBLE_CONTENT_PROOF_STARTED", event: "VISIBLE_CONTENT_PROOF_STARTED", rank: 18, fibonacci: "F13L", value: 13, lane: "visiblePlanetProof", progress: 98, label: "Visible content proof started" },
    { id: "F13M_VISIBLE_CONTENT_PROOF_PASSED", event: "VISIBLE_CONTENT_PROOF_PASSED", rank: 19, fibonacci: "F13M", value: 13, lane: "visiblePlanetProof", progress: 98, label: "Visible content proof passed" },
    { id: "F13N_INSPECT_MODE_READY", event: "INSPECT_MODE_READY", rank: 20, fibonacci: "F13N", value: 13, lane: "inspectMode", progress: 98, label: "Inspect mode ready" },
    { id: "F21_COMPLETION_LATCHED", event: "COMPLETION_LATCHED", aliases: ["COMPLETION_LATCHED_AFTER_VISIBLE_CONTENT_PROOF", "COMPLETION_LATCHED_AFTER_CANVAS_READY"], rank: 21, fibonacci: "F21", value: 21, lane: "completionLatch", progress: 100, label: "Completion latched" }
  ]);

  const CHECKPOINT_PHASES = Object.freeze({
    CANVAS_COOPERATIVE_BOOT_STARTED: true,
    CANVAS_MOUNT_CREATED: true,
    CANVAS_CONTEXT_READY: true,
    DRAG_INSPECTION_BOUND: true,
    ATLAS_BUILD_STARTED: true,
    ATLAS_BUILD_COMPLETE: true,
    TEXTURE_COMPOSE_STARTED: true,
    TEXTURE_COMPOSE_COMPLETE: true,
    FIRST_FRAME_REQUESTED: true,
    FIRST_FRAME_DETECTED: true,
    CANVAS_READY: true
  });

  const PROGRESS_ONLY_PHASES = Object.freeze({
    ATLAS_BUILD_PROGRESS: true,
    TEXTURE_COMPOSE_PROGRESS: true,
    STRICT_CANVAS_READY_BARRIER_WAIT: true,
    RECONCILE: true
  });

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
    "planetFramePainted",
    "nonblankPlanetVisible"
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
    chronologicalFibonacciAlignment: true,
    newsFibonacciAlignment: true,
    oneActiveCheckpointAtATime: true,
    futureEventsQueued: true,
    completedEventsArchived: true,
    regressiveEventsBlocked: true,
    blockedProgressCap: 98,
    readyTextRequiresCompletionLatch: true,

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
    canvasReady: false,

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
    copyDiagnosticArmed: false,
    finalReceiptAvailable: false,
    partialReceiptAvailable: true,

    currentStage: "F1A",
    highestStage: "F1A",
    visibleLoadingActive: true,
    diagnosticCockpitReady: false,
    cockpitMode: "loading-cockpit",
    dockVisible: true,
    fullCockpitExpanded: false,
    planetInspectModeActive: false,

    postgameStatus: "CHECKPOINT_GOVERNOR_BOOTING",
    firstFailedCoordinate: "CHECKPOINT_SESSION_CREATED",
    recommendedNextRenewalTarget: "submit-first-checkpoint",
    latestVisibleEvent: "HEARTH_CHECKPOINT_GOVERNOR_CONSUMER_LOADED",
    mainDisplayProgress: 0,
    mainProgressCap: 98,
    heartbeatElapsedMs: 0,

    phaseEvents: [],
    phaseSignatures: Object.create(null),
    progressOnlyEvents: [],
    archivedLateEvents: [],
    localEvents: [],
    errors: [],

    checkpointReceipt: null,
    sharedLedger: null,
    startedAt: "",
    startedAtMs: 0,
    updatedAt: "",

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  const refs = {
    governor: null,
    session: null,
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
  let renderTimer = 0;
  let retryTimer = 0;

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

  function asArray(value) {
    if (Array.isArray(value)) return value.slice();
    if (value === undefined || value === null) return [];
    return [value];
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
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatElapsed(ms) {
    const total = Math.max(0, Math.floor(Number(ms || 0) / 1000));
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function findCheckpointByEvent(eventName) {
    return FALLBACK_CHECKPOINTS.find((checkpoint) => {
      return checkpoint.event === eventName || checkpoint.id === eventName || asArray(checkpoint.aliases).includes(eventName);
    }) || null;
  }

  function findCheckpointById(id) {
    return FALLBACK_CHECKPOINTS.find((checkpoint) => checkpoint.id === id) || null;
  }

  function getRuntimeTableApi() {
    return (
      root.LAB_RUNTIME_TABLE ||
      root.DexterRuntimeTable ||
      root.RUNTIME_TABLE ||
      root.LAB_UNIVERSAL_PLANET_RUNTIME_TABLE ||
      root.LAB_CHECKPOINT_GOVERNOR ||
      root.LAB_NEWS_FIBONACCI_CHECKPOINT_GOVERNOR ||
      (root.DEXTER_LAB && root.DEXTER_LAB.runtimeTable) ||
      null
    );
  }

  function findCheckpointGovernor() {
    const api = getRuntimeTableApi();
    refs.governor = api;
    state.checkpointGovernorPresent = Boolean(
      api &&
      (
        isFunction(api.createHearthCheckpointSession) ||
        isFunction(api.createCheckpointSession)
      )
    );
    state.runtimeTablePresent = Boolean(api);
    state.runtimeTableMode = api ? "RUNTIME_TABLE_READY_OR_DEGRADED" : "RUNTIME_TABLE_MISSING";
    return api;
  }

  function createLocalCheckpointSession() {
    const sequence = FALLBACK_CHECKPOINTS.map((checkpoint, index) => ({
      ...checkpoint,
      complete: false,
      status: index === 0 ? "ACTIVE" : "PENDING"
    }));

    const local = {
      contract: "HEARTH_LOCAL_CHECKPOINT_SESSION_FALLBACK_v1",
      receipt: "HEARTH_LOCAL_CHECKPOINT_SESSION_FALLBACK_RECEIPT_v1",
      activeIndex: 0,
      completedCheckpoints: [],
      admittedEvents: [],
      queuedEvents: [],
      archivedEvents: [],
      blockedEvents: [],
      snapshot: {},
      completionLatched: false,

      getActive() {
        return sequence[Math.min(local.activeIndex, sequence.length - 1)] || null;
      },

      f13SubsequenceComplete() {
        return local.completedCheckpoints.includes("F13N_INSPECT_MODE_READY");
      },

      newsState() {
        return evaluateNewsGates(local.snapshot);
      },

      f21Allowed() {
        return Boolean(local.f13SubsequenceComplete() && local.newsState().newsGatePassedBeforeF21);
      },

      submitEvent(rawEvent = {}) {
        const eventName = rawEvent.checkpointId || rawEvent.phase || rawEvent.id || rawEvent.event || "";
        const checkpoint = findCheckpointByEvent(eventName);
        const active = local.getActive();

        local.snapshot = {
          ...local.snapshot,
          ...(isObject(rawEvent.detail) ? rawEvent.detail : {}),
          ...(isObject(rawEvent.snapshot) ? rawEvent.snapshot : {}),
          ...rawEvent
        };

        if (!checkpoint) {
          local.archivedEvents.push({ event: clonePlain(rawEvent), reason: "unknown-checkpoint-event", at: nowIso() });
          return local.classification("ARCHIVE", "", "unknown-checkpoint-event");
        }

        if (local.completionLatched && checkpoint.id !== "F21_COMPLETION_LATCHED") {
          local.archivedEvents.push({ event: clonePlain(rawEvent), reason: "post-f21-event-archived", at: nowIso() });
          return local.classification("ARCHIVE", checkpoint.id, "post-f21-event-archived");
        }

        if (checkpoint.id === "F21_COMPLETION_LATCHED" && !local.f21Allowed() && !bool(rawEvent.f21Allowed) && !(rawEvent.detail && bool(rawEvent.detail.f21Allowed))) {
          local.blockedEvents.push({ event: clonePlain(rawEvent), reason: "f21-blocked-until-f13n-and-news-gates-pass", at: nowIso() });
          return local.classification("BLOCK", checkpoint.id, "f21-blocked-until-f13n-and-news-gates-pass");
        }

        if (!active) {
          local.blockedEvents.push({ event: clonePlain(rawEvent), reason: "active-checkpoint-missing", at: nowIso() });
          return local.classification("BLOCK", checkpoint.id, "active-checkpoint-missing");
        }

        if (checkpoint.rank > active.rank) {
          local.queuedEvents.push({ event: clonePlain(rawEvent), checkpointId: checkpoint.id, reason: "future-event-queued-until-prior-checkpoint-completes", at: nowIso() });
          return local.classification("QUEUE", checkpoint.id, "future-event-queued-until-prior-checkpoint-completes");
        }

        if (checkpoint.rank < active.rank) {
          local.archivedEvents.push({ event: clonePlain(rawEvent), checkpointId: checkpoint.id, reason: "duplicate-or-late-completed-event-archived", at: nowIso() });
          return local.classification("ARCHIVE", checkpoint.id, "duplicate-or-late-completed-event-archived");
        }

        local.admittedEvents.push({ event: clonePlain(rawEvent), checkpointId: checkpoint.id, reason: "event-matches-active-checkpoint", at: nowIso() });
        checkpoint.complete = true;
        checkpoint.status = "COMPLETE";
        checkpoint.completedAt = nowIso();

        if (!local.completedCheckpoints.includes(checkpoint.id)) {
          local.completedCheckpoints.push(checkpoint.id);
        }

        if (checkpoint.id === "F21_COMPLETION_LATCHED") {
          local.completionLatched = true;
        } else {
          local.activeIndex = Math.min(local.activeIndex + 1, sequence.length - 1);
          if (sequence[local.activeIndex] && !sequence[local.activeIndex].complete) {
            sequence[local.activeIndex].status = "ACTIVE";
          }
          local.flushQueue();
        }

        return local.classification("ADMIT", checkpoint.id, "event-matches-active-checkpoint");
      },

      flushQueue() {
        let advanced = true;
        let guard = 0;

        while (advanced && guard < 80) {
          advanced = false;
          guard += 1;
          const active = local.getActive();
          if (!active) return;

          const index = local.queuedEvents.findIndex((entry) => entry.checkpointId === active.id);
          if (index < 0) return;

          const [entry] = local.queuedEvents.splice(index, 1);
          const result = local.submitEvent(entry.event);

          if (result && result.action === "ADMIT") advanced = true;
        }
      },

      classification(action, checkpointId, reason) {
        const active = local.getActive();
        return {
          action,
          checkpointId,
          reason,
          activeCheckpoint: clonePlain(active),
          completionLatched: local.completionLatched,
          visibleProgress: local.completionLatched ? 100 : Math.min(98, active ? active.progress : 0),
          progressCap: local.completionLatched ? 100 : 98,
          readyTextAllowed: local.completionLatched,
          firstFailedCoordinate: local.firstFailedCoordinate(),
          recommendedNextRenewalTarget: local.recommendedNextRenewalTarget()
        };
      },

      firstFailedCoordinate() {
        const active = local.getActive();
        const news = local.newsState();

        if (local.completionLatched) return "NONE_NEWS_FIBONACCI_F21_LATCHED";
        if (!active) return "NONE";

        if (active.id === "F13N_INSPECT_MODE_READY") {
          if (!bool(local.snapshot.inspectModeAvailable)) return "WAITING_inspectModeAvailable";
          if (!bool(local.snapshot.inspectPlanetControlAvailable)) return "WAITING_inspectPlanetControlAvailable";
          if (!bool(local.snapshot.diagnosticCanLeavePlanetFrame)) return "WAITING_diagnosticCanLeavePlanetFrame";
          if (!bool(local.snapshot.buttonsReachable)) return "WAITING_buttonsReachable";
          return "WAITING_INSPECT_MODE_READY";
        }

        if (active.id === "F21_COMPLETION_LATCHED") {
          if (!news.northGateReady) return "WAITING_northGateReady";
          if (!news.eastGateReady) return "WAITING_eastGateReady";
          if (!news.westGateReady) return "WAITING_westGateReady";
          if (!news.southGateReady) return "WAITING_southGateReady";
          return "WAITING_completionLatch";
        }

        return `WAITING_${active.event || active.id}`;
      },

      recommendedNextRenewalTarget() {
        const active = local.getActive();
        if (!active) return "none";
        if (active.lane === "canvasAndDiagnostic") return CANVAS_FILE;
        return COHERENCE_FILE;
      },

      getReceipt() {
        const active = local.getActive();
        const highest = local.completedCheckpoints.length
          ? findCheckpointById(local.completedCheckpoints[local.completedCheckpoints.length - 1])
          : null;
        const news = local.newsState();

        return {
          contract: CONTRACT,
          receipt: RECEIPT,
          checkpointSessionContract: local.contract,
          checkpointSessionReceipt: local.receipt,
          checkpointGovernorActive: false,
          localCheckpointFallback: true,
          sessionId: "hearth-local-checkpoint-session-fallback",
          route: ROUTE,
          chronologicalCheckpointSession: true,
          chronologicalFibonacciAlignment: true,
          newsFibonacciAlignment: true,
          oneActiveCheckpointAtATime: true,
          futureEventsQueued: true,
          completedEventsArchived: true,
          regressiveEventsBlocked: true,
          blockedProgressCap: 98,
          readyTextRequiresCompletionLatch: true,
          activeCheckpointId: active ? active.id : "",
          activeCheckpointRank: active ? active.rank : 0,
          activeCheckpointLabel: active ? active.label : "",
          activeFibonacciStage: active ? active.fibonacci : "",
          highestCompletedCheckpointId: highest ? highest.id : "",
          highestCompletedRank: highest ? highest.rank : 0,
          completionLatched: local.completionLatched,
          readyTextAllowed: local.completionLatched,
          visibleProgress: local.completionLatched ? 100 : Math.min(98, active ? active.progress : 0),
          progressCap: local.completionLatched ? 100 : 98,
          northGateReady: news.northGateReady,
          eastGateReady: news.eastGateReady,
          westGateReady: news.westGateReady,
          southGateReady: news.southGateReady,
          newsGatePassedBeforeF21: news.newsGatePassedBeforeF21,
          f13SubsequenceComplete: local.f13SubsequenceComplete(),
          f13LastRequiredEvent: local.completedCheckpoints.includes("F13N_INSPECT_MODE_READY") ? "INSPECT_MODE_READY" : "",
          f21Allowed: local.f21Allowed(),
          firstFailedCoordinate: local.firstFailedCoordinate(),
          recommendedNextRenewalTarget: local.recommendedNextRenewalTarget(),
          queuedEventsCount: local.queuedEvents.length,
          archivedEventsCount: local.archivedEvents.length,
          blockedEventsCount: local.blockedEvents.length,
          admittedEventsCount: local.admittedEvents.length,
          regressionPrevented: local.blockedEvents.length,
          completedCheckpoints: clonePlain(local.completedCheckpoints),
          queuedEvents: clonePlain(local.queuedEvents),
          archivedEvents: clonePlain(local.archivedEvents),
          blockedEvents: clonePlain(local.blockedEvents),
          admittedEvents: clonePlain(local.admittedEvents),
          sequence: clonePlain(sequence),
          snapshot: clonePlain(local.snapshot),
          generatedImage: false,
          graphicBox: false,
          webGL: false,
          visualPassClaimed: false,
          updatedAt: nowIso()
        };
      },

      getReceiptText() {
        return JSON.stringify(local.getReceipt(), null, 2);
      }
    };

    return local;
  }

  function createCheckpointSession() {
    const governor = findCheckpointGovernor();

    if (!governor) {
      state.checkpointGovernorFallbackUsed = true;
      state.checkpointSessionError = "Runtime Table checkpoint governor missing.";
      refs.session = createLocalCheckpointSession();
      state.checkpointSessionCreated = true;
      state.checkpointSessionConsumed = true;
      state.checkpointSessionReceiptAvailable = true;
      return refs.session;
    }

    try {
      if (isFunction(governor.createHearthCheckpointSession)) {
        refs.session = governor.createHearthCheckpointSession({
          id: "hearth-route-runtime-table-checkpoint-governor-consumer-v4",
          route: ROUTE,
          constraintSemiconductor: INDEX_FILE,
          coherenceSemiconductor: COHERENCE_FILE,
          canvasAuthority: CANVAS_FILE,
          generatedImage: false,
          graphicBox: false,
          webGL: false,
          visualPassClaimed: false
        });
      } else if (isFunction(governor.createCheckpointSession)) {
        refs.session = governor.createCheckpointSession(null, {
          id: "hearth-route-runtime-table-checkpoint-governor-consumer-v4",
          planetId: "hearth",
          planetLabel: "Hearth",
          route: ROUTE,
          constraintSemiconductor: INDEX_FILE,
          coherenceSemiconductor: COHERENCE_FILE,
          canvasAuthority: CANVAS_FILE,
          generatedImage: false,
          graphicBox: false,
          webGL: false,
          visualPassClaimed: false
        });
      }

      if (!refs.session || !isFunction(refs.session.submitEvent)) {
        throw new Error("Checkpoint governor present but did not return a usable session.");
      }

      state.checkpointSessionCreated = true;
      state.checkpointSessionConsumed = true;
      state.checkpointSessionReceiptAvailable = isFunction(refs.session.getReceipt);
      state.checkpointGovernorFallbackUsed = false;
      return refs.session;
    } catch (error) {
      state.checkpointGovernorFallbackUsed = true;
      state.checkpointSessionError = error && error.message ? error.message : String(error);
      refs.session = createLocalCheckpointSession();
      state.checkpointSessionCreated = true;
      state.checkpointSessionConsumed = true;
      state.checkpointSessionReceiptAvailable = true;
      recordError("CHECKPOINT_SESSION_CREATE_FAILED", state.checkpointSessionError);
      return refs.session;
    }
  }

  function getCheckpointReceipt() {
    if (!refs.session || !isFunction(refs.session.getReceipt)) return null;

    try {
      const receipt = refs.session.getReceipt();
      state.checkpointReceipt = receipt && isObject(receipt) ? receipt : null;
      state.checkpointSessionReceiptAvailable = Boolean(state.checkpointReceipt);
      return state.checkpointReceipt;
    } catch (error) {
      recordError("CHECKPOINT_RECEIPT_READ_FAILED", error && error.message ? error.message : String(error));
      return null;
    }
  }

  function updateStateFromCheckpointReceipt() {
    const receipt = getCheckpointReceipt();
    if (!receipt) return;

    state.activeCheckpointId = receipt.activeCheckpointId || state.activeCheckpointId;
    state.activeCheckpointRank = Number(receipt.activeCheckpointRank || state.activeCheckpointRank || 0);
    state.activeFibonacciStage = receipt.activeFibonacciStage || state.activeFibonacciStage;
    state.highestCompletedCheckpointId = receipt.highestCompletedCheckpointId || state.highestCompletedCheckpointId;
    state.highestCompletedRank = Number(receipt.highestCompletedRank || state.highestCompletedRank || 0);
    state.completedCheckpoints = asArray(receipt.completedCheckpoints);
    state.queuedEventsCount = Number(receipt.queuedEventsCount || 0);
    state.archivedEventsCount = Number(receipt.archivedEventsCount || 0);
    state.blockedEventsCount = Number(receipt.blockedEventsCount || 0);
    state.admittedEventsCount = Number(receipt.admittedEventsCount || 0);
    state.regressionPrevented = Number(receipt.regressionPrevented || 0);
    state.f13SubsequenceComplete = Boolean(receipt.f13SubsequenceComplete);
    state.f13LastRequiredEvent = receipt.f13LastRequiredEvent || state.f13LastRequiredEvent;
    state.f21Allowed = Boolean(receipt.f21Allowed);
    state.f21AfterF13N = Boolean(state.f21Allowed && state.f13SubsequenceComplete);
    state.completionLatched = Boolean(receipt.completionLatched);
    state.mainProgressCap = state.completionLatched ? 100 : 98;
    state.mainDisplayProgress = state.completionLatched ? 100 : Math.min(98, Number(receipt.visibleProgress || state.mainDisplayProgress || 0));

    if (receipt.firstFailedCoordinate) state.firstFailedCoordinate = receipt.firstFailedCoordinate;
    if (receipt.recommendedNextRenewalTarget) state.recommendedNextRenewalTarget = receipt.recommendedNextRenewalTarget;

    state.currentStage = state.completionLatched ? "F21" : state.activeFibonacciStage;
    state.highestStage = state.completionLatched ? "F21" : state.activeFibonacciStage;
  }

  function getSnapshot(extra = {}) {
    evaluateInspectGate(false);
    const news = evaluateNewsGates();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      route: ROUTE,

      checkpointGovernorPresent: state.checkpointGovernorPresent,
      checkpointSessionCreated: state.checkpointSessionCreated,
      checkpointSessionConsumed: state.checkpointSessionConsumed,

      canvasReady: state.canvasReady,
      canvasCarrierMounted: state.canvasCarrierMounted,
      canvasCarrierRequested: state.canvasCarrierRequested,
      canvasCarrierHandoffOk: state.canvasCarrierHandoffOk,
      cooperativeBootUsed: state.cooperativeBootUsed,
      syncBootFallbackUsed: state.syncBootFallbackUsed,
      atlasBuildComplete: state.atlasBuildComplete,
      textureComposeComplete: state.textureComposeComplete,
      firstFrameDetected: state.firstFrameDetected,
      imageRendered: state.imageRendered,
      dragInspectionBound: state.dragInspectionBound,

      visibleContentProof: state.visibleContentProof,
      visiblePlanetAvailable: state.visiblePlanetAvailable,
      nonblankPlanetVisible: state.nonblankPlanetVisible,
      planetCanvasPresent: state.planetCanvasPresent,
      planetCanvasNonZeroSize: state.planetCanvasNonZeroSize,
      planetFramePainted: state.planetFramePainted,
      carrierOnlyDetected: state.carrierOnlyDetected,

      inspectModeAvailable: state.inspectModeAvailable,
      inspectPlanetControlAvailable: state.inspectPlanetControlAvailable,
      diagnosticCanLeavePlanetFrame: state.diagnosticCanLeavePlanetFrame,
      showDiagnosticTabVisibleWhenHidden: state.showDiagnosticTabVisibleWhenHidden,
      diagnosticDockRestorable: state.diagnosticDockRestorable,
      copyDiagnosticPreserved: state.copyDiagnosticPreserved,
      receiptToggleReady: state.receiptToggleReady,
      buttonsReachable: state.buttonsReachable,
      receiptOverlayIndependent: state.receiptOverlayIndependent,

      northGateReady: news.northGateReady,
      eastGateReady: news.eastGateReady,
      westGateReady: news.westGateReady,
      southGateReady: news.southGateReady,
      newsGatePassedBeforeF21: news.newsGatePassedBeforeF21,
      f21Allowed: state.f21Allowed,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      ...extra
    };
  }

  function submitCheckpoint(eventName, detail = {}, options = {}) {
    if (!refs.session) createCheckpointSession();

    const event = {
      id: eventName,
      event: eventName,
      phase: eventName,
      checkpointId: options.checkpointId || "",
      detail: {
        ...detail,
        calledBy: CONTRACT,
        route: ROUTE,
        f21Allowed: options.f21Allowed === true
      },
      snapshot: getSnapshot(options.snapshot || {}),
      f21Allowed: options.f21Allowed === true
    };

    let result = null;

    try {
      result = refs.session.submitEvent(event);
      state.latestVisibleEvent = eventName;
      state.localEvents.push({
        at: nowIso(),
        event: eventName,
        action: result && result.action ? result.action : "",
        reason: result && result.reason ? result.reason : ""
      });

      if (state.localEvents.length > 220) {
        state.localEvents.splice(0, state.localEvents.length - 220);
      }
    } catch (error) {
      recordError("CHECKPOINT_SUBMIT_FAILED", error && error.message ? error.message : String(error), { eventName });
    }

    updateStateFromCheckpointReceipt();
    scheduleRender();

    return result;
  }

  function seedEarlyCheckpoints() {
    submitCheckpoint("HTML_SHELL_RENDERED", { source: "hearth-js-boot-seed" });
    submitCheckpoint("LOAD_LEDGER_INITIALIZED", { source: "hearth-js-boot-seed" });
    submitCheckpoint("FIRST_PAINT_COCKPIT_VISIBLE", { source: "hearth-js-boot-seed" });
    submitCheckpoint("SCRIPT_ORDER_COMPLETE", { source: "hearth-js-boot-seed" });

    checkRuntimeTable();

    submitCheckpoint("AUTHORITY_AVAILABILITY_READY", {
      source: "hearth-js-boot-seed",
      runtimeTablePresent: state.runtimeTablePresent,
      runtimeTablePlanCreated: state.runtimeTablePlanCreated
    });

    submitCheckpoint("CONDUCTOR_HYDRATED", {
      source: "hearth-js-boot-seed",
      cockpitHydrated: Boolean(refs.cockpit),
      mountHydrated: Boolean(refs.mount)
    });
  }

  function ensureSharedLedger() {
    const existing = root.HEARTH_LOAD_LEDGER;
    const ledger = existing && isObject(existing) ? existing : {};
    const led = isObject(ledger.state) ? ledger.state : ledger;

    ledger.state = led;
    led.contract = led.contract || "HEARTH_PAIRED_SEMICONDUCTOR_SHARED_LOAD_LEDGER_v1";
    led.ownerModel = "paired-semiconductor";
    led.constraintSemiconductor = INDEX_FILE;
    led.coherenceSemiconductor = COHERENCE_FILE;
    led.completionAuthority = COHERENCE_FILE;
    led.checkpointGovernorConsumer = CONTRACT;
    led.updatedAt = nowIso();
    led.visualPassClaimed = false;
    led.events = Array.isArray(led.events) ? led.events : [];
    led.lanes = isObject(led.lanes) ? led.lanes : {};
    led.errors = Array.isArray(led.errors) ? led.errors : [];

    ledger.push = ledger.push || function push(event = {}) {
      const evt = {
        id: event.id || event.event || "LEDGER_EVENT",
        stage: event.stage || state.currentStage || "",
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
      if (led.events.length > 320) led.events.splice(0, led.events.length - 320);
      led.updatedAt = evt.timestamp;
      return evt;
    };

    refs.ledger = ledger;
    state.sharedLedger = ledger.state;
    root.HEARTH_LOAD_LEDGER = ledger;

    return ledger;
  }

  function recordError(code, message, detail = {}) {
    const item = {
      code,
      message: String(message || ""),
      detail: clonePlain(detail),
      at: nowIso()
    };

    state.errors.push(item);
    if (state.errors.length > 90) state.errors.splice(0, state.errors.length - 90);

    if (refs.ledger && refs.ledger.state && Array.isArray(refs.ledger.state.errors)) {
      refs.ledger.state.errors.push(item);
    }

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
      mount.dataset.hearthMountCreatedByCoherenceSemiconductor = "true";

      const parent = doc.getElementById("hearth-main") || doc.querySelector("main") || doc.body || doc.documentElement;
      parent.appendChild(mount);
    }

    mount.id = MOUNT_ID;
    mount.dataset.hearthCanvasMount = "true";
    mount.dataset.hearthCoherenceSemiconductor = CONTRACT;
    mount.dataset.hearthCoherenceReceipt = RECEIPT;
    mount.dataset.hearthRuntimeTableCheckpointGovernorConsumer = "true";
    mount.dataset.hearthPairedSemiconductor = "true";
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
    if (!doc || doc.getElementById("hearth-checkpoint-governor-consumer-style")) return;

    const style = doc.createElement("style");
    style.id = "hearth-checkpoint-governor-consumer-style";
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

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-scroll{
        display:none!important;
      }

      .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"] .hearth-ledger-actions{
        display:flex!important;
        flex-wrap:wrap!important;
        gap:7px!important;
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

      .hearth-checkpoint-list{
        display:grid;
        gap:8px;
      }

      .hearth-checkpoint-row{
        border:1px solid rgba(255,255,255,.09);
        border-radius:12px;
        padding:9px 10px;
        background:rgba(3,10,24,.46);
      }

      .hearth-checkpoint-row[data-status="ACTIVE"]{
        border-color:rgba(231,188,105,.72);
        background:rgba(231,188,105,.10);
      }

      .hearth-checkpoint-row[data-status="COMPLETE"]{
        opacity:.74;
      }

      .hearth-checkpoint-row[data-status="PENDING"]{
        opacity:.46;
      }

      .hearth-checkpoint-row[data-status="QUEUED"],
      .hearth-checkpoint-row[data-status="BLOCKED"]{
        border-color:rgba(255,160,112,.55);
      }

      .hearth-checkpoint-top{
        display:flex;
        justify-content:space-between;
        gap:10px;
        align-items:flex-start;
        font:800 .68rem/1.25 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        letter-spacing:.04em;
        text-transform:uppercase;
      }

      .hearth-checkpoint-msg{
        margin-top:4px;
        color:rgba(255,255,255,.70);
        font:650 .62rem/1.35 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
      }

      .hearth-checkpoint-track{
        height:5px;
        border-radius:999px;
        overflow:hidden;
        background:rgba(255,255,255,.10);
        margin-top:7px;
      }

      .hearth-checkpoint-fill{
        display:block;
        height:100%;
        width:0%;
        border-radius:inherit;
        background:linear-gradient(90deg,rgba(231,188,105,.62),rgba(255,232,163,.96));
        transition:width .2s ease;
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

      @media (max-width:760px){
        .hearth-ledger-cockpit[data-cockpit-mode="diagnostic-dock"]{
          inset:auto 8px 8px 8px!important;
          max-height:190px!important;
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
      tab.textContent = "Show diagnostic";
      doc.body.appendChild(tab);
    }

    tab.dataset.hearthCoherenceShowDiagnosticTab = "true";
    tab.setAttribute("aria-label", "Show Hearth diagnostic");
    tab.onclick = () => setCockpitMode("diagnostic-dock");
    tab.hidden = !state.planetInspectModeActive;
    tab.dataset.visible = String(state.planetInspectModeActive);

    refs.showTab = tab;
    return tab;
  }

  function ensureButton(container, selector, attrName, label, className = "") {
    if (!doc || !container) return null;

    let button = container.querySelector(selector);

    if (!button) {
      button = doc.createElement("button");
      button.type = "button";
      button.className = className || "hearth-ledger-button";
      button.textContent = label;
      button.setAttribute(attrName, "");
      container.appendChild(button);
    }

    button.type = "button";
    if (!button.className) button.className = "hearth-ledger-button";
    button.hidden = false;
    button.style.display = "";
    button.disabled = false;

    return button;
  }

  function createFallbackCockpit() {
    if (!doc) return null;

    const mount = refs.mount || ensureMount();
    if (!mount) return null;

    const cockpit = doc.createElement("aside");
    cockpit.id = COCKPIT_ID;
    cockpit.className = "hearth-ledger-cockpit";
    cockpit.dataset.hearthLoadCockpit = "true";
    cockpit.dataset.hearthFirstPaintCockpit = "fallback-created-by-checkpoint-governor-consumer";
    cockpit.dataset.cockpitMode = "loading-cockpit";
    cockpit.setAttribute("aria-live", "polite");

    cockpit.innerHTML = `
      <div class="hearth-ledger-head">
        <div class="hearth-ledger-kicker">Hearth · Runtime Table Checkpoint Governor</div>
        <h2 class="hearth-ledger-title">FORMING HEARTH VISIBLE PLANET</h2>
        <div class="hearth-ledger-meta" data-hearth-stage-label>F1A · HTML shell rendered</div>
        <div class="hearth-ledger-meta" data-hearth-heartbeat-text>checkpoint governor active · elapsed=00:00</div>
        <div class="hearth-ledger-latest" data-hearth-latest-event>latest=HEARTH_CHECKPOINT_GOVERNOR_CONSUMER_LOADED</div>
      </div>

      <div class="hearth-ledger-progress" data-hearth-index-progress-strip="true">
        <div class="hearth-ledger-track">
          <span class="hearth-ledger-fill" data-hearth-main-progress-fill style="width:0%"></span>
        </div>
        <div class="hearth-ledger-percent" data-hearth-main-progress-percent>0%</div>
      </div>

      <div class="hearth-ledger-actions"></div>

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

  function ensureCockpitStructure() {
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

    cockpit.id = COCKPIT_ID;
    cockpit.classList.add("hearth-ledger-cockpit");
    cockpit.dataset.hearthLoadCockpit = "true";
    cockpit.dataset.hearthRuntimeTableCheckpointGovernorConsumer = CONTRACT;
    cockpit.dataset.hearthCoherenceSemiconductor = CONTRACT;
    cockpit.dataset.hearthCoherenceReceipt = RECEIPT;
    cockpit.dataset.hearthSynchronizedLoading = "true";
    cockpit.dataset.hearthOneActiveCheckpointAtATime = "true";
    cockpit.dataset.cockpitMode = cockpit.dataset.cockpitMode || "loading-cockpit";

    let head = cockpit.querySelector(".hearth-ledger-head");
    if (!head) {
      head = doc.createElement("div");
      head.className = "hearth-ledger-head";
      cockpit.prepend(head);
    }

    let title = cockpit.querySelector(".hearth-ledger-title");
    if (!title) {
      title = doc.createElement("h2");
      title.className = "hearth-ledger-title";
      title.textContent = "FORMING HEARTH VISIBLE PLANET";
      head.appendChild(title);
    }

    let stage = cockpit.querySelector("[data-hearth-stage-label]");
    if (!stage) {
      stage = doc.createElement("div");
      stage.className = "hearth-ledger-meta";
      stage.dataset.hearthStageLabel = "true";
      head.appendChild(stage);
    }

    let heartbeat = cockpit.querySelector("[data-hearth-heartbeat-text]");
    if (!heartbeat) {
      heartbeat = doc.createElement("div");
      heartbeat.className = "hearth-ledger-meta";
      heartbeat.dataset.hearthHeartbeatText = "true";
      head.appendChild(heartbeat);
    }

    let latest = cockpit.querySelector("[data-hearth-latest-event]");
    if (!latest) {
      latest = doc.createElement("div");
      latest.className = "hearth-ledger-latest";
      latest.dataset.hearthLatestEvent = "true";
      head.appendChild(latest);
    }

    let progress = cockpit.querySelector(".hearth-ledger-progress");
    if (!progress) {
      progress = doc.createElement("div");
      progress.className = "hearth-ledger-progress";
      progress.innerHTML = `
        <div class="hearth-ledger-track">
          <span class="hearth-ledger-fill" data-hearth-main-progress-fill style="width:0%"></span>
        </div>
        <div class="hearth-ledger-percent" data-hearth-main-progress-percent>0%</div>
      `;
      head.after(progress);
    }

    let mainFill = cockpit.querySelector("[data-hearth-main-progress-fill]");
    if (!mainFill) {
      const track = progress.querySelector(".hearth-ledger-track") || progress;
      mainFill = doc.createElement("span");
      mainFill.className = "hearth-ledger-fill";
      mainFill.dataset.hearthMainProgressFill = "true";
      track.appendChild(mainFill);
    }

    let mainPercent = cockpit.querySelector("[data-hearth-main-progress-percent]");
    if (!mainPercent) {
      mainPercent = doc.createElement("div");
      mainPercent.className = "hearth-ledger-percent";
      mainPercent.dataset.hearthMainProgressPercent = "true";
      progress.appendChild(mainPercent);
    }

    let actions = cockpit.querySelector(".hearth-ledger-actions");
    if (!actions) {
      actions = doc.createElement("div");
      actions.className = "hearth-ledger-actions";
      progress.after(actions);
    }

    actions.style.display = "flex";
    actions.style.flexWrap = "wrap";
    actions.style.gap = "7px";

    let scroll = cockpit.querySelector(".hearth-ledger-scroll");
    if (!scroll) {
      scroll = doc.createElement("div");
      scroll.className = "hearth-ledger-scroll";
      cockpit.appendChild(scroll);
    }

    let laneList = cockpit.querySelector("[data-hearth-lane-list]");
    if (!laneList) {
      laneList = doc.createElement("div");
      laneList.className = "hearth-ledger-lanes";
      laneList.dataset.hearthLaneList = "true";
      scroll.appendChild(laneList);
    }

    let receiptBox = cockpit.querySelector("[data-hearth-receipt-box]");
    if (!receiptBox) {
      receiptBox = doc.createElement("div");
      receiptBox.className = "hearth-ledger-receipt";
      receiptBox.dataset.hearthReceiptBox = "true";
      receiptBox.dataset.visible = "false";
      scroll.appendChild(receiptBox);
    }

    let receiptPre = receiptBox.querySelector("[data-hearth-receipt-text]");
    if (!receiptPre) {
      receiptPre = doc.createElement("pre");
      receiptPre.dataset.hearthReceiptText = "true";
      receiptBox.appendChild(receiptPre);
    }

    refs.cockpit = cockpit;
    refs.title = title;
    refs.stage = stage;
    refs.heartbeat = heartbeat;
    refs.latest = latest;
    refs.mainFill = mainFill;
    refs.mainPercent = mainPercent;
    refs.laneList = laneList;
    refs.receiptBox = receiptBox;
    refs.receiptPre = receiptPre;

    refs.copyButton = ensureButton(actions, "[data-hearth-copy-diagnostic]", "data-hearth-copy-diagnostic", "Copy diagnostic", "hearth-ledger-button primary");
    refs.receiptToggle = ensureButton(actions, "[data-hearth-toggle-receipt]", "data-hearth-toggle-receipt", "Show receipt", "hearth-ledger-button");
    refs.inspectButton = ensureButton(actions, "[data-hearth-inspect-planet]", "data-hearth-inspect-planet", "Inspect planet", "hearth-ledger-button");
    refs.expandButton = ensureButton(actions, "[data-hearth-collapse-cockpit]", "data-hearth-collapse-cockpit", "Expand cockpit", "hearth-ledger-button");

    if (refs.copyButton) refs.copyButton.onclick = copyDiagnostic;
    if (refs.receiptToggle) refs.receiptToggle.onclick = toggleReceipt;
    if (refs.inspectButton) refs.inspectButton.onclick = () => {
      if (state.planetInspectModeActive) setCockpitMode("diagnostic-dock");
      else setCockpitMode("planet-inspect");
    };
    if (refs.expandButton) refs.expandButton.onclick = toggleExpanded;

    if (mount) {
      mount.querySelectorAll("[data-hearth-mount-fallback], .mount-fallback").forEach((fallback) => {
        fallback.hidden = true;
        fallback.style.display = "none";
        fallback.dataset.hiddenByCheckpointGovernorConsumer = CONTRACT;
      });
    }

    evaluateInspectGate(false);
    return cockpit;
  }

  function toggleReceipt() {
    if (!refs.receiptBox) return;

    const visible = refs.receiptBox.dataset.visible !== "true";
    refs.receiptBox.dataset.visible = String(visible);
    refs.receiptBox.hidden = !visible;
    refs.receiptBox.style.display = visible ? "" : "none";

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
    if (!refs.cockpit) ensureCockpitStructure();
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
      state.cockpitMode = state.canvasReady || state.visibleContentProof || state.completionLatched ? "diagnostic-dock" : "loading-cockpit";
      state.planetInspectModeActive = false;
      state.diagnosticDockHiddenForInspection = false;
      state.showDiagnosticTabVisible = false;
      state.planetNotObstructed = false;
      state.dockVisible = true;
      state.fullCockpitExpanded = false;
    }

    refs.cockpit.dataset.cockpitMode = state.cockpitMode;
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
    }

    if (refs.expandButton) {
      if (state.cockpitMode === "expanded-cockpit") refs.expandButton.textContent = "Collapse dock";
      else if (state.cockpitMode === "planet-inspect") refs.expandButton.textContent = "Show diagnostic";
      else refs.expandButton.textContent = "Expand cockpit";
    }

    evaluateInspectGate(true);
    evaluateNewsGates();
    trySubmitInspectReady();
    tryFinalize("cockpit-mode-change");
    publishGlobals();
    scheduleRender();
  }

  function evaluateInspectGate(allowSubmit = true) {
    state.inspectModeAvailable = Boolean(refs.inspectButton);
    state.inspectPlanetControlAvailable = Boolean(refs.inspectButton);
    state.showDiagnosticTabVisibleWhenHidden = Boolean(refs.showTab);
    state.diagnosticDockRestorable = Boolean(refs.showTab && refs.cockpit);
    state.copyDiagnosticPreserved = Boolean(refs.copyButton);
    state.copyDiagnosticArmed = Boolean(refs.copyButton);
    state.receiptToggleReady = Boolean(refs.receiptToggle);
    state.receiptOverlayIndependent = true;
    state.buttonsReachable = Boolean(refs.copyButton && refs.receiptToggle && refs.inspectButton && refs.showTab);
    state.diagnosticCanLeavePlanetFrame = Boolean(
      state.inspectModeAvailable &&
      state.inspectPlanetControlAvailable &&
      state.showDiagnosticTabVisibleWhenHidden &&
      state.diagnosticDockRestorable &&
      state.copyDiagnosticPreserved &&
      state.receiptToggleReady &&
      state.buttonsReachable &&
      refs.cockpit
    );

    if (allowSubmit) trySubmitInspectReady();

    return state.diagnosticCanLeavePlanetFrame;
  }

  function trySubmitInspectReady() {
    if (!state.visibleContentProof) return false;
    if (!evaluateInspectGate(false)) return false;
    if (state.completedCheckpoints.includes("F13N_INSPECT_MODE_READY")) return true;

    submitCheckpoint("INSPECT_MODE_READY", {
      inspectModeAvailable: state.inspectModeAvailable,
      inspectPlanetControlAvailable: state.inspectPlanetControlAvailable,
      diagnosticDockRestorable: state.diagnosticDockRestorable,
      diagnosticCanLeavePlanetFrame: state.diagnosticCanLeavePlanetFrame,
      showDiagnosticTabVisibleWhenHidden: state.showDiagnosticTabVisibleWhenHidden,
      copyDiagnosticPreserved: state.copyDiagnosticPreserved,
      receiptToggleReady: state.receiptToggleReady,
      buttonsReachable: state.buttonsReachable,
      receiptOverlayIndependent: true
    });

    return state.completedCheckpoints.includes("F13N_INSPECT_MODE_READY");
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
            checkpointGovernorConsumer: true,
            chronologicalFibonacciAlignment: true,
            newsFibonacciAlignment: true,
            visibleContentCompletionGate: true,
            inspectModeGate: true,
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
      return plan;
    } catch (error) {
      state.runtimeTableMode = "RUNTIME_TABLE_DEGRADED";
      state.runtimeTablePlanError = error && error.message ? error.message : String(error);
      recordError("RUNTIME_TABLE_PLAN_ERROR", state.runtimeTablePlanError);
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
        const receipt = api.getReceipt("hearth-checkpoint-governor-consumer-v4");
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
      runtimeTableCheckpointGovernorConsumer: true,
      chronologicalFibonacciAlignment: true,
      newsFibonacciAlignment: true,
      oneActiveCheckpointAtATime: true,
      sharedLedger: refs.ledger || ensureSharedLedger(),
      loadLedger: refs.ledger || ensureSharedLedger(),
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
      state.postgameStatus = "CANVAS_API_PENDING";
      state.firstFailedCoordinate = "WAITING_CANVAS_API";
      state.recommendedNextRenewalTarget = CANVAS_FILE;
      scheduleRender();
      return;
    }

    const method = selectCanvasMethod(api);

    if (!method) {
      state.canvasCarrierHandoffError = "Canvas API present but no boot/mount method exists.";
      state.postgameStatus = "CANVAS_METHOD_MISSING";
      state.firstFailedCoordinate = "WAITING_CANVAS_METHOD";
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

    evaluateNewsGates();
    publishGlobals();
    scheduleRender();
  }

  function phaseSignature(event) {
    const phase = String(event.phase || event.id || event.event || "CANVAS_PHASE");
    const detail = isObject(event.detail) ? event.detail : {};
    const chunk = detail.chunkIndex ?? "";
    const total = detail.totalChunks ?? "";
    const progress = event.percent ?? event.progress ?? detail.progress ?? "";
    return `${phase}|${chunk}|${total}|${progress}`;
  }

  function phaseToMessage(phase, percent, detail = {}) {
    const elapsed = formatElapsed(detail.elapsedMs || state.canvasBootElapsedMs || 0);

    if (phase === "CANVAS_COOPERATIVE_BOOT_STARTED") return `Canvas cooperative boot started · elapsed ${elapsed}`;
    if (phase === "CANVAS_MOUNT_CREATED") return `Canvas mount created · elapsed ${elapsed}`;
    if (phase === "CANVAS_CONTEXT_READY") return `Canvas context ready · elapsed ${elapsed}`;
    if (phase === "DRAG_INSPECTION_BOUND") return `Drag inspection bound · elapsed ${elapsed}`;
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
    if (phase === "CANVAS_READY") return `Canvas ready · visible content proof required · elapsed ${elapsed}`;
    return `${phase} · elapsed ${elapsed}`;
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
    }

    if (phase === "FIRST_FRAME_REQUESTED") {
      state.firstFrameRequested = true;
    }

    if (phase === "FIRST_FRAME_DETECTED") {
      state.firstFrameRequested = true;
      state.firstFrameDetected = true;
      state.imageRendered = true;
      state.renderedAfterTexture = Boolean(state.textureComposeComplete);
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
      state.finalReceiptAvailable = true;
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
    const percent = clamp(Number(event.percent ?? event.progress ?? detail.progress ?? state.lastCanvasProgress ?? 78), 0, 100);
    const elapsedMs = Number(detail.elapsedMs ?? event.elapsedMs ?? state.canvasBootElapsedMs ?? 0);
    const message = event.message || phaseToMessage(phase, percent, detail);

    if (state.completionLatched) {
      archiveLateEvent(phase, "post-f21-canvas-event-archived", message, detail);
      return event;
    }

    if (state.canvasLaneClosed && phase !== "CANVAS_READY") {
      state.postCanvasPhaseBouncePrevented = true;
      archiveLateEvent(phase, "canvas-lane-closed-after-canvas-ready", message, detail);
      return event;
    }

    state.canvasPhaseCount += 1;
    state.lastCanvasPhase = phase;
    state.lastCanvasProgress = Math.max(Number(state.lastCanvasProgress || 0), percent);
    state.canvasBootElapsedMs = Math.max(Number(state.canvasBootElapsedMs || 0), elapsedMs);
    state.canvasYieldCount = Math.max(Number(state.canvasYieldCount || 0), Number(detail.canvasYieldCount || 0));
    state.loaderRepaintDuringCanvasBoot = Boolean(state.loaderRepaintDuringCanvasBoot || detail.loaderRepaintDuringCanvasBoot || state.canvasYieldCount > 0);
    state.f13ProgressStreamActive = true;
    state.latestVisibleEvent = phase;

    applyPhaseTruth(phase, detail);

    state.phaseEvents.push({
      at: nowIso(),
      phase,
      percent,
      message,
      detail: clonePlain(detail)
    });

    if (state.phaseEvents.length > 180) state.phaseEvents.splice(0, state.phaseEvents.length - 180);

    if (CHECKPOINT_PHASES[phase]) {
      submitCheckpoint(phase, {
        phase,
        progress: percent,
        message,
        canvasBootElapsedMs: state.canvasBootElapsedMs
      });
    } else if (PROGRESS_ONLY_PHASES[phase]) {
      state.progressOnlyEvents.push({
        at: nowIso(),
        phase,
        percent,
        message,
        detail: clonePlain(detail)
      });

      if (state.progressOnlyEvents.length > 120) {
        state.progressOnlyEvents.splice(0, state.progressOnlyEvents.length - 120);
      }
    }

    if (phase === "CANVAS_READY") {
      state.canvasLaneClosed = true;
      state.postCanvasPhaseBouncePrevented = true;
      startVisibleContentProof("canvas-ready-phase");

      root.setTimeout(() => startVisibleContentProof("canvas-ready-post-frame-check"), 80);
      root.setTimeout(() => startVisibleContentProof("canvas-ready-late-visual-check"), 320);
      root.setTimeout(() => startVisibleContentProof("canvas-ready-later-content-check"), 900);
    }

    evaluateNewsGates();
    publishGlobals();
    scheduleRender();

    return event;
  }

  function archiveLateEvent(phase, reason, message, detail = {}) {
    const item = {
      at: nowIso(),
      event: phase,
      stage: "F13",
      lane: "canvasAndDiagnostic",
      reason,
      message,
      detail: clonePlain(detail)
    };

    state.archivedLateEvents.push(item);
    if (state.archivedLateEvents.length > 220) {
      state.archivedLateEvents.splice(0, state.archivedLateEvents.length - 220);
    }

    return item;
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

    if (state.canvasReady) startVisibleContentProof(`canvas-receipt-${reason}`);

    evaluateNewsGates();
    tryFinalize(`canvas-receipt-${reason}`);
    publishGlobals();
    scheduleRender();
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
      state.canvasLaneClosed = true;
      state.postCanvasPhaseBouncePrevented = true;
    }

    if (explicitReceiptContentProof(value)) {
      state.explicitContentReceiptProof = true;
      state.visibleContentProof = true;
      state.visibleContentProofMethod = "explicit-canvas-receipt-content-proof";
      state.carrierOnlyDetected = false;
      state.visiblePlanetAvailable = true;
      state.nonblankPlanetVisible = true;
      state.planetFramePainted = true;
      state.planetCanvasPresent = true;
      state.planetCanvasNonZeroSize = true;
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

  function startVisibleContentProof(reason = "manual") {
    if (state.completionLatched) return true;
    if (!state.canvasReady) return false;

    state.visibleContentProofStarted = true;

    submitCheckpoint("VISIBLE_CONTENT_PROOF_STARTED", {
      reason,
      visibleContentProofStarted: true,
      canvasReady: state.canvasReady
    });

    const result = proveVisibleContent(reason);

    if (result) {
      submitCheckpoint("VISIBLE_CONTENT_PROOF_PASSED", {
        reason,
        visibleContentProof: true,
        visibleContentProofMethod: state.visibleContentProofMethod,
        visiblePlanetAvailable: true,
        nonblankPlanetVisible: true,
        carrierOnlyDetected: false,
        planetCanvasPresent: state.planetCanvasPresent,
        planetCanvasNonZeroSize: state.planetCanvasNonZeroSize,
        planetFramePainted: state.planetFramePainted,
        firstFrameDetected: state.firstFrameDetected,
        imageRendered: state.imageRendered,
        atlasBuildComplete: state.atlasBuildComplete,
        textureComposeComplete: state.textureComposeComplete
      });

      evaluateInspectGate(true);
      trySubmitInspectReady();
    }

    evaluateNewsGates();
    tryFinalize(`visible-content-proof-${reason}`);
    publishGlobals();
    scheduleRender();

    return result;
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
      state.planetCanvasPresent = true;
      state.planetCanvasNonZeroSize = true;
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
      state.planetCanvasPresent = true;
      state.planetCanvasNonZeroSize = true;
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
    state.carrierOnlyDetected = true;
    state.postgameStatus = "VISIBLE_CONTENT_PROOF_PENDING";
    state.firstFailedCoordinate = "VISIBLE_CONTENT_PROOF_PENDING";
    state.recommendedNextRenewalTarget = CANVAS_FILE;

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
      if (state.canvasReady && state.firstFrameDetected && state.imageRendered && state.textureComposeComplete) {
        state.visibleContentSampleCount = 0;
        state.visibleContentVarianceScore = 0;
        state.visibleContentClassCount = 0;
        state.planetFramePainted = true;
        state.nonblankPlanetVisible = true;
        return {
          passed: true,
          method: "frame-and-receipt-fallback-visible-proof",
          error: ""
        };
      }

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

          if (a < 16 || lum < 12) continue;

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
      if (state.canvasReady && state.firstFrameDetected && state.imageRendered && state.textureComposeComplete) {
        state.visibleContentSampleCount = sampleCount;
        state.visibleContentVarianceScore = 0;
        state.visibleContentClassCount = classes.size;
        state.planetFramePainted = true;
        state.nonblankPlanetVisible = true;
        return {
          passed: true,
          method: "frame-and-receipt-fallback-visible-proof",
          error: ""
        };
      }

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
    const enoughVariance = variance >= 8;
    const enoughSamples = sampleCount >= 50 && nonblank >= 18;
    const passed = Boolean(
      enoughSamples &&
      enoughVariance &&
      hasLand &&
      hasWaterOrOther &&
      state.textureComposeComplete &&
      state.canvasReady &&
      state.firstFrameDetected &&
      state.imageRendered
    );

    return {
      passed,
      method: passed ? "canvas-pixel-content-sample" : "carrier-only-or-insufficient-content-sample",
      error: passed ? "" : `Visible content sample failed: samples=${sampleCount}, nonblank=${nonblank}, variance=${Math.round(variance * 100) / 100}, classes=${classCount}, land=${land}, water=${water}, other=${other}, carrier=${carrier}, reason=${reason}`
    };
  }

  function classifyContentColor(r, g, b, a) {
    if (a < 16) return "blank";

    const lum = (r + g + b) / 3;
    if (lum < 16) return "carrier";

    const blueDominant = b >= r + 8 && b >= g - 10;
    const mutedBlueCarrier = blueDominant && b < 58 && g < 58 && r < 52;
    if (mutedBlueCarrier) return "carrier";

    const landGreen = g >= 42 && r >= 24 && b <= 126 && g >= b + 4;
    const landBrown = r >= 46 && g >= 34 && b <= 104 && r >= b + 8;
    const landYellow = r >= 62 && g >= 54 && b <= 126 && Math.abs(r - g) <= 58;

    if (landGreen || landBrown || landYellow) return "land";

    const waterBlue = b >= 42 && b >= r + 6 && b >= g - 16 && g >= 20;
    const waterTeal = g >= 38 && b >= 38 && r <= 72 && Math.abs(g - b) <= 52;

    if (waterBlue || waterTeal) return "water";

    if (lum >= 44 && Math.max(r, g, b) - Math.min(r, g, b) >= 16) return "content-other";

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

  function evaluateNewsGates(snapshot = null) {
    const read = snapshot || {
      canvasReady: state.canvasReady,
      atlasBuildComplete: state.atlasBuildComplete,
      textureComposeComplete: state.textureComposeComplete,
      visibleContentProof: state.visibleContentProof,
      visiblePlanetAvailable: state.visiblePlanetAvailable,
      cooperativeBootUsed: state.cooperativeBootUsed,
      syncBootFallbackUsed: state.syncBootFallbackUsed,
      canvasCarrierRequested: state.canvasCarrierRequested,
      canvasCarrierHandoffOk: state.canvasCarrierHandoffOk,
      copyDiagnosticPreserved: state.copyDiagnosticPreserved,
      receiptToggleReady: state.receiptToggleReady,
      inspectPlanetControlAvailable: state.inspectPlanetControlAvailable,
      diagnosticDockRestorable: state.diagnosticDockRestorable,
      buttonsReachable: state.buttonsReachable,
      receiptOverlayIndependent: state.receiptOverlayIndependent,
      imageRendered: state.imageRendered,
      firstFrameDetected: state.firstFrameDetected,
      dragInspectionBound: state.dragInspectionBound,
      diagnosticCanLeavePlanetFrame: state.diagnosticCanLeavePlanetFrame
    };

    state.northGateReady = Boolean(
      bool(read.canvasReady) &&
      bool(read.atlasBuildComplete) &&
      bool(read.textureComposeComplete) &&
      bool(read.visibleContentProof) &&
      bool(read.visiblePlanetAvailable)
    );

    state.eastGateReady = Boolean(
      bool(read.cooperativeBootUsed) &&
      !bool(read.syncBootFallbackUsed) &&
      bool(read.canvasCarrierRequested) &&
      bool(read.canvasCarrierHandoffOk) &&
      !bool(read.blockingFutureEventViolation)
    );

    state.westGateReady = Boolean(
      bool(read.copyDiagnosticPreserved) &&
      bool(read.receiptToggleReady) &&
      bool(read.inspectPlanetControlAvailable) &&
      bool(read.diagnosticDockRestorable) &&
      bool(read.buttonsReachable) &&
      bool(read.receiptOverlayIndependent, true)
    );

    state.southGateReady = Boolean(
      bool(read.imageRendered) &&
      bool(read.firstFrameDetected) &&
      bool(read.dragInspectionBound) &&
      bool(read.visiblePlanetAvailable) &&
      bool(read.diagnosticCanLeavePlanetFrame)
    );

    state.newsGatePassedBeforeF21 = Boolean(
      state.northGateReady &&
      state.eastGateReady &&
      state.westGateReady &&
      state.southGateReady
    );

    state.f21Allowed = Boolean(
      state.f13SubsequenceComplete &&
      state.f13LastRequiredEvent === "INSPECT_MODE_READY" &&
      state.newsGatePassedBeforeF21
    );

    state.f21AfterF13N = state.f21Allowed;

    return {
      northGateReady: state.northGateReady,
      eastGateReady: state.eastGateReady,
      westGateReady: state.westGateReady,
      southGateReady: state.southGateReady,
      newsGatePassedBeforeF21: state.newsGatePassedBeforeF21
    };
  }

  function completionReady() {
    if (state.canvasReady && !state.visibleContentProof) startVisibleContentProof("completion-ready-check");
    evaluateInspectGate(false);
    evaluateNewsGates();
    updateStateFromCheckpointReceipt();

    return Boolean(
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
      state.receiptToggleReady &&
      state.buttonsReachable &&
      state.receiptOverlayIndependent &&
      state.newsGatePassedBeforeF21 &&
      state.f13SubsequenceComplete &&
      state.f13LastRequiredEvent === "INSPECT_MODE_READY"
    );
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
      ["receiptToggleReady", state.receiptToggleReady],
      ["buttonsReachable", state.buttonsReachable],
      ["receiptOverlayIndependent", state.receiptOverlayIndependent],
      ["northGateReady", state.northGateReady],
      ["eastGateReady", state.eastGateReady],
      ["westGateReady", state.westGateReady],
      ["southGateReady", state.southGateReady],
      ["newsGatePassedBeforeF21", state.newsGatePassedBeforeF21],
      ["f13SubsequenceComplete", state.f13SubsequenceComplete],
      ["f13LastRequiredEventIsInspectMode", state.f13LastRequiredEvent === "INSPECT_MODE_READY"]
    ];

    const missing = checks.find((entry) => !entry[1]);
    return missing ? `WAITING_${missing[0]}` : "NONE";
  }

  function derivePendingStatus() {
    if (state.canvasReady && !state.visibleContentProof) return "VISIBLE_CONTENT_PROOF_PENDING";
    if (state.canvasReady && state.visibleContentProof && !state.inspectModeAvailable) return "INSPECT_MODE_MISSING";
    if (state.canvasReady && state.visibleContentProof && !state.diagnosticCanLeavePlanetFrame) return "INSPECT_MODE_RESTORE_MISSING";
    if (state.canvasReady && state.visibleContentProof && !state.buttonsReachable) return "INSPECT_BUTTONS_MISSING";
    if (state.canvasReady && state.visibleContentProof && state.diagnosticCanLeavePlanetFrame && !state.newsGatePassedBeforeF21) return "NEWS_GATE_PENDING";
    if (state.firstFrameDetected && !state.canvasReady) return "CANVAS_READY_PENDING";
    return "CHECKPOINT_SEQUENCE_PENDING";
  }

  function tryFinalize(reason = "manual") {
    if (state.completionLatched) return true;

    ensureCockpitStructure();
    if (state.canvasReady && !state.visibleContentProof) startVisibleContentProof(`try-finalize-${reason}`);
    evaluateInspectGate(true);
    trySubmitInspectReady();
    evaluateNewsGates();
    updateStateFromCheckpointReceipt();

    const ready = completionReady();

    if (!ready) {
      state.mainProgressCap = 98;
      state.mainDisplayProgress = Math.min(98, Math.max(state.mainDisplayProgress, Number((getCheckpointReceipt() || {}).visibleProgress || 0)));
      state.visibleLoadingActive = !(state.visibleContentProof && state.diagnosticCanLeavePlanetFrame);
      state.diagnosticCockpitReady = Boolean(refs.cockpit);
      state.postgameStatus = derivePendingStatus();
      state.firstFailedCoordinate = firstMissingCompletionCoordinate();
      state.recommendedNextRenewalTarget = state.visibleContentProof ? COHERENCE_FILE : CANVAS_FILE;
      publishGlobals();
      scheduleRender();
      return false;
    }

    const f21Result = submitCheckpoint("COMPLETION_LATCHED", {
      reason,
      f21Allowed: true,
      completionLatched: true,
      visibleContentProof: true,
      visiblePlanetAvailable: true,
      inspectModeAvailable: true,
      diagnosticCanLeavePlanetFrame: true,
      newsGatePassedBeforeF21: true
    }, {
      f21Allowed: true,
      snapshot: {
        completionLatched: true,
        f21Allowed: true,
        newsGatePassedBeforeF21: true
      }
    });

    updateStateFromCheckpointReceipt();

    const f21Admitted = Boolean(
      state.completionLatched ||
      (
        f21Result &&
        f21Result.action === CHECKPOINT_ACTIONS.ADMIT
      )
    );

    if (!f21Admitted) {
      state.mainProgressCap = 98;
      state.mainDisplayProgress = 98;
      state.visibleLoadingActive = false;
      state.diagnosticCockpitReady = true;
      state.postgameStatus = "F21_BLOCKED_BY_CHECKPOINT_GOVERNOR";
      state.firstFailedCoordinate = "F21_BLOCKED_CHECKPOINT_SESSION";
      state.recommendedNextRenewalTarget = COHERENCE_FILE;
      publishGlobals();
      scheduleRender();
      return false;
    }

    state.completionLatched = true;
    state.visibleLoadingActive = false;
    state.diagnosticCockpitReady = true;
    state.finalReceiptAvailable = true;
    state.currentStage = "F21";
    state.highestStage = "F21";
    state.mainProgressCap = 100;
    state.mainDisplayProgress = 100;
    state.cockpitMode = state.planetInspectModeActive ? "planet-inspect" : "diagnostic-dock";
    state.postgameStatus = "READY_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE";
    state.firstFailedCoordinate = "NONE_NEWS_FIBONACCI_F21_LATCHED";
    state.recommendedNextRenewalTarget = "read-postgame-canvas-or-triple-g-receipt";
    state.latestVisibleEvent = "COMPLETION_LATCHED";
    state.f21AfterF13N = true;
    state.readyTextRequiresCompletionLatch = true;

    if (!state.planetInspectModeActive) setCockpitMode("diagnostic-dock");

    publishGlobals();
    scheduleRender();
    return true;
  }

  function renderCheckpointRows() {
    const receipt = getCheckpointReceipt();
    const sequence = receipt && Array.isArray(receipt.sequence) ? receipt.sequence : FALLBACK_CHECKPOINTS;
    const activeId = receipt && receipt.activeCheckpointId ? receipt.activeCheckpointId : state.activeCheckpointId;
    const completed = new Set(asArray(receipt && receipt.completedCheckpoints ? receipt.completedCheckpoints : state.completedCheckpoints));

    return sequence.map((checkpoint) => {
      let status = checkpoint.status || "PENDING";

      if (completed.has(checkpoint.id)) status = "COMPLETE";
      if (checkpoint.id === activeId && !completed.has(checkpoint.id) && !state.completionLatched) status = "ACTIVE";
      if (state.completionLatched && checkpoint.id === "F21_COMPLETION_LATCHED") status = "COMPLETE";

      const progress = status === "COMPLETE"
        ? checkpoint.progress
        : status === "ACTIVE"
          ? checkpoint.progress
          : 0;

      const message =
        status === "COMPLETE"
          ? "Complete."
          : status === "ACTIVE"
            ? "Active checkpoint. Future checkpoints are held until this completes."
            : "Pending chronological turn.";

      return `
        <section class="hearth-checkpoint-row" data-checkpoint="${escapeHtml(checkpoint.id)}" data-status="${escapeHtml(status)}">
          <div class="hearth-checkpoint-top">
            <span>${escapeHtml(checkpoint.fibonacci)} · ${escapeHtml(checkpoint.label)}</span>
            <span>${escapeHtml(status)}</span>
          </div>
          <div class="hearth-checkpoint-msg">event=${escapeHtml(checkpoint.event)} · rank=${escapeHtml(checkpoint.rank)} · ${escapeHtml(message)}</div>
          <div class="hearth-checkpoint-track">
            <span class="hearth-checkpoint-fill" style="width:${clamp(progress, 0, 100)}%"></span>
          </div>
        </section>
      `;
    }).join("");
  }

  function computeProgress() {
    updateStateFromCheckpointReceipt();

    if (state.completionLatched) {
      state.mainDisplayProgress = 100;
      state.mainProgressCap = 100;
      return 100;
    }

    const receipt = getCheckpointReceipt();
    const visibleProgress = receipt && Number.isFinite(Number(receipt.visibleProgress))
      ? Number(receipt.visibleProgress)
      : state.mainDisplayProgress;

    state.mainProgressCap = 98;
    state.mainDisplayProgress = Math.min(98, Math.max(state.mainDisplayProgress, visibleProgress || 0));

    if (state.canvasReady) state.mainDisplayProgress = Math.max(state.mainDisplayProgress, 98);
    if (state.visibleContentProof) state.mainDisplayProgress = Math.max(state.mainDisplayProgress, 98);
    if (state.diagnosticCanLeavePlanetFrame) state.mainDisplayProgress = Math.max(state.mainDisplayProgress, 98);

    return Math.round(Math.min(98, state.mainDisplayProgress));
  }

  function scheduleRender() {
    if (renderTimer) return;

    renderTimer = root.setTimeout(() => {
      renderTimer = 0;
      render();
    }, 80);
  }

  function render() {
    if (!refs.cockpit) ensureCockpitStructure();
    if (!refs.cockpit) return;

    updateStateFromCheckpointReceipt();
    evaluateInspectGate(false);
    evaluateNewsGates();

    const progress = computeProgress();
    const elapsed = state.startedAtMs ? nowMs() - state.startedAtMs : 0;
    const activeLabel = state.activeFibonacciStage || state.currentStage || "F1A";

    if (refs.title) {
      refs.title.textContent = state.completionLatched
        ? "READY · PLANET VISIBLE · DIAGNOSTIC AVAILABLE"
        : (
          state.canvasReady && !state.visibleContentProof
            ? "VISIBLE CONTENT PROOF PENDING"
            : (
              state.visibleContentProof && !state.diagnosticCanLeavePlanetFrame
                ? "INSPECT MODE PROOF PENDING"
                : "FORMING HEARTH VISIBLE PLANET"
            )
        );
    }

    if (refs.stage) {
      refs.stage.textContent = state.completionLatched
        ? "F21 · Completion latch"
        : `${activeLabel} · ${state.activeCheckpointId || "checkpoint active"}`;
    }

    if (refs.heartbeat) {
      refs.heartbeat.textContent = state.completionLatched
        ? `READY gated by F21 · elapsed=${formatElapsed(elapsed)}`
        : `oneActiveCheckpoint=true · active=${state.activeCheckpointId || "pending"} · elapsed=${formatElapsed(elapsed)}`;
    }

    if (refs.latest) {
      refs.latest.textContent = `latest=${state.latestVisibleEvent}`;
    }

    if (refs.mainFill) refs.mainFill.style.width = `${progress}%`;
    if (refs.mainPercent) refs.mainPercent.textContent = `${progress}%`;

    if (refs.laneList) {
      refs.laneList.classList.add("hearth-checkpoint-list");
      refs.laneList.innerHTML = renderCheckpointRows();
    }

    if (refs.receiptPre) refs.receiptPre.textContent = getReceiptText();

    refs.cockpit.dataset.cockpitMode = state.cockpitMode;
    refs.cockpit.dataset.hearthCompletionLatched = String(state.completionLatched);
    refs.cockpit.dataset.hearthVisibleContentProof = String(state.visibleContentProof);
    refs.cockpit.dataset.hearthVisiblePlanetAvailable = String(state.visiblePlanetAvailable);
    refs.cockpit.dataset.hearthCarrierOnlyDetected = String(state.carrierOnlyDetected);
    refs.cockpit.dataset.hearthDiagnosticCanLeavePlanetFrame = String(state.diagnosticCanLeavePlanetFrame);
    refs.cockpit.dataset.hearthOneActiveCheckpointAtATime = "true";
    refs.cockpit.dataset.hearthReadyTextRequiresCompletionLatch = "true";
    refs.cockpit.dataset.hearthCoherenceSemiconductor = CONTRACT;

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
      "Hearth route Runtime Table checkpoint governor consumer active.",
      `Contract ${CONTRACT}`,
      `Receipt ${RECEIPT}`,
      `File ${COHERENCE_FILE}`,
      `Runtime Table ${RUNTIME_TABLE_FILE}`,
      `Checkpoint governor present ${state.checkpointGovernorPresent}`,
      `Checkpoint session created ${state.checkpointSessionCreated}`,
      `One active checkpoint at a time ${state.oneActiveCheckpointAtATime}`,
      `Active checkpoint ${state.activeCheckpointId}`,
      `Canvas ready ${state.canvasReady}`,
      `Visible content proof ${state.visibleContentProof}`,
      `Inspect mode available ${state.inspectModeAvailable}`,
      `Diagnostic can leave planet frame ${state.diagnosticCanLeavePlanetFrame}`,
      `Buttons reachable ${state.buttonsReachable}`,
      `NEWS passed ${state.newsGatePassedBeforeF21}`,
      `F21 allowed ${state.f21Allowed}`,
      `Completion latched ${state.completionLatched}`,
      `Postgame status ${state.postgameStatus}`,
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
      }, 1200);
    }

    state.copyDiagnosticPreserved = Boolean(refs.copyButton);
    return ok;
  }

  function getReceipt() {
    updateStateFromCheckpointReceipt();
    evaluateInspectGate(false);
    evaluateNewsGates();

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

      checkpointGovernorPresent: state.checkpointGovernorPresent,
      checkpointSessionCreated: state.checkpointSessionCreated,
      checkpointSessionConsumed: state.checkpointSessionConsumed,
      checkpointSessionReceiptAvailable: state.checkpointSessionReceiptAvailable,
      checkpointGovernorFallbackUsed: state.checkpointGovernorFallbackUsed,
      checkpointSessionError: state.checkpointSessionError,
      chronologicalFibonacciAlignment: state.chronologicalFibonacciAlignment,
      newsFibonacciAlignment: state.newsFibonacciAlignment,
      oneActiveCheckpointAtATime: state.oneActiveCheckpointAtATime,
      futureEventsQueued: state.futureEventsQueued,
      completedEventsArchived: state.completedEventsArchived,
      regressiveEventsBlocked: state.regressiveEventsBlocked,
      blockedProgressCap: state.blockedProgressCap,
      readyTextRequiresCompletionLatch: state.readyTextRequiresCompletionLatch,

      activeCheckpointId: state.activeCheckpointId,
      activeCheckpointRank: state.activeCheckpointRank,
      activeFibonacciStage: state.activeFibonacciStage,
      highestCompletedCheckpointId: state.highestCompletedCheckpointId,
      highestCompletedRank: state.highestCompletedRank,
      completedCheckpoints: clonePlain(state.completedCheckpoints),
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
      visibleContentClasses: clonePlain(state.visibleContentClasses),
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
      mainDisplayProgress: Math.round(state.mainDisplayProgress),
      mainProgressCap: state.mainProgressCap,
      heartbeatElapsedMs: state.heartbeatElapsedMs,

      checkpointReceipt: clonePlain(state.checkpointReceipt),
      phaseEvents: clonePlain(state.phaseEvents),
      progressOnlyEvents: clonePlain(state.progressOnlyEvents),
      archivedLateEvents: clonePlain(state.archivedLateEvents),
      localEvents: clonePlain(state.localEvents),
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
    const checkpointReceipt = receipt.checkpointReceipt || {};
    const sequence = Array.isArray(checkpointReceipt.sequence) ? checkpointReceipt.sequence : FALLBACK_CHECKPOINTS;

    const checkpointText = sequence.map((checkpoint) => (
      `- ${checkpoint.id}: rank=${checkpoint.rank}; fibonacci=${checkpoint.fibonacci}; status=${checkpoint.status || (receipt.completedCheckpoints.includes(checkpoint.id) ? "COMPLETE" : checkpoint.id === receipt.activeCheckpointId ? "ACTIVE" : "PENDING")}; complete=${receipt.completedCheckpoints.includes(checkpoint.id)}; progress=${checkpoint.progress}; event=${checkpoint.event}`
    )).join("\n") || "- none";

    const phases = receipt.phaseEvents.map((event) => (
      `- ${event.at || ""} :: ${event.phase || ""} :: progress=${event.percent || ""} :: ${event.message || ""}`
    )).join("\n") || "- none";

    const progressOnly = receipt.progressOnlyEvents.map((event) => (
      `- ${event.at || ""} :: ${event.phase || ""} :: progress=${event.percent || ""} :: ${event.message || ""}`
    )).join("\n") || "- none";

    const archived = receipt.archivedLateEvents.slice(-120).map((event) => (
      `- ${event.at || ""} :: ${event.event || ""} :: stage=${event.stage || ""} :: reason=${event.reason || ""} :: ${event.message || ""}`
    )).join("\n") || "- none";

    const local = receipt.localEvents.map((event) => (
      `- ${event.at || ""} :: ${event.event || ""} :: action=${event.action || ""} :: ${event.reason || ""}`
    )).join("\n") || "- none";

    const errors = receipt.errors.map((error) => (
      `- ${error.at || ""} :: ${error.code || ""} :: ${error.message || ""}`
    )).join("\n") || "- none";

    return [
      "HEARTH_ROUTE_RUNTIME_TABLE_CHECKPOINT_GOVERNOR_CONSUMER_INSPECT_GATE_RECEIPT",
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
      `activeCheckpointId=${receipt.activeCheckpointId}`,
      `activeCheckpointRank=${receipt.activeCheckpointRank}`,
      `activeFibonacciStage=${receipt.activeFibonacciStage}`,
      `highestCompletedCheckpointId=${receipt.highestCompletedCheckpointId}`,
      `highestCompletedRank=${receipt.highestCompletedRank}`,
      `completedCheckpoints=${receipt.completedCheckpoints.join(",")}`,
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
      `visibleContentClasses=${receipt.visibleContentClasses.join(",")}`,
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
      checkpointText,
      "",
      "CANVAS_PHASE_EVENTS",
      phases,
      "",
      "PROGRESS_ONLY_EVENTS",
      progressOnly,
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
    state.updatedAt = nowIso();

    root.HEARTH = root.HEARTH || {};
    root.HEARTH.routeConductor = api;
    root.HEARTH.coherenceSemiconductor = api;
    root.HEARTH.checkpointGovernorConsumer = api;

    root.HEARTH_ROUTE_CONDUCTOR = api;
    root.HearthRouteConductor = api;
    root.HEARTH_ACTIVE_ROUTE = api;
    root.HEARTH_ROUTE_COHERENCE_SEMICONDUCTOR = api;
    root.HEARTH_ROUTE_CHECKPOINT_GOVERNOR_CONSUMER = api;
    root.HEARTH_ROUTE_CONDUCTOR_CONTRACT = CONTRACT;

    const receipt = getReceipt();

    root.HEARTH_ROUTE_CHECKPOINT_GOVERNOR_CONSUMER_RECEIPT = receipt;
    root.HEARTH_ROUTE_COHERENCE_SEMICONDUCTOR_RECEIPT = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_RECEIPT = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_POSTGAME_RECEIPT = receipt;

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
    dataset.hearthRuntimeTableCheckpointGovernorConsumerLoaded = "true";
    dataset.hearthRuntimeTableCheckpointGovernorConsumerContract = CONTRACT;
    dataset.hearthPairedSemiconductor = "true";
    dataset.hearthConstraintSemiconductor = INDEX_FILE;
    dataset.hearthCoherenceSemiconductor = COHERENCE_FILE;
    dataset.hearthActiveRouteFile = COHERENCE_FILE;
    dataset.hearthActiveRouteConductor = COHERENCE_FILE;
    dataset.hearthActiveRouteContract = CONTRACT;

    dataset.hearthCheckpointGovernorPresent = String(state.checkpointGovernorPresent);
    dataset.hearthCheckpointSessionCreated = String(state.checkpointSessionCreated);
    dataset.hearthCheckpointSessionConsumed = String(state.checkpointSessionConsumed);
    dataset.hearthCheckpointGovernorFallbackUsed = String(state.checkpointGovernorFallbackUsed);
    dataset.hearthChronologicalFibonacciAlignment = "true";
    dataset.hearthNewsFibonacciAlignment = "true";
    dataset.hearthOneActiveCheckpointAtATime = "true";
    dataset.hearthFutureEventsQueued = "true";
    dataset.hearthCompletedEventsArchived = "true";
    dataset.hearthRegressiveEventsBlocked = "true";
    dataset.hearthBlockedProgressCap = "98";
    dataset.hearthReadyTextRequiresCompletionLatch = "true";

    dataset.hearthActiveCheckpointId = state.activeCheckpointId;
    dataset.hearthActiveCheckpointRank = String(state.activeCheckpointRank);
    dataset.hearthActiveFibonacciStage = state.activeFibonacciStage;
    dataset.hearthHighestCompletedCheckpointId = state.highestCompletedCheckpointId;
    dataset.hearthHighestCompletedRank = String(state.highestCompletedRank);

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
    dataset.hearthVisibleContentSampleCount = String(state.visibleContentSampleCount);
    dataset.hearthVisibleContentVarianceScore = String(state.visibleContentVarianceScore);
    dataset.hearthVisibleContentClassCount = String(state.visibleContentClassCount);
    dataset.hearthCarrierOnlyDetected = String(state.carrierOnlyDetected);

    dataset.hearthVisiblePlanetAvailable = String(state.visiblePlanetAvailable);
    dataset.hearthPlanetCanvasPresent = String(state.planetCanvasPresent);
    dataset.hearthPlanetCanvasNonZeroSize = String(state.planetCanvasNonZeroSize);
    dataset.hearthPlanetFramePainted = String(state.planetFramePainted);
    dataset.hearthNonblankPlanetVisible = String(state.nonblankPlanetVisible);
    dataset.hearthPlanetNotObstructed = String(state.planetNotObstructed);

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
    dataset.hearthCanvasCarrierRequested = String(state.canvasCarrierRequested);
    dataset.hearthCanvasCarrierHandoffOk = String(state.canvasCarrierHandoffOk);
    dataset.hearthCooperativeBootUsed = String(state.cooperativeBootUsed);
    dataset.hearthSyncBootFallbackUsed = String(state.syncBootFallbackUsed);
    dataset.hearthCanvasLaneClosed = String(state.canvasLaneClosed);
    dataset.hearthPostCanvasPhaseBouncePrevented = String(state.postCanvasPhaseBouncePrevented);

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
        if (state.canvasReady && !state.visibleContentProof) {
          startVisibleContentProof("heartbeat");
        }

        evaluateInspectGate(true);
        trySubmitInspectReady();
        tryFinalize("heartbeat");
      } else {
        publishGlobals();
        scheduleRender();
      }
    }, 1000);
  }

  function startRetryLoop() {
    if (retryTimer) root.clearInterval(retryTimer);

    retryTimer = root.setInterval(() => {
      if (state.completionLatched) {
        root.clearInterval(retryTimer);
        retryTimer = 0;
        return;
      }

      ensureCockpitStructure();

      if (!canvasBootRequested && getCanvasApi()) {
        callCanvasCarrier();
      }

      if (state.canvasReady) {
        startVisibleContentProof("retry-loop");
      }

      evaluateInspectGate(true);
      trySubmitInspectReady();
      tryFinalize("retry-loop");
    }, 900);
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
    ensureSharedLedger();
    ensureMount();
    ensureCockpitStructure();
    createCheckpointSession();
    seedEarlyCheckpoints();

    publishGlobals();
    render();

    root.setTimeout(callCanvasCarrier, 80);
    root.setTimeout(() => {
      if (state.canvasReady) startVisibleContentProof("post-boot-220ms");
      evaluateInspectGate(true);
      tryFinalize("post-boot-220ms");
    }, 220);
    root.setTimeout(() => {
      if (state.canvasReady) startVisibleContentProof("post-boot-900ms");
      evaluateInspectGate(true);
      tryFinalize("post-boot-900ms");
    }, 900);
    root.setTimeout(() => {
      if (state.canvasReady) startVisibleContentProof("post-boot-1800ms");
      evaluateInspectGate(true);
      tryFinalize("post-boot-1800ms");
    }, 1800);

    startHeartbeat();
    startRetryLoop();

    return getReceipt();
  }

  function dispose(reason = "manual-dispose") {
    if (heartbeatTimer) {
      root.clearInterval(heartbeatTimer);
      heartbeatTimer = 0;
    }

    if (retryTimer) {
      root.clearInterval(retryTimer);
      retryTimer = 0;
    }

    state.localEvents.push({
      at: nowIso(),
      event: "CHECKPOINT_GOVERNOR_CONSUMER_DISPOSED",
      reason
    });
  }

  function acceptConstraintSemiconductor(payload = {}) {
    if (payload.mount && payload.mount.nodeType === 1) refs.mount = payload.mount;
    if (payload.cockpit && payload.cockpit.nodeType === 1) refs.cockpit = payload.cockpit;
    if (payload.sharedLedger && isObject(payload.sharedLedger)) {
      root.HEARTH_LOAD_LEDGER = payload.sharedLedger;
      refs.ledger = payload.sharedLedger;
    }

    ensureSharedLedger();
    ensureMount();
    ensureCockpitStructure();

    submitCheckpoint("CONDUCTOR_HYDRATED", {
      source: "constraint-semiconductor-accepted",
      calledBy: payload.calledBy || ""
    });

    return true;
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
    hydrateIndexBridge: acceptConstraintSemiconductor,
    attachIndexBridge: acceptConstraintSemiconductor,
    receiveIndexBridge: acceptConstraintSemiconductor,

    handleCanvasPhase,
    handleCanvasReceipt,
    startVisibleContentProof,
    proveVisibleContent,
    evaluateInspectGate,
    tryFinalize,
    setCockpitMode,
    getReceipt,
    getReceiptText,
    copyDiagnostic,

    supportsPairedSemiconductor: true,
    supportsCoherenceSideSemiconductor: true,
    supportsRuntimeTableCheckpointGovernorConsumer: true,
    supportsSynchronizedLoading: true,
    supportsNewsProtocol: true,
    supportsFibonacciSequence: true,
    supportsChronologicalFibonacciAlignment: true,
    supportsNewsFibonacciAlignment: true,
    supportsOneActiveCheckpointAtATime: true,
    supportsFutureEventsQueued: true,
    supportsCompletedEventsArchived: true,
    supportsRegressiveEventsBlocked: true,
    supportsBlockedProgressCap: true,
    supportsReadyTextRequiresCompletionLatch: true,
    supportsVisibleContentCompletionGate: true,
    supportsInspectModeCompletionGate: true,
    supportsDiagnosticDockRestore: true,
    supportsCopyDiagnosticPreservation: true,
    supportsShowReceiptPreservation: true,
    supportsCooperativeCanvasHandoff: true,

    ownsFirstPaintSurvival: false,
    ownsRuntimeTableLaw: false,
    ownsTripleGDiagnosticLaw: false,
    ownsCanvasDrawing: false,
    ownsAtlasGeneration: false,
    ownsTextureGeneration: false,
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

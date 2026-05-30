// /showroom/globe/hearth/hearth.js
// HEARTH_SOUTH_CANVAS_NESTED_RECEIPT_BRIDGE_TNT_v1
// Full-file replacement.
// South route conductor / visible completion authority only.
// Purpose:
// - Preserve the successful strict proof degrade reconciliation baseline.
// - Preserve postgame dedup + inspect gate behavior.
// - Preserve one-active-gear transmission semantics.
// - Preserve progress-only telemetry compaction.
// - Preserve Copy Diagnostic, Show/Hide Receipt, Inspect Planet, and diagnostic dock restoration.
// - Preserve canvas API retry and canvas receipt reconciliation.
// - Add nested canvas receipt bridge into South diagnostic.
// - Prove which canvas contract South consumed.
// - Export NEWS/Fibonacci canvas synchronization.
// - Export seven-continent canvas renewal evidence.
// - Latch full F21 when strict NEWS gates pass.
// Does not own:
// - North checkpoint truth
// - East first-paint shell
// - West gap taxonomy
// - Lab South visible-state composer
// - canvas drawing
// - terrain/source truth
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_SOUTH_CANVAS_NESTED_RECEIPT_BRIDGE_TNT_v1";
  const RECEIPT = "HEARTH_SOUTH_CANVAS_NESTED_RECEIPT_BRIDGE_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_SOUTH_ROUTE_CONDUCTOR_STRICT_PROOF_DEGRADE_RECONCILIATION_TNT_v3";
  const BASELINE_CONTRACT = "HEARTH_SOUTH_ROUTE_CONDUCTOR_STRICT_PROOF_DEGRADE_RECONCILIATION_TNT_v3";
  const VERSION = "2026-05-30.hearth-south-canvas-nested-receipt-bridge-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const ROUTE = "/showroom/globe/hearth/";
  const FILE = "/showroom/globe/hearth/hearth.js";
  const NORTH_FILE = "/assets/lab/runtime-table.js";
  const EAST_BRANCH_FILE = "/assets/lab/runtime-table.east.js";
  const WEST_BRANCH_FILE = "/assets/lab/runtime-table.west.js";
  const SOUTH_BRANCH_FILE = "/assets/lab/runtime-table.south.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const EXPECTED_CANVAS_CONTRACT = "HEARTH_SEVEN_CONTINENT_TRANSITIONAL_CANVAS_VISUAL_FIELD_TNT_v1";
  const EXPECTED_CANVAS_RECEIPT = "HEARTH_SEVEN_CONTINENT_TRANSITIONAL_CANVAS_VISUAL_FIELD_RECEIPT_v1";

  const MAX_SUBMITTED_EVENTS = 120;
  const MAX_ADMITTED_EVENTS = 80;
  const MAX_ARCHIVED_EVENTS = 48;
  const MAX_BLOCKED_EVENTS = 80;
  const MAX_QUEUED_EVENTS = 80;
  const MAX_LOCAL_EVENTS = 80;
  const MAX_ERRORS = 80;
  const CANVAS_RETRY_LIMIT = 20;
  const CANVAS_RETRY_DELAY_MS = 160;

  const PROGRESS_ONLY_EVENTS = new Set([
    "ATLAS_BUILD_PROGRESS",
    "TEXTURE_COMPOSE_PROGRESS",
    "SPHERE_RENDER_PROGRESS",
    "CANVAS_PROGRESS",
    "RENDER_PROGRESS"
  ]);

  const CHECKPOINTS = Object.freeze([
    {
      id: "F1A_HTML_SHELL_RENDERED",
      rank: 1,
      fibonacci: "F1A",
      event: "HTML_SHELL_RENDERED",
      label: "East shell rendered",
      aliases: ["EAST_HTML_SHELL_RENDERED", "HTML_READY", "SHELL_READY"]
    },
    {
      id: "F1B_LOAD_LEDGER_INITIALIZED",
      rank: 2,
      fibonacci: "F1B",
      event: "LOAD_LEDGER_INITIALIZED",
      label: "Load ledger initialized",
      aliases: ["HEARTH_LOAD_LEDGER_MONOTONIC_INITIALIZED", "NEWS_FIBONACCI_LEDGER_GUARD_ACTIVE", "EAST_LOAD_LEDGER_INITIALIZED"]
    },
    {
      id: "F2_FIRST_PAINT_COCKPIT_VISIBLE",
      rank: 3,
      fibonacci: "F2",
      event: "FIRST_PAINT_COCKPIT_VISIBLE",
      label: "First-paint cockpit visible",
      aliases: ["EAST_FIRST_PAINT_COCKPIT_VISIBLE", "COCKPIT_VISIBLE", "FIRST_PAINT_READY"]
    },
    {
      id: "F3_SCRIPT_ORDER_COMPLETE",
      rank: 4,
      fibonacci: "F3",
      event: "SCRIPT_ORDER_COMPLETE",
      label: "Script order complete",
      aliases: ["SCRIPT_LOADED", "SCRIPT_ORDER_VISIBLE", "EAST_SCRIPT_ORDER_VISIBILITY_ACTIVE"]
    },
    {
      id: "F5_AUTHORITY_AVAILABILITY_READY",
      rank: 5,
      fibonacci: "F5",
      event: "AUTHORITY_AVAILABILITY_READY",
      label: "Authority availability ready",
      aliases: ["RUNTIME_TABLE_AVAILABLE", "AUTHORITY_AVAILABLE", "WEST_HANDOFF_TABLE_PRESENT"]
    },
    {
      id: "F8_CONDUCTOR_HYDRATED",
      rank: 6,
      fibonacci: "F8",
      event: "CONDUCTOR_HYDRATED",
      label: "Conductor hydrated",
      aliases: ["CONDUCTOR_HYDRATED_EXISTING_COCKPIT", "COHERENCE_SEMICONDUCTOR_BOOTED", "SOUTH_ROUTE_CONDUCTOR_BOOTED"]
    },
    {
      id: "F13A_CANVAS_COOPERATIVE_BOOT_STARTED",
      rank: 7,
      fibonacci: "F13A",
      event: "CANVAS_COOPERATIVE_BOOT_STARTED",
      label: "Canvas cooperative boot started",
      aliases: ["CANVAS_BOOT_STARTED"]
    },
    {
      id: "F13B_CANVAS_MOUNT_CREATED",
      rank: 8,
      fibonacci: "F13B",
      event: "CANVAS_MOUNT_CREATED",
      label: "Canvas mount created",
      aliases: ["CANVAS_CARRIER_MOUNTED", "CANVAS_MOUNT_READY"]
    },
    {
      id: "F13C_CANVAS_CONTEXT_READY",
      rank: 9,
      fibonacci: "F13C",
      event: "CANVAS_CONTEXT_READY",
      label: "Canvas context ready",
      aliases: ["CANVAS_2D_CONTEXT_READY", "CONTEXT_READY"]
    },
    {
      id: "F13D_DRAG_INSPECTION_BOUND",
      rank: 10,
      fibonacci: "F13D",
      event: "DRAG_INSPECTION_BOUND",
      label: "Drag inspection bound",
      aliases: ["INSPECT_DRAG_BOUND", "POINTER_INSPECTION_BOUND"]
    },
    {
      id: "F13E_ATLAS_BUILD_STARTED",
      rank: 11,
      fibonacci: "F13E",
      event: "ATLAS_BUILD_STARTED",
      label: "Atlas build started",
      aliases: ["ATLAS_STARTED"]
    },
    {
      id: "F13F_ATLAS_BUILD_COMPLETE",
      rank: 12,
      fibonacci: "F13F",
      event: "ATLAS_BUILD_COMPLETE",
      label: "Atlas build complete",
      aliases: ["ATLAS_COMPLETE"]
    },
    {
      id: "F13G_TEXTURE_COMPOSE_STARTED",
      rank: 13,
      fibonacci: "F13G",
      event: "TEXTURE_COMPOSE_STARTED",
      label: "Texture compose started",
      aliases: ["TEXTURE_STARTED"]
    },
    {
      id: "F13H_TEXTURE_COMPOSE_COMPLETE",
      rank: 14,
      fibonacci: "F13H",
      event: "TEXTURE_COMPOSE_COMPLETE",
      label: "Texture compose complete",
      aliases: ["TEXTURE_COMPLETE"]
    },
    {
      id: "F13I_FIRST_FRAME_REQUESTED",
      rank: 15,
      fibonacci: "F13I",
      event: "FIRST_FRAME_REQUESTED",
      label: "First frame requested",
      aliases: ["FRAME_REQUESTED"]
    },
    {
      id: "F13J_FIRST_FRAME_DETECTED",
      rank: 16,
      fibonacci: "F13J",
      event: "FIRST_FRAME_DETECTED",
      label: "First frame detected",
      aliases: ["FRAME_DETECTED"]
    },
    {
      id: "F13K_CANVAS_READY",
      rank: 17,
      fibonacci: "F13K",
      event: "CANVAS_READY",
      label: "Canvas ready",
      aliases: ["CANVAS_COMPLETE"]
    },
    {
      id: "F13L_VISIBLE_CONTENT_PROOF_STARTED",
      rank: 18,
      fibonacci: "F13L",
      event: "VISIBLE_CONTENT_PROOF_STARTED",
      label: "Visible proof started",
      aliases: ["VISIBLE_PROOF_STARTED"]
    },
    {
      id: "F13M_VISIBLE_CONTENT_PROOF_PASSED",
      rank: 19,
      fibonacci: "F13M",
      event: "VISIBLE_CONTENT_PROOF_PASSED",
      label: "Visible proof passed",
      aliases: [
        "DEGRADED_VISIBLE_CONTENT_ACCEPTED",
        "VISIBLE_CONTENT_SOFT_GAP",
        "VISIBLE_CONTENT_ADMISSIBLE",
        "VISIBLE_FORWARD_PROGRESS"
      ]
    },
    {
      id: "F13N_INSPECT_MODE_READY",
      rank: 20,
      fibonacci: "F13N",
      event: "INSPECT_MODE_READY",
      label: "Inspect mode ready",
      aliases: ["DEGRADED_INSPECT_MODE_ACCEPTED", "INSPECT_FALLBACK_READY", "RECEIPT_FALLBACK_READY"]
    },
    {
      id: "F21_COMPLETION_LATCHED",
      rank: 21,
      fibonacci: "F21",
      event: "COMPLETION_LATCHED",
      label: "Completion latched",
      aliases: ["COMPLETION_LATCHED_AFTER_VISIBLE_CONTENT_PROOF", "COMPLETION_LATCHED_AFTER_CANVAS_READY", "F21_DEGRADED_COMPLETION_LATCHED"]
    }
  ]);

  const CHECKPOINT_BY_ID = CHECKPOINTS.reduce((map, item) => {
    map[item.id] = item;
    return map;
  }, {});

  const CHECKPOINT_BY_EVENT = CHECKPOINTS.reduce((map, item) => {
    map[item.event] = item;
    item.aliases.forEach((alias) => {
      map[alias] = item;
    });
    map[item.fibonacci] = item;
    return map;
  }, {});

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "south-canvas-nested-receipt-bridge",

    cycleOrder: "EAST -> WEST -> NORTH -> SOUTH -> CHECKPOINT -> EAST",
    transmissionMode: true,
    oneActiveGearAtATime: true,
    activeGearProgressResets: true,
    visibleProgressRepresentsCurrentGearOnly: true,

    northFile: NORTH_FILE,
    eastBranchFile: EAST_BRANCH_FILE,
    westBranchFile: WEST_BRANCH_FILE,
    southBranchFile: SOUTH_BRANCH_FILE,
    canvasFile: CANVAS_FILE,

    northPresent: false,
    eastBranchPresent: false,
    westBranchPresent: false,
    southBranchPresent: false,
    canvasPresent: false,
    sessionPresent: false,
    sessionCreatedBySouth: false,

    activeIndex: 0,
    completedCheckpoints: [],
    degradedCheckpoints: [],
    queuedEvents: [],
    archivedEvents: [],
    blockedEvents: [],
    admittedEvents: [],
    submittedEvents: [],
    localEvents: [],
    errors: [],

    reconciledCheckpointIds: [],
    reconciledCanvasKeys: [],
    lastCanvasReceiptSignature: "",
    lastLaneSignature: "",
    lastPacketSignature: "",
    completionClosed: false,

    progressOnlyEventCounts: {},
    progressOnlyEventLast: {},
    duplicatePostgameEventCount: 0,
    duplicateCompletedEventCount: 0,
    unknownEventCount: 0,
    compactArchiveCount: 0,

    canvasBootRequested: false,
    canvasBootStarted: false,
    canvasBootComplete: false,
    canvasBootError: "",
    canvasBootAttempts: 0,
    canvasRetryTimer: 0,

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

    strictVisibleProof: false,
    softGapVisibleProof: false,
    hardFailVisibleProof: false,
    strictInspectReady: false,
    fallbackInspectReady: false,
    f21LatchMode: "WAITING",

    latestEvent: "SOUTH_CANVAS_NESTED_RECEIPT_BRIDGE_LOADED",
    postgameStatus: "SOUTH_CANVAS_NESTED_RECEIPT_BRIDGE_LOADED",
    firstFailedCoordinate: "WAITING_BOOT",
    recommendedNextRenewalTarget: FILE,

    completionLatched: false,
    degradedCompletionLatched: false,
    readyTextAllowed: false,

    latestNorthResult: null,
    latestComposerPacket: null,
    latestCanvasReceipt: null,
    latestGap: null,

    renderCount: 0,
    ledgerWriteCount: 0,
    watchdogTicks: 0,
    booted: false,
    booting: false,

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
    stage: null,
    heartbeat: null,
    latest: null,
    fill: null,
    percent: null,
    lanes: null,
    receiptBox: null,
    receiptText: null,
    copyButton: null,
    toggleButton: null,
    inspectButton: null,
    collapseButton: null,
    showTab: null,
    status: null
  };

  let bootPromise = null;
  let canvasBootPromise = null;
  let watchdogTimer = 0;
  let renderTimer = 0;

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function safeNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === "true" || value === "1" || value === 1) return true;
    if (value === "false" || value === "0" || value === 0) return false;
    return fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, safeNumber(value, min)));
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : { ...value };
    }
  }

  function trimArray(array, max) {
    if (Array.isArray(array) && array.length > max) {
      array.splice(0, array.length - max);
    }
  }

  function getByNames(names) {
    for (const name of names) {
      if (!name) continue;

      const parts = String(name).split(".");
      let cursor = root;

      for (const part of parts) {
        if (!cursor || cursor[part] === undefined) {
          cursor = null;
          break;
        }
        cursor = cursor[part];
      }

      if (cursor) return cursor;
    }

    return null;
  }

  function checkpointFrom(value) {
    if (!value) return null;
    const key = safeString(value);
    return CHECKPOINT_BY_ID[key] || CHECKPOINT_BY_EVENT[key] || null;
  }

  function activeCheckpoint() {
    return CHECKPOINTS[Math.max(0, Math.min(CHECKPOINTS.length - 1, state.activeIndex))] || CHECKPOINTS[0];
  }

  function highestCompletedCheckpoint() {
    if (!state.completedCheckpoints.length) return null;
    return checkpointFrom(state.completedCheckpoints[state.completedCheckpoints.length - 1]);
  }

  function isCompleted(checkpointId) {
    return state.completedCheckpoints.includes(checkpointId);
  }

  function arrayPushUnique(array, value) {
    if (!array.includes(value)) array.push(value);
  }

  function recordLocal(event, detail = {}) {
    const item = {
      at: nowIso(),
      event,
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trimArray(state.localEvents, MAX_LOCAL_EVENTS);

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

    state.errors.push(item);
    trimArray(state.errors, MAX_ERRORS);

    state.updatedAt = item.at;
    return item;
  }

  function countProgressOnlyEvent(eventName, detail = {}) {
    const name = safeString(eventName, "UNKNOWN_PROGRESS_EVENT");
    state.progressOnlyEventCounts[name] = (state.progressOnlyEventCounts[name] || 0) + 1;
    state.progressOnlyEventLast[name] = {
      at: nowIso(),
      event: name,
      detail: clonePlain(detail)
    };
    state.latestEvent = name;
    state.updatedAt = state.progressOnlyEventLast[name].at;

    return {
      accepted: true,
      action: "COUNT_ONLY",
      reason: "progress-only-telemetry-not-archived",
      event: name
    };
  }

  function compactArchive(reason, eventName, gear, detail = {}) {
    state.compactArchiveCount += 1;

    if (
      reason === "duplicate-completed-gear-archived" ||
      reason === "duplicate-postgame-event-suppressed" ||
      reason === "postgame-closed-duplicate-suppressed"
    ) {
      state.duplicateCompletedEventCount += 1;
      if (state.completionClosed) state.duplicatePostgameEventCount += 1;
    }

    const item = {
      at: nowIso(),
      event: safeString(eventName),
      checkpointId: gear ? gear.id : "",
      action: "ARCHIVE",
      reason,
      detail: clonePlain(detail)
    };

    state.archivedEvents.push(item);
    trimArray(state.archivedEvents, MAX_ARCHIVED_EVENTS);

    return item;
  }

  function readReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    if (isFunction(authority.getReceipt)) {
      try {
        const receipt = authority.getReceipt();
        return isObject(receipt) ? receipt : null;
      } catch (_error) {
        return null;
      }
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    return null;
  }

  function readCanvasApi() {
    return getByNames([
      "HEARTH_CANVAS",
      "HEARTH_CANVAS_AUTHORITY",
      "HEARTH_CANVAS_EVIDENCE",
      "HEARTH.canvas",
      "HEARTH.canvasAuthority",
      "HEARTH.canvasEvidence",
      "DEXTER_LAB.hearthCanvasEvidence"
    ]);
  }

  function readCanvasReceipt() {
    const api = readCanvasApi();
    const receipt = readReceipt(api);

    if (receipt) {
      state.latestCanvasReceipt = receipt;
      return receipt;
    }

    const fallback =
      root.HEARTH_CANVAS_RECEIPT ||
      root.HEARTH_CANVAS_POSTGAME_RECEIPT ||
      null;

    if (fallback && isObject(fallback)) {
      state.latestCanvasReceipt = fallback;
      return fallback;
    }

    return {};
  }

  function datasetField(key, fallback = "") {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return fallback;
    const value = doc.documentElement.dataset[key];
    return value === undefined || value === null || value === "" ? fallback : value;
  }

  function buildCanvasReceiptBridge(canvas = readCanvasReceipt()) {
    const source = isObject(canvas) ? canvas : {};

    const canvasContract = safeString(
      source.contract || datasetField("hearthCanvasContract", ""),
      ""
    );

    const canvasReceipt = safeString(
      source.receipt || datasetField("hearthCanvasReceipt", ""),
      ""
    );

    return {
      canvasReceiptBridgeActive: true,
      canvasNestedReceiptAvailable: Boolean(canvasContract || canvasReceipt),

      canvasContract,
      canvasReceipt,
      canvasExpectedContract: EXPECTED_CANVAS_CONTRACT,
      canvasExpectedReceipt: EXPECTED_CANVAS_RECEIPT,
      canvasContractMatchesExpected: canvasContract === EXPECTED_CANVAS_CONTRACT,
      canvasReceiptMatchesExpected: canvasReceipt === EXPECTED_CANVAS_RECEIPT,

      canvasPreviousContract: safeString(source.previousContract || datasetField("hearthCanvasPreviousContract", ""), ""),
      canvasBaselineContract: safeString(source.baselineContract || datasetField("hearthCanvasBaselineContract", ""), ""),
      canvasVersion: safeString(source.version || "", ""),
      canvasFile: safeString(source.file || CANVAS_FILE, CANVAS_FILE),
      canvasRole: safeString(source.role || datasetField("hearthCanvasRole", ""), ""),

      canvasNewsProtocolSynchronized: safeBool(source.newsProtocolSynchronized, safeBool(datasetField("hearthCanvasNewsProtocolSynchronized", ""), false)),
      canvasFibonacciAlignmentSynchronized: safeBool(source.fibonacciAlignmentSynchronized, safeBool(datasetField("hearthCanvasFibonacciAlignmentSynchronized", ""), false)),
      canvasActiveFibonacciGate: safeString(source.activeFibonacciGate || datasetField("hearthCanvasActiveFibonacciGate", ""), ""),
      canvasFutureFibonacciGate: safeString(source.futureFibonacciGate || datasetField("hearthCanvasFutureFibonacciGate", ""), ""),
      canvasOneActiveGearAtATime: safeBool(source.oneActiveGearAtATime, safeBool(datasetField("hearthCanvasOneActiveGearAtATime", ""), false)),

      canvasSevenContinentVisualFallbackActive: safeBool(source.sevenContinentVisualFallbackActive, safeBool(datasetField("hearthCanvasSevenContinentVisualFallbackActive", ""), false)),
      canvasContinentVisualSeedCount: safeNumber(source.continentVisualSeedCount, safeNumber(datasetField("hearthCanvasContinentVisualSeedCount", ""), 0)),
      canvasContinentBlendMode: safeString(source.continentBlendMode || datasetField("hearthCanvasContinentBlendMode", ""), ""),
      canvasProceduralSixLobeAdditiveFieldRetired: safeBool(source.proceduralSixLobeAdditiveFieldRetired, safeBool(datasetField("hearthCanvasProceduralSixLobeAdditiveFieldRetired", ""), false)),
      canvasOceanChannelCutActive: safeBool(source.oceanChannelCutActive, safeBool(datasetField("hearthCanvasOceanChannelCutActive", ""), false)),
      canvasSeaLineTightened: safeBool(source.seaLineTightened, safeBool(datasetField("hearthCanvasSeaLineTightened", ""), false)),
      canvasCoastlineSharpeningActive: safeBool(source.coastlineSharpeningActive, safeBool(datasetField("hearthCanvasCoastlineSharpeningActive", ""), false)),

      canvasCachedTextureInvalidationAvailable: safeBool(source.cachedTextureInvalidationAvailable, safeBool(datasetField("hearthCanvasCachedTextureInvalidationAvailable", ""), false)),
      canvasTextureInvalidationCount: safeNumber(source.textureInvalidationCount, safeNumber(datasetField("hearthCanvasTextureInvalidationCount", ""), 0)),
      canvasTextureInvalidated: safeBool(source.textureInvalidated, safeBool(datasetField("hearthCanvasTextureInvalidated", ""), false)),
      canvasTextureRebuildRequested: safeBool(source.textureRebuildRequested, safeBool(datasetField("hearthCanvasTextureRebuildRequested", ""), false)),
      canvasTextureRebuildComplete: safeBool(source.textureRebuildComplete, safeBool(datasetField("hearthCanvasTextureRebuildComplete", ""), false)),
      canvasTextureRebuildError: safeString(source.textureRebuildError || "", ""),

      canvasVisualFidelityRenewalActive: safeBool(source.visualFidelityRenewalActive, safeBool(datasetField("hearthCanvasVisualFidelityRenewalActive", ""), false)),
      canvasSourceColorDemotedToPaletteInfluence: safeBool(source.sourceColorDemotedToPaletteInfluence, safeBool(datasetField("hearthCanvasSourceColorDemotedToPaletteInfluence", ""), false)),
      canvasElevationControlsLandShape: safeBool(source.elevationControlsLandShape, safeBool(datasetField("hearthCanvasElevationControlsLandShape", ""), false)),
      canvasHydrologyControlsWaterShape: safeBool(source.hydrologyControlsWaterShape, safeBool(datasetField("hearthCanvasHydrologyControlsWaterShape", ""), false)),
      canvasCoastlineContrastActive: safeBool(source.coastlineContrastActive, safeBool(datasetField("hearthCanvasCoastlineContrastActive", ""), false)),
      canvasCenterDarknessReduced: safeBool(source.centerDarknessReduced, safeBool(datasetField("hearthCanvasCenterDarknessReduced", ""), false)),
      canvasLightingPreservesSurfaceReadability: safeBool(source.lightingPreservesSurfaceReadability, safeBool(datasetField("hearthCanvasLightingPreservesSurfaceReadability", ""), false)),
      canvasStaleSourceMaskProtectionActive: safeBool(source.staleSourceMaskProtectionActive, safeBool(datasetField("hearthCanvasStaleSourceMaskProtectionActive", ""), false)),

      canvasStillDoesNotOwnPlanetTruth: safeBool(source.canvasStillDoesNotOwnPlanetTruth, safeBool(datasetField("hearthCanvasStillDoesNotOwnPlanetTruth", ""), false)),
      canvasTransitionalFallbackVisualField: safeBool(source.transitionalFallbackVisualField, safeBool(datasetField("hearthCanvasTransitionalFallbackVisualField", ""), false)),
      canvasUpstreamSevenContinentAuthorityPreferred: safeBool(source.upstreamSevenContinentAuthorityPreferred, safeBool(datasetField("hearthCanvasUpstreamSevenContinentAuthorityPreferred", ""), false)),
      canvasLandChannelStillReceiverOnly: safeBool(source.landChannelStillReceiverOnly, safeBool(datasetField("hearthCanvasLandChannelStillReceiverOnly", ""), false)),

      canvasF13EvidencePreserved: safeBool(source.f13CanvasEvidencePreserved, safeBool(datasetField("hearthCanvasF13EvidencePreserved", ""), false)),
      canvasF13EvidenceComplete: safeBool(source.f13CanvasEvidenceComplete, false),
      canvasF13HardFail: safeBool(source.f13HardFail, false),
      canvasF21ClaimedByCanvas: safeBool(source.f21ClaimedByCanvas, false),
      canvasReadyTextClaimedByCanvas: safeBool(source.readyTextClaimedByCanvas, false),

      canvasReady: safeBool(source.canvasReady, safeBool(datasetField("hearthCanvasReady", ""), false)),
      canvasImageRendered: safeBool(source.imageRendered, false),
      canvasVisiblePlanetAvailable: safeBool(source.visiblePlanetAvailable, safeBool(datasetField("hearthCanvasVisiblePlanetAvailable", ""), false)),
      canvasVisibleContentProof: safeBool(source.visibleContentProof, safeBool(datasetField("hearthCanvasVisibleContentProof", ""), false)),
      canvasVisibleContentStrictProof: safeBool(source.visibleContentStrictProof, false),
      canvasVisibleContentSoftGap: safeBool(source.visibleContentSoftGap, safeBool(datasetField("hearthCanvasVisibleContentSoftGap", ""), false)),
      canvasVisibleContentHardFail: safeBool(source.visibleContentHardFail, safeBool(datasetField("hearthCanvasVisibleContentHardFail", ""), false)),
      canvasVisibleForwardProgress: safeBool(source.visibleForwardProgress, safeBool(datasetField("hearthCanvasVisibleForwardProgress", ""), false)),

      canvasGeneratedImage: safeBool(source.generatedImage, false),
      canvasGraphicBox: safeBool(source.graphicBox, false),
      canvasWebGL: safeBool(source.webGL, false),
      canvasVisualPassClaimed: safeBool(source.visualPassClaimed, false)
    };
  }

  function readSouthComposer() {
    return getByNames([
      "LAB_RUNTIME_TABLE_SOUTH",
      "RUNTIME_TABLE_SOUTH",
      "DEXTER_LAB_RUNTIME_TABLE_SOUTH",
      "LAB_CARDINAL_RUNTIME_TABLE_SOUTH",
      "HEARTH_RUNTIME_TABLE_SOUTH",
      "HEARTH_SOUTH",
      "HEARTH_VISIBLE_STATE_COMPOSER",
      "DEXTER_LAB.runtimeTableSouth",
      "DEXTER_LAB.cardinalRuntimeTableSouth",
      "DEXTER_LAB.visibleStateComposer",
      "DEXTER_LAB.transmissionVisibleStateComposer"
    ]);
  }

  function readNorthFacade() {
    return getByNames([
      "LAB_RUNTIME_TABLE",
      "LAB_UNIVERSAL_PLANET_RUNTIME_TABLE",
      "RUNTIME_TABLE",
      "DexterRuntimeTable",
      "DEXTER_LAB.runtimeTable"
    ]);
  }

  function readEastBranch() {
    return getByNames([
      "LAB_RUNTIME_TABLE_EAST",
      "RUNTIME_TABLE_EAST",
      "DEXTER_LAB_RUNTIME_TABLE_EAST",
      "LAB_CARDINAL_RUNTIME_TABLE_EAST",
      "LAB_CHECKPOINT_GOVERNOR_EAST",
      "DEXTER_LAB.runtimeTableEast",
      "DEXTER_LAB.cardinalRuntimeTableEast",
      "DEXTER_LAB.checkpointGovernorEast"
    ]);
  }

  function readWestBranch() {
    return getByNames([
      "LAB_RUNTIME_TABLE_WEST",
      "RUNTIME_TABLE_WEST",
      "DEXTER_LAB_RUNTIME_TABLE_WEST",
      "LAB_CARDINAL_RUNTIME_TABLE_WEST",
      "LAB_GAP_CLASSIFIER_WEST",
      "DEXTER_LAB.runtimeTableWest",
      "DEXTER_LAB.cardinalRuntimeTableWest",
      "DEXTER_LAB.gapClassifierWest"
    ]);
  }

  function getExistingSession() {
    return getByNames([
      "HEARTH_CHECKPOINT_SESSION",
      "HEARTH_RUNTIME_CHECKPOINT_SESSION",
      "LAB_HEARTH_CHECKPOINT_SESSION",
      "LAB_CHECKPOINT_SESSION",
      "DEXTER_LAB.hearthCheckpointSession",
      "DEXTER_LAB.checkpointSession"
    ]);
  }

  function ensureNorthSession() {
    const existing = getExistingSession();

    if (existing && (isFunction(existing.submitEvent) || isFunction(existing.completeActive))) {
      state.sessionPresent = true;
      return existing;
    }

    const north = readNorthFacade();
    const east = readEastBranch();

    const creators = [
      north && north.createHearthCheckpointSession,
      east && east.createHearthCheckpointSession,
      north && north.createCheckpointSession,
      east && east.createCheckpointSession
    ].filter(isFunction);

    for (const creator of creators) {
      try {
        const session = creator({
          planetId: "hearth",
          planetLabel: "Hearth",
          route: ROUTE
        });

        if (session && (isFunction(session.submitEvent) || isFunction(session.completeActive))) {
          root.HEARTH_CHECKPOINT_SESSION = session;
          root.HEARTH_RUNTIME_CHECKPOINT_SESSION = session;
          root.LAB_HEARTH_CHECKPOINT_SESSION = session;
          root.DEXTER_LAB = root.DEXTER_LAB || {};
          root.DEXTER_LAB.hearthCheckpointSession = session;
          root.DEXTER_LAB.checkpointSession = session;

          state.sessionPresent = true;
          state.sessionCreatedBySouth = true;
          recordLocal("SOUTH_CREATED_HEARTH_CHECKPOINT_SESSION", { source: creator.name || "north-or-east" });
          return session;
        }
      } catch (error) {
        recordError("CREATE_CHECKPOINT_SESSION_FAILED", error && error.message ? error.message : String(error));
      }
    }

    state.sessionPresent = false;
    return null;
  }

  function refreshAuthorityPresence() {
    state.northPresent = Boolean(readNorthFacade());
    state.eastBranchPresent = Boolean(readEastBranch());
    state.westBranchPresent = Boolean(readWestBranch());
    state.southBranchPresent = Boolean(readSouthComposer());
    state.canvasPresent = Boolean(readCanvasApi());
    state.sessionPresent = Boolean(getExistingSession());
  }

  function ensureRefs() {
    if (!doc) return;

    refs.mount =
      doc.getElementById("hearthCanvasMount") ||
      doc.querySelector("[data-hearth-canvas-mount='true']") ||
      doc.querySelector("[data-hearth-canvas-mount]");

    refs.cockpit =
      doc.getElementById("hearthLoadCockpit") ||
      doc.querySelector("[data-hearth-load-cockpit='true']") ||
      doc.querySelector("[data-hearth-first-paint-cockpit='true']");

    refs.stage = doc.querySelector("[data-hearth-stage-label]");
    refs.heartbeat = doc.querySelector("[data-hearth-heartbeat-text]");
    refs.latest = doc.querySelector("[data-hearth-latest-event]");
    refs.fill = doc.querySelector("[data-hearth-main-progress-fill]");
    refs.percent = doc.querySelector("[data-hearth-main-progress-percent]");
    refs.lanes = doc.querySelector("[data-hearth-lane-list]");
    refs.receiptBox = doc.querySelector("[data-hearth-receipt-box]");
    refs.receiptText = doc.querySelector("[data-hearth-receipt-text]");
    refs.copyButton = doc.querySelector("[data-hearth-copy-diagnostic]");
    refs.toggleButton = doc.querySelector("[data-hearth-toggle-receipt]");
    refs.inspectButton = doc.querySelector("[data-hearth-inspect-planet]");
    refs.collapseButton = doc.querySelector("[data-hearth-collapse-cockpit]");
    refs.showTab =
      doc.querySelector("[data-hearth-south-show-diagnostic-tab]") ||
      doc.querySelector("[data-hearth-east-show-diagnostic-tab]");
    refs.status =
      doc.getElementById("hearth-route-status") ||
      doc.querySelector("[data-hearth-route-status]");

    state.copyDiagnosticPreserved = Boolean(refs.copyButton);
    state.receiptToggleReady = Boolean(refs.toggleButton);
    state.buttonsReachable = Boolean(refs.copyButton || refs.toggleButton || refs.inspectButton || refs.collapseButton);
    state.inspectPlanetControlAvailable = Boolean(refs.inspectButton);
    state.inspectModeAvailable = Boolean(refs.inspectButton && refs.cockpit);
    state.diagnosticCanLeavePlanetFrame = Boolean(refs.inspectButton && refs.cockpit && refs.showTab);
    state.diagnosticDockRestorable = Boolean(refs.cockpit);
    state.receiptOverlayIndependent = Boolean(refs.receiptBox || refs.receiptText);
    state.showDiagnosticTabVisible = Boolean(refs.showTab && refs.showTab.hidden === false);
    state.diagnosticDockHiddenForInspection = Boolean(refs.cockpit && refs.cockpit.dataset.cockpitMode === "planet-inspect");

    bindControls();
  }

  function classifyVisibleProof(eventName, detail = {}) {
    const key = safeString(eventName);
    const hard = Boolean(
      key === "VISIBLE_CONTENT_HARD_FAIL" ||
      safeBool(detail.visibleContentHardFail, false)
    );

    const explicitSoft = Boolean(
      key === "VISIBLE_CONTENT_SOFT_GAP" ||
      key === "DEGRADED_VISIBLE_CONTENT_ACCEPTED" ||
      safeBool(detail.visibleContentSoftGap, false)
    );

    const strict = Boolean(
      !hard &&
      !explicitSoft &&
      (
        safeBool(detail.visibleContentProof, false) ||
        key === "VISIBLE_CONTENT_PROOF_PASSED"
      )
    );

    const admissibleOnlySoft = Boolean(
      !strict &&
      !hard &&
      (
        safeBool(detail.visibleForwardProgress, false) ||
        safeBool(detail.visibleContentAdmissible, false)
      )
    );

    const soft = Boolean(!hard && !strict && (explicitSoft || admissibleOnlySoft));

    state.strictVisibleProof = strict;
    state.softGapVisibleProof = soft;
    state.hardFailVisibleProof = hard;

    return {
      strict,
      soft,
      hard,
      mode: hard ? "HARD_FAIL" : strict ? "STRICT" : soft ? "SOFT_GAP" : "UNKNOWN"
    };
  }

  function hasVisibleSurfaceSignal(snapshot = buildSnapshot()) {
    const classCount = safeNumber(snapshot.visibleContentClassCount, 0);
    const land = safeNumber(snapshot.visibleContentLandSampleCount, 0);
    const water = safeNumber(snapshot.visibleContentWaterSampleCount, 0);
    const other = safeNumber(snapshot.visibleContentOtherSampleCount, 0);

    return Boolean(
      safeBool(snapshot.canvasReady, false) &&
      safeBool(snapshot.firstFrameDetected, false) &&
      safeBool(snapshot.imageRendered, false) &&
      safeBool(snapshot.textureComposeComplete, false) &&
      safeBool(snapshot.nonblankPlanetVisible, false) &&
      (
        classCount > 0 ||
        land > 0 ||
        water > 0 ||
        other > 0 ||
        safeBool(snapshot.visibleForwardProgress, false)
      )
    );
  }

  function hasStrictInspectSignal(snapshot = buildSnapshot()) {
    const strict = Boolean(
      safeBool(snapshot.inspectModeAvailable, false) &&
      safeBool(snapshot.inspectPlanetControlAvailable, false) &&
      safeBool(snapshot.diagnosticCanLeavePlanetFrame, false) &&
      safeBool(snapshot.copyDiagnosticPreserved, true) &&
      safeBool(snapshot.receiptToggleReady, true) &&
      safeBool(snapshot.diagnosticDockRestorable, true) &&
      safeBool(snapshot.buttonsReachable, true)
    );

    state.strictInspectReady = strict;
    return strict;
  }

  function hasFallbackInspectSignal(snapshot = buildSnapshot()) {
    const fallback = Boolean(
      safeBool(snapshot.copyDiagnosticPreserved, true) &&
      safeBool(snapshot.receiptToggleReady, true) &&
      safeBool(snapshot.diagnosticDockRestorable, true) &&
      safeBool(snapshot.buttonsReachable, true) &&
      (
        safeBool(snapshot.receiptOverlayIndependent, true) ||
        safeBool(snapshot.partialReceiptAvailable, true) ||
        safeBool(snapshot.finalReceiptAvailable, false)
      )
    );

    state.fallbackInspectReady = fallback;
    return fallback;
  }

  function buildSnapshot(extra = {}) {
    const canvas = readCanvasReceipt();
    const canvasBridge = buildCanvasReceiptBridge(canvas);
    const active = activeCheckpoint();
    const highest = highestCompletedCheckpoint();

    ensureRefs();

    const inspectModeAvailable = safeBool(extra.inspectModeAvailable, state.inspectModeAvailable);
    const inspectPlanetControlAvailable = safeBool(extra.inspectPlanetControlAvailable, state.inspectPlanetControlAvailable);
    const diagnosticCanLeavePlanetFrame = safeBool(extra.diagnosticCanLeavePlanetFrame, state.diagnosticCanLeavePlanetFrame);
    const diagnosticDockHiddenForInspection = safeBool(extra.diagnosticDockHiddenForInspection, state.diagnosticDockHiddenForInspection);
    const showDiagnosticTabVisible = safeBool(extra.showDiagnosticTabVisible, state.showDiagnosticTabVisible);
    const copyDiagnosticPreserved = safeBool(extra.copyDiagnosticPreserved, state.copyDiagnosticPreserved);
    const receiptToggleReady = safeBool(extra.receiptToggleReady, state.receiptToggleReady);
    const diagnosticDockRestorable = safeBool(extra.diagnosticDockRestorable, state.diagnosticDockRestorable);
    const buttonsReachable = safeBool(extra.buttonsReachable, state.buttonsReachable);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      route: ROUTE,
      pageResponsive: true,

      activeGear: active ? active.id : "",
      activeCheckpointId: active ? active.id : "",
      activeCheckpointRank: active ? active.rank : 0,
      activeFibonacciStage: active ? active.fibonacci : "",
      completedCheckpoints: state.completedCheckpoints.slice(),
      degradedCheckpoints: state.degradedCheckpoints.slice(),
      highestCompletedCheckpointId: highest ? highest.id : "",
      highestCompletedRank: highest ? highest.rank : 0,

      routeMounted: Boolean(doc),
      shellRendered: true,
      htmlShellRendered: true,
      loadLedgerInitialized: true,
      sharedLedgerPresent: Boolean(root.HEARTH_LOAD_LEDGER || root.HEARTH_EAST_STEP1_HANDOFF_RECEIPT),
      firstPaintReady: Boolean(refs.cockpit || doc),
      cockpitReady: Boolean(refs.cockpit),
      loadingScreenReady: Boolean(refs.cockpit),
      scriptOrderComplete: true,
      scriptOrderVisible: true,
      authorityAvailabilityReady: true,
      runtimeTablePresent: state.northPresent,
      northAvailable: state.northPresent,
      conductorHydrated: true,
      southGlobalPresent: true,

      ...canvasBridge,

      canvasReady: safeBool(canvas.canvasReady, false),
      canvasCarrierMounted: safeBool(canvas.canvasCarrierMounted, false),
      canvasContextReady: safeBool(canvas.canvasContextReady, false),
      canvasCarrierRequested: safeBool(canvas.canvasCarrierRequested, false),
      canvasCarrierHandoffOk: safeBool(canvas.canvasCarrierHandoffOk, false),
      canvasCarrierHandoffError: safeString(canvas.canvasCarrierHandoffError, ""),
      canvasCarrierMethod: safeString(canvas.canvasCarrierMethod, ""),
      cooperativeBootUsed: safeBool(canvas.cooperativeBootUsed, state.canvasBootRequested),
      syncBootFallbackUsed: safeBool(canvas.syncBootFallbackUsed, false),

      atlasBuildStarted: safeBool(canvas.atlasBuildStarted, false),
      atlasBuildProgress: safeNumber(canvas.atlasBuildProgress, 0),
      atlasBuildComplete: safeBool(canvas.atlasBuildComplete, false),
      textureComposeStarted: safeBool(canvas.textureComposeStarted, false),
      textureComposeProgress: safeNumber(canvas.textureComposeProgress, 0),
      textureComposeComplete: safeBool(canvas.textureComposeComplete, false),
      firstFrameRequested: safeBool(canvas.firstFrameRequested, false),
      firstFrameDetected: safeBool(canvas.firstFrameDetected, false),
      imageRendered: safeBool(canvas.imageRendered, false),
      renderedAfterTexture: safeBool(canvas.renderedAfterTexture, false),
      dragInspectionBound: safeBool(canvas.dragInspectionBound, false),

      visibleContentProofStarted: safeBool(canvas.visibleContentProofStarted, false),
      visibleContentProof: safeBool(canvas.visibleContentProof, false),
      visibleContentStrictProof: safeBool(canvas.visibleContentStrictProof, safeBool(canvas.visibleContentProof, false)),
      visibleContentSoftGap: safeBool(canvas.visibleContentSoftGap, false),
      visibleContentHardFail: safeBool(canvas.visibleContentHardFail, false),
      visibleForwardProgress: safeBool(canvas.visibleForwardProgress, false),
      visibleContentAdmissible: safeBool(canvas.visibleContentAdmissible, false),
      visiblePlanetAvailable: safeBool(canvas.visiblePlanetAvailable, false),
      visibleContentProofMethod: safeString(canvas.visibleContentProofMethod, ""),
      visibleContentProofError: safeString(canvas.visibleContentProofError, ""),
      visibleContentSampleCount: safeNumber(canvas.visibleContentSampleCount, 0),
      visibleContentVarianceScore: safeNumber(canvas.visibleContentVarianceScore, 0),
      visibleContentClassCount: safeNumber(canvas.visibleContentClassCount, 0),
      visibleContentClasses: Array.isArray(canvas.visibleContentClasses) ? canvas.visibleContentClasses.join(",") : safeString(canvas.visibleContentClasses, ""),
      visibleContentLandSampleCount: safeNumber(canvas.visibleContentLandSampleCount, 0),
      visibleContentWaterSampleCount: safeNumber(canvas.visibleContentWaterSampleCount, 0),
      visibleContentOtherSampleCount: safeNumber(canvas.visibleContentOtherSampleCount, 0),
      visibleContentCarrierSampleCount: safeNumber(canvas.visibleContentCarrierSampleCount, 0),
      carrierOnlyDetected: safeBool(canvas.carrierOnlyDetected, false),

      planetCanvasPresent: safeBool(canvas.planetCanvasPresent, Boolean(refs.mount && refs.mount.querySelector && refs.mount.querySelector("canvas"))),
      planetCanvasNonZeroSize: safeBool(canvas.planetCanvasNonZeroSize, false),
      planetFramePainted: safeBool(canvas.planetFramePainted, false),
      nonblankPlanetVisible: safeBool(canvas.nonblankPlanetVisible, false),
      planetNotObstructed: safeBool(canvas.planetNotObstructed, false),

      inspectModeAvailable,
      inspectPlanetControlAvailable,
      diagnosticCanLeavePlanetFrame,
      diagnosticDockHiddenForInspection,
      showDiagnosticTabVisible,
      showDiagnosticTabVisibleWhenHidden: true,
      diagnosticDockRestorable,
      copyDiagnosticPreserved,
      receiptToggleReady,
      buttonsReachable,
      receiptOverlayIndependent: true,
      partialReceiptAvailable: true,
      finalReceiptAvailable: state.completionLatched,

      strictVisibleProof: state.strictVisibleProof,
      softGapVisibleProof: state.softGapVisibleProof,
      hardFailVisibleProof: state.hardFailVisibleProof,
      strictInspectReady: state.strictInspectReady,
      fallbackInspectReady: state.fallbackInspectReady,
      f21LatchMode: state.f21LatchMode,

      completionLatched: state.completionLatched,
      degradedCompletionLatched: state.degradedCompletionLatched,
      readyTextAllowed: state.readyTextAllowed,

      queuedEventsCount: state.queuedEvents.length,
      archivedEventsCount: state.archivedEvents.length,
      compactArchiveCount: state.compactArchiveCount,
      duplicateCompletedEventCount: state.duplicateCompletedEventCount,
      duplicatePostgameEventCount: state.duplicatePostgameEventCount,
      progressOnlyEventCounts: clonePlain(state.progressOnlyEventCounts),
      blockedEventsCount: state.blockedEvents.length,
      admittedEventsCount: state.admittedEvents.length,

      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,

      ...extra
    };
  }

  function normalizeNorthResult(result, gear, source) {
    const packet = isObject(result) ? clonePlain(result) : {
      action: result ? "UNKNOWN_RESULT" : "NO_RESULT"
    };

    return {
      accepted: Boolean(
        packet.action === "ADMIT" ||
        packet.action === "DEGRADED_FORWARD" ||
        packet.completionLatched === true ||
        packet.activeCheckpoint === null ||
        packet.accepted === true
      ),
      archived: packet.action === "ARCHIVE",
      queued: packet.action === "QUEUE",
      blocked: packet.action === "BLOCK" || packet.hardBlock === true,
      action: packet.action || "",
      reason: packet.reason || "",
      source,
      checkpointId: gear ? gear.id : "",
      checkpointEvent: gear ? gear.event : "",
      raw: packet
    };
  }

  function getNorthActiveId(session) {
    if (!session || !isFunction(session.getActiveCheckpoint)) return "";

    try {
      const active = session.getActiveCheckpoint();
      return active && active.id ? active.id : "";
    } catch (_error) {
      return "";
    }
  }

  function submitToNorth(gear, detail = {}) {
    const session = ensureNorthSession();

    if (!session || !gear) {
      return normalizeNorthResult(null, gear, "north-session-missing");
    }

    const payload = {
      id: gear.event,
      event: gear.event,
      phase: gear.event,
      checkpointId: gear.id,
      source: "hearth.south.canvasNestedReceiptBridge",
      contract: CONTRACT,
      receipt: RECEIPT,
      detail: {
        ...clonePlain(detail),
        translatedBySouth: true,
        targetCheckpointId: gear.id,
        targetCheckpointEvent: gear.event,
        fibonacci: gear.fibonacci,
        legacyArchiveForbiddenForActiveGear: true,
        postgameDedupActive: true,
        strictProofDegradeReconciliationActive: true,
        canvasNestedReceiptBridgeActive: true
      },
      snapshot: buildSnapshot(detail)
    };

    let result = null;
    let normalized = null;

    try {
      if (isFunction(session.submitEvent)) {
        result = session.submitEvent(payload);
        normalized = normalizeNorthResult(result, gear, "submitEvent");
      }
    } catch (error) {
      recordError("NORTH_SUBMIT_EVENT_FAILED", error && error.message ? error.message : String(error), {
        checkpointId: gear.id,
        event: gear.event
      });
    }

    const activeId = getNorthActiveId(session);

    if (
      (
        !normalized ||
        normalized.archived ||
        normalized.action === "UNKNOWN_RESULT" ||
        normalized.reason === "legacy-fibonacci-checkpoint-preserved-for-compatibility" ||
        normalized.reason === "unknown-event"
      ) &&
      activeId === gear.id &&
      isFunction(session.completeActive)
    ) {
      try {
        result = session.completeActive(payload);
        normalized = normalizeNorthResult(result, gear, "completeActive-after-archive");
      } catch (error) {
        recordError("NORTH_COMPLETE_ACTIVE_FAILED", error && error.message ? error.message : String(error), {
          checkpointId: gear.id,
          event: gear.event
        });
      }
    }

    if (!normalized) {
      normalized = normalizeNorthResult(result, gear, "north-result-normalized-fallback");
    }

    state.latestNorthResult = normalized;
    return normalized;
  }

  function markGearComplete(gear, detail = {}, degraded = false, northResult = null) {
    if (!gear) return false;

    arrayPushUnique(state.completedCheckpoints, gear.id);

    if (degraded) {
      arrayPushUnique(state.degradedCheckpoints, gear.id);
    }

    const current = activeCheckpoint();

    if (current && current.id === gear.id) {
      state.activeIndex = Math.min(CHECKPOINTS.length - 1, state.activeIndex + 1);
    } else if (gear.rank >= activeCheckpoint().rank) {
      const nextIndex = CHECKPOINTS.findIndex((item) => item.rank === gear.rank + 1);
      if (nextIndex >= 0) state.activeIndex = nextIndex;
    }

    if (gear.id === "F21_COMPLETION_LATCHED") {
      state.completionLatched = true;
      state.degradedCompletionLatched = degraded === true;
      state.readyTextAllowed = true;
      state.completionClosed = true;
      state.f21LatchMode = degraded ? "DEGRADED" : "FULL";
      state.postgameStatus = degraded
        ? "READY_DEGRADED_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE"
        : "READY_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE";
      state.firstFailedCoordinate = degraded
        ? "DEGRADED_F21_LATCHED_WITH_GAP_RECEIPT"
        : "NONE_F21_FULL_LATCHED";
      state.recommendedNextRenewalTarget = "read-postgame-canvas-or-triple-g-receipt";
    } else {
      const next = activeCheckpoint();
      state.postgameStatus = degraded
        ? "GEAR_DEGRADED_COMPLETE_WAITING_NORTH_SHIFT"
        : "GEAR_COMPLETE_WAITING_NORTH_SHIFT";
      state.firstFailedCoordinate = next ? `WAITING_${next.id}` : "WAITING_NEXT_GEAR";
      state.recommendedNextRenewalTarget = FILE;
    }

    const admitted = {
      at: nowIso(),
      event: gear.event,
      checkpointId: gear.id,
      fibonacci: gear.fibonacci,
      degraded: degraded === true,
      detail: clonePlain(detail),
      northResult: clonePlain(northResult)
    };

    state.admittedEvents.push(admitted);
    trimArray(state.admittedEvents, MAX_ADMITTED_EVENTS);

    recordLocal("SOUTH_ADMITTED_ACTIVE_GEAR", {
      checkpointId: gear.id,
      event: gear.event,
      fibonacci: gear.fibonacci,
      degraded
    });

    flushQueue();
    scheduleRender();
    return true;
  }

  function archiveEvent(eventName, gear, reason, detail = {}) {
    return compactArchive(reason, eventName, gear, detail);
  }

  function queueEvent(eventName, gear, reason, detail = {}) {
    if (!gear) return archiveEvent(eventName, gear, "unknown-future-event", detail);

    const existing = state.queuedEvents.some((item) => item.checkpointId === gear.id && item.event === gear.event);
    if (existing) return null;

    const item = {
      at: nowIso(),
      event: gear.event,
      originalEvent: safeString(eventName),
      checkpointId: gear.id,
      rank: gear.rank,
      action: "QUEUE",
      reason,
      detail: clonePlain(detail)
    };

    state.queuedEvents.push(item);
    trimArray(state.queuedEvents, MAX_QUEUED_EVENTS);

    return item;
  }

  function blockEvent(eventName, gear, reason, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(eventName),
      checkpointId: gear ? gear.id : "",
      action: "BLOCK",
      reason,
      detail: clonePlain(detail)
    };

    state.blockedEvents.push(item);
    trimArray(state.blockedEvents, MAX_BLOCKED_EVENTS);

    state.postgameStatus = "BLOCKED_BY_TRANSMISSION_CHECKPOINT";
    state.firstFailedCoordinate = reason || "BLOCKED";
    state.recommendedNextRenewalTarget = FILE;
    state.f21LatchMode = gear && gear.id === "F21_COMPLETION_LATCHED" ? "BLOCKED" : state.f21LatchMode;
    scheduleRender();
    return item;
  }

  function submitEventRecord(eventName, gear, detail = {}) {
    if (PROGRESS_ONLY_EVENTS.has(eventName)) return;

    state.submittedEvents.push({
      at: nowIso(),
      event: safeString(eventName),
      checkpointId: gear ? gear.id : "",
      detail: clonePlain(detail)
    });
    trimArray(state.submittedEvents, MAX_SUBMITTED_EVENTS);
  }

  function degradedForGearEvent(eventKey, gear, detail = {}) {
    if (!gear) return false;

    if (gear.id === "F13M_VISIBLE_CONTENT_PROOF_PASSED") {
      const proof = classifyVisibleProof(eventKey, detail);
      return proof.soft === true;
    }

    if (gear.id === "F13N_INSPECT_MODE_READY") {
      if (eventKey === "INSPECT_MODE_READY") return false;
      if (
        eventKey === "INSPECT_FALLBACK_READY" ||
        eventKey === "DEGRADED_INSPECT_MODE_ACCEPTED" ||
        eventKey === "RECEIPT_FALLBACK_READY"
      ) {
        return true;
      }
      return safeBool(detail.degraded, false);
    }

    if (gear.id === "F21_COMPLETION_LATCHED") {
      return (
        eventKey === "F21_DEGRADED_COMPLETION_LATCHED" ||
        safeBool(detail.degraded, false)
      );
    }

    return safeBool(detail.degraded, false);
  }

  function admitGearEvent(eventName, detail = {}) {
    refreshAuthorityPresence();

    const eventKey = safeString(eventName);

    if (PROGRESS_ONLY_EVENTS.has(eventKey)) {
      return countProgressOnlyEvent(eventKey, detail);
    }

    const gear = checkpointFrom(eventKey) || checkpointFrom(detail.checkpointId) || checkpointFrom(detail.event);
    const active = activeCheckpoint();

    submitEventRecord(eventKey, gear, detail);

    if (!gear) {
      state.unknownEventCount += 1;
      archiveEvent(eventKey, null, "unknown-event", detail);
      return {
        accepted: false,
        action: "ARCHIVE",
        reason: "unknown-event",
        event: eventKey
      };
    }

    if (state.completionClosed && isCompleted(gear.id)) {
      compactArchive("postgame-closed-duplicate-suppressed", eventKey, gear, {
        checkpointId: gear.id,
        compact: true
      });
      return {
        accepted: true,
        action: "SUPPRESS",
        reason: "postgame-closed-duplicate-suppressed",
        checkpointId: gear.id
      };
    }

    if (isCompleted(gear.id)) {
      archiveEvent(eventKey, gear, "duplicate-completed-gear-archived", detail);
      return {
        accepted: true,
        action: "ARCHIVE",
        reason: "duplicate-completed-gear-archived",
        checkpointId: gear.id
      };
    }

    if (gear.rank < active.rank) {
      archiveEvent(eventKey, gear, "late-prior-gear-archived", detail);
      return {
        accepted: true,
        action: "ARCHIVE",
        reason: "late-prior-gear-archived",
        checkpointId: gear.id
      };
    }

    if (gear.rank > active.rank) {
      queueEvent(eventKey, gear, `future-event-queued-until-${active.id}`, detail);
      return {
        accepted: false,
        action: "QUEUE",
        reason: `future-event-queued-until-${active.id}`,
        checkpointId: gear.id
      };
    }

    if (gear.id === "F13M_VISIBLE_CONTENT_PROOF_PASSED") {
      const proof = classifyVisibleProof(eventKey, detail);

      if (proof.hard) {
        blockEvent(eventKey, gear, "VISIBLE_CONTENT_HARD_FAIL", detail);
        return {
          accepted: false,
          action: "BLOCK",
          reason: "VISIBLE_CONTENT_HARD_FAIL",
          checkpointId: gear.id
        };
      }

      if (!proof.strict && !proof.soft && !hasVisibleSurfaceSignal(buildSnapshot(detail))) {
        blockEvent(eventKey, gear, "VISIBLE_CONTENT_PROOF_UNCLASSIFIED", detail);
        return {
          accepted: false,
          action: "BLOCK",
          reason: "VISIBLE_CONTENT_PROOF_UNCLASSIFIED",
          checkpointId: gear.id
        };
      }
    }

    if (gear.id === "F21_COMPLETION_LATCHED") {
      const latch = canLatchF21();

      if (!latch.allowed) {
        blockEvent(eventKey, gear, latch.reason, detail);
        return {
          accepted: false,
          action: "BLOCK",
          reason: latch.reason,
          checkpointId: gear.id
        };
      }

      detail = {
        ...detail,
        degraded: latch.degraded,
        f21LatchMode: latch.degraded ? "DEGRADED" : "FULL",
        f21LatchReason: latch.reason
      };
    }

    const degraded = degradedForGearEvent(eventKey, gear, detail);
    const northResult = submitToNorth(gear, detail);

    if (northResult.blocked) {
      blockEvent(eventKey, gear, northResult.reason || "north-blocked-active-gear", {
        ...detail,
        northResult
      });
      return {
        accepted: false,
        action: "BLOCK",
        reason: northResult.reason || "north-blocked-active-gear",
        checkpointId: gear.id,
        northResult
      };
    }

    markGearComplete(gear, detail, degraded, northResult);

    return {
      accepted: true,
      action: degraded ? "DEGRADED_FORWARD" : "ADMIT",
      reason: degraded ? "active-gear-admitted-with-explicit-degrade" : "strict-active-gear-admitted",
      checkpointId: gear.id,
      checkpointEvent: gear.event,
      fibonacci: gear.fibonacci,
      northResult
    };
  }

  function flushQueue() {
    let guard = 0;
    let advanced = true;

    while (advanced && guard < 80) {
      guard += 1;
      advanced = false;

      const active = activeCheckpoint();
      const index = state.queuedEvents.findIndex((item) => item.checkpointId === active.id);

      if (index < 0) break;

      const [item] = state.queuedEvents.splice(index, 1);
      const result = admitGearEvent(item.event, {
        ...clonePlain(item.detail || {}),
        replayedFromQueue: true
      });

      if (result && (result.action === "ADMIT" || result.action === "DEGRADED_FORWARD")) {
        advanced = true;
      }
    }
  }

  function evaluateNewsGates(snapshot = buildSnapshot()) {
    const northGateReady = Boolean(
      safeBool(snapshot.canvasReady, false) &&
      safeBool(snapshot.atlasBuildComplete, false) &&
      safeBool(snapshot.textureComposeComplete, false) &&
      safeBool(snapshot.visibleContentProof, false) &&
      !safeBool(snapshot.visibleContentSoftGap, false) &&
      !safeBool(snapshot.visibleContentHardFail, false) &&
      safeBool(snapshot.visiblePlanetAvailable, false)
    );

    const northGateDegradedReady = Boolean(
      northGateReady ||
      (
        safeBool(snapshot.canvasReady, false) &&
        safeBool(snapshot.atlasBuildComplete, false) &&
        safeBool(snapshot.textureComposeComplete, false) &&
        hasVisibleSurfaceSignal(snapshot)
      )
    );

    const eastGateReady = Boolean(
      safeBool(snapshot.cooperativeBootUsed, false) &&
      !safeBool(snapshot.syncBootFallbackUsed, false) &&
      safeBool(snapshot.canvasCarrierRequested, false) &&
      safeBool(snapshot.canvasCarrierHandoffOk, false)
    );

    const westGateReady = Boolean(
      safeBool(snapshot.copyDiagnosticPreserved, true) &&
      safeBool(snapshot.receiptToggleReady, true) &&
      safeBool(snapshot.inspectPlanetControlAvailable, false) &&
      safeBool(snapshot.diagnosticDockRestorable, true) &&
      safeBool(snapshot.buttonsReachable, true) &&
      safeBool(snapshot.receiptOverlayIndependent, true)
    );

    const westGateDegradedReady = Boolean(westGateReady || hasFallbackInspectSignal(snapshot));

    const southGateReady = Boolean(
      safeBool(snapshot.imageRendered, false) &&
      safeBool(snapshot.firstFrameDetected, false) &&
      safeBool(snapshot.dragInspectionBound, false) &&
      safeBool(snapshot.visiblePlanetAvailable, false) &&
      safeBool(snapshot.diagnosticCanLeavePlanetFrame, false)
    );

    const southGateDegradedReady = Boolean(
      southGateReady ||
      (
        safeBool(snapshot.imageRendered, false) &&
        safeBool(snapshot.firstFrameDetected, false) &&
        safeBool(snapshot.dragInspectionBound, false) &&
        safeBool(snapshot.nonblankPlanetVisible, false)
      )
    );

    return {
      northGateReady,
      eastGateReady,
      westGateReady,
      southGateReady,
      newsGatePassedBeforeF21: northGateReady && eastGateReady && westGateReady && southGateReady,
      northGateDegradedReady,
      westGateDegradedReady,
      southGateDegradedReady,
      newsGateDegradedBeforeF21: northGateDegradedReady && eastGateReady && westGateDegradedReady && southGateDegradedReady
    };
  }

  function canLatchF21() {
    const snapshot = buildSnapshot();
    const gates = evaluateNewsGates(snapshot);
    const f13nComplete = isCompleted("F13N_INSPECT_MODE_READY");

    if (f13nComplete && gates.newsGatePassedBeforeF21) {
      state.f21LatchMode = "FULL";
      return {
        allowed: true,
        degraded: false,
        reason: "F21_FULL_ALLOWED"
      };
    }

    if (f13nComplete && gates.newsGateDegradedBeforeF21) {
      state.f21LatchMode = "DEGRADED";
      return {
        allowed: true,
        degraded: true,
        reason: "F21_DEGRADED_ALLOWED"
      };
    }

    state.f21LatchMode = "BLOCKED";
    return {
      allowed: false,
      degraded: false,
      reason: !f13nComplete ? "F21_BLOCKED_F13N_INCOMPLETE" : "F21_BLOCKED_NEWS_GATE_INCOMPLETE"
    };
  }

  function maybeCompleteInspectAndF21() {
    if (state.completionClosed) return;

    const active = activeCheckpoint();
    const snapshot = buildSnapshot();

    if (active && active.id === "F13N_INSPECT_MODE_READY") {
      if (hasStrictInspectSignal(snapshot)) {
        admitGearEvent("INSPECT_MODE_READY", {
          degraded: false,
          inspectModeAvailable: true,
          inspectPlanetControlAvailable: true,
          diagnosticCanLeavePlanetFrame: true,
          copyDiagnosticPreserved: true,
          receiptToggleReady: true,
          diagnosticDockRestorable: true,
          buttonsReachable: true,
          strictInspectReady: true,
          fallbackInspectReady: false
        });
      } else if (hasFallbackInspectSignal(snapshot)) {
        admitGearEvent("INSPECT_FALLBACK_READY", {
          degraded: true,
          inspectModeAvailable: safeBool(snapshot.inspectModeAvailable, false),
          inspectPlanetControlAvailable: safeBool(snapshot.inspectPlanetControlAvailable, false),
          diagnosticCanLeavePlanetFrame: safeBool(snapshot.diagnosticCanLeavePlanetFrame, false),
          copyDiagnosticPreserved: true,
          receiptToggleReady: true,
          diagnosticDockRestorable: true,
          buttonsReachable: true,
          strictInspectReady: false,
          fallbackInspectReady: true
        });
      }
    }

    const f21 = canLatchF21();
    const next = activeCheckpoint();

    if (next && next.id === "F21_COMPLETION_LATCHED" && f21.allowed) {
      admitGearEvent(f21.degraded ? "F21_DEGRADED_COMPLETION_LATCHED" : "COMPLETION_LATCHED", {
        degraded: f21.degraded,
        f21LatchMode: f21.degraded ? "DEGRADED" : "FULL",
        ...evaluateNewsGates(buildSnapshot())
      });
    }
  }

  function canvasReceiptSignature(receipt) {
    if (!isObject(receipt)) return "";

    const keys = [
      "contract",
      "receipt",
      "version",
      "canvasCarrierRequested",
      "canvasCarrierMounted",
      "canvasContextReady",
      "dragInspectionBound",
      "atlasBuildStarted",
      "atlasBuildComplete",
      "textureComposeStarted",
      "textureComposeComplete",
      "firstFrameRequested",
      "firstFrameDetected",
      "canvasReady",
      "visibleContentProofStarted",
      "visibleContentProof",
      "visibleContentStrictProof",
      "visibleContentSoftGap",
      "visibleForwardProgress",
      "visibleContentAdmissible",
      "visibleContentHardFail",
      "visiblePlanetAvailable",
      "canvasCarrierHandoffOk",
      "imageRendered",
      "sevenContinentVisualFallbackActive",
      "textureInvalidationCount"
    ];

    return keys.map((key) => `${key}:${safeString(receipt[key], "")}`).join("|");
  }

  function reconcileOneCanvasCheckpoint(receipt, key, event, detail = {}) {
    if (!safeBool(receipt[key], false)) return;

    const gear = checkpointFrom(event);
    if (!gear) return;

    const reconcileKey = `${gear.id}:${key}`;
    if (state.reconciledCanvasKeys.includes(reconcileKey) || isCompleted(gear.id)) {
      return;
    }

    arrayPushUnique(state.reconciledCanvasKeys, reconcileKey);
    arrayPushUnique(state.reconciledCheckpointIds, gear.id);

    admitGearEvent(event, {
      source: "canvasReceiptReconcile",
      canvasReceipt: true,
      [key]: true,
      ...buildCanvasReceiptBridge(receipt),
      ...detail
    });
  }

  function reconcileCanvasReceipt(options = {}) {
    if (state.completionClosed && !options.force) return;

    const receipt = readCanvasReceipt();

    if (!isObject(receipt)) return;

    const signature = canvasReceiptSignature(receipt);
    if (signature && signature === state.lastCanvasReceiptSignature && !options.force) {
      return;
    }

    state.lastCanvasReceiptSignature = signature;

    reconcileOneCanvasCheckpoint(receipt, "canvasCarrierRequested", "CANVAS_COOPERATIVE_BOOT_STARTED");
    reconcileOneCanvasCheckpoint(receipt, "canvasCarrierMounted", "CANVAS_MOUNT_CREATED");
    reconcileOneCanvasCheckpoint(receipt, "canvasContextReady", "CANVAS_CONTEXT_READY");
    reconcileOneCanvasCheckpoint(receipt, "dragInspectionBound", "DRAG_INSPECTION_BOUND");
    reconcileOneCanvasCheckpoint(receipt, "atlasBuildStarted", "ATLAS_BUILD_STARTED");
    reconcileOneCanvasCheckpoint(receipt, "atlasBuildComplete", "ATLAS_BUILD_COMPLETE");
    reconcileOneCanvasCheckpoint(receipt, "textureComposeStarted", "TEXTURE_COMPOSE_STARTED");
    reconcileOneCanvasCheckpoint(receipt, "textureComposeComplete", "TEXTURE_COMPOSE_COMPLETE");
    reconcileOneCanvasCheckpoint(receipt, "firstFrameRequested", "FIRST_FRAME_REQUESTED");
    reconcileOneCanvasCheckpoint(receipt, "firstFrameDetected", "FIRST_FRAME_DETECTED");
    reconcileOneCanvasCheckpoint(receipt, "canvasReady", "CANVAS_READY");
    reconcileOneCanvasCheckpoint(receipt, "visibleContentProofStarted", "VISIBLE_CONTENT_PROOF_STARTED");

    if (safeBool(receipt.visibleContentProof, false) && !safeBool(receipt.visibleContentHardFail, false)) {
      reconcileOneCanvasCheckpoint(receipt, "visibleContentProof", "VISIBLE_CONTENT_PROOF_PASSED", {
        visibleContentProof: true,
        visibleContentStrictProof: safeBool(receipt.visibleContentStrictProof, true),
        visibleContentSoftGap: false,
        visibleContentHardFail: false,
        visibleForwardProgress: safeBool(receipt.visibleForwardProgress, true),
        visibleContentAdmissible: safeBool(receipt.visibleContentAdmissible, true),
        visiblePlanetAvailable: safeBool(receipt.visiblePlanetAvailable, false)
      });
    } else if (
      safeBool(receipt.visibleContentSoftGap, false) ||
      (
        !safeBool(receipt.visibleContentProof, false) &&
        (
          safeBool(receipt.visibleForwardProgress, false) ||
          safeBool(receipt.visibleContentAdmissible, false) ||
          hasVisibleSurfaceSignal(buildSnapshot())
        )
      )
    ) {
      const gear = checkpointFrom("VISIBLE_CONTENT_SOFT_GAP");
      const reconcileKey = `${gear.id}:visibleContentSoftGap`;
      if (!state.reconciledCanvasKeys.includes(reconcileKey) && !isCompleted(gear.id)) {
        arrayPushUnique(state.reconciledCanvasKeys, reconcileKey);
        arrayPushUnique(state.reconciledCheckpointIds, gear.id);
        admitGearEvent("VISIBLE_CONTENT_SOFT_GAP", {
          source: "canvasReceiptReconcile",
          degraded: true,
          visibleContentProof: false,
          visibleContentStrictProof: false,
          visibleContentSoftGap: true,
          visibleForwardProgress: safeBool(receipt.visibleForwardProgress, true),
          visibleContentAdmissible: safeBool(receipt.visibleContentAdmissible, true),
          visiblePlanetAvailable: safeBool(receipt.visiblePlanetAvailable, true),
          ...buildCanvasReceiptBridge(receipt)
        });
      }
    } else if (safeBool(receipt.visibleContentHardFail, false)) {
      const gear = checkpointFrom("VISIBLE_CONTENT_HARD_FAIL");
      const reconcileKey = `${gear.id}:visibleContentHardFail`;
      if (!state.reconciledCanvasKeys.includes(reconcileKey) && !isCompleted(gear.id)) {
        arrayPushUnique(state.reconciledCanvasKeys, reconcileKey);
        admitGearEvent("VISIBLE_CONTENT_HARD_FAIL", {
          source: "canvasReceiptReconcile",
          visibleContentHardFail: true,
          ...buildCanvasReceiptBridge(receipt)
        });
      }
    }

    state.canvasBootComplete = safeBool(receipt.canvasReady, state.canvasBootComplete);
    state.canvasBootError = safeString(receipt.canvasCarrierHandoffError, state.canvasBootError);

    maybeCompleteInspectAndF21();
  }

  function onCanvasPhase(event) {
    const detail = event && event.detail ? event.detail : {};
    const phaseEvent = detail.event || {};
    const phase = phaseEvent.event || phaseEvent.phase || phaseEvent.id || "";
    const snapshot = phaseEvent.snapshot || {};

    if (PROGRESS_ONLY_EVENTS.has(phase)) {
      countProgressOnlyEvent(phase, {
        source: "hearth:canvas-phase",
        ...clonePlain(snapshot),
        ...clonePlain(phaseEvent.detail || {})
      });
      scheduleRender();
      return;
    }

    if (state.completionClosed) {
      const gear = checkpointFrom(phase);
      if (gear && isCompleted(gear.id)) {
        compactArchive("postgame-closed-duplicate-suppressed", phase, gear, {
          source: "hearth:canvas-phase",
          compact: true
        });
        return;
      }
    }

    admitGearEvent(phase, {
      source: "hearth:canvas-phase",
      ...clonePlain(snapshot),
      ...clonePlain(phaseEvent.detail || {}),
      ...buildCanvasReceiptBridge()
    });

    reconcileCanvasReceipt();
  }

  function bindControls() {
    if (refs.copyButton && !refs.copyButton.dataset.hearthSouthTranslatorBound) {
      refs.copyButton.dataset.hearthSouthTranslatorBound = "true";
      refs.copyButton.addEventListener("click", copyDiagnostic);
    }

    if (refs.toggleButton && refs.receiptBox && !refs.toggleButton.dataset.hearthSouthTranslatorBound) {
      refs.toggleButton.dataset.hearthSouthTranslatorBound = "true";
      refs.toggleButton.addEventListener("click", () => {
        const visible = refs.receiptBox.dataset.visible !== "true";
        refs.receiptBox.dataset.visible = String(visible);
        refs.toggleButton.textContent = visible ? "Hide receipt" : "Show receipt";
        if (refs.receiptText) refs.receiptText.textContent = visible ? getReceiptText() : "";
      });
    }

    if (refs.inspectButton && !refs.inspectButton.dataset.hearthSouthTranslatorBound) {
      refs.inspectButton.dataset.hearthSouthTranslatorBound = "true";
      refs.inspectButton.addEventListener("click", () => {
        const currentlyInspecting = Boolean(doc && doc.documentElement && doc.documentElement.dataset.hearthSouthPlanetInspect === "true");
        setInspectMode(!currentlyInspecting);
      });
    }

    if (refs.showTab && !refs.showTab.dataset.hearthSouthTranslatorBound) {
      refs.showTab.dataset.hearthSouthTranslatorBound = "true";
      refs.showTab.addEventListener("click", () => {
        setInspectMode(false);
      });
    }

    if (refs.collapseButton && refs.cockpit && !refs.collapseButton.dataset.hearthSouthTranslatorBound) {
      refs.collapseButton.dataset.hearthSouthTranslatorBound = "true";
      refs.collapseButton.addEventListener("click", () => {
        const expanded = refs.cockpit.dataset.cockpitMode !== "expanded-cockpit";
        refs.cockpit.dataset.cockpitMode = expanded ? "expanded-cockpit" : "loading-cockpit";
        refs.collapseButton.textContent = expanded ? "Collapse cockpit" : "Expand cockpit";
        scheduleRender();
      });
    }
  }

  function setInspectMode(active) {
    ensureRefs();

    if (doc && doc.documentElement) {
      doc.documentElement.dataset.hearthSouthPlanetInspect = String(active);
      doc.documentElement.dataset.hearthEastInspectReservedActive = String(active);
    }

    if (refs.cockpit) {
      refs.cockpit.dataset.cockpitMode = active ? "planet-inspect" : "diagnostic-dock";
    }

    if (refs.showTab) {
      refs.showTab.hidden = !active;
      refs.showTab.dataset.visible = String(active);
    }

    if (refs.inspectButton) {
      refs.inspectButton.textContent = active ? "Show diagnostic" : "Inspect planet";
    }

    state.inspectModeAvailable = Boolean(refs.inspectButton && refs.cockpit);
    state.inspectPlanetControlAvailable = Boolean(refs.inspectButton);
    state.diagnosticCanLeavePlanetFrame = Boolean(refs.inspectButton && refs.cockpit && refs.showTab);
    state.diagnosticDockHiddenForInspection = Boolean(active);
    state.showDiagnosticTabVisible = Boolean(active);
    state.diagnosticDockRestorable = Boolean(refs.cockpit);
    state.strictInspectReady = hasStrictInspectSignal(buildSnapshot({
      inspectModeAvailable: state.inspectModeAvailable,
      inspectPlanetControlAvailable: state.inspectPlanetControlAvailable,
      diagnosticCanLeavePlanetFrame: state.diagnosticCanLeavePlanetFrame
    }));

    recordLocal(active ? "SOUTH_INSPECT_MODE_REQUESTED" : "SOUTH_DIAGNOSTIC_DOCK_RESTORED", {
      diagnosticDockRestorable: true,
      diagnosticCanLeavePlanetFrame: state.diagnosticCanLeavePlanetFrame
    });

    scheduleRender();
  }

  async function copyDiagnostic() {
    const text = getReceiptText();
    let ok = false;

    try {
      if (root.navigator && root.navigator.clipboard && isFunction(root.navigator.clipboard.writeText)) {
        await root.navigator.clipboard.writeText(text);
        ok = true;
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
        ok = true;
      }
    } catch (error) {
      recordError("COPY_DIAGNOSTIC_FAILED", error && error.message ? error.message : String(error));
    }

    if (refs.copyButton) {
      const original = refs.copyButton.textContent || "Copy diagnostic";
      refs.copyButton.textContent = ok ? "Copied" : "Copy failed";
      root.setTimeout(() => {
        refs.copyButton.textContent = original;
      }, 1000);
    }

    return ok;
  }

  function localProgressForActive(snapshot = buildSnapshot()) {
    const active = activeCheckpoint();

    if (state.completionLatched) return 100;
    if (isCompleted(active.id)) return 100;

    switch (active.id) {
      case "F1A_HTML_SHELL_RENDERED":
        return 80;
      case "F1B_LOAD_LEDGER_INITIALIZED":
        return safeBool(snapshot.sharedLedgerPresent, false) ? 90 : 40;
      case "F2_FIRST_PAINT_COCKPIT_VISIBLE":
        return safeBool(snapshot.cockpitReady, false) ? 90 : 45;
      case "F3_SCRIPT_ORDER_COMPLETE":
        return safeBool(snapshot.scriptOrderComplete, false) ? 90 : 50;
      case "F5_AUTHORITY_AVAILABILITY_READY":
        return state.northPresent ? 90 : 45;
      case "F8_CONDUCTOR_HYDRATED":
        return 90;
      case "F13A_CANVAS_COOPERATIVE_BOOT_STARTED":
        return safeBool(snapshot.canvasCarrierRequested, false) ? 80 : 24;
      case "F13B_CANVAS_MOUNT_CREATED":
        return safeBool(snapshot.canvasCarrierMounted, false) ? 90 : 35;
      case "F13C_CANVAS_CONTEXT_READY":
        return safeBool(snapshot.canvasContextReady, false) ? 90 : 35;
      case "F13D_DRAG_INSPECTION_BOUND":
        return safeBool(snapshot.dragInspectionBound, false) ? 90 : 35;
      case "F13E_ATLAS_BUILD_STARTED":
        return safeBool(snapshot.atlasBuildStarted, false) ? 90 : 30;
      case "F13F_ATLAS_BUILD_COMPLETE":
        return clamp(snapshot.atlasBuildProgress, 0, 99);
      case "F13G_TEXTURE_COMPOSE_STARTED":
        return safeBool(snapshot.textureComposeStarted, false) ? 90 : 30;
      case "F13H_TEXTURE_COMPOSE_COMPLETE":
        return clamp(snapshot.textureComposeProgress, 0, 99);
      case "F13I_FIRST_FRAME_REQUESTED":
        return safeBool(snapshot.firstFrameRequested, false) ? 90 : 40;
      case "F13J_FIRST_FRAME_DETECTED":
        return safeBool(snapshot.firstFrameDetected, false) ? 90 : 40;
      case "F13K_CANVAS_READY":
        return safeBool(snapshot.canvasReady, false) ? 90 : 50;
      case "F13L_VISIBLE_CONTENT_PROOF_STARTED":
        return safeBool(snapshot.visibleContentProofStarted, false) ? 90 : 40;
      case "F13M_VISIBLE_CONTENT_PROOF_PASSED":
        if (
          safeBool(snapshot.visibleContentProof, false) &&
          !safeBool(snapshot.visibleContentSoftGap, false) &&
          !safeBool(snapshot.visibleContentHardFail, false)
        ) {
          return 90;
        }
        if (hasVisibleSurfaceSignal(snapshot)) return 78;
        return safeBool(snapshot.nonblankPlanetVisible, false) ? 58 : 28;
      case "F13N_INSPECT_MODE_READY":
        if (hasStrictInspectSignal(snapshot)) return 90;
        if (hasFallbackInspectSignal(snapshot)) return 72;
        return 42;
      case "F21_COMPLETION_LATCHED":
        return canLatchF21().allowed ? 92 : 55;
      default:
        return 20;
    }
  }

  function composeVisiblePacket() {
    const composer = readSouthComposer();
    const active = activeCheckpoint();
    const highest = highestCompletedCheckpoint();
    const snapshot = buildSnapshot();
    const gates = evaluateNewsGates(snapshot);

    const input = {
      ...snapshot,
      ...gates,
      activeGearId: active.id,
      activeGearRank: active.rank,
      activeFibonacciStage: active.fibonacci,
      activeCheckpointId: active.id,
      activeCheckpointRank: active.rank,
      activeCheckpointLabel: active.label,
      activeGearLocalProgress: localProgressForActive(snapshot),
      completedCheckpoints: state.completedCheckpoints.slice(),
      degradedCheckpoints: state.degradedCheckpoints.slice(),
      highestCompletedCheckpointId: highest ? highest.id : "",
      highestCompletedRank: highest ? highest.rank : 0,
      latestGap: state.latestGap || {},
      queuedEventsCount: state.queuedEvents.length,
      archivedEventsCount: state.archivedEvents.length,
      compactArchiveCount: state.compactArchiveCount,
      duplicateCompletedEventCount: state.duplicateCompletedEventCount,
      duplicatePostgameEventCount: state.duplicatePostgameEventCount,
      progressOnlyEventCounts: clonePlain(state.progressOnlyEventCounts),
      blockedEventsCount: state.blockedEvents.length,
      admittedEventsCount: state.admittedEvents.length,
      completionLatched: state.completionLatched,
      degradedCompletionLatched: state.degradedCompletionLatched,
      readyTextAllowed: state.readyTextAllowed,
      partialReceiptAvailable: true,
      finalReceiptAvailable: state.completionLatched,
      copyDiagnosticArmed: true,
      dockVisible: true,
      buttonsReachable: true
    };

    const signature = [
      active.id,
      state.completedCheckpoints.join(","),
      state.degradedCheckpoints.join(","),
      state.completionLatched,
      state.degradedCompletionLatched,
      snapshot.visiblePlanetAvailable,
      snapshot.visibleContentProof,
      snapshot.visibleContentSoftGap,
      snapshot.inspectModeAvailable,
      snapshot.inspectPlanetControlAvailable,
      snapshot.diagnosticCanLeavePlanetFrame,
      snapshot.canvasContract,
      snapshot.canvasReceipt,
      snapshot.canvasTextureInvalidationCount,
      localProgressForActive(snapshot)
    ].join("|");

    if (state.latestComposerPacket && state.lastPacketSignature === signature) {
      return state.latestComposerPacket;
    }

    state.lastPacketSignature = signature;

    if (composer && isFunction(composer.composeVisibleState)) {
      try {
        const packet = composer.composeVisibleState(input);
        if (isObject(packet)) {
          state.latestComposerPacket = packet;
          return packet;
        }
      } catch (error) {
        recordError("SOUTH_COMPOSER_FAILED", error && error.message ? error.message : String(error));
      }
    }

    const packet = {
      contract: CONTRACT,
      receipt: RECEIPT,
      activeGearId: active.id,
      activeGearRank: active.rank,
      activeGearFibonacci: active.fibonacci,
      activeGearEvent: active.event,
      activeGearLabel: active.label,
      activeGearLocalProgress: localProgressForActive(snapshot),
      activeGearProgressCap: 100,
      activeGearComplete: isCompleted(active.id),
      activeCheckpointId: active.id,
      activeCheckpointRank: active.rank,
      activeFibonacciStage: active.fibonacci,
      highestCompletedCheckpointId: highest ? highest.id : "",
      highestCompletedRank: highest ? highest.rank : 0,
      completionLatched: state.completionLatched,
      degradedCompletionLatched: state.degradedCompletionLatched,
      readyTextAllowed: state.readyTextAllowed,
      visibleStatusText: state.completionLatched ? "Ready" : `Loading ${active.label}`,
      postgameStatus: state.postgameStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      mainDisplayProgress: localProgressForActive(snapshot),
      mainProgressCap: 100,
      visibleProgress: localProgressForActive(snapshot),
      progressCap: 100,
      cockpitMode: state.completionLatched || snapshot.visiblePlanetAvailable ? "diagnostic-dock" : "loading-cockpit",
      latestVisibleEvent: state.latestEvent,
      partialReceiptAvailable: true,
      finalReceiptAvailable: state.completionLatched,
      receiptToggleReady: true,
      copyDiagnosticArmed: true,
      buttonsReachable: true,
      ...snapshot,
      ...gates,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };

    state.latestComposerPacket = packet;
    return packet;
  }

  function laneSignature(packet) {
    const active = activeCheckpoint();
    return [
      active.id,
      state.completedCheckpoints.join(","),
      state.degradedCheckpoints.join(","),
      state.queuedEvents.map((item) => item.checkpointId).join(","),
      state.completionLatched,
      state.degradedCompletionLatched,
      packet.activeGearLocalProgress || packet.mainDisplayProgress || 0
    ].join("|");
  }

  function renderLanes(packet) {
    const active = activeCheckpoint();

    return CHECKPOINTS.map((gear) => {
      const complete = state.completedCheckpoints.includes(gear.id);
      const degraded = state.degradedCheckpoints.includes(gear.id);
      const isActive = gear.id === active.id && !state.completionLatched;
      const queued = state.queuedEvents.some((item) => item.checkpointId === gear.id);
      const progress = complete ? 100 : isActive ? clamp(packet.activeGearLocalProgress || packet.mainDisplayProgress || 0, 0, 100) : 0;
      const status =
        complete && degraded ? "DEGRADED" :
          complete ? "COMPLETE" :
            isActive ? "ACTIVE" :
              queued ? "QUEUED" :
                "PENDING";

      return [
        `<section class="hearth-ledger-lane" data-lane="${gear.id}" data-status="${status}">`,
        `<div class="hearth-ledger-lane-top">`,
        `<span class="hearth-ledger-lane-title">`,
        `<strong>${gear.fibonacci} · ${gear.label}</strong>`,
        `<span>${gear.event}</span>`,
        `</span>`,
        `<span class="hearth-ledger-lane-status">${status}</span>`,
        `</div>`,
        `<div class="hearth-ledger-lane-track">`,
        `<span class="hearth-ledger-lane-fill" style="width:${progress}%"></span>`,
        `</div>`,
        `</section>`
      ].join("");
    }).join("");
  }

  function scheduleRender() {
    if (renderTimer) return;

    renderTimer = root.setTimeout(() => {
      renderTimer = 0;
      render();
    }, state.completionClosed ? 180 : 80);
  }

  function getStatusText() {
    const light = getReceiptLight();

    return [
      "HEARTH_SOUTH_ROUTE_CONDUCTOR_STATUS",
      `contract=${light.contract}`,
      `receipt=${light.receipt}`,
      `activeCheckpointId=${light.activeCheckpointId}`,
      `activeFibonacciStage=${light.activeFibonacciStage}`,
      `activeGearProgress=${light.activeGearProgress}`,
      `highestCompletedCheckpointId=${light.highestCompletedCheckpointId}`,
      `completionLatched=${light.completionLatched}`,
      `degradedCompletionLatched=${light.degradedCompletionLatched}`,
      `strictVisibleProof=${light.strictVisibleProof}`,
      `softGapVisibleProof=${light.softGapVisibleProof}`,
      `strictInspectReady=${light.strictInspectReady}`,
      `fallbackInspectReady=${light.fallbackInspectReady}`,
      `f21LatchMode=${light.f21LatchMode}`,
      `visiblePlanetAvailable=${light.visiblePlanetAvailable}`,
      `visibleContentProof=${light.visibleContentProof}`,
      `inspectModeAvailable=${light.inspectModeAvailable}`,
      `diagnosticCanLeavePlanetFrame=${light.diagnosticCanLeavePlanetFrame}`,
      `canvasReceiptBridgeActive=${light.canvasReceiptBridgeActive}`,
      `canvasContract=${light.canvasContract}`,
      `canvasContractMatchesExpected=${light.canvasContractMatchesExpected}`,
      `canvasReceiptMatchesExpected=${light.canvasReceiptMatchesExpected}`,
      `canvasSevenContinentVisualFallbackActive=${light.canvasSevenContinentVisualFallbackActive}`,
      `archivedEventsCount=${light.archivedEventsCount}`,
      `compactArchiveCount=${light.compactArchiveCount}`,
      `duplicatePostgameEventCount=${light.duplicatePostgameEventCount}`,
      `progressOnlyEventCounts=${JSON.stringify(light.progressOnlyEventCounts)}`,
      `latestEvent=${light.latestEvent}`,
      `postgameStatus=${light.postgameStatus}`,
      `firstFailedCoordinate=${light.firstFailedCoordinate}`,
      `updatedAt=${light.updatedAt}`
    ].join("\n");
  }

  function render() {
    ensureRefs();

    const packet = composeVisiblePacket();
    const progress = clamp(packet.mainDisplayProgress ?? packet.activeGearLocalProgress ?? 0, 0, 100);
    const stage = packet.activeGearFibonacci || packet.activeFibonacciStage || activeCheckpoint().fibonacci;
    const label = packet.activeGearLabel || packet.activeCheckpointLabel || activeCheckpoint().label;
    const statusText = packet.visibleStatusText || packet.postgameStatus || state.postgameStatus;

    state.renderCount += 1;

    if (refs.stage) refs.stage.textContent = `${stage} · ${label}`;
    if (refs.heartbeat) refs.heartbeat.textContent = statusText;
    if (refs.latest) refs.latest.textContent = `latest=${state.latestEvent}`;
    if (refs.fill) refs.fill.style.width = `${progress}%`;
    if (refs.percent) refs.percent.textContent = `${Math.round(progress)}%`;

    if (refs.lanes) {
      const sig = laneSignature(packet);
      if (sig !== state.lastLaneSignature) {
        refs.lanes.innerHTML = renderLanes(packet);
        state.lastLaneSignature = sig;
      }
    }

    if (refs.receiptText && refs.receiptBox && refs.receiptBox.dataset.visible === "true") {
      refs.receiptText.textContent = getReceiptText();
    }

    if (refs.cockpit && refs.cockpit.dataset.cockpitMode !== "planet-inspect") {
      refs.cockpit.dataset.cockpitMode = packet.cockpitMode || (packet.visiblePlanetAvailable ? "diagnostic-dock" : "loading-cockpit");
    }

    if (refs.status) {
      refs.status.textContent = getStatusText();
    }

    publishDataset();
    publishGlobals();
  }

  function publishDataset() {
    if (!doc || !doc.documentElement) return;

    const active = activeCheckpoint();
    const highest = highestCompletedCheckpoint();
    const dataset = doc.documentElement.dataset;
    const canvasBridge = buildCanvasReceiptBridge();

    dataset.hearthSouthRouteConductorLoaded = "true";
    dataset.hearthSouthRouteConductorContract = CONTRACT;
    dataset.hearthSouthRouteConductorReceipt = RECEIPT;
    dataset.hearthSouthCanvasNestedReceiptBridge = "true";

    dataset.hearthTransmissionMode = "true";
    dataset.oneActiveGearAtATime = "true";
    dataset.activeGearProgressResets = "true";
    dataset.visibleProgressRepresentsCurrentGearOnly = "true";

    dataset.hearthActiveCheckpointId = active.id;
    dataset.hearthActiveCheckpointRank = String(active.rank);
    dataset.hearthActiveFibonacciStage = active.fibonacci;
    dataset.hearthHighestCompletedCheckpointId = highest ? highest.id : "";
    dataset.hearthCompletedCheckpoints = state.completedCheckpoints.join(",");
    dataset.hearthDegradedCheckpoints = state.degradedCheckpoints.join(",");

    dataset.hearthCompletionLatched = String(state.completionLatched);
    dataset.hearthDegradedCompletionLatched = String(state.degradedCompletionLatched);
    dataset.hearthReadyTextAllowed = String(state.readyTextAllowed);
    dataset.hearthCompletionClosed = String(state.completionClosed);

    dataset.hearthStrictVisibleProof = String(state.strictVisibleProof);
    dataset.hearthSoftGapVisibleProof = String(state.softGapVisibleProof);
    dataset.hearthHardFailVisibleProof = String(state.hardFailVisibleProof);
    dataset.hearthStrictInspectReady = String(state.strictInspectReady);
    dataset.hearthFallbackInspectReady = String(state.fallbackInspectReady);
    dataset.hearthF21LatchMode = state.f21LatchMode;

    dataset.hearthQueuedEventsCount = String(state.queuedEvents.length);
    dataset.hearthArchivedEventsCount = String(state.archivedEvents.length);
    dataset.hearthCompactArchiveCount = String(state.compactArchiveCount);
    dataset.hearthDuplicatePostgameEventCount = String(state.duplicatePostgameEventCount);
    dataset.hearthBlockedEventsCount = String(state.blockedEvents.length);
    dataset.hearthAdmittedEventsCount = String(state.admittedEvents.length);

    dataset.hearthInspectModeAvailable = String(state.inspectModeAvailable);
    dataset.hearthInspectPlanetControlAvailable = String(state.inspectPlanetControlAvailable);
    dataset.hearthDiagnosticCanLeavePlanetFrame = String(state.diagnosticCanLeavePlanetFrame);
    dataset.hearthDiagnosticDockHiddenForInspection = String(state.diagnosticDockHiddenForInspection);
    dataset.hearthDiagnosticDockRestorable = String(state.diagnosticDockRestorable);

    dataset.hearthFirstFailedCoordinate = state.firstFailedCoordinate;
    dataset.hearthRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;

    dataset.hearthSouthCanvasReceiptBridgeActive = String(canvasBridge.canvasReceiptBridgeActive);
    dataset.hearthSouthCanvasNestedReceiptAvailable = String(canvasBridge.canvasNestedReceiptAvailable);
    dataset.hearthSouthCanvasContract = canvasBridge.canvasContract;
    dataset.hearthSouthCanvasReceipt = canvasBridge.canvasReceipt;
    dataset.hearthSouthCanvasExpectedContract = canvasBridge.canvasExpectedContract;
    dataset.hearthSouthCanvasExpectedReceipt = canvasBridge.canvasExpectedReceipt;
    dataset.hearthSouthCanvasContractMatchesExpected = String(canvasBridge.canvasContractMatchesExpected);
    dataset.hearthSouthCanvasReceiptMatchesExpected = String(canvasBridge.canvasReceiptMatchesExpected);
    dataset.hearthSouthCanvasNewsProtocolSynchronized = String(canvasBridge.canvasNewsProtocolSynchronized);
    dataset.hearthSouthCanvasFibonacciAlignmentSynchronized = String(canvasBridge.canvasFibonacciAlignmentSynchronized);
    dataset.hearthSouthCanvasActiveFibonacciGate = canvasBridge.canvasActiveFibonacciGate;
    dataset.hearthSouthCanvasFutureFibonacciGate = canvasBridge.canvasFutureFibonacciGate;
    dataset.hearthSouthCanvasSevenContinentVisualFallbackActive = String(canvasBridge.canvasSevenContinentVisualFallbackActive);
    dataset.hearthSouthCanvasProceduralSixLobeAdditiveFieldRetired = String(canvasBridge.canvasProceduralSixLobeAdditiveFieldRetired);
    dataset.hearthSouthCanvasTextureInvalidationCount = String(canvasBridge.canvasTextureInvalidationCount);
    dataset.hearthSouthCanvasF21ClaimedByCanvas = String(canvasBridge.canvasF21ClaimedByCanvas);
    dataset.hearthSouthCanvasVisualPassClaimed = String(canvasBridge.canvasVisualPassClaimed);

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.HEARTH.southRouteConductor = api;
    root.HEARTH.southVisibleCompletion = api;
    root.HEARTH.routeConductor = api;
    root.HEARTH.canvasNestedReceiptBridge = api;

    root.HEARTH_SOUTH_VISIBLE_COMPLETION = api;
    root.HEARTH_SOUTH_VISIBLE_COMPLETION_CYCLE_CONSUMER = api;
    root.HEARTH_ROUTE_CONDUCTOR = api;
    root.HearthRouteConductor = api;
    root.HEARTH_SOUTH_ROUTE_CONDUCTOR = api;
    root.HEARTH_SOUTH_GEAR_ADMISSION_TRANSLATOR = api;
    root.HEARTH_SOUTH_POSTGAME_DEDUP_INSPECT_GATE = api;
    root.HEARTH_SOUTH_STRICT_PROOF_DEGRADE_RECONCILIATION = api;
    root.HEARTH_SOUTH_CANVAS_NESTED_RECEIPT_BRIDGE = api;

    root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT = getReceiptLight();
    root.HEARTH_ROUTE_CONDUCTOR_RECEIPT = root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT;
    root.HEARTH_SOUTH_GEAR_ADMISSION_TRANSLATOR_RECEIPT = root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT;
    root.HEARTH_SOUTH_POSTGAME_DEDUP_INSPECT_GATE_RECEIPT = root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT;
    root.HEARTH_SOUTH_STRICT_PROOF_DEGRADE_RECONCILIATION_RECEIPT = root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT;
    root.HEARTH_SOUTH_CANVAS_NESTED_RECEIPT_BRIDGE_RECEIPT = root.HEARTH_SOUTH_VISIBLE_COMPLETION_RECEIPT;
  }

  function bootEarlyGearSequence() {
    [
      "HTML_SHELL_RENDERED",
      "LOAD_LEDGER_INITIALIZED",
      "FIRST_PAINT_COCKPIT_VISIBLE",
      "SCRIPT_ORDER_COMPLETE",
      "AUTHORITY_AVAILABILITY_READY",
      "CONDUCTOR_HYDRATED"
    ].forEach((eventName) => {
      admitGearEvent(eventName, {
        source: "southBootEarlyGearSequence",
        pageResponsive: true,
        hardBlock: false
      });
    });
  }

  function scheduleCanvasRetry(reason = "canvas-api-missing") {
    if (state.canvasRetryTimer || state.canvasBootAttempts >= CANVAS_RETRY_LIMIT || state.canvasBootComplete) return;

    state.canvasRetryTimer = root.setTimeout(() => {
      state.canvasRetryTimer = 0;
      bootCanvasOnce(reason);
    }, CANVAS_RETRY_DELAY_MS);
  }

  function bootCanvasOnce(reason = "south-boot") {
    if (canvasBootPromise || state.canvasBootComplete) return canvasBootPromise || Promise.resolve(readCanvasReceipt());

    const canvas = readCanvasApi();

    if (!canvas) {
      state.canvasBootAttempts += 1;
      state.canvasPresent = false;
      state.canvasBootStarted = false;
      state.canvasBootRequested = false;
      state.canvasBootError = "canvas-api-missing";
      recordLocal("CANVAS_API_WAITING_FOR_RETRY", {
        reason,
        attempt: state.canvasBootAttempts,
        retryLimit: CANVAS_RETRY_LIMIT
      });
      scheduleCanvasRetry("canvas-api-missing");
      return Promise.resolve(null);
    }

    state.canvasPresent = true;
    state.canvasBootRequested = true;
    state.canvasBootStarted = true;
    state.canvasBootAttempts += 1;

    try {
      if (isFunction(canvas.bootCooperative)) {
        canvasBootPromise = Promise.resolve(canvas.bootCooperative({
          mount: refs.mount || "#hearthCanvasMount",
          onReady: () => {
            state.canvasBootComplete = true;
            reconcileCanvasReceipt({ force: true });
          },
          onError: (error) => {
            state.canvasBootError = error && error.message ? error.message : String(error);
            recordError("CANVAS_BOOT_ERROR", state.canvasBootError);
          }
        })).then((result) => {
          state.canvasBootComplete = true;
          reconcileCanvasReceipt({ force: true });
          return result;
        }).catch((error) => {
          state.canvasBootError = error && error.message ? error.message : String(error);
          recordError("CANVAS_BOOT_PROMISE_FAILED", state.canvasBootError);
          canvasBootPromise = null;
          scheduleCanvasRetry("canvas-boot-promise-failed");
          return null;
        });

        return canvasBootPromise;
      }

      if (isFunction(canvas.boot)) {
        canvasBootPromise = Promise.resolve(canvas.boot({
          mount: refs.mount || "#hearthCanvasMount"
        })).then((result) => {
          state.canvasBootComplete = true;
          reconcileCanvasReceipt({ force: true });
          return result;
        }).catch((error) => {
          state.canvasBootError = error && error.message ? error.message : String(error);
          recordError("CANVAS_BOOT_PROMISE_FAILED", state.canvasBootError);
          canvasBootPromise = null;
          scheduleCanvasRetry("canvas-boot-promise-failed");
          return null;
        });

        return canvasBootPromise;
      }

      if (isFunction(canvas.render)) {
        canvasBootPromise = Promise.resolve(canvas.render({
          mount: refs.mount || "#hearthCanvasMount"
        })).then((result) => {
          state.canvasBootComplete = true;
          reconcileCanvasReceipt({ force: true });
          return result;
        }).catch((error) => {
          state.canvasBootError = error && error.message ? error.message : String(error);
          recordError("CANVAS_RENDER_PROMISE_FAILED", state.canvasBootError);
          canvasBootPromise = null;
          scheduleCanvasRetry("canvas-render-promise-failed");
          return null;
        });

        return canvasBootPromise;
      }

      state.canvasBootError = "canvas-boot-method-missing";
      recordError("CANVAS_BOOT_METHOD_MISSING", "Canvas API exists but exposes no bootCooperative, boot, or render method.");
    } catch (error) {
      state.canvasBootError = error && error.message ? error.message : String(error);
      recordError("CANVAS_BOOT_SYNC_FAILED", state.canvasBootError);
      canvasBootPromise = null;
      scheduleCanvasRetry("canvas-boot-sync-failed");
    }

    return Promise.resolve(null);
  }

  function startWatchdog() {
    if (watchdogTimer) root.clearInterval(watchdogTimer);

    watchdogTimer = root.setInterval(() => {
      state.watchdogTicks += 1;

      refreshAuthorityPresence();

      if (!state.canvasBootComplete && !canvasBootPromise && state.canvasBootAttempts < CANVAS_RETRY_LIMIT) {
        bootCanvasOnce("watchdog-retry");
      }

      reconcileCanvasReceipt();
      maybeCompleteInspectAndF21();
      render();

      if (state.completionClosed || state.watchdogTicks >= 80) {
        root.clearInterval(watchdogTimer);
        watchdogTimer = 0;
      }
    }, state.completionClosed ? 1000 : 450);
  }

  async function boot() {
    if (bootPromise) return bootPromise;

    bootPromise = (async () => {
      if (state.booted || state.booting) return getReceipt();

      state.booting = true;
      state.startedAt = nowIso();
      state.updatedAt = state.startedAt;
      state.postgameStatus = "SOUTH_CANVAS_NESTED_RECEIPT_BRIDGE_BOOTING";
      state.firstFailedCoordinate = "BOOTING_CANVAS_NESTED_RECEIPT_BRIDGE";
      state.recommendedNextRenewalTarget = FILE;

      ensureRefs();
      refreshAuthorityPresence();
      ensureNorthSession();

      if (root.addEventListener) {
        root.removeEventListener("hearth:canvas-phase", onCanvasPhase);
        root.addEventListener("hearth:canvas-phase", onCanvasPhase);
      }

      bootEarlyGearSequence();
      flushQueue();
      render();

      root.setTimeout(() => {
        bootCanvasOnce("initial-boot");
        startWatchdog();
      }, 60);

      state.booting = false;
      state.booted = true;

      recordLocal("SOUTH_CANVAS_NESTED_RECEIPT_BRIDGE_BOOTED", {
        northPresent: state.northPresent,
        sessionPresent: state.sessionPresent,
        canvasPresent: state.canvasPresent,
        postgameDedupActive: true,
        inspectGateActive: true,
        strictProofDegradeReconciliationActive: true,
        canvasNestedReceiptBridgeActive: true
      });

      render();
      return getReceipt();
    })();

    return bootPromise;
  }

  function getReceiptLight() {
    refreshAuthorityPresence();
    const active = activeCheckpoint();
    const highest = highestCompletedCheckpoint();
    const canvas = readCanvasReceipt();
    const canvasBridge = buildCanvasReceiptBridge(canvas);
    const snapshot = buildSnapshot();
    const gates = evaluateNewsGates(snapshot);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      role: state.role,

      postgameDedupActive: true,
      inspectGateActive: true,
      receiptCompactionActive: true,
      strictProofDegradeReconciliationActive: true,
      canvasNestedReceiptBridgeActive: true,

      transmissionMode: true,
      oneActiveGearAtATime: true,
      activeGearProgressResets: true,
      visibleProgressRepresentsCurrentGearOnly: true,

      ...canvasBridge,

      activeCheckpointId: active.id,
      activeCheckpointRank: active.rank,
      activeFibonacciStage: active.fibonacci,
      activeGearLabel: active.label,
      activeGearProgress: localProgressForActive(snapshot),

      highestCompletedCheckpointId: highest ? highest.id : "",
      highestCompletedRank: highest ? highest.rank : 0,
      completedCheckpoints: state.completedCheckpoints.slice(),
      degradedCheckpoints: state.degradedCheckpoints.slice(),

      queuedEventsCount: state.queuedEvents.length,
      archivedEventsCount: state.archivedEvents.length,
      compactArchiveCount: state.compactArchiveCount,
      duplicateCompletedEventCount: state.duplicateCompletedEventCount,
      duplicatePostgameEventCount: state.duplicatePostgameEventCount,
      progressOnlyEventCounts: clonePlain(state.progressOnlyEventCounts),
      blockedEventsCount: state.blockedEvents.length,
      admittedEventsCount: state.admittedEvents.length,

      completionLatched: state.completionLatched,
      degradedCompletionLatched: state.degradedCompletionLatched,
      completionClosed: state.completionClosed,
      readyTextAllowed: state.readyTextAllowed,

      strictVisibleProof: state.strictVisibleProof,
      softGapVisibleProof: state.softGapVisibleProof,
      hardFailVisibleProof: state.hardFailVisibleProof,
      strictInspectReady: state.strictInspectReady,
      fallbackInspectReady: state.fallbackInspectReady,
      f21LatchMode: state.f21LatchMode,

      canvasBootRequested: state.canvasBootRequested,
      canvasBootStarted: state.canvasBootStarted,
      canvasBootComplete: state.canvasBootComplete,
      canvasBootAttempts: state.canvasBootAttempts,
      canvasBootError: state.canvasBootError,

      imageRendered: safeBool(canvas.imageRendered, false),
      visiblePlanetAvailable: safeBool(canvas.visiblePlanetAvailable, false),
      visibleContentProof: safeBool(canvas.visibleContentProof, false),
      visibleContentSoftGap: safeBool(canvas.visibleContentSoftGap, false),

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

      northGateReady: gates.northGateReady,
      eastGateReady: gates.eastGateReady,
      westGateReady: gates.westGateReady,
      southGateReady: gates.southGateReady,
      newsGatePassedBeforeF21: gates.newsGatePassedBeforeF21,
      newsGateDegradedBeforeF21: gates.newsGateDegradedBeforeF21,

      latestEvent: state.latestEvent,
      postgameStatus: state.postgameStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    refreshAuthorityPresence();
    const active = activeCheckpoint();
    const highest = highestCompletedCheckpoint();
    const canvas = readCanvasReceipt();
    const canvasBridge = buildCanvasReceiptBridge(canvas);
    const gates = evaluateNewsGates(buildSnapshot());

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      role: state.role,

      postgameDedupActive: true,
      inspectGateActive: true,
      receiptCompactionActive: true,
      strictProofDegradeReconciliationActive: true,
      canvasNestedReceiptBridgeActive: true,

      cycleOrder: state.cycleOrder,
      transmissionMode: true,
      oneActiveGearAtATime: true,
      activeGearProgressResets: true,
      visibleProgressRepresentsCurrentGearOnly: true,

      northFile: NORTH_FILE,
      eastBranchFile: EAST_BRANCH_FILE,
      westBranchFile: WEST_BRANCH_FILE,
      southBranchFile: SOUTH_BRANCH_FILE,
      canvasFile: CANVAS_FILE,

      ...canvasBridge,

      northPresent: state.northPresent,
      eastBranchPresent: state.eastBranchPresent,
      westBranchPresent: state.westBranchPresent,
      southBranchPresent: state.southBranchPresent,
      canvasPresent: state.canvasPresent,
      sessionPresent: state.sessionPresent,
      sessionCreatedBySouth: state.sessionCreatedBySouth,

      activeCheckpointId: active.id,
      activeCheckpointRank: active.rank,
      activeFibonacciStage: active.fibonacci,
      activeGearLabel: active.label,
      activeGearProgress: localProgressForActive(buildSnapshot()),
      activeGearPercent: localProgressForActive(buildSnapshot()),

      highestCompletedCheckpointId: highest ? highest.id : "",
      highestCompletedRank: highest ? highest.rank : 0,

      completedCheckpoints: state.completedCheckpoints.slice(),
      degradedCheckpoints: state.degradedCheckpoints.slice(),
      reconciledCheckpointIds: state.reconciledCheckpointIds.slice(),

      queuedEventsCount: state.queuedEvents.length,
      archivedEventsCount: state.archivedEvents.length,
      compactArchiveCount: state.compactArchiveCount,
      duplicateCompletedEventCount: state.duplicateCompletedEventCount,
      duplicatePostgameEventCount: state.duplicatePostgameEventCount,
      unknownEventCount: state.unknownEventCount,
      progressOnlyEventCounts: clonePlain(state.progressOnlyEventCounts),
      progressOnlyEventLast: clonePlain(state.progressOnlyEventLast),
      blockedEventsCount: state.blockedEvents.length,
      admittedEventsCount: state.admittedEvents.length,

      completionLatched: state.completionLatched,
      degradedCompletionLatched: state.degradedCompletionLatched,
      completionClosed: state.completionClosed,
      readyTextAllowed: state.readyTextAllowed,

      strictVisibleProof: state.strictVisibleProof,
      softGapVisibleProof: state.softGapVisibleProof,
      hardFailVisibleProof: state.hardFailVisibleProof,
      strictInspectReady: state.strictInspectReady,
      fallbackInspectReady: state.fallbackInspectReady,
      f21LatchMode: state.f21LatchMode,

      canvasBootRequested: state.canvasBootRequested,
      canvasBootStarted: state.canvasBootStarted,
      canvasBootComplete: state.canvasBootComplete,
      canvasBootAttempts: state.canvasBootAttempts,
      canvasBootError: state.canvasBootError,

      imageRendered: safeBool(canvas.imageRendered, false),
      visiblePlanetAvailable: safeBool(canvas.visiblePlanetAvailable, false),
      visibleContentProof: safeBool(canvas.visibleContentProof, false),
      visibleContentSoftGap: safeBool(canvas.visibleContentSoftGap, false),
      visibleContentHardFail: safeBool(canvas.visibleContentHardFail, false),

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

      newsGateState: gates,

      latestEvent: state.latestEvent,
      postgameStatus: state.postgameStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      renderCount: state.renderCount,
      ledgerWriteCount: state.ledgerWriteCount,
      watchdogTicks: state.watchdogTicks,

      submittedEvents: clonePlain(state.submittedEvents),
      admittedEvents: clonePlain(state.admittedEvents),
      queuedEvents: clonePlain(state.queuedEvents),
      archivedEvents: clonePlain(state.archivedEvents),
      blockedEvents: clonePlain(state.blockedEvents),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),

      latestNorthResult: clonePlain(state.latestNorthResult),
      latestComposerPacket: clonePlain(state.latestComposerPacket),
      latestCanvasReceipt: clonePlain(state.latestCanvasReceipt),

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      startedAt: state.startedAt,
      updatedAt: nowIso()
    };
  }

  function listLines(items, formatter) {
    if (!Array.isArray(items) || !items.length) return "- none";
    return items.map(formatter).join("\n");
  }

  function progressOnlyLines(map) {
    const entries = Object.keys(map || {});
    if (!entries.length) return "- none";
    return entries.map((key) => `- ${key}: ${map[key]}`).join("\n");
  }

  function getReceiptText() {
    const receipt = getReceipt();

    return [
      "HEARTH_SOUTH_CANVAS_NESTED_RECEIPT_BRIDGE_RECEIPT",
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
      `postgameDedupActive=${receipt.postgameDedupActive}`,
      `inspectGateActive=${receipt.inspectGateActive}`,
      `receiptCompactionActive=${receipt.receiptCompactionActive}`,
      `strictProofDegradeReconciliationActive=${receipt.strictProofDegradeReconciliationActive}`,
      `canvasNestedReceiptBridgeActive=${receipt.canvasNestedReceiptBridgeActive}`,
      "",
      `cycleOrder=${receipt.cycleOrder}`,
      `transmissionMode=${receipt.transmissionMode}`,
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
      "CANVAS_RECEIPT_BRIDGE",
      `canvasReceiptBridgeActive=${receipt.canvasReceiptBridgeActive}`,
      `canvasNestedReceiptAvailable=${receipt.canvasNestedReceiptAvailable}`,
      `canvasContract=${receipt.canvasContract}`,
      `canvasReceipt=${receipt.canvasReceipt}`,
      `canvasExpectedContract=${receipt.canvasExpectedContract}`,
      `canvasExpectedReceipt=${receipt.canvasExpectedReceipt}`,
      `canvasContractMatchesExpected=${receipt.canvasContractMatchesExpected}`,
      `canvasReceiptMatchesExpected=${receipt.canvasReceiptMatchesExpected}`,
      `canvasPreviousContract=${receipt.canvasPreviousContract}`,
      `canvasBaselineContract=${receipt.canvasBaselineContract}`,
      `canvasVersion=${receipt.canvasVersion}`,
      `canvasRole=${receipt.canvasRole}`,
      `canvasNewsProtocolSynchronized=${receipt.canvasNewsProtocolSynchronized}`,
      `canvasFibonacciAlignmentSynchronized=${receipt.canvasFibonacciAlignmentSynchronized}`,
      `canvasActiveFibonacciGate=${receipt.canvasActiveFibonacciGate}`,
      `canvasFutureFibonacciGate=${receipt.canvasFutureFibonacciGate}`,
      `canvasOneActiveGearAtATime=${receipt.canvasOneActiveGearAtATime}`,
      `canvasSevenContinentVisualFallbackActive=${receipt.canvasSevenContinentVisualFallbackActive}`,
      `canvasContinentVisualSeedCount=${receipt.canvasContinentVisualSeedCount}`,
      `canvasContinentBlendMode=${receipt.canvasContinentBlendMode}`,
      `canvasProceduralSixLobeAdditiveFieldRetired=${receipt.canvasProceduralSixLobeAdditiveFieldRetired}`,
      `canvasOceanChannelCutActive=${receipt.canvasOceanChannelCutActive}`,
      `canvasSeaLineTightened=${receipt.canvasSeaLineTightened}`,
      `canvasCoastlineSharpeningActive=${receipt.canvasCoastlineSharpeningActive}`,
      `canvasCachedTextureInvalidationAvailable=${receipt.canvasCachedTextureInvalidationAvailable}`,
      `canvasTextureInvalidationCount=${receipt.canvasTextureInvalidationCount}`,
      `canvasTextureInvalidated=${receipt.canvasTextureInvalidated}`,
      `canvasTextureRebuildRequested=${receipt.canvasTextureRebuildRequested}`,
      `canvasTextureRebuildComplete=${receipt.canvasTextureRebuildComplete}`,
      `canvasTextureRebuildError=${receipt.canvasTextureRebuildError}`,
      `canvasVisualFidelityRenewalActive=${receipt.canvasVisualFidelityRenewalActive}`,
      `canvasSourceColorDemotedToPaletteInfluence=${receipt.canvasSourceColorDemotedToPaletteInfluence}`,
      `canvasElevationControlsLandShape=${receipt.canvasElevationControlsLandShape}`,
      `canvasHydrologyControlsWaterShape=${receipt.canvasHydrologyControlsWaterShape}`,
      `canvasCoastlineContrastActive=${receipt.canvasCoastlineContrastActive}`,
      `canvasCenterDarknessReduced=${receipt.canvasCenterDarknessReduced}`,
      `canvasLightingPreservesSurfaceReadability=${receipt.canvasLightingPreservesSurfaceReadability}`,
      `canvasStaleSourceMaskProtectionActive=${receipt.canvasStaleSourceMaskProtectionActive}`,
      `canvasStillDoesNotOwnPlanetTruth=${receipt.canvasStillDoesNotOwnPlanetTruth}`,
      `canvasTransitionalFallbackVisualField=${receipt.canvasTransitionalFallbackVisualField}`,
      `canvasUpstreamSevenContinentAuthorityPreferred=${receipt.canvasUpstreamSevenContinentAuthorityPreferred}`,
      `canvasLandChannelStillReceiverOnly=${receipt.canvasLandChannelStillReceiverOnly}`,
      `canvasF13EvidencePreserved=${receipt.canvasF13EvidencePreserved}`,
      `canvasF13EvidenceComplete=${receipt.canvasF13EvidenceComplete}`,
      `canvasF13HardFail=${receipt.canvasF13HardFail}`,
      `canvasF21ClaimedByCanvas=${receipt.canvasF21ClaimedByCanvas}`,
      `canvasReadyTextClaimedByCanvas=${receipt.canvasReadyTextClaimedByCanvas}`,
      `canvasReady=${receipt.canvasReady}`,
      `canvasImageRendered=${receipt.canvasImageRendered}`,
      `canvasVisiblePlanetAvailable=${receipt.canvasVisiblePlanetAvailable}`,
      `canvasVisibleContentProof=${receipt.canvasVisibleContentProof}`,
      `canvasVisibleContentStrictProof=${receipt.canvasVisibleContentStrictProof}`,
      `canvasVisibleContentSoftGap=${receipt.canvasVisibleContentSoftGap}`,
      `canvasVisibleContentHardFail=${receipt.canvasVisibleContentHardFail}`,
      `canvasVisibleForwardProgress=${receipt.canvasVisibleForwardProgress}`,
      `canvasGeneratedImage=${receipt.canvasGeneratedImage}`,
      `canvasGraphicBox=${receipt.canvasGraphicBox}`,
      `canvasWebGL=${receipt.canvasWebGL}`,
      `canvasVisualPassClaimed=${receipt.canvasVisualPassClaimed}`,
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
      listLines(receipt.completedCheckpoints, (item) => `- ${item}`),
      "",
      "DEGRADED_CHECKPOINTS",
      listLines(receipt.degradedCheckpoints, (item) => `- ${item}`),
      "",
      "RECONCILED_CHECKPOINTS",
      listLines(receipt.reconciledCheckpointIds, (item) => `- ${item}`),
      "",
      `queuedEventsCount=${receipt.queuedEventsCount}`,
      `archivedEventsCount=${receipt.archivedEventsCount}`,
      `compactArchiveCount=${receipt.compactArchiveCount}`,
      `duplicateCompletedEventCount=${receipt.duplicateCompletedEventCount}`,
      `duplicatePostgameEventCount=${receipt.duplicatePostgameEventCount}`,
      `unknownEventCount=${receipt.unknownEventCount}`,
      `blockedEventsCount=${receipt.blockedEventsCount}`,
      `admittedEventsCount=${receipt.admittedEventsCount}`,
      "",
      "PROGRESS_ONLY_EVENT_COUNTS",
      progressOnlyLines(receipt.progressOnlyEventCounts),
      "",
      `completionLatched=${receipt.completionLatched}`,
      `degradedCompletionLatched=${receipt.degradedCompletionLatched}`,
      `completionClosed=${receipt.completionClosed}`,
      `readyTextAllowed=${receipt.readyTextAllowed}`,
      "",
      `strictVisibleProof=${receipt.strictVisibleProof}`,
      `softGapVisibleProof=${receipt.softGapVisibleProof}`,
      `hardFailVisibleProof=${receipt.hardFailVisibleProof}`,
      `strictInspectReady=${receipt.strictInspectReady}`,
      `fallbackInspectReady=${receipt.fallbackInspectReady}`,
      `f21LatchMode=${receipt.f21LatchMode}`,
      "",
      `canvasBootRequested=${receipt.canvasBootRequested}`,
      `canvasBootStarted=${receipt.canvasBootStarted}`,
      `canvasBootComplete=${receipt.canvasBootComplete}`,
      `canvasBootAttempts=${receipt.canvasBootAttempts}`,
      `canvasBootError=${receipt.canvasBootError}`,
      `imageRendered=${receipt.imageRendered}`,
      `visiblePlanetAvailable=${receipt.visiblePlanetAvailable}`,
      `visibleContentProof=${receipt.visibleContentProof}`,
      `visibleContentSoftGap=${receipt.visibleContentSoftGap}`,
      `visibleContentHardFail=${receipt.visibleContentHardFail}`,
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
      `northGateReady=${receipt.newsGateState.northGateReady}`,
      `eastGateReady=${receipt.newsGateState.eastGateReady}`,
      `westGateReady=${receipt.newsGateState.westGateReady}`,
      `southGateReady=${receipt.newsGateState.southGateReady}`,
      `newsGatePassedBeforeF21=${receipt.newsGateState.newsGatePassedBeforeF21}`,
      `northGateDegradedReady=${receipt.newsGateState.northGateDegradedReady}`,
      `westGateDegradedReady=${receipt.newsGateState.westGateDegradedReady}`,
      `southGateDegradedReady=${receipt.newsGateState.southGateDegradedReady}`,
      `newsGateDegradedBeforeF21=${receipt.newsGateState.newsGateDegradedBeforeF21}`,
      "",
      `latestEvent=${receipt.latestEvent}`,
      `postgameStatus=${receipt.postgameStatus}`,
      `firstFailedCoordinate=${receipt.firstFailedCoordinate}`,
      `recommendedNextRenewalTarget=${receipt.recommendedNextRenewalTarget}`,
      "",
      `renderCount=${receipt.renderCount}`,
      `ledgerWriteCount=${receipt.ledgerWriteCount}`,
      `watchdogTicks=${receipt.watchdogTicks}`,
      "",
      "ADMITTED_EVENTS",
      listLines(receipt.admittedEvents, (item) => `- ${item.at} :: ${item.event} :: checkpoint=${item.checkpointId} :: fibonacci=${item.fibonacci} :: degraded=${item.degraded}`),
      "",
      "QUEUED_EVENTS",
      listLines(receipt.queuedEvents, (item) => `- ${item.at} :: ${item.event} :: checkpoint=${item.checkpointId} :: reason=${item.reason}`),
      "",
      "ARCHIVED_EVENTS_COMPACT_TAIL",
      listLines(receipt.archivedEvents, (item) => `- ${item.at} :: ${item.event} :: checkpoint=${item.checkpointId} :: reason=${item.reason}`),
      "",
      "BLOCKED_EVENTS",
      listLines(receipt.blockedEvents, (item) => `- ${item.at} :: ${item.event} :: checkpoint=${item.checkpointId} :: reason=${item.reason}`),
      "",
      "LOCAL_EVENTS_COMPACT_TAIL",
      listLines(receipt.localEvents, (item) => `- ${item.at} :: ${item.event} :: ${JSON.stringify(item.detail || {})}`),
      "",
      "ERRORS",
      listLines(receipt.errors, (item) => `- ${item.at} :: ${item.code} :: ${item.message}`),
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

  function dispose(reason = "manual-dispose") {
    if (watchdogTimer) {
      root.clearInterval(watchdogTimer);
      watchdogTimer = 0;
    }

    if (state.canvasRetryTimer) {
      root.clearTimeout(state.canvasRetryTimer);
      state.canvasRetryTimer = 0;
    }

    if (root.removeEventListener) {
      root.removeEventListener("hearth:canvas-phase", onCanvasPhase);
    }

    recordLocal("SOUTH_CANVAS_NESTED_RECEIPT_BRIDGE_DISPOSED", { reason });
    render();
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "south-canvas-nested-receipt-bridge",

    boot,
    start: boot,
    init: boot,
    run: boot,
    dispose,

    admitGearEvent,
    submitGearEvent: admitGearEvent,
    reconcileCanvasReceipt,
    bootCanvasOnce,
    classifyVisibleProof,
    hasStrictInspectSignal,
    hasFallbackInspectSignal,
    evaluateNewsGates,
    canLatchF21,
    buildCanvasReceiptBridge,
    getReceipt,
    getReceiptLight,
    getReceiptText,
    copyDiagnostic,
    setInspectMode,

    CHECKPOINTS,
    checkpointFrom,

    supportsGearAdmissionTranslation: true,
    supportsLegacyFibonacciEventTranslation: true,
    supportsOneActiveGearAtATime: true,
    supportsLocalGearProgress: true,
    supportsQueuedFutureF13Evidence: true,
    supportsSingleCanvasBoot: true,
    supportsDiagnosticCopy: true,
    supportsReceiptToggle: true,
    supportsInspectReservation: true,
    supportsPostgameDeduplication: true,
    supportsReceiptCompaction: true,
    supportsInspectGateTruth: true,
    supportsProgressOnlyCountTelemetry: true,
    supportsCanvasApiRetry: true,
    supportsStrictProofDegradeReconciliation: true,
    supportsStrictVisibleProofWithoutFalseDegrade: true,
    supportsStrictInspectModeWithoutFallbackDegrade: true,
    supportsFullF21WhenStrictNewsPasses: true,
    supportsCanvasNestedReceiptBridge: true,
    supportsCanvasContractProofExport: true,
    supportsCanvasNewsFibonacciSyncExport: true,
    supportsSevenContinentCanvasRenewalProofExport: true,

    expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
    expectedCanvasReceipt: EXPECTED_CANVAS_RECEIPT,

    ownsSouthRouteConductor: true,
    ownsVisibleCompletionCoordination: true,
    ownsCanvasReceiptBridge: true,
    ownsNorthCheckpointTruth: false,
    ownsEastFirstPaint: false,
    ownsWestGapTaxonomy: false,
    ownsCanvasDrawing: false,
    ownsTerrainTruth: false,
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

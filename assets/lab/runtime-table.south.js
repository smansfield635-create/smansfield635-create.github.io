// /assets/lab/runtime-table.south.js
// HEARTH_SOUTH_VISIBLE_STATE_COMPOSER_API_HANDSHAKE_RECOVERY_TNT_v1
// Full-file replacement.
// Canonical Dexter Lab South file.
// Purpose:
// - Restore the South visible-state composer API expected by the Hearth route.
// - Export composeVisibleState() and compatibility aliases.
// - Convert North checkpoint authority + East event flow + West inspect state + canvas evidence into a safe visible UI packet.
// - Prevent South receipt/composition failures from stalling the checkpoint session at F1A.
// - Treat queued, archived, blocked, duplicate, or late events as audit information unless North makes them structurally blocking.
// Does not own:
// - North checkpoint truth
// - East event admission truth
// - West inspect truth
// - canvas drawing
// - canvas boot
// - atlas rendering
// - source/channel truth
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_SOUTH_VISIBLE_STATE_COMPOSER_API_HANDSHAKE_RECOVERY_TNT_v1";
  const RECEIPT = "HEARTH_SOUTH_VISIBLE_STATE_COMPOSER_API_HANDSHAKE_RECOVERY_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_SOUTH_VISIBLE_STATE_FINAL_PROTOCOL_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_SOUTH_VISIBLE_STATE_COMPOSER_API_HANDSHAKE_RECOVERY_PRECODE_FINAL_DRAFT_v1";
  const VERSION = "2026-05-29.hearth-south-visible-state-composer-api-handshake-recovery-v1";
  const DESTINATION_FILE = "/assets/lab/runtime-table.south.js";

  const root = typeof window !== "undefined" ? window : globalThis;

  const CHECKPOINTS = Object.freeze([
    ["F1A_HTML_SHELL_RENDERED", 1, "F1A", 6, "HTML_SHELL_RENDERED"],
    ["F1B_LOAD_LEDGER_INITIALIZED", 2, "F1B", 12, "LOAD_LEDGER_INITIALIZED"],
    ["F2_FIRST_PAINT_COCKPIT_VISIBLE", 3, "F2", 22, "FIRST_PAINT_COCKPIT_VISIBLE"],
    ["F3_SCRIPT_ORDER_COMPLETE", 4, "F3", 36, "SCRIPT_ORDER_COMPLETE"],
    ["F5_AUTHORITY_AVAILABILITY_READY", 5, "F5", 55, "AUTHORITY_AVAILABILITY_READY"],
    ["F8_CONDUCTOR_HYDRATED", 6, "F8", 72, "CONDUCTOR_HYDRATED"],
    ["F13A_CANVAS_COOPERATIVE_BOOT_STARTED", 7, "F13A", 78, "CANVAS_COOPERATIVE_BOOT_STARTED"],
    ["F13B_CANVAS_MOUNT_CREATED", 8, "F13B", 81, "CANVAS_MOUNT_CREATED"],
    ["F13C_CANVAS_CONTEXT_READY", 9, "F13C", 84, "CANVAS_CONTEXT_READY"],
    ["F13D_DRAG_INSPECTION_BOUND", 10, "F13D", 86, "DRAG_INSPECTION_BOUND"],
    ["F13E_ATLAS_BUILD_STARTED", 11, "F13E", 88, "ATLAS_BUILD_STARTED"],
    ["F13F_ATLAS_BUILD_COMPLETE", 12, "F13F", 91, "ATLAS_BUILD_COMPLETE"],
    ["F13G_TEXTURE_COMPOSE_STARTED", 13, "F13G", 93, "TEXTURE_COMPOSE_STARTED"],
    ["F13H_TEXTURE_COMPOSE_COMPLETE", 14, "F13H", 96, "TEXTURE_COMPOSE_COMPLETE"],
    ["F13I_FIRST_FRAME_REQUESTED", 15, "F13I", 97, "FIRST_FRAME_REQUESTED"],
    ["F13J_FIRST_FRAME_DETECTED", 16, "F13J", 98, "FIRST_FRAME_DETECTED"],
    ["F13K_CANVAS_READY", 17, "F13K", 98, "CANVAS_READY"],
    ["F13L_VISIBLE_CONTENT_PROOF_STARTED", 18, "F13L", 98, "VISIBLE_CONTENT_PROOF_STARTED"],
    ["F13M_VISIBLE_CONTENT_PROOF_PASSED", 19, "F13M", 98, "VISIBLE_CONTENT_PROOF_PASSED"],
    ["F13N_INSPECT_MODE_READY", 20, "F13N", 98, "INSPECT_MODE_READY"],
    ["F21_COMPLETION_LATCHED", 21, "F21", 100, "COMPLETION_LATCHED"]
  ].map(([id, rank, fibonacci, progress, event]) => ({
    id,
    rank,
    fibonacci,
    progress,
    event
  })));

  const CHECKPOINT_BY_ID = CHECKPOINTS.reduce((map, checkpoint) => {
    map[checkpoint.id] = checkpoint;
    return map;
  }, {});

  const CHECKPOINT_BY_EVENT = CHECKPOINTS.reduce((map, checkpoint) => {
    map[checkpoint.event] = checkpoint;
    return map;
  }, {});

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
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      return { ...value };
    }
  }

  function asArray(value) {
    if (Array.isArray(value)) return value.slice();
    if (value === undefined || value === null || value === "") return [];
    if (typeof value === "string") {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
    return [value];
  }

  function objectValue(source, path) {
    if (!isObject(source)) return undefined;

    const parts = String(path).split(".");
    let cursor = source;

    for (const part of parts) {
      if (!isObject(cursor) && !Array.isArray(cursor)) return undefined;
      if (cursor[part] === undefined) return undefined;
      cursor = cursor[part];
    }

    return cursor;
  }

  function firstDefined(...values) {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== "") return value;
    }
    return undefined;
  }

  function firstString(...values) {
    const value = firstDefined(...values);
    return value === undefined ? "" : String(value);
  }

  function firstBool(fallback, ...values) {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== "") {
        return safeBool(value, fallback);
      }
    }
    return fallback;
  }

  function firstNumber(fallback, ...values) {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== "") {
        return safeNumber(value, fallback);
      }
    }
    return fallback;
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

  function mergeSources(...sources) {
    const output = {};

    sources.forEach((source) => {
      if (!isObject(source)) return;

      Object.keys(source).forEach((key) => {
        if (output[key] === undefined) output[key] = source[key];
      });
    });

    return output;
  }

  function findNestedReceipt(input, names) {
    for (const name of names) {
      const direct = objectValue(input, name);
      if (isObject(direct)) return direct;
    }

    return {};
  }

  function inferCheckpointFromEvidence(flat) {
    const completionLatched = firstBool(false, flat.completionLatched);
    const f21Allowed = firstBool(false, flat.f21Allowed, flat.newsGatePassedBeforeF21);
    const f13SubsequenceComplete = firstBool(false, flat.f13SubsequenceComplete);
    const visibleContentProof = firstBool(false, flat.visibleContentProof);
    const visibleContentProofStarted = firstBool(false, flat.visibleContentProofStarted);
    const inspectModeAvailable = firstBool(false, flat.inspectModeAvailable);
    const diagnosticCanLeavePlanetFrame = firstBool(false, flat.diagnosticCanLeavePlanetFrame);
    const buttonsReachable = firstBool(false, flat.buttonsReachable);
    const canvasReady = firstBool(false, flat.canvasReady);
    const firstFrameDetected = firstBool(false, flat.firstFrameDetected);
    const firstFrameRequested = firstBool(false, flat.firstFrameRequested);
    const textureComposeComplete = firstBool(false, flat.textureComposeComplete);
    const textureComposeStarted = firstBool(false, flat.textureComposeStarted);
    const atlasBuildComplete = firstBool(false, flat.atlasBuildComplete);
    const atlasBuildStarted = firstBool(false, flat.atlasBuildStarted);
    const dragInspectionBound = firstBool(false, flat.dragInspectionBound);
    const canvasContextReady = firstBool(false, flat.canvasContextReady);
    const canvasMountCreated = firstBool(false, flat.canvasMountCreated);
    const canvasBootStarted = firstBool(false, flat.canvasBootStartedAt, flat.canvasBootStarted);

    if (completionLatched && f21Allowed && f13SubsequenceComplete) return CHECKPOINT_BY_ID.F21_COMPLETION_LATCHED;
    if (visibleContentProof && inspectModeAvailable && diagnosticCanLeavePlanetFrame && buttonsReachable) return CHECKPOINT_BY_ID.F13N_INSPECT_MODE_READY;
    if (visibleContentProof) return CHECKPOINT_BY_ID.F13M_VISIBLE_CONTENT_PROOF_PASSED;
    if (visibleContentProofStarted) return CHECKPOINT_BY_ID.F13M_VISIBLE_CONTENT_PROOF_PASSED;
    if (canvasReady) return CHECKPOINT_BY_ID.F13K_CANVAS_READY;
    if (firstFrameDetected) return CHECKPOINT_BY_ID.F13J_FIRST_FRAME_DETECTED;
    if (firstFrameRequested) return CHECKPOINT_BY_ID.F13I_FIRST_FRAME_REQUESTED;
    if (textureComposeComplete) return CHECKPOINT_BY_ID.F13H_TEXTURE_COMPOSE_COMPLETE;
    if (textureComposeStarted) return CHECKPOINT_BY_ID.F13G_TEXTURE_COMPOSE_STARTED;
    if (atlasBuildComplete) return CHECKPOINT_BY_ID.F13F_ATLAS_BUILD_COMPLETE;
    if (atlasBuildStarted) return CHECKPOINT_BY_ID.F13E_ATLAS_BUILD_STARTED;
    if (dragInspectionBound) return CHECKPOINT_BY_ID.F13D_DRAG_INSPECTION_BOUND;
    if (canvasContextReady) return CHECKPOINT_BY_ID.F13C_CANVAS_CONTEXT_READY;
    if (canvasMountCreated) return CHECKPOINT_BY_ID.F13B_CANVAS_MOUNT_CREATED;
    if (canvasBootStarted) return CHECKPOINT_BY_ID.F13A_CANVAS_COOPERATIVE_BOOT_STARTED;

    return CHECKPOINT_BY_ID.F1A_HTML_SHELL_RENDERED;
  }

  function checkpointFromIdOrEvent(idOrEvent) {
    if (!idOrEvent) return null;
    const key = String(idOrEvent);
    return CHECKPOINT_BY_ID[key] || CHECKPOINT_BY_EVENT[key] || null;
  }

  function normalizeVisibleInput(input = {}) {
    const source = isObject(input) ? input : {};

    const north = findNestedReceipt(source, [
      "north",
      "northReceipt",
      "checkpointReceipt",
      "checkpointSessionReceipt",
      "checkpointSession",
      "sessionReceipt",
      "session",
      "northState"
    ]);

    const east = findNestedReceipt(source, [
      "east",
      "eastReceipt",
      "eventFlow",
      "eventReceipt",
      "eventState"
    ]);

    const west = findNestedReceipt(source, [
      "west",
      "westReceipt",
      "inspect",
      "inspectReceipt",
      "diagnostic",
      "diagnosticReceipt",
      "cockpit",
      "cockpitReceipt"
    ]);

    const canvas = findNestedReceipt(source, [
      "canvas",
      "canvasReceipt",
      "canvasState",
      "render",
      "renderMetadata",
      "canvasMetadata"
    ]);

    const route = findNestedReceipt(source, [
      "routeState",
      "routeReceipt",
      "hearth",
      "hearthReceipt"
    ]);

    const runtime = findNestedReceipt(source, [
      "runtime",
      "runtimeTable",
      "runtimeTableReceipt",
      "runtimeTableLedger"
    ]);

    const snapshot = mergeSources(
      objectValue(north, "snapshot"),
      objectValue(source, "snapshot"),
      objectValue(canvas, "snapshot"),
      objectValue(west, "snapshot")
    );

    const flat = mergeSources(
      source,
      route,
      north,
      east,
      west,
      canvas,
      runtime,
      snapshot
    );

    const completedCheckpoints = asArray(firstDefined(
      flat.completedCheckpoints,
      objectValue(north, "completedCheckpoints")
    ));

    const activeRaw = firstString(
      flat.activeCheckpointId,
      objectValue(north, "activeCheckpointId"),
      flat.activeCheckpoint,
      flat.currentCheckpointId,
      flat.latestVisibleEvent
    );

    const activeFromNorth = checkpointFromIdOrEvent(activeRaw);
    const inferredFromEvidence = inferCheckpointFromEvidence(flat);

    const queuedEventsCount = firstNumber(0, flat.queuedEventsCount, objectValue(north, "queuedEventsCount"));
    const northLooksStalledByPriorSouthError = Boolean(
      activeFromNorth &&
      activeFromNorth.id === "F1A_HTML_SHELL_RENDERED" &&
      queuedEventsCount > 0 &&
      firstBool(false, flat.canvasReady, flat.imageRendered, flat.visibleContentProof) &&
      safeString(firstDefined(flat.checkpointSessionError, flat.southCompositionError)).includes("composeVisibleState")
    );

    const activeCheckpoint = northLooksStalledByPriorSouthError
      ? inferredFromEvidence
      : activeFromNorth || inferredFromEvidence;

    const highestCompletedRaw = firstString(
      flat.highestCompletedCheckpointId,
      objectValue(north, "highestCompletedCheckpointId")
    );

    const highestCompletedCheckpoint =
      checkpointFromIdOrEvent(highestCompletedRaw) ||
      checkpointFromIdOrEvent(completedCheckpoints[completedCheckpoints.length - 1]) ||
      (completedCheckpoints.includes("F21_COMPLETION_LATCHED")
        ? CHECKPOINT_BY_ID.F21_COMPLETION_LATCHED
        : null);

    const explicitContentReceiptProof = firstBool(false, flat.explicitContentReceiptProof, canvas.explicitContentReceiptProof);
    const carrierOnlyDetected = firstBool(false, flat.carrierOnlyDetected, canvas.carrierOnlyDetected);
    const rawVisibleContentProof = firstBool(false, flat.visibleContentProof, canvas.visibleContentProof);
    const visibleContentProof = explicitContentReceiptProof ? true : (carrierOnlyDetected ? false : rawVisibleContentProof);

    const visiblePlanetAvailable = firstBool(
      visibleContentProof,
      flat.visiblePlanetAvailable,
      canvas.visiblePlanetAvailable
    );

    const inspectModeAvailable = firstBool(false, flat.inspectModeAvailable, west.inspectModeAvailable);
    const inspectPlanetControlAvailable = firstBool(false, flat.inspectPlanetControlAvailable, west.inspectPlanetControlAvailable);
    const diagnosticCanLeavePlanetFrame = firstBool(false, flat.diagnosticCanLeavePlanetFrame, west.diagnosticCanLeavePlanetFrame);
    const diagnosticDockRestorable = firstBool(true, flat.diagnosticDockRestorable, west.diagnosticDockRestorable);
    const showDiagnosticTabVisibleWhenHidden = firstBool(true, flat.showDiagnosticTabVisibleWhenHidden, west.showDiagnosticTabVisibleWhenHidden);
    const copyDiagnosticPreserved = firstBool(true, flat.copyDiagnosticPreserved, west.copyDiagnosticPreserved);
    const receiptToggleReady = firstBool(true, flat.receiptToggleReady, west.receiptToggleReady);
    const buttonsReachable = firstBool(false, flat.buttonsReachable, west.buttonsReachable);
    const receiptOverlayIndependent = firstBool(true, flat.receiptOverlayIndependent, west.receiptOverlayIndependent);

    const canvasReady = firstBool(false, flat.canvasReady, canvas.canvasReady);
    const atlasBuildComplete = firstBool(false, flat.atlasBuildComplete, canvas.atlasBuildComplete);
    const textureComposeComplete = firstBool(false, flat.textureComposeComplete, canvas.textureComposeComplete);
    const firstFrameDetected = firstBool(false, flat.firstFrameDetected, canvas.firstFrameDetected);
    const imageRendered = firstBool(false, flat.imageRendered, canvas.imageRendered);
    const cooperativeBootUsed = firstBool(false, flat.cooperativeBootUsed, canvas.cooperativeBootUsed);
    const syncBootFallbackUsed = firstBool(false, flat.syncBootFallbackUsed, canvas.syncBootFallbackUsed);
    const canvasCarrierRequested = firstBool(false, flat.canvasCarrierRequested, canvas.canvasCarrierRequested);
    const canvasCarrierHandoffOk = firstBool(false, flat.canvasCarrierHandoffOk, canvas.canvasCarrierHandoffOk);
    const blockingFutureEventViolation = firstBool(false, flat.blockingFutureEventViolation);

    const northGateReady = firstBool(
      Boolean(canvasReady && atlasBuildComplete && textureComposeComplete && visibleContentProof && visiblePlanetAvailable),
      flat.northGateReady,
      objectValue(north, "northGateReady"),
      objectValue(north, "newsGateState.northGateReady")
    );

    const eastGateReady = firstBool(
      Boolean(cooperativeBootUsed && !syncBootFallbackUsed && canvasCarrierRequested && canvasCarrierHandoffOk && !blockingFutureEventViolation),
      flat.eastGateReady,
      objectValue(north, "eastGateReady"),
      objectValue(north, "newsGateState.eastGateReady")
    );

    const westGateReady = firstBool(
      Boolean(copyDiagnosticPreserved && receiptToggleReady && inspectPlanetControlAvailable && diagnosticDockRestorable && buttonsReachable && receiptOverlayIndependent),
      flat.westGateReady,
      objectValue(north, "westGateReady"),
      objectValue(north, "newsGateState.westGateReady")
    );

    const southGateReady = firstBool(
      Boolean(imageRendered && firstFrameDetected && firstBool(false, flat.dragInspectionBound, canvas.dragInspectionBound) && visiblePlanetAvailable && diagnosticCanLeavePlanetFrame),
      flat.southGateReady,
      objectValue(north, "southGateReady"),
      objectValue(north, "newsGateState.southGateReady")
    );

    const newsGatePassedBeforeF21 = firstBool(
      Boolean(northGateReady && eastGateReady && westGateReady && southGateReady),
      flat.newsGatePassedBeforeF21,
      objectValue(north, "newsGatePassedBeforeF21"),
      objectValue(north, "newsGateState.newsGatePassedBeforeF21")
    );

    const f13SubsequenceComplete = firstBool(
      Boolean(completedCheckpoints.includes("F13N_INSPECT_MODE_READY") || (visibleContentProof && inspectModeAvailable && diagnosticCanLeavePlanetFrame && buttonsReachable)),
      flat.f13SubsequenceComplete,
      objectValue(north, "f13SubsequenceComplete")
    );

    const f21Allowed = firstBool(
      Boolean(f13SubsequenceComplete && newsGatePassedBeforeF21),
      flat.f21Allowed,
      objectValue(north, "f21Allowed")
    );

    const completionLatched = firstBool(
      Boolean(completedCheckpoints.includes("F21_COMPLETION_LATCHED") && f21Allowed),
      flat.completionLatched,
      objectValue(north, "completionLatched")
    );

    return {
      source: clonePlain(source),
      north: clonePlain(north),
      east: clonePlain(east),
      west: clonePlain(west),
      canvas: clonePlain(canvas),
      runtime: clonePlain(runtime),
      flat: clonePlain(flat),

      completedCheckpoints,
      activeCheckpoint,
      highestCompletedCheckpoint,
      northLooksStalledByPriorSouthError,

      queuedEventsCount,
      archivedEventsCount: firstNumber(0, flat.archivedEventsCount, objectValue(north, "archivedEventsCount")),
      blockedEventsCount: firstNumber(0, flat.blockedEventsCount, objectValue(north, "blockedEventsCount")),
      admittedEventsCount: firstNumber(0, flat.admittedEventsCount, objectValue(north, "admittedEventsCount")),
      regressionPrevented: firstNumber(0, flat.regressionPrevented, objectValue(north, "regressionPrevented")),

      visibleContentProof,
      visibleContentProofStarted: firstBool(false, flat.visibleContentProofStarted, canvas.visibleContentProofStarted),
      visibleContentProofMethod: firstString(flat.visibleContentProofMethod, canvas.visibleContentProofMethod),
      visibleContentProofError: firstString(flat.visibleContentProofError, canvas.visibleContentProofError),
      visibleContentSampleCount: firstNumber(0, flat.visibleContentSampleCount, canvas.visibleContentSampleCount),
      visibleContentVarianceScore: firstNumber(0, flat.visibleContentVarianceScore, canvas.visibleContentVarianceScore),
      visibleContentClassCount: firstNumber(0, flat.visibleContentClassCount, canvas.visibleContentClassCount),
      visibleContentClasses: firstString(flat.visibleContentClasses, canvas.visibleContentClasses),
      visibleContentLandSampleCount: firstNumber(0, flat.visibleContentLandSampleCount, canvas.visibleContentLandSampleCount),
      visibleContentWaterSampleCount: firstNumber(0, flat.visibleContentWaterSampleCount, canvas.visibleContentWaterSampleCount),
      visibleContentOtherSampleCount: firstNumber(0, flat.visibleContentOtherSampleCount, canvas.visibleContentOtherSampleCount),
      carrierOnlyDetected,
      explicitContentReceiptProof,
      renderedAfterTexture: firstBool(false, flat.renderedAfterTexture, canvas.renderedAfterTexture),

      visiblePlanetAvailable,
      planetCanvasPresent: firstBool(false, flat.planetCanvasPresent, canvas.planetCanvasPresent),
      planetCanvasNonZeroSize: firstBool(false, flat.planetCanvasNonZeroSize, canvas.planetCanvasNonZeroSize),
      planetFramePainted: firstBool(false, flat.planetFramePainted, canvas.planetFramePainted),
      nonblankPlanetVisible: firstBool(false, flat.nonblankPlanetVisible, canvas.nonblankPlanetVisible),
      planetNotObstructed: firstBool(false, flat.planetNotObstructed, canvas.planetNotObstructed),

      inspectModeAvailable,
      inspectPlanetControlAvailable,
      diagnosticCanLeavePlanetFrame,
      diagnosticDockHiddenForInspection: firstBool(false, flat.diagnosticDockHiddenForInspection, west.diagnosticDockHiddenForInspection),
      showDiagnosticTabVisible: firstBool(false, flat.showDiagnosticTabVisible, west.showDiagnosticTabVisible),
      showDiagnosticTabVisibleWhenHidden,
      diagnosticDockRestorable,
      copyDiagnosticPreserved,
      receiptToggleReady,
      buttonsReachable,
      receiptOverlayIndependent,

      canvasReady,
      canvasCarrierMounted: firstBool(false, flat.canvasCarrierMounted, canvas.canvasCarrierMounted),
      canvasCarrierRequested,
      canvasCarrierHandoffOk,
      canvasCarrierHandoffError: firstString(flat.canvasCarrierHandoffError, canvas.canvasCarrierHandoffError),
      canvasCarrierMethod: firstString(flat.canvasCarrierMethod, canvas.canvasCarrierMethod),
      cooperativeBootAvailable: firstBool(false, flat.cooperativeBootAvailable, canvas.cooperativeBootAvailable),
      cooperativeBootUsed,
      syncBootFallbackUsed,
      canvasBootStartedAt: firstString(flat.canvasBootStartedAt, canvas.canvasBootStartedAt),
      canvasBootCompletedAt: firstString(flat.canvasBootCompletedAt, canvas.canvasBootCompletedAt),
      canvasBootElapsedMs: firstNumber(0, flat.canvasBootElapsedMs, canvas.canvasBootElapsedMs),
      canvasYieldCount: firstNumber(0, flat.canvasYieldCount, canvas.canvasYieldCount),
      canvasPhaseCount: firstNumber(0, flat.canvasPhaseCount, canvas.canvasPhaseCount),
      lastCanvasPhase: firstString(flat.lastCanvasPhase, canvas.lastCanvasPhase),
      lastCanvasProgress: firstNumber(0, flat.lastCanvasProgress, canvas.lastCanvasProgress),
      loaderRepaintDuringCanvasBoot: firstBool(false, flat.loaderRepaintDuringCanvasBoot, canvas.loaderRepaintDuringCanvasBoot),
      f13ProgressStreamActive: firstBool(false, flat.f13ProgressStreamActive, canvas.f13ProgressStreamActive),
      canvasLaneClosed: firstBool(false, flat.canvasLaneClosed, canvas.canvasLaneClosed),
      postCanvasPhaseBouncePrevented: firstBool(true, flat.postCanvasPhaseBouncePrevented, canvas.postCanvasPhaseBouncePrevented),
      ignoredDuplicateCanvasEvents: firstNumber(0, flat.ignoredDuplicateCanvasEvents, canvas.ignoredDuplicateCanvasEvents),

      atlasBuildStarted: firstBool(false, flat.atlasBuildStarted, canvas.atlasBuildStarted),
      atlasBuildProgress: firstNumber(0, flat.atlasBuildProgress, canvas.atlasBuildProgress),
      atlasBuildComplete,
      textureComposeStarted: firstBool(false, flat.textureComposeStarted, canvas.textureComposeStarted),
      textureComposeProgress: firstNumber(0, flat.textureComposeProgress, canvas.textureComposeProgress),
      textureComposeComplete,
      firstFrameRequested: firstBool(false, flat.firstFrameRequested, canvas.firstFrameRequested),
      firstFrameDetected,
      imageRendered,
      dragInspectionBound: firstBool(false, flat.dragInspectionBound, canvas.dragInspectionBound),

      runtimeTablePresent: firstBool(false, flat.runtimeTablePresent, runtime.runtimeTablePresent),
      runtimeTableMode: firstString(flat.runtimeTableMode, runtime.runtimeTableMode),
      runtimeTablePlanAttempted: firstBool(false, flat.runtimeTablePlanAttempted, runtime.runtimeTablePlanAttempted),
      runtimeTablePlanCreated: firstBool(false, flat.runtimeTablePlanCreated, runtime.runtimeTablePlanCreated),
      runtimeTablePlanError: firstString(flat.runtimeTablePlanError, runtime.runtimeTablePlanError),
      sourceAuthorityHeld: firstBool(false, flat.sourceAuthorityHeld, runtime.sourceAuthorityHeld),

      northGateReady,
      eastGateReady,
      westGateReady,
      southGateReady,
      newsGatePassedBeforeF21,
      f13SubsequenceComplete,
      f13LastRequiredEvent: firstString(flat.f13LastRequiredEvent, objectValue(north, "f13LastRequiredEvent")),
      f21Allowed,
      completionLatched,

      partialReceiptAvailable: firstBool(true, flat.partialReceiptAvailable),
      finalReceiptAvailable: firstBool(false, flat.finalReceiptAvailable),
      copyDiagnosticArmed: firstBool(true, flat.copyDiagnosticArmed),
      dockVisible: firstBool(true, flat.dockVisible),
      fullCockpitExpanded: firstBool(false, flat.fullCockpitExpanded),
      heartbeatElapsedMs: firstNumber(0, flat.heartbeatElapsedMs),

      latestVisibleEvent: firstString(flat.latestVisibleEvent),
      currentStage: firstString(flat.currentStage),
      highestStage: firstString(flat.highestStage),
      firstFailedCoordinate: firstString(flat.firstFailedCoordinate),
      recommendedNextRenewalTarget: firstString(flat.recommendedNextRenewalTarget)
    };
  }

  function resolveFirstFailedCoordinate(normalized, southCompositionFailed) {
    if (southCompositionFailed) return "WAITING_southComposeVisibleState";
    if (!normalized.visibleContentProof) return "WAITING_VISIBLE_CONTENT_PROOF_PASSED";
    if (!normalized.inspectModeAvailable) return "WAITING_inspectModeAvailable";
    if (!normalized.inspectPlanetControlAvailable) return "WAITING_inspectPlanetControlAvailable";
    if (!normalized.diagnosticCanLeavePlanetFrame) return "WAITING_diagnosticCanLeavePlanetFrame";
    if (!normalized.buttonsReachable) return "WAITING_buttonsReachable";
    if (!normalized.northGateReady) return "WAITING_northGateReady";
    if (!normalized.eastGateReady) return "WAITING_eastGateReady";
    if (!normalized.westGateReady) return "WAITING_westGateReady";
    if (!normalized.southGateReady) return "WAITING_southGateReady";
    if (!normalized.completionLatched) return "WAITING_completionLatch";
    return "NONE_NEWS_FIBONACCI_F21_LATCHED";
  }

  function resolveRenewalTarget(firstFailedCoordinate) {
    if (firstFailedCoordinate === "WAITING_southComposeVisibleState") {
      return "/assets/lab/runtime-table.south.js";
    }

    if (firstFailedCoordinate === "WAITING_VISIBLE_CONTENT_PROOF_PASSED") {
      return "/assets/hearth/hearth.canvas.js";
    }

    if (
      firstFailedCoordinate === "WAITING_inspectModeAvailable" ||
      firstFailedCoordinate === "WAITING_inspectPlanetControlAvailable" ||
      firstFailedCoordinate === "WAITING_diagnosticCanLeavePlanetFrame" ||
      firstFailedCoordinate === "WAITING_buttonsReachable"
    ) {
      return "/showroom/globe/hearth/hearth.js";
    }

    if (firstFailedCoordinate === "NONE_NEWS_FIBONACCI_F21_LATCHED") {
      return "read-postgame-canvas-or-triple-g-receipt";
    }

    return "/showroom/globe/hearth/hearth.js";
  }

  function resolvePostgameStatus(normalized, southCompositionFailed) {
    if (southCompositionFailed) return "SOUTH_VISIBLE_STATE_FALLBACK_ACTIVE";

    if (
      normalized.completionLatched &&
      normalized.f21Allowed &&
      normalized.f13SubsequenceComplete &&
      normalized.newsGatePassedBeforeF21 &&
      normalized.visibleContentProof &&
      normalized.visiblePlanetAvailable &&
      normalized.inspectModeAvailable &&
      normalized.diagnosticCanLeavePlanetFrame &&
      normalized.buttonsReachable
    ) {
      return "READY_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE";
    }

    if (!normalized.visibleContentProof) return "VISIBLE_CONTENT_PROOF_PENDING";

    if (
      !normalized.inspectModeAvailable ||
      !normalized.inspectPlanetControlAvailable ||
      !normalized.diagnosticCanLeavePlanetFrame ||
      !normalized.buttonsReachable
    ) {
      return "INSPECT_OR_NEWS_GATE_PENDING";
    }

    if (!normalized.newsGatePassedBeforeF21) return "NEWS_GATE_PENDING";

    if (!normalized.canvasReady) return "CANVAS_SEQUENCE_PENDING";

    return "CHECKPOINT_SEQUENCE_ACTIVE";
  }

  function resolveVisibleCheckpoint(normalized, postgameStatus) {
    if (postgameStatus === "READY_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE") {
      return CHECKPOINT_BY_ID.F21_COMPLETION_LATCHED;
    }

    if (postgameStatus === "VISIBLE_CONTENT_PROOF_PENDING") {
      return normalized.visibleContentProofStarted
        ? CHECKPOINT_BY_ID.F13M_VISIBLE_CONTENT_PROOF_PASSED
        : normalized.activeCheckpoint || CHECKPOINT_BY_ID.F13L_VISIBLE_CONTENT_PROOF_STARTED;
    }

    if (postgameStatus === "INSPECT_OR_NEWS_GATE_PENDING") {
      return CHECKPOINT_BY_ID.F13N_INSPECT_MODE_READY;
    }

    if (postgameStatus === "NEWS_GATE_PENDING") {
      return CHECKPOINT_BY_ID.F21_COMPLETION_LATCHED;
    }

    return normalized.activeCheckpoint || inferCheckpointFromEvidence(normalized.flat || {});
  }

  function resolveLatestVisibleEvent(normalized, checkpoint, postgameStatus) {
    if (postgameStatus === "READY_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE") return "COMPLETION_LATCHED";
    if (postgameStatus === "VISIBLE_CONTENT_PROOF_PENDING") return normalized.visibleContentProofStarted ? "VISIBLE_CONTENT_PROOF_STARTED" : "CANVAS_READY";
    if (postgameStatus === "INSPECT_OR_NEWS_GATE_PENDING") return normalized.visibleContentProof ? "VISIBLE_CONTENT_PROOF_PASSED" : "VISIBLE_CONTENT_PROOF_STARTED";
    if (normalized.latestVisibleEvent) return normalized.latestVisibleEvent;
    return checkpoint ? checkpoint.event : "";
  }

  function resolveProgress(normalized, checkpoint, postgameStatus) {
    const completed =
      postgameStatus === "READY_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE" &&
      normalized.completionLatched &&
      normalized.f21Allowed;

    if (completed) {
      return {
        mainDisplayProgress: 100,
        mainProgressCap: 100,
        readyTextAllowed: true
      };
    }

    const sourceProgress = firstNumber(
      checkpoint ? checkpoint.progress : 0,
      normalized.flat && normalized.flat.mainDisplayProgress,
      normalized.flat && normalized.flat.visibleProgress
    );

    return {
      mainDisplayProgress: clamp(Math.max(sourceProgress, 0), 0, 98),
      mainProgressCap: 98,
      readyTextAllowed: false
    };
  }

  function composePacket(normalized, southCompositionFailed = false, southCompositionError = "") {
    const firstFailedCoordinate = resolveFirstFailedCoordinate(normalized, southCompositionFailed);
    const postgameStatus = resolvePostgameStatus(normalized, southCompositionFailed);
    const checkpoint = resolveVisibleCheckpoint(normalized, postgameStatus);
    const progress = resolveProgress(normalized, checkpoint, postgameStatus);
    const latestVisibleEvent = resolveLatestVisibleEvent(normalized, checkpoint, postgameStatus);
    const recommendedNextRenewalTarget = resolveRenewalTarget(firstFailedCoordinate);

    const activeCheckpointId = checkpoint ? checkpoint.id : "";
    const activeCheckpointRank = checkpoint ? checkpoint.rank : 0;
    const activeFibonacciStage = checkpoint ? checkpoint.fibonacci : "";

    const highestCompleted = normalized.highestCompletedCheckpoint || (
      normalized.completionLatched
        ? CHECKPOINT_BY_ID.F21_COMPLETION_LATCHED
        : normalized.completedCheckpoints.includes("F13N_INSPECT_MODE_READY")
          ? CHECKPOINT_BY_ID.F13N_INSPECT_MODE_READY
          : normalized.completedCheckpoints.includes("F13M_VISIBLE_CONTENT_PROOF_PASSED")
            ? CHECKPOINT_BY_ID.F13M_VISIBLE_CONTENT_PROOF_PASSED
            : null
    );

    const currentStage = progress.mainDisplayProgress === 100
      ? "F21"
      : activeFibonacciStage || normalized.currentStage || "";

    const highestStage = progress.mainDisplayProgress === 100
      ? "F21"
      : firstString(
        normalized.highestStage,
        highestCompleted && highestCompleted.fibonacci,
        activeFibonacciStage
      );

    const finalReceiptAvailable = progress.mainDisplayProgress === 100
      ? true
      : normalized.finalReceiptAvailable;

    const diagnosticCockpitReady =
      postgameStatus === "READY_PLANET_VISIBLE_DIAGNIC_AVAILABLE" ||
      postgameStatus === "READY_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE" ||
      normalized.visiblePlanetAvailable ||
      normalized.partialReceiptAvailable;

    const cockpitMode = progress.mainDisplayProgress === 100 || normalized.visiblePlanetAvailable
      ? "diagnostic-dock"
      : "loading-cockpit";

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: DESTINATION_FILE,
      role: "south-visible-state-composer",

      southCompositionOk: !southCompositionFailed,
      southFallbackUsed: southCompositionFailed,
      southCompositionError: southCompositionError || "",
      visibleStateRecoverable: true,

      currentStage,
      highestStage,
      activeCheckpointId,
      activeCheckpointRank,
      activeFibonacciStage,
      highestCompletedCheckpointId: highestCompleted ? highestCompleted.id : "",
      highestCompletedRank: highestCompleted ? highestCompleted.rank : 0,

      latestVisibleEvent,
      visibleLoadingActive: progress.mainDisplayProgress < 100 && postgameStatus !== "CHECKPOINT_SEQUENCE_ACTIVE",
      diagnosticCockpitReady,
      cockpitMode,
      dockVisible: normalized.dockVisible,
      fullCockpitExpanded: normalized.fullCockpitExpanded,

      partialReceiptAvailable: normalized.partialReceiptAvailable,
      finalReceiptAvailable,
      copyDiagnosticArmed: normalized.copyDiagnosticArmed,
      receiptToggleReady: normalized.receiptToggleReady,
      buttonsReachable: normalized.buttonsReachable,

      postgameStatus,
      firstFailedCoordinate,
      recommendedNextRenewalTarget,

      mainDisplayProgress: progress.mainDisplayProgress,
      mainProgressCap: progress.mainProgressCap,
      readyTextAllowed: progress.readyTextAllowed,
      completionLatched: progress.readyTextAllowed && progress.mainDisplayProgress === 100,

      visibleContentProof: normalized.visibleContentProof,
      visibleContentProofStarted: normalized.visibleContentProofStarted,
      visibleContentProofMethod: normalized.visibleContentProofMethod,
      visibleContentProofError: normalized.visibleContentProofError,
      visibleContentSampleCount: normalized.visibleContentSampleCount,
      visibleContentVarianceScore: normalized.visibleContentVarianceScore,
      visibleContentClassCount: normalized.visibleContentClassCount,
      visibleContentClasses: normalized.visibleContentClasses,
      visibleContentLandSampleCount: normalized.visibleContentLandSampleCount,
      visibleContentWaterSampleCount: normalized.visibleContentWaterSampleCount,
      visibleContentOtherSampleCount: normalized.visibleContentOtherSampleCount,
      carrierOnlyDetected: normalized.carrierOnlyDetected,
      explicitContentReceiptProof: normalized.explicitContentReceiptProof,
      renderedAfterTexture: normalized.renderedAfterTexture,

      visiblePlanetAvailable: normalized.visiblePlanetAvailable,
      planetCanvasPresent: normalized.planetCanvasPresent,
      planetCanvasNonZeroSize: normalized.planetCanvasNonZeroSize,
      planetFramePainted: normalized.planetFramePainted,
      nonblankPlanetVisible: normalized.nonblankPlanetVisible,
      planetNotObstructed: normalized.planetNotObstructed,

      inspectModeAvailable: normalized.inspectModeAvailable,
      inspectPlanetControlAvailable: normalized.inspectPlanetControlAvailable,
      diagnosticCanLeavePlanetFrame: normalized.diagnosticCanLeavePlanetFrame,
      diagnosticDockHiddenForInspection: normalized.diagnosticDockHiddenForInspection,
      showDiagnosticTabVisible: normalized.showDiagnosticTabVisible,
      showDiagnosticTabVisibleWhenHidden: normalized.showDiagnosticTabVisibleWhenHidden,
      diagnosticDockRestorable: normalized.diagnosticDockRestorable,
      copyDiagnosticPreserved: normalized.copyDiagnosticPreserved,
      receiptOverlayIndependent: normalized.receiptOverlayIndependent,

      northGateReady: normalized.northGateReady,
      eastGateReady: normalized.eastGateReady,
      westGateReady: normalized.westGateReady,
      southGateReady: normalized.southGateReady,
      newsGatePassedBeforeF21: normalized.newsGatePassedBeforeF21,

      f13SubsequenceComplete: normalized.f13SubsequenceComplete,
      f13LastRequiredEvent: normalized.f13LastRequiredEvent,
      f21Allowed: normalized.f21Allowed,
      f21AfterF13N: normalized.f13SubsequenceComplete && normalized.f21Allowed,

      queuedEventsCount: normalized.queuedEventsCount,
      archivedEventsCount: normalized.archivedEventsCount,
      blockedEventsCount: normalized.blockedEventsCount,
      admittedEventsCount: normalized.admittedEventsCount,
      regressionPrevented: normalized.regressionPrevented,
      northLooksStalledByPriorSouthError: normalized.northLooksStalledByPriorSouthError,

      canvasReady: normalized.canvasReady,
      canvasCarrierMounted: normalized.canvasCarrierMounted,
      canvasCarrierRequested: normalized.canvasCarrierRequested,
      canvasCarrierHandoffOk: normalized.canvasCarrierHandoffOk,
      canvasCarrierHandoffError: normalized.canvasCarrierHandoffError,
      canvasCarrierMethod: normalized.canvasCarrierMethod,
      cooperativeBootAvailable: normalized.cooperativeBootAvailable,
      cooperativeBootUsed: normalized.cooperativeBootUsed,
      syncBootFallbackUsed: normalized.syncBootFallbackUsed,
      canvasBootStartedAt: normalized.canvasBootStartedAt,
      canvasBootCompletedAt: normalized.canvasBootCompletedAt,
      canvasBootElapsedMs: normalized.canvasBootElapsedMs,
      canvasYieldCount: normalized.canvasYieldCount,
      canvasPhaseCount: normalized.canvasPhaseCount,
      lastCanvasPhase: normalized.lastCanvasPhase,
      lastCanvasProgress: normalized.lastCanvasProgress,
      loaderRepaintDuringCanvasBoot: normalized.loaderRepaintDuringCanvasBoot,
      f13ProgressStreamActive: normalized.f13ProgressStreamActive,
      canvasLaneClosed: normalized.canvasLaneClosed,
      postCanvasPhaseBouncePrevented: normalized.postCanvasPhaseBouncePrevented,
      ignoredDuplicateCanvasEvents: normalized.ignoredDuplicateCanvasEvents,

      atlasBuildStarted: normalized.atlasBuildStarted,
      atlasBuildProgress: normalized.atlasBuildProgress,
      atlasBuildComplete: normalized.atlasBuildComplete,
      textureComposeStarted: normalized.textureComposeStarted,
      textureComposeProgress: normalized.textureComposeProgress,
      textureComposeComplete: normalized.textureComposeComplete,
      firstFrameRequested: normalized.firstFrameRequested,
      firstFrameDetected: normalized.firstFrameDetected,
      imageRendered: normalized.imageRendered,
      dragInspectionBound: normalized.dragInspectionBound,

      runtimeTablePresent: normalized.runtimeTablePresent,
      runtimeTableMode: normalized.runtimeTableMode,
      runtimeTablePlanAttempted: normalized.runtimeTablePlanAttempted,
      runtimeTablePlanCreated: normalized.runtimeTablePlanCreated,
      runtimeTablePlanError: normalized.runtimeTablePlanError,
      sourceAuthorityHeld: normalized.sourceAuthorityHeld,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function composeFallbackVisibleState(input = {}, error = null) {
    const message = error && error.message ? error.message : safeString(error, "");

    const normalized = (() => {
      try {
        return normalizeVisibleInput(input);
      } catch (_normalizationError) {
        return {
          flat: {},
          completedCheckpoints: [],
          activeCheckpoint: CHECKPOINT_BY_ID.F1A_HTML_SHELL_RENDERED,
          highestCompletedCheckpoint: null,
          queuedEventsCount: 0,
          archivedEventsCount: 0,
          blockedEventsCount: 0,
          admittedEventsCount: 0,
          regressionPrevented: 0,
          visibleContentProof: false,
          visibleContentProofStarted: false,
          visibleContentProofMethod: "",
          visibleContentProofError: "",
          visibleContentSampleCount: 0,
          visibleContentVarianceScore: 0,
          visibleContentClassCount: 0,
          visibleContentClasses: "",
          visibleContentLandSampleCount: 0,
          visibleContentWaterSampleCount: 0,
          visibleContentOtherSampleCount: 0,
          carrierOnlyDetected: false,
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
          showDiagnosticTabVisibleWhenHidden: true,
          diagnosticDockRestorable: true,
          copyDiagnosticPreserved: true,
          receiptToggleReady: true,
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
          runtimeTableMode: "",
          runtimeTablePlanAttempted: false,
          runtimeTablePlanCreated: false,
          runtimeTablePlanError: "",
          sourceAuthorityHeld: false,
          northGateReady: false,
          eastGateReady: false,
          westGateReady: false,
          southGateReady: false,
          newsGatePassedBeforeF21: false,
          f13SubsequenceComplete: false,
          f13LastRequiredEvent: "",
          f21Allowed: false,
          completionLatched: false,
          partialReceiptAvailable: true,
          finalReceiptAvailable: false,
          copyDiagnosticArmed: true,
          dockVisible: true,
          fullCockpitExpanded: false,
          heartbeatElapsedMs: 0,
          latestVisibleEvent: "",
          currentStage: "F1A",
          highestStage: "F1A",
          firstFailedCoordinate: "WAITING_southComposeVisibleState",
          recommendedNextRenewalTarget: DESTINATION_FILE,
          northLooksStalledByPriorSouthError: false
        };
      }
    })();

    return composePacket(normalized, true, message || "South visible-state composition fallback used.");
  }

  function composeVisibleState(input = {}) {
    try {
      const normalized = normalizeVisibleInput(input);
      return composePacket(normalized, false, "");
    } catch (error) {
      return composeFallbackVisibleState(input, error);
    }
  }

  function composeReceiptState(input = {}) {
    return composeVisibleState(input);
  }

  function compose(input = {}) {
    return composeVisibleState(input);
  }

  function composeState(input = {}) {
    return composeVisibleState(input);
  }

  function composeCheckpointState(input = {}) {
    return composeVisibleState(input);
  }

  function composePostgameState(input = {}) {
    return composeVisibleState(input);
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      destinationFile: DESTINATION_FILE,
      status: "active",
      authority: "hearth-south-visible-state-composer",
      southFile: true,
      visibleStateComposer: true,
      composeVisibleStateExported: true,
      composeFallbackVisibleStateExported: true,
      composeReceiptStateExported: true,
      normalizeVisibleInputExported: true,
      compatibilityAliasesExported: true,
      nonThrowComposer: true,
      northOwnsCheckpointTruth: true,
      eastOwnsEventFlow: true,
      westOwnsInspectProof: true,
      canvasOwnsDrawing: true,
      southOwnsVisibleStateCompositionOnly: true,
      queuedEventsAreAuditNotFailure: true,
      archivedEventsAreAuditNotFailure: true,
      blockedEventsDoNotEraseProgress: true,
      progressCapBeforeF21: 98,
      readyTextRequiresCompletionLatch: true,
      f21RequiresF13NAndNews: true,
      expectedExports: [
        "composeVisibleState",
        "composeFallbackVisibleState",
        "composeReceiptState",
        "normalizeVisibleInput",
        "getReceipt"
      ],
      compatibilityExports: [
        "compose",
        "composeState",
        "composeCheckpointState",
        "composePostgameState"
      ],
      globalNamespaces: [
        "HEARTH_RUNTIME_TABLE_SOUTH",
        "HEARTH_SOUTH",
        "HEARTH_VISIBLE_STATE_COMPOSER",
        "DEXTER_LAB.runtimeTableSouth",
        "DEXTER_LAB.south",
        "DEXTER_LAB.visibleStateComposer"
      ],
      owns: [
        "visible-stage-composition",
        "visible-progress-composition",
        "visible-postgame-status-composition",
        "first-failed-coordinate-display-selection",
        "safe-receipt-visible-packet-generation"
      ],
      doesNotOwn: [
        "north-checkpoint-truth",
        "east-event-admission-truth",
        "west-inspect-truth",
        "canvas-boot",
        "canvas-drawing",
        "atlas-rendering",
        "source-channel-truth",
        "final-visual-pass-claim"
      ],
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    destinationFile: DESTINATION_FILE,

    composeVisibleState,
    composeFallbackVisibleState,
    composeReceiptState,
    normalizeVisibleInput,
    getReceipt,

    compose,
    composeState,
    composeCheckpointState,
    composePostgameState,

    southFile: true,
    visibleStateComposer: true,
    nonThrowComposer: true,
    queuedEventsAreAuditNotFailure: true,
    archivedEventsAreAuditNotFailure: true,
    blockedEventsDoNotEraseProgress: true,
    progressCapBeforeF21: 98,
    readyTextRequiresCompletionLatch: true,
    f21RequiresF13NAndNews: true,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  root.DEXTER_LAB = root.DEXTER_LAB || {};

  root.HEARTH_RUNTIME_TABLE_SOUTH = api;
  root.HEARTH_SOUTH = api;
  root.HEARTH_VISIBLE_STATE_COMPOSER = api;
  root.LAB_RUNTIME_TABLE_SOUTH = api;
  root.LAB_VISIBLE_STATE_COMPOSER_SOUTH = api;

  root.DEXTER_LAB.runtimeTableSouth = api;
  root.DEXTER_LAB.south = api;
  root.DEXTER_LAB.visibleStateComposer = api;

  if (root.DEXTER_LAB.runtimeTable && isObject(root.DEXTER_LAB.runtimeTable)) {
    root.DEXTER_LAB.runtimeTable.south = api;
    root.DEXTER_LAB.runtimeTable.visibleStateComposerSouth = api;
  }

  if (root.LAB_RUNTIME_TABLE && isObject(root.LAB_RUNTIME_TABLE)) {
    root.LAB_RUNTIME_TABLE.south = api;
    root.LAB_RUNTIME_TABLE.visibleStateComposerSouth = api;
  }

  if (root.document && root.document.documentElement) {
    const dataset = root.document.documentElement.dataset;

    dataset.hearthRuntimeTableSouthLoaded = "true";
    dataset.hearthRuntimeTableSouthContract = CONTRACT;
    dataset.hearthRuntimeTableSouthReceipt = RECEIPT;
    dataset.hearthRuntimeTableSouthVersion = VERSION;
    dataset.hearthSouthVisibleStateComposerLoaded = "true";
    dataset.hearthSouthComposeVisibleStateExported = "true";
    dataset.hearthSouthNonThrowComposer = "true";
    dataset.hearthSouthQueuedEventsAuditOnly = "true";
    dataset.hearthSouthArchivedEventsAuditOnly = "true";
    dataset.hearthSouthBlockedEventsDoNotEraseProgress = "true";
    dataset.hearthSouthReadyTextRequiresCompletionLatch = "true";
    dataset.hearthSouthProgressCapBeforeF21 = "98";
    dataset.hearthSouthF21RequiresF13NAndNews = "true";
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

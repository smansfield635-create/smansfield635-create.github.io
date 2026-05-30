// /assets/lab/runtime-table.south.js
// LAB_RUNTIME_TABLE_CARDINAL_SOUTH_TRANSMISSION_VISIBLE_STATE_COMPOSER_TNT_v1
// Full-file replacement.
// Canonical Dexter Lab South file.
// Purpose:
// - Compose visible UI state from North transmission/checkpoint authority.
// - Preserve the new transmission law: one active gear at a time.
// - Display the active gear from 0 -> 100 instead of cumulative route percentage.
// - Export composeVisibleState(), composeReceiptText(), and compatibility aliases expected by North/Hearth.
// - Prevent South receipt/composition failures from stalling North at F1A.
// - Treat queued, archived, duplicate, late, and progress-only events as audit information unless North/West marks them structurally blocking.
// Does not own:
// - North checkpoint truth
// - East event admission truth
// - West gap taxonomy / inspect proof
// - canvas boot
// - canvas drawing
// - atlas rendering
// - source/channel truth
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "LAB_RUNTIME_TABLE_CARDINAL_SOUTH_TRANSMISSION_VISIBLE_STATE_COMPOSER_TNT_v1";
  const RECEIPT = "LAB_RUNTIME_TABLE_CARDINAL_SOUTH_TRANSMISSION_VISIBLE_STATE_COMPOSER_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_SOUTH_VISIBLE_STATE_COMPOSER_API_HANDSHAKE_RECOVERY_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_SOUTH_VISIBLE_STATE_COMPOSER_API_HANDSHAKE_RECOVERY_PRECODE_FINAL_DRAFT_v1";
  const VERSION = "2026-05-29.lab-runtime-table-cardinal-south-transmission-visible-state-composer-v1";
  const DESTINATION_FILE = "/assets/lab/runtime-table.south.js";

  const root = typeof window !== "undefined" ? window : globalThis;

  const GEAR_SEQUENCE = Object.freeze([
    ["F1A_HTML_SHELL_RENDERED", 1, "F1A", "HTML_SHELL_RENDERED", "Ignition shell"],
    ["F1B_LOAD_LEDGER_INITIALIZED", 2, "F1B", "LOAD_LEDGER_INITIALIZED", "Ledger oil pressure"],
    ["F2_FIRST_PAINT_COCKPIT_VISIBLE", 3, "F2", "FIRST_PAINT_COCKPIT_VISIBLE", "First visible cockpit"],
    ["F3_SCRIPT_ORDER_COMPLETE", 4, "F3", "SCRIPT_ORDER_COMPLETE", "Script timing order"],
    ["F5_AUTHORITY_AVAILABILITY_READY", 5, "F5", "AUTHORITY_AVAILABILITY_READY", "Authority availability"],
    ["F8_CONDUCTOR_HYDRATED", 6, "F8", "CONDUCTOR_HYDRATED", "Conductor hydration"],
    ["F13A_CANVAS_COOPERATIVE_BOOT_STARTED", 7, "F13A", "CANVAS_COOPERATIVE_BOOT_STARTED", "Canvas cooperative boot"],
    ["F13B_CANVAS_MOUNT_CREATED", 8, "F13B", "CANVAS_MOUNT_CREATED", "Canvas mount"],
    ["F13C_CANVAS_CONTEXT_READY", 9, "F13C", "CANVAS_CONTEXT_READY", "Canvas context"],
    ["F13D_DRAG_INSPECTION_BOUND", 10, "F13D", "DRAG_INSPECTION_BOUND", "Drag inspection"],
    ["F13E_ATLAS_BUILD_STARTED", 11, "F13E", "ATLAS_BUILD_STARTED", "Atlas build start"],
    ["F13F_ATLAS_BUILD_COMPLETE", 12, "F13F", "ATLAS_BUILD_COMPLETE", "Atlas build closure"],
    ["F13G_TEXTURE_COMPOSE_STARTED", 13, "F13G", "TEXTURE_COMPOSE_STARTED", "Texture compose start"],
    ["F13H_TEXTURE_COMPOSE_COMPLETE", 14, "F13H", "TEXTURE_COMPOSE_COMPLETE", "Texture compose closure"],
    ["F13I_FIRST_FRAME_REQUESTED", 15, "F13I", "FIRST_FRAME_REQUESTED", "First frame request"],
    ["F13J_FIRST_FRAME_DETECTED", 16, "F13J", "FIRST_FRAME_DETECTED", "First frame detection"],
    ["F13K_CANVAS_READY", 17, "F13K", "CANVAS_READY", "Canvas ready"],
    ["F13L_VISIBLE_CONTENT_PROOF_STARTED", 18, "F13L", "VISIBLE_CONTENT_PROOF_STARTED", "Visible proof start"],
    ["F13M_VISIBLE_CONTENT_PROOF_PASSED", 19, "F13M", "VISIBLE_CONTENT_PROOF_PASSED", "Visible proof closure"],
    ["F13N_INSPECT_MODE_READY", 20, "F13N", "INSPECT_MODE_READY", "Inspect mode closure"],
    ["F21_COMPLETION_LATCHED", 21, "F21", "COMPLETION_LATCHED", "Final transmission latch"]
  ].map(([id, rank, fibonacci, event, label]) => ({
    id,
    rank,
    fibonacci,
    event,
    label,
    localProgressMin: 0,
    localProgressMax: 100
  })));

  const GEAR_BY_ID = GEAR_SEQUENCE.reduce((map, gear) => {
    map[gear.id] = gear;
    return map;
  }, {});

  const GEAR_BY_EVENT = GEAR_SEQUENCE.reduce((map, gear) => {
    map[gear.event] = gear;
    return map;
  }, {});

  const GEAR_BY_FIBONACCI = GEAR_SEQUENCE.reduce((map, gear) => {
    map[gear.fibonacci] = gear;
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
    if (value === "true" || value === "1" || value === 1) return true;
    if (value === "false" || value === "0" || value === 0) return false;
    return fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, safeNumber(value, min)));
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

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      return { ...value };
    }
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
      if (value !== undefined && value !== null && value !== "") return safeBool(value, fallback);
    }
    return fallback;
  }

  function firstNumber(fallback, ...values) {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== "") return safeNumber(value, fallback);
    }
    return fallback;
  }

  function findNestedReceipt(input, names) {
    for (const name of names) {
      const direct = objectValue(input, name);
      if (isObject(direct)) return direct;
    }

    return {};
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

  function gearFromIdEventOrStage(value) {
    if (!value) return null;

    const key = String(value);
    return (
      GEAR_BY_ID[key] ||
      GEAR_BY_EVENT[key] ||
      GEAR_BY_FIBONACCI[key] ||
      null
    );
  }

  function gearFromRank(rank) {
    const number = safeNumber(rank, 0);
    return GEAR_SEQUENCE.find((gear) => gear.rank === number) || null;
  }

  function inferGearFromEvidence(flat = {}) {
    if (safeBool(flat.completionLatched, false)) return GEAR_BY_ID.F21_COMPLETION_LATCHED;
    if (safeBool(flat.f21Allowed, false) || safeBool(flat.newsGatePassedBeforeF21, false)) return GEAR_BY_ID.F21_COMPLETION_LATCHED;

    if (
      safeBool(flat.inspectModeAvailable, false) ||
      safeBool(flat.inspectPlanetControlAvailable, false) ||
      safeBool(flat.diagnosticCanLeavePlanetFrame, false) ||
      safeBool(flat.buttonsReachable, false)
    ) {
      return GEAR_BY_ID.F13N_INSPECT_MODE_READY;
    }

    if (safeBool(flat.visibleContentProof, false)) return GEAR_BY_ID.F13M_VISIBLE_CONTENT_PROOF_PASSED;
    if (safeBool(flat.visibleContentProofStarted, false)) return GEAR_BY_ID.F13L_VISIBLE_CONTENT_PROOF_STARTED;
    if (safeBool(flat.canvasReady, false)) return GEAR_BY_ID.F13K_CANVAS_READY;
    if (safeBool(flat.firstFrameDetected, false)) return GEAR_BY_ID.F13J_FIRST_FRAME_DETECTED;
    if (safeBool(flat.firstFrameRequested, false)) return GEAR_BY_ID.F13I_FIRST_FRAME_REQUESTED;
    if (safeBool(flat.textureComposeComplete, false)) return GEAR_BY_ID.F13H_TEXTURE_COMPOSE_COMPLETE;
    if (safeBool(flat.textureComposeStarted, false)) return GEAR_BY_ID.F13G_TEXTURE_COMPOSE_STARTED;
    if (safeBool(flat.atlasBuildComplete, false)) return GEAR_BY_ID.F13F_ATLAS_BUILD_COMPLETE;
    if (safeBool(flat.atlasBuildStarted, false)) return GEAR_BY_ID.F13E_ATLAS_BUILD_STARTED;
    if (safeBool(flat.dragInspectionBound, false)) return GEAR_BY_ID.F13D_DRAG_INSPECTION_BOUND;
    if (safeBool(flat.canvasContextReady, false)) return GEAR_BY_ID.F13C_CANVAS_CONTEXT_READY;
    if (safeBool(flat.canvasCarrierMounted, false) || safeBool(flat.canvasMountCreated, false)) return GEAR_BY_ID.F13B_CANVAS_MOUNT_CREATED;
    if (safeBool(flat.canvasCarrierRequested, false) || safeBool(flat.canvasBootStarted, false)) return GEAR_BY_ID.F13A_CANVAS_COOPERATIVE_BOOT_STARTED;
    if (safeBool(flat.conductorHydrated, false)) return GEAR_BY_ID.F8_CONDUCTOR_HYDRATED;
    if (safeBool(flat.authorityAvailabilityReady, false)) return GEAR_BY_ID.F5_AUTHORITY_AVAILABILITY_READY;
    if (safeBool(flat.scriptOrderVisible, false) || safeBool(flat.scriptOrderComplete, false)) return GEAR_BY_ID.F3_SCRIPT_ORDER_COMPLETE;
    if (safeBool(flat.cockpitReady, false) || safeBool(flat.firstPaintReady, false)) return GEAR_BY_ID.F2_FIRST_PAINT_COCKPIT_VISIBLE;
    if (safeBool(flat.sharedLedgerPresent, false) || safeBool(flat.loadLedgerInitialized, false)) return GEAR_BY_ID.F1B_LOAD_LEDGER_INITIALIZED;

    return GEAR_BY_ID.F1A_HTML_SHELL_RENDERED;
  }

  function hasVisibleSurfaceSignal(flat = {}) {
    const classCount = firstNumber(0, flat.visibleContentClassCount);
    const land = firstNumber(0, flat.visibleContentLandSampleCount);
    const water = firstNumber(0, flat.visibleContentWaterSampleCount);
    const other = firstNumber(0, flat.visibleContentOtherSampleCount);

    return Boolean(
      firstBool(false, flat.canvasReady) &&
      firstBool(false, flat.firstFrameDetected) &&
      firstBool(false, flat.imageRendered) &&
      firstBool(false, flat.textureComposeComplete) &&
      firstBool(false, flat.nonblankPlanetVisible) &&
      (classCount > 0 || land > 0 || water > 0 || other > 0)
    );
  }

  function hasInspectFallbackSignal(flat = {}) {
    return Boolean(
      firstBool(false, flat.copyDiagnosticPreserved) &&
      firstBool(false, flat.receiptToggleReady) &&
      firstBool(false, flat.diagnosticDockRestorable)
    );
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

    const activeInput = isObject(source.active) ? source.active : {};
    const highestInput = isObject(source.highestCompleted) ? source.highestCompleted : {};
    const latestGap = isObject(source.latestGap) ? source.latestGap : findNestedReceipt(source, ["latestGap", "gap", "westGap"]);

    const activeGear =
      gearFromIdEventOrStage(firstDefined(
        source.activeGearId,
        activeInput.id,
        activeInput.event,
        flat.activeGearId,
        flat.activeCheckpointId,
        flat.activeCheckpoint,
        flat.currentCheckpointId,
        flat.latestVisibleEvent,
        flat.currentStage,
        flat.activeFibonacciStage
      )) ||
      gearFromRank(firstDefined(source.activeGearRank, activeInput.rank, flat.activeGearRank, flat.activeCheckpointRank)) ||
      inferGearFromEvidence(flat);

    const completedCheckpoints = asArray(firstDefined(
      flat.completedCheckpoints,
      objectValue(north, "completedCheckpoints")
    ));

    const highestCompletedGear =
      gearFromIdEventOrStage(firstDefined(
        source.highestCompletedGearId,
        highestInput.id,
        highestInput.event,
        flat.highestCompletedCheckpointId,
        flat.highestCompletedGearId,
        flat.highestStage
      )) ||
      gearFromRank(firstDefined(source.highestCompletedGearRank, highestInput.rank, flat.highestCompletedRank)) ||
      gearFromIdEventOrStage(completedCheckpoints[completedCheckpoints.length - 1]) ||
      null;

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

    const northGateDegradedReady = firstBool(
      Boolean(northGateReady || (canvasReady && atlasBuildComplete && textureComposeComplete && imageRendered && firstFrameDetected && firstBool(false, flat.nonblankPlanetVisible, canvas.nonblankPlanetVisible) && hasVisibleSurfaceSignal(flat))),
      flat.northGateDegradedReady,
      objectValue(north, "northGateDegradedReady"),
      objectValue(north, "newsGateState.northGateDegradedReady")
    );

    const westGateDegradedReady = firstBool(
      Boolean(westGateReady || hasInspectFallbackSignal(flat)),
      flat.westGateDegradedReady,
      objectValue(north, "westGateDegradedReady"),
      objectValue(north, "newsGateState.westGateDegradedReady")
    );

    const southGateDegradedReady = firstBool(
      Boolean(southGateReady || (imageRendered && firstFrameDetected && firstBool(false, flat.dragInspectionBound, canvas.dragInspectionBound) && firstBool(false, flat.nonblankPlanetVisible, canvas.nonblankPlanetVisible))),
      flat.southGateDegradedReady,
      objectValue(north, "southGateDegradedReady"),
      objectValue(north, "newsGateState.southGateDegradedReady")
    );

    const newsGatePassedBeforeF21 = firstBool(
      Boolean(northGateReady && eastGateReady && westGateReady && southGateReady),
      flat.newsGatePassedBeforeF21,
      objectValue(north, "newsGatePassedBeforeF21"),
      objectValue(north, "newsGateState.newsGatePassedBeforeF21")
    );

    const newsGateDegradedBeforeF21 = firstBool(
      Boolean(northGateDegradedReady && eastGateReady && westGateDegradedReady && southGateDegradedReady),
      flat.newsGateDegradedBeforeF21,
      objectValue(north, "newsGateDegradedBeforeF21"),
      objectValue(north, "newsGateState.newsGateDegradedBeforeF21")
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

    const f21DegradedAllowed = firstBool(
      Boolean(f13SubsequenceComplete && newsGateDegradedBeforeF21),
      flat.f21DegradedAllowed,
      objectValue(north, "f21DegradedAllowed")
    );

    const completionLatched = firstBool(
      Boolean(completedCheckpoints.includes("F21_COMPLETION_LATCHED") && (f21Allowed || f21DegradedAllowed)),
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
      latestGap: clonePlain(latestGap),
      flat: clonePlain(flat),

      activeGear,
      highestCompletedGear,
      completedCheckpoints,

      queuedEventsCount: firstNumber(0, flat.queuedEventsCount, objectValue(north, "queuedEventsCount")),
      archivedEventsCount: firstNumber(0, flat.archivedEventsCount, objectValue(north, "archivedEventsCount")),
      blockedEventsCount: firstNumber(0, flat.blockedEventsCount, objectValue(north, "blockedEventsCount")),
      admittedEventsCount: firstNumber(0, flat.admittedEventsCount, objectValue(north, "admittedEventsCount")),
      degradedForwardEventsCount: firstNumber(0, flat.degradedForwardEventsCount, objectValue(north, "degradedForwardEventsCount")),
      regressionPrevented: firstNumber(0, flat.regressionPrevented, objectValue(north, "regressionPrevented")),
      futureEventsQueuedCount: firstNumber(0, flat.futureEventsQueuedCount, objectValue(north, "futureEventsQueuedCount")),
      duplicateEventsArchived: firstNumber(0, flat.duplicateEventsArchived, objectValue(north, "duplicateEventsArchived")),
      progressOnlyEventsArchivedCount: firstNumber(0, flat.progressOnlyEventsArchivedCount, objectValue(north, "progressOnlyEventsArchivedCount")),

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
      canvasContextReady: firstBool(false, flat.canvasContextReady, canvas.canvasContextReady),
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
      northGateDegradedReady,
      westGateDegradedReady,
      southGateDegradedReady,
      newsGatePassedBeforeF21,
      newsGateDegradedBeforeF21,

      f13SubsequenceComplete,
      f13LastRequiredEvent: firstString(flat.f13LastRequiredEvent, objectValue(north, "f13LastRequiredEvent")),
      f21Allowed,
      f21DegradedAllowed,
      completionLatched,
      degradedCompletionLatched: firstBool(false, flat.degradedCompletionLatched, objectValue(north, "degradedCompletionLatched")),

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

  function gearBooleanComplete(normalized, gear) {
    if (!gear) return false;

    const flat = normalized.flat || {};

    if (normalized.completedCheckpoints.includes(gear.id)) return true;

    switch (gear.id) {
      case "F1A_HTML_SHELL_RENDERED":
        return firstBool(false, flat.htmlShellRendered, flat.shellRendered, flat.routeMounted);

      case "F1B_LOAD_LEDGER_INITIALIZED":
        return firstBool(false, flat.loadLedgerInitialized, flat.sharedLedgerPresent);

      case "F2_FIRST_PAINT_COCKPIT_VISIBLE":
        return firstBool(false, flat.firstPaintCockpitVisible, flat.firstPaintReady, flat.cockpitReady, flat.loadingScreenReady);

      case "F3_SCRIPT_ORDER_COMPLETE":
        return firstBool(false, flat.scriptOrderComplete, flat.scriptOrderVisible);

      case "F5_AUTHORITY_AVAILABILITY_READY":
        return firstBool(false, flat.authorityAvailabilityReady, flat.runtimeTablePresent, flat.northAvailable);

      case "F8_CONDUCTOR_HYDRATED":
        return firstBool(false, flat.conductorHydrated, flat.coherenceSemiconductorBooted, flat.southGlobalPresent);

      case "F13A_CANVAS_COOPERATIVE_BOOT_STARTED":
        return normalized.canvasCarrierRequested || firstBool(false, flat.canvasBootStarted);

      case "F13B_CANVAS_MOUNT_CREATED":
        return normalized.canvasCarrierMounted;

      case "F13C_CANVAS_CONTEXT_READY":
        return normalized.canvasContextReady;

      case "F13D_DRAG_INSPECTION_BOUND":
        return normalized.dragInspectionBound;

      case "F13E_ATLAS_BUILD_STARTED":
        return normalized.atlasBuildStarted;

      case "F13F_ATLAS_BUILD_COMPLETE":
        return normalized.atlasBuildComplete;

      case "F13G_TEXTURE_COMPOSE_STARTED":
        return normalized.textureComposeStarted;

      case "F13H_TEXTURE_COMPOSE_COMPLETE":
        return normalized.textureComposeComplete;

      case "F13I_FIRST_FRAME_REQUESTED":
        return normalized.firstFrameRequested;

      case "F13J_FIRST_FRAME_DETECTED":
        return normalized.firstFrameDetected;

      case "F13K_CANVAS_READY":
        return normalized.canvasReady;

      case "F13L_VISIBLE_CONTENT_PROOF_STARTED":
        return normalized.visibleContentProofStarted || normalized.visibleContentProof;

      case "F13M_VISIBLE_CONTENT_PROOF_PASSED":
        return normalized.visibleContentProof || hasVisibleSurfaceSignal(normalized.flat);

      case "F13N_INSPECT_MODE_READY":
        return Boolean(
          (normalized.inspectModeAvailable &&
            normalized.inspectPlanetControlAvailable &&
            normalized.diagnosticCanLeavePlanetFrame &&
            normalized.buttonsReachable) ||
          hasInspectFallbackSignal(normalized.flat)
        );

      case "F21_COMPLETION_LATCHED":
        return normalized.completionLatched === true;

      default:
        return false;
    }
  }

  function localProgressFromGear(normalized, gear) {
    const flat = normalized.flat || {};

    const explicit = firstDefined(
      flat.activeGearLocalProgress,
      flat.gearLocalProgress,
      flat.localProgress,
      flat.currentGearProgress,
      objectValue(normalized.north, "activeGearLocalProgress")
    );

    if (explicit !== undefined) {
      return clamp(explicit, 0, 100);
    }

    if (normalized.completionLatched && gear.id === "F21_COMPLETION_LATCHED") return 100;

    if (gearBooleanComplete(normalized, gear)) return 100;

    switch (gear.id) {
      case "F1A_HTML_SHELL_RENDERED":
        return firstBool(false, flat.routeMounted) ? 75 : 20;

      case "F1B_LOAD_LEDGER_INITIALIZED":
        return firstBool(false, flat.sharedLedgerPresent) ? 75 : 18;

      case "F2_FIRST_PAINT_COCKPIT_VISIBLE":
        return firstBool(false, flat.cockpitFound, flat.cockpitHydrated) ? 65 : 22;

      case "F3_SCRIPT_ORDER_COMPLETE":
        return firstBool(false, flat.scriptOrderVisible) ? 70 : 25;

      case "F5_AUTHORITY_AVAILABILITY_READY":
        return firstBool(false, flat.northAvailable, flat.runtimeTablePresent) ? 75 : 30;

      case "F8_CONDUCTOR_HYDRATED":
        return firstBool(false, flat.southGlobalPresent, flat.conductorHydrated) ? 75 : 35;

      case "F13A_CANVAS_COOPERATIVE_BOOT_STARTED":
        if (normalized.canvasCarrierHandoffOk) return 90;
        if (normalized.canvasCarrierRequested) return 70;
        return 24;

      case "F13B_CANVAS_MOUNT_CREATED":
        return normalized.canvasCarrierMounted ? 100 : 42;

      case "F13C_CANVAS_CONTEXT_READY":
        return normalized.canvasContextReady ? 100 : 42;

      case "F13D_DRAG_INSPECTION_BOUND":
        return normalized.dragInspectionBound ? 100 : 42;

      case "F13E_ATLAS_BUILD_STARTED":
        return normalized.atlasBuildStarted ? 100 : 38;

      case "F13F_ATLAS_BUILD_COMPLETE":
        return clamp(normalized.atlasBuildProgress, 0, 100);

      case "F13G_TEXTURE_COMPOSE_STARTED":
        return normalized.textureComposeStarted ? 100 : 38;

      case "F13H_TEXTURE_COMPOSE_COMPLETE":
        return clamp(normalized.textureComposeProgress, 0, 100);

      case "F13I_FIRST_FRAME_REQUESTED":
        return normalized.firstFrameRequested ? 100 : 46;

      case "F13J_FIRST_FRAME_DETECTED":
        return normalized.firstFrameDetected ? 100 : 46;

      case "F13K_CANVAS_READY":
        if (normalized.canvasReady) return 100;
        if (normalized.imageRendered && normalized.firstFrameDetected) return 85;
        return 52;

      case "F13L_VISIBLE_CONTENT_PROOF_STARTED":
        return normalized.visibleContentProofStarted || normalized.visibleContentProof ? 100 : 36;

      case "F13M_VISIBLE_CONTENT_PROOF_PASSED":
        if (normalized.visibleContentProof) return 100;
        if (hasVisibleSurfaceSignal(normalized.flat)) return 100;
        if (normalized.visibleContentProofStarted) return 58;
        if (normalized.nonblankPlanetVisible) return 48;
        return 24;

      case "F13N_INSPECT_MODE_READY":
        if (
          normalized.inspectModeAvailable &&
          normalized.inspectPlanetControlAvailable &&
          normalized.diagnosticCanLeavePlanetFrame &&
          normalized.buttonsReachable
        ) {
          return 100;
        }

        if (hasInspectFallbackSignal(normalized.flat)) return 100;

        if (normalized.copyDiagnosticPreserved && normalized.receiptToggleReady) return 68;
        if (normalized.diagnosticDockRestorable) return 46;
        return 24;

      case "F21_COMPLETION_LATCHED":
        if (normalized.completionLatched) return 100;
        if (normalized.f21Allowed || normalized.f21DegradedAllowed) return 92;
        if (normalized.f13SubsequenceComplete) return 72;
        return 38;

      default:
        return 0;
    }
  }

  function resolveGearState(normalized) {
    const gear = normalized.activeGear || GEAR_BY_ID.F1A_HTML_SHELL_RENDERED;
    const gap = normalized.latestGap || {};
    const hardBlocked = firstBool(false, gap.hardBlock, gap.hardBlocked, normalized.flat && normalized.flat.hardBlocked);
    const degraded = Boolean(
      firstBool(false, gap.canDegradeForward, normalized.degradedCompletionLatched) ||
      normalized.degradedCompletionLatched ||
      (gear.id === "F13M_VISIBLE_CONTENT_PROOF_PASSED" && !normalized.visibleContentProof && hasVisibleSurfaceSignal(normalized.flat)) ||
      (gear.id === "F13N_INSPECT_MODE_READY" && hasInspectFallbackSignal(normalized.flat) && !normalized.buttonsReachable)
    );

    const gearComplete = gearBooleanComplete(normalized, gear);
    const localProgressRaw = localProgressFromGear(normalized, gear);
    const progressCap = hardBlocked && !normalized.completionLatched ? 98 : 100;
    const localProgress = normalized.completionLatched
      ? 100
      : clamp(localProgressRaw, 0, progressCap);

    const shiftAllowed = Boolean(
      normalized.completionLatched ||
      (gearComplete && !hardBlocked)
    );

    return {
      gear,
      localProgress,
      progressCap,
      gearComplete,
      gearShiftAllowed: shiftAllowed,
      hardBlocked,
      degraded,
      gearStatus:
        normalized.completionLatched ? "FINAL_LATCHED" :
          hardBlocked ? "BLOCKED" :
            degraded && gearComplete ? "DEGRADED_COMPLETE" :
              gearComplete ? "GEAR_COMPLETE_AWAITING_NORTH_SHIFT" :
                "ACTIVE"
    };
  }

  function resolveFirstFailedCoordinate(normalized, gearState, southCompositionFailed) {
    if (southCompositionFailed) return "WAITING_southComposeVisibleState";

    const gap = normalized.latestGap || {};
    if (gap.firstFailedCoordinate) return String(gap.firstFailedCoordinate);

    if (normalized.completionLatched) return gearState.degraded ? "DEGRADED_F21_LATCHED_WITH_GAP_RECEIPT" : "NONE_F21_FULL_LATCHED";

    if (gearState.hardBlocked) return "STRUCTURAL_OR_FALSE_COMPLETION_BLOCK_HELD_BY_NORTH";

    if (gearState.gearComplete && !gearState.gearShiftAllowed) return `WAITING_NORTH_SHIFT_FROM_${gearState.gear.id}`;

    if (!normalized.visibleContentProof && gearState.gear.rank >= GEAR_BY_ID.F13M_VISIBLE_CONTENT_PROOF_PASSED.rank) {
      return "WAITING_VISIBLE_CONTENT_PROOF_PASSED";
    }

    if (gearState.gear.id === "F13N_INSPECT_MODE_READY") {
      if (!normalized.inspectModeAvailable) return "WAITING_inspectModeAvailable";
      if (!normalized.inspectPlanetControlAvailable) return "WAITING_inspectPlanetControlAvailable";
      if (!normalized.diagnosticCanLeavePlanetFrame) return "WAITING_diagnosticCanLeavePlanetFrame";
      if (!normalized.buttonsReachable) return "WAITING_buttonsReachable";
    }

    if (gearState.gear.id === "F21_COMPLETION_LATCHED") {
      if (!normalized.f13SubsequenceComplete) return "WAITING_F13N_BEFORE_F21";
      if (!normalized.newsGatePassedBeforeF21 && !normalized.newsGateDegradedBeforeF21) return "WAITING_NEWS_GATES_BEFORE_F21";
      if (!normalized.completionLatched) return "WAITING_completionLatch";
    }

    return `WAITING_${gearState.gear.id}`;
  }

  function resolveRenewalTarget(firstFailedCoordinate, normalized) {
    const gap = normalized.latestGap || {};
    if (gap.recommendedNextRenewalTarget) return String(gap.recommendedNextRenewalTarget);

    if (firstFailedCoordinate === "WAITING_southComposeVisibleState") return DESTINATION_FILE;

    if (
      firstFailedCoordinate === "WAITING_VISIBLE_CONTENT_PROOF_PASSED" ||
      firstFailedCoordinate === "VISIBLE_CONTENT_ABSENT"
    ) {
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

    if (
      firstFailedCoordinate === "NONE_F21_FULL_LATCHED" ||
      firstFailedCoordinate === "DEGRADED_F21_LATCHED_WITH_GAP_RECEIPT"
    ) {
      return "read-postgame-canvas-or-triple-g-receipt";
    }

    return "/showroom/globe/hearth/hearth.js";
  }

  function resolvePostgameStatus(normalized, gearState, southCompositionFailed) {
    if (southCompositionFailed) return "SOUTH_VISIBLE_STATE_FALLBACK_ACTIVE";
    if (normalized.completionLatched && !gearState.degraded) return "READY_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE";
    if (normalized.completionLatched && gearState.degraded) return "READY_DEGRADED_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE";
    if (gearState.hardBlocked) return "BLOCKED_BY_TRANSMISSION_CHECKPOINT";
    if (gearState.gearComplete && gearState.degraded) return "GEAR_DEGRADED_COMPLETE_WAITING_NORTH_SHIFT";
    if (gearState.gearComplete) return "GEAR_COMPLETE_WAITING_NORTH_SHIFT";
    if (normalized.queuedEventsCount > 0) return "ACTIVE_GEAR_WITH_QUEUED_FUTURE_EVENTS";
    if (normalized.archivedEventsCount > 0 || normalized.progressOnlyEventsArchivedCount > 0) return "ACTIVE_GEAR_WITH_ARCHIVED_AUDIT_EVENTS";
    return "ACTIVE_TRANSMISSION_GEAR_LOADING";
  }

  function resolveVisibleStatusText(normalized, gearState, postgameStatus) {
    if (postgameStatus === "READY_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE") return "Ready";
    if (postgameStatus === "READY_DEGRADED_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE") return "Ready with diagnostic gaps";
    if (postgameStatus === "BLOCKED_BY_TRANSMISSION_CHECKPOINT") return "Blocked by structural checkpoint";
    if (postgameStatus === "GEAR_DEGRADED_COMPLETE_WAITING_NORTH_SHIFT") return "Gear complete with diagnostic gap; waiting for North shift";
    if (postgameStatus === "GEAR_COMPLETE_WAITING_NORTH_SHIFT") return "Gear complete; waiting for North shift";
    if (postgameStatus === "ACTIVE_GEAR_WITH_QUEUED_FUTURE_EVENTS") return "Loading active gear; future events queued";
    if (postgameStatus === "ACTIVE_GEAR_WITH_ARCHIVED_AUDIT_EVENTS") return "Loading active gear; late events archived";
    return `Loading ${gearState.gear.label}`;
  }

  function composePacket(normalized, southCompositionFailed = false, southCompositionError = "") {
    const gearState = resolveGearState(normalized);
    const firstFailedCoordinate = resolveFirstFailedCoordinate(normalized, gearState, southCompositionFailed);
    const recommendedNextRenewalTarget = resolveRenewalTarget(firstFailedCoordinate, normalized);
    const postgameStatus = resolvePostgameStatus(normalized, gearState, southCompositionFailed);
    const visibleStatusText = resolveVisibleStatusText(normalized, gearState, postgameStatus);

    const gear = gearState.gear;
    const highestCompletedGear = normalized.highestCompletedGear || null;

    const finalReceiptAvailable = normalized.completionLatched ? true : normalized.finalReceiptAvailable;
    const readyTextAllowed = Boolean(normalized.completionLatched);
    const diagnosticCockpitReady = Boolean(normalized.visiblePlanetAvailable || normalized.partialReceiptAvailable || normalized.copyDiagnosticPreserved || normalized.receiptToggleReady);
    const cockpitMode = normalized.visiblePlanetAvailable || normalized.completionLatched ? "diagnostic-dock" : "loading-cockpit";

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: DESTINATION_FILE,
      role: "south-transmission-visible-state-composer",

      southAuthority: true,
      southLoaded: true,
      southFallbackUsed: southCompositionFailed,
      southCompositionOk: !southCompositionFailed,
      southCompositionError: southCompositionError || "",
      visibleStateRecoverable: true,

      transmissionMode: true,
      oneActiveGearAtATime: true,
      localGearProgressModel: true,
      cumulativeProgressModel: false,
      activeGearOwnsVisibleProgress: true,

      activeGearId: gear.id,
      activeGearRank: gear.rank,
      activeGearFibonacci: gear.fibonacci,
      activeGearEvent: gear.event,
      activeGearLabel: gear.label,
      activeGearLocalProgress: gearState.localProgress,
      activeGearProgressCap: gearState.progressCap,
      activeGearComplete: gearState.gearComplete,
      activeGearShiftAllowed: gearState.gearShiftAllowed,
      activeGearStatus: gearState.gearStatus,

      activeCheckpointId: gear.id,
      activeCheckpointRank: gear.rank,
      activeCheckpointLabel: gear.label,
      activeFibonacciStage: gear.fibonacci,
      currentStage: gear.fibonacci,

      highestCompletedGearId: highestCompletedGear ? highestCompletedGear.id : "",
      highestCompletedCheckpointId: highestCompletedGear ? highestCompletedGear.id : "",
      highestCompletedRank: highestCompletedGear ? highestCompletedGear.rank : 0,
      highestStage: highestCompletedGear ? highestCompletedGear.fibonacci : normalized.highestStage || gear.fibonacci,

      latestVisibleEvent: normalized.completionLatched ? "COMPLETION_LATCHED" : gear.event,
      visibleLoadingActive: !normalized.completionLatched,
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
      visibleStatusText,
      firstFailedCoordinate,
      recommendedNextRenewalTarget,

      mainDisplayProgress: gearState.localProgress,
      mainProgressCap: gearState.progressCap,
      visibleProgress: gearState.localProgress,
      progressCap: gearState.progressCap,
      readyTextAllowed,
      completionLatched: normalized.completionLatched,

      hardBlocked: gearState.hardBlocked,
      degradedGear: gearState.degraded,
      degradedCompletionLatched: normalized.degradedCompletionLatched || (normalized.completionLatched && gearState.degraded),

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
      northGateDegradedReady: normalized.northGateDegradedReady,
      westGateDegradedReady: normalized.westGateDegradedReady,
      southGateDegradedReady: normalized.southGateDegradedReady,
      newsGatePassedBeforeF21: normalized.newsGatePassedBeforeF21,
      newsGateDegradedBeforeF21: normalized.newsGateDegradedBeforeF21,

      f13SubsequenceComplete: normalized.f13SubsequenceComplete,
      f13LastRequiredEvent: normalized.f13LastRequiredEvent,
      f21Allowed: normalized.f21Allowed,
      f21DegradedAllowed: normalized.f21DegradedAllowed,
      f21AfterF13N: normalized.f13SubsequenceComplete && (normalized.f21Allowed || normalized.f21DegradedAllowed),

      queuedEventsCount: normalized.queuedEventsCount,
      archivedEventsCount: normalized.archivedEventsCount,
      blockedEventsCount: normalized.blockedEventsCount,
      admittedEventsCount: normalized.admittedEventsCount,
      degradedForwardEventsCount: normalized.degradedForwardEventsCount,
      regressionPrevented: normalized.regressionPrevented,
      futureEventsQueuedCount: normalized.futureEventsQueuedCount,
      duplicateEventsArchived: normalized.duplicateEventsArchived,
      progressOnlyEventsArchivedCount: normalized.progressOnlyEventsArchivedCount,
      queuedEventsAreAuditNotFailure: true,
      archivedEventsAreAuditNotFailure: true,
      duplicateEventsAreAuditNotFailure: true,
      progressOnlyEventsAreAuditNotFailure: true,

      canvasReady: normalized.canvasReady,
      canvasCarrierMounted: normalized.canvasCarrierMounted,
      canvasContextReady: normalized.canvasContextReady,
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

  function defaultNormalizedFallback(input = {}) {
    const flat = isObject(input) ? input : {};

    return {
      source: clonePlain(flat),
      north: {},
      east: {},
      west: {},
      canvas: {},
      runtime: {},
      latestGap: {},
      flat: clonePlain(flat),
      activeGear: GEAR_BY_ID.F1A_HTML_SHELL_RENDERED,
      highestCompletedGear: null,
      completedCheckpoints: [],
      queuedEventsCount: 0,
      archivedEventsCount: 0,
      blockedEventsCount: 0,
      admittedEventsCount: 0,
      degradedForwardEventsCount: 0,
      regressionPrevented: 0,
      futureEventsQueuedCount: 0,
      duplicateEventsArchived: 0,
      progressOnlyEventsArchivedCount: 0,

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
      canvasContextReady: false,
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
      northGateDegradedReady: false,
      westGateDegradedReady: false,
      southGateDegradedReady: false,
      newsGatePassedBeforeF21: false,
      newsGateDegradedBeforeF21: false,

      f13SubsequenceComplete: false,
      f13LastRequiredEvent: "",
      f21Allowed: false,
      f21DegradedAllowed: false,
      completionLatched: false,
      degradedCompletionLatched: false,

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
      recommendedNextRenewalTarget: DESTINATION_FILE
    };
  }

  function composeFallbackVisibleState(input = {}, error = null) {
    const message = error && error.message ? error.message : safeString(error, "South visible-state fallback used.");

    let normalized;
    try {
      normalized = normalizeVisibleInput(input);
    } catch (_error) {
      normalized = defaultNormalizedFallback(input);
    }

    return composePacket(normalized, true, message);
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

  function composeTransmissionState(input = {}) {
    return composeVisibleState(input);
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function composeReceiptText(receipt = {}) {
    const packet = isObject(receipt) ? receipt : {};
    const sequenceText = GEAR_SEQUENCE.map((gear) => {
      const active = packet.activeGearId === gear.id || packet.activeCheckpointId === gear.id;
      const complete = asArray(packet.completedCheckpoints).includes(gear.id) || packet.highestCompletedCheckpointId === gear.id || packet.completionLatched === true && gear.id === "F21_COMPLETION_LATCHED";
      return `- ${gear.id}: rank=${gear.rank}; fibonacci=${gear.fibonacci}; event=${gear.event}; active=${active}; complete=${complete}; label=${gear.label}`;
    }).join("\n");

    return [
      "LAB_RUNTIME_TABLE_CARDINAL_SOUTH_TRANSMISSION_VISIBLE_STATE_COMPOSER_RECEIPT",
      "",
      line("contract", packet.contract || CONTRACT),
      line("receipt", packet.receipt || RECEIPT),
      line("previousContract", PREVIOUS_CONTRACT),
      line("baselineContract", BASELINE_CONTRACT),
      line("version", VERSION),
      line("file", DESTINATION_FILE),
      line("role", packet.role || "south-transmission-visible-state-composer"),
      "",
      line("southAuthority", true),
      line("southLoaded", true),
      line("southCompositionOk", packet.southCompositionOk !== false),
      line("southFallbackUsed", packet.southFallbackUsed === true),
      line("southCompositionError", packet.southCompositionError || ""),
      "",
      line("transmissionMode", true),
      line("oneActiveGearAtATime", true),
      line("localGearProgressModel", true),
      line("cumulativeProgressModel", false),
      line("activeGearOwnsVisibleProgress", true),
      "",
      line("activeGearId", packet.activeGearId || packet.activeCheckpointId || ""),
      line("activeGearRank", packet.activeGearRank || packet.activeCheckpointRank || ""),
      line("activeGearFibonacci", packet.activeGearFibonacci || packet.activeFibonacciStage || ""),
      line("activeGearEvent", packet.activeGearEvent || ""),
      line("activeGearLabel", packet.activeGearLabel || packet.activeCheckpointLabel || ""),
      line("activeGearLocalProgress", packet.activeGearLocalProgress ?? packet.visibleProgress ?? packet.mainDisplayProgress ?? ""),
      line("activeGearProgressCap", packet.activeGearProgressCap ?? packet.progressCap ?? packet.mainProgressCap ?? ""),
      line("activeGearComplete", packet.activeGearComplete === true),
      line("activeGearShiftAllowed", packet.activeGearShiftAllowed === true),
      line("activeGearStatus", packet.activeGearStatus || ""),
      "",
      line("completionLatched", packet.completionLatched === true),
      line("degradedCompletionLatched", packet.degradedCompletionLatched === true),
      line("readyTextAllowed", packet.readyTextAllowed === true),
      line("visibleStatusText", packet.visibleStatusText || ""),
      line("postgameStatus", packet.postgameStatus || ""),
      line("firstFailedCoordinate", packet.firstFailedCoordinate || ""),
      line("recommendedNextRenewalTarget", packet.recommendedNextRenewalTarget || ""),
      "",
      line("northGateReady", packet.northGateReady === true),
      line("eastGateReady", packet.eastGateReady === true),
      line("westGateReady", packet.westGateReady === true),
      line("southGateReady", packet.southGateReady === true),
      line("newsGatePassedBeforeF21", packet.newsGatePassedBeforeF21 === true),
      line("newsGateDegradedBeforeF21", packet.newsGateDegradedBeforeF21 === true),
      line("f13SubsequenceComplete", packet.f13SubsequenceComplete === true),
      line("f21Allowed", packet.f21Allowed === true),
      line("f21DegradedAllowed", packet.f21DegradedAllowed === true),
      "",
      line("visibleContentProof", packet.visibleContentProof === true),
      line("visiblePlanetAvailable", packet.visiblePlanetAvailable === true),
      line("inspectModeAvailable", packet.inspectModeAvailable === true),
      line("diagnosticCanLeavePlanetFrame", packet.diagnosticCanLeavePlanetFrame === true),
      line("buttonsReachable", packet.buttonsReachable === true),
      "",
      line("queuedEventsCount", packet.queuedEventsCount || 0),
      line("archivedEventsCount", packet.archivedEventsCount || 0),
      line("blockedEventsCount", packet.blockedEventsCount || 0),
      line("progressOnlyEventsArchivedCount", packet.progressOnlyEventsArchivedCount || 0),
      line("queuedEventsAreAuditNotFailure", true),
      line("archivedEventsAreAuditNotFailure", true),
      line("duplicateEventsAreAuditNotFailure", true),
      "",
      "GEAR_SEQUENCE",
      sequenceText,
      "",
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false),
      line("visualPassClaimed", false),
      line("updatedAt", nowIso())
    ].join("\n");
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
      authority: "lab-runtime-table-cardinal-south-transmission-visible-state-composer",

      southAuthority: true,
      southLoaded: true,
      southFallbackUsed: false,
      visibleStateComposer: true,
      composeVisibleStateExported: true,
      composeFallbackVisibleStateExported: true,
      composeReceiptStateExported: true,
      composeReceiptTextExported: true,
      normalizeVisibleInputExported: true,
      compatibilityAliasesExported: true,
      nonThrowComposer: true,

      transmissionMode: true,
      oneActiveGearAtATime: true,
      localGearProgressModel: true,
      cumulativeProgressModel: false,
      activeGearOwnsVisibleProgress: true,
      activeGearProgressRange: "0_to_100",
      progressCapBeforeF21HardBlock: 98,
      readyTextRequiresCompletionLatch: true,
      f21RequiresF13NAndNews: true,

      northOwnsCheckpointTruth: true,
      eastOwnsEventFlow: true,
      westOwnsInspectProof: true,
      canvasOwnsDrawing: true,
      southOwnsVisibleStateCompositionOnly: true,

      queuedEventsAreAuditNotFailure: true,
      archivedEventsAreAuditNotFailure: true,
      duplicateEventsAreAuditNotFailure: true,
      progressOnlyEventsAreAuditNotFailure: true,
      blockedEventsDoNotEraseProgress: true,

      expectedExports: [
        "composeVisibleState",
        "composeFallbackVisibleState",
        "composeReceiptState",
        "composeReceiptText",
        "normalizeVisibleInput",
        "getReceipt"
      ],
      compatibilityExports: [
        "compose",
        "composeState",
        "composeCheckpointState",
        "composePostgameState",
        "composeTransmissionState"
      ],
      globalNamespaces: [
        "LAB_RUNTIME_TABLE_SOUTH",
        "RUNTIME_TABLE_SOUTH",
        "DEXTER_LAB_RUNTIME_TABLE_SOUTH",
        "LAB_CARDINAL_RUNTIME_TABLE_SOUTH",
        "HEARTH_RUNTIME_TABLE_SOUTH",
        "HEARTH_SOUTH",
        "HEARTH_VISIBLE_STATE_COMPOSER",
        "DEXTER_LAB.runtimeTableSouth",
        "DEXTER_LAB.south",
        "DEXTER_LAB.visibleStateComposer"
      ],
      gearSequence: GEAR_SEQUENCE.map((gear) => ({
        id: gear.id,
        rank: gear.rank,
        fibonacci: gear.fibonacci,
        event: gear.event,
        label: gear.label,
        progressModel: "local_0_to_100"
      })),
      owns: [
        "visible-stage-composition",
        "visible-gear-progress-composition",
        "visible-postgame-status-composition",
        "visible-status-text-composition",
        "first-failed-coordinate-display-selection",
        "safe-receipt-visible-packet-generation"
      ],
      doesNotOwn: [
        "north-checkpoint-truth",
        "east-event-admission-truth",
        "west-gap-taxonomy",
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
    composeReceiptText,
    normalizeVisibleInput,
    getReceipt,

    compose,
    composeState,
    composeCheckpointState,
    composePostgameState,
    composeTransmissionState,

    GEAR_SEQUENCE,
    gearSequence: GEAR_SEQUENCE,
    gearFromIdEventOrStage,

    southAuthority: true,
    southLoaded: true,
    southFile: true,
    visibleStateComposer: true,
    transmissionVisibleStateComposer: true,
    nonThrowComposer: true,

    transmissionMode: true,
    oneActiveGearAtATime: true,
    localGearProgressModel: true,
    cumulativeProgressModel: false,
    activeGearOwnsVisibleProgress: true,

    queuedEventsAreAuditNotFailure: true,
    archivedEventsAreAuditNotFailure: true,
    duplicateEventsAreAuditNotFailure: true,
    blockedEventsDoNotEraseProgress: true,
    progressCapBeforeF21HardBlock: 98,
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
  root.RUNTIME_TABLE_SOUTH = api;
  root.DEXTER_LAB_RUNTIME_TABLE_SOUTH = api;
  root.LAB_CARDINAL_RUNTIME_TABLE_SOUTH = api;
  root.LAB_VISIBLE_STATE_COMPOSER_SOUTH = api;

  root.DEXTER_LAB.runtimeTableSouth = api;
  root.DEXTER_LAB.cardinalRuntimeTableSouth = api;
  root.DEXTER_LAB.south = api;
  root.DEXTER_LAB.visibleStateComposer = api;
  root.DEXTER_LAB.transmissionVisibleStateComposer = api;

  if (root.DEXTER_LAB.runtimeTable && isObject(root.DEXTER_LAB.runtimeTable)) {
    root.DEXTER_LAB.runtimeTable.south = api;
    root.DEXTER_LAB.runtimeTable.runtimeTableSouth = api;
    root.DEXTER_LAB.runtimeTable.cardinalRuntimeTableSouth = api;
    root.DEXTER_LAB.runtimeTable.visibleStateComposerSouth = api;
  }

  if (root.LAB_RUNTIME_TABLE && isObject(root.LAB_RUNTIME_TABLE)) {
    root.LAB_RUNTIME_TABLE.south = api;
    root.LAB_RUNTIME_TABLE.runtimeTableSouth = api;
    root.LAB_RUNTIME_TABLE.cardinalRuntimeTableSouth = api;
    root.LAB_RUNTIME_TABLE.visibleStateComposerSouth = api;
  }

  if (root.document && root.document.documentElement) {
    const dataset = root.document.documentElement.dataset;

    dataset.hearthRuntimeTableSouthLoaded = "true";
    dataset.hearthRuntimeTableSouthContract = CONTRACT;
    dataset.hearthRuntimeTableSouthReceipt = RECEIPT;
    dataset.hearthRuntimeTableSouthVersion = VERSION;

    dataset.labRuntimeTableSouthLoaded = "true";
    dataset.labRuntimeTableSouthContract = CONTRACT;
    dataset.labRuntimeTableSouthReceipt = RECEIPT;
    dataset.labRuntimeTableSouthAuthority = "true";

    dataset.hearthSouthVisibleStateComposerLoaded = "true";
    dataset.hearthSouthComposeVisibleStateExported = "true";
    dataset.hearthSouthComposeReceiptTextExported = "true";
    dataset.hearthSouthNonThrowComposer = "true";

    dataset.southTransmissionMode = "true";
    dataset.oneActiveGearAtATime = "true";
    dataset.localGearProgressModel = "true";
    dataset.cumulativeProgressModel = "false";
    dataset.activeGearOwnsVisibleProgress = "true";
    dataset.activeGearProgressRange = "0_to_100";

    dataset.hearthSouthQueuedEventsAuditOnly = "true";
    dataset.hearthSouthArchivedEventsAuditOnly = "true";
    dataset.hearthSouthDuplicateEventsAuditOnly = "true";
    dataset.hearthSouthBlockedEventsDoNotEraseProgress = "true";
    dataset.hearthSouthReadyTextRequiresCompletionLatch = "true";
    dataset.hearthSouthProgressCapBeforeF21HardBlock = "98";
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

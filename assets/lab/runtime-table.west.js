// /assets/lab/runtime-table.west.js
// LAB_RUNTIME_TABLE_CARDINAL_WEST_GAP_CLASSIFIER_TNT_v1
// Full-file creation.
// Cardinal split file 3 of 4.
// West authority only.
// Purpose:
// - Own gap classification for the Runtime Table cardinal split.
// - Decide whether a gap is structural, diagnostic, degraded-forward, held, duplicate, progress-only, or false-completion.
// - Keep hard blocking narrow.
// - Assess the gap quickly without preventing lawful forward progress.
// - Feed East checkpoint motion and North public Runtime Table facade.
// Consumed by:
// - /assets/lab/runtime-table.east.js
// - /assets/lab/runtime-table.js
// Does not own:
// - North public API precedent
// - East checkpoint motion
// - South visible-state language
// - planet truth
// - channel truth
// - canvas drawing
// - atlas painting
// - route orchestration
// - runtime motion
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "LAB_RUNTIME_TABLE_CARDINAL_WEST_GAP_CLASSIFIER_TNT_v1";
  const RECEIPT = "LAB_RUNTIME_TABLE_CARDINAL_WEST_GAP_CLASSIFIER_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "LAB_RUNTIME_TABLE_CARDINAL_EAST_CHECKPOINT_MOTION_TNT_v1";
  const BASELINE_CONTRACT = "RUNTIME_TABLE_NEWS_CARDINAL_FOUR_FILE_SPLIT_FINAL_DRAFT_PREWRITE_v1";
  const VERSION = "2026-05-29.lab-runtime-table-cardinal-west-gap-classifier-v1";

  const root = typeof window !== "undefined" ? window : globalThis;

  const GAP_CLASS = Object.freeze({
    NONE: "NONE",
    STRUCTURAL_BLOCK: "STRUCTURAL_BLOCK",
    FALSE_COMPLETION_BLOCK: "FALSE_COMPLETION_BLOCK",
    DIAGNOSTIC_BLOCK: "DIAGNOSTIC_BLOCK",
    DEGRADED_GAP: "DEGRADED_GAP",
    HELD_GAP: "HELD_GAP",
    PROGRESS_ONLY: "PROGRESS_ONLY",
    DUPLICATE_ARCHIVE: "DUPLICATE_ARCHIVE",
    UNKNOWN_ARCHIVE: "UNKNOWN_ARCHIVE"
  });

  const GAP_SEVERITY = Object.freeze({
    NONE: "NONE",
    INFO: "INFO",
    HELD: "HELD",
    DEGRADED: "DEGRADED",
    WARNING: "WARNING",
    SOFT_BLOCK: "SOFT_BLOCK",
    HARD_BLOCK: "HARD_BLOCK"
  });

  const GAP_DECISION = Object.freeze({
    FULL_PASS: "FULL_PASS",
    DEGRADED_FORWARD: "DEGRADED_FORWARD",
    HOLD_ACTIVE: "HOLD_ACTIVE",
    ARCHIVE: "ARCHIVE",
    HARD_BLOCK: "HARD_BLOCK"
  });

  const CHECKPOINT_IDS = Object.freeze({
    F1A: "F1A_HTML_SHELL_RENDERED",
    F1B: "F1B_LOAD_LEDGER_INITIALIZED",
    F2: "F2_FIRST_PAINT_COCKPIT_VISIBLE",
    F3: "F3_SCRIPT_ORDER_COMPLETE",
    F5: "F5_AUTHORITY_AVAILABILITY_READY",
    F8: "F8_CONDUCTOR_HYDRATED",
    F13A: "F13A_CANVAS_COOPERATIVE_BOOT_STARTED",
    F13B: "F13B_CANVAS_MOUNT_CREATED",
    F13C: "F13C_CANVAS_CONTEXT_READY",
    F13D: "F13D_DRAG_INSPECTION_BOUND",
    F13E: "F13E_ATLAS_BUILD_STARTED",
    F13F: "F13F_ATLAS_BUILD_COMPLETE",
    F13G: "F13G_TEXTURE_COMPOSE_STARTED",
    F13H: "F13H_TEXTURE_COMPOSE_COMPLETE",
    F13I: "F13I_FIRST_FRAME_REQUESTED",
    F13J: "F13J_FIRST_FRAME_DETECTED",
    F13K: "F13K_CANVAS_READY",
    F13L: "F13L_VISIBLE_CONTENT_PROOF_STARTED",
    F13M: "F13M_VISIBLE_CONTENT_PROOF_PASSED",
    F13N: "F13N_INSPECT_MODE_READY",
    F21: "F21_COMPLETION_LATCHED"
  });

  const PROGRESS_ONLY_EVENTS = Object.freeze([
    "ATLAS_BUILD_PROGRESS",
    "TEXTURE_COMPOSE_PROGRESS",
    "WIDE_PROBE_PROGRESS",
    "RECONCILE_PROGRESS",
    "CANVAS_PROGRESS",
    "PHASE_PROGRESS"
  ]);

  const HARD_FALSE_COMPLETION_TOKENS = Object.freeze([
    "\"visualPassClaimed\":true",
    "visualPassClaimed=true",
    "\"readyTextAllowed\":true",
    "readyTextAllowed=true",
    "READY_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE",
    "COMPLETION_LATCHED",
    "F21_COMPLETION_LATCHED"
  ]);

  const ROUTE_TARGETS = Object.freeze({
    NORTH: "/assets/lab/runtime-table.js",
    EAST: "/assets/lab/runtime-table.east.js",
    WEST: "/assets/lab/runtime-table.west.js",
    SOUTH: "/assets/lab/runtime-table.south.js",
    HEARTH_ROUTE: "/showroom/globe/hearth/hearth.js",
    HEARTH_INDEX: "/showroom/globe/hearth/index.js",
    HEARTH_CANVAS: "/assets/hearth/hearth.canvas.js",
    RUNTIME_TABLE: "/assets/lab/runtime-table.js"
  });

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object");
  }

  function asArray(value) {
    if (Array.isArray(value)) return value.slice();
    if (value === undefined || value === null) return [];
    return [value];
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === "true") return true;
    if (value === "false") return false;
    return fallback;
  }

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
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

  function mergePlain(base, overrides) {
    const output = { ...(base || {}) };

    Object.keys(overrides || {}).forEach((key) => {
      if (
        isObject(output[key]) &&
        isObject(overrides[key]) &&
        !Array.isArray(output[key]) &&
        !Array.isArray(overrides[key])
      ) {
        output[key] = mergePlain(output[key], overrides[key]);
      } else {
        output[key] = overrides[key];
      }
    });

    return output;
  }

  function normalizeEvent(event = {}) {
    const detail = isObject(event.detail) ? event.detail : {};
    const snapshot = isObject(event.snapshot) ? event.snapshot : {};

    const id =
      event.checkpointId ||
      event.phase ||
      event.id ||
      event.event ||
      detail.checkpointId ||
      detail.phase ||
      detail.id ||
      detail.event ||
      "";

    return {
      ...snapshot,
      ...detail,
      ...event,
      checkpointId: safeString(event.checkpointId || detail.checkpointId || id),
      id: safeString(id),
      phase: safeString(event.phase || detail.phase || id),
      event: safeString(event.event || event.id || detail.event || detail.id || id),
      detail,
      snapshot
    };
  }

  function normalizeSnapshot(snapshot = {}, context = {}) {
    const eventSnapshot = context && context.event ? normalizeEvent(context.event) : {};
    return {
      ...eventSnapshot,
      ...(isObject(snapshot) ? snapshot : {})
    };
  }

  function eventNameFromContext(context = {}) {
    const event = normalizeEvent(context.event || {});
    return safeString(event.event || event.id || event.phase || context.eventName || "");
  }

  function checkpointIdFromContext(context = {}) {
    const event = normalizeEvent(context.event || {});
    return safeString(
      context.checkpointId ||
      context.activeCheckpointId ||
      event.checkpointId ||
      event.id ||
      ""
    );
  }

  function isProgressOnlyEvent(eventOrName = "") {
    const name = typeof eventOrName === "string"
      ? eventOrName
      : eventNameFromContext({ event: eventOrName });

    return PROGRESS_ONLY_EVENTS.includes(safeString(name));
  }

  function isPrematureCompletionEvent(eventOrContext = {}, checkpointId = "") {
    const event = eventOrContext && eventOrContext.event
      ? normalizeEvent(eventOrContext.event)
      : normalizeEvent(eventOrContext);

    const activeCheckpointId = safeString(checkpointId || event.checkpointId || event.id || "");
    const eventName = safeString(event.event || event.id || event.phase || "");
    const text = JSON.stringify(event || {});

    if (activeCheckpointId === CHECKPOINT_IDS.F21 || eventName === "COMPLETION_LATCHED") {
      return false;
    }

    if (safeBool(event.visualPassClaimed, false)) return true;
    if (safeBool(event.readyTextAllowed, false)) return true;
    if (safeString(event.postgameStatus).includes("READY_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE")) return true;
    if (safeNumber(event.mainDisplayProgress, 0) >= 100 && activeCheckpointId !== CHECKPOINT_IDS.F21) return true;

    return HARD_FALSE_COMPLETION_TOKENS.some((token) => text.includes(token));
  }

  function explicitFalseCompletionAttempt(snapshot = {}, context = {}) {
    const checkpointId = checkpointIdFromContext(context);
    const eventName = eventNameFromContext(context);
    const event = normalizeEvent(context.event || {});

    if (checkpointId === CHECKPOINT_IDS.F21 || eventName === "COMPLETION_LATCHED") {
      return false;
    }

    if (isPrematureCompletionEvent(event, checkpointId)) return true;

    if (safeBool(snapshot.visualPassClaimed, false)) return true;
    if (safeBool(snapshot.readyTextAllowed, false) && checkpointId !== CHECKPOINT_IDS.F21) return true;

    return false;
  }

  function assessStructuralCarrier(snapshot = {}) {
    const failures = [];

    const routeMounted = safeBool(snapshot.routeMounted, true);
    const canvasMounted = safeBool(snapshot.canvasMounted, true);
    const fallbackShellAvailable = safeBool(snapshot.fallbackShellAvailable, true);
    const planetCanvasPresent = safeBool(snapshot.planetCanvasPresent, true);
    const planetCanvasNonZeroSize = safeBool(snapshot.planetCanvasNonZeroSize, true);
    const canvasCarrierMounted = safeBool(snapshot.canvasCarrierMounted, true);
    const canvasCarrierHandoffOk = safeBool(snapshot.canvasCarrierHandoffOk, true);
    const canvasCarrierHandoffError = safeString(snapshot.canvasCarrierHandoffError, "");
    const sphereContainment = safeBool(snapshot.sphereContainment, true);
    const outsideSphereTransparent = safeBool(snapshot.outsideSphereTransparent, true);
    const noRectangularTextureSpill = safeBool(snapshot.noRectangularTextureSpill, true);

    if (!routeMounted) failures.push("routeMounted=false");
    if (!canvasMounted) failures.push("canvasMounted=false");
    if (!fallbackShellAvailable) failures.push("fallbackShellAvailable=false");
    if (!planetCanvasPresent) failures.push("planetCanvasPresent=false");
    if (!planetCanvasNonZeroSize) failures.push("planetCanvasNonZeroSize=false");
    if (!canvasCarrierMounted) failures.push("canvasCarrierMounted=false");
    if (!canvasCarrierHandoffOk) failures.push("canvasCarrierHandoffOk=false");
    if (canvasCarrierHandoffError) failures.push(`canvasCarrierHandoffError=${canvasCarrierHandoffError}`);
    if (!sphereContainment) failures.push("sphereContainment=false");
    if (!outsideSphereTransparent) failures.push("outsideSphereTransparent=false");
    if (!noRectangularTextureSpill) failures.push("noRectangularTextureSpill=false");

    return {
      carrierStructurallySafe: failures.length === 0,
      failures,
      routeMounted,
      canvasMounted,
      fallbackShellAvailable,
      planetCanvasPresent,
      planetCanvasNonZeroSize,
      canvasCarrierMounted,
      canvasCarrierHandoffOk,
      canvasCarrierHandoffError,
      projectionSafe: sphereContainment && outsideSphereTransparent && noRectangularTextureSpill
    };
  }

  function assessVisibleContent(snapshot = {}) {
    const samples = safeNumber(snapshot.visibleContentSampleCount, 0);
    const variance = safeNumber(snapshot.visibleContentVarianceScore, 0);
    const classCount = safeNumber(snapshot.visibleContentClassCount, 0);
    const land = safeNumber(snapshot.visibleContentLandSampleCount, 0);
    const water = safeNumber(snapshot.visibleContentWaterSampleCount, 0);
    const other = safeNumber(snapshot.visibleContentOtherSampleCount, 0);
    const carrier = safeNumber(snapshot.visibleContentCarrierSampleCount ?? snapshot.carrierSampleCount, 0);
    const content = land + water + other;
    const contentRatio = samples > 0 ? content / samples : 0;
    const carrierRatio = samples > 0 ? carrier / samples : 0;

    const renderedBase = Boolean(
      safeBool(snapshot.canvasReady, false) &&
      safeBool(snapshot.firstFrameDetected, false) &&
      safeBool(snapshot.imageRendered, false) &&
      safeBool(snapshot.textureComposeComplete, false)
    );

    const visibleContentProof = safeBool(snapshot.visibleContentProof, false);
    const explicitContentReceiptProof = safeBool(snapshot.explicitContentReceiptProof, false);
    const nonblankPlanetVisible = safeBool(snapshot.nonblankPlanetVisible, false);
    const visiblePlanetAvailable = safeBool(snapshot.visiblePlanetAvailable, false);
    const carrierOnlyDetected = safeBool(snapshot.carrierOnlyDetected, false);

    const strongSurfaceSignal = Boolean(
      renderedBase &&
      nonblankPlanetVisible &&
      classCount >= 2 &&
      content >= 16 &&
      variance >= 6
    );

    const weakSurfaceSignal = Boolean(
      renderedBase &&
      nonblankPlanetVisible &&
      (
        classCount >= 1 ||
        content >= 8 ||
        variance >= 4
      )
    );

    const carrierHeavyButUsable = Boolean(
      renderedBase &&
      nonblankPlanetVisible &&
      carrierOnlyDetected &&
      weakSurfaceSignal
    );

    const fullPass = Boolean(
      visibleContentProof &&
      visiblePlanetAvailable &&
      nonblankPlanetVisible &&
      !carrierOnlyDetected
    );

    const degradedForwardAvailable = Boolean(
      !fullPass &&
      (
        strongSurfaceSignal ||
        carrierHeavyButUsable ||
        explicitContentReceiptProof
      )
    );

    return {
      fullPass,
      degradedForwardAvailable,
      renderedBase,
      visibleContentProof,
      explicitContentReceiptProof,
      nonblankPlanetVisible,
      visiblePlanetAvailable,
      carrierOnlyDetected,
      strongSurfaceSignal,
      weakSurfaceSignal,
      carrierHeavyButUsable,
      samples,
      variance,
      classCount,
      land,
      water,
      other,
      carrier,
      content,
      contentRatio,
      carrierRatio,
      firstFailedCoordinate: fullPass
        ? "NONE_VISIBLE_CONTENT_FULL_PASS"
        : degradedForwardAvailable
          ? "DEGRADED_VISIBLE_CONTENT_SURFACE_SIGNAL_AVAILABLE"
          : renderedBase
            ? "WAITING_VISIBLE_CONTENT_PROOF_PASSED"
            : "WAITING_RENDERED_BASE_FOR_VISIBLE_CONTENT"
    };
  }

  function assessInspectMode(snapshot = {}) {
    const inspectModeAvailable = safeBool(snapshot.inspectModeAvailable, false);
    const inspectPlanetControlAvailable = safeBool(snapshot.inspectPlanetControlAvailable, false);
    const diagnosticCanLeavePlanetFrame = safeBool(snapshot.diagnosticCanLeavePlanetFrame, false);
    const diagnosticDockRestorable = safeBool(snapshot.diagnosticDockRestorable, false);
    const showDiagnosticTabVisibleWhenHidden = safeBool(snapshot.showDiagnosticTabVisibleWhenHidden, false);
    const copyDiagnosticPreserved = safeBool(snapshot.copyDiagnosticPreserved, false);
    const receiptToggleReady = safeBool(snapshot.receiptToggleReady, false);
    const buttonsReachable = safeBool(snapshot.buttonsReachable, false);
    const receiptOverlayIndependent = safeBool(snapshot.receiptOverlayIndependent, true);
    const finalReceiptAvailable = safeBool(snapshot.finalReceiptAvailable, false);
    const partialReceiptAvailable = safeBool(snapshot.partialReceiptAvailable, false);

    const fullPass = Boolean(
      inspectModeAvailable &&
      inspectPlanetControlAvailable &&
      diagnosticCanLeavePlanetFrame &&
      diagnosticDockRestorable &&
      showDiagnosticTabVisibleWhenHidden &&
      copyDiagnosticPreserved &&
      receiptToggleReady &&
      buttonsReachable &&
      receiptOverlayIndependent
    );

    const receiptFallbackAvailable = Boolean(
      copyDiagnosticPreserved &&
      receiptToggleReady &&
      diagnosticDockRestorable &&
      showDiagnosticTabVisibleWhenHidden &&
      (finalReceiptAvailable || partialReceiptAvailable || receiptOverlayIndependent)
    );

    const degradedForwardAvailable = Boolean(
      !fullPass &&
      receiptFallbackAvailable
    );

    return {
      fullPass,
      degradedForwardAvailable,
      inspectModeAvailable,
      inspectPlanetControlAvailable,
      diagnosticCanLeavePlanetFrame,
      diagnosticDockRestorable,
      showDiagnosticTabVisibleWhenHidden,
      copyDiagnosticPreserved,
      receiptToggleReady,
      buttonsReachable,
      receiptOverlayIndependent,
      finalReceiptAvailable,
      partialReceiptAvailable,
      receiptFallbackAvailable,
      firstFailedCoordinate: fullPass
        ? "NONE_INSPECT_MODE_FULL_PASS"
        : degradedForwardAvailable
          ? "DEGRADED_INSPECT_MODE_RECEIPT_FALLBACK_AVAILABLE"
          : !inspectModeAvailable
            ? "WAITING_inspectModeAvailable"
            : !inspectPlanetControlAvailable
              ? "WAITING_inspectPlanetControlAvailable"
              : !diagnosticCanLeavePlanetFrame
                ? "WAITING_diagnosticCanLeavePlanetFrame"
                : !buttonsReachable
                  ? "WAITING_buttonsReachable"
                  : "WAITING_INSPECT_MODE_READY"
    };
  }

  function evaluateNewsGateState(snapshot = {}) {
    const carrier = assessStructuralCarrier(snapshot);
    const visible = assessVisibleContent(snapshot);
    const inspect = assessInspectMode(snapshot);

    const northGateReady = Boolean(
      carrier.carrierStructurallySafe &&
      safeBool(snapshot.canvasReady, false) &&
      safeBool(snapshot.atlasBuildComplete, false) &&
      safeBool(snapshot.textureComposeComplete, false) &&
      visible.fullPass
    );

    const northGateDegradedReady = Boolean(
      carrier.carrierStructurallySafe &&
      safeBool(snapshot.canvasReady, false) &&
      safeBool(snapshot.atlasBuildComplete, false) &&
      safeBool(snapshot.textureComposeComplete, false) &&
      (visible.fullPass || visible.degradedForwardAvailable)
    );

    const eastGateReady = Boolean(
      safeBool(snapshot.cooperativeBootUsed, false) &&
      !safeBool(snapshot.syncBootFallbackUsed, false) &&
      safeBool(snapshot.canvasCarrierRequested, false) &&
      safeBool(snapshot.canvasCarrierHandoffOk, false)
    );

    const westGateReady = Boolean(inspect.fullPass);
    const westGateDegradedReady = Boolean(inspect.fullPass || inspect.degradedForwardAvailable);

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

    const newsGatePassedBeforeF21 = Boolean(
      northGateReady &&
      eastGateReady &&
      westGateReady &&
      southGateReady
    );

    const newsGateDegradedBeforeF21 = Boolean(
      northGateDegradedReady &&
      eastGateReady &&
      westGateDegradedReady &&
      southGateDegradedReady
    );

    return {
      northGateReady,
      eastGateReady,
      westGateReady,
      southGateReady,
      newsGatePassedBeforeF21,
      northGateDegradedReady,
      westGateDegradedReady,
      southGateDegradedReady,
      newsGateDegradedBeforeF21,
      degradedForwardAvailable: newsGateDegradedBeforeF21 && !newsGatePassedBeforeF21,
      structuralCarrierSafe: carrier.carrierStructurallySafe,
      visibleContentFullPass: visible.fullPass,
      visibleContentDegradedForwardAvailable: visible.degradedForwardAvailable,
      inspectModeFullPass: inspect.fullPass,
      inspectModeDegradedForwardAvailable: inspect.degradedForwardAvailable
    };
  }

  function makeGap(config = {}) {
    const gapClass = config.gapClass || GAP_CLASS.NONE;
    const hardBlock = config.hardBlock === true;
    const canDegradeForward = config.canDegradeForward === true;

    let decision = config.decision || GAP_DECISION.HOLD_ACTIVE;

    if (gapClass === GAP_CLASS.NONE) decision = GAP_DECISION.FULL_PASS;
    else if (gapClass === GAP_CLASS.PROGRESS_ONLY || gapClass === GAP_CLASS.DUPLICATE_ARCHIVE || gapClass === GAP_CLASS.UNKNOWN_ARCHIVE) decision = GAP_DECISION.ARCHIVE;
    else if (hardBlock) decision = GAP_DECISION.HARD_BLOCK;
    else if (canDegradeForward) decision = GAP_DECISION.DEGRADED_FORWARD;

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      westGapReceipt: "LAB_RUNTIME_TABLE_CARDINAL_WEST_GAP_RECEIPT_v1",
      gapAssessed: true,
      westAuthority: true,
      gapClass,
      gapSeverity: config.gapSeverity || (hardBlock ? GAP_SEVERITY.HARD_BLOCK : canDegradeForward ? GAP_SEVERITY.DEGRADED : GAP_SEVERITY.HELD),
      decision,
      hardBlock,
      softBlock: !hardBlock && gapClass !== GAP_CLASS.NONE && gapClass !== GAP_CLASS.PROGRESS_ONLY && gapClass !== GAP_CLASS.DUPLICATE_ARCHIVE,
      blockSuggested: config.blockSuggested === true,
      canDegradeForward,
      forwardAllowed: !hardBlock && (canDegradeForward || gapClass === GAP_CLASS.NONE),
      shouldArchive: decision === GAP_DECISION.ARCHIVE,
      checkpointId: config.checkpointId || "",
      eventName: config.eventName || "",
      firstFailedCoordinate: config.firstFailedCoordinate || "NONE",
      recommendedNextRenewalTarget: config.recommendedNextRenewalTarget || "none",
      reason: config.reason || "",
      math: config.math || "",
      observed: config.observed || "",
      detail: clonePlain(config.detail || {}),
      probableCause: asArray(config.probableCause),
      nextStrategy: asArray(config.nextStrategy),
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function classifyGap(snapshotInput = {}, context = {}) {
    const snapshot = normalizeSnapshot(snapshotInput, context);
    const checkpointId = checkpointIdFromContext(context);
    const eventName = eventNameFromContext(context);
    const completedCheckpoints = asArray(context.completedCheckpoints);
    const newsGateState = context.newsGateState && isObject(context.newsGateState)
      ? context.newsGateState
      : evaluateNewsGateState(snapshot);

    if (isProgressOnlyEvent(eventName)) {
      return makeGap({
        gapClass: GAP_CLASS.PROGRESS_ONLY,
        gapSeverity: GAP_SEVERITY.INFO,
        decision: GAP_DECISION.ARCHIVE,
        checkpointId,
        eventName,
        firstFailedCoordinate: "PROGRESS_ONLY_EVENT_ARCHIVED",
        recommendedNextRenewalTarget: "none",
        reason: "Progress-only event does not mutate checkpoint truth.",
        math: "Progress events are subordinate to start/complete checkpoints; they are archived after parent checkpoint truth is accepted.",
        observed: eventName
      });
    }

    if (explicitFalseCompletionAttempt(snapshot, context)) {
      return makeGap({
        gapClass: GAP_CLASS.FALSE_COMPLETION_BLOCK,
        gapSeverity: GAP_SEVERITY.HARD_BLOCK,
        hardBlock: true,
        checkpointId,
        eventName,
        firstFailedCoordinate: "FALSE_COMPLETION_MUTATION_BLOCKED",
        recommendedNextRenewalTarget: ROUTE_TARGETS.HEARTH_ROUTE,
        reason: "Event attempted READY, 100%, F21, or visual-pass state before lawful completion.",
        math: "hardBlock = falseCompletionMutation && checkpointId !== F21_COMPLETION_LATCHED.",
        observed: "False completion mutation detected before F21.",
        probableCause: [
          "Late event tried to promote visible state.",
          "Duplicate canvas event carried completion-like fields.",
          "Route text/state was promoted before F21."
        ],
        nextStrategy: [
          "Archive duplicate progress events.",
          "Permit degraded-forward only through F13M/F13N/F21 gates.",
          "Do not set READY text before completionLatched."
        ]
      });
    }

    const carrier = assessStructuralCarrier(snapshot);

    if (!carrier.carrierStructurallySafe) {
      return makeGap({
        gapClass: GAP_CLASS.STRUCTURAL_BLOCK,
        gapSeverity: GAP_SEVERITY.HARD_BLOCK,
        hardBlock: true,
        checkpointId,
        eventName,
        firstFailedCoordinate: "STRUCTURAL_CARRIER_MISSING_OR_UNSAFE",
        recommendedNextRenewalTarget: carrier.failures.some((item) => item.includes("routeMounted") || item.includes("canvasMounted"))
          ? ROUTE_TARGETS.HEARTH_INDEX
          : ROUTE_TARGETS.HEARTH_CANVAS,
        reason: "Carrier or projection structure is unsafe.",
        math: "hardBlock = route/canvas/carrier/projection structural failure.",
        observed: carrier.failures.join(", "),
        detail: { carrier },
        probableCause: [
          "Mount is unavailable.",
          "Canvas carrier handoff failed.",
          "Projection safety flags are false."
        ],
        nextStrategy: [
          "Repair structural carrier before allowing content, inspect, or F21 decisions."
        ]
      });
    }

    if (!checkpointId) {
      return makeGap({
        gapClass: GAP_CLASS.UNKNOWN_ARCHIVE,
        gapSeverity: GAP_SEVERITY.INFO,
        decision: GAP_DECISION.ARCHIVE,
        checkpointId,
        eventName,
        firstFailedCoordinate: "UNKNOWN_CHECKPOINT_EVENT_ARCHIVED",
        recommendedNextRenewalTarget: "none",
        reason: "No checkpoint ID was supplied.",
        observed: eventName
      });
    }

    if (checkpointId === CHECKPOINT_IDS.F13M) {
      const visible = assessVisibleContent(snapshot);

      if (visible.fullPass) {
        return makeGap({
          gapClass: GAP_CLASS.NONE,
          gapSeverity: GAP_SEVERITY.NONE,
          checkpointId,
          eventName,
          firstFailedCoordinate: "NONE_VISIBLE_CONTENT_PROOF_PASSED",
          recommendedNextRenewalTarget: "none",
          reason: "Visible content proof passed.",
          math: "fullPass = visibleContentProof && visiblePlanetAvailable && nonblankPlanetVisible && !carrierOnlyDetected.",
          detail: { visible }
        });
      }

      if (visible.degradedForwardAvailable) {
        return makeGap({
          gapClass: GAP_CLASS.DEGRADED_GAP,
          gapSeverity: GAP_SEVERITY.DEGRADED,
          canDegradeForward: true,
          blockSuggested: true,
          checkpointId,
          eventName,
          firstFailedCoordinate: visible.firstFailedCoordinate,
          recommendedNextRenewalTarget: ROUTE_TARGETS.HEARTH_ROUTE,
          reason: "Visible proof is not full-pass, but lawful surface signal exists.",
          math: "degradedForward = renderedBase && nonblankPlanetVisible && (surface samples or content variance exist).",
          observed: `samples=${visible.samples}, content=${visible.content}, classCount=${visible.classCount}, variance=${visible.variance}, carrierOnly=${visible.carrierOnlyDetected}`,
          detail: { visible },
          probableCause: [
            "Visible content sample is carrier-heavy.",
            "Surface signal exists but proof threshold is too strict.",
            "Reconcile interval sampled before final content settled."
          ],
          nextStrategy: [
            "Allow degraded F13M forward.",
            "Record visible-content gap for later refinement.",
            "Do not block F13N if receipt/inspect fallback remains available."
          ]
        });
      }

      return makeGap({
        gapClass: GAP_CLASS.HELD_GAP,
        gapSeverity: GAP_SEVERITY.HELD,
        checkpointId,
        eventName,
        firstFailedCoordinate: visible.firstFailedCoordinate,
        recommendedNextRenewalTarget: ROUTE_TARGETS.HEARTH_CANVAS,
        reason: "Visible content proof is still pending and no degraded-forward surface signal is sufficient.",
        math: "hold = renderedBase not enough for visible proof and surface signal below degraded threshold.",
        observed: `samples=${visible.samples}, content=${visible.content}, classCount=${visible.classCount}, variance=${visible.variance}`,
        detail: { visible },
        nextStrategy: [
          "Keep active checkpoint at F13M.",
          "Continue sampling or repair canvas proof thresholds."
        ]
      });
    }

    if (checkpointId === CHECKPOINT_IDS.F13N) {
      const inspect = assessInspectMode(snapshot);

      if (inspect.fullPass) {
        return makeGap({
          gapClass: GAP_CLASS.NONE,
          gapSeverity: GAP_SEVERITY.NONE,
          checkpointId,
          eventName,
          firstFailedCoordinate: "NONE_INSPECT_MODE_READY",
          recommendedNextRenewalTarget: "none",
          reason: "Inspect mode is fully ready.",
          math: "fullPass = inspect controls + dock restore + hidden tab + copy + receipt + reachable buttons.",
          detail: { inspect }
        });
      }

      if (inspect.degradedForwardAvailable) {
        return makeGap({
          gapClass: GAP_CLASS.DEGRADED_GAP,
          gapSeverity: GAP_SEVERITY.DEGRADED,
          canDegradeForward: true,
          blockSuggested: true,
          checkpointId,
          eventName,
          firstFailedCoordinate: inspect.firstFailedCoordinate,
          recommendedNextRenewalTarget: ROUTE_TARGETS.HEARTH_ROUTE,
          reason: "Inspect mode is incomplete, but receipt/copy diagnostic fallback is available.",
          math: "degradedForward = copyDiagnosticPreserved && receiptToggleReady && diagnosticDockRestorable && receipt available/independent.",
          detail: { inspect },
          probableCause: [
            "Inspect control is missing or not fully detached.",
            "Diagnostic dock still preserves receipt/copy function.",
            "User can continue with degraded diagnostic access."
          ],
          nextStrategy: [
            "Allow degraded F13N forward.",
            "Preserve receipt export.",
            "Renew inspect control separately later."
          ]
        });
      }

      return makeGap({
        gapClass: GAP_CLASS.DIAGNOSTIC_BLOCK,
        gapSeverity: GAP_SEVERITY.SOFT_BLOCK,
        hardBlock: false,
        checkpointId,
        eventName,
        firstFailedCoordinate: inspect.firstFailedCoordinate,
        recommendedNextRenewalTarget: ROUTE_TARGETS.HEARTH_ROUTE,
        reason: "Inspect mode and diagnostic fallback are not sufficient yet.",
        math: "softHold = !inspectFull && !receiptFallback.",
        detail: { inspect },
        nextStrategy: [
          "Keep active checkpoint at F13N.",
          "Restore receipt fallback first, then inspect control."
        ]
      });
    }

    if (checkpointId === CHECKPOINT_IDS.F21) {
      const f13nComplete = completedCheckpoints.includes(CHECKPOINT_IDS.F13N);
      const fullNews = Boolean(newsGateState.newsGatePassedBeforeF21);
      const degradedNews = Boolean(newsGateState.newsGateDegradedBeforeF21);

      if (f13nComplete && fullNews) {
        return makeGap({
          gapClass: GAP_CLASS.NONE,
          gapSeverity: GAP_SEVERITY.NONE,
          checkpointId,
          eventName,
          firstFailedCoordinate: "NONE_F21_FULL_LATCH_READY",
          recommendedNextRenewalTarget: "read-postgame-canvas-or-triple-g-receipt",
          reason: "F21 completion latch is fully lawful.",
          math: "F21 full = F13N complete && NEWS full-pass gates all true.",
          detail: { newsGateState, completedCheckpoints }
        });
      }

      if (f13nComplete && degradedNews) {
        return makeGap({
          gapClass: GAP_CLASS.DEGRADED_GAP,
          gapSeverity: GAP_SEVERITY.DEGRADED,
          canDegradeForward: true,
          blockSuggested: true,
          checkpointId,
          eventName,
          firstFailedCoordinate: "DEGRADED_F21_NEWS_GATE_FORWARD_ALLOWED",
          recommendedNextRenewalTarget: ROUTE_TARGETS.HEARTH_ROUTE,
          reason: "F21 is not full-pass, but degraded NEWS gates permit forward completion with gap receipt.",
          math: "F21 degraded = F13N complete && NEWS degraded gates true && structural carrier safe.",
          observed: `fullNews=${fullNews}, degradedNews=${degradedNews}, f13nComplete=${f13nComplete}`,
          detail: { newsGateState, completedCheckpoints },
          probableCause: [
            "One or more NEWS gates is degraded rather than full-pass.",
            "Visible proof or inspect proof accepted degraded-forward.",
            "Postgame may continue with explicit gap receipt."
          ],
          nextStrategy: [
            "Allow degraded F21 completion.",
            "Keep visualPassClaimed=false.",
            "Use West/South receipt to identify the next refinement target."
          ]
        });
      }

      return makeGap({
        gapClass: GAP_CLASS.FALSE_COMPLETION_BLOCK,
        gapSeverity: GAP_SEVERITY.HARD_BLOCK,
        hardBlock: true,
        checkpointId,
        eventName,
        firstFailedCoordinate: !f13nComplete ? "F21_BLOCKED_F13N_INCOMPLETE" : "F21_BLOCKED_NEWS_GATE_INCOMPLETE",
        recommendedNextRenewalTarget: ROUTE_TARGETS.HEARTH_ROUTE,
        reason: "F21 attempted before F13N and NEWS gates were resolved.",
        math: "hardBlock = F21 && !(F13N complete && (NEWS full || NEWS degraded)).",
        observed: `fullNews=${fullNews}, degradedNews=${degradedNews}, f13nComplete=${f13nComplete}`,
        detail: { newsGateState, completedCheckpoints },
        nextStrategy: [
          "Do not latch F21.",
          "Resolve active F13M/F13N or NEWS gate gap first."
        ]
      });
    }

    return makeGap({
      gapClass: GAP_CLASS.NONE,
      gapSeverity: GAP_SEVERITY.NONE,
      checkpointId,
      eventName,
      firstFailedCoordinate: checkpointId ? `NONE_${checkpointId}` : "NONE",
      recommendedNextRenewalTarget: "none",
      reason: "No gap detected for this checkpoint.",
      math: "Default checkpoint gap = none unless structural carrier, false completion, F13M, F13N, or F21 gate fails."
    });
  }

  function createGapReceipt(snapshot = {}, context = {}) {
    const gap = classifyGap(snapshot, context);
    const visible = assessVisibleContent(normalizeSnapshot(snapshot, context));
    const inspect = assessInspectMode(normalizeSnapshot(snapshot, context));
    const carrier = assessStructuralCarrier(normalizeSnapshot(snapshot, context));
    const newsGateState = evaluateNewsGateState(normalizeSnapshot(snapshot, context));

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      westGapReceipt: "LAB_RUNTIME_TABLE_CARDINAL_WEST_GAP_CLASSIFIER_RECEIPT_v1",
      version: VERSION,
      westAuthority: true,
      westLoaded: true,
      westFallbackUsed: false,
      northPrecedentRequired: true,
      consumedByNorthFacade: true,
      consumedByEastMotion: true,

      gap,
      carrier,
      visibleContent: visible,
      inspectMode: inspect,
      newsGateState,

      hardBlock: gap.hardBlock,
      canDegradeForward: gap.canDegradeForward,
      forwardAllowed: gap.forwardAllowed,
      firstFailedCoordinate: gap.firstFailedCoordinate,
      recommendedNextRenewalTarget: gap.recommendedNextRenewalTarget,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      destinationFile: "/assets/lab/runtime-table.west.js",
      status: "active",
      role: "west-cardinal-gap-classifier-authority",

      westAuthority: true,
      westLoaded: true,
      westFallbackUsed: false,
      northPrecedentRequired: true,
      consumedByNorthFacade: true,
      consumedByEastMotion: true,

      gapClassifierActive: true,
      fastGapAssessment: true,
      hardBlockNarrowed: true,
      degradedForwardSupported: true,
      diagnosticGapDoesNotAutomaticallyHardBlock: true,
      progressOnlyEventsArchiveOnly: true,
      duplicateEventsArchiveOnly: true,
      structuralFailureHardBlocks: true,
      falseCompletionHardBlocks: true,
      f13mCarrierHeavyCanDegradeForward: true,
      f13nReceiptFallbackCanDegradeForward: true,
      f21CanDegradeCompleteWithGapReceipt: true,
      visualPassClaimed: false,

      exports: [
        "classifyGap",
        "createGapReceipt",
        "assessStructuralCarrier",
        "assessVisibleContent",
        "assessInspectMode",
        "evaluateNewsGateState",
        "isProgressOnlyEvent",
        "isPrematureCompletionEvent",
        "getReceipt"
      ],

      gapClasses: Object.values(GAP_CLASS),
      gapSeverities: Object.values(GAP_SEVERITY),
      gapDecisions: Object.values(GAP_DECISION),

      hardBlockLaw: [
        "Hard block only structural carrier failure, projection safety failure, false completion mutation, or premature F21 without full/degraded gate satisfaction.",
        "Carrier-heavy visible content is a degraded gap, not an automatic hard block, when surface signal exists.",
        "Inspect mode is a degraded gap, not an automatic hard block, when receipt/copy fallback exists.",
        "Progress-only and duplicate events are archived, not treated as failure.",
        "READY text and 100% progress require F21 completion latch.",
        "visualPassClaimed remains false."
      ],

      forwardLaw: [
        "Assess the gap immediately.",
        "Record firstFailedCoordinate and recommendedNextRenewalTarget.",
        "Allow degraded-forward when carrier structure is safe and enough proof exists to continue.",
        "Defer refinement to postgame receipts instead of blocking lawful motion."
      ],

      doesNotOwn: [
        "North public Runtime Table facade",
        "East checkpoint motion",
        "South visible-state and receipt wording",
        "planet truth",
        "canvas drawing",
        "atlas pixel painting",
        "touch drag controls",
        "route orchestration",
        "runtime motion",
        "final visual pass claim"
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

    GAP_CLASS,
    GAP_SEVERITY,
    GAP_DECISION,
    CHECKPOINT_IDS,
    PROGRESS_ONLY_EVENTS,

    classifyGap,
    createGapReceipt,
    assessStructuralCarrier,
    assessVisibleContent,
    assessInspectMode,
    evaluateNewsGateState,
    isProgressOnlyEvent,
    isPrematureCompletionEvent,
    getReceipt,

    westAuthority: true,
    westLoaded: true,
    westFallbackUsed: false,
    northPrecedentRequired: true,
    consumedByNorthFacade: true,
    consumedByEastMotion: true,

    gapClassifierActive: true,
    fastGapAssessment: true,
    hardBlockNarrowed: true,
    degradedForwardSupported: true,
    diagnosticGapDoesNotAutomaticallyHardBlock: true,
    progressOnlyEventsArchiveOnly: true,
    duplicateEventsArchiveOnly: true,
    structuralFailureHardBlocks: true,
    falseCompletionHardBlocks: true,
    f13mCarrierHeavyCanDegradeForward: true,
    f13nReceiptFallbackCanDegradeForward: true,
    f21CanDegradeCompleteWithGapReceipt: true,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  root.DEXTER_LAB = root.DEXTER_LAB || {};
  root.DEXTER_LAB.runtimeTableWest = api;
  root.DEXTER_LAB.cardinalRuntimeTableWest = api;
  root.DEXTER_LAB.gapClassifierWest = api;

  root.LAB_RUNTIME_TABLE_WEST = api;
  root.RUNTIME_TABLE_WEST = api;
  root.DEXTER_LAB_RUNTIME_TABLE_WEST = api;
  root.LAB_CARDINAL_RUNTIME_TABLE_WEST = api;
  root.LAB_GAP_CLASSIFIER_WEST = api;

  if (root.document && root.document.documentElement) {
    const dataset = root.document.documentElement.dataset;

    dataset.labRuntimeTableWestLoaded = "true";
    dataset.labRuntimeTableWestContract = CONTRACT;
    dataset.labRuntimeTableWestReceipt = RECEIPT;
    dataset.labRuntimeTableWestAuthority = "true";
    dataset.westGapClassifierAuthority = "true";
    dataset.northPrecedentRequired = "true";
    dataset.westConsumedByNorthFacade = "true";
    dataset.westConsumedByEastMotion = "true";
    dataset.fastGapAssessment = "true";
    dataset.hardBlockNarrowed = "true";
    dataset.degradedForwardSupported = "true";
    dataset.diagnosticGapDoesNotAutomaticallyHardBlock = "true";
    dataset.progressOnlyEventsArchiveOnly = "true";
    dataset.duplicateEventsArchiveOnly = "true";
    dataset.structuralFailureHardBlocks = "true";
    dataset.falseCompletionHardBlocks = "true";
    dataset.f13mCarrierHeavyCanDegradeForward = "true";
    dataset.f13nReceiptFallbackCanDegradeForward = "true";
    dataset.f21CanDegradeCompleteWithGapReceipt = "true";
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

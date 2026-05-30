// /assets/lab/runtime-table.west.js
// LAB_RUNTIME_TABLE_CARDINAL_WEST_TRANSMISSION_GAP_CLASSIFIER_TNT_v1
// Full-file replacement.
// Cardinal split file 3 of 4.
// West authority only.
// Purpose:
// - Renew West from generic checkpoint gap classification into transmission-aware gap classification.
// - Classify gaps according to the active gear / active checkpoint only.
// - Preserve one-active-gear-at-a-time law: no process may be in two gears/zones simultaneously.
// - Treat waiting-for-next-gear as held/queued, not structural failure.
// - Keep hard blocking narrow: structural carrier failure when required, false completion mutation, or premature F21.
// - Allow degraded-forward progression when the active gear has enough safe evidence to continue.
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

  const CONTRACT = "LAB_RUNTIME_TABLE_CARDINAL_WEST_TRANSMISSION_GAP_CLASSIFIER_TNT_v1";
  const RECEIPT = "LAB_RUNTIME_TABLE_CARDINAL_WEST_TRANSMISSION_GAP_CLASSIFIER_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "LAB_RUNTIME_TABLE_CARDINAL_WEST_GAP_CLASSIFIER_TNT_v1";
  const BASELINE_CONTRACT = "RUNTIME_TABLE_NEWS_CARDINAL_FOUR_FILE_SPLIT_FINAL_DRAFT_PREWRITE_v1";
  const VERSION = "2026-05-29.lab-runtime-table-cardinal-west-transmission-gap-classifier-v1";

  const root = typeof window !== "undefined" ? window : globalThis;

  const GAP_CLASS = Object.freeze({
    NONE: "NONE",
    STRUCTURAL_BLOCK: "STRUCTURAL_BLOCK",
    FALSE_COMPLETION_BLOCK: "FALSE_COMPLETION_BLOCK",
    DIAGNOSTIC_BLOCK: "DIAGNOSTIC_BLOCK",
    DEGRADED_GAP: "DEGRADED_GAP",
    HELD_GAP: "HELD_GAP",
    GEAR_SHIFT_HELD: "GEAR_SHIFT_HELD",
    ACTIVE_GEAR_WAIT: "ACTIVE_GEAR_WAIT",
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
    HOLD_FOR_GEAR_SHIFT: "HOLD_FOR_GEAR_SHIFT",
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

  const CHECKPOINT_SEQUENCE = Object.freeze([
    { id: CHECKPOINT_IDS.F1A, rank: 1, gear: "IGNITION", fibonacci: "F1A", progress: 6, requiredEvidence: ["htmlShell"] },
    { id: CHECKPOINT_IDS.F1B, rank: 2, gear: "IGNITION_LEDGER", fibonacci: "F1B", progress: 12, requiredEvidence: ["loadLedger"] },
    { id: CHECKPOINT_IDS.F2, rank: 3, gear: "FIRST_PAINT", fibonacci: "F2", progress: 22, requiredEvidence: ["firstPaint"] },
    { id: CHECKPOINT_IDS.F3, rank: 4, gear: "SCRIPT_ORDER", fibonacci: "F3", progress: 36, requiredEvidence: ["scriptOrder"] },
    { id: CHECKPOINT_IDS.F5, rank: 5, gear: "AUTHORITY_AVAILABILITY", fibonacci: "F5", progress: 55, requiredEvidence: ["authority"] },
    { id: CHECKPOINT_IDS.F8, rank: 6, gear: "CONDUCTOR_HYDRATION", fibonacci: "F8", progress: 72, requiredEvidence: ["conductor"] },
    { id: CHECKPOINT_IDS.F13A, rank: 7, gear: "CANVAS_BOOT", fibonacci: "F13A", progress: 78, requiredEvidence: ["canvasCarrierRequested"] },
    { id: CHECKPOINT_IDS.F13B, rank: 8, gear: "CANVAS_MOUNT", fibonacci: "F13B", progress: 81, requiredEvidence: ["canvasCarrierMounted"] },
    { id: CHECKPOINT_IDS.F13C, rank: 9, gear: "CANVAS_CONTEXT", fibonacci: "F13C", progress: 84, requiredEvidence: ["canvasContextReady"] },
    { id: CHECKPOINT_IDS.F13D, rank: 10, gear: "DRAG_INSPECTION", fibonacci: "F13D", progress: 86, requiredEvidence: ["dragInspectionBound"] },
    { id: CHECKPOINT_IDS.F13E, rank: 11, gear: "ATLAS_START", fibonacci: "F13E", progress: 88, requiredEvidence: ["atlasBuildStarted"] },
    { id: CHECKPOINT_IDS.F13F, rank: 12, gear: "ATLAS_COMPLETE", fibonacci: "F13F", progress: 91, requiredEvidence: ["atlasBuildComplete"] },
    { id: CHECKPOINT_IDS.F13G, rank: 13, gear: "TEXTURE_START", fibonacci: "F13G", progress: 93, requiredEvidence: ["textureComposeStarted"] },
    { id: CHECKPOINT_IDS.F13H, rank: 14, gear: "TEXTURE_COMPLETE", fibonacci: "F13H", progress: 96, requiredEvidence: ["textureComposeComplete"] },
    { id: CHECKPOINT_IDS.F13I, rank: 15, gear: "FIRST_FRAME_REQUEST", fibonacci: "F13I", progress: 97, requiredEvidence: ["firstFrameRequested"] },
    { id: CHECKPOINT_IDS.F13J, rank: 16, gear: "FIRST_FRAME_DETECT", fibonacci: "F13J", progress: 98, requiredEvidence: ["firstFrameDetected"] },
    { id: CHECKPOINT_IDS.F13K, rank: 17, gear: "CANVAS_READY", fibonacci: "F13K", progress: 98, requiredEvidence: ["canvasReady"] },
    { id: CHECKPOINT_IDS.F13L, rank: 18, gear: "VISIBLE_PROOF_START", fibonacci: "F13L", progress: 98, requiredEvidence: ["visibleContentProofStarted"] },
    { id: CHECKPOINT_IDS.F13M, rank: 19, gear: "VISIBLE_PROOF_PASS", fibonacci: "F13M", progress: 98, requiredEvidence: ["visibleContentProof"] },
    { id: CHECKPOINT_IDS.F13N, rank: 20, gear: "INSPECT_MODE", fibonacci: "F13N", progress: 98, requiredEvidence: ["inspectMode"] },
    { id: CHECKPOINT_IDS.F21, rank: 21, gear: "COMPLETION_LATCH", fibonacci: "F21", progress: 100, requiredEvidence: ["f21Allowed"] }
  ]);

  const CHECKPOINT_BY_ID = CHECKPOINT_SEQUENCE.reduce((map, item) => {
    map[item.id] = item;
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
    if (value === 1 || value === "1") return true;
    if (value === 0 || value === "0") return false;
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
      event.checkpointId ||
      event.id ||
      context.activeCheckpointId ||
      ""
    );
  }

  function activeCheckpointIdFromContext(context = {}) {
    return safeString(
      context.activeCheckpointId ||
      context.checkpointId ||
      checkpointIdFromContext(context) ||
      ""
    );
  }

  function checkpointRank(checkpointId) {
    return CHECKPOINT_BY_ID[checkpointId] ? CHECKPOINT_BY_ID[checkpointId].rank : 0;
  }

  function checkpointGear(checkpointId) {
    return CHECKPOINT_BY_ID[checkpointId] ? CHECKPOINT_BY_ID[checkpointId].gear : "";
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

  function fieldPresent(snapshot, key) {
    return snapshot && Object.prototype.hasOwnProperty.call(snapshot, key);
  }

  function requiredBoolean(snapshot, key) {
    if (!fieldPresent(snapshot, key)) {
      return {
        present: false,
        ok: false,
        value: false,
        missing: true
      };
    }

    return {
      present: true,
      ok: safeBool(snapshot[key], false) === true,
      value: safeBool(snapshot[key], false),
      missing: false
    };
  }

  function assessActiveGear(snapshotInput = {}, context = {}) {
    const snapshot = normalizeSnapshot(snapshotInput, context);
    const checkpointId = checkpointIdFromContext(context);
    const activeCheckpointId = activeCheckpointIdFromContext(context) || checkpointId;
    const checkpoint = CHECKPOINT_BY_ID[checkpointId] || null;
    const active = CHECKPOINT_BY_ID[activeCheckpointId] || checkpoint || null;
    const eventName = eventNameFromContext(context);

    const requestedRank = checkpoint ? checkpoint.rank : 0;
    const activeRank = active ? active.rank : 0;
    const rankDelta = requestedRank - activeRank;

    return {
      transmissionGapClassifier: true,
      activeGearGapAssessment: true,
      oneActiveGearAtATime: true,
      eventName,
      checkpointId,
      activeCheckpointId: active ? active.id : activeCheckpointId,
      checkpointRank: requestedRank,
      activeRank,
      checkpointGear: checkpoint ? checkpoint.gear : "",
      activeGear: active ? active.gear : "",
      checkpointFibonacci: checkpoint ? checkpoint.fibonacci : "",
      activeFibonacci: active ? active.fibonacci : "",
      rankDelta,
      sameGear: Boolean(checkpoint && active && checkpoint.id === active.id),
      futureGear: Boolean(checkpoint && active && requestedRank > activeRank),
      pastGear: Boolean(checkpoint && active && requestedRank < activeRank),
      unknownGear: Boolean(!checkpoint),
      snapshot: clonePlain(snapshot)
    };
  }

  function evidenceForGear(snapshotInput = {}, checkpointId = "") {
    const snapshot = normalizeSnapshot(snapshotInput, {});
    const checkpoint = CHECKPOINT_BY_ID[checkpointId] || null;

    if (!checkpoint) {
      return {
        evidenceRequired: false,
        complete: false,
        degraded: false,
        missing: ["unknownCheckpoint"],
        values: {}
      };
    }

    const values = {};
    const missing = [];
    let complete = true;

    function requireKey(key, aliases = []) {
      const keys = [key, ...aliases];
      const found = keys.find((candidate) => fieldPresent(snapshot, candidate));

      if (!found) {
        missing.push(key);
        complete = false;
        values[key] = false;
        return false;
      }

      const ok = safeBool(snapshot[found], false);
      values[key] = ok;
      if (!ok) complete = false;
      return ok;
    }

    switch (checkpointId) {
      case CHECKPOINT_IDS.F1A:
      case CHECKPOINT_IDS.F1B:
      case CHECKPOINT_IDS.F2:
      case CHECKPOINT_IDS.F3:
      case CHECKPOINT_IDS.F5:
      case CHECKPOINT_IDS.F8:
        return {
          evidenceRequired: false,
          complete: true,
          degraded: false,
          missing: [],
          values: {
            earlyGear: true,
            assumedByLoadedRoute: true
          }
        };

      case CHECKPOINT_IDS.F13A:
        requireKey("canvasCarrierRequested", ["canvasBootStarted", "cooperativeBootUsed"]);
        break;

      case CHECKPOINT_IDS.F13B:
        requireKey("canvasCarrierMounted", ["planetCanvasPresent", "canvasMounted"]);
        break;

      case CHECKPOINT_IDS.F13C:
        requireKey("canvasContextReady");
        break;

      case CHECKPOINT_IDS.F13D:
        requireKey("dragInspectionBound");
        break;

      case CHECKPOINT_IDS.F13E:
        requireKey("atlasBuildStarted");
        break;

      case CHECKPOINT_IDS.F13F:
        requireKey("atlasBuildComplete");
        break;

      case CHECKPOINT_IDS.F13G:
        requireKey("textureComposeStarted");
        break;

      case CHECKPOINT_IDS.F13H:
        requireKey("textureComposeComplete");
        break;

      case CHECKPOINT_IDS.F13I:
        requireKey("firstFrameRequested");
        break;

      case CHECKPOINT_IDS.F13J:
        requireKey("firstFrameDetected");
        break;

      case CHECKPOINT_IDS.F13K:
        requireKey("canvasReady");
        requireKey("canvasCarrierMounted", ["planetCanvasPresent", "canvasMounted"]);
        requireKey("firstFrameDetected");
        requireKey("imageRendered");
        break;

      case CHECKPOINT_IDS.F13L:
        requireKey("visibleContentProofStarted");
        break;

      case CHECKPOINT_IDS.F13M: {
        const visible = assessVisibleContent(snapshot);
        return {
          evidenceRequired: true,
          complete: visible.fullPass,
          degraded: visible.degradedForwardAvailable,
          missing: visible.fullPass || visible.degradedForwardAvailable ? [] : [visible.firstFailedCoordinate],
          values: visible
        };
      }

      case CHECKPOINT_IDS.F13N: {
        const inspect = assessInspectMode(snapshot);
        return {
          evidenceRequired: true,
          complete: inspect.fullPass,
          degraded: inspect.degradedForwardAvailable,
          missing: inspect.fullPass || inspect.degradedForwardAvailable ? [] : [inspect.firstFailedCoordinate],
          values: inspect
        };
      }

      case CHECKPOINT_IDS.F21: {
        const completed = asArray(snapshot.completedCheckpoints);
        const news = evaluateNewsGateState(snapshot);
        const f13nComplete = completed.includes(CHECKPOINT_IDS.F13N) || safeBool(snapshot.f13SubsequenceComplete, false);
        const completeF21 = Boolean(f13nComplete && news.newsGatePassedBeforeF21);
        const degradedF21 = Boolean(f13nComplete && news.newsGateDegradedBeforeF21);

        return {
          evidenceRequired: true,
          complete: completeF21,
          degraded: degradedF21,
          missing: completeF21 || degradedF21 ? [] : [!f13nComplete ? "F13N_INCOMPLETE" : "NEWS_GATE_INCOMPLETE"],
          values: {
            f13nComplete,
            newsGatePassedBeforeF21: news.newsGatePassedBeforeF21,
            newsGateDegradedBeforeF21: news.newsGateDegradedBeforeF21,
            news
          }
        };
      }

      default:
        complete = false;
        missing.push("unknownCheckpoint");
    }

    return {
      evidenceRequired: true,
      complete,
      degraded: false,
      missing,
      values
    };
  }

  function assessStructuralCarrier(snapshot = {}, context = {}) {
    const active = assessActiveGear(snapshot, context);
    const failures = [];
    const heldUnknown = [];

    function requireWhen(key, defaultValue, requireForRank = 7) {
      const requiredNow = active.activeRank >= requireForRank;

      if (!fieldPresent(snapshot, key)) {
        if (requiredNow) heldUnknown.push(`${key}=missing`);
        return defaultValue;
      }

      const value = safeBool(snapshot[key], defaultValue);
      if (requiredNow && !value) failures.push(`${key}=false`);
      return value;
    }

    const routeMounted = requireWhen("routeMounted", true, 1);
    const canvasMounted = requireWhen("canvasMounted", true, 7);
    const fallbackShellAvailable = requireWhen("fallbackShellAvailable", true, 1);
    const planetCanvasPresent = requireWhen("planetCanvasPresent", true, 8);
    const planetCanvasNonZeroSize = requireWhen("planetCanvasNonZeroSize", true, 8);
    const canvasCarrierMounted = requireWhen("canvasCarrierMounted", true, 8);
    const canvasCarrierHandoffOk = requireWhen("canvasCarrierHandoffOk", true, 7);
    const sphereContainment = requireWhen("sphereContainment", true, 13);
    const outsideSphereTransparent = requireWhen("outsideSphereTransparent", true, 13);
    const noRectangularTextureSpill = requireWhen("noRectangularTextureSpill", true, 13);

    const canvasCarrierHandoffError = safeString(snapshot.canvasCarrierHandoffError, "");
    if (active.activeRank >= 7 && canvasCarrierHandoffError) {
      failures.push(`canvasCarrierHandoffError=${canvasCarrierHandoffError}`);
    }

    const projectionSafe = Boolean(sphereContainment && outsideSphereTransparent && noRectangularTextureSpill);

    return {
      transmissionAware: true,
      activeGear: active.activeGear,
      activeCheckpointId: active.activeCheckpointId,
      activeRank: active.activeRank,
      carrierStructurallySafe: failures.length === 0,
      carrierStructurallyKnown: heldUnknown.length === 0,
      heldUnknown,
      failures,
      routeMounted,
      canvasMounted,
      fallbackShellAvailable,
      planetCanvasPresent,
      planetCanvasNonZeroSize,
      canvasCarrierMounted,
      canvasCarrierHandoffOk,
      canvasCarrierHandoffError,
      sphereContainment,
      outsideSphereTransparent,
      noRectangularTextureSpill,
      projectionSafe,
      missingEvidenceIsHeldUnlessActiveGearRequiresIt: true
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
      diagnosticDockRestorable
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
      showDiagnosticTabIsFullPassRequirementNotDegradedRequirement: true,
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
    const carrier = assessStructuralCarrier(snapshot, {
      checkpointId: CHECKPOINT_IDS.F21,
      activeCheckpointId: CHECKPOINT_IDS.F21
    });

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
    else if (
      gapClass === GAP_CLASS.PROGRESS_ONLY ||
      gapClass === GAP_CLASS.DUPLICATE_ARCHIVE ||
      gapClass === GAP_CLASS.UNKNOWN_ARCHIVE
    ) {
      decision = GAP_DECISION.ARCHIVE;
    } else if (gapClass === GAP_CLASS.GEAR_SHIFT_HELD) {
      decision = GAP_DECISION.HOLD_FOR_GEAR_SHIFT;
    } else if (hardBlock) {
      decision = GAP_DECISION.HARD_BLOCK;
    } else if (canDegradeForward) {
      decision = GAP_DECISION.DEGRADED_FORWARD;
    }

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      westGapReceipt: "LAB_RUNTIME_TABLE_CARDINAL_WEST_TRANSMISSION_GAP_RECEIPT_v1",
      gapAssessed: true,
      westAuthority: true,
      transmissionGapClassifier: true,
      gearShiftGapClassification: true,
      oneActiveGearAtATime: true,
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
      activeCheckpointId: config.activeCheckpointId || config.checkpointId || "",
      checkpointRank: config.checkpointRank || checkpointRank(config.checkpointId || ""),
      activeRank: config.activeRank || checkpointRank(config.activeCheckpointId || config.checkpointId || ""),
      checkpointGear: config.checkpointGear || checkpointGear(config.checkpointId || ""),
      activeGear: config.activeGear || checkpointGear(config.activeCheckpointId || config.checkpointId || ""),
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

  function classifyTransmissionGap(snapshotInput = {}, context = {}) {
    const snapshot = normalizeSnapshot(snapshotInput, context);
    const active = assessActiveGear(snapshot, context);
    const eventName = active.eventName;
    const checkpointId = active.checkpointId;
    const activeCheckpointId = active.activeCheckpointId || checkpointId;

    if (isProgressOnlyEvent(eventName)) {
      return makeGap({
        gapClass: GAP_CLASS.PROGRESS_ONLY,
        gapSeverity: GAP_SEVERITY.INFO,
        decision: GAP_DECISION.ARCHIVE,
        checkpointId,
        activeCheckpointId,
        eventName,
        firstFailedCoordinate: "PROGRESS_ONLY_EVENT_ARCHIVED",
        recommendedNextRenewalTarget: "none",
        reason: "Progress-only event does not mutate active gear truth.",
        math: "Progress events are subordinate to their active gear; they are archived after parent gear truth is accepted.",
        observed: eventName,
        detail: { active }
      });
    }

    if (active.unknownGear) {
      return makeGap({
        gapClass: GAP_CLASS.UNKNOWN_ARCHIVE,
        gapSeverity: GAP_SEVERITY.INFO,
        decision: GAP_DECISION.ARCHIVE,
        checkpointId,
        activeCheckpointId,
        eventName,
        firstFailedCoordinate: "UNKNOWN_CHECKPOINT_EVENT_ARCHIVED",
        recommendedNextRenewalTarget: "none",
        reason: "Unknown checkpoint event archived without mutating the active gear.",
        detail: { active }
      });
    }

    if (active.futureGear) {
      return makeGap({
        gapClass: GAP_CLASS.GEAR_SHIFT_HELD,
        gapSeverity: GAP_SEVERITY.HELD,
        decision: GAP_DECISION.HOLD_FOR_GEAR_SHIFT,
        checkpointId,
        activeCheckpointId,
        eventName,
        firstFailedCoordinate: `WAITING_${activeCheckpointId}`,
        recommendedNextRenewalTarget: "complete-active-gear-first",
        reason: "Future gear event held until the active gear completes and North authorizes shift.",
        math: "futureGear = checkpoint.rank > activeCheckpoint.rank; one transmission gear may run at a time.",
        observed: `activeGear=${active.activeGear}; requestedGear=${active.checkpointGear}`,
        detail: { active },
        nextStrategy: [
          "Do not hard-block future gear.",
          "Queue the event through East.",
          "Complete the active gear from 0 to 100 before shifting."
        ]
      });
    }

    if (active.pastGear) {
      if (explicitFalseCompletionAttempt(snapshot, context)) {
        return makeGap({
          gapClass: GAP_CLASS.FALSE_COMPLETION_BLOCK,
          gapSeverity: GAP_SEVERITY.HARD_BLOCK,
          hardBlock: true,
          checkpointId,
          activeCheckpointId,
          eventName,
          firstFailedCoordinate: "PAST_GEAR_FALSE_COMPLETION_MUTATION_BLOCKED",
          recommendedNextRenewalTarget: ROUTE_TARGETS.HEARTH_ROUTE,
          reason: "A past gear attempted false READY, 100%, F21, or visual-pass mutation.",
          math: "pastGear && falseCompletionMutation => hardBlock.",
          detail: { active }
        });
      }

      return makeGap({
        gapClass: GAP_CLASS.DUPLICATE_ARCHIVE,
        gapSeverity: GAP_SEVERITY.INFO,
        decision: GAP_DECISION.ARCHIVE,
        checkpointId,
        activeCheckpointId,
        eventName,
        firstFailedCoordinate: "PAST_GEAR_DUPLICATE_ARCHIVED",
        recommendedNextRenewalTarget: "none",
        reason: "Past gear duplicate archived without mutating the active gear.",
        detail: { active }
      });
    }

    if (explicitFalseCompletionAttempt(snapshot, context)) {
      return makeGap({
        gapClass: GAP_CLASS.FALSE_COMPLETION_BLOCK,
        gapSeverity: GAP_SEVERITY.HARD_BLOCK,
        hardBlock: true,
        checkpointId,
        activeCheckpointId,
        eventName,
        firstFailedCoordinate: "FALSE_COMPLETION_MUTATION_BLOCKED",
        recommendedNextRenewalTarget: ROUTE_TARGETS.HEARTH_ROUTE,
        reason: "Event attempted READY, 100%, F21, or visual-pass state before lawful completion.",
        math: "hardBlock = falseCompletionMutation && activeGear !== F21.",
        observed: "False completion mutation detected before F21.",
        detail: { active },
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

    const carrier = assessStructuralCarrier(snapshot, {
      checkpointId,
      activeCheckpointId
    });

    if (!carrier.carrierStructurallySafe) {
      return makeGap({
        gapClass: GAP_CLASS.STRUCTURAL_BLOCK,
        gapSeverity: GAP_SEVERITY.HARD_BLOCK,
        hardBlock: true,
        checkpointId,
        activeCheckpointId,
        eventName,
        firstFailedCoordinate: "STRUCTURAL_CARRIER_MISSING_OR_UNSAFE",
        recommendedNextRenewalTarget: carrier.failures.some((item) => item.includes("routeMounted") || item.includes("canvasMounted"))
          ? ROUTE_TARGETS.HEARTH_INDEX
          : ROUTE_TARGETS.HEARTH_CANVAS,
        reason: "Active gear requires structural carrier proof and the carrier is unsafe.",
        math: "hardBlock = activeGearRequiresCarrier && route/canvas/carrier/projection structural failure.",
        observed: carrier.failures.join(", "),
        detail: { active, carrier },
        probableCause: [
          "Mount is unavailable.",
          "Canvas carrier handoff failed.",
          "Projection safety flags are false."
        ],
        nextStrategy: [
          "Repair structural carrier before allowing active gear completion."
        ]
      });
    }

    if (!carrier.carrierStructurallyKnown && active.activeRank >= 8) {
      return makeGap({
        gapClass: GAP_CLASS.HELD_GAP,
        gapSeverity: GAP_SEVERITY.HELD,
        checkpointId,
        activeCheckpointId,
        eventName,
        firstFailedCoordinate: "WAITING_ACTIVE_GEAR_CARRIER_EVIDENCE",
        recommendedNextRenewalTarget: ROUTE_TARGETS.HEARTH_ROUTE,
        reason: "Carrier evidence is missing for the active gear; missing evidence is held, not hard-blocked.",
        math: "missing structural evidence becomes held unless explicitly false for the active gear.",
        observed: carrier.heldUnknown.join(", "),
        detail: { active, carrier },
        nextStrategy: [
          "Wait for the active gear receipt.",
          "Do not infer structural failure from missing evidence alone."
        ]
      });
    }

    if (checkpointId === CHECKPOINT_IDS.F13M) {
      const visible = assessVisibleContent(snapshot);

      if (visible.fullPass) {
        return makeGap({
          gapClass: GAP_CLASS.NONE,
          gapSeverity: GAP_SEVERITY.NONE,
          checkpointId,
          activeCheckpointId,
          eventName,
          firstFailedCoordinate: "NONE_VISIBLE_CONTENT_PROOF_PASSED",
          recommendedNextRenewalTarget: "none",
          reason: "Visible content proof passed.",
          math: "fullPass = visibleContentProof && visiblePlanetAvailable && nonblankPlanetVisible && !carrierOnlyDetected.",
          detail: { active, visible }
        });
      }

      if (visible.degradedForwardAvailable) {
        return makeGap({
          gapClass: GAP_CLASS.DEGRADED_GAP,
          gapSeverity: GAP_SEVERITY.DEGRADED,
          canDegradeForward: true,
          blockSuggested: true,
          checkpointId,
          activeCheckpointId,
          eventName,
          firstFailedCoordinate: visible.firstFailedCoordinate,
          recommendedNextRenewalTarget: ROUTE_TARGETS.HEARTH_ROUTE,
          reason: "Visible proof is not full-pass, but lawful surface signal exists.",
          math: "degradedForward = renderedBase && nonblankPlanetVisible && surface samples/content variance exist.",
          observed: `samples=${visible.samples}, content=${visible.content}, classCount=${visible.classCount}, variance=${visible.variance}, carrierOnly=${visible.carrierOnlyDetected}`,
          detail: { active, visible },
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
        gapClass: GAP_CLASS.ACTIVE_GEAR_WAIT,
        gapSeverity: GAP_SEVERITY.HELD,
        checkpointId,
        activeCheckpointId,
        eventName,
        firstFailedCoordinate: visible.firstFailedCoordinate,
        recommendedNextRenewalTarget: ROUTE_TARGETS.HEARTH_CANVAS,
        reason: "Active visible-content gear is waiting for sufficient proof.",
        math: "hold active gear until full visible proof or degraded surface signal exists.",
        observed: `samples=${visible.samples}, content=${visible.content}, classCount=${visible.classCount}, variance=${visible.variance}`,
        detail: { active, visible },
        nextStrategy: [
          "Keep transmission in F13M.",
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
          activeCheckpointId,
          eventName,
          firstFailedCoordinate: "NONE_INSPECT_MODE_READY",
          recommendedNextRenewalTarget: "none",
          reason: "Inspect mode is fully ready.",
          math: "fullPass = inspect controls + dock restore + hidden tab + copy + receipt + reachable buttons.",
          detail: { active, inspect }
        });
      }

      if (inspect.degradedForwardAvailable) {
        return makeGap({
          gapClass: GAP_CLASS.DEGRADED_GAP,
          gapSeverity: GAP_SEVERITY.DEGRADED,
          canDegradeForward: true,
          blockSuggested: true,
          checkpointId,
          activeCheckpointId,
          eventName,
          firstFailedCoordinate: inspect.firstFailedCoordinate,
          recommendedNextRenewalTarget: ROUTE_TARGETS.HEARTH_ROUTE,
          reason: "Inspect mode is incomplete, but receipt/copy diagnostic fallback is available.",
          math: "degradedForward = copyDiagnosticPreserved && receiptToggleReady && diagnosticDockRestorable.",
          detail: { active, inspect },
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
        activeCheckpointId,
        eventName,
        firstFailedCoordinate: inspect.firstFailedCoordinate,
        recommendedNextRenewalTarget: ROUTE_TARGETS.HEARTH_ROUTE,
        reason: "Active inspect gear is waiting for inspect proof or diagnostic fallback.",
        math: "softHold = !inspectFull && !receiptFallback.",
        detail: { active, inspect },
        nextStrategy: [
          "Keep transmission in F13N.",
          "Restore receipt fallback first, then inspect control."
        ]
      });
    }

    if (checkpointId === CHECKPOINT_IDS.F21) {
      const completedCheckpoints = asArray(context.completedCheckpoints || snapshot.completedCheckpoints);
      const newsGateState = context.newsGateState && isObject(context.newsGateState)
        ? context.newsGateState
        : evaluateNewsGateState(snapshot);

      const f13nComplete = completedCheckpoints.includes(CHECKPOINT_IDS.F13N) || safeBool(snapshot.f13SubsequenceComplete, false);
      const fullNews = Boolean(newsGateState.newsGatePassedBeforeF21);
      const degradedNews = Boolean(newsGateState.newsGateDegradedBeforeF21);

      if (f13nComplete && fullNews) {
        return makeGap({
          gapClass: GAP_CLASS.NONE,
          gapSeverity: GAP_SEVERITY.NONE,
          checkpointId,
          activeCheckpointId,
          eventName,
          firstFailedCoordinate: "NONE_F21_FULL_LATCH_READY",
          recommendedNextRenewalTarget: "read-postgame-canvas-or-triple-g-receipt",
          reason: "F21 completion latch is fully lawful.",
          math: "F21 full = F13N complete && NEWS full-pass gates all true.",
          detail: { active, newsGateState, completedCheckpoints }
        });
      }

      if (f13nComplete && degradedNews) {
        return makeGap({
          gapClass: GAP_CLASS.DEGRADED_GAP,
          gapSeverity: GAP_SEVERITY.DEGRADED,
          canDegradeForward: true,
          blockSuggested: true,
          checkpointId,
          activeCheckpointId,
          eventName,
          firstFailedCoordinate: "DEGRADED_F21_NEWS_GATE_FORWARD_ALLOWED",
          recommendedNextRenewalTarget: ROUTE_TARGETS.HEARTH_ROUTE,
          reason: "F21 is not full-pass, but degraded NEWS gates permit forward completion with gap receipt.",
          math: "F21 degraded = F13N complete && NEWS degraded gates true && structural carrier safe.",
          observed: `fullNews=${fullNews}, degradedNews=${degradedNews}, f13nComplete=${f13nComplete}`,
          detail: { active, newsGateState, completedCheckpoints },
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
        gapClass: GAP_CLASS.GEAR_SHIFT_HELD,
        gapSeverity: GAP_SEVERITY.HELD,
        decision: GAP_DECISION.HOLD_FOR_GEAR_SHIFT,
        hardBlock: false,
        checkpointId,
        activeCheckpointId,
        eventName,
        firstFailedCoordinate: !f13nComplete ? "F21_WAITING_F13N_GEAR_COMPLETION" : "F21_WAITING_NEWS_GATE_ALIGNMENT",
        recommendedNextRenewalTarget: ROUTE_TARGETS.HEARTH_ROUTE,
        reason: "F21 is waiting for North-authorized transmission shift; this is held state, not structural failure.",
        math: "F21 held = F13N/NEWS not resolved; no false completion or structural carrier failure.",
        observed: `fullNews=${fullNews}, degradedNews=${degradedNews}, f13nComplete=${f13nComplete}`,
        detail: { active, newsGateState, completedCheckpoints },
        nextStrategy: [
          "Do not latch F21 yet.",
          "Do not hard-block unless false completion or structural failure occurs.",
          "Resolve active F13M/F13N or NEWS gate gap first."
        ]
      });
    }

    const evidence = evidenceForGear(snapshot, checkpointId);

    if (evidence.complete) {
      return makeGap({
        gapClass: GAP_CLASS.NONE,
        gapSeverity: GAP_SEVERITY.NONE,
        checkpointId,
        activeCheckpointId,
        eventName,
        firstFailedCoordinate: `NONE_${checkpointId}`,
        recommendedNextRenewalTarget: "none",
        reason: "Active transmission gear has sufficient completion evidence.",
        math: "activeGearEvidenceComplete = true.",
        detail: { active, evidence }
      });
    }

    if (evidence.degraded) {
      return makeGap({
        gapClass: GAP_CLASS.DEGRADED_GAP,
        gapSeverity: GAP_SEVERITY.DEGRADED,
        canDegradeForward: true,
        checkpointId,
        activeCheckpointId,
        eventName,
        firstFailedCoordinate: `DEGRADED_${checkpointId}`,
        recommendedNextRenewalTarget: ROUTE_TARGETS.HEARTH_ROUTE,
        reason: "Active gear has degraded-forward evidence.",
        math: "activeGearEvidenceDegraded = true.",
        detail: { active, evidence }
      });
    }

    return makeGap({
      gapClass: GAP_CLASS.ACTIVE_GEAR_WAIT,
      gapSeverity: GAP_SEVERITY.HELD,
      checkpointId,
      activeCheckpointId,
      eventName,
      firstFailedCoordinate: `WAITING_${checkpointId}`,
      recommendedNextRenewalTarget: ROUTE_TARGETS.HEARTH_ROUTE,
      reason: "Active transmission gear is waiting for its own required evidence.",
      math: "oneActiveGearAtATime && !activeGearEvidenceComplete.",
      observed: evidence.missing.join(", "),
      detail: { active, evidence },
      nextStrategy: [
        "Keep the same active gear.",
        "Do not start the next gear until North authorizes shift."
      ]
    });
  }

  function classifyGap(snapshotInput = {}, context = {}) {
    return classifyTransmissionGap(snapshotInput, context);
  }

  function createGapReceipt(snapshot = {}, context = {}) {
    const normalized = normalizeSnapshot(snapshot, context);
    const gap = classifyTransmissionGap(normalized, context);
    const visible = assessVisibleContent(normalized);
    const inspect = assessInspectMode(normalized);
    const carrier = assessStructuralCarrier(normalized, context);
    const newsGateState = evaluateNewsGateState(normalized);
    const activeGear = assessActiveGear(normalized, context);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      westGapReceipt: "LAB_RUNTIME_TABLE_CARDINAL_WEST_TRANSMISSION_GAP_CLASSIFIER_RECEIPT_v1",
      version: VERSION,
      westAuthority: true,
      westLoaded: true,
      westFallbackUsed: false,
      northPrecedentRequired: true,
      consumedByNorthFacade: true,
      consumedByEastMotion: true,

      transmissionGapClassifier: true,
      oneActiveGearAtATime: true,
      activeGearGapAssessment: true,
      gearShiftGapClassification: true,
      missingEvidenceHeldUnlessActiveGearRequiresIt: true,

      activeGear,
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
      role: "west-cardinal-transmission-gap-classifier-authority",

      westAuthority: true,
      westLoaded: true,
      westFallbackUsed: false,
      northPrecedentRequired: true,
      consumedByNorthFacade: true,
      consumedByEastMotion: true,

      transmissionGapClassifier: true,
      activeGearGapAssessment: true,
      gearShiftGapClassification: true,
      oneActiveGearAtATime: true,
      localGearProgressZeroToOneHundred: true,
      waitingForNextGearIsHeldNotStructuralFailure: true,
      missingEvidenceHeldUnlessActiveGearRequiresIt: true,

      gapClassifierActive: true,
      fastGapAssessment: true,
      hardBlockNarrowed: true,
      degradedForwardSupported: true,
      diagnosticGapDoesNotAutomaticallyHardBlock: true,
      progressOnlyEventsArchiveOnly: true,
      duplicateEventsArchiveOnly: true,
      structuralFailureHardBlocksOnlyWhenActiveGearRequiresIt: true,
      falseCompletionHardBlocks: true,
      f13mCarrierHeavyCanDegradeForward: true,
      f13nReceiptFallbackCanDegradeForward: true,
      f13nShowDiagnosticTabIsFullPassNotDegradedRequirement: true,
      f21CanDegradeCompleteWithGapReceipt: true,
      f21WaitingForNorthShiftIsHeldNotHardBlock: true,
      visualPassClaimed: false,

      exports: [
        "classifyGap",
        "classifyTransmissionGap",
        "createGapReceipt",
        "assessActiveGear",
        "evidenceForGear",
        "assessStructuralCarrier",
        "assessVisibleContent",
        "assessInspectMode",
        "evaluateNewsGateState",
        "isProgressOnlyEvent",
        "isPrematureCompletionEvent",
        "getReceipt"
      ],

      checkpointSequence: CHECKPOINT_SEQUENCE.map((checkpoint) => ({
        id: checkpoint.id,
        rank: checkpoint.rank,
        gear: checkpoint.gear,
        fibonacci: checkpoint.fibonacci,
        progress: checkpoint.progress,
        requiredEvidence: checkpoint.requiredEvidence.slice()
      })),

      gapClasses: Object.values(GAP_CLASS),
      gapSeverities: Object.values(GAP_SEVERITY),
      gapDecisions: Object.values(GAP_DECISION),

      transmissionLaw: [
        "Each checkpoint is a transmission gear.",
        "Only one gear may be active at a time.",
        "Future gear events are held or queued, not treated as structural failure.",
        "Past gear duplicates are archived unless they attempt false completion.",
        "Each active gear completes locally before North authorizes the next gear shift.",
        "The loading bar should represent the active gear cycle from 0 to 100, not cumulative multi-gear percentage.",
        "Waiting for F21 is a North gear-shift condition, not automatically a hard block."
      ],

      hardBlockLaw: [
        "Hard block only active-gear structural carrier failure, projection safety failure, false completion mutation, or premature F21 false-completion mutation.",
        "Carrier-heavy visible content is a degraded gap, not an automatic hard block, when surface signal exists.",
        "Inspect mode is a degraded gap, not an automatic hard block, when copy/receipt/dock fallback exists.",
        "Progress-only and duplicate events are archived, not treated as failure.",
        "READY text and 100% progress require lawful F21 completion latch.",
        "visualPassClaimed remains false."
      ],

      forwardLaw: [
        "Assess the active gear immediately.",
        "Record firstFailedCoordinate and recommendedNextRenewalTarget.",
        "Allow degraded-forward when carrier structure is safe and enough active-gear proof exists.",
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
    CHECKPOINT_SEQUENCE,
    PROGRESS_ONLY_EVENTS,

    classifyGap,
    classifyTransmissionGap,
    createGapReceipt,
    assessActiveGear,
    evidenceForGear,
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

    transmissionGapClassifier: true,
    activeGearGapAssessment: true,
    gearShiftGapClassification: true,
    oneActiveGearAtATime: true,
    localGearProgressZeroToOneHundred: true,
    waitingForNextGearIsHeldNotStructuralFailure: true,
    missingEvidenceHeldUnlessActiveGearRequiresIt: true,

    gapClassifierActive: true,
    fastGapAssessment: true,
    hardBlockNarrowed: true,
    degradedForwardSupported: true,
    diagnosticGapDoesNotAutomaticallyHardBlock: true,
    progressOnlyEventsArchiveOnly: true,
    duplicateEventsArchiveOnly: true,
    structuralFailureHardBlocksOnlyWhenActiveGearRequiresIt: true,
    falseCompletionHardBlocks: true,
    f13mCarrierHeavyCanDegradeForward: true,
    f13nReceiptFallbackCanDegradeForward: true,
    f13nShowDiagnosticTabIsFullPassNotDegradedRequirement: true,
    f21CanDegradeCompleteWithGapReceipt: true,
    f21WaitingForNorthShiftIsHeldNotHardBlock: true,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  root.DEXTER_LAB = root.DEXTER_LAB || {};
  root.DEXTER_LAB.runtimeTableWest = api;
  root.DEXTER_LAB.cardinalRuntimeTableWest = api;
  root.DEXTER_LAB.gapClassifierWest = api;
  root.DEXTER_LAB.transmissionGapClassifierWest = api;

  root.LAB_RUNTIME_TABLE_WEST = api;
  root.RUNTIME_TABLE_WEST = api;
  root.DEXTER_LAB_RUNTIME_TABLE_WEST = api;
  root.LAB_CARDINAL_RUNTIME_TABLE_WEST = api;
  root.LAB_GAP_CLASSIFIER_WEST = api;
  root.LAB_TRANSMISSION_GAP_CLASSIFIER_WEST = api;

  if (root.document && root.document.documentElement) {
    const dataset = root.document.documentElement.dataset;

    dataset.labRuntimeTableWestLoaded = "true";
    dataset.labRuntimeTableWestContract = CONTRACT;
    dataset.labRuntimeTableWestReceipt = RECEIPT;
    dataset.labRuntimeTableWestAuthority = "true";
    dataset.westGapClassifierAuthority = "true";
    dataset.westTransmissionGapClassifierAuthority = "true";
    dataset.northPrecedentRequired = "true";
    dataset.westConsumedByNorthFacade = "true";
    dataset.westConsumedByEastMotion = "true";
    dataset.transmissionGapClassifier = "true";
    dataset.activeGearGapAssessment = "true";
    dataset.gearShiftGapClassification = "true";
    dataset.oneActiveGearAtATime = "true";
    dataset.localGearProgressZeroToOneHundred = "true";
    dataset.waitingForNextGearIsHeldNotStructuralFailure = "true";
    dataset.missingEvidenceHeldUnlessActiveGearRequiresIt = "true";
    dataset.fastGapAssessment = "true";
    dataset.hardBlockNarrowed = "true";
    dataset.degradedForwardSupported = "true";
    dataset.diagnosticGapDoesNotAutomaticallyHardBlock = "true";
    dataset.progressOnlyEventsArchiveOnly = "true";
    dataset.duplicateEventsArchiveOnly = "true";
    dataset.structuralFailureHardBlocksOnlyWhenActiveGearRequiresIt = "true";
    dataset.falseCompletionHardBlocks = "true";
    dataset.f13mCarrierHeavyCanDegradeForward = "true";
    dataset.f13nReceiptFallbackCanDegradeForward = "true";
    dataset.f13nShowDiagnosticTabIsFullPassNotDegradedRequirement = "true";
    dataset.f21CanDegradeCompleteWithGapReceipt = "true";
    dataset.f21WaitingForNorthShiftIsHeldNotHardBlock = "true";
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

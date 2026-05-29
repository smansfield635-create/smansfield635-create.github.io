// /assets/lab/runtime-table.east.js
// LAB_RUNTIME_TABLE_CARDINAL_EAST_CHECKPOINT_MOTION_TNT_v1
// Full-file creation.
// Cardinal split file 2 of 4.
// East authority only.
// Purpose:
// - Own chronological checkpoint motion behind the North Runtime Table facade.
// - Preserve NEWS + Fibonacci checkpoint sequencing.
// - Admit, queue, archive, or block checkpoint events without over-blocking forward progress.
// - Allow degraded-forward progression when the gap is diagnostic or carrier-heavy but structurally safe.
// - Reserve hard blocking for structural carrier failure, false F21, or false visual-pass/READY mutation.
// Consumed by:
// - /assets/lab/runtime-table.js as North precedent facade.
// Does not own:
// - North public API precedent
// - West final gap taxonomy
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

  const CONTRACT = "LAB_RUNTIME_TABLE_CARDINAL_EAST_CHECKPOINT_MOTION_TNT_v1";
  const RECEIPT = "LAB_RUNTIME_TABLE_CARDINAL_EAST_CHECKPOINT_MOTION_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "LAB_RUNTIME_TABLE_CARDINAL_NORTH_PRECEDENT_FACADE_TNT_v1";
  const BASELINE_CONTRACT = "RUNTIME_TABLE_NEWS_CARDINAL_FOUR_FILE_SPLIT_FINAL_DRAFT_PREWRITE_v1";
  const VERSION = "2026-05-29.lab-runtime-table-cardinal-east-checkpoint-motion-v1";

  const root = typeof window !== "undefined" ? window : globalThis;

  const CHECKPOINT_EVENT_ACTIONS = Object.freeze({
    ADMIT: "ADMIT",
    QUEUE: "QUEUE",
    ARCHIVE: "ARCHIVE",
    BLOCK: "BLOCK",
    DEGRADED_FORWARD: "DEGRADED_FORWARD"
  });

  const CHECKPOINT_STATUS = Object.freeze({
    PENDING: "PENDING",
    ACTIVE: "ACTIVE",
    COMPLETE: "COMPLETE",
    DEGRADED_COMPLETE: "DEGRADED_COMPLETE",
    BLOCKED: "BLOCKED",
    QUEUED: "QUEUED",
    ARCHIVED: "ARCHIVED",
    FAILED: "FAILED",
    HELD: "HELD"
  });

  const GAP_CLASS = Object.freeze({
    NONE: "NONE",
    STRUCTURAL_BLOCK: "STRUCTURAL_BLOCK",
    FALSE_COMPLETION_BLOCK: "FALSE_COMPLETION_BLOCK",
    DIAGNOSTIC_BLOCK: "DIAGNOSTIC_BLOCK",
    DEGRADED_GAP: "DEGRADED_GAP",
    HELD_GAP: "HELD_GAP",
    PROGRESS_ONLY: "PROGRESS_ONLY",
    DUPLICATE_ARCHIVE: "DUPLICATE_ARCHIVE"
  });

  const NEWS_GATES = Object.freeze({
    NORTH: "NORTH",
    EAST: "EAST",
    WEST: "WEST",
    SOUTH: "SOUTH",
    F21: "F21"
  });

  const PROGRESS_ONLY_EVENTS = Object.freeze([
    "ATLAS_BUILD_PROGRESS",
    "TEXTURE_COMPOSE_PROGRESS",
    "WIDE_PROBE_PROGRESS",
    "RECONCILE_PROGRESS"
  ]);

  const FIBONACCI_CHECKPOINTS = Object.freeze([
    {
      id: "F1A_HTML_SHELL_RENDERED",
      event: "HTML_SHELL_RENDERED",
      rank: 1,
      fibonacci: "F1A",
      value: 1,
      lane: "shell",
      progress: 6,
      label: "HTML shell rendered"
    },
    {
      id: "F1B_LOAD_LEDGER_INITIALIZED",
      event: "LOAD_LEDGER_INITIALIZED",
      aliases: [
        "HEARTH_LOAD_LEDGER_MONOTONIC_INITIALIZED",
        "NEWS_FIBONACCI_LEDGER_GUARD_ACTIVE"
      ],
      rank: 2,
      fibonacci: "F1B",
      value: 1,
      lane: "ledger",
      progress: 12,
      label: "Load ledger initialized"
    },
    {
      id: "F2_FIRST_PAINT_COCKPIT_VISIBLE",
      event: "FIRST_PAINT_COCKPIT_VISIBLE",
      rank: 3,
      fibonacci: "F2",
      value: 2,
      lane: "staticCockpit",
      progress: 22,
      label: "First-paint cockpit visible"
    },
    {
      id: "F3_SCRIPT_ORDER_COMPLETE",
      event: "SCRIPT_ORDER_COMPLETE",
      aliases: [
        "SCRIPT_LOADED",
        "SCRIPT_ORDER_VISIBLE"
      ],
      rank: 4,
      fibonacci: "F3",
      value: 3,
      lane: "scriptOrder",
      progress: 36,
      label: "Script order complete"
    },
    {
      id: "F5_AUTHORITY_AVAILABILITY_READY",
      event: "AUTHORITY_AVAILABILITY_READY",
      aliases: [
        "RUNTIME_TABLE_AVAILABLE",
        "AUTHORITY_AVAILABLE"
      ],
      rank: 5,
      fibonacci: "F5",
      value: 5,
      lane: "authorityAvailability",
      progress: 55,
      label: "Authority availability ready"
    },
    {
      id: "F8_CONDUCTOR_HYDRATED",
      event: "CONDUCTOR_HYDRATED",
      aliases: [
        "CONDUCTOR_HYDRATED_EXISTING_COCKPIT",
        "COHERENCE_SEMICONDUCTOR_BOOTED"
      ],
      rank: 6,
      fibonacci: "F8",
      value: 8,
      lane: "conductorHydration",
      progress: 72,
      label: "Conductor hydrated"
    },
    {
      id: "F13A_CANVAS_COOPERATIVE_BOOT_STARTED",
      event: "CANVAS_COOPERATIVE_BOOT_STARTED",
      rank: 7,
      fibonacci: "F13A",
      value: 13,
      lane: "canvasAndDiagnostic",
      progress: 78,
      label: "Canvas cooperative boot started"
    },
    {
      id: "F13B_CANVAS_MOUNT_CREATED",
      event: "CANVAS_MOUNT_CREATED",
      rank: 8,
      fibonacci: "F13B",
      value: 13,
      lane: "canvasAndDiagnostic",
      progress: 81,
      label: "Canvas mount created"
    },
    {
      id: "F13C_CANVAS_CONTEXT_READY",
      event: "CANVAS_CONTEXT_READY",
      rank: 9,
      fibonacci: "F13C",
      value: 13,
      lane: "canvasAndDiagnostic",
      progress: 84,
      label: "Canvas context ready"
    },
    {
      id: "F13D_DRAG_INSPECTION_BOUND",
      event: "DRAG_INSPECTION_BOUND",
      rank: 10,
      fibonacci: "F13D",
      value: 13,
      lane: "canvasAndDiagnostic",
      progress: 86,
      label: "Drag inspection bound"
    },
    {
      id: "F13E_ATLAS_BUILD_STARTED",
      event: "ATLAS_BUILD_STARTED",
      rank: 11,
      fibonacci: "F13E",
      value: 13,
      lane: "canvasAndDiagnostic",
      progress: 88,
      label: "Atlas build started"
    },
    {
      id: "F13F_ATLAS_BUILD_COMPLETE",
      event: "ATLAS_BUILD_COMPLETE",
      rank: 12,
      fibonacci: "F13F",
      value: 13,
      lane: "canvasAndDiagnostic",
      progress: 91,
      label: "Atlas build complete"
    },
    {
      id: "F13G_TEXTURE_COMPOSE_STARTED",
      event: "TEXTURE_COMPOSE_STARTED",
      rank: 13,
      fibonacci: "F13G",
      value: 13,
      lane: "canvasAndDiagnostic",
      progress: 93,
      label: "Texture compose started"
    },
    {
      id: "F13H_TEXTURE_COMPOSE_COMPLETE",
      event: "TEXTURE_COMPOSE_COMPLETE",
      rank: 14,
      fibonacci: "F13H",
      value: 13,
      lane: "canvasAndDiagnostic",
      progress: 96,
      label: "Texture compose complete"
    },
    {
      id: "F13I_FIRST_FRAME_REQUESTED",
      event: "FIRST_FRAME_REQUESTED",
      rank: 15,
      fibonacci: "F13I",
      value: 13,
      lane: "canvasAndDiagnostic",
      progress: 97,
      label: "First frame requested"
    },
    {
      id: "F13J_FIRST_FRAME_DETECTED",
      event: "FIRST_FRAME_DETECTED",
      rank: 16,
      fibonacci: "F13J",
      value: 13,
      lane: "canvasAndDiagnostic",
      progress: 98,
      label: "First frame detected"
    },
    {
      id: "F13K_CANVAS_READY",
      event: "CANVAS_READY",
      rank: 17,
      fibonacci: "F13K",
      value: 13,
      lane: "canvasAndDiagnostic",
      progress: 98,
      label: "Canvas ready"
    },
    {
      id: "F13L_VISIBLE_CONTENT_PROOF_STARTED",
      event: "VISIBLE_CONTENT_PROOF_STARTED",
      rank: 18,
      fibonacci: "F13L",
      value: 13,
      lane: "visiblePlanetProof",
      progress: 98,
      label: "Visible content proof started"
    },
    {
      id: "F13M_VISIBLE_CONTENT_PROOF_PASSED",
      event: "VISIBLE_CONTENT_PROOF_PASSED",
      aliases: [
        "DEGRADED_VISIBLE_CONTENT_ACCEPTED"
      ],
      rank: 19,
      fibonacci: "F13M",
      value: 13,
      lane: "visiblePlanetProof",
      progress: 98,
      label: "Visible content proof passed or degraded-forward accepted"
    },
    {
      id: "F13N_INSPECT_MODE_READY",
      event: "INSPECT_MODE_READY",
      aliases: [
        "DEGRADED_INSPECT_MODE_ACCEPTED"
      ],
      rank: 20,
      fibonacci: "F13N",
      value: 13,
      lane: "inspectMode",
      progress: 98,
      label: "Inspect mode ready or degraded-forward accepted"
    },
    {
      id: "F21_COMPLETION_LATCHED",
      event: "COMPLETION_LATCHED",
      aliases: [
        "COMPLETION_LATCHED_AFTER_VISIBLE_CONTENT_PROOF",
        "COMPLETION_LATCHED_AFTER_CANVAS_READY",
        "F21_DEGRADED_COMPLETION_LATCHED"
      ],
      rank: 21,
      fibonacci: "F21",
      value: 21,
      lane: "completionLatch",
      progress: 100,
      label: "Completion latched"
    }
  ]);

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

  function clonePlain(value) {
    if (!isObject(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      return { ...value };
    }
  }

  function normalizeEventSnapshot(event = {}) {
    const detail = isObject(event.detail) ? event.detail : {};
    const snapshot = isObject(event.snapshot) ? event.snapshot : {};

    return {
      ...snapshot,
      ...detail,
      ...event
    };
  }

  function getCheckpointAt(sequence, index) {
    return sequence[Math.max(0, Math.min(sequence.length - 1, index))] || null;
  }

  function normalizeCheckpointEvent(event = {}) {
    const detail = isObject(event.detail) ? event.detail : {};
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
      ...event,
      id: String(id),
      phase: String(event.phase || detail.phase || id || ""),
      event: String(event.event || event.id || detail.event || detail.id || id || ""),
      detail
    };
  }

  function checkpointMatchesEvent(checkpoint, normalizedEvent) {
    const candidates = [
      normalizedEvent.id,
      normalizedEvent.phase,
      normalizedEvent.event,
      normalizedEvent.checkpointId
    ].filter(Boolean);

    return candidates.some((candidate) => (
      candidate === checkpoint.id ||
      candidate === checkpoint.event ||
      asArray(checkpoint.aliases).includes(candidate)
    ));
  }

  function findCheckpointForEvent(sequence, normalizedEvent) {
    return sequence.find((checkpoint) => checkpointMatchesEvent(checkpoint, normalizedEvent)) || null;
  }

  function createChronologicalFibonacciPlan(options = {}) {
    const sequence = asArray(options.sequence).length ? asArray(options.sequence) : FIBONACCI_CHECKPOINTS.slice();

    return sequence
      .map((checkpoint) => ({
        ...checkpoint,
        aliases: asArray(checkpoint.aliases),
        complete: false,
        degraded: false,
        status: CHECKPOINT_STATUS.PENDING
      }))
      .sort((a, b) => a.rank - b.rank);
  }

  function createNewsFibonacciCheckpointPlan(options = {}) {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "runtime-table-east-news-fibonacci-checkpoint-plan",
      sequence: createChronologicalFibonacciPlan(options),
      newsGates: clonePlain(NEWS_GATES),
      f13CompoundSequenceRequired: true,
      f13MVisibleContentProofOrDegradedForwardRequired: true,
      f13NInspectModeOrDegradedForwardRequired: true,
      f21RequiresNewsGatesOrDegradedForward: true,
      oneActiveCheckpointAtATime: true,
      blockedProgressCap: 98,
      readyTextRequiresCompletionLatch: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function isProgressOnlyEventName(name = "") {
    return PROGRESS_ONLY_EVENTS.includes(String(name || ""));
  }

  function isFalseCompletionMutation(event = {}) {
    const text = JSON.stringify(event || {});

    return (
      text.includes('"visualPassClaimed":true') ||
      text.includes("visualPassClaimed=true") ||
      text.includes('"readyTextAllowed":true') ||
      text.includes('"mainDisplayProgress":100') ||
      text.includes('"progress":100') ||
      text.includes("READY_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE") ||
      text.includes("COMPLETION_LATCHED")
    );
  }

  function hasStructuralCarrier(snapshot = {}) {
    return Boolean(
      safeBool(snapshot.planetCanvasPresent, true) &&
      safeBool(snapshot.planetCanvasNonZeroSize, true) &&
      safeBool(snapshot.canvasCarrierMounted, true) &&
      safeBool(snapshot.canvasCarrierHandoffOk, true)
    );
  }

  function hasVisibleSurfaceSignal(snapshot = {}) {
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
      (classCount > 0 || land > 0 || water > 0 || other > 0)
    );
  }

  function hasInspectFallbackSignal(snapshot = {}) {
    return Boolean(
      safeBool(snapshot.copyDiagnosticPreserved, false) &&
      safeBool(snapshot.receiptToggleReady, false) &&
      safeBool(snapshot.diagnosticDockRestorable, false)
    );
  }

  function getWestClassifier() {
    const west =
      root.LAB_RUNTIME_TABLE_WEST ||
      root.RUNTIME_TABLE_WEST ||
      root.DEXTER_LAB_RUNTIME_TABLE_WEST ||
      null;

    if (west && typeof west.classifyGap === "function") {
      return west;
    }

    return {
      classifyGap(snapshot = {}, context = {}) {
        const checkpointId = context.checkpointId || "";
        const event = context.event || {};
        const eventName = event.event || event.id || event.phase || "";
        const completed = asArray(context.completedCheckpoints);
        const news = context.newsGateState || {};

        if (isProgressOnlyEventName(eventName)) {
          return {
            gapClass: GAP_CLASS.PROGRESS_ONLY,
            hardBlock: false,
            canDegradeForward: true,
            firstFailedCoordinate: "PROGRESS_ONLY_EVENT_ARCHIVED",
            recommendedNextRenewalTarget: "none",
            reason: "Progress-only event does not mutate checkpoint truth."
          };
        }

        if (isFalseCompletionMutation(event) && checkpointId !== "F21_COMPLETION_LATCHED") {
          return {
            gapClass: GAP_CLASS.FALSE_COMPLETION_BLOCK,
            hardBlock: true,
            canDegradeForward: false,
            firstFailedCoordinate: "FALSE_COMPLETION_MUTATION_BLOCKED",
            recommendedNextRenewalTarget: "/showroom/globe/hearth/hearth.js",
            reason: "Event attempted false ready/100/visual-pass state before lawful F21."
          };
        }

        if (!hasStructuralCarrier(snapshot)) {
          return {
            gapClass: GAP_CLASS.STRUCTURAL_BLOCK,
            hardBlock: true,
            canDegradeForward: false,
            firstFailedCoordinate: "STRUCTURAL_CARRIER_MISSING_OR_UNSAFE",
            recommendedNextRenewalTarget: "/showroom/globe/hearth/index.js",
            reason: "Carrier or canvas structure is missing or unsafe."
          };
        }

        if (checkpointId === "F13M_VISIBLE_CONTENT_PROOF_PASSED") {
          if (safeBool(snapshot.visibleContentProof, false)) {
            return {
              gapClass: GAP_CLASS.NONE,
              hardBlock: false,
              canDegradeForward: false,
              firstFailedCoordinate: "NONE_VISIBLE_CONTENT_PROOF_PASSED",
              recommendedNextRenewalTarget: "none",
              reason: "Visible content proof passed."
            };
          }

          if (hasVisibleSurfaceSignal(snapshot)) {
            return {
              gapClass: GAP_CLASS.DEGRADED_GAP,
              hardBlock: false,
              canDegradeForward: true,
              firstFailedCoordinate: "DEGRADED_VISIBLE_CONTENT_CARRIER_HEAVY_BUT_SURFACE_SIGNAL_EXISTS",
              recommendedNextRenewalTarget: "/showroom/globe/hearth/hearth.js",
              reason: "Visible content is carrier-heavy, but usable surface signal exists."
            };
          }

          return {
            gapClass: GAP_CLASS.STRUCTURAL_BLOCK,
            hardBlock: true,
            canDegradeForward: false,
            firstFailedCoordinate: "VISIBLE_CONTENT_ABSENT",
            recommendedNextRenewalTarget: "/assets/hearth/hearth.canvas.js",
            reason: "Visible content proof failed and no usable surface signal exists."
          };
        }

        if (checkpointId === "F13N_INSPECT_MODE_READY") {
          const fullInspect = Boolean(
            safeBool(snapshot.inspectModeAvailable, false) &&
            safeBool(snapshot.inspectPlanetControlAvailable, false) &&
            safeBool(snapshot.diagnosticCanLeavePlanetFrame, false) &&
            safeBool(snapshot.buttonsReachable, false)
          );

          if (fullInspect) {
            return {
              gapClass: GAP_CLASS.NONE,
              hardBlock: false,
              canDegradeForward: false,
              firstFailedCoordinate: "NONE_INSPECT_MODE_READY",
              recommendedNextRenewalTarget: "none",
              reason: "Inspect mode is fully ready."
            };
          }

          if (hasInspectFallbackSignal(snapshot)) {
            return {
              gapClass: GAP_CLASS.DEGRADED_GAP,
              hardBlock: false,
              canDegradeForward: true,
              firstFailedCoordinate: "DEGRADED_INSPECT_MODE_COPY_RECEIPT_AVAILABLE",
              recommendedNextRenewalTarget: "/showroom/globe/hearth/hearth.js",
              reason: "Inspect controls are incomplete, but receipt/copy diagnostic remains available."
            };
          }

          return {
            gapClass: GAP_CLASS.DIAGNOSTIC_BLOCK,
            hardBlock: true,
            canDegradeForward: false,
            firstFailedCoordinate: "INSPECT_AND_RECEIPT_ACCESS_MISSING",
            recommendedNextRenewalTarget: "/showroom/globe/hearth/hearth.js",
            reason: "Inspect mode and receipt fallback are both unavailable."
          };
        }

        if (checkpointId === "F21_COMPLETION_LATCHED") {
          if (completed.includes("F13N_INSPECT_MODE_READY") && news.newsGatePassedBeforeF21) {
            return {
              gapClass: GAP_CLASS.NONE,
              hardBlock: false,
              canDegradeForward: false,
              firstFailedCoordinate: "NONE_F21_FULL_LATCH_READY",
              recommendedNextRenewalTarget: "read-postgame-canvas-or-triple-g-receipt",
              reason: "Full F21 latch is lawful."
            };
          }

          if (completed.includes("F13N_INSPECT_MODE_READY") && news.newsGateDegradedBeforeF21) {
            return {
              gapClass: GAP_CLASS.DEGRADED_GAP,
              hardBlock: false,
              canDegradeForward: true,
              firstFailedCoordinate: "DEGRADED_F21_NEWS_GATE_FORWARD_ALLOWED",
              recommendedNextRenewalTarget: "/showroom/globe/hearth/hearth.js",
              reason: "F21 is not full-pass, but degraded NEWS gates are sufficient."
            };
          }

          return {
            gapClass: GAP_CLASS.FALSE_COMPLETION_BLOCK,
            hardBlock: true,
            canDegradeForward: false,
            firstFailedCoordinate: "F21_BLOCKED_NEWS_OR_F13N_INCOMPLETE",
            recommendedNextRenewalTarget: "/showroom/globe/hearth/hearth.js",
            reason: "F21 attempted before F13N and NEWS gates were resolved."
          };
        }

        return {
          gapClass: GAP_CLASS.NONE,
          hardBlock: false,
          canDegradeForward: false,
          firstFailedCoordinate: checkpointId ? `WAITING_${checkpointId}` : "NONE",
          recommendedNextRenewalTarget: "none",
          reason: "No hard gap detected."
        };
      }
    };
  }

  function evaluateNewsGateState(snapshot = {}) {
    const fullNorth = Boolean(
      safeBool(snapshot.canvasReady, false) &&
      safeBool(snapshot.atlasBuildComplete, false) &&
      safeBool(snapshot.textureComposeComplete, false) &&
      safeBool(snapshot.visibleContentProof, false) &&
      safeBool(snapshot.visiblePlanetAvailable, false)
    );

    const degradedNorth = Boolean(
      fullNorth ||
      (
        safeBool(snapshot.canvasReady, false) &&
        safeBool(snapshot.atlasBuildComplete, false) &&
        safeBool(snapshot.textureComposeComplete, false) &&
        safeBool(snapshot.imageRendered, false) &&
        safeBool(snapshot.firstFrameDetected, false) &&
        safeBool(snapshot.nonblankPlanetVisible, false) &&
        hasVisibleSurfaceSignal(snapshot)
      )
    );

    const eastGateReady = Boolean(
      safeBool(snapshot.cooperativeBootUsed, false) &&
      !safeBool(snapshot.syncBootFallbackUsed, false) &&
      safeBool(snapshot.canvasCarrierRequested, false) &&
      safeBool(snapshot.canvasCarrierHandoffOk, false)
    );

    const fullWest = Boolean(
      safeBool(snapshot.copyDiagnosticPreserved, false) &&
      safeBool(snapshot.receiptToggleReady, false) &&
      safeBool(snapshot.inspectPlanetControlAvailable, false) &&
      safeBool(snapshot.diagnosticDockRestorable, false) &&
      safeBool(snapshot.buttonsReachable, false) &&
      safeBool(snapshot.receiptOverlayIndependent, true)
    );

    const degradedWest = Boolean(
      fullWest ||
      hasInspectFallbackSignal(snapshot)
    );

    const fullSouth = Boolean(
      safeBool(snapshot.imageRendered, false) &&
      safeBool(snapshot.firstFrameDetected, false) &&
      safeBool(snapshot.dragInspectionBound, false) &&
      safeBool(snapshot.visiblePlanetAvailable, false) &&
      safeBool(snapshot.diagnosticCanLeavePlanetFrame, false)
    );

    const degradedSouth = Boolean(
      fullSouth ||
      (
        safeBool(snapshot.imageRendered, false) &&
        safeBool(snapshot.firstFrameDetected, false) &&
        safeBool(snapshot.dragInspectionBound, false) &&
        safeBool(snapshot.nonblankPlanetVisible, false)
      )
    );

    const newsGatePassedBeforeF21 = Boolean(
      fullNorth &&
      eastGateReady &&
      fullWest &&
      fullSouth
    );

    const newsGateDegradedBeforeF21 = Boolean(
      degradedNorth &&
      eastGateReady &&
      degradedWest &&
      degradedSouth
    );

    return {
      northGateReady: fullNorth,
      eastGateReady,
      westGateReady: fullWest,
      southGateReady: fullSouth,
      newsGatePassedBeforeF21,

      northGateDegradedReady: degradedNorth,
      westGateDegradedReady: degradedWest,
      southGateDegradedReady: degradedSouth,
      newsGateDegradedBeforeF21,
      degradedForwardAvailable: newsGateDegradedBeforeF21 && !newsGatePassedBeforeF21
    };
  }

  function classifyCheckpointEvent(event = {}, sessionLike = {}) {
    const sequence = asArray(sessionLike.sequence).length
      ? sessionLike.sequence
      : createChronologicalFibonacciPlan();

    const normalized = normalizeCheckpointEvent(event);
    const activeIndex = Number.isFinite(Number(sessionLike.activeIndex))
      ? Number(sessionLike.activeIndex)
      : 0;

    const activeCheckpoint = getCheckpointAt(sequence, activeIndex);
    const completionLatched = safeBool(sessionLike.completionLatched, false);
    const eventName = normalized.event || normalized.id || normalized.phase;

    if (isProgressOnlyEventName(eventName)) {
      return {
        action: CHECKPOINT_EVENT_ACTIONS.ARCHIVE,
        gapClass: GAP_CLASS.PROGRESS_ONLY,
        checkpointId: "",
        checkpointRank: 0,
        activeCheckpointId: activeCheckpoint ? activeCheckpoint.id : "",
        activeRank: activeCheckpoint ? activeCheckpoint.rank : 0,
        reason: "progress-only-event-archived-after-parent-truth",
        visibleUpdateAllowed: false,
        mayAdvance: false,
        maySetProgress: false,
        maySetReadyText: false
      };
    }

    const checkpoint = findCheckpointForEvent(sequence, normalized);

    if (!checkpoint) {
      return {
        action: CHECKPOINT_EVENT_ACTIONS.ARCHIVE,
        gapClass: GAP_CLASS.DUPLICATE_ARCHIVE,
        checkpointId: "",
        checkpointRank: 0,
        activeCheckpointId: activeCheckpoint ? activeCheckpoint.id : "",
        activeRank: activeCheckpoint ? activeCheckpoint.rank : 0,
        reason: "unknown-checkpoint-event-archived",
        visibleUpdateAllowed: false,
        mayAdvance: false,
        maySetProgress: false,
        maySetReadyText: false
      };
    }

    if (completionLatched && checkpoint.id !== "F21_COMPLETION_LATCHED") {
      return {
        action: CHECKPOINT_EVENT_ACTIONS.ARCHIVE,
        gapClass: GAP_CLASS.DUPLICATE_ARCHIVE,
        checkpointId: checkpoint.id,
        checkpointRank: checkpoint.rank,
        activeCheckpointId: activeCheckpoint ? activeCheckpoint.id : "",
        activeRank: activeCheckpoint ? activeCheckpoint.rank : 0,
        reason: "post-f21-event-archived",
        visibleUpdateAllowed: false,
        mayAdvance: false,
        maySetProgress: false,
        maySetReadyText: false
      };
    }

    if (!activeCheckpoint) {
      return {
        action: CHECKPOINT_EVENT_ACTIONS.BLOCK,
        gapClass: GAP_CLASS.STRUCTURAL_BLOCK,
        checkpointId: checkpoint.id,
        checkpointRank: checkpoint.rank,
        activeCheckpointId: "",
        activeRank: 0,
        reason: "active-checkpoint-missing",
        visibleUpdateAllowed: false,
        mayAdvance: false,
        maySetProgress: false,
        maySetReadyText: false
      };
    }

    if (checkpoint.id === "F21_COMPLETION_LATCHED") {
      const f21Allowed =
        safeBool(sessionLike.f21Allowed, false) ||
        safeBool(event.f21Allowed, false) ||
        safeBool(event.detail && event.detail.f21Allowed, false);

      const f21DegradedAllowed =
        safeBool(sessionLike.f21DegradedAllowed, false) ||
        safeBool(event.f21DegradedAllowed, false) ||
        safeBool(event.detail && event.detail.f21DegradedAllowed, false);

      if (!f21Allowed && !f21DegradedAllowed) {
        return {
          action: CHECKPOINT_EVENT_ACTIONS.BLOCK,
          gapClass: GAP_CLASS.FALSE_COMPLETION_BLOCK,
          checkpointId: checkpoint.id,
          checkpointRank: checkpoint.rank,
          activeCheckpointId: activeCheckpoint.id,
          activeRank: activeCheckpoint.rank,
          reason: "f21-blocked-until-f13n-and-news-gates-pass-or-degrade-forward",
          visibleUpdateAllowed: false,
          mayAdvance: false,
          maySetProgress: false,
          maySetReadyText: false
        };
      }
    }

    if (checkpoint.rank === activeCheckpoint.rank) {
      const allowF21Progress =
        checkpoint.id !== "F21_COMPLETION_LATCHED" ||
        safeBool(sessionLike.f21Allowed, false) ||
        safeBool(sessionLike.f21DegradedAllowed, false);

      return {
        action: CHECKPOINT_EVENT_ACTIONS.ADMIT,
        gapClass: GAP_CLASS.NONE,
        checkpointId: checkpoint.id,
        checkpointRank: checkpoint.rank,
        activeCheckpointId: activeCheckpoint.id,
        activeRank: activeCheckpoint.rank,
        reason: "event-matches-active-checkpoint",
        visibleUpdateAllowed: true,
        mayAdvance: true,
        maySetProgress: allowF21Progress,
        maySetReadyText: checkpoint.id === "F21_COMPLETION_LATCHED" && allowF21Progress
      };
    }

    if (checkpoint.rank > activeCheckpoint.rank) {
      return {
        action: CHECKPOINT_EVENT_ACTIONS.QUEUE,
        gapClass: GAP_CLASS.HELD_GAP,
        checkpointId: checkpoint.id,
        checkpointRank: checkpoint.rank,
        activeCheckpointId: activeCheckpoint.id,
        activeRank: activeCheckpoint.rank,
        reason: "future-event-queued-until-prior-checkpoint-completes",
        visibleUpdateAllowed: false,
        mayAdvance: false,
        maySetProgress: false,
        maySetReadyText: false
      };
    }

    if (isFalseCompletionMutation(event)) {
      return {
        action: CHECKPOINT_EVENT_ACTIONS.BLOCK,
        gapClass: GAP_CLASS.FALSE_COMPLETION_BLOCK,
        checkpointId: checkpoint.id,
        checkpointRank: checkpoint.rank,
        activeCheckpointId: activeCheckpoint.id,
        activeRank: activeCheckpoint.rank,
        reason: "past-event-attempted-false-completion-visible-mutation",
        visibleUpdateAllowed: false,
        mayAdvance: false,
        maySetProgress: false,
        maySetReadyText: false
      };
    }

    return {
      action: CHECKPOINT_EVENT_ACTIONS.ARCHIVE,
      gapClass: GAP_CLASS.DUPLICATE_ARCHIVE,
      checkpointId: checkpoint.id,
      checkpointRank: checkpoint.rank,
      activeCheckpointId: activeCheckpoint.id,
      activeRank: activeCheckpoint.rank,
      reason: "duplicate-or-late-completed-event-archived",
      visibleUpdateAllowed: false,
      mayAdvance: false,
      maySetProgress: false,
      maySetReadyText: false
    };
  }

  function createCheckpointSession(sequenceInput = null, options = {}) {
    const sequence = createChronologicalFibonacciPlan({
      sequence: sequenceInput || options.sequence || FIBONACCI_CHECKPOINTS
    });

    const sessionId = options.id || `${options.planetId || "planet"}-east-checkpoint-session-${Math.random().toString(36).slice(2, 9)}`;

    const state = {
      sessionId,
      contract: CONTRACT,
      receipt: RECEIPT,
      planetId: options.planetId || "",
      planetLabel: options.planetLabel || "",
      route: options.route || "",
      sequence,
      activeIndex: 0,
      highestCompletedIndex: -1,
      completedCheckpoints: [],
      degradedCheckpoints: [],
      queuedEvents: [],
      archivedEvents: [],
      blockedEvents: [],
      admittedEvents: [],
      degradedForwardEvents: [],
      regressionPrevented: 0,
      futureEventsQueued: 0,
      duplicateEventsArchived: 0,
      progressOnlyEventsArchived: 0,
      f13Events: [],
      fibonacciSequenceActive: true,
      chronologicalFibonacciAlignment: true,
      newsProtocolActive: true,
      newsGateState: evaluateNewsGateState({}),
      completionLatched: false,
      degradedCompletionLatched: false,
      progressCap: 98,
      visibleProgress: 0,
      readyTextAllowed: false,
      firstFailedCoordinate: "CHECKPOINT_SESSION_CREATED",
      recommendedNextRenewalTarget: "submit-first-checkpoint",
      latestClassification: null,
      latestGap: null,
      snapshot: {},
      errors: [],
      createdAt: nowIso(),
      updatedAt: nowIso(),
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };

    function activeCheckpoint() {
      return getCheckpointAt(state.sequence, state.activeIndex);
    }

    function updateNews(snapshot = {}) {
      state.snapshot = { ...state.snapshot, ...(snapshot || {}) };

      state.newsGateState = evaluateNewsGateState({
        ...state.snapshot,
        f13mComplete: state.completedCheckpoints.includes("F13M_VISIBLE_CONTENT_PROOF_PASSED"),
        f13nComplete: state.completedCheckpoints.includes("F13N_INSPECT_MODE_READY")
      });

      return state.newsGateState;
    }

    function f13SubsequenceComplete() {
      return state.completedCheckpoints.includes("F13N_INSPECT_MODE_READY");
    }

    function f13LastRequiredEvent() {
      return state.f13Events[state.f13Events.length - 1] || "";
    }

    function f21Allowed() {
      return Boolean(
        f13SubsequenceComplete() &&
        state.newsGateState.newsGatePassedBeforeF21 === true
      );
    }

    function classifyCurrentGap(checkpointId, event = {}) {
      const west = getWestClassifier();

      return west.classifyGap(state.snapshot, {
        checkpointId,
        activeCheckpointId: activeCheckpoint() ? activeCheckpoint().id : "",
        completedCheckpoints: state.completedCheckpoints,
        newsGateState: state.newsGateState,
        event
      });
    }

    function f21DegradedAllowed() {
      const gap = classifyCurrentGap("F21_COMPLETION_LATCHED");

      return Boolean(
        f13SubsequenceComplete() &&
        state.newsGateState.newsGateDegradedBeforeF21 === true &&
        gap.hardBlock !== true
      );
    }

    function progressForCheckpoint(checkpoint) {
      if (!checkpoint) return 0;
      if (state.completionLatched) return 100;
      if (checkpoint.id === "F21_COMPLETION_LATCHED") return 98;
      return Math.min(98, checkpoint.progress || 0);
    }

    function setFailureFromGap(gap, fallback = "") {
      if (!gap) {
        state.firstFailedCoordinate = fallback || "NONE";
        state.recommendedNextRenewalTarget = "none";
        return;
      }

      state.latestGap = clonePlain(gap);
      state.firstFailedCoordinate = gap.firstFailedCoordinate || fallback || "NONE";
      state.recommendedNextRenewalTarget =
        gap.recommendedNextRenewalTarget ||
        options.coherenceSemiconductor ||
        "/showroom/globe/hearth/hearth.js";
    }

    function setFirstFailureFromActive() {
      const active = activeCheckpoint();

      if (!active) {
        state.firstFailedCoordinate = "NONE";
        state.recommendedNextRenewalTarget = "none";
        return;
      }

      const gap = classifyCurrentGap(active.id);
      setFailureFromGap(gap, `WAITING_${active.event || active.id}`);
    }

    function completionDecision(checkpoint, event = {}) {
      const snapshot = {
        ...state.snapshot,
        ...normalizeEventSnapshot(event)
      };

      const west = getWestClassifier();
      const newsGateState = evaluateNewsGateState(snapshot);

      const gap = west.classifyGap(snapshot, {
        checkpointId: checkpoint.id,
        activeCheckpointId: checkpoint.id,
        completedCheckpoints: state.completedCheckpoints,
        newsGateState,
        event
      });

      if (gap.hardBlock) {
        return {
          complete: false,
          degraded: false,
          gap
        };
      }

      switch (checkpoint.id) {
        case "F1A_HTML_SHELL_RENDERED":
        case "F1B_LOAD_LEDGER_INITIALIZED":
        case "F2_FIRST_PAINT_COCKPIT_VISIBLE":
        case "F3_SCRIPT_ORDER_COMPLETE":
        case "F5_AUTHORITY_AVAILABILITY_READY":
        case "F8_CONDUCTOR_HYDRATED":
        case "F13A_CANVAS_COOPERATIVE_BOOT_STARTED":
        case "F13B_CANVAS_MOUNT_CREATED":
        case "F13C_CANVAS_CONTEXT_READY":
        case "F13D_DRAG_INSPECTION_BOUND":
        case "F13E_ATLAS_BUILD_STARTED":
        case "F13F_ATLAS_BUILD_COMPLETE":
        case "F13G_TEXTURE_COMPOSE_STARTED":
        case "F13H_TEXTURE_COMPOSE_COMPLETE":
        case "F13I_FIRST_FRAME_REQUESTED":
        case "F13J_FIRST_FRAME_DETECTED":
          return {
            complete: true,
            degraded: false,
            gap
          };

        case "F13K_CANVAS_READY":
          return {
            complete: Boolean(
              safeBool(snapshot.canvasReady, true) &&
              safeBool(snapshot.canvasCarrierMounted, true) &&
              safeBool(snapshot.firstFrameDetected, true) &&
              safeBool(snapshot.imageRendered, true)
            ),
            degraded: false,
            gap
          };

        case "F13L_VISIBLE_CONTENT_PROOF_STARTED":
          return {
            complete: true,
            degraded: false,
            gap
          };

        case "F13M_VISIBLE_CONTENT_PROOF_PASSED":
          if (safeBool(snapshot.visibleContentProof, false)) {
            return {
              complete: true,
              degraded: false,
              gap
            };
          }

          if (gap.canDegradeForward && hasVisibleSurfaceSignal(snapshot)) {
            return {
              complete: true,
              degraded: true,
              gap
            };
          }

          return {
            complete: false,
            degraded: false,
            gap
          };

        case "F13N_INSPECT_MODE_READY":
          if (
            safeBool(snapshot.inspectModeAvailable, false) &&
            safeBool(snapshot.inspectPlanetControlAvailable, false) &&
            safeBool(snapshot.diagnosticDockRestorable, false) &&
            safeBool(snapshot.diagnosticCanLeavePlanetFrame, false) &&
            safeBool(snapshot.showDiagnosticTabVisibleWhenHidden, false) &&
            safeBool(snapshot.copyDiagnosticPreserved, false) &&
            safeBool(snapshot.receiptToggleReady, false) &&
            safeBool(snapshot.buttonsReachable, false)
          ) {
            return {
              complete: true,
              degraded: false,
              gap
            };
          }

          if (gap.canDegradeForward && hasInspectFallbackSignal(snapshot)) {
            return {
              complete: true,
              degraded: true,
              gap
            };
          }

          return {
            complete: false,
            degraded: false,
            gap
          };

        case "F21_COMPLETION_LATCHED":
          if (f21Allowed()) {
            return {
              complete: true,
              degraded: false,
              gap
            };
          }

          if (f21DegradedAllowed()) {
            return {
              complete: true,
              degraded: true,
              gap
            };
          }

          return {
            complete: false,
            degraded: false,
            gap
          };

        default:
          return {
            complete: true,
            degraded: false,
            gap
          };
      }
    }

    function completeCheckpoint(checkpoint, event = {}, degraded = false, gap = null) {
      checkpoint.complete = true;
      checkpoint.degraded = degraded === true;
      checkpoint.status = degraded ? CHECKPOINT_STATUS.DEGRADED_COMPLETE : CHECKPOINT_STATUS.COMPLETE;
      checkpoint.completedAt = nowIso();

      if (!state.completedCheckpoints.includes(checkpoint.id)) {
        state.completedCheckpoints.push(checkpoint.id);
      }

      if (degraded && !state.degradedCheckpoints.includes(checkpoint.id)) {
        state.degradedCheckpoints.push(checkpoint.id);
      }

      state.highestCompletedIndex = Math.max(
        state.highestCompletedIndex,
        state.sequence.indexOf(checkpoint)
      );

      if (checkpoint.value === 13 && !state.f13Events.includes(checkpoint.event)) {
        state.f13Events.push(checkpoint.event);
      }

      if (checkpoint.id === "F21_COMPLETION_LATCHED") {
        state.completionLatched = true;
        state.degradedCompletionLatched = degraded === true || state.degradedCheckpoints.length > 0;
        state.progressCap = 100;
        state.visibleProgress = 100;
        state.readyTextAllowed = true;

        if (state.degradedCompletionLatched) {
          state.firstFailedCoordinate = "DEGRADED_F21_LATCHED_WITH_GAP_RECEIPT";
          state.recommendedNextRenewalTarget =
            gap && gap.recommendedNextRenewalTarget
              ? gap.recommendedNextRenewalTarget
              : options.coherenceSemiconductor || "/showroom/globe/hearth/hearth.js";
        } else {
          state.firstFailedCoordinate = "NONE_F21_FULL_LATCHED";
          state.recommendedNextRenewalTarget = "read-postgame-canvas-or-triple-g-receipt";
        }
      } else {
        state.progressCap = 98;
        state.visibleProgress = Math.max(state.visibleProgress, progressForCheckpoint(checkpoint));
        state.readyTextAllowed = false;

        const nextIndex = state.sequence.indexOf(checkpoint) + 1;
        state.activeIndex = Math.min(nextIndex, state.sequence.length - 1);

        const next = activeCheckpoint();
        if (next && !next.complete) {
          next.status = CHECKPOINT_STATUS.ACTIVE;
        }

        if (gap) {
          setFailureFromGap(gap, `WAITING_${next ? next.event || next.id : "NEXT"}`);
        } else {
          setFirstFailureFromActive();
        }
      }

      state.updatedAt = nowIso();
      flushQueue();

      return checkpoint;
    }

    function reconcileActive(reason = "reconcile-active") {
      const active = activeCheckpoint();

      if (!active || active.complete || state.completionLatched) return false;

      const decision = completionDecision(active, {
        event: active.event,
        id: active.event,
        checkpointId: active.id,
        detail: {
          reconcileReason: reason,
          ...state.snapshot
        }
      });

      if (decision.complete) {
        completeCheckpoint(active, {
          event: active.event,
          id: active.event,
          checkpointId: active.id,
          detail: {
            reconcileReason: reason
          }
        }, decision.degraded, decision.gap);

        if (decision.degraded) {
          state.degradedForwardEvents.push({
            checkpointId: active.id,
            reason,
            gap: clonePlain(decision.gap),
            at: nowIso()
          });
        }

        return true;
      }

      if (decision.gap) {
        setFailureFromGap(decision.gap, `WAITING_${active.id}`);
      }

      return false;
    }

    function flushQueue() {
      let advanced = true;
      let guard = 0;

      while (advanced && guard < 64) {
        advanced = false;
        guard += 1;

        const active = activeCheckpoint();
        if (!active) return;

        const index = state.queuedEvents.findIndex((entry) => (
          entry.classification &&
          entry.classification.checkpointId === active.id
        ));

        if (index < 0) {
          reconcileActive("queue-flush-reconcile");
          return;
        }

        const [entry] = state.queuedEvents.splice(index, 1);
        const result = submitEvent(entry.event, { fromQueue: true });

        if (
          result &&
          (
            result.action === CHECKPOINT_EVENT_ACTIONS.ADMIT ||
            result.action === CHECKPOINT_EVENT_ACTIONS.DEGRADED_FORWARD
          )
        ) {
          advanced = true;
        }
      }
    }

    function submitEvent(rawEvent = {}, submitOptions = {}) {
      const event = normalizeCheckpointEvent(rawEvent);
      const eventSnapshot = normalizeEventSnapshot(event);

      updateNews(eventSnapshot);

      const classification = classifyCheckpointEvent(event, {
        sequence: state.sequence,
        activeIndex: state.activeIndex,
        completionLatched: state.completionLatched,
        f21Allowed: f21Allowed(),
        f21DegradedAllowed: f21DegradedAllowed()
      });

      state.latestClassification = clonePlain(classification);

      const checkpoint =
        state.sequence.find((item) => item.id === classification.checkpointId) ||
        null;

      const record = {
        event: clonePlain(event),
        classification: clonePlain(classification),
        at: nowIso()
      };

      if (classification.action === CHECKPOINT_EVENT_ACTIONS.QUEUE) {
        if (!submitOptions.fromQueue) {
          state.queuedEvents.push(record);
          state.futureEventsQueued += 1;
        }

        if (checkpoint) checkpoint.status = CHECKPOINT_STATUS.QUEUED;

        state.firstFailedCoordinate = `WAITING_${classification.activeCheckpointId}`;
        state.recommendedNextRenewalTarget = "complete-active-checkpoint-first";
      }

      if (classification.action === CHECKPOINT_EVENT_ACTIONS.ARCHIVE) {
        state.archivedEvents.push(record);
        state.duplicateEventsArchived += 1;

        if (classification.gapClass === GAP_CLASS.PROGRESS_ONLY) {
          state.progressOnlyEventsArchived += 1;
        }
      }

      if (classification.action === CHECKPOINT_EVENT_ACTIONS.BLOCK) {
        state.blockedEvents.push(record);
        state.regressionPrevented += 1;

        if (checkpoint) checkpoint.status = CHECKPOINT_STATUS.BLOCKED;

        const gap = classifyCurrentGap(
          checkpoint ? checkpoint.id : classification.checkpointId,
          event
        );

        setFailureFromGap(gap, classification.reason);

        if (checkpoint && checkpoint.id === "F21_COMPLETION_LATCHED") {
          state.progressCap = 98;
          state.visibleProgress = Math.min(98, Math.max(state.visibleProgress, 98));
          state.readyTextAllowed = false;
        }
      }

      if (classification.action === CHECKPOINT_EVENT_ACTIONS.ADMIT) {
        state.admittedEvents.push(record);

        if (checkpoint) {
          checkpoint.status = CHECKPOINT_STATUS.ACTIVE;
          state.visibleProgress = Math.max(state.visibleProgress, progressForCheckpoint(checkpoint));

          const decision = completionDecision(checkpoint, event);

          if (decision.complete) {
            completeCheckpoint(checkpoint, event, decision.degraded, decision.gap);

            if (decision.degraded) {
              state.degradedForwardEvents.push({
                event: clonePlain(event),
                checkpointId: checkpoint.id,
                gap: clonePlain(decision.gap),
                at: nowIso()
              });

              classification.action = CHECKPOINT_EVENT_ACTIONS.DEGRADED_FORWARD;
              classification.gapClass = GAP_CLASS.DEGRADED_GAP;
              state.latestClassification = clonePlain(classification);
            }
          } else if (decision.gap) {
            setFailureFromGap(decision.gap, `WAITING_${checkpoint.id}`);
          }
        }
      }

      if (state.admittedEvents.length > 300) {
        state.admittedEvents.splice(0, state.admittedEvents.length - 300);
      }

      if (state.queuedEvents.length > 300) {
        state.queuedEvents.splice(0, state.queuedEvents.length - 300);
      }

      if (state.archivedEvents.length > 300) {
        state.archivedEvents.splice(0, state.archivedEvents.length - 300);
      }

      if (state.blockedEvents.length > 300) {
        state.blockedEvents.splice(0, state.blockedEvents.length - 300);
      }

      if (state.degradedForwardEvents.length > 300) {
        state.degradedForwardEvents.splice(0, state.degradedForwardEvents.length - 300);
      }

      if (!state.completionLatched) {
        state.progressCap = 98;
        state.visibleProgress = Math.min(98, state.visibleProgress);
        state.readyTextAllowed = false;
        reconcileActive("post-submit-reconcile");
      }

      updateNews(state.snapshot);

      if (!state.completionLatched) {
        setFirstFailureFromActive();
      }

      state.updatedAt = nowIso();

      return {
        ...classification,
        sessionId: state.sessionId,
        activeCheckpoint: clonePlain(activeCheckpoint()),
        completionLatched: state.completionLatched,
        degradedCompletionLatched: state.degradedCompletionLatched,
        visibleProgress: state.visibleProgress,
        progressCap: state.progressCap,
        readyTextAllowed: state.readyTextAllowed,
        firstFailedCoordinate: state.firstFailedCoordinate,
        recommendedNextRenewalTarget: state.recommendedNextRenewalTarget
      };
    }

    function submitMany(events = []) {
      return asArray(events).map((event) => submitEvent(event));
    }

    function completeActive(event = {}) {
      const active = activeCheckpoint();

      if (!active) return null;

      return submitEvent({
        ...event,
        id: active.event,
        checkpointId: active.id,
        event: active.event
      });
    }

    function canAdvanceTo(checkpointId) {
      const target = state.sequence.find((checkpoint) => checkpoint.id === checkpointId);
      const active = activeCheckpoint();

      if (!target || !active) return false;

      return target.rank <= active.rank + 1;
    }

    function getActiveCheckpoint() {
      reconcileActive("get-active-checkpoint");
      return clonePlain(activeCheckpoint());
    }

    function getCheckpointState() {
      reconcileActive("get-checkpoint-state");
      return clonePlain(state.sequence);
    }

    function getNewsGateState() {
      updateNews(state.snapshot);
      return clonePlain(state.newsGateState);
    }

    function reset() {
      state.activeIndex = 0;
      state.highestCompletedIndex = -1;
      state.completedCheckpoints = [];
      state.degradedCheckpoints = [];
      state.queuedEvents = [];
      state.archivedEvents = [];
      state.blockedEvents = [];
      state.admittedEvents = [];
      state.degradedForwardEvents = [];
      state.regressionPrevented = 0;
      state.futureEventsQueued = 0;
      state.duplicateEventsArchived = 0;
      state.progressOnlyEventsArchived = 0;
      state.f13Events = [];
      state.completionLatched = false;
      state.degradedCompletionLatched = false;
      state.progressCap = 98;
      state.visibleProgress = 0;
      state.readyTextAllowed = false;
      state.firstFailedCoordinate = "CHECKPOINT_SESSION_RESET";
      state.recommendedNextRenewalTarget = "submit-first-checkpoint";
      state.updatedAt = nowIso();

      state.sequence.forEach((checkpoint) => {
        checkpoint.complete = false;
        checkpoint.degraded = false;
        checkpoint.status = CHECKPOINT_STATUS.PENDING;
        delete checkpoint.completedAt;
      });

      if (state.sequence[0]) {
        state.sequence[0].status = CHECKPOINT_STATUS.ACTIVE;
      }

      return getReceipt();
    }

    function getReceipt() {
      reconcileActive("get-receipt");
      updateNews(state.snapshot);

      const active = activeCheckpoint();
      const highestCompleted = state.sequence[state.highestCompletedIndex] || null;

      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        checkpointSessionContract: "LAB_RUNTIME_TABLE_CARDINAL_EAST_CHECKPOINT_SESSION_v1",
        checkpointSessionReceipt: "LAB_RUNTIME_TABLE_CARDINAL_EAST_CHECKPOINT_SESSION_RECEIPT_v1",
        sessionId: state.sessionId,
        planetId: state.planetId,
        planetLabel: state.planetLabel,
        route: state.route,

        eastAuthority: true,
        eastLoaded: true,
        eastFallbackUsed: false,
        northPrecedentRequired: true,
        consumedByNorthFacade: true,

        checkpointGovernorActive: true,
        chronologicalCheckpointSession: true,
        chronologicalFibonacciAlignment: true,
        newsFibonacciAlignment: true,
        oneActiveCheckpointAtATime: true,
        futureEventsQueued: true,
        completedEventsArchived: true,
        progressOnlyEventsArchived: true,
        regressiveEventsBlocked: true,
        degradedForwardAvailable: true,
        hardBlockReservedForStructuralOrFalseCompletion: true,
        blockedProgressCap: 98,
        readyTextRequiresCompletionLatch: true,

        activeCheckpointId: active ? active.id : "",
        activeCheckpointRank: active ? active.rank : 0,
        activeCheckpointLabel: active ? active.label : "",
        activeFibonacciStage: active ? active.fibonacci : "",
        highestCompletedCheckpointId: highestCompleted ? highestCompleted.id : "",
        highestCompletedRank: highestCompleted ? highestCompleted.rank : 0,

        completionLatched: state.completionLatched,
        degradedCompletionLatched: state.degradedCompletionLatched,
        readyTextAllowed: state.readyTextAllowed,
        visibleProgress: state.visibleProgress,
        progressCap: state.progressCap,
        mainProgressCap: state.progressCap,

        queuedEventsCount: state.queuedEvents.length,
        archivedEventsCount: state.archivedEvents.length,
        blockedEventsCount: state.blockedEvents.length,
        admittedEventsCount: state.admittedEvents.length,
        degradedForwardEventsCount: state.degradedForwardEvents.length,
        regressionPrevented: state.regressionPrevented,
        futureEventsQueuedCount: state.futureEventsQueued,
        duplicateEventsArchived: state.duplicateEventsArchived,
        progressOnlyEventsArchivedCount: state.progressOnlyEventsArchived,

        newsGateState: clonePlain(state.newsGateState),
        northGateReady: state.newsGateState.northGateReady,
        eastGateReady: state.newsGateState.eastGateReady,
        westGateReady: state.newsGateState.westGateReady,
        southGateReady: state.newsGateState.southGateReady,
        newsGatePassedBeforeF21: state.newsGateState.newsGatePassedBeforeF21,
        northGateDegradedReady: state.newsGateState.northGateDegradedReady,
        westGateDegradedReady: state.newsGateState.westGateDegradedReady,
        southGateDegradedReady: state.newsGateState.southGateDegradedReady,
        newsGateDegradedBeforeF21: state.newsGateState.newsGateDegradedBeforeF21,

        f13SubsequenceComplete: f13SubsequenceComplete(),
        f13LastRequiredEvent: f13LastRequiredEvent(),
        f13Events: clonePlain(state.f13Events),
        f21Allowed: f21Allowed(),
        f21DegradedAllowed: f21DegradedAllowed(),

        firstFailedCoordinate: state.firstFailedCoordinate,
        recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
        latestClassification: clonePlain(state.latestClassification),
        latestGap: clonePlain(state.latestGap),

        completedCheckpoints: clonePlain(state.completedCheckpoints),
        degradedCheckpoints: clonePlain(state.degradedCheckpoints),
        queuedEvents: clonePlain(state.queuedEvents),
        archivedEvents: clonePlain(state.archivedEvents),
        blockedEvents: clonePlain(state.blockedEvents),
        admittedEvents: clonePlain(state.admittedEvents.slice(-80)),
        degradedForwardEvents: clonePlain(state.degradedForwardEvents.slice(-80)),
        sequence: clonePlain(state.sequence),
        snapshot: clonePlain(state.snapshot),
        errors: clonePlain(state.errors),

        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false,
        createdAt: state.createdAt,
        updatedAt: state.updatedAt
      };
    }

    function getReceiptText() {
      const receipt = getReceipt();

      const sequenceText = receipt.sequence.map((checkpoint) => (
        `- ${checkpoint.id}: rank=${checkpoint.rank}; fibonacci=${checkpoint.fibonacci}; status=${checkpoint.status}; complete=${checkpoint.complete === true}; degraded=${checkpoint.degraded === true}; progress=${checkpoint.progress}; event=${checkpoint.event}`
      )).join("\n") || "- none";

      const archived = receipt.archivedEvents.map((item) => (
        `- ${item.at} :: ${item.classification && item.classification.checkpointId ? item.classification.checkpointId : ""} :: ${item.classification && item.classification.reason ? item.classification.reason : ""}`
      )).join("\n") || "- none";

      const blocked = receipt.blockedEvents.map((item) => (
        `- ${item.at} :: ${item.classification && item.classification.checkpointId ? item.classification.checkpointId : ""} :: ${item.classification && item.classification.reason ? item.classification.reason : ""}`
      )).join("\n") || "- none";

      return [
        "LAB_RUNTIME_TABLE_CARDINAL_EAST_CHECKPOINT_SESSION_RECEIPT",
        "",
        `contract=${receipt.contract}`,
        `receipt=${receipt.receipt}`,
        `sessionId=${receipt.sessionId}`,
        `planetId=${receipt.planetId}`,
        `route=${receipt.route}`,
        "",
        `eastAuthority=${receipt.eastAuthority}`,
        `eastLoaded=${receipt.eastLoaded}`,
        `eastFallbackUsed=${receipt.eastFallbackUsed}`,
        `northPrecedentRequired=${receipt.northPrecedentRequired}`,
        `consumedByNorthFacade=${receipt.consumedByNorthFacade}`,
        "",
        `checkpointGovernorActive=${receipt.checkpointGovernorActive}`,
        `chronologicalFibonacciAlignment=${receipt.chronologicalFibonacciAlignment}`,
        `newsFibonacciAlignment=${receipt.newsFibonacciAlignment}`,
        `oneActiveCheckpointAtATime=${receipt.oneActiveCheckpointAtATime}`,
        `futureEventsQueued=${receipt.futureEventsQueued}`,
        `completedEventsArchived=${receipt.completedEventsArchived}`,
        `progressOnlyEventsArchived=${receipt.progressOnlyEventsArchived}`,
        `regressiveEventsBlocked=${receipt.regressiveEventsBlocked}`,
        `degradedForwardAvailable=${receipt.degradedForwardAvailable}`,
        `hardBlockReservedForStructuralOrFalseCompletion=${receipt.hardBlockReservedForStructuralOrFalseCompletion}`,
        `blockedProgressCap=${receipt.blockedProgressCap}`,
        `readyTextRequiresCompletionLatch=${receipt.readyTextRequiresCompletionLatch}`,
        "",
        `activeCheckpointId=${receipt.activeCheckpointId}`,
        `activeCheckpointRank=${receipt.activeCheckpointRank}`,
        `activeFibonacciStage=${receipt.activeFibonacciStage}`,
        `highestCompletedCheckpointId=${receipt.highestCompletedCheckpointId}`,
        `highestCompletedRank=${receipt.highestCompletedRank}`,
        "",
        `completionLatched=${receipt.completionLatched}`,
        `degradedCompletionLatched=${receipt.degradedCompletionLatched}`,
        `visibleProgress=${receipt.visibleProgress}`,
        `progressCap=${receipt.progressCap}`,
        "",
        `northGateReady=${receipt.northGateReady}`,
        `eastGateReady=${receipt.eastGateReady}`,
        `westGateReady=${receipt.westGateReady}`,
        `southGateReady=${receipt.southGateReady}`,
        `newsGatePassedBeforeF21=${receipt.newsGatePassedBeforeF21}`,
        `northGateDegradedReady=${receipt.northGateDegradedReady}`,
        `westGateDegradedReady=${receipt.westGateDegradedReady}`,
        `southGateDegradedReady=${receipt.southGateDegradedReady}`,
        `newsGateDegradedBeforeF21=${receipt.newsGateDegradedBeforeF21}`,
        "",
        `f13SubsequenceComplete=${receipt.f13SubsequenceComplete}`,
        `f13LastRequiredEvent=${receipt.f13LastRequiredEvent}`,
        `f21Allowed=${receipt.f21Allowed}`,
        `f21DegradedAllowed=${receipt.f21DegradedAllowed}`,
        "",
        `firstFailedCoordinate=${receipt.firstFailedCoordinate}`,
        `recommendedNextRenewalTarget=${receipt.recommendedNextRenewalTarget}`,
        "",
        `queuedEventsCount=${receipt.queuedEventsCount}`,
        `archivedEventsCount=${receipt.archivedEventsCount}`,
        `blockedEventsCount=${receipt.blockedEventsCount}`,
        `admittedEventsCount=${receipt.admittedEventsCount}`,
        `degradedForwardEventsCount=${receipt.degradedForwardEventsCount}`,
        `regressionPrevented=${receipt.regressionPrevented}`,
        `duplicateEventsArchived=${receipt.duplicateEventsArchived}`,
        `progressOnlyEventsArchivedCount=${receipt.progressOnlyEventsArchivedCount}`,
        "",
        "CHECKPOINT_SEQUENCE",
        sequenceText,
        "",
        "ARCHIVED_EVENTS",
        archived,
        "",
        "BLOCKED_EVENTS",
        blocked,
        "",
        `generatedImage=${receipt.generatedImage}`,
        `graphicBox=${receipt.graphicBox}`,
        `webGL=${receipt.webGL}`,
        `visualPassClaimed=${receipt.visualPassClaimed}`,
        "",
        `updatedAt=${receipt.updatedAt}`
      ].join("\n");
    }

    if (state.sequence[0]) {
      state.sequence[0].status = CHECKPOINT_STATUS.ACTIVE;
    }

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      sessionId: state.sessionId,
      submitEvent,
      submitMany,
      completeActive,
      canAdvanceTo,
      getActiveCheckpoint,
      getCheckpointState,
      getNewsGateState,
      getReceipt,
      getReceiptText,
      reset,
      get state() {
        return state;
      }
    };
  }

  function createHearthCheckpointSession(options = {}) {
    return createCheckpointSession(FIBONACCI_CHECKPOINTS, {
      planetId: "hearth",
      planetLabel: "Hearth",
      route: "/showroom/globe/hearth/",
      constraintSemiconductor: "/showroom/globe/hearth/index.js",
      coherenceSemiconductor: "/showroom/globe/hearth/hearth.js",
      canvasAuthority: "/assets/hearth/hearth.canvas.js",
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      ...options
    });
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      destinationFile: "/assets/lab/runtime-table.east.js",
      status: "active",
      role: "east-cardinal-checkpoint-motion-authority",
      eastAuthority: true,
      eastLoaded: true,
      eastFallbackUsed: false,
      northPrecedentRequired: true,
      consumedByNorthFacade: true,

      checkpointGovernorActive: true,
      chronologicalCheckpointSessionSupported: true,
      chronologicalFibonacciAlignment: true,
      newsFibonacciAlignment: true,
      oneActiveCheckpointAtATime: true,
      futureEventsQueued: true,
      completedEventsArchived: true,
      progressOnlyEventsArchived: true,
      regressiveEventsBlocked: true,
      degradedForwardAvailable: true,
      hardBlockReservedForStructuralOrFalseCompletion: true,
      blockedProgressCap: 98,
      readyTextRequiresCompletionLatch: true,

      f13CompoundSequenceEnforced: true,
      f13mSupportsDegradedForward: true,
      f13nSupportsDegradedForward: true,
      f21SupportsDegradedCompletion: true,
      newsGatesRequiredBeforeF21: true,

      exports: [
        "createChronologicalFibonacciPlan",
        "createNewsFibonacciCheckpointPlan",
        "classifyCheckpointEvent",
        "createCheckpointSession",
        "createHearthCheckpointSession",
        "evaluateNewsGateState",
        "getReceipt"
      ],

      chronologicalCheckpointSequence: FIBONACCI_CHECKPOINTS.map((checkpoint) => ({
        id: checkpoint.id,
        event: checkpoint.event,
        aliases: asArray(checkpoint.aliases),
        rank: checkpoint.rank,
        fibonacci: checkpoint.fibonacci,
        value: checkpoint.value,
        lane: checkpoint.lane,
        progress: checkpoint.progress,
        label: checkpoint.label
      })),

      coreLaw: [
        "East owns checkpoint motion, not public precedent.",
        "North remains the public facade and consumer authority.",
        "Events advance only through the active checkpoint unless queued.",
        "Progress-only events are archived, not hard-blocked.",
        "Duplicate completed events are archived, not treated as failures.",
        "False READY, false 100%, false visual pass, and premature F21 are blocked.",
        "F13M may degrade-forward when surface signal exists despite carrier-heavy proof.",
        "F13N may degrade-forward when copy/receipt diagnostic remains available.",
        "F21 may degrade-complete only after F13N and degraded NEWS gate satisfaction.",
        "visualPassClaimed remains false."
      ],

      doesNotOwn: [
        "North public Runtime Table facade",
        "West final gap classification",
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

    CHECKPOINT_EVENT_ACTIONS,
    CHECKPOINT_STATUS,
    GAP_CLASS,
    FIBONACCI_CHECKPOINTS,
    NEWS_GATES,

    createChronologicalFibonacciPlan,
    createNewsFibonacciCheckpointPlan,
    classifyCheckpointEvent,
    createCheckpointSession,
    createHearthCheckpointSession,
    evaluateNewsGateState,
    getReceipt,

    eastAuthority: true,
    eastLoaded: true,
    eastFallbackUsed: false,
    northPrecedentRequired: true,
    consumedByNorthFacade: true,

    checkpointGovernorActive: true,
    chronologicalCheckpointSessionSupported: true,
    chronologicalFibonacciAlignment: true,
    newsFibonacciAlignment: true,
    oneActiveCheckpointAtATime: true,
    futureEventsQueued: true,
    completedEventsArchived: true,
    progressOnlyEventsArchived: true,
    regressiveEventsBlocked: true,
    degradedForwardAvailable: true,
    hardBlockReservedForStructuralOrFalseCompletion: true,
    blockedProgressCap: 98,
    readyTextRequiresCompletionLatch: true,
    f13CompoundSequenceEnforced: true,
    f13mSupportsDegradedForward: true,
    f13nSupportsDegradedForward: true,
    f21SupportsDegradedCompletion: true,
    newsGatesRequiredBeforeF21: true,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  root.DEXTER_LAB = root.DEXTER_LAB || {};
  root.DEXTER_LAB.runtimeTableEast = api;
  root.DEXTER_LAB.cardinalRuntimeTableEast = api;
  root.DEXTER_LAB.checkpointGovernorEast = api;

  root.LAB_RUNTIME_TABLE_EAST = api;
  root.RUNTIME_TABLE_EAST = api;
  root.DEXTER_LAB_RUNTIME_TABLE_EAST = api;
  root.LAB_CARDINAL_RUNTIME_TABLE_EAST = api;
  root.LAB_CHECKPOINT_GOVERNOR_EAST = api;

  if (root.document && root.document.documentElement) {
    const dataset = root.document.documentElement.dataset;

    dataset.labRuntimeTableEastLoaded = "true";
    dataset.labRuntimeTableEastContract = CONTRACT;
    dataset.labRuntimeTableEastReceipt = RECEIPT;
    dataset.labRuntimeTableEastAuthority = "true";
    dataset.eastCheckpointMotionAuthority = "true";
    dataset.northPrecedentRequired = "true";
    dataset.eastConsumedByNorthFacade = "true";
    dataset.chronologicalFibonacciAlignment = "true";
    dataset.newsFibonacciAlignment = "true";
    dataset.oneActiveCheckpointAtATime = "true";
    dataset.futureEventsQueued = "true";
    dataset.completedEventsArchived = "true";
    dataset.progressOnlyEventsArchived = "true";
    dataset.regressiveEventsBlocked = "true";
    dataset.degradedForwardAvailable = "true";
    dataset.hardBlockReservedForStructuralOrFalseCompletion = "true";
    dataset.blockedProgressCap = "98";
    dataset.readyTextRequiresCompletionLatch = "true";
    dataset.f13mSupportsDegradedForward = "true";
    dataset.f13nSupportsDegradedForward = "true";
    dataset.f21SupportsDegradedCompletion = "true";
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

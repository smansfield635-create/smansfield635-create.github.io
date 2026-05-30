// /assets/lab/runtime-table.east.js
// LAB_RUNTIME_TABLE_CARDINAL_EAST_TRANSMISSION_MOTION_TNT_v1
// Full-file replacement.
// Cardinal East authority only.
// Purpose:
// - Own East-side transmission motion grammar behind the North Runtime Table facade.
// - Align NEWS + Fibonacci with combustion / transmission sequence.
// - Classify events for North without owning the active gear cursor.
// - Prevent old cumulative-loader checkpoint governance from competing with North.
// - Preserve legacy exports as non-governing compatibility wrappers.
// Does not own:
// - North public Runtime Table precedent
// - active gear cursor
// - visible loader percentage
// - gear transition
// - F21 completion latch
// - South visible-state language
// - West final gap taxonomy
// - planet truth
// - canvas drawing
// - atlas painting
// - runtime motion
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "LAB_RUNTIME_TABLE_CARDINAL_EAST_TRANSMISSION_MOTION_TNT_v1";
  const RECEIPT = "LAB_RUNTIME_TABLE_CARDINAL_EAST_TRANSMISSION_MOTION_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "LAB_RUNTIME_TABLE_CARDINAL_EAST_CHECKPOINT_MOTION_TNT_v1";
  const BASELINE_CONTRACT = "RUNTIME_TABLE_NEWS_CARDINAL_FOUR_FILE_SPLIT_FINAL_DRAFT_PREWRITE_v1";
  const VERSION = "2026-05-29.lab-runtime-table-cardinal-east-transmission-motion-v1";

  const root = typeof window !== "undefined" ? window : globalThis;

  const EAST_FILE = "/assets/lab/runtime-table.east.js";
  const NORTH_FILE = "/assets/lab/runtime-table.js";
  const WEST_FILE = "/assets/lab/runtime-table.west.js";
  const SOUTH_FILE = "/assets/lab/runtime-table.south.js";

  const TRANSMISSION_ACTIONS = Object.freeze({
    ADMIT_ACTIVE_GEAR_EVENT: "ADMIT_ACTIVE_GEAR_EVENT",
    QUEUE_FUTURE_GEAR_EVENT: "QUEUE_FUTURE_GEAR_EVENT",
    ARCHIVE_DUPLICATE_EVENT: "ARCHIVE_DUPLICATE_EVENT",
    ARCHIVE_PROGRESS_TICK: "ARCHIVE_PROGRESS_TICK",
    BLOCK_FALSE_COMPLETION: "BLOCK_FALSE_COMPLETION",
    UNKNOWN_EVENT: "UNKNOWN_EVENT"
  });

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
    DUPLICATE_ARCHIVE: "DUPLICATE_ARCHIVE",
    UNKNOWN: "UNKNOWN"
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
    "RECONCILE_PROGRESS",
    "CANVAS_PROGRESS",
    "LOADING_PROGRESS",
    "GEAR_PROGRESS_TICK"
  ]);

  const TRANSMISSION_GEARS = Object.freeze([
    {
      gearId: "F1A_HTML_SHELL_RENDERED",
      legacyCheckpointId: "F1A_HTML_SHELL_RENDERED",
      rank: 1,
      fibonacci: "F1A",
      value: 1,
      gearName: "Shell Ignition",
      combustionRole: "ignition",
      enginePhase: "intake-spark",
      lane: "shell",
      completionEvent: "HTML_SHELL_RENDERED",
      allowedEvents: ["HTML_SHELL_RENDERED"],
      aliases: [],
      nextGearHint: "F1B_LOAD_LEDGER_INITIALIZED"
    },
    {
      gearId: "F1B_LOAD_LEDGER_INITIALIZED",
      legacyCheckpointId: "F1B_LOAD_LEDGER_INITIALIZED",
      rank: 2,
      fibonacci: "F1B",
      value: 1,
      gearName: "Ledger Spark",
      combustionRole: "ignition",
      enginePhase: "spark-stabilization",
      lane: "ledger",
      completionEvent: "LOAD_LEDGER_INITIALIZED",
      allowedEvents: [
        "LOAD_LEDGER_INITIALIZED",
        "HEARTH_LOAD_LEDGER_MONOTONIC_INITIALIZED",
        "NEWS_FIBONACCI_LEDGER_GUARD_ACTIVE"
      ],
      aliases: [
        "HEARTH_LOAD_LEDGER_MONOTONIC_INITIALIZED",
        "NEWS_FIBONACCI_LEDGER_GUARD_ACTIVE"
      ],
      nextGearHint: "F2_FIRST_PAINT_COCKPIT_VISIBLE"
    },
    {
      gearId: "F2_FIRST_PAINT_COCKPIT_VISIBLE",
      legacyCheckpointId: "F2_FIRST_PAINT_COCKPIT_VISIBLE",
      rank: 3,
      fibonacci: "F2",
      value: 2,
      gearName: "First Paint",
      combustionRole: "first-fire",
      enginePhase: "first-visible-combustion",
      lane: "staticCockpit",
      completionEvent: "FIRST_PAINT_COCKPIT_VISIBLE",
      allowedEvents: ["FIRST_PAINT_COCKPIT_VISIBLE"],
      aliases: [],
      nextGearHint: "F3_SCRIPT_ORDER_COMPLETE"
    },
    {
      gearId: "F3_SCRIPT_ORDER_COMPLETE",
      legacyCheckpointId: "F3_SCRIPT_ORDER_COMPLETE",
      rank: 4,
      fibonacci: "F3",
      value: 3,
      gearName: "Script Compression",
      combustionRole: "compression",
      enginePhase: "ordered-script-pressure",
      lane: "scriptOrder",
      completionEvent: "SCRIPT_ORDER_COMPLETE",
      allowedEvents: [
        "SCRIPT_ORDER_COMPLETE",
        "SCRIPT_LOADED",
        "SCRIPT_ORDER_VISIBLE"
      ],
      aliases: [
        "SCRIPT_LOADED",
        "SCRIPT_ORDER_VISIBLE"
      ],
      nextGearHint: "F5_AUTHORITY_AVAILABILITY_READY"
    },
    {
      gearId: "F5_AUTHORITY_AVAILABILITY_READY",
      legacyCheckpointId: "F5_AUTHORITY_AVAILABILITY_READY",
      rank: 5,
      fibonacci: "F5",
      value: 5,
      gearName: "Authority Intake",
      combustionRole: "compression",
      enginePhase: "authority-availability-pressure",
      lane: "authorityAvailability",
      completionEvent: "AUTHORITY_AVAILABILITY_READY",
      allowedEvents: [
        "AUTHORITY_AVAILABILITY_READY",
        "RUNTIME_TABLE_AVAILABLE",
        "AUTHORITY_AVAILABLE",
        "INDEX_HANDOFF_ACCEPTED",
        "S2_INDEX_HANDOFF_ACCEPTED",
        "WEST_HANDOFF_ACCEPTED"
      ],
      aliases: [
        "RUNTIME_TABLE_AVAILABLE",
        "AUTHORITY_AVAILABLE",
        "INDEX_HANDOFF_ACCEPTED",
        "S2_INDEX_HANDOFF_ACCEPTED",
        "WEST_HANDOFF_ACCEPTED"
      ],
      nextGearHint: "F8_CONDUCTOR_HYDRATED"
    },
    {
      gearId: "F8_CONDUCTOR_HYDRATED",
      legacyCheckpointId: "F8_CONDUCTOR_HYDRATED",
      rank: 6,
      fibonacci: "F8",
      value: 8,
      gearName: "Conductor Hydration",
      combustionRole: "compression-to-combustion",
      enginePhase: "handoff-body-hydration",
      lane: "conductorHydration",
      completionEvent: "CONDUCTOR_HYDRATED",
      allowedEvents: [
        "CONDUCTOR_HYDRATED",
        "CONDUCTOR_HYDRATED_EXISTING_COCKPIT",
        "COHERENCE_SEMICONDUCTOR_BOOTED"
      ],
      aliases: [
        "CONDUCTOR_HYDRATED_EXISTING_COCKPIT",
        "COHERENCE_SEMICONDUCTOR_BOOTED"
      ],
      nextGearHint: "F13A_CANVAS_COOPERATIVE_BOOT_STARTED"
    },
    {
      gearId: "F13A_CANVAS_COOPERATIVE_BOOT_STARTED",
      legacyCheckpointId: "F13A_CANVAS_COOPERATIVE_BOOT_STARTED",
      rank: 7,
      fibonacci: "F13A",
      value: 13,
      gearName: "Canvas Cooperative Boot",
      combustionRole: "combustion",
      enginePhase: "canvas-ignition",
      lane: "canvasAndDiagnostic",
      completionEvent: "CANVAS_COOPERATIVE_BOOT_STARTED",
      allowedEvents: ["CANVAS_COOPERATIVE_BOOT_STARTED"],
      aliases: [],
      nextGearHint: "F13B_CANVAS_MOUNT_CREATED"
    },
    {
      gearId: "F13B_CANVAS_MOUNT_CREATED",
      legacyCheckpointId: "F13B_CANVAS_MOUNT_CREATED",
      rank: 8,
      fibonacci: "F13B",
      value: 13,
      gearName: "Canvas Mount",
      combustionRole: "combustion",
      enginePhase: "canvas-body-seating",
      lane: "canvasAndDiagnostic",
      completionEvent: "CANVAS_MOUNT_CREATED",
      allowedEvents: ["CANVAS_MOUNT_CREATED", "CANVAS_MOUNT_CONFIRMED"],
      aliases: ["CANVAS_MOUNT_CONFIRMED"],
      nextGearHint: "F13C_CANVAS_CONTEXT_READY"
    },
    {
      gearId: "F13C_CANVAS_CONTEXT_READY",
      legacyCheckpointId: "F13C_CANVAS_CONTEXT_READY",
      rank: 9,
      fibonacci: "F13C",
      value: 13,
      gearName: "Canvas Context",
      combustionRole: "combustion",
      enginePhase: "canvas-pressure-ready",
      lane: "canvasAndDiagnostic",
      completionEvent: "CANVAS_CONTEXT_READY",
      allowedEvents: ["CANVAS_CONTEXT_READY"],
      aliases: [],
      nextGearHint: "F13D_DRAG_INSPECTION_BOUND"
    },
    {
      gearId: "F13D_DRAG_INSPECTION_BOUND",
      legacyCheckpointId: "F13D_DRAG_INSPECTION_BOUND",
      rank: 10,
      fibonacci: "F13D",
      value: 13,
      gearName: "Drag Inspection",
      combustionRole: "combustion",
      enginePhase: "controls-linkage-bound",
      lane: "canvasAndDiagnostic",
      completionEvent: "DRAG_INSPECTION_BOUND",
      allowedEvents: ["DRAG_INSPECTION_BOUND"],
      aliases: [],
      nextGearHint: "F13E_ATLAS_BUILD_STARTED"
    },
    {
      gearId: "F13E_ATLAS_BUILD_STARTED",
      legacyCheckpointId: "F13E_ATLAS_BUILD_STARTED",
      rank: 11,
      fibonacci: "F13E",
      value: 13,
      gearName: "Atlas Start",
      combustionRole: "combustion",
      enginePhase: "atlas-ignition",
      lane: "canvasAndDiagnostic",
      completionEvent: "ATLAS_BUILD_STARTED",
      allowedEvents: ["ATLAS_BUILD_STARTED"],
      aliases: [],
      nextGearHint: "F13F_ATLAS_BUILD_COMPLETE"
    },
    {
      gearId: "F13F_ATLAS_BUILD_COMPLETE",
      legacyCheckpointId: "F13F_ATLAS_BUILD_COMPLETE",
      rank: 12,
      fibonacci: "F13F",
      value: 13,
      gearName: "Atlas Complete",
      combustionRole: "combustion",
      enginePhase: "atlas-pressure-complete",
      lane: "canvasAndDiagnostic",
      completionEvent: "ATLAS_BUILD_COMPLETE",
      allowedEvents: ["ATLAS_BUILD_COMPLETE"],
      aliases: [],
      nextGearHint: "F13G_TEXTURE_COMPOSE_STARTED"
    },
    {
      gearId: "F13G_TEXTURE_COMPOSE_STARTED",
      legacyCheckpointId: "F13G_TEXTURE_COMPOSE_STARTED",
      rank: 13,
      fibonacci: "F13G",
      value: 13,
      gearName: "Texture Compose Start",
      combustionRole: "combustion",
      enginePhase: "texture-mix-ignition",
      lane: "canvasAndDiagnostic",
      completionEvent: "TEXTURE_COMPOSE_STARTED",
      allowedEvents: ["TEXTURE_COMPOSE_STARTED"],
      aliases: [],
      nextGearHint: "F13H_TEXTURE_COMPOSE_COMPLETE"
    },
    {
      gearId: "F13H_TEXTURE_COMPOSE_COMPLETE",
      legacyCheckpointId: "F13H_TEXTURE_COMPOSE_COMPLETE",
      rank: 14,
      fibonacci: "F13H",
      value: 13,
      gearName: "Texture Compose Complete",
      combustionRole: "combustion",
      enginePhase: "texture-mix-complete",
      lane: "canvasAndDiagnostic",
      completionEvent: "TEXTURE_COMPOSE_COMPLETE",
      allowedEvents: ["TEXTURE_COMPOSE_COMPLETE"],
      aliases: [],
      nextGearHint: "F13I_FIRST_FRAME_REQUESTED"
    },
    {
      gearId: "F13I_FIRST_FRAME_REQUESTED",
      legacyCheckpointId: "F13I_FIRST_FRAME_REQUESTED",
      rank: 15,
      fibonacci: "F13I",
      value: 13,
      gearName: "First Frame Request",
      combustionRole: "combustion-output",
      enginePhase: "first-output-request",
      lane: "canvasAndDiagnostic",
      completionEvent: "FIRST_FRAME_REQUESTED",
      allowedEvents: ["FIRST_FRAME_REQUESTED"],
      aliases: [],
      nextGearHint: "F13J_FIRST_FRAME_DETECTED"
    },
    {
      gearId: "F13J_FIRST_FRAME_DETECTED",
      legacyCheckpointId: "F13J_FIRST_FRAME_DETECTED",
      rank: 16,
      fibonacci: "F13J",
      value: 13,
      gearName: "First Frame Detected",
      combustionRole: "combustion-output",
      enginePhase: "first-output-proof",
      lane: "canvasAndDiagnostic",
      completionEvent: "FIRST_FRAME_DETECTED",
      allowedEvents: ["FIRST_FRAME_DETECTED"],
      aliases: [],
      nextGearHint: "F13K_CANVAS_READY"
    },
    {
      gearId: "F13K_CANVAS_READY",
      legacyCheckpointId: "F13K_CANVAS_READY",
      rank: 17,
      fibonacci: "F13K",
      value: 13,
      gearName: "Canvas Ready",
      combustionRole: "combustion-output",
      enginePhase: "canvas-output-stable",
      lane: "canvasAndDiagnostic",
      completionEvent: "CANVAS_READY",
      allowedEvents: ["CANVAS_READY"],
      aliases: [],
      nextGearHint: "F13L_VISIBLE_CONTENT_PROOF_STARTED"
    },
    {
      gearId: "F13L_VISIBLE_CONTENT_PROOF_STARTED",
      legacyCheckpointId: "F13L_VISIBLE_CONTENT_PROOF_STARTED",
      rank: 18,
      fibonacci: "F13L",
      value: 13,
      gearName: "Visible Proof Start",
      combustionRole: "exhaust-audit",
      enginePhase: "visible-proof-start",
      lane: "visiblePlanetProof",
      completionEvent: "VISIBLE_CONTENT_PROOF_STARTED",
      allowedEvents: ["VISIBLE_CONTENT_PROOF_STARTED"],
      aliases: [],
      nextGearHint: "F13M_VISIBLE_CONTENT_PROOF_PASSED"
    },
    {
      gearId: "F13M_VISIBLE_CONTENT_PROOF_PASSED",
      legacyCheckpointId: "F13M_VISIBLE_CONTENT_PROOF_PASSED",
      rank: 19,
      fibonacci: "F13M",
      value: 13,
      gearName: "Visible Proof Pass",
      combustionRole: "exhaust-audit",
      enginePhase: "visible-proof-admission",
      lane: "visiblePlanetProof",
      completionEvent: "VISIBLE_CONTENT_PROOF_PASSED",
      allowedEvents: [
        "VISIBLE_CONTENT_PROOF_PASSED",
        "DEGRADED_VISIBLE_CONTENT_ACCEPTED"
      ],
      aliases: ["DEGRADED_VISIBLE_CONTENT_ACCEPTED"],
      nextGearHint: "F13N_INSPECT_MODE_READY"
    },
    {
      gearId: "F13N_INSPECT_MODE_READY",
      legacyCheckpointId: "F13N_INSPECT_MODE_READY",
      rank: 20,
      fibonacci: "F13N",
      value: 13,
      gearName: "Inspect Mode Ready",
      combustionRole: "exhaust-audit",
      enginePhase: "inspect-and-receipt-access",
      lane: "inspectMode",
      completionEvent: "INSPECT_MODE_READY",
      allowedEvents: [
        "INSPECT_MODE_READY",
        "DEGRADED_INSPECT_MODE_ACCEPTED"
      ],
      aliases: ["DEGRADED_INSPECT_MODE_ACCEPTED"],
      nextGearHint: "F21_COMPLETION_LATCHED"
    },
    {
      gearId: "F21_COMPLETION_LATCHED",
      legacyCheckpointId: "F21_COMPLETION_LATCHED",
      rank: 21,
      fibonacci: "F21",
      value: 21,
      gearName: "Completion Latch",
      combustionRole: "output-latch",
      enginePhase: "final-output-latch",
      lane: "completionLatch",
      completionEvent: "COMPLETION_LATCHED",
      allowedEvents: [
        "COMPLETION_LATCHED",
        "COMPLETION_LATCHED_AFTER_VISIBLE_CONTENT_PROOF",
        "COMPLETION_LATCHED_AFTER_CANVAS_READY",
        "F21_DEGRADED_COMPLETION_LATCHED"
      ],
      aliases: [
        "COMPLETION_LATCHED_AFTER_VISIBLE_CONTENT_PROOF",
        "COMPLETION_LATCHED_AFTER_CANVAS_READY",
        "F21_DEGRADED_COMPLETION_LATCHED"
      ],
      nextGearHint: ""
    }
  ]);

  const GEAR_BY_ID = new Map();
  const GEAR_BY_EVENT = new Map();

  TRANSMISSION_GEARS.forEach((gear) => {
    GEAR_BY_ID.set(gear.gearId, gear);
    GEAR_BY_ID.set(gear.legacyCheckpointId, gear);
    GEAR_BY_EVENT.set(gear.completionEvent, gear);
    gear.allowedEvents.forEach((eventName) => GEAR_BY_EVENT.set(eventName, gear));
    gear.aliases.forEach((eventName) => GEAR_BY_EVENT.set(eventName, gear));
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

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === "true") return true;
    if (value === "false") return false;
    return fallback;
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
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

  function normalizeTransmissionEvent(event = {}) {
    const detail = isObject(event.detail) ? event.detail : {};
    const snapshot = isObject(event.snapshot) ? event.snapshot : {};

    const id =
      event.gearEvent ||
      event.checkpointId ||
      event.phase ||
      event.id ||
      event.event ||
      detail.gearEvent ||
      detail.checkpointId ||
      detail.phase ||
      detail.id ||
      detail.event ||
      "";

    const eventName = String(
      event.event ||
      event.id ||
      event.phase ||
      detail.event ||
      detail.id ||
      detail.phase ||
      id ||
      ""
    );

    return {
      raw: clonePlain(event),
      id: String(id),
      event: eventName,
      phase: String(event.phase || detail.phase || eventName || ""),
      checkpointId: String(event.checkpointId || detail.checkpointId || id || ""),
      gearEvent: String(event.gearEvent || detail.gearEvent || eventName || id || ""),
      detail,
      snapshot,
      submittedAt: nowIso()
    };
  }

  function isProgressOnlyEvent(eventOrName = "") {
    const eventName = typeof eventOrName === "string"
      ? eventOrName
      : normalizeTransmissionEvent(eventOrName).event;

    return PROGRESS_ONLY_EVENTS.includes(String(eventName || ""));
  }

  function isFalseCompletionMutation(event = {}) {
    const text = JSON.stringify(event || {});

    return (
      text.includes('"visualPassClaimed":true') ||
      text.includes("visualPassClaimed=true") ||
      text.includes('"readyTextAllowed":true') ||
      text.includes('"mainDisplayProgress":100') ||
      text.includes('"visibleProgress":100') ||
      text.includes('"progress":100') ||
      text.includes("READY_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE") ||
      text.includes("READY_DEGRADED_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE") ||
      text.includes("COMPLETION_LATCHED")
    );
  }

  function mapEventToGear(eventOrName = {}) {
    const normalized = typeof eventOrName === "string"
      ? { event: eventOrName, id: eventOrName, phase: eventOrName, checkpointId: eventOrName, gearEvent: eventOrName }
      : normalizeTransmissionEvent(eventOrName);

    const candidates = [
      normalized.gearEvent,
      normalized.checkpointId,
      normalized.phase,
      normalized.id,
      normalized.event
    ].filter(Boolean);

    for (const candidate of candidates) {
      if (GEAR_BY_ID.has(candidate)) return GEAR_BY_ID.get(candidate);
      if (GEAR_BY_EVENT.has(candidate)) return GEAR_BY_EVENT.get(candidate);
    }

    return null;
  }

  function getGearById(id) {
    if (!id) return null;
    return GEAR_BY_ID.get(String(id)) || null;
  }

  function getActiveGearFromContext(context = {}) {
    const active =
      context.activeGear ||
      context.activeCheckpoint ||
      context.currentGear ||
      null;

    const id =
      context.activeGearId ||
      context.currentGearId ||
      context.activeCheckpointId ||
      context.currentCheckpointId ||
      (active && (active.gearId || active.id || active.checkpointId)) ||
      "";

    if (id) {
      const byId = getGearById(id);
      if (byId) return byId;
    }

    const rank =
      safeNumber(context.activeGearRank, NaN) ||
      safeNumber(context.activeCheckpointRank, NaN) ||
      safeNumber(active && active.rank, NaN);

    if (Number.isFinite(rank)) {
      return TRANSMISSION_GEARS.find((gear) => gear.rank === rank) || null;
    }

    return null;
  }

  function completedGearSet(context = {}) {
    const values = [
      ...asArray(context.completedGearIds),
      ...asArray(context.completedGears),
      ...asArray(context.completedCheckpointIds),
      ...asArray(context.completedCheckpoints)
    ];

    return new Set(values.map((item) => {
      if (typeof item === "string") return item;
      if (item && item.gearId) return item.gearId;
      if (item && item.id) return item.id;
      if (item && item.checkpointId) return item.checkpointId;
      return String(item || "");
    }).filter(Boolean));
  }

  function f21AllowedFromContext(context = {}, normalizedEvent = {}) {
    const detail = normalizedEvent.detail || {};
    const snapshot = normalizedEvent.snapshot || {};

    return Boolean(
      safeBool(context.f21Allowed, false) ||
      safeBool(context.f21DegradedAllowed, false) ||
      safeBool(context.newsGatePassedBeforeF21, false) ||
      safeBool(context.newsGateDegradedBeforeF21, false) ||
      safeBool(detail.f21Allowed, false) ||
      safeBool(detail.f21DegradedAllowed, false) ||
      safeBool(detail.newsGatePassedBeforeF21, false) ||
      safeBool(detail.newsGateDegradedBeforeF21, false) ||
      safeBool(snapshot.f21Allowed, false) ||
      safeBool(snapshot.f21DegradedAllowed, false)
    );
  }

  function mapFibonacciToCombustion(symbol = "") {
    const value = String(symbol || "").toUpperCase();

    if (value.startsWith("F1A")) {
      return {
        fibonacci: "F1A",
        combustionRole: "ignition",
        enginePhase: "shell ignition",
        transmissionMeaning: "first spark; create visible shell"
      };
    }

    if (value.startsWith("F1B")) {
      return {
        fibonacci: "F1B",
        combustionRole: "ignition",
        enginePhase: "ledger spark",
        transmissionMeaning: "stabilize initial ledger"
      };
    }

    if (value.startsWith("F2")) {
      return {
        fibonacci: "F2",
        combustionRole: "first-fire",
        enginePhase: "first visible combustion",
        transmissionMeaning: "prove first-paint cockpit"
      };
    }

    if (value.startsWith("F3")) {
      return {
        fibonacci: "F3",
        combustionRole: "compression",
        enginePhase: "script-order compression",
        transmissionMeaning: "prove ordered script authority"
      };
    }

    if (value.startsWith("F5")) {
      return {
        fibonacci: "F5",
        combustionRole: "compression",
        enginePhase: "authority availability",
        transmissionMeaning: "prove authority handoff"
      };
    }

    if (value.startsWith("F8")) {
      return {
        fibonacci: "F8",
        combustionRole: "compression-to-combustion",
        enginePhase: "conductor hydration",
        transmissionMeaning: "hydrate the conductor before canvas combustion"
      };
    }

    if (value.startsWith("F13")) {
      return {
        fibonacci: value,
        combustionRole: "combustion",
        enginePhase: "canvas / atlas / texture / proof sequence",
        transmissionMeaning: "run active canvas gear as a local 0-to-100 cycle"
      };
    }

    if (value.startsWith("F21")) {
      return {
        fibonacci: "F21",
        combustionRole: "output-latch",
        enginePhase: "completion latch",
        transmissionMeaning: "final output latch after North permits closure"
      };
    }

    return {
      fibonacci: value,
      combustionRole: "unknown",
      enginePhase: "unknown",
      transmissionMeaning: "unmapped Fibonacci symbol"
    };
  }

  function makeMotionHint(targetGear, normalizedEvent, action) {
    if (!targetGear) {
      return {
        localProgressHint: 0,
        localProgressMeaning: "no mapped gear",
        gearMayComplete: false,
        nextGearHint: "",
        combustion: mapFibonacciToCombustion("")
      };
    }

    const completionMatched = targetGear.allowedEvents.includes(normalizedEvent.event) ||
      targetGear.allowedEvents.includes(normalizedEvent.id) ||
      targetGear.allowedEvents.includes(normalizedEvent.phase) ||
      targetGear.allowedEvents.includes(normalizedEvent.checkpointId) ||
      targetGear.completionEvent === normalizedEvent.event ||
      targetGear.completionEvent === normalizedEvent.id ||
      targetGear.completionEvent === normalizedEvent.phase ||
      targetGear.completionEvent === normalizedEvent.checkpointId;

    const mayComplete = action === TRANSMISSION_ACTIONS.ADMIT_ACTIVE_GEAR_EVENT && completionMatched;

    return {
      localProgressHint: mayComplete ? 100 : action === TRANSMISSION_ACTIONS.ADMIT_ACTIVE_GEAR_EVENT ? 50 : 0,
      localProgressMeaning: mayComplete
        ? "East sees a completion event for the active gear; North decides whether to shift."
        : action === TRANSMISSION_ACTIONS.ADMIT_ACTIVE_GEAR_EVENT
          ? "East sees an active-gear event; North owns the final gear transition."
          : "No visible progress mutation authorized by East.",
      gearMayComplete: mayComplete,
      nextGearHint: mayComplete ? targetGear.nextGearHint : "",
      combustion: mapFibonacciToCombustion(targetGear.fibonacci)
    };
  }

  function classifyTransmissionEvent(event = {}, context = {}) {
    const normalized = normalizeTransmissionEvent(event);
    const targetGear = mapEventToGear(event);
    const activeGear = getActiveGearFromContext(context);
    const completed = completedGearSet(context);
    const completionLatched = safeBool(context.completionLatched, false);

    if (isProgressOnlyEvent(normalized.event)) {
      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        action: TRANSMISSION_ACTIONS.ARCHIVE_PROGRESS_TICK,
        legacyAction: CHECKPOINT_EVENT_ACTIONS.ARCHIVE,
        gapClass: GAP_CLASS.PROGRESS_ONLY,
        reason: "progress-only-event-archived-no-gear-state-mutation",
        event: clonePlain(normalized),
        targetGear: null,
        activeGear: clonePlain(activeGear),
        targetRank: 0,
        activeRank: activeGear ? activeGear.rank : 0,
        visibleUpdateAllowed: false,
        northMustDecide: true,
        eastOwnsProgress: false,
        maySetVisibleProgress: false,
        maySetReadyText: false,
        falseCompletionBlocked: false,
        motionHint: makeMotionHint(null, normalized, TRANSMISSION_ACTIONS.ARCHIVE_PROGRESS_TICK),
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false,
        classifiedAt: nowIso()
      };
    }

    if (!targetGear) {
      const falseMutation = isFalseCompletionMutation(event);

      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        action: falseMutation ? TRANSMISSION_ACTIONS.BLOCK_FALSE_COMPLETION : TRANSMISSION_ACTIONS.UNKNOWN_EVENT,
        legacyAction: falseMutation ? CHECKPOINT_EVENT_ACTIONS.BLOCK : CHECKPOINT_EVENT_ACTIONS.ARCHIVE,
        gapClass: falseMutation ? GAP_CLASS.FALSE_COMPLETION_BLOCK : GAP_CLASS.UNKNOWN,
        reason: falseMutation
          ? "unknown-event-contained-false-completion-mutation"
          : "unknown-event-classified-neutral-no-hard-block",
        event: clonePlain(normalized),
        targetGear: null,
        activeGear: clonePlain(activeGear),
        targetRank: 0,
        activeRank: activeGear ? activeGear.rank : 0,
        visibleUpdateAllowed: false,
        northMustDecide: true,
        eastOwnsProgress: false,
        maySetVisibleProgress: false,
        maySetReadyText: false,
        falseCompletionBlocked: falseMutation,
        motionHint: makeMotionHint(null, normalized, falseMutation ? TRANSMISSION_ACTIONS.BLOCK_FALSE_COMPLETION : TRANSMISSION_ACTIONS.UNKNOWN_EVENT),
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false,
        classifiedAt: nowIso()
      };
    }

    const f21Target = targetGear.gearId === "F21_COMPLETION_LATCHED";
    const f21Allowed = f21AllowedFromContext(context, normalized);

    if (f21Target && !f21Allowed) {
      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        action: TRANSMISSION_ACTIONS.BLOCK_FALSE_COMPLETION,
        legacyAction: CHECKPOINT_EVENT_ACTIONS.BLOCK,
        gapClass: GAP_CLASS.FALSE_COMPLETION_BLOCK,
        reason: "f21-event-blocked-until-north-permits-full-or-degraded-latch",
        event: clonePlain(normalized),
        targetGear: clonePlain(targetGear),
        activeGear: clonePlain(activeGear),
        targetRank: targetGear.rank,
        activeRank: activeGear ? activeGear.rank : 0,
        visibleUpdateAllowed: false,
        northMustDecide: true,
        eastOwnsProgress: false,
        maySetVisibleProgress: false,
        maySetReadyText: false,
        falseCompletionBlocked: true,
        motionHint: makeMotionHint(targetGear, normalized, TRANSMISSION_ACTIONS.BLOCK_FALSE_COMPLETION),
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false,
        classifiedAt: nowIso()
      };
    }

    if (!f21Target && isFalseCompletionMutation(event)) {
      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        action: TRANSMISSION_ACTIONS.BLOCK_FALSE_COMPLETION,
        legacyAction: CHECKPOINT_EVENT_ACTIONS.BLOCK,
        gapClass: GAP_CLASS.FALSE_COMPLETION_BLOCK,
        reason: "false-ready-100-or-visual-pass-mutation-blocked-before-f21",
        event: clonePlain(normalized),
        targetGear: clonePlain(targetGear),
        activeGear: clonePlain(activeGear),
        targetRank: targetGear.rank,
        activeRank: activeGear ? activeGear.rank : 0,
        visibleUpdateAllowed: false,
        northMustDecide: true,
        eastOwnsProgress: false,
        maySetVisibleProgress: false,
        maySetReadyText: false,
        falseCompletionBlocked: true,
        motionHint: makeMotionHint(targetGear, normalized, TRANSMISSION_ACTIONS.BLOCK_FALSE_COMPLETION),
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false,
        classifiedAt: nowIso()
      };
    }

    if (completionLatched && !f21Target) {
      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        action: TRANSMISSION_ACTIONS.ARCHIVE_DUPLICATE_EVENT,
        legacyAction: CHECKPOINT_EVENT_ACTIONS.ARCHIVE,
        gapClass: GAP_CLASS.DUPLICATE_ARCHIVE,
        reason: "post-f21-non-f21-event-archived",
        event: clonePlain(normalized),
        targetGear: clonePlain(targetGear),
        activeGear: clonePlain(activeGear),
        targetRank: targetGear.rank,
        activeRank: activeGear ? activeGear.rank : 0,
        visibleUpdateAllowed: false,
        northMustDecide: true,
        eastOwnsProgress: false,
        maySetVisibleProgress: false,
        maySetReadyText: false,
        falseCompletionBlocked: false,
        motionHint: makeMotionHint(targetGear, normalized, TRANSMISSION_ACTIONS.ARCHIVE_DUPLICATE_EVENT),
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false,
        classifiedAt: nowIso()
      };
    }

    if (!activeGear) {
      const action = TRANSMISSION_ACTIONS.ADMIT_ACTIVE_GEAR_EVENT;

      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        action,
        legacyAction: CHECKPOINT_EVENT_ACTIONS.ADMIT,
        gapClass: GAP_CLASS.NONE,
        reason: "no-active-gear-context-provided-east-classifies-target-for-north-review",
        event: clonePlain(normalized),
        targetGear: clonePlain(targetGear),
        activeGear: null,
        targetRank: targetGear.rank,
        activeRank: 0,
        visibleUpdateAllowed: false,
        northMustDecide: true,
        eastOwnsProgress: false,
        maySetVisibleProgress: false,
        maySetReadyText: false,
        falseCompletionBlocked: false,
        motionHint: makeMotionHint(targetGear, normalized, action),
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false,
        classifiedAt: nowIso()
      };
    }

    let action = TRANSMISSION_ACTIONS.UNKNOWN_EVENT;
    let legacyAction = CHECKPOINT_EVENT_ACTIONS.ARCHIVE;
    let gapClass = GAP_CLASS.UNKNOWN;
    let reason = "unclassified-transmission-event";
    let visibleUpdateAllowed = false;

    if (targetGear.rank === activeGear.rank) {
      action = TRANSMISSION_ACTIONS.ADMIT_ACTIVE_GEAR_EVENT;
      legacyAction = CHECKPOINT_EVENT_ACTIONS.ADMIT;
      gapClass = GAP_CLASS.NONE;
      reason = "event-matches-active-transmission-gear";
      visibleUpdateAllowed = true;
    } else if (targetGear.rank > activeGear.rank) {
      action = TRANSMISSION_ACTIONS.QUEUE_FUTURE_GEAR_EVENT;
      legacyAction = CHECKPOINT_EVENT_ACTIONS.QUEUE;
      gapClass = GAP_CLASS.HELD_GAP;
      reason = "future-gear-event-queued-until-current-gear-closes";
    } else if (targetGear.rank < activeGear.rank || completed.has(targetGear.gearId) || completed.has(targetGear.legacyCheckpointId)) {
      action = TRANSMISSION_ACTIONS.ARCHIVE_DUPLICATE_EVENT;
      legacyAction = CHECKPOINT_EVENT_ACTIONS.ARCHIVE;
      gapClass = GAP_CLASS.DUPLICATE_ARCHIVE;
      reason = "past-or-completed-gear-event-archived";
    }

    const motionHint = makeMotionHint(targetGear, normalized, action);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      action,
      legacyAction,
      gapClass,
      reason,
      event: clonePlain(normalized),
      targetGear: clonePlain(targetGear),
      activeGear: clonePlain(activeGear),
      targetRank: targetGear.rank,
      activeRank: activeGear.rank,
      visibleUpdateAllowed,
      northMustDecide: true,
      eastOwnsProgress: false,
      maySetVisibleProgress: false,
      maySetReadyText: false,
      falseCompletionBlocked: false,
      motionHint,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      classifiedAt: nowIso()
    };
  }

  function classifyCheckpointEvent(event = {}, sessionLike = {}) {
    const activeGearId =
      sessionLike.activeGearId ||
      sessionLike.activeCheckpointId ||
      (sessionLike.activeCheckpoint && (sessionLike.activeCheckpoint.gearId || sessionLike.activeCheckpoint.id)) ||
      "";

    const context = {
      ...sessionLike,
      activeGearId,
      completedGearIds: [
        ...asArray(sessionLike.completedGearIds),
        ...asArray(sessionLike.completedCheckpoints)
      ]
    };

    const result = classifyTransmissionEvent(event, context);

    return {
      action: result.legacyAction,
      transmissionAction: result.action,
      gapClass: result.gapClass,
      checkpointId: result.targetGear ? result.targetGear.legacyCheckpointId : "",
      checkpointRank: result.targetRank || 0,
      activeCheckpointId: result.activeGear ? result.activeGear.legacyCheckpointId : activeGearId,
      activeRank: result.activeRank || 0,
      reason: result.reason,
      visibleUpdateAllowed: result.visibleUpdateAllowed,
      mayAdvance: result.action === TRANSMISSION_ACTIONS.ADMIT_ACTIVE_GEAR_EVENT,
      maySetProgress: false,
      maySetReadyText: false,
      localProgressHint: result.motionHint.localProgressHint,
      gearMayComplete: result.motionHint.gearMayComplete,
      northMustDecide: true,
      eastOwnsProgress: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      rawTransmissionClassification: result
    };
  }

  function createTransmissionGearPlan(options = {}) {
    const gears = asArray(options.gears).length
      ? asArray(options.gears)
      : TRANSMISSION_GEARS.slice();

    return gears
      .map((gear) => ({
        ...clonePlain(gear),
        localProgressModel: "active-gear-local-0-to-100",
        visibleRouteProgressModel: "north-owned-one-active-gear-at-a-time",
        eastOwnsVisibleProgress: false,
        northOwnsGearShift: true,
        fibonacciCombustion: mapFibonacciToCombustion(gear.fibonacci),
        status: CHECKPOINT_STATUS.PENDING,
        complete: false,
        degraded: false
      }))
      .sort((a, b) => a.rank - b.rank);
  }

  function createChronologicalFibonacciPlan(options = {}) {
    return createTransmissionGearPlan(options).map((gear) => ({
      id: gear.legacyCheckpointId,
      gearId: gear.gearId,
      event: gear.completionEvent,
      aliases: gear.aliases.slice(),
      rank: gear.rank,
      fibonacci: gear.fibonacci,
      value: gear.value,
      lane: gear.lane,
      progress: 0,
      oldCumulativeProgressRetired: true,
      localGearProgressOnly: true,
      label: gear.gearName,
      combustionRole: gear.combustionRole,
      enginePhase: gear.enginePhase,
      complete: false,
      degraded: false,
      status: CHECKPOINT_STATUS.PENDING
    }));
  }

  function createNewsFibonacciCheckpointPlan(options = {}) {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "runtime-table-east-transmission-motion-plan",
      sequence: createChronologicalFibonacciPlan(options),
      transmissionGears: createTransmissionGearPlan(options),
      newsGates: clonePlain(NEWS_GATES),
      fibonacciCombustionAlignment: true,
      oneActiveGearAtATime: true,
      activeGearLocalProgressModel: "0-to-100",
      cumulativeCheckpointProgressRetired: true,
      northOwnsGearCursor: true,
      eastOwnsMotionClassificationOnly: true,
      readyTextRequiresNorthCompletionLatch: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function createCheckpointSession(sequenceInput = null, options = {}) {
    const sequence = createChronologicalFibonacciPlan({
      sequence: sequenceInput || options.sequence || null
    });

    const sessionId = options.id ||
      `${options.planetId || "planet"}-east-non-governing-transmission-classifier-${Math.random().toString(36).slice(2, 9)}`;

    const state = {
      sessionId,
      contract: CONTRACT,
      receipt: RECEIPT,
      route: options.route || "",
      planetId: options.planetId || "",
      planetLabel: options.planetLabel || "",
      nonGoverningCompatibilityShell: true,
      northOwnsActiveGear: true,
      eastOwnsProgress: false,
      eastOwnsCompletionLatch: false,
      activeGearId: options.activeGearId || (sequence[0] ? sequence[0].gearId : ""),
      completedGearIds: [],
      queuedClassifications: [],
      archivedClassifications: [],
      blockedClassifications: [],
      admittedClassifications: [],
      latestClassification: null,
      createdAt: nowIso(),
      updatedAt: nowIso()
    };

    function submitEvent(event = {}, context = {}) {
      const classification = classifyTransmissionEvent(event, {
        ...context,
        activeGearId: context.activeGearId || state.activeGearId,
        completedGearIds: [
          ...state.completedGearIds,
          ...asArray(context.completedGearIds),
          ...asArray(context.completedCheckpoints)
        ],
        completionLatched: safeBool(context.completionLatched, false),
        f21Allowed: safeBool(context.f21Allowed, false),
        f21DegradedAllowed: safeBool(context.f21DegradedAllowed, false),
        newsGatePassedBeforeF21: safeBool(context.newsGatePassedBeforeF21, false),
        newsGateDegradedBeforeF21: safeBool(context.newsGateDegradedBeforeF21, false)
      });

      state.latestClassification = clonePlain(classification);
      state.updatedAt = nowIso();

      if (classification.action === TRANSMISSION_ACTIONS.ADMIT_ACTIVE_GEAR_EVENT) {
        state.admittedClassifications.push(clonePlain(classification));
      } else if (classification.action === TRANSMISSION_ACTIONS.QUEUE_FUTURE_GEAR_EVENT) {
        state.queuedClassifications.push(clonePlain(classification));
      } else if (
        classification.action === TRANSMISSION_ACTIONS.ARCHIVE_DUPLICATE_EVENT ||
        classification.action === TRANSMISSION_ACTIONS.ARCHIVE_PROGRESS_TICK ||
        classification.action === TRANSMISSION_ACTIONS.UNKNOWN_EVENT
      ) {
        state.archivedClassifications.push(clonePlain(classification));
      } else if (classification.action === TRANSMISSION_ACTIONS.BLOCK_FALSE_COMPLETION) {
        state.blockedClassifications.push(clonePlain(classification));
      }

      return {
        action: classification.legacyAction,
        transmissionAction: classification.action,
        gapClass: classification.gapClass,
        sessionId,
        activeCheckpoint: getGearById(state.activeGearId),
        completionLatched: false,
        degradedCompletionLatched: false,
        visibleProgress: 0,
        progressCap: 0,
        readyTextAllowed: false,
        northMustDecide: true,
        eastOwnsProgress: false,
        firstFailedCoordinate: classification.reason,
        recommendedNextRenewalTarget: NORTH_FILE,
        rawTransmissionClassification: classification
      };
    }

    function submitMany(events = [], context = {}) {
      return asArray(events).map((event) => submitEvent(event, context));
    }

    function completeActive(event = {}, context = {}) {
      return submitEvent(event, context);
    }

    function canAdvanceTo(_checkpointId) {
      return false;
    }

    function getActiveCheckpoint() {
      return clonePlain(getGearById(state.activeGearId));
    }

    function getCheckpointState() {
      return clonePlain(sequence);
    }

    function getNewsGateState() {
      return {
        northGateReady: false,
        eastGateReady: false,
        westGateReady: false,
        southGateReady: false,
        newsGatePassedBeforeF21: false,
        newsGateDegradedBeforeF21: false,
        northMustDecide: true,
        eastOwnsNewsFinalApproval: false
      };
    }

    function reset() {
      state.completedGearIds = [];
      state.queuedClassifications = [];
      state.archivedClassifications = [];
      state.blockedClassifications = [];
      state.admittedClassifications = [];
      state.latestClassification = null;
      state.updatedAt = nowIso();
      return getReceipt();
    }

    function getReceipt() {
      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        checkpointSessionContract: "LAB_RUNTIME_TABLE_CARDINAL_EAST_NON_GOVERNING_TRANSMISSION_SESSION_v1",
        checkpointSessionReceipt: "LAB_RUNTIME_TABLE_CARDINAL_EAST_NON_GOVERNING_TRANSMISSION_SESSION_RECEIPT_v1",
        sessionId,
        route: state.route,
        planetId: state.planetId,
        planetLabel: state.planetLabel,
        nonGoverningCompatibilityShell: true,
        eastAuthority: true,
        northOwnsActiveGear: true,
        eastOwnsProgress: false,
        eastOwnsGearShift: false,
        eastOwnsCompletionLatch: false,
        activeGearId: state.activeGearId,
        activeCheckpointId: state.activeGearId,
        admittedClassificationsCount: state.admittedClassifications.length,
        queuedClassificationsCount: state.queuedClassifications.length,
        archivedClassificationsCount: state.archivedClassifications.length,
        blockedClassificationsCount: state.blockedClassifications.length,
        latestClassification: clonePlain(state.latestClassification),
        visibleProgress: 0,
        progressCap: 0,
        readyTextAllowed: false,
        cumulativeCheckpointProgressRetired: true,
        activeGearLocalProgressModel: "north-owned-0-to-100",
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

      return [
        "LAB_RUNTIME_TABLE_CARDINAL_EAST_NON_GOVERNING_TRANSMISSION_SESSION_RECEIPT",
        "",
        `contract=${receipt.contract}`,
        `receipt=${receipt.receipt}`,
        `sessionId=${receipt.sessionId}`,
        `route=${receipt.route}`,
        `planetId=${receipt.planetId}`,
        "",
        `nonGoverningCompatibilityShell=${receipt.nonGoverningCompatibilityShell}`,
        `eastAuthority=${receipt.eastAuthority}`,
        `northOwnsActiveGear=${receipt.northOwnsActiveGear}`,
        `eastOwnsProgress=${receipt.eastOwnsProgress}`,
        `eastOwnsGearShift=${receipt.eastOwnsGearShift}`,
        `eastOwnsCompletionLatch=${receipt.eastOwnsCompletionLatch}`,
        "",
        `activeGearId=${receipt.activeGearId}`,
        `activeCheckpointId=${receipt.activeCheckpointId}`,
        `admittedClassificationsCount=${receipt.admittedClassificationsCount}`,
        `queuedClassificationsCount=${receipt.queuedClassificationsCount}`,
        `archivedClassificationsCount=${receipt.archivedClassificationsCount}`,
        `blockedClassificationsCount=${receipt.blockedClassificationsCount}`,
        "",
        `visibleProgress=${receipt.visibleProgress}`,
        `progressCap=${receipt.progressCap}`,
        `readyTextAllowed=${receipt.readyTextAllowed}`,
        `cumulativeCheckpointProgressRetired=${receipt.cumulativeCheckpointProgressRetired}`,
        `activeGearLocalProgressModel=${receipt.activeGearLocalProgressModel}`,
        "",
        `generatedImage=${receipt.generatedImage}`,
        `graphicBox=${receipt.graphicBox}`,
        `webGL=${receipt.webGL}`,
        `visualPassClaimed=${receipt.visualPassClaimed}`,
        "",
        `updatedAt=${receipt.updatedAt}`
      ].join("\n");
    }

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      sessionId,
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
    return createCheckpointSession(TRANSMISSION_GEARS, {
      planetId: "hearth",
      planetLabel: "Hearth",
      route: "/showroom/globe/hearth/",
      activeGearId: options.activeGearId || "F1A_HTML_SHELL_RENDERED",
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
      destinationFile: EAST_FILE,
      northFile: NORTH_FILE,
      westFile: WEST_FILE,
      southFile: SOUTH_FILE,
      status: "active",
      role: "east-cardinal-transmission-motion-authority",

      eastAuthority: true,
      eastLoaded: true,
      eastFallbackUsed: false,
      northPrecedentRequired: true,
      consumedByNorthFacade: true,

      ownsNorth: false,
      ownsEast: true,
      ownsWest: false,
      ownsSouth: false,

      ownsEventNormalization: true,
      ownsEventAliasMapping: true,
      ownsTransmissionMotionClassification: true,
      ownsFibonacciCombustionAlignment: true,

      ownsActiveGearCursor: false,
      ownsGearShift: false,
      ownsVisibleProgress: false,
      ownsCompletionLatch: false,
      ownsReadyText: false,
      ownsNewsFinalApproval: false,
      ownsCanvasDrawing: false,
      ownsAtlasPainting: false,
      ownsPlanetTruth: false,
      ownsFinalVisualPassClaim: false,

      transmissionMotionAuthority: true,
      checkpointGovernorAuthorityRetired: true,
      cumulativeCheckpointProgressRetired: true,
      activeGearLocalProgressModel: "0-to-100-owned-by-north",
      oneActiveGearAtATime: true,
      futureGearEventsQueuedByClassification: true,
      duplicateEventsArchivedByClassification: true,
      progressOnlyEventsArchivedByClassification: true,
      falseCompletionBlockedByClassification: true,

      fibonacciCombustionAlignment: true,
      newsFibonacciAlignment: true,
      transmissionSequence: TRANSMISSION_GEARS.map((gear) => ({
        gearId: gear.gearId,
        legacyCheckpointId: gear.legacyCheckpointId,
        rank: gear.rank,
        fibonacci: gear.fibonacci,
        value: gear.value,
        gearName: gear.gearName,
        combustionRole: gear.combustionRole,
        enginePhase: gear.enginePhase,
        lane: gear.lane,
        completionEvent: gear.completionEvent,
        allowedEvents: gear.allowedEvents.slice(),
        aliases: gear.aliases.slice(),
        nextGearHint: gear.nextGearHint
      })),

      exports: [
        "classifyTransmissionEvent",
        "normalizeTransmissionEvent",
        "createTransmissionGearPlan",
        "mapEventToGear",
        "mapFibonacciToCombustion",
        "isFalseCompletionMutation",
        "isProgressOnlyEvent",
        "getReceipt",
        "classifyCheckpointEvent",
        "createChronologicalFibonacciPlan",
        "createNewsFibonacciCheckpointPlan",
        "createCheckpointSession",
        "createHearthCheckpointSession"
      ],

      coreLaw: [
        "East owns motion grammar only.",
        "North owns the public Runtime Table facade.",
        "North owns the active gear cursor.",
        "North owns gear shift.",
        "North owns visible progress.",
        "North owns F21 completion latch.",
        "East classifies events for North review.",
        "Fibonacci is symbolic combustion scale, not visible cumulative loader percentage.",
        "Each active gear is a local 0-to-100 cycle.",
        "Only one gear can be active at a time.",
        "Future gear events are queued by classification.",
        "Completed gear duplicates are archived by classification.",
        "Progress-only events are archived without mutating gear truth.",
        "False READY, false 100%, false F21, and false visual pass are blocked.",
        "visualPassClaimed remains false."
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

    TRANSMISSION_ACTIONS,
    CHECKPOINT_EVENT_ACTIONS,
    CHECKPOINT_STATUS,
    GAP_CLASS,
    NEWS_GATES,
    TRANSMISSION_GEARS,
    FIBONACCI_CHECKPOINTS: TRANSMISSION_GEARS,

    classifyTransmissionEvent,
    normalizeTransmissionEvent,
    createTransmissionGearPlan,
    mapEventToGear,
    mapFibonacciToCombustion,
    isFalseCompletionMutation,
    isProgressOnlyEvent,
    getReceipt,

    classifyCheckpointEvent,
    createChronologicalFibonacciPlan,
    createNewsFibonacciCheckpointPlan,
    createCheckpointSession,
    createHearthCheckpointSession,

    eastAuthority: true,
    eastLoaded: true,
    eastFallbackUsed: false,
    northPrecedentRequired: true,
    consumedByNorthFacade: true,

    ownsActiveGearCursor: false,
    ownsGearShift: false,
    ownsVisibleProgress: false,
    ownsCompletionLatch: false,
    ownsReadyText: false,
    ownsFinalVisualPassClaim: false,

    transmissionMotionAuthority: true,
    checkpointGovernorAuthorityRetired: true,
    cumulativeCheckpointProgressRetired: true,
    activeGearLocalProgressModel: "north-owned-0-to-100",
    oneActiveGearAtATime: true,
    fibonacciCombustionAlignment: true,
    newsFibonacciAlignment: true,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  root.DEXTER_LAB = root.DEXTER_LAB || {};
  root.DEXTER_LAB.runtimeTableEast = api;
  root.DEXTER_LAB.cardinalRuntimeTableEast = api;
  root.DEXTER_LAB.checkpointGovernorEast = api;
  root.DEXTER_LAB.transmissionMotionEast = api;

  root.LAB_RUNTIME_TABLE_EAST = api;
  root.RUNTIME_TABLE_EAST = api;
  root.DEXTER_LAB_RUNTIME_TABLE_EAST = api;
  root.LAB_CARDINAL_RUNTIME_TABLE_EAST = api;
  root.LAB_CHECKPOINT_GOVERNOR_EAST = api;
  root.LAB_TRANSMISSION_MOTION_EAST = api;

  if (root.document && root.document.documentElement) {
    const dataset = root.document.documentElement.dataset;

    dataset.labRuntimeTableEastLoaded = "true";
    dataset.labRuntimeTableEastContract = CONTRACT;
    dataset.labRuntimeTableEastReceipt = RECEIPT;
    dataset.labRuntimeTableEastAuthority = "true";
    dataset.eastTransmissionMotionAuthority = "true";
    dataset.eastCheckpointGovernorAuthorityRetired = "true";
    dataset.eastConsumedByNorthFacade = "true";
    dataset.northPrecedentRequired = "true";

    dataset.eastOwnsActiveGearCursor = "false";
    dataset.eastOwnsGearShift = "false";
    dataset.eastOwnsVisibleProgress = "false";
    dataset.eastOwnsCompletionLatch = "false";
    dataset.eastOwnsReadyText = "false";
    dataset.eastOwnsFinalVisualPassClaim = "false";

    dataset.cumulativeCheckpointProgressRetired = "true";
    dataset.activeGearLocalProgressModel = "north-owned-0-to-100";
    dataset.oneActiveGearAtATime = "true";
    dataset.fibonacciCombustionAlignment = "true";
    dataset.newsFibonacciAlignment = "true";

    dataset.futureGearEventsQueuedByClassification = "true";
    dataset.duplicateGearEventsArchivedByClassification = "true";
    dataset.progressOnlyEventsArchivedByClassification = "true";
    dataset.falseCompletionBlockedByClassification = "true";

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

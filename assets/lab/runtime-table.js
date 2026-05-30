// /assets/lab/runtime-table.js
// LAB_RUNTIME_TABLE_NORTH_TRANSMISSION_GOVERNOR_FIBONACCI_COMBUSTION_TNT_v1
// Full-file replacement.
// North facade authority.
// Purpose:
// - Preserve /assets/lab/runtime-table.js as the public Lab Runtime Table authority.
// - Preserve Runtime Table, Triple G, Visual Carrier Plan, Loading Optimization, Wide Probe, and checkpoint exports.
// - Add Hearth-facing North aliases without creating a new North file.
// - Add direct West intake methods.
// - Recognize INDEX_HANDOFF_ACCEPTED / S2_INDEX_HANDOFF_ACCEPTED.
// - Govern Hearth as a transmission: one active gear at a time.
// - Convert visible loader semantics to active-gear 0→100 progress while preserving legacy Fibonacci labels internally.
// Does not own:
// - East first paint
// - West handoff validation
// - South visible proof
// - canvas drawing
// - source-stack truth
// - child-channel truth
// - touch/drag controls
// - route orchestration
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "LAB_RUNTIME_TABLE_NORTH_TRANSMISSION_GOVERNOR_FIBONACCI_COMBUSTION_TNT_v1";
  const RECEIPT = "LAB_RUNTIME_TABLE_NORTH_TRANSMISSION_GOVERNOR_FIBONACCI_COMBUSTION_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "LAB_RUNTIME_TABLE_CARDINAL_NORTH_PRECEDENT_FACADE_TNT_v1";
  const BASELINE_CONTRACT = "RUNTIME_TABLE_NEWS_CARDINAL_FOUR_FILE_SPLIT_FINAL_DRAFT_PREWRITE_v1";
  const VERSION = "2026-05-29.lab-runtime-table-north-transmission-governor-fibonacci-combustion-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const FILE = "/assets/lab/runtime-table.js";
  const ROUTE = "/showroom/globe/hearth/";

  const EAST_FILE = "/showroom/globe/hearth/index.js";
  const WEST_FILE = "/assets/hearth/hearth.west.index-handoff.table.js";
  const NORTH_FILE = "/assets/lab/runtime-table.js";
  const SOUTH_FILE = "/showroom/globe/hearth/hearth.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";

  const STATUS = Object.freeze({
    PENDING: "PENDING",
    READY: "READY",
    OPTIMIZED: "OPTIMIZED",
    DEGRADED: "DEGRADED",
    FALLBACK: "FALLBACK",
    REJECTED: "REJECTED",
    BLOCKING: "BLOCKING",
    HELD: "HELD"
  });

  const HANDOFF = Object.freeze({
    FULL_PASS: "FULL_PASS",
    OPTIMIZED_PASS: "OPTIMIZED_PASS",
    DEGRADED_PASS: "DEGRADED_PASS",
    FALLBACK_PASS: "FALLBACK_PASS",
    HELD_PASS: "HELD_PASS",
    REJECTED: "REJECTED",
    BLOCKING: "BLOCKING"
  });

  const COHERENCE_STATUS = Object.freeze({
    PASS: "PASS",
    WARNING: "WARNING",
    HELD_PENDING_WIDE_PROBE: "HELD_PENDING_WIDE_PROBE",
    DEGRADED: "DEGRADED",
    FAIL: "FAIL",
    REJECTED: "REJECTED",
    BLOCKING: "BLOCKING"
  });

  const CHECKPOINT_EVENT_ACTIONS = Object.freeze({
    ADMIT: "ADMIT",
    QUEUE: "QUEUE",
    ARCHIVE: "ARCHIVE",
    BLOCK: "BLOCK",
    HELD: "HELD",
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
    TRANSMISSION_HELD: "TRANSMISSION_HELD"
  });

  const R_COORDINATES = Object.freeze({
    R0_RUNTIME_TABLE_NOT_LOADED: "R0_RUNTIME_TABLE_NOT_LOADED",
    R1_RUNTIME_TABLE_LOADED_NO_PLAN: "R1_RUNTIME_TABLE_LOADED_NO_PLAN",
    R2_PLAN_GENERATED_INVALID: "R2_PLAN_GENERATED_INVALID",
    R3_PLAN_VALID_HANDOFF_READY: "R3_PLAN_VALID_HANDOFF_READY"
  });

  const V_COORDINATES = Object.freeze({
    V0_VISUAL_CARRIER_NOT_MOUNTED: "V0_VISUAL_CARRIER_NOT_MOUNTED",
    V1_FALLBACK_SHELL_MOUNTED: "V1_FALLBACK_SHELL_MOUNTED",
    V2_DIAGNOSTIC_CARRIER_VISIBLE: "V2_DIAGNOSTIC_CARRIER_VISIBLE",
    V3_ATLAS_CARRIER_VISIBLE: "V3_ATLAS_CARRIER_VISIBLE",
    V4_COHERENT_VISUAL_CARRIER_ELIGIBLE: "V4_COHERENT_VISUAL_CARRIER_ELIGIBLE"
  });

  const A_COORDINATES = Object.freeze({
    A0_ATLAS_SEQUENCE_NOT_STARTED: "A0_ATLAS_SEQUENCE_NOT_STARTED",
    A1_ATLAS_START_AUTHORIZED: "A1_ATLAS_START_AUTHORIZED",
    A2_ATLAS_BUILDER_ENTERED: "A2_ATLAS_BUILDER_ENTERED",
    A3_ATLAS_PROGRESS_OBSERVED: "A3_ATLAS_PROGRESS_OBSERVED",
    A4_ATLAS_COMPLETED: "A4_ATLAS_COMPLETED",
    A5_ATLAS_PROJECTED_TO_SPHERE: "A5_ATLAS_PROJECTED_TO_SPHERE"
  });

  const C_COORDINATES = Object.freeze({
    C0_CHILD_CONNECTOR_NOT_STARTED: "C0_CHILD_CONNECTOR_NOT_STARTED",
    C1_CHILD_REQUEST_PREPARED: "C1_CHILD_REQUEST_PREPARED",
    C2_SCRIPT_ELEMENT_CREATED: "C2_SCRIPT_ELEMENT_CREATED",
    C3_SCRIPT_APPENDED: "C3_SCRIPT_APPENDED",
    C4_SCRIPT_NETWORK_LOAD_FAILURE: "C4_SCRIPT_NETWORK_LOAD_FAILURE",
    C5_SCRIPT_LOAD_TIMEOUT: "C5_SCRIPT_LOAD_TIMEOUT",
    C6_GLOBAL_ACTOR_MISSING: "C6_GLOBAL_ACTOR_MISSING",
    C7_CONTRACT_MISMATCH: "C7_CONTRACT_MISMATCH",
    C8_SAMPLE_API_FAILURE: "C8_SAMPLE_API_FAILURE",
    C9_COORDINATE_PACKET_FAILURE: "C9_COORDINATE_PACKET_FAILURE",
    C10_AUTHORITY_FLAG_FAILURE: "C10_AUTHORITY_FLAG_FAILURE",
    C11_CHILD_VALIDATED: "C11_CHILD_VALIDATED"
  });

  const L_COORDINATES = Object.freeze({
    L0_LOADING_NOT_STARTED: "L0_LOADING_NOT_STARTED",
    L1_VISIBLE_CARRIER_FIRST: "L1_VISIBLE_CARRIER_FIRST",
    L2_CHILD_CONTRACT_VALIDATION: "L2_CHILD_CONTRACT_VALIDATION",
    L3_ANCHOR_SAMPLE_LOCAL_PROOF: "L3_ANCHOR_SAMPLE_LOCAL_PROOF",
    L4_ATLAS_OR_CACHE_RENDER: "L4_ATLAS_OR_CACHE_RENDER",
    L5_WIDE_PROBE_IDLE_CHUNKS: "L5_WIDE_PROBE_IDLE_CHUNKS",
    L6_OPTIMIZED_STABLE: "L6_OPTIMIZED_STABLE"
  });

  const COHERENCE_CHECKS = Object.freeze({
    VISUAL_CARRIER_ELIGIBILITY_CHECK: "VISUAL_CARRIER_ELIGIBILITY_CHECK",
    RECEIPT_VERIFICATION_CHECK: "RECEIPT_VERIFICATION_CHECK",
    COORDINATE_BODY_CHECK: "COORDINATE_BODY_CHECK",
    LAND_BODY_BINDING_CHECK: "LAND_BODY_BINDING_CHECK",
    WATER_SURFACE_SEATING_CHECK: "WATER_SURFACE_SEATING_CHECK",
    AIR_AUTHORITY_CHECK: "AIR_AUTHORITY_CHECK",
    CHANNEL_SEPARATION_CHECK: "CHANNEL_SEPARATION_CHECK",
    PROJECTION_SEATING_CHECK: "PROJECTION_SEATING_CHECK",
    CONTRAST_VISIBILITY_CHECK: "CONTRAST_VISIBILITY_CHECK",
    DISTRIBUTION_SHAPE_CHECK: "DISTRIBUTION_SHAPE_CHECK",
    WIDE_PROBE_READINESS_CHECK: "WIDE_PROBE_READINESS_CHECK",
    LOADING_OPTIMIZATION_CHECK: "LOADING_OPTIMIZATION_CHECK",
    ATLAS_START_AUTHORIZATION_CHECK: "ATLAS_START_AUTHORIZATION_CHECK",
    COHERENT_EXPRESSION_CHECK: "COHERENT_EXPRESSION_CHECK"
  });

  const NEWS_GATES = Object.freeze({
    NORTH: "NORTH",
    EAST: "EAST",
    WEST: "WEST",
    SOUTH: "SOUTH",
    F21: "F21"
  });

  const TRANSMISSION_GEARS = Object.freeze({
    EAST_IGNITION: "EAST_IGNITION",
    WEST_SYNCHRONIZER: "WEST_SYNCHRONIZER",
    NORTH_ADMISSION: "NORTH_ADMISSION",
    SOUTH_OUTPUT: "SOUTH_OUTPUT",
    NORTH_RETURN: "NORTH_RETURN",
    COMPLETE: "COMPLETE"
  });

  const TRANSMISSION_ORDER = Object.freeze([
    TRANSMISSION_GEARS.EAST_IGNITION,
    TRANSMISSION_GEARS.WEST_SYNCHRONIZER,
    TRANSMISSION_GEARS.NORTH_ADMISSION,
    TRANSMISSION_GEARS.SOUTH_OUTPUT,
    TRANSMISSION_GEARS.NORTH_RETURN,
    TRANSMISSION_GEARS.COMPLETE
  ]);

  const GEAR_LABELS = Object.freeze({
    EAST_IGNITION: "Gear 1 · East Ignition",
    WEST_SYNCHRONIZER: "Gear 2 · West Synchronizer",
    NORTH_ADMISSION: "Gear 3 · North Admission",
    SOUTH_OUTPUT: "Gear 4 · South Output",
    NORTH_RETURN: "Gear 5 · North Return",
    COMPLETE: "Transmission Complete"
  });

  const GEAR_MECHANICS = Object.freeze({
    EAST_IGNITION: "starter / spark / intake",
    WEST_SYNCHRONIZER: "clutch / synchronizer / admissibility",
    NORTH_ADMISSION: "ECU / timing governor / governed runtime admission",
    SOUTH_OUTPUT: "combustion output / torque transfer / visible drivetrain",
    NORTH_RETURN: "exhaust / closure / next gear release",
    COMPLETE: "cycle complete"
  });

  const FIBONACCI_CHECKPOINTS = Object.freeze([
    { id: "F1A_HTML_SHELL_RENDERED", event: "HTML_SHELL_RENDERED", rank: 1, fibonacci: "F1A", value: 1, legacyProgress: 6, label: "HTML shell rendered", combustion: "ignition spark" },
    { id: "F1B_LOAD_LEDGER_INITIALIZED", event: "LOAD_LEDGER_INITIALIZED", aliases: ["HEARTH_LOAD_LEDGER_MONOTONIC_INITIALIZED", "NEWS_FIBONACCI_LEDGER_GUARD_ACTIVE"], rank: 2, fibonacci: "F1B", value: 1, legacyProgress: 12, label: "Load ledger initialized", combustion: "intake readiness" },
    { id: "F2_FIRST_PAINT_COCKPIT_VISIBLE", event: "FIRST_PAINT_COCKPIT_VISIBLE", rank: 3, fibonacci: "F2", value: 2, legacyProgress: 22, label: "First-paint cockpit visible", combustion: "compression begins" },
    { id: "F3_SCRIPT_ORDER_COMPLETE", event: "SCRIPT_ORDER_COMPLETE", aliases: ["SCRIPT_LOADED", "SCRIPT_ORDER_VISIBLE"], rank: 4, fibonacci: "F3", value: 3, legacyProgress: 36, label: "Script order complete", combustion: "compression stabilizes" },
    { id: "F5_AUTHORITY_AVAILABILITY_READY", event: "AUTHORITY_AVAILABILITY_READY", aliases: ["RUNTIME_TABLE_AVAILABLE", "AUTHORITY_AVAILABLE"], rank: 5, fibonacci: "F5", value: 5, legacyProgress: 55, label: "Authority availability ready", combustion: "admissible pressure threshold" },
    { id: "F8_INDEX_HANDOFF_ACCEPTED", event: "INDEX_HANDOFF_ACCEPTED", aliases: ["S2_INDEX_HANDOFF_ACCEPTED", "EAST_STEP1_HANDOFF_ACCEPTED_BY_WEST_METHOD", "WEST_HANDOFF_ACCEPTED"], rank: 6, fibonacci: "F8", value: 8, legacyProgress: 72, label: "Index handoff accepted", combustion: "controlled combustion / shift event" },
    { id: "F13_NORTH_ADMISSION_READY", event: "NORTH_ADMISSION_READY", aliases: ["NORTH_ACCEPTED_WEST_INTAKE", "NORTH_ADMISSION_STARTED"], rank: 7, fibonacci: "F13", value: 13, legacyProgress: 78, label: "North admission ready", combustion: "output stroke / torque transfer begins" },
    { id: "F13_SOUTH_OUTPUT_AUTHORIZED", event: "SOUTH_OUTPUT_AUTHORIZED", aliases: ["SOUTH_PROOF_LANE_OPENED"], rank: 8, fibonacci: "F13", value: 13, legacyProgress: 86, label: "South output authorized", combustion: "output stroke / torque transfer" },
    { id: "F13_VISIBLE_CONTENT_PROOF_PASSED", event: "VISIBLE_CONTENT_PROOF_PASSED", aliases: ["DEGRADED_VISIBLE_CONTENT_ACCEPTED", "SOUTH_VISIBLE_COMPLETION_READY"], rank: 9, fibonacci: "F13", value: 13, legacyProgress: 94, label: "Visible content proof passed", combustion: "visible drivetrain motion" },
    { id: "F13_INSPECT_MODE_READY", event: "INSPECT_MODE_READY", aliases: ["DEGRADED_INSPECT_MODE_ACCEPTED"], rank: 10, fibonacci: "F13", value: 13, legacyProgress: 98, label: "Inspect mode ready", combustion: "output proof stabilized" },
    { id: "F21_COMPLETION_LATCHED", event: "COMPLETION_LATCHED", aliases: ["COMPLETION_LATCHED_AFTER_VISIBLE_CONTENT_PROOF", "COMPLETION_LATCHED_AFTER_CANVAS_READY", "F21_DEGRADED_COMPLETION_LATCHED"], rank: 11, fibonacci: "F21", value: 21, legacyProgress: 100, label: "Completion latched", combustion: "checkpoint closure / next gear authorization" }
  ]);

  const WEST_HANDOFF_EVENTS = Object.freeze([
    "INDEX_HANDOFF_ACCEPTED",
    "S2_INDEX_HANDOFF_ACCEPTED",
    "EAST_STEP1_HANDOFF_ACCEPTED_BY_WEST_METHOD",
    "WEST_HANDOFF_ACCEPTED",
    "WEST_ACCEPTED_EAST_STEP1_HANDOFF"
  ]);

  const SOUTH_OUTPUT_EVENTS = Object.freeze([
    "SOUTH_VISIBLE_COMPLETION_READY",
    "VISIBLE_CONTENT_PROOF_PASSED",
    "DEGRADED_VISIBLE_CONTENT_ACCEPTED",
    "INSPECT_MODE_READY",
    "DEGRADED_INSPECT_MODE_ACCEPTED",
    "CANVAS_READY",
    "FIRST_FRAME_DETECTED"
  ]);

  const COMPLETION_EVENTS = Object.freeze([
    "COMPLETION_LATCHED",
    "COMPLETION_LATCHED_AFTER_VISIBLE_CONTENT_PROOF",
    "COMPLETION_LATCHED_AFTER_CANVAS_READY",
    "F21_DEGRADED_COMPLETION_LATCHED"
  ]);

  const branchState = {
    northLoaded: true,
    eastLoaded: false,
    westLoaded: false,
    southLoaded: false,
    eastFallbackUsed: true,
    westFallbackUsed: true,
    southFallbackUsed: true,
    lastBindAt: ""
  };

  const transmissionState = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,

    sessionId: "HEARTH-NORTH-TRANSMISSION-GOVERNOR",
    cardinalRole: "NORTH",

    activeGear: TRANSMISSION_GEARS.EAST_IGNITION,
    activeGearLabel: GEAR_LABELS.EAST_IGNITION,
    activeGearMechanicalRole: GEAR_MECHANICS.EAST_IGNITION,
    activeGearProgress: 0,
    activeCycleId: "cycle-1-east-ignition",
    completedCycleCount: 0,
    lastClosedCheckpoint: "",
    nextGear: TRANSMISSION_GEARS.WEST_SYNCHRONIZER,
    shiftAuthorized: false,

    transmissionGovernorActive: true,
    fibonacciCombustionScaleActive: true,
    oneActiveGearAtATime: true,
    northFacadeCompatibilityActive: true,
    hearthNorthAliasesActive: true,
    westIntakeMethodsActive: true,
    westHandoffRecognized: true,
    indexHandoffAcceptedRecognized: true,
    s2IndexHandoffAcceptedRecognized: true,

    visibleProgressMode: "ACTIVE_GEAR_0_TO_100",
    legacyFibonacciProgressPreservedForCompatibility: true,
    cumulativeProgressControlsVisibleLoader: false,

    westHandoffAcceptedByNorth: false,
    northAdmissionComplete: false,
    southOutputAuthorized: false,
    southOutputComplete: false,
    northReturnComplete: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,

    firstFailedCoordinate: "WAITING_EAST_OR_WEST_HANDOFF",
    recommendedNextOwner: "EAST",
    recommendedNextFile: EAST_FILE,
    recommendedNextRenewalTarget: EAST_FILE,
    postgameStatus: "NORTH_TRANSMISSION_GOVERNOR_READY",

    queue: [],
    archivedEvents: [],
    blockedEvents: [],
    admittedEvents: [],
    heldEvents: [],
    gearHistory: [],
    receipts: [],
    errors: [],

    maxQueueDrainPerCall: 8,
    maxArchivePerCall: 12,
    noWhileLoopWithoutGuard: true,
    mainThreadYieldRequiredForLargeQueue: true,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    createdAt: "",
    updatedAt: ""
  };

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

  function isFunction(value) {
    return typeof value === "function";
  }

  function asArray(value) {
    if (Array.isArray(value)) return value.slice();
    if (value === undefined || value === null) return [];
    return [value];
  }

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
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
      return Array.isArray(value) ? value.slice() : { ...value };
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

  function recordTransmission(kind, event, detail = {}) {
    const item = {
      at: nowIso(),
      kind,
      event,
      detail: clonePlain(detail)
    };

    const list =
      kind === "admit" ? transmissionState.admittedEvents :
      kind === "block" ? transmissionState.blockedEvents :
      kind === "held" ? transmissionState.heldEvents :
      kind === "archive" ? transmissionState.archivedEvents :
      transmissionState.receipts;

    list.push(item);
    if (list.length > 160) list.splice(0, list.length - 160);

    transmissionState.updatedAt = item.at;
    return item;
  }

  function recordError(code, message, detail = {}) {
    const item = {
      at: nowIso(),
      code,
      message: String(message || ""),
      detail: clonePlain(detail)
    };
    transmissionState.errors.push(item);
    if (transmissionState.errors.length > 80) {
      transmissionState.errors.splice(0, transmissionState.errors.length - 80);
    }
    transmissionState.updatedAt = item.at;
    return item;
  }

  function eventName(input = {}) {
    const detail = isObject(input.detail) ? input.detail : {};
    return String(
      input.checkpointEvent ||
      input.checkpointCandidate ||
      input.event ||
      input.id ||
      input.phase ||
      input.checkpointId ||
      detail.checkpointEvent ||
      detail.checkpointCandidate ||
      detail.event ||
      detail.id ||
      detail.phase ||
      detail.checkpointId ||
      ""
    );
  }

  function allEventNames(input = {}) {
    const detail = isObject(input.detail) ? input.detail : {};
    return [
      input.checkpointEvent,
      input.checkpointCandidate,
      input.event,
      input.id,
      input.phase,
      input.checkpointId,
      detail.checkpointEvent,
      detail.checkpointCandidate,
      detail.event,
      detail.id,
      detail.phase,
      detail.checkpointId
    ].filter(Boolean).map(String);
  }

  function hasEvent(input, names) {
    const candidates = allEventNames(input);
    return candidates.some((name) => names.includes(name));
  }

  function normalizePayload(input = {}) {
    const detail = isObject(input.detail) ? input.detail : {};
    return {
      ...detail,
      ...input,
      detail
    };
  }

  function westHandoffTruth(input = {}) {
    const packet = normalizePayload(input);
    const names = allEventNames(packet);
    const eventMatched = names.some((name) => WEST_HANDOFF_EVENTS.includes(name));

    const acceptedFlags = [
      "westAccepted",
      "eastStep1Accepted",
      "step1Accepted",
      "step1HandoffAccepted",
      "handoffAdmissible",
      "westGateReady",
      "northIntakeReady"
    ];

    const passedFlags = acceptedFlags.filter((key) => safeBool(packet[key], false));
    const minimumByEvent = eventMatched && passedFlags.length >= 2;
    const fullByFlags = passedFlags.length >= 5;

    return {
      eventMatched,
      passedFlags,
      accepted: Boolean(eventMatched && (minimumByEvent || fullByFlags)),
      packet
    };
  }

  function gearIndex(gear) {
    return TRANSMISSION_ORDER.indexOf(gear);
  }

  function nextGearAfter(gear) {
    const index = gearIndex(gear);
    if (index < 0) return TRANSMISSION_GEARS.EAST_IGNITION;
    return TRANSMISSION_ORDER[Math.min(index + 1, TRANSMISSION_ORDER.length - 1)];
  }

  function gearCycleId(gear, count = transmissionState.completedCycleCount) {
    return `cycle-${count + 1}-${String(gear || "").toLowerCase().replaceAll("_", "-")}`;
  }

  function setActiveGear(gear, reason = "set-active-gear") {
    if (!TRANSMISSION_ORDER.includes(gear)) {
      recordError("UNKNOWN_GEAR", `Unknown gear: ${gear}`, { reason });
      return getHeldResponse("WAITING_NORTH_TRANSMISSION_INTAKE_COMPATIBILITY", reason);
    }

    transmissionState.activeGear = gear;
    transmissionState.activeGearLabel = GEAR_LABELS[gear] || gear;
    transmissionState.activeGearMechanicalRole = GEAR_MECHANICS[gear] || "";
    transmissionState.activeGearProgress = gear === TRANSMISSION_GEARS.COMPLETE ? 100 : 0;
    transmissionState.activeCycleId = gearCycleId(gear);
    transmissionState.nextGear = nextGearAfter(gear);
    transmissionState.shiftAuthorized = false;
    transmissionState.postgameStatus = gear === TRANSMISSION_GEARS.COMPLETE ? "TRANSMISSION_COMPLETE" : `ACTIVE_${gear}`;
    transmissionState.updatedAt = nowIso();

    recordTransmission("gear", "SET_ACTIVE_GEAR", { gear, reason });
    publishAll();

    return getActiveGearState();
  }

  function updateActiveGearProgress(progress, reason = "manual-progress-update") {
    transmissionState.activeGearProgress = clamp(progress, 0, 100);
    transmissionState.updatedAt = nowIso();

    recordTransmission("progress", "ACTIVE_GEAR_PROGRESS_UPDATED", {
      activeGear: transmissionState.activeGear,
      progress: transmissionState.activeGearProgress,
      reason
    });

    publishAll();
    return getActiveGearState();
  }

  function closeActiveGear(reason = "close-active-gear") {
    const current = transmissionState.activeGear;
    const next = nextGearAfter(current);

    transmissionState.activeGearProgress = 100;
    transmissionState.lastClosedCheckpoint = `${current}_CLOSED`;
    transmissionState.completedCycleCount += current === TRANSMISSION_GEARS.COMPLETE ? 0 : 1;
    transmissionState.shiftAuthorized = true;
    transmissionState.gearHistory.push({
      gear: current,
      closedCheckpoint: transmissionState.lastClosedCheckpoint,
      reason,
      at: nowIso()
    });

    if (transmissionState.gearHistory.length > 120) {
      transmissionState.gearHistory.splice(0, transmissionState.gearHistory.length - 120);
    }

    recordTransmission("gear", "GEAR_CLOSED", {
      gearClosed: current,
      checkpointClosed: transmissionState.lastClosedCheckpoint,
      nextGear: next,
      reason
    });

    return {
      gearClosed: current,
      checkpointClosed: transmissionState.lastClosedCheckpoint,
      nextGear: next
    };
  }

  function authorizeNextGear(nextGear, reason = "authorize-next-gear") {
    transmissionState.shiftAuthorized = true;
    setActiveGear(nextGear, reason);
    transmissionState.shiftAuthorized = true;
    transmissionState.updatedAt = nowIso();

    return {
      activeGear: transmissionState.activeGear,
      nextGear: transmissionState.nextGear,
      shiftAuthorized: transmissionState.shiftAuthorized
    };
  }

  function closeGearAndShift(closedGear, nextGear, reason = "close-gear-and-shift") {
    if (transmissionState.activeGear !== closedGear) {
      transmissionState.gearHistory.push({
        gear: transmissionState.activeGear,
        closedCheckpoint: `${transmissionState.activeGear}_INFERRED_CLOSED_BEFORE_${closedGear}`,
        inferred: true,
        reason,
        at: nowIso()
      });
    }

    transmissionState.activeGear = closedGear;
    transmissionState.activeGearLabel = GEAR_LABELS[closedGear] || closedGear;
    transmissionState.activeGearProgress = 100;
    transmissionState.lastClosedCheckpoint = `${closedGear}_CLOSED`;
    transmissionState.completedCycleCount += 1;
    transmissionState.shiftAuthorized = true;

    transmissionState.gearHistory.push({
      gear: closedGear,
      closedCheckpoint: transmissionState.lastClosedCheckpoint,
      reason,
      at: nowIso()
    });

    setActiveGear(nextGear, reason);
    transmissionState.shiftAuthorized = true;

    return {
      gearClosed: closedGear,
      checkpointClosed: `${closedGear}_CLOSED`,
      activeGear: nextGear,
      activeGearProgress: transmissionState.activeGearProgress,
      nextGear: transmissionState.nextGear
    };
  }

  function getHeldResponse(firstFailedCoordinate, reason = "held", extra = {}) {
    const response = {
      accepted: false,
      action: CHECKPOINT_EVENT_ACTIONS.HELD,
      reason,
      firstFailedCoordinate,
      recommendedNextRenewalTarget: NORTH_FILE,
      recommendedNextOwner: "NORTH",
      recommendedNextFile: NORTH_FILE,
      pageResponsive: true,
      hardBlock: false,
      activeGear: transmissionState.activeGear,
      activeGearProgress: transmissionState.activeGearProgress,
      nextGear: transmissionState.nextGear,
      ...clonePlain(extra)
    };

    transmissionState.firstFailedCoordinate = firstFailedCoordinate;
    transmissionState.recommendedNextOwner = "NORTH";
    transmissionState.recommendedNextFile = NORTH_FILE;
    transmissionState.recommendedNextRenewalTarget = NORTH_FILE;
    transmissionState.postgameStatus = firstFailedCoordinate;
    recordTransmission("held", "TRANSMISSION_HELD", response);
    publishAll();

    return response;
  }

  function getArchiveResponse(reason = "unknown-event", extra = {}) {
    const response = {
      accepted: false,
      action: CHECKPOINT_EVENT_ACTIONS.ARCHIVE,
      reason,
      pageResponsive: true,
      hardBlock: false,
      activeGear: transmissionState.activeGear,
      activeGearProgress: transmissionState.activeGearProgress,
      nextGear: transmissionState.nextGear,
      firstFailedCoordinate: transmissionState.firstFailedCoordinate,
      recommendedNextRenewalTarget: transmissionState.recommendedNextRenewalTarget,
      ...clonePlain(extra)
    };

    recordTransmission("archive", "EVENT_ARCHIVED", response);
    publishAll();
    return response;
  }

  function getBlockResponse(firstFailedCoordinate, reason = "blocked", extra = {}) {
    const response = {
      accepted: false,
      action: CHECKPOINT_EVENT_ACTIONS.BLOCK,
      reason,
      firstFailedCoordinate,
      recommendedNextRenewalTarget: extra.recommendedNextRenewalTarget || NORTH_FILE,
      recommendedNextOwner: extra.recommendedNextOwner || "NORTH",
      recommendedNextFile: extra.recommendedNextFile || NORTH_FILE,
      pageResponsive: true,
      hardBlock: true,
      activeGear: transmissionState.activeGear,
      activeGearProgress: transmissionState.activeGearProgress,
      nextGear: transmissionState.nextGear,
      ...clonePlain(extra)
    };

    transmissionState.firstFailedCoordinate = firstFailedCoordinate;
    transmissionState.recommendedNextOwner = response.recommendedNextOwner;
    transmissionState.recommendedNextFile = response.recommendedNextFile;
    transmissionState.recommendedNextRenewalTarget = response.recommendedNextRenewalTarget;
    transmissionState.postgameStatus = firstFailedCoordinate;
    recordTransmission("block", "TRANSMISSION_BLOCKED", response);
    publishAll();

    return response;
  }

  function admitWestHandoff(input = {}, source = "acceptWestHandoff") {
    const truth = westHandoffTruth(input);

    if (!truth.eventMatched) {
      return getArchiveResponse("not-west-handoff-event", {
        source,
        event: eventName(input)
      });
    }

    if (!truth.accepted) {
      return getHeldResponse("WAITING_WEST_HANDOFF_ADMISSIBILITY", "west-handoff-flags-incomplete", {
        source,
        passedFlags: truth.passedFlags
      });
    }

    const shift = closeGearAndShift(
      TRANSMISSION_GEARS.WEST_SYNCHRONIZER,
      TRANSMISSION_GEARS.NORTH_ADMISSION,
      source
    );

    transmissionState.westHandoffAcceptedByNorth = true;
    transmissionState.firstFailedCoordinate = "NONE_WEST_HANDOFF_ACCEPTED_BY_NORTH";
    transmissionState.recommendedNextOwner = "NORTH";
    transmissionState.recommendedNextFile = NORTH_FILE;
    transmissionState.recommendedNextRenewalTarget = NORTH_FILE;
    transmissionState.postgameStatus = "NORTH_ADMISSION_ACTIVE";
    transmissionState.indexHandoffAcceptedRecognized = true;
    transmissionState.s2IndexHandoffAcceptedRecognized = true;
    transmissionState.westHandoffRecognized = true;

    const response = {
      accepted: true,
      action: CHECKPOINT_EVENT_ACTIONS.ADMIT,
      source,
      event: eventName(input),
      gearClosed: TRANSMISSION_GEARS.WEST_SYNCHRONIZER,
      checkpointClosed: "WEST_HANDOFF_ACCEPTED",
      nextGear: TRANSMISSION_GEARS.SOUTH_OUTPUT,
      activeGear: TRANSMISSION_GEARS.NORTH_ADMISSION,
      activeGearLabel: GEAR_LABELS.NORTH_ADMISSION,
      activeGearProgress: 0,
      shiftAuthorized: true,
      firstFailedCoordinate: "NONE_WEST_HANDOFF_ACCEPTED_BY_NORTH",
      recommendedNextOwner: "NORTH",
      recommendedNextFile: NORTH_FILE,
      recommendedNextRenewalTarget: NORTH_FILE,
      pageResponsive: true,
      hardBlock: false,
      transmissionGovernorActive: true,
      fibonacciCombustionScaleActive: true,
      oneActiveGearAtATime: true,
      shift
    };

    recordTransmission("admit", "WEST_HANDOFF_ACCEPTED_BY_NORTH", response);
    publishAll();

    return response;
  }

  function admitNorthAdmission(input = {}, source = "north-admission") {
    const shift = closeGearAndShift(
      TRANSMISSION_GEARS.NORTH_ADMISSION,
      TRANSMISSION_GEARS.SOUTH_OUTPUT,
      source
    );

    transmissionState.northAdmissionComplete = true;
    transmissionState.southOutputAuthorized = true;
    transmissionState.firstFailedCoordinate = "NONE_SOUTH_OUTPUT_AUTHORIZED_BY_NORTH";
    transmissionState.recommendedNextOwner = "SOUTH";
    transmissionState.recommendedNextFile = SOUTH_FILE;
    transmissionState.recommendedNextRenewalTarget = SOUTH_FILE;
    transmissionState.postgameStatus = "SOUTH_OUTPUT_ACTIVE";

    const response = {
      accepted: true,
      action: CHECKPOINT_EVENT_ACTIONS.ADMIT,
      source,
      event: eventName(input) || "NORTH_ADMISSION_READY",
      gearClosed: TRANSMISSION_GEARS.NORTH_ADMISSION,
      checkpointClosed: "NORTH_ADMISSION_COMPLETE",
      nextGear: TRANSMISSION_GEARS.NORTH_RETURN,
      activeGear: TRANSMISSION_GEARS.SOUTH_OUTPUT,
      activeGearProgress: 0,
      shiftAuthorized: true,
      firstFailedCoordinate: transmissionState.firstFailedCoordinate,
      recommendedNextOwner: transmissionState.recommendedNextOwner,
      recommendedNextFile: transmissionState.recommendedNextFile,
      recommendedNextRenewalTarget: transmissionState.recommendedNextRenewalTarget,
      pageResponsive: true,
      hardBlock: false,
      shift
    };

    recordTransmission("admit", "NORTH_ADMISSION_COMPLETE", response);
    publishAll();
    return response;
  }

  function admitSouthOutput(input = {}, source = "south-output") {
    const shift = closeGearAndShift(
      TRANSMISSION_GEARS.SOUTH_OUTPUT,
      TRANSMISSION_GEARS.NORTH_RETURN,
      source
    );

    transmissionState.southOutputComplete = true;
    transmissionState.firstFailedCoordinate = "NONE_SOUTH_OUTPUT_ACCEPTED_BY_NORTH";
    transmissionState.recommendedNextOwner = "NORTH";
    transmissionState.recommendedNextFile = NORTH_FILE;
    transmissionState.recommendedNextRenewalTarget = NORTH_FILE;
    transmissionState.postgameStatus = "NORTH_RETURN_ACTIVE";

    const response = {
      accepted: true,
      action: CHECKPOINT_EVENT_ACTIONS.ADMIT,
      source,
      event: eventName(input),
      gearClosed: TRANSMISSION_GEARS.SOUTH_OUTPUT,
      checkpointClosed: "SOUTH_OUTPUT_COMPLETE",
      nextGear: TRANSMISSION_GEARS.COMPLETE,
      activeGear: TRANSMISSION_GEARS.NORTH_RETURN,
      activeGearProgress: 0,
      shiftAuthorized: true,
      firstFailedCoordinate: transmissionState.firstFailedCoordinate,
      recommendedNextOwner: transmissionState.recommendedNextOwner,
      recommendedNextFile: transmissionState.recommendedNextFile,
      recommendedNextRenewalTarget: transmissionState.recommendedNextRenewalTarget,
      pageResponsive: true,
      hardBlock: false,
      shift
    };

    recordTransmission("admit", "SOUTH_OUTPUT_ACCEPTED_BY_NORTH", response);
    publishAll();
    return response;
  }

  function admitCompletion(input = {}, source = "completion") {
    const shift = closeGearAndShift(
      TRANSMISSION_GEARS.NORTH_RETURN,
      TRANSMISSION_GEARS.COMPLETE,
      source
    );

    transmissionState.northReturnComplete = true;
    transmissionState.finalCompletionLatched = true;
    transmissionState.activeGearProgress = 100;
    transmissionState.firstFailedCoordinate = "NONE_F21_FULL_LATCHED_BY_NORTH_TRANSMISSION";
    transmissionState.recommendedNextOwner = "NONE";
    transmissionState.recommendedNextFile = "read-postgame-receipt";
    transmissionState.recommendedNextRenewalTarget = "read-postgame-receipt";
    transmissionState.postgameStatus = "READY_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE";

    const response = {
      accepted: true,
      action: CHECKPOINT_EVENT_ACTIONS.ADMIT,
      source,
      event: eventName(input),
      gearClosed: TRANSMISSION_GEARS.NORTH_RETURN,
      checkpointClosed: "NORTH_RETURN_COMPLETE",
      nextGear: TRANSMISSION_GEARS.COMPLETE,
      activeGear: TRANSMISSION_GEARS.COMPLETE,
      activeGearProgress: 100,
      shiftAuthorized: true,
      completionLatched: true,
      firstFailedCoordinate: transmissionState.firstFailedCoordinate,
      recommendedNextOwner: transmissionState.recommendedNextOwner,
      recommendedNextFile: transmissionState.recommendedNextFile,
      recommendedNextRenewalTarget: transmissionState.recommendedNextRenewalTarget,
      pageResponsive: true,
      hardBlock: false,
      shift
    };

    recordTransmission("admit", "COMPLETION_LATCHED_BY_NORTH_TRANSMISSION", response);
    publishAll();
    return response;
  }

  function receiveTransmissionEvent(input = {}, source = "receiveEvent") {
    const packet = normalizePayload(input);
    const name = eventName(packet);

    if (!name) {
      return getArchiveResponse("missing-event-name", { source });
    }

    if (hasEvent(packet, WEST_HANDOFF_EVENTS)) {
      return admitWestHandoff(packet, source);
    }

    if (name === "NORTH_ADMISSION_READY" || name === "NORTH_ACCEPTED_WEST_INTAKE" || name === "NORTH_ADMISSION_STARTED") {
      return admitNorthAdmission(packet, source);
    }

    if (hasEvent(packet, SOUTH_OUTPUT_EVENTS)) {
      return admitSouthOutput(packet, source);
    }

    if (hasEvent(packet, COMPLETION_EVENTS)) {
      return admitCompletion(packet, source);
    }

    const checkpoint = findLegacyCheckpoint(name);

    if (checkpoint) {
      return receiveLegacyCheckpoint(packet, checkpoint, source);
    }

    return getArchiveResponse("unknown-event", {
      source,
      event: name
    });
  }

  function findLegacyCheckpoint(name) {
    return FIBONACCI_CHECKPOINTS.find((checkpoint) => {
      return checkpoint.event === name || asArray(checkpoint.aliases).includes(name) || checkpoint.id === name;
    }) || null;
  }

  function receiveLegacyCheckpoint(input, checkpoint, source) {
    if (checkpoint.event === "INDEX_HANDOFF_ACCEPTED" || asArray(checkpoint.aliases).some((item) => WEST_HANDOFF_EVENTS.includes(item))) {
      return admitWestHandoff(input, source);
    }

    if (checkpoint.event === "VISIBLE_CONTENT_PROOF_PASSED" || checkpoint.event === "INSPECT_MODE_READY") {
      return admitSouthOutput(input, source);
    }

    if (checkpoint.event === "COMPLETION_LATCHED") {
      return admitCompletion(input, source);
    }

    const response = {
      accepted: true,
      action: CHECKPOINT_EVENT_ACTIONS.ARCHIVE,
      reason: "legacy-fibonacci-checkpoint-preserved-for-compatibility",
      source,
      checkpointId: checkpoint.id,
      checkpointEvent: checkpoint.event,
      fibonacci: checkpoint.fibonacci,
      legacyProgress: checkpoint.legacyProgress,
      activeGear: transmissionState.activeGear,
      activeGearProgress: transmissionState.activeGearProgress,
      visibleProgressMode: transmissionState.visibleProgressMode,
      cumulativeProgressControlsVisibleLoader: false,
      pageResponsive: true,
      hardBlock: false
    };

    recordTransmission("archive", "LEGACY_CHECKPOINT_ARCHIVED_FOR_COMPATIBILITY", response);
    publishAll();
    return response;
  }

  function acceptWestHandoff(intake) {
    return admitWestHandoff(intake || {}, "acceptWestHandoff");
  }

  function receiveWestHandoff(intake) {
    return admitWestHandoff(intake || {}, "receiveWestHandoff");
  }

  function acceptWestIntake(intake) {
    return admitWestHandoff(intake || {}, "acceptWestIntake");
  }

  function receiveWestIntake(intake) {
    return admitWestHandoff(intake || {}, "receiveWestIntake");
  }

  function acceptCheckpointEvent(event) {
    return receiveTransmissionEvent(event || {}, "acceptCheckpointEvent");
  }

  function receiveCheckpointEvent(event) {
    return receiveTransmissionEvent(event || {}, "receiveCheckpointEvent");
  }

  function submitEvent(event) {
    return receiveTransmissionEvent(event || {}, "submitEvent");
  }

  function receiveEvent(event) {
    return receiveTransmissionEvent(event || {}, "receiveEvent");
  }

  function getActiveGearState() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      sessionId: transmissionState.sessionId,
      activeGear: transmissionState.activeGear,
      activeGearLabel: transmissionState.activeGearLabel,
      activeGearMechanicalRole: transmissionState.activeGearMechanicalRole,
      activeGearProgress: transmissionState.activeGearProgress,
      activeCycleId: transmissionState.activeCycleId,
      completedCycleCount: transmissionState.completedCycleCount,
      lastClosedCheckpoint: transmissionState.lastClosedCheckpoint,
      nextGear: transmissionState.nextGear,
      shiftAuthorized: transmissionState.shiftAuthorized,
      oneActiveGearAtATime: true,
      transmissionGovernorActive: true,
      fibonacciCombustionScaleActive: true,
      visibleProgressMode: "ACTIVE_GEAR_0_TO_100",
      cumulativeProgressControlsVisibleLoader: false,
      updatedAt: nowIso()
    };
  }

  function getTransmissionReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      cardinalRole: "NORTH",
      authority: "lab-runtime-table-north-transmission-governor-facade",

      northFacadeCompatibilityActive: true,
      hearthNorthAliasesActive: true,
      transmissionGovernorActive: true,
      fibonacciCombustionScaleActive: true,
      oneActiveGearAtATime: true,
      visibleProgressMode: "ACTIVE_GEAR_0_TO_100",
      cumulativeProgressControlsVisibleLoader: false,
      legacyFibonacciProgressPreservedForCompatibility: true,

      westIntakeMethodsActive: true,
      indexHandoffAcceptedRecognized: true,
      s2IndexHandoffAcceptedRecognized: true,
      westHandoffRecognized: true,

      activeGear: transmissionState.activeGear,
      activeGearLabel: transmissionState.activeGearLabel,
      activeGearMechanicalRole: transmissionState.activeGearMechanicalRole,
      activeGearProgress: transmissionState.activeGearProgress,
      activeCycleId: transmissionState.activeCycleId,
      completedCycleCount: transmissionState.completedCycleCount,
      lastClosedCheckpoint: transmissionState.lastClosedCheckpoint,
      nextGear: transmissionState.nextGear,
      shiftAuthorized: transmissionState.shiftAuthorized,

      westHandoffAcceptedByNorth: transmissionState.westHandoffAcceptedByNorth,
      northAdmissionComplete: transmissionState.northAdmissionComplete,
      southOutputAuthorized: transmissionState.southOutputAuthorized,
      southOutputComplete: transmissionState.southOutputComplete,
      northReturnComplete: transmissionState.northReturnComplete,
      finalCompletionLatched: transmissionState.finalCompletionLatched,
      degradedCompletionLatched: transmissionState.degradedCompletionLatched,

      firstFailedCoordinate: transmissionState.firstFailedCoordinate,
      recommendedNextOwner: transmissionState.recommendedNextOwner,
      recommendedNextFile: transmissionState.recommendedNextFile,
      recommendedNextRenewalTarget: transmissionState.recommendedNextRenewalTarget,
      postgameStatus: transmissionState.postgameStatus,

      maxQueueDrainPerCall: transmissionState.maxQueueDrainPerCall,
      maxArchivePerCall: transmissionState.maxArchivePerCall,
      noWhileLoopWithoutGuard: true,
      mainThreadYieldRequiredForLargeQueue: true,

      queueCount: transmissionState.queue.length,
      archivedEventsCount: transmissionState.archivedEvents.length,
      blockedEventsCount: transmissionState.blockedEvents.length,
      admittedEventsCount: transmissionState.admittedEvents.length,
      heldEventsCount: transmissionState.heldEvents.length,

      gearHistory: clonePlain(transmissionState.gearHistory),
      admittedEvents: clonePlain(transmissionState.admittedEvents.slice(-50)),
      heldEvents: clonePlain(transmissionState.heldEvents.slice(-50)),
      archivedEvents: clonePlain(transmissionState.archivedEvents.slice(-50)),
      blockedEvents: clonePlain(transmissionState.blockedEvents.slice(-50)),
      errors: clonePlain(transmissionState.errors),

      gearOrder: clonePlain(TRANSMISSION_ORDER),
      gearLabels: clonePlain(GEAR_LABELS),
      gearMechanics: clonePlain(GEAR_MECHANICS),
      fibonacciCombustionMap: FIBONACCI_CHECKPOINTS.map((checkpoint) => ({
        id: checkpoint.id,
        event: checkpoint.event,
        aliases: asArray(checkpoint.aliases),
        rank: checkpoint.rank,
        fibonacci: checkpoint.fibonacci,
        value: checkpoint.value,
        legacyProgress: checkpoint.legacyProgress,
        label: checkpoint.label,
        combustion: checkpoint.combustion
      })),

      ownsTimingGovernance: true,
      ownsSequenceGovernance: true,
      ownsCheckpointLaw: true,
      ownsActiveGearState: true,
      ownsGearShiftAuthorization: true,
      ownsWestIntakeAcceptance: true,
      ownsSouthProofClosure: true,
      ownsReturnToEastAuthorization: true,
      ownsEastFirstPaint: false,
      ownsWestHandoffValidation: false,
      ownsSouthCanvasProof: false,
      ownsCanvasDrawing: false,
      ownsSourceStackTruth: false,
      ownsChildChannelTruth: false,
      ownsTouchDragControls: false,
      ownsRouteOrchestration: false,
      ownsFinalVisualPassClaim: false,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      createdAt: transmissionState.createdAt,
      updatedAt: nowIso()
    };
  }

  function getTransmissionReceiptText() {
    const receipt = getTransmissionReceipt();

    const gearHistory = receipt.gearHistory.map((item) => (
      `- ${item.at || ""} :: gear=${item.gear}; closed=${item.closedCheckpoint}; inferred=${item.inferred === true}; reason=${item.reason || ""}`
    )).join("\n") || "- none";

    const admitted = receipt.admittedEvents.map((item) => (
      `- ${item.at || ""} :: ${item.event || ""} :: ${JSON.stringify(item.detail || {})}`
    )).join("\n") || "- none";

    const held = receipt.heldEvents.map((item) => (
      `- ${item.at || ""} :: ${item.event || ""} :: ${JSON.stringify(item.detail || {})}`
    )).join("\n") || "- none";

    const archived = receipt.archivedEvents.map((item) => (
      `- ${item.at || ""} :: ${item.event || ""} :: ${JSON.stringify(item.detail || {})}`
    )).join("\n") || "- none";

    const errors = receipt.errors.map((item) => (
      `- ${item.at || ""} :: ${item.code || ""} :: ${item.message || ""}`
    )).join("\n") || "- none";

    return [
      "LAB_RUNTIME_TABLE_NORTH_TRANSMISSION_GOVERNOR_FIBONACCI_COMBUSTION_RECEIPT",
      "",
      `contract=${receipt.contract}`,
      `receipt=${receipt.receipt}`,
      `previousContract=${receipt.previousContract}`,
      `baselineContract=${receipt.baselineContract}`,
      `version=${receipt.version}`,
      `file=${receipt.file}`,
      `route=${receipt.route}`,
      `cardinalRole=${receipt.cardinalRole}`,
      "",
      `northFacadeCompatibilityActive=${receipt.northFacadeCompatibilityActive}`,
      `hearthNorthAliasesActive=${receipt.hearthNorthAliasesActive}`,
      `transmissionGovernorActive=${receipt.transmissionGovernorActive}`,
      `fibonacciCombustionScaleActive=${receipt.fibonacciCombustionScaleActive}`,
      `oneActiveGearAtATime=${receipt.oneActiveGearAtATime}`,
      `visibleProgressMode=${receipt.visibleProgressMode}`,
      `cumulativeProgressControlsVisibleLoader=${receipt.cumulativeProgressControlsVisibleLoader}`,
      `legacyFibonacciProgressPreservedForCompatibility=${receipt.legacyFibonacciProgressPreservedForCompatibility}`,
      "",
      `westIntakeMethodsActive=${receipt.westIntakeMethodsActive}`,
      `indexHandoffAcceptedRecognized=${receipt.indexHandoffAcceptedRecognized}`,
      `s2IndexHandoffAcceptedRecognized=${receipt.s2IndexHandoffAcceptedRecognized}`,
      `westHandoffRecognized=${receipt.westHandoffRecognized}`,
      "",
      `activeGear=${receipt.activeGear}`,
      `activeGearLabel=${receipt.activeGearLabel}`,
      `activeGearMechanicalRole=${receipt.activeGearMechanicalRole}`,
      `activeGearProgress=${receipt.activeGearProgress}`,
      `activeCycleId=${receipt.activeCycleId}`,
      `completedCycleCount=${receipt.completedCycleCount}`,
      `lastClosedCheckpoint=${receipt.lastClosedCheckpoint}`,
      `nextGear=${receipt.nextGear}`,
      `shiftAuthorized=${receipt.shiftAuthorized}`,
      "",
      `westHandoffAcceptedByNorth=${receipt.westHandoffAcceptedByNorth}`,
      `northAdmissionComplete=${receipt.northAdmissionComplete}`,
      `southOutputAuthorized=${receipt.southOutputAuthorized}`,
      `southOutputComplete=${receipt.southOutputComplete}`,
      `northReturnComplete=${receipt.northReturnComplete}`,
      `finalCompletionLatched=${receipt.finalCompletionLatched}`,
      `degradedCompletionLatched=${receipt.degradedCompletionLatched}`,
      "",
      `firstFailedCoordinate=${receipt.firstFailedCoordinate}`,
      `recommendedNextOwner=${receipt.recommendedNextOwner}`,
      `recommendedNextFile=${receipt.recommendedNextFile}`,
      `recommendedNextRenewalTarget=${receipt.recommendedNextRenewalTarget}`,
      `postgameStatus=${receipt.postgameStatus}`,
      "",
      `queueCount=${receipt.queueCount}`,
      `admittedEventsCount=${receipt.admittedEventsCount}`,
      `heldEventsCount=${receipt.heldEventsCount}`,
      `archivedEventsCount=${receipt.archivedEventsCount}`,
      `blockedEventsCount=${receipt.blockedEventsCount}`,
      "",
      "GEAR_HISTORY",
      gearHistory,
      "",
      "ADMITTED_EVENTS",
      admitted,
      "",
      "HELD_EVENTS",
      held,
      "",
      "ARCHIVED_EVENTS",
      archived,
      "",
      "ERRORS",
      errors,
      "",
      `ownsTimingGovernance=${receipt.ownsTimingGovernance}`,
      `ownsSequenceGovernance=${receipt.ownsSequenceGovernance}`,
      `ownsCheckpointLaw=${receipt.ownsCheckpointLaw}`,
      `ownsActiveGearState=${receipt.ownsActiveGearState}`,
      `ownsGearShiftAuthorization=${receipt.ownsGearShiftAuthorization}`,
      `ownsWestIntakeAcceptance=${receipt.ownsWestIntakeAcceptance}`,
      `ownsSouthProofClosure=${receipt.ownsSouthProofClosure}`,
      `ownsReturnToEastAuthorization=${receipt.ownsReturnToEastAuthorization}`,
      "",
      `ownsEastFirstPaint=${receipt.ownsEastFirstPaint}`,
      `ownsWestHandoffValidation=${receipt.ownsWestHandoffValidation}`,
      `ownsSouthCanvasProof=${receipt.ownsSouthCanvasProof}`,
      `ownsCanvasDrawing=${receipt.ownsCanvasDrawing}`,
      `ownsSourceStackTruth=${receipt.ownsSourceStackTruth}`,
      `ownsChildChannelTruth=${receipt.ownsChildChannelTruth}`,
      `ownsTouchDragControls=${receipt.ownsTouchDragControls}`,
      `ownsRouteOrchestration=${receipt.ownsRouteOrchestration}`,
      `ownsFinalVisualPassClaim=${receipt.ownsFinalVisualPassClaim}`,
      "",
      `generatedImage=${receipt.generatedImage}`,
      `graphicBox=${receipt.graphicBox}`,
      `webGL=${receipt.webGL}`,
      `visualPassClaimed=${receipt.visualPassClaimed}`,
      "",
      `createdAt=${receipt.createdAt}`,
      `updatedAt=${receipt.updatedAt}`
    ].join("\n");
  }

  function getNorthCommandReceipt() {
    return getTransmissionReceipt();
  }

  function getHearthTransmissionSession() {
    return transmissionSession;
  }

  function createHearthTransmissionSession(options = {}) {
    if (options && options.reset === true) {
      resetTransmission("createHearthTransmissionSession-reset");
    }
    return transmissionSession;
  }

  function resetTransmission(reason = "manual-reset") {
    transmissionState.activeGear = TRANSMISSION_GEARS.EAST_IGNITION;
    transmissionState.activeGearLabel = GEAR_LABELS.EAST_IGNITION;
    transmissionState.activeGearMechanicalRole = GEAR_MECHANICS.EAST_IGNITION;
    transmissionState.activeGearProgress = 0;
    transmissionState.activeCycleId = "cycle-1-east-ignition";
    transmissionState.completedCycleCount = 0;
    transmissionState.lastClosedCheckpoint = "";
    transmissionState.nextGear = TRANSMISSION_GEARS.WEST_SYNCHRONIZER;
    transmissionState.shiftAuthorized = false;
    transmissionState.westHandoffAcceptedByNorth = false;
    transmissionState.northAdmissionComplete = false;
    transmissionState.southOutputAuthorized = false;
    transmissionState.southOutputComplete = false;
    transmissionState.northReturnComplete = false;
    transmissionState.finalCompletionLatched = false;
    transmissionState.degradedCompletionLatched = false;
    transmissionState.firstFailedCoordinate = "WAITING_EAST_OR_WEST_HANDOFF";
    transmissionState.recommendedNextOwner = "EAST";
    transmissionState.recommendedNextFile = EAST_FILE;
    transmissionState.recommendedNextRenewalTarget = EAST_FILE;
    transmissionState.postgameStatus = "NORTH_TRANSMISSION_GOVERNOR_READY";
    transmissionState.queue = [];
    transmissionState.updatedAt = nowIso();

    recordTransmission("gear", "TRANSMISSION_RESET", { reason });
    publishAll();
    return getTransmissionReceipt();
  }

  const transmissionSession = {
    contract: CONTRACT,
    receipt: RECEIPT,
    sessionId: transmissionState.sessionId,
    route: ROUTE,
    file: FILE,
    cardinalRole: "NORTH",

    acceptWestHandoff,
    receiveWestHandoff,
    acceptWestIntake,
    receiveWestIntake,
    acceptCheckpointEvent,
    receiveCheckpointEvent,
    submitEvent,
    receiveEvent,

    closeActiveGear,
    authorizeNextGear,
    setActiveGear,
    updateActiveGearProgress,
    getActiveGearState,
    getTransmissionReceipt,
    getReceipt: getTransmissionReceipt,
    getReceiptText: getTransmissionReceiptText,
    getNorthCommandReceipt,
    reset: resetTransmission,

    get state() {
      return transmissionState;
    }
  };

  function createCheckpointSession(_sequenceInput = null, options = {}) {
    const sessionId = options.sessionId || options.id || transmissionState.sessionId;

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      checkpointSessionContract: "LAB_RUNTIME_TABLE_NORTH_TRANSMISSION_SESSION_WRAPPER_v1",
      checkpointSessionReceipt: "LAB_RUNTIME_TABLE_NORTH_TRANSMISSION_SESSION_WRAPPER_RECEIPT_v1",
      sessionId,
      route: options.route || ROUTE,
      transmissionWrapped: true,
      persistentNorthSession: true,

      submitEvent,
      submitMany(events = []) {
        return asArray(events).map((event) => submitEvent(event));
      },
      completeActive(event = {}) {
        return submitEvent(event);
      },
      canAdvanceTo() {
        return true;
      },
      getActiveCheckpoint() {
        return {
          activeGear: transmissionState.activeGear,
          activeGearLabel: transmissionState.activeGearLabel,
          activeGearProgress: transmissionState.activeGearProgress,
          activeCycleId: transmissionState.activeCycleId
        };
      },
      getCheckpointState() {
        return getTransmissionReceipt();
      },
      getNewsGateState() {
        return evaluateNewsGateState({});
      },
      getReceipt: getTransmissionReceipt,
      getReceiptText: getTransmissionReceiptText,
      reset: resetTransmission,

      get state() {
        return transmissionState;
      }
    };
  }

  function createHearthCheckpointSession(options = {}) {
    return createCheckpointSession(null, {
      ...options,
      planetId: "hearth",
      planetLabel: "Hearth",
      route: ROUTE
    });
  }

  function createChronologicalFibonacciPlan(options = {}) {
    const sequence = asArray(options.sequence).length ? asArray(options.sequence) : FIBONACCI_CHECKPOINTS.slice();

    return sequence.map((checkpoint) => ({
      ...checkpoint,
      progress: checkpoint.legacyProgress,
      legacyProgress: checkpoint.legacyProgress,
      visibleProgressMode: "ACTIVE_GEAR_0_TO_100",
      cumulativeProgressControlsVisibleLoader: false,
      aliases: asArray(checkpoint.aliases),
      complete: false,
      degraded: false,
      status: CHECKPOINT_STATUS.PENDING
    })).sort((a, b) => a.rank - b.rank);
  }

  function createNewsFibonacciCheckpointPlan(options = {}) {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "north-transmission-fibonacci-combustion-plan",
      sequence: createChronologicalFibonacciPlan(options),
      newsGates: clonePlain(NEWS_GATES),
      transmissionGovernorActive: true,
      fibonacciCombustionScaleActive: true,
      oneActiveGearAtATime: true,
      visibleProgressMode: "ACTIVE_GEAR_0_TO_100",
      cumulativeProgressControlsVisibleLoader: false,
      legacyFibonacciProgressPreservedForCompatibility: true,
      gearOrder: clonePlain(TRANSMISSION_ORDER),
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function classifyCheckpointEvent(event = {}) {
    const name = eventName(event);

    if (!name) {
      return {
        action: CHECKPOINT_EVENT_ACTIONS.ARCHIVE,
        gapClass: GAP_CLASS.DUPLICATE_ARCHIVE,
        reason: "missing-event-name",
        activeGear: transmissionState.activeGear,
        activeGearProgress: transmissionState.activeGearProgress
      };
    }

    if (WEST_HANDOFF_EVENTS.includes(name)) {
      return {
        action: CHECKPOINT_EVENT_ACTIONS.ADMIT,
        gapClass: GAP_CLASS.NONE,
        checkpointId: "WEST_HANDOFF_ACCEPTED",
        checkpointEvent: "INDEX_HANDOFF_ACCEPTED",
        gear: TRANSMISSION_GEARS.WEST_SYNCHRONIZER,
        nextGear: TRANSMISSION_GEARS.NORTH_ADMISSION,
        reason: "west-handoff-recognized",
        activeGear: transmissionState.activeGear,
        activeGearProgress: transmissionState.activeGearProgress
      };
    }

    if (SOUTH_OUTPUT_EVENTS.includes(name)) {
      return {
        action: CHECKPOINT_EVENT_ACTIONS.ADMIT,
        gapClass: GAP_CLASS.NONE,
        checkpointId: "SOUTH_OUTPUT_ACCEPTED",
        gear: TRANSMISSION_GEARS.SOUTH_OUTPUT,
        nextGear: TRANSMISSION_GEARS.NORTH_RETURN,
        reason: "south-output-recognized",
        activeGear: transmissionState.activeGear,
        activeGearProgress: transmissionState.activeGearProgress
      };
    }

    if (COMPLETION_EVENTS.includes(name)) {
      return {
        action: CHECKPOINT_EVENT_ACTIONS.ADMIT,
        gapClass: GAP_CLASS.NONE,
        checkpointId: "F21_COMPLETION_LATCHED",
        gear: TRANSMISSION_GEARS.NORTH_RETURN,
        nextGear: TRANSMISSION_GEARS.COMPLETE,
        reason: "completion-event-recognized",
        activeGear: transmissionState.activeGear,
        activeGearProgress: transmissionState.activeGearProgress
      };
    }

    const legacy = findLegacyCheckpoint(name);
    if (legacy) {
      return {
        action: CHECKPOINT_EVENT_ACTIONS.ARCHIVE,
        gapClass: GAP_CLASS.DUPLICATE_ARCHIVE,
        checkpointId: legacy.id,
        checkpointEvent: legacy.event,
        fibonacci: legacy.fibonacci,
        reason: "legacy-checkpoint-compatible-archive",
        activeGear: transmissionState.activeGear,
        activeGearProgress: transmissionState.activeGearProgress
      };
    }

    return {
      action: CHECKPOINT_EVENT_ACTIONS.ARCHIVE,
      gapClass: GAP_CLASS.DUPLICATE_ARCHIVE,
      reason: "unknown-event-archived",
      event: name,
      activeGear: transmissionState.activeGear,
      activeGearProgress: transmissionState.activeGearProgress
    };
  }

  function evaluateNewsGateState(snapshot = {}) {
    const packet = normalizePayload(snapshot);

    const northGateReady = Boolean(
      transmissionState.westHandoffAcceptedByNorth ||
      transmissionState.northAdmissionComplete ||
      safeBool(packet.northGateReady, false)
    );

    const eastGateReady = Boolean(
      safeBool(packet.eastGateReady, false) ||
      safeBool(packet.step1Ready, false) ||
      safeBool(packet.firstPaintReady, false) ||
      safeBool(packet.mountReady, false)
    );

    const westGateReady = Boolean(
      safeBool(packet.westGateReady, false) ||
      transmissionState.westHandoffAcceptedByNorth
    );

    const southGateReady = Boolean(
      safeBool(packet.southGateReady, false) ||
      safeBool(packet.visibleContentProof, false) ||
      safeBool(packet.diagnosticCanLeavePlanetFrame, false) ||
      transmissionState.southOutputComplete
    );

    const newsGatePassedBeforeF21 = Boolean(northGateReady && eastGateReady && westGateReady && southGateReady);
    const newsGateDegradedBeforeF21 = Boolean(
      newsGatePassedBeforeF21 ||
      (
        northGateReady &&
        westGateReady &&
        (
          southGateReady ||
          safeBool(packet.imageRendered, false) ||
          safeBool(packet.nonblankPlanetVisible, false)
        )
      )
    );

    return {
      northGateReady,
      eastGateReady,
      westGateReady,
      southGateReady,
      newsGatePassedBeforeF21,
      northGateDegradedReady: northGateReady,
      westGateDegradedReady: westGateReady,
      southGateDegradedReady: newsGateDegradedBeforeF21,
      newsGateDegradedBeforeF21,
      degradedForwardAvailable: newsGateDegradedBeforeF21 && !newsGatePassedBeforeF21
    };
  }

  function normalizeBudget(input = {}) {
    const raw = isObject(input) ? input : {};
    return {
      sampleRate: clamp(raw.sampleRate ?? 1, 0.05, 1),
      atlasWidth: clamp(raw.atlasWidth ?? 384, 32, 2048),
      atlasHeight: clamp(raw.atlasHeight ?? 192, 16, 1024),
      rowsPerChunk: clamp(raw.rowsPerChunk ?? 2, 1, 16),
      probeRowsPerChunk: clamp(raw.probeRowsPerChunk ?? 2, 1, 12),
      wideProbeMinPoints: clamp(raw.wideProbeMinPoints ?? 25, 1, 4096),
      priority: clamp(raw.priority ?? 1, 0, 10),
      canDegrade: raw.canDegrade !== false,
      canFallback: raw.canFallback !== false,
      visibleCarrierFirst: raw.visibleCarrierFirst !== false,
      deferWideProbe: raw.deferWideProbe !== false
    };
  }

  function createIssue(code, message, severity = STATUS.DEGRADED, detail = {}) {
    return {
      code,
      message,
      severity,
      detail: clonePlain(detail),
      at: nowIso()
    };
  }

  function readReceipt(authority) {
    if (!authority || !isObject(authority)) return null;
    if (isFunction(authority.getReceipt)) {
      try {
        const receipt = authority.getReceipt();
        if (receipt && isObject(receipt)) return receipt;
      } catch (error) {
        return {
          error: error && error.message ? error.message : String(error)
        };
      }
    }
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receipt)) return authority.receipt;
    return null;
  }

  function resolveAuthority(registration) {
    if (!registration) return null;
    if (registration.authority && isObject(registration.authority)) return registration.authority;
    if (registration.globalName && root[registration.globalName]) return root[registration.globalName];
    if (isFunction(registration.resolve)) {
      try {
        return registration.resolve();
      } catch (_error) {
        return null;
      }
    }
    return null;
  }

  function sampleAuthority(authority, samplePoint, methods) {
    const methodList = asArray(methods).length ? asArray(methods) : ["sample", "read"];
    for (const method of methodList) {
      if (!isFunction(authority && authority[method])) continue;
      try {
        const sample = authority[method](samplePoint);
        if (sample && isObject(sample)) return { ok: true, method, sample };
      } catch (error) {
        return {
          ok: false,
          method,
          error: error && error.message ? error.message : String(error)
        };
      }
    }
    return {
      ok: false,
      method: "",
      error: "No sample/read method returned an object."
    };
  }

  function coordinateCheck(packet, requiredCoordinates) {
    const required = asArray(requiredCoordinates).length ? asArray(requiredCoordinates) : ["u", "v", "x", "y", "z"];
    const missing = [];
    required.forEach((key) => {
      if (!Number.isFinite(Number(packet && packet[key]))) missing.push(key);
    });
    return {
      ok: missing.length === 0,
      missing,
      required
    };
  }

  function contractCheck(authority, receipt, expectedContract) {
    if (!expectedContract) {
      return {
        ok: true,
        expected: "",
        actual: authority && authority.contract ? authority.contract : receipt && receipt.contract ? receipt.contract : ""
      };
    }

    const actual =
      (authority && typeof authority.contract === "string" && authority.contract) ||
      (receipt && typeof receipt.contract === "string" && receipt.contract) ||
      "";

    return {
      ok: actual === expectedContract,
      expected: expectedContract,
      actual
    };
  }

  function lawCheck(sample, laws) {
    const issues = [];
    asArray(laws).forEach((law) => {
      if (!law) return;
      if (typeof law === "function") {
        try {
          if (law(sample) === false) {
            issues.push(createIssue("LAW_FUNCTION_FALSE", "A supplied law predicate returned false.", STATUS.REJECTED));
          }
        } catch (error) {
          issues.push(createIssue("LAW_FUNCTION_ERROR", `A supplied law predicate threw: ${error && error.message ? error.message : String(error)}`, STATUS.REJECTED));
        }
        return;
      }

      if (!isObject(law) || !law.field) return;
      const actual = sample ? sample[law.field] : undefined;
      if (actual !== law.expected) {
        issues.push(createIssue(
          law.code || `LAW_${String(law.field).toUpperCase()}`,
          law.message || `Law mismatch: ${law.field} expected ${String(law.expected)} but received ${String(actual)}.`,
          law.severity || STATUS.REJECTED,
          { field: law.field, expected: law.expected, actual }
        ));
      }
    });
    return {
      ok: issues.length === 0,
      issues
    };
  }

  function decideStatus(issues, sampleResult, options = {}) {
    if (!sampleResult.ok) return options.sampleFailureBlocking === true ? STATUS.BLOCKING : STATUS.FALLBACK;
    const severities = issues.map((issue) => issue.severity);
    if (severities.includes(STATUS.BLOCKING)) return STATUS.BLOCKING;
    if (severities.includes(STATUS.REJECTED)) return STATUS.REJECTED;
    if (severities.includes(STATUS.FALLBACK)) return STATUS.FALLBACK;
    if (severities.includes(STATUS.DEGRADED)) return STATUS.DEGRADED;
    if (severities.includes(STATUS.HELD)) return STATUS.HELD;
    return STATUS.READY;
  }

  function resolveHandoff(records) {
    const statuses = records.map((record) => record.status);
    if (statuses.includes(STATUS.BLOCKING)) return HANDOFF.BLOCKING;
    if (statuses.includes(STATUS.REJECTED)) return HANDOFF.REJECTED;
    if (statuses.includes(STATUS.FALLBACK)) return HANDOFF.FALLBACK_PASS;
    if (statuses.includes(STATUS.DEGRADED)) return HANDOFF.DEGRADED_PASS;
    if (statuses.includes(STATUS.OPTIMIZED)) return HANDOFF.OPTIMIZED_PASS;
    if (statuses.includes(STATUS.HELD)) return HANDOFF.HELD_PASS;
    return HANDOFF.FULL_PASS;
  }

  function handoffAllowsRuntime(handoff) {
    return [
      HANDOFF.FULL_PASS,
      HANDOFF.OPTIMIZED_PASS,
      HANDOFF.DEGRADED_PASS,
      HANDOFF.FALLBACK_PASS,
      HANDOFF.HELD_PASS
    ].includes(handoff);
  }

  function RuntimeTable(options = {}) {
    const state = {
      id: options.id || `runtime-table-${Math.random().toString(36).slice(2, 9)}`,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      registrations: [],
      records: [],
      ledger: [],
      handoff: HANDOFF.BLOCKING,
      runtimeAllowed: false,
      tableSet: false,
      status: STATUS.PENDING,
      budget: normalizeBudget(options.budget || {}),
      planetId: options.planetId || "",
      planetLabel: options.planetLabel || ""
    };

    function log(event, detail = {}) {
      const entry = { event, detail: clonePlain(detail), at: nowIso() };
      state.ledger.push(entry);
      if (state.ledger.length > 160) state.ledger.splice(0, state.ledger.length - 160);
      state.updatedAt = entry.at;
      return entry;
    }

    function registerChild(registration = {}) {
      const record = {
        key: registration.key || registration.name || `child-${state.registrations.length + 1}`,
        name: registration.name || registration.key || `Child ${state.registrations.length + 1}`,
        planetId: registration.planetId || state.planetId || "",
        channelType: registration.channelType || registration.key || "",
        expectedContract: registration.expectedContract || registration.contract || "",
        globalName: registration.globalName || "",
        requiredMethods: asArray(registration.requiredMethods).length ? asArray(registration.requiredMethods) : ["sample", "read"],
        requiredCoordinates: asArray(registration.requiredCoordinates).length ? asArray(registration.requiredCoordinates) : ["u", "v", "x", "y", "z"],
        laws: asArray(registration.laws),
        budget: normalizeBudget(registration.budget || state.budget),
        sampleFailureBlocking: registration.sampleFailureBlocking === true,
        canFallback: registration.canFallback !== false,
        canDegrade: registration.canDegrade !== false,
        authority: registration.authority || null,
        resolve: registration.resolve || null,
        metadata: clonePlain(registration.metadata || {})
      };

      state.registrations.push(record);
      log("REGISTER_CHILD", {
        key: record.key,
        channelType: record.channelType,
        expectedContract: record.expectedContract
      });
      return record;
    }

    function validateChild(registration, samplePoint = {}) {
      const authority = resolveAuthority(registration);
      const issues = [];

      if (!authority) {
        const status = registration.canFallback ? STATUS.FALLBACK : STATUS.BLOCKING;
        return {
          key: registration.key,
          name: registration.name,
          planetId: registration.planetId,
          channelType: registration.channelType,
          status,
          rawStatus: status,
          authorityPresent: false,
          contractOk: false,
          expectedContract: registration.expectedContract,
          actualContract: "",
          methodsOk: false,
          coordinatesOk: false,
          coordinateMissing: registration.requiredCoordinates.slice(),
          lawsOk: false,
          sampleOk: false,
          sampleMethod: "",
          sample: null,
          receipt: null,
          issues: [createIssue("CHILD_MISSING", `${registration.name || registration.key} missing or unavailable.`, status)],
          budget: registration.budget,
          optimizationReason: "Authority missing; fallback/degraded handoff may proceed if safe.",
          ready: false,
          optimized: false,
          degraded: false,
          fallback: status === STATUS.FALLBACK,
          held: false,
          rejected: false,
          blocking: status === STATUS.BLOCKING,
          coordinate: C_COORDINATES.C6_GLOBAL_ACTOR_MISSING,
          at: nowIso()
        };
      }

      const receipt = readReceipt(authority);
      const contract = contractCheck(authority, receipt, registration.expectedContract);
      if (!contract.ok) {
        issues.push(createIssue("WRONG_CONTRACT", `${registration.key} wrong contract.`, STATUS.REJECTED, contract));
      }

      const sample = sampleAuthority(authority, samplePoint, registration.requiredMethods);
      if (!sample.ok) {
        issues.push(createIssue("SAMPLE_FAILED", sample.error, registration.sampleFailureBlocking ? STATUS.BLOCKING : STATUS.FALLBACK));
      }

      const coordinates = sample.ok ? coordinateCheck(sample.sample, registration.requiredCoordinates) : { ok: false, missing: registration.requiredCoordinates };
      if (sample.ok && !coordinates.ok) {
        issues.push(createIssue("COORDINATE_MISMATCH", `Missing coordinate fields: ${coordinates.missing.join(", ")}`, STATUS.REJECTED));
      }

      const laws = sample.ok ? lawCheck(sample.sample, registration.laws) : { ok: false, issues: [] };
      issues.push(...laws.issues);

      const status = decideStatus(issues, sample, registration);

      return {
        key: registration.key,
        name: registration.name,
        planetId: registration.planetId,
        channelType: registration.channelType,
        status,
        rawStatus: status,
        authorityPresent: true,
        contractOk: contract.ok,
        expectedContract: contract.expected,
        actualContract: contract.actual,
        methodsOk: sample.ok,
        coordinatesOk: coordinates.ok,
        coordinateMissing: coordinates.missing || [],
        lawsOk: laws.ok,
        sampleOk: sample.ok,
        sampleMethod: sample.method,
        sample: sample.ok ? clonePlain(sample.sample) : null,
        receipt: clonePlain(receipt),
        issues,
        budget: registration.budget,
        optimizationReason: "Validated by North Runtime Table.",
        ready: status === STATUS.READY,
        optimized: status === STATUS.OPTIMIZED,
        degraded: status === STATUS.DEGRADED,
        fallback: status === STATUS.FALLBACK,
        held: status === STATUS.HELD,
        rejected: status === STATUS.REJECTED,
        blocking: status === STATUS.BLOCKING,
        coordinate: status === STATUS.READY ? C_COORDINATES.C11_CHILD_VALIDATED : C_COORDINATES.C8_SAMPLE_API_FAILURE,
        at: nowIso()
      };
    }

    function run(samplePoint = {}) {
      state.records = state.registrations.map((registration) => validateChild(registration, samplePoint));
      state.handoff = resolveHandoff(state.records);
      state.runtimeAllowed = handoffAllowsRuntime(state.handoff);
      state.tableSet = state.runtimeAllowed;
      state.status = state.runtimeAllowed ? STATUS.READY : state.handoff === HANDOFF.REJECTED ? STATUS.REJECTED : STATUS.BLOCKING;
      state.updatedAt = nowIso();
      log("RUN_TABLE", {
        handoff: state.handoff,
        runtimeAllowed: state.runtimeAllowed,
        childCount: state.records.length
      });
      return reportLedger();
    }

    function reportLedger() {
      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        previousContract: PREVIOUS_CONTRACT,
        baselineContract: BASELINE_CONTRACT,
        version: VERSION,
        id: state.id,
        planetId: state.planetId,
        planetLabel: state.planetLabel,
        status: state.status,
        handoff: state.handoff,
        runtimeAllowed: state.runtimeAllowed,
        tableSet: state.tableSet,
        runtimeTable: true,
        childCount: state.registrations.length,
        records: clonePlain(state.records),
        ledger: clonePlain(state.ledger),
        northPrecedent: true,
        cardinalSplitActive: true,
        transmissionGovernorAvailable: true,
        visualPassClaimed: false,
        updatedAt: state.updatedAt
      };
    }

    function allowHandoff() {
      const ledger = reportLedger();
      return {
        allowed: ledger.runtimeAllowed,
        handoff: ledger.handoff,
        reason: ledger.runtimeAllowed ? "Runtime Table set." : "Runtime Table not set.",
        ledger
      };
    }

    function rejectHandoff(reason = "Manual rejection.") {
      state.handoff = HANDOFF.REJECTED;
      state.runtimeAllowed = false;
      state.tableSet = false;
      state.status = STATUS.REJECTED;
      log("MANUAL_REJECT_HANDOFF", { reason });
      return reportLedger();
    }

    function fallbackHandoff(reason = "Manual fallback handoff.") {
      state.handoff = HANDOFF.FALLBACK_PASS;
      state.runtimeAllowed = true;
      state.tableSet = true;
      state.status = STATUS.READY;
      log("MANUAL_FALLBACK_HANDOFF", { reason });
      return reportLedger();
    }

    function setBudget(nextBudget = {}) {
      state.budget = normalizeBudget({ ...state.budget, ...nextBudget });
      log("SET_BUDGET", state.budget);
      return state.budget;
    }

    function reset() {
      state.records = [];
      state.ledger = [];
      state.handoff = HANDOFF.BLOCKING;
      state.runtimeAllowed = false;
      state.tableSet = false;
      state.status = STATUS.PENDING;
      state.updatedAt = nowIso();
      log("RESET_TABLE", { id: state.id });
      return reportLedger();
    }

    function createPlan(input = {}, options = {}) {
      const ledger = state.records.length ? reportLedger() : run(input.samplePoint || { u: 0.5, v: 0.5, x: 0, y: 0, z: 1 });
      return createUniversalPlanetVisualCarrierPlan({ ...input, runtimeTableLedger: ledger }, options);
    }

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      id: state.id,
      registerChild,
      validateChild,
      run,
      reportLedger,
      allowHandoff,
      rejectHandoff,
      fallbackHandoff,
      setBudget,
      reset,
      createPlan,
      get state() {
        return state;
      },
      getReceipt() {
        return {
          contract: CONTRACT,
          receipt: RECEIPT,
          authority: "lab-runtime-table-north-standard-instance",
          id: state.id,
          runtimeTable: true,
          tableSet: state.tableSet,
          handoff: state.handoff,
          runtimeAllowed: state.runtimeAllowed,
          status: state.status,
          childCount: state.registrations.length,
          northPrecedent: true,
          transmissionGovernorAvailable: true,
          visualPassClaimed: false,
          updatedAt: nowIso()
        };
      }
    };
  }

  function createTable(options = {}) {
    return RuntimeTable(options);
  }

  function normalizeChannelRegistration(channel = {}, planet = {}) {
    const key = channel.key || channel.channel || channel.name || `channel-${Math.random().toString(36).slice(2, 7)}`;
    return {
      key,
      name: channel.name || `${planet.label || planet.id || "Planet"} ${key} Channel`,
      planetId: channel.planetId || planet.id || "",
      channelType: channel.channelType || key,
      globalName: channel.globalName || "",
      expectedContract: channel.expectedContract || channel.contract || "",
      requiredMethods: channel.requiredMethods || ["sample", "read"],
      requiredCoordinates: channel.requiredCoordinates || ["u", "v", "x", "y", "z"],
      laws: channel.laws || [],
      budget: channel.budget || planet.budget || {},
      sampleFailureBlocking: channel.sampleFailureBlocking === true,
      canFallback: channel.canFallback !== false,
      canDegrade: channel.canDegrade !== false,
      authority: channel.authority || null,
      resolve: channel.resolve || null,
      metadata: channel.metadata || {}
    };
  }

  function createPlanetChannelTable(options = {}) {
    const planet = options.planet || {
      id: options.planetId || "",
      label: options.planetLabel || ""
    };

    const table = RuntimeTable({
      id: options.id || `${planet.id || "planet"}-channel-runtime-table`,
      planetId: planet.id || options.planetId || "",
      planetLabel: planet.label || options.planetLabel || "",
      budget: options.budget || {}
    });

    asArray(options.channels).forEach((channel) => {
      table.registerChild(normalizeChannelRegistration(channel, planet));
    });

    return table;
  }

  function createHearthChannelTable(options = {}) {
    return createPlanetChannelTable({
      id: options.id || "hearth-channel-runtime-table",
      planet: { id: "hearth", label: "Hearth" },
      channels: [
        {
          key: "land",
          name: "Hearth Land Channel",
          globalName: "HEARTH_LAND_CHANNEL",
          expectedContract: options.landContract || "HEARTH_LAND_SURFACE_ATTACHMENT_CHANNEL_TNT_v1",
          laws: [{ field: "allowedToFloat", expected: false, code: "LAND_CANNOT_FLOAT", severity: STATUS.REJECTED }],
          canFallback: true
        },
        {
          key: "water",
          name: "Hearth Water Channel",
          globalName: "HEARTH_WATER_CHANNEL",
          expectedContract: options.waterContract || "HEARTH_WATER_HYDROSPHERE_SURFACE_CHANNEL_TNT_v1",
          laws: [{ field: "allowedToFloat", expected: false, code: "WATER_CANNOT_FLOAT", severity: STATUS.REJECTED }],
          canFallback: true
        },
        {
          key: "air",
          name: "Hearth Air Channel",
          globalName: "HEARTH_AIR_CHANNEL",
          expectedContract: options.airContract || "HEARTH_AIR_PRESSURE_HUMIDITY_CHANNEL_TNT_v1",
          laws: [
            { field: "allowedToFloat", expected: true, code: "AIR_MUST_FLOAT", severity: STATUS.REJECTED },
            { field: "mayDefineLand", expected: false, code: "AIR_CANNOT_DEFINE_LAND", severity: STATUS.REJECTED },
            { field: "mayDefineWater", expected: false, code: "AIR_CANNOT_DEFINE_WATER", severity: STATUS.REJECTED }
          ],
          canFallback: true
        }
      ],
      ...options
    });
  }

  function createGoalProfile(type = "hearth-channel-expression", overrides = {}) {
    return createPlanetGoalProfile(type, overrides);
  }

  function createPlanetGoalProfile(type = "universal-planet-channel-expression", overrides = {}) {
    return mergePlain({
      id: type,
      label: overrides.label || "Universal planet channel coherent-expression goal profile",
      planetId: overrides.planetId || "",
      planetLabel: overrides.planetLabel || "",
      expectedContracts: overrides.expectedContracts || {},
      channelKeys: overrides.channelKeys || ["land", "water", "air"],
      tolerances: {
        minimumCoherenceScore: 86,
        minimumWideProbePoints: 25,
        minimumContrastDelta: 18,
        ...(overrides.tolerances || {})
      },
      laws: {
        wideProbeNeverBlocksFirstVisibleRender: true,
        singleAnchorIsLocalProofOnly: true,
        imageRenderedIsNotCoherencePass: true,
        cardinalSplitActive: true,
        northPrecedent: true,
        transmissionGovernorActive: true
      },
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    }, overrides);
  }

  function makeCheckpointReceipt(config) {
    return {
      id: config.id,
      name: config.name || config.id,
      goal: config.goal || "",
      observed: config.observed || "",
      math: config.math || "",
      tolerance: clonePlain(config.tolerance || {}),
      value: clonePlain(config.value || {}),
      status: config.status || COHERENCE_STATUS.FAIL,
      passed: config.status === COHERENCE_STATUS.PASS || config.status === COHERENCE_STATUS.HELD_PENDING_WIDE_PROBE,
      held: config.status === COHERENCE_STATUS.HELD_PENDING_WIDE_PROBE,
      nonBlocking: config.nonBlocking === true || config.status === COHERENCE_STATUS.HELD_PENDING_WIDE_PROBE,
      probableCause: asArray(config.probableCause),
      renewalTarget: asArray(config.renewalTarget),
      nextStrategy: asArray(config.nextStrategy),
      detail: clonePlain(config.detail || {}),
      at: nowIso()
    };
  }

  function runChecks(input = {}, options = {}) {
    const goalProfile = input.goalProfile || options.goalProfile || createGoalProfile(options.profile || "universal-planet-channel-expression");
    const imageRendered = safeBool(input.imageRendered, safeBool(input.renderMetadata && input.renderMetadata.imageRendered, false));
    const wideProbeCount = Array.isArray(input.probeSamples) ? input.probeSamples.length : 0;
    const minWideProbe = safeNumber(goalProfile.tolerances && goalProfile.tolerances.minimumWideProbePoints, 25);

    const checkpoints = [
      makeCheckpointReceipt({
        id: COHERENCE_CHECKS.RECEIPT_VERIFICATION_CHECK,
        name: "Receipt Verification Check",
        status: input.runtimeTableLedger || input.ledger ? COHERENCE_STATUS.PASS : COHERENCE_STATUS.WARNING,
        observed: input.runtimeTableLedger || input.ledger ? "Runtime ledger present." : "Runtime ledger missing or not supplied.",
        nonBlocking: true
      }),
      makeCheckpointReceipt({
        id: COHERENCE_CHECKS.WIDE_PROBE_READINESS_CHECK,
        name: "Wide-Probe Readiness Check",
        status: wideProbeCount >= minWideProbe ? COHERENCE_STATUS.PASS : COHERENCE_STATUS.HELD_PENDING_WIDE_PROBE,
        observed: wideProbeCount >= minWideProbe ? "Wide probe ready." : "Wide probe held; first visible render remains valid.",
        nonBlocking: true,
        value: { wideProbeCount, minWideProbe }
      }),
      makeCheckpointReceipt({
        id: COHERENCE_CHECKS.LOADING_OPTIMIZATION_CHECK,
        name: "Loading Optimization Check",
        status: COHERENCE_STATUS.PASS,
        observed: "Visible carrier first; wide probe deferred.",
        value: { visibleCarrierFirst: true, wideProbeBlocksFirstVisibleRender: false }
      }),
      makeCheckpointReceipt({
        id: COHERENCE_CHECKS.COHERENT_EXPRESSION_CHECK,
        name: "Coherent Expression Check",
        status: imageRendered ? COHERENCE_STATUS.WARNING : COHERENCE_STATUS.HELD_PENDING_WIDE_PROBE,
        observed: imageRendered ? "Image rendered; coherence proof still separate." : "Image not rendered or not supplied.",
        nonBlocking: true,
        value: { imageRendered, imageRenderedIsNotCoherencePass: true }
      })
    ];

    const failedCheckpoints = checkpoints.filter((item) => [COHERENCE_STATUS.FAIL, COHERENCE_STATUS.REJECTED, COHERENCE_STATUS.BLOCKING].includes(item.status));
    const heldCheckpoints = checkpoints.filter((item) => item.status === COHERENCE_STATUS.HELD_PENDING_WIDE_PROBE);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "lab-triple-g-coherence-diagnostic-north-transmission-facade",
      goalProfileId: goalProfile.id,
      goalProfile: clonePlain(goalProfile),
      constructionReady: true,
      imageRendered,
      coherentExpressionPass: false,
      coherenceScore: failedCheckpoints.length ? 72 : imageRendered ? 84 : 78,
      coherenceStatus: failedCheckpoints.length ? COHERENCE_STATUS.FAIL : COHERENCE_STATUS.WARNING,
      checkpoints,
      failedCheckpoints: failedCheckpoints.map((item) => item.id),
      warningCheckpoints: checkpoints.filter((item) => item.status === COHERENCE_STATUS.WARNING).map((item) => item.id),
      heldCheckpoints: heldCheckpoints.map((item) => item.id),
      renewalTargets: failedCheckpoints.map((item) => item.renewalTarget).flat(),
      nextStrategy: ["Use North transmission receipt before renewing downstream visual files."],
      singleAnchorIsLocalProofOnly: true,
      wideProbeNeverBlocksFirstVisibleRender: true,
      transmissionGovernorActive: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function createTripleGDiagnostic(options = {}) {
    const state = {
      id: options.id || `triple-g-diagnostic-${Math.random().toString(36).slice(2, 9)}`,
      profile: options.goalProfile || createGoalProfile(options.profile || "universal-planet-channel-expression", options.profileOverrides || {}),
      reports: [],
      createdAt: nowIso(),
      updatedAt: nowIso()
    };

    function run(input = {}) {
      const report = runChecks({ ...input, goalProfile: input.goalProfile || state.profile }, { ...options, goalProfile: input.goalProfile || state.profile });
      state.reports.push(report);
      if (state.reports.length > 80) state.reports.splice(0, state.reports.length - 80);
      state.updatedAt = nowIso();
      return report;
    }

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      id: state.id,
      profile: state.profile,
      run,
      getLastReport() {
        return state.reports[state.reports.length - 1] || null;
      },
      getReceipt() {
        return {
          contract: CONTRACT,
          receipt: RECEIPT,
          authority: "lab-triple-g-coherence-diagnostic-instance",
          id: state.id,
          reportCount: state.reports.length,
          tripleGDiagnostic: true,
          transmissionGovernorAvailable: true,
          visualPassClaimed: false,
          updatedAt: nowIso()
        };
      },
      get state() {
        return state;
      }
    };
  }

  function createHearthCoherenceDiagnostic(options = {}) {
    return createTripleGDiagnostic({
      ...options,
      profile: "hearth-channel-expression"
    });
  }

  function createPlanetWideProbeDiagnostic(options = {}) {
    return createTripleGDiagnostic({
      ...options,
      profile: options.profile || "universal-planet-channel-expression"
    });
  }

  function runCoherenceDiagnostic(input = {}, options = {}) {
    return (options.diagnostic || createTripleGDiagnostic(options)).run(input);
  }

  function runPlanetWideProbe(input = {}, options = {}) {
    return (options.diagnostic || createPlanetWideProbeDiagnostic(options)).run({
      ...input,
      probeSamples: Array.isArray(input.probeSamples) ? input.probeSamples : []
    });
  }

  function createLoadingOptimizationPlan(input = {}, options = {}) {
    const budget = normalizeBudget(options.budget || input.budget || {});
    const probeSamples = Array.isArray(input.probeSamples) ? input.probeSamples : [];
    const wideProbeReady = probeSamples.length >= budget.wideProbeMinPoints;

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      loadingOptimizationContract: "LAB_UNIVERSAL_PLANET_LOADING_OPTIMIZATION_PLAN_v1",
      loadingOptimizationReceipt: "LAB_UNIVERSAL_PLANET_LOADING_OPTIMIZATION_PLAN_RECEIPT_v1",
      authority: "lab-runtime-table-north-loading-optimization-authority",
      loadingCoordinate: wideProbeReady ? L_COORDINATES.L6_OPTIMIZED_STABLE : L_COORDINATES.L5_WIDE_PROBE_IDLE_CHUNKS,
      visibleCarrierFirst: true,
      wideProbeBlocksFirstVisibleRender: false,
      firstVisibleRenderAllowed: true,
      wideProbeReady,
      budget,
      recommendedChunking: {
        rowsPerChunk: budget.rowsPerChunk,
        probeRowsPerChunk: budget.probeRowsPerChunk,
        deferWideProbe: true,
        useIdleFrames: true
      },
      transmissionGovernorActive: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function createUniversalPlanetVisualCarrierPlan(input = {}, options = {}) {
    const ledger = input.runtimeTableLedger || input.ledger || null;
    const render = input.renderMetadata || input.render || {};
    const loadingOptimizationPlan = createLoadingOptimizationPlan(input, options);
    const imageRendered = safeBool(input.imageRendered, safeBool(render.imageRendered, false));

    const plan = {
      contract: CONTRACT,
      receipt: RECEIPT,
      planContract: "LAB_UNIVERSAL_PLANET_PROCEDURAL_VISUAL_CARRIER_PLAN_v1",
      planReceipt: "LAB_UNIVERSAL_PLANET_PROCEDURAL_VISUAL_CARRIER_PLAN_RECEIPT_v1",
      authority: "runtime-table-north-universal-planet-procedural-plan-authority",
      planetId: input.planetId || options.planetId || "",
      planetLabel: input.planetLabel || options.planetLabel || "",
      planGenerated: true,
      planValid: true,
      runtimeTableLedger: clonePlain(ledger),
      visualCarrierAllowed: true,
      visualizationBlocked: false,
      visualizationBlockReason: "",
      visualCarrierMode: imageRendered ? "atlas-carrier" : "fallback-shell",
      visualDiagnosticStatus: "READY",
      visualDiagnosticCue: imageRendered ? "IMAGE_RENDERED_NOT_FINAL_COHERENCE" : "VISIBLE_CARRIER_FIRST",
      constructionReady: true,
      runtimeAllowed: true,
      atlasStartAuthorized: true,
      atlasStartMode: "universal-planet-atlas",
      atlasStartCoordinate: A_COORDINATES.A1_ATLAS_START_AUTHORIZED,
      loadingCoordinate: loadingOptimizationPlan.loadingCoordinate,
      childFailureDoesNotEraseVisualization: true,
      wideProbeBlocksFirstVisibleRender: false,
      singleAnchorIsLocalProofOnly: true,
      coherentExpressionEligible: true,
      coherentExpressionPass: false,
      visualPassClaimed: false,
      loadingOptimizationPlan,
      checkpointGovernorAvailable: true,
      transmissionGovernorActive: true,
      recommendedCheckpointSessionFactory: "createHearthTransmissionSession",
      firstFailedCoordinate: imageRendered ? "IMAGE_RENDERED_COHERENCE_PROOF_STILL_SEPARATE" : A_COORDINATES.A1_ATLAS_START_AUTHORIZED,
      recommendedNextRenewalTarget: imageRendered ? "run-triple-g-diagnostic" : "canvas-plan-directed-atlas-start-consumption",
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      routeMutation: false,
      runtimeMutation: false,
      controlsMutation: false,
      updatedAt: nowIso()
    };

    const diagnostic = runChecks({
      ...input,
      runtimeTableLedger: ledger,
      loadingPlan: { loadingOptimizationPlan },
      imageRendered
    }, options);

    plan.tripleGCheckpoints = diagnostic.checkpoints;
    plan.failedCheckpoints = diagnostic.failedCheckpoints;
    plan.warningCheckpoints = diagnostic.warningCheckpoints;
    plan.heldCheckpoints = diagnostic.heldCheckpoints;
    plan.coherenceScore = diagnostic.coherenceScore;
    plan.coherenceStatus = diagnostic.coherenceStatus;

    return plan;
  }

  function createVisualCarrierPlan(input = {}, options = {}) {
    return createUniversalPlanetVisualCarrierPlan(input, options);
  }

  function createHearthVisualCarrierPlan(input = {}, options = {}) {
    return createUniversalPlanetVisualCarrierPlan({
      planetId: "hearth",
      planetLabel: "Hearth",
      ...input
    }, {
      profile: "hearth-channel-expression",
      planetId: "hearth",
      planetLabel: "Hearth",
      ...options
    });
  }

  function runProceduralPlan(input = {}, options = {}) {
    return createUniversalPlanetVisualCarrierPlan(input, options);
  }

  function bindCardinalBranches() {
    branchState.eastLoaded = Boolean(root.LAB_RUNTIME_TABLE_EAST || root.RUNTIME_TABLE_EAST || root.DEXTER_LAB_RUNTIME_TABLE_EAST);
    branchState.westLoaded = Boolean(root.LAB_RUNTIME_TABLE_WEST || root.RUNTIME_TABLE_WEST || root.DEXTER_LAB_RUNTIME_TABLE_WEST);
    branchState.southLoaded = Boolean(root.LAB_RUNTIME_TABLE_SOUTH || root.RUNTIME_TABLE_SOUTH || root.DEXTER_LAB_RUNTIME_TABLE_SOUTH);
    branchState.eastFallbackUsed = !branchState.eastLoaded;
    branchState.westFallbackUsed = !branchState.westLoaded;
    branchState.southFallbackUsed = !branchState.southLoaded;
    branchState.lastBindAt = nowIso();
    return getCardinalReceipt();
  }

  function loadCardinalBranchScripts() {
    bindCardinalBranches();
    return getCardinalReceipt();
  }

  function getCardinalReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "lab-runtime-table-cardinal-north-transmission-facade",
      northLoaded: true,
      eastLoaded: branchState.eastLoaded,
      westLoaded: branchState.westLoaded,
      southLoaded: branchState.southLoaded,
      eastFallbackUsed: branchState.eastFallbackUsed,
      westFallbackUsed: branchState.westFallbackUsed,
      southFallbackUsed: branchState.southFallbackUsed,
      hearthConsumesNorthOnly: true,
      northPrecedent: true,
      cardinalSplitActive: true,
      transmissionGovernorActive: true,
      oneActiveGearAtATime: true,
      visibleProgressMode: "ACTIVE_GEAR_0_TO_100",
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    bindCardinalBranches();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      authority: "lab-runtime-table-north-transmission-governor-facade",
      destinationFile: FILE,
      status: "active",
      role: "north-public-runtime-table-facade-with-hearth-transmission-governor",
      cardinalRole: "NORTH",

      labEquipment: true,
      runtimeTable: true,
      tripleGDiagnostic: true,
      visualCarrierPlanAuthority: true,
      atlasStartPlanAuthority: true,
      coherentExpressionDiagnostic: true,
      loadingOptimizationAuthority: true,
      wideProbeDiagnosticAuthority: true,
      universalPlanetStandard: true,
      hearthIsFirstConsumerNotOwner: true,

      northPrecedent: true,
      cardinalSplitActive: true,
      northLoaded: true,
      eastLoaded: branchState.eastLoaded,
      westLoaded: branchState.westLoaded,
      southLoaded: branchState.southLoaded,
      eastFallbackUsed: branchState.eastFallbackUsed,
      westFallbackUsed: branchState.westFallbackUsed,
      southFallbackUsed: branchState.southFallbackUsed,
      hearthConsumesNorthOnly: true,

      northFacadeCompatibilityActive: true,
      hearthNorthAliasesActive: true,
      westIntakeMethodsActive: true,
      indexHandoffAcceptedRecognized: true,
      s2IndexHandoffAcceptedRecognized: true,

      transmissionGovernorActive: true,
      fibonacciCombustionScaleActive: true,
      oneActiveGearAtATime: true,
      activeGear: transmissionState.activeGear,
      activeGearLabel: transmissionState.activeGearLabel,
      activeGearProgress: transmissionState.activeGearProgress,
      activeCycleId: transmissionState.activeCycleId,
      completedCycleCount: transmissionState.completedCycleCount,
      lastClosedCheckpoint: transmissionState.lastClosedCheckpoint,
      nextGear: transmissionState.nextGear,
      shiftAuthorized: transmissionState.shiftAuthorized,
      visibleProgressMode: "ACTIVE_GEAR_0_TO_100",
      cumulativeProgressControlsVisibleLoader: false,
      legacyFibonacciProgressPreservedForCompatibility: true,

      checkpointGovernorActive: true,
      chronologicalCheckpointSessionSupported: true,
      chronologicalFibonacciAlignment: true,
      newsFibonacciAlignment: true,
      completedEventsArchived: true,
      progressOnlyEventsArchived: true,
      regressiveEventsBlocked: true,
      degradedForwardAvailable: true,
      hardBlockReservedForStructuralOrFalseCompletion: true,
      readyTextRequiresCompletionLatch: true,

      firstFailedCoordinate: transmissionState.firstFailedCoordinate,
      recommendedNextOwner: transmissionState.recommendedNextOwner,
      recommendedNextFile: transmissionState.recommendedNextFile,
      recommendedNextRenewalTarget: transmissionState.recommendedNextRenewalTarget,
      postgameStatus: transmissionState.postgameStatus,

      preservedExports: [
        "createTable",
        "createHearthChannelTable",
        "RuntimeTable",
        "STATUS",
        "HANDOFF",
        "getReceipt",
        "createTripleGDiagnostic",
        "createHearthCoherenceDiagnostic",
        "runCoherenceDiagnostic",
        "createGoalProfile",
        "createVisualCarrierPlan",
        "createHearthVisualCarrierPlan",
        "runProceduralPlan",
        "R_COORDINATES",
        "V_COORDINATES",
        "A_COORDINATES",
        "C_COORDINATES",
        "L_COORDINATES",
        "createPlanetChannelTable",
        "createPlanetGoalProfile",
        "createPlanetWideProbeDiagnostic",
        "runPlanetWideProbe",
        "createLoadingOptimizationPlan",
        "createUniversalPlanetVisualCarrierPlan",
        "createCheckpointSession",
        "createHearthCheckpointSession",
        "createChronologicalFibonacciPlan",
        "createNewsFibonacciCheckpointPlan",
        "classifyCheckpointEvent",
        "CHECKPOINT_EVENT_ACTIONS",
        "CHECKPOINT_STATUS",
        "FIBONACCI_CHECKPOINTS",
        "NEWS_GATES",
        "bindCardinalBranches",
        "loadCardinalBranchScripts",
        "getCardinalReceipt",
        "GAP_CLASS",
        "createHearthTransmissionSession",
        "getHearthTransmissionSession",
        "getTransmissionReceipt",
        "getTransmissionReceiptText",
        "acceptWestHandoff",
        "receiveWestHandoff",
        "acceptWestIntake",
        "receiveWestIntake",
        "acceptCheckpointEvent",
        "receiveCheckpointEvent",
        "submitEvent",
        "receiveEvent"
      ],

      owns: [
        "timing-governance",
        "sequence-governance",
        "checkpoint-law",
        "active-gear-state",
        "gear-shift-authorization",
        "west-intake-acceptance",
        "south-proof-closure",
        "return-to-east-authorization",
        "fibonacci-combustion-synchronization",
        "public-runtime-table-facade-compatibility"
      ],

      doesNotOwn: [
        "east-first-paint",
        "west-handoff-validation",
        "south-canvas-proof",
        "canvas-drawing",
        "source-stack-truth",
        "child-channel-truth",
        "touch-drag-controls",
        "route-orchestration",
        "final-visual-pass-claim"
      ],

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      transmissionReceipt: getTransmissionReceipt(),
      updatedAt: nowIso()
    };
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,

    STATUS,
    HANDOFF,
    COHERENCE_STATUS,
    COHERENCE_CHECKS,
    R_COORDINATES,
    V_COORDINATES,
    A_COORDINATES,
    C_COORDINATES,
    L_COORDINATES,
    CHECKPOINT_EVENT_ACTIONS,
    CHECKPOINT_STATUS,
    GAP_CLASS,
    FIBONACCI_CHECKPOINTS,
    NEWS_GATES,
    TRANSMISSION_GEARS,
    TRANSMISSION_ORDER,

    createTable,
    createHearthChannelTable,
    createPlanetChannelTable,
    RuntimeTable,

    createGoalProfile,
    createPlanetGoalProfile,
    createTripleGDiagnostic,
    createHearthCoherenceDiagnostic,
    createPlanetWideProbeDiagnostic,
    runCoherenceDiagnostic,
    runPlanetWideProbe,

    createVisualCarrierPlan,
    createHearthVisualCarrierPlan,
    createUniversalPlanetVisualCarrierPlan,
    createLoadingOptimizationPlan,
    runProceduralPlan,

    createCheckpointSession,
    createHearthCheckpointSession,
    createChronologicalFibonacciPlan,
    createNewsFibonacciCheckpointPlan,
    classifyCheckpointEvent,
    evaluateNewsGateState,

    createHearthTransmissionSession,
    getHearthTransmissionSession,
    getTransmissionReceipt,
    getTransmissionReceiptText,
    getNorthCommandReceipt,
    getActiveGearState,
    closeActiveGear,
    authorizeNextGear,
    setActiveGear,
    updateActiveGearProgress,

    acceptWestHandoff,
    receiveWestHandoff,
    acceptWestIntake,
    receiveWestIntake,
    acceptCheckpointEvent,
    receiveCheckpointEvent,
    submitEvent,
    receiveEvent,

    bindCardinalBranches,
    loadCardinalBranchScripts,
    getCardinalReceipt,
    getReceipt,

    labEquipment: true,
    runtimeTable: true,
    tripleGDiagnostic: true,
    coherentExpressionDiagnostic: true,
    visualCarrierPlanAuthority: true,
    atlasStartPlanAuthority: true,
    loadingOptimizationAuthority: true,
    wideProbeDiagnosticAuthority: true,
    universalPlanetStandard: true,
    hearthIsFirstConsumerNotOwner: true,

    northPrecedent: true,
    cardinalSplitActive: true,
    cardinalRole: "NORTH",
    northLoaded: true,

    northFacadeCompatibilityActive: true,
    hearthNorthAliasesActive: true,
    westIntakeMethodsActive: true,
    transmissionGovernorActive: true,
    fibonacciCombustionScaleActive: true,
    oneActiveGearAtATime: true,
    visibleProgressMode: "ACTIVE_GEAR_0_TO_100",
    cumulativeProgressControlsVisibleLoader: false,
    legacyFibonacciProgressPreservedForCompatibility: true,

    validatesBeforeExpression: true,
    coordinatesBeforeRuntimePerforms: true,
    verifiesCoherenceAfterRender: true,
    generatesProceduralPlan: true,
    imageRenderedIsNotCoherencePass: true,
    constructionReadyIsNotCoherencePass: true,
    coherentExpressionPassIsNotVisualPassClaim: true,
    singleAnchorIsLocalProofOnly: true,
    wideProbeRequiredForGlobalDistribution: true,
    wideProbeNeverBlocksFirstVisibleRender: true,
    childFailureDoesNotEraseVisualization: true,
    visualizationBlocksOnlyWhenCarrierUnsafe: true,
    doesNotOwnTruth: true,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get eastLoaded() {
      bindCardinalBranches();
      return branchState.eastLoaded;
    },
    get westLoaded() {
      bindCardinalBranches();
      return branchState.westLoaded;
    },
    get southLoaded() {
      bindCardinalBranches();
      return branchState.southLoaded;
    },
    get activeGear() {
      return transmissionState.activeGear;
    },
    get activeGearProgress() {
      return transmissionState.activeGearProgress;
    },
    get transmissionState() {
      return transmissionState;
    }
  };

  function publishDatasets() {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    dataset.labRuntimeTableLoaded = "true";
    dataset.labRuntimeTableContract = CONTRACT;
    dataset.labRuntimeTablePreviousContract = PREVIOUS_CONTRACT;
    dataset.labRuntimeTableBaselineContract = BASELINE_CONTRACT;
    dataset.labRuntimeTableReceipt = RECEIPT;
    dataset.labRuntimeTableEquipment = "true";

    dataset.labRuntimeTableNorthLoaded = "true";
    dataset.labRuntimeTableNorthContract = CONTRACT;
    dataset.labRuntimeTableNorthTransmissionGovernor = "true";
    dataset.northPrecedent = "true";
    dataset.cardinalSplitActive = "true";
    dataset.hearthConsumesNorthOnly = "true";

    dataset.hearthNorthCommandRuntimeTableLoaded = "true";
    dataset.hearthNorthCommandRuntimeTableContract = CONTRACT;
    dataset.hearthNorthAliasesActive = "true";
    dataset.northFacadeCompatibilityActive = "true";
    dataset.westIntakeMethodsActive = "true";
    dataset.indexHandoffAcceptedRecognized = "true";
    dataset.s2IndexHandoffAcceptedRecognized = "true";

    dataset.transmissionGovernorActive = "true";
    dataset.fibonacciCombustionScaleActive = "true";
    dataset.oneActiveGearAtATime = "true";
    dataset.activeGear = transmissionState.activeGear;
    dataset.activeGearProgress = String(transmissionState.activeGearProgress);
    dataset.activeCycleId = transmissionState.activeCycleId;
    dataset.completedCycleCount = String(transmissionState.completedCycleCount);
    dataset.lastClosedCheckpoint = transmissionState.lastClosedCheckpoint;
    dataset.nextGear = transmissionState.nextGear;
    dataset.shiftAuthorized = String(transmissionState.shiftAuthorized);
    dataset.visibleProgressMode = "ACTIVE_GEAR_0_TO_100";
    dataset.cumulativeProgressControlsVisibleLoader = "false";
    dataset.legacyFibonacciProgressPreservedForCompatibility = "true";

    dataset.tripleGDiagnosticReusable = "true";
    dataset.runtimeTableDoesNotOwnTruth = "true";
    dataset.runtimeTableOwnsProceduralPlan = "true";
    dataset.visualCarrierPlanAuthority = "true";
    dataset.atlasStartPlanAuthority = "true";
    dataset.loadingOptimizationAuthority = "true";
    dataset.wideProbeDiagnosticAuthority = "true";
    dataset.checkpointGovernorActive = "true";
    dataset.singleAnchorIsLocalProofOnly = "true";
    dataset.wideProbeRequiredForGlobalDistribution = "true";
    dataset.wideProbeNeverBlocksFirstVisibleRender = "true";
    dataset.visibleCarrierFirst = "true";
    dataset.childFailureDoesNotEraseVisualization = "true";
    dataset.visualizationBlocksOnlyWhenCarrierUnsafe = "true";
    dataset.imageRenderedIsNotCoherencePass = "true";
    dataset.constructionReadyIsNotCoherencePass = "true";
    dataset.coherentExpressionPassIsNotVisualPassClaim = "true";

    dataset.firstFailedCoordinate = transmissionState.firstFailedCoordinate;
    dataset.recommendedNextOwner = transmissionState.recommendedNextOwner;
    dataset.recommendedNextFile = transmissionState.recommendedNextFile;
    dataset.recommendedNextRenewalTarget = transmissionState.recommendedNextRenewalTarget;

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
  }

  function publishAll() {
    root.DEXTER_LAB = root.DEXTER_LAB || {};
    root.HEARTH = root.HEARTH || {};

    root.DEXTER_LAB.runtimeTable = api;
    root.DEXTER_LAB.tripleGDiagnostic = api;
    root.DEXTER_LAB.visualCarrierPlanAuthority = api;
    root.DEXTER_LAB.loadingOptimizationAuthority = api;
    root.DEXTER_LAB.wideProbeDiagnosticAuthority = api;
    root.DEXTER_LAB.checkpointGovernor = api;
    root.DEXTER_LAB.cardinalRuntimeTableNorth = api;
    root.DEXTER_LAB.northTransmissionGovernor = api;

    root.LAB_RUNTIME_TABLE = api;
    root.DexterRuntimeTable = api;
    root.RUNTIME_TABLE = api;
    root.LAB_TRIPLE_G_DIAGNOSTIC = api;
    root.TripleGDiagnostic = api;
    root.LAB_VISUAL_CARRIER_PLAN_AUTHORITY = api;
    root.LAB_LOADING_OPTIMIZATION_AUTHORITY = api;
    root.LAB_WIDE_PROBE_DIAGNOSTIC = api;
    root.LAB_UNIVERSAL_PLANET_RUNTIME_TABLE = api;
    root.LAB_CHECKPOINT_GOVERNOR = api;
    root.LAB_NEWS_FIBONACCI_CHECKPOINT_GOVERNOR = api;
    root.LAB_RUNTIME_TABLE_NORTH = api;
    root.LAB_CARDINAL_RUNTIME_TABLE_NORTH = api;

    root.HEARTH_NORTH_COMMAND_RUNTIME_TABLE = api;
    root.HEARTH_NORTH_COMMAND_TABLE = api;
    root.HEARTH_NORTH_COMMAND = api;
    root.HEARTH_LOCAL_COMMAND_RUNTIME_TABLE = api;
    root.HEARTH.northCommandRuntimeTable = api;
    root.HEARTH.northTransmissionGovernor = api;

    root.HEARTH_NORTH_TRANSMISSION_SESSION = transmissionSession;
    root.HEARTH_NORTH_TRANSMISSION_GOVERNOR = api;
    root.HEARTH_NORTH_COMMAND_RUNTIME_TABLE_RECEIPT = getTransmissionReceipt();
    root.HEARTH_NORTH_CYCLICAL_CHECKPOINT_RECEIPT = root.HEARTH_NORTH_COMMAND_RUNTIME_TABLE_RECEIPT;
    root.LAB_RUNTIME_TABLE_NORTH_TRANSMISSION_RECEIPT = root.HEARTH_NORTH_COMMAND_RUNTIME_TABLE_RECEIPT;

    publishDatasets();
  }

  transmissionState.createdAt = nowIso();
  transmissionState.updatedAt = transmissionState.createdAt;

  bindCardinalBranches();
  publishAll();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

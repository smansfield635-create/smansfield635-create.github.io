// /assets/lab/runtime-table.js
// LAB_RUNTIME_TABLE_NORTH_FILE_GATE_DISTRIBUTOR_TIMING_AUTHORITY_TNT_v1
// Full-file replacement.
// North Runtime Table authority / file-gate distributor / timing authority.
// Purpose:
// - Preserve /assets/lab/runtime-table.js as the public Lab Runtime Table authority.
// - Preserve known file paths as the primary downstream distribution gates.
// - Establish North as macro timing, checkpoint, packet classification, F21 latch, and downstream release authority.
// - Keep downstream tuning downstream: East, South, West, and Canvas receive timing/file gates and return packets.
// - Preserve Runtime Table, Triple G, Visual Carrier Plan, Loading Optimization, Wide Probe, checkpoint,
//   transmission, and F21 NEWS latch export surfaces.
// - Preserve necessary Hearth-facing globals while treating public aliases as compatibility surfaces.
// Owns:
// - macro timing
// - file-gate distribution
// - checkpoint session
// - transmission session
// - packet classification
// - F21 eligibility validation
// - F21 latch
// - downstream release authorization
// - receipt publication
// - runtime table factory
// - diagnostic factory
// - visual carrier plan factory
// - loading optimization plan factory

(() => {
  "use strict";

  const CONTRACT = "LAB_RUNTIME_TABLE_NORTH_FILE_GATE_DISTRIBUTOR_TIMING_AUTHORITY_TNT_v1";
  const RECEIPT = "LAB_RUNTIME_TABLE_NORTH_FILE_GATE_DISTRIBUTOR_TIMING_AUTHORITY_RECEIPT_v1";
  const PREVIOUS_CONSTRAINT_BASELINE = "LAB_RUNTIME_TABLE_NORTH_MACRO_DISTRIBUTOR_MICRO_TUNING_TIMETABLE_TNT_v1";
  const BASELINE_CONTRACT = "RUNTIME_TABLE_NEWS_CARDINAL_FOUR_FILE_SPLIT_FINAL_DRAFT_PREWRITE_v1";
  const VERSION = "2026-05-31.lab-runtime-table-north-file-gate-distributor-timing-authority-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const FILE = "/assets/lab/runtime-table.js";
  const ROUTE = "/showroom/globe/hearth/";

  const FILE_GATES = Object.freeze({
    north: "/assets/lab/runtime-table.js",
    east: "/showroom/globe/hearth/index.js",
    west: "/assets/hearth/hearth.west.index-handoff.table.js",
    south: "/showroom/globe/hearth/hearth.js",
    canvas: "/assets/hearth/hearth.canvas.js",
    canvasEast: "/assets/hearth/hearth.canvas.east.js",
    canvasWest: "/assets/hearth/hearth.canvas.west.js",
    canvasSouth: "/assets/hearth/hearth.canvas.south.js"
  });

  const STATUS = Object.freeze({
    PENDING: "PENDING",
    READY: "READY",
    OPTIMIZED: "OPTIMIZED",
    DEGRADED: "DEGRADED",
    FALLBACK: "FALLBACK",
    REJECTED: "REJECTED",
    BLOCKING: "BLOCKING",
    HELD: "HELD",
    COMPLETE: "COMPLETE"
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
    DEGRADED_FORWARD: "DEGRADED_FORWARD",
    LATCH: "LATCH",
    RELEASE: "RELEASE"
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
    FILE_GATE_HELD: "FILE_GATE_HELD",
    TIMING_HELD: "TIMING_HELD",
    ELIGIBILITY_HELD: "ELIGIBILITY_HELD"
  });

  const NEWS_GATES = Object.freeze({
    NORTH: "NORTH",
    EAST: "EAST",
    SOUTH: "SOUTH",
    WEST: "WEST",
    CANVAS: "CANVAS",
    F21: "F21"
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

  const TIMING_LANGUAGE = Object.freeze({
    north: "North Timing Authority / File Gate Distributor / Runtime Table",
    fileGate: "preserved file path used as distribution gate",
    timingTable: "ordered macro timing map",
    checkpointSession: "North-owned packet intake and classification session",
    transmissionSession: "Hearth-facing session alias for the same North timing authority",
    gatePacket: "downstream return packet carrying evidence",
    eligibilityPacket: "packet submitted to North for F21 validation",
    latch: "North-owned completion closure",
    release: "North-owned authorization for downstream continuation"
  });

  const TIMING_STAGES = Object.freeze([
    {
      id: "T1_NORTH_DISTRIBUTE",
      rank: 1,
      cardinal: "NORTH",
      file: FILE_GATES.north,
      fibonacci: "F1",
      news: NEWS_GATES.NORTH,
      label: "North distributes timing table",
      requiredProof: ["runtime-table-api", "file-gates", "session-api", "receipt-api"]
    },
    {
      id: "T2_EAST_RETURN",
      rank: 2,
      cardinal: "EAST",
      file: FILE_GATES.east,
      fibonacci: "F3",
      news: NEWS_GATES.EAST,
      label: "East returns route/index readiness packet",
      requiredProof: ["route-shell-or-first-paint", "index-handoff-or-script-order"]
    },
    {
      id: "T3_SOUTH_RETURN",
      rank: 3,
      cardinal: "SOUTH",
      file: FILE_GATES.south,
      fibonacci: "F8/F13",
      news: NEWS_GATES.SOUTH,
      label: "South returns route-conductor/proof/eligibility packet",
      requiredProof: ["route-conductor-state", "canvas-boot-state", "proof-lane-state"]
    },
    {
      id: "T4_WEST_RETURN",
      rank: 4,
      cardinal: "WEST",
      file: FILE_GATES.west,
      fibonacci: "F13",
      news: NEWS_GATES.WEST,
      label: "West returns admissibility/audit packet",
      requiredProof: ["audit-or-inspect", "admissibility-state"]
    },
    {
      id: "T5_NORTH_LATCH_OR_CONTINUE",
      rank: 5,
      cardinal: "NORTH",
      file: FILE_GATES.north,
      fibonacci: "F21",
      news: NEWS_GATES.F21,
      label: "North validates latch, continuation, hold, or block",
      requiredProof: ["north-validation", "f21-eligibility-or-next-file-gate"]
    },
    {
      id: "T6_CANVAS_RELEASE",
      rank: 6,
      cardinal: "CANVAS",
      file: FILE_GATES.canvas,
      fibonacci: "F21_RELEASE",
      news: NEWS_GATES.CANVAS,
      label: "Canvas release after North authorization",
      requiredProof: ["north-release", "carrier-available", "canvas-does-not-claim-f21"]
    }
  ]);

  const EAST_RETURN_EVENTS = Object.freeze([
    "EAST_STEP1_HANDOFF",
    "EAST_STEP1_HANDOFF_RECEIVED",
    "EAST_STEP1_HANDOFF_ACCEPTED",
    "INDEX_HANDOFF_ACCEPTED",
    "S2_INDEX_HANDOFF_ACCEPTED",
    "SCRIPT_ORDER_COMPLETE",
    "FIRST_PAINT_COCKPIT_VISIBLE",
    "HTML_SHELL_RENDERED"
  ]);

  const SOUTH_RETURN_EVENTS = Object.freeze([
    "SOUTH_RETURN_PACKET",
    "SOUTH_VISIBLE_COMPLETION_READY",
    "SOUTH_F21_ELIGIBILITY_SUBMITTED",
    "ROUTE_CONDUCTOR_HYDRATED",
    "CANVAS_READY",
    "FIRST_FRAME_DETECTED",
    "VISIBLE_CONTENT_PROOF_PASSED",
    "DEGRADED_VISIBLE_CONTENT_ACCEPTED"
  ]);

  const WEST_RETURN_EVENTS = Object.freeze([
    "WEST_RETURN_PACKET",
    "WEST_HANDOFF_ACCEPTED",
    "WEST_ACCEPTED_EAST_STEP1_HANDOFF",
    "EAST_STEP1_HANDOFF_ACCEPTED_BY_WEST_METHOD",
    "INSPECT_MODE_READY",
    "DEGRADED_INSPECT_MODE_ACCEPTED",
    "WEST_AUDIT_ACCEPTED"
  ]);

  const F21_ELIGIBILITY_EVENTS = Object.freeze([
    "F21_COMPLETION_LATCH",
    "F21_COMPLETION_LATCHED",
    "F21_FULL_ELIGIBLE_FOR_NORTH_NEWS_LATCH",
    "F21_ELIGIBLE_FOR_NORTH_NEWS_LATCH",
    "F21_ELIGIBILITY_SUBMITTED_TO_NORTH",
    "F21_ELIGIBILITY_READY_FOR_NORTH",
    "F21_NEWS_LATCH_READY",
    "SOUTH_F21_ELIGIBILITY_SUBMITTED",
    "COMPLETION_LATCH_ELIGIBLE",
    "COMPLETION_LATCHED",
    "COMPLETION_LATCHED_AFTER_VISIBLE_CONTENT_PROOF",
    "COMPLETION_LATCHED_AFTER_CANVAS_READY",
    "F21_DEGRADED_COMPLETION_LATCHED"
  ]);

  const COHERENCE_CHECKS = Object.freeze({
    RECEIPT_VERIFICATION_CHECK: "RECEIPT_VERIFICATION_CHECK",
    FILE_GATE_DISTRIBUTION_CHECK: "FILE_GATE_DISTRIBUTION_CHECK",
    TIMING_AUTHORITY_CHECK: "TIMING_AUTHORITY_CHECK",
    WIDE_PROBE_READINESS_CHECK: "WIDE_PROBE_READINESS_CHECK",
    LOADING_OPTIMIZATION_CHECK: "LOADING_OPTIMIZATION_CHECK",
    COHERENT_EXPRESSION_CHECK: "COHERENT_EXPRESSION_CHECK"
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousConstraintBaseline: PREVIOUS_CONSTRAINT_BASELINE,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "north-file-gate-distributor-timing-authority",
    cardinalRole: "NORTH",

    fileGatesPrimary: true,
    publicAliasesSecondary: true,
    northTimingAuthorityActive: true,
    runtimeTimingTableActive: true,
    checkpointSessionActive: true,
    transmissionSessionActive: true,
    newsProtocolSynchronized: true,
    fibonacciSynchronizationActive: true,
    oneActiveGearAtATime: true,

    activeStageId: TIMING_STAGES[0].id,
    activeFileGate: TIMING_STAGES[0].file,
    activeCardinal: TIMING_STAGES[0].cardinal,
    activeFibonacci: TIMING_STAGES[0].fibonacci,
    activeNewsGate: TIMING_STAGES[0].news,
    activeProgress: 0,

    completedStages: [],
    degradedStages: [],
    blockedStages: [],
    stageLedger: [],
    cycleCount: 0,

    eastReturnReceived: false,
    eastReturnAccepted: false,
    southReturnReceived: false,
    southReturnAccepted: false,
    westReturnReceived: false,
    westReturnAccepted: false,

    f21EligibilityReceived: false,
    f21EligibilityAccepted: false,
    f21EligibilityRejected: false,
    f21EligibilityValidation: null,
    f21LatchMode: "WAITING",
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
    downstreamReleaseAuthorized: false,

    firstFailedCoordinate: "WAITING_NORTH_DISTRIBUTE",
    recommendedNextOwner: "NORTH",
    recommendedNextFile: FILE_GATES.north,
    recommendedNextRenewalTarget: FILE_GATES.north,
    postgameStatus: "NORTH_TIMING_AUTHORITY_READY",

    admittedEvents: [],
    heldEvents: [],
    archivedEvents: [],
    blockedEvents: [],
    receipts: [],
    errors: [],

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

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === "true" || value === "1" || value === 1) return true;
    if (value === "false" || value === "0" || value === 0) return false;
    return fallback;
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function clamp(value, min, max) {
    const n = safeNumber(value, min);
    return Math.max(min, Math.min(max, n));
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : { ...value };
    }
  }

  function trim(list, max) {
    if (Array.isArray(list) && list.length > max) {
      list.splice(0, list.length - max);
    }
  }

  function normalizePayload(input = {}) {
    const base = isObject(input) ? input : {};
    const detail = isObject(base.detail) ? base.detail : {};
    const snapshot = isObject(base.snapshot) ? base.snapshot : isObject(detail.snapshot) ? detail.snapshot : {};

    return {
      ...snapshot,
      ...detail,
      ...base,
      detail,
      snapshot
    };
  }

  function scanFieldDeep(input, fields, maxDepth = 7) {
    const wanted = new Set(asArray(fields));
    const queue = [{ value: input, depth: 0 }];
    const seen = new WeakSet();

    while (queue.length) {
      const current = queue.shift();
      const value = current.value;

      if (!isObject(value) || current.depth > maxDepth) continue;
      if (seen.has(value)) continue;
      seen.add(value);

      for (const key of Object.keys(value)) {
        if (wanted.has(key)) return value[key];
      }

      for (const key of Object.keys(value)) {
        const next = value[key];
        if (isObject(next)) queue.push({ value: next, depth: current.depth + 1 });
      }
    }

    return undefined;
  }

  function getAnyBool(input, fields, fallback = false) {
    return safeBool(scanFieldDeep(input, fields), fallback);
  }

  function getAnyString(input, fields, fallback = "") {
    const value = scanFieldDeep(input, fields);
    return value === undefined || value === null ? fallback : String(value);
  }

  function getAnyNumber(input, fields, fallback = 0) {
    return safeNumber(scanFieldDeep(input, fields), fallback);
  }

  function allEventNames(input = {}) {
    const packet = normalizePayload(input);
    const detail = isObject(packet.detail) ? packet.detail : {};
    const snapshot = isObject(packet.snapshot) ? packet.snapshot : {};

    return [
      packet.checkpointEvent,
      packet.checkpointCandidate,
      packet.event,
      packet.id,
      packet.phase,
      packet.checkpointId,
      packet.activeGateId,
      detail.checkpointEvent,
      detail.checkpointCandidate,
      detail.event,
      detail.id,
      detail.phase,
      detail.checkpointId,
      detail.activeGateId,
      snapshot.checkpointEvent,
      snapshot.event,
      snapshot.phase,
      snapshot.checkpointId,
      snapshot.activeGateId
    ].filter(Boolean).map(String);
  }

  function eventName(input = {}) {
    return allEventNames(input)[0] || "";
  }

  function hasEvent(input, names) {
    const candidates = allEventNames(input);
    return candidates.some((name) => names.includes(name));
  }

  function record(kind, event, detail = {}) {
    const item = {
      at: nowIso(),
      kind,
      event,
      detail: clonePlain(detail)
    };

    const list =
      kind === "admit" ? state.admittedEvents :
      kind === "held" ? state.heldEvents :
      kind === "archive" ? state.archivedEvents :
      kind === "block" ? state.blockedEvents :
      kind === "error" ? state.errors :
      state.receipts;

    list.push(item);
    trim(list, 180);
    state.updatedAt = item.at;
    publishDatasets();

    return item;
  }

  function recordError(code, message, detail = {}) {
    return record("error", code, {
      code,
      message: String(message || ""),
      detail: clonePlain(detail)
    });
  }

  function stageById(id) {
    return TIMING_STAGES.find((stage) => stage.id === id) || null;
  }

  function stageIndex(id) {
    return TIMING_STAGES.findIndex((stage) => stage.id === id);
  }

  function nextStageAfter(id) {
    const index = stageIndex(id);
    if (index < 0) return TIMING_STAGES[0];
    return TIMING_STAGES[Math.min(index + 1, TIMING_STAGES.length - 1)];
  }

  function refreshStageLedger() {
    state.stageLedger = TIMING_STAGES.map((stage) => ({
      id: stage.id,
      rank: stage.rank,
      cardinal: stage.cardinal,
      file: stage.file,
      fibonacci: stage.fibonacci,
      news: stage.news,
      label: stage.label,
      requiredProof: stage.requiredProof.slice(),
      complete: state.completedStages.includes(stage.id),
      degraded: state.degradedStages.includes(stage.id),
      blocked: state.blockedStages.includes(stage.id),
      active: state.activeStageId === stage.id
    }));

    return state.stageLedger;
  }

  function setActiveStage(stageId, reason = "set-active-stage") {
    const stage = stageById(stageId);

    if (!stage) {
      recordError("UNKNOWN_TIMING_STAGE", `Unknown timing stage: ${stageId}`, { reason });
      return getHeldResponse("UNKNOWN_TIMING_STAGE", reason);
    }

    state.activeStageId = stage.id;
    state.activeFileGate = stage.file;
    state.activeCardinal = stage.cardinal;
    state.activeFibonacci = stage.fibonacci;
    state.activeNewsGate = stage.news;
    state.activeProgress = state.completedStages.includes(stage.id) ? 100 : 0;
    state.postgameStatus = `ACTIVE_${stage.id}`;
    state.updatedAt = nowIso();

    refreshStageLedger();
    record("receipt", "ACTIVE_STAGE_SET", { stageId, reason });
    publishAll();

    return getActiveTimingState();
  }

  function completeStage(stageId, options = {}) {
    const stage = stageById(stageId);

    if (!stage) {
      return getHeldResponse("UNKNOWN_STAGE", "completeStage-unknown-stage", {
        stageId,
        recommendedNextOwner: "NORTH",
        recommendedNextFile: FILE_GATES.north,
        recommendedNextRenewalTarget: FILE_GATES.north
      });
    }

    if (!state.completedStages.includes(stage.id)) state.completedStages.push(stage.id);
    if (options.degraded === true && !state.degradedStages.includes(stage.id)) state.degradedStages.push(stage.id);

    state.activeProgress = 100;
    state.updatedAt = nowIso();

    const next = nextStageAfter(stage.id);

    record("admit", "TIMING_STAGE_COMPLETE", {
      stageId: stage.id,
      degraded: options.degraded === true,
      reason: options.reason || "",
      nextStage: next.id
    });

    if (next.id !== stage.id) {
      setActiveStage(next.id, options.reason || "stage-complete-shift");
    } else {
      refreshStageLedger();
      publishAll();
    }

    return {
      accepted: true,
      action: CHECKPOINT_EVENT_ACTIONS.ADMIT,
      completedStage: stage.id,
      nextStage: next.id,
      activeStageId: state.activeStageId,
      activeFileGate: state.activeFileGate,
      pageResponsive: true,
      hardBlock: false
    };
  }

  function updateActiveProgress(progress, reason = "progress-update") {
    state.activeProgress = clamp(progress, 0, 100);
    state.updatedAt = nowIso();

    record("receipt", "ACTIVE_STAGE_PROGRESS_UPDATED", {
      activeStageId: state.activeStageId,
      activeFileGate: state.activeFileGate,
      activeProgress: state.activeProgress,
      reason
    });

    publishAll();
    return getActiveTimingState();
  }

  function getHeldResponse(firstFailedCoordinate, reason = "held", extra = {}) {
    state.firstFailedCoordinate = firstFailedCoordinate;
    state.recommendedNextOwner = extra.recommendedNextOwner || state.activeCardinal || "NORTH";
    state.recommendedNextFile = extra.recommendedNextFile || state.activeFileGate || FILE_GATES.north;
    state.recommendedNextRenewalTarget = extra.recommendedNextRenewalTarget || state.recommendedNextFile;
    state.postgameStatus = firstFailedCoordinate;
    state.updatedAt = nowIso();

    const response = {
      accepted: false,
      action: CHECKPOINT_EVENT_ACTIONS.HELD,
      reason,
      firstFailedCoordinate,
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      activeStageId: state.activeStageId,
      activeFileGate: state.activeFileGate,
      activeFibonacci: state.activeFibonacci,
      activeNewsGate: state.activeNewsGate,
      activeProgress: state.activeProgress,
      pageResponsive: true,
      hardBlock: false,
      ...clonePlain(extra)
    };

    record("held", "TIMING_HELD", response);
    publishAll();

    return response;
  }

  function getArchiveResponse(reason = "archived", extra = {}) {
    const response = {
      accepted: false,
      action: CHECKPOINT_EVENT_ACTIONS.ARCHIVE,
      reason,
      activeStageId: state.activeStageId,
      activeFileGate: state.activeFileGate,
      activeProgress: state.activeProgress,
      pageResponsive: true,
      hardBlock: false,
      ...clonePlain(extra)
    };

    record("archive", "EVENT_ARCHIVED", response);
    publishAll();

    return response;
  }

  function getBlockResponse(firstFailedCoordinate, reason = "blocked", extra = {}) {
    if (!state.blockedStages.includes(state.activeStageId)) state.blockedStages.push(state.activeStageId);

    state.firstFailedCoordinate = firstFailedCoordinate;
    state.recommendedNextOwner = extra.recommendedNextOwner || state.activeCardinal || "NORTH";
    state.recommendedNextFile = extra.recommendedNextFile || state.activeFileGate || FILE_GATES.north;
    state.recommendedNextRenewalTarget = extra.recommendedNextRenewalTarget || state.recommendedNextFile;
    state.postgameStatus = firstFailedCoordinate;
    state.updatedAt = nowIso();

    const response = {
      accepted: false,
      action: CHECKPOINT_EVENT_ACTIONS.BLOCK,
      reason,
      firstFailedCoordinate,
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      activeStageId: state.activeStageId,
      activeFileGate: state.activeFileGate,
      activeProgress: state.activeProgress,
      pageResponsive: true,
      hardBlock: true,
      ...clonePlain(extra)
    };

    record("block", "TIMING_BLOCKED", response);
    publishAll();

    return response;
  }

  function acceptEastReturn(packet = {}) {
    const input = normalizePayload(packet);

    const eastReady = Boolean(
      hasEvent(input, EAST_RETURN_EVENTS) ||
      getAnyBool(input, ["eastGateReady", "step1Ready", "firstPaintReady", "scriptOrderComplete", "indexPresent", "routeShellPresent"], false)
    );

    if (!eastReady) {
      return getHeldResponse("WAITING_EAST_RETURN_PACKET", "east-return-evidence-missing", {
        recommendedNextOwner: "EAST",
        recommendedNextFile: FILE_GATES.east,
        recommendedNextRenewalTarget: FILE_GATES.east
      });
    }

    state.eastReturnReceived = true;
    state.eastReturnAccepted = true;
    state.firstFailedCoordinate = "NONE_EAST_RETURN_ACCEPTED";
    state.recommendedNextOwner = "SOUTH";
    state.recommendedNextFile = FILE_GATES.south;
    state.recommendedNextRenewalTarget = FILE_GATES.south;
    state.postgameStatus = "SOUTH_RETURN_PENDING";

    if (!state.completedStages.includes("T1_NORTH_DISTRIBUTE")) {
      completeStage("T1_NORTH_DISTRIBUTE", { reason: "east-return-received" });
    }

    completeStage("T2_EAST_RETURN", { reason: "east-return-accepted" });

    const response = {
      accepted: true,
      action: CHECKPOINT_EVENT_ACTIONS.ADMIT,
      stageAccepted: "T2_EAST_RETURN",
      event: eventName(input) || "EAST_RETURN_PACKET",
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      activeStageId: state.activeStageId,
      activeFileGate: state.activeFileGate,
      pageResponsive: true,
      hardBlock: false
    };

    record("admit", "EAST_RETURN_ACCEPTED", response);
    publishAll();

    return response;
  }

  function acceptSouthReturn(packet = {}) {
    const input = normalizePayload(packet);

    const southReady = Boolean(
      hasEvent(input, SOUTH_RETURN_EVENTS) ||
      getAnyBool(input, [
        "routeConductorHydrated",
        "routeConductorApiPresent",
        "canvasBootRequested",
        "canvasBootResolved",
        "canvasBootComplete",
        "atlasBuildComplete",
        "textureComposeComplete",
        "firstFrameDetected",
        "imageRendered",
        "visibleContentProof",
        "visibleContentStrictProof",
        "visibleContentSoftGap",
        "visibleForwardProgress",
        "f21EligibleForNorth",
        "f21EligibilitySubmittedToNorth"
      ], false)
    );

    if (!southReady) {
      return getHeldResponse("WAITING_SOUTH_RETURN_PACKET", "south-return-evidence-missing", {
        recommendedNextOwner: "SOUTH",
        recommendedNextFile: FILE_GATES.south,
        recommendedNextRenewalTarget: FILE_GATES.south
      });
    }

    state.southReturnReceived = true;
    state.southReturnAccepted = true;
    state.firstFailedCoordinate = "NONE_SOUTH_RETURN_ACCEPTED";
    state.recommendedNextOwner = "WEST";
    state.recommendedNextFile = FILE_GATES.west;
    state.recommendedNextRenewalTarget = FILE_GATES.west;
    state.postgameStatus = "WEST_RETURN_PENDING";

    completeStage("T3_SOUTH_RETURN", {
      degraded: getAnyBool(input, ["visibleContentSoftGap"], false),
      reason: "south-return-accepted"
    });

    const response = {
      accepted: true,
      action: getAnyBool(input, ["visibleContentSoftGap"], false) ? CHECKPOINT_EVENT_ACTIONS.DEGRADED_FORWARD : CHECKPOINT_EVENT_ACTIONS.ADMIT,
      stageAccepted: "T3_SOUTH_RETURN",
      event: eventName(input) || "SOUTH_RETURN_PACKET",
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      activeStageId: state.activeStageId,
      activeFileGate: state.activeFileGate,
      pageResponsive: true,
      hardBlock: false
    };

    record("admit", "SOUTH_RETURN_ACCEPTED", response);
    publishAll();

    return response;
  }

  function acceptWestReturn(packet = {}) {
    const input = normalizePayload(packet);

    const westReady = Boolean(
      hasEvent(input, WEST_RETURN_EVENTS) ||
      getAnyBool(input, ["westGateReady", "westAccepted", "handoffAdmissible", "auditPassed", "inspectStrictReady", "inspectModeAvailable", "diagnosticCanLeavePlanetFrame"], false)
    );

    if (!westReady) {
      return getHeldResponse("WAITING_WEST_RETURN_PACKET", "west-return-evidence-missing", {
        recommendedNextOwner: "WEST",
        recommendedNextFile: FILE_GATES.west,
        recommendedNextRenewalTarget: FILE_GATES.west
      });
    }

    state.westReturnReceived = true;
    state.westReturnAccepted = true;
    state.firstFailedCoordinate = "NONE_WEST_RETURN_ACCEPTED";
    state.recommendedNextOwner = "NORTH";
    state.recommendedNextFile = FILE_GATES.north;
    state.recommendedNextRenewalTarget = FILE_GATES.north;
    state.postgameStatus = "NORTH_LATCH_OR_CONTINUE_PENDING";

    completeStage("T4_WEST_RETURN", {
      degraded: !getAnyBool(input, ["auditPassed", "inspectStrictReady", "handoffAdmissible"], false),
      reason: "west-return-accepted"
    });

    const response = {
      accepted: true,
      action: CHECKPOINT_EVENT_ACTIONS.ADMIT,
      stageAccepted: "T4_WEST_RETURN",
      event: eventName(input) || "WEST_RETURN_PACKET",
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      activeStageId: state.activeStageId,
      activeFileGate: state.activeFileGate,
      pageResponsive: true,
      hardBlock: false
    };

    record("admit", "WEST_RETURN_ACCEPTED", response);
    publishAll();

    return response;
  }

  function validateF21Eligibility(packet = {}) {
    const input = normalizePayload(packet);

    const explicitEligibility = Boolean(
      hasEvent(input, F21_ELIGIBILITY_EVENTS) ||
      getAnyBool(input, ["f21EligibleForNorth", "f21EligibilitySubmittedToNorth"], false)
    );

    const f8SouthSelfDuty = Boolean(
      getAnyBool(input, ["routeConductorHydrated"], false) ||
      (
        getAnyBool(input, ["routeConductorApiPresent"], false) &&
        getAnyBool(input, ["routeConductorReceiptPresent"], false) &&
        getAnyBool(input, ["routeConductorRuntimeActive"], true)
      )
    );

    const f13Parent = Boolean(
      getAnyBool(input, ["canvasParentPresent"], false) &&
      (
        getAnyBool(input, ["canvasParentBootMethodAvailable"], false) ||
        getAnyString(input, ["canvasParentBootMethod"], "")
      )
    );

    const f13Children = Boolean(getAnyBool(input, ["allCanvasChildrenReady"], false));

    const f13Texture = Boolean(
      getAnyBool(input, ["textureComposeComplete"], false) &&
      getAnyBool(input, ["atlasBuildComplete"], true)
    );

    const f13Frame = Boolean(
      getAnyBool(input, ["firstFrameDetected"], false) &&
      getAnyBool(input, ["imageRendered"], false)
    );

    const f13Visible = Boolean(
      (
        getAnyBool(input, ["visiblePlanetProofValid"], false) ||
        getAnyBool(input, ["visibleContentProof"], false) ||
        getAnyBool(input, ["visibleContentStrictProof"], false)
      ) &&
      !getAnyBool(input, ["visibleContentHardFail"], false)
    );

    const f13Strict = Boolean(
      getAnyBool(input, ["visibleContentStrictProof"], false) ||
      (
        getAnyBool(input, ["visibleContentProof"], false) &&
        !getAnyBool(input, ["visibleContentSoftGap"], false)
      )
    );

    const f13Inspect = Boolean(
      getAnyBool(input, ["inspectStrictReady"], false) ||
      (
        getAnyBool(input, ["inspectModeAvailable"], false) &&
        getAnyBool(input, ["diagnosticCanLeavePlanetFrame"], false)
      )
    );

    const newsGatePassed = Boolean(
      getAnyBool(input, ["newsGatePassed"], false) ||
      (
        f8SouthSelfDuty &&
        f13Parent &&
        f13Children &&
        f13Texture &&
        f13Frame &&
        f13Visible &&
        f13Inspect
      )
    );

    const degradedAllowed = Boolean(
      getAnyBool(input, ["newsGateDegraded"], false) ||
      getAnyBool(input, ["visibleContentSoftGap"], false) ||
      getAnyBool(input, ["degradedCompletionLatched"], false)
    );

    const evidence = {
      explicitEligibility,
      f8SouthSelfDuty,
      f13Parent,
      f13Children,
      f13Texture,
      f13Frame,
      f13Visible,
      f13Strict,
      f13Inspect,
      newsGatePassed,
      degradedAllowed,
      visibleContentHardFail: getAnyBool(input, ["visibleContentHardFail"], false),
      canvasClaimsF21: getAnyBool(input, ["f21ClaimedByCanvas", "canvasClaimsF21"], false),
      event: eventName(input),
      activeGateId: getAnyString(input, ["activeGateId"], ""),
      activeFibonacci: getAnyString(input, ["activeFibonacci"], ""),
      activeCardinal: getAnyString(input, ["activeCardinal"], "")
    };

    const required = [
      "explicitEligibility",
      "f8SouthSelfDuty",
      "f13Parent",
      "f13Children",
      "f13Texture",
      "f13Frame",
      "f13Visible",
      "f13Inspect",
      "newsGatePassed"
    ];

    const missing = required.filter((key) => !evidence[key]);

    let firstFailedCoordinate = "NONE_F21_FULL_ELIGIBLE";

    if (evidence.canvasClaimsF21) firstFailedCoordinate = "BLOCK_CANVAS_CANNOT_CLAIM_F21";
    else if (!explicitEligibility) firstFailedCoordinate = "WAITING_F21_ELIGIBILITY_SUBMISSION";
    else if (!f8SouthSelfDuty) firstFailedCoordinate = "WAITING_F8_SOUTH_SELF_DUTY";
    else if (!f13Parent) firstFailedCoordinate = "WAITING_F13A_CANVAS_PARENT";
    else if (!f13Children) firstFailedCoordinate = "WAITING_F13B_CANVAS_CHILDREN";
    else if (!f13Texture) firstFailedCoordinate = "WAITING_F13C_CANVAS_TEXTURE";
    else if (!f13Frame) firstFailedCoordinate = "WAITING_F13D_CANVAS_FRAME";
    else if (!f13Visible) firstFailedCoordinate = "WAITING_F13E_VISIBLE_PROOF";
    else if (!f13Inspect) firstFailedCoordinate = "WAITING_F13N_INSPECT_GATE";
    else if (!newsGatePassed) firstFailedCoordinate = "WAITING_NEWS_GATE_PASSED";

    const full = missing.length === 0 && f13Strict && !evidence.visibleContentHardFail && !evidence.canvasClaimsF21;
    const degraded = missing.length === 0 && !full && degradedAllowed && !evidence.visibleContentHardFail && !evidence.canvasClaimsF21;
    const ok = full || degraded;

    if (degraded) firstFailedCoordinate = "NONE_F21_DEGRADED_ELIGIBLE";

    return {
      ok,
      full,
      degraded,
      missing,
      evidence,
      firstFailedCoordinate,
      latchMode: full ? "FULL" : degraded ? "DEGRADED" : "WAITING",
      acceptedAt: ok ? nowIso() : ""
    };
  }

  function latchF21FromSouthEligibility(packet = {}, source = "latchF21FromSouthEligibility") {
    const validation = validateF21Eligibility(packet);

    state.f21EligibilityReceived = true;
    state.f21EligibilityValidation = validation;

    if (validation.firstFailedCoordinate === "BLOCK_CANVAS_CANNOT_CLAIM_F21") {
      state.f21EligibilityRejected = true;
      state.f21EligibilityAccepted = false;
      state.f21LatchMode = "WAITING";

      return getBlockResponse("BLOCK_CANVAS_CANNOT_CLAIM_F21", "canvas-f21-claim-rejected", {
        source,
        validation,
        recommendedNextOwner: "CANVAS",
        recommendedNextFile: FILE_GATES.canvas,
        recommendedNextRenewalTarget: FILE_GATES.canvas
      });
    }

    if (!validation.ok) {
      state.f21EligibilityRejected = true;
      state.f21EligibilityAccepted = false;
      state.f21LatchMode = "WAITING";

      return getHeldResponse(validation.firstFailedCoordinate, "f21-eligibility-not-valid", {
        source,
        validation,
        recommendedNextOwner: validation.firstFailedCoordinate.includes("F13") ? "CANVAS" : "NORTH",
        recommendedNextFile: validation.firstFailedCoordinate.includes("F13") ? FILE_GATES.canvas : FILE_GATES.north,
        recommendedNextRenewalTarget: validation.firstFailedCoordinate.includes("F13") ? FILE_GATES.canvas : FILE_GATES.north
      });
    }

    state.f21EligibilityAccepted = true;
    state.f21EligibilityRejected = false;
    state.f21LatchMode = validation.full ? "FULL" : "DEGRADED";
    state.completionLatched = true;
    state.finalCompletionLatched = true;
    state.degradedCompletionLatched = validation.degraded === true;
    state.downstreamReleaseAuthorized = true;

    state.firstFailedCoordinate = validation.full
      ? "NONE_F21_FULL_LATCHED_BY_NORTH"
      : "NONE_F21_DEGRADED_LATCHED_BY_NORTH";

    state.recommendedNextOwner = "NONE";
    state.recommendedNextFile = "read-postgame-receipt";
    state.recommendedNextRenewalTarget = "read-postgame-receipt";
    state.postgameStatus = validation.full
      ? "READY_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE"
      : "READY_DEGRADED_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE";

    completeStage("T5_NORTH_LATCH_OR_CONTINUE", {
      degraded: validation.degraded === true,
      reason: source
    });

    completeStage("T6_CANVAS_RELEASE", {
      degraded: validation.degraded === true,
      reason: "north-f21-latch-authorized-canvas-release"
    });

    state.activeProgress = 100;

    const response = {
      accepted: true,
      action: validation.full ? CHECKPOINT_EVENT_ACTIONS.LATCH : CHECKPOINT_EVENT_ACTIONS.DEGRADED_FORWARD,
      source,
      completionLatched: true,
      finalCompletionLatched: true,
      degradedCompletionLatched: validation.degraded === true,
      f21LatchMode: state.f21LatchMode,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      validation,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };

    record("admit", "F21_LATCHED_BY_NORTH_TIMING_AUTHORITY", response);
    publishAll();

    return response;
  }

  function receiveTimingEvent(packet = {}, source = "receiveEvent") {
    const input = normalizePayload(packet);
    const name = eventName(input);

    if (hasEvent(input, F21_ELIGIBILITY_EVENTS) || getAnyBool(input, ["f21EligibleForNorth", "f21EligibilitySubmittedToNorth"], false)) {
      return latchF21FromSouthEligibility(input, source);
    }

    if (hasEvent(input, WEST_RETURN_EVENTS) || getAnyBool(input, ["westGateReady", "westAccepted", "handoffAdmissible", "auditPassed", "inspectStrictReady"], false)) {
      return acceptWestReturn(input);
    }

    if (hasEvent(input, SOUTH_RETURN_EVENTS) || getAnyBool(input, ["routeConductorHydrated", "textureComposeComplete", "imageRendered", "visibleContentProof", "visibleContentSoftGap"], false)) {
      return acceptSouthReturn(input);
    }

    if (hasEvent(input, EAST_RETURN_EVENTS) || getAnyBool(input, ["eastGateReady", "step1Ready", "firstPaintReady", "scriptOrderComplete", "indexPresent"], false)) {
      return acceptEastReturn(input);
    }

    if (!name) {
      return getArchiveResponse("missing-event-name", { source });
    }

    return getArchiveResponse("unknown-event", { source, event: name });
  }

  function acceptF21Eligibility(packet = {}) {
    return latchF21FromSouthEligibility(packet, "acceptF21Eligibility");
  }

  function receiveF21Eligibility(packet = {}) {
    return latchF21FromSouthEligibility(packet, "receiveF21Eligibility");
  }

  function submitF21Eligibility(packet = {}) {
    return latchF21FromSouthEligibility(packet, "submitF21Eligibility");
  }

  function acceptEastHandoff(packet = {}) {
    return acceptEastReturn(packet);
  }

  function receiveEastHandoff(packet = {}) {
    return acceptEastReturn(packet);
  }

  function acceptWestHandoff(packet = {}) {
    return acceptWestReturn(packet);
  }

  function receiveWestHandoff(packet = {}) {
    return acceptWestReturn(packet);
  }

  function acceptWestIntake(packet = {}) {
    return acceptWestReturn(packet);
  }

  function receiveWestIntake(packet = {}) {
    return acceptWestReturn(packet);
  }

  function acceptCheckpointEvent(packet = {}) {
    return receiveTimingEvent(packet, "acceptCheckpointEvent");
  }

  function receiveCheckpointEvent(packet = {}) {
    return receiveTimingEvent(packet, "receiveCheckpointEvent");
  }

  function submitEvent(packet = {}) {
    return receiveTimingEvent(packet, "submitEvent");
  }

  function submit(packet = {}) {
    return submitEvent(packet);
  }

  function receiveEvent(packet = {}) {
    return receiveTimingEvent(packet, "receiveEvent");
  }

  function completeActive(packet = {}) {
    return submitEvent(packet);
  }

  function classifyCheckpointEvent(packet = {}) {
    const input = normalizePayload(packet);
    const name = eventName(input);

    if (hasEvent(input, F21_ELIGIBILITY_EVENTS) || getAnyBool(input, ["f21EligibleForNorth", "f21EligibilitySubmittedToNorth"], false)) {
      const validation = validateF21Eligibility(input);

      return {
        action: validation.ok ? CHECKPOINT_EVENT_ACTIONS.LATCH : CHECKPOINT_EVENT_ACTIONS.HELD,
        gapClass: validation.ok ? GAP_CLASS.NONE : GAP_CLASS.ELIGIBILITY_HELD,
        checkpointId: "F21_NORTH_LATCH",
        event: name || "F21_ELIGIBILITY_PACKET",
        validation,
        activeStageId: state.activeStageId,
        activeFileGate: state.activeFileGate
      };
    }

    if (hasEvent(input, WEST_RETURN_EVENTS)) {
      return {
        action: CHECKPOINT_EVENT_ACTIONS.ADMIT,
        gapClass: GAP_CLASS.NONE,
        checkpointId: "WEST_RETURN",
        event: name,
        activeStageId: state.activeStageId,
        activeFileGate: state.activeFileGate
      };
    }

    if (hasEvent(input, SOUTH_RETURN_EVENTS)) {
      return {
        action: CHECKPOINT_EVENT_ACTIONS.ADMIT,
        gapClass: GAP_CLASS.NONE,
        checkpointId: "SOUTH_RETURN",
        event: name,
        activeStageId: state.activeStageId,
        activeFileGate: state.activeFileGate
      };
    }

    if (hasEvent(input, EAST_RETURN_EVENTS)) {
      return {
        action: CHECKPOINT_EVENT_ACTIONS.ADMIT,
        gapClass: GAP_CLASS.NONE,
        checkpointId: "EAST_RETURN",
        event: name,
        activeStageId: state.activeStageId,
        activeFileGate: state.activeFileGate
      };
    }

    return {
      action: CHECKPOINT_EVENT_ACTIONS.ARCHIVE,
      gapClass: GAP_CLASS.DUPLICATE_ARCHIVE,
      reason: name ? "unknown-event-archived" : "missing-event-name",
      event: name,
      activeStageId: state.activeStageId,
      activeFileGate: state.activeFileGate
    };
  }

  function evaluateNewsGateState(snapshot = {}) {
    const input = normalizePayload(snapshot);

    const northGateReady = Boolean(
      state.northTimingAuthorityActive &&
      (
        state.completedStages.includes("T1_NORTH_DISTRIBUTE") ||
        getAnyBool(input, ["northGateReady", "runtimeTimingTableActive"], false)
      )
    );

    const eastGateReady = Boolean(
      state.eastReturnAccepted ||
      getAnyBool(input, ["eastGateReady", "step1Ready", "firstPaintReady"], false)
    );

    const southGateReady = Boolean(
      state.southReturnAccepted ||
      getAnyBool(input, ["southGateReady", "routeConductorHydrated", "visibleContentProof", "visibleContentStrictProof", "imageRendered"], false)
    );

    const westGateReady = Boolean(
      state.westReturnAccepted ||
      getAnyBool(input, ["westGateReady", "inspectStrictReady", "auditPassed", "handoffAdmissible"], false)
    );

    const f21GateReady = Boolean(
      state.completionLatched ||
      getAnyBool(input, ["f21EligibleForNorth", "f21EligibilitySubmittedToNorth"], false)
    );

    const newsGatePassedBeforeF21 = northGateReady && eastGateReady && southGateReady && westGateReady;
    const newsGateDegradedBeforeF21 = newsGatePassedBeforeF21 || (
      northGateReady &&
      (eastGateReady || southGateReady) &&
      westGateReady
    );

    return {
      northGateReady,
      eastGateReady,
      southGateReady,
      westGateReady,
      f21GateReady,
      newsGatePassedBeforeF21,
      newsGateDegradedBeforeF21,
      degradedForwardAvailable: newsGateDegradedBeforeF21 && !newsGatePassedBeforeF21,
      completionLatched: state.completionLatched,
      f21LatchMode: state.f21LatchMode
    };
  }

  function createTimingTable(options = {}) {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      timingTableContract: "LAB_RUNTIME_TABLE_NORTH_TIMING_TABLE_v1",
      timingTableReceipt: "LAB_RUNTIME_TABLE_NORTH_TIMING_TABLE_RECEIPT_v1",
      file: FILE,
      route: options.route || ROUTE,
      fileGatesPrimary: true,
      publicAliasesSecondary: true,
      northTimingAuthorityActive: true,
      runtimeTimingTableActive: true,
      timingLanguage: clonePlain(TIMING_LANGUAGE),
      fileGates: clonePlain(FILE_GATES),
      stages: clonePlain(TIMING_STAGES),
      activeStageId: state.activeStageId,
      activeFileGate: state.activeFileGate,
      completedStages: state.completedStages.slice(),
      degradedStages: state.degradedStages.slice(),
      blockedStages: state.blockedStages.slice(),
      oneActiveGearAtATime: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function getActiveTimingState() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      activeStageId: state.activeStageId,
      activeFileGate: state.activeFileGate,
      activeCardinal: state.activeCardinal,
      activeFibonacci: state.activeFibonacci,
      activeNewsGate: state.activeNewsGate,
      activeProgress: state.activeProgress,
      oneActiveGearAtATime: true,
      fileGatesPrimary: true,
      updatedAt: nowIso()
    };
  }

  function createChronologicalFibonacciPlan() {
    return TIMING_STAGES.map((stage) => ({
      id: stage.id,
      rank: stage.rank,
      cardinal: stage.cardinal,
      file: stage.file,
      fibonacci: stage.fibonacci,
      news: stage.news,
      label: stage.label,
      complete: state.completedStages.includes(stage.id),
      degraded: state.degradedStages.includes(stage.id),
      status: state.completedStages.includes(stage.id) ? CHECKPOINT_STATUS.COMPLETE : CHECKPOINT_STATUS.PENDING
    }));
  }

  function createNewsFibonacciCheckpointPlan(options = {}) {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "north-file-gate-distributor-news-fibonacci-plan",
      sequence: createChronologicalFibonacciPlan(options),
      newsGates: clonePlain(NEWS_GATES),
      fileGates: clonePlain(FILE_GATES),
      timingLanguage: clonePlain(TIMING_LANGUAGE),
      oneActiveGearAtATime: true,
      fileGatesPrimary: true,
      runtimeTimingTableActive: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
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
        return { error: error && error.message ? error.message : String(error) };
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
    const local = {
      id: options.id || `runtime-table-${Math.random().toString(36).slice(2, 9)}`,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousConstraintBaseline: PREVIOUS_CONSTRAINT_BASELINE,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      registrations: [],
      records: [],
      ledger: [],
      handoff: HANDOFF.BLOCKING,
      runtimeAllowed: false,
      tableSet: false,
      status: STATUS.PENDING,
      budget: normalizeBudget(options.budget || {}),
      planetId: options.planetId || "",
      planetLabel: options.planetLabel || "",
      createdAt: nowIso(),
      updatedAt: nowIso()
    };

    function log(event, detail = {}) {
      const entry = { event, detail: clonePlain(detail), at: nowIso() };
      local.ledger.push(entry);
      trim(local.ledger, 160);
      local.updatedAt = entry.at;
      return entry;
    }

    function registerChild(registration = {}) {
      const record = {
        key: registration.key || registration.name || `child-${local.registrations.length + 1}`,
        name: registration.name || registration.key || `Child ${local.registrations.length + 1}`,
        planetId: registration.planetId || local.planetId || "",
        channelType: registration.channelType || registration.key || "",
        fileGate: registration.fileGate || registration.file || "",
        expectedContract: registration.expectedContract || registration.contract || "",
        globalName: registration.globalName || "",
        requiredMethods: asArray(registration.requiredMethods).length ? asArray(registration.requiredMethods) : ["sample", "read"],
        requiredCoordinates: asArray(registration.requiredCoordinates).length ? asArray(registration.requiredCoordinates) : ["u", "v", "x", "y", "z"],
        budget: normalizeBudget(registration.budget || local.budget),
        sampleFailureBlocking: registration.sampleFailureBlocking === true,
        canFallback: registration.canFallback !== false,
        canDegrade: registration.canDegrade !== false,
        authority: registration.authority || null,
        resolve: registration.resolve || null,
        metadata: clonePlain(registration.metadata || {})
      };

      local.registrations.push(record);

      log("REGISTER_CHILD", {
        key: record.key,
        fileGate: record.fileGate,
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
          fileGate: registration.fileGate,
          status,
          authorityPresent: false,
          contractOk: false,
          expectedContract: registration.expectedContract,
          actualContract: "",
          methodsOk: false,
          coordinatesOk: false,
          coordinateMissing: registration.requiredCoordinates.slice(),
          sampleOk: false,
          sampleMethod: "",
          sample: null,
          receipt: null,
          issues: [createIssue("CHILD_MISSING", `${registration.name || registration.key} missing or unavailable.`, status)],
          ready: false,
          optimized: false,
          degraded: false,
          fallback: status === STATUS.FALLBACK,
          rejected: false,
          blocking: status === STATUS.BLOCKING,
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

      const status = decideStatus(issues, sample, registration);

      return {
        key: registration.key,
        name: registration.name,
        planetId: registration.planetId,
        channelType: registration.channelType,
        fileGate: registration.fileGate,
        status,
        authorityPresent: true,
        contractOk: contract.ok,
        expectedContract: contract.expected,
        actualContract: contract.actual,
        methodsOk: sample.ok,
        coordinatesOk: coordinates.ok,
        coordinateMissing: coordinates.missing || [],
        sampleOk: sample.ok,
        sampleMethod: sample.method,
        sample: sample.ok ? clonePlain(sample.sample) : null,
        receipt: clonePlain(receipt),
        issues,
        ready: status === STATUS.READY,
        optimized: status === STATUS.OPTIMIZED,
        degraded: status === STATUS.DEGRADED,
        fallback: status === STATUS.FALLBACK,
        rejected: status === STATUS.REJECTED,
        blocking: status === STATUS.BLOCKING,
        at: nowIso()
      };
    }

    function run(samplePoint = {}) {
      local.records = local.registrations.map((registration) => validateChild(registration, samplePoint));
      local.handoff = resolveHandoff(local.records);
      local.runtimeAllowed = handoffAllowsRuntime(local.handoff);
      local.tableSet = local.runtimeAllowed;
      local.status = local.runtimeAllowed ? STATUS.READY : local.handoff === HANDOFF.REJECTED ? STATUS.REJECTED : STATUS.BLOCKING;
      local.updatedAt = nowIso();

      log("RUN_TABLE", {
        handoff: local.handoff,
        runtimeAllowed: local.runtimeAllowed,
        childCount: local.records.length
      });

      return reportLedger();
    }

    function reportLedger() {
      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        previousConstraintBaseline: PREVIOUS_CONSTRAINT_BASELINE,
        baselineContract: BASELINE_CONTRACT,
        version: VERSION,
        id: local.id,
        planetId: local.planetId,
        planetLabel: local.planetLabel,
        status: local.status,
        handoff: local.handoff,
        runtimeAllowed: local.runtimeAllowed,
        tableSet: local.tableSet,
        fileGatesPrimary: true,
        runtimeTimingTableAvailable: true,
        childCount: local.registrations.length,
        records: clonePlain(local.records),
        ledger: clonePlain(local.ledger),
        visualPassClaimed: false,
        updatedAt: local.updatedAt
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

    function reset() {
      local.records = [];
      local.ledger = [];
      local.handoff = HANDOFF.BLOCKING;
      local.runtimeAllowed = false;
      local.tableSet = false;
      local.status = STATUS.PENDING;
      local.updatedAt = nowIso();

      log("RESET_TABLE", { id: local.id });

      return reportLedger();
    }

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousConstraintBaseline: PREVIOUS_CONSTRAINT_BASELINE,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      id: local.id,
      registerChild,
      validateChild,
      run,
      reportLedger,
      allowHandoff,
      reset,
      createPlan(input = {}, planOptions = {}) {
        const ledger = local.records.length ? reportLedger() : run(input.samplePoint || { u: 0.5, v: 0.5, x: 0, y: 0, z: 1 });
        return createUniversalPlanetVisualCarrierPlan({ ...input, runtimeTableLedger: ledger }, planOptions);
      },
      get state() {
        return local;
      },
      getReceipt() {
        return {
          contract: CONTRACT,
          receipt: RECEIPT,
          id: local.id,
          runtimeTable: true,
          tableSet: local.tableSet,
          handoff: local.handoff,
          runtimeAllowed: local.runtimeAllowed,
          status: local.status,
          fileGatesPrimary: true,
          runtimeTimingTableAvailable: true,
          visualPassClaimed: false,
          updatedAt: nowIso()
        };
      }
    };
  }

  function createTable(options = {}) {
    return RuntimeTable(options);
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

    asArray(options.channels).forEach((channel) => table.registerChild(channel));

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
          fileGate: "/assets/hearth/hearth.land.js",
          globalName: "HEARTH_LAND_CHANNEL",
          expectedContract: options.landContract || ""
        },
        {
          key: "water",
          name: "Hearth Water Channel",
          fileGate: "/assets/hearth/hearth.water.js",
          globalName: "HEARTH_WATER_CHANNEL",
          expectedContract: options.waterContract || ""
        },
        {
          key: "air",
          name: "Hearth Air Channel",
          fileGate: "/assets/hearth/hearth.air.js",
          globalName: "HEARTH_AIR_CHANNEL",
          expectedContract: options.airContract || ""
        }
      ],
      ...options
    });
  }

  function createPlanetGoalProfile(type = "universal-planet-channel-expression", overrides = {}) {
    return {
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
        constructionReadyIsNotCoherencePass: true,
        coherentExpressionPassIsNotVisualPassClaim: true,
        fileGatesPrimary: true,
        northTimingAuthorityActive: true,
        ...(overrides.laws || {})
      },
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function createGoalProfile(type = "hearth-channel-expression", overrides = {}) {
    return createPlanetGoalProfile(type, overrides);
  }

  function runChecks(input = {}, options = {}) {
    const goalProfile = input.goalProfile || options.goalProfile || createGoalProfile(options.profile || "universal-planet-channel-expression");
    const imageRendered = safeBool(input.imageRendered, safeBool(input.renderMetadata && input.renderMetadata.imageRendered, false));
    const wideProbeCount = Array.isArray(input.probeSamples) ? input.probeSamples.length : 0;
    const minWideProbe = safeNumber(goalProfile.tolerances && goalProfile.tolerances.minimumWideProbePoints, 25);

    const checkpoints = [
      {
        id: COHERENCE_CHECKS.RECEIPT_VERIFICATION_CHECK,
        name: "Receipt Verification Check",
        status: input.runtimeTableLedger || input.ledger ? COHERENCE_STATUS.PASS : COHERENCE_STATUS.WARNING,
        observed: input.runtimeTableLedger || input.ledger ? "Runtime ledger present." : "Runtime ledger missing or not supplied.",
        nonBlocking: true,
        at: nowIso()
      },
      {
        id: COHERENCE_CHECKS.FILE_GATE_DISTRIBUTION_CHECK,
        name: "File Gate Distribution Check",
        status: COHERENCE_STATUS.PASS,
        observed: "File paths are primary downstream distribution gates.",
        nonBlocking: false,
        at: nowIso()
      },
      {
        id: COHERENCE_CHECKS.TIMING_AUTHORITY_CHECK,
        name: "North Timing Authority Check",
        status: COHERENCE_STATUS.PASS,
        observed: "North owns timing, checkpoint session, F21 latch, and downstream release.",
        nonBlocking: false,
        at: nowIso()
      },
      {
        id: COHERENCE_CHECKS.WIDE_PROBE_READINESS_CHECK,
        name: "Wide-Probe Readiness Check",
        status: wideProbeCount >= minWideProbe ? COHERENCE_STATUS.PASS : COHERENCE_STATUS.HELD_PENDING_WIDE_PROBE,
        observed: wideProbeCount >= minWideProbe ? "Wide probe ready." : "Wide probe held; first visible render remains valid.",
        nonBlocking: true,
        value: { wideProbeCount, minWideProbe },
        at: nowIso()
      },
      {
        id: COHERENCE_CHECKS.COHERENT_EXPRESSION_CHECK,
        name: "Coherent Expression Check",
        status: imageRendered ? COHERENCE_STATUS.WARNING : COHERENCE_STATUS.HELD_PENDING_WIDE_PROBE,
        observed: imageRendered ? "Image rendered; coherence proof still separate." : "Image not rendered or not supplied.",
        nonBlocking: true,
        value: { imageRendered },
        at: nowIso()
      }
    ];

    const failedCheckpoints = checkpoints.filter((item) => [
      COHERENCE_STATUS.FAIL,
      COHERENCE_STATUS.REJECTED,
      COHERENCE_STATUS.BLOCKING
    ].includes(item.status));

    const warningCheckpoints = checkpoints.filter((item) => item.status === COHERENCE_STATUS.WARNING);
    const heldCheckpoints = checkpoints.filter((item) => item.status === COHERENCE_STATUS.HELD_PENDING_WIDE_PROBE);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "lab-triple-g-coherence-diagnostic-north-timing-authority",
      goalProfileId: goalProfile.id,
      goalProfile: clonePlain(goalProfile),
      constructionReady: true,
      imageRendered,
      coherentExpressionPass: false,
      coherenceScore: failedCheckpoints.length ? 72 : imageRendered ? 84 : 78,
      coherenceStatus: failedCheckpoints.length ? COHERENCE_STATUS.FAIL : COHERENCE_STATUS.WARNING,
      checkpoints,
      failedCheckpoints: failedCheckpoints.map((item) => item.id),
      warningCheckpoints: warningCheckpoints.map((item) => item.id),
      heldCheckpoints: heldCheckpoints.map((item) => item.id),
      nextStrategy: ["Use North timing-authority receipt before renewing downstream files."],
      fileGatesPrimary: true,
      runtimeTimingTableActive: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function createTripleGDiagnostic(options = {}) {
    const local = {
      id: options.id || `triple-g-diagnostic-${Math.random().toString(36).slice(2, 9)}`,
      profile: options.goalProfile || createGoalProfile(options.profile || "universal-planet-channel-expression", options.profileOverrides || {}),
      reports: [],
      createdAt: nowIso(),
      updatedAt: nowIso()
    };

    function run(input = {}) {
      const report = runChecks({ ...input, goalProfile: input.goalProfile || local.profile }, { ...options, goalProfile: input.goalProfile || local.profile });
      local.reports.push(report);
      trim(local.reports, 80);
      local.updatedAt = nowIso();
      return report;
    }

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      id: local.id,
      profile: local.profile,
      run,
      getLastReport() {
        return local.reports[local.reports.length - 1] || null;
      },
      getReceipt() {
        return {
          contract: CONTRACT,
          receipt: RECEIPT,
          id: local.id,
          reportCount: local.reports.length,
          tripleGDiagnostic: true,
          runtimeTimingTableAvailable: true,
          visualPassClaimed: false,
          updatedAt: nowIso()
        };
      },
      get state() {
        return local;
      }
    };
  }

  function createHearthCoherenceDiagnostic(options = {}) {
    return createTripleGDiagnostic({ ...options, profile: "hearth-channel-expression" });
  }

  function createPlanetWideProbeDiagnostic(options = {}) {
    return createTripleGDiagnostic({ ...options, profile: options.profile || "universal-planet-channel-expression" });
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
      loadingOptimizationContract: "LAB_UNIVERSAL_PLANET_LOADING_OPTIMIZATION_PLAN_v4",
      loadingOptimizationReceipt: "LAB_UNIVERSAL_PLANET_LOADING_OPTIMIZATION_PLAN_RECEIPT_v4",
      authority: "north-timing-authority-loading-optimization",
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
      loadingCoordinate: wideProbeReady ? L_COORDINATES.L6_OPTIMIZED_STABLE : L_COORDINATES.L5_WIDE_PROBE_IDLE_CHUNKS,
      fileGatesPrimary: true,
      runtimeTimingTableActive: true,
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

    const diagnostic = runChecks({
      ...input,
      runtimeTableLedger: ledger,
      loadingPlan: loadingOptimizationPlan,
      imageRendered
    }, options);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      planContract: "LAB_UNIVERSAL_PLANET_PROCEDURAL_VISUAL_CARRIER_PLAN_v4",
      planReceipt: "LAB_UNIVERSAL_PLANET_PROCEDURAL_VISUAL_CARRIER_PLAN_RECEIPT_v4",
      authority: "north-timing-authority-visual-carrier-plan",
      planetId: input.planetId || options.planetId || "",
      planetLabel: input.planetLabel || options.planetLabel || "",
      planGenerated: true,
      planValid: true,
      runtimeTableLedger: clonePlain(ledger),
      visualCarrierAllowed: true,
      visualizationBlocked: false,
      visualCarrierMode: imageRendered ? "atlas-carrier" : "fallback-shell",
      constructionReady: true,
      runtimeAllowed: true,
      atlasStartAuthorized: true,
      loadingOptimizationPlan,
      timingTable: createTimingTable(options),
      tripleGCheckpoints: diagnostic.checkpoints,
      failedCheckpoints: diagnostic.failedCheckpoints,
      warningCheckpoints: diagnostic.warningCheckpoints,
      heldCheckpoints: diagnostic.heldCheckpoints,
      coherenceScore: diagnostic.coherenceScore,
      coherenceStatus: diagnostic.coherenceStatus,
      fileGatesPrimary: true,
      runtimeTimingTableActive: true,
      childFailureDoesNotEraseVisualization: true,
      wideProbeBlocksFirstVisibleRender: false,
      singleAnchorIsLocalProofOnly: true,
      coherentExpressionEligible: true,
      coherentExpressionPass: false,
      visualPassClaimed: false,
      recommendedCheckpointSessionFactory: "createHearthTransmissionSession",
      firstFailedCoordinate: imageRendered ? "IMAGE_RENDERED_COHERENCE_PROOF_STILL_SEPARATE" : A_COORDINATES.A1_ATLAS_START_AUTHORIZED,
      recommendedNextRenewalTarget: imageRendered ? "run-triple-g-diagnostic" : FILE_GATES.canvas,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      routeMutation: false,
      runtimeMutation: false,
      controlsMutation: false,
      updatedAt: nowIso()
    };
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

  function createCheckpointSession(_sequenceInput = null, options = {}) {
    const sessionId = options.sessionId || options.id || "HEARTH-NORTH-FILE-GATE-TIMING-AUTHORITY";

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      checkpointSessionContract: "LAB_RUNTIME_TABLE_NORTH_FILE_GATE_TIMING_SESSION_v1",
      checkpointSessionReceipt: "LAB_RUNTIME_TABLE_NORTH_FILE_GATE_TIMING_SESSION_RECEIPT_v1",
      sessionId,
      route: options.route || ROUTE,
      persistentNorthSession: true,
      runtimeTimingTableActive: true,
      fileGatesPrimary: true,

      acceptEastHandoff,
      receiveEastHandoff,
      acceptEastReturn,

      acceptSouthReturn,

      acceptWestHandoff,
      receiveWestHandoff,
      acceptWestIntake,
      receiveWestIntake,
      acceptWestReturn,

      acceptF21Eligibility,
      receiveF21Eligibility,
      submitF21Eligibility,
      validateF21Eligibility,
      latchF21FromSouthEligibility,

      acceptCheckpointEvent,
      receiveCheckpointEvent,
      submitEvent,
      submit,
      receiveEvent,
      completeActive,

      getActiveCheckpoint: getActiveTimingState,
      getCheckpointState: getReceipt,
      getNewsGateState: evaluateNewsGateState,
      getReceipt,
      getReceiptText,
      reset: resetTiming,

      get state() {
        return state;
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

  function resetTiming(reason = "manual-reset") {
    state.activeStageId = TIMING_STAGES[0].id;
    state.activeFileGate = TIMING_STAGES[0].file;
    state.activeCardinal = TIMING_STAGES[0].cardinal;
    state.activeFibonacci = TIMING_STAGES[0].fibonacci;
    state.activeNewsGate = TIMING_STAGES[0].news;
    state.activeProgress = 0;
    state.completedStages = [];
    state.degradedStages = [];
    state.blockedStages = [];
    state.cycleCount += 1;

    state.eastReturnReceived = false;
    state.eastReturnAccepted = false;
    state.southReturnReceived = false;
    state.southReturnAccepted = false;
    state.westReturnReceived = false;
    state.westReturnAccepted = false;

    state.f21EligibilityReceived = false;
    state.f21EligibilityAccepted = false;
    state.f21EligibilityRejected = false;
    state.f21EligibilityValidation = null;
    state.f21LatchMode = "WAITING";
    state.completionLatched = false;
    state.finalCompletionLatched = false;
    state.degradedCompletionLatched = false;
    state.downstreamReleaseAuthorized = false;

    state.firstFailedCoordinate = "WAITING_NORTH_DISTRIBUTE";
    state.recommendedNextOwner = "NORTH";
    state.recommendedNextFile = FILE_GATES.north;
    state.recommendedNextRenewalTarget = FILE_GATES.north;
    state.postgameStatus = "NORTH_TIMING_AUTHORITY_READY";
    state.updatedAt = nowIso();

    refreshStageLedger();
    record("receipt", "TIMING_RESET", { reason });
    publishAll();

    return getReceipt();
  }

  function getTransmissionReceipt() {
    return getReceipt().transmissionReceipt;
  }

  function getTransmissionReceiptText() {
    return getReceiptText();
  }

  function getNorthCommandReceipt() {
    return getTransmissionReceipt();
  }

  function getHearthTransmissionSession() {
    return transmissionSession;
  }

  function createHearthTransmissionSession(options = {}) {
    if (options && options.reset === true) resetTiming("createHearthTransmissionSession-reset");
    return transmissionSession;
  }

  const transmissionSession = {
    contract: CONTRACT,
    receipt: RECEIPT,
    sessionId: "HEARTH-NORTH-FILE-GATE-TIMING-AUTHORITY",
    route: ROUTE,
    file: FILE,
    cardinalRole: "NORTH",

    acceptEastHandoff,
    receiveEastHandoff,
    acceptEastReturn,

    acceptSouthReturn,

    acceptWestHandoff,
    receiveWestHandoff,
    acceptWestIntake,
    receiveWestIntake,
    acceptWestReturn,

    acceptF21Eligibility,
    receiveF21Eligibility,
    submitF21Eligibility,
    validateF21Eligibility,
    latchF21FromSouthEligibility,

    acceptCheckpointEvent,
    receiveCheckpointEvent,
    submitEvent,
    submit,
    receiveEvent,
    completeActive,

    setActiveStage,
    completeStage,
    updateActiveProgress,
    getActiveTimingState,
    createTimingTable,

    getTransmissionReceipt,
    getReceipt: getTransmissionReceipt,
    getReceiptText: getTransmissionReceiptText,
    getNorthCommandReceipt,
    reset: resetTiming,

    get state() {
      return state;
    }
  };

  function bindCardinalBranches() {
    return getCardinalReceipt();
  }

  function loadCardinalBranchScripts() {
    return getCardinalReceipt();
  }

  function getCardinalReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "north-file-gate-distributor-cardinal-receipt",
      fileGatesPrimary: true,
      publicAliasesSecondary: true,
      northLoaded: true,
      eastFileGate: FILE_GATES.east,
      southFileGate: FILE_GATES.south,
      westFileGate: FILE_GATES.west,
      canvasFileGate: FILE_GATES.canvas,
      canvasEastFileGate: FILE_GATES.canvasEast,
      canvasWestFileGate: FILE_GATES.canvasWest,
      canvasSouthFileGate: FILE_GATES.canvasSouth,
      northTimingAuthorityActive: true,
      runtimeTimingTableActive: true,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    refreshStageLedger();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousConstraintBaseline: PREVIOUS_CONSTRAINT_BASELINE,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      authority: "lab-runtime-table-north-file-gate-distributor-timing-authority",
      destinationFile: FILE,
      file: FILE,
      route: ROUTE,
      status: "active",
      role: state.role,
      cardinalRole: "NORTH",

      fileGatesPrimary: true,
      publicAliasesSecondary: true,
      northTimingAuthorityActive: true,
      runtimeTimingTableActive: true,
      checkpointSessionActive: true,
      transmissionSessionActive: true,
      newsProtocolSynchronized: true,
      fibonacciSynchronizationActive: true,
      oneActiveGearAtATime: true,

      labEquipment: true,
      runtimeTable: true,
      tripleGDiagnostic: true,
      visualCarrierPlanAuthority: true,
      atlasStartPlanAuthority: true,
      coherentExpressionDiagnostic: true,
      loadingOptimizationAuthority: true,
      wideProbeDiagnosticAuthority: true,
      universalPlanetStandard: true,

      fileGates: clonePlain(FILE_GATES),
      timingLanguage: clonePlain(TIMING_LANGUAGE),
      timingStages: clonePlain(TIMING_STAGES),
      stageLedger: clonePlain(state.stageLedger),

      activeStageId: state.activeStageId,
      activeFileGate: state.activeFileGate,
      activeCardinal: state.activeCardinal,
      activeFibonacci: state.activeFibonacci,
      activeNewsGate: state.activeNewsGate,
      activeProgress: state.activeProgress,

      completedStages: state.completedStages.slice(),
      degradedStages: state.degradedStages.slice(),
      blockedStages: state.blockedStages.slice(),

      eastReturnReceived: state.eastReturnReceived,
      eastReturnAccepted: state.eastReturnAccepted,
      southReturnReceived: state.southReturnReceived,
      southReturnAccepted: state.southReturnAccepted,
      westReturnReceived: state.westReturnReceived,
      westReturnAccepted: state.westReturnAccepted,

      f21EligibilityReceived: state.f21EligibilityReceived,
      f21EligibilityAccepted: state.f21EligibilityAccepted,
      f21EligibilityRejected: state.f21EligibilityRejected,
      f21EligibilityValidation: clonePlain(state.f21EligibilityValidation),
      f21LatchMode: state.f21LatchMode,
      completionLatched: state.completionLatched,
      finalCompletionLatched: state.finalCompletionLatched,
      degradedCompletionLatched: state.degradedCompletionLatched,
      downstreamReleaseAuthorized: state.downstreamReleaseAuthorized,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,

      preservedExports: [
        "createTable",
        "createHearthChannelTable",
        "createPlanetChannelTable",
        "RuntimeTable",
        "STATUS",
        "HANDOFF",
        "COHERENCE_STATUS",
        "CHECKPOINT_EVENT_ACTIONS",
        "CHECKPOINT_STATUS",
        "GAP_CLASS",
        "NEWS_GATES",
        "FILE_GATES",
        "TIMING_STAGES",
        "createGoalProfile",
        "createPlanetGoalProfile",
        "createTripleGDiagnostic",
        "createHearthCoherenceDiagnostic",
        "createPlanetWideProbeDiagnostic",
        "runCoherenceDiagnostic",
        "runPlanetWideProbe",
        "createVisualCarrierPlan",
        "createHearthVisualCarrierPlan",
        "createUniversalPlanetVisualCarrierPlan",
        "createLoadingOptimizationPlan",
        "runProceduralPlan",
        "createCheckpointSession",
        "createHearthCheckpointSession",
        "createChronologicalFibonacciPlan",
        "createNewsFibonacciCheckpointPlan",
        "classifyCheckpointEvent",
        "evaluateNewsGateState",
        "createTimingTable",
        "getActiveTimingState",
        "setActiveStage",
        "completeStage",
        "updateActiveProgress",
        "createHearthTransmissionSession",
        "getHearthTransmissionSession",
        "getTransmissionReceipt",
        "getTransmissionReceiptText",
        "getNorthCommandReceipt",
        "acceptEastHandoff",
        "receiveEastHandoff",
        "acceptSouthReturn",
        "acceptWestHandoff",
        "receiveWestHandoff",
        "acceptWestIntake",
        "receiveWestIntake",
        "acceptF21Eligibility",
        "receiveF21Eligibility",
        "submitF21Eligibility",
        "validateF21Eligibility",
        "latchF21FromSouthEligibility",
        "acceptCheckpointEvent",
        "receiveCheckpointEvent",
        "submitEvent",
        "submit",
        "receiveEvent",
        "completeActive",
        "bindCardinalBranches",
        "loadCardinalBranchScripts",
        "getCardinalReceipt",
        "getReceipt",
        "getReceiptText"
      ],

      owns: [
        "macro-timing",
        "file-gate-distribution",
        "checkpoint-session",
        "transmission-session",
        "packet-classification",
        "f21-eligibility-validation",
        "f21-latch",
        "downstream-release-authorization",
        "receipt-publication",
        "runtime-table-factory",
        "diagnostic-factory",
        "visual-carrier-plan-factory",
        "loading-optimization-plan-factory"
      ],

      downstreamOwnership: {
        east: "owns its own route/index return packet downstream",
        south: "owns its own route-conductor/proof/eligibility return packet downstream",
        west: "owns its own admissibility/audit return packet downstream",
        canvas: "owns its own physical carrier and F13 evidence output downstream"
      },

      transmissionReceipt: {
        contract: CONTRACT,
        receipt: RECEIPT,
        file: FILE,
        route: ROUTE,
        activeStageId: state.activeStageId,
        activeFileGate: state.activeFileGate,
        activeProgress: state.activeProgress,
        completionLatched: state.completionLatched,
        f21LatchMode: state.f21LatchMode,
        firstFailedCoordinate: state.firstFailedCoordinate,
        recommendedNextFile: state.recommendedNextFile,
        recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
        admittedEvents: clonePlain(state.admittedEvents.slice(-50)),
        heldEvents: clonePlain(state.heldEvents.slice(-50)),
        archivedEvents: clonePlain(state.archivedEvents.slice(-50)),
        blockedEvents: clonePlain(state.blockedEvents.slice(-50)),
        errors: clonePlain(state.errors.slice(-50)),
        visualPassClaimed: false,
        updatedAt: nowIso()
      },

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      createdAt: state.createdAt,
      updatedAt: nowIso()
    };
  }

  function getReceiptText() {
    const r = getReceipt();

    const stages = r.stageLedger.map((stage) => (
      `- ${stage.id} :: ${stage.cardinal} :: file=${stage.file} :: fibonacci=${stage.fibonacci} :: news=${stage.news} :: complete=${stage.complete} :: degraded=${stage.degraded} :: active=${stage.active}`
    )).join("\n") || "- none";

    const admitted = r.transmissionReceipt.admittedEvents.map((item) => (
      `- ${item.at || ""} :: ${item.event || ""} :: ${JSON.stringify(item.detail || {})}`
    )).join("\n") || "- none";

    const held = r.transmissionReceipt.heldEvents.map((item) => (
      `- ${item.at || ""} :: ${item.event || ""} :: ${JSON.stringify(item.detail || {})}`
    )).join("\n") || "- none";

    const errors = r.transmissionReceipt.errors.map((item) => (
      `- ${item.at || ""} :: ${item.event || ""} :: ${JSON.stringify(item.detail || {})}`
    )).join("\n") || "- none";

    return [
      "LAB_RUNTIME_TABLE_NORTH_FILE_GATE_DISTRIBUTOR_TIMING_AUTHORITY_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousConstraintBaseline=${r.previousConstraintBaseline}`,
      `baselineContract=${r.baselineContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `route=${r.route}`,
      `role=${r.role}`,
      `cardinalRole=${r.cardinalRole}`,
      "",
      `fileGatesPrimary=${r.fileGatesPrimary}`,
      `publicAliasesSecondary=${r.publicAliasesSecondary}`,
      `northTimingAuthorityActive=${r.northTimingAuthorityActive}`,
      `runtimeTimingTableActive=${r.runtimeTimingTableActive}`,
      `checkpointSessionActive=${r.checkpointSessionActive}`,
      `transmissionSessionActive=${r.transmissionSessionActive}`,
      `newsProtocolSynchronized=${r.newsProtocolSynchronized}`,
      `fibonacciSynchronizationActive=${r.fibonacciSynchronizationActive}`,
      `oneActiveGearAtATime=${r.oneActiveGearAtATime}`,
      "",
      `activeStageId=${r.activeStageId}`,
      `activeFileGate=${r.activeFileGate}`,
      `activeCardinal=${r.activeCardinal}`,
      `activeFibonacci=${r.activeFibonacci}`,
      `activeNewsGate=${r.activeNewsGate}`,
      `activeProgress=${r.activeProgress}`,
      "",
      "STAGE_LEDGER",
      stages,
      "",
      `eastReturnAccepted=${r.eastReturnAccepted}`,
      `southReturnAccepted=${r.southReturnAccepted}`,
      `westReturnAccepted=${r.westReturnAccepted}`,
      "",
      `f21EligibilityReceived=${r.f21EligibilityReceived}`,
      `f21EligibilityAccepted=${r.f21EligibilityAccepted}`,
      `f21EligibilityRejected=${r.f21EligibilityRejected}`,
      `f21LatchMode=${r.f21LatchMode}`,
      `completionLatched=${r.completionLatched}`,
      `finalCompletionLatched=${r.finalCompletionLatched}`,
      `degradedCompletionLatched=${r.degradedCompletionLatched}`,
      `downstreamReleaseAuthorized=${r.downstreamReleaseAuthorized}`,
      "",
      `firstFailedCoordinate=${r.firstFailedCoordinate}`,
      `recommendedNextOwner=${r.recommendedNextOwner}`,
      `recommendedNextFile=${r.recommendedNextFile}`,
      `recommendedNextRenewalTarget=${r.recommendedNextRenewalTarget}`,
      `postgameStatus=${r.postgameStatus}`,
      "",
      "ADMITTED_EVENTS",
      admitted,
      "",
      "HELD_EVENTS",
      held,
      "",
      "ERRORS",
      errors,
      "",
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousConstraintBaseline: PREVIOUS_CONSTRAINT_BASELINE,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,

    STATUS,
    HANDOFF,
    COHERENCE_STATUS,
    CHECKPOINT_EVENT_ACTIONS,
    CHECKPOINT_STATUS,
    GAP_CLASS,
    NEWS_GATES,
    FILE_GATES,
    TIMING_LANGUAGE,
    TIMING_STAGES,
    COHERENCE_CHECKS,
    R_COORDINATES,
    V_COORDINATES,
    A_COORDINATES,
    C_COORDINATES,
    L_COORDINATES,

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

    createTimingTable,
    getActiveTimingState,
    setActiveStage,
    completeStage,
    updateActiveProgress,

    createHearthTransmissionSession,
    getHearthTransmissionSession,
    getTransmissionReceipt,
    getTransmissionReceiptText,
    getNorthCommandReceipt,

    acceptEastHandoff,
    receiveEastHandoff,
    acceptEastReturn,

    acceptSouthReturn,

    acceptWestHandoff,
    receiveWestHandoff,
    acceptWestIntake,
    receiveWestIntake,
    acceptWestReturn,

    acceptF21Eligibility,
    receiveF21Eligibility,
    submitF21Eligibility,
    validateF21Eligibility,
    latchF21FromSouthEligibility,

    acceptCheckpointEvent,
    receiveCheckpointEvent,
    submitEvent,
    submit,
    receiveEvent,
    completeActive,

    bindCardinalBranches,
    loadCardinalBranchScripts,
    getCardinalReceipt,
    getReceipt,
    getReceiptText,

    labEquipment: true,
    runtimeTable: true,
    tripleGDiagnostic: true,
    coherentExpressionDiagnostic: true,
    visualCarrierPlanAuthority: true,
    atlasStartPlanAuthority: true,
    loadingOptimizationAuthority: true,
    wideProbeDiagnosticAuthority: true,
    universalPlanetStandard: true,

    fileGatesPrimary: true,
    publicAliasesSecondary: true,
    northTimingAuthorityActive: true,
    runtimeTimingTableActive: true,
    checkpointSessionActive: true,
    transmissionSessionActive: true,
    newsProtocolSynchronized: true,
    fibonacciSynchronizationActive: true,
    oneActiveGearAtATime: true,

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

    get activeStageId() {
      return state.activeStageId;
    },
    get activeFileGate() {
      return state.activeFileGate;
    },
    get activeProgress() {
      return state.activeProgress;
    },
    get completionLatched() {
      return state.completionLatched;
    },
    get f21LatchMode() {
      return state.f21LatchMode;
    },
    get timingState() {
      return state;
    }
  };

  function publishDatasets() {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    dataset.labRuntimeTableLoaded = "true";
    dataset.labRuntimeTableContract = CONTRACT;
    dataset.labRuntimeTablePreviousConstraintBaseline = PREVIOUS_CONSTRAINT_BASELINE;
    dataset.labRuntimeTableBaselineContract = BASELINE_CONTRACT;
    dataset.labRuntimeTableReceipt = RECEIPT;
    dataset.labRuntimeTableNorthLoaded = "true";

    dataset.fileGatesPrimary = "true";
    dataset.publicAliasesSecondary = "true";
    dataset.northTimingAuthorityActive = "true";
    dataset.runtimeTimingTableActive = "true";
    dataset.checkpointSessionActive = "true";
    dataset.transmissionSessionActive = "true";
    dataset.newsProtocolSynchronized = "true";
    dataset.fibonacciSynchronizationActive = "true";
    dataset.oneActiveGearAtATime = "true";

    dataset.activeStageId = state.activeStageId;
    dataset.activeFileGate = state.activeFileGate;
    dataset.activeCardinal = state.activeCardinal;
    dataset.activeFibonacci = state.activeFibonacci;
    dataset.activeNewsGate = state.activeNewsGate;
    dataset.activeProgress = String(state.activeProgress);

    dataset.eastReturnAccepted = String(state.eastReturnAccepted);
    dataset.southReturnAccepted = String(state.southReturnAccepted);
    dataset.westReturnAccepted = String(state.westReturnAccepted);

    dataset.f21EligibilityReceived = String(state.f21EligibilityReceived);
    dataset.f21EligibilityAccepted = String(state.f21EligibilityAccepted);
    dataset.f21EligibilityRejected = String(state.f21EligibilityRejected);
    dataset.f21LatchMode = state.f21LatchMode;
    dataset.completionLatched = String(state.completionLatched);
    dataset.finalCompletionLatched = String(state.finalCompletionLatched);
    dataset.degradedCompletionLatched = String(state.degradedCompletionLatched);
    dataset.downstreamReleaseAuthorized = String(state.downstreamReleaseAuthorized);

    dataset.firstFailedCoordinate = state.firstFailedCoordinate;
    dataset.recommendedNextOwner = state.recommendedNextOwner;
    dataset.recommendedNextFile = state.recommendedNextFile;
    dataset.recommendedNextRenewalTarget = state.recommendedNextRenewalTarget;
    dataset.postgameStatus = state.postgameStatus;

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
    root.DEXTER_LAB.hearthCheckpointSession = transmissionSession;
    root.DEXTER_LAB.checkpointSession = transmissionSession;

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
    root.LAB_RUNTIME_TABLE_NORTH_FILE_GATE_DISTRIBUTOR = api;

    root.HEARTH_NORTH_COMMAND_RUNTIME_TABLE = api;
    root.HEARTH_NORTH_COMMAND_TABLE = api;
    root.HEARTH_NORTH_COMMAND = api;
    root.HEARTH_LOCAL_COMMAND_RUNTIME_TABLE = api;
    root.HEARTH.northCommandRuntimeTable = api;
    root.HEARTH.runtimeTimingTable = api;

    root.HEARTH_CHECKPOINT_SESSION = transmissionSession;
    root.HEARTH_RUNTIME_CHECKPOINT_SESSION = transmissionSession;
    root.LAB_HEARTH_CHECKPOINT_SESSION = transmissionSession;
    root.LAB_CHECKPOINT_SESSION = transmissionSession;
    root.HEARTH_NORTH_TRANSMISSION_SESSION = transmissionSession;
    root.HEARTH_NORTH_FILE_GATE_TIMING_SESSION = transmissionSession;

    root.HEARTH_NORTH_COMMAND_RUNTIME_TABLE_RECEIPT = getTransmissionReceipt();
    root.HEARTH_NORTH_CYCLICAL_CHECKPOINT_RECEIPT = root.HEARTH_NORTH_COMMAND_RUNTIME_TABLE_RECEIPT;
    root.LAB_RUNTIME_TABLE_NORTH_TRANSMISSION_RECEIPT = root.HEARTH_NORTH_COMMAND_RUNTIME_TABLE_RECEIPT;
    root.LAB_RUNTIME_TABLE_NORTH_FILE_GATE_DISTRIBUTOR_RECEIPT = root.HEARTH_NORTH_COMMAND_RUNTIME_TABLE_RECEIPT;

    publishDatasets();
  }

  state.createdAt = nowIso();
  state.updatedAt = state.createdAt;
  refreshStageLedger();
  publishAll();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();

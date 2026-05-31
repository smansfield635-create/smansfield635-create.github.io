// /assets/lab/runtime-table.js
// LAB_RUNTIME_TABLE_NORTH_PRIMARY_GATE_REGISTRY_MACRO_DISTRIBUTOR_TNT_v1
// Full-file replacement.
// North primary gate authority.
// Purpose:
// - Establish North as the macro distributor for the primary Runtime Table gate layer.
// - Lock the primary gate files before any Hearth route sub-layer proceeds.
// - Treat file paths as the distribution gates.
// - Keep microtuning downstream of the primary gate layer.
// - Define the primary rotation:
//   1. North primary distributor: /assets/lab/runtime-table.js
//   2. East primary gate: /assets/lab/runtime-table.east.js
//   3. South primary gate: /assets/lab/runtime-table.south.js
//   4. West primary gate: /assets/lab/runtime-table.west.js
//   5. North return latch: /assets/lab/runtime-table.js
//   6. Downstream release: Hearth route and canvas files.
// - Preserve Runtime Table, Triple G, Visual Carrier Plan, Loading Optimization, Wide Probe,
//   checkpoint, transmission, F21 NEWS latch, and Hearth-facing exports.

(() => {
  "use strict";

  const CONTRACT = "LAB_RUNTIME_TABLE_NORTH_PRIMARY_GATE_REGISTRY_MACRO_DISTRIBUTOR_TNT_v1";
  const RECEIPT = "LAB_RUNTIME_TABLE_NORTH_PRIMARY_GATE_REGISTRY_MACRO_DISTRIBUTOR_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "LAB_RUNTIME_TABLE_NORTH_MACRO_DISTRIBUTOR_MICRO_TUNING_TIMETABLE_TNT_v1";
  const BASELINE_CONTRACT = "LAB_RUNTIME_TABLE_NORTH_F21_NEWS_LATCH_CONSUMER_ALIGNMENT_PLUS_FIBONACCI_SYNC_TNT_v2";
  const VERSION = "2026-05-31.lab-runtime-table-north-primary-gate-registry-macro-distributor-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const FILE = "/assets/lab/runtime-table.js";
  const ROUTE = "/showroom/globe/hearth/";

  const PRIMARY_GATES = Object.freeze({
    north: "/assets/lab/runtime-table.js",
    east: "/assets/lab/runtime-table.east.js",
    south: "/assets/lab/runtime-table.south.js",
    west: "/assets/lab/runtime-table.west.js"
  });

  const DOWNSTREAM_GATES = Object.freeze({
    hearthIndex: "/showroom/globe/hearth/index.js",
    hearthRouteConductor: "/showroom/globe/hearth/hearth.js",
    hearthWestHandoff: "/assets/hearth/hearth.west.index-handoff.table.js",
    canvas: "/assets/hearth/hearth.canvas.js",
    canvasEast: "/assets/hearth/hearth.canvas.east.js",
    canvasWest: "/assets/hearth/hearth.canvas.west.js",
    canvasSouth: "/assets/hearth/hearth.canvas.south.js"
  });

  const FILE_GATES = Object.freeze({
    ...PRIMARY_GATES,
    ...DOWNSTREAM_GATES
  });

  const STATUS = Object.freeze({
    PENDING: "PENDING",
    ACTIVE: "ACTIVE",
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
    PRIMARY_GATE_WAIT: "PRIMARY_GATE_WAIT",
    PRIMARY_GATE_FILE_MISMATCH: "PRIMARY_GATE_FILE_MISMATCH",
    STRUCTURAL_BLOCK: "STRUCTURAL_BLOCK",
    FALSE_COMPLETION_BLOCK: "FALSE_COMPLETION_BLOCK",
    DIAGNOSTIC_BLOCK: "DIAGNOSTIC_BLOCK",
    DEGRADED_GAP: "DEGRADED_GAP",
    HELD_GAP: "HELD_GAP",
    PROGRESS_ONLY: "PROGRESS_ONLY",
    DUPLICATE_ARCHIVE: "DUPLICATE_ARCHIVE",
    DOWNSTREAM_HELD: "DOWNSTREAM_HELD"
  });

  const NEWS_GATES = Object.freeze({
    NORTH: "NORTH",
    EAST: "EAST",
    SOUTH: "SOUTH",
    WEST: "WEST",
    F21: "F21",
    DOWNSTREAM: "DOWNSTREAM"
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

  const NORTH_LANGUAGE = Object.freeze({
    north: "primary macro distributor / timing governor / release authority",
    primaryGate: "file path gate in the Runtime Table layer",
    rotation: "North -> East primary -> South primary -> West primary -> North return -> downstream release",
    eastPrimary: "first primary alignment gate",
    southPrimary: "primary output-spread gate",
    westPrimary: "primary audit and admissibility gate",
    northReturn: "North latch, continuation, or release decision",
    downstream: "route, canvas, and Hearth-specific consumers after primary gates close"
  });

  const PRIMARY_ROTATION = Object.freeze([
    {
      id: "P1_NORTH_PRIMARY_DISTRIBUTOR",
      gear: "GEAR_1_NORTH_PRIMARY_DISTRIBUTOR",
      cardinal: "NORTH",
      file: PRIMARY_GATES.north,
      fibonacci: "F1",
      news: "NORTH",
      label: "North primary distributor",
      proof: ["north-api", "primary-gate-registry", "file-gate-map", "release-sequence"]
    },
    {
      id: "P2_EAST_PRIMARY_GATE",
      gear: "GEAR_2_EAST_PRIMARY_GATE",
      cardinal: "EAST",
      file: PRIMARY_GATES.east,
      fibonacci: "F3",
      news: "EAST",
      label: "East primary gate",
      proof: ["east-primary-file", "east-primary-receipt", "gate-alignment", "news-fibonacci-lineup"]
    },
    {
      id: "P3_SOUTH_PRIMARY_GATE",
      gear: "GEAR_3_SOUTH_PRIMARY_GATE",
      cardinal: "SOUTH",
      file: PRIMARY_GATES.south,
      fibonacci: "F8",
      news: "SOUTH",
      label: "South primary gate",
      proof: ["south-primary-file", "south-primary-receipt", "output-spread", "release-packet"]
    },
    {
      id: "P4_WEST_PRIMARY_GATE",
      gear: "GEAR_4_WEST_PRIMARY_GATE",
      cardinal: "WEST",
      file: PRIMARY_GATES.west,
      fibonacci: "F13",
      news: "WEST",
      label: "West primary gate",
      proof: ["west-primary-file", "west-primary-receipt", "audit-pass", "admissibility-decision"]
    },
    {
      id: "P5_NORTH_RETURN_LATCH",
      gear: "GEAR_5_NORTH_RETURN_LATCH",
      cardinal: "NORTH",
      file: PRIMARY_GATES.north,
      fibonacci: "F21",
      news: "F21",
      label: "North return latch",
      proof: ["primary-cycle-complete", "north-validation", "latch-or-continue-decision"]
    },
    {
      id: "P6_DOWNSTREAM_RELEASE",
      gear: "GEAR_6_DOWNSTREAM_RELEASE",
      cardinal: "DOWNSTREAM",
      file: DOWNSTREAM_GATES.hearthIndex,
      fibonacci: "F21_RELEASE",
      news: "DOWNSTREAM",
      label: "Downstream release",
      proof: ["north-release-authorized", "primary-gates-closed", "downstream-target-declared"]
    }
  ]);

  const PRIMARY_EVENTS = Object.freeze({
    EAST: [
      "EAST_PRIMARY_GATE_READY",
      "EAST_PRIMARY_ALIGNMENT_READY",
      "EAST_PRIMARY_NEWS_FIBONACCI_READY",
      "RUNTIME_TABLE_EAST_READY",
      "PRIMARY_EAST_GATE_ACCEPTED"
    ],
    SOUTH: [
      "SOUTH_PRIMARY_GATE_READY",
      "SOUTH_PRIMARY_OUTPUT_SPREAD_READY",
      "SOUTH_PRIMARY_RELEASE_PACKET_READY",
      "RUNTIME_TABLE_SOUTH_READY",
      "PRIMARY_SOUTH_GATE_ACCEPTED"
    ],
    WEST: [
      "WEST_PRIMARY_GATE_READY",
      "WEST_PRIMARY_AUDIT_READY",
      "WEST_PRIMARY_ADMISSIBILITY_READY",
      "RUNTIME_TABLE_WEST_READY",
      "PRIMARY_WEST_GATE_ACCEPTED"
    ],
    F21: [
      "F21_PRIMARY_CYCLE_READY",
      "F21_COMPLETION_LATCH",
      "F21_COMPLETION_LATCHED",
      "F21_FULL_ELIGIBLE_FOR_NORTH_NEWS_LATCH",
      "F21_ELIGIBLE_FOR_NORTH_NEWS_LATCH",
      "F21_ELIGIBILITY_SUBMITTED_TO_NORTH",
      "F21_ELIGIBILITY_READY_FOR_NORTH",
      "F21_NEWS_LATCH_READY",
      "PRIMARY_GATE_CYCLE_ELIGIBLE"
    ]
  });

  const DOWNSTREAM_EVENTS = Object.freeze([
    "INDEX_HANDOFF_ACCEPTED",
    "S2_INDEX_HANDOFF_ACCEPTED",
    "EAST_STEP1_HANDOFF_ACCEPTED_BY_WEST_METHOD",
    "SOUTH_VISIBLE_COMPLETION_READY",
    "CANVAS_READY",
    "FIRST_FRAME_DETECTED",
    "VISIBLE_CONTENT_PROOF_PASSED",
    "DEGRADED_VISIBLE_CONTENT_ACCEPTED",
    "INSPECT_MODE_READY",
    "DEGRADED_INSPECT_MODE_ACCEPTED"
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,

    role: "north-primary-gate-registry-macro-distributor",
    cardinalRole: "NORTH",

    primaryGateRegistryActive: true,
    primaryGateFilesLocked: true,
    fileGatesPrimary: true,
    downstreamReleaseHeldUntilPrimaryClosure: true,
    northMacroOnly: true,
    microTuningDelegatesDownstream: true,

    activeStageId: PRIMARY_ROTATION[0].id,
    activeGear: PRIMARY_ROTATION[0].gear,
    activeCardinal: PRIMARY_ROTATION[0].cardinal,
    activeFileGate: PRIMARY_ROTATION[0].file,
    activeFibonacci: PRIMARY_ROTATION[0].fibonacci,
    activeNewsGate: PRIMARY_ROTATION[0].news,
    activeProgress: 0,

    completedStages: [],
    degradedStages: [],
    blockedStages: [],
    stageLedger: [],

    northPrimaryReady: true,
    eastPrimaryReceived: false,
    eastPrimaryAccepted: false,
    southPrimaryReceived: false,
    southPrimaryAccepted: false,
    westPrimaryReceived: false,
    westPrimaryAccepted: false,
    northReturnValidated: false,
    downstreamReleaseAuthorized: false,
    downstreamReleaseTarget: "",

    f21EligibilityReceived: false,
    f21EligibilityAccepted: false,
    f21EligibilityRejected: false,
    f21EligibilityValidation: null,
    f21LatchMode: "WAITING",
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,

    firstFailedCoordinate: "WAITING_EAST_PRIMARY_GATE",
    recommendedNextOwner: "EAST",
    recommendedNextFile: PRIMARY_GATES.east,
    recommendedNextRenewalTarget: PRIMARY_GATES.east,
    postgameStatus: "PRIMARY_GATE_REGISTRY_READY",

    admittedEvents: [],
    heldEvents: [],
    archivedEvents: [],
    blockedEvents: [],
    receipts: [],
    errors: [],

    createdAt: "",
    updatedAt: "",

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
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
    if (Array.isArray(list) && list.length > max) list.splice(0, list.length - max);
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
    const seen = new WeakSet();
    const queue = [{ value: input, depth: 0 }];

    while (queue.length) {
      const item = queue.shift();
      const value = item.value;

      if (!isObject(value) || item.depth > maxDepth) continue;
      if (seen.has(value)) continue;
      seen.add(value);

      for (const key of Object.keys(value)) {
        if (wanted.has(key)) return value[key];
      }

      for (const key of Object.keys(value)) {
        const next = value[key];
        if (isObject(next)) queue.push({ value: next, depth: item.depth + 1 });
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

  function packetFile(input = {}) {
    const packet = normalizePayload(input);
    return (
      getAnyString(packet, ["fileGate"], "") ||
      getAnyString(packet, ["file"], "") ||
      getAnyString(packet, ["sourceFile"], "") ||
      getAnyString(packet, ["destinationFile"], "") ||
      getAnyString(packet, ["primaryFileGate"], "")
    );
  }

  function packetContract(input = {}) {
    return getAnyString(input, ["contract"], "");
  }

  function packetPrimaryCardinal(input = {}) {
    const packet = normalizePayload(input);
    return (
      getAnyString(packet, ["primaryGate"], "") ||
      getAnyString(packet, ["primaryCardinal"], "") ||
      getAnyString(packet, ["gateCardinal"], "") ||
      getAnyString(packet, ["cardinalRole"], "") ||
      getAnyString(packet, ["activeCardinal"], "")
    ).toUpperCase();
  }

  function isPrimaryGatePacket(input, cardinal) {
    const packet = normalizePayload(input);
    const card = String(cardinal || "").toUpperCase();
    const file = packetFile(packet);
    const contract = packetContract(packet);
    const primaryCardinal = packetPrimaryCardinal(packet);

    if (card === "EAST" && file === PRIMARY_GATES.east) return true;
    if (card === "SOUTH" && file === PRIMARY_GATES.south) return true;
    if (card === "WEST" && file === PRIMARY_GATES.west) return true;
    if (primaryCardinal === card && getAnyBool(packet, ["primaryGateReady", "primaryRuntimeTableGate"], false)) return true;

    if (card === "EAST" && /RUNTIME_TABLE_EAST|EAST_PRIMARY/.test(contract)) return true;
    if (card === "SOUTH" && /RUNTIME_TABLE_SOUTH|SOUTH_PRIMARY/.test(contract)) return true;
    if (card === "WEST" && /RUNTIME_TABLE_WEST|WEST_PRIMARY/.test(contract)) return true;

    return false;
  }

  function isDownstreamPacket(input = {}) {
    const file = packetFile(input);
    if (Object.values(DOWNSTREAM_GATES).includes(file)) return true;
    return hasEvent(input, DOWNSTREAM_EVENTS);
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
    return PRIMARY_ROTATION.find((stage) => stage.id === id) || null;
  }

  function stageIndex(id) {
    return PRIMARY_ROTATION.findIndex((stage) => stage.id === id);
  }

  function nextStageAfter(id) {
    const index = stageIndex(id);
    if (index < 0) return PRIMARY_ROTATION[0];
    return PRIMARY_ROTATION[Math.min(index + 1, PRIMARY_ROTATION.length - 1)];
  }

  function refreshStageLedger() {
    state.stageLedger = PRIMARY_ROTATION.map((stage) => ({
      id: stage.id,
      gear: stage.gear,
      cardinal: stage.cardinal,
      file: stage.file,
      fibonacci: stage.fibonacci,
      news: stage.news,
      label: stage.label,
      proof: stage.proof.slice(),
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
      recordError("UNKNOWN_PRIMARY_STAGE", `Unknown primary stage: ${stageId}`, { reason });
      return getHeldResponse("UNKNOWN_PRIMARY_STAGE", reason);
    }

    state.activeStageId = stage.id;
    state.activeGear = stage.gear;
    state.activeCardinal = stage.cardinal;
    state.activeFileGate = stage.file;
    state.activeFibonacci = stage.fibonacci;
    state.activeNewsGate = stage.news;
    state.activeProgress = state.completedStages.includes(stage.id) ? 100 : 0;
    state.postgameStatus = `ACTIVE_${stage.id}`;

    refreshStageLedger();
    state.updatedAt = nowIso();

    record("receipt", "ACTIVE_PRIMARY_STAGE_SET", { stageId, reason });
    publishAll();

    return getActiveGateState();
  }

  function completeStage(stageId, options = {}) {
    const stage = stageById(stageId);
    if (!stage) return getHeldResponse("UNKNOWN_PRIMARY_STAGE", "completeStage-unknown-stage", { stageId });

    if (!state.completedStages.includes(stage.id)) state.completedStages.push(stage.id);
    if (options.degraded === true && !state.degradedStages.includes(stage.id)) state.degradedStages.push(stage.id);

    state.activeProgress = 100;
    state.updatedAt = nowIso();

    const next = nextStageAfter(stage.id);

    record("admit", "PRIMARY_STAGE_COMPLETE", {
      stageId: stage.id,
      degraded: options.degraded === true,
      reason: options.reason || "",
      nextStage: next.id
    });

    if (stage.id !== next.id) {
      setActiveStage(next.id, options.reason || "primary-stage-complete-shift");
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
      activeFileGate: state.activeFileGate
    };
  }

  function updateActiveProgress(progress, reason = "progress-update") {
    state.activeProgress = clamp(progress, 0, 100);
    state.updatedAt = nowIso();

    record("receipt", "ACTIVE_PRIMARY_GATE_PROGRESS_UPDATED", {
      activeStageId: state.activeStageId,
      activeProgress: state.activeProgress,
      reason
    });

    publishAll();
    return getActiveGateState();
  }

  function getHeldResponse(firstFailedCoordinate, reason = "held", extra = {}) {
    state.firstFailedCoordinate = firstFailedCoordinate;
    state.recommendedNextOwner = extra.recommendedNextOwner || state.activeCardinal || "NORTH";
    state.recommendedNextFile = extra.recommendedNextFile || state.activeFileGate || PRIMARY_GATES.north;
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
      activeGear: state.activeGear,
      activeFileGate: state.activeFileGate,
      activeProgress: state.activeProgress,
      pageResponsive: true,
      hardBlock: false,
      ...clonePlain(extra)
    };

    record("held", "PRIMARY_GATE_HELD", response);
    publishAll();

    return response;
  }

  function getArchiveResponse(reason = "archived", extra = {}) {
    const response = {
      accepted: false,
      action: CHECKPOINT_EVENT_ACTIONS.ARCHIVE,
      reason,
      activeStageId: state.activeStageId,
      activeGear: state.activeGear,
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
    state.firstFailedCoordinate = firstFailedCoordinate;
    state.recommendedNextOwner = extra.recommendedNextOwner || state.activeCardinal || "NORTH";
    state.recommendedNextFile = extra.recommendedNextFile || state.activeFileGate || PRIMARY_GATES.north;
    state.recommendedNextRenewalTarget = extra.recommendedNextRenewalTarget || state.recommendedNextFile;
    state.postgameStatus = firstFailedCoordinate;

    if (!state.blockedStages.includes(state.activeStageId)) state.blockedStages.push(state.activeStageId);

    const response = {
      accepted: false,
      action: CHECKPOINT_EVENT_ACTIONS.BLOCK,
      reason,
      firstFailedCoordinate,
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      activeStageId: state.activeStageId,
      activeGear: state.activeGear,
      activeFileGate: state.activeFileGate,
      activeProgress: state.activeProgress,
      pageResponsive: true,
      hardBlock: true,
      ...clonePlain(extra)
    };

    record("block", "PRIMARY_GATE_BLOCKED", response);
    publishAll();

    return response;
  }

  function acceptEastPrimaryGate(packet = {}) {
    const input = normalizePayload(packet);

    if (!isPrimaryGatePacket(input, "EAST")) {
      return getHeldResponse("WAITING_EAST_PRIMARY_GATE_FILE", "east-primary-file-gate-required", {
        gapClass: GAP_CLASS.PRIMARY_GATE_FILE_MISMATCH,
        receivedFile: packetFile(input),
        recommendedNextOwner: "EAST",
        recommendedNextFile: PRIMARY_GATES.east,
        recommendedNextRenewalTarget: PRIMARY_GATES.east
      });
    }

    const eventOk = hasEvent(input, PRIMARY_EVENTS.EAST) || getAnyBool(input, ["eastPrimaryReady", "gateAlignmentReady", "newsFibonacciAligned"], false);
    const alignmentOk = getAnyBool(input, ["newsProtocolSynchronized", "fibonacciSynchronizationActive", "newsFibonacciAligned", "gateAlignmentReady"], false);

    if (!eventOk) {
      return getHeldResponse("WAITING_EAST_PRIMARY_GATE_RECEIPT", "east-primary-receipt-missing", {
        recommendedNextOwner: "EAST",
        recommendedNextFile: PRIMARY_GATES.east,
        recommendedNextRenewalTarget: PRIMARY_GATES.east
      });
    }

    state.eastPrimaryReceived = true;
    state.eastPrimaryAccepted = true;
    state.firstFailedCoordinate = "NONE_EAST_PRIMARY_GATE_ACCEPTED";
    state.recommendedNextOwner = "SOUTH";
    state.recommendedNextFile = PRIMARY_GATES.south;
    state.recommendedNextRenewalTarget = PRIMARY_GATES.south;
    state.postgameStatus = "WAITING_SOUTH_PRIMARY_GATE";

    if (!state.completedStages.includes("P1_NORTH_PRIMARY_DISTRIBUTOR")) {
      completeStage("P1_NORTH_PRIMARY_DISTRIBUTOR", { reason: "east-primary-gate-received" });
    }

    completeStage("P2_EAST_PRIMARY_GATE", {
      degraded: !alignmentOk,
      reason: "east-primary-gate-accepted"
    });

    const response = {
      accepted: true,
      action: alignmentOk ? CHECKPOINT_EVENT_ACTIONS.ADMIT : CHECKPOINT_EVENT_ACTIONS.DEGRADED_FORWARD,
      stageAccepted: "P2_EAST_PRIMARY_GATE",
      event: eventName(input) || "EAST_PRIMARY_GATE_READY",
      alignmentOk,
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      activeStageId: state.activeStageId,
      activeFileGate: state.activeFileGate,
      pageResponsive: true,
      hardBlock: false
    };

    record("admit", "EAST_PRIMARY_GATE_ACCEPTED", response);
    publishAll();

    return response;
  }

  function acceptSouthPrimaryGate(packet = {}) {
    const input = normalizePayload(packet);

    if (!isPrimaryGatePacket(input, "SOUTH")) {
      return getHeldResponse("WAITING_SOUTH_PRIMARY_GATE_FILE", "south-primary-file-gate-required", {
        gapClass: GAP_CLASS.PRIMARY_GATE_FILE_MISMATCH,
        receivedFile: packetFile(input),
        recommendedNextOwner: "SOUTH",
        recommendedNextFile: PRIMARY_GATES.south,
        recommendedNextRenewalTarget: PRIMARY_GATES.south
      });
    }

    const eventOk = hasEvent(input, PRIMARY_EVENTS.SOUTH) || getAnyBool(input, ["southPrimaryReady", "outputSpreadReady", "releasePacketReady"], false);
    const releasePacketOk = getAnyBool(input, ["releasePacketReady", "outputSpreadReady", "southPrimaryReady"], false);

    if (!eventOk) {
      return getHeldResponse("WAITING_SOUTH_PRIMARY_GATE_RECEIPT", "south-primary-receipt-missing", {
        recommendedNextOwner: "SOUTH",
        recommendedNextFile: PRIMARY_GATES.south,
        recommendedNextRenewalTarget: PRIMARY_GATES.south
      });
    }

    state.southPrimaryReceived = true;
    state.southPrimaryAccepted = true;
    state.firstFailedCoordinate = "NONE_SOUTH_PRIMARY_GATE_ACCEPTED";
    state.recommendedNextOwner = "WEST";
    state.recommendedNextFile = PRIMARY_GATES.west;
    state.recommendedNextRenewalTarget = PRIMARY_GATES.west;
    state.postgameStatus = "WAITING_WEST_PRIMARY_GATE";

    completeStage("P3_SOUTH_PRIMARY_GATE", {
      degraded: !releasePacketOk,
      reason: "south-primary-gate-accepted"
    });

    const response = {
      accepted: true,
      action: releasePacketOk ? CHECKPOINT_EVENT_ACTIONS.ADMIT : CHECKPOINT_EVENT_ACTIONS.DEGRADED_FORWARD,
      stageAccepted: "P3_SOUTH_PRIMARY_GATE",
      event: eventName(input) || "SOUTH_PRIMARY_GATE_READY",
      releasePacketOk,
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      activeStageId: state.activeStageId,
      activeFileGate: state.activeFileGate,
      pageResponsive: true,
      hardBlock: false
    };

    record("admit", "SOUTH_PRIMARY_GATE_ACCEPTED", response);
    publishAll();

    return response;
  }

  function acceptWestPrimaryGate(packet = {}) {
    const input = normalizePayload(packet);

    if (!isPrimaryGatePacket(input, "WEST")) {
      return getHeldResponse("WAITING_WEST_PRIMARY_GATE_FILE", "west-primary-file-gate-required", {
        gapClass: GAP_CLASS.PRIMARY_GATE_FILE_MISMATCH,
        receivedFile: packetFile(input),
        recommendedNextOwner: "WEST",
        recommendedNextFile: PRIMARY_GATES.west,
        recommendedNextRenewalTarget: PRIMARY_GATES.west
      });
    }

    const eventOk = hasEvent(input, PRIMARY_EVENTS.WEST) || getAnyBool(input, ["westPrimaryReady", "auditPassed", "admissibilityReady"], false);
    const auditOk = getAnyBool(input, ["auditPassed", "admissibilityReady", "westPrimaryReady"], false);

    if (!eventOk) {
      return getHeldResponse("WAITING_WEST_PRIMARY_GATE_RECEIPT", "west-primary-receipt-missing", {
        recommendedNextOwner: "WEST",
        recommendedNextFile: PRIMARY_GATES.west,
        recommendedNextRenewalTarget: PRIMARY_GATES.west
      });
    }

    state.westPrimaryReceived = true;
    state.westPrimaryAccepted = true;
    state.firstFailedCoordinate = "NONE_WEST_PRIMARY_GATE_ACCEPTED";
    state.recommendedNextOwner = "NORTH";
    state.recommendedNextFile = PRIMARY_GATES.north;
    state.recommendedNextRenewalTarget = PRIMARY_GATES.north;
    state.postgameStatus = "WAITING_NORTH_RETURN_LATCH";

    completeStage("P4_WEST_PRIMARY_GATE", {
      degraded: !auditOk,
      reason: "west-primary-gate-accepted"
    });

    const response = {
      accepted: true,
      action: auditOk ? CHECKPOINT_EVENT_ACTIONS.ADMIT : CHECKPOINT_EVENT_ACTIONS.DEGRADED_FORWARD,
      stageAccepted: "P4_WEST_PRIMARY_GATE",
      event: eventName(input) || "WEST_PRIMARY_GATE_READY",
      auditOk,
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      activeStageId: state.activeStageId,
      activeFileGate: state.activeFileGate,
      pageResponsive: true,
      hardBlock: false
    };

    record("admit", "WEST_PRIMARY_GATE_ACCEPTED", response);
    publishAll();

    return response;
  }

  function primaryCycleComplete() {
    return Boolean(
      state.completedStages.includes("P1_NORTH_PRIMARY_DISTRIBUTOR") &&
      state.eastPrimaryAccepted &&
      state.southPrimaryAccepted &&
      state.westPrimaryAccepted &&
      state.completedStages.includes("P2_EAST_PRIMARY_GATE") &&
      state.completedStages.includes("P3_SOUTH_PRIMARY_GATE") &&
      state.completedStages.includes("P4_WEST_PRIMARY_GATE")
    );
  }

  function validateF21Eligibility(packet = {}) {
    const input = normalizePayload(packet);

    const explicitEligibility = Boolean(
      hasEvent(input, PRIMARY_EVENTS.F21) ||
      getAnyBool(input, ["f21EligibleForNorth", "f21EligibilitySubmittedToNorth", "primaryGateCycleEligible"], false)
    );

    const primaryCycleOk = primaryCycleComplete();

    const downstreamCanvasOk = Boolean(
      getAnyBool(input, ["visiblePlanetProofValid", "visibleContentProof", "visibleContentStrictProof"], false) ||
      getAnyBool(input, ["visibleContentSoftGap", "visibleForwardProgress", "visibleContentAdmissible"], false)
    );

    const noHardFail = !getAnyBool(input, ["visibleContentHardFail"], false);

    const full = Boolean(explicitEligibility && primaryCycleOk && downstreamCanvasOk && noHardFail && getAnyBool(input, ["visibleContentStrictProof", "visibleContentProof"], false));
    const degraded = Boolean(explicitEligibility && primaryCycleOk && downstreamCanvasOk && noHardFail && !full);
    const ok = full || degraded;

    let firstFailedCoordinate = "NONE_F21_FULL_ELIGIBLE";
    if (!explicitEligibility) firstFailedCoordinate = "WAITING_F21_PRIMARY_ELIGIBILITY_SUBMISSION";
    else if (!primaryCycleOk) firstFailedCoordinate = "WAITING_PRIMARY_GATE_CYCLE";
    else if (!downstreamCanvasOk) firstFailedCoordinate = "WAITING_DOWNSTREAM_VISIBLE_PROOF";
    else if (!noHardFail) firstFailedCoordinate = "VISIBLE_CONTENT_HARD_FAIL";

    return {
      ok,
      full,
      degraded,
      missing: [
        explicitEligibility ? "" : "explicitEligibility",
        primaryCycleOk ? "" : "primaryCycleComplete",
        downstreamCanvasOk ? "" : "downstreamVisibleProof",
        noHardFail ? "" : "noHardFail"
      ].filter(Boolean),
      evidence: {
        explicitEligibility,
        primaryCycleOk,
        downstreamCanvasOk,
        noHardFail,
        eastPrimaryAccepted: state.eastPrimaryAccepted,
        southPrimaryAccepted: state.southPrimaryAccepted,
        westPrimaryAccepted: state.westPrimaryAccepted,
        event: eventName(input),
        file: packetFile(input)
      },
      firstFailedCoordinate,
      latchMode: full ? "FULL" : degraded ? "DEGRADED" : "WAITING",
      acceptedAt: ok ? nowIso() : ""
    };
  }

  function latchF21FromSouthEligibility(packet = {}, source = "latchF21FromSouthEligibility") {
    const validation = validateF21Eligibility(packet);

    state.f21EligibilityReceived = true;
    state.f21EligibilityValidation = validation;

    if (!validation.ok) {
      state.f21EligibilityRejected = true;
      state.f21EligibilityAccepted = false;
      state.f21LatchMode = "WAITING";

      const target = validation.firstFailedCoordinate === "WAITING_PRIMARY_GATE_CYCLE"
        ? nextPrimaryTarget()
        : DOWNSTREAM_GATES.canvas;

      return getHeldResponse(validation.firstFailedCoordinate, "north-primary-f21-eligibility-held", {
        source,
        validation,
        recommendedNextOwner: validation.firstFailedCoordinate === "WAITING_PRIMARY_GATE_CYCLE" ? nextPrimaryOwner() : "DOWNSTREAM",
        recommendedNextFile: target,
        recommendedNextRenewalTarget: target
      });
    }

    state.f21EligibilityAccepted = true;
    state.f21EligibilityRejected = false;
    state.f21LatchMode = validation.full ? "FULL" : "DEGRADED";
    state.completionLatched = true;
    state.finalCompletionLatched = true;
    state.degradedCompletionLatched = validation.degraded === true;
    state.northReturnValidated = true;
    state.downstreamReleaseAuthorized = true;

    state.firstFailedCoordinate = validation.full
      ? "NONE_F21_FULL_LATCHED_BY_NORTH_PRIMARY_DISTRIBUTOR"
      : "NONE_F21_DEGRADED_LATCHED_BY_NORTH_PRIMARY_DISTRIBUTOR";

    state.recommendedNextOwner = "DOWNSTREAM";
    state.recommendedNextFile = DOWNSTREAM_GATES.hearthIndex;
    state.recommendedNextRenewalTarget = DOWNSTREAM_GATES.hearthIndex;
    state.downstreamReleaseTarget = DOWNSTREAM_GATES.hearthIndex;
    state.postgameStatus = validation.full
      ? "PRIMARY_GATES_COMPLETE_DOWNSTREAM_RELEASE_AUTHORIZED"
      : "PRIMARY_GATES_DEGRADED_COMPLETE_DOWNSTREAM_RELEASE_AUTHORIZED";

    completeStage("P5_NORTH_RETURN_LATCH", {
      degraded: validation.degraded === true,
      reason: source
    });

    completeStage("P6_DOWNSTREAM_RELEASE", {
      degraded: validation.degraded === true,
      reason: "north-primary-gate-latch-authorized-downstream-release"
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
      downstreamReleaseAuthorized: true,
      downstreamReleaseTarget: state.downstreamReleaseTarget,
      validation,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };

    record("admit", "F21_LATCHED_BY_NORTH_PRIMARY_DISTRIBUTOR", response);
    publishAll();

    return response;
  }

  function nextPrimaryOwner() {
    if (!state.eastPrimaryAccepted) return "EAST";
    if (!state.southPrimaryAccepted) return "SOUTH";
    if (!state.westPrimaryAccepted) return "WEST";
    return "NORTH";
  }

  function nextPrimaryTarget() {
    if (!state.eastPrimaryAccepted) return PRIMARY_GATES.east;
    if (!state.southPrimaryAccepted) return PRIMARY_GATES.south;
    if (!state.westPrimaryAccepted) return PRIMARY_GATES.west;
    return PRIMARY_GATES.north;
  }

  function receivePrimaryGateEvent(packet = {}, source = "receiveEvent") {
    const input = normalizePayload(packet);

    if (hasEvent(input, PRIMARY_EVENTS.F21) || getAnyBool(input, ["f21EligibleForNorth", "primaryGateCycleEligible"], false)) {
      return latchF21FromSouthEligibility(input, source);
    }

    if (isPrimaryGatePacket(input, "WEST") || hasEvent(input, PRIMARY_EVENTS.WEST)) {
      return acceptWestPrimaryGate(input);
    }

    if (isPrimaryGatePacket(input, "SOUTH") || hasEvent(input, PRIMARY_EVENTS.SOUTH)) {
      return acceptSouthPrimaryGate(input);
    }

    if (isPrimaryGatePacket(input, "EAST") || hasEvent(input, PRIMARY_EVENTS.EAST)) {
      return acceptEastPrimaryGate(input);
    }

    if (isDownstreamPacket(input)) {
      return getHeldResponse("DOWNSTREAM_RELEASE_WAITING_PRIMARY_GATES", "downstream-event-received-before-primary-gate-closure", {
        gapClass: GAP_CLASS.DOWNSTREAM_HELD,
        source,
        event: eventName(input),
        receivedFile: packetFile(input),
        recommendedNextOwner: nextPrimaryOwner(),
        recommendedNextFile: nextPrimaryTarget(),
        recommendedNextRenewalTarget: nextPrimaryTarget()
      });
    }

    return getArchiveResponse(eventName(input) ? "unknown-primary-gate-event" : "missing-event-name", {
      source,
      event: eventName(input),
      receivedFile: packetFile(input)
    });
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

  function acceptEastPrimary(packet = {}) {
    return acceptEastPrimaryGate(packet);
  }

  function receiveEastPrimary(packet = {}) {
    return acceptEastPrimaryGate(packet);
  }

  function acceptSouthPrimary(packet = {}) {
    return acceptSouthPrimaryGate(packet);
  }

  function receiveSouthPrimary(packet = {}) {
    return acceptSouthPrimaryGate(packet);
  }

  function acceptWestPrimary(packet = {}) {
    return acceptWestPrimaryGate(packet);
  }

  function receiveWestPrimary(packet = {}) {
    return acceptWestPrimaryGate(packet);
  }

  function acceptEastHandoff(packet = {}) {
    return acceptEastPrimaryGate(packet);
  }

  function receiveEastHandoff(packet = {}) {
    return acceptEastPrimaryGate(packet);
  }

  function acceptSouthSpread(packet = {}) {
    return acceptSouthPrimaryGate(packet);
  }

  function acceptWestHandoff(packet = {}) {
    return acceptWestPrimaryGate(packet);
  }

  function receiveWestHandoff(packet = {}) {
    return acceptWestPrimaryGate(packet);
  }

  function acceptWestIntake(packet = {}) {
    return acceptWestPrimaryGate(packet);
  }

  function receiveWestIntake(packet = {}) {
    return acceptWestPrimaryGate(packet);
  }

  function acceptCheckpointEvent(packet = {}) {
    return receivePrimaryGateEvent(packet, "acceptCheckpointEvent");
  }

  function receiveCheckpointEvent(packet = {}) {
    return receivePrimaryGateEvent(packet, "receiveCheckpointEvent");
  }

  function submitEvent(packet = {}) {
    return receivePrimaryGateEvent(packet, "submitEvent");
  }

  function submit(packet = {}) {
    return submitEvent(packet);
  }

  function receiveEvent(packet = {}) {
    return receivePrimaryGateEvent(packet, "receiveEvent");
  }

  function completeActive(packet = {}) {
    return submitEvent(packet);
  }

  function classifyCheckpointEvent(packet = {}) {
    const input = normalizePayload(packet);
    const name = eventName(input);

    if (hasEvent(input, PRIMARY_EVENTS.F21) || getAnyBool(input, ["f21EligibleForNorth", "primaryGateCycleEligible"], false)) {
      const validation = validateF21Eligibility(input);
      return {
        action: validation.ok ? CHECKPOINT_EVENT_ACTIONS.LATCH : CHECKPOINT_EVENT_ACTIONS.HELD,
        gapClass: validation.ok ? GAP_CLASS.NONE : GAP_CLASS.PRIMARY_GATE_WAIT,
        checkpointId: "F21_NORTH_PRIMARY_LATCH",
        event: name || "F21_PRIMARY_ELIGIBILITY_PACKET",
        validation,
        activeStageId: state.activeStageId,
        activeFileGate: state.activeFileGate
      };
    }

    if (isPrimaryGatePacket(input, "WEST") || hasEvent(input, PRIMARY_EVENTS.WEST)) {
      return {
        action: CHECKPOINT_EVENT_ACTIONS.ADMIT,
        gapClass: GAP_CLASS.NONE,
        checkpointId: "WEST_PRIMARY_GATE",
        event: name,
        activeStageId: state.activeStageId,
        activeFileGate: state.activeFileGate
      };
    }

    if (isPrimaryGatePacket(input, "SOUTH") || hasEvent(input, PRIMARY_EVENTS.SOUTH)) {
      return {
        action: CHECKPOINT_EVENT_ACTIONS.ADMIT,
        gapClass: GAP_CLASS.NONE,
        checkpointId: "SOUTH_PRIMARY_GATE",
        event: name,
        activeStageId: state.activeStageId,
        activeFileGate: state.activeFileGate
      };
    }

    if (isPrimaryGatePacket(input, "EAST") || hasEvent(input, PRIMARY_EVENTS.EAST)) {
      return {
        action: CHECKPOINT_EVENT_ACTIONS.ADMIT,
        gapClass: GAP_CLASS.NONE,
        checkpointId: "EAST_PRIMARY_GATE",
        event: name,
        activeStageId: state.activeStageId,
        activeFileGate: state.activeFileGate
      };
    }

    if (isDownstreamPacket(input)) {
      return {
        action: CHECKPOINT_EVENT_ACTIONS.HELD,
        gapClass: GAP_CLASS.DOWNSTREAM_HELD,
        checkpointId: "DOWNSTREAM_HELD_UNTIL_PRIMARY_GATES",
        event: name,
        activeStageId: state.activeStageId,
        activeFileGate: state.activeFileGate,
        recommendedNextFile: nextPrimaryTarget()
      };
    }

    return {
      action: CHECKPOINT_EVENT_ACTIONS.ARCHIVE,
      gapClass: GAP_CLASS.DUPLICATE_ARCHIVE,
      reason: name ? "unknown-primary-event-archived" : "missing-event-name",
      event: name,
      activeStageId: state.activeStageId,
      activeFileGate: state.activeFileGate
    };
  }

  function evaluateNewsGateState(snapshot = {}) {
    const input = normalizePayload(snapshot);

    const northGateReady = state.northPrimaryReady;
    const eastGateReady = state.eastPrimaryAccepted || getAnyBool(input, ["eastPrimaryReady"], false);
    const southGateReady = state.southPrimaryAccepted || getAnyBool(input, ["southPrimaryReady"], false);
    const westGateReady = state.westPrimaryAccepted || getAnyBool(input, ["westPrimaryReady"], false);
    const f21GateReady = state.completionLatched || getAnyBool(input, ["f21EligibleForNorth", "primaryGateCycleEligible"], false);
    const primaryGateCycleComplete = northGateReady && eastGateReady && southGateReady && westGateReady;

    return {
      northGateReady,
      eastGateReady,
      southGateReady,
      westGateReady,
      f21GateReady,
      primaryGateCycleComplete,
      newsGatePassedBeforeF21: primaryGateCycleComplete,
      newsGateDegradedBeforeF21: primaryGateCycleComplete || (northGateReady && eastGateReady && (southGateReady || westGateReady)),
      degradedForwardAvailable: !primaryGateCycleComplete && northGateReady && eastGateReady,
      downstreamReleaseAuthorized: state.downstreamReleaseAuthorized,
      completionLatched: state.completionLatched,
      f21LatchMode: state.f21LatchMode
    };
  }

  function getActiveGateState() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      activeStageId: state.activeStageId,
      activeGear: state.activeGear,
      activeCardinal: state.activeCardinal,
      activeFileGate: state.activeFileGate,
      activeFibonacci: state.activeFibonacci,
      activeNewsGate: state.activeNewsGate,
      activeProgress: state.activeProgress,
      primaryGateRegistryActive: true,
      primaryGateFilesLocked: true,
      oneActiveGearAtATime: true,
      updatedAt: nowIso()
    };
  }

  function createPrimaryGateRegistry() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      registryContract: "LAB_RUNTIME_TABLE_PRIMARY_GATE_REGISTRY_v1",
      registryReceipt: "LAB_RUNTIME_TABLE_PRIMARY_GATE_REGISTRY_RECEIPT_v1",
      authority: "north-primary-gate-registry",
      primaryGates: clonePlain(PRIMARY_GATES),
      downstreamGates: clonePlain(DOWNSTREAM_GATES),
      rotation: clonePlain(PRIMARY_ROTATION),
      language: clonePlain(NORTH_LANGUAGE),
      activeStageId: state.activeStageId,
      activeFileGate: state.activeFileGate,
      completedStages: state.completedStages.slice(),
      degradedStages: state.degradedStages.slice(),
      blockedStages: state.blockedStages.slice(),
      downstreamReleaseAuthorized: state.downstreamReleaseAuthorized,
      nextPrimaryOwner: nextPrimaryOwner(),
      nextPrimaryTarget: nextPrimaryTarget(),
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function createChronologicalFibonacciPlan() {
    return PRIMARY_ROTATION.map((stage, index) => ({
      id: stage.id,
      rank: index + 1,
      gear: stage.gear,
      cardinal: stage.cardinal,
      file: stage.file,
      fibonacci: stage.fibonacci,
      news: stage.news,
      label: stage.label,
      proof: stage.proof.slice(),
      complete: state.completedStages.includes(stage.id),
      degraded: state.degradedStages.includes(stage.id),
      status: state.completedStages.includes(stage.id) ? CHECKPOINT_STATUS.COMPLETE : CHECKPOINT_STATUS.PENDING
    }));
  }

  function createNewsFibonacciCheckpointPlan() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "north-primary-gate-news-fibonacci-plan",
      sequence: createChronologicalFibonacciPlan(),
      newsGates: clonePlain(NEWS_GATES),
      primaryGates: clonePlain(PRIMARY_GATES),
      downstreamGates: clonePlain(DOWNSTREAM_GATES),
      primaryGateRegistryActive: true,
      primaryGateFilesLocked: true,
      oneActiveGearAtATime: true,
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
      previousContract: PREVIOUS_CONTRACT,
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
        previousContract: PREVIOUS_CONTRACT,
        baselineContract: BASELINE_CONTRACT,
        version: VERSION,
        id: local.id,
        planetId: local.planetId,
        planetLabel: local.planetLabel,
        status: local.status,
        handoff: local.handoff,
        runtimeAllowed: local.runtimeAllowed,
        tableSet: local.tableSet,
        primaryGateRegistryActive: true,
        primaryGateFilesLocked: true,
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
      previousContract: PREVIOUS_CONTRACT,
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
          primaryGateRegistryActive: true,
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
        primaryGateRegistryActive: true,
        primaryGateFilesLocked: true,
        downstreamReleaseRequiresPrimaryClosure: true,
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
    const primaryCycleOk = primaryCycleComplete();

    const checkpoints = [
      {
        id: "PRIMARY_GATE_REGISTRY_CHECK",
        name: "Primary Gate Registry Check",
        status: COHERENCE_STATUS.PASS,
        observed: "Primary Runtime Table gate files are declared and locked.",
        nonBlocking: false,
        at: nowIso()
      },
      {
        id: "PRIMARY_GATE_CYCLE_CHECK",
        name: "Primary Gate Cycle Check",
        status: primaryCycleOk ? COHERENCE_STATUS.PASS : COHERENCE_STATUS.WARNING,
        observed: primaryCycleOk ? "Primary gate cycle complete." : "Primary gate cycle awaiting next primary file.",
        nonBlocking: true,
        value: {
          eastPrimaryAccepted: state.eastPrimaryAccepted,
          southPrimaryAccepted: state.southPrimaryAccepted,
          westPrimaryAccepted: state.westPrimaryAccepted
        },
        at: nowIso()
      },
      {
        id: "RECEIPT_VERIFICATION_CHECK",
        name: "Receipt Verification Check",
        status: input.runtimeTableLedger || input.ledger ? COHERENCE_STATUS.PASS : COHERENCE_STATUS.WARNING,
        observed: input.runtimeTableLedger || input.ledger ? "Runtime ledger present." : "Runtime ledger missing or not supplied.",
        nonBlocking: true,
        at: nowIso()
      },
      {
        id: "WIDE_PROBE_READINESS_CHECK",
        name: "Wide-Probe Readiness Check",
        status: wideProbeCount >= minWideProbe ? COHERENCE_STATUS.PASS : COHERENCE_STATUS.HELD_PENDING_WIDE_PROBE,
        observed: wideProbeCount >= minWideProbe ? "Wide probe ready." : "Wide probe held; first visible render remains valid.",
        nonBlocking: true,
        value: { wideProbeCount, minWideProbe },
        at: nowIso()
      },
      {
        id: "COHERENT_EXPRESSION_CHECK",
        name: "Coherent Expression Check",
        status: imageRendered ? COHERENCE_STATUS.WARNING : COHERENCE_STATUS.HELD_PENDING_WIDE_PROBE,
        observed: imageRendered ? "Image rendered; coherence proof remains separate." : "Image not rendered or not supplied.",
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

    const heldCheckpoints = checkpoints.filter((item) => item.status === COHERENCE_STATUS.HELD_PENDING_WIDE_PROBE);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "lab-triple-g-coherence-diagnostic-north-primary-gate-registry",
      goalProfileId: goalProfile.id,
      goalProfile: clonePlain(goalProfile),
      constructionReady: true,
      imageRendered,
      coherentExpressionPass: false,
      coherenceScore: failedCheckpoints.length ? 72 : primaryCycleOk ? 88 : imageRendered ? 84 : 78,
      coherenceStatus: failedCheckpoints.length ? COHERENCE_STATUS.FAIL : COHERENCE_STATUS.WARNING,
      checkpoints,
      failedCheckpoints: failedCheckpoints.map((item) => item.id),
      warningCheckpoints: checkpoints.filter((item) => item.status === COHERENCE_STATUS.WARNING).map((item) => item.id),
      heldCheckpoints: heldCheckpoints.map((item) => item.id),
      nextStrategy: [`Complete next primary gate: ${nextPrimaryTarget()}`],
      primaryGateRegistryActive: true,
      primaryGateFilesLocked: true,
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
          primaryGateRegistryActive: true,
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
      loadingOptimizationContract: "LAB_UNIVERSAL_PLANET_LOADING_OPTIMIZATION_PLAN_PRIMARY_GATE_v1",
      loadingOptimizationReceipt: "LAB_UNIVERSAL_PLANET_LOADING_OPTIMIZATION_PLAN_PRIMARY_GATE_RECEIPT_v1",
      authority: "north-primary-gate-loading-optimization",
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
      primaryGateRegistryActive: true,
      primaryGateFilesLocked: true,
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
      planContract: "LAB_UNIVERSAL_PLANET_PROCEDURAL_VISUAL_CARRIER_PLAN_PRIMARY_GATE_v1",
      planReceipt: "LAB_UNIVERSAL_PLANET_PROCEDURAL_VISUAL_CARRIER_PLAN_PRIMARY_GATE_RECEIPT_v1",
      authority: "north-primary-gate-visual-carrier-plan",
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
      atlasStartAuthorized: state.downstreamReleaseAuthorized,
      loadingOptimizationPlan,
      primaryGateRegistry: createPrimaryGateRegistry(),
      tripleGCheckpoints: diagnostic.checkpoints,
      failedCheckpoints: diagnostic.failedCheckpoints,
      warningCheckpoints: diagnostic.warningCheckpoints,
      heldCheckpoints: diagnostic.heldCheckpoints,
      coherenceScore: diagnostic.coherenceScore,
      coherenceStatus: diagnostic.coherenceStatus,
      primaryGateRegistryActive: true,
      primaryGateFilesLocked: true,
      downstreamReleaseAuthorized: state.downstreamReleaseAuthorized,
      childFailureDoesNotEraseVisualization: true,
      wideProbeBlocksFirstVisibleRender: false,
      singleAnchorIsLocalProofOnly: true,
      coherentExpressionEligible: true,
      coherentExpressionPass: false,
      visualPassClaimed: false,
      recommendedCheckpointSessionFactory: "createHearthTransmissionSession",
      firstFailedCoordinate: state.downstreamReleaseAuthorized ? "DOWNSTREAM_RELEASE_AUTHORIZED" : "WAITING_PRIMARY_GATE_CYCLE",
      recommendedNextRenewalTarget: state.downstreamReleaseAuthorized ? DOWNSTREAM_GATES.hearthIndex : nextPrimaryTarget(),
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

  function resetPrimaryGateRegistry(reason = "manual-reset") {
    state.activeStageId = PRIMARY_ROTATION[0].id;
    state.activeGear = PRIMARY_ROTATION[0].gear;
    state.activeCardinal = PRIMARY_ROTATION[0].cardinal;
    state.activeFileGate = PRIMARY_ROTATION[0].file;
    state.activeFibonacci = PRIMARY_ROTATION[0].fibonacci;
    state.activeNewsGate = PRIMARY_ROTATION[0].news;
    state.activeProgress = 0;

    state.completedStages = [];
    state.degradedStages = [];
    state.blockedStages = [];

    state.eastPrimaryReceived = false;
    state.eastPrimaryAccepted = false;
    state.southPrimaryReceived = false;
    state.southPrimaryAccepted = false;
    state.westPrimaryReceived = false;
    state.westPrimaryAccepted = false;
    state.northReturnValidated = false;
    state.downstreamReleaseAuthorized = false;
    state.downstreamReleaseTarget = "";

    state.f21EligibilityReceived = false;
    state.f21EligibilityAccepted = false;
    state.f21EligibilityRejected = false;
    state.f21EligibilityValidation = null;
    state.f21LatchMode = "WAITING";
    state.completionLatched = false;
    state.finalCompletionLatched = false;
    state.degradedCompletionLatched = false;

    state.firstFailedCoordinate = "WAITING_EAST_PRIMARY_GATE";
    state.recommendedNextOwner = "EAST";
    state.recommendedNextFile = PRIMARY_GATES.east;
    state.recommendedNextRenewalTarget = PRIMARY_GATES.east;
    state.postgameStatus = "PRIMARY_GATE_REGISTRY_READY";
    state.updatedAt = nowIso();

    refreshStageLedger();
    record("receipt", "PRIMARY_GATE_REGISTRY_RESET", { reason });
    publishAll();

    return getReceipt();
  }

  function createCheckpointSession(_sequenceInput = null, options = {}) {
    const sessionId = options.sessionId || options.id || "HEARTH-NORTH-PRIMARY-GATE-REGISTRY";

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      checkpointSessionContract: "LAB_RUNTIME_TABLE_NORTH_PRIMARY_GATE_SESSION_v1",
      checkpointSessionReceipt: "LAB_RUNTIME_TABLE_NORTH_PRIMARY_GATE_SESSION_RECEIPT_v1",
      sessionId,
      route: options.route || ROUTE,
      persistentNorthSession: true,
      primaryGateRegistryActive: true,
      primaryGateFilesLocked: true,

      acceptEastPrimary,
      receiveEastPrimary,
      acceptEastPrimaryGate,
      acceptEastHandoff,
      receiveEastHandoff,

      acceptSouthPrimary,
      receiveSouthPrimary,
      acceptSouthPrimaryGate,
      acceptSouthSpread,

      acceptWestPrimary,
      receiveWestPrimary,
      acceptWestPrimaryGate,
      acceptWestHandoff,
      receiveWestHandoff,
      acceptWestIntake,
      receiveWestIntake,

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

      getActiveCheckpoint: getActiveGateState,
      getCheckpointState: getReceipt,
      getNewsGateState: evaluateNewsGateState,
      createPrimaryGateRegistry,
      getReceipt,
      getReceiptText,
      reset: resetPrimaryGateRegistry,

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
    if (options && options.reset === true) resetPrimaryGateRegistry("createHearthTransmissionSession-reset");
    return transmissionSession;
  }

  const transmissionSession = {
    contract: CONTRACT,
    receipt: RECEIPT,
    sessionId: "HEARTH-NORTH-PRIMARY-GATE-REGISTRY",
    route: ROUTE,
    file: FILE,
    cardinalRole: "NORTH",

    acceptEastPrimary,
    receiveEastPrimary,
    acceptEastPrimaryGate,
    acceptEastHandoff,
    receiveEastHandoff,

    acceptSouthPrimary,
    receiveSouthPrimary,
    acceptSouthPrimaryGate,
    acceptSouthSpread,

    acceptWestPrimary,
    receiveWestPrimary,
    acceptWestPrimaryGate,
    acceptWestHandoff,
    receiveWestHandoff,
    acceptWestIntake,
    receiveWestIntake,

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
    getActiveGateState,
    createPrimaryGateRegistry,

    getTransmissionReceipt,
    getReceipt: getTransmissionReceipt,
    getReceiptText: getTransmissionReceiptText,
    getNorthCommandReceipt,
    reset: resetPrimaryGateRegistry,

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
      authority: "north-primary-gate-cardinal-receipt",
      primaryGateRegistryActive: true,
      primaryGateFilesLocked: true,
      northLoaded: true,
      eastPrimaryFileGate: PRIMARY_GATES.east,
      southPrimaryFileGate: PRIMARY_GATES.south,
      westPrimaryFileGate: PRIMARY_GATES.west,
      downstreamReleaseAuthorized: state.downstreamReleaseAuthorized,
      nextPrimaryOwner: nextPrimaryOwner(),
      nextPrimaryTarget: nextPrimaryTarget(),
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    refreshStageLedger();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      authority: "lab-runtime-table-north-primary-gate-registry-macro-distributor",
      destinationFile: FILE,
      file: FILE,
      route: ROUTE,
      status: "active",
      role: state.role,
      cardinalRole: "NORTH",

      primaryGateRegistryActive: true,
      primaryGateFilesLocked: true,
      fileGatesPrimary: true,
      downstreamReleaseHeldUntilPrimaryClosure: true,
      northMacroOnly: true,
      microTuningDelegatesDownstream: true,

      labEquipment: true,
      runtimeTable: true,
      tripleGDiagnostic: true,
      visualCarrierPlanAuthority: true,
      atlasStartPlanAuthority: true,
      coherentExpressionDiagnostic: true,
      loadingOptimizationAuthority: true,
      wideProbeDiagnosticAuthority: true,
      universalPlanetStandard: true,

      primaryGates: clonePlain(PRIMARY_GATES),
      downstreamGates: clonePlain(DOWNSTREAM_GATES),
      fileGates: clonePlain(FILE_GATES),
      northLanguage: clonePlain(NORTH_LANGUAGE),
      primaryRotation: clonePlain(PRIMARY_ROTATION),
      stageLedger: clonePlain(state.stageLedger),

      activeStageId: state.activeStageId,
      activeGear: state.activeGear,
      activeCardinal: state.activeCardinal,
      activeFileGate: state.activeFileGate,
      activeFibonacci: state.activeFibonacci,
      activeNewsGate: state.activeNewsGate,
      activeProgress: state.activeProgress,

      completedStages: state.completedStages.slice(),
      degradedStages: state.degradedStages.slice(),
      blockedStages: state.blockedStages.slice(),

      northPrimaryReady: state.northPrimaryReady,
      eastPrimaryReceived: state.eastPrimaryReceived,
      eastPrimaryAccepted: state.eastPrimaryAccepted,
      southPrimaryReceived: state.southPrimaryReceived,
      southPrimaryAccepted: state.southPrimaryAccepted,
      westPrimaryReceived: state.westPrimaryReceived,
      westPrimaryAccepted: state.westPrimaryAccepted,
      primaryCycleComplete: primaryCycleComplete(),

      northReturnValidated: state.northReturnValidated,
      downstreamReleaseAuthorized: state.downstreamReleaseAuthorized,
      downstreamReleaseTarget: state.downstreamReleaseTarget,

      f21EligibilityReceived: state.f21EligibilityReceived,
      f21EligibilityAccepted: state.f21EligibilityAccepted,
      f21EligibilityRejected: state.f21EligibilityRejected,
      f21EligibilityValidation: clonePlain(state.f21EligibilityValidation),
      f21LatchMode: state.f21LatchMode,
      completionLatched: state.completionLatched,
      finalCompletionLatched: state.finalCompletionLatched,
      degradedCompletionLatched: state.degradedCompletionLatched,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,

      nextPrimaryOwner: nextPrimaryOwner(),
      nextPrimaryTarget: nextPrimaryTarget(),

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
        "evaluateNewsGateState",
        "bindCardinalBranches",
        "loadCardinalBranchScripts",
        "getCardinalReceipt",
        "createHearthTransmissionSession",
        "getHearthTransmissionSession",
        "getTransmissionReceipt",
        "getTransmissionReceiptText",
        "acceptEastPrimary",
        "receiveEastPrimary",
        "acceptEastPrimaryGate",
        "acceptSouthPrimary",
        "receiveSouthPrimary",
        "acceptSouthPrimaryGate",
        "acceptWestPrimary",
        "receiveWestPrimary",
        "acceptWestPrimaryGate",
        "acceptF21Eligibility",
        "receiveF21Eligibility",
        "submitF21Eligibility",
        "validateF21Eligibility",
        "latchF21FromSouthEligibility",
        "acceptCheckpointEvent",
        "receiveCheckpointEvent",
        "submitEvent",
        "receiveEvent",
        "createPrimaryGateRegistry"
      ],

      owns: [
        "primary-gate-registry",
        "primary-file-gate-map",
        "north-macro-distribution",
        "primary-rotation",
        "NEWS/Fibonacci primary synchronization",
        "active primary gear state",
        "F21 primary latch validation",
        "downstream release authorization"
      ],

      transmissionReceipt: {
        contract: CONTRACT,
        receipt: RECEIPT,
        file: FILE,
        route: ROUTE,
        activeStageId: state.activeStageId,
        activeGear: state.activeGear,
        activeFileGate: state.activeFileGate,
        activeProgress: state.activeProgress,
        primaryCycleComplete: primaryCycleComplete(),
        completionLatched: state.completionLatched,
        f21LatchMode: state.f21LatchMode,
        downstreamReleaseAuthorized: state.downstreamReleaseAuthorized,
        firstFailedCoordinate: state.firstFailedCoordinate,
        recommendedNextOwner: state.recommendedNextOwner,
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
      `- ${stage.id} :: ${stage.cardinal} :: file=${stage.file} :: complete=${stage.complete} :: degraded=${stage.degraded} :: active=${stage.active}`
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
      "LAB_RUNTIME_TABLE_NORTH_PRIMARY_GATE_REGISTRY_MACRO_DISTRIBUTOR_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `route=${r.route}`,
      `role=${r.role}`,
      `cardinalRole=${r.cardinalRole}`,
      "",
      `primaryGateRegistryActive=${r.primaryGateRegistryActive}`,
      `primaryGateFilesLocked=${r.primaryGateFilesLocked}`,
      `fileGatesPrimary=${r.fileGatesPrimary}`,
      `downstreamReleaseHeldUntilPrimaryClosure=${r.downstreamReleaseHeldUntilPrimaryClosure}`,
      `northMacroOnly=${r.northMacroOnly}`,
      `microTuningDelegatesDownstream=${r.microTuningDelegatesDownstream}`,
      "",
      `northPrimaryReady=${r.northPrimaryReady}`,
      `eastPrimaryAccepted=${r.eastPrimaryAccepted}`,
      `southPrimaryAccepted=${r.southPrimaryAccepted}`,
      `westPrimaryAccepted=${r.westPrimaryAccepted}`,
      `primaryCycleComplete=${r.primaryCycleComplete}`,
      "",
      `activeStageId=${r.activeStageId}`,
      `activeGear=${r.activeGear}`,
      `activeCardinal=${r.activeCardinal}`,
      `activeFileGate=${r.activeFileGate}`,
      `activeFibonacci=${r.activeFibonacci}`,
      `activeNewsGate=${r.activeNewsGate}`,
      `activeProgress=${r.activeProgress}`,
      "",
      "STAGE_LEDGER",
      stages,
      "",
      `f21EligibilityReceived=${r.f21EligibilityReceived}`,
      `f21EligibilityAccepted=${r.f21EligibilityAccepted}`,
      `f21EligibilityRejected=${r.f21EligibilityRejected}`,
      `f21LatchMode=${r.f21LatchMode}`,
      `completionLatched=${r.completionLatched}`,
      `finalCompletionLatched=${r.finalCompletionLatched}`,
      `degradedCompletionLatched=${r.degradedCompletionLatched}`,
      "",
      `downstreamReleaseAuthorized=${r.downstreamReleaseAuthorized}`,
      `downstreamReleaseTarget=${r.downstreamReleaseTarget}`,
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
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,

    STATUS,
    HANDOFF,
    COHERENCE_STATUS,
    CHECKPOINT_EVENT_ACTIONS,
    CHECKPOINT_STATUS,
    GAP_CLASS,
    NEWS_GATES,
    R_COORDINATES,
    V_COORDINATES,
    A_COORDINATES,
    C_COORDINATES,
    L_COORDINATES,
    FILE_GATES,
    PRIMARY_GATES,
    DOWNSTREAM_GATES,
    NORTH_LANGUAGE,
    PRIMARY_ROTATION,

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

    createPrimaryGateRegistry,
    getActiveGateState,
    setActiveStage,
    completeStage,
    updateActiveProgress,

    createHearthTransmissionSession,
    getHearthTransmissionSession,
    getTransmissionReceipt,
    getTransmissionReceiptText,
    getNorthCommandReceipt,

    acceptEastPrimary,
    receiveEastPrimary,
    acceptEastPrimaryGate,
    acceptEastHandoff,
    receiveEastHandoff,

    acceptSouthPrimary,
    receiveSouthPrimary,
    acceptSouthPrimaryGate,
    acceptSouthSpread,

    acceptWestPrimary,
    receiveWestPrimary,
    acceptWestPrimaryGate,
    acceptWestHandoff,
    receiveWestHandoff,
    acceptWestIntake,
    receiveWestIntake,

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

    primaryGateRegistryActive: true,
    primaryGateFilesLocked: true,
    fileGatesPrimary: true,
    downstreamReleaseHeldUntilPrimaryClosure: true,
    northMacroOnly: true,
    microTuningDelegatesDownstream: true,
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
    get primaryCycleComplete() {
      return primaryCycleComplete();
    },
    get downstreamReleaseAuthorized() {
      return state.downstreamReleaseAuthorized;
    },
    get completionLatched() {
      return state.completionLatched;
    },
    get f21LatchMode() {
      return state.f21LatchMode;
    },
    get primaryGateState() {
      return state;
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
    dataset.primaryGateRegistryActive = "true";
    dataset.primaryGateFilesLocked = "true";
    dataset.fileGatesPrimary = "true";
    dataset.downstreamReleaseHeldUntilPrimaryClosure = "true";
    dataset.northMacroOnly = "true";
    dataset.microTuningDelegatesDownstream = "true";

    dataset.primaryNorthFileGate = PRIMARY_GATES.north;
    dataset.primaryEastFileGate = PRIMARY_GATES.east;
    dataset.primarySouthFileGate = PRIMARY_GATES.south;
    dataset.primaryWestFileGate = PRIMARY_GATES.west;

    dataset.activeStageId = state.activeStageId;
    dataset.activeGear = state.activeGear;
    dataset.activeCardinal = state.activeCardinal;
    dataset.activeFileGate = state.activeFileGate;
    dataset.activeFibonacci = state.activeFibonacci;
    dataset.activeNewsGate = state.activeNewsGate;
    dataset.activeProgress = String(state.activeProgress);

    dataset.eastPrimaryAccepted = String(state.eastPrimaryAccepted);
    dataset.southPrimaryAccepted = String(state.southPrimaryAccepted);
    dataset.westPrimaryAccepted = String(state.westPrimaryAccepted);
    dataset.primaryCycleComplete = String(primaryCycleComplete());

    dataset.f21EligibilityReceived = String(state.f21EligibilityReceived);
    dataset.f21EligibilityAccepted = String(state.f21EligibilityAccepted);
    dataset.f21EligibilityRejected = String(state.f21EligibilityRejected);
    dataset.f21LatchMode = state.f21LatchMode;
    dataset.completionLatched = String(state.completionLatched);
    dataset.finalCompletionLatched = String(state.finalCompletionLatched);
    dataset.degradedCompletionLatched = String(state.degradedCompletionLatched);

    dataset.downstreamReleaseAuthorized = String(state.downstreamReleaseAuthorized);
    dataset.downstreamReleaseTarget = state.downstreamReleaseTarget;

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
    root.DEXTER_LAB.northPrimaryGateRegistry = api;
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
    root.LAB_RUNTIME_TABLE_PRIMARY_GATE_REGISTRY = api;
    root.LAB_RUNTIME_TABLE_NORTH_PRIMARY_GATE_REGISTRY = api;

    root.HEARTH_NORTH_COMMAND_RUNTIME_TABLE = api;
    root.HEARTH_NORTH_COMMAND_TABLE = api;
    root.HEARTH_NORTH_COMMAND = api;
    root.HEARTH_LOCAL_COMMAND_RUNTIME_TABLE = api;
    root.HEARTH.northCommandRuntimeTable = api;
    root.HEARTH.northPrimaryGateRegistry = api;
    root.HEARTH.primaryGateRegistry = api;

    root.HEARTH_CHECKPOINT_SESSION = transmissionSession;
    root.HEARTH_RUNTIME_CHECKPOINT_SESSION = transmissionSession;
    root.LAB_HEARTH_CHECKPOINT_SESSION = transmissionSession;
    root.LAB_CHECKPOINT_SESSION = transmissionSession;

    root.HEARTH_NORTH_TRANSMISSION_SESSION = transmissionSession;
    root.HEARTH_NORTH_PRIMARY_GATE_SESSION = transmissionSession;
    root.HEARTH_NORTH_COMMAND_RUNTIME_TABLE_RECEIPT = getTransmissionReceipt();
    root.HEARTH_NORTH_CYCLICAL_CHECKPOINT_RECEIPT = root.HEARTH_NORTH_COMMAND_RUNTIME_TABLE_RECEIPT;
    root.LAB_RUNTIME_TABLE_NORTH_TRANSMISSION_RECEIPT = root.HEARTH_NORTH_COMMAND_RUNTIME_TABLE_RECEIPT;
    root.LAB_RUNTIME_TABLE_NORTH_PRIMARY_GATE_RECEIPT = root.HEARTH_NORTH_COMMAND_RUNTIME_TABLE_RECEIPT;

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
